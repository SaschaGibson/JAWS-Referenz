; Copyright 1995-2021 Freedom Scientific, Inc.
; Braille file for Word configuration, versions 2016 and O365.

include "hjConst.jsh"
include "hjGlobal.jsh"
include "word.jsh"
include "office.jsh"
include "braille.jsh"
include "FSI_ML.jsh"
include "common.jsm"
include "MSOffice.jsm"
include "word.jsm"
include "MSAAConst.jsh"

import "word.jsd"
import "braille.jsd"
import "office.jsd"
import "WordFunc.jsd"
import "WordSettings.jsd"

CONST
; wdInlineShapes, inlineShape abrev to IS or some const names too long
	wdISEmbeddedOLEObject=1,
	wdISHorizontalLine=6,
	wdISLinkedOLEObject=2,
	wdISLinkedPicture=4,
	wdISLinkedPictureHorizontalLine=8,
	wdISOLEControlObject=5,
	wdISOWSAnchor=11,
	wdISPicture=3,
	wdISPictureBullet=9,
	wdISPictureHorizontalLine=7,
	wdISScriptAnchor=10,
;wd revision types:
	wdNoRevision=0,
	wdRevisionInsert=1,
	wdRevisionDelete=2

;Word uses structured components for table coordinates, column and row headers,
;not the GIBrlShowCoords and GIBrlTblHeader globals associated with the Quick Settings Option under braille for table titles.
;But, when zoom is set to row or column, we must know
;which braille structure components are on and in which order they are displayed.
;BrlZoomComponentsArray has three elements: BrlZoom_Coords, BrlZoom_RowHdr and BrlZoom_ColHdr.
;Each of these elements has an integer representing the structured braille position of the component.
;0 means the components is off.
;Note that for braille zoom to row or column, CellContent will always be shown,
;and is shown after any coordinates or header for the current cell,
;so its position in the braille structure is not tracked in the array.
const
	BrlZoom_Coords = 1,
	BrlZoom_RowHdr = 2,
	BrlZoom_ColHdr = 3
globals
	intArray BrlZoomComponentsArray

;Collections:
globals
collection c_WordFocus,;See members defined in word.jss
collection c_WordBrl
	; Stores values used for Outlook braille.
	;
	; Members are:
	; string class -- The class of the focus.
	; int ObjectType -- The result of calling GetObjectSubtypeCode().
	; int IsFormField -- The result of calling isFormField().
	; int InOptionsDialog -- Result of calling InOptionsDialog on the focus.
	; int DocumentPresentation -- Result of calling  WordDocumentPresentation().
	; int WindowCategory -- The result of calling getWindowCategory().

CONST
	scBrlTblColMark=" | "
GLOBALS
	int giHasAddressAutoComplete,
	string gstrDotPattern, ; store basic dot patterns in case of revision change.
	int giBrailleEntireCell


void function WordBrlInit()
;Because the OSM is not available, braille must use DOM when available:
if getJCFOption(OPT_BRL_USE_OSM) != 0
	; only reset if not 0, or Unknown Functions get thrown.
	SetJCFOption(OPT_BRL_USE_OSM,0)
EndIf
gstrDotPattern = BrailleGetCursorDots()
; Change the below to show the entire cell content rather than only the current line segment.
giBrailleEntireCell=FALSE
InitBrlTblZoomComponents()
if !c_WordBrl c_WordBrl = new collection endIf
endFunction

void Function AutoStartEvent()
; Do not add code to this function.
;Instead, add to WordBrlInit()
;as it will be called from the Word main AutoStartEvent.
EndFunction

void function AutoFinishEvent()
CollectionRemoveAll(c_WordBrl)
EndFunction

void function InitBrlTblZoomComponents()
var
	int i,
	int iNumOfComponents,
	string s,
	int iCoords,
	int iRowHdr,
	int iColHdr,
	string sTbl = IniReadString("CustomControl1","components",cscNull,"word.jbs")
if !BrlZoomComponentsArray
	BrlZoomComponentsArray = new IntArray[3]
EndIf
for i = 1 to 3 BrlZoomComponentsArray[0] = 0 EndFor
iNumOfComponents = StringSegmentCount(sTbl,",")
for i = 1 to iNumOfComponents
	s = StringSegment(sTbl,",",i)
	if s == "tblInfo"
		BrlZoomComponentsArray[BrlZoom_Coords] = i
	elif s == "tblRowHdr"
		BrlZoomComponentsArray[BrlZoom_RowHdr] = i
	elif s == "tblColHdr"
		BrlZoomComponentsArray[BrlZoom_ColHdr] = i
	EndIf
EndFor
EndFunction

void function UpdateWordBrl()
var handle hwnd = GetFocus()
c_WordBrl.class = GetWindowClass(hwnd)
c_WordBrl.ObjectType = GetObjectSubtypeCode()
c_WordBrl.IsFormField = IsFormField()
c_WordBrl.InOptionsDialog = InOptionsDialog(hWnd)
c_WordBrl.DocumentPresentation = WordDocumentPresentation()
c_WordBrl.WindowCategory = getWindowCategory()
EndFunction

string function getShadingColorValue()
return GetWindowName(FindDescendantWindow(GlobalFocusWindow,cId_ShadingColorName))
endFunction

int function BrailleCallbackObjectIdentify()
if IsTouchCursor()
	return GetTouchNavElementBrlSubtype()
EndIf
if	UserBufferIsActive()
|| inHjDialog()
	;let internal handle it:
	return wt_unknown
EndIf
UpdateWordBrl()
if c_WordBrl.InOptionsDialog
|| c_WordBrl.class == cwc_NetUIHwnd
	return BrailleCallbackObjectIdentify()
endIf
If stringContains(c_WordBrl.class, cwc_RichEdit)
	if GetNonVirtualRibbonState() == LowerRibbon_Active
		return Office::BrailleCallbackObjectIdentify()
	endIf
	return getObjectSubtypeCode() ; ensure we are tracking edits properly
endIf
var
	int nSelectionFlags,
	int nSelectionContext,
	string sOleClass,
	string sInlineShapeType
if c_WordBrl.class == wc_wordMainDocumentWindow
|| c_WordBrl.class == wcf3Server
	var int role = GetObjectRole(0)
	if role == ROLE_SYSTEM_GRAPHIC 
	|| c_WordBrl.ObjectType == WT_BITMAP
		return WT_CUSTOM_CONTROL_BASE + WD_WT_SHAPE
	EndIf
	if role != ROLE_SYSTEM_DOCUMENT 
		return 0; If focus is not on the document and the class is the document class, we are most likely on the comment pane. Let default handling be used.
	endIf

	nSelectionContext = GetSelectionContext()
	nSelectionFlags = GetSelectionContextFlags()
	if c_WordBrl.IsFormField
		;GetObjectSubtypeCode may return incorrect value if MSAA is not refreshed:
		c_WordBrl.ObjectType = GetObjectSubtypeCode()
	endIf
	sInlineShapeType = GetBrlInlineShapeTypeString()
	if sInlineShapeType
		return WT_CUSTOM_CONTROL_BASE + GetActiveInlineShapeOleType()
	elIf c_WordBrl.IsFormField
		;All forms are rendered in or outside of tables.
		if c_WordBrl.ObjectType == wt_checkbox
			return WD_WT_FRMCHK + WT_CUSTOM_CONTROL_BASE
		elif c_WordBrl.ObjectType == wt_comboBox
			return WD_WT_FRMMNU + WT_CUSTOM_CONTROL_BASE
		elif c_WordBrl.ObjectType == wt_edit
			return WD_WT_FRMEDIT + WT_CUSTOM_CONTROL_BASE
		EndIf
		return WD_WT_field + WT_CUSTOM_CONTROL_BASE
	;Use selection flags to check if in table as more efficient
	;Also solves a nasty problem where panning away from active line, sayLine reads line at Braille cursor rather than PCCursor because of unintended internal side effect during building of
	;structured data.
	elIf nSelectionContext &selCtxTables
		if GIBrlTBLZoom == ZOOM_TO_CUR_ROW_AND_COLTITLES then
			return wd_wt_coltitles_and_row+ WT_CUSTOM_CONTROL_BASE
		elif GIBrlTBLZoom == ZOOM_TO_CUR_AND_PRIOR_ROW then
			return wd_wt_prior_and_cur_row+ WT_CUSTOM_CONTROL_BASE
		else
			return WD_WT_TABLE + WT_CUSTOM_CONTROL_BASE
		endIf
	elif nSelectionContext & SelCtxBookmarks && nSelectionFlags & SelCtxBookmarks
		return 	WD_WT_bookmark + WT_CUSTOM_CONTROL_BASE
	elif StringLeft(GetObjectAutomationId (0),11)=="cardEditor_" then
		; automationID is not localized.
		return WT_EDIT;so the prompt gets Brailled for the comment edit.
	elif c_WordBrl.ObjectType ==wt_link
	|| c_WordBrl.ObjectType ==wt_bitmap
	|| c_WordBrl.ObjectType ==wt_document
	|| (c_WordBrl.ObjectType >=WT_HTML_HEADING1 && c_WordBrl.ObjectType <=WT_HTML_HEADING6)
		return c_WordBrl.ObjectType
	elIf !c_WordBrl.ObjectType
		; Should return unknown:
		return WT_UNKNOWN
	endIf
endIf
If StringContains(GetObjectName(), scBallon)
	return wd_wt_inf_balloon + WT_CUSTOM_CONTROL_BASE
EndIf
if OutlookIsActive()
&& c_WordBrl.WindowCategory != wCat_document
	If giHasAddressAutoComplete
		Return WT_MULTILINE_EDIT
	EndIf
EndIf
;for dialogs with embedded controls that don't Braille properly:
if dialogActive()
	if c_WordBrl.ObjectType
		if c_WordBrl.ObjectType == WT_STATIC
		&& GetObjectName(false, 3) == cwn_ShellFolderView
			return WT_ListBox
		endIf
		return c_WordBrl.ObjectType
	endIf
endIf
if c_WordBrl.ObjectType == WT_BITMAP 
&& c_WordBrl.class 
	return WT_BITMAP
endIf
return BrailleCallBackObjectIdentify()
endFunction

int function BrailleAddObjectTblInfo(int nType)
if !InTable() return false endIf
var int nCol, int nRow
GetCellCoordinates(nCol, nRow)
if IsVirtualPCCursor()
	BrailleTableObjects(nType, nCol, nRow)
	return true
EndIf
var
	int bBrlTableNumberDisplay = BrlTableNumberDisplay(),
	int iTableNestingLevel = getTableNestingLevel(),
	string strtblInfo
if bBrlTableNumberDisplay
	strTblInfo = FormatString(msgbrlTable, intToString(getTableIndex()))
else
	strTblInfo = msgBrlTbl
endIf
if iTableNestingLevel > 1
	strTblInfo = strTblInfo + formatString(msgBrlNesting, intToString(iTableNestingLevel))
endIf
if nRow != 0 ;row and column are 0 at end of cell marker
&& nCol != 0
	If GIBrlTBLZoom == ZOOM_TO_CURRENT_CELL
	|| c_WordBrl.DocumentPresentation == DocumentPresentationMode_ScreenLayout
		strTblInfo = strTblInfo + formatString(msgbrlTblCoords, intToString(nRow), intToString(nCol))
	elif c_WordBrl.DocumentPresentation == DocumentPresentationMode_SimpleLayout
		If GIBrlTBLZoom == ZOOM_TO_CURRENT_ROW
			strTblInfo = strTblInfo + formatString(cmsgRowCoordinate, intToString(nRow))
		ElIf GIBrlTBLZoom == ZOOM_TO_CURRENT_COL
			strTblInfo = strTblInfo + formatString(cmsgColumnCoordinate, intToString(nCol))
		endIf
	EndIf
endIf
if !StringIsBlank(strTblInfo)
	BrailleAddString(strTblInfo, 0, 0, 0)
endIf
return true
endFunction

int function BrailleAddObjectTblRowHdr(int nType)
If GIBrlTBLZoom != ZOOM_TO_CURRENT_CELL
	;Header is added as part of the column or row
	return true
elif c_WordBrl.DocumentPresentation
	return false
endIf
var	string sHdr = GetCachedRowHeaderText()
if sHdr
	brailleAddString(sHdr,0,0,0)
endIf
return true
endFunction

int function BrailleAddObjectTblColHdr(int nType)
If GIBrlTBLZoom != ZOOM_TO_CURRENT_CELL
	;Header is added as part of the column or row
	return true
elif c_WordBrl.DocumentPresentation
	return false
endIf
var	string sHdr = GetCachedColumnHeaderText()
if sHdr
	brailleAddString(sHdr,0,0,0)
EndIf
return true
endFunction

Void function BrailleColumn(optional int iCol, int iRow)
if IsVirtualPCCursor()
	BrailleColumn(iCol,iRow)
	return
EndIf
var
	string sText,
	string sCoords,
	string sHdr,
	int iRowCount
SaveCursor()
BrailleCursor()
if iRow > 1
	sText = sText+GetColumnText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,1,iRow-1)+cmsgTableCellTextSeparator
EndIf
;add data so far as a single segment
if sText
	BrailleAddString(sText,0,0,0)
EndIf
sText=cscNull
If BrlZoomComponentsArray[BrlZoom_Coords]
	sCoords = FormatString(cmsgRowCoordinate,iRow)
EndIf
If BrlZoomComponentsArray[BrlZoom_RowHdr]then
	sHdr = GetCachedRowHeaderText()
EndIf
if sHdr
&& sCoords
	if BrlZoomComponentsArray[BrlZoom_Coords] < BrlZoomComponentsArray[BrlZoom_RowHdr]
		sText = sCoords+cscSpace+sHdr
	else
		sText = sHdr+cscSpace+sCoords
	EndIf
elif sCoords
	sText = sCoords
elif sHdr
	sText = sHdr
EndIf
if sText
	BrailleAddString(sText,0,0,0)
	SetStructuredSegmentAlignmentToLastStringAdded(); Ensure we align to the coordinates or header just added.
EndIf
BrailleAddFocusCell()
iRowCount = GetTableRowCount()
if iRow < iRowCount
	sText = cmsgTablePostFocusCellTextSeparator
		+GetColumnText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,iRow+1,iRowCount)
else
	sText = cmsgTablePostFocusCellTextSeparator
EndIf
BrailleAddString(sText,0,0,0)
RestoreCursor()
EndFunction

Void function BrailleRow(optional int iCol, int iRow)
if IsVirtualPCCursor()
	BrailleRow(iCol,iRow)
	return
EndIf
var
	string sText,
	string sCoords,
	string sHdr,
	int iColCount
SaveCursor()
BrailleCursor()
if iCol > 1
	sText = sText+GetRowText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,1,iCol-1)+cmsgTableCellTextSeparator
EndIf
; add the data so far
if sText
	BrailleAddString(sText,0,0,0)
endIf
sText=cscNull
If BrlZoomComponentsArray[BrlZoom_Coords]
	sCoords = FormatString(cmsgColumnCoordinate,iCol)
EndIf
If BrlZoomComponentsArray[BrlZoom_ColHdr]then
	sHdr = GetCachedColumnHeaderText()
EndIf
if sHdr
&& sCoords
	if BrlZoomComponentsArray[BrlZoom_Coords] < BrlZoomComponentsArray[BrlZoom_ColHdr]
		sText = sCoords+cscSpace+sHdr
	else
		sText = sHdr+cscSpace+sCoords
	EndIf
elif sCoords
	sText = sCoords
elif sHdr
	sText = sHdr
EndIf
if sText
	BrailleAddString(sText,0,0,0)
	SetStructuredSegmentAlignmentToLastStringAdded(); Ensure that we align to the coordeinates we just added.
EndIf
BrailleAddFocusCell()
iColCount = GetCurrentRowColumnCount()
if iCol < iColCount
	sText = cmsgTablePostFocusCellTextSeparator
		+GetRowText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,iCol+1,iColCount)
else
	sText = cmsgTablePostFocusCellTextSeparator
EndIf
BrailleAddString(sText,0,0,0)
RestoreCursor()
EndFunction

Int function BrailleAppropriateCellData(int nSubType, int iCol, int iRow)
;Depends on Braille Zoom feature
;Override of default version to manage when the user sets the Braille to show to column or row.
if userBufferIsActive() || isVirtualPCCursor()
	return BrailleAppropriateCellData(nSubType, iCol, iRow)
endIf
If GIBrlTBLZoom == ZOOM_TO_CURRENT_CELL
|| c_WordBrl.DocumentPresentation
	Return FALSE
;The following is specifically for when the user sets the Braille to zoom out to current row and column.
ElIf GIBrlTBLZoom == ZOOM_TO_CURRENT_ROW
	BrailleRow(iCol,iRow)
ElIf GIBrlTBLZoom == ZOOM_TO_CURRENT_COL
	BrailleColumn(iCol,iRow)
EndIf
Return TRUE;No further processing.
EndFunction

int function BrailleAddObjectTblCellContent(int nType)
if !inTable() return false EndIf
var
	int nCellColumn = getActiveTableCellColumn(),
	int nCellRow = getActiveTableCellRow()
if BrailleAppropriateCellData(0, nCellColumn, nCellRow)
	return TRUE
endIf
var
	int nCellCount = GetCurrentRowColumnCount(),
	String sTextBefore,
	string sTextAfter
if !c_WordBrl.DocumentPresentation
	if !c_WordBrl.IsFormfield
		if GetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR)
		&& StringLength(GetLine()) < StringLength(GetCell())-1
			BrailleAddFocusLine()
		else
			brailleAddFocusCell()
		EndIf
	EndIf
Else
	if nCellColumn > 1
		Let sTextBefore = GetRowText(scBrlTblColMark,cscNull,cMsgBrlBlankCell,1,nCellColumn-1)
	endIf
	if nCellColumn < nCellCount
		sTextAfter = GetRowText(scBrlTblColMark, cscNull, cMsgBrlBlankCell, nCellColumn+1, nCellCount)
	endIf
	if stringLength(sTextBefore) 
		BrailleAddString(sTextBefore, 0,0,0)
	endIf
	if nCellColumn > 1
		BrailleAddString("|", 0,0,0) ; not the mark just the symbol as BraillAddString padds with the spacing.
	endIf
	BrailleAddFocusCell()
	if stringLength(sTextAfter)
		BrailleAddString("|", 0,0,0) ; not the mark just the symbol as BraillAddString padds with the spacing.
		BrailleAddString(sTextAfter, 0,0,0)
	endIf
EndIf
return true
endFunction

int function BrailleAddObjectAltText(int nType)
var	string sText = GetInlineShapeAlternativeText()
if sText
	BrailleAddString(sText, 0,0,0)
	return true
endIf
return false
endFunction

int function BrailleAddObjectShapeType(int nType)
var	string sText = GetBrlInlineShapeTypeString()
if sText
	BrailleAddString(sText, 0,0,0)
	return true
endIf
return false
endFunction

int function BrailleAddObjectShapeDimensions(int nType)
BrailleAddString(formatString(msgBrlPicDesc1,
	GetInlineShapeWidthInUnitsOfMeasure(),
	GetInlineShapeHeightInUnitsOfMeasure()),
	0,0,0)
return true
endFunction

int function BrailleAddObjectNoteType(int nType)
var
	int context = GetSelectionContext(),
	int flags = GetSelectionContextFlags()
if context & selCtxComments && flags & selCtxComments
	if getSelectionCommentText() != cscNull
		BrailleAddString(msgBrlComment1,0,0,0)
		return true
	endIf
elif context & selCtxFootnotes && flags & selCtxFootnotes
	BrailleAddString(msgBrlFootnote1, 0,0,0)
	return true
elif context & selCtxEndnotes && flags & selCtxEndnotes
	BrailleAddString(msgBrlEndnote1, 0,0,0)
	return true
endIf
return false
endFunction

int function BrailleAddObjectNoteText(int nType)
var
	int context = GetSelectionContext(),
	int flags = GetSelectionContextFlags()
if context & selCtxComments && flags & selCtxComments
	if getSelectionCommentText() != cscNull
		BrailleAddString(getSelectionCommentText(), 0,0,ATTRIB_HIGHLIGHT)
		return true
	endIf
elif context & selCtxFootnotes && flags & selCtxFootnotes
	if getSelectionFootnoteText() != cscNull
		BrailleAddString(getSelectionFootnoteText(), 0,0,ATTRIB_HIGHLIGHT)
		return true
	endIf
elif context & selCtxEndnotes && flags & selCtxEndnotes
	if getSelectionEndnoteText() != cscNull
		BrailleAddString(getSelectionEndnoteText(), 0,0,ATTRIB_HIGHLIGHT)
		return true
	endIf
EndIf
return false
endFunction

int function BrailleAddObjectNoteAuthor(int nType)
var
	int context = GetSelectionContext(),
	int flags = GetSelectionContextFlags()
if context & selCtxComments && flags & selCtxComments
	if getSelectionCommentAuthor() != cscNull
		BrailleAddString(getSelectionCommentAuthor(), 0,0,0)
		return true
	endIf
elIf context & selCtxFootnotes && flags & selCtxFootnotes
	if getSelectionFootnoteAuthor() != cscNull
		BrailleAddString(getSelectionFootnoteAuthor(), 0,0,0)
		return true
	endIf
elif context & selCtxEndnotes && flags & selCtxEndnotes
	if getSelectionEndnoteAuthor() != cscNull
		BrailleAddString(getSelectionEndnoteAuthor(), 0,0,0)
		return true
	endIf
EndIf
return false
endFunction

Int 	function BrailleAddObjectName(int nType)
if UserBufferIsActive() || IsVirtualPCCursor()
|| inHjDialog()
|| MenusActive()
|| IsTouchCursor()
	return BrailleAddObjectName(nType)
endIf
If nType == WT_LISTBOXITEM
&& c_WordBrl.class == "bosa_sdm_msword"
	BrailleAddString(getObjectName(0, 1), 0,0,0)
	return TRUE
endIf
if nType == WT_GRID
	return BrailleAddObjectName(nType)
endIf
if nType == WD_WT_bookmark + WT_CUSTOM_CONTROL_BASE
	BrailleAddString(GetActiveBookmarkName(),0,0,0)
	return true
endIf
if c_WordBrl.class == cwc_SysTreeView32
&& dialogActive()
	return BrailleAddObjectName(nType)
endIf
if c_WordFocus.HeaderForNewAddressListField != cscNull
	BrailleAddString (c_WordFocus.HeaderForNewAddressListField, 0, 0, 0)
	Return TRUE
endIf
var
	string sCtlName,
	string sRealName,
	handle hFocus,
	int iSubtype
hFocus = getFocus()
if c_WordBrl.class == wc_wordMainDocumentWindow
	if nType == wt_link
	|| (nType >= WT_HTML_HEADING1 && nType <= WT_HTML_HEADING6) then
		brailleAddFocusLine()	
		return true;
	endIf		
	If c_WordBrl.IsFormField
		sCtlName = GetObjectName()
		if getFormfieldF1Help() != cscNull
			sCtlName=sCtlName+cscSpace+getFormfieldF1Help()
		EndIf
		BrailleAddString(sCtlName,0,0,0)
		return true
	EndIf
	return BrailleAddObjectName(nType)
endIf
if stringContains(c_WordBrl.class, cwc_RichEdit)
	IF c_WordBrl.WindowCategory == WCAT_TASK_PANE
		BrailleAddString(getObjectName(SOURCE_CACHED_DATA), 0,0,0)
		return TRUE
	endIf
endIf
sRealName =getWindowName(GetRealWindow(hFocus))
iSubtype=getWindowSubtypeCode(hFocus)
if iSubtype == wt_tabControl
	if nType == wt_bitmap
	|| nType == wt_listboxItem
		BrailleAddString(getShadingColorValue(), 0,0,0)
		return true
	elif nType == wt_dialog
		BrailleAddString(GetObjectName(SOURCE_CACHED_DATA, 1),0,0,0)
		return true
	endIf
endIf
sCtlName = GetObjectName()
if c_WordBrl.WindowCategory == WCAT_SPELL_CHECKER
&& nType == wt_listboxItem
	return true
endIf
if nType == wt_lowerRibbon
	return brailleAddObjectName(nType)
endIf
if getObjectTypeCode() == wt_button
	if sCtlName==btnMoveUp
		sCtlName=msgBtnMoveUp1_L
	elif sCtlName==btnMoveDown
		sCtlName=msgBtnMoveDown1_L
	endIf
endIf
if stringIsBlank(sCtlName)
	sCtlName = getObjectName(SOURCE_CACHED_DATA)
endIf
if sCtlName != cscNull
	if nType == wt_Button
	if GetObjectName(SOURCE_CACHED_DATA, 1) == wn_SearchResultsList
			brailleAddString(GetObjectHelp() + cscSpace + sCtlName, getCursorCol(), getCursorRow(), getCharacterAttributes())
		return true
	endIf
		return BrailleAddObjectName(nType)	
	elIf nType == wt_checkbox
		;include position info for routing on checkboxes
		brailleAddString(sCtlName, getCursorCol(), getCursorRow(), getCharacterAttributes())
	ElIf nType == wt_menu
	|| nType == wt_ContextMenu
		brailleAddString(sCtlName, 0,0,0)
	Elif nType == wt_buttonMenu
		brailleAddString(GetObjectName(SOURCE_CACHED_DATA),0,0,0)
	Else
		;The logic in this entire if block should be refactored
		;to avoid having to make specific exceptions to this overly inclusive code.
		;The following if block is two exceptions, there may need to be more.
		if UserBufferIsActive()
		|| nType == wt_ListBoxItem
			return BrailleAddObjectName(nType)
		EndIf
		brailleAddString(sCtlName,0,0,0)
	endIf
	return true
endIf
return BrailleAddObjectName(nType)
endFunction

int function brailleAddObjectValue(int nType)
if UserBufferIsActive() || IsVirtualPCCursor()
|| inHjDialog()
|| MenusActive()
|| IsTouchCursor()
	return brailleAddObjectValue(nType)
endIf
if c_WordBrl.InOptionsDialog
|| c_WordBrl.class == cwc_NetUIHwnd
	return brailleAddObjectValue(nType)
endIf
if c_WordBrl.class == cwc_SysTreeView32
&& dialogActive()
	return BrailleAddObjectValue(nType)
endIf
if stringContains(c_WordBrl.class, cwc_RichEdit)
	if GetNonVirtualRibbonState() == LowerRibbon_Active
		return BrailleAddObjectValue(nType)
	endIf
	BrailleAddFocusLine()
	return TRUE
endIf
var
	handle hFocus = GetFocus(),
	string sRealName = getWindowName(getRealWindow(hFocus)),
	int iSubtype,
	string sCtlValue
if c_WordBrl.class == wc_wordMainDocumentWindow
	;for form fields, check first that field is active and relevant type is used from jbs,
	;then check object subtypecode to make sure we're up to date.
	;table code checking no longer necessary as forms outside of tables are getting missed.
	If c_WordBrl.IsFormField
	&& (nType == WD_WT_FRMMNU+ WT_CUSTOM_CONTROL_BASE
	|| nType == WD_WT_FRMEDIT + WT_CUSTOM_CONTROL_BASE)
		sCtlValue = GetObjectValue()
		if c_WordBrl.ObjectType == wt_edit
			BrailleAddFocusLine()
		elIf c_WordBrl.ObjectType == wt_comboBox
			BrailleAddString(GetObjectValue(), GetCursorCol(), GetCursorRow(), ATTRIB_HIGHLIGHT)
		elIf c_WordBrl.ObjectType == wt_checkbox
			BrailleAddString(GetObjectValue(), 0,0,0)
		EndIf
		return TRUE
	EndIf
	;bookmark value defaults to here:
	return BrailleAddObjectValue(nType)
EndIf
if !dialogActive()
	; handling of print tab view from ribbons...
	If nType == WT_COMBOBOX
		If c_WordBrl.class == cWc_NetUIHWND
			BrailleAddString(GetObjectValue(SOURCE_CACHED_DATA), GetCursorCol(), GetCursorRow(), 0)
			Return(TRUE)
		EndIf
	EndIf
	return BrailleAddObjectValue(nType)
endIf
iSubtype = GetWindowSubtypeCode(hFocus)
if nType == wt_combobox
	if GetObjectName() == scUnderlineStyle
		; handle the Brailling of the Underline Style combo box
		;BrailleAddString(GetSelectedUnderlineStyle(),0,0,0)
		return TRUE
	endIf
elif sRealName == wn_bordersAndShading
	if iSubtype == wt_tabControl
		if nType == wt_bitmap
		|| nType == wt_listboxItem
			return true
		elIf nType == wt_TabControl
			sCtlValue = GetWindowName(FindDescendantWindow(hFocus,cId_ShadingColorName))
			BrailleAddString(sCtlValue, 0,0,0)
			return TRUE
		endIf
	EndIf
;Fix "Tree View" shown as tree view item name
elif nType == WT_TREEVIEWITEM
|| ntype == WT_TREEVIEW
	BrailleAddFocusItem()
	return true
else
	return BrailleAddObjectValue(nType)
endIf
EndFunction

int function BrailleAddObjectDlgText(int nSubtypeCode)
if UserBufferIsActive() || inHjDialog() || MenusActive()
	return BrailleAddObjectDlgText(nSubtypeCode)
endIf
var
	handle hReal,
	string sRealName
hReal = getRealWindow(getFocus())
sRealName = getWindowName(hReal)
if StringContains(sRealName, wn_PageSetup)
	Return TRUE ;? Is there a good reason for not managing dialog text here? Duplication?
endIf
return BrailleAddObjectDlgText(nSubtypeCode)
endFunction

int function BrailleAddObjectType(int nSubtypeCode)
if UserBufferIsActive() || IsVirtualPCCursor()
|| inHjDialog()
|| MenusActive()
|| IsTouchCursor()
	return BrailleAddObjectType(nSubtypeCode)
endIf
if nSubTypeCode == WD_WT_FIELD + WT_CUSTOM_CONTROL_BASE
	BrailleAddString(getActiveFieldBrlTypeString(), 0,0,0)
	return true
EndIf
If StringContains(GetObjectName(), scBallon)
&& nSubtypeCode == wt_unknown
	return true
elIf nSubTypeCode == wt_listboxItem
&& c_WordBrl.WindowCategory == WCAT_SPELL_CHECKER
	BrailleAddString(BrailleGetSubtypeString(wt_listBox), 0,0,0)
	return TRUE
endIf
return BrailleAddObjectType(nSubtypeCode)
endFunction

Int function BrailleAddObjectFldName(int nType)
if nType == WD_WT_FIELD + WT_CUSTOM_CONTROL_BASE
	if !StringContains(getActiveFieldName(), scTocFld)
		BrailleAddString(getActiveFieldName(), 0,0,0)
		return true
	endIf
endIf
return false
endFunction

int function BrailleAddObjectFldType(int nType)
if nType == WD_WT_FIELD + WT_CUSTOM_CONTROL_BASE
	if ! StringContains(getActiveFieldName(), scTocFld)
		BrailleAddString(getActiveFieldBrlTypeString(), 0,0,0)
		return TRUE
	endIf
endIf
return FALSE
endFunction

Int	function BrailleAddObjectFldValue(int nType)
if nType == WD_WT_FIELD + WT_CUSTOM_CONTROL_BASE
	if ! StringContains(getActiveFieldName(), scTocFld)
		BrailleAddString(getActiveFieldName(), GetCursorCol(), GetCursorRow(), ATTRIB_HIGHLIGHT)
		return TRUE
	endIf
endIf
return FALSE
endFunction

int function BrailleBuildStatus()
;used to display information about revisions
if gbLockedKeyboard
	|| IsObjectNavigationActive()
	|| (getJCFOption(OPT_BRL_SHOW_TIME_IN_STATUS_CELLS)&scTmOn)
	return default::BrailleBuildStatus()
EndIf
var
	string smsg,
	int width=BrailleGetStatusCellCount()
var int onMathContent = IsActiveCursorOnMathContent()
if isPCCursor()
&& c_WordBrl.WindowCategory == wCat_document
	var int textAttributes=getCharacterAttributes()&~ATTRIB_EXTENDED
	if onMathContent
	|| RevisionDetection() &&(textAttributes&(ATTRIB_REVISED|ATTRIB_DELETION|ATTRIB_INSERTION))
		if textAttributes&ATTRIB_DELETION
			smsg=msgBrlDeletedRevisionStatusCells
		elif textAttributes&ATTRIB_INSERTION
			smsg=msgBrlInsertedRevisionStatusCells
		elif textAttributes&ATTRIB_REVISED
			smsg=msgBrlRevisionStatusCells
		endIf
		if onMathContent
			;override anything that came as a revision.
			smsg = msgBrlMathStatusCells
		endIf
		width=width-stringLength(smsg)
		sMsg=IntToPaddedString(GetCursorRow(), width) + sMsg
		BrailleSetStatusCells(smsg)
		Return TRUE
	elif textAttributes&ATTRIB_HAS_COMMENT
		smsg=msgBrlComment
		width=width-stringLength(smsg)
		sMsg=IntToPaddedString(GetCursorRow(), width) + sMsg
		BrailleSetStatusCells(smsg)
		return true
	elif getJCFOption(OPT_USE_STATUSCELLS_FOR_CONTROLTYPE)
		var int type=getObjectSubtypeCode()
		if (type!=wt_edit) then ; avoid doc type of edit.
			BrailleSetStatusCells(BrailleGetSubtypeString (type))
			return true;
		endIf
	endIf
Else
	Return BrailleBuildStatus()
EndIf
EndFunction

void function ChangeBrailleCursorDots(int bInRevision)
var
	int iPatternBits,
	string sRevisionDot
sRevisionDot = "8" ;bit for dot 7
if bInRevision
	BrailleSetCursorDots(sRevisionDot)
else
	BrailleSetCursorDots(gstrDotPattern)
EndIf
EndFunction

int function BrailleAddObjectOleName(int nType)
var	string sText = GetBrlObjectOleNameString()
if sText
	BrailleAddString(sText,0,0,0)
	return true
endIf
return false
endFunction

int function BrailleAddObjectOleValue(int nType)
var	string sText = GetBrlObjectOleValueString()
if sText
	brailleAddString(sText,getcursorCol(),getCursorRow(),getCharacterAttributes())
	return true
endIf
return false
endFunction

int function BrailleAddObjectOleType(int nType)
var	string sText = GetBrlObjectOleTypeString()
if sText
	BrailleAddString(sText,0,0,0)
	return true
endIf
return false
endFunction

int function BrailleAddObjectOleState(int nType)
var	string sText = GetBrlObjectOleStateString()
if sText
	BrailleAddString(sText,getCursorCol(),getCursorRow(),0)
	return true
endIf
return false
endFunction

int function BrailleAddObjectOlePosition(int nType)
var	string sText = GetBrlObjectOlePositionString()
if sText
	brailleAddString(sText,0,0,0)
	return true
endIf
return false
endFunction

int function BrailleAddValueStringForLowerRibbonItem(int nType)
if UsingShortNameOfMultiLevelListObject()
	BrailleAddString(cMsgContextHelpBRL,0,0,0)
	BrailleAddString(GetWord2003MultiLevelListObjectNameOfFocusObject(),GetCursorCol(),GetCursorRow(),0)
	brailleAddString(brailleGetSubtypeString(wt_grid), 0,0,0)
	return true
endIf
return BrailleAddValueStringForLowerRibbonItem(nType)
EndFunction

int function FSIWheelActionIsValidForBrailleStructure()
if c_WordBrl.WindowCategory == wCat_document
&& !c_WordBrl.IsFormfield
	return true
endIf
return !BrailleIsStructuredLine()
EndFunction

int function DoFSIWheelActionForSentence(int direction)
if c_WordBrl.WindowCategory == wCat_document
&& InTable()
	If direction == up
		if !GoToPriorCellInTable()
			StepOutOfTable(false)
			if StringIsBlank(GetLine())
				return !PriorSentence(INP_BrailleDisplay)
			endIf
		endIf
	Else
		if !GoToNextCellInTable()
			StepOutOfTable(true)
			if StringIsBlank(GetLine())
				return !NextSentence(INP_BrailleDisplay)
			endIf
		endIf
	EndIf
	return false
EndIf
var	int retVal = DoFSIWheelActionForSentence(direction)
if c_WordBrl.WindowCategory == wCat_document
&& direction == up
&& OnEndOfCellOrRowMarker()
	;Prior Sentence landed in a table but not in the cell:
	retVal = !GoToPriorCellInTable()
endIf
return retVal
EndFunction

int function DoFSIWheelActionForParagraph(int direction)
if c_WordBrl.WindowCategory == wCat_document
&& InTable()
	If direction == up
		if !GoToPriorCellInTable()
			StepOutOfTable(false)
			if StringIsBlank(GetLine())
				return !PriorParagraph(INP_BrailleDisplay)
			endIf
		endIf
	Else
		if !GoToNextCellInTable()
			StepOutOfTable(true)
			if StringIsBlank(GetLine())
				return !NextParagraph(INP_BrailleDisplay)
			endIf
		endIf
	EndIf
	return false
EndIf
var int retVal = DoFSIWheelActionForParagraph(direction)
if c_WordBrl.WindowCategory == wCat_document
&& direction == up
&& OnEndOfCellOrRowMarker()
	;Prior paragraph landed in a table but not in the cell:
	retVal = !GoToPriorCellInTable()
endIf
return retVal
EndFunction

int function BrailleAddFocusCell()
; Choose between adding current line segment only, or entire cell content.
if giBrailleEntireCell || GetJCFOption(OPT_BRL_NAV_BY_PARA)
	return builtin::BrailleAddFocusCell()
else
	return BrailleAddFocusLine()
endIf
endFunction

void function DoBrailleRoutingClickAfterAction()
if IsPCCursor()
&& c_WordBrl.WindowCategory == wCat_document
	if IsSameScript()
	&& DescribeTextAnnotationOrAttributes(false)
		return 
	endIf
EndIf
DoBrailleRoutingClickAfterAction()
EndFunction

void function BrailleAddObjectColTitlesAndCurRow(int type)
if GIBrlTBLZoom != ZOOM_TO_CUR_ROW_AND_COLTITLES then return endIf
if !InTable() return false endIf

var int nCol, int nRow
GetCellCoordinates(nCol, nRow)
BrailleRowWithColTitles(nCol,nRow)
return true
endFunction

void function BrailleAddObjectPrevAndCurrentRow(int type)
if GIBrlTBLZoom != ZOOM_TO_CUR_AND_PRIOR_ROW then return endIf
if !InTable() return false endIf

var int nCol, int nRow
GetCellCoordinates(nCol, nRow)

BraillePriorAndCurRow(nCol,nRow)
return true
endFunction

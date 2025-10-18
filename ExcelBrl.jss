;Copyright 1995-2018 Freedom Scientific, Inc.
; Braille source file for Microsoft Excel versions later 2016 and O365.

Include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "office.jsh"
include "msoffice.jsm"
include "ExcelBraille.jsh"
include "Excel.jsh"
include "Excel.jsm"

import "excel.jsd"
import "excelFunc.jsd"
import "excelSettings.jsd" ; get lists text
import "office.jsd"
import "UIA.jsd"

const
	RowType = 1,
	ColumnType = 2,
	NoteCommentType = 3,
	ThreadedCommentType = 12

GLOBALS
	object UIAFocusElement,
; for formula bar UIA control
	int globalOnFormulaBarUIA,
;For row and column views, cache string and position, prevents frequent object model calls,
;caused by new more finely segmented structures to facilitate better panning alignment.
	int giBrlRowDataCurrentCellPosition,
	int giBrlColDataCurrentCellPosition,
	string gstrBrlRowData,
	string gstrBrlColData,
collection cXLActiveCell
	
int function ContractedBrailleInputAllowedNow ()
if onFormulaBarUIAEditItem () then return FALSE endIf
if getObjectSubtypeCode () == WT_EDIT
&& getWindowClass (getFirstChild (getFocus ())) == "EDTBX" then
	return FALSE
endIf
return ContractedBrailleInputAllowedNow ()
endFunction

void function BrailleRoutingButton (int cell)
if BrailleSplitModeSupportsSelection(cell) then
	builtin::BrailleRoutingButton(cell) ; Clear the selection in the buffered data.
	return
endIf

var int x = GetBrailleCellColumn (cell), int y = GetBrailleCellRow (cell)
if UserBufferIsActive ()
|| GetWindowCategory() != wCat_SpreadSheet 
|| GetObjectSubtypeCode () == WT_MULTILINE_EDIT
|| IsEditingNote()
|| globalOnFormulaBarUIA then
	return BrailleRoutingButton (cell)
endIf
;Prevents jump to desktop or other undesirable functionality:
If x > 1 && y > 1 then
; coordinates are on the active cell:
	TypeKey (cksF2)
	if F2TogglesBetweenEditModeAndPointMode() then
		Pause()
		UpdateStatusBarMode()
	EndIf
endIf
; do nothing, or results could be on the desktop.
endFunction

Int Function BrailleCallbackObjectIdentify()
var
	int onFormulaBarUIA,
	int ObjectSubtypecode,
	int nCol, int nRow, ;for cell coordinates
	int iCount,
	int nBrailleViewMode,
	string sClass,
	string strBeginSelection, string strEndSelection, ; for selected range addresses
	handle hwnd,
	string sRealName
globalOnFormulaBarUIA = FALSE
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
giBrlRowDataCurrentCellPosition = null()
giBrlColDataCurrentCellPosition = null()
gstrBrlRowData = null()
gstrBrlColData = null()
if gExcelBrlRefreshID then
	;This is set in the xlSheetSelectionChange function,
	;to ensure that braille refreshes for line mode and in Excel 2013 for structured mode.
	unscheduleFunction(gExcelBrlRefreshID)
	let gExcelBrlRefreshID=0
EndIf
let hwnd = GetFocus()
let sRealName = GetWindowName (GetRealWindow (hWnd))

if UserBufferIsActive () then
	return WT_UNKNOWN
endIf
if !inHJDialog()
&& dialogActive()
&& getWindowCategory() == WCAT_SDM
&& getObjectSubTypeCode(SOURCE_CACHED_DATA) == wt_listBoxItem
&& (StringContains (sRealName, wn_InsertFunction) || StringContains (sRealName, wn_diagramGallery) || StringContains (sRealName, wn_ChartType))
	return WT_CUSTOM_CONTROL_BASE + xl_wt_ListItemWithExtraHelp
Endif
if (inHjDialog ()
|| dialogActive () || IsVirtualRibbonActive() || menusActive ())
	return brailleCallbackObjectIdentify ()
endIf
if (RibbonsActive ())
	return office::BrailleCallbackObjectIdentify ()
endIf
ObjectSubtypeCode = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
sClass = getWindowClass (getFocus ())
onFormulaBarUIA = onFormulaBarUIAEditItem ()
globalOnFormulaBarUIA = OnFormulaBarUIA
if ObjectSubtypeCode == WT_BITMAP
&& OnSlicer()
	return xl_wt_Slicer + wt_custom_control_base
endIf
if IsEditingComment () then
	return xl_wt_CommentEdit + wt_custom_control_base
endIf
if IsEditingNote () then
	return xl_wt_NoteEdit + wt_custom_control_base
endIf
if IsSecondaryFocusActive ()
	return WT_EditCombo
endIf
if (ObjectSubtypeCode && ObjectSubtypeCode != WT_TABLECELL&& ObjectSubtypeCode != WT_Table
&& objectSubtypeCode != WT_COLUMNHEADER
&& !onFormulaBarUIA)
|| getWindowCategory () == WCAT_SINGLE_CLASS
	if getWindowClass (hwnd) != wcExcelColon then ; new versions change dropdown class
		return office::BrailleCallbackObjectIdentify ()
	endIf
endIf
if objectSubtypeCode == WT_COMBOBOX 
|| (objectSubtypeCode == WT_LISTBOXITEM &&getObjectSubtypeCode(SOURCE_CACHED_DATA, 1) == WT_COMBOBOX) then
; This will prevent us from showing combo boxes in new Excel as mnu when they drop down from a cell.
	return WT_COMBOBOX
endIf
GetActiveCellCoordinates (nRow, nCol)
GetSelectionAddressRange (strBeginSelection, strEndSelection)
nBrailleViewMode = BrlStructuredMode ()
if onFormulaBarUIA then
	return XL_WT_CELL_EDIT + WT_CUSTOM_CONTROL_BASE
elif (getWindowCategory (getFocus () == WCAT_SPREADSHEET)
&& GetActiveCellAddress ())
	If inTextBox()
	&& CaretVisible ()
		Return (WT_CUSTOM_CONTROL_BASE + xl_wt_textbox)
	EndIf
	iCount = GetSelectionCellCount ()
	if iCount <= 1 then
		if (nBrailleViewMode == XL_ROW_VIEW)
			gstrBrlRowData = GetBrlRowContextData (giBrlRowDataCurrentCellPosition)
			return XL_WT_ROW_VIEW + WT_CUSTOM_CONTROL_BASE
		elif (nBrailleViewMode == XL_COL_VIEW)
			gstrBrlColData = GetBrlColumnContextData (giBrlColDataCurrentCellPosition)
			return XL_WT_COL_VIEW + WT_CUSTOM_CONTROL_BASE
		elif (nBrailleViewMode == XL_ROW_WITH_COLTITLES_VIEW)
			gstrBrlRowData = GetBrlRowContextData (giBrlRowDataCurrentCellPosition)
			return xl_wt_row_with_coltitles + WT_CUSTOM_CONTROL_BASE
		elif (nBrailleViewMode == XL_PRIOR_AND_CUR_ROW_VIEW)
						gstrBrlRowData = GetBrlRowContextData (giBrlRowDataCurrentCellPosition)
			return xl_wt_prior_and_cur_row+ WT_CUSTOM_CONTROL_BASE

			
		else ; cell view
			return XL_WT_CELL + WT_CUSTOM_CONTROL_BASE
		endIf
	else
		if (isMergedCells ())
			return xl_wt_cell + WT_CUSTOM_CONTROL_BASE
		elIf (! isSelectionContiguous ())
			; multiple non-contiguous areas
			return XL_WT_AREA_SELECTION + WT_CUSTOM_CONTROL_BASE
		else
			return XL_WT_CELL_SELECTION + WT_CUSTOM_CONTROL_BASE
		endIf
	endIf
ElIf IsWindowVisible (ghExcelColon) 
|| GetWindowClass (GetFocus ()) == wcExcelColon then
	if objectSubtypeCode == WT_COMBOBOX then return WT_COMBOBOX endIf
	return xl_wt_dropdownList + wt_custom_control_base
elif GetWindowCategory (GetFocus()) == WCAT_SPREADSHEET
&& IsEditingComment () then
;on spreadsheet but no address for some reason?
	return xl_wt_CommentEdit + wt_custom_control_base
else
	return BrailleCallBackObjectIdentify ()
endIf
endFunction

int function brailleAddObjectcellType (int type)
var int cellSubtype = getCellSubtype ()
var int ignoreTranslation = TRUE
if cellSubtype == WT_COLUMNHEADER
|| cellSubtype == WT_ROWHEADER then
	BrailleAddString (BrailleGetSubtypeString (cellSubtype), 0,0, CTRL_NONE, ignoreTranslation)
	return TRUE
endIf
return FALSE
endFunction

int function BrailleAddObjectContextHelp(int SubtypeCode)
; for newer combo box drop-downs in cell:
; This component is not valid for in-cell drop-downs and must be removed:
if subtypeCode == WT_COMBOBOX && getWindowClass (getFocus ()) == wcExcelColon then return TRUE endIf
if SubtypeCode == XL_WT_DROPDOWNlIST + WT_CUSTOM_CONTROL_BASE then return TRUE endIf
return BrailleAddObjectContextHelp(SubtypeCode)
endFunction

int function BrailleAddObjectContainerName (int iType)
if iType == WT_GROUPBOX then
	;Per test, remove control group info from spell checker.
	if (getWindowCategory () == WCAT_SPELL_CHECKER )
		return TRUE
	endIf
endIf
return BrailleAddObjectContainerName (iType)
endFunction

int function BrailleAddObjectType (int iType)
if IsTouchCursor() then
	return BrailleAddObjectType (iType)
endIf
if iType == WT_GROUPBOX then
	;Per test, remove control group info from spell checker.
	if (getWindowCategory () == WCAT_SPELL_CHECKER )
		return TRUE
	endIf
elif iType == WT_LINK then
	BrailleAddString(BrailleGetSubtypeString(wt_link),0,0,0)
	return true
endIf
return BrailleAddObjectType (iType)
endFunction

;overrides for default controls specific to Office 2007 and highr:
int Function brailleAddObjectName(int nType)
if IsTouchCursor() then
	return BrailleAddObjectName(nType) ; let internal code handle
endIf
if menusActive () || IsVirtualRibbonActive () || RibbonsActive ()
	return BrailleAddObjectName(nType)
endIf
; for newer combo box drop-downs in cell:
; This component is not valid for in-cell drop-downs and must be removed:
if nType == WT_COMBOBOX && getWindowClass (getFocus ()) == wcExcelColon then return TRUE endIf
; for split buttons off the menus, we must include the split button
; type in structured Braille here so we do not lose the type as menu at the same time.
if nType==wt_menu
&& GetObjectSubtypeCode()==wt_splitButton then
	brailleAddString(GetObjectName(),0,0,0)
	BrailleAddString(GetObjectValue(SOURCE_CACHED_DATA),0,0,0)
	BrailleAddString(BrailleGetSubtypeString(wt_splitButton),0,0,0)
	return true
EndIf
; where menu drop downs are really split buttons, and we need the parent name:
if nType == WT_MENU then
	var string parentName = getObjectName(SOURCE_CACHED_DATA)
	if ! parentName then
		parentName = getObjectName(SOURCE_CACHED_DATA, 1)
		if ParentName then
			BrailleAddString (ParentName, 0,0,0)
			return TRUE
		endIf
	endIf
endIf
if nType==wt_SplitButton then
	brailleAddString(GetObjectName(),0,0,0)
	BrailleAddString(GetObjectValue(SOURCE_CACHED_DATA),0,0,0)
	return true
EndIf
If (GetWindowClass(GetFocus())==wc_MSOCommandBar && nType != wt_dialog)
|| GetMenuMode()>0 then
	if !nType == wt_listboxitem
		BrailleAddString(GetObjectName(SOURCE_CACHED_DATA),0,0,0)
		BrailleAddString(GetObjectValue(),0,0,0)
	Endif
	return true
endIf
if StringContains(GetWindowClass(getFocus()),wc_f3Server) then
	MSAARefresh ();So Refresh accurately reloads all cached data ; Why is this?
endIf
If getWindowCategory (getFocus () == WCAT_SPREADSHEET)
&& inTextBox()
&& CaretVisible ()
	Return TRUE
EndIf
if IsSecondaryFocusActive ()
&& nType == WT_EditCombo
&& !DialogActive()
	return true
endIf
return BrailleAddObjectName(nType)
EndFunction

int function BrailleAddObjectValue(int nType)
var string ObjectName
if IsTouchCursor() then
	return BrailleAddObjectValue(nType)
endIf
if nType == WT_COMBOBOX && getWindowClass (getFocus ()) == wcExcelColon then
; Combos that drop down from Excel don't always describe their value correctly.
; In this case, when a value was selected, and the combo is opened again, the combo wants to show no value.
;check name first as this rendering has changed:
	objectName = getObjectName(SOURCE_CACHED_DATA)
	if stringIsBlank (objectName) objectName = getObjectValue(SOURCE_CACHED_DATA) endIf
	BrailleAddString (objectName, getCursorCol (), getCursorRow (), 0)
	return TRUE
endIf
if nType == WT_EDIT
&& IsFocusInSDMSingleLineEdit () then
; font dialog control+shift+f
	objectName = getObjectValue () 
		if ! stringIsBlank (objectName) then
			BrailleAddString (ObjectName, GetCursorCol (), GetCursorRow (), ATTRIB_HIGHLIGHT)
			return TRUE
		endIf
endIf
if BrailleAddValueStringForLowerRibbonItem ( nType ) then return TRUE endIf
if IsWindowVisible(ghExcelColon) then
	ObjectName = GetObjectName(SOURCE_CACHED_DATA)
	if ghExcelColon == getFocus () && ! StringIsBlank (ObjectName) then
		BrailleAddString (ObjectName, 0,0,0)
	else
		BrailleAddString(GetWindowText(ghExcelColon,true),0,0,0)
	endIf
	return true
EndIf
if nType == wt_buttonMenu
|| GetWindowClass(GetFocus()) == wc_MSOCommandBar
|| GetMenuMode() > 0
	BrailleAddString(GetObjectValue(),0,0,0)
	return true
endIf
if getWindowClass (GetParent (GetParent (getFocus ()))) == wc_netUIHwnd
	if stringContains(GetWindowClass(GetFocus()), cwc_RichEdit)
	&& GetNonVirtualRibbonState() == LowerRibbon_Active
		return BrailleAddObjectValue(nType)
	endIf
	return FALSE ; bypass Office Ribbon code as these edits manage best by default internals.
endIf
If getWindowCategory (getFocus () == WCAT_SPREADSHEET)
&& inTextBox()
&& CaretVisible ()
	BrailleAddString (GetLine (), GetCursorCol (), GetCursorRow (), 0)
	Return (TRUE)
EndIf
return BrailleAddObjectValue(nType)
endFunction

int function BrailleAddObjectPosition(int nSubtypeCode)
if IsTouchCursor() then
	return BrailleAddObjectPosition(nSubtypeCode)
endIf
if StringContains(GetWindowClass(getFocus()),wc_f3Server) then
	;no position information should be rendered as even MSAA does not provide it accurately.
	return true
elif getWindowCategory() == WCAT_SDM && nSubTypeCode == WT_RADIOBUTTON then
	BrailleAddString (PositionInGroup(), 0,0,0)
	return TRUE
elif getWindowCategory() == WCAT_SDM && SDMGetControlSubtypeCode (getFocus(), SDMGetFocus (GetFocus())) == WT_EDITCOMBO then
	BrailleAddString (PositionInGroup(), 0,0,0)
	return TRUE
endIf
if IsSecondaryFocusActive ()
&& nSubtypeCode == WT_EditCombo
	BrailleAddString (PositionInGroupForSecondaryFocus (), 0,0,0)
	return true
endIf
return BrailleAddObjectPosition(nSubtypeCode)
endFunction
;End of overrides for default controls specific to Office 2007 and highr

int function BrailleAddObjectDescription(int nSubtypeCode)
if IsSecondaryFocusActive ()
&& nSubtypeCode == WT_EditCombo
	BrailleAddString (GetSecondaryFocusSelectionText (), GetCursorCol (), GetCursorRow (),ATTRIB_HIGHLIGHT)
	return true
endIf
return BrailleAddObjectPosition(nSubtypeCode)
endFunction

int function BrailleAddObjectCoordinates(int nType)
;Cell Coordinates
var
	string sMergedStart, string sMergedEnd
If (isMergedCells ())
	GetSelectionAddressRange (sMergedStart, sMergedEnd)
	brailleAddString(formatString (msgXThroughYBrlIndicator, sMergedStart, sMergedEnd),0,0,0)
Else
	BrailleAddString (getActiveCellAddress (),0,0,0)
EndIf
return true
endFunction

int function BrailleAddObjectLine(int nType)
var
	string sFormulaText
If IsEditingComment()  then
	BrailleAddField(true);
	return True
elIf IsEditingNote() 
	BrailleAddField(true)
	return True
elif StatusBarMode() == Excel_status_point
	sFormulaText = GetTextFromDocumentRange(FindFormulaBarElement())
	if (! stringIsBlank (sFormulaText))
		BrailleAddString (sFormulaText, 0,0,ATTRIB_HIGHLIGHT)
		Return
	elIf globalOnFormulaBarUIA then
		brailleAddString (getFocusUIAElementText (), 0,0,0)
		return TRUE
	endIf
elIf globalOnFormulaBarUIA then
	;brailleAddString (getFocusUIAElementText (), 0,0,0) ; doesn't make room for routing keys.
	BrailleAddFocusLine ()
	return TRUE
endIf
	BrailleAddFocusLine()
return true
endFunction

int function BrailleAddObjectColHdr(int nType)
var
	string sTitle
if (ShouldReadTitles ())
	sTitle = GetActiveCellColumnTitleText ()
	if (! stringIsBlank (sTitle))
		sTitle = StringReplaceSubStrings (sTitle, sc_amp, sc_ampersandChar)
		brailleAddString(sTitle, 0,0,0)
		return true
	endIf
endIf
return false
endFunction

int function BrailleAddObjectRowHdr(int nType)
var
	string sTitle
if (ShouldReadTitles ())
	sTitle = GetActiveCellRowTitleText ()
	if (! stringIsBlank (sTitle))
		sTitle = StringReplaceSubStrings (sTitle, sc_amp, sc_ampersandChar)
		brailleAddString (sTitle, 0,0,0)
		return true
	endIf
endIf
return false
endFunction

int function BrailleAddObjectFormulaValue(int nType)
if nType ==  (XL_WT_CELL_EDIT + WT_CUSTOM_CONTROL_BASE)
&& globalOnFormulaBarUIA
		BrailleAddString (gsFormulaValueForFormulaBar, 0, 0, 0)
		return true
endIf
return false
EndFunction

int function BrailleAddObjectContent(int nType)
if nType ==  (XL_WT_CELL_EDIT + WT_CUSTOM_CONTROL_BASE)
	if globalOnFormulaBarUIA
	&& Excel_StatusBar_Mode == Excel_status_point
		BrailleAddString (gsCellContentForFormulaBar, 0, 0, 0)
	endIf
	return true
endIf
var
	string sText
sText = GetActiveCellText ()
if (sText !=cscNull)
	BrailleAddString (sText, GetCursorCol (), GetCursorRow (), 0)
else
	BrailleAddString (cScSpace, GetCursorCol (), GetCursorRow (), 0)
endIf
return true
endFunction

int function BrailleAddObjectFormula(int nType)
var
	object oCell
if ActiveCellIsFormulaCell () then
	BrailleAddString (getActiveCellFormula (), 0,0,0)
	return true
else
	return false
endIf
endFunction

int function BrailleAddObjectHyperlink(int nType)
if (ActiveCellHasHyperlinks ())
	BrailleAddString (formatString (msgHyperlink1, GetActiveCellHyperlinkAddress ()), 0,0,0)
	return true
else
	return false
endIf
endFunction

int function BrailleAddObjectComment(int nType)
var
	string sComment
sComment = getActiveCellCommentText ()
if (sComment != cscNull)
	var
		string text,
		int commentType
	commentType = TypeOfCachedComment()
	if commentType == NoteCommentType 
		text = formatString (msgNote1, sComment)
	elif commentType == ThreadedCommentType 
		text = formatString (msgComment1, sComment)
	else
		return true
	endIf
	brailleAddString (text, 0,0,0) ; has comment
endIf
return true
endFunction

int function BrailleAddObjectRowTotal(int nType)
if TotalsColumnIsOff() return true endIf
var string sRowTotalText = getRowTotalText()
if !sRowTotalText
&& AllowPerformanceImpactingFeatures()
	sRowTotalText = GetAutoRowTotalText()
EndIf
if sRowTotalText
	sRowTotalText = formatString(msgRowTotal1_L,sRowTotalText)
	BrailleAddString(sRowTotalText ,0,0,0)
endIf
return true
endFunction

int function BrailleAddObjectColTotal(int nType)
if TotalsRowIsOff() return true endIf
var string sColTotalText = getColumnTotalText()
if !sColTotalText
&& AllowPerformanceImpactingFeatures()
	sColTotalText = GetAutoColumnTotalText()
EndIf
if sColTotalText
	sColTotalText = formatString(msgColTotal1_L,sColTotalText)
	BrailleAddString(sColTotalText,0,0,0)
endIf
return true
endFunction

;Keep legacy functions just in case someone is using an outdated jbs file.
;Even though that means the panning alignment would be off, the greater granularity being a significant improvement.
int function BrailleAddObjectColumnContext(int nType)
var
	int i,
	int iMax,
	int iPosition,
	string sText,
	string strList
strList = GetBrlColumnContextData (iPosition)
iMax = stringSegmentCount (strList, LIST_ITEM_SEPARATOR)
for i=1 to iMax
	sText= stringSegment (strList, LIST_ITEM_SEPARATOR, i)
	if (sText == cscNull)
		sText = msgBrlBlankCell
	endIf
	sText = stringReplaceChars (sText, LIST_ITEM_SEPARATOR, "")
	sText = StringTrimLeadingBlanks (stringTrimTrailingBlanks (sText))+cscSpace+cscListSeparator
	if (i == iPosition)
		brailleAddString (getActiveCellAddress (), 0,0,0)
		brailleAddString (sText, getCursorCol (), getCursorRow (), ATTRIB_HIGHLIGHT)
	else
		brailleAddString (sText, 0,0,0)
	endIf
endFor
return true
endFunction

int function BrailleAddObjectColumnContextBeforeCurrent(int nType)
var
	int i,
	int iPosition = giBrlColDataCurrentCellPosition,
	string sText,
	string strList = gstrBrlColData
;don't duplicate first or last cells content:
if iPosition == 1 then return endIf
; to keep double entry of cell data:
iPosition = iPosition - 1
for i=1 to iPosition
	sText= stringSegment (strList, LIST_ITEM_SEPARATOR, i)
	if (sText == cscNull)
		sText = msgBrlBlankCell
	endIf
	sText = stringReplaceChars (sText, LIST_ITEM_SEPARATOR, "")
	sText = StringTrimLeadingBlanks (stringTrimTrailingBlanks (sText))+cscSpace+cscListSeparator
	brailleAddString (sText, 0,0,0)
endFor
return true
endFunction

int function BrailleAddObjectColumnContextCurrent(int nType)
var
	int iPosition = giBrlColDataCurrentCellPosition,
	string sText,
	string strList = gstrBrlColData
sText= stringSegment (strList, LIST_ITEM_SEPARATOR, iPosition)
if (sText == cscNull)
	sText = msgBrlBlankCell
endIf
sText = stringReplaceChars (sText, LIST_ITEM_SEPARATOR, "")
sText = StringTrimLeadingBlanks (stringTrimTrailingBlanks (sText))
brailleAddString (getActiveCellAddress (), 0,0,0)
brailleAddString (sText, getCursorCol (), getCursorRow (), ATTRIB_HIGHLIGHT)
return true
endFunction

int function BrailleAddObjectColumnContextAfterCurrent(int nType)
var
	int i,
	int iMax,
	int iPosition = giBrlColDataCurrentCellPosition,
	string sText,
	string strList = gstrBrlColData
;don't duplicate first or last cells content:
if iPosition == iMax then return endIf
iMax = stringSegmentCount (strList, LIST_ITEM_SEPARATOR)
if iPosition < iMax then
;pad the start of After Text with divider, since we stripped that off of current cell:
	BrailleAddString (cscListSeparator, 0,0,0)
endIf
for i=iPosition+1 to iMax
	sText= stringSegment (strList, LIST_ITEM_SEPARATOR, i)
	if (sText == cscNull)
		sText = msgBrlBlankCell
	endIf
	sText = stringReplaceChars (sText, LIST_ITEM_SEPARATOR, "")
	sText = StringTrimLeadingBlanks (stringTrimTrailingBlanks (sText))+cscSpace+cscListSeparator
	brailleAddString (sText, 0,0,0)
endFor
return true
endFunction

int function BrailleAddObjectRowContext(int nType)
var
	int i,
	int iMax,
	int iPosition,
	string sText,
	string strList
strList = GetBrlRowContextData (iPosition)
iMax = stringSegmentCount (strList, LIST_ITEM_SEPARATOR)
for i=1 to iMax
	sText = stringSegment (strList, LIST_ITEM_SEPARATOR, i)
	if (sText == cscNull)
		sText = msgBrlBlankCell
	endIf
	sText = stringReplaceChars (sText, LIST_ITEM_SEPARATOR, "")
	sText = StringTrimLeadingBlanks (stringTrimTrailingBlanks (sText))+cscSpace+cscListSeparator
	if (i == iPosition)
		brailleAddString (getActiveCellAddress (), 0,0,0)
		brailleAddString (sText, getCursorCol (), getCursorRow (), ATTRIB_HIGHLIGHT)
	else
		brailleAddString (sText, 0,0,0)
	endIf
endFor
return true
endFunction

int function BrailleAddObjectRowContextBeforeCurrent(int nType)
var
	int i,
	int iPosition = giBrlRowDataCurrentCellPosition,
	string sText,
	string strList = gstrBrlRowData
;don't duplicate first or last cells content:
if iPosition == 1 then return endIf
; to keep double entry of cell data:
iPosition = iPosition - 1
for i=1 to iPosition
	sText= stringSegment (strList, LIST_ITEM_SEPARATOR, i)
	if (sText == cscNull)
		sText = msgBrlBlankCell
	endIf
	sText = stringReplaceChars (sText, LIST_ITEM_SEPARATOR, "")
	sText = StringTrimLeadingBlanks (stringTrimTrailingBlanks (sText))+cscSpace+cscListSeparator
	brailleAddString (sText, 0,0,0)
endFor
return true
endFunction

int function BrailleAddObjectRowContextCurrent(int nType)
var
	int iPosition = giBrlRowDataCurrentCellPosition,
	string sText,
	string strList = gstrBrlRowData
sText= stringSegment (strList, LIST_ITEM_SEPARATOR, iPosition)
if (sText == cscNull)
	sText = msgBrlBlankCell
endIf
sText = stringReplaceChars (sText, LIST_ITEM_SEPARATOR, "")
sText = StringTrimLeadingBlanks (stringTrimTrailingBlanks (sText))
brailleAddString (getActiveCellAddress (), 0,0,0)
brailleAddString (sText, getCursorCol (), getCursorRow (), ATTRIB_HIGHLIGHT)
return true
EndFunction

int function BrailleAddObjectRowContextAfterCurrent(int nType)
var
	int i,
	int iMax,
	int iPosition = giBrlRowDataCurrentCellPosition,
	string sText,
	string strList = gstrBrlRowData
;don't duplicate first or last cells content:
if iPosition == iMax then return endIf
iMax = stringSegmentCount (strList, LIST_ITEM_SEPARATOR)
if iPosition < iMax then
;pad the start of After Text with divider, since we stripped that off of current cell:
	BrailleAddString (cscListSeparator, 0,0,0)
endIf
for i=iPosition+1 to iMax
	sText= stringSegment (strList, LIST_ITEM_SEPARATOR, i)
	if (sText == cscNull)
		sText = msgBrlBlankCell
	endIf
	sText = stringReplaceChars (sText, LIST_ITEM_SEPARATOR, "")
	sText = StringTrimLeadingBlanks (stringTrimTrailingBlanks (sText))+cscSpace+cscListSeparator
	brailleAddString (sText, 0,0,0)
endFor
return true
EndFunction

int function BrailleAddObjectStartCoordinates(int nType)
Var
	String sAddress
GetSelectionAddressRange (sAddress, cscNull)
sAddress = RemoveDuplicateAddressInfo (sAddress)
BrailleAddString(sAddress,0,0,0)
return true
endFunction

int function BrailleAddObjectStartContent(int nType)
var
	string sText
GetSelectionFirstAndLastCellText(sText, cscNull)
if sText!=cscNull then
	BrailleAddString(sText,0,0,0)
else
	brailleAddString(msgBrlBlankCell,0,0,0)
endIf
return true
endFunction

int function BrailleAddObjectDelim(int nType)
BrailleAddstring(msgBrlDelim,0,0,0)
return true
endFunction

int function BrailleAddObjectEndCoordinates(int nType)
Var
	String sAddress
GetSelectionAddressRange (cscNull, sAddress)
sAddress = RemoveDuplicateAddressInfo (sAddress)
BrailleAddString(sAddress,0,0,0)
return true
endFunction

int function BrailleAddObjectEndContent(int nType)
var
	string sText
GetSelectionFirstAndLastCellText(cscNull, sText)
if sText!=cscNull then
	BrailleAddString(sText,0,0,0)
else
	BrailleAddString(msgBrlBlankCell,0,0,0)
endIf
return true
endFunction

int function brailleAddObjectMonitorCells ()
var
	int i,
	int iMax,
	string sAddress,
	string sCellText,
	string strMonitorCellsList
strMonitorCellsList = getListOfMonitorCells ()
iMax = stringSegmentCount (strMonitorCellsList, LIST_ITEM_SEPARATOR)
if (iMax)
	; something is defined
	for i=1 to iMax
		sAddress = stringSegment (strMonitorCellsList, list_item_separator, i)
		if (! stringIsBlank (sAddress))
			sCellText = getRangeText (sAddress)
			brailleAddString (sAddress, 0,0,0)
			brailleAddString (sCellText, 0,0,0)
		endIf
	endFor
endIf
return true
EndFunction

int function BrailleAddObjectInputMessage(int nType)
If ActiveCellHasValidationInputMessage () then
	BrailleAddString (GetActiveCellValidationBrlMessage(), 0,0,0)
EndIf
return true
endFunction

int function BrailleAddObjectFilterDropdown(int nType)
if OnSpreadsheetCell()
&& FSUIAGetFirstChildOfElement (UIAFocusElement).AutomationID == AutomationID_Dropdown
	BrailleAddString (msgBrlValidateDropdown, 0,0, CTRL_NONE, true)
endIf
return true
endFunction

int function BrailleAddObjectAreas (int nType)
var
	string sSelecctionText = ""
if (getSelectionAreaCount () > 1)
	brailleAddString(GetSelectionAreaRanges(),0,0,0)
	sSelecctionText = getActiveCellText ()
	if (sSelecctionText)
		BrailleAddString (sSelecctionText, 0,0,0)
	EndIf
EndIf
return TRUE
endFunction

int function BrailleAddObjectExtraHelp(int nType)
var
	string sHelp
let sHelp = getExtraHelpFromDialogsOnItemChange()
if sHelp then
	BrailleAddString (sHelp, 0,0,0)
Endif
return true
EndFunction

int function BrailleAddObjectState(int nSubtypeCode)
if IsTouchCursor() then
	return BrailleAddObjectState(nSubtypeCode)
endIf
var
	int state,
	string sBrailleState
if (WT_TREEVIEW == nSubtypeCode || WT_TREEVIEWITEM == nSubtypeCode)
&& IsPCCursor()
&& !IsVirtualPCCursor()
&& cwc_sysTreeview32 == GetWindowClass(GetFocus())
	state = GetTreeViewItemState()
	; account for the case where we're on a partially checked item such as in apply filters:
	if TVGetItemStateImageIndex(getFocus ()) == 2 then state = CTRL_PARTIALLY_CHECKED endIf
	sBrailleState = BrailleGetStateString(state)
	if (not StringIsBlank(sBrailleState)) then
		SuppressG2TranslationForNextStructuredModeSegment()
		BrailleAddString(sBrailleState, 0, 0, 0)
	EndIf
	return true
endIf
return BrailleAddObjectState(nSubtypeCode)
EndFunction

int function BrailleAddObjectDlgText(int nSubtypeCode)
if getObjectSubTypeCode(SOURCE_CACHED_DATA,0) == wt_listboxItem && getObjectSubTypeCode(SOURCE_CACHED_DATA,2) == wt_dialog &&
   getWindowClass(getRealWindow(getFocus())) == wc_nuidialog then
	return true
Endif
return false
EndFunction

prototype string function GetBrlRowContextDataHelper(int ByRef iActiveCellPosition, int iRow, int iColumn)

int function BrailleAddObjectColTitles(int nType)
var
	int i,
	int iMax,
	int iPosition = giBrlRowDataCurrentCellPosition,
	string sText,
	string strList,
	int colTitleRowStart,
	int colTitleRowEnd

getActiveColumnTitleLocation ( colTitleRowStart, colTitleRowEnd)
if  colTitleRowStart==0 then
	colTitleRowStart=1
endIf
strList = GetBrlRowContextDataHelper(iPosition, colTitleRowStart, cXLActiveCell.column)

iMax = stringSegmentCount (strList, LIST_ITEM_SEPARATOR)
for i=1 to iMax
	sText= stringSegment (strList, LIST_ITEM_SEPARATOR, i)
	if (sText == cscNull)
		sText = msgBrlBlankCell
	endIf
	sText = stringReplaceChars (sText, LIST_ITEM_SEPARATOR, "")
	sText = StringTrimLeadingBlanks (stringTrimTrailingBlanks (sText))+cscSpace+cscListSeparator
	brailleAddString (sText, 0,0,0)
endFor

return true
endFunction

int function BrailleAddObjectPriorRow(int nType)
var	
int i,
int iMax,
	int iPosition = giBrlRowDataCurrentCellPosition,
	string sText,
	string strList
	
if cXLActiveCell.row ==1 
	return true
endIf
	strList = GetBrlRowContextDataHelper(iPosition, cXLActiveCell.row-1, cXLActiveCell.column)
iMax = stringSegmentCount (strList, LIST_ITEM_SEPARATOR)

for i=1 to iMax
	sText= stringSegment (strList, LIST_ITEM_SEPARATOR, i)
	if (sText == cscNull)
		sText = msgBrlBlankCell
	endIf
	sText = stringReplaceChars (sText, LIST_ITEM_SEPARATOR, "")
	sText = StringTrimLeadingBlanks (stringTrimTrailingBlanks (sText))+cscSpace+cscListSeparator
	brailleAddString (sText, 0,0,0)
endFor


return true
endFunction

string function BrailleGetTextForSplitMode()
If OnSpreadsheetCell() then
	return GetRowText()
endIf
return BrailleGetTextForSplitMode()
endFunction

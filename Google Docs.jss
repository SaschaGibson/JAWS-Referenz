; Copyright 2015-2025 by Freedom Scientific, Inc.
; Domain-specific scripts for Google Docs, Google Sheets and Google Slides, The suite of Google office products.

import "UIA.jsd"
import "FSXMLDomFunctions.jsd"
import "IA2Browser.jsd"

include "hjConst.jsh"
include "hjGlobal.jsh"
include "MSAAConst.jsh"
include "IAccessible2.jsh"
include "XMLDom.jsh"
include "UIA.jsh"
include "braille.jsh"
include "Common.jsm"
include "Google Docs.jsm"

; Note these do not need translation as they are used for comparing with MSAA data.
const
	scGoogleFileListPage = "/u/0/",
	scGoogleDriveIdentifier = "https://drive.google.com/drive/",
	scGoogleSheetIdentifier = "https://docs.google.com/spreadsheets/",
	scGoogleDocIdentifier = "https://docs.google.com/document/",
	scGoogleSlideIdentifier = "https://docs.google.com/presentation/",
	scCellDataDelimiter = ";",
	scLiveRegionID = "docs-aria-speakable",
	hKey_QuickNavLayerExitSound = "QuickNavLayerExitSound"
;For ensuring that ToolTipEvent doesn't duplicate information announced by ActiveItemChangedEvent:
const
	ActiveItemChangeAndToolTipEventWaitThreshold = 1500,
	TableNavTimeoutThreshold=1500,
	KeyEchoWaitThreshold = 1000,
; for F8 selection
	F8SelectNothing=0,
	F8SelectSentence=9, ; Internally these correspond to the TULTextUnit enum
	F8SelectParagraph=10,
	F8SelectPage=11

globals
	int TopAndBottomEdgeTimer,
	string gSoundFilePath,
	int LastKeyPressTime,
	int ActiveItemChangedEventTimeTicker,
	int tableNavTimeTicker,
	int gBrowserVersion,
	string gAppName,
	int IsOverWritingAppendedTextOnClipboard, 
	int gDocsSelectionType,
	int GoogleDocsTableCoordsAnnouncement
	
;for controls which are customized so that data is collected and stored:
globals
	int g_GoogleDocsAutoPanMode

;Table headers and coordinates are cached so that they can be retrieved once and then used for braille:
globals
	collection c_gDocsTbl
	;Members are:
	;
	; int col -- The column.
	; int row -- The row.
	; string ColHdr -- Table column header.
	; string RowHdr -- Table row header.
	; string RowAxis -- Row axis name.
	; string ColAxis -- Column axis name.
	; string priorColAxis -- Prior row axis name.
	; string priorRowAxis -- Prior column axis name.

;for capturing the text in SpeakLiveRegionEvent when speaking the current comment, so that it can be virtualized on double press of the keystroke:
const
	GDocsSpeakCommentOnRequestWaitTime = 5,
	GDocsShowCommentTextInVirtualViewerWaitTime = 5
globals
	int GDocsIsExpectingCommentFromLiveRegionEvent,
	string GDocsCurrentCommentText,
	int GDocsScheduleIDSpeakCommentOnRequest,
	int GDocsScheduleIDShowCommentTextInVirtualViewer

; For determining the type of Google document, returned by function GoogleDocumentType:
const
	Google_unknown = 0,  ; It's not one of the known types below.
	Google_Drive = 1,
	Google_Docs = 2,
	Google_Sheets = 3,
	google_Slides = 4

; for management of the BrailleModeTip message:
const
	GoogleBrailleModeTipDelayTime = 10  ;tenths of a second
globals
	int SpeakGoogleBrailleModeTipScheduleID,
	int BrailleModeTipSpoken

;When navigating by paragraph, we must check to determine if the move causes a cell change.
;We do not want to speak both the paragraph moved to and the cell moved to, so we test if the cell changed to determine what should be spoken.
;TableColumnBeforeMoveByParagraph and tableRowBeforeMoveByParagraph are set immediately before the action causing a move by paragraph, then tested and cleared in SayParagraphFromCaretMovedEvent.
globals
	int TableColumnBeforeMoveByParagraph,
	int tableRowBeforeMoveByParagraph


void function AutoStartEvent()
;When the browser gains focus, the focus change event code which fires is in the browser.
;After the browser's focus change is processed, then the web-specific scripts are loaded.
let g_GoogleDocsAutoPanMode=getJCFOption(OPT_BRL_AUTOPAN_MODE)
gSoundFilePath = GetSoundFileLocation(IniReadString(section_options, hKey_QuickNavLayerExitSound, cscNull,GetActiveConfiguration(true)+cScPeriod+jcfFileExt))
loadNonJCFOptions ()
gAppName = GetAppFileName ()
GetFixedProductVersion(GetAppFilePath (), gBrowserVersion, 0, 0, 0)
if !c_gDocsTbl c_gDocsTbl = new collection endIf
if !(getRunningFSProducts () & (Product_Fusion | product_ZoomText))
	MouseToTopLeft()
endIf
EndFunction

void function AutoFinishEvent()
setJCFOption(OPT_BRL_AUTOPAN_MODE, g_GoogleDocsAutoPanMode); restore it when not in grid.
ClearSpeakCommentGlobals()
CollectionRemoveAll(c_gDocsTbl)
ManageBrailleModeTipAnnouncement()
EndFunction

void function loadNonJCFOptions ()
GoogleDocsTableCoordsAnnouncement = GetNonJCFOption ("TableCoordsAnnouncement")
loadNonJCFOptions ()
EndFunction

int function InBrowserWindow()
if UserBufferIsActive() return false endIf
var string class = GetWindowClass(GetFocus())
return class == CWC_MozillaContentWindowClass 
	|| class == cwcChromeBrowserClass
EndFunction

int function NonDomainException()
; TRUE means don't run domain-specific code.
return isVirtualPcCursor ()
	|| UserBufferIsActive ()
	|| !IsPcCursor()
	|| IsLeftButtonDown()
	|| IsRightButtonDown()
	|| (!IsFormsModeActive() && gAppName != "chrome.exe")
; Virtual Ribbons have a forms mode we don't want these scripts to use:
	|| IsVirtualRibbonActive()
endFunction

int function GoogleDocumentType()
var string path = GetDocumentPath()
if StringEndsWith(path,scGoogleFileListPage)
	return Google_Unknown
elif StringStartsWith(path,scGoogleDocIdentifier)
	return Google_Docs
elif StringStartsWith(path,scGoogleSheetIdentifier)
	return Google_Sheets
elif StringStartsWith(path,scGoogleSlideIdentifier)
	return Google_Slides
elif StringStartsWith(path,scGoogleDriveIdentifier)
	return Google_Drive
else
	return Google_Unknown
endIf
EndFunction

void function SpeakGoogleBrailleModeTip()
if BrailleModeTipSpoken return endIf
var int docType = GoogleDocumentType()
if docType == Google_Docs
&& DocsBrailleModeOff()
	Say(FormatString(msgDocsBrailleModeTip, msgBrailleModeSettingsHint), ot_help)
	BrailleModeTipSpoken = true
endIf
EndFunction

void function ManageBrailleModeTipAnnouncement(optional int ScheduleIt)
if SpeakGoogleBrailleModeTipScheduleID
	UnscheduleFunction(SpeakGoogleBrailleModeTipScheduleID)
	SpeakGoogleBrailleModeTipScheduleID = 0
endIf
if !ScheduleIt || BrailleModeTipSpoken return endIf
; The announcement is scheduled, to allow time for the live region to send text and have it announced before speaking the tip:
SpeakGoogleBrailleModeTipScheduleID = ScheduleFunction("SpeakGoogleBrailleModeTip", GoogleBrailleModeTipDelayTime)
EndFunction

void Function GetCellComponentsFromLiveRegion(string liveRegionText, string byRef coordinates, string byRef content)
var
int segments,
int segment

let segments=StringSegmentCount(liveRegionText, scCellDataDelimiter)
if segments < 1 then
	return
endIf
; coordinates are always the last piece of data
let coordinates=StringTrimTrailingBlanks (stringSegment(liveRegionText, scCellDataDelimiter, segments))
for segment=1 to segments-1
	let content = content+stringSegment(liveRegionText, scCellDataDelimiter, segment)
endFor
endFunction

void function SayCurrentSheetCellContent(int outputType, int includeCoordinates, int spellIt)
var
string content,
string coordinates,
string cell
let cell=GetLiveRegionText(GetFocus(), scLiveRegionID)
GetCellComponentsFromLiveRegion(cell, coordinates, content)
if spellIt then
	SayMessage(OT_SPELL, content)
elif content == cscNull then
	sayMessage(OT_JAWS_MESSAGE, cmsgBlank1)
else
	if outputType==OT_CHAR then
		SayMessage(outputType, stringLeft(content, 1)) ; first char
	elif outputType==OT_WORD then
		SayMessage(outputType, stringSegment(content, cscSpace, 1)) ; first word
	else
		sayMessage(OT_LINE, content) ; entire cell content
	endIf
endIf
if includeCoordinates then
	sayMessage(OT_POSITION, coordinates)
endIf
endFunction

int function inBrowserContentWithVirtualCursorOff()
return !IsVirtualPCCursor()
	&& InBrowserWindow()
EndFunction

int function IsGoogleBrailleModeApplicable()
if !inBrowserContentWithVirtualCursorOff() return false endIf
var int docType = GoogleDocumentType()
return docType == Google_Docs
	|| docType == Google_Sheets
	|| docType == Google_Slides
EndFunction

int function IsGoogleBrailleModeOff()
if !inBrowserContentWithVirtualCursorOff() return false endIf
return GoogleDocWithBrailleModeOffHasFocus()
	|| GoogleSlideWithBrailleModeOffHasFocus()
	|| GoogleSheetWithBrailleModeOffHasFocus()
EndFunction

int function DocsBrailleModeOff()
return IsGoogleBrailleModeOff()
endFunction

int function EditCallbacksNotSupported()
if !(IsFormsModeActive() && IsInsideARIAApplication()) return false endIf
; Live region updates will speak outside of multiline edits.
var int SubtypeCode = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
return SubtypeCode != WT_MULTILINE_EDIT 
	; edit callbacks should most of the time catch edit subtypes ahead of time, just a safety here:
	&& SubtypeCode != WT_EDIT
	&& SubtypeCode!= WT_PASSWORDEDIT
EndFunction

void function SayCharacterUnit (int UnitMovement)
if DocsBrailleModeOff()
	ManageBrailleModeTipAnnouncement(true)
	return  ; Speak from Live Region
endIf
if NonDomainException()
	return  SayCharacterUnit(UnitMovement)
endIf
if EditCallbacksNotSupported()
	return
endIf
return SayCharacterUnit (UnitMovement)
endFunction

void function SayWordUnit (int UnitMovement)
if DocsBrailleModeOff()
	ManageBrailleModeTipAnnouncement(true)
	return  ; Speak from live region
endIf
if NonDomainException() then return  SayWordUnit (UnitMovement) endIf
if EditCallbacksNotSupported()
	return
endIf
return SayWordUnit (UnitMovement)
endFunction

void function SayLineUnit(int unitMovement, optional int bMoved)
if DocsBrailleModeOff()
	ManageBrailleModeTipAnnouncement(true)
	return  ; Speak from Live Region
endIf
if NonDomainException() then SayLineUnit (unitMovement, bMoved) return  endIf
if EditCallbacksNotSupported()
	return
endIf
return SayLineUnit (unitMovement, bMoved)
endFunction

int function IsChromiumBrowser()
	return gAppName == "chrome.exe"
EndFunction

int function UnitMoveControlNavBrailleMode(int UnitMovement)
if DocsBrailleModeOff() return false EndIf
if UnitMovement == UnitMove_Next
	SetParagraphMovementGlobals()
	SetMovementUnit(Unit_Paragraph_Next)
	TypeKey(cksControlDownArrow) 
ElIf UnitMovement == UnitMove_Prior
	SetParagraphMovementGlobals()
	SetMovementUnit(Unit_Paragraph_Prior)
	TypeKey(cksControlUpArrow)
Else
	return false
EndIf
return true
EndFunction

void function UnitMoveControlNav(int UnitMovement)
if NonDomainException() then return  UnitMoveControlNav (UnitMovement) endIf
if UnitMoveControlNavBrailleMode(UnitMovement)
	return
EndIf
if IsInsideARIAApplication () then
	;braille mode is off, so the live region will send the paragraph text.
	if UnitMovement == UnitMove_Next
		TypeKey(cksControlDownArrow) 
	ElIf UnitMovement == UnitMove_Prior
		TypeKey(cksControlUpArrow)
	EndIf
	return
endIf
return UnitMoveControlNav (UnitMovement)
endFunction

Script ControlUpArrow ()
if NonDomainException()
&& !InFolderGridView() then
	PerformScript ControlUpArrow ()
	return  
endIf

if (InFolderGridView()
|| GoogleSheetHasFocus())
	TypeKey(cksControlUpArrow)
	return
EndIf

if ! IsInsideARIAApplication ()
	if DocsBrailleModeOff()
		;Google Docs braille support is off while navigating in the document,
		;type the key and let the event read the text change:
		TypeKey(cksControlUpArrow)
		return
	endIf
	; Application Mode for web apps can be a challenge to get back into:
	if getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
		TurnOffFormsMode ()
	endIf
endIf
PerformScript ControlUpArrow ()
endScript

void function ProcessTopAndBottomEdgeScheduler ()
if ! GetJCFOption (OPT_TOP_AND_BOTTOM_EDGE_ALERT)
|| ! IsInsideARIAApplication ()
|| getObjectSubtypeCode () != WT_MULTILINE_EDIT then
	return
endIf
TopAndBottomEdgeTimer = ScheduleFunction ("Beep", 3, TRUE)
endFunction

void function SetParagraphMovementGlobals()
;When moving by paragraph, we need to know if the move will cause a cell change.
;we set these variables before the move, then compare afterwards.
if InTable()
	GetCellCoordinates(TableColumnBeforeMoveByParagraph,tableRowBeforeMoveByParagraph)
else
	ClearParagraphMovementGlobals()
endIf
EndFunction

void function ClearParagraphMovementGlobals()
;These variables are cleared immediately after a paragraph navigation, when we have determined whether or not the move caused a cell change.
TableColumnBeforeMoveByParagraph = 0
tableRowBeforeMoveByParagraph = 0
EndFunction

int function ParagraphMoveEnteredNewTableCell()
;This function is used to determine whether a paragraph movement entered a new table cell,
;so that we can control what is and is not spoken depending on whether or not a table cell was entered.
if !InTable()
	return false 
endIf
var int col, int row
GetCellCoordinates(col,row)
return col != TableColumnBeforeMoveByParagraph
	|| row != tableRowBeforeMoveByParagraph
EndFunction

void function SayParagraphFromCaretMovedEvent()
;Only speak the paragraph if we are not expecting a table event to speak:
if !ParagraphMoveEnteredNewTableCell()
	SayParagraphFromCaretMovedEvent()
endIf
ClearParagraphMovementGlobals()
EndFunction

void function CaretMovedEvent( int movementUnit,optional int source)
if TopAndBottomEdgeTimer
	unscheduleFunction (TopAndBottomEdgeTimer)
endIf
if GlobalActiveLayer == GoogleDocsLayerActive
	var string keyName = GetCurrentScriptKeyName()
	if keyname == cksSpace
	|| keyName == cksShiftSpace
		SetParagraphMovementGlobals()
		SayParagraphFromCaretMovedEvent()
		return
	endIf
EndIf
if GoogleSheetHasFocus()
&& !GetObjectIsEditable ()
	;Do not speak when not editing a cell
	return
endIf
if GlobalActiveLayer == TableLayerActive
	;Speech will be handled by CellChangedEvent
	;return here to prevent double speaking
	return
endIf
CaretMovedEvent( movementUnit,source)
endFunction

Script ControlDownArrow ()
if NonDomainException() 
&& !InFolderGridView() then
	PerformScript ControlDownArrow ()
	return  
endIf

if (InFolderGridView()
|| GoogleSheetHasFocus())
	TypeKey(cksControlDownArrow)
	return
EndIf
var int Subtype, handle hwnd
if !IsInsideARIAApplication ()
	if DocsBrailleModeOff()
		;Google Docs braille support is off while navigating in the document,
		;type the key and let the event read the text change:
		TypeKey(cksControlDownArrow)
		return
	endIf
	let hWnd = GetCurrentWindow()
	let Subtype = GetSubtypeCode(hWnd)
	if IsOpenListBoxApplicable(hWnd, Subtype) then
		ProcessOpenListBox(hWnd,Subtype,true)
		return
	elif isPcCursor ()
	; Application Mode for web apps can be a challenge to get back into:
	&& getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
		TurnOffFormsMode ()
	EndIf
elif ! IsVirtualPcCursor () then
	UnitMoveControlNav (UnitMove_Next)
	return
endIf
PerformScript ControlDownArrow ()
endScript

void function SayTopBottomUnit (int UnitMovement)
if NonDomainException() then return SayTopBottomUnit (UnitMovement) endIf
if (DocsBrailleModeOff()) then return endIf ; Speak from Live Region
var int Subtype = GetObjectSubtypeCode()
if IsInsideARIAApplication () then ; Live region updates will speak outside of multiline edits:
	if Subtype != WT_MULTILINE_EDIT 
	; edit callbacks should most of the time catch edit subtypes ahead of time, just a safety here:
	&& Subtype != WT_EDIT
	&& Subtype != WT_PASSWORDEDIT then
	; outside of a location where edit callbacks are supported.
		return
	endIf
endIf
return SayTopBottomUnit (UnitMovement)
endFunction

script TopOfFile ()
if !NonDomainException()
&& !IsInsideARIAApplication ()
	if !GetObjectSubtypeCode(SOURCE_CACHED_DATA)
		;Google Docs braille support is off while navigating in the document,
		;type the key and let the event read the text change:
		TypeKey(cksControlHome)
		return
	endIf
endIf

if (GoogleSheetHasFocus())
	TypeKey(cksControlHome)
	return
EndIf

PerformScript TopOfFile ()
EndScript

script BottomOfFile ()
if !NonDomainException()
&& !IsInsideARIAApplication ()
	if !GetObjectSubtypeCode(SOURCE_CACHED_DATA)
		;Google Docs braille support is off while navigating in the document,
		;type the key and let the event read the text change:
		TypeKey(cksControlEnd)
		return
	endIf
endIf

if (GoogleSheetHasFocus())
	TypeKey(cksControlEnd)
	return
EndIf

PerformScript BottomOfFile ()
EndScript

Script ScriptFileName ()
ScriptAndAppNames (msgAppName)
endScript

int function googleDocHasFocus()
if !inBrowserContentWithVirtualCursorOff()
|| GoogleDocumentType() != Google_Docs
	return false
endIf
if (GetObjectIA2State () & IA2_STATE_EDITABLE)
|| getObjectSubtypeCode() == wt_multiline_Edit
	return true
endIf
var string id = GetObjectIA2Attribute("id")
return id == "docs-texteventtarget-descendant"
EndFunction

int function GoogleDocWithBrailleModeOffHasFocus()
if !googleDocHasFocus() return false endIf
var string class = GetWindowClass(GetFocus())
if class == cwcChromeBrowserClass
	var string id = GetObjectIA2Attribute("id")
	return id == "docs-texteventtarget-descendant"
endIf
if class == CWC_MozillaContentWindowClass 
	return GetObjectRole(0) == ROLE_SYSTEM_GROUPING
		&& GetObjectRole(1) == ROLE_SYSTEM_TEXT
		&& GetObjectRole(2) == ROLE_SYSTEM_DOCUMENT
endIf
return false
endFunction

int function InFolderGridViewIA2Browser(string class)
if class != cwcChromeBrowserClass
&& class != CWC_MozillaContentWindowClass 
	return false
EndIf

if (GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0) != WT_ROW)
	return false
EndIf

var int gridAncestor = FindAncestorOfType (WT_GRID)
return gridAncestor != -1
EndFunction

int function InFolderGridView(optional handle hWnd)
if (!hWnd) hwnd = GetFocus() endIf
var string class = GetWindowClass(hWnd)
if class != CWC_MozillaContentWindowClass 
&& class != cwcChromeBrowserClass
	return false
endIf

if (InFolderGridViewIA2Browser(class))
	return true
EndIf

if GetObjectSubtypeCode(SOURCE_CACHED_DATA,1) != wt_ExtendedSelect_ListBox
|| GetObjectSubtypeCode() != wt_ListboxItem
	return false
endIf
return GetObjectSubtypeCode(SOURCE_CACHED_DATA,2) == wt_main_region
EndFunction

int function GoogleSheetHasFocus()
if !(inBrowserContentWithVirtualCursorOff()
&& GoogleDocumentType() == Google_Sheets
&& IsInsideAriaApplication())
	return false
endIf
if GetObjectRole(1) == ROLE_SYSTEM_ROW return true endIf
; If braille mode is off and has not been toggled while the document is open,
; object data will be different than when it is toggled to off while the document is open.
var string attr = GetObjectIA2Attribute("class")
if StringStartsWith(attr, "cell-input") return true endIf
attr = GetObjectIA2Attribute("id")
return StringStartsWith(attr, "fake-activedescendant-")
endFunction

int function GoogleSheetWithBrailleModeOffHasFocus()
if !GoogleSheetHasFocus() return false endIf
return GetObjectRole(1) != ROLE_SYSTEM_ROW
EndFunction

int function GoogleSlideHasFocus()
if !inBrowserContentWithVirtualCursorOff()
|| GoogleDocumentType() != Google_Slides
	return false
endIf
var string class = GetWindowClass(GetFocus())
if class == cwcChromeBrowserClass
	return GetObjectRole(1) == ROLE_SYSTEM_DOCUMENT
elif class == CWC_MozillaContentWindowClass
	if GetObjectRole(0) == ROLE_SYSTEM_GROUPING
		return GetObjectRole(1) == ROLE_SYSTEM_TEXT
			&& GetObjectRole(2) == ROLE_SYSTEM_DOCUMENT
	elif GetObjectRole(0) == ROLE_SYSTEM_TEXT
		var object firstChild = getFocusObject(0).accChild(1)
		return firstChild.accRole(0) == ROLE_SYSTEM_OUTLINE
	endIf
endIf
return false
EndFunction

int function GoogleSlideWithBrailleModeOffHasFocus()
if !GoogleSlideHasFocus() return false endIf
var string class = GetWindowClass(GetFocus())
if class == cwcChromeBrowserClass
	return GetObjectRole(0) == ROLE_SYSTEM_GROUPING
else ;class == CWC_MozillaContentWindowClass 
	return GetObjectRole(0) == ROLE_SYSTEM_GROUPING
		&& GetObjectRole(1) == ROLE_SYSTEM_TEXT
		&& GetObjectRole(2) == ROLE_SYSTEM_DOCUMENT
endIf
EndFunction

int function GoogleSlidesTreeHasFocus()
if !IsInsideAriaApplication()
	return false
endIf

if GoogleDocumentType()  != google_Slides
	return false
endIf

var
	int type =GetObjectSubtypeCode()
if (type==WT_TREEVIEWITEM)
	return true
endIf

var
	int currentItem = GetCurrentTreeItemIndex()
if currentItem > 0 then
	return true
endIf
return false
endFunction

int function InGoogleDocumentTable()
return inTable()
	&& googleDocHasFocus()
EndFunction

int function BrailleCallbackObjectIdentify()
if GoogleSlidesTreeHasFocus() then
	return WT_CUSTOM_CONTROL_BASE+3 ;CustomControl3
elif GoogleSheetHasFocus() then
	return WT_CUSTOM_CONTROL_BASE+2 ;CustomControl2
elif !GetObjectSubtypeCode() && InCommentStreamBoxDialog()
	return wt_static	
elif InGoogleDocumentTable()
	return WT_CUSTOM_CONTROL_BASE+4
endIf
return BrailleCallbackObjectIdentify()
endFunction

int function BrailleAddObjectValue(int nSubtype)
if InCommentStreamBoxDialog()
	BrailleAddString(GetObjectName(),0,0,0)
	var object info
	if GetCurrentInfoInThreadDialog(info)
		;The first item contains the author, which is already being shown,
		;so start with the second item.
		;To do this, start with I=1 instead of i=0:
		var int i=1, int length = info.length
		while i < length
			BrailleAddString(info(i).text,0,0,0)
			i = i+1
		endWhile
	endIf
	return true
endIf
return BrailleAddObjectValue(nSubtype)
EndFunction

int function BrailleAddLiveRegion(int type, string id, string text)
var
	string content,
	string coordinates
GetCellComponentsFromLiveRegion(text, coordinates, content)
BrailleAddString(coordinates,0,0,0)
BrailleAddString(content,GetCursorCol(),getCursorRow(),0) ; add cursor coords to ensure cursor blinks on cell content.
return true
endFunction

script SayCharacter()
if IsPCCursor ()
	if DocsBrailleModeOff()
		ManageBrailleModeTipAnnouncement(true)
	endIf
endIf
performScript sayCharacter();
endScript

script SayWord()
if IsPCCursor ()
	if DocsBrailleModeOff()
		ManageBrailleModeTipAnnouncement(true)
	endIf
endIf
performScript sayWord()
endScript

script SayLine()
if IsPCCursor()
	if GoogleSheetHasFocus()
		var
			string text,
			int editingCell=GetObjectSubtypeCode()==WT_EDITCOMBO 
		if isSameScript() then
			if editingCell then
				spellLine()
			else
				Say(GetRowText(cScBufferNewLine), OT_SPELL)
			endIf
		else
			if editingCell then
				sayLine()
			else
				text = GetRowText(cScBufferNewLine)
				if !text
					text = cmsgBlank1
				endIf
				say(text, OT_LINE)
			endIf
		endIf
		return
	endIf
	if DocsBrailleModeOff()
		ManageBrailleModeTipAnnouncement(true)
	endIf
endIf
performScript sayLine()
endScript

int function IsReadWordInContextValid()
return GoogleSheetHasFocus()
endFunction

script readWordInContext()
var
string content,
string coordinates,
string cell
if GoogleSheetHasFocus() then
	performScript sayCell()
else
	performScript ReadWordInContext()
endIf
endScript

script ScreenSensitiveHelp()
if GoogleSheetHasFocus() then
	SayFormattedMessage(OT_USER_BUFFER, msgSheetHelp_l, msgSheetHelp_s)
	SayFormattedMessage(OT_USER_BUFFER, cScBufferNewLine)
	SayFormattedMessage(OT_USER_BUFFER, cScBufferNewLine)
	SayFormattedMessage(OT_USER_BUFFER, msgDocsHelpGeneral_l, msgDocsHelpGeneral_s)
	SayFormattedMessage(OT_USER_BUFFER, cMsgBuffExit)
	return
endIf
if GoogleSlideHasFocus()
	SayFormattedMessage(OT_USER_BUFFER, msgSlideHelp_l, msgSlideHelp_s)
	SayFormattedMessage(OT_USER_BUFFER, cScBufferNewLine)
	SayFormattedMessage(OT_USER_BUFFER, msgDocsHelpGeneral_l, msgDocsHelpGeneral_s)
	SayFormattedMessage(OT_USER_BUFFER, cMsgBuffExit)
	return
endIf
if GoogleDocHasFocus()
	SayFormattedMessage(OT_USER_BUFFER, msgGoogleDocHelp_l, msgGoogleDocHelp_s)
	SayFormattedMessage(OT_USER_BUFFER, msgDocsHelpGeneral_l, msgDocsHelpGeneral_s)
	SayFormattedMessage(OT_USER_BUFFER, cMsgBuffExit)
	return;
endIf
performScript ScreenSensitiveHelp()
endScript

 Script HotKeyHelp ()
If UserBufferIsActive ()
	UserBufferDeactivate()
EndIf
UserBufferClear()
if GoogleSheetHasFocus()
	SayFormattedMessage(OT_User_Buffer, MSGGoogleSheetsHotkeyHelp)
	return
endIf
if GoogleSlideHasFocus()
	SayFormattedMessage(OT_User_Buffer, MSGGoogleSlidesHotkeyHelp)
	return
endIf
if GoogleDocHasFocus()
	SayFormattedMessage(OT_User_Buffer, MSGGoogleDocsHotkeyHelp)
	return
endIf
PerformScript HotKeyHelp ()
EndScript

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
if GoogleSheetHasFocus() then
	setJCFOption(OPT_BRL_AUTOPAN_MODE, brlAutoPanToMiddle) ; autopan to middle to ensure coordinates are shown.
else
	setJCFOption(OPT_BRL_AUTOPAN_MODE, g_GoogleDocsAutoPanMode); restore it when not in grid.
endIf
EndFunction

int function InCommentStreamBoxDialog()
if !dialogActive() || UserBufferIsActive() return false endIf
var int depth = FindAncestorOfType(wt_dialog)
return GetObjectName(SOURCE_CACHED_DATA,depth) == scDlgName_CommentStreamBox 
EndFunction

int function SayCurrentCommentInStreamBoxDialog()
if GetObjectSubtypeCode() return false endIf
Say(GetObjectName(),ot_control_name)
;The name includes the author,
;retrieve and announce the rest of the information here:
var object info
if !GetCurrentInfoInThreadDialog(info) return endIf
;Because the first item contains the author, which has already been spoken,
;start with the second item by setting I=1 instead of i=0:
var int i=1, int length = info.length
while i < length
	Say(info(i).text,ot_dialog_text)
	i = i+1
endWhile
return true
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
;Some names have markup which should not be announced:
var
	int type = GetObjectSubtypeCode(SOURCE_CACHED_DATA,nLevel),
	string name = GetObjectName(SOURCE_CACHED_DATA,nLevel),
	string strippedName = SMMStripMarkup(name)
if name != strippedName
	Say(strippedName,ot_control_name)
	if type
		IndicateControlType(type,cmsgSilent)
	endIf
	return
endIf
if nLevel > 0
	if nLevel == 1
	&& !Type
	&& GetObjectRole(1) == IA2_ROLE_SECTION
	&& DialogActive()
		;prevent spamming, where list of files is read at this level:
		var string level1Name = GetObjectName(false,1)
		if level1name
		&& FSUIAGetParentOfElement(FSUIAGetFocusedElement()).ControlType == UIA_GroupControlTypeId
			IndicateControlType(wt_groupbox, level1Name, cmsgSilent)
			return
		endIf
	endIf
	if type == WT_GRID
	&& GoogleSheetHasFocus()
		return
	EndIf
	;SayObjectTypeAndText on dialogs or frames results in too much speech,
	;Specifically for dialogs containing lists, the entire list is read.
	if type == wt_dialog
		IndicateControlType(wt_dialog,GetObjectName(false,nLevel),cmsgSilent)
	endIf
	if type == wt_dialog
	|| type == wt_frame
		var	string description = GetObjectDescription()
		if description
			Say(description,ot_dialog_text)
		endIf
		return
	endIf
endIf
if nLevel == 0
	if !type
	&& !IsVirtualPCCursor()
		;In some places, such as the list of templates available when creating a new document,
		;the focus is on a descendant of the listboxItem in the list.
		;GetObjectSubtypeCode(SOURCE_CACHED_DATA) says the focus is an unknown type,
		;but GetObjectSubtypeCode(false) says it is a groupbox.
		;Using SayObjectTypeAndText on this focus item results in the entire list being read.
		;This code checks for the condition described here and speaks only the name if there is one.
		if !StringIsBlank(name)
		&& GetObjectSubtypeCode(false) == wt_GroupBox
		&& GetObjectSubtypeCode(false,1) == wt_ListBoxItem
			Say(name,ot_line)
			return
		endIf
	endIf
	if inCommentStreamBoxDialog()
	&& SayCurrentCommentInStreamBoxDialog()
		return
	endIf
endIf
SayObjectTypeAndText(nLevel, includeContainerName)
EndFunction

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if GoogleSheetHasFocus() && iObjType==WT_ROW then
	if (nOldState & CTRL_SELECTED) 
		return
	endIf
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
ActiveItemChangedEventTimeTicker = GetTickCount()
if InFolderGridView(curHwnd)
	;SayObjectActiveItem	announces too much information, just say the name:
	Say(GetObjectName(),ot_line)
	return
elif GoogleSlidesTreeHasFocus()
&& !DocsBrailleModeOff()
	SayObjectActiveItem(false)
	return
endIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

int function ShouldProcessLiveRegion(string text, string attribs)
if StringTrimTrailingBlanks(text) == scLiveRegion_OpenAFile
	;This is the name of a dialog,
	;which is also sent as a live region alert.
	;Note that this alert has a trailing space,
	;where the dialog name does not have the trailing space.
	return false
endIf
if text == scLiveRegion_YouAreOnline
	return false
endIf

return ShouldProcessLiveRegion(text, attribs)
endFunction

Void Function TooltipEvent (handle hWnd, string strText, string appname)
var int ticker = GetTickCount() 
if ticker-ActiveItemChangedEventTimeTicker < ActiveItemChangeAndToolTipEventWaitThreshold
&& InFolderGridView()
	;The ActiveItemChangedEvent speaks the file grid item when navigating,
	;don't allow the tooltip to also speak it:
	if StringStartswith(GetObjectName(),strText)
		return
	endIf
endIf
TooltipEvent (hWnd, strText, appName)
EndFunction

void function MoveToGoogleToolbar(string AutomationID, string longErrorMsg, string shortErrorMsg)
if InHJDialog()
	SayMessage(ot_error, msgNotAvailableInHJDialog_error_L, msgNotAvailableInHJDialog_error_S)
	return
elif GetWindowClass(GetFocus()) == CWC_MozillaContentWindowClass 
	SayMessage(ot_error, msgNotAvailableInFirefox, msgNotAvailableInFirefox)
	return 
elif !InBrowserWindow()
	SayMessage(ot_error, msgOnlyAvailableInBrowserContentWindow_Error_L, msgOnlyAvailableInBrowserContentWindow_Error_S)
	return
EndIf
var
	object appElement,
	object condition,
	object toolbar
appElement = FSUIAGetElementFromHandle(GetFocus())
if appElement
	condition = FSUIACreateStringPropertyCondition(UIA_AutomationIdPropertyId, automationID)
	toolbar = appElement.findFirst(treeScope_subTree, condition)
	if !toolbar
		SayMessage(ot_error, longErrorMsg, shortErrorMsg)
		return
	endIf
endIf
; Set focus to the toolbar, the toolbar will select the focusable item:
toolbar.setFocus()
EndFunction

script MoveToGoogleMainToolBar()
MoveToGoogleToolbar("docs-toolbar", msgGoogleMainToolBarNotfound_error_L, msgGoogleMainToolBarNotfound_error_S)
EndScript

script MoveToGoogleModeAndViewToolBar()
MoveToGoogleToolbar("docs-side-toolbar", msgGoogleModeAndViewToolBarNotfound_error_L, msgGoogleModeAndViewToolBarNotfound_error_S)
EndScript

int function ShouldSkipTypeForReadVirtualPageInTabOrder(int type)
return type == wt_unknown
	|| type == wt_document
	|| type == wt_application
	|| type == WT_HTMLFrame
EndFunction

int Function ReadVirtualPageInTabOrder(int iType, int nState, string sName, string sValue, string sDescription)
if ShouldSkipTypeForReadVirtualPageInTabOrder(iType) Return true endIf
if StringIsBlank(sValue)
&& StringIsBlank(sName)
	return true
endIf
say(sName,ot_control_name)
say(GetControlTypeName(iType),ot_control_type)
say(sValue,ot_selected_item)
say(sDescription,ot_control_description)
return true
endFunction

int function ShouldSkipNodeForReadWebDialogInTabOrder(object node)
return node.tagName == "div"
	&& node.childNodes.item(0).nodeType != XML_TEXT_NODE
	&& (node.childNodes.length >1 || node.childNodes.item(0).nodeType != XML_TEXT_NODE)
EndFunction

Script ReadBoxInTabOrder()
if !InBrowserWindow()
|| !DialogActive()
	PerformScript ReadBoxInTabOrder()
	return
EndIf
var 
	object XMLDomDoc,
	object dialog
XMLDomDoc = GetFSXMLDomDoc()
;Is there a web dialog:
dialog = XMLDomDoc.SelectSingleNode("//Dialog")
if !dialog 
	EnumerateTypeAndTextStringsForWindow (GetFocus(),"ReadVirtualPageInTabOrder")
	return
endIf
var
	object node,
	object attribs,
	string text,
	int type
;First, say the dialog name:
attribs = dialog.attributes
text = attribs.GetNamedItem("fsText").nodeValue
type = attribs.GetNamedItem("fsType").nodeValue
Say(FormatString("%1 %2", text, GetControlTypeName(type)), ot_USER_REQUESTED_INFORMATION)
;now speak any dialog static text:
text = GetTextFromXMLDomTextChildNodes(dialog)
if text
	Say(text,ot_USER_REQUESTED_INFORMATION)
endIf
;now speak the dialog content:
Dialog = XMLDomDoc.SelectNodes("//Dialog//*")
if !Dialog return EndIf
forEach node in Dialog
	if !ShouldSkipNodeForReadWebDialogInTabOrder(node)
		text = GetXMLDomNodeTypeAndText(node)
		if (text) Say(text,ot_screen_message) endIf
	endIf
EndForEach
EndScript

int function WillOverwriteClipboard()
;gbAppendedToClipboard may be modified in the default call to WillOverwriteClipboard,
;and WillOverwriteClipboard is called when the clipboard will be modified.
;We must know if an actual overwrite of appended text is occurring so that it can be properly handled in the liv region announcement.
var int ClipboardHasAppendedText = gbAppendedToClipboard
var int AllowOverwrite = WillOverwriteClipboard()
IsOverWritingAppendedTextOnClipboard = (ClipboardHasAppendedText && AllowOverwrite)
return AllowOverwrite
EndFunction

void Function ClipboardChangedEvent ()
if (!googleDocHasFocus()) return ClipboardChangedEvent () endIf
;The live region announces copy, cut and paste, so don't announce them here.
;Append to clipboard code is also handled in the LiveRegion.
EndFunction

Script PasteFromClipboard()
if !googleDocHasFocus()
	PerformScript PasteFromClipboard()
	return
endIf
TypeKey (cksPaste)
;The live region announces the paste,
;so don't announce it here.
EndScript

Script Undo()
if !googleDocHasFocus()
	PerformScript Undo()
	return
endIf
TypeKey (cksUndo)
;The live region announces the undo,
;so don't announce it here.
EndScript

void function DoDelete()
if GoogleSheetHasFocus()
&& !GetObjectIsEditable ()
	TypeKey(cksDelete)
	;Do not speak when clearing a cell
	return
endIf
if (!googleDocHasFocus()) return DoDelete() endIf
TypeKey(cksDelete)
if (!DocsBrailleModeOff()) 
	ScheduleFunction ("SayCharacter", 1, true)
	return  
endIf
;The live region announces the deleted character,
;and if JAWS attempts too soon to get the new character under the cursor it fails.
;So don't announce anything here, at least for now.
EndFunction

int function ShouldSpeakTableCellsOnScriptCall(int tableNavDir)
return tableNavDir == TABLE_NAV_NONE
	|| !googleDocHasFocus()
EndFunction

int function GetTableCoordinatesForSpeakTableCells(int ByRef nCol, int ByRef nRow, int tableNavDir)
nCol = 0
nRow = 0
if tableNavDir != TABLE_NAV_NONE
&& googleDocHasFocus()
	return false
endIf
return GetEditCellCoordinates(nCol, nRow)
	|| GetCellCoordinates(nCol, nRow)
EndFunction

script sayNextParagraph()
if !InBrowserWindow()
	PerformScript sayNextParagraph()
	return
endIf
NextParagraph ()
if GetWindowClass(GetFocus()) == CWC_MozillaContentWindowClass 
	;We cannot obtain the paragraph in Firefox, 
	;so just say the line instead of the paragraph:
	ScheduleFunction("SayLine", 1)
else
	ScheduleFunction("SayParagraph", 1)
endIf
endScript

script sayPriorParagraph()
if !InBrowserWindow()
	PerformScript sayPriorParagraph()
	return
endIf
PriorParagraph ()
if GetWindowClass(GetFocus()) == CWC_MozillaContentWindowClass 
	;We cannot obtain the paragraph in Firefox, 
	;so just say the line instead of the paragraph:
	ScheduleFunction("SayLine", 1)
else
	ScheduleFunction("SayParagraph", 1)
endIf
endScript

void function ReadActivityIndicator()
var object XMLDomDoc = GetFSXMLDomDoc()
var object node = XMLDomDoc.selectSingleNode("//Div[@id='docs-activity-indicator']")
var string text = node.attributes.GetNamedItem("label").nodeValue
if !text
	text = node.attributes.GetNamedItem("aria-label").nodeValue
endIf
if text
	Say(text,ot_user_requested_information)
endIf
EndFunction

script SayBottomLineOfWindow()
if !googleDocHasFocus()
	Performscript SayBottomLineOfWindow()
	return
endIf
ReadActivityIndicator()
PerformScript AnnounceCursorLocation()
EndScript

int function GetCurrentInfoInThreadDialog(object byRef info)
info = Null()
if GetObjectSubtypeCode() return false endIf
var object node = GetFSXMLElementNode()
if node.attributes.GetNamedItem("class").nodeValue != "docos-docoview-tesla-conflict docos-streamdocoview" return false endIf
var object XMLDomDoc = GetFSXMLDomDoc()
var string fsID = node.attributes.GetNamedItem("fsID").nodeValue 
var string selectNodeSpec = "//Div[@fsID='"+fsID+"']"
var object Div = XMLDomDoc.selectSingleNode(selectNodeSpec)
info = div.selectNodes("descendant::text()")
return info.length > 0
EndFunction

; Moves to the next or prior misspelled word and reads it (depending on key assignment) 
script moveToMisspelledWord()
var
int x,
int y
let x=getCursorCol()
let y=GetCursorRow()
TypeCurrentScriptKey()
if !GoogleDocHasFocus() then
	SayCurrentScriptKeyLabel ()
	return
endIf
; Give time for Google Docs to move to the next or prior misspeling.
delay(3)
refresh() ; Ensure the cursor has updated its location
if (getCursorCol() !=x || getCursorRow() !=y) then
; We've moved
	SayWord()
else
sayMessage(OT_STATUS, msgNoMoreMispelled_l, msgNoMoreMispelled_s)
endIf
endScript

void function UpdateCachedAxisNames()
var
	string colAxis,
	string rowAxis
GetCellAxisNames(colAxis, rowAxis)
c_gDocsTbl.colAxis = colAxis
c_gDocsTbl.rowAxis = rowAxis
EndFunction

string function GetCoordinateString(int tableNavDir)
var
	string coordinateString,
	int useTemplateForCoordinates
UpdateCachedAxisNames()
useTemplateForCoordinates = StringIsAlpha(c_gDocsTbl.colAxis) == false

if useTemplateForCoordinates
	if tableNavDir == TABLE_NAV_HORIZONTAL
		coordinateString = FormatString (cMSGColumnHeader, c_gDocsTbl.colAxis)
	elif tableNavDir == TABLE_NAV_VERTICAL
		coordinateString = FormatString (cMSGRowHeader, c_gDocsTbl.rowAxis)
	else 
		coordinateString = FormatString (cMSGColumnAndRow, c_gDocsTbl.rowAxis, c_gDocsTbl.colAxis)
	endIf
else
	coordinateString = formatString(msgGoogleSheetCellCoordinatesString, c_gDocsTbl.colAxis, c_gDocsTbl.rowAxis)
endIf
return coordinateString
endFunction

string function GetTableRowHeaderText()
if GIBrlTblHeader == TBL_HEADER_MARKED
	return GetRowHeader(TRUE)
elif GIBrlTblHeader & TBL_HEADER_ROW
	return GetRowHeader()
endIf
return cscNull
EndFunction

string function GetTableColumnHeaderText()
if GIBrlTblHeader == TBL_HEADER_MARKED
	return GetColumnHeader(TRUE)
elif GIBrlTblHeader & TBL_HEADER_COL
	return GetColumnHeader()
endIf
return cscNull
EndFunction

void function BrailleAddSpreadsheetCoordinates()
if !GIBrlShowCoords return endIf
if !c_gDocsTbl.colAxis
|| !c_gDocsTbl.rowAxis
	;This is typically needed when alt-tabbing back into the spreadsheet from another app:
	UpdateCachedAxisNames()
endIf
BrailleAddString(formatString(msgGoogleSheetCellCoordinatesString, c_gDocsTbl.colAxis, c_gDocsTbl.rowAxis), 0, 0, 0)
EndFunction

int function BrailleAddObjectSpreadsheetCell()
var string header
header = GetTableRowHeaderText()
if header != cscNull
	BrailleAddString(header, 0, 0, 0)
endIf
header = GetTableColumnHeaderText()
if header != cscNull
	BrailleAddString(header, 0, 0, 0)
endIf
BrailleAddSpreadsheetCoordinates()
BrailleAddFocusLine()
return true
endFunction

int function BrailleAddObjectSpreadsheetRowOrColumn(string header, /*of the focus cell*/
	int FocusCellIndex, /*index of the focus cell in the column or row cell array*/
	string GetCellArrayFunc, /*function to get the cells in the row or column*/
	int ArrayAxisIndex, /*the row index of the row array, or column index of the column array*/
	string MoveTocellFunc) ;Formatted string used to call MoveToTableCell with parameters*/
var
	stringArray cells,
	int cellCount
cells = CallFunctionByName(GetCellArrayFunc)
cellCount = ArrayLength(cells)
var
	int index,
	int attribs,
	string cellText,
	string activateCellFuncAndParams
for index = 1 to cellCount
	attribs=0
	if index == FocusCellIndex
		if header != cscNull
			BrailleAddString(header, 0, 0, 0)
		endIf
		BrailleAddSpreadsheetCoordinates()
		SetStructuredSegmentAlignmentToLastStringAdded()
		attribs = GetCharacterAttributes () | attrib_highlight
	endIf
	activateCellFuncAndParams = formatString(MoveTocellFunc, index, ArrayAxisIndex)
	if cells[index] != cscNull
		cellText = cells[index]
	else
		cellText = cscSpace ; So a blank is shown with underline for an empty cell.
	endIf
	BrailleAddStringWithCallback(cellText, activateCellFuncAndParams, attribs) 
	BrailleAddStringWithCallback("|", activateCellFuncAndParams, 0) 
endFor
return true
endFunction

int function BrailleAddObjectSpreadsheetData()
var int row, int col
GetCellCoordinates (col, row)
if GIBrlTBLZoom == ZOOM_TO_CURRENT_CELL
	return BrailleAddObjectSpreadsheetCell()
endIf
var string MoveToCellFunc ;order of parameters determines whether to move to col,row or row,col
if GIBrlTBLZoom == ZOOM_TO_CURRENT_ROW
	MoveTocellFunc = "MoveToTableCell(%1,%2)"
	return BrailleAddObjectSpreadsheetRowOrColumn(GetTableColumnHeaderText(), col, "GetRowTextAsArray", row, MoveTocellFunc)
elif GIBrlTBLZoom == ZOOM_TO_CURRENT_COL
	MoveTocellFunc = "MoveToTableCell(%2,%1)"
	return BrailleAddObjectSpreadsheetRowOrColumn(GetTableRowHeaderText(), row, "GetColumnTextAsArray", col, MoveTocellFunc)
ElIf GIBrlTBLZoom == ZOOM_TO_CUR_ROW_AND_COLTITLES then
	BrailleRowWithColTitles(col,row)
	return true
ElIf GIBrlTBLZoom == ZOOM_TO_CUR_AND_PRIOR_ROW then
	BraillePriorAndCurRow(col, row)
	return true
endIf
return false
EndFunction

void function SayTableCoordinatesForSpeakTableCells(int tableNavDir, int bCellCoordsValid)
if !bCellCoordsValid || !GoogleDocsTableCoordsAnnouncement return endIf
var string sMessage
if tableNavDir == TABLE_NAV_NONE
	sMessage = GetCoordinateString(TABLE_NAV_NONE)
elif tableNavDir  == TABLE_NAV_VERTICAL
	sMessage = GetCoordinateString(TABLE_NAV_VERTICAL)
elif TABLE_NAV_HORIZONTAL == tableNavDir then
	sMessage = GetCoordinateString(TABLE_NAV_HORIZONTAL)
elif TABLE_NAV_TABLE_EXTENTS == tableNavDir then
	sMessage = GetCoordinateString(TABLE_NAV_TABLE_EXTENTS)
endIf
if sMessage
	SayUsingVoice (VCTX_message, sMessage, ot_position)
endIf
EndFunction

Void Function SpeakTableCells (int tableNavDir, int nPrevNumOfCells)
; This function has been modified from the default to
; 1. Set a time ticker to avoid doublespeaking from the event in IE,
;2. speak the axis names rather than col/row numbers. 
; The time ticker is necessary for the following reason.
; In IE, selectionContextEvents are not genuine events fired when the cursor moves.
;Rather, the event is triggered when something actually queries the NavArea causing the selectionContext to be detected, eg the table command to move to a new cell.
; Thus, making ShouldSpeakTableCellsOnScriptCall return false for IE would cause silence because nothing triggered the selectionContext detection, 
; and returning true would cause doublespeaking because the speaking of the cell manually would then generate the event.
; Thus, what we do is set a ticker when the cell is manually spoken, so that when the event is generated, its speech is suppressed if it occurs within a timeout threshold.
if !ShouldSpeakTableCellsOnScriptCall(tableNavDir)
|| TableErrorEncountered(tableNavDir)
	Return
EndIf
tableNavTimeTicker=GetTickCount()
var
	int nRow,
	int nCol,
	int nNumCols,
	int nNumRows,
	int bCellCoordsValid
bCellCoordsValid = GetTableCoordinatesForSpeakTableCells(nCol,nRow,tableNavDir)
nNumCols = GetCurrentRowColumnCount()
nNumRows = GetTableRowCount()
if TABLE_NAV_NONE == tableNavDir && bCellCoordsValid then
	if ShouldSpeakTableHeadersBeforeCellContent()
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
		SayCellEx ()
		SayTableCoordinatesForSpeakTableCells(tableNavDir,bCellCoordsValid)
	else
		SayCellEx ()
		SayTableCoordinatesForSpeakTableCells(tableNavDir,bCellCoordsValid)
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
	endIf
elif TABLE_NAV_VERTICAL == tableNavDir then
	if ShouldSpeakTableHeadersBeforeCellContent()
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
		SayCellEx ()
		SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
	else
		SayCellEx ()
		SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
	endIf
	SayTableCoordinatesForSpeakTableCells(tableNavDir,bCellCoordsValid)
elif TABLE_NAV_HORIZONTAL == tableNavDir then
	if ShouldSpeakTableHeadersBeforeCellContent()
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
		SayCellEx ()
	else
		SayCellEx ()
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
	endIf
	SayTableCoordinatesForSpeakTableCells(tableNavDir,bCellCoordsValid)
elif TABLE_NAV_ROW_EXTENTS == tableNavDir then
	SayCellEx ()
	SayTableExtentLocationForSpeakTableCells(tableNavDir, nRow, nCol, nNumRows, nNumCols)
elif TABLE_NAV_COLUMN_EXTENTS == tableNavDir then
	SayCellEx ()
	SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
	SayTableExtentLocationForSpeakTableCells(tableNavDir, nRow, nCol, nNumRows, nNumCols)
elif TABLE_NAV_TABLE_EXTENTS == tableNavDir then
	if ShouldSpeakTableHeadersBeforeCellContent()
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
		SayCellEx ()
		SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
		SayTableCoordinatesForSpeakTableCells(tableNavDir,bCellCoordsValid)
	else
		SayCellEx ()
		SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
		SayTableCoordinatesForSpeakTableCells(tableNavDir,bCellCoordsValid)
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
	endIf
elif TABLE_NAV_SAY_ROW == tableNavDir then
	SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
	Say (GetRowText (cscNull, cscNull, cmsgBlank1), OT_line)
elif TABLE_NAV_SAY_COLUMN == tableNavDir then
	SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
	Say (GetColumnText (cscNull, cscNull, cmsgBlank1), OT_line)
endIf
EndFunction

void function UpdateTableCache(string colHeader, string rowHeader, int NewCol, int NewRow)
c_gDocsTbl.ColHdr = colHeader
c_gDocsTbl.RowHdr = rowHeader
c_gDocsTbl.col = NewCol
c_gDocsTbl.row = NewRow
UpdateCachedAxisNames()
EndFunction

int function shouldSpeakTableCoordinates()
return GoogleDocsTableCoordsAnnouncement 
EndFunction

int function SupportsEditCallbacks()
; Usually we'd delegate to the internal function but in IE in Google Sheets, we must pretend that edit callbacks are supported or we'll get doublespeaking.
var int supportsEditCallbacksInternal =SupportsEditCallbacks()
if (GoogleSheetHasFocus() && !supportsEditCallbacksInternal)
	return true
endIf
return supportsEditCallbacksInternal
endFunction

;This function is called by HandleCustomWindows to speak a table cell when it gains focus after a focus changed event.
; In Google Sheets, we will ensure the user experience is the same as navigating to the cell by other means.
int function HandleTableCellFocus()
if !InTable() return false endIf
if !GoogleSheetHasFocus()
	return HandleTableCellFocus()
endIf
UpdateCachedAxisNames()
var int tableNavDir
if c_gDocsTbl.colAxis != c_gDocsTbl.priorColAxis
&& c_gDocsTbl.rowAxis != c_gDocsTbl.priorRowAxis
	tableNavDir=TABLE_NAV_TABLE_EXTENTS
elif c_gDocsTbl.colAxis != c_gDocsTbl.priorColAxis
	tableNavDir=TABLE_NAV_HORIZONTAL
elif c_gDocsTbl.rowAxis != c_gDocsTbl.priorRowAxis
	tableNavDir=TABLE_NAV_VERTICAL
else
	tableNavDir=TABLE_NAV_NONE
endIf
c_gDocsTbl.priorColAxis = c_gDocsTbl.colAxis
c_gDocsTbl.priorRowAxis = c_gDocsTbl.rowAxis
SpeakTableCells (tableNavDir, 0)
return true
EndFunction

string function GetSelectedText()
if !GoogleSheetHasFocus() then
	return GetSelectedText()
endIf

var
stringArray cells,
int index,
int cellCount,
string selectedText

let cells=GetSelectedCellsAsArray ()
let cellCount=ArrayLength(cells)

if cellCount==0 then
	return cscNull
endIf

for index=1 to cellCount
	let selectedText=selectedText+cells[index]
	let selectedText=selectedText+cscBufferNewline
endFor
return selectedText
endFunction

Void Function SelectingText(int nMode)
if DocsBrailleModeOff()
	return
EndIf

if !GoogleSheetHasFocus() then
; handles setting up for and finishing the process of selecting text
	SelectingText(nMode)
	return
endIf

var
	string strHighlightAfterSelect,
	string strUnselected,
	string strNewlySelected,
	int nChanged,
	int nStart,
	int nChars,
	int nLen

if nMode then
	let g_strHighlightBeforeSelect = GetSelectedText()
	let nSelectingText = nMode
else
	delay(3)
	ProcessNewText()
	let nSelectingText = 0
	let strHighlightAfterSelect = GetSelectedText()
	let	strUnselected = StringDiff(g_strHighlightBeforeSelect,strHighlightAfterSelect)
	if strUnselected then
		; if there's highlighted text prior to the selection command that
		; doesn't exist after the command, this is either because the command
		; deselected the text or the text scrolled off of the screen.
		; We assume that if the text was at the beginning of the old buffer
		; and it isn't in the new buffer, then it scrolled off.
		; This should be true except when selecting text from bottom to top,
		; and deselecting from top to bottom,
		; something that most people probably don't do
		if ! StringsOverlap(g_strHighlightBeforeSelect,strHighlightAfterSelect,nStart,nChars)
		|| nStart<2 then
			let nLen = stringLength(strUnSelected)
			SayTextSelection(cmsg214_L,strUnSelected,nLen==1)
		endIf
	endIf
	let strNewlySelected = StringDiff(strHighlightAfterSelect,g_strHighlightBeforeSelect)
	if strNewlySelected then
		let nLen = stringLength(strNewlySelected)
		SayTextSelection(cmsg215_L,strNewlySelected,
			nLen==1 || (nLen<=3 && stringContains(strNewlySelected,"\r")))
	endIf
endIf
endFunction

int function ShouldProcessSelectionChangedEvent( optional int source, optional string text)
var string MostRecentScript = GetScriptAssignedTo(GetCurrentScriptKeyName())
if MostRecentScript == "CopySelectedTextToClipboard"
|| MostRecentScript == "CutToClipboard"
|| MostRecentScript == "AppendSelectedTextToClipboard"
	return false
endIf
;now handle suppression where the user chooses to overwrite appended clipboard with copied text:
if IsOverWritingAppendedTextOnClipboard
	IsOverWritingAppendedTextOnClipboard = false
	return false
endIf
return ShouldProcessSelectionChangedEvent( source, text)
EndFunction

; This is overridden to ensure that header types are indicated.
void Function SayCellEx ()
SayCellEx ()
var int type=GetObjectSubtypeCode()

if type==WT_ROWHEADER || type==WT_COLUMNHEADER then 
	IndicateControlType (type)
endIf
endFunction

int function ShouldSkipLiveRegionEvent(string liveRegionText)
return (GetTickCount()-LastKeyPressTime) < KeyEchoWaitThreshold
&& DocsBrailleModeOff()
EndFunction

int function SpeakLiveRegionEvent(string text, int suggestedOutputType, int containsSpeechMarkup)
if TopAndBottomEdgeTimer
	unscheduleFunction (TopAndBottomEdgeTimer)
endIf
; Note: this gets called at the time the speech queue element is spoken. 
; You may override the Output type but do not Flash this in Braille if structured mode is enabled 
;as it may be presented in the structured data.
; return true if we speak from here, false to defer to internals.
if GDocsIsExpectingCommentFromLiveRegionEvent
	GDocsCurrentCommentText = text
	;Scheduling will allow us to prevent this announcement if the key is double tapped to request that it be shown in the virtual viewer:
	GDocsScheduleIDSpeakCommentOnRequest = ScheduleFunction("SpeakCommentOnRequest",GDocsSpeakCommentOnRequestWaitTime)
	return true
endIf
var int BrailleModeOff=DocsBrailleModeOff()
if (ShouldSkipLiveRegionEvent(text))
	return true
EndIf
if stringLength(text) == 1 && BrailleModeOff
	say(text,OT_CHAR) ;Ensure single characters are echoed indicating caps etc.
	return true
endIf
if ClipboardTextChanged == CLIPBOARD_APPENDED
	ClipBoardTextChanged = false
	SayMessage(OT_JAWS_MESSAGE, cmsgAppendedTextToClipboard_L, cmsgAppendedTextToClipboard_S)
	return true
endIf
; Braille mode is where content is presented in an editable application supporting text attributes and where Braille support is implemented like any other editor.
; When off, everything is communicated via live region so we must send what is spoken to the display or a Braille only user would have no way of using Google Docs.
if BrailleModeOff then
	BrailleLiveRegionEventText (smmStripMarkup (text), OT_HELP_BALLOON)
endIf
if !BrailleModeOff
	;Flash informational, valikdation or error messages:
	if StringStartsWith(text,scLiveRegion_HasDataValidationNotificationStartString )
	|| StringStartsWith(text,scLiveRegion_HasErrorNotificationStartString)
	|| StringContains (StringLower (text), scLiveRegion_HasFormula)
	|| StringContains (StringLower (text), scLiveRegion_HasComment)
		BrailleMessage(text)
	elif !GoogleSheetHasFocus()
		;Flash everything which hasn't been handled so far:
		BrailleMessage(smmStripMarkup(text))
	endIf
endIf
return false; so text still gets spoken by internals, do not call default or text will be sent to Braille unconditionally.
endFunction

prototype StringArray function GetTreeItemsTextAsArray()
prototype IntArray function GetTreeItemsStates()
Prototype int Function MoveToSiblingTreeItem(int itemIndex)
prototype int function GetCurrentTreeItemIndex()

int function BrailleAddObjectTreeSiblings()
var
	IntArray itemStates,
	; array of items from current tree level.
	stringArray items,
	; array index used for loop
	int itemIndex,
	; length of items array
	int itemCount,
	;text attributes of the focused tree item.
	int attribs,
	; callback function used for moving to a tree item when its routing button is pressed
	string activateItemFuncAndParams,
	; text to be displayed for focused item
	string itemText,
	int currentItem = GetCurrentTreeItemIndex()
items = GetTreeItemsTextAsArray()
itemCount=ArrayLength(items)
itemStates = GetTreeItemsStates()
for itemIndex = 1 to itemCount
	let attribs=0
	if itemStates[itemIndex]& STATE_SYSTEM_SELECTED then
		attribs = attrib_highlight
	EndIf

	if currentItem == itemIndex then
		SetStructuredSegmentAlignmentToLastStringAdded()
		attribs = GetCharacterAttributes () | attrib_highlight
	endIf

	let activateItemFuncAndParams=formatString("MoveToSiblingTreeItem(%1)",itemIndex)
	let itemText=items[itemIndex]
	BrailleAddStringWithCallback(itemText, activateItemFuncAndParams, attribs)
	if (itemIndex < itemCount) then
		BrailleAddStringWithCallback("|", activateItemFuncAndParams, 0)
	EndIf 
endFor
return true
endFunction

void function MoveToSiblingTreeItem(int itemIndex)
MoveToSiblingTreeItem(itemIndex)
EndFunction

int function IsReadOnlyEditObject()
if (DocsBrailleModeOff())
	return false
EndIf
return IsReadOnlyEditObject()
EndFunction

void function GetCharacterInfoForBackSpace(string byRef strChar, int byRef ContainsMarkup)
if (DocsBrailleModeOff())
&& GoogleDocumentType() != Google_Sheets
	strChar = cScNull
	ContainsMarkup = false
	return
EndIf

GetCharacterInfoForBackSpace(strChar, ContainsMarkup)
EndFunction

int function IsPrintableKey(string keyName)
if (StringLength (keyName) == 1)
	return true
EndIf

if (StringLength(StringSegment (keyName, "+", -1)) == 1)
&& StringSegmentCount (keyName, "+") == 2
&& (StringCompare (StringSegment (keyName, "+", 1), "shift") == 0)
	return true
EndIf

if (StringCompare (keyName, "space") == 0)
	return true
EndIf

return false
EndFunction

Void Function KeyPressedEvent (int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if (!nIsScriptKey
&& !MenusActive ()
&& IsPrintableKey(strKeyName))
	LastKeyPressTime = GetTickCount ()
EndIf

if (StringCompare (strKeyName, "backspace", false) == 0)
|| (StringCompare (strKeyName, "enter", false) == 0)
	lastKeyPressTime = 0
EndIf

KeyPressedEvent (nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function ProcessKeys(StringArray keys)
var
	int i,
	int keyStrokeCount = ArrayLength (keys)
for i = 1 to keyStrokeCount
if (keys[i,2] == "true") then
	PressKey(keys[i,1]);
else
	ReleaseKey(keys[i,1]);
EndIf
EndFor

PlayKeys()
EndFunction

StringArray function BuildKeysForMove(string firstKey, string secondKey)
var
	StringArray keys
keys = new StringArray[8,2]
keys[1,1] = "control"
keys[1,2] = "true"
keys[2,1] = "alt"
keys[2,2] = "true"
keys[3,1] = firstKey
keys[3,2] = "true"
keys[4,1] = firstKey
keys[4,2] = "false"
keys[5,1] = secondKey
keys[5,2] = "true"
keys[6,1] = secondKey
keys[6,2] = "false"
keys[7,1] = "alt"
keys[7,2] = "false"
keys[8,1] = "control"
keys[8,2] = "false"

return keys
EndFunction 

StringArray function BuildKeysForMoveWithShift(string firstKey, string secondKey)
var
	StringArray keys
keys = new StringArray[10,2]
keys[1,1] = "control"
keys[1,2] = "true"
keys[2,1] = "alt"
keys[2,2] = "true"
keys[3,1] = "shift"
keys[3,2] = "true"
keys[4,1] = firstKey
keys[4,2] = "true"
keys[5,1] = firstKey
keys[5,2] = "false"
keys[6,1] = secondKey
keys[6,2] = "true"
keys[7,1] = secondKey
keys[7,2] = "false"
keys[8,1] = "shift"
keys[8,2] = "false"
keys[9,1] = "alt"
keys[9,2] = "false"
keys[10,1] = "control"
keys[10,2] = "false"

return keys
EndFunction

void function ClearSpeakCommentGlobals()
GDocsIsExpectingCommentFromLiveRegionEvent = false
GDocsCurrentCommentText  = cscNull
EndFunction

void function SpeakCommentOnRequest()
if GDocsScheduleIDSpeakCommentOnRequest
	UnscheduleFunction(GDocsScheduleIDSpeakCommentOnRequest)
endIf
GDocsScheduleIDSpeakCommentOnRequest = 0
if GDocsCurrentCommentText
	Say(GDocsCurrentCommentText,OT_USER_REQUESTED_INFORMATION)
endIf
ClearSpeakCommentGlobals()
	EndFunction

void function ShowCommentTextInVirtualViewer()
if GDocsScheduleIDShowCommentTextInVirtualViewer
	UnscheduleFunction(GDocsScheduleIDShowCommentTextInVirtualViewer)
endIf
GDocsScheduleIDShowCommentTextInVirtualViewer = 0
EnsureNoUserBufferActive()
UserBufferAddText(GDocsCurrentCommentText +cscbufferNewLine)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferActivate()
JAWSTopOfFile()
SayAll()
ClearSpeakCommentGlobals()
EndFunction

script SpeakComment ()
if GDocsIsExpectingCommentFromLiveRegionEvent
	;The script was double-tapped.
	;The speak on request should be canceled,
	;the comment should instead be shown in the virtual viewer.
	;Because we must wait for the SpeakLiveRegion function to populate GDocsCurrentCommentText with the text,
	;we schedule the function to show the text if GDocsCurrentCommentText is not yet populated.
	;The functions which speak or show the comment are responsible for clearing relevant globals.
	if GDocsScheduleIDSpeakCommentOnRequest
		UnscheduleFunction(GDocsScheduleIDSpeakCommentOnRequest)
	endIf
	GDocsScheduleIDSpeakCommentOnRequest = 0
	if !GDocsCurrentCommentText
		GDocsScheduleIDShowCommentTextInVirtualViewer = ScheduleFunction("ShowCommentTextInVirtualViewer",GDocsShowCommentTextInVirtualViewerWaitTime)
	else
		ShowCommentTextInVirtualViewer()
	endIf
	return
endIf
if IsVirtualPCCursor () 
	;PerformScript MoveToNextHeading()
	SayMessage (OT_error, cmsgHTML5_L, cmsgHTML5_S)
	return
EndIf
if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf
var
	StringArray keys = BuildKeysForMove(ksAnnounce, ksComment)
GDocsIsExpectingCommentFromLiveRegionEvent = true
ProcessKeys(keys)
EndScript

Script MoveToNextComment ()
if IsVirtualPCCursor () 
	PerformScript MoveToNextCombo()
	return
EndIf
if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf
var
	StringArray keys = BuildKeysForMove(ksNext, ksComment)
ProcessKeys(keys)
if (!DocsBrailleModeOff())
	ScheduleFunction ("SayAfterQuickNav", 5, true)
EndIf
EndScript

Script MoveToPriorComment ()
if IsVirtualPCCursor () 
	PerformScript MoveToPriorCombo()
	return
EndIf
if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf
var
	StringArray keys = BuildKeysForMove(ksPrior, ksHeading)
ProcessKeys(keys)
if (!DocsBrailleModeOff())
	ScheduleFunction ("SayAfterQuickNav", 5, true)
EndIf
EndScript

Script MoveToNextHeading ()
if IsVirtualPCCursor () 
	PerformScript MoveToNextHeading()
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMove(ksNext, ksHeading)

ProcessKeys(keys)
;The heading will be announced by SpeakLiveRegionEvent.
EndScript

Script MoveToPriorHeading ()
if IsVirtualPCCursor () 
	PerformScript MoveToPriorHeading()
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMove(ksPrior, ksHeading)

ProcessKeys(keys)
;The heading will be announced by SpeakLiveRegionEvent.
EndScript

Script MoveToNextList()
if IsVirtualPCCursor () 
	PerformScript MoveToNextList()
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMove(ksNext, ksList)

ProcessKeys(keys)

if (!DocsBrailleModeOff())
	ScheduleFunction ("SayAfterQuickNav", 5, true)
EndIf
EndScript

Script MoveToPriorList()
if IsVirtualPCCursor () 
	PerformScript MoveToPriorList()
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMove(ksPrior, ksList)

ProcessKeys(keys)
if (!DocsBrailleModeOff())
	ScheduleFunction ("SayAfterQuickNav", 5, true)
EndIf
EndScript

Script MoveToNextTable()
if IsVirtualPCCursor () 
	PerformScript MoveToNextTable()
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMoveWithShift(ksNext, ksTable)

ProcessKeys(keys)
EndScript

Script MoveToPriorTable()
if IsVirtualPCCursor () 
	PerformScript MoveToPriorTable()
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMoveWithShift(ksPrior, ksTable)

ProcessKeys(keys)
EndScript

Script MoveToTableStart()
if IsVirtualPCCursor () 
	SayMessage (OT_error, cmsgHTML5_L, cmsgHTML5_S)
	return
EndIf

if !InTable () 
	SayMessage (OT_error, cMSGNotInTable_l, cMSGNotInTable_S)
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMoveWithShift(ksTable,ksTableStart)

ProcessKeys(keys)
EndScript

Script MoveToTableEnd()
if IsVirtualPCCursor () 
	SayMessage (OT_error, cmsgHTML5_L, cmsgHTML5_S)
	return
EndIf

if !InTable () 
	SayMessage (OT_error, cMSGNotInTable_l, cMSGNotInTable_S)
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMoveWithShift(ksTable,ksTableEnd)

ProcessKeys(keys)
EndScript

script SayPriorWord()
if GlobalActiveLayer == GoogleDocsLayerActive
&& InTable () 
	PerformScript MoveToRowStart()
	return
EndIf

PerformScript SayPriorWord()
EndScript

Script MoveToRowStart()
if IsVirtualPCCursor () 
	SayMessage (OT_error, cmsgHTML5_L, cmsgHTML5_S)
	return
EndIf

if !InTable () 
	SayMessage (OT_error, cMSGNotInTable_l, cMSGNotInTable_S)
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMoveWithShift(ksTable,ksRowStart)

ProcessKeys(keys)
EndScript

script SayNextWord()
if GlobalActiveLayer == GoogleDocsLayerActive
&& InTable () 
	PerformScript MoveToRowEnd()
	return
EndIf

PerformScript SayNextWord()
EndScript

Script MoveToRowEnd()
if IsVirtualPCCursor () 
	SayMessage (OT_error, cmsgHTML5_L, cmsgHTML5_S)
	return
EndIf

if !InTable () 
	SayMessage (OT_error, cMSGNotInTable_l, cMSGNotInTable_S)
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMoveWithShift(ksTable,ksRowEnd)

ProcessKeys(keys)
EndScript

script SayPriorLine()
ProcessTopAndBottomEdgeScheduler ()
PerformScript SayPriorLine()
EndScript

Script MoveToPreviousRow()
if IsVirtualPCCursor () 
	PerformScript ExitQuickNavLayer()
	PerformScript SayPriorLine()
	return
EndIf

if !InTable () 
	PerformScript SayPriorLine()
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMoveWithShift(ksTable,ksPreviousRow)

ProcessKeys(keys)
EndScript

script SayNextLine()
ProcessTopAndBottomEdgeScheduler ()
PerformScript SayNextLine()
EndScript

Script MoveToNextRow()
if IsVirtualPCCursor () 
	PerformScript ExitQuickNavLayer()
	PerformScript SayNextLine()
	return
EndIf

if !InTable () 
	PerformScript SayNextLine()
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMoveWithShift(ksTable,ksNextRow)

ProcessKeys(keys)
EndScript

script MoveToNextSpellingError()
var int x = getCursorCol(), int y = GetCursorRow ()
typeKey (ksNextSpellingError)
if !GoogleDocHasFocus() then
	SayCurrentScriptKeyLabel ()
	return
endIf
; Give time for Google Docs to move to the next or prior misspeling.
delay(3)
refresh() ; Ensure the cursor has updated its location
if (getCursorCol() != x || getCursorRow() != y) then
; We've moved
	SayWord()
else
	sayMessage(OT_STATUS, msgNoMoreMispelled_l, msgNoMoreMispelled_s)
endIf
endScript

script MoveToPriorSpellingError()
var int x = getCursorCol(), int y = GetCursorRow ()
typeKey (ksPriorSpellingError)
if !GoogleDocHasFocus() then
	SayCurrentScriptKeyLabel ()
	return
endIf
; Give time for Google Docs to move to the next or prior misspeling.
delay(3)
refresh() ; Ensure the cursor has updated its location
if (getCursorCol() != x || getCursorRow() != y) then
; We've moved
	SayWord()
else
	sayMessage(OT_STATUS, msgNoPriorMisspelled_l, msgNoPriorMisspelled_s)
endIf
endScript

Script QuickKeysLayerHelp ()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (msgQuickKeysLayerHelpScreenTitle)
UserBufferAddTextResultsViewer(msgQuickKeysLayerHelp)
endScript

void function KeymapChangedEvent(int iKeyCode, string sKeyName, int iKeyStatus)
if iKeyStatus == KeySequencePending
	if StringCompare(sKeyName,KeyLayer_GoogleDocs) == 0
		GlobalActiveLayer = GoogleDocsLayerActive
		SayMessage(ot_status,msgQuickNavigation)
		return
	EndIf
EndIf
if iKeyStatus == KeySequenceComplete
&& GlobalActiveLayer == GoogleDocsLayerActive
	PerformScript ExitQuickNavLayer()
EndIf
if iKeyStatus == KeySequenceCanceled 
	PerformScript ExitQuickNavLayer()
EndIf
KeymapChangedEvent(iKeyCode, sKeyName,iKeyStatus)
EndFunction

void function SayAfterQuickNav()
SayLine()
EndFunction

script ExitQuickNavLayer()
CancelLayeredKeySequence ()
let GlobalActiveLayer = NoLayerActive 

if !gSoundFilePath then
	return 
EndIf
PlaySound(gSoundFilePath)
EndScript

string function QuickSettingDisabledEvent (string settingID)
if (settingID == "VirtualCursorOptions")
	return qsxmlMakeDisabledSetting  (settingID, IsVirtualPCCursor ())
EndIf
return QuickSettingDisabledEvent (settingID)
endFunction

Script OpenQuickAccessBar()
	sayMessage (OT_ERROR, msgGoogleDocsQuickAccessBarConflictMessage)
OpenQuickAccessBar()
EndScript

int  function SayCellUnitEx(int UnitMovement, int wantErrors, int nextOrPriorCellShouldWrap)
if !GoogleSheetHasFocus()
	return SayCellUnitEx(UnitMovement, wantErrors, nextOrPriorCellShouldWrap)
endIf
if wantErrors && TableErrorEncountered(UnitMoveToTableNavDir(UnitMovement))
	Return false
endIf
var
	int iNavDir,
	int nPrevNumOfCells,
	int iPrevTableLevel
iPrevTableLevel = GetTableNestingLevel()
if !NavigateForSayCellUnitEx(UnitMovement, wantErrors, nextOrPriorCellShouldWrap, iNavDir, nPrevNumOfCells)
	;Note that because we are returning if no navigation occurs,
	;The SayCell script does not use this function to speak the current cell.
	return false
endIf
;Because table navigation causes a focus change in google Docs,
;function HandleTableCellFocus is responsible for speaking the cell when it gains focus.
EndFunction

void function MoveToNextHeadingLevelN(int nLevel)
if IsVirtualPCCursor () 
	MoveToNextHeadingLevelN(nLevel)
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
StringArray keys = BuildKeysForMove(ksNext, intToString(nLevel))

ProcessKeys(keys)

if (!DocsBrailleModeOff())
	ScheduleFunction ("SayAfterQuickNav", 5, true)
EndIf
endFunction

void function MoveToPriorHeadingLevelN(int nLevel)
if IsVirtualPCCursor () 
	MoveToPriorHeadingLevelN(nLevel)
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMove(ksPrior, intToString(nLevel))

ProcessKeys(keys)

if (!DocsBrailleModeOff())
	ScheduleFunction ("SayAfterQuickNav", 5, true)
EndIf
endFunction

Script MoveToNextHeadingLevelN(optional int nLevel)
if nLevel==0 then
	nLevel=stringToInt(StringRight(getCurrentScriptKeyName(),1))
endIf
MoveToNextHeadingLevelN(nLevel)
endScript

Script MoveToPriorHeadingLevelN(optional int nLevel)
if nLevel==0 then
	nLevel=stringToInt(StringRight(getCurrentScriptKeyName(),1))
endIf
MoveToPriorHeadingLevelN(nLevel)
endScript

Script MoveToNextSuggestion()
if IsVirtualPCCursor () 
	PerformScript MoveToNextUnvisitedLink()
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
StringArray keys = BuildKeysForMove(ksNext, ksSuggestion)

ProcessKeys(keys)

if (!DocsBrailleModeOff())
	ScheduleFunction ("SayAfterQuickNav", 5, true)
EndIf
EndScript

Script MoveToPriorSuggestion()
if IsVirtualPCCursor () 
	PerformScript MoveToPriorUnvisitedLink()
	return
EndIf

if SayAllInProgress ()
	sayMessage(OT_JAWS_MESSAGE, msgQuickNavUnavailableSayAll)
	return
EndIf

var
	StringArray keys = BuildKeysForMove(ksPrior, ksSuggestion)

ProcessKeys(keys)

if (!DocsBrailleModeOff())
	ScheduleFunction ("SayAfterQuickNav", 5, true)
EndIf
EndScript

Script AnnounceCursorLocation()
var
	StringArray keys = BuildKeysForMove(ksAnnounce, ksCursorLocation)

ProcessKeys(keys)

if (!DocsBrailleModeOff())
	ScheduleFunction ("SayAfterQuickNav", 5, true)
EndIf
EndScript

script SelectHTMLElement()
if IsVirtualPCCursor () || DocsBrailleModeOff() then 
	performScript SelectHTMLElement()
	return
endIf
; Docs Braille mode is on and we're focused on the document.
var
string selectedText=GetSelectedText(),
int index,
int startUnit

; schedule a function to read the final selection unit after we've passed a successful request on to the application or cleared the selection.
ScheduleFunction ("F8ReadSelectedUnit", 5, TRUE) 

if selectedText==cscNull  then
	startUnit = F8SelectSentence ; nothing selected, try sentence.
	gDocsSelectionType=F8SelectNothing 
elif gDocsSelectionType < F8SelectPage
	startUnit=gDocsSelectionType+1 
else ; the current page is selected, clear the selection
	startUnit=F8SelectNothing
	gDocsSelectionType=startUnit
	typeKey("LeftArrow") ; clear the current selection
	return
endIf
; Try select the next largest unit.
for index =startUnit to F8SelectPage
; If We successfully selected the requested unit, exit, otherwise try the next one.
	if SelectCurrentUnit(index) then
		gDocsSelectionType=index 
		return
	endIf
endFor
; If we get here, we tried to select current page but it was unsuccessful
; We should thus clear the selection so the next press of F8 will start again.
if selectedText!=cscNull then
	gDocsSelectionType=F8SelectNothing
	typeKey("LeftArrow") ; clear the current selection
endIf
endScript

void function F8ReadSelectedUnit()
var
string selectedText=GetSelectedText()
;sayinteger(gDocsSelectionType)
if selectedText==cscNull then
	SayMessage(OT_SELECT, cmsgNothingSelected)
	return
endIf
if gDocsSelectionType==F8SelectSentence then
	SayMessage(OT_SELECT, msgSelectSentence)
	return
endIf
if gDocsSelectionType==F8SelectParagraph then
	SayMessage(OT_SELECT, msgSelectParagraph)
	return
endIf
if gDocsSelectionType==F8SelectPage then
	SayMessage(OT_SELECT, msgSelectPage)
	return
endIf
endFunction

int function InSpellingAndGrammarCheckDialog()
return GetWindowClass(GetFocus()) == cwc_ChromeWindowClass
	&& DialogActive()
	&& GetWindowTitle() == scDlgName_SpellingAndGrammarCheck 
endFunction

int function XMLDomGetSuggestionNodeAndText(object byRef node, string byRef text)
node = Null()
text = null()
node = GetXMLDomDocNodeList("//Button")
if !node return false endIf
;we know of two different class names for the suggestions button:
var string itemSpec = "//Button[@class='goog-inline-block jfk-button jfk-button-standard docs-checkupdialog-suggestion-button docs-checkupdialog-suggestion-button-focused jfk-button-focused']"
var string altItemSpec = "//Button[@class='goog-inline-block jfk-button jfk-button-standard docs-checkupdialog-suggestion-button docs-checkupdialog-suggestion-button-focused']"
if !itemSpec
&& !altItemSpec
	node = Null()
	return false
endIf
node = GetXMLDomDocItem(itemSpec,altItemSpec)
if !node
	return false
endIf
var object attribs = node.Attributes
if !attribs
|| !attribs.GetNamedItem("label").NodeValue
	node = Null()
	return false
endIf
text = attribs.GetNamedItem("label").NodeValue
return true
EndFunction

script SelectALink()
if !InSpellingAndGrammarCheckDialog()
	PerformScript SelectALink()
	return
endIf	
var	object node,
	string text
if !XMLDomGetSuggestionNodeAndText(node,text)
	Say(msgCannotFindSpellingOrGrammarSuggestion,ot_error)
	return
endIf
if isSameScript()
	EnsureNoUserBufferActive()
	UserBufferAddText(text+cscBufferNewLine)
	UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	UserBufferActivate()
	JAWSTopOfFile()
	SayAll()
else	
	Say(text,ot_screen_message)
endIf
EndScript

int function BrailleAddObjectRowHdr(int nSubtype)
if GIBrlTBLZoom != ZOOM_TO_CURRENT_CELL return true endIf
If GIBrlTblHeader == HEADER_ROW
|| GIBrlTblHeader == HEADER_BOTH
|| GIBrlTblHeader == HEADER_Marked
	BrailleAddString(c_gDocsTbl.RowHdr,0,0,0)
EndIf
return true
EndFunction

int function BrailleAddObjectColHdr(int nSubtype)
if GIBrlTBLZoom != ZOOM_TO_CURRENT_CELL return true endIf
If GIBrlTblHeader & HEADER_COLUMN
|| GIBrlTblHeader == HEADER_BOTH
|| GIBrlTblHeader == HEADER_Marked
	BrailleAddString(c_gDocsTbl.ColHdr,0,0,0)
EndIf
return true
endFunction

int function BrailleAddObjectCoordinates(int nSubtype)
if GIBrlShowCoords
&& GIBrlTBLZoom == ZOOM_TO_CURRENT_CELL
	var string coordinates = formatString(cmsgColumnRowCoordinates, c_gDocsTbl.colAxis, c_gDocsTbl.rowAxis)
	BrailleAddString(coordinates,0,0,0)
endIf
return true
EndFunction

int function BrailleAddObjectContent(int nSubtype)
if GIBrlTBLZoom == ZOOM_TO_CURRENT_CELL
	BrailleAddFocusLine()
elif GIBrlTBLZoom == ZOOM_TO_CURRENT_ROW
	return BrailleAddDocumentTableRow()
elif GIBrlTBLZoom == ZOOM_TO_CURRENT_COL
	return BrailleAddDocumentTableColumn()
endIf
return true
EndFunction

int function BrailleAddDocumentTableRow()
var
	string s,
	string text,
	int colCount
If GIBrlShowCoords then
	text = FormatString(cmsgRowCoordinate,c_gDocsTbl.row)+cscSpace
endIf
if c_gDocsTbl.col > 1
	text = text+GetRowText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,1,c_gDocsTbl.col-1)+cscSpace+cmsgTableCellTextSeparator
EndIf
If GIBrlShowCoords then
	text = text+cscSpace+FormatString(cmsgColumnCoordinate,c_gDocsTbl.col)
endIf
if c_gDocsTbl.colHdr
	s = c_gDocsTbl.colHdr
	text = text+cscSpace+s
EndIf
if text then
	BrailleAddString(text,0,0,0)
	SetStructuredSegmentAlignmentToLastStringAdded();
endIf
BrailleAddFocusCell()
colCount = GetCurrentRowColumnCount()
if c_gDocsTbl.col < colCount
	text = cmsgTablePostFocusCellTextSeparator
		+GetRowText (cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,c_gDocsTbl.col+1,colCount)
else
	text = cmsgTablePostFocusCellTextSeparator
EndIf
BrailleAddString(text,0,0,0)
return true
EndFunction

int function BrailleAddDocumentTableColumn()
var
	string s,
	string text,
	int rowCount
If GIBrlShowCoords then
	text = FormatString(cmsgColumnCoordinate,c_gDocsTbl.col)+cscSpace
endIf
if c_gDocsTbl.row > 1
	text = text+GetColumnText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,1,c_gDocsTbl.row-1)+cscSpace+cmsgTableCellTextSeparator
EndIf
If GIBrlShowCoords then
	text = text+cscSpace+FormatString(cmsgRowCoordinate,c_gDocsTbl.row)
endIf
if c_gDocsTbl.rowHdr
	s = c_gDocsTbl.rowHdr
	text = text+cscSpace+s
EndIf
if text then
	BrailleAddString(text,0,0,0)
	SetStructuredSegmentAlignmentToLastStringAdded();
endIf
BrailleAddFocusCell()
rowCount = GetTableRowCount()
if c_gDocsTbl.row < rowCount
	text = cmsgTablePostFocusCellTextSeparator
		+GetColumnText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,c_gDocsTbl.row+1,rowCount)
else
	text = cmsgTablePostFocusCellTextSeparator
EndIf
BrailleAddString(text,0,0,0)
return true
EndFunction

Script QuickSettings ()
performScript quickSettings()
if googleDocHasFocus() then 
	refresh()
endIf
endScript

Script SaySelectedText()
if GoogleSlideHasFocus()
	var StringArray keys = BuildKeysForMove(ksAnnounce, ksSelected)
	ProcessKeys(keys)
	return
endIf
PerformScript SaySelectedText()
EndScript

int function InEditableTable()
if GetScriptAssignedTo (GetCurrentScriptKeyName ()) == "VirtualFind"
&& (GetTickCount () - GetLastKeyPressTime ()) < 500;half second
	;Find dialog was just invoked.
	;The edit field in the find dialog is inside a table,
	;but there will be no speech from table nav events.
	return false
endIf
return InEditableTable()
endFunction

void function TableEnteredEvent(int columns, int rows, int nesting, int col, int row, int uniform, int hasMarkedHeaders, int headersColumn, int headersRow )
if GoogleSheetHasFocus()
	;Google is making an update which causes table events to fire.
	;Since the entire document is a table, these anouncements are not wanted.
	return
endIf
TableEnteredEvent(columns, rows, nesting, col, row, uniform, hasMarkedHeaders, headersColumn, headersRow )
EndFunction

void function TableExitedEvent()
if GoogleSheetHasFocus()
	;Google is making an update which causes table events to fire.
	;Since the entire document is a table, these anouncements are not wanted.
	return
endIf
TableExitedEvent()
EndFunction

int function ShouldExitcellChangedEvent()
if GoogleDocumentType() == Google_Sheets
	;The cell change for sheets is announced as part of the focus change, we don't want an additional announcement from CellchangedEvent:
	return true
endIf
return ShouldExitcellChangedEvent()
EndFunction

void function SayTableCellOnCellChangedEvent()
if GlobalActiveLayer == TableLayerActive
	SayTableCellOnCellChangedEvent()
	return
endIf
var string scriptName = GetScriptAssignedTo(GetCurrentScriptKeyName())
if scriptName == "SaynextLine"
|| scriptName == "SayPriorLine"
	; When arrowing up/down into a table cell,
	; the CaretMovedEvent speaks the current line in the cell.
	; We do not want the entire cell to be additionally announced:
	return
endIf
SayTableCellOnCellChangedEvent()
EndFunction

int function ShouldUseDoSayObjectFromLevel( handle focusWindow, handle prevWindow)
if focusWindow == prevWindow 
	if GoogleSheetHasFocus()
		;Focus changes with depth greater than 1 results in the spreadsheet grid and its size being announced.
		;This is not desirable when editing a cell and then returning to the sheet from the edit bar,
		;nor after pressing delete to clear a cell's content,
		;nor when returning to the sheet from the docs menus.
		return false
	endIf
endIf
return ShouldUseDoSayObjectFromLevel( focusWindow, prevWindow )
EndFunction

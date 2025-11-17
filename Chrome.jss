; Copyright 2014-2023 by Freedom Scientific BLV Group, LLC
;Freedom Scientific script file for Google Chrome

include "HJConst.jsh"
include "HJGlobal.jsh"
include "HJHelp.jsh"
include "common.jsm"
include "Chrome.jsh"
include "Chrome.jsm"
include "MSAAConst.jsh"
include "UIA.jsh"
include "ie.jsm"

import "UIA.jsd"
use "IA2Browser.jsb"

const
Edge="msedge.exe",
ShiftKey = 0x800000,
CTRLKey = 0x10000,
key_LeftArrow = 0x4b,
key_RightArrow = 0x4d,
key_Home = 0x47,
key_End = 0x4f

globals
	intArray restrictedIDs,
	int gChromeVersion,
	int gChromeMinorVersion,
	int gChromeUpdateVersion,
	string appName,
	int lastFocusType,
	int lastKeyWasSelecting,
	int lastKeyWasScripted,
	string chromeAutoCompleteAddress

;gbIsBrowserUIDialog accesses the global from IA2Browser:
globals	int gbIsBrowserUIDialog

const
	scTabSearchTopChromeIdentifyer = "chrome://tab-search.top-chrome/"  ;address of the page which gains focus when Control+Shift+A is pressed

globals
	int gsDocID,  ;copied from IA2Browser.jss, used in SayNewDocumentTab
	int gsPrevDocID  ;copied from IA2Browser.jss, used in SayNewDocumentTab

;For scheduling announcement of descriptionChangedEvent while typing in the Tab Search edit field:
const
	DescriptionChangedEventAnnouncementWaitTime = 3  ;tenths of a second
globals
	int ScheduleIDDescriptionChangedEventAnnouncement,
	string gsDescriptionChangedEventText

;For scheduling SelectionChangedEvent when typing on the address bar,
;and for detecting when to announce a value change when tabbing:
const
	SayAutoCompleteAddressAfterPauseWaitTime = 6  ;tenths of a second
globals
	int ScheduleIDSayAutoCompleteAddressAfterPause

;For managing announcement of new tab page in BrowserTabChangedEvent:
globals
	int gChromeBrowserTabID,
	handle gChromeBrowserTabHWnd

;For detecting radio buttons in the chrome area of Chrome which generate no event when toggled:
globals
	int ScheduleIDUpdateAndSayNewStateOfRadioButton 


void function autoStartEvent()
GetFixedProductVersion(GetAppFilePath (), gChromeVersion, gChromeMinorVersion, gChromeUpdateVersion, 0)
appName = GetAppFileName ()
LoadNonJCFOptions ()
lastFocusType = wt_UNKNOWN
lastKeyWasSelecting = false
endFunction

int function ShouldNotifyIfContextHelp()
return OFF
endFunction

int function BrailleCallbackObjectIdentify()
if IsTouchCursor() return BrailleCallbackObjectIdentify() endIf
if GetObjectSubtypeCode() == wt_unknown
&& GetObjectRole() == Role_System_PageTabList
	return wt_tabControl
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectDescription(int nSubtypeCode)
if nSubtypeCode == wt_button
&& StringLower(GetObjectname()) == StringLower(GetObjectDescription())
	;Avoid information duplication, add nothing.
	return true
elif nSubtypeCode == wt_TabControl
&& GetObjectRole() == Role_System_PageTabList
	;Description duplicates information from name, add nothing.
	return true
endIf
return BrailleAddObjectDescription(nSubtypeCode)
EndFunction

int function BrailleAddObjectContextHelp(int nSubtypeCode)
return TRUE ; added no string, corrects later versions of Google 
endFunction

int function IsBrowserContentWindow(handle hwnd)
return GetWindowClass(hwnd) == wc_ChromeWindowClass
EndFunction

int function IsBrowserUIDialog()
return !UserBufferIsActive()
	&& GetWindowClass(getFocus()) == wc_Chrome_WidgetWin_1
	&& FindAncestorOfType(wt_dialog) != -1
EndFunction

int function ShouldUseDoSayObjectFromLevel( handle focusWindow, handle prevWindow )
return !gbIsBrowserUIDialog
	&& !IsOnAddressBarEdit()
EndFunction

string function GetDocumentNameFromRealWindow()
var
	string name
;No dom, so must get document name via RealWindowName (MSAA gets it)
name = GetWindowName(GetRealWindow(GetFocus()))
if StringContains(name,scTrimName_ChromeTitleBar)
	return StringChopRight(name,StringLength(scTrimName_ChromeTitleBar))
endIf
Return cscNull
EndFunction

string function GetBrowserName(optional int includeMaker)
if includeMaker
	return msgGoogleChromeAppName
else
	return msgChromeAppName
endIf
EndFunction

Script ScreenSensitiveHelp ()
if IsSameScript () then
	AppFileTopic(topic_Chrome)
	return
endIf
PerformScript ScreenSensitiveHelp()
EndScript

int function ShouldHandleParagraphNavigation()
var int isVirtualCursorTabSpecific = GetJCFOption(OPT_VirtualCursorIsTabSpecific )
var int vCursorSetting 
if isVirtualCursorTabSpecific then
	vCursorSetting = GetVirtualCursorSettingForTab(GetTabID())
else
	vCursorSetting = GetJCFOption (OPT_VIRTUAL_PC_CURSOR)
EndIf
	
if (vCursorSetting == 0) then
	return true
EndIf

if IsFormsModeActive() || IsInsideARIAApplication () then
	return true
EndIf

return false
EndFunction

void function CaretMovedEvent( int movementUnit,optional int source)
;In Chrome multiline edits, movementUnit is reported as 0.
if !movementUnit
&& lastKeyWasScripted
	var string scriptName = GetScriptAssignedTo(GetCurrentScriptKeyName())
	if scriptName == "ControlUpArrow"
		return CaretMovedEvent(Unit_Paragraph_Prior,source)
	elif scriptName == "ControlDownArrow"
		return CaretMovedEvent(Unit_Paragraph_Next,source)
	endIf
endIf
CaretMovedEvent( movementUnit,source)
EndFunction

void function UnitMoveControlNav (int UnitMovement)
if ShouldHandleParagraphNavigation() then 
	var int objType=GetObjectSubtypeCode ()
	if SupportsEditCallbacks ()
	&& objType != wt_multiline_edit
		;NextParagraph and PriorParagraph do not properly navigate in Chrome multiline edits.
		if UnitMovement == UnitMove_Next then
			NextParagraph()
		ElIf UnitMovement == UnitMove_Prior then
			PriorParagraph()
		EndIf
		return
	EndIf

	if UnitMovement == UnitMove_Next then
		TypeKey(cksControlDownArrow) 
	ElIf UnitMovement == UnitMove_Prior then
		TypeKey(cksControlUpArrow)
	EndIf

	pause()
	if objType == WT_TABCONTROL then
		sayWord()
	endIf
	return
endIf
return UnitMoveControlNav (UnitMovement)
endFunction

int function IsOnAddressBarEdit()
if GetWindowClass(GetFocus()) != wc_Chrome_WidgetWin_1 return false endIf
return lastFocusType == wt_edit
EndFunction

void function SayLineFromCaretMovedEvent(int movementUnit)
if IsOnAddressBarEdit()
	;The value change and selection change events will speak the address bar change:
	return
endIf
SayLineFromCaretMovedEvent(movementUnit)
EndFunction

int function ContractedBrailleInputAllowedNow ()
;event function designed to return FALSE on controls that would otherwise support contracted input.
;Example would be an application whose edit controls may also support quick navigation keys, once said keys are on return false from this function to turn them off.
;This function is only called when the item with focus supports contracted input to begin with.
if IsOnAddressBarEdit() then
	return false
endIf
return ContractedBrailleInputAllowedNow () ; Fall back to default.
endFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if IsBrowserContentWindow(curHwnd) && GetObjectSubtypeCode()==wt_comboBox then
	say(GetObjectValue(), OT_LINE)
	return
endIf

ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

void Function SayAutoCompleteAddressAfterPause ()
ScheduleIDSayAutoCompleteAddressAfterPause = 0
Say (chromeAutoCompleteAddress, OT_LINE, true)
SayMessage (ot_select, cmsg215_l)
chromeAutoCompleteAddress = cscNull
EndFunction

void function SelectionChangedEvent( string text, int wasTextSelected, optional int source )
if ScheduleIDSayAutoCompleteAddressAfterPause
	UnscheduleFunction(ScheduleIDSayAutoCompleteAddressAfterPause)
endIf
if IsOnAddressBarEdit() 
&& !lastKeyWasSelecting
	if !StringLength(getSelectedText())
		;This happens when successive presses of Control+T for a new tab occurs.
		;We get an irroneous selection change of text "address and".
		return
	endIf
	if wasTextSelected
		;When the first letter is entered into the search edit field,
		;the SecondaryFocusChangedEvent will probably, but not reliably, speak when the first letter is entered,
		;and at this point announcing the selection here would be spammy.
		;however, continuing to type in the search edit results in this event firing and not the SecondaryFocusChangedEvent.
		;We schedule a delay both to avoid spamming while typing,
		;and to give SecondaryFocusChangedEvent a chance to unschedule speaking of the selection change if that event fires.
		chromeAutoCompleteAddress = text
		ScheduleIDSayAutoCompleteAddressAfterPause = ScheduleFunction ("SayAutoCompleteAddressAfterPause", SayAutoCompleteAddressAfterPauseWaitTime, true)
	endIf
	;This event fires to remove the selection as you tab from the editable text.
	;Do nothing here when this event fires for the deselection, to avoid hearing the deselection when no longer in the editable text.
	return
endIf
;this is to keep selection event on an address bar from speaking when switching tabs
SelectionChangedEvent( text, wasTextSelected, source )
EndFunction

Void Function SecondaryFocusChangedEvent()
if ScheduleIDSayAutoCompleteAddressAfterPause
	UnscheduleFunction(ScheduleIDSayAutoCompleteAddressAfterPause)
endIf
if IsOnAddressBarEdit()
	;Speaking is handled by ValueChangedEvent
	return
endIf
SecondaryFocusChangedEvent()
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,optional int bIsFocusObject)
if IsOnAddressBarEdit()
&& bIsFocusObject
	;We want to announce the value change on the address bar when navigating,
	;and not when typing or deleting text.
	;SelectionChangedEvent will announce if the address bar text changes due to typing in new text.
	var string scriptName = GetScriptAssignedTo(GetCurrentScriptKeyName())
	if lastKeyWasScripted
	&& (scriptName == "SayNextLine"
	|| scriptName == "SayPriorLine"
	|| scriptName == "Tab"
	|| scriptName == "ShiftTab")
		Say(sObjValue,ot_line)
	endIf
	return
endIf
if (gChromeVersion < 69 
&& getObjectSubtypeCode()==wt_combobox) then
	return ;spoken from activeItemChanged event, filter here to avoid multiple speaking.
endIf
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
endFunction

void function SayLineUnit(int unitMovement, optional int bMoved)
if !IsVirtualPCCursor() && GetObjectSubtypeCode()==WT_COMBOBOX then
	return; ActiveItemChangedEvent will speak this.
endIf
SayLineUnit(unitMovement, bMoved)
endFunction

int function IsValidForTraverseBrowserUIDialogAndReadControls(string dlgName, object element)
return element.name != dlgName
EndFunction

script readBoxInTabOrder()
if gbIsBrowserUIDialog 
	;GetTypeAndTextStringsForWindow often retrieves text with duplications,
	;so we first try to use UIA to traverse and read the elements.
	if !ReadBrowserUIDialogBox()
		Say(GetTypeAndTextStringsForWindow(getFocus()), ot_USER_REQUESTED_INFORMATION)
	endIf
	return
endIf
performScript ReadBoxInTabOrder()
endScript

void function GetWindowTitleForApplication(handle hAppWnd, handle hRealWnd, handle hCurWnd, int iTypeCode,
	string ByRef sTitle, string ByRef sSubTitle, int ByRef bHasPage)
if IsBrowserContentWindow(hCurWnd)
	sTitle=GetObjectName(SOURCE_CACHED_DATA, GetAncestorCount ())
else
	GetWindowTitleForApplication(hAppWnd, hRealWnd, hCurWnd, iTypeCode, sTitle, sSubTitle, bHasPage)
endIf
endFunction

int Function HandleCustomAppWindows (handle hWnd)
; Alt tabbing to Chrome.
if getWindowClass(hWnd)==wc_Chrome_WidgetWin_1 then
	say(GetObjectName(SOURCE_CACHED_DATA, GetAncestorCount ()), ot_window_name)
	return true
endIf
return HandleCustomAppWindows (hWnd)
endFunction

Script PictureSmartWithControl (optional int serviceOptions)
return PictureSmartWithControlShared (PSServiceOptions_Single | serviceOptions)
EndScript

Script PictureSmartWithControlMultiService (optional int serviceOptions)
return PictureSmartWithControlShared (PSServiceOptions_Multi | serviceOptions)
EndScript

Int Function ShouldSpeakItemAtLevel(int level, int type, int parentType, int focusRole, int focusType)
var
	int ancestorRole = GetObjectRole(level),
	int ancestorCount = GetAncestorCount(),
	int dialogAncestor = FindAncestorOfType(wt_dialog),
	string ancestorName = cscNull,
	string dialogName = cscNull
if (ancestorRole == ROLE_SYSTEM_WINDOW && level == ancestorCount)
	if (dialogAncestor != -1)
		ancestorName = GetObjectName(SOURCE_CACHED_DATA, level)
		dialogName = GetObjectName(SOURCE_CACHED_DATA, dialogAncestor)
		if (ancestorName == dialogName)
			return false
		endIf
	endIf
	return true
EndIf
if (ancestorRole == ROLE_SYSTEM_WINDOW || ancestorRole == ROLE_SYSTEM_PANE)
	return false
EndIf
return ShouldSpeakItemAtLevel(level, type, parentType, focusRole, focusType)
EndFunction

int function NewBrowserTabIsNewPage(handle hWnd)
return gChromeBrowserTabHWnd != hWnd
EndFunction

void function AnnounceNewTabOrPageFromBrowserTabChangedEvent(handle hWnd)
;When Control+N is used, a new window opens and the focus change will speak the focused object.
;But when Control+T is used, a new tab is created but the focus does not change so we should also announce the focused object.
if !NewBrowserTabIsNewPage(hWnd)
	SayFormattedMessage(ot_screen_message, msgNewTabPage)
	SayObjectTypeAndText()
else
	SayFormattedMessage(ot_screen_message, msgNewWindow)
endIf
EndFunction

void function BrowserTabChangedEvent(int tabID, handle hWnd)
;fires when changing browser tabs.
if gChromeBrowserTabID != tabID
	;Ensure this announcement only happens if the new tab event is generated while on the address bar:
	if GetWindowClass(GlobalPrevFocus) == cwc_Chrome_WidgetWin_1
		AnnounceNewTabOrPageFromBrowserTabChangedEvent(hWnd)
	endIf
endIf
gChromeBrowserTabID = tabID
gChromeBrowserTabHWnd = hWnd
EndFunction

prototype int function GetTabID()
prototype int function GetVirtualCursorSettingForTab(int tabID)
prototype void function SetVirtualCursorSettingForTab(int tabID,int vCursorSetting)

Script VirtualPCCursorToggle ()
var int isVirtualCursorTabSpecific = GetJCFOption(OPT_VirtualCursorIsTabSpecific )
if (!isVirtualCursorTabSpecific ) then
	PerformScript VirtualPCCursorToggle() 
	return
EndIf
var int vCursorSetting = GetVirtualCursorSettingForTab(GetTabID())
if vCursorSetting == 0 then
	vCursorSetting = 1
else
	vCursorSetting = 0
endIf

refresh()
BrailleRefresh()

SetVirtualCursorSettingForTab(GetTabID(),vCursorSetting )
if vCursorSetting then
	SayFormattedMessage(ot_status, cMSG291_L, cmsgOn)
else
	SayFormattedMessage(ot_status, cmsg292_L, cmsgOff)
endIf
EndScript

int function SayLineInsteadOfSayAll()
var
	int type
Let type = GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0)
If IsPcCursor()
&& !IsVirtualPcCursor()
&& DialogActive() then
	if (type == WT_MULTILINE_EDIT) then
		return false
	EndIf
EndIf
return SayLineInsteadOfSayAll() 
EndFunction
int function ContextMenuProcessed(handle hWnd)
if (IsBrowserContentWindow(hwnd))
  return
EndIf

return ContextMenuProcessed (hwnd )
EndFunction

Void Function HandleUnknownAncestor (int level, int focusType, int pageIsChanging)
if (level < 1) then
	return
EndIf
  
if (GetObjectSubtypeCode(SOURCE_CACHED_DATA,level) != WT_UNKNOWN) then
	return
EndIf
 
if ( GetObjectName(SOURCE_CACHED_DATA, level) == "" ) then
	return
EndIf
 
var
	int ancestorCount,
	string focusedElementName,
	string ancestorElementName
 
focusedElementName = stringStripAllBlanks (GetObjectName(SOURCE_CACHED_DATA, 0))
ancestorElementName = stringStripAllBlanks (GetObjectName(SOURCE_CACHED_DATA, level))
ancestorCount = GetAncestorCount ()
if (level != ancestorCount 
&& (StringContains (ancestorElementName, focusedElementName))) then
	return 
EndIf

if GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0) == WT_UNKNOWN
	return ;focused object and ancestor object are both unknown types, just speak the focused object
EndIf

SayObjectTypeAndText (level)
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
lastFocusType = GetObjectSubTypeCode(false, 0)
if ScheduleIDUpdateAndSayNewStateOfRadioButton 
	UnscheduleFunction(ScheduleIDUpdateAndSayNewStateOfRadioButton )
	ScheduleIDUpdateAndSayNewStateOfRadioButton  = 0
endIf
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void function ProcessSayRealWindowOnFocusChange(
	 handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
if GetWindowClass(GlobalPrevFocus) !=wc_Chrome_WidgetWin_1
	if gbIsBrowserUIDialog 
		;A dialog from the browser UI has just gained focus.
		SayAndCacheBrailleForBrowserUIDialogNameAndText()
		return
	endIf
endIf
ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
EndFunction

int function IsKeySelectingText(int keyCode)
var int isShiftLeft = (keyCode&~ShiftKey) == key_LeftArrow
var int isShiftRight = (keyCode&~ShiftKey) == key_RightArrow
var int isShiftCTRLLeft = (keyCode&~(ShiftKey|CTRLKey)) == key_LeftArrow
var int isShiftCTRLRight = (keyCode&~(ShiftKey|CTRLKey)) == key_RightArrow
var int isShiftHome = (keyCode&~ShiftKey) == key_Home
var int isShiftEnd = (keyCode&~ShiftKey) == key_End
return (isShiftLeft 
	|| isShiftRight
	|| isShiftCTRLLeft 
	|| isShiftCTRLRight 
	|| isShiftHome
	||IsShiftEnd) 
EndFunction

void function UpdateAndSayNewStateOfRadioButton()
ScheduleIDUpdateAndSayNewStateOfRadioButton  = 0
if GetObjectStateCode() & CTRL_CHECKED
	;The toggle was detected:
	return
endIf
MSAARefresh()
Pause() ;Allow time to update
IndicateControlState(wt_RadioButton,GetObjectStateCode())
EndFunction

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
If KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey)
&& GetWindowClass(GetFocus()) == cwc_Chrome_WidgetWin_1
&& GetObjectSubtypeCode() == wt_RadioButton
	;We may not have received any events for updating the state:
	ScheduleIDUpdateAndSayNewStateOfRadioButton = ScheduleFunction("UpdateAndSayNewStateOfRadioButton",3)
	return true
endIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Void Function KeyPressedEvent (int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
lastKeyWasSelecting = IsKeySelectingText(nKey)
lastKeyWasScripted = nIsScriptKey
KeyPressedEvent (nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

int function IsOpenListBoxApplicable(handle hWnd, int iSubtype)
if (!IsFormsModeActive())
	return IsOpenListBoxApplicable(hWnd, iSubtype)
EndIf

return !SupportsEditCallbacks ()
EndFunction

int function IsCloseListBoxApplicable(handle hWnd, int iSubtype)
if (!IsFormsModeActive())
	return IsCloseListBoxApplicable(hWnd, iSubtype)
EndIf
return !SupportsEditCallbacks ()
EndFunction

prototype intArray function GetDetailsIDs(int details)
prototype string function GetTextForUniqueIDs(intArray ids,int idsCount)
prototype void function RestrictToElementsWithUniqueIDs(intArray ids,int idsCount)
prototype void function MoveToElementWithUniqueID(int id)

Script announceComment ()
var intArray ids = GetDetailsIDs(true)
var int idsCount = ArrayLength (ids)
if (idsCount == 0)
	SayMessage (OT_ERROR, msgNoCommentAvailable)
	return
EndIf

if isSameScript() then
	ResetSpeechMarkupAttributes()
	MoveToElementWithUniqueID(ids[1])
	RestrictToElementsWithUniqueIDs(ids,idsCount)
	restrictedIDs = ids
	return
EndIf

var string text = GetTextForUniqueIDs(ids,idsCount)
if (StringIsBlank (text))
	SayMessage (OT_ERROR, msgNoCommentTextAvailable)
	return
EndIf

text = msgComment + cscSpace + text
SayMessage (OT_JAWS_MESSAGE, text)
EndScript

int function IsInsideDetailsFor()
var intArray detailsForIDs = GetDetailsIDs(false)
var int idsCount = ArrayLength (detailsForIDs )
return (idsCount > 0) 
EndFunction 

Script UpALevel()
if (!IsInsideDetailsFor())
	PerformScript UpALevel()
	return 
EndIf

SayCurrentScriptKeyLabel ()
var intArray detailsForIDs = GetDetailsIDs(false)
Refresh()  ;used to unrestrict the document before moving back to the commented text.
MoveToElementWithUniqueID(detailsForIDs[1])
EndScript

void function FormsModeEvent(int bEntering, optional int lastMovementUnit)
var int idsCount = ArrayLength (restrictedIDs)
if (bEntering == false
&& idsCount)
	ScheduleFunction ("RestrictToSavedIDs", 1)
EndIf

FormsModeEvent(bEntering, lastMovementUnit)
EndFunction

void Function RestrictToSavedIDs()
var int idsCount = ArrayLength (restrictedIDs)
RestrictToElementsWithUniqueIDs(restrictedIDs,idsCount)
EndFunction

int function SpeakLiveRegionEvent(string text, int suggestedOutputType, int containsSpeechMarkup)
if SayAllInProgress () then
	return true ; Do not speak notifications during skimread or sayAll.
endIf
return SpeakLiveRegionEvent(text, suggestedOutputType, containsSpeechMarkup)
endFunction

int function InPageTabArea()
if isVirtualPCCursor() return false endIf
if GetWindowClass(getFocus()) != wc_Chrome_WidgetWin_1 return false endIf
var
	int i,
	int depth = GetAncestorCount()
for i = 1 to depth
	if GetObjectRole(i) == Role_System_PageTabList
		return true
	endIf
endFor
return false
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if nLevel == 0
	if InPageTabArea()
		;suppress description announcement from builtin SayObjectTypeAndText where the description information duplicates the name:
		var
			int type = GetObjectSubtypeCode(),
			string name = GetObjectname()
		if type == wt_button
		&& StringLower(name) == StringLower(GetObjectDescription())
			;The New Tab button differens only by case:
			IndicateControlType(wt_button,name,cmsgSilent)
			return
		elif type == wt_unknown
		&& GetObjectRole() == Role_System_PageTabList
			;We don't actually have a subtypeCode defined for this type of control yet.
			;For now, we will call it a tab control.
				IndicateControlType(wt_TabControl,name,cmsgSilent)
				IndicateControlState(wt_TabControl,GetObjectStateCode())
				return
		endIf
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

script SayLine(optional int drawHighlights)
if IsPCCursor()
&& InPageTabArea()
&& GetObjectSubtypecode() == wt_TabControl
	SayLine()
	;SayLine does not include the position in group of the tab,
	;and SayObjectTypeAndText will have out of date information about the position if the tab was shifted and focus has not yet moved.
	var object element = FSUIAGetFocusedElement()
	if !element return endIf
	var
		int x = element.positionInSet,
		int y = element.sizeOfSet
	if x && y
		Say(FormatString(cmsgPosInGroup1, IntToString(x), IntToString(y)),ot_position)
	endIf
	return
endIf
PerformScript SayLine()
EndScript

script SayNextWord()
;Allow shifting page tabs:
if IsPCCursor()
&& InPageTabArea()
&& GetObjectSubtypeCode() == wt_TabControl
	TypeKey(cksCtrlRightArrow)
	return
endIf
PerformScript SayNextWord()
EndScript

script SayPriorWord()
;Allow shifting page tabs:
if IsPCCursor()
&& InPageTabArea()
&& GetObjectSubtypeCode() == wt_TabControl
	TypeKey(cksCtrlLeftArrow)
	return
endIf
PerformScript SayPriorWord()
EndScript

script SelectNextWord()
;Allow shifting page tabs:
if IsPCCursor()
&& InPageTabArea()
&& GetObjectSubtypeCode() == wt_TabControl
	TypeKey(cksShiftControlRightArrow)
	return
endIf
PerformScript SelectNextWord()
EndScript

script SelectPriorWord()
;Allow shifting page tabs:
if IsPCCursor()
&& InPageTabArea()
&& GetObjectSubtypeCode() == wt_TabControl
	TypeKey(cksShiftControlLeftArrow)
	return
endIf
PerformScript SelectPriorWord()
EndScript

int function IsFocusedOnTabSearchTopChromePage()
;Control+Shift+A brings up the page chrome://tab-search.top-chrome/
return !UserBufferIsActive()
	&& GetWindowClass(GetFocus()) == wc_ChromeWindowClass
	&& GetDocumentPath() == scTabSearchTopChromeIdentifyer
EndFunction

void function DescriptionChangedEventAnnouncement()
ScheduleIDDescriptionChangedEventAnnouncement = 0
Say (gsDescriptionChangedEventText, OT_WINDOW_INFORMATION)
gsDescriptionChangedEventText = cscNull
EndFunction

void Function DescriptionChangedEvent(handle hwnd, int objId, int childId, int nObjType, string sOldDescription, string sNewDescription,optional int bFromFocusObject)
if bFromFocusObject
&& IsFocusedOnTabSearchTopChromePage()
	;sNewDescription contains text saying how many matches were found for the text in the search edit field.
	;This updates for each character typed into the edit field.
	;To avoid spamming while typing,the announcement is scheduled rather than spoken immediately.
	if ScheduleIDDescriptionChangedEventAnnouncement
		UnscheduleFunction(ScheduleIDDescriptionChangedEventAnnouncement)
	endIf
	gsDescriptionChangedEventText = sNewDescription
	ScheduleIDDescriptionChangedEventAnnouncement = ScheduleFunction("DescriptionChangedEventAnnouncement",DescriptionChangedEventAnnouncementWaitTime)
	return
endIf
DescriptionChangedEvent(hwnd, objId, childId, nObjType, sOldDescription, sNewDescription,bFromFocusObject)
EndFunction

int function InDialogWithDocumentDescendant()
if !dialogActive() return false endIf
var
	int i,
	int type,
	int role,
	int levels
;Start at level 0, just in case the dialog itself has focus.
levels = GetAncestorCount()+1
for i = 0 to levels
	type = GetObjectSubtypeCode(false,i)
	role = GetObjectRole(i)
	if type == wt_dialog
	|| role == ROLE_SYSTEM_DIALOG
		return false
	elIf type == WT_DOCUMENT
	|| role == ROLE_SYSTEM_DOCUMENT
		return true
	endIf
endFor
return false
EndFunction

int Function SayNewDocumentTab()
if IsFocusedOnTabSearchTopChromePage()
	var int documentLevel = GetDocumentLevel()
	if documentLevel > -1
		gsDocID = GetIDAtLevel(documentLevel)
		if gsDocID != gsPrevDocID
			Say(GetDocumentTitle(),ot_document_name)
			SayObjectTypeAndText()
			gsPrevDocID = gsDocID
			return true
		EndIf
	EndIf
EndIf
return SayNewDocumentTab()
EndFunction

void function DoBackSpace()
if !IsOnAddressBarEdit()
	DoBackSpace()
	return
endIf
var
	string sSelectedText = GetSelectedText(),
	int iTextSelected = !StringIsBlank(sSelectedText)
if !iTextSelected
	DoBackSpace()
	return
endIf
TypeKey(cksBackspace)
SayFormattedMessage(OT_MESSAGE, cMsgSelectionDeleted, cmsgSilent)
endFunction

void function MSAAAlertEvent(handle hwnd, int nTime, string sText, int nAlertLevel, string appName)
MSAAAlertEvent(hwnd, nTime, sText, nAlertLevel, appName)
if !nAlertLevel
&& c_BackgroundOCRRect.restrictedToCustomRect
	;The zoom level of the browser may have changed.
	;Set c_BackgroundOCRRect.shouldUpdateRect to true so the rectangle will be updated.
	c_BackgroundOCRRect.shouldUpdateRect = true
endIf
endFunction

void Function GetARIAActionsNameAndIndexes(string ByRef actionsString,IntArray byref actionIndexes)
var StringArray ariaActions = GetARIAActions()
if (ArrayLength(ariaActions) == 0)
	actionsString = ""
	return
EndIf
		
var int i
actionIndexes = new IntArray[ArrayLength(ariaActions)]

for i = 1 to ArrayLength(ariaActions)
	var StringArray actionItem = stringSplit(ariaActions[i],":",true)
	actionsString = StringConcatenate(actionsString, actionItem[1], LIST_ITEM_SEPARATOR)
	actionIndexes[i] = StringToInt (actionItem[2])
EndFor
EndFunction

Script DisplayARIAActions ()
var string actionsString 
var IntArray actionIndexes
GetARIAActionsNameAndIndexes(actionsString,actionIndexes)

if (StringLength (actionsString) == 0)
	SayMessage (OT_ERROR, msgNoActionsAvailable)
	return
EndIf

var int selectedItem = DlgSelectItemInList (actionsString, msgSelectActionTitle, false)
if (!PerformARIAActionByIndex(actionIndexes[selectedItem]))
	SayMessage (OT_ERROR, msgFailedToInvokeAction)
EndIf
EndScript


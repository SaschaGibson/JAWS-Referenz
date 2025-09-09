; Copyright 1995-2018 Freedom Scientific, Inc.
; Script file  for Microsoft Outlook 2013.

include "HjConst.jsh"
include "HjGlobal.jsh"
Include "MSAAConst.jsh"
include "UIA.jsh" ; // consts for UIA events and handlers
include "Outlook2010.jsh"
Include "MSOffice2007.jsm"
include "Outlook2007.jsm"
include "OutlookCustomSettings2007.jsh"
include "OutlookCustomSettings2007.jsm"
include "HjHelp.jsh"
include "common.jsm"
include "msoffice2010.jsh"
include "TutorialHelp.jsm"
include "Outlook Calendar.jsh"
include "Outlook Calendar.jsm"
Include "locale.jsh"

use "OutlookBrlClassic.jsb"
Use "OutlookMessageClassic.jsb"
Use "Outlook Functions Classic.jsb"
Use "Outlook Functions Common Classic.jsb"
use "Outlook Calendar Common Classic.jsb"
use "Outlook Calendar Classic.jsb"
use "WordClassic.jsb"
use "olUserOptions.jsb"
Use "OutlookCustomSettings2007.jsb"

import "OfficeClassic.jsd"
import "UIA.jsd"
import "FSIMouseSpeech.jsd"

;the following consts are added here to prevent duplicate constant definitions when the appropriate header is included:
const
	wc_MsoCommandBarDock = "MsoCommandBarDock"

;Consts returned by GetInfoForReadHeader
const
	GetInfoForReadHeader_Error = 0xffff,  ;not in message or dialog
	GetInfoForReadHeader_NotAvailable = 0,  ;header not available for message or dialog
	GetInfoForReadHeader_OK = 1  ;header info retrieved successfully

const
;category consts for foregroundGetCategory ()
; temprorarily here, untill we move to office.jsh instead of msoffice.jsh
	WCAT_UNKNOWN			0,
	WCAT_SDM					1,
	WCAT_TASK_PANE		2,
	WCAT_SINGLE_CLASS	3,
	WCAT_SPELL_CHECKER	4,
	WCAT_STATUSBAR_TOOLBAR	5,
	WCAT_DOCUMENT			10,

	MessageHighlightTickThreshold = 150,
	WC_CommandBarDock = "MsoCommandBarDock"

globals
	int globalInitializeOMScheduler, ; for initializing OM from focusChangedEvent
; data to schedule and use from valueChangedEvent
	collection globalAddressFieldsValueChangeCollection,
	; members:
	; int timerID, ; the ID of the scheduler
	; string text, ; text to speak, comes from valueChangedEvent
	; int hasRunBefore ; boolean if TRUE, valueChange indicates autoComplete, if false, will schedule, prevents latency.
; for list items customization speaking.
; 0 = new (use only UIA straight from application)
; 1 = use classic functionality (customized lists)
	int giCustomizeListItems,
; for the atMentions suggestions list:
	collection atmentionsActiveSuggestion,
	; properties:
	; element the FSUIA element
	; description the name of the list of suggestions (parent element)
int giFnScheduleSpellcheckInfo,
	String gsPreviewInfo,
	string gsPrevAppointmentDay,
	String GSPreviousItem,
	int MessageListHighlightTick,
	int PrevMessageListHighlightTick,
	Int CalendarTick,
	Int GlobalIPosition,
	Int GIPreviousLevel,
	int gbInRibbons,;	for char navigation, set in focusChangedEventEX
	int gbMoveByChar,
	int gbUsingWordNavQuickKeys,
	Int gbFocusChangedIsCalledOnSameWindow,	; to avoid unpredictable effects on incorrect call to FocusChangedEventEx function...
	String gsInfoBarContents,
	int GiIgnoreVirtualCursorSynchronized, ; to prevent extra speech from coming in from VirtualCursorSyncrhonizedEvent.
	Int giStatusBar,
	Handle ghQuickSearchAutoComplete,
	object g_OutlookUIAEvents,
	int OutlookUIAEventsWerHooked, ; // keeps DescriptionChangedEvent from firing when UIA is used for Contacts.
	object G_OutlookStructureChange, ; // StructureChangedEvent, we are no longer removing event handlers from objects themselves.
	object nullObject,
	Int iDescriptionChangedEventSuppress,	; to suppress DescriptionChangedEvent in case the folder is changed: set in ProcessEventOnFocusChange and cleared in DescriptionChangedEvent.
	int OutlookUpdateVersion

CONST
	AutoCompleteListEnterSound = "Click1.wav",
	AutoCompleteListExitSound = "Click2.wav"
	
GLOBALS
; prevent list entered and list exited sounds from consistently going off:
	object autocompleteListElement ,
; position in group from UIA elements who support it.	
	string gsBrlAutoCompletePosition

; For announcing with a different voice - no translation is needed...
Messages
@MSG_VoiceNameStart_Template
<VOICE NAME="%1">
@@
@MSG_MessageVoiceStartTemplate
<VOICE NAME="MESSAGEVOICE">
@@
@MSG_VoiceNameForceTemplate
<FORCE>
@@
@MSG_VoiceNameEnd_Template
</VOICE>
@@
; template for creating string id for windows...
@MSG_Template
%1,%2
@@
EndMessages

int function IsControllerForPropertyAvailableForAddressFields ()
; don't hook / watch for UIA events in older versions of Outlook where JAWS or Outlook may become unstable, nor in Windows 7!
if !IsWindows8() return false endIf
if outlookVersion < 16 then return FALSE endIf
if outlookVersion > 16 then return TRUE endIf
return OutlookUpdateVersion >= 8500
endFunction

int function IsUIACalendarParsingAvailable ()
; only available in 16 or later, 
; but in 16 must be build 7766 or greater.
if outlookVersion < 16 then return FALSE endIf
if outlookVersion > 16 then return TRUE endIf
return OutlookUpdateVersion > 7766
endFunction

int function UpdateCurrentCalendarInfoCollection ()
if ! IsUIACalendarParsingAvailable () then return FALSE endIf
var
	string textFromUIA = getObjectName (TRUE),
	int i, int count, int length,
	string tmp, string key, string value,
	string itemDelim = "\n", string fieldDelim = ":",
	string calendarString;
if GetObjectSubTypeCode () != WT_TABLECELL then return 0 endIf
; in some contexts, "grid" classes 
; like OutlookGrid and SuperGrid will cause JAWS to crash on builtin::ParseOutlookCalendarUIAText
if stringContains (stringLower (getWindowClass (getFocus ())), "grid") return endIf
PrevCalendarInfo = new collection
; because we have no other context to know the difference between date and time only change, 
; only copy the cdollection after the last key was pressed.
if ! isKeyWaiting () then
PrevCalendarInfo = collectionCopy (currentCalendarInfo)
endIf
currentCalendarInfo = new collection
calendarString = ParseOutlookCalendarUIAText (textFromUIA, GetUserLocaleInfo (LOCALE_SABBREVLANGNAME))
if ! calendarString then return 0 endIf
count = stringSegmentCount (calendarString, itemDelim)
; when the parser fails, it will return a string of 1 entry Status:Failure
if count < 2 then return 0 endIf
for i=1 to count
	tmp = stringSegment (calendarString, itemDelim, i)
	key = stringSegment (tmp, fieldDelim, 1)
	length = stringLength (key)+1; include the colon as field delimitor.
	value = stringChopLeft (tmp, length)
	value = stringTrimLeadingBlanks (StringTrimTrailingBlanks (value))
	currentCalendarInfo[key] = value
endFor
return CollectionItemCount (currentCalendarInfo) > 1
endFunction

string function GetRelevantStringFromCurrentCalendarInfoCollection ()
if ! IsUIACalendarParsingAvailable () then return cscNull endIf
var string tmp, string result = cscNull
; returns the context-specific calendar info from UIA as parsed by internal functions and stored in CurrentCalendarInfo collection.
;types of info:
; appointment, date, and time change.
; appointment = tab to it in the calendar.
; date = when arrowing left and right.
; time = when arrowing up and down in day view.
if ! CollectionItemCount (currentCalendarInfo) then return cscNull endIf
if ! stringIsBlank (currentCalendarInfo[Key_Subject]) then ; appointment, meeting or other event
	tmp = currentCalendarInfo[Key_Subject]
	result = tmp+cscBufferNewLine
	tmp = currentCalendarInfo[Key_time]
	if ! stringIsBlank (tmp) result = result+tmp+cscBufferNewLine endIf
	tmp = currentCalendarInfo[Key_organizer]
	if ! stringIsBlank (tmp) result = result+tmp+cscBufferNewLine endIf
else; date / time
	if stringCompare (PrevCalendarInfo[Key_date], CurrentCalendarInfo[key_date]) != 0 then
	; date change such as arrow left / right in Day View, or when moving by time and crossing days.
		tmp = CurrentCalendarInfo[key_date]
		result = result+tmp+cscBufferNewLine
	endIf
; time change such as up / down arrow in day view when time doesn't cross days.
	tmp = currentCalendarInfo[key_time]
	result = result+stringTrimLeadingBlanks (stringTrimTrailingBlanks (tmp))
	tmp = cscNull
	if currentCalendarInfo[Key_TotalNumberOfEvents] > 0 tmp = currentCalendarInfo[key_TotalNumberOfEventsAsString] endIf
	if tmp result = result+tmp+cscBufferNewLine endIf
	tmp = cscNull
	if currentCalendarInfo[Key_BusyEvents] > 0 tmp = currentCalendarInfo[Key_BusyEventsAsString] endIf
	if tmp result = result+tmp+cscBufferNewLine endIf
endIf
if stringLength (result) <= 5 then result = cscNull endIf
;sayInteger (stringLength (result))
return result
endFunction

string function getAndCleanUpObjectNameForCalendar (optional string objectName)
if OutlookVersion < 16 then return FALSE endIf
; Office 2016 Professional (RTM)
; who must use the Outlook Calendar instead of the MSAA info.
if OutlookUpdateVersion < 500 then return FALSE endIf
var string name = objectName
if ! name then name = getObjectName (TRUE) endIf
if stringStartsWith (name, ",") then
	name = stringChopLeft (name, 1)
	name = stringTrimLeadingBlanks (name)
endIf
return name
endFunction

string function getSupergridItemValueFromMSAA ()
var
	string item,
	string name = getObjectName (TRUE),
	string value = getObjectValue (TRUE)
if stringContains (value, scUnreadFlag) then
	item = value+cscBufferNewLine+getObjectName (TRUE)
else
	item = getObjectName (TRUE)+cscBufferNewLine+value
endIf
return item
endFunction

void function SayCell ()
if isCalendarView () then
	if ! stringIsBlank (currentCalendarData) then
		say (CurrentCalendarData, OT_LINE)
		return
	endIf
endIf
return sayCell ()
endFunction

void function SayCellCoordinatesInfo(optional int iOutputType)
; for modern outlook UIA table support, no coordinates should speak.
var string windowClass = getWindowClass (getFocus ())
if windowClass == "OutlookGrid" || windowClass == "SUPERGRID" then return endIf
SayCellCoordinatesInfo(iOutputType)
endFunction

int function GetUnreadMessageCountFromUIATree ()
; Office 2013 with Folder pane set to be minimized, the MSAA window of interest is in a separate hierarchy
; than the window with focus.
; Office 2016 and later has the unread message count as part of the name.
; In all other cases, we care about the window with focus.
var handle window = FindWindow(0,"wbpopup")
if (!window || !IsWindowVisible(window)) THEN
	window = GetFocus()
EndIf
; if the tree is not in focus, this function will cause Outlook 2013 to hang:
if GetObjectSubTypeCode () != WT_TREEVIEWITEM then return 0 endIf
var object tree = GetMSAAObjectTree(window)
var object focusedFolder= tree.FindByKeyboardFocus(1)
if (!focusedFolder) THEN
	return 0
EndIf
return StringToInt(focusedFolder.value)
EndFunction

int function GetTreeViewSelectedStateFromUIA ()
; This replaces the now-obsolete usage of the following call which stopped working after JAWS 13:
; GetControlAttributes () & CTRL_SELECTED
;This function's caller should already establish the right tree view has focus where the calendar view is active.
var object pattern, object element = CreateUIAFocusElement (ON) ; get the leaf node
globalBrlUIACalendarTreeItemCheckedState = FALSE
if ! element then return FALSE endIf
; there's a check box next to the leaf node, so we'll get its state:
element = CreateUIAFirstChildOfElement (element)
if ! element || element.controlType != UIA_CheckBoxControlTypeId then return endIf
pattern = element.getTogglePattern()
if ! pattern then return FALSE endIf
; Braille cache stores the state bit to get the string in BrailleAddObjectState:
if (pattern.ToggleState > 0) then
	globalBrlUIACalendarTreeItemCheckedState = CTRL_CHECKED
else
	globalBrlUIACalendarTreeItemCheckedState = CTRL_UNCHECKED
endIf
; want to be absolutely sure we're only returning 0 or 1,
; as this code is called to replace older on / off check
return (pattern.ToggleState > 0)
endFunction

void function VirtualCursorSyncrhonizedEvent()
; Override of internal which will prevent extra reading of the word,
; where the virtual cursor was, on opening the same message twice.
if GiIgnoreVirtualCursorSynchronized then GiIgnoreVirtualCursorSynchronized = OFF return EndIf
return VirtualCursorSyncrhonizedEvent()
endFunction

String Function GetWindowIDString (Handle hWnd)
Var
	Handle hTemp = GetFirstChild (hWnd),
	Int iNextID = GetControlID (hTemp),
	String sID = IntToString (iNextID)

If hTemp	; has child windows.
	If Not iNextID
		iNextID = GetWindowSubtypeCode (hTemp)
		sID = IntToString (iNextID)
	EndIf
	While hTemp
		hTemp = GetNextWindow (hTemp)
		iNextID = GetControlID (hTemp)
		If Not iNextID
			iNextID = GetWindowSubtypeCode (hTemp)
		EndIf
		sID = FormatString (MSG_Template,sID, IntToString (iNextID))
	EndWhile
Else
	sID = cScNULL
EndIf
Return (sID)
EndFunction

int function isInRibbons ()
return inRibbons ()
endFunction

Script ScriptFileName ()
ScriptAndAppNames (msgMsOutlook2013)
EndScript

Void Function Say (String sText, Int iOutput, Optional Int iBehaviour)
var
	String sSegment,
	Int iLoop

If IsMessagesList () then
	If StringSegmentCount (sText, cScBufferNewLine) > 1
	&& StringContains (sText, "MESSAGEVOICE") then
		While iLoop < StringSegmentCount (sText, cScBufferNewLine)
			let iLoop = iLoop + 1
			let sSegment = StringSegment (sText, cScBufferNewLine, iLoop)
			If StringContains (sSegment, MSG_MessageVoiceStartTemplate)
				SayUsingVoice (VCTX_MESSAGE, smmStripMarkup (sSegment), iOutput)
			Else
				Say (sSegment, iOutput, iBehaviour)
			EndIf
		EndWhile
		Return TRUE
	EndIf
EndIf
Return (Say (sText, iOutput, iBehaviour))
EndFunction

Void Function InfoBarShowEvent (handle hWnd)
var
	int iType,
	int iState,
	string sValue

if !giOutlookInfoBarVerbosity then
	return
endIf

getWindowText (hwnd, READ_EVERYTHING)
let ghOutlookInfoBar=hWnd
GetObjectInfoByName (hWnd, wn_InfoBar, 1, iType, iState, sValue)
;When getObjectInfoByName fails get as text:
if stringIsBlank (sValue) then
	Let sValue = getWindowText (hwnd, READ_EVERYTHING)
endIf
Say(sValue,ot_screen_message)
if GetControlID (GetFocus ()) != ciGridView then ; Avoid obliterating list items with Braille Messages.
	BrailleMessage (sValue)
endIf
gsInfoBarContents = sValue
EndFunction

Void Function InfoBarHideEvent (handle hWnd)
ghOutlookInfoBar = Null ()
gsInfoBarContents = cScNull
EndFunction

int Function IsMessagesList ()
var
	Handle hFocus,
	Int iControlID,
	Int iFolderType,
	String sWindowClass

If IsInOutlookMainWindow (getFocus()) then
	let iFolderType = GetFolderType ()
	If Not iFolderType	; personal message lists...
	|| iFolderType == 1	; list of appointments...
	|| iFolderType == 2	; Contact list...
	|| iFolderType == 3	; To do list...
	|| iFolderType == 6	; Shared public message lists...
		If Not DialogActive () then
			let hFocus = GetFocus ()
			let iControlID = GetControlID (hFocus)
			let sWindowClass = GetWindowClass (hFocus)
			If sWindowClass == wc_OutlookGrid
			&& iControlID == ciGridView then
				Return (TRUE)
			EndIf
		EndIf	; Dialogue is not active...
	EndIf	; message containing folder...
endIf
Return (FALSE)
EndFunction

Int Function IsTasksList ()
var
	Handle hFocus,
	Int iControlID,
	Int iFolderType,
	String sWindowClass

If IsInOutlookMainWindow (getFocus()) then
	let iFolderType = GetFolderType ()
	If iFolderType == 3	; Tasks folder...
		If Not DialogActive () then
			let hFocus = GetFocus ()
			let iControlID = GetControlID (hFocus)
			let sWindowClass = GetWindowClass (hFocus)
			If sWindowClass == wc_OutlookGrid
			&& iControlID == ciGridView then
				Return (TRUE)
			EndIf
		EndIf	; Dialogue is not active...
	EndIf	; Tasks containing folder...
endIf
Return (FALSE)
EndFunction

Int Function IsNavigationPane ()
Var
	int iSubTypeCode
let iSubTypeCode = GetSubTypeCode (GetFocus ())
If !iSubTypeCode Then
	let iSubTypeCode = GetObjectSubTypeCode ()
EndIf
If GetWindowClass (GetFocus ()) == wc_NetUIHWND Then
	If iSubTypeCode == WT_TREEVIEWITEM
	|| iSubTypeCode == WT_RADIOBUTTON
	|| iSubTypeCode == WT_LINK Then
		return TRUE
	EndIf
EndIf
return FALSE
EndFunction

Int Function IsMessageTextWindow (handle hWnd)
var
	Handle hMainApplicationWindow

let hMainApplicationWindow = GetAppMainWindow (hWnd)
If StringContains (StringLower (GetActiveConfiguration ()), StringLower (StringSegment (GetOwningAppName (hMainApplicationWindow), cScPeriod, 1))) then	; Sending from Outlook must distinguish between main window and message window...
	If Not FindWindow (hMainApplicationWindow, wc_Rctrl_RenWnd32, cScNULL)
		Return (TRUE)
	Else
		Return (GetWindowClass (GetParent (hWnd)) != wc_Rctrl_RenWnd32)
	EndIf
Else	; sending not from Outlook, this can be only message window...
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

Int Function IsInOutlookMainWindow (handle hWnd)
var
	Handle hMainApplicationWindow,
	Handle hCommandBarDock

let hMainApplicationWindow = GetAppMainWindow (hWnd)
let hCommandBarDock = FindWindow (hMainApplicationWindow, WC_CommandBarDock, cScNull)
If hCommandBarDock then
	While GetWindowClass (GetNextWindow (hCommandBarDock)) == WC_CommandBarDock
		let hCommandBarDock = GetNextWindow (hCommandBarDock)
	EndWhile
	If GetFirstChild (hCommandBarDock) then
		Return (GetWindowClass (hMainApplicationWindow) == wc_Rctrl_RenWnd32)
	EndIf
EndIf
Return (FALSE)
EndFunction

Int Function IsWindowADistributionList (handle hWnd)
If GetWindowClass (hWnd) == WC_DistributionList
&& GetControlID (hWnd) == ID_DistributionList then
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

String Function GetHighlightedColours ()
Var
	string sJCFFile = GetUserSettingsDirectory () + cScDoubleBackSlash + GetActiveConfiguration () + cScPeriod + jcfFileExt,
	String sInfo,
	String sColours,
	Int i

sInfo = IniReadSectionNames (sJCFFile)
If Not StringContains (sInfo, "Highlight Colors")
	sJCFFile =  GetSharedSettingsDirectory () + cScDoubleBackSlash + GetActiveConfiguration () + cScPeriod + jcfFileExt
	sInfo = IniReadSectionNames (sJCFFile)
EndIf
If Not StringContains (sInfo, "Highlight Colors")
	Return (cScNULL)
EndIf
sInfo = IniReadSectionKeys ("Highlight Colors", sJCFFile)
For i = 1 to StringSegmentCount (sInfo, "|")
	sColours = sColours + StringSegment (StringSegment (sInfo, "|", i), "/", 2) + ","
EndFor
Return (stringChopRight (sColours, 1))
EndFunction

Int Function IsMessageSelected ()
Var
	Int iLeft,
	Int iRight,
	Int iTop,
	Int iBottom,
	Int xPos,
	Int yPos

If IsCalendarView ()
	Return TRUE
EndIf
If IsMessagesList ()
	If GetObjectRect (iLeft, iRight, iTop, iBottom, TRUE)
		xPos = iLeft + ((iRight - iLeft) / 2)
		yPos = iTop + 3
		If StringContains (GetHighlightedColours (), ColorToRGBString (GetColorAtPoint (xPos, yPos)))
			Return (TRUE)
		EndIf
	EndIf
EndIf
Return (FALSE)
EndFunction

Int Function IsInBackStageView ()
Var
	Int iDepth = GetAncestorCount (),
	Int iLevel,
	Int iFlag

If GetObjectSubTypeCode () == WT_TABCONTROL
&& GetObjectSubTypeCode (FALSE, 1) == WT_MENUBAR
&& GetObjectSubTypeCode (FALSE, 2) == WT_DIALOG_PAGE
	Return (TRUE)
EndIf
For iLevel = 0 to iDepth
If GetObjectValue (TRUE, iLevel) == "SLAB"
	iFlag = 1
ElIf GetObjectSubTypeCode (FALSE, iLevel) == WT_DIALOG_PAGE
&& (! StringIsBlank (GetObjectName (TRUE, iLevel)))
&& iFlag == 1
	iFlag = 2
ElIf GetObjectSubTypeCode (FALSE, iLevel) == WT_DIALOG_PAGE
&& StringIsBlank (GetObjectName (TRUE, iLevel))
&& iFlag == 2
	iFlag = 3
EndIf
EndFor
If iFlag == 3
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

Int Function IndicateControlTypeAndState (Optional Int iType, String sName, Int iState, String sValue)
Var
	String sOutput,
	Handle hFocus = GetFocus (),
	Int iStateFirst = ReadSettingInteger (section_OPTIONS, hKey_SayStateFirst, FALSE, FT_DEFAULT_JCF),
	Int iTypeFirst = ReadSettingInteger (section_OPTIONS, hKey_SayWindowTypeFirst, FALSE, FT_DEFAULT_JCF),
	Int iTextOptions = toTypeAfter / (3 * iTypeFirst + 1)

If Not iType
	iType = GetWindowSubtypeCode (hFocus)
EndIf
If Not iType
	iType = GetObjectSubtypeCode ()
EndIf
If StringIsBlank (sName)
	sName = GetObjectName (TRUE)
EndIf
If StringIsBlank (sName)
	sName = GetWindowName (hFocus)
EndIf
If iType == WT_DIALOG
	If shouldItemSpeak (OT_DIALOG_NAME)
		Say (smmMarkupString (sName, iTextOptions, iType), OT_DIALOG_NAME, TRUE)
		Return (TRUE)
	EndIf
Else
	If ShouldItemSpeak (OT_CONTROL_NAME)
		sOutput = smmMarkupString (sName, iTextOptions, iType)
	EndIf
EndIf
If Not iState
	iState = GetControlAttributes ()
EndIf
If iState
	iTextOptions = iTextOptions | (toStateAfter / (3 * iStateFirst + 1))
EndIf
Say (smmMarkupString (sName, iTextOptions, iType, iState), OT_CONTROL_NAME, TRUE)
If StringIsBlank (sValue)
	sValue = GetObjectValue (TRUE)
EndIf
If StringIsBlank (sValue)
	sValue = GetWindowText (hFocus, TRUE)
EndIf
Say (sValue, OT_SELECTED_ITEM)
Return (TRUE)
EndFunction

handle Function GetRealWindow (handle hWnd)
var
	handle hParent
if GetWindowSubTypeCode (hWnd) == WT_TREEVIEW then
	Let hParent = GetParent (hWnd)
	if GetWindowSubTypeCode (hParent) == WT_DIALOG then
		return hParent
	EndIf
EndIf
return GetRealWindow (hWnd)
EndFunction

Int Function SayTutorialHelpHotKey (handle hHotKeyWindow, int IsScriptKey)
var
	String sRealWindowName,
	String sShortcut,
	Int iControlID

let sRealWindowName = GetWindowName (GetRealWindow (hHotKeyWindow))
let iControlID = GetControlID (hHotKeyWindow)
; To announce the hotkeys for the fields in new meeting, new appointment and new journal dialogues...
If StringContains (sRealWindowName, scMeetingDialog)
|| StringContains (sRealWindowName, scAppointmentDialog)
|| StringContains (sRealWindowName, scJournalDialogue) then
	let sShortcut = GetCurrentObject (0).accKeyboardShortcut
	If Not StringIsBlank (sShortcut) then
		Say (sShortcut, OT_ACCESS_KEY)
	EndIf
	Return (TRUE)
EndIf
Return (SayTutorialHelpHotKey (hHotKeyWindow, IsScriptKey))
EndFunction

int function SayTutorialHelp (int iObjType, optional int nIsScriptKey)
if getObjectName () == wn_InfoBar then return TRUE endIf
return SayTutorialHelp (iObjType, nIsScriptKey)
endFunction

Void Function TutorMessageEvent (handle hwndFocus, int nMenuMode)
var
	int iSpeakAccessKeys,
	Int iSpeakTutorMessage,
	Int iControlID,
	String sFocusClassName,
	String sRealWindowName

;suppress tutor messages when returning to message body from a ribbon or dialog, etc.
If Not globalRealWindow then	; no real window...
	return
endIf
if InRibbons () then
	Return tutorMessageEvent(hwndFocus, nMenuMode)
endIf
let iControlID = GetControlID (hwndFocus)
let iSpeakAccessKeys=ShouldItemSpeak (OT_ACCESS_KEY)
Let iSpeakTutorMessage = ShouldItemSpeak (OT_TUTOR)
If (iControlID == idc_24
&& GetWindowName(hWndFocus)==wn_Owner)
&& (iSpeakAccessKeys == 1
|| iSpeakAccessKeys == 3) Then
	Return
ElIf (iControlID == Message_Field
|| iControlID == Message_Window_ID)
&& TypeOfItem (giIsMessage,giIsTask)==scMessageItem Then
	; Keeps Alt+j from announcing as hotkey for message field.
	Return
EndIf
; Calendar handling...
If IsCalendarView () then
;	If gbUpDownNavigation
;	|| gbLeftRightNavigation Then
;		Return
;	EndIf
	If IsNavigationPane ()
	&& gbUpDownNavigation
		Return
	EndIf
	; To avoid announcements of tutor messages on typing text in the edit box...
	If (! IsCalendarViewAppointmentEditBox ())
	&& GetObjectSubTypeCode () == WT_EDIT
	&& gbFocusChangedIsCalledOnSameWindow then
		Return
	EndIf
	Return (TutorMessageEvent (hwndFocus, nMenuMode))
EndIf
If GetWindowSubtypeCode (hwndFocus) == WT_CONTEXTMENU
&& GetObjectSubTypeCode () == WT_MENU then	; to avoid double speaking of the access key on activating context menu...
	Return TutorMessageEvent (hwndFocus, nMenuMode)
EndIf
let sRealWindowName = GetWindowName (GetRealWindow (hWndFocus))
If StringContains (sRealWindowName, scMeetingDialog)
|| StringContains (sRealWindowName, scAppointmentDialog)
|| StringContains (sRealWindowName, scJournalDialogue)
|| getWindowClass (hwndFocus) == cwc_RichEdit20WPT then
	Return tutorMessageEvent(hwndFocus, nMenuMode)
EndIf
If IsMessagesList ()
&& gbUpDownNavigation
	Return
EndIf
tutorMessageEvent(hwndFocus, nMenuMode)
EndFunction

void function ScreenStabilizedEvent(handle hwndLastScreenWrite)
var
	Handle hFocus,
	Handle hStatusBar,
	String sRealWindowName,
	String sInfo,

	String sFocusClass

if IsVirtualRibbonActive() then
	return ScreenStabilizedEvent(hwndLastScreenWrite)
endIf
;for setting focus to a message body when the message is in Compatibility mode:
if getWindowClass(hwndLastScreenWrite)==wc_MerenguePane
&& StringContains(GetWindowName(GetFocus()),wn_CompatibilityMode) then
	SetFocus(FindWindow(GetAppMainWindow(GetFocus()),wc_wwg)) ; instead of wc_documentWindowParentClass which is what has the focus.
	let gbWordIsWindowOwner=true
endIf

if gbWordIsWindowOwner then
	return ScreenStabilizedEvent(hwndLastScreenWrite)
EndIf

let hFocus = GetFocus ()
let sFocusClass = GetWindowClass (hFocus)
let sRealWindowName = GetWindowName (GetRealWindow (hFocus))
; The next branch is for those situations where focus gets lost...
If Not hFocus Then
	let giFocusHasBeenLostID=ScheduleFunction(sf_RedirectLostFocus,4)
EndIf
if AdvancedFindingItems then
	if GetWindowClass(hWndLastScreenWrite) == wc_OutlookGrid
	&& sFocusClass == wc_OutlookGrid then
		let AdvancedFindingItems = false
	EndIf
EndIf
; To announce the folder name with number of read and unread messages on pressing Space...
If giReadFolderInfo then
	If sFocusClass == wc_NetUIHWND then
		let sInfo = stringChopRight (sRealWindowName, StringLength (StringSegment (sRealWindowName, SC_Dash, -1)) + 1)
;		Say (sInfo, OT_DIALOG_NAME)
		let hStatusBar = FindWindowWithClassAndId (GetRealWindow (hFocus), WC_StatusBarMainWindow, ciStatusBar)
		If (! IsCalendarView ()) then
			Say (GetWindowName (hStatusBar), OT_CONTROL_NAME)
		EndIf
		let giReadFolderInfo = giReadFolderInfo - 1
		If giReadFolderInfo == 1 then
			SayMessage (OT_POSITION, msgOneUnread_L, FormatString (msgUnread_S, IntToString (giReadFolderInfo)))
		ElIf giReadFolderInfo then
			SayMessage (OT_POSITION, FormatString (msgUnread_L, IntToString (giReadFolderInfo)), FormatString (msgUnread_S, IntToString (giReadFolderInfo)))
		EndIf
	EndIf
	let giReadFolderInfo = FALSE
	Return
EndIf
; Call default...
ScreenStabilizedEvent(hwndLastScreenWrite)
EndFunction

Void Function DoExtraMenuProcessing()
;To keep context menus in SuperGrid list view from reading real window in context menu.
var
	handle focusWindow
let focusWindow = getFocus ()
if (globalMenuMode == MENU_ACTIVE
&& findWindow (getAppMainWindow (focusWindow), wc_OutlookGrid)) then
	if ! getWindowSubtypeCode (focusWindow) then ; non-standard menu bar.
		typeKey (cksDownArrow)
	endIf
	return menuModeHook (); Keep app window from talking too much.
endIf
return DoExtraMenuProcessing()
endFunction

Void Function RedirectLostFocus ()
var
	Handle hWnd

; When focus gets lost trying to move to one of Outlook's main areas...
If !GetFocus() Then
	If GlobalCurrentControl==ciGridView Then
		let hWnd = FindWindowWithClassAndId(GlobalAppWindow,wc_OutlookGrid,ciGridView)
	EndIf
	If GlobalCurrentControl == id_ok then
		let hWnd = FindWindowWithClassAndId (GlobalAppWindow, cWc_Button, ciCustomViewFormatColumnsButton)
	EndIf
	If hWnd then
		SetFocus (hWnd)
	EndIf
EndIf
Return
EndFunction

void function loadNonJCFOptions ()
;most globals not directly linked to NonJCFOptions may not be strictly necessary, but include for completeness.
let giTableDescription=getNonJcfOption ("TableDescription") ; on by default
let gbBrlUseOSM=getJcfOption (OPT_BRL_USE_OSM) ; off by default, using hybrid.
let gbAnnounceCellCoordinates=getNonJCFOption ("AnnounceCellCoordinates")
let globalDetectLanguages=getJcfOption(opt_Language_detection) ; off by default in Outlook
let giMSOfficeHeadingIndication=getJCFOption (OPTHEADINGINDICATION)
giOutlookMessageHeaderVerbosity= GetNonJCFOption ("MessageHeaderVerbosity") ; off by default
giOutlookMessageTypeVerbosity= GetNonJCFOption ("MessageTypeVerbosity") ; off by default
giOutlookMessageSayAllVerbosity= GetNonJCFOption ("MessageSayAllVerbosity") ;  off by default
gbMessageLinkCountIndication = GetNonJCFOption ("MessageLinkCountIndication")
;best place to do this, ensuring we never use virtual cursor in read-only messages when MAGic is running:
if getRunningFSProducts () & product_MAGic then
	;Arbitrarily ensure we never use virtual cursor when in read-only documents:
	setJCFOption (OPT_USE_VPC_INSTEAD_OF_ENHANCED_EDIT_FOR_READONLY_DOCS, OFF)
endIf
giCustomizeListItems = getNonJCFOption ("UseJAWSCustomization")
loadNonJCFOptions ()
endFunction

void function AutoStartEvent ()
let giTicksInAutostart=GetTickCount() ;to prevent unknown function calls when switching script configurations.
let gbDialogFirstActivation=FALSE
let OutlookVersion = GetProgramVersion (GetAppFilePath ())
GetFixedProductVersion (GetAppFilePath (), 0, 0, OutlookUpdateVersion, 0)
if OutlookVersion >= 16 then
	InitializeOutlookObjects () 
	g_OutlookUIAEvents = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
endIf
let ghOutlookWindow=GetAppMainWindow(GetFocus())
let gbDeletingMessageFromList=FALSE
let gbFocusHasChanged=TRUE
let gbOutlookIsActive=TRUE
g_OutlookUIAEvents = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest")
if !OutlookHasRunBefore then
	GetLocaleData () ; Sets several locale parameters used in the calendar.
  let OutlookHasRunBefore = TRUE
EndIf
; Load personal preferences
let giOutlookSelCtxBeforeCaretMoveBitFlagOrderMask=SelCtxTables|selCtxStyle|selCtxBorders
;LoadApplicationSettings () ; legacy
loadNonJCFOptions () ; All settings now stored in jcf.
let gbWordIsWindowOwner=false
let gbActiveItemChanged=false
let giAppointmentFound = FALSE
;let giCalendarView=GetCalendarView()
let giViewChangeHasSpoken=FALSE
ResetMessageFlagVariables ()
let giDeleteGroupByFlag  = FALSE
let iScheduledFunctionId=FALSE
let iSuppressCheckForBold = false
let gsSpeechFilter = cScNull
let gsBrailleFilter = cScNull
BrailleRefresh()
globalAddressFieldsValueChangeCollection = new collection
if ! IsControllerForPropertyAvailableForAddressFields () then
; for older versions of Outlook where controllerFor UIA property is not used
; avoid latency on first use in valueChangedEvent
	globalAddressFieldsValueChangeCollection.hasRunBefore = TRUE
else
	globalAddressFieldsValueChangeCollection.hasRunBefore = FALSE
endIf
EndFunction

string Function GetDialogStaticText ()
var
	handle hDlg,
	handle hWnd,
	STRING STMP,
	string sDlgText;
Let sDlgText = GetDialogStaticText ()
If ! StringIsBlank (sDlgText) then
	Return sDlgText
EndIf
Let hWnd = GetFocus ()
Let hDlg = GetRealWindow (hWnd)
;If ! StringContains (GetWindowName (hDlg), scAttachment) then;Too Exclusive, just look for richedit.
If ! FindWindow (hDlg, cwc_RichEdit20WPT) then
	Return sDlgText
EndIf
Let hWnd = GetFirstWindow (hWnd)
While (hWnd
&& (GetWindowSubtypeCode (hWnd) == WT_STATIC || GetWindowSubtypeCode (hWnd)  == WT_READONLYEDIT))
	if SdlgText then
		Let sDlgText = sDlgText+cscSpace
	EndIf
	Let stmp = GetWindowText (hWnd, READ_EVERYTHING)
	if ! StringIsBlank (stmp) then
		Let sDlgText = (sDlgText+stmp);
	EndIf
	Let hWnd = GetNextWindow (hWnd)
ENDWHILE
Return sDlgText
EndFunction

void Function SayWindowTypeAndText (handle hWnd)
;Attachments richedit field:
if hWnd == getFocus () && IsAttachmentsListField() then
	;indicateControlType (WT_EDIT, getWindowName (hWnd), getWindowText (hWnd, FALSE))
	sayControlEXWithMarkup (hWnd, getWindowName (hWnd), getWindowType (hWnd), "", "", "", getWindowText (hWnd, FALSE))
	return
endIf
if GetWindowClass (hwnd) == wcReListBox then
	SayControlEXWithMarkup (hwnd, "", "", "", "", "", GetObjectName (TRUE))
	return
endIf
If getControlID (hwnd) == sent_Field
&& GetWindowSubtypeCode (hwnd) == WT_READONLYEDIT then
; control has no name, but prior window is static, so richedit specific function  doesn't pcik this one up.
; the following var list are all empties just placeholders for the param list for SayControlEXWithMarkup:
	var string ControlType, string ControlState, string ContainerName, string ContainerType
	SayControlEXWithMarkup (hwnd, scSentField, ControlType, ControlState, ContainerName, ContainerType,
		GetWindowText (hwnd, READ_EVERYTHING) 
	)
	return
endIf
If hWnd != GetRealWindow (GetFocus ()) then
	Return SayWindowTypeAndText (hWnd)
EndIf
If IsMultipageDialog () then
	Return SayWindowTypeAndText (hWnd)
EndIf
SayWindowTypeAndText (hWnd)
;If StringContains (GetWindowName (hWnd), scAttachment) then;Too exclusive, look for dialogs  with richedit:
If FindWindow (hWnd, cwc_RichEdit20WPT) then
	Say (GetDialogStaticText (), OT_DIALOG_TEXT)
EndIf
EndFunction

int function BrailleAddObjectdescription (int subtype)
; for atmentionsActiveSuggestion menu items:
if subtype == WT_MENU 
&& CollectionItemsCount (atmentionsActiveSuggestion) then
	BrailleAddString (atmentionsActiveSuggestion.description, 0,0,0)
	return TRUE
endIf
return BrailleAddObjectDescription (subtype)
endFunction

int function BrailleAddObjectName (int nSubtypeCode)
; for atmentionsActiveSuggestion menu items:
if nSubtypeCode == WT_MENU 
&& CollectionItemsCount (atmentionsActiveSuggestion) then
	BrailleAddString (atmentionsActiveSuggestion.element.name, 0,0,ATTRIB_HIGHLIGHT)
	return TRUE
endIf
	if nSubtypeCode == WT_LISTBOX || nSubtypeCode == WT_LISTBOXITEM then
		if stringContains (stringLower (getWindowClass (getFocus ())), "grid") then
		; folderts like tasks, notes and calendar lists:
			return outlookBrlClassic::BrailleAddObjectName (nSubtypeCode) 
		endIf
	endIf
; where certain read-only fields are not getting their name from the Braille file, scoping issue:
if nSubtypeCode == WT_READONLYEDIT
&& getWindowClass (GetFocus ()) == cwc_RichEdit20WPT then
	return OutlookBrlClassic::BrailleAddObjectName (nSubtypeCode)
endIf
return BrailleAddObjectName (nSubtypeCode)
endFunction

int function BrailleAddObjectValue (int Type)
; Outlook 2013-specific Braille problem with Attachments list box.
var
	handle hWnd = getFocus (),
	string windowClass = getWindowClass (hwnd),
	int nAttribBits,
	string value
if Type == WT_EXTENDEDSELECT_LISTBOX && GetWindowClass (hwnd) == wcReListBox then
	BrailleAddString (GetObjectName (TRUE), 0,0,ATTRIB_HIGHLIGHT)
	return TRUE
elif type == WT_COMBOBOX then
	; avoid conflict with combo box code for ribbons:
	if dialogActive () then
	; combo boxes in dialogs can erroneously use the name when first setting focus to them.
		value = getObjectValue (TRUE)
		if ! StringIsBlank (value) then
			BrailleAddString (value, getCursorCol (), getCursorRow (), ATTRIB_HIGHLIGHT)
			return TRUE
		endIf
	endIf
elIf type == WT_LISTBOX 
&& getControlID (hwnd) == app_AllAttendeesList then
	value = getObjectName (TRUE)
	BrailleAddString (value, 0,0,GetCharacterAttributes ())
	return TRUE
endIf
if ! giCustomizeListItems then
	if (type == wt_ListBox
	|| type == (WT_CUSTOM_CONTROL_BASE+WT_WT_MESSAGES_LIST)) then
		windowClass = GetWindowClass(GetFocus())
		if windowClass == wc_SuperGrid || windowClass == wc_OutlookGrid then
			if GetObjectStateCode (TRUE) == STATE_SYSTEM_DEFAULT then
				;0 = no item selected, 0x100 = STATE_SYSTEM_DEFAULT, instead of normal selection.
				nAttribBits = ATTRIB_HIGHLIGHT
			endIf
			BrailleAddString (getSupergridItemValueFromMSAA (), getCursorCol(),getCursorRow(),nAttribBits)
			return TRUE
		endIf
	endIf
endIf
return BrailleAddObjectValue (Type)
endFunction

int function BrailleAddObjectPosition (int type)
if type == WT_EDIT || type == WT_MULTILINE_EDIT then
	BrailleAddString (gsBrlAutoCompletePosition, 0,0,0)
	return TRUE
endIf
return BrailleAddObjectPosition (type)
endFunction

string function GetContactsListFocusItemData()
var
	string sData,
	object oFocus,
	object o,
	string s
let oFocus = GetUIAObjectFocusItem()
if !oFocus then
	return cscNull
EndIf
let o = oFocus.firstChild
while o
	let s = o.Name
	if !StringIsBlank(s) then
		let sData = sData+"\n"+s
	EndIf
	let o = o.nextSibling
EndWhile
return StringChopLeft(sData,1)
EndFunction

void function HookSearchSuggestionsInUIA ()
var
	int i, int count,
	object o, object controllerFor, object element = FSUIAGetFocusedElement ()  
if ! element then return endIf
controllerFor = element.controllerFor
if ! controllerFor then return endIf
count = controllerFor.count 
if ! count then return endIf
ComAttachEvents (g_OutlookUIAEvents, "OutlookUIA")
for i=0 to count-1
	o = controllerFor(i)
	g_OutlookUIAEvents.AddAutomationEventHandler(UIA_SelectionItem_ElementSelectedEventId, o, TREESCOPE_SUBTREE); as element gets selected
	g_OutlookUIAEvents.AddAutomationEventHandler(UIA_SelectionItem_ElementRemovedFromSelectionEventId, o, TREESCOPE_SUBTREE); as element gets selected
	if getWindowClass (getFocus ()) == cwc_Word_Document then
	; for @Mentions feature in Outlook 2016 and later
		g_OutlookUIAEvents.AddAutomationEventHandler(UIA_StructureChangedEventId, o, TREESCOPE_SUBTREE) 
	endIf
	giHasAddressAutoComplete = TRUE
endFor
endFunction

int function UIAListenForAtMentionsSearchSuggestions ()
if getWindowCategory () != WCAT_DOCUMENT
|| IsActiveDocumentProtected () then
; outside of message document window, or not in message composition window:
	return FALSE
endIf
var object element = FSUIAGetFocusedElement () ; search for deepest focus
if ! element then return FALSE endIf
if ! g_OutlookUIAEvents then
	g_OutlookUIAEvents = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
endIf
if ! g_OutlookUIAEvents then return FALSE endIf
ComAttachEvents (g_OutlookUIAEvents, "OutlookUIA")
g_OutlookUIAEvents.AddPropertyChangedEventHandler(UIA_ControllerForPropertyId, 		Element, TREESCOPE_SUBTREE)
return TRUE
endFunction

void function initializeAtMentionsCollection (object suggestionsList)
var object condition = g_OutlookUIAEvents.createBoolPropertyCondition(UIA_SelectionItemIsSelectedPropertyId, UIATrue)
if ! condition then
	CollectionRemoveAll (atmentionsActiveSuggestion)
	atmentionsActiveSuggestion = null ()
	return 
endIf
var object suggestion = suggestionsList.FindFirst(TreeScope_Subtree, condition)
if ! suggestion then
	CollectionRemoveAll (atmentionsActiveSuggestion)
	atmentionsActiveSuggestion = null ()
	return
endIf
if ! atmentionsActiveSuggestion then atmentionsActiveSuggestion = new collection endIf
atmentionsActiveSuggestion.description = suggestionsList.name
atmentionsActiveSuggestion.element = suggestion
endFunction

string function getPositionInGroupFromUIAElement (object element)
if ! element return endIf
var int index, string size, string positionInfo;
size = element.sizeOfSet
if ! size return endIf
index = element.positionInSet 
; account for out of bounds UIA where something's wrong:
if ! index || index > size return endIf
positionInfo = formatString (cmsgPosInGroup1, index, size)
return positionInfo
endFunction

void function AutoCompleteListFromPropertyChanged (object suggestionsList)
var object condition = g_OutlookUIAEvents.createBoolPropertyCondition(UIA_SelectionItemIsSelectedPropertyId, UIATrue)
if ! condition return endIf
var object suggestion = suggestionsList.FindFirst(TreeScope_Subtree, condition)
if ! suggestion  return endIf
if ! suggestion.name return endIf
giHasAddressAutoComplete=TRUE
gbIsAddressAutoCompleteListVisible=TRUE
If giOutlookAutoCompleteVerbosity 
; prevent where same event fires twice for same name:
&& gsBrlAutoComplete != suggestion.name Then
	Say(suggestion.name,ot_line)
	gsBrlAutoCompletePosition = getPositionInGroupFromUIAElement (suggestion)
	say (gsBrlAutoCompletePosition, OT_POSITION)
endIf
gsBrlAutoComplete=suggestion.name
scheduleFunction ("BrailleRefresh", 1) ; give JAWS time to catch up to the initial event.
g_OutlookUIAEvents.AddAutomationEventHandler(UIA_SelectionItem_ElementSelectedEventId, suggestionsList, TREESCOPE_SUBTREE); as element gets selected
g_OutlookUIAEvents.AddAutomationEventHandler(UIA_SelectionItem_ElementRemovedFromSelectionEventId, suggestionsList, TREESCOPE_SUBTREE); as element gets selected
endFunction

void function OutlookUIAPropertyChangedEvent(object element, int propertyID, variant newValue)
if PropertyID == UIA_ControllerForPropertyId then
	var object suggestions = element.controllerFor(0)
	if ! suggestions then
		if element.className == cwc_RichEdit20WPT ; on header fields like to, cc, bcc
		&& autocompleteListElement ; prevent exit list sound from going off all the time.
			playSound (findJAWSSoundFile (AutoCompleteListExitSound))
			gsBrlAutoComplete = cscNull
			autocompleteListElement = null ()
		endIf
		return
	endIf
	if element.className == cwc_RichEdit20WPT then ; on header fields like to, cc, bcc
	; the following collection needs to be destroyed to prevent valueChangedEvent from firing erroneously,
	; due to changes in Outlook where the property may be available for a time and then be removed from the installation 
	; by an automatic update or internal automatic change in Outlook:
		if ! autocompleteListElement then
			playSound (findJAWSSoundFile (AutoCompleteListEnterSound))
			autocompleteListElement = suggestions
		endIf
		unscheduleFunction (globalAddressFieldsValueChangeCollection.timerID) ; scheduled from valueChangedEvent 
		collectionRemoveAll (globalAddressFieldsValueChangeCollection)
		globalAddressFieldsValueChangeCollection = null ()
		AutoCompleteListFromPropertyChanged (suggestions) 
		return
	endIf
	initializeAtMentionsCollection (suggestions)
	HookSearchSuggestionsInUIA ()
	if atmentionsActiveSuggestion then
		say (atmentionsActiveSuggestion.description, OT_SCREEN_MESSAGE)
		say (atmentionsActiveSuggestion.element.name, OT_CONTROL_NAME)
	endIf
	return
endIf
endFunction

void function OutlookUIAAutomationEvent (object element, int eventID)
var string name = element.name
if eventID == UIA_SelectionItem_ElementSelectedEventId then
	if atmentionsActiveSuggestion
	&& compareUIAElements (element, atmentionsActiveSuggestion.element) then
	; AutomationEvent fires twice for the same element with the same selection patterns and the same name twice.
		return
	endIf
	if stringIsBlank (name) then return endIf
	if gsBrlAutocomplete != name then
	; prevent from speaking same item twice.
		say (name, OT_CONTROL_NAME)
		gsBrlAutoCompletePosition = getPositionInGroupFromUIAElement (element)
		say (gsBrlAutoCompletePosition, OT_POSITION)
	endIf
	gsBrlAutocomplete = element.name
	giHasAddressAutoComplete = TRUE
	gbIsAddressAutoCompleteListVisible = TRUE ; for SayNextLine and SayPriorLine scripts
elIf eventID == UIA_SelectionItem_ElementRemovedFromSelectionEventId then
	gsBrlAutocomplete = null ()
	giHasAddressAutoComplete = FALSE
endIf
if atmentionsActiveSuggestion then
	atmentionsActiveSuggestion.element = element
endIf
endFunction

void function SayLineUnit (int UnitMovement, optional int bMoved)
if UnitMovement != UnitMove_Current then
	if giHasAddressAutoComplete then
	; The autocomplete empties when you move to top, make sure it's gone.
	; Moving to bottom does not have this problem, and would lead to false results if autocomplete was emptied.
		if UnitMovement == UnitMove_Prior then
			gsBrlAutocomplete = null ()
		endIf
		return
	endIf
endIf
return SayLineUnit (UnitMovement, bMoved)
endFunction

void function FocusChangedEventEx (handle hwndFocus,int nObject,int nChild,handle hwndPrevFocus, int nPrevObject, int nPrevChild,	int nChangeDepth)
;appendToScriptCallStackLog ()
var
	string sClass,
	Int iObjectType,
	Int iWindowType
globalBrlUIACalendarTreeItemCheckedState = FALSE
gsUnRedMsgs = cscNull
if globalInitializeOMScheduler then
	unscheduleFunction (globalInitializeOMScheduler)
	globalInitializeOMScheduler = 0
endIf
if giFnScheduleSpellCheckInfo then
	unScheduleFunction (giFnScheduleSpellCheckInfo)
	giFnScheduleSpellCheckInfo = 0;
endIf
let sClass=GetWindowClass(hwndFocus)
if sClass == wcNavigationBar then
	return officeClassic::FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth)
endIf
if isCalendarView () then
	UpdateCurrentCalendarInfoCollection ()
	currentCalendarData = GetRelevantStringFromCurrentCalendarInfoCollection ()
else
; prevent when you return to the calendar, and it not knowing the date is new.
	CollectionRemoveAll (PrevCalendarInfo)
	PrevCalendarInfo = null ()
endIf
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
if ReturningFromResearchItDialog () then
	globalPrevRealName = GetWindowName (GetRealWindow (hwndFocus))
	globalPrevApp = GetAppMainWindow (hwndFocus)
	return
endIf
if (ForceFocusToWordDocumentWindow(hwndFocus)) then
	return
EndIf
;Keep last item on display from 'ghosting'
;or showing the wrong item,
;most easily seen when deleting the last message in a mailbox.
;Removing this unset will cause fake items to show on the display.
Let gsBrlMessageItem = cscNull;
;Keep Autocomplete from ghosting
let giHasAddressAutoComplete=FALSE
let gsBrlAutoComplete=cscNull
;fast checking for char and other navigation.
Let gbInRibbons = inRibbons()
; used by ScreenStabilizedEvent to check class of previous window with focus
; to determine whether to drop back into document window.
let globalPrevFocus=hwndPrevFocus
let gbWordIsWindowOwner=FALSE
If InHJDialog() then
	if gbActiveItemChanged
	&& GetObjectSubtypeCode()!=wt_button then ; so that static text of dialogs read properly.
		return ActiveItemChangedEvent (hwndFocus,nObject,nChild,HwndPrevFocus,nPrevObject,nPrevChild)
	else
		let gbActiveItemChanged =false
		;return	default::FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth)
	EndIf
EndIf
let iObjectType = GetObjectSubtypeCode ()
let iWindowType = GetWindowSubtypeCode (hwndFocus)
If (dialogActive ()
&& getWindowClass (hwndFocus) != wc_OutlookGrid
;we must exclude all generalized list types,
;because Outlook does not map every single child to a different child ID,
; so this was breaking the address book amongst other things.
&& ! (getWindowTypeCode (hwndFocus) == WT_LISTBOX
	|| getWindowTypeCode (hwndFocus) == WT_LISTVIEW
	|| getWindowTypeCode (hwndFocus) == WT_TREEVIEW
);End of generalized controls exceptions
&& ! isCalendarView())
	;There are cases where literally the same object is in place but calling the focus change unnecessarily:
	;Notable is where User is trying to save an attachment, and several controls in the dialog
	;repeated themselves. This was partially resolved by routing to internal TabKey code in these instances but not entirely.
	if (hwndFocus== hwndPrevFocus && nObject == nPrevObject && nChild == nPrevChild
	&& getWindowSubtypeCode (hwndFocus) != WT_TOOLBAR
	&& ! StringContains (GetWindowName (GetRealWindow (hWndFocus)), scSpellingDialogName) ) then
		return
	endIf
EndIf
; to call activeItemChangedEvent for navigation pane...
If IsNavigationPane () then
	If iObjectType == WT_TREEVIEWITEM then
		If hwndFocus == hwndPrevFocus then
			return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild, nChangeDepth)
		Else
			return FocusChangedEvent (hwndFocus, hwndPrevFocus)
		EndIf
	EndIf
	; To avoid announcement of message status on pressing Space in Navigation pane treeView...
	If iObjectType == WT_TREEVIEW then
		Return
	EndIf
EndIf
If (StringContains (GetWindowOwner (hWndFocus), SC_Word2010)
&& (sClass == WC_WWN
|| InDocument ()))
	gbWordIsWindowOwner = TRUE
EndIf

; check for Quick nav state when not in message.
if !gbWordIsWindowOwner
&& !UserBufferIsActive()
&& QuickNavKeyTrapping() then
	QuickNavStateChange(false)
EndIf

If gbInRibbons
|| GetWindowClass(GetParent(GetParent(hwndFocus)))==wc_netUIHwnd then ;captures edit combos off the ribbons
	return FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth)
EndIf

;render this explicit to alert dialogs:
if IsCommonAlertDlg ()
|| (DialogActive ()
&& FindWindow (GetParent (hwndFocus), cwc_RichEdit20WPT)) then
	If nChangeDepth >= 0 then
		return FocusChangedEvent (hwndFocus, hwndPrevFocus)
	Else
		If GetWindowTypeCode (hwndFocus) == WT_TREEVIEW
		&&  hWndFocus == GlobalPrevFocus then
			return ActiveItemChangedEvent (hwndFocus,nObject,nChild,HwndPrevFocus,nPrevObject,nPrevChild, nChangeDepth)
		EndIf
		return FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth)
	EndIf
EndIf
If gbWordIsWindowOwner Then
	if IsActiveDocumentProtected() then
		QuickNavStateChange(false)
	EndIf
	return FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth)
EndIf
; Test for menu mode activated from within message body.
If GetMenuMode()==menu_active
&& iWindowType!=wt_menu
&& iWindowType!=wt_ContextMenu then
	return FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth)
EndIf
;SetGlobals(hWndFocus,TRUE) ; Initialize globals with currently focused item values.
If StringCompare(GetObjectName (TRUE),"s")==0 then
	return FocusChangedEvent(hWndFocus, hwndPrevFocus)
EndIf
;Dialogs were excepted to Default, but then this was commented out.
;So until we find out why, call default where the dialog's name contains "Attachment":
;Multipage dialogs need special handling to prevent page from repeating.
If DialogActive ()
&& ! IsMultipageDialog () then
	; To select the dialogues with treeviews...
	If hWndFocus == hwndPrevFocus then
		If GetWindowName (GetRealWindow (hWndFocus)) == WN_SelectNames then
			return ; Do not announce the names since they are announced via SayNextLine and SayPriorLine scripts...
		; To announce the number of unread messages...
		ElIf iObjectType == WT_TREEVIEW
		|| iObjectType == WT_TREEVIEWITEM then
			return ActiveItemChangedEvent (hwndFocus,nObject,nChild,HwndPrevFocus,nPrevObject,nPrevChild, nChangeDepth)
		elIf (iObjectType == WT_LISTBOXITEM || iObjectType == WT_TABLECELL || iObjectType == WT_GROUPBOX)
		&& sClass == wc_OutlookGrid then
		; insert Outlook item from ribbon in message body.
		; failure to do this would cause the item to read incorrectly as you cursor up and down in the listl
		; the group box is the very top item which is not a message but the sort option.
			return ActiveItemChangedEvent (hwndFocus,nObject,nChild,HwndPrevFocus,nPrevObject,nPrevChild, nChangeDepth)
		EndIf
	Else
		; To announce the number of unread messages in the treeviews when focus lands on the dialogue...
		If iObjectType == WT_TREEVIEW
		|| iObjectType == WT_TREEVIEWITEM then
			Return FocusChangedEvent (hwndFocus, hwndPrevFocus)
		EndIf
		Return FocusChangedEvent (hwndFocus, hwndPrevFocus)
;		return Default::FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth)
	EndIf
EndIf
If IsMultipageDialog ()
&& nChangeDepth != -1
&& ! StringContains (GetWindowName (GetRealWindow (hWndFocus)), scSpellingDialogName) then
	return FocusChangedEvent(hwndFocus,hwndPrevFocus)
EndIf
; To announce context menus correctly when running JAWS and Magic together...
If iWindowType == WT_CONTEXTMENU
&& IsMAGicRunning ()
&& StringCompare (GSPreviousItem, GetObjectName (TRUE), TRUE) != 0 then
	SayLine ()
	let GSPreviousItem = GetObjectName ()
	Return
EndIf

if IsMessagesList () then
	let gbMessageHasBeenRead=false
	if hwndFocus == hwndPrevFocus  then
		;if ! CheckForNoMoreItems(OT_POSITION) then
			Return ActiveItemChangedEvent (hwndFocus,nObject,nChild,HwndPrevFocus,nPrevObject,nPrevChild, nChangeDepth)
		;endIf
	elIf hwndFocus != hwndPrevFocus then
		return focusChangedEvent (hwndFocus, hwndPrevFocus)
	endIf
endIf

; To announce calendar information correctly when focus lands on the calendar for the first time...
if isCalendarView ()
	gbFocusChangedIsCalledOnSameWindow = (hwndFocus == hwndPrevFocus)
	If gbFocusChangedIsCalledOnSameWindow
		Return (ActiveItemChangedEvent (hwndFocus,nObject,nChild,HwndPrevFocus,nPrevObject,nPrevChild, nChangeDepth))
	EndIf
	Return (FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth))
EndIf
; To announce the attendee status responce...
If GetCurrentControlID () == app_AllAttendeesList
&& iWindowType == WT_LISTBOX then
	Return (FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth))
EndIf
If IsMessageTextWindow (hwndFocus) then
	If sClass == cwc_RichEdit20WPT
	&& GetAppMainWindow (hwndPrevFocus) != GetAppMainWindow (hwndFocus) Then
		Return (FocusChangedEvent (hwndFocus, hwndPrevFocus))
	EndIf
	Return (FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth))
EndIf
If GetWindowClass (GetAppMainWindow (hWndFocus)) == wc_Rctrl_RenWnd32	; Most likely we are in the main window...
&& (! IsMessageTextWindow (hWndFocus))	; We are not in an open message...
;&& GetFolderType () > 1	; Do not include Inbox and the calendar...
&& (! DialogActive ())
&& (! MenusActive ()) then
	;Focus change fires when cursor keys are used to navigate contacts,
	;DescriptionChangedEvent used to fire for all navigation in Contacts,
	;so we used to filter out the navigation focus change in Contacts.
	; Anymore, it's being handled like it should.
	if nChangeDepth == 0
	&& hwndFocus == hWndPrevFocus
	&& GetFolderType () == 2	; contacts list...
		; prevent DescriptionChangedEvent from speaking this a second time.
		; that was happening in Outlook 2013.
		iDescriptionChangedEventSuppress = TRUE
		; SayObjectActiveItem can get this wrong, by speaking the list box type, since these child objects are list boxes for the cards:
		return sayMessage (OT_CONTROL_NAME, GetObjectName (TRUE))
	EndIf
EndIf
FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth)
;SetGlobals(hWndFocus,FALSE) ; Reset globals as previous item values.
EndFunction

void function ProcessSayAppWindowOnFocusChange(handle AppWindow,handle FocusWindow)
;QuickSettings has the dialog as the application main window:
if InHjDialog () && InQuickSettingsDialog () then
	return default::ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
endIf
If GlobalPrevApp != AppWindow
&& AppWindow != FocusWindow then
	If GlobalAppWindow!=GlobalRealWindow Then
		SayWindowTypeAndText (GlobalRealWindow)
		let RealWindowSpoken = true
	EndIf
EndIf
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName,
	handle FocusWindow)
;Hj Dialogs need to process from default:
if inHjDialog () then
	return default::ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
endIf
; when moving from edit message field belonging to word back to Outlook owning field
; we should remain silent.
If StringContains (GetWindowOwner (GlobalPrevFocus), sc_Word2010)
&& GetWindowClass (FocusWindow) == cwc_RichEdit20WPT
	RealWindowSpoken = TRUE
EndIf
; for some reason the real window name in new contact dialogue is different for different controls,
; so if the real window is the same and the names of real window differs we should suppress announcement.
If StringContains (RealWindowName, scContacts)
&& GlobalPrevRealName != RealWindowName
&& GlobalPrevReal == RealWindow
	RealWindowSpoken = TRUE
EndIf
if GetRunningFSProducts () & product_MAGic
&& IsCalendarView () then
; This is to allow MAGic to track the scroll bars in Outlook Calendar.
	var handle CalendarParent = GetParent (GetFocus ())
	while (CalendarParent && GetWindowClass (CalendarParent) != wc_Rctrl_RenWnd32)
		CalendarParent = GetParent (CalendarParent)
	endWhile
	if CalendarParent then
		UIARequestEvents (CalendarParent, TRUE)
	endIf
endIf
; preview pane is located inside the same real window as a message list, but when focus is in preview pane
; the name of real window is empty, so when you tab back to message list we get annoying announcement of real window name.
If IsInOutlookMainWindow (FocusWindow)
&& GlobalPrevReal == RealWindow
&& StringIsBlank (GlobalPrevRealName)
&& IsInOutlookMainWindow (GlobalPrevFocus)
&& GetWindowClass (GlobalPrevFocus) == WC_WWG
	RealWindowSpoken = TRUE
EndIf
If GlobalPrevRealName != RealWindowName  ; name has changed
|| GlobalPrevReal != RealWindow	; or handle has changed, then
	Let GlobalFocusWindow = FocusWindow
	if (RealWindow != AppWindow
	&& RealWindow != FocusWindow)
	;Keep appointment name from double-speaking when moving from Notes to other fields:
	|| GlobalRealWindowName!=GlobalPrevRealName then
		if !HandleCustomRealWindows(RealWindow) then
			if !RealWindowSpoken then
				SayWindowTypeAndText (RealWindow)
			EndIf
		EndIf
	EndIf
EndIf
EndFunction

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName,handle FocusWindow)
; new search suggestions uses ControllerFor array object from which we can hook and read autocomplete suggestions.
HookSearchSuggestionsInUIA ()
if GlobalPrevFocus != focusWindow
	if !HandleCustomWindows(FocusWindow)  Then
		SayFocusedWindow () ; will use global variable GlobalFocusWindow
	EndIf
Else
	If IsCalendarView ()
	&& GetWindowClass (FocusWindow) == cWC_RichEdit20WPT
	&& GetControlID (FocusWindow) == 1
		; for some reason when you type in the edit field invoked by pressing Enter key
		; FocusChangedEventEx function is invoked on every keypress.
		; by this If operator we are blocking this from happening...
		Return
	EndIf
	SayFocusedObject ()
EndIf
EndFunction

int function InOptionsDialog (handle hWnd)
var
	handle hTemp
if GetMenuMode()>0 || inHjDialog () || UserBufferIsActive () then
	return false
endIf
if ! dialogActive () 
|| stringContains (getWindowClass (hwnd), "SDM") then
	return FALSE
endIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_NUIDialog
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if StringContains(GetWindowName(hTemp),wn_Options)
	|| StringContains(getWindowName(GetRealWindow(hTemp)),wn_options) then
		return true
	EndIf
EndIf
return false
EndFunction

void function HookControllerForForAddressFields ()
if ! IsControllerForPropertyAvailableForAddressFields () then
; don't hook / watch for UIA events in older versions of Outlook where JAWS or Outlook may become unstable!
	return
endIf
if ! g_OutlookUIAEvents then
	g_OutlookUIAEvents = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
endIf
ComAttachEvents (g_OutlookUIAEvents, "OutlookUIA")
var object element = FSUIAGetFocusedElement  ()
if ! element return endIf
g_OutlookUIAEvents.AddPropertyChangedEventHandler(UIA_ControllerForPropertyId, 		Element, TREESCOPE_SUBTREE)
endFunction

void function ProcessEventOnFocusChangedEvent(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow, handle PrevWindow)
if BackstageViewWindowWasProcessed(FocusWindow,PrevWindow) then
	return
EndIf
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
ProcessSayRealWindowOnFocusChange(AppWindow,RealWindow,RealWindowName,FocusWindow)
; in case of contacts view and previous window is 0 the contact name will be announced twice the second time using DescriptionChangedEvent function.
If GetFolderType () == 2	; contacts list...
&& getControlID (FocusWindow)  == Contact_List	; for when focus changes from another folder, keeping this from repeating.
&& (! PrevWindow)
	iDescriptionChangedEventSuppress = TRUE
EndIf
ProcessSayFocusWindowOnFocusChange(RealWindowName,FocusWindow)
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow,
	string Owner

if InOptionsDialog (focusWindow) then
	return officeClassic::FocusChangedEvent (focusWindow, prevWindow)
endIf
Owner = StringSegment (GetWindowOwner (FocusWindow), cscDoubleBackslash, -1)
if StringContains (StringUpper (Owner), "MSHTML") then 
	SwitchToConfiguration ("internet explorer")
	Return
EndIf

; Because users will press f1 from Customize List View and not be in the help as they should:
if StringContains (Owner, "hhctrl") then ; JAWS Help:
	Owner = StringSegment (Owner, cscPeriod, 1)
	SwitchToConfiguration (IniReadString ("ConfigNames", Owner, GetActiveConfiguration (), "ConfigNames.ini"))
	Return
EndIf
SetGlobals(FocusWindow,TRUE) ; Sets global variables.
let RealWindow=GlobalRealWindow
let RealWindowName=GlobalRealWindowName
let AppWindow=GlobalAppWindow
If giFocusHasBeenLostID Then
	UnscheduleFunction(giFocusHasBeenLostID)
EndIf
if !ReturningFromResearchItDialog () then
	ProcessEventOnFocusChangedEvent(AppWindow, RealWindow, RealWindowName, FocusWindow, PrevWindow)
EndIf
SetGlobals(FocusWindow,FALSE)
EndFunction

Int Function HandleCustomRealWindows (handle hwnd)
var
	string sWinName,
	string sDialogText,
	handle hRichEdit,
	Handle hFocus = GetFocus (),
	string sWinClass,
	Int iControlID = GetControlID (hFocus),
	Int iWindowType = GetWindowSubtypeCode (hFocus)
If InHJDialog() then
	Return HandleCustomRealWindows (hWnd)
EndIf
globalInitializeOMScheduler = scheduleFunction ("InitializeOutlookObjects", 2)
;Except common alert dialogs, e.g. those with name, static text and button / checkable choices:
If IsCommonAlertDlg () ; then
|| getWindowClass (hwnd) == wc_NUIDialog then
	Return HandleCustomRealWindows (hwnd)
ElIf IsMultipageDialog () then
	SayWindowTypeAndText (hWnd)
	Return TRUE;prevent double-reading of dialog page.
EndIf
if (getWindowCategory () == WCAT_SPELL_CHECKER
&& getWindowSubtypeCode (getFocus ()) == WT_MULTILINE_EDIT)
	sWinName = stringSegment (getWindowName (hwnd), cScColon, 1)+cScColon
	indicateControlType (wt_dialog, sWinName)
	return TRUE
endIf
If hFocus == ciGridView
&& gbDeletingMessageFromList Then
	Return TRUE
EndIf
if StringContains(globalRealWindowName,scNoteDialogName ) then ; allow title of dialog to be spoken.
	return false
endIf
If RealWindowSpoken
|| GlobalWindowClass==wc_NetUiHwnd Then
	Return TRUE
EndIf
let sWinClass=GetWindowClass (hWnd)
let sWinName = GetWindowName (hWnd)
; ReListBox class processing
; Processes dialogs that don't read automatically with GetDialogStaticText
If DialogActive ()
	; Exit, Read Receipt, reminder dismiss all,  dialogs...
	let hRichEdit=FindWindow (GlobalRealWindow, cwc_RichEdit20WPT) ; Get handle of rich edit window.
	If hRichEdit	; If it does indeed exist,
	&& GetWindowSubTypeCode(hRichEdit)==WT_READONLYEDIT	; and it is a read only,
	&& iWindowType != WT_EDITCOMBO
		Say(GetWindowTextEx(hRichEdit,FALSE,FALSE),OT_DIALOG_TEXT,TRUE)
		Return TRUE
	EndIf ; End of rich edit-read only check.
EndIf ; End of dialog check.
; for Attachments list not to announce real window name, which is the name of the current message:
if GetCurrentControlID()==ciAttachmentList then
	return true
endIf
If IsMessagesList ()
	Say (GetWindowName (GetAppMainWindow (hWnd)), OT_DIALOG_NAME)
	Return (TRUE)
EndIf
Return FALSE
EndFunction

int function AppointmentFieldProcessed()
var
	Int iAppointmentActive,
	string sAppointmentDay

let iAppointmentActive = IsCalendarViewAppointmentEditBox ()
If iAppointmentActive Then	; The Calendar edit box is active...
	let sAppointmentDay = GetOL2007AppointmentDay()
	SayBriefAppointmentData(GetCalendarView () != ciDayView
		&& sAppointmentDay != gsPrevAppointmentDay)
else
	let sAppointmentDay = cscNull
EndIf
let gsPrevAppointmentDay = sAppointmentDay
return (iAppointmentActive)
EndFunction

String Function GetSuperGridListItem (handle hWnd,optional  Int iAmount)
var
	Int iControlID = GetControlID (hWnd),
	String sLine = GetLine (),
	String sObjectName = getObjectName (TRUE),
	string positionInfo = PositionInGroup (),
	string sText,
	Int iWindowType = GetWindowSubtypeCode (hWnd),
	Int iObjectType = GetObjectSubTypeCode (),
	Int iState,
	Int iToggle
; keep text from repeating.
if OutlookTableColumnCount then return cscNull endIf
GetKeyState (cKsControl, iState, iToggle)
if ! giCustomizeListItems then
	return getSupergridItemValueFromMSAA ()
endIf
If IsWindowADistributionList (hWnd) then
	SendMessage (hWnd, WM_SETFOCUS)
	Return (GetLine ())
; Advanced find results...
ElIf iControlID == ic_AdvancedFindResultList
;insert business card or contact, pretty much any dialog that contains a superGrid:
|| dialogActive () then
	Return (GetObjectName (TRUE))
; Message list...
ElIf iControlID == ciGridView then
	If StringIsBlank (sObjectName)
	; Now PositionInGroup is valid, so don't report '0 items' twice:
	&& ! stringIsBlank (positionInfo)
	&& iObjectType != WT_TABLE
	&& iObjectType != WT_LISTBOX
		Return (GetWindowTextEx (hWnd, FALSE, FALSE))	; Should be 0 items here...
	ElIf StringContains (sObjectName, cScPeriod)
	&& (! StringContainsChars (sObjectName, cScSpace)) then
;		Return (sObjectName)	; Should be loading here...
		sText = GetWindowTextEx (hWnd, FALSE, FALSE)
		;Ensure text does not contain locale info,
		;as MSAA caching isn't updating in time for some instances when switching to and from folders.
		;This can be difficult to reproduce, but the window and its MSAA are out of sync in these instances.
		;The locale for date separator string is a safe bet, as all messages texts contain this,
		;and requires no additional help from localizers since Windows will grab it.
		if ! stringContains (sText, GetSystemLocaleInfo (LOCALE_SDATE))
		&& ! stringIsBlank (sText)
		; Now PositionInGroup is valid, so don't report '0 items' twice:
		&& ! stringIsBlank (positionInfo)
			Return (sText)	; Should be 0 items here...
		endIf
		return cscNull
	EndIf
	If iObjectType == WT_TABLE
		UIARefresh () ; also causes double Brailling in the list box.
		;Delay (1)
	EndIf
	sLine = GetMessageInformation (TRUE, iAmount)
	;BrailleRefresh () ; no longer needed, causes Braille to redraw several times.
	If StringContainsChars (sLine, LIST_ITEM_SEPARATOR) then
		sLine = StringFilterOutMessageInformation (sLine)
	EndIf
	; for lists that don't return message info customized,
	; return the same text Narrator retrieves, e.g. the name of the item which will contain everything:
	if stringIsBlank (sLine) then
	; for lists that don't return message info customized,
	; return the same text Narrator retrieves, e.g. the name of the item which will contain everything:
		sLine = getSupergridItemValueFromMSAA ()
	endIf
	If iState
		If IsMessagesList ()
		&& ((! GetFolderType ())
		|| GetFolderType () == 6)
			If (! IsMessageSelected ())
			&& iAmount < 2
				sLine = cscNotSelected + cScSpace + sLine
			EndIf
		EndIf
	EndIf
	Return (sLine)
EndIf
Return (sLine)
EndFunction

Int Function HandleCustomDialogueWindows (handle hWnd)
var
	Handle hReal = GetRealWindow (hWnd),
	String sWindowName = GetWindowName (hWnd),
	String sWindowText = GetWindowTextEx (hWnd, FALSE, FALSE),
	String sWindowLabel,
	String sObjectName = GetObjectName (TRUE),
	String sObjectValue = GetObjectValue (TRUE),
	String sObjectNameForWindowNamePart,
	String sObjectNameForWindowLabelPart,
	String sOwnerApplication = GetOwningAppName (hWnd),
	Int iWindowType = GetWindowSubtypeCode (hWnd),
	Int iObjectType = GetObjectSubTypeCode (),
	Int iState = GetControlAttributes (),
	Int iControlID = GetControlID (hWnd)

; This dialogues should be the second level of enclosure dialogue and the parent is also a dialogue.
If GetWindowSubtypeCode (GetParent (GetParent (hWnd))) == WT_DIALOG
	; To handle the Send/Receive groups dialogue...
	If iWindowType == WT_EDIT_SPINBOX then
		let sWindowName = GetWindowName (GetPriorWindow (GetPriorWindow (hWnd)))
		let sWindowLabel = GetWindowName (GetNextWindow (GetNextWindow (hWnd)))
		let sObjectNameForWindowNamePart = StringLeft (sObjectName, StringLength (sWindowName))
		let sObjectNameForWindowLabelPart = StringRight (sObjectName, StringLength (sWindowLabel) - 1)
		If sWindowName == sObjectNameForWindowNamePart then
			IndicateControlType (iWindowType, sWindowName)
			If sWindowLabel == sObjectNameForWindowLabelPart then
				Say (sWindowLabel, OT_CONTROL_NAME)	; word minutes
			EndIf
			Return (TRUE)
		EndIf
	EndIf
	; Calendar and tasks colour...
	If (iControlID == ID_DefaultColour
	|| iControlID == ID_OverdueTaskColour
	|| iControlID == ID_CompletedTaskColour)
	&& iWindowType == WT_COMBOBOX
	&& StringIsBlank (sWindowText) then
		IndicateControlType (iWindowType, sWindowName, GetColorName (GetMSAAColourAtComboBox ()))
		Say (PositionInGroup (), OT_POSITION)
		Return (TRUE)
	EndIf
	; To handle some combo boxes in Calendar Options...
	If (iControlID == ID_FirstWeekOfYear
	|| iControlID == ID_UseThisResponseWhenYouProposeNewMeetingTimes)
	&& iWindowType == WT_EDITCOMBO
	&& (! StringIsBlank (sObjectName)) then
		IndicateControlType (iObjectType, sObjectName, GetObjectValue (TRUE))
		Return (TRUE)
	EndIf
EndIf
; In case day or month recurrence is selected...
If StringContains (GetWindowIDString (hReal), AppointmentRecurrenceStringIDStart)	; we are in recurrence dialogue...
	If iWindowType == WT_RADIOBUTTON
		; day radio-button selected...
		If iControlID == ciRecurrencePatternDailyEvery
		|| iControlID == ciRecurrencePatternDailyWeekday
			Say (GetGroupBoxName (), OT_CONTROL_GROUP_NAME)
			IndicateControlTypeAndState ()
			Say (PositionInGroup (), OT_POSITION)
			Return (TRUE)
		EndIf
		; month radio-button selected...
		If iControlID == ciRecurrencePatternMonthlyDay
		|| iControlID == ciRecurrencePatternMonthlyThe
			Say (GetGroupBoxName (), OT_CONTROL_GROUP_NAME)
			IndicateControlTypeAndState ()
			Say (PositionInGroup (), OT_POSITION)
			Return (TRUE)
		EndIf
	EndIf
EndIf
If sOwnerApplication == FN_CommonDialoguesDLLName
|| sOwnerApplication == FN_BrowseUserInterfaceDLLName then
	If StringIsBlank (sWindowName) then
		SayObjectTypeAndText ()
		Return (TRUE)
	EndIf
EndIf
; To announce combo box lables in 'New Call' dialogue, invoked by Ctrl+Shift+D
; this approach should not spoil any other edit combo handling...
If iWindowType == WT_EDITCOMBO
&& (! StringIsBlank (sObjectName))
	IndicateControlType (iWindowType, sObjectName, sObjectValue)
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

Int Function HandleCustomWindows (handle hWnd)
var
	Object oClient,
	handle hParent,
	handle hAppointmentListBox,
	Handle hFound,
	Int iControlID,
	int iType,
	int iView,
	Int iChildID,
	Int iTemp,
	string sParentClass,
	string sClass,
	string sWinName,
	string sWinText,
	Object oLabel,
	Int iLabel,
	String sObjectName = GetObjectName (TRUE),
	String sObjectValue = GetObjectValue (TRUE)
if HandleCustomBackstageViewWindow() then
	return true
EndIf
If DialogActive () && HandleCustomDialogueWindows (hWnd) then
	Return (TRUE)
EndIf
if SayWindowTypeAndTextRicheditsWithRicheditPrompts (hwnd) then
	return TRUE
endIf
let giLineHasSpoken=FALSE
let sClass=GetWindowClass(hWnd)
let sWinName=GetWindowName(hWnd)
let iControlID = GetControlID (hWnd)
if iControlID == to_field || iControlID == cc_field || iControlID == bcc_field 
; include meeting request fields:
|| iControlID == app_toField then
; all composition header fields where addressing lives
	HookControllerForForAddressFields ()
endIf
if sClass == cwc_Richedit60W then
	OfficeClassic::SayObjectTypeAndText ()
	return TRUE
endIf
; FocusChangedEvent fired, but focus hasn't changed.
If SayFocusedHJDialogWindow(hWnd) then
	return TRUE
EndIf
if ! IsCalendarView ()
&& !gbSayWindowPromptAndText
&& GlobalPrevFocus == hWnd
&& (!StringContains(sClass,wc_bosa_SDM_Mso96)
&& !StringContains(sClass,wc_NetUiHwnd)) Then
	Return TRUE
EndIf
If getControlID (hwnd) == ciGridView
&& getWindowClass (hwnd) == wc_OutlookGrid then
	let gbFocusHasChanged=TRUE
	ResetMessageFlagVariables ()
	let ghStatusBar=FindWindowWithClassAndID(GlobalRealWindow,cwc_StatusBar32,ciStatusBar)
	indicateControlType  (WT_LISTBOX, cscSpace, cscSpace)
	If IsInOutlookMainWindow (hWnd)
		;if CheckForNoMoreItems (OT_POSITION) then return TRUE endIf
		Say (GetSuperGridListItem (hwnd), OT_SELECTED_ITEM, TRUE)
		say (PositionInGroup (), OT_POSITION)
	Else
		SayObjectActiveItem ()
	EndIf
	Return TRUE
EndIf
; Assign values to variables...
let iType = GetWindowSubTypeCode (hWnd)
If !iType then
	let iType=GetObjectSubtypeCode()
EndIf
let hParent=GetParent(hWnd)
let sWinText=GetWindowText(hParent,FALSE)
let sParentClass=GetWindowClass (hParent)
; Retrieve dialog text for Journal dialog...
If sParentClass==cwc_Dlg32770   Then
	If GlobalCurrentControl==7
	&& !gbDialogFirstActivation Then
		let sWinText=GetWindowTextEx(FindDescendantWindow(hParent,20),0,0)
		Say(sWinText,ot_line)
		let gbDialogFirstActivation=TRUE
	EndIf
Else
	let gbDialogFirstActivation=FALSE
EndIf
; Tabs don't read in Advanced Find...
If GlobalRealWindowName==wn_AdvancedFind
&& iType==wt_TabControl Then
	SayLine()
	Return TRUE
EndIf

; This reads the correct window for "Start in folder:" option.
If StringContains(GlobalRealWindowName,wn_AdvancedOptions)
&& GlobalCurrentControl==ciBrowseButton Then
	SayWindowTypeAndText(FindDescendantWindow(GlobalRealWindow,idc_8))
	IndicateControlType(wt_button,GlobalObjectName,cscSpace)
	Return TRUE
EndIf

; Appointment dialog...
If StringContains(GlobalRealWindowName,scAppointment) Then
	; Meeting scheduler
	If iControlID ==app_Required
	&& giObjSubType==FALSE Then
		IndicateControlType(wt_ListBox,cscSpace,cscSpace)
		Return TRUE
	ElIf iControlID ==app_AllAttendeesList Then
		Say(GetObjectNameOrValue(),ot_screen_message)
	ElIf iControlID == IDC_14 then
		IndicateControlType (iType, smmReplaceSymbolsWithMarkup (sWinName), GetObjectValue ())
		Return TRUE
	ElIf iControlID == ID_MeetingLocationField then
		IndicateControlType (iType, smmReplaceSymbolsWithMarkup (GetObjectName (TRUE)), smmReplaceSymbolsWithMarkup (GetObjectValue (TRUE)))
		Return TRUE
	ElIf sClass == cWc_RichEdit20WPt
		If StringIsBlank (sObjectValue)
			; GetObjectValue returns empty strings for edit boxes very often, though the accValue property is not empty...
			oClient = GetFocusObject (iChildID)
			If oClient
				sObjectValue = oClient.accValue (CHILDID_SELF)
			EndIf
		EndIf
		IndicateControlType (iType, smmReplaceSymbolsWithMarkup (sObjectName), smmReplaceSymbolsWithMarkup (sObjectValue))
		Return (TRUE)
	elif getWindowSubtypeCode (hwnd) == WT_RADIOBUTTON then
		return HandleCustomWindows (hwnd)
	elIf iType == WT_EDIT
	&& getControlID (hwnd) == ciEndAfterOccurences then
		sayControlEX (hwnd, getWindowName (getNextWindow (hwnd)))
		return TRUE
	EndIf
EndIf ; End of Appointment dialog

; Start date and Time, End date and time fields have joint names...
If (GlobalCurrentControl>=app_startTime
&& GlobalCurrentControl<=app_enddate) && sClass == cWc_RichEdit20WPt then
	IndicateControlType(iType,GlobalObjectName,getWindowText (hwnd, READ_EVERYTHING))
	Return TRUE
EndIf ; End of Start-end date-time.
; End of appointment/Meeting sched		uling dialogs.
; Message list...
;If GlobalCurrentControl==ciGridView
If (GlobalCurrentControl==ic_AdvancedFindResultList && GlobalRealWindowName==wn_AdvancedFind) Then
	If GlobalObjectName==wn_DailyTaskList Then
		IndicateControlType(wt_ListBox,GlobalObjectName,GetObjectValue(TRUE))
		Return TRUE
	EndIf
	let gbFocusHasChanged=TRUE
	If gbDeletingMessageFromList Then
		let gbDeletingMessageFromList=FALSE
		Return TRUE
	EndIf
	ResetMessageFlagVariables ()
	let ghStatusBar=FindWindowWithClassAndID(GlobalRealWindow,cwc_StatusBar32,ciStatusBar)
	IndicateControlType(wt_ListBox,cscSpace,cscSpace)
	If CheckForNoMoreItems(OT_POSITION) Then
		Return TRUE
	Else
		if GetWindowClass(GlobalFocusWindow) == wc_OutlookGrid then
			If StringContains(GetObjectName(TRUE),wn_Appointment) Then
				let giRight=GetWindowRight(hWnd)
				let giLeft=GetWindowLeft(hWnd)
				let gbIsCalendarAppointmentList=TRUE
			EndIf
			let MessageListHighlightTick = GetTickCount()
			if (MessageListHighlightTick - PrevMessageListHighlightTick) < MessageHighlightTickThreshold then
				return
			EndIf
			SayLine()
			let PrevMessageListHighlightTick = GetTickCount()
		else
			SayLine()
		EndIf
		Return TRUE
	EndIf
EndIf ; End of grid view/major lists.

; Check for distribution lists...
If IsWindowADistributionList (hWnd) then
	let oClient = GetObjectFromEvent (hWnd, OBJID_CLIENT, iChildID, iTemp)
	IndicateControlType (iType, oClient.accName (0), GetSuperGridListItem (hWnd))
	say (positionInGroup (), OT_POSITION)
	Return (TRUE)
EndIf

; When the reminder dialog gains focus, this forces focus to the appointment list within that dialog.
If hWnd==ghReminderDialog Then
	If GlobalPrevFocus==ghReminderReturn Then
		let hAppointmentListBox=FindDescendantWindow(hParent,ciAppListBox)
		If hAppointmentListBox Then
			SetFocus(hAppointmentListBox)
		EndIf
		Return TRUE
	EndIf
EndIf ; End of Reminder dialog

; Accounts lists...
If sClass==wcReListBox Then
	If (GlobalCurrentControl==ciAccountsList  || GlobalCurrentControl==ciCategoriesListBox) Then
		SayObjectActiveItem()
		Return TRUE
	EndIf ; End of Accounts list.
EndIf ;End of ReListBox class in Account fields.

; Rules Wizard...
If StringContains(GlobalRealWindowName,wn_RulesWizard)
|| StringContains(GlobalRealWindowName,wn_RulesAndAlerts) Then
	If iType==wt_TabControl Then
		SayLine()
		Return TRUE
	EndIf
	If sClass==wcReListBox Then
		If GlobalCurrentControl==ciRulesConditionCheckList Then
			IndicateControlType(wt_ListBox,sWinName,GetObjectState(TRUE)+cscSpace+GlobalObjectName)
			Return TRUE
		EndIf
		If GlobalCurrentControl   == RuleDescriptionListBox  Then
			IndicateControlType(wt_ListBox,wn_RulesWizardStepTwoList,cscSpace)
			Say(GetObjectName (TRUE),OT_SCREEN_MESSAGE)
			Return TRUE
		EndIf ; End of Listbox and ID check
	EndIf ; End of ReListBox in Rules Wizard...
EndIf ; End of Rules Wizard.

; Recurring appointment pattern dialog
If StringContains(GlobalRealWindowName,scRecurrence) Then
	If iType==wt_RadioButton Then
		If (GlobalCurrentControl==ciRecurrencePatternDailyEvery
		|| GlobalCurrentControl==ciRecurrencePatternMonthlyDay
		|| GlobalCurrentControl==ciRecurrencePatternYearlyEvery
		|| GlobalCurrentControl==ciRecurrencePatternDailyWeekday
		|| GlobalCurrentControl==ciRecurrencePatternMonthlyThe
		|| GlobalCurrentControl==ciRecurrencePatternYearlyThe) Then
			PerformScript SayLine()
			Return TRUE
		EndIf
	EndIf ; End of radio button type check.
EndIf ; End of Recurring appointment pattern

If InHjDialog () then
	SayWindowTypeAndText (hWnd)
	Return TRUE
EndIf

; Advanced Find Dialog:
if GlobalRealWindowName == wn_AdvancedFind then
	If GlobalCurrentControl == ic_AdvancedFindStopButton then
		; Set global variable when Find is in progress
		let AdvancedFindingItems = true ; becomes false in ScreenStabilizedEvent
	ElIf GlobalCurrentControl == ic_AdvancedFindNowButton && AdvancedFindingItems then
		; Move to the Found Items List
		GoToFoundItems()
	EndIf
EndIf ; End of advanced find.

; In Outlook 2013 we are able to focus on status bar using F6/Shift+F6 keystrokes...
if GetWindowCategory () == WCAT_STATUSBAR_TOOLBAR then
	If Not giStatusBar
		IndicateControlType (WT_TOOLBAR, wn_StatusBar, cScSpace)	; Announce only once on focus drop.
		giStatusBar = TRUE
	EndIf
Else
	giStatusBar = FALSE
EndIf
; End of status bar announcement...

; Is this the Calendar?
If IsCalendarView() then	; focus is in the calendar view...
	If sClass == wc_AfxWndW
	|| sClass == WC_Outlook2013CalendarPaneNotMonthView
	|| sClass == WC_Outlook2013CalendarPaneMonthView then	; Calendar pane is focused...
		; To handle the situation when the focus lands on the child of the calendar pane...
		If gbUpDownNavigation
		|| gbLeftRightNavigation Then
			CalendarStateChangedEvent (hWnd)
			Return (TRUE)
		Else	; we are not navigating the calendar, simply the focus landed on it...
			If Not iControlID then
				CalendarCleanUp ()
				InitializeOutlookObjects ()
			EndIf
			SetCalendarPresets()
			SayView(GetCalendarView ())
			If AppointmentFieldProcessed() then
				Return (FALSE)
			EndIf
			If !DialogActive() Then
				If GetObjectName(TRUE)=="s" Then
					; To select appointment cancellation or calendar activation...
					If GetObjectSubtypeCode () == WT_EDIT then
						If GlobalPrevFocus != hWnd then
							IndicateControlType (iType, GetObjectName(TRUE))
						EndIf
					Else
						SetFocus(GetParent(GetFocus()))
						ReadDateTime (0)
						ReadCalendarData(gsDateToProcess, GetCalendarView ())
					EndIf
					Return True
				EndIf
				let gbCalendarHasSpoken=TRUE
				let gsCurrentDateRange=cScNull
				let gsDateToProcess=cScNull
				let gsPreviousDateToProcess = cScNull
				let giViewChangeHasSpoken=TRUE
				let gbFocusHasChanged=FALSE
				;Say(GetObjectName(TRUE),OT_SCREEN_MESSAGE) ; superfluous information
				;MaximizeWindow()
				;SetFocus(GetParent(GetFocus()))
				;Pause()
				ReadDateTime (0)
				ReadCalendarData(gsDateToProcess, GetCalendarView ())
				SayObjectActiveItem () ; Managed better by newer cleaned-up code to reduce verbosity.
				Return TRUE
			EndIf
		EndIf	; end of navigation check...
	ElIf sClass == wc_NetUIHWND	; Calendar pane is not focused, we are in navigation pane...
	|| sClass == WC_RichEdit20W then
		If iType == WT_RADIOBUTTON
		&& GetCalendarView () == ciMonthView then
			let oLabel = GetFocusObject (iLabel).accParent.accNavigate (NAVDIR_PREVIOUS, iLabel)
			Say (oLabel.accName (iLabel), OT_CONTROL_NAME)
			sayTreeViewItem ()
			Return TRUE
		EndIf
	ElIf sClass == cWC_RichEdit20WPt
	&& iType == WT_EDIT
		SayLine ()
		Return (TRUE)
	ElIf iType == WT_LINK
	|| iType == WT_BUTTON
	|| iType == WT_RADIOBUTTON
	|| iType == WT_EDIT then
		SayLine ()
	ElIf iType == WT_ButtonMenu then
		IndicateControlType (iType, GetObjectName (TRUE))
		;ComRelease (oLabel)
	EndIf
	If iType == WT_TREEVIEWITEM then
		If GetObjectSubTypeCode (FALSE, 2) == WT_TREEVIEW then
			IndicateControlType (WT_TREEVIEW, GetObjectName (TRUE, 2))
			sayTreeViewItem ()
			Return TRUE
		ElIf GetObjectSubTypeCode (FALSE, 1) == WT_TREEVIEW then
			IndicateControlType (WT_TREEVIEW, GetObjectName (TRUE, 1))
			sayTreeViewItem ()
			Return TRUE
		EndIf
	ElIf iType == WT_LINK
	|| iType == WT_BUTTON
	|| iType == WT_RADIOBUTTON
	|| iType == WT_EDIT then
		SayLine ()
	ElIf iType == WT_ButtonMenu then
		IndicateControlType (iType, GetObjectName (TRUE))
	EndIf
	Return (TRUE)
EndIf	; end of checking the calendar pane is focused...
; Task announcement.
If StringContains (GetWindowName (GlobalRealWindow), scTaskItem)
&& GetControlID (hWnd) == ciReminderTimeEditBox then
	IndicateControlType (iType, GetObjectName (TRUE), GetLine ())
	Return (TRUE)
EndIf
; To announce the meeting location correctly and hopefully other similar edit combos.
;If StringContains (GetWindowName (GlobalRealWindow), scMeetingItem)
If GetControlID (hWnd) == ID_MeetingLocationField
&& iType == WT_EDITCOMBO then
	SayObjectTypeAndText ()
	Return (TRUE)
EndIf

; to announce correctly meeting subject and hopefully other similar multiedit fields...
iControlID = getControlID (hwnd)
If (iControlID == app_subject || iControlID == Bcc_field || iControlID == to_field || iControlID == from_field_2 || iControlID == to_field2)
&& (iType == WT_MULTILINE_EDIT || iType == WT_READONLYEDIT)
	if dialogActive () then ; signatures dialog:
		return Default::HandleCustomWindows (hwnd)
	endIf
	oClient = GetFocusObject (iChildID)
	If oClient
		sObjectValue = oClient.accValue (CHILDID_SELF)
	EndIf
	if StringIsBlank (sObjectValue) then
		sObjectValue = getWindowText (hwnd, READ_EVERYTHING)
	endIf
	if StringIsBlank (sObjectValue) 
	&& iType == WT_READONLYEDIT then
	; a lot of entries in to / cc / bcc, etc.
		oClient = GetUIAObjectTree (hwnd)
		var int i, int ChildCount = oClient.ChildCount, string tmp
		if ChildCount then
			oClient = oClient.FirstChild
			for i=1 to childCount
				tmp = oClient.name
				if ! stringIsBlank (tmp) then
					sObjectValue = sObjectValue+cscSpace+tmp
				endIf
				oClient = oClient.NextSibling
			endFor
		endIf
	endIf
	IndicateControlType (iType, smmReplaceSymbolsWithMarkup (sObjectName), smmReplaceSymbolsWithMarkup (sObjectValue))
	Return (TRUE)
EndIf
; Address book options...
If StringContains (GetWindowName (GetRealWindow (hWnd)), WN_Addressing)
&& (iControlID == ID_PersonalAddresses
|| iControlID == ID_CheckNames)
&& iType == WT_COMBOBOX then
	IndicateControlType (iType, GetObjectName (TRUE), GetWindowText (hWnd, FALSE))
	Say (PositionInGroup (), OT_POSITION)
	Return (TRUE)
EndIf
let gbDeletingMessageFromList=FALSE
; Navigation pane treeview handling...
; To announce the number of unread messages in the treeviews...
If (IsNavigationPane ()
|| (dialogActive () && ! inHjDialog ()))
&& (GetObjectSubTypeCode () == WT_TREEVIEWITEM
|| getWindowSubtypeCode (hwnd) == WT_TREEVIEW) then
	If IsNavigationPane () then
		If GetObjectSubTypeCode (FALSE, 1) == WT_TREEVIEW then
			IndicateControlType (WT_TREEVIEW, GetObjectName (TRUE, 1), cScSpace)
		ElIf GetObjectSubTypeCode (FALSE, 2) ==WT_TREEVIEW then
			IndicateControlType (WT_TREEVIEW, GetObjectName (TRUE, 2), cScSpace)
		Else
			IndicateControlType (WT_TREEVIEW, cScSpace, cScSpace)
		EndIf
		SayTreeViewLevel()
	else
		IndicateControlType (WT_TREEVIEW, cScSpace, CscSpace)
		SayTreeViewItem ()
	endIf
	Return (TRUE)
EndIf
; To announce the attendees responce status correctly...
If iControlID == app_AllAttendeesList
&& iType == WT_LISTBOX then
	IndicateControlType (iType, GetWindowName (hWnd), GetObjectName (TRUE))
	Return (TRUE)
EndIf
; Manage views dialogue...
If sClass == wc_OutlookGrid
&& iControlID == ID_ManageAllViewsListbox then
	let hFound = FindWindowWithClassAndId (GetRealWindow (hWnd), cWc_RichEdit20WPT, ID_ManageAllViewsLabel)
	If hFound then
		let sWinText = GetWindowTextEx (hFound, FALSE, FALSE)
	EndIf
	IndicateControlType (WT_LISTBOX, sWinText, GetSuperGridListItem (hWnd, 0))
	say (PositionInGroup (), OT_POSITION)
	Return (TRUE)
EndIf

If IsMessageTextWindow (hWnd)
&& iControlID == To_Field
	oClient = GetFocusObject (iChildID)
	IndicateControlType (iType, sObjectName, oClient.accValue (CHILDID_SELF))	; fixes the JAWS internal bug and should be removed after fixing internally...
	Return TRUE
EndIf

If IsInOutlookMainWindow (hWnd)
&& iType == WT_EDIT
&& sClass == cwc_Richedit60W
&& iControlID == 1
	If Not StringIsBlank (sWinText)
		IndicateControlType (iType, sObjectName, sObjectValue)
	Else	; if edit box is empty, accValue gives us a help text, which we do not need.
		IndicateControlType (iType, smmReplaceSymbolsWithMarkup (sObjectName))
	EndIf
	Return (TRUE)
EndIf

; new contact edit combo.
If iControlID == con_FileAsField
&& iType == WT_EDITCOMBO
&& sClass == wc_ReComboBox20W
	SayObjectTypeAndText ()
	Return (TRUE)
EndIf
Return FALSE
EndFunction

int function BrailleAddObjectCalendarTimeSlot (int Subtype)
var
	string calendarData = currentCalendarData,
	string objectName = GetObjectName (TRUE)
if getObjectSubtypeCode () == WT_TABLECELL then
	if stringIsBlank (calendarData) then calendarData = getAndCleanUpObjectNameForCalendar (objectName) endIf
	BrailleAddString (calendarData, 0,0,0)
	return TRUE
endIf
return BrailleAddObjectCalendarTimeSlot (Subtype)
endFunction

int function BrailleAddObjectCalendarAppointmentField (int Subtype)
var
	string calendarData = currentCalendarData,
	string objectName = GetObjectName (TRUE)
if getObjectSubtypeCode () == WT_TABLECELL then
	if stringIsBlank (calendarData) then calendarData = getAndCleanUpObjectNameForCalendar (objectName) endIf
	BrailleAddString (calendarData, 0,0,0)
	return TRUE
endIf
return BrailleAddObjectCalendarAppointmentField (Subtype)
endFunction

void Function SayFocusedWindow()
var
	handle hWnd 
If gbWordIsWindowOwner Then
	UIAListenForAtMentionsSearchSuggestions ()
	SayFocusedWindow()
	Return
EndIf
if IsPCCursor() Then
	If (StringContains(GlobalRealWindowName,wn_CustomizeView)
	&& (GlobalCurrentControl >= ciCustomViewFieldsButton && GlobalCurrentControl<=ciCustomViewFormatColumnsButton)) Then
		SaveCursor()
		RouteInvisibleToPc()
		InvisibleCursor()
		IndicateControlType(wt_Button,GetLine(),cscSpace)
		RestoreCursor()
		Return
	EndIf

	If GlobalCurrentControl==message_field then
		; prevent from speaking improper field label of appointment:
		if StringContains(GlobalRealWindowName,wn_Appointment) then
			Say(GetWindowType(GlobalFocusWindow),OT_CONTROL_TYPE, TRUE)
			return
		EndIf
	EndIf ; End of Message field.
EndIf ; End PcCursor.
If IsCalendarView () Then
	If !gbCalendarHasSpoken Then
		let gbCalendarHasSpoken=FALSE
		ReadDateTime (0)
		ReadCalendarData(gsDateToProcess, GetCalendarView ())
	EndIf
	Return
EndIf
; CC field some times has wrong object name:
if ! DialogActive () && globalCurrentControl==cc_field then
	performscript SayLine()
	return
EndIf
if StringContains(globalRealWindowName,scTasks) then
	SayObjectTypeAndText()
	return
endIf
SayFocusedObject ()
EndFunction

Void Function SetGlobals (handle hWnd, int iInitialValues)
If iInitialValues Then
	let GlobalFocusWindow=hWnd
	let GlobalRealWindow = GetRealWindow (GlobalFocusWindow)
	let GlobalRealWindowName = GetWindowName (GlobalRealWindow)
	let RealWindowSpoken = false
	let GlobalAppWindow = GetAppMainWindow (GlobalFocusWindow)
	let GlobalAppWindowName=GetWindowName(GlobalAppWindow)
	let GlobalCurrentControl=GetControlID(GlobalFocusWindow)
	let GlobalWindowClass=GetWindowClass(GlobalFocusWindow)
	let gbIsAddressAutoCompleteListVisible=FALSE
	; Objects...
	let giObjSubType=GetObjectSubTypeCode()
	let GlobalObjectName=GetObjectName(TRUE)
Else ; Set variables with previous values...
	let globalPrevControl=GlobalCurrentControl
	let GlobalPrevReal = GlobalRealWindow
	let GlobalPrevRealName = GlobalRealWindowName
	let GlobalPrevApp = GlobalAppWindow
	let GlobalPrevFocus = GlobalFocusWindow
	let GlobalPrevObjectName=GlobalObjectName
EndIf
EndFunction

Void Function SayFocusedObject ()
var
	handle hFocus,
	int iType,
	int iControlID,
	int iObjectType = GetObjectSubTypeCode (),
	Int iChild,
	Int iTemp,
	string sState,
	string sObjectName,
	string sWinName,
	String sFocusWindowClass,
	Object oClient

If InHJDialog ()
	; for some reason in quick settings edit box we have FocusChangedEventEx firing for every character entered.
	; So we are eating extra chatter here.
	If iObjectType == WT_EDIT
		Return
	EndIf
EndIf
If gbWordIsWindowOwner Then
	if HandleCustomSpellCheckWindows (getCurrentWindow ()) then
		return
	endIf
	SayFocusedObject()
	Return
EndIf
let hFocus = GetFocus()
let iControlID = GetControlID (hFocus)
let sFocusWindowClass = GetWindowClass (hFocus)
let iType=GetWindowSubTypeCode(hFocus)
let sWinName=GetWindowName(hFocus)
;check for Windows XP SDM dialog controls.
;In Vista, these are commonly the com32dlg class dialogs instead.
;Using SayObjectTypeAndText call here prevents dialog title to be announced,
;especially when SayWindowPromptAndText is making the called.
if StringContains(sFocusWindowClass ,wc_bosa_SDM_Mso96)
|| stringContains(GetWindowClass(GetParent(hFocus)),wc_bosa_SDM_Mso96) then
	sayObjectTypeAndText()
	return
endIf
; Two labels in meeting dialog don't get announced...
If StringContains(GlobalRealWindowName,sc_OutlookMeetingDialog) Then
	If iControlID == ciMeetingWhenField Then
		Say(on_MeetingWhenField,ot_screen_message)
	ElIf iControlID == ciMeetingLocationField Then
		Say(on_MeetingLocationField,ot_screen_message)
	EndIf
	SayFocusedObject()
	Return
EndIf ; End of Meeting dialog
If   GetWindowClass(hFocus)==wc_NetUiHwnd Then
	If GlobalMenuMode Then
		Say(GlobalObjectName,ot_line)
		Return
	EndIf
	If iObjectType==wt_treeviewItem  Then
		If (GlobalRealWindowName==wn_TrustCenter
		&& giObjSubType==wt_ListBoxItem) Then
			IndicateControlType(wt_ListBox,cscSpace,cscSpace)
		EndIf
		SayObjectActiveItem(FALSE)
		Return
	EndIf ; Is TreeView
EndIf ; End Netui

If (sWinName==scPreviousTimeButton && GlobalCurrentControl==app_PreviousTimeButton)  Then
	Say(cMsgAutoPickPreviousTime,OT_SCREEN_MESSAGE)
EndIf
;If StringContains(GlobalRealWindowName,wn_SendReceiveGroups) Then
;	If (GlobalCurrentControl==ciOfflineIncludeInF9
;	|| GlobalCurrentControl==ciOfflineScheduleAutomaticSendReceive
;	|| GlobalCurrentControl==ciOfflineAutomaticSendReceiveTime) Then
;		Say(wn_WhenOutlookIsOffline,ot_screen_message)
;	EndIf
;	If ((GlobalCurrentControl==IDC_2
;	|| GlobalCurrentControl==IDC_22)
;	&& StringContains(sWinName,scSendReceiveSpecify)) Then
;			let sObjectName=StringReplaceSubstrings (sObjectName, scEditableText, scNull)
;		IndicateControlType(iType,sObjectName)
;		Return
;	EndIf ; End Time edit file in Send/Receive
;EndIf ; End Send/Receive Groups

If StringContains(GlobalRealWindowName,wn_FormatColumns)
&& StringContains(sWinName,wn_ColumnWidth) Then
	IndicateControlType(iType,sWinName,cscSpace)
	SayObjectActiveItem()
	SayWindow(FinddescendantWindow(GlobalRealWindow,ciCustomViewFormatColumnWidthType),Read_Everything)
	Return
EndIf
;Below we test for window class of GetFocus()
;instead of iControl==ciGridView,
;since timing issue may cause invalid results:
if GetWindowClass(GetFocus()) == "supergrid" then
	SayLine()
	Return
EndIf
; Contact dialog buttons that don't speak name...
If StringContains(GlobalRealWindowName,sc_OutlookContactDialog) then
	if (iControlID ==con_address
	|| iControlID == con_Email_one
	|| (iControlID >= con_phone_descript_one  && iControlID <= con_phone_descript_four) ) Then
		If iControlID == con_address Then
			let GlobalObjectName=scAddressType
		EndIf
		IndicateControlType(iType,GlobalObjectName,cscSpace)
		Return
	elIf sWinName==cscNull then
		IndicateControlType(iObjectType,GetObjectName(true),cscSpace)
		return
	EndIf
EndIf ; End of Contact dialog.
If iObjectType == WT_READONLYEDIT
&& sFocusWindowClass == wc_AfxWndW then
	If iControlID == ID_CalendarPane
	&& GetWindowClass (GetParent (hFocus)) == WC_TaskListPaneParent then
		Say (GetObjectValue (TRUE), OT_SCREEN_MESSAGE)
		Return
	ElIf Not iControlID
	&& GetWindowClass (GetParent (GetParent (hFocus))) == WC_TaskListPaneParent then
		IndicateControlType (iObjectType, GetObjectName (TRUE), GetObjectValue (TRUE))
		Return
	EndIf
EndIf
if iType then
	;SSB-SM: Handles the XP-Only Save Attachments dialog where controls do not have their own window handles and SayWindowTypeAndText speaks the dialog window instead
	If (hFocus != GetRealWindow (GetFocus ()) && GetWindowTypeCode (hFocus) != WT_TOOLBAR) then
		SayWindowTypeAndText (hFocus)
	Else
		SayObjectTypeAndText ()
	EndIf
else
	SayFocusedObject ()
endIf
EndFunction

void function SayNonHighlightedText (handle hwnd, string buffer)
Var
	Handle hFocus = GetFocus (),
	int iWindowType = GetWindowSubTypeCode (hWnd),
	int iShouldSayIncorrectSpell,
	string sClass = GetWindowClass (hwnd),
	int iUnreadMessages

If gbWordIsWindowOwner
	SayNonHighlightedText(hWnd,buffer)
	Return
EndIf
if (nSuppressEcho == on) then
	return
EndIf
If (! DialogActive () && ! GlobalMenuMode) then
;	If GlobalCurrentControl==ciGridView
;	&& StringContains(sClass,wc_Rctrl_sbpwnd32)
;	&& stringContains (buffer, scSendReceiveComplete) then
;		; Gives status during Send/Receive...
;		Say (buffer, OT_NONHIGHLIGHTED_SCREEN_TEXT)
;		Return
;	EndIf
	; Do not act when in menus
	If iWindowType == WT_STATUSBAR then
		If GetWindowSubTypeCode(hFocus)  == WT_TREEVIEW then
			If stringContains (buffer, scComma) then
				let gsUnRedMsgs = StringSegment (buffer, scComma, 2)
				Say (gsUnRedMsgs, OT_NONHIGHLIGHTED_SCREEN_TEXT)
			Else
				let gsUnRedMsgs = cscNull
			EndIf
;		ElIf sClass  == wc_NetUIHWND Then
;			SpeakNumberOfUnReadMessages ()
;		ElIf GetWindowName(ghStatusBar)==wn_ZeroItems
;		&& GlobalCurrentControl==ciGridView Then
;			SayWindow(ghStatusBar,Read_Everything)
		EndIf
	EndIf
EndIf
If sClass == wc_OpenListView then
	If GlobalSuppressOpenListView  then
		SayWindowTypeAndText (hwnd)
		let GlobalSuppressOpenListView = FALSE
		return
	EndIf
EndIf
If IsInOutlookMainWindow (hFocus)
	If GetControlID (hFocus) == 1
	&& GetWindowClass (hFocus) == cwc_Richedit60W
		;If gbUpDownNavigation
			If sClass == cwc_NetUIHwnd
				ghQuickSearchAutoComplete = hWnd
				Return
			EndIf
		;EndIf
	EndIf
EndIf
SayNonHighlightedText (hwnd, buffer)
EndFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	Handle hFocus,
	Int iControlID,
	int bStopProcessing
If gbWordIsWindowOwner then
	return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndIf
let bStopProcessing = PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
if !bStopProcessing
&& !InHJDialog()
&& !UserBufferIsActive() then
	let hFocus = GetFocus ()
	If (nKey != key_UpArrow && nKey != key_DownArrow) then
		let gbUpDownNavigation = FALSE
	EndIf
	If (nKey != key_LeftArrow && nKey != key_RightArrow ) Then
		let gbLeftRightNavigation=FALSE
	EndIf
	; Code for direct date activation...
	If giDateIsEntered
	&& GetWindowSubtypeCode (hFocus) == WT_STATUSBAR
	&& ghCalendarPane then
		If StringContains (SC_DigitalChars, strKeyName) then
			let gsDateEntered = FormatString (msgAddDigit, gsDateEntered, strKeyName)
			If StringLength (gsDateEntered) <= 2 then	; date can not be longer then 2 characters...
				Return true
			EndIf
		EndIf
		UnScheduleFunction (giDateIsEntered)
		let giDateIsEntered = 0
		ClearDateFlag ()
		TypeKey (strKeyName)
		Return true
	EndIf
	;any key should reset the trigger
	let iTrigger=false
	; resets tree view spoken flag to prevent double speaking of folder name in folder list
	let iTreeViewSpoken = FALSE
	;let iControlID = GetControlID(GetFocus())
	;;code to turn off selecting for selecting discontiguous messagess
	;if iControlID == ciGridView then
	;	if !((nKey == Key_ControlDwn)
	;	&& (nSelectingText == True)) then
	;		let nSelectingText = False
	;	EndIf
	;EndIf
EndIf
return bStopProcessing
EndFunction

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	Handle hFocus,
	int ControlAttributes = getControlAttributes (),
	int iObjectType,
	Int iControlID,
	int bIsSpaceBar
; always unload Outlook message table elements:
if KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	UnloadOutlookMessageTableData ()
endIf
if gbWordIsWindowOwner then
	return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndIf
let hFocus = GetFocus ()
if globalMenuMode>0
|| UserBufferIsActive()
|| InOptionsDialog(hFocus) Then
	return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
endIf
let iObjectType = GetObjectSubTypeCode ()
let iControlID = GetControlID (hFocus)
let bIsSpaceBar = KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey)
;if iControlID == ciGridView then
;	If bIsSpaceBar
;	|| nKey == Key_ControlSpace then
;		SelectMessage()
;	EndIf
;EndIf
If bIsSpaceBar then
	;??? The following block is never executed. Is the global variable clear needed?
	if inHJDialog() then
		let gbActiveItemChanged=true
		return ProcessSpaceBarKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
	EndIf
	;Prevent  checkboxes from repeating in dialogs:
	If getWindowSubtypeCode (hFocus) == WT_CHECKBOX then
		return ProcessSpaceBarKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
	EndIf
	If GlobalRealWindowName==wn_TrustCenter  Then
		If giObjSubType==wt_CheckBox Then
			Delay(1,TRUE)
			IndicateControlType(giObjSubType,GetObjectName(TRUE),cscSpace)
		EndIf
		Return true
	EndIf
	If GlobalCurrentControl == ic_AdvancedFindNowButton then
		; Move to the Found Items List
		Delay(3)
		GoToFoundItems()
	EndIf
	; For Categories list in Appointment creation dialog.
	If StringContains(GlobalWindowClass,wcReListBox)
	&& GlobalCurrentControl==ciCategoriesListBox Then
		Delay(2)
		PerformScript SayLine()
		Return true
	EndIf
	If IsMessagesList()
	|| GlobalCurrentControl==Contact_List Then
		SayFormattedMessage(OT_SELECT,cMsgSelected)
		SayLine()
		Return true
	EndIf
	if (StringContains(GlobalRealWindowName,wn_RulesWizard)
	|| StringContains(GlobalRealWindowName,wn_RulesAndAlerts)) Then
		If (GetWindowSubtypeCode (hFocus) == WT_LISTBOX
		|| iObjectType==wt_ListBoxItem)
		&& (GlobalCurrentControl==ciRulesConditionCheckList
		|| GlobalCurrentControl==ciRulesList ) Then
			MSAARefresh()
			Delay(1,TRUE)
			SayLine()
			Return true
		EndIf
	EndIf ; End of Rules wizard.
	If GetWindowClass(hFocus)==wc_BosaSDMDlg
	&& GlobalRealWindowName==wn_Customize Then
		Delay(3)
		Say(GetObjectName(TRUE),ot_line)
		If (getControlAttributes(true)&ctrl_checked) then
	 		IndicateControlState(wt_checkbox,ctrl_checked)
		Elif (getControlAttributes(true)&ctrl_unchecked) then
			IndicateControlState(wt_checkbox,ctrl_unchecked)
		EndIf
		Return true
	EndIf
	if iObjectType == WT_TREEVIEW || iObjectType == WT_TREEVIEWITEM then
	;ControlCanBeChecked returns TRUE for every single tree in Outlook:
		delay (2, TRUE) ; from default, necessary for shared calendars and public folder tree views.
		if ControlAttributes & (CTRL_UNCHECKED|CTRL_PARTIALLY_CHECKED) then
			sayMessage (OT_ITEM_STATE, cmsg_notchecked)
			return TRUE
		elIf ControlAttributes & CTRL_CHECKED then
			sayMessage (OT_ITEM_STATE, cMSG_checked)
			return TRUE
		endIf
	endIf
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
If GetFolderType () == 2 then	; Contacts...
	MSAARefresh ()
EndIf
ProcessKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void Function AutoFinishEvent ()
if g_OutlookUIAEvents
	ComDetachEvents (g_OutlookUIAEvents)
	g_OutlookUIAEvents = nullObject;
	OutlookUIAEventsWerHooked = OFF
EndIf
CollectionRemoveAll (atmentionsActiveSuggestion)
atmentionsActiveSuggestion = null ()
CollectionRemoveAll  (PrevCalendarInfo)
currentCalendarInfo = null ()
let gsCurrentDateRange=scNull
let gbWordIsWindowOwner=FALSE
let gbOutlookIsActive=FALSE
let ghReminderReturn=ghNull ; Null out when Alt+Tab is used.
let giMiscellaneousFlag=giMSAALevel ; Save original MSAA level set in AutoStartEvent.
if globalInitializeOMScheduler then
	unscheduleFunction (globalInitializeOMScheduler)
	globalInitializeOMScheduler = 0
endIf
If iScheduledFunctionId Then
	UnscheduleFunction(iScheduledFunctionId)
EndIf
let iSuppressCheckForBold = false
let GlobalPrevCalendarDay=cscNull
let gsDateToProcess=scNull
let gsPreviousDateToProcess=scNull
let giTicksInAutoStart=0
let giFieldHasSpoken=FALSE
let gbActiveItemChanged=false
let gbMessageHasBeenRead=false
collectionRemoveAll (globalAddressFieldsValueChangeCollection)
unscheduleFunction (globalAddressFieldsValueChangeCollection.timerID) ; scheduled from valueChangedEvent 
globalAddressFieldsValueChangeCollection = null ()
EndFunction

void function SayHighlightedText (handle hwnd, string buffer)
var
	handle HCurrent = GetCurrentWindow (),
	handle hFocus = GetFocus (),
	int iObjectType = GetObjectTypeCode (TRUE),
	int iFocusWindowType = GetWindowSubtypeCode (hFocus),
	int iCount,
	int iRestLevel,
	int iWindowType = GetWindowSubTypeCode (hWnd),
	string sGraphicCharacter,
	string sClass = GetWindowClass (hWnd),
	int iControl =GetControlId(hWnd),
	int iGraphicsSetting

If gbWordIsWindowOwner
	SayHighlightedText (hWnd, buffer)
	Return
EndIf
giHasAddressAutoComplete = FALSE
gsBrlAutoComplete = cscNull
If IsMessagesList ()
	Return	;handle through MSAA using ActiveItemChangedEvent...
EndIf
; For first-letter navigation in EditCombos with ObjTypes of ListBoxItem...
If iWindowType == WT_EDITCOMBO
&& (iObjectType == WT_LISTBOXITEM
|| iObjectType == WT_EDIT) Then
	;prevent double-speaking in font edit combos:
	If GetWindowName (GetRealWindow (hWnd)) != WN_Font
		Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
		Return
	EndIf
EndIf
If hFocus != hWnd
&& sClass == cWC_ComboLBox
	If iWindowType == WT_EDITCOMBO
		If Not StringCompare (Buffer, GetWindowText (hFocus, TRUE))
			Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
		EndIf
		Return
	EndIf
EndIf
; to correctly announce the file name substitution in Windows Vista dialogues...
If iWindowType == WT_LISTVIEW
&& iObjectType == WT_EDIT
&& (! iControl)
&& GetOwningAppName (hWnd) == FN_BrowseUserInterfaceDLLName
	Say (GetObjectValue (TRUE), OT_SELECTED_ITEM)
	Return
EndIf
If iWindowType == WT_LISTVIEW
|| iWindowType == WT_EDITCOMBO
|| giInAppointmentField
	Return
EndIf
If (StringContains (GlobalRealWindowName,WN_RulesWizard)
|| StringContains (GlobalRealWindowName, WN_RulesAndAlerts))
	If GetWindowSubtypeCode (GetCurrentWindow ()) == WT_LISTBOX
	&& (iControl == ciRulesConditionCheckList
	|| iControl == ciRulesList)
		Return
	EndIf
EndIf ; End of Rules wizard.
; Message, Contact, Appointments, Tasks, and Notes  list...
If iControl==ciGridView
|| iControl==ic_AdvancedFindResultList
&& sClass== wc_OutlookGrid
	Return	; handled through ActiveItemChangedEvent.
EndIf
; Meeting scheduling...
If iControl == app_Required
	gsScheduleMeetingItem = buffer
	Say (buffer, OT_SCREEN_MESSAGE)	; Need to use ot_screen_message because no focus.
	Return
Else
	gsScheduleMeetingItem = cscNull
EndIf
If GlobalMenuMode
	Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
	Return
EndIf
if iTrigger
	Return
EndIf
If AdvancedFindingItems
	Return
EndIf
; this global is set in the JAWSDelete script when a conversation is deleted in the messages list.
; It keeps a deleted conversation from being repeated in the messages list.
If giDeleteGroupByFlag
	giDeleteGroupByFlag  = FALSE
	Return
EndIf
iWindowType = GetWindowSubTypeCode (HCurrent)
iControl = GetControlID (hFocus)
If sClass == WCReListBox
	If iControl == ciCategoriesListBox
		PerformScript SayLine ()
		Return
	EndIf
EndIf

If (! iTreeViewSpoken)
&& iFocusWindowType == WT_TREEVIEW
	Return
EndIf

if DialogActive ()
	If GlobalRealWindowName  == SCSpellingDialogName
		If iWindowType == WT_LISTBOX
		&& hWnd == hFocus
			Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
			SpellString (buffer)
			Return
		EndIf ; end of listbox check.
	EndIf ;end of spell check window.
EndIf ;End of dialog active.

If hWnd == hFocus
|| iWindowType == WT_COMBOBOX
	If iControl == changeTo_field
	|| iControl == NotInDictionary_Field
		;Do nothing, as is already handled via SayNonHighlightedText from another more reliable window
		Return
	EndIf ; End of change to/not in dictionary.
	SayHighlightedText (hWnd, buffer)
	Return
EndIf
; If in ListViews, let ActiveItemChangedEvent handle it.
; for arrowing in System Menu
If GlobalMenuMode
&& iObjectType != WT_MENUBAR
&& iWindowType == WT_MENU
|| iWindowType == WT_CONTEXTMENU
	Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
EndIf
If IsInOutlookMainWindow (hFocus)
	If GetControlID (hFocus) == 1
	&& GetWindowClass (hFocus) == cwc_Richedit60W
		;If gbUpDownNavigation
			If sClass == cwc_NetUIHwnd
				ghQuickSearchAutoComplete = hWnd
				Return
			EndIf
		;EndIf
	EndIf
EndIf
EndFunction

int Function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
var
	Int iWindowType = GetWindowSubtypeCode(hFocus),
	Int iControlID = GetControlID(hFocus),
	String sWindowClass = GetWindowClass (hWnd)
If gbWordIsWindowOwner Then
	return NewTextEventShouldBeSilent(hFocus, hwnd, buffer,nAttributes,nTextColor,nBackgroundColor,nEcho,sFrameName)
EndIf
if OutlookVersion >= 16
&& hwnd == hFocus
&& sWindowClass == wc_ReComboBox20W
	; extra speech when deleting or backspacing characters:
	if nSuppressEcho then
		nSuppressEcho = FALSE
		return TRUE
	endIf
endIf
if hWnd == hFocus then
	;This condition excludes / causes most supergrids to bail out without speaking.
	if (iWindowType == wt_ListBox
	&& !(GlobalObjectName == wn_MembersList
	|| GlobalObjectName == wn_OrganizerList))
	|| iWindowType == wt_ListView
	|| iWindowType == WT_MULTISELECT_LISTBOX
	|| iWindowType == WT_EXTENDEDSELECT_LISTBOX
	|| iWindowType == wt_TreeView then
		return true ;handled by ActiveItemChangedEvent
	EndIf
Else	; new text on non-focused window...
	if sWindowClass == cwc_ComboLBox then
		; Avoids double speech on arrowing in open combos and edit combos [DGL]
		return false
	endIf
EndIf
if getWindowClass (hwnd) == cwc_NetUIHwnd && getWindowClass (GetFocus ()) == cwc_RichEdit20WPT then
	if StringContains (buffer, wn_AutoReply_Infobar) then
		InfoBarShowEvent (hwnd)
	endIf
endIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer,nAttributes,nTextColor,nBackgroundColor,nEcho,sFrameName)
EndFunction

string Function GetNumberOfAttachments ()
var
	int nAttachments,
	string sNumOfAttachments
let nAttachments=GetAttachmentCount() ; Get count from object.
If nAttachments then
	If nAttachments == 1 then
		let sNumOfAttachments = msgOneAttachment
	Else
		let sNumOfAttachments = FormatString (msgAttachments, IntToString (nAttachments))
	EndIf
Else
	let sNumOfAttachments = cScNull
EndIf
return sNumOfAttachments
EndFunction

Script ScreenSensitiveHelp ()
var
	handle hCurrent,
	handle hFocus,
	int iWindowType,
	string SWinName,
	string sAppWinName,
	string sName,
	int IControlID,
	string SField,
	string sHelp_L,
	string sHelp_S,
	int iMSAALevel
if IsSameScript() then
	AppFileTopic(topic_outlook)
	return
endIf
If gbWordIsWindowOwner Then
	PerformScript ScreenSensitiveHelp()
	Return
EndIf
if IsVirtualRibbonActive() then
	If GlobalMenuMode == MENUBAR_ACTIVE then
	 	ShowScreenSensitiveHelpForVirtualRibbon(true)
	ElIf GlobalMenuMode == MENU_ACTIVE then
		ShowScreenSensitiveHelpForVirtualRibbon(false)
	EndIf
	Return
EndIf
let hCurrent = GetCurrentWindow ()
let hFocus=GetFocus()
if inRibbons() Then
	PerformScript ScreenSensitiveHelp ()
	Return
EndIf

if GlobalMenuMode  then
	if GlobalMenuMode == 2 then
		ScreenSensitiveHelpForKnownClasses (WT_MENU)
	else
		ScreenSensitiveHelpForKnownClasses (WT_MENUBAR)
	EndIf
	return
EndIf
let SField = GetControlName ()
let SWinName = GetWindowName (GetRealWindow (hCurrent))
let IControlID = GetControlID (hCurrent)
let iWindowType = GetWindowSubtypeCode (GetCurrentWindow ())
If !iWindowType Then
	let iWindowType = GetObjectSubTypeCode ()
EndIf
if ScreenSensitiveHelpForJAWSDialogs () then
	return
EndIf
;For note text field, clarify testers' confusion on Sticky Notes:
if stringContains (sWinName, scNoteDialogName)
&& iWindowType == WT_MULTILINE_EDIT then
	showScreenSensitiveHelp (msgScreenSensitiveHelpNoteBody)
	Return
endIf
If IsNavigationPane () Then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp_NavigationPane)
	AddHotKeyLinks ()
	return
EndIf
If UserBufferIsActive () then
 UserBufferDeactivate ()
 SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
 Return
EndIf
if StringContains (SWinName, scOutlookTodayDialogName ) then
	SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp2_l, msgScreenSensitiveHelp2_S)
	AddHotKeyLinks ()
	return
EndIf

let sAppWinName=GetWindowName (GetAppMainWindow (hFocus))
; Grid view list for Contact, Message, Appointment, Tasks, and notes lists.
If iControlId==ciGridView
|| StringContains (sAppWinName, scContactsList1)
|| StringContains (sAppWinName, scTaskList1) then
	If  StringContains(GlobalObjectName,scAppointmentsItem) Then
		let sHelp_L=FormatString(cMsgScreenSensitiveHelpAppointmentList_L, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		let sHelp_S=FormatString(cMsgScreenSensitiveHelpAppointmentList_S, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
	ElIf  StringContains(GlobalObjectName,scContactItem) Then
		let sHelp_L=FormatString(cMsgScreenSensitiveHelpContactList_L, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		let sHelp_S=FormatString(cMsgScreenSensitiveHelpContactList_S, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
	ElIf  StringContains(GlobalObjectName,scTaskItem) Then
		let sHelp_L=FormatString(cMsgScreenSensitiveHelpTaskList_L, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		let sHelp_S=FormatString(cMsgScreenSensitiveHelpTaskList_S, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
	ElIf StringContains(sWinName,scNotesItem) Then
		let sHelp_L=FormatString(cMsgScreenSensitiveHelpNoteList_L, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		let sHelp_S=FormatString(cMsgScreenSensitiveHelpNoteList_S, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
	ElIf StringContains(GlobalObjectName,scMessageItem)
	; or on an empty folder, look for column name Subject:
	|| GlobalObjectName == scMessageItemEmptyFolder2013
	|| StringContains (GlobalObjectName, scSubject) Then
		let sHelp_L=FormatString(cMsgScreenSensitiveHelpMessageList_L, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		let sHelp_S=FormatString(cMsgScreenSensitiveHelpMessageList_S, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		If BrailleInUse() Then
			let sHelp_L = sHelp_L+cscBufferNewLine+cscBufferNewLine+
				FormatString(MsgBrlStructuredModeHelp)+cscBufferNewLine+
				MsgBrlMessageListHelp_L
			let sHelp_S = sHelp_S+cscBufferNewLine+cscBufferNewLine+
				FormatString(MsgBrlStructuredModeHelp)+cscBufferNewLine+
				MsgBrlMessageListHelp_S
		EndIf
	EndIf
	SayMessage(OT_USER_BUFFER, sHelp_L, sHelp_S)
	AddHotKeyLinks ()
	Return
EndIf ; End of grid view list.
; Message body...
If StringContains(sWinName,scMessage) Then
	; Message header fields...
	; for the message header controls
	If iControlId==from_field  Then
		let sHelp_L=cMsgFromFieldHelp_L
		let sHelp_S=cMsgFromFieldHelp_S
	ElIf iControlId==Sent_field Then
		let sHelp_L=cMsgSentFieldHelp_L
		let sHelp_S=cMsgSentFieldHelp_S
	ElIf iControlId==To_field Then
		let sHelp_L=cMsgToFieldHelp_L
		let sHelp_S=cMsgToFieldHelp_S
	ElIf iControlId==Cc_field Then
		let sHelp_L=cMsgCCFieldHelp_L
		let sHelp_S=cMsgCCFieldHelp_S
	ElIf iControlId==Subject_field Then
		let sHelp_L=cMsgSubjectFieldHelp_L
		let sHelp_S=cMsgSubjectFieldHelp_S
	ElIf iControlId==To_Button Then
		let sHelp_L=cMsgToButtonHelp_L
		let sHelp_S=cMsgToButtonHelp_S
	ElIf iControlId==CC_Button Then
		let sHelp_L=cMsgCCButtonHelp_L
		let sHelp_S=cMsgCCButtonHelp_S
	; for attachments list:
	ElIf iControlId == ciAttachmentList then
		SayFormattedMessage (ot_user_buffer, FormatString (msgScreenSensitiveHelpAttachmentEdit, GetNumberOfAttachments ()))
		AddHotKeyLinks ()
		return
	EndIf
	SayFormattedMessage (OT_USER_BUFFER, sHelp_L, sHelp_S)
	AddHotKeyLinks ()
	return
EndIf ; End of Message

If GetWindowCategory () == WCAT_STATUSBAR_TOOLBAR
		SayFormattedMessage (OT_USER_BUFFER, msgStatusBarToolBarTutorialHelp)
	AddHotKeyLinks ()
	Return
EndIf

If GetCalendarView() Then
	let sHelp_L=FormatString(msgScreenSensitiveHelp3a_L, GetScriptKeyName(csnSayPriorCharacterScript),
	GetScriptKeyName(csnSayNextCharacterScript), GetScriptKeyName(csnSayPriorLineScript),
	GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnJAWSHomeScript),
	GetScriptKeyName(csnJAWSEndScript),  GetScriptKeyName(csnSayLineScript),GetScriptKeyName(snSayDateScript))

	let sHelp_L=sHelp_L+cScBufferNewLine+FormatString(msgScreenSensitiveHelp3b_L,GetScriptKeyName(snAppointmentsAndAttachmentsScript),
		GetScriptKeyName(csnTabKeyScript),		GetScriptKeyName(csnShiftTabKeyScript),
		GetScriptKeyName(csnSayPriorLineScript), 		GetScriptKeyName(csnSayNextLineScript),GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayWindowPromptAndTextScript))
	let sHelp_S=FormatString(msgScreenSensitiveHelp3a_S, GetScriptKeyName(csnSayPriorCharacterScript),
		GetScriptKeyName(csnSayNextCharacterScript), GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript),
		GetScriptKeyName(csnJAWSHomeScript), GetScriptKeyName(csnJAWSEndScript),  GetScriptKeyName(csnSayLineScript),GetScriptKeyName(snSayDateScript))
	let sHelp_S=sHelp_S+cScBufferNewLine+FormatString(msgScreenSensitiveHelp3b_S,GetScriptKeyName(snAppointmentsAndAttachmentsScript),
		GetScriptKeyName(csnTabKeyScript),		GetScriptKeyName(csnShiftTabKeyScript),
		GetScriptKeyName(csnSayPriorLineScript), 		GetScriptKeyName(csnSayNextLineScript),GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayWindowPromptAndTextScript))
	If BrailleInUse() Then
		let sHelp_L = sHelp_L+cscBufferNewLine+cscBufferNewLine+
			FormatString(MsgBrlStructuredModeHelp)+cscBufferNewLine+
			msgBrlCalendarGridHelp_L
		let sHelp_S = sHelp_S+cscBufferNewLine+cscBufferNewLine+
			FormatString(MsgBrlStructuredModeHelp)+cscBufferNewLine+
			msgBrlCalendarGridHelp_S
	EndIf
	SayMessage(OT_USER_BUFFER, sHelp_L, sHelp_S)
	AddHotKeyLinks ()
	return
EndIf
; Calendar's Active Appointment list
if StringContains (sAppWinName, wn_Calendar)
&& IControlID==Cal_List Then
	let sHelp_L=FormatString(msgScreenSensitiveHelp4, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnSayLineScript), GetScriptKeyName(csnEnterScript))
	SayFormattedMessage(OT_USER_BUFFER,sHelp_L)
	AddHotKeyLinks ()
	return
EndIf

If StringContains (sWinName, scMessage) then
	If iControlId == ciAttachmentList then
		SayFormattedMessage (ot_user_buffer, FormatString (msgScreenSensitiveHelpAttachmentEdit, GetNumberOfAttachments ()))
		AddHotKeyLinks ()
		return
	EndIf
EndIf
; Reminder window...
If StringContains(sWinName,wn_ReminderWindow) Then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp_ReminderWindow)
	AddHotKeyLinks ()
	return
EndIf
If FindDescendantWindow(GlobalRealWindow,app_AllAttendeesStatus)
&& (StringContains(GlobalRealWindowName,scMeetingDialog)
|| StringContains(GlobalRealWindowName,scAppointmentDialog)) Then
	; in the Appointment scheduling dialog
	let sHelp_L=FormatString(msgScreenSensitiveHelpAppointmentScheduler_L,GetScriptKeyName(snGetAttendeesStatusScript))
	let sHelp_S=FormatString(msgScreenSensitiveHelpAppointmentScheduler_S,GetScriptKeyName(snGetAttendeesStatusScript))
	SayMessage(OT_USER_BUFFER, sHelp_L, sHelp_S)
	AddHotKeyLinks ()
	Return
EndIf
; Correct tutor help in the send/Recieve group...
If StringContains (SWinName, wn_SendReceiveSettings)
&& iControlID == ciAccountsList
&& iWindowType == WT_LISTBOXITEM then
	ScreenSensitiveHelpForKnownClasses (WT_LISTBOX)
	Return
EndIf

PerformScript ScreenSensitiveHelp ()
EndScript

Script HotKeyHelp ()
var
	Handle hFocus,
	string SWinName,
	int IControlID,
	Int iFolderType,
	Int iObjectType,
	int iWinType,
	Int iNumCalls,
	string sTemp_L,
	string sTemp_S,
	string sName,
	String sParentWindowClass,
	String sFocusWindowClass
if TouchNavigationHotKeys() then
	return
endIf
If gbWordIsWindowOwner Then
	PerformScript HotKeyHelp()
	Return
EndIf
If UserBufferIsActive () then
	If StringContains (UserBufferGetText (), FormatString(cMsgHotKeysLink))
&& GetCurrentScriptKeyName () == cKsEnter then
		If (! JAWSHotKeys()) then
			GeneralJAWSHotKeys ()
		EndIf
		Return
	EndIf
	UserBufferDeactivate ()
EndIf
if inHJDialog() then
	performScript HotKeyHelp()
	return
EndIf

let sTemp_L =msgHotKeyHelp1_L+cScBufferNewLine
let sTemp_S =msgHotKeyHelp1_S+cScBufferNewLine
let hFocus = GetFocus ()
let sFocusWindowClass = GetWindowClass (hFocus)
let SWinName = GetWindowname (GetRealWindow (hFocus))
let iControlID = GetControlID (hFocus)
let iObjectType = GetObjectSubTypeCode ()

If (! DialogActive ())
&& IsInOutlookMainWindow (hFocus) then
	let sParentWindowClass = GetWindowClass (GetParent (hFocus))
	let iFolderType = GetFolderType ()
	If Not iFolderType		; message list window
	&& iControlID == ciGridView
	&& sParentWindowClass == wc_Rctrl_RenWnd32 then
		let sTemp_L=sTemp_L+cscSpace+cMsgHotKeyHelpMessageList_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
		let sTemp_S=sTemp_S+cscSpace+cMsgHotKeyHelpMessageList_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
	ElIf iFolderType == 1	; calendar view...
	&& (iObjectType == WT_STATIC
	|| iObjectType == WT_READONLYEDIT)
	&& ((! iControlID)
	|| iControlID == ID_CalendarPane) then
		If GetCalendarView () == ciMonthView then
			let sTemp_L=sTemp_L+cscSpace+ cMsgHotKeyHelpCalendarMonthView_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
			let sTemp_S=sTemp_S+cscSpace+ cMsgHotKeyHelpCalendarMonthView_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
		Else
			let sTemp_L=sTemp_L+cscSpace+ cMsgHotKeyHelpCalendarNotMonthView_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
			let sTemp_S=sTemp_S+cscSpace+ cMsgHotKeyHelpCalendarNotMonthView_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
		EndIf
	ElIf iFolderType == 2	; Contacts view...
	&& iControlID == Contact_List then
		let sTemp_L=sTemp_L+cscSpace+cMsgHotKeyHelpContactList_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
		let sTemp_S=sTemp_S+cscSpace+cMsgHotKeyHelpContactList_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
	ElIf iFolderType == 3	; To Do list...
	&& iControlID == ciGridView then
		let sTemp_L=sTemp_L+cscSpace+cMsgHotKeyHelpTaskList_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
		let sTemp_S=sTemp_S+cscSpace+cMsgHotKeyHelpTaskList_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
	ElIf iFolderType == 5	; Notes view...
	&& iObjectType == WT_LISTVIEW then
		let sTemp_L=sTemp_L+cscSpace+cMsgHotKeyHelpNoteList_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
		let sTemp_S=sTemp_S+cscSpace+cMsgHotKeyHelpNoteList_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
	ElIf IsNavigationPane () then
		let sTemp_L = sTemp_L+cscSpace+cMsgHotKeyHelpNavigationPane_L
		let sTemp_S = sTemp_S + cscSpace + cMsgHotKeyHelpNavigationPane_S
	ElIf iControlID == ciGridView
	&& sParentWindowClass == WC_TaskListPaneParent then
		let sTemp_L=sTemp_L+cscSpace+cMsgHotKeyHelpTaskList_L
		let sTemp_S=sTemp_S+cscSpace+cMsgHotKeyHelpTaskList_S
	ElIf (iControlID == ID_CalendarPane
	|| (! iControlID))
	&& sFocusWindowClass == wc_AfxWndW
	&& iObjectType == WT_READONLYEDIT then
		let sTemp_L=sTemp_L+cscSpace+cMsgHotKeyHelpAppointmentList_L
		let sTemp_S=sTemp_S+cscSpace+cMsgHotKeyHelpAppointmentList_S
	EndIf
	SayMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	Return
EndIf

; Grid view list for Contact, Task, Notes, Message, and Appointments list.
/*
If iControlID == ciGridView Then
	let iFolderType = GetFolderType ()
	let sName=GetObjectName(TRUE)
	;If sName==scMessageItem Then
	If iFolderType == 0 then	; Message list (Inbox, Outbox, Deleted and so on)
		let sTemp_L=sTemp_L+cscSpace+cMsgHotKeyHelpMessageList_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
		let sTemp_S=sTemp_S+cscSpace+cMsgHotKeyHelpMessageList_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
	ElIf sName==scAppointmentsItem Then
		let sTemp_L=sTemp_L+cscSpace+cMsgHotKeyHelpAppointmentList_L
		let sTemp_S=sTemp_S+cscSpace+cMsgHotKeyHelpAppointmentList_S
	ElIf sName==scContactItem Then
		let sTemp_L=sTemp_L+cscSpace+cMsgHotKeyHelpContactList_L
		let sTemp_S=sTemp_S+cscSpace+cMsgHotKeyHelpContactList_S
	;ElIf sName==scTaskItem Then
	ElIf iFolderType == 3 then	; To Do List...
		let sTemp_L=sTemp_L+cscSpace+cMsgHotKeyHelpTaskList_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
		let sTemp_S=sTemp_S+cscSpace+cMsgHotKeyHelpTaskList_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
	ElIf sName==scNotesItem Then
		let sTemp_L=sTemp_L+cscSpace+cMsgHotKeyHelpNoteList_L
		let sTemp_S=sTemp_S+cscSpace+cMsgHotKeyHelpNoteList_S
	EndIf
	SayMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	Return
EndIf ; End of grid view list.
*/

if DialogActive () then
	if (SWinName == scSpellingDialogName)  then
		let sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp2_L
		let sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp2_S
		SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
		AddHotkeyLinks()
		return
	EndIf
EndIf
if (StringContains (sWinName, scNoteDialogName)) then
	;Only add here if in a note:
	if getWindowSubtypeCode (getFocus ()) == WT_MULTILINE_EDIT then
		let sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp3_L
		let sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp3_S
	endIf
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	return
elif (StringContains (sWinName, scTasks)) then
	let sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp4_L
	let sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp4_S
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	return
elif (StringContains (sWinName, sc_OutlookMessageDialog)) then
	let sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp6_L
	let sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp6_S
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	return
EndIf
if (StringContains (sWinName, wn_Calendar)) then
;	let giCalendarView=GetCalendarView()
	If IsCalendarView () Then
		let sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp5_L
		let sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp5_S
	ElIf IControlID==Cal_List Then
		let sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp10_L
		let sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp10_S
	EndIf
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	return
EndIf

if (StringContains (sWinName, scContactsList1)) then
	let sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp7_L
	let sTemp_s = sTemp_S+cscSpace+msgHotKeyHelp7_S
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	Return
EndIf
If FindDescendantWindow(GlobalRealWindow,app_AllAttendeesStatus) Then
	; in the Appointment scheduling dialog
	let sTemp_L = sTemp_L+cscSpace+msgHotKeyHelpAppointmentScheduler_L
	let sTemp_S = sTemp_S+cscSpace+msgHotKeyHelpAppointmentScheduler_L
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	Return
EndIf
; in the Meeting/Appointment scheduling dialog
If  StringContains(sWinName,scMeetingDialog)
|| StringContains(sWinName,scAppointmentDialog) Then
	let sTemp_L = sTemp_L+cscSpace+msgHotKeyHelpAppointmentScheduler_L
	let sTemp_S = sTemp_S+cscSpace+msgHotKeyHelpAppointmentScheduler_S
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	Return
EndIf
if StringContains (sWinName, scContactItem)
|| StringContains(globalRealWindowName,formatString(wn_Any_Event,SWinName))
|| StringContains(globalRealWindowName,wn_Appointment) then
	let sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp7_L
	let sTemp_s = sTemp_S+cscSpace+msgHotKeyHelp7_S
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	Return
EndIf
PerformScript HotKeyHelp()
EndScript

Void Function Unknown (string TheName, int IsScript, optional int IsDueToRecursion)
let giTicksInAutostart=GetTickCount()-giTicksInAutoStart
if GiTicksInAutostart<20000000 then
	return
EndIf
If StringContains (TheName,scBrailleAddObject)
|| StringContains (TheName,fn_setglobals)
|| StringContains (TheName,fn_getcalendarview)
|| StringContains (TheName,scGotoBodyWindow)
|| stringContains(theName,fn_PointNeedsMarking)
|| stringContains(theName,fn_UserBufferOverVirtualDocument)
|| stringContains(theName,fn_QuickNavKeyTrapping)
|| StringContains(theName,fnINOptionsDialog)
|| StringContains(theName,fnIsFormField)
|| StringContains(theName,fn_IsStatusBarToolBar)
|| StringContains (theName, FN_ReadOutlookMessage)
|| theName == "ReadOutlookMessage"
|| theName == "IsActiveDocumentProtected"
|| TheName == "ShouldMessageTypeSpeak"
|| theName==fn_CaretMovedEvent then
	return
endIf
Unknown (theName, isScript, IsDueToRecursion)
EndFunction

script ControlDelete()
; Deletes a word in email message
TypeKey(ksDeleteWord) ;Instead of TypeCurrentScriptKey, so additional key assignments to script will work
Pause()
if CaretVisible() then
	SayWord()
EndIf
EndScript

Script PermenantDelete ()
SetDeletedGroupByFlag  ()
let gsBrlAutoComplete=cscNull
TypeCurrentScriptKey ()
; Message, Contacts, Appontments, Task, and Notes list.
If GlobalCurrentControl==ciGridView Then
	let giLineHasSpoken=FALSE
	BrailleRefresh ()
 ResetMessageFlagVariables ()
	Delay(2)
;	SpeakMessageFlags()
	CheckForNoMoreItems(OT_POSITION)
	Return
EndIf ; End of GridView4704.
EndScript

Script DeleteWord ()
If gbWordIsWindowOwner Then
	PerformScript DeleteWord()
	Return
EndIf
SaveCursor ()
InvisibleCursor ()
RouteInvisibleToPC ()
NextWord ()
SayWord ()
RestoreCursor ()
TypeCurrentScriptKey ()
EndScript

void function SayParentGroupboxForWindowPromptAndText()
if GlobalCurrentControl==Contact_List
&& GetFolderType () == 2	; contacts list...
	;avoid double speaking:
	return
EndIf
SayParentGroupboxForWindowPromptAndText()
EndFunction

Script SayWindowPromptAndText ()
var
	handle hFocus,
	Object oLabel,
	int iType,
	int iControlID,
	String RealWindowName,
	String sFocusWindowClass,
	int nMode,
	Int iLabel
if handleNoCurrentWindow() then
	return
endIf
; First exclude the attachments richedit list field, where Word is the owner,
; but it needs to behave as it used to in prior versions of Outlook:
if MenusActive () || inHjDialog () then
	PerformScript SayWindowPromptAndText ()
	return
endIf
if IsAttachmentsListField()
&& getCurrentWindow () == getFocus () Then
	return self::sayWindowTypeAndText (getFocus ())
endIf
If gbWordIsWindowOwner then
	If collectionItemsCount (atmentionsActiveSuggestion) then
	; atMentions active suggestion
	let nMode=smmTrainingModeActive()
	; append Description with space so the punctuation does not run up against the type during speech:
	var string description = atmentionsActiveSuggestion.description
	; avoid compiler error where cannot concatenate with string data member of collection:
	description = description+cscSpace
		indicateControlType (WT_MENU, description, atmentionsActiveSuggestion.ELEMENT.NAME)
		smmToggleTrainingMode(nMode)
		return
	endIf
	PerformScript SayWindowPromptAndText()
	Return
EndIf
let gbSayWindowPromptAndText=TRUE
let nMode=smmTrainingModeActive()
let hFocus = GetFocus ()
let sFocusWindowClass = GetWindowClass (hFocus)
let iControlID = GetControlID (hFocus)
Let iType = GetWindowSubTypeCode (hFocus)
If ! iType then
	Let iType = GetObjectSubTypeCode ()
EndIf
; calendar handling
If IsCalendarView() Then
	If sFocusWindowClass == wc_AfxWndW then	; either a calendar pane or an appointment box...
		If IsCalendarViewAppointmentEditBox () Then
			If IsSameScript() Then
				SayAppointmentData(TRUE)
				smmToggleTrainingMode(nMode)
				let gbSayWindowPromptAndText=FALSE
				Return
			EndIf
			SayBriefAppointmentData(GetCalendarView () != ciDayView)
			SayTutorialHelp (iType, TRUE)
			SayTutorialHelpHotKey (hFocus, TRUE)
			IndicateComputerBraille (hFocus)
			SpeakProgressBarInfo(TRUE)
			smmToggleTrainingMode(nMode)
			let gbSayWindowPromptAndText=FALSE
			Return
		EndIf
		; main calendar pane...
		CalendarCleanUp ()
		RetrieveRangeData(ProcessDayDateRange (gsDateToProcess), ciDayView)
		ReadDateTime (0)
		SayTutorialHelp (iType, TRUE)
		SayTutorialHelpHotKey (hFocus, TRUE)
		IndicateComputerBraille (hFocus)
		SpeakProgressBarInfo(TRUE)
		smmToggleTrainingMode(nMode)
		let gbSayWindowPromptAndText=FALSE
		Return
	ElIf sFocusWindowClass == wc_NetUIHWND	; Calendar pane is not focused, we are in navigation pane...
	|| sFocusWindowClass == WC_RichEdit20W then
		If iType == WT_RADIOBUTTON
		&& GetCalendarView () == ciMonthView then
			let oLabel = GetFocusObject (iLabel).accParent.accNavigate (NAVDIR_PREVIOUS, iLabel)
			Say (oLabel.accName (iLabel), OT_CONTROL_NAME)
			ComRelease (oLabel, true)
		EndIf
		If iType == WT_TREEVIEWITEM then
			Say (GetObjectName (TRUE), OT_CONTROL_NAME)
			IndicateControlState (WT_TREEVIEW, GetControlAttributes ())
		EndIf
		If iType == WT_LINK
		|| iType == WT_BUTTON
		|| iType == WT_RADIOBUTTON
		|| iType == WT_EDIT then
			SayLine ()
		ElIf iType == WT_ButtonMenu then
			IndicateControlType (iType, GetObjectName (TRUE))
		EndIf
		SayTutorialHelp (iType, TRUE)
		SayTutorialHelpHotKey (hFocus, TRUE)
		IndicateComputerBraille (hFocus)
		SpeakProgressBarInfo(TRUE)
		smmToggleTrainingMode(nMode)
		let gbSayWindowPromptAndText=FALSE
		Return
	EndIf	; end of checking the calendar pane is focused...
EndIf	; end of calendar check...
; CC field some times has wrong object name:
if ! DialogActive () && globalCurrentControl==cc_field then
	performscript SayLine()
	SayTutorialHelp (iType, TRUE)
	SayTutorialHelpHotKey (hFocus, TRUE)
	IndicateComputerBraille (hFocus)
	SpeakProgressBarInfo(TRUE)
	smmToggleTrainingMode(nMode)
	let gbSayWindowPromptAndText=FALSE
	return
endIf
; Announce message list together with the flags.
If iControlID == messages_listbox
&& iType == WT_LISTBOX then
	IndicateControlType (iType, GlobalRealName, cScSpace)
	if StringLeft (GetObjectName (TRUE), 7) == "Message"
	|| ! CheckForNoMoreItems (OT_POSITION) then
		say (GetSuperGridListItem (hFocus), OT_SELECTED_ITEM, TRUE)
		say (positionInGroup (), OT_POSITION)
	else
		say (getSelectedText (), OT_SELECTED_ITEM)
	endIf
	SayTutorialHelp (iType, TRUE)
	SayTutorialHelpHotKey (hFocus, TRUE)
	IndicateComputerBraille (hFocus)
	SpeakProgressBarInfo(TRUE)
	smmToggleTrainingMode(nMode)
	let gbSayWindowPromptAndText=FALSE
	return
EndIf
If GetWindowName (GlobalRealWindow) == WN_AutomaticFormatting
&& iControlID == ci_ListOfRules then
	MSAARefresh ()
EndIf
; To announce the task reminder time
If StringContains (GetWindowName (GlobalRealWindow), scTaskItem)
&& iControlID == ciReminderTimeEditBox then
	IndicateControlType (GetWindowTypeCode (hFocus), GetObjectName (TRUE), GetLine ())
	SayTutorialHelp (iType, TRUE)
	SayTutorialHelpHotKey (hFocus, TRUE)
	IndicateComputerBraille (hFocus)
	smmToggleTrainingMode(nMode)
	let gbSayWindowPromptAndText=FALSE
	Return
EndIf
if StringContains(globalRealWindowName,sc_OutlookContactDialog)
&& iType==wt_button then
	SayFocusedObject()
	SayTutorialHelp (iType, TRUE)
	SayTutorialHelpHotKey (hFocus, TRUE)
	IndicateComputerBraille (hFocus)
	smmToggleTrainingMode(nMode)
	let gbSayWindowPromptAndText=FALSE
	return
endIf
If iControlID == app_AllAttendeesList
&& iType == WT_LISTBOX then
	IndicateControlType (iType, GetWindowName (hFocus), GetObjectName (TRUE))
	SayTutorialHelp (iType, TRUE)
	SayTutorialHelpHotKey (hFocus, TRUE)
	IndicateComputerBraille (hFocus)
	smmToggleTrainingMode(nMode)
	let gbSayWindowPromptAndText = FALSE
	Return
EndIf
;Any code in HandleCustomWindows should make both
;SayFocusedWindow and insert tab speak consistently.
smmToggleTrainingMode(TRUE)
If HandleCustomWindows (hFocus) then
	if ! stringIsBlank (gsBrlAutocomplete) then
		say (gsBrlAutocomplete, OT_LINE)
		say (gsBrlAutoCompletePosition, OT_POSITION); position will say nothing for an empty string
	endIf
	SayLastTipFromEvent ()
	SayTutorialHelp (iType, TRUE)
	SayTutorialHelpHotKey (hFocus, TRUE)
	IndicateComputerBraille (hFocus)
	SpeakProgressBarInfo(TRUE)
	smmToggleTrainingMode(nMode)
	let gbSayWindowPromptAndText=FALSE
	Return
EndIf
PerformScript SayWindowPromptAndText()
smmToggleTrainingMode(nMode)
let gbSayWindowPromptAndText=FALSE
EndScript

handle Function GetHeaderWindow ()
var
	handle winHandle
let winHandle = GetFirstChild (GetAppMainWindow (GetFocus ()))
while (winHandle
&& (GetWindowClass (winHandle) != wc_AfxWnd))
	let winHandle = GetNextWindow (winHandle)
endwhile
if winHandle then
	let winHandle = GetFirstChild (winHandle)
	while (winHandle && (GetWindowClass (winHandle) != cwc_Dlg32770))
		let winHandle = GetNextWindow (winHandle)
	endwhile
EndIf
return winHandle
EndFunction

handle Function GetHeaderControl (int ctrlId)
var
	handle winHandle
let winHandle = GetFirstChild (GetHeaderWindow ())
while (winHandle && (GetControlId (winHandle) != ctrlId))
	let winHandle = GetNextWindow (winHandle)
endwhile
return winHandle
EndFunction

Void Function FocusControl (handle winHandle)
var
	int subTypeCode
SaveCursor ()
InvisibleCursor()
MoveToWindow (winHandle)
pause ()
RoutePcToInvisible()
let subTypeCode = GetWindowSubTypeCode (winHandle)
if ((subTypeCode == wt_combobox)
|| (subTypeCode == wt_checkbox)) then
	LeftMouseButton ()
EndIf
RestoreCursor ()
EndFunction

Void Function ReadPrompt (int controlId, int typeOfWindow)
if (typeOfWindow == message_window) then ; this is a message
	if (controlId == from_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (from_prompt), Read_Everything))
	elif (controlId == sent_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (sent_prompt), Read_Everything))
	elif (controlId == to_field) then
		if GetHeaderControl (to_prompt) then
			SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (to_prompt), Read_Everything))
		elif GetHeaderControl (to_button) then
			SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (to_button), Read_Everything))
		EndIf
	elif (controlId == cc_field) then
		if GetHeaderControl (cc_prompt) then
			SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (cc_prompt), Read_Everything))
		elif GetHeaderControl (cc_button) then
			SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (cc_button), Read_Everything))
		EndIf
	elif (controlId == Bcc_field) then
		if GetHeaderControl (Bcc_button) then
			SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (Bcc_button), Read_Everything))
		EndIf
	elif (controlId == subject_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (subject_prompt), Read_Everything))
	EndIf
elif (typeOfWindow == task_window) then ; this is a task
	if (controlId == TaskSubject_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (TaskSubject_prompt), Read_Everything))
	ElIf controlId == DueDate_field03 then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (DueDate_prompt), Read_Everything))
	elif ((controlId == StartDate_field)
	|| (controlId == StartDate_field03)) Then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (StartDate_prompt), Read_Everything))
	elif (controlId == status_combobox) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (status_prompt), Read_Everything))
	elif (controlId == priority_combobox) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (priority_prompt), Read_Everything))
	elif ((controlId == PercentComplete_field)
	|| (controlId == PercentComplete_field03)) then

		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (PercentComplete_prompt), Read_Everything))
	EndIf
elif (typeOfWindow == contact_window) then ; this is a contact
	if (controlId == FullName_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (FullName_button), Read_Everything))
	elif (controlId == JobTitle_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (JobTitle_Prompt), Read_Everything))
	elif (controlId == company_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (company_Prompt), Read_Everything))
	elif (controlId == FileAs_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (FileAs_Prompt), Read_Everything))
	elif (controlId == business_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (business_Prompt), Read_Everything))
	elif (controlId == home_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (home_Prompt), Read_Everything))
	elif (controlId == BusinessFax_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (BusinessFax_Prompt), Read_Everything))
	elif (controlId == mobile_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (mobile_Prompt), Read_Everything))
	elif (controlId == address_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (address_button), Read_Everything))
	elif (controlId == email_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (email_prompt), Read_Everything))
	elif (controlId == web_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (web_prompt), Read_Everything))
	EndIf

elif (typeOfWindow == report_window) then ; this is a delivery report
	if (controlId == report_from_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (from_prompt), Read_Everything))
	elif (controlId == report_sent_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (sent_prompt), Read_Everything))
	elif (controlId == report_to_field) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (to_prompt), Read_Everything))
	elif (controlId == report_subject_field) then
		; in reports, the control id for subject is the same as cc in other types of windows
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (cc_prompt), Read_Everything))
	EndIf
elif (typeOfWindow == Meeting_Window) then ; this is a Meeting notice
	if (controlId == MeetingFromField) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (MeetingFromLabel), Read_Everything))
	elif (controlId == MeetingSentField) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (MeetingSentLabel), Read_Everything))
	elif (controlId == MeetingRequestedField) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (MeetingRequestedLabel), Read_Everything))
	elif (controlId == MeetingSubjectField) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (MeetingSubjectLabel), Read_Everything))
	elif (controlId == MeetingWhenField) then
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (MeetingWhenLabel), Read_Everything))
	EndIf
EndIf
EndFunction

Void Function ControlNotFound (int controlId, int typeOfWindow)
if (typeOfWindow == message_window) then ; this is a message
	if (controlId == from_field) then
		SayFormattedMessage (ot_ERROR,msg3_L, msg3_S) ;"From field not found"
	elif (controlId == sent_field) then
		SayFormattedMessage (ot_ERROR, msg4_L, msg4_S) ;"Sent field not found"
	elif (controlId == to_field) then
		SayFormattedMessage (ot_error, msg5_L, msg5_S) ;"To field not found"
	elif (controlId == cc_field) then
		SayFormattedMessage (ot_error, msg6_L, msg6_S) ;"Cc field not found"
	EndIf
elif (typeOfWindow == task_window) then ; this is a task
	if (controlId == TaskSubject_field) then
		SayFormattedMessage (ot_ERROR, msg7_L, msg7_S) ;"Subject field not found"
	elif (controlId == DueDate_field) then
		SayFormattedMessage (ot_error, msg8_L, msg8_S) ;"Due Date field not found"
	elif (controlId == StartDate_field) then
		SayFormattedMessage (ot_error, msg9_L, msg9_S) ; "Start date field not found"
	elif (controlId == status_combobox) then
		SayFormattedMessage (ot_error, msg10_L, msg10_S) ;"Status combobox not found"
	elif (controlId == priority_combobox) then
		SayFormattedMessage (ot_error, msg11_L, msg11_S) ;"Priority combobox not found"
	elif (controlId == PercentComplete_field) then
		SayFormattedMessage (ot_error, msg12_L, msg12_S) ;"% complete field not found"
	EndIf
EndIf
EndFunction

Void Function ReadHeaderControl (int controlId, int typeOfWindow)
var
	handle winHandle
let winHandle = GetHeaderControl (controlId)
if winHandle then
	if IsSameScript () then
		FocusControl (winHandle)
		return
	EndIf
BeginFlashMessage()
	ReadPrompt (controlId, TypeOfWindow)
	if (GetWindowSubTypeCode (winHandle) == wt_checkbox) then
		SayWindowTypeAndText (winHandle)
	else
		Say(GetWindowText(winHandle, read_everything),OT_USER_REQUESTED_INFORMATION)
	EndIf
		SayFormattedMessage (ot_smart_help, msg13_L, msgSilent1 );" Press twice to edit "
else
	ControlNotFound (controlId, typeOfWindow)
EndIf
EndFlashMessage()
EndFunction

Void Function FocusTaskBodyWindow ()
FocusControl (GetHeaderControl (ParentTaskBody_field))
EndFunction

Void Function FocusContactBodyWindow ()
FocusControl (GetHeaderControl (ParentContactBody_field))
EndFunction

int Function TypeOfWindow ()
var
	string theTitle
let TheTitle = GetWindowName(GetAppMainWindow(GetCurrentWindow()))
if StringContains (theTitle, scMessage) then
	return Message_Window
elif StringContains (theTitle, scTasks) then
	return Task_Window
elif StringContains (theTitle, scContacts) then
	return Contact_Window
elif StringContains (theTitle, scReport) then
	return Report_Window
elif StringContains (theTitle, scMeetingDialog) then
	return Meeting_Window
elif StringContains (theTitle, wn_Calendar) then
	return Calendar_Window
EndIf
EndFunction

Script GoToBodyWindow ()
var
	int typeOfWindow
let typeOfWindow = TypeOfWindow ()
if (typeOfWindow == message_window)
|| (typeOfWindow == Meeting_Window)  Then
	FocusMessageBodyWindow ()
elif (typeOfWindow == task_window) then
	FocusTaskBodyWindow ()
elif (typeOfWindow == contact_window) then
	FocusContactBodyWindow ()
else
	SayFormattedMessage (ot_error, msg15_L, msg15_S) ;"You must open a message or a task to read its content"
EndIf
EndScript

Void Function AutoSayHeader (int nID)
var
	handle Hwnd
let Hwnd = FindDescendantWindow (GetTopLevelWindow (getFocus ()), nID)
if (Hwnd) then
	SayMessage (OT_SCREEN_MESSAGE,GetWindowText(Hwnd, read_everything))
EndIf
EndFunction

Script ReadHeader (int iHeaderID)
var
	int typeOfWindow,
	int iControlID1,
	int iControlID2
let typeOfWindow = TypeOfWindow ()
if StringContains (GetWindowName (GlobalAppWindow ), scResponse) then
	If iHeaderID==ciOne Then
		let iControlID1=idc_1
		let iControlID2=idc_2
	ElIf iHeaderID==ciTwo Then
		let iControlID1=idc_3
		let iControlID2=idc_4
	ElIf iHeaderID==ciThree Then
		let iControlID1=idc_5
		let iControlID2=idc_6
	ElIf iHeaderID==ciFour Then
		let iControlID1=idc_7
		let iControlID2=idc_8
	ElIf iHeaderID==ciFive Then
		let iControlID1=idc_9
		let iControlID2=idc_10
	ElIf iHeaderID==ciSix Then
		let iControlID1=idc_11
		let iControlID2=idc_12
	ElIf iHeaderID==ciSeven Then
		let iControlID1=idc_13
		let iControlID2=idc_14
	ElIf iHeaderID==ciEight Then
		let iControlID1=idc_15
		let iControlID2=idc_16
	ElIf iHeaderID==ciNine Then
		let iControlID1=idc_17
		let iControlID2=idc_18
	ElIf iHeaderID==ciTen Then
		let iControlID1=idc_19
		let iControlID2=idc_20
	EndIf
	AutoSayHeader (iControlID1)
	AutoSayHeader (iControlID2)
	return
EndIf
If iHeaderID==ciOne Then
	if (typeOfWindow == message_window) then
		ReadHeaderControl (from_field, typeOfWindow)
	elif (typeOfWindow == task_window) then
		ReadHeaderControl (TaskSubject_field, typeOfWindow)
	elif (typeOfWindow == contact_window) then
		ReadHeaderControl (FullName_field, typeOfWindow)
	elif (typeOfWindow == report_window) then
		ReadHeaderControl (report_from_field, typeOfWindow)
	elif (typeOfWindow == Meeting_Window) then
		ReadHeaderControl (MeetingFromField, typeOfWindow)
	Else
		SayFormattedMessage (ot_error, msg_HeaderInfoNotFound1_L, msg_HeaderInfoNotFound1_S)
		Return
	EndIf ; End of one.
ElIf iHeaderID==ciTwo Then
	if (typeOfWindow == message_window) then
		ReadHeaderControl (sent_field, typeOfWindow)
	elif (typeOfWindow == task_window) then
		ReadHeaderControl (DueDate_field03, typeOfWindow)
	elif (typeOfWindow == contact_window) then
		ReadHeaderControl (JobTitle_field, typeOfWindow)
	elif (typeOfWindow == report_window) then
		ReadHeaderControl (report_sent_field, typeOfWindow)
	elif (typeOfWindow == Meeting_Window) then
		ReadHeaderControl (MeetingSentField, typeOfWindow)
	Else
		SayFormattedMessage (ot_error, msg_HeaderInfoNotFound1_L, msg_HeaderInfoNotFound1_S)
		Return
	EndIf ; End of 2
ElIf iHeaderID==ciThree Then
	if (typeOfWindow == message_window) then
		ReadHeaderControl (to_field, typeOfWindow)
	elif (typeOfWindow == task_window) then
		ReadHeaderControl (StartDate_field03, typeOfWindow)
	elif (typeOfWindow == contact_window) then
		ReadHeaderControl (company_field, typeOfWindow)
	elif (typeOfWindow == report_window) then
		ReadHeaderControl (report_to_field, typeOfWindow)
	elif (typeOfWindow == Meeting_Window) then
		ReadHeaderControl (MeetingRequestedField, typeOfWindow)
	Else
		SayFormattedMessage (ot_error, msg_HeaderInfoNotFound1_L, msg_HeaderInfoNotFound1_S)
		Return
	EndIf ; End of 3
ElIf iHeaderID==ciFour Then
	if (typeOfWindow == message_window) then
		ReadHeaderControl (cc_field, typeOfWindow)
	elif (typeOfWindow == task_window) then
		ReadHeaderControl (status_combobox, typeOfWindow)
	elif (typeOfWindow == contact_window) then
		ReadHeaderControl (FileAs_field, typeOfWindow)
	elif (typeOfWindow == report_window) then
		ReadHeaderControl (report_subject_field, typeOfWindow)
	elif (typeOfWindow == Meeting_Window) then
		ReadHeaderControl (MeetingWhenField, typeOfWindow)
	Else
		SayFormattedMessage (ot_error, msg_HeaderInfoNotFound1_L, msg_HeaderInfoNotFound1_S)
		Return
	EndIf ; End of 4
ElIf iHeaderID==ciFive Then
	if (typeOfWindow == message_window) then
		ReadHeaderControl (subject_field, typeOfWindow)
	elif (typeOfWindow == task_window) then
		ReadHeaderControl (priority_combobox, typeOfWindow)
	elif (typeOfWindow == contact_window) then
		ReadHeaderControl (business_field, typeOfWindow)
	elif (typeOfWindow == Meeting_Window) then
		ReadHeaderControl (MeetingSubjectField, typeOfWindow)
	Else
		SayFormattedMessage (ot_error, msg_HeaderInfoNotFound1_L, msg_HeaderInfoNotFound1_S)
		Return
	EndIf ; end of 5
ElIf iHeaderID==ciSix Then
	if (typeOfWindow == message_window)
	&& FindDescendantWindow(GlobalRealWindow,Bcc_Field) Then
		ReadHeaderControl (Bcc_field, typeOfWindow)
	ElIf (typeOfWindow == task_window) then
		ReadHeaderControl (Percentcomplete_field03, typeOfWindow)
	elif (typeOfWindow == contact_window) then
		ReadHeaderControl (home_field, typeOfWindow)
	Else
		SayFormattedMessage (ot_error, msg_HeaderInfoNotFound1_L, msg_HeaderInfoNotFound1_S)
		Return
	EndIf ; End of 6
ElIf iHeaderID==ciSeven Then
	if (typeOfWindow == Task_window) then
		ReadHeaderControl (reminder_checkbox, typeOfWindow)
	elif (typeOfWindow == contact_window) then
		ReadHeaderControl (BusinessFax_field, typeOfWindow)
	Else
		SayFormattedMessage (ot_error, msg_HeaderInfoNotFound1_L, msg_HeaderInfoNotFound1_S)
		Return
	EndIf ;end of 7
ElIf iHeaderID==ciEight Then
	if (typeOfWindow == contact_window) then
		ReadHeaderControl (mobile_field, typeOfWindow)
	Else
		SayFormattedMessage (ot_error, msg_HeaderInfoNotFound1_L, msg_HeaderInfoNotFound1_S)
		Return
	EndIf ; End of 8
ElIf iHeaderID==ciNine Then
	if (typeOfWindow == contact_window) then
		ReadHeaderControl (address_field, typeOfWindow)
	Else
		SayFormattedMessage (ot_error, msg_HeaderInfoNotFound1_L, msg_HeaderInfoNotFound1_S)
		Return
	EndIf ;end of 9
ElIf iHeaderID==ciTen Then
	if (typeOfWindow == contact_window) then
		ReadHeaderControl (email_field, typeOfWindow)
	Else
		SayFormattedMessage (ot_error, msg_HeaderInfoNotFound1_L, msg_HeaderInfoNotFound1_S)
		Return
	EndIf ;End of 10
ElIf iHeaderID==ciEleven Then
	if (typeOfWindow == contact_window) then
		ReadHeaderControl (web_field, typeOfWindow)
	ElIf  (TypeOfWindow==Calendar_Window) Then
		TypeCurrentScriptKey ()
	Else
		SayFormattedMessage (ot_error, msg_HeaderInfoNotFound1_L, msg_HeaderInfoNotFound1_S)
		Return
	EndIf ; End of 11
EndIf ; End of iHeaderID check
EndScript

Void Function MoveToField (handle hwnd)
SaveCursor()
InvisibleCursor ()
MoveToWindow(hWnd)
RoutePcToInvisible ()
RestoreCursor ()
EndFunction

Void Function ClickToolBarButton (handle winHandle, string buttonLabel)
SaveCursor ()
 JAWSCursor ()
if FindString (winHandle, buttonLabel, s_top, s_restricted) then
	pause ()
	LeftMouseButton ()
	RestoreCursor()
else
	SayFormattedMessage (ot_error, FormatString("%1 %2",buttonLabel,msgLabelNotFound1_L))
EndIf
EndFunction

handle Function GetToolbar ()
var
	handle WinHandle
let WinHandle = FindDescendantWindow (GetAppMainWindow (GetFocus ()), tool_bar)
if (winHandle && GetWindowClass (winHandle) == wc_MsoCommandBar) then
	return winHandle
EndIf
return FALSE
EndFunction

Void Function ToolBar ()
var
	handle winHandle,
	int item
if InHJDialog () then
	SayFormattedMessage (OT_ERROR, msgToolBar1_L, msgToolBar1_S)
	return
EndIf
let winHandle = GetToolbar ()
let item = dlgSelectItemInList (strToolbar+strToolbar1_New+strToolbar2, ToolbarDialogName, true)
let nSuppressEcho = true
delay (2)
if (item == Back) then
	PerformScript MoveBackItem()
elif (item == Forward) then
	PerformScript MoveForwardItem()
Elif (Item == MailMessage) then
	TypeKey (ksNewMailMessage)
elif (Item == PrintDoc) then
	TypeKey (ksPrintDocument)
elIf (Item == MoveToFolder) then
	TypeKey (ksMoveToFolder)
elif (Item == DeleteItem) then
	TypeKey (ksDeleteItem)
Elif (Item == Reply) then
	TypeKey (ksReply)
Elif (Item == ReplyToAll) then
	TypeKey (ksReplyToAll)
elIf (Item == ForwardMessage) then
	TypeKey (ksForwardMessage)
elif (Item == AddressBook) then
	TypeKey (ksAddressBook)
elif (Item == Dial) then
	TypeKey (ksDialer)
elif (Item == AdvancedFind) then
	TypeKey (ksAdvancedFind)
elif (Item == MarkAsRead) then
	TypeKey (ksMarkAsRead)
elif (Item == ClearFormatting) then
	TypeKey (ksClearFormatting)
elif (Item == appointmentChoice) then
	TypeKey (ksAppointmentDialog)
Elif (Item == contact) then
	TypeKey (ksContactDialog)
elif (Item == NewFolder) then
	TypeKey (ksNewFolder)
Elif (Item == Journal) then
	TypeKey (ksJournalDialog)
elif (Item == Note) then
	TypeKey (ksNotesDialog)
elif (Item == MeetingRequest) then
	TypeKey (ksMeetingRequest)
elIf (Item == FindPeople) then
	TypeKey (ksFindPeople)
elif (Item == Task) then
	TypeKey (ksTaskDialog)
elif (Item == TaskRequest) then
	TypeKey (ksTaskRequest)
elif (Item == OfficeDocument) then
	TypeKey (ksNewOfficeDocument)
elif (Item == Flag) then
	TypeKey (ksFlag)
elif (Item == Post) then
	TypeKey (ksPost)
elif (Item == CopyItem) then
	TypeKey (ksCopyItem)
elif (Item == InBox) then
	Pause ()
	TypeKey (ksMoveToInbox)
elif (Item == GoToFolder) then
	TypeKey (ksGoToFolder)
endIf
let nSuppressEcho = false
EndFunction

Int Function IsToolbarList (handle hwnd)
if (GetWindowSubtypeCode (hwnd) == wt_listbox) then
	if (GetWindowClass (GetAppMainWindow (hwnd)) == cwcJAWS) then
		if (GetWindowName (GetRealWindow (hwnd)) == ToolbarDialogName) then
			return TRUE
		endIf
	EndIf
EndIf
return FALSE
EndFunction

Script CallToolBars ()
if ! getRunningFSProducts () & product_JAWS then
	return
endIf
ToolBar ()
EndScript

Script MessageBodyDelete ()
if ! IsVirtualPcCursor () then
	QuickNavStateChange(false) ; for managing Word as Editor in messages, when not using the virtual cursor to read them.
endIf
;let giLineHasSpoken=FALSE

; Message, Contacts, Appointments, Task, and Notes list.
If GlobalCurrentControl==ciGridView Then
	; if we pass Control+D to outlook 2013 and higher message list we get loosing of UIA information
	; and this causes the whole window to be read as if a SayAll is invoked.
	; to avoid this we directly pass the Delete key instead of Control+D.
	TypeKey (cKSDelete)
	return ; No need for older Outlook compensations in 2013, where delete refreshes properly.
EndIf ; End of grid view/major lists.

;This script exists just in case somebody wants a message spoken or something
SetDeletedGroupByFlag ()
StopSpeech()
TypeKey (ksDeleteItem)
let giLineHasSpoken=FALSE

;The following condition's purpose is to read the header information of the new message when
;deleting an open message
If TypeOfWindow () == message_window then
	ScheduleFunction (sf_SayMessageHeaderInformation, 4)
Else
	Return
EndIf
EndScript


; ***Line-by-line housekeeping done this far***

Void Function ForceMessageAnnouncement ()
var
	Handle hFocus,
	Int iObjectID,
	Int iChildID

If Not giLineHasSpoken then
	let hFocus = GetFocus (iObjectID, iChildID)
	;ActiveItemChangedEvent (hFocus, iObjectID, iChildID, hFocus, iObjectID, iChildID)
EndIf
EndFunction

script SayNextLine ()
var
	handle hWnd = GetFocus (),
	int iObjType =GetObjectSubtypeCode(),
	int iTypeCode,
	int iRestriction,
	string sWinName =GetWindowName(hWnd),
	string sObjName,
	String sWinClass =GetWindowClass(hWnd),
	int iControlID = GetControlID (hWnd)

If gbWordIsWindowOwner Then
	; suppress speech during atMentions suggestions, menu technically out of focus.
	If collectionItemsCount (atmentionsActiveSuggestion) 
	&& isPcCursor ()
	&& ! UserBufferIsActive () then
		nextLine ()
		return
	endIf
	PerformScript SayNextLine()
	Return
EndIf
let gbFocusHasChanged=FALSE
let gbUpDownNavigation=TRUE
If UserBufferIsActive ()
|| !IsPCCursor()
|| inHJDialog ()
|| MenusActive () then
	PerformScript SayNextLine()
	return
endIf
if OutlookUIAEventsWerHooked
&& GetFolderType () == 2	then ; contact list:
	return NextLine () ; The UIA Events will speak this properly.
endIf
If IsCalendarView()	; focus is in the calendar view...
	If iObjType == WT_LISTBOXITEM
		; New calendar handling...
		If (! inRibbons())
		&& (! IsCalendarViewAppointmentEditBox ())
		&& sWinClass != wc_OutlookGrid
			return NextLine ()
		endIf
	endIf	
endIf	
let giSayingTreeviewItem=false
let iTypeCode=GetWindowSubTypeCode(hWnd)
if !iTypeCode then
	let iTypeCode=iObjtype
EndIf
;make sure global is updated.  It was wrong from inside a note:
Let GlobalCurrentControl = iControlID
let sObjName=GetObjectName(TRUE)
If IsPCCursor () then
	if getWindowClass (hWnd) == cwc_SysTreeView32 then
		return NextLine ()
	endIf
	If StringContains(GlobalRealWindowName,scRecurrence)   Then
		If ((GlobalCurrentControl==ciRecurrencePattern8224 || GlobalCurrentControl==ciRecurrencePattern8254)
		|| (GlobalCurrentControl<=ciRecurringDuration && GlobalCurrentControl>=ciRecurringStartTime)) Then
			NextLine()
			Delay(1)
			PerformScript SayLine()
			Return
		EndIf
	EndIf ; End of Recurring dialog
	If sWinClass==wc_ReComboBox20W Then
		If StringContains(GlobalRealWindowName,wn_AdvancedFind) Then
			PerformScript SayNextLine()
			Return
		EndIf
		If GlobalCurrentControl==con_FileAsField Then
		NextLine()
			Return
		EndIf
	EndIf ; End combobox20w
	If (GlobalObjectName==scContactItem
	&& GlobalCurrentControl==Contact_List
	&& sWinName==wn_CardView) Then
		NextLine ()
		Return
	EndIf
	If StringContains(sWinClass,wc_OutlookGrid)
	&& (GlobalCurrentControl==app_AllAttendeesList
	|| GlobalCurrentControl==con_FieldList)
	&& GlobalObjectName!=wn_MembersList Then
		NextLine()
;		SayLine()
		; To announce the responce of the meeting request...
		if (iControlID == app_AllAttendeesList) return endIf
		if ! IsKeyWaiting () then delay (1,TRUE) endIf
		say (getObjectName (TRUE), OT_LINE)
		Return
	EndIf
	; Start time and end time fields in Appointment/Journal creation...
	If ((StringContains(sWinName,wn_Customize)
	|| StringContains(sWinName,scTime)
	|| StringContains(sWinName,scDuration)
	|| StringContains(sWinName,wn_ReminderWindow))
	&& (GlobalCurrentControl==app_RemindEdit
	|| GlobalCurrentControl==1
	|| GlobalCurrentControl==j_StartTime
	|| GlobalCurrentControl==j_Duration
	|| GlobalCurrentControl==app_StartTime
	|| GlobalCurrentControl==app_EndTime)) then
		NextLine()
		Delay(2)
		SayObjectActiveItem()
		Return
	EndIf
	; Message, Contacts, Appointments, Task, and Notes list.
	;AppendToScriptCallStackLogEx (formatString ("GlobalRealWindowName is %1", GlobalRealWindowName))
	;AppendToScriptCallStackLogEx (formatString ("globalCurrentControl is %1", intToString (GlobalCurrentControl)))
	If GlobalCurrentControl==ciGridView
	|| (GlobalCurrentControl==ic_AdvancedFindResultList
	;&& GlobalRealWindowName==wn_AdvancedFind)  Then
	&& stringRight (GlobalRealWindowName, stringLength (wn_AdvancedFind)) == wn_AdvancedFind) Then
		NextLine()
		let giLineHasSpoken = FALSE
		;ScheduleFunction (SF_ForceMessageAnnouncement, 1)
		;SayLine()
		Return
	EndIf ; End of GridView4704.
	if giOutlookAutoCompleteVerbosity
	&& iTypeCode!=wt_ReadOnlyEdit
	&& (GlobalCurrentControl==To_Field
	|| GlobalCurrentControl==CC_Field
	|| GlobalCurrentControl==Bcc_Field) Then
		NextLine()
		If iTypeCode==wt_multiline_edit
		&& !gbIsAddressAutoCompleteListVisible then
			SayLine()
		EndIf
		Return
	EndIf
	If sWinClass==wcReListBox Then
		; Customize view lists...
		If iTypeCode==	WT_EXTENDEDSELECT_LISTBOX Then
			NextLine()
			Return
			Endif ; End of Customize Views.
		If ( GlobalCurrentControl ==ciAccountsList
		|| GlobalCurrentControl ==ciCategoriesListBox) Then
			NextLine()
			Say(GetObjectState(TRUE),OT_SCREEN_MESSAGE)
			Say(PositionInGroup(), OT_POSITION)
			Return
		EndIf
	EndIf ; End of Relist box.
	; rules wizard
	If (GlobalRealWindowName == wn_RulesWizard
	|| GlobalRealWindowName == wn_RulesAndAlerts) Then
		If (iTypeCode == WT_LISTBOX
		|| iObjType==wt_ListBoxItem) Then
			NextLine ()
			Delay(1,TRUE)
			If GlobalCurrentControl   == RuleDescriptionListBox  Then
				Say(GetObjectName(TRUE) ,OT_SCREEN_MESSAGE)
			ElIf  GlobalCurrentControl==ciRulesList Then
				SayObjectActiveItem(FALSE)
;			ElIf GlobalCurrentControl==ciRulesConditionCheckList Then
			EndIf
			return
		EndIf ; End of Listbox and ID check
	EndIf ; End of Rules Wizard.
	;the address list and address book
	If StringContains(sWinClass,scOUTEXVLB) then
		if GlobalRealWindowName==wn_CheckNames
		|| GlobalRealWindowName==wn_NewEntry Then
			NextLine()
			Return

		elif GlobalRealWindowName == wn_AddressBook then
			;note that the above comparison makes deliberate use of the == operator stopping at the shortest string,
			;since the actual window name may include the name of the address book.
			NextLine()
			Return
		EndIf
	EndIf
EndIf ; the pc cursor
If !IsPcCursor ()
|| IsVirtualPcCursor ()
|| GlobalMenuMode then
	If (sWinClass == cwc_RichEdit20W
	|| sWinClass == cwc_RichEdit20A)
	&& iTypeCode!=wt_Edit_Spinbox then
		NextLine ()
		Say(GetObjectValue(TRUE),OT_SCREEN_MESSAGE)
		return
	EndIf
	PerformScript SayNextLine ()
	return
EndIf
If DialogActive () Then
	If GlobalCurrentControl == ChangeTo_field then
		If IsPcCursor () then
			NextLine ()
			SayLine ()
		EndIf
		Pause ()
	EndIf
EndIf
If (StringContains (GlobalRealWindowName, scCalendar)
|| StringContains (GlobalRealWindowName, scTaskList1)
|| StringContains (GlobalRealWindowName, scContactsList1))
&& GlobalCurrentControl == cal_list then
	NextLine ()
	SayLine ()
	return
EndIF
If (iTypeCode == WT_EDIT) then
	If (GlobalCurrentControl == iDSpinBox) then
		NextLine ()
		return
	EndIf
EndIf
; for announcing the full names in the select names dialogue...
let sWinName = GetWindowName (GlobalRealWindow)
If (StringContains (sWinName, WN_SelectNames)
|| StringContains (sWinName, wn_AddressBook))
&& iControlID == ciAddressList then
	NextLine ()
	;Adjust for timing, as Braille is right but speech can lag:
	Delay (1, TRUE)
	Say (GetObjectName (TRUE), OT_LINE)
	Return
EndIf
; Address book options...
If StringContains (sWinName, WN_Addressing)
&& (iControlID == ID_PersonalAddresses
|| iControlID == ID_CheckNames)
&& iObjType == WT_COMBOBOX then
	NextLine ()
	Say (GetWindowText (hWnd, FALSE), OT_LINE)
	Return
EndIf
If (! (IsCalendarView ()
|| DialogActive ())) then
	if sWinClass==wc_edit
	|| (!IsWinVista()
	&& StringCompare(sWinClass,cwc_richEdit20w)==0) then ;ensures other richedit classes do not test true here.
		nextLine()
		If Not StringContains (GlobalRealWindowName, SCAppointment) then	; let ValueChangedEvent to do its job.
		delay(1) ; needed due to timing in XP so that Braille is in sync with speech.
		SayMessage(ot_highlighted_screen_text,GetObjectValue())
		EndIf
		return
	endIf
EndIf
If IsWindowADistributionList (hWnd) then
	NextLine ()
	SendMessage (hWnd, WM_SETFOCUS)
	SayObjectActiveItem ()
	Return
EndIf
;for Notes multiline edit window:
If sWinClass==cwc_RichEdit20WPT
&& iObjType==wt_multiLine_edit then
	NextLine()
	SayLine()
	return
endIf
;ValueChangedEvent does not fire and SayHighlightedText fires multiple times in SDM edit combos:
if getWindowCategory () == WCAT_SDM
&& iObjType==wt_edit then
	nextLine()
	delay(1)
	Say(GetObjectValue(true),ot_highlighted_screen_text)
	return
endIf
PerformScript SayNextLine ()
If IsInOutlookMainWindow (hWnd)
&& iControlID == 1
&& sWinClass == cWC_RichEdit60W
&& ghQuickSearchAutoComplete
	Say (GetWindowText (ghQuickSearchAutoComplete, TRUE), OT_SELECTED_ITEM)
				giHasAddressAutoComplete = TRUE
				gsBrlAutoComplete = GetWindowText (ghQuickSearchAutoComplete, TRUE)
	Return
EndIf
EndScript

Script SayPriorLine ()
var
	handle hWnd = GetFocus (),
	int iObjType =GetObjectSubtypeCode(),
	int iTypeCode,
	int iRestriction,
	string SWinName =GetWindowName(hWnd),
	string sObjName,
	string sWinClass = GetWindowClass (hWnd),
	int iControlID = GetControlID (hWnd)

If gbWordIsWindowOwner Then
	; suppress speech during atMentions suggestions, menu technically out of focus.
	If collectionItemsCount (atmentionsActiveSuggestion) 
	&& isPcCursor ()
	&& ! UserBufferIsActive () then
		PriorLine ()
		return
	endIf
	PerformScript SayPriorLine()
	Return
EndIf
let gbFocusHasChanged=FALSE
let gbUpDownNavigation=TRUE
If UserBufferIsActive ()
|| !IsPCCursor()
|| inHjDialog ()
|| MenusActive () then
	PerformScript SayPriorLine ()
	return
EndIf
if OutlookUIAEventsWerHooked
&& GetFolderType () == 2	then ; contact list:
	return PriorLine () ; The UIA Events will speak this properly.
endIf
If IsCalendarView()	; focus is in the calendar view...
	If iObjType == WT_LISTBOXITEM
		; New calendar handling...
		If (! inRibbons())
		&& (! IsCalendarViewAppointmentEditBox ())
		&& sWinClass != wc_OutlookGrid
			return PriorLine ()
		endIf
	endIf	
endIf	
let giSayingTreeviewItem=false
let iTypeCode = GetWindowSubTypeCode (hWnd)
If !iTypeCode then
	let iTypeCode=iObjtype
EndIf
;make sure global is updated.  It was wrong from inside a note:
Let GlobalCurrentControl = iControlID
let sObjName=GetObjectName(TRUE)
If IsPcCursor() Then
	if getWindowClass (hWnd) == cwc_SysTreeView32 then
		return PriorLine ()
	endIf
	If StringContains(GlobalRealWindowName,scRecurrence)   Then
		If ((GlobalCurrentControl==ciRecurrencePattern8224 || GlobalCurrentControl==ciRecurrencePattern8254)
		|| (GlobalCurrentControl<=ciRecurringDuration && GlobalCurrentControl>=ciRecurringStartTime)) Then
			PriorLine()
			Delay(1)
			PerformScript SayLine()
			Return
		EndIf
	EndIf ; End of Recurring dialog
	If sWinClass==wc_ReComboBox20W Then
		If StringContains(GlobalRealWindowName,wn_AdvancedFind) Then
			PerformScript SayPriorLine()
			Return
		EndIf
		If GlobalCurrentControl==con_FileAsField Then
			PriorLine()
			Return
		EndIf
	EndIf ; End combobox20w
	If (GlobalObjectName==scContactItem
	&& GlobalCurrentControl==Contact_List
	&& sWinName==wn_CardView) Then
		PriorLine ()
		Return
	EndIf
	If StringContains(sWinClass,wc_OutlookGrid)
	&& (GlobalCurrentControl==app_AllAttendeesList
	|| GlobalCurrentControl==con_FieldList)
	&& GlobalObjectName!=wn_MembersList Then
		PriorLine()
		if (iControlID == app_AllAttendeesList) return endIf
;		SayLine()
		; To announce the responce results...
		if ! IsKeyWaiting () then delay (1, TRUE) endIf
		say (getObjectName (TRUE), OT_LINE)
		Return
	EndIf
	; Start time and end time fields in Appointment/Journal creation...
	If ((StringContains(sWinName,wn_Customize)
	|| StringContains(sWinName,scTime)
	|| StringContains(sWinName,scDuration)
	|| StringContains(sWinName,wn_ReminderWindow))
	&& (GlobalCurrentControl==app_RemindEdit
	||GlobalCurrentControl==1
	|| GlobalCurrentControl==j_StartTime
	|| GlobalCurrentControl==j_Duration
	|| GlobalCurrentControl==app_StartTime
	|| GlobalCurrentControl==app_EndTime)) Then
		PriorLine()
		Delay(2)
		SayObjectActiveItem()
		Return
	EndIf
	; Message, Contacts, Appointments, Task, and Notes list.
	If GlobalCurrentControl==ciGridView
	|| (GlobalCurrentControl==ic_AdvancedFindResultList
	;&& GlobalRealWindowName==wn_AdvancedFind) Then
	&& stringRight (GlobalRealWindowName, stringLength (wn_AdvancedFind)) == wn_AdvancedFind) Then
		PriorLine()
		let giLineHasSpoken = FALSE
		;ScheduleFunction (SF_ForceMessageAnnouncement, 1)
		;SayLine()
		Return
	EndIf ; End of GridView4704.
	if giOutlookAutoCompleteVerbosity
	&& iTypeCode!=wt_ReadOnlyEdit
	&& (GlobalCurrentControl==To_Field
	|| GlobalCurrentControl==CC_Field
	|| GlobalCurrentControl==Bcc_Field) Then
		PriorLine()
		If iTypeCode==wt_multiline_edit
		&& !gbIsAddressAutoCompleteListVisible then
			SayLine()
		EndIf
		Return
	EndIf
	If sWinClass==wcReListBox Then
		; Customize view lists...
		If iTypeCode==	WT_EXTENDEDSELECT_LISTBOX Then
			PriorLine()
			Return
		Endif ; End of Customize Views.
		If ( GlobalCurrentControl ==ciAccountsList
		|| GlobalCurrentControl ==ciCategoriesListBox) Then
			PriorLine()
			Say(GetObjectState(TRUE),OT_SCREEN_MESSAGE)
			Say(PositionInGroup(), OT_POSITION)
			Return
		EndIf
	EndIf ; End of ReListBox class
	; rules wizard
	If (GlobalRealWindowName == wn_RulesWizard
	|| GlobalRealWindowName == wn_RulesAndAlerts) Then
		If (iTypeCode == WT_LISTBOX
		|| iObjType==wt_ListBoxItem) Then
			PriorLine ()
			Delay(1,TRUE)
			If GlobalCurrentControl   == RuleDescriptionListBox  Then
				Say(GetObjectName(TRUE) ,OT_SCREEN_MESSAGE)
			ElIf  GlobalCurrentControl==ciRulesList Then
				SayObjectActiveItem(FALSE)
			EndIf
			return
		EndIf ; End of Listbox and ID check
	EndIf ; End of Rules Wizard.
	If StringContains(sWinClass,scOUTEXVLB) then
		if GlobalRealWindowName==wn_CheckNames
		|| GlobalRealWindowName==wn_NewEntry Then
			PriorLine()
			Return
		elif GlobalRealWindowName == wn_AddressBook then
			;note that the above comparison makes deliberate use of the == operator stopping at the shortest string,
			;since the actual window name may include the name of the address book.
			PriorLine()
			Return
		EndIf
	EndIf
EndIf ; End of Pc cursor
If !IsPcCursor ()
|| IsVirtualPcCursor ()
|| GlobalMenuMode then
	If (sWinClass == cwc_RichEdit20W
	|| sWinClass == cwc_Richedit20a)
	&& iTypeCode!=wt_Edit_Spinbox then
		PriorLine ()
		Say(GetObjectValue(TRUE),OT_SCREEN_MESSAGE)
		return
	EndIf
	PerformScript SayPriorLine ()
	return
EndIf
If  DialogActive () then
	If GlobalCurrentControl == ChangeTo_field then
		If IsPcCursor () then
			PriorLine ()
			SayLine ()
		EndIf
		Pause ()
	EndIf
EndIf
If (StringContains (GlobalRealWindowName, scCalendar)
|| StringContains (GlobalRealWindowName, scTaskList1)
|| StringContains (GlobalRealWindowName, scContactsList1))
&& GlobalCurrentControl == cal_list then
	PriorLine ()
	SayLine ()
	return
EndIF
If iTypeCode == WT_EDIT then
	If GlobalCurrentControl == iDSpinBox then
		PriorLine ()
		return
	EndIf
EndIf
; for announcing the full names in the select names dialogue...
let sWinName = GetWindowName (GlobalRealWindow)
If (StringContains (sWinName, WN_SelectNames)
|| StringContains (sWinName, wn_AddressBook))
&& iControlID == ciAddressList then
	PriorLine ()
	;Adjust for timing, as Braille is right but speech can lag:
	Delay (1, TRUE)
	Say (GetObjectName (TRUE), OT_LINE)
	Return
EndIf
; Address book options...
If StringContains (sWinName, WN_Addressing)
&& (iControlID == ID_PersonalAddresses
|| iControlID == ID_CheckNames)
&& iObjType == WT_COMBOBOX then
	PriorLine ()
	Say (GetWindowText (hWnd, FALSE), OT_LINE)
	Return
EndIf
If (! (IsCalendarView ()
|| DialogActive ())) then
	if sWinClass==wc_edit
	|| (!IsWinVista()
	&& StringCompare(sWinClass,cwc_richEdit20w)==0) then ;ensures other richedit classes do not test true here.
		PriorLine()
		If Not StringContains (GlobalRealWindowName, SCAppointment) then	; let ValueChangedEvent to do its job.
		delay(1) ; needed due to timing in XP so that Braille is in sync with speech.
		SayMessage(ot_highlighted_screen_text,GetObjectValue())
		EndIf
		return
	endIf
EndIf
If IsWindowADistributionList (hWnd) then
	PriorLine ()
	SendMessage (hWnd, WM_SETFOCUS)
	SayObjectActiveItem ()
	Return
EndIf
;for Notes multiline edit window:
If sWinClass==cwc_RichEdit20WPT
&& iObjType==wt_multiLine_edit then
	PriorLine()
	SayLine()
	return
endIf
;ValueChangedEvent does not fire and SayHighlightedText fires multiple times in SDM edit combos:
if getWindowCategory () == WCAT_SDM
&& iObjType==wt_edit then
	priorLine()
	delay(1)
	Say(GetObjectValue(true),ot_highlighted_screen_text)
	return
endIf
PerformScript SayPriorLine ()
If IsInOutlookMainWindow (hWnd)
&& iControlID == 1
&& sWinClass == cWC_RichEdit60W
&& ghQuickSearchAutoComplete
	Say (GetWindowText (ghQuickSearchAutoComplete, TRUE), OT_SELECTED_ITEM)
				giHasAddressAutoComplete = TRUE
				gsBrlAutoComplete = GetWindowText (ghQuickSearchAutoComplete, TRUE)
	Return
EndIf
EndScript

int function ShouldFocusReadCharByField (string name)
	return (name == on_ToFieldEditing
	|| name == on_CcFieldEditing
	|| name == on_BccFieldEditing)
endFunction

Script SayNextCharacter ()
var
	int iCapsSetting,
	int iTypeCode,
	String sCategory,
	string sWinClass,
	string sWinName

if InHJDialog() then
	PerformScript SayNextCharacter()
	return
EndIf
if gbInRibbons && isPcCursor () && ! userBufferIsActive () then
	Return nextCharacter ();avoid extraneous letter speaking when moving on lower ribbon especially.
endIf
If gbWordIsWindowOwner Then
	PerformScript SayNextCharacter()
	Return
EndIf
let gbFocusHasChanged=FALSE
let gbLeftRightNavigation=TRUE
;let giSayingTreeviewItem=false
let iTypeCode=GetWindowSubTypeCode(GetFocus ())
if !iTypeCode then
	let iTypeCode=GetObjectSubtypeCode()
EndIf
let sWinClass=GetWindowClass(GlobalFocusWindow)
let sWinName=GetWindowName(GlobalFocusWindow)
;make sure global is updated.  It was wrong from inside a note:
Let GlobalCurrentControl = getControlID (globalFocusWindow)
If !IsPcCursor ()
|| IsVirtualPcCursor ()
|| GlobalMenuMode
|| iTypeCode==wt_TabControl Then
	PerformScript SayNextCharacter ()
	return
EndIf
If IsPCCursor () Then
	; Contact card view...
	If (GlobalObjectName==scContactItem
	&& GlobalCurrentControl==Contact_List
	&& sWinName==wn_CardView) Then
		NextCharacter()
		Return
	EndIf

	; Message lists...
	If !IsCalendarView ()
	&& (GlobalCurrentControl==ciGridView
	|| (GlobalCurrentControl==ic_AdvancedFindResultList
	&& GlobalRealWindowName==wn_AdvancedFind)) Then
		NextCharacter()
		Return
	EndIf ; End of Grid views.

	; See if the edit box in an appointment box is present...
	If IsCalendarViewAppointmentEditBox () Then
		PerformScript SayNextCharacter()
		Return
	EndIf
	; Disables caps indication for attachment, To, CC, and Bcc  field...
	If (GlobalCurrentControl==From_Field
	|| GlobalCurrentControl==To_Field
	|| GlobalCurrentControl==CC_Field
	|| GlobalCurrentControl==Bcc_Field
	; or new headers for control+shift+b window and appointments:
	|| ShouldFocusReadCharByField (sWinName)) Then
	let iCapsSetting=GetJcfOption(OPT_INDICATE_CAPS)
	If iTypeCode!=wt_ReadOnlyEdit Then
		NextCharacter()
		;test for graphical Email address in header fields:
		if StringLength(GetCharacter())>= 2 && ! stringIsBlank (getCharacter ()) then
			SayField()
		else
			SayCharacter()
		endIf
	Else
		SetJcfOption(OPT_INDICATE_CAPS,FALSE)
		PerformScript SayNextCharacter ()
		SetJcfOption(OPT_INDICATE_CAPS,iCapsSetting)
	EndIf
	Return
	EndIf
	; to announce the category field.
	If iTypeCode == WT_READONLYEDIT
		&& GlobalCurrentControl == ID_CategoryField then
		let GlobalIPosition = GlobalIPosition + 1
		let sCategory = GetLine ()
		If GlobalIPosition > StringLength (sCategory) then
			NextCharacter ()
			let GlobalIPosition = StringLength (sCategory)
		EndIf
		Say (SubString (sCategory, GlobalIPosition, 1), OT_SCREEN_MESSAGE)
		Return
	EndIf
	; to announce the open/close state of the folder on opening or closing it in navigation pane treeview...
	; These are not standard treeviews in Outlook 2013 and we have to use all methods to get the information...
	If GetWindowClass (GetFocus ()) == wc_NetUiHwnd
	&& GetObjectSubTypeCode () == WT_TREEVIEWITEM then
		NextCharacter ()
		Return
	EndIf
EndIf ; End of Pc cursor

PerformScript SayNextCharacter ()
EndScript

Script SayPriorCharacter ()
var
	int iCapsSetting,
	int iTypeCode,
	String sCategory,
	string sWinClass,
	string sWinName

if InHJDialog() then
	PerformScript SayPriorCharacter()
	return
EndIf
if gbInRibbons && isPcCursor () && ! userBufferIsActive () then
	Return PriorCharacter ();avoid extraneous letter speaking when moving on lower ribbon especially.
endIf
If gbWordIsWindowOwner Then
	PerformScript SayPriorCharacter()
	Return
EndIf
let gbFocusHasChanged=FALSE
let gbLeftRightNavigation=TRUE
;let giSayingTreeviewItem=false
	let iTypeCode=GetWindowSubTypeCode(GlobalFocusWindow)
if !iTypeCode then
	let iTypeCode=GetObjectSubtypeCode()
EndIf
let sWinClass=GetWindowClass(GlobalFocusWindow)
let sWinName=GetWindowName(GlobalFocusWindow)
;make sure global is updated.  It was wrong from inside a note:
Let GlobalCurrentControl = getControlID (globalFocusWindow)
if !IsPcCursor ()
|| IsVirtualPcCursor ()
|| GlobalMenuMode
|| iTypeCode==wt_TabControl Then
	PerformScript SayPriorCharacter ()
	return
EndIf

If IsPCCursor () then
	; Contact card view...
	If (GlobalObjectName==scContactItem
	&& GlobalCurrentControl ==Contact_List
	&& sWinName==wn_CardView) Then
		PriorCharacter()
		Return
	EndIf

	; Message lists...

	If !IsCalendarView ()
	&& (GlobalCurrentControl==ciGridView
	|| (GlobalCurrentControl==ic_AdvancedFindResultList
	&& GlobalRealWindowName==wn_AdvancedFind)) Then
		PriorCharacter()
		Return
	EndIf ; End of Grid views.
	 ;See if we are in an appointment box...
	If IsCalendarViewAppointmentEditBox ()  Then
		PerformScript SayPriorCharacter()
		Return
	EndIf

	If sWinClass==wc_NetUiHwnd Then
		let giAnnounceTreeViewItemState=TRUE
	EndIf

	; Disables caps indication for attachment, To, CC, and Bcc  field...
	If (GlobalCurrentControl==From_Field
	|| GlobalCurrentControl==To_Field
	|| GlobalCurrentControl==CC_Field
	|| GlobalCurrentControl==Bcc_Field
	; or new headers for control+shift+b window and appointments:
	|| ShouldFocusReadCharByField (sWinName)) Then
		let iCapsSetting=GetJcfOption(OPT_INDICATE_CAPS)
		If iTypeCode!=wt_ReadOnlyEdit Then
			PriorCharacter()
			;test for graphical Email address in header fields:
			if StringLength(GetCharacter())>= 2 && ! stringIsBlank (getCharacter ()) then
				SayField()
			else
				SayCharacter()
			endIf
		Else
			SetJcfOption(OPT_INDICATE_CAPS,FALSE)
			PerformScript SayPriorCharacter ()
			SetJcfOption(OPT_INDICATE_CAPS,iCapsSetting)
		EndIf
		Return
	EndIf
	; to announce the category field.
	If iTypeCode == WT_READONLYEDIT
		&& GlobalCurrentControl == 4261 then
		let GlobalIPosition = GlobalIPosition - 1
		let sCategory = GetLine ()
		If GlobalIPosition < 1 then
			PriorCharacter ()
			SayCharacter ()
			let GlobalIPosition = 1
			Return
		EndIf
		Say (SubString (sCategory, GlobalIPosition, 1), OT_SCREEN_MESSAGE)
		Return
	EndIf
	; to announce the open/close state of the folder on opening or closing it in navigation pane treeview...
	; These are not standard treeviews in Outlook 2013 and we have to use all methods to get the information...
	If GetWindowClass (GetFocus ()) == wc_NetUiHwnd
	&& GetObjectSubTypeCode () == WT_TREEVIEWITEM then
		PriorCharacter ()
		Return
	EndIf
EndIf ; End of Pc cursor
PerformScript SayPriorCharacter ()
EndScript

void function SpeakHomeEndMovement()
var
	Int iWindowType,
	Handle hFocus

If (! gbWordIsWindowOwner)
&& IsPCCursor() then
	let hFocus = GetFocus ()
	let iWindowType = GetWindowSubtypeCode (hFocus)
	If iWindowType == wt_EditCombo Then
		SayObjectActiveItem()
		Return
	EndIf
EndIf
If IsWindowADistributionList (hFocus) then
	SendMessage (hFocus, WM_SETFOCUS)
	SayObjectActiveItem ()
	Return
EndIf
SpeakHomeEndMovement()
EndFunction

Script JAWSDelete ()
If UserBufferIsActive()
|| gbWordIsWindowOwner Then
	PerformScript JAWSDelete()
	Return
EndIf
SetDeletedGroupByFlag  ()
let gsBrlAutoComplete=cscNull
; Message, Contacts, Appontments, Task, and Notes list.
If GlobalCurrentControl==ciGridView Then
	TypeKey (cksDelete)
	Delay (1, TRUE)
	MSAARefresh ()
	delay (2) ; accounts for timing when certain events take place, preventing incorrect announcement of 0 items.
	if CheckForNoMoreItems (OT_POSITION) then return TRUE endIf
	Return ; No longer use the compensation code necessary in earlier versions of Outlook.
EndIf ; End of GridView4704.
; extra speech when deleting or backspacing characters:
nSuppressEcho = OutlookVersion >= 16 && getWindowClass (getFocus ()) == wc_ReComboBox20W
PerformScript JAWSDelete ()
EndScript

script JAWSBackspace ()
; extra speech when deleting or backspacing characters:
nSuppressEcho = OutlookVersion >= 16 && getWindowClass (getFocus ()) == wc_ReComboBox20W
performScript JAWSBackSpace ()
endScript

script Delete ()
performScript JAWSDelete ()
endScript

Script NewContactDialog ()
TypeCurrentScriptKey ()
EndScript

Void Function ScreenSensitiveHelpForKnownClasses (int nSubTypecode)
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if (nSubTypecode == wt_Supergrid) then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpForKnownClasses1_L, msgScreenSensitiveHelpForKnownClasses1_S)
	AddHotKeyLinks ()
	return
endIf

ScreenSensitiveHelpForKnownClasses (nSubTypeCode)
EndFunction

Script WindowKeysHelp ()
var
	string SWinName
if ! getRunningFSProducts () & product_JAWS then
	return
endIf
let SWinName = GetWindowName (GetRealWindow (GetFocus ()))
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if SWinName == scSpellingDialogName then
	SayFormattedMessage (OT_USER_BUFFER, msgWindowKeysHelp1_L, msgWindowKeysHelp1_S)
	AddHotkeyLinks()
	return
EndIf
SayFormattedMessage (OT_USER_BUFFER, msgWindowKeysHelp2_L, msgWindowKeysHelp2_S)
AddHotkeyLinks()
EndScript

Script ReadFromAndSubject()
if (TypeOfWindow() == TRUE) then
	if GetObjectSubTypeCode () != WT_EDIT then
		AutoSayHeader(from_prompt)
		AutoSayHeader(from_field)
		AutoSayHeader(subject_prompt)
		AutoSayHeader(subject_field)
		return
	EndIf
else
	SayFormattedMessage(OT_ERROR, msgSayHeader_L, msgSayHeader_S)
EndIf
EndScript

Script SayNextParagraph ()
Var
	Handle hFocus = GetFocus (),
	String sClass = GetWindowClass (hFocus),
	Int iMenuMode = GlobalMenuMode,
	Int iType = GetObjectSubTypeCode (),
	Int iControlID = GetControlID (hFocus)

If gbWordIsWindowOwner
	PerformScript SayNextParagraph ()
	Return
EndIf
If Not iType
	iType = GetWindowSubTypeCode (hFocus)
EndIf
If IsPCCursor ()
|| IsVirtualPCCursor ()
	If DialogActive ()
	|| (iType == WT_TREEVIEW
	|| iType == WT_TREEVIEWITEM
	|| iType == WT_TABLECELL
	|| iType == WT_LISTVIEW
	|| iType == WT_EDITCOMBO
	|| iType == WT_LISTBOX
	|| iType == WT_COMBOBOX
	|| iType == WT_MULTISELECT_LISTBOX
	|| iType == WT_EXTENDEDSELECT_LISTBOX)
	|| GetWindowClass (GetCurrentWindow ()) == WC_Rctrl_RenWnd32
	|| sClass == cwcMsoCmd
		TypeKey (cKSControlDownArrow)	; move without removing selection
		If iControlID == ciGridView	; message list...
			; The accessibility here is faulty and we very often get the wrong item.
			Return
		EndIf
		; DirectUIHwnd lists in dialogs like Insert File Attachments:
		if sClass == cwc_DirectUIhWND then return endIf
		If sClass != cscListViewClass
			pause ()
			If ! (GetCharacterAttributes () & ATTRIB_HIGHLIGHT)
				SayFormattedMessage (OT_SELECT, cmsgDeSelected)
			EndIf
			SayLine ()
		EndIf
		Return
	EndIf
	If iType == WT_TABCONTROL
		TypeKey (cKSControlDownArrow)
		SayWord ()
		Return
	EndIf
	If iMenuMode > 0
		TypeKey (cKSControlDownArrow)
		Return
	EndIf
EndIf
PerformScript SayNextParagraph ()
EndScript

Script SayPriorParagraph ()
Var
	Handle hFocus = GetFocus (),
	String sClass = GetWindowClass (hFocus),
	Int iType = GetObjectSubTypeCode (),
	Int iMenuMode = GlobalMenuMode,
	Int iControlID = GetControlID (hFocus)

If gbWordIsWindowOwner Then
	PerformScript SayPriorParagraph()
	Return
EndIf
If Not iType
	iType = GetWindowSubTypeCode (hFocus)
EndIf
If IsPCCursor ()
|| IsVirtualPCCursor ()
	If DialogActive ()
	|| (iType == WT_TREEVIEW
	|| iType == WT_TREEVIEWITEM
	|| iType == WT_TABLECELL
	|| iType == WT_LISTVIEW
	|| iType == WT_EDITCOMBO
	|| iType == WT_LISTBOX
	|| iType == WT_COMBOBOX
	|| iType == WT_MULTISELECT_LISTBOX
	|| iType == WT_EXTENDEDSELECT_LISTBOX)
	|| GetWindowClass (GetCurrentWindow ()) == WC_Rctrl_RenWnd32
	|| sClass == cWCMsoCmd
		TypeKey (cKSControlUpArrow) ; move without removing selection
		If iControlID == ciGridView	; message list...
			; The accessibility here is faulty and we very often get the wrong item.
			Return
		EndIf
		; DirectUIHwnd lists in dialogs like Insert File Attachments:
		if sClass == cwc_DirectUIhWND then return endIf
		If sClass != cscListViewClass
			pause ()
			If ! (GetCharacterAttributes () & ATTRIB_HIGHLIGHT)
				SayFormattedMessage (OT_SELECT, cmsgDeSelected)
			EndIf
			SayLine ()
		EndIf
		Return
	EndIf
	If iType == WT_TABCONTROL
		TypeKey (cKSControlUpArrow)
		SayWord ()
		Return
	EndIf
	If iMenuMode > 0
		TypeKey (cKSControlUpArrow)
		Return
	EndIf
EndIf
PerformScript SayPriorParagraph ()
EndScript

Script SayAppVersion ()
;performScript default::sayAppVersion() doesn't work.
; This calls the correct script.
; the dollar sign ($) indicates script, not function.
scheduleFunction("OfficeClassic::$sayAppVersion", 0)
EndScript

Script UpALevel()
var
	handle hwnd,
	int iSubTypeCode,
	int iControl,
	string sMsg
GiIgnoreVirtualCursorSynchronized 	= OFF
;test for extended selection mode deactivation and user buffer from within message body.
if gbWordIsWindowOwner then
	if UserBufferIsActive()  then ; let Word handle it.
		performScript UpALevel()
		return
	endIf
	if GetWindowClass(GetFocus())==wc_WordMainDocumentWindow then
		sayCurrentScriptKeyLabel()
		; We can't check selection mode after sending the
		; escape key through because by then Word may have
		; already been unloaded and we'd get an error.
		; Instead, we check it before sending the escape, and if it is on, say it
		; is off because it will be off after the escape has been processed.
		if isSelectionModeActive()
		&& IsExtendedSelectionModeWatchActive() then
			SayFormattedMessageWithVoice(vctx_message,ot_status,msgSelectionModeOff1_L,cmsgSilent)
			StopExtendedSelectionModeWatch()
		endIf
		EscapeKey()
		return
	endIf
endIf

let hwnd = GetCurrentWindow ()
let iSubTypeCode = GetWindowSubtypeCode(hwnd)
SayCurrentScriptKeyLabel ()
If ExitUserBuffer() then
 If GlobalCurrentControl==ciGridView
	|| (GlobalCurrentControl==ic_AdvancedFindResultList && GlobalRealWindowName==wn_AdvancedFind) Then
		Delay(3)
		PerformScript SayLine()
	EndIf
 return
EndIf
QuickNavStateChange(false)
EscapeKey()
If IsCalendarView ()
&& GetObjectName(1)=="s" Then
	SayMessage (ot_error, msgCancelled_L, msgCancelled_S)
	Return
EndIf
If GIBrailleActive then
  BrailleRefresh()
EndIf
; Address list when entering addresses..
If (GlobalCurrentControl==To_Field
|| GlobalCurrentControl==CC_Field
|| GlobalCurrentControl==Bcc_Field) Then
	let giHasAddressAutoComplete=FALSE
	let gbIsAddressAutoCompleteListVisible=FALSE
	let gsBrlAutoComplete=cscNull
EndIf

SaveCursor()
PCCursor()
; Check for menus...
If iSubTypeCode == WT_MENU then
  let sMsg =	 FormatString (cmsg3_L, GetWindowText (hwnd, true))
  SayFormattedMessage (ot_control_name, sMsg)
  return
endIf
if iSubTypeCode == WT_CONTEXTMENU then
  let sMsg =	 FormatString (cmsg5_L, GetWindowText (hwnd, true))
  SayFormattedMessage (ot_control_name, sMsg)
endIf
EndScript

script SayLine()
Var
	Handle hFocus = GetFocus (),
	Handle hReal = GetRealWindow (hFocus),
	int iType = GetWindowSubtypeCode (hFocus),
	int iObjType = GetObjectSubTypeCode (),
	Int iControlID = GetControlID (hFocus),
	string sObjectName,
	string sObjectValue,
	string sObjectState,
	string sWindowName,
	string sWindowClass,
	string sText,
	Object oLabel,
	Int iLabel

if handleNoCurrentWindow() then
	return
endIf
If collectionItemsCount (atmentionsActiveSuggestion) 
&& ! UserBufferIsActive () then
; atMentions active suggestion
	if IsSameScript () then
		spellString (atmentionsActiveSuggestion.element.name)
	else
		say (atmentionsActiveSuggestion.ELEMENT.NAME, OT_LINE)
	endIf
	return
endIf
if UserBufferIsActive ()
|| inHjDialog ()
|| gbWordIsWindowOwner Then
	PerformScript SayLine()
	Return
EndIf
if !IsPCCursor() then
	PerformScript SayLine()
	return
endIf
if GetWindowClass (hFocus) == wcReListBox then
	if IsSameScript () then
		SayMessage (OT_SPELL, GetObjectName (TRUE))
	else
		SayMessage (OT_LINE, GetObjectName (TRUE))
	endIf
	return
endIf
If Not iType
	iType = iObjType
EndIf

If DialogActive ()
	; In case day or month recurrence is selected...
	If StringContains (GetWindowIDString (hReal), AppointmentRecurrenceStringIDStart)	; we are in recurrence dialogue...
		If iType == WT_RADIOBUTTON
			; day radio-button selected...
			If iControlID == ciRecurrencePatternDailyEvery
			|| iControlID == ciRecurrencePatternDailyWeekday
				Say (GetGroupBoxName (), OT_CONTROL_GROUP_NAME)
				IndicateControlTypeAndState ()
				Say (FormatString (MSG_PositionInformation, IntToString (iControlID - ciRecurrencePatternDailyEvery + 1),IntToString (2)), OT_POSITION)
				Return (TRUE)
			EndIf
			; month radio-button selected...
			If iControlID == ciRecurrencePatternMonthlyDay
			|| iControlID == ciRecurrencePatternMonthlyThe
				Say (GetGroupBoxName (), OT_CONTROL_GROUP_NAME)
				IndicateControlTypeAndState ()
				Say (FormatString (MSG_PositionInformation, IntToString (iControlID - ciRecurrencePatternMonthlyDay + 1),IntToString (2)), OT_POSITION)
				Return (TRUE)
			EndIf
		EndIf
	EndIf
EndIf

if getWindowSubtypeCode (hFocus) == WT_RADIOBUTTON then
	sayWindowTypeAndText (hFocus)
	Return
endIf
let sWindowName=GetWindowName(hFocus)
let sWindowClass = GetWindowClass(hFocus)
let GlobalCurrentControl=GetControlID(hFocus); Sometimes, the control id doesn't get updated.

If sWindowClass==wc_wwn then
	SayLine()
	return
EndIf

; Meeting scheduling...
If GlobalCurrentControl==app_Required Then
	Say(gsScheduleMeetingItem,ot_screen_message)
	Return
EndIf

; to announce correctly meeting subject and hopefully other similar multiedit fields...
If (getControlID (hFocus) == app_subject || getControlID (hFocus) == Bcc_field)
&& iType == WT_MULTILINE_EDIT
	if dialogActive () then ; signatures dialog:
		if IsSameScript () then SpellLine () else BuiltIn::SayLine (TRUE) return endIf
	endIf
	var object oClient = GetFocusObject (CHILDID_SELF)
	sObjectName = GetObjectName (TRUE)
	If oClient
		sObjectValue = oClient.accValue (CHILDID_SELF)
	EndIf
	if StringIsBlank (sObjectValue) then
		sObjectValue = getWindowText (hFocus, READ_EVERYTHING)
	endIf
	if IsSameScript () then
		SpellString (sObjectValue)
	else
		if ! StringIsBlank (sObjectValue) then
		say (sObjectValue, OT_LINE)
		else
			Say (cmsgBlank1, OT_LINE)
		endIf
	endIf
	if ! stringIsBlank (gsBrlAutocomplete) then
		say (gsBrlAutocomplete, OT_LINE)
		say (gsBrlAutoCompletePosition, OT_POSITION) ; position will say nothing for an empty string
	endIf
	Return
EndIf

SetJcfOption(OPT_MSAA_MODE,2)
let sObjectName=GetObjectNameOrValue()
let sObjectValue=GetObjectNameOrValue()
let sObjectState=GetObjectState(TRUE)
let iObjType=GetObjectSubtypeCode()
SetJcfOption(OPT_MSAA_MODE,1)
if GlobalCurrentControl==Contact_List
&& GetFolderType () == 2	; contacts list...
	;can't use MSAA in the Contacts folder for Outlook 2013,
	;use the UIA information retrieved by GetContactsListFocusItemData instead:
	let sObjectValue = GetContactsListFocusItemData()
	If IsSameScript() == 1
		Say(sObjectValue,ot_spell)
	ElIf IsSameScript() == 2
		SayMessage (OT_USER_BUFFER, sObjectValue)
	Else
		Say(sObjectValue,ot_line)
	EndIf
	Return
EndIf

; Message and Appointments list...
If sWindowClass == wc_OutlookGrid
&& IsInOutlookMainWindow (hFocus)
	If IsSameScript () then
		if CheckForNoMoreItems (OT_SPELL) then return TRUE endIf
		SpellString (StringTrimTrailingBlanks (StringTrimLeadingBlanks (smmStripMarkup (GetSuperGridListItem (hFocus, 2)))))
		Return
	EndIf
	if CheckForNoMoreItems (OT_LINE) then return TRUE endIf
	Say (GetSuperGridListItem (hFocus), OT_SELECTED_ITEM, TRUE)
	say (PositionInGroup (), OT_POSITION)
	Return
EndIf

If iControlID ==ciGridView
|| (GlobalCurrentControl ==ic_AdvancedFindResultList
&& GlobalRealWindowName==wn_AdvancedFind) Then
	If CheckForNoMoreItems(OT_LINE) Then
		Return
	EndIf
	If IsCalendarView () Then
		let sText=GetTextBetween(GetWindowLeft (hFocus),GetWindowRight (hFocus))
		If IsSameScript() Then
			Say(sText,ot_spell)
		Else
			Say(sText,ot_screen_message)
		EndIf
		Return
	EndIf ; End of Calendar appointment list
	If IsSameScript () Then
		SpellLine ()
		Return
	EndIf
	SayLine()
	Return
EndIf

; The CC field label is incorrectly labeled "Sent:" sometimes...
If GlobalCurrentControl==CC_Field
&& (iType==wt_Multiline_Edit
|| iType==wt_readOnlyEdit)
&& sWindowName != scSubject Then
	let sText=scCCField2+cscSpace+GetWindowTextEx(hFocus,FALSE,TRUE)
	; prevent Tab or ShiftTab from spelling out CC or To fields when pressed quickly.
	If IsSameScript()
	&& !StringContains(StringLower(GetCurrentScriptKeyName()),cksTab) then
		Say(sText,ot_spell)
	else
		if !gbUpDownNavigation then
			IndicateControlType(wt_edit,sText,cscNull)
		else
			SayHighlightedText(hFocus,sText)
		endIf
	EndIf
	Return
EndIf

; For selecting address books in Address book...
if (GlobalRealWindowName==wn_AddressBook
|| GlobalRealWindowName==wn_SelectNames)
&& sWindowName==scShowNames then
	let sText=GetWindowTextEx (hFocus, FALSE, FALSE)
	If IsSameScript() Then
		Say(sText,OT_SPELL)
	Else
		Say(sText,ot_line)
	EndIf
	Say(PositionInGroup (),ot_position)
	Return
EndIf ; End of Address book selection

; Customize View buttons...
If IsPCCursor () Then
	If StringContains(GlobalRealWindowName,wn_CustomizeView)
	&& ( GlobalCurrentControl  >= ciCustomViewFieldsButton
	&& GlobalCurrentControl <=ciCustomViewFormatColumnsButton) Then
		SayFocusedWindow()
		Return
	EndIf
EndIf
If StringContains(GlobalRealWindowName,scAppointment)
|| StringContains(GlobalRealWindowName,scMeeting) Then
	If (iType==wt_Edit
	&& iObjType==wt_Edit) Then
		SayObjectActiveItem()
		Return
	EndIf
EndIf

; RecurringAppointments pattern buttons...
If StringContains(GlobalRealWindowName,scRecurrence) Then
	If (iType==wt_Edit
	&& iObjType==wt_Edit) Then
		SayObjectActiveItem()
		Return
	EndIf

	; These fields have extra text of "Editable Text" within the object names, so this strips it...
	If StringContains(GlobalObjectName,scEditableText) Then
		let sObjectName=StringReplaceSubstrings (sObjectName, scEditableText, cscNull)
	EndIf
	If GlobalCurrentControl==ciRecurrencePattern8254
	|| GlobalCurrentControl==ciRecurrencePattern8224 Then
		Say(GetLine(),ot_screen_message)
		Return
	EndIf

	If iType==wt_RadioButton Then
		If ( GlobalCurrentControl ==ciRecurrencePatternDailyEvery
		|| GlobalCurrentControl ==ciRecurrencePatternMonthlyDay
		|| GlobalCurrentControl ==ciRecurrencePatternYearlyEvery) Then
			; These radio buttons give incorrect count...
			Say(sObjectName,OT_SCREEN_MESSAGE)
			SayUsingVoice (VCTX_MESSAGE, cMsgOneOfTwo, OT_POSITION)
			Return
		ElIf ( GlobalCurrentControl ==ciRecurrencePatternDailyWeekday
		|| GlobalCurrentControl ==ciRecurrencePatternMonthlyThe
		|| GlobalCurrentControl ==ciRecurrencePatternYearlyThe) Then
			Say(sObjectName,OT_SCREEN_MESSAGE)
			SayUsingVoice (VCTX_MESSAGE, cMsgTwoOfTwo, OT_POSITION)
			Return
		EndIf
	EndIf ; End of radio button type check.
EndIf ; End of Recurring appointment dialog.

If (sWindowName==scPreviousTimeButton
&& GlobalCurrentControl ==app_PreviousTimeButton) Then
	SayFocusedObject()
	Return
EndIf

If sWindowClass==wcReListBox
&& (GlobalCurrentControl ==ciAccountsList
|| GlobalCurrentControl ==ciCategoriesListBox) Then
	Say(GetFromStartOfLine ()+sObjectName,OT_SCREEN_MESSAGE)
	Say(PositionInGroup(), OT_POSITION)
	If  GlobalCurrentControl ==ciCategoriesListBox Then
		Say(GetFromStartOfLine (),OT_SCREEN_MESSAGE)
		Say(GetWindowTextEx (GetFocus(), TRUE, FALSE),OT_SCREEN_MESSAGE)
	EndIf
	Return
EndIf ; End of ReListBox class

;	calendar handling
If IsCalendarView() Then
	If sWindowClass == wc_AfxWndW then	; either a calendar pane or an appointment box...
		If IsCalendarViewAppointmentEditBox () Then
				let giFieldHasSpoken=FALSE
				SayBriefAppointmentData(GetCalendarView () != ciDayView)
				Return
		EndIf
		; main calendar pane...
		CalendarCleanUp ()
		RetrieveRangeData(ProcessDayDateRange (gsDateToProcess), ciDayView)
		ReadDateTime (0)
		Return
	ElIf sWindowClass == wc_NetUIHWND	; Calendar pane is not focused, we are in navigation pane...
	|| sWindowClass == WC_RichEdit20W then
		If iType == WT_RADIOBUTTON
		&& GetCalendarView () == ciMonthView then
			let oLabel = GetFocusObject (iLabel).accParent.accNavigate (NAVDIR_PREVIOUS, iLabel)
			Say (oLabel.accName (iLabel), OT_CONTROL_NAME)
			ComRelease (oLabel, true)
		EndIf
		If iType == WT_TREEVIEWITEM then
			Say (GetObjectName (TRUE), OT_CONTROL_NAME)
			IndicateControlState (WT_TREEVIEW, GetControlAttributes ())
		EndIf
		If iType == WT_LINK
		|| iType == WT_BUTTON
		|| iType == WT_RADIOBUTTON
		|| iType == WT_EDIT then
			SayLine ()
		ElIf iType == WT_ButtonMenu then
			IndicateControlType (iType, GetObjectName (TRUE))
		EndIf
		Return
	EndIf	; end of checking the calendar pane is focused...
EndIf	; end of calendar check...
; Contact view...
If !IsCalendarView ()
&& iControlID == Contact_List
&& !GlobalMenuMode
&& GetWindowSubTypeCode(hFocus)!=wt_Button
&& !UserBufferIsActive() then
	Say(GetWindowTextEx(GlobalFocusWindow,TRUE,TRUE),OT_SCREEN_MESSAGE)
	return
EndIf ; End of Contact list.
; Rules wizard
If (GlobalRealWindowName== wn_RulesWizard
|| GlobalRealWindowName== wn_RulesAndAlerts) Then
	If GlobalCurrentControl==ciRulesConditionCheckList Then
		SayLine()
		Return
	EndIf
	If GlobalCurrentControl== RuleDescriptionListBox  Then
		SayObjectActiveItem(FALSE)
		Return
	EndIf
	If iType==wt_TabControl Then
		SayLine()
		Return
	EndIf
EndIf ; End Rules Wizard.

If GlobalRealWindowName==wn_AdvancedFind
&& iType==wt_TabControl Then
	SayLine()
	Return
EndIf
; File as: field in Contact list.
If  sWindowClass==wc_ReComboBox20W
&& StringContains(sWindowName,wn_FileAs) Then
	SayWindow (GlobalFocusWindow, TRUE)
	Return
EndIf
let iControlID = GetControlID (hFocus)
; To announce the task reminder time
If StringContains (GetWindowName (GlobalRealWindow), scTaskItem)
		&& iControlID == ciReminderTimeEditBox then
	IndicateControlType (GetWindowTypeCode (hFocus), GetObjectName (TRUE), GetLine ())
	Return
EndIf
; Address book options...
If StringContains (GetWindowName (GlobalRealWindow), WN_Addressing)
&& (iControlID == ID_PersonalAddresses
|| iControlID == ID_CheckNames)
&& iObjType == WT_COMBOBOX then
	IndicateControlType (iObjType, GetObjectName (TRUE), GetWindowText (hFocus, FALSE))
	Say (PositionInGroup (), OT_POSITION)
	Return
EndIf
; Navigation pane treeview handling...
If GetWindowClass (GetFocus ()) == wc_NetUiHwnd
&& GetFolderType () == 0	; Inbox folder
&& iObjType == WT_TREEVIEWITEM then
	SayTreeViewLevel (TRUE)
	Return
EndIf
; To announce the attendees report status correctly...
If iControlID == app_AllAttendeesList
&& iType == WT_LISTBOX then
	say (getObjectName (TRUE), OT_LINE)
	Return
EndIf
; To handle menus...
If MenusActive () then
	SayLine ()
	Return
endIf
; Calendar and tasks colours...
If GetWindowSubtypeCode (GetParent (GetParent (hFocus))) == WT_DIALOG
&& (iControlID == ID_DefaultColour
|| iControlID == ID_OverdueTaskColour
|| iControlID == ID_CompletedTaskColour)
&& iType == WT_COMBOBOX
&& StringIsBlank (GetWindowTextEx (hFocus, FALSE, FALSE)) then
	IndicateControlType (iType, sWindowName, GetColorName (GetMSAAColourAtComboBox ()))
	Say (PositionInGroup (), OT_POSITION)
	Return
EndIf
PerformScript SayLine()
if ! stringIsBlank (gsBrlAutocomplete) then
	say (gsBrlAutocomplete, OT_LINE)
	say (gsBrlAutoCompletePosition, OT_POSITION) ; position will say nothing for an empty string
endIf
EndScript

Script SayAll ()
if gbWordIsWindowOwner then ; let Word take over.
	performScript SayAll()
	return
endIf
if IsPcCursor ()
&& ! UserBufferIsActive ()
&& ! globalMenuMode
&& (getWindowSubtypeCode (getFocus ()) == WT_LISTBOX
|| globalCurrentControl == CIGridView) then
	PerformScript SayLine ()
	Return
endIf
PerformScript SayAll ()
endScript

Script SayAllFromLocation ()
if gbWordIsWindowOwner then ; let Word take over.
	performScript SayAllFromLocation ()
	return
endIf
if IsPcCursor ()
&& ! UserBufferIsActive ()
&& ! globalMenuMode
&& (getWindowSubtypeCode (getFocus ()) == WT_LISTBOX
|| globalCurrentControl == CIGridView) then
	PerformScript SayLine ()
	Return
endIf
PerformScript SayAllFromLocation ()
endScript

Script JAWSPageDown ()
var
	handle HCurrent,
	int iTypeCode
If gbWordIsWindowOwner Then
	PerformScript JawsPageDown()
	Return
EndIf
let HCurrent = GetCurrentWindow ()
let iTypeCode = GetWindowSubTypeCode (HCurrent)
if GlobalMenuMode
&& GetWindowClass(hCurrent)==cwc_RichEdit20W
&& iTypeCode!=wt_Edit_Spinbox then
	SayCurrentScriptKeyLabel ()
	JAWSPageDown ()
	Delay (2)
	SayFormattedMessage (OT_TEXT, getObjectValue())
	return
EndIf

PerformScript JAWSPageDown ()
EndScript

script PageDown ()
performScript JAWSPageDown ()
endScript

Script JAWSPageUp ()
var
	handle HCurrent,
	int iTypeCode
If gbWordIsWindowOwner Then
PerformScript JawsPageUp()
Return
EndIf
let HCurrent = GetCurrentWindow ()
let iTypeCode = GetWindowSubTypeCode (HCurrent)
if GlobalMenuMode
&& GetWindowClass(hCurrent)==cwc_RichEdit20W
&& iTypeCode!=wt_Edit_Spinbox then
	SayCurrentScriptKeyLabel ()
	JAWSPageUp ()
	Delay (2)
	SayFormattedMessage (OT_TEXT, getObjectValue())
	return
EndIf

PerformScript JAWSPageUp ()
EndScript

script PageUp ()
performScript JAWSPageUp ()
endScript

Script Enter ()
var
	handle hFocus,
	Object oTreeView,
	Int iLoop,
	Int iChildID,
	Int iNumberOfSelected,
	Int iControlID,
	Int iObjectType,
	string sClass

if IsVirtualRibbonActive() then
	performscript Enter()
	return
endIf

If gbWordIsWindowOwner Then
	If GetObjectSubtypeCode()==wt_link
	&& IsActiveDocumentProtected () then
		SetJcfOption(opt_quick_key_navigation_mode,0)
		SetQuickKeyNavigationState(0)
	EndIf
	PerformScript Enter()
	Return
EndIf

let hFocus = GetFocus ()
let iControlID = GetControlId (hFocus)
let iObjectType = GetObjectSubTypeCode ()
let sClass = GetWindowClass (hFocus)
GiIgnoreVirtualCursorSynchronized 	= (iControlID == CIGridView)
SayCurrentScriptKeyLabel()
enterKey ()
If IsPCCursor () then
	; Address list when entering addresses..
	If iControlID == To_Field
	|| iControlID == CC_Field
	|| iControlID == Bcc_Field Then
		let giHasAddressAutoComplete=FALSE
		let gbIsAddressAutoCompleteListVisible=FALSE
		let gsBrlAutoComplete=cscNull
		Return
	EndIf
	If IsCalendarViewAppointmentEditBox () Then
		OpenCurrentAppointment()
		Return
	EndIf
EndIf
If sClass == wc_OpenListView then
	let GlobalSuppressOpenListView = 1
EndIf
; for returning into the message body from a control off a menu in the ribbon,
; we must pass the key through and let ScreenStabilizedEvent determine
;whether to return focus to the message body through a call to SetFocus for the parent of the document window.
; This is because FocusChangedEventEx gets an invalid window handle and focus cannot be set from there reliably.
If globalMenuMode
&& StringCompare(GetWindowClass(GetParent(GetCurrentWindow())),wc_NetUiToolWindow)==0 then
	return
EndIf
; To handle changing of the state in calendar navigation pane...
If IsCalendarView ()
&& IsNavigationPane ()
&&iObjectType == WT_TREEVIEWITEM
&& GetObjectSubTypeCode (FALSE, 2) == WT_TREEVIEW then
	If GetTreeViewSelectedStateFromUIA () then
		; Just to test if the current calendar is the last one...
		let oTreeView = GetFocusObject (iChildID).accParent
		While iLoop < oTreeView.accChildCount
			let iLoop = iLoop + 1
			If oTreeView.accChild (iLoop).accState (0)& 0x6 then
				let iNumberOfSelected = iNumberOfSelected + 1
			EndIf
		EndWhile
		If iNumberOfSelected == 1 then
			IndicateControlState (WT_TREEVIEW, CTRL_CHECKED)	; we can not uncheck the last calendar...
			Return
		EndIf
		IndicateControlState (WT_TREEVIEW, CTRL_UNCHECKED)
	Else
		IndicateControlState (WT_TREEVIEW, CTRL_CHECKED)
	EndIf
	Return
EndIf
EndScript

Script ShiftTabKey ()
Var
	handle hFocus,
	Int iObjectTypeBeforeTab,
	Int iObjectTypeAfterTab,
	string focusClass

If MenusActive ()
|| IsInRibbons () then
	let gbMessageHasBeenRead=TRUE
EndIf
let hFocus = GetFocus()
let focusClass=GetWindowClass(hFocus)
;For virtual forms such as in Dynamics CRM Outlook addin.
if IsVirtualPCCursor() && focusClass==cwcIEServer then
	shiftTabKey()
	SayObjectTypeAndText()
	return
endIf
if getWindowCategory () == WCAT_SDM && ! gbWordIsWindowOwner then
	sayCurrentScriptKeyLabel ()
	shiftTabKey ()
	return
endIf
let iObjectTypeBeforeTab = GetObjectSubTypeCode ()
If focusClass==wc_WordMainDocumentWindow
&& IsMessageTextWindow (hFocus) then
	if IsAttachmentsListField() then
		SayCurrentScriptKeyLabel ()
		SetFocus(FindWindowWithClassAndID (GetAppMainWindow(hFocus),cwc_RichEdit20W,subject_field))
		let gbWordIsWindowOwner=false
	elif !IsActiveDocumentProtected ()
	&& IsCalendarview() then
		; do not allow Word ShiftTab script, use default.
		PerformScript ShiftTab()
		SayLine()
		let gbWordIsWindowOwner=false
	else
		PerformScript ShiftTabKey()
		let gbWordIsWindowOwner=true
	endIf
	return
EndIf
if UserBufferIsActive()
|| InRibbons()
|| isStatusBarToolbar(hFocus)
|| InOptionsDialog(hFocus) then
	PerformScript ShiftTab()
	Return
EndIf

SayCurrentScriptKeyLabel ()
ShiftTabKey()
If StringContains(GlobalRealWindowName,sc_OutlookContactDialog) then
	delay(1,true)
	if GetWindowClass(GetFocus())==wc_WordMainDocumentWindow then
		SayMessage(ot_control_name,GetObjectName(true))
	endIf
endIf
If IsCalendarView () then
	Delay (1)
	let iObjectTypeAfterTab = GetObjectSubTypeCode ()
	If iObjectTypeAfterTab == iObjectTypeBeforeTab
	&& iObjectTypeAfterTab == WT_STATIC then
		SayMessage (OT_JAWS_MESSAGE, msgNoAppointmentsFound_L, msgNoAppointmentsFound_S)
		Return
	EndIf
EndIf
EndScript

Script TabKey ()
var
	handle hWnd,
	handle hFocus,
	Int iObjectTypeBeforeTab,
	Int iObjectTypeAfterTab,
	int iControl,
	int iAddressField,
	string focusClass

If MenusActive ()
|| IsInRibbons () then
	let gbMessageHasBeenRead=TRUE
EndIf
if getWindowCategory () == WCAT_SDM && ! gbWordIsWindowOwner then
	sayCurrentScriptKeyLabel ()
	tabKey ()
	return
endIf
let hWnd=GetFocus()
let focusClass=GetWindowClass(hwnd)
;For virtual forms such as in Dynamics CRM Outlook addin.
if IsVirtualPCCursor() && focusClass==cwcIEServer then
	tabKey()
	SayObjectTypeAndText()
	return
endIf

If focusClass==wc_WordMainDocumentWindow then
	PerformScript TabKey()
	Return
EndIf

if UserBufferIsActive()
|| InRibbons()
|| isStatusBarToolbar(hwnd)
|| InOptionsDialog(hwnd) then
	performScript Tab()
	Return
EndIf
SayCurrentScriptKeyLabel ()
;only check for address fields when appropriate:
if !StringContains(globalRealWindowName,scTasks) then
	let iControl=GetControlID(hWnd)
	let iObjectTypeBeforeTab = GetObjectSubTypeCode ()
	; To:, CC:, and BCC: fields...
	If (iControl==To_Field
	|| iControl==CC_Field
	|| iControl==BCC_Field) Then
		let iAddressField=iControl
	EndIf ; End To:, CC:, and BCC: fields.
endIf
TabKey()

If iAddressField Then
	Delay(2)
	let hFocus=GetFocus()
	; When tab is used to auto-complete an address, this will read the data
	If hWnd==hFocus Then
		delay (1, TRUE)
		SayWindow(hFocus,FALSE)
		gsBrlAutoComplete = cscNull
		Return
	EndIf
EndIf
If StringContains(GlobalRealWindowName,sc_OutlookContactDialog) then
	delay(1,true)
	if GetWindowClass(GetFocus())==wc_WordMainDocumentWindow then
		SayMessage(ot_control_name,GetObjectName(true))
	endIf
endIf
If IsCalendarView () then
Delay (1)
	let iObjectTypeAfterTab = GetObjectSubTypeCode ()
	If iObjectTypeAfterTab == iObjectTypeBeforeTab
	&& iObjectTypeAfterTab == WT_STATIC then
		SayMessage (OT_JAWS_MESSAGE, msgNoAppointmentsFound_L, msgNoAppointmentsFound_S)
		Return
	EndIf
EndIf
EndScript

Void Function MoveToFieldUsingHandle (handle hndDesiredWindow, string strControlName)
Var
	int FocusControlWindow,
	int iControl,
	handle hndCurrentFocusWindow,
		handle hwnd
Let hndCurrentFocusWindow = GetFocus ()
If hndCurrentFocusWindow == hndDesiredWindow then
	SayUsingVoice (VCTX_MESSAGE,msgAlreadyThere+strControlName, OT_STATUS) ; "You are already in the "
	return
EndIf
SaveCursor ()
If (IsWindowVisible(hndDesiredWindow)) then
	MoveToWindow (hndDesiredWindow)
	RoutePcToJAWS () ;does a mouse click
Else
	PcCursor ()
	Say (strControlName+msgNotVisible, OT_ERROR) ; not found. This field may not be visible on the screen
EndIF
EndFunction

Script ClickButton (int iButtonID)
var
	int iButtonControlID,
	int iButtonIsClickable,
	handle hButton,
	string sButtonLabel

If iButtonID==ciOne Then
	let iButtonControlID=to_button
	let sButtonLabel=msgToButton
ElIf iButtonID==ciTwo Then
	let iButtonControlID=cc_button
	let sButtonLabel=msgCcButton
ElIf iButtonID==ciThree Then
	let iButtonControlID=address_button
	let sButtonLabel=msgAddressButton
ElIf iButtonID==ciFour Then
	If !StringContains(GlobalRealWindowName,scTasks) Then
		; Not in a Reminder Task...
		SayMessage(OT_ERROR,msgErrorClickReminderSound_L, msgErrorClickReminderSound_s)
		Return
	EndIf
	let iButtonControlID=ReminderSound_button2
	let sButtonLabel=msgReminderSoundButton
Else
	Return
EndIf
SayUsingVoice(VCTX_MESSAGE,sButtonLabel,OT_SCREEN_MESSAGE)
; Find, then move to, button...
let hButton = FindDescendantWindow (GlobalAppWindow, iButtonControlID)
; Find out if the button actually exists.
let iButtonIsClickable = ((hButton)
|| (IsWindowVisible (hButton))
|| (!IsWindowObscured (hButton)))
if iButtonIsClickable then
	SaveCursor ()
	JAWSCursor ()
	SaveCursor ()
	; Stores location of JAWSCursor
	MoveToWindow (hButton)
	pause()
	LeftMouseButton (); Will work on the toolbar
	RestoreCursor ()
	RestoreCursor ()
else
	Say(msgLabelNotFound1_L,OT_ERROR)
EndIf
EndScript

Int Function SaveApplicationSettings ()
; save personal preferences
Var
	int iResult,
	string sCurJcfFileName,
	int iSayAllMode
let sCurJCFFileName=outlook2013_JCFFilename
let iResult = IniWriteInteger (section_options, HKey_MeetingRequest, giOutlookMeetingRequestVerbosity,  Outlook2013JSI )
	IniWriteInteger (section_options, HKey_AutoComplete, giOutlookAutoCompleteVerbosity,  Outlook2013JSI )
	IniWriteInteger (section_options, HKey_MessageStatus, giOutlookMessageStatusVerbosity , Outlook2013JSI )
	IniWriteInteger (section_options, HKey_MessageHeader, giOutlookMessageHeaderVerbosity ,Outlook2013JSI)
	IniWriteInteger (section_options, HKey_RepliedFlag, giOutlookRepliedFlagVerbosity , Outlook2013JSI )
	IniWriteInteger (section_options, HKey_followUpFlag, giOutlookFollowUpFlagVerbosity , Outlook2013JSI )
	IniWriteInteger (section_options, HKey_ForwardedFlag, giOutlookForwardedFlagVerbosity , Outlook2013JSI )
	IniWriteInteger (section_options, HKey_MessageFlag, giOutlookMessageFlagVerbosity , Outlook2013JSI )
	IniWriteInteger (section_options, HKey_MessageSayAll, giOutlookMessageSayAllVerbosity,Outlook2013JSI )
	IniWriteInteger (section_options, HKey_Attachments, giOutlookAttachmentsVerbosity , Outlook2013JSI )
	IniWriteInteger (section_options, HKey_InfoBar, giOutlookInfoBarVerbosity , Outlook2013JSI )
	SaveSelectionContextFlags(section_options,giSelCtxFlags,Outlook2013JSI)
	;for language, save in jcf file.
	iniWriteInteger(section_options, hKey_LanguageDetection,globalDetectLanguages,sCurJCFFileName)
	iniWriteInteger(section_OSM,hKey_jcfTableIndication,gb_jcfTableIndication,sCurJcfFileName)
	iniWriteInteger(Section_options,hKey_TableDescription,giTableDescription,Outlook2013JSI)
	iniWriteInteger(Section_HTML,hKey_DocumentPresentationSet,gbDocumentPresentationSet,sCurJCFFilename)
	;must match document presentation mode for Braille support
	iniWriteInteger(section_braille,hKey_Brl_UseOSM,gbBrlUseOSM,sCurJcfFilename)
	iniWriteInteger(Section_options,hKey_AnnounceCellCoordinates,gbAnnounceCellCoordinates,Outlook2013JSI)
	iniWriteInteger(section_options,hKey_nonbreakingSymbols,giIndicateNonbreakingsymbols,sCurJCFFilename)
	iniWriteInteger(section_HTML,hKey_HeadingIndication,giMSOfficeHeadingIndication,sCurJCFFilename)
	iniWriteInteger(section_options,hKey_generalizeBullets,giIndicateBulletType,sCurJCFFilename)
	iniWriteInteger(section_braille,hKey_generalizeBullets,giIndicateBrailleBulletType,sCurJCFFilename)
	iniWriteInteger(section_options,hKey_MeasurementUnits,giDesiredUnit,Outlook2013JSI)
	iniWriteInteger(section_OSM,hKey_UnderlineProofreadingErrors,giBrlProofreadingMark,sCurJCFFilename)
	iniWriteInteger(section_options,hKey_DetectSpelling,giDetectSpelling,Outlook2013JSI)
	iniWriteInteger(section_options,hKey_DetectGrammar,giDetectGrammar,Outlook2013JSI)
	IniWriteInteger(section_options,hKey_MessageLinkCountIndication,gbMessageLinkCountIndication,Outlook2013JSI)
	iniWriteInteger(section_options,hKey_TabMeasurementIndication,gbTabMeasurementIndication,Outlook2013JSI)
	iniWriteInteger(section_richEditAndOsmOptions,hKey_SelCtxWithMarkup,gbSelCtxWithMarkup,sCurJCFFilename)
	SaveSayAllMode()
return iResult
EndFunction

Void Function InitializeApplicationSettings()
;for settings not related to message flags:
let giSelCtxFlags=GetSelectionContextFlags()
SetSelectionContextFlags(giSelCtxFlags,giOutlookSelCtxBeforeCaretMoveBitFlagOrderMask)
;tables
SetJcfOption(OptTableIndication,true); on by default
let GiTblHeaders =off ; set in TableEnteredEvent
let giTableDescription=On ; on by default
let gbDocumentPresentationSet=0 ; off by default, read single table cells
SetJcfOption(optHTMLDocumentPresentationMode,gbDocumentPresentationSet)
let gbBrlUseOSM=0 ; off by default, using DOM.
setJcfOption(OPT_BRL_USE_OSM,gbBrlUseOSM) ; must match gbDocumentPresentationSet for Braille support
let gbAnnounceCellCoordinates=true ; on by default
let globalDetectLanguages=SetJcfOption(opt_Language_detection,0) ; off by default in Outlook
SetJcfOption(opt_quick_key_navigation_mode,0) ; off by default
let giDesiredUnit=smmGetDesiredUnitsOfMeasure()
let giMSOfficeHeadingIndication=2 ; on with heading levels by default in Outlook messages.
SetJcfOption(optHeadingIndication,giMSOfficeHeadingIndication)
let giDetectSpelling=false ; off by default
let giDetectGrammar=false ; off by default
Let giSayAllReadBy=0 ; lines without pauses by default
SetJcfOption(opt_Say_All_Mode,0) ; read by lines on by default.
SetJcfOption(opt_Line_pauses,0) ; lines without pauses on by default.
let giOutlookMessageHeaderVerbosity=false ; off by default
let giOutlookMessageSayAllVerbosity=false ;  off by default
let gbMessageLinkCountIndication=false ; off by default
let gbTabMeasurementIndication=true ; on by default
let gbSelCtxWithMarkup=true ; Express Navigation Mode is off by default
EndFunction

Void Function LoadApplicationSettings ()
; Load personal preferences
var
	string sCurJCFFileName

let sCurJCFFileName=outlook2013_JCFFilename
initializeApplicationSettings()
;if the .jsi file has any flags set,
;read them and set them.
let giSelCtxFlags=iniReadInteger(Section_options,hKey_selCtxFlags,giSelCtxFlags,Outlook2013JSI)
SetSelectionContextFlags(giSelCtxFlags,giOutlookSelCtxBeforeCaretMoveBitFlagOrderMask)
;tables:
let gb_jcfTableIndication=iniReadInteger(section_OSM,hKey_jcfTableIndication,getJcfOption(optTableIndication),sCurJcfFileName)
setJCFOption(optTableIndication,gb_jcfTableIndication)
let giTableDescription=iniReadInteger(Section_options,hKey_TableDescription,giTableDescription,Outlook2013JSI)
let gbDocumentPresentationSet=iniReadInteger(Section_html,hKey_DocumentPresentationSet,getJcfOption(optHTMLDocumentPresentationMode),sCurJCFFilename)
SetJcfOption(optHTMLDocumentPresentationMode,gbDocumentPresentationSet)
let gbBrlUseOSM=iniReadInteger(Section_Braille,hKey_Brl_UseOSM,getJcfOption(OPT_BRL_USE_OSM),sCurJCFFileName)
setJcfOption(OPT_BRL_USE_OSM,gbBrlUseOSM) ; must match for Braille support
let gbAnnounceCellCoordinates=iniReadInteger(Section_options,hKey_AnnounceCellCoordinates,gbAnnounceCellCoordinates,Outlook2013JSI)
Let giOutlookAutoCompleteVerbosity= IniReadInteger (section_options, HKey_AutoComplete, TRUE, Outlook2013JSI )
Let giOutlookMeetingRequestVerbosity= IniReadInteger (section_options, HKey_MeetingRequest, TRUE, Outlook2013JSI )
Let giOutlookMessageStatusVerbosity= IniReadInteger (section_options, HKey_MessageStatus, TRUE, Outlook2013JSI )
Let giOutlookFollowUpFlagVerbosity= IniReadInteger (section_options, HKey_FollowUpFlag, FALSE, Outlook2013JSI )
Let giOutlookForwardedFlagVerbosity= IniReadInteger (section_options, HKey_ForwardedFlag, FALSE, Outlook2013JSI )
Let giOutlookRepliedFlagVerbosity= IniReadInteger (section_options, HKey_RepliedFlag, FALSE, Outlook2013JSI )
Let giOutlookMessageFlagVerbosity= IniReadInteger (section_options, HKey_MessageFlag, TRUE, Outlook2013JSI )
Let giOutlookMessageSayAllVerbosity= IniReadInteger (section_options, HKey_MessageSayAll,giOutlookMessageSayAllVerbosity, Outlook2013JSI)
Let giOutlookAttachmentsVerbosity= IniReadInteger (section_options, HKey_Attachments, FALSE, Outlook2013JSI )
Let giOutlookInfoBarVerbosity= IniReadInteger (section_options, HKey_InfoBar, TRUE, Outlook2013JSI )
Let giOutlookMessageHeaderVerbosity= IniReadInteger (section_options, HKey_MessageHeader,giOutlookMessageHeaderVerbosity,Outlook2013JSI)
Let GlobalCalendarColor= IniReadInteger (section_options, HKey_CalendarHighlightColor, FALSE,Outlook2013JSI )
let giIndicateBulletType=iniReadInteger(section_options,hKey_generalizeBullets,giIndicateBulletType,sCurJCFFilename)
SetJcfOption(OPT_GENERALIZE_BULLETS,giIndicateBulletType)
let giIndicateBrailleBulletType=iniReadInteger(section_braille,hKey_generalizeBullets,giIndicateBrailleBulletType,sCurJCFFilename)
SetJcfOption(OPT_BRL_GENERALIZE_BULLETS,giIndicateBrailleBulletType)
let giDesiredUnit=iniReadInteger(section_options,hKey_MeasurementUnits,giDesiredUnit,Outlook2013JSI )
let giBrlProofreadingMark=iniReadInteger(section_OSM,hKey_UnderlineProofreadingErrors,giBrlProofreadingMark,sCurJCFFilename)
SetJCFOption(OPT_UNDERLINE_PROOFREADING_ERRORS,giBrlProofreadingMark)
let globalDetectLanguages=iniReadInteger(section_options,hKey_LanguageDetection,globalDetectLanguages,sCurJCFFilename)
SetJcfOption(opt_language_detection,globalDetectLanguages)
let giIndicateNonbreakingSymbols=iniReadInteger(section_options,hKey_nonbreakingSymbols,giIndicateNonbreakingsymbols,sCurJCFFilename)
SetJcfOption(OPT_INDICATE_NONBREAKING_SYMBOLS,giIndicateNonbreakingSymbols)
let giMSOfficeHeadingIndication=iniReadInteger(section_HTML,hKey_HeadingIndication,giMSOfficeHeadingIndication,sCurJCFFilename)
SetJcfOption(optHeadingIndication,giMSOfficeHeadingIndication)
let giDetectSpelling=iniReadInteger(section_options,hKey_DetectSpelling,giDetectSpelling,Outlook2013JSI )
let giDetectGrammar=iniReadInteger(section_options,hKey_DetectGrammar,giDetectGrammar,Outlook2013JSI )
let gbMessageLinkCountIndication=IniReadInteger(section_options,hKey_MessageLinkCountIndication,gbMessageLinkCountIndication,Outlook2013JSI)
let gbTabMeasurementIndication=iniReadInteger(section_options,hKey_TabMeasurementIndication,gbTabMeasurementIndication,Outlook2013JSI)
let gbSelCtxWithMarkup=iniReadInteger(section_richEditAndOsmOptions,hKey_SelCtxWithMarkup,gbSelCtxWithMarkup,sCurJCFFilename)
SetJcfOption(OPT_Request_Markedup_Content,gbSelCtxWithMarkup)
;turn off Braille proofreading markup if Express Navigation Mode on.
if !gbSelCtxWithMarkup ; it is on.
&& giBrlProofreadingMark>0 then
	SetJCFOption(OPT_UNDERLINE_PROOFREADING_ERRORS,0)
endIf
let giSayAllReadBy=IniReadInteger(section_options,hKey_SayAllReadBy,giSayAllReadBy,Outlook2013JSI)
SetSayAllMode()
EndFunction

string function GetCustomTutorMessage()
var
	Handle hFocus,
	Handle hPaneParent,
	Handle hCalendarPane,
	String sFocusWindowClass,
	string sRealName,
	Int iCalendarView,
	Int iNumberOfCalendars,
	Int iControlID,
	Int iObjectType

If gbWordIsWindowOwner Then
	return GetCustomTutorMessage()
EndIf
let hFocus = GetFocus ()
let sRealName = getWindowName (getRealWindow (hFocus))
let iControlID = GetControlID (hFocus)
let iObjectType = GetObjectSubTypeCode ()
let sFocusWindowClass = GetWindowClass (hFocus)
;Resolve beta tester confusion on how to use an open note, defect 47301
if (StringContains (sRealName, scNoteDialogName)) then
	;Only add here if in a note:
	if getWindowSubtypeCode (getFocus ()) == WT_MULTILINE_EDIT then
		return msgNoteBodyTutor;
	endIf
	return cscNull
EndIf
; Calendar handling...
If IsCalendarView() then
	let hPaneParent = FindWindowWithClassAndId (GetRealWindow (hFocus), wc_AfxWndW, 109)
	If hPaneParent then
		let hCalendarPane = GetFirstChild (hPaneParent)
		While hCalendarPane
			let hCalendarPane = GetNextWindow (hCalendarPane)
			If GetControlID (hCalendarPane) == ID_CalendarPane then
				let iNumberOfCalendars = iNumberOfCalendars + 1
			EndIf
		EndWhile
	EndIf
	If sFocusWindowClass == wc_AfxWndW
	&& (!gbUpDownNavigation)
	&& (!gbLeftRightNavigation) Then
		If Not IsCalendarViewAppointmentEditBox () then
			If iObjectType != WT_EDIT then
				let iCalendarView = GetCalendarView ()
				If iCalendarView == ciDayView
				|| iCalendarView == ciWorkWeekView
				|| iCalendarView == ciWeekView then
					If iNumberOfCalendars == 1 then
						Return (FormatString (MSG_CalendarPaneTravellingHelp, FormatString (MsgDayViewTutorHelp)))
					ElIf iNumberOfCalendars > 1 then
						Return (FormatString (MSG_CalendarPanesTravellingHelp, FormatString (MsgDayViewTutorHelp), IntToString (iNumberOfCalendars)))
					Else
						Return (FormatString(MsgDayViewTutorHelp))
					EndIf
				ElIf iCalendarView == ciMonthView Then
					If iNumberOfCalendars == 1 then
						Return (FormatString (MSG_CalendarPaneTravellingHelp, FormatString (MsgMonthViewTutorHelp)))
					ElIf iNumberOfCalendars > 1 then
						Return (FormatString (MSG_CalendarPanesTravellingHelp, FormatString (MsgMonthViewTutorHelp), IntToString (iNumberOfCalendars)))
					Else
						Return (FormatString(MsgMonthViewTutorHelp))
					EndIf
				EndIf
			EndIf
		Else ; is in appointment edit field.
			return (FormatString (msgAppointmentFieldTutorHelp))
		EndIf ; End of appointment edit field.
	ElIf IsNavigationPane ()
	&& iObjectType == WT_TREEVIEWITEM then
		If iNumberOfCalendars == 1 then
			Return (FormatString (MSG_CalendarPaneTravellingHelp, msgTreeView))
		ElIf iNumberOfCalendars > 1 then
			Return (FormatString (MSG_CalendarPanesTravellingHelp, msgTreeView, IntToString (iNumberOfCalendars)))
		Else
			Return (FormatString(MsgMonthViewTutorHelp))
		EndIf
	EndIf
EndIf ; End of calendar
If StringContains (GetWindowClass (globalRealWindow), wc_bosa_SDM_Mso96)
|| StringContains(sFocusWindowClass, wc_bosa_SDM_Mso96)
|| StringContains(GetWindowClass(GetParent(GlobalFocusWindow)),"") then
	; we are in an SDM dialog
	If GetWindowSubtypeCode (GlobalFocusWindow)==wt_toolbar then
		; we are on a toolbar control within an sdm dialog.
		return FormatString(cmsgScreenSensitiveHelp23_L)
	EndIf
EndIf

If IsNavigationPane ()
&& (iObjectType==wt_TreeViewItem
|| iObjectType==wt_TreeView) Then
	return msgTreeView
EndIf
; to announce help message for contacts listview.
If sFocusWindowClass == WC_Rctrl_RenWnd32 then
	Return (MsgListBox)
EndIf

If GetWindowCategory () == WCAT_STATUSBAR_TOOLBAR
	Return (officeClassic::GetCustomTutorMessage())
EndIf

return GetCustomTutorMessage() ; Call default...
EndFunction

Void Function SetDeletedGroupByFlag ()
Var
	string sText
SaveCursor ()
PCCursor (); get text based on the highlighted item found at the PC cursor
let sText = GetLine ()
RestoreCursor ()
If IsMessagesList () Then
	If StringContains (GetObjectName (), scGroupBy) Then
		let giDeleteGroupByFlag = TRUE
	EndIf
EndIf
EndFunction

; scripts to change views in Outlook 2003.
; Each script sets the global flag, giViewChange, to true.
; This in turn, causes the FocusChangeEvent to speak the real window information when the view is changed.

Script GoToMessagesView ()
if UserBufferIsActive () then
	UserBufferDeactivate ()
endIf
If !IsNavigationPane () Then
	let giViewChange = TRUE
EndIf
TypeKey (KsGoToMessageList)
EndScript

Script GoToContactsView ()
if UserBufferIsActive () then
	UserBufferDeactivate ()
endIf
If !IsNavigationPane () Then
	let giViewChange = TRUE
EndIf
TypeKey (KsGoToContacts)
SayObjectTypeAndText ()
EndScript

Script GoToTasksView ()
if UserBufferIsActive () then
	UserBufferDeactivate ()
endIf
If !IsNavigationPane () Then
	let giViewChange = TRUE
EndIf
TypeKey (KsGoToTasks)
EndScript

Script GoToNotesView ()
if UserBufferIsActive () then
	UserBufferDeactivate ()
endIf
If !IsNavigationPane () Then
	let giViewChange = TRUE
EndIf
TypeKey (KsGoToNotes)
EndScript

Script GoToCalendarView()
if UserBufferIsActive () then
	UserBufferDeactivate ()
endIf
If !IsNavigationPane () Then
	let giViewChange = TRUE
EndIf
TypeKey (KsGoToCalendar)
EndScript

; this script is attached to space & ctrl+space and is used to handle selecting multiple discontiguous items in outlook 2003
Void Function SelectMessage ()
if GetControlID (GetFocus()) == Messages_Listbox then
 	Let nSaySelectAfter = FALSE
	let nSelectingText = True
	SayLine ()
EndIf
EndFunction

/*********************Removed as using screen 6ext / highlight color:
*******At present, not attempting to get collection from object, as could easily become very expensive.
*/
Script SelectNextLine ()
var
	String sCalendarValue,
	String sTimeValue

If gbWordIsWindowOwner Then
PerformScript SelectNextLine()
Return
EndIf
If GlobalCurrentControl==ciGridView Then
	Let nSaySelectAfter = FALSE
	SelectingText(TRUE)
	SelectNextLine ()
	SelectingText(FALSE)
	Return
EndIf
	; Calendarview processing
	If IsCalendarView ()
	&& !MenusActive ()
	&& !DialogActive ()
	&& !InHJDialog () then
		SelectingText(TRUE)
		SelectNextLine()
		;SayMessage (OT_SCREEN_MESSAGE, FormatString (cmsg215_S, GetTimeInformation ()))
		SelectingText (FALSE)
		Return
	EndIf; End of Calendar.
PerformScript SelectNextLine()
EndScript

Script SelectPriorLine()
var
	String sCalendarValue,
	String sTimeValue

If gbWordIsWindowOwner Then
	PerformScript SelectPriorLine()
	Return
EndIf
If GlobalCurrentControl==ciGridView Then
	Let nSaySelectAfter = FALSE
	SelectingText(TRUE)
	SelectPriorLine ()
	SelectingText(FALSE)
	Return
EndIf
	; Calendarview processing
	If IsCalendarView ()
	&& !MenusActive ()
	&& !DialogActive ()
	&& !InHJDialog () then
		SelectingText(TRUE)
		SelectPriorLine()
		;SayMessage (OT_SCREEN_MESSAGE, FormatString (cmsg215_S, GetTimeInformation ()))
		SelectingText (FALSE)
		Return
	EndIf; End of Calendar.
PerformScript SelectPriorLine()
EndScript

/* End comment in favor of custom fighlight***********/

Script SelectCurrentItem ()
If gbWordIsWindowOwner Then
	PerformScript SelectCurrentItem()
	Return
EndIf
If IsMessagesList()
|| GlobalCurrentControl==Contact_List
|| (GlobalCurrentControl==ciAddressList && GetWindowSubTypeCode(GlobalFocusWindow)==wt_ExtendedSelect_ListBox)
|| GetWindowClass(GlobalFocusWindow)==cscListViewClass Then
	TypeCurrentScriptKey()
	let giLineHasSpoken=TRUE
	Delay(1)
	If (GetCharacterAttributes() & ATTRIB_HIGHLIGHT) Then
		SayFormattedMessage(OT_SELECT,cMsgSelected)
	Else
		SayFormattedMessage(OT_SELECT,cmsgDeSelected)
	EndIf
	SayLine()
	Return
EndIf ; End of messages or contact list.
PerformScript SelectCurrentItem()
EndScript

String Function StringWordCharacterIn (string Str, int Position)
	If Not StringContainsChars (Str, " ") then
		Return (Str)
	EndIf
	While Position > 1 && (! StringIsBlank (SubString (Str, Position, 1)))
		let Position = Position - 1
	EndWhile
	Return (StringSegment (StringChopLeft (Str, Position), cscSpace, 1))
EndFunction

Script SayNextWord ()
var
	string sCharacter,
	String sCategory,
	int iType
If UserBufferIsActive ()
|| gbWordIsWindowOwner Then
	PerformScript SayNextWord()
	Return
EndIf
let iType=GetWindowSubTypeCode(GetFocus())
If IsPcCursor() Then
	; Reads objects as individual characters...
	If iType == WT_READONLYEDIT
	&& (GlobalCurrentControl==From_Field
	|| GlobalCurrentControl==To_Field
	|| (GlobalCurrentControl==CC_Field
	&& GlobalObjectName!=scSubject)
	|| GlobalCurrentControl==Bcc_Field) Then
		let sCharacter=GetCharacter()
		; Bypass the space and semicolon seperators...
		If   sCharacter==scSemiColon Then
			PerformScript SayNextCharacter()
			Return
		EndIf
		If sCharacter!=cscSpace Then
			NextCharacter()
		EndIf
		If GetCharacter()==cscSpace
		&& RetrieveElement (ciCharacter, ciNext)==scSemicolon Then
			NextCharacter()
		EndIf
		PerformScript SayNextCharacter()
		Return
	EndIf
	;to read graphical Email address fields:
	If iType != WT_READONLYEDIT
	&& (GlobalCurrentControl==From_Field
	|| GlobalCurrentControl==To_Field
	|| (GlobalCurrentControl==CC_Field
	&& GlobalObjectName!=scSubject)
	|| GlobalCurrentControl==Bcc_Field) Then
		NextWord()
		;test for graphical Email address in header fields:
		if StringLength(GetCharacter())>2 then
			SayField()
		else
			SayWord()
		endIf
		return
	endIf

	; to announce the category field.
	If iType == WT_READONLYEDIT
	&& GlobalCurrentControl == ID_CategoryField then
		let sCategory = GetLine ()
		While Not StringIsBlank (SubString (sCategory, GlobalIPosition, 1))
			let GlobalIPosition = GlobalIPosition + 1
		EndWhile
		let GlobalIPosition = GlobalIPosition + 2
		If GlobalIPosition > StringLength (sCategory) - 1 then
			NextCharacter ()
			let GlobalIPosition = StringLength (sCategory) - 1
		EndIf
		Say (StringWordCharacterIn (sCategory, GlobalIPosition), OT_SCREEN_MESSAGE)
		Return
	EndIf

	; When viewing the Calendar grid, you want
	; Control+Right to act as the Right arrow when pressed, not Control+Right.
	If IsCalendarView ()
	&& GetWindowSubTypeCode(GetFocus())!=wt_Edit Then
		PerformScript SayNextCharacter()
		Return
	EndIf ; End checking for Calendar view and not edit box.
EndIf

PerformScript SayNextWord()
EndScript

Script SayPriorWord ()
var
	string sCharacter,
	String sCategory,
	int iType
If UserBufferIsActive ()
|| gbWordIsWindowOwner Then
	PerformScript SayPriorWord()
	Return
EndIf
let iType=GetWindowSubTypeCode(GetFocus())
If IsPcCursor() Then
	; Read objects as single characters...
	If iType == WT_READONLYEDIT
	&& (GlobalCurrentControl==From_Field
	|| GlobalCurrentControl==To_Field
 || (GlobalCurrentControl==CC_Field && GlobalObjectName!=scSubject)
	|| GlobalCurrentControl==Bcc_Field) Then
		let sCharacter=GetCharacter()
		; Bypass the space and semicolon seperators...
		If   sCharacter==scSemiColon Then
			PerformScript SayPriorCharacter()
			Return
		EndIf
		If sCharacter!=cscSpace Then
			PriorCharacter()
		EndIf
		If GetCharacter()==cscSpace
		&& RetrieveElement (ciCharacter, ciPrior)==scSemicolon Then
			PriorCharacter()
		EndIf
		PerformScript SayPriorCharacter()
		Return
	EndIf

	;to read graphical Email address fields:
	If iType != WT_READONLYEDIT
	&& (GlobalCurrentControl==From_Field
	|| GlobalCurrentControl==To_Field
	|| (GlobalCurrentControl==CC_Field
	&& GlobalObjectName!=scSubject)
	|| GlobalCurrentControl==Bcc_Field) Then
		PriorWord()
		;test for graphical Email address in header fields:
		if StringLength(GetCharacter())>2 then
			SayField()
		else
			SayWord()
		endIf
		return
	endIf

	; to announce the category field.
	If iType == WT_READONLYEDIT
		&& GlobalCurrentControl == ID_CategoryField then
		let sCategory = GetLine ()
		While Not StringIsBlank (SubString (sCategory, GlobalIPosition, 1))
			let GlobalIPosition = GlobalIPosition - 1
		EndWhile
		let GlobalIPosition = GlobalIPosition - 2
		If GlobalIPosition < 2 then
			PriorCharacter ()
			let GlobalIPosition = 2
		EndIf
		Say (StringWordCharacterIn (sCategory, GlobalIPosition), OT_SCREEN_MESSAGE)
		Return
	EndIf

	; When viewing the Calendar grid, you want
	; Control+Left to act as the Left arrow when pressed, not Control+Left.
	If IsCalendarView ()
	&& GetWindowSubTypeCode(GetFocus())!=wt_Edit Then
		PerformScript SayPriorCharacter()
		Return
	EndIf ; End checking for Calendar view and not edit box.
EndIf
PerformScript SayPriorWord()
EndScript

Script SayMSAAData ()
var
	string sValue
If GlobalCurrentControl==ciGridView
|| (GlobalCurrentControl==ic_AdvancedFindResultList && GlobalRealWindowName==wn_AdvancedFind) Then
	let sValue=GetObjectValue(TRUE)
	If StringLength(sValue)<2 Then
		let sValue=MsgNoItems_L
	EndIf
	If IsSameScript() Then
		SpellString(sValue)
	Else
		Say(sValue,OT_SCREEN_MESSAGE)
	EndIf
Else
	SayFormattedMessage (OT_ERROR, cMsgSayMSAADataError_L)
EndIf
EndScript



; These scripts announce the state of formatting buttons when toggled...

Int Function IsMessageOpenForEditing()
var
	int iType
; If the message is open for reading, To: field is type 43, if for editing, To: field is 66...
let iType=GetWindowSubTypeCode(FindDescendantWindow(GlobalRealWindow,To_Field))
If iType==WT_MULTILINE_EDIT Then
	Return TRUE
EndIf
Return FALSE
EndFunction

Int Function IsMessageOpenForReading ()
var
	int iWindowType,
	Handle hFocus

let hFocus = GetFocus ()
let iWindowType=GetWindowSubTypeCode(FindDescendantWindow(GlobalRealWindow,To_Field))
; If the message is open for reading, To: field is type 43, if for editing, To: field is 66...
If GetWindowClass (hFocus) == WC_WWG
&& GetWindowClass (GetParent (GetParent (hFocus))) == wc_AfxWndA then
	; If the message is reading only no second WwC class window is in place...
	If Not GetNextWindow (GetNextWindow (GetNextWindow (hFocus))) then
		Return (TRUE)
	EndIf
EndIf
Return (FALSE)
EndFunction

void function SpeakSupergridListItemHelper ()
;This helps with the double firing of FocusChangedEventEX functions
;where list items are constantly double firing the event as the user moves once.
var
	handle CurHWnd = getFocus (),
	string sSupergridListItem,
	string sPreviewText
let giLineHasSpoken=TRUE
Let sSuperGridListItem = GetSuperGridListItem (CurHwnd, 0)
;If Outlook_Functions_2013::IsSameMessage () then
	; have to disable top and bottom edge event emulation for Outlook 2013 because of speed reasons.
	;If GetJCFOption (OPT_TOP_AND_BOTTOM_EDGE_ALERT) then
		;If StringContainsChars (GetObjectName (TRUE), cScColon) then
			;TopEdgeEvent (CurHWnd)
		;Else
			;BottomEdgeEvent (CurHWnd)
		;EndIf
	;EndIf
	;Return
;Else
	If StringCompare (GetCurrentScriptKeyName (), cKSControlSpace, FALSE) then
		Say (sSuperGridListItem, OT_SELECTED_ITEM, TRUE)
		; to announce auto preview...
		If Not IsKeyWaiting () then
			If IsAutoPreviewEnabled ()
			&& (! StringContains (GetObjectName (TRUE), cScColon)) then
				let sPreviewText = GetTextInRect (GetWindowLeft (CurHWnd), GetWindowTop (CurHWnd), GetWindowRight (CurHWnd), GetWindowBottom (CurHWnd), ATTRIB_HIGHLIGHT, IgnoreColor, IgnoreColor, TRUE)
				let sPreviewText = stringChopLeft (sPreviewText, StringContains (sPreviewText, cScBufferNewLine))
				Say (sPreviewText, OT_HIGHLIGHTED_SCREEN_TEXT)
			EndIf
		EndIf
	EndIf
;EndIf
endFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId, handle prevHwnd, int prevObjectId, int prevChildId,optional  int nChangeDepth)
;appendToScriptCallStackLog ()
var
	Int iChild,
	Object oCalendar = GetFocusObject (iChild),
	int iObjectType,
	Int iWindowType,
	int iControl,
	Int iOption,
	String sObjectValue,
	String sRealWindowName,
	String sWindowClass,
	string sSuperGridListItem,
	String sPreviewText
unscheduleFunction (giFN_SpeakSupergridListItemHelper)
If InHJDialog()  then
	if gbActiveItemChanged  then ; space was pressed.
		let gbActiveItemChanged=false
		Say(GetObjectName(true),ot_line)
		return
	Else
		ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
		return
	EndIf
EndIf
let gbActiveItemChanged=false
If gbWordIsWindowOwner Then
	ActiveItemChangedEvent (curHwnd,curObjectId,curChildId, prevHwnd,prevObjectId,prevChildId)
	Return
EndIf
let iObjectType=GetObjectSubTypeCode()
let iWindowType = GetWindowSubtypeCode (curHwnd)
let iControl=GetControlID(curHwnd)
let sWindowClass = GetWindowClass (curHwnd)
let sObjectValue = GetObjectValue (TRUE)
; switching views using alt control number keys: day / week / work week / month
; legacyNavigationIsRelevant is for earlier versions of Outlook,
; where checks were necessary if navigation was or was not in progress by keyboard,
; e.g. before modern cell navigation of Outlook
var int calendarNavigationByScripts = ! IsUIACalendarParsingAvailable ()
calendarNavigationByScripts = calendarNavigationByScripts && ! GBLeftRightNavigation
If gbFocusChangedIsCalledOnSameWindow && IsCalendarView() && ! calendarNavigationByScripts then
	If Not iControl then
		CalendarCleanUp ()
		InitializeOutlookObjects ()
	EndIf
	if currentCalendarData then
		say (currentCalendarData, OT_CONTROL_NAME)
		return
	elIf iObjectType == WT_TABLECELL then
		say (getAndCleanUpObjectNameForCalendar (getObjectName (TRUE)), OT_CONTROL_NAME)
		return
	endIf
	var string name 
	; Outlook 2013 and 2016 RTM, where not processed by UIA:
	CalendarStateChangedEvent (curHwnd) ; from outlookCalendar.jss, legacy appointment reading.
	return
endIf
; Save Attachments Dialog:
if sWindowClass == wcReListBox then
	SayMessage (OT_CONTROL_NAME, GetObjectName (TRUE))
	return
endIf
; Message, Contact, Appointments, Tasks, and Notes  list...
If sWindowClass == wc_OutlookGrid
&& IsInOutlookMainWindow (CurHWnd)
	;giFN_SpeakSupergridListItemHelper = scheduleFunction ("SpeakSupergridListItemHelper", 2)
	SpeakSupergridListItemHelper ()
	Return
EndIf
If iControl==ciGridView
&& sWindowClass == wc_OutlookGrid then
	;SayObjectActiveItem ()
	If IsCalendarView () then
		Say (GetTextBetween (GetWindowLeft (CurHWnd), GetWindowRight (CurHWnd)), OT_SCREEN_MESSAGE)
		Return
	EndIf
	SayLine ()
	Return
EndIf
If iControl==ciGridView
|| iControl==ic_AdvancedFindResultList  Then
	let gbMessageHasBeenRead=FALSE
;	If gbFocusHasChanged
;	&& !gbDeletingMessageFromList Then
		let gbFocusHasChanged=FALSE
;		Return
;	EndIf
	If nSelectingText Then
		Return
	EndIf
	If giLineHasSpoken Then
		let giLineHasSpoken=FALSE
		Return
	EndIf
	let GlobalCurrentControl=iControl
	SpeakMessageFlags ()
	If gbIsCalendarAppointmentList
	&& !gbLeftRightNavigation Then
		Say(GetTextBetween(giLeft,giRight),ot_screen_message)
	Else
		let iOption = GetJCFOption (OPT_INCLUDE_GRAPHICS)
		SetJCFOption (OPT_INCLUDE_GRAPHICS, 1)
		SayObjectActiveItem()
		SetJCFOption (OPT_INCLUDE_GRAPHICS, iOption)
	EndIf
	Return
EndIf

If iObjectType == WT_LISTBOXItem
|| GetWindowSubTypeCode(curHwnd)==wt_ListBox Then
	If GlobalCurrentControl   == RuleDescriptionListBox Then
		Return
	EndIf ; End of Rules Wizard
	if sWindowClass == wc_OutlookGrid && iControl == app_AllAttendeesList then
		Say (getObjectName (TRUE), OT_CONTROL_NAME)
	endIf
EndIf ; End of listbox

; for announcing the full names in the select names dialogue...
If (StringContains (sRealWindowName, WN_SelectNames)
	|| StringContains (sRealWindowName, wn_AddressBook))
	&& iControl == ciAddressList then
	Return
EndIf
If IsCalendarView()	; focus is in the calendar view...
	If iObjectType == WT_LISTBOXITEM
		; New calendar handling...
		If (! inRibbons())
		&& (! IsCalendarViewAppointmentEditBox ())
		&& sWindowClass != wc_OutlookGrid
			If iChild == oCalendar.accChildCount
				Return (CalendarStateChangedEvent (curHwnd))
			EndIf
		EndIf
	EndIf
	; handle the calendar selection in the calendar treeview...
	If GetWindowClass (curHWnd) == wc_NetUIHWND	; Calendar pane is not focused, we are in navigation pane...
	&& iObjectType == WT_TREEVIEWITEM
	&&	GetObjectSubTypeCode (FALSE, 2) == WT_TREEVIEW
		If GetTreeViewSelectedStateFromUIA () then
			IndicateControlState (WT_TREEVIEW, CTRL_CHECKED)
		Else
			IndicateControlState (WT_TREEVIEW, CTRL_UNCHECKED)
		EndIf
		Say (GetObjectName (TRUE), OT_CONTROL_NAME)
		Return
	ElIf iObjectType == WT_TREEVIEWITEM
	|| iObjectType == WT_TREEVIEW
	&& nChangeDepth < 0
	&& (dialogActive () && ! inHjDialog ()) then
		Return (sayTreeViewLevel (TRUE))
	EndIf
EndIf
; Call default...
ActiveItemChangedEvent (curHwnd,curObjectId,curChildId, prevHwnd,prevObjectId,prevChildId)
EndFunction

Int Function SpeakMessageFlags ()
var
	int iMSAAState,
	int iHasFlag,
	string sFlagStatus,
	string sImportance,
	string sMeetingStatus,
	string sMessageStatus,
	string sValue,
	string sName
let iMSAAState=GetJcfOption(OPT_MSAA_MODE)
;Now, prevent 3 from being the option you use:
;Prevents "Raw" or straight MSAA data from being output,
;and ensures we have proper refresh to Braille display.
If iMSAAState == 3 then
	Let iMSAAState = 0
	SetJcfOption (OPT_MSAA_MODE, iMSAAState)
EndIf
let sName=cscNull
let sValue=cscNull
let giValueStringLength=False
let giHasUnreadFlag=FALSE
let giHasRepliedFlag=FALSE
let giHasForwardedFlag=FALSE
let giHasFollowUpFlag=FALSE
let giHasMessageStatusFlag=FALSE
let giHasAttachmentFlag=FALSE
let giHasImportanceFlag=FALSE
let giHasMeetingRequestFlag=FALSE
SetJcfOption(OPT_MSAA_MODE,ciTwo)
let sName=GetObjectName(TRUE)
let sValue=GetObjectValue(TRUE)
SetJcfOption(OPT_MSAA_MODE,iMSAAState)

let gsBrlName=sName
let gsBrlValue=sValue
let giValueStringLength=StringLength(sValue)
If giValueStringLength<ciThree Then
	let gsBrlName=cscNull
	let gsBrlValue=cscNull
	let gsBrlAppointmentText=MsgBrlEmpty
EndIf

If GlobalCurrentControl!=ciGridView Then
	Return FALSE
EndIf
If (GetCharacterAttributes()&ATTRIB_BOLD)
&& !StringContains(sName,scGroupBy) Then
	If giOutlookMessageStatusVerbosity Then
		SayUsingVoice(VCTX_MESSAGE,scUnread,OT_SCREEN_MESSAGE)
	EndIf
	let giHasUnreadFlag=TRUE
Else ; No unread flag
	let giHasUnreadFlag=FALSE
EndIf
; Meeting request flag
;If StringContains(sName,scMeeting) Then
If StringStartsWith (sValue, scMeeting) Then
	If giOutlookMeetingRequestVerbosity Then
		let sMeetingStatus=StringChopRight(sName,StringLength(StringSegment(sName,cscSpace,-1)))
		SayUsingVoice(VCTX_MESSAGE,sMeetingStatus,OT_SCREEN_MESSAGE)
	EndIf
	let giHasMeetingRequestFlag=TRUE
Else ; No Meeting flag
	let giHasMeetingRequestFlag=FALSE
EndIf
; Forwarded flag
If StringContains(sName,scForwardFlag) Then
	If giOutlookForwardedFlagVerbosity Then
		SayUsingVoice(VCTX_MESSAGE,scForwardFlag,OT_SCREEN_MESSAGE)
	EndIf
	let giHasForwardedFlag=TRUE
Else ; No Forwarded flag
	let giHasForwardedFlag=FALSE
EndIf
; Replied flag
If StringContains(sName,scRepliedFlag) Then
	If giOutlookRepliedFlagVerbosity Then
		SayUsingVoice(VCTX_MESSAGE,scRepliedFlag,OT_SCREEN_MESSAGE)
	EndIf
	let giHasRepliedFlag=TRUE
Else ; No Replied flag
	let giHasRepliedFlag=FALSE
EndIf
;; FollowUp flag
;If StringContains(sName,scFollowUpFlag) Then
;	If giOutlookFollowUpFlagVerbosity Then
;		SayUsingVoice(VCTX_MESSAGE,scFollowUpFlag,OT_SCREEN_MESSAGE)
;	EndIf
;	let giHasFollowUpFlag=TRUE
;Else ; No FollowUp flag
;	let giHasFollowUpFlag=FALSE
;EndIf
; Attachments
If StringContains(sValue,scAttachmentYes) Then
	If giOutlookAttachmentsVerbosity Then
		SayUsingVoice(VCTX_MESSAGE,scAttachment,OT_SCREEN_MESSAGE)
	EndIf
	let giHasAttachmentFlag=TRUE
Else ; No Attachment flag
	let giHasAttachmentFlag=FALSE
EndIf
; Message status flags
let sFlagStatus=StringSegment (sValue, scComma, StringSegmentIndex (sValue, scComma, scFlagStatus, FALSE))
If StringContains(sName,scMessageItem) Then
	let sMessageStatus=StringReplaceSubstrings (sName, scUnreadFlag, cscNull)
	let sMessageStatus=StringReplaceSubstrings (sMessageStatus, scReadFlag, cscNull)
	let sMessageStatus=StringReplaceSubstrings (sMessageStatus,scMessageItem, cscNull)
	let sMessageStatus=StringReplaceSubstrings (sMessageStatus,scRepliedFlag, cscNull)
	let sMessageStatus=StringReplaceSubstrings (sMessageStatus,scForwardFlag, cscNull)
	let sMessageStatus=StringTrimTrailingBlanks(StringTrimLeadingBlanks (sMessageStatus))
Else
	let sMessageStatus=cscNull
EndIf
let sImportance=StringSegment (sValue, scComma, StringSegmentIndex (sValue, scComma, scImportanceFlag, FALSE))
If !StringContains(sFlagStatus,scUnflagged)
&& !StringContains(sFlagStatus,scNormal) Then
	let iHasFlag=TRUE
	let sFlagStatus=StringChopLeft(sFlagStatus,StringLength(scFlag)+1)
EndIf
If iHasFlag Then
	let sMessageStatus=sMessageStatus+cscSpace+sFlagStatus
EndIf
If giOutlookMessageFlagVerbosity Then
	SayUsingVoice(VCTX_MESSAGE,sMessageStatus,OT_SCREEN_MESSAGE)
EndIf
If StringLength(sMessageStatus)>ciThree Then
	let giHasMessageStatusFlag=TRUE
Else ; No Message flag
	let giHasMessageStatusFlag=FALSE
EndIf ; End of message status.
; Importance flag
If !StringContains(sImportance,scNormal) Then
	If giOutlookMessageFlagVerbosity Then
		SayUsingVoice(VCTX_MESSAGE,sImportance,OT_SCREEN_MESSAGE)
	EndIf
	let giHasImportanceFlag=TRUE
Else ; No  flag
	let giHasImportanceFlag=FALSE
EndIf ; End of flag status
Return TRUE
EndFunction

Void Function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hFocus = GetFocus (),
	int iControl = GetControlID (hFocus),
	int iWindowType = GetWindowSubTypeCode (hFocus),
	string sClass = GetWindowClass (hFocus)
if sClass == wc_Rctrl_RenWnd32
&& GetObjectSubtypeCode (FALSE, nLevel) == WT_TABLECELL then
; new date picker and other controls where table cell is name and value together, but outside of a message.
	var string compare = GetObjectName (TRUE, nLevel)
	if compare == getObjectValue (TRUE, nLevel) then
		return say (compare, OT_CONTROL_NAME)
	endIf
endIf
If gbWordIsWindowOwner Then
	SayObjectTypeAndText(nLevel,includeContainerName)
	Return
elIf isCalendarView () && GetObjectSubTypeCode () == WT_TABLECELL then
	if currentCalendarData then
		say (currentCalendarData, OT_CONTROL_NAME)
		return
	endIf
	var string name = getAndCleanUpObjectNameForCalendar ()
	if ! stringIsBlank (name) then
		sayMessage (OT_CONTROL_NAME, name)
		return
	endIf
elIf getWindowCategory () == WCAT_SDM then
	return SDMSayWindowTypeAndText (hFocus, sdmGetCurrentControl ())
ElIf ! nLevel && GetObjectSubTypeCode () == WT_MENU then
; There are some "submenus" or drop down items that don't have a direct name, but will use the parent.
; Sort item under the View tab.
	if StringIsBlank (GetObjectName (TRUE)) then
		IndicateControlType (WT_MENU, GetObjectName (TRUE, 1))
		return
	EndIf
EndIf
If iControl == sent_Field && iWindowType == WT_READONLYEDIT then
; control has no name, but prior window is static, so richedit specific function  doesn't pcik this one up.
; the following var list are all empties just placeholders for the param list for SayControlEXWithMarkup:
	var string ControlType, string ControlState, string ContainerName, string ContainerType
	SayControlEXWithMarkup (hFocus, scSentField, ControlType, ControlState, ContainerName, ContainerType,
		GetWindowText (hFocus, READ_EVERYTHING) 
	)
	return
endIf
If IsCalendarViewAppointmentEditBox () Then
	Return
EndIf
if sClass == wcReListBox then
	SayControlEXWithMarkup (hFocus, "", "", "", "", "", GetObjectName (TRUE))
	return
endIf
if iControl==Contact_List
&& GetFolderType () == 2	; contacts list...
	IndicateControlType(wt_ListBox,GetWindowName(hFocus),cscSpace)
	Say(GetContactsListFocusItemData(),ot_line)
	Return
EndIf
If iControl==ciContactAddressField
&& GlobalObjectName==wn_ContactAddressField Then
	IndicateControlType(iWindowType,wn_ContactAddressField,cscSpace)
	SayLine()
	Return
EndIf
; The CC field label is incorrectly labeled "Sent:" sometimes...
If  iControl==CC_Field
&& iWindowType==wt_Multiline_Edit
&& TypeOfWindow()==Message_Window Then
	IndicateControlType(iWindowType,scCCField2,GetWindowTextEx(hFocus,FALSE,TRUE))
	Return
EndIf
; This Address book combo box gives incorrect MSAA data...
If iWindowType==wt_ComboBox
&& iControl==ciNewAddressEntry
&& GlobalRealWindowName==wn_NewEntry Then
	IndicateControlType(iWindowType,GetWindowName(hFocus),GetWindowTextEx(hFocus,TRUE,TRUE))
	Say(PositionInGroup (),OT_POSITION)
	Return
EndIf
If (!StringContains(GlobalObjectName,wn_Appointment)
&& !StringContains(sClass,scCalendarClass)) Then
	if (!GetCalendarView()
	&& !IsCalendarViewAppointmentEditBox()
	&& !giInAppointmentField)
	&& iControl==Contact_List
	&& !GlobalMenuMode
	&&  iWindowType !=wt_Button
	&& !UserBufferIsActive() then
		IndicateControlType(wt_ListBox,GetWindowName(GlobalFocusWindow),GetWindowTextEx(GlobalFocusWindow,TRUE,TRUE))
		return
	EndIf
EndIf
If GetWindowIDString (GetRealWindow (hFocus)) == SignaturesStringID	; signatures dialogue...
	IndicateControlType (GetObjectSubTypeCode (), GetObjectName (TRUE), GetObjectValue (TRUE))
	Return
EndIf
If getWindowCategory (hFocus) == WCAT_SDM
	; we are in SDM window
	If iWindowType == WT_TABCONTROL
		IndicateControlType (iWindowType, SDMGetControlName (hFocus, SDMGetFocus (hFocus)), cScSpace)
		Return
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

Int Function GotoFoundItems ()
var
	handle RealWnd,
	handle hWnd
let RealWnd = GetRealWindow(GetFocus())
if ! StringContains(GetWindowName(RealWnd) ,wn_AdvancedFind) then
	return icNotInAdvancedFind
else
	let hWnd=FindWindowWithClassAndID(GlobalRealWindow,wc_OutlookGrid,ic_AdvancedFindResultList)
	If !hWnd Then
		return icNoFoundItemsList
	else ; Move focus to the Found Items list
		SetFocus(hWnd)
		return icFoundItemsList
	EndIf
EndIf
EndFunction

Script GetAttendeesStatus ()
var
	handle hWnd = getFocus (),
	string sStatus,
	string sDialog,
	string Delimiter
let sDialog=TypeOfItem(giIsMessage,giIsTask)
If sDialog!=scMeetingItem
&& sDialog!=scAppointmentsItem Then
	; Not in the Appointment scheduling dialog
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	Return
EndIf
hwnd = getLastWindow (hWnd)
while (hWnd && getWindowClass (hwnd) != WC_CalendarPane)
	hWnd = getPriorWindow (hWnd)
endWhile
;Only moving the invisible cursor here to get an Object Name, text on screen would not be reliable:
;We only do this because neither UIA nor MSAA functions direct from here will get the objects,
;nor will getObjectAtPoint return anything we can use.
;internal getObjectName must be using a method inaccessible to the scripts.
saveCursor ()
invisibleCursor ()
SaveCursor ()
MoveToWindow (hWnd)
gsObjValue = getObjectName (TRUE)
restoreCursor ()
restoreCursor ()
if ! stringContains (gsObjValue, scAllAttendeesStatus) then
	Say(msgAttendeesStatusNotFound,OT_ERROR)
	Return
EndIf
; We need to put everyone's items on separate lines:
;The delimiter here is a semicolon followed by a single space, or more rarely a comma followed by a space.
if stringContains (gsObjValue, "; ") Delimiter = "; "
elIf stringContains (gsObjValue, ", ") delimiter = ", "
;elIf stringContains (gsObjValue, SomeOtherSeparator) Delimiter = SomeOtherSeparator
endIf
gsObjValue = stringReplaceSubStrings (gsObjValue, Delimiter, cscBufferNewLine)
let sStatus=msgAttendeesStatusTitle+scDoubleBlankLines+gsObjValue+scDoubleBlankLines+msgPressEscapeToClose
UserBufferClear()
SayMessage(OT_USER_BUFFER,sStatus)
EndScript

Script ContactFieldsDialog ()
var
	int index,
	int iControl,
	string strScreenName,
	string strFieldNames, ;temp buffer to hold the current screen field names
	string strFieldCids, ; current screen field control ID's
	string strFieldHandles, ;holds the handles
	string strFieldNameChosen, ;holds the chosen field name
	handle hndRealWindow, ;saves the real window with focus
	string strRealWindowName, ;saves the real window name
	handle hndAppWindowTemp, ;saves the app window handle
	handle hnd,
	handle ChildHnd,
	handle tempHnd,
	handle hFocus, ; the window with focus
	int Group1safety ; to avoid runaway loops
if ! getRunningFSProducts () & product_JAWS then
	return
endIf
let hnd = GetFocus ()
; if the Contact dialog is not active, then pass the keystroke through to Outlook as it may be an access key for a control
; in a dialog, such as the Move to Link button in the Links List dialog (displayed when reading an html mesage).
; previously, JAWS spoke a message advising the user the keystroke was not available outside of the Contact dialog
; and did not allow the keystroke to make it to the app.
if StringContains (GetWindowName (GetRealWindow (hnd)), scContacts) == 0 then
	TypeCurrentScriptKey ();alt+m
	return
EndIf
; move to the first window on this level.
Let tempHnd = GetFirstWindow (hnd)
let hnd = tempHnd
let group1safety = 0
While (hnd
&& Group1safety < 200)
	;loop through the windows
	if !IsWindowDisabled (hnd)
	&& !IsWindowObscured (hnd)
	&& GetWindowName (hnd) != cscNull then
		If GetWindowSubtypeCode (hnd) == WT_EDIT then
			Let strFieldNames  =strFieldNames + GetWindowName (hnd) + cscSpace + GetWindowText (hnd, 0) + ListItemSeparator   ;field names
			let strFieldHandles = strFieldHandles + IntToString (hnd) + ListItemSeparator	;save the handle
		EndIf ;edit
	EndIf ;window not disabled
	let hnd = GetNextWindow (hnd)
	let Group1safety = Group1safety + 1
EndWhile ;loops through all windows in group1
;to find the message window as well, need to search for the grandparent of GetFocus
;as the current window handle, hnd, is invalid for this window:
let hFocus=GetFocus()
if GetWindowClass(GetParent(GetParent(hFocus)))==wc_AFXWnd then
	Let strFieldNames  =strFieldNames + globalRealWindowName + cscSpace + ListItemSeparator   ;field names
	let strFieldHandles = strFieldHandles + IntToString (hFocus) + ListItemSeparator	;save the handle
endIf
;before we pop up the dialog, save the app and real windows
let hndRealWindow = GlobalPrevReal
let strRealWindowName = GlobalPrevRealName
let hndAppWindowTemp = GlobalPrevApp
Let index = dlgSelectItemInList(strFieldNames, "JAWS ",False) ;do not sort
;now set app and real to stop speaking by FocusChangedEvent
let GlobalPrevReal = hndRealWindow
let GlobalPrevRealName = strRealWindowName
let GlobalPrevApp = hndAppWindowTemp
If index == 0 then
	Return; cancelled
EndIf ;cancelled
let strFieldNameChosen = StringSegment (strFieldNames,LIST_ITEM_SEPARATOR, index)
Let hnd = StringToHandle(StringSegment (strFieldHandles,LIST_ITEM_SEPARATOR, index)) ;extract the handle from the list
MoveToFieldUsingHandle (hnd, strFieldNameChosen)
EndScript

Script GotoFoundItemsScript()
var
	int iResult
let iResult = GotoFoundItems()
if iResult == icNoFoundItemsList then
	SayMessage(OT_ERROR,msgMustPerformFind_L,msgMustPerformFind_S)
ElIf iResult == icNotInAdvancedFind then
	SayMessage(OT_ERROR,msgNotInAdvancedFind_L,msgNotInAdvancedFind_S)
EndIf
EndScript

Int Function CheckForNoMoreItems (int iOtToSpeak)
var
	string sWinName,
	string sObjName;
let sWinName = GetWindowName (FindWindow (getRealWindow (getFocus ()), cwc_StatusBar32))
let sObjName = getObjectName (TRUE)
;For localizers: string scFolderLoading in Outlook2007.jsm refers to this spot:
;You must remove comment mark on next code line so you can get the name,
;as this name flashes and goes away.
;Safest way to get this is go from a folder with items into Inbox with no items, and do it with an accellerator,
;English is CTRL+Shift+i,
;Then paste the string into the constant scFolderLoading
;copyToClipboard (sObjName)
If sWinName==wn_ZeroItems
|| StringIsBlank (sObjName)
;|| StringIsBlank (GetObjectValue (TRUE))
;|| GetWindowName(ghStatusBar) == wn_ZeroItems
|| StringIsBlank (smmStripMarkup (GetSuperGridListItem(GetFocus())))
|| stringCompare (sObjName, scFolderLoading) == 0 then
	;Say(sWinName,ot_screen_message)
	;Speak literal string because of sObjName / Loading ... string which disappears:
	;Also using Position as '0 items' is by definition spoken as position info in lists elsewhere.
	say (wn_ZeroItems, iOtToSpeak)
	Return TRUE
EndIf
Return FALSE
EndFunction

Void Function ProcessBoundaryStrike (handle hWnd, int iEdge)
var
	int iType,
	string sClass,
	int bJAWSActive = getRunningFSProducts () & product_JAWS
If gbWordIsWindowOwner Then
	ProcessBoundaryStrike(hWnd,iEdge)
	Return
EndIf
if lvIsCustomized(hWnd)
&& bJAWSActive then
	Beep ()
	return
endIf
Let iType = GetWindowSubTypeCode(hWnd)
let sClass=GetWindowClass(GetFocus())
If !iType Then
	let iType=GetObjectSubTypeCode()
EndIf
If StringContains(sClass,scOUTEXVLB)
|| (StringContains(sClass,wc_OutlookGrid)
&& GlobalCurrentControl==app_AllAttendeesList) Then
	Return
EndIf
if !iType
&& IsVirtualPCCursor()
&& bJAWSActive Then
;&& !BrailleInUse () then
	Beep()
	return
EndIf
if iType == wt_MultiLine_edit
&& !UsingEnhancedEditSupport(hWnd) Then
	If GlobalCurrentControl!=Message_Window_ID Then
		SayLine()
	EndIf
	Return
EndIf
if iType == wt_MultiLine_edit
|| iType == WT_MULTISELECT_LISTBOX
|| iType == WT_EXTENDEDSELECT_LISTBOX
|| iType == WT_LISTBOX
|| iType == WT_LISTVIEW
|| iType == WT_BUTTONLISTBOX
|| iType == wt_TreeView
|| iType == wt_TreeViewItem then
	If GlobalCurrentControl!=ciGridView Then
		SayLine()
	EndIf
	If GlobalCurrentControl!=ciRulesList && bJAWSActive Then
		Beep ()
	EndIf
	Return
endIf
EndFunction

String Function GetObjectNameOrValue (int iProperty,optional  int iSuppressState)
var
	int iState,
	string sItem
If iProperty Then ; Name wanted...
	; In many cases, the object name will have the state of "Not selected" prefixed
	; this gets rid of that prefix.
	If iSuppressState Then
		let iState=GetJcfOption(opt_indicate_selected)
		SetJcfOption(opt_indicate_selected,0)
	EndIf
	let sItem=GetObjectName(TRUE)
	If iSuppressState Then
		SetJcfOption(opt_indicate_selected,iState)
	EndIf
Else
	let sItem=GetObjectValue(TRUE)
EndIf
Return sItem
EndFunction

Script SelectAll ()
var
	handle hWnd
If gbWordIsWindowOwner Then
	PerformScript SelectAll()
	Return
EndIf
let hWnd = GetCurrentWindow ()
; This is needed because we no longer allow SayHighlightedText to call within listbox...
if GetWindowSubtypeCode(hWnd) == wt_ListBox then
	SelectEntireDocument()
	; the OutlookGrid and SUPERGRID windows don't expose selection properly,
	; and JAWS was incorrectly saying that nothing was selected.
	Return
EndIf
PerformScript SelectAll()
EndScript

Void Function DescriptionChangedEvent (handle hwnd, int objId, int childId, int nObjType,
	string sOldDescription, string sNewDescription,optional int bFromFocusObject)
Var
	String sItemData

If iDescriptionChangedEventSuppress
	iDescriptionChangedEventSuppress = FALSE
	Return
EndIf
If GetWindowClass(hwnd) == cwc_NetUIHwnd
	If GetFolderType () == 2	; contacts list...
	&& getControlID (GetFocus ())  == Contact_List	; for when focus changes from another folder, keeping this from repeating.
		;While this function fires fewer times than the ValueChangedEvent for navigating in Contacts,
		;it still fires multiple times, which is why the extra filtering.
		;Hopefully this filters down to a single instance per navigation.
		sItemData = GetContactsListFocusItemData ()
		If StringContains (sItemData, sNewDescription)
			Say(sItemData,ot_line)
			Return
		EndIf
	EndIf
EndIf
DescriptionChangedEvent (hwnd, objId, childId, nObjType, sOldDescription, sNewDescription,bFromFocusObject)
EndFunction

int function UIAHelperForEditableMessage (handle hWnd)
var
	object treewalker, object element,
	int PropertyID, ; for PropertyChangedEvent
	int ControlID = getControlID (hwnd),
	string AutomationID,
	string WindowClass = GetWindowClass (hwnd)
if WindowClass != cwc_RichEdit20WPT then return 0 endIf
if ControlID != TO_FIELD && ControlID != CC_Field && ControlID != BCC_Field then G_OutlookStructureChange = null () return endIf
if !g_UIA
	g_UIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
endIf
var object condition = g_UIA.CreateStringPropertyCondition( UIA_ClassNamePropertyId, "NetUIToolWindow");
Treewalker = CreateUIATreeWalkerForFocusProcessId (Condition)
if ! treewalker then return 0 EndIf
while (Treewalker.GoToFirstChild())
endWhile
element = Treewalker.CurrentElement
if ! element then return 0 endIf
hwnd = Element.nativeWindowHandle
var string Text = getWindowText (hwnd, READ_EVERYTHING)
if stringIsBlank (text) then return 0 endIf
if ! StringContains (text, ">") && ! StringContains (text, ";") then return endIf
if StringContains (text, ";") then
; Ensure we're getting the first item in the list, since autocomplete affects the first entry.
; This is because we're not getting the child and so are having to carve the text.
	;text = StringSegment (text, ";", StringSegmentCount (text, ";")-1)+";"
	text = StringSegment (text, ";", 1)+";"
else
	text = StringSegment (text, ">", 1)
endIf
let gbIsAddressAutoCompleteListVisible=TRUE
if StringTrimTrailingBlanks (Text) != StringTrimTrailingBlanks (GetLine ()) then
;Prevents Braille from duplicating as Autocomplete when you type and then press enter.
; doesn't affect pressing tab or when you're typing.
	let giHasAddressAutoComplete=TRUE
	let gsBrlAutoComplete = text
	BrailleRefresh ()
endIf
If giOutlookAutoCompleteVerbosity Then
	Say (text, ot_line)
	Return TRUE
EndIf ; End of AutoComplete verbosity.
endFunction

int function AutoCompleteValueAlreadySpokenByMouseEcho(string value)
if !HasMouseEchoRecentlySpokenUsingUIA() return false endIf
var handle hFocus = GetFocus()
if GetWindowClass(hFocus) != cwc_RichEdit20WPT return false endIf
var object element = GetMostRecentMouseSpeechUIAElement()
if !element return false endIf
;Traversing with a treewalker to the parent element to see if this is an autocomplete causes the item to become chosen,
;so we cannot test the parent element to see if this is an autocomplete text element.
;Instead, we do the following:
if element.controlType != UIA_TextControlTypeId
|| element.className != uiaClass_NetUILabel
|| !element.GetPropertyValue(UIA_IsScrollItemPatternAvailablePropertyId)
|| element.GetLegacyIAccessiblePattern().role != ROLE_SYSTEM_STATICTEXT
	return false
endIf
var int x, int y
GetMostRecentMouseSpeechCoordinates(x,y)
var handle hElement = GetWindowAtPoint(x,y)
var handle hElementGrandParent = GetParent(GetParent(hElement))
if hElementGrandParent != GetTopLevelWindow(hFocus)
|| GetWindowClass(hElementGrandParent) != wc_Rctrl_RenWnd32
	return false
endIf
return element.name == value
EndFunction

void function IndicateHeaderFieldAutoCompleteItemFromCollection ()
; copy from valueChangedEvent where focus is on the header fields and the Autocomplete item is coming from the listbox:
var string text = globalAddressFieldsValueChangeCollection.text
gsBrlAutoComplete=text
BrailleRefresh ()
If giOutlookAutoCompleteVerbosity Then
	Say(text,ot_line)
	Return
EndIf ; End of AutoComplete verbosity.
endFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int bIsFocusObject)
var
	handle hFocus = GetFocus (),
	String sFocusClass = GetWindowClass (hFocus),
	String sClass = GetWindowClass (hWnd),
	String sInfoBar,
	Int iControlID = GetControlID (hWnd),
	int iFocusControlID = GetControlID (hFocus),
	Int iWindowType = GetWindowSubtypeCode (hWnd),
	Int iChildID
;ensure only proper handling of HJ Dialogs, prevent speaking of window's text for description.
if (inHjDialog ())
	return ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue, bIsFocusObject)
endIf
if (inRibbons()
&& sFocusClass!=wc_richEdit60W) then; does not capture edit combos off the ribbons and allows ValueChangedEvent to continue for such controls.
	return ; prevent double-speaking or speaking read-only edit window in HJ dialogs.
EndIf
if gbWordIsWindowOwner Then
	ValueChangedEvent (hwnd,objId, childId,nObjType,sObjName,sObjValue,bIsFocusObject)
	Return
EndIf
if bIsFocusObject && nObjType == WT_EDITCOMBO && sFocusClass == wc_ReComboBox20W then
; edit combos such as the location field in meetings and appointments.
	say (sObjValue, OT_LINE)
	return
endIf
if ! globalAddressFieldsValueChangeCollection then
; controllerFor property was found, killed collection and will not be using valueChangedEvent for these fieleds:
	if iFocusControlID == To_Field
	|| iFocusControlID == CC_Field
	|| iFocusControlID == Bcc_Field
	; Meeting request dialogue to field...
	|| iFocusControlID == app_toField
	; task request dialogue to field...
	|| iFocusControlID == ID_TaskToField Then
		return
	endIf
endIf
; next global variables unset for classic functionality for autocomplete lists.
let gbIsAddressAutoCompleteListVisible=FALSE
let giHasAddressAutoComplete=FALSE
let gsBrlAutoComplete=cscNull
If sClass ==wcReListBox Then
	; Address list when entering addresses..
	If iControlID == To_Field
	|| iFocusControlID == To_Field
	|| iControlID == CC_Field
	|| iFocusControlID == CC_Field
	|| iControlID == Bcc_Field
	|| iFocusControlID == Bcc_Field
	; Meeting request dialogue to field...
	|| iControlID == app_toField
	|| iFocusControlID == app_toField
	; task request dialogue to field...
	|| iControlID == ID_TaskToField
	|| iFocusControlID == ID_TaskToField Then
		let giHasAddressAutoComplete=TRUE
		let gbIsAddressAutoCompleteListVisible=TRUE
		; first schedule this call if first use,
		; checking to verify that the controllerFor property is not in use, and only scheduling the first time to avoid latency:
		if ! globalAddressFieldsValueChangeCollection.hasRunBefore then
			globalAddressFieldsValueChangeCollection.hasRunBefore = TRUE
			globalAddressFieldsValueChangeCollection.text = sObjName
			var int timerID = scheduleFunction ("IndicateHeaderFieldAutoCompleteItemFromCollection", 1)
			globalAddressFieldsValueChangeCollection.timerID = timerID
			return ; either schedule will speak, or PropertyChangedEvent -> controllerFor will unschedule.
		endIf
		let gsBrlAutoComplete=sObjName
		BrailleRefresh ()
		If giOutlookAutoCompleteVerbosity Then
			Say(sObjName,ot_line)
			Return
		EndIf ; End of AutoComplete verbosity.
	EndIf ; End of Address fields.
EndIf ; End of ReListBox check.
If sObjName==wn_FontList
&& nObjType==wt_EditCombo Then
	Return
EndIf
If GlobalWindowClass==wc_ReComboBox20W
&& nObjType == WT_EditCombo then
	Return
EndIf
; handling of default colour in the calendar options dialogue and Tasks options dialogue...
If GetWindowSubtypeCode (GetParent (GetParent (hWnd))) == WT_DIALOG
&& (iControlID == ID_DefaultColour
|| iControlID == ID_OverdueTaskColour
|| iControlID == ID_CompletedTaskColour)
&& iWindowType == WT_COMBOBOX
&& StringIsBlank (GetWindowTextEx (hWnd, FALSE, FALSE)) then
	Say (GetColorName (GetMSAAColourAtComboBox ()), OT_SELECTED_ITEM)
	Return
EndIf
If StringContains(GlobalAppWindowName,wn_CustomizeView)
|| StringContains(GlobalAppWindowName,wn_Options)
|| GlobalRealWindowName==wn_MessageOptions
|| GlobalWindowClass==wc_ReComboBox20W
&& nObjType == WT_COMBOBOX then
	Say(sObjValue,ot_line)
	Return
EndIf
If (sObjName==scShowNames
&& nObjType == WT_COMBOBOX) then
	Return
EndIf
If (nObjType==wt_ComboBox
&& iControlID ==ciNewAddressEntry
&& GlobalRealWindowName==wn_NewEntry) Then
	Say(GetWindowTextEx(GlobalFocusWindow,TRUE,TRUE),OT_SCREEN_MESSAGE)
	Return
EndIf
If StringContains(GlobalAppWindowName,wn_CustomizeView)
||   GlobalRealWindowName==wn_AdvancedFind
&& sObjName==wn_SearchForTheWord Then
	Say(sObjValue,ot_line)
EndIf
If GlobalObjectName==wn_FileAs Then
	Say(sObjValue,ot_line)
	Return
EndIf
; To avoid doublespeaking in the reminder list in new appointment dialogue.
; should rewrite the code to announce the elements and remove announcement from the SayNextLine and SayPriorLine scripts.
If sClass == wc_NetUIHWND
&& GlobalWindowClass == wc_RichEdit20W
&& sObjName == wn_ReminderWindow
&& iControlID == 1 then
	Return
EndIf
; For contact list:
If GetFolderType () == 2 ; contacts list...
&& GetWindowClass(GetTopLevelWindow(hWnd)) == wc_Rctrl_RenWnd32 then
	;Many value change events fire for each navigation change in Contacts,
	;which makes this difficult to manage and get desirable speech output.
	;See DescriptionChangedEvent for handling of navigation in Contacts.
	Return
EndIf
; Manage views dialogue...
If sFocusClass == wc_OutlookGrid
&& sClass == cwc_RichEdit20WPT
&& iFocusControlID == ID_ManageAllViewsListbox
&& iControlID == ID_ManageAllViewsEditBox then
	Say (GetSuperGridListItem (hFocus, 0), OT_SELECTED_ITEM)
	say (positionInGroup (), OT_POSITION)
	Return
EndIf
; To announce the Outlook 2013 specific autofinish strings...
If giOutlookAutoCompleteVerbosity
	If StringIsBlank (sObjValue)
	&& (! StringIsBlank (sObjName))
	&& (sFocusClass == cwc_RichEdit20WPT || sFocusClass == cwc_button)
	&& sClass == wc_NetUIHWND
	&& !AutoCompleteValueAlreadySpokenByMouseEcho(sObjName)
		gbIsAddressAutoCompleteListVisible = TRUE
		Say (sObjName, OT_SELECTED_ITEM)
		gsBrlAutoComplete = sObjName
		giHasAddressAutoComplete = TRUE
		BrailleRefresh ()
		Return
	Else
		giHasAddressAutoComplete = FALSE
	EndIf
EndIf
If giOutlookInfoBarVerbosity
	If sClass == cwc_RichEdit20WPT
	&& IsWindowVisible (ghOutlookInfoBar)
		sInfoBar = GetObjectFromEvent (ghOutlookInfoBar, OBJID_CLIENT, 0, iChildID).accValue (0)
		If StringCompare (gsInfoBarContents, sInfoBar, TRUE)
			Say (sInfoBar, OT_SCREEN_MESSAGE)
			gsInfoBarContents = sInfoBar
		EndIf
	EndIf
EndIf
; reminder time in new task creation dialogue.
If iFocusControlID == iDSpinBox
&& sFocusClass == cwc_RichEdit20WPT
&& iWindowType == WT_EDIT
&& StringIsBlank (sObjValue)
	Delay (1)
	Say (GetWindowTextEx (hFocus, FALSE, FALSE), OT_SCREEN_MESSAGE)
	Return
EndIf
; Call default...
ValueChangedEvent (hwnd,objId, childId,nObjType,sObjName,sObjValue,bIsFocusObject)
EndFunction

void function ObjStateChangedEvent(handle hObj, int iObjType, int nChangedState, int nState, int nOldState)
If gbWordIsWindowOwner Then
	ObjStateChangedEvent(hObj,iObjType,nChangedState,nState,nOldState)
	Return
EndIf
If GlobalRealWindowName==wn_TrustCenter
&& iObjType==wt_ListBoxItem Then
	Return
EndIf

If GetWindowClass(hObj)==wc_BosaSDMDlg
&& StringContains(GlobalRealWindowName,wn_Customize) Then
	Return
EndIf

; to announce the open/close state of the folder on opening or closing it in navigation pane treeview...
; These are not standard treeviews in Outlook 2013 and we have to use all methods to get the information...
If GetWindowClass (GetFocus ()) == wc_NetUiHwnd
&& GetObjectSubTypeCode () == WT_TREEVIEWITEM
&& (! IsCalendarView ()) then
	SayTreeViewLevel (FALSE)
	Return
EndIf
If IsCalendarView ()
&& IsNavigationPane ()
&&iObjType == WT_TREEVIEWITEM
&& GetObjectSubTypeCode (FALSE, 2) == WT_TREEVIEW then
	; this particular event fires very unstable in this particular situation, so it is better to suppress it and to announce new state from the Enter script...
	Return
EndIf

; Call default...
ObjStateChangedEvent(hObj,iObjType,nChangedState,nState,nOldState)
EndFunction

void Function WindowDestroyedEvent (handle hWindow)
If hWindow==ghOutlookInfoBar Then
	let ghOutlookInfoBar=ghNull
EndIf
WindowDestroyedEvent (hWindow)
EndFunction

Script AnnounceOutlookInfoBar ()
var
	handle hTemp,
	int iType,
	int iState,
	string sValue
if ! IsWindowVisible (ghOutlookInfoBar) then
	hTemp = GetFocus ()
	while (getParent (hTemp) && getWindowClass (hTemp) != cWc_dlg32770)
		hTemp = getParent (hTemp)
	endWhile
	hTemp = FindDescendantWindow (hTemp, ID_InfoBar)
	if (hTemp) then ghOutlookInfoBar  = hTemp endIf
endIf
If ghOutlookInfoBar Then
	GetObjectInfoByName (ghOutlookInfoBar, wn_InfoBar, 1, iType, iState, sValue)
	if stringIsBlank (sValue) then
		sValue = getWindowText (ghOutlookInfoBar, READ_EVERYTHING)
	endIf
	if stringIsBlank (sValue) then
		saveCursor ()
		invisibleCursor ()
		saveCursor ()
		moveToWindow (ghOutlookInfoBar)
		sValue = getObjectValue (TRUE)
		;spellstring (sValue) ; ?
		restoreCursor ()
		restoreCursor ()
	endIf
	SayUsingVoice(VCTX_MESSAGE,sValue,OT_USER_REQUESTED_INFORMATION)
Else
	SayUsingVoice(VCTX_MESSAGE,MsgInfoBarEmpty,OT_USER_REQUESTED_INFORMATION)
EndIf
EndScript

Script SayWord()
var
	Handle hFocus = GetFocus (),
	Int iControlID = GetControlID (hFocus),
	Int iWindowType = GetWindowSubtypeCode (hFocus),
	String sSuperGridListItem
If gbWordIsWindowOwner
|| !isPCCursor()
|| UserBufferIsActive()
	PerformScript SayWord()
	Return
EndIf
If SayAllInProgress ()
&& giNoCursorRouting Then
 ;This is to keep the cursor from being routed to the last word when deleting a message during a SayAll.
	Return
EndIf
If GetCalendarView() Then
	If IsCalendarViewAppointmentEditBox () Then
		PerformScript SayWord()
		Return
	EndIf
EndIf
; With enhanced edit, elements are single character objects within address fields.
; To:, CC:, and BCC: fields...
If IsPcCursor()
&& iWindowType == WT_READONLYEDIT
&& (iControlID == To_Field
|| iControlID == CC_Field
|| iControlID == BCC_Field)
&& !GetJcfOption(OPT_EDIT_USE_OSM) Then ; Enhanced edit enabled...
	performscript SayCharacter()
	If IsSameScript() Then
		Say(GetCharacter(),ot_spell)
	EndIf
	Return
EndIf
;to read graphical Email address fields:
If iWindowType != WT_READONLYEDIT
&& (iControlID == From_Field
|| iControlID == To_Field
|| (iControlID == CC_Field
&& GlobalObjectName!=scSubject)
|| iControlID == Bcc_Field) Then
		;test for graphical Email address in header fields:
		if StringLength(GetCharacter())>2 then
			SayField ()
			If IsSameScript ()
					Say(StringTrimLeadingBlanks (StringTrimTrailingBlanks (GetField ())), OT_SPELL)
			EndIf
			Return
		endIf
endIf
If IsMessagesList ()
	sSuperGridListItem = GetSuperGridListItem (hFocus, 0)
	If StringContainsChars (StringSegment (sSuperGridListItem, cScBufferNewLine, 1), "<>")
		Say (StringSegment (sSuperGridListItem, cScBufferNewLine, 2), OT_WORD, TRUE)
	Else
		Say (StringSegment (sSuperGridListItem, cScBufferNewLine, 1), OT_WORD, TRUE)
	EndIf
	Return
EndIf
PerformScript SayWord ()
EndScript

String Function RetrieveElement (int iElementType, int iDirection)
var
	int iRestrictionLevel,
	string sElement
let iRestrictionLevel=GetRestriction ()
SaveCursor()
InvisibleCursor()
RouteInvisibleToPc()
If iElementType==ciCharacter Then
	If iDirection==ciPrior Then
		PriorCharacter()
	ElIf iDirection==ciNext Then
				NextCharacter()
	EndIf
	let sElement=GetCharacter()
ElIf iElementType==ciWord Then
	If iDirection==ciPrior Then
		PriorWord()
	ElIf iDirection==ciNext Then
				NextWord()
	EndIf
	let sElement=GetWord()
ElIf iElementType==ciLine Then
	If iDirection==ciPrior Then
		PriorLine()
	ElIf iDirection==ciNext Then
				NextLine()
	EndIf
	let sElement=GetLine()
EndIf
RestoreCursor()
Return sElement
EndFunction
Script NextDocumentWindow ()
var
	string sObjName
If gbWordIsWindowOwner Then
	PerformScript NextDocumentWindow()
Return
EndIf
If UserBufferIsActive () then
	UserBufferDeActivate ()
EndIf
TypeKey(cksControlTab)
If GetFolderType() ==ciAppointmentItemType Then
	let sObjName=GetObjectName(TRUE)
	If StringContains(sObjName,scView) Then
		let giViewChangeHasSpoken=FALSE
		Say(sObjName,ot_message)
		ReadDateTime (0)
		ReadCalendarData(gsDateToProcess, GetCalendarView ())
	EndIf
EndIf
EndScript

Script PreviousDocumentWindow ()
var
	string sObjName
If gbWordIsWindowOwner Then
	PerformScript PreviousDocumentWindow()
Return
EndIf
If UserBufferIsActive () then
	UserBufferDeActivate ()
EndIf
TypeKey(cksControlShiftTab)
If GetFolderType() ==ciAppointmentItemType Then
	let sObjName=GetObjectName(TRUE)
	If StringContains(sObjName,scView) Then
		let giViewChangeHasSpoken=FALSE
		Say(sObjName,ot_message)
		ReadDateTime (0)
		ReadCalendarData(gsDateToProcess, GetCalendarView ())
	EndIf
EndIf
EndScript

Void Function ResetMessageFlagVariables ()
let giHasRepliedFlag=FALSE
let giHasForwardedFlag=FALSE
let giHasFollowUpFlag=FALSE
let giHasAttachmentFlag=FALSE
let giHasUnreadFlag=FALSE
let giHasImportanceFlag=FALSE
let giHasMeetingRequestFlag=FALSE
let giHasMessageStatusFlag=FALSE
Return
EndFunction

Script AppointmentsAndAttachments ()
	var
	int iMode,
	int iView,
	string sAppointmentList
let iMode=TRUE
If  GetCalendarView() Then
	If !giInAppointmentField Then
		If GetCalendarView () !=ciDayView Then
			let iView=ciRangeView
		Else
			let iView=ciDayView
		EndIf
		If IsSameScript() Then
			let gbIsInAppointmentViewer=TRUE
			let sAppointmentList=GetAppointmentList(iView)
			If sAppointmentList==scNull Then
				Say(msgNoAppointments,ot_error)
				Return
			EndIf
			UserBufferClear()
			UserBufferAddText(sAppointmentList)
			UserBufferActivate()
			SayLine()
		Else
			PerformScript SayDate()
			ProcessAllDayEvents(TRUE,iview)
		EndIf
	EndIf
	Return
Else
	PerformScript OutlookAttachmentsList()
EndIf
EndScript

handle function FindParentWindow(handle hWnd,string sClass)
var
	handle hTemp
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != sClass
	let hTemp = GetParent(hTemp)
EndWhile
return hTemp
EndFunction

int Function GetInfoForReadHeader(int iField, handle ByRef hWnd,
	handle ByRef hDialog, handle ByRef hwndSetFocus,
	string ByRef sName, string ByRef sValue,
	int ByRef iState, int ByRef iType,
	int ByRef iControl, int ByRef iInstance,
	int ByRef bUseLegacy, int ByRef bSubstituteName,
	int ByRef bSubstituteValue, int ByRef bReading)
var
	int bObjNameFound,
	handle hAppWindow,
	string sClass,
	string sWinName,
	string sWinClass
let iInstance = 1
let iControl = 0
let bUseLegacy = FALSE
let bSubstituteName = FALSE
let bSubstituteValue = FALSE
let bReading = false
let sClass = GetWindowClass(hWnd)
let hAppWindow = GetAppMainWindow(hWnd)
let sWinName = GetWindowName(hAppWindow)
; The dialog is the window used to search for the objects in some of the contexts...
;search for hDialog window up the hierarchy rather than down,
;since there may be other windows of this class in the application:
let hDialog = FindParentWindow(GetFocus(),cwc_Dlg32770)
; What Outlook area are we in?
If (StringContains(sWinName,sc_OutlookMessageDialog)
|| ( StringContains(GetWindowName(hwnd),wn_ReadOnlyMessageInReadingPane))
&& ! StringContains(sWinName,sc_OutlookMeetingDialog))
|| StringContains(sWinName,scRSSArticle)
|| GetWindowIDString (hDialog) == AppointmentDialogueStringIDOutlook2013
	let bUseLegacy=true
	If FindDescendantWindow(hDialog,RSSAuthor_Field) Then
		; RSS feed folder messages...
		let bReading=true
		If iField==1 Then
			let sName=	on_RSSAuthorField
			let iControl=rssAuthor_Field
		ElIf iField==2 Then
			let sName=	on_RSSPostedOnField
			let iControl=rssPostedOn_Field
		ElIf iField==5 Then
			let sName=on_RSSSubjectField
			let iControl=rssSubject_Field
		else
			return GetInfoForReadHeader_NotAvailable
		EndIf
	ElIf FindDescendantWindow (hDialog, DueDate_prompt) then
		; We are in an appointment or meeting...
		let bReading = GetWindowSubtypeCode (FindDescendantWindow (hDialog, DueDate_prompt)) == WT_READONLYEDIT 
		If iField == 1 
		; if the field does not exist, we speak not available:
		&& IsWindowVisible (FindDescendantWindow (hDialog, DueDate_prompt)) Then
			let sName=	on_FromFieldReading
			let iControl = DueDate_prompt
		ElIf iField == 2
		; if the field does not exist, we speak not available:
		&& IsWindowVisible (FindDescendantWindow (hDialog, meeting_sent_field)) Then
			let sName=	on_SentFieldEditing
			let iControl=meeting_sent_field
		elIf iField == 3 then
		; if the field does not exist, we speak not available:
			if IsWindowVisible (FindDescendantWindow (hDialog, app_toField)) Then
			let sName = on_ToFieldEditing
			let iControl = app_toField
			ElIf IsWindowVisible (FindDescendantWindow (hDialog, app_starttime) ) Then
				let sName = on_StartTimeFieldWithoutColon
				let iControl = app_starttime
			endIf	
		ElIf iField == 4 Then
			let sName=	on_MeetingLocationField2
			let iControl = ID_MeetingLocationField
		elIf iField == 5 then
			let iControl = app_subject
			let sName=	on_SubjectFieldEditing
		else
			return GetInfoForReadHeader_NotAvailable
		endIf	
	ElIf FindDescendantWindow(hDialog,ciSentField) Then
		; We are reading a message...
		let bReading=true
		If iField==1 Then
			let sName=	on_FromFieldReading
			let iControl=from_Field
		ElIf iField==2 Then
			let sName=	on_SentFieldEditing
			let iControl=sent_Field
		ElIf iField==3 Then
			let sName=	on_ToFieldEditing
			let iControl=to_Field
		ElIf iField==4 Then
			let sName=	on_CcFieldEditing
			let iControl=CC_Field
		ElIf iField==5 Then
			let sName= on_SubjectFieldEditing
			let iControl=subject_Field
		ElIf iField==6 Then
			;BCC field may be availavle for messages sent by the user
			let sName=	on_BccFieldEditing
			let iControl=BCC_Field
		else
			return GetInfoForReadHeader_NotAvailable
		EndIf ; End of message reading
	Else ; We are editing a message...
		If iField==3 Then
			let sName=	on_ToFieldEditing
			let iControl=to_Field
		ElIf iField==4 Then
			let sName=	on_CcFieldEditing
			let iControl=CC_Field
		ElIf iField==5 Then
			let sName=	on_SubjectFieldEditing
			let iControl=subject_Field
		ElIf iField==6 Then
			let sName=	on_BccFieldEditing
			let iControl=BCC_Field
		ElIf iField==7 Then
			let sName=	on_SignedByField
			let bUseLegacy=false
		ElIf iField==8 Then
			let sName=	on_LabelFieldReading
			let bUseLegacy=false
		ElIf iField==9 Then
			let sName=	on_AttachmentsField
			let bUseLegacy=false
		else
			return GetInfoForReadHeader_NotAvailable
		EndIf ; End of message Editing
	EndIf ; End of Message reading and editing.
ElIf StringContains(sWinName,sc_OutlookMeetingDialog)
|| StringContains(sWinName,sc_OutlookRecurringMeetingDialog) Then
	; Meeting request dialog...
	If iField==1 Then
		Let sName=on_FromFieldEditing
		Let bSubstituteValue = TRUE
		let iControl = MeetingFromField
		let hwndSetFocus = findDescendantWindow (hDialog, MeetingFromField)
		if ! hwndSetFocus then
			let iControl = from_field
			let hwndSetFocus = findDescendantWindow (hDialog, from_field)
		endIf
		let bUseLegacy = TRUE
		let bReading = TRUE
	ElIf iField==2 Then
		Let sName=on_SentField2013Plus
		Let bSubstituteValue = TRUE
		let iControl = sent_field
		let hwndSetFocus = findDescendantWindow (hDialog, iControl)
		if ! hwndSetFocus || getWindowSubtypeCode (hwndSetFocus) == WT_STATIC then
			let iControl = MeetingSentField
			let hwndSetFocus = findDescendantWindow (hDialog, iControl)
		endIf
		let bUseLegacy = TRUE
		let bReading = TRUE
	ElIf iField==3 Then
		Let sName=on_MeetingLocationField2
		let bSubstituteValue = TRUE
		let bUseLegacy = TRUE
		if getWindowSubtypeCode (findDescendantWindow (hDialog, sent_field)) != WT_STATIC then
			Let hwndSetFocus = findDescendantWindow (getAppMainWindow (hDialog), MeetingLocationField2)
			let iControl = MeetingLocationField2
		else
	 		Let hwndSetFocus = findDescendantWindow (getAppMainWindow (hDialog), ciMeetingLocationField)
 			let iControl = ciMeetingLocationField
 		endIf
	ElIf iField==4 Then
		Let sName=on_MeetingWhenField2
		let bSubstituteValue=TRUE
		let bUseLegacy = TRUE
		Let hwndSetFocus = findDescendantWindow (getAppMainWindow (hDialog), ciMeetingWhenField)
		let iControl = ciMeetingWhenField
	ElIf iField==5 Then
		Let sName=on_SubjectFieldEditing
		Let bSubstituteValue = TRUE
		let bUseLegacy = TRUE
		Let hwndSetFocus = findDescendantWindow (getAppMainWindow (hDialog), MeetingSubjectField)
		let iControl = MeetingSubjectField
	ElIf iField==6 Then
		Let sName=on_MeetingRequiredField2
		Let bSubstituteValue = TRUE
		let bUseLegacy = TRUE
		Let hwndSetFocus = findDescendantWindow (getAppMainWindow (hDialog), ciRequiredField)
		let iControl = ciRequiredField
	ElIf iField==7 Then
		Let sName=on_MeetingOptionalField2
		Let bSubstituteValue = TRUE
		let bUseLegacy = TRUE
		Let hwndSetFocus = findDescendantWindow (getAppMainWindow (hDialog), ciOptionalField)
		let iControl = ciOptionalField
	else
		return GetInfoForReadHeader_NotAvailable
	EndIf ; End of Meeting request.
ElIf StringContains(sWinName,sc_OutlookContactDialog) Then
	; Outlook Contact Header Fields...
	If iField==1 Then
		Let sName=on_ContactFullName
	ElIf iField==2 Then
		Let sName=on_ContactJobTitle
	ElIf iField==3 Then
		Let sName=on_ContactCompany
	ElIf iField==4 Then
		Let sName=on_ContactFileAs
	ElIf iField==5 Then
		Let sName=on_ContactBusinessPhone
		let bSubstituteName=TRUE
	ElIf iField==6 Then
		Let sName=on_ContactHomePhone
		let bSubstituteName=TRUE
	ElIf iField==7 Then
		Let sName=on_ContactBusinessFaxPhone
		let bSubstituteName=TRUE
	ElIf iField==8 Then
		Let sName=on_ContactMobilePhone
		let bSubstituteName=TRUE
	ElIf iField==9 Then
		Let sName=on_ContactAddress
	ElIf iField==10 Then
		Let sName=on_ContactEmailAddress
		let iInstance=2
	ElIf iField==11 Then
		Let sName=on_ContactInternetAddress
	else
		return GetInfoForReadHeader_NotAvailable
	EndIf
ElIf (StringContains(sWinName,sc_OutlookAppointmentDialog)
|| StringContains(sWinName,sc_OutlookCalendarEventDialog)
|| StringContains(sWinName,sc_OutlookCalendarDialog)) Then
	If iField== 1 Then
		Let sName=on_StartDateField
	ElIf iField== 2 Then
		Let sName=on_StartTimeField
		let bSubstituteValue=TRUE
	ElIf iField== 3 Then
		Let sName=on_EndDateField
	ElIf iField== 4 Then
		Let sName=on_EndTimeField
		let bSubstituteValue=TRUE
	ElIf iField== 5 Then
		Let sName=on_SubjectFieldEditing
	ElIf iField== 6 Then
		Let sName=on_SentFieldReading
	ElIf iField== 7 Then
		Let sName=on_MeetingLocationField2
	ElIf iField== 8 Then
		Let sName=on_OrganizerField2
	ElIf iField== 9 Then
		Let sName=on_AllDayEventField
	ElIf iField== 10 Then
		Let sName=on_NotesFieldWithoutColon
	else
		return GetInfoForReadHeader_NotAvailable
	EndIf ; End of Appointments/Calendar dialog.
ElIf StringContains(sWinName,sc_OutlookTaskDialog) Then
	; Outlook Task dialog...
	If iField==1 Then
		let sName=on_ToFieldReading
	ElIf iField==2 Then
		let sName=on_SubjectField
	ElIf iField==3 Then
		let sName=on_DueDateField
	ElIf iField==4 Then
		let sName=on_StartDateField
	ElIf iField==5 Then
		let sName=on_StatusField
	ElIf iField==6 Then
		let sName=on_PriorityField
	ElIf iField==7 Then
		let sName=on_PercentCompleteField
	ElIf iField==8 Then
		let sName=on_ReminderField
	ElIf iField==9 Then
		let sName=on_OwnerField
	else
		return GetInfoForReadHeader_NotAvailable
	EndIf ; End of Task dialog
ElIf StringContains(sWinName,sc_OutlookJournalDialog) Then
	If iField==1 Then
		Let sName=on_EntryTypeField
	ElIf iField==2 Then
		Let sName=on_CompanyField
	ElIf iField==3 Then
		Let sName=on_StartDateFieldWithoutColon
	ElIf iField==4 Then
		Let sName=on_StartTimeFieldWithoutColon
	ElIf iField==5 Then
		Let sName=on_SubjectField
	ElIf iField==6 Then
		Let sName=on_DurationField
	ElIf iField==7 Then
		Let sName=on_NotesFieldWithoutColon
	else
		return GetInfoForReadHeader_NotAvailable
	EndIf ; End of Journal dialog
else
	return GetInfoForReadHeader_Error
EndIf
If bUseLegacy Then
	let hWnd = FindDescendantWindow(hDialog,iControl)
	if !Hwnd then
		; try again.
		let hWnd = FindDescendantWindow(GetNextWindow(hDialog),iControl)
	endIf
	If hWnd Then
		let iType=GetWindowSubTypeCode(hWnd)
		let sValue=GetWindowTextEx (hWnd, FALSE, TRUE)
		; Sent field in meetings has an odd name:
		if sName == on_SentField2013Plus then
			sName = on_SentFieldEditing
		endIf
		if StringIsBlank (sValue) then
		; Newer windows may yield no value, e.g. Outlook 2016 and later:
			var object TextObject = GetObjectFromEvent (hwnd, OBJID_CLIENT, CHILDID_SELF, 0)
			if  TextObject then sValue = TextObject.accvalue(CHILDID_SELF) endIf
		endIf
		Return GetInfoForReadHeader_OK
	else
		Return GetInfoForReadHeader_NotAvailable
	EndIf
EndIf
bObjNameFound = GetObjectInfoByName(hDialog,sName,iInstance,iType,iState,sValue)
if ! bObjNameFound then
;Use specific data to get the objects from the new message and meeting requests:
	bObjNameFound = GetObjectInfoByName(hDialog,on_ToButton,2,iType,iState,sValue)
endIf
if ! bObjNameFound then
	return GetInfoForReadHeader_NotAvailable
endIf
; When the object name needs to be substituted...
If bSubstituteName Then
	If sName == on_ContactBusinessPhone Then
		let sName = sc_ContactBusinessPhoneLabel
	ElIf sName == on_ContactBusinessFaxPhone Then
		let sName = sc_ContactBusinessFaxPhoneLabel
	ElIf sName == on_ContactHomePhone Then
		let sName = sc_ContactHomePhoneLabel
	ElIf sName == on_ContactMobilePhone Then
		let sName = sc_ContactMobilePhoneLabel
	EndIf ; End Contact name substitution.
EndIf ; End name substitution
; When value needs substituting...
If bSubstituteValue Then
	If sName == on_MeetingLocationField Then
		let sValue = GetFieldText(ciMeetingLocationField)
	ElIf sName == on_MeetingWhenField Then
		let sValue = GetFieldText(ciMeetingWhenField)
	ElIf sName == on_StartTimeField Then
		let sValue = GetFieldText(ciStartTimeField)
		let iType = wt_Edit
	ElIf sName == on_EndTimeField Then
		let sValue = GetFieldText(ciEndTimeField)
		let iType = wt_Edit
	ElIf sName == on_SubjectField then
		let sValue = GetFieldText (ciMeetingSubjectField)
	elIf sName == on_MeetingRequiredField then
		let sValue = GetFieldText (ciRequiredField)
	elIf sName == on_MeetingOptionalField then
		let sValue = GetFieldText (ciOptionalField)
	elIf sName == on_MeetingDescriptionField then
		let sValue = getWindowText (FINDWINDOW (GETAPPMAINWINDOW (GETFOCUS ()),
			wc_wordMainDocumentWindow), READ_EVERYTHING)
	EndIf ; End meeting value substitution
EndIf ; End value substitution.
return GetInfoForReadHeader_OK
EndFunction

void Function ReadHeader (int iField)
var
	handle hWnd,
	handle hDialog,
	handle hwndSetFocus,
	string sName,
	string sValue,
	int iControl,
	int iInstance,
	int bUseLegacy,
	int iState,
	int iType,
	int bSubstituteName,
	int bSubstituteValue,
	int bReading, ; for when message is read-only
	int GetInfoForReadHeaderResults
let hWnd = GetFocus()
let GetInfoForReadHeaderResults =
	GetInfoForReadHeader (iField, hWnd, hDialog, hwndSetFocus,
		sName, sValue, iState, iType, iControl,
		iInstance, bUseLegacy, bSubstituteName, bSubstituteValue, bReading)
if GetInfoForReadHeaderResults == GetInfoForReadHeader_Error then
	SayFormattedMessageWithVoice (  VCTX_MESSAGE,OT_ERROR,msgNotInOpenMessageError_l,msgNotInOpenMessageError_s)
	Return
elif GetInfoForReadHeaderResults == GetInfoForReadHeader_NotAvailable then
	SayFormattedMessageWithVoice (	VCTX_MESSAGE,OT_ERROR,
		msgFieldNotAvailable_L,msgFieldNotAvailable_S)
	return
EndIf
; Pressing twice moves to object...
If bUseLegacy Then
	if isSameScript() then
		if bReading  ; any header field
		|| iField>=3 then ;editing
			; do not replace this call to SetFocus (hWnd). Replacing causes theEsc key not working for closing the message later...
			; A few places where ClickObjectByName doesn't work because there's technically no name:
			if ! ClickObjectByName(hDialog,sName,iInstance) then
				hwnd = FindDescendantWindow (hDialog, iControl)
				if hwnd && IsWindowVisible (hwnd) then setFocus (hwnd) endIf
			endIf
		endIf
	elif bReading
	|| iField>=3 then
		SayFormattedMessageWithVoice (vctx_PCCursor, OT_USER_REQUESTED_INFORMATION,sName+cscSpace+sValue,sName+cscSpace+sValue)
		IndicateControlState (iType,iState) ; For checkboxes...
	Else
		;only announce when the previous window with focus is not 0, it exists.
		;this prevents the below message from getting announced when spellchecker completes automatically prior to sending a message.
		if globalPrevFocus!=0 then
			SayFormattedMessageWithVoice (	VCTX_MESSAGE,OT_ERROR,sName+cscSpace+msgFieldNotAvailable_L,sName+cscSpace+msgFieldNotAvailable_S)
		endIf
	endIf
	Return
EndIf
If IsSameScript() Then
	if hwndSetFocus
	&& isWindowVisible (hwndSetFocus) then
		setFocus (hwndSetFocus)
	else
		ClickObjectByName(hDialog,sName,iInstance)
	endIf
	Return
endIf
if giOutlookMessageHeaderVerbosity then
	SayFormattedMessageWithVoice (vctx_PCCursor,ot_screen_message,sName+cscSpace+sValue,sName+cscSpace+sValue)
	Return
EndIf
IndicateControlType(iType,sName,sValue)
IndicateControlState (iType,iState) ; For checkboxes...
EndFunction

Script ReadOutlookHeader (int iField)
If IsCalendarView () then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	Return
EndIf
ReadHeader(iField)
EndScript

String Function GetFieldText (int iControl)
var
	string sText,
	handle hWnd
let hWnd=FindDescendantWindow(GetAppMainWindow(GetFocus()),iControl)
if getWindowClass (hwnd) == cwc_Richedit20WPT then
	Let sText = getWindowText (hWnd, READ_EVERYTHING)
else
	let sText=GetWindowTextEx (hWnd, false, false)
endIf
Return  sText
EndFunction


Script GoToOutlookMessageBodyWindow ()
Var
	handle hwnd
If GetWindowClass(GetFocus())!=wc_WordMainDocumentWindow then
	let hwnd=FindWindow(GetTopLevelWindow(GetFocus()),wc_wordMainDocumentWindow )
	if hwnd then
		;modify Move to body, so the cursor doesnot always end up at the bottom of the message.
		SaveCursor ()
		InvisibleCursor ()
		SaveCursor ();prev location of invisible
		MoveToWindow (hwnd)
		if hwnd == getCurrentWindow () then
			;bump the cursor left to avoid activating any links:
			MoveTo(GetCursorCol()-2,GetCursorRow())
			RoutePcToInvisible ()
			restoreCursor () ; Put invisible Cursor back
			restoreCursor () ; put PC Cursor back
			pcCursor (); Outlook, the double restore cursor isn/'t restoring the PC cursor,
			;probably because the new location is FS Dom
		else ; Old Code, window could not  be moved to by Invisible.
			restoreCursor () ; put PC Cursor back ; Put invisible Cursor back
			restoreCursor ()
			SetFocus (hwnd)
			LeftMouseButton ()
		endIf
	Else
		sayMessage(ot_error,msg_NoOpenMessage1_L,msg_NoOpenMessage1_S)
	EndIf
Else
	SayMessage(ot_error,msgEMail_l,msgEMail_S)
	return
EndIf
EndScript

Void Function ReadOutlookMessage ()
if gbWordIsWindowOwner then
	let ghMessageBodyWindow=GetFocus()
	if IsActiveDocumentProtected () then
		if !gbMessageHasBeenRead then ; not returning from a ribbon or context menu within the message just opened or read.
			if GlobalPrevRealName == wn_FindAndReplace then ; exiting the find and replace dialog but don't re-read the message headers again:
				;Behave just like JAWSFind does:
				SayLine ()
				Return
			endIf
			if giOutlookMessageHeaderVerbosity  then
				pause()
				ReadHeader(1) ; from field
				ReadHeader(5) ; Subject field
			EndIf
			let gbMessageHasBeenRead=true
		endIf
	EndIf
endIf
EndFunction

string function TypeOfItem (int ByRef iIsMessage, int ByRef iIsTask)
var
	string sTypeOfItem,
	string sRealName
let sRealName = GetWindowName (GetAppMainWindow (GetFocus()))
let iIsMessage=FALSE
let iIsTask=FALSE
if StringContains (sRealName, scMessage) then ; for regular messages
	let iIsMessage = TRUE
	return scMessageItem
elIf StringContains(sRealName,wn_RSSArticle) then ; for RSS Feeds
	let iIsMessage = TRUE
	return scMessageItem
elif StringContains (sRealName, scContacts) then
	return scContactItem
elif StringContains (sRealName, scMeetingDialog) then
	return scMeetingItem
elif StringContains (sRealName, scAppointmentDialog) then
	return scAppointmentsItem
elif StringContains (sRealName, scTasks) then
	let iIsTask = TRUE
	return scTaskItem
else
	return scNull
EndIf
EndFunction

Script MoveBackItem ()
var
	string sTypeOfItem,
	string sMessage_L,
	int iIsMessage,
	int iIsTask,
	handle hwnd
if GetWindowClass(GetFocus())==wc_WordMainDocumentWindow then
	let gbWordIsWindowOwner=true
EndIf

If gbWordIsWindowOwner
&& ! IsActiveDocumentProtected () Then
	;TypeCurrentScriptKey () ; Use CTRL and brackets, as that's most reliable:
	typeKey (ksShrinkFont)
	SayFontSize()
	Return
EndIf
let gbMessageHasBeenRead=FALSE
QuickNavStateChange(false)
TypeCurrentScriptKey ()
let iIsMessage = FALSE
let iIsTask = FALSE
QuickNavStateChange(true)
Delay (1)
let sTypeOfItem = TypeOfItem (iIsMessage, iIsTask)
if sTypeOfItem == scNull then
	return
else
	let sMessage_L = FormatString (msgPreviousItem, sTypeOfItem)
	;let sMessage_l=sMessage_l+cscSpace+GetWindowName(GetRealWindow(GetAppMainWindow(GetFocus())))
	SayFormattedMessage (ot_status, sMessage_L, msgPrevious)
EndIf
If iIsTask then
	Pause ()
	let hwnd = FindDescendantWindow (GetAppMainWindow (GetFocus ()), TaskSubject_field)
	if hwnd != GetFocus () then
		SetFocus (hwnd)
	else
		SayWindowTypeAndText (hwnd)
	EndIf
EndIf
if iIsMessage then
	ReadOutlookMessage()
EndIf
EndScript

Script MoveForwardItem ()
var
	string sTypeOfItem,
	string sMessage_L,
	int iIsMessage,
	int iIsTask,
	handle hwnd
if GetWindowClass(GetFocus())==wc_WordMainDocumentWindow then
	let gbWordIsWindowOwner=true
EndIf
If gbWordIsWindowOwner
&& ! IsActiveDocumentProtected () Then
	;TypeCurrentScriptKey () ; Use CTRL and brackets, as that's most reliable:
	typeKey (ksGrowFont)
	SayFontSize()
	Return
EndIf
let gbMessageHasBeenRead=FALSE
QuickNavStateChange(false)
TypeCurrentScriptKey ()
let iIsMessage = FALSE
let iIsTask = FALSE
QuickNavStateChange(true)
Delay (1)
let sTypeOfItem = TypeOfItem (iIsMessage, iIsTask)
if sTypeOfItem == scNull then
	return
else
	let sMessage_L = FormatString (msgNextItem, sTypeOfItem)
	;let sMessage_l=sMessage_l+cscSpace+GetWindowName(GetRealWindow(GetAppMainWindow(GetFocus())))
	SayFormattedMessage (ot_status, sMessage_L, msgNext);next message/contact/task
EndIf

If iIsTask then
	Pause ()
	let hwnd = FindDescendantWindow (GetAppMainWindow (GetFocus ()), TaskSubject_field)
	if hwnd != GetFocus () then
		SetFocus (hwnd)
	else
		SayWindowTypeAndText (hwnd)
	EndIf
EndIf
if iIsMessage then
	ReadOutlookMessage()
EndIf
EndScript

void function AttachmentsListOutlook2013 ()
; uses the old style implementation, newer versions use UIA and a new set of buttons:
var
	handle hwnd,
	handle hAttachments,
	string sClass
let hWnd=GetFocus()
let sClass=GetWindowClass(hWnd)
;First, make sure that a message is open:
If !FindDescendantWindow(GetAppMainWindow(hWnd),subject_field)
|| GetCurrentControlID()==ciGridView Then
	SayMessage(ot_error, msg_NoOpenMessage1_L, msg_NoOpenMessage1_S)
	return
EndIf
Delay(1,TRUE)
let hAttachments =FindWindowWithClassAndId (GetAppMainWindow(hWnd),wc_Rctrl_RenWnd32,ci_Attachments_New)
if hAttachments then
	hAttachments = FindWindow (hAttachments, cwc_NetUIHwnd)
elIf ! IsActiveDocumentProtected () then ; editable message
	let hAttachments=FindWindowWithClassAndId (GetAppMainWindow(hWnd),cwc_richEdit20wpt,ci_EditableMessageAttachmentList)
else ; read-only message
	let hAttachments=FindWindowWithClassAndId (GetAppMainWindow(hWnd),wc_AfxWndW,ciAttachmentList)
endIf
If hAttachments
&& (StringLength (GetWindowText (hAttachments, FALSE)) 
|| GetWindowClass (hAttachments) == cwc_NetUIHwnd) then
	SaveCursor ()
	InvisibleCursor ()
	SaveCursor ()
	MoveToWindow(hAttachments)
	if hAttachments == GetCurrentWindow () then
		RoutePCToInvisible ()
		PcCursor()
		JawsHome()
	else
		MoveTo (GetWindowLeft (hAttachments), GetWindowTop (hAttachments))
		if GetWindowClass (GetCurrentWindow ()) == cwc_NetUIHwnd then
			RoutePCToInvisible ()
		endIf
		restoreCursor ()
		RestoreCursor ()
		if GetWindowClass (GetFocus ()) == cwc_Word_Document then
			ShiftTabKey () ; "hard" focus on attachment window, because the window coordinates info is off.
		endIf
	endIf
Else
	SayFormattedMessage (OT_ERROR, msgAttachmentsList2_L, msgAttachmentsList2_S)
EndIf
endFunction

Script OutlookAttachmentsList ()
if OutlookVersion < 16 then
; uses the old style implementation, newer versions use UIA and a new set of buttons:
	AttachmentsListOutlook2013 ()
	return
endIf
var
	handle hwnd,
	handle hAttachments,
	string sClass
let hWnd=GetFocus()
let sClass=GetWindowClass(hWnd)
;First, make sure that a message is open:
If !FindDescendantWindow(GetAppMainWindow(hWnd),subject_field)
|| GetCurrentControlID()==ciGridView Then
	SayMessage(ot_error, msg_NoOpenMessage1_L, msg_NoOpenMessage1_S)
	return
EndIf
let hAttachments =FindWindowWithClassAndId (GetAppMainWindow(hWnd),wc_Rctrl_RenWnd32,ci_Attachments_New)
if hAttachments then
	let hAttachments = findWindow (hAttachments, "NetUINativeHWNDHost")
endIf
if hAttachments && isWindowVisible (hAttachments) then
	var object element = CreateUIAElementFromWindow (hAttachments)
	var object treeWalker = CreateUIARawViewTreeWalker()
	TreeWalker.CurrentElement = element
	; element.FindFirst by condition doesn't work for some reason.
	while (element.ClassName != objn_AttachmentButtonFocusable && Treewalker.GoToFirstChild())
		element = Treewalker.CurrentElement
	endWhile
	if element.isKeyboardFocusable then
		element.SetFocus()
	else
		SayFormattedMessage (OT_ERROR, msgAttachmentsList2_L, msgAttachmentsList2_S)
	endIf
else
	SayFormattedMessage (OT_ERROR, msgAttachmentsList2_L, msgAttachmentsList2_S)
endIf
EndScript

Script RefreshScreen ()
PerformScript RefreshScreen()
If GetCalendarView() Then
	let gbRefreshObject=TRUE
	Say(GetObjectName(TRUE),ot_screen_message)
	ReadDateTime (0)
	ReadCalendarData(gsDateToProcess, GetCalendarView ())
EndIf
EndScript

Void function QuickNavStateChange(int iState)
;changes quick nav state to opposite state if the message is read-only.
if !iState then ;turn it off.
	if QuickNavKeyTrapping() then
		setJCFOption(opt_quick_key_navigation_Mode,0)
		SetQuickKeyNavigationState(0)
	EndIf
Else ;turn it on.
	if !QuickNavKeyTrapping() then
		setJCFOption(opt_quick_key_navigation_Mode,1)
		SetQuickKeyNavigationState(1)
	EndIf
EndIf
EndFunction

String function SayAllReadsBy(int iRetCurVal)
var
	int iSayAllMode,
	int iLinePause

let iSayAllMode=getJCFOption(OPT_SAY_ALL_MODE)
let iLinePause=getJCFOption(OPT_LINE_PAUSES)
if ! iRetCurVal then
	; update it
	if giSayAllReadBy>2 then ; turn it to lines without pauses.
		let giSayAllReadBy=0
	Else
		let giSayAllReadBy=giSayAllReadBy+1
	EndIf
	if iLinePause==1 then
		let iLinePause=0
	ElIf iSayAllMode==2 then
		let iSayAllMode=0
		let iLinePause=1
	else
		let iSayAllMode=iSayAllMode+1
	EndIf
	SetJcfOption(OPT_SAY_ALL_MODE, iSayAllMode)
	SetJcfOption(OPT_LINE_PAUSES, iLinePause)
EndIf
if iSayAllMode==0 then
	if iLinePause==1 then
		return cMSG248_S
	else
		return cmsg364_S
	EndIf
elif iSayAllMode==1 then
	return cMSG249_S
ElIf iSayAllMode==2 then
	return cMSG250_S
endIf
;return SayAllReadsByTextOutput(iSayAllMode,iLinePause)
EndFunction

Void Function SaveSayAllMode()
Var
	int iSayAllMode,
	int iLinePauses
If giSayAllReadBy==0 then ; read by lines without pauses
	let iSayAllMode=iniWriteInteger(section_options,hKey_SayAllMode,giSayAllReadBy,outlook2013_JCFFilename)
	let iLinePauses=iniWriteInteger(section_options,hKey_LinePauses,0,outlook2013_JCFFilename)
Elif giSayAllReadBy==1
|| giSayAllReadBy==2 then ; line pauses is irrelevant, so turn it off.
	let iSayAllMode=iniWriteInteger(section_options,hKey_SayAllMode,giSayAllReadBy,outlook2013_JCFFilename)
	let iLinePauses=iniWriteInteger(section_options,hKey_LinePauses,0,outlook2013_JCFFilename)
ElIf giSayAllReadBy>2 then; lines with pauses
	let iSayAllMode=iniWriteInteger(section_options,hKey_SayAllMode,0,outlook2013_JCFFilename) ; lines
	let iLinePauses=iniWriteInteger(section_options,hKey_LinePauses,1,outlook2013_JCFFilename) ;lines with pauses
EndIf
IniWriteInteger(section_options,hKey_SayAllReadBy,giSayAllReadBy,Outlook2013JSI)
EndFunction

Void Function SetSayAllMode()
Var
	int iSayAllMode,
	int iLinePauses
If giSayAllReadBy==0 then ; read by lines without pauses
	SetJcfOption(opt_say_all_mode,0)
	setJcfOption(opt_line_pauses,0)
Elif giSayAllReadBy==1
|| giSayAllReadBy==2 then ; line pauses is irrelevant, so turn it off.
	SetJcfOption(opt_say_all_mode,giSayAllReadBy)
	setJcfOption(opt_line_pauses,0)
ElIf giSayAllReadBy>2 then; lines with pauses
	SetJcfOption(opt_say_all_mode,0)
	setJcfOption(opt_line_pauses,1)
EndIf
EndFunction

int function HasVirtualEnhancedClipboard()
return true
EndFunction

void function SayLine(optional int HighlightTracking, int bSayingLineAfterMovement)
var
	handle hFocus,
	string sWindowText,
	string sObjectName,
	string sState,
	int iControlID,
	int iObjectType,
	Int iWindowType
if UserBufferIsActive ()
|| !IsPcCursor ()
|| GlobalMenuMode
|| gbWordIsWindowOwner then
	SayLine(HighlightTracking,bSayingLineAfterMovement)
	Return
EndIf
let hFocus = GetFocus()
let iControlID = GetControlID(hFocus)
let iWindowType = GetWindowSubtypeCode (hFocus)
let sObjectName = GetObjectName(TRUE)
let iObjectType=GetObjectSubtypeCode()
if IsCalendarView () && iObjectType == WT_TABLECELL then
	var string calendarItem = currentCalendarData
	if stringIsBlank (calendarItem) then calendarItem = getAndCleanUpObjectNameForCalendar (sObjectName) endIf
	if ! stringIsBlank (calendarItem) then
		if isSameScript () then
			spellString (calendarItem)
		else
			say (calendarItem, OT_LINE)
		endIf
		return
	endIf
endIf
If sObjectName==scContactItem
&& iControlID == Contact_List Then
	Say(GetObjectValue(TRUE),ot_line)
	Return
EndIf
; This Address book combo box gives incorrect MSAA data...
If iWindowType == wt_ComboBox
&& iControlID == ciNewAddressEntry
&& GlobalRealWindowName==wn_NewEntry Then
	Say(GetWindowTextEx(hFocus,TRUE,TRUE),OT_SCREEN_MESSAGE)
	Say(PositionInGroup (),OT_POSITION)
	Return
EndIf
if StringContains(globalRealWindowName,sc_OutlookContactDialog)
&& iWindowType == wt_button then
	SayFocusedObject()
	return
endIf
; Message list...
If  iControlID ==ciGridView
|| (iControlID ==ic_AdvancedFindResultList
&& GlobalRealWindowName==wn_AdvancedFind) Then
	Delay(1,TRUE)
	If CheckForNoMoreItems(OT_LINE) Then
		Return
	EndIf
	SpeakMessageFlags()
	SayObjectActiveItem()
	Return
EndIf
let sWindowText=GetWindowTextEx(hFocus,FALSE,FALSE)
; Start date and Time, End date and time fields have joint names...
If iControlID >= app_startTime
&& iControlID <= app_enddate
&& StringContains(GetWindowName(hFocus),scTime) Then
	Say(sWindowText,ot_screen_message)
	Return
EndIf
; Tabs don't speak in Rules Wizard...
If StringContains(GlobalRealWindowName,wn_RulesAndAlerts)
|| GlobalRealWindowName==wn_AdvancedFind Then
	If  iObjectType==wt_TabControl Then
			IndicateControlType(wt_TabControl,GlobalObjectName,cscSpace)
			Return
		EndIf
EndIf
If iObjectType ==wt_treeview
|| iObjectType == WT_TREEVIEWITEM then
	If GetWindowClass (hFocus) == wc_NetUIHWND  Then
		SayFocusedObject()
	Else
		SayTreeViewLevel ()
	EndIf
	Return
EndIf
; Rules wizard
If (GlobalRealWindowName== wn_RulesWizard
|| GlobalRealWindowName== wn_RulesAndAlerts) Then
	If iControlID ==ciRulesConditionCheckList Then
		Say(GetObjectState(TRUE)+cscSpace+sObjectName,OT_SCREEN_MESSAGE)
		Return
	EndIf
	If iControlID == RuleDescriptionListBox  Then
		Say(sObjectName,OT_SCREEN_MESSAGE)
		return
	EndIf
	If iObjectType==wt_TabControl Then
		SayLine(HighlightTracking,bSayingLineAfterMovement)
		Return
	EndIf
EndIf ; End Rules Wizard.
; we need to correctly announce the CC field label if we are in the message window...
If iControlID == CC_Field && ! DialogActive ()
&& IsMessageTextWindow (hFocus)
&& (! findWindowByType (GetAppMainWindow (hFocus), WT_CHECKBOX)) then	; To distinguish between simple message window and appointment one, containig the All day event checkbox...
	IndicateControlType (iObjectType, GetObjectName (TRUE))
	Return
EndIf
SayLine(HighlightTracking,bSayingLineAfterMovement)
EndFunction


Script SayMoveForward ()
	TypeCurrentScriptKey ()
	If InHJDialog () || UserBufferIsActive ()
	;These keystrokes do nothing when outside the Outlook main windows.
	|| ! IsInOutlookMainWindow (getFocus()) then
		Return
	EndIf
	SayMessage (OT_STATUS, MsgForward_L, MsgForward_S)
EndScript

Script SayMoveBack ()
	TypeCurrentScriptKey ()
	If InHJDialog () || UserBufferIsActive ()
	;These keystrokes do nothing when outside the Outlook main windows.
	|| ! IsInOutlookMainWindow (getFocus()) then
		Return
	EndIf
	SayMessage (OT_STATUS, MsgBack_L, MsgBack_S)
EndScript

Script SaySelectedText ()
var
	String sBeginTime,
	String sEndTime,
	String sAppointmentText,
	String sWeekDay,
	String sDateString,
	String sShortDateString

; Calendarview processing
If IsCalendarView ()
&& !MenusActive ()
&& !DialogActive ()
&& !InHJDialog () then
	;SayFormattedMessage (ot_user_requested_information, FormatString(cmsg39_L,sTimeValue), GetTimeInformation ())
	ParseMSAACalendarString (sWeekday, sDateString, sShortDateString, sBeginTime, sEndTime, sAppointmentText)
	SayMessage (OT_USER_REQUESTED_INFORMATION, FormatString (MSG_TimeSlotSelection_L, sBeginTime, sEndTime), FormatString (MSG_TimeSlotSelection_S, sBeginTime, sEndTime))
	return
EndIf ; End of Calendar.
PerformScript SaySelectedText()
EndScript

Script BrailleRouting()
var
	int nCell,
	handle hwnd
if BrailleIsMessageBeingShown() then
	brailleClearMessage()
	return
endIf
if gbWordIsWindowOwner then
	performScript BrailleRouting()
	return
endIf
if (BrailleIsStructuredLine ()
&& getWindowClass (getFocus ()) == wc_AfxWndW
&& GetObjectSubTypeCode () == WT_LISTBOXITEM)
	enterKey ()
	return
endIf
PerformScript BrailleRouting()
EndScript



Script ReadBoxInTabOrder()
var
	handle hPos, ; for dialog inside a dialog
	handle hPosChild

if ! StringContains (GetWindowName (GlobalRealWindow), wn_AdvancedFind) then
	PerformScript ReadBoxInTabOrder()
	return
EndIf
If !GetDialogStaticText () then
	Say(MSAAGetDialogStaticText (), OT_DIALOG_TEXT)
EndIf
Say (getWindowName(GlobalRealWindow), OT_ERROR)
EnumerateChildWindows (GlobalRealWindow, "DoChildWindows")
EndScript

void Function WindowActivatedEvent(handle hWnd)
var
	Handle hInfoBar,
	String sWindowName

let sWindowName = GetWindowName (hWnd)
If StringContains (sWindowName, scAppointment) then
	let hInfoBar = FindWindowWithClassAndId (hWnd, wc_Rctrl_RenWnd32, ID_InfoBar)
	If hInfoBar
	&& IsWindowVisible (hInfoBar)
	&& giOutlookInfoBarVerbosity == TRUE then
		InfoBarShowEvent (hInfoBar)
	EndIf
EndIf
WindowActivatedEvent(hWnd)
EndFunction

void function SayTreeViewItem()
var
	String sTemp,
	String sName,
	String sLine

let sName = GetObjectName (TRUE)
let sLine = GetLine ()
; To announce the number of unread messages in the folders in go to folder dialogue, Copy items dialogue, move items dialogue, Copy Folder dialogue, Move Folder dialogue, Create New Folder dialogue.
If StringCompare (sName, sLine, FALSE) then
	let sTemp = sName
	StringTrimCommon (sTemp, sLine, 1)
	let sLine = StringTrimLeadingBlanks (sLine)
	If StringContainsChars (StringSegment (sLine, cScSpace, 1), SC_DigitalChars) then
		Say (sName, OT_LINE)
		SayMessage (OT_LINE, FormatString (msgUnread_L, StringSegment (sLine, cScSpace, 1)), FormatString (msgUnread_L, StringSegment (sLine, cScSpace, 1)))
	Else
		If IsCalendarView ()
		&& IsNavigationPane ()
		&& GetObjectSubTypeCode () == WT_TREEVIEWITEM then
			If GetTreeViewSelectedStateFromUIA () then
				IndicateControlState (WT_TREEVIEW, CTRL_CHECKED)
			EndIf
			Say (sName, OT_LINE)
			Return
		EndIf
		Say (sName, OT_LINE)
	EndIf
	SayTVFocusItemExpandState (GetFocus ())
	Return
EndIf
SayTreeViewItem()
EndFunction

script JAWSHome()
;Delay (1)
SayCurrentScriptKeyLabel()
gbUpDownNavigation = TRUE
HomeEndMovement(UnitMove_First)
EndScript

script Home ()
performscript JAWSHome()
endScript

Script JAWSEnd ()
;Delay (1)
SayCurrentScriptKeyLabel()
gbUpDownNavigation = TRUE
HomeEndMovement(UnitMove_Last)
EndScript

script end ()
performScript JAWSEnd ()
endScript

int function UIAGetNavigationPaneTreeviewLevel()
var
	int level = 0,
	string name = getObjectName (TRUE), ; for folders many levels deep
	object pattern,
	object treewalker = CreateUIATreeWalkerForFocusProcessId (null (), TRUE),
	object element = treewalker.CurrentElement
if element.controlType != UIA_TreeItemControlTypeId then
	if treeWalker.GoToNextSibling() then
		element = treewalker.CurrentElement
	else
		treeWalker.GoToParent()
		element = treewalker.CurrentElement
	endIf
endIf
if ! element || element.controlType != UIA_TreeItemControlTypeId then return level endIf
if element.name != name then
	while (element && element.controlType == UIA_TreeItemControlTypeId)
		treeWalker.GoToParent()
		element = treewalker.CurrentElement
	endWhile
	var object UIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	var object condition = UIA.CreateStringPropertyCondition( UIA_NamePropertyID, name);
	element = element.FindFirst(TreeScope_Descendants, condition)
	treewalker.CurrentElement = element
endIf
if ! element || element.controlType != UIA_TreeItemControlTypeId then return level endIf
while (element && element.controlType == UIA_TreeItemControlTypeId)
	treeWalker.GoToParent()
	element = treewalker.CurrentElement
	level = level+1
endWhile
return level
endFunction

string function UIAGetNavigationPaneTreeviewItemState ()
var
	string name = getObjectName (TRUE),
	object pattern,
	object treewalker = CreateUIATreeWalkerForFocusProcessId (null (), TRUE),
	object element = treewalker.CurrentElement
if element.controlType != UIA_TreeItemControlTypeId then
	if treeWalker.GoToNextSibling() then
		element = treewalker.CurrentElement
	else
		treeWalker.GoToParent()
		element = treewalker.CurrentElement
	endIf
endIf
if ! element || element.controlType != UIA_TreeItemControlTypeId then return cscNull endIf
if element.name != name then
	while (element && element.controlType == UIA_TreeItemControlTypeId)
		treeWalker.GoToParent()
		element = treewalker.CurrentElement
	endWhile
	var object UIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	var object condition = UIA.CreateStringPropertyCondition( UIA_NamePropertyID, name);
	element = element.FindFirst(TreeScope_Descendants, condition)
	treewalker.CurrentElement = element
endIf
if ! element || element.controlType != UIA_TreeItemControlTypeId then return cscNull endIf
pattern = element.GetExpandCollapsePattern();
if ! pattern then return cscNull endIf
if pattern.ExpandCollapseState < 3 then
; not a leaf
	return GetObjectState (TRUE)
endIf
return cscNull
endFunction

void Function SayTreeViewLevel(int IntelligentPositionAnnouncement)
var
	String sSegment,
	String sLabelClosed,
	string sName,
	String sLine,
	string sLevel,
	string sMessage,
	string sTemp,
	Handle hFocus,
	Int iOption,
	Int iAttributes,
	Int iLevel,
	int nState,
	int bLevelChanged
; These are not standard treeviews in Outlook 2013 and we have to use all methods to get the information...
If (IsNavigationPane () || getWindowClass (getFocus ()) == cwc_NetUIHwnd)
&& GetObjectSubTypeCode () == WT_TREEVIEWITEM then
	; Since we're now getting unread message count info from UIA,
	; we can now freely use tree view level info for level info.
	let iLevel = UIAGetNavigationPaneTreeviewLevel()
	If iLevel != PreviousTreeviewLevel then
		let bLevelChanged = true
		let sLevel = IntToString (iLevel)
		let sMessage = FormatString (cmsg233_L, sLevel)
		SayMessage (OT_POSITION, sMessage, sLevel) ; "level "
		let PreviousTreeViewLevel= iLevel
	endIf
	If IsCalendarView () then
		If GetTreeViewSelectedStateFromUIA () then
			IndicateControlState (WT_TREEVIEW, CTRL_CHECKED)
		EndIf
		sName = getObjectName (TRUE)
		Say (sName, OT_LINE)
		; speak the open and closed states without speaking "selected":
		indicateControlState (WT_TREEVIEW, getControlAttributes ()&~CTRL_SELECTED)
		Return
	EndIf
	Say (GetObjectName (TRUE), OT_CONTROL_NAME)
	say (UIAGetNavigationPaneTreeviewItemState (), OT_ITEM_STATE)
	let iLevel = GetUnreadMessageCountFromUIATree ()
	If iLevel == 1 then
		SayMessage (OT_POSITION, msgOneUnread_L, FormatString (msgUnread_S, IntToString (iLevel)))
	ElIf iLevel then
		SayMessage (OT_POSITION, FormatString (msgUnread_L, IntToString (iLevel)), FormatString (msgUnread_S, IntToString (iLevel)))
	EndIf
	Return
;In Move To, Copy To, and other dialogs that have tree views,
;Need to ensure we speak number of unread items.
elIf DialogActive () && ! inHjDialog () then
	let iLevel = GetTreeviewLevel()
	If iLevel != PreviousTreeviewLevel then
		let bLevelChanged = true
		let sLevel = IntToString (iLevel)
		let sMessage = FormatString (cmsg233_L, sLevel)
		SayMessage (OT_POSITION, sMessage, sLevel) ; "level "
		let PreviousTreeViewLevel= iLevel
	endIf
	let sName = GetObjectName (TRUE)
	let sLine = GetLine ()
	If StringCompare (sName, sLine, FALSE) then
		let sTemp = sName
		StringTrimCommon (sTemp, sLine, 1)
		let sLine = StringTrimLeadingBlanks (sLine)
		If StringContainsChars (StringSegment (sLine, cScSpace, 1), SC_DigitalChars) then
			Say (sName, OT_LINE)
			SayMessage (OT_LINE, FormatString (msgUnread_L, StringSegment (sLine, cScSpace, 1)), FormatString (msgUnread_L, StringSegment (sLine, cScSpace, 1)))
			gsUnRedMsgs = sLine
		Else
			Say (sName, OT_LINE)
		EndIf
	else
		Say (sName, OT_LINE)
	endIf
	let nState = GetControlAttributes()& ~CTRL_SELECTED
	IndicateControlState (WT_TREEVIEWITEM, nState)
	if IntelligentPositionAnnouncement
	&& bLevelChanged then
		say (positionInGroup (), OT_POSITION)
	endIf
	Return
EndIf
; call default...
SayTreeViewLevel(IntelligentPositionAnnouncement)
EndFunction

Script RunJAWSManager()
let gbUsingWordNavQuickKeys = gbWordIsWindowOwner
PerformScript RunJAWSManager()
EndScript

void function RunNavQuickKeysManager()
if gbUsingWordNavQuickKeys then
	NavigationQuickKeysManager (2)
else
	NavigationQuickKeysManager (0)
EndIf
EndFunction

Script ReplyDirectlyToSender ()
var
	Handle hFrom,
	Handle hTo,
	Handle hFocus,
	Object oClient,
	string temp,
	string sValue,
	Int iChildID,
	Int iTemp,
	Int iLoop
let hFocus = GetFocus ()
If GetWindowClass (hFocus) != wc_wwg 
	let hFrom = FindWindowWithClassAndId (GetRealWindow (hFocus), cwc_RichEdit20WPT, From_Field)
Else
	let hFrom = FindWindowWithClassAndId (GetAppMainWindow (hFocus), cwc_RichEdit20WPT, From_Field)
EndIf
If Not hFrom
; Cannot perform correctly from messages list, because the Outlook object model will not respond.
; open the message first, then do this keystroke.
|| GetControlID (getFocus ()) == ciGridView then
	Say(msgCannotRetrieveSendersAddress,OT_ERROR)
	Return
EndIf
let oClient = GetObjectFromEvent (hFrom, OBJID_CLIENT, iChildID, iTemp)
let temp = oClient.accValue (iChildID)
sValue = temp
ComRelease (oClient, true)
;let sValue = GetWindowTextEx (hFrom, FALSE, FALSE)
If StringIsBlank (sValue) then
	Say(msgCannotRetrieveSendersAddress,OT_ERROR)
	Return
EndIf
; Placed here for the user to know that the script is started...
SayUsingVoice(VCTX_MESSAGE,msgReplyingToSender,OT_USER_REQUESTED_INFORMATION)
let sValue = StringSegment (temp, SC_EMailStart + SC_EMailEnd, 2)
if stringIsBlank (sValue) then
	; In case multiple addresses are present, capture the last one which is the user, or 'author'.
	let sValue = StringSegment (temp, scListServStartEnd, StringSegmentCount (temp, scListServStartEnd))
endIf
TypeKey(ksReply)
Delay(10)
If Not StringIsBlank (sValue)
&& !AddressMessage(sValue)	 Then
Say(MsgCannotAddressMessage,OT_ERROR)
	Return
EndIf
SpeechOff ()
Delay(2)
SpeechOn ()
let hFocus = GetFocus ()
If GetWindowClass (hFocus) != wc_wwg then
	let hTo = FindWindowWithClassAndId (GetRealWindow (hFocus), cwc_RichEdit20WPT, To_Field)
Else
	let hTo = FindWindowWithClassAndId (GetAppMainWindow (hFocus), cwc_RichEdit20WPT, To_Field)
EndIf
;SayWindowTypeAndText (hTo)
;SayLine (FALSE)
let oClient = GetObjectFromEvent (hTo, OBJID_CLIENT, iChildID, iTemp)
let sValue = oClient.accValue (iChildID)
ComRelease (oClient, true)
If Not StringIsBlank (sValue) then
	Say (GetWindowName (hTo), OT_CONTROL_NAME)
	Say (sValue, OT_USER_REQUESTED_INFORMATION)
EndIf
IndicateControlType (WT_EDIT, cScSpace)
EndScript

Void Function WindowCreatedEvent (handle hWindow, int nLeft, int nTop, int nRight, int nBottom)
var
	Handle hFocus,
	Handle hStatusBar,
	string sInfoBarText,
	int iControl,
	String sClass,
	String sRealWindowName,
	String sInfo

let sClass = GetWindowClass (hWindow)
let hFocus = GetFocus ()

; Speaking of the folder currently selected.
If sClass == wc_OutlookGrid
&& IsNavigationPane ()
	&& GetObjectSubTypeCode () == WT_TREEVIEWITEM then
	let giReadFolderInfo = GetTreeViewLevel () + 1
	Return
EndIf
; Call Default...
WindowCreatedEvent (hWindow, nLeft, nTop, nRight, nBottom)
EndFunction

script GrowFont1Point()
SayCurrentScriptKeyLabel()
TypeKey(ksGrowFont1Point) ; ControlRightBracket in English
if gbWordIsWindowOwner
&& ! IsActiveDocumentProtected () then  ; in an editable message
	; call SayFontSize function in microsoft word since cannot get point size string from here.
	SayFontSize()
EndIf
EndScript

script ShrinkFont1Point()
SayCurrentScriptKeyLabel()
TypeKey(ksShrinkFont1Point) ; ControlLeftBracket in English
if gbWordIsWindowOwner
&& ! IsActiveDocumentProtected () then  ; in an editable message
	; call SayFontSize function in microsoft word since cannot get point size string from here.
	SayFontSize()
EndIf
EndScript

Script SayCurrentAccessKey()
var
	string sShortcut,
	string sObjectName,
	String sRealWindowName

let sRealWindowName = GetWindowName (GetRealWindow (GetFocus ()))
let sObjectName = GetObjectName (TRUE)
If StringContains (sRealWindowName, scMeetingDialog)
|| StringContains (sRealWindowName, scAppointmentDialog)
|| StringContains (sRealWindowName, scJournalDialogue) then
	let sShortcut = GetCurrentObject (0).accKeyboardShortcut
	If Not StringIsBlank (sShortcut) then
		SayMessage(ot_help,
			FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_L, sObjectName, sShortcut),
			FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_S, sObjectName, sShortcut))
	Else
		SayFormattedMessage (ot_error, cmsg124_L) ;"no hot key"
	EndIf
	Return
EndIf
PerformScript SayCurrentAccessKey()
EndScript


Void Function ClearDateFlag ()
var
	string sDateString,
	String sObjectValue,
	string sYear,
	Int iWeekDay,
	Int iDate,
	Int iDateToGo,
	Int iMonth,
	Int iYear

let giDateIsEntered = 0
SpeechOff ()
SetFocus (ghCalendarPane)
let ghCalendarPane = Null ()
Delay (1)
SpeechOn ()
let sObjectValue = GetObjectValue (TRUE)
If StringIsBlank (sObjectValue) then
	let sObjectValue = GetObjectValue (TRUE, 1)
	If StringIsBlank (sObjectValue) then
		Return
	EndIf
EndIf
ParseLocaleDate (sObjectValue, iWeekDay, iMonth, iDate, iYear)
If Not iYear then
	let sYear = GetCurrentYear (GetCalendarView (), sObjectValue)
	let iYear = StringToInt (sYear)
EndIf
If StringLength (gsDateEntered) > 2 then
	let gsDateEntered = StringLeft (gsDateEntered, 2)
EndIf
let iDateToGo = StringToInt (gsDateEntered)
If iDateToGo > 31 then
		ReadDateTime (0)
		ReadCalendarData(gsDateToProcess, GetCalendarView ())
		Return
EndIf
let sDateString = SysGetDate (GetUserLocaleInfo (LOCALE_SLONGDATE), iMonth, StringToInt (gsDateEntered), iYear)
GoToDateDirectly (sDateString)
Delay (1)
ReadDateTime (0)
ReadCalendarData(gsDateToProcess, GetCalendarView ())
EndFunction



Script StartDirectActivation ()
var
	Handle hStatusLine

If (! IsCalendarView ())
|| IsCalendarViewAppointmentEditBox () then
	SayMessage (OT_ERROR, msgNotInCalendarPane_L, msgNotInCalendarPane_S)
	Return
EndIf
let hStatusLine = FindWindowWithClassAndId (GetRealWindow (GetFocus ()), WC_StatusBarMainWindow, ciStatusBar)
If Not hStatusLine then
	Return
EndIf
let gsDateEntered = cScNull
let ghCalendarPane = GetFocus ()
SetFocus (hStatusLine)
SayMessage (OT_JAWS_MESSAGE, msgTypeDate_L, msgTypeDate_S)
Delay (1)
let giDateIsEntered = ScheduleFunction (FN_ClearDateFlag, 50)
EndScript

script SayCharacter()
If (GlobalCurrentControl==From_Field
|| GlobalCurrentControl==To_Field
|| GlobalCurrentControl==CC_Field
|| GlobalCurrentControl==Bcc_Field
; or new headers for control+shift+b window and appointments:
|| ShouldFocusReadCharByField (getWindowName (getFocus ()))) Then
		;test for graphical Email address in header fields:
		if StringLength(GetCharacter()) >= 2 && ! stringIsBlank (getCharacter ()) then
			SayField()
			return
	endIf
endIf
Performscript SayCharacter()
endScript

String Function GetMessageListKeyName (string sMessageInformation)
var
	Int i,
	Int iNumberOfColumns = StringSegmentCount (sMessageInformation, cScBufferNewLine),
	String sSegment,
	String sKeyName = "OML" + IntToString (GetCurrentControlID ())

For i = 2 To iNumberOfColumns	; starting from second column, because we need to avoid different column names in the first column.
	sSegment = StringSegment (sMessageInformation, cScBufferNewLine, i)
	If Not StringIsBlank (sSegment)
		sKeyName = sKeyName + StringLeft (sSegment, 1)
	EndIf
EndFor
Return (sKeyName)
EndFunction

String Function StringFilterOutMessageInformation (string sMessageInformation, optional int iBrailleFlag)
var
	Int i,
	Int iNumberOfColumns = StringSegmentCount (sMessageInformation, cScBufferNewLine),
	Int iBehaviour,
	Int iPosition,
	String sSegment,
	String sVoiceName,
	String sBehaviour,
	String sFiltered,
	String sFilterString,
	String sKeyName = GetMessageListKeyName (sMessageInformation)

If Not iBrailleFlag
	If StringIsBlank (gsSpeechFilter)
		gsSpeechFilter = IniReadString (section_CustomizeColumn_Options, sKeyName, cScNull, GetActiveConfiguration () + cScPeriod + cScJcf)
	EndIf
	sFilterString = gsSpeechFilter
Else
	If StringIsBlank (gsBrailleFilter)
		gsBrailleFilter = IniReadString (section_CustomizeColumn_Options, sKeyName, cScNull, GetActiveConfiguration () + cScPeriod + cScJBS)
	EndIf
	sFilterString = gsBrailleFilter
EndIf
If Not StringIsBlank (sFilterString)
	sSegment = StringSegment (sFilterString, cscListSeparator, 1)
	iBehaviour = StringToInt (StringSegment (sSegment, cScColon, 1))
	If StringContainsChars (sSegment, cScColon)
		sVoiceName = StringSegment (sSegment, cScColon, 2)
	EndIf
EndIf
For i = 1 To iNumberOfColumns
	sBehaviour = StringSegment (sFilterString, cscListSeparator, i + 1)
	iPosition = StringToInt (sBehaviour)
	If iPosition >= 0
		;If iPosition < 0 then
			;let iPosition = iPosition * (-1)
		;EndIf
		If Not Iposition
			iPosition = i
		EndIf
		sSegment = StringSegment (sMessageInformation, cScBufferNewLine, iPosition)
		If Not StringIsBlank (sSegment)
			If StringRight (sSegment, 1) != LIST_ITEM_SEPARATOR
				If iBehaviour
					If Not StringIsBlank (sVoiceName)
						sFiltered = sFiltered + FormatString (MSG_VoiceNameStart_Template, sVoiceName)
					EndIf
					If StringLeft (sBehaviour, 1) != SC_Dash
						If iBehaviour == 1	; header or text
							If StringContainsChars (sBehaviour, cScColon)
								sFiltered = sFiltered + StringSegment (sBehaviour, cScColon, 2)
							Else
								sFiltered = sFiltered + StringSegment (sSegment, LIST_ITEM_SEPARATOR, 1)
							EndIf
						ElIf iBehaviour == 2	; Header and text
							sFiltered = sFiltered + StringSegment (sSegment, LIST_ITEM_SEPARATOR, 1)
							If StringContainsChars (sBehaviour, cScColon)
								sFiltered = sFiltered + StringSegment (sBehaviour, cScColon, 2)
							EndIf
						ElIf iBehaviour == 3	; text only
							If StringContainsChars (sBehaviour, cScColon)
								sFiltered = sFiltered + StringSegment (sBehaviour, cScColon, 2)
							EndIf
						EndIf	; end of behaviour selection...
					EndIf
					If Not StringIsBlank (sVoiceName)
						sFiltered = sFiltered + MSG_VoiceNameEnd_Template
					EndIf
					sFiltered = sFiltered + cScSpace
				EndIf
				sFiltered = sFiltered + StringSegment (sSegment, LIST_ITEM_SEPARATOR, -1) + cScBufferNewLine
			EndIf
		EndIf
	EndIf
EndFor
If iBrailleFlag
	sFiltered = StringReplaceChars (sFiltered, cScBufferNewLine, cScSpace)
EndIf
Return (sFiltered)
EndFunction

script ReadListviewColumn()
var
	int nCol,
	int nMaxCols,
	string sHeader,
	string sText,
	String sMessageInformation,
	handle hFocus = getFocus ()

If GetWindowClass (hFocus)
&& IsInOutlookMainWindow (hFocus)
	let nCol = StringToInt (StringRight (GetCurrentScriptKeyName (), 1))
	If Not nCol then
		let nCol = 10
	EndIf
	If nCol < 1 then
		let nCol = 1
	EndIf
	let sMessageInformation = GetMessageInformation (FALSE, TRUE)
	let nMaxCols = StringSegmentCount (sMessageInformation, cScBufferNewLine)
	If nCol > nMaxCols then
		SayFormattedMessage (OT_ERROR, FormatString (cmsgListviewContainsXColumns_L, IntToString (nCol), IntToString (nMaxCols)), FormatString (cmsgListviewContainsXColumns_S, IntToString (nCol)))
		Return
	EndIf
	let sHeader = StringSegment (sMessageInformation, cScBufferNewLine, nCol)
	If StringRight (sHeader, 1) != LIST_ITEM_SEPARATOR then
		let sText = StringSegment (sHeader, LIST_ITEM_SEPARATOR, -1)
		let sHeader = StringSegment (sHeader, LIST_ITEM_SEPARATOR, 1)
	Else
		let sHeader = stringChopRight (sHeader, 1)
	EndIf
	Say (sHeader ,OT_NO_DISABLE)
	Say (sText, OT_NO_DISABLE, TRUE)
	BrailleMessage (smmStripMarkup (sHeader) + smmStripMarkup (sText), FALSE)
	Return
EndIf
PerformScript ReadListviewColumn()
EndScript

script CustomizeListView()
var
	Int i,
	Int iNumberOfHeaders,
	String sHeadersAndSchemas,
	String sHeaders,
	String sSegment,
	String sKeyName

If ! (getRunningFSProducts () & product_JAWS)
	Return
EndIf
If IsMessagesList ()
	UIARefresh (TRUE)
	sHeadersAndSchemas = GetMessageInformation (FALSE, TRUE)
	iNumberOfHeaders = StringSegmentCount (sHeadersAndSchemas, cScBufferNewLine)
	sKeyName = GetMessageListKeyName (sHeadersAndSchemas)
	For i = 1 To iNumberOfHeaders
		sSegment = StringSegment (sHeadersAndSchemas, cScBufferNewLine, i)
		sHeaders = sHeaders + StringSegment (sSegment, LIST_ITEM_SEPARATOR, 1) + _DLG_SEPARATOR
	EndFor
	sHeaders = stringChopRight (sHeaders, 1)
	DlgCustomizeColumns (smmStripMarkup (sHeaders), sKeyName, DLG_CustomizeOutlookMessageListTitle, gsSpeechFilter, gsBrailleFilter)
	Return
EndIf
PerformScript CustomizeListView ()
endScript

Int Function DlgSelectItemInList (String Items, String DialogName, Int nSort,optional  Int nDefaultSelectedIndex, String sButtonList, Int byref nButtonIndex)
If IsMessagesList ()
&& StringContains (Items, CustomizeListViewItem) then
	let Items = StringReplaceSubstrings (Items, CustomizeListViewItem, CustomizeOutlookMessageListItem)
EndIf
Return (DlgSelectItemInList (Items, DialogName, nSort, nDefaultSelectedIndex, sButtonList, nButtonIndex))
EndFunction

String function FindHotKey(string ByRef sPrompt)
;overwritten here to handle the case where a checkbox is read with the check state included in the prompt:
var
	handle hFocus = GetFocus (),
	string sHotKey

If (!gbWordIsWindowOwner)
&& (! inRibbons ())
&& (! inOptionsDialog (hFocus))
	If getObjectSubtypeCode () == WT_CHECKBOX
		sPrompt = getObjectName (TRUE)	; cannot use GetWindowTextEx as it retrieves the check state as well.
		sHotkey = getHotkey ()
		Return (sHotkey)
	EndIf
EndIf
Return (FindHotKey (sPrompt))
EndFunction

Script OpenListBox()
If IsCalendarView () then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	Return
EndIf
; attachments are now buttons in the document,
; and alt+DownArrow  is used like the context menu key.
if GetObjectSubTypeCode () == WT_BUTTON then
	SayCurrentScriptKeyLabel ()
	typeKey (cksAltDownArrow)
	return
endIf
PerformScript OpenListBox()
EndScript

Script CloseListBox()
If IsCalendarView () then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	Return
EndIf
; attachments are now buttons in the document,
; and alt+DownArrow  is used like the context menu key.
if GetObjectSubTypeCode () == WT_BUTTON then
	SayCurrentScriptKeyLabel ()
	typeKey (cksAltDownArrow)
	return
endIf
PerformScript CloseListBox()
EndScript

Script VirtualEnter()
if UserBufferIsActive()
|| isVirtualPCCursor() then
	sayCurrentScriptKeyLabel()
	EnterKey()
EndIf
EndScript

Int Function GetMSAAColourAtComboBox ()
var
	Handle hFocus,
	String sObjectValue,
	String sCharacter,
	Int iColour,
	Int iLeft,
	Int iTop,
	Int iRight,
	Int iBottom

let hFocus = GetFocus ()
let sObjectValue = GetObjectValue (TRUE)
If StringLength (sObjectValue) > 2 then
	Return (-1)
EndIf
If Not StringLength (sObjectValue) then
	If GetWindowRect (hFocus, iLeft, iRight, iTop, iBottom) then
		Return (GetColorAtPoint (iLeft + (iRight - iLeft) / 2, iTop + (iBottom - iTop) / 2))
	EndIf
EndIf
let sCharacter = stringChopRight (sObjectValue, 1)
If Not StringIsBlank (sCharacter) then
	let iColour = GetCharacterValue (sCharacter)
EndIf
let sCharacter = StringRight (sObjectValue, 1)
If Not StringIsBlank (sCharacter) then
	If iColour then
		let iColour = iColour + GetCharacterValue (sCharacter) * 0x10000
	Else
		let iColour = GetCharacterValue (sCharacter)
	EndIf
EndIf
Return (iColour)
EndFunction


int function HasAncestorOfType( int Type )
var int count = GetAncestorCount ()
var int level = 0
while ( level <= count )
if GetObjectSubTypeCode (FALSE, level) == type
	return true
EndIf

level = level + 1;
EndWhile

return false
EndFunction

globals
	int gSuppressLeavingMenusOutlook2013

Void Function MenuModeEvent (handle WinHandle, int mode)
if IsVirtualRibbonActive() then
	return Default::MenuModeEvent (WinHandle, mode)
endIf
if mode == 0 then
; in case atmentionsActiveSuggestion was active, destroy to prevent ghosting:
	CollectionRemoveAll (atmentionsActiveSuggestion)
	atmentionsActiveSuggestion = null ()
endIf
if GetWindowClass( GetFocus() ) == "NetUIHWND"
&& HasAncestorOfType( WT_MENUBAR )
	gSuppressLeavingMenusOutlook2013 = mode != menu_inactive;
	return
EndIf

if gSuppressLeavingMenusOutlook2013
gSuppressLeavingMenusOutlook2013 = false;
	if mode == menu_inactive
		return
	EndIf
EndIf

MenuModeEvent ( WinHandle, mode )
EndFunction

int function IsAttachmentsListField()
var
	handle hFocus,
	string sClass,
	int cID
let hFocus = GetFocus()
let sClass = GetWindowClass(hFocus)
let cID = GetControlID(hFocus)
return (sClass == cwc_richEdit20wpt && cID == ci_EditableMessageAttachmentList)
	|| (sClass == wc_AfxWndW&& cID == ciAttachmentList)
EndFunction

Void Function SayWindowTitleForApplication (Handle hApp, Handle hReal, Handle hWnd, Int iType)
Var
	String sText1 = GetWindowName(hApp),
	String sText2,
	String sText3

If IsMessagesList ()
	If hReal != hApp
		If hReal != hWnd
			sText2 = GetWindowName (hReal)
		EndIf
	EndIf
	SayMessage(ot_USER_REQUESTED_INFORMATION,
		FormatString (cmsg29_L, sText1, sText2),
		FormatString (cMsg29_S, sText1, sText2))
	Return
EndIf
Return (SayWindowTitleForApplication (hApp, hReal, hWnd, iType))
EndFunction

Void Function SayAnyHTMLTitleInformation ()
If IsVirtualPCCursor()
&& IsMessageTextWindow (GetFocus ())
	Return
EndIf
Return (SayAnyHTMLTitleInformation ())
EndFunction

Void Function SayTextSelection (String Select, String sText, Int bUseOTChar, Optional Int bContainsSpeechMarkup)
Var
	Int OT

;OT should be Word unless selecting by char so that each unit selected doesn't have its case indicated
;unless the user has requested the indication for Words
If bUseOTChar
	OT = OT_CHAR
Else
	OT = OT_WORD
EndIf
If GetRunningFSProducts() == product_MAGic
	Return
EndIf
If IsMessagesList ()
	SayMessage (OT_SELECT, select)
	Return
EndIf
Return (SayTextSelection (Select, sText, bUseOTChar, bContainsSpeechMarkup))
EndFunction

script ReadMistakeAndSuggestion ()
Var
	Handle hFocus = GetFocus ()

If IsMessageTextWindow (hFocus)
	PerformScript ReadMistakeAndSuggestion ()
	Return
EndIf
SayMessage (OT_ERROR, MSG_SpellCheckerNeeded_L, MSG_SpellCheckerNeeded_S)
EndScript

Void Function DocumentLoadedEvent()
var
	int iLinkCount
if IsReadOnlyMessage() then
	if gbMessageLinkCountIndication then
		let iLinkCount=GetLinkCount()
		if iLinkCount>0 then
			if shouldItemSpeak (OT_HELP) == MESSAGE_LONG then
				SayUsingVoice(vctx_message,FormatString(msgMessageLinkCount,IntToString(iLinkCount)),ot_help)
			else
				SayUsingVoice(vctx_message,FormatString(msgMessageLinkCount_S,IntToString(iLinkCount)),ot_help)
			endIf
		EndIf
	EndIf
	if giOutlookMessageSayAllVerbosity then
		performScript SayAll()
	EndIf
EndIf
EndFunction

Void Function TextSelectedEvent(string strText, int bUnSelecting,optional  int bContainsSpeechMarkup)
Var
	String sChopped,
	String sNoMarkup = strText,
	Int iNoMarkupLength
If gbSelectingTextBetweenMarkedPlaceAndCurrentPosition
	;the script will announce that text was selected between marked place and current position,
	;so do not speak the selected text:
	Return
EndIf
If bContainsSpeechMarkup
	sNoMarkup = smmStripMarkup (strText)
EndIf
iNoMarkupLength = StringLength (sNoMarkup)
; we are selecting either by character or by word.
; if we are selecting by character then the length of the fragment is 1
; if we are selecting by word then the fragment does not contain spaces.
If IsVirtualPCCursor ()
	If (iNoMarkupLength > 1
	&& StringContainsChars (sNoMarkup, cScSpace))
	|| iNoMarkupLength == 1
		nSaySelectAfter = TRUE
		If bUnSelecting
			If iNoMarkupLength >= 1000
			&& !(GetRunningFSProducts() == product_MAGic) then
				SayFormattedMessage (OT_SELECT,cmsg214_L)
				SayMessage (OT_NO_DISABLE, FormatString (cmsg380, IntToString ((iNoMarkupLength-20))))
				let sChopped =StringChopRight (sNoMarkup, (iNoMarkupLength-20))
				SayMessage (OT_WORD, sChopped)
			else; Less than 1000 characters
				SayTextSelection (cmsg214_L, strText, iNoMarkupLength == 1, bContainsSpeechMarkup)
			EndIf
		Else ; selecting forward:
			If iNoMarkupLength >= 1000
			&& !(GetRunningFSProducts() == product_MAGic) then
				SayFormattedMessage (OT_SELECT,cmsg215_L)
				SayMessage (OT_NO_DISABLE, FormatString (cmsg380, IntToString ((iNoMarkupLength-20))))
				let sChopped=StringChopLeft(sNoMarkup, (iNoMarkupLength-20))
				SayMessage (OT_WORD, sChopped)
			else
				SayTextSelection (cmsg215_L, strText, iNoMarkupLength == 1, bContainsSpeechMarkup)
			EndIf
		EndIf
		Return
	EndIf
EndIf
Return (TextSelectedEvent (strText, bUnSelecting, bContainsSpeechMarkup))
EndFunction

String Function PositionInGroup (optional Handle hWnd)
Var
	Handle hReal = GetRealWindow (hWnd),
	Int iControlID = GetControlID (hWnd),
	Int iWindowType = GetWindowSubtypeCode (hWnd)

If Not hWnd
	hWnd = GetFocus ()
	hReal = GetRealWindow (hWnd)
	iControlID = GetControlID (hWnd)
	iWindowType = GetWindowSubtypeCode (hWnd)
EndIf
; In case day or month recurrence is selected...
If StringContains (GetWindowIDString (hReal), AppointmentRecurrenceStringIDStart)	; we are in recurrence dialogue...
	If iWindowType == WT_RADIOBUTTON
		; day radio-button selected...
		If iControlID == ciRecurrencePatternDailyEvery
		|| iControlID == ciRecurrencePatternDailyWeekday
			Return (FormatString (MSG_PositionInformation, IntToString (iControlID - ciRecurrencePatternDailyEvery + 1),IntToString (2)))
		EndIf
		; month radio-button selected...
		If iControlID == ciRecurrencePatternMonthlyDay
		|| iControlID == ciRecurrencePatternMonthlyThe
			Return (FormatString (MSG_PositionInformation, IntToString (iControlID - ciRecurrencePatternMonthlyDay + 1),IntToString (2)))
		EndIf
	EndIf
EndIf
Return (PositionInGroup (hWnd))
EndFunction

string function GetStatusBarWindowInfo()
;In Outlook 2013, we must use UIA object data to get the status bar data for the message list.
var
	handle hApp,
	handle hSeekDepth,
	handle hSeekBreadth,
	handle hStatusBar,
	object oTree,
	object oItem,
	string sInfo,
	string s
;First, find the window that has the status bar objects:
let hApp = GetAppMainWindow(GetFocus())
if GetWindowClass(hApp) != wc_Rctrl_RenWnd32 then
	return cscNull
EndIf
let hSeekDepth = GetFirstChild(hApp)
while hSeekDepth && !hStatusBar
	let hSeekBreadth = hSeekDepth
	while GetWindowClass(hSeekBreadth) == wc_MsoCommandBarDock
	&& GetFirstChild(hSeekDepth)
		let hSeekDepth = GetFirstChild(hSeekDepth)
	EndWhile
	if GetWindowClass(hSeekDepth) == cwc_NetUIHwnd then
		let hStatusBar = hSeekDepth
	else
		let hSeekDepth = GetNextWindow(hSeekBreadth)
	EndIf
EndWhile
if !hStatusBar then
	return cscNull
EndIf
let oTree = GetUIAObjectTree(hStatusBar)
if !oTree then
	return cscNull
EndIf
let oItem = oTree.FirstChild
if oItem.Name != wn_StatusBar then
	return cscNull
EndIf
let oItem = oItem.FirstChild
while oItem
	if oItem.ClassName == objn_NetUISimpleButton then
		let s = oItem.Name
		let sInfo = sInfo+cscBufferNewLine+s
	EndIf
	let oItem = oItem.nextSibling
EndWhile
return StringChopLeft(sInfo,1)
EndFunction

script SayBottomLineOfWindow()
var
	string sStatusBar
if !DialogActive()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	let sStatusBar = GetStatusBarWindowInfo()
	if sStatusBar then
		Say(sStatusBar,ot_user_requested_information)
		return
	EndIf
EndIf
PerformScript SayBottomLineOfWindow()
EndScript

Int Function ShouldMessageTypeSpeak ()
; Temprorary solution till moving a function using this to Outlook Message.jss file.
Return (giOutlookMessageTypeVerbosity)
EndFunction

void function QuickSettingsPreProcess ()
SetQuickKeyNavigationState (OFF)
QuickSettingsPreProcess ()
EndFunction

void Function ReadWordInContext(optional int bIgnoreNotFoundMessage)
; Word in Context not usable in new versions of Outlook.
SayMessage (OT_ERROR, msgReadWordInContextNotAvailableInOutlook2013)
EndFunction

Script selectAField ()
EnsureNoUserBufferActive()
; parameter to IsDocumentAreaScriptException ensures proper Outlook error handling.
if IsDocumentAreaScriptException (TRUE) then
	return
EndIf
ListFields()
EndScript

Script AltF4 ()
; run from Word to release its objects:
performScript AltF4 ()
EndScript

script TestScript ()
var
	string calendarString,
	string textFromUIA = getObjectName (TRUE)
calendarString = ParseOutlookCalendarUIAText (textFromUIA, GetUserLocaleInfo (LOCALE_SABBREVLANGNAME))
sayString (calendarString)
endScript


Script Incidenterstellen ()
Var
	Handle hwnd

	hwnd = FindWindow (GetAppMainWindow (GetFocus ()), "", "Incident erstellen")
	if hwnd Then
		SetFocus (hwnd)
	Else
		SayString ("Nicht gefunden")
	Endif
EndScript

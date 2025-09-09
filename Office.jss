; Copyright 1995-2023 Freedom Scientific, Inc.
; JAWS Script file for Office common components, versions 2016 and O365.

include "hjConst.jsh"
include "MSAAConst.jsh"
include "hjGlobal.jsh"
include "winstyles.jsh"
include "uia.jsh"
include "common.jsm"
include "office.jsh"
include "msoffice2007.jsm"
Include "TutorialHelp.jsm"
include "outlook message.jsh"
include "outlook message.jsm"

import "UIA.jsd"
use "OutlookMessage.jsb"

CONST
; From UIANotificationEvent where the clipboard is being changed.
	Office_Clipboard_Notification_Activity_ID = "AccSN3"

GLOBALS
	string LastOfficeApplicationConfigName, ; for dynamically switching into and out of Office Help 2007 scripts.
	int LastUIATextChangeTime, ; shared with Word.jss -> UIATextEditTextChangedEvent
	int VirtualPcCursorApplicationSetting,
	int giForegroundCategory,
	int globalSuppressHighlightedText,
	int GlobalTemporaryContextMenuState,
	int officeVersion,
	int officeMinorVersion

;for braille flash messages that must be scheduled
;because the message would otherwise be obliterated by screen updates:
globals
	int giScheduledFlashBrlMessage,
	string msgScheduledBrlFlash

;for Office UIA event listeners:
const
	AutoCorrectTextUIAThreshold = 10,
	oUIA_Office_EventFunctionNamePrefix = "Office",
	AutomationID_AtMention_Prefix = "cardEditor_"
globals
	object oUIA_Office,
	object oUIAAtMentionsSelectionChangeListener,
	object oAtMentionSelectedItem,
	object oUIA_OfficeToasts,
	string prevOfficeToastMessage,
	handle ghAppWindowForDetectingOfficeToasts

;Office global is needed to save a test for the previous focus being the Office splash screen.
;See note in office.jss FocusChangedEventEx:
globals
	int gbWasSplashScreenInOfficeFocusChangedEventEx

; Because function GetCurrentScriptKeyName returns the script name of the most recent key belonging to a script,
; and is not null if the most recent key was not a script key,
; we use collection col_KeyPressedInfo to determine if the most recent key pressed was a script and if so what it was.
; ScriptNames_ValueChangedWhenEditing contains segments with script names for comparison against the script name in col_KeyPressedInfo.
; See functions PreProcessKeyPressedEvent & ValueChangedEvent.
const
	ScriptNames_ValueChangedWhenEditing = "|JAWSDelete|JAWSBackspace|ControlBackSpace|",
	scriptNames_Segment = "|%1|"
globals
	collection col_KeyPressedInfo
		; members are:
		; scriptName -- the name of the script attached to the most recently pressed key.
		; isScriptKey -- true if the most recently pressed key is a script key, false otherwise.
		; ValueChanged -- True if the ValueChangedEvent fired and processed the key pressed info, false otherwise.

;ValueChangedEvent may fire more than once when navigating the list 
;of choices in edit combos, especially those in SDM dialogs.
;We use the following const and global to attempt to suppress double speaking while navigating in the list associated with these editcombos.
;The global is initialized in autostart to ensure that GetTickCount()-LastEditComboTick is greater than EditComboTickRepeatThreshhold.
const EditComboTickRepeatThreshhold = 50 ;milliseconds
globals int LastEditComboTick

int function isOffice365 ()
if OfficeVersion < 16 then return FALSE endIf
if OfficeVersion == 16 then
	if officeMinorVersion < 6700 then
		return FALSE
	else
		return TRUE
	endIf
elIf OfficeVersion == 17 then
	; if officeMinorVersion == retailVersion then
		; return formatString (msgRetail, appName)
	;else
		return TRUE
	;endIf
else ; unknown newer Office
	return TRUE
endIf
endFunction

string function GetOfficePurchaseInfo (string appName)
; for 16 and later, earlier returns the in string unchanged.
if OfficeVersion == 16 then
	if officeMinorVersion < 6700 then
		return formatString (msgRetail, appName)
	else
		return formatString (msgSubscription, appName)
	endIf
elIf OfficeVersion == 17 then
	; if officeMinorVersion == retailVersion then
		; return formatString (msgRetail, appName)
	;else
		return formatString (msgSubscription, appName)
	;endIf
else ; unknown newer Office
	return formatString (msgSubscription, appName)
endIf
endFunction

int function ListenForAtMentionSelectionChange()
var object oElement = FSUIAGetFocusedElement(true)
if !StringStartsWith (oElement.automationID, AutomationID_AtMention_Prefix)
	oUIAAtMentionsSelectionChangeListener = Null()
	oAtMentionSelectedItem = Null()
	return false
endIf
if oUIAAtMentionsSelectionChangeListener return true endIf
oUIAAtMentionsSelectionChangeListener = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !ComAttachEvents(oUIAAtMentionsSelectionChangeListener,oUIA_Office_EventFunctionNamePrefix)
	oUIAAtMentionsSelectionChangeListener = Null()
	oAtMentionSelectedItem = Null()
	return false
endIf
oElement = oElement.controllerFor(0)
if !oUIAAtMentionsSelectionChangeListener.AddPropertyChangedEventHandler( UIA_SelectionItemIsSelectedPropertyId, oElement, TreeScope_Children)
	oUIAAtMentionsSelectionChangeListener = Null()
	oAtMentionSelectedItem = Null()
	return false
endIf
var object oCondition = oUIAAtMentionsSelectionChangeListener.createBoolPropertyCondition(UIA_SelectionItemIsSelectedPropertyId, true)
oElement = oElement.findFirst(TreeScope_Children, oCondition)
oAtMentionSelectedItem = oElement
Say (oAtMentionSelectedItem.name, OT_LINE)
Say (PositionInGroupFromUIA (oAtMentionSelectedItem), OT_POSITION)
return TRUE
EndFunction

void function OfficePropertyChangedEvent(object element, int propertyID, variant newValue)
if propertyID == UIA_SelectionItemIsSelectedPropertyId
&& element.GetSelectionItemPattern().isSelected
	Say (element.name, OT_LINE)
	Say (PositionInGroupFromUIA (element), OT_POSITION)
	oAtMentionSelectedItem = element
	scheduleFunction("brailleRefresh",1)
	return
endIf
if element.name == oAtMentionSelectedItem.name
&& element.positionInSet != oAtMentionSelectedItem.positionInSet
	;When backspacing there is a property change for the item being unselected,
	;but no property change for the item that becomes selected.
	;Get the parent of the list items and find and speak the selected item.
var
	object oParent = FSUIAGetParentOfElement (element),
	object oCondition = FSUIACreateBoolCondition (UIA_SelectionItemIsSelectedPropertyId, true)
element = oParent.findFirst(TreeScope_Children, oCondition)
	oAtMentionSelectedItem = element
	Say(oAtMentionSelectedItem.name, OT_LINE)
	Say (PositionInGroupFromUIA (element), OT_POSITION)
	scheduleFunction("brailleRefresh",1)
endIf
EndFunction

void function UIANotificationEvent(int notificationKind, int notificationProcessing, string displayString, string activityId, string appName)
if notificationKind == NotificationKind_ActionCompleted
&& activityId == "AccSN4"
	var string scriptName = GetScriptAssignedTo(GetCurrentScriptKeyName())
	if scriptName == "Undo"
		; Keep JAWS from repeating the notification since we already speak it.
		return
	endIf
endIf
if activityId == "Microsoft.RichEdit.Hotkey.Cut"
	var string cutScriptName = GetScriptAssignedTo(GetCurrentScriptKeyName())
	if cutScriptName == "CutToClipBoard"
		; Keep JAWS from repeating the notification since we already speak it.
		return
	endIf
endIf
if ActivityID == Office_Clipboard_Notification_Activity_ID then
; Keep JAWS from repeating the notification since we already speak it.
	return
endIf
UIANotificationEvent (notificationKind, notificationProcessing, displayString, activityId, appName)
endFunction


int function getFocusStylesGalleryItemInfo (string byRef name, int byRef isSelectable)
; alt h, l = styles gallery, grid of buttons who can be selected.
if GetObjectClassName() != GalleryButtonClassName return FALSE endIf
if GetObjectStateCode() & CTRL_SELECTED
	isSelectable = true
endIf
name = GetObjectName()
if !name
	var object element = FSUIAGetFocusedElement(TRUE); button with focus inside group with focus
	name = element.name
endIf
if stringStartsWith (name, ParagraphMarker)
	; trim off leading erroneous text:
	name = stringChopLeft (name, 1)
	name = stringTrimLeadingBlanks (name)
endIf
return TRUE
endFunction

Void Function SayGalleryButtonInfo (string sGalleryButtonName, string sHelp)
sayControlEXWithMarkup (0, sGalleryButtonName, GetControlTypeName (WT_BUTTON), getObjectState (TRUE))
if stringCompare (sGalleryButtonName, sHelp) != 0 then
	sayMessage (OT_SCREEN_MESSAGE, sHelp)
endIf
sayMessage (OT_POSITION, PositionInGroup ())
EndFunction

int function InCustomCheckableListBox()
; Can be found in backstage Options > Category Proofing > Settings... Options for Grammar.
; standard checkable list code doesn't work here.
return !ControlCanBeChecked ()
	&& getObjectClassName () == "ListBox" 
	&& getObjectSubtypeCode () == WT_CHECKBOX
endFunction

void function SayObjectStateForFocusedCheckableListBoxItem()
var int state = GetObjectStateCode (TRUE)
if state & CTRL_CHECKED
	indicateControlState (WT_LISTBOXITEM, CTRL_CHECKED)
elif state & CTRL_UNCHECKED
	indicateControlState (WT_LISTBOXITEM, CTRL_UNCHECKED)
endIf
endFunction

int function BrailleObjectStateForFocusedCheckableListBoxItem ()
; Called by BrailleAddObjectState:
var
	int state = GetObjectStateCode (TRUE),
	string brlStateString,
	int doNotTranslate = TRUE
if state & CTRL_CHECKED
	brlStateString = BrailleGetStateString (CTRL_CHECKED)
elIf state & CTRL_UNCHECKED
	brlStateString = BrailleGetStateString (CTRL_UNCHECKED)
endIf
If !stringIsBlank (brlStateString)
	BrailleAddString(brlStateString, 0,0,0, DoNotTranslate)
	return TRUE
endIf
return FALSE
endFunction

void function SayObjectTypeAndTextForFocusedCheckableListBoxItem()
var
	handle focusWindow = getFocus (),
	int UIAState = GetObjectStateCode (TRUE),
	string StateString,
	string ListBoxName = getObjectName (),
	string ListItemName = getObjectName(SOURCE_CACHED_DATA)
; These states correspond to the UIA element's togglePattern.
if UIAState & CTRL_CHECKED then
	stateString = cMsg_Checked
elIf UIAState & CTRL_UNCHECKED then
	stateString = cMsg_NotChecked
endIf
sayControlExWithMarkup (focusWindow, ListBoxName, getWindowType (focusWindow), stateString, "", "", ListItemName)
endFunction

string function getHotKey (optional handle window)
var
	object element = FSUIAGetFocusedElement(TRUE),
	string hotKey = getHotKey (window)
if !element return hotKey endIf
if (element.acceleratorKey) return element.acceleratorKey endIf
if (element.AccessKey) return element.accessKey endIf
return hotKey
endFunction

int function BrailleAddObjectHotKey (int subtypeCode)
if subtypeCode == WT_LOWERRibbon 
|| subTypeCode == WT_UPPERRIBBON 
|| subTypeCode == WT_BUTTON 
|| inRibbons ()
|| IsFileListItem () then
	var string hotkey = getHotKey (GetFocus ())
	if hotKey then
		BrailleAddString (hotKey, 0,0,0)
		return TRUE
	endIf
endIf
return 0
endFunction

int function BrailleAddObjectDescription (int subtypeCode)
if subtypeCode != WT_GRID then
	return BrailleAddObjectDescription (subtypeCode)
endIf
if getObjectClassName () != "NetUIGalleryButton"
|| getObjectClassName (1) != "NetUIGalleryCategoryContainer" then
	return BrailleAddObjectDescription (subtypeCode)
endIf
var string description = getObjectHelp ()
if stringIsBlank (description)
|| stringCompare (GetObjectName (), description) == 0
	return BrailleAddObjectDescription (subtypeCode)
endIf
BrailleAddString (description, 0,0,0)
return TRUE
endFunction

int function IsListeningForToastsInApp(handle hWnd)
return hWnd == ghAppWindowForDetectingOfficeToasts 
EndFunction

void function UnhookLiveRegionChangedEvent()
;For apps which open separate documents in separate application windows,
;we need to be able to unhook and rehook the event so that we are listening to the element in the correct app window.
oUIA_OfficeToasts = Null()
ghAppWindowForDetectingOfficeToasts = Null()
EndFunction

void function InitUIAAndHookLiveRegionChangedEvent()
;Some apps open separate documents in separate app windows.
;ghAppWindowForDetectingOfficeToasts is the app window where toasts are currently being detected.
;when moving directly from one app window to another,
;the listener must be re-established for the new app and ghAppWindowForDetectingOfficeToasts must be updated to the new app window.
ghAppWindowForDetectingOfficeToasts = Null()
if !oUIA_OfficeToasts
	oUIA_OfficeToasts = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
endIf
if !oUIA_OfficeToasts then return endIf
if !ComAttachEvents(oUIA_OfficeToasts,oUIA_Office_EventFunctionNamePrefix) then return endIf
var handle appWindow = getAppMainWindow (getFocus ())
var object element = oUIA_OfficeToasts.GetElementFromHandle(appWindow)
if !element then return endIf
ghAppWindowForDetectingOfficeToasts = appWindow
oUIA_OfficeToasts.AddAutomationEventHandler( UIA_LiveRegionChangedEventId, Element, TREESCOPE_SUBTREE) 
endFunction

void function AutoStartEvent()
LastEditComboTick = GetTickCount()
if !col_KeyPressedInfo col_KeyPressedInfo = new collection endIf
giContextualSpellingErrorColor = getOPTColor("ContextualSpellingWavyUnderlineColor", "000000255")
;Initialize oUIA_Office but not the collection, so we can hook the LiveRegionChangedEvent.
InitUIAAndHookLiveRegionChangedEvent()
officeVersion = GetProgramVersion (GetAppFilePath ())
GetFixedProductVersion (GetAppFilePath (), 0, 0, officeMinorVersion, 0)
VirtualPcCursorApplicationSetting = getJCFOption (OPT_VIRTUAL_PC_CURSOR)
EndFunction

void function AutoFinishEvent()
;unset global because window is destroyed,
;or subsequent returns to window will not speak properly.
if giScheduledFlashBrlMessage then
	unScheduleFunction(giScheduledFlashBrlMessage)
	giScheduledFlashBrlMessage = 0
	msgScheduledBrlFlash = cscNull
endIf
oUIA_Office = Null()
UnhookLiveRegionChangedEvent()
CollectionRemoveAll(col_KeyPressedInfo)
PrevOfficeToastMessage = cscNull
EndFunction

void function OfficeAutomationEvent (object element, int eventID)
if eventID == UIA_LiveRegionChangedEventId then
	return OfficeLiveRegionChangedEvent (element)
endIf
endFunction

void function OfficeLiveRegionChangedEvent (object element)
; This is a very infrequent event in Microsoft Office.
; It handles toasts from within Office applications,
; notifications that appear above the document but below the ribbons.
; Although they are not technically system toasts, Microsoft treats them as such, and so should we.
; Notably when doing real-time co-authoring and collaboration in documents.
if stringIsBlank (element.name) then return endIf
var string message = stringTrimLeadingBlanks (stringTrimTrailingBlanks (element.name))
if message != prevOfficeToastMessage then
	SayMessage (OT_TOASTS, element.name)
endIf
prevOfficeToastMessage  = message
endFunction

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
If !KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) return false endIf
; Browse / Hide folders buttons in open / Save As dialogs:
var
	handle window = getFocus (),
	string ObjectName = GetObjectName(SOURCE_CACHED_DATA),
	int ObjectSubtypeCode = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
if GetWindowSubtypeCode (window) == wt_toolbar 
&& ObjectSubtypeCode == WT_BUTTON then
	if StringCompare (objectName, OBJN_HIDE_FOLDERS_BTN) == 0
	|| StringCompare (ObjectName, OBJN_BROWSE_FOLDERS_BTN) == 0 then
		; This is one tool bar button whose name changes, but the events don't indicate as much.
		MSAARefresh ()
		return true
	endIf
endIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
endFunction

int function ShouldNotifyIfContextHelp ()
if getWindowClass (getFocus ()) == cwc_NetUIHwnd then
	; the false Insert F1 for Help message comes from GetObjectHelp returns new help phrases in Office 2013,
	;and this is not desirable for Speech and Braille to be outputting.
	return false
endIf
return ShouldNotifyIfContextHelp ()
endFunction

int function getOPTColor(string sKey, string sRGBDefault)
; This is in HKEY_CURRENT_USER, which is what the 1 means below.
var string baseKey = "Software\\Microsoft\\Shared Tools\\Proofing Tools"
var int val = getRegistryEntryDWord(1, baseKey, sKey)
; TODO: No difference between value of 0 (black) and failure (no such key).
; Key will not exist if user did not add it.
; Upshot: A custom color of black is not supported.
if !val
; Next condition checks for invalid color, which Office ignores also.
|| (val & 0xFF000000L)
then
	val = RGBStringToColor(sRGBDefault)
endIf
return val
endFunction

void function ScheduleBrailleFlashMessage(string msg, optional int DelayTime, int alsoFormat)
if StringIsBlank(msg) then
	return
endIf
if alsoFormat then
	msg = formatString(msg)
endIf
if giScheduledFlashBrlMessage then
	UnscheduleFunction(giScheduledFlashBrlMessage )
	let msgScheduledBrlFlash = msgScheduledBrlFlash+cscBufferNewLine+msg
else
	let msgScheduledBrlFlash = msg
EndIf
if !DelayTime then
	let giScheduledFlashBrlMessage = ScheduleFunction("FlashBrailleMessage",5)
else
	let giScheduledFlashBrlMessage =
		ScheduleFunction("FlashBrailleMessage",DelayTime)
endIf
EndFunction

void function ScheduleBrailleFlashMessageWithSpeechOutput(
	int UsingSpeechOutputType, string msg,
	optional int DelayTime, int alsoFormat)
if !ShouldItemSpeak(UsingSpeechOutputType) then
	;No message is scheduled because the speech will not speak for this output type
	return
endIf
ScheduleBrailleFlashMessage(msg,DelayTime, alsoFormat)
EndFunction

void function FlashBrailleMessage()
let giScheduledFlashBrlMessage = 0
BrailleMessage(msgScheduledBrlFlash)
let msgScheduledBrlFlash = cscNull
EndFunction

String  Function GetObjectNameOrValue()
Var
	String sName
let sName=getObjectValue(SOURCE_CACHED_DATA)
If ! sName then
	let sName=GetObjectName(SOURCE_CACHED_DATA)
	If !sName then
		let sName=GetWord()
	EndIf
EndIf
return sName
EndFunction

int function ShouldReEvaluateWindowCategoryType(handle hWnd)
return hwnd != ghCategoryWnd
EndFunction

int function GetWindowCategory (optional handle hwnd)
var handle hFocus = GetFocus()
if (!hwnd) hWnd = hFocus endIf
;The user buffer does not have a window handle, 
;so if testing the focus the user buffer is exempt from the handle comparison logic:
if userBufferIsActive()
&& hWnd == hFocus
	return WCAT_UNKNOWN
endIf
if !ShouldReEvaluateWindowCategoryType(hWnd)
	return giWndCategoryType
endIf
ghCategoryWnd = hWnd ;for next time this function runs
return FindWindowCategoryType(hwnd)
EndFunction

int function IsStandardUnknownWindowCategoryType(handle hwnd)
return inHjDialog()
	|| menusActive()
	|| userBufferIsActive()
	|| inRibbons()
	|| getWindowClass(hwnd) == cwc_SysTreeView32
	|| getWindowClass(getRealWindow (hwnd)) == cWc_dlg32770
	|| getWindowClass(getCurrentWindow ()) == cwc_dlg32771  ;testing for alt+tab
EndFunction

int function FindWindowCategoryType(handle hwnd)
if IsStandardUnknownWindowCategoryType(hWnd)
	giWndCategoryType = WCAT_UNKNOWN
	return giWndCategoryType
endIf
var
	string sClass,
	string sName,
	handle hFound,
	int iWindowType,
	int objectType,
	string sOwner,
	handle hGreatGrandParent
sClass = getWindowClass (hwnd)
if (stringContains (stringLower (sClass), stringLower (cwc_RichEdit)))
	hwnd = getParent (hwnd)
	sClass = getWindowClass (hwnd)
endIf
;client area types:
If stringCompare (sClass, wc_Spreadsheet) == 0
	objectType = GetObjectSubtypeCode()
	if GetObjectAutomationID() == AutomationID_CellEdit 
	|| objectType == wt_TabControl
	|| objectType == wt_Multiline_Edit
	|| objectType == wt_edit
		giWndCategoryType = wCat_Unknown
	else
		giWndCategoryType = WCAT_SPREADSHEET
	endIf
	return giWndCategoryType 
elif stringCompare (sClass, cwc_Word_Document2) == 0
|| stringCompare (sClass, cwc_Word_Document) == 0
	giWndCategoryType = WCAT_DOCUMENT
	RETURN giWndCategoryType
elif stringCompare (sClass, wc_wwf) == 0
	giWndCategoryType = WCAT_DOCUMENT_WORKSPACE
	return giWndCategoryType
elIf (stringCompare (sClass, wc_Presentation) == 0)
	giWndCategoryType = WCAT_PRESENTATION
	return giWndCategoryType
elIf getWindowTypeCode(hwnd) == WT_Listview
	; Resolves Braille going into line mode in the Find dialog's listView control.
	giWndCategoryType = WCAT_UNKNOWN
	return giWndCategoryType
endIf
iWindowType = GetWindowSubtypeCode (hWnd)
sOwner = GetOwningAppName (hWnd)
If StringContains (sOwner, an_MSWord)
|| StringContains (sOwner, an_envelope)
	If (iWindowType == WT_MULTILINE_EDIT	; RichEdit20W
	|| iWindowType == WT_EDIT	; RichEdit20WPt
	|| iWindowType == WT_BUTTON)
	&& stringContains (sOwner, an_envelope)
		giWndCategoryType = WCAT_MESSAGE
		Return giWndCategoryType
	EndIf
EndIf
hGreatGrandParent = GetParent (GetParent (GetParent (hWnd)))
If (getWindowClass (hGreatGrandParent) == WC_OutlookMessage
&& StringContains (GetWindowName (hGreatGrandParent), WN_OutlookMessage)
&& GetWindowClass (hWnd) == cwc_RichEdit20W)
	giWndCategoryType = WCAT_MESSAGE
	Return giWndCategoryType
EndIf
while hwnd
	if (stringContains (WC_TASK_PANE_WINDOWS, sClass))
		;these classes also apply to ribbons and status bar toolbars.
		;ribbons were tested for earlier in the function,
		;so test now whether it is a task pane or a status bar toolbar:
		sName = GetWindowName(GetParent(hWnd))
		if sName == wn_StatusBar
			giWndCategoryType = WCAT_STATUSBAR_TOOLBAR
			return giWndCategoryType
		else
			;make sure this is not a customize ribbon button:
			if sName != wn_ribbon then
				giWndCategoryType = WCAT_TASK_PANE
				return giWndCategoryType
			EndIf
		EndIf
	elIf (stringContains (sClass, wc_SINGLE_CLASS))
		giWndCategoryType = WCAT_SINGLE_CLASS
		return giWndCategoryType
	endIf
	hwnd = getParent (hwnd)
	sClass = getWindowClass (hwnd)
endWhile
giWndCategoryType = WCAT_UNKNOWN
return giWndCategoryType
endFunction

int function InTaskPaneDialog()
return getWindowCategory () == WCAT_TASK_PANE
EndFunction


int function SayTutorialHelp (int iObjType, optional int nIsScriptKey)
; for now, remove all tutor messages in ribbons:
if ribbonsActive () then return TRUE endIf
var int nType = iObjType;don't change the param value:
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if (nType == WT_LISTBOXITEM)
	nType = WT_LISTBOX
endIf
return SayTutorialHelp (nType, nIsScriptKey)
endFunction

int function IgnoreObjectAtLevel (int level)
if level == 0 return false endIf
var int levelSubType = GetObjectSubtypeCode(0,level)
if levelSubType == wt_Unknown
&& InRibbons()
	return true
endIf
var	string levelName= GetObjectName(0,level)
if level > 1
&& levelName == GetObjectName(0,1)
	;Filter out duplicated names which repeat their way through the hierarchy.
	;This typically occurs when in a dropped down ribbon item or in the backstage dialogs.
	return true
endIf
var string levelClass = GetObjectClassName(level)
if levelClass == wc_MsoCommandBarDock
|| levelClass == wc_msoCommandBar
|| levelClass == wc_MSOWorkPane
	return true
endIf
if levelSubtype == wt_tabControl
&& levelClass == class_NetUIPanViewer
&& GetObjectSubtypeCode() == wt_tabControl
	;suppress duplicated or non-useful announcements of the ribbon tab:
	;The announcement that this is a ribbon will be spoken by one of the other levels, and the focus object will announce that it is a tab,
	;so don't announce that this is a ribbon tab:
	return true
elif levelSubType == wt_GroupBox
	;Reduce redundant announcements in the backstage:
	var int level0Type = GetObjectSubtypeCode()
	if GetObjectSubtypeCode(false,level+1) == wt_GroupBox
	&& levelName == GetObjectName(false,level+1)
		return true
	elif (levelSubType == wt_TabControl || levelSubType == wt_Dialog_Page || levelSubtype == wt_groupBox)
	&& levelName == GetObjectName()
		return true
	endIf
elif levelSubType == wt_ContextMenu
&& levelName == GetObjectName(false,level+2)
	return true
elif levelSubType == wt_ListBoxItem
&& GetObjectSubtypeCode() == wt_Button
&& levelName == GetObjectName()
	return true
endIf
return IgnoreObjectAtLevel (level)
EndFunction

int function sayObjectTypeAndTextIEServerDialogs (int level)
; this function is for focused controls only.
if level > 0 then return FALSE endIf
if getWindowClass (getFocus ()) != cwcIEServer then return FALSE endIf
var int subtypeCode = getObjectSubtypeCode ()
var string name = getObjectName ()
if stringIsBlank (name) && ! subtypeCode then
	; This control does nothing, Narrator reads it as an extremely long UIA name 
	sayMessage (OT_CONTROL_NAME, msgCustomControl)
	return TRUE
endIf
if subtypeCode == WT_BUTTON || subtypeCode == WT_CHECKBOX then
; extremely chatty when arrowing onto these items in the grid:
; can't just use indicateControlType as this has a state, and indicateControlState is just for state change:
	sayControlEX (getFocus (), name, getObjectType (), getObjectState (),
		cscBufferNewLine, cscBufferNewLine, cscBufferNewLine, cscBufferNewLine, cscBufferNewLine)
	return TRUE
endIf
return FALSE
endFunction

void function sayObjectTypeAndText (optional int nDepth, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nDepth,includeContainerName) return endIf
if sayObjectTypeAndTextIEServerDialogs (nDepth) then return endIf
var
	Handle hFocus = GetFocus (),
	int iSubtype = -1, ; -1 is an indication that we didn't call getObjectSubtypeCode yet. We want to minimize those.
	string sName = GetObjectName(SOURCE_CACHED_DATA),
	string sHelp = GetObjectHelp (false, nDepth),
	string sValue,
	string GalleryButtonName, int galleryButtonIsSelectable
if InCustomCheckableListBox() then
	return SayObjectTypeAndTextForFocusedCheckableListBoxItem ()
endIf
if dialogActive ()
&& getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDITCOMBO then
; a few cases in dialogs where combo box and edit combo both get read:
	iSubtype = getObjectSubtypeCode(SOURCE_CACHED_DATA, nDepth)
	if iSubtype == WT_COMBOBOX then
		return
	elIf iSubtype == WT_DIALOG_PAGE || iSubtype == WT_GROUPBOX then
	;sayObjectTypeAndText tries to speak the value as part of its speech, is is wrong because the value is also spoken by focused control.
	;dialog page type only needs to speak name:
		sayMessage (OT_CONTROL_NAME, getObjectName(SOURCE_CACHED_DATA, nDepth))
		return
	endIf
endIf
if nDepth == 0
	if getFocusStylesGalleryItemInfo (galleryButtonName, galleryButtonIsSelectable) then
		SayGalleryButtonInfo (galleryButtonName, sHelp)
		return
	endIf
	if (iSubtype == -1) iSubtype = getObjectSubtypeCode(SOURCE_CACHED_DATA,nDepth) EndIf
	if GetMenuMode() > 0
	&& iSubtype == WT_MENU 
		if getWindowClass (hFocus) == cwc_NetUIHwnd
			var string ParentName = GetObjectName(SOURCE_CACHED_DATA, 1)
			if !GetObjectName(SOURCE_CACHED_DATA, nDepth) 
			&& !StringIsBlank (ParentName) then
				indicateControlType (wt_ButtonDropDown, ParentName)
				return
			elif GetObjectClassName() == class_NetUITWBtnCheckMenuItem
			&& !(GetObjectMSAAState() & STATE_SYSTEM_CHECKED)
			; A check to make sure we're not on the "Open Hyperlink" menu item in an Outlook meeting.
			&& ! (GetObjectIA2State () & STATE_SYSTEM_MOVEABLE)
				;Although the checked state is detected internally,
				;the unchecked state is not detected and is therefore not announced:
				SayObjectTypeAndText()
				Say(cmsg_notchecked,ot_Item_State)
				return
			endIf
		elIf !iSubtype
			sayMessage(ot_control_type,cmsg6_l)
			; The object will be announced when one becomes selected in MenuActiveProcess.
			return
		endIf
	EndIf
	if iSubtype == wt_ListBoxItem
	&& FocusWindowSupportsUIA() then
		SayObjectTypeAndText (nDepth,includeContainerName)
		if stringCompare (sName, sHelp) != 0 then
			say(sHelp,ot_line)
		endIf
		return
	elif iSubtype == WT_LISTBOXITEM 
	&& getWindowClass(hFocus) == wc_NetUIHWND
	&& isWindowVisible (findWindow (hFocus, wc_ReComboBox20W))
		sValue = getObjectName(SOURCE_CACHED_DATA,nDepth)
		if (getCharacterValue (stringLeft (sValue, 1)) == 9658)
			;This is an extra character used to format the field, but causes JAWS to read it as a question:
			sValue = stringRight (sValue, stringLength (sValue)-1)
			indicateControlType (WT_LISTBOX, getWindowName (hFocus), stringTrimLeadingBlanks (stringTrimTrailingBlanks (sValue)))
			return
		endIf
	elif IsFocusInSDMEditCombo()
		;SayObjectTypeAndText does not speak the name of the SDM edit combo.
		;true is required in GetObjectName to retrieve the name:
		Say(GetObjectName(SOURCE_CACHED_DATA),ot_control_Name)
		sayObjectTypeAndText (nDepth,includeContainerName)
		return
	elIf DialogActive () && GetObjectIsEditable () && stringContains (getWindowClass (getFocus ()), wc_bosa_sdmGeneral)
	&& getObjectRole () == ROLE_SYSTEM_GRAPHIC
	; Insert Symbol dialogs
	; These are insert graphics or symbols, Excel, PowerPoint and Word.
		var string symbolName = getObjectName(SOURCE_CACHED_DATA)
		if ! stringIsBlank (symbolName) then
			return Say(symbolName,ot_control_Name)
		endIf
	endIf
	if iSubtype == WT_ComboBox
	&& StringIsBlank (GetObjectValue())
		sValue = FSUIAGetFocusedElementValueText ()
		if !StringIsBlank (sValue)
			IndicateControlType (WT_ComboBox, sName, sValue)
			return
		endIf
	endIf
EndIf
If iSubtype == WT_BUTTON
&& StringIsBlank(sName)
&& !StringIsBlank(sHelp)
	IndicateControlType (iSubtype, sHelp)
	return
endIf
sayObjectTypeAndText (nDepth,includeContainerName)
if !StringIsBlank(sHelp)
&& !StringContains (StringLower (sName), StringLower (sHelp))
&& !StringContains (StringLower (sHelp), StringLower (sName))
	Say (sHelp, OT_HELP)
endIf
endFunction

Int Function IsResearchToolbar(handle hwnd)
var
	handle hTemp
if GetMenuMode()>0 then
	return false
endIf
If !(StringContains(GetWindowClass(Hwnd),wc_NetUiHwnd)
|| StringContains(GetWindowClass(GetParent(GetParent(hwnd))),wc_netUiHwnd)) then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if GetWindowName(hTemp) == wn_Research then
		return true
	EndIf
EndIf
return false
EndFunction

int function SayTutorialHelpHotKey (handle hHotKeyWindow, int IsScriptKey)
var
	int iSpeak,
	string sHotKey,
	string sPrompt,
	int iPunctLevel
if (GlobalMenuMode)
	if (isVirtualRibbonActive())
		;Do nothing, hotkeys are irrelevant in virtual ribbons:
		return false
	endIf
endIf
sHotkey = getHotKey (getFocus ())
if stringIsBlank (sHotKey)
	sHotKey = findHotKey (sPrompt)
endIf
if stringIsBlank (sHotKey)
	return SayTutorialHelpHotKey (hHotKeyWindow, isScriptKey)
endIf
if (isScriptKey)
	iSpeak = OT_line
else
	iSpeak = OT_access_key
endIf
ExpandAltCommaInHotKey (sHotKey)
if isBackStageView(hHotKeyWindow)
&& StringContains(sHotKey,sc_AltComma) then
	sHotKey=stringSegment(sHotkey,scComma,-1)
endIf
iPunctLevel = getJcfOption (opt_punctuation)
if ! stringContains (sHotKey, cmsgHotKeyAltFollowedBy) then
	;This is an accelerator and should speak itself like Narrator, e.g control plus c
	setJCFOption (OPT_PUNCTUATION, 3)
else
	SetJcfOption (opt_punctuation, 0)
endIf
SayUsingVoice (vctx_message, sHotKey,iSpeak)
SetJcfOption (opt_punctuation, iPunctLevel)
return true
EndFunction

string function GetCustomTutorMessage()
var
	handle hWnd,
	int iSubtype,
	int iState,
	string sValue,
	string sObjName
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
hWnd = GetFocus()
iSubtype = GetObjectSubtypeCode()
if iSubtype == WT_TABCONTROL then
	return msgTabControlOfficeTutorHelp
endIf
if InRibbons()
	If iSubtype==wt_button
	&& getObjectName(SOURCE_CACHED_DATA)==wn_split
		return msgButton+cscSpace+getObjectDescription()
	EndIf
ElIf IsStatusBarToolBar(hWnd) then
	if iSubtype==wt_button then
		let sObjName=GetObjectName()
		If StringCompare(sObjName,wn_Zoom)==0 then
			GetObjectInfoByName (hwnd,wn_Zoom,1,iSubtype,iState,sValue)
			return sValue+cscSpace+msgStatusBarToolbarButtonHelp+cscSpace+msgStatusBarToolBarTutorialHelp
		endIf
		return msgStatusBarToolbarButtonHelp+cscSpace+msgStatusBarToolBarTutorialHelp
	else
		return msgStatusBarToolBarTutorialHelp
	endIf
ElIf IsResearchToolbar(hwnd) then
	return msgResearchToolbarTutorialHelp
elIf iSubtype==wt_splitButton then
	if isOffice365 () then
		return msgSplitButtonOffice2016TutorHelp
	else
		return msgMenuSplitButtonTutorHelp
	endIf
elIf inOptionsDialog(hwnd) then
	if GetObjectName(SOURCE_CACHED_DATA,1)==sc_OptionsDlgCategories then
		return msgOptionsDlgCategoriesTutorHelp
	elIf iSubType==wt_listboxItem then
		return msgListbox
	elIf iSubtype==wt_treeviewItem then
		return msgTreeview
	endIf
elIf isBackstageView(hwnd) then
	if iSubtype==wt_tabControl then
		return msgBackStageViewTabTutorHellp
	endIf
elIf stringContains (getWindowClass (hwnd), wc_bosa_sdmGeneral)
&& getObjectRole () == ROLE_SYSTEM_GRAPHIC
	return msgInsertSymbolTutor
endIf
return GetCustomTutorMessage()
EndFunction

int function SayTutorialHelpForRibbons(int ISpeak)
if RibbonsActive() == LowerRibbon_Active
&& !IsVirtualPCCursor()
&& GetObjectSubtypeCode() == wt_splitButton
&& officeVersion >= 16
	SayUsingVoice (VCTX_MESSAGE,msgSplitButtonOffice2016TutorHelp, iSpeak)
	return true
endIf
return SayTutorialHelpForRibbons(ISpeak)
EndFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
if IsFocusInSDMEditCombo()
	return true
endIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes,nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

void function sayHighlightedText (handle hwnd, string buffer)
if (globalSuppressHighlightedText)
	globalSuppressHighlightedText = FALSE
	return
endIf
return sayHighlightedText (hwnd, buffer)
endFunction

int function OnNetUIMenuButton()
return GetMenuMode() == menu_active
	&& GetWindowClass(GetFocus()) == wc_NetUIHWND
	&& GetObjectSubtypeCode() == WT_MENU
	&& GetObjectStateCode() & ctrl_subMenu
EndFunction

Void Function MenuModeEvent (handle WinHandle, int mode)
if mode == MENU_ACTIVE
	ListenForAtMentionSelectionChange()
elIf mode == MENU_INACTIVE
	oUIAAtMentionsSelectionChangeListener = Null()
	oAtMentionSelectedItem = Null()
endIf
MenuModeEvent (WinHandle, mode)
EndFunction

int function MenuActiveProcessed(int mode, handle hWnd)
If mode == MENU_ACTIVE
	if IsVirtualRibbonActive()
		return default::MenuActiveProcessed(mode,hWnd)
	EndIf
	;The test for OnNetUIMenuButton mus preceed the test for InNonDroppedContextMenu,
	;because the menu associated with the button is not dropped,
	;but we do not want to automatically drop it:
	if OnNetUIMenuButton()
		IndicateControlType (WT_MENU,cscSpace,cscSpace) ;name is announced on focus change
		return true
	elif InNonDroppedContextMenu()
		;The context menu is actually object type menu,
		;and when the first item is not yet selected the object name consists of all items in the menu
		;so we need to select the first item.
		TypeKey (cksDownArrow); Select first item in menus
		return
	EndIf
EndIf
if !hwnd
	;Keep from double dropping the user back onto those tabs and disallowing them from moving up to the menus,
	;from Info tab back to Save As item in menu:
	if IsFocusObjectDescendantOfmenu()
		;The menus are already active:
		return true
	endIf
	IndicateControlType (WT_MENU,cscSpace,cscSpace) ; child menu object reads via FocusChangedEventEX
	return TRUE
endIf
MenuActiveProcessed(mode,hWnd)
EndFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if nIsScriptKey
	col_KeyPressedInfo.ScriptName = GetScriptAssignedTo(strKeyName)
else
	col_KeyPressedInfo.ScriptName = cscNull
endIf
col_KeyPressedInfo.IsScriptKey = nIsScriptKey
col_KeyPressedInfo.ValueChanged = false
return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

globals
string OVCPriorValue

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,optional int bIsFocusObject)
if IsSecondaryFocusActive () return endIf
if (bIsFocusObject) return ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject) endIf
if nObjType == wt_listBoxItem
; combo boxes in standard or virtual ribbons
&& (RibbonsActive () || IsVirtualRibbonActive ())
&& GetWindowClass(hWnd) == wcReListBox
&& GetWindowClass(GetFocus()) == wc_ReComboBox20W
	Say(sObjName,ot_line)
	return
elif nObjType == wt_edit
	var string WndClass = GetWindowClass(hWnd)
	if (WndClass == cwc_Richedit60W && GetWindowClass(GetFocus()) == cwc_Richedit60W)
	|| (WndClass == cwc_Richedit20W && IsFocusInSDMEditCombo())
		;Reduce overly verbose speech by excluding deletion editing.
		;Editing through typing causes a value change when the edited text changes,
		;and a second value change if a new font is chosen from the list.
		;Because we cannot know whether one or two events will fire when editing,
		;we use col_KeyPressedInfo.ValueChanged to announce the second change if it occurs.
		;Also, sometimes when arroing through the list the ValueChangedEvent fires more than once.
		if GetTickCount()-LastEditComboTick > EditComboTickRepeatThreshhold 
		&& (col_KeyPressedInfo.IsScriptKey || col_KeyPressedInfo.ValueChanged)
		&& !StringContains(ScriptNames_ValueChangedWhenEditing,FormatString(scriptNames_Segment,col_KeyPressedInfo.ScriptName))
			if OVCPriorValue!=sObjValue then
				Say(SMMStripMarkup(sObjValue),ot_line)
				OVCPriorValue=sObjValue
			endIf
			LastEditComboTick =GetTickCount()
		endIf
		col_KeyPressedInfo.ValueChanged = true
		return
	endIf
endIf
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
if iObjType == wt_ListBoxItem then
	if InOptionsDialog(hObj)
	|| MenusActive() then
		if !nState then
			;navigation in the Options list is so sluggish
			;that we get state change to not selected
			;before the active item changes.
			;we do not want to hear the "not selected".
			return
		EndIf
	EndIf
EndIf
if (iObjType == WT_LISTBOXITEM && getWindowClass (hObj) == wc_netUiHwnd
&& getWindowClass (getParent (hObj)) == wc_NetUIToolWindow)
	;spawned from ribbon | split button = drop down list,
	;example = tables off of insert:
	Return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

Int function BrailleAddObjectState(int nType)
Var
	handle hwnd,
	int DoNotTranslate = TRUE, ; const for states where no translation is sent.
	int nState
if IsTouchCursor()
	return BrailleAddObjectState(	nType)
endIf
if nType == WT_LISTBOX
&& InCustomCheckableListBox () then
	return BrailleObjectStateForFocusedCheckableListBoxItem ()
endIf
hwnd = GetFocus()
if globalMenuMode > 0
	if nType == wt_treeviewItem
	&& GetWindowClass(hwnd) == cwc_sysTreeview32 ; we are on treview item with checked statet on a menu
		nState = TVGetItemStateImageIndex(hwnd)
		if !nState ; checked
			BrailleAddString(cmsgBrailleChecked1_l,0,0,0, DoNotTranslate)
		ElIf nState == 3 ; unchecked
			BrailleAddString(cmsgBrailleUnchecked1_l,0,0,0, DoNotTranslate)
		EndIf
		return true
	elif GetObjectClassName() == class_NetUITWBtnCheckMenuItem
	&& !(GetObjectMSAAState() & STATE_SYSTEM_CHECKED)
	; A check to make sure we're not on the "Open Hyperlink" menu item in an Outlook meeting.
	&& ! (GetObjectIA2State () & STATE_SYSTEM_MOVEABLE)
		;Although the internal code detects that the item is checked,
		;it does not detect that the item is checkable when it is unchecked:
		BrailleAddString(cmsgBrailleUnchecked1_l,GetCursorCol(),GetCursorRow(),0, DoNotTranslate)
		return true
	endIf
endIf
If nType == wt_listboxItem
	nState = GetControlAttributes(true)
	if nState == 1 ; checked
		BrailleAddString(cmsgBrailleChecked1_l,0,0,0, DoNotTranslate)
	ElIf nState == 2 ; unchecked
		BrailleAddString(cmsgBrailleUnchecked1_l,0,0,0, DoNotTranslate)
	EndIf
	return true
EndIf
return BrailleAddObjectState(	nType)
EndFunction

Void Function SayObjectActiveItemWithDescription (optional int AnnouncePosition)
if GetObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_GRID then
	SayObjectActiveItem ()
	Say (GetObjectState (TRUE), OT_ITEM_STATE)
	return
endIf
SayObjectActiveItemWithDescription (AnnouncePosition)
endFunction

void function SayObjectActiveItem (optional int AnnouncePosition)
if InCustomCheckableListBox () then
	say (GetObjectName(SOURCE_CACHED_DATA), OT_LINE)
	SayObjectStateForFocusedCheckableListBoxItem()
	if AnnouncePosition then
		say (PositionInGroup (), OT_POSITION)
	endIf
	return
endIf
SayObjectActiveItem (AnnouncePosition)
endFunction

void function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
Var
	int iSubtype,
	int iObjtype,
	string sObjName = GetObjectName(SOURCE_CACHED_DATA),
	string sObjHelp = getObjectHelp (),
	string sPosition,
	string galleryButtonName, int galleryButtonIsSelectable, ; for the gallery styles buttons
	int iState,
	int iPunctLevel
if inHJDialog () then
	ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
	return
endIf
if getFocusStylesGalleryItemInfo (galleryButtonName, galleryButtonIsSelectable) then
	SayGalleryButtonInfo (galleryButtonName, sObjHelp)
	return
endIf
let iSubType = GetWindowSubtypeCode (CurHwnd)
if (! iSubtype)
	let iSubtype = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
endIf
let iObjType = getObjectSubtypeCode(SOURCE_CACHED_DATA)
if iObjType == wt_ListBoxItem
&& FocusWindowSupportsUIA() then
	say(sObjName,ot_line)
	sPosition = PositionInGroup ()
	if !StringIsBlank (sPosition)
		Say (sPosition, OT_ANNOUNCE_POSITION_AND_COUNT)
	endIf
	if StringCompare (sObjName, sObjHelp) !=0 then
		say(sObjHelp,ot_line)
	endIf
	return
endIf
let sObjName = GetObjectName(SOURCE_CACHED_DATA)
if (iSubtype == WT_LISTBOX)
	if (StringContains (GetWindowName (GetRealWindow (curHwnd)), wn_autoCorrect))
		iPunctLevel = getJCFOption (opt_punctuation)
		SetJCFOption (opt_punctuation, 3)
		SayFromCursor ()
		SetJcfOption (opt_punctuation, iPunctLevel)
		globalSuppressHighlightedText= true
		return
	endIf
	if iObjType == wt_ListBoxItem
	&& !sObjName then
		;this typically happens in the Clip Art dialog:
		MSAARefresh()
	endIf
endIf
ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
EndFunction

handle function FindAncestorWindowOfClass(string sClass, handle hWnd)
var
	handle hTemp
let hTemp = hWnd
while hTemp
&& StringCompare(sClass,GetWindowClass(hTemp)) != 0
	let hTemp = GetParent(hTemp)
EndWhile
return hTemp
EndFunction

int function WasOfficeSplashScreen ()
;See comment in FocusChangedEvent
return gbWasSplashScreenInOfficeFocusChangedEventEx
EndFunction

void function NotifyIfContextHelp()
; keep this function from constantly firing when focus changes on the AwesomeBar.
if getWindowClass (getFocus ()) == wcNavigationBar then return endIf
return NotifyIfContextHelp()
endFunction

int function FocusRedirectedOnFocusChangedEventEx (handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild, int nChangeDepth)
var string focusClass = getWindowClass (hwndFocus)
if focusClass == wcNavigationBar 
&& getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_GROUPBOX then
; first time AweSomeBar takes focus, UIA knows the focus as button in group, but JAWS still thinks focus is on the group
	UIARefresh ()
	return FALSE; First FocusChange will speak the title of the navigation bar.
endIf
;if focusClass == cWcIEServer && ! dialogActive () then
; This causes pane reading issues all over Office,
; because after the switch back code from Office Help happens, the objects aren't yet loading.
;	LastOfficeApplicationConfigName = GetActiveConfiguration ()
;	switchToConfiguration ("Office Help 2007")
;	return TRUE
;endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) 
endFunction

void function TurnOffVirtualCursor ()
setJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
endFunction

void function FocusChangedEventEx (handle hwndFocus,int nObject,int nChild,handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
if dialogActive () 
&& ! InHjDialog () 
; in the web dialogs, 
; where the focus or its parent is the IEServer window,
; or the IEServer window is a direct descendant of NetUIHWND which has the focus temporarily.
; Otherwise can cause all sorts of problems for places like Outlook.
&& (getWindowClass (hwndFocus) == cwcIEServer || getWindowClass (getParent (hwndFocus)) == cwcIEServer
|| (getWindowClass (hwndFocus) == cwc_NetUIHwnd && findWindow (hwndFocus, cwcIEServer))) then
	scheduleFunction ("TurnOffVirtualCursor", 2, TRUE)
else
	setJCFOption (OPT_VIRTUAL_PC_CURSOR, VirtualPcCursorApplicationSetting)
endIf
;Sometimes, when loading a document for an Office application,
;the Office configuration will briefly load while focus is on the Office splash screen.
;The test for the splash screen is made here
;because the splash screen must be tested for as early as possible in the focus change process.
;When the configuration for an Office application loads,
;the scripts can test in an overwritten FocusChangedEventEx if the previous focus was the Office splash screen.
;Because the vareiable is updated at the start of this function,
;application scripts which test for the splash screen must test before the Office FocusChangedEventEx runs,
;and save the value if it is needed later.
gbWasSplashScreenInOfficeFocusChangedEventEx = GetWindowClass(hWndFocus) == wc_OfficeSplashScreen
GlobalCommandBarWindow = FindAncestorWindowOfClass(wc_MsoCommandBarDock,hwndFocus)
if hwndFocus == hwndPrevFocus
&& GetWindowClass(hwndFocus) == wcReListBox
	return ActiveItemChangedEvent (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild)
endIf
FocusChangedEventEx (hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild,nChangeDepth)
globalPrevCommandBarWindow = GlobalCommandBarWindow
endFunction

int function IsDescendedFromMSOCommandBar(handle hWnd)
var
	handle h
let h = hWnd
while h
	if GetWindowClass(h) == wc_msoCommandBar then
		return true
	EndIf
	let h = GetParent(h)
EndWhile
return false
EndFunction

script SayLine()
var
	handle hWnd,
	string galleryButtonName,
	string sHelp = GetObjectHelp (true),
	int galleryButtonIsSelectable
if IsPCCursor()
&& !UserBufferIsActive() then
	if getFocusStylesGalleryItemInfo (galleryButtonName, galleryButtonIsSelectable) then
		SayGalleryButtonInfo (galleryButtonName, sHelp)
		return
	endIf
	if OnVirtualRibbonEditCombo()
		IndicateControlType(wt_editCombo,GetObjectName(),cscNull)
		Say(GetObjectValue(),ot_line)
		return
	EndIf
	if GetObjectClassName() == class_NetUITWBtnCheckMenuItem
		SayObjectTypeAndText()
		return
	endIf
	If stringContains (getObjectClassName (), wc_bosa_sdmGeneral)
	&& getObjectRole () == ROLE_SYSTEM_GRAPHIC
	; These are insert graphics or symbols, alt+N, U in Excel, PowerPoint or Word..
		var string symbolName = getObjectName(SOURCE_CACHED_DATA)
		if ! stringIsBlank (symbolName) then
			if isSameScript () then
				spellString (symbolName)
			else
				Say(symbolName,ot_control_Name)
			endIf
			return
		endIf
	endIf
EndIf
If GetObjectTypeCode() == WT_BUTTON
&& StringIsBlank(GetObjectName(SOURCE_CACHED_DATA))
&& !StringIsBlank(sHelp)
	IndicateControlType (WT_BUTTON, GetObjectHelp (true))
	return
endIf
PerformScript SayLine()
if IsSecondaryFocusVisible () 
&& !OutlookIsActiveTest() then 
	SaySecondaryFocusSelectedItem (true)
EndIf
if oUIAAtMentionsSelectionChangeListener
	Say (oAtMentionSelectedItem.name, OT_LINE)
endIf
EndScript

int function SetDepthForFocusChangedEventProcessAncestors(handle FocusWindow, handle PrevWindow)
if !RibbonsActive()
&& GetWindowClass(FocusWindow) != wc_NetUIHwnd
&& !isBackStageView(FocusWindow)
	return SetDepthForFocusChangedEventProcessAncestors(FocusWindow,PrevWindow)
endIf
;The change depth can be as high as 11,
;which causes way too much chatter or code to suppress the chatter.
;Try limiting the level to 2:
return min(GetFocusChangeDepth(),2)
EndFunction

Void Function FocusChangedEventProcessAncestors (handle FocusWindow, handle PrevWindow)
var
	string sWindowClass = getWindowClass (FocusWindow)
;Keep edit combos on ribbons from announcing themselves twice:
if RibbonsActive ()
&& (sWindowClass == cwc_RichEdit20W
|| sWindowClass == cwc_RichEdit60W)
	;there are cases where SayObjectTypeAndText truncates, so get value from MSAA:
	indicateControlType (getObjectSubtypeCode(SOURCE_CACHED_DATA), GetObjectName(SOURCE_CACHED_DATA), GetObjectValue(SOURCE_CACHED_DATA))
	return
endIf
return FocusChangedEventProcessAncestors (FocusWindow, PrevWindow)
EndFunction

String Function GetControlColorValue(string sColorName)
;speak color value for some ribbon controls such as split buttons when the value is an RGB string.
; we need to build the 9-digit string in cases where
;only 1 or two digits are present for each portion of the string provided by GetObjectValue.
; also we need to build the string where the RGB information is the only information provided by GetObjectName.
Var
	string sc1,
	string sc2,
	string sc3,
	string sColorNameTrimmed,
	int iLength,
	string sColor
if ! StringContains (sColorName, scRGB) then
	return cscNull
endIf
;Remove the parentheses.
sColorName = stringSegment (sColorName,scRGB,-1)
sColorName = stringChopLeft (sColorName,1)
sColorName = StringChopRight (sColorName, 1)
sColorNameTrimmed = stringReplaceChars (sColorName, cscSpace, cscNull)
; now get each portion of the string.
sc1 = stringSegment (sColorNameTrimmed, scRGBSeparator, 1)
sc2 = stringChopLeft (stringSegment (sColorNameTrimmed, scRGBSeparator, 2), 1)
sc3 = stringChopLeft (stringSegment (sColorNameTrimmed, scRGBSeparator, -1), 1)
;Ensure  each segment is three digits long.
;If the length is <3, we must pad with 0's.
; However, when attempting to concatenate, they are treated as integers.
;So we must apply the following kludge:
iLength = StringLength (sc1)
if (iLength == 2)
	sc1 = ("0"+sc1)
elif (iLength == 1)
	sc1 = ("00"+sc1)
EndIf
iLength = StringLength (sc2)
if (iLength == 2)
	sc2 = ("0"+sc2)
elif (iLength == 1)
	sc2 = ("00"+sc2)
EndIf
iLength = StringLength (sc3)
if (iLength == 2)
	sc3 = ("0"+sc3)
elif (iLength == 1)
	sc3 = ("00"+sc3)
EndIf
sColor = stringReplaceChars (sc1+sc2+sc3, cscSpace, cscNull)
sColorName = GetColorName (RGBStringToColor (sColor))
return sColorName
EndFunction

int function InOptionsDialog(handle hWnd)
if GetMenuMode()>0
|| UserBufferIsActive()
|| getWindowCategory (hwnd) != WCAT_SINGLE_CLASS
	return false
endIf
var handle hTemp = hWnd
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
int function IsStatusBarToolBar(handle hWnd)
;For areas where the result of calling IsStatusBarToolBarTest is not cached:
return IsStatusBarToolBarTest(hWnd)
EndFunction

int function IsStatusBarToolBarTest(handle hWnd)
if GetMenuMode()>0
|| UserBufferIsActive()
|| getWindowCategory (hwnd) != WCAT_SINGLE_CLASS
	return false
endIf
var handle hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if stringCompare(GetWindowName(hTemp),wn_StatusBar)==0 then
		return true
	EndIf
EndIf
return false
EndFunction

Void Function DescriptionChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldDescription, string sNewDescription)
Var
	handle hPrevHwnd,
	string sClass
nObjType = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
sClass = GetWindowClass (hwnd)
globalPrevFocus = hPrevHwnd
if (sClass == wc_netUIHwnd
&& nObjType == wt_listboxItem
&& stringContains (GetObjectName(SOURCE_CACHED_DATA), StringSegment (sNewDescription, cscSpace, 1)))
	return ;too much chatter because the description and the object name contain much of the same information
endIf
if RibbonsActive ()
|| IsStatusBarToolBar (hWnd)
|| InOptionsDialog (hwnd)
|| MenusActive ()
; check for when listbox items from a NetUIHwnd class gain focus.
; the previous window handle stays the same
;while the current one changes as the list is navigated.
|| (sClass == wc_NetUIHwnd
&& (nObjType == wt_menu
;The following prevents drop-down lists from reading descriptions before the name.
;Excel | Insert | any (line, chart, ...)
;Keep description from speaking before the name is read out.
|| (nObjType == WT_ListBoxItem
&& StringContains (getObjectName(SOURCE_CACHED_DATA), sNewDescription)))
&& globalPrevFocus == hPrevHwnd) then
	;Too distracting to have descriptions speak.
	return
EndIf
default::DescriptionChangedEvent(hwnd,objId,childId,nObjType,sOldDescription,sNewDescription)
EndFunction

void function DialogPageChangedEvent(HANDLE hwndNewPage,HANDLE hwndOldPage)
if GlobalPrevRealName != GetWindowName(GetRealWindow(GetFocus())) then
	;This change is spoken by ProcessSayRealWindowOnFocusChange
	return
EndIf
DialogPageChangedEvent(hwndNewPage,hwndOldPage)
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
giForegroundCategory = getWindowCategory  ()
if (stringCompare (RealWindowName, GlobalPrevRealName) != 0)
	gstrCustomDlgStaticText = cscNull
	if (giForegroundCategory == WCAT_TASK_PANE)
		RealWindowName = getWindowName (findWindow (RealWindow, cwcMsoCmd))
		say (RealWindowName, OT_DIALOG_NAME)
	elif StringStartsWith(GetWindowClass(RealWindow),"bosa_sdm_")
	&& dialogActive()
		IndicateControlTYpe(wt_dialog,RealWindowName,cmsgSilent)
		return
	endIf
	if GetWindowSubtypecode(FocusWindow) == wt_radioButton
	&& GetWindowClass(GetParent(FocusWindow)) == cWc_dlg32770
	&& GetWindowHierarchyX(FocusWindow) == 1 then
		;Prevent SayWindowTypeAndText from speaking static text not related to the dialog
		IndicateControlType(wt_dialog,RealWindowName)
		return
	EndIf
endIf
return ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
endFunction

void function ProcessSayFocusWindowOnFocusChange (string RealWindowName, handle FocusWindow)
if HandleCustomWindows (focusWindow)
	return
endIf
if getWindowClass (focusWindow) == cwc_NetUIHwnd then
	if getObjectSubtypeCode(SOURCE_CACHED_DATA) then
		sayFocusedObject ()
	else
		say (getObjectName(SOURCE_CACHED_DATA), ot_control_name)
	endIf
	return
endIf
return ProcessSayFocusWindowOnFocusChange (RealWindowName, FocusWindow)
endFunction

void function SpeakAutocorrectMessage ()
sayMessage (OT_CONTROL_NAME, msgAutocorrection_L, msgAutocorrection_S)
endFunction

Void Function WindowCreatedEvent (handle hWindow, int nLeft, int nTop, int nRight, int nBottom)
; Because we must detect if text is obscured by the object,
; we have no alternative but to test for window class
; in order to set the variable when text may be obscured.
var
	object obj,
	string sName,
	int varChild
if GetWindowClass (hWindow) == wc_OOCWindow then
	if getTickCount () - LastUIATextChangeTime <= AutoCorrectTextUIAThreshold then
		LastUIATextChangeTime = 0
		return
	endIf
	globalObscuredText = true
	let hGlobalOoc = hWindow  ;used later in WindowDestroyedEvent
	let obj = GetObjectFromEvent(hWindow, 0, 0, varChild)
	let sName = obj.accName(varChild)
	if StringContains(sName,on_AutoActions) then
		if GlobalDetectAutoCorrect then
			scheduleFunction ("SpeakAutoCorrectMessage", 2, TRUE)
			scheduleBrailleFlashMessage(sName, 3)
		EndIf
	EndIf
	obj = Null()
EndIf
WindowCreatedEvent(hWindow,nLeft,nTop,nRight,nBottom)
EndFunction

void Function WindowDestroyedEvent (handle hWindow)
if hWindow == hGlobalOoc then
	GlobalObscuredText = false
	hGlobalOoc = null()
EndIf
WindowDestroyedEvent(hWindow)
EndFunction

string function GetCustomTextFromStandardDialog (handle hwnd)
var
	handle htmp
if getWindowSubtypeCode (hwnd) != WT_DIALOG
&& getWindowClass (hwnd) != cWc_dlg32770
&& getWindowSubtypeCode (getFirstChild (hwnd)) == WT_BUTTON
&&  stringIsBlank (getDialogStaticText ())
	return cscNull
endIf
htmp = findWindow (hwnd, wc_msoUniStat)
return getWindowText (htmp, READ_EVERYTHING)
endFunction

void function sayWindowTypeAndText (handle hwnd)
var
	string sCustomText = GetCustomTextFromStandardDialog (hwnd)
if (! stringIsBlank (sCustomText))
	return SayControlExWithMarkup (hwnd, getWindowName (hwnd), getWindowType (hwnd), cscNull, cscNull, cscNull, cscNull, cscNull, sCustomText)
elIf stringContains (getWindowClass (hwnd), cwcMsoCmd)
&& getWindowName (hwnd) == TaskPaneDockedWindowName
	return sayMessage (OT_HELP, msgTaskPane)
endIf
return sayWindowTypeAndText (hwnd)
endFunction

;Braille functions for common controls:
Int Function BrailleCallBackObjectIdentify()
Var
	int nCategory,
	int subtypeCode = getObjectSubtypeCode(SOURCE_CACHED_DATA),
	handle hwnd
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
hwnd = GetFocus ()
nCategory = GetWindowCategory (hwnd)
if getWindowClass (hwnd) == cwcIEServer
&& ! getObjectSubtypeCode ()
&& stringIsBlank (getObjectName ()) then
; these are empty controls by Microsoft which have no purpose or action, they are of type pane with no default action.
; They aren't worth adding a custom control for, just add the text and get out.
	BrailleAddString (msgCustomControl, 0,0,0)
	return WT_htmlbody ; HAS NO COMPONENTS, BUT IS A VALID RETURN SO ABOVE ADDED STRING WILL TRULY GET ADDED.
endIf
if nCategory == WCAT_DOCUMENT then
	return wt_MultiLine_edit
endIf
;Fix subtype problem on single-line edit, where the multiline style bit has been set
if getWindowSubtypeCode (hwnd) == WT_EDIT
&& getWindowStyleBits (hwnd) & ES_MULTILINE then
	return wt_MultiLine_edit
EndIf
; ensure grids return proper code.
;By default this function returns 0.
if subtypeCode == WT_GRID then return subtypeCode endIf
if subtypeCode == WT_STATIC
&& GetObjectName(false, 3) == cwn_ShellFolderView
	return WT_ListBox
endIf
return BrailleCallbackObjectIdentify ()
EndFunction

int function BrailleAddObjectDlgText(int nSubtypeCode)
var
	string sName,
	string sCustomcDlgText = GetCustomTextFromStandardDialog (getRealWindow (getFocus ()))
if (! stringIsBlank (gstrCustomDlgStaticText))
	BrailleAddString (gstrCustomDlgStaticText, 0,0,0)
	return TRUE
elIf (! stringIsBlank (sCustomcDlgText))
	brailleAddString (sCustomcDlgText, 0,0,0)
	return TRUE
endIf
return BrailleAddObjectDlgText (nSubtypeCode)
endFunction

Int Function BrailleAddObjectName (int nType)
Var
	int attributes,
	Handle hFocus,
	object o
if IsTouchCursor() then
	return BrailleAddObjectName (nType)
endIf
if oAtMentionSelectedItem && oAtMentionSelectedItem.name!=cscNull then
	var int x, int y
	if oAtMentionSelectedItem.GetSelectionItemPattern().isSelected then
		attributes=attrib_highlight
	else
		attributes=0
	endIf
	oAtMentionSelectedItem.GetClickablePoint( intRef(x), intRef(y))
	BrailleAddFocusLine()
	BrailleAddString(oAtMentionSelectedItem.name, x, y, attributes)
	brailleAddString(PositionInGroupFromUIA (oAtMentionSelectedItem), 0,0,0)
	return true
endIf
; grids in ribbons where state code as Default means the item is selected.
; These are never marking themselves up properly in Braille.
if nType == WT_GRID then
	if GetObjectStateCode (TRUE) & STATE_SYSTEM_DEFAULT then
		Attributes = ATTRIB_HIGHLIGHT
	endIf
	BrailleAddString (GetObjectName(SOURCE_CACHED_DATA), 0,0,Attributes)
	return TRUE
endIf
hFocus = GetFocus ()
if nType == wt_menu
	if getObjectSubtypeCode () == wt_splitButton
		BrailleAddString (GetObjectName(), 0,0,0)
		BrailleAddString (BrailleGetSubtypeString (wt_splitButton), 0,0,0)
		return true
	EndIf
endIf
if (isStatusBarToolbar (GetFocus ())
&& GetObjectSubtypeCode () == wt_Button)
	BrailleAddString (GetObjectName(), 0,0,0)
	return true
endIf
if nType == WT_LISTBOXITEM
	if (getWindowClass (hFocus) == cwc_NetUIHwnd)
		BrailleAddString (getObjectName(SOURCE_CACHED_DATA, 1), 0,0,0)
		return TRUE
	endIf
endIf
if (nType == WT_TREEVIEW || nType == WT_TREEVIEWITEM)
&& dialogActive () then
	if GetWindowClass (hFocus) == cwc_SysTreeView32
		return TRUE ; no string
	endIf
endIf
if nType == wt_lowerRibbon
	;Both name and value are handled together in BrailleAddObjectValue
	return true
endIf
If getWindowClass (hFocus) == cwc_Richedit60W
	if StringIsBlank (GetObjectName(SOURCE_CACHED_DATA))
		o = FSUIAGetFocusedElement(true)
		If GetObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT
		|| GetWindowSubtypeCode (hFocus) == WT_EDIT
		|| o.className == oc_NetUIPropertyTextbox
			If o
				BrailleAddString(o.Name, GetCursorCol (), GetCursorRow (), 0)
				Return TRUE
			endIf
		EndIf
	EndIf
EndIf
If nType == WT_BUTTON
	var
		string sName = GetObjectName(SOURCE_CACHED_DATA),
		string sHelp = GetObjectHelp(true),
		string sValue = GetObjectValue(SOURCE_CACHED_DATA)
	if StringIsBlank(sName)
	&& !StringIsBlank(sHelp)
		sName = sHelp
	endIf
	if !StringIsBlank(sValue)
	&& sName != sValue
		sName = sName + cscSpace + sValue
	endIf
	BrailleAddString(sName, GetCursorCol (), GetCursorRow (), getCharacterAttributes())
	Return TRUE
endIf
return BrailleAddObjectName (nType)
EndFunction

int function BrailleAddValueStringForLowerRibbonItem(int nType)
if nType != wt_lowerRibbon return false endIf
var
	string sName,
	string sValue,
	int iType,
	int galleryButtonIsSelectable,
	int stateBits
if getFocusStylesGalleryItemInfo (sName, galleryButtonIsSelectable) then
	; underline the name if the item is selected.
	if galleryButtonIsSelectable then stateBits = ATTRIB_HIGHLIGHT endIf
	brailleAddString (sName, 0, 0, stateBits)
	brailleAddString(brailleGetSubtypeString(WT_BUTTON), 0,0,0)
endIf
iType = getObjectSubtypeCode(SOURCE_CACHED_DATA)
sName = GetObjectName(SOURCE_CACHED_DATA)
if iType == wt_edit
|| iType == wt_editCombo
|| iType == wt_edit_Spinbox
	if IsSecondaryFocusVisible ()
		brailleAddString (GetSecondaryFocusSelectionText (), 0, 0, attrib_highlight)
		return true
	endIf
	brailleAddString (sName, 0,0,0)
	brailleAddString(brailleGetSubtypeString(iType), 0,0,0)
	BrailleAddFocusLine()
	return true
endIf
sValue = GetObjectValue(SOURCE_CACHED_DATA)
if sName && sValue
&& sName != sValue
	brailleAddString (sName, 0,0,0)
	brailleAddString(brailleGetSubtypeString(iType), 0,0,0)
	if stringContains (sValue, scrgb)
		sValue = getControlColorValue (sValue)
	endIf
	brailleAddString (sValue, 0,0,0)
	return true
endIf
If !sValue
	if GetObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_LISTBOXITEM 
	&& GetObjectStateCode (TRUE) & STATE_SYSTEM_DEFAULT then
	; lower items on ribbons that behave something like grids, we want to handle the Default case by highlighting it, 
	; since it never gains proper focus when first entering the group, you have to select it.
		BrailleAddString (sName, 0,0,ATTRIB_HIGHLIGHT)
		return TRUE
	endIf
	brailleAddString (sName, 0,0,0)
else
	brailleAddString (sValue, 0,0,0)
endIf
brailleAddString(brailleGetSubtypeString(iType), 0,0,0)
return true
EndFunction

int function brailleAddObjectValue (int nType)
Var
	handle hwnd,
	string sName
if IsTouchCursor() then
	return brailleAddObjectValue (nType)
endIf
if BrailleAddValueStringForLowerRibbonItem(nType)
	return true
endIf
if nType == WT_STATIC then
	sName = getObjectName ()
	if ! stringIsBlank (sName) then
		BrailleAddString (sName, 0,0,0)
		return TRUE
	endIf
endIf
; combo boxes outside of dialogs are in some cases getting the incorrect information:
if ! dialogActive () 
&& nType == WT_COMBOBOX then
	BrailleAddString (GetObjectValue(SOURCE_CACHED_DATA), 0,0,ATTRIB_HIGHLIGHT)
	return TRUE
endIf
hwnd = GetFocus ()
if (nType == WT_TREEVIEW || nType == WT_TREEVIEWITEM)
&& dialogActive() then
	if GetWindowClass (hWnd) == cwc_SysTreeView32
		BrailleAddString (getObjectName(SOURCE_CACHED_DATA), GetCursorCol (), GetCursorRow (), ATTRIB_HIGHLIGHT) ; Prevent truncated results.
		return TRUE
	endIf
endIf
if (nType == WT_MULTILINE_EDIT
&& getWindowSubtypeCode (hwnd) == WT_EDIT)
	brailleAddFocusLine ()
	return TRUE
endIf
if (getWindowClass (GetParent (GetParent (hwnd))) == wc_netUIHwnd)
	brailleAddString (getObjectValue(SOURCE_CACHED_DATA), 0,0,0)
	return TRUE
endIf
; trying to filter out language category...
If nType == WT_LISTBOXITEM
	If DialogActive ()
	&& GetWindowClass (hWnd) == cWC_NetUIHWND
		sName = GetObjectName(SOURCE_CACHED_DATA)
		var String sScreenText = GetWindowTextEx (hWnd, TRUE, FALSE)
		If (! StringIsBlank (sScreenText))
		&& (! StringContains (sScreenText, sName))
			BrailleAddString (sScreenText, GetCursorCol (), GetCursorRow (), 0)
			Return (TRUE)
		EndIf
	EndIf
EndIf
return brailleAddObjectValue (nType)
endFunction

int function brailleAddObjectContainerName(int nType)
var
	string sGroupName
if (getMenuMode() == menu_active
&& getObjectSubtypeCode() == wt_splitButton)
	return true
endIf
return brailleAddObjectContainerName (nType)
endFunction

int function ShouldAddVirtualRibbonsOption()
return true
EndFunction

Int Function isBackStageView(handle hwnd)
var
	string class,
	handle hTemp,
	int nLevel
class = GetWindowClass (hWnd)
if class != wc_NetUIHwnd
&& class != cwc_Richedit60W
	return false
EndIf
hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_ParentClass_FULLPAGEUIHost
	hTemp = GetParent(hTemp)
EndWhile
if !hTemp
	return false
EndIf
nLevel = GetAncestorCount()
while nLevel
	if StringContains(GetObjectName(SOURCE_CACHED_DATA,nLevel),sc_BackStageView)
		return true
	EndIf
	nLevel=nLevel-1
endWhile
return false
EndFunction

void function ShowOfficeScreenSensitiveHelp(string sHelpMsg)
var
	string sText,
	string sName,
	string sType,
	int iSubtype,
	string sState,
	string sDescr,
	string sValue,
	string sAccess,
	int iState,
	string sTab, string sGroup
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if GetRibbonStatus(iState,sTab,sGroup,sDescr) then
	if iState==RibbonCollapsed then
		let sHelpMSG=msgRibbonToggleStateScreenSensitiveHelp+cscBufferNewLine
	endIf
endIf
let sName = GetObjectName(SOURCE_CACHED_DATA)
let sType=GetObjectType()
let iSubtype=GetObjectSubtypeCode(SOURCE_CACHED_DATA)
if iSubtype==wt_buttonDropdown then
	let sText = sName+cscSpace+msgSubmenu
ElIf iSubtype==wt_buttonDropdownGrid then
	let sText = sName+cscSpace+msgSubmenuGrid
elIf iSubtype==wt_editCombo then
	let sText = sName+cscSpace+msgRibbonEditCombo
elIf  iSubtype==wt_splitButton then
	let sText = sName+cscSpace+msgSplitButton
ElIf sType
&& sType != cmsgUnknown then
	let sText = sName+cscSpace+sType
else
	let sText = sName
EndIf
let sState = GetObjectState()
if sState then
	;we don't need to show the selected state:
	if StringCompare(StringTrimLeadingBlanks(sState),sc_SelectedState) != 0 then
		let sState = FormatString(msgStateScreenSensitiveHelp,sState)
		let sText = sText+cscSpace+sState
	EndIf
EndIf
let sValue = GetObjectValue(SOURCE_CACHED_DATA)
let sDescr = GetObjectDescription(SOURCE_CACHED_DATA)
if sValue
&& stringCompare(sValue,sDescr)!=0 then
	let sText = sText+cscBufferNewLine+sValue+cscBufferNewLine
else
	let sText = sText+cscBufferNewLine
EndIf
let sAccess = GetHotKey()
if sAccess then
	let sAccess = FormatString(msgAccessKeyScreenSensitiveHelp,sAccess)
	let sText = sText+cscBufferNewLine+sAccess+cscBufferNewLine
EndIf
if sDescr then
	let sText = sText+cscBufferNewLine+sDescr+cscBufferNewLine
EndIf
let sHelpMsg = sText+cscBufferNewLine+sHelpMsg
sayFormattedMessage(ot_user_buffer,sHelpMsg)
AddHotKeyLinks()
BrailleRefresh()
EndFunction

int function ScreenSensitiveHelpForOffice()
var
	int nSubtype = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
if InTaskPaneDialog() then
	TaskPaneHelp()
	return true
elif GlobalTemporaryContextMenuState then
	TemporaryContextMenuHelp()
	return true
elif IsStatusBarToolBar(GetFocus())
|| IsQuickAccessToolbarActive() then
	ShowOfficeScreenSensitiveHelp(msgStatusBarToolBarOrQuickAccessToolBarScreenSensitiveHelp)
	return true
elif inRibbons() then
	if IsVirtualRibbonActive() then
		If GlobalMenuMode == MENUBAR_ACTIVE then
		 	ShowScreenSensitiveHelpForVirtualRibbon(true)
		ElIf GlobalMenuMode == MENU_ACTIVE then
			ShowScreenSensitiveHelpForVirtualRibbon(false)
		EndIf
		Return true
	elif nSubType == wt_TabControl then
		ShowOfficeScreenSensitiveHelp(msgOfficeRibbonBarScreenSensitiveHelp)
		Return true
	elif nSubtype == wt_buttonDropdown then
		ShowOfficeScreenSensitiveHelp(msgSubmenuScreenSensitiveHelp)
		return true
	ElIf nSubtype == wt_buttonDropdownGrid then
		ShowOfficeScreenSensitiveHelp(msgSubmenuGridScreenSensitiveHelp)
		return true
	elIf nSubtype == wt_splitButton then
		ShowOfficeScreenSensitiveHelp(msgRibbonSplitButtonScreenSensitiveHelp)
		return true
	elif nSubType == WT_BUTTON then
		ShowOfficeScreenSensitiveHelp(cmsgScreenSensitiveHelp14_L)
		return true
	elif nSubtype == wt_editCombo  then
		ShowOfficeScreenSensitiveHelp(msgEditComboScreenSensitiveHelp)
		return true
	EndIf
else
	return false
EndIf
EndFunction

int function InNonDroppedContextMenu()
var
	int iObjtype,
	int iRbnState,
	string sRbnTab,
	string sRbnGroup,
	string sRbnDesc
iObjType=GetObjectSubtypeCode()
if GetMenuMode()!=0
&& !iObjType ;it is a context menu in Office 2010.
	GetRibbonStatus(iRbnState,sRbnTab,sRbnGroup,sRbnDesc)
	if iRbnState == 1
		;The upper ribbon is active,
		;possibly waiting for the rest of a ribbon shortcut key sequence:
		return false
	EndIf
	if !GetObjectName()
	&& !GetObjectValue()
		return true
	EndIf
	return false
endIf
if iObjType!= wt_menu
	return false
EndIf
If GetObjectSubtypeCode(SOURCE_CACHED_DATA,1) == wt_dialog_page
	return true
EndIf
return false
EndFunction

; *** below are the stubs to avoid Unknown function calls
; ***if the appropriate functions are missing in exact office files...

int function SayByTypeForScriptSayLine()
var int subtype = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
if Subtype == WT_GRID
|| (Subtype == WT_LISTBOXITEM && GetWindowClass (GetFocus ()) == cwc_NetUIHwnd) then
	if GetObjectStateCode (TRUE) == STATE_SYSTEM_DEFAULT then
		if IsSameScript () then
			SpellString (GetObjectName(SOURCE_CACHED_DATA)) 
			return
		endIf
		say (getObjectName(SOURCE_CACHED_DATA), OT_LINE)
		say (GetObjectState (TRUE), OT_ITEM_STATE)
		return TRUE
	endIf
endIf
if InCustomCheckableListBox () then
	say (GetObjectName(SOURCE_CACHED_DATA), OT_LINE)
	SayObjectStateForFocusedCheckableListBoxItem ()
	say (PositionInGroup (), OT_POSITION)
	return TRUE
endIf
return SayByTypeForScriptSayLine ()
endFunction

void Function SayLineUnit (int unitMovement, optional  int bMoved)
if IsSecondaryFocusVisible () then return EndIf

;Arrowing through edit combos in ribbons:
if GetObjectClassName() == Class_NetUIComboboxAnchor
	;Typically, the type is combobox and the class is NetUIComboboxAnchor
	;ValueChangedEvent handles speaking
	return
endIf
if oUIAAtMentionsSelectionChangeListener
	;speaking is handled by OfficePropertyChangedEvent for AtMentions
	return
endIf
If SayCursorMovementException(unitMovement,bMoved)
	SayLineUnit(unitMovement,bMoved)
	return
endIf
if GetObjectSubtypeCode(SOURCE_CACHED_DATA) == wt_editCombo
&& GetWindowClass(GetFocus()) == wc_ReComboBox20W
	;ValueChangedEvent handles this type of edit combo
	return
endIf
return SayLineUnit (unitMovement, bMoved)
endFunction

void function TaskPaneHelp()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
if InTaskPaneDialog() then
	SayFormattedMessage(OT_USER_BUFFER,msgTaskPaneHelp1_L,msgTaskPaneHelp1_s)
	UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
EndIf
EndFunction

void Function ScreenSensitiveHelpForKnownClasses (int nSubTypeCode)
var
	handle hWnd,
	string sReal
hWnd = GetFocus()
sReal=GetWindowName(GetRealWindow(hwnd))
if nSubtypeCode==wt_ListboxItem
&& inOptionsDialog(hwnd) then
	ShowScreenSensitiveHelp(msgScreenSensitiveHelpOptionsDlgListbox)
	return
EndIf
if GetWindowName(hwnd)==wn_applyStyles then
	ShowScreenSensitiveHelp(msgApplyStylesScreenSensitiveHelp)
	return
EndIf
If nSubtypeCode==wt_edit
&& GetObjectSubtypeCode()==wt_editCombo  then
	ShowScreenSensitiveHelp(msgEditComboScreenSensitiveHelp)
	return
EndIf
if GetMenuMode()>0
&& GetObjectSubtypeCode(SOURCE_CACHED_DATA)==wt_splitButton then
	ShowScreenSensitiveHelp(msgMenuSplitButtonScreenSensitiveHelp)
	return
EndIf
if isResearchToolbar(hwnd) then
	ShowScreenSensitiveHelp(msgResearchToolbarScreenSensitiveHelp)
	return
EndIf
if nSubtypeCode==wt_ListBoxItem
&& GetWindowClass(hwnd)==wc_netUiHwnd then
	ShowScreenSensitiveHelp (msgScreenSensitiveHelpNetUiLists)
	return
EndIf
if nSubtypeCode==wt_buttonMenu then
	ShowScreenSensitiveHelp(cmsgButtonMenuScreenSensitiveHelp)
	return
EndIf
If nSubtypeCode==wt_columnHeader then
	ShowScreenSensitiveHelp(msgColumnHeaderScreenSensitiveHelp)
	return
EndIf
If nSubtypeCode==wt_rowHeader then
	ShowScreenSensitiveHelp(msgRowHeaderScreenSensitiveHelp)
	return
EndIf
ScreenSensitiveHelpForKnownClasses(nSubTypeCode)
EndFunction

script SayCurrentAccessKey()
var
	int iObjType,
	int iPunctuationLevel,
	string sHotkey,
	handle hwnd,
	string sPrompt
let hwnd=GetCurrentWindow()
iObjType = getObjectSubtypeCode(SOURCE_CACHED_DATA)
if InRibbons()
|| inOptionsDialog(hwnd)then
	let iPunctuationLevel=GetJcfOption(OPT_PUNCTUATION) ; Saves current punctuation level...
	SetJcfOption(OPT_PUNCTUATION,0)
	let sHotkey=GetHotkey()
	ExpandAltCommaInHotKey(sHotKey)
	if ! stringContains (sHotKey, cmsgHotKeyAltFollowedBy) then
	;This is an accelerator and should speak itself like Narrator, e.g control plus c
		setJCFOption (OPT_PUNCTUATION, 3)
	endIf
	SayUsingVoice(VCTX_MESSAGE,sHotKey,OT_HELP)
	SetJcfOption(OPT_PUNCTUATION,iPunctuationLevel)
	return
elIf (iObjType == WT_CHECKBOX || iObjType == WT_RADIOBUTTON || iObjType == WT_COMBOBOX || iObjType == WT_BUTTON|| iObjType == WT_EDIT)
	sPrompt = getObjectName(SOURCE_CACHED_DATA)
	sHotKey = findHotKey ()
	if ! stringIsBlank (sHotKey)
		sayMessage (OT_HELP, formatString (cmsgHotKeyDefaultHelpLoopPrompt1_L, sPrompt, sHotKey))
		Return
	endIf
EndIf
PerformScript SayCurrentAccessKey()
EndScript

int function IsQuickAccessToolbarActive()
var
	handle hWnd,
	handle hNull,
	int state,
	string tab,
	string group,
	string desc
if GetMenuMode() != 0 then
	return false
EndIf
GetRibbonStatus(state,tab,group,desc)
if state != Ribbons_Inactive then
	return false
EndIf
let hwnd = getFocus()
while hWnd
&& GetWindowClass(hWnd) != wc_MSOWorkPane
&& GetWindowName(hWnd) != wn_Ribbon
	let hWnd = getParent(hWnd)
EndWhile
return hWnd != hNull
EndFunction

;The following is for messages that may either be spoken or posted to message boxes.
;The behaviors are now as follows:
;MAGic with speech off: message box
;MAGIC with speech on: message box only on SameScript, one press = announce only.
;JAWS by itself: announce only.
int Function ProcessMessage (string sText, optional string sText_S, optional int iOutputType, optional string sTitle, optional int iMBFlags,
	optional string sVCTX)
Var
	int bMAGicNoSpeech,
	int bMAGicRunning = (getRunningFSProducts () & product_MAGic)
bMAGicNoSpeech = bMAGicRunning && isSpeechOff ()
if bMAGicNoSpeech then
	return exMessageBox (smmStripMarkup (sText), sTitle, iMBFlags)
elIf bMAGicRunning then
	If IsSameScript () then
		return exMessageBox (smmStripMarkup (sText),sTitle,iMBFlags)
	else
		if sVCTX then
			SayUsingVoice(sVCTX,sText,iOutputType)
		else
			;SayMessageWithMarkup(ot_screen_message,FormatString(msgHeaderTemplate,sText))
			sayMessageWithMarkup (iOutputType, sText, sText_S)
		EndIf
		return IDOK
	EndIf
Else
	if sVCTX then
		SayUsingVoice(sVCTX,sText,iOutputType)
	else
		;SayMessageWithMarkup(ot_screen_message,FormatString(msgHeaderTemplate,sText))
		sayMessageWithMarkup (iOutputType, sText, sText_S)
	EndIf
	return IDOK
endIf
EndFunction

object function GetStatusBarUIAElement()
var handle hWnd = GetFirstChild(GetAppMainWindow(GetFocus()))
if !hWnd return Null() endIf
var
	handle hCMDBar,
	object element,
	object Found,
	object condition
condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_StatusBarControlTypeId)
while hWnd
	if GetWindowClass(hWnd) == wc_MsoCommandBarDock 
		hCMDBar = GetFirstChild(hWnd)
		if hCMDBar
			element = FSUIAGetElementFromHandle(hCMDBar)
			if element
				found = element.FindFirst(TreeScope_Subtree, condition)
				if found
					return found
				endIf
			endIf
		endIf
	endIf
	hWnd = GetNextWindow(hWnd)
endWhile
return Null()
EndFunction

string Function GetTextfromStatusBarChildren(object element)
var object child = FSUIAGetFirstChildOfElement(element)
if !child return cscNull endIf
var
	string itemText,
	string statusBarText,
	object pattern
;It appears that all items showing on the status bar are text of buttons.
;Only add text from button text of items that are not toggleable
;or that are both toggleable and are toggled on:
while child
	itemText = cscNull
	if child.name
		if child.controlType == UIA_ButtonControlTypeId
			pattern = child.GetTogglePattern()
			if !pattern
			|| pattern.toggleState == 1
				itemText = child.name
			endIf
		endIf
	endIf
	if itemText
		statusBarText = statusBarText+cscBufferNewLine+itemText
	endIf
	child = FSUIAGetNextSiblingOfElement(child)
endWhile
return statusBarText
EndFunction

string Function GetUIAStatusBarText()
var
	object element,
	string statusBarText
element = GetStatusBarUIAElement()
if !element return cscNull endIf
statusBarText = GetTextfromStatusBarChildren(element)

return StringTrimLeadingBlanks(statusBarText)
EndFunction

script SayBottomLineOfWindow()
var
	string sText,
	int category
;OSM will sometimes get irrelevant text for the status bar,
;so for the document and taskpane areas use UIA.
category = getWindowCategory()
if (category == WCAT_SPREADSHEET
|| category == WCAT_DOCUMENT
|| category == WCAT_PRESENTATION
|| category == WCAT_TASK_PANE)
&& GetProgramVersion (GetAppFilePath ()) > 13
	sText = GetUIAStatusBarText()
else
	sText = GetBottomLineOfWindow()
	if !sText
		sText = GetUIAStatusBarText()
	endIf
endIf
Say(sText,ot_user_requested_information)
EndScript

int function OnFileTabButton()
var object element = FSUIAGetFocusedElement(true)
return element.controlType == UIA_ButtonControlTypeId
	&& element.automationId == "FileTabButton"
	&& element.className == class_NetUIRibbonTab
EndFunction

int function IsFileListItem()
var object element = FSUIAGetFocusedElement()
if element.controlType == UIA_ListItemControlTypeId
	return FSUIAGetParentOfElement (element).automationId == AutomationID_FileList
endIf
return false
EndFunction

int function OnRibbonButton()
var object element = FSUIAGetFocusedElement(true)
return element.controlType == UIA_ButtonControlTypeId
	&& element.className == class_NetUIRibbonButton
endFunction

int function InNUIDialogWindow()
var object treeWalker = CreateUIATreeWalkerForFocusProcessId(Null(), true)
while treeWalker.gotoParent()
	if treeWalker.currentElement.controlType == UIA_WindowControlTypeId
	&& treeWalker.currentElement.className == wc_NUIDialog
		return true
	endIf
endWhile
return false
EndFunction

string function getNUIDialogGroupBoxName()
var
	string focusName = GetObjectName(),
	int i = 1,
	string levelName
for i = 1 to 3
	if GetObjectSubTypeCode(SOURCE_CACHED_DATA, i) == wt_groupbox
		levelName = GetObjectName(false,i)
		if levelName !=FocusName
			return levelName
		endIf
	endIf
EndFor
return cscNull
EndFunction

int function OnBackstageViewPane()
var object treeWalker = CreateUIATreeWalkerForFocusProcessId(Null(), true)
while treeWalker.gotoParent()
	if treeWalker.currentElement.controlType == UIA_PaneControlTypeId
	&& treeWalker.currentElement.automationID == "BackstageView"
		return true
	endIf
endWhile
return false
EndFunction

void function GetAppUIAWindowAndPaneTitles(string byRef AppWindowTitle, string byRef PaneTitle)
var
	object oUIA,
	object element,
	object processCondition,
	object criteriaCondition,
	object treeCondition,
	object treeWalker
oUIA = CreateObjectEx("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest")
if !oUIA return endIf
element = oUIA.GetFocusedElement().BuildUpdatedCache()
processCondition = oUIA.CreateIntPropertyCondition(UIA_ProcessIdPropertyId, element.ProcessID)
criteriaCondition = oUIA.CreateOrCondition(
	oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_WindowControlTypeId),
	oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_PaneControlTypeId))
criteriaCondition = oUIA.CreateOrCondition(criteriaCondition,
	oUIA.CreateBoolPropertyCondition( UIA_HasKeyboardFocusPropertyId,UIATrue))
treeCondition = oUIA.CreateAndCondition(processCondition,criteriaCondition)
treeWalker = oUIA.CreateTreeWalker(treeCondition)
if !treeWalker return endIf
treeWalker.currentElement = oUIA.getRootElement()
treeWalker.gotoFirstChild()
AppWindowTitle = treeWalker.currentElement.name
SetCurrentElementToDeepestFocusElement(oUIA, treeWalker)
while treeWalker.gotoParent()
	if treeWalker.currentElement.className == "MsoWorkPane"
	|| treeWalker.currentElement.className == "NUIDialog"
	|| treeWalker.currentElement.automationID == "BackstageView"
		if treeWalker.currentElement.name
			paneTitle = treeWalker.currentElement.name
			return
		endIf
	endIf
endWhile
EndFunction

int function OnVirtualRibbonEditCombo()
var
	int iState,
	string sTab,
	string sGroup,
	string sDesc
GetRibbonStatus(iState,sTab,sGroup,sDesc)
return iState
	&& ISVirtualPCCursor()
	&& GetObjectSubtypeCode() == wt_editCombo
EndFunction

int function moveInsideNavigationBar (string keystroke)
if getWindowClass (getFocus ()) == wcNavigationBar then
	TypeKey (keystroke)
	delay (1, TRUE)
	UIARefresh  ()
	return TRUE
endIf
return FALSE
endFunction

void function ShiftTabKey ()
; NavigationBar (AwesomeBar) does not automatically detect UIA focus change.
if moveInsideNavigationBar (cksShiftTab) then return endIf
ShiftTabKey ()
endFunction

void function tabKey ()
; NavigationBar (AwesomeBar) does not automatically detect UIA focus change.
if moveInsideNavigationBar (cksTab) then return endIf
tabKey ()
endFunction

void function nextCharacter ()
if SayCursorMovementException (UnitMove_Next) then return nextCharacter () endIf
; NavigationBar (AwesomeBar) does not automatically detect UIA focus change.
if moveInsideNavigationBar (cksRightArrow) then return endIf
nextCharacter ()
endFunction

void function priorCharacter ()
if SayCursorMovementException (UnitMove_Prior) then return priorCharacter () endIf
; NavigationBar (AwesomeBar) does not automatically detect UIA focus change.
if moveInsideNavigationBar (cksLeftArrow) then return endIf
priorCharacter ()
endFunction

Script CloseListBox ()
if inRibbons () then 
	SayCurrentScriptKeyLabel ()
	typeKey (cksAltUpArrow) 
	return
endIf
PerformScript CloseListBox ()
endScript

Script OpenListBox ()
if inRibbons () then
	SayCurrentScriptKeyLabel ()
	typeKey (cksAltDownArrow) 
	return
endIf
PerformScript OpenListBox ()
endScript

String Function GetVersionInfoString (string appFilePath, string requestedInfo)
if requestedInfo == cmsg282_L;ProductName
	var
		string appName = scMicrosoft + cScSpace + GetActiveConfiguration ()
		return GetOfficePurchaseInfo (appName)
endIf
return GetVersionInfoString (appFilePath, requestedInfo)
EndFunction

int function IsFocusInSDMEditCombo()
if UserBufferIsActive() return false endIf
var handle hFocus = GetFocus()
return GetWindowSubtypeCode(hFocus) == wt_editCombo
	&& StringStartsWith(GetWindowClass(GetParent(hFocus)),"bosa_sdm_")
EndFunction

int function IsFocusInSDMSingleLineEdit ()
if UserBufferIsActive() return false endIf
var handle hFocus = GetFocus()
return GetObjectSubtypeCode () == WT_EDIT
	&& StringStartsWith(GetWindowClass(hFocus),"bosa_sdm_")
EndFunction

int function IsWordDocumentActiveTest()
var	string sOwner = StringLower(getWindowOwner(GetFocus()))
return StringContains(sOwner,WordAppDocumentArea)
endFunction

int function OutlookIsActiveTest()
var
	string sOwner = StringLower(getWindowOwner(GetFocus())),
	string AppFileName = StringLower(GetAppFileName ())
return StringContains(sOwner,OutlookApp)
	|| StringContains(AppFileName,OutlookApp)
endFunction

void function VirtualPCCursorToggle ()
VirtualPCCursorToggle ()
VirtualPcCursorApplicationSetting = getJCFOption (OPT_VIRTUAL_PC_CURSOR)
endFunction

script SayNextLine()
if !IsPcCursor()
|| isVirtualPCCursor()
|| UserBufferIsActive()
|| InHJDialog()
	PerformScript SayNextLine()
	return
endIf
if GetObjectSubtypeCode() == WT_EDIT
&& GetObjectClassName() == "NetUISearchBoxTextbox"
	;A focus change will occur when NextLine is issued, so just return:
	NextLine()
	return
endIf
PerformScript SayNextLine()
EndScript

int function IsSecondaryFocusVisible()
return IsSecondaryFocusActive()
	&& !UserBufferIsActive()
	&& IsPCCursor()
EndFunction

int function readBoxInTabOrderUsingAccessibilityInfrastructure (handle realWindow, handle focusWindow)
if StringStartsWith(GetWindowClass (realWindow), wc_bosa_sdmGeneral)
	Say(GetTypeAndTextStringsForWindow(getFocus()),ot_USER_REQUESTED_INFORMATION)
	return true
endIf
return readBoxInTabOrderUsingAccessibilityInfrastructure (realWindow, focusWindow)
endFunction

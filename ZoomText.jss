; Copyright 1995-2018 by Freedom Scientific, Inc.
; Freedom Scientific companion script file for Zoomtext

include "HjConst.jsh"
include "HjGlobal.jsh"
include "MSAAConst.jsh"
include "UIA.jsh"
include "common.jsm"
include "jfw.jsh" ; for QuickAccessBar
include "jfw.jsm" ; for QuickAccessBar

use "RemoteSupportUI.jsb"

import "UIA.jsd"

CONST
	ID_AlignmentSpinControl = 2397,
	ID_AlignmentSpinControl2 = 2915,
	welcomeWindowClass = "welcome.exe"

GLOBALS
	int giFN_SpeakActivePageName

string function GetFocusedApplicationVersionInfo ()
if getRunningFSProducts () & Product_Fusion
	return GetFusionVersionInfo()
endIf
return GetFocusedApplicationVersionInfo ()
endFunction

handle function getAppMainWindow (handle focusWindow)
var handle parent, handle appWindow = getAppMainWindow (focusWindow)
if (getWindowSubtypeCode (appWindow) == WT_DIALOG) parent = getParent (appWindow) endIf
if (parent && isWindowVisible (parent)) return parent endIf
return appWindow
endFunction

int function IsExemptFromMouseSpeech(int x, int y, object element)
var
	handle hWnd = GetWindowAtPoint (x, y),
	string class = GetWindowClass (hWnd)
if ! GetMenuMode () then return IsExemptFromMouseSpeech (x, y, element) endIf
; The menu is opened, but the desktop and other items were not reading properly.
; This will not account for items like open documents where text is partially covered up.
if ! stringContains (class, ".ZoomText") return FALSE endIf
return IsExemptFromMouseSpeech (x, y, element)
endFunction

string function GetDialogPageName ()
var
	handle hwnd = getFocus (),
	string pageName = getDialogPageName (),
	object UIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" ),
	object startElement = UIA.GetElementFromHandle(hWnd),
	object PageElement,
	object FindCondition, object ControlTypeCondition, object SelectionCondition
if ! UIA || ! startElement then return pageName endIf
ControlTypeCondition = UIA.CreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_TabItemControlTypeId)
SelectionCondition = UIA.CreateBoolPropertyCondition(UIA_SelectionItemIsSelectedPropertyId, UIATrue)
findCondition = UIA.CreateAndCondition(ControlTypeCondition, SelectionCondition)
if ! ControlTypeCondition || ! SelectionCondition || ! findCondition then return pageName endIf
PageElement = startElement.FindFirst(TreeScope_Subtree, findCondition)
if ! PageElement then return Pagename endIf
Pagename = PageElement.name
return pageName
endFunction

void function SpeakActivePageName ()
var string PageName = getDialogPageName ()
if ! StringIsBlank (PageName) then
	pageName = formatString (cmsg230_L, pageName)
	say (pagename, OT_CONTROL_NAME)
endIf
endFunction

int function IsMultiPageDialog ()
if dialogActive () then return IsMultiPageDialog () endIf
return TRUE; ZoomText 11 or greater with JAWS support. 
endFunction

void function SayWindowTypeAndText (handle window)
if getWindowSubtypeCode (window) != WT_DIALOG then
	SayWindowTypeAndText (window)
	return
endIf
if ! IsMultipageDialog () then 
	SayWindowTypeAndText (window)
	return
endIf
; avoids double speaking of window type and text when entering multipage dialog box:
indicateControlType (WT_DIALOG, getWindowName (window))
endFunction

void function SayLineUnit(int unitMovement, optional int bMoved)
var int Type = getWindowSubTypeCode (getFocus ())
if ! type then type = getObjectSubtypeCode(SOURCE_CACHED_DATA) endIf
; section for spinboxes and edit spin boxes was copied directly from Default and changed.
if type == wt_edit_spinbox 
|| type == wt_spinbox 
; The MSAA doesn't properly update without a refresh, so wrong value is read.:
	if ! IsKeyWaiting () then
		; wait in case the user had pushed and held down the key:
		if UnitMovement != UnitMove_Current then
		; the window needs to have had time to update:
			Delay (1)
		endIf
		var handle FocusWindow = getFocus (), int controlID = getControlID (focusWindow)
		if ControlID  == ID_AlignmentSpinControl 
		|| ControlID  == ID_AlignmentSpinControl2 then
			return say (getWindowName (getPriorWindow (focusWindow)), OT_LINE)
		endIf
		; SayLine works correctly, it's up and down that are broken:
		if unitMovement == UnitMove_Current then
			return SayLineUnit(unitMovement, bMoved)
		endIf
		delay (1, TRUE)
		MSAARefresh () 
		if type == wt_spinbox then
			say (getObjectName(SOURCE_CACHED_DATA), OT_LINE)
		else
			Delay (1, TRUE)
		endIf
	endIf
	Say(GetObjectValue(),OT_LINE) 
	return
endIf
return SayLineUnit(unitMovement, bMoved)
endFunction

int function BrailleAddObjectName (int type)
if type == wt_edit_spinbox 
|| type == wt_spinbox 
	var handle focusWindow = getFocus (), int controlID = getControlID (focusWindow)
	if ControlID  == ID_AlignmentSpinControl 
	|| ControlID  == ID_AlignmentSpinControl2 then
		brailleAddString (getWindowName (getPriorWindow (getPriorWindow (focusWindow))), 0,0,0)
	return TRUE
	endIf
endIf
return BrailleAddObjectName (type)
endFunction

int function BrailleAddObjectValue (int type)
if type == wt_edit_spinbox 
|| type == wt_spinbox 
	var handle focusWindow = getFocus (), int controlID = getControlID (focusWindow)
	if ControlID  == ID_AlignmentSpinControl 
	|| ControlID  == ID_AlignmentSpinControl2 then
		brailleAddString (getWindowName (getPriorWindow (focusWindow)), 0,0,0)
	else
		BrailleAddString (GetObjectValue(),GetCursorCol (), GetCursorRow (), ATTRIB_HIGHLIGHT)
	endIf
	return TRUE
endIf
return BrailleAddObjectValue (type)
endFunction

int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if hwndFocus == hwndPrevFocus
&& getWindowSubtypeCode (hwndFocus) == WT_SPINBOX then
; arrow keys in magnification spin control cause double speech:
	globalPrevFocus = hwndFocus ; prevent TutorMessageEvent from speaking when navigating with arrows.
	return TRUE
endIf
var handle ieServerWindow, string windowClass = getWindowClass (hwndFocus)
if ! isVirtualPcCursor () ; not doing alt tab back to welcome window, or it crashes
&& ! getObjectSubtypeCode(SOURCE_CACHED_DATA)
&& stringContains (stringLower (windowClass), stringLower (welcomeWindowClass)) then
	ieServerWindow = findWindow (hwndFocus, cwcIEServer)
endIf
if ieServerWindow && isWindowVisible (ieServerWindow) then
	setFocus (ieServerWindow)
	return TRUE
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild, 
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
endFunction

int function SayTutorialHelpForQuickAccessBar (int iSpeak)
var int objectSubtypeCode = getObjectSubtypeCode ()
if objectSubtypeCode == WT_LISTBOX 
&& getObjectAutomationID () == AutomationID_ShortcutsList then
	SayUsingVoice (VCTX_MESSAGE, msgShortcutsListTutor, iSpeak)
	return TRUE
elIf objectSubtypeCode == WT_LISTBOXITEM
; After you move down into the list box once opened:
&& getObjectAutomationID (1) == AutomationID_ShortcutsList then
	SayUsingVoice (VCTX_MESSAGE, msgShortcutsListTutor, iSpeak)
	return TRUE
endIf
return SayTutorialHelpForQuickAccessBar (iSpeak)
endFunction

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
if ! nMenuMode && hwndFocus == globalPrevFocus
&& getWindowSubtypeCode (hwndFocus) == WT_SPINBOX then
; arrow keys in magnification spin control cause event to fire:
	return 
endIf
return tutorMessageEvent(hwndFocus, nMenuMode)
endFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
;overwrite this function to silence new text
if getWindowSubtypeCode (hFocus) == WT_SPINBOX then
	; spin box speaks automatically with the ZoomText keys,
	; so prevent newTextEvent from speaking and use the arrow keys instead.
	; Otherwise, the ZoomText keys would speak first, then newTextEvent.
	return TRUE
endIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
endFunction

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if iObjType == WT_LISTBOXITEM && ! nState
&& getWindowSubtypeCode (hObj) == WT_LISTVIEW then
	return ; keep commands keys list from double speaking.
elIf iObjType == WT_SPLITBUTTON then
; the Enabled and Disabled states are coming to us internally.
	return
endIf
return ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
endFunction

string function GetEnabledOrDisabledState (int MSAAState)
if MSAAState & STATE_SYSTEM_SELECTED then
	return cmsgDisabled
elIf MSAAState & STATE_SYSTEM_UNAVAILABLE then
	return cmsgEnabled
endIf
endFunction

void function sayObjectTypeAndText (optional int level, int includeContainerName)
if level > 0 then
	return sayObjectTypeAndText (level, includeContainerName)
endIf
var handle focusWindow = getFocus (), int controlID = getControlID (FocusWindow)
if ControlID  == ID_AlignmentSpinControl 
|| ControlID  == ID_AlignmentSpinControl2 then
	var handle ValueWindow = getPriorWindow (focusWindow), handle nameWindow = getPriorWindow (ValueWindow)
	var string name = getWindowName (NameWindow)
	var string value = getWindowName (ValueWindow)
	indicateControlType (WT_SPINBOX, name, value)
	return
endIf
if getObjectSubtypeCode () != WT_SPLITBUTTON then
	return sayObjectTypeAndText (level, includeContainerName)
endIf
var string stateString = GetEnabledOrDisabledState (GetObjectStateCode ())
SayControlEX (null (), getObjectName (), GetObjectSubtype (), stateString)
endFunction

int function BrailleAddObjectDescription (int subtype)
if Subtype!= WT_SPLITBUTTON then
	return BrailleAddObjectDescription (subtype)
endIf
var string stateString = GetEnabledOrDisabledState (GetObjectStateCode ())
if ! stringIsBlank (StateString) then
	BrailleAddString (stateString, 0,0,0)
endIf
; return the default just in case a description string ever exists:
return BrailleAddObjectDescription (subtype)
endFunction

void function SayFocusAfterExitUserBuffer()
if getObjectSubtypeCode () == WT_SPLITBUTTON then
	return SayObjectTypeAndText ()
endIf
SayFocusAfterExitUserBuffer()
endFunction

string function getCustomScreenSensitiveHelpQuickAccessBar ()
var string automationID = getObjectAutomationID ()
if automationID == AutomationID_PinButton then
	return sshQABMsg_PinButton
elIf automationID == AutomationID_unpinButton then
	return sshQABMsg_UnpinButton
elIf automationID == AutomationID_ShortcutsView then
	return sshQABMsg_ShortcutsView
elIf automationID == AutomationID_ZoomButton
|| automationID == AutomationID_ZoomSlider
|| automationID == AutomationID_SpeechRateButton
|| automationID == AutomationID_SpeechRateSlider then
	return sshQABMsg_ZoomButton
elIf automationID == AutomationID_ZoomOutButton then
	return sshQABMsg_ZoomOutButton
elIf automationID == AutomationID_ZoomInButton then
	return sshQABMsg_ZoomInButton
elIf automationID == AutomationID_SpeechButton then
	return sshQABMsg_SpeechButton
elIf automationID == AutomationID_DecreaseSpeechRateButton then
	return sshQABMsg_DecreaseSpeechRateButton
elIf automationID == AutomationID_IncreaseSpeechRateButton then
	return sshQABMsg_IncreaseSpeechRateButton
elIf automationID == AutomationID_ColorButton then
	return sshQABMsg_ColorButton
elIf automationID == AutomationID_SpeechHistoryButton then
	return sshQABMsg_SpeechHistoryButton
elIf automationID == AutomationID_MouseEchoButton then
	return sshQABMsg_MouseEchoButton
elIf automationID == AutomationID_JAWSManagerButton then
	return sshQABMsg_JAWSManagerButton
elIf automationID == AutomationID_SelectVoiceProfileButton then
	return sshQABMsg_SelectVoiceProfileButton
elIf automationID == AutomationID_ShowShortcutNamesButton then
	return sshQABMsg_ShowShortcutNamesButton
elIf automationID == AutomationID_ShortcutNamesCustomizeButton then
	return sshQABMsg_ShortcutNamesCustomizeButton
endIf
return cscNull
endFunction

string function GetCustomScreenSensitiveHelpForKnownClasses (int nSubTypeCode)
var string CustomScreenSensitiveHelp
if stringContains (getWindowClass (getFocus ()), "QuickAccessBar.exe") then
	CustomScreenSensitiveHelp = getCustomScreenSensitiveHelpQuickAccessBar ()
endIf
if stringIsBlank (CustomScreenSensitiveHelp) then 
	CustomScreenSensitiveHelp = GetCustomScreenSensitiveHelpForKnownClasses (nSubTypeCode)
endIf
return CustomScreenSensitiveHelp
endFunction

script SayLine ()
if SayCursorMovementException (UnitMove_Current) then
	PerformScript SayLine ()
	return
endIf
var int subtypeCode = getObjectSubtypeCode () 
if subtypeCode == WT_SPINBOX || subtypeCode == WT_EDIT_SPINBOX then
	SayLineUnit (UnitMove_Current)
	return
endIf
if subtypeCode != WT_SPLITBUTTON then
	PerformScript SayLine ()
	return
endIf
var string line = GetObjectName () + cscSpace + GetObjectSubtype () + cscSpace + GetEnabledOrDisabledState (GetObjectStateCode ())
line = StringTrimTrailingBlanks (line)
if isSameScript () then
	spellString (line)
else
	say (line, OT_LINE)
endIf
endScript

Script NextDocumentWindow ()
performScript NextDocumentWindow ()
if ! DialogActive () then
	giFN_SpeakActivePageName = scheduleFunction ("SpeakActivePageName", 2)
endIf
endScript

script PreviousDocumentWindow ()
performScript PreviousDocumentWindow ()
if ! DialogActive () then
	giFN_SpeakActivePageName = scheduleFunction ("SpeakActivePageName", 2)
endIf
endScript

script ScriptFileName ()
ScriptAndAppNames (GetActiveConfiguration ())
endScript

script ScreenSensitiveHelp ()
if userBufferIsActive () || isVirtualPcCursor () then
	performScript ScreenSensitiveHelp ()
	return
elIf ScreenSensitiveHelpRemoteDesktopDialog() then
	return
else
	performScript ScreenSensitiveHelp ()
	return
endIf
endScript


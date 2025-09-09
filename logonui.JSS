; Copyright 1995-2018 by Freedom Scientific, Inc.
include "msaaconst.jsh"
; JAWS Script for the logon screen

include "hjConst.jsh"
include "UIA.jsh"
Include "common.jsm"
include "LogonUI.jsm"

import "UIA.jsd"
import "touch.jsd"

const
;UIA Automation id's:
	id_GlyphElement = "GlyphElement"


;UIA event handling:
const
	UIA_WindowsLogon_EventFunctionNamePrefix = "WindowsLogon"
globals
	object UIA_WindowsLogon
	
; We Override FocusChangedEvent to ensure that we properly speak the
;new user name when arrowing up and down when the password field has focus
GLOBALS
	string gstrBrlUserName

;A global focus change element is updated by UIA focus change event,
;and tested in the JAWS focus change to see if the focus change was missed by JAWS:
globals
	object UIA_WinLogonFocusChangeElement

;for making sure the touch keyboard appears when the edit field is double tapped:
const
	WaitTimeForToggleTouchKeyboard = 10  ;wait Time before calling ToggleTouchKeyboard
globals
	int ScheduleToggleTouchKeyboard

const
	ObjectState_Grayed = 4

const
	ObjectState_Disabled = 8

const
    scheduledRefreshTime = 10  ;Tenths of a second
globals
    int RefreshScheduleID


void function AutoStartEvent()
if GetProgramVersion(GetAppFilePath()) == 6
	;Windows 7 will have major version 6 and minor version 1:
	var int major, int minor, int build, int update
	GetFixedProductVersion(GetAppFilePath(),major,minor,build,update)
	if minor == 1
		SwitchToConfiguration("LogonUIWin7")
		return
	endIf
endIf
InitWindowsLogon()
EndFunction

void function AutoFinishEvent()
UIA_WindowsLogon = Null()
UIA_WinLogonFocusChangeElement = null()
EndFunction

void function WindowsLogonFocusChangedEvent (object element)
;Keep track of the UIA focus element,
;so that we can test against it to see if JAWS missed setting the focus to the password edit.
UIA_WinLogonFocusChangeElement = element
if UIA_WinLogonFocusChangeElement.controlType != UIA_editControlTypeId
	;If the keyboard is showing, make sure to dismiss it.
	;Double tap on the edit will toggle the keyboard to showing.
	;Do not try to show it when the focus moves to the edit field.
	ToggleTouchKeyboard()
endIf
EndFunction

void function WindowsLogonAutomationEvent(object element, int eventID)
if eventID == UIA_LiveRegionChangedEventId
&& element.controlType == UIA_TextControlTypeId
	Say(element.name,ot_screen_message)
endIf
EndFunction

void function InitWindowsLogon()
if UIA_WindowsLogon return endIf
UIA_WindowsLogon = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !UIA_WindowsLogon return endIf
if !ComAttachEvents(UIA_WindowsLogon,UIA_WindowsLogon_EventFunctionNamePrefix)
	UIA_WindowsLogon = Null()
	return
endIf
if !UIA_WindowsLogon.AddFocusChangedEventHandler()
	UIA_WindowsLogon = Null()
	return
endIf
var object focusElement = UIA_WindowsLogon.GetFocusedElement().BuildUpdatedCache()
if !focusElement
	UIA_WindowsLogon = Null()
	return
endIf
var object processCondition = UIA_WindowsLogon.CreateIntPropertyCondition(UIA_ProcessIdPropertyId,focusElement.ProcessID)
if !processCondition
	UIA_WindowsLogon = Null()
	return
endIf
var object treeWalker = UIA_WindowsLogon.CreateTreeWalker(processCondition)
if !treeWalker
	UIA_WindowsLogon = Null()
	return
endIf
treeWalker.currentElement = focusElement
var object appElement = focusElement
while treeWalker.gotoParent() appElement = treeWalker.currentElement endWhile
if !appElement
	UIA_WindowsLogon = Null()
	return
endIf
if !UIA_WindowsLogon.AddAutomationEventHandler(UIA_LiveRegionChangedEventId, appElement, TreeScope_Descendants)
	UIA_WindowsLogon = Null()
	return
endIf
EndFunction

void Function FocusChangedEvent(handle FocusWindow, handle PrevWindow)
var
	int nLevel
nLevel = GetFocusChangeDepth()
if (nLevel ==2 && GetObjectSubTypeCode(FALSE,2) == WT_LISTBOXITEM) then
	sayObjectTypeAndText(nLevel)
	gstrBrlUserName = GetObjectName(SOURCE_CACHED_DATA, nLevel)
Else
	gstrBrlUserName = cscNULL;
EndIf
FocusChangedEvent(FocusWindow,PrevWindow)
EndFunction

void function SayLineUnit(int unitMovement, int bMoved)
If (! IsPcCursor ()
|| unitMovement < UnitMove_Next
|| InHjDialog ()
|| IsVirtualPcCursor ()
|| UserBufferIsActive ()
|| MenusActive ()) then
	Return SayLineUnit(unitMovement, bMoved)
EndIf
If (GetWindowClass (GetFocus ()) == cwc_DirectUIhWND
|| GetObjectSubtypeCode () == WT_PASSWORDEDIT)
	Return
EndIf
SayLineUnit(unitMovement, bMoved)
EndFunction

int Function GetLogonUserName (String ByRef strUser)
strUser = gstrBrlUserName
Return StringLength(strUser)
EndFunction

int Function BrailleAddObjectName (int nSubtypeCode)
var
	int bWelcomeScreen,
	string strName
If nSubTypeCode != WT_PASSWORDEDIT then
	Return BrailleAddObjectName (nSubtypeCode)
EndIf
bWelcomeScreen = GetLogonUserName (strName)
If bWelcomeScreen then
	BrailleAddString (strName,0,0,0)
	Return TRUE;
EndIf
Return BrailleAddObjectName (nSubtypeCode)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgWindowsLogonAppName)
EndScript

int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if GetObjectAutomationID() == "OKButton"
&& !GetAncestorCount ()
	;Read Interactive logon: Message text for users attempting to log on, set by group policy
	PerformScript ReadBoxInTabOrder()
	return true
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
endFunction

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
var
	int objectStateCode
objectStateCode = GetObjectStateCode()
if objectStateCode == ObjectState_Grayed || objectStateCode == ObjectState_Disabled
    ; Indicates that the MSSA data is incomplete. Schedule a function 
    ; to provke a refresh.
    if !RefreshScheduleID
        RefreshScheduleID = ScheduleFunction("RefreshFocus", scheduledRefreshTime)
    endIf
endIf
if (UIA_WinLogonFocusChangeElement.controlType == UIA_EditControlTypeId || UIA_WinLogonFocusChangeElement.controlType == UIA_ButtonControlTypeId)
&& !GetObjectSubtypeCode()
	;JAWS didn't see that the focus moved to the edit.
	;Force a refresh, so that JAWS sees the edit has focus.
	;This problem occurs when waking up from sleep and the password field gains focus.
	UIARefresh()
endIf
FocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
var
	int objectStateCode
if nLevel == 0
    objectStateCode = GetObjectStateCode()
        if objectStateCode == ObjectState_Grayed || objectStateCode == ObjectState_Disabled
	    ; Indicates that the MSSA data is incomplete. Speaking here will
	    ; say "Unavailable". FocusChangedEventEx will schedule a function 
	    ; to provke a refresh.
        return;
    endIf
endIf
if GetObjectSubtypeCode() == wt_passwordEdit
	if nLevel == 1
		;Announcing this level is redundant:
		return
	elif nLevel == 0
		;The builtin function results in seemingly redundant announcement of password edit:
		IndicateControlType(wt_passwordEdit,GetObjectName())
		return
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

int function MainProcessShouldSkipUIAElementWhenNavigating(object element)
if element.isPassword
&& !element.isKeyboardFocusable
	;Windows 10: This is the first child element of the focusable password edit field:
	return true
elif element.controlType == UIA_TextControlTypeId
	if element.automationID == id_GlyphElement
		;Windows 10: This child of the Show/Reveal password button has no text:
		return true
	endIf
	var object parent = UIAGetParent( element )
	if parent.isPassword
		;Windows 10: Under some conditions,
		;no show/reveal password button exists,
		;but a text field appears in its place which simply says "Password":
		return true
	endIf
endIf
return MainProcessShouldSkipUIAElementWhenNavigating(element)
EndFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
;where Zoomtext and JAWS run at startup in Windows 7, username repeats constantly:
if getWindowClass (hwnd) == cwc_DirectUIhWND then return TRUE endIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
endFunction

int function TouchTapSetFocusToCurrentElement(optional int x, int y)
if TouchTapSetFocusToCurrentElement(x,y)
	ScheduleToggleTouchKeyboard = ScheduleFunction("ToggleTouchKeyboard",WaitTimeForToggleTouchKeyboard)
endIf
EndFunction

void function ToggleTouchKeyboard()
ScheduleToggleTouchKeyboard = 0
if UIA_WinLogonFocusChangeElement.controlType == UIA_EditControlTypeId
	if !IsTouchKeyboardVisible()
		ShowTouchKeyboard()
	endIf
else
	if IsTouchKeyboardVisible()
		HideTouchKeyboard()
	endIf
endIf
EndFunction

script SayLine()
if IsPCCursor()
&& GetObjectSubtypeCode() == wt_passwordEdit
	SayObjectTypeAndText()
	return
endIf
PerformScript SayLine()
EndScript

int function SayWin8AppWindowTitle()
;The default version tests for IsMetroApp, which returns false for the logon screen.
;This overwritten version skips that test.
var string sTitle = GetWin8AppWindowTitle()
SayMessage(ot_USER_REQUESTED_INFORMATION,
	FormatString (cmsg29_L, sTitle, cscNull),
	FormatString (cMsg29_S, sTitle, cscNull))
return true
EndFunction

Script ReadBoxInTabOrder()
if !IsVirtualPCCursor()
	UIAReadBoxInTabOrder()
	return
endIf
PerformScript ReadBoxInTabOrder()
EndScript

void function RefreshFocus()
RefreshScheduleID = 0
MSAARefresh()
EndFunction

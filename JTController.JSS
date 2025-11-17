; Copyright 2010-2015 by Freedom Scientific, Inc.
; JAWS tandem controller script file

Include "HJConst.jsh"
include "hjglobal.jsh"
include "common.jsm"
Include "JTController.jsm"

const
id_Meeting_ID_ReadOnlyEdit = 1011

globals
string GlobalPrevRealWindowName

Void Function AutoFinishEvent ()
SetJTControllerMode(JTCONTROLLER_MODE_SLEEP)
EndFunction

void function ProcessSayAppWindowOnFocusChange(handle AppWindow, handle FocusWindow)
var
	handle hWnd,
	object o
if GlobalPrevApp != AppWindow
&& AppWindow != FocusWindow
&& !GlobalWasHjDialog then
	;Begin block to announce if video is enabled:
	;The following behavioral overwrite is at the direction or product management.
	;The purpose of the following block is to:
	;When the JTController appears, if the Enable Video is checked,
	;announce that the video is enabled after the dialog name and before the static text.
	let hWnd = FindWindow(AppWindow,cwc290,wn_EnableVideo_Checkbox)
	if hWnd && IsWindowVisible(hWnd) then
		let o = GetObjectAtPoint(0,(GetWindowLeft(hWnd)+GetWindowRight(hWnd))/2,(GetWindowTop(hWnd)+GetWindowBottom(hWnd))/2)
		if o.accState & 0x0010 then
			IndicateControlType(wt_dialog,GetWindowName(AppWindow),cscSpace)
			SayUsingVoice(vctx_message,msgVideoIsEnabled,ot_status)
			Say(GetWindowText(GetNextWindow(GetFirstChild(AppWindow)),0),ot_dialog_text)
			return
		EndIf
	EndIf
	;End block to announce if video is enabled
EndIf
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
EndFunction

/*
;Added the following function overwrite to speak dialog name change
;and static text change which is not spoken.
;Because Product Management doesn't want the static text announced, though, this is commented out.
;If you do want the static text announced, simply uncomment this function.
void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
if GlobalPrevRealWindowName then
	if GlobalPrevRealWindowName != RealWindowName then
		SayWindowTypeAndText(RealWindow)
	EndIf
EndIf
ProcessSayRealWindowOnFocusChange(AppWindow,RealWindow,RealWindowName,FocusWindow)
let GlobalPrevRealWindowName = RealWindowName
EndFunction
*/

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
; When focus moves to the JAWS Tandem Controller Window,
; the controller JAWS needs to go into Tandem mode.  A
; jcf option might have been used, but the login screens
; were then mishandled.
; The OPT_JTCONTROLLER_WINDOW option can be set
; to notify JAWS when a JTController window is
; encountered.  A value of 1 indicates the display window is
; entered.  A value of 0 indicates the display window is
; exited.
if (GetWindowClass(FocusWindow) == "JTController") then
	; Focus moving to JTController Display Window
	SetJTControllerMode(JTCONTROLLER_MODE_FULL)
else
	SetJTControllerMode(JTCONTROLLER_MODE_MIN)
endif
FocusChangedEvent(FocusWindow, PrevWindow)
EndFunction

/*
;If you want the meeting ID spelled rather than spoken as a word,
;uncomment this function.
void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd,
	int iSubtype,
	int CtrlID
let hWnd = GetCurrentWindow()
let iSubtype = GetObjectSubtypeCode(hWnd)
let CtrlID = GetControlID(hWnd)
if iSubtype == wt_ReadOnlyEdit
&& CtrlID == id_Meeting_ID_ReadOnlyEdit then
	IndicateControlType(wt_ReadOnlyEdit,GetWindowName(hWnd),cscSpace)
	SpellString(GetWindowText(hWnd,0))
	return
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction
*/


Script PauseTandemVideo()
;because this key/script binding is done internally, KeyboardHelp must be explicitly called.
if gbKeyboardHelp then
	KeyboardHelpHook(PauseTandemVideoScript,cscNull)
	return
EndIf
;only in JTController may the video be toggled.
;The default scripts ensure that an error message is spoken everywhere else.
SetJTControllerMode(JTCONTROLLER_MODE_VIDTOGGLE);
EndScript

Void Function VideoToggledEvent(INT bEnabled)
;Because the video may only be toggle when the JTController is in focus,
;this event is only relevant to the JTController scripts.
if bEnabled then
	SayUsingVoice(vctx_message,msgVideoEnabled,ot_status)
	BrailleMessage (msgVideoEnabled)
else
	SayUsingVoice(vctx_message,msgVideoDisabled,ot_status)
	BrailleMessage (msgVideoDisabled)
EndIf
EndFunction

Script ToggleTandemMode()
;because this key/script binding is done internally, KeyboardHelp must be explicitly called.
if gbKeyboardHelp then
	KeyboardHelpHook(ToggleTandemModeScript,cscNull)
	return
EndIf
;Only the controlling computer may toggle the tandem mode.
;the mode may toggle unconditionally here,
;but in default we must check to see if a tandem controller window exists before the mode may toggle.
SetJTControllerMode(JTCONTROLLER_MODE_TOGGLE)
EndScript

script ScriptFileName()
ScriptAndAppNames(FormatString(msgJTControllerAppName))
EndScript

void function ControllerModeChangedEvent(int mode)
var
	int bShouldPlaySound
let bShouldPlaySound = GetDefaultJCFOption(OPT_USE_SOUNDS_TO_INDICATE_TANDEM)
let GlobalTandemMode = Tandem_Mode_Connection_Suspended
;Note that for the full screen mode,
;the default scripts on the controller side must handle this event to play the full screen sound.
;The JTController window may only handle the sound for the minimize.
if bShouldPlaySound
&& GlobalTandemDisconnectSound then
	PlaySound(GlobalTandemDisconnectSound)
EndIf
EndFunction

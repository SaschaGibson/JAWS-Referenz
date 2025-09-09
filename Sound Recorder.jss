;Copyright 1997-2015 by Freedom Scientific BLV Group, LLC
;version 4.00.00
;
;****************************************
;*	        Written By		*
;*	Freedom Scientific Scripting	*
;*		Team Gold		*
;****************************************
;
include "hjconst.jsh"
include "SndRec32.jsh"
include "SndRec32.jsm"
include "common.jsm"

globals
	int SoundRecFirst,
	int nSuppressEcho,
	int LimitSpeech

Function AutoStartEvent()
let nSuppressEcho = 1
if (SoundRecFirst == 0) then
	let SoundRecFirst = 1
	SayFormattedMessage (OT_APP_START, msg12_L) ; "To select a button from the list, press"
	SayFormattedMessage(OT_APP_START, GetScriptKeyName ("SelectAButton"))
	SayFormattedMessage (OT_APP_START, msg11_L) ; "if you are using a software synthesizer, try toggling the LimitSpeech option with"
	SayFormattedMessage (OT_APP_START,GetScriptKeyName ("LimitSpeech"))
endif
EndFunction

Void Function AutoFinishEvent ()
let nSuppressEcho = 0
EndFunction

Void Function PressButton (int iButton, string sButton)
var
	handle hwnd
let hwnd = GetRealWindow (GetFocus ())
if (! DialogActive ()) || (MenusActive ()) then
	return
endif
SaveCursor ()
JAWSCursor ()
SaveCursor ()
MoveToControl (hwnd, iButton)
Delay (4)
if (GetControlID (GetCurrentWindow ()) != iButton) then
	SayFormattedMessage (OT_ERROR, sButton + msg8_L + msg2_L) ; "button not found"
	return
endif
if LimitSpeech == 0 then
	Say (sButton, OT_CONTROL_NAME)
endif
LeftMouseButton ()
EndFunction

Script  ScriptFileName()
ScriptAndAppNames (msgFN1)
EndScript

Script HotKeyHelp()
var
	string sTemp_L,
	string sTemp_S
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
;wn1="Sound Recorder"
if (StringContains (GetWindowName (GetRealWindow (GetFocus())), wn1)) ||
(! MenusActive ()) ||
(GetWindowClass (GetParent (GetFocus ())) != wcDialog) ||
(! DialogActive ()) then
	let sTemp_L =msgHotKeyHelp1_L + cScBufferNewLine
	let sTemp_S = msgHotKeyHelp1_S + cScBufferNewLine
;can get creative here.
	let sTemp_L =AddToString(sTemp_L,msgHotKeyHelp2_L)
	let sTemp_S = AddToString(sTemp_L, msgHotKeyHelp2_S)
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
else ; Default HotKeyHelp
	PerformScript HotKeyHelp()
endif
EndScript

Script StartRecord ()
PressButton (record, msg4_L) ; "record"
EndScript

Script ClickStop ()
PressButton (stop, msg7_L) ; "stop"
EndScript

Script ClickPlay ()
PressButton (play, msg3_L) ; "play"
EndScript

Script ClickFastForward ()
PressButton (forward, msg6_L) ; "forward"
EndScript

Script ClickRewind ()
PressButton (rewind, msg5_L) ; "rewind"
EndScript

Script LimitSpeech ()
if (LimitSpeech == 0) then
	let LimitSpeech = 1
	SayFormattedMessage (OT_STATUS, msg9_L) ; "LimitSpeech on"
	return
endif
if (LimitSpeech >= 1) then
	let LimitSpeech = 0
	SayFormattedMessage (OT_STATUS, msg10_L) ; LimitSpeech off"
	return
endif
EndScript

Script SelectAButton ()
var
	int index
let index = 0;
if InHJDialog () then
	SayFormattedMessage (OT_ERROR, msg13_L)
	SayFormattedMessage (OT_ERROR, msg14_L)
	SayFormattedMessage (OT_ERROR, msg15_L)
	return
endif
if (! DialogActive ()) || (MenusActive ()) then
	SayFormattedMessage (OT_ERROR, msg8_L + msg2_L) ; "Button not found"
	return
endif ; if not in SoundRecorder main window
let nSuppressEcho = true
let index = DlgSelectItemInList (strToolbar, strDialogName, true)
Delay (2)
if (index == 1) then
	PressButton (forward, msg6_L) ; "forward"
elif (index == 2) then
	PressButton (play, msg3_L) ; "play"
elif (index == 3) then
	PressButton (record, msg4_L) ; "Record"
elif (index == 4) then
	PressButton (rewind, msg5_L) ; "Rewind"
elif (index == 5) then
	PressButton (stop, msg7_L) ; "stop"
endif
EndScript

Script ScreenSensitiveHelp()
var
	int TheID,
	int TheType
let TheID = GetControlID (GetCurrentWindow())
let TheType = GetWindowtypeCode (GetCurrentWindow())
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if (TheType == WT_BUTTON) && (StringContains (GetWindowName(GetRealWindow(GetCurrentWindow())), swn1)) then
	SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp1_L)
	AddHotKeyLinks ()
	return
else
	PerformScript ScreenSensitiveHelp ()
endif
EndScript

string Function AddToString(String Base, String strNew)
	let Base = Base + strNew + cScBufferNewLine

	Return Base
EndFunction
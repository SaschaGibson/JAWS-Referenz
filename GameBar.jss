; Copyright 2024 Freedom Scientific, Inc.
; JAWS script file for Microsoft Game Bar

include "HjConst.jsh"
include "common.jsm"
include "GameBar.jsm"

Script ScriptFileName()
ScriptAndAppNames(msgConfigName) ;"Game Bar"
EndScript

void function AutoStartEvent()
Say (msgConfigName, OT_APP_START)
endFunction

Script SayWindowTitle()
SayFormattedMessage (ot_USER_REQUESTED_INFORMATION, cmsg29_L, cmsg29_S, msgConfigName)
endScript

void function ProcessWindowsPlusArrowKeyPress()
;The Windows+ArrowKey commands are passed through to the underlying application and are not used by Game Bar.
;Just pass the key through here and allow the UIANotificationEvent to announce the default message for the underlying application window.
TypeCurrentScriptKey ()
endFunction

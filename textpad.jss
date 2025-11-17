;Copyright 2015-2024 Freedom Scientific, Inc.
; JAWS script file for Textpad

include "HJConst.jsh"
include "MSAAConst.jsh"
include "UIA.jsh"
include "textpad.jsm"

import "touch.jsd"

const
;classes
	wc_HSEditor = "HSEditor"

int function IsTextReadingAppropriateForCurrentElement()
; Insure that document areas are detected:
var object element = TouchCursorObject()
return (element.controlType == UIA_PaneControlTypeID && element.className == wc_HSEditor)
	|| IsTextReadingAppropriateForCurrentElement()
EndFunction

int function MainProcessShouldSkipUIAElementWhenNavigating(object element)
if IsTextReadingAppropriateForCurrentElement() return false endIf
return MainProcessShouldSkipUIAElementWhenNavigating(element)
EndFunction

int function GestureModeIsAvailable(int mode)
if mode == GestureMode_TextReading && IsTextReadingAppropriateForCurrentElement() return true endIf
return GestureModeIsAvailable(mode)
endFunction

script ScriptFileName()
ScriptAndAppNames(msgTextPadAppName)
EndScript

int function BrailleCallbackObjectIdentify()
if GetObjectRole () == ROLE_SYSTEM_CHECKBUTTON
	return WT_CHECKBOX
endIf
return BrailleCallbackObjectIdentify()
endFunction

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
If !KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	return false
EndIf
if GetObjectRole () == ROLE_SYSTEM_CHECKBUTTON
MSAARefresh (true)
	return true
endIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

;Copyright 2023 Freedom Scientific, Inc.
; These are gutted versions of PowerPnt.jss. Those scripts had so much
;  that was Window class and Window name centric that they broke in
;  numerous ways when running in Windows device Application guard,
;  since when when in WDAG all we get is UIA info.
Include "HJConst.jsh"
include "Common.jsm"
include "HJHelp.jsh"
include "powerPnt2007.jsm"

script ScriptFileName ()
ScriptAndAppNames (msgMSPowerpointWDAG)
endScript

int function IsSlideShowActive()
var
int count,
int index
let count=GetAncestorCount ()
for index = 0 to count
	if GetObjectAutomationId (index)=="SlideShowPane" then
		return true
	endIf
	endFor
	return false
endFunction

Script HotkeyHelp ()
if TouchNavigationHotKeys() then
	return
endIf
if ! getRunningFSProducts () & product_JAWS then
	return
endIf
sayFormattedMessage (OT_USER_BUFFER, MsgHotKeyHelpO365)
UserBufferAddText(cScBufferNewLine)
SayMessage(OT_USER_BUFFER, cmsgBuffexit)
EndScript

Script ScreenSensitiveHelp ()
if ! getRunningFSProducts () & product_JAWS then
	return
endIf
if IsSameScript () then
	AppFileTopic(topic_PowerPoint)
	return
EndIf
UserBufferClear ()
If UserBufferIsActive () then
 	UserBufferDeactivate ()
 	SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if IsSlideShowActive() then
	sayMessage (OT_USER_BUFFER, msgScreenSensitiveHelpPowerPointSlideShowUIA)
	sayMessage (OT_USER_BUFFER, cscBufferNewLine+cscBufferNewLine+cMsgBuffExit)
	return
endIf
EndScript

;This function isn't needed for PowerPoint, and in WDAG scenarios is costly
;because it requires getting the current cursor location which involves
;a cross-process call.
; This is a stub version that does nothing.
string function GetFrameTutorMessage(string frameName)
return cscNull
EndFunction



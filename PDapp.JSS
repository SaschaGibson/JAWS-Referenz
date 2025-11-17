; Copyright 2010-2015  by Freedom Scientific BLV Group, LLC
; PDapp script file
; Runs during the Acrobat Professional User License Agreement

include "PDapp.jsm"

void function TabKey()
if IsVirtualPCCursor() then
	TypeKey("tab")
	return
EndIf
TabKey()
EndFunction

void function ShiftTabKey ()
if IsVirtualPCCursor() then
	TypeKey("shift+tab")
	return
EndIf
ShiftTabKey()
EndFunction

Script ScriptFileName ()
ScriptAndAppNames(msgPDapp_AppName)
EndScript

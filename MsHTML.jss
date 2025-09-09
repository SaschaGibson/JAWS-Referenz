; when this dll is invoked, if Real Player 8 is not running then switch to IE scripts otherwise switch to Real Player scripts

include "common.jsm"
Include "HJConst.jsh"

Const
	; to avoid the unknown function call to SetGlobals while using Outlook today HTML page...
	FuncSetGlobals = "setglobals"

void function autoStartEvent()
if findTopLevelWindow("PNGUIClass","") then
; switch to the Real player configuration set
	switchToConfiguration("Real Player")
else
; switch to the IE configuration set
	switchToConfiguration(config_IE)
endIf
endFunction

; to avoid the unknown function call SetGlobals in Outlook Today HTML page...
void Function Unknown (string TheName, int IsScript)
If Not StringCompare (TheName, FuncSetGlobals, FALSE) then
	Return
EndIf
Unknown (TheName, IsScript)
EndFunction


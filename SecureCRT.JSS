; Copyright 2019 by Freedom Scientific, Inc.
;SecureCRT script file
;Ensures that only the contents of the terminal area are spoken through screen echo

include "HjConst.jsh"
Include "HjGlobal.jsh" ; default HJ global variables
Script ScriptFileName()
	ScriptAndAppNames("SecureCRT")
EndScript
; When ScreenEcho is set to all, NewTextEvent will speak text inside the terminal window only.
; Otherwise, nothing is spoken by NewTextEvent
int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
		int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
	if GlobalMenuMode > 0
		return TRUE
	EndIf
	; Return the inverse of the success condition  since this function is
	; suppressing rather than allowing speech.
	return !(nEcho == 2 &&
		StringStartsWith(getWindowClass(hwnd),"AfxFrameOrView") && StringLength(Buffer) > 1)
EndFunction

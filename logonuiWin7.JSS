; Copyright 1995-2017 by Freedom Scientific, Inc.
; JAWS Script for the logon screen, specifically for Windows 7
; LogonUI switches to this configuration if running under Windows 7.

include "hjConst.jsh"
include "common.jsm"
include "LogonUI.jsm"

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
;where Zoomtext and JAWS run at startup in Windows 7, username repeats constantly:
if getWindowClass (hwnd) == cwc_DirectUIhWND then return TRUE endIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
endFunction

script ScriptFileName()
ScriptAndAppNames(msgWindowsLogonAppName)
EndScript

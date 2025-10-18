; Copyright 1995-2015 Freedom Scientific, Inc.
;JAWS 11.0.xxx

include "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "AutoUpdate.jsh"
include "AutoUpdate.jsm"

void function ProcessSayAppWindowOnFocusChange(handle AppWindow, handle FocusWindow)
var
	string sAppName
if GlobalPrevApp == AppWindow
|| AppWindow == FocusWindow then
	;We will catch this change when we speak the focus window, so just return.
	return
EndIf
if GlobalWasHjDialog then
	;Do not speak the app name when exiting from an HJDialog back to the application.
	if !InHjDialog() then
		return
	else
		;due to timing issues with the JAWS Find dialog,
		;we cannot depend on the value returned by InHJDialog to tell if the dialog has cleared.
		;So, we test the previous hj dialog name:
		if GlobalPrevRealName == cwn_JAWS_Find then
			return
		EndIf
	EndIf
EndIf
If !HandleCustomAppWindows(AppWindow) then
	let sAppName = GetWindowName(AppWindow)
	if !sAppName
	|| sAppName == wn_Downloading_Dialog then
		IndicateControlType(GetWindowSubtypeCode(AppWindow),GetWindowTextEx(AppWindow,0,0),cscSpace)
	else
		SayWindowTypeAndText(AppWindow)
	EndIf
EndIf
EndFunction



int function StaticMessageInFocus()
if GetWindowSubtypeCode(GlobalFocusWindow) != wt_Static then
	return false
EndIf
if GetFirstWindow(GlobalFocusWindow) != GetLastWindow(GlobalFocusWindow) then
	return false
EndIf
return true
EndFunction

void function SayFocusedObject()
if StaticMessageInFocus() then
	;we will let NewTextEvent handle this window,
	;so that it can also pick up on any text changes to the window.
	return
EndIf
SayFocusedObject()
EndFunction

Void Function ProcessSpeechOnNewTextEvent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
if hWnd == hFocus then
	if StaticMessageInFocus() then
		Say(buffer,OT_NONHIGHLIGHTED_SCREEN_TEXT)
		return
	EndIf
EndIf
ProcessSpeechOnNewTextEvent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgAutoUpdateAppName)
EndScript

script SayLine()
if IsPCCursor()
&& !UserBufferIsActive() then
	if StaticMessageInFocus() then
		SayObjectTypeAndText()
		return
	EndIf
EndIf
PerformScript SayLine()
EndScript

script SayNextLine()
if IsPCCursor()
&& !UserBufferIsActive() then
	if StaticMessageInFocus() then
		SayObjectTypeAndText()
		return
	EndIf
EndIf
PerformScript SayNextLine()
EndScript

script SayPriorLine()
if IsPCCursor()
&& !UserBufferIsActive() then
	if StaticMessageInFocus() then
		SayObjectTypeAndText()
		return
	EndIf
EndIf
PerformScript SayPriorLine()
EndScript

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd
let hWnd = GetCurrentWindow()
if GetWindowSubtypeCode(hWnd) == wt_ReadOnlyEdit
&& (GetWindowClass(hWnd) == cwc_RichEdit20W
|| GetControlID(hWnd) == id_error_ReadOnlyEdit) then
	IndicateControlType(wt_ReadOnlyEdit,cscSpace,GetWindowTextEx(hWnd,0,0))
	return
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

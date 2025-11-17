; Copyright 1995-2015 by Freedom Scientific, Inc.
; Windows 7 logon

include "HjConst.jsh"
include "hjGlobal.jsh"
include "Common.jsm"
include "MSAAConst.jsh"

const
wn_LogonDlg = "AUTHUI.DLL: LogonUI Logon Window"

void function ProcessSayAppWindowOnFocusChange (handle AppWindow, handle FocusWindow)
var
	string sText
if GlobalPrevApp != AppWindow
&& AppWindow != FocusWindow
&& !GlobalWasHjDialog then
	if GetWindowClass(AppWindow) == wn_LogonDlg then
		sText = GetWindowName(AppWindow)
		if sText then
			; Windows Logon
			IndicateControlType(wt_dialog,sText,cmsgSilent)
		EndIf
		return
	EndIf
EndIf
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
EndFunction

Void Function fixLogonFocus (handle hwnd)
var
   variant v,
	object null,
	int iChildID,
	int iTemp
let v = null
let v = GetObjectFromEvent (hWnd, OBJID_CLIENT, iChildID, iTemp)
if v then
	let v = v.accChild(1)
Endif
if v && v == 0 ; we have an object and not a child id
	v.accSelect(selflag_takefocus,ChildID_Self)
Endif
EndFunction

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName, handle FocusWindow)
if GetWindowClass(focusWindow) == cwc_DirectUIhWND
&& !GetNextWindow(focusWindow)
&& !GetPriorWindow(focusWindow) then
	if !GetObjectSubtypeCode() then
		fixLogonFocus(focusWindow)
	Endif
Endif
if GetWindowClass(GetParent(FocusWindow)) == wn_LogonDlg then
	SayObjectTypeAndText()
	return
EndIf
ProcessSayFocusWindowOnFocusChange(RealWindowName,FocusWindow)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if nLevel == 1
	if GetObjectSubtypeCode(0) == WT_PASSWORDEDIT
	&& GetObjectName(SOURCE_CACHED_DATA,1) == GetObjectName(SOURCE_CACHED_DATA,0)
		;reduce redundant speech:
		return
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

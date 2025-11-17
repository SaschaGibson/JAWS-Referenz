; Copyright 1995-2015 Freedom Scientific, Inc. 
;JAWS Script file for the WinAmp library

include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "winamp.jsh"
include "winamp.jsm"
use "internet explorer.jsb"
use "WinAmp.jsb"

Globals
  Int GlobalLineNumber,
  String GlobalWindowContents
	
Script ScriptFileName ()
ScriptAndAppNames (MsgWinAmpLibrary)
EndScript

Script NextLibraryWindow ()
Var
	handle hWnd,
	handle hTemp,
	int iTypeCode,
	string sClass
	If !IsWinampLibrary  () Then
	return
EndIf
let hWnd = GetFocus ()
let iTypeCode = GetWindowSubTypeCode (hWnd)
let sClass = GetWindowClass (hWnd)
If iTypeCode == WT_TREEVIEW Then
	let hTemp = GetNextWindow (GetFirstChild (GetNextWindow (hWnd)))
	If GetWindowSubTypeCode (hTemp) == WT_STATIC Then
		let  hTemp = GetFirstChild (GetNextWindow (hWnd))
	EndIf
	If hTemp Then
		SetFocus (hTemp)
		return
	EndIf
ElIf iTypeCode == WT_BUTTON
|| iTypeCode == WT_LISTVIEW Then
; look for the IE server window first as it may be present
	let hTemp = FindWindow (FindTopLevelWindow (WinampLI , wn_Library ), cwcIEServer)
	If !hTemp Then
	; since the IE server window was not found, 
	; get the handle of the tree view instead
let hTemp = FindWindow (FindTopLevelWindow (WinampLI , wn_Library ), cwc_SysTreeView32)
	EndIf
	If hTemp Then
		SetFocus (hTemp)
		return
	EndIf
ElIf sClass == cwcIEServer  Then
	let hTemp = FindWindow (FindTopLevelWindow (WinampLI , wn_Library ), cwc_SysTreeView32)
	If hTemp Then
		SetFocus (hTemp)
		return
	EndIf
EndIf
EndScript

Int Function FocusRedirected (handle hFocus)
Var
	handle hTemp
If IsWinAmpLibrary () Then
	If GetWindowClass (hFocus) == WinampLI  Then
		let hTemp = FindDescendantWindow (hFocus, 1003)
		If hTemp Then
			SetFocus (hTemp)
			return TRUE
		EndIf
	EndIf
EndIf
return FALSE
EndFunction

Void Function ProcessSayAppWindowOnFocusChange(handle AppWindow, handle FocusWindow)
var
	handle TopLevelWindow
let TopLevelWindow = GetTopLevelWindow(FocusWindow)
if TopLevelWindow != GlobalWinAmpPrevTopLevelWindow then
	let GlobalWinAmpPrevTopLevelWindow = TopLevelWindow
If !IsWinAmpLibrary () then
	SwitchToConfiguration (Config_WinAmp)
	EndIf
	return
EndIf
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
	If FocusRedirected (FocusWindow) Then
		return
	EndIf
	if ReturningFromResearchItDialog () then
		return default::FocusChangedEvent (FocusWindow, PrevWindow)
	endIf
  If GetWindowClass (FocusWindow) == "Internet Explorer_Server" && GetWindowClass (GetCurrentWindow ()) == "Internet Explorer_Server" then
    let GlobalWindowContents = GetTextInWindow (FocusWindow)
    let GlobalLineNumber = 1
    Say (StringSegment (GlobalWindowContents, "\n", 1), OT_SCREEN_MESSAGE)
    Return
  EndIf
	FocusChangedEvent (FocusWindow, PrevWindow)
EndFunction

void function SayLineUnit(int unitMovement, int bMoved)
  If GetWindowClass (GetFocus ()) == "Internet Explorer_Server" then
    let GlobalWindowContents = GetTextInWindow (GetFocus ())
    If unitMovement == UnitMove_Next then
      let GlobalLineNumber = GlobalLineNumber + 1
      If GlobalLineNumber > StringSegmentCount (GlobalWindowContents, "\n") then
        let GlobalLineNumber = StringSegmentCount (GlobalWindowContents, "\n")
      EndIf
    ElIf unitMovement == UnitMove_Prior then
      let GlobalLineNumber = GlobalLineNumber - 1
      If GlobalLineNumber < 1 then
        let GlobalLineNumber = 1
      EndIf
    EndIf
    Say (StringSegment (GlobalWindowContents, "\n", GlobalLineNumber	), OT_SCREEN_MESSAGE)
    Return
  EndIf
  SayLineUnit(unitMovement, bMoved)
EndFunction

; to suppress the wrong firing of the unsupported virtual cursor
Void Function DocumentLoadedEvent ()
Delay (1)
EndFunction

Script Space ()
  SayCurrentScriptKeyLabel ()
  TypeCurrentScriptKey ()
EndScript

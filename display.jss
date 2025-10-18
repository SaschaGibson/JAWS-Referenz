;Display Applet for Control Panel,
;Or right-click from desktop

Include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "display.jsm"

Script ScriptFileName ()
ScriptAndAppNames (msgDisplay)
EndScript

Int Function IsScreenAreaGroupBox (handle hwnd)
var
	string sGroupBoxName
let sGroupBoxName = GetGroupBoxName ()
If sGroupBoxName == sc_ScreenArea then
	return true
Else
	return false
EndIf
EndFunction

int Function IsScreenResolutionGroupBox (handle hwnd)
var
	string sGroupBoxName
let sGroupBoxName = GetGroupBoxName ()
If sGroupBoxName == sc_ScreenResolution then
	return true
Else
	return false
EndIf
EndFunction

string function GetResInfo ()
var
	handle hwnd
let hwnd = GetFocus ()
;Window Xp or earlier:
If IsScreenAreaGroupBox(hwnd)
|| IsScreenResolutionGroupBox (hwnd) then
	While GetWindowSubtypeCode (GetNextWindow (hwnd)) == wt_Static
		let hwnd = GetNextWindow (hwnd)
	EndWhile
	return GetWindowText (hwnd, false)
;Windows Vista:
ElIf GetWindowName(GetPriorWindow(hWnd)) == wn_Resolution_Vista then
	While GetWindowSubtypeCode (GetNextWindow (GetNextWindow(hwnd))) == wt_Static
		let hwnd = GetNextWindow (hwnd)
	EndWhile
	return GetWindowText (hwnd, false)
EndIf
return cScNull
EndFunction

void function SayWindowTypeAndText (handle hWnd)
SayWindowTypeAndText (hWnd)
SayMessage (ot_control_name, GetResInfo ())
EndFunction

void function SayWord ()
SayWord ()
SayMessage (ot_control_name, GetResInfo ())
EndFunction

script SayLine ()
If IsSameScript () then
	SpellLine ()
	Return
EndIf
if SaySoundDeviceListItem()
	return
endIf
PerformScript SayLine ()
SayMessage (ot_control_name, GetResInfo ())
EndScript

Void Function SayFocusedWindow ()
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
if MenusActive () then
	return
endIf
;SayWindowTypeAndText (GlobalFocusWindow) No longer needed here
SayFocusedObject ()
SayMessage (ot_control_name, GetResInfo ())
EndFunction

int function SaySoundDeviceListItem()
if GetObjectName(SOURCE_CACHED_DATA, 3) != WN_Sound_Dialog
|| GetObjectSubTypeCode(SOURCE_CACHED_DATA, 1) != WT_LISTVIEW
	return false
endIf
IndicateControlType (WT_LISTVIEWITEM, GetObjectName(SOURCE_CACHED_DATA), cmsgSilent)
Say(PositionInGroup (), OT_Position)
return true
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
if nLevel == 0
&& SaySoundDeviceListItem()
	return
endIf
SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
EndFunction

Void Function SayObjectActiveItemWithDescription (optional int AnnouncePosition)
if SaySoundDeviceListItem()
	return
endIf
SayObjectActiveItemWithDescription (announcePosition)
EndFunction

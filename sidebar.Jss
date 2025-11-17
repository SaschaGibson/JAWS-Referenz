;sidebar.jss, WinVista, ! modify global;

include"hjconst.jsh";
include"common.jsm";

GLOBALS
	int gbSideBarCheck

void Function AutoStartEvent ()
Let gbSideBarCheck = TRUE;
EndFunction

int function BrailleCallbackObjectIdentify()
var
	handle hWnd
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
Let hWnd = GetFocus ()
If ! GetObjectSubtypeCode (TRUE) &&
GetWindowClass (hWnd) == cwcSidebarChild then
	Return WT_BUTTON;
EndIf
Return BrailleCallbackObjectIdentify()
EndFunction

int Function BrailleAddObjectName (int nSubtype)
var
	handle hWnd
if IsTouchCursor() then
	Return BrailleAddObjectName (nSubtype)
endIf
If ! (nSubtype == WT_BUTTON) then
	Return BrailleAddObjectName (nSubtype)
EndIf
Let hWnd = GetFocus ()
If ! GetObjectSubtypeCode (TRUE) &&
GetWindowClass (hWnd) == cwcSidebarChild then
	Return BrailleAddString (cmsgGadgetsGallery,0,0,0)
EndIf
Return BrailleAddObjectName (nSubtype)
EndFunction

int Function HandleCustomWindows (handle hWnd)
If ! GetObjectSubtypeCode (TRUE) &&
GetWindowClass (hWnd) == cwcSidebarChild then
	IndicateControlType (WT_BUTTON, cmsgGadgetsGallery)
	Return TRUE
EndIf
Return HandleCustomWindows (hWnd)
EndFunction

Script VistaWindowsSidebarActivate ()
If ! IsWinVista () then
	TypeCurrentScriptKey ()
	SayCurrentScriptKeyLabel ()
	Return Null()
EndIf
SayFormattedMessage (OT_ERROR, cmsgSidebarActive)
EndScript

Script ScreenSensitiveHelp ()
var
	handle hWnd,
	string sClass
Let hWnd = GetCurrentWindow ()
If GetObjectSubtypeCode (TRUE) then
	PerformScript ScreenSensitiveHelp ()
	Return;
EndIf
Let sClass = GetWindowClass (hWnd)
If sClass == cwcSidebarChild then
	ShowScreenSensitiveHelp (cmScreenSensitiveHelp_SidebarGallery)
	Return Null()
ElIf sClass == cwcSidebarGadgetMain then
	ShowScreenSensitiveHelp (cmScreenSensitiveHelp_SidebarGadget)
	Return Null()
Else
	PerformScript ScreenSensitiveHelp ()
EndIf
EndScript

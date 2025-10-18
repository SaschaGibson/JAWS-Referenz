;Script files for msconfig
; Copyright 2010-2021 by Freedom Scientific, Inc.
;version 4.01.00

Include "hjconst.jsh"
Include "hjglobal.jsh"
Include "msconfig.jsh"
Include "msconfig.jsm"

Globals
	int MSConfigFirstTime,
	int nSuppressEcho,
	string g_strGraphicsList,
	string g_strGraphicsListX,
	string g_strGraphicsListY

int function HandleCustomWindows (handle hwnd)
var
	int iControl
Let iControl = GetControlID (hwnd)
EndFunction

int function HandleCustomRealWindows (handle hwnd)
var
	string sRealName
Let sRealName = GetWindowName (GetRealWindow (hwnd))
EndFunction

Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
If (nSuppressEcho == on) then
	return
EndIf
let RealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
if (GlobalPrevApp != AppWindow && AppWindow != FocusWindow) then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
	SayWindowTypeAndText (AppWindow)
endif
If ((GlobalPrevRealName != RealWindowName) ; name has changed
	|| (GlobalPrevReal != RealWindow)) then ; or handle has changed, then
	If ((RealWindow != AppWindow) && (RealWindow != FocusWindow)) then
		If (HandleCustomRealWindows (RealWindow) == 0) then
			SayWindowTypeAndText (RealWindow)
		EndIf
	endif
EndIf
let GlobalFocusWindow = FocusWindow
if (GlobalPrevFocus != focusWindow) then
	If (HandleCustomWindows (FocusWindow) == 0) then
		SayFocusedWindow () ; will use global variable GlobalFocusWindow
	EndIf
else
	SayFocusedObject ()
EndIf
;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

void function AutoStartEvent ()
If (MSConfigFirstTime == 0) then
	Let MSConfigFirstTime = 1
EndIf
EndFunction

Script  ScriptFileName()
ScriptAndAppNames("MSConfig")
EndScript

Script ScreenSensitiveHelp ()
If (IsSameScript ()) then
	AppFileTopic (0)
	return
EndIf
PerformScript ScreenSensitiveHelp ()
EndScript

Script HotKeyHelp ()
PerformScript HotKeyHelp()
EndScript

Script SayWindowPromptAndText ()
var
	handle hwnd,
	int iSubType,
	int nMode
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
If (HandleCustomWindows (hwnd) == 0) then
	smmToggleTrainingMode(nMode)
	PerformScript SayWindowPromptAndText ()
Else
	SayTutorialHelp (iSubType, TRUE)
	SayTutorialHelpHotKey (hWnd, TRUE)
	IndicateComputerBraille (hwnd)
	smmToggleTrainingMode(nMode)
EndIf
EndScript

Script ToolbarList ()
var
	int nIncludeGraphics,
	int nIndex,
int nRowToClick,
int nColToClick
If (DialogActive ()) then
	SayMessage(ot_error, msgToolbarListError1_l) ; "You must exit the current dialog in order to access the toolbar"
	return
EndIf
let nIncludeGraphics = GetJcfOption(OPT_INCLUDE_GRAPHICS)
SetJcfOption (OPT_INCLUDE_GRAPHICS, 1) ; labeld graphics only
let g_strGraphicsList = ""
let g_strGraphicsListX = ""
let g_strGraphicsListY = ""
GraphicsEnumerate(GetAppMainWindow(GetFocus()),"GraphicsListHelper")
SetJcfOption (OPT_INCLUDE_GRAPHICS, nIncludeGraphics)
if  !(g_strGraphicsList) then
	SayMessage (ot_error, msgToolbarListError2_l) ; "Toolbar not found"
	return
EndIf
let g_strGraphicsListX = StringChopLeft (g_strGraphicsListX, 1)
let g_strGraphicsListy = StringChopLeft (g_strGraphicsListy, 1)
let nIndex = DlgSelectItemInList (g_strGraphicsList,msgListName, true)
If (nIndex != 0) then
	Let nSuppressEcho = on
	let nRowToClick =
	StringToInt(StringSegment(g_strGraphicsListX,"\007",nIndex))
	let nColToClick =
	StringToInt(StringSegment(g_strGraphicsListY,"\007",nIndex))
	SaveCursor()
	JAWSCursor()
	MoveTo(nColToClick,nRowToClick)
	LeftMouseButton()
	RestoreCursor ()
	Let nSuppressEcho = off
EndIf
EndScript

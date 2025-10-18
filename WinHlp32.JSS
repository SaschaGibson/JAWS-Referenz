; Script file for Windows Help
;Copyright 2001-2021 by Freedom Scientific BLV Group, LLC
;version 6.00.
;
;****************************************
;*	        Written By		*
;*	Freedom Scientific Scripting	*
;*		Team Gold		*
;****************************************
;build 600165 last modified on October 27, 2004 by Olga Espinola

include "winhlp32.jsm"
Include "hjconst.jsh"
Include "hjglobal.jsh"
include "common.jsm"

globals
	handle GlobalWinHlp32Handle,
	int IgnoreNewText,
int bSpokeFromFocus		,
;For carry-over from Calculator:
int nSuppressEcho


Void Function MenuModeEvent (handle WinHandle, int Mode)
If nSuppressEcho then
	Return
EndIf
Return MenuModeEvent (WinHandle, Mode)
EndFunction

Function AutoStartEvent ()
if (ToggleRestriction ()) then
	ToggleRestriction () ; turn restriction off
endif
EndFunction

Function AutoFinishEvent ()
PCCursor ()
EndFunction

Void Function SayNonHighlightedText (handle hwnd, string buffer)
var
	string TheClass,
	handle rWin,
	string rWinClass,
	string rWinName
If nSuppressEcho then
	Return
EndIf
if (hwnd==globalFocusWindow && bSpokeFromFocus) then
	let bSpokeFromFocus=FALSE;
	return
endIf
If (IgnoreNewText) then
	return
Endif
let TheClass = GetWindowClass(hwnd)
let rWin  = GetRealWindow (GetFocus())
let rWinClass = GetWindowClass (rWin)
let rWinName = GetWindowName (rWin)
If (rWinClass == wcDialog) then
	return
EndIf
;wc1="MS_WINTOPIC"
if ((TheClass==wc1) ||
;wc2="MS_WINNOTE"
;(TheClass == wc2) ||
;wc3="MS_WINNSR"
(TheClass == wc3) ||
;wc4="MS_WINSR"
(TheClass == wc4)  ||
;wc5="#32771"
TheClass == wc5) then
	Say (buffer, OT_BUFFER)
	let GlobalWinHlp32Handle = hwnd
	return
endif
;wc6="Static"
If (TheClass == wc6) then
;wn7="Find Setup Wizard"
	If (rWinName == wn7) then
		Say (buffer, OT_BUFFER)
		return
	EndIf
EndIf ;Class is static
EndFunction

Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
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
;	SayWindowTypeAndText (RealWindow)
	endif
EndIf
let GlobalFocusWindow = FocusWindow
if (GlobalPrevFocus != focusWindow) then
	SayFocusedWindow () ; will use global variable GlobalFocusWindow
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

Void Function SayFocusedWindow ()
Var
	Handle rWin, String rWinClass,
	String cwClass,
	Handle curWin, Handle hTarget
let rWin  = GetRealWindow (GetFocus ())
let rWinClass = GetWindowClass (rWin)
If (rWinClass == wcDialog)	Then
	let curWin = GetCurrentWindow ()
	let cwClass = GetWindowClass (curWin)
	If (cwClass == wc9) Then
		let hTarget = GetPriorWindow (curWin)
		;SayWindow (hTarget, READ_EVERYTHING)  no longer needed
		SayWindowTypeandText (GlobalFocusWindow)
		Return
	EndIf
EndIf
;wc13="SysTabControl32"
If ((GetWindowClass (GlobalPrevFocus) == wc13) &&
;wc9="SysTreeView32"
(GetWindowClass (GlobalFocusWindow) == wc9)) then
	SaveCursor ()
	InvisibleCursor()
	MoveToWindow (GetPriorWindow(GlobalFocusWindow))
	SayChunk()
EndIf
If (GetControlID (GlobalFocusWindow) == 1001) then
	SayFormattedMessage (OT_MESSAGE, msg1_L) ;"Type the word or phrase you want to find"
	SayFormattedMessage (OT_MESSAGE, msg2_L) ;"edit"
	return
EndIf
If (GetControlID (GlobalFocusWindow) == 6001) then
	SayFormattedMessage (OT_MESSAGE, msg3_L) ;"Select some matching words to narrow your search"
	SayFormattedMessage (OT_MESSAGE, msg4_L) ;"text viewer"
	return
EndIf
If (GetControlID (GlobalFocusWindow) == 6007) then
	SayFormattedMessage (OT_MESSAGE, msg5_L) ;"Select a topic, and then select the display button"
	SayFormattedMessage (OT_MESSAGE, msg4_L) ;"text viewer"
	return
EndIf
	SayWindowTypeandText (GlobalFocusWindow)
let bSpokeFromFocus=TRUE
EndFunction

Script  ScriptFileName()
ScriptAndAppNames (msgScriptKeyHelp1)
EndScript

Script ScreenSensitiveHelp ()
var
	String TheClass
let TheClass = GetWindowClass (GetCurrentWindow ())
;wc2="ms_winnote"
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if (TheClass == wc2) then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp1_L, msgScreenSensitiveHelp1_S)
	AddHotKeyLinks ()
	return
endif
;wc1="ms_wintopic"
if (TheClass == wc1) then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp2_L, msgScreenSensitiveHelp2_S)
	AddHotKeyLinks ()
	return
endif
;wc3="ms_winnsr"
if (TheClass == wc3) then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp3_L, msgScreenSensitiveHelp3_S)
	AddHotKeyLinks ()
	return
endif
;wc12="ms_winhelp"
if (TheClass == wc12) then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp4_L, msgScreenSensitiveHelp4_S)
	AddHotKeyLinks ()
	return
endif
PerformScript ScreenSensitiveHelp ()
EndScript

Script HotKeyHelp()
var
	string WindowName,
	int TheTypeCode,
	string TheClass
if TouchNavigationHotKeys() then
	return
endIf
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
let WindowName= GetWindowName (GetRealWindow (GetFocus ()))
let TheTypeCode = GetWindowTypeCode (GetCurrentWindow())
let TheClass = GetWindowClass (GetCurrentWindow ())
if  (TheTypeCode == wt_unknown) then
	If UserBufferIsActive () then
		UserBufferDeactivate ()
	EndIf
;wc2="ms_winnote"
	if (TheClass == wc2) then
		SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp1_L, msgHotKeyHelp1_S)
		return
	endif
;wc1="ms_wintopic"
;wc12="ms_winhelp"
	if (TheClass == wc12 || TheClass == wc1) then
		SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp2_L, msgHotKeyHelp2_S)
		return
	endif
EndIf
If (GetWindowTypeCode (GetRealWindow (GetFocus ())) == wt_dialog) then
;wn13="Search"
	If (WindowName == wn13) then
		If UserBufferIsActive () then
			UserBufferDeactivate ()
		EndIf
		SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp3_L, msgHotKeyHelp3_S)
		Return
	EndIf
Else
	PerformScript HotKeyHelp()
endif
EndScript

Script SayTopicsFound ()
SaveCursor()
;fs1="Topics Found"
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
If FindString (GetFocus(), fs1, S_BOTTOM, S_UNRESTRICTED) then
	SayLine()
EndIf
RestoreCursor()
EndScript

Void Function SayHighlightedText (handle hwnd, string buffer)
If nSuppressEcho then
	Return
EndIf
if((GetScreenEcho() > 0) && (GetControlID (hwnd) != 6001) && (GetControlID (hwnd) != 6007)) Then
	Say (buffer, OT_BUFFER)
	Return
EndIf
if ((GetControlID (GetCurrentWindow ()) == 6001) && (GetControlID (hwnd) == 6001)) then
	Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
	return
endif
if ((GetControlID (GetCurrentWindow ()) == 6007) && (GetControlID (hwnd) == 6007)) then
	Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
endif
EndFunction

Script SayHelpWindow ()
If IsVirtualPCCursor() then
	PerformScript StartSkimRead()
	return
EndIf
if ! (getRunningFSProducts () & product_JAWS) then
	invisibleCursor ()
else
	JAWSCursor()
endIf
if (GlobalWinHlp32Handle > 0) then
	MoveToWindow (GlobalWinHlp32Handle)
	SayAll()
endif
EndScript

Script  SayPriorScreen ()
If DialogActive() then
	PerformScript PreviousDocumentWindowByPage ()
	Return;
EndIf
let IgnoreNewText = TRUE
TypeKey(ks1) ; tell help to do page up
Pause()
let IgnoreNewText = FALSE
if ! (getRunningFSProducts () & product_JAWS) then
	invisibleCursor ()
else
	JAWSCursor()
endIf
if (GlobalWinHlp32Handle > 0) then
	MoveToWindow (GlobalWinHlp32Handle)
	SayAll()
endif
EndScript

Script  SayNextScreen()
If DialogActive() then
	PerformScript NextDocumentWindowByPage ()
	Return;
EndIf
let IgnoreNewText = TRUE
TypeKey(ks2) ; tell help to do page down
Pause()
let IgnoreNewText = FALSE
if ! (getRunningFSProducts () & product_JAWS) then
	invisibleCursor ()
else
	JAWSCursor()
endIf
if (GlobalWinHlp32Handle	> 0) then
	MoveToWindow (GlobalWinHlp32Handle)
	SayAll()
endif
EndScript

Script NextControl ()
TypeKey(ks5)
pause()
if ((GetCharacterAttributes () & ATTRIB_GRAPHIC) == ATTRIB_GRAPHIC ) then
	SayChunk()
endif
EndScript

Script PriorControl ()
TypeKey(ks6)
pause()
if ((GetCharacterAttributes () & ATTRIB_GRAPHIC) == ATTRIB_GRAPHIC ) then
	SayChunk()
endif
EndScript

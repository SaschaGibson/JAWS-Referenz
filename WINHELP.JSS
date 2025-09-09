
;JAWS 7.10.xx;Copyright 1997-2015 by Freedom Scientific BLV Group, LLC
; source and accompanying files for Windows Help
; 16-bit version
; Windows 3.1/3.11 only
; replaced in Windows 9X/NT by winhlp32
; This script file was converted from macro source inn 1997, string/header library cleanup in 1999

Include "Winhelp.jsh"
include "winhlp32.jsm"
include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"

Function AutoStartEvent()
if (ToggleRestriction()) then
ToggleRestriction () ; turn restriction off
endif
EndFunction

void Function SayNonHighlightedText(int hwnd,string buffer)
; text event macro for speaking all newly written non-highlighted
; text.
; Currently it only speaks text being written to the help window.
; it is passed two parameters, the handle of the window where the text
; has been written, and a buffer containing the text.
var
string TheClass,
string TheRealName

let TheClass = GetWindowClass(hwnd)
let TheRealName = GetWindowName (GetRealWindow (GetFocus()))

;wc1="MS_WINTOPIC"
if ((TheClass==wc1) ||
;wc2="MS_WINNOTE"
(TheClass == wc2) ||
;wc3="MS_WINNSR"
(TheClass == wc3) ||
;wn4="MS_WINSR"
(TheClass == wc4)  ||
;wc5="#32771"
TheClass == wc5) then
Say(buffer, OT_NONHIGHLIGHTED_SCREEN_TEXT)
let GlobalWinHlp32Handle	= hwnd
return
endif
;wc6="Static"
If (TheClass == wc6) then
;wn7="Find Setup Wizard"
	If (TheRealName == wn7) then
		Say(buffer, OT_NONHIGHLIGHTED_SCREEN_TEXT)
		return
	EndIf
EndIf ;Class is static
EndFunction

Function SayFocusedWindow()
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
	;SayFormattedMessage (ot_control_name, msg1_L) ;"Type the word or phrase you want to find"
	;SayFormattedMessage (ot_control_type, msg2_L) ;"edit"
	IndicateControlType (WT_EDIT, msg1_L);"Type the word or phrase you want to find"
	return
EndIf
If (GetControlID (GlobalFocusWindow) == 6001) then
	SayFormattedMessage (ot_control_name, msg3_L) ;"Select some matching words to narrow your search"
	SayFormattedMessage (ot_control_type, msg4_L) ;"text viewer"
	return
EndIf
If (GetControlID (GlobalFocusWindow) == 6007) then
	SayFormattedMessage (ot_JAWS_message, msg5_L) ;"Select a topic, and then select the display button"
	SayFormattedMessage (ot_control_type, msg4_L) ;"text viewer"
	return
EndIf
SayWindowTypeandText (GlobalFocusWindow)
EndFunction

Script ScriptFileName(); {Insert+Q}
ScriptAndAppNames (msgScriptKeyHelp1)
EndScript

Script ScreenSensitiveHelp()
var
	String TheClass
let TheClass = GetWindowClass (GetCurrentWindow ())
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
;wc2 ="ms_winnote"
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
let WindowName= GetWindowName (GetRealWindow (GetFocus ()))
let TheTypeCode = GetWindowTypeCode (GetCurrentWindow())
let TheClass = GetWindowClass (GetCurrentWindow ())
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if  (TheTypeCode == wt_unknown) then
;wc2="ms_winnote"
	if (TheClass == wc2) then
	SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp1_L, msgHotKeyHelp1_S)
		return
	endif
;wc1="ms_wintopic"
	if (TheClass == wc1 || TheClass == wc12) then
	SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp2_L, msgHotKeyHelp2_S)
		return
	endif
EndIf
If (GetWindowTypeCode (GetRealWindow (GetFocus ())) == wt_dialog) then
;wn13="Search"
	If (WindowName == wn13) then
	SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp3_L, msgHotKeyHelp3_S)
		Return
	EndIf
	return
endif
PerformScript HotKeyHelp ()
EndScript

Function SayHighlightedText(int hwnd,string buffer)
; HighlightedText event macro for speaking all newly written highlighted
; text.
if((GetScreenEcho() > 0) && (GetControlID (hwnd) != 6001) && (GetControlID (hwnd) != 6007)) Then
	Say(buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
	Return
EndIf
if ((GetControlID (GetCurrentWindow ()) == 6001) && (GetControlID (hwnd) == 6001)) then
	Say(buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
	return
endif
if ((GetControlID (GetCurrentWindow ()) == 6007) && (GetControlID (hwnd) == 6007)) then
	Say(buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
endif
EndFunction

Script SayHelpWindow ()
	JAWSCursor()
	if (GlobalWinHlp32Handle	> 0) then
		MoveToWindow (GlobalWinHlp32Handle)
		SayAll()
	endif
EndScript

Script SayPriorScreen ()
                        ;display and read prior screen, even when J cursor on
TypeKey (ks1) ; tell help to do page up
	JAWSCursor()
	if (GlobalWinHlp32Handle	> 0) then
		MoveToWindow (GlobalWinHlp32Handle)
		SayAll()
	endif
EndScript

Script SayNextScreen ()
;display and read next screen, even when J cursor on
If DialogActive() then
	PerformScript NextDocumentWindowByPage ()
	Return;
EndIf
TypeKey (ks2) ; tell help to do page down
JAWSCursor()
if (GlobalWinHlp32Handle	> 0) then
	MoveToWindow (GlobalWinHlp32Handle)
	SayAll()
endif
EndScript

Script WindowKeysHelp()
;wn14="JAWS help system"
if (GetWindowName (GetRealWindow (GetCurrentWindow())) == wn14) then
	If UserBufferIsActive () then
		UserBufferDeactivate ()
	EndIf
SayFormattedMessage (ot_USER_BUFFER, msgWindowKeysHelp1_L, msgWindowKeysHelp1_S)
UserBufferAddText(cscBufferNewline+cmsgBuffExit)
	return
endif
WindowKeysHelpDefault()
EndScript

Script TurnOnPCCursorOnEscape ()
 ;make sure that the pc cursor is turned on before leaving help
PCCursor()
SayFormattedMessage (ot_message, msg6_L) ;"escape"
TypeKey (ks3)
EndScript

Script TurnOnPCCursorOnF4 ()
 ;make sure that the pc cursor is turned on before leaving help
PCCursor()
SayFormattedMessage (ot_message, msg7_L) ;"alt plus f4"
TypeKey (ks4)
EndScript

Script NextControl ()
TypeKey (ks5)
pause()
if ((GetCharacterAttributes () & ATTRIB_GRAPHIC) == ATTRIB_GRAPHIC ) then
	SayChunk()
endif
EndScript

Script PriorControl ()
TypeKey (ks6)
pause()
if ((GetCharacterAttributes () & ATTRIB_GRAPHIC) == ATTRIB_GRAPHIC ) then
	SayChunk()
endif
EndScript


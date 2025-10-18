;JAWS 8.x Script Manager Scripts
; Copyright 2010-2023, Freedom Scientific, Inc.

include "hjconst.jsh"
include "HJGlobal.jsh"
Include "jscript.jsm"
Include "common.jsm"

use "Notepad++.jsb"

const
;Control ID's:
	cidInsertFunctionDescription = 6037 ,
	cidParameterDescription = 6060,
	cIDFunctionNameList = 6022,
	Back = 0,
	Forward = 1,
;Following are not translated, keystrokes within Script Manager and
;not language-specific.
	ksNextScript = "F2",
	ksPriorScript = "Shift+F2",
	ksJumpToDefinition = "f12"

Globals
;for determining if the function name in the list has changed:
	string gsPrevFunctionName,
;for determining when the function description text changes:
	string gsPrevFunctionDescription,
;for scheduling speaking of the Insert Function description:
	int giScheduledSpeakInsertFunctionDescription,
	int WatchForScriptOrFunctionChange ; f2 and shift+f2 scripts, can use in any other function or script where we want to speak by line after movement.


void function AutoStartEvent ()
WatchForScriptOrFunctionChange =  OFF
endFunction

void function AutoFinishEvent ()
WatchForScriptOrFunctionChange = OFF
endFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
;overwrite this function to silence new text
var
	int iSubtype,
	string sClass
if (UsingEnhancedEditSupport(hWnd) || IsVirtualPcCursor ()) then
	; determine if selected text is coming from action of selecting
	; selection is handled internally but other highlights are not!
	if GetTickCount() -nLastSelectUnitTime < 750
	;SelectEntireDocument fails the timer test,
	;and it will fire once per each line that was selected:
	;|| !DialogActive() then ; need to allow this in multiline documents for actions such as Select Script command
		return true ; handled by internal code which calls TextSelectedEvent
	else ; for SelectScript and similar commands:
	; excluding SelectAll command which already has functionality included to speak text and char count:
		Return (GetScriptAssignedTo (GetCurrentScriptKeyName()) == "SelectAll")
		endIf
endIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

Script  ScriptFileName()
ScriptAndAppNames(msgScriptManagerAppName)
EndScript

void function ScheduledSpeakInsertFunctionDescription()
var
	string sDescription
let giScheduledSpeakInsertFunctionDescription = 0
let sDescription = GetWindowTextEx(FindDescendantWindow(GetParent(GetFocus()),cidInsertFunctionDescription),0,0)
;only spweak the description if it has changed:
if StringCompare(gsPrevFunctionDescription,sDescription) != 0 then
	Say(sDescription,ot_line)
EndIf
let gsPrevFunctionDescription =  sDescription
EndFunction

Void Function SayNonHighlightedText (handle hwnd, string Buffer)
var
	string sRealName
let sRealName = GetWindowName(GetRealWindow (GetFocus()))
if StringContains(sRealName,wn_InsertFunction) then
	if GetControlID(hwnd) == cidInsertFunctionDescription then
		;we want to announce the description only if it changes.
		;because the description text is received by SayNonHighlightedText one line at a time,
		;we wait until the description is finished writing then determine if the description ahs changed.
		;we unschedule and reschedule the delayed speaking function as long as the description text is being updated.
		if giScheduledSpeakInsertFunctionDescription then
			UnscheduleFunction(giScheduledSpeakInsertFunctionDescription)
		EndIf
		let giScheduledSpeakInsertFunctionDescription = ScheduleFunction("ScheduledSpeakInsertFunctionDescription",5)
		return
	endif
endif
if StringContains(sRealName,wn_ScriptInformation) 
|| StringContains(sRealName,wn_AssignToHotkey) then
	if GetControlID(hwnd) == cidParameterDescription then
		Say(Buffer, ot_buffer)
		return
	endif
endif
SayNonHighlightedText(hwnd, Buffer)
EndFunction

void Function SayHighLightedText (handle hwnd, string buffer)
if (hWnd == getFocus () && getWindowSubtypeCode (hwnd) == WT_EDITCOMBO) then
	; keep edit combos such as Category from double-speaking.
	Return
endIf
If GlobalMenuMode > 1
&& IsMSAAWindow(hWnd) then
	If hWnd != GetCurrentWindow() then
		Return;Let ActiveItemChangedEvent do its job.
	EndIf
EndIf
if GetScreenEcho() then
	if GetControlID(hWnd) == cIDFunctionNameList then
		;only announce the function name if it has changed:
		if StringCompare(buffer,gsPrevFunctionName) != 0 then
			Say(buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
			let gsPrevFunctionName = buffer
		EndIf
		return
	EndIf
	;Say(buffer, OT_HIGHLIGHTED_SCREEN_TEXT) ; May cause double-speaking, call default:
endIf
return SayhighlightedText (hwnd, buffer)
EndFunction

int Function HandleCustomWindows (handle hWnd)
var
	int nSubType,
	string sRealName
If ! DialogActive () ||
InHjDialog () ||
MenusActive () then
	Return HandleCustomWindows (hWnd)
EndIf
Let nSubtype = GetWindowSubtypeCode (hWnd)
Let sRealName = GetWindowName (GetRealWindow (hWnd))
If (! sRealName) then
	If (nSubtype == WT_STATIC ||
	nSubtype == WT_DIALOG) then;Neither of these on focus should speak
		;SayWindowTypeAndText on the real window (HandleCustomRealWindows) already handles this appropriately.
		Return TRUE;Do nothing.
	EndIf
EndIf
Return HandleCustomWindows (hWnd)
EndFunction

void Function SayFocusedWindow ()
var
	handle hWnd,
	string sRealName
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
let hWnd = GetFocus()
let sRealName = GetWindowName(GetRealWindow(hWnd))
let gsPrevFunctionDescription = cscNull
if sRealName == wn_ScriptInformation
|| sRealName == wn_NewScript then
	if GetControlID(hWnd) == cidInsertFunctionDescription then
		SayMessage (ot_control_name, msgAssignToHotKey_L,msgAssignToHotKey_S)
		return
	endif
endif
SayFocusedWindow ()
EndFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if WatchForScriptOrFunctionChange then
; this is from the last run, not the current one.
;Prevents user from hearing whole line if they press f2, then home or some other keystroke like an arrow key really fast.
	WatchForScriptOrFunctionChange = OFF
endIf
return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
endFunction

void function CaretMovedEvent( int movementUnit,optional int source)
if WatchForScriptOrFunctionChange then
	WatchForScriptOrFunctionChange = OFF
	SaveCursor ()
	PcCursor ()
	SayLine (TRUE)
	restoreCursor ()
	return
endIf
CaretMovedEvent (movementUnit, source)
endFunction

void function ProcessKeystrokeAndWatchForChange (string keystroke)
; for all the 'jump to' commands.
; f2, shift+f2, and now f12.
var handle focusWindow = getFocus ()
if getWindowSubtypeCode (focusWindow) == WT_MULTILINE_EDIT 
&& GetWindowClass (FocusWindow) == cwc_Scintilla
	WatchForScriptOrFunctionChange = TRUE
endIf
TypeKey (keystroke)
sayCurrentScriptKeyLabel ()
endFunction

script NextScript ()
;TypeCurrentScriptKey()
ProcessKeystrokeAndWatchForChange (ksNextScript)
EndScript

script PriorScript ()
;TypeCurrentScriptKey()
ProcessKeystrokeAndWatchForChange (ksPriorScript)
EndScript

script JumpToDefinition ()
ProcessKeystrokeAndWatchForChange (ksJumpToDefinition)
endScript

Void Function ProcessBoundaryStrike (handle hWnd, int edge)
	Return
EndFunction

void Function FindPrevOrNext (int iDirection)
If iDirection == Back then
	TypeKey (ksFindPrev)
Else
	TypeKey (ksFindNext)
EndIf
If DialogActive () ||
MenusActive () ||
UserBufferIsActive () ||
GetObjectTypeCode () != WT_EDIT then;
	Return Null();
EndIf
Delay(1)
If ! getSelectedText () then
	SayMessage (OT_ERROR, msgSearchError)
	Return;
EndIf
EndFunction

Script FindPrev ()
SayCurrentScriptKeyLabel ()
FindPrevOrNext (Back)
EndScript

Script FindNext ()
SayCurrentScriptKeyLabel ()
FindPrevOrNext (Forward)
EndScript

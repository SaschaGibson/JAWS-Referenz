;CopyRight 1997-2016 by Freedom Scientific BLV Group, LLC
;JAWS Keyboard Manager Script file

;Created 5/15/97, cw
;Modified and updated 3/30/99 by DB
; Updated List View Speaking, DB
; Added functionality to automatically speak first two columns of Scripts list view
; not just with up and down arrows

include "jkey.jsm"
include "jkey.jsh"
include "hjglobal.jsh"
include "hjconst.jsh"
Include "common.jsm"

Void Function AddHotKeyLinks ()
UserBufferAddText (cScBufferNewLine); Put a blank line in to ensure accurate spacing in the buffer
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndFunction

Void Function SayKeystroke ()
if (!IsPCCursor ()) then return endif
SaveCursor()
InvisibleCursor ()
RouteInvisibleToPc ()
NextChunk()
SayChunk ()
RestoreCursor()
EndFunction

Void Function SayWindowTypeAndText (handle hWnd)
; to handle Read-Only Edit fields
var
	int iVerbosity,
	int iWinType,
	string strName,
	string strType,
	string strWinText
let iWinType = GetWindowSubTypeCode (hWnd)
; If not ReadOnlyEdit then resume normal operation
If (iWinType != WT_READONLYEDIT) then
	SayWindowTypeAndText (hWnd)
	Return
EndIf
let strName = GetWindowName (hWnd)
	let strType = GetWindowType (hWnd)
let strWinText = GetWindowText (hwnd, read_everything)
SayControlExWithMarkup (hwnd, strName, strType, "", "", "", strWinText)
	;SayWindow (hWnd, Read_Everything)
EndFunction

Void Function SayHighlightedText (handle hWnd, string buffer)
var
	int iControl
If (GlobalMenuMode == 0) then
	If (IsPcCursor ()) then
		let iControl = GetControlID (hWnd)
		; stop extra chatter presented by custom handling of this list view
		If (iControl == ID_SCRIPT_LIST_VIEW) then
	SayChunk()
			SayKeystroke()
			Return
		EndIf
	EndIf
EndIf
SayHighlightedText (hWnd, buffer)
EndFunction

Void Function SayFocusedWindow ()
;wn1="Change Keystroke"
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
if ((GetWindowName (GetRealWindow (GetFocus ()))== wn1)
&& (GetControlID(GetFocus()) == ID_CHANGE_KEYSTROKE_HOT_KEY)) then
	SayFormattedMessage (OT_control_name, msg1_L, msg1_S) ;"Assign to hot key"
	return
endif
;wn2="Add Keystroke"
if ((GetWindowName (GetRealWindow (GetFocus ()))== wn2)
&& (GetControlID(GetFocus()) == ID_ADD_KEYSTROKE_HOT_KEY)) then
	SayFormattedMessage (OT_control_name, msg1_L, msg1_S) ;"Assign to hot key"
	return
endif
;wn3="Find Keystroke"
if ((GetWindowName (GetRealWindow (GetFocus ()))== wn3)
&& (GetControlID(GetFocus()) == ID_FIND_KEYSTROKE_HOT_KEY)) then
	SayFormattedMessage (OT_control_name, msg2_L) ;"hot key"
	return
endif
SayFocusedWindow ()
/*If (GetWindowSubTypeCode (GlobalFocusWindow) == WT_READONLYEDIT) then
	SayWindow (GlobalFocusWindow, Read_Everything)
EndIf*/
EndFunction

Script  ScriptFileName()
ScriptAndAppNames(msgScriptKeyHelp1)
EndScript

Script SayBottomLineOfWindow()
var
	handle hWnd,
	string sText
Let hWnd = GetFocus ();
if (GetControlID (hWnd) != 59649 || GlobalMenuMode) then
	PerformScript SayBottomLineOfWindow()
	Return;
EndIf
Let hWnd = FindWindow (GetAppMainWindow (hWnd), wcStatusBar)
If (! hWnd || ! IsWindowVisible (hWnd)) then
	PerformScript SayBottomLineOfWindow()
	Return;
EndIf
Let sText = GetWindowText (hWnd,READ_EVERYTHING)
If ! sText then
	PerformScript SayBottomLineOfWindow()
	Return;
EndIf
Let sText = StringChopLeft (sText, 
StringLength (StringSegment (sText, ".", 1))+1)
Let sText = (StringTrimLeadingBlanks (sText))
If (! sText) then
	PerformScript SayBottomLineOfWindow()
	Return;
EndIf
Say (sText, OT_USER_REQUESTED_INFORMATION)
EndScript

Script ScreenSensitiveHelp ()
If UserBufferIsActive () then
	PerformScript ScreenSensitiveHelp()
	Return
EndIf
var	int ID = GetControlID (GetFocus ())
if id == ID_ADD_GESTURE_FOR_GESTURE_MODE_COMBOBOX 
|| id == ID_FIND_GESTURE_FOR_GESTURE_MODE_COMBOBOX 
	SayFormattedMessage (OT_USER_BUFFER,msgScreenSensitiveHelpForGestureModeComboBox)
	AddHotKeyLinks ()
	Return
endIf
If GlobalMenuMode > 0
|| DialogActive () then
	PerformScript ScreenSensitiveHelp ()
	Return
EndIf
If ID == ID_FILE_LIST_VIEW then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpFileList)
	AddHotKeyLinks ()
	Return
ElIf ID == ID_SCRIPT_LIST_VIEW then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpScriptList)
	AddHotKeyLinks ()
	Return
EndIf
PerformScript ScreenSensitiveHelp ()
EndScript

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
If hwndFocus == hwndPrevFocus
	If sClass == cWcListView
		Return(ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild))
	EndIf
EndIf
Return (FocusChangedEvent(hwndFocus,hwndPrevFocus))
EndFunction

; Copyright 1995-2015 by Freedom Scientific, Inc.
; JAWS 8.0
; Scripts for Borland Developer Studio 2006/2007.

Include "HjGlobal.jsh"
Include "hjConst.jsh"
Include "Borland developer Studio.jsh"
Include "common.jsm"
Include "Borland Developer Studio.jsm"
globals
	String g_strLastMenuName

Void Function AutoStartEvent ()
Let giSpeakCodeCompletionList = false
Let giSuppressSayLine = false
Let gbHasNameBeenRetrieved = false
Let gsCodeCompletion = ""
Let gsErrorInsight = ""
EndFunction

String Function GetCurrentCodeEditorFile ()
Var
	int iCounter,
	Handle hReal
Let iCounter = 7 ; We need the seventh parent
let hReal = GlobalFocusWindow ; Start with the focus window
While iCounter > 0
	Let hReal = GetParent (hReal)
	Let iCounter = iCounter - 1
EndWhile
Return GetWindowName (hReal)
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
Var
	String sClass
Let sClass = GetWindowClass (FocusWindow)
If sClass == wc_ideCategoryButtons Then
	; We've changed to a different real window, even though it is technical not such a window.
	; But we want to announce it anyway
	Say (GetWindowName (GetParent (GlobalFocusWindow)), ot_window_name, false)
	return
ElIf sClass == wc_EditControl Then
	; We've switched to the Code Editor, but the name of the current unit is not announced, so speak it here.
	Say (GetCurrentCodeEditorFile (), ot_window_name, false)
	Return
EndIf
ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
EndFunction

int Function HandleCustomWindows (handle hWnd)
Var
	String sClass,
	int nOldRestriction,
	String sChunk
Let sClass = GetWindowClass (hWnd)
if sClass == wc_VirtualStringTree Then
	IndicateControlType (wt_TreeView, GetWindowName (GetParent (hWnd)))
	return TRUE
Elif sClass == wc_EditControl Then
	IndicateControlType (wt_multiline_edit, "") ;GetCurrentCodeEditorFile()
	return true
EndIf
Return false
EndFunction

Script ScriptFileName ()
ScriptAndAppNames (MsgBdsAppName)
EndScript

Void Function SayNonHighlightedText(Handle Hwnd, String Buffer)
; Purpose: Speak various items automatically.
Var
	String sClass,
	string sParentClass
Let sClass = GetWindowClass (hWnd)
Let sParentClass = GetWindowClass(GetParent(hwnd))
If sParentClass == WCPropertyInspector
&& sClass == WCPanel Then
; Speak the currently selected Component automatically
; When in a form.
	if ! gbHasNameBeenRetrieved Then
		Let gsFormElementName = Buffer
		Say (buffer, ot_control_name, false)
		Let gbHasNameBeenRetrieved = true
	else
		Let gsFormElementType = Buffer
		Say (buffer, ot_control_type, false)
		Let gbHasNameBeenRetrieved = false
	EndIf
	return
/*ElIf sClass == wc_TokenWindow Then
	; Get the token window help from Code Insight
	if gsCodeInsight == "" Then
		let gsCodeInsight = buffer
	Else
		Let gsCodeInsight = gsCodeInsight + Buffer
	EndIf
	let ghCodeInsight = hWnd
	Say (buffer, ot_SCREEN_MESSAGE)
	Return*/
ElIf sClass == wc_TokenHintWindow Then
	; Get the token window help from Code Insight
	let gsCodeInsight = gsCodeInsight + cscSpace + buffer
	Say (buffer, ot_SCREEN_MESSAGE)
	let ghCodeInsight = hWnd
	Return
ElIf sClass == wc_UTF8HintWindow Then
	; Get the tip help from Error Insight
	let gsErrorInsight = buffer
	let ghErrorInsight = hWnd
	Say (buffer, ot_SCREEN_MESSAGE)
	Return
ElIf sClass == wc_PaintPanel Then
	; Speak the Castalia tool tip hints
	Say (buffer, ot_SCREEN_MESSAGE)
	Return
Endif
SayNonHighlightedText(hwnd, buffer) ; Default behaviour in all other cases
EndFunction

Void Function SayHighLightedText (handle hwnd, string buffer)
Var
	String sClass
Let sClass = GetWindowClass (hWnd)
If sClass == wc_CodeCompleteListView
&& giSpeakCodeCompletionList Then
	; Does not automatically get spoken when focus is in the code editor,
	; so force it to speak the screen text instead of MSAA info.
	Let giSpeakCodeCompletionList = false
	Let gsCodeCompletion = GetWindowText (hWnd, TRUE)
	let ghCodeCompletion = hWnd
	Say(buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
	return
EndIf
If sClass == wc_PropSelection Then
	return ; Don't speak because it's extraneous
EndIf
SayHighlightedText (hWnd, Buffer)
EndFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
If GetAppMainWindow(hWnd) != GetAppMainWindow(hFocus)
&& GetWindowClass (hWnd) == wc_CodeCompleteListView Then
	let giSpeakCodeCompletionList = TRUE
	return false
EndIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

void function ProcessBoundaryStrike(handle hWnd, int edge)
If GetWindowClass (hWnd) == wc_EditControl Then
	; Cursor hasn't moved, but we want SayHighlightedText to speak the newly selected item,
	; and do not want the line repeated, so set variable and simply return here
	Let giSuppressSayLine = TRUE
	Return
Else
	ProcessBoundaryStrike(hWnd, edge)
EndIf
EndFunction

Script CloseListBox ()
If (GetWindowClass (GetFocus ()) == WCListButton) Then
	TypeKey (cksEnter)
	SayFormattedMessage (OT_JAWS_Message, cmsg42_l)
	Return
EndIf
PerformScript CloseListBox() ; Default
EndScript


Script OpenListBox ()
Var
	Handle hWnd,
	Handle hFocus
Let hFocus = GetFocus ()
If GetWindowClass (hFocus) == wc_PropInspEdit Then
	Let hWnd = GetPriorWindow (hFocus)
	If IsWindowVisible (hWnd) Then
		saveCursor ()
		JawsCursor ()
		MoveToWindow (hWnd)
		LeftMouseButton ()
		Pause ()
		RestoreCursor ()
		SayFormattedMessage (ot_JAWS_message, cmsg41_L, cmsgSilent)  ;open list box
		Return
	Else
  SayFormattedMessage(OT_JAWS_MESSAGE, msgNoListAvailable_L, msgNoListAvailable_S)
		Return
	EndIf
EndIf
PerformScript OpenListBox()
EndScript

Script NextDocumentWindow ()
Var
	handle hFocus,
	Handle hWnd,
	String sClass
If UserBufferIsActive () then
	UserBufferDeActivate ()
EndIf
Let hFocus = GetFocus ()
Let sClass = GetWindowClass (hFocus)
If sClass == wc_PropSelection
|| sClass == wc_PropInspEdit Then
SpeechOff ()
	TypeKey(cksControlTab)
	Pause ()
SpeechOn ()
	Let hWnd = hFocus
	While hWnd
	&& GetWindowClass (hWnd) != wc_InspListBox
		Let hWnd = GetParent (hWnd)
	EndWhile
	If hWnd Then
		Let hWnd = GetNextWindow (hWnd)
		SaveCursor ()
		InvisibleCursor ()
		MoveToWindow (hWnd)
		If GetColorName (GetColorBackground ()) != "Grau81" Then
			NextWord ()
		EndIf
		IndicateControlType (wt_dialog_Page, GetWord (), "")
		RestoreCursor ()
		SayLine ()
		Return
	EndIf
ElIf sClass == wc_EditControl Then
	; We've switched to another Code Editor tab, but the name of the current unit is not announced, so speak it here.
	TypeKey(cksControlTab)
	Pause ()
	Say (GetCurrentCodeEditorFile (), ot_window_name, false)
	Return
EndIf
TypeKey(cksControlTab)
; Handle the special case in which the user calls the NextDocumentWindow script when focus
; is positioned on the Tab Control.  In this special case FocusChangedEvent is not called
; and as a result JAWS does not announce the page change.
If (IsPCCursor()) Then
	Pause ()
	Delay(1)
	If (GetObjectTypeCode ()==WT_TABCONTROL) Then
		; SayWindowTypeAndText(GetFocus())
		SayFocusedObject ()
	EndIf
EndIf
EndScript

Script PreviousDocumentWindow ()
Var
	handle hFocus,
	Handle hWnd,
	String sClass
If UserBufferIsActive () then
	UserBufferDeActivate ()
EndIf
Let hFocus = GetFocus ()
Let sClass = GetWindowClass (hFocus)
If sClass == wc_PropSelection
|| sClass == wc_PropInspEdit Then
SpeechOff ()
	TypeKey(cksControlTab)
	Pause ()
SpeechOn ()
	Let hWnd = hFocus
	While hWnd
	&& GetWindowClass (hWnd) != wc_InspListBox
		Let hWnd = GetParent (hWnd)
	EndWhile
	If hWnd Then
		Let hWnd = GetNextWindow (hWnd)
		SaveCursor ()
		InvisibleCursor ()
		MoveToWindow (hWnd)
		If GetColorName (GetColorBackground ()) != "Grau81" Then
			NextWord ()
		EndIf
		IndicateControlType (wt_dialog_Page, GetWord (), "")
		RestoreCursor ()
		SayLine ()
		Return
	EndIf
ElIf sClass == wc_EditControl Then
	; We've switched to another Code Editor tab, but the name of the current unit is not announced, so speak it here.
	TypeKey(cksControlShiftTab)
	Pause ()
	Say (GetCurrentCodeEditorFile (), ot_window_name, false)
	Return
EndIf
TypeKey(cksControlShiftTab)
; Handle the special case in which the user calls the NextDocumentWindow script when focus
; is positioned on the Tab Control.  In this special case FocusChangedEvent is not called
; and as a result JAWS does not announce the page change.
If (IsPCCursor()) Then
	Pause ()
	Delay(1)
	If (GetObjectTypeCode ()==WT_TABCONTROL) Then
		; SayWindowTypeAndText(GetFocus())
		SayFocusedObject ()
	EndIf
EndIf
EndScript

Script ProjectOptions ()
TypeCurrentScriptKey ()
SayCurrentScriptKeyLabel ()
EndScript

Int Function BrailleCallbackObjectIdentify ()
Var
	handle hFocus,
	String sFocusClass,
	string sParentClass
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
Let hFocus = GetFocus ()
Let sParentClass = GetWindowClass (GetParent (hFocus))
Let sFocusClass = GetWindowClass (hFocus)
If sParentClass == wc_FormContainer
|| sFocusClass == wc_EditorFormDesigner
|| GetWindowClass (GetParent (GetParent (GetParent (GetParent (hFocus))))) == wc_DotNetDesignerFrame Then
; We're in the VCL or Windows Forms designers, so return the first custom control
	return WT_CUSTOM_CONTROL_BASE+1
ElIf sFocusClass == wc_EditControl Then
	return WT_CUSTOM_CONTROL_BASE+2
else
	return BrailleCallbackObjectIdentify ()
EndIf
EndFunction

Int Function BrailleAddObjectName (int nType)
if IsTouchCursor() then
	return BrailleAddObjectName (nType)
EndIf
If nType == wt_custom_control_base+1 Then
	BrailleAddString (gsFormElementName, 0, 0, 0)
	return TRUE
Else
	return BrailleAddObjectName (nType)
EndIf
EndFunction

Int Function BrailleAddObjectType (int nType)
if IsTouchCursor() then
	return BrailleAddObjectType (nType)
EndIf
If nType == wt_custom_control_base+1 Then
	BrailleAddString (gsFormElementType, 0, 0, 0)
	return TRUE
Else
	return BrailleAddObjectType (nType)
EndIf
EndFunction

Int Function BrailleAddObjectLine (int nType)
if nType == wt_Custom_Control_Base+2 Then
	If !StringIsBlank (gsCodeCompletion)
	|| !StringIsBlank (gsCodeInsight)
	|| !StringIsBlank (gsErrorInsight) Then
		BrailleAddFocusLine ()
		return TRUE
	else
		return false
	EndIf
EndIf
return false
EndFunction

Int Function BrailleAddObjectCodeCompletion (int nType)
if !IsWindowVisible (ghCodeCompletion) Then
	let gsCodeCompletion = ""
	return false
EndIf
if nType == wt_Custom_Control_Base+2 Then
	BrailleAddString(gsCodeCompletion, 0,0, attrib_highlight)
	return TRUE
EndIf
Return FALSE
EndFunction

Int Function BrailleAddObjectCodeInsight (int nType)
if !IsWindowVisible (ghCodeInsight) Then
	let gsCodeInsight = ""
	return false
EndIf
if nType == wt_Custom_Control_Base+2 Then
	BrailleAddString(gsCodeInsight, 0,0, 0)
	return TRUE
EndIf
Return FALSE
EndFunction

Int Function BrailleAddObjectErrorInsight (int nType)
if !IsWindowVisible (ghErrorInsight) Then
	let gsErrorInsight = ""
	return false
EndIf
if nType == wt_Custom_Control_Base+2 Then
	BrailleAddString(gsErrorInsight, 0,0, attrib_highlight)
	return TRUE
EndIf
return FALSE
EndFunction

void Function SayLine(optional int HighlightTracking, optional int bSayingLineAfterMovement)
Var
	Handle hFocus,
	String sClass
Let hFocus = GetFocus ()
Let sClass = GetWindowClass (hFocus)
If sClass == wc_EditControl
&& giSuppressSayLine Then
	Let giSuppressSayLine = false
	Return
EndIf
If sClass == wc_PropSelection Then
	If GetColorAtPoint (GetCursorCol ()-8, GetCursorRow ()) == 16777215 Then
		SayFormattedMessage (ot_ITEM_STATE, msgHasSubItems, msgHasSubItems)
	EndIf
EndIf
SayLine (HighlightTracking,bSayingLineAfterMovement)
EndFunction

; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS Script file for WordPad

include "HJConst.jsh"
include "HJGlobal.jsh"
include "UIA.jsh"
include "MSAAConst.jsh"
include "common.jsm"
include "WordPad.jsm"
Globals
	int TessfitTextSet,

	int giUpDownArrow

Script ScriptFileName()
ScriptAndAppNames(WordPadAppName)
EndScript

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow, optional handle PrevFocusWindow)
if dialogActive () && getWindowClass (getRealWindow (focusWindow)) == cWc_dlg32770 then return FALSE endIf
return FocusChangedEventShouldProcessAncestors(FocusWindow, PrevFocusWindow)
endFunction

void Function SayHighLightedText (handle hwnd, string buffer)
var
	handle hCurWnd,
	int iSubtype
if (GetScreenEcho() > 0) then
	let hCurWnd = GetCurrentWindow()
	let iSubtype = GetWindowSubtypeCode(hCurWnd)
	if GetWindowName(GetRealWindow(hCurWnd)) == wn_FontDialog
	&& hWnd != hCurWnd
	&& (iSubtype==wt_EditCombo || iSubtype==wt_ComboBox) then
		return
	EndIf
endIf
SayHighLightedText(hwnd,buffer)
EndFunction

Void function ProcessBoundaryStrike(handle hWnd, int edge)
var
	int iType
Let iType = GetWindowSubTypeCode(hWnd)
if iType == wt_MultiLine_edit then
	if giUpDownArrow then
		let giUpDownArrow=false
		return
	else
		Beep()
		return
	EndIf
EndIf
ProcessBoundaryStrike(hwnd,edge)
EndFunction

Void Function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if GetWindowSubtypeCode(GetFocus())==wt_multiLine_Edit
&& (nKey==key_UpARrow
|| nKey==key_DownArrow) then
	let giUpDownArrow=true
EndIf
ProcessKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
EndFunction

void function GetWindowTitleForApplication(handle hAppWnd, handle hRealWnd, handle hCurWnd, int iTypeCode,
	string ByRef sTitle, string ByRef sSubTitle, int ByRef bHasPage)
var
	string sText1,
	string sText2,
	string sText3
bHasPage = false
sText1 = GetWindowName(hAppWnd)
if hRealWnd != hAppWnd
	if hRealWnd != hCurWnd
		sText2 = GetWindowName(hRealWnd)
	endif
endif
If IsMultiPageDialog()
	if !sText2
		sText2 = sText1
	endIf
	sText3 = GetDialogPageName ()
	bHasPage = true
	sTitle = sText2
	sSubTitle = sText3
	return
endIf
if sText2
&& stringContains(sText1, sText2)
	; app window title contains document name
	sText2 = cscNull
endIf
sTitle = sText1
sSubTitle = sText2
EndFunction

int function MainProcessShouldSkipUIAElementWhenNavigating(object element)
var object pattern
if element.controlType == UIA_WindowControlTypeId
	if element.className == "WordPadClass"
		return true
	endIf
elif element.controlType == UIA_PaneControlTypeId
	if element.automationID == "ProperTreeHost"
		return true
	endIf
elif element.controlType == UIA_CustomControlTypeId
	pattern = element.GetLegacyIAccessiblePattern()
	if pattern
	&& pattern.role == ROLE_SYSTEM_CLIENT
		return true
	endIf
EndIf
return MainProcessShouldSkipUIAElementWhenNavigating(element)
EndFunction


Void Function AutostartEvent ()
	if TessfitTextSet == 1 Then
		TypeKey ("Ctrl+A")
		TypeKey ("Ctrl+V")
		TypeKey ("Ctrl+Home")
		TessfitTextSet = 0
	Endif
EndFunction

Script TessfitTextBack ()
	TessfitTextSet = 2
	TypeKey ("Ctrl+A")
	TypeKey ("Ctrl+C")
	TypeKey ("Ctrl+S")
	TypeKey ("Alt+F4")
EndScript
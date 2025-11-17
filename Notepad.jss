; Copyright 2017-2022 by Freedom Scientific, Inc.
; Freedomscientific scripts for Notepad

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "common.jsm"
include "Notepad.jsm"
include "notepad.jsh"
include "MSAAConst.jsh"

import "UIA.jsd"

int function BrailleAddObjectName(int nSubtype)
if nSubtype == wt_multiline_edit
&& IsWindows10()
	;Do nothing, prevent the name from appearing for the document:
	return true
endIf
return BrailleAddObjectName(nSubtype)
EndFunction

int function BrailleAddObjectType(int nSubtype)
if nSubtype == wt_multiline_edit
&& IsWindows10()
	;Do nothing, prevent the type code from appearing for the document:
	return true
endIf
return BrailleAddObjectType(nSubtype)
EndFunction

int function FSIWheelActionIsValidForBrailleStructure()
; In Windows 10, the default test for !BrailleIsStructuredLine() returns true.
; This allows for tabs to be undesirably inserted into the document under some circumstances.
return !BrailleIsStructuredLine()
	|| (GetObjectSubtypeCode() == wt_multiline_Edit && !DialogActive())
EndFunction

void Function BrailleNavPanRight()
;In Windows 10, the document is a multiline edit,
;which means that panning is not normally allowed to move to the next line
;when the PC cursor is in the first line.
;However, in the document the panning should be allowed to move to the next line.
if !IsWindows10()
|| GetObjectSubtypeCode() != wt_multiline_edit
	return BrailleNavPanRight()
endIf
if !BraillePanRight(TRUE)
	if (	BrailleNextLine())
		while BraillePanLeft() endWhile
	endIf
endIf
EndFunction

void Function BrailleNavPanLeft()
;In Windows 10, the document is a multiline edit,
;which means that panning is not normally allowed to move to the prior line
;when the PC cursor is in the first line.
;However, in the document the panning should be allowed to move to the prior line.
if !IsWindows10()
|| GetObjectSubtypeCode() != wt_multiline_edit
	return BrailleNavPanLeft()
endIf
if !BraillePanLeft(TRUE)
	if 	BraillePriorLine()
		while BraillePanRight() endWhile
	endIf
endIf
EndFunction

int function sayObjectTypeAndTextWin11AlertDialog (int level)
if level != 1
|| ! IsWindows11 () then
	return FALSE
endIf
var string dialogName = getObjectName(FALSE, level)
var object element = FSUIAGetElementFromHandle (GetFocus ())
if ! element return FALSE endIf
var object condition = FSUIACreateStringPropertyCondition (UIA_AutomationIdPropertyId, "ContentScrollViewer")
if ! condition return endIf
element = element.FindFirst(TreeScope_Subtree, condition)
if ! element return FALSE endIf
condition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyId, UIA_TextControlTypeId)
if ! condition return endIf
var object elements = element.FindAll(TreeScope_Subtree,condition)
if ! elements
|| ! elements.count then
	return FALSE
endIf
var int i = 0
var string DialogStaticText, string temp
for i=0 to elements.count-1
	element = elements(i)
	temp = element.name
	if temp != dialogName then
		dialogStaticText = dialogStaticText + cscBufferNewLine + temp
	endIf
endFor
if stringIsBlank (dialogStaticText) then return FALSE endIf
indicateControlType (WT_DIALOG, dialogName, dialogStaticText)
return TRUE
endFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if nLevel == 0
	if IsWindows10()
	&& GetObjectSubtypeCode() == wt_multiline_edit
	&& !DialogActive()
		;Don't speak the object name of "Text Editor" for the document.
		;Note that some dialogs have multiline edits. We want to avoid speaking the edit field name only for the document area.
		IndicateControlType(wt_multiline_edit,cmsgSilent,cmsgSilent)
		if (GetJCFOption(OPT_ANNOUNCE_MULTILINE_EDIT))
			IndicateControlState(wt_multiline_edit, CTRL_MULTILINE)
		endIf
		return
	endIf
endIf
if sayObjectTypeAndTextWin11AlertDialog (nLevel) then return endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgNotepadAppName)
EndScript

script SayBottomLineOfWindow()
var
	string sText
if IsWindows11 ()
	sText = GetWin11NotepadStatusBarText ()
	if sText
		Say(sText,ot_user_requested_information)
		return
	endIf
endIf
PerformScript SayBottomLineOfWindow()
EndScript

String Function GetWin11NotepadStatusBarText ()
var
	object oElement,
	object oStatusBarItems,
	object oStatusBarItem,
	object oAutomationIDCondition,
	object oTextPattern,
	object oTextRange,
	string sText,
	string sStatusItem
oElement = FSUIAGetElementFromHandle(GetForegroundWindow())
oAutomationIDCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyId, "ContentTextBlock")
oStatusBarItems = oElement.FindAll(TreeScope_Descendants, oAutomationIDCondition)
forEach oStatusBarItem in oStatusBarItems
	if oStatusBarItem.controltype == UIA_TextControlTypeID
	&& oStatusBarItem.name
		if sText sText = sText+cscSpace endIf
		oTextPattern = oStatusBarItem.GetTextPattern()
		oTextRange = oTextPattern.DocumentRange
		sStatusItem = oTextRange.GetText(TextRange_NoMaxLength)
		sText = sText+sStatusItem
	endIf
endForEach
return sText
EndFunction

void function ProcessBoundaryStrike(handle hWnd, int edge)
if GetObjectRole (0)==ROLE_SYSTEM_DOCUMENT && IsPcCursor() then
	beep()
	sayLine()
	return
endIf
ProcessBoundaryStrike(hWnd, edge)
endFunction

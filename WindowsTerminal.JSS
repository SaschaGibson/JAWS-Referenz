; Copyright 2022 Freedom Scientific Inc.

import "uia.jsb"
include "hjconst.jsh"
include "common.jsm"
include "uia.jsh"

const
	TerminalClassName = "TermControl",
	MaxTimeToPollForNewText = 3000

globals
	string terminal_LastText,
	int WindowsTerminalTimer,
	int WindowsTerminalObjectID,
	object WindowsTerminalTextProvider,
	int WindowsTerminalLastKeyPressTime


Script ScriptFileName()
       ScriptAndAppNames("Windows Terminal")
EndScript

function AutoStartEvent()
	WindowsTerminalTimer = ScheduleFunction("ReadNewText",1)
EndFunction

function AutoFinishEvent()
	UnscheduleFunction(WindowsTerminalTimer)
	WindowsTerminalTimer = 0
	var object oNull
	WindowsTerminalTextProvider = oNull
EndFunction

; Have empty versions of the following functions to prevent needless chatter
void function ProcessSayAppWindowOnFocusChange(handle AppWindow, handle FocusWindow)
EndFunction

void function ProcessSayRealWindowOnFocusChange(	 handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
EndFunction

Int Function IgnoreObjectAtLevel(int level)
	var
		int type = GetObjectSubTypeCode()
	if type == WT_LISTBOX ||
		type == WT_LISTBOXITEM
		return true ; prevent overspeaking with Ctrl+Tab
	EndIf
	return FALSE
EndFunction


function EnsureNewTextTimerIsActive()
	if WindowsTerminalTimer == 0
		WindowsTerminalTimer = ScheduleFunction("ReadNewText",1)
	EndIF
EndFunction

int function GetObjectID()
	var
		int id
	GetFocus(id)
	return id
EndFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
	; We echo all new text using a timer  to handle the fact that TERMINAL redraws the entire window on every change.
	; A timer allows us to compare the old screen contents with the new and only speak the changes.
	return TRUE
EndFunction

Void Function KeyPressedEvent (int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
	WindowsTerminalLastKeyPressTime = GetTickCount()
	if GetObjectClassName() == TerminalClassName
		EnsureNewTextTimerIsActive()
	EndIf
	KeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

string function RemoveFirstLine(string text)
	var
		int newLinePos = StringContains(text,"\n")
	if newLinePos == 0
		return ""
	EndIf
	return StringChopLeft(text,newLinePos)
EndFunction

string function RemoveLastLine(string text)
	var int newLinePos = StringContainsFromRight(text,"\n")
	if newLinePos > 1
		return StringLeft(text,newLinePos-1)
	EndIf
	return ""
EndFunction

int function AreChangesLimitedToBottomLine(string newText, string oldText)
	newText = RemoveLastLine(StringTrimTrailingBlanks(newText))
	oldText = RemoveLastLine(StringTrimTrailingBlanks(oldText))

	return newText == oldText
EndFunction

string function GetNewlyWrittenText(string newText, string oldText)
	var
		string oldLine,
		string newLine
	if AreChangesLimitedToBottomLine(newText,oldText)
		oldLine =	StringChopLeft(oldText,StringContainsFromRight(oldText,"\n"))
		newLine = StringChopLeft(newText,StringContainsFromRight(newText,"\n"))
		if LevenshteinDistance(oldLine,newLine) < 3
			return "" ; prevent double echoing of characters that are typed
		EndIf
		return GetThePartOfLineThatChanged(newLine,oldLine)
	EndIf
	while oldText
		if StringStartsWith(newText,oldText)
			return StringDiff(newText,oldText)
		EndIf
		oldText = RemoveFirstLine(oldText)
	EndWhile
	return newText
EndFunction

string function GetTextInConsoleWindow()
	var
		object oNull,
		object visibleRanges,
		object range
	if GetObjectClassName() != "TermControl"
		return ""
	EndIf
	if !WindowsTerminalTextProvider
		WindowsTerminalTextProvider = FSUIAGetFocusedElement().GetTextPattern()
	EndIf
	visibleRanges = WindowsTerminalTextProvider.GetVisibleRanges()
	range = visibleRanges(0)
	return range.GetText(-1)
EndFunction

Void Function readNewText ()
	var
		int newId,
		object oNull
	newId = GetObjectID()
	if newId != WindowsTerminalObjectID
		WindowsTerminalObjectID = newId
		; The following prevents reading the existing text in the newly
		; focused console tab by forcing the previous text to be equal to the
		; current contents. This means that the next time we check, the new
		; contents will be equal to the old and nothing will be read.
		WindowsTerminalTextProvider = oNull; Have changed tabs, must reinitialize textProvider
		terminal_LastText = StringTrimTrailingBlanks(GetTextInConsoleWindow())
		WindowsTerminalTimer = ScheduleFunction("ReadNewText",1) ; just in case new text comes in before next key press
		return
	EndIf
	var string text = GetTextInConsoleWindow()
	text = StringTrimTrailingBlanks(text)
	if 	GetScreenEcho() == ECHO_ALL && text && text != terminal_LastText
		Say(GetNewlyWrittenText(Text,terminal_LastText),OT_NONHIGHLIGHTED_SCREEN_TEXT)
		terminal_LastText = Text
	EndIf
	if GetTickCount()-WindowsTerminalLastKeyPressTime < MaxTimeToPollForNewText
		WindowsTerminalTimer = ScheduleFunction("ReadNewText",1)
	Else
		WindowsTerminalTimer = 0
	EndIf
EndFunction

script VirtualizeWindow()
	var string text = StringTrimTrailingBlanks(GetTextInConsoleWindow())
	if !text then
		SayMessage(OT_ERROR,cmsgNoTextToVirtualize_L,cmsgNoTextToVirtualize_S)
		return
	endIf
	SayMessage(ot_JAWS_Message,cmsgVirtualizeWindow_L,cmsgVirtualizeWindow_S)
	UserBufferClear()
	UserBufferAddText(text)
	UserBufferActivate()
	JAWSBottomOfFile()
	SayLine()
EndScript

int function inKeyBindingsListView()
return !UserBufferIsActive()
	&& !IsTouchCursor()
	&& GetObjectSubtypeCode() == wt_ListBoxItem
	&& GetObjectAutomationID(1) == "KeyBindingsListView"
EndFunction

int function SayKeyBindingsListViewItem()
if !inKeyBindingsListView() return false endIf
var object oFocus = FSUIAGetFocusedElement()
if !oFocus return false endIf
;making this two separate say statements puts a slight pause between the two pieces of text when spoken.
Say(oFocus.name, ot_line)
Say(oFocus.acceleratorKey,ot_line)
return true
EndFunction

string function GetKeyBindingsListViewItemText()
if !inKeyBindingsListView() return cscNull endIf
var object oFocus = FSUIAGetFocusedElement()
if !oFocus return cscNull endIf
return FormatString("%1 %2", oFocus.name, oFocus.acceleratorKey)
EndFunction

script SayLine()
if inKeyBindingsListView()
	if isSameScript()
		SpellString(GetKeyBindingsListViewItemText())
	else
		SayKeyBindingsListViewItem()
		Say(PositionInGroup(),ot_position)
	endIf
	return
endIf
PerformScript SayLine()
EndScript

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
if nLevel == 0
	if inKeyBindingsListView()
		IndicateControlType(WT_LISTBOX, cmsgSilent,cmsgSilent)
		SayKeyBindingsListViewItem()
		Say(PositionInGroup(),ot_position)
		return
	endIf
endIf
SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
EndFunction

void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if SayKeyBindingsListViewItem()
	return
endIf
ActiveItemChangedEvent(curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

int function BrailleAddObjectValue(int iSubtype)
if iSubtype == wt_ListBoxItem
	var string KeyBindingsListViewItemText = GetKeyBindingsListViewItemText()
	if KeyBindingsListViewItemText
		BrailleAddString(KeyBindingsListViewItemText,0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectValue(iSubtype)
EndFunction

void function UIANotificationEvent(int notificationKind, int notificationProcessing, string displayString, string activityId, string appname)
; Suppress UIA Notification events that are speaking newly written console text., since JAWS  speaks this info differently.
	if activityId != "TerminalTextOutput"
		UIANotificationEvent(notificationKind, notificationProcessing, displayString, activityId, appName)
	EndIf
EndFunction

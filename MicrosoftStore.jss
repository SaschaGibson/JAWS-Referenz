; Copyright 2022 Freedom Scientific, Inc.
; JAWS script file for the Microsoft Store app

include "hjconst.jsh"
include "UIA.jsh"
include "common.jsm"
include "MicrosoftStore.jsm"
import "UIA.jsd"

const
	MicrosoftStoreUIAEventPrefix = "MicrosoftStoreUIA",
	AutomationID_TextBox = "TextBox"

globals
	object oSearchTextListener,
	int giScheduledSaySuggestionCount,
	int giSuggestionCount


Void Function AutoFinishEvent ()
oSearchTextListener = Null ()
endFunction

Script ScriptFileName()
ScriptAndAppNames(msgMicrosoftStoreAppName) ;"Microsoft Store"
EndScript

Void Function SecondaryFocusChangedEvent()
SecondaryFocusChangedEvent()
if !InSuggestionList()
	if giScheduledSaySuggestionCount
		UnScheduleFunction (giScheduledSaySuggestionCount)
		giScheduledSaySuggestionCount = 0
	endIf
	SaySuggestionCount ()
endIf
endFunction

int function InSearchTextEdit()
return !UserBufferIsActive()
&& GetObjectAutomationID () == AutomationID_TextBox
endFunction

int function InSuggestionList()
return !UserBufferIsActive()
&& IsSecondaryFocusActive ()
&& !StringIsBlank (GetSecondaryFocusSelectionText ())
endFunction

void function ManageUIAListeners()
if InSearchTextEdit()
	StartListeningToSearchTextEditUIAEvents()
else
	if giScheduledSaySuggestionCount
		UnScheduleFunction (giScheduledSaySuggestionCount)
		giScheduledSaySuggestionCount = 0
	endIf
	oSearchTextListener = Null()
endIf
endFunction

void function StartListeningToSearchTextEditUIAEvents()
if oSearchTextListener return endIf
var object oFocus = FSUIAGetFocusedElement()
oSearchTextListener = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oSearchTextListener
|| !ComAttachEvents (oSearchTextListener, MicrosoftStoreUIAEventPrefix)
|| !oSearchTextListener.AddAutomationEventHandler(UIA_Text_TextSelectionChangedEventId, oFocus, TreeScope_Element)
	oSearchTextListener = Null()
	return
endIf
EndFunction

void function MicrosoftStoreUIAAutomationEvent (object element, int eventID)
if eventID == UIA_Text_TextSelectionChangedEventId
	if giScheduledSaySuggestionCount
		UnScheduleFunction (giScheduledSaySuggestionCount)
	endIf
	giScheduledSaySuggestionCount = ScheduleFunction ("SaySuggestionCount", 5)
	return
endIf
EndFunction

Void Function SaySuggestionCount ()
if giScheduledSaySuggestionCount
	UnScheduleFunction (giScheduledSaySuggestionCount)
	giScheduledSaySuggestionCount = 0
endIf
giSuggestionCount = 0
if InSuggestionList() return endIf
var object oList
oList = FSUIAGetFocusedElement().ControllerFor(0)
if !oList
	BrailleRefresh ()
	return
endIf
giSuggestionCount = FSUIAGetFirstChildOfElement(oList).SizeOfSet
SayUsingVoice (VCTX_MESSAGE, FormatString (msgSuggestionCount, IntToString (giSuggestionCount)), OT_line)
BrailleRefresh ()
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
ManageUIAListeners()
SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
if nLevel == 0
	if InSearchTextEdit()
	&& !InSuggestionList()
		SaySuggestionCount ()
	else
		Say(GetSecondaryFocusSelectionText (), OT_LINE)
		Say(PositionInGroupForSecondaryFocus(), OT_POSITION)
	endIf
endIf
EndFunction

script SayLine()
PerformScript SayLine()
if !IsPCCursor() return endIf
if InSearchTextEdit()
&& !InSuggestionList()
	SaySuggestionCount ()
else
	Say(GetSecondaryFocusSelectionText (), OT_LINE)
	Say(PositionInGroupForSecondaryFocus(), OT_POSITION)
endIf
endScript

int function BrailleAddObjectDescription(int nSubtypeCode)
if InSearchTextEdit ()
&& InSuggestionList()
	var string sSecondaryFocusSelectionText = GetSecondaryFocusSelectionText()
	if !StringIsBlank (sSecondaryFocusSelectionText)
		BrailleAddString(sSecondaryFocusSelectionText,0,0,attrib_highlight)
		return true
	endIf
endIf
return BrailleAddObjectDescription(nSubtypeCode)
EndFunction

int function BrailleAddObjectPosition (int type)
if IsTouchCursor()
	Return BrailleAddObjectPosition (type)
endIf
if InSearchTextEdit ()
&& InSuggestionList()
	var string positionInGroup = PositionInGroupForSecondaryFocus()
	if positioninGroup
		BrailleAddString(positioninGroup,0,0,0)
	endIf
	return true
endIf
return BrailleAddObjectPosition (type)
EndFunction

int function BrailleAddObjectSuggestionCount(int Type)
if giSuggestionCount
&& !InSuggestionList()
	BrailleAddString (FormatString (msgSuggestionCount, giSuggestionCount), 0, 0, 0)
	return true
endIf
return false
EndFunction

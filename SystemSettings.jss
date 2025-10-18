;Copyright 2014-2015 Freedom Scientific, Inc.
;Freedom Scientific script file for Windows 8.1 system settings

include "HJConst.jsh"
include "HJGlobal.jsh"
include "UIA.jsh"
include "common.jsm"
include "SystemSettings.jsm"

;for UIA functions and events:
const
	UIA_SystemSettings_EventFunctionNamePrefix = "SystemSettings"
globals
	object UIA_SystemSettings,
	collection colSystemSettings
		;Members are:
		;Initialized -- True if UIA object and collection is properly initialized
		;Focus -- The element having focus at the time of the focus change.
		;TreeWalker -- A treewalker that can be used for traversing the System Settings application elements.

const
;automation IDs:
;history event is tested using the beginning and ending of the automation id string,
;since each one has a unique automation id string which contains the number of the event:
	Automation_Start_HistoryEvent_Link = "HistoryEvent",
	Automation_End_HistoryEvent_Link = "_HyperlinkButton"


void function AutoStartEvent()
InitSystemSettingsUIA()
EndFunction

void function AutoFinishEvent()
UIA_SystemSettings = Null()
CollectionRemoveAll(colSystemSettings)
EndFunction

int function InitSystemSettingsUIA()
if UIA_SystemSettings
&& colSystemSettings.initialized
	return true
endIf
if !colSystemSettings colSystemSettings = new collection endIf
colSystemSettings.initialized = false
UIA_SystemSettings = CreateObjectEx("FreedomSci.UIA",false, "UIAScriptAPI.x.manifest")
if !UIA_SystemSettings return false endIf
if !ComAttachEvents(UIA_SystemSettings,UIA_SystemSettings_EventFunctionNamePrefix)
	UIA_SystemSettings = Null()
	return false
endIf
if !UIA_SystemSettings.AddFocusChangedEventHandler()
	UIA_SystemSettings = Null()
	return false
endIf
var object focusElement = UIA_SystemSettings.GetFocusedElement().BuildUpdatedCache()
if !focusElement
	UIA_SystemSettings = Null()
	return false
endIf
var object processCondition = UIA_SystemSettings.CreateIntPropertyCondition(UIA_ProcessIdPropertyId,focusElement.ProcessID)
if !processCondition
	UIA_SystemSettings = Null()
	return false
endIf
var object treeWalker = UIA_SystemSettings.CreateTreeWalker(processCondition)
if !treeWalker
	UIA_SystemSettings = Null()
	return false
endIf
SetCurrentElementToDeepestFocusElement(UIA_SystemSettings,treeWalker)
colSystemSettings.treeWalker = treeWalker
colSystemSettings.focus = treeWalker.currentElement
colSystemSettings.initialized = true
return true
EndFunction

void function SystemSettingsFocusChangedEvent(object element)
colSystemSettings.focus = element
EndFunction

int function OnUpdateHistoryLink()
if GetObjectSubtypeCode() != wt_link
|| UserBufferIsActive ()
	return false
endIf
var string automationID = colSystemSettings.focus.automationID
return StringStartsWith(automationID,Automation_Start_HistoryEvent_Link)
	&& StringRight(automationID,StringLength(Automation_End_HistoryEvent_Link)) == Automation_End_HistoryEvent_Link
EndFunction

string function GetNameOfFocusAndPredecessorObjects()
var object treeWalker = colSystemSettings.treeWalker
treeWalker.currentElement = colSystemSettings.focus
treeWalker.gotoPriorSibling
var string s1 = treeWalker.currentElement.name
var string s2 = colSystemSettings.focus.name
return s1+cscSpace+s2
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if nLevel == 1
	if onUpdateHistoryLink()
		;The descriptive text for the first history event is mistakenly retrieved for this level:
		return
	endIf
elif nLevel == 0
	if onUpdateHistoryLink()
		IndicateControlType(wt_link,GetNameOfFocusAndPredecessorObjects())
		return
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

int function BrailleAddObjectName(int nSubtype)
if nSubtype == wt_link
	if onUpdateHistoryLink()
		var object element = colSystemSettings.focus
		var int x, int y
		element.GetClickablePoint( intRef(x), intRef(y))
		BrailleAddString(GetNameOfFocusAndPredecessorObjects(),x,y,attrib_highlight)
		return true
	endIf
endIf
return BrailleAddObjectName(nSubtype)
EndFunction

script SayLine()
if isPCCursor()
	if onUpdateHistoryLink()
		var string text = GetNameOfFocusAndPredecessorObjects()
		if IsSameScript()
			SpellString(text)
		else
			IndicateControlType(wt_link,text)
		endIf
		return
	endIf
endIf
PerformScript SayLine()
EndScript

script ScriptFileName()
ScriptAndAppNames(msgSystemSettingsAppName)
EndScript

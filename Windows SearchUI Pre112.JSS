;Copyright 2015-2019 Freedom Scientific, Inc.
;Freedom Scientific script file for Windows 10 start menu search results

include "hjConst.jsh"
include "UIA.jsh"
include "MSAAConst.jsh"
include "common.jsm"
include "Windows SearchUI.jsm"

;UIA Search selection change support:
const
	SearchUI_EventPrefix = "SearchUI_UIA_"
globals
	object g_searchUI_UIA,
	object g_searchUI_UIATreeWalker,
;global stored by the automation event and used by the scheduled function and braille to announce the changes:
	object g_searchUI_AutomationEventElement,
;string to store search results group name for braille:
	string g_searchUI_AutomationEventGroupName

; Used to determine whether we should look forward or backward to see if the group changed during up/down navigation through search results list:
const
	SearchResultsUpDownNavDir_None = 0,
	SearchResultsUpDownNavDir_Next = 1,
	SearchResultsUpDownNavDir_Prior = 2
globals
	int SearchResultsUpDownNavDir 

;For scheduling AutomationSelectionEvent in SearchUI_UIA_AutomationEvent
globals
	int scheduledAutomationSelectionEvent 
	
const
	AutomationID_SearchTextBox = "SearchTextBox",
	AutomationID_ScopeTilesList = "scopeTilesList"

;Windows 10 in later builds uses a different UIA structure, and may offer more information for the search results items.
const
	WindowsOlderBuilds = 0,
	WindowsNewerBuilds = 1
globals
	int WindowsBuildType
 

int function InitSearchUI_UIA()
if g_searchUI_UIA && g_searchUI_UIATreeWalker return true endIf
g_searchUI_UIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !g_searchUI_UIA return false endIf
g_searchUI_UIATreeWalker = g_searchUI_UIA.CreateTreeWalker(g_searchUI_UIA.CreateRawViewCondition())
if !g_searchUI_UIATreeWalker
	g_searchUI_UIA = Null()
	return false
endIf
if !ComAttachEvents( g_searchUI_UIA, SearchUI_EventPrefix )
	g_searchUI_UIA = Null()
	g_searchUI_UIATreeWalker = Null()
	return false
endIf
return true
EndFunction

object function FindElementForEventWatching()
;In later builds of Windows 10,
;return the object pointed to by the ControllerFor property of the search edit.
;In earlier versions of Windows 10, return the window element.
var	object root = g_searchUI_UIA.GetElementFromHandle( GetFocus() )
if !root return Null() endIf
var object condition = g_searchUI_UIA.CreateAndCondition(
	g_searchUI_UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_EditControlTypeId),
	g_searchUI_UIA.CreateIntPropertyCondition(UIA_ProcessIdPropertyId, g_searchUI_UIA.GetFocusedElement().ProcessID ))
var object element = root.findFirst(TreeScope_Subtree,condition)
if !element || element.controllerFor.count == 0
	WindowsBuildType = WindowsOlderBuilds
	return root
else
	WindowsBuildType = WindowsNewerBuilds
	return element.controllerFor(0)
endIf
EndFunction

void function InitSearchUI_Events()
if !InitSearchUI_UIA() return endIf
var object root = FindElementForEventWatching()
if !root return endIf
g_searchUI_UIA.AddAutomationEventHandler( UIA_SelectionItem_ElementSelectedEventId,
	root, TreeScope_Element| TreeScope_Descendants )
g_searchUI_UIA.AddAutomationEventHandler( UIA_Window_WindowClosedEventId,
	root, TreeScope_Element)
EndFunction

void function DumpSearchUI_Events()
g_searchUI_UIA = Null()
g_searchUI_UIATreeWalker = Null()
g_searchUI_AutomationEventElement = Null()
g_searchUI_AutomationEventGroupName = cscNull
EndFunction

void function AutoStartEvent()
InitSearchUI_Events()
EndFunction

void function AutoFinishEvent()
DumpSearchUI_Events()
EndFunction

int function IsFocusCheckException()
return UserBufferIsActive()
	|| !IsPCCursor()
	|| IsTouchCursor()
	|| GetMenuMode()
EndFunction

void function SearchUI_UIA_AutomationEvent( object element, int eventID )
if eventID == UIA_SelectionItem_ElementSelectedEventId
	if scheduledAutomationSelectionEvent
		UnscheduleFunction(scheduledAutomationSelectionEvent )
	endIf
	;We need to use this event for speaking the selection change which happens while arrowing up/down with focus in the search edit.
	;We also need it to speak the selection change for the context menu of the selected search results item.
	;We do not want to use this event for speaking the focus change which occurs when arrowing up/down through the right-hand pane,
	;since we will get double speaking on some items in the right-hand pane if this event is allowed to speak.
	if GetObjectRole() != ROLE_SYSTEM_TEXT
	&& GetObjectName() != msgContextMenuName
		return
	endIf
	g_searchUI_AutomationEventElement = element
	scheduledAutomationSelectionEvent = ScheduleFunction("AutomationSelectionEvent",1)
EndIf
EndFunction

string function GetAutomationSelectionGroupChangeText()
;g_searchUI_AutomationEventGroupName is the global used by braille to read the group name
g_searchUI_UIATreeWalker.currentElement = g_searchUI_AutomationEventElement
if SearchResultsUpDownNavDir == SearchResultsUpDownNavDir_None
	g_searchUI_AutomationEventGroupName = cscNull
	return cscNull
elif SearchResultsUpDownNavDir == SearchResultsUpDownNavDir_Next
	g_searchUI_UIATreeWalker.GoToPriorSibling()
	if g_searchUI_UIATreeWalker.currentElement.controlType == UIA_GroupControlTypeId
		g_searchUI_AutomationEventGroupName = g_searchUI_UIATreeWalker.currentElement.name
		return FormatString("%1 %2",
			g_searchUI_UIATreeWalker.currentElement.name,
			g_searchUI_UIATreeWalker.currentElement.localizedControlType)
	else
		return cscNull
	endIf
endIf
;checking if nav dir prior entered new group is more complicated:
var int hasNextSibling = g_searchUI_UIATreeWalker.GoToNextSibling()
if hasNextSibling
&& g_searchUI_UIATreeWalker.currentElement.controlType != UIA_GroupControlTypeId
	return cscNull
endIf
;the group changed, so search back to see if a group element preceeds the item:
g_searchUI_UIATreeWalker.currentElement = g_searchUI_AutomationEventElement
while g_searchUI_UIATreeWalker.GoToPriorSibling()
	if g_searchUI_UIATreeWalker.currentElement.controlType == UIA_GroupControlTypeId
		g_searchUI_AutomationEventGroupName = g_searchUI_UIATreeWalker.currentElement.name
		return FormatString("%1 %2",
			g_searchUI_UIATreeWalker.currentElement.name,
			g_searchUI_UIATreeWalker.currentElement.localizedControlType)
	endIf
endWhile
g_searchUI_AutomationEventGroupName = cscNull
return cscNull
EndFunction

void function AutomationSelectionEvent()
scheduledAutomationSelectionEvent = 0
g_searchUI_UIATreeWalker.currentElement = g_searchUI_AutomationEventElement
g_searchUI_UIATreeWalker.gotoParent()
if g_searchUI_UIATreeWalker.currentElement.controlType == UIA_paneControlTypeId
	; Not a search results suggestion, so speak the current edit field:
	SayLine()
else ;Do we need to speak a group change when arrowing in the results list:
	var string sNewGroup = GetAutomationSelectionGroupChangeText()
	if sNewGroup
		Say(sNewGroup,ot_screen_message)
	endIf
endIf
SearchResultsUpDownNavDir = SearchResultsUpDownNavDir_None
;now say the element which became selected:
Say(g_searchUI_AutomationEventElement.name,ot_screen_message)
EndFunction

int function IsFocusSearchTextBox()
if IsFocusCheckException() return false endIf
var object focus = g_SearchUI_UIA.GetFocusedElement().BuildUpdatedCache()
return focus.AutomationID == AutomationID_SearchTextBox
EndFunction

int function IsFocusScopeFiltersList()
if IsFocusCheckException() return false endIf
var object focus = g_SearchUI_UIA.GetFocusedElement().BuildUpdatedCache()
if focus.controlType != UIA_DataItemControlTypeId return false endIf
g_searchUI_UIATreeWalker.currentElement = focus
if !g_searchUI_UIATreeWalker.gotoParent() return false endIf
return g_searchUI_UIATreeWalker.currentElement.automationId == AutomationID_ScopeTilesList
EndFunction

void function CaretMovedEvent( int movementUnit,optional int source)
;using Up/DownArrow to change the selected item in the list while in the search edit field causes CaretMovedEvent to fire:
if IsMovingByLine(movementUnit)
	;Do not call function IsFocusSearchTextBox here,
	;since a collision with the function being called by another event may occur.
	;This in turn will cause an unknown function call to be generated,
	;along with most likely a failure to detect that this is the focus search textbox.
	if GetObjectSubtypeCode() == wt_edit
	&& GetObjectRole() == ROLE_SYSTEM_TEXT
		;We will get a richer set of data from the UIA automation event then by speaking with SayLine:
		return
	endIf
endIf
CaretMovedEvent( movementUnit,source)
EndFunction

int function SayByTypeForScriptSayLine()
if GetObjectRole(0) == ROLE_SYSTEM_PAGETAB
	;Speak the name, but don't speak the URL value:
	IndicateControlType(wt_TabControl, GetObjectName(),cmsgsilent)
	return true
endIf
return SayByTypeForScriptSayLine()
EndFunction

Script SayNextLine()
SearchResultsUpDownNavDir = SearchResultsUpDownNavDir_Next
var	int bMoved = NextLine()
if IsFocusSearchTextBox() return endIf
SayLineUnit(UnitMove_Next,bMoved)
EndScript

Script SayPriorLine ()
SearchResultsUpDownNavDir = SearchResultsUpDownNavDir_Prior
var int bMoved = PriorLine()
if IsFocusSearchTextBox() return endIf
SayLineUnit(UnitMove_Prior,bMoved)
EndScript

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
var int subtypeCode = getObjectSubtypeCode (FALSE, nLevel)
if nLevel > 0
	if subtypeCode == wt_dialog_page
		if GetObjectClassName(nLevel) == cwcIEServer
			;The name of this pane is an URL which is verbal clutter:
			return
		endIf
	endIf
endIf ;debug
;GetObjectRole is more reliable here for detecting a tab control than is GetObjectSubtypeCode:
if subtypeCode == wt_TABCONTROL
|| GetObjectRole(nLevel) == ROLE_SYSTEM_PAGETAB
	var string name = GetObjectName(false,nLevel)
	if ! name then return sayObjectTypeAndText (nLevel, includeContainerName) endIf
	;SayObjectTypeAndText speaks both the name and value,
	;but we don't want to announce the URL value:
	if nLevel > 0 then
	; where tab control functions as group name:
		say (name, OT_CONTROL_NAME)
	else
		;SayObjectTypeAndText speaks both the name and value,
		;but we don't want to announce the URL value:
		IndicateControlType(wt_TabControl, name,cmsgSilent)
	endIf
		return
endIf
SayObjectTypeAndText(nLevel, includeContainerName)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgSearchUIAppName)
EndScript

int function BrailleAddObjectDescription(int nSubtype)
if nSubtype == wt_edit
	if IsFocusSearchTextBox()
	&& g_searchUI_AutomationEventElement
		var string s
		if g_searchUI_AutomationEventGroupName
			s = FormatString("%1 %2",
				g_searchUI_AutomationEventGroupName,
				g_searchUI_AutomationEventElement.name)
		else
			s = g_searchUI_AutomationEventElement.name
		endIf
		BrailleAddString(s,0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectDescription(nSubtype)
EndFunction

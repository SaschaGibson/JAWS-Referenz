;Copyright 2018 Freedom Scientific, Inc.
;Freedom Scientific script file for Windows 10 Feedback Hub

import "touch.jsd"

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "common.jsm"
include "TutorialHelp.jsm"
include "WindowsFeedbackHub.jsm"

const
	UIAClass_ListViewItem = "ListViewItem",
	UIAClass_GridViewItem = "GridViewItem",
	UIAClass_Popup = "Popup",
	UIAClass_ToggleMenuFlyOutItem = "ToggleMenuFlyOutItem",
	UIAAutomationID_NavBarItems = "NavBarItems",
	UIAAutimationID_CategoryFlyOutListView = "CategoryFlyOutListView",
	UIAAutomationID_SearchPivot = "SearchPivot",
	UIAFrameworkID_MicrosoftEdge = "MicrosoftEdge"

const
	FeedbackHub_EventPrefix = "FeedbackHub"
globals
	object fsUIA_FeedbackHub,
	object treewalker_FeedbackHub,
	object UIA_Focus,
	int FeedbackHub_processID


void function AutoStartEvent()
;MicrosoftEdge scripts load when focus moves into a web page,
;such as is found in the Announcements area of Feedback Hub.
;In MicrosoftEdge.jss we detect the switch in AutoStart by comparing the application returned by GetMetroAppName,
;and if the application is Microsoft.WindowsFeedbackHub we announce "entering wep page".
;When focus returns to this configuration, we detect it by comparing the prior configuration and relationship of the prior focus to the focus windows here.
;If we find that these scripts loaded due to focus moving from the web page area,
;we notify the user that they are leaving the web page:
if globalPrevConfiguration  == "MicrosoftEdge"
&& GetParent(GlobalPrevFocus) == GetFocus()
	Say(msgLeavingWebPage,ot_control_type)
endIf
InitFeedbackHubUIA()
EndFunction

void function AutoFinishEvent()
fsUIA_FeedbackHub = Null()
treewalker_FeedbackHub = Null()
UIA_Focus = Null()
EndFunction

void function InitFeedbackHubUIA()
fsUIA_FeedbackHub = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !ComAttachEvents(fsUIA_FeedbackHub,FeedbackHub_EventPrefix )
|| !fsUIA_FeedbackHub.AddFocusChangedEventHandler()
	fsUIA_FeedbackHub = Null()
	return
endIf
treewalker_FeedbackHub = fsUIA_FeedbackHub.RawViewWalker()
var object element = fsUIA_FeedbackHub.GetElementFromHandle(GetFocus())
FeedbackHub_processID = element.processID
var object condition = fsUIA_FeedbackHub.CreateBoolPropertyCondition(UIA_HasKeyboardFocusPropertyId, UIATrue)
while element
	UIA_Focus = element.BuildUpdatedCache()
	element = element.FindFirst(TreeScope_descendants, condition )
endWhile
EndFunction

void function FeedbackHubFocusChangedEvent (object element)
if element.processID == FeedbackHub_processID
	UIA_Focus = element
endIf
EndFunction

int function IsFocusOnButtonListItem()
if UserBufferIsActive()
|| UIA_Focus.controlType != UIA_ButtonControlTypeID
	return false
endIf
treewalker_FeedbackHub.currentElement = UIA_Focus
treewalker_FeedbackHub.gotoParent()
return treewalker_FeedbackHub.currentElement.controlType == UIA_ListItemControlTypeID
EndFunction

string function GetButtonListItemPositionInGroup()
if !IsFocusOnButtonListItem() return cscNull endIf
treewalker_FeedbackHub.currentElement = UIA_Focus
treewalker_FeedbackHub.gotoParent()
var
	int x = treewalker_FeedbackHub.currentElement.positionInSet,
	int y = treewalker_FeedbackHub.currentElement.sizeOfSet
if !(x || y) return cscNull endIf
return FormatString(cmsgPosInGroup1, IntToString(x), IntToString(y))
EndFunction

int function IsFocusOnTabItem()
return !UserBufferIsActive()
	&& UIA_Focus.controlType == UIA_TabItemControlTypeID
EndFunction

string function GetTabItemPositionInGroup()
if !IsFocusOnTabItem() return cscNull endIf
treewalker_FeedbackHub.currentElement = UIA_Focus
var
	int x = treewalker_FeedbackHub.currentElement.positionInSet,
	int y = treewalker_FeedbackHub.currentElement.sizeOfSet
if !(x || y) return cscNull endIf
return FormatString(cmsgPosInGroup1, IntToString(x), IntToString(y))
EndFunction

int function IsFocusOnListItemWithSelectableState()
;Some list items require that space or Enter be used to move the selection to the focused item:
if UserBufferIsActive()
|| UIA_Focus.controlType != UIA_ListItemControlTypeID
|| UIA_Focus.className != UIAClass_ListViewItem
	return false
endIf
;Some lists where selection after navigation requires space are detectable via the list's automationID,
;but some lists have no automationID.
;The lists of this type with no automationID can be detected as descendants of a popup window:
treewalker_FeedbackHub.currentElement = UIA_Focus
treewalker_FeedbackHub.gotoParent()
if treewalker_FeedbackHub.currentElement.automationID == UIAAutomationID_NavBarItems 
|| treewalker_FeedbackHub.currentElement.automationID == UIAAutimationID_CategoryFlyOutListView 
	return true
endIf
treewalker_FeedbackHub.gotoParent()
treewalker_FeedbackHub.gotoParent()
treewalker_FeedbackHub.gotoParent()
return treewalker_FeedbackHub.currentElement.className == UIAClass_Popup
EndFunction

int function ShouldSayFocusedListItemSelectedState()
;We want to speak the selected state of list items only for those lists 
;where navigation in the list does not cause the selected item to move.
return IsFocusOnListItemWithSelectableState()
	&& UIA_Focus.GetSelectionItemPattern().isSelected
EndFunction

int function IsFocusOnGridViewListItem()
return !UserBufferIsActive()
	&& UIA_Focus.controlType == UIA_ListItemControlTypeID
	&& UIA_Focus.className == UIAClass_GridViewItem 
EndFunction

Int Function IsFocusOnCheckableFlyOutMenuItem()
return !UserBufferIsActive()
	&& UIA_Focus.controlType == UIA_MenuItemControlTypeID
	&& UIA_Focus.className == UIAClass_ToggleMenuFlyOutItem
EndFunction

int function IsFocusOnSearchPivotTab()
if UserBufferIsActive()
|| UIA_Focus.controlType != UIA_TabItemControlTypeID
	return false
endIf
treewalker_FeedbackHub.currentElement = UIA_Focus
treewalker_FeedbackHub.gotoParent()
return treewalker_FeedbackHub.currentElement.automationID == UIAAutomationID_SearchPivot
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if nLevel == 0
	if IsFocusOnCheckableFlyOutMenuItem()
		;we want to say the state regardless of its check status,
		;where the default only speaks the state if it is checked.
		IndicateControlType(wt_Menu,GetObjectName())
		Say(GetToggleString( UIA_Focus),ot_item_state)
		return
	elif ShouldSayFocusedListItemSelectedState()
		Say(GetObjectState(),ot_item_state)
		;continue to allow default to say object type and state
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
if nLevel == 0
	var string positionText
	if IsFocusOnButtonListItem()
		positionText = GetButtonListItemPositionInGroup()
	elif IsFocusOnTabItem()
		positionText = GetTabItemPositionInGroup()
	endIf
	if positionText
		Say(positionText, ot_position)
	endIf
endIf
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if ShouldSayFocusedListItemSelectedState()
	Say(GetObjectState(),ot_item_state)
EndIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if hObj == GetFocus() 
&& IsFocusOnListItemWithSelectableState()
	IndicateControlState(iObjType, nChangedState)
	return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
;When the frameworkID changes to MicrosoftEdge, the Microsoft Edge scripts load.
;When this happens, we do not want to announce the ancestors of the focusable page:
if UIA_Focus.frameworkID == UIAFrameworkID_MicrosoftEdge 
	;Note that due to timing, this condition does not always come true just before the switch to MicrosoftEdge scripts.
	return
endIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
EndFunction

int function SayByTypeForScriptSayLine()
if ShouldSayFocusedListItemSelectedState()
|| IsFocusOnButtonListItem()
	SayObjectTypeAndText()
	return true
elif IsFocusOnTabItem()
	;SayObjectTypeAndText does not announce the selected status of the tab.
	;Because the selection status changes as focus moves to each tab,
	;we prefer that selection status not be announced as each tab gains focus.
	;For SayLine, though, we use SayLine to announce the selected status:
	SayLine()
	var string positionText = GetTabItemPositionInGroup()
	if positionText
		Say(positionText, ot_position)
	endIf
	return true
EndIf
return SayByTypeForScriptSayLine()
EndFunction

script SayLine()
if IsPCCursor()
&& GlobalMenuMode
&& IsFocusOnCheckableFlyOutMenuItem()
	;Because the menu is active, function SayByTypeForScriptSayLine is not reached:
	SayObjectTypeAndText()
	return
endIf
PerformScript SayLine()
EndScript

string function GetCustomTutorMessage()
if IsFocusOnButtonListItem()
	return msgListBox
elif IsFocusOnListItemWithSelectableState()
	return msgTutorialHelpForSelectableListItems
elif IsFocusOnGridViewListItem()
	return msgTutorialHelpGrid
elif IsFocusOnCheckableFlyOutMenuItem()
	return msgTutorialHelpCheckableFlyOutMenuItem
elif IsFocusOnSearchPivotTab()
	return msgTutorialHelpSearchPivotTab
endIf
return GetCustomTutorMessage()
EndFunction

string function GetBrailleStateStringForCheckableFlyOutMenuItem()
var object pattern = UIA_Focus.GetTogglePattern()
if !pattern return Null() endIf
if pattern.ToggleState == 1
	return BrailleGetStateString(CTRL_CHECKED )
else ;== 0
	return BrailleGetStateString(CTRL_UNCHECKED)
endIf
EndFunction

int function BrailleAddObjectState(int subtype)
if subtype == wt_menu
&& IsFocusOnCheckableFlyOutMenuItem()
	;We want this component to show regardless of the current state:
	BrailleAddString(GetBrailleStateStringForCheckableFlyOutMenuItem(), GetCursorCol(), GetCursorRow(), 0)
	return true
endIf
return BrailleAddObjectState(subtype)
EndFunction

int function BrailleAddObjectPosition(int subtype)
var string positionText
if subtype == wt_button
	positionText = GetButtonListItemPositionInGroup()
elif subtype == wt_tabControl
	positionText = GetTabItemPositionInGroup()
endIf
if positionText
	BrailleAddString(positionText, 0,0,0)
	return true
endIf
return BrailleAddObjectPosition(subtype)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgWindowsFeedbackHubCfgName)
EndScript

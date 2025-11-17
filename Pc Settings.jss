; Copyright 2012-2024 by Freedom Scientific, Inc.
; Freedom Scientific script files for Windows 10 PC Settings configuration


include "HJConst.jsh"
include "MSAAConst.jsh"
include "UIA.jsh"
include "HJGlobal.jsh"
include "Common.jsm"
include "PC Settings.jsm"

const
;object class names and automation ID's:
	ClassName_ApplicationFrameWindow = "ApplicationFrameWindow",
	ClassName_TextBlock = "TextBlock",
	ClassName_TextBox = "TextBox",
	ClassName_ToggleSwitch = "ToggleSwitch",
	ClassName_LoopingSelector = "LoopingSelector",
	ClassName_ListViewItem = "ListViewItem",
	className_ComboBoxItem = "ComboBoxItem",
	className_GridViewItem = "GridViewItem",
	AutomationID_SettingsAppTitle = "SettingsAppTitle",
	AutomationID_PagesListView = "PagesListView",
	AutomationID_PageTitle = "PageTitle",
	AutomationID_PageTitle2 = "pageTitle",  ;Note the different in case between AutomationID_PageTitle2 and AutomationID_PageTitle
	AutomationID_SearchAutoSuggestBox = "SearchAutoSuggestBox",
	AutomationID_PageGroupsListView = "PageGroupsListView",
	AutomationID_SystemSettings_Display_BlueLight_AutomaticOnScheduleWithTime_ToggleSwitch = "SystemSettings_Display_BlueLight_AutomaticOnScheduleWithTime_ToggleSwitch",
	AutomationID_SystemSettings_MusUpdate_AvailableUpdatesList_ListView = "SystemSettings_MusUpdate_AvailableUpdatesList_ListView",
	AutomationID_SystemSettings_MusUpdate_AvailableUpdatesList2_ListView = "SystemSettings_MusUpdate_AvailableUpdatesList2_ListView",
	automationID_0_ApplicableUpdate_prefix = "0_ApplicableUpdate_",
	automationID_ContextDescriptionTextBlock_Suffix = "_ContextDescriptionTextBlock"

;for error handling if we are unable to get the toggle state of a toggle switch:
const	ToggleState_Error = 0xffffffff

;Values for optional parameters to functions:
const
	SayItemStateOnly = 1

;Collection info for focus item data:
const
;types of focusable items:
	CustomType_Unknown = 0,
	CustomType_SearchBox = 1,
	CustomType_ToggleSwitch = 2,
	customType_LoopingSelector = 3,
	CustomType_NavigationListViewItem = 4,
	CustomType_UpdatesList = 5,
	CustomType_UpdatesListItem = 6,
	CustomType_PageGroupsListView = 7
globals
	collection c_FocusItemData

;For detecting the search suggestion,
;and scheduling announcement of search box suggestion count:
const
	PCSettings_EventNamePrefix = "PCSettings",
	SaySearchResultsCount_Delay = 5  ;tenths of a second
globals
	object fsUIA_PCSettings_SuggestionBox_Listener,
	collection c_SuggestionBox  ;Contains globals related to managing suggestion results
		; Members are:
		; int scheduledSaySearchResultsCount -- ScheduleID for announcing results count changes when editing the search
		; int ResultsSize -- Most recent size of set for the results list

;for live region changes:
const
	LiveRegion_EventNamePrefix = "LiveRegion"
globals
	object fsUIA_PCSettings_LiveRegion_Listener,
	string Prev_WindowsUpdate_LiveRegion_Text

;General app UIA globals:
Globals
	object fsUIA_PCSettings,
	object fsUIA_PCSettings_Treewalker,
	int giScheduledSayRadioButtonState


void function AutoStartEvent()
if (!c_FocusItemData) c_FocusItemData = new collection EndIf
if (!c_SuggestionBox) c_SuggestionBox = new collection endIf
InitPCSettingsUIA()
EndFunction

void function AutoFinishEvent()
fsUIA_PCSettings = Null()
fsUIA_PCSettings_Treewalker = Null() 
fsUIA_PCSettings_LiveRegion_Listener = Null()
fsUIA_PCSettings_SuggestionBox_Listener = Null()
CollectionRemoveAll(c_FocusItemData)
collectionRemoveAll(c_SuggestionBox)
Prev_WindowsUpdate_LiveRegion_Text = cscNull
EndFunction

int function InitPCSettingsFSUIAAndTreewalker()
if (fsUIA_PCSettings && fsUIA_PCSettings_Treewalker) return true endIf
fsUIA_PCSettings = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if (!fsUIA_PCSettings) return false endIf
var object element = fsUIA_PCSettings.GetFocusedElement()
var object condition = fsUIA_PCSettings.CreateIntPropertyCondition(UIA_ProcessIdPropertyId, element.ProcessID)
fsUIA_PCSettings_Treewalker = fsUIA_PCSettings.CreateTreeWalker(condition)
if !fsUIA_PCSettings_Treewalker
	fsUIA_PCSettings = Null()
	return false
endIf
return true
EndFunction

object function GetPCSettingsAppElement()
if !(fsUIA_PCSettings && fsUIA_PCSettings_Treewalker) return Null() endIf
var object element = fsUIA_PCSettings.GetFocusedElement().BuildUpdatedCache()
fsUIA_PCSettings_Treewalker.currentElement = element
while fsUIA_PCSettings_Treewalker.currentElement.controlType != UIA_WindowControlTypeID
	if !fsUIA_PCSettings_Treewalker.gotoParent() return Null() endIf
endWhile
return fsUIA_PCSettings_Treewalker.currentElement
EndFunction

void function InitPCSettingsUIA()
if !InitPCSettingsFSUIAAndTreewalker() return endIf
var object appElement = GetPCSettingsAppElement()
if !appElement
	fsUIA_PCSettings = Null()
	fsUIA_PCSettings_Treewalker = Null()
	return
endIf
if ComAttachEvents(fsUIA_PCSettings,PCSettings_EventNamePrefix)
	fsUIA_PCSettings.AddPropertyChangedEventHandler(UIA_NamePropertyId, appElement, treescope_descendants)
endIf
;The live region change gets its own listener and event:
if fsUIA_PCSettings_LiveRegion_Listener return endIf
fsUIA_PCSettings_LiveRegion_Listener = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if fsUIA_PCSettings_LiveRegion_Listener
&& ComAttachEvents(fsUIA_PCSettings_LiveRegion_Listener,LiveRegion_EventNamePrefix)
	fsUIA_PCSettings_LiveRegion_Listener.AddAutomationEventHandler(UIA_LiveRegionChangedEventId, appElement, TreeScope_Descendants)
endIf
EndFunction

int function ElementIsGrandChildOfWindowsUpdatesList(object element)
fsUIA_PCSettings_Treewalker.currentElement = element
fsUIA_PCSettings_Treewalker.gotoParent()
fsUIA_PCSettings_Treewalker.gotoParent()
var string automationID = fsUIA_PCSettings_Treewalker.currentElement.automationID 
return automationID == AutomationID_SystemSettings_MusUpdate_AvailableUpdatesList_ListView
|| automationID == AutomationID_SystemSettings_MusUpdate_AvailableUpdatesList2_ListView
EndFunction

void function LiveRegionAutomationEvent(object element, int eventID)
;This automation event handler is designed for exclusively managing the live region changes.
;Use events attached to the main UIA event handlers for other automation events.
if element.isOffscreen
|| !element.name
	return
endIf
;When checking for Windows Updates, the chatter can become excessively spammy.
;Limit the live region announcement to when the updates list is in focus:
if ElementIsGrandChildOfWindowsUpdatesList(element)
	;In the Windows update list, a live region fires for two separate elements. One contains the list item name, and one does not. 
	;We don't want both, and since the focus keeps reverting to the list rather than staying on a list item
	;we opt to speak the element with the list item name details.
	;We also try to filter out messages which duplicate the most recently spoken text.
	if C_FocusItemData.CustomType == CustomType_UpdatesList
	|| C_FocusItemData.CustomType == CustomType_UpdatesListItem
		if StringContains(element.automationID, automationID_0_ApplicableUpdate_prefix)
		&& element.name != Prev_WindowsUpdate_LiveRegion_Text
			if FSUIAGetParentOfElement(element).SizeOfSet > 1
				if !StringContains(element.automationID, automationID_ContextDescriptionTextBlock_Suffix)
					Say(element.name,ot_JAWS_message)
				endIf
			else ;only one item in the list, so announce the live region element without the list item name:
				if StringContains(element.automationID, automationID_ContextDescriptionTextBlock_Suffix)
					Say(element.name,ot_JAWS_message)
				endIf
			endIf
			Prev_WindowsUpdate_LiveRegion_Text = element.name
		endIf
	endIf
	;Don't spam everywhere else:
	return
endIf
if c_FocusItemData.listeningForSearchSuggestions
&& c_SuggestionBox.scheduledSaySearchResultsCount
	;When searching in the suggestion box,
	;a live region event occurs if there are no results for a typed in search term.
	;However, if all text is deleted from the search box no live region event occurs.
	;we want to cancel the scheduled announcement of SayResultsCount,
	;but we must update the suggestion box collection variables and refresh the braille.
	UnscheduleFunction(c_SuggestionBox.scheduledSaySearchResultsCount)
	c_SuggestionBox.scheduledSaySearchResultsCount = 0
	c_SuggestionBox .ResultsSize = 0
	C_FocusItemData.brlSuggestion = element.name
	BrailleRefresh()
endIf
	Say(element.name,ot_JAWS_message)
EndFunction

int function TreewalkerGotoAncestorWindow()
InitPCSettingsFSUIAAndTreewalker()
if (fsUIA_PCSettings_Treewalker.currentElement.controlType == UIA_WindowControlTypeID) return True endIf
var object element = fsUIA_PCSettings.GetFocusedElement().BuildUpdatedCache()
if !element	return false endIf
fsUIA_PCSettings_Treewalker.currentElement = element
if (fsUIA_PCSettings_Treewalker.currentElement.controlType == UIA_WindowControlTypeID) return True endIf
while fsUIA_PCSettings_Treewalker.GotoParent() 
	if (fsUIA_PCSettings_Treewalker.currentElement.controlType == UIA_WindowControlTypeId) return True endIf
endWhile
return fsUIA_PCSettings_Treewalker.currentElement.controlType == UIA_WindowControlTypeId
EndFunction

Object function FindSelectedSuggestionElement(object list)
if !list return Null() endIf
var object condition = fsUIA_PCSettings_SuggestionBox_Listener.createBoolPropertyCondition(UIA_SelectionItemIsSelectedPropertyId, UIATrue)
if !condition return Null() endIf
return list.FindFirst(TreeScope_Subtree, condition)
EndFunction

void function SaySelectedItemInSuggestionList()
var object suggestion = FindSelectedSuggestionElement(c_FocusItemData.suggestionList )
if !suggestion return endIf
say(suggestion.name, OT_CONTROL_NAME)
C_FocusItemData.brlSuggestion = suggestion.name
BrailleRefresh()
EndFunction

void function SaySearchResultsCount()
c_SuggestionBox.scheduledSaySearchResultsCount = 0
var object element = fsUIA_PCSettings.GetFocusedElement().buildUpdatedCache()
if !element
	return
endIf
var string resultsFound
if element.controllerFor.count == 0
	if c_SuggestionBox .ResultsSize == 0 return endIf
	c_SuggestionBox .ResultsSize = 0
	resultsFound = msgSettingsSearchNoResults
else
	fsUIA_PCSettings_Treewalker.currentElement = element.controllerFor(0)
	if !fsUIA_PCSettings_Treewalker.GotoFirstChild() return endIf
	var int size = fsUIA_PCSettings_Treewalker.currentElement.sizeOfSet
	if size == c_SuggestionBox .ResultsSize return endIf
	c_SuggestionBox .ResultsSize = size
	if size
		resultsFound = FormatString(msgSettingsSearchNumberOfResults,size)
	endIf
endIf
Say(resultsFound,ot_screen_message)
C_FocusItemData.brlSuggestion = resultsFound
BrailleRefresh()
EndFunction

int function ManageSearchBoxEventListener()
fsUIA_PCSettings_SuggestionBox_Listener = Null()
CollectionRemoveAll(c_SuggestionBox )
if (C_FocusItemData.CustomType != CustomType_SearchBox) return false endIf
fsUIA_PCSettings_SuggestionBox_Listener = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !comAttachEvents(fsUIA_PCSettings_SuggestionBox_Listener,PCSettings_EventNamePrefix) return false endIf
var object element = fsUIA_PCSettings_SuggestionBox_Listener.GetFocusedElement().buildUpdatedCache()
fsUIA_PCSettings_SuggestionBox_Listener.AddPropertyChangedEventHandler(UIA_ControllerForPropertyId, 		element, TREESCOPE_ELEMENT)
if element.controllerFor.count
	element = element.controllerFor(0)
	StartListeningForSuggestionListResultsAndSelectionChange(element)
endIf
fsUIA_PCSettings_SuggestionBox_Listener.AddAutomationEventHandler(UIA_Text_TextChangedEventId, element, TREESCOPE_SUBTREE)
;Do not call SaySelectedItemInSuggestionList or SaySearchResultsCount here,
;it will cause the selected item to be announced before the focus change is announced.
;SaySelectedItemInSuggestionList is called from SayObjectTypeAndText.
return true
EndFunction

void function StartListeningForSuggestionListResultsAndSelectionChange(object list)
;Listen for selection change when arrowing through the list:
fsUIA_PCSettings_SuggestionBox_Listener.AddAutomationEventHandler(UIA_SelectionItem_ElementSelectedEventId, list, TREESCOPE_SUBTREE)
fsUIA_PCSettings_SuggestionBox_Listener.AddAutomationEventHandler(UIA_SelectionItem_ElementRemovedFromSelectionEventId, list, TREESCOPE_SUBTREE)
;Set needed globals:
c_FocusItemData.listeningForSearchSuggestions = true
c_FocusItemData.suggestionList = list
EndFunction

void function PCSettingsPropertyChangedEvent(object element, int propertyID, variant newValue)
if PropertyID == UIA_ControllerForPropertyId then
	if c_SuggestionBox.scheduledSaySearchResultsCount
		UnscheduleFunction(c_SuggestionBox.scheduledSaySearchResultsCount)
		c_SuggestionBox.scheduledSaySearchResultsCount = 0
	endIf
	c_SuggestionBox.scheduledSaySearchResultsCount = ScheduleFunction("SaySearchResultsCount",SaySearchResultsCount_Delay)
	var object suggestionList = element.controllerFor(0)
	if !suggestionList return endIf
	if !c_FocusItemData.listeningForSearchSuggestions
		StartListeningForSuggestionListResultsAndSelectionChange(suggestionList)
	endIf
elif PropertyID == UIA_NamePropertyId
	if element.controlType == UIA_ListItemControlTypeID
	&& element.className == className_ComboBoxItem
		;The JAWS ValueChangedEvent in comboboxes fires too early.
		;We need to call UIARefresh to allow JAWS to get the current combobox value, or combobox item name:
		UIARefresh()
		BrailleRefresh()
	endIf
endIf
endFunction

void function PCSettingsAutomationEvent( object element, int eventID )
if c_SuggestionBox.ScheduledSaySelectedItem
	UnscheduleFunction(c_SuggestionBox.ScheduledSaySelectedItem)
	c_SuggestionBox.ScheduledSaySelectedItem = 0
endIf
var object suggestion
if eventID == UIA_SelectionItem_ElementSelectedEventId
	say(element.name, OT_CONTROL_NAME)
	C_FocusItemData.brlSuggestion = element.name
	BrailleRefresh()
elif eventID == UIA_SelectionItem_ElementRemovedFromSelectionEventId
	var object treewalker = fsUIA_PCSettings_SuggestionBox_Listener.RawViewWalker()
	treewalker.currentElement = element
	treewalker.gotoParent()
	suggestion = FindSelectedSuggestionElement(treewalker.currentElement)
	if !suggestion
		SayLine()
		C_FocusItemData.brlSuggestion = cscNull
		BrailleRefresh()
	endIf
elif eventID == UIA_Text_TextChangedEventId
	if c_SuggestionBox.scheduledSaySearchResultsCount
		UnscheduleFunction(c_SuggestionBox.scheduledSaySearchResultsCount)
		c_SuggestionBox.scheduledSaySearchResultsCount = 0
	endIf
	c_SuggestionBox.scheduledSaySearchResultsCount = ScheduleFunction("SaySearchResultsCount",SaySearchResultsCount_Delay)
endIf
EndFunction

int function SayPageGroupsListViewItem(optional int AnnouncePosition)
if C_FocusItemData.CustomType != CustomType_PageGroupsListView return false endIf
if AnnouncePosition
	default::SayObjectTypeAndText()
else
	Say(GetObjectName(),ot_control_name)
endIf
;Announce the text describing the type of items for the page belonging to this list item:
if C_FocusItemData.description 
	Say(C_FocusItemData.description ,ot_smart_help)
endIf
return true
EndFunction

int function GetStateForItemData(object element)
element = element.BuildUpdatedCache()
var object pattern = element.GetTogglePattern()
if !pattern
	return ToggleState_Error 
else
	return pattern.ToggleState
endIf
EndFunction

int function SayToggleSwitch(optional int OnStateChange)
if C_FocusItemData.CustomType != customType_ToggleSwitch return false endIf
var object element = c_FocusItemData.element.BuildUpdatedCache()
if !OnStateChange
	IndicateControlType(wt_button,element.name,cmsgSilent)
endIf
C_FocusItemData.state = GetStateForItemData(element)
if C_FocusItemData.state == ToggleState_On
	Say(c_FocusItemData.On,ot_item_state)
elif C_FocusItemData.state == ToggleState_Off
	Say(c_FocusItemData.Off,ot_item_state)
endIf
return true
EndFunction

int function SayLoopingSelectorListAndSelectedListItem()
if C_FocusItemData.CustomType != customType_LoopingSelector return false endIf
var object element = c_FocusItemData.element.BuildUpdatedCache()
IndicateControlType(wt_list,element.name)
var int condition = fsUIA_PCSettings.createBoolPropertyCondition(UIA_SelectionItemIsSelectedPropertyId, UIATrue)
if !condition return endIf
var object SelectedItem = element.findFirst(TreeScope_Subtree, condition)
if !SelectedItem return endIf
Say(SelectedItem.name,ot_line)
if SelectedItem.positionInSet > 0
&& SelectedItem.sizeOfSet > 0
	Say(FormatString(cmsgPosInGroup1, SelectedItem.positionInSet, SelectedItem.sizeOfSet), ot_position)
endIf
return true
EndFunction

int function SayNavigationListViewItem(optional int sayPosition)
if	C_FocusItemData.CustomType != CustomType_NavigationListViewItem return false endIf
if C_FocusItemData.element.GetSelectionItemPattern().isSelected
	Say(cmsg215_L,ot_selected_item)
endIf
Say(C_FocusItemData.element.name,ot_line)
if sayPosition
	Say(PositionInGroup(),ot_position)
endIf
return true
EndFunction

void function GetUIAObjectElementAndCustomType(object byRef element, int byRef Type)
InitPCSettingsFSUIAAndTreewalker()
element = fsUIA_PCSettings.GetFocusedElement().BuildUpdatedCache()
type = CustomType_Unknown
if !element return EndIf
if element.className == className_GridViewItem
	fsUIA_PCSettings_Treewalker.currentElement = element
	fsUIA_PCSettings_Treewalker.gotoParent()
	if fsUIA_PCSettings_Treewalker.currentElement .AutomationId == AutomationID_PageGroupsListView
		type = CustomType_PageGroupsListView
		return
	endIf
elif element.className == ClassName_TextBox
	fsUIA_PCSettings_Treewalker.currentElement = element
	fsUIA_PCSettings_Treewalker.gotoParent()
	if fsUIA_PCSettings_Treewalker.currentElement .AutomationId == AutomationID_SearchAutoSuggestBox
		type = CustomType_SearchBox
		return
	endIf
elif element.className == ClassName_ToggleSwitch
	type = CustomType_ToggleSwitch
	return
elif element.className == ClassName_LoopingSelector
	type = CustomType_LoopingSelector
	return
elif element.className == ClassName_ListViewItem
	fsUIA_PCSettings_Treewalker.currentElement = element
	fsUIA_PCSettings_Treewalker.gotoParent()
	if fsUIA_PCSettings_Treewalker.currentElement.automationId == AutomationID_SystemSettings_MusUpdate_AvailableUpdatesList_ListView
	|| fsUIA_PCSettings_Treewalker.currentElement.automationId == AutomationID_SystemSettings_MusUpdate_AvailableUpdatesList2_ListView
		type = CustomType_UpdatesListItem
		return
	EndIf
	if (fsUIA_PCSettings_Treewalker.currentElement.controlType == UIA_GroupControlTypeID) fsUIA_PCSettings_Treewalker.gotoParent() endIf
	if fsUIA_PCSettings_Treewalker.currentElement.landmarkType == UIA_NavigationLandmarkTypeId
		type = CustomType_NavigationListViewItem 
		return
	endIf
elif element.automationId == AutomationID_SystemSettings_MusUpdate_AvailableUpdatesList_ListView
|| element.automationId == AutomationID_SystemSettings_MusUpdate_AvailableUpdatesList2_ListView
	type = CustomType_UpdatesList 
	return
EndIf
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var int nType = GetObjectSubtypecode(true,nLevel)
if nLevel == 0
	if SayPageGroupsListViewItem(true)
		return
	endIf
	if nType == wt_edit
	&& C_FocusItemData.CustomType == CustomType_SearchBox 
		SayObjectTypeAndText()
		SaySearchResultsCount()
		SaySelectedItemInSuggestionList()
		return
	elif nType == wt_button
	&& C_FocusItemData.CustomType == CustomType_ToggleSwitch
		SayToggleSwitch()
		return
	elif nType == wt_ListBox
	&& C_FocusItemData.CustomType == CustomType_LoopingSelector
		SayLoopingSelectorListAndSelectedListItem()
		return
	elif nType == wt_ListBoxItem
	&& C_FocusItemData.CustomType == CustomType_NavigationListViewItem
		SayNavigationListViewItem(true)
		return
	elif nType == WT_RadioButton
	IndicateControlType (WT_RadioButton, C_FocusItemData.element.name)
		SayRadioButtonState ()
		return
	EndIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
if nLevel == 0
	if nType == wt_ListBoxItem
	&& C_FocusItemData.CustomType == CustomType_UpdatesListItem
		fsUIA_PCSettings_Treewalker.currentElement = fsUIA_PCSettings.GetFocusedElement().BuildUpdatedCache()
		if fsUIA_PCSettings_Treewalker.gotoFirstChild()
		&& fsUIA_PCSettings_Treewalker.gotoNextSibling()
		&& fsUIA_PCSettings_Treewalker.gotoNextSibling()
			Say(fsUIA_PCSettings_Treewalker.currentElement.name,ot_screen_message)
		endIf
	endIf
endIf
EndFunction

void function UpdateFocusItemData()
CollectionRemoveAll(c_FocusItemData)
var object element, int customType
GetUIAObjectElementAndCustomType(element,customType)
C_FocusItemData.element = element
C_FocusItemData.CustomType = customType
ManageSearchBoxEventListener()
if customType == CustomType_PageGroupsListView
	fsUIA_PCSettings_Treewalker.currentElement = element
	if fsUIA_PCSettings_Treewalker.gotoFirstChild()
		var object currentElement = fsUIA_PCSettings_Treewalker.currentElement
		while fsUIA_PCSettings_Treewalker.gotoNextSibling()
			currentElement = fsUIA_PCSettings_Treewalker.currentElement
		endWhile
		if currentElement.name != element.name
			C_FocusItemData.description = currentElement.name
		endIf
	endIf
elif CustomType == CustomType_ToggleSwitch
	var int x, int y
	element.GetClickablePoint( intRef(x), intRef(y))
	C_FocusItemData.clickX = x
	C_FocusItemData.clickY = y
	C_FocusItemData.state = GetStateForItemData(element)
	;The text elements for the state will precede the thumb element,
	;but the number of items which exist prior to the state text elements may vary.
	;So we find the thumb element and then get the text from the two prior elements.
	;
	;Normally FindFirst would be used to find a single child element.
	;FindFirst fails to find the thumb element,
	;and FindAll also fails to find it.
	;So we must walk through the children to get to the thumb element.
	var int found
	fsUIA_PCSettings_Treewalker.currentElement = element
	fsUIA_PCSettings_Treewalker.GotoFirstChild()
	while !found && fsUIA_PCSettings_Treewalker.GoToNextSibling()
		if (fsUIA_PCSettings_Treewalker.currentElement.controlType == UIA_ThumbControlTypeId) found = true endIf
	endWhile
	if (fsUIA_PCSettings_Treewalker.currentElement.controlType != UIA_ThumbControlTypeId) return endIf
	;Now back up and get the text for the states:
	fsUIA_PCSettings_Treewalker.gotoPriorSibling()
	C_FocusItemData.On = fsUIA_PCSettings_Treewalker.currentElement.name
	fsUIA_PCSettings_Treewalker.gotoPriorSibling()
	C_FocusItemData.Off = fsUIA_PCSettings_Treewalker.currentElement.name
endIf
EndFunction

	void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
UpdateFocusItemData()
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if nType == wt_ListBoxItem
&& nChangeDepth == -1
	if hwndFocus != hwndPrevFocus
		return FocusChangedEventProcessAncestors(hwndFocus, hwndPrevFocus)
	else
		if C_FocusItemData.CustomType == CustomType_NavigationListViewItem
			return SayNavigationListViewItem()
		endIf
	endIf
EndIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
EndFunction

Void Function ValueChangedEvent(handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,optional int bIsFocusObject)
if bIsFocusObject
	if (C_FocusItemData.CustomType != CustomType_Unknown) UpdateFocusItemData() EndIf
EndIf
ValueChangedEvent(hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if C_FocusItemData.CustomType == CustomType_PageGroupsListView
	SayPageGroupsListViewItem(ShouldItemSpeak(OT_ANNOUNCE_POSITION_AND_COUNT))
	return
endIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

int function ToggleSwitchChangesFocusOnStateChange()
return c_FocusItemData.element.automationID == AutomationID_SystemSettings_Display_BlueLight_AutomaticOnScheduleWithTime_ToggleSwitch
EndFunction

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if hObj == GetFocus()
&& iObjType == wt_button
&& c_FocusItemData.customType == customType_ToggleSwitch
	if ToggleSwitchChangesFocusOnStateChange() return endIf
	SayToggleSwitch(SayItemStateOnly)
	return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

void function SayCharacterUnit(int UnitMovement)
if IsPCCursor()
&& !UserBufferIsActive()
&& GetObjectSubtypeCode(true) == wt_LeftRightSlider
&& GetWindowClass(GetFocus()) == cwc_DirectUIhWND
	;the ValueChangedEvent fires for these sliders,
	;so say nothing when navigating:
	return
EndIf
SayCharacterUnit(UnitMovement)
EndFunction

void function SayLineUnit(int UnitMovement,optional  int bMoved)
if IsPCCursor()
&& !UserBufferIsActive()
&& GetObjectSubtypeCode(true) == wt_LeftRightSlider
&& GetWindowClass(GetFocus()) == cwc_DirectUIhWND
	;This may be a focus change from a prior control to the slider.
	;And, the ValueChangedEvent fires for these sliders,
	;so say nothing when navigating:
	return
EndIf
SayLineUnit(UnitMovement,bMoved)
EndFunction

int function SayByTypeForScriptSayLine()
if SayPageGroupsListViewItem(true)
|| SayNavigationListViewItem(true)
|| SayToggleSwitch()
	return true
endIf
if GetObjectSubTypeCode() == WT_RadioButton
	IndicateControlType (WT_RadioButton, C_FocusItemData.element.name)
	SayRadioButtonState()
	return true
endIf
return SayByTypeForScriptSayLine()
EndFunction

int function ContractedBrailleInputAllowedNow ()
if C_FocusItemData.CustomType == CustomType_SearchBox then return FALSE endIf
return ContractedBrailleInputAllowedNow ()
endFunction

int function BrailleAddObjectState(int nSubtype)
if nSubtype == wt_button
&& c_FocusItemData.customType == customType_ToggleSwitch
	var int state = GetStateForItemData(c_FocusItemData.element)
	var string stateString
	if state == ToggleState_On
		stateString = c_FocusItemData.On
	elif state == ToggleState_Off
		stateString = c_FocusItemData.Off
	endIf
	BrailleAddString(stateString,c_FocusItemData.clickX,c_FocusItemData.clickY,attrib_highlight)
	return true
elIf nSubtype == wt_RadioButton
	SuppressG2TranslationForNextStructuredModeSegment()
	if GetStateForRadioButton(C_FocusItemData.element) == CTRL_UNCHECKED
		BrailleAddString(BrailleGetStateString(CTRL_UNCHECKED),GetCursorCol (), GetCursorRow (),0)
	else
		BrailleAddString(BrailleGetStateString(CTRL_CHECKED),GetCursorCol (), GetCursorRow (),0)
	endIf
	return true
endIf
return BrailleAddObjectState(nSubtype)
EndFunction

int function BrailleAddObjectDescription(int nSubtype)
if nSubtype == wt_edit
&& C_FocusItemData.CustomType == CustomType_SearchBox 
&& C_FocusItemData.brlSuggestion 
	BrailleAddString(C_FocusItemData.brlSuggestion,0,0,0)
	return true
elif C_FocusItemData.CustomType == CustomType_PageGroupsListView
&& C_FocusItemData.description 
	BrailleAddString(C_FocusItemData.description ,0,0,0)
	return true
endIf
return BrailleAddObjectDescription(nSubtype)
EndFunction

int function BrailleAddObjectValue (int subtype)
var string value
if subtype == WT_COMBOBOX then
	value = getObjectValue (TRUE)
	if !stringIsBlank (value) then
		BrailleAddString (value, 0,0,0)
		return TRUE
	endIf
endIf
return BrailleAddObjectValue (subtype)
endFunction

void function GetSettingsDialogTitle(string byRef title, string byRef subtitle)
title = cscNull
subtitle = cscNull
if !TreewalkerGotoAncestorWindow()
	;UIA failed, just report the window name:
	title = GetWindowName(GetAppMainWindow(GetFocus()))
	return
endIf
var object Window = fsUIA_PCSettings_Treewalker.currentElement
var object condition = fsUIA_PCSettings.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,AutomationID_SettingsAppTitle)
fsUIA_PCSettings_Treewalker.currentElement = Window.FindFirst(TreeScope_Children,condition)
if fsUIA_PCSettings_Treewalker.currentElement.automationId == AutomationID_SettingsAppTitle
	;This is the main page rather than a sub page:
	title = fsUIA_PCSettings_Treewalker.currentElement.name
	return
endIf
;a sub page is open:
condition = fsUIA_PCSettings.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,AutomationID_PagesListView)
fsUIA_PCSettings_Treewalker.currentElement = Window.FindFirst(TreeScope_Children,condition)
if fsUIA_PCSettings_Treewalker.currentElement.automationId == AutomationID_PagesListView
	;Is the current page the prior sibling:
	fsUIA_PCSettings_Treewalker.gotoPriorSibling()
	if fsUIA_PCSettings_Treewalker.currentElement.className == ClassName_TextBlock
		title = fsUIA_PCSettings_Treewalker.currentElement.name
	endIf
endIf
if !title
	;Since we failed to find a title, just report the title as the Settings window name:
	title = Window.name
endIf
;the automation ID for page title sometimes has a different case in its spelling:
condition = fsUIA_PCSettings.CreateOrCondition(
	fsUIA_PCSettings.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,AutomationID_PageTitle),
	fsUIA_PCSettings.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,AutomationID_PageTitle2))
fsUIA_PCSettings_Treewalker.currentElement = Window.FindFirst(TreeScope_Children,condition)
if StringLower(fsUIA_PCSettings_Treewalker.currentElement.automationID) == StringLower(AutomationID_PageTitle)
	subtitle = fsUIA_PCSettings_Treewalker.currentElement.name
endIf
EndFunction

Script SayWindowTitle()
if IsSameScript ()
	SayWindowVisualState()
	return
endIf
if IsInvalidForSayWindowTitle()
|| SayUserBufferWindowTitle()
	return
endIf
var string title, string subtitle
GetSettingsDialogTitle(title,subTitle)
if title && subtitle
	SayMessage(ot_USER_REQUESTED_INFORMATION,
		FormatString (cmsg29_L, title, subtitle),
		FormatString (cMsg29_S, title, subtitle))
else
	SayMessage(ot_USER_REQUESTED_INFORMATION,
		FormatString (cmsg27_L,title),
		FormatString (cmsg27_S,title))
endIf
EndScript

script ScriptFileName()
ScriptAndAppNames(msgPCSettingsAppName)
EndScript

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
If !KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	return false
EndIf
if GetObjectSubTypeCode () == WT_RadioButton
	if giScheduledSayRadioButtonState
		UnScheduleFunction (giScheduledSayRadioButtonState)
		giScheduledSayRadioButtonState = 0
	endIf
	if GetStateForRadioButton(C_FocusItemData.element) & CTRL_UNCHECKED
		UIARefresh()
		giScheduledSayRadioButtonState = ScheduleFunction ("SayRadioButtonState", 3, true)
		return true
	endIf
endIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Void Function SayRadioButtonState ()
C_FocusItemData.element = FSUIAGetFocusedElement()
var int iAttrib = GetStateForRadioButton(C_FocusItemData.element)
giScheduledSayRadioButtonState = 0
IndicateControlState(wt_RadioButton, iAttrib)
BrailleRefresh ()
EndFunction

int function GetStateForRadioButton(object element)
var object pattern = element.GetSelectionItemPattern()
if !pattern
	return false
elif pattern.isSelected == UIATrue
	return CTRL_CHECKED
else
	return CTRL_UNCHECKED
endIf
EndFunction

Void Function SayTutorialHelp (int iObjType,optional  int IsScriptKey)
if iObjType == WT_RADIOBUTTON then
	if GetStateForRadioButton(C_FocusItemData.element) & CTRL_UNCHECKED
		SayTutorialHelp (WT_CHECKBOX,IsScriptKey)
	endIf
	return
endIf
SayTutorialHelp (iObjType,IsScriptKey)	
EndFunction

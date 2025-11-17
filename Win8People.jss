;Copyright 2014-2015 Freedom Scientific, Inc.
;Freedom Scientific script file for Windows 8.1 People modern application


include "HJConst.jsh"
include "HJGlobal.jsh"
include "MSAAConst.jsh"
include "UIA.jsh"
include "common.jsm"
include "Win8People.jsm"
import "touch.jsd"


const
;UIA automationID strings:
	automation_idPeopleTitle = "idPeopleTitle",
	automation_idPeopleSecondaryTitle = "idPeopleSecondaryTitle",
	automation_jxc_list_prefix = "jxc",
	automation_idPeopleBack = "idPeopleBack",
	automation_asc_pageTitle = "asc_pageTitle",
	automation_modernCanvasContent = "modernCanvasContent",
	automation_layout_list = "layout-list",
	automation_twitter_prefix = "TWITR_",
	automation_facebook_prefix = "FB_",
	automation_itemCommentInput_edit = "item-comment-input",
	automation_itemCommentCount_statusBar = "item-comment-count",
	automation_ItemCommentList_list = "item-comment-list",
	automation_ItemReactionButton_listItem = "item-reaction-button",
	automation_PopupWindow_window = "Popup Window",
	automation_searchControlId_group = "searchControlId",
	automation_messageBarStatus_statusBar = "messagebar-status",
	automation_idDUIFlipView_list = "idDUIFlipView",
	automation_idRightButton = "idRightButton",
	automation_idLeftButton = "idLeftButton",
	automation_flyoutMenuItem_prefix = "flyoutMenu-Item-",
	automation_UIMenuItem_prefix = "uimenuitem_",
	automation_AllInfoCommand_link = "AllInfoCommand",
	automation_CommunicateWithCommand_Link_suffix = "Command",
	automation_LinkingListView_List = "linkingListView",
	automation_panelErrors_group = "panel-errors",
	automation_AccountItem_Prefix = "idAccountItem_",
	automation_contactViewContainer_group = "contactViewContainer",
	automation_EditContact = "displayDiv_addLinkEdit",
	automation_idTxtBx_IL_Username0_edit = "idTxtBx_IL_Username0",
	automation_idTxtBx_IL_Password0_edit = "idTxtBx_IL_Password0",
	automation_idDd_SAOTCS_Proofs_ComboBox = "IdDd_SAOTCS_Proofs",
	automation_idTxtBx_SAOTCS_ProofConfirmation_edit = "idTxtBx_SAOTCS_ProofConfirmation",
	automation_idTxtBx_SAOTCC_OTC_edit = "idTxtBx_SAOTCC_OTC",
;UIA class names:
	class_WindowsUICoreCoreWindow = "Windows.UI.Core.CoreWindow",
	class_TouchButton = "TouchButton",
;window classes:
	wc_ItemPickerWindow = "Item Picker Window",
	wc_FloatingBarHwndHost = "FloatingBarHwndHost"

;for UIA events:
const
	UIA_Win8People_EventFunctionNamePrefix = "Win8People"
globals
	object UIA_Win8People, ;has attached events for the duration of the app in focus
	object UIA_PropertyListener ;attach events for short-term event listening

;default length of text retrieved by GetTextInRange:
const
	GetTextInRangeMaxLength = 100

;Delay times used by UIA events to schedule functions,
;delays are tenths of a second:
const
	AnnounceStatusBarCharacterCountDelay = 17,
		;This is used to delay announcement of character count when editing a tweet,
		;so that the status bar character count message is only spoken after a pause in editing.
	AnnounceSearchResultsDelay = 10,
		;This is used in the Search edit field,
		;to announce the selected results or count of results after a pause in editing.
	AnnounceTileSelectionDelay = 5,
		;This is used to announce the change in tile selection when using Prev or Next buttons,
		;when choosing which tile to pin to start.
		;The delay should be long enough to allow the tiles to be flipped before announcing the selected tile.
	ActOnTweetFavoriteButtontoggleDelay = 2
		;This is used to update the focus when a tweet reaction button is pressed.
		;Delay is necessary because the automation event occurs multiple times when a tweet reaction button is pressed.

globals
	collection colWin8People,
		;For application objects of general use.
		;This collection is nulled on AutoFinish,
		;and is initialized on first focus event when the app gains focus.
		;the members related to the focus are updated for each focus change.
		;Members are:
		;Initialized -- ;True if main UIA object, event listeners and colWin8People members are properly initialized.
		;Focus -- The element having focus at the time of the focus change.
		;PrevFocus -- The element that had focus at the time of the previous Win8People focus change.
		;parent -- The parent of member focus.
		;grandParent -- The grandparent of member focus.
		;App -- The root element for the Win8People application.
		;ProcessCondition -- The condition for the Win8People application Process ID.
		;TreeWalker -- A treewalker that can be used for traversing the Win8People application elements.
	collection colCharCount,
		;For storing data related to status bar UIA events.
		;members are:
		;ScheduleID -- Used to schedule announcement of status bar updates.
		;element -- The element received for status bar UIA events.
	collection colSearchResults,
		;For storing data related to search results UIA events.
		;Members are:
		;scheduleID -- Used to schedule announcement of search results updates.
		;element -- The element received for search results UIA events.
	collection colTileSelector,
		;For storing data related to Tile Selector UIA events.
		;Members are:
		;scheduleID -- Used to schedule announcement of selection changes in the Tile Selector.
		;Element -- The element received by the UIA event.
	collection colTweetReaction
		;For storing UIA event data related to usage of a reaction button for tweets.
		;Members are:
		;scheduleID -- Used to schedule actions when a tweet reaction button is pressed.
		;Element -- The element received by the UIA event.

;Status bar flashes into existence when syncing.
;It sometimes generates live region updates for sync messages twice.
;In an effort to avoid what appears to be double speaking,
;we use a tick count threshhold and do not speak live region updates withinn that threshhold
;if the new text from the live region update is the same as the old text.
const
	SyncTickCountThreshHold = 500
globals
	collection colSync
		;This is used for the status bar messages not specific to character count or search results,
		;which, as far as we know at this time, are only the sync messages.
		;
		;Members are:
		;LastTick -- The tick count for when this update most recently occured.
		;Text -- The text of the most recent sync message.

;Cached information used by structured braille:
globals
	collection colBrl
		;Has cached information to be used by structured braille.
		;Members are:
		;Name -- Text string to use for name component.
		;Value -- Text string to use for value component.
		;Description -- Text string to use for description component.
		;Position -- Text string to use for position component.

;Cached information for tweet and message lists:
globals
	collection colTweet
		;Has parsed text from a tweet or message in a list of tweets or messages.
		;members are:
		;Header -- Contains the text segment preceding the tweet text, which contains the sender's name and post time.
		;PrevHeader -- If previous focus item was a tweet, contains copy of the header from the previous focus item.
		;AbbrevHeader -- Contains potentially shortened header to be spoken when navigating tweets.
		;Text -- Contains the lines of text from the actual tweet or message.
		;Origin -- contains the text giving the origin (twitter or facebook).
		;PrevOrigin -- If previous focus item was a tweet, contains copy of the origin from the previous focus item.
		;Info -- Contains information such as retweeted, favorited/liked, replied/commented status.
		;AbbrevInfo -- Contains potentially shortened info to be spoken when navigating tweets.
		;Position -- The position in group string for the tweet item.

;Return codes for GetSelectedItemTextFromList
const
	GetSelectedItemTextFromList_SelectionFound = 1,
	GetSelectedItemTextFromList_NoSelection = 0,
	GetSelectedItemTextFromList_Error = 0xffff


void function AutoFinishEvent()
UIA_Win8People = Null()
UIA_PropertyListener = Null()
CollectionRemoveAll(colWin8People)
colWin8People = Null()
CollectionRemoveAll(colCharCount)
colCharCount = Null()
CollectionRemoveAll(colSearchResults)
colSearchResults = Null()
CollectionRemoveAll(colTileSelector)
colTileSelector = Null()
CollectionRemoveAll(colTweetReaction)
colTweetReaction = Null()
CollectionRemoveAll(colSync)
colSync = Null()
CollectionRemoveAll(colBrl)
colBrl = Null()
CollectionRemoveAll(colTweet)
colTweet = Null()
EndFunction

void function InitWin8People()
UIA_Win8People = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !UIA_Win8People return endIf
if !ComAttachEvents(UIA_Win8People,UIA_Win8People_EventFunctionNamePrefix)
	UIA_Win8People = Null()
	return
endIf
var object focusElement = UIA_Win8People.GetFocusedElement().BuildUpdatedCache()
if !focusElement
	UIA_Win8People = Null()
	return
endIf
var object processCondition = UIA_Win8People.CreateIntPropertyCondition(UIA_ProcessIdPropertyId,focusElement.ProcessID)
if !processCondition
	UIA_Win8People = Null()
	return
endIf
var object treeWalker = UIA_Win8People.CreateTreeWalker(processCondition)
if !treeWalker
	UIA_Win8People = Null()
	return
endIf
treeWalker.currentElement = focusElement
var object appElement = focusElement
while treeWalker.gotoParent() appElement = treeWalker.currentElement endWhile
if !appElement
	UIA_Win8People = Null()
	return
endIf
if !UIA_Win8People.AddAutomationEventHandler(UIA_LiveRegionChangedEventId, appElement, TreeScope_Descendants)
	UIA_Win8People = Null()
	return
endIf
if !UIA_Win8People.AddAutomationEventHandler(UIA_Text_TextChangedEventId, appElement, TreeScope_Descendants)
	UIA_Win8People = Null()
	return
endIf
if !UIA_Win8People.AddAutomationEventHandler(UIA_MenuOpenedEventId,appElement,TreeScope_Children)
	UIA_Win8People = Null()
	return
endIf
;if !UIA_Win8People.AddAutomationEventHandler(UIA_MenuClosedEventId,appElement,TreeScope_Children) return endIf
;if !UIA_Win8People.AddStructureChangedEventHandler(appElement, treeScope_subtree) UIA_Win8People = Null() return endIf
if !colBrl colBrl = new collection endIf
if !colTweet colTweet = new collection endIf
if !colSync colSync = new collection endIf
if !colCharCount colCharCount = new collection endIf
if !colSearchResults colSearchResults = new collection endIf
if !colTileSelector colTileSelector = new collection endIf
if !colTweetReaction colTweetReaction = new collection endIf
if !colWin8People colWin8People = new collection endIf
colWin8People.app = appElement
colWin8People.treeWalker = treeWalker
colWin8People.processCondition = processCondition
;members focus, prevFocus, parent and grandparent are set on focus change.
colWin8People.initialized = true
EndFunction

void function Win8PeopleAutomationEvent(object element, int eventID)
if eventID == UIA_LiveRegionChangedEventId
	if element.controlType == UIA_StatusBarControlTypeId
		if element.automationId == automation_messageBarStatus_statusBar
			;This status bar shows sync status,
			;and any other important application status messages.
			;Make sure this is not a repeat flash of a previous message that happened recently:
			var int ticks = GetTickCount()
			if ticks-colSync.lastTick > SyncTickCountThreshHold
			|| element.name != colSync.text
				SayUsingVoice(vctx_message,element.name,ot_screen_message)
				BrailleMessage(element.name)
			endIf
			colSync.lastTick = ticks
			colSync.text = element.name
			return
		endIf
		if colCharCount.scheduleID
			UnscheduleFunction(colCharCount.scheduleID)
		endIf
		colCharCount.element = element
		colCharCount.scheduleID = ScheduleFunction("AnnounceStatusBarCharacterCount",AnnounceStatusBarCharacterCountDelay)
	elif element.controlType == UIA_ListControlTypeId
		;this search results list is a live region:
		if colSearchResults.scheduleID
			UnscheduleFunction(colSearchResults.scheduleID)
		endIf
		colSearchResults.element = element
		colSearchResults.scheduleID = ScheduleFunction("AnnounceSearchResults",AnnounceSearchResultsDelay)
	endIf
elif eventID == UIA_Text_TextChangedEventId
&& element.controlType == UIA_EditControlTypeId
&& element.hasKeyboardFocus
&& colSearchResults.element.controlType != UIA_ListControlTypeId
	;For search results that do not generate a live region update,
	;but generate a text change when the count of items found changes:
	if colSearchResults.scheduleID
		UnscheduleFunction(colSearchResults.scheduleID)
	endIf
	colSearchResults.scheduleID = ScheduleFunction("AnnounceSearchResults",AnnounceSearchResultsDelay)
	colSearchResults.element = element
elif eventID == UIA_MenuOpenedEventId
	if element.controlType == UIA_MenuControlTypeId
		;Move to the first menu item:
		TypeKey(cksDownArrow)
		return
	endIf
endIf
EndFunction

;void function Win8PeopleStructureChangedEvent(object element, int StructureChangeTypeID, IntArray RunTimeID)
;SayString("structure")
;SayInteger(StructureChangeTypeID)
;SayString(element.name)
;SayString(element.controlType)
;EndFunction

void function Win8PeoplePropertyChangedEvent(object element, int propertyID, variant newValue)
if propertyID == UIA_IsOffscreenPropertyId
	;Listen for changes in the tile selection list:
	if newValue == false
	&& element.controlType == UIA_ListItemControlTypeId
		if colTileSelector.scheduleID
			UnscheduleFunction(colTileSelector.scheduleID)
		endIf
		colTileSelector.scheduleID = ScheduleFunction("AnnounceTileSelection",AnnounceTileSelectionDelay)
		colTileSelector.element = element
		return
	endIf
elif propertyID == UIA_AriaPropertiesPropertyId
	;Listen for usage of one of the tweet reaction buttons:
	if colTweetReaction.scheduleID
		UnscheduleFunction(colTweetReaction.scheduleID)
	endIf
	colTweetReaction.scheduleID = ScheduleFunction("ActOnTweetFavoriteButtontoggle",ActOnTweetFavoriteButtontoggleDelay)
	colTweetReaction.element = element
	return
endIf
EndFunction

int function ShouldAnnounceStatusBarCharacterCount()
if !InMessageEdit()
	return false
endIf
if colCharCount.element.name == objn_MessageCharacterCount_statusBar
|| colCharCount.element.automationID == automation_itemCommentCount_statusBar
	return true
endIf
return false
endFunction

void function AnnounceStatusBarCharacterCount()
colCharCount.scheduleID = 0
if !ShouldAnnounceStatusBarCharacterCount()
	colCharCount.element = Null()
	return
endIf
var string text = colCharCount.element.GetTextChildPattern().TextRange().GetText(100)
if text
	SayUsingVoice(vctx_message,text,ot_screen_message)
	colBrl.description = Text
	BrailleRefresh()
endIf
colCharCount.element = Null()
EndFunction

int function GetSelectedItemTextFromList(object element, string ByRef selectionText)
if !element
	return GetSelectedItemTextFromList_error
EndIf
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = element
if !treeWalker.GotoFirstChild()
	return GetSelectedItemTextFromList_NoSelection
endIf
var	object pattern
while true
	pattern = treeWalker.currentElement.GetSelectionItemPattern()
	if pattern
	&& pattern.isSelected
		selectionText = GetTextInRange(treeWalker.currentElement)
		return GetSelectedItemTextFromList_SelectionFound
	endIf
	if !treeWalker.GotoNextSibling()
		return GetSelectedItemTextFromList_NoSelection
	endIf
endWhile
endFunction

string function GetSearchResultsCountInfo(object element)
if !element return cscNull EndIf
var object treeWalker = colWin8People.treeWalker
if !treeWalker return cscNull endIf
treeWalker.currentElement = element
treeWalker.GotoParent()
if treeWalker.currentElement.automationId != automation_searchControlId_group  return cscNull endIf
treeWalker.gotoPriorSibling()
if treeWalker.currentElement.automationId != automation_idPeopleSecondaryTitle return cscNull endIf
var string text = treewalker.currentElement.name
if treeWalker.gotoPriorSibling()
	if StringTrimExcessChars(treeWalker.currentElement.name) != objn_AllContacts_heading
		return cscNull
	endIf
endIf
return text
EndFunction

void function AnnounceSearchResults()
colSearchResults.scheduleID = 0
;Search results may be live region elements in the search control group,
;or they may be a group sibling to the search control which is not live,
;but which generated a text change automation event.
if !colSearchResults.element return endIf
if !ElementIsSearchControl(colSearchResults.element)
	colSearchResults.element = Null()
	return
endIf
var
	string text,
	int found
if colSearchResults.element.controlType == UIA_ListControlTypeId
	found = GetSelectedItemTextFromList(colSearchResults.element,text)
	if found == GetSelectedItemTextFromList_NoSelection
		SayUsingVoice(vctx_message,msgNoResults,ot_screen_message)
	endIf
elif colSearchResults.element.controlType == UIA_EditControlTypeId
	text = GetSearchResultsCountInfo(colSearchResults.element)
endIf
colBrl.description = text
brailleRefresh()
if text
	SayUsingVoice(vctx_message,text,ot_screen_message)
endIf
colSearchResults.element = Null()
EndFunction

string function GetFocusItemPositionFromUIADescription()
var
	string position,
	object pattern = colWin8People.focus.GetLegacyIAccessiblePattern()
if pattern
	position = pattern.description
endIf
return position
EndFunction

void function AnnounceTileSelection()
colTileSelector.scheduleID = 0
if !colTileSelector.element return endIf
if !(onTileSelectorButton() || InTileSelectorList())
|| !colTileSelector.element.name
	colTileSelector.element = Null()
	return
endIf
SayUsingVoice(vctx_message,colTileSelector.element.name,ot_screen_message)
if onTileSelectorButton()
	BrailleMessage(colTileSelector.element.name)
elif InTileSelectorList()
	colBrl.value = colTileSelector.element.name
	BrailleRefresh()
endIf
colTileSelector.element = Null()
EndFunction

void function ActOnTweetFavoriteButtontoggle()
colTweetReaction.scheduleID = 0
if UIA_Win8People.CompareElements(colTweetReaction.element,colWin8People.focus)
	UpdateUIAFocusData()
	BrailleRefresh()
	IndicateControlType(wt_button,colWin8People.focus.name)
endIf
EndFunction

string function StringTrimExcessChars(string stringParam)
var
	int i,
	string s = stringParam
if !s return s endIf
s = StringRemoveCharsInRange(s,0xe000,0xf8ff)
s = StringRemoveCharsInRange(s,0x202a,0x202a)
s = StringRemoveCharsInRange(s,0x202c,0x202c)
return StringTrimLeadingBlanks(StringTrimTrailingBlanks(s))
EndFunction

string function GetUsableObjectName()
var	string name
name = StringTrimExcessChars(colWin8People.focus.name)
if !name
	;When a new screen is gaining focus,
	;timing may require that the focus cache be updated:
	Pause()
	colwin8People.focus = colWin8People.focus.buildUpdatedCache()
	name = StringTrimExcessChars(colWin8People.focus.name)
endIf
if !name
	;A few buttons don't have their name in the actual name property:
	name = StringTrimExcessChars(colWin8People.focus.helpText)
	if !name
		name = StringTrimExcessChars(colWin8People.focus.description)
	endIf
endIf
return name
endFunction

string function GetTextInRange(object element, optional int MaxLength)
if !element return cscNull endIf
var object textChild = element.GetTextChildPattern()
if !textChild return cscNull endIf
var object textRange = textChild.TextRange()
if !textRange return cscNull endIf
if !maxLength MaxLength = GetTextInRangeMaxLength endIf
var string text = textRange.GetText(MaxLength)
return StringTrimExcessChars(text)
EndFunction

int function GetObjectSubtypeCode(optional int refreshed, int level)
var
	int type
type = GetObjectSubtypeCode(refreshed,level)
if !type
&& level == 0
&& IsPCCursor()
&& !UserBufferIsActive()
&& !InHomeRowMode()
	if colWin8People.focus.controlType == UIA_SeparatorControlTypeId
		type = wt_separator
	elif colWin8People.focus.controlType == UIA_MenuControlTypeId
		type = wt_menu
	endIf
endIf
return type
EndFunction

string function GetObjectHelp()
if InSearchEdit()
	return GetObjectName()
endIf
return GetObjectHelp()
EndFunction

void function SayWord()
if InDescriptiveLinkForButton()
	SayDescriptiveLinkForButtonTypeAndText()
	return
elif InMainScreenFavoritesGroup()
	;for both the list items and the button in favorites:
	SayMainScreenFavoritesListItem(true)
	return
elif OnTweetReactionButton()
	IndicateControlType(wt_button,colWin8People.focus.name)
	return
elif OnGroupParentOfLink()
	IndicateControlType(wt_link,GetObjectName())
	return
elif InCommunicationCommandLinkGroup()
	SayObjectActiveItem()
	return
elif InTileSelectorList()
	SayTileSelectorListTypeAndText()
	return
elif OnFlyoutMenuItem()
	SayObjectTypeAndText()
	return
elif IsPopupMenu()
	SayPopupMenuTypeAndText()
	return
elif OnUnNamedCheckBox()
	SayUnNamedCheckBoxTypeAndText()
	return
elif GetObjectSubtypeCode() == wt_button
	SayObjectTypeAndText()
	return
endIf
SayWord()
EndFunction

void function SayLine(optional int iDrawHighlights , int bDoNotUseObjInfo)
var int type
If OnApplicationPagePane()
	SayPaneNameTypeAndText(true)
	return
elif InSearchEdit()
	SaySearchEditTypeAndText()
	return
elif InMessageEdit()
	Say(getLine(),ot_line)
	return
elif InMainScreenFavoritesGroup()
	;for both list items and button in the list:
	SayMainScreenFavoritesListItem(false)
	return
elif OnTweetListItem()
	SayTweetItem(false)
	return
elif OnTweetReactionButton()
	IndicateControlType(wt_button,colWin8People.focus.name)
	return
elif InDescriptiveLinkForButton()
	SayDescriptiveLinkForButtonTypeAndText()
	return
elif OnGroupParentOfLink()
	IndicateControlType(wt_link,GetObjectName())
	return
elif InCommunicationCommandLinkGroup()
	SayCommunicateGroupTypeAndText()
	return
elif OnAccountLinkingListItem()
	SayAccountLinkingListItemTypeAndText()
	return
elif OnSettingsAccountListItem()
	SayAccountListItemTypeAndText()
	return
elif OnButtonMenuWithPopup()
	SayButtonMenuWithPopup()
	return
elif InTileSelectorList()
	SayTileSelectorListTypeAndText()
	return
elif InPeopleExtendedSelectList()
	SayPeopleExtendedSelectListItemTypeAndText()
	return
elif InItemPickerBasket()
	SayItemPickerListItemTypeAndText()
	return
elif OnFlyoutMenuItem()
	SayObjectTypeAndText()
	return
elif IsPopupMenu()
	SayPopupMenuTypeAndText()
	return
elif InNotificationsList()
	SayNotificationsListTypeAndText()
	return
elif InPhotosList()
	SayPhotosListTypeAndText()
	return
elif OnPanelErrorText()
	if colWin8People.focus.name
		say(colWin8People.focus.name,ot_line)
		return
	endIf
elif OnUnNamedCheckBox()
	SayUnNamedCheckBoxTypeAndText()
	return
endIf
type = GetObjectSubtypeCode()
if type == wt_separator
	IndicateControlType(wt_separator,GetObjectName())
	return
elif type == wt_button
	SayObjectTypeAndText()
	return
endIf
SayLine(iDrawHighlights ,bDoNotUseObjInfo)
EndFunction

int function SayByTypeForScriptSayLine()
if InTileSelectorList()
	SayTileSelectorListTypeAndText()
	return true
endIf
return SayByTypeForScriptSayLine()
EndFunction

void function SayObjectActiveItem(optional int AnnouncePosition )
if GetObjectSubtypeCode() == wt_separator
	IndicateControlType(wt_separator,GetObjectName())
	return
elif InMainScreenFavoritesGroup()
	;for both the list items and the button in favorites:
	SayMainScreenFavoritesListItem(true)
	return
elif OnTweetListItem()
	SayTweetItem(true)
	return
elif InCommunicationCommandLinkGroup()
	IndicateControlType(wt_link,colWin8People.focus.name)
	return
endIf
SayObjectActiveItem(AnnouncePosition )
EndFunction

int function OnGroupWhichShouldBeSilentForFocusObject(optional int level)
return GroupTextIsRedundantForDialog(level)
	|| GroupTextIsRedundantForComboBox(level)
	|| InNotificationsList()
	|| InPhotosList()
	|| OnButtonWithRedundantGroupName()
	|| InSearchEdit()
	|| InContactList()
	|| InFavoritesSelectionBasket()
	|| InLayoutList()
	|| OnButtonMenuWithPopup()
	|| InMainScreenFavoritesGroup()
	|| InItemPickerBasket()
	|| OnAccountLinkingListItem()
	|| InEditContact()
EndFunction

void function SayObjectTypeAndText(optional int level, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(level,includeContainerName) return endIf
var
	int type = GetObjectSubtypeCode(false,level)
if type == wt_groupbox
	if OnGroupWhichShouldBeSilentForFocusObject(level)
		return
	endIf
endIf
if level > 0
	if type == wt_dialog_page
	&& PaneNameIsRedundant(level)
		return
	elif type == wt_extendedSelect_listBox
	&& InPeopleExtendedSelectList()
		return
	elif type == wt_multiSelect_listbox
	&& InItemPickerBasket()
		return
	elif type == wt_listBox
		;The type gets spoken at the lowest level
		return
	elif (type == wt_menu || type == wt_static)
	&& InOptionsSettingsDialog()
		;this is overly verbose and redundant:
		return
	endIf
endIf
if level == 2
	if type == wt_unknown
	&& colWin8People.grandParent.controlType == UIA_SemanticZoomControlTypeId
		;This may be disabled, which is irrelevant,
		;so prevent announcement of "unavailable":
		return
	endIf
elif level == 1
	if type == wt_unknown
		if colWin8People.parent.controlType == UIA_SemanticZoomControlTypeId
			;This may be disabled, which is irrelevant,
			;so prevent announcement of "unavailable":
			return
		endIf
	elif type == wt_listBox
		if InNotificationsList()
		|| InPhotosList()
			return
		endIf
	elif type == wt_button
		if GetObjectSubtypecode() == wt_unknown
			return
		endIf
	endIf
elif level == 0
	If OnApplicationPagePane()
		SayPaneNameTypeAndText(false)
		;schedule announcement of any page text to allow updates to complete,
		;so that braille flash message is not obliterated.
		ScheduleFunction("AnnouncePageReadOnlyText",5)
		return
	elif InDescriptiveLinkForButton()
		SayDescriptiveLinkForButtonTypeAndText()
		return
	elif InMainScreenFavoritesGroup()
		;for both the list items and the button in favorites:
		SayMainScreenFavoritesListItem(false)
		return
	elif InReactionList()
		SayReactionListTypeAndText()
		return
	elif OnButtonWithRedundantGroupName()
		SayTypeAndTextForButtonWithRedundantGroupName()
		return
	elif InSearchEdit()
		SaySearchEditTypeAndText()
		NotifyIfContextHelp()
		return
	elif InMessageEdit()
		SayMessageEditTypeAndText()
		return
	elif OnGroupParentOfLink()
		IndicateControlType(wt_link,GetObjectName())
		return
	elif InNotificationsList()
		SayNotificationsListTypeAndText()
		return
	elif InPhotosList()
		SayPhotosListTypeAndText()
		return
	elif OnTweetListItem()
		SayTweetItem(false)
		return
	elif InCommunicationCommandLinkGroup()
		SayCommunicateGroupTypeAndText()
		return
	elif OnAccountLinkingListItem()
		SayAccountLinkingListItemTypeAndText()
		return
	elif OnSettingsAccountListItem()
		SayAccountListItemTypeAndText()
		return
	elif OnPopupDialogText()
		if colWin8People.focus.name
			Say(colWin8People.focus.name,ot_control_name)
			return
		endIf
	elif OnButtonMenuWithPopup()
		if ButtonMenuIsInTransition()
			return
		endIf
		SayButtonMenuWithPopup()
		return
	elif IsPopupMenu()
		SayPopupMenuTypeAndText()
		return
	elif InTileSelectorList()
		SayTileSelectorListTypeAndText()
		return
	elif InPeopleExtendedSelectList()
		SayPeopleExtendedSelectListItemTypeAndText()
		return
	elif InItemPickerBasket()
		SayItemPickerListItemTypeAndText()
		return
	elif OnUnNamedCheckBox()
		SayUnNamedCheckBoxTypeAndText()
		return
	elif OnAccountSignInUserNameEdit()
		SayAccountSignInUserNameEditTypeAndText()
		return
	elif OnAccountSignInPasswordEdit()
		SayAccountSignInPasswordEditTypeAndText()
		return
	elif OnAccountProofConfirmationComboBox()
		SayAccountProofConfirmationComboBoxTypeAndText()
		return
	elif OnAccountProofVerificationEdit()
		SayAccountProofVerificationEditTypeAndText()
		return
	elif OnAccountProofCodeEdit()
		SayAccountProofCodeEditTypeAndText()
		return
	elif type == wt_button
	&& SayButtonTypeAndText()
		return
	elif type == wt_link
		SayLinkObjectTypeAndText()
		return
	endIf
endIf
SayObjectTypeAndText(level,includeContainerName)
EndFunction

int function IsItemPickerWindow(handle hWnd)
return GetWindowClass(hWnd) == cwc_DirectUIhWND
	&& GetWindowClass(GetParent(hwnd)) == wc_ItemPickerWindow
EndFunction

int function IsFloatingBarHost(handle hWnd)
return GetWindowClass(hWnd) == cwc_DirectUIhWND
	&& GetWindowClass(GetParent(hWnd)) == wc_FloatingBarHwndHost
EndFunction

void function ListenForTileSelectionChange()
if colTileSelector.scheduleID
	;Unschedule to prevent the scheduled function from running and repeating the item
	;when the listener is scheduled on a focus change:
	UnscheduleFunction(colTileSelector.scheduleID)
endIf
if !UIA_PropertyListener
	UIA_PropertyListener = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	if !ComAttachEvents(UIA_PropertyListener,UIA_Win8People_EventFunctionNamePrefix)
		UIA_PropertyListener = Null()
		return
	endIf
	UIA_PropertyListener.AddPropertyChangedEventHandler(UIA_IsOffscreenPropertyId, colWin8People.parent, TreeScope_subtree)
endIf
EndFunction

void function ListenForReactionToTweet()
if !UIA_PropertyListener
	UIA_PropertyListener = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	if !ComAttachEvents(UIA_PropertyListener,UIA_Win8People_EventFunctionNamePrefix)
		UIA_PropertyListener = Null()
		return
	endIf
	UIA_PropertyListener.AddPropertyChangedEventHandler(UIA_AriaPropertiesPropertyId, colWin8People.focus, TreeScope_element)
endIf
EndFunction

void function IgnorePropertyChanges()
UIA_PropertyListener = Null()
endFunction

int function IsPopupMenu(optional object element)
if !element element = colWin8People.focus endIf
return element.controlType == UIA_MenuControlTypeId
	&& StringContains(element.ariaProperties,"haspopup=true")
EndFunction

int function OnSettingsMenuWithoutFocus()
;Use MSAA, UIA may not be updated yet:
if GetMenuMode() != menu_active || GetObjectSubtypeCode() != wt_menu return false endIf
var int left, int top, int right, int bottom
GetObjectRect(left,right,top,bottom,1,0)
if left && top && right && bottom return false endIf
return GetObjectSubtypeCode(false,1) == wt_dialog
	&& GetObjectName(false,1) == objn_optionsSettingsFlyout_dialog
EndFunction

int function MenuInactiveIsMovingToSettingsDialog()
return colWin8People.focus.controlType == UIA_ButtonControlTypeId
	&& colWin8People.parent.name == objn_optionsSettingsFlyout_dialog
	&& !colWin8People.prevFocus.controlType
EndFunction

int function InOptionsSettingsDialog()
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.focus
while treeWalker.gotoParent
	if treeWalker.currentElement.ariaRole == "dialog"
	&& treeWalker.currentElement.name == objn_optionsSettingsFlyout_dialog
		return true
	elif treeWalker.currentElement.controlType == UIA_PaneControlTypeId
		return false
	endIf
endWhile
return false
EndFunction

object function GetFocusElement()
var object focusCondition = UIA_Win8People.CreateBoolPropertyCondition(UIA_HasKeyboardFocusPropertyId,UIATrue)
if !focusCondition return Null() endIf
var object treeWalker = colWin8People.treeWalker
var object focusElement = UIA_Win8People.GetFocusedElement().BuildUpdatedCache()
var int stop
while focusElement && !stop
	treeWalker.currentElement = focusElement
	if IsPopupMenu(focusElement)
		stop = true
	else
		focusElement = treeWalker.currentElement.FindFirst(treeScope_descendants,focusCondition)
	endIf
endWhile
return treeWalker.currentElement
EndFunction

object function GetParentElement(object element)
if !element return Null() endIf
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = element
if !treeWalker.GotoParent() return Null() endIf
return treeWalker.currentElement
endFunction

void function UpdateUIAFocusData()
;because UIA focus change is not always in sync with the focus change as detected by JAWS,
;the JAWS focus change event processor calls this function to update the focus UIA element
;rather than attaching a UIA focus change event.
colWin8People.prevFocus = colWin8People.focus
colWin8People.focus = GetFocusElement()
colWin8People.parent = GetParentElement(colWin8People.focus)
colWin8People.grandparent = GetParentElement(colWin8People.parent)
EndFunction

int function MenuActiveProcessed(int mode, handle hWnd)
If mode == MENU_ACTIVE
	;do not use cache for testing IsPopUpMenu,
	;because the focus change has not yet updated it:
	if IsPopupMenu(UIA_Win8People.GetFocusedElement().BuildUpdatedCache())
		;do not announce menu as would normally happen,
		;the control type will announce that it is a menu.
		MenuModeHook ()
		return true
	endIf
	if OnSettingsMenuWithoutFocus()
		;The menu becomes active when Options is chosen from Settings,
		;and is deactivated as soon as something gets focus.
		;Unless tab is used to move to a control,
		;The settings dialog does not have focus and is not usable.
		TabKey()
		return true
	endIf
endIf
return MenuActiveProcessed(mode,hWnd)
EndFunction

int function MenuInactiveProcessed(int mode, int PrevMenuMode)
If mode == MENU_INACTIVE then
	;This fires before the focus change updates the cached UIA focus info,
	;so do not use cached data to test the focus object and use the cached focus data to test the previous focus object:
	if IsPopUpMenu(colWin8People.focus)
	&& !IsPopupMenu(UIA_Win8People.GetFocusedElement().BuildUpdatedCache())
		;do not announce leaving menus
		return true
	endIf
	if MenuInactiveIsMovingToSettingsDialog()
		;do not announce leaving menus
		return true
	endIf
EndIf
return MenuInactiveProcessed(mode,PrevMenuMode)
EndFunction

void function ClearAutomationEventActions()
if colCharCount.scheduleID
	UnscheduleFunction(colCharCount.scheduleID)
	CollectionRemoveAll(colCharCount)
endIf
if colSearchResults.scheduleID
	UnscheduleFunction(colSearchResults.scheduleID)
	CollectionRemoveAll(colSearchResults)
endIf
EndFunction

int function FocusChangedFromReactionButtonToListEntry()
return !IsCommonFocusException()
	&& colWin8People.prevFocus.automationID == automation_ItemReactionButton_listItem
	&& !colWin8People.focus.automationID
	&& InReactionList()
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
if !colWin8People.initialized
	;Most likely due to app gaining focus,
	InitWin8People()
	;Check for and announce any live region status bar that we may have missed
	;because the automation event was not attached before the live region update occurred:
	CheckForMessageBarStatusBar()
endIf
CollectionRemoveAll(colBrl)
UpdateUIAFocusData()
ClearAutomationEventActions()
if OnTweetListItem()
	ParseTweetToCollection()
else
	collectionRemoveAll(colTweet)
endIf
if OnTweetReactionButton()
	ListenForReactionToTweet()
elif onTileSelectorButton()
|| InTileSelectorList()
	ListenForTileSelectionChange()
else
	IgnorePropertyChanges()
endIf
if FocusChangedFromReactionButtonToListEntry()
	MSAARefresh()
endIf
EndFunction

int function MenuProcessedOnFocusChangedEventEx(
	handle hwndFocus, handle hwndPrevFocus,
	int nType, optional int nChangeDepth)
var int mode = GetMenuMode ()
if mode == menu_active
&& mode == globalMenuMode
	if colWin8People.focus.controlType == UIA_MenuItemControlTypeId
	&& !colWin8People.focus.hasKeyboardFocus
	&& StringStartsWith(colWin8People.focus.automationId,automation_UIMenuItem_prefix)
		;Select the first menu item to set the keyboard focus:
		TypeKey(cksDownArrow)
		return true
	endIf
EndIf
return MenuProcessedOnFocusChangedEventEx(hwndFocus, hwndPrevFocus, nType, nChangeDepth)
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if nChangeDepth == 0
&& hwndFocus == hWndPrevFocus
	if OnListItemSeparator()
	|| IsNavigatingCommunicationCommandLink()
	|| InMainScreenFavoritesGroup()
		return SayObjectActiveItem()
	endIf
else
	if sClass == cwcIEServer
	&& (IsItemPickerWindow(hwndPrevFocus)
			|| IsFloatingBarHost(hwndPrevFocus))
		;reduce announcement to not include the depth of all the changes:
		SayObjectTypeAndText()
		return
	endIf
endIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild,
	nChangeDepth, sClass, nType)
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if OnListItemSeparator()
	return SayObjectActiveItem()
endIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId,
	prevHwnd, prevObjectId, prevChildId)
EndFunction

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
if iObjType == wt_buttonMenu
	return
elif iObjType == wt_listBoxItem
	if hObj == GetFocus()
	&& InPeopleExtendedSelectList()
		;old state cannot be used to ch for selecting:
		if nOldState & CTRL_SELECTED
			Say(cMsgUnselected,ot_item_state)
			return
		elif nState & CTRL_SELECTED
			Say(cMsgSelected,ot_item_state)
			return
		endIf
	endIf
EndIf
ObjStateChangedEvent(hObj,iObjType, nChangedState, nState, nOldState)
EndFunction

void function SayLineUnit(int unitMovement,optional  int bMoved)
if !IsLeftButtonDown()
&& IsPCCursor ()
	if InPeopleExtendedSelectList()
	|| InContactList()
	|| OnFlyoutMenuItem()
		;handled by ActiveItemChangedEvent
		return
	endIf
endIf
SayLineUnit(unitMovement,bMoved)
EndFunction

void function SayCharacterUnit(int UnitMovement)
if !IsLeftButtonDown()
&& IsPCCursor ()
	if InPeopleExtendedSelectList()
	|| InContactList()
		;handled by ActiveItemChangedEvent
		return
	endIf
endIf
SayCharacterUnit(UnitMovement)
EndFunction

int function ShouldNotifyIfContextHelp()
if OnAddFavoriteButton()
	return false
elif InSearchEdit()
	return true
endIf
return ShouldNotifyIfContextHelp()
EndFunction

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow)
var
	string class = GetWindowClass(FocusWindow)
if class == cwcIEServer
|| class == cwc_DirectUIhWND
	return true
endIf
return FocusChangedEventShouldProcessAncestors(FocusWindow)
EndFunction

int function IsCommonFocusException()
return globalMenuMode != menu_inactive
	|| UserBufferIsActive()
	|| InHJDialog()
	|| IsTouchCursor()
EndFunction

int function PaneNameIsRedundant(int level)
if IsCommonFocusException() || level == 0 return false endIf
var
	int i,
	int depth,
	string name,
	int type
depth = GetAncestorCount()
if level == depth return false endIf
name = GetObjectName(false,level)
if !name return false endIf
type = GetObjectSubtypeCode(false,level)
if type != wt_dialog_page
&& type != wt_unknown
 	return false
endIf
for i = depth to level descending
	if GetObjectName(false,i) == name
		type = GetObjectSubtypeCode(false,i)
		if type == wt_dialog_page
		|| type == wt_unknown
			return true
		endIf
	endIf
endFor
return false
EndFunction

int function GroupTextIsRedundantForDialog(int level)
if IsCommonFocusException() return false endIf
if GetObjectSubtypeCode(false,level) == wt_groupBox
	var
		int parentType = GetObjectSubtypeCode(false,level+1),
		string parentName = GetObjectName(false,level+1)
	if parentType == wt_dialog
	&& parentName == objn_AccountSettingsFlyout_dialog
		return true
	elif parentType == wt_dialog_page
	&& parentName == objn_HelpUsProtectYourAccount_dialog
		return true
	endIf
endIf
return false
EndFunction

int function GroupTextIsRedundantForComboBox(int level)
return !IsCommonFocusException()
	&& level > 0
	&& GetObjectSubtypeCode(false,level) == wt_groupBox
	&& GetObjectSubtypeCode(false,level-1) == wt_comboBox
EndFunction

int function OnApplicationPagePane()
return !IsCommonFocusException()
	&& colWin8People.focus.controlType == UIA_PaneControlTypeId
	&& colWin8People.parent.className == cwcIEServer
EndFunction

int function OnPopupDialogText()
return !IsCommonFocusException()
	&& GetObjectSubtypeCode() == wt_dialog_page
	&& colWin8People.focus.automationId == automation_PopupWindow_window
EndFunction

int function OnUnNamedCheckBox()
if IsCommonFocusException() return false endIf
if colWin8People.focus.controlType != UIA_CheckBoxControlTypeId
|| colWin8People.focus.name
	return false
endIf
var object label = colWin8People.focus.labeledBy
return !label.name
EndFunction

string function GetNameForUnNamedCheckBox()
;we only found one of these so far,
;and the text we want to speak for the name appears to have no programmatic relationship to the checkbox.
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.parent
if !treeWalker.gotoFirstChild() return cscNull endIf
return treeWalker.currentElement.name
EndFunction

void function SayUnNamedCheckBoxTypeAndText()
var string text = GetNameForUnNamedCheckBox()
IndicateControlType(wt_checkbox,text,GetObjectState())
EndFunction

int function InMainScreenFavoritesGroup()
return !IsCommonFocusException()
	&& colWin8People.parent.controlType == UIA_GroupControlTypeId
	&& colWin8People.parent.name == objn_Favorites_Group
EndFunction

int function OnMainScreenFavoritesListItem()
return colWin8People.focus.controlType == UIA_ListItemControlTypeId
	&& InMainScreenFavoritesGroup()
EndFunction

int function OnAddFavoriteButton()
return colWin8People.focus.controlType == UIA_ButtonControlTypeId
	&& InMainScreenFavoritesGroup()
EndFunction

int function OnButtonWithRedundantGroupName()
if IsCommonFocusException()
|| GetObjectSubtypeCode() != wt_button
|| !(GetObjectSubtypeCode(false,1) == wt_groupBox || colWin8People.parent.controlType == UIA_GroupControlTypeId)
	return false
endIf
if colWin8People.parent.controlType == UIA_GroupControlTypeId
&& colWin8People.focus.controlType == UIA_ButtonControlTypeId
	if colWin8People.parent.name
	&& StringStartsWith(colWin8People.focus.name,colWin8People.parent.name)
		return true
	endIf
	if colWin8People.parent.name == objn_Favorites_Group
		return true
	endIf
endIf
var
	string objectName = StringTrimExcessChars(GetObjectName()),
	string ParentObjectName = GetObjectName(false,1)
return parentObjectName && StringStartsWith(objectName,ParentObjectName)
EndFunction

void function SayTypeAndTextForButtonWithRedundantGroupName()
var string name = StringTrimExcessChars(GetObjectName())
colBrl.name = name
BrailleRefresh()
IndicateControlType(wt_button,name)
EndFunction

int function SayButtonTypeAndText()
var string text = GetUsableObjectName()
if text
	colBrl.name = text
	BrailleRefresh()
	IndicateControlType(wt_button,text)
	return true
endIf
return false
EndFunction

int function InAllContactsGroup()
return !IsCommonFocusException()
	&& GetObjectSubtypeCode(false,1) == wt_groupBox
	&& GetObjectName(false,1) == objn_AllContacts_group
EndFunction

int function OnAllContactsPage()
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.app
var object findCondition = UIA_Win8People.CreateStringPropertyCondition(UIA_AutomationIdPropertyId,automation_idPeopleTitle)
if !findCondition return false endIf
var object title = treeWalker.currentElement.FindFirst(treeScope_descendants,findCondition)
if !title return false endIf
treeWalker.currentElement = title
if !treeWalker.gotoFirstChild() return false endIf
return treeWalker.currentElement.name == objn_AllContacts_heading
EndFunction

int function InContactList()
;On main screen, press All Contacts.
;The page that appears has this list.
if IsCommonFocusException() return false endIf
if colWin8People.focus.controlType != UIA_SeparatorControlTypeId
&& colWin8People.focus.controlType != UIA_ListItemControlTypeId
&& colWin8People.parent.controlType != UIA_GroupControlTypeId
&& colWin8People.grandparent.controlType != UIA_ListControlTypeId
	return false
endIf
return OnAllContactsPage()
EndFunction

string function GetFocusListNameFromUIA()
if colWin8People.parent.controlType == UIA_ListControlTypeId
	return StringTrimExcessChars(colWin8People.parent.name)
elif colWin8People.ghrandparent.controlType == UIA_ListControlTypeId
&& colWin8People.parent.controlType == UIA_GroupControlTypeId
	if colWin8People.ghrandparent.name
		return StringTrimExcessChars(colWin8People.grandparent.name)
	elif colWin8People.parent.name
		return StringTrimExcessChars(colWin8People.parent.name)
	endIf
endIf
return cscNull
EndFunction

object function GetResultsListElement()
if colWin8People.focus.controlType != UIA_EditControlTypeId
|| colWin8People.parent.automationID != automation_searchControlId_group
	return Null()
endIf
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.focus
;move next twice to look for the list:
if !treeWalker.gotoNextSibling() return Null() endIf
if !treeWalker.gotoNextSibling() return Null() endIf
if treeWalker.currentElement.controlType != UIA_ListControlTypeId return Null() endIf
return treeWalker.currentElement
EndFunction

void function SaySearchEditTypeAndText()
;do not use the overly verbose name
var string name = GetObjectName(false,1)
colBrl.name = name
IndicateControlType(wt_edit,name)
var string editText = GetLine()
Say(editText,ot_line)
;look for any search results:
var string resultsText
;first, see if this search edit has a results list:
var object resultsList = GetResultsListElement()
if resultsList
	GetSelectedItemTextFromList(resultsList, resultsText)
	;resultsText may be prepended with whitespace chars:
	if resultsText
		resultsText = StringTrimLeadingBlanks(resultsText)
	endIf
else
	;NIf there was no results list, see if there is results filter text:
	resultsText = GetSearchResultsCountInfo(colWin8People.focus)
endIf
if resultsText
	colBrl.description = resultsText
	if resultsText != editText
		SayUsingVoice(vctx_message,resultsText,ot_screen_message)
	endIf
endIf
BrailleRefresh()
EndFunction

void function SayMessageEditTypeAndText()
var string text
IndicateControlType(wt_edit,GetObjectName())
text = GetValueString(colWin8People.focus)
if text
	Say(text,ot_line)
endIf
text = GetStatusBarText()
if text
	SayUsingVoice(vctx_message,text,ot_screen_message)
endIf
EndFunction

void function SayPeopleExtendedSelectListItemTypeAndText()
var
	string listName,
	int type,
	int parentType
type = GetObjectSubtypeCode()
parentType = GetObjectSubtypeCode(false,1)
listName = StringTrimExcessChars(getObjectName(false,1))
if !listName
	listName = GetFocusListNameFromUIA()
endIf
if listName
	colBrl.name = listName
endIf
IndicateControlType(parentType,listName)
BrailleRefresh()
if type != wt_listboxItem
	IndicateControlType(type,StringTrimExcessChars(GetObjectName()))
else
	SayObjectActiveItem()
endIf
endFunction

int function InPeopleExtendedSelectList()
return !IsCommonFocusException()
	&& colWin8People.grandparent.controlType == UIA_ListControlTypeId
	&& colWin8People.grandparent.name == objn_PeopleList
EndFunction

int function InFavoritesSelectionBasket()
var int type = GetObjectSubtypeCode()
return !IsCommonFocusException()
	&& type == wt_listBoxItem
	&& GetObjectSubtypeCode(false,1) == wt_groupBox
	&& GetObjectSubtypeCode(false,2) == wt_multiSelect_listBox
	&& GetObjectSubtypeCode(false,3) == wt_toolBar
	&& GetObjectName(false,3) == objn_SelectionBasket
EndFunction

void function SayItemPickerListItemTypeAndText()
var
	string listName,
	int type,
	int parentType
type = GetObjectSubtypeCode()
parentType = GetObjectSubtypeCode(false,2)
listName = StringTrimExcessChars(getObjectName(false,2))
if listName
	colBrl.name = listName
endIf
IndicateControlType(parentType,listName)
BrailleRefresh()
SayObjectActiveItem()
EndFunction

int function InItemPickerBasket()
var int type = GetObjectSubtypeCode()
return !IsCommonFocusException()
	&& type == wt_listBoxItem
	&& GetObjectSubtypeCode(false,1) == wt_groupBox
	&& GetObjectSubtypeCode(false,2) == wt_multiSelect_listBox
	&& GetObjectSubtypeCode(false,3) == wt_unknown
	&& GetObjectSubtypeCode(false,4) == wt_unknown
	&& GetObjectName(false,4) == objn_ItemPicker
EndFunction

int function OnPanelErrorText()
if IsCommonFocusException() return false endIf
if GetObjectSubtypeCode() != wt_unknown
|| colWin8People.focus.controlType != UIA_GroupControlTypeId
	return false
endIf
return colWin8People.focus.automationID == automation_panelErrors_group
EndFunction

int function InNotificationsList()
if IsCommonFocusException() return false endIf
var
	int type = GetObjectSubtypeCode(),
	int parentType = GetObjectSubtypeCode(false,1)
if type != wt_unknown
&& type != wt_listBoxItem
	return false
endIf
if parentType == wt_listBox
	;Check for structure of empty notifications list:
	if GetObjectSubtypeCode(false,2) != wt_groupBox
		return false
	endIf
	return StringTrimExcessChars(GetObjectName(false,2)) == objn_Notifications_list
elif parentType == wt_groupBox
	;Check for structure of non-empty notifications list:
	if GetObjectSubtypeCode(false,2) != wt_listBox
	|| GetObjectSubtypeCode(false,3) != wt_groupBox
		return false
	endIf
	return StringTrimExcessChars(GetObjectName(false,3)) == objn_Notifications_list
endIf
return false
EndFunction

void function SayNotificationsListTypeAndText()
;We already have the name as a constant, which we use to determine if we are in the notifications list:
colBrl.name = objn_Notifications_list
BrailleRefresh()
IndicateControltype(wt_listbox,objn_Notifications_list)
SayObjectActiveItem()
EndFunction

int function InPhotosList()
if IsCommonFocusException() return false endIf
var
	int type = GetObjectSubtypeCode(),
	int parentType = GetObjectSubtypeCode(false,1)
if type != wt_unknown
&& type != wt_listBoxItem
	return false
endIf
if parentType == wt_listBox
	;Check for structure of empty photos list:
	if GetObjectSubtypeCode(false,2) != wt_groupBox
		return false
	endIf
	return StringTrimExcessChars(GetObjectName(false,2)) == objn_Photos_list
elif parentType == wt_groupBox
	;Check for structure of non-empty photos list:
	if GetObjectSubtypeCode(false,2) != wt_listBox
	|| GetObjectSubtypeCode(false,3) != wt_groupBox
		return false
	endIf
	return StringTrimExcessChars(GetObjectName(false,3)) == objn_Photos_list
endIf
return false
EndFunction

void function SayPhotosListTypeAndText()
;We already have the name as a constant, which we use to determine if we are in the Photos list:
colBrl.name = objn_Photos_list
BrailleRefresh()
IndicateControltype(wt_listbox,objn_Photos_list)
SayObjectActiveItem()
EndFunction

int function InLayoutList()
if IsCommonFocusException()
|| GetObjectSubtypeCode() != wt_listBoxItem
|| GetObjectSubtypeCode(false,1) != wt_groupBox
|| GetObjectSubtypeCode(false,2) != wt_listBox
	return false
endIf
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.focus
;move up twice:
if !treeWalker.gotoParent() return false endIf
if !treeWalker.gotoParent() return false endIf
return treeWalker.currentElement.automationID == automation_layout_list
EndFunction

int function OnListItemSeparator()
if IsCommonFocusException() return false endIf
var
	int parentType
if GetObjectSubtypeCode() != wt_separator
	return false
endIf
parentType = GetObjectSubtypeCode(false,1)
return parentType == wt_extendedSelect_listBox
	|| parentType == wt_groupBox
EndFunction

int function OnTweetReactionButton()
if IsCommonFocusException() return false endIf
return colWin8People.focus.automationId == automation_ItemReactionButton_listItem
EndFunction

int function InReactionList()
if IsCommonFocusException() return false endIf
if colWin8People.focus.controlType != UIA_ListItemControlTypeId return false endIf
if colWin8People.focus.automationId == automation_ItemReactionButton_listItem
|| colWin8People.parent.automationId == automation_ItemCommentList_list
	return true
endIf
;not all the lists have useful automation id's, so look for an identifyable control:
var object condition = UIA_Win8People.CreateStringPropertyCondition(UIA_AutomationIdPropertyId,automation_itemCommentInput_edit)
if colWin8People.grandParent.FindFirst(treeScope_children,condition)
	return true
endIf
return false
EndFunction

void function SayReactionListTypeAndText()
IndicateControlType(wt_listBox,colWin8People.parent.name)
if colWin8People.focus.automationId == automation_ItemReactionButton_listItem
	;This list item acts like a button:
	IndicateControlType(wt_button,colWin8People.focus.name)
else ;it's a normal list item:
	Say(colWin8People.focus.name,ot_line)
endIf
Say(GetFocusItemPositionFromUIADescription(),ot_position)
endFunction

int function InSearchEdit()
return !IsCommonFocusException()
	&& GetObjectSubtypeCode() == wt_edit
	&& GetObjectSubtypeCode(false,1) == wt_groupBox
	&& GetObjectName(false,1) == objn_SearchBox_group
EndFunction

int function ElementIsSearchControl(object element)
if !element
|| !UIA_Win8People
|| !colWin8People.app
	return false
endIf
if element.automationId == automation_searchControlId_group return true endIf
;FindFirst with scope of ancestor does not work,
;so traverse with treewalker:
var object treewalker = colWin8People.treeWalker
if !treewalker return cscNull endIf
treeWalker.currentElement = element
while treewalker.gotoParent()
	if treeWalker.currentElement.automationId == automation_searchControlId_group
		return true
	elif UIA_Win8People.CompareElements(treeWalker.currentElement,colWin8People.app) == UIATrue
		return false
	endIf
endWhile
return false
EndFunction

int function InMessageEdit()
if IsCommonFocusException() return false endIf
var int type = GetObjectSubtypeCode()
if type  != wt_edit
&& type != wt_multiline_edit
	return false
endIf
var object element = colWin8People.focus
if !element return false endIf
return element.automationID == automation_modernCanvasContent
	|| element.automationID == automation_itemCommentInput_edit
EndFunction

int function InDescriptiveLinkForButton()
if IsCommonFocusException()
|| GetObjectSubtypeCode() != wt_unknown
|| GetObjectSubtypeCode(false,1) != wt_button
	return false
endIf
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.focus
if treeWalker.currentElement.controlType != UIA_GroupControlTypeId return false endIf
if !treeWalker.gotoPriorSibling return false endIf
return treeWalker.currentElement.controlType == UIA_HyperlinkControlTypeId
EndFunction

void function SayDescriptiveLinkForButtonTypeAndText()
var string text = StringTrimExcessChars(GetObjectName())
if text
	colBrl.name = text
	BrailleRefresh()
	IndicateControlType(wt_link,text)
endIf
EndFunction

int function InTileSelectorList()
return !IsCommonFocusException()
	&& colWin8People.focus.controlType == UIA_ListControlTypeId
	&& colWin8People.focus.automationId == automation_idDUIFlipView_list
EndFunction

void function SayTileSelectorListTypeAndText()
;The name of the list is the name of the UIA element,
;and the selected tile is the help text for the UIA element:
colBrl.name = StringTrimExcessChars(colWin8People.focus.name)
colBrl.value = StringTrimExcessChars(colWin8People.focus.helpText)
BrailleRefresh()
IndicateControlType(wt_listBox,colWin8People.focus.name)
Say(colWin8People.focus.helpText,ot_selected_item)
EndFunction

int function onTileSelectorButton()
return !IsCommonFocusException()
	&& colWin8People.focus.className == class_TouchButton
	&& (colWin8People.focus.automationId == automation_idRightButton
		|| colWin8People.focus.automationId == automation_idLeftButton)
EndFunction

string function GetPageTitle(optional int bAllowDuplicationOfTopLevelName)
if !UIA_Win8People
|| !colWin8People.processCondition
|| !colWin8People.treeWalker
	return cscNull
endIf
var object treeWalker = colWin8People.treeWalker
if !treeWalker return cscNull endIf
SetCurrentElementToFirstElement(UIA_Win8People,treeWalker)
var object element = treeWalker.currentElement
var string TopLevelName = StringTrimExcessChars(element.name)
var object condition = UIA_Win8People.CreateOrCondition(
	UIA_Win8People.CreateStringPropertyCondition(UIA_AutomationIdPropertyId,automation_idPeopleTitle),
	UIA_Win8People.CreateStringPropertyCondition(UIA_AutomationIdPropertyId,automation_idPeopleSecondaryTitle))
var object title = element.FindAll(TreeScope_Subtree,condition)
if !title || !title.count return cscNull endIf
var
	string pageName,
	int n,
	int i,
	string titleText
n = title.count
for i = 0 to n
	pageName = title(i).name
	pageName = StringTrimExcessChars(pageName)
	if pageName
	&& !bAllowDuplicationOfTopLevelName
	&& pageName == topLevelName
		pageName = cscNull
	endIf
	if pageName
		titleText = titleText+cscBufferNewLine+pageName
	endIf
endFor
return titleText
EndFunction

string function GetPageText()
if !UIA_Win8People
|| !colWin8People.processCondition
|| !colWin8People.treeWalker
	return cscNull
endIf
var object treeWalker = colWin8People.treeWalker
if !treeWalker return cscNull endIf
SetCurrentElementToFirstElement(UIA_Win8People,treeWalker)
var object element = treeWalker.currentElement
var object condition = UIA_Win8People.CreateStringPropertyCondition(UIA_AutomationIdPropertyId,automation_idPeopleBack)
var object backButton = element.FindFirst(TreeScope_Subtree,condition)
if !backButton return cscNull endIf
treeWalker.currentElement = backButton
var string s, string sText
while treeWalker.gotoNextSibling()
	element = treeWalker.currentElement
	if element.controlType == UIA_TextControlTypeId
	&& !element.automationId
		s = StringTrimExcessChars(element.name)
		if s
			sText = sText+s+cscBufferNewLine
		endIf
	endIf
endWhile
return sText
EndFunction

void function SayAnyHTMLTitleInformation()
if !IsVirtualPCCursor() then
	;Add any page title information:
	var string pageTitle = GetPageTitle()
	if pageTitle
		SayMessage(ot_user_requested_information,pageTitle)
	endIf
	return
endIf
SayAnyHTMLTitleInformation()
EndFunction

void function SayPaneNameTypeAndText(optional int saytype)
;Focus may land on the page title when switching screens.
;There may or may not be an additional focus event which puts the focus on a different element on the screen.
;For this reason, announcement of the type is optional.
;SayLine should say the type,
;but announcement on focus changes should not say the type.
if !colWin8People.focus.name return endIf
if sayType
	IndicateControlType(WT_APPLICATION ,colWin8People.focus.name)
else
	Say(colWin8People.focus.name,ot_dialog_name)
endIf
EndFunction

string function GetReadOnlyPageText()
if colWin8People.focus.controlType != UIA_PaneControlTypeID
|| colWin8People.parent.className != cwcIEServer
	return cscNull
endIf
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.focus
if !treeWalker.gotoFirstChild() return cscNull endIf
var
	string s,
	string text,
	string focusName = StringTrimExcessChars(colWin8People.focus.name),
	object treeScout = colWin8People.CreateTreeWalker(colWin8People.processCondition)
while true
	treeScout = treeWalker.currentElement
	s = StringTrimExcessChars(treeWalker.currentElement.name)
	if treeWalker.currentElement.controlType == UIA_TextControlTypeID
	&& focusName
	&& focusName != s
	&& !treeScout.gotoFirstChild
		text = text+s+cscBufferNewLine
	endIf
	if !treewalker.gotoNextSibling()
		return text
	endIf
endWhile
EndFunction

void function AnnouncePageReadOnlyText()
var string text = GetReadOnlyPageText()
if text
	say(text,ot_dialog_text)
	BrailleMessage(text)
endIf
EndFunction

void function SayMainScreenFavoritesListItem(int bActiveItemOnly)
var
	string name,
	string value,
	string position
name = StringTrimExcessChars(colWin8People.parent.name)
colBrl.name = name
if colWin8People.focus.controlType == UIA_ButtonControlTypeId
	value = StringTrimExcessChars(colWin8People.focus.name)
	colBrl.value = value+cscSpace+BrailleGetSubtypeString(wt_button)
else
	value = StringTrimExcessChars(GetTextInRange(colWin8People.focus))
	colBrl.value = value
endIf
position = GetFocusItemPositionFromUIADescription()
if position
	colBrl.position = position
endIf
BrailleRefresh()
if !bActiveItemOnly
	IndicateControlType(wt_listBox,name)
endIf
if colWin8People.focus.controlType == UIA_ButtonControlTypeId
	IndicateControlType(wt_button,value)
else
	Say(value,ot_line)
endIf
if !bActiveItemOnly
	sayUsingVoice(vctx_message,position,ot_position)
endIf
EndFunction

int function OnTweetListItem()
return !IsCommonFocusException()
	&& (StringStartsWith(colWin8People.focus.automationId,automation_twitter_prefix)
		|| StringStartsWith(colWin8People.focus.automationId,automation_facebook_prefix))
EndFunction

int function NavigatingTweets()
if IsCommonFocusException() return false endIf
return StringStartsWith(colWin8People.prevFocus.automationId,automation_twitter_prefix)
	&& StringStartsWith(colWin8People.focus.automationId,automation_twitter_prefix)
EndFunction

void function ParseTweetToCollection()
;parsing should only be done on focus change
var
	string WorkingCopyOfText,
	string line,
	int segmentStartPos,
	string segment,
	int tweetLineCount,
	int n,
	int i
WorkingCopyOfText = StringTrimExcessChars(colwin8People.focus.name)
if !WorkingCopyOfText
	CollectionRemoveAll(colTweet)
	return
endIf
;Clear the shortened header and info:
colTweet.abbrevHeader = cscNull
colTweet.abbrevInfo = cscNull
;Save members from previous tweet if applicable:
if CollectionItemExists(colTweet,"header")
	colTweet.prevHeader = colTweet.header
	colTweet.prevOrigin = colTweet.origin
endIf
;First two or three lines preceding the tweet text are the header:
segmentStartPos = StringContains(WorkingCopyOfText,"\r\n"+objn_tweetItem_ItSaid)
if !segmentStartPos
	CollectionRemoveAll(colTweet)
	return
endIf
segment = StringLeft(WorkingCopyOfText,segmentStartPos-1)
;trim off redundant text prefix in header:
if StringStartsWith(segment,objn_tweetItem_prefixedText)
	segment = StringChopLeft(segment,StringLength(objn_tweetItem_prefixedText))
endIf
colTweet.header = segment
WorkingCopyOfText = StringChopLeft(WorkingCopyOfText,segmentStartPos+1)
;abbreviated header starts with the entire header,
;and is chopped line by line until header and prev header do not match:
colTweet.abbrevHeader = colTweet.header
if colTweet.prevHeader
	i = 1
	n = StringSegmentCount(colTweet.header,"\n")
	while i <= n
		if StringSegment(colTweet.header,"\n",i) == StringSegment(colTweet.prevHeader,"\n",i)
			colTweet.abbrevHeader = StringChopLeft(colTweet.abbrevHeader,StringLength(StringSegment(colTweet.abbrevHeader,"\n",1))+1)
		else ;terminate loop
			i = n
		endIf
		i = i+1
	endWhile
endIf
;A tweet may contain multiple lines.
;And the info following the tweet consist of an unknown number of lines.
;Find where the tweet ends, and everything following it is the origin and the info.
;The actual text of the tweet is in a child element,
;so we can use it to determine the tweet text.
;Note that the line of text in the tweet item where the tweet text starts includes extra verbiage,
;specifically the text in objn_tweetItem_ItSaid.
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.focus
treeWalker.gotoFirstChild()
treeWalker.gotoNextSibling()
tweetLineCount = StringSegmentCount(treeWalker.currentElement.name,"\n")
n = StringSegmentCount(WorkingCopyOfText,"\n")-tweetLineCount
;origin is the first line segment after the tweet text:
colTweet.origin = StringSegment(WorkingCopyOfText,"\n",(-1)*n)+"\n"
;and the info is the rest:
var string Exclusions =
	objn_tweetItem_NotFavorited+"\r\n"
	+objn_tweetItem_NotRetweeted+"\r\n"
	+objn_tweetItem_NoReplies+"\r\n"
	+objn_tweetItem_noLikes+"\r\n"
	+objn_tweetItem_noComments+"\r\n"
var string abbrevSegment
n = n-1
segment = cscNull
for i = 1 to n
	line = StringSegment(WorkingCopyOfText,"\n",(-1)*i)
	segment = line+segment
	if !StringContains(Exclusions,line)
		if abbrevSegment
			abbrevSegment = "\n"+abbrevSegment
		endIf
		abbrevSegment = line+abbrevSegment
	endIf
	if i>1 && i<N
		segment = "\n"+segment
	endIf
endFor
colTweet.info = segment
colTweet.abbrevInfo = abbrevSegment
;everything else is treated as the tweet text
WorkingCopyOfText = StringChopRight(WorkingCopyOfText,StringLength(segment)+StringLength(colTweet.origin)+1)
colTweet.text = WorkingCopyOfText
;remove the "it said:" portion of the tweet if no abbreviated header information is to be spoken:
if !colTweet.abbrevHeader
	colTweet.text = StringChopLeft(colTweet.text,StringLength(objn_tweetItem_ItSaid))
endIf
;now get the position in the list for the tweet item:
var string position = GetFocusItemPositionFromUIADescription()
if position
	colBrl.position = position
	colTweet.position = position
endIf
BrailleRefresh()
EndFunction

void function SayTweetItem(optional int bReduceRedundancyWhenNavigating)
var
	string sTweet,
	object pattern,
	string position
if !bReduceRedundancyWhenNavigating
	IndicateControlType(wt_listBox,cscNull)
	Say(GetObjectName(),ot_line)
	Say(GetFocusItemPositionFromUIADescription(),ot_position)
	return
endIf
if colTweet.abbrevHeader
	Say(colTweet.abbrevHeader,ot_line)
endIf
Say(colTweet.text,ot_line)
if colTweet.origin != colTweet.prevOrigin
	Say(colTweet.origin,ot_line)
endIf
if colTweet.abbrevInfo
	Say(colTweet.abbrevInfo,ot_line)
endIf
EndFunction

int function ButtonMenuIsInTransition()
;This happens when transitioning between expanded and closed states
if GetObjectSubtypeCode() != wt_buttonMenu return false endIf
if GetObjectStateCode(false,1) & STATE_SYSTEM_MARQUEED
	return true
endIf
var object pattern = colWin8People.focus.GetLegacyIAccessiblePattern()
if pattern.state & STATE_SYSTEM_EXPANDED
	return true
endIf
var
	string objName = StringTrimLeadingBlanks(GetObjectName()),
	string UIAName = StringTrimLeadingBlanks(colWin8People.focus.name),
	string objHelp = StringTrimLeadingBlanks(GetObjectHelp()),
	string UIAHelp = StringTrimLeadingBlanks(colWin8People.focus.helpText)
if UIAHelp
&& UIAHelp != objHelp
	return true
elif UIAName
&& UIAName != objName
&& UIAName != objHelp
	return true
endIf
return false
EndFunction

int function InContactProfile()
return !IsCommonFocusException()
	&& colWin8People.parent.controlType == UIA_GroupControlTypeId
	&& colWin8People.parent.automationID == automation_contactViewContainer_group
EndFunction

string function GetContactProfileHeaderText()
var
	object treeWalker
treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.focus
while treeWalker.gotoPriorSibling()
	if treeWalker.currentElement.controlType == UIA_HeaderItemControlTypeId
		return StringTrimExcessChars(treeWalker.currentElement.name)
	endIf
endWhile
return cscNull
EndFunction

int function InEditContact()
return !IsCommonFocusException()
	&& colWin8People.parent.controlType == UIA_GroupControlTypeId
	&& colWin8People.parent.automationID == automation_EditContact
EndFunction

int function OnButtonMenuWithPopup()
if IsCommonFocusException()
|| GetObjectSubtypeCode() != wt_buttonMenu
	return false
endIf
var
	string name = GetObjectName(),
	string help = GetObjectHelp()
return StringContains(colWin8People.focus.ariaProperties,"haspopup=true")
	|| (help && name && help != name)
EndFunction

void function SayButtonMenuWithPopup()
var
	string name,
	string UIAName,
	string header
name = StringTrimExcessChars(GetObjectName())
UIAName = StringTrimExcessChars(colWin8People.focus.name)
if !UIAName
	;UIAName may be incorrectly blank if the app has just gained focus:
	UIAName = StringTrimExcessChars(GetObjectHelp())
endIf
if name != UIAName
&& name
&& UIAName
	name = UIAName+cscSpace+name
endIf
if InContactProfile()
	;Append the column header info to the name.
	;Note that these column headers would be best applied as group names,
	;but because they are at the same level in the UIA structure we have no convenient way of using them as groups.
	header = GetContactProfileHeaderText()
	if header
		name = name+cscSpace+header
	endIf
endIf
colBrl.name = name
BrailleRefresh()
IndicateControlType(wt_buttonMenu,name)
EndFunction

int function OnGroupParentOfLink()
;Focus goes to the group parent rather than the link.
if IsCommonFocusException() return false endIf
if colWin8People.focus.controlType != UIA_GroupControlTypeId return false endIf
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.focus
if !treeWalker.gotoFirstChild() return false endIf
return treeWalker.currentElement.controlType == UIA_HyperlinkControlTypeId
	&& colWin8People.parent.controlType == UIA_ListControlTypeId
EndFunction

int function OnFlyoutMenuItem()
return !IsCommonFocusException()
	&& StringStartsWith(colWin8People.focus.automationId,automation_flyoutMenuItem_prefix)
EndFunction

int function InCommunicationCommandLinkGroup()
return !IsCommonFocusException()
	&& colWin8People.focus.controlType == UIA_HyperlinkControlTypeId
	&& colWin8People.parent.controlType == UIA_GroupControlTypeId
	&& colWin8People.focus.automationId != automation_AllInfoCommand_link
	&& StringRight(colWin8People.focus.automationId,StringLength(automation_CommunicateWithCommand_Link_suffix))
		== automation_CommunicateWithCommand_Link_suffix
EndFunction

int function IsNavigatingCommunicationCommandLink()
if !InCommunicationCommandLinkGroup() return false endIf
return colWin8People.prevFocus.controlType == UIA_HyperlinkControlTypeId
	&& StringRight(colWin8People.prevFocus.automationId,StringLength(automation_CommunicateWithCommand_Link_suffix))
		== automation_CommunicateWithCommand_Link_suffix
EndFunction

void function SayCommunicateGroupTypeAndText()
;This is a group, not a list,
;but present it as a list so that user knows there may be multiple links to cursor through:
IndicateControlType(wt_listBox,StringTrimExcessChars(colWin8People.parent.name))
IndicateControlType(wt_link,colWin8People.focus.name)
EndFunction

void function SayPopupMenuTypeAndText()
var
	string name,
	object o
o = colWin8People.focus.labeledBy
if o
&& o.name
	name = StringTrimExcessChars(o.name)
endIf
colBrl.name = name
BrailleRefresh()
IndicateControlType(wt_menu,name)
EndFunction

int function OnSettingsAccountListItem()
return !IsCommonFocusException()
	&& colWin8People.focus.controlType == UIA_ListItemControlTypeId
	&& StringStartsWith(colWin8People.focus.automationID,automation_AccountItem_Prefix)
EndFunction

void function SayAccountListItemTypeAndText()
var
	object treewalker,
	string listName,
	string listValue
treewalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.parent
treeWalker.gotoPriorSibling()
treeWalker.gotoFirstChild()
listName = StringTrimExcessChars(treeWalker.currentElement.name)
if listName
	colBrl.name = listName
	IndicateControlType(wt_listBox,listName)
endIf
;do not use UIA name, it may sound like double speaking if the account name is the same as the user name:
listValue = GetObjectName()
colBrl.value = listValue
BrailleRefresh()
Say(listValue,ot_line)
Say(PositionInGroup(),ot_position)
EndFunction

int function OnAccountLinkingListItem()
return !IsCommonFocusException()
	&& colWin8People.focus.controlType == UIA_ListItemControlTypeId
	&& colWin8People.grandParent.automationID == automation_LinkingListView_List
EndFunction

void function SayAccountLinkingListItemTypeAndText()
;Do not speak the name of the parent group item as the list name:
IndicateControlType(wt_listBox,cscNull)
Say(colWin8People.focus.name,ot_line)
Say(PositionInGroup(),ot_position)
EndFunction

int function OnAccountLinkingLink()
return !IsCommonFocusException()
	&& colWin8People.focus.controlType == UIA_HyperlinkControlTypeId
	&& colWin8People.grandParent.automationID == automation_LinkingListView_List
EndFunction

void function SayLinkObjectTypeAndText()
var string text =StringTrimExcessChars(colWin8People.focus.name)
colBrl.name = text
BrailleRefresh()
IndicateControlType(wt_link,text)
EndFunction

int function InDropDownList()
if IsCommonFocusException()
|| colWin8People.focus.controlType != UIA_ListItemControlTypeId
	return false
endIf
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.parent
if treeWalker.currentElement != UIA_ListControlTypeId return false endIf
if !treeWalker.gotoParent return false endIf
if colWin8People.grandparent.controlType == UIA_PaneControlTypeId
	if !treeWalker.gotoParent return false endIf
endIf
return treeWalker.currentElement.controlType == UIA_ComboBoxControlTypeId
EndFunction

int function OnAccountSignInUserNameEdit()
return colWin8People.focus.automationId == automation_idTxtBx_IL_Username0_edit
EndFunction

void function SayAccountSignInUserNameEditTypeAndText()
IndicateControlType(wt_edit,colWin8People.focus.name)
Say(GetObjectValue(),ot_line)
endFunction

int function OnAccountSignInPasswordEdit()
return colWin8People.focus.automationId == automation_idTxtBx_IL_Password0_edit
EndFunction

void function SayAccountSignInPasswordEditTypeAndText()
IndicateControlType(wt_edit,colWin8People.focus.name)
Say(GetLine(),ot_line)
EndFunction

int function OnAccountProofConfirmationComboBox()
return colWin8People.parent.automationId == automation_idDd_SAOTCS_Proofs_ComboBox
EndFunction

void function SayAccountProofConfirmationComboBoxTypeAndText()
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.parent
treeWalker.gotoPriorSibling()
var string name = treeWalker.currentElement.name
;now add the dialog text.
;note that it would be better to use this next text as dialog page text,
;but the structure does not lend well to this.
treeWalker.gotoPriorSibling()
var string dlgText = treeWalker.currentElement.name
name = dlgText+cscBufferNewLine+name
colBrl.name = name
BrailleRefresh()
IndicateControlType(wt_comboBox,name)
Say(GetObjectValue(),ot_line)
EndFunction

int function OnAccountProofVerificationEdit()
return colWin8People.focus.automationId ==automation_idTxtBx_SAOTCS_ProofConfirmation_edit
EndFunction

void function SayAccountProofVerificationEditTypeAndText()
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.focus
treeWalker.gotoPriorSibling()
var string name = treeWalker.currentElement.name
colBrl.name = name
TreeWalker.gotoNextSibling()
TreeWalker.gotoNextSibling()
var string Desc = treeWalker.currentElement.name
colBrl.description = desc
BrailleRefresh()
IndicateControlType(wt_edit,name)
Say(GetObjectValue(),ot_line)
SayUsingVoice(vctx_message,desc,ot_smart_help)
EndFunction

int function OnAccountProofCodeEdit()
return colWin8People.focus.automationId == automation_idTxtBx_SAOTCC_OTC_edit
EndFunction

void function SayAccountProofCodeEditTypeAndText()
;add the dialog text to the prompt:
var object treeWalker = colWin8People.treeWalker
treeWalker.currentElement = colWin8People.focus
treeWalker.gotoPriorSibling()
var string dlgText = treeWalker.currentElement.name
var string name = colWin8People.focus.name
name = dlgText+cscBufferNewLine+name
colBrl.name = name
BrailleRefresh()
IndicateControlType(wt_edit,name)
Say(GetLine(),ot_line)
EndFunction

object function FindStatusBarElement()
if !colwin8People.app
|| !colWin8People.processCondition
|| !colWin8People.treeWalker
	return Null()
endIf
var object element = colWin8People.app
var object typeCondition =
		UIA_Win8People.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_StatusBarControlTypeId)
if !typeCondition return Null() endIf
return colWin8People.app.FindFirst(TreeScope_Descendants, typeCondition)
EndFunction

string function GetStatusBarText(optional object element)
if !element
	element = FindStatusBarElement()
	if !element return cscNull endIf
endIf
var object typeCondition =
		UIA_Win8People.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_TextControlTypeId)
if !typeCondition return cscNull endIf
var object textElements = element.FindAll(TreeScope_Descendants, typeCondition )
if !textElements
|| textElements.count == 0
	return cscNull
endIf
var
	string text,
	string s,
	int n,
	int i
n = (textElements.count)-1
for i = 0 to n
	s = textElements(i).name
	if s text = text+s+cscBufferNewLine endIf
endFor
return text
EndFunction

void function CheckForMessageBarStatusBar()
;When the app gains focus, there may be a status bar showing that the app is syncing.
;If so, the automation event cannot be used to announce the status bar
;since the event is attached after the app gains focus.
;This checks for the status bar and announces it if present.
var object oStatus = FindStatusBarElement()
if oStatus
&& oStatus.liveSetting
&& oStatus.automationId == automation_messageBarStatus_statusBar
	var string text = GetStatusBarText(oStatus)
	if text
		colSync.text = text
		colSync.lastTick = GetTickCount()
		SayUsingVoice(vctx_message,text,ot_screen_message)
		BrailleMessage(text)
	endIf
endIf
EndFunction

script SayBottomLineOfWindow()
var
	string text
if IsPCCursor()
&& !IsCommonFocusException()
	text = GetStatusBarText()
	if text
		Say(text,ot_user_requested_information)
	endIf
	return
endIf
PerformScript SayBottomLineOfWindow()
EndScript

void function GetClickablePointForFocusElement(int byRef x, int byRef y)
x = 0
y = 0
if !colWin8People.focus return EndIf
colWin8People.focus.GetClickablePoint( intRef(x), intRef(y))
EndFunction

void function BrailleRoutingButton(int nCell)
if BrailleIsStructuredLine()
&& OnTweetReactionButton()
	;clicking a routing button doesn't toggle the item,
	;so make sure that the braille cell column and row are at the UIA clickable point
	;and then send Enter instead of a routing click.
	var int x1, int x2, int y1, int y2
	x1 = GetBrailleCellColumn(nCell)
	y1 = GetBrailleCellRow(nCell)
	GetClickablePointForFocusElement(x2,y2)
	if x1==(x2)+1 && y1==(y2)+1
		EnterKey()
		return
	endIf
endIf
BrailleRoutingButton(nCell)
EndFunction

int function BrailleCallbackObjectIdentify()
if !GetObjectSubtypeCode()
	if OnGroupParentOfLink()
		;this is a more specific test than the test for parent type = list,
		;so be sure to test this condition before the test for parent = list.
		return wt_link
	elif GetObjectSubtypeCode(false,1) == wt_listBox
		return wt_ListBoxItem
	elif OnApplicationPagePane()
		return wt_static
	elif InDescriptiveLinkForButton()
		return wt_link
	endIf
endIf
if InCommunicationCommandLinkGroup()
|| OnAccountLinkingLink()
|| InTileSelectorList()
|| OnAddFavoriteButton()
	return wt_listBoxItem
elif OnPanelErrorText()
	return wt_static
elif OnTweetListItem()
	return WT_CUSTOM_CONTROL_BASE+1
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectContainerType(int subtype)
if subtype == wt_groupBox
	if OnGroupWhichShouldBeSilentForFocusObject()
	|| OnPanelErrorText()
	|| OnTweetListItem()
	|| OnAccountProofConfirmationComboBox()
	|| OnAccountProofVerificationEdit()
	|| OnAccountProofCodeEdit()
		;This is extraneous
		return true
	EndIf
EndIf
return BrailleAddObjectContainerType(subtype)
EndFunction

int function BrailleAddObjectContainerName(int subtype)
if subtype == wt_groupBox
	if OnGroupWhichShouldBeSilentForFocusObject()
	|| OnPanelErrorText()
	|| OnTweetListItem()
	|| OnAccountProofConfirmationComboBox()
	|| OnAccountProofVerificationEdit()
	|| OnAccountProofCodeEdit()
		;This is extraneous
		return true
	EndIf
EndIf
return BrailleAddObjectContainerName(subtype)
EndFunction

int function BrailleAddObjectName(int subtype)
var
	string name
if subtype == wt_edit
	if colBrl.name
		BrailleAddString(colBrl.name,0,0,0)
		return true
	endIf
elif subtype == wt_button
|| subtype == wt_buttonMenu
|| subtype == wt_link
	if colBrl.name
		var int x, int y
		GetClickablePointForFocusElement(x,y)
		BrailleAddString(colBrl.name,x,y,0)
		return true
	endIf
elif subtype == wt_listboxItem
	if colBrl.name
		BrailleAddString(colBrl.name,0,0,0)
		return true
	endIf
	if InNotificationsList()
		BrailleAddString(objn_Notifications_list,0,0,0)
		return true
	elif InPeopleExtendedSelectList()
		name = getObjectName(false,1)
		BrailleAddString(name,0,0,0)
		return true
	elif InCommunicationCommandLinkGroup()
		BrailleAddString(colWin8People.parent.name,0,0,0)
		return true
	elif OnAccountLinkingListItem()
		;do not add group name as list name:
		return true
	endIf
elif subtype == wt_comboBox
	if colBrl.name
		BrailleAddString(colBrl.name,0,0,0)
		return true
	endIf
elif subtype == wt_checkbox
	if OnUnNamedCheckBox()
		var string text = GetNameForUnNamedCheckBox()
		if text
			BrailleAddString(text,GetCursorCol(),GetCursorRow(),0)
			return true
		endIf
	endIf
endIf
return BrailleAddObjectName(subtype)
EndFunction

int function BrailleAddObjectValue(int subtype)
if subtype == wt_listboxItem
	var int x, int y
	GetClickablePointForFocusElement(x,y)
	if colBrl.value
		BrailleAddString(colBrl.value,x,y,0)
		return true
	elif colWin8People.focus.automationId == automation_ItemReactionButton_listItem
		BrailleAddString(StringTrimExcessChars(colWin8People.focus.name),x,y,attrib_highlight)
		BrailleAddString(BrailleGetSubtypeString(wt_button),0,0,0)
		return true
	elif InCommunicationCommandLinkGroup()
	|| OnAccountLinkingLink()
		BrailleAddString(StringTrimExcessChars(colWin8People.focus.name),x,y,attrib_highlight)
		BrailleAddString(BrailleGetSubtypeString(wt_link),0,0,0)
		return true
	endIf
elif subtype == wt_static
	if colWin8People.focus.name
		BrailleAddString(StringTrimExcessChars(colWin8People.focus.name),0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectValue(subtype)
EndFunction

int function BrailleAddObjectDescription(int subtype)
var
	string text
text = colBrl.description
if text
	BrailleAddString(text,0,0,0)
	return true
endIf
if subtype == wt_edit
	if InMessageEdit()
		;information from the status bar is output as the description component for message edits:
		text = GetStatusBarText()
		if text
			BrailleAddString(text,0,0,0)
			return true
		endIf
	endIf
elif subtype == wt_listboxItem
	if InMainScreenFavoritesGroup()
	|| OnAllContactsPage()
	|| InReactionList()
	|| InPeopleExtendedSelectList()
	|| InCommunicationCommandLinkGroup()
	|| OnSettingsAccountListItem()
	|| OnAccountLinkingListItem()
		;don't show the description, which is position in group text:
		return true
	endIf
endIf
return BrailleAddObjectDescription(subtype)
EndFunction

int function BrailleAddObjectPosition(int subtype)
if colBrl.position
	BrailleAddString(colBrl.position,0,0,0)
	return true
endIf
return BrailleAddObjectPosition(subtype)
EndFunction

int function BrailleAddObjectItemHeader(int subtype)
if subtype == WT_CUSTOM_CONTROL_BASE+1
	BrailleAddString(colTweet.header,0,0,0)
endIf
return true
EndFunction

int function BrailleAddObjectItemText(int subtype)
if subtype == WT_CUSTOM_CONTROL_BASE+1
	var int x, int y
	GetClickablePointForFocusElement(x,y)
	BrailleAddString(colTweet.text,x,y,0)
endIf
return true
EndFunction

int function BrailleAddObjectItemOrigin(int subtype)
if subtype == WT_CUSTOM_CONTROL_BASE+1
	BrailleAddString(colTweet.origin,0,0,0)
endIf
return true
EndFunction

int function BrailleAddObjectItemInfo(int subtype)
if subtype == WT_CUSTOM_CONTROL_BASE+1
	BrailleAddString(colTweet.info,0,0,0)
endIf
return true
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgWin8PeopleAppName)
EndScript

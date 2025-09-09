; Copyright 2023 by Freedom Scientific, Inc.
; MessageCenter script file

include "HjConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "MessageCenter.jsm"
include "UIA.jsh"

globals
	object goMessageCenter_Tree,
	object goMessageCenter_Root,
	object goMessageCenter_SearchBox,
	object goMessageCenter_MessagesListBox,
	int giScheduledAnnounceSearchResults,
	collection c_MessageCenterVerbosity

Const
	MessageCenterUIAEventPrefix = "MessageCenterUIA_",
	MessageCenterAnnounceSearchResultsDelay = 10, ;Tenths of a second
;Automation ID's
	AutomationID_SearchBox = "SearchBox",
	AutomationID_MessagesListBox = "MessagesListBox",
	AutomationID_DeleteButton = "DeleteButton",
	AutomationID_SettingsButton = "SettingsButton",
	AutomationID_SendNotificationsCheckBox = "SendNotificationsCheckBox",
	AutomationID_AnnouncementCategoryCheckBox = "AnnouncementCategoryCheckBox",
	AutomationID_EventsAndConferencesCategoryCheckBox = "EventsAndConferencesCategoryCheckBox",
	AutomationID_PodcastCategoryCheckBox = "PodcastCategoryCheckBox",
	AutomationID_PowerTipsCategoryCheckBox = "PowerTipsCategoryCheckBox",
	AutomationID_TrainingCategoryCheckBox = "TrainingCategoryCheckBox",
	AutomationID_UpdatesCategoryCheckBox = "UpdatesCategoryCheckBox",
	AutomationID_WhatsNewCategoryCheckBox = "WhatsNewCategoryCheckBox"

script scriptFileName ()
scriptAndAppNames (msgConfigName)
endScript

void function AutoStartEvent()
UIAInit()
InitVerbosityCollection()
endFunction

void function QuickSettingsPostprocess ()
QuickSettingsPostprocess ()
InitVerbosityCollection()
EndFunction

void function AutoFinishEvent()
ClearAllCollections()
EndFunction

void function ClearAllCollections()
collectionRemoveAll(c_MessageCenterVerbosity)
EndFunction

int Function UIAInit ()
goMessageCenter_Tree = null()
goMessageCenter_Root = null()
goMessageCenter_SearchBox = null()
goMessageCenter_MessagesListBox = null()
goMessageCenter_Tree = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
goMessageCenter_Root = goMessageCenter_Tree.GetElementFromHandle(GetAppMainWindow(GetFocus()))
if !goMessageCenter_Tree || !goMessageCenter_Root
	return false
endIf
var object oSearchBoxCondition = goMessageCenter_Tree.CreateStringPropertyCondition(UIA_AutomationIDPropertyId, AutomationID_SearchBox)
goMessageCenter_SearchBox = goMessageCenter_Root.FindFirst(TreeScope_Descendants, oSearchBoxCondition)
goMessageCenter_Tree.AddPropertyChangedEventHandler(UIA_ValueValuePropertyId, goMessageCenter_SearchBox, TreeScope_Element)
var object oMessagesListBoxCondition = goMessageCenter_Tree.CreateStringPropertyCondition(UIA_AutomationIDPropertyId, AutomationID_MessagesListBox)
goMessageCenter_MessagesListBox = goMessageCenter_Root.FindFirst(TreeScope_Descendants, oMessagesListBoxCondition)
ComAttachEvents(goMessageCenter_Tree, MessageCenterUIAEventPrefix)
return true
endFunction

void function InitVerbosityCollection()
if !c_MessageCenterVerbosity 
	c_MessageCenterVerbosity = new collection
endif
c_MessageCenterVerbosity.MessageSayAll = GetNonJCFOption ("MessageSayAllVerbosity")
c_MessageCenterVerbosity.MessageLinkCount = GetNonJCFOption ("MessageLinkCountIndication")
EndFunction


int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if GetWindowClass (hwndFocus) == cwc_ChromeWindowClass
&& GetObjectSubTypeCode() == WT_DOCUMENT
	return true
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
endFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if IsReturningFromDeleteDialog(hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
	UIARefresh (true);ensure correct positionInGroup information after deleting a message
endIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)	
	EndFunction

int function IsReturningFromDeleteDialog(handle hwndPrevFocus, int nPrevObject, int nPrevChild, int nChangeDepth)
if nChangeDepth == 2
&& nPrevObject == -4
&& !nPrevChild
&& GetWindowClass (hwndPrevFocus) == cwn2
&& GetObjectAutomationId (1) == AutomationID_MessagesListBox
	return true
endIf
return false
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
;Prevent dialog title being spoken redundantly when tabbing out of WebView
if nLevel == 1 && GetObjectSubTypeCode(false, nLevel) == WT_UNKNOWN
	return
endIf
SayObjectTypeAndText(nLevel, includeContainerName)
if GetObjectSubTypeCode() == WT_LISTBOX
	var int messageListCount = GetMessageListCount()
	if messageListCount == 0
		Say(msgListBoxZeroItems, OT_POSITION)
	endIf
endIf
endFunction

void function MessageCenterUIA_PropertyChangedEvent(object element, int propertyID, variant newValue)
if propertyID == UIA_ValueValuePropertyId
	if element.automationID == AutomationID_SearchBox
		if StringIsBlank(NewValue)
			UnscheduleAnnounceSearchResults()
		else
			ScheduleAnnounceSearchResults()
		endIf
	endIf
endIf
endFunction

void function ScheduleAnnounceSearchResults()
UnscheduleAnnounceSearchResults()
giScheduledAnnounceSearchResults = ScheduleFunction("AnnounceSearchResults", MessageCenterAnnounceSearchResultsDelay)
endFunction

void function UnscheduleAnnounceSearchResults()
if giScheduledAnnounceSearchResults
	UnscheduleFunction(giScheduledAnnounceSearchResults)
	giScheduledAnnounceSearchResults = 0
endIf
endFunction

void function AnnounceSearchResults()
var int messageListCount = GetMessageListCount()
if (messageListCount == 0)
	SayFormattedMessageWithvoice (VCTX_MESSAGE, OT_NO_DISABLE, msgNoMatchesFound_L, msgNoMatchesFound_S)
elif (messageListCount == 1)
	SayFormattedMessageWithvoice (VCTX_MESSAGE, OT_NO_DISABLE, msgOneMatchFound_L, msgOneMatchFound_S)
else
	SayFormattedMessageWithvoice (VCTX_MESSAGE, OT_NO_DISABLE, 
		FormatString(msgMatchesFound_L, messageListCount),
		FormatString(msgMatchesFound_S, messageListCount))
endIf
EndFunction

int function GetMessageListCount()
var object oListItemCondition = goMessageCenter_Tree.CreateIntPropertyCondition(UIA_ControlTypePropertyID, UIA_ListItemControlTypeId)
var object oFirstListItem = goMessageCenter_MessagesListBox.findFirst(TreeScope_Children, oListItemCondition)
if (!oFirstListItem)
	return 0
else
	return oFirstListItem.SizeOfSet
endIf
endFunction

void Function DocumentLoadedEvent()
if ShouldMessageLinkCountSpeak()
	var	int iLinkCount = GetLinkCount()
	if iLinkCount>0
		if shouldItemSpeak (OT_HELP) == MESSAGE_LONG
			SayUsingVoice(vctx_message,FormatString(msgMessageLinkCount,IntToString(iLinkCount)),ot_help)
		else
			SayUsingVoice(vctx_message,FormatString(msgMessageLinkCount_S,IntToString(iLinkCount)),ot_help)
		endIf
	EndIf
EndIf
if ShouldMessageSayAll()
	performScript SayAll()
endIf
EndFunction

Int Function ShouldMessageSayAll()
return c_MessageCenterVerbosity.MessageSayAll
endFunction

Int Function ShouldMessageLinkCountSpeak()
return c_MessageCenterVerbosity.MessageLinkCount
endFunction

script ScreenSensitiveHelp()
var
	string currentObjectAutomationID = GetObjectAutomationID(),
	string parentObjectAutomationID = GetObjectAutomationID(1)
if UserBufferIsActive () || InHJDialog() || GlobalMenuMode then
	PerformScript ScreenSensitiveHelp()
	Return
endIf
if currentObjectAutomationID == AutomationID_MessagesListBox
	|| parentObjectAutomationID == AutomationID_MessagesListBox then
	ShowScreenSensitiveHelp(msgMessagesListBox_ScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_SearchBox then
	ShowScreenSensitiveHelp(msgSearchBox_ScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_DeleteButton then
	ShowScreenSensitiveHelp(msgDeleteButton_ScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_SettingsButton then
	ShowScreenSensitiveHelp(msgSettingsButton_ScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_SendNotificationsCheckBox then
	ShowScreenSensitiveHelp(msgSendNotificationsCheckBox_ScreenSensitiveHelp)
elif currentObjectAutomationID == AutomationID_AnnouncementCategoryCheckBox
	|| currentObjectAutomationID == AutomationID_EventsAndConferencesCategoryCheckBox
	|| currentObjectAutomationID == AutomationID_PodcastCategoryCheckBox
	|| currentObjectAutomationID == AutomationID_PowerTipsCategoryCheckBox
	|| currentObjectAutomationID == AutomationID_TrainingCategoryCheckBox
	|| currentObjectAutomationID == AutomationID_UpdatesCategoryCheckBox
	|| currentObjectAutomationID == AutomationID_WhatsNewCategoryCheckBox then
	ShowScreenSensitiveHelp(msgCategoryCheckbox_ScreenSensitiveHelp)
else
	PerformScript ScreenSensitiveHelp()
endIf
endScript

int function BrailleAddObjectValue (int nSubtypeCode)
var
	string sName,
	string sText,
	int iHighlightState
if GetObjectAutomationId (1) == AutomationID_MessagesListBox
	sName = GetObjectName ()
	if StringSegment (sName, scCommaSeparator, 1) == scUnreadFlag
		sText = StringSegmentReplace (sName, scCommaSeparator, 1, MsgBrlFlagUnread)
		if GetControlAttributes() & CTRL_SELECTED then
			iHighlightState = Attrib_highlight
		endIf
		BrailleAddString (sText, GetCursorCol(), GetCursorRow(), iHighlightState)
		return true
	endIf
endIf
return BrailleAddObjectValue (nSubtypeCode)
EndFunction

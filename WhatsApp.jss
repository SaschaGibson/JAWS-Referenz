; Copyright 2022 - 2023 by Freedom Scientific, Inc.
; What'sApp script file

include "HjConst.jsh"
include "WhatsApp.jsm"
include "HjHelp.jsh"
include "common.jsm"
include "UIA.jsh"
import "QuickSet.jsd"
import "UIA.jsd"

globals
	object goWhatsApp_Tree,
	object goWhatsApp_Root,
	object goWhatsApp_LastMessage,
	string gsWhatsApp_LastMessage,
	string gsWhatsApp_TypingSound,
	int giIntroSpoken,
	int giScheduledTypingMonitor,
	int giScheduledUpdateRecentMessage,
	int giWhatsApp_LastTick,
;Preferences
	int giWhatsApp_Auto,
	int giWhatsApp_TypingSounder

Const
	WhatsAppUIAEventPrefix = "WhatsAppUIA",
	TypingMonitorRepeat = 5,
	WhatsAppUpdateRecentMessageDelay = 3,;amount of time to wait when scheduling UpdateRecentMessage
;classes
	Class_WhatsApp = "Windows.UI.Core.CoreWindow",
	Class_TextBlock = "TextBlock",
;Automation ID's
	AutomationID_ChatList = "ChatList",
	AutomationID_MessagesList = "MessagesList",
	AutomationID_TitleButton = "TitleButton",
	AutomationID_BubbleListItem = "BubbleListItem",
	AutomationID_PrimaryName = "PrimaryNameTextBlock",
	AutomationID_SubtitleBlock = "SubtitleBlock",
	AutomationID_RecordVoiceMessage = "RightButton",
	AutomationID_SendVoiceMessage = "SendVoiceMessageButton",
	AutomationID_PauseRecording = "PttPauseButton",
	AutomationID_ResumeRecording = "PttResumeButton",
	AutomationID_PlayPauseRecording = "ButtonArea",
	AutomationID_DiscardRecording = "PttDeleteButton",
	AutomationID_PlaybackSpeed = "PlaybackSpeedButton",
	AutomationID_TextBox = "InputBarTextBox",
	AutomationID_TextBlock = "TextBlock",
	AutomationID_AudioCallButton = "AudioCallButton",
	AutomationID_VideoCallButton = "VideoCallButton",
	AutomationID_AttachButton = "AttachButton",
	AutomationID_Navigation = "NavigationList"


Void function AutoStartEvent()
	if !UIAInit()
		SayMessage(OT_MESSAGE, MsgInitFailed)
	EndIf
LoadNonJCFOptions ()
if InOpenChat ()
	giScheduledUpdateRecentMessage = ScheduleFunction ("UpdateRecentMessage", WhatsAppUpdateRecentMessageDelay, false)
endIf
if GetVerbosity() == BEGINNER
&& !giIntroSpoken
	SayFormattedMessage (OT_Message, MSGIntroL, cmsgSilent)
	giIntroSpoken = true
EndIf
EndFunction

Void Function LoadNonJCFOptions ()
; WhatsApp Settings
giWhatsApp_Auto = GetNonJCFOption("AutoMessages")
giWhatsApp_TypingSounder = GetNonJCFOption("TypingSounder")
gsWhatsApp_TypingSound = FindJAWSSoundFile ("msn_typing.wav", 0)
; default
LoadNonJCFOptions()
EndFunction

Void function AutoFinishEvent()
if giScheduledTypingMonitor
	UnScheduleFunction (giScheduledTypingMonitor)
	giScheduledTypingMonitor = 0
endIf
if giScheduledUpdateRecentMessage
	UnScheduleFunction (giScheduledUpdateRecentMessage)
	giScheduledUpdateRecentMessage = 0
endIf
NullAllUIAObjects()
gsWhatsApp_LastMessage = cscNull
EndFunction

void function NullAllUIAObjects()
goWhatsApp_Root = null()
goWhatsApp_Tree = Null()
goWhatsApp_LastMessage = Null()
endFunction

Object Function getMainWindowComponent (string automationID)
var
	object condition = goWhatsApp_Tree.CreateStringPropertyCondition(UIA_AutomationIDPropertyID, automationID),
	object oElement = goWhatsApp_Root.FindFirst(TreeScope_Children, condition)
return oElement
EndFunction

HANDLE Function GetWhatsAppWindow ()
return GetAppMainWindow(GetFocus())
EndFunction

int Function UIAInit ()
NullAllUIAObjects()
goWhatsApp_Tree = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
goWhatsApp_Root = goWhatsApp_Tree.GetElementFromHandle(GetWhatsAppWindow())
if !goWhatsApp_Tree || !goWhatsApp_Root return false endIf
var object oCondition = goWhatsApp_Tree.CreateStringPropertyCondition(UIA_AutomationIDPropertyId, AutomationID_Navigation)
goWhatsApp_Root = goWhatsApp_Root.FindFirst(TreeScope_Descendants, oCondition)
goWhatsApp_Tree.AddPropertyChangedEventHandler(UIA_NamePropertyID, goWhatsApp_Root, TreeScope_Subtree)
goWhatsApp_Tree.AddStructureChangedEventHandler(goWhatsApp_Root, TreeScope_Subtree)
ComAttachEvents(goWhatsApp_Tree, WhatsAppUIAEventPrefix)
return true
EndFunction

Void Function SpeakMessagesAuto (string sMessage)
SayMessage(OT_MESSAGE, sMessage)
BrailleMessage (sMessage, 0)
EndFunction

string function SanitizeMessageString(string sMessage)
;Remove character 8206
;This is a zero-width control character
;It is used to explicitly indicate that the time is left-to-right
sMessage = StringRemoveCharsInRange (sMessage, 8206, 8206)
sMessage = StringRemoveCharsInRange (sMessage, 57344, 63743);Private Use Area
sMessage = StringRemoveCharsInRange (sMessage, 983040, 1048573);Supplementary Private Use Area-A
sMessage = StringRemoveCharsInRange (sMessage, 1048576, 1114109);Supplementary Private Use Area-B
return sMessage
EndFunction

string Function TrimStatusFromMessage(object oMessage)
var string sMessage = SanitizeMessageString(oMessage.name)
if FSUIAGetFirstChildOfElement (oMessage).AutomationID == AutomationID_PrimaryName
	;This is a message that is a reply
	;If it contains a status, it will be in the middle after the time but before the quoted message
	var
		object oAutomationCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, AutomationID_TextBlock),
		object oClassCondition = FSUIACreateStringPropertyCondition(UIA_ClassNamePropertyID, Class_TextBlock),
		object oAndCondition = FSUIACreateAndCondition(oAutomationCondition, oClassCondition),
		string sTime = oMessage.findFirst(TreeScope_Children, oAndCondition).name,
		string s1,
		string s2,
		int iTimeIndex,
		int iS2index,
		int iColonIndex,
		int iCommaSpaceIndex
	sTime = SanitizeMessageString(sTime)
	sTime = scCommaSpaceSeparator + sTime + scCommaSpaceSeparator;reduce chance of matching time contained in message rather than time of message
	iTimeIndex = StringContains (sMessage, sTime)
	iS2index = iTimeIndex + StringLength(sTime)
	s2 = SubString (sMessage, iS2index, StringLength(sMessage));status (if present) and quoted message
	s1 = stringChopRight (sMessage, StringLength(s2));message reply and time
	iCommaSpaceIndex = StringContains (s2, scCommaSpaceSeparator)
	iColonIndex = StringContains (s2, cscColon)
	if iCommaSpaceIndex > 0
	&& iCommaSpaceIndex < iColonIndex
		;Contains a status that needs to be removed
		s2 = stringChopLeft (s2, iCommaSpaceIndex+StringLength(scCommaSpaceSeparator)-1)
	endIf
	return s1 + s2
endIf
;Message does not contain reply, status will be at end
var int iLengthToChop = StringLength(StringSegment (sMessage, scTimeSeparator, -1))
if iLengthToChop > 0
	iLengthToChop = iLengthToChop - 2;add back last 2 digits of time
	return stringChopRight (sMessage, iLengthToChop);message minus any status
endIf
return sMessage
EndFunction

Void Function TypingSounder (object SoundElement)
if !giWhatsApp_TypingSounder return endIf
if SoundElement.AutomationID == AutomationID_SubtitleBlock && SoundElement.name == scTyping
	PlaySound (gsWhatsApp_TypingSound)
	giScheduledTypingMonitor = ScheduleFunction ("TypingMonitor", TypingMonitorRepeat, false)
EndIf
EndFunction

Void Function TypingMonitor ()
if giScheduledTypingMonitor
	UnScheduleFunction (giScheduledTypingMonitor)
	giScheduledTypingMonitor = 0
endIf
if !giWhatsApp_TypingSounder return endIf
var object oTitleButton = getMainWindowComponent(AutomationID_TitleButton)
If !oTitleButton Return EndIf
var
	object oStatusCondition = goWhatsApp_Tree.CreateStringPropertyCondition (UIA_AutomationIdPropertyID, AutomationID_SubtitleBlock),
	object oStatus = oTitleButton.FindFirst (TreeScope_Children, oStatusCondition)
	If !oStatus Return EndIf
if oStatus.name == scTyping
	PlaySound (gsWhatsApp_TypingSound)
	giScheduledTypingMonitor = ScheduleFunction ("TypingMonitor", TypingMonitorRepeat, false)
EndIf
EndFunction

void Function WhatsAppUIAStructureChangedEvent (object element, int eventID)
if element.AutomationID != AutomationID_BubbleListItem
|| (EventID != StructureChangeType_ChildAdded
&& EventID != StructureChangeType_ChildRemoved)
|| element.PositionInSet != element.SizeOfSet
|| element.SizeOfSet < 1
|| element.hasKeyboardFocus
|| StringIsBlank(element.name)
	return
EndIf
var string NewValue = TrimStatusFromMessage(element)
if StringCompare (NewValue, gsWhatsApp_LastMessage, true) == 0
	return
endIf
if element.PositionInSet > goWhatsApp_LastMessage.SizeOfSet
	if giWhatsApp_Auto
		SpeakMessagesAuto (NewValue)
	endIf
	if giScheduledUpdateRecentMessage
		UnScheduleFunction (giScheduledUpdateRecentMessage)
		giScheduledUpdateRecentMessage = 0
	endIf
	goWhatsApp_LastMessage = element
	gsWhatsApp_LastMessage = NewValue
endIf
EndFunction

Void Function WhatsAppUIAPropertyChangedEvent (object element, int PropertyID, variant NewValue)
giWhatsApp_LastTick = GetTickCount ();Keep track of last event time to avoid prematurely updating goWhatsApp_LastMessage
TypingSounder(Element)
if element.ControlType == UIA_EditControlTypeID
&& element.AutomationID == AutomationID_TextBox
&& element.className == "RichEditBox"
	;Clear LastMessage variables when switching chats:
	gsWhatsApp_LastMessage = cscNull
	goWhatsApp_LastMessage = Null()
	;Schedule function to update goWhatsApp_LastMessage once list has finished populating:
	giScheduledUpdateRecentMessage = ScheduleFunction ("UpdateRecentMessage", WhatsAppUpdateRecentMessageDelay, false)
	return
endIf
if PropertyId != UIA_NamePropertyID
|| element.AutomationID != AutomationID_BubbleListItem
|| element.PositionInSet != element.SizeOfSet
|| element.SizeOfSet < 1
|| element.hasKeyboardFocus
|| StringLength (element.name) != StringLength (NewValue)
|| StringIsBlank(NewValue)
	return
EndIf
NewValue = TrimStatusFromMessage(element)
if StringCompare (NewValue, gsWhatsApp_LastMessage, true) == 0
	return
endIf
if element.PositionInSet >= goWhatsApp_LastMessage.SizeOfSet
	if giWhatsApp_Auto
		SpeakMessagesAuto (NewValue)
	endIf
	if giScheduledUpdateRecentMessage
		UnScheduleFunction (giScheduledUpdateRecentMessage)
		giScheduledUpdateRecentMessage = 0
	endIf
	goWhatsApp_LastMessage = element
	gsWhatsApp_LastMessage = NewValue
endIf
EndFunction

String Function GetRecentMessage (int iRecentMessage)
MessageListMoveToMostRecentMessage ()
var
	int iMaxIterations = 10,
	int iCount = 0
while iCount < iMaxIterations
&& !UpdateRecentMessage()
	iCount = iCount + 1
	;If the message list has not finished populating, pause and check again
	Pause ()
endWhile
if iRecentMessage < 1
|| iRecentMessage > 9
	return
endIf
if iRecentMessage == 1
	return SanitizeMessageString(goWhatsApp_LastMessage.name)
endIf
var
	object treewalker = FSUIARawViewWalker (),
	object oCondition = goWhatsApp_Tree.createStringPropertyCondition(UIA_AutomationIDPropertyID, AutomationID_TextBlock),
	int i = 1
treewalker.currentElement = goWhatsApp_LastMessage	
while i < iRecentMessage
&& treewalker.GoToPriorSibling()
	if treewalker.currentElement.findFirst(TreeScope_Children, oCondition)
		;Elements that are messages we want to count will have a child with AutomationID_TextBlock.
		;Elements we do not want to count, such as those used as date headers, will not have this AutomationID
		i = i + 1
	endIf
endWhile
if i != iRecentMessage
	;Ran out of prior siblings or elements with AutomationID_TextBlock before reaching desired message
	return cscNull
endIf
return SanitizeMessageString(treewalker.currentElement.name)
EndFunction

int Function UpdateRecentMessage ()
var int iTickDiff = GetTickCount () - giWhatsApp_LastTick
giWhatsApp_LastTick = GetTickCount ()
if giScheduledUpdateRecentMessage
	;UpdateRecentMessage may be called directly from other functions
	;Unschedule to prevent having unnecessary duplicate scheduled functions
	;If a scheduled UpdateRecentMessage is needed, it will be handled later in this function
	UnScheduleFunction (giScheduledUpdateRecentMessage)
endIf
giScheduledUpdateRecentMessage = 0
if iTickDiff < 50
	;Message list may not be done populating
	;Schedule function to check again shortly
	giScheduledUpdateRecentMessage = ScheduleFunction ("UpdateRecentMessage", WhatsAppUpdateRecentMessageDelay, false)
	return false
endIf
if goWhatsApp_LastMessage
	;In case the global variable is set but not holding the most recent message object
	;This will likely be faster than using UIA find methods
	var object treewalker = FSUIARawViewWalker ()
	treewalker.currentElement = goWhatsApp_LastMessage
	while treewalker.goToNextSibling()
	endWhile
	;Using findFirst with TreeScope_Element ensures that the name property of the element is updated in cases where the global variable already contains the most recent message object
	goWhatsApp_LastMessage = treewalker.currentElement.findFirst(TreeScope_Element, FSUIARawViewCondition ())
	if !StringIsBlank(goWhatsApp_LastMessage.name)
		return true
	endIf
	goWhatsApp_LastMessage = Null();message was deleted but global still contains an object, null and find most recent below
endIf
var
	object oHistory  = getMainWindowComponent(AutomationID_MessagesList),
	object oFirst,
	int iSizeOfSet,
	object oCondition
if !oHistory return false endIf
	oFirst = FSUIAGetFirstChildOfElement (oHistory)
iSizeOfSet = oFirst.SizeOfSet
oCondition = FSUIACreateIntPropertyCondition (UIA_PositionInSetPropertyId, iSizeOfSet)
goWhatsApp_LastMessage = oHistory.findFirst(TreeScope_Children, oCondition)
if !goWhatsApp_LastMessage return false endIf
return true
EndFunction

int Function InOpenChat ()
return getMainWindowComponent(AutomationID_TitleButton).isEnabled == UIATrue
EndFunction

int Function MessageListMoveToMostRecentMessage ()
var
	object oButtonCondition = goWhatsApp_Tree.CreateIntPropertyCondition(UIA_ControlTypePropertyID, UIA_ButtonControlTypeID),
	object oNameCondition = goWhatsApp_Tree.CreateStringPropertyCondition(UIA_NamePropertyID, scMostRecent),
	object oAndCondition = goWhatsApp_Tree.CreateAndCondition(oButtonCondition, oNameCondition),
	object oButton = goWhatsApp_Root.findFirst(TreeScope_Children, oAndCondition)
if oButton.isEnabled
	oButton.GetInvokePattern().invoke
	return true
endIf
return false
EndFunction

Script RecordVoiceMessage ()
if !InOpenChat ()
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
var object oEditField = getMainWindowComponent(AutomationID_TextBox)
if oEditField
	if !StringIsBlank(FSUIAGetFocusedDocumentTextRangeText (oEditField))
		;When the chat edit field contains text there is no record button.
		;However, the button for sending the text uses the same AutomationID
		;Return early to prevent accidentally sending potentially undesired text.
		SayMessage (OT_ERROR, msgRecordingUnavailable_L, msgRecordingUnavailable_S)
		return
	endIf
	var object oRecordVoiceMessage = getMainWindowComponent(AutomationID_RecordVoiceMessage)
	If oRecordVoiceMessage
		oRecordVoiceMessage.GetInvokePattern().Invoke
		return
	endIf
endIf
var object oPauseRecording = getMainWindowComponent(AutomationID_PauseRecording)
If oPauseRecording
	oPauseRecording.GetInvokePattern().Invoke
	return
endIf
var object oResumeRecording = getMainWindowComponent(AutomationID_ResumeRecording)
if oResumeRecording
	oResumeRecording.GetInvokePattern().Invoke
	return
EndIf
EndScript

Script SendVoiceMessage ()
if !InOpenChat ()
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
var object oSendVoiceMessage = getMainWindowComponent(AutomationID_SendVoiceMessage)
if !oSendVoiceMessage
	;There is an open chat but no recording to send
	SayMessage (OT_ERROR, msgNoRecording_L, msgNoRecording_S)
	return
endIf
oSendVoiceMessage.GetInvokePattern().Invoke
EndScript

Script PlayPauseRecording ()
if !InOpenChat ()
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
var Object oPlayPauseRecording = getMainWindowComponent(AutomationID_PlayPauseRecording)
if !oPlayPauseRecording
	SayMessage (OT_ERROR, msgNoRecording_L, msgNoRecording_S)
	return
endIf
oPlayPauseRecording.GetInvokePattern().Invoke
EndScript

Script DiscardVoiceMessage ()
if !InOpenChat ()
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
var object oDiscardRecording = getMainWindowComponent(AutomationID_DiscardRecording)
if !oDiscardRecording
	SayMessage (OT_ERROR, msgNothingToDiscard_L, msgNothingToDiscard_S)
	return
endIf
oDiscardRecording.GetInvokePattern().Invoke
EndScript

Script SpeedVoiceMessage ()
if !InOpenChat ()
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
If GetObjectAutomationId (0) != AutomationID_BubbleListItem
	Say (MsgNoPlayVoiceMessage, OT_Error)
	Return
EndIf		
		var object oFocusElement =goWhatsApp_Tree.GetFocusedElement()
var object oSpeedCondition = goWhatsApp_Tree.CreateStringPropertyCondition(UIA_AutomationIDPropertyID, AutomationID_PlaybackSpeed)

var object oVoiceMessageSpeed = oFocusElement.FindFirst(TreeScope_Children, oSpeedCondition)
oVoiceMessageSpeed.GetInvokePattern().Invoke
Delay (5, 1)
oFocusElement.SetFocus()
	EndScript
	
Script MoveToChatList ()
getMainWindowComponent(AutomationID_ChatList).SetFocus()
EndScript

Script MoveToEditField ()
if !InOpenChat ()
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
var object oEditField = getMainWindowComponent(AutomationID_TextBox)
if !oEditField
	return
endIf
oEditField.SetFocus()
EndScript

Script MoveToHistory ()
var object oHistory = getMainWindowComponent(AutomationID_MessagesList)
if !oHistory.isEnabled
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
MessageListMoveToMostRecentMessage ()
var
	int iMaxIterations = 10,
	int iCount = 0
while iCount < iMaxIterations
&& !UpdateRecentMessage()
	iCount = iCount + 1
	;If the message list has not finished populating, pause and check again
	Pause ()
endWhile
if iCount == iMaxIterations;Message list did not finish populating in a reasonable amount of time
|| !goWhatsApp_LastMessage;goWhatsApp_LastMessage is unexpectedly not set for some other reason
	;Just set focus to the message list
	oHistory.SetFocus()
else
	;Message list is fully populated, set focus to most recent message
	goWhatsApp_LastMessage.SetFocus()
endIf
EndScript

Script SpeakNameAndStatus ()
var object oTitleButton = getMainWindowComponent(AutomationID_TitleButton)
If !oTitleButton
	SayMessage(OT_MESSAGE, MsgNoStatus)
	Return
EndIf
if !oTitleButton.isEnabled
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
var object PersonCondition = goWhatsApp_Tree.CreateStringPropertyCondition (UIA_ClassNamePropertyId, Class_TextBlock)
var object oPerson = oTitleButton.FindFirst(TreeScope_Children, PersonCondition)
var string sName = oPerson.name
BeginFlashMessage()
SayMessage (OT_USER_REQUESTED_INFORMATION, sName)
var object StatusCondition = goWhatsApp_Tree.CreateStringPropertyCondition (UIA_AutomationIdPropertyID, AutomationID_SubtitleBlock)
var object oStatus = oTitleButton.FindFirst (TreeScope_Children, StatusCondition)
var string sStatus = oStatus.name
SayMessage(OT_USER_REQUESTED_INFORMATION, sStatus)
EndFlashMessage()
EndScript

Script SpeakMessageOnDemand (int iMsg)
if !InOpenChat ()
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
Var string sMessage = GetRecentMessage(iMsg)
BeginFlashMessage()
	SayMessage(OT_USER_REQUESTED_INFORMATION, sMessage)
EndFlashMessage()
EndScript

Script AudioCall ()
var object oCallButton = GetMainWindowComponent(AutomationID_AudioCallButton)
if !oCallButton.isEnabled
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
oCallButton.GetInvokePattern().Invoke
EndScript

Script VideoCall ()
var object oVideoButton = GetMainWindowComponent(AutomationID_VideoCallButton)
if !oVideoButton.isEnabled
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
oVideoButton.GetInvokePattern().Invoke
EndScript

Script Attach ()
var object oAttachButton = GetMainWindowComponent(AutomationID_AttachButton)
if !oAttachButton.isEnabled
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
var object oPattern = oAttachButton.GetTogglePattern()
if !oPattern.toggleState
	oPattern.Toggle()
endIf
EndScript

Script VirtualizeMessageONDemand (int iMsg)
if !InOpenChat ()
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
Var string sMessage = GetRecentMessage(iMsg)
SayMessage(OT_USER_BUFFER, sMessage)
EndScript

script scriptFileName ()
scriptAndAppNames (msgConfigName)
endScript

script WindowKeysHelp ()
If UserBufferIsActive ()
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (OT_USER_BUFFER, msgWhatsAppWindowKeysHelp, msgWhatsAppWindowKeysHelp)
endScript

 Script HotKeyHelp ()
	If UserBufferIsActive ()
		UserBufferDeactivate()
	EndIf
	UserBufferClear()
	SayFormattedMessage(OT_User_Buffer, MSGWhatsAppHotkeyHelp)
EndScript

script ControlDelete()
TypeKey(ksDeleteWord) ;Instead of TypeCurrentScriptKey, so additional key assignments to script will work
Pause()
if CaretVisible()
	SayWord()
EndIf
EndScript

Script ControlBackSpace()
If IsVirtualPcCursor ()
&& UserBufferIsActive ()
	Return
EndIf
if CaretVisible()
	var	string sText = getPriorWord()
	if sText
		SayMessage(ot_line, sText)
	else
		Say(cmsgBlank1,ot_screen_message)
	EndIf
endIf
TypeKey(ksControlBackSpace) ;Instead of TypeCurrentScriptKey, so additional key assignments to script will work
EndScript

int function GetImageRect(int byref iLeft, int byref iTop, int byref iRight, int byref iBottom)
var 
	object oPopup = FSUIAGetPriorSiblingOfElement(goWhatsApp_Root),
	object oImageTypeCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ImageControlTypeId),
	object oImage
	
if oPopup
	var object oListCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ListControlTypeId)
	var object oList = oPopup.FindFirst(TreeScope_Children, oListCondition)
	if !oList
		return false
	endIf
	
	var object oOnScreenCondition = FSUIACreateBoolCondition(UIA_IsOffscreenPropertyId,false)
	var object findCondition = FSUIACreateAndCondition (oImageTypeCondition, oOnScreenCondition)
	oImage = oList.FindFirst(TreeScope_Descendants, findCondition)
	if !oImage
		return false
	endIf
else
	var object oFocus = FSUIAGetFocusedElement()
	if !oFocus
		return false
	endIf

	oImage = oFocus.FindFirst(TreeScope_Children, oImageTypeCondition)
endIf

if !UIAElementHasValidRect (oImage)
	return false
endIf

iLeft = oImage.BoundingRectangle.left
iTop = oImage.BoundingRectangle.top
iRight = oImage.BoundingRectangle.right
iBottom = oImage.BoundingRectangle.bottom
return true
endFunction

void function PictureSmartAllInOneWhatsApp(int serviceOptions)
var
	int left, int top, int right, int bottom
if GetImageRect(left, top, right, bottom)
	PictureSmartWithAreaShared(serviceOptions, left, top, right, bottom)
	return
endIf
PerformScript PictureSmartWithControl(serviceOptions)
EndFunction

script PictureSmartAllInOne (optional int serviceOptions)
PictureSmartAllInOneWhatsApp (serviceOptions)
endScript

script PictureSmartAllInOneAskPrelim ()
PerformScript PictureSmartAllInOne(PSServiceOptions_AskPrelim)
endScript

script PictureSmartAllInOneMultiService (optional int serviceOptions)
PerformScript PictureSmartAllInOne (PSServiceOptions_Multi | serviceOptions)
endScript

script PictureSmartAllInOneMultiServiceAskPrelim ()
PerformScript PictureSmartAllInOneMultiService(PSServiceOptions_AskPrelim)
endScript

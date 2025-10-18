; Copyright 1995-2018 by Freedom Scientific, Inc.
;Skype script file

include "hjConst.jsh"
include "HjHelp.jsh"
include "common.jsm"
include "MSAAConst.jsh"
include "Skype.jsh"
include "Skype.jsm"
include "UIA.jsh"

;use "IA2Browser.jsb"


import "UIA.jsd"

GLOBALS
	int SkypeDesktopApplicationHasFocus,
	int nSuppressEcho,
	object SkypeUIA,
	int suppressAncestorProcessing,
	int FocusRedirectUsingTab,
	collection LastBackgroundNotification, ; from Default
	int NotificationTimer


handle function getSkypeDesktopMainWindow ()
; keep Skype from looking in the system top level windows when Skype is already in focus:
;override from VoIPHelper.jss
return getAppMainWindow (getFocus ())
endFunction

int function GetWindowsNotificationTextFromHandle(handle hWnd, string byRef NotificationText)
var int result = GetWindowsNotificationTextFromHandle(hWnd, NotificationText)
if stringContains (notificationText, "Skype") then unscheduleFunction (NotificationTimer) endIf
return result
endFunction

int function SupportsEditCallbacks ()
if ! getObjectSubtypeCode () && ! stringIsBlank (getObjectName ()) then
; custom static areas including incoming call and chat history list.
	return FALSE
endIf
return SupportsEditCallbacks ()
endFunction

int function CaretVisible ()
if ! getObjectSubtypeCode () && ! stringIsBlank (getObjectName ()) then
; custom static areas including incoming call and chat history list.
	return FALSE
endIf
return CaretVisible ()
endFunction

string function getActiveConversationName ()
var object startElement = FSUIAGetElementFromHandle (getRealWindow (getFocus ()))
if ! startElement then return cscNull endIf
var object condition = FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_ButtonControlTypeId)
if ! condition then return cscNull endIf
var object elementArray = startElement.findAll(TREESCOPE_SUBTREE, condition)
if ! elementArray || ! elementArray.Count then return cscNull endIf
; since we can't ask in a condition object to see if the Legacy iAccessible Description property has anything in it,
; and the profile name button is the last one who has this description property ...
var object element, int i;
for i=0 to elementArray.Count -1
	if elementArray(i).getPropertyValue(UIA_LegacyIAccessibleDescriptionPropertyId) then
		element = elementArray(i)
		if stringContains (element.name, Name_Profile) then
			i = elementArray.count+1
		else ; probably the "Use Dialpad" or something
			element = null ()
		endIf
	endIf
endFor
var string name = element.getPropertyValue(UIA_LegacyIAccessibleDescriptionPropertyId)
name = stringTrimLeadingBlanks (stringTrimTrailingBlanks (name))
return name
endFunction

string function UIAGetDialogStaticText ()
var string text = cscNull
if ! dialogActive () then return text endIf
var object focusElement = FSUIAGetFocusedElement ()
if ! focusElement then return text endIf
var object parentElement = fsUIAGetParentOfElement (focusElement).BuildUpdatedCache()
if ! parentElement then return text endIf
var string parentClassName = parentElement.className 
if parentClassName == UIAClass_Root 
|| parentClassName == "Progman" then
	parentElement = focusElement
endIf
if ! parentElement then return text endIf
var object condition = FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_TextControlTypeId)
if ! condition then return text endIf
var object elements = parentElement.findAll(TREESCOPE_SUBTREE, condition)
if ! elements || ! elements.count then return text endIf
var string tmp, int i
var object textElement
for i = 0 to elements.count-1
	textElement = elements(i)
	tmp = textElement.name
	if text then text = text + cscSpace endIf
	text = text+tmp
endFor
return text
endFunction

int function BrailleCallbackObjectIdentify ()
if ! getObjectSubtypeCode () && ! stringIsBlank (getObjectName ()) then return WT_STATIC endIf
return BrailleCallbackObjectIdentify ()
endFunction

int function BrailleAddObjectValue (int type)
if type != WT_STATIC return BrailleAddObjectValue (type) endIf
if type == getObjectSubtypeCode () then return BrailleAddObjectValue (type) endIf
var string text = getObjectName ()
if ! stringIsBlank (text) then
	BrailleAddString (text, 0,0,0)
	return TRUE
else
	return BrailleAddObjectValue (type)
endIf
endFunction

int function BrailleAddObjectDescription (int type)
var string description
if ! dialogActive () description = UIAGetDialogStaticText () endIf
if stringIsBlank (description) then description = getObjectDescription () endIf
if stringIsBlank (description) then return BrailleAddObjectDescription (type) endIf
var string name = getObjectName ()
if stringStartsWith (description, name) then
	description = stringChopLeft (description, stringLength (name))
	description = stringTrimLeadingBlanks (description)
endIf
BrailleAddString (description, 0,0,0)
return TRUE
endFunction

void function sayObjectTypeAndText(optional int Level, int includeContainerName)
; Helps avoid some extra speech.
if getObjectValue(False, Level) == "file:///Index.html"
; getObjectSubtypeCode should return WT_Document here but does not always do so.
|| getObjectRole (level) == ROLE_SYSTEM_DOCUMENT then
	if level == 0 then say (getObjectName (), OT_CONTROL_NAME) endIf
	return
endIf
if level == 0 && getObjectSubtypeCode () == WT_DOCUMENT then
; focus has just changed to the Skype application.
; This is a bit different since MSAAMode option is set to 3, just like Chrome web browser.
	if ! dialogActive () then
		say (getActiveConversationName (), OT_CONTROL_NAME)
	endIf
	; This causes the current item with focus to read rather than the document.
	scheduleFunction ("SayObjectTypeAndText", 0)
	return
elIf level == 0 && ! getObjectSubtypeCode () then
; probably chat history list.
; want to avoid saying "region"
	say (getObjectName (), OT_CONTROL_NAME)
	return
endIf
sayObjectTypeAndText(Level, includeContainerName)
if getObjectSubtypeCode (FALSE, level) == WT_DIALOG then
	say (UIAGetDialogStaticText (), OT_DIALOG_TEXT)
endIf
endFunction

void function SayWindowTitleForApplication(handle hAppWindow, handle hRealWindow, handle hCurrentWindow, int iTypeCode)
; usually used for extra browser window functionality,
; in this case just used for conversation name.
beginFlashMessage ()
SayWindowTitleForApplication(hAppWindow, hRealWindow, hCurrentWindow, iTypeCode)
var string conversationName = getActiveConversationName ()
if stringIsBlank (conversationName) then
; on Skype home screen:
	SayMessage (OT_USER_REQUESTED_INFORMATION, cmsg2_L)
else
	sayMessage (OT_USER_REQUESTED_INFORMATION, conversationName)
endIf
endFlashMessage ()
endFunction

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow,handle PrevWindow)
var
	int shouldProcessAncestors
if suppressAncestorProcessing then
	suppressAncestorProcessing = FALSE
	shouldProcessAncestors = FALSE
else
	shouldProcessAncestors = FocusChangedEventShouldProcessAncestors(FocusWindow,PrevWindow)
endIf
return shouldProcessAncestors
endFunction

int function IgnoreObjectAtLevel (int level)
var int objectSubtypeCode = getObjectSubtypeCode (0, level)
if ! objectSubtypeCode || objectSubtypeCode == WT_DOCUMENT then return TRUE endIf
var string name = getObjectName (0, level)
if stringCompare (name, GetWindowName (getRealWindow (getFocus ())), TRUE) == 0 then
; keep it from saying "Skype preview" a bunch of times:
	return TRUE
endIf
return IgnoreObjectAtLevel (level)
endFunction

void function HookSkypeEvents ()
SkypeUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if ! SkypeUIA then return endIf
if ! ComAttachEvents (SkypeUIA, "SkypeUIA") then return endIf
var object 	element = SkypeUIA.GetElementFromHandle(getAppMainWindow (GetFocus()))
var int scope = TreeScope_Descendants
SkypeUIA.AddAutomationEventHandler( UIA_StructureChangedEventId, Element, Scope)
SkypeUIA.AddAutomationEventHandler( UIA_StructureChangedEventId, Element, Scope)
SkypeUIA.AddAutomationEventHandler( UIA_LiveRegionChangedEventId, Element, Scope)
endFunction

void function AutoStartEvent ()
suppressAncestorProcessing = FALSE
SkypeDesktopApplicationHasFocus = TRUE
;HookSkypeEvents () ; ; only needed if LiveRegionEvent doesn't suffice anymore. 
ShowSoundMixerDiscoveryDialog()
endFunction

void function AutoFinishEvent ()
unscheduleFunction (NotificationTimer)
suppressAncestorProcessing = FALSE
SkypeDesktopApplicationHasFocus = FALSE
ComDetachEvents (SkypeUIA)
comRelease (SkypeUIA)
SkypeUIA = null ()
endFunction

int function setFocusToFirstFocusableChild ()
var object element = FSUIAGetFocusedElement ().buildUpdatedCache()
if ! element return FALSE endIf
var object condition = FSUIACreateBoolCondition(UIA_IsKeyboardFocusablePropertyId, UIATrue)
if ! condition return FALSE endIf
var object foundForFocus = element.findFirst(TreeScope_descendants,condition)
if ! foundForFocus return FALSE endIf
if foundForFocus.SetFocus() then
	foundForFocus = foundForFocus.buildUpdatedCache()
	return TRUE
endIf
return FALSE
endFunction

int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if nSuppressEcho then
	nSuppressEcho = FALSE
	return TRUE
endIf
if (getObjectSubtypeCode () == WT_DOCUMENT
|| getObjectRole () == ROLE_SYSTEM_DOCUMENT)
&& getObjectValue() == "file:///Index.html" then
; Skype focus bug where focus went to parent instead of the first focusable child,
; one instance being after you dismiss an incoming call.
	if setFocusToFirstFocusableChild () then return TRUE endIf
endIf
if hwndFocus == hwndPrevFocus
&& nObject == nPrevObject
&& getObjectRole () == ROLE_SYSTEM_DOCUMENT then
; FocusChange is firing twice and the first is invalid:
	suppressAncestorProcessing = TRUE
	return TRUE
endIf
if FocusRedirectUsingTab then
; because there is no good way to set focus when doing the navigation keys we provide.
; UIA does not let us set focus on lists where the previous selection is selected,
; meaning it only focuses on item 1. 
;So we want to tab in this case without speaking.
	FocusRedirectUsingTab = FALSE
	delay (2,FALSE)
	TabKey ()
	; to compensate for earlier versions of Skype where there's a "ghost" control.
	var int objectSubtypeCode = getObjectSubtypeCode ()
	if (objectSubtypeCode != WT_REGION && objectSubtypeCode != WT_GROUPBOX)
	|| ! getObjectName () 
			TabKey ()
			if getObjectName () == scClearText then
			; We need to move once more in order to get to the list
			FocusRedirectUsingTab = TRUE
			endIf
	endIf
	return TRUE
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
endFunction

Void Function DescriptionChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldDescription, string
	sNewDescription,optional int bFromFocusObject)
if bFromFocusObject && getObjectSubtypeCode () == WT_Switch then
; nObjType supplied by parameter to this function is 0, where the focused object actually exists as switch.
	return ; ObjStateChangedEvent is a better handler for this.
endIf
return DescriptionChangedEvent (hwnd, objId, childId, nObjType, sOldDescription, sNewDescription, bFromFocusObject)
endFunction

void function LiveRegionEvent (object element)
; from the UIA events, if HookSkypeEvents function call is uncommmented in AutoStartEvent.
; LiveRegions should already get most of this.
var string text = element.name
if stringIsBlank (text) then return endIf
var collection notificationRuleActions = ProcessNotification(text, "Skype")
LastBackgroundNotification = notificationRuleActions
if notificationRuleActions.ExcludeFromNotificationHistory then
	StoreSpokenNotificationForRepeat (text, "Skype") ; for new insert+Space&N keystroke.
endIf
NotificationTimer = scheduleFunction ("IndicateNotification", 2)
endFunction

void function IndicateNotification ()
SayNotification (LastBackgroundNotification, OT_JAWS_MESSAGE)
endFunction

void function SkypeUIAAutomationEvent (object element, int eventID)
; from the UIA events, if HookSkypeEvents function call is uncommmented in AutoStartEvent.
; LiveRegions should already get most of this.
unscheduleFunction (NotificationTimer)
if eventID == UIA_LiveRegionChangedEventId then
	return LiveRegionEvent (element)
endIf
if element.controlType != UIA_PaneControlTypeId then return endIf
var string text = element.name
if stringIsBlank (text) then return endIf
LastBackgroundNotification = ProcessNotification(text, "Skype")
NotificationTimer = scheduleFunction ("IndicateNotification", 2)
endFunction

int function SpeakLiveRegionEvent(string text, int suggestedOutputType, int containsSpeechMarkup)
; Note: this gets called at the time the speech queue element is spoken. 
; You may override the Output type but do not Flash this in Braille if structured mode is enabled 
;as it may be presented in the structured data.
; return true if we speak from here, false to defer to internals.
var collection notificationRuleActions = ProcessNotification(text, "Skype")
LastBackgroundNotification = notificationRuleActions
if !notificationRuleActions.ExcludeFromNotificationHistory then
	StoreSpokenNotificationForRepeat (text, "Skype") ; for new insert+Space&N keystroke.
endIf
return FALSE
endFunction

void function SayLineUnit(int unitMovement, optional int bMoved)
if ! isPcCursor () || UserBufferIsActive () || inHjDialog ()
|| getObjectSubtypeCode () || stringIsBlank (getObjectName ()) then
	return sayLineUnit (UnitMovement, bMoved) 
endIf
return
endFunction

Void Function GetTextInfoForControlBackSpace (string ByRef text)
text = GetPriorWord (false)
EndFunction

Script ControlBackSpace ()
var	string sText
GetTextInfoForControlBackSpace(sText)
if sText
	SayMessage(ot_line,sText)
endIf
TypeCurrentScriptKey ()
EndScript

script scriptFileName ()
var string appNameString = formatString (msgSkypeVersion, getProgramVersion (GetAppFilePath ()))
scriptAndAppNames (appNameString)
endScript

script ReadBoxInTabOrder ()
if SayCursorMovementException (UnitMove_Current) performScript ReadBoxInTabOrder () return endIf
if ! UIAGetDialogStaticText () performScript ReadBoxInTabOrder () return endIf
var string UIADlgText = UIAGetDialogStaticText ()
if stringIsBlank (UIADlgText) performScript ReadBoxInTabOrder () return endIf
SayMessage(OT_ERROR, formatString(cMsg33_L,getObjectName (FALSE, 1)), cMsgSilent) ;<DialogName> dialog
say (UIADlgText, OT_DIALOG_TEXT)
; catch all known control types.
var object element = FSUIAGetParentOfElement (FSUIAGetFocusedElement ()).buildUpdatedCache()
if ! element return endIf
var object children = element.findAll(TreeScope_children,FSUIARawViewCondition())
if ! children || ! children.count return endIf
var object child, int i, int silenceHasFocusAnnouncement = TRUE
for i=0 to children.count-1
	child = children(i)
	if child.controlType && child.controlType != UIA_CustomControlTypeId then
		UIASayElement (child, silenceHasFocusAnnouncement)
	endIf
endFor
endScript

script SayLine ()
var string line = getObjectName ()
if ! isPcCursor () || UserBufferIsActive () || inHjDialog ()
|| getObjectSubtypeCode () || stringIsBlank (Line) then
	PerformScript SayLine ()
	return
endIf
if isSameScript () then
	spellString (line)
else
	say (line, OT_LINE)
endIf
endScript

script BackButton ()
var object window = fsUIAGetElementFromHandle (getAppMainWindow (getFocus ()))
if ! window then sayMessage (OT_ERROR, msgBackButtonNotAvailable) return endIf
var object controlTypeCondition = FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_ButtonControlTypeId)
if ! controlTypeCondition then sayMessage (OT_ERROR, msgBackButtonNotAvailable) return endIf
var object NameCondition = FSUIACreateStringPropertyCondition (UIA_NamePropertyId,Name_BackButton)
if ! NameCondition then sayMessage (OT_ERROR, msgBackButtonNotAvailable) return endIf
var object andCondition = FSUIACreateAndCondition (controlTypeCondition, NameCondition)
if ! andCondition then sayMessage (OT_ERROR, msgBackButtonNotAvailable) return endIf
var object backButton = window.FindFirst(treeScope_descendants,andCondition)
if ! backButton then sayMessage (OT_ERROR, msgBackButtonNotAvailable) return endIf
if ! backButton.GetInvokePattern().invoke() then sayMessage (OT_ERROR, msgBackButtonNotAvailable) return endIf
sayMessage (OT_CONTROL_NAME, msgBackButton)
endScript

Script MoveToChatEntryField ()
var object window = fsUIAGetElementFromHandle (getAppMainWindow (getFocus ()))
if ! window then sayMessage (OT_ERROR, msgChatWindowNotAvailable) return endIf
var object controlTypeCondition = FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_EditControlTypeId)
if ! controlTypeCondition then sayMessage (OT_ERROR, msgChatWindowNotAvailable) return endIf
var object NameCondition = FSUIACreateStringPropertyCondition (UIA_NamePropertyId,scChatEntryField)
if ! NameCondition then sayMessage (OT_ERROR, msgChatWindowNotAvailable) return endIf
var object Name2Condition = FSUIACreateStringPropertyCondition (UIA_NamePropertyId,scChatEntryField2)
if ! Name2Condition then sayMessage (OT_ERROR, msgChatWindowNotAvailable) return endIf
var object namesCondition = FSUIACreateOrCondition (NameCondition, Name2Condition)
if ! NamesCondition then sayMessage (OT_ERROR, msgChatWindowNotAvailable) return endIf
var object andCondition = FSUIACreateAndCondition (controlTypeCondition, namesCondition)
if ! andCondition then sayMessage (OT_ERROR, msgChatWindowNotAvailable) return endIf
var object editField = window.FindFirst(treeScope_descendants,andCondition)
if ! editField then sayMessage (OT_ERROR, msgChatWindowNotAvailable) return endIf
; set focus using legacy iAccessible,
; otherwise tying the first character in the edit field would send the focus to the top of the Skype window.
var object editFieldFromMSAA = editField.getLegacyIAccessiblePattern().getIAccessible()
var int focusWasSet
if editFieldFromMSAA then
	editFieldFromMSAA.accSelect(SelFlag_TakeFocus, 0)
	focusWasSet = TRUE
else
	focusWasSet = editField.SetFocus() ; default to UIA if MSAA truly did fail.
	editField = editField.buildUpdatedCache()
endIf
if ! focusWasSet then sayMessage (OT_ERROR, msgChatWindowNotAvailable) return endIf
endScript

Script MoveToChatHistoryList ()
var object window = fsUIAGetElementFromHandle (getAppMainWindow (getFocus ()))
if ! window then sayMessage (OT_ERROR, msgChatHistoryNotAvailable) return endIf
var object controlTypeCondition = FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_ButtonControlTypeId)
if ! controlTypeCondition then sayMessage (OT_ERROR, msgChatHistoryNotAvailable) return endIf
var object NameCondition = FSUIACreateORCondition (
	FSUIACreateStringPropertyCondition (UIA_NamePropertyId,scCreateNewGroup),
	FSUIACreateStringPropertyCondition (UIA_NamePropertyId,scClearText)
)
if ! NameCondition then sayMessage (OT_ERROR, msgChatHistoryNotAvailable) return endIf
var object andCondition = FSUIACreateAndCondition (controlTypeCondition, nameCondition)
if ! andCondition then sayMessage (OT_ERROR, msgChatHistoryNotAvailable) return endIf
var object buttonToFind = window.FindFirst(treeScope_descendants,andCondition)
if ! buttonToFind then sayMessage (OT_ERROR, msgChatHistoryNotAvailable) return endIf
if ! ButtonToFind.SetFocus() then sayMessage (OT_ERROR, msgChatWindowNotAvailable) return endIf
ButtonToFind = ButtonToFind.buildUpdatedCache()
delay (2,TRUE)
FocusRedirectUsingTab = TRUE
sayMessage (OT_JAWS_MESSAGE, msgMoveToHistoryList)
endScript

Script MoveToConversationsList ()
var object window = fsUIAGetElementFromHandle (getAppMainWindow (getFocus ()))
if ! window then sayMessage (OT_ERROR, msgConversationsListNotAvailable) return endIf
var object controlTypeCondition = FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_GroupControlTypeId)
if ! controlTypeCondition then sayMessage (OT_ERROR, msgConversationsListNotAvailable) return endIf
var object NameCondition = FSUIACreateStringPropertyCondition (UIA_NamePropertyId,scConversationsList)
if ! NameCondition then sayMessage (OT_ERROR, msgConversationsListNotAvailable) return endIf
var object andCondition = FSUIACreateAndCondition (controlTypeCondition, NameCondition)
if ! andCondition then sayMessage (OT_ERROR, msgConversationsListNotAvailable) return endIf
var object conversationsList = window.FindFirst(treeScope_descendants,andCondition)
if ! conversationsList then sayMessage (OT_ERROR, msgConversationsListNotAvailable) return endIf
if ! conversationsList.SetFocus() then sayMessage (OT_ERROR, msgConversationsListNotAvailable) return endIf
conversationsList = conversationsList.buildUpdatedCache()
delay (2, TRUE)
FocusRedirectUsingTab = TRUE
sayMessage (OT_JAWS_MESSAGE, msgMoveToConversationsList)
endScript

script hotKeyHelp ()
sayFormattedMessage (OT_USER_BUFFER, msgHotKeyHelpSkype8Plus)
endScript

Script SkypeLayerHelp ()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (msgSkypeLayerHelpScreenTitle)
UserBufferAddTextResultsViewer(msgSkypeLayerHelp)
endScript

script WindowKeysHelp ()
sayMessage (OT_USER_BUFFER, msgWindowKeysHelp)
endScript

Script SkypeKeystrokesList ()
var
	int choice,
	string itemsList
itemsList = formatString(LIST_ITEM_CHAT_EDIT)+"|"
	+formatString(LIST_ITEM_CHAT_HISTORY)+"|"
	+formatString(LIST_ITEM_CONVERSATIONS)+"|"
choice = dlgSelectItemInList (itemsList, dlg_SkypeKeystrokesList_Title, TRUE)
delay (2, TRUE)
nSuppressEcho = TRUE
if choice == 0 then
	nSuppressEcho = FALSE; announce the current field on exit.
	return
elIf choice == 1 then
	performScript MoveToChatEntryField ()
	return
elIf choice == 2 then
	performScript MoveToChatHistoryList ()
	; Since the chat history list isn't really a control,
	; we have to fake it here because a JAWS dialog is disappearing:
	ShiftTabKey ()
	delay (2,TRUE)
	tabKey ()
	return
elIf choice == 3 then
	delay (1)
	performScript MoveToConversationsList ()
	return
else
	return
endIf
endScript

script ScreenSensitiveHelp ()
if isSameScript () then
	AppFileTopic (topic_Skype)
	return
endIf
PerformScript ScreenSensitiveHelp ()
endScript

script VirtualizeCurrentControl()
var
	string sText
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsVirtualPCCursor() then
	SayMessage(OT_ERROR,cmsgAlreadyVirtualized_L,cmsgAlreadyVirtualized_S)
	return
elif IsFormsModeActive() then
	SayMessage(OT_ERROR,cmsgVirtualizeUnavailableInFormsMode_L,cmsgVirtualizeUnavailableInFormsMode_S)
	return
endIf
sText = getObjectName ()
if !sText then
		let sText=GetTypeAndTextStringsForWindow(getFocus())
endIf
if !sText then
	SayMessage(OT_ERROR,cmsgNoTextToVirtualize_L,cmsgNoTextToVirtualize_S)
	return
endIf
SayMessage(ot_JAWS_Message,cmsgVirtualizeControl_L,cmsgVirtualizeControl_S)
UserBufferClear()
UserBufferAddText(sText)
UserBufferActivate()
SayLine()
endScript

script SendControlTextToClipboard ()
var
	string sText
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsFormsModeActive() then
	SayMessage(OT_ERROR,cmsgVirtualizeUnavailableInFormsMode_L,cmsgVirtualizeUnavailableInFormsMode_S)
	return
endIf
sText = getObjectName ()
if !sText then
	let sText=GetTypeAndTextStringsForWindow(getFocus())
endIf
if !sText then
	SayMessage(OT_ERROR,cmsgNoTextToVirtualize_L,cmsgNoTextToVirtualize_S)
	return
endIf
CopyToClipboard (sText)
sayMessage(ot_JAWS_Message,cmsgCopyControl_L,cmsgCopyControl_S)
endScript



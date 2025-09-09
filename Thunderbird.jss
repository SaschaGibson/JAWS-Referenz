; Copyright 2024 - 2025 Freedom Scientific, Inc.
; Script file for Mozilla Thunderbird Supernova e-mail client

Include "HJConst.jsh"
Include "MSAAConst.jsh"
include "iAccessible2.jsh"
include "UIA.jsh"
Include "HJGlobal.jsh"
Include "Common.jsm"
Include "Thunderbird.jsh"
include "Thunderbird.jsm"
include "Outlook.jsm"

import "UIA.jsd"

;UIA automation ID's:
const
; For message header reading while in an open message:
	id_messageHeader = "messageHeader",
	id_headerSenderToolbarContainer = "headerSenderToolbarContainer",
	id_expandedFromRow = "expandedfromRow",
	id_expandedToRow = "expandedtoRow",
	id_expandedCcRow = "expandedccRow",
	id_headerSubjectSecurityContainer = "headerSubjectSecurityContainer",
	id_expandedSubjectBox = "expandedsubjectBox",
	id_dateLabel = "dateLabel",
; For message header reading while in an editable message:
		id_editableMessageHeader = "MsgHeadersToolbar",
	id_fromField = "msgIdentity",
	id_toLabel = "toAddrLabel",
	id_ccLabel = "ccAddrLabel",
	id_subjectField = "msgSubject",
; For announcements in dialogs:
	ID_compactFoldersText = "compactFoldersText"

;Aria attribute values:
const
	aaClass_MessageListClass = "tree-table",
	aaClass_MessageListHeaderButtons = "tree-view-header-thread",
	aaID_FolderTree = "folderTree",
	aaClass_AddressPill = "address-pill"
	

; Timer and scheduling:
const
	AnnounceDeselectedStateForListboxes_WaitTime = 8  ;Tenths of a seconds
globals
	int AnnounceDeselectedStateForListboxes_ScheduleID

; for the browser tab pages, such as a message opened in a new tab or the Settings page,
; See WindowCreatedEvent and ProcessEventOnFocusChangedEventEx.
const
	BrowserWindow_MaxElapseTime = 700,  ;milliseconds
; Types of browser windows we know about:
	unknown_browserTabType = 0,  ; we either are not handling this type or it is not a tab page in a mozilla browser window
	message_browserTabType = 1,
	Settings_browserTabType = 2
globals
	int MozillaContentWindow_CreationTime,  ; The tick count for when the most recent MozillaContentWindowClass window was created.
	handle MozillaContentWindow_hWnd  ; The handle of the most recently created MozillaContentWindowClass window.


Void Function AutoStartEvent ()
if ShouldSwitchToLegacySettings()
	switchToConfiguration("Thunderbird Legacy")
	return
endIf

var int selectionContextFlags = (GetSelectionContextFlags ()|selCtxFormFields)
SetSelectionContextFlags (selectionContextFlags)
EndFunction

int Function ShouldSwitchToLegacySettings()
var
	string sVersionInfo = GetVersionInfoString (GetAppFilePath (), cmsg283_L),
	int iMajorVersion = StringToInt(StringSegment(sVersionInfo, ".", 1))
return iMajorVersion <= 102
EndFunction

void function loadNonJCFOptions ()
loadNonJCFOptions ()
If !gcOptions gcOptions = New Collection EndIf
gcOptions.HeadersAnnouncement = getNonJCFOption (HKEY_ANNOUNCE_HEADERS)
gcOptions.AutoReadingMessages = getNonJCFOption (HKEY_AUTO_READ_MESSAGE)
endFunction

Int Function InReadOnlyMessageBody()
if GetWindowClass (GetFocus ()) != cwc_MozillaContentWindowClass 
|| UserBufferIsActive()
	return false
endIf
var int level, int count = GetAncestorCount()
for level = 0 to count
	if GetObjectRole(level) == role_system_document
		return !(GetObjectIA2State(level) & IA2_state_editable)
	endIf
endFor
return false
EndFunction

int function InMessageList()
if UserBufferIsActive() return false endIf
if GetWindowClass(GetFocus()) != cwc_MozillaWindowClass return false endIf
var int type = GetObjectSubtypeCode()
if type != wt_row && type != wt_treeviewItem && type != wt_listBoxItem return false endIf
var int level = FindAncestorOfType(wt_grid)
if level <= 0
	level = FindAncestorOfType(wt_table)
endIf
if level <= 0 return false endIf
; The object IA2 attribute may contain more than one class, so only look for the class which should always be there for the message list:
var string classes = GetObjectIA2Attribute("class",level)
return StringSegmentIndex(classes,cscSpace, aaClass_MessageListClass) != 0
EndFunction

int function InFolderTree()
if UserBufferIsActive() return false endIf
if GetWindowClass(GetFocus()) != cwc_MozillaWindowClass return false endIf
var int level = FindAncestorOfType(wt_treeView)
if !level return false endIf
return GetObjectIA2Attribute("id",level) == aaID_folderTree
EndFunction

int function InMessageHeader()
var
	int level = FindAncestorOfType (WT_BANNER_REGION)
if level > 0
&& GetObjectIA2Attribute ("id", level) == id_messageHeader
	return true
endIf
return false
endFunction

int function OnMessageListHeaderToolBar()
if UserBufferIsActive() return false endIf
if GetWindowClass(GetFocus()) != cwc_MozillaWindowClass return false endIf
if GetObjectSubtypeCode() != wt_button return false endIf
return GetObjectIA2Attribute("class") == aaClass_MessageListHeaderButtons
EndFunction

int function OnMessageToolbar()
if UserBufferIsActive() return false endIf
if GetWindowClass(GetFocus()) != cwc_MozillaWindowClass return false endIf
return GetObjectRole(1) == ROLE_SYSTEM_TOOLBAR
EndFunction

int function OnAddressPill()
return GetWindowClass (GetFocus ()) == cwc_MozillaWindowClass
	&& !UserBufferIsActive()
	&& GetObjectIA2Attribute("class") == aaClass_AddressPill
EndFunction

void function InterruptSpeechIfAppropriateForMSAAAlertEvent()
; The Thunderbird default is to not download external content.
; If the message pane is showing, an alert is generated each time a message is moved to in the message list if Thunderbird block contents from downloading.
; We don't want to interrupt announcement of the current item when navigating the message list, so we will not interrupt speech for these alerts.
; We will, however, update the global variable for last alert time.
LastMSAAAlertTime = GetTickCount()
EndFunction

Void Function NameChangedEvent (handle hwnd, int objId, int childId, int nObjType,
	string sOldName, string sNewName)
if InMessageList()
	; If the message pane is showing, navigating in the message list often causes this function to fire.
	; This has the affect of causing double announcement of the item moved to.
	return
endIf
if GetObjectRole() == IA2_ROLE_FRAME
&& GetAncestorCount() < 2
	; When Thunderbird is run, focus goes to the application window.
	; A name change may fire to update the window,
	; and then a focus change will fire for the window.
	; The name change for the window along with the second focus change to the window has the affect of causing double speaking.
	; We will not announce this name change.
	return
endIf
NameChangedEvent (hwnd, objId, childId, nObjType, sOldName, sNewName)
EndFunction

int function ShouldIgnoreFocusChange(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
; This block must come before the test for hWndFocus != hWndPrevFocus,
; since messages can be set to open in a new window,
if GetObjectRole() == IA2_ROLE_FRAME
&& !(GetObjectIA2State() & IA2_STATE_ACTIVE)
	; Sometimes multiple focus events will fire when moving from the message list to a message or back.
	; In these cases, the first event typically does not have the IA2state active bit.
	; Filter out this event to prevent double speaking:
	return true
endIf
if (hWndFocus != hWndPrevFocus) return false endIf
var string sClass = GetWindowClass(hWndFocus)
if sClass != cwc_MozillaWindowClass return false endIf
; When navigating by large amounts in the message list, sometimes two focus change events fire.
; If that happens, the first event is for the list.
; The announcement of the list here may include incorrect index of the message.
if nChangeDepth == 0
&& GetObjectSubtypeCode() == wt_listbox
	return true
endIf
; When opening a message from the list,
; There may be more than one firing of the focus change.
; One of those instances may happen before the message browser window is ready.
; The ancestor count under these conditions is probably 2, However if the ancestorCount is 1 this is the application window.
if GetWindowExStyleBits(hWndFocus) & 0x00000100  ;WS_EX_WINDOWEDGE
&& getObjectSubtypeCode() == wt_unknown
&& GetObjectRole() == role_system_document
	var int ancestorCount = GetAncestorCount()
	if ancestorCount >= 1
		return true
	endIf
endIf
return false
EndFunction

int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if ShouldIgnoreFocusChange(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
	return true
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
If sClass == cwc_MozillaContentWindowClass 
	if GetTickCount() - MozillaContentWindow_CreationTime < BrowserWindow_MaxElapseTime
	&& hwndFocus == MozillaContentWindow_hWnd
	&& InReadOnlyMessageBody()
		if browserTabType() == message_browserTabType
			; When opening a message in a new tab, no DocumentLoadedEvent fires.
			; We need this event to fire so that we can make the expected announcement when opening a new message.
			DocumentLoadedEvent ()
		endIf
		; DocumentLoadedEvent is expected to fire, announcing the focus causes extraneous speech:
		return
	endIf
endIf
if nChangeDepth > 0
&& InMessageList()
	;Focus is moving to the message list
	FocusChangedEvent(hwndFocus,hwndPrevFocus)
	return
endIf
if nChangeDepth == -1
&& nType == WT_LISTBOXITEM
&& hwndFocus == hwndPrevFocus
	return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
endIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
endFunction

int function IgnoreObjectAtLevel (int level)
var
	int iType = GetObjectSubTypeCode (SOURCE_DEFAULT, level)
if IsTypeOfRegion(iType)
|| iType == WT_GROUPBOX
|| iType == WT_FRAME
|| iType == WT_TABPANEL
|| iType == WT_ROW
|| iType == WT_COLUMNHEADER
	return true
endIf
if iType == WT_LISTBOXITEM
&& level >= 1
	return true
endIf
if iType == WT_LISTBOX
&& level > 1
	return true
endIf
if level == 1
&& !iType
&& GetObjectIA2State (level)&IA2_STATE_INVALID_ENTRY
	return true
endIf
if InMessageList()
&& (iType == WT_GRID
|| iType == WT_TABLE)
	return true
endIf
return IgnoreObjectAtLevel (level)
endFunction

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow, optional handle PrevFocusWindow)
if GetFocusChangeDepth () > 0
&& !InReadOnlyMessageBody()
	return true
endIf
return FocusChangedEventShouldProcessAncestors(FocusWindow, PrevFocusWindow)
endFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if InMessageList ()
	SayObjectTypeAndText()
	return
endIf
		ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

void function AnnounceDeselectedStateForListboxes()
; This is scheduled so that we don't have the deselected state announced before the item becomes selected when navigating the list.
AnnounceDeselectedStateForListboxes_ScheduleID = 0
; When navigating by a large amount, we may receive only the state change for the item moved to while it is not selected.
if !(GetObjectStateCode() & CTRL_SELECTED)
	Say(cMsgDeselected,ot_item_state)
endIf
EndFunction

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
if AnnounceDeselectedStateForListboxes_ScheduleID
	UnscheduleFunction(AnnounceDeselectedStateForListboxes_ScheduleID)
	AnnounceDeselectedStateForListboxes_ScheduleID = 0
endIf
if hObj == GetFocus()
&& InMessageList()
	if nState & CTRL_SELECTED
	&& !(nOldState & CTRL_SELECTED)
		Say(cMsgSelected,ot_item_state)
		return
	elif !(nState & CTRL_SELECTED)
	&& nOldState & CTRL_SELECTED
		; Force a delay when state change is due to large navigation,
		; but not when toggling the state while on the item:
		if GetScriptAssignedTo(GetCurrentScriptKeyName()) == "SelectCurrentItem"
			Say(cMsgDeselected,ot_item_state)
		else
			AnnounceDeselectedStateForListboxes_ScheduleID = ScheduleFunction("AnnounceDeselectedStateForListboxes", AnnounceDeselectedStateForListboxes_WaitTime)
		endIf
		return
	endIf
endIf
ObjStateChangedEvent(hObj,iObjType, nChangedState, nState, nOldState)
EndFunction

Void Function WindowCreatedEvent (handle hWindow, int nLeft, int nTop, int nRight, int nBottom)
;  Opening a message in a new window causes a DocumentLoadedEvent to fire, but opening a message in a new tab does not.
; However, opening the Setting page which opens in a new tab does fire a DocumentLoadedEvent.
; When focus moves to a tab window with the expected class for the message, we will test if this window was recently created and if so is it a message tab.
If GetWindowClass(hWindow) == cwc_MozillaContentWindowClass 
	MozillaContentWindow_CreationTime = GetTickCount()
	MozillaContentWindow_hWnd = hWindow
endIf
WindowCreatedEvent (hWindow, nLeft, nTop, nRight, nBottom)
EndFunction

int function browserTabType()
if GetWindowClass(GetFocus()) != cwc_MozillaContentWindowClass return unknown_browserTabType endIf
var int level, int count = GetAncestorCount()
for level = 0 to count
	if GetObjectRole(level) == role_system_propertyPage
		var string id = GetObjectIA2Attribute ("id", level)
		if id
			if StringStartswith(id, "mailMessageTab")
				return message_browserTabType
			elif StringStartswith(id, "preferencesTabWrapper")
				return settings_browserTabType
			else
				return unknown_browserTabType
			endIf
		endIf
	endIf
endFor
return unknown_browserTabType
EndFunction

Void Function DocumentLoadedEvent ()
if gcOptions.HeadersAnnouncement
	ReadMessageHeadersInOpenMessage()
endIf
if IsVirtualPCCursor()
&& !(GetRunningFSProducts() & product_Fusion)
&& !SayAllInProgress()
	AnnounceDocumentElements()
	if gcOptions.AutoReadingMessages
		QueueFunction( "SayAll()" )
	EndIf
endIf
EndFunction

string function GetStatusBarTextFromUIA ()
var object statusBar = FindStatusBarUIAElement()
if !statusBar return cscNull endIf
var object element = FSUIAGetFirstChildOfElement(statusBar)
if !element return cscNull endIf
var string text, string name
while element
	if element.controltype == UIA_TextControlTypeID
	|| element.controlType == UIA_buttonControlTypeID
	&& element.name
		if text text = text+cscSpace endIf
		name = element.name
		text = text+name
	endIf
	element = FSUIAGetNextSiblingOfElement(element)
endWhile
return text
endFunction

script SayBottomLineOfWindow()
if DialogActive()
	PerformScript SayBottomLineOfWindow()
	return
endIf
var string text = GetStatusBarTextFromUIA ()
Say(text,ot_user_requested_information)
if InMessageList()
	; Add the count of messages as a perk for those used to email clients where this information is on the status bar:
	var object element = FSUIAGetFocusedElement()
	if !element return endIf
	text = element.sizeOfSet
	if text
		Say(FormatString(msgCountOfMessages,text), ot_user_requested_information)
	endIf
endIf
EndScript

script SayNextCharacter()
if getMenuMode() == menu_active
	; We don't properly update to detect the current item when moving to some submenus.
	; Where the update properly happens, the focus change will speak.
	; Otherwise, use this work-around for now:
	NextCharacter()
	var object element = FSUIAGetFocusedElement()
	if element
	&& element.name != GetObjectName()
		Say(element.name, ot_line)
	endIf
	return
endIf
if OnAddressPill()
	; Moving right from an address pill to the edit field for an address results in a focus change.
	; We would normally say the character moved to as part of this script, but we don't want to say it it here:
	NextCharacter()
	return
endIf
PerformScript SaynextCharacter()
EndScript

script SayLine()
if InMessageList()
	SayObjectTypeAndText()
	return
endIf
;There are some instances where this just says blank, so see if we can get the object name instead:
if GetWindowClass(GetFocus()) == cwc_MozillaWindowClass
&& StringIsBlank(GetLine())
	var string text = GetObjectName()
	if !StringIsBlank(text)
		Say(text, ot_line)
		return
	endIf
endIf
PerformScript SayLine()
EndScript

Script ScriptFileName ()
ScriptAndAppNames(GetActiveConfiguration ())
EndScript

object function GetMessageHeaderBannerElement()
var object appElement = GetTopLevelAppElement()
if !appElement return endIf
var object condition = FSUIACreateStringPropertyCondition(UIA_AutomationIdPropertyId, id_messageHeader)
return appElement.findFirst(TreeScope_Descendants, condition)
EndFunction

object function GetEditableMessageHeaderToolBarElement()
var object appElement = GetTopLevelAppElement()
if !appElement return endIf
var object condition = FSUIACreateStringPropertyCondition(UIA_AutomationIdPropertyId, id_editableMessageHeader)
return appElement.findFirst(TreeScope_Descendants, condition)
EndFunction

object function FindChildElementWithAutomationID(object element, string ID)
if !element return Null() endIf
; The UIA find will not work on all UIA elements in Thunderbird.
; Use this function to find a specific child element.
var object child = FSUIAGetFirstChildOfElement(element)
while child && child.AutomationID != ID
	child = FSUIAGetNextSiblingOfElement(child)
endWhile
return child
EndFunction

object function FindHeaderRoot(string desiredElementID, optional object headerBanner)
if !headerBanner
	headerBanner = GetMessageHeaderBannerElement()
endIf
return FindChildElementWithAutomationID(headerBanner, desiredElementID)
EndFunction

void function ReadFromHeaderInOpenMessage(optional object headerBanner)
var object senderHeaderRoot = FindHeaderRoot(id_headerSenderToolbarContainer, headerBanner)
if !senderHeaderRoot return endIf
; Now the UIA find will find the list element if we use treeScope_subtree but not treeScope_descendants.
; Once we get the list element, the UIA find will work using treeScope_descendants.
var object condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ListControlTypeId)
var object list = senderHeaderRoot.findFirst(TreeScope_subTree, condition)
if !list return endIf
; There is no text element labeling the from list, use the list name as a label for this header:
Say(list.name, ot_user_requested_information)
condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ListItemControlTypeId)
var object listItems = list.findAll(TreeScope_Descendants, condition)
if !listItems return endIf
; The first edit field has the best data:
condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_editControlTypeId)
var string senders, string s, object o
forEach o in listItems
	var object textElement = o.findFirst(TreeScope_Descendants, condition)
	if textElement
		s = textElement.name
		if !StringIsBlank(s)
			senders = senders+cscBufferNewLine+s
		endIf
	endIf
endForEach
if senders
	Say(senders, ot_user_requested_information)
endIf
EndFunction

void function ReadToHeaderInOpenMessage(optional object headerBanner)
var object toHeaderRoot = FindHeaderRoot(id_expandedToRow, headerBanner)
if !toHeaderRoot return endIf
; Use the list name as the label, even though we could have used the edit field.
var object condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ListControlTypeId)
var object list = toHeaderRoot.findFirst(TreeScope_subTree, condition)
if !list return endIf
Say(list.name, ot_user_requested_information)
condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ListItemControlTypeId)
var object listItems = list.findAll(TreeScope_Descendants, condition)
if !listItems return endIf
; Extract only the portion containing the recipient's name from each list item:
condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_editControlTypeId)
var string recipients, string s, object o
forEach o in listItems
	var object textElement = o.findFirst(TreeScope_Descendants, condition)
	if textElement
		s = textElement.name
		if !StringIsBlank(s)
			recipients = recipients+cscBufferNewLine+s
		endIf
	endIf
endForEach
if recipients
	Say(recipients, ot_user_requested_information)
endIf
EndFunction

void function ReadCcHeaderInOpenMessage(optional object headerBanner)
var object ccHeaderRoot = FindHeaderRoot(id_expandedCcRow, headerBanner)
if !ccHeaderRoot return endIf
; Use the list name as the label, even though we could have used the edit field.
var object condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ListControlTypeId)
var object list = ccHeaderRoot.findFirst(TreeScope_subTree, condition)
if !list return endIf
Say(list.name, ot_user_requested_information)
condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ListItemControlTypeId)
var object listItems = list.findAll(TreeScope_Descendants, condition)
if !listItems return endIf
; Extract only the portion containing the recipient's name from each list item:
condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_editControlTypeId)
var string recipients, string s, object o
forEach o in listItems
	var object textElement = o.findFirst(TreeScope_Descendants, condition)
	if textElement
		s = textElement.name
		if !StringIsBlank(s)
			recipients = recipients+cscBufferNewLine+s
		endIf
	endIf
endForEach
if recipients
	Say(recipients, ot_user_requested_information)
endIf
EndFunction

void function ReadSubjectHeaderInOpenMessage(optional object headerBanner)
var object subjectHeaderRoot = FindHeaderRoot(id_headerSubjectSecurityContainer, headerBanner)
if!subjectHeaderRoot return endIf
; There are not separate elements for label and content of subject, but there is an element which contains both.
var object condition = FSUIACreateStringPropertyCondition(UIA_AutomationIdPropertyId, id_expandedSubjectBox)
var object element = subjectHeaderRoot.findFirst(treeScope_subTree, condition)
if !element return endIf
Say(element.name, ot_user_requested_information)
EndFunction

void function ReadDateAndTimeDataInOpenMessage(optional object headerBanner)
; The date and time is just an edit field with nothing to label it, located under the element we use for the to header root.
var object toHeaderRoot = FindHeaderRoot(id_expandedToRow, headerBanner)
if !toHeaderRoot return endIf
; We can't use UIA find to locate the dateLabel element, so call the function to iterate through the children to find the it:
var object element = FindChildElementWithAutomationID(toHeaderRoot, id_dateLabel)
if !element return endIf
element = FSUIAGetFirstChildOfElement(element)
if element.controlType == UIA_editControlTypeId
&& !StringIsBlank(element.name)
	Say(element.name, ot_user_requested_information)
endIf
EndFunction

void function ReadMessageHeadersInOpenMessage()
var object headerBanner = GetMessageHeaderBannerElement()
if !headerBanner return endIf
readFromHeaderInOpenMessage(headerBanner)
ReadDateAndTimeDataInOpenMessage(headerBanner)
readToHeaderInOpenMessage(headerBanner)
readSubjectHeaderInOpenMessage(headerBanner)
EndFunction

void function ReadFromHeaderInEditableMessage(optional object headerToolBar)
if !headerToolBar
	headerToolBar = GetEditableMessageHeaderToolBarElement()
endIf
if !headerToolBar return endIf
var object condition = FSUIACreateStringPropertyCondition(UIA_AutomationIDPropertyId, id_fromField)
var object element = headerToolBar.findFirst(TreeScope_Children, condition)
if !element return endIf
Say(element.name, ot_user_requested_information)
Say(FSUIAGetFocusedElementValueText (element), ot_user_requested_information)
EndFunction

void function ReadToHeaderInEditableMessage(optional object headerToolBar)
if !headerToolBar
	headerToolBar = GetEditableMessageHeaderToolBarElement()
endIf
if !headerToolBar return endIf
var object element = FindChildElementWithAutomationID(headerToolBar, id_toLabel)
if !element return endIf
Say(element.name, ot_user_requested_information)
element = FSUIAGetNextSiblingOfElement (element)
while element.controlType == UIA_CustomControlTypeId
	Say(StringSegment (element.name, cScColon, 1), ot_user_requested_information)
	element = FSUIAGetNextSiblingOfElement (element)
endWhile
EndFunction

void function ReadCcHeaderInEditableMessage(optional object headerToolBar)
if !headerToolBar
	headerToolBar = GetEditableMessageHeaderToolBarElement()
endIf
if !headerToolBar return endIf
var object element = FindChildElementWithAutomationID(headerToolBar, id_CcLabel)
if !element return endIf
Say(element.name, ot_user_requested_information)
element = FSUIAGetNextSiblingOfElement (element)
while element.controlType == UIA_CustomControlTypeId
	Say(StringSegment (element.name, ":", 1), ot_user_requested_information)
	element = FSUIAGetNextSiblingOfElement (element)
endWhile
EndFunction

void function ReadSubjectHeaderInEditableMessage(optional object headerToolBar)
if !headerToolBar
	headerToolBar = GetEditableMessageHeaderToolBarElement()
endIf
if !headerToolBar return endIf
var object condition = FSUIACreateStringPropertyCondition(UIA_AutomationIDPropertyId, id_subjectField)
var object element = headerToolBar.findFirst(TreeScope_Children, condition)
if !element return endIf
Say(element.name, ot_user_requested_information)
Say(FSUIAGetFocusedElementValueText (element), ot_user_requested_information)
EndFunction

void function ProcessEditableMessageFields(int iField, optional object headerToolBar)
if iField == 1
	ReadFromHeaderInEditableMessage(headerToolBar)
elIf iField == 2
	SayMessage (OT_ERROR, MSG_NotInThisDialogue_L, MSG_NotInThisDialogue_S)
elIf iField == 3
	ReadToHeaderInEditableMessage(headerToolBar)
elIf iField == 4
	ReadCcHeaderInEditableMessage(headerToolBar)
elIf iField == 5
	ReadSubjectHeaderInEditableMessage(headerToolBar)
endIf
endFunction

void function ProcessReadOnlyMessageFields(int iField, optional object headerBanner)
if iField == 1
	ReadFromHeaderInOpenMessage(headerBanner)
elIf iField == 2
	ReadDateAndTimeDataInOpenMessage(headerBanner)
elIf iField == 3
	ReadToHeaderInOpenMessage(headerBanner)
elIf iField == 4
	ReadCcHeaderInOpenMessage(headerBanner)
elIf iField == 5
	ReadSubjectHeaderInOpenMessage(headerBanner)
endIf
endFunction

Script HandleMessageFields (int iField)
if !iField
	iField = StringToInt (StringRight (GetCurrentScriptKeyName (), 1))
endIf
var object oMessageHeaderElement = GetMessageHeaderBannerElement()
if oMessageHeaderElement
	ProcessReadOnlyMessageFields(iField, oMessageHeaderElement)
	return
endIf
oMessageHeaderElement = GetEditableMessageHeaderToolBarElement()
if oMessageHeaderElement
	ProcessEditableMessageFields(iField, oMessageHeaderElement)
	return
endIf
SayMessage (OT_ERROR, msgNotInOpenMessageError_l, msgNotInOpenMessageError_s)
EndScript

void function SelectionContextChangedEvent(int nSelectionContextFlags, int nPrevSelectionContextFlags, int nData1, int nData2,
string sDesc1, string sDesc2, string sDesc3, string sDesc4, string sDesc5)
IndicateControlType (nData1, sDesc1, cscNull)

if ShouldItemSpeak(OT_CONTROL_DESCRIPTION) then
	Say(sDesc4,OT_CONTROL_DESCRIPTION)
EndIf
endFunction

void function CaretMovedEvent( int movementUnit,optional int source)
/* buttons inside edit fields will be spoken by the selection context change event */
if (GetObjectSubTypeCode(SOURCE_DEFAULT) == WT_BUTTON)
	return
EndIf
; let paragraph reading keystrokes handle this as caret moved does not 
;always get triggered and so when it does, we don't want doublespeaking and 
;when it doesn't, we need the manual keystrokes to do the reading.
if (movementUnit==Unit_Paragraph_Next || movementUnit==Unit_Paragraph_Prior)
	return
endIf
CaretMovedEvent( movementUnit,source)
EndFunction

Void Function DoDelete ()
If InMessageList ()
|| InReadOnlyMessageBody ()
	TypeKey (cksDelete)
	Return
EndIf
DoDelete ()
EndFunction

script ControlDelete()
TypeKey(cksDeleteWord) ;Instead of TypeCurrentScriptKey, so additional key assignments to script will work
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
		Say (sText, OT_WORD)
	else
		Say(cmsgBlank1,OT_SCREEN_MESSAGE)
	EndIf
endIf
TypeKey(cksControlBackSpace) ;Instead of TypeCurrentScriptKey, so additional key assignments to script will work
EndScript

int function BrailleAddObjectName(int nSubtypeCode)
if IsTouchCursor()
	return BrailleAddObjectName(nSubtypeCode)
endIf
if nSubtypeCode == wt_row
	;In the message list, items are shown as rows if threading is on for messages in the list; otherwise, they are shown as a listbox.
	var int attrib
	if GetControlAttributes()& CTRL_SELECTED
		attrib = ATTRIB_HIGHLIGHT
	else
		attrib = 0
	endIf
	BrailleAddString(GetObjectName(SOURCE_CACHED_DATA,0), GetCursorCol(), GetCursorRow(), attrib)
	return true
endIf
return BrailleAddObjectName(nSubtypeCode)
EndFunction

int function BrailleAddObjectState(int nSubtypeCode)
if IsTouchCursor()
	return BrailleAddObjectState(nSubtypeCode)
endIf
if nSubtypeCode == wt_row
	;In the message list, items are shown as rows if threading is on for messages in the list; otherwise, they are shown as a listbox.
	;Only show state for expanded or collapsed rows.
	;Selected is shown as usual, with dots 7&8.
	;If state is 0, such as for rows at the leaf level,
	;the state string for csNone will show, and we don't want this to happen.
	var int state = GetControlAttributes() & (CTRL_EXPANDED | CTRL_COLLAPSED)
	if state
		BrailleAddString(BrailleGetStateString(state), GetCursorCol(), GetCursorRow(), 0)
	endIf
	return true
endIf
return BrailleAddObjectState(nSubtypeCode)
EndFunction

collection function ProcessNotification(string notificationText, string AppName)
var collection notificationRuleActions = ProcessNotification(notificationText, AppName)
if InMessageList() && appName=="thunderbird" then
	notificationRuleActions.BrailleActionType=NotificationProcessing_BrailleActionNoFlashMessage 
endIf
return notificationRuleActions
endFunction

void function ProcessKeyPressed(int nKey,string strKeyName,int nIsBrailleKey,int nIsScriptKey)
if nKey==key_ENTER then
	var int role=GetObjectRole()
	if (role==IA2_ROLE_CHECK_MENU_ITEM || role==IA2_ROLE_RADIO_MENU_ITEM) then
		MSAARefresh()
	endIf
endIf
ProcessKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
endFunction

string function stripEmailFromString(string text)
var string emailAddress,
int emailAddressLen,
int emailAddressPos

emailAddress = StringRegexMatch (text, "(<(.+@[^>]+)>)")
emailAddressLen=stringLength(emailAddress)

if emailAddressLen==0 then
	return text
endIf

emailAddressPos=stringContains(text, emailAddress)
; we minus two from the pos of the email address to account for the extra space.
return subString(text,1,emailAddressPos-2)+subString(text,emailAddressPos+emailAddressLen, stringLength(text))
endFunction

void function sayObjectTypeAndText(optional int level, optional int includeContainerName, optional int drawHighlight)
; When reading the messageList, omit the email address since the name is 
;already included and it is very verbose.
if InMessageList() && level==0
	var int iAttribs = GetControlAttributes ()
	var int iOutputType = OT_ANNOUNCE_POSITION_AND_COUNT
	say(GetObjectName(), OT_CONTROL_NAME)
	if iAttribs&CTRL_EXPANDED
		IndicateControlState (WT_ROW, CTRL_EXPANDED)
	elIf iAttribs&CTRL_COLLAPSED
		IndicateControlState (WT_ROW, CTRL_COLLAPSED)
	endIf
	if !StringCompare (GetScriptAssignedTo (GetCurrentScriptKeyName ()), "SayLine")
		iOutputType = OT_POSITION
	endIf
	Say(PositionInGroup (), iOutputType)
	return
endIf
sayObjectTypeAndText(level, includeContainerName, drawHighlight)
endFunction

string function GetObjectName(optional int useMSAA, optional int level)
if !GetNonJCFOption("IndicateAddressInMessageList")
&& level==0
&& InMessageList()
	var string text =stripEmailFromString(GetObjectName())
	return text
endIf
return GetObjectName(useMSAA, level)
endFunction

void function sayWindowTypeAndText (handle window)
if GetWindowClass (window) == WC_Dialogue
	IndicateControlType (WT_DIALOG, GetDialogIdentifier (), cscNull)
	Say (MSAAGetDialogStaticText(), OT_DIALOG_TEXT)
	return
endIf
sayWindowTypeAndText (window)
endFunction

Int Function SayTutorialHelpHotKey (handle hHotKeyWindow,optional  int IsScriptKey)
if !IsScriptKey
&& GetJCFOption (optElementAccessKeys)
&& (IsVirtualPCCursor ()
|| IsFormsModeActive ())
	;access key will already be spoken as a result of the Speak Access Keys Within Web Pages setting
	;Return to prevent double speaking
	return
endIf
return SayTutorialHelpHotKey (hHotKeyWindow, IsScriptKey)
EndFunction

Void Function SayTutorialHelp (int iObjType,optional  int IsScriptKey)
if iObjType == WT_LISTBOXITEM
 && InMessageHeader()
	;arrow keys do not work to navigate within the to, cc, and bcc lists
	;return here to prevent incorrect tutor message
	return
endIf
SayTutorialHelp (iObjType, IsScriptKey)
EndFunction

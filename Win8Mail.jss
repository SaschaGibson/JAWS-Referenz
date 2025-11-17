; Copyright 2013-2015 Freedom Scientific, Inc.
; JAWS script file for Windows 8 Mail

include "HJConst.jsh"
include "uia.jsh"
include "MSAAConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "TutorialHelp.jsm"
include "Win8Mail.jsm"
import "touch.jsd"

;automation ID's:
const
	aID_modernCanvasContent = "modernCanvasContent"  ;message body edit

;UIA object for use with Win8Mail support
globals
	collection colWin8Mail
		;members are:
		;
		; UIA -- The fsUIA object for Win8Mail.
		; treeWalker -- For traversing the Win8Mail UIA structure.
		; treeScout -- For scouting the tree structure independently of the main treeWalker.
		; app -- The window element for the Win8Mail application.
		; messageBodyCondition -- The condition used to find the starting element of the branch for the message body.


;for focus item data:
const
	CustomType_Unknown = 0,
	CustomType_AddressEditCombo = 1,
	CustomType_ListOfAddressesInHeaderField = 2,
	CustomType_SubjectEdit = 3,
	CustomType_EditableMessageBodyText = 4,
	CustomType_MessageListItem = 5,
	CustomType_FolderListItem = 6,
	CustomType_MailAccountListItem = 7
globals
	collection c_FocusItemData

const
;Character value of field delimiter character of fields in iAccessible object name of message list item:
	cVal_DatefieldDelimiter = 8206,
;delimiter of flags for object name of message item:
	sFlagFieldDelimiter = ","

void function AutoStartEvent()
if !c_FocusItemData
	c_FocusItemData = new collection
EndIf
InitWin8MailUIAObjects()
EndFunction

void function AutoFinishEvent()
CollectionRemoveAll(c_FocusItemData)
collectionRemoveAll(colWin8Mail)
colWin8Mail = Null()
EndFunction

int function InitWin8MailUIAObjects()
var
	object oUIA,
	object treeWalker,
	object condition,
	object element
if !colWin8Mail colWin8Mail = new collection endIf
oUIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !oUIA return false endIf
colWin8Mail.UIA = oUIA
element = oUIA.GetFocusedElement().BuildUpdatedCache()
condition = oUIA.CreateIntPropertyCondition( UIA_ProcessIdPropertyId, element.ProcessID )
if !condition return false endIf
treeWalker = oUIA.CreateTreeWalker(condition)
if !treeWalker return false EndIf
colWin8Mail.treeWalker = treeWalker
treeWalker.currentElement = element
while treeWalker.gotoParent() endWhile
colWin8Mail.app = treeWalker.currentElement
;now create a separate treeWalker for the scout:
treeWalker = oUIA.CreateTreeWalker(condition)
colWin8Mail.treeScout = treeWalker
;now a condition for the message body:
condition = oUIA.CreateStringPropertyCondition(UIA_NamePropertyId,oName_MsgBody)
condition = oUIA.CreateAndCondition(condition,
	oUIA.createIntPropertyCondition(UIA_ControlTypePropertyId,UIA_PaneControlTypeId))
colWin8Mail.messageBodyCondition = condition
return true
endFunction

string function GetCleanedUpListItemName ()
; Where the object description data is part of object name data, we need to remove if that data is the lattermost data in the string:
var
	string name = getObjectName (TRUE),
	string description = GetObjectDescription (TRUE),
	int LengthToStrip = StringLength (Description),
	string temp = StringRight (Name, lengthToStrip),
	string result;
if StringCompare (temp, description) == 0 then
	Result = StringChopRight (Name, LengthToStrip)
else
	Result = Name
endIf
return StringTrimLeadingBlanks (StringTrimTrailingBlanks (Result))
endFunction

int function InMessageList()
return GetObjectSubtypeCode(true) == wt_ListBoxItem
	&& GetObjectName(true,2) == oName_MessageList
EndFunction

int function GotoNextElementInBranch(object treeWalker, object branchStart)
if !treeWalker return false endif
if treeWalker.GoToFirstChild() return true EndIf
if treeWalker.GoToNextSibling() return true endIf
var object prevElement = treeWalker.currentElement
while treeWalker.GoToParent()
	if colWin8Mail.UIA.compareElements(treeWalker.currentElement,branchStart) return false endIf
	if treeWalker.GoToNextSibling() return true EndIf
EndWhile
treeWalker.currentElement = prevElement
return false
EndFunction
int function ShouldAddTextToReadMessageSayAll(object element)
var string s, string t
s = StringTrimLeadingBlanks(StringTrimTrailingBlanks(element.name))
if !s return false endIf
if element.controltype == UIA_HyperlinkControlTypeId
|| element.controltype == UIA_ImageControlTypeId
	return true
elif element.controlType == UIA_textControlTypeId
	var object scout = colWin8Mail.treeScout
	scout.currentElement = element
	scout.gotoParent()
	if scout.currentElement.controlType == UIA_HyperlinkControlTypeId
	|| element.controltype == UIA_ImageControlTypeId
		t = StringTrimLeadingBlanks(StringTrimTrailingBlanks(scout.currentElement.name))
		if s == t
			return false
		endIf
	endIf
	return true
endIf
return false
endFunction

string function GetMsgBodyText()
var
	object messageBody,
	object treeWalker,
	object savedElement
messageBody = colWin8Mail.app.findFirst(treeScope_subTree,colWin8Mail.messageBodyCondition)
if !messageBody return cscNull EndIf
treeWalker = colWin8Mail.treeWalker
;Warning! If you leave the treeWalker on the message body,
;the message body structure may not be available when you move to a different message in the list.
savedElement = treeWalker.currentElement
treeWalker.currentElement = messageBody
var string text, string s, string type
while GotoNextElementInBranch(treeWalker,messageBody)
	if ShouldAddTextToReadMessageSayAll(treeWalker.currentElement)
		s = treeWalker.currentElement.name
		if treeWalker.currentElement.controlType == UIA_HyperlinkControlTypeId
			type = treeWalker.currentElement.localizedControlType
			s = s+cscSpace+type
		endIf
		text = text+s+cscBufferNewLine
	endIf
endWhile
treeWalker.currentElement = savedElement
return text
EndFunction

void function SayLine(optional int iDrawHighlights , int bSayingLineAfterMovement )
if IsPCCursor()
&& !IsVirtualPCCursor()
	if c_FocusItemData.CustomType == CustomType_AddressEditCombo
	|| c_FocusItemData.CustomType == CustomType_SubjectEdit then
		SayObjectTypeAndText()
		return
	elif c_FocusItemData.CustomType == CustomType_FolderListItem
	|| c_FocusItemData.CustomType == CustomType_ListOfAddressesInHeaderField
	|| c_FocusItemData.CustomType == CustomType_MailAccountListItem then
		SayObjectActiveItem(true)
		return
	EndIf
endIf
SayLine(iDrawHighlights ,bSayingLineAfterMovement )
EndFunction

void function SayObjectActiveItem(optional int AnnouncePosition)
if c_FocusItemData.CustomType == CustomType_FolderListItem
|| c_FocusItemData.CustomType == CustomType_ListOfAddressesInHeaderField then
	Say(c_FocusItemData.Name,ot_line)
	if c_FocusItemData.State & STATE_SYSTEM_SELECTED then
		Say(cmsg215_L,ot_item_state)
	EndIf
	if AnnouncePosition then
		Say(c_FocusItemData.PositionInGroup,ot_position)
	EndIf
	return
elif c_FocusItemData.CustomType == CustomType_MailAccountListItem then
	Say(c_FocusItemData.Name,ot_line)
	SayUsingVoice(vctx_message,c_FocusItemData.description,ot_line)
	if AnnouncePosition then
		Say(c_FocusItemData.PositionInGroup,ot_position)
	EndIf
	return
EndIf
; There are items for which the UIA browser doesn't seem to find an object,
; even though they appear very much like what the custom types would indicate:
if getObjectSubtypeCode (TRUE) == WT_LISTBOXITEM && getWindowClass (GetCurrentWindow ()) == cwcIEServer then
	say (GetCleanedUpListItemName (), OT_CONTROL_NAME)
	if AnnouncePosition then say (PositionInGroup (), OT_POSITION) endIf
	return
endIf
SayObjectActiveItem(AnnouncePosition)
EndFunction

Void Function SayTutorialHelp (int iObjType,optional  int IsScriptKey)
if iObjType == WT_LISTBOXITEM then return SayTutorialHelp (WT_LISTBOX,IsScriptKey) endIf
return SayTutorialHelp (iObjType,IsScriptKey)
endFunction

string function GetDescribedByText ()
; these new html elements are not at all what we want to have described by TutorMessageEvent:
if ! IsVirtualPcCursor () && ! IsFormsModeActive ()
&& getWindowClass (GetCurrentWindow ()) == cwcIEServer then
	return cscNull
endIf
return GetDescribedByText ()
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if nLevel == 0 then
	if c_FocusItemData.CustomType == CustomType_AddressEditCombo then
		IndicateControlType(wt_EditCombo,c_FocusItemData.Name)
		if !StringIsBlank(c_FocusItemData.Value) then
			Say(c_FocusItemData.Value,ot_line)
		EndIf
		return
	elif c_FocusItemData.CustomType == CustomType_SubjectEdit then
		IndicateControlType(wt_Edit,c_FocusItemData.Name)
		Say(GetLine(),ot_line)
		return
	elif c_FocusItemData.CustomType == CustomType_EditableMessageBodyText then
		IndicateControlType(wt_multiline_Edit,cscNull)
		return
	elif c_FocusItemData.CustomType == CustomType_FolderListItem
	|| c_FocusItemData.CustomType == CustomType_ListOfAddressesInHeaderField
	|| c_FocusItemData.CustomType == CustomType_MailAccountListItem then
		IndicateControlType(wt_ListBox,cscNull)
		SayObjectActiveItem(true)
		return
	EndIf
	; There are items for which the UIA browser doesn't seem to find an object,
	; even though they appear very much like what the custom types would indicate:
	if getObjectSubtypeCode (TRUE) == WT_LISTBOXITEM && getWindowClass (GetCurrentWindow ()) == cwcIEServer then
		indicateControlType (GetObjectSubtypeCode (TRUE, 1), GetObjectName (TRUE, 2), GetCleanedUpListItemName ())
		say (PositionInGroup (), OT_POSITION)
		return
	endIf
endIf
if DialogActive() then
	if GetObjectSubtypeCode(false,2) == wt_dialog
	&& GetObjectName(false,2) == oName_AccountsSettingsFlyout
	&& GetObjectSubtypeCode(false,1) == wt_groupBox then
		;The groupbox might have a name that is the names of several of its children:
		if GetObjectSubtypeCode(false,0) == wt_button
		&& GetObjectname(false,0) == oName_Back then
			if nLevel == 1
				;the group should not be spoken:
				return
			elif nLevel == 0 then
				IndicateControlType(wt_button,GetObjectName())
				return
			EndIf
		EndIf
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

object function GetUIAObjectFocusItem()
var
	object o,
	int nLevel,
	int nCount
if !DialogActive() then
	return GetUIAObjectFocusItem()
EndIf
;there may be more than one object with focus,
;so determine if there is a focus object in a dialog:
let nCount = GetAncestorCount()
let nLevel = 1
while nLevel <= nCount
	if GetObjectSubtypeCode(false,nLevel) == wt_dialog
	&& GetObjectName(false,nLevel) == oName_AccountsSettingsFlyout then
		let o = GetUIAObjectTree(GetFocus())
		if o then
			let o = o.FindByName(oName_AccountsSettingsFlyout)
			if o then
				let o = o.FindByKeyboardFocus(1)
				if o then
					return o
				endIf
			EndIf
		EndIf
	EndIf
	let nLevel = nLevel+1
EndWhile
return GetUIAObjectFocusItem()
EndFunction

int function GetUIAObjectItemType(optional object ByRef oItem)
var
	int iObjType,
	object oTree,
	string s
if GetMenuMode() != Menu_Inactive then
	return CustomType_Unknown
EndIf
if !oItem then
	let oItem = GetUIAObjectFocusItem()
EndIf
if !oItem then
	return CustomType_Unknown
EndIf
let iObjType = GetObjectSubtypeCode()
if oItem.Role == ROLE_SYSTEM_COMBOBOX
&& iObjType == wt_edit then
	return CustomType_AddressEditCombo
elif oItem.Role == ROLE_SYSTEM_TEXT then
	if iObjType == wt_edit then
		return CustomType_SubjectEdit
	elif iObjType == wt_multiline_edit
	&& oItem.Parent.Name == oName_Body then
		return CustomType_EditableMessageBodyText
	EndIf
elif oItem.Role == ROLE_SYSTEM_LISTITEM then
	if DialogActive() then
		if oItem.Parent.Parent.Parent.Name == oName_AccountsSettingsFlyout
		&& oItem.Parent.NextSibling.Role == ROLE_SYSTEM_LINK
		&& oItem.Parent.NextSibling.Name == oName_AddAnAccount then
			return CustomType_MailAccountListItem
		EndIf
	EndIf
	if oItem.Name == oItem.FirstChild.Name
	&& oItem.Firstchild.State & STATE_SYSTEM_SELECTABLE
	&& oItem.Firstchild.State & STATE_SYSTEM_READONLY then
		return CustomType_FolderListItem
	EndIf
;	if oItem.Parent.Parent.Name == oName_MessageList then
;		return CustomType_MessageListItem
;	EndIf
	if oItem.Parent.Role == ROLE_SYSTEM_LIST
		let s = oItem.Parent.Parent.Parent.Name
		if s == oName_To
		|| s == oName_Cc
		|| s == oName_Bcc then
			return CustomType_ListOfAddressesInHeaderField
		EndIf
	EndIf
EndIf
return CustomType_Unknown
EndFunction

void function UpdateFocusItemData()
var
	object oItem,
	object oTmp,
	int iType,
	int iPrevType,
	int x,
	int y,
	int iCount,
	int i,
	string s
let iPrevType = c_FocusItemData.customType
CollectionRemoveAll(c_FocusItemData)
let iType = GetUIAObjectItemType(oItem)
if iType == CustomType_Unknown then
	return
EndIf
let C_FocusItemData.CustomType = iType
let C_FocusItemData.PrevCustomType = iPrevType
oItem.ClickablePoint(intRef(x),intRef(y))
let c_FocusItemData.ClickX = x
let c_FocusItemData.ClickY = y
if iType == CustomType_AddressEditCombo then
	let c_FocusItemData.Name = oItem.Name
	let c_FocusItemData.Value = oItem.Value
	let c_FocusItemData.help = oItem.Description
elif iType == CustomType_ListOfAddressesInHeaderField then
	let c_FocusItemData.Name = oItem.Description
	;Get position in group, which must be programmatically determined:
	let oTmp = oItem.Parent
	let iCount = oTmp.ChildCount
	let i = 1
	let oTmp = oTmp.FirstChild
	while i <= iCount
	&& !(oTmp.State & STATE_SYSTEM_FOCUSED)
		let oTmp = oTmp.NextSibling
		let i = i+1
	EndWhile
	if i <= iCount then
		let c_FocusItemData.PositionInGroup = FormatString(cmsgPosInGroup1,IntToString(i),IntToString(iCount))
	EndIf
elif iType == CustomType_SubjectEdit then
	let c_FocusItemData.Name = oItem.Name
	;value is available through the OSM.
	;It automatically updates in braille,
	;it doesn't fire a ValueChangedEvent as it changes,
	;and since GetLine retrieves the current content we just use it on demand of the value
	let c_FocusItemData.help = oItem.Description
elif iType == CustomType_EditableMessageBodyText then
	;Do we need to store the message text?
	let c_FocusItemData.help = oItem.Description
elif iType == CustomType_MessageListItem then
	;strip out the date field delimiters, since they cause extra whitespace in braille.
	;And also strip out the empty comma-delimited flag fields.
	let s = oItem.Name
;	let c_FocusItemData.Text
elif iType == CustomType_FolderListItem then
	let c_FocusItemData.Name = oItem.Name
	let c_FocusItemData.State = oItem.State
	let c_FocusItemData.PositionInGroup = oItem.Description
elif iType == CustomType_MailAccountListItem then
	let c_FocusItemData.Name = oItem.FirstChild.NextSibling.FirstChild.Name
	let c_FocusItemData.Description = oItem.FirstChild.NextSibling.FirstChild.NextSibling.Name
	let c_FocusItemData.PositionInGroup = oItem.description
EndIf
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
UpdateFocusItemData()
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

Void Function ValueChangedEvent(handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,optional int bIsFocusObject)
if hwnd == GetFocus() then
	if c_FocusItemData.CustomType ==CustomType_AddressEditCombo then
		if c_FocusItemData.Name == sObjName then
			let c_FocusItemData.Value = sObjValue
			return
		EndIf
	EndIf
EndIf
ValueChangedEvent(hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

string function GetCustomTutorMessage()
if c_FocusItemData.CustomType == CustomType_MailAccountListItem then
	;if we don't use a custom message,
	;JAWS retrieves irrelevant information from the object:
	return msgListBox
EndIf
return GetCustomTutorMessage()
EndFunction

Script SayAll(optional int bIgnoreUseSAPI5DuringSayAllOption)
var
	string sText
if InMessageList() then
	let sText = GetMsgBodyText()
	if sText then
		Say(sText,ot_JAWS_message)
	EndIf
	return
EndIf
PerformScript SayAll (bIgnoreUseSAPI5DuringSayAllOption)
EndScript

int function ShouldNotifyIfContextHelp()
if GetWindowClass(GetFocus()) == cwcIEServer then
	;The context help has no additional information that has not already been spoken:
	return false
EndIf
return ShouldNotifyIfContextHelp()
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgWin8MailAppName)
EndScript

int function BrailleAddObjectContainerName(int iSubtype)
if c_FocusItemData.CustomType == CustomType_AddressEditCombo then
	;The container information is redundant
	return true
EndIf
return BrailleAddObjectContainerName(iSubtype)
EndFunction

int function BrailleAddObjectType(int iSubtype)
if iSubtype == wt_GroupBox
&& c_FocusItemData.CustomType == CustomType_AddressEditCombo then
	;The container information is redundant
	return true
EndIf
return BrailleAddObjectType(iSubtype)
EndFunction

int function BrailleAddObjectValue(int iSubtype)
var
	string sName,
	string sDesc
if iSubtype == wt_Edit
&& c_FocusItemData.CustomType == CustomType_AddressEditCombo then
	BrailleAddString(c_FocusItemData.Value,
		c_FocusItemData.ClickX,c_FocusItemData.ClickY,GetCharacterAttributes())
	return true
elif iSubtype == wt_listBoxItem
	if c_FocusItemData.CustomType == CustomType_MailAccountListItem then
		let sName = c_FocusItemData.Name
		let sDesc = c_FocusItemData.Description
		BrailleAddString(sName+cscSpace+sDesc,
			c_FocusItemData.ClickX,c_FocusItemData.ClickY,GetCharacterAttributes())
		return true
	Else ; No UIA, but need to clean up the string of the item name:
		BrailleAddString (GetCleanedUpListItemName (), GetCursorCol (), getCursorRow (), GetCharacterAttributes ())
		return TRUE
	EndIf
EndIf
return BrailleAddObjectValue(iSubtype)
EndFunction

int function BrailleAddObjectState(int iSubtype)
if iSubtype == wt_Edit
&& c_FocusItemData.CustomType == CustomType_AddressEditCombo then
	;The required state information is not needed
	return true
EndIf
return BrailleAddObjectState(iSubtype)
EndFunction

int function BrailleAddObjectPosition(int iSubtype)
if iSubtype == wt_listBoxItem
	if c_FocusItemData.CustomType == CustomType_ListOfAddressesInHeaderField
	|| c_FocusItemData.CustomType == CustomType_MailAccountListItem then
		BrailleAddString(c_FocusItemData.PositionInGroup,0,0,0)
		return true
	EndIf
EndIf
return BrailleAddObjectPosition(iSubtype)
EndFunction

int function MainProcessShouldSkipUIAElementWhenNavigating(object element)
if element.controlType == UIA_TextControlTypeId
&& !element.GetPropertyValue( UIA_IsTextPatternAvailablePropertyId )
	var object parent = UIAGetParent( element )
	if parent.controlType == UIA_EditControlTypeId
	&& parent.automationId == aID_modernCanvasContent
		return true
	endIf
elif element.controlType == UIA_PaneControlTypeId
	if element.name == "ms-appx://microsoft.windowscommunicationsapps/ModernCanvas/ModernCanvasMailFrame.html"
	|| element.name == oName_MsgBody
		return true
	endIf
endIf
return MainProcessShouldSkipUIAElementWhenNavigating(element)
EndFunction

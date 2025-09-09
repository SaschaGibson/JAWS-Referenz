; Copyright 2024 - 2025 Freedom Scientific, Inc.
; Script file  for unified Outlook

include "HjConst.jsh"
include "MSAAConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "Outlook Modern.jsm"
include "Outlook.jsm"
import "FSXMLDomFunctions.jsd"

const
	wc_OutlookHost = "Olk Host",
	IA2_ID_MessageBody = "UniqueMessageBody",
	IA2_Class_MessageList = "Cz7T5",
	IA2_ID_ReadingPane = "Skip to message-region"

globals
	collection MessageIDs,
	; Each member is the IA2 unique ID of a message.
	; This is used to determine when a message is gaining focus due to being opened.
	collection c_OutlookModernVerbosity
	; Members are:
	; int MessageSayAll -- MessageSayAllVerbosity.


Script ScriptFileName()
ScriptAndAppNames (msgOutlookModern)
EndScript

void function AutoStartEvent ()
InitNewOutlookModernCollections()
loadNonJCFOptions()
if !(getRunningFSProducts () & (Product_Fusion | product_ZoomText))
	MouseToTopLeft()
endIf
EndFunction

void function AutoFinishEvent()
ClearAllCollections()
EndFunction

void function InitNewOutlookModernCollections()
if !c_OutlookModernVerbosity c_OutlookModernVerbosity = new collection endIf
EndFunction

void function ClearAllCollections()
collectionRemoveAll(c_OutlookModernVerbosity)
EndFunction

void function InitVerbosityCollection()
c_OutlookModernVerbosity.MessageSayAll = GetNonJCFOption ("MessageSayAllVerbosity")
EndFunction

void function loadNonJCFOptions()
InitVerbosityCollection()
loadNonJCFOptions()
EndFunction

Int Function ShouldMessageSayAll()
Return c_OutlookModernVerbosity.MessageSayAll
endFunction

int function MessageIsBeingOpened()
if !MessageIDs MessageIDs = new collection endIf
if GetObjectRole(1) != ROLE_SYSTEM_DOCUMENT
|| !StringStartsWith (GetObjectIA2Attribute("id",0), IA2_ID_MessageBody)
	return false
endIf
var int id = GetObjectIA2UniqueID(0)
if !id return false endIf
var string s = DecToHex(id)
if CollectionItemExists(MessageIDs,s) return false endIf
var collection c
c = new collection
MessageIDs[s] = c
return true
EndFunction

Void Function virtualCursorRestrictedEvent (handle window, int restrictionChange)
if virtualCursorRestrictionType == virtualCursorRestriction_Document
	if ShouldMessageSayAll()
	&& MessageIsBeingOpened()
		SayAll()
		GlobalPrevDocumentIdentifier = GetObjectIA2UniqueID(0)
	endIf
	return
endIf
if OnMessageList() then
	return
EndIf
virtualCursorRestrictedEvent (window, restrictionChange)
EndFunction

int function OnMessageList()
if UserBufferIsActive() return false endIf
if GetObjectRole() != ROLE_SYSTEM_LISTITEM return false endIf
var int level = FindAncestorOfType(wt_extendedSelect_listBox)
if level == -1 return false endIf
return GetObjectIA2Attribute("class",level) == IA2_Class_MessageList
EndFunction

int function InReadingPane()
if UserBufferIsActive() return false endIf
var int level = FindAncestorOfType(WT_MAIN_REGION)
if level == -1 return false endIf
return GetObjectIA2Attribute("id",level) == IA2_ID_ReadingPane
EndFunction

int function MoveToMessageList()
var object XMLDomDoc = GetFSXMLDomDoc()
if !XMLDomDoc return false endIf
var object node = XMLDomDoc.SelectSingleNode("//ListBox[@class='Cz7T5']")
if !node return false endIf
var int fsID = hexToDec(node.attributes.GetNamedItem("fsID").nodeValue)
return PerformActionOnElementWithID(Action_setFocus,fsID)
EndFunction

script MoveToMessageList()
EnsureNoUserBufferActive()
if OnMessageList()
	SayObjectTypeAndText()
elif !MoveToMessageList()
	Say(msgMoveToMessageListError, ot_error)
endIf
EndScript

int function IsOpenReadOnlyMessage(optional object XMLDomDoc)
if !XMLDomDoc
	XMLDomDoc = GetFSXMLDomDoc()
endIf
var
	string sItemSpec = "//Div[starts-with(@id, 'UniqueMessageBody')]",
	object oMessageBody = XMLDomDoc.selectSingleNode(sItemSpec)
if !oMessageBody
	return false
endIf
return true
endFunction

int function IsOpenEditableMessage(optional object XMLDomDoc)
if !XMLDomDoc
	XMLDomDoc = GetFSXMLDomDoc()
endIf
var
	string sItemSpec = "//Div[contains(@id, 'editorParent_')]",
	object oMessageBody = XMLDomDoc.selectSingleNode(sItemSpec)
if !oMessageBody
	return false
endIf
return true
endFunction

string function GetTextFromAllXMLDomNodes(object nodes)
if !nodes return cscNull endIf
var object o, string s, string text
if !nodes.length
&& nodes.hasChildNodes
	s = GetXMLDomNodeText(nodes)
	if !StringIsBlank(s)
		text = text+s+cscBufferNewLine
	endIf
	nodes = nodes.childNodes
endIf
forEach o in nodes
	s = GetXMLDomNodeText(o)
	if !StringIsBlank(s)
		text = text+s+cscBufferNewLine
	endIf
endForEach
return StringChopRight(text,1)
EndFunction

string function SanatizeContactString(string s)
s = StringReplaceSubstrings (s, scOpensProfileCard, cscNull)
s = StringReplaceSubstrings (s, scOpensCard, cscNull)
s = StringRemoveZeroWidthSpaceChars(s);prevent question style inflection at the end of contacts
return StringTrimLeadingAndTrailingBlanks (s)
endFunction

string function GetFromFieldText()
var
	object XMLDomDoc = GetFSXMLDomDocUnrestricted(),
	object oNode,
	string sItemSpec,
	string sText
if IsOpenReadOnlyMessage(XMLDomDoc)
	sItemSpec = "//Div[@id='ItemReadingPaneContainer' or @id='ConversationReadingPaneContainer']//HTMLHeading2/following::Button[following::Div[starts-with(@id, 'UniqueMessageBody')]]"
elIf IsOpenEditableMessage(XMLDomDoc)
	return GetMessage (OT_ERROR, msgFieldNotAvailable_L, msgFieldNotAvailable_S)
else
	return cscNull
endIf
oNode = XMLDomDoc.selectSingleNode(sItemSpec)
sText = GetXMLDomNodeText(oNode)
sText = SanatizeContactString(sText)
return FormatString (msgFrom, sText)
endFunction

string function GetSentFieldText()
var
	object XMLDomDoc = GetFSXMLDomDocUnrestricted(),
	object oNode,
	string sItemSpec,
	string sText
if IsOpenReadOnlyMessage(XMLDomDoc)
	sItemSpec = "//Div[@id='ItemReadingPaneContainer' or @id='ConversationReadingPaneContainer']//*[contains(@class, 'EditorClass')][last()]/following::Div[not(@hidden='true') and following::Div[starts-with(@id, 'UniqueMessageBody')]]"
elIf IsOpenEditableMessage(XMLDomDoc)
	return GetMessage (OT_ERROR, msgFieldNotAvailable_L, msgFieldNotAvailable_S)
else
	return cscNull
endIf
oNode = XMLDomDoc.selectSingleNode(sItemSpec)
sText = GetXMLDomNodeText(oNode)
return FormatString (msgSent, sText)
endFunction

string function GetToFieldText()
var
	object XMLDomDoc = GetFSXMLDomDocUnrestricted(),
	object oNode,
	string sItemSpec,
	string sText
if IsOpenReadOnlyMessage(XMLDomDoc)
	sItemSpec = "//Div[@id='ItemReadingPaneContainer' or @id='ConversationReadingPaneContainer']//*[contains(@class, 'EditorClass')][1][following::Div[starts-with(@id, 'UniqueMessageBody')]]//Button[not(@id='others')]"
	oNode = XMLDomDoc.selectNodes(sItemSpec)
elIf IsOpenEditableMessage(XMLDomDoc)
	sItemSpec = "//MultilineEdit[1]"
	oNode = XMLDomDoc.selectSingleNode(sItemSpec)
else
	return cscNull
endIf
sText = GetTextFromAllXMLDomNodes(oNode)
sText = SanatizeContactString(sText)
return FormatString (msgTo, sText)
endFunction

string function GetCcFieldText()
var
	object XMLDomDoc = GetFSXMLDomDocUnrestricted(),
	object oNode,
	string sItemSpec,
	string sText
if IsOpenReadOnlyMessage(XMLDomDoc)
	sItemSpec = "//*[contains(text(), '"+scCc+"')]//Button"
	oNode = XMLDomDoc.selectNodes(sItemSpec)
elIf IsOpenEditableMessage(XMLDomDoc)
	sItemSpec = "//MultilineEdit[2]"
	oNode = XMLDomDoc.selectSingleNode(sItemSpec)
else
	return cscNull
endIf
sText = GetTextFromAllXMLDomNodes(oNode)
sText = SanatizeContactString(sText)
return FormatString (msgCc, sText)
endFunction

string function GetSubjectFieldText()
var
	object XMLDomDoc = GetFSXMLDomDocUnrestricted(),
	object oNode,
	string sItemSpec,
	string sText
if IsOpenReadOnlyMessage(XMLDomDoc)
	sItemSpec = "//Div[@id='ItemReadingPaneContainer' or @id='ConversationReadingPaneContainer']//HTMLHeading2[1][following::Div[starts-with(@id, 'UniqueMessageBody')]]"
elIf IsOpenEditableMessage(XMLDomDoc)
	sItemSpec = "//Div[@id='ReadingPaneContainerId']//Edit"
else
	return cscNull
endIf
oNode = XMLDomDoc.selectSingleNode(sItemSpec)
sText = GetXMLDomNodeText(oNode)
return FormatString (msgSubject, sText)
endFunction

string function GetBccFieldText()
var
	object XMLDomDoc = GetFSXMLDomDocUnrestricted(),
	object oNode,
	string sItemSpec,
	string sText
if IsOpenReadOnlyMessage(XMLDomDoc)
	sItemSpec = "//*[contains(text(), '"+scBcc+"')]//Button"
	oNode = XMLDomDoc.selectNodes(sItemSpec)
elIf IsOpenEditableMessage(XMLDomDoc)
	sItemSpec = "//MultilineEdit[3][not(ancestor::Div[contains(@id, 'editorParent_')])]"
	oNode = XMLDomDoc.selectSingleNode(sItemSpec)
else
	return cscNull
endIf
sText = GetTextFromAllXMLDomNodes(oNode)
sText = SanatizeContactString(sText)
return FormatString (msgBcc, sText)
endFunction

Script ReadOutlookHeader (int iField)
var string sText
if iField == 1
	sText = GetFromFieldText()
elIf iField == 2
	sText = GetSentFieldText()
elIf iField == 3
	sText = GetToFieldText()
elIf iField == 4
	sText = GetCcFieldText()
elIf iField == 5
	sText = GetSubjectFieldText()
elIf iField == 6
	sText = GetBccFieldText()
endIf
if StringIsBlank (sText)
	SayMessage (OT_ERROR, msgNotInOpenMessageError_l, msgNotInOpenMessageError_s)
else
	Say (sText, OT_USER_REQUESTED_INFORMATION)
endIf
endScript

Script OutlookAttachmentsList ()
var object XMLDomDoc = GetFSXMLDomDoc()
if !XMLDomDoc return false endIf
If !IsOpenReadOnlyMessage(XMLDomDoc)
&& !IsOpenEditableMessage(XMLDomDoc)
	SayMessage(ot_error, msg_NoOpenMessage1_L, msg_NoOpenMessage1_S)
	return
EndIf
var
	string sItemSpec = "//ListBox[@label='"+scFileAttachments+"']/*",
	object node = XMLDomDoc.SelectSingleNode(sItemSpec),
	int fsID = hexToDec(node.attributes.GetNamedItem("fsID").nodeValue)
if !PerformActionOnElementWithID(Action_setFocus,fsID)
	SayMessage (OT_ERROR, msgAttachmentsList2_L, msgAttachmentsList2_S)
endIf
EndScript

Script MoveToNextEmail()
ProcessMoveToEmail(s_Next)
EndScript

Script MoveToPriorEmail()
ProcessMoveToEmail(s_Prior)
EndScript

object function GetFSXMLDomDoc()
if IsVirtualPCCursor ()
	return GetFSXMLDomDoc()
endIf
var
	int iUseVPC = GetJCFOption (OPT_VIRTUAL_PC_CURSOR),
	object XMLDomDoc
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
XMLDomDoc = GetFSXMLDomDoc()
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, iUseVPC)
return XMLDomDoc
endFunction

object function GetFSXMLDomDocUnrestricted()
if IsVirtualPCCursor ()
	return GetFSXMLDomDocUnrestricted()
endIf
var
	int iUseVPC = GetJCFOption (OPT_VIRTUAL_PC_CURSOR),
	object XMLDomDoc
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
XMLDomDoc = GetFSXMLDomDocUnrestricted()
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, iUseVPC)
return XMLDomDoc
endFunction

int function PerformActionOnElementWithID(int action, int uniqueID, optional int ByRef left, int ByRef top, int ByRef right, int ByRef bottom)
if IsVirtualPCCursor ()
	return PerformActionOnElementWithID(action, uniqueID, left, top, right, bottom)
endIf
var
	int iUseVPC = GetJCFOption (OPT_VIRTUAL_PC_CURSOR),
	int result
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
result = PerformActionOnElementWithID(action, uniqueID, left, top, right, bottom)
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, iUseVPC)
return result
EndFunction

int function IsSelectionChange(int nState, int nOldState)
return (nOldState&CTRL_SELECTED || nState&CTRL_SELECTED) 
	&& !(nOldState&CTRL_SELECTED && nState&CTRL_SELECTED)
EndFunction

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
if iObjType == WT_LISTBOXITEM
&& IsSelectionChange(nState, nOldState)
&& OnMessageList()
	; Outlook changes the message list item name to indicate selected status,
	; speaking the text here causes double speaking of the information so just speak the state change:
	var
	int selected=GetObjectMSAAState ()&STATE_SYSTEM_SELECTED
	if (!selected)
		Say(cmsg214_L, ot_selected_item)
	endIf
	IndicateControlState (GetObjectSubtypeCode(), nChangedState)
	return
EndIf
ObjStateChangedEvent(hObj,iObjType, nChangedState, nState, nOldState)
EndFunction

Void Function NameChangedEvent(handle hwnd, int objId, int childId, int nObjType,
	string sOldName, string sNewName)
if !hWnd
&& OnMessageList()
	; When the selection state of a current message list item is toggled,
	; outlook changes the name of the item, then it issues a focus change.
	; The name does not have all the information during this change,
	; but after the focus change the name will contain information about the selection.
	; This name change should be suppressed.
	return
endIf
NameChangedEvent(hwnd, objId, childId, nObjType, sOldName, sNewName)
BrailleRefresh()
EndFunction

int function IgnoreObjectAtLevel (int level)
var int role = getObjectRole (level)
if (role == ROLE_SYSTEM_PAGETABLIST
|| role == ROLE_SYSTEM_PROPERTYPAGE)
&& stringIsBlank (getObjectName(0, level))
	return TRUE
endIf
var int type = GetObjectSubTypeCode (SOURCE_DEFAULT, level)
; There are often regions in the focus hierarchy but since Outlook
; works best with the VPC disabled there's no point in announcing
; them.
if type >= WT_REGION && TYPE <= WT_GENERIC_REGION
	RETURN true
EndIf
return IgnoreObjectAtLevel (level)
endFunction

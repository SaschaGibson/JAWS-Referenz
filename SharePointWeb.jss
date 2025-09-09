;Copyright (C) 2015 Freedom Scientific Inc
;Freedom Scientific domain scripts for a Sharepoint web server

include "hjconst.jsh"
include "common.jsm"
include "SharePointWeb.jsm"

const
;Window classes:
	SharePointRibbonClass="cui-ribbon",
;Control id's:
	ID_WebAppToolBar_MoveTo_Btn = 7171 

globals
	int g_pageContainsSharePointRibbon

int function ShouldIncludeThisNodeInToolBarList(string role)
return role!=cscNull && role!="presentation" && role!="group" && role!="tablist" && role!="tabpanel"
endFunction

int function roleRequiresSetFocus(string role)
return role=="combobox"
endFunction

string function  GetStateFromAttributes(object attribs)
if attribs.GetNamedItem("aria-disabled").nodeValue=="true"
	return cMsgNotAvailable ; grayed
endIf
if attribs.GetNamedItem("aria-selected").nodeValue=="true"
	return cmsg215_L ; selected
elif attribs.GetNamedItem("aria-pressed").nodeValue=="true"
	return cmsgPressedGraphic1_L ; pressed
elif attribs.GetNamedItem("aria-checked").nodeValue=="true"
	return cMSG_checked ; checked
elif attribs.GetNamedItem("aria-checked").nodeValue=="false"
	return cmsg_notchecked ; not checked
else
	return cscNull
endIf
endFunction

int function IsRibbonToolbar(object node)
var
	object attribs
attribs= node.attributes
return attribs.GetNamedItem("class").nodeValue==SharePointRibbonClass
endFunction

; returns an array of collections where each collection represents a toolbar control node's id, FSTag and label. 
variantArray function GetToolBarControlList()
var 
	object XMLDomDoc,
	string xml,
	object toolbarControlNodes,
	object toolbarNodes,
	object node,
	object attribs,
	variantArray ctrlList,
	collection ctrlData,
	int index
XMLDomDoc= CreateObject("msxml2.DOMDocument.6.0")
if (!XMLDomDoc) return cscNull EndIf
XMLDomDoc.async = false;
XMLDomDoc.resolveExternals = false;
xml=getDocumentXML()
if (xml==cscNull) return cscNull endIf
XMLDomDoc.loadXML(xml)
If (XMLDomDoc.parseError.errorCode) 
	sayFormattedMessage(OT_ERROR, msgParseError, XMLDomDoc.parseError.reason, XMLDomDoc.parseError.line)
	return cscNull;
endIf
;copyToClipboard(xml)
; Because doing this is expensive, we'll also cash if this toolbar is a ribbon. 
toolbarNodes=XMLDomDoc.SelectNodes("//ToolBar")
g_pageContainsSharePointRibbon=false
forEach node in toolbarNodes
	if IsRibbonToolbar(node)
		g_pageContainsSharePointRibbon=true
	endIf
endForEach
; In SharePoint, Toolbar controls are descendents of the Toolbar object.
toolbarControlNodes = XMLDomDoc.SelectNodes("//ToolBar//*")
if (!toolbarControlNodes )
	return cscNull
EndIf
ctrlList=new variantArray[toolbarControlNodes.length()]
index=1
forEach node in toolbarControlNodes
	attribs= node.attributes
	if ShouldIncludeThisNodeInToolBarList(attribs.GetNamedItem("role").nodeValue)
		ctrlData=new collection
		ctrlData.FSID=hexToDec(attribs.GetNamedItem("fsID").nodeValue)
		ctrlData.text=node.text
		if ctrlData.text==cscNull || ctrlData.text==cscSpace
			ctrlData.text=attribs.GetNamedItem("fsText").nodeValue
		endIf
		ctrlData.role=attribs.GetNamedItem("role").nodeValue
		ctrlData.state=GetStateFromAttributes(attribs)
		ctrlList[index]=ctrlData
		index=index+1
	endIf
EndForEach
return ctrlList
endFunction

string function GetListItemTextFromCollection(collection ctrlData)
var
	string role,
	string state,
	string text,
	string listItemText
role=ctrlData.role
if (role==cscNull)
	return cscNull
endIf
text=ctrlData.text
if text==cscNull
	text=msgUnlabeled
endIf
listItemText=text
listItemText=listItemText+cscSpace
listItemText=listItemText+role
state=ctrlData.state
if state!=cscNull
	listItemText=listItemText+cscSpace
	listItemText=listItemText+state
endIf
listItemText=listItemText+LIST_ITEM_SEPARATOR
return listItemText
endFunction

int function SharePointRibbonInIE()
return g_pageContainsSharePointRibbon && GetWindowClass(getFocus())==cwcIEServer
endFunction
 
Script ListWebAppToolbarControls()
var
	variantArray ctrlArray,
	int size,
	int i,
	string ctrlNames,
	int action,
	int buttonChoice
ctrlArray=GetToolBarControlList()
if !ctrlArray
	sayMessage(OT_ERROR, msgNoToolbarControls_L, msgNoToolbarControls_S)
	return
endIf
size=ArrayLength(ctrlArray)
if !size
	sayMessage(OT_ERROR, msgNoToolbarControls_L, msgNoToolbarControls_S)
	return
endIf 
for i=1 to size
	ctrlNames=ctrlNames+GetListItemTextFromCollection(ctrlArray[i])
endFor
i = DlgSelectItemInList (ctrlNames, WebAppToolBarDialogName, false, 1, msgExtraButtons, buttonChoice)
delay(2)
if (!i)
	return
endIf
if SharePointRibbonInIE()
	action=Action_leftMouseClick
else
	action = Action_doDefaultAction
endIf
if roleRequiresSetFocus(ctrlArray[i].role) || buttonChoice==1
	action=Action_setFocus
endIf
PerformActionOnElementWithID(action, ctrlArray[i].fsID)
EndScript

Script ScriptFileName ()
ScriptAndAppNames (GetActiveConfiguration (true))
EndScript

script SetFocusToDocument()
PerformActionOnElementWithTagAndAttribute(Action_setFocus, "DIV", "id", "PageContentContainer")
endScript

void function ScreenSensitiveHelpForWebAppToolBar()
var handle hWnd = GetCurrentwindow()
if GetWindowSubTypeCode(hWnd) == wt_ListView
	SayMessage(ot_user_buffer,sshmsg_WebAppToolBarList)
else ;It's one of the buttons:
	var int id = GetControlID(hWnd)
	if id == id_ok
		SayMessage(ot_user_buffer,sshmsg_WebAppToolBarOKButton)
	elif id == id_cancel
		SayMessage(ot_user_buffer,sshmsg_WebAppToolBarCancelButton)
	elif id == ID_WebAppToolBar_MoveTo_Btn	
		SayMessage(ot_user_buffer,sshmsg_WebAppToolBarMoveToButton)
	endIf
endIf
EndFunction

Int Function ScreenSensitiveHelpForJAWSDialogs()
If InHjDialog()
	var string sRealName = GetWindowName(GetRealWindow(GetCurrentWindow()))
	if StringCompare(sRealName,WebAppToolBarDialogName) == 0
		ScreenSensitiveHelpForWebAppToolBar()
		return true
	endIf
endIf
return ScreenSensitiveHelpForJAWSDialogs()
EndFunction

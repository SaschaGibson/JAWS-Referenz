; Copyright 2017-2018 by Freedom Scientific, Inc.
; function library for working with the FSXMLDom.

include "hjConst.jsh"
include "common.jsm"


int function IsOnWebPage()
var string sClass = GetWindowClass(GetFocus())
return (sClass == cwcIEServer
		|| sClass==cwcFireFoxBrowserClass
		|| sClass == cwcFireFox4BrowserClass
		|| sClass == cwcChromeBrowserClass)
	&& !UserBufferIsActive()
EndFunction

object function GetXMLDomDocItem(string itemSpec, optional string altItemSpec)
if !itemSpec return Null() endIf
if !IsOnWebPage() return Null() endIf
var object XMLDomDoc = GetFSXMLDomDoc()
if !XMLDomDoc return Null() endIf
var object item = XMLDomDoc.selectSingleNode(itemSpec)
if !item
&& altItemSpec
	item = XMLDomDoc.selectSingleNode(altItemSpec)
endIf
return item
endFunction

int function GetItemIDForAction(string itemSpec, optional string altItemSpec)
var object item = GetXMLDomDocItem(itemSpec,altItemSpec)
if !item return 0 endIf
return hexToDec(item.attributes.GetNamedItem("fsID").nodeValue)
EndFunction

int function SayXMLDomDocItem(string itemSpec, optional int name, int value, int outputType)
var object item = GetXMLDomDocItem(itemSpec)
if !item return false endIf
if (!outputType) outputType = ot_screen_message endIf
if !name && !value
	var string text = item.text
	if (!text) text = item.attributes.GetNamedItem("fsText").nodeValue endIf
	if (text) Say(text,outputType) endIf
	return true
endIf
var int wasSpoken
if name
	text = item.attributes.GetNamedItem(name).nodeValue
	if (text)
		Say(text,outputType)
		wasSpoken = true
	endIf
endIf
if value
	text = item.attributes.GetNamedItem(value).nodeValue
	if (text)
		Say(text,outputType)
		wasSpoken = true
	endIf
endIf
return wasSpoken
EndFunction

int function SayAndLeftClickXMLDomDocItem(string itemSpec, optional string altItemSpec, int outputType)
var object item = GetXMLDomDocItem(itemSpec,altItemSpec)
if !item return false endIf
var string text = item.text
if (!text) text = item.attributes.GetNamedItem("fsText").nodeValue endIf
if (!outputType) outputType = ot_screen_message endIf
if (text) Say(text,outputType) endIf
var int fsID = hexToDec(item.attributes.GetNamedItem("fsID").nodeValue)
return PerformActionOnElementWithID(Action_leftMouseClick,fsID)
EndFunction

int function SayAndDoDefaultActionForXMLDomDocItem(string itemSpec, optional string altItemSpec, int outputType)
var object item = GetXMLDomDocItem(itemSpec,altItemSpec)
if !item return false endIf
var string text = item.text
if (!text) text = item.attributes.GetNamedItem("fsText").nodeValue endIf
if (!outputType) outputType = ot_screen_message endIf
if (text) Say(text,outputType) endIf
var int fsID = hexToDec(item.attributes.GetNamedItem("fsID").nodeValue)
return PerformActionOnElementWithID(Action_doDefaultAction,fsID)
EndFunction

int function DoDefaultActionForXMLDomDocItem(string itemSpec, optional string altItemSpec)
var object item = GetXMLDomDocItem(itemSpec,altItemSpec)
if !item return false endIf
var string text = item.text
if (!text) text = item.attributes.GetNamedItem("fsText").nodeValue endIf
var int fsID = hexToDec(item.attributes.GetNamedItem("fsID").nodeValue)
return PerformActionOnElementWithID(Action_doDefaultAction,fsID)
EndFunction

int function SetFocusToXMLDomDocItem(string itemSpec)
var int fsID = GetItemIDForAction(itemSpec)
if !fsID return false endIf
return PerformActionOnElementWithID(Action_setFocus,fsID)
EndFunction

int function MakeVisibleXMLDomDocItem(string itemSpec)
var int fsID = GetItemIDForAction(itemSpec)
if !fsID return false endIf
return PerformActionOnElementWithID(Action_makeVisible,fsID)
EndFunction

object function GetXMLDomDocNodeList(string nodeSpec)
if !nodeSpec return Null() endIf
if !IsOnWebPage() return Null() endIf
var object XMLDomDoc = GetFSXMLDomDoc()
if !XMLDomDoc return Null() endIf
return XMLDomDoc.selectNodes(nodeSpec)
EndFunction

object function GetXMLDomDocFocusElement()
if !IsOnWebPage() return Null() endIf
var object node = GetFSXMLElementNode()
if !node return Null() endIf
var string fsID = node.attributes.GetNamedItem("fsID").nodeValue 
var string selectNodeSpec = "//*[@fsID='"+fsID+"']"
return node.selectSingleNode(selectNodeSpec)
EndFunction

object function GetXMLDomDocFocusParentElement()
if !IsOnWebPage() return Null() endIf
var object XMLDomDoc = GetFSXMLDomDoc()
if !XMLDomDoc return Null() endIf
var object ElementNode = GetFSXMLElementNode()
if !ElementNode return Null() endIf
var string fsID = ElementNode.attributes.GetNamedItem("fsID").nodeValue 
var string selectNodeSpec = "//*[@fsID='"+fsID+"']"
var object focusNode = XMLDomDoc.selectSingleNode(selectNodeSpec)
return FocusNode.parentNode
EndFunction

object function GetXMLDomDocFocusGrandparentElement()
if !IsOnWebPage() return Null() endIf
var object XMLDomDoc = GetFSXMLDomDoc()
if !XMLDomDoc return Null() endIf
var object ElementNode = GetFSXMLElementNode()
if !ElementNode return Null() endIf
var string fsID = ElementNode.attributes.GetNamedItem("fsID").nodeValue 
var string selectNodeSpec = "//*[@fsID='"+fsID+"']"
var object focusNode = XMLDomDoc.selectSingleNode(selectNodeSpec)
return FocusNode.parentNode.parentNode
EndFunction

object function GetXMLDomDocFocusAncestorElementWithNodeName(string nodeName)
if !nodeName return Null() endIf
if !IsOnWebPage() return Null() endIf
var object XMLDomDoc = GetFSXMLDomDoc()
if !XMLDomDoc return Null() endIf
var object ElementNode = GetFSXMLElementNode()
if !ElementNode return Null() endIf
var string fsID = ElementNode.attributes.GetNamedItem("fsID").nodeValue 
var string selectNodeSpec = "//*[@fsID='"+fsID+"']"
var object node = XMLDomDoc.selectSingleNode(selectNodeSpec)
while node
	if node.nodeName == nodeName
		return node
	endIf
	node = Node.parentNode
endWhile
return Null()
EndFunction

object function GetXMLDomDocFocusNthAncestorElement(int iAncestor)
if !IsOnWebPage() return Null() endIf
if iAncestor < 0 return Null() endIf
var object XMLDomDoc = GetFSXMLDomDoc()
if !XMLDomDoc return Null() endIf
var object ElementNode = GetFSXMLElementNode()
if !ElementNode return Null() endIf
var
	string fsID = ElementNode.attributes.GetNamedItem("fsID").nodeValue,
	string focusNodeSpec = "//*[@fsID='"+fsID+"']",
	object focusNode = XMLDomDoc.selectSingleNode(focusNodeSpec),
	int i
for i = 1 to iAncestor
	focusNode = focusNode.parentNode
	if !focusNode return Null() endIf
endFor
return focusNode
EndFunction

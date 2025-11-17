include "HJConst.jsh"
include "HJGlobal.jsh"
include "XMLDom.jsh"
include "Common.jsm"
include "HomeRow.jsh"
include "HomeRow.jsm"

import "FileIO.jsd" ; for verifying domain-specific config info


globals
	int SayAllForNodeInfo


object function GetHomeRowFSXMLDomDoc()
var
	object XMLDomDoc,
	string xml
XMLDomDoc = CreateXMLDomDoc()
if (!XMLDomDoc) return Null() EndIf
xml = getDocumentXML()
if (!xml) return Null() endIf

;This is the temporary fix to remove characters causing a parse error:
;Legal XML characters are #x9 #xA #xD [#x20-#xD7FF] [#xE000-#xFFFD] [#x10000-#x10FFFF]
;any Unicode character, excluding the surrogate blocks, FFFE, and FFFF.
xml = StringRemoveCharsInRange(XML,3,3)
xml = StringRemoveCharsInRange(XML,0x00,0x08)
xml = StringRemoveCharsInRange(XML,0x0b,0x0c)
xml = StringRemoveCharsInRange(XML,0x0e,0x1f)
xml = StringRemoveCharsInRange(XML,0xD800,0xdfff)

XMLDomDoc.preserveWhiteSpace = 0xffffffff
if !LoadAndParseXML(XMLDomDoc,xml)
	sayFormattedMessage(OT_ERROR, msgHomerowXMLParseError,
		XMLDomDoc.parseError.line,
		XMLDomDoc.parseError.linePos,
		XMLDomDoc.parseError.reason)
	return Null()
endIf
return XMLDomDoc
EndFunction

int function InitXMLDomDocBrowser()
HomeRowXMLDomDoc = GetHomeRowFSXMLDomDoc()
if (!HomeRowXMLDomDoc) return false EndIf
HomerowXMLDomDocumentElement = HomeRowXMLDomDoc.documentElement
if !SetHomerowXMLDomDocCurrentToFocusNode()
	HomerowXMLDomDocCurrent = HomerowXMLDomDocumentElement
endIf
return true
EndFunction

void function NullXMLDomDocBrowser()
HomerowXMLDomDocCurrent = Null()
HomerowXMLDomDocumentElement = Null()
HomeRowXMLDomDoc = Null()
EndFunction

string function GetXMLDomNodeInfo()
var
	string sResult,
	string s, int i
if HomerowXMLDomDocCurrent.nodeType != XML_ELEMENT_NODE
	s = HomerowXMLDomDocCurrent.NodeTypeString
	sResult = sResult+FormatString(msgNameValueFormat,"NodeType",s)+cscBufferNewLine
endIf
if HomerowXMLDomDocCurrent.nodeName
	s = HomerowXMLDomDocCurrent.nodeName
	sResult = sResult+FormatString(msgNameValueFormat,"NodeName",s)+cscBufferNewline
endIf
if HomerowXMLDomDocCurrent.nodeValue
	s = HomerowXMLDomDocCurrent.nodeValue
	sResult = sResult+FormatString(msgNameValueFormat,"NodeValue",s)+cscBufferNewline
endIf
if HomerowXMLDomDocCurrent.TagName
	s = HomerowXMLDomDocCurrent.TagName
	sResult = sResult+FormatString(msgNameValueFormat,"TagName",s)+cscBufferNewline
endIf
if HomerowXMLDomDocCurrent.Text
	s = HomerowXMLDomDocCurrent.Text
	sResult = sResult+FormatString(msgNameValueFormat,"Text",s)+cscBufferNewline
endIf
if HomerowXMLDomDocCurrent.TextContent
	s = HomerowXMLDomDocCurrent.TextContent
	sResult = sResult+FormatString(msgNameValueFormat,"TextContent",s)+cscBufferNewline
endIf
if HomerowXMLDomDocCurrent.hasChildNodes()
	i = HomerowXMLDomDocCurrent.childNodes.length
endIf
if i
	sResult = sResult+FormatString(msgNameValueFormat,"Child node count",IntToString(i))+cscBufferNewLine
endIf
var object attribs, object a
attribs = HomerowXMLDomDocCurrent.attributes
if !attribs
	s = HomerowXMLDomDocCurrent.xml
	sResult = sResult+"\n\nXML:\n"+s+cscBufferNewLine
	return sResult
endIf
sResult = sResult+"\n\nAttributes:\n"
ForEach a in attribs
	if a.value
		s = FormatString(msgNameValueFormat,a.name,a.value)
		sResult = sResult+s+cscBufferNewLine
	endIf
EndForEach
s = HomerowXMLDomDocCurrent.xml
sResult = sResult+"\n\nXML:\n"+s+cscBufferNewLine
return sResult
EndFunction

void function ShowXMLNodeInfo()
EnsureNoUserBufferActive()
UserBufferAddText(GetXMLDomNodeInfo())
UserBufferActivate()
JAWSTopOfFile()
if SayAllForNodeInfo
	SayAll()
else
	SayLine()
endIf
EndFunction

void function UtilityShowTextDescendantsNodeList()
var object textNodeList = HomerowXMLDomDocCurrent.selectNodes("descendant::text()")
if textNodeList.length == 0
	Say(msgErr_NoTextDescendants,ot_error)
	return
endIf
var int i, int length = textNodeList.length, string output
for i = 0 to length-1
	Output = output+cscBufferNewLine+FormatString(msgDescendantTextNodeListItemOutput,IntToString(i),TextNodeList.item(i).text)
endFor
if !output return endIf
EnsureNoUserBufferActive()
UserBufferAddText(msgDescendantTextNodeListOutputTitle)
UserBufferAddText(output)
UserBufferActivate()
JAWSTopOfFile()
SayLine()
EndFunction

int function SetHomerowXMLDomDocCurrentToFocusNode()
var object node = GetFSXMLElementNode()
if !node return false endIf
var string fsID = node.attributes.GetNamedItem("fsID").nodeValue 
var string selectNodeSpec = "//*[@fsID='"+fsID+"']"
HomerowXMLDomDocCurrent = HomeRowXMLDomDoc.selectSingleNode(selectNodeSpec)
return true
EndFunction

void function UtilityXMLDomDocFocus()
if !HomerowXMLDomDocCurrent
	Say(msgErr_NoXMLDomDocBrowser,ot_error)
	return
EndIf
if SetHomerowXMLDomDocCurrentToFocusNode()
	UtilityXMLDomDocBrowserSayInfo()
endIf
EndFunction

void function UtilityXMLDomDocBrowserRoot()
if !HomerowXMLDomDocCurrent
	Say(msgErr_NoXMLDomDocBrowser,ot_error)
	return
EndIf
HomerowXMLDomDocCurrent = HomerowXMLDomDocumentElement
UtilityXMLDomDocBrowserSayInfo()
EndFunction

void function UtilityXMLDomDocBrowserFirstChild()
if !HomerowXMLDomDocCurrent
	Say(msgErr_NoXMLDomDocBrowser,ot_error)
	return
EndIf
if !HomerowXMLDomDocCurrent.hasChildNodes
	Say(msgErr_NoXMLDomChildNode,ot_error)
	return
EndIf
HomerowXMLDomDocCurrent = HomerowXMLDomDocCurrent.firstChild
UtilityXMLDomDocBrowserSayInfo()
EndFunction

void function UtilityXMLDomDocBrowserParent()
if !HomerowXMLDomDocCurrent
	Say(msgErr_NoXMLDomDocBrowser,ot_error)
	return
EndIf
if !HomerowXMLDomDocCurrent.parentNode.parentNode
	;tested extra level because document has a parent,
	;and we don't want to go there.
	Say(msgErr_NoXMLDomParentNode,ot_error)
	return
EndIf
HomerowXMLDomDocCurrent = HomerowXMLDomDocCurrent.parentNode
UtilityXMLDomDocBrowserSayInfo()
EndFunction

void function UtilityXMLDomDocBrowserNext()
if !HomerowXMLDomDocCurrent
	Say(msgErr_NoXMLDomDocBrowser,ot_error)
	return
EndIf
if !HomerowXMLDomDocCurrent.nextSibling
	Say(msgErr_NoXMLDomNextSiblingNode,ot_error)
	return
EndIf
HomerowXMLDomDocCurrent = HomerowXMLDomDocCurrent.nextSibling
UtilityXMLDomDocBrowserSayInfo()
EndFunction

void function UtilityXMLDomDocBrowserPrior()
if !HomerowXMLDomDocCurrent
	Say(msgErr_NoXMLDomDocBrowser,ot_error)
	return
EndIf
if !HomerowXMLDomDocCurrent.previousSibling
	Say(msgErr_NoXMLDomPriorSiblingNode,ot_error)
	return
EndIf
HomerowXMLDomDocCurrent = HomerowXMLDomDocCurrent.previousSibling
UtilityXMLDomDocBrowserSayInfo()
EndFunction

void function UtilityXMLDomDocBrowserLastSibling()
if !HomerowXMLDomDocCurrent
	Say(msgErr_NoXMLDomDocBrowser,ot_error)
	return
EndIf
if HomerowXMLDomDocCurrent.parentNode.childNodes.length == 1
	return
endIf
HomerowXMLDomDocCurrent = HomerowXMLDomDocCurrent.parentNode.lastChild
UtilityXMLDomDocBrowserSayInfo()
EndFunction

void function UtilityXMLDomDocBrowserFirstSibling()
if !HomerowXMLDomDocCurrent
	Say(msgErr_NoXMLDomDocBrowser,ot_error)
	return
EndIf
if HomerowXMLDomDocCurrent.parentNode.childNodes.length == 1
	return
endIf
HomerowXMLDomDocCurrent = HomerowXMLDomDocCurrent.parentNode.firstChild
UtilityXMLDomDocBrowserSayInfo()
EndFunction

void function UtilityXMLDomDocBrowserEscape()
EnsureNoUserBufferActive()
Say(msgExitingXMLDomDocBrowser,ot_status)
NullXMLDomDocBrowser()
EndFunction

void function UtilityXMLDomDocBrowserSetOutputMode()
If ut_XMLDomDocOutputMode == UT_XMLDomDocNumberOfChildren
	ut_XMLDomDocOutputMode = UT_XMLDomDocAllInfo
Else
	ut_XMLDomDocOutputMode = ut_XMLDomDocOutputMode + 1
endIf
UtilityXMLDomDocBrowserSayOutputMode()
EndFunction

void function UtilityXMLDomDocBrowserSetOutputModeReverseOrder()
If ut_XMLDomDocOutputMode == UT_XMLDomDocAllInfo
	ut_XMLDomDocOutputMode = UT_XMLDomDocNumberOfChildren
Else
	ut_XMLDomDocOutputMode = ut_XMLDomDocOutputMode - 1
endIf
UtilityXMLDomDocBrowserSayOutputMode()
EndFunction

void function UtilityXMLDomDocBrowserSayOutputMode()
If ut_XMLDomDocOutputMode == ut_XMLDomDocName
	Say(msgName,ot_status)
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocValue
	Say(msgValue,ot_status)
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocText
	Say(msgText,ot_status)
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocType
	Say(msgType,ot_status)
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocTagInfo
	Say(msgTagInfo,ot_status)
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocClass
	Say(msgClass,ot_status)
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocFocusInfo
	Say(msgFocusInfo,ot_status)
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocNumberOfChildren
	Say(msgObjectNumberOfChildren,ot_status)
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocAllInfo
	Say(msgObjectAllInfo,ot_status)
endIf
EndFunction

void Function UtilityXMLDomDocBrowserSayInfo(int bSpellMode)
var string sText, string s
var object attribs = HomerowXMLDomDocCurrent.Attributes
If ut_XMLDomDocOutputMode == ut_XMLDomDocName
	sText = HomerowXMLDomDocCurrent.NodeName
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocValue
	sText = HomerowXMLDomDocCurrent.NodeValue
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocText
	s = cscNull
	if HomerowXMLDomDocCurrent.Text
		s = s+FormatString(msgNameValueFormat,"Text",HomerowXMLDomDocCurrent.Text)+cscBufferNewLine
	endIf
	if HomerowXMLDomDocCurrent.TextContent
		s = s+FormatString(msgNameValueFormat,"TextContent",HomerowXMLDomDocCurrent.TextContent)+cscBufferNewLine
	endIf
	if attribs.GetNamedItem("label").NodeValue
		s = s+FormatString(msgNameValueFormat,"label",attribs.GetNamedItem("label").NodeValue)+cscBufferNewLine
	endIf
	if attribs.GetNamedItem("fsText").NodeValue
		s = s+FormatString(msgNameValueFormat,"fsText",attribs.GetNamedItem("fsText").NodeValue)+cscBufferNewLine
	endIf
	if (s) sText = s endIf
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocType
	s = cscNull
	if attribs.GetNamedItem("fsType").NodeValue
		s = s+FormatString(msgNameValueFormat,"fsType",attribs.GetNamedItem("fsType").NodeValue)+cscBufferNewLine
	endIf
	if attribs.GetNamedItem("Type").NodeValue
		s = s+FormatString(msgNameValueFormat,"Type",attribs.GetNamedItem("Type").NodeValue)+cscBufferNewLine
	endIf
	if attribs.GetNamedItem("role").NodeValue
		s = s+FormatString(msgNameValueFormat,"Role",attribs.GetNamedItem("role").NodeValue)+cscBufferNewLine
	endIf
	if attribs.GetNamedItem("xml_roles").NodeValue
		s = s+FormatString(msgNameValueFormat,"XML_Roles",attribs.GetNamedItem("xml_roles").NodeValue)+cscBufferNewLine
	endIf
	if (s) sText = s endIf
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocTagInfo
	s = cscNull
	if HomerowXMLDomDocCurrent.TagName
		s = s+FormatString(msgNameValueFormat,"TagName",HomerowXMLDomDocCurrent.TagName)+cscBufferNewLine
	endIf
	if attribs.GetNamedItem("tag").NodeValue
		s = s+FormatString(msgNameValueFormat,"Tag",attribs.GetNamedItem("tag").NodeValue)+cscBufferNewLine
	endIf
	if attribs.GetNamedItem("fsTag").NodeValue
		s = s+FormatString(msgNameValueFormat,"fsTag",attribs.GetNamedItem("fsTag").NodeValue)+cscBufferNewLine
	endIf
	if (s) sText = s endIf
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocClass
	s = cscNull
	if attribs.GetNamedItem("class").NodeValue
		s = s+FormatString(msgNameValueFormat,"class",attribs.GetNamedItem("class").NodeValue)+cscBufferNewLine
	endIf
	if (s) sText = s endIf
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocFocusInfo
	s = cscNull
	if attribs.GetNamedItem("HasKeyboardFocus").NodeValue
		s = s+FormatString(msgNameValueFormat,"HasKeyboardFocus",attribs.GetNamedItem("HasKeyboardFocus").NodeValue)+cscBufferNewLine
	endIf
	if attribs.GetNamedItem("fsFormField").NodeValue
		s = s+FormatString(msgNameValueFormat,"fsFormField",attribs.GetNamedItem("fsFormField").NodeValue)+cscBufferNewLine
	endIf
	if attribs.GetNamedItem("fsFocusable").NodeValue
		s = s+FormatString(msgNameValueFormat,"fsFocusable",attribs.GetNamedItem("fsFocusable").NodeValue)+cscBufferNewLine
	endIf
	if (s) sText = s endIf
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocNumberOfChildren
	s = cscNull
	if HomerowXMLDomDocCurrent.hasChildNodes()
		s = s+FormatString(msgNameValueFormat,"Number of child nodes",HomerowXMLDomDocCurrent.childNodes.length)+cscBufferNewLine
	endIf
	if (s) sText = s endIf
ElIf ut_XMLDomDocOutputMode == ut_XMLDomDocAllInfo
	ShowXMLNodeInfo()
	return
endIf
EnsureNoUserBufferActive()
UserBufferAddText(sText)
UserBufferActivate()
JAWSTopOfFile()
Say(sText,ot_no_disable)
EndFunction

void function UtilityXMLDomDocBrowserSayInfoAccess()
UtilityXMLDomDocBrowserSayInfo(IsSameScript())
EndFunction

void function UtilityToggleXMLDomDocBrowserMode()
gbXMLDomDocBrowserActive = !gbXMLDomDocBrowserActive
if gbXMLDomDocBrowserActive
	if InitXMLDomDocBrowser()
		AddHook(HK_SCRIPT, "XMLDomDocBrowserHook")
		TrapKeys(false)
		Say(msgEnteringXMLDomDocBrowser,ot_status)
		ShowXMLNodeInfo()
	else
		Say(msgErr_NoXMLDomDocBrowser,ot_error)
		gbXMLDomDocBrowserActive = false
	EndIf
else
	EnsureNoUserBufferActive()
	RemoveHook(HK_SCRIPT,"XMLDomDocBrowserHook")
	TrapKeys(false)
	Say(msgExitingXMLDomDocBrowser,ot_status)
EndIf
EndFunction

void function XMLDomDocBrowserHook(string ScriptName, string FrameName)
if scriptName == "UpALevel" then
	;prevent inadvertent use of Escape key to exit the virtual viewer
	return false
elif ScriptName == "HomeRowToggle"
	;toggle off the hook here before the homerow toggle script is allowed to run:
	UtilityToggleXMLDomDocBrowserMode()
	return true
elif ScriptName == "UtilityInitializeHomeRowPosition" then
	UtilityXMLDomDocFocus()
	return false
elif ScriptName == "UtilitySayWindow" then
	SayAllForNodeInfo = true
	ShowXMLNodeInfo()
	SayAllForNodeInfo = false
	return false
elif ScriptName == "UtilityMoveToChild" then
	UtilityXMLDomDocBrowserFirstChild()
	return false
elif ScriptName == "UtilityMoveToParent" then
	UtilityXMLDomDocBrowserParent()
	return false
elif ScriptName == "UtilityMoveToNextWindow" then
	UtilityXMLDomDocBrowserNext()
	return false
elif ScriptName == "UtilityMoveToPriorWindow" then
	UtilityXMLDomDocBrowserPrior()
	return false
elif ScriptName == "UtilityMoveToLastWindow" then
	UtilityXMLDomDocBrowserLastSibling()
	return false
elif ScriptName == "UtilityMoveToFirstWindow" then
	UtilityXMLDomDocBrowserFirstSibling()
	return false
elif ScriptName == "UtilitySayInfoAccess" then
	UtilityXMLDomDocBrowserSayInfoAccess()
	return false
elif ScriptName == "UtilitySetOutputMode" then
	UtilityXMLDomDocBrowserSetOutputMode()
	return false
elif ScriptName == "UtilitySayOutputMode" then
	UtilityXMLDomDocBrowserSayOutputMode()
	return false
elif ScriptName == "UtilitySetOutputModeReverseOrder" then
	UtilityXMLDomDocBrowserSetOutputModeReverseOrder()
	return false
elif ScriptName == "UtilityToggleSpeakWindowVisibility"
	UtilityShowTextDescendantsNodeList()
	return false
elif ScriptName == "UtilitySayMSAAObjectInfoAccess"
	UtilityXMLDomDocBrowserRoot()
	return false
EndIf
return true
EndFunction

; not technically related to xml dom,
; but if you're using xml dom, chances are this is for a custom set of scripts,
; may be for a domain.

int function ExistingConfigExistsForDomain (string domainName)
if ! domainName return FALSE endIf
var collection configNamesSection = iniReadSectionToCollection ("Domains", "ConfigNames.ini", FLOC_USER_SETTINGS)
var string tmp, string key
forEach key in configNamesSection
	tmp = configNamesSection[key]
	if stringCompare (domainName, tmp) == 0 then return TRUE endIf
endForEach
; if that fails, check shared where our stuff lives:
configNamesSection = iniReadSectionToCollection ("Domains", "ConfigNames.ini", FLOC_SHARED_SETTINGS)
forEach key in configNamesSection
	tmp = configNamesSection[key]
	if stringCompare (domainName, tmp) == 0 then return TRUE endIf
endForEach
endFunction

void function ShowUtilityDomainSpecificConfigurationInfo ()
var string domainName = getActiveConfiguration (TRUE)
if stringIsBlank (domainName) then
	sayMessage (OT_ERROR, msgWebDomainInfoErrorNoDomain)
	return
endIf
; verify we don't have a set of scripts for this domain
if ExistingConfigExistsForDomain (domainName) then
	sayMessage (OT_ERROR, msgWebDomainInfoErrorDomainAlreadyAssociated)
	return
endIf
var string message = formatString (msgWebDomainInfo, domainName)
sayMessage (OT_USER_BUFFER, message)
endFunction



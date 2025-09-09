include "HJConst.jsh"
include "HJGlobal.jsh"
include "Common.jsm"
include "HomeRow.jsh"
include "HomeRow.jsm"

/*
interface IAccessibleObject : IDispatch
{
	[propget, id(-4),restricted] HRESULT  _NewEnum([out, retval] IUnknown** pResult);
	[propget, id(0)] HRESULT  Item(long index,[out, retval] IDispatch** pResult);
	[propget, id(1)] HRESULT  Name([out, retval] BSTR* pResult);
	[propget, id(2)] HRESULT  Value([out, retval] BSTR* pResult);
	[propget, id(3)] HRESULT  ClassName([out, retval] BSTR* pResult);
	[propget, id(4)] HRESULT  AutomationId([out, retval] BSTR* pResult);
	[propget, id(5)] HRESULT  Description([out, retval] BSTR* pResult);
	[propget, id(6)] HRESULT  State([out, retval] long* pResult);
	[propget, id(7)] HRESULT  Role([out, retval] long* pResult);
	[propget, id(8)] HRESULT Parent([out, retval] IAccessibleObject ** pResult);
	[propget, id(9)] HRESULT FirstChild([out, retval] IAccessibleObject ** pResult);
	[propget, id(10)] HRESULT NextSibling([out, retval] IAccessibleObject ** pResult);
	[propget, id(11)] HRESULT PriorSibling([out, retval] IAccessibleObject ** pResult);
	[propget, id(12)] HRESULT Rect([out] long *pLeft, [out] long *pTop,[out] long *pRight, [out] long *pBottom,[out, retval] VARIANT_BOOL *pResult);
	[propget, id(13)] HRESULT ClickablePoint([out] long *pX, [out] long *pY,[out, retval] VARIANT_BOOL *pResult);
	[propget, id(14)] HRESULT  ChildCount([out, retval] long *pResult);
	[propget, id(15)] HRESULT  IsOffscreen([out, retval] VARIANT_BOOL* pResult);
	[id(20)] HRESULT FindByAutomationId(BSTR desired,[out, retval] IAccessibleObject ** pResult);
	[id(21)] HRESULT FindByClassName(BSTR desired,[out, retval] IAccessibleObject ** pResult);
	[id(22)] HRESULT FindByName(BSTR desired,[out, retval] IAccessibleObject ** pResult);
	[id(23)] HRESULT FindByValue(BSTR desired,[out, retval] IAccessibleObject ** pResult);
	[id(24)] HRESULT FindByRole(long desired,[out, retval] IAccessibleObject ** pResult);
	[id(25)] HRESULT FindByState(long desired,[out, retval] IAccessibleObject ** pResult);
	[id(26)] HRESULT FindByKeyboardFocus(long desired,[out, retval] IAccessibleObject ** pResult);
	[propget, id(27)] HRESULT ItemType([out, retval]BSTR* pResult);
	[propget, id(28)] HRESULT ItemStatus([out,retval]BSTR* pResult);
	[propget, id(29)] HRESULT TableRowCount([out,retval]long* pResult);
	[propget, id(30)] HRESULT TableColumnCount([out,retval]long* pResult);
	[propget, id(31)] HRESULT TableRowIndex([out,retval]long* pResult);
	[propget, id(32)] HRESULT TableColumnIndex([out,retval]long* pResult);
	[propget, id(33)] HRESULT TableColumnHeader([out, retval]BSTR* pResult);
	[propget, id(34)] HRESULT TableRowHeader([out,retval]BSTR* pResult);
	[id(35)] HRESULT GetGroupPosition([out]long* groupLevel, [out]long* groupCount, [out]long* groupIndex);
	[propget, id(36)] HRESULT UIAControlType([out, retval]long* pResult);
	[propget, id(37)] HRESULT UIALocalizedControlType([out, retval]BSTR* pResult);
	[id(101)] HRESULT GetXML(VARIANT_BOOL vbIncludeDescendents,[out, retval] BSTR * pbstrResult);
};
*/

globals
	int gbUIAObjectBrowserActive,
	object oHomeRowXMLAccessibleObjectBrowserRoot,
	object oHomeRowBrowserCurrNode


string function FormatUIAObjectTreeInfo(string sData)
var
	int count,
	int indent,
	int i,
	string sSegment,
	int iNum,
	int j,
	int bStartItem,
	int bEndItem,
	string sOutput
let indent = 0
let count = StringSegmentCount(sData,"\n")
let i = 1
while i <= count
	let bStartItem = false
	let bEndItem = false
	let sSegment = StringSegment(sData,"\n",i)
	if StringLeft(sSegment,1) == "<" then
		if StringLeft(sSegment,2) == "</" then
			let indent = indent-1
			let bEndItem = true
		else
			let indent = indent+1
			let bStartItem = true
		EndIf
	elif StringLeft(sSegment,2) == "/>" then
		let indent = indent-1
		let bEndItem = true
	elif StringStartsWith(sSegment,"State=")
	|| StringStartsWith(sSegment,"Role=") then
		let iNum = StringToInt(StringSegment(sSegment,"\"",2))
		if iNum > 0 then
			let sSegment = sSegment+cscSpace+"(0x"+DecToHex(iNum)+")"
		EndIf
	EndIf
	if bEndItem then
		let j = indent
	else
		let j = indent-1
	EndIf
	while j > 0
		let sSegment = "\t"+sSegment
		let j = j-1
	EndWhile
	if bStartItem then
		let sOutput = sOutput+"\n"+IntToString(indent-1)+":"+"\n"
	EndIf
	let sOutput = sOutput+sSegment+"\n"
	let i = i+1
EndWhile
return sOutput
EndFunction

string function GetUIATopObjectTreeInfo()
var
	object o
let o = GetUIAObjectTree(hHomeRowPos)
if !o then
	Say(msgErr_NoObjectTree,ot_error)
	return cscNull
EndIf
return o.GetXML(true)
EndFunction

void function ShowUIATopObjectTreeInfo()
var
	string sData
let sData = GetUIATopObjectTreeInfo()
if !sData then
	Say(msgErr_NoObjectTreeData,ot_error)
	return
EndIf
let sData = FormatUIAObjectTreeInfo(sData)
if !sData then
	Say(msgErr_FailedToGetOutputData,ot_error)
	return
endIf
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
UserBufferAddText(msgUIATopObjectTreeOutputTitle)
UserBufferAddText(sData)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferActivate()
JAWSTopOfFile()
SayLine()
EndFunction

string function GetUIAFocusParentObjectTreeInfo()
var
	object o,
	object oBackup
let o = GetUIAObjectTree(hHomeRowPos)
if !o then
	Say(msgErr_NoObjectTree,ot_error)
	return cscNull
EndIf
let o = o.FindByKeyboardFocus(1)
if !o then
	Say(msgErr_NoObjectFocusItem,ot_error)
	return cscNull
EndIf
;Sometimes, what is reported as the focus object is actually an ancestor to the focus object.
;If we look further down, we may find a descendent is really the focus object:
while o
	let oBackup = o
	let o = o.FirstChild.FindByKeyboardFocus(1)
EndWhile
let o = oBackup.Parent
if !o then
	Say(msgErr_NoObjectFocusParentItem,ot_error)
	return cscNull
EndIf
return o.GetXML(true)
EndFunction

void function ShowUIAFocusParentObjectTreeInfo()
var
	string sData
let sData = GetUIAFocusParentObjectTreeInfo()
if !sData then
	Say(msgErr_NoObjectTreeData,ot_error)
	return
EndIf
let sData = FormatUIAObjectTreeInfo(sData)
if !sData then
	Say(msgErr_FailedToGetOutputData,ot_error)
	return
endIf
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
UserBufferAddText(msgUIAFocusParentObjectTreeOutputTitle)
UserBufferAddText(sData)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferActivate()
JAWSTopOfFile()
SayLine()
EndFunction

string function GetUIAFocusObjectTreeInfo()
var
	object o,
	object oBackup
let o = GetUIAObjectTree(hHomeRowPos)
if !o then
	Say(msgErr_NoObjectTree,ot_error)
	return cscNull
EndIf
let o = o.FindByKeyboardFocus(1)
if !o then
	Say(msgErr_NoObjectFocusItem,ot_error)
	return cscNull
EndIf
;Sometimes, what is reported as the focus object is actually an ancestor to the focus object.
;If we look further down, we may find a descendent is really the focus object:
while o
	let oBackup = o
	let o = o.FirstChild.FindByKeyboardFocus(1)
EndWhile
return oBackup.GetXML(true)
EndFunction

void function ShowUIAFocusObjectTreeInfo()
var
	string sData
let sData = GetUIAFocusObjectTreeInfo()
if !sData then
	Say(msgErr_NoObjectTreeData,ot_error)
	return
EndIf
let sData = FormatUIAObjectTreeInfo(sData)
if !sData then
	Say(msgErr_FailedToGetOutputData,ot_error)
	return
endIf
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
UserBufferAddText(msgUIAFocusObjectTreeOutputTitle)
UserBufferAddText(sData)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferActivate()
JAWSTopOfFile()
SayLine()
EndFunction

string function FormatUIAObjectInfo(object o)
var
	string sName,
	string sRole,
	string sClassName,
	string sAutomationId,
	string sValue,
	int i,
	string sState,
	string sDescription
let sName = o.Name
let sRole = o.Role
let sRole = sRole+cscSpace+"(0x"+DecToHex(StringToInt(sRole))+")"
let sClassName = o.ClassName
let sAutomationId = o.AutomationId
let sValue = o.Value
let i = o.State
if i != 0 then
	let sState = IntToString(i)+cscSpace+"(0x"+DecToHex(i)+")"
else
	let sState = IntToString(i)
EndIf
let sDescription = o.Description
return FormatString(msgUIAObjectItemOutput,
	sName, sRole, sClassName, sAutomationId, sValue, sState, sDescription)
EndFunction

void function ShowUIAObjectFocusInfo()
var
	object o,
	string sData
let o = GetUIAObjectFocusItem()
if !o then
	Say(msgErr_NoObjectFocusItem,ot_error)
	return
EndIf
let sData = FormatUIAObjectInfo(o)
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
UserBufferAddText(msgUIAObjectFocusItemOutputTitle+cscBufferNewLine)
UserBufferAddText(sData+cscBufferNewLine)
UserBufferAddText(cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferActivate()
JAWSTopOfFile()
SayLine()
EndFunction

void function ShowUIAObjectFocusAncestorsInfo()
var
	object o,
	string sLevelInfo,
	string sData,
	int iLevel,
	string sLevel
let o = GetUIAObjectFocusItem()
if !o then
	Say(msgErr_NoObjectFocusItem,ot_error)
	return
EndIf
let iLevel = 0
while o
	let sLevel = FormatString(msgUIAObjectLevel,iLevel)
	let sLevelInfo = FormatUIAObjectInfo(o)
	let sData = sData+cscBufferNewLine+sLevel+cscBufferNewLine+sLevelInfo+cscBufferNewLine
	let o = o.Parent
	let iLevel = iLevel+1
EndWhile
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
UserBufferAddText(msgUIAObjectFocusAncestorsOutputTitle)
UserBufferAddText(sData)
UserBufferAddText(cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferActivate()
JAWSTopOfFile()
SayLine()
EndFunction

object function GetUIAXMLObject(string UIAInfoXMLString)
var
	object oMSXML,
	object o
if !UIAInfoXMLString then
	return Null()
EndIf
let oMSXML = CreateObject("msxml2.DOMDocument.6.0")
if !oMSXML then
	if InHomeRowMode() then
		Say(msgErr_NoXMLObject,ot_error)
	EndIf
	return Null()
EndIf
oMSXML.async = false
oMSXML.resolveExternals = false
oMSXML.loadXML(UIAInfoXMLString)
let o = oMSXML.SelectNodes("/item")
if !o then
	if InHomeRowMode() then
		say(msgErr_NoItemsInXMLObject,ot_error)
	EndIf
	return Null()
EndIf
return o.item(0)
EndFunction

int function InitUIAObjectBrowser()
let oHomeRowXMLAccessibleObjectBrowserRoot = GetUIAXMLObject(GetUIATopObjectTreeInfo())
if !oHomeRowXMLAccessibleObjectBrowserRoot then
	return false
EndIf
let oHomeRowBrowserCurrNode = oHomeRowXMLAccessibleObjectBrowserRoot
return true
EndFunction

void function NullUIAObjectBrowser()
let oHomeRowXMLAccessibleObjectBrowserRoot = Null()
let oHomeRowBrowserCurrNode = Null()
EndFunction

string function GetUIANodeInfo()
var
	object oAttribs,
	object o,
	string sName,
	string sValue,
	string sResult
let oAttribs = oHomeRowBrowserCurrNode.attributes
ForEach o in oAttribs
	let sName = o.nodeName
	let sValue = o.nodeValue
	let sResult = sResult+FormatString(msgUIANodeInfo,sName,sValue)+"\n"
EndForEach
let sResult = sResult+cscBufferNewLine+FormatString(msgUIAObjectNodeChildCount,oHomeRowBrowserCurrNode.childNodes.length)
return sResult
EndFunction

void function ShowUIANodeInfo()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
UserBufferAddText(GetUIANodeInfo())
UserBufferActivate()
JAWSTopOfFile()
SayLine()
EndFunction

void function UtilityUIAObjectBrowserRoot()
if !oHomeRowBrowserCurrNode then
	Say(msgErr_NoUIAObjectBrowser,ot_error)
	return
EndIf
let oHomeRowBrowserCurrNode = oHomeRowXMLAccessibleObjectBrowserRoot
UtilityUIAObjectBrowserSayInfo()
EndFunction

void function UtilityUIAObjectBrowserFirstChild()
if !oHomeRowBrowserCurrNode then
	Say(msgErr_NoUIAObjectBrowser,ot_error)
	return
EndIf
if !oHomeRowBrowserCurrNode.hasChildNodes then
	Say(msgErr_NoUIAChildObject,ot_error)
	return
EndIf
let oHomeRowBrowserCurrNode = oHomeRowBrowserCurrNode.firstChild
UtilityUIAObjectBrowserSayInfo()
EndFunction

void function UtilityUIAObjectBrowserParent()
if !oHomeRowBrowserCurrNode then
	Say(msgErr_NoUIAObjectBrowser,ot_error)
	return
EndIf
if !oHomeRowBrowserCurrNode.parentNode.parentNode then
	;tested extra level because document has a parent,
	;and we don't want to go there.
	Say(msgErr_NoUIAParentObject,ot_error)
	return
EndIf
let oHomeRowBrowserCurrNode = oHomeRowBrowserCurrNode.parentNode
UtilityUIAObjectBrowserSayInfo()
EndFunction

void function UtilityUIAObjectBrowserNext()
if !oHomeRowBrowserCurrNode then
	Say(msgErr_NoUIAObjectBrowser,ot_error)
	return
EndIf
if !oHomeRowBrowserCurrNode.nextSibling then
	Say(msgErr_NoUIANextObject,ot_error)
	return
EndIf
let oHomeRowBrowserCurrNode = oHomeRowBrowserCurrNode.nextSibling
UtilityUIAObjectBrowserSayInfo()
EndFunction

void function UtilityUIAObjectBrowserPrior()
if !oHomeRowBrowserCurrNode then
	Say(msgErr_NoUIAObjectBrowser,ot_error)
	return
EndIf
if !oHomeRowBrowserCurrNode.previousSibling then
	Say(msgErr_NoUIAPriorObject,ot_error)
	return
EndIf
let oHomeRowBrowserCurrNode = oHomeRowBrowserCurrNode.previousSibling
UtilityUIAObjectBrowserSayInfo()
EndFunction

void function UtilityUIAObjectBrowserLastSibling()
if !oHomeRowBrowserCurrNode then
	Say(msgErr_NoUIAObjectBrowser,ot_error)
	return
EndIf
if oHomeRowBrowserCurrNode.parentNode.childNodes.length == 1 then
	return
endIf
let oHomeRowBrowserCurrNode = oHomeRowBrowserCurrNode.parentNode.lastChild
UtilityUIAObjectBrowserSayInfo()
EndFunction

void function UtilityUIAObjectBrowserFirstSibling()
if !oHomeRowBrowserCurrNode then
	Say(msgErr_NoUIAObjectBrowser,ot_error)
	return
EndIf
if oHomeRowBrowserCurrNode.parentNode.childNodes.length == 1 then
	return
endIf
let oHomeRowBrowserCurrNode = oHomeRowBrowserCurrNode.parentNode.firstChild
UtilityUIAObjectBrowserSayInfo()
EndFunction

void function UtilityUIAObjectBrowserEscape()
if UserBufferIsActive() then
	UserBufferDeactivate()
	UserBufferClear()
EndIf
Say(msgExitingUIAObjectBrowser,ot_status)
NullUIAObjectBrowser()
EndFunction

void function UtilityUIAObjectBrowserSetOutputMode()
If ut_UIAObjectOutputMode == UT_UIAObjectNumberOfChildren then
	let ut_UIAObjectOutputMode = UT_UIAObjectAllInfo
Else
	let ut_UIAObjectOutputMode = ut_UIAObjectOutputMode + 1
endIf
UtilityUIAObjectBrowserSayOutputMode()
EndFunction

void function UtilityUIAObjectBrowserSetOutputModeReverseOrder()
If ut_UIAObjectOutputMode == UT_UIAObjectAllInfo then
	let ut_UIAObjectOutputMode = UT_UIAObjectNumberOfChildren
Else
	let ut_UIAObjectOutputMode = ut_UIAObjectOutputMode - 1
endIf
UtilityUIAObjectBrowserSayOutputMode()
EndFunction

void function UtilityUIAObjectBrowserSayOutputMode()
If ut_UIAObjectOutputMode == ut_UIAObjectName then
	Say(msgName,ot_status)
ElIf ut_UIAObjectOutputMode == ut_UIAObjectRole then
	Say(msgObjectRole,ot_status)
ElIf ut_UIAObjectOutputMode == ut_UIAObjectClassName then
	Say(msgObjectClassName,ot_status)
ElIf ut_UIAObjectOutputMode == ut_UIAObjectAutomationId then
	Say(msgObjectAutomationID,ot_status)
ElIf ut_UIAObjectOutputMode == ut_UIAObjectValue then
	Say(msgValue,ot_status)
ElIf ut_UIAObjectOutputMode == ut_UIAObjectState then
	Say(msgState,ot_status)
ElIf ut_UIAObjectOutputMode == ut_UIAObjectDescription then
	Say(msgDescription,ot_status)
ElIf ut_UIAObjectOutputMode == ut_UIAObjectHasKeyboardFocus then
	Say(msgObjectHasKeyboardFocus,ot_status)
ElIf ut_UIAObjectOutputMode == ut_UIAObjectNumberOfChildren then
	Say(msgObjectNumberOfChildren,ot_status)
ElIf ut_UIAObjectOutputMode == ut_UIAObjectAllInfo then
	Say(msgObjectAllInfo,ot_status)
endIf
EndFunction

void Function UtilityUIAObjectBrowserSayInfo(int bSpellMode)
var
	string sText
If ut_UIAObjectOutputMode == ut_UIAObjectName then
	let sText = oHomeRowBrowserCurrNode.attributes.GetNamedItem("Name").NodeValue
ElIf ut_UIAObjectOutputMode == ut_UIAObjectRole then
	let sText = oHomeRowBrowserCurrNode.attributes.GetNamedItem("Role").NodeValue
ElIf ut_UIAObjectOutputMode == ut_UIAObjectClassName then
	let sText = oHomeRowBrowserCurrNode.attributes.GetNamedItem("ClassName").NodeValue
ElIf ut_UIAObjectOutputMode == ut_UIAObjectAutomationID then
	let sText = oHomeRowBrowserCurrNode.attributes.GetNamedItem("AutomationId").NodeValue
ElIf ut_UIAObjectOutputMode == ut_UIAObjectValue then
	let sText = oHomeRowBrowserCurrNode.attributes.GetNamedItem("Value").NodeValue
ElIf ut_UIAObjectOutputMode == ut_UIAObjectState then
	let sText = oHomeRowBrowserCurrNode.attributes.GetNamedItem("State").NodeValue
	;let sText = DecToHexWithZeroPadding(s)
ElIf ut_UIAObjectOutputMode == ut_UIAObjectDescription then
	let sText = oHomeRowBrowserCurrNode.attributes.GetNamedItem("Description").NodeValue
ElIf ut_UIAObjectOutputMode == ut_UIAObjectHasKeyboardFocus then
	let sText = oHomeRowBrowserCurrNode.attributes.GetNamedItem("HasKeyboardFocus").NodeValue
ElIf ut_UIAObjectOutputMode == ut_UIAObjectNumberOfChildren then
	let sText = IntToString(oHomeRowBrowserCurrNode.childNodes.length)
ElIf ut_UIAObjectOutputMode == ut_UIAObjectAllInfo then
	;because this information is to be shown and not spoken,
	;do not drop down to default behavior:
	ShowUIANodeInfo()
	return
endIf
if UserBufferIsActive() then
	UserBufferDeactivate()
	UserBufferClear()
EndIf
If bSpellMode then
	SpellString(sText)
Else
	Say(sText,ot_help)
endIf
EndFunction

void function UtilityUIAObjectBrowserSayInfoAccess()
UtilityUIAObjectBrowserSayInfo(IsSameScript())
EndFunction

void function UtilityToggleUIAObjectBrowserMode()
let gbUIAObjectBrowserActive = !gbUIAObjectBrowserActive
if gbUIAObjectBrowserActive	then
	if InitUIAObjectBrowser() then
		AddHook(HK_SCRIPT, "UIAObjectBrowserHook")
		TrapKeys(false)
		Say(msgEnteringUIAObjectBrowser,ot_status)
	else
		Say(msgErr_NoUIAObjectBrowser,ot_error)
		let gbUIAObjectBrowserActive = false
	EndIf
else
	if UserBufferIsActive() then
		UserBufferDeactivate()
	EndIf
	UserBufferClear()
	RemoveHook(HK_SCRIPT,"UIAObjectBrowserHook")
	TrapKeys(false)
	Say(msgExitingUIAObjectBrowser,ot_status)
EndIf
EndFunction

void function UIAObjectBrowserHook(string ScriptName, string FrameName)
if ScriptName == "HomeRowToggle" then
	;toggle off the hook here before the homerow toggle script is allowed to run:
	UtilityToggleUIAObjectBrowserMode()
	return true
elif ScriptName == "UtilityInitializeHomeRowPosition" then
	UtilityUIAObjectBrowserRoot()
	return false
elif ScriptName == "UtilitySayWindow" then
	ShowUIANodeInfo()
	return false
elif ScriptName == "UtilityMoveToChild" then
	UtilityUIAObjectBrowserFirstChild()
	return false
elif ScriptName == "UtilityMoveToParent" then
	UtilityUIAObjectBrowserParent()
	return false
elif ScriptName == "UtilityMoveToNextWindow" then
	UtilityUIAObjectBrowserNext()
	return false
elif ScriptName == "UtilityMoveToPriorWindow" then
	UtilityUIAObjectBrowserPrior()
	return false
elif ScriptName == "UtilityMoveToLastWindow" then
	UtilityUIAObjectBrowserLastSibling()
	return false
elif ScriptName == "UtilityMoveToFirstWindow" then
	UtilityUIAObjectBrowserFirstSibling()
	return false
elif ScriptName == "UtilitySayInfoAccess" then
	UtilityUIAObjectBrowserSayInfoAccess()
	return false
elif ScriptName == "UtilitySetOutputMode" then
	UtilityUIAObjectBrowserSetOutputMode()
	return false
elif ScriptName == "UtilitySayOutputMode" then
	UtilityUIAObjectBrowserSayOutputMode()
	return false
elif ScriptName == "UtilitySetOutputModeReverseOrder" then
	UtilityUIAObjectBrowserSetOutputModeReverseOrder()
	return false
EndIf
return true
EndFunction

;Homerow utility MSAA functions

INCLUDE "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "HomeRow.jsh"
include "HomeRow.jsm"

globals
	int gbUseMSAA,  ;True if MSAA is to be used, false if cashed MSAA information may be used
	stringArray MSAAObjectModeLabels

string function DecToHexWithZeroPadding(int x)
var
	string HexNumber,
	int n
HexNumber = DecToHex(x)
n = StringLength(HexNumber)%4
if n == 3 then
	return FormatString(msgHexIntegerFormat,pad_Zero,Hexnumber)
elif n == 2 then
	return FormatString(msgHexIntegerFormat,pad_ZeroZero,Hexnumber)
elif n == 1 then
	return FormatString(msgHexIntegerFormat,pad_ZeroZeroZero,Hexnumber)
else
	return FormatString(msgHexIntegerFormat,cscNull,HexNumber)
EndIf
EndFunction

void function UtilityToggleUseMSAA()
gbUseMSAA  = !gbUseMSAA
if gbUseMSAA  then
	Say(msgUseMSAAAlways,ot_status)
else
	Say(msgUseMSAACached,ot_status)
EndIf
EndFunction

void function ShowInViewer(string sText, int iSayAll)
if !sText then
	Say(msgNotAvailable,ot_status)
	return
EndIf
EnsureNoUserBufferActive()
UserBufferAddText(sText+cscBufferNewlIne)
UserBufferAddText(msgBufferCloseLink,"UserBufferDeactivate()",msgBufferCloseLink)
UserBufferActivate()
JAWSTopOfFile()
if iSayAll then
	SayAll()
else
	SayLine()
EndIf
EndFunction

void function UtilityShowObjectList()
var
	string sList
sList = GetListOfObjects(hHomeRowPos,cscBufferNewLine)
If StringLength(sList)>2 Then
    ShowInViewer(FormatString(msgInfoInViewer,
	    	msgObjectListTitle,
	    	sList),
	    false)
Else
    SayMessage(ot_status,msgNoObjectsInWindow_L,msgNoObjectsInWindow_S)
EndIf
EndFunction

void function InitMSAAObjectModeLabels()
if MSAAObjectModeLabels return endIf
MSAAObjectModeLabels = new StringArray[ut_Last_Object_Mode]
MSAAObjectModeLabels[ut_ObjectName] = msgName
MSAAObjectModeLabels[ut_ObjectType] = msgType
MSAAObjectModeLabels[ut_ObjectSubType] = msgSubtype_L
MSAAObjectModeLabels[ut_ObjectRole] = msgObjectRole
MSAAObjectModeLabels[ut_ObjectValue] = msgValue
MSAAObjectModeLabels[ut_ObjectState] = msgState
MSAAObjectModeLabels[ut_ObjectStateCode] = msgStateCode
MSAAObjectModeLabels[ut_ObjectMSAAState] = msgMSAAState
MSAAObjectModeLabels[ut_ObjectIA2State] = msgIA2State
MSAAObjectModeLabels[ut_ObjectDescription] = msgDescription
MSAAObjectModeLabels[ut_ObjectHelp] = msgHelp
MSAAObjectModeLabels[ut_ObjectTypeDescription] = msgTypeDescription
MSAAObjectModeLabels[ut_ObjectPlaceHolder] = msgPlaceHolder
MSAAObjectModeLabels[ut_ObjectID] = msgObjectID
MSAAObjectModeLabels[ut_ObjectChildID] = msgChildID
MSAAObjectModeLabels[ut_ObjectClassName] = msgObjectClassName
MSAAObjectModeLabels[ut_ObjectAutomationID] = msgObjectAutomationID
MSAAObjectModeLabels[ut_ObjectItemType] = msgObjectItemType
MSAAObjectModeLabels[ut_ObjectItemStatus] = msgObjectItemStatus
MSAAObjectModeLabels[ut_ObjectIsEditable] = MSAAObjectIsEditable
EndFunction

string function UtilityGetLabelForMSAAObjectInfo(int mode)
if mode < ut_First_Object_Mode || mode > ut_Last_Object_Mode return cscNull endIf
InitMSAAObjectModeLabels()
return MSAAObjectModeLabels[mode]
EndFunction

string Function UtilityGetMSAAObjectInfo(int mode)
var
	int iMSAA_JCFOpt,
	string sText,
	int ObjID,
	int ChildID,
	int n
iMSAA_JCFOpt = GetJCFOption (opt_MSAA_mode)
SetJCFOption (opt_MSAA_mode, 2)
If Mode == ut_ObjectName
	sText = GetObjectName(gbUseMSAA)
ElIf Mode == ut_ObjectType
	sText = GetObjectType()
	If !sText
		sText = msgUnknown
	endIf
ElIf Mode == ut_ObjectSubType
	sText = IntToString(GetObjectSubtypeCode(gbUseMSAA))
ElIf Mode == ut_ObjectRole
	n = GetObjectRole()
	if n
		sText = FormatString("%1 (%2)",IntToString(n),GetRoleText(n))
	else
		sText = IntToString(n)
	endIf
ElIf Mode == ut_ObjectValue
	sText = GetObjectValue(gbUseMSAA)
ElIf Mode == ut_ObjectState
	sText = GetObjectState(gbUseMSAA)
ElIf Mode == ut_ObjectStateCode
	sText = DecToHexWithZeroPadding(GetObjectStateCode(gbUseMSAA))
ElIf Mode == ut_ObjectMSAAState
	sText = DecToHexWithZeroPadding(GetObjectMSAAState())
ElIf Mode == ut_ObjectIA2State
	sText = DecToHexWithZeroPadding(GetObjectIA2State())
ElIf Mode == ut_ObjectDescription
	sText = GetObjectDescription(gbUseMSAA)
elif Mode == ut_ObjectHelp
	sText = GetObjectHelp()
elif Mode == ut_ObjectTypeDescription
	sText = GetObjectTypeDescription()
elif Mode == ut_ObjectPlaceHolder
	sText = GetObjectPlaceHolder()
ElIf Mode == ut_ObjectID
	GetFocus(ObjID,ChildID)
	sText = IntToString(ObjID)
ElIf Mode == ut_ObjectChildID
	GetFocus(ObjID,ChildID)
	sText = IntToString(ChildID)
elif Mode == ut_ObjectClassName
	sText = GetObjectClassName()
elif Mode == ut_ObjectAutomationID
	sText = GetObjectAutomationID()
elif Mode == ut_ObjectItemType
	sText = GetObjectItemType()
elif Mode == ut_ObjectItemStatus
	sText = GetObjectItemStatus()
elif Mode == ut_ObjectIsEditable
	if GetObjectIsEditable()
		sText = cmsgTrue
	else
		sText = cmsgFalse
	endIf
endIf
SetJCFOption (opt_MSAA_mode, iMSAA_JCFOpt)
return sText
EndFunction

void Function UtilitySayMSAAObjectInfo (int bSpellMode)
if !ut_MSAAObjectOutputMode ut_MSAAObjectOutputMode = ut_ObjectName endIf
var string sText = UtilityGetMSAAObjectInfo(ut_MSAAObjectOutputMode)
If bSpellMode then
	SpellString(sText)
Else
	Say(sText,ot_help)
endIf
EndFunction

void function UtilitySayMSAAObjectInfoAccess()
var
	Int bSpellMode
If IsSameScript() then
	bSpellMode = ON
Else
	bSpellMode = OFF
endIf
UtilitySayMSAAObjectInfo(bSpellMode)
EndFunction

void function UtilityPutMSAAObjectInfoInBox()
if !ut_MSAAObjectOutputMode ut_MSAAObjectOutputMode = ut_ObjectName endIf
ShowInViewer(FormatString(msgInfoInViewer,
	UtilityGetLabelForMSAAObjectInfo (ut_MSAAObjectOutputMode),
	UtilityGetMSAAObjectInfo(ut_MSAAObjectOutputMode)),
	true)
EndFunction

void function UtilitySetMSAAObjectOutputMode ()
If ut_MSAAObjectOutputMode == ut_Last_Object_Mode
	ut_MSAAObjectOutputMode = ut_First_Object_Mode
Else
	ut_MSAAObjectOutputMode = ut_MSAAObjectOutputMode + 1
endIf
UtilitySayMSAAObjectOutputMode ()
EndFunction

void function UtilitySetMSAAObjectOutputModeReverseOrder ()
If ut_MSAAObjectOutputMode == ut_First_Object_Mode 
	ut_MSAAObjectOutputMode = ut_Last_Object_Mode
Else
	ut_MSAAObjectOutputMode = ut_MSAAObjectOutputMode - 1
endIf
UtilitySayMSAAObjectOutputMode ()
EndFunction

void function UtilitySayMSAAObjectOutputMode ()
Say(UtilityGetLabelForMSAAObjectInfo(ut_MSAAObjectOutputMode),ot_status)
EndFunction

void function UtilityCopyMSAAObjectInfo ()
if !ut_MSAAObjectOutputMode ut_MSAAObjectOutputMode = ut_ObjectName endIf
var string sText = UtilityGetMSAAObjectInfo(ut_MSAAObjectOutputMode)
ClipboardTextChanged = true
CopyToClipboard(sText)
Say(sText,ot_help)
EndFunction

int function UtilityGetObjectDepth()
;Use GetAncestorCount instead of this function,
;since this function may fail where GetAncestorCount does not.
var
	object o,
	int i
let o = GetCurrentObject(0)
let i = 0
while o
	let o = o.accParent()
	let i = i+1
EndWhile
return i
EndFunction

string function UtilityGetFormattedMessageForObjectHierarchyInfo(int iLevel)
var
	int iLeft,
	int iTop,
	int iRight,
	int iBottom,
	string sProperties,
	string s,
	int n
s = GetObjectName(1,iLevel)
if (s)
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectName ), s)
endIf
s = GetObjectValue(1,iLevel)
if (s)
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectValue), s)
endIf
s = IntToString(GetObjectSubtypeCode(1,iLevel))
if (s)
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectSubType), s)
endIf
n = GetObjectRole(iLevel)
if (n)
	s = FormatString("%1 (%2)",IntToString(n),GetRoleText(n))
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectRole), s)
endIf
s = GetObjectState(1,iLevel)
if (s)
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectState), s)
endIf
n = GetObjectMSAAState(iLevel)
if (n)
	s = DecToHexWithZeroPadding(n)
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectMSAAState), s)
endIf
n = GetObjectIA2State(iLevel)
if (n)
	s = DecToHexWithZeroPadding(n)
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectIA2State), s)
endIf
s = GetObjectDescription(1,iLevel)
if (s)
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectDescription), s)
endIf
s = GetObjectClassName(iLevel)
if (s)
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectClassName), s)
endIf
s = GetObjectAutomationID(iLevel)
if (s)
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectAutomationID), s)
endIf
s = GetObjectItemType(iLevel)
if (s)
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectItemType), s)
endIf
s = GetObjectItemStatus(iLevel)
if (s)
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectItemStatus), s)
endIf
if iLevel == 0
&& GetObjectIsEditable()
	s = cmsgTrue
	sProperties = sProperties+cscBufferNewLine+
		FormatString(msgPropertyAndValue, UtilityGetLabelForMSAAObjectInfo(ut_ObjectIsEditable), s)
endIf
GetObjectRect(iLeft,iRight,iTop,iBottom,1,iLevel)
return FormatString(msgLevelHierarchyInfo,
	IntToString(iLevel),
	StringChopLeft(sProperties,1),
	FormatString(msgObjectRect,IntToString(iLeft),IntToString(iTop),IntToString(iRight),IntToString(iBottom)))
EndFunction

string function UtilityGetObjectHierarchyInfo()
var
	string sInfo,
	int iDepth,
	int iLevel,
	int iMSAA_JCFOpt
iMSAA_JCFOpt = GetJCFOption (opt_MSAA_mode)
SetJCFOption (opt_MSAA_mode, 2)
iDepth = GetAncestorCount()
if iDepth
	sInfo = msgObjectHierarchyInfoTitle+cscBufferNewLine+cscBufferNewLine
EndIf
iLevel = 0
while iLevel <= iDepth
	sInfo = sInfo+UtilityGetFormattedMessageForObjectHierarchyInfo(iLevel)
	iLevel = iLevel+1
	if iLevel <= iDepth
		sInfo = sInfo+cscBufferNewLine+cscBufferNewLine+msgDashedLine+cscBufferNewLine
	EndIf
EndWhile
if sInfo
	sInfo = sInfo+cscBufferNewLine+cscBufferNewLine+msgAsteriskLine
EndIf
SetJCFOption (opt_MSAA_mode, iMSAA_JCFOpt)
return sInfo
EndFunction

void function UtilityShowObjectHierarchyInfo()
ShowInViewer(UtilityGetObjectHierarchyInfo(),false)
EndFunction

string Function UtilityGetObjectByNameInfo(string sName)
var
	string sValue,
	string sHk,
	string sDesc,
	string sContainer,
	int iState,
	int iType
If GetObjectInfoByName(hHomeRowPos, sName, 1, iType, iState, sValue, sDesc, sHk, sContainer) Then
	return FormatString(msgObjectByNameInfo,
		sName, sValue,
		IntToString(iType),
		IntToString(iState),
		sDesc,sHk,sContainer)
EndIf
return cscNull
EndFunction

void function UtilityShowObjectListInfoByName()
var
	string sInfoList,
	string sInfo,
	string sList,
	int i,
	int iCount
let sList = GetListOfObjects(hHomeRowPos)
If StringLength(sList)>2 Then
	let i = 1
	let iCount = StringSegmentCount(sList,LIST_ITEM_SEPARATOR)
	let sInfo = StringSegment(sList,LIST_ITEM_SEPARATOR,i)
	while i <= iCount
		let sInfoList = sInfoList+UtilityGetObjectByNameInfo(sInfo)
		if i < iCount then
			let sInfoList = sInfoList+cscBufferNewLine+cscBufferNewLine+msgDashedLine+cscBufferNewLine
		EndIf
		let i = i+1
		let sInfo = StringSegment(sList,LIST_ITEM_SEPARATOR,i)
	EndWhile
EndIf
if sInfoList then
	let sInfoList = sInfoList+cscBufferNewLine+cscBufferNewLine+msgasteriskLine
    ShowInViewer(FormatString(msgInfoInViewer,
	    	msgObjectListInfoByNameTitle,
	    	sInfoList),
	    false)
Else
    SayMessage(ot_status,msgNoObjectsInWindow_L,msgNoObjectsInWindow_S)
EndIf
EndFunction

void function SayCurrentMSAAMode()
Say(FormatString(msgSayCurrentMSAAMode,IntToString(GetJCFOption(opt_MSAA_mode))),ot_user_requested_information)
EndFunction

;msgEmptyCachedMSAAInfo is a segment of the string
;returned by builtin function GetCachedMSAAFocusInfo when there is no object from which to get info.
;The string does not need translation.
const
	msgEmptyCachedMSAAInfo = ", name , role 0, state 0, children 0, siblings 0, value , hwnd 0 object 0, child 0, description , rect 0/0 to 0/0, hotkey "

prototype int function GetAncestorCount(optional int usePrevious)
prototype string function GetCachedMSAAFocusInfo(int level, optional int usePrevious)
prototype string function GetCachedAltFocusInfo()

string function ParseAriaAttributes(string s)
var
	string sAriaAttribText = StringRegexMatch (s, "(^AriaAttribs.*$)"),
	string sAttributes = stringChopLeft (sAriaAttribText, StringLength(StringSegment (sAriaAttribText, cscSpace, 1))+1),
	string sParsedText = StringSegment (sAriaAttribText, cscSpace, 1),
	string sText,
	int iSegmentCount = StringSegmentCount (sAttributes, ";"),
	int i
for i = 1 to iSegmentCount
	sText = StringSegment (sAttributes, ";", i)
	sParsedText = StringConcatenate (sParsedText, cscBufferNewLine, "	", StringSegment (sText, ":", 1), cscSpace, StringSegmentRemove (sText, ":", 1))
endFor
return StringSegmentReplace (s, cscBufferNewLine, StringSegmentIndex (s, cscBufferNewLine, sAriaAttribText, true), sParsedText)
endFunction

void function UtilityShowCachedMSAAFocusInfo(optional int includePrevious)
var
	string sInfo,
	string s,
	int AncestorCount = GetAncestorCount(false),
	int i
if (includePrevious)
	sInfo = FormatString(msgCurrentHeader, AncestorCount)
else
	sInfo = FormatString(msgAncestorCountHeader, AncestorCount)
endIf
for i = AncestorCount to 0 descending
	s = GetCachedMSAAFocusInfo(i, false)
	If s
	&& StringChopLeft(s,StringLength(StringSegment(s,cscBufferNewLine,1))) != msgEmptyCachedMSAAInfo
		s = ParseAriaAttributes(s)
		sInfo = sInfo+cscBufferNewLine+cscBufferNewLine+StringTrimLeadingBlanks(s)
	endIf
EndFor
if (includePrevious)
	AncestorCount = GetAncestorCount(true)
	sInfo = sInfo + cscBufferNewLine + cscBufferNewLine
		+ FormatString(msgPreviousHeader, AncestorCount)
	for i = AncestorCount to 0 descending
		s = GetCachedMSAAFocusInfo(i, true)
		If s
		&& StringChopLeft(s,StringLength(StringSegment(s,cscBufferNewLine,1))) != msgEmptyCachedMSAAInfo
			s = ParseAriaAttributes(s)
			sInfo = sInfo+cscBufferNewLine+cscBufferNewLine+StringTrimLeadingBlanks(s)
		endIf
	EndFor
endIf
sInfo = StringTrimLeadingBlanks(sInfo)
if sInfo
    ShowInViewer(FormatString(msgInfoInViewer,
	    	msgCachedMSAAFocusInfo,
	    	sInfo),
	    false)
Else
    SayMessage(ot_status,msgNoCachedMSAAFocusInfo_L,msgNoCachedMSAAFocusInfo_S)
EndIf
EndFunction

void function UtilityShowCachedAltFocusInfo()
var string info = GetCachedAltFocusInfo()
if info
	ShowInViewer(info, false)
Else
	SayMessage(ot_status,msgNoCachedMSAAFocusInfo_L,msgNoCachedMSAAFocusInfo_S)
EndIf
EndFunction

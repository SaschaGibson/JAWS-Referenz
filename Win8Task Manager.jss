; JAWS Task Manager scripts for Windows 8

include "HJConst.jsh"
include "MSAAConst.jsh"
include "HJGlobal.jsh"
include "Common.jsm"
include "Win8Task Manager.jsm"

const
;object class names:
	oc_TmScrollViewer = "TmScrollViewer",
	oc_TmGroupHeader = "TmGroupHeader",
	oc_TmViewItemSelector = "TmViewItemSelector",
	oc_TmRowTextElement = "TmRowTextElement"

;for collection of data:
const
;NavDir is used when navigating across the columns of list item:
	NavDir_ColumnRight = 1,
	NavDir_ColumnLeft = 2,
;types of items for which data is collected:
	CustomType_Unknown = 0,
	CustomType_TableGrid = 1,
	CustomType_TableItem = 2
globals
	collection c_FocusItemData

void function AutoStartEvent()
if !c_FocusItemData then
	let c_FocusItemData = new collection
EndIf
EndFunction

void function AutoFinishEvent()
CollectionRemoveAll(c_FocusItemData)
EndFunction

int function GetUIAObjectItemType(optional object o)
if GetWindowClass(GetFocus()) != cwc_DirectUIhWND then
	return false
EndIf
if !o then
	let o = GetUIAObjectFocusItem()
EndIf
if !o then
	return CustomType_Unknown
EndIf
if o.Role == ROLE_SYSTEM_OUTLINEITEM
&& o.ClassName == oc_TmViewItemSelector then
	return CustomType_TableItem
elif o.ClassName == oc_TmScrollViewer then
	return CustomType_TableGrid
else
	return CustomType_Unknown
EndIf
EndFunction

void function UpdateFocusItemData(optional int NavDir)
var
	object oItem,
	int iType,
	string sTableHeaders,
	string s,
	object oItemParent,
	int ColumnCount,
	int i
let oItem = GetUIAObjectFocusItem()
let iType = GetUIAObjectItemType(oItem)
if iType == CustomType_Unknown then
	CollectionRemoveAll(c_FocusItemData)
	return
EndIf
if iType == CustomType_TableGrid then
	CollectionRemoveAll(c_FocusItemData)
	let C_FocusItemData.CustomType = iType
	let c_FocusItemData.Name = oItem.Name
	let oItem = oItem.FindByClassName(oc_TmRowTextElement)
	while oItem
		let s = oItem.Name
		let sTableHeaders = sTableHeaders+s+cscSpace
		let oItem = oItem.NextSibling
	EndWhile
	let c_FocusItemData.Value = sTableHeaders
elif iType == CustomType_TableItem then
	let C_FocusItemData.CustomType = iType
	let ColumnCount = oItem.FirstChild.ChildCount-1
	if !NavDir then
		let c_FocusItemData.CurrentColumn = 1
	elif NavDir == NavDir_ColumnRight then
		if c_FocusItemData.CurrentColumn < ColumnCount then
			let c_FocusItemData.CurrentColumn = c_FocusItemData.CurrentColumn+1
		else
			Beep()
			return
		EndIf
	elif NavDir == NavDir_ColumnLeft then
		if c_FocusItemData.CurrentColumn > 1
			let c_FocusItemData.CurrentColumn = c_FocusItemData.CurrentColumn-1
		else
			Beep()
			return
		EndIf
	EndIf
	let oItemParent = oItem.Parent
	if oItemParent.ClassName == oc_TmGroupHeader then
		let c_FocusItemData.PrevGroupName = c_FocusItemData.GroupName
		let c_FocusItemData.PrevGroupValue = c_FocusItemData.GroupValue
		let c_FocusItemData.GroupName = oItemParent.Name
		let c_FocusItemData.GroupValue = oItemParent.Value
		let oItemParent = oItemParent.Parent
	EndIf
	if oItemParent.ClassName == oc_TmScrollViewer then
		let c_FocusItemData.TableName = oItemParent.Name
	EndIf
	if c_FocusItemData.CurrentColumn == 1 then
		let c_FocusItemData.State = oItem.State
	else
		if CollectionItemExists(c_FocusItemData,"State") then
			CollectionRemoveItem(c_FocusItemData,"State")
		EndIf
	EndIf
	;the text elements for the columns in the row are two levels down,
	;and start at the second item, the first item is an icon:
	let oItem = oItem.firstChild.FirstChild.NextSibling
	let i = 1
	while oItem
	&& i < c_FocusItemData.currentColumn
		let oItem = oItem.NextSibling
		let i = i+1
	EndWhile
	if oItem.ClassName != oc_TmRowTextElement then
		;this should never be true, but clear data just in case:
		CollectionRemoveAll(c_FocusItemData)
		return
	EndIf
	let c_FocusItemData.Name = oItem.Name
	let c_FocusItemData.Value = oItem.Value
EndIf
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
UpdateFocusItemData()
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

int function SpeakTableGrid()
if C_FocusItemData.CustomType != CustomType_TableGrid then
	return false
EndIf
Say(c_FocusItemData.Name,ot_Control_Name)
SayUsingVoice(vctx_message,c_FocusItemData.Value,ot_line)
EndFunction

void function SpeakTableItemState()
if c_FocusItemData.State & STATE_SYSTEM_EXPANDED then
	IndicateControlState(WT_TreeViewItem, CTRL_EXPANDED)
elif c_FocusItemData.State & STATE_SYSTEM_COLLAPSED  then
	IndicateControlState(WT_TreeViewItem, CTRL_COLLAPSED)
EndIf
EndFunction

int function SpeakTableItem(optional int bOnNavigation)
if C_FocusItemData.CustomType != CustomType_TableItem then
	return false
EndIf
if !bOnNavigation then
	if CollectionItemExists(c_FocusItemData,"TableName") then
		IndicateControlType(WT_Table ,c_FocusItemData.TableName)
	EndIf
	if CollectionItemExists(c_FocusItemData,"groupName")
	&& c_FocusItemData.GroupName != c_FocusItemData.PrevGroupName then
		Say(c_FocusItemData.GroupName,ot_control_group_name)
	EndIf
EndIf
if c_FocusItemData.CurrentColumn > 1 then
	;for column 1, the name is "Name",
	;and column 1 is also the focusable column.
	;No need to be redundant by announcing the name as "name" for column 1.
	Say(c_FocusItemData.Name,ot_control_name)
EndIf
if !StringIsBlank(c_FocusItemData.Value) then
	Say(c_FocusItemData.Value,ot_line)
else
	SayUsingVoice(vctx_message,cmsgBlank1,ot_line)
EndIf
SpeakTableItemState()
return true
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	int nType
if nLevel == 0 then
	if C_FocusItemData.CustomType == CustomType_TableItem
		SpeakTableItem()
		return
	elif C_FocusItemData.CustomType == CustomType_TableGrid then
		SpeakTableGrid()
		return
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if C_FocusItemData.CustomType == CustomType_TableItem then
	if nChangeDepth <= 2 then
		return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
	EndIf
EndIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
EndFunction

void Function FocusChangedEventProcessAncestors (handle FocusWindow, handle PrevWindow)
var
	int nLevel,
	int iType
let nLevel = GetFocusChangeDepth()
while nLevel >= 0
	let iType = GetObjectSubtypecode(true,nLevel)
	if C_FocusItemData.CustomType == CustomType_TableItem
	&& nLevel > 0 then
		if iType == WT_Table
		|| iType == wt_GroupBox
		|| iType == wt_TreeViewItem then
			;This information is announced at level 0:
			let nLevel = 0
		EndIf
	EndIf
	sayObjectTypeAndText(nLevel)
	let nLevel= nLevel-1
EndWhile
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if C_FocusItemData.CustomType == CustomType_TableItem then
	SpeakTableItem(true)
	return
EndIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
if hObj == GetFocus() then
	if C_FocusItemData.CustomType == CustomType_TableItem
		UpdateFocusItemData()
		BrailleRefresh()
		SpeakTableItemState()
		return
	EndIf
EndIf
ObjStateChangedEvent(hObj,iObjType, nChangedState, nState, nOldState)
endFunction

script NextTableItemColumn()
if IsPCCursor()
&& !UserBufferIsActive()
&& C_FocusItemData.CustomType == CustomType_TableItem then
	UpdateFocusItemData(NavDir_ColumnRight)
	BrailleRefresh()
	SpeakTableItem(true)
	return
EndIf
PerformScript SayNextWord()
EndScript

script PriorTableItemColumn()
if IsPCCursor()
&& !UserBufferIsActive()
&& C_FocusItemData.CustomType == CustomType_TableItem then
	UpdateFocusItemData(NavDir_ColumnLeft)
	BrailleRefresh()
	SpeakTableItem(true)
	return
EndIf
PerformScript SayPriorWord()
EndScript

script SayLine()
if IsPCCursor()
&& !UserBufferIsActive() then
	if C_FocusItemData.CustomType == CustomType_TableItem then
		SpeakTableItem(true)
		return
	elif C_FocusItemData.CustomType == CustomType_TableGrid then
		SpeakTableGrid()
		return
	EndIf
EndIf
PerformScript SayLine()
EndScript

void function UpdateAndSpeakFocusItemState()
if C_FocusItemData.CustomType == CustomType_TableItem then
	UIARefresh(true)
	UpdateFocusItemData()
	BrailleRefresh()
	SpeakTableItemState()
EndIf
EndFunction

void function SayCharacterUnit(int UnitMovement)
if IsPCCursor()
&& !UserBufferIsActive()
&& C_FocusItemData.CustomType == CustomType_TableItem then
	;ObjStateChangedEvent does not fire for static text controls:
	if GetObjectSubtypeCode(true) == wt_static then
		if (UnitMovement == UnitMove_Prior
				&& c_FocusItemData.State & STATE_SYSTEM_EXPANDED)
		|| (UnitMovement == UnitMove_Next
				&& c_FocusItemData.State & STATE_SYSTEM_COLLAPSED) then
			UpdateAndSpeakFocusItemState()
			return
		EndIf
	EndIf
EndIf
SayCharacterUnit(UnitMovement)
EndFunction

Script Enter ()
PerformScript Enter ()
if !UserBufferIsActive()
&& C_FocusItemData.CustomType == CustomType_TableItem then
	;ObjStateChangedEvent does not fire for static text controls:
	if GetObjectSubtypeCode(true) == wt_static then
		UpdateAndSpeakFocusItemState()
		return
	EndIf
EndIf
EndScript

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if C_FocusItemData.CustomType == CustomType_TableItem
&& KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	;ObjStateChangedEvent does not fire for static text controls:
	if GetObjectSubtypeCode(true) == wt_static then
		UpdateAndSpeakFocusItemState()
		return true
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgTaskManagerAppName)
EndScript

int function BrailleCallbackObjectIdentify()
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
if C_FocusItemData.CustomType == CustomType_TableItem
|| C_FocusItemData.CustomType == CustomType_TableGrid then
	return wt_custom_control_base+1
EndIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectName(int nSubtype)
if IsTouchCursor() then
	return BrailleAddObjectName(nSubtype)
endIf
if nSubtype == wt_custom_control_base+1 then
	if c_FocusItemData.CurrentColumn > 1 then
		BrailleAddString(c_FocusItemData.Name,0,0,0)
	EndIf
	return true
EndIf
return BrailleAddObjectName(nSubtype)
EndFunction

int function BrailleAddObjectValue(int nSubtype)
if IsTouchCursor() then
	return BrailleAddObjectValue(nSubtype)
endIf
if nSubtype == wt_custom_control_base+1 then
	if c_FocusItemData.CurrentColumn == 1 then
		BrailleAddString(c_FocusItemData.Value,0,0,attrib_highlight)
	else
		BrailleAddString(c_FocusItemData.Value,0,0,0)
	EndIf
	return true
EndIf
return BrailleAddObjectValue(nSubtype)
EndFunction

int function BrailleAddObjectState(int nSubtype)
if IsTouchCursor() then
	return BrailleAddObjectState(nSubtype)
endIf
if nSubtype == wt_custom_control_base+1 then
	if CollectionItemExists(c_FocusItemData,"State")
		if c_FocusItemData.State & STATE_SYSTEM_EXPANDED then
			BrailleAddString(cMsgBrailleExpanded,0,0,0)
		elif c_FocusItemData.State & STATE_SYSTEM_COLLAPSED then
			BrailleAddString(cMsgBrailleCollapsed,0,0,0)
		EndIf
	EndIf
	return true
EndIf
return BrailleAddObjectState(nSubtype)
EndFunction

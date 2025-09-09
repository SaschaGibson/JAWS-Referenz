include "HJConst.jsh"
include "MSAAConst.jsh"
include "HJGlobal.jsh"
include "Common.jsm"
include "PickerHost.jsm"

const
;window classes:
	wc_ItemPickerWindow = "Item Picker Window",
	wc_FloatingBarHwndHost = "FloatingBarHwndHost",
;automation Id:
	oaid_BasketBar = "BasketBar",
	oaid_FileName = "FileName",
	oaid_Prop1 = "Prop1",
;types of items for collection data:
	CustomType_PickerListItem = 1,
	CustomType_SelectionBasketListItem = 2

globals
	collection c_FocusItemData,
	string gsSelectionBasketName

void function AutoStartEvent()
if !c_FocusItemData then
	let c_FocusItemData = new collection
EndIf
EndFunction

void function AutoFinishEvent()
CollectionRemoveAll(c_FocusItemData)
let gsSelectionBasketName = cscNull
EndFunction

int function OnSelectionBasketListItem()
var
	handle hWnd = GetParent(GetFocus())
return GetObjectSubtypeCode(true) == wt_ListBoxItem
	&& GetWindowClass(hWnd) == wc_FloatingBarHwndHost
	&& GetWindowClass(GetParent(hWnd)) == wc_ItemPickerWindow
EndFunction

int function OnPickerListItem()
return GetObjectSubtypeCode(true) == wt_ListBoxItem
	&& GetWindowClass(GetParent(GetFocus())) == wc_ItemPickerWindow
EndFunction

int function InSelectionBasket()
var
	handle hWnd = GetParent(GetFocus())
return GetWindowClass(hWnd) == wc_FloatingBarHwndHost
	&& GetWindowClass(GetParent(hWnd)) == wc_ItemPickerWindow
EndFunction

int function InPicker()
return GetWindowClass(GetParent(GetFocus())) == wc_ItemPickerWindow
EndFunction

void function SpeakPickerListItem(optional int bOnNavigation, int bSayLine)
if !bOnNavigation
	&& !bSayLine then
IndicateControlType(wt_MultiSelect_ListBox,cscNull,cscNull)
EndIf
if c_FocusItemData.State & STATE_SYSTEM_SELECTED then
	IndicateControlState(wt_ListBoxItem,CTRL_SELECTED)
EndIf
Say(c_FocusItemData.Name,ot_selected_item)
if !bOnNavigation then
	Say(c_FocusItemData.Time,ot_selected_item)
	Say(c_FocusItemData.Size,ot_selected_item)
	Say(c_FocusItemData.Location,ot_selected_item)
	Say(PositionInGroup(),ot_position)
EndIf
EndFunction

string function GetSelectionBasketName()
var
	object o
let o = GetUIAObjectTree(GetFocus())
if o then
	let o = o.FindByAutomationId(oaid_BasketBar)
	if o then
		return o.Name
	EndIf
EndIf
return cscNull
EndFunction

void function SpeakSelectionBasketListItem(optional int bOnNavigation, int bSayLine)
if !bOnNavigation
&& !bSayLine then
	IndicateControlType(wt_MultiSelect_ListBox,gsSelectionBasketName,cscNull)
EndIf
Say(c_FocusItemData.Name,ot_selected_item)
if !bOnNavigation then
	Say(c_FocusItemData.Location,ot_selected_item)
	Say(PositionInGroup(),ot_position)
EndIf
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	int nType
if GetObjectSubtypecode(true) == wt_ListBoxItem then
	if nLevel == 0 then
		if InPicker() then
			SpeakPickerListItem(false)
		elif InSelectionBasket() then
			SpeakSelectionBasketListItem(false)
		EndIf
	EndIf
	;don't speak any of the higher level objects:
	return
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void function UpdateFocusItemData()
var
	object oItem,
	object o,
	string s,
	int x,
	int y
CollectionRemoveAll(c_FocusItemData)
let oItem = GetUIAObjectFocusItem()
if oItem then
	let c_FocusItemData.Name = oItem.Name
	let c_FocusItemData.Location = oItem.AutomationId
	oItem.ClickablePoint(intRef(x),intRef(y))
	let c_FocusItemData.ClickX = x
	let c_FocusItemData.ClickY = y
	if InPicker() then
		let C_FocusItemData.CustomType = CustomType_PickerListItem
		let c_FocusItemData.State = oItem.State
		let c_FocusItemData.Size = oItem.Value
		let o = oItem.FindByAutomationId(oaid_Prop1)
		if o then
			let c_FocusItemData.Time = o.Name
		EndIf
	else
		let C_FocusItemData.CustomType = CustomType_SelectionBasketListItem
		if !gsSelectionBasketName then
			let gsSelectionBasketName = GetSelectionBasketName()
		EndIf
	EndIf
EndIf
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if GetObjectSubtypeCode(true) == wt_ListBoxItem then
	UpdateFocusItemData()
else
	CollectionRemoveAll(c_FocusItemData)
EndIf
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void Function FocusChangedEventProcessAncestors (handle FocusWindow, handle PrevWindow)
var
	int nLevel,
	int iType
let nLevel = GetFocusChangeDepth()
while nLevel >= 0
	if nLevel > 0
	&& GetObjectSubtypeCode(true,0) == wt_ListBoxItem then
		;skip over the higher level objects:
		let nLevel = 0
	EndIf
	sayObjectTypeAndText(nLevel)
	let nLevel= nLevel-1
EndWhile
EndFunction

void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if GetObjectSubtypeCode(true) == wt_ListBoxItem then
	if InPicker() then
		SpeakPickerListItem(true)
		return
	elif InSelectionBasket()
		SpeakSelectionBasketListItem(true)
		return
	EndIf
EndIf
ActiveItemChangedEvent(curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgPickerHostAppFileName)
EndScript

script SayLine()
if IsPCCursor ()
&& ! UserBufferIsActive () then
	if GetObjectSubtypecode(true) == wt_ListBoxItem then
		if InPicker() then
			SpeakPickerListItem(false,true)
			return
		elif InSelectionBasket() then
			SpeakSelectionBasketListItem(false,true)
			return
		EndIf
	EndIf
EndIf
PerformScript SayLine()
EndScript

int function BrailleAddObjectName(int nSubtype)
if nSubtype == wt_ListBoxItem then
	if C_FocusItemData.CustomType == CustomType_SelectionBasketListItem then
		BrailleAddString(gsSelectionBasketName ,0,0,0)
		return true
	EndIf
EndIf
return BrailleAddObjectName(nSubtype)
EndFunction

int function BrailleAddObjectType(int nSubtype)
if nSubtype == wt_ListBoxItem then
	if C_FocusItemData.CustomType == CustomType_PickerListItem
	|| C_FocusItemData.CustomType == CustomType_SelectionBasketListItem then
		BrailleAddString(BrailleGetSubtypeString(wt_MultiSelect_ListBox),0,0,0)
		return true
	EndIf
EndIf
return BrailleAddObjectType(nSubtype)
EndFunction

int function BrailleAddObjectValue(int nSubtype)
var
	int nAttrib
if nSubtype == wt_ListBoxItem then
	if CollectionItemExists(c_FocusItemData,"Item") then
		if c_FocusItemData.State & STATE_SYSTEM_SELECTED then
			let nAttrib = attrib_highlight
		EndIf
		BrailleAddString(c_FocusItemData.name,c_FocusItemData.ClickPointX,c_FocusItemData.ClickPointY,nAttrib)
		if C_FocusItemData.CustomType == CustomType_PickerListItem then
			BrailleAddString(c_FocusItemData.Time,0,0,0)
			BrailleAddString(c_FocusItemData.Size,0,0,0)
		EndIf
		BrailleAddString(c_FocusItemData.Location,0,0,0)
		return true
	EndIf
EndIf
return BrailleAddObjectValue(nSubtype)
EndFunction

script BrailleRouting()
if !BrailleIsMessageBeingShown()
&& !gbBrailleStudyModeActive
&& BrailleIsStructuredLine() then
	if GetObjectSubtypeCode(true) == wt_ListBoxItem
		if InPicker()
		|| InSelectionBasket() then
			TypeKey(cksSpace)
			return
		EndIf
	EndIf
EndIf
PerformScript BrailleRouting()
EndScript

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
if hObj == GetFocus() then
	if iObjType == wt_ListBoxItem
	&& InPicker() then
		if nChangedState & CTRL_SELECTED then
			IndicateControlState(WT_ListBoxItem, CTRL_SELECTED)
		elif nOldState & CTRL_SELECTED then
			Say (cMsgDeselected, OT_ITEM_STATE)
		EndIf
		UpdateFocusItemData()
		BrailleRefresh()
		return
	endIf
EndIf
ObjStateChangedEvent(hObj,iObjType, nChangedState, nState, nOldState)
endFunction
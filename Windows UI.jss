; JAWS script file for Windows 8 Start screen

include "HJConst.jsh"
include "HJGlobal.jsh"
include "MSAAConst.jsh"
include "Braille.jsh"
include "Common.jsm"
include "TWinUI.jsh"
include "TWinUI.jsm"
import "Say.jsd"
use "TWinUI Touch.jsb"


globals
	collection c_FocusItemData,
	string gsNewGroupNavSound,
;for keeping track of MenuModeEvent false state and when focus leaves a menu:
	int gbFalseMenuInactiveState,
	int gbPrevFocusWasMenu,
	int gbFocusIsMenu


void function AutoStartEvent()
if !c_FocusItemData then
	let c_FocusItemData = new collection
EndIf
InitSoundEffects()
EndFunction

void function AutoFinishEvent()
CollectionRemoveAll(c_FocusItemData)
let gbFalseMenuInactiveState = false
EndFunction

void function InitSoundEffects()
let gsNewGroupNavSound = GetSoundFileLocation(
	IniReadString(SECTION_NONJCF_OPTIONS, hkey_NewGroupNavSound, cscNull,
		GetActiveConfiguration()+cScPeriod+jcfFileExt))
EndFunction

void function PlayNewGroupNavSound()
PlaySound(gsNewGroupNavSound)
EndFunction

int function GetMenuMode()
;internal function sometimes reports menumode inaccurately, so try to compensate here.
var
	int iMode
let iMode = GetMenuMode()
if !iMode
&& gbFalseMenuInactiveState then
	let iMode = Menu_Active
else
	if FocusWindowSupportsUIA() then
		let iMode = Menu_Active * CommandBarHasFocus()
	EndIf
EndIf
return iMode
EndFunction

int function InSearchPane()
var
	handle hFocus
let hFocus = GetFocus()
return GetWindowClass(hFocus) == cwc_DirectUIhWND
	&& GetWindowClass(GetParent(hFocus)) == wc_SearchPane
	&& GetMenuMode() == Menu_Inactive
EndFunction

int function OnStartScreenOrList()
var
	string sClass
let sClass = GetWindowClass(GetTopLevelWindow(GetFocus()))
return (sClass == wc_ImmersiveLauncher || sClass == wc_FileSearchAppWindowClass || sClass == wc_SearchPane)
	&& FocusWindowSupportsUIA()
	&& GetMenuMode() == Menu_Inactive
EndFunction

int function FocusAppListHasMultipleGroups()
var
	object oTree,
	object o
let oTree = GetUIAObjectTree(GetFocus())
let o = oTree.FindByAutomationId("Group 1")
return !!o
EndFunction



int function GetUIAObjectItemType(optional object ByRef oItem)
var
	object o,
	int typeCode
typeCode = GetObjectSubtypeCode()
if !(OnStartScreenOrList()
|| typeCode == wt_edit
|| typeCode == wt_contextMenu
|| typeCode == wt_menu)
	return CustomType_Unknown
EndIf
if !oItem then
	let oItem = GetUIAObjectFocusItem()
EndIf
if !oItem then
	return CustomType_Unknown
EndIf
if oItem.ClassName == oc_GridTileElement then
	return CustomType_StartScreenTile
elif oItem.ClassName == oc_GridGroup then
	return CustomType_StartScreenGroup
elif oItem.ClassName == oc_GridListTileElement then
	return CustomType_AppListItem
elif oItem.ClassName == oc_SummaryGridTileElement then
	return CustomType_SummaryListItem
elif oItem.ClassName == oc_CFileSystemElement  then
	let o = GetUIAObjectTree(GetFocus()).FirstChild
	if !o then
		return CustomType_Unknown
	EndIf
	if o.Name == objn_Settings then
		return CustomType_SettingsSearchResults
	elif o.Name == objn_Files then
		return CustomType_FilesSearchResults
	EndIf
elif oItem.AutomationId == oaid_TouchEdit_Inner then
	return CustomType_SearchEdit
elif oItem.AutomationId == oaid_ShutdownChoices then
	return CustomType_ShutdownChoicesMenu
elif oItem.ClassName == oc_ChoiceTile
	return CustomType_ChoiceTile
EndIf
return CustomType_Unknown
EndFunction

void function UpdateFocusItemData()
var
	object oItem,
	int iPrevItem,
	int x,
	int y,
	string sClickablePoint,
	string sSubGroup,
	string sGroup,
	int bIsMultiGroupAppList,
	object oSeek,
	int iType
let iType = GetUIAObjectItemType(oItem)
if iType == CustomType_Unknown then
	CollectionRemoveAll(c_FocusItemData)
	return
EndIf
let iPrevItem = C_FocusItemData.CustomType
if iType == iPrevItem then
	;save prior focus item data needed for comparison to current data:
	if iPrevItem == CustomType_StartScreenTile then
		let x = c_FocusItemData.CellX
		let y = c_FocusItemData.CellY
		if CollectionItemExists(c_FocusItemData,"Group")
			let sGroup = c_FocusItemData.Group
		EndIf
	elif iPrevItem == CustomType_AppListItem then
		let bIsMultiGroupAppList = c_FocusItemData.MultiGroupListMember
		let sGroup = c_FocusItemData.Group
		let sClickablePoint = c_FocusItemData.ClickablePoint
		if CollectionItemExists(c_FocusItemData,"SubGroup")
			let sSubGroup = c_FocusItemData.SubGroup
		EndIf
	endIf
endIf
;now clear old data and set the new data:
CollectionRemoveAll(c_FocusItemData)
let C_FocusItemData.CustomType = iType
let c_FocusItemData.PrevItem = iPrevItem
if iType == CustomType_StartScreenTile then
	let c_FocusItemData.Name = oItem.Name
	let oSeek = oItem.FindByClassName(oc_AppSpaceElement)
	if oSeek then
		let c_FocusItemData.LiveContent = oSeek.Name
	EndIf
	let c_FocusItemData.State = oItem.State
	let c_FocusItemData.PrevCellX = x
	let c_FocusItemData.PrevCellY = y
	GetCellCoordinates(x,y)
	let c_FocusItemData.CellX = x
	let c_FocusItemData.CellY = y
	if sGroup then
		let c_FocusItemData.PrevGroup = sGroup
	EndIf
	let oSeek = oItem.parent.FindByAutomationId(oaid_GridListGroupHeader)
	if oSeek then
		let c_FocusItemData.Group = oSeek.Name
	EndIf
elif iType == CustomType_StartScreenGroup then
	let c_FocusItemData.Name = oItem.Name
	let c_FocusItemData.ChildCount = oItem.ChildCount
elif iType == CustomType_AppListItem then
	let c_FocusItemData.Name = oItem.Name
	let c_FocusItemData.State = oItem.State
	oItem.ClickablePoint(intRef(x),intRef(y))
	let c_FocusItemData.ClickX = x
	let c_FocusItemData.ClickY = y
	if iPrevItem != CustomType_AppListItem then
		let bIsMultiGroupAppList = FocusAppListHasMultipleGroups()
	EndIf
	let c_FocusItemData.MultiGroupListMember = bIsMultiGroupAppList
	let c_FocusItemData.PrevGroup = sGroup
	let c_FocusItemData.PrevClickablePoint = sClickablePoint
	if sSubGroup then
		let c_FocusItemData.PrevSubGroup = sSubGroup
	EndIf
	let oSeek = oItem.parent
	if oSeek.ClassName == oc_GridGroup then
		let c_FocusItemData.Group = oSeek.AutomationId
	EndIf
	let c_FocusItemData.ClickablePoint = oItem.ClickablePoint
	if !(bIsMultiGroupAppList && c_FocusItemData.Group == oaid_Group0) then
		let oSeek = oItem.PriorSibling
		while oSeek
				&& (oSeek.ClickablePoint != c_FocusItemData.PrevClickablePoint
				|| oSeek.ClassName != oc_SubGroupLabel)
			let oSeek = oSeek.PriorSibling
		EndWhile
		if oSeek
			if oSeek.ClassName == oc_SubGroupLabel then
				let c_FocusItemData.SubGroup = oSeek.Name
			elif CollectionItemExists(c_FocusItemData,"PrevSubGroup") then
				let c_FocusItemData.SubGroup = c_FocusItemData.PrevSubGroup
			endIf
		EndIf
	EndIf
	let oSeek = GetUIAObjectTree(GetFocus()).FirstChild
	if oSeek then
		let c_FocusItemData.ListName = oSeek.name
	EndIf
elif iType == CustomType_SettingsSearchResults then
	let c_FocusItemData.Name = oItem.Name
	let oSeek = GetUIAObjectTree(GetFocus())
	if oSeek then
		let oSeek = oSeek.FindByClassName(oc_UIExplorerBrowser)
		if oSeek then
			let c_FocusItemData.ListName = oSeek.name
		EndIf
	EndIf
elif iType == CustomType_FilesSearchResults then
	let c_FocusItemData.Name = oItem.Name
	let c_FocusItemData.State = oItem.State
	;MSAA has all the descriptive properties, so use it:
	SaveCursor ()
	PCCursor ()
	let c_FocusItemData.Description = GetObjectValue()
	RestoreCursor()
	let oSeek = GetUIAObjectTree(GetFocus())
	if oSeek then
		let oSeek = oSeek.FindByClassName(oc_UIExplorerBrowser)
		if oSeek then
			let c_FocusItemData.ListName = oSeek.name
		EndIf
	EndIf
EndIf
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
UpdateFocusItemData()
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

int function FocusIsLeavingMenu()
return gbPrevFocusWasMenu != gbFocusIsMenu
	&& !gbFocusIsMenu
EndFunction

int function MenuProcessedOnFocusChangedEventEx(
	handle hwndFocus, handle hwndPrevFocus,
	int nType, optional int nChangeDepth)
if C_FocusItemData.CustomType == CustomType_ShutdownChoicesMenu
	;when focus changes from the Power Options button to its conttext menu,
	;the MenuModeEvent does not fire.
	;MenuModeEvent fires when the first item in the context menu becomes selected.
	;Select the first menu option:
	TypeKey(cksDownArrow)
	return true
endIf
;keep track of whether or not focus is leaving menu,
;so that we know if navigation should fire a new group sound:
let gbPrevFocusWasMenu = gbFocusIsMenu
let gbFocusIsMenu = MenuProcessedOnFocusChangedEventEx(hwndFocus, hwndPrevFocus, nType, nChangeDepth)
return gbFocusIsMenu
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if CollectionItemExists(c_FocusItemData,"Item")
&& CollectionItemExists(c_FocusItemData,"PrevItem") then
	if C_FocusItemData.CustomType == CustomType_AppListItem
	&& c_FocusItemData.PrevItem == CustomType_AppListItem then
		;The first navigation may have nChangeDepth > -1,
		;so Make sure that ActiveItemChangedEvent is called independent of change depth:
		return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
	EndIf
EndIf
if DetectCharmsWindow()
	;This is when the charms window is brought up using a gesture,
	;and focus lands on the charms window but not one of the charms in the window.
	;The charms window is detected and spoken using the UIA object in DetectCharmsWindow.
	return
endIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
EndFunction

void function FindAndSayCommandBarItem()
var
	object o
let o = GetUIAObjectTree(GetFocus())
if !o then
	return
EndIf
let o = o.FindByAutomationId("CommandBar")
if !o then
	return
EndIf
let o = o.FindByKeyboardFocus(1)
if o then
	Say(o.Name,ot_selected_item)
EndIf
EndFunction

int function CommandBarExists()
var
	object oTree,
	object o
let oTree = GetUIAObjectTree(GetFocus())
if oTree then
	let o = oTree.FindByAutomationId("CommandBar")
	if o then
		return true
	EndIf
EndIf
return false
EndFunction

int function CommandBarHasFocus()
var
	object oTree,
	object o
let oTree = GetUIAObjectTree(GetFocus())
if oTree then
	let o = oTree.FindByAutomationId("CommandBar")
	if o then
		let o = o.FindByKeyboardFocus(1)
		if o then
			return true
		EndIf
	EndIf
EndIf
return false
EndFunction
int function MenuBarActiveProcessed(int mode)
If mode != MENUBAR_ACTIVE then
	return false
EndIf
IndicateControlType(WT_COMMANDBAR)
MenuModeHook ()
return true
EndFunction

int function MenuInactiveProcessed(int mode, int PrevMenuMode)
if mode == MENU_INACTIVE
	if CommandBarHasFocus() then
		;This is a false triggering of MenuModeEvent with MENU_INACTIVE:
		let gbFalseMenuInactiveState = true
		return false
	EndIf
	If GetRunningFSProducts() & product_JAWS
	&& PrevMenuMode == MENUBAR_ACTIVE then
		SayMessage (OT_CONTROL_TYPE, cmsgLeavingCommandBar)
		return true
	EndIf
EndIf
return MenuInactiveProcessed(mode,PrevMenuMode)
EndFunction

int function MenuActiveProcessed(int mode, handle hWnd)
If mode != MENU_ACTIVE then
	return false
EndIf
;The only time so far that I have found this to be true for TWinUI
;is when the context key is pressed while on the Search edit.
IndicateControlType(WT_COMMANDBAR)
MenuModeHook ()
return true
EndFunction

int function ContextMenuProcessed(handle hWnd)
if C_FocusItemData.CustomType == CustomType_ShutDownChoicesMenu
	UpdateFocusItemData()
endIf
if C_FocusItemData.CustomType == CustomType_ChoiceTile
	IndicateControlType(wt_menu,cscNull)
	MenuModeHook ()
	return true
endIf
return ContextMenuProcessed(hWnd)
EndFunction

void Function MenuModeEvent(handle WinHandle, int mode)
if gbFalseMenuInactiveState then
	let gbFalseMenuInactiveState = false
	if mode then
		;since the menu was not really inactive,
		;don't announce it as being reactivated:
		return
	EndIf
EndIf
MenuModeEvent(WinHandle,mode)
EndFunction

void function SayStartScreenTileGroupName()
var
	string sGroupName
if CollectionItemExists(c_FocusItemData,"Group") then
	if GetVerbosity () == beginner then
		let sGroupName = FormatString(cmsgListGroupName,c_FocusItemData.Group)
	else
		let sGroupName = c_FocusItemData.Group
	EndIf
	sayMessageWithMarkup(ot_screen_message,
		formatString(cmsgHeaderTemplate,
			smmReplaceSymbolsWithMarkup (sGroupName)))
endIf
EndFunction

void function SayStartScreenTileCoordinates(int bOnNavigation)
if !bOnNavigation
|| c_FocusItemData.CellX != c_FocusItemData.PrevCellX then
	Say(FormatString(cmsg_column,IntToString(c_FocusItemData.CellX)),ot_position)
endIf
if !bOnNavigation
|| c_FocusItemData.CellY != c_FocusItemData.PrevCellY then
	Say(FormatString(cmsg_row,IntToString(c_FocusItemData.CellY)),ot_position)
EndIf
if !bOnNavigation then
	Say(PositionInGroup(),ot_position)
EndIf
EndFunction

void function SpeakStartScreenTile(optional int bOnNavigation)
say(c_FocusItemData.Name,ot_control_name)
if CollectionItemExists(c_FocusItemData,"LiveContent") then
	Say(c_FocusItemData.LiveContent,ot_control_name)
EndIf
if c_FocusItemData.State & STATE_SYSTEM_EXPANDED then
	IndicateControlState(WT_ListBoxItem, CTRL_EXPANDED)
EndIf
if c_FocusItemData.State & STATE_SYSTEM_SELECTED then
	IndicateControlState(WT_ListBoxItem, CTRL_SELECTED)
EndIf
SayStartScreenTileCoordinates(bOnNavigation)
EndFunction

void function SpeakStartScreenGroup()
IndicateControlType(wt_GroupBox,GetObjectName(SOURCE_CACHED_DATA),cscNull)
SayUsingVoice(vctx_message,
	FormatString(msgTileGroupColumnRowCount,GetTableColumnCount(),GetTableRowCount()),
	ot_message)
EndFunction

void function SayAppListGroupName(int bOnNavigation)
var
	string sGroupName
if c_FocusItemData.MultiGroupListMember != true then
	return
EndIf
if bOnNavigation
&& c_FocusItemData.Group == c_FocusItemData.PrevGroup then
	return
EndIf
if c_FocusItemData.Group == oaid_Group0 then
	let sGroupName = msgAppListGroup0Name
elif c_FocusItemData.Group == oaid_Group1 then
	let sGroupName = msgAppListGroup1Name
else
	return
EndIf
sayMessageWithMarkup(ot_screen_message,
	formatString(cmsgHeaderTemplate,
		smmReplaceSymbolsWithMarkup (sGroupName)))
EndFunction

void function SayAppListSubGroupName(int bOnNavigation)
if !CollectionItemExists(c_FocusItemData,"SubGroup") then
	return
EndIf
if !bOnNavigation
|| c_FocusItemData.PrevSubgroup != c_FocusItemData.SubGroup then
	sayMessageWithMarkup(ot_screen_message,
		formatString(cmsgHeaderTemplate,
			smmReplaceSymbolsWithMarkup (c_FocusItemData.SubGroup)))
EndIf
EndFunction

void function SpeakAppListItem(optional int bOnNavigation, int bOmitListName)
if !bOnNavigation
&& !bOmitListName then
	IndicateControlType(wt_ListBox,c_FocusItemData.ListName)
EndIf
SayAppListGroupName(bOnNavigation)
SayAppListSubGroupName(bOnNavigation)
if c_FocusItemData.State & STATE_SYSTEM_SELECTED then
	IndicateControlState(WT_ListBoxItem, CTRL_SELECTED)
EndIf
say(c_FocusItemData.Name,ot_control_name)
if !bOnNavigation then
	Say(PositionInGroup(),ot_position)
EndIf
EndFunction

void function SpeakFilesSearchListItem(optional int bOnNavigation, int bOmitListName)
if !bOnNavigation
&& !bOmitListName then
	IndicateControlType(wt_Listbox,c_FocusItemData.ListName)
EndIf
if c_FocusItemData.State & STATE_SYSTEM_SELECTED then
	IndicateControlState(WT_ListBoxItem, CTRL_SELECTED)
EndIf
Say(c_FocusItemData.Name,ot_line)
if !bOnNavigation then
	Say(c_FocusItemData.Description,ot_line)
EndIf
if !bOnNavigation then
	Say(PositionInGroup(),ot_position)
EndIf
EndFunction

void function SpeakSettingsSearchListItem(optional int bOnNavigation, int bOmitListName)
if !bOnNavigation
&& !bOmitListName then
	IndicateControlType(wt_Listbox,c_FocusItemData.ListName)
EndIf
Say(c_FocusItemData.Name,ot_line)
if !bOnNavigation then
	Say(PositionInGroup(),ot_position)
EndIf
EndFunction
void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	int nType
if OnStartScreenOrList() then
	let nType = GetObjectSubtypeCode(SOURCE_CACHED_DATA,nLevel)
	if !nType
	&& nLevel > 1 then
		if GetObjectName(SOURCE_CACHED_DATA,nLevel) == objn_StartMenu then
			Say(msgStartScreenName,ot_dialog_name)
			return
		EndIf
	EndIf
	if C_FocusItemData.CustomType == CustomType_StartScreenTile then
		if nType == wt_GroupBox
			SayStartScreenTileGroupName()
			return
		elif nType  == wt_ListBoxItem then
			SpeakStartScreenTile(false)
			return
		EndIf
	elif C_FocusItemData.CustomType == CustomType_StartScreenGroup then
		if nLevel == 0
		&& nType == wt_GroupBox then
			SpeakStartScreenGroup()
			return
		EndIf
	elif C_FocusItemData.CustomType == CustomType_AppListItem then
		if nType == wt_ListBoxItem then
			SpeakAppListItem()
		EndIf
		;and speak nothing for parent objects:
		return
	elif C_FocusItemData.CustomType == CustomType_FilesSearchResults then
		if nType == wt_ListBoxItem then
			SpeakFilesSearchListItem()
		EndIf
		;and speak nothing for parent objects:
		return
	elif C_FocusItemData.CustomType == CustomType_SettingsSearchResults then
		if nType == wt_ListBoxItem then
			SpeakSettingsSearchListItem()
		EndIf
		;and speak nothing for parent objects:
		return
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void Function FocusChangedEventProcessAncestors (handle FocusWindow, handle PrevWindow)
var
	int nLevel,
	int iType
if gbFalseMenuInactiveState then
	;At this point, there are at least two accessible objects with HasKeyboardFocus = true.
	;Find the one on the command bar and speak it.
	if CommandBarHasFocus() then
		FindAndSayCommandBarItem()
		return
	EndIf
EndIf
let nLevel = GetFocusChangeDepth()
while nLevel >= 0
	let iType = GetObjectSubtypecode(SOURCE_CACHED_DATA,nLevel)
	if InSearchPane()
		if (!iType && nLevel==2)
		|| (iType==wt_GroupBox && nLevel==1) then
			;skip over announcing these levels to avoid redundant speech:
			let nLevel = 0
		EndIf
	elif OnStartScreenOrList() then
		if C_FocusItemData.CustomType == CustomType_StartScreenTile then
			if iType == wt_GroupBox
			&& !FocusIsLeavingMenu() then
				PlayNewGroupNavSound()
			elif iType == wt_MultiSelect_ListBox then
				;This is confusing or irrelevant information, so skip it:
				let nLevel = nLevel-1
			EndIf
		elif C_FocusItemData.CustomType == CustomType_StartScreenGroup then
			if iType == wt_MultiSelect_ListBox then
				;This is confusing or irrelevant information, so skip it:
				let nLevel = nLevel-1
			EndIf
		elif C_FocusItemData.CustomType == CustomType_AppListItem
		|| C_FocusItemData.CustomType == CustomType_SettingsSearchResults
		|| C_FocusItemData.CustomType == CustomType_FilesSearchResults then
			if !iType
			&& nLevel > 2 then
				;skip nLevel 4 and 3 to avoid confusing speech output:
				let nLevel = 2
			elif nLevel == 1
			&& iType == wt_GroupBox then
				;skip announcing group,
				;this may appear to be double speaking when the group is named after the first item in the list:
				let nLevel = 0
			EndIf
		EndIf
	EndIf
	sayObjectTypeAndText(nLevel)
	let nLevel= nLevel-1
EndWhile
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if OnStartScreenOrList() then
	if C_FocusItemData.CustomType == CustomType_StartScreenTile then
		SpeakStartScreenTile(true)
		return
	elif C_FocusItemData.CustomType == CustomType_AppListItem then
		SpeakAppListItem(true)
		return
	elif C_FocusItemData.CustomType == CustomType_SettingsSearchResults then
		SpeakSettingsSearchListItem(true)
		return
	elif C_FocusItemData.CustomType == CustomType_FilesSearchResults then
		SpeakFilesSearchListItem(true)
		return
	EndIf
EndIf
ActiveItemChangedEvent(curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
if hObj == GetFocus() then
	if C_FocusItemData.CustomType == CustomType_StartScreenTile
	|| C_FocusItemData.CustomType == CustomType_AppListItem
	|| C_FocusItemData.CustomType == CustomType_FilesSearchResults then
		if nChangedState & CTRL_SELECTED then
			IndicateControlState(WT_ListBoxItem, CTRL_SELECTED)
		elif nOldState & CTRL_SELECTED then
			Say (cMsgDeselected, OT_ITEM_STATE)
		EndIf
		UpdateFocusItemData()
		return
	endIf
EndIf
ObjStateChangedEvent(hObj,iObjType, nChangedState, nState, nOldState)
endFunction

void function Win8SearchResultsChangedEvent(HANDLE hwnd)
var
	object oTree,
	object oItem
let oTree = GetUIAObjectTree(hWnd)
if (!oTree)
	return
EndIf
let oItem = oTree.FindByRole(ROLE_SYSTEM_LISTITEM)
if !oItem then
	let oItem = oTree.FindByAutomationId("EmptyView")
	if !oItem then
		return
	EndIf
EndIf
SayUsingVoice(vctx_message,oItem.name,ot_screen_message)
if BrailleInUse() then
	let c_FocusItemData.DefaultResult = oItem.name
	BrailleRefresh()
EndIf
EndFunction

int function BrailleCallbackObjectIdentify()
if IsTouchCursor()
	return BrailleCallbackObjectIdentify()
endIf
if C_FocusItemData.CustomType == CustomType_StartScreenTile then
	return WT_CUSTOM_CONTROL_BASE + wt_custom_brl_StartScreenTile
elif C_FocusItemData.CustomType == CustomType_AppListItem then
	return WT_CUSTOM_CONTROL_BASE + wt_custom_brl_AppListItem
elif C_FocusItemData.CustomType ==CustomType_SearchEdit then
	return WT_CUSTOM_CONTROL_BASE + wt_custom_brl_StartScreenSearchEdit
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectGridName(int nType)
If nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_StartScreenTile then
	if CollectionItemExists(c_FocusItemData,"Group") then
		BrailleAddString(c_FocusItemData.Group,0,0,0)
	EndIf
EndIf
return true
EndFunction

int function BrailleAddObjectCoordinates(int nType)
If nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_StartScreenTile then
	;No OSM, so cannot use row/column zoom here:
	BrailleCoordinates(c_FocusItemData.CellX,c_FocusItemData.CellY)
EndIf
return true
EndFunction

int function BrailleAddObjectGroup(int nType)
if nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_AppListItem then
	if CollectionItemExists(c_FocusItemData,"Group")
	&& c_FocusItemData.MultiGroupListMember == true then
		if c_FocusItemData.Group == oaid_Group0 then
			BrailleAddString(msgAppListGroup0Name,0,0,0)
		elif c_FocusItemData.Group == oaid_Group1 then
			BrailleAddString(msgAppListGroup1Name,0,0,0)
		EndIf
	EndIf
EndIf
return true
EndFunction

int function BrailleAddObjectSubgroup(int nType)
if nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_AppListItem then
	if CollectionItemExists(c_FocusItemData,"SubGroup") then
		BrailleAddString(c_FocusItemData.SubGroup,0,0,0)
	EndIf
EndIf
return true
EndFunction

int function BrailleAddObjectName(int nType)
if IsTouchCursor() then
	return BrailleAddObjectName(nType)
endIf
if nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_AppListItem then
	BrailleAddString(c_FocusItemData.ListName,0,0,0)
	return true
elif nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_StartScreenSearchEdit
	return BrailleAddObjectName(wt_Edit)
elif nType == wt_ListBoxItem then
	if c_FocusItemData.CustomType == CustomType_FilesSearchResults
	|| c_FocusItemData.CustomType == CustomType_SettingsSearchResults then
		BrailleAddString(c_FocusItemData.ListName,0,0,0)
		return true
	EndIf
EndIf
return BrailleAddObjectName(nType)
EndFunction

int function BrailleAddObjectValue(int nType)
var
	int nAttrib,
	string sValue,
	string sLiveContent
if IsTouchCursor() then
	return BrailleAddObjectValue(nType)
endIf
If nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_StartScreenTile then
	;No OSM, so cannot use row/column zoom here:
	if GetObjectStateCode(true) & CTRL_SELECTED then
		let nAttrib = attrib_highlight
	EndIf
	let sValue = c_FocusItemData.Name
	if CollectionItemExists(c_FocusItemData,"LiveContent") then
		let sLiveContent = c_FocusItemData.LiveContent
		let sValue = sValue+cscSpace+sLiveContent
	EndIf
	BrailleAddString(sValue,GetCursorCol(),GetCursorRow(),nAttrib)
	Return TRUE
elif nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_AppListItem then
	if GetObjectStateCode(true) & CTRL_SELECTED then
		let nAttrib = attrib_highlight
	EndIf
	BrailleAddString(c_FocusItemData.Name,c_FocusItemData.ClickX,c_FocusItemData.ClickY,nAttrib)
	return true
elif nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_StartScreenSearchEdit
	return BrailleAddObjectValue(wt_Edit)
EndIf
return BrailleAddObjectValue(nType)
EndFunction

int function BrailleAddObjectState(int nType)
var
	int iState
if IsTouchCursor() then
	return BrailleAddObjectState(nType)
endIf
If nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_StartScreenTile then
	let iState = GetObjectStateCode()
	if iState & CTRL_EXPANDED then
		BrailleAddString(cMsgBrailleExpanded,0,0,0)
	EndIf
	return true
EndIf
return BrailleAddObjectState(nType)
EndFunction

int function BrailleAddObjectPosition(int nType)
if IsTouchCursor() then
	return BrailleAddObjectPosition(nType)
endIf
if nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_AppListItem then
	return BrailleAddObjectPosition(wt_ListBoxItem)
EndIf
return BrailleAddObjectPosition(nType)
EndFunction

int function BrailleAddObjectDefaultResult(int nType)
if nType == WT_CUSTOM_CONTROL_BASE + wt_custom_brl_StartScreenSearchEdit then
	;The Win8SearchResultsChangedEvent updates the collection with the default result,
	;except in the case where the text has been removed from the search edit.
	;So, make sure that the search edit is non-blank:
	if !StringIsBlank(GetObjectValue()) then
		BrailleAddString(c_FocusItemData.DefaultResult ,0,0,0)
	EndIf
EndIf
return true
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgTWinUIAppName)
EndScript

script SayLine()
if IsPCCursor ()
&& !UserBufferIsActive () then
	if C_FocusItemData.CustomType == CustomType_StartScreenTile  then
		SpeakStartScreenTile()
		return
	elif C_FocusItemData.CustomType == CustomType_StartScreenGroup  then
		SpeakStartScreenGroup()
		return
	elif C_FocusItemData.CustomType == CustomType_AppListItem then
		SpeakAppListItem(false,true)
		return
	elif C_FocusItemData.CustomType == CustomType_FilesSearchResults then
		SpeakFilesSearchListItem(false,true)
		return
	elif C_FocusItemData.CustomType == CustomType_SettingsSearchResults then
		SpeakSettingsSearchListItem(false,true)
		return
	EndIf
EndIf
PerformScript SayLine()
EndScript


int function GetUIATitle(handle hWnd,
	string ByRef sTitle, string ByRef sSubTitle)
var
	object oTree,
	object oItem,
	string sAppend
let oTree = GetUIAObjectTree(hWnd)
if !oTree then
	return false
EndIf
let oItem = oTree.FirstChild
if !oItem then
	return false
EndIf
while oItem
	if oItem.AutomationId == oaid_TitleBarText then
		let sTitle = oItem.Name
	elif oItem == oaid_CurrentScopeText
	|| oItem.AutomationId == oaid_Title
	|| oItem.AutomationId == oaid_SubTitle then
		if !sTitle then
			let sTitle = oItem.Name
		elif sTitle
		&& !sSubTitle then
			let sSubTitle = oItem.Name
		else
			let sAppend = oItem.Name
			let sSubTitle = sSubTitle+sAppend
		EndIf
	endIf
	let oItem = oItem.NextSibling
EndWhile
return sTitle || sSubTitle
EndFunction

void function GetWindowTitleForApplication(handle hAppWnd, handle hRealWnd, handle hCurWnd, int iTypeCode,
	string ByRef sTitle, string ByRef sSubTitle, int ByRef bHasPage)
if GetUIATitle(hCurWnd, sTitle, sSubTitle) then
	let bHasPage = false
	return
EndIf
GetWindowTitleForApplication(hAppWnd, hRealWnd, hCurWnd, iTypeCode,
	sTitle, sSubTitle, bHasPage)
EndFunction

void function SaySelectedStartScreenTiles()
var
	object oTree,
	object oGroup,
	object o,
	string sName,
	string sSelected
let oTree = GetUIAObjectFocusItem()
if ! oTree then
	return
EndIf
let oGroup = oTree.Parent.Parent.FirstChild
if !oGroup then
	return
EndIf
while oGroup
	let o = oGroup.FirstChild
	while o
		if o.Role == ROLE_SYSTEM_LISTITEM
		&& o.State & STATE_SYSTEM_SELECTED then
			let sName = o.Name
			let sSelected=sSelected+cscBufferNewLine+sName
		EndIf
		let o = o.NextSibling
	EndWhile
	let oGroup = oGroup.NextSibling
EndWhile
if sSelected then
	Say(FormatString(cmsg39_L,sSelected),ot_user_requested_information)
else
	SayMessage (ot_error, cmsgNothingSelected)
EndIf
EndFunction

script SaySelectedText()
if C_FocusItemData.CustomType == CustomType_StartScreenTile then
	SaySelectedStartScreenTiles()
	return
EndIf
PerformScript SaySelectedText()
EndScript

int function TabFromSummaryOrAppListError()
var
	handle hWnd,
	object o
if !(C_FocusItemData.CustomType == CustomType_AppListItem
|| C_FocusItemData.CustomType == CustomType_SummaryListItem) then
	return false
EndIf
if CommandBarExists() then
	return false
EndIf
let hWnd = GetTopLevelWindow(GetFocus())
while hWnd
&& GetWindowClass(hWnd) != wc_SearchPane
	let hWnd = GetPriorWindow(hWnd)
EndWhile
if !hWnd then
	return true
EndIf
let hWnd = GetFirstChild(hwnd)
if !hWnd then
	return true
EndIf
let o = GetUIAObjectTree(hWnd)
if !o then
	return true
EndIf
let o = o.FindByClassName(oc_TouchScrollBar)
if !o then
	return true
EndIf
return false
EndFunction

script MoveTileOrGroupLeft()
if IsPCCursor()
&& !UserBufferIsActive()
&& GetWindowClass(GetFocus()) == cwc_DirectUIhWND then
	if C_FocusItemData.CustomType == CustomType_StartScreenTile
		MoveStartScreenTile(direction_TileOrGroupLeft)
		return
	elif C_FocusItemData.CustomType == CustomType_StartScreenGroup
		MoveStartScreenGroup(direction_TileOrGroupLeft)
		return
	endIf
EndIf
PerformScript MouseLeft()
EndScript

script MoveTileOrGroupRight()
if IsPCCursor()
&& !UserBufferIsActive()
&& GetWindowClass(GetFocus()) == cwc_DirectUIhWND then
	if C_FocusItemData.CustomType == CustomType_StartScreenTile
		MoveStartScreenTile(direction_TileOrGroupRight)
		return
	elif C_FocusItemData.CustomType == CustomType_StartScreenGroup
		MoveStartScreenGroup(direction_TileOrGroupRight)
		return
	endIf
EndIf
PerformScript MouseRight()
EndScript

script MoveTileOrGroupUp()
if IsPCCursor()
&& !UserBufferIsActive()
&& GetWindowClass(GetFocus()) == cwc_DirectUIhWND then
	if C_FocusItemData.CustomType == CustomType_StartScreenTile
		MoveStartScreenTile(direction_TileOrGroupUp)
		return
	elif C_FocusItemData.CustomType == CustomType_StartScreenGroup
		MoveStartScreenGroup(direction_TileOrGroupUp)
		return
	endIf
EndIf
PerformScript MouseUp()
EndScript

script MoveTileOrGroupDown()
if IsPCCursor()
&& !UserBufferIsActive()
&& GetWindowClass(GetFocus()) == cwc_DirectUIhWND then
	if C_FocusItemData.CustomType == CustomType_StartScreenTile
		MoveStartScreenTile(direction_TileOrGroupDown)
		return
	elif C_FocusItemData.CustomType == CustomType_StartScreenGroup
		MoveStartScreenGroup(direction_TileOrGroupDown)
		return
	endIf
EndIf
PerformScript MouseDown()
EndScript

Void Function ScreenSensitiveHelpForKnownClasses (int nSubTypeCode)
If !IsVirtualPCCursor ()
&& GlobalMenuMode == MENUBAR_ACTIVE then
	ShowScreenSensitiveHelp(msgScreenSensitiveHelpCommandBar)
	return
EndIf
if c_FocusItemData.CustomType == CustomType_StartScreenTile then
	ShowScreenSensitiveHelp(msgScreenSensitiveHelpStartScreenTile)
	return
elif c_FocusItemData.CustomType == CustomType_StartScreenGroup then
	ShowScreenSensitiveHelp(msgScreenSensitiveHelpStartScreenGroup)
	return
EndIf
ScreenSensitiveHelpForKnownClasses(nSubTypeCode)
EndFunction


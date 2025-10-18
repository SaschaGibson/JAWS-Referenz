;Copyright 2012-2016 Freedom Scientific, Inc.

include "HJConst.jsh"
include "HJGlobal.jsh"
include "Common.jsm"
include "MSAAConst.jsh"
include "UIA.jsh"
include "Windows.UI.Immersive.jsm"

import "UIA.jsd"

const
;window classes:
	wc_shell_flyout = "shell_flyout",
;object automation id's:
	oaid_TitleBar = "TitleBar",
	oaid_idNotificationsButton = "idNotificationsButton",
	oaid_idButtonClearTiles = "idButtonClearTiles",
	oaid_ImmersiveOpenWithFlyout = "ImmersiveOpenWithFlyout",
	oaid_ConfirmButton = "ConfirmButton",
	oaid_HeadText = "HeadText",
	oaid_StoreTile = "StoreTile",
;object class names:
	oc_Shell_Flyout = "Shell_Flyout",
	oc_AppListTileElement = "AppListTileElement",
	oc_RichText = "RichText"

;for focus item data:
const
	CustomType_Unknown = 0,
	CustomType_MenuItem = 1,
	CustomType_ClearTilesButton = 2,
	CustomType_FlyOut_Window = 3,
	CustomType_OpenWithFlyout_AppListTileElement = 4
globals
	collection c_FocusItemData,
		; For custom handling of specific focus objects.
		; members may include:
		; CustomType -- One of the CustomType constants listed above.
		; Name -- The object name.
		; HasKeyboardFocus -- True if the object has keyboard focus, false otherwise.
		; State -- The state of the object.
		; ClickX -- The X coordinate of the object's clickable point
		; ClickY -- The Y coordinate of the object's clickable point
		; Description -- Text to be used for the description, which may come from a different object that the focus.
		; ContainerName -- The name to be used for the container, such as the name of a list containing a list item.
		;
;for the pane title:
	string gsPaneTitle ;The application or window or pane title

;for context menus with parent as shell_flyout class:
globals
	handle ghWnd_Shell_Flyout,
	int giScheduledShellFlyoutEnsureFocusItem

;for fudging the name of the pane, use the braille dlg components:
globals
	int gbShouldBrailleDlgName


void function AutoStartEvent()
var handle focusWindow = getFocus ()
if getWindowOwner (focusWindow) == "bdeunlock.exe"
|| getWindowOwner (getFirstChild (focusWindow)) == "bdeunlock.exe" then
	SwitchToConfiguration ("ExplorerFrame")
	return
endIf
if !c_FocusItemData then
	let c_FocusItemData = new collection
EndIf
if BrailleInUse() then
	GetBrailleDlgComponentsSettings()
EndIf
endFunction

void function AutoFinishEvent()
CollectionRemoveAll(c_FocusItemData)
let gsPaneTitle = cscNull
EndFunction

int function GetUIAObjectItemType(optional object ByRef oItem)
if UserBufferIsActive()
|| IsTouchCursor()
	return CustomType_Unknown
endIf
var
	object oTree,
	object o
if !oItem then
	let oItem = GetUIAObjectFocusItem()
EndIf
if !oItem then
	if GetWindowClass(getFocus()) == oc_Shell_Flyout
		;The focus may be on the flyout window rather than on a control inside it,
		;so try using FSUIA object instead:
		var object element = CreateUIAFocusElement(true)
		if element.controlType == UIA_WindowControlTypeID
			return CustomType_FlyOut_Window
		endIf
	endIf
	return CustomType_Unknown
EndIf
if oItem.Role == ROLE_SYSTEM_MENUITEM	then
	return CustomType_MenuItem
elif oItem.AutomationId == oaid_idButtonClearTiles then
	return CustomType_ClearTilesButton
elif oItem.className == oc_AppListTileElement
	return CustomType_OpenWithFlyout_AppListTileElement
else
	return CustomType_Unknown
EndIf
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
CollectionRemoveAll(c_FocusItemData)
let gsPaneTitle = cscNull
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

int function MenusActive()
;builtin MenusActive returns false if a context menu has no focus item:
return MenusActive()
	|| ghWnd_Shell_Flyout
EndFunction

void function UpdateMenuItemData(handle hwndFocus)
;This should only be called from MenuProcessedOnFocusChangedEventEx,
;and it assumes that appropriate tests for menu in have already been performed:
var
	object oTree,
	object oItem,
	int x,
	int y
;collection is cleared in PreProcessFocusChangedEventEx
let oTree = GetUIAObjectTree(hWndFocus)
if oTree then
	let oItem = oTree.FindByKeyboardFocus(1)
	if !oItem then
		TypeKey(cksDownArrow); Select first item in menus
	EndIf
	let oItem = oTree.FindByKeyboardFocus(1)
	if oItem then
		let C_FocusItemData.CustomType = CustomType_MenuItem
		let c_FocusItemData.Name = oItem.Name
		let c_FocusItemData.HasKeyboardFocus = 1
		let c_FocusItemData.State = oItem.State
		oItem.ClickablePoint(intRef(x), intRef(y))
		let c_FocusItemData.ClickX = x
		let c_FocusItemData.ClickY = y
	EndIf
EndIf
EndFunction

int function MenuProcessedOnFocusChangedEventEx(
	handle hwndFocus, handle hwndPrevFocus,
	int nType, optional int nChangeDepth)
if MenusActive()
&& GetWindowClass(hwndFocus) == cwc_DirectUIhWND then
	UpdateMenuItemData(hwndFocus)
EndIf
return MenuProcessedOnFocusChangedEventEx(hwndFocus, hwndPrevFocus, nType, nChangeDepth)
EndFunction

void function ShellFlyoutEnsureFocusItem()
let giScheduledShellFlyoutEnsureFocusItem = 0
if GetWindowClass(GetFocus()) != wc_Shell_Flyout then
	TypeKey(cksDownArrow); Select first item in menus
EndIf
EndFunction

Void Function WindowCreatedEvent (handle hWnd, int nLeft, int nTop, int nRight, int nBottom)
if GetWindowClass(hWnd) == wc_Shell_Flyout then
	let ghWnd_Shell_Flyout = hWnd
	;if on a button when this window gets created,
	;a focus change event fires where we can test for an item having focus.
	;but, if on a slider no focus change fires.
	let giScheduledShellFlyoutEnsureFocusItem = ScheduleFunction("ShellFlyoutEnsureFocusItem",1)
EndIf
WindowCreatedEvent(hWnd, nLeft, nTop, nRight, nBottom)
EndFunction

void function WindowDestroyedEvent (handle hWnd)
if hWnd == ghWnd_Shell_Flyout then
	let ghWnd_Shell_Flyout = Null()
EndIf
WindowDestroyedEvent(hWnd)
EndFunction

void function UpdatePaneTitle()
var
	object o
let gsPaneTitle = cscNull
let o = GetUIAObjectTree(GetFocus())
if o then
	let o = o.FindByAutomationId(oaid_titleBar)
	if o then
		let gsPaneTitle = o.Name
	EndIf
EndIf
endFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
var
	object o
if !nType then
	;UIA may need refreshing for JAWS to see the focus item:
	let o = GetUIAObjectFocusItem()
	if o.Role > 0 then
		UIARefresh()
		return
	EndIf
EndIf
UpdateFocusItemData()
UpdatePaneTitle()
if c_FocusItemData.customType == CustomType_FlyOut_Window
	;A flyout window opened without setting the focus to anything inside it,
	;announce the window name if one exists:
	if c_FocusItemData.name
		Say(c_FocusItemData.name,ot_dialog_text)
	endIf
	return
endIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
EndFunction

string function GetOpenWithFlyoutAppListContainerName()
var object o = GetUIAObjectFocusItem()
if o.className != oc_AppListTileElement return cscNull endIf
if o.AutomationId == oaid_StoreTile return cscNull endIf
o = o.parent()
o = o.priorSibling
o = o.priorSibling
if o.className != oc_RichText return cscNull endIf
return o.name
EndFunction

void function UpdateFocusItemData()
var
	object o,
	int iType,
	int x,
	int y
;collection is cleared in PreProcessFocusChangedEventEx
let o = GetUIAObjectFocusItem()
let iType = GetUIAObjectItemType(o)
if iType == CustomType_Unknown then
	return
EndIf
let C_FocusItemData.CustomType = iType
if iType == CustomType_Flyout_Window
	;No iAccessible object was retrieved for The flyout window,
	;use FSUIA instead:
	var object element = CreateUIAFocusElement(true)
	let c_FocusItemData.name = element.name
	return
endIf
o.ClickablePoint(intRef(x),intRef(y))
let c_FocusItemData.ClickX = x
let c_FocusItemData.ClickY = y
if iType == CustomType_ClearTilesButton then
	let c_FocusItemData.Description = o.PriorSibling.Name
	let c_FocusItemData.Name = o.Name
elif iType == CustomType_OpenWithFlyout_AppListTileElement
	let c_FocusItemData.containerName = GetOpenWithFlyoutAppListContainerName()
EndIf
EndFunction

void function ProcessEventOnFocusChangedEvent(handle AppWindow, handle RealWindow, string RealWindowName,
	handle FocusWindow, handle PrevWindow)
LoadNonJCFOptions ()
ProcessEventOnFocusChangedEvent(AppWindow, RealWindow, RealWindowName, FocusWindow, PrevWindow)
EndFunction

int function OnNotificationsButton()
var object o = GetUIAObjectFocusItem()
return o.AutomationId == oaid_idNotificationsButton
EndFunction

int function GetObjectSubTypeCode(optional int sourceType, int nLevel)
var
	int iSubtypeCode,
	object o
let iSubtypecode = GetObjectSubTypeCode(sourceType,nLevel)
if iSubtypeCode == wt_UpDownSlider
&& !InHomeRowMode() then
	if OnNotificationsButton() then
		return wt_button
	EndIf
EndIf
return iSubtypeCode
EndFunction

string function GetListBoxNameFromUIA()
var int continue, object treewalker, object element, string name
treewalker = CreateUIATreeWalkerForFocusProcessId (null (), ON)
if ! treewalker then return endIf
element = Treewalker.CurrentElement
if ! element then return endIf
while (element.controlType != UIA_PaneControlTypeId
&& Treewalker.GoToParent())
	element = Treewalker.CurrentElement
endWhile
while (element.controlType != UIA_TextControlTypeId
&& Treewalker.GoToPriorSibling())
	element = Treewalker.CurrentElement
endWhile
name = element.name
return name
endFunction

string function GetImmersiveOpenWithFlyOutPaneDialogText()
var	object oIAccessibleTree = GetUIAObjectTree(GetFocus())
if !oIAccessibleTree return cscNull endIf
var object o = oIAccessibleTree.FindByAutomationId(oaid_ImmersiveOpenWithFlyout)
if !o return cscNull endIf
o = oIAccessibleTree.FindByAutomationId(oaid_HeadText)
if !o return cscNull endIf
var string sDlgText = o.name
;Determine if the focus is on a confirm button,
;and if so try to find what it is asking about.
o = oIAccessibleTree.FindByKeyboardFocus(true)
if !o 
|| o.automationID != oaid_ConfirmButton 
	;we are done, return the dialog text
	return sDlgText
endIf
;Now we must use FSUIA to look for a selected item and its prompt:
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return sDlgText endIf
o = oUIA.GetFocusedElement().buildUpdatedCache()
if !o return sDlgText endIf
var object condition = oUIA.CreateIntPropertyCondition(UIA_ProcessIdPropertyId, o.ProcessID)
var object treeWalker = oUIA.CreateTreeWalker(condition)
if !treeWalker return sDlgText endIf
SetCurrentElementToFirstElement(oUIA,treeWalker)
condition = oUIA.CreateBoolPropertyCondition( UIA_SelectionItemIsSelectedPropertyId,UIATrue)
o = treeWalker.currentElement.FindFirst(TreeScope_Subtree,condition)
if !o return sDlgText endIf
var string sDefault = o.name
;find the prompt or name of the list in which the selected item appears:
var string sPrompt
treeWalker.currentElement = o
treeWalker.gotoParent()
treeWalker.gotoPriorSibling()
treeWalker.gotoPriorSibling()
if treeWalker.currentElement.className == oc_RichText
	sDefault = FormatString(msgOpenWithFlyoutDlgText_DefaultSelectedItem,treeWalker.currentElement.name,sDefault)
endIf
return sDlgText+cscSpace+sDefault
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var int SubtypeCode = GetObjectSubtypeCode(SOURCE_CACHED_DATA, nLevel)
if nLevel == 0 then
	if GetObjectSubtypeCode(SOURCE_CACHED_DATA) == wt_button then
		if OnNotificationsButton() then
			;The builtin SayObjectTypeAndText will still detect this as a slider,
			;so intercept it here and speak it as a button:
			IndicateControlType(wt_button,GetObjectName(SOURCE_CACHED_DATA))
			;separate the speaking of the value from speaking of the control,
			;so that it is announced more prominently:
			Say(GetObjectValue(SOURCE_CACHED_DATA),ot_Control_name)
			return
		elif C_FocusItemData.CustomType == CustomType_ClearTilesButton then
			IndicateControlType(wt_button,c_FocusItemData.Name)
			Say(c_FocusItemData.Description,ot_Help)
			return
		EndIf
	ElIf SubtypeCode  == WT_LISTBOXITEM then
		if C_FocusItemData.CustomType == CustomType_OpenWithFlyout_AppListTileElement
			IndicateControlType (WT_LISTBOX, C_FocusItemData.containerName,GetObjectName())
			;This may be multiple lists concatenated to perform as one,
			;so Do not announce position in group, because it is confusing 
			;due to the fact that it reports the position within the current list 
			;rather than what appears to the user to be the entire list.
			return
		else
			IndicateControlType (WT_LISTBOX, GetListBoxNameFromUIA())
		endIf
	ElIf SubtypeCode  == WT_LISTBOX then ; ghost, does Parent first and then list box item.
		return
	elif !SubtypeCode  
		if c_FocusItemData.customType == CustomType_FlyOut_Window
		&& c_FocusItemData.name
			;A flyout window opened without setting the focus to anything inside it,
			;announce the window name if one exists:
			Say(c_FocusItemData.name,ot_dialog_text)
			return
		endIf
	EndIf
elIf nLevel >= 1 && SubtypeCode == WT_LISTBOX then
	; In Outlook, there are two list boxes, one nested inside the other, with no value to the user.
	return
elIf nLevel == 1 && ! SubtypeCode && ! MenusActive () then
	var string sDlgText = GetImmersiveOpenWithFlyOutPaneDialogText()
	if sDlgText
		gsPaneTitle = sDlgText
		Say(sDlgText,ot_dialog_text)
		BrailleRefresh()
		return
	endIf
	; in the event that the user clicks on part of a link in an Outlook message,
	; very hard to reproduce from the keyboard,
	; but it's a parent control "flyout" in Office.
	TypeKey (cksDownArrow)
	return
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void function SayLine(optional int iDrawHighlights, int bSayingLineAfterMovement)
if builtin::GetObjectSubtypeCode(SOURCE_CACHED_DATA) == wt_UpDownSlider then
	if OnNotificationsButton() then
		SayObjectTypeAndText()
		return
	EndIf
EndIf
SayLine(iDrawHighlights,bSayingLineAfterMovement)
EndFunction

void function SayCharacterUnit(int UnitMovement)
var
	int iType
if IsPCCursor()
&& !IsLeftButtonDown()
&& GetWindowClass(GetFocus()) == cwc_DirectUIhWND then
	let iType = GetObjectSubtypecode(SOURCE_CACHED_DATA)
	if iType == wt_LeftRightSlider
	|| iType == wt_UpDownSlider then
		;the ValueChangedEvent fires for these sliders,
		;so say nothing when navigating:
		return
	EndIf
EndIf
SayCharacterUnit(UnitMovement)
EndFunction

void function SayLineUnit(int unitMovement,optional  int bMoved)
var
	int iType
if IsPCCursor()
&& !IsLeftButtonDown()
&& GetWindowClass(GetFocus()) == cwc_DirectUIhWND then
	let iType = GetObjectSubtypecode(SOURCE_CACHED_DATA)
	if iType == wt_LeftRightSlider
	|| iType == wt_UpDownSlider then
		;the ValueChangedEvent fires for these sliders,
		;so say nothing when navigating:
		return
	EndIf
EndIf
SayLineUnit(unitMovement,bMoved)
EndFunction

void function SpeakHomeEndMovement()
var
	int iType
if IsPCCursor()
&& !IsLeftButtonDown()
&& GetWindowClass(GetFocus()) == cwc_DirectUIhWND then
	let iType = GetObjectSubtypecode(SOURCE_CACHED_DATA)
	if iType == wt_LeftRightSlider
	|| iType == wt_UpDownSlider then
		;the ValueChangedEvent fires for these sliders,
		;so say nothing when navigating:
		return
	EndIf
EndIf
SpeakHomeEndMovement()
EndFunction

void function GetWindowTitleForApplication(handle hAppWnd, handle hRealWnd, handle hCurWnd, int iTypeCode,
	string ByRef sTitle, string ByRef sSubTitle, int ByRef bHasPage)
if gsPaneTitle then
	let sTitle= gsPaneTitle
	let sSubTitle = cscNull
	let bHasPage = false
	return
EndIf
GetWindowTitleForApplication(hAppWnd, hRealWnd, hCurWnd, iTypeCode,
	sTitle, sSubTitle, bHasPage)
EndFunction

script SayLine()
if IsPCCursor()
	if c_FocusItemData.customType == CustomType_FlyOut_Window
	&& c_FocusItemData.name
		;A flyout window opened without setting the focus to anything inside it,
		;announce the window name if one exists:
		Say(c_FocusItemData.name,ot_dialog_text)
		return
	elif C_FocusItemData.CustomType == CustomType_OpenWithFlyout_AppListTileElement
		IndicateControlType (WT_LISTBOX, C_FocusItemData.containerName,GetObjectname())
		return
	endIf
endIf
PerformScript SayLine()
EndScript


void function GetBrailleDlgComponentsSettings()
var
	string sSharedDir,
	string sComponents
let sSharedDir = GetSharedScriptsDirectory(true)+cScDoubleBackSlash+"default.jbs"
let sComponents = IniReadStringEx("SubtypeCode18", "components",
		IniReadStringEx("SubtypeCode18", "components", cscNull, 0, sSharedDir+cScDoubleBackSlash+"default.jbs"),
		0, sSharedDir+cScDoubleBackSlash+GetActiveConfiguration()+cScPeriod+"jbs")
let gbShouldBrailleDlgName = (StringContains(sComponents,"dlgName") > 0)
EndFunction

int function BrailleCallbackObjectIdentify()
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
if IsPCCursor()
&& !UserBufferIsActive()
&& !GetMenuMode()
&& gsPaneTitle then
	;This is a fudge to add the pane name:
	if gbShouldBrailleDlgName
		BrailleAddObjectName(wt_dialog)
	EndIf
EndIf
if builtin::GetObjectSubtypeCode(SOURCE_CACHED_DATA) == wt_UpDownSlider then
	if OnNotificationsButton() then
		return wt_button
	EndIf
EndIf
if c_FocusItemData.customType == CustomType_FlyOut_Window
&& c_FocusItemData.name
	return wt_static
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int  function BrailleAddObjectName(int nSubtypeCode)
if IsTouchCursor() then
	return BrailleAddObjectName(nSubtypeCode)
endIf
if MenusActive()
&& C_FocusItemData.CustomType == CustomType_MenuItem then
	if c_FocusItemData.HasKeyboardFocus == 1 then
		BrailleAddString(c_FocusItemData.Name,c_FocusItemData.ClickX,c_FocusItemData.ClickY,ATTRIB_HIGHLIGHT)
		return true
	EndIf
endIf
if nSubtypeCode == wt_dialog then
	BrailleAddString(gsPaneTitle,0,0,0)
	return true
elif nSubtypeCode == wt_button then
	if OnNotificationsButton() then
		BrailleAddString(GetObjectName(SOURCE_CACHED_DATA)+cscSpace+GetObjectValue(SOURCE_CACHED_DATA),0,0,0)
		return true
	elif C_FocusItemData.CustomType == CustomType_ClearTilesButton then
		BrailleAddString(c_FocusItemData.Description,0,0,0)
		BrailleAddString(c_FocusItemData.Name,c_FocusItemData.ClickX, c_FocusItemData.ClickY, 0)
		return true
	EndIf
ElIf nSubtypeCode == WT_LISTBOX || nSubtypeCode == WT_LISTBOXITEM then
	if c_FocusItemData.CustomType == CustomType_OpenWithFlyout_AppListTileElement 
		if c_FocusItemData.ContainerName
			BrailleAddString (c_FocusItemData.ContainerName, 0,0,0)
		endIf
	elif ! GetObjectName(SOURCE_CACHED_DATA, 1) then ; list inside a list
		var string name = GetListBoxNameFromUIA()
		if ! StringIsBlank (name) then
			BrailleAddString (name, 0,0,0)
			return TRUE
		endIf
	endIf
endIf
return BrailleAddObjectName(nSubtypeCode)
EndFunction

int function BrailleAddObjectValue(int nSubtypeCode)
if nSubtypeCode == wt_static
&& c_FocusItemData.customType == CustomType_FlyOut_Window
	BrailleAddString(c_FocusItemData.name,0,0,0)
	return true
endIf
return BrailleAddObjectValue(nSubtypeCode)
EndFunction

int function BrailleAddObjectPosition(int nSubtypeCode)
if nSubtypeCode == WT_LISTBOXITEM
&& c_FocusItemData.CustomType == CustomType_OpenWithFlyout_AppListTileElement 
	;don't add position, it is misleading:
	return true
EndIf
return BrailleAddObjectPosition(nSubtypeCode)
EndFunction

script BrailleRouting()
if !BrailleIsMessageBeingShown()
&& !gbBrailleStudyModeActive
&& BrailleIsStructuredLine() then
	if (builtin::GetObjectSubtypeCode(SOURCE_CACHED_DATA) == wt_UpDownSlider && OnNotificationsButton())
	|| C_FocusItemData.CustomType == CustomType_ClearTilesButton then
		TypeKey(cksSpace)
		return
	EndIf
EndIf
PerformScript BrailleRouting()
EndScript

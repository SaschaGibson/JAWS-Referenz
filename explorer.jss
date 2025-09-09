; Copyright 2006-2018 by Freedom Scientific, Inc.
; JAWS script file for windows start menu and taskbar

include "HJConst.jsh"
include "HJGlobal.jsh"
include "UIA.jsh"
include "common.jsm"
include "explorer.jsh"
include "explorer.jsm"
import "UIA.jsd"

Globals
	Int giSkypeContextMenuItem

;For the Windows 10 taskview window:
const
	AutomationID_TaskViewTimelineRoot = "TaskViewTimelineRoot",
	AutomationID_DesktopsList = "DesktopsList",
	AutomationID_ThumbnailButtonElement = "ThumbnailButtonElement",
	AutomationID_NewVirtualDesktopBarButton = "NewVirtualDesktopBarButton",
	AutomationID_SwitchItemListControl = "SwitchItemListControl",
	AutomationID_ActivitiesGridView = "ActivitiesGridView",
	AutomationID_SearchControl = "SearchControl"


int function IsWindows11ToggleSwitchButton ()
; the start button is the only one we know of now, 
; but these buttons are toggle buttons and should say "on " and "off"
; instead of checked and not checked.
return IsWindows11 () && GetObjectClassName () == "ToggleButton"
&& controlCanBeChecked ()
endFunction

int function MenuProcessedOnFocusChangedEventEx(
	handle hwndFocus, handle hwndPrevFocus,
	int nType, optional int nChangeDepth)
;There is a timing problem which sometimes occurs when exiting the Start Menu of Windows 7,
;where FocusChangedEventEx comes before the MenuModeEvent.
;Such a timing problem results in JAWS attempting to speak the menu item, which results in announcement of the clock.
if GetMenuMode() != MENU_INACTIVE
&& GetWindowClass(GetFocus()) == "Shell_TrayWnd"
&& !GetObjectSubtypeCode()
	GlobalMenuMode = MENU_INACTIVE
	ClearFocusChangeMenuGlobals()
	;returning true prevents further processing in FocusChangedEventEx:
	return true
endIf
return MenuProcessedOnFocusChangedEventEx(hwndFocus, hwndPrevFocus, nType, nChangeDepth)
EndFunction

int function IsVirtualDesktopButton()
if (UserBufferIsActive() || GetObjectSubtypeCode() != wt_button) return false endIf
var object element = FSUIAGetFocusedElement()
return element.automationID ==AutomationID_ThumbnailButtonElement
	|| element.automationID ==AutomationID_NewVirtualDesktopBarButton
EndFunction

string function GetPositionInGroupForVirtualDesktopButton()
if !IsVirtualDesktopButton() return cscNull endIf
var object element = FSUIAGetFocusedElement()
if !element return cscNull endIf
var object parent = FSUIAGetParentOfElement(element)
if !parent return cscNull endIf
return PositionInGroupFromUIA(parent)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	int objectState, string objectStateString,
	handle hWnd,
	handle hPrior,
	string sName,
	string sHelp,
	string sClass
hWnd = GetCurrentWindow()
if nLevel == 0
&& IsWindows11ToggleSwitchButton ()
	objectState = getObjectStateCode ()
	if objectState & CTRL_CHECKED then
		ObjectStateString = cmsgOn
	elIf objectState & CTRL_UNCHEcked then
		ObjectStateString = cmsgOff
	endIf
	return SayControlExWithMarkup (hWnd, GetObjectName (), GetObjectType (), ObjectStateString)
endIf
sClass = GetWindowClass(hWnd)
if sClass == cwc_SysTreeView32
	hPrior = GetPriorWindow(hWnd)
	if GetWindowSubtypeCode(hPrior) == wt_static
	&& GetObjectName(SOURCE_CACHED_DATA,1) == GetWindowName(hPrior)
	&& GetObjectSubtypeCode(SOURCE_CACHED_DATA,2) == wt_dialog then
		;Do not allow the static text to be spoken as the control name,
		;since it is the dialog static text.
		IndicateControlType(wt_treeview,cmsgSilent,cmsgSilent)
		SayObjectActiveItem(true)
		return
	EndIf
EndIf
if nLevel < 2
&& sClass == cwc_Windows_UI_Core_CoreWindow 
	if nLevel == 1
	&& GetObjectAutomationID(2) == UIAAutomationID_TaskSwitchingWindow 
		;Do not announce the list name of the Running Application listbox:
		return
	elif IsVirtualDesktopButton()
		;In Windows 10, The taskview virtual desktop button in focus is a child of the list item,
		;and the name of the button is the same as the list item.
		;Since the child button is named the same as its parent list item, one of these names is redundant.
		;Also, The position in group is incorrectly reported for the button if there is more than 1 list item with button.
		if nLevel == 0
			IndicateControlType(wt_button,GetObjectName(),cmsgSilent)
			Say(GetPositionInGroupForVirtualDesktopButton(),ot_position)
		endIf
		return
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
sHelp = GetObjectHelp(SOURCE_DEFAULT, nLevel)
sName = GetObjectName(SOURCE_DEFAULT, nLevel)
if !StringIsBlank(sHelp)
&& !StringContainsCaseInsensitive (sName, sHelp)
	Say (sHelp, OT_HELP)
endIf
EndFunction

int function BrailleAddObjectState (int subtypeCode)
var
	int objectState, string objectStateString
if IsWindows11ToggleSwitchButton () 
&& (subtypeCode == WT_BUTTON || subtypeCode == WT_STARTBUTTON) then
	objectState = getObjectStateCode ()
	if objectState & CTRL_CHECKED then
		ObjectStateString = cmsgOn
	elIf objectState & CTRL_UNCHEcked then
		ObjectStateString = cmsgOff
	endIf
	BrailleAddString (ObjectStateString, 0,0,0)
	return TRUE
endIf
return BrailleAddObjectState (subtypeCode)
endFunction

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	int nState,
	handle hFocus = getFocus (),
	string sWinName = GetWindowName(GetForegroundWindow())
if ! keyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	return
endIf
if (! ControlCanBeChecked () && sWinName == wn_LocalAreaConnectionProperties
&& getWindowSubtypeCode (hFocus) == WT_LISTVIEW)
	nState = lvGetItemState (hFocus, lvGetFocusItem (hFocus))
	;Now convert to standard CTRLAttrib states for announcements:
	if (nState & lv_ItemNotChecked)
		indicateControlState (wt_checkbox, CTRL_Unchecked)
	elIf (nState & lv_ItemChecked)
		indicateControlState (wt_checkbox, CTRL_Checked)
	else; '' // dn'dont do anything, state = checked or not checked in this dialog window
	endIf
	return
endIf
if sWinName == wn_TaskbarAndStartMenuProperties
&& GetWindowClass(GetFocus()) == cwc_SysTreeView32
&& ControlCanBeChecked() then
	MSAARefresh()
	return true
EndIf
return ProcessSpaceBarKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
EndFunction

Void Function SayHighlightedText (handle hwnd, string buffer)
var
	int nSubtypeCode,
	int iCtrlID
if GetWindowSubtypeCode(hWnd) == wt_ListView then
	let iCtrlID = GetControlID(hWnd)
	if iCtrlID == id_FireWallServicesCheckableListView
	|| iCtrlID == id_FireWallICMPCheckableListView then
		if hWnd != GlobalFocusWindow then
			return
		EndIf
	EndIf
EndIf
SayHighlightedText(hwnd,buffer)
EndFunction

int function SayByTypeForScriptSayLine()
if IsVirtualDesktopButton()
	;Correct the announcement of position in group:
	IndicateControlType(wt_button,GetObjectName(),cmsgSilent)
	Say(GetPositionInGroupForVirtualDesktopButton(),ot_position)
	return true
endIf
if GetWindowSubtypeCode(GlobalFocusWindow) == wt_ListView
	var	int iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_FireWallServicesCheckableListView
	|| iCtrlID == id_FireWallICMPCheckableListView
		SayLVItemCheckStatus(GlobalFocusWindow)
		return true
	EndIf
EndIf
return SayByTypeForScriptSayLine()
EndFunction

Script SayNextLine ()
var
	handle hWnd
If (IsPcCursor () &&
! UserBufferIsActive ()) then
	If IsInSkypeTrayMenu () then
		SayLineUnit(UnitMove_Next, FALSE)
		Return
	EndIf
	If Not MenusActive () then
		Let hWnd = GetFocus ()
		If GetWindowClass (hWnd) == CWC_DATETIME_PICKER then
			NextLine ()
			SayWindow (hWnd, READ_HIGHLIGHTED)
			Return
		EndIf
	EndIf
EndIf
PerformScript SayNextLine ()
EndScript

Script SayPriorLine ()
var
	handle hWnd
If (IsPcCursor () &&
! UserBufferIsActive ()) then
	If IsInSkypeTrayMenu () then
		SayLineUnit(UnitMove_Prior, FALSE)
		Return
	EndIf
	If Not MenusActive () then
		Let hWnd = GetFocus ()
		If GetWindowClass (hWnd) == CWC_DATETIME_PICKER then
			PriorLine ()
			SayWindow (hWnd, READ_HIGHLIGHTED)
			Return
		EndIf
	EndIf
EndIf
PerformScript SayPriorLine ()
EndScript

Script SayWord ()
var
	handle hWnd,
	string sWord
If (IsPcCursor () &&
! UserBufferIsActive () &&
! MenusActive ()) then
	Let hWnd = GetFocus ()
	If GetWindowClass (hWnd) == CWC_DATETIME_PICKER then
		;SayWindow (hWnd, READ_HIGHLIGHTED)
		Let sWord = GetWindowText (hWnd, READ_HIGHLIGHTED)
		If IsSameScript () then
			Say (sWord, OT_SPELL)
		Else
			Say (sWord, OT_WORD)
		EndIf
		Return
	EndIf
EndIf
PerformScript SayWord ()
EndScript

Int Function IsInSkypeTrayMenu ()
var
	Handle hFocus

let hFocus = GetFocus ()
If MenusActive ()
&& StringContains (GetWindowOwner (hFocus), "Skype.exe")
&& GetWindowSubtypeCode (hFocus) == WT_CONTEXTMENU then
	Return TRUE
EndIf
Return FALSE
EndFunction

void function SayLineUnit(int unitMovement, int bMoved)
var
	Object oContextMenu,
	Int iChildID,
	Int iChildNum
if !IsPCCursor()
|| UserBufferIsActive () then
	return SayLineUnit (unitMovement, bMoved)
endIf
let oContextMenu = GetFocusObject (iChildID)
let iChildNum = oContextMenu.accChildCount
If iChildNum == 4 then
	If unitMovement == UnitMove_Next then
		let giSkypeContextMenuItem = giSkypeContextMenuItem * 2
		If giSkypeContextMenuItem > iChildNum then
			let giSkypeContextMenuItem = 1
		EndIf
	ElIf unitMovement == UnitMove_Prior then
		If giSkypeContextMenuItem == 1 then
			let giSkypeContextMenuItem = iChildNum
		Else
			let giSkypeContextMenuItem = giSkypeContextMenuItem / 2
		EndIf
	EndIf
	If giSkypeContextMenuItem == 1 then
		SayLine ()
		Return
	EndIf
	Say (oContextMenu.accName (giSkypeContextMenuItem), OT_SELECTED_ITEM)
	Return
EndIf
SayLineUnit (unitMovement, bMoved)
EndFunction

int function ContextMenuProcessed(handle hWnd)
var
	Int iChildID,
	Object oContextMenu

If IsInSkypeTrayMenu () then
	let oContextMenu = GetFocusObject (iChildID)
	If oContextMenu then
		let giSkypeContextMenuItem = 1
		IndicateControlType (WT_CONTEXTMENU, cScNull, cScNull)
		SayLine ()
		Return TRUE
	EndIf
EndIf
Return (ContextMenuProcessed(hWnd))
EndFunction

Script Enter ()
var
	Object oContextMenu,
	Int iChildID

If IsInSkypeTrayMenu ()
&& IsPCCursor ()
&& (! UserBufferIsActive ()) then
	SayCurrentScriptKeyLabel ()
	let oContextMenu = GetFocusObject (iChildID)
	oContextMenu.accDoDefaultAction (giSkypeContextMenuItem)
	Return
EndIf
PerformScript Enter()
EndScript

void function SayCharacterUnit(int UnitMovement)
var
	string sClass
if IsPCCursor()
&& !IsVirtualPCCursor()
&& !(IsLeftButtonDown() || IsRightButtonDown()) then
	let sClass = GetWindowClass(GetParent(getParent(GetFocus())))
	if sClass == wc_NamespaceTreeControl
	|| sClass == wc_DesktopProgramsMFU then
		if GetObjectSubtypeCode() == wt_edit then
			SayCharacter()
			return
		EndIf
	EndIf
endIf
SayCharacterUnit(UnitMovement)
EndFunction

int function BrailleAddObjectValue(int nSubtype)
var
	string sClass
if nSubtype == wt_edit then
	let sClass = GetWindowClass(GetParent(getParent(GetFocus())))
	if sClass == wc_NamespaceTreeControl
	|| sClass == wc_DesktopProgramsMFU then
		BrailleAddString(GetObjectValue(),GetCursorCol(),GetCursorRow(),GetControlAttributes())
		return true
	EndIf
EndIf
return BrailleAddObjectValue(nSubtype)
EndFunction

int function BrailleAddObjectPosition(int nSubtype)
if IsVirtualDesktopButton()
	BrailleAddString(GetPositionInGroupForVirtualDesktopButton(),0,0,0)
	return true
endIf
return BrailleAddObjectPosition(nSubtype)
EndFunction

int function IsExemptFromMouseSpeech(int x, int y, object element)
;Focus follows the mouse in most areas of the start menu,
;so this segment of mouse speech code can be overwritten in the app-specific script.
var
	handle hFocus = GetFocus(),
	handle hMouseWnd = GetWindowAtPoint(x,y)
if hFocus != hMouseWnd
	return false
endIf
var
	string focusClass = GetWindowClass(hFocus),
	int focusType = GetObjectSubtypeCode(),
	string mouseClass = GetWindowClass(hMouseWnd),
	string ancestorClass
if (focusClass == cwc_DirectUIhWND && focusType == wt_edit)
|| element.controlType == UIA_TextControlTypeId
	;Focus is not following the mouse:
	return false
endIf
if mouseClass == cWcListView
	ancestorClass = GetWindowClass(GetParent(hMouseWnd))
	if ancestorClass == wc_DesktopProgramsMFU
	|| ancestorClass == wc_DesktopDestinationList
	|| ancestorClass == wc_DesktopSpecialFolders
	|| ancestorClass == wc_DesktopTopMatch
		;Scrolling through top level of the Start menu:
		return true
	endIf
elif mouseClass == cwc_SysTreeView32
	ancestorClass = GetWindowClass(GetParent(GetParent(hMouseWnd)))
	if ancestorClass == wc_DesktopNSCHost
		;Scrolling through Start Menu where applications have submenus:
		return true
	endIf
elif mouseClass == cwc_DirectUIhWND
	ancestorClass = GetWindowClass(GetParent(GetParent(hMouseWnd)))
	if ancestorClass == wc_DesktopSearchOpenView
		;scrolling through list of search results
		return true
	endIf
endIf
return IsExemptFromMouseSpeech(x,y,element)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgExplorerAppName)
EndScript

string function GetFocusedApplicationVersionInfo ()
return GetOSVersionInfo()
endFunction

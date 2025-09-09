; Copyright 2009-2021 by Freedom Scientific, Inc.
; Scripts for Settings center.

use "SettingsCommon.jsb"

Include "HJConst.jsh"
Include "HJGlobal.jsh"
Include "MSAAConst.jsh"
include "WinStyles.jsh"
Include "Common.jsm"
Include "TutorialHelp.jsm"
Include "QuickSettings.jsm"
Include "SettingsCenter.jsh"


CONST
	IDI_RESTORE_ON_JAWS_EXIT	0,
	IDI_RESTORE_ON_FOCUS_CHANGE	1,
	IDI_SAVETODISK 	2,
	IDI_SETTINGS_NODE 	3,
	IDI_SETTINGS_HISTORY	4,
	IDI_DOCUMENT_SETTINGS_NODE	5,
	PERSISTENCE_DEFAULT	IDI_SAVETODISK

GLOBALS
	int gbQuickNavigationMode,
;Word-specific NavQuickKey 	variables:
	int gbQuickNavKeyTrapping,
	int giQuickNavState,
;end of 	Word-specific NavQuickKey 	variables:
	int giPrevMSAAMode,
	int gbReturningFromContextMenuToTree,
	int giFN_SpeakInvisibleWindow,
	int giKeyRepeat,
; Keeps TutorMessageEvent from speaking 'Type in text' during search text entry
	handle globalPrevTutorWindow,
	string gstrBrlResults,
int qsCroppedMode,
int qsSplitMode


int function inQuickSettingsDialog ()
;Only return TRUE from the QuickSettings script file,
; since that gets pushed onto the stack on QuickSettingsLoad,
;and popped on QuickSettings Exit:
;
;return TRUE
return ! menusActive () && ! isVirtualPcCursor ()
endFunction

void function sayWindowTypeAndText (handle hwnd)
if getWindowSubtypeCode (hwnd) == WT_READONLYEDIT && getControlID (hwnd) == QuickHelpEditID then
	return sayControlEX (hwnd, cscSpace+cscSpace+cscBufferNewLine)
endIf
return sayWindowTypeAndText (hwnd)
endFunction

string function getNodeParentDescription ()
;gets description for parent item in tree,
;as from an MSAA perspective these are all llateral.
;This is to facilitate description of Document Settings children as Document Settings,
;Rather than as Save To Disk.
var
	object oItem,
	int nChild, int bParentFound = 0;
oItem = getCurrentObject (nChild )
while (nChild && ! bParentFound)
	nChild = (nChild-1)
	bParentFound = (oItem.accState(nChild) & STATE_SYSTEM_EXPANDED) ||  (oItem.accState(nChild) & STATE_SYSTEM_COLLAPSED)
endWhile
if bParentFound then
	return (oItem.AccDescription(nChild))
endIf
endFunction

void function autoStartEvent ()
giKeyRepeat = getJCFOption (OPT_KEY_REPEAT)
setJCFOption (OPT_KEY_REPEAT, 1)
giPrevMSAAMode = getJcfOption (OPT_MSAA_MODE)
SetJCFOption(OPT_MSAA_MODE, 0)
; save and reset any Braille split modes
qsCroppedMode=getJCFOption(OPT_BRL_CROPPED_MODE)
qsSplitMode=BrailleGetSplitMode()
SetJCFOption(OPT_BRL_CROPPED_MODE, 0)
BrailleSplitMode(0)
endFunction

void function AutoFinishEvent ()
setJCFOption (OPT_KEY_REPEAT, giKeyRepeat )
setJcfOption (OPT_MSAA_MODE, giPrevMSAAMode)
SetJCFOption(OPT_BRL_CROPPED_MODE, qsCroppedMode)
BrailleSplitMode(qsSplitMode)
endFunction

Void Function ProcessBoundaryStrike (handle hWnd, int iEdge)
if getWindowClass (GlobalPrevFocus) == "SearchBox" then return endIf
ProcessBoundaryStrike (hWnd, iEdge)
endFunction

int function ShouldExitSayTreeViewLevel()
if gbReturningFromContextMenuToTree
	gbReturningFromContextMenuToTree = false
	return true
endIf
return false
EndFunction

int function MenuInactiveProcessed(int mode, int PrevMenuMode)
var
	int bProcessed
bProcessed = MenuInactiveProcessed(mode, PrevMenuMode)
if getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_TREEVIEWITEM then
	MSAARefresh ()
	bProcessed = TRUE || bProcessed
	gbReturningFromContextMenuToTree = TRUE
endIf
return bProcessed
endFunction

string function getPersistenceInfo (int iInfo)
var string sInfo = ""
if iInfo == IDI_RESTORE_ON_JAWS_EXIT then
	sInfo = FormatString(msgRestoreOnJAWSExit)
elIf iInfo == IDI_RESTORE_ON_FOCUS_CHANGE then
	sInfo = msgRestoreOnFocusChange
elIf iInfo == IDI_SAVETODISK then
	sInfo = msgSaveToDisk
elIf iInfo == IDI_SETTINGS_NODE then
	sInfo = msgSettingsNode
elIf iInfo == IDI_SETTINGS_HISTORY then
	sInfo = msgSettingsHistory
elIf iInfo == IDI_DOCUMENT_SETTINGS_NODE then
	sInfo = msgDocumentSettings
endIf
return sInfo
endFunction

string  function GetPersistenceInfoForSayTreeviewItem()
var
	string sObjectDescription,
	int iPersistence,
	int nParent,
	string sPersistence
sObjectDescription = getObjectDescription(SOURCE_CACHED_DATA)
if !stringIsBlank (sObjectDescription)
	iPersistence = stringToInt (sObjectDescription)
	if iPersistence == IDI_SAVETODISK then
		nParent = stringToInt (getNodeParentDescription ())
	endIf
	if nParent && nParent != IDI_SETTINGS_NODE then
		iPersistence = nParent
	endIf
	if iPersistence != PERSISTENCE_DEFAULT && iPersistence != IDI_SETTINGS_NODE then
		sPersistence = getPersistenceInfo (iPersistence)
	endIf
endIf
return sPersistence
EndFunction

String Function ChangeSelectedControlInfo ()
var
	int nParent,
	Variant hWnd,
	Handle hRadio,
	Handle hTree,
	Object oControl,
	String sObjectName,
	String sControlInterior,
	String sPosition,
	String sResultText,
	string sObjectDescription,
	string sPersistence,
	int iPersistence,
	Int iWindowType,
	Int iChildID,
	Int iTemp,
	Int iMessage

let iMessage = RegisterWindowMessage (MN_HighlightedControl)
let hWnd = SendMessage (GetAppMainWindow (GetFocus ()), iMessage)
let sObjectName = GetObjectName(SOURCE_CACHED_DATA)
let sObjectDescription = getObjectDescription(SOURCE_CACHED_DATA)
if ! stringIsBlank (sObjectDescription) then
	let iPersistence = stringToInt (sObjectDescription)
	if iPersistence == IDI_SAVETODISK then
		let nParent = stringToInt (getNodeParentDescription ())
	endIf
	if nParent && nParent != IDI_SETTINGS_NODE then
		iPersistence = nParent
	endIf
	if iPersistence != PERSISTENCE_DEFAULT && iPersistence != IDI_SETTINGS_NODE then
		let sPersistence = getPersistenceInfo (iPersistence)
	endIf
endIf
If Not StringCompare (GetWindowName (hWnd), sObjectName, TRUE) then
	let iWindowType = GetWindowSubtypeCode (hWnd)
	If iWindowType == WT_STATIC then
		let hWnd = GetNextWindow (hWnd)
		let iWindowType = GetWindowSubtypeCode (hWnd)
	EndIf
	If iWindowType == WT_GROUPBOX
	&& GetWindowSubtypeCode (GetNextWindow (hWnd)) == WT_RADIOBUTTON then
		let hWnd = GetNextWindow (hWnd)
		let hRadio = hWnd
		let iWindowType = GetWindowSubtypeCode (hWnd)
	EndIf
	If IsWindowDisabled (hWnd) then
		SayMessage (OT_ERROR, MSG_ImpossibleToChangeDisableState_L, MSG_ImpossibleToChangeDisableState_S)
		Return (FALSE)
	EndIf
	If iWindowType == WT_CHECKBOX then
		PostMessage (hWnd, BM_SETCHECK, ! SendMessage (hWnd, BM_GETCHECK))
		PostMessage (GetParent (hWnd), WM_COMMAND, GetControlID (hWnd), hWnd)
	EndIf
	If iWindowType == WT_RADIOBUTTON then
		While (! SendMessage (hWnd, BM_GETCHECK))
		&& GetWindowSubtypeCode (GetNextWindow (hWnd)) == WT_RADIOBUTTON
			let hWnd = GetNextWindow (hWnd)
		EndWhile
		PostMessage (hWnd, BM_SETCHECK, 0)
		let hWnd = GetNextWindow (hWnd)
		If GetWindowSubtypeCode (hWnd) != WT_RADIOBUTTON then
			let hWnd = hRadio
		EndIf
		PostMessage (hWnd, BM_SETCHECK, 1)
		PostMessage (GetParent (hWnd), WM_COMMAND, GetControlID (hWnd), hWnd)
		let iWindowType = GetWindowSubtypeCode (hWnd)
	EndIf
	If iWindowType == WT_COMBOBOX then
		let oControl = GetObjectFromEvent (hWnd, OBJID_CLIENT, iChildID, iTemp)
		let sControlInterior = oControl.accValue (CHILDID_SELF)
		PostMessage (hWnd, WM_KEYDOWN, 0x28, 0)
		PostMessage (hWnd, WM_KEYUP, 0x28, 0)
		If sControlInterior == oControl.accValue (CHILDID_SELF) then
			PostMessage (hWnd, WM_KEYDOWN, 0x24, 0)
			PostMessage (hWnd, WM_KEYUP, 0x24, 0)
		EndIf
	EndIf
	If iWindowType == WT_BUTTON then
		PostMessage (hWnd, WM_KEYDOWN, 0x20, 0)
		PostMessage (hWnd, WM_KEYUP, 0x20, 0)
		let ghPressedFromTreeView = GetFocus ()
	EndIf
	If iWindowType == WT_LEFTRIGHTSLIDER then
		let oControl = GetObjectFromEvent (hWnd, OBJID_CLIENT, iChildID, iTemp)
		let iTemp = oControl.accValue (CHILDID_SELF)
		PostMessage (hWnd, WM_KEYDOWN, 0x28, 0)
		PostMessage (hWnd, WM_KEYUP, 0x28, 0)
		If iTemp == 100 then
			PostMessage (hWnd, WM_KEYDOWN, 0x24, 0)
			PostMessage (hWnd, WM_KEYUP, 0x24, 0)
		EndIf
	EndIf
	If iWindowType == WT_EDIT_SPINBOX then
		let iTemp = SendMessage (GetNextWindow (hWnd), UDM_GETRANGE) / 0x10000
		If iTemp == SendMessage (GetNextWindow (hWnd), UDM_GETPOS) then
			PostMessage (GetNextWindow (hWnd), UDM_SETPOS, 0, 0)
		Else
			PostMessage (GetNextWindow (hWnd), UDM_SETPOS, 0,SendMessage (GetNextWindow (hWnd), UDM_GETPOS) + 1)
		EndIf
	EndIf
	let sResultText = GetSelectedControlInfo ()
	let hTree = GetFocus ()
	If iWindowType == WT_RADIOBUTTON then
		SpeechOff ()
		SetFocus (hWnd)
		Delay (1)
		let sPosition = PositionInGroup ()
		SetFocus (hTree)
		Delay (1)
		SpeechOn ()
	ElIf iWindowType == WT_COMBOBOX then
		SpeechOff ()
		SetFocus (hWnd)
		Delay (1)
		let sPosition = PositionInGroup ()
		SetFocus (hTree)
		Delay (1)
		SpeechOn ()
	EndIf
EndIf
if ! stringIsBlank (sPersistence) then
	sPersistence = sPersistence + cscBufferNewLine + sPersistence
endIf
Return (sResultText + SMMMarkupStringToSayMessage (sPosition) + sPersistence)
EndFunction

void function tutorMessageEvent (handle hwndFocus, int nMenuMode)
if nMenuMode then
	globalPrevTutorWindow = hwndFocus
	return tutorMessageEvent (hwndFocus, nMenuMode)
endIf
;Keeps tutor from speaking every time user types a key in Search Edit field.
if ((globalPrevTutorWindow && hwndFocus == globalPrevTutorWindow)
&& (getControlID (hwndFocus) == SearchEditID))
	return
endIf
globalPrevTutorWindow = hwndFocus
return tutorMessageEvent (hwndFocus, nMenuMode)
endFunction

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
if menusActive () || isVirtualPcCursor () then
	return ObjStateChangedEvent (hObj, iObjType, nChangedState, nState, nOldState)
endIf
if hObj != GetFocus() then
	return
EndIf
if nSelectingText then
	return
EndIf
if HJDialogObjStateChangeSpoken(hObj,iObjType,nChangedState,nState,nOldState) then
	return
EndIf
;Announce the list item when it changes state:
if iObjType == wt_ListBoxItem
|| iObjType == wt_ExtendedSelect_ListBox
|| iObjType == wt_MultiSelect_ListBox then
	if (!nState || nChangedState == CTRL_SELECTED)
	&& !InHJDialog() then
		;When the item becomes selected, we only announce the name, not the state.
		;Must fill out all parameters for Say, so that speech markup is honored for customize list view:
		;When the item becomes deselected, "Not Selected" is part of the name, so we don't need to explicitly announce it.
		Say(GetCurrentListViewItemName(),ot_line, lvIsCustomized (hObj))
		return
	EndIf
EndIf
;For the rest of the object types, do not announce change to unavailable state:
if nState == CTRL_GRAYED then
	return
EndIf
if iObjType == wt_RadioButton then
	;if the radio buttons are items in a treeview,
	;then speak them as we would speak a treeview item:
	if GetObjectSubtypeCode(SOURCE_CACHED_DATA) == wt_TreeView then
		SayTreeViewItem()
	elif IsJavaWindow(hObj) then
		IndicateControlState(iObjType, nChangedState)
	elif IsVirtualPCCursor() then
		;when the button has focus but the state has not been toggled,
		;as in after using MoveToField script,
		;obj state changed event will fire when the state changes.
		;If the button has been arrowed to,
		;the focus changes event fires and the obj state changed event does not.
		;To be consistent with the way the button is announced when the focus change happens,
		;the entire object is announced on state change,
		;not merely the state change.
		SayObjectTypeAndText()
	EndIf
	;For all other radio buttons, focusChangedEvent should announce when radio buttons gain focus.
	return
EndIf
if iObjType == WT_TREEVIEW
|| iObjType == WT_TREEVIEWITEM then
	;don't do this if the old state is selected and the new state is not selected
	if ((nOldState&CTRL_SELECTED) && !(nState&CTRL_SELECTED)) then
		;do nothing
	else
			SayTreeViewLevel (InHjDialog ())
	EndIf
ElIf iObjType == wt_button
|| iObjType == wt_StartButton
|| iObjType == wt_Checkbox then
	;for buttons, we do not want announcement of the pressed state.
	if !(nState & ctrl_pressed) then
		if nState & CTRL_Indeterminate then
			;announce only partially checked, not the checked which is also set
			;Must also indicate required or invalid states so can't just pass CONTROL_INDETERMINATE, instead,
			;mask off checked and unchecked
			IndicateControlState(iObjType,nState&~(CTRL_CHECKED|CTRL_UNCHECKED))
		else
			IndicateControlState(iObjType,(nState & ~ctrl_selected))
		EndIf
	EndIf
	elif ( iObjType == WT_TOGGLE_BUTTON
	&& nOldState == CTRL_PRESSED ) then
	IndicateControlState(iObjType, 0, cmsgNotPressed_l )
else
	;Add check for menus of header bar controls:
		if iObjType == WT_MENU
	&& ! ( nState & ( CTRL_UNCHECKED | CTRL_CHECKED ) )
	&& nOldState & CTRL_CHECKED then
			Let nChangedState = ( nChangedState | CTRL_UNCHECKED )
			Let iObjType = WT_CHECKBOX ; so state indication will be right
		endIf
	IndicateControlState(iObjType, nChangedState)
endIf
EndFunction

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
;Prevents any future apps call down to default when QuickSettings is loaded.
var
	handle hwndNull,
	string sClass,
	int nType
if giFN_SpeakInvisibleWindow then
	unScheduleFunction (giFN_SpeakInvisibleWindow)
endIf
MonitorFormsModeComboBox(hwndFocus,hwndPrevFocus,nChild)
let sClass = GetWindowClass(hwndFocus)
let nType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
if MenuProcessedOnFocusChangedEventEx(hwndFocus,hwndPrevFocus,nType,nChangeDepth) then
	return
EndIf
if ProcessTaskSwitchList(hWndFocus) then
	return
EndIf
EnsureVistaDesktopTrackingInMagic(hWndFocus,nType)
ProcessEventOnFocusChangedEventEx(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild,nChangeDepth,sClass,nType)
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
var
	int iWinType,
	int iObjType
if nSelectingText then
	return
EndIf
SaveCursor ()
PCCursor ()
Let iObjType = GetObjectSubtypeCode ()
if IsJavaWindow (curHwnd) then
	if g_JavaIgnoreNextActiveItemChange then
		let g_JavaIgnoreNextActiveItemChange = 0
		RestoreCursor ()
		return
	EndIf
	if WT_TABLE == iObjType
	|| WT_TABLECELL == iObjType then
		if !InTable() then
			let g_JavaPrevNumOfCells = 0
			let g_JavaTableNavDir = TABLE_NAV_NONE
		else
			SpeakTableCells (g_JavaTableNavDir, g_JavaPrevNumOfCells)
			let g_JavaPrevNumOfCells = 0
			let g_JavaTableNavDir = TABLE_NAV_NONE
			RestoreCursor ()
			return
		endif
	endIf
endIf
if iObjType == wt_ListBoxItem
&& FocusWindowSupportsUIA() then
	say(GetObjectName(),ot_line)
	return
elif (WT_TREEVIEW == iObjType
|| WT_TREEVIEWITEM == iObjType
|| GetWindowClass(curHwnd) == cwc_SysTreeview32)
&& !MenusActive() then
	SayTreeViewLevel (true)
	RestoreCursor ()
	return
elif iObjType == WT_TABLECELL
|| iObjType == WT_COLUMNHEADER
|| iObjType == WT_ROWHEADER then
	if globalSpeakHeaderOnCellChange == TABLE_NAV_HORIZONTAL then
		Say(GetColumnHeader(TRUE),OT_SCREEN_MESSAGE)
	elif globalSpeakHeaderOnCellChange == TABLE_NAV_VERTICAL then
		Say(GetRowHeader(TRUE),OT_SCREEN_MESSAGE)
	EndIf
	;Winforms windows contain their own row / column header data.
	;Example are stand-alone databases copiled as exe.
	if IsWinFormsWindow (curHwnd)
	&& StringIsBlank (GetRowHeader (TRUE) )
	&& StringIsBlank (GetColumnHeader (TRUE)) then
		sayObjectActiveItem ()
	else
		sayCell()
	endIf
	RestoreCursor ()
	return
endIf
let iWinType = getWindowSubtypeCode (curHwnd)
if iWinType != WT_TASKBAR && iWinType != WT_SYSTRAY
&& (iObjType == wt_button
|| iObjType == wt_CheckBox
|| iObjType == wt_RadioButton) then
	SayObjectTypeAndText()
else
	; removed code from this spot for special handling of list view items
	; in favor of the internal handling using SayObjectActiveItem()
	;special case for SWT_Window0 (probably should apply to all cases but for safety)
	if StringCompare (GetWindowClass (GetTopLevelWindow (curHwnd)),"SWT_Window0",false) == 0 &&
			curHwnd != prevHwnd then
		SayObjectTypeAndText (0)
	else
		SayObjectActiveItem (false)
	EndIf
EndIf
RestoreCursor ()
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
;Prevents any future apps call down to default when QuickSettings is loaded.
var
	HANDLE FocusedObjectID,
	HANDLE AppMainObjectID,
	HANDLE TopLevelObjectID,
	HANDLE RealObjectID,
	handle RealWindow,
	string RealWindowName,
	handle AppWindow
let RealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
let GlobalFocusWindow = FocusWindow
let FocusedObjectID = navGetFocusObjectID ()
let AppMainObjectID = navGetAppMainObjectID (FocusedObjectID, FocusWindow)
let TopLevelObjectID = navGetTopLevelObjectID (FocusedObjectID, FocusWindow)
let RealObjectID = navGetRealObjectID (FocusedObjectID, FocusWindow)
ProcessEventOnFocusChangedEvent(AppWindow, RealWindow, RealWindowName, FocusWindow, PrevWindow)
;now set all the global variables for next time.
let GlobalPrevRibbonState = GlobalRibbonState
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
Let GlobalWasHjDialog = InHjDialog ()
if ( ( False == GlobalWasHjDialog ) && ( IsMacToolTipWindow (RealWindow) ) )
then
	Let GlobalWasHjDialog = True
EndIf
GlobalPrevDialogIdentifier = GetDialogIdentifier()
let g_PrevAppMainObjectID = AppMainObjectID
let g_PrevTopLevelObjectID = TopLevelObjectID
let g_PrevRealObjectID = RealObjectID
let g_PrevFocusedObjectID = FocusedObjectID
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if (hwndFocus != hwndPrevFocus
;&& nType == WT_READONLYEDIT ;Returns WT_MULTILINE_EDIT, so will use window instead to get it:
&& getWindowSubtypeCode (hwndFocus) == WT_READONLYEDIT
&& getControlID (hwndFocus) == QuickHelpEditIDForResearchIt) then
	;make sure we're at the top of the window.
	;This is the help window for the Research It Options dialog box.
	saveCursor ()
	PcCursor ()
	JAWSTopOfFile ()
endIf
;keep controls from responding as though only the child changed:
if (hwndFocus != hwndPrevFocus) then
	return focusChangedEvent (hwndFocus, hwndPrevFocus)
endIf
return ProcessEventOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass,  nType)
endFunction

int function SayFocusedHJDialogWindow (handle FocusWindow)
	;No other HJ dialogs are valid in this context:
	return FALSE
endFunction

int function handleCustomAppWindows (handle hwmd)
var string sOwner = getWindowOwner (getFocus ())
EstablishQuickNavState()
sOwner = stringSegment (sOwner, "\\", -1)
return ! stringContains (sOwner, "QuickSettings")
endFunction

int Function HandleCustomWindows (handle hWnd)
var
	String sDialogueName,
	Int iControlID = GetControlID (hWnd),
	;Int iWindowType = GetWindowSubtypeCode (hWnd)
	int iWindowType = getObjectSubtypeCode ()

if iWindowType == WT_TREEVIEWITEM then
	let iWindowType = WT_TREEVIEW
endIf
If iControlID == SettingsTreeViewID
&& iWindowType == WT_TREEVIEW then
	If GetWindowClass (hWnd) == WC_SearchTreeList then
		IndicateControlType (WT_LISTBOX, GetWindowName (hWnd), cScSpace)
		SayTreeViewLevel (FALSE)
		Return (TRUE)
	EndIf
	;SayWindowTypeAndText (hWnd)
	IndicateControlType (iWindowType, cscBufferNewLine, cScSpace)
	SayTreeViewLevel (FALSE)
	If GetWindowClass (GlobalPrevFocus) == WC_SearchTreeList then
		;SayUsingVoice (VCTX_MESSAGE, tvGetPathToSelection (hWnd), OT_SELECTED_ITEM)
	EndIf
	Return (TRUE)
EndIf
If iControlID == SearchEditID then
	If hWnd != GlobalPrevFocus
	|| smmTrainingModeActive()
		IndicateControlType (WT_EDIT, GetObjectName(SOURCE_CACHED_DATA), StringSegment (GetObjectDescription(SOURCE_CACHED_DATA), "\13", 1))
	EndIf
	Return (TRUE)
EndIf
If (GetWindowSubTypeCode (GlobalPrevFocus) == WT_TREEVIEW || getWindowClass (GlobalPrevFocus) == wc_Treeview_Main
|| (! IsWindowVisible (GlobalPrevFocus)))
&& IsInDialogueContainer (hWnd) then
	let sDialogueName = GetDialogueContainerWindowName ()
	let sDialogueName = StringSegment (sDialogueName, cScColon, -1)
	IndicateControlType (WT_DIALOG_PAGE, sDialogueName, cScSpace)
EndIf
If iWindowType == WT_BUTTON
&& IsInDialogueContainer (hWnd)
&& ghPressedFromTreeView then
	SpeechOff ()
	Delay (1)
	PostMessage (GetAppMainWindow (hWnd), WM_NEXTDLGCTL, ghPressedFromTreeView, TRUE)
	let ghPressedFromTreeView = Null ()
	Delay (1)
		SpeechOn ()
	Return (TRUE)
EndIf
If iControlID == QuickHelpEditID
;add ResearchIt to the list of windows that moves cursor to top of window as it is also a help multiline:
|| iControlID == QuickHelpEditIDForResearchIt then
	SayWindowTypeAndText (hWnd)
	saveCursor ()
	pcCursor ()
	SayLine ()
	Return (TRUE)
EndIf
Return (HandleCustomWindows (hWnd))
EndFunction

int Function DoChildWindows (handle hWnd)
if getControlID (hwnd) == SearchEditID then
	indicateControlType (getWindowSubtypeCode (hwnd), getWindowClass (hwnd), getWindowText (hwnd, READ_EVERYTHING))
	return TRUE
endIf
return DoChildWindows (hWnd)
endFunction

Void Function NameChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldName, string sNewName)
var
	Int iControlID
if menusActive () || UserBufferIsActive () then
	return NameChangedEvent (hwnd, objId, childId, nObjType, sOldName, sNewName)
endIf
let iControlID = GetControlID (hWnd)
If iControlID == SearchEditID then
	Return
EndIf
NameChangedEvent (hwnd, objId, childId, nObjType, sOldName, sNewName)
EndFunction


Script F6Key ()
var
	Handle hFocus = GetFocus (),
	Handle hDialogueContainer,
	Int iWindowType = GetWindowSubtypeCode (hFocus),
	string sClass = getWindowClass (hFocus)

If (iWindowType == WT_TREEVIEW || sClass == wc_Treeview_Main)
	GetDialogueContainerWindowName (hDialogueContainer)
	If Not GetFirstChild (GetFirstChild (hDialogueContainer))
		SayMessage (OT_STATUS, MSG_PaneEmpty_L, MSG_PaneEmpty_S)
		Return
	EndIf
EndIf
TypeKey (cKsF6)
EndScript

Script UpALevel()
var
	Handle hFocus,
	Int iWindowType,
	Int iControlID,
	string sClass

let hFocus = GetFocus ()
let iControlID = GetControlID (hFocus)
let sClass = getWindowClass (hFocus)
let iWindowType = GetWindowSubtypeCode (hFocus)
If IsPCCursor ()
&& (! UserBufferIsActive ())
&& (! InHJDialog ()) then
/*
	If (iControlID == SettingsTreeViewID
	&& (iWindowType == WT_TREEVIEW) || sClass == wc_Treeview_Main)
	|| iControlID == SearchEditID then
		SayCurrentScriptKeyLabel ()
		SayMessage (OT_JAWS_MESSAGE, MSG_ClearSearchEditBox_L, MSG_ClearSearchEditBox_S)
		TypeCurrentScriptKey ()
		Return
	EndIf
*/
EndIf
PerformScript UpALevel()
EndScript

Script SayLine ()
var
	Handle hFocus = GetFocus (),
	String sPath,
	string sClass = getWindowClass (hFocus),
	Int iControlID = GetControlID (hFocus),
	Int iWindowType = GetWindowSubtypeCode (hFocus),
	Int iAttributes = GetControlAttributes (),
	Int iSameScript = IsSameScript ()
if UserBufferIsActive () || IsVirtualPcCursor () || MenusActive () || ! isPcCursor () then
	performScript Default::SayLine ()
	Return
endIf
If iControlID == SettingsTreeViewID
&& (iWindowType == WT_TREEVIEW || sClass == wc_Treeview_Main) then
	SayTreeViewLevel (FALSE)
	If sClass != WC_SearchTreeList then
		let sPath = tvGetPathToSelection (hFocus)
		let sPath = StringReplaceChars (sPath, LIST_ITEM_SEPARATOR, cScBufferNewLine)
		If StringRight (sPath, 1) == cScBufferNewLine then
			let sPath = stringChopRight (sPath, 1)
		EndIf
		If Not StringIsBlank (sPath)
			SayUsingVoice (VCTX_MESSAGE, sPath, OT_LINE)
		EndIf
	EndIf
	Return
EndIf
If iWindowType == WT_LISTBOX
	If iSameScript then
		SpellLine ()
		Return
	EndIf
	SayLine ()
	Return
EndIf
PerformScript SayLine ()
EndScript

Script ActivateSearchBox ()
var
	Handle hFound

if ! IsPcCursor () then
	performScript SayLine ()
	return
endIf
let hFound = GetFocus ()
let hFound = FindWindowWithClassAndID (GetAppMainWindow (hFound), WC_SearchBox, SearchEditID)
If hFound then
	PostMessage (GetAppMainWindow (hFound), WM_NEXTDLGCTL, hFound, TRUE)
EndIf
EndScript

Int Function BrailleAddObjectType (Int nSubTypeCode)
var
	Handle hFocus,
	Int iControlID

if menusActive () || isVirtualPcCursor () then
	return BrailleAddObjectType (nSubtypeCode)
endIf
let hFocus = GetFocus ()
let iControlID = GetControlID (hFocus)
If iControlID == SettingsTreeViewID
&& nSubTypeCode == WT_TREEVIEW then
	if GetWindowClass (hFocus) == WC_SearchTreeList then
		BrailleAddString (BrailleGetSubtypeString (WT_LISTBOX), 0, 0, 0)
	else
		BrailleAddString (BrailleGetSubtypeString (WT_TREEVIEW), 0, 0, 0)
	endIf
	Return (TRUE)
EndIf
Return (BrailleAddObjectType (nSubTypeCode))
EndFunction

Int Function BrailleAddObjectLevel (Int nSubTypeCode)
var
	Handle hFocus,
	Int iControlID

let hFocus = GetFocus ()
let iControlID = GetControlID (hFocus)
If iControlID == SettingsTreeViewID
&& nSubTypeCode == WT_TREEVIEW then
	if GetWindowClass (hFocus) == WC_SearchTreeList then
		Return (TRUE)
	else
		BrailleAddString (intToString (getTreeViewLevel ()), 0,0,0)
		return TRUE
	endIf
EndIf
Return (BrailleAddObjectLevel (nSubTypeCode))
EndFunction

Int Function BrailleAddObjectPosition (Int nSubTypeCode)
var
	Handle hFocus,
	Int iControlID

let hFocus = GetFocus ()
let iControlID = GetControlID (hFocus)
If iControlID == SettingsTreeViewID
&& nSubTypeCode == WT_TREEVIEW then
	if GetWindowClass (hFocus) == WC_SearchTreeList then
		Return (TRUE)
	else
		BrailleAddString (PositionInGroup (), 0,0,0)
		Return TRUE
	endIf
EndIf
Return (BrailleAddObjectPosition (nSubTypeCode))
EndFunction

int function BrailleAddObjectControlStateInfo (Int nSubTypeCode)
var
	Handle hFocus = GetFocus (),
	Int iControlID = GetControlID (hFocus)
if getControlAttributes () & CTRL_HASCHILDREN then
	return TRUE; add nothing
endIf
If iControlID == SettingsTreeViewID
&& nSubTypeCode == WT_TREEVIEW
;State comes before the name of the control now, and so do not duplicate control name info on the display:
	If ! StringIsBlank (gsBrlTreeViewControlState) then
		BrailleAddString (gsBrlTreeViewControlState, GetCursorCol (), GetCursorRow (), 0, TRUE)
	endIf
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

Int Function BrailleAddObjectControlInfo (Int nSubTypeCode)
var
	int nParent,
	Handle hFocus = GetFocus (),
	Int iControlID = GetControlID (hFocus),
	string sObjectDescription, int iPersistence, string sPersistence;
let sObjectDescription = getObjectDescription(SOURCE_CACHED_DATA)
if ! stringIsBlank (sObjectDescription) then
	let iPersistence = stringToInt (sObjectDescription)
	if iPersistence == IDI_SAVETODISK then
		let nParent = stringToInt (getNodeParentDescription ())
	endIf
	if nParent && nParent != IDI_SETTINGS_NODE then
		iPersistence = nParent
	endIf
	let sPersistence = getPersistenceInfo (iPersistence)
endIf
If iControlID == SettingsTreeViewID
&& nSubTypeCode == WT_TREEVIEW
	If ! gsBrlTreeViewControlState then
		BrailleAddString (gsBrlTreeViewControlName+cscSpace+sPersistence, GetCursorCol (), GetCursorRow (), 0)
	endIf
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

Int Function BrailleAddObjectParentName (Int nSubTypeCode)
var
	Handle hFocus,
	Int iControlID
let hFocus = GetFocus ()
let iControlID = GetControlID (hFocus)
If iControlID == SettingsTreeViewID
&& nSubTypeCode == WT_TREEVIEW then
	BrailleAddString (StringSegment (tvGetPathToSelection (hFocus), LIST_ITEM_SEPARATOR, -1), GetCursorCol (), GetCursorRow (), 0)
	Return (TRUE)
EndIf
Return (BrailleAddObjectParentName (nSubTypeCode))
EndFunction

Int Function BrailleAddObjectName (Int nSubTypeCode)
var
	Handle hFocus,
	Int iControlID
if nSubtypeCode == WT_ContextMenu
	BrailleAddString (GetObjectName(SOURCE_CACHED_DATA),GetCursorCol (),GetCursorRow (),0)
	return true
endIf
if UserBufferIsActive () || IsVirtualPcCursor () || MenusActive () then
	return BrailleAddObjectName (nSubtypeCode)
endIf
let hFocus = GetFocus ()
let iControlID = GetControlID (hFocus)
If iControlID == SearchEditID
&& nSubTypeCode == WT_EDIT then
	BrailleAddString (GetObjectName(SOURCE_CACHED_DATA), 0, 0, 0)
	Return (TRUE)
EndIf
If iControlID == QuickHelpEditID
&& nSubTypeCode == WT_READONLYEDIT then
	BrailleAddString (cScSpace, 0, 0, 0)
	Return (TRUE)
EndIf
If (iControlID == SpeechVerbosityListbox	; Speech verbosity...
|| iControlID == BrailleVerbosityListbox)	; Braille flash message verbosity...
&& nSubTypeCode == WT_LISTBOX
	BrailleAddString (GetObjectName(SOURCE_CACHED_DATA), 0, 0, 0)
	Return (TRUE)
EndIf
If nSubtypeCode == WT_TREEVIEW
&& iControlID == SettingsTreeViewID
&& getWindowClass (hFocus) == wc_Treeview_Main
	return TRUE
endIf
Return (BrailleAddObjectName (nSubTypeCode))
EndFunction

int function BrailleAddObjectValue (int subtypeCode)
if subtypeCode == WT_TREEVIEW || subtypeCode == WT_TREEVIEWITEM then
	if gsBrlTreeViewControlState then ; fix alignment only for controls with custom states.
		BrailleAddString (getObjectName(SOURCE_CACHED_DATA), 0,0,ATTRIB_HIGHLIGHT)
		return TRUE
	endIf
endIf
return BrailleAddObjectValue (subtypeCode)
endFunction

int function BrailleAddObjectState (int iType)
if UserBufferIsActive () || IsVirtualPcCursor () || MenusActive () then
	return BrailleAddObjectState (iType)
endIf
if iType == WT_EDIT && getControlID (getFocus ()) == SearchEditID
&& ! stringIsBlank (gstrBrlResults) then
	BrailleAddString (gstrBrlResults, 0,0,0)
	return TRUE
endIf
if iType != WT_TREEVIEW then
	return BrailleAddObjectState (iType)
endIf
var
	int nControlAttributes = getControlAttributes (),
	string sControlState;
; only care about open and closed states.
;sControlState = BrailleGetStateString (nControlAttributes)
if nControlAttributes & CTRL_EXPANDED || nControlAttributes & CTRL_OPENED || nControlAttributes & CTRL_COLLAPSED || nControlAttributes & CTRL_CLOSED then
	sControlState = BrailleGetStateString (nControlAttributes)
endIf
BrailleAddString (sControlState, 0,0,0, TRUE) ; 
return TRUE
endFunction

void function sayHighlightedText (handle hwnd, string buffer)
if (dialogActive () && hwnd != getFocus ())
	return;prevent extra speech, especially if returning from user buffer.
endIf
return sayHighlightedText (hwnd, buffer)
endFunction

string function FindHotKey(optional string ByRef sPrompt)
var
	handle hFocus = GetFocus (),
	int iObjectType = GetObjectSubtypeCode(),
	Int iControlID = GetControlID (hFocus)

If iObjectType == WT_EDIT
&& iControlID == SearchEditID
	sPrompt = GetObjectName(SOURCE_CACHED_DATA)
	Return (GetScriptKeyName (SN_ActivateSearchBox))
EndIf
If GetMenuMode () == MENU_ACTIVE
&& GetObjectSubTypeCode(SOURCE_CACHED_DATA, 1) == WT_MENUBAR
	sPrompt = GetObjectName(SOURCE_CACHED_DATA)
	Return (KS_SystemMenu)
EndIf
Return (FindHotKey(sPrompt))
EndFunction

string function FormatTreeViewPaneScreenSensitiveHelpMessage(string sControlHelp)
return FormatString(sshmsg_TreeViewPaneDisplayFormat,
	sControlHelp,
	FormatString(sshmsg_GeneralHelp,GetScriptKeyName("ScreenSensitiveHelp")))
EndFunction

void Function ScreenSensitiveHelpForKnownClasses (int nSubTypeCode)
var
	Handle hFocus = GetFocus (),
	Handle hDialogue,
	String sClass = GetWindowClass (hFocus),
	Int iControlID = GetControlID (hFocus),
	Int iWindowType = GetWindowSubtypeCode (hFocus),
	string sMessage ; ensure we have a valid string before showing to buffer:

If nSubTypeCode == WT_CHECKBOX && getControlID (getFocus ()) == 10025 then
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpQuickSettingsCheckBox)
EndIf
If IsInControlPane (hFocus)
	If IsInDialogueContainer (hFocus)
		GetDialogueContainerWindowName (hDialogue)
		hDialogue = GetFirstChild (hDialogue)
	Else
		hDialogue = GetRealWindow (hFocus)
	EndIf
	sMessage = GetSettingsCenterControlHelp (hDialogue, hFocus)
	If (! stringIsBlank (sMessage))
		ShowScreenSensitiveHelp (sMessage)
	Else
		ScreenSensitiveHelpForKnownClasses (nSubTypeCode)
	EndIf
Else	; we are not in the control containing area that is handled internally...
	If iControlID == SettingsTreeViewID
		If sClass == WC_SearchTreeList
			ShowScreenSensitiveHelp(FormatTreeViewPaneScreenSensitiveHelpMessage(sshmSG_SearchResultsList))
		Else
			ShowScreenSensitiveHelp(FormatTreeViewPaneScreenSensitiveHelpMessage(sshmsg_treeview))
		EndIf

/* Debug
var
	Int iMessage = RegisterWindowMessage (MN_HighlightedControl),
	Variant hWnd = SendMessage (GetAppMainWindow (GetFocus ()), iMessage)
		GetDialogueContainerWindowName (hDialogue)
SayInteger(hDialogue)
EndDebug */



	ElIf iControlID == QuickHelpEditID
		ShowScreenSensitiveHelp(FormatTreeViewPaneScreenSensitiveHelpMessage(
			FormatString(sshmsg_QuickHelpReadOnlyEdit,GetScriptKeyName("SayAll"))))
	ElIf iControlID == SearchEditID
		ShowScreenSensitiveHelp(FormatTreeViewPaneScreenSensitiveHelpMessage(sshmsg_SearchEdit))
	ElIf iControlID == ApplicationSelectionComboID
		ShowScreenSensitiveHelp(FormatTreeViewPaneScreenSensitiveHelpMessage(
			FormatString(sshmsg_ApplicationComboBox,GetScriptKeyName("SayWindowTitle"))))
	ElIf iControlID == OkButtonID
		ShowScreenSensitiveHelp(FormatTreeViewPaneScreenSensitiveHelpMessage(sshmsg_OKButton))
	ElIf iControlID == CancelButtonID
		ShowScreenSensitiveHelp(FormatTreeViewPaneScreenSensitiveHelpMessage(sshmsg_CancelButton))
	ElIf iControlID == ApplyButtonID
		ShowScreenSensitiveHelp(FormatTreeViewPaneScreenSensitiveHelpMessage(sshmsg_ApplyButton))
	EndIf
EndIf
EndFunction

String Function GetDefaultButtonName ()
var
	Handle hFocus = GetFocus (),
	Int iControlID = GetControlID (hFocus)

If iControlID == SearchEditID
|| iControlID == SettingsTreeViewID then
	Return (cScNull)
EndIf
Return (GetDefaultButtonName ())
EndFunction

Script NextDocumentWindow ()
var
	Handle hSearchTree,
	Handle hFocus,
	Int iMessage

let hFocus = GetFocus ()
If IsInDialogueContainer (hFocus) then
	let hSearchTree = FindWindowWithClassAndId (GetAppMainWindow (hFocus), WC_SearchTreeList, SettingsTreeViewID)
	If hSearchTree
	&& IsWindowVisible (hSearchTree) then
		SayMessage (OT_ERROR, MSG_SearchBoxIsNotEmpty_L, MSG_SearchBoxIsNotEmpty_S)
		Return
	EndIf
	let iMessage = RegisterWindowMessage (MN_ChangePage)
	PostMessage (GetAppMainWindow (hFocus), iMessage)
	Return
EndIf
PerformScript NextDocumentWindow()
EndScript

Script PreviousDocumentWindow ()
var
	Handle hSearchTree,
	Handle hFocus,
	Int iMessage

let hFocus = GetFocus ()
If IsInDialogueContainer (hFocus) then
	let hSearchTree = FindWindowWithClassAndId (GetAppMainWindow (hFocus), WC_SearchTreeList, SettingsTreeViewID)
	If hSearchTree
	&& IsWindowVisible (hSearchTree) then
		SayMessage (OT_ERROR, MSG_SearchBoxIsNotEmpty_L, MSG_SearchBoxIsNotEmpty_S)
		Return
	EndIf
	let iMessage = RegisterWindowMessage (MN_ChangePage)
	PostMessage (GetAppMainWindow (hFocus), iMessage, TRUE)
	Return
EndIf
PerformScript PreviousDocumentWindow()
EndScript

Script ChangeToDefault ()
var
	Handle hMain,
	Int iMessage

let hMain = GetAppMainWindow (GetFocus ())
let iMessage = RegisterWindowMessage (MN_ChangeToDefault)
PostMessage (hMain, iMessage, TRUE)
MSAARefresh ()
Delay (2)
Say (GetWindowName (hMain), OT_DIALOG_NAME)
EndScript

Script CopySelectedTextToClipboard ()
var
	String sResult,
	Handle hFocus = GetFocus (),
	Int iWindowType = GetWindowSubtypeCode (hFocus),
	string sClass = getWindowClass (hFocus)
if !(GetRunningFSProducts() & product_JAWS) then
	SayCurrentScriptKeyLabel()
	return
endIf
If (iWindowType == WT_TREEVIEW || sClass == wc_Treeview_Main)
	sResult = tvGetPathToSelection (hFocus) + GetObjectName(SOURCE_CACHED_DATA)
	sResult = StringReplaceChars (sResult, LIST_ITEM_SEPARATOR, cScDoubleBackSlash)
	CopyToClipboard (sResult)
	SayMessage (OT_JAWS_MESSAGE, cmsg52_L, cmsg52_S)
	Return
EndIf
PerformScript CopySelectedTextToClipboard()
EndScript

Script SayCurrentAccessKey()
var
	string sHotKey,
	string sPrompt

sHotKey = FindHotKey(sPrompt)
If sHotKey
	SayMessage(ot_help, FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_L, sPrompt, sHotKey), FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_S, sPrompt, sHotKey))
Else
	SayFormattedMessage (ot_error, cmsg124_L) ;"no hot key"
EndIf
EndScript

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,optional int bIsFocusObject)
if menusActive () then
	return ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue, bIsFocusObject)
endIf
If GetControlID (GetFocus ()) == ApplicationSelectionComboID
&& GetCurrentScriptKeyName () == GetScriptKeyName ("ChangeToDefault")
	Return	; suppressing on pressing the Control+Shift+D...
EndIf

; Call default...
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

void function SayLineUnit(int unitMovement,optional  int bMoved)
var
	Handle hFocus = GetFocus (),
	Int iWindowType = GetWindowSubtypeCode (hFocus)
if userBufferIsActive () || menusActive () || isVirtualPcCursor () then
	return SayLineUnit (unitMovement, bMoved)
endIf
If IsPCCursor ()
&& IsInDialogueContainer (hFocus)
	; to avoid double announcement of checkboxes in the right hand pane....
	If iWindowType == WT_CHECKBOX
		Return
	EndIf
EndIf
;For Windows 8, where this function gets called when it shouldn't:
If iWindowType == WT_TREEVIEW 
&& unitMovement then
	return
endIf
SayLineUnit (unitMovement, bMoved)
EndFunction

string function GetCustomTutorMessage()
var
	Handle hFocus = GetFocus (),
	String sClass = GetWindowClass (hFocus),
	Int iControlID = GetControlID (hFocus)

If iControlID == SettingsTreeViewID
&& sClass == WC_SearchTreeList
	Return(msgExecListBox)
EndIf
EndFunction

;For Word and Outlook when QuickSettings is on top:
script CenterText ()
performScript ActivateSearchBox ()
endScript
;EndFor Word and Outlook when QuickSettings is on top

Script CenterTextButton ()
performScript ActivateSearchBox ()
endScript

script QuickSettings ()
;Do not respond until QuickSettings dialog is fully unloaded.
;Otherwise, if the user pushes the key a second time before the dialog has fully disappeared, there will be a unknown Script call.
endScript

Script SayPriorLine ()
if ! IsPcCursor () then
	BuiltIn::PriorLine ()
	BuiltIn::SayLine ()
		return
endIf
PerformScript SayPriorLine ()
endScript

Script SayNextLine ()
if ! IsPcCursor () then
	BuiltIn::NextLine ()
	BuiltIn::SayLine ()
		return
endIf
PerformScript SayNextLine ()
endScript

void function BrailleRoutingButton(int nCell, optional int routingType)
var
	int iType = GetObjectSubTypeCode(),
	int iState = GetObjectMSAAState ()
if iType == WT_TREEVIEWITEM
&& !(iState&STATE_SYSTEM_EXPANDED)
&& !(iState&STATE_SYSTEM_COLLAPSED)
	TypeKey (cksSpace)
	return
endIf
BrailleRoutingButton(nCell, routingType)
endFunction

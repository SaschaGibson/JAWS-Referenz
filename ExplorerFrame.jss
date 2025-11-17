;Copyright 1995-2017 Freedom Scientific, Inc.
;Freedom Scientific script file for Windows Explorer.

include "HJConst.jsh"
include "HJGlobal.jsh"
include "MSAAConst.jsh"
include "UIA.jsh"
include "Common.jsm"
include "IE.jsm"
include "ExplorerFrame.jsm"
import "UIA.jsd"


const
	eventFunctionPrefix = "ExplorerFrameUIA",
	cwc_SHBrowseForFolder_ShellNameSpace = "SHBrowseForFolder ShellNameSpace Control"

;For program association list in Windows 10:
const
;Automation id's:
	aid_AssocListView = "AssocListView",
;for scheduling speech after navigating when no event occurs:
	SayWin8ProgramAssociationListItem_WaitTime = 5 ;allow time for the event before forcing the announcement
globals
	string gsPrevFolderName,
	int giSuppressTutor,
;for scheduling speech when no event occurs:
	int ScheduledSayWin8ProgramAssociationListItem,
;cached data for the list item:
	collection c_Win8ProgAssListItem
		; Cached information for Windows 10 program association list.
		; Data is obtained for speech and saved to be used by braille
		; Note that although name, description and current default item columns all have headers,
		; only the header of the current default column is spoken or shown in braille.
		;
		; Members:
		; State -- The check state of the item (text list item only)
		; Name -- The name of the item if on a text list item, or name of the group for group item
		; Desc -- The description of the item if on a text list item,
		;		or UIA localized control type if on a group
		; CurDefHdr -- The header of the current default column (text list item only)
		; CurDef -- The current default of the item (text list item only)

GLOBALS
; selection collection.
;Members:
	; listElement: the focused list
	; whose automationEvent monitored on SelectionItemAddedToSelection and selectionItemRemovedFromSelection
	; treewalker: the treewalker used to determine if in the correct location
	; prevSelection: the previous selection, prevents doubling up when items are selected.
	; PrevEventID: the event ID of previous selection prevent silencing of selecting and then deselecting same item
	collection selectionFromUIA,
	object FSUIASelection


int function IsMetroApp ()
return FALSE
endFunction

void function AutoFinishEvent()
c_Win8ProgAssListItem = Null()
ComRelease (FSUIASelection)
FSUIASelection = null ()
collectionRemoveAll (selectionFromUIA)
selectionFromUIA = null ()
EndFunction

int function MenuProcessedOnFocusChangedEventEx(handle hwndFocus,handle hwndPrevFocus,int nType,int nChangeDepth)
if MENU_INACTIVE != GetMenuMode () then
	let GlobalFocusWindow = hwndPrevFocus
	;the virtual ribbon block must come before the block enumerating the types of controls to process:
	if IsVirtualRibbonActive() then
		SayVirtualRibbonItem()
		return true
	EndIf
	If nType == WT_BUTTONDROPDOWNGRID
	|| nType == WT_CHECKBOX then
		SayObjectTypeAndText () ; nChangeDepth is too high.
		return TRUE
	EndIf
endIf
if RibbonsActive () == LowerRibbon_ACTIVE
&& nChangeDepth == -1
	QueueFunction ("TutorMessageEvent (hwndFocus, MENU_ACTIVE)")
endIf
return MenuProcessedOnFocusChangedEventEx(hwndFocus,hwndPrevFocus,nType,nChangeDepth)
endFunction

void function ConfigurationChangedEvent(string newConfiguration)
LoadNonJCFOptions ()
ConfigurationChangedEvent(newConfiguration)
EndFunction

int function IsViewSliderControl()
return GetObjectSubtypeCode() == WT_UPDOWNSLIDER
	&& GetObjectName(SOURCE_CACHED_DATA,1) == objn_ViewSliderControl
EndFunction

int function IsViewSliderControlAtViewLabel()
;The object's cached MSAA value is the percentage.
;By using the updated value, we determine if the slider is at a view label.
return IsViewSliderControl()
	&& !StringContainsChars(GetObjectValue(SOURCE_CACHED_DATA),"0123456789")
EndFunction

int function IsWin8ProgramAssociationList()
if !IsWindows8()
|| UserBufferIsActive()
|| GlobalMenuMode
|| GetWindowClass(GetFocus()) != cWcListView
	return false
endIf
var object treeWalker = CreateUIATreeWalkerForFocusProcessId(Null(),true)
while treeWalker.gotoParent()
	if treeWalker.currentElement.controlType == UIA_ListControlTypeID
	&& treeWalker.currentElement.automationID == aid_AssocListView
		return true
	endIf
endWhile
return false
EndFunction

int function IsWin8ProgramAssociationListGroupHeader()
if !IsWin8ProgramAssociationList() return false endIf
var object element = CreateUIAFocusElement(true)
return element.controlType == UIA_GroupControlTypeID
EndFunction

string function GetWin8ProgramAssociationListViewName()
var object treeWalker = CreateUIATreeWalkerForFocusProcessId(Null(),true)
while treeWalker.gotoParent()
	if treeWalker.currentElement.controlType == UIA_ListControlTypeID
	&& treeWalker.currentElement.automationID == aid_AssocListView
		return treeWalker.currentElement.name
	endIf
endWhile
return cscNull
EndFunction

int function GetWin8ProgramAssociationListItem()
if !c_Win8ProgAssListItem
	c_Win8ProgAssListItem = new collection
else
	CollectionRemoveAll(c_Win8ProgAssListItem)
endIf
var object treeWalker = CreateUIATreeWalkerForFocusProcessId(Null(),true)
if !treeWalker return false endIf
if treeWalker.currentElement.controlType == UIA_GroupControlTypeId
	c_Win8ProgAssListItem.name = treeWalker.currentElement.name
	c_Win8ProgAssListItem.desc = treeWalker.currentElement.localizedControlType
	return true
endIf
;get data for the checkable list item:
if treeWalker.currentElement.controlType != UIA_TextControlTypeId return false endIf
treeWalker.gotoParent()
if treeWalker.currentElement.controlType != UIA_ListItemControlTypeId return false endIf
var object pattern = treeWalker.currentElement.GetTogglePattern()
c_Win8ProgAssListItem.state = pattern.ToggleState
treeWalker.gotoFirstChild()
c_Win8ProgAssListItem.name = treeWalker.currentElement.name
treeWalker.gotoNextSibling()
c_Win8ProgAssListItem.desc = treeWalker.currentElement.name
treeWalker.gotoNextSibling()
c_Win8ProgAssListItem.curDef = treeWalker.currentElement.name
pattern = treeWalker.currentElement.GetTableItemPattern().GetColumnHeaderItems()
c_Win8ProgAssListItem.curDefHdr = pattern(0).name
return true
EndFunction

int function SayWin8ProgramAssociationListItem()
ScheduledSayWin8ProgramAssociationListItem = 0
if !GetWin8ProgramAssociationListItem() return false endIf
if CollectionItemExists(c_Win8ProgAssListItem,"state")
	if c_Win8ProgAssListItem.state
		IndicateControlState(wt_ListItem,CTRL_CHECKED)
	else
		IndicateControlState(wt_ListItem,CTRL_UNCHECKED)
	endIf
endIf
Say(c_Win8ProgAssListItem.name,ot_line)
SayUsingVoice(vctx_message,c_Win8ProgAssListItem.desc,ot_screen_message)
if CollectionItemExists(c_Win8ProgAssListItem,"curDef")
	SayUsingVoice(vctx_message,c_Win8ProgAssListItem.curDefHdr,ot_screen_message)
	SayUsingVoice(vctx_message,c_Win8ProgAssListItem.curDef,ot_screen_message)
endIf
return true
EndFunction

void function SayObjectActiveItem(optional int bAnnouncePosition)
if IsWin8ProgramAssociationList()
	if ScheduledSayWin8ProgramAssociationListItem
		UnscheduleFunction(ScheduledSayWin8ProgramAssociationListItem)
		ScheduledSayWin8ProgramAssociationListItem = 0
	endIf
	if SayWin8ProgramAssociationListItem()
		if bAnnouncePosition
		&& !IsWin8ProgramAssociationListGroupHeader()
			Say(PositionInGroup(),ot_position)
		endIf
		return
	endIf
endIf
SayObjectActiveItem(bAnnouncePosition)
EndFunction

int Function ShouldSpeakFolderName(handle FocusWindow, handle PrevWindow)
if FocusWindow != PrevWindow
	var string sFolderName = GetWindowName (GetAppMainWindow (FocusWindow))
	if sFolderName != gsPrevFolderName
		gsPrevFolderName = sFolderName
		return true
	endIf
endIf
return false
EndFunction

void function ProcessEventOnFocusChangedEvent(handle AppWindow, handle RealWindow, string RealWindowName,
	handle FocusWindow, handle PrevWindow)
if GetWindowClass(FocusWindow) == cwc_DirectUIHWND then
	InitializeSelectionFromUIA ()
	FocusChangedEventProcessAncestors(FocusWindow, PrevWindow)
	return
EndIf
ProcessEventOnFocusChangedEvent(AppWindow, RealWindow, RealWindowName, FocusWindow, PrevWindow)
EndFunction

void Function FocusChangedEventProcessAncestors (handle FocusWindow, handle PrevWindow)
var
	int nLevel,
	int iType,
	int nChangeDepth,
	int earlyReturnNum = 0
let nChangeDepth = GetFocusChangeDepth()
InitializeSelectionFromUIA ()
let nLevel = nChangeDepth
if nLevel == 0 then
	if GetWindowClass(FocusWindow) == cwc_DirectUIhWNd
	&& GetObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_GROUPBOX then
		if !GetObjectName(SOURCE_CACHED_DATA) then
			;this scenario can be seen in the Computer list of Windows 7.
			;the name of the group is at the next higher level.
			SayObjectTypeAndText(1)
			SayObjectTypeAndText(0)
			return
		EndIf
	EndIf
EndIf
while nLevel >= 0
	let iType = GetObjectSubtypecode(SOURCE_CACHED_DATA,nLevel)
	if (nLevel == nChangeDepth && GetTopLevelWindow(FocusWindow) != GetTopLevelWindow(PrevWindow))
	|| ShouldSpeakFolderName(FocusWindow, PrevWindow)
	|| (iType && iType != wt_Dialog_Page)
	|| nLevel <= 0 then
	if nLevel == 0
	&& IsEmptyFolder()
		;If the folder just entered isn't actually empty,
		;there will be a second focus change which will cancel the scheduled function.
		ScheduleFunction ("AnnounceEmptyFolder", 5, true)
		giSuppressTutor = true
		return
	endIf
		sayObjectTypeAndText(nLevel)
		if nLevel == 1
&& iType == WT_LISTBOXITEM
&& GetObjectName(false, 3) == cwn_ShellFolderView
		;break out of loop early to prevent extra speaking when navigating up or down a column
			nLevel = earlyReturnNum
		endIf
	EndIf
	let nLevel= nLevel-1
EndWhile
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd,
	string sClass,
	int iState,
	int iSubtype,
	handle hPriorWnd
hWnd = GetCurrentWindow()
sClass = GetWindowClass(hWnd)
iSubtype = GetObjectSubtypeCode()
if sClass == cwc_SysTreeView32 then
	if GetWindowName(hWnd) == GetWindowType(hWnd) then
		;announce the control, but without the name since this will sound like a double-speak of the type:
		IndicateControlType(wt_TreeView,cMsgSilent,cMsgSilent)
		SayMessage (OT_POSITION,FormatString (cmsg233_L,IntToString (GetTreeviewLevel())))
		SayLine ()
		return
	EndIf
EndIf
if nLevel == 0
	if IsViewSliderControlAtViewLabel()
		IndicateControlType(wt_UpDownSlider,GetObjectValue(SOURCE_CACHED_DATA),cscNull)
		return
	endIf
	if iSubtype == wt_comboBox
		if SayNotificationsAreaIconsListItem()
			return
		endIf
	endIf
	if IsWin8ProgramAssociationList()
		IndicateControlType(wt_ListView,GetWin8ProgramAssociationListViewName(),cmsgSilent)
		SayObjectActiveItem(true)
		return
	endIf
	if iSubtype == wt_tabControl
		IndicateControlType(WT_tabControl, GetObjectName())
		if GetObjectMSAAState() & STATE_SYSTEM_SELECTED
			IndicateControlState (WT_tabControl, CTRL_SELECTED)
		endIf
		Say(PositionInGroup (), OT_POSITION)
		return
	endIf
endIf
if nLevel == 1
&& iSubtype == WT_STATIC
&& GetObjectName(false, 3) == cwn_ShellFolderView
Say (GetObjectValue (), OT_LINE)
return
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
if nLevel == 0
	var string sHelp = GetObjectHelp ()
	var string sName = GetObjectName ()
	if !StringIsBlank(sHelp)
	&& !StringContainsCaseInsensitive (sName, sHelp)
	&& !StringContainsCaseInsensitive (sHelp, sName)
		Say (sHelp, OT_HELP)
	endIf
endIf
EndFunction

int function HandleCustomAppWindows(handle AppWindow)
var
	handle hTemp,
	int SavedIncludeGraphicsSetting
if getWindowClass(AppWindow) == cWc_dlg32770
&& IsWindows7() then
	let hTemp = FindWindow(AppWindow,cwc_SysLink)
	if hTemp
	&& IsWindowVisible(hTemp)
	&& GetParent(hTemp) == AppWindow then
		;First announce the dialog,
		;then traverse the windows speaking static text and syslink class windows:
		IndicateControlType(wt_dialog,GetWindowName(AppWindow),cmsgSilent)
		let hTemp = GetFirstWindow(hTemp)
		let SavedIncludeGraphicsSetting = GetJCFOption(OPT_INCLUDE_GRAPHICS)
		SetJCFOption(OPT_INCLUDE_GRAPHICS,0)
		while hTemp
			if IsWindowVisible(hTemp)
			&& (GetWindowSubtypeCode(hTemp) == wt_static || GetWindowClass(hTemp) == cwc_SysLink) then
				Say(GetWindowName(hTemp),ot_dialog_text)
			EndIf
			let hTemp = GetNextWindow(hTemp)
		EndWhile
		SetJCFOption(OPT_INCLUDE_GRAPHICS,SavedIncludeGraphicsSetting)
		return true
	EndIf
EndIf
return HandleCustomAppWindows(AppWindow)
EndFunction

int function HandleCustomRealWindows(handle RealWindow)
var
	handle hChild
if GetWindowClass(RealWindow) == cwc_SHBrowseForFolder_ShellNameSpace then
	let hChild = GetFirstchild(RealWindow)
	if GetWindowSubtypeCode(hChild) == wt_Static
	&& !IsWindowVisible(hchild) then
		return true
	EndIf
elif GetWindowClass(GlobalPrevReal) == cwc_SHBrowseForFolder_ShellNameSpace
&& IsDescendedFromWindow(RealWindow,GlobalPrevReal) then
	return true
EndIf
return HandleCustomRealWindows(RealWindow)
EndFunction

void Function SayHighLightedText (handle hwnd, string buffer)
var
	handle hWndTop,
	handle hWndForeground
let hWndTop = getTopLevelWindow(hWnd)
let hWndForeground = GetForegroundWindow()
if hWndForeground != hWndTop
&& IsWindowDisabled(hWndTop) then
	if GetScreenEcho() < ECHO_ALL then
		return
	EndIf
EndIf
SayHighLightedText(hwnd,buffer)
EndFunction

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName, handle FocusWindow)
InitializeSelectionFromUIA ()
;Windows 7, edit or rename a file name in windows explorer and when you backspace over text JAWS is announcing extraneous text:
IF IsWindows7()
&& getObjectSubtypeCode() == wt_Edit
&& getObjectSubtypeCode(SOURCE_CACHED_DATA,1) == WT_LISTBOX
&& getFocusChangeDepth() == 0
&& CaretVisible() then
	return
endif
if IsViewSliderControl()
	SayObjectTypeAndText()
	return
endIf
self::ProcessSayFocusWindowOnFocusChange(RealWindowName, FocusWindow)
EndFunction

void function SayFocusAfterExitUserBuffer()
if IsPCCursor()
&& IsViewSliderControl()
	SayObjectTypeAndText()
	return
endIf
SayFocusAfterExitUserBuffer()
EndFunction

void function SayLineUnit(int unitMovement,optional  int bMoved)
if IsPCCursor()
	if IsViewSliderControl()
		;ValueChangedEvent speak this slider:
		return
	endIf
	;In the list for setting program associations in Windows 10,
	;no event is received when navigating the list and selection moves to a group item:
	if IsWin8ProgramAssociationListGroupHeader()
		SayObjectActiveItem()
		return
	endIf
endIf
SayLineUnit(unitMovement,bMoved)
EndFunction

void function SayWordUnit(int UnitMovement)
if IsPCCursor()
&& IsViewSliderControl()
	;ValueChangedEvent speak this slider:
	return
endIf
SayWordUnit(UnitMovement)
EndFunction

void function SayCharacterUnit(int UnitMovement)
if IsPCCursor()
&& IsViewSliderControl()
	;ValueChangedEvent speak this slider:
	return
endIf
SayCharacterUnit(UnitMovement)
EndFunction

void function SpeakHomeEndMovement()
if IsPCCursor()
&& IsViewSliderControl()
	;ValueChangedEvent speak this slider:
	return
endIf
SpeakHomeEndMovement()
EndFunction

void function SayPageUpDownUnit(int UnitMovement)
if IsPCCursor()
&& IsViewSliderControl()
	;ValueChangedEvent speak this slider:
	return
endIf
SayPageUpDownUnit(UnitMovement)
EndFunction

void function InitializeSelectionFromUIA ()
if(!isWindows8()) return endif
var int subtype = getObjectSubtypeCode(SOURCE_CACHED_DATA)
if (subtype != WT_LISTBOXITEM && subtype != WT_GROUPBOX && subtype != WT_ROWHEADER) return endIf
if (! FSUIASelection)
	FSUIASelection = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
	if ! comAttachEvents (FSUIASelection, EventFunctionPrefix)
		FSUIASelection = null ()
		return
	endIf
endIf
if (! FSUIASelection) return endIf

var object treewalker = FSUIASelection.RawViewWalker()
if (! treewalker) return endIf
var object element = FSUIASelection.GetFocusedElement().buildUpdatedCache()
if (! element) return endIf
;if element.ControlType != UIA_ListItemControlTypeId
; or the computer list in Windows 7:
;&& element.ControlType != UIA_GroupControlTypeId then
; far too many UIA types including custom, so using object subtypeCode above instead:
	;return
;endIf
treewalker.currentElement = element
while (treewalker.gotoParent() && treewalker.CurrentElement.controlType != UIA_ListControlTypeId) endWhile
element = treewalker.CurrentElement.buildUpdatedCache()
if (element.controlType != UIA_ListControlTypeId) return endIf
if ! FSUIASelection.AddAutomationEventHandler( UIA_SelectionItem_ElementAddedToSelectionEventId, Element, TREESCOPE_SUBTREE)
|| ! FSUIASelection.AddAutomationEventHandler( UIA_SelectionItem_ElementRemovedFromSelectionEventId, Element, TREESCOPE_SUBTREE) then
	return
endIf
if (! selectionFromUIA) selectionFromUIA = new collection endIf
selectionFromUIA.listElement = element
selectionFromUIA.treewalker = treewalker
endFunction

void function ExplorerFrameUIAAutomationEvent (object element, int eventID)
if(!isWindows8()) return endif
if eventID != UIA_SelectionItem_ElementAddedToSelectionEventId
&& eventID != UIA_SelectionItem_ElementRemovedFromSelectionEventId then
	return
endIf
; e.g. scripts including home and end
var string scriptName = getScriptAssignedTo (getCurrentScriptKeyName ())
if stringstartsWith (scriptName, "SelectFrom")
|| stringStartsWith (scriptName, "SelectTo")
|| scriptName == "SelectCurrentItem" then
; cases where automationEvent would give the wrong information,
; but objStateChangedEvent or SelectingText would do it correctly:
	return
endIf
if ! stringStartsWith (scriptName, "select") then
; item was unselected by user moving with just arrows,
; don't speak from here but from focusChangedEventEX:
	return
endIf
var string selection = element.name, int length = stringLength (selection)
if ! stringIsBlank (selectionFromUIA.prevSelection)
&& stringCompare (selection, selectionFromUIA.prevSelection) == 0
&& eventID == selectionFromUIA.PrevEventID then
; multiple firings of automationEvent for same ID,
; but still speak if user selected and then deselected the same item:
	return
endIf
var object treewalker = selectionFromUIA.treewalker
treewalker.currentElement = element
while (treewalker.gotoParent() && treewalker.currentElement.controlType != UIA_ListControlTypeID) endWhile
var object listElement = selectionFromUIA.listElement
element = treewalker.currentElement
;if selectionFromUIA.CompareElements(element,listElement) != UIATrue then
if element.controlType != UIA_ListControlTypeId then
; not the files list:
	return
endIf
if eventID == UIA_SelectionItem_ElementRemovedFromSelectionEventId then
nSelectingText = TRUE
	SayTextSelection(cmsg214_L, selection, length == 1)
elIf eventID == UIA_SelectionItem_ElementAddedToSelectionEventId then
nSelectingText = TRUE
	SayTextSelection(cmsg215_L, selection, length == 1)
endIf
selectionFromUIA.prevSelection = selection
selectionFromUIA.PrevEventID = eventID
delay (1)
nSelectingText = FALSE
endFunction

Void Function SelectingText(int nMode)
if(!isWindows8())  then
	return SelectingText(nMode)
endIf
if SayCursorMovementException(0) return SelectingText(nMode) endIf
if getWindowClass (getFocus ()) != cwc_DirectUIhWND
|| getObjectSubtypeCode(SOURCE_CACHED_DATA) != WT_LISTBOXITEM then
	return SelectingText(nMode)
endIf
; only do the default behavior for selectfrom* and selectTo* scripts,
; e.g. scripts including home and end
var string scriptName = getScriptAssignedTo (getCurrentScriptKeyName ())
if stringstartsWith (scriptName, "SelectFrom")
|| stringStartsWith (scriptName, "SelectTo") then
	return SelectingText(nMode)
endIf
endFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType,
	string sObjName, string sObjValue,optional int bIsFocusObject)
if bIsFocusObject
	if IsViewSliderControl()
		if IsViewSliderControlAtViewLabel()
			;the value parameter received is the percentage,
			;but speak the view label instead.
			;Updated MSAA must be used to get the label.
			Say(GetObjectValue(SOURCE_CACHED_DATA),ot_line)
		else ;speak the percentage value:
			Say(sObjValue,ot_line)
		EndIf
		return
	endIf
endIf
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

void function ObjStateChangedEvent(handle hObj, int iObjType, int nChangedState, int nState, int nOldState)
if hObj == GetFocus()
&& !nSelectingText
&& !InHJDialog()
&& (iObjType == WT_TREEVIEW || iObjType == WT_TREEVIEWITEM)
&& StringCompare(GetWindowName(GetTopLevelWindow(hObj)),cwn_Windows7_FolderOptions) == 0 then
	;FocusChangedEventEx will catch this one
	return
EndIf
if IsWin8ProgramAssociationList()
	var object element = CreateUIAFocusElement(true)
	if element.controlType == UIA_GroupControlTypeId
		;Suppress announcement of a new list item check status when navigating in this list moves to a group control in the list:
		return
	else ;Update cache and braille:
		c_Win8ProgAssListItem.state = (nState & CTRL_CHECKED)
		BrailleRefresh()
	endIf
endIf
if iObjType == wt_ListBoxItem
&& (GetObjectName(false, 2) == cwn_ShellFolderView;folders not using group by
|| GetObjectName(false, 3) == cwn_ShellFolderView);folders using group by
	var object oFocus = FSUIAGetFocusedElement ()
	if oFocus.GetTogglePattern();for when item check boxes are shown
		UIARefresh(false);needed for braille check box indicators to be displayed accurately
		if nChangedState == nState
		&& !nOldState
			;eliminate erroneous speaking of not selected when selecting with CTRL+SPACE
			return
		endIf
	else;item check boxes are not shown
		var int iSelected = oFocus.GetSelectionItemPattern().isSelected
		if !iSelected
			Say(cscNotSelected, ot_item_state)
			Say(oFocus.name,ot_line, lvIsCustomized (hObj))
			return
		endIf
	endIf
endIf
if ( (iObjType == wt_ListBoxItem) && (nChangedState & CTRL_SELECTED) && !(nOldState & CTRL_SELECTED) )
	IndicateControlState(iObjType, nChangedState)
	return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if GetObjectSubtypeCode () == WT_ListBoxItem
&& GetObjectName(false, 3) == cwn_ShellFolderView;lists that are using group by
	var
		object oFocus = FSUIAGetFocusedElement (),
		int iObjState = GetObjectStateCode()
	if !oFocus.GetSelectionItemPattern().isSelected
		;In folders not using group by, "not selected" is not part of the object name, so need to speak it explicitly
		Say(cscNotSelected, ot_item_state)
	endIf
	say(oFocus.name,ot_line)
	if (iObjState & ctrl_checked)
		IndicateControlState(wt_checkbox, ctrl_checked)
	elif (iObjState & ctrl_unchecked)
		IndicateControlState(wt_checkbox, ctrl_unchecked)
	endIf
	if ShouldItemSpeak(OT_ANNOUNCE_POSITION_AND_COUNT) then
		SayMessage(OT_POSITION, PositionInGroup())
	endIf
	return
endIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

int function InNotificationsAreaIconsConfigurationDialog()
var
	string sWinName = GetWindowName(GetTopLevelWindow(GetFocus()))
return StringSegment(sWinName,"\\",-1)  == wn_NotificationAreaIcons
EndFunction

string function GetNotificationsAreaIconsListItemName()
var
	object treeWalker,
	string name,
	string caption,
	string prompt
treeWalker = CreateUIARawViewTreeWalker(true)
if !treeWalker return cscNull endIf
if treeWalker.GoToPriorSibling()
	if treeWalker.currentElement.automationID == "listitem_caption"
		caption = treeWalker.currentElement.name
	endIf
	if treeWalker.GoToPriorSibling()
		if treeWalker.currentElement.automationID == "listitem_name"
			name = treeWalker.currentElement.helpText
		endIf
	endIf
endIf
if !name && !caption return cscNull endIf
if name
	prompt = name
else
	prompt = caption
endIf
if  name
&& caption
	if StringStartsWith(caption,name)
		prompt = caption
	elif caption != name
		prompt = Name+cscSpace+caption
	endIf
endIf
return prompt
EndFunction

int function SayNotificationsAreaIconsListItem()
var
	string prompt
if !InNotificationsAreaIconsConfigurationDialog()
|| GetObjectSubtypecode() != wt_comboBox
	return false
endIf
prompt = GetNotificationsAreaIconsListItemName()
if !prompt return false endIf
IndicateControlType(wt_ComboBox,Prompt+cscSpace,cmsgSilent)
Say(GetObjectValue(),ot_line)
Say(PositionInGroup(),ot_position)
return true
EndFunction

int function BrailleCallbackObjectIdentify()
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
if GetWindowClass(GetFocus()) == cwc_DirectUIhWNd then
	if GetObjectSubtypeCode(SOURCE_CACHED_DATA) == wt_ListBoxItem then
		return wt_ListBox
	EndIf
EndIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectName(int nSubtypeCode)
if nSubtypeCode == WT_UPDOWNSLIDER
	if IsViewSliderControlAtViewLabel()
		BrailleAddString(GetObjectName(),0,0,0)
		return true
	endIf
elif nSubtypeCode == wt_comboBox
	if InNotificationsAreaIconsConfigurationDialog()
		var string name = GetNotificationsAreaIconsListItemName()
		if name
			BrailleAddString(name,0,0,0)
			return true
		endIf
	endIf
elif nSubtypeCode == wt_ListView
	if IsWin8ProgramAssociationList()
		BrailleAddString(GetWin8ProgramAssociationListViewName(),0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectName(nSubtypeCode)
endFunction

int function BrailleAddObjectValue(int nSubtypeCode)
var
	int iHighlightState,
	int left,
	int right,
	int top,
	int bottom,
	string sName
if IsTouchCursor() then
	return BrailleAddObjectValue(nSubtypeCode)
endIf
;In the folder and file listbox,
;we will use the object name to show the name,
;and the object value to show the other columns of data:
if nSubtypeCode == wt_ListBox then
	if GetWindowClass(GetFocus()) == cwc_DirectUIhWNd then
		;GetControlAttributes returns the selected bit, not the highlight bit, so:
		sName = GetObjectName(SOURCE_CACHED_DATA)
		if GetControlAttributes() & CTRL_SELECTED then
			let iHighlightState = Attrib_highlight
		else; remove 'Not Selected' from name if it exists:
		;getObjectName internal presents 'Not Selected' so speech can get it but attribs are for Braille
			if (StringStartsWith(sName, cscNotSelected) == 1);string starts with 'not selected'
				sName = (stringChopLeft (sName, stringLength (cscNotSelected)+1))
			endIf
		EndIf
		if sName != cwnEmptyFolderInDialogBrl;do not add items view for empty folders
			BrailleAddString(sName,GetCursorCol (), GetCursorRow (),iHighlightState);debug
		endIf
		;and now for the other column data:
		BrailleAddString(GetObjectValue(SOURCE_CACHED_DATA),0,0,0)
		return true
	EndIf
elif nSubtypeCode == wt_ListView
	if IsWin8ProgramAssociationList()
		BrailleAddString(c_Win8ProgAssListItem.name,0,0,0)
		BrailleAddString(c_Win8ProgAssListItem.desc,0,0,0)
		if c_Win8ProgAssListItem.curDef
			BrailleAddString(c_Win8ProgAssListItem.curDefHdr,0,0,0)
			BrailleAddString(c_Win8ProgAssListItem.curDef,0,0,0)
		endIf
		return true
	endIf
elif nSubtypeCode == WT_UPDOWNSLIDER
	if IsViewSliderControlAtViewLabel()
		BrailleAddString(GetObjectValue(SOURCE_CACHED_DATA),0,0,0)
		return true
	endIf
EndIf
return BrailleAddObjectValue(nSubtypeCode)
EndFunction

int function BrailleAddObjectState(int nSubtypeCode)
if IsTouchCursor() then
	return BrailleAddObjectState(nSubtypeCode)
endIf
if nSubtypeCode == wt_ListView
	if IsWin8ProgramAssociationList()
		;Do not combine the test for IsWin8ProgramAssociationList together with CollectionItemExists,
		;since a return of true must be made if IsWin8ProgramAssociationList is true,
		;regardless of what is returned by the test for CollectionItemExists.
		if CollectionItemExists(c_Win8ProgAssListItem,"state")
			SuppressG2TranslationForNextStructuredModeSegment()
			if c_Win8ProgAssListItem.state
				BrailleAddString(cmsgBrailleChecked1_L,GetCursorCol(),GetCursorRow(),0)
			else
				BrailleAddString(cmsgBrailleUnChecked1_L,GetCursorCol(),GetCursorRow(),0)
			endIf
		endIf
		return true
	endIf
endIf
return BrailleAddObjectState(nSubtypeCode)
EndFunction

int function BrailleAddObjectPosition(int nSubtypeCode)
if IsTouchCursor() then
	return BrailleAddObjectState(nSubtypeCode)
endIf
if nSubtypeCode == wt_ListView
	if IsWin8ProgramAssociationListGroupHeader()
		;Position in group is irrelevant:
		return true
	endIf
EndIf
return BrailleAddObjectPosition(nSubtypeCode)
EndFunction

void function spellLine ()
var
	int nSubtypeCode,
	string sName
if (! isPcCursor () || isVirtualPcCursor ())
	return spellLine ()
endIf
let nSubtypeCode = getObjectSubtypeCode ()
if nSubtypeCode == wt_ListBox || nSubtypeCode == WT_LISTBOXITEM then
	if GetWindowClass(GetFocus()) == cwc_DirectUIhWNd then
		sName = GetObjectName(SOURCE_CACHED_DATA)
		if ! (GetControlAttributes() & CTRL_SELECTED) then
		;getObjectName internal presents 'Not Selected' so speech can get it but attribs are for Braille
			if (stringContains (sName, cscNotSelected) == 1);string starts with 'not selected'
				sName = (stringChopLeft (sName, stringLength (cscNotSelected)+1))
			endIf
		EndIf
		spellString (sName); the name of the item
		spellString (getObjectValue(SOURCE_CACHED_DATA)); the date / time, type and other info of the item
		return;
	EndIf
EndIf
return spellLine ()
endFunction

script SayLine()
var
	handle hWnd,
	int iSubtype
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode
	hWnd = GetFocus()
	if GetWindowClass(hWnd) == cwc_DirectUIhWNd then
		iSubtype = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
		;For Windows Explorer drive type groups:
		if iSubtype == WT_GROUPBOX then
			if !GetObjectName(SOURCE_CACHED_DATA) then
				SayObjectTypeAndText(1)
				SayObjectTypeAndText(0)
				return
			EndIf
		EndIf
	EndIf
	if IsWin8ProgramAssociationList()
		SayObjectActiveItem(true)
		return
	endIf
EndIf
PerformScript SayLine()
endScript



Script SayNextLine()
if IsPCCursor()
	if IsWin8ProgramAssociationListGroupHeader()
		;There is at least one specific case where navigating by line to a checkable list item causes no events.
		;This is the case where the first group has focus and down arrow is used to move to the first checkable item.
		ScheduledSayWin8ProgramAssociationListItem = ScheduleFunction("SayWin8ProgramAssociationListItem",SayWin8ProgramAssociationListItem_WaitTime)
	endIf
endIf
var	int bMoved
bMoved=NextLine()
SayLineUnit(UnitMove_Next,bMoved)
EndScript

void function HomeEndMovement(int UnitMovement)
if UnitMovement == UnitMove_First
&& IsPCCursor()
	if IsWin8ProgramAssociationListGroupHeader()
		;When on a group header in the list and home is pressed,
		;the first group item becomes selected
		;however there is no event for the scripts to use for speaking the movement:
		ScheduledSayWin8ProgramAssociationListItem = ScheduleFunction("SayWin8ProgramAssociationListItem",SayWin8ProgramAssociationListItem_WaitTime)
	endIf
EndIf
HomeEndMovement(UnitMovement)
EndFunction

int function SayWin8AppWindowTitle()
;Do not use this for Windows Explorer:
return false
EndFunction

void function SayWindowTitleForApplication(handle hAppWnd, handle hRealWnd, handle hCurWnd, int iTypeCode)
if DialogActive()
	SayWindowTitleForApplication(hAppWnd, hRealWnd, hCurWnd, iTypeCode)
	return
endIf
var
	object TreeWalker,
	string sText
treeWalker = CreateUIATreeWalkerForFocusProcessId(Null(), true)
while TreeWalker.currentElement.ControlType != UIA_WindowControlTypeId
&& TreeWalker.gotoParent()
endWhile
sText = treeWalker.currentElement.name
SayMessage(ot_USER_REQUESTED_INFORMATION,
	FormatString (cmsg29_L, sText, cscNull),
	FormatString (cMsg29_S, sText, cscNull))
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgApp_WindowsExplorer)
EndScript

string function GetBreadcrumbText()
var
	object oCondition = FSUIACreateStringPropertyCondition(UIA_ClassNamePropertyID, "Microsoft.UI.Content.DesktopChildSiteBridge"),
	object oElement = GetTopLevelAppElement ().findFirst(TreeScope_Children, oCondition)
if !oElement return Null() endIf
oCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, "PART_BreadcrumbBar")
oElement = oElement.findFirst(TreeScope_Children, oCondition)
if !oElement return Null() endIf
var
	object oClassCondition = FSUIACreateStringPropertyCondition (UIA_ClassNamePropertyID, "FileExplorerExtensions.BreadcrumbBarItemControl"),
	object oNotCondition = FSUIACreateNotCondition (FSUIACreateIntPropertyCondition (UIA_SizeOfSetPropertyId, 0)),
	object oBreadcrumbs,
	object oBreadcrumb,
	string sBreadcrumbSeparator = StringConcatenate(cscSpace, cScGreater, cscSpace),
	string sBreadcrumbText
oCondition = FSUIACreateAndCondition (oClassCondition, oNotCondition)
oBreadcrumbs = oElement.findAll(TreeScope_Descendants, oCondition)
ForEach oBreadcrumb in oBreadcrumbs
	sBreadcrumbText = StringConcatenate(sBreadcrumbText, oBreadcrumb.name, sBreadcrumbSeparator)
EndForEach
return stringChopRight (sBreadcrumbText, StringLength (sBreadcrumbSeparator))
endFunction

int function SayBreadcrumbBar()
var string sBreadcrumbText = GetBreadcrumbText()
if StringIsBlank(sBreadcrumbText)
	return false
endIf
if !IsSameScript ()
	SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, msgBreadcrumbBar, sBreadcrumbText, sBreadcrumbText)
	return true
EndIf
EnsureNoUserBufferActive()
UserBufferAddText(FormatString (msgBreadcrumbBar, sBreadcrumbText) + cScBufferNewLine + cScBufferNewLine + cMsgBuffExit)
UserBufferActivate()
Say(UserBufferGetText(),ot_line)
return true
endFunction

object function FindWin11AddressBarElement()
var
	object oCondition = FSUIACreateStringPropertyCondition(UIA_ClassNamePropertyID, "Microsoft.UI.Content.DesktopChildSiteBridge"),
	object oPaneElement = GetTopLevelAppElement ().findFirst(TreeScope_Children, oCondition)
if !oPaneElement return Null() endIf
oCondition = FSUIACreateStringPropertyCondition(UIA_AutomationIDPropertyID, "PART_AutoSuggestBox")
var object element = oPaneElement.findFirst(TreeScope_Children, oCondition)
if !element return Null() endIf
oCondition = FSUIACreateStringPropertyCondition(UIA_AutomationIDPropertyID, "TextBox")
element = element.findFirst(TreeScope_Children, oCondition)
return element
EndFunction

object function FindAddressBarElement()
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return Null() endIf
var object element = oUIA.GetFocusedElement()
if !element return Null() endIf
var object appElement = GetTopLevelAppElement()
if !appElement return Null() endIf
var object condition = oUIA.CreateAndCondition(
		oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_PaneControlTypeId),
		oUIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId,"Breadcrumb Parent"))
if !condition return Null() endIf
var object paneElement = appElement.findFirst(treeScope_subtree,condition)
if !paneElement return Null() endIf
condition = oUIA.CreateAndCondition(
		oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_ToolBarControlTypeId),
		oUIA.CreateStringPropertyCondition(UIA_AutomationIdPropertyId,"1001"))
if !condition return Null() endIf
var object toolbarElement = paneElement.findFirst(treeScope_children,condition)
return toolbarElement
EndFunction

Script AddressBar ()
if IsWindows11 ()
	if SayBreadcrumbBar() return endIf
	if GetObjectSubTypeCode () == WT_EDIT
	&& GetObjectAutomationId (1) == "PART_AutoSuggestBox"
		;Breadcrumbs are unavailable while the address bar has focus
		SayLine ()
		return
	endIf
endIf
var object toolBarElement = FindAddressBarElement()
if !toolbarElement
	SayMessage (ot_ERROR,msgAddressBarNotFound1_L, msgAddressBarNotFound1_S)
	return
EndIf
var string addressInfo = toolbarElement.name
if !IsSameScript () then
	SayMessage(ot_user_requested_information,addressInfo)
	return
EndIf
EnsureNoUserBufferActive()
UserBufferAddText(addressInfo+ cScBufferNewLine + cScBufferNewLine + cMsgBuffExit)
UserBufferActivate()
Say(UserBufferGetText(),ot_line)
EndScript

Script SayCharacter ()
var
	int iType,
	string sHeader,
	string sName
if (! isPcCursor () || isVirtualPcCursor ()
|| dialogActive () || ribbonsActive ())
	performScript SayCharacter ()
	Return
endIf
iType = getObjectSubtypeCode(SOURCE_CACHED_DATA)
if (GetWindowClass (getFocus ()) == cwc_DirectUIhWNd)
	if (iType == WT_LISTBOXITEM || iType == WT_STATIC)
		if (iType == WT_STATIC)
			sName = getObjectValue(SOURCE_CACHED_DATA)
			sHeader = getObjectName(SOURCE_CACHED_DATA)
		else
			sName = getObjectName(SOURCE_CACHED_DATA)
		endIf
		sName = stringTrimLeadingBlanks (sName)
		;in those instances where the name contains a date, there's a nonprintable character to the left of the actual number
		if (stringCompare (sHeader, wnDateHeader) == 0)
		;|| stringCompare (sHeader, wnSizeHeader) == 0)
			sName = stringTrimLeadingBlanks (stringChopLeft (sName, 1))
		endIf
		sName = stringLeft (sName, 1)
		if (isSameScript ())
			sName = iniReadString ("PhoneticSpell", sName, sName, DefaultJCFFile)
			say (sName, OT_CHAR)
		else
		say (sName, OT_CHAR)
		endIf
		return
	endIf
elif IsViewSliderControl()
	SayObjectTypeAndText()
	return
endIf
performScript SayCharacter()
endScript

Script SayWord ()
var
	int i,
	int iType,
	int nIsSameScript = isSameScript (),
	string sName
if (! isPcCursor () || isVirtualPcCursor ()
|| dialogActive () || ribbonsActive ())
	performScript SayWord ()
	Return
endIf
iType = getObjectSubtypeCode(SOURCE_CACHED_DATA)
if (GetWindowClass (getFocus ()) == cwc_DirectUIhWNd)
	if (iType == WT_LISTBOXITEM || iType == WT_STATIC)
		if (iType == WT_STATIC)
			sName = getObjectValue(SOURCE_CACHED_DATA)
		else
			sName = getObjectName(SOURCE_CACHED_DATA)
		endIf
		sName = stringTrimLeadingBlanks (sName)
		; if the list item is not selected, the name may contain "not selected" as the first part of the string:
		if ! GetObjectStateCode (TRUE)
		&& StringStartsWith (sName, cscNotSelected) then
			sName = StringChopLeft (sName, StringLength (cscNotSelected)+1)
		endIf
		sName = stringSegment (sName, cscSpace, 1)
		if (nIsSameScript)
			if (nIsSameScript == 1)
				return spellString (sName)
			endIf
			;spell the word phonetically - read phonetics from file:
			for i=1 to stringLength (sName)
				sayMessage (OT_CHAR,
				iniReadString ("PhoneticSpell", subString (sName, i, 1), subString (sName, i, 1), DefaultJCFFile))
			endFor
		else
			say(sName, OT_WORD)
		endIf
		return
	endIf
elif IsViewSliderControl()
	SayObjectTypeAndText()
	return
endIf
performScript SayWord ()
endScript

String function GetCustomTutorMessage()
if IsViewSliderControl()
	return msgViewSliderControl_CustomTutorialHelp
endIf
return GetCustomTutorMessage()
EndFunction

Void Function GetCustomScreenSensitiveHelpForKnownClasses(int nSubTypeCode)
if IsViewSliderControl()
	return msgViewSliderControl_CustomScreenSensitiveHelp
endIf
return GetCustomScreenSensitiveHelpForKnownClasses(nSubTypeCode)
EndFunction


GLOBALS
	Int GlobalOCRJobID, ; Copied from Default
	int globalDocumentOCR

void function OCRSelectedFileWithType (int type)
var
	int PrimaryLanguage = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	int SecondaryLanguage = ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	int result = OCRResult_Success;
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if CanRecognize () != OCR_SUCCESS then
	SayFormattedMessage (OT_ERROR, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
	Return
endIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
result = OCRSelectedFile (getFocus (), PrimaryLanguage, SecondaryLanguage, GlobalOCRJobID, type)
if result == OCRResult_Success then
	SayMessage (OT_JAWS_MESSAGE, msg_OCRDocumentStarted_L, MSG_OCRStarted_S)
Else
	StopSpeech()
	If result == OCRResult_NoFileSelected then
		MessageBox(msgOCRNoFileSelected)
	ElIf result == OCRResult_MultipleFilesSelected then
		MessageBox(msgOCRMultipleFilesSelected)
	ElIf result == OCRResult_UnsupportedFileSelected then
		MessageBox(msgOCRUnsupportedFileSelected)
	else
		MessageBox(MSG_OCR_PDF_FAILED_TO_Start)
	endIf
endif
endFunction

Script OCRSelectedFile ()
OCRSelectedFileWithType(csConvenientOCR)
endScript

Script OCRSelectedFileToWord ()
OCRSelectedFileWithType(csConvenientOCRToWord)
endScript

script OCRAllInOne ()
if GetObjectSubtypeCode() == WT_LISTBOXITEM
&& !InHJDialog ()
	PerformScript OCRSelectedFile ()
	return
endIf
PerformScript OCRAllInOne ()
EndScript

int function PictureSmartWithSelectedFileShared (int serviceOptions)
var
	int PrimaryLanguage = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	int SecondaryLanguage = ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	int result = OCRResult_Success,
	string question = cscNULL
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
if !IsPictureSmartEnabled() then
	Return
endif

if(serviceOptions & PSServiceOptions_AskPrelim) then
	if !PictureSmartPromptPreliminaryQuestion(question) then
		return
	EndIf
EndIf

result = IsTelemetryEnabled(TRUE);
If result == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif result != PSResult_Success then
	; no message needed since the function prompts
	return
EndIf

result = DescribeSelectedFileEx (getFocus (), PrimaryLanguage, SecondaryLanguage, serviceOptions, GlobalOCRJobID, question)
If result == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
ElIf result == PSResult_NoFileSelected then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_nofileselected)
ElIf result == PSResult_MultipleFilesSelected then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_multiplefileselected)
ElIf result == PSResult_UnsupportedFileSelected then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_unsupportedformat)
ElIf result == PSResult_FileInsideArchive then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_fileinsidearchive)
elif result != PSResult_Success then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_failedtostart)
endIf
endFunction

Script PictureSmartWithSelectedFile (optional int serviceOptions)
PictureSmartWithSelectedFileShared (PSServiceOptions_Single | serviceOptions)
endScript

Script PictureSmartWithSelectedFileAskPrelim ()
PerformScript PictureSmartWithSelectedFile (PSServiceOptions_AskPrelim)
endScript

Script PictureSmartWithSelectedFileMultiService (optional int serviceOptions)
PictureSmartWithSelectedFileShared (PSServiceOptions_Multi | serviceOptions)
endScript

Script PictureSmartWithSelectedFileMultiServiceAskPrelim ()
PerformScript PictureSmartWithSelectedFileMultiService (PSServiceOptions_AskPrelim)
endScript

script PictureSmartAllInOne (optional int serviceOptions)
if GetObjectSubtypeCode() == WT_LISTBOXITEM
	PerformScript PictureSmartWithSelectedFile(serviceOptions)
	return
endIf
PerformScript PictureSmartWithControl(serviceOptions)
endScript

script PictureSmartAllInOneAskPrelim ()
PerformScript PictureSmartAllInOne(PSServiceOptions_AskPrelim)
endScript

script PictureSmartAllInOneMultiService (optional int serviceOptions)
if GetObjectSubtypeCode() == WT_LISTBOXITEM
	PerformScript PictureSmartWithSelectedFileMultiService(serviceOptions)
	return
endIf
PerformScript PictureSmartWithControlMultiService(serviceOptions)
endScript

script PictureSmartAllInOneMultiServiceAskPrelim ()
PerformScript PictureSmartAllInOneMultiService(PSServiceOptions_AskPrelim)
endScript

string function GetSelectedText(optional int bWantMarkup, optional int bWantAllListViewItemText)
;Special handling of folder tree in Windows Explorer
if GetObjectSubtypeCode() == wt_treeview
&& GetObjectClassName() == cwc_SysTreeView32
;must use true in call to GetObjectState for this tree:
	&& (GetObjectStateCode(true) & CTRL_SELECTED)
	return GetObjectName(SOURCE_CACHED_DATA)
endIf
return GetSelectedText(bWantMarkup,bWantAllListViewItemText)
EndFunction

script ReadListviewColumn()
if IsTrueListView(getCurrentWindow())
	PerformScript ReadListviewColumn()
	return
endIf
var
	object oElement,
	object oCondition,
	object oEditChildren,
	object oPattern,
	int nCol,
	int nMaxCols,
	string sHeader,
	string sText
oElement = FSUIAGetFocusedElement ()
if oElement.ControlType != UIA_ListItemControlTypeId
	sayMessage(OT_ERROR,cmsgNotInAListview_L,cmsgNotInAListview_S)
	return
endIf
oCondition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyID, UIA_EditControlTypeID)
oEditChildren = oElement.findAll(TreeScope_Children, oCondition)
nCol=StringToInt(stringRight(GetCurrentScriptKeyName(),1))
if (nCol==0) then
	nCol=10
elIf (nCol < 1) then
	nCol=1
endIf
nMaxCols=oEditChildren.count
if (nCol > nMaxCols) then
	SayFormattedMessage(OT_ERROR,formatString(cmsgListviewContainsXColumns_L,intToString(nCol),intToString(nMaxCols)),formatString(cmsgListviewContainsXColumns_S,intToString(nCol)))
	return
endIf
nCol = nCol - 1; UIA arrays are 0-based
sHeader=oEditChildren(nCol).name
oPattern = oEditChildren(nCol).GetValuePattern()
sText=oPattern.value
BeginFlashMessage ()
say(sHeader, OT_USER_REQUESTED_INFORMATION)
say(sText, OT_USER_REQUESTED_INFORMATION)
EndFlashMessage ()
endScript

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
if giSuppressTutor
	giSuppressTutor = false
	return
endIf
tutorMessageEvent(hwndFocus, nMenuMode)
EndFunction

int Function IsEmptyFolder()
return !selectionFromUIA.listElement.GetGridPattern().rowCount
&& GetObjectSubTypeCode () == WT_LISTBOX
&& GetObjectClassName () != "UIProperty"
EndFunction

void Function AnnounceEmptyFolder()
if !IsEmptyFolder() return endIf
var object oFocus = FSUIAGetFocusedElement (true)
IndicateControlType (WT_LISTBOX, oFocus.name, oFocus.itemStatus)
EndFunction

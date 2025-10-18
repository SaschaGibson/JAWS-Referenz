; Copyright 2009-2017 by Freedom Scientific, Inc.
; Common function used in Scripts for Quick Settings and Settings Center.

import "UIA.jsd"

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "MSAAConst.jsh"
include "common.jsm"
include "SettingsCenter.jsh"
include "SettingsCenter.jsm"

globals
	int g_ShouldUseUIA, ; for GetTreeViewLevel and other functions that should use UIA in Windows 8 or later
	object UIAFocusTreeItem,
	string gstrBrlResults

;for managing schedule of AnnounceSearchResults:
const
	AnnounceSearchResults_Delay = 10
globals
	int AnnounceSearchResultsScheduleID


string function SmartGetTreeViewObjectValue ()
return getObjectName(SOURCE_CACHED_DATA) ; leaves out the "checked" and "not checked" stuff for SysTreeView32 controls in Settings Center.
endFunction 

int function FocusIsExpectingAutocompleteSearchSuggestions ()
if GetControlID (GetFocus ()) == SearchEditID then return TRUE endIf
return FocusIsExpectingAutocompleteSearchSuggestions ()
endFunction

void function autoStartEvent ()
g_ShouldUseUIA = IsWindows8 ()
gstrBrlResults = cscNull
EndFunction

string function tvGetPathToSelection(handle hWnd)
var string path = tvGetPathToSelection(hWnd)
if path && ! StringIsBlank (path)
	;Default function may return one or more instances of the separator without any TV text per item:
	if StringLength (StringReplaceSubstrings (path, LIST_ITEM_SEPARATOR, "")) then
		return path
	endIf
endIf
if (GetObjectSubtypeCode(SOURCE_CACHED_DATA) != WT_TREEVIEW && GetObjectSubtypeCode(SOURCE_CACHED_DATA) != WT_TREEVIEWITEM) return cscNull endIf
var
	int level,
	object pattern,
	object element = UIAFocusTreeItem
if (!element) element = CreateUIAFocusElement () endIf
if (!element) return path endIf
pattern = element.GetLegacyIAccessiblePattern()
level = StringToInt (Pattern.value)
if level == 0 return path endIf
var
	string name,
	object treewalker,
	int walkerLevel
treewalker = CreateUIATreeWalkerWithCurrentElement(element)
walkerLevel = Level
while walkerLevel != 0
	treewalker.gotoPriorSibling()
	pattern = treewalker.currentElement.GetLegacyIAccessiblePattern()
	walkerLevel = StringToInt (Pattern.value)
	if walkerLevel < level
		name = treewalker.currentElement.name
		path = path+name+LIST_ITEM_SEPARATOR
		level = walkerLevel
	endIf
endWhile
return path
endFunction

int Function IsInDialogueContainer(handle hWnd)
var Handle hDialogueContainer
GetDialogueContainerWindowName (hDialogueContainer) ;note that this also sets the handle if the name is found
If (!hDialogueContainer) return false endIf
Return IsDescendedFromWindow (hDialogueContainer, hWnd)
EndFunction

int Function IsInControlPane (handle hWnd)
var Handle hReal
If IsInDialogueContainer (hWnd) Return TRUE EndIf
hReal = GetRealWindow(GetFocus())
If (!FindWindow(hReal, WC_DialogueContainer, cScNull)) return true endIf
Return FALSE
EndFunction

String Function SMMMarkupStringToSayMessage (string sMessage)
Return (FormatString (MSG_MessageVoiceTemplate, sMessage))
EndFunction

string Function GetDialogueContainerWindowName(handle ByRef hDialogueContainer)
var
	Object oDialogueContainer,
	Int iChildID,
	Int iTemp
hDialogueContainer = GetFocus ()
If hDialogueContainer
	hDialogueContainer = GetAppMainWindow (hDialogueContainer)
	If hDialogueContainer
		hDialogueContainer = FindWindow (hDialogueContainer, WC_DialogueContainer, cScNull)
		If hDialogueContainer
			oDialogueContainer = GetObjectFromEvent (hDialogueContainer, OBJID_CLIENT, iChildID, iTemp)
			If oDialogueContainer
				Return (oDialogueContainer.accName (CHILDID_SELF))
			EndIf
		EndIf
	EndIf
EndIf
hDialogueContainer = Null ()
Return cScNull
EndFunction

string Function GetSelectedControlInfo()
var
	Handle hDialogueContainer,
	Object oControl,
	String sObjectName = GetObjectName(SOURCE_CACHED_DATA),
	String sControlValue,
	String sResult,
	int iAttribs,
	String sState,
	string sReason, ; for disabled controls only
	Int iChildID,
	Int iTemp,
	Int iWindowType,
	Int iMessage = RegisterWindowMessage (MN_HighlightedControl),
	Variant hWnd = SendMessage (GetAppMainWindow (GetFocus ()), iMessage)
gsBrlTreeViewControlState = cscNull
gsBrlTreeViewControlName = cscNull
iWindowType = GetWindowSubtypeCode (hWnd)
If iWindowType == WT_STATIC
	hWnd = GetNextWindow (hWnd)
	iWindowType = GetWindowSubtypeCode (hWnd)
EndIf
sResult = sObjectName
gsBrlTreeViewControlName = sObjectName
iAttribs = (GetControlAttributes () & ~CTRL_SELECTED) ;Selected should be assumed, don't announce it for treeview items
If iWindowType == WT_GROUPBOX
	If GetWindowSubtypeCode (GetNextWindow (hWnd)) == WT_RADIOBUTTON
		hWnd = GetNextWindow (hWnd)
		While (! SendMessage (hWnd, BM_GETCHECK))
		&& GetWindowSubtypeCode (GetNextWindow (hWnd)) == WT_RADIOBUTTON
			hWnd = GetNextWindow (hWnd)
		EndWhile
		sResult = sResult + cScSpace + GetWindowName (hWnd)
		gsBrlTreeViewControlName = GetWindowName (hWnd)
	Else
		If GetWindowClass (GetFocus ()) == WC_SearchTreeList
		EndIf
	EndIf
	If iAttribs
		sResult = sResult + smmGetStartMarkupForControlState (WT_TREEVIEW, iAttribs)
	EndIf
	Return (sResult)
EndIf
oControl = GetObjectFromEvent (hWnd, OBJID_CLIENT, iChildID, iTemp)
If IsWindowDisabled (hWnd)
	GetDialogueContainerWindowName (hDialogueContainer)
	sReason = GetSettingsCenterControlDisabledReason (GetFirstChild (hDialogueContainer), hWnd)
	sResult = sResult + SMMMarkupStringToSayMessage (FormatString (MSG_ControlInactive, sReason))
	;For Braille don't add the object's name, because that is already handled via ObjectValue.
	gsBrlTreeViewControlName = formatString (MSG_ControlInactive, sReason)
Else
	If iWindowType == WT_EDIT
	|| iWindowType == WT_COMBOBOX
	|| iWindowType == WT_EDIT_SPINBOX
	|| iWindowType == WT_LEFTRIGHTSLIDER
	|| iWindowType == WT_READONLYEDIT
		sControlValue = oControl.accValue (CHILDID_SELF)
		sResult = sResult + cscSpace + sControlValue
		gsBrlTreeViewControlName = oControl.accValue (CHILDID_SELF)
	EndIf
	If iWindowType == WT_CHECKBOX
		If SendMessage (hWnd, BM_GETCHECK)
			sResult = sResult + cScSpace + smmGetStartMarkupForControlState (iWindowType, CTRL_CHECKED) + smmGetEndMarkupForControlState (iWindowType, CTRL_CHECKED)
			gsBrlTreeViewControlState = BrailleGetStateString (CTRL_CHECKED)
		Else
			sResult = sResult + cScSpace + smmGetStartMarkupForControlState (iWindowType, CTRL_UNCHECKED) + smmGetEndMarkupForControlState (iWindowType, CTRL_UNCHECKED)
			gsBrlTreeViewControlState = BrailleGetStateString (CTRL_UNCHECKED)
		EndIf
	EndIf
EndIf
sResult = sResult + smmGetStartMarkupForAttributes (iAttribs)
Return sResult
EndFunction

string  function GetPersistenceInfoForSayTreeviewItem()
return cscNull
EndFunction

int function GetTreeViewLevel ()
if !g_ShouldUseUIA
|| getWindowSubtypeCode (GetFocus ()) != WT_TREEVIEW
|| tvGetFocusItemText(GetFocus ())
	return GetTreeViewLevel()
endIf
if (!UIAFocusTreeItem) UIAFocusTreeItem = CreateUIAFocusElement () endIf
if !UIAFocusTreeItem
|| UIAFocusTreeItem.controlType != UIA_TreeItemControlTypeId
	return
endIf
var object pattern = UIAFocusTreeItem.GetLegacyIAccessiblePattern ()
return StringToInt (pattern.value)
endFunction

void function SayTreeViewItem()
if (globalMenuMode) Return endIf
var
	Handle hFocus,
	Handle hDialogueContainer,
	string sValue,
	String sMSAAName,
	String sClass,
	int iWindowType,
	Int iControlID,
	Int iChildID,
	Object oTree,
	string sPersistence
hFocus = GetFocus ()
iWindowType = GetWindowSubtypeCode (hFocus)
iControlID = GetControlID (hFocus)
sClass = GetWindowClass (hFocus)
sPersistence = GetPersistenceInfoForSayTreeviewItem()
if ! iWindowType
	iWindowType = getObjectSubtypeCode ()
endIf
if iWindowType == WT_TREEVIEWITEM
	; it's really the parent or tree view we need:
	iWindowType = WT_TREEVIEW
endIf
if iControlID == SettingsTreeViewID
&& iWindowType == WT_TREEVIEW
	sValue = GetObjectName(SOURCE_CACHED_DATA)
	If StringIsBlank (sValue)
		sValue  = tvGetFocusItemText (hFocus)
	EndIf
	sMSAAName = GetDialogueContainerWindowName (hDialogueContainer)
	If StringContains (sMSAAName, sValue)
		oTree = GetFocusObject (iChildID)
		; the patch to handle the situation with text analyzer...
		If sMSAAName != GetWindowName (GetFirstChild (hDialogueContainer))
		&& GetTreeViewLevel ()
		&& sValue == GetWindowName (GetFirstChild (GetFirstChild (hDialogueContainer)))
		; to workaround Braille Marking item state loss
		&& oTree.accName (iChildID) != oTree.accName (iChildID + 1)
			If IsSameScript ()
			&& GetCurrentScriptKeyName () == GetScriptKeyName (SN_SayLine)
				SpellString (smmStripMarkup (GetSelectedControlInfo()))
				if (sPersistence) sayUsingVoice (VCTX_MESSAGE, sPersistence, OT_SCREEN_MESSAGE) endIf
			Else
				Say (GetSelectedControlInfo(), OT_SELECTED_ITEM, TRUE)
				if (sPersistence) sayUsingVoice (VCTX_MESSAGE, sPersistence, OT_SCREEN_MESSAGE) endIf
			EndIf
			Return
		EndIf
		If IsSameScript ()
		&& GetCurrentScriptKeyName () == GetScriptKeyName (SN_SayLine)
			SpellString (smmStripMarkup (sValue))
		Else
			Say (sValue, OT_SELECTED_ITEM)
		EndIf
		gsBrlTreeViewControlName = cScNull
		gsBrlTreeViewControlState = cscNull
		If sClass != WC_SearchTreeList
			IndicateControlState (iWindowType, (GetControlAttributes () & ~CTRL_SELECTED))
		EndIf
		if (sPersistence) sayUsingVoice (VCTX_MESSAGE, sPersistence, OT_SCREEN_MESSAGE) endIf
		Return
	Else
		If IsSameScript ()
		&& GetCurrentScriptKeyName () == GetScriptKeyName (SN_SayLine)
			SpellString (smmStripMarkup (GetSelectedControlInfo()))
		Else
			Say (GetSelectedControlInfo(), OT_SELECTED_ITEM, TRUE)
		EndIf
		if (sPersistence) sayUsingVoice (VCTX_MESSAGE, sPersistence, OT_SCREEN_MESSAGE) endIf
		Return
	EndIf
EndIf
SayTreeViewItem()
EndFunction

int function ShouldExitSayTreeViewLevel()
;This is currently only relevant for QuickSettings.
return false
EndFunction

void Function SayTreeViewLevel(int IntelligentPositionAnnouncement)
UIAFocusTreeItem = null () ; refresh UIA cache
if ShouldExitSayTreeViewLevel() return endIf
var
	handle hFocus,
	String sClass,
	string sMessage,
	int iLevel,
	int bLevelChanged,
	string sLevel,
	string sItemParentText,
	string sPath,
	string sPosition
let hFocus = GetFocus()
let sClass = GetWindowClass (hFocus)
let iLevel = GetTreeviewLevel()
If iLevel != PreviousTreeviewLevel then
	let bLevelChanged = true
	let sLevel = IntToString (iLevel)
	let sMessage = FormatString (cmsg233_L, sLevel)
	If sClass != WC_SearchTreeList then
		SayMessage (OT_POSITION, sMessage, sLevel) ; "level "
	EndIf
	let PreviousTreeViewLevel= iLevel
endIf
sPosition = PositionInGroup()
let sPath = tvGetPathToSelection(hFocus)
if iLevel > 0 then
	if gsTvPathToPrevSelection != sPath
		sItemParentText = sPath
	endIf
EndIf
If !IsPcCursor () then
	SayLine ()
	Return
EndIf
SayTreeViewItem ()
if (!sItemParentText
&& IntelligentPositionAnnouncement
&& !bLevelChanged) then
	;we don't want to announce the position or the parent node.
	return
EndIf
If sClass == WC_SearchTreeList then
	let sMessage = StringReplaceChars (sPath, LIST_ITEM_SEPARATOR, cScBufferNewLine)
	SayUsingVoice (VCTX_MESSAGE, sPath, OT_SELECTED_ITEM)
	Return
EndIf
if sPath != gsTvPathToPrevSelection
|| sPosition != gsTVPrevPositionInGroup
|| (! IntelligentPositionAnnouncement)
	sPosition = PositionInGroup()
	SayMessage(OT_POSITION, sPosition)
	if sItemParentText then
		SayUsingVoice(vctx_message,sItemParentText,ot_position)
	EndIf
EndIf
let gsTvPathToPrevSelection = sPath
let gsTVPrevPositionInGroup = sPosition
EndFunction

void Function AnnounceSearchResults ()
AnnounceSearchResultsScheduleID = 0
var String sDescription
If (IsKeyWaiting()) return endIf
gstrBrlResults = cscNull
sDescription = GetObjectDescription(SOURCE_CACHED_DATA)
If !StringCompare (StringTrimLeadingBlanks (StringSegment (sDescription, "\13", -1)), "0", TRUE)
	SayMessage (OT_ERROR, MSG_NoMatchesFound_L, MSG_NoMatchesFound_S)
	Return
EndIf
var
	string msgPart1,
	string msgPart2
msgPart1 = StringSegment (sDescription, "\13", -1)
msgPart2 = FormatString (MSG_OneOf, GetWindowName (GetNextWindow (GetNextWindow (GetFocus ()))))
SayUsingVoice (VCTX_MESSAGE, msgPart1, OT_SELECTED_ITEM)
SayUsingVoice (VCTX_MESSAGE, msgPart2, OT_POSITION)
gstrBrlResults = msgPart1+ cscSpace + msgPart2
BrailleRefresh ()
EndFunction

void Function DescriptionChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldDescription, string sNewDescription)
var
	Object oInformation,
	Handle hDialogueContainer,
	String sDescription,
	Int iControlID,
	Int iWindowType,
	Int iTotal,
	Int iChildID
if MenusActive () || UserBufferIsActive ()
	return DescriptionChangedEvent (hwnd, objId, childId, nObjType, sOldDescription, sNewDescription)
endIf
iControlID = GetControlID (hWnd)
iWindowType = GetWindowSubtypeCode (hWnd)
oInformation = GetObjectFromEvent (hWnd, OBJID_CLIENT, CHILDID_SELF, iChildID)
If (GetControlID (GetFocus ())== SettingsTreeViewID
|| GetControlID (GetFocus ()) == SearchEditID)
&& IsInDialogueContainer (hWnd) then
	If IsWindowDisabled (hWnd)
		GetDialogueContainerWindowName (hDialogueContainer)
		SayUsingVoice (VCTX_MESSAGE, FormatString (MSG_ControlInactive, GetSettingsCenterControlDisabledReason (GetFirstChild (hDialogueContainer), hWnd)), OT_SMART_HELP)
		Return
	EndIf
	If iWindowType == WT_COMBOBOX
		Say (oInformation.accValue (iChildID), OT_SELECTED_ITEM)
		Say (PositionInGroup (hWnd), OT_POSITION)
		let gsBrlTreeViewControlName = oInformation.accValue (iChildID)
	ElIf iWindowType == WT_LEFTRIGHTSLIDER
	|| iWindowType == WT_UPDOWNSLIDER then
		Say (oInformation.accValue (iChildID), OT_SELECTED_ITEM)
		let gsBrlTreeViewControlName = oInformation.accValue (iChildID)
		BrailleRefresh ()
	ElIf iWindowType == WT_CHECKBOX then
		If SendMessage (hWnd, BM_GETCHECK) then
			Say (smmGetStartMarkupForControlState (iWindowType, CTRL_CHECKED) + smmGetEndMarkupForControlState (iWindowType, CTRL_CHECKED), OT_SELECTED_ITEM, TRUE)
			let gsBrlTreeViewControlState = BrailleGetStateString (CTRL_CHECKED)
		Else
			Say (smmGetStartMarkupForControlState (iWindowType, CTRL_UNCHECKED) + smmGetEndMarkupForControlState (iWindowType, CTRL_UNCHECKED), OT_SELECTED_ITEM, TRUE)
			let gsBrlTreeViewControlState = BrailleGetStateString (CTRL_UNCHECKED)
		EndIf
		BrailleRefresh ()
	ElIf iWindowType == WT_EDIT
	|| iWindowType == WT_SPINBOX then
		SayMessage (OT_JAWS_MESSAGE, MSG_PressF6ToMove_L, MSG_PressF6ToMove_S)
	ElIf iWindowType == WT_RADIOBUTTON then
		Say (oInformation.accName (iChildID), OT_SELECTED_ITEM)
		Say (PositionInGroup (hWnd), OT_POSITION)
		let gsBrlTreeViewControlName = oInformation.accName (CHILDID_SELF)
		BrailleRefresh ()
	EndIf
	Return
EndIf
If iControlID == SearchEditID then
	If IsWindowVisible (GetNextWindow (hWnd)) then
		SayMessage (OT_JAWS_MESSAGE, MSG_ClearSearchEditBox_L, MSG_ClearSearchEditBox_S)
		gstrBrlResults  = cscNull
		Return
	EndIf
	AnnounceSearchResultsScheduleID = ScheduleFunction ("AnnounceSearchResults", AnnounceSearchResults_delay)
	Return
EndIf
DescriptionChangedEvent (hwnd, objId, childId, nObjType, sOldDescription, sNewDescription)
EndFunction

void function ProcessEventOnFocusChangedEvent(handle AppWindow, handle RealWindow, string RealWindowName,
	handle FocusWindow, handle PrevWindow)
if AnnounceSearchResultsScheduleID
&& focusWindow != prevWindow
	UnscheduleFunction(AnnounceSearchResultsScheduleID)
	AnnounceSearchResultsScheduleID = 0
endIf
ProcessEventOnFocusChangedEvent(AppWindow, RealWindow, RealWindowName, FocusWindow, PrevWindow)
EndFunction

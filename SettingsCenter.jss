; Copyright 2009-2017 by Freedom Scientific, Inc.
; Scripts for Settings center.

use "SettingsCommon.jsb"

Include "HJConst.jsh"
Include "HJGlobal.jsh"
Include "MSAAConst.jsh"
include "WinStyles.jsh"
Include "Common.jsm"
Include "TutorialHelp.jsm"
Include "SettingsCenter.jsm"
Include "SettingsCenter.jsh"

GLOBALS
	handle globalPrevTutorWindow, ; Keeps TutorMessageEvent from speaking 'Type in text' during search text entry
	string gstrBrlResults,
int qsCroppedMode,
int qsSplitMode

; this constant should never be localized...
Const
	SC_Dash = "-"

; this message should never be localized...
Messages
@MSG_BuildTitle
%1 - %2
@@
EndMessages

void function autoStartEvent ()
qsCroppedMode=getJCFOption(OPT_BRL_CROPPED_MODE)
qsSplitMode=BrailleGetSplitMode()
SetJCFOption(OPT_BRL_CROPPED_MODE, 0)
BrailleSplitMode(0)
endFunction

void function autoFinishEvent ()
SetJCFOption(OPT_BRL_CROPPED_MODE, qsCroppedMode)
BrailleSplitMode(qsSplitMode)
endFunction

int function controlCanBeChecked ()
;This legacy OSM-based function gets called here and returns TRUE in the wrong spot,
; it's not the tree control's fault, or the button, it's got to do with how we handle legacy checkable trees.
;The state of items on the right side is managed in different code.
;Returning OFF in this instance just prevents a false notification of checked / unchecked state when the focused control on the right side is a button,
;e.g. Braille -> Advanced -> Select Braille tables.
if getWindowClass (getCurrentWindow ()) == wc_Treeview_Main 
|| getWindowClass (GetCurrentWindow ()) == WC_SearchTreeList then
	return OFF
endIf
return controlCanBeChecked ()
endFunction

void Function DoStateForGraphics ()
;This legacy function gets called every time the space bar is pressed from inside a list box.
;Ensures the Braille components get updated when the state changes, in this case the state of the focused item in a checkable list.
BrailleRefresh ()
DoStateForGraphics ()
endFunction

Script ScriptFileName ()
ScriptAndAppNames (GetActiveConfiguration ())
EndScript

String Function ChangeSelectedControlInfo ()
var
	Variant hWnd,
	Handle hRadio,
	Handle hTree,
	Object oControl,
	String sObjectName,
	String sControlInterior,
	String sPosition,
	String sResultText,
	Int iWindowType,
	Int iChildID,
	Int iTemp,
	Int iMessage

let iMessage = RegisterWindowMessage (MN_HighlightedControl)
let hWnd = SendMessage (GetAppMainWindow (GetFocus ()), iMessage)
let sObjectName = GetObjectName(SOURCE_CACHED_DATA)
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
Return (sResultText + SMMMarkupStringToSayMessage (sPosition))
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

int Function HandleCustomWindows (handle hWnd)
var
	String sDialogueName,
	Int iControlID = GetControlID (hWnd),
	Int iWindowType = GetWindowSubtypeCode (hWnd)

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
If (GetWindowSubTypeCode (GlobalPrevFocus) == WT_TREEVIEW
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
	indicateControlType (iWindowType, cscNull)
	saveCursor ()
	pcCursor ()
	SayLine ()
	Return (TRUE)
EndIf
Return (HandleCustomWindows (hWnd))
EndFunction

int Function HandleCustomAppWindows (handle hWnd)
var
	String sTitle

; While setting center is experimental and not yet placed in InHJDialogue function...
sTitle = GetWindowName (hWnd)
;exclude Research It Options dialog from this, so only HandleCustomRealWindows will grab it:
if stringCompare (sTitle, cwn_ResearchIt_Options) == 0 then
	sayWindowTypeAndText (hwnd)
	return TRUE;
endIf
sTitle = FormatString (MSG_BuildTitle, StringTrimLeadingBlanks (StringSegment (sTitle, SC_Dash, -1)), StringTrimTrailingBlanks (StringSegment (sTitle, SC_Dash, 1)))
IndicateControlType (WT_DIALOG, sTitle, cScSpace)
Return (TRUE)
EndFunction

Void Function NameChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldName, string sNewName)
var
	Int iControlID

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
	Int iMessage = RegisterWindowMessage (MN_HighlightedControl),
	Variant hWnd = SendMessage (GetAppMainWindow (GetFocus ()), iMessage)
If iWindowType == WT_TREEVIEW
	GetDialogueContainerWindowName (hDialogueContainer)
	If Not GetFirstChild (GetFirstChild (hDialogueContainer))
		SayMessage (OT_STATUS, MSG_PaneEmpty_L, MSG_PaneEmpty_S)
		Return
	EndIf
	if IsWindowDisabled (hwnd) then
		var string sReason = GetSettingsCenterControlDisabledReason (GetFirstChild (hDialogueContainer), hWnd)
		if ! StringIsBlank (sReason) then
			SayMessage (OT_ERROR, sReason)
			return
		endIf
	endIf
EndIf
TypeKey (cKsF6)
EndScript

Script UpALevel()
var
	Handle hFocus,
	Int iWindowType,
	Int iControlID

let hFocus = GetFocus ()
let iControlID = GetControlID (hFocus)
let iWindowType = GetWindowSubtypeCode (hFocus)
If IsPCCursor ()
&& (! UserBufferIsActive ())
&& (! InHJDialog ()) then
/*
	If (iControlID == SettingsTreeViewID
	&& iWindowType == WT_TREEVIEW)
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
	Int iControlID = GetControlID (hFocus),
	Int iWindowType = GetWindowSubtypeCode (hFocus),
	Int iAttributes = GetControlAttributes (),
	Int iSameScript = IsSameScript ()

If iControlID == SettingsTreeViewID
&& iWindowType == WT_TREEVIEW then
	if  ! GetCharacterValue (GetCharacter ()) 
	&& ! getObjectName(SOURCE_CACHED_DATA) then
		if IsSameScript () then
			SpellString (GetWindowName (hFocus))
		else
			say (GetWindowName (hFocus), OT_LINE)
		endIf
	else
		SayTreeViewLevel (FALSE)
	endIf
	If GetWindowClass (hFocus) != WC_SearchTreeList then
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

let hFocus = GetFocus ()
let iControlID = GetControlID (hFocus)
If iControlID == SettingsTreeViewID
&& nSubTypeCode == WT_TREEVIEW
&& GetWindowClass (hFocus) == WC_SearchTreeList then
	BrailleAddString (BrailleGetSubtypeString (WT_LISTBOX), 0, 0, 0)
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
&& (nSubTypeCode == WT_TREEVIEW || nSubtypeCode == WT_TREEVIEWITEM) then
	if GetWindowClass (hFocus) == WC_SearchTreeList then
		Return (TRUE)
	else
		BrailleAddString (IntToString (GetTreeViewLevel ()), 0,0,0)
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
&& nSubTypeCode == WT_TREEVIEW
&& GetWindowClass (hFocus) == WC_SearchTreeList then
	Return (TRUE)
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
		BrailleAddString (gsBrlTreeViewControlState, GetCursorCol (), GetCursorRow (), 0, TRUE) ; Turn translator off for state strings.
	endIf
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

Int Function BrailleAddObjectControlInfo (Int nSubTypeCode)
var
	Handle hFocus = GetFocus (),
	Int iControlID = GetControlID (hFocus)
if getControlAttributes () & CTRL_HASCHILDREN then
	return TRUE; add nothing
endIf
If iControlID == SettingsTreeViewID
&& nSubTypeCode == WT_TREEVIEW
;State comes before the name of the control now, and so do not duplicate control name info on the display:
	If ! gsBrlTreeViewControlState then
		BrailleAddString (gsBrlTreeViewControlName, GetCursorCol (), GetCursorRow (), 0)
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
if iType == WT_EDIT && getControlID (getFocus ()) == SearchEditID
&& ! stringIsBlank (gstrBrlResults) then
	BrailleAddString (gstrBrlResults, 0,0,0)
	return TRUE
endIf
return false
endFunction

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

/*
var
	Int iMessage = RegisterWindowMessage (MN_HighlightedControl),
	Variant hWnd = SendMessage (GetAppMainWindow (GetFocus ()), iMessage)
		GetDialogueContainerWindowName (hDialogue)
SayInteger(hDialogue)
*/



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

Script ChangeToDomain ()
var
	Handle hMain,
	Int iMessage

	let hMain = GetAppMainWindow (GetFocus ())
	let iMessage = RegisterWindowMessage (MN_ChangeToDomain)
	PostMessage (hMain, iMessage, TRUE)
	MSAARefresh ()
	Delay (2)
	Say (GetWindowName (hMain), OT_DIALOG_NAME)
EndScript

Script CopySelectedTextToClipboard ()
var
	String sResult,
	Handle hFocus = GetFocus (),
	Int iWindowType = GetWindowSubtypeCode (hFocus)
if !(GetRunningFSProducts() & product_JAWS) then
	SayCurrentScriptKeyLabel()
	return
endIf
If iWindowType == WT_TREEVIEW
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

If IsPCCursor () then
	if IsInDialogueContainer (hFocus)
	; to avoid double announcement of checkboxes in the right hand pane....
		If iWindowType == WT_CHECKBOX
			Return
		EndIf
	elIf iWindowType == WT_TREEVIEW then
		return
	endIf
EndIf
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

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
; SettingsCenter only: Customize Punctuation dialog box, 
; list view does not call focusChangedEventEX when spaceBar is pressed.
; contrast this with Key Labels page, where FocusChangedEventEX is called.
If !KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	return false
EndIf
var handle focus = getFocus ()
if getWindowSubtypeCode (focus) == WT_LISTVIEW && getControlID (focus) == CustomizePunctuationListViewID then
	var int announcePosition = FALSE
	sayObjectActiveItem (AnnouncePosition)
	return
endIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
endFunction

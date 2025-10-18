; Copyright 1995 - 2024 by Freedom Scientific, Inc.
; Freedom Scientific tutorial help script file

/*************************************
Please Note:
The use of SayUsingVoice operates outside of the standard SayFormattedMessage method,
as it is the best solution to allow TutorialHelp to maintain a constant voice
whether or not the check box is checked.
EndNote
*****************************************************/

Include"HjConst.jsh"
include "MSAAConst.jsh"
Include"HjGlobal.jsh"
include "Winstyles.jsh"
Include "TutorialHelp.jsm"
Include"common.jsm"
import "FSXMLDomFunctions.jsd"

GLOBALS
	int iPrevTypeHelped,
	int iPrevItemState,
	int HelpWasDone


Int Function HelpWasDoneForThisControl (int iTypeToCheck)
; Check to see if help has been spoken before
var
	int iCurrentControlState; for those items that can or cannot be checked
; Remember whether or not the previous control received tutorial help
; Retrieve the current control as a prev glob and get its state if applicable
If GlobalMenuMode > 0 then
	; For now, turn off smart menus
	Let HelpWasDone = true
	Return True
EndIf
If MenusWereActive () then
	; Keep JAWS from repeating the tutorial help
	Let HelpWasDone = true;
	Return true
EndIf
If iTypeToCheck == iPrevTypeHelped then
	If ControlCanBeChecked () then
		If iTypeToCheck == iPrevTypeHelped
		&& iTypeToCheck == WT_CHECKBOX then
			Let iCurrentControlState = ControlIsChecked ()
			If iCurrentControlState != iPrevItemState
			|| iPrevItemState > 1 then
				Let HelpWasDone = false;
				Let iPrevItemState = iCurrentControlState
				Return False;
			EndIf
		Else
			Let iPrevItemState = 1000
		EndIf
	EndIf
	let iPrevTypeHelped = iTypeToCheck
	Let HelpWasDone = true
	Return true;
Else
	let iPrevTypeHelped = iTypeToCheck
	Let iPrevItemState = 1000 ; Don't remember the previous state of checkable controls
	Let HelpWasDone = false
	Return False
EndIf
EndFunction

Int Function MenusWereActive ()
; Checks the menu mode against a previous condition
If GlobalMenuMode > 0 then
	If GlobalMenuMode == GlobalPrevMenuMode then
		Return true
	EndIf
EndIf
EndFunction

string function GetCustomTutorMessage()
;overwrite this function in applications where you want a custom tutor message to be substituted
;instead of the usual tutor message.
;This function is processed after GetFrameTutorMessage and before any of the usual tutor messages are processed.
return cscNull
EndFunction

int function GetTutorialHelpOutputType(optional int IsScriptInvoked)
var
	int RunningProducts = GetRunningFSProducts()
If IsScriptInvoked
	if RunningProducts == product_MAGic then
		return OT_HELP
	else
		;we want an output type which is not ot_tutor,
		;so that it will not be turned off when the user turns off tutor messages.
		;But, we also want an output type which will not flash in braille
		;since we want only speech when the user presses Isnert+Tab.
		return OT_line
	EndIf
EndIf
return OT_tutor
EndFunction

int function SayTutorialHelpForRibbons(int ISpeak)
var
	int iObjtype,
	int iState,
	string sTab,
	string sGroup,
	string sDesc
if !InRibbons() return false endIf
if RibbonsActive() == RibbonCollapsed
	SayUsingVoice (VCTX_MESSAGE, msgRibbonToggleStateTutorHelp, iSpeak)
	return true
endIf
iObjtype = GetObjectSubtypeCode()
if iObjtype == wt_TabControl
	SayUsingVoice (VCTX_MESSAGE, msgRibbonTabTutorialHelp, iSpeak)
elIf iObjtype==wt_buttonDropDown
	SayUsingVoice (VCTX_MESSAGE, msgRibbonButtonDropDownTutorialHelp, iSpeak)
elIf iObjtype==wt_buttonDropdownGrid
	SayUsingVoice (VCTX_MESSAGE, msgRibbonButtonDropdownGridTutorialHelp, iSpeak)
elif iObjtype==wt_splitButton
	SayUsingVoice (VCTX_MESSAGE, msgSplitButtonTutorHelp, iSpeak)
else
	SayUsingVoice (VCTX_MESSAGE, msgLowerRibbonTutorialHelp, iSpeak)
EndIf
return true
EndFunction

Int Function ShouldSkipTutorialHelpForVirtualPcCursor(int iObjType)
if (
	!IsVirtualPcCursor()
	|| IsJavaWindow(GetCurrentWindow())
	|| IsFormsModeActive()
	)
	return false
endIf
if (iObjType == WT_BUTTON || iObjType == WT_CHECKBOX || iObjType == WT_TOGGLE_BUTTON
	|| iObjType == WT_LINK || iObjType == WT_MailTo_link || iObjType == wt_ImageMap_link
	|| iObjType == WT_News_link || iObjType == WT_THISPAGE_LINK)
	return false
endIf
return true
EndFunction

int function SayTutorialHelpForQuickAccessBar(int iSpeak)
	If GetAppFileName () == QuickAccessBarExe
		var handle hCurrentWindow = GetCurrentWindow ()
		var int iWinType = GetWindowSubTypeCode (hCurrentWindow)
		If !iWinType then
			Let iWinType = GetObjectSubTypeCode ()
		EndIf

		if iWinType == WT_UNKNOWN
			SayUsingVoice (VCTX_MESSAGE, msgSpinControlTutorialHelp, iSpeak)
			return true
		EndIf
	EndIf

	return false
EndFunction

Void Function SayTutorialHelp (int iObjType,optional  int IsScriptKey)
; for now, remove all tutor messages in ribbons:
if ribbonsActive () then return TRUE endIf
var
	int iSpeak,
	int iTypeWasHelped,
	string sClass,
	string sCustomTutor,
	string sHotKey,
	string sMessage,
	int iFocusControlID = GetControlID (GetCurrentWindow ()),
	int attributes = GetControlAttributes()
if (iFocusControlID == CID_SaveAsEditCombo
	|| iFocusControlID == CID_OpenEditCombo)
	&& IsScriptKey
		;Do not speak tutorial info in file name field of save or open dialogs.
		return
endIf
iTypeWasHelped = HelpWasDoneForThisControl (iObjType)
; Tutorial Help can be called whether or not the iSpeak flag is set to automatic
iSpeak = GetTutorialHelpOutputType(IsScriptKey)
;Check to see if we have a custom frame message
;Generally created by Prompt Manager
sCustomTutor = GetFrameTutorMessage ()
If sCustomTutor > cScNull then
	SayUsingVoice (VCTX_MESSAGE, sCustomTutor, iSpeak)
	Return
EndIf
;Now check to see if we have a custom message from a customized application:
sCustomTutor = GetCustomTutorMessage ()
If sCustomTutor > cScNull then
	SayUsingVoice (VCTX_MESSAGE, sCustomTutor, iSpeak)
	Return
EndIf
if SayTutorialHelpForRibbons(iSpeak) || SayTutorialHelpForQuickAccessBar(iSpeak)
	return
endIf
If GlobalMenuMode == 1 then
	;Where iObjType fails to be WT_MENUBAR, fudge it.
	SayUsingVoice (VCTX_MESSAGE , msgMenuBar, iSpeak)
	Return
EndIf
If GlobalMenuMode == 2 then
	If iObjType != WT_STARTMENU
	&& iObjType != WT_CONTEXTMENU then
		If ShouldItemSpeak (OT_TUTOR) == TUTOR_ALL then
			if iObjType==wt_edit then ; handle Search Edit field of Start Menu.
				SayUsingVoice (VCTX_MESSAGE,msgStartMenuSearchEditWindow, iSpeak)
			else
				if IsHorizontalMenu() then
					SayUsingVoice (VCTX_MESSAGE, msgHorizontalMenu, iSpeak)
				else
					SayUsingVoice (VCTX_MESSAGE, msgMenu, iSpeak)
				endIf
			endIf
			Return
		EndIf
	EndIf
EndIf
If (ShouldSkipTutorialHelpForVirtualPcCursor(iObjType))
	Return
EndIf
;We need to get the class of the checkable list box because its sub type code is not being recognized.
If GetWindowClass(GetCurrentWindow()) == wc_Checkable_Listbox then
	SayUsingVoice (VCTX_MESSAGE, msgCheckableListBox, iSpeak)
	Return
EndIf
if iObjType == WT_EDIT_SPINBOX
&& !GetObjectIsEditable ()
	iObjType = WT_SPINBOX
endIf
If iObjType == WT_BUTTON then
	If GetObjectMSAAState (0) & STATE_SYSTEM_UNAVAILABLE
		return;do not speak for disabled buttons
	elIf getObjectClassName()  == NetUIModernButton then
		SayUsingVoice (VCTX_MESSAGE, msgEnterButton, iSpeak)
	elIf isVirtualPcCursor () || IsFormsModeActive () then
		SayUsingVoice (VCTX_MESSAGE, msgEnterButton, iSpeak)
	else
		SayUsingVoice (VCTX_MESSAGE, msgButton, iSpeak)
	endIf
elif (iObjType == WT_TOGGLE_BUTTON)
	SayUsingVoice (VCTX_MESSAGE, msgToggleButton, iSpeak)
ElIf iObjType == WT_COMBOBOX then
	SayUsingVoice (VCTX_MESSAGE, msgComboBox, iSpeak)
ElIf iObjType == WT_EDIT
&& GetWindowName(GetRealWindow(GetCurrentWindow())) != msgRegister  then
	SayUsingVoice (VCTX_MESSAGE,msgEdit,iSpeak)
ElIf iObjType == WT_MULTILINE_EDIT then
	if (attributes & CTRL_READONLY)
		SayUsingVoice(VCTX_MESSAGE, msgReadOnlyEdit, iSpeak)
	else
		SayUsingVoice(VCTX_MESSAGE, msgEdit, iSpeak)
	endIf
ElIf iObjType == WT_LISTBOX || iObjType == WT_LISTBOXITEM then
	If IsSelectScriptDlg () then
		SayUsingVoice (VCTX_MESSAGE,msgExecListBox,iSpeak)
	Else
		SayUsingVoice (VCTX_MESSAGE,msgListBox,iSpeak)
	EndIf
ElIf iObjType == WT_LEFTRIGHTSCROLLBAR || iObjType == WT_UPDOWNSCROLLBAR then
	SayUsingVoice (VCTX_MESSAGE, msgScrollBar,iSpeak)
;static windows should never gain focus
;ElIf iObjType == WT_STATIC then
;	SayUsingVoice (VCTX_MESSAGE, msgStatic, iSpeak)
ElIf iObjType == WT_TOOLBAR then
	SayUsingVoice (VCTX_MESSAGE, msgToolBar, iSpeak)
ElIf iObjType == WT_STATUSBAR then
	SayUsingVoice (VCTX_MESSAGE, msgStatusBar, iSpeak)
ElIf iObjType == WT_HEADERBAR then
	SayUsingVoice (VCTX_MESSAGE, msgHeaderBar, iSpeak)
ElIf iObjType == WT_SPINBOX then
	SayUsingVoice (VCTX_MESSAGE, msgSpinBox, iSpeak)
ElIf iObjType == WT_MENU then
	If ShouldItemSpeak (OT_TUTOR) == TUTOR_ALL then
		SayUsingVoice (VCTX_MESSAGE, msgMenu, iSpeak)
	EndIf
	return
ElIf iObjType == WT_DESKTOP /*&& giAllowTopLevelTutorItems*/ then
	SayUsingVoice (VCTX_MESSAGE, msgDesktop, iSpeak)
ElIf iObjType == WT_ICONTITLE then
	SayUsingVoice (VCTX_MESSAGE, msgIconTitle, iSpeak)
ElIf iObjType == WT_MDICLIENT then
	SayUsingVoice (VCTX_MESSAGE, msgMDIClient, iSpeak)
ElIf iObjType == WT_DIALOG then
	SayUsingVoice (VCTX_MESSAGE, msgDialog, iSpeak)
ElIf iObjType == WT_RADIOBUTTON then
	SayUsingVoice (VCTX_MESSAGE, msgRadioButton, iSpeak)
ElIf iObjType == WT_CHECKBOX then
	If ControlIsChecked () then
		SayUsingVoice (VCTX_MESSAGE, msgCheckBoxChecked, iSpeak)
	else
		SayUsingVoice (VCTX_MESSAGE, msgCheckBoxNotChecked, iSpeak)
	EndIf
;ElIf iObjType == WT_GROUPBOX then
	;SayUsingVoice (VCTX_MESSAGE, msgGroupBox, iSpeak)
ElIf iObjType == WT_SDM then
	SayUsingVoice (VCTX_MESSAGE, msgSDMDialog, iSpeak)
ElIf iObjType == WT_GENERALPICTURE then
	SayUsingVoice (VCTX_MESSAGE, msgGeneralPicture, iSpeak)
ElIf iObjType == WT_HOTKEY then
	SayUsingVoice (VCTX_MESSAGE, msgHotKeyEdit, iSpeak)
ElIf iObjType == WT_TABCONTROL then
	if !IsFormsModeActive() then
		sHotKey = FindHotKey()
		if StringContains (sHotKey, "|") then
			sMessage = FormatString (msgTabControlWithHotKey, StringSegment (sHotKey, "|", 1))
		elIf IsOnWebPage()
			;there is no standard for tab control here, so say nothing:
			return
		else
			sMessage = FormatString(msgTabControl)
		EndIf
		SayUsingVoice (VCTX_MESSAGE, sMessage, iSpeak)
	else
		if !(GetControlAttributes() & CTRL_SELECTED) then
			SayUsingVoice (VCTX_MESSAGE, msgVirtualTabControl, iSpeak)
		EndIf
	EndIf
ElIf iObjType == WT_LISTVIEW || iObjType == WT_LISTVIEWITEM then
	if isScriptKey then
		BeginFlashMessage ()
	endIf
	SayUsingVoice (VCTX_MESSAGE, msgListView, iSpeak)
	;For list views that allow editing:
	if getWindowStyleBits (GetCurrentWindow ()) & LVS_EDITLABELS then
		SayUsingVoice (VCTX_MESSAGE, msgListViewEdit, iSpeak)
	endIf
	if isScriptKey then
		endFlashMessage ()
	endIf
ElIf iObjType == WT_TREEVIEW
|| iObjType == wt_TreeViewItem then
	SayUsingVoice (VCTX_MESSAGE, msgTreeView, iSpeak)
ElIf iObjType == WT_STARTMenu then
	If ShouldItemSpeak (OT_TUTOR) == TUTOR_ALL then
		SayUsingVoice (VCTX_MESSAGE, msgStartMenu, iSpeak)
	EndIf
ElIf iObjType == WT_CONTEXTMENU then
	If ShouldItemSpeak (OT_TUTOR) == TUTOR_ALL then
		SayUsingVoice (VCTX_MESSAGE, msgContextMenu, iSpeak)
	EndIf
ElIf iObjType == WT_TASKBAR /*&& giAllowTopLevelTutorItems*/ then
	SayUsingVoice (VCTX_MESSAGE, msgTaskBar, iSpeak)
ElIf iObjType == WT_MULTISELECT_LISTBOX then
	SayUsingVoice (VCTX_MESSAGE, msgMultiSelectListBox, iSpeak)
ElIf iObjType == WT_EXTENDEDSELECT_LISTBOX then
	SayUsingVoice (VCTX_MESSAGE, msgExtendedSelectListBox, iSpeak)
ElIf iObjType == WT_LEFTRIGHTSLIDER then
	SayUsingVoice (VCTX_MESSAGE, msgLeftRightSlider, iSpeak)
ElIf iObjType == WT_UPDOWNSLIDER then
	SayUsingVoice (VCTX_MESSAGE, msgUpDownSlider, iSpeak)
ElIf iObjType == WT_EDITCOMBO then
	SayUsingVoice (VCTX_MESSAGE, msgEditCombo, iSpeak)
ElIf iObjType == WT_PASSWORDEDIT then
	SayUsingVoice (VCTX_MESSAGE, msgPasswordEdit, iSpeak)
ElIf iObjType == WT_READONLYEDIT then
	SayUsingVoice (VCTX_MESSAGE, msgReadOnlyEdit, iSpeak)
ElIf iObjType == WT_COMMANDBAR then
	SayUsingVoice (VCTX_MESSAGE, msgCommandBar, iSpeak)
ElIf iObjType == WT_SYSTRAY then
	SayUsingVoice (VCTX_MESSAGE, msgSysTray, iSpeak)
ElIf iObjType == WT_MENUBAR then
	SayUsingVoice (VCTX_MESSAGE , msgMenuBar, iSpeak)
ElIf iObjType == WT_EDIT_SPINBOX then
	SayUsingVoice (VCTX_MESSAGE, msgEditSpinBox, iSpeak)
elif iObjType==wt_startButton then
	sayUsingVoice(vctx_message,msgStartButton,iSpeak)
elif iObjType==WT_ButtonMenu then
	sayUsingVoice(vctx_message,msgButtonMenu,iSpeak)
elif iObjType==WT_GRID then
	sayUsingVoice(vctx_message,msgTutorialHelpGrid,iSpeak)
elIf iObjType == WT_MathContent then
	sayUsingVoice(vctx_message,msgTutorialHelpMath,iSpeak)
ElIf iObjType == WT_SearchBox then
	SayUsingVoice (VCTX_MESSAGE,msgEdit,iSpeak)
elif (iObjType == WT_LINK || iObjType == WT_MailTo_link || iObjType == wt_ImageMap_link
	|| iObjType == WT_News_link || iObjType == WT_THISPAGE_LINK)
	SayUsingVoice(VCTX_MESSAGE, msgEnterButton, iSpeak)
EndIf
EndFunction

void function ExpandAltCommaInHotKey(string byRef sHotKey)
if StringContains(sHotKey,sc_HotKey_AltComma) then
	let sHotKey = StringReplaceSubstrings(sHotkey,sc_HotKey_AltComma,cmsgHotKeyAltfollowedBy)
endIf
EndFunction

Int Function SayTutorialHelpHotKey (handle hHotKeyWindow,optional  int IsScriptKey)
var
	handle hwnd,
	int iWinType,
	int iSpeak,
	int iPunctuationLevel,
	string sHotKey,
	string sMessage,
	int iControlID = GEtControlID (hHotKeyWindow)
	if (iControlID == CID_SaveAsEditCombo
	|| iControlID == CID_OpenEditCombo)
	&& IsScriptKey
		;Do not speak tutor info in file name field of save or open dialogs when INSERT+TAB is used.
		return
endIf
; for the Tutorial HotKeyMode
If IsScriptKey then
	Let iSpeak = OT_HELP
Else
	Let iSpeak = OT_access_key
EndIf
Let iWinType = GetObjectSubTypeCode()
If GlobalMenuMode then
	if IsVirtualRibbonActive() then
		;Do nothing, hotkeys are irrelevant in virtual ribbons:
		return false
	EndIf
EndIf
let sHotKey = FindHotKey()
If sHotKey != cscNull then
	If StringContains (sHotKey, "|") then
		let sHotKey = StringSegment (sHotKey, "|", -1)
	EndIf
	ExpandAltCommaInHotKey(sHotKey)
	let sMessage = FormatString (msgHotKeyText, sHotKey)
	;Sets level to 'All' to announce hot keys consisting of punctuation characters...
	let iPunctuationLevel=GetVoicePunctuation (VCTX_MESSAGE) ; Saves current punctuation level...
	SetVoicePunctuation (VCTX_MESSAGE, 3) ; Set level for message voice context to 'all'...
	SayUsingVoice (VCTX_MESSAGE, sMessage, iSpeak)
	SetVoicePunctuation (VCTX_MESSAGE,iPunctuationLevel) ; Reset level.
	return true
else
	return FALSE
EndIf
EndFunction

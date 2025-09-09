; Copyright 1995-2021 Freedom Scientific, Inc.
;modified to remove version checking

include "NlNotes.jsh"
include "NlNotes.jsm"
include"HjHelp.jsh"
include "HjConst.jsh"
include "HjGlobal.jsh"
include "common.jsm"
include "MSAAConst.jsh"
include "magic.jsh"

import "quickset.jsd"

globals
	int g_smartNavMax,
	handle hContext, ; for the Context-Sensitive Help
	int NotesFirstTime,
	int nSuppressEcho,
	String sCurrentObjectName,
   String sOldObjectName,
	Int g_iStatusLineReading,
string glnWindowName

void function loadNonJCFOptions ()
let g_iStatusLineReading = getNonJCFOption ("ReadStatusLine", rsStandardLayering)
setJCFOption (optSmartNavigation, 0)
g_smartNavMax = 0
WriteSettingInteger (SECTION_HTML, hKey_Smart_navigation, 0, FT_CURRENT_JCF, rsStandardLayering)
loadNonJCFOptions ()
endFunction

void Function AutoStartEvent ()
let g_iStatusLineReading = IniReadInteger ("options", "ReadStatusLine", 1, "Lotus Notes.jsi")
let glnWindowName = "";
setJCFOption (optSmartNavigation, 0)
g_smartNavMax = 0
WriteSettingInteger (SECTION_HTML, hKey_Smart_navigation, 0, FT_CURRENT_JCF, rsStandardLayering)
EndFunction

void function AutoFinishEvent()
let glnWindowName = "";
AutoFinishEvent()
EndFunction

void function ToggleSmartNavLevelAndResetDocPresentation ()
sayMessage (OT_ERROR, msgSmartNavigationNotAvailable)
endFunction

void function SayObjectActiveItem ()
var
	int iObjType
Let iObjType = GetObjectSubTypeCode ()
If iObjType == WT_TREEVIEW ||
iObjType == WT_TREEVIEWITEM then
	SayTreeViewLevel ()
	Return
EndIf
SayObjectActiveItem ()
EndFunction

Script SayLine ()
var
	int iObjType
Let iObjType = GetObjectSubTypeCode ()
 If IsSameScript () then
	SpellLine ()
ElIf (iObjType == WT_TREEVIEWITEM) then
	SayTreeViewLevel ()
	return
Else
	PerformScript SayLine ()
EndIf
EndScript

void Function DocumentLoadedEvent ()
var
	int iNumOfLinks,
	string strLinkCount,
	string sMessageLong,
	string sMessageShort
;;;Added 2/2005 by Frank DiPalermo to automatically read notes as they are opened
TurnOffFormsMode()
if GetWindowClass (GetFocus ()) != IE4Class then
	PCCursor()
	if  (IsVirtualPCCursor()) then
		StopSpeech ()
		SayAll()
	endif
else
	DocumentLoadedEvent () ; For IEServer windows
endif
;;;End of added
EndFunction

void Function SayNonHighlightedText (handle hWnd, string buffer)
var
  int iObjType
If (g_iStatusLineReading) Then
  Let iObjType = GetWindowSubTypeCode (hWnd)
  If (iObjType == WT_STATUSBAR) Then
    SayUsingVoice (VCTX_MESSAGE, buffer, ot_nonhighlighted_screen_text)
  elif ((GetWindowClass(hWnd) == wcNotes8StdWindowClass) && (GetControlId(hWnd) == HWnd))
     && ((GetWindowHierarchyY(hWnd) == 3) && (GetWindowHierarchyX(hWnd)== 1))
  then /* announce status information in Lotus Notes 8 Standard */
    SayUsingVoice (VCTX_MESSAGE, buffer, ot_nonhighlighted_screen_text)
  EndIf
EndIf
SayNonHighlightedText (hWnd, buffer)
EndFunction

void Function SayHighlightedText (handle hWnd, string buffer)
var
	int iWinType,
	int iControl,
	handle hReal,
	handle hFocus,
	string sHwndClass,
	string sRealName
let sHwndClass = GetWindowClass (hWnd)
Let iWinType = GetObjectSubTypecode()
If((iWinType == WT_TREEVIEW || iWinType == WT_TREEVIEWITEM)
  && sHwndClass=="IRIS.odlistList") then
	Return
endif
If InHjDialog () then
	SayHighlightedText (hWnd, buffer)
	Return
EndIf
If nSuppressEcho == TRUE then
	Let nSuppressEcho = FALSE;
	Return;
EndIf
;Let's "borrow" iWinType just to check the Tree objects and bail with SayTreeViewLevel
;To make trees act as normal as possible
let iWinType = GetWindowSubtypeCode (GetCurrentWindow ())
let iControl = GetControlId (hWnd)
let hReal = GetRealWindow (GetCurrentWindow ())
let hFocus = GetFocus ()
let sHwndClass = GetWindowClass (hWnd)
let sRealName = GetWindowName (hReal)
if (DialogActive ()) then
	;wn1 = "Spell Check"
	if (sRealName == wn1) then
		if iControl == iD_Replace_Edit then
		;(hReal != GlobalPrevReal)) then
			if (hWnd == hFocus) then
				PerformScript ReadMistakeAndSuggestion()
			endif
			return
		endif
	endif
	if (iWinType != WT_COMBOBOX) then
		if (hWnd != hFocus) then
			return
		endif
	endif
endif
SayHighlightedText (hWnd, buffer)
EndFunction

Void Function isNotesWindow(handle hwnd)
var string shwndClass
let shwndClass = GetWindowClass (hwnd)
if (shwndClass==wcDocClass) then
	return 1
else
	return 0
endif
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let RealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow (RealWindow)
if (GlobalPrevApp != AppWindow && AppWindow != FocusWindow) then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
	If ! GlobalWasHjDialog then
		SayWindowTypeAndText (AppWindow)
	EndIf
endIf
If ((GlobalPrevRealName != RealWindowName) ; name has changed
  || (GlobalPrevReal != RealWindow)) then ; or handle has changed
	;If ((RealWindow != AppWindow) &&
	;We commented above line, because
	;Otherwise, when switching windows, no real audio feedback was given.
	If (RealWindow != FocusWindow) then
		If ! GlobalWasHjDialog then
			;GlobalWasHjDialog prevents over chatter, especially when exiting a list box and returning to a client area.
			;Set to FALSE when one HjDialog follows another
			;Example:
			;AddBrailleColors function
			SayWindowTypeAndText (RealWindow)
		EndIf
	endIf
EndIf
let GlobalFocusWindow = FocusWindow
if (GetObjectSubTypeCode (true, 0)==WT_GROUPBOX) then
	IndicateControlType (WT_GROUPBOX)
EndIf
SayFocusedWindow ()

;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
Let GlobalWasHjDialog = InHjDialog ()
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction


Script  ScriptFileName()
ScriptAndAppNames("Lotus Notes")
EndScript

Script ScreenSensitiveHelp ()
var
	int iTypeCode,
	int iWinTypeCode,
	string sChildClass,
	string sClass,
	string sParentClass,
	string sAppWinName,
	string sObjName,
	string sWord,
	string sTemp_L,
	string sTemp_s
	if (IsSameScript ()) then
		AppFileTopic (topic_Lotus_Notes)
		return
	endif
	let iTypeCode = GetObjectSubTypeCode ()
	If GlobalMenuMode > 0 then
		PerformScript ScreenSensitiveHelp ()
		Return
	EndIf
	If UserBufferIsActive () then
		;Call Default to handle
		PerformScript ScreenSensitiveHelp()
		;UserBufferDeactivate ()
		;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
		Return
	EndIf
	; For Virtual PC Cursor
	if IsVirtualPCCursor () then
		SayFormattedMessage (ot_USER_BUFFER, msgSSHelp8_L, msgSSHelp8_S)
		AddHotKeyLinks ()
		return
	endif
	If ScreenSensitiveHelpForJAWSDialogs() then
		Return
	Endif
	let iWinTypeCode = GetWindowSubTypeCode (GetCurrentWindow ())
	let sChildClass = GetWindowClass (GetFirstChild (GetCurrentWindow ()))
	let sClass = GetWindowClass (GetCurrentWindow ())
	let sParentClass = GetWindowClass (GetParent (GetCurrentWindow ()))
	let sAppWinName = GetWindowName (GetAppMainWindow (GetCurrentWindow ()))
	let sObjName = GetObjectName ()
	let sWord = GetWord ()
	if (iWinTypeCode == WT_MULTISELECT_LISTBOX) then
		ScreenSensitiveHelpForKnownClasses (WT_MULTISELECT_LISTBOX)
		return
	endif
	;For the Date Picker, a visual representation of the calendar
	if (sChildClass == wcCalClass) then
		SayFormattedMessage (ot_USER_BUFFER, msgSSHelp9_L, msgSSHelp9_S)
		AddHotKeyLinks ()
		return
	endif
	if (sClass == wcWorkspaceList) then
		ScreenSensitiveHelpForKnownClasses (WT_LISTVIEW)
		return
	endif
	;for Object types
	if (iTypeCode) then
		let sClass = GetWindowClass (GetCurrentWindow ())
		if (iTypeCode == WT_TREEVIEWITEM) then
			ScreenSensitiveHelpForKnownClasses (WT_TREEVIEW)
		ElIf sClass == wcDocClass then
			;This will only show up if you're editing the document.
			If iTypeCode == WT_EDIT then
				;Special message only for edit boxes, especially the main message area.
				SayFormattedMessage (OT_USER_BUFFER, msgSSHelp11_L)
				AddHotKeyLinks ()
				Return
			ElIf ! iTypeCode then
				;Probly the main document area, definitly not a form field or embedded obj
				ScreenSensitiveHelpForKnownClasses (WT_MULTILINE_EDIT)
				Return
			EndIf
		else
			ScreenSensitiveHelpForKnownClasses (iTypeCode)
		endif
		return
	endif
	;for the Tree view, when it is slightly out of focus
	if ((sClass == wcTreeParent) || (sClass == wcGoToTree)) then
		if (! iTypeCode) then
			if (StringContains (sAppWinName, wn19)) then
				SayFormattedMessage (ot_USER_BUFFER, msgSSHelp10_L, msgSSHelp10_S)
				AddHotKeyLinks ()
				return
			else
				ScreenSensitiveHelpForKnownClasses (WT_TREEVIEW)
				return
			endif
		endif
	endif
	PerformScript ScreenSensitiveHelp ()
EndScript

Script HotKeyHelp ()
var
	int iObjType,
	handle hWnd,
	string sRealName,
	string sClass,
	string sTemp_L,
	string sTemp_S
if TouchNavigationHotKeys() then
	return
endIf
let iObjType = GetObjectSubTypeCode ()
let hWnd = GetCurrentWindow ()
let sRealName = GetWindowName (GetRealWindow (hWnd))
let sClass = GetWindowClass (hWnd)
if (GlobalMenuMode > 0) then
	PerformScript HotKeyHelp ()
	return
endif
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if (DialogActive ()) then
	;wn1 = "Spell Check"
	if (sRealName == wn1) then
		SayFormattedMessage (ot_USER_BUFFER, msgHKHelp1_L, msgHKHelp1_S)
	endif
	return
endif
;For Database frames
let sTemp_L = msgHKHelp2_L + cScBufferNewLine
let sTemp_S = msgHKHelp2_S + cScBufferNewLine
;For the inline browser
if ((iObjType == WT_HTMLBODY) || (iObjType == WT_LINK)) then
	let sTemp_L = AddToString(sTemp_L,msgHKHelp3_L)
	let sTemp_S = AddToString(Stemp_S,msgHKHelp3_S)
	SayFormattedMessage (ot_USER_BUFFER, sTemp_L, sTemp_S)
	return
endif
if ((iObjType == WT_TREEVIEW) || (iObjType == WT_TREEVIEWITEM)) then
	let sTemp_L = AddToString(sTemp_L,msgHKHelp4_L)
	let sTemp_S = AddToString(sTemp_S,msgHKHelp4_S)
	SayFormattedMessage (ot_USER_BUFFER, sTemp_L, sTemp_S)
	return
endif
PerformScript HotKeyHelp ()
EndScript

Script WindowKeysHelp ()
var
	int iObjType,
	handle hWnd,
	string sAppWinName,
	string sClass,
	string sTemp_L,
	string sTemp_S
	let iObjType = GetObjectSubTypeCode ()
	let hWnd = GetCurrentWindow ()
	let sAppWinName = GetWindowName (GetAppMainWindow (GetCurrentWindow ()))
	let sClass = GetWindowClass (hWnd)

If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
let sTemp_L =msgWKHelp1_L + cScBufferNewLine
let sTemp_S =msgWKHelp1_S + cScBufferNewLine
;For Properties Boxes
if (sClass == wcProperties || sClass == wcProperties2) then
	let sTemp_L = AddToString(sTemp_L,msgWKHelp2_L)
	let sTemp_S = AddToString(sTemp_S,msgWKHelp2_S)
	SayFormattedMessage (ot_USER_BUFFER, sTemp_L, sTemp_S)
	userBufferAddText(cscBufferNewLine+cmsgBuffExit)
	return
endif
; for pickers found in documents and forms
if (sClass == wcDocClass) then
	if (iObjType == WT_BITMAP) then
		if (! CaretVisible ()) then
			;wn7 = "New Calendar Entry"
			if (StringContains (sAppWinName, wn7)) then
				let sTemp_L = AddToString(sTemp_L, msgWKHelp3_L)
				let sTemp_S = AddToString(sTemp_S, msgWKHelp3_S)
				SayFormattedMessage (ot_USER_BUFFER, sTemp_L, sTemp_S)
				userBufferAddText(cscBufferNewLine+cmsgBuffExit)
				return
			endif
		endif
	endif
endif
if (sClass == wcDocClass) then
	if (! CaretVisible ()) then
		let sTemp_L = AddToString(sTemp_L,msgWKHelp4_L)
		let sTemp_S = AddToString(sTemp_S,msgWKHelp4_S)
		SayFormattedMessage (ot_USER_BUFFER, sTemp_L, sTemp_S)
		userBufferAddText(cscBufferNewLine+cmsgBuffExit)
		return
	elif (CaretVisible ()) then
		let sTemp_L = AddToString(sTemp_L,msgWKHelp5_L)
		let sTemp_S = AddToString(sTemp_S,msgWKHelp5_S)
		SayFormattedMessage (ot_USER_BUFFER, sTemp_L, sTemp_S)
		userBufferAddText(cscBufferNewLine+cmsgBuffExit)
		return
endif
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	userBufferAddText(cscBufferNewLine+cmsgBuffExit)
		return
endif
if (sClass == IE4Class) then
	let sTemp_L = AddToString(sTemp_L,msgWKHelp6_L)
	let sTemp_S = AddToString(sTemp_S,msgWKHelp6_S)
	SayFormattedMessage (ot_USER_BUFFER, sTemp_L, sTemp_S)
	userBufferAddText(cscBufferNewLine+cmsgBuffExit)
	return
endif
PerformScript WindowKeysHelp ()
EndScript

Script SayPriorCharacter ()
var
	int iObjType
let iObjType = GetObjectSubTypeCode ()
if(IsPcCursor ()) then
	if (iObjType==WT_TABCONTROL) then
		PriorCharacter()
		return
	endif

;Only to handle opening and closing of tree items since they do not use standard keystrokes.
;We emulate standard windows.
	if ((iObjType == WT_TREEVIEW) || (iObjType == WT_TREEVIEWITEM)) then
		TypeCurrentScriptKey ()
		return
	EndIf
EndIf

PerformScript SayPriorCharacter ()
EndScript

Script SayNextCharacter ()
var
	int iObjType

let iObjType = GetObjectSubTypeCode ()
if (IsPcCursor ()) then
	if (iObjType==WT_TABCONTROL) then
		NextCharacter()
		return
	EndIf

;Only to handle opening and closing of tree items since they do not use standard keystrokes.
;We emulate standard windows.
	if ((iObjType == WT_TREEVIEW) || (iObjType == WT_TREEVIEWITEM)) then
		TypeCurrentScriptKey ()
		return
	EndIf
EndIf

PerformScript SayNextCharacter ()
EndScript

Script MoveToNextSelectedDocument ()
var
	Handle hCurrWin
SayCurrentScriptKeyLabel ()
Let hCurrWin = GetFocus ()
{F3}
Delay (5)
If (IsVirtualPCCursor ()) && (GetFocus () == hCurrWin) Then
	Refresh ()
EndIf
EndScript

Script MoveToPrevSelectedDocument ()
var
	Handle hCurrWin
SayCurrentScriptKeyLabel ()
Let hCurrWin = GetFocus ()
{shift+F3}
Delay (5)
If (IsVirtualPCCursor ()) && (GetFocus () == hCurrWin) Then
	Refresh ()
EndIf
EndScript

Script MoveToNextUnreadDocument ()
var
	Handle hCurrWin
SayCurrentScriptKeyLabel ()
Let hCurrWin = GetFocus ()
{F4}
Delay (5)
If (IsVirtualPCCursor ()) && (GetFocus () == hCurrWin) Then
	Refresh ()
EndIf
EndScript

Script MoveToPrevUnreadDocument ()
var
	Handle hCurrWin
SayCurrentScriptKeyLabel ()
Let hCurrWin = GetFocus ()
{shift+F4}
Delay (5)
If (IsVirtualPCCursor ()) && (GetFocus () == hCurrWin) Then
	Refresh ()
EndIf
EndScript

Script JAWSDelete ()
var
	Handle hCurrWin
If IsVirtualPCCursor () Then
	Let hCurrWin = GetFocus ()
	{Delete}
	Delay (5)
	If GetFocus () == hCurrWin Then
		Refresh ()
	EndIf
Else
	PerformScript JAWSDelete ()
EndIf
EndScript

Script JAWSBackspace ()
var
	int TheObjType,
	Handle hCurrWin
If IsVirtualPCCursor () Then
	Let hCurrWin = GetFocus ()
	{BackSpace}
	Delay (5)
	If GetFocus () == hCurrWin Then
		Refresh ()
	EndIf
Else
	PerformScript JAWSBackspace ()
EndIf
EndScript
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;End of special keys for handle change problem
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

Script ExpandAll ()
TypeKey(ks7)
SayFormattedMessage (ot_status, msg6_L); "expand all"
EndScript

Script CollapseAll ()
TypeKey(ks8)
SayFormattedMessage (ot_status, msg7_L); "collapse all"
EndScript

;;;Added 2/2005 by Frank DiPalermo to read AccDescription
Script SayFieldHelp ()
var
	string description

let description = GetObjectDescription (true, 0)
if (StringLength (description)>0) then
	SayFormattedMessage(OT_HELP, description)
else
	SayFormattedMessage(OT_HELP, msg_NoHelpAvailable)
EndIf
EndScript

Script ReadMistakeAndSuggestion ()
var
	handle hReal,
	handle hWnd,
	string sRealName
let hReal = GetRealWindow (GetFocus ())
let sRealName = GetWindowName (hReal)
if ((DialogActive ()) && (sRealName == wn1)) then
;wn1 = "Spell Check"
	SaveCursor ()
	InvisibleCursor ()
	let hWnd = FindDescendantWindow (hReal, iD_Replace_Edit)
	MoveToWindow (hWnd)
	SayWindowTypeAndText (hWnd)
	SpellString (GetWindowText (hWnd, false))
	let hWnd = FindDescendantWindow (hReal, iD_Guess_list)
	MoveToWindow (hWnd)
	if (! GetWindowText (hWnd, false)) then
		SayFormattedMessage (ot_JAWS_message, msg11_L); "No suggestions"
		return
	elif (! GetWindowText (hWnd, true)) then
		SayFormattedMessage (ot_error, msg10_L); "No suggestion is highlighted"
		return
	else
		SayFormattedMessage (ot_control_name, msg9_L); "Guess: ListBox"
		SayFormattedMessage (ot_user_requested_information, GetWindowText (hWnd, true))
		SpellString (GetWindowText (hWnd, true))
	endif
	return
endif
SayFormattedMessage (ot_JAWS_message, msg12_L); "Not in spellChecker"
EndScript

int function SelectALinkDialog()
if InHjDialog () then
	PerformScript RunJAWSManager () ; Speak common messages spoken for HJ dialogs
	return true
endif
if ! DlgListOfLinks () then
	SayFormattedMessage (ot_error, msg14_L); "No links found in document"
	return true
endif
return true
EndFunction

string Function AddToString(String ByRef Base, String strNew)
let Base = Base + strNew + cScBufferNewLine
Return Base
EndFunction

Script ActionButtons ()
var
	int index,
	int iKeyPos,
	handle hWndCheckPoint,
	handle hWndClick,
	string strHwndList,
	string strTempItem,
	string strTextList
If InHjDialog () then
	PerformScript RunJAWSManager (); This will speak the correct message
	Return
ElIf DialogActive () then
	SayMessage (OT_ERROR, msgBarNotAvailable)
	Return
EndIf
Let hWndCheckPoint = FindWindow (GetAppMainWindow(GetFocus()), wcActionBar, "")
if hwndCheckPoint == 0 then
      SayMessage (OT_ERROR, msgBarNotFound);"Action bar not found"
      Return
EndIf
Let hWndCheckPoint = (GetFirstChild (hWndCheckPoint))
;All the windows are action buttons when this works right
If (GetWindowClass (hWndCheckPoint) != wcActionButton) then
	SayMessage (OT_ERROR, msgNoButtons)
	Return;
EndIf
If IsWindowVisible (hWndCheckPoint) then
	Let iKeyPos = 1;First keystroke in tab order
	Let strHwndList = (IntToString (hWndCheckPoint))
	Let strTextList = FormatString (strListItem,
	(GetWindowName (hWndCheckPoint)),
	(IntToString (iKeyPos)))
EndIf
While (GetNextWindow (hWndCheckPoint))
	Let hWndCheckPoint = GetNextWindow (hWndCheckPoint)
	If IsWindowVisible (hWndCheckPoint) then
		Let iKeyPos = iKeyPos+1
		Let strHwndList = strHwndList+LIST_ITEM_SEPARATOR+
		(IntToString (hWndCheckPoint))
		Let strTempItem =
		FormatString (strListItem, (GetWindowName (hWndCheckPoint)), (IntToString (iKeyPos)))
		Let strTextList = strTextList+LIST_ITEM_SEPARATOR+strTempItem
	EndIf
EndWhile
Let nSuppressEcho = TRUE
Let index = dlgSelectItemInList (strTextList, strActionDlgName, FALSE)
If index == 0 then
	Let nSuppressEcho = FALSE;
	Return;
EndIf
Let hWndClick = (StringToHandle (StringSegment (strHwndList, LIST_ITEM_SEPARATOR, index)))
;Simulate a click w/o moving mouse
SaveCursor ()
InvisibleCursor ()
MoveToWindow (hWndClick)
RoutePcToInvisible ()
RestoreCursor ()
Let nSuppressEcho = FALSE
EndScript

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
var
	int iObjType
Let iObjType = GetObjectSubtypeCode ()
if iObjType == WT_TREEVIEWITEM && nSelectingText then
SayObjectActiveItem()
return
EndIf
var
int bJavaWindow,
	handle hWinSwitch
; Keep alt+tab from over-talking
let hWinSwitch = findTopLevelWindow (cwc_Dlg32771, cscNull)
if ((0 != hWinSwitch) && (TRUE == IsWindowVisible (hWinSwitch))) then
	Return
EndIf
Let bJavaWindow = IsJavaWindow (curHwnd)
if ((bJavaWindow) && (g_JavaIgnoreNextActiveItemChange)) then
	let g_JavaIgnoreNextActiveItemChange = 0
	return
endIf

if (iObjType == WT_EDIT) then
	Let sCurrentObjectName = GetObjectName ()
	If sOldObjectName == sCurrentObjectName Then
		Return
	Else
		Let sOldObjectName = sCurrentObjectName
	EndIf
EndIf

if (iObjType == WT_TABCONTROL) then
	SaveCursor ()
	PCCursor ()
	SayObjectActiveItem()
	RestoreCursor ()
	return
endIf

if (iObjType == WT_TREEVIEWITEM) then
	if (GetWindowClass (curHwnd) == cwc_SysTreeView32) then
		if (GetObjectStateCode (true, 0)&CTRL_SELECTED) then
			SayTreeViewLevel(true)
		EndIf
	else
		SayTreeViewLevel(true)
	EndIf
	return
EndIf

ActiveItemChangedEvent (curHwnd, curObjectId,curChildId,prevHwnd, prevObjectId,prevChildId)
EndFunction

Script SayNextLine ()
var
	handle hCurrentWindow,
	int TheTypeCode,
	string sHwndClass
let hCurrentWindow = GetCurrentWindow()
let TheTypeCode = GetObjectSubTypeCode ()
let sHwndClass = GetWindowClass (hCurrentWindow)

If (((TheTypeCode==WT_TREEVIEW) || (TheTypeCode==WT_TREEVIEWITEM))) && (IsPCCursor ()) Then
	NextLine()
	Return
endIf

if (theTypeCode == WT_Combobox && IsPCCursor ()) then
	NextLine ()
	return
EndIf

if ( theTypeCode == WT_EDIT ) then
let sHwndClass = GetWindowClass ( GetParent( hCurrentWindow ) )
if ( sHwndClass == "iris.csctl" ) then
NextLine()
delay(1)
Say (GetObjectValue(), OT_SELECTED_ITEM, false)
return;
EndIf
EndIf

if ( theTypeCode == WT_LISTBOX ) then
NextLine()
delay(2)
;SayLine()
Say (GetObjectValue( true ), OT_SELECTED_ITEM, false)
return;
EndIf

if ( theTypeCode == WT_EditCombo) then
	NextLine()
	delay(2)
	Say (GetObjectValue( true ), OT_SELECTED_ITEM, false)
	return;
EndIf

;speak sections
if ( theTypeCode == WT_MULTILINE_EDIT) then
	var
		int nextLineType
	NextLine()
	delay(1)
	let nextLineType = GetObjectSubTypeCode (true,0)
	if (nextLineType == WT_GROUPBOX) then
		Say (GetObjectValue( true ), OT_SELECTED_ITEM, false)
	else
		SayLine(2)
	EndIf
	return;
EndIf

PerformScript SayNextLine()
EndScript

Script SayPriorLine ()
var
	handle hCurrentWindow,
	int TheTypeCode,
	string sHwndClass
let hCurrentWindow = GetCurrentWindow()
let TheTypeCode = GetObjectSubTypeCode ()
let sHwndClass = GetWindowClass (hCurrentWindow)

If (((TheTypeCode==WT_TREEVIEW) || (TheTypeCode==WT_TREEVIEWITEM))) && (IsPCCursor ())  Then
	PriorLine()
	Return
endIf

if (theTypeCode == WT_Combobox && IsPCCursor ()) then
	PriorLine ()
	return
EndIf

if ( theTypeCode == WT_EDIT ) then
let sHwndClass = GetWindowClass ( GetParent( hCurrentWindow ) )
if ( sHwndClass == "iris.csctl" ) then
PriorLine()
delay(1)
Say (GetObjectValue(), OT_SELECTED_ITEM, false)
return;
EndIf
EndIf

if ( theTypeCode == WT_LISTBOX ) then
PriorLine()
delay(2)
;SayLine()
Say (GetObjectValue( true ), OT_SELECTED_ITEM, false)
return;
EndIf

if ( theTypeCode == WT_EditCombo) then
	PriorLine()
	delay(2)
	Say (GetObjectValue( true ), OT_SELECTED_ITEM, false)
	return;
EndIf

;speak sections
if ( theTypeCode == WT_MULTILINE_EDIT) then
	var
		int priorLineType
	PriorLine()
	Delay(1)
	let priorLineType = GetObjectSubTypeCode (true,0)
	if (priorLineType == WT_GROUPBOX) then
		Say (GetObjectValue( true ), OT_SELECTED_ITEM, false)
	else
		SayLine(2)
	EndIf
	return;
EndIf

PerformScript SayPriorLine()
EndScript


Script MoveToNextRadioButton ()
if !IsVirtualPCCursor() then
	SayFormattedMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
if MoveToControlType(s_next,wt_radiobutton) then
	if not SayAllInProgress() then
		SayLine()
	endIf
else
	SayNothingFoundEx(s_next,cVMsgRadioButton1_L)
endIf
EndScript


Script MoveToPriorRadioButton ()
if !IsVirtualPCCursor() then
	SayFormattedMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
if MoveToControlType(s_prior,wt_radiobutton) then
	if not SayAllInProgress() then
		SayLine()
	endIf
else
	SayNothingFoundEx(s_prior,cVMsgRadioButton1_L)
endIf
EndScript

Script MoveToNextCombo ()
if !IsVirtualPCCursor() then
	SayFormattedMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
if MoveToControlType(s_next,wt_combobox) then
	if not SayAllInProgress() then
		SayLine()
	endIf
else
	SayNothingFoundEx(s_next,cVMsgComboBox1_L)
endIf
EndScript

Script MoveToPriorCombo ()
if !IsVirtualPCCursor() then
	SayFormattedMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
if MoveToControlType(s_prior,wt_combobox) then
	if not SayAllInProgress() then
		SayLine()
	endIf
else
	SayNothingFoundEx(s_prior,cVMsgComboBox1_L)
endIf
EndScript

Script MoveToNextCheckbox ()
if !IsVirtualPCCursor() then
	SayFormattedMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
if MoveToControlType(s_next,wt_checkbox) then
	if not SayAllInProgress() then
		SayLine()
	endIf
else
	SayNothingFoundEx(s_next,cVMsgCheckBox1_L)
endIf
EndScript


Script MoveToPriorCheckbox ()
if !IsVirtualPCCursor() then
	SayFormattedMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
if MoveToControlType(s_prior,wt_checkbox) then
	if not SayAllInProgress() then
		SayLine()
	endIf
else
	SayNothingFoundEx(s_prior,cVMsgCheckBox1_L)
endIf
EndScript


Script MoveToNextButton ()
if !IsVirtualPCCursor() then
	SayFormattedMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
if !IsVirtualPCCursor() then
	SayFormattedMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
if MoveToControlType(s_next,wt_button) then
	if not SayAllInProgress() then
		sayLine()
	endIf
else
	SayFormattedMessage(ot_error,cmsgNoNextButton_L,cmsgNoNextButton_S)
endIf
EndScript


Script MoveToPriorButton ()
if !IsVirtualPCCursor() then
	SayFormattedMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
if !IsVirtualPCCursor() then
	SayFormattedMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
if MoveToControlType(s_prior,wt_button) then
	if not SayAllInProgress() then
		sayLine()
	endIf
else
	SayFormattedMessage(ot_error,cmsgNoPriorButton_L,cmsgNoPriorButton_S)
endIf
EndScript

Script AdjustJAWSOptions()
var
	string strList,
	string sNodeName
	let sNodeName = NODE_LOTUS_NOTES
	let strList =
		NotesVerbosityItems
	ConvertListToNodeList(strList, sNodeName)
	OptionsTreeCore(strList, TRUE, cscNull)
EndScript

string Function ToggleReadingStatusLine (int iRetCurVal)
if not iRetCurVal then
	if g_iStatusLineReading then
		let g_iStatusLineReading= 0
	else
		let g_iStatusLineReading= True
	EndIf
	IniWriteInteger ("options", "ReadStatusLine", g_iStatusLineReading, "Lotus Notes.jsi", TRUE)
EndIf
if g_iStatusLineReading then
	return cmsgVerbosityListReadingStatusLineOn_L
else
	return cmsgVerbosityListReadingStatusLineOff_L
endIf
EndFunction

string Function ToggleReadingStatusLineHlp()
return FormatString(ToggleStatusLineHelpMessage)
EndFunction

Script TopOfFile ()
var
int iObjType,
string sClassName
Let iObjType = GetObjectSubTypeCode ()
Let sClassName=GetWindowClass (GetFocus ())
if((iObjType == WT_TREEVIEWITEM || iObjType==WT_TREEVIEW) && (sClassName == "NotesSubprog")) then
JAWSTopOfFile()
return
endif
PerformScript TopOfFile()
EndScript



Script BottomOfFile ()
var
int iObjType,
string sClassName
Let iObjType = GetObjectSubTypeCode ()
Let sClassName=GetWindowClass (GetFocus ())
if((iObjType == WT_TREEVIEWITEM || iObjType==WT_TREEVIEW) && (sClassName == "NotesSubprog")) then
JAWSBottomOfFile()
return
endif
PerformScript BottomOfFile()
EndScript

Int Function IsPageTab ()
var
	object objAcc,
	int iRole,
	int iChildID,
	string strName



let objAcc = GetObjectAtPoint (iChildID, GetCursorCol(), GetCursorRow())
let iRole = objAcc.accRole(iChildID)
if (iRole==ROLE_SYSTEM_PAGETAB) then
	return TRUE
EndIf
let strName = objAcc.accName(iChildID)
return FALSE



EndFunction

Script NextDocumentWindow ()
If UserBufferIsActive () then
	UserBufferDeActivate ()
EndIf
TypeCurrentScriptKey ()
If (IsPCCursor()) Then
	Pause ()
	Delay(1)
	If (IsPageTab()) Then
		; SayWindowTypeAndText(GetFocus())
		SayFocusedObject ()
	EndIf
EndIf
EndScript

Script PreviousDocumentWindow ()
If UserBufferIsActive () then
	UserBufferDeActivate ()
EndIf
TypeCurrentScriptKey ()
If (IsPCCursor()) Then
	Pause ()
	Delay(1)
	If (GetObjectTypeCode ()==WT_TABCONTROL) Then
		; SayWindowTypeAndText(GetFocus())
		SayFocusedObject ()
	EndIf
EndIf
EndScript

void function ObjStateChangedEvent(handle hObj, int iObjType, int nChangedState, int nState, int nOldState)
if iObjType == WT_TREEVIEW
|| iObjType == WT_TREEVIEWITEM then

	;don't do this if the old state is selected and the new state is not selected
	if ((nOldState&CTRL_SELECTED) && !(nState&CTRL_SELECTED)) then
		;do nothing
	else
		SayTreeViewLevel (true)
	EndIf
	return;
EndIf

ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

int function IsLotusMultilineEdit( handle hwndFocus )
var
handle hNext, handle hPrior, handle hChild, string NextClass, int type;
let type = GetObjectSubTypeCode( true );
if ( type != WT_MULTILINE_EDIT ) then
return 0;
EndIf

let hNext = GetNextWindow (hwndFocus)
let hPrior = GetPriorWindow (hwndFocus)
let hChild = GetFirstChild (hwndFocus)
let NextClass = GetWindowClass( hNext );
if ( hPrior == 0
&& ( hNext== 0
|| NextClass == wcDocClass2 )
|| NextClass == wcActionBar ) then
var
string sClass
let sClass = GetWindowClass (hwndFocus)
if ( sClass == wcDocClass ) then
; the following should only happen in a message body
var
string sLine, string sName,
int ChildCtrl
let sLine = GetLine();
let sName = GetObjectName( true );
let ChildCtrl = GetControlID( GetFirstChild ( GetFirstChild( hwndFocus ) ) )
;SayInteger (ChildCtrl, 10)
if ( ChildCtrl != 1001
&& ( sName == ""
; || sLine == ""
|| StringContains (sLine, sName)
|| StringCompare(sLine,sName,true) ) ) then
return 1;
EndIf; line and name are the same
EndIf
EndIf

return 0;
EndFunction

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
var
	int type,
	string name,
	int parentType
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
; the following code is to stop
; Notes from reading the contents of multi-line edit fields excessively when up and down arrowing
; or typing in the subject field
let type = GetObjectSubTypeCode (true)
let parentType = GetObjectSubTypeCode (true,1)
if ( type == WT_GROUPBOX
	&& parentType!=WT_DOCUMENT) then
	if ( hwndFocus == hwndPrevFocus ) then
		return;
	EndIf
EndIf

if ( type == WT_EDIT
|| type == WT_MULTILINE_EDIT
|| type == WT_COMBOBOX ) then
let name = GetObjectName (true)
;GetWindowName ( hwndFocus )
if ( hwndFocus != hwndPrevFocus
|| name != glnWindowName ) then
let glnWindowName = name;

; the following is particularly for the message body

if ( hwndFocus == hwndPrevFocus ) then
if ( IsLotusMultilineEdit( hwndFocus ) ) then
return;
EndIf
else ; handles don't match
if ( IsLotusMultilineEdit( hwndFocus ) ) then
SayControlEx ( hwndFocus, "", cMsg266_L );
return;
EndIf
EndIf ; handle check
else
return;
EndIf
else
let glnWindowName = "";
EndIf ; type check

FocusChangedEventEx (
	hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)

EndFunction

Void Function SayTutorialHelp (int iObjType, int IsScriptKey)
if ( iObjType == WT_EDIT
|| iObjType == WT_MULTILINE_EDIT ) then
return;
EndIf ; control type

if ((iObjType == WT_TREEVIEW)
|| (iObjType==WT_TREEVIEWITEM)) then
	if !(GetObjectStateCode (true, 0)&CTRL_SELECTED) then
	return
	EndIf
EndIf

SayTutorialHelp (iObjType, IsScriptKey)
EndFunction

void Function SayTreeViewItem ()
var
	handle hWnd,
	int iControl,
	string sObjName,
	string sObjState,
	string sObjValue,
	string sLine

let hWnd = GetCurrentWindow ()
let iControl = GetControlId (hWnd)
let sObjName = GetObjectName ()
let sObjState = GetObjectState ()
let sObjValue = GetObjectValue ()
if (iControl == iDGoToTree) then
	SayFormattedMessage (ot_control_name, sObjName)
	if (! StringContains (sObjState, sc3)) then
		SayFormattedMessage (OT_BUFFER, msgNewLine1_L)
		SayFormattedMessage (OT_STATUS, sObjState)
	endif
	return
endif
SayFormattedMessage (OT_STATUS, sObjValue)
if (!StringContains (sObjValue,sObjName)) then
	SayFormattedMessage (ot_JAWS_message, msgNewLine1_L)
	SayFormattedMessage (ot_control_name, sObjName)
EndIf
if (! StringContains (sObjState, sc3)
	&& !StringContains (sObjValue, sObjState)) then
	SayFormattedMessage (ot_status, sObjState)
EndIf
EndFunction

int function IsTableNavSupported()
;Returning false allows the table navigation scripts to notify the user
;that table navigation is not supported in this application.
return false
endFunction

void Function IndicateComputerBraille (handle hFocus)
let  sCurrentObjectName = GetObjectName (true, 0)
if (sCurrentObjectName== sOldObjectName) then
	return
EndIf

IndicateComputerBraille (hFocus)
let sOldObjectName = sCurrentObjectName
EndFunction

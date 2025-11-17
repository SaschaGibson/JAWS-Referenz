; Copyright 1999-2015 by Freedom Scientific, Inc.
; Scripts for RealPlayer 11

use "Internet Explorer.jsb"
include "HjHelp.jsh"
Include "hjconst.jsh"
Include "hjglobal.jsh"
include "common.jsm"
include "realplay.jsm"

const
wc_IEServerWindow="Internet Explorer_Server",
wc_RPUI="PNGUIClass",
wc_GeminiWindowClass = "GeminiWindowClass",
wc_button="button"

Globals
	int FirstTimeRealPlayer,	; to give message first time only
	int giGraphicalCheckBoxState, 	; remembers the state of graphical check boxes (media types window)
	int giGraphicalCheckBoxCount 	; To stop double speaking of the state

Void Function AutoStartEvent ()
if (FirstTimeRealPlayer == false) then
	let FirstTimeRealPlayer = true
endIf ; first time entering this app
EndFunction

int Function BrailleAddObjectState (int iType)
if iType != WT_LISTBOX then
	return BrailleAddObjectState (iType)
endIf
SuppressG2TranslationForNextStructuredModeSegment()
BrailleAddString (BrailleGetStateString (GetFindFileTypesListBoxCurrentItemCheckState()),
GetCursorCol (), getCursorRow (),0)
Return TRUE
endFunction

handle function getIEServerWindowHandle()
; returns the handle to the IE Server Window which is a child of the Realplayer main window
var
handle hTmp,
handle hTmp2
let hTmp=getAppMainWindow(getFocus())
let hTmp=getFirstChild(hTmp)
while hTmp
	if getWindowClass(hTmp)==wc_RPUI then
		let hTmp2=hTmp
		while hTmp2
			if getWindowClass(hTmp2)==wc_IEServerWindow then
				return hTmp2
			endIf
			let hTmp2=getFirstChild(hTmp2)
		endWhile
	endIf
	let hTmp=getNextWindow(htmp)
endWhile
return hTmp
endFunction

void function sayFocusedWindow()
var
handle hFocus,
handle hIe
let hFocus=getFocus()
if not dialogActive() && not menusActive() && getWindowClass(getFocus())==wc_RPUI then
	let hIe=getIEServerWindowHandle()
; attempt to set focus on the Internet Explorer window if it exists
	if hIe && isWindowVisible(hIe) && not isWindowDisabled(hIe) then
		setFocus(hIe)
		sayLine()
	endIf
else
	If GetMenuMode()==2 then ; menu is active.
		; let sayHighlightedText handle it.
		Return
	EndIf
	sayFocusedObject()
endIf
endFunction

Script ScriptFileName ()
ScriptAndAppNames (msgScriptKeyHelp1_L)
EndScript

Script ScreenSensitiveHelp ()
var
	int TheID,
	int TheType
If (IsSameScript ()) then
	AppFileTopic (topic_RealPlayer)
	return
endIf
let TheID = GetControlID (GetCurrentWindow())
let TheType = GetWindowtypeCode (GetCurrentWindow())
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if  GetWindowClass (GetFocus ()) == sc_3 then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp1_L, msgScreenSensitiveHelp1_S)
	AddHotKeyLinks ()
elif GetWindowClass (GetParent (GetFocus ())) == sc_2 then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp2_L, msgScreenSensitiveHelp2_S)
	AddHotKeyLinks ()
endIf
EndScript

;The following are attached to multiple keys.
;If there's a cursor, or the Virtual Pc Cursor,
;and the key is attached to a JAWS Script key, we pass it through.

Script VolumeUp ()
If (! StringContains (GetScriptKeyNames ("ControlUpArrow"), GetCurrentScriptKeyName ())) ||
(IsPCCursor () && !IsVirtualPcCursor() && !IsFormsModeActive() &&
! UserBufferIsActive () &&
! GetWindowTypeCode (GlobalFocusWindow) != WT_EDIT &&
GetObjectTypeCode () != WT_EDIT) then
	SayFormattedMessage (ot_status, MSGVolumeUp_L, MSGVolumeUp_S) ; "volume up"
	TypeCurrentScriptKey ()
	Return
endIf
PerformScript ControlUpArrow ()
EndScript

Script VolumeDown ()
If (! StringContains (GetScriptKeyNames ("ControlDownArrow"), GetCurrentScriptKeyName ())) ||
(IsPCCursor() && !IsVirtualPcCursor() && !IsFormsModeActive() &&
! UserBufferIsActive () &&
! GetWindowTypeCode (GlobalFocusWindow) != WT_EDIT &&
GetObjectTypeCode () != WT_EDIT) then
	SayFormattedMessage (ot_status, MSGVolumeDown_L, MSGVolumeDown_S) ; "volume down"
	TypeCurrentScriptKey ()
	Return
endIf
PerformScript ControlDownArrow ()
EndScript

Script rewind ()
If (! StringContains (GetScriptKeyNames ("SayPriorWord"), GetCurrentScriptKeyName ())) ||
(IsPCCursor() && !IsVirtualPcCursor() && !IsFormsModeActive() &&
! UserBufferIsActive () &&
! GetWindowTypeCode (GlobalFocusWindow) != WT_EDIT &&
GetObjectTypeCode () != WT_EDIT) then
	SayFormattedMessage (ot_status, MSGRewind_L, MSGRewind_S) ; "rewind",
	TypeCurrentScriptKey ()
	Return
EndIf
PerformScript SayPriorWord ()
EndScript

Script FastForward ()
If (! StringContains (GetScriptKeyNames ("SayNextWord"), GetCurrentScriptKeyName ())) ||
(IsPCCursor() && !IsVirtualPcCursor() && !IsFormsModeActive() &&
! UserBufferIsActive () &&
! GetWindowTypeCode (GlobalFocusWindow) != WT_EDIT &&
GetObjectTypeCode () != WT_EDIT) then
	SayFormattedMessage (ot_status, MSGFastForward_L,MSGFastForward_S) ; "fast forward"
	TypeCurrentScriptKey ()
	Return
endIf
PerformScript SayNextWord ()
EndScript

Script SuperRewind ()
If (! StringContains (GetScriptKeyNames ("SelectPriorWord"), GetCurrentScriptKeyName ())) ||
(IsPCCursor() && !IsVirtualPcCursor() && !IsFormsModeActive() &&
! UserBufferIsActive () &&
! GetWindowTypeCode (GlobalFocusWindow) != WT_EDIT &&
GetObjectTypeCode () != WT_EDIT) then
	SayFormattedMessage (ot_status, MSGSuperRewind_L, MSGSuperRewind_S) ; "super rewind",
	TypeCurrentScriptKey ()
	Return
endIf
PerformScript SelectPriorWord ()
EndScript

Script SuperFastForward ()
If (! StringContains (GetScriptKeyNames ("SelectNextWord"), GetCurrentScriptKeyName ())) ||
(IsPCCursor() && !IsVirtualPcCursor() && !IsFormsModeActive() &&
! UserBufferIsActive () &&
! GetWindowTypeCode (GlobalFocusWindow) != WT_EDIT &&
GetObjectTypeCode () != WT_EDIT) then
	SayFormattedMessage (ot_status,MSGSuperFastForward_L,MSGSuperFastForward_S) ; "super fast forward"
	TypeCurrentScriptKey ()
	Return
EndIf
PerformScript SelectNextWord ()
EndScript

Script PreviousClip ()
if IsPCCursor () then
	SayFormattedMessage (ot_status,msgPreviousClip_L,msgPreviousClip_S)
Else
	SayCurrentScriptKeyLabel ();
EndIf
TypeCurrentScriptKey ()
EndScript

Script NextClip ()
if IsPCCursor () then
	SayFormattedMessage (ot_status,msgNextClip_L,msgNextClip_S)
Else
	SayCurrentScriptKeyLabel ();
EndIf
TypeCurrentScriptKey ()
EndScript

Script NormalMode ()
SayFormattedMessage (ot_status, msgNormalMode_L, msgNormalMode_S)
TypeCurrentScriptKey ()
EndScript

Script ToolBarMode()
SayFormattedMessage (ot_status, msgToolBarMode_L, msgToolBarMode_S)
TypeCurrentScriptKey ()
EndScript

Script TheaterMode()
SayFormattedMessage (ot_status, msgTheaterMode_L, msgTheaterMode_S)
TypeCurrentScriptKey ()
EndScript

Script OriginalSize()
SayFormattedMessage (ot_status, msgOriginalSize_L, msgOriginalSize_S)
TypeCurrentScriptKey ()
EndScript

Script DoubleSize()
SayFormattedMessage (ot_status, msgDoubleSize_L, msgDoubleSize_S)
TypeCurrentScriptKey ()
EndScript

Script FullScreenTheaterMode()
SayFormattedMessage (ot_status, msgFullScreenTheaterMode_L, msgFullScreenTheaterMode_S)
TypeCurrentScriptKey ()
EndScript

Script GoToBurnOrTransferPage()
SayFormattedMessage (ot_status, msgGoToBurnOrTransferPage_L, msgGoToBurnOrTransferPage_S)
TypeCurrentScriptKey ()
EndScript

Script GoToSearchPage()
SayFormattedMessage (ot_status, msgGoToSearchPage_L, msgGoToSearchPage_S)
TypeCurrentScriptKey ()
EndScript

Script GoToRealGuidePage()
SayFormattedMessage (ot_status, msgGoToRealGuidePage_L, msgGoToRealGuidePage_S)
TypeCurrentScriptKey ()
EndScript

Script GoToMyLibraryPage()
SayFormattedMessage (ot_status, msgGoToMyLibraryPage_L, msgGoToMyLibraryPage_S)
TypeCurrentScriptKey ()
EndScript

Script GoToCDOrDVDPage()
SayFormattedMessage (ot_status, msgGoToCDOrDVDPage_L, msgGoToCDOrDVDPage_S)
TypeCurrentScriptKey ()
EndScript

Script SendEMail()
SayFormattedMessage (ot_status, msgSendEMail_L, msgSendEMail_S)
TypeCurrentScriptKey ()
EndScript

Script OpenOrHideBrowser()
SayFormattedMessage (ot_status, msgOpenOrHideBrowser_L, msgOpenOrHideBrowser_S)
TypeCurrentScriptKey ()
EndScript

Script AttachOrDetachBrowser()
SayFormattedMessage (ot_status, msgAttachOrDetachBrowser_L, msgAttachOrDetachBrowser_S)
TypeCurrentScriptKey ()
EndScript

Script ToggleNowPlaying()
SayFormattedMessage (ot_status, msgToggleNowPlaying_L, msgToggleNowPlaying_S)
TypeCurrentScriptKey ()
EndScript

Script MessageCenter()
SayFormattedMessage (ot_status, msgMessageCenter_L, msgMessageCenter_S)
TypeCurrentScriptKey ()
EndScript

Script CompactView ()
SayFormattedMessage (ot_status, msgCompactView_L, msgCompactView_S)
TypeCurrentScriptKey ()
EndScript

void function sayNonHighlightedText(handle hwnd, string sText)
var
int iWinTypeCode,
int iNextWinTypeCode,
	String TheClass
Let TheClass = GetWindowClass(hWnd)
let iWinTypeCode=getWindowTypeCode(hwnd)
let iNextWinTypeCode=getWindowTypeCode(getNextWindow(hwnd))
; This speaks descriptive static text in dialogs.
if iWinTypeCode==wt_static && dialogActive() then
	if iNextWinTypeCode ==wt_static || iNextWinTypeCode==wt_button || iNextWinTypeCode==wt_radioButton || iNextWinTypeCode==wt_checkbox then
		say(sText, ot_dialog_text)
		return
	endIf
endIf
sayNonHighlightedText(hwnd, sText)
endFunction

Script HotKeyHelp ()
var
	string sTemp_L,
	string sTemp_S
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if getWindowClass(getFocus())==wc_ieServerWindow then
	let sTemp_L = msgHKVirtualHelp1_L + cScBufferNewLine + msgHotKeyHelp1_L
	let sTemp_S = msgHKVirtualHelp1_S + cScBufferNewLine + msgHotKeyHelp1_S
	SayFormattedMessage(ot_USER_BUFFER, sTemp_L, sTemp_S)
	return
endIf
SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp1_L, msgHotKeyHelp1_S)
EndScript

script Toolbar()
var
handle hTmp,
string sButtonNames,
string sButtonHandles,
int iChoice

let hTmp=getFirstChild(getAppMainWindow(getFocus()))
while hTmp
	; note we don't use window type code as it is zero for some reason when MSTHML.DLL is in use
	if getWindowclass(hTmp)==wc_button && not isWindowDisabled(htmp) && getWindowName(hTmp)!=cscNull then
		let sButtonNames=sButtonNames+list_item_separator+getWindowName(hTmp)
		let sButtonHandles=sButtonHandles+list_item_separator+intToString(hTmp)
	endIf
	let hTmp=getNextWindow(hTmp)
endwhile
if sButtonNames==cscNull then
	return
endIf
;remove leading delimiters from string lists
let sButtonNames=stringChopLeft(sButtonNames,1)
let sButtonHandles=stringChopLeft(sButtonHandles,1)
let iChoice=dlgSelectItemInList(sButtonNames,"Select buttons",false)
if iChoice then
	let hTmp=stringToHandle(stringSegment(sButtonHandles, list_item_separator, iChoice))
	saveCursor()
	JAWSCursor()
	moveToWindow(hTmp)
	leftMouseButton()
	restoreCursor()
	pause()
endIf
endScript

Void Function WindowCreatedEvent (handle hWindow, int nLeft, int nTop, int nRight, int nBottom)
if getWindowClass(hWindow)==wc_ieServerWindow then
	pause()
	if hWindow!=getFocus() && not isWindowDisabled(hWindow) then
		setFocus(hWindow)
	endIf
endIf
WindowCreatedEvent(hWindow,nLeft,nTop,nRight,nBottom)
EndFunction
script windowKeysHelp()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage(ot_USER_BUFFER, msgWKeysHelp1_L, msgWKeysHelp1_S)
UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
endScript

int function GetFindFileTypesListBoxCurrentItemCheckState()
;MSAA does not show the check status,
;so we deduce it from the text of the listbox item name
var
	int MSAAMode,
	string sState
let MSAAMode = GetJCFOption(opt_msaa_mode)
SetJCFOption(opt_msaa_mode,2)
let sState = StringSegment(GetObjectName(),sc_FindFileTypes_ListItemState_PrefixChar,-1)
SetJCFOption(opt_msaa_mode,MSAAMode)
if sState == sc_FindFileTypes_ListItemState_On then
	return CTRL_CHECKED
elif sState == sc_FindFileTypes_ListItemState_Off then
	return CTRL_UNCHECKED
else
	return CTRL_NONE
EndIf
EndFunction

void function SayFindFileTypesListBoxCurrentItem(int bSayPrompt, int bSayPosition)
;Corrects problem with MSAA state not being correctly reported.
var
	int SavedMSAAMode
let SavedMSAAMode = GetJCFOption(opt_msaa_mode)
if bSayPrompt then
	SetJCFOption(opt_msaa_mode,1)
	Say(GetObjectName(),ot_control_name)
EndIf
IndicateControlState(wt_ListboxItem,GetFindFileTypesListBoxCurrentItemCheckState())
SetJCFOption(opt_msaa_mode,2)
Say(GetObjectName(),ot_line)
if bSayPosition then
	Say(PositionInGroup(),ot_position)
EndIf
SetJCFOption(opt_msaa_mode,SavedMSAAMode)
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
var
	Int iObjType,
	Int iMsaaMode
if inHjDialog () then
	Return ActiveItemChangedEvent(curHwnd, curObjectId, curChildId,
		prevHwnd, prevObjectId, prevChildId)
endIf
Let iObjType=GetObjectSubtypeCode()
Let iMsaaMode = GetJcfOption(opt_msaa_mode)
If iObjType == wt_MenuBar then
	If iMsaaMode>=1 then
		SetJcfOption(opt_msaa_mode,0)
		Say(GetWindowText(globalFocusWindow,true),ot_no_disable)
		SetJcfOption(opt_msaa_mode,iMsaaMode)
	endIf
	SayObjectActiveItem()
	If GetMenuMode()==2 then ; menu is active.
		; Set next variable to 2 (advanced) to prevent repeating of tutor help.
		Let GlobalPrevTutorMenuMode = 2
	EndIf
elif iObjType == wt_Listbox then
	if StringCompare(GetWindowName(curHwnd),wn_FindFileTypes) == 0
	&& StringCompare(GetWindowName(GetRealWindow(CurHWnd)),wn_ScanDiskForMedia) == 0 then
		SayFindFileTypesListBoxCurrentItem(false,false)
		return
	EndIf
Else
	ActiveItemChangedEvent(curHwnd, curObjectId, curChildId,
		prevHwnd, prevObjectId, prevChildId) ; default
EndIf
EndFunction

Void Function MenuModeEvent (handle WinHandle, int mode)
Var
	int TheTypeCode,
	int NCurrentMSAAMode
let TheTypeCode = GetObjectSubTypeCode()
let NCurrentMSAAMode=GetJCFOption (	OPT_MSAA_MODE)
if (GetWindowSubTypeCode (WinHandle) == WT_CONTEXTMENU) then
	IndicateControlType (WT_CONTEXTMENU)
	SayLine()
	TypeKey (cksDownArrow); Select first item in menus
	MenuModeHook ()
Else
	MenuModeEvent (WinHandle, mode) ; default
endIf
EndFunction

void function ObjStateChangedEvent(handle hObj, int iObjType, int nChangedState, int nState, int nOldState)
if (! nOldState && iObjType == WT_LISTBOXITEM) then
	if StringCompare (GetWindowName (hObj), wn_FindFileTypes) == 0
	&& StringCompare(GetWindowName(GetRealWindow (hObj)) , wn_ScanDiskForMedia) == 0 then
		BrailleRefresh ()
		SayFindFileTypesListBoxCurrentItem(false,false)
		return
	EndIf
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
endFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue, int bIsFocusObject)
if nObjType == wt_ComboBox then
	;In some dialogs the top level window is not really the top,
	;so test for both top and parent of top:
	if hWnd == GlobalFocusWindow
	&& (GetWindowClass(GetTopLevelWindow(hWnd)) == wc_GeminiWindowClass
	|| GetWindowClass(GetParent(GetTopLevelWindow(hWnd))) == wc_GeminiWindowClass) then
		Say(sObjValue,ot_line)
		return
	EndIf
EndIf
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue, bIsFocusObject)
EndFunction

Script SayNextLine()
if IsPCCursor() && ! inHjDialog ()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	if GetObjectSubTypeCode()==WT_SLIDER then
		;just move, ValueChangedEvent will speak the change in value
		NextLine()
		return
	EndIf
EndIf
PerformScript SayNextLine()
EndScript

Script SayPriorLine()
if IsPCCursor() && ! inHjDialog ()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	if GetObjectSubTypeCode()==WT_SLIDER then
		;just move, ValueChangedEvent will speak the change in value
		PriorLine()
		return
	EndIf
EndIf
PerformScript SayPriorLine()
EndScript

;Overriden to call a check if graphical check boxes are present
void Function SayHighlightedText(handle hWnd, string sText)
if inHjDialog () then
	Return SayhighlightedText (hwnd, sText)
endIf
If GetWindowName(hWnd) == wn_MediaTypes Then
	GetGraphicalCheckBoxState()
EndIf
SayHighlightedText(hWnd, sText)
EndFunction

;This function is used to check the state of graphical check boxes
;It uses a global variable to remember the state of the current box
;SayHighlightedText is called 4 times for each item in the list
;that is checked, so a second global is used to count each call
;and only check once for each list item in the Media Types window
Function GetGraphicalCheckBoxState()
Let giGraphicalCheckBoxCount = giGraphicalCheckBoxCount + 1
If giGraphicalCheckBoxCount == 1 Then
	SaveCursor()
	JAWSCursor()
	SaveCursor()
	;Find the graphical check box and record its state
	MoveTo(GetCursorCol(CURSOR_PC) - 162, GetCursorRow(CURSOR_PC) - 10)
	Pause()
	If GetCharacter() == cscUnChecked Then
		let giGraphicalCheckBoxState = CTRL_UNCHECKED
	ElIf GetCharacter() == cscChecked Then
		let giGraphicalCheckBoxState = CTRL_CHECKED
	Else
		;In some cases the check box is higher, so check there
		MoveTo(GetCursorCol(CURSOR_PC) - 162, GetCursorRow(CURSOR_PC) - 26) ;Check Box Graphic
		Pause()
		If GetCharacter() == cscUnChecked Then
			let giGraphicalCheckBoxState = CTRL_UNCHECKED
		ElIf GetCharacter() == cscChecked Then
			let giGraphicalCheckBoxState = CTRL_CHECKED
		EndIf
	EndIf
	RestoreCursor()
	RestoreCursor()
	if giGraphicalCheckBoxState == CTRL_UNCHECKED Then
		IndicateControlState(WT_CHECKBOX,ctrl_unchecked)
	ElIf giGraphicalCheckBoxState == CTRL_CHECKED Then
		IndicateControlState(WT_CHECKBOX,ctrl_checked)
	EndIf
ElIf giGraphicalCheckBoxCount == 4 Then
	;reset the count afterward
	let giGraphicalCheckBoxCount = 0
EndIf
EndFunction

;Custom script to toggle graphical check boxes with spacebar is pressed
Function ToggleGraphicalCheckBoxState()
If giGraphicalCheckBoxState == CTRL_UNCHECKED Then
	let giGraphicalCheckBoxState = CTRL_CHECKED
	IndicateControlState(WT_CHECKBOX,ctrl_checked)
Else
	let giGraphicalCheckBoxState = CTRL_UNCHECKED
	IndicateControlState(WT_CHECKBOX,ctrl_unchecked)
EndIf
EndFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	int bStopProcessing
let bStopProcessing = PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
if !bStopProcessing then
	If GetWindowName(GetFocus()) == wn_MediaTypes Then
		let giGraphicalCheckBoxCount = 0
	EndIf
EndIf
return bStopProcessing
EndFunction

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	If GetWindowName(GetFocus()) == wn_MediaTypes Then
		ToggleGraphicalCheckBoxState()
		return true
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
EndFunction

Script SayTopLineOfWindow()
var
  Int Left,
  Int Top,
  Int Bottom,
  Int Right,
  Handle hAppWnd

  If IsVirtualPcCursor () && UserBufferIsActive () then
    PerformScript SayTopLineOfWindow()
    Return
  EndIf
  let hAppWnd = GetAppMainWindow (GetFocus ())
  GetWindowRect (hAppWnd, Left, Right, Top, Bottom)
  Say (StringSegment (GetTextInRect (Left, Top, Right, Bottom, 0, IgnoreColor, IgnoreColor, TRUE, FALSE),"\n",1), ot_user_requested_information)
EndScript

script SayLine()
var
	handle hWnd
if GetObjectSubtypeCode() == wt_ListBox then
	let hWnd = GetCurrentWindow()
	if StringCompare(GetWindowName(hwnd),wn_FindFileTypes) == 0
	&& StringCompare(GetWindowName(GetRealWindow(hWnd)),wn_ScanDiskForMedia) == 0 then
		SayFindFileTypesListBoxCurrentItem(false,true)
		return
	EndIf
EndIf
PerformScript SayLine()
EndScript

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd
if GetObjectSubtypeCode() == wt_ListBox then
	let hWnd = GetFocus()
	if StringCompare(GetWindowName(hwnd),wn_FindFileTypes) == 0
	&& StringCompare(GetWindowName(GetRealWindow(hWnd)),wn_ScanDiskForMedia) == 0 then
		SayFindFileTypesListBoxCurrentItem(true,true)
		return
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction


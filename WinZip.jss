;Script files for WinZip version 8.0
;Copyright 2010-2021 by by Freedom Scientific BLV Group, LLC
;version 4.00.00
;
; **************************************
;*		   Written By		*
;*	Freedom Scientific Scripting	*
;*		Team Gold 	*
; **************************************
;
include "hjconst.jsh"
include "hjglobal.jsh"
include "WinZip32.jsh"
include "WinZip32.jsm"
include "HjHelp.jsh"
Include "common.jsm"

globals
	int WinZipFirstTime,
	int iWinZipGlobCurrentReal,
	int iWinZipGlobNonHighlightSpeechOff, ;used to prevent superfluous reading of the wizard dialogs
	int iWinZipGlobFocusChangeSpeechOff,
	int nSuppressEcho,
	string g_strGraphicsList,
	string g_strGraphicsListX,
	string g_strGraphicsListY

int function HandleCustomWindows (handle hwnd)
var
	int iControl,
	string sPrompt,
	string sRealName
let iControl = GetControlID (hwnd)
if (iWinZipGlobCurrentReal == iWizard) then
	if (iWinZipGlobFocusChangeSpeechOff == true) then
		let iWinZipGlobFocusChangeSpeechOff = false
		return 1
	endif
	if (iControl == iDListView) then
		let sRealName = GetWindowName (GetRealWindow (hwnd))
		if (sRealName == wnListView1) then
			let sPrompt = GetWindowText (GetPriorWindow (hwnd), read_everything)
			SayControlExWithMarkup (hwnd, sPrompt)
			return 1
		endif
	endif
	if (iControl == iDSelectDifferentFolder) then
		SayWindowTypeAndText (GetNextWindow (GetNextWindow (hwnd)))
		SayWindowTypeAndText (GetNextWindow (hwnd))
		SayWindowTypeAndText (hwnd)
		return 1
	endif
endif
if (iControl == iDTipOfTheDayCombo) then
	;SayFormattedMessage (ot_control_type, GetWindowType (hwnd))
	;SayWindow (hwnd, read_highlighted)
	;First parameter to following function is JFW Subtype Code.
	;Second parameter is name if applicable
	;Third parameter is value, which may or may not apply.
	;In this case, because it is a combo box, it indeed does apply.
	IndicateControlType (GetWindowSubtypeCode (hWnd), cScNull, GetWindowText (hWnd, FALSE))
	return 1
endif
if (iControl == iDEmptyButton) then
	let hwnd = FindDescendantWindow (GetParent (hwnd), iDIAgreeButton)
	SetFocus (hwnd)
	return 1
endif
return 0
EndFunction

int function HandleCustomRealWindows (handle hwnd, int IsRealWindow)
;this function also handles items at the AppWind level
;This means, depending on where the function is called from within focusChange,
;this function may be dealing with either app or real windows
var
	string sRealName,
	handle hFirstChild,
	handle hParent,
	int iControl,
	int iWinType
if (DialogActive ()) then
	let sRealName = GetWindowName (GetRealWindow (hwnd))
	if (StringContains (sRealName, wnWizard1) || StringContains (sRealName, wnSetup1)) then
		let iWinZipGlobCurrentReal = iWizard
		let iWinZipGlobFocusChangeSpeechOff = true
		return 1
	endif
endif
let iWinZipGlobCurrentReal = 0
let hParent = GetParent (GetFocus ())
let hFirstChild = GetFirstChild (hParent)
let iControl = GetControlID (hFirstChild)
if (iControl == iDEmptyButton) then
	let hwnd = FindDescendantWindow (hParent, iDThankYou)
	while (hwnd)
		let iControl = GetControlID (hwnd)
		let iWinType = GetWindowSubTypeCode (hwnd)
		if (iControl != iDStatic &&
		iControl != iDEvalPeriod && iWinType == wt_static && IsWindowVisible (hwnd)) then
			SayWindowTypeAndText (hwnd)
		endif
		let hwnd = GetNextWindow (hwnd)
	endwhile
	return 1
endif
return 0
EndFunction

Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
if (nSuppressEcho == on) then
	return
endif
let iWinZipGlobNonHighlightSpeechOff = false
let RealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
if (GlobalPrevApp != AppWindow && AppWindow != FocusWindow) then
; we've switched to a different app main window,
; and it does not have the focus, so announce it
;SayString ("app")
	if (HandleCustomRealWindows (AppWindow, false) == 0) then
		SayWindowTypeAndText (AppWindow)
	endif
endif
if ((GlobalPrevRealName != RealWindowName) ; name has changed
|| (GlobalPrevReal != RealWindow)) then ; or handle has changed, then
	if ((RealWindow != AppWindow && RealWindow != FocusWindow) ||
		GlobalPrevRealName == wnLicense1) then
		if (HandleCustomRealWindows (RealWindow, true) == 0) then
			SayWindowTypeAndText (RealWindow)
		endif
	endif
endif
let GlobalFocusWindow = FocusWindow
if (GlobalPrevFocus != focusWindow) then
	if (HandleCustomWindows (FocusWindow) == 0) then
		SayFocusedWindow () ; will use global variable GlobalFocusWindow
	endif
else
	SayFocusedObject ()
endif
;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

void function AutoStartEvent ()
if (WinZipFirstTime == 0) then
	;SayFormattedMessage (ot_app_start, msgAutoStart1_L, msgAutoStart1_S)
	let WinZipFirstTime = 1
	let iWinZipGlobNonHighlightSpeechOff = false
endif
EndFunction

int Function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
let iWinZipGlobNonHighlightSpeechOff = false
let iWinZipGlobFocusChangeSpeechOff = false
return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function SayNonHighlightedText (handle hwnd, string buffer)
var
	handle hFocus,
	handle hReal,
	handle hRealFocus,
	handle hAppMain,
	handle hText,
	string sRealFocusName,
	string TheClass,
	int iWinType,
	int iControl
;let iControl = GetControlID (hwnd)
let hFocus = GetFocus ()
let hReal =GetRealWindow (hwnd)
let hRealFocus = GetRealWindow (hFocus)
let TheClass = GetWindowClass (hwnd)
if  (hReal == hRealFocus && iWinZipGlobCurrentReal == iWizard && iWinZipGlobNonHighlightSpeechOff == false) then
	let nSuppressEcho = on
	let iWinZipGlobNonHighlightSpeechOff = true
	let iWinZipGlobFocusChangeSpeechOff = false
	let sRealFocusName = GetWindowName (hRealFocus)
	if (sRealFocusName == wnListView1) then
		let hAppMain = GetAppMainWindow (hFocus)
		SayControlInformation (GetWindowName (hAppMain), GetWindowType (hAppMain))
		let hText = FindDescendantWindow (hAppMain, iDListViewDialogText)
		SayWindowTypeAndText (hText)
		HandleCustomWindows (hFocus)
		let nSuppressEcho = off
		return
	Endif
	SayControlInformation (GetWindowName (hReal), GetWindowType (hReal))
	while (hwnd)
		let iWinType = GetWindowSubTypeCode (hwnd)
		if (iWinType == wt_static &&
			GetWindowSubTypeCode (GetNextWindow (hwnd)) != wt_edit) then
			SayWindowTypeAndText (hwnd)
		endif
		let hwnd = GetNextWindow (hwnd)
	endwhile
	if (HandleCustomWindows (hFocus) == 0) then
		SayWindowTypeAndText (hFocus)
	endif
	let nSuppressEcho = off
	return
endif
SayNonHighlightedText (hwnd, buffer)
EndFunction

void function SayHighlightedText (handle hwnd, string buffer)
var
	int iControl
let iControl = GetControlID (hwnd)
SayHighlightedText (hwnd, buffer)
EndFunction

Script  ScriptFileName()
ScriptAndAppNames(msgScriptKeyHelp1_L)
EndScript

Script ScreenSensitiveHelp ()
if (IsSameScript ()) then
	AppFileTopic (topic_WinZip)
	return
endif
PerformScript ScreenSensitiveHelp ()
EndScript

Script HotKeyHelp ()
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp1_L, msgHotKeyHelp1_S)
EndScript

Script SayWindowPromptAndText ()
var
	handle hwnd,
	int iSubType,
	int nMode
let hwnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
if (HandleCustomWindows (hwnd) == 0) then
	smmToggleTrainingMode(nMode)
	PerformScript SayWindowPromptAndText ()
Else
	SayTutorialHelp (iSubType, TRUE)
	SayTutorialHelpHotKey (hWnd, TRUE)
	IndicateComputerBraille (hwnd)
	smmToggleTrainingMode(nMode)
endif
EndScript

Script Tab ()
var
	handle hwnd,
	handle hParent,
	handle hFirstChild,
	int iControl
let hwnd = GetFocus ()
let hParent = GetParent (hwnd)
let hFirstChild = GetFirstChild (hParent)
let iControl = GetControlID (hFirstChild)
if (iControl == iDEmptyButton) then
	SayCurrentScriptKeyLabel ()
	let iControl = GetControlID (hwnd)
	if (iControl == iDQuitButton) then
		let hwnd = FindDescendantWindow (hParent, iDEvalLicense)
		SetFocus (hwnd)
		return
	else
		SetFocus (GetNextWindow (hwnd))
	return
	endif

	return
endif
PerformScript Tab ()
EndScript

Script ShiftTab ()
var
	handle hwnd,
	handle hParent,
	handle hFirstChild,
	int iControl
let hwnd = GetFocus ()
let hParent = GetParent (hwnd)
let hFirstChild = GetFirstChild (hParent)
let iControl = GetControlID (hFirstChild)
if (iControl == iDEmptyButton) then
	SayCurrentScriptKeyLabel ()
	let iControl = GetControlID (hwnd)
	if (iControl == iDEvalLicense) then
		let hwnd = FindDescendantWindow (hParent, iDQuitButton)
		SetFocus (hwnd)
	else
		SetFocus (GetPriorWindow (hwnd))
	endif
	return
endif
PerformScript ShiftTab ()
EndScript

Script ToolbarList ()
var
	int nIncludeGraphics,
	int nIndex,
	int nRowToClick,
	int nColToClick
if (DialogActive ()) then
	SayFormattedMessage (ot_error, msgToolbarListError1_L) ; "You must exit the current dialog in order to access the toolbar"
	return
endif
let nIncludeGraphics = GetJcfOption(OPT_INCLUDE_GRAPHICS)
SetJcfOption (OPT_INCLUDE_GRAPHICS, 1) ; labeld graphics only
let g_strGraphicsList = ""
let g_strGraphicsListX = ""
let g_strGraphicsListY = ""
GraphicsEnumerate(GetAppMainWindow(GetFocus()),"GraphicsListHelper")
SetJcfOption (OPT_INCLUDE_GRAPHICS, nIncludeGraphics)
if  !(g_strGraphicsList) then
	SayFormattedMessage (ot_error, msgToolbarListError2_L) ; "Toolbar not found"
	return
endif
let g_strGraphicsListX = StringChopLeft (g_strGraphicsListX, 1)
let g_strGraphicsListy = StringChopLeft (g_strGraphicsListy, 1)
let nIndex = DlgSelectItemInList (g_strGraphicsList,msgListName1, true)
if (nIndex != 0) then
	let nSuppressEcho = on
	let nRowToClick =
	StringToInt(StringSegment(g_strGraphicsListX,"\007",nIndex))
	let nColToClick =
	StringToInt(StringSegment(g_strGraphicsListY,"\007",nIndex))
	SaveCursor()
	JAWSCursor()
	MoveTo(nColToClick,nRowToClick)
	LeftMouseButton()
	RestoreCursor ()
	let nSuppressEcho = off
endif
EndScript

Script ReadPropertiesWindow ()
var
	handle hwnd,
	int iControl,
	string sRealName,
	int iIndex,
	string sPromptList,
	string sTemp,
	string sTempControl
let hwnd = GetFocus ()
let sRealName = GetWindowName (GetRealWindow (hwnd))
if (sRealName != wnZipProperties1) then
	SayFormattedMessage (ot_error, msgError1_L, msgError1_S) ; not in zip properties
	return
endif
let hwnd = GetFirstChild (GetParent (hwnd))
let iControl = GetControlID (hwnd)
while (iControl == iDStatic)
	let sPromptList = sPromptList+GetWindowText (hwnd, false)+"\007"
	let hwnd = GetNextWindow (hwnd)
	let iControl = GetControlID (hwnd)
endwhile
let sPromptList = StringLeft (sPromptList, StringLength (sPromptList) - 1)
let iIndex = 1
let sTemp = StringSegment (sPromptList, "\007", iIndex)
while (sTemp != "")
	let sTempControl = StringSegment (strZipPropertiesControlsList, "\007", iIndex) ; set sTemp to a string containing the control iD
	let hwnd = FindDescendantWindow (GetParent (hwnd), StringToInt (sTempControl))
	let sTempControl = GetWindowText (hwnd, false)
	let sTemp = FormatString (msgPropertyInfo1, sTemp, sTempControl)
	SayFormattedMessage (ot_no_disable, sTemp) ;this is the prompt+corresponding information
	let iIndex = iIndex+1
	let sTemp = StringSegment (sPromptList, "\007", iIndex) ;reset sTemp to be a prompt
endwhile
EndScript

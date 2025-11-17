;Copyright 2001-2021 by by Freedom Scientific BLV Group, LLC

Include "hjglobal.jsh" ; default HJ global variables
Include "hjconst.jsh" ; default HJ constants
include "common.jsm"
Include "QuickTime Installation.jsm"
Include "QuickTime Installation.jsh"

Void Function AutoStartEvent ()
If (nQuickTimeInstallFirstTime == 0) Then
	let nQuickTimeInstallFirstTime = 1
	SayFormattedMessage (OT_APP_START, msgAutoStart3_l, msgAutoStart3_s)
EndIf
EndFunction

;  Functions used to read windows and controls that are specific to the
;	QuickTime 3.0 installation program.

Int Function ReadStaticTextWindows ()
Var
	Handle hRealWin,
	Handle hFirstChild,
	String strTitle,
	Int nTitleLen,
	String strRealWinClass,
	Int nRealWinClassLen,
	Handle hTemp,
	Int nTemp,
	string strMessage
let hRealWin = GetRealWindow (GetFocus ())
let strRealWinClass = GetWindowClass (hRealWin)
let nRealWinClassLen = StringLength (strRealWinClass)
If (nRealWinClassLen != wcDialogLen) then
	Return 0
EndIf
let strTitle = GetWindowName (hRealWin)
let nTitleLen = StringLength (strTitle)
If (nTitleLen != wnQuickTimeSetupLen
	&& nTitleLen != wnQuickTime30Len
	&& nTitleLen != wnSetupTypeLen
	&& nTitleLen != wnQTPluginOptLen
	&& nTitleLen != wnQTComponentsLen) Then
	Return 0
EndIf
If (nTitleLen == wnQuickTimeSetupLen) then
	let strMessage = FormatString(msgReadStaticWindows2_l, strTitle, msgDialog_L)
SayFormattedMessage(OT_CONTROL_NAME, msgReadStaticWindows2_l, msgReadStaticWindows2_S)
	let hFirstChild = GetFirstChild (hRealWin)
	let nTemp = GetControlID (hFirstChild)
	If (nTemp != idEndCheck) then
	let strMessage = FormatString(msgReadStaticWindows3_l, strTitle, msgDialog_L)
	SayFormattedMessage (OT_JAWS_MESSAGE, msgReadStaticWindows3_l, msgReadStaticWindows3_s)
		Return 1
	Else
		let hTemp = FindDescendantWindow (hRealWin, idEndStatic1)
		If (hTemp) Then
			SayWindow (hTemp, READ_EVERYTHING)
		EndIf
		let hTemp = FindDescendantWindow (hRealWin, idEndStatic2)
		If (hTemp) Then
			SayWindow (hTemp, READ_EVERYTHING)
		EndIf
	EndIf
ElIf (nTitleLen == wnQuickTime30Len) then													  let strMessage = FormatString(msgReadStaticWindows4_l, strTitle, msgDialog_L)
	SayFormattedMessage (OT_JAWS_MESSAGE, msgReadStaticWindows4_l, msgReadStaticWindows4_s)
	let hTemp = FindDescendantWindow (hRealWin, idQT30Static1)
	If (hTemp) Then
		SayWindow (hTemp, READ_EVERYTHING)
		let hTemp = FindDescendantWindow (hRealWin, idQT30Static2)
	EndIf
	If (hTemp) Then
		SayWindow (hTemp, READ_EVERYTHING)
		let hTemp = FindDescendantWindow (hRealWin, idQT30Static3)
	EndIf
	If (hTemp) Then
		SayWindow (hTemp, READ_EVERYTHING)
		let hTemp = FindDescendantWindow (hRealWin, idQT30Static4)
	EndIf
	If (hTemp) Then
		SayWindow (hTemp, READ_EVERYTHING)
		let hTemp = FindDescendantWindow (hRealWin, idQT30Static5)
	EndIf
	If (hTemp) Then
		SayWindow (hTemp, READ_EVERYTHING)
	EndIf
	If (hTemp) Then
		Return 1
	Else
		Return 0
	EndIf
ElIf (nTitleLen == wnSetupTypeLen) Then
	let strMessage = FormatString(msgReadStaticWindows5_l, strTitle, msgDialog_L)
	SayFormattedMessage (OT_JAWS_MESSAGE, msgReadStaticWindows5_l, msgReadStaticWindows5_s)
	let hTemp = FindDescendantWindow (hRealWin, idSetupTypeStatic)
	If (hTemp) Then
		SayWindow (hTemp, READ_EVERYTHING)
		let hTemp = FindDescendantWindow (hRealWin, idDestFolderST)
	EndIf
	If (hTemp) Then
	SayFormattedMessage (OT_JAWS_MESSAGE, msgReadStaticWindows6_l, msgReadStaticWindows6_s)
		SayWindow (hTemp, READ_EVERYTHING)
	EndIf
	Return 1
ElIf (nTitleLen == wnQTPluginOptLen) Then
	SayFormattedMessage (OT_JAWS_MESSAGE, msgReadStaticWindows7_l, msgReadStaticWindows7_s)
	let hTemp = FindDescendantWindow (hRealWin, idPlugInST1)
	If (hTemp) Then
		SayWindow (hTemp, READ_EVERYTHING)
		let hTemp = FindDescendantWindow (hRealWin, idPlugInST2)
	EndIf
	If (hTemp) Then
		SayWindow (hTemp, READ_EVERYTHING)
	EndIf
	Return 1
ElIf (nTitleLen == wnQTComponentsLen) Then
	SayFormattedMessage (OT_JAWS_MESSAGE, msgReadStaticWindows8_l, msgReadStaticWindows8_s)
	let hTemp = FindDescendantWindow (hRealWin, idCompST)
	If (hTemp) Then
		SayWindow (hTemp, READ_EVERYTHING)
	EndIf
	let hTemp = FindDescendantWindow (hRealWin, idSpaceReqA)
	If (hTemp) Then
	SayFormattedMessage (OT_JAWS_MESSAGE, msgReadStaticWindows9_l, msgReadStaticWindows9_s)
		SayWindow (hTemp, READ_EVERYTHING)
	EndIf
	let hTemp = FindDescendantWindow (hRealWin, idSpaceAvailA)
	If (hTemp) Then
	SayFormattedMessage (OT_JAWS_MESSAGE, msgReadStaticWindows10_l, msgReadStaticWindows10_s)
		SayWindow (hTemp, READ_EVERYTHING)
	EndIf
	Return 1
EndIf
Return 0
EndFunction

Int Function ReadCustomControls ()
Var
	Handle hRealWin,
	String strTitle,
	Int nTitleLen,
	String strRealWinClass,
	Int nRealWinClassLen,
	Handle hCurWin,
	Int nCurWinID,
	Int nTheType,
	Handle hTemp,
	string strMessage
let hRealWin = GetRealWindow (GetFocus ())
let strRealWinClass = GetWindowClass (hRealWin)
let nRealWinClassLen = StringLength (strRealWinClass)
If (nRealWinClassLen != wcDialogLen) then
	Return 0
EndIf
let strTitle = GetWindowName (hRealWin)
let nTitleLen = StringLength (strTitle)
If (nTitleLen != wnLicenseLen
	&& nTitleLen != wnSetupTypeLen
	&& nTitleLen != wnQTPluginOptLen) Then
	Return 0
EndIf
let hCurWin = GetCurrentWindow ()
let nCurWinID = GetControlID (hCurWin)
If (nTitleLen == wnLicenseLen) Then
	If (nCurWinID == idLicenseEdit) then
		let strMessage = FormatString(msgReadCustomControls2_L, wnLicense ,GetWindowType (hCurWin))
		SayFormattedMessage(OT_CONTROL_NAME, msgReadCustomControls2_L)

		Return 1
	Else
		Return 0
	EndIf
ElIf (nTitleLen == wnSetupTypeLen) Then
	let nTheType = GetWindowSubTypeCode (hCurWin)
	If (nTheType != WT_RADIOBUTTON) Then
		Return 0
	Else
		If (nCurWinID == idFullRB) Then
			SayWindowTypeAndText (hCurWin)
			let hTemp = FindDescendantWindow (hRealWin, idFullST)
			SayWindow (hTemp, READ_EVERYTHING)
			Return 1
		ElIf (nCurWinID == idMinimumRB) Then
			SayWindowTypeAndText (hCurWin)
			let hTemp = FindDescendantWindow (hRealWin, idMinimumST)
			SayWindow (hTemp, READ_EVERYTHING)
			Return 1
		ElIf (nCurWinID == idCustomRB) Then
			SayWindowTypeAndText (hCurWin)
			let hTemp = FindDescendantWindow (hRealWin, idCustomST)
			SayWindow (hTemp, READ_EVERYTHING)
			Return 1
		Else
			Return 0
		EndIf
	EndIf
ElIf (nTitleLen == wnQTPluginOptLen) Then
	let nTheType = GetWindowSubTypeCode (hCurWin)
	If (nTheType != WT_BUTTON) Then
		Return 0
	Else
		If (nCurWinID == idNetscapeBrowse) Then
			SayFormattedMessage (ot_control_name, msgNetscapePlugIn_L)
			SayWindowTypeAndText (hCurWin)
			Return 1
		ElIf (nCurWinID == idIEBrowse) Then
			SayFormattedMessage (ot_control_name, msgIEPlugIn_L)
			SayWindowTypeAndText (hCurWin)
			Return 1
		Else
			Return 0
		EndIf
	EndIf
EndIf
Return 0
EndFunction

; Event functions and related functions
Void Function SayFocusedWindow ()
If (ReadCustomControls () == 0) then
	SayWindowTypeAndText (GlobalFocusWindow)
EndIf
EndFunction

Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let RealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
if (GlobalPrevApp != AppWindow && AppWindow != FocusWindow) then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
	SayWindowTypeAndText (AppWindow)
endif
If ((GlobalPrevRealName != RealWindowName) ; name has changed
	|| (GlobalPrevReal != RealWindow)) then ; or handle has changed, then
	If ((RealWindow != AppWindow) && (RealWindow != FocusWindow)) then
		If (ReadStaticTextWindows () == 0) then
			SayWindowTypeAndText (RealWindow)
		EndIf
	endif
EndIf
let GlobalFocusWindow = FocusWindow
if (GlobalPrevFocus != focusWindow) then
	SayFocusedWindow () ; will use global variable GlobalFocusWindow
else
	SayFocusedObject ()
EndIf
;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

; Scripts and functions that are common to all script sets
Script HotKeyHelp ()
Var
	Int nTitleLen,
	Handle hRealWin,
	Handle hTemp
if TouchNavigationHotKeys() then
	return
endIf
let hRealWin = GetRealWindow (GetFocus ())
let nTitleLen = StringLength (GetWindowName (hRealWin))
If (nTitleLen == wnSetupTypeLen) Then
	SayFormattedMessage (ot_user_buffer, msgHotKeyHelp10_L, msgHotKeyHelp10_S)
ElIf (nTitleLen == wnQTPluginOptLen) Then
	SayFormattedMessage (ot_user_buffer, msgHotKeyHelp11_L, msgHotKeyHelp11_S)
ElIf (nTitleLen == wnQTComponentsLen) Then
	SayFormattedMessage (ot_user_buffer, msgHotKeyHelp8_L)
EndIf
PerformScript HotKeyHelp()
EndScript

Void Function ScreenSensitiveHelpForKnownClasses (int nSubTypeCode)
var
	Handle hCurWin,
	string strObjectName
If (nSubTypeCode != WT_BUTTON && nSubTypeCode != WT_RADIOBUTTON) then
	ScreenSensitiveHelpForKnownClasses (nSubTypeCode)
	Return
EndIf
let hCurWin = GetCurrentWindow ()
let strObjectName = GetWindowName (hCurWin)
If (nSubTypeCode == WT_BUTTON) then
;	sshThisIsThe = " This is the ",
;	sshButton = " button ",
;	sshToActivateButton = " to activate the button press either the space bar or the enter key ",
;	sshMoveToNextControl = " to move to the next control press the tab key ",
	let strObjectName = GetWindowName (hCurWin)
	SayFormattedMessage (OT_HELP, msgScreenSensitiveHelpForKnownClasses3_l, msgScreenSensitiveHelpForKnownClasses3_s)
;WT_RADIOBUTTON = 19,
ElIf (nSubTypeCode == WT_RADIOBUTTON) then
;	sshRadioButton = " Radio Button ",
;	msgOneOfRBGroup_L = " It is a member of a group of radio buttons ",
;	msgOnlyOneRB_L = " only one radio button can be checked at a time ",
;	msgMoveBetweenRB_L = " to move between the members of the radial button group press the up or down arrow keys ",
	SayFormattedMessage (OT_HELP, msgScreenSensitiveHelpForKnownClasses4_l, msgScreenSensitiveHelpForKnownClasses4_s)
	Return
EndIf
EndFunction

Script ScreenSensitiveHelp ()
Var
	Int nTitleLen,
	Handle hRealWin,
	Handle hTemp,
	string sTemp
let hRealWin = GetRealWindow (GetFocus ())
let nTitleLen = StringLength (GetWindowName (hRealWin))
If (nTitleLen == wnQTComponentsLen && GetControlID (GetCurrentWindow ()) == idCompList) Then
	let sTemp = msgToReadCompDesc_L + strSpace + GetScriptKeyName ("ReadComponentDescription")
	SayFormattedMessage (ot_user_buffer, sTemp)
	PerformScript ScreenSensitiveHelp()
Else
	PerformScript ScreenSensitiveHelp()
EndIF
EndScript

Script  ScriptFileName()
ScriptAndAppNames(msgQuickTimeInstall_L)
EndScript

Script  SayWindowPromptAndText()
var
	handle hWnd,
	int iSubType,
	int nMode
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
If (ReadCustomControls () == 0) Then
	smmToggleTrainingMode(nMode)
	PerformScript SayWindowPromptAndText()
else
	SayTutorialHelp (iSubType, TRUE)
	SayTutorialHelpHotKey (hWnd, TRUE)
	IndicateComputerBraille (hwnd)
	smmToggleTrainingMode(nMode)
EndIf
EndScript

Script SayLine()
Var
	int nTheType
If IsSameScript () then
	SpellLine ()
	Return
EndIf
let nTheType = GetWindowSubtypeCode (GetCurrentWindow ())
If (nTheType == WT_RADIOBUTTON || nTheType == WT_BUTTON) Then
	If (ReadCustomControls () == 0) Then
		PerformScript SayLine()
	EndIf
Else
	PerformScript SayLine()
EndIf
EndScript

Script  SayWord()
Var
	int nTheType
let nTheType = GetWindowSubtypeCode (GetCurrentWindow ())
If (nTheType == WT_RADIOBUTTON || nTheType == WT_BUTTON) Then
	If (ReadCustomControls () == 0) Then
		PerformScript SayWord()
	EndIf
Else
	PerformScript SayWord()
EndIf
EndScript

;  Scripts specific to QuickTime 3.0 Install
Script ReviewDestinationDirectory ()
Var
	Int nTitleLen,
	Handle hRealWin,
	Handle hTemp
let hRealWin = GetRealWindow (GetFocus ())
let nTitleLen = StringLength (GetWindowName (hRealWin))
If (nTitleLen != wnSetupTypeLen) Then
	SayFormattedMessage (ot_message, msgNotInSetupTypeWin_L)
Else
	let hTemp = FindDescendantWindow (hRealWin, idDestFolderST)
	If (hTemp) Then
		SayFormattedMessage (ot_text, msgDestFolder_L)
		SayWindow (hTemp, READ_EVERYTHING)
	EndIf
EndIf
EndScript

Script ReviewPlugInDirectories ()
Var
	Int nTitleLen,
	Handle hRealWin,
	Handle hTemp,
	Int nWinState
let hRealWin = GetRealWindow (GetFocus ())
let nTitleLen = StringLength (GetWindowName (hRealWin))
If (nTitleLen != wnQTPluginOptLen) Then
	SayFormattedMessage (ot_message, msgNotInPlugInWin_L)
Else
	SayFormattedMessage (ot_message, msgPlugInDirs_L)
	let hTemp = FindDescendantWindow (hRealWin, idNetscapeButton)
	If (hTemp) Then
		If (IsWindowDisabled (hTemp) == FALSE) then
			SayFormattedMessage (ot_message, msgFor_L)
			SayWindow (hTemp, READ_EVERYTHING)
			let hTemp = FindDescendantWindow (hRealWin, idNetscapeStatic)
			If (hTemp) Then
				SayWindow (hTemp, READ_EVERYTHING)
			EndIf
		EndIf
	EndIf
	let hTemp = FindDescendantWindow (hRealWin, idIEButton)
	If (hTemp) Then
		If (IsWindowDisabled (hTemp) == FALSE) then
			SayFormattedMessage (ot_message, msgFor_L)
			SayWindow (hTemp, READ_EVERYTHING)
			let hTemp = FindDescendantWindow (hRealWin, idIEStatic)
			If (hTemp) Then
				SayWindow (hTemp, READ_EVERYTHING)
			EndIf
		EndIf
	EndIf
EndIf
EndScript

Script ReviewSpaceRequirements ()
Var
	Int nTitleLen,
	Handle hRealWin,
	Handle hTemp,
	Int nWinState
let hRealWin = GetRealWindow (GetFocus ())
let nTitleLen = StringLength (GetWindowName (hRealWin))
If (nTitleLen != wnQTComponentsLen) Then
	SayFormattedMessage (ot_message, msgNotInCompWin_L)
	Return
Else
	let hTemp = FindDescendantWindow (hRealWin, idSpaceReqA)
	If (hTemp) Then
		SayFormattedMessage (ot_text, msgRequired_L)
		SayWindow (hTemp, READ_EVERYTHING)
	EndIf
	let hTemp = FindDescendantWindow (hRealWin, idSpaceAvailA)
	If (hTemp) Then
		SayFormattedMessage (ot_text, msgAvailable_L)
		SayWindow (hTemp, READ_EVERYTHING)
	EndIf
	Return 1
EndIf
EndScript

Script ReadComponentDescription ()
Var
	Int nTitleLen,
	Handle hRealWin,
	Handle hTemp
let hRealWin = GetRealWindow (GetFocus ())
let nTitleLen = StringLength (GetWindowName (hRealWin))
If (nTitleLen != wnQTComponentsLen) Then
	SayFormattedMessage (ot_message, msgNotInCompWinA_L)
	Return
Else
	let hTemp = FindDescendantWindow (hRealWin, idCompDesc)
	If (hTemp) Then
		SayWindow (hTemp, READ_EVERYTHING)
	EndIf
EndIf
EndScript

Script ReviewDialogText ()
ReadStaticTextWindows ()
SayFocusedWindow ()
EndScript

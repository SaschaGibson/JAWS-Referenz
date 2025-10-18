; Copyright 2008-2015 by Freedom Scientific, Inc.
; Script File for the Web Conference PlugIn
;#pragma StringComparison partial

include "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "ie.jsh"
include "ie.jsm"
include "WebConference.jsh"
include "WebConference.jsm"

const
	EventTickCounterThreshold = 100
Globals
	int GlobalSayPromptAndText,
	int EventTickCounter

Void Function AutoStartEvent ()
let GlobalSayPromptAndText = FALSE
EndFunction

Script ScriptFileName ()
ScriptAndAppNames (MsgAppName)
EndScript

Script WindowKeysHelp ()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
SayFormattedMessage (OT_USER_BUFFER, msgWinKeysHelp1_L)
UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
EndScript

int Function HandleCustomWindows (handle hWnd)
Var
	int iCtrl,
	int iSubtype,
	int iYValue,
	string sDlgName,
	string sPrompt
If GetWindowClass (GlobalFocusWindow) ==  cwcIEServer  Then
	let iYValue = GetWindowHierarchyY (GlobalFocusWindow)
	If iYValue == 7
	&& (GlobalPrevFocus != GlobalFocusWindow) Then
		IndicateControlType (0, MsgBrowserWindow_L)
		Return
	ElIf iYValue == 9 Then
		IndicateControlType (0, msgChatHistoryWindow_L)
		Pause ()
		If !GlobalSayPromptAndText  Then
			JAWSBottomOfFile ()
			SayLine ()
		EndIf
		Return
	EndIf
EndIf
let iCtrl = GetControlID (hWnd)
let iSubtype = GetWindowSubtypeCode(hWnd)
let sDlgName = GetWindowName (GetRealWindow (hWnd))
If iCtrl == id_AddressEditCombo Then
	If sDlgName != wn_ConfigureTalkKeyDlg
	&& sDlgName != wn_FontDlg Then
		IndicateControlType (WT_EDITCOMBO, msgAddressBar_L, GetObjectValue(TRUE))
		return TRUE
	EndIf
ElIf iCtrl == id_ChatTextEntryEdit Then
	If sDlgName == wn_LogInDialogNamePrefix Then
		IndicateControlType (WT_EDIT, MsgUserName_L)
	ElIf DialogActive ()
	&& GetWindowName (hWnd) ==  wn_TalkSoundOn  Then
		return FALSE
	Else
		IndicateControlType (WT_EDIT, MsgTextChat_L)
	EndIf
	return TRUE
ElIf iCtrl == id_ChatHistoryWindow  Then
	If sDlgName == wn_LogInDialogNamePrefix Then
		IndicateControlType (WT_PASSWORDEDIT, MsgPassword_L)
		return TRUE
	EndIf
ElIf iSubtype == WT_LEFTRIGHTSLIDER Then
	If iCtrl == id_SpeakerVolumeSlider Then
		let sPrompt = MsgSpeakerVolume_L
	ElIf iCtrl == id_MicrophoneVolumeSlider  Then
		let sPrompt = MsgMicrophoneVolume_L
	EndIf
	IndicateControlType (WT_LEFTRIGHTSLIDER, sPrompt, GetObjectValue (TRUE))
	return TRUE
ElIf iCtrl == id_UserListTV Then
	If sDlgName != wn_ConfigureTalkKeyDlg Then
		IndicateControlType (WT_TREEVIEW, MsgUsersTreeView_L, tvGetFocusItemText (hWnd))
		SayTVFocusItemExpandState (hWnd)
		return TRUE
	EndIf
EndIf
return FALSE
EndFunction

void function ProcessSayAppWindowOnFocusChange(handle AppWindow, handle FocusWindow)
var
	string sPrevAppWinClass,
	string sOwnerApp
if GlobalPrevApp != AppWindow
&& GetWindowClass(AppWindow) == wc_TalkComClass
&& GetWindowClass(FocusWindow) == cwcIEServer then
	let sPrevAppWinClass = GetWindowClass (globalPrevApp)
	if sPrevAppWinClass == IEFrameClass then
		let sOwnerApp = GetWindowOwner(GlobalPrevApp)
		if sOwnerApp then
			let sOwnerApp = StringSegment(sOwnerApp,cScDoubleBackSlash,StringSegmentCount(sOwnerApp,cScDoubleBackSlash))
			if sOwnerApp == sAppName_IE  then
				SayUsingVoice(vctx_message, msgNewBrowserWindow1_L,ot_STATUS)
			EndIf
		EndIf
	EndIf
EndIf
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
EndFunction

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName, handle FocusWindow)
If RealWindowName != wn_LogInDialogNamePrefix Then
	If GetControlID (FocusWindow ) == id_ChatHistoryWindow
	&& GetWindowName (FocusWindow) != wn_TalkSoundOff  Then
		SetFocus (GetFirstChild (GetFirstChild (GetFirstChild (FocusWindow))))
		return
	EndIf
EndIf
ProcessSayFocusWindowOnFocusChange(RealWindowName, FocusWindow)
;The following tick count is used to determine if double speaking should be avoided
;by suppressing SayHighlightedText after a focus change.
;adjust the constant EventTickCounterThreshold if needed.
;Note that the counter is set after the focus change process
;to avoid timing variants due to how long it took to process the code in the focus change announcement.
let EventTickCounter = GetTickCount()
EndFunction

Script GoBack ()
let BackForward = 1
TypeKey (ksBack)
SayFormattedMessage (OT_STATUS, msgBack_L, cmsgSilent)
EndScript

Script GoForward ()
let BackForward = 1
TypeKey (ksForward)
SayFormattedMessage (OT_STATUS, msgForward_L, cmsgSilent)
EndScript

Script ToggleGlobalSetting ()
SayFormattedMessage (OT_STATUS, MsgAdjustGlobalSetting_L, cMsgSilent)
TypeKey (ksToggleGlobalSetting)
EndScript

Script DisableTalkKey ()
Var
	handle hWnd,
	string sText
let hWnd = GetFocus ()
let hWnd = FindDescendantWindow (GetAppMainWindow (hWnd), id_StatusBar)
TypeKey (ksDisableTalkKey)
Pause ()
If HWnd
&& IsWindowVisible (hWnd) Then
	let sText = GetWindowText (hWnd,  FALSE)
	If sText Then
		If StringContains (sText, scTalkKeyOff)  Then
			SayFormattedMessage(OT_STATUS, MsgTalkKeyDisabled_L, MsgTalkKeyDisabled_S)
		Else
			SayFormattedMessage (OT_STATUS, MsgTalkKeyEnabled_L, MsgTalkKeyEnabled_S)
		EndIf
	EndIf
Else
	SayFormattedMessage (OT_ERROR, MsgStatusBarNotVisible_L, MsgStatusBarNotVisible_S)
EndIf
EndScript

Script MuteAudio ()
Var
	handle hWnd,
	string sText
let hWnd = GetFocus ()
let hWnd = FindDescendantWindow (GetAppMainWindow (hWnd), id_StatusBar)
TypeKey (ksMuteSound)
Pause ()
If hWnd
&& IsWindowVisible (hWnd) Then
	let sText = GetWindowText (hWnd, FALSE)
	If sText Then
		If StringContains (sText, scAudioMuted)  Then
			SayFormattedMessage(OT_STATUS, MsgAudioMuted_L, MsgAudioMuted_S)
		Else
			SayFormattedMessage (OT_STATUS, MsgAudioNotMuted_L, MsgAudioNotMuted_S)
		EndIf
	EndIf
Else
	SayFormattedMessage (OT_ERROR, MsgStatusBarNotVisible_L, MsgStatusBarNotVisible_S)
EndIf
EndScript


Void Function LockTalkKey ()
Var
	handle hWnd,
	string sText
let hWnd = GetFocus ()
let hWnd = FindDescendantWindow (GetAppMainWindow (hWnd), id_StatusBar)
Pause ()
If hWnd
&& IsWindowVisible (hWnd) Then
	let sText = GetWindowText (hWnd, FALSE)
	If sText Then
		If StringContains (sText, scTalkKeyLocked)  Then
			SayFormattedMessage(OT_STATUS, MsgTalkKeyLocked_L, MsgTalkKeyLocked_S)
		Else
			SayFormattedMessage (OT_STATUS, MsgTalkKeyUnlocked_L, MsgTalkKeyUnlocked_S)
		EndIf
	EndIf
Else
	SayFormattedMessage (OT_ERROR, MsgStatusBarNotVisible_L, MsgStatusBarNotVisible_S)
EndIf
EndFunction


Script AnnounceActionKeysStatus ()
Var
	handle hWnd,
	string sKeyStatus,
	string sText
let hWnd = FindDescendantWindow (GetAppMainWindow (hWnd), id_StatusBar)
If hWnd
&& IsWindowVisible (hWnd) Then
	let sKeyStatus = cscNull
	let sText = GetWindowText (hWnd, FALSE)
	If sText Then
		If StringContains (sText, scTalkKeyOff ) Then
			let sKeyStatus =  MsgTalkKeyDisabled_L
		Else
			let sKeyStatus =  MsgTalkKeyEnabled_L
		EndIf
		If StringContains (sText, scAudioMuted) Then
			let sKeyStatus = sKeyStatus +  scComma + cscSpace + MsgAudioMuted_L
		Else
			let sKeyStatus = sKeyStatus +  scComma + cscSpace + MsgAudioNotMuted_L
		EndIf
		If StringContains (sText, scTalkKeyLocked) Then
			let sKeyStatus = sKeyStatus + scComma + cscSpace + MsgTalkKeyLocked_L
		Else
			let sKeyStatus = sKeyStatus + scComma + cscSpace + MsgTalkKeyUnLocked_L
		EndIf
		SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, sKeyStatus)
	EndIf
EndIf
EndScript

void function ShowScreenSensitiveHelp(string sHelpMsg_L, string sHelpMsg_S, int bOmitHotKeyLinks)
If GetControlID (GetCurrentWindow ()) == id_UserListTV  Then
	If UserBufferIsActive () Then
		UserBufferDeactivate ()
	EndIf
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpUsersTV_L)
	AddHotKeyLinks ()
	return
EndIf
ShowScreenSensitiveHelp(sHelpMsg_L, sHelpMsg_S, bOmitHotKeyLinks)
EndFunction


Script SelectHTMLElement ()
TypeCurrentScriptKey ()
EndScript

Void Function ClickButton (int iControl)
Var
	handle hWnd,
	int nBottom,
	int nLeft,
	int nRight,
	int nTop,
	int nX,
	int nY
If !iControl Then
	return
EndIf
hWnd = FindDescendantWindow (GetParent (GetFocus ()), iControl)
if (! hwnd || IsWindowDisabled (hWnd) || !IsWindowVisible (hWnd))
	hWnd = FindDescendantWindow (GetAppMainWindow (GetFocus ()), iControl)
endIf
If  IsWindowDisabled (hWnd)
&& !IsWindowVisible (hWnd) Then
	return
EndIf
let nRight = GetWindowRight (hWnd)
let nLeft = GetWindowLeft (hWnd)
let nX = nLeft + (nRight  - nLeft) /2
let nBottom = GetWindowBottom (hWnd)
let nTop = GetWindowTop (hWnd)
let nY = nTop + (nBottom  - nTop) /2
ClickAtPoint (nX, nY, TRUE)
EndFunction

Script ActivateFontDialog ()
If UserBufferIsActive () Then
	UserBufferDeactivate ()
EndIf
ClickButton (id_FontBtn)
EndScript

Script ActivateCustomColorDlg ()
If UserBufferIsActive () Then
	UserBufferDeactivate ()
EndIf
ClickButton (id_ColorBtn)
EndScript









Script SayWindowPromptAndText ()
let GlobalSayPromptAndText = TRUE; set to true to keep the JAWSBottomOfFile and SayLine functions from being performed
; from the HandleCustomWindows function above
PerformScript SayWindowPromptAndText ()
let GlobalSayPromptAndText = FALSE
EndScript

Script HotKeyHelp ()
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (OT_USER_BUFFER, msgWebConferenceHotKeyHelp1_L)
UserBufferAddText (cScBufferNewLine )
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndScript


Void Function SayHighLightedText (handle hwnd, string buffer)
If GetWindowClass (hWnd) ==  cwcIEServer  Then
	If GetFocus () != hWnd Then
		return
	EndIf
EndIf
;determine if double speaking should be avoided by suppressing SayHighlightedText after a focus change.
;adjust the constant EventTickCounterThreshold if needed.
if GetTickCount()-EventTickCounter < EventTickcounterThreshold then
	if IsWebConferenceAddressBarWindow(hWnd) then
		return
	EndIf
EndIf
SayHighlightedText (hWnd, Buffer)
EndFunction

Void Function SayNonHighLightedText (handle hwnd, string buffer)
If GetWindowClass (hWnd) ==  cwcIEServer  Then
	If GetFocus () != hWnd Then
		return
	EndIf
EndIf
SayNonHighlightedText (hWnd, Buffer)
EndFunction

int function IsWebConferenceAddressBarWindow(handle hWnd)
var
	string sDlgName
if GetControlID(hWnd) != id_AddressEditCombo then
	return false
EndIf
let sDlgName = GetWindowName (GetRealWindow (hWnd))
If sDlgName == wn_ConfigureTalkKeyDlg
|| sDlgName == wn_FontDlg Then
	return false
EndIf
return true
EndFunction

handle function GetAddressBarWindow()
var
	handle hWnd,
	handle hNull,
	string sDlgName
let hWnd = FindDescendantWindow(GetAppMainWindow(GetFocus()),id_AddressEditCombo)
if !hWnd then
	return hNull
EndIf
let sDlgName = GetWindowName (GetRealWindow (hWnd))
If sDlgName == wn_ConfigureTalkKeyDlg
|| sDlgName == wn_FontDlg Then
	return hNull
EndIf
return hWnd
EndFunction

string function GetCurrentURL(handle hwnd)
return GetWindowTextEx(hwnd,0,0)
EndFunction

Script AddressBar ()
var
	handle hwnd,
	string sMessage,
	string sURL
let hwnd = GetAddressBarWindow()
if !hWnd then
	SayMessage (ot_ERROR, msgAddressBarNotFound1_L, msgAddressBarNotFound1_S)
	return
EndIf
if IsSameScript () then
	if IsWindowVisible (hwnd)
	&& !IsWindowObscured(hWnd) then
		TypeKey(ksMoveToAddressBar)
	else
		SayMessage(ot_error,msgAddressNotVisible_l,msgAddressNotVisible_S)
	EndIf
	return
EndIf
let sURL = GetCurrentURL(hwnd)
if sURL then
	let sMessage = FormatString (msgAddress1_L, sURL)
	SayFormattedMessage (ot_user_requested_information, sMessage, sURL)
else
	SayFormattedMessage(ot_user_requested_information, msgAddressBar1_L, cmsgSilent)
EndIf
EndScript

int function BrailleAddObjectDlgText(int nSubtype)
if nSubtype == wt_dialog then
	if GetWindowName (GetRealWindow (GetFocus())) == wn_LogInDialogNamePrefix Then
		BrailleAddString(cscNull,0,0,0)
		return true
	EndIf
EndIf
return BrailleAddObjectDlgText(nSubtype)
EndFunction

int function BrailleAddObjectName(int nSubtype)
var
	int iCtrl
if nSubtype == wt_Button then
	let iCtrl = GetControlID(GetFocus())
	if iCtrl == id_AddToFavoritesBtn then
		BrailleAddString(msgAddToFavorites,GetCursorCol(),GetCursorRow(),Attrib_Highlight)
		return true
	elif iCtrl == id_ConfigurationBtn then
		BrailleAddString(msgConfiguration,GetCursorCol(),GetCursorRow(),Attrib_Highlight)
		return true
	EndIf
ElIf nSubtype == wt_Edit then
	let iCtrl = GetControlID(GetFocus())
	if iCtrl == id_UserNameEdit then
		BrailleAddString(MsgUserName_L,0,0,0)
		return true
	EndIf
ElIf nSubtype == wt_PasswordEdit then
	let iCtrl = GetControlID(GetFocus())
	if iCtrl == id_PasswordEdit then
		BrailleAddString(MsgPassword_L,0,0,0)
		return true
	EndIf
EndIf
return BrailleAddObjectName(nSubtype)
EndFunction
int function SayGraphicalButton(handle hWnd)
var
	int iCtrl
if !UserBufferIsActive() then
	let ICtrl = GetControlID(hWnd)
	if iCtrl == id_AddToFavoritesBtn then
		IndicateControlType (WT_button, msgAddToFavorites)
		return true
	elif iCtrl == id_ConfigurationBtn then
		IndicateControlType (WT_button, msgConfiguration)
		return true
	EndIf
EndIf
return false
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if !nLevel
&& !InHomeRowMode() then
	if SayGraphicalButton(GetCurrentWindow()) then
		return
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void function SayLine(optional int iDrawHighlight, optional int bSayingLineAfterMovement)
if SayGraphicalButton(GetCurrentWindow()) then
	return
EndIf
SayLine(iDrawHighlight, bSayingLineAfterMovement)
EndFunction

void function SayWord()
if SayGraphicalButton(GetCurrentWindow()) then
	return
EndIf
SayWord()
EndFunction

void function SayCharacter(optional int IncludeMarkup)
if SayGraphicalButton(GetCurrentWindow()) then
	return
EndIf
SayCharacter(IncludeMarkup)
EndFunction

; Override the default functions, but use messages instead
; of injecting keys to perform cut, copy, and paste.

void function updateClipboard(int nMethod)
;the following If-ElIf-EnIf block must test the conditions in the order listed:
if ClipboardUpdateInConsoleWindow(nMethod) then
	return
elif IsNoSelectionForClipboard() then
	SayMessage (OT_ERROR, cmsgNothingSelected)
	return
elif MayOnlyCopyToClipboard()
&& nMethod == CLIPBOARD_CUT then
	;just pass the key through
	SayCurrentScriptKeyLabel ()
	SendMessage(GetFocus(), WM_CUT)
	return
elif !WillOverwriteClipboard() then
	return
EndIf
if nMethod == CLIPBOARD_CUT then
	let ClipboardTextChanged = Clipboard_Cut
	SendMessage(GetFocus(), WM_CUT)
else
	let ClipboardTextChanged = Clipboard_Copied
	if (IsVirtualPCCursor())
		CopySelectionToClipboard ()
	else
		SendMessage(GetFocus(), WM_COPY)
	endIf
endIf
endFunction

Script PasteFromClipboard()
SendMessage(GetFocus(), WM_PASTE)
SayFormattedMessage (OT_JAWS_MESSAGE, cmsg53_L, cmsg53_S)
EndScript
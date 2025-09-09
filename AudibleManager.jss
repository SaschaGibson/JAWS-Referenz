;Script File for AudibleManager 3.5, 3.60, 3.61, 4.0, and 5.X
;Copyright 2010-2021 by Freedom Scientific BLV Group, LLC
;JAWS version 10
;
; **************************************
;*	        Written By		*
;*	Freedom Scientific Scripting	*
;*		Team Gold		*
; **************************************
;extensively modified and augmented by K. Gould, August, 2003 to December, 2008
;
include"HjConst.jsh"
include"HjGlobal.jsh"
include"HjHelp.jsh"
include"manager.jsh"
include"manager.jsm"
include "common.jsm"

Globals
Int giSuppressStartMenu,
Int iWin95,
Handle GlobalDetailHandle, ;added for am5
;for scheduling delayed ObjStateChangedEvent:
	int giScheduledDelayedAnnounceObjStateChange,
	handle hObjStateObj,
String sBeforeUnselecting


void Function AutoStartEvent ()
if (AudioManagerFirstTime == 0) then
	let AudioManagerFirstTime = 1
	let ManagerVersion = GetManagerVersion ()
If ManagerVersion > 360 Then ;modified for am5
let wcDevicePane = wcDevicePane2
ElIf ManagerVersion  == 360 Then ;modified for am5
let wcDevicePane = wcDevicePane3
Else
let wcDevicePane = wcDevicePane1
EndIf
	SayFormattedMessage (OT_APP_START, msgAutoStart1_L, msgAutoStart1_S)
endif
;sometimes this app activates the menu bar when focus is returned to it using Alt+Tab, so the following dismisses the menu bar
If GetWindowClass (GetFocus ()) == wcListView || GetWindowClass (GetFocus ()) == wcMenuControlClass Then
TypeKey (ks9)
EndIf
EndFunction

void function SayWindowTypeAndText (handle hwnd)
var string sControlText = getWindowText (hwnd, READ_EVERYTHING)
if getWindowSubtypeCode (hwnd) == WT_LISTBOX &&getWindowClass (hwnd) == cwc_ListBox
&& ! stringIsBlank (sControlText) then
	return SayControlExWithMarkup (hwnd, "", "", "", "", "", sControlText)
endIf
return sayWindowTypeAndText (hwnd)
endFunction

void function SayObjectTypeAndText (optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd = getCurrentWindow (),
	string sControlText = getWindowText (hwnd, READ_EVERYTHING)
if ! nLevel && getWindowSubtypeCode (hwnd) == WT_LISTBOX &&getWindowClass (hwnd) == cwc_ListBox
&& ! stringIsBlank (sControlText) then
	return SayControlExWithMarkup (hwnd, "", "", "", "", "", sControlText)
endIf
return sayObjectTypeAndText (nLevel,includeContainerName)
endFunction


Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
String sClass,
	string RealWindowName,
	handle AppWindow
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
Let GlobalPrevWindow = PrevWindow ;added by kag
let RealWindow = GetRealWindow (FocusWindow)
let sClass = GetWindowClass (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
if (GlobalPrevApp != AppWindow && AppWindow != FocusWindow) then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
	If ! GlobalWasHjDialog then
		SayWindowTypeAndText (AppWindow)
	EndIf
endIf
If ((GlobalPrevRealName != RealWindowName) ; name has changed
|| (GlobalPrevReal != RealWindow)) then ; or handle has changed, then
	If ((RealWindow != AppWindow) && (RealWindow != FocusWindow)) then
		If ! GlobalWasHjDialog &&
		! GISuppressStartMenu then
			;GlobalWasHjDialog prevents over chatter, especially when exiting a list box and returning to a client area.
			;Set to FALSE when one HjDialog follows another
			;Example:
			;AddBrailleColors function
			;The GISuppressStartMenu function set to TRUE on account of the Real Window Name in Windows XP
		if (sClass != wcAudio) then
If Not StringContains (GetWindowText (GetParent (GlobalFocusWindow), FALSE), scSlideTheBar) Then ;To remove chatter in version 3.61 when transferring file to Otis
			SayWindowTypeAndText (RealWindow)
EndIf
EndIf
		EndIf
	endIf
endIf
let GlobalFocusWindow = FocusWindow
if (PlayList == 0) then
	if (sClass == wcPlayList) then
		let PlayList = 1
		SayFormattedMessage (OT_SMART_HELP, msgFocusChangedEvent1_L, msgFocusChangedEvent1_S)
	endif
endif
;If in Start Menu,
;And not in Win NT or 95,
; Speak Object Name instead of the whole Object Type And Text information
If GetWindowSubTypeCode (FocusWindow) == WT_STARTMENU ||
;Windows XP, the Type code is ListView, so
RealWindowName == cWnStartMenu then
	If GISuppressStartMenu &&
	! iWin95 then
		Say (GetObjectName (), OT_CONTROL_NAME)
	EndIf
Else
	;Turn off Start Menu flag,
	;As we are not in the Start Menu, probably launched application or simply exited
	Let GISuppressStartMenu = FALSE;
	SayFocusedWindow ()
EndIf
;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
Let GlobalWasHjDialog = InHjDialog ()
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

Void Function SayFocusedWindow ()
var
	handle hWinSwitch,
	Int iControl
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
if MenusActive () then
	return
endIf
;Keepp alt+tab from over-talking
let hWinSwitch=findTopLevelWindow(cwc_Dlg32771,cscNull)
if (hWinSwitch && isWindowVisible(hWinSwitch)) then
	Return
EndIf
;section added by kag to move focus to virtual viewer when choosing
;"Detail View" for the first time of each session of Audible Manager
If GetWord () == scDetail ||
 (GetWindowClass (GetCurrentWindow ()) == wcDetailView && GetWindowName (GetCurrentWindow ()) == wnDetailView) then
	JAWSCursor ()
	SaveCursor ()
	RouteJAWSToPc ()
	NextLine ()
	LeftMouseButton ()
	RestoreCursor ()
	PCCursor ()
	Delay (3)
	JAWSTopOfFile ()
	Return
EndIf
;For prompting the user appropriately when the transfer to device dialog pops up, added by kag
If StringContains (GetWindowText (GetParent (GlobalFocusWindow), FALSE), scSlideTheBar) Then
	If GetWindowTypeCode (GlobalFocusWindow) == WT_BUTTON && GetWord () == scOK Then
		If GetWindowTypeCode  (GlobalPrevWindow) != WT_BUTTON && GetWindowTypeCode  (GlobalPrevWindow) != WT_Edit Then
			SayFormattedMessage (OT_SMART_HELP, msgTransferReview_L, msgTransferReview_S)
		EndIf
	EndIf
	Let iControl = GetControlID (GlobalFocusWindow)
	If iControl == iDStartHours || iControl == iDEndHours Then
		SayWindowTypeAndText (GetFocus ())
		SayMessage(ot_control_name, msgHours, msgHours)
		Return
	EndIf
	If iControl == iDStartMinutes || iControl == iDEndMinutes Then
		SayMessage (OT_CONTROL_TYPE, msgEdit, msgEdit)
		SayWindow (GetFocus (), READ_HIGHLIGHTED)
		SayMessage(ot_control_name, msgMinutes, msgMinutes)
		Return
	EndIf
EndIf
SayFocusedObject ()
EndFunction

void Function SayNonHighlightedText (handle hWnd, string buffer)
var
	int iWinType,
	String TheClass
let TheClass = GetWindowClass (hwnd)
;Following section added by kag to stop incessant reading of progress information while transferring files to Otis and allow reporting by progress bar
If StringContains (buffer, scAudioFileTransfer) Then
Return
EndIf
;following section added by kag to set focus to virtual viewer when user
;chooses "Detail View" of book from list view of selections
If ManagerVersion <500 Then ;added for am5
If GetWindowClass (GetFocus ()) == WcListView Then
If TheClass == wcIEServer Then
SetFocus (hwnd)
If GlobalDoSayAll == True Then
Let GlobalDoSayAll  = False
SayMessage (OT_JAWS_MESSAGE, msgDetailView)
SpeechOff ()
Pause ()
Delay (10)
JAWSTopOfFile ()
SpeechOn ()
SayAll ()
EndIf
EndIf
EndIf
Else ;added for am5
If GetWindowClass (GetFocus ()) == WcListView Then ;added for am5
If TheClass == wcIEServer Then ;added for am5
Let GlobalDetailHandle = hwnd ;added for am5
EndIf ;added for am5
EndIf ;added for am5
endIf ;is this less than version 5, added for am5
;The following evaluation is to provide feedback for the MSN Messenger alert pop-ups.
;Although we use the OT_NONHIGHLIGHTED_SCREEN_TEXT type definition for speech,
;we must use the proper voice context to differentiate.
;Hence the use of SayUsingVoice function.
If GetScreenEcho () >= 1 then;Respect the setting of JAWSKey+S
	If (TheClass == cWcMessengerAlert) ||
	(TheClass == cWcMessengerAlert2) then
		SayUsingVoice (VCTX_MESSAGE, buffer, OT_NONHIGHLIGHTED_SCREEN_TEXT)
		Return;
	EndIf
EndIf
if (GlobalMenuMode == 0) then
	let iWinType = GetWindowSubTypeCode (hWnd)
	if (iWinType == WT_STATUSBAR) then
		if (PlayList == 0) then
			if (buffer == sc1_L) then
				return
			endif
		endif
		SayFormattedMessage (OT_NONHIGHLIGHTED_SCREEN_TEXT, buffer)
		return
	endif
endif
SayNonHighlightedText (hWnd, buffer)
EndFunction

Void Function SayHighLightedText (handle hwnd, string buffer)
;added by kag to stop excess verbiage when dropping context menu in main Manager window
If GetWindowSubtypeCode (GetCurrentWindow ()) == WT_CONTEXTMENU &&
GetWindowSubtypeCode (hwnd) == WT_LISTVIEW Then  ;verbiage being spoken is not from window we're in
Return
Else
SayHighlightedText (hwnd, buffer)
EndIf
EndFunction

Script ScreenSensitiveHelp ()
var
	handle hWnd,
	string sClass
if (IsSameScript ()) then
	AppFileTopic (topic_Audible_Audio_Manager)
	return
endif
if (GlobalMenuMode > 0) then
	PerformScript ScreenSensitiveHelp ()
	return
endif
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
let hWnd = GetCurrentWindow ()
let sClass = GetWindowClass (hWnd)
if (sClass == wcPlayList) then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp1_L, msgScreenSensitiveHelp1_S)
	AddHotKeyLinks ()
	return
endif
PerformScript ScreenSensitiveHelp ()
EndScript

Script HotKeyHelp ()
var
	handle hWnd,
	int iWinType,
	string sClass,
	string sTemp_L
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
let hWnd = GetCurrentWindow ()
let sClass = GetWindowClass (hWnd)
let iWinType = GetWindowSubTypeCode (hWnd)
let sTemp_L = FormatString(msgHotKeyHelp1_L) + cScBufferNewLine
if (sClass == wcAudio) then
	let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp2_L)
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_L)
Elif (iWinType == WT_LISTVIEW) then
If ManagerVersion >= 500 Then ;section added for AM5
	let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp7_L)
Else
	let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp3_L)
EndIf
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_L)
ElIf sClass == wcIEServer  Then
If ManagerVersion >= 500 Then ;next 3 lines added for AM5
	let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp6_L)
Else
If ManagerVersion > 360 Then ;modified for AM5
	let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp5_L)
Else
	let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp4_L)
EndIf
EndIf ;added for AM5
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_L)
Else
PerformScript HotKeyHelp ()
EndIf
EndScript

Script WindowKeysHelp ()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
If ManagerVersion >= 500 Then ;section added for AM5
	SayFormattedMessage (OT_USER_BUFFER, msgWindowKeysHelp3_L, msgWindowKeysHelp3_L)
ElIf ManagerVersion > 360 Then ;modified for AM5
	SayFormattedMessage (OT_USER_BUFFER, msgWindowKeysHelp2_L, msgWindowKeysHelp2_L)
Else
	SayFormattedMessage (OT_USER_BUFFER, msgWindowKeysHelp1_L, msgWindowKeysHelp1_L)
EndIf
EndScript

Script ScriptFileName ()
ScriptAndAppNames (msgFN1)
EndScript

Script Enter ()
var
	handle hWnd,
	string sClass,
	string strText
SayCurrentScriptKeyLabel ()
;Set global parameter to allow SayAll when opening Detail view
If GetWindowClass (GetFocus ()) == WcListView  Then
Let GlobalDoSayAll = True
EndIf
EnterKey ()
let hWnd = GetCurrentWindow ()
let sClass = GetWindowClass (hWnd)
if (sClass == wcAudio) || (WasButtonPressed) then
	SaveCursor ()
	JAWSCursor ()
	RouteJAWSToPc ()
	LeftMouseButton ()
	RestoreCursor ()
	TypeKey (ks1)
endif
let WasButtonPressed = false
EndScript

Script Rewind () ;modified for AM5
If ManagerVersion < 500 Then
TypeKey (ks2)
if (GetWindowClass (GetCurrentWindow ()) == wcAudio) then
	let WasButtonPressed = true
endif
Else
SpeechOff ()
TypeCurrentScriptKey ()
Delay (3)
SpeechOn ()
EndIf
EndScript

Script FastForward () ;modified for AM5
If ManagerVersion < 500 Then
TypeKey (ks3)
if (GetWindowClass (GetCurrentWindow ()) == wcAudio) then
	let WasButtonPressed = true
endIf
Else
SpeechOff ()
TypeCurrentScriptKey ()
Delay (3)
SpeechOn ()
EndIf
EndScript

Script PreviousSection () ;modified for AM5
If ManagerVersion < 500 Then
TypeKey (ks4)
if (GetWindowClass (GetCurrentWindow ()) == wcAudio) then
	let WasButtonPressed = true
endIf
Else
SpeechOff ()
TypeCurrentScriptKey ()
Delay (3)
SpeechOn ()
EndIf
EndScript

Script NextSection () ;modified for AM5
If ManagerVersion < 500 Then
TypeKey (ks5)
if (GetWindowClass (GetCurrentWindow ()) == wcAudio) then
	let WasButtonPressed = true
endIf
Else
SpeechOff ()
TypeCurrentScriptKey ()
Delay (3)
SpeechOn ()
EndIf
EndScript

Script PlayAndStop () ;modified for AM5
If ManagerVersion < 500 Then
TypeKey (ks6)
if (GetWindowClass (GetCurrentWindow ()) == wcAudio) then
	let WasButtonPressed = true
endIf
Else
SpeechOff ()
TypeCurrentScriptKey ()
Delay (3)
SpeechOn ()
EndIf
EndScript

Script VolumeDown () ;modified for AM5
If ManagerVersion < 500 Then
TypeKey (ks7)
if (GetWindowClass (GetCurrentWindow ()) == wcAudio) then
	let WasButtonPressed = true
endIf
Else
SpeechOff ()
TypeCurrentScriptKey ()
Delay (3)
SpeechOn ()
EndIF
EndScript

Script ControlU () ;modified for AM5
var
	int nEcho,
	handle hWnd,
	string sClass
If ManagerVersion < 500 Then
TypeKey (ks8)
Pause ()
let hWnd = GetCurrentWindow ()
let sClass = GetWindowClass (hWnd)
if (sClass == wcAudio) || (WasButtonPressed) then
	let WasButtonPressed = true
else
	let nEcho = GetJcfOption (OPT_TYPING_ECHO)
	SayCurrentScriptKeyLabel ()
	if (sClass == wcListView) then
		SayWindowTypeAndText (hWnd)
	endIf
endIf
Else
SpeechOff ()
TypeCurrentScriptKey ()
Delay (3)
SpeechOn ()
EndIf
EndScript

string Function AddToString(String Base, String strNew)
let Base = Base + strNew + cScBufferNewLine
Return Base
EndFunction

Void Function ProcessSpeechOnNewTextEvent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
;mods by kag to make menu bar speak with left and right arrow keys
If NBackgroundColor == MenuBarBackgroundHighlight
&& GetWindowClass (hwnd) == wcMenuControlClass Then
	Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
	return
EndIf
ProcessSpeechOnNewTextEvent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction


Int Function ContextMenuProcessed (handle HWND)
var
	string sOwner
if GetWindowSubTypeCode(hWnd) != WT_CONTEXTMENU then
	return false
EndIf
let sOwner = GetWindowOwner(hWnd)
if sOwner then
	let sOwner = StringSegment(sOwner,cScDoubleBackSlash,StringSegmentCount(sOwner,cScDoubleBackSlash))
	if sOwner == cscAppJFWExecutable then
		let sOwner = cscAppJFWFriendly
	ElIf sOwner == cscAppMagicExecutable then
		let sOwner = cscAppMagicFriendly
	else
		let sOwner = cscNull
	EndIf
EndIf
IndicateControlType(WT_CONTEXTMENU,sOwner)
MenuModeHook ()
return true
EndFunction

Script HideDetailView ()
;added by KAG to close Detail View window of current book selection
If UserBufferIsActive () then
	UserBufferDeactivate ()
Delay (5) Pause ()
EndIf
If IsVirtualPCCursor () Then
SayFormattedMessage (OT_JAWS_MESSAGE, msgHideDetailView_L, msgHideDetailView_S)
SaveCursor ()
JAWSCursor ()
SaveCursor ()
RouteJAWSToPc ()
JAWSPageUp ()
JAWSEnd ()
If GetWord () == scHideWindow Then
LeftMouseButton ()
Else
RestoreCursor () RestoreCursor ()
SayFormattedMessage (OT_JAWS_MESSAGE, msgNoHideDetailView_L, msgNoHideDetailView_S)
EndIf
RestoreCursor () RestoreCursor ()
Else
RestoreCursor () RestoreCursor ()
SayMessage (OT_ERROR, msgNotDetailView)
EndIf
EndScript

Script ActivateOtisOrTransferProgramList ()
;added by kag
Var
Handle hwnd
If UserBufferIsActive () then
	UserBufferDeactivate ()
Pause ()
EndIf
If GetControlID (GetCurrentWindow ()) == iDOtisList Then
SayFormattedMessage (OT_JAWS_MESSAGE, msgAlreadyInOtis_L, msgAlreadyInOtis_S)
Return
EndIf
SayFormattedMessage (OT_JAWS_MESSAGE, msgOtisList_L, msgOtisList_S)
Let hwnd = FindDescendantWindow (GetAppMainWindow (GetCurrentWindow ()), iDOtisList)
If hwnd Then
SetFocus (hwnd)
Else
SayFormattedMessage (OT_ERROR, msgOtisNotFound, cmsgSilent)
Return
EndIf
Pause ()
If GetWord () == cscNull Then
SayFormattedMessage (OT_ERROR, msgNoOtisPrograms_L, msgNoOtisPrograms_S)
EndIf
EndScript

Script ActivateInBoxProgramList ()
;added by kag
Var
Handle hwnd
If UserBufferIsActive () then
	UserBufferDeactivate ()
Pause ()
EndIf
If GetControlID (GetCurrentWindow ()) == iDList Then
SayFormattedMessage (OT_JAWS_MESSAGE, msgAlreadyInInBox_L, msgAlreadyInInBox_S)
Return
EndIf
SayFormattedMessage (OT_JAWS_MESSAGE, msgInBoxList_L, msgInBoxList_S)
Let hwnd = FindDescendantWindow (GetAppMainWindow (GetCurrentWindow ()), iDList)
If hwnd Then
SetFocus (hwnd)
Else
SayFormattedMessage (OT_ERROR, msgInBoxNotFound, cmsgSilent)
EndIf
EndScript

Script ToggleDevicePane ()
;added by kag
Var
Handle hwnd
If UserBufferIsActive () then
	UserBufferDeactivate ()
Pause ()
EndIf
If ManagerVersion >=500 Then
SayCurrentScriptKeyLabel ()
Return
EndIf
TypeKey (cksEsc) ;in case menu bar is active
TypeCurrentScriptKey ()
SpeechOff () ;next 3 lines prevent excess verbiage during toggling of Device Pane in 3.6.1
Delay (1)
SpeechOn ()
Let hwnd = FindWindow (GetAppMainWindow (GetCurrentWindow ()), wcDevicePane, cscNull)
If hwnd Then
SaveCursor ()
InvisibleCursor ()
MoveToWindow (hwnd)
Pause () Pause ()
If GetWord () > cscNull
|| StringContains (GetWindowText (GetCurrentWindow (), False), scFree) Then
SayFormattedMessage (OT_JAWS_MESSAGE, msgDevicePaneOpen_L, msgDevicePaneOpen_S)
Else
SayFormattedMessage (OT_JAWS_MESSAGE, msgDevicePaneClosed_L, msgDevicePaneClosed_S)
EndIf
Else
SayFormattedMessage (OT_JAWS_MESSAGE, msgPaneNotFound_L, msgPaneNotFound_S)
EndIf
RestoreCursor ()
EndScript

Script ReadDevicePane ()
;added by kag
Var
Handle hwnd
If UserBufferIsActive () then
	UserBufferDeactivate ()
Pause ()
EndIf
Let hwnd = FindWindow (GetAppMainWindow (GetCurrentWindow ()), wcDevicePane, cscNull)
If hwnd Then
SaveCursor ()
InvisibleCursor ()
MoveToWindow (hwnd)
Pause () Pause ()
If GetWord () > cscNull
|| StringContains (GetWindowText (GetCurrentWindow (), False), scFree) Then
SayWindow (hwnd, READ_EVERYTHING)
Else
SayFormattedMessage (OT_ERROR, msgDevicePaneClosed_L, msgDevicePaneClosed_S)
EndIf
Else
SayFormattedMessage (OT_JAWS_MESSAGE, msgPaneNotFound_L, msgPaneNotFound_S)
EndIf
RestoreCursor ()
EndScript

Script ClickStorageCard () ;entire script rewritten for AM5
;added by kag
Var
Handle hwnd
If UserBufferIsActive () then
	UserBufferDeactivate ()
Pause ()
EndIf
If ManagerVersion < 500 Then
Let hwnd =  FindDescendantWindow (GetAppMainWindow (GetCurrentWindow ()), iDStorageCard)
If hwnd Then
SaveCursor ()
InvisibleCursor ()
MoveToWindow (hwnd)
Pause ()
If GetWord () > cscNull Then
RoutePCToInvisible ()
SayFormattedMessage (OT_JAWS_MESSAGE, msgStorageCard_L, msgStorageCard_S)
Else
SayFormattedMessage (OT_ERROR, msgNoStorageCard_L, msgNoStorageCard_S)
EndIf
EndIf
Else ;AudibleManager 5
SaveCursor ()
InvisibleCursor ()
If FindString (GetAppMainWindow (GetCurrentWindow ()), scStorageCard, S_BOTTOM, S_UNRESTRICTED) Then
RoutePCToInvisible ()
SayFormattedMessage (OT_JAWS_MESSAGE, msgStorageCard_L, msgStorageCard_S)
Else
SayFormattedMessage (OT_ERROR, msgNoStorageCard_L, msgNoStorageCard_S)
EndIf
EndIf
RestoreCursor ()
EndScript

Script ClickMainMemory () ;entire script rewritten for AM5
;added by kag
Var
Handle hwnd
If UserBufferIsActive () then
	UserBufferDeactivate ()
Pause ()
EndIf
If ManagerVersion < 500 Then
Let hwnd =  FindDescendantWindow (GetAppMainWindow (GetCurrentWindow ()), iDMainMemory)
If hwnd Then
SaveCursor ()
InvisibleCursor ()
MoveToWindow (hwnd)
Pause ()
If GetWord () > cscNull Then
RoutePCToInvisible ()
SayFormattedMessage (OT_JAWS_MESSAGE, msgMainMemory_L, msgMainMemory_S)
Else
SayFormattedMessage (OT_ERROR, msgNoMainMemory_L, msgNoMainMemory_S)
EndIf
EndIf
Else ;AudibleManager 5
SaveCursor ()
InvisibleCursor ()
If FindString (GetAppMainWindow (GetCurrentWindow ()), scMainMemory, S_BOTTOM, S_UNRESTRICTED) Then
RoutePCToInvisible ()
SayFormattedMessage (OT_JAWS_MESSAGE, msgMainMemory_L, msgMainMemory_S)
Else
SayFormattedMessage (OT_ERROR, msgNoMainMemory_L, msgNoMainMemory_S)
EndIf
EndIf
RestoreCursor ()
EndScript

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
;To speak the status of the Pause and Resume buttons during download, after toggling with SpaceBar, added by kag
Var
	Int ControlID
If KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	Let ControlID = GetControlID (GetFocus ())
	If ControlID == iDPauseResume Then
		If (GetWord () == scPause || GetWord () == scResume) Then
			SpeechOff ()
			Delay (3)
			SpeechOn ()
			SayWord ()
			Return true
		EndIf
	endIf
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey) ;default
EndFunction

Int Function GetManagerVersion ()
;Determines what version of Audible Manager is being used
var
	int nVersion,
Int nVersion2, ;added for AM5.X
String sVersion,
String sVersion2,
String sVersion3,
String sVersion1, ;added for am5
String sVersion4 ;added for AM5.X
Let sVersion =GetVersionInfoString (GetAppFilePath (), cmsg283_L)
Let sVersion = stringStripAllBlanks (sVersion)
Let sVersion1 = StringSegment (sVersion, ",", 1) ;added for am5
Let sVersion2 = StringSegment (sVersion, ",", 2)
Let sVersion3 = StringSegment (sVersion, ",", 3)
Let sVersion4 = StringSegment (sVersion, ",", 4) ;added for AM5.X
Let nVersion = 100*StringToInt (sVersion1) + 10*StringToInt (sVersion2) + StringToInt (sVersion3) ;modified for am5
Let nVersion2 = StringToInt (sVersion4)
If nVersion >= 500 && nVersion2 >0 Then ;Next 3 lines added for AM 5.005
Let nVersion = nVersion +nVersion2
EndIf
return nVersion
EndFunction

Void Function DescriptionChangedEvent (handle hwnd, int objId, int
childId, int nObjType, string sOldDescription, string
sNewDescription,int bFromFocusObject)
Var
	String sDescription
if(!bFromFocusObject) then
	return
EndIf
If ManagerVersion >499 Then ;Next 4 lines added for AM5
DescriptionChangedEvent (hwnd, objId, childId, nObjType, sOldDescription, sNewDescription,bFromFocusObject) ;default
Return
EndIf
Let sDescription = sNewDescription
;StringTrimCommon with third param set to 1 will trim common chars from start of sOldDescription and sNewDescription
if (stringTrimCommon(sOldDescription,sNewDescription,1)) then
	Say(sNewDescription,ot_screen_message)
endIf
If !StringContains (sDescription,scNotSelected) Then
	If StringContains (sDescription, scSelectedFormat1) Then
		SayMessage (OT_STATUS, msgFormat1_L, msgFormat1_S)
	ElIf StringContains (sDescription, scSelectedFormat2) Then
		SayMessage (OT_STATUS, msgFormat2_L, msgFormat2_S)
	ElIf StringContains (sDescription, scSelectedFormat3) Then
		SayMessage (OT_STATUS, msgFormat3_L, msgFormat3_S)
	ElIf StringContains (sDescription, scSelectedFormat4) Then
		SayMessage (OT_STATUS, msgFormat4_L, msgFormat4_S)
	EndIf
EndIf
EndFunction

Script FocusToDetailPane () ;entire script added for am5
If UserBufferIsActive () then
	UserBufferDeactivate ()
Pause ()
EndIf
If ManagerVersion <500 Then
SayCurrentScriptKeyLabel ()
Return
EndIf
SayMessage (OT_JAWS_MESSAGE, msgDetailView)
If GetControlID (GetCurrentWindow ()) == iDList Then
FindDetailPane ()
Else
SetFocus (GlobalDetailHandle)
EndIf
Delay (2)
JAWSTopOfFile ()
JAWSTopOfFile () ;Necessary to start reading at top reliably
SayAll ()
EndScript

Void Function FindDetailPane () ;Entire function added for AM5
SpeechOff ()
HomeRowToggle ()
UtilityMoveToParent ()
UtilityMoveToNextWindow ()
UtilityMoveToNextWindow ()
UtilityMoveToChild ()
UtilityMoveToChild ()
InvisibleCursor ()
UtilityRouteJAWSCursorToPC ()
HomeRowToggle ()
RoutePCToInvisible ()
PCCursor ()
SpeechOn ()
EndFunction

void function AnnounceListStateChange()
var
	handle hNull
let giScheduledDelayedAnnounceObjStateChange = 0
let hObjStateObj = hNull
Say(GetCurrentListViewItemName(),ot_line)
EndFunction

void function ObjStateChangedEvent(handle hObj, int iObjType, int nChangedState, int nState, int nOldState)
if iObjType == wt_ListBoxItem then
	if GetControlID(hObj) == iDList then
		if !nSelectingText
		&& (!nState || nChangedState == CTRL_SELECTED) then
			;ObjStateChangedEvent may fire when navigating before ActiveItemChanged,
			;causing double speaking when navigating the list.
			;we delay speaking, so that we can determine if ActiveItemChangedEvent will fire and speak.
			let hObjStateObj = hObj
			let giScheduledDelayedAnnounceObjStateChange = ScheduleFunction("AnnounceListStateChange",3)
			return
		EndIf
	EndIf
EndIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
var
	handle hNull
if giScheduledDelayedAnnounceObjStateChange then
	if curHwnd == hObjStateObj then
		UnscheduleFunction(giScheduledDelayedAnnounceObjStateChange)
		let giScheduledDelayedAnnounceObjStateChange = 0
		let hObjStateObj = hNull
	EndIf
EndIf
ActiveItemChangedEvent(curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

Script SayNextLine ()
;added so portable device ListView will speak in AM4 and Windows 98SE
If ManagerVersion < 500 && GetCurrentControlID () == idOtisList Then
NextLine ()
Pause ()
SayLine ()
Return
EndIf
PerformScript SayNextLine() ;default
EndScript

Script SayPriorLine ()
;added so portable device ListView will speak in AM4 and Windows 98SE
If ManagerVersion < 500 && GetCurrentControlID () == idOtisList Then
PriorLine ()
Pause ()
SayLine ()
Return
EndIf
PerformScript SayPriorLine() ;default
EndScript

Void Function SelectingText(int nMode)
; handles setting up for and finishing the process of selecting text
; called by each of the scripts which does text selection
var
	string strHighlightAfterSelect,
	string strUnselected,
	string strNewlySelected,
	int nChanged,
	int nStart,
	int nChars,
	int nLen,
	int OT,
	int nLeft,
	int nTop,
	int nRight,
	int nBottom
If GetControlID (GetFocus ()) == iDList Then ;next 3 lines added by kag
Delay (1)
EndIf
if UsingEnhancedEditSupport(GetFocus()) then
	if (nMode) then
		let nLastSelectUnitTime=GetTickCount()
	endIf
	return ; handled by internal code which calls TextSelectedEvent
endIf
;OT should be Word unless selecting by char so that each unit selected doesn't have its case indicated unless the
;user has requested the indication for Words
let OT=OT_WORD
if nMode then
	let g_strHighlightBeforeSelect = GetSelectedText()
	let nSelectingText = nMode
else
	delay(1)
	ProcessNewText()
	let nSelectingText = 0
	if IsVirtualPCCursor()
	&& IsJavaWindow (GetFocus ()) == FALSE then
		return
	endIf
	let strHighlightAfterSelect = GetSelectedText()
	let	strUnselected = StringDiff(g_strHighlightBeforeSelect,strHighlightAfterSelect)
	if strUnselected then
		; if there's highlighted text prior to the selection command that
		; doesn't exist after the command, this is either because the command
		; deselected the text or the text scrolled off of the screen.
		; We assume that if the text was at the beginning of the old buffer
		; and it isn't in the new buffer, then it scrolled off.
		; This should be true except when selecting text from bottom to top,
		; and deselecting from top to bottom,
		;something that most people probably don't do
		if ! StringsOverlap(g_strHighlightBeforeSelect,strHighlightAfterSelect,nStart,nChars)
		|| nStart<2 then
			if stringLength(strUnSelected)==1 then
			;use OT_CHAR for single characters so case is indicated
				let OT=OT_CHAR
			endIf
			If nSaySelectAfter then
If GetControlID (GetFocus ()) == iDList Then ;added by kag to default version
Say (sBeforeUnselecting, OT_NO_Disable, False) ;added by kag to default version
Else
				SayMessage(OT,strUnSelected)
EndIf ;added by kag to default version
				SayMessage(OT_SELECT, cmsg214_L)
			Else
				SayMessage(OT_SELECT, cmsg214_L)
				SayMessage(OT, strUnSelected)
			EndIf
			let nChanged = nChanged+1
		endIf
	endIf
	let strNewlySelected = StringDiff(strHighlightAfterSelect,g_strHighlightBeforeSelect)
	if (strNewlySelected) then
		if stringLength(strNewlySelected)==1
			|| (stringLength(strNewlySelected)<=3 && stringContains(strNewlySelected,"\r")) then
			;use OT_CHAR for single characters so case is indicated
			let OT=OT_CHAR
		endIf
		If nSaySelectAfter then
If GetControlID (GetFocus ()) == iDList Then ;added by kag to default version
PerformScript SayLine() ;added by kag to default version
Else ;added by kag to default version
			SayMessage (OT, strNewlySelected)
EndIf ;added by kag to default version
			SayMessage (OT_SELECT, cmsg215_L)
		Else
			SayMessage (OT_SELECT, cmsg215_L)
			SayMessage (OT, strNewlySelected)
		EndIf
		let nChanged = nChanged+1
	endIf
	if (!nChanged) then
		;screen probably scrolled
		let nLen=stringLength(strHighlightAfterSelect)
		if (StringsOverlap(g_strHighlightBeforeSelect,strHighlightAfterSelect,nStart,nChars))then
			let strNewlySelected =  stringRight(strHighlightAfterSelect,nLen-nChars)
			let nLen=stringLength(strNewlySelected)
			; Fixes track defect 20059 and related entries
			; string contained a newline char causing the word blank or a newline to be
			;indicated prior to speaking the newly selected text
			if stringLeft(strNewlySelected,1)==cScBufferNewLine && nLen > 1 && substring(strNewlySelected,2,1) !=cScBufferNewLine then
				let strNewlySelected=stringChopLeft(strNewlySelected,1)
				let nLen=nLen-1;
			endIf
			if nLen==1 then
				;use OT_CHAR for single characters so case is indicated
				let OT=OT_CHAR
			endIf
			If nSaySelectAfter then
				SayMessage (OT, strNewlySelected)
				SayMessage (OT_SELECT, cmsg215_L)
			Else
				SayMessage (OT_SELECT, cmsg215_L)
				SayMessage (OT, strNewlySelected)
			EndIf
		else
		; strings didn't overlap, just speak the current line as being selected
			if GetItemRect (GetCursorCol(), GetCursorRow(), nLeft, nRight, nTop, nBottom, it_Line) then
				let strNewlySelected=GetTextInRect (nLeft, nTop, nRight, nBottom, attrib_Highlight, ignoreColor, ignoreColor, FALSE, FALSE)
			else
				let strNewlySelected=getLine()
			endIf
			let OT=OT_WORD
			if stringLength(strNewlySelected)==1 then
				let OT=OT_CHAR
			endIf
			If nSaySelectAfter then
;xyz
If GetControlID (GetFocus ()) == iDList Then ;added by kag to default version
PerformScript SayLine() ;added by kag to default version
Else ;added by kag to default version
				SayMessage (OT, strNewlySelected)
EndIf ;added by kag to default version
				SayMessage (OT_SELECT, cmsg215_L)
			Else
				SayMessage (OT_SELECT, cmsg215_L)
				SayMessage (OT, strNewlySelected)
			EndIf
		endIf
	endIf
endIf
EndFunction

Script SelectNextLine()
Let sBeforeUnselecting = GetObjectName (True, 0) ;added by kag
PerformScript SelectNextLine()
EndScript

Script SelectPriorLine()
Let sBeforeUnselecting = GetObjectName (True, 0)
PerformScript SelectPriorLine()
EndScript

Script GoToMyLibrary ()
Var
Handle hMyLibrary
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayMessage (OT_JAWS_MESSAGE, msgMyLibrary, msgMyLibrary)
Let hMyLibrary = FindDescendantWindow (GetAppMainWindow (GetFocus ()), 32817)
If hMyLibrary Then
SaveCursor ()
InvisibleCursor ()
MoveToWindow (hMyLibrary)
RoutePCToInvisible ()
Else
SayMessage (OT_JAWS_MESSAGE, msgMyLibraryNotFound_L, msgMyLibraryNotFound_S)
EndIf
RestoreCursor ()
EndScript

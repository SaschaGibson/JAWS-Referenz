;  Copyright 1995-2020 Freedom Scientific, Inc.
;JAWS script file for Winamp

include "hjconst.jsh"
include "hjglobal.jsh"
Include "hjhelp.jsh"
Include "common.jsm"
include "winamp.jsh"
include "winamp.jsm"
Include "winampjs.jsh" ; JFW Version Specific constants and code
Use "WinampAPI.jsb"

Globals
	int igWmpMajorVersion,
	int igWmpMinorVersion,
	int igWmpUpdateVersion,
	int igWmpBuildVersion,
	Int GlobalKeyboardOption,
	int gbShouldSpeakTrackTitle,
	handle ghLibraryLV,
	int giSetIEServerFocus,
	int giLibraryLVCreated,
	int giIEServerCreated,
	int giWinampSuppressHighlight,
	int giSpeechDisabledByWinampScripts

Script  ScriptFileName ()
ScriptAndAppNames(MsgWinamp)
EndScript

HANDLE Function GetWinampMainWindowHandle ()
Var
  String sClass,
  Handle hWnd,
  Int i
Let hWnd = GetTopLevelWindow(GetFocus())
Let sClass = GetWindowClass(hWnd)
Let i = 0
While (sClass != WinampMW
&& i<=LoopTrap)
  Let hWnd = GetNextWindow(hWnd)
  Let sClass = GetWindowClass(hWnd)
  Let i = i + 1
EndWhile
If (sClass == WinampMW) Then ; Was the Winamp main window located?
  Return hWnd
EndIf
Return 0
EndFunction

void function GetWinAmpVersionInfo()
GetFixedProductVersion(GetAppFilePath(),
	igWmpMajorVersion, igWmpMinorVersion, igWmpUpdateVersion, igWmpBuildVersion)
EndFunction

Void Function AutoStartEvent ()
If !WinampAppWindowHandle
|| WinampAppWindowHandle != GetWinampMainWindowHandle() Then
	Let WinampAppWindowHandle = GetWinampMainWindowHandle()
EndIf
If (GetVerbosity() ==BEGINNER) Then
	Delay(1)
	PerformScript CloseMiniBrowser()
EndIf
Let WinampCurrentItem = 0
Let WinampStopItem = 0
Let WinampStoppingPointSchedule = 0
let gbShouldSpeakTrackTitle = false
Let WinampMagneticTracking = 1
unsuppressHighlight()
If !WinampHighlightColour
|| !WinampAlternativeHighlightColour Then
	SetDefaultHighlightColour()
EndIf
If !WinampReviewTime then
	Let WinampReviewTime = ReviewIncrement
EndIf
GetWinAmpVersionInfo()
EndFunction

String Function GetWinampTitle ()
Var
  Handle hWnd
Let hWnd = GetWinampMainWindowHandle()
If hWnd Then
  Return GetWindowName(hWnd)
EndIf
Return WinampWinamp
EndFunction

Void Function SetDefaultHighlightColour ()
If (GetJFWVersion() >= cJFWVer40) Then
	Let WinampHighlightColour = WinampDefaultHighlightColourForJFW4
	Let WinampAlternativeHighlightColour = WinampDefaultHighlightColour
Else
	Let WinampHighlightColour = WinampDefaultHighlightColour
	Let WinampAlternativeHighlightColour = WinampDefaultHighlightColourForJFW4
EndIf
EndFunction

Void Function AutoFinishEvent ()
If WinampStopItem then
	UnscheduleFunction(WinampStoppingPointSchedule)
	Let WinampStoppingPointSchedule = 0
	Let WinampStopItem = 0
EndIf
EndFunction

int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if hwndFocus == hwndPrevFocus
&& !nChangeDepth
&& !GetObjectSubTypeCode ()
	return true
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
endFunction

HANDLE Function GetWinampWindowHandle (string sWinName)
Var
  String sClass,
	Handle hWnd,
	Int i,
	string sName
Let hWnd = GetWinampMainWindowHandle()
;Let sClass = GetWindowClass(hWnd)
let sName = GetWindowName (hWnd)
Let i = 0
;While sClass != sWindow
While (sName != sWinName
&& i<=LoopTrap)
  Let hWnd = GetPriorWindow(hWnd)
  ;Let sClass = GetWindowClass(hWnd)
  let sName = GetWindowName (hWnd)
  Let i = i + 1
EndWhile
;If sClass == sWindow
If sName == sWinName Then
  Return hWnd
EndIf
Return FALSE
EndFunction

String Function GetWindowStatuses ()
Var
  String sList,
  string sWinName,
  int iObscured
Let sList = cscNull
let iObscured =  IsWindowObscured(GetWinampMainWindowHandle())
If (!iObscured)
|| (iObscured
&& IsWindowVisible(GetWinampWindowHandle(wn_StationInfo )) ) Then
  Let sList = cscW
  EndIf
 If IsWindowVisible(GetWinampWindowHandle(wn_Equalizer)) Then
  Let sList = sList + cscQ
EndIf
If IsWindowVisible(GetWinampWindowHandle(wn_PlaylistEditor)) Then
  Let sList = sList + cscP
EndIf
If IsWindowVisible(GetWinampWindowHandle(wn_Library))  Then
  Let sList = sList + cscL
  EndIf
If IsWindowVisible(GetWinampWindowHandle(wn_Video)) Then
  Let sList = sList + cscV
EndIf
; for the new station info window
If IsWindowVisible(GetWinampWindowHandle(wn_StationInfo )) Then
  Let sList = sList + cscS
EndIf
Return sList
EndFunction

String Function GetWinampWindowNameFromCharacter (string sChar, string sUnknown)
If StringLength(sChar) == 0
|| StringLength(sChar) > 1 Then
  Return cscNull
EndIf
If sChar == cscW Then
  Return MsgMainWindow
ElIf sChar == cscP Then
  Return MsgPlaylistEditor
ElIf sChar == cscQ Then
  Return MsgEqualiser
Elif sChar == cscB Then
  Return MsgMinibrowser
Elif sChar == cscL Then
  Return MsgLibrary
 ElIf sChar == cscS Then
 return MsgStationInfo
Elif sChar == cscV Then
  Return MsgVideo
ElIf sChar == cscU Then
  Return sUnknown
EndIf
Return cscNull
EndFunction

String Function GetCharacterFromWindowClass (string sClass)
Var
	handle hWnd,
	string sWinName
let hWnd = GetFocus ()
let sWinName = GetWindowName (hWnd)
If sClass == WinampMW Then; main window
	Return cscw
ElIf sClass == WinampEQ then; equalizer
	Return cscQ
ElIf sClass == WinampPE then; play list editor
	Return cscP
ElIf sClass == WinampMB then
	Return cscB
;ElIf sClass == WinampLI then
ElIf sClass == WinAmpGen  Then
	If sWinName == wn_Library Then
		Return cscL
	ElIf sWinName == wn_StationInfo Then
		return cscS
	EndIf
ElIf sClass == WinampVI then; video
	Return cscV
Else
	Return cscU
EndIf
EndFunction

Script SayWindowStatuses ()
Var
	String sOpenWindows,
	String sWhere,
	String sUnknownName,
	Int i,
	String sStatus
Let sOpenWindows = GetWindowStatuses()
If DialogActive() Then
	Let sOpenWindows = cscU + sOpenWindows
	Let sUnknownName = GetWindowName(GetRealWindow(GetFocus()))
	Let sWhere = WinampIU
ElIf MenusActive() Then
	Let sOpenWindows = cscU + sOpenWindows
	Let sUnknownName = WinampWinampMenus
	Let sWhere = WinampIU
Else
	Let sUnknownName = cscNull
	Let sWhere = GetWindowClass(GetTopLevelwindow(GetFocus()))
EndIf
If sWhere == WinampMW
&& IsWindowObscured(GetFocus()) Then
	Let sOpenWindows = cscU + sOpenWindows
	Let sUnknownName = MsgMainWindow + cscSpace + WinampWhichIsObscured
	Let sWhere = WinampIU
EndIf
Let sWhere = GetCharacterFromWindowClass(sWhere)
; Cycle the list of characters so that the user's current window is at the front.
Let i = StringContains(sOpenWindows, sWhere) ; get the position of the current window in the list
Let sOpenWindows = StringRight(sOpenWindows, StringLength(sOpenWindows)-i+1) + StringLeft(sOpenWindows, i-1)
If StringLength(sOpenWindows) == 0 Then
  SayMessage (OT_ERROR, MsgWinampNoWindowsOpen_L )
  Return
EndIf
Say(WinampYouAreInThe + cscSpace + GetWinampWindowNameFromCharacter(SubString(sOpenWindows, 1, 1), sUnknownName), OT_USER_REQUESTED_INFORMATION)
If (StringLength(sOpenWindows) > 1) Then
  Let sStatus = cscNull
  Let i = 2
  While (i <= StringLength(sOpenWindows))
    If (i>2 && i<StringLength(sOpenWindows)) Then
      Let sStatus = sStatus + cscComma + cscSpace
    EndIf
    If i>2
    && i == StringLength(sOpenWindows) Then
      Let sStatus = sStatus + cscSpace + WinampAnd + cscSpace
    EndIf
    Let sStatus = sStatus + WinampThe + cscSpace + GetWinampWindowNameFromCharacter(SubString(sOpenWindows, i, 1), cscNull)
    Let i = i + 1
  EndWhile
  Let sStatus = sStatus + cscSpace
  If StringLength(sOpenWindows) > 2 Then
    Let sStatus = sStatus + WinampAre
  Else
    Let sStatus = sStatus + WinampIs
  endIf
  Let sStatus = sStatus + cscSpace + WinampAlsoOpen
Else
  Let sStatus = WinampNoOtherWindows
EndIf
Say(sStatus, OT_USER_REQUESTED_INFORMATION)
EndScript

Script HotKeyHelp ()
Var
	String TheClass
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive() Then
	UserBufferDeactivate()
EndIf
Let TheClass = GetWindowClass (GetFocus ())
If TheClass == WinampEQ Then
SayFormattedMessage (OT_USER_BUFFER, MsgHotKeyHelpEqualizerIntro_l)
UserBufferAddText (cScBufferNewLine )
UserBufferAddText (MsgEqualizerIncreaseBandsLink, FuncIncreaseBands , MsgEqualizerIncreaseBandsFunc)
UserBufferAddText (MsgEqualizerDecreaseBandsLink, FuncDecreaseBands , MsgEqualizerDecreaseBandsFunc)
UserBufferAddText (MsgEqualizerIncreasePreAmpLink, FuncIncreasePreAmp, MsgEqualizerIncreasePreAmpFunc)
UserBufferAddText (MsgEqualizerDecreasePreAmpLink, FuncDecreasePreAmp, MsgEqualizerDecreasePreAmpFunc)
UserBufferAddText (cScBufferNewLine, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
return
Else
	SayFormattedMessage (OT_USER_BUFFER, MsgHotKeyHelpWinAmpMainWindow_L)
	UserBufferAddText (cScBufferNewLine, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
return
	EndIf
	PerformScript HotKeyHelp ()
	EndScript

Void Function ScreenSensitiveHelpForWinAmpWindows ()
Var
	Handle hWnd,
	String TheClass,
	String sWinName,
	int iSubType
Let hWnd = GetCurrentWindow()
Let TheClass = GetWindowClass(hWnd)
let iSubType = GetWindowSubTypeCode (hWnd)
If !iSubType Then
	let iSubType = GetObjectSubTypeCode (TRUE)
EndIf
If theClass == WinampMW  Then
	SayFormattedMessage (OT_UsER_BUFFER, MsgScreenSensitiveHelpWinAmpMainWindow_L)
	AddHotKeyLinks ()
	return
ElIf TheClass == WinampEQ  Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpEqualizer_L)
	AddHotKeyLinks ()
	return
ElIf  TheClass == WinAmpGen Then
	let sWinName = GetWindowName (hWnd)
	If sWinName == wn_Library Then
		SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpLibrary_L)
	ElIf sWinName ==  wn_StationInfo Then
		SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpStationInfo_L)
	EndIf
	AddHotKeyLinks ()
	return
ElIf TheClass ==  WinampPE  Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpPlayListEditor_L)
	AddHotKeyLinks ()
	return
ElIf TheClass == WinampVi  Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpVideoWindow_L)
	AddHotKeyLinks ()
	Return
Else
	ScreenSensitiveHelpForKnownClasses (iSubType)
EndIf
EndFunction

Script ScreenSensitiveHelp ()
If IsSameScript() Then
	OpenUserManual()
	Return
EndIf
If UserBufferIsActive() Then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
If IsCoreWinampWindow  () Then
	ScreenSensitiveHelpForWinAmpWindows  ()
	return
EndIf
PerformScript ScreenSensitiveHelp ()
EndScript

Void Function OpenUserManual ()
If GetJFWVersion() >= cJFWVer45 then
	AppFileTopic(topic_Winamp)
Else
	Run( FindJAWSSettingsFile(UserManualFileName) )
EndIf
EndFunction

Script WindowKeysHelp ()
Var
	string sClass
If UserBufferIsActive () Then
	UserBufferDeactivate ()
EndIf
let sClass = GetWindowClass  (GlobalFocusWindow)
If sClass == WinampPE  Then
	SayFormattedMessage (OT_USER_BUFFER, MsgWindowsHelpPlayListEditor)
	Else
	SayFormattedMessage (OT_USER_BUFFER, MsgWindowsHelp1_l)
EndIf
UserBufferAddText (cScBufferNewLine, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndScript

Int Function IsWinampMiniBrowser ()
If (StringContains(GetWindowClass(GetFocus()), WinampMB)
	&& !MenusActive ()
	&& !DialogActive()
	&& !UserBufferIsActive()) Then
	Return TRUE
EndIf
Return FALSE
EndFunction

Int Function IsWinampEqualiser ()
If (StringContains(GetWindowClass(GetFocus()), WinampEQ)
	&& !MenusActive ()
	&& !DialogActive()
	&& !UserBufferIsActive()) Then
	Return TRUE
EndIf
Return FALSE
EndFunction

Int Function IsMainWinampWindow ()
var
	handle focusWindow,
	handle topWindow,
	handle firstChildWindow,
	string windowClass
If (MenusActive() || DialogActive())
Then
	return FALSE
EndIf
let focusWindow = GetFocus()
If StringContains(GetWindowClass(focusWindow), WinampMW)
Then
	Return TRUE
EndIf
If (
	igWmpMajorVersion > 5
	|| (5 == igWmpMajorVersion && igWmpMinorVersion >= 6)
	)
Then
	let topWindow = GetTopLevelWindow(focusWindow)
	let windowClass = GetWindowClass(topWindow)
	If (BaseWindowRoot == windowClass)
	Then
		let firstChildWindow = GetFirstChild(topWindow)
		let windowClass = GetWindowClass(firstChildWindow)
		If (BaseWindowRoot == windowClass)
		Then
			let firstChildWindow = GetFirstChild(firstChildWindow)
			let windowClass = GetWindowClass(firstChildWindow)
			If (WinAmpGen == windowClass)
			Then
				return TRUE
			EndIf
		EndIf
	EndIf
EndIf
Return FALSE
EndFunction

Int Function IsPlaylistEditorWindow ()
If StringContains (GetWindowClass (GetFocus()), WinampPE)
    && !MenusActive ()
    && !DialogActive() Then
	Return TRUE
EndIf
Return FALSE
EndFunction

Int Function IsWinampLibrary ()
If (StringContains(GetWindowClass(GetTopLevelWindow(GetFocus())), WinAmpGen)
&& StringContains(GetWindowName (GetTopLevelWindow(GetFocus())), wn_Library) )
    && !MenusActive ()
    && !UserBufferIsActive() Then
	Return TRUE
EndIf
Return FALSE
EndFunction

  Int Function IsWinAmpStationInfo ()
If (StringContains(GetWindowClass(GetTopLevelWindow(GetFocus())), WinAmpGen)
&& StringContains(GetWindowName (GetTopLevelWindow(GetFocus())), wn_StationInfo) )
    && !MenusActive ()
    && !UserBufferIsActive() Then
	Return TRUE
EndIf
Return FALSE
EndFunction

Int Function IsWinAmpVideo ()
If StringContains(GetWindowClass(GetTopLevelWindow(GetFocus())), WinAmpVi)
    && !MenusActive ()
    && !UserBufferIsActive() Then
	Return TRUE
EndIf
Return FALSE
EndFunction

Int Function IsCoreWinampWindow ()
Return IsMainWinampWindow() || IsWinampEqualiser() || IsPlaylistEditorWindow() || IsWinampLibrary  () || IsWinAmpStationInfo  () || IsWinAmpVideo  ()
EndFunction

Int Function IsStandardWinampWindow ()
Return IsMainWinampWindow() || IsWinampEqualiser() || IsPlaylistEditorWindow() || IsWinampLibrary() || IsWinAmpVideo  () || IsWinAmpStationInfo  () ;|| IsWinampMiniBrowser()
EndFunction

Int Function PlayHighlightPresent ()
FindColors (WinampPlayHighlightColour, IgnoreColor, S_TOP)
if GetColorText() == WinampPlayHighlightColour then
	return  TRUE
EndIf
return  FALSE
EndFunction

Int Function IntegerIndex (String InString)
Var
	Int i
Let i = StringContains (InString, cscPeriod)
If i>1
&& i<9 Then
	Return StringToInt (StringLeft (InString, i-1))
Else
	Return 0
EndIf
EndFunction

Int Function WhichWayToSearch ()
If CurrentTrackNumber() > IntegerIndex (GetLine()) Then
	Return 1 ; search down
Else
	Return -1 ; search up
EndIf
EndFunction

Void Function FindPlayingItem (Int speak)
Var
	Int i
If !IsPlaylistEditorWindow() Then
	Return
EndIf
SaveCursor()
Let i=0
While (i < PlaylistSearchRange)
	If !PlayHighlightPresent() Then
		MoveToWindow(GetWinampWindowHandle(wn_PlayListEditor))
		; The playing item is not on this screen.
		If WhichWayToSearch () > 0 Then
			TypeKey (cksPageDown)
		Else
			TypeKey (cksPageUp)
		EndIf
		Pause()
		Let i=i+1
	Else ; the playing item is on this page
		Let i = PlaylistSearchRange
	EndIf
EndWhile
If speak Then
	SayMessage (OT_SELECTED_ITEM, GetLine())
EndIf
LeftMouseButton ()
If BrailleInUse () Then
  RouteBrailleToJAWS ()
EndIf
Let WinampMagneticTracking = 1
RestoreCursor()
EndFunction

String Function FindHighlightedItem (int speak)
Var
	String sItemText,
	Int nBGColour
SaveCursor()
If !FindColors (IgnoreColor, WinampHighlightColour, S_TOP) Then
	If !FindColors (IgnoreColor, WinampAlternativeHighlightColour, S_TOP) Then
		Let nBGColour = WinampMaxHighlightColour ; Start with blue
		While nBGColour >= WinampMinHighlightColour
		&& !FindColors (IgnoreColor, nBGColour * RGBBlueFieldOffset, S_TOP)
			Let nBGColour = nBGColour - 1
		EndWhile
		If nBGColour >= WinampMinHighlightColour Then ; Was an alternative highlight colour found?
			Let WinampHighlightColour = nBGColour * RGBBlueFieldOffset
; Set alternative highlight colour
			If WinampHighlightColour == WinampDefaultHighlightColour Then
				Let WinampAlternativeHighlightColour = WinampDefaultHighlightColourForJFW4
			Else
					Let WinampAlternativeHighlightColour = WinampDefaultHighlightColourForJFW4
			EndIf
		Else
			SetDefaultHighlightColour() ; Set the current highlight colour to the default value
		EndIf
	Else ; alternative colour found, swap current and alternative highlight colours
		Let nBGColour = WinampHighlightColour
		Let WinampHighlightColour = WinampAlternativeHighlightColour
		Let WinampAlternativeHighlightColour = nBGColour
	EndIf
EndIf
Let sItemText = GetLine()
If GetColorText() == WinampPlayHighlightColour Then
		Let WinampMagneticTracking = 1
	EndIf
	RestoreCursor ()
If speak Then
	SayMessage (OT_HIGHLIGHTED_SCREEN_TEXT, sItemText)
	If WinampMagneticTracking  == 1 Then
		SayUsingVoice (VCTX_MESSAGE , MsgCurrentTrack, OT_ITEM_STATE)
	EndIf
	If WinampStopItem>0 && IntegerIndex(sItemText)==WinampStopItem Then
		SayUsingVoice (VCTX_MESSAGE , MsgStopMarker, OT_ITEM_STATE)
EndIf
EndIf
If BrailleInUse ()
&& speak>=0 Then
  RouteBrailleToJAWS ()
EndIf
Return sItemText
EndFunction

Script SayPriorLine ()
If UserBufferIsActive () Then
	PerformScript SayPriorLine ()
	return
EndIf
If IsPCCursor() Then
	If IsMainWinampWindow()
	|| IsWinampEqualiser() Then
		TypeKey (cksUpArrow)
		If IsNotPlaying()  Then
			SayMessage(OT_JAWS_message, WinampVolumeUp_l, msgSilent)
		EndIf
		Return
	EndIf
	If IsPlaylistEditorWindow() then
		suppressHighlight()
		TypeKey (cksUpArrow)
		Pause()
		Let WinampMagneticTracking = 0
		FindHighlightedItem (TRUE)
		Return
	EndIf
EndIf
PerformScript SayPriorLine()
EndScript

Script SayNextLine ()
If UserBufferIsActive () Then
	PerformScript  SayNextLine ()
	return
EndIf
If IsPCCursor() Then
	If IsMainWinampWindow()
	|| IsWinampEqualiser() Then
		TypeKey (cksDownArrow)
		If IsNotPlaying()  Then
			SayMessage(OT_JAWS_message, WinampVolumeDown_l, msgSilent)
		EndIf
		Return
	EndIf
	If IsPlaylistEditorWindow() then
		suppressHighlight()
		TypeKey (cksDownArrow)
		Pause()
		Let WinampMagneticTracking = 0
		FindHighlightedItem (TRUE)
		Return
	EndIf
EndIf
PerformScript SayNextLine()
EndScript

Script SayLine ()
If IsPlaylistEditorWindow ()
&& IsPCCursor() Then
	FindHighlightedItem(1)
Else
	PerformScript SayLine ()
EndIf
EndScript

Script MoveToPlayingItem ()
FindPlayingItem (1)
EndScript

Script SwapWithPrior ()
If !IsPlaylistEditorWindow()
&& !IsPCCursor() Then
	PerformScript CloseListBox()
	Return
EndIf
JAWSCursor()
If IntegerIndex(GetLine()) > 1 Then
;Make sure the item is on the screen
	TypeKey (cksUpArrow)
	TypeKey (cksDownArrow)
	Pause ()
	PCCursor()
	FindHighlightedItem (-1)
	JAWSCursor()
	LeftMouseButtonLock ()
	PriorLine()
	LeftMouseButtonLock ()
	PCCursor()
	FindHighlightedItem (TRUE)
Else
	SayMessage(OT_JAWS_MESSAGE, WinampTopOfPlayList, WinampTop)
EndIf
EndScript

Script SwapWithNext ()
Var
	Int i,
	Int j
If !IsPlaylistEditorWindow()
&& !IsPCCursor() Then
	PerformScript OpenListBox()
	Return
EndIf
JAWSCursor()
Let i = IntegerIndex(GetLine())
; Make sure the item is on the screen
TypeKey (cksDownArrow)
Pause()
PCCursor()
FindHighlightedItem (FALSE)
JAWSCursor()
Let j = IntegerIndex(GetLine())
If (i < j) Then
; Not on the last item
	LeftMouseButtonLock ()
	PriorLine()
	LeftMouseButtonLock ()
	PCCursor()
	PerformScript SayNextLine()
Else
	SayMessage(OT_JAWS_MESSAGE, WinampBottomOfPlaylist, WinampBottom)
	PCCursor ()
EndIf
EndScript



Void Function CheckStoppingPoint ()
If !WinampStopItem Then
	Return
EndIf
Delay(1)
If !IsNotPlaying()
&& WinampStopItem == CurrentTrackNumber() then
	Let WinampStopItem = 0		;disable
;	PlaySound(FindJAWSSoundFile("buzzer1.wav"))
	SayMessage(OT_ITEM_STATE, msgStopMarkerReached_l, msgStopMarkerReached_s)
	If !IsCoreWinampWindow() Then
			SayMessage (OT_ERROR, WinampStoppingPointNotInCoreWindow_l, WinampStoppingPointNotInCoreWindow_s)
		Else
		Let WinampStopped = 1 ; Set StopAfterCurrentItem
		TypeKey (cksPaste ); Ctrl+V
		CheckStopAfterCurrentTrack()
	EndIf
Else
	Let WinampStoppingPointSchedule = ScheduleFunction(fn_CheckStoppingPoint, 10)
endIf
EndFunction

Void Function TurnOffShuffleMode ()
If (MenusActive()
|| DialogActive() )
|| (!IsMainWinampWindow()
&& !IsPlaylistEditorWindow()) Then
  Return
EndIf
If WinampGetShuffleMode()==1 Then
  	TypeKey (ksToggleShuffleMode) ; Turn off shuffle mode
		SayMessage (OT_STATUS, MsgShuffleModeOff_L, MsgOff)
  EndIf
EndFunction

Script SetStopMarker ()
If !IsPlaylistEditorWindow() Then
  SayMessage (OT_ERROR, WinampNotInPlaylist)
  Return
EndIf
JAWSCursor()
Let WinampStopItem = IntegerIndex(GetLine())
PCCursor()
If !WinampStopItem Then
	Say(WinampNoTrackSelected, ot_error)
	Return
EndIf
If WinampStoppingPointSchedule Then
	UnscheduleFunction(WinampStoppingPointSchedule)
	Let WinampStoppingPointSchedule = 0
EndIf
If WinampStopped Then ; deactivate stop-after-current-track
	TypeKey (cksPaste); Ctrl+V
	Let WinampStopped = 0
EndIf
PerformScript SayStopMarker()
TurnOffShuffleMode()
CheckStoppingPoint()
EndScript

Script ClearStopMarker ()
Let WinampStopItem = 0
SayMessage(OT_JAWS_MESSAGE, MsgStopMarkerCleared_L, MsgStopMarkerCleared_S)
EndScript

Script SayStopMarker ()
if WinampStopItem > 0 then
	SayMessage(OT_JAWS_MESSAGE, FormatString (MsgStopMarkerSet_L, IntToString(WinampStopItem)))
	Else
	SayMessage(ot_error, MsgNoStopMarkerSet_L, MsgNoStopMarkerSet_S)
EndIf
EndScript

Script continue ()
TypeKey (ksNextTrack)
Pause()
TypeKey (ksPlayTrack)
If IsCoreWinampWindow() Then
	Let WinampStopped = 0
EndIf
CheckStoppingPoint()
EndScript

Script StartThisTrack ()
TypeKey (cksEnter)
If IsPlaylistEditorWindow() Then
	Pause()
	Let WinampStopped = 0
	Let WinampMagneticTracking = 1
	CheckStoppingPoint()
EndIf
EndScript

Script AltStartThisTrack ()
If ((IsMainWinampWindow()
|| IsWinampEqualiser())
&& !MenusActive()
&& !DialogActive() ) Then
	TypeKey (ksPauseTrack)
	Return
EndIf
PerformScript StartThisTrack()
EndScript

Void Function DecreaseEQBAnds ()
Var
	String eqbanddecrease,
	Int index
Let eqbanddecrease = EqDecrease1+cscVert+EqDecrease2+cscVert+EqDecrease3+cscVert+EqDecrease4+cscVert+EqDecrease5+cscVert+EqDecrease6+cscVert+EqDecrease7+cscVert+EqDecrease8+cscVert+EqDecrease9+cscVert+EqDecrease10
Let index=DlgSelectItemInList (eqbanddecrease, HelpSelectBand, false)
SayEqualiserBand(index, -1)
EndFunction

Void Function IncreaseEQBAnds ()
Var
	String eqbandincrease,
	Int index
Let eqbandincrease = EqIncrease1+cscVert+EqIncrease2+cscVert+EqIncrease3+cscVert+EqIncrease4+cscVert+EqIncrease5+cscVert+EqIncrease6+cscVert+EqIncrease7+cscVert+EqIncrease8+cscVert+EqIncrease9+cscVert+EqIncrease10
Let index=DlgSelectItemInList (eqbandincrease, HelpSelectBand, false)
SayEqualiserBand(index, 1)
EndFunction

Script RepeatStatusInfo ()
If WinampGetShuffleMode()==1 Then
  SayMessage (OT_USER_REQUESTED_INFORMATION, MsgShuffleModeOn_L, MsgOn)
ElIf WinampGetShuffleMode()==0 Then
  SayMessage (OT_USER_REQUESTED_INFORMATION, MsgShuffleModeOff_L, MsgOff)
EndIf
If WinampGetRepeatMode()==TRUE Then
  SayMessage (OT_USER_REQUESTED_INFORMATION, MsgRepeatModeOn_L, MsgOn)
Else
  SayMessage (OT_USER_REQUESTED_INFORMATION, MsgRepeatModeOff_L, MsgOff)
EndIf
EndScript

Void Function CheckStopAfterCurrentTrack ()
If !WinampStopped Then
	Return
EndIf
Delay(1)
If IsNotPlaying() then
	Let WinampStopped = 0		;disable
Else
	ScheduleFunction(fn_CheckStopAfterCurrentTrack, 10)
endIf
EndFunction

Script StopAfterCurrentTrack ()
UserBufferClose()
If IsCoreWinampWindow() Then
	If IsNotPlaying() Then
		Let WinampStopped = 0
		SayMessage (OT_ERROR, MsgNoTrackPlaying_L )
		Return
	EndIf
	TypeKey (cksPaste ) ; Ctrl+V
	Pause()
	Let WinampStopped = !WinampStopped
	PerformScript SayCurrentTrackStoppedStatus()
	If WinampStopped Then
		CheckStopAfterCurrentTrack()
	EndIf
Else
	PerformScript PasteFromClipboard()
EndIf
EndScript

Script SayCurrentTrackStoppedStatus ()
If WinampStopped Then
	SayMessage (OT_USER_REQUESTED_INFORMATION, MsgStopAfterCurrentTrackActive_L, MsgStopAfterCurrentTrackActive_S)
Else
		SayMessage (OT_USER_REQUESTED_INFORMATION, MsgStopAfterCurrentTrackInActive_L, MsgStopAfterCurrentTrackInActive_S)
EndIf
EndScript

Void Function  AdjustEqualizerBands (string sKey)
var
  Int nBand,
  Int nAdjustment,
Int nValue
If !IsWinampEqualiser() Then
	If sKey == ksToggleRepeat Then
		PerformScript  DecreaseEqualiserBand4OrToggleRepeatMode  ()
	EndIf
	Return
EndIf
Let nAdjustment = 0
Let nBand = StringContains(ksEQIncreaseBands, sKey)
If nBand > 0 Then
	Let nAdjustment = 1
EndIf
If nAdjustment == 0 Then
	Let nBand = StringContains(ksEQDecreaseBands, sKey)
	If nBand > 0 Then
		Let nAdjustment = -1
	EndIf
EndIf
If nAdjustment == 0 Then
	Let nBand = StringContains(ksEQDecreaseBands, sKey)
	If nBand>0 Then
		Let nAdjustment = -1
	EndIf
EndIf
If nAdjustment == 0 Then
	If sKey == ksEQPreampIncrease
	|| sKey == ksEQPreampDecrease then
		Let nBand = 11
		If sKey == ksEQPreampDecrease Then
			Let nAdjustment = -1
		Else
			Let nAdjustment = 1
		EndIf
	EndIf
EndIf
;SayEqualiserBand(nBand, nAdjustment)
; The preceding line is commented because that function is not supposed to be called unless the keystrokes that adjust the Winamp equaliser bands are suppressed.
; Since the keystrokes have been sent (all except the Tab key which is tied to a script waiting to be processed after KeyPressedEvent),
; we need only report the new equaliser band setting to the user.
; Note that the Tab key needs special attention because a decrease in the preamp gain won't manifest until after Script Tab() is executed:
; We have to guess what it'll be.  Provided that the Nullsoft team don't change how Winamp does this, we are fine for now.
Let nValue = WinampGetEqData(nBand-1)
If nBand == 11 Then ; was the preamp adjusted
  If nAdjustment<0 Then ; was the preamp decreased
    Let nValue = nValue + 2 ; the Tab key was pressed, so decrease the value by two to predict the eventual value when Script Tab() is finally executed
    If nValue>63 Then
      Let nValue = 63
    EndIf
  EndIf
  SayMessage(OT_STATUS, FormatString (MsgPreAmpValue, WinampEqValueToDecibels (nValue)), WinampEqValueToDecibels (nValue))
Else
  SayMessage(OT_STATUS, FormatString (MsgEqualizerBandValue, IntToString(nBand), WinampEqValueToDecibels (nValue)), WinampEqValueToDecibels (nValue))
EndIf
EndFunction


Void Function RestoreKeyboardEcho ()
  SetJCFOption (OPT_TYPING_ECHO, GlobalKeyboardOption)
EndFunction

void function ClearShouldSpeakTrackTitle()
let gbShouldSpeakTrackTitle = false
EndFunction
int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if nKey == key_SPACEBAR
|| (nIsBrailleKey && gbUsingRemotePACMate && StringCompare(strKeyName,cksBrlSpace,0) == 0) then
	if !GlobalMenuMode
	&& !DialogActive()
	&& IsCoreWinampWindow() then
		If IsNotPlaying() Then
			WinampPlay()
		Else
			TypeKey (ksPauseTrack)
		EndIf
		return true
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	int bResult,
	int CurrentLayer
let CurrentLayer = GlobalActiveLayer
let bResult = PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
return bResult || CurrentLayer != NoLayerActive
EndFunction

Void Function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
If StringCompare (strKeyName, ksPriorTrack) == 0
|| StringCompare (strKeyName, ksNextTrack) == 0 Then
	let gbShouldSpeakTrackTitle = true
	ScheduleFunction("ClearShouldSpeakTrackTitle",5)
EndIf
; moved the key analysis from the scripts to the place...
If StringContains(ks_WINAMP_SINGLE_KEYS, StrKeyName) && (! UserBufferIsActive ()) && GetWindowTypeCode (GetFocus ()) != WT_EDIT then ; reaction on simple keys is special
	let GlobalKeyboardOption = GetJCFOption (OPT_TYPING_ECHO)
	SetJCFOption (OPT_TYPING_ECHO, 0)
	If IsWinampEqualiser () then
		If StringContains (StringUpper(ksToggleEqualiserAutoload+ksToggleEqualiserState), strKeyName) then
			Delay(1) ; give Winamp time to update the equaliser state
			If (! StringCompare (strKeyName, ksToggleEqualiserAutoload, FALSE)) Then ; toggles equilizer auto load
				If WinampGetEqData(12) Then
					SayMessage(OT_STATUS, FormatString (MsgWinampEqualiserAutoloadStatus_L, MsgEnabled), MsgEnabled)
				Else
					SayMessage(OT_STATUS, FormatString (MsgWinampEqualiserAutoloadStatus_L, MsgDisabled), MsgDisabled)
				EndIf
			ElIf (! StringCompare (strKeyName, ksToggleEqualiserState, FALSE)) Then ; toggle equilizer state
				If WinampGetEqData(11) Then
					SayMessage(OT_STATUS, FormatString (MsgEqualizerStatus_L, MsgEnabled), MsgEnabled)
				Else
					SayMessage(OT_STATUS, FormatString (MsgEqualizerStatus_L, MsgDisabled), MsgDisabled)
				EndIf
			EndIf
		EndIf
	EndIf
	If Not StringCompare (strKeyName, ksToggleShuffleMode, FALSE) Then ; toggle shuffle mode
		If !MenusActive()
		&& !DialogActive()
		&& (IsMainWinampWindow() || IsPlaylistEditorWindow()) Then
			Delay(1) ; give Winamp time to update shuffle mode
			If WinampStopItem Then
				SayMessage (OT_STATUS, WinampShuffleModeDisabled)
			Else
				; Announce the new state of the shuffle mode
				If WinampGetShuffleMode()==1 Then
					SayMessage (OT_STATUS, FormatString (MsgShuffleModeStatus_L, MsgOn), MsgOn)
				ElIf WinampGetShuffleMode()==0 Then
					SayMessage (OT_STATUS, FormatString (MsgShuffleModeStatus_L, MSGOff), MSGOff)
				EndIf
			EndIf
		EndIf
	EndIf
	If IsCoreWinampWindow() && StringContains (ks_WINAMP_SINGLE_KEYS_2, strKeyName) then ; check if several keys were pressed in core window
		Let WinampStopped = 0
		If StringCompare (strKeyName, ksSetTimeMarker) == 0 then
			If (! MenusActive()) && (! DialogActive()) Then
				ScheduleFunction(fn_SetTimeMarkerHelper, 0)
			EndIf
		EndIf
	EndIf
	If (! StringCompare (strKeyName, ksPlayTrack, FALSE)) Then ; play track
		If IsCoreWinampWindow() then
			Let WinampStopped = 0
		EndIf
		CheckStoppingPoint()
	EndIf
	ScheduleFunction ("RestoreKeyboardEcho", 1)
EndIf
If (nKey >=2 && nKey <= 11)
|| (nKey>=15 && nKey<=25)
|| nKey == 41 Then
	AdjustEqualizerBands(strKeyName)
	Return
EndIf
ProcessKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
EndFunction

Script AddBookMark (int i)
var
	int bLaterVersion,
	int bKeyMatch
let bLaterVersion = igWmpMajorVersion > 5
	|| (igWmpMajorVersion == 5
	&& (igWmpMinorVersion > 5
	|| (igWmpMinorVersion == 5 && igWmpUpdateVersion >= 7)))
If IsMainWinampWindow ()
|| IsPlaylistEditorWindow() Then
	if bLaterVersion
	&& 1 == i then
		let bKeyMatch = true
		TypeKey(ksAddBookMarkLaterVersion) ; Control+Alt+B
	elif !bLaterVersion
	&& 0 == i then
		let bKeyMatch = true
		TypeKey(ksAddBookMark) ; Alt+I
	EndIf
	if bKeyMatch then
		Pause()
		SayMessage (OT_STATUS, MsgBookMarkAdded_L, MsgBookMarkAdded_S)
		return
	EndIf
EndIf
if !DialogActive()
&& !bLaterVersion
&& bKeyMatch then
	SayMessage (Ot_ERROR, WinampOnlyAvailable3)
	return
EndIf
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

Script EditBookMark ()
If IsMainWinampWindow () Then
	TypeKey (ksEditBookMark ); alt+Control+i
	Pause()
Else
	SayMessage (Ot_ERROR, WinampBkEditErr)
EndIf
EndScript

Script CloseWinamp ()
Let WinampStopped = 0
TypeKey(ksCloseWinamp) ;Alt+F4
EndScript

Script StopAndFadeOut ()
UserBufferClose()
SayCurrentScriptKeyName()
TypeKey (ksStopAndFadeOut )
If IsCoreWinampWindow() then
	Let WinampStopped = 0
EndIf
EndScript

Script CloseMinibrowser ()
Var
  Int nOverride,
  String sOpenWindows
if DialogActive() then
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	return
EndIf
Let nOverride = IsSameScript()
If MenusActive()
|| DialogActive()  Then
  TypeKey(ksDisableMiniBrowser) ;{Alt+t}
  Return
EndIf
Let sOpenWindows = GetWindowStatuses()
If (nOverride) Then
  If (StringLength(sOpenWindows) == 1
  && sOpenWindows == cscB) then
	  SetFocus(GetWinampMainWindowHandle())
  EndIf
  TypeKey(ksDisableMiniBrowser)
  Delay(1)
  Pause()
  If StringLength(GetWindowStatuses()) == 0 Then
	  SetFocus(GetWinampMainWindowHandle())
  EndIf
  If StringContains(GetWindowStatuses(), cscB) Then
    SayMessage (OT_STATUS, MsgMiniBrowserOpened_L, MsgMiniBrowserOpened_S)
  Else
    SayMessage (OT_STATUS, MsgMiniBrowserClosed_L, MsgMiniBrowserClosed_S)
  EndIf
  Return
EndIf
If StringContains(sOpenWindows, cscB) Then
  If StringLength(sOpenWindows) == 1 Then
    TypeKey (ksToggleMainWindow )
    Pause()
    SetFocus(GetWinampMainWindowHandle())
  EndIf
  TypeKey(ksDisableMiniBrowser) ;{alt+t}
  Pause()
  SayMessage(ot_JAWS_MESSAGE, WinampClosingWinampMiniBrowser_l, WinampClosingWinampMiniBrowser_s)
EndIf
EndScript

Void Function FindTopOfPlayList()
Var
	Int k
;TypeKey (cksEnd )
;Pause()
TypeKey (cksHome )
Pause()
TypeKey (cksUpArrow )
Pause()
While (IntegerIndex(FindHighLightedItem(0))>1 && k<PlaylistSearchRange)
	TypeKey (cksUpArrow )
	Pause()
Let k = k+1
EndWhile
EndFunction

Script GotoTopOfPlayList ()
If UserBufferIsActive ()
|| !IsPlaylistEditorWindow()
|| !IsPCCursor() Then
	PerformScript JAWSHome()
	Return
EndIf
SayMessage(OT_JAWS_MESSAGE, WinampTopOfPlayList, WinampTop)
If IntegerIndex(FindHighlightedItem(0)) > 1 Then
	Let WinampMagneticTracking = 0
	FindTopOfPlayList()
	EndIf
FindHighlightedItem(TRUE)
EndScript

Void Function FindBottomOfPlayList()
Var
	Int i,
	Int j, ; remember last play list item index
	Int k
Let WinampMagneticTracking = 0
;TypeKey (cksHome)
;Pause()
TypeKey (cksEnd)
Pause()
TypeKey (cksDownArrow)
Pause()
Let i = 0
Let j = -1
Let k = 0
While (j!=i && k<PlaylistSearchRange)
	Let j = i
	Let i = IntegerIndex(FindHighlightedItem(0))
	TypeKey (cksDownArrow)
	Pause()
	Let k = k+1
EndWhile
EndFunction

Script GotoBottomOfPlayList ()
If UserBufferIsActive ()
|| !IsPlaylistEditorWindow()
|| !IsPCCursor() Then
	PerformScript JAWSEnd()
	Return
EndIf
	SayMessage(OT_JAWS_MESSAGE, WinampBottomOfPlayList, WinampBottom)
FindBottomOfPlayList()
FindHighlightedItem(TRUE)
EndScript

String Function TrimIntegerFromString(String s)
Var
  Int i
Let i = StringContains(s, cscPeriod)
If i > 0 Then
Let i = i + 1
While (i <= StringLength(s) && StringContains(SubString(s, i, 1), cscSpace)>0)
Let i = i + 1
EndWhile
Let s = StringRight(s, StringLength(s)-i+1)
EndIf
Return s
EndFunction

Script GeneratePlayListToHtml ()
If IsPlaylistEditorWindow() Then
	TypeKey (ksGeneratePlayListToHtml ); Alt+Control+g
	Pause()
	SayMessage (OT_JAWS_MESSAGE, MsgGenerateHTMLPage_L)
	return
EndIf
SayMessage (OT_ERROR, MsgGenerateHTMLPageError_L)
EndScript

String Function GetTrackName (int nDecorate)
Var
	String sTitle,
	Int i
Let sTitle = TrimIntegerFromString(GetWinampTitle())
Let i = StringContains(sTitle, wn_title_base)
If i > 0 Then
	Let sTitle = StringLeft(sTitle, i-1)
EndIf
If nDecorate Then
	; Substitute LSBReplacement and RSBReplacement  for [ and ] respectively in track names since [ and ] may not appear in section headings.
	Let i = 1
	While (i <= StringLength(sTitle))
		If SubString(sTitle, i, 1) == cscLsb Then
			Let sTitle = StringLeft(sTitle, i - 1) + LSBReplacement + StringRight(sTitle, StringLength(sTitle)-i)
		EndIf
		Let i = i + 1
		If SubString(sTitle, i, 1) == cscRsb Then
			Let sTitle = StringLeft(sTitle, i - 1) + RSBReplacement  + StringRight(sTitle, StringLength(sTitle)-i)
		EndIf
	EndWhile
EndIf
Return sTitle
EndFunction

Int Function IsNotPlaying ()
Return WinampIsPlaying()<=0
EndFunction

Int Function CurrentTrackNumber ()
Return WinampGetPlayListPosition() + 1
EndFunction

String Function GetATrackTime (int nGetTrackLength)
Var
  String sTime,
  Handle hFocus
If IsNotPlaying() Then
  Return cscNull
EndIf
If nGetTrackLength Then
  Let sTime = WinampGetTotalTime()
Else
  Let sTime = WinampGetElapsedTime()
EndIf
Return sTime
EndFunction

String Function FormatTime (String sTime)
Var
  Int nMinutes,
  Int nSeconds
If StringContains(sTime, cscColon) Then
  Let nMinutes = StringToInt(StringSegment(sTime, cscColon, 1))
  Let nSeconds = StringToInt(StringSegment(sTime, cscColon, 2))
Else
  Let nMinutes = 0
  Let nSeconds = StringToInt(sTime)
EndIf
Let sTime = IntToString(nMinutes) + cscSpace
If nMinutes == 1 Then
  Let sTime = sTime  + WinampMinute
Else
  Let sTime = sTime + WinampMinutes
EndIf
Let sTime = sTime + cscSpace + IntToString(nSeconds) + cscSpace
If nSeconds != 1 Then
  Let sTime = sTime + WinampSeconds
Else
  Let sTime = sTime + WinampSecond
EndIf
Return sTime
EndFunction

Int Function StringTimeToInt (string sTime)
Var
  Int nSign,
  Int nMinutes,
  Int nSeconds
If StringContains(sTime, cscColon) Then
  Let nMinutes = StringToInt(StringSegment(sTime, cscColon, 1))
  Let nSeconds = StringToInt(StringSegment(sTime, cscColon, 2))
Else
  Let nMinutes = 0
  Let nSeconds = StringToInt(sTime)
EndIf
If StringContains(sTime, cscMinus) Then
  Let nSign = -1
Else
  Let nSign = 1
EndIf
If nMinutes < 0 Then
  Let nMinutes = 0 - nMinutes
EndIf
If nSeconds< 0 Then
  Let nSeconds = 0 - nSeconds
EndIf
Return nSign * (nMinutes * 60 + nSeconds) * 1000
EndFunction

Void Function SetTimeMarkerHelper ()
Var
  String sElapsedTime,
  Int nNumberOfTimeMarkers,
  Int nTimeMarker,
  String sTimeMarker,
  String sTrackName,
  String sTimeMarkerName,
  Int nOk,
  Int nTimeMarkerSaved
Let sElapsedTime = GetATrackTime(0) ; get elapsed time
If StringLength(sElapsedTime) > 0 Then
  If GetJFWVersion() >= cJFWVer37 Then
    Let nOk = InputBox(WinampTimeMarkerNamePrompt, WinampTimeMarkerNameTitle, sTimeMarkerName)
    SpeechOff()
    Delay(1)
    Pause()
    SpeechOn()
    If !nOk Then
      SayMessage(OT_JAWS_MESSAGE, WinampCancelled, msgSilent)
      Return
    EndIf
  EndIf
  Let sTrackName = GetTrackName(1)
  Let nNumberOfTimeMarkers = IniReadInteger (sTrackName, TimeMarkerCountPrefix, 0, TimeMarkerFile)
  Let nTimeMarker = nNumberOfTimeMarkers + 1
  Let sTimeMarker = TimeMarkerPrefix + IntToString(nTimeMarker)
  Let nTimeMarkerSaved = IniWriteInteger (sTrackName, TimeMarkerCountPrefix, nTimeMarker, TimeMarkerFile)
  If nTimeMarkerSaved Then
    Let nTimeMarkerSaved = IniWriteString (sTrackName, sTimeMarker, sElapsedTime, TimeMarkerFile)
  EndIf
  If StringLength(sTimeMarkerName) > 0
  && nTimeMarkerSaved Then
      Let sTimeMarker = TimeMarkerNamePrefix + IntToString(nTimeMarker)
      Let nTimeMarkerSaved = IniWriteString(sTrackName, sTimeMarker, sTimeMarkerName, TimeMarkerFile)
  EndIf
  If nTimeMarkerSaved Then
  	SayMessage (OT_JAWS_MESSAGE, FormatString (MsgTimeMarkerSet_L, IntToString(nTimeMarker) , FormatTime(sElapsedTime) , sTimeMarkerName))
  Else
  SayMessage (OT_ERROR, MsgTimeMarkerError_L)
  EndIf
Else
  SayMessage (OT_ERROR, MsgNoTrackPlaying_L )
EndIf
EndFunction

String Function GetListOfTimeMarkers (string sTrackName)
Var
  Int nNumberOfTimeMarkers,
  Int i,
  String sTimeMarker,
  String sTimeMarkerName,
  String sList
Let nNumberOfTimeMarkers = IniReadInteger (sTrackName, TimeMarkerCountPrefix, 0, TimeMarkerFile)
If nNumberOfTimeMarkers == 0 Then
  Return cscNull
EndIf
Let i = 1
Let sList = cscNull
While (i <= nNumberOfTimeMarkers)
  Let sTimeMarker = IniReadString (sTrackName, TimeMarkerPrefix + IntToString (i), cscNull, TimeMarkerFile)
  Let sTimeMarkerName = IniReadString (sTrackName, TimeMarkerNamePrefix + IntToString (i), cscNull, TimeMarkerFile)
  If StringLength(sTimeMarker) > 0 Then
    If StringLength(sTimeMarkerName) > 0 Then
      Let sList = sList + sTimeMarkerName + cscOldDash
    EndIf
    Let sList = sList + WinampTimeMarker + cscSpace + IntToString(i) + csLvs + sTimeMarker
    If i< nNumberOfTimeMarkers Then
      Let sList = sList + cscVert
    EndIf
  EndIf
  Let i = i + 1
EndWhile
Return sList
EndFunction

Script JumpToTimeMarker ()
Var
  String sTrackName,
  String sListOfTimeMarkers,
  Int nTimeMarker,
  String sTimeMarker,
  Int i,
  Handle hFocus
If !IsCoreWinampWindow()
|| MenusActive()
|| DialogActive() Then
  SayMessage (OT_ERROR, MsgWinAmpFunctionNotAvailable_l)
  Return
EndIf
Let hFocus = GetFocus() ; save the current focus
If StringLeft(GetWinampTitle(), 6) != WinampWinamp  Then ; Is there a file ready?
  Let sTrackName = GetTrackName(1)
  Let sListOfTimeMarkers = GetListOfTimeMarkers(sTrackName)
  If StringLength(sListOfTimeMarkers) > 0 Then
    Let nTimeMarker = DlgSelectItemInList(MsgSkipToTimeMarker_L + cscVert + sListOfTimeMarkers, WinampTimeMarkerSelection, False) -1
    If nTimeMarker > 0 Then
      Let sTimeMarker = StringSegment (sListOfTimeMarkers, cscVert, nTimeMarker)
      Let i = StringContains(sTimeMarker, cscColon)
      Let sTimeMarker = StringRight(sTimeMarker, StringLength(sTimeMarker) - i - 2)
      If IsNotPlaying() Then
        WinampPlay()
      EndIf
;        Delay(1)
      WinampJumpToTime(sTimeMarker)
    EndIf
    SpeechOff()
    Delay(1) ; Wait for screen to settle so an accurate window handle for the current focus can be retrieved
    If (hFocus != GetFocus()) Then ; does the current focus match the saved value?
      SetFocus(hFocus) ; no.  Return to saved focus
    EndIf
; The following delay prevents the current window title from being announced when the list dialog is closed.
    Delay(1)
    Pause()
    SpeechOn()
  Else
    SayMessage (OT_ERROR, MsgNoTimeMarkers_L )
  EndIf
Else
  SayMessage (OT_ERROR, MsgNoTrackReady_L )
EndIf
EndScript

Script RemoveTimeMarker ()
Var
  String sTrackName,
  String sListOfTimeMarkers,
  Int nNumberOfTimeMarkers,
  Int nTimeMarker,
  String sTimeMarker,
  String sTimeMarkerName,
  Int i,
  Int nOk,
  Handle hFocus
If !IsCoreWinampWindow()
|| MenusActive()
|| DialogActive() Then
  SayMessage (OT_ERROR, MsgWinAmpFunctionNotAvailable_l)
  Return
EndIf
Let hFocus = GetFocus()
If StringLeft(GetWinampTitle(), 6) != WinampWinamp  Then ; Is there a file ready?
  Let sTrackName = GetTrackName(1)
  Let sListOfTimeMarkers = GetListOfTimeMarkers(sTrackName)
  If StringLength(sListOfTimeMarkers) > 0 Then
    Let nNumberOfTimeMarkers = IniReadInteger (sTrackName, TimeMarkerCountPrefix, 0, TimeMarkerFile)
    Let nTimeMarker = DlgSelectItemInList(MsgRemoveTimeMarker_L + cscVert + sListOfTimeMarkers + cscVert + WinampRemoveAllTimeMarkers, WinampTimeMarkerSelection, False) -1
    If nTimeMarker > 0
    && nTimeMarker <= nNumberOfTimeMarkers Then
;      Let sTimeMarker = StringSegment (sListOfTimeMarkers, cscVert, nTimeMarker)
;      Let i = StringContains(sTimeMarker, cscColon)
;      Let sTimeMarker = stringRight(sTimeMarker, StringLength(sTimeMarker) - i - 2)
      Let nOk = IniWriteInteger (sTrackName, TimeMarkerCountPrefix, nNumberOfTimeMarkers-1, TimeMarkerFile)
      Let i = nTimeMarker
      While (nOk && i < nNumberOfTimeMarkers)
        Let sTimeMarker = IniReadString (sTrackName, TimeMarkerNamePrefix + IntToString(i+1), cscNull, TimeMarkerFile)
        Let nOk = IniWriteString (sTrackName, TimeMarkerNamePrefix + IntToString(i), sTimeMarker, TimeMarkerFile)
        Let sTimeMarker = IniReadString (sTrackName, TimeMarkerPrefix + IntToString(i+1), cscNull, TimeMarkerFile)
        Let nOk = IniWriteString (sTrackName, TimeMarkerPrefix + IntToString(i), sTimeMarker, TimeMarkerFile)
        Let i = i + 1
      EndWhile
      If nOk Then
        Let nOk = IniRemoveKey (sTrackName, TimeMarkerPrefix + IntToString(nNumberOfTimeMarkers), TimeMarkerFile)
      EndIf
      If nOk
      && nNumberOfTimeMarkers == 1 Then
        Let nOk = IniRemoveSection (sTrackName, TimeMarkerFile)
      EndIf
      If nOk Then
        SayMessage (OT_STATUS, FormatString (MsgTimeMarkerRemoved_L, IntToString(nTimeMarker)), WinampRemoved)
      Else
  SayMessage (OT_ERROR, MsgTimeMarkerError_L)
      EndIf
    EndIf
    If nTimeMarker > nNumberOfTimeMarkers Then
      Let nOk = IniRemoveSection (sTrackName, TimeMarkerFile)
      If nOk Then
        SayMessage (OT_STATUS, MsgAllTimeMarkersRemoved_L, MsgAllTimeMarkersRemoved_S)
      Else
  SayMessage (OT_ERROR, MsgTimeMarkerError_L)
      EndIf
    EndIf
    SpeechOff()
    Delay(1) ; Wait for screen to settle so an accurate window handle for the current focus can be retrieved
    If hFocus != GetFocus() Then ; does the current focus match the saved value?
      SetFocus(hFocus) ; no.  Return to saved focus
    EndIf
; The following delay prevents the current window title from being announced when the list dialog is closed.
    Delay(1)
    Pause()
    SpeechOn()
  Else
  SayMessage (OT_ERROR, MsgNoTimeMarkers_L )
  EndIf
Else
  SayMessage (OT_ERROR, MsgNoTrackReady_L)
EndIf
EndScript

Script SayElapsedTime ()
Var
  String sTime,
String sMinutes,
  String sSeconds
If !IsCoreWinampWindow() Then
  SayMessage (OT_ERROR, MsgWinAmpFunctionNotAvailable_l)
  Return
EndIf
If IsNotPlaying() Then
  SayMessage (OT_ERROR, MsgNoTrackPlaying_L )
  Return
EndIf
Let sTime = FormatTime(GetATrackTime(0))
SayMessage (OT_USER_REQUESTED_INFORMATION, FormatString (MsgElapsedTime_L, sTime))
EndScript

Script SayTimeLength ()
Var
  String sTime,
String sMinutes,
  String sSeconds
If !IsCoreWinampWindow() Then
  SayMessage (OT_ERROR, MsgWinAmpFunctionNotAvailable_l)
  Return
EndIf
If IsNotPlaying() Then
  SayMessage (OT_ERROR, MsgNoTrackPlaying_L )
  Return
EndIf
Let sTime = FormatTime(GetATrackTime(1))
SayMessage (ot_user_requested_information, FormatString (MsgTimeLength_L, sTime))
EndScript

Script SayRemainingTime ()
Var
  String sElapsedTime,
  String sTotalTime,
  Int nElapsedMinutes,
  Int nElapsedSeconds,
  Int nTotalMinutes,
  Int nTotalSeconds,
  Int nRemainingMinutes,
  Int nRemainingSeconds,
  String sTime
  If !IsCoreWinampWindow() Then
  SayMessage (OT_ERROR, MsgWinAmpFunctionNotAvailable_l)
  Return
EndIf
If IsNotPlaying() Then
  SayMessage (OT_ERROR, MsgNoTrackPlaying_L )
  Return
EndIf
Let sElapsedTime = GetATrackTime(0)
  Let sTotalTime = GetATrackTime(1)
If StringContains(sElapsedTime, cscColon) Then
  Let nElapsedMinutes = StringToInt(StringSegment(sElapsedTime, cscColon, 1))
  Let nElapsedSeconds = StringToInt(StringSegment(sElapsedTime, cscColon, 2))
Else
  Let nElapsedMinutes = 0
  Let nElapsedSeconds = StringToInt(sElapsedTime)
EndIf
If StringContains(sTotalTime, cscColon) Then
  Let nTotalMinutes = StringToInt(StringSegment(sTotalTime, cscColon, 1))
  Let nTotalSeconds = StringToInt(StringSegment(sTotalTime, cscColon, 2))
Else
  Let nTotalMinutes = 0
  Let nTotalSeconds = StringToInt(sTotalTime)
EndIf
Let nRemainingSeconds = (nTotalMinutes - nElapsedMinutes) * 60 + nTotalSeconds - nElapsedSeconds
If nRemainingSeconds<0 Then
	Let nRemainingSeconds = 0
EndIf
Let nRemainingMinutes = nRemainingSeconds / 60
Let nRemainingSeconds = nRemainingSeconds % 60
Let sTime = FormatTime(IntToString(nRemainingMinutes) + cscColon + IntToString(nRemainingSeconds))
SayMessage (OT_USER_REQUESTED_INFORMATION, FormatString (MsgTimeRemaining_S, sTime))
EndScript

Script ReviewEndOfTrack ()
Var
  Int nTrackLength,
  String sTime,
  Handle hFocus
If DialogActive()
|| GetWindowSubtypeCode(GetFocus()) > WT_UNKNOWN
|| MenusActive()  Then
	SayCurrentScriptKeyLabel()
	TypeKey(ksReviewEndOfTrack) ;Alt+R
	Return
EndIf
If !IsCoreWinampWindow() Then
  SayMessage (OT_ERROR, MsgWinAmpFunctionNotAvailable_l)
  Return
EndIf
Let hFocus = GetFocus() ; save the current focus
If IsNotPlaying() Then
  {x}
  CheckStoppingPoint()
EndIf
Delay(1) ; give Winamp time to start playing the track, just in case it is not playing already
If IsNotPlaying() Then
  SayMessage (OT_ERROR, MsgNoTrackPlaying_L )
  Return
EndIf
Let nTrackLength = StringTimeToInt(GetATrackTime(1))
If (nTrackLength <= WinampReviewTime * 1000
|| StringTimeToInt(GetATrackTime(0)) >= nTrackLength - WinampReviewTime * 1000) Then
  Return
EndIf
Let nTrackLength = nTrackLength / 1000 - WinampReviewTime
Let sTime = IntToString(nTrackLength / 60) + cscColon + IntToString(nTrackLength % 60)
WinampJumpToTime(sTime)
    SpeechOff()
Delay(1) ; Wait for screen to settle so an accurate window handle for the current focus can be retrieved
If (hFocus != GetFocus()) Then ; does the current focus match the saved value?
  SetFocus(hFocus) ; no.  Return to saved focus
EndIf
; The following delay prevents the current window title from being announced when the list dialog is closed.
Delay(1)
Pause()
SpeechOn()
EndScript

Script SelectReviewTime ()
Let WinampReviewTime = WinampReviewTime + ReviewIncrement
If WinampReviewTime > MaxReviewOffset then
	Let WinampReviewTime = ReviewIncrement
endIf
SayMessage (OT_JAWS_MESSAGE, FormatString (MsgReviewTimeSet_l , IntToString(WinampReviewTime)))
EndScript

Script ToggleWinampMainWindow ()
Var
	Int nOverride,
  String sOpenWindows
Let nOverride = IsSameScript()
If !IsStandardWinampWindow()
&& !MenusActive() Then
	TypeKey(ksToggleMainWindow) ;Alt+W
	return
EndIf
Let sOpenWindows = GetWindowStatuses()
  If !nOverride
  && StringLength(sOpenWindows) == 1
  && sOpenWindows == cscW Then
  SayMessage(ot_error, WinampOnlyOpenWindow_l, WinampOnlyOpenWindow_s)
  Return
  EndIf
TypeKey(ksToggleMainWindow)  ;alt+w
;Delay(1)
;Pause()
If StringLength(GetWindowStatuses()) == 0 Then
	SetFocus(GetWinampMainWindowHandle()) ; make sure the focus ends up in the main window
EndIf
If StringContains(GetWindowStatuses(), cscW) Then
  SayMessage (OT_JAWS_MESSAGE, MsgMainWindowOpen_L, MsgOpen)
Else
  SayMessage (OT_JAWS_MESSAGE, MsgMainWindowClosed_L, MsgClosed)
EndIf
EndScript

Script ToggleWinampEqualiser ()
Var
	Int nOverride,
  String sOpenWindows,
  string sStatus
Let nOverride = IsSameScript()
If !IsStandardWinampWindow()
&& !MenusActive() Then
	TypeKey(ksToggleEqualiser) ;Alt+G
	Return
EndIf
Let sOpenWindows = GetWindowStatuses()
  If !nOverride
  && StringLength(sOpenWindows) == 1
  && sOpenWindows == cscQ Then
  SayMessage(ot_error, WinampOnlyOpenWindow_l, WinampOnlyOpenWindow_s)
  Return
  EndIf
If StringLength(sOpenWindows) == 1
&& sOpenWindows == cscQ then
	SetFocus(GetWinampMainWindowHandle()) ; make sure the focus ends up in the main window
EndIf
TypeKey(ksToggleEqualiser) ;Alt+G
;Delay(1)
;Pause()
If StringLength(GetWindowStatuses()) == 0 Then
	SetFocus(GetWinampMainWindowHandle())
EndIf
If StringContains(GetWindowStatuses(), cscQ) Then
  let sStatus = MsgOpen
Else
  let sStatus = MsgClosed
EndIf
SayMessage (OT_JAWS_MESSAGE, FormatString (MsgEqualizerStatus_L , sStatus), sStatus)
EndScript

Script ToggleWinampPlaylistEditor ()
Var
	Int nOverride,
  String sOpenWindows,
  string sStatus
Let nOverride = IsSameScript()
If !IsStandardWinampWindow()
&& !MenusActive() Then
	TypeKey(ksTogglePlaylistEditor) ;Alt+E
	Return
EndIf
Let sOpenWindows = GetWindowStatuses()
  If !nOverride
  && StringLength(sOpenWindows) == 1
  && sOpenWindows == cscP Then
  SayMessage(ot_error, WinampOnlyOpenWindow_l, WinampOnlyOpenWindow_s)
  Return
  EndIf
If StringLength(sOpenWindows) == 1
&& sOpenWindows == cscP then
	SetFocus(GetWinampMainWindowHandle()) ; make sure the focus ends up in the main window
EndIf
TypeKey(ksTogglePlaylistEditor) ;Alt+E
;Delay(1)
;Pause()
If StringLength(GetWindowStatuses()) == 0 Then
	SetFocus(GetWinampMainWindowHandle())
EndIf
If StringContains(GetWindowStatuses(), cscP) Then
  let sStatus= MsgOpen
Else
  let sStatus = MsgClosed
 EndIf
 SayMessage (OT_JAWS_MESSAGE, FormatString (MsgPlayListEditorStatus_L, sStatus), sStatus)
EndScript

Script ToggleWinampLibrary ()
Var
	Int nOverride,
  String sOpenWindows,
  string sStatus
Let nOverride = IsSameScript()
If !IsStandardWinampWindow()
&& !MenusActive() Then
	TypeKey(ksToggleLibrary) ;Alt+L
	Return
EndIf
Let sOpenWindows = GetWindowStatuses()
  If !nOverride
  && StringLength(sOpenWindows) == 1
  && sOpenWindows == cscL Then
  SayMessage(OT_ERROR, WinampOnlyOpenWindow_l, WinampOnlyOpenWindow_s)
  Return
  EndIf
If StringLength(sOpenWindows) == 1
&& sOpenWindows == cscL then
	SetFocus(GetWinampMainWindowHandle()) ; make sure the focus ends up in the main window
EndIf
TypeKey(ksToggleLibrary) ;Alt+L
Delay(10,true)
If StringLength(GetWindowStatuses()) == 0 Then
	SetFocus(GetWinampMainWindowHandle())
EndIf
If StringContains(GetWindowStatuses(), cscL) Then
  let sStatus = MsgOpen
Else
  let sStatus = MsgClosed
EndIf
SayMessage(OT_JAWS_MESSAGE, FormatString (MsgLibraryStatus_L, sStatus), sStatus)
EndScript

Script ToggleWinampStationInfo ()
Var
	Int nOverride,
  String sOpenWindows,
  string sStatus
Let nOverride = IsSameScript()
Let sOpenWindows = GetWindowStatuses()
  If !nOverride
  && StringLength(sOpenWindows) == 1
  && sOpenWindows == cscS Then
  SayMessage(OT_ERROR, WinampOnlyOpenWindow_l, WinampOnlyOpenWindow_s)
  Return
  EndIf
TypeKey(ksToggleStationInfo) ;Alt+B
If StringLength(GetWindowStatuses()) == 0 Then
	SetFocus(GetWinampMainWindowHandle())
EndIf
If StringContains(GetWindowStatuses(), cscS) Then
  let sStatus = MsgOpen
Else
  let sStatus = MsgClosed
EndIf
SayMessage(OT_JAWS_MESSAGE, FormatString (MsgStationInfoStatus_L, sStatus), sStatus)
EndScript

Script ToggleWinampVideo ()
Var
	Int nOverride,
  String sOpenWindows,
  string sStatus
Let nOverride = IsSameScript()
If !IsStandardWinampWindow()
&& !MenusActive()  Then
	TypeCurrentScriptKey()
	Return
EndIf
Let sOpenWindows = GetWindowStatuses()
  If !nOverride
  && StringLength(sOpenWindows) == 1
  && sOpenWindows == cscV Then
  SayMessage(OT_ERROR, WinampOnlyOpenWindow_l, WinampOnlyOpenWindow_s)
  Return
  EndIf
If StringLength(sOpenWindows) == 1
&& sOpenWindows == cscV then
	SetFocus(GetWinampMainWindowHandle()) ; make sure the focus ends up in the main window
EndIf
TypeKey(ksToggleWinampVideo) ;Alt+V
;Delay(1)
;Pause()
If StringLength(GetWindowStatuses()) == 0 Then
	SetFocus(GetWinampMainWindowHandle())
EndIf
If StringContains(GetWindowStatuses(), cscV) Then
  let sStatus = MsgOpen
Else
  let sStatus = MsgClosed
EndIf
SayMessage(OT_JAWS_MESSAGE, FormatString (MsgVideoStatus_L, sStatus), sStatus)
EndScript

Script ToggleTimeDisplayMode ()
Var
	string sStatus
If !IsStandardWinampWindow() Then
  Return
EndIf
TypeKey (ksToggleTimeDisplayMode) ;Control+T
SpeechOff()
PerformScript WinampMainMenu()
Pause()
  TypeKey (ksOptionsInMenu)
Pause()
NextLine()
NextLine()
  If Not StringLength (GetObjectState ()) then
    NextLine ()
  EndIf
  let sStatus = StringSegment (GetLine (), "(", 1)
ActivateMenuBar ()
  Pause()
SpeechOn()
SayMessage (OT_JAWS_MESSAGE, FormatString (MsgTimeDisplayModeStatus_L, sStatus), sStatus)
EndScript

Script PlaylistSelectAllOrToggleWinampAlwaysOnTop ()
If !IsStandardWinampWindow() Then
  TypeKey(ksPlaylistSelectAllOrToggleWinampAlwaysOnTop) ;control+A
  Return
EndIf
If IsPlaylistEditorWindow() Then
 	PerformScript SelectAll() ; default
 	Return
Else
  TypeKey (cksSelectAll )
EndIf
; Announce the new state of the always on top mode
SpeechOff()
PerformScript WinampMainMenu()
Pause()
TypeKey (ksO)
Pause()
NextLine()
NextLine()
NextLine()
NextLine()
SpeechOn()
;If StringContains(GetChunk(), csChecked) Then
If getControlAttributes()&ctrl_checked then
  SayFormattedMessage (OT_STATUS, FormatString (MsgWinampAlwaysOnTop_L , MsgOn), MsgOn)
Else
  SayFormattedMessage (OT_STATUS, FormatString (MsgWinampAlwaysOnTop_L , MsgOff), MsgOff)
EndIf
SpeechOff()
ActivateMenuBar ()
Pause()
SpeechOn()
EndScript

Script DecreaseEqualiserBand4OrToggleRepeatMode ()
Var
  string sStatus
  /*If IsWinampEqualiser() Then
  PerformScript AdjustEqualiserBands()
  Return
EndIf*/
;SayCurrentScriptKeyName()
;{r}
If ((MenusActive()
|| DialogActive())
|| (!IsMainWinampWindow()
&& !IsPlaylistEditorWindow())) Then
  Return
EndIf
;Delay(1)
If WinampGetRepeatMode()==1 Then
  let sStatus = MsgOn
Else
  let sStatus = MsgOff
EndIf
SayMessage (OT_JAWS_MESSAGE, FormatString (MsgRepeatModeStatus_L, sStatus), sStatus)
EndScript

Script ShowEqualiserSummary ()
Var
  string sEqualizerSummary
;DlgSelectItemInList (WinampEqSummary(), WinampEqualiserStatus, FALSE)
let sEqualizerSummary = WinampEqSummary()
let sEqualizerSummary = sEqualizerSummary   + KeyLabelSeparator
SayFormattedMessage (OT_USER_BUFFER, FormatString (MsgEqualizerSummary_Part1, StringSegment (sEqualizerSummary, KeyLabelSeparator , 1),
StringSegment (sEqualizerSummary, KeyLabelSeparator , 2),
StringSegment (sEqualizerSummary, KeyLabelSeparator , 3),
StringSegment (sEqualizerSummary, KeyLabelSeparator , 4),
StringSegment (sEqualizerSummary, KeyLabelSeparator , 5),
StringSegment (sEqualizerSummary, KeyLabelSeparator , 6)))
UserBufferAddText (FormatString (MsgEqualizerSummary_Part2, StringSegment (sEqualizerSummary, KeyLabelSeparator , 7),
StringSegment (sEqualizerSummary, KeyLabelSeparator , 8),
StringSegment (sEqualizerSummary, KeyLabelSeparator , 9),
StringSegment (sEqualizerSummary, KeyLabelSeparator , 10),
StringSegment (sEqualizerSummary, KeyLabelSeparator , 11),
StringSegment (sEqualizerSummary, KeyLabelSeparator , 12),
StringSegment (sEqualizerSummary, KeyLabelSeparator , 13)))
UserBufferAddText (cScBufferNewLine)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndScript

Void Function SayEqualiserBand (int nBand, int nAdjustment)
Var
  Int nValue
If nBand < 1
|| nBand > 11 Then
  Return
EndIf
Let nValue = WinampGetEqData(nBand-1)
If nAdjustment<0 Then
  Let nValue = nValue + 2
  If nValue>63 Then
    Let nValue = 63
  EndIf
EndIf
If nAdjustment>0 Then
  Let nValue = nValue - 2
  If nValue<0 Then
    Let nValue = 0
  EndIf
EndIf
WinampSetEqData(nBand-1, nValue)
If nBand == 11 Then
  SayMessage(OT_STATUS, FormatString (MsgPreAmpValue, WinampEqValueToDecibels (nValue)), WinampEqValueToDecibels (nValue))
Else
  SayMessage(OT_STATUS, FormatString (MsgEqualizerBandValue, IntToString(nBand), WinampEqValueToDecibels (nValue)), WinampEqValueToDecibels (nValue))
EndIf
EndFunction

Void Function SayCurrentScriptKeyName ()
Var
	String sKey
If GetJCFOption(OPT_TYPING_ECHO)%2 == 1 Then
Let sKey = GetCurrentScriptKeyName()
If StringLength(sKey) == 1 Then
	Let sKey = StringLower(sKey)
EndIf
If sKey == ks_SHIFTED_KEY_BASE
&& StringLength(sKey) == 7 Then
	Let sKey = StringUpper(StringSegment(sKey, cscPlus, 2))
EndIf
	Say(sKey, ot_JAWS_message)
EndIf
EndFunction

Script ShowCurrentTrackInfo ()
Var
	String sInfo,
	String sTrackLength
	If UserBufferIsActive () then
		UserBufferDeactivate ()
	EndIf
If StringLeft(GetWinampTitle(), 6) == WinampWinamp  Then
  SayMessage (OT_ERROR, MsgNoTrackReady_L)
	Return
endIf
Let sTrackLength = WinampGetTotalTime()
If StringLength(sTrackLength) == 0 Then
	Let sTrackLength = WinampNotAvailableTrackMustBePlaying
EndIf
Let sInfo = FormatString (MsgTrackInfo, GetTrackName(0), sTrackLength, IntToString(WinampGetSampleRate()) ,  IntToString(WinampGetBitRate()), IntToString(WinampGetNumberOfChannels()))
SayFormattedMessage (OT_USER_BUFFER, sInfo)
UserBufferAddText (cScBufferNewLine)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndScript

Script SayCurrentTrackTitle ()
If UserBufferIsActive () Then
	UserBufferDeactivate ()
EndIf
If StringLeft(GetWinampTitle(), 6) == WinampWinamp Then
  SayMessage (OT_ERROR, MsgNoTrackReady_L)
	Return
endIf
SayMessage(ot_user_requested_information, FormatString (MsgCurrentTrackTitle_L, GetTrackName(0)))
EndScript

Void Function SetWinampVolume (int nVolume)
If nVolume < 0 then
  Let nVolume = 0
EndIf
If nVolume > 255 Then
  Let nVolume = 255
EndIf
WinampSetVolume(nVolume)
Let nVolume = (nVolume * 100) / 255
SayMessage(ot_JAWS_message, FormatString (MsgWinampVolumeSetTo, IntToString(nVolume) ))
EndFunction

Script QuickVolumeChange (int i)
Var
  Int nVolume
Let nVolume = I*85
SetWinampVolume(nVolume)
EndScript

Void Function SetWinampPanning (int nPanning)
If nPanning < -128 Then
  Let nPanning = -128
EndIf
If nPanning > 127 Then
  Let nPanning = 127
EndIf
WinampSetPanning(nPanning)
Let nPanning = (nPanning * 100) / 127
SayMessage(OT_JAWS_MESSAGE, FormatString (MsgWinampPanningSetTo,IntToString(nPanning)))
If WinampGetNumberOfChannels() == 1 Then
  SayMessage(OT_ERROR, WinampMonoWarning_l, WinampMonoWarning_s)
EndIf
EndFunction

Script QuickPanningChange (int i)
Var
  Int nPanning
Let nPanning = I*64 - (i == 4) - 128
SetWinampPanning(nPanning)
EndScript

Script SayColoursAtCursor ()
SayMessage (OT_USER_REQUESTED_INFORMATION, FormatString (MsgWinAmpColors_L,
ColorToRGBString(GetColorText()),
ColorToRGBString(GetColorBackground()),
ColorToRGBString(WinampHighlightColour)))
EndScript

Script SwapTrackWithPrevious ()
If !IsPlaylistEditorWindow()
|| !IsPCCursor() Then
	PerformScript CloseListBox()
	Return
EndIf
If IntegerIndex (FindHighlightedItem(0)) > 1 Then
; Make sure the item is on the screen
	Let WinampMagneticTracking = 0
	TypeKey (cksUpArrow)
	TypeKey (cksDownArrow)
	Pause ()
	TypeKey (cksAltUpArrow)
	Pause()
	FindHighlightedItem (TRUE)
Else
	SayMessage(OT_JAWS_MESSAGE, WinampTopOfPlaylist, WinampTop)
EndIf
EndScript

Script SwapTrackWithNext ()
Var
	Int i,
	Int j
If !IsPlaylistEditorWindow()
|| !IsPCCursor() Then
	PerformScript OpenListBox()
	Return
EndIf
Let i = IntegerIndex(FindHighlightedItem(-1))
; Make sure the item is on the screen
TypeKey (cksDownArrow)
Pause()
Let j = IntegerIndex(FindHighlightedItem (FALSE))
If i < j Then
; Not on the last item
	Let WinampMagneticTracking = 0
	TypeKey (cksUpArrow)
	Pause()
	TypeKey (cksAltDownArrow)
	Pause()
	FindHighlightedItem(1)
Else
	SayMessage(OT_JAWS_MESSAGE, WinampBottomOfPlaylist, WinampBottom)
EndIf
EndScript

Script PlaylistPageUp ()
If IsPlaylistEditorWindow()
&& IsPCCursor() Then
	TypeKey (cksPageUp)
	Pause()
	TypeKey (cksUpArrow)
	Let WinampMagneticTracking = FALSE
	FindHighlightedItem(TRUE)
	Return
EndIf
PerformScript JAWSPageUp()
EndScript

Script PlaylistPageDown ()
If IsPlaylistEditorWindow()
&& IsPCCursor() Then
	TypeKey (cksPageDown)
	Pause()
	TypeKey (cksDownArrow)
	Let WinampMagneticTracking = FALSE
	FindHighlightedItem(TRUE)
	Return
EndIf
PerformScript JAWSPageDown()
EndScript

Script SayPriorCharacter ()
If UserBufferIsActive ()
|| !IsCoreWinampWindow()
|| !IsPCCursor() Then
	PerformScript SayPriorCharacter()
	Return
EndIf
TypeKey (cksLeftArrow)
If IsWinampEqualiser() Then
	If IsNotPlaying()  Then
		SayMessage(OT_JAWS_message, MsgPanLeft_L, msgSilent)
	EndIf
	Return
EndIf
EndScript

Script SayNextCharacter ()
If UserBufferIsActive ()
|| !IsCoreWinampWindow()
|| !IsPCCursor() Then
	PerformScript SayNextCharacter()
	Return
EndIf
TypeKey (cksRightArrow)
If IsWinampEqualiser() Then
	If IsNotPlaying()  Then
		SayMessage(OT_JAWS_message, MsgPanRight_L, msgSilent)
	EndIf
	Return
EndIf
EndScript

Int Function CopyTimeMarkersForATrack (string sTrackName, string sSourceFile, string sDestFile)Var
  Int nNumberOfTimeMarkers,
  Int i,
  String sTimeMarker,
  String sTimeMarkerName,
  Int nOk
Let nNumberOfTimeMarkers = IniReadInteger (sTrackName, TimeMarkerCountPrefix, 0, sSourceFile)
If nNumberOfTimeMarkers == 0 Then
  Return -1
EndIf
Let nOk = IniWriteInteger(sTrackName, TimeMarkerCountPrefix, nNumberOfTimeMarkers, sDestFile)
Let i = 1
While (nOk && i <= nNumberOfTimeMarkers)
  Let sTimeMarker = IniReadString (sTrackName, TimeMarkerPrefix + IntToString (i), cscNull, sSourceFile)
  Let sTimeMarkerName = IniReadString (sTrackName, TimeMarkerNamePrefix + IntToString (i), cscNull, sSourceFile)
  Let nOk = IniWriteString (sTrackName, TimeMarkerPrefix + IntToString (i), sTimeMarker, sDestFile)
  If nOk Then
    Let nOk = IniWriteString (sTrackName, TimeMarkerNamePrefix + IntToString (i), sTimeMarkerName, sDestFile)
  EndIf
  Let i = i + 1
EndWhile
Return nOk
EndFunction

Script ImportExportTimeMarkers ()
Var
	Int nChoice,
	String sTrackName,
	String sExtFile,
	Int nNumberOfTracks,
	Int i,
	Int nOk
If !IsCoreWinampWindow()
|| MenusActive()
|| DialogActive()  Then
  SayMessage (OT_ERROR, MsgWinAmpFunctionNotAvailable_l)
  Return
EndIf
Let nChoice = DlgSelectItemInList(WinampImportExportListMessage, WinampImportExportListPrompt, false)
SpeechOff()
Delay(1)
Pause()
SpeechOn()
If !nChoice Then
	Return
EndIf
If nChoice <= 2
&& StringLeft(GetWinampTitle(), 6) == WinampWinamp Then ; Is there a track ready?
  	SayMessage (OT_ERROR, MsgNoTrackReady_L)
	Return
EndIf
Let sTrackname = GetTrackName(1)
If nChoice == 1
&& IniReadInteger(sTrackName, TimeMarkerCountPrefix, 0, TimeMarkerFile) == 0 Then
	SayMessage (OT_ERROR, MsgNoTimeMarkers_L)
	Return
EndIf
If GetJFWVersion() >= cJFWVer37 Then
  Let nOk = InputBox(WinampImportExportInputTitle, WinampImportExportInputPromt, sExtFile)
	SpeechOff()
	Delay(1)
	Pause()
	SpeechOn()
	If !nOk
	|| StringLength(sExtFile) == 0 Then
		Return
	EndIf
Else
	Let sExtFile = TimeMarkerSetFileName
EndIf
Let sExtFile = sExtFile + FILE_EXT_TIME_MARKER
If nChoice == 1 Then
	Let nNumberOfTracks = IniReadInteger(TrackListSection, TrackCountPrefix, 0, sExtFile)
	Let nNumberOfTracks = nNumberOfTracks + 1
	Let nOk = CopyTimeMarkersForATrack(sTrackName, TimeMarkerFile, sExtFile)
	If nOk Then
		Let nOk = IniWriteString(TrackListSection, TrackNamePrefix+IntToString(nNumberOfTracks), sTrackName, sExtFile)
	EndIf
	If nOk Then
		Let nOk = IniWriteInteger(TrackListSection, TrackCountPrefix, nNumberOfTracks, sExtFile)
	EndIf
	If nOk Then
		SayMessage (OT_STATUS, FormatString (MsgCurrentTrackExportComplete_L , sExtFile))
	Else
		SayMessage (OT_ERROR, MsgCurrentTrackExportError_L )
	EndIf
ElIf nChoice == 2 Then
	Let nOk = CopyTimeMarkersForATrack(sTrackName, sExtFile, TimeMarkerFile)
	If nOk Then
		SayMessage (OT_STATUS, FormatString (MsgCurrentTrackImportComplete_L , sExtFile))
	Else
		SayMessage (OT_ERROR, MsgCurrentTrackImportError_L )
	EndIf
ElIf nChoice == 3 Then
	Let nNumberOfTracks = IniReadInteger(sTrackName, TrackCountPrefix, 0, sExtFile)
	If nNumberOfTracks > 0 Then
		Let i = 1
		Let nOk = true
		While(nOk && i<=nNumberOfTracks)
			Let sTrackName = IniReadString(TrackListSection, TrackNamePrefix+IntToString(i), cscNull, sExtFile)
			Let nOk = CopyTimeMarkersForATrack(sTrackName, sExtFile, TimeMarkerFile)
	Let i = i+1
		EndWhile
		If nOk
		&& i>nNumberOfTracks Then
			SayMessage (OT_STATUS, FormatString (MsgImportAllTimeMarkersComplete_L, IntToString( nNumberOfTracks), sExtFile))
		Else
			SayMessage (OT_ERROR, FormatString (MsgImportAllTimeMarkersError_L, IntToString(nNumberOfTracks), sExtFile))
		EndIf
	Else
	SayMessage (OT_STATUS, FormatString (MsgImportAllTracksVoid_L , sExtFile))
	EndIf
EndIf
EndScript

Script MinimiseWinamp ()
Var
	String sVersion,
	Int nMajor,
	Int nMinor,
	Int nHasCommand
TypeKey (ksMinimiseWinamp)
If !IsStandardWinampWindow() Then
	Return
endIf
	Let sVersion = GetVersionInfoString(GetAppFilePath(), csProductVersion)
Let nMajor = StringToInt(StringSegment(sVersion, cscPeriod, 1))
Let nMinor = StringToInt(StringSegment(sVersion, cscPeriod, 2))
Let nMajor = 1000*nMajor + nMinor
Let nHasCommand = (nMajor>=2090)
If !nHasCommand Then
	SayMessage (OT_ERROR, WinampNotAvailableInThisVersion)
EndIf
EndScript

String Function IntTimeToString (Int iTime)
Var
	Int iMinute,
	Int iSecond,
	String sTimeSign,
	String sTimeMinute,
	String sTimeSecond,
	String sTime
If iTime < 0 Then
	Let iTime = 0 - iTime
	Let sTimeSign = cscMinus
EndIf
If iTime == 0 Then
	Let sTimeMinute = "0"
	Let sTimeSecond = "0"
Else
	Let iMinute = iTime / 60000
	Let sTimeMinute = IntToString(iMinute)
	Let iSecond = iTime % 60000
	Let iSecond = iSecond / 1000
	Let sTimeSecond = IntToString(iSecond)
EndIf
Return sTimeSign + sTimeMinute + cscColon + sTimeSecond
EndFunction

Script JumpToRelativeTime ()
Var
	Int iCurrentTime,
	Int iRelative,
	String sTime,
 	String sTimeMark,
	String sRelative,
	Handle hFocus,
	Int iOk
If !IsCoreWinampWindow()
|| MenusActive()
|| DialogActive()  Then
	SayMessage (OT_ERROR, MsgWinAmpFunctionNotAvailable_l)
	Return
EndIf
Let hFocus = GetFocus() ; save the current focus
If StringLeft(GetWinampTitle(), 6) != WinampWinamp  Then ; Is there a track ready?
	Let sTime=GetATrackTime (0)
	Let sRelative=IniReadString(SettingsSection, DefaultRelativeTimeKey, cscNull, TimeMarkerFile)
	Let iOk = InputBox(WinampRelativeTimePrompt, WinampRelativeTimeTitle, sRelative)
	SpeechOff()
	Delay(1)
	Pause()
	SpeechOn()
	If !iOk
	|| sRelative == cscNull Then
		SayMessage(OT_JAWS_MESSAGE, WinampCancelled, msgSilent)
		Return
	EndIf
	IniWriteString(SettingsSection, DefaultRelativeTimeKey, sRelative, TimeMarkerFile)
	Let iRelative = StringTimeToInt(sRelative)
	Let ICurrentTime = StringTimeToInt(sTime)
	Let iRelative = iRelative + iCurrentTime
	If iRelative < 0 Then
		Let iRelative = 0
	EndIf
	Let sTimeMark = IntTimeToString(iRelative)
	If IsNotPlaying() Then
		WinampPlay()
	EndIf
	Delay(1) ; give Winamp time to start playing the track, just in case it is not playing already
	WinampJumpToTime(sTimeMark)
	SpeechOff()
	Delay(1) ; Wait for screen to settle so an accurate window handle for the current focus can be retrieved
	If hFocus != GetFocus() Then ; does the current focus match the saved value?
		SetFocus(hFocus) ; no.  Return to saved focus
	EndIf
; The following delay prevents the current window title from being announced when the list dialog is closed.
	Delay(1)
	Pause()
	SpeechOn()
Else
	SayMessage (OT_ERROR, MsgNoTrackReady_L)
EndIf
EndScript

Script RepeatLastJumpToRelativeTime ()
Var
	Int iCurrentTime,
	Int iRelative,
	String sTime,
 	String sTimeMark,
	String sRelative,
	Handle hFocus,
	Int iOk
Let sRelative=IniReadString(SettingsSection, DefaultRelativeTimeKey, cscNull, TimeMarkerFile)
If !IsCoreWinampWindow()
|| MenusActive()
|| DialogActive()  Then
	SayMessage (OT_ERROR, MsgWinAmpFunctionNotAvailable_l)
	Return
EndIf
Let hFocus = GetFocus() ; save the current focus
If StringLeft(GetWinampTitle(), 6) != WinampWinamp  Then ; Is there a track ready?
	Let sTime=GetATrackTime (0)
	Let iRelative = StringTimeToInt(sRelative)
	Let ICurrentTime = StringTimeToInt(sTime)
	Let iRelative = iRelative + iCurrentTime
	If (iRelative < 0) Then
		Let iRelative = 0
	EndIf
	Let sTimeMark = IntTimeToString(iRelative)
	If IsNotPlaying() Then
		WinampPlay()
	EndIf
	Delay(1) ; give Winamp time to start playing the track, just in case it is not playing already
	WinampJumpToTime(sTimeMark)
	SpeechOff()
	Delay(1) ; Wait for screen to settle so an accurate window handle for the current focus can be retrieved
	If hFocus != GetFocus() Then ; does the current focus match the saved value?
		SetFocus(hFocus) ; no.  Return to saved focus
	EndIf
; The following delay prevents the current window title from being announced when the list dialog is closed.
	Delay(1)
	Pause()
	SpeechOn()
Else
	SayMessage (OT_ERROR, MsgNoTrackReady_L)
EndIf
EndScript

Script GotoWinampPreferences ()
Var
	String sTitle,
	Handle hWnd,
	Int i
If !DialogActive()
|| MenusActive()  Then
	TypeKey(ksGotoWinampPreferences) ;
	Return
EndIf
Let hWnd = GetWinampMainWindowHandle()
If !hWnd Then
	Return
EndIf
Let sTitle= GetWindowName(hWnd)
Let i = 0
While (sTitle != WinampPreferences && i<=LoopTrap)
  Let hWnd = GetPriorWindow(hWnd)
  Let sTitle = GetWindowName(hWnd)
  Let i = i + 1
EndWhile
If sTitle == WinampPreferences Then
	If IsWindowVisible(hWnd) Then
		SetFocus(hWnd)
		Return
	EndIf
EndIf
SetFocus(GetWinampMainWindowHandle())
EndScript

void function suppressHighlight()
let giWinampSuppressHighlight = scheduleFunction("unsuppressHighlight", 2)
endFunction

void function unsuppressHighlight()
if giWinampSuppressHighlight then
	unscheduleFunction(giWinampSuppressHighlight)
endIf
let giWinampSuppressHighlight = 0
endFunction

Void Function SayHighLightedText (handle hwnd, string buffer)
if GlobalMenuMode then
	if GetWindowSubtypeCode(hWnd) == wt_menu
	&& hwnd != GetCurrentWindow() then
		return
	EndIf
EndIf
if giWinampSuppressHighlight then
	return
endIf
if GetWindowClass(hWnd) == WinampPE then
	return
EndIf
SayHighLightedText(hwnd,buffer)
EndFunction

Void Function ProcessSpeechOnNewTextEvent(handle hFocus, Handle hWnd, String buffer, Int nAttributes, Int nTextColor,
	Int nBackgroundColor, Int nEcho, String sFrameName)
Var
	Int i
If IsCoreWinampWindow() Then
	Let i = CurrentTrackNumber()
	If i != WinampCurrentItem Then
		If gbShouldSpeakTrackTitle then
			SayMessage(OT_JAWS_MESSAGE, GetTrackName (0))
		EndIf
		If (WinampMagneticTracking) Then
			ScheduleFunction(fn_FindPlayingItem, 5)
		EndIf
		Let WinampCurrentItem = i
	EndIf
	return
EndIf
ProcessSpeechOnNewTextEvent(hFocus, hWnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

Script SayWindowTitle ()
Var
	String sText
If !IsSameScript() Then
	PerformScript SayWindowTitle()
	Return
EndIf
Let sText = GetWinampTitle()
SayMessage(ot_JAWS_Message, WinampVirtualiseTitle_L, WinampVirtualiseTitle_S)
UserBufferClear()
UserBufferAddText(sText)
UserBufferAddText(cScBufferNewLine)
UserBufferAddText (cMsgBuffExit)
UserBufferActivate()
JAWSTopOfFile ()
SayLine()
EndScript

Void Function UserBufferClose ()
If UserBufferIsActive() Then
	UserBufferDeactivate()
EndIf
EndFunction

Script  AltDownArrowPCCursor()
If  ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript SwapTrackWithNext()
EndScript

Script  AltUpArrowPCCursor()
If  ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript SwapWithPrevious()
EndScript

Script  PageUpPCCursor ()
If  ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript PlaylistPageUp()
EndScript

Script  PageDownPCCursor ()
If  ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript PlaylistPageDown()
EndScript

Script  HomePCCursor ()
If  ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript GotoTopOfPlayList()
EndScript

Script  EndPCCursor ()
If  ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript GotoBottomOfPlayList()
EndScript

Script  AltControlExtendedDownArrow ()
If  ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript MoveToPlayingItem()
EndScript

Script Undo ()
TypeCurrentScriptKey ()
If IsMainWinampWindow  ()
||  IsPlaylistEditorWindow  ()
&& !MenusActive () Then
; moving to first track in list, so return
	return
EndIf
SayFormattedMessage (OT_JAWS_MESSAGE, cmsg50_L); undo
EndScript

Void Function SetIEServerWindowFocus (handle hFocus)
Var
	string sClass
let sClass = GetWindowClass (hFocus)
If sClass == cwcIEServer   Then
	let giIEServerCreated = TRUE
	SetFocus (hFocus)
	Pause ()
	if GetJCFOption (OPT_VIRTUAL_PC_CURSOR)==0 then
		SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 1)
	EndIf
	EndIf
EndFunction

Void Function WindowCreatedEvent (handle hWindow, int nLeft, int nTop, int nRight, int nBottom)
SetIEServerWindowFocus  (hWindow)
WindowCreatedEvent (hWindow, nLeft, nTop, nRight, nBottom)
EndFunction

Void Function ProcessSayAppWindowOnFocusChange(handle AppWindow, handle FocusWindow)
var
	handle TopLevelWindow
let TopLevelWindow = GetTopLevelWindow(FocusWindow)
if TopLevelWindow != GlobalWinAmpPrevTopLevelWindow then
	let GlobalWinAmpPrevTopLevelWindow = TopLevelWindow
If IsWinAmpLibrary () then
		SwitchToConfiguration (Config_WinAmpLibrary )
	EndIf
	return
EndIf
ProcessSayAppWindowOnFocusChange(AppWindow, FocusWindow)
EndFunction

;** The scripts found below this text have been removed.
;**  in other words, they are no longer attached to any keystroke. However, they were
;**  not removed from this file for backwards compatibility.
;** scripts no longer used in JAWS 8.0:

    Function ShowWinampGeneralHelp()
PerformScript WinampGeneralHelp()
EndFunction

Void Function ShowHotkeyHelp()
PerformScript HotkeyHelp()
EndFunction
Void Function DebugAlert (String sAlertText)
If (WinampScriptsDebugMode) Then
	Beep()
	If (StringLength(sAlertText) == 0) Then
		Let sAlertText  = WinampDebugAlert
	EndIf
	SayUsingVoice(vctx_message, sAlertText, ot_debug)
EndIf
EndFunction

Script WinampMainMenu ()
{Alt+F}
EndScript


Script JumpToTime ()
var
  Handle hWnd,
  String TimeStamp
  SayCurrentScriptKeyLabel ()
  TypeCurrentScriptKey ()
  Delay (1)
  let hWnd = GetRealWindow (GetFocus ())
  If GetWindowName (hWnd) != WN_JumpToTime then
    Return
  EndIf
  let TimeStamp = StringSegment (GetTextInRect (GetWindowLeft (hWnd), GetWindowTop (hWnd), GetWindowRight (hWnd), GetWindowBottom (hWnd), 0, IgnoreColor, IgnoreColor, TRUE, FALSE), "\n", 4)
  Delay (1)
  SayMessage (OT_SCREEN_MESSAGE, TimeStamp)
EndScript

Script ToggleWinampScriptsDebugMode ()
Let WinampScriptsDebugMode = !WinampScriptsDebugMode
SayMessage(OT_JAWS_message, WinampDebugMode + cscSpace + WinampIs, msgSilent)
If (WinampScriptsDebugMode) Then
	Say(MsgOn, ot_help)
Else
	Say(MsgOff, ot_help)
EndIf
EndScript

int function ContractedBrailleInputAllowedNow ()
;We should not treat alphanumeric input in one of the WinAmp windows as translated braille:
if StringStartsWith(GetWindowClass(GetFocus()),WinampWindowClassPrefix )
	return false
endIf
return ContractedBrailleInputAllowedNow ()
EndFunction

void function SpeechOff()
giSpeechDisabledByWinampScripts = false
if !IsSpeechOff ()
	SpeechOff()
	giSpeechDisabledByWinampScripts = true
endIf
EndFunction

void function SpeechOn()
if giSpeechDisabledByWinampScripts
	SpeechOn()
	giSpeechDisabledByWinampScripts = false
endIf
EndFunction

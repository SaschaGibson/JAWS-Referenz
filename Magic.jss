; Copyright 1995-2015 by Freedom Scientific, Inc.
; Freedom Scientific script file containing MAGic functions used by the default scripts.
; see Magic Screen Magnification script files for the MAGic UI scripts.

Include "HJGlobal.jsh"
Include "HJConst.jsh"
Include "MagCodes.jsh"
Include "magic.jsh"
include "Common.jsm"
include "Magic.jsm"


void Function ScreenMagnifiedEvent(int bOn, int nLevel)
if gbAnnounceNewMagLevel then
	let gbAnnounceNewMagLevel = false
	say(GetMagLevelMessage(nLevel),ot_status)
EndIf
EndFunction

string function GetMagLevelMessage(int nMagLevel)
var
	int nLevelInt,
	int nLevelFrac
let nLevelInt = nMagLevel / 100
let nLevelFrac = nMagLevel % 100
if !nLevelFrac then
	return FormatString(msgMagnificationLevelAnnouncement,IntToString (nLevelInt))
else
	if !(nLevelFrac % 10)  then
		let nLevelFrac = nLevelFrac / 10
	endIf
	return FormatString(msgMagnificationLevelAnnouncementFractional,IntToString(nLevelInt),IntToString(nLevelFrac))
endIf
EndFunction

void Function PanningModeHook(string ScriptName, string FrameName)
IF ScriptName=="MagStartPanning" THEN
	Beep()
	Beep()
	return TRUE
ELIF ScriptName=="ExitPanningMode" THEN
	IF GetWindowsOS()==OS_WIN_NT THEN
		RemoveHook (HK_SCRIPT, "PanningModeHook")
		TrapKeys(FALSE)
	ENDIF
	return FALSE
ENDIF
; by returning  FALSE, a hook function can prevent a script from being run
return FALSE
EndFunction

VOID Function EnterPanningMode()
IF GetWindowsOS()==OS_WIN_NT THEN
	AddHook (HK_SCRIPT, "PanningModeHook")
	TrapKeys(TRUE)
ENDIF
EndFunction

string function ScreenEchoToggle(int iRetCurVal)
var
	int iEcho
if !iRetCurVal then
	ScreenEcho()
endIf
let iEcho = GetScreenEcho()
if iEcho == 0 then
	return cmsgScreenEchoNone
elif iEcho == 1 then
	return cmsg16_L
elif iEcho == 2 then
	return cmsg17_L
endIf
EndFunction

void Function MagNextMouseStyle(int nOption, int nKeyEvent)
var
	int nStyle
let nStyle = MagGetOption(nOption)
if nStyle == 6 then
	let nStyle = MouseStyleHidden
else
	let nStyle = nStyle + 1
endif
MagSendKeyEvent(nKeyEvent)
if nStyle == MouseStyleHidden then
	Say(cmsgMouseStyleHidden,OT_STATUS)
elif nStyle == MouseStyleWindowsStandard then
	Say(cmsgMouseStyleWindowsStandard,OT_STATUS)
elif nStyle == MouseStyleCrossHair then
	Say(cmsgMouseStyleCrossHair,OT_STATUS)
elif nStyle == MouseStyleCross then
	Say(cmsgMouseStyleCross,OT_STATUS)
elif nStyle == MouseStyleCircle then
	Say(cmsgMouseStyleCircle,OT_STATUS)
elif nStyle == MouseStyleOutlinedCircle then
	Say(cmsgMouseStyleOutlinedCircle,OT_STATUS)
elif nStyle == MouseStyleCircledCircle then
	Say(cmsgMouseStyleCircledCircle,OT_STATUS)
endif
EndFunction

Int Function MagGetState()
if !FindTopLevelWindow (sc4, "") then
	return -1
endif
if !MagGetOption (MID_ON) then
	return 0
endif
return MagGetOption (MID_LEVEL)
EndFunction

int Function MagTrackCustomMenus(handle hWnd)
var
	int iType,
	int item,
	int nLeft,
	int nRight,
	int nTop,
	int nBottom;
if !MenusActive()
|| hWnd != GetFocus() then
	Return FALSE
EndIf
Let iType = GetObjectSubtypeCode (TRUE)
If iType == WT_MENU
|| iType == WT_STARTMENU
|| iType == WT_CONTEXTMENU
|| iType == WT_LISTVIEW
|| iType == WT_LISTVIEWITEM then
	Return FALSE
EndIf
Let Item = GetWindowRect (hWnd,nLeft,nRight,nTop,nBottom)
If (nLeft && nRight && nTop && nBottom) then
	Return MagSetFocusToRect (nLeft,nRight,nTop,nBottom)
EndIf
Return FALSE;
EndFunction

int function QuickViewFramesUnsupported()
if MultiMonEnabled() then
	SayMessage(ot_error,cmsgFramesNotSupportedInMultiMonitorMode_L,cmsgNotSupportedInMultiMonitorMode_S)
	return true
EndIf
if IsWin9x() then
	return true
EndIf
return false
EndFunction

int function JumpMouseToDisplayValid()
var
	int nMagState
; Check that we are able to jump to displays
if (! MultiMonEnabled() || MultiMonGetDisplayCount() <= 1) then
	sayMessage(OT_ERROR,cmsgJumpingRequiresMultiMon_L,cmsgJumpingRequiresMultiMon_S)
	return FALSE
endIf
let nMagState = MagGetState()
if !nMagState then
	sayMessage(OT_ERROR,cmsgJumpingRequiresMag_L,cmsgJumpingRequiresMag_S)
	return FALSE
endIf
return TRUE
EndFunction

void function ToggleDisplay(int iDirection)
var
	int CurrentDisplay,
	int PrimaryDisplay,
	int NewDisplay
; Check that we are able to jump to displays
if (False == JumpMouseToDisplayValid()) then
	return
endIf
let CurrentDisplay = MultiMonGetActiveDisplay()
let PrimaryDisplay = MultiMonGetPrimaryDisplay()
let NewDisplay = MultiMonGetDisplay(CurrentDisplay, iDirection)
If (0 == CurrentDisplay || 0 == PrimaryDisplay || 0 == NewDisplay)
then
	return
EndIf
MultiMonSetActiveDisplay(NewDisplay)
If (NewDisplay == PrimaryDisplay) then
	Say(cmsgPrimaryDisplay, ot_status)
else
	Say(cmsgExtendedDisplay, ot_status)
EndIf
EndFunction

string Function IndicateCapByToggle(int iRetCurVal)
var
	int iIndicateCapsBy
;The default.jcf IndicateCapsBy option supersedes the default.jcf
;IndicateCaps option.  Therefore, if IndicateCapsBy is 0
;(no indication), it does not matter what IndicateCaps is set to.
;The work to actually change IndicateCapsBy is done in MAGic
;through the MagSendKeyEvent call.  Do not use SetJCFOption as
;this will only change the value in memory and not write it to the
;JCF file.
let iIndicateCapsBy = getJCFOption(OPT_INDICATE_CAPS_BY)
if !iRetCurVal then
	MagSendKeyEvent(KI_INDICATE_CAPS_BY_TOGGLE)
	if iIndicateCapsBy == 2 then
		; Switch to No Indication.
		let iIndicateCapsBy = 0
	else
		; Switch to Pitch Increment (1) or Say Cap (2).
		let iIndicateCapsBy = iIndicateCapsBy + 1
	endIf
endIf
if iIndicateCapsBy == 0 then
	return cmsgIndicateCapByNoIndication
elif iIndicateCapsBy == 1 then
	return cmsgIndicateCapByPitchIncrement
elif iIndicateCapsBy == 2 then
	return cmsgIndicateCapBySayCap
endIf
EndFunction

string function ToggleView(int iRetCurVal, int iDirection)
Var
	Int iView
if (MultiMonEnabled()) then
	return cmsgMultiMonVFull
endIf
let iView = MagGetMagnifiedView()
if !iRetCurVal then
	if iDirection == Cycle_Next then
		If iView == MV_LAST_VIEW  Then
			let iView = MV_FULL
		Else
			let iView = iView+1
		endIf
	ElIf iDirection == Cycle_Prior then
		If iView == MV_FULL Then
			let iView = MV_LAST_VIEW
		Else
			let iView = iView-1
		endIf
	EndIf
	MagSetMagnifiedView(iView)
endIf
if iView == MV_FULL then
	return cmsgMVFull
ElIf iView == MV_SPLIT then
	return cmsgMVSplit
ElIf iView == MV_OVERLAY then
	return cmsgMVOverlay
ElIf iView == MV_LENS then
	Return cmsgMVLens
ElIf iView == MV_DYNAMIC_LENS then
	return cmsgMVDynamicLens
ElIf iView == MV_TEXTVIEWER then
	return cmsgMVTextViewer
EndIf
EndFunction

int  function IsMAGicRunningWithJAWS()
var
	int iMode
let iMode = GetJAWSMode()
return iMode == jawsMode_Full || iMode == jawsMode_Tray
EndFunction

void function ToggleTracking()
Var
	Int bOn
if MagSendKeyEvent (KI_TRACK_TOGGLE) == mske_toggle_on then
	Say(cmsgTrackingOn,ot_status)
Else
	Say(cmsgTrackingOff,ot_status)
EndIf
EndFunction

void function LocatorToggle()
var
	int bOn
let bOn = MagGetOption(LOC_ON)
if bOn then
	ToggleLocatorMode(1)
	Say(cmsgLocatorsOff,OT_STATUS)
else
	ToggleLocatorMode()
	Say(cmsgLocatorsOn,OT_STATUS)
EndIf
EndFunction

Script TextViewer ()
sayMessage (OT_MESSAGE, cmsgNewFeatureTextViewer)
endScript

script SelectAndSay ()
sayMessage (OT_MESSAGE, cmsgNewFeatureSelectAndSay)
endScript

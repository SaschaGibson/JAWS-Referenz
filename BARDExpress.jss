; Copyright 2021 - 2024 Freedom Scientific, Inc.
; JAWS Script file for BARD Express.
;
; [BARD Express](https://www.loc.gov/nls/braille-audio-reading-materials/bard-access/welcome-to-bard-express/)
; is an application developed by The National Library Service for the Blind and Print Disabled (NLS) to provide
; NLS patrons with an easy way to access [BARD](https://nlsbard.loc.gov), the Braille and Audio Reading
; Download service provided by NLS.

include "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "BARDExpress.JSM"

const
	WindowsFormsListViewObjStateChangedEventDelay = 150,
; Window classes.
	wcButtonClass = "WindowsForms10.BUTTON.app",
; Automation ID's
	AutomationID_playerWindow = "Form2",
	AutomationID_playButton = "playButton",
	AutomationID_SpeedButton = "adjustmentTargetButton",
	AutomationID_toneButton = "unknown", ; To be filled in once BARD Express has tone control added to the player.
	AutomationID_NavModeButton = "jumpUnitButton",
	AutomationID_cancelButton = "cancelButton",
	AutomationID_searchWindow = "SearchControl",
	AutomationID_findDialog = "FindDialog",
	AutomationID_PlayerMenu = "bardExpressPlayerMenu"

globals
	int g_IgnoreWindowsFormsListViewObjStateChangedEventUntil,
	int g_iToneMenuExpanded,
	int g_iSpeedMenuExpanded


void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if (GetTickCount() < g_IgnoreWindowsFormsListViewObjStateChangedEventUntil && IsWindowsFormsListView(hObj))
	return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
if GetObjectAutomationID() == AutomationID_PlayerMenu
	IndicateControlType (WT_BUTTON, GetObjectName())
	return
endIf
SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
EndFunction

Void Function MenuModeEvent (handle WinHandle, int mode)
; do not announce BARD menus
EndFunction

int function IsWindowsFormsListView(optional handle window)
if (!window)
	window = GetFocus()
endIf
var string windowClass = GetWindowClass(window)
return (StringStartsWith(windowClass, cWc_Winforms) && StringContains(windowClass, cWcListView) > 0)
EndFunction

void function UpdateIgnoreWindowsFormsListViewObjStateChangedEventUntil()
g_IgnoreWindowsFormsListViewObjStateChangedEventUntil = GetTickCount() + WindowsFormsListViewObjStateChangedEventDelay
EndFunction

void function SayLine()
if GetObjectAutomationID() == AutomationID_PlayerMenu
	IndicateControlType (WT_BUTTON, GetObjectName())
	return
endIf
SayLine()
EndFunction

Function IsOnSpeedControl ()
return GetObjectAutomationID() == AutomationID_speedButton
EndFunction

; This next function does not apply to this release of BARD Express since the Tone Control is not included. Once the tone control functionality is included, we will know if the control will have a unique automationID to use. Currently put in a dummy automationID.
int function IsOnToneControl()
return GetObjectAutomationID() == AutomationID_toneButton
EndFunction

int function IsOnNavOptionsButton()
return GetObjectAutomationID() == AutomationID_navModeButton
EndFunction

int function IsOnPlayButton()
return GetObjectAutomationID() == AutomationID_playButton
EndFunction

int function IsSpeedControlExpanded()
return g_iSpeedMenuExpanded
EndFunction

int function IsToneControlExpanded()
return g_iToneMenuExpanded
EndFunction

void Function ToggleToneControl()
if ! g_iToneMenuExpanded
	g_iToneMenuExpanded = True
else
	g_iToneMenuExpanded = False
EndIf
EndFunction

void Function ToggleSpeedControl()
if ! g_iSpeedMenuExpanded
	g_iSpeedMenuExpanded = True
else
	g_iSpeedMenuExpanded = False
EndIf
EndFunction

; HandleControl function is for providing custom tutor messages based on the state of the speed, tone and navigation option controls.
string Function HandleControls ()
if IsOnSpeedControl()
	if IsSpeedControlExpanded()
		return msgCustomSpeedTutor
	Else
		return msgCustomButtonTutor
	EndIf
ElIf IsOnToneControl()
	if IsToneControlExpanded()
		return msgCustomToneTutor
	Else
		return msgCustomButtonTutor
	EndIf
ElIf IsOnNavOptionsButton()
	return msgNavigationModesTutor
ElIf IsOnPlayButton()
	return msgCustomPlayButtonTutor
elIf GetObjectAutomationID() == AutomationID_PlayerMenu
	return msgCustomButtonTutor
ElIf ! IsOnSpeedControl() && ! IsOnToneControl() && StringContains(GetWindowClass(GetFocus()), wcButtonClass)
	return msgCustomButtonTutor
EndIf
EndFunction

string function GetCustomTutorMessage()
if GetObjectAutomationID(1) == AutomationID_playerWindow
	return HandleControls()
ElIf StringContains(GetWindowClass(GetFocus()), wcButtonClass)
	return msgCustomButtonTutor
EndIf
return cscNull
EndFunction

script ScriptFileName()
ScriptAndAppNames(GetActiveConfiguration())
endScript

Script SayNextLine()
UpdateIgnoreWindowsFormsListViewObjStateChangedEventUntil()
PerformScript SayNextLine()
endScript

Script SayPriorLine()
UpdateIgnoreWindowsFormsListViewObjStateChangedEventUntil()
PerformScript SayPriorLine()
endScript

Script Enter ()
; We need to check if the user is in the player window and if they are located on the cancel button for either speed or tone. The variable that is set for expanding and collapsing the speed and tone controls must be toggled if the user cancels either by pressing Enter on Cancel or presses Escape without making changes.
; Had to put this functionality in the Enter key because Spacebar seems to be reserved for playing audio at all times when player is active regardless of which control has the current focus.
if GetObjectAutomationID(1) == AutomationID_playerWindow
	if GetObjectAutomationID() == AutomationID_cancelButton && IsSpeedControlExpanded()
		ToggleSpeedControl()
	ElIf GetObjectAutomationID() == AutomationID_cancelButton && IsToneControlExpanded()
		ToggleToneControl()
	ElIf IsOnSpeedControl()
		ToggleSpeedControl()
	ElIf IsOnToneControl()
		ToggleToneControl()
	EndIf
EndIf
PerformScript Enter()
EndScript

Script UpALevel ()
if IsOnSpeedControl() && IsSpeedControlExpanded()
	ToggleSpeedControl()
ElIf IsOnToneControl() && IsToneControlExpanded()
	ToggleToneControl()
EndIf
PerformScript UpALevel()
EndScript

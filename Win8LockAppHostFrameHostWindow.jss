;Copyright 2015-2022 Freedom Scientific, Inc.
;Freedom Scientific script file for Windows 10 lock screen

include "hjConst.jsh"
include "hjGlobal.jsh"
include "locale.jsh"
include "UIA.jsh"
include "common.jsm"
import "touch.jsd"
import "uia.jsd"
include "Win8LockAppHostFrameHostWindow.jsm"

const
;Codes returned by function GetLockScreenFocusStatus:
	LockScreen_KeyboardFocusOther = 0, ;Unable to determine if lock screen has keyboard focus, or the user buffer may be receiving the keyboard input
	LockScreen_HasKeyboardFocus = 1,  ;HasKeyboardFocus is true
	LockScreen_NoKeyboardFocus = 2,  ;HasKeyboardFocus is false
;UIA consts:
	AutomationID_LockContainer = "LockContainer",  ;For the lock screen pane
	AutomationID_LockScreen = "InvokableLockContentControl",
	AutomationID_TitleHotspot = "titleHotspot",  ;for the title hotspot on the start screen
	AutomationID_Time = "Time",  ;For the time badge on the lock screen
	ClassName_LockAppHostFrameWindow = "LockAppHostFrameWindow"  ;The child pane of the root

globals
	int BRL_Messages_Setting,  ;saved setting before temporarily forcing to show flash messages
	object gUIA_LockScreen,  ;the FSUIA object for the locked screen app
	object gUIA_LockScreen_TreeWalker,  ;treewalker traverses the structure in the SayAll callback function
	object gUIA_LockScreenWindowElement  ;The UIA element which is the window for the lock screen


void function AutoStartEvent()
InitLockScreenWindowElement()
EndFunction

void function AutoFinishEvent()
gUIA_LockScreenWindowElement = Null()
EndFunction

void function InitLockScreenWindowElement()
;The window element can be used to determine whether or not the lock screen has focus,
;so we keep it alive for the duration of the app.
if gUIA_LockScreenWindowElement return endIf
var
	object oUIA,
	object treeWalker,
	object condition,
	object element
oUIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
treeWalker = oUIA.CreateTreeWalker(oUIA.CreateRawViewCondition())
treeWalker.currentElement = oUIA.GetRootElement()
condition = oUIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId,ClassName_LockAppHostFrameWindow )
element = FSUIAGetElementFromHandle(GetAppMainWindow (GetFocus ()))
if !element return endIf
treeWalker.currentElement = element
condition = oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_WindowControlTypeId)
element = treeWalker.currentElement.FindFirst(TreeScope_Descendants,condition)
if !element return endIf
gUIA_LockScreenWindowElement = element
EndFunction

int function GetLockScreenFocusStatus()
InitLockScreenWindowElement()
if !gUIA_LockScreenWindowElement
|| UserBufferIsActive()
|| InHJDialog()
	return LockScreen_KeyboardFocusOther
endIf
if gUIA_LockScreenWindowElement.hasKeyboardFocus
	return LockScreen_HasKeyboardFocus
else
	return LockScreen_NoKeyboardFocus
endIf
EndFunction

int function OnLockScreenPane()
return GetObjectSubtypeCode() == wt_dialog_page
	&& !GetObjectName()
	&& !UserBufferIsActive()
EndFunction

int function SetupBeforeSpeakingLockScreen()
gUIA_LockScreen = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !gUIA_LockScreen return false endIf
var object condition = gUIA_LockScreen.CreateIntPropertyCondition(UIA_ProcessIdPropertyId, gUIA_LockScreen.GetFocusedElement().ProcessID )
gUIA_LockScreen_TreeWalker = gUIA_LockScreen.CreateTreeWalker(condition)
if !gUIA_LockScreen_TreeWalker
	gUIA_LockScreen = Null()
	return false
endIf
;Ensure that braille messages will be flashed, reset in function ClearAfterSpeakingLockScreen
BRL_Messages_Setting = GetJCFOption(OPT_BRL_MESSAGES)
setJCFOption(OPT_BRL_MESSAGES,1)
return true
EndFunction

void function ClearAfterSpeakingLockScreen()
if !gUIA_LockScreen return endIf
gUIA_LockScreen = Null()
gUIA_LockScreen_TreeWalker = Null()
setJCFOption(OPT_BRL_MESSAGES,BRL_Messages_Setting)
EndFunction

void function SayAllLockScreenTextCallback()
;Only queue this function for elements with text.
;queueing for all elements, regardless of whether they have text,
;will cause undesired delays when elements without text are queued.
var
	string text,
	string type,
	string state,
	string s
text = gUIA_LockScreen_TreeWalker.currentElement.name
if text
	if gUIA_LockScreen_TreeWalker.currentElement.automationID == AutomationID_Time
		text = StringReplaceChars(text, MakeCharacterFromValue(0x2236),GetSystemLocaleInfo(LOCALE_STIME))
	endIf
	if gUIA_LockScreen_TreeWalker.currentElement.controlType != UIA_TextControlTypeId
		type = gUIA_LockScreen_TreeWalker.currentElement.localizedControlType
	endIf
	state = GetExpandCollapseString( gUIA_LockScreen_TreeWalker.currentElement)
	s = GetToggleString(gUIA_LockScreen_TreeWalker.currentElement)
	if s state = state+cscSpace+s endIf
	BrailleMessage(text+cscSpace+type+cscSpace+state)
	PlaySound(FindJAWSSoundFile("click2.wav"))
	Delay(2)
	Say(text,ot_control_name)
	if type Say(type,ot_control_type) endIf
	if state Say(state,ot_item_state) endIf
endIf
while gUIA_LockScreen_TreeWalker.GoToNextSibling()
	if gUIA_LockScreen_TreeWalker.currentElement.name
		QueueFunction("SayAllLockScreenTextCallBack()")
		return
	endIf
endWhile
if ShouldItemSpeak(ot_tutor)
	QueueFunction("SayLockScreenPaneTutorMessage()")
EndIf
EndFunction

void function SayAllLockScreenText()
if !SetupBeforeSpeakingLockScreen() return endIf
var object condition = gUIA_LockScreen.CreateStringPropertyCondition(UIA_AutomationIdPropertyId,AutomationID_LockContainer)
if !condition return endIf
gUIA_LockScreen_TreeWalker.currentElement = gUIA_LockScreen.GetRootElement()
gUIA_LockScreen_TreeWalker.gotoFirstChild()
gUIA_LockScreen_TreeWalker.currentElement = gUIA_LockScreen_TreeWalker.currentElement.FindFirst(TreeScope_Descendants,condition)
if gUIA_LockScreen_TreeWalker.currentElement.name
&& gUIA_LockScreen_TreeWalker.currentElement.controlType == UIA_PaneControlTypeId
	Say(gUIA_LockScreen_TreeWalker.currentElement.name,ot_dialog_name)
	Say(gUIA_LockScreen_TreeWalker.currentElement.localizedControlType,ot_control_type)
endIf
if !gUIA_LockScreen_TreeWalker.gotoFirstChild() return endIf
SayAllLockScreenTextCallBack()
EndFunction

void function SayLockScreenPaneTutorMessage()
if GetLastInputSource() != InputSource_Touch
	if OnLockScreenPane()
		Say(msg_tutor_LockScreen,ot_tutor)
		return
	endIf
endIf
EndFunction

void function SayObjectTypeAndText(optional int level, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(level,includeContainerName) return endIf
if level == 1
&& GetObjectName(1) == GetObjectName(0)
	return
elif level == 0
&& OnLockScreenPane()
	SayAllLockScreenText()
	return
EndIf
SayObjectTypeAndText(level,includeContainerName)
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if GetLockScreenFocusStatus() == LockScreen_NoKeyboardFocus
	;Do not announce focus change which happens when lock screen goes out of focus:
	return
endIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
EndFunction

void function SayLockScreenWindowTitle()
InitLockScreenWindowElement()
if !gUIA_LockScreenWindowElement return endIf
if gUIA_LockScreenWindowElement.name
	Say(gUIA_LockScreenWindowElement.name,ot_dialog_name)
endIf
EndFunction

int function BrailleCallbackObjectIdentify()
if GetLockScreenFocusStatus() == LockScreen_HasKeyboardFocus
&& OnLockScreenPane()
	return wt_static
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectValue(int nSubtype)
if nSubtype == wt_static
	if OnLockScreenPane()
	&& gUIA_LockScreenWindowElement.name
		BrailleAddString(gUIA_LockScreenWindowElement.name,0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectValue(nSubtype)
EndFunction

script SayLine()
if GetLockScreenFocusStatus() == LockScreen_NoKeyboardFocus
	Say(msgMustAltTabToFocusOnLockScreen,ot_help)
	return
elif OnLockScreenPane()
	SayLockScreenWindowTitle()
	return
endIf
PerformScript SayLine()
EndScript

script Tab()
if GetLockScreenFocusStatus() == LockScreen_NoKeyboardFocus
	Say(msgMustAltTabToFocusOnLockScreen,ot_help)
	return
endIf
PerformScript Tab()
EndScript

Script ReadBoxInTabOrder()
if GetLockScreenFocusStatus() == LockScreen_NoKeyboardFocus
	Say(msgMustAltTabToFocusOnLockScreen,ot_help)
	return
endIf
SayAllLockScreenText()
EndScript

script UpALevel()
if GetLockScreenFocusStatus() == LockScreen_NoKeyboardFocus
	Say(msgMustAltTabToFocusOnLockScreen,ot_help)
	return
endIf
PerformScript UpALevel()
EndScript

Script SayWindowTitle()
if GetLockScreenFocusStatus() == LockScreen_NoKeyboardFocus
	Say(msgMustAltTabToFocusOnLockScreen,ot_help)
	return
endIf
PerformScript SayWindowTitle()
EndScript

script SayWindowPromptAndText()
if GetLockScreenFocusStatus() == LockScreen_NoKeyboardFocus
	Say(msgMustAltTabToFocusOnLockScreen,ot_help)
	return
endIf
PerformScript SayWindowPromptAndText()
EndScript

script ScriptFileName()
ScriptAndAppNames(cmsgWindowsLockScreenAppName)
EndScript

script ObjectNavigateToParent()
if TouchCursorObject ().AutomationID == AutomationID_LockScreen
	TouchNavigationBoundaryEvent(TouchNavigate_Parent)
	return
endIf
UIAGoTo(TouchNavigate_Parent)
EndScript

void function TouchMoveToFirstElementInProcessID()
CreateUIAObject()
if !g_UIATreeWalker return EndIf
var object condition = g_UIA.CreateIntPropertyCondition( UIA_ProcessIdPropertyId, g_UIATreeWalker.currentElement.processID)
var object treeWalker = g_UIA.CreateTreeWalker(condition)
if !treeWalker return endIf
treeWalker.currentElement = g_UIATreeWalker.currentElement
UIAGoToFirstInTree(treeWalker)
treeWalker.gotoFirstChild()
g_UIATreeWalker.currentElement = treeWalker.currentElement
ShowAndSayItemAtTouchCursor()
EndFunction

void function TouchMoveToFirstElement()
TouchMoveToFirstElementInProcessID()
EndFunction

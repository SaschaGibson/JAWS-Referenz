;Copyright 1995-2016 Freedom Scientific, Inc.
;Freedom Scientific default script file for touch and object navigation.

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "MSAAConst.jsh"
include "common.jsm"
include "touch.jsh"
include "touch.jsm"
include "ie.jsm"
import "UIA.jsd"
import "say.jsd"
import "FileIO.jsd"


globals
	collection g_UIAControlTypeStringToInt,
	collection g_UIAControlTypeIntToString,
	int g_touchExploring,
	collection g_DefaultUIAConditionSettings,
	collection gc_ObjectNavConfigCachedInfo,
		; members are:
		;
		; automatic -- The collection containing information about the configuration setting for automatic touch cursor activation.
		;		Keys of this collection are configuration names,
		;		and their values are the setting for automatic touch cursor activation for the configuration name.
		; currentConfig -- The name of the current configuration, which is used as a key to the automatic collection member.
		; currentNavState -- One of the ObjectNavigation constants, which is the current touch cursor mode or state.
		; savedNavState -- The saved touch cursor mode or state, used when restoring or reactivating the touch cursor.
		; defaultNavMode -- The default mode, advanced or non-advanced, for touch cursor navigation.
	int g_SavedSetting_OPT_VIRT_VIEWER,
	object g_SuspendedNavigationLocation

const
	UIAControlTypesArraySize = 39,
;possible states of touch or object navigation:
	ObjectNavigation_Off = 0,
	ObjectNavigation_Touch = 1,
	ObjectNavigation_Advanced = 2,
	ObjectNavigation_TextReview = 4,
	ObjectNavigation_Suspended = 8,
;When retrieving UIA state information with function GetUIAStateString,
;we may not always want all the state strings returned.
;If so, use the following flags to configure the state string returned by function GetUIAStateString:
	GetStateString_ExpandCollapse = 0x0001,
	GetStateString_Toggle = 0x0002,
	GetStateString_SelectedState = 0x0004,
	GetStateString_IsReadOnly = 0x0008,
	GetStateString_IsPassword = 0x0010,
	GetStateString_Orientation = 0x0020,
	GetStateString_IsRequired = 0x0040,
	GetStateString_IsDataValid = 0x0080,
	GetStateString_IsDisabled = 0x0100,
	GetStateString_AllStates = 0xffff ;this is the default set of states returned by GetUIAStateString

;we need to know when text review mode is changing from activated to deactivated and vice versa:
const
	Mode_NotTransitioning = 0,
	Mode_TransitioningToActivated = 1,
	Mode_TransitioningToDeactivated = 2
globals
	int g_ObjectTextReviewMode_TransitionState

;for UIA gesture or object nav events:
const
	UIAEventFunctionNamePrefix = "UIAEvent_"
globals
	object g_UIAFocusChangedEventObject,
	object g_UIAMenuOpenedEventObject,
	int gb_ListeningForContextMenuOpen

;for touch explore of empty screen areas or elements with a text range:
const
	; EmptyScreenAreaSoundInterval is how often for each firing of the TouchExplore function
	; a sound will be played when touching an empty area of the screen.
	; Set to 0 if the sound should play for every firing of TouchExplore,
	; otherwise the interval indicates the number of times that TouchExplore will fire without playing the sound
	; for each one time that it fires and plays the sound.
		EmptyScreenAreaSoundInterval = 6
globals
	; c_ExploreArea is used during exploration:
	collection c_ExploreArea
		; Members are:
		;
		; prevRange -- Is saved to compare against the current range during touch exploration
		;		to determine when a range changes.
		; emptyIteration -- Is a counter Used to determine if a sound should be played
		;		for the current firing of TouchExplore on an empty area of the screen.
		; x -- The X touch point,
		;		so that split taps, which receive no coordinates, can determine the explore location.
		;		Also used for OSM rect implementation of touch.
		; y -- The Y touch point,
		;		so that split taps, which receive no coordinates, can determine the explore location.
		;		Also used for OSM rect implementation of touch.
		; isBlank -- True if the current element comprises an empty area of the screen.
		; prevExploreElement -- The location of the last element during exploration,
		;		which is maintained separately from g_UIATreeWalker.currentElement.
		;
		; The following members support OSM methods for retrieving the line where UIA does not support individual elements or text patterns:
		; OSMRectLeft -- The left edge of the OSM rectangle.
		; OSMRectTop -- The top edge of the OSM rectangle.
		; OSMRectRight -- The right edge of the OSM rectangle.
		; OSMRectBottom -- The bottom edge of the OSM rectangle.
		; OSMPrevX -- the previous x touch location within an OSM rectangle.
		; OsmPrevY -- the previous y touch location within an OSM rectangle.
		
;TouchNavigationBoundaryEvent uses the TouchNavigate_ constants from HJConst.jsh,
;and the following additional navigation types to determine the appropriate messages for navigation failure:
const
	TouchNavigate_NextElement = 101,
	TouchNavigate_PriorElement = 102,
	TouchNavigate_NextElementOfType = 103,
	TouchNavigate_PriorElementOfType = 104

;for supporting the announcement of and navigation by aria roles or element properties:
const
	uiaAriaRolesTypeText = "|banner|document|group|heading|region|"
	
;for braille:
const
	UIABrlArrayIndexOffsetFromControlType = 49999
globals
	IntArray g_UIABrlControlTypes

;for user-friendly or localized names of gestures:
globals
	collection GestureLabel

;Gesture modes are for managing the actions performed by gestures on touch devices:
globals
	collection GestureMode
		; Members:
		; current -- the current gesture mode
		; saved -- save point used by functions RestoreGestureMode and SaveGestureMode
		;		Because The gesture mode is switched to text reading if the user buffer is activated,
		;		so we use save and restore to return the gesture mode to its previous setting when the user buffer exits.
		; selecting -- Indicates whether or not gestures are interpreted as selection when the gesture mode is text reading.
		; settingsHook -- Indicates whether or not the hook for settings mode has been set.
		;		True if the hook is active, false otherwise.
	

;Touch quick navigation keys:
;TouchQuickNavigationKeysEnabled determines whether quick navigation key map will load
;when touch or advanced object navigation maps load.
;TouchQuickNavigationKeysAreLoaded is used to determine whether the touch quick nav keys maps are currently loaded.
globals
	int TouchQuickNavigationKeysEnabled,
	int TouchQuickNavigationKeysAreLoaded

;for tabulating lists in messages:
const
	FourSpaces = "    "

;for use in properties with functions that allow specification of max,
;or with arrays where we want to limit output:
const
	TextRange_MaxLength_Properties_GetText = 1024,
	TableHeaders_List_MaxLength = 10

;for touch sounds:
globals
	int gb_UseTouchNavigationSounds,
	collection g_TouchNavigationSounds

globals
	object g_nullObject

;for managing the touch rotor:
const
	GNumOfFixedRotorElements = 8
globals
	int gbHasTemporaryRotorElement,
	int g_saved_touchQuickNavIndex

; Constantd and globals for the touch keyboard:
const
	; Enumeration of the type of gestures recognized by the function TryProcessTouchForVirtualKeyboard
		VKbd_Gesture_ExploreEnd = 1,
		VKbd_Gesture_SplitTap = 2,
		VKbd_Gesture_SplitDoubleTap = 3,
		VKbd_Gesture_TripleTap = 4,
	; Enumerations used for the results of GetJCFOption(OPT_TOUCH_KEYBOARD_NOTIFICATION):
		VKbd_AppearanceNotification_SpeechOnly = 0,
		VKbd_AppearanceNotification_SoundOnly = 1,
		VKbd_AppearanceNotification_BothSpeechAndSound = 2,
	; Enumerations used for c_VKbd_Settings member childPanelNotification:
		VKbd_ChildPanelNotification_MessageAndSound = 0,
		VKbd_ChildPanelNotification_SoundOnly = 1,
	; Enumerations used for c_VKbd_Settings member typingMode:
		VKbd_TypingMode_Standard = 0,
		VKbd_TypingMode_Touch = 1,
	; Enumerations used for c_VKbd_Settings member typingEcho:
		VKbd_TypingEcho_Off = 0,
		VKbd_TypingEcho_Characters = 1,
		VKbd_TypingEcho_Words = 2,
		VKbd_TypingEcho_Both = 3,
	; Enumerations used for c_VKbd_Setting member phonetics:
		VKbd_Phonetics_On = 1,
		VKbd_Phonetics_Off = 2,
	; Enumerations used for function ToggleChildPanelForCurrentVirtualKeyboardButton
		VKbd_ChildPanel_Toggle = 0,
		VKbd_ChildPanel_Show = 1,
		VKbd_ChildPanel_Hide = 2,
	; The time to wait while holding before making any announcements:
		VKbd_HoldPhoneticDelayTime = 1000, ;milliseconds to wait before announcing phonetic
		VKbd_HoldTutorMessageDelayTime = 1500, ;milliseconds to wait before announcing any tutor message, for keys with associated tutor messages
		VKbd_HoldExpandPanelDelayTime = 1500, ;milliseconds to wait before expanding child panel of keys
	; Enumerations used for c_VKbd_State member holdAction:
		VKbd_NotHolding = 0, ; not holding on a key during exploration
		VKbd_HoldAction_SayPhonetic = 1,  ; holding to announce character phonetic
		VKbd_HoldAction_ShowExtras = 2, ; holding to show panel of extra keys
		VKbd_HoldAction_SayTutorMessage = 3, ; holding to say tutor message, for shift keys
	; Enumerations used for c_VKDB_State member state
		VKbd_State_Inactive = 0, ; no exploration or hold activity in the virtual keyboard
		VKbd_State_FoundNewKey = 1, ; exploration has reached a new keyboard key, not yet holding
		VKbd_State_Holding = 2, ; holding on a key and waiting for action timer to expire
		VKbd_State_ShowingExtras = 3, ;the panel of extra keys is expanded and showing
		VKbd_State_Completed = 4, ; all actions are completed for the current keyboard button
	; UIA event name prefixes for events related to the virtual keyboard:
		UIA_VKBD_EventNamePrefix = "UIA_VKBD_"
globals
	int gb_TouchKeyboardVisible,
	object oUIA_VKBD, ;The FSUIA object for the touch keyboard
	object UIA_VKBD_InternalListener, ; listens for UIA events internal to the virtual keyboard
	;
	; c_VKbd_Window is for keyboard window notification management:
	collection c_VKbd_Window,
		; members:
		; processID -- The UIA process id of the touch keyboard window.
		; appWindow -- The UIA element which is the application window of the touch keyboard.
		;
	; c_VKBD_Settings stores option settings related to the virtual keyboard:
	collection c_VKBD_Settings,
		; Because the user may change settings at any time,
		; the settings for various options must be obtained at the start of each exploration of the keyboard.
		; Collection members obtain and hold these settings while exploring the screen.
		; members:
		; exploring -- Set to true at the start of each exploration.
		; typingMode -- One of the VKbd_TypingMode_ constants,
		;		indicating which typing mode is being used for the virtual keyboard.
		; typingEcho -- One of the VKbd_TypingEcho_ constants,
		;		indicating which typing echo is being used for the virtual keyboard.
		; phonetics -- one of the VKbd_Phonetics constants,
		;		indicating whether or not phonetic announcement is used for the virtual keyboard.
		; childPanelNotification -- One of the VKbd_childPanelNotification constants,
		;		indicating whether or not a spoken message occurs when the child panel opens.
		;
	; c_VKbd_State is used for the state of script processing of the virtual keyboard
	collection c_VKbd_State 
		; Used to manage script events for the virtual keyboard.
		; members:
		; onButton -- True if exploration is on a virtual keyboard button.
		; holdStart -- The tick count at which the hold started waiting to perform an action for a keyboard button.
		; holdAction -- One of the VKbd_HoldAction_ constants,
		;		indicating what action should happen at the end of the hold time for a keyboard button.
		; state -- One of the VKbd_State_ constants,
		;		indicating the state of activity for the current button.
		; prevSplitTappedChildButtonName -- When a button is split-tapped during exploration using the touch typing mode,
		;		the name of the button is saved to allow for comparison against the main keyboard button
		;		to ensure that the key is not clicked twice if explore ends without movement
		;		but is on the main keyboard button by the same name.

;for managing StopSeech:
;Call function BlockStopSpeechDuringExploration with a duration of time to schedule a wait before function UnblockStopSpeech will run.
;Use IsStopSpeechBlockedDuringExploration to test whether StopSpeech is currently being blocked.
globals
	int ScheduledUnblockSpeechDuringExploration, ;The id returned when scheduling the function UnblockStopSpeechDuringExploration.
	int StopSpeechDuringExplorationDisallowed ;The variable to be temporarily toggled on by BlockStopSpeechDuringExploration and then off again by UnblockStopSpeechDuringExploration.

;JAWS gesture support is different from MAGic gesture support.
;This global is set when touch is initialized, and may be tested with function IsUsingJAWSGestures:
globals
	int gbUsingJAWSGestures

;for scheduling announcement of gesture mode when script runs repeatedly:
globals
	int Scheduled_AnnounceCurrentGestureMode

;For detecting the most recently received gesture, saved in GestureEvent:
globals
	string MostRecentJAWSGestureName

;for detecting changes to the current touch cursor element:
const
	UIA_CurrentElementEventNamePrefix = "UIA_CurrentElement_"  ;prefix to event names which are used exclusively for the current touch cursor element
globals
	object UIA_CurrentElementListener  ;the FSUIA object used for attaching the events

;for exploration restriction:
const
	ExploreRestrict_None = 0,
	ExploreRestrict_Window = 1,
	ExploreRestrict_Control = 2
globals
	int ExploreRestrictionLevel,
	collection c_ExploreRestrictionRect
		; Contains the rectangle coordinates for the current exploration restriction level.
		;
		; Members are:
		; left -- The left coordinate of the rectangle.
		; top -- The top coordinate of the rectangle.
		; right -- The right coordinate of the rectangle.
		; bottom -- The bottom coordinate of the rectangle.


int function IsUsingJAWSGestures()
return gbUsingJAWSGestures
EndFunction

script ToggleUIADebugging()
g_UIADebugging = !g_UIADebugging
if g_UIADebugging then
	SayString(msgDebug_UIADebuggingOn)
else
	SayString(msgDebug_UIADebuggingOff)
EndIf
EndScript

void function TouchAutoStart()
CreateUIAObject()
SetUseTouchNavigationSounds(GetNonJCFOption(hKey_UseTouchNavigationSounds))
AutoStartSetTouchRotor(GetNonJCFOption(hKey_TouchRotorInitialType))
g_DefaultUIAConditionSettings = GetDefaultUIAConditionSettings()
gbUsingJAWSGestures = !(GetRunningFSProducts() & product_magic)
InitTouchNavigationConfigurations()
if gbUsingJAWSGestures
	InitGestureLabels()
	InitGestureMode()
	InitVirtualKeyboardSupport()
	c_ExploreArea = new collection
else
	ClearGestureLabels()
	ClearGestureMode()
	ClearVirtualKeyboardSupport()
	c_ExploreArea = Null()
endIf
EndFunction

void function ClearVirtualKeyboardSupport()
c_VKbd_Window = Null()
c_VKBD_Settings = Null()
c_VKbd_State = Null()
EndFunction

void function InitVirtualKeyboardSupport()
;touch input is only supported on Windows 8 and later:
if !IsWindows8() return endIf
c_VKbd_Window = new collection
c_VKBD_Settings = new collection
c_VKbd_State = new collection
SetVKBDStatusToInactive()
EndFunction

void function DisplayOrientationChangedEvent (int displayIndex, int numOfDisplays, int isPrimary, int orientation, int  isLandscape)
var
	string sOrientation,
	string sMsg
if isLandscape
	if ShouldItemSpeak(OT_STATUS) == message_long 
		if orientation == DMDO_90
			sOrientation = cmsgDisplayOrientation_landscape_HomeToLeft_L
		else
			sOrientation = cmsgDisplayOrientation_landscape_HomeToRight_L
		endIf
	else
		sOrientation = cmsgDisplayOrientation_landscape_S
	endIf
else
	if ShouldItemSpeak(OT_STATUS) == message_long 
		if orientation == DMDO_Default
			sOrientation = cmsgDisplayOrientation_Portrait_Normal_L
		else
			sOrientation = cmsgDisplayOrientation_Portrait_Flipped_L
		endIf
	else
		sOrientation = cmsgDisplayOrientation_portrait_S
	endIf
endIf
if NumOfDisplays == 1
	Say(sOrientation,ot_user_requested_information)
	return
endIf
if isPrimary
	Say(FormatString(cmsgPrimaryDisplayOrientation,sOrientation),ot_user_requested_information)
else
	Say(FormatString(cmsgIndexedDisplayOrientation,displayIndex,sOrientation),ot_user_requested_information)
endIf
EndFunction

void function TouchKeyboardStatusEvent(int visible, handle hWnd)
if !IsUsingJAWSGestures() return endIf
;Guard against announcing change if the status has not actually changed:
if visible == gb_TouchKeyboardVisible return endIf
gb_TouchKeyboardVisible = visible
var int notification = GetJCFOption(OPT_TOUCH_KEYBOARD_NOTIFICATION)
if !visible
	if notification != VKbd_AppearanceNotification_SoundOnly 
		SayUsingVoice(vctx_message,msgTouchKeyboardClosed,ot_message)
	endIf
	if notification != VKbd_AppearanceNotification_SpeechOnly 
		PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchKeyboardClosed))
	endIf
	oUIA_VKBD = Null()
	c_VKbd_Window.appWindow = Null()
	c_VKbd_Window.processID = 0
	return
endIf
;The keyboard is visible:
if notification != VKbd_AppearanceNotification_SoundOnly 
	SayUsingVoice(vctx_message,msgTouchKeyboardOpened,ot_message)
endIf
if notification != VKbd_AppearanceNotification_SpeechOnly 
	PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchKeyboardOpened))
endIf
oUIA_VKBD = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA_VKBD return endIf
var object condition = oUIA_VKBD.CreateAndCondition(
	oUIA_VKBD.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_WindowControlTypeId),
	oUIA_VKBD.CreateAndCondition(
		oUIA_VKBD.CreateStringPropertyCondition(UIA_ClassNamePropertyId,UIa_wc_IPTip_Main_Window),
		oUIA_VKBD.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,UIA_AutomationID_InputFrameWindow)))
if !condition return endIf
var object treeWalker = oUIA_VKBD.CreateTreeWalker(condition)
if !treeWalker return endIf
treeWalker.currentElement = oUIA_VKBD.GetRootElement()
treeWalker.gotoFirstChild()
c_VKbd_Window.appWindow = treeWalker.currentElement
c_VKbd_Window.processID = treeWalker.currentElement.processID
EndFunction

void function InitControlTypeHelperCollections()
if g_UIAControlTypeStringToInt || g_UIAControlTypeIntToString return EndIf

g_UIAControlTypeStringToInt = new collection
g_UIAControlTypeIntToString = new collection

g_UIAControlTypeStringToInt[ "UIA_ButtonControlTypeId" ] = UIA_ButtonControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_ButtonControlTypeId ) ] = "UIA_ButtonControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_CalendarControlTypeId" ] = UIA_CalendarControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_CalendarControlTypeId ) ] = "UIA_CalendarControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_CheckBoxControlTypeId" ] = UIA_CheckBoxControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_CheckBoxControlTypeId ) ] = "UIA_CheckBoxControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_ComboBoxControlTypeId" ] = UIA_ComboBoxControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_ComboBoxControlTypeId ) ] = "UIA_ComboBoxControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_CustomControlTypeId" ] = UIA_CustomControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_CustomControlTypeId ) ] = "UIA_CustomControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_DataGridControlTypeId" ] = UIA_DataGridControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_DataGridControlTypeId ) ] = "UIA_DataGridControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_DataItemControlTypeId" ] = UIA_DataItemControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_DataItemControlTypeId ) ] = "UIA_DataItemControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_DocumentControlTypeId" ] = UIA_DocumentControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_DocumentControlTypeId ) ] = "UIA_DocumentControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_EditControlTypeId" ] = UIA_EditControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_EditControlTypeId ) ] = "UIA_EditControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_GroupControlTypeId" ] = UIA_GroupControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_GroupControlTypeId ) ] = "UIA_GroupControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_HeaderControlTypeId" ] = UIA_HeaderControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_HeaderControlTypeId ) ] = "UIA_HeaderControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_HeaderItemControlTypeId" ] = UIA_HeaderItemControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_HeaderItemControlTypeId ) ] = "UIA_HeaderItemControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_HyperlinkControlTypeId" ] = UIA_HyperlinkControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_HyperlinkControlTypeId ) ] = "UIA_HyperlinkControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_ImageControlTypeId" ] = UIA_ImageControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_ImageControlTypeId ) ] = "UIA_ImageControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_ListControlTypeId" ] = UIA_ListControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_ListControlTypeId ) ] = "UIA_ListControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_ListItemControlTypeId" ] = UIA_ListItemControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_ListItemControlTypeId ) ] = "UIA_ListItemControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_MenuBarControlTypeId" ] = UIA_MenuBarControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_MenuBarControlTypeId ) ] = "UIA_MenuBarControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_MenuControlTypeId" ] = UIA_MenuControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_MenuControlTypeId ) ] = "UIA_MenuControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_MenuItemControlTypeId" ] = UIA_MenuItemControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_MenuItemControlTypeId ) ] = "UIA_MenuItemControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_PaneControlTypeId" ] = UIA_PaneControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_PaneControlTypeId ) ] = "UIA_PaneControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_ProgressBarControlTypeId" ] = UIA_ProgressBarControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_ProgressBarControlTypeId ) ] = "UIA_ProgressBarControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_RadioButtonControlTypeId" ] = UIA_RadioButtonControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_RadioButtonControlTypeId ) ] = "UIA_RadioButtonControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_ScrollBarControlTypeId" ] = UIA_ScrollBarControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_ScrollBarControlTypeId ) ] = "UIA_ScrollBarControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_SeparatorControlTypeId" ] = UIA_SeparatorControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_SeparatorControlTypeId ) ] = "UIA_SeparatorControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_SliderControlTypeId" ] = UIA_SliderControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_SliderControlTypeId ) ] = "UIA_SliderControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_SpinnerControlTypeId" ] = UIA_SpinnerControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_SpinnerControlTypeId ) ] = "UIA_SpinnerControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_SplitButtonControlTypeId" ] = UIA_SplitButtonControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_SplitButtonControlTypeId ) ] = "UIA_SplitButtonControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_StatusBarControlTypeId" ] = UIA_StatusBarControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_StatusBarControlTypeId ) ] = "UIA_StatusBarControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_TabControlTypeId" ] = UIA_TabControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_TabControlTypeId ) ] = "UIA_TabControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_TabItemControlTypeId" ] = UIA_TabItemControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_TabItemControlTypeId ) ] = "UIA_TabItemControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_TableControlTypeId" ] = UIA_TableControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_TableControlTypeId ) ] = "UIA_TableControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_TextControlTypeId" ] = UIA_TextControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_TextControlTypeId ) ] = "UIA_TextControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_ThumbControlTypeId" ] = UIA_ThumbControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_ThumbControlTypeId ) ] = "UIA_ThumbControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_TitleBarControlTypeId" ] = UIA_TitleBarControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_TitleBarControlTypeId ) ] = "UIA_TitleBarControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_ToolBarControlTypeId" ] = UIA_ToolBarControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_ToolBarControlTypeId ) ] = "UIA_ToolBarControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_ToolTipControlTypeId" ] = UIA_ToolTipControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_ToolTipControlTypeId ) ] = "UIA_ToolTipControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_TreeControlTypeId" ] = UIA_TreeControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_TreeControlTypeId ) ] = "UIA_TreeControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_TreeItemControlTypeId" ] = UIA_TreeItemControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_TreeItemControlTypeId ) ] = "UIA_TreeItemControlTypeId"
g_UIAControlTypeStringToInt[ "UIA_WindowControlTypeId" ] = UIA_WindowControlTypeId
g_UIAControlTypeIntToString[ IntToString( UIA_WindowControlTypeId ) ] = "UIA_WindowControlTypeId"
EndFunction

collection function InitFormControlQuickNavElements()
var collection formControls
formControls= new collection
formControls["UIA_ButtonControlTypeId"] = UIA_ButtonControlTypeId
formControls["UIA_CheckBoxControlTypeId"] = UIA_CheckBoxControlTypeId
formControls["UIA_ComboBoxControlTypeId"] = UIA_ComboBoxControlTypeId
formControls["UIA_EditControlTypeId"] = UIA_EditControlTypeId
formControls["UIA_ListControlTypeId"] = UIA_ListControlTypeId
formControls["UIA_MenuItemControlTypeId"] = UIA_MenuItemControlTypeId
formControls["UIA_RadioButtonControlTypeId"] = UIA_RadioButtonControlTypeId
formControls["UIA_SliderControlTypeId"] = UIA_SliderControlTypeId
formControls["UIA_SpinnerControlTypeId"] = UIA_SpinnerControlTypeId
formControls["UIA_SplitButtonControlTypeId"] = UIA_SplitButtonControlTypeId
formControls["UIA_TabItemControlTypeId"] = UIA_TabItemControlTypeId
formControls["UIA_TreeControlTypeId"] = UIA_TreeControlTypeId
return formControls
EndFunction

int function GetTouchNavRotorItemCount()
if !ArrayLength(g_touchQuickNavHashKeys) return 0 endIf
if gbHasTemporaryRotorElement
	return GNumOfFixedRotorElements+1
else
	return GNumOfFixedRotorElements
endIf
EndFunction

void function EnsureRotorQuickNavAllocation(int NumOfRotorElements)
if !g_touchQuickNavHashKeys
|| ArrayLength(g_touchQuickNavHashKeys) != NumOfRotorElements
	g_touchQuickNavHashKeys = new StringArray[numOfRotorElements]
endIf
if !g_touchQuickNavRotorItemNames
|| ArrayLength(g_touchQuickNavRotorItemNames) != NumOfRotorElements
	g_touchQuickNavRotorItemNames = new StringArray[numOfRotorElements]
endIf
if g_TouchQuickNavElements
	CollectionRemoveAll(g_TouchQuickNavElements)
	g_TouchQuickNavElements = Null()
endIf
g_TouchQuickNavElements = new collection
EndFunction

void function SetRotorQuickNavElement(int index, string key, string RotorItemName, optional variant itemType)
g_touchQuickNavHashKeys[index] = key
g_touchQuickNavRotorItemNames[index] = rotorItemName
g_TouchQuickNavElements[key] = itemType
EndFunction

void function ClearRotorQuickNavElement(int index)
var	string member = g_touchQuickNavHashKeys[index]
if g_TouchQuickNavElements[member]
	CollectionRemoveItem(g_TouchQuickNavElements,member)
endIf
g_touchQuickNavHashKeys[index] = cscNull
g_touchQuickNavRotorItemNames[index] = cscNull
EndFunction

void function InitIndividualQuickNavElements()
;Add 1 to the number of fixed rotor elements when allocating the rotor elements,
;so that the array may later include a temporary element:
EnsureRotorQuickNavAllocation(GNumOfFixedRotorElements+1)
SetRotorQuickNavElement(1,touchRotorMemberRegions,msgTouchTypeRegions,"region")
SetRotorQuickNavElement(2,touchRotorMemberHeadings,msgTouchTypeHeadings,"heading")
SetRotorQuickNavElement(3,touchRotorMemberListItems,msgTouchTypeListItems,UIA_ListItemControlTypeId)
SetRotorQuickNavElement(4,touchRotorMemberButtons,msgTouchTypeButtons,UIA_ButtonControlTypeId)
SetRotorQuickNavElement(5,touchRotorMemberLinks,msgTouchTypeLinks,UIA_HyperlinkControlTypeId)
SetRotorQuickNavElement(6,touchRotorMemberGroups,msgTouchTypeGroups,UIA_GroupControlTypeId)
SetRotorQuickNavElement(7,touchRotorMemberLandmarks,msgTouchTypeLandmarks,"landmark")
;Initialize to null the place where a temporary rotor item type may be stored:
SetRotorQuickNavElement(GNumOfFixedRotorElements+1,cscNull,cscNull,0)
EndFunction

void function SetTouchRotorInitialQuickNavIndex(int setting)
if gbHasTemporaryRotorElement
	ClearRotorQuickNavElement(GNumOfFixedRotorElements +1)
	gbHasTemporaryRotorElement = false
endIf
if setting
	g_touchQuickNavIndex = setting
else
	g_touchQuickNavIndex = 1
endIf
ManageTemporaryRotorItems()
EndFunction

void function InitQuickNavElementCollection(optional int ForceNewInit)
if g_TouchQuickNavElements
&& !ForceNewInit
	return
EndIf
InitIndividualQuickNavElements()
;Now add the form controls as the last fixed item on the rotor:
g_touchQuickNavHashKeys[GNumOfFixedRotorElements] = touchRotorMemberFormControls
g_touchQuickNavRotorItemNames[GNumOfFixedRotorElements] = msgTouchTypeFormControls
g_TouchQuickNavElements[touchRotorMemberFormControls] = InitFormControlQuickNavElements()
SetTouchRotorInitialQuickNavIndex(GetNonJCFOption(hKey_TouchRotorInitialType))
EndFunction

void function SaveTouchQuickNavIndex()
g_saved_touchQuickNavIndex = g_touchQuickNavIndex
EndFunction

void function RestoreTouchQuickNavIndex()
if g_saved_touchQuickNavIndex
	g_touchQuickNavIndex = g_saved_touchQuickNavIndex
	g_saved_touchQuickNavIndex = 0
endIf
EndFunction

void function ManageTemporaryRotorItems()
if g_UIATreeWalker.currentElement.controlType == UIA_SliderControlTypeId
	if !gbHasTemporaryRotorElement
		SaveTouchQuickNavIndex()
		SetRotorQuickNavElement(GNumOfFixedRotorElements +1,touchRotorMemberAdjustValue,msgTouchRotorItemAdjustValue)
		g_touchQuickNavIndex = GNumOfFixedRotorElements +1
		gbHasTemporaryRotorElement = true
	endIf
	return
endIf
if gbHasTemporaryRotorElement
&& g_UIATreeWalker.currentElement.controlType != UIA_SliderControlTypeId
	ClearRotorQuickNavElement(GNumOfFixedRotorElements +1)
	if g_touchQuickNavIndex == GNumOfFixedRotorElements +1
		RestoreTouchQuickNavIndex()
	else ;Don't restore, but clear the saved index:
		g_saved_touchQuickNavIndex = 0
	endIf
	gbHasTemporaryRotorElement = false
endIf
EndFunction

void function InitUIAControlBrailleTypesArray()
if g_UIABrlControlTypes return EndIf
g_UIABrlControlTypes = new IntArray[UIAControlTypesArraySize]
;the index of the array is equivalent to the UIA control type -UIABrlArrayIndexOffsetFromControlType
g_UIABrlControlTypes[1] = wt_Button
g_UIABrlControlTypes[2] = wt_DateTime
g_UIABrlControlTypes[3] = wt_CheckBox
g_UIABrlControlTypes[4] = wt_ComboBox
g_UIABrlControlTypes[5] = wt_Edit
g_UIABrlControlTypes[6] = wt_Link
g_UIABrlControlTypes[7] = wt_GeneralPicture
g_UIABrlControlTypes[8] = wt_List ;do not use wt_ListItem, or you will get no structured braille for it
g_UIABrlControlTypes[9] = wt_List
g_UIABrlControlTypes[10] = wt_Menu
g_UIABrlControlTypes[11] = wt_MenuBar
g_UIABrlControlTypes[12] = wt_Menu
g_UIABrlControlTypes[13] = wt_ProgressBar
g_UIABrlControlTypes[14] = wt_RadioButton
g_UIABrlControlTypes[15] = wt_ScrollBar
g_UIABrlControlTypes[16] = wt_Slider
g_UIABrlControlTypes[17] = wt_Spinbox
g_UIABrlControlTypes[18] = wt_StatusBar
g_UIABrlControlTypes[19] = wt_TabControl
g_UIABrlControlTypes[20] = wt_TabControl
g_UIABrlControlTypes[21] = wt_Static
g_UIABrlControlTypes[22] = wt_ToolBar
g_UIABrlControlTypes[23] = wt_ToolTip
g_UIABrlControlTypes[24] = wt_Treeview
g_UIABrlControlTypes[25] = wt_TreeviewItem
g_UIABrlControlTypes[26] = wt_static
g_UIABrlControlTypes[27] = wt_static
g_UIABrlControlTypes[28] = wt_static
g_UIABrlControlTypes[29] = wt_Table
g_UIABrlControlTypes[30] = wt_TableCell
g_UIABrlControlTypes[31] = wt_static
g_UIABrlControlTypes[32] = wt_SplitButton
g_UIABrlControlTypes[33] = wt_static
g_UIABrlControlTypes[34] = wt_static
g_UIABrlControlTypes[35] = WT_HEADERBAR
g_UIABrlControlTypes[36] = WT_HEADERBAR
g_UIABrlControlTypes[37] = wt_Table
g_UIABrlControlTypes[38] = WT_STATIC
g_UIABrlControlTypes[39] = wt_Separator
EndFunction

object function CreateControlTypeCondition( int type )
if ! g_UIA return EndIf
var object condition = g_UIA.CreateIntPropertyCondition( UIA_ControlTypePropertyId, type )
if type == UIA_EditControlTypeID
	var object readOnlyCondition = g_UIA.CreateBoolPropertyCondition( UIA_ValueIsReadOnlyPropertyId, false )
	var object andCondition = g_UIA.CreateAndCondition( condition, readOnlyCondition );
	condition = andCondition
elif type == UIA_TextControlTypeID
	var object keyboardFocusableCondition = g_UIA.CreateBoolPropertyCondition( UIA_IsKeyboardFocusablePropertyId, false )
	andCondition = g_UIA.CreateAndCondition( condition, keyboardFocusableCondition );
	condition = andCondition
	;var object notCondition = g_UIA.CreateNotCondition( readOnlyCondition );
EndIf
return condition
EndFunction

object function CreateAriaRoleCondition( string role )
if ! g_UIA return EndIf
var object condition = g_UIA.CreateStringPropertyCondition( UIA_AriaRolePropertyId, role )
return condition
EndFunction

object function CreateConditionFromCollection( collection c )
if ! c return EndIf
CreateUIAObject()
if ! g_UIA return EndIf
var object mainCondition, object typeCondition, object orCondition
var string key
ForEach key in c
	var int varType = GetVariantType( c[ key ] );
	typeCondition = g_nullObject;
	if varType == VT_INT
		typeCondition = CreateControlTypeCondition( c[ key ] );
	ElIf varType == VT_STRING
		TypeCondition = CreateAriaRoleCondition( c[ key ] );
	EndIf
	if typeCondition
		if ! mainCondition
			mainCondition = typeCondition;
		else
			orCondition = g_UIA.CreateOrCondition( mainCondition, typeCondition );
			mainCondition = orCondition;
		EndIf; ! maindCondition
	EndIf; typeCondition
EndForEach
return mainCondition;
EndFunction

object function CreateConditionFromINIKey( string key )
if g_UIAControlTypeStringToInt[ key ]
	return CreateControlTypeCondition( g_UIAControlTypeStringToInt[ key ] );
Else
	return CreateAriaRoleCondition( key );
EndIf
EndFunction

collection function GetDefaultUIAConditionSettings()
var collection settings = iniReadSectionToCollection ( section_TouchNavigationTypes, file_default_jcf, FLOC_SETTINGS )
return settings
EndFunction

collection function GetAppCustomizedUIAConditionSettings()
var
	collection settings = CollectionCopy(g_DefaultUIAConditionSettings),
	string fileName = GetActiveConfiguration()
if fileName
	fileName = fileName + FileExt_JCF
	settings = iniReadAndLayerSectionToCollection (Settings,section_TouchNavigationTypes,fileName,FLOC_SHARED_SETTINGS)
	settings = iniReadAndLayerSectionToCollection (Settings,section_TouchNavigationTypes,fileName,FLOC_USER_SETTINGS)
endIf
return settings
EndFunction

collection function GetAdvancedNavigationUIAConditionSettings()
var
	string key,
	collection settings = CollectionCopy(g_DefaultUIAConditionSettings)
ForEach key in settings
	settings[key] = 1
endForEach
return settings
EndFunction

void function RemoveAppCustomizedUIAConditionSettings()
var string fileName = GetActiveConfiguration()
if fileName
	fileName = fileName + FileExt_JCF
	IniRemoveSectionEx(section_TouchNavigationTypes,FLOC_USER_SETTINGS,fileName)
	iniFlushEx(FLOC_USER_SETTINGS,fileName)
endIf
EndFunction

object function GetUIAConditionForTreeWalker()
if ! g_UIA return EndIf
var collection settings
if IsTouchNavigationModeActive()
	settings = GetAppCustomizedUIAConditionSettings()
elif IsAdvancedObjectNavigationModeActive()
	settings = GetAdvancedNavigationUIAConditionSettings()
endIf
if !settings
	return g_UIA.CreateRawViewCondition();
EndIf
var object mainCondition
var string key
ForEach key in settings
	if settings[ key ]
		if ! mainCondition
			mainCondition = CreateConditionFromINIKey( key )
		else
			var object condition = CreateConditionFromINIKey( key );
			var object orCondition = g_UIA.CreateOrCondition( mainCondition, condition );
			mainCondition = orCondition
		EndIf
	EndIf
EndForEach
return mainCondition;
EndFunction

void function UpdateUIAElementRectangle(optional object element)
;if g_UIADebugging SayString("update") endIf
if !IsObjectNavigationActive()
|| !element
	if g_UIADebugging SayString("Hide rectangle and return") endIf
	HideRectangleWindow()
	return
endIf
var object rect = element.BoundingRectangle
if rect
	;make sure there really is a rectangle:
	if rect.right-rect.left
	&& rect.bottom-rect.top
		if g_UIADebugging SayString("Show rectangle") endIf
		ShowRectangleWindow(rect.left, rect.top, rect.right, rect.bottom)
		return
	endIf
endIf
if g_UIADebugging SayString("Hide rectangle") endIf
HideRectangleWindow()
EndFunction

object function g_UIA_CreateTreeWalkerWithCondition(object condition, optional object processCondition)
if !g_UIA
	return Null()
EndIf
if !ProcessCondition
	ProcessCondition = g_UIA.CreateIntPropertyCondition( UIA_ProcessIdPropertyId, GetUIAFocusElement(g_UIA).ProcessID )
endIf
if !processCondition
	if g_UIADebugging SayString(msgDebug_NoProcessCondition) endIf
	return Null()
EndIf
if !condition
	if g_UIADebugging SayString(msgDebug_FailedToGetCondition) endIf
	return Null()
EndIf
var object andCondition = g_UIA.CreateAndCondition( processCondition, condition )
if !andCondition
	if g_UIADebugging SayString(msgDebug_NoAndCondition) endIf
	return Null()
EndIf
return g_UIA.CreateTreeWalker(andCondition)
EndFunction

int function InitTouchNavigationTreeWalker(optional int UpdateExistingObject)
;Return false to hault further processing in calling function.
if (UpdateExistingObject && !g_UIA)
|| (!UpdateExistingObject && g_UIA)
	return false
endIf
if !g_UIA
	g_UIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	if !g_UIA
		if g_UIADebugging SayString(msgDebug_DidNotGetObject) EndIf
		return false
	EndIf
endIf
if gc_ObjectNavConfigCachedInfo.currentNavState & ObjectNavigation_Advanced
	g_UIATreeWalker = g_UIA.CreateTreeWalker(g_UIA.CreateRawViewCondition())
else
	g_UIATreeWalker = g_UIA_CreateTreeWalkerWithCondition(GetUIAConditionForTreeWalker())
endIf
if !g_UIATreeWalker
	if g_UIADebugging SayString(msgDebug_FailedToGetTreeWalker) endIf
	return false
EndIf
return true
EndFunction

void Function CreateUIAObject()
if g_UIA return endIf
InitControlTypeHelperCollections()
InitQuickNavElementCollection()
InitUIAControlBrailleTypesArray()
if !InitTouchNavigationTreeWalker()
	return
endIf
if g_SuspendedNavigationLocation
	g_UIATreeWalker.currentElement = g_SuspendedNavigationLocation
	g_SuspendedNavigationLocation = Null()
else
	var object element = GetUIAFocusElement(g_UIA).BuildUpdatedCache()
	if ! element
		if g_UIADebugging SayString(msgDebug_FailedToGetCurrentElement) endIf
		return
	EndIf
	g_UIATreeWalker.currentElement = element
	SetCurrentElementToDeepestFocusElement(g_UIA,g_UIATreeWalker)
	ManageTemporaryRotorItems()
	ManageListenerForCurrentElementChanges()
endIf
UpdateUIAElementRectangle(element)
EndFunction

int Function UpdateTreeWalkerWithNewConditions()
var object SavedLocation = g_UIATreeWalker.currentElement
if !InitTouchNavigationTreeWalker(true)
	return false
endIf
if IsAdvancedObjectNavigationModeActive()
	g_UIATreeWalker.currentElement = SavedLocation
else
	var object focusElement = GetUIAFocusElement(g_UIA)
	if focusElement.ProcessID == SavedLocation.ProcessID
		g_UIATreeWalker.currentElement = SavedLocation
	else
		g_UIATreeWalker.currentElement = focusElement
	endIf
endIf
return true
EndFunction

void function KillUIAObject()
g_UIA = g_nullObject
g_UIATreeWalker = g_nullObject
UpdateUIAElementRectangle()
EndFunction

void function UIAFocusChangedEventEx()
if g_UIA || g_UIATreeWalker
	KillUIAObject()
	if IsObjectNavigationActive()
		CreateUIAObject()
	endIf
endIf
;CreateUIAObject()
EndFunction

string function GetExpandCollapseString( object element )
if ! element return cscNull EndIf
var object pattern = element.GetExpandCollapsePattern();
if ( ! pattern ) return cscNull endif
if ( pattern.ExpandCollapseState == 0 )
	return msgPatternCollapsed
elif ( pattern.ExpandCollapseState == 1 )
	return msgPatternExpanded
elif ( pattern.ExpandCollapseState == 2 )
	return MsgPatternPartiallyExpanded
elif ( pattern.ExpandCollapseState == 3 )
	return msgPatternLeafNode
EndIf
return cscNull
EndFunction

string function GetGridItemString( object element )
if !element return cscNull EndIf
var object pattern = element.GetGridItemPattern()
if ( ! pattern ) return cscNull endIf
var string s
if pattern.rowSpan > 1 || pattern.columnSpan > 1
	s = FormatString( msgPatternGridItemSpanningDescription,
		pattern.row + 1, pattern.column + 1,
		pattern.columnSpan, pattern.rowSpan )
else
	s = FormatString( msgPatternGridItemDescription, pattern.row + 1, pattern.column + 1 );
EndIf
return s
EndFunction

string function GetGridItemRowAndColumnPosition( object element )
if !element return cscNull EndIf
var object pattern = element.GetGridItemPattern()
if ( ! pattern ) return cscNull endIf
return FormatString(msgPatternGridItemDescription, pattern.row+1, pattern.column+1 )
EndFunction

string FUNCTION GetGridString( object element )
if ! element return cscNull EndIf
var object pattern = element.GetGridPattern()
if ( ! pattern ) return cscNull endIf
return formatString (msgPatternGrid, Pattern.ColumnCount, Pattern.RowCount)
EndFunction

string function GetRangeValueString( object element )
if ! element return cscNull EndIf
var object pattern = element.GetRangeValuePattern()
if !pattern return cscNull EndIf
return IntToString( pattern.value )
EndFunction

string function GetSelectedStateString( object element )
if ! element return cscNull EndIf
var object pattern = element.GetSelectionItemPattern()
if ( ! pattern ) return cscNull EndIf
if pattern.isSelected
	return msgPatternSelected
else
	return ; "not selected"
EndIf
return cscNull
EndFunction

string function GetToggleString( object element )
if ! element return cscNull EndIf
var object pattern = element.GetTogglePattern()
if !pattern return cscNull EndIf
if ( pattern.ToggleState == 0 )
	return msgPatternNotChecked
elif ( pattern.ToggleState == 1 )
	return msgPatternChecked
elif ( pattern.ToggleState == 2 )
	return msgPatternPartiallyChecked
EndIf
return cscNull
EndFunction

string function GetValueString( object element )
if !element return cscNull EndIf
if element.controlType == UIA_HyperlinkControlTypeId
|| element.controlType == UIA_ImageControlTypeId
	return cscNull
EndIf
var object pattern = element.GetValuePattern()
if (pattern) return pattern.value endIf
if (element.controlType != UIA_ProgressBarControlTypeId) return GetRangeValueString( element ) endIf
;for progress bars, the rangeValue.value is typically an integer which represents the current value min to max,
;where the legacy iaccessible value typically contains the text in percentage format.
var object rangeValue = element.GetRangeValuePattern()
var object legacyIAccessible = element.GetLegacyIAccessiblePattern()
var
	string value = IntToString(rangeValue .value),
	string min = IntToString(rangeValue .minimum),
	string max = IntToString(rangeValue .maximum),
	string percentage = legacyIAccessible.value
if max ;don't test for min since it may legitimately = 0
	if value
	&& percentage
	&& value != percentage
		return formatString(cmsgTouchCursorProgressBarText, percentage, value, min, max)
	endIf
endIf
return value
EndFunction

string function GetIsReadOnlyString( object element )
if ! element return cscNull EndIf
If element.ControlType != UIA_EditControlTypeID return cscNull EndIf
var object pattern = element.GetValuePattern();
if ( pattern )
	if ( pattern.IsReadOnly )
		return msgPatternReadOnly
	EndIf
	return cscNull
EndIf
pattern = element.GetRangeValuePattern();
if ! pattern return cscNull EndIf
if ( pattern.IsReadOnly )
	return msgPatternReadOnly
EndIf
return cscNull
EndFunction

string function GetIsDataValidString( object element )
if ! element return cscNull EndIf
if !element.IsRequiredForForm return cscNull EndIf
if element.isDataValidForForm return cscNull EndIf
var int type = element.controlType
if type == UIA_EditControlTypeId
	return msgPatternInvalidEntry
EndIf
return cscNull
EndFunction

string function GetIsDisabledString( object element )
if ! element return cscNull EndIf
if !element.isEnabled
	return msgPatternDisabled
EndIf
return cscNull
EndFunction

string function GetIsPasswordString( object element )
if ! element return cscNull EndIf
if element.isPassword
	return msgPatternPassword
EndIf
return cscNull
EndFunction

string function GetIsRequiredString( object element )
if ! element return cscNull EndIf
if element.isRequiredForForm
	return msgPatternRequired
EndIf
return cscNull
EndFunction

string function GetOrientationString( object element )
if ! element return cscNull EndIf
if element.Orientation == OrientationType_Horizontal
	return msgPatternHorizontal
elif element.Orientation == OrientationType_Vertical
	return msgPatternVertical
EndIf
return cscNull
EndFunction

string function GetUIAStateString( object element , optional int SpecifiedStates)
if ! element return cscNull EndIf
var
	int flags,
	string stateString
if !SpecifiedStates then
	flags = GetStateString_AllStates
else
	flags = SpecifiedStates
endIf
if flags & GetStateString_ExpandCollapse
	stateString = StateString+cscSpace+GetExpandCollapseString( element )
endIf
if flags & GetStateString_Toggle
	stateString = StateString+cscSpace+GetToggleString( element )
endIf
if flags & GetStateString_SelectedState
	stateString = StateString+cscSpace+GetSelectedStateString( element )
endIf
if flags & GetStateString_IsReadOnly
	stateString = StateString+cscSpace+GetIsReadOnlyString( element )
endIf
if flags & GetStateString_IsPassword
	stateString = StateString+cscSpace+GetIsPasswordString( element )
endIf
if flags & GetStateString_Orientation
	stateString = StateString+cscSpace+GetOrientationString( element )
endIf
if flags & GetStateString_IsRequired
	stateString = StateString+cscSpace+GetIsRequiredString( element )
endIf
if flags & GetStateString_IsDataValid
	stateString = StateString+cscSpace+GetIsDataValidString( element )
endIf
if flags & GetStateString_IsDisabled
	stateString = StateString+cscSpace+GetIsDisabledString( element )
endIf
return StringTrimLeadingBlanks(stateString)
EndFunction

string function GetUIAPositionString( object element )
if !element return cscNull EndIf
return GetGridItemString( element ) + cscSpace + GetGridString( element )
EndFunction

object function UIAGetTextLineRangeAtLocation(object textPattern, int x, int y)
var object range = textPattern.rangeFromPoint(x,y)
range.ExpandToEnclosingUnit(textUnit_line)
return range
endFunction

void function UIASayTextLineRangeAtLocation(object textPattern, int x, int y)
var object range = UIAGetTextLineRangeAtLocation(textPattern, x, y)
Say(range.getText(TextRange_NoMaxLength),ot_line)
EndFunction

void function UIASayElementTypeAndState(object element)
Say(element.LocalizedControlType,ot_control_type)
var string stateString
stateString = GetUIAStateString( element)
if stateString
	Say(stateString,ot_item_state)
endIf
EndFunction

void function UIASayElementName(object element)
var string name = element.name
if name
	Say(name,ot_control_name)
endIf
endFunction

void function UIASayElementValueForItemWithTextValue(object element)
var
	object pattern,
	string value
pattern = element.GetValuePattern()
if pattern
	value = pattern.value
endIf
if !value
	pattern = element.GetLegacyIAccessiblePattern()
	if pattern
		value = pattern.value
	endIf
endIf
if !value
	var object textPattern = element.GetTextPattern()
	if !textPattern return endIf
	var object range = textPattern.documentRange
	if !range return endIf
	range.ExpandToEnclosingUnit(TextUnit_Page)
	value = range.getText(TextRange_NoMaxLength)
endIf
if value
	Say(value,ot_line)
endIf
EndFunction

int function UIAIsElementWithDocumentRange(object element,
	object byRef textPattern, object byRef range)
textPattern = Null()
range = Null()
textPattern = element.GetTextPattern()
if !textPattern return false endIf
range = textPattern.documentRange
if !range return false endIf
return true
EndFunction

int function UIASayElementWithDocumentRangeAtLocation(object element, int x, int y)
var
	object textPattern,
	object range
if !UIAIsElementWithDocumentRange(element,textPattern,range) return false endIf
if x && y
	UIASayTextLineRangeAtLocation(textPattern,x,y)
else ;for object navigation using the keyboard:
	UIASayElementTypeAndState(element)
	UIASayElementName(element)
	UIASayElementValueForItemWithTextValue(element)
endIf
return true
EndFunction

string function UIAGetValueForSayElement(object element)
if !element return cscNull endIf
var string value = GetValueString( element )
;if there is no name, return any value text which was retrieved:
if !element.name return value endIf
if element.name == value
	value = cscNull
EndIf
return value
EndFunction

void Function UIASayElement( object element ,
	optional int bSilenceHasFocus, int bSilencePosition)
if !element
	if g_UIADebugging SayString(msgDebug_NoElement) endIf
	return
EndIf
var
	string name,
	string value,
	string type,
	string state,
	int iStrLen,
	string position
name = element.name
value = UIAGetValueForSayElement(element)
if element.ControlType != UIA_ListItemControlTypeId
&& ( element.ControlType != UIA_TextControlTypeId
|| element.ariaRole )
	type = element.LocalizedControlType
EndIf
iStrLen = StringLength(type)
if StringRight(name,iStrLen) == type
	Name = StringTrimTrailingBlanks(StringchopRight(name,iStrLen))
endIf
if element.name == msgPatternVertical
|| element.name == msgPatternHorizontal
	state = GetUIAStateString(element ,
		(GetStateString_AllStates & ~GetStateString_Orientation))
else
	state = GetUIAStateString( element )
endIf
if !bSilencePosition
	position = GetUIAPositionString( element )
endIf
SayControlEx (
	0, ; handle
	name,
	type,
	state,
	cscNull, ; container name
	cscNull, ; container type
	value, ; value
	position,
	cscNull) ; static text
BrailleRefresh()
if !bSilenceHasFocus
&& element.HasKeyboardFocus
	SayUsingVoice(vctx_message,cmsgHasFocus,ot_jaws_message)
endIf
EndFunction

void function TouchSayCurrentElement()
CreateUIAObject()
if !g_UIATreeWalker return endif
UIASayElement(g_UIATreeWalker.currentElement)
EndFunction

object function UIAGetFirstChild(object element)
if !element return EndIf
CreateUIAObject()
var object treeWalker = g_UIA_CreateTreeWalkerWithCondition(g_UIA.CreateRawViewCondition())
if !treeWalker return EndIf
treeWalker.currentElement = element
if !treeWalker.GoToFirstChild() return EndIf
return treeWalker.currentElement
EndFunction

object function UIAGetParent(object element)
if !element return EndIf
CreateUIAObject()
var object treeWalker = g_UIA_CreateTreeWalkerWithCondition(g_UIA.CreateRawViewCondition())
if !treeWalker return EndIf
treeWalker.currentElement = element
if !treeWalker.GoToParent() return EndIf
return treeWalker.currentElement
EndFunction

object function UIAGetGrandParent(object element)
if !element return EndIf
CreateUIAObject()
var object treeWalker = g_UIA_CreateTreeWalkerWithCondition(g_UIA.CreateRawViewCondition())
if !treeWalker return EndIf
treeWalker.currentElement = element
if !treeWalker.GoToParent() return EndIf
if !treeWalker.GoToParent() return EndIf
return treeWalker.currentElement
EndFunction

object function UIAGetNext(object element)
if !element return EndIf
CreateUIAObject()
var object treeWalker = g_UIA_CreateTreeWalkerWithCondition(g_UIA.CreateRawViewCondition())
if !treeWalker return EndIf
treeWalker.currentElement = element
if !treeWalker.GoToNextSibling() return EndIf
return treeWalker.currentElement
EndFunction

object function UIAGetPrior(object element)
if !element return EndIf
CreateUIAObject()
var object treeWalker = g_UIA_CreateTreeWalkerWithCondition(g_UIA.CreateRawViewCondition())
if !treeWalker return EndIf
treeWalker.currentElement = element
if !treeWalker.GoToPriorSibling() return EndIf
return treeWalker.currentElement
EndFunction

int function ElementNameIsParentName(object element)
if !element || !element.name return false endIf
var	object parent = UIAGetParent( element )
if !parent return false endIf
return parent.name == element.name
endFunction

int function ElementNameIsParentOrGrandParentName(object element)
if !element || !element.name return false endIf
var	object parent = UIAGetParent( element )
if !parent return false endIf
if parent.name == element.name
	return true
elif !parent.name
	parent = UIAGetParent( parent)
	if parent
		return parent.name == element.name
	endIf
endIf
return false
endFunction
int function ElementNameIsTextInGroupParent(object element)
if !element || !element.name return false endIf
var	object parent = UIAGetParent( element )
if !parent return false endIf
return parent.ControlType == UIA_GroupControlTypeId
	&& StringContains(parent.name,element.name)
EndFunction

int function PreProcessShouldSkipUIAElementWhenNavigating(object element)
if !g_UIA return false EndIf
if !element return false EndIf
if UserBufferIsActive()
	return ShouldExcludeNavigationOutsideVirtualViewerWindow(Element)
endIf
if c_VKbd_Window.appWindow
	return ShouldSkipVirtualKeyboardElementWhenNavigating(element)
EndIf
return false
EndFunction

int function MainProcessShouldSkipUIAElementWhenNavigating(object element)
if !element.isEnabled return true endIf
var
	object parent,
	int type = element.controlType
if Type == UIA_TextControlTypeId
|| Type == UIA_ImageControlTypeId
|| Type == UIA_HyperlinkControlTypeId
	if !element.isKeyboardFocusable
	&& StringIsBlank(element.name)
		return true
	endIf
	parent = UIAGetParent( element )
	if parent.controlType == UIA_ListItemControlTypeId
	|| parent.controlType == UIA_HyperlinkControlTypeId
		return true
	elif parent.controlType == UIA_ButtonControlTypeId
	|| parent.controlType == UIA_CheckBoxControlTypeId
	|| parent.controlType == UIA_RadioButtonControlTypeId
		return (parent.name == element.name)
	EndIf
elif type == UIA_PaneControlTypeId
	;When exploring the screen with gestures and touch lands outside of the focus app:
	if element.processID != GetUIAFocusElement(g_UIA).ProcessID
		if !element.name
			return true
		endIf
	elif !element.name
		return true
	endIf
elif type == UIA_EditControlTypeId
	if !element.isKeyboardFocusable
		parent = UIAGetParent( element )
		if parent.controlType == UIA_EditControlTypeId
		&& parent.isKeyboardFocusable
		&& element.name == parent.name
			;This condition typically occurs in search edit fields
			return true
		endIf
	endIf
endIf
return false
EndFunction

int function ShouldSkipUIAElementWhenNavigating(object element)
if PreProcessShouldSkipUIAElementWhenNavigating(element) return true endIf
return MainProcessShouldSkipUIAElementWhenNavigating(element)
EndFunction

int function ShouldSkipVirtualKeyboardElementWhenNavigating(object element)
if !IsUsingJAWSGestures()
|| !c_VKbd_Window.appWindow
|| element.processID != c_VKbd_Window.processID
	return false
endIf
var int x, int y
if !element.GetClickablePoint( intRef(x), intRef(y))
	;Handwriting panel elements are not clickable.
	;Skip all non-clickable windows except panes we want to allow:
	return element.automationID != uia_AutomationID_Keyboard_Optimized
		&& element.automationID != UIA_automationID_ModalityTileContainer
endIf
;Skip main window, title bar, and extra text elements to reduce excessive speech when exploring the keyboard:
if element.automationID == UIA_AutomationID_InputFrameWindow
|| element.controlType == UIA_CustomControlTypeID
|| element.automationID == UIA_AutomationID_HideButtonText
|| element.automationID == UIA_AutomationID_IsolatedButtonSmallIcon
	return true
endIf
;skip button for switching to handwriting layout:
if element.automationID == UIA_AutomationID_ModalityHandwriting
	return true
endIf
return false
endFunction

int function ShouldExcludeNavigationOutsideVirtualViewerWindow(object element)
if GetLastInputSource() != InputSource_Touch return false endIf
CreateUIAObject()
var object condition = g_UIA.CreateAndCondition(
		g_UIA.CreateIntPropertyCondition( UIA_ControlTypePropertyId,UIA_WindowControlTypeId),
		g_UIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId,cwc_VirtViewHelp))
var object root = g_UIA.GetRootElement()
var object VirtualViewerWindow = root.FindFirst(TreeScope_Children,condition)
if !VirtualViewerWindow return false endIf
condition = g_UIA.CreateIntPropertyCondition( UIA_ProcessIdPropertyId,VirtualViewerWindow.processId)
if !condition return false endIf
var object treeWalker = g_UIA.CreateTreeWalker(condition)
if !treeWalker return false endIf
treeWalker.currentElement = VirtualViewerWindow
treeWalker.gotoFirstChild()
if treeWalker.currentElement.controlType != UIA_DocumentControlTypeId return false endIf
return !(g_UIA.CompareElements(element,treeWalker.currentElement))
EndFunction

int function ElementIsVirtualViewerDocument(object element)
if !UserBufferIsActive() return false endIf
if element.controlType != UIA_DocumentControlTypeId return false endIf
var object treeWalker = g_UIA.RawViewWalker()
treeWalker.currentElement = element
if !treeWalker.GoToParent() return false EndIf
return treeWalker.currentElement.controlType == UIA_WindowControlTypeId
	&& treeWalker.currentElement.className == cwc_VirtViewHelp
EndFunction

void function UIA_VKBD_AutomationEvent(object element, int eventID)
EndFunction

void function UIA_VKBD_PropertyChangedEvent(object element, int propertyID, variant newValue)
if propertyID == UIA_ExpandCollapseExpandCollapseStatePropertyId
	if element.className == UIa_Wc_cRootKey
	&& element.controlType == UIA_ButtonControlTypeId
		if newValue ==ExpandCollapseState_Expanded
			if c_VKbd_Settings.childPanelNotification == VKbd_ChildPanelNotification_MessageAndSound
				;Because the panel appearance causes a change in element,
				;Use BlockStopSpeechDuringExploration to temporarily prevent StopSpeech from running in TouchExplore:
				BlockStopSpeechDuringExploration(5)
				SayUsingVoice(vctx_Message,msgAlternativeCharactersAvailableNotification,ot_message)
			endIf
			PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchKeyboardChildPanelOpened))
			if ShouldItemSpeak(ot_tutor)
				BlockStopSpeechDuringExploration(5)
				if c_VKBD_Settings.typingMode == VKbd_TypingMode_Standard
					SayUsingVoice(vctx_message,msgAlternativeCharactersAvailableTutorMessageForStandardTyping,ot_tutor)
				elif c_VKBD_Settings.typingMode == VKbd_TypingMode_Touch
					SayUsingVoice(vctx_message,msgAlternativeCharactersAvailableTutorMessageForTouchTyping,ot_tutor)
				endIf
			endIf
		else
			PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchKeyboardChildPanelClosed))
		endIf
	endIf
endIf
EndFunction

int function IsVKbdButton(object element)
return element.processID == c_VKbd_Window.processID
	&& element.className == UIa_Wc_cRootKey
	&& element.frameWorkID == "DirectUI"
	&& element.controlType == UIA_ButtonControlTypeID
EndFunction

int function IsVKbdChildPanel(object element)
return element.processID == c_VKbd_Window.processID
	&& element.className ==UIA_wc_DummyChild
	&& element.controlType == UIA_PaneControlTypeId
EndFunction

void function SayTouchKeyboardButton(optional int ButtonWasTapped)
var
	object element,
	object pattern,
	string outputVoice
if buttonWasTapped
	element = g_UIATreeWalker.currentElement.BuildUpdatedCache()
	Say(element.name,ot_keyboard)
else ;button was explored to, not tapped:
	element = g_UIATreeWalker.currentElement
	var
		int bIsPunctuation,
		int savedPunctuationMode
	bIsPunctuation = StringIsPunctuation(element.name)
	if bIsPunctuation
		savedPunctuationMode = GetJCFOption(opt_punctuation)
		SetJCFOption(opt_punctuation,3)
	endIf
	SayUsingVoice(vctx_PCCursor,element.name,ot_string)
	if bIsPunctuation
		SetJCFOption(opt_punctuation,savedPunctuationMode)
	endIf
endIf
pattern = element.GetTogglePattern()
if pattern
	if pattern.ToggleState == 0
		IndicateControlState(wt_button,CTRL_UNCHECKED)
	elif pattern.ToggleState == 1
		IndicateControlState(wt_button,CTRL_CHECKED)
	elif pattern.ToggleState == 2
		IndicateControlState(wt_button,CTRL_PARTIALLY_CHECKED)
	EndIf
endIf
if !element.isEnabled
	SayUsingVoice(outputVoice,msgPatternDisabled,ot_line)
endIf
endFunction

int function UIASayTouchKeyboardElement(object element)
if GetLastInputSource() != InputSource_Touch
	;special rules for touch keyboard announcement are applied only when using gestures:
	return false
endIf
if !c_VKbd_Window.appWindow
	;The touch keyboard is not showing:
	return false
endIf
;Exploration by gesture outputs a sound for the child pane containing the extra related keys:
if IsVKbdChildPanel(element)
	PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchKeyboardChildPanelBoundary))
	return true
EndIf
if !c_VKbd_State.onButton
	var string gestureName = GetCurrentScriptKeyName()
	if (gestureName =="OneFinger+FlickRight" || gestureName == "OneFinger+FlickLeft")
	&& IsVKbdButton(element)
		;Flicking needs to detect when a virtual keyboard button was found:
		c_VKbd_State.state = VKbd_State_FoundNewKey
	else
		return false
	endIf
endIf
if c_VKbd_State.state != VKbd_State_FoundNewKey
	;This is not a new key, so skip the announcement of this key.
	;This scenario happens when a child panel expands to show a set of related keys,
	;and the new element represents the same key as the previous element.
	return true
endIf
var	int id = element.automationID
if id == "switchINPUT" ;touch keyboard, Change Layout OR Hide Keyboard button
|| id == 10600 ;on-screen keyboard, Options button
|| id == 10601 ;on-screen keyboard, Help button
	return false
endIf
SayTouchKeyboardButton()
return true
EndFunction

int function ToggleShowTouchKeyboard()
CreateUIAObject()
var object condition
condition = g_UIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId,UIa_wc_TIPBand)
condition = g_UIA.CreateAndCondition(condition,
	g_UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_ButtonControlTypeID))
if IsWindows10()
	condition = g_UIA.CreateAndCondition(condition,
		g_UIA.CreateStringPropertyCondition(UIA_NamePropertyId,wn_Touch_Keyboard))
else ;Windows 8:
	condition = g_UIA.CreateAndCondition(condition,
		g_UIA.CreateStringPropertyCondition(UIA_NamePropertyId,wn_Start_Touch_Keyboard))
endIf
if !condition return false endIf
var object treeWalker = g_UIA.CreateTreeWalker(condition)
if !treeWalker return false endIf
treeWalker.currentElement = g_UIA.GetRootElement()
treeWalker.GoToFirstChild()
if !treeWalker.currentElement.isEnabled
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return false
endIf
var object pattern = treeWalker.currentElement.GetLegacyIAccessiblePattern()
if !pattern return false endIf
if pattern.defaultAction
	pattern.doDefaultAction()
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchClickSound)
	return true
endIf
return false
endFunction

int function TouchTapStartTouchKeyboard()
if g_UIATreeWalker.currentElement.className != UIa_wc_TIPBand
|| g_UIATreeWalker.currentElement.controlType != UIA_ButtonControlTypeID
|| g_UIATreeWalker.currentElement.name != wn_Start_Touch_Keyboard
|| !g_UIATreeWalker.currentElement.isEnabled
	return false
endIf
var int x, int y
UIAGetPoint(x,y)
if x && y
	ClickAtPoint(x,y,true)
	return true
endIf
return false
EndFunction

int function GetVirtualKeyboardControlButtonState()
if !oUIA_VKBD return 0 endIf
var object condition = oUIA_VKBD.CreateAndCondition(
	oUIA_VKBD.CreateIntPropertyCondition( UIA_ProcessIdPropertyId,c_VKbd_Window.processID),
	oUIA_VKBD.CreateStringPropertyCondition( UIA_AutomationIdPropertyId,UIA_AutomationID_switchCtl))
if !condition return 0 endIf
var object treeWalker = oUIA_VKBD.CreateTreeWalker(condition)
if !treeWalker return endIf
treeWalker.currentElement = c_VKbd_Window.appWindow
treeWalker.gotoFirstChild()
return treeWalker.currentElement.GetTogglePattern().toggleState
endFunction

int function ClickVirtualKeyboardScriptedButton(object element, int ctrlState)
var
	string id = element.automationId
;Where automation ID is equivalent to a scan code,
;be sure to compare using string compare since the scan code may be a single character in length:
if StringCompare(id,UIA_AutomationID_Backspace) == 0
	var
		int typeCode,
		string sClass,
		string sText,
		int ContainsMarkup
	typeCode = GetObjectSubtypeCode()
	If typeCode < 1 then
		SClass = GetWindowClass (GetFocus ())
		If sClass == cwcTTY || sClass == cwcTTYGrab then
			TouchTapDoDefaultActionForCurrentElement()
			return true
		endIf
	elif typeCode == WT_TREEVIEW
	|| typeCode == WT_LISTVIEW
	|| typeCode == wt_ListBox
	|| typeCode == wt_listBoxItem then
		TouchTapDoDefaultActionForCurrentElement()
		return true
	endIf
	if ctrlState
		GetTextInfoForControlBackSpace(sText)
		if sText
			SayMessage(ot_line,sText)
		endIf
		TouchTapDoDefaultActionForCurrentElement()
	else
		GetCharacterInfoForBackSpace(sText,ContainsMarkup)
		TouchTapDoDefaultActionForCurrentElement()
		Say(sText, OT_CHAR, containsMarkup)
	endIf
	return true
elif id == UIA_AutomationID_LeftArrow
	TouchTapDoDefaultActionForCurrentElement()
	if ctrlState
		SayWordUnit(UnitMove_Prior)
	else
		SayCharacterUnit(UnitMove_Prior)
	endIf
	return true
elif id == UIA_AutomationID_RightArrow
	TouchTapDoDefaultActionForCurrentElement()
	if ctrlState
		SayWordUnit(UnitMove_Next)
	else
		SayCharacterUnit(UnitMove_Next)
	endIf
	return true
endIf
return false
EndFunction

void function DoSayActionForClickVirtualKeyboardButtonWithControlModifier(object element, string nameBeforeClick)
if nameBeforeClick != element.name
	;Control changed the name of the key,
	;So speak the name of the key as it was called before the click:
	SayUsingVoice(vctx_keyboard,nameBeforeClick,ot_line)
elif element.getTogglePattern()
	;Control key does not apply to keys with a toggle pattern
	SayTouchKeyboardButton(true)
else ;just say the key with the modifyer:
	Say(FormatString(msgControlKeyWithOtherKey,nameBeforeClick),ot_keyboard)
endIf
EndFunction

void function ClickCurrentVirtualKeyboardButton()
var
	string nameBeforeClick,
	int CtrlStateBeforeClick
;The Control key when toggled on will modify the name of some buttons,
;while for others it does not modify the name but the functionality may still be modified.
;Because the Control key toggles off immediately after the key it modifies is clicked,
;the state of the Control key and the name of the key it modifies must be checked before allowing the click action.
ctrlStateBeforeClick = GetVirtualKeyboardControlButtonState()
;First, process buttons which have been scripted to do more than echo when clicked:
if ClickVirtualKeyboardScriptedButton(g_UIATreeWalker.currentElement ,ctrlStateBeforeClick)
	SetVKBDStatusToInactive()
	return
endIf
nameBeforeClick = g_UIATreeWalker.currentElement.name
if !TouchTapDoDefaultActionForCurrentElement()
	;All keyboard buttons should do the default action.
	SetVKBDStatusToInactive()
	return
endIf
if c_VKBD_Settings.typingEcho == VKbd_TypingEcho_Off 
	SetVKBDStatusToInactive()
	return
endIf
g_UIATreeWalker.currentElement = g_UIATreeWalker.currentElement.BuildUpdatedCache()
if CtrlStateBeforeClick
	DoSayActionForClickVirtualKeyboardButtonWithControlModifier(g_UIATreeWalker.currentElement,nameBeforeClick)
	SetVKBDStatusToInactive()
	return
endIf
;If the button is clicked by means of a split tap,
;TouchExplore may stomp on the typing echo speech when it calls StopSpeech.
;This typically happens when the character being echoed was from the child panel,
;and closing the panel caused an element change when returning to the main keyboard panel.
;Use BlockStopSpeechDuringExploration to temporarily prevent StopSpeech from running in TouchExplore:
BlockStopSpeechDuringExploration(5)
SayTouchKeyboardButton(true)
SetVKBDStatusToInactive()
EndFunction

int function ToggleChildPanelForCurrentVirtualKeyboardButton(optional int showorHide)
var object pattern = g_UIATreeWalker.currentElement.GetExpandCollapsePattern()
if !pattern
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return false
endIf
var int state = pattern.ExpandCollapseState
if state == 0
	SetVKBDStatusToShowingExtras()
	pattern.Expand()
	return true
elif state == 1
	pattern.Collapse()
	SetVKBDStatusToCompleted()
	return true
endIf
return false
endFunction

void function SaveInfoForCurrentChildPanelVirtualKeyboardButton()
c_VKBD_State.prevSplitTappedChildButtonName = cscNull
;Check if the current button is a child panel button:
var object pattern = g_UIATreeWalker.currentElement.GetExpandCollapsePattern()
if pattern.ExpandCollapseState != 1 return endIf
;The child panel button representing the same character as a main keyboard panel button will have an automation ID of 0:
if g_UIATreeWalker.currentElement.automationID != 0 return endIf
c_VKBD_State.prevSplitTappedChildButtonName = g_UIATreeWalker.currentElement.name
EndFunction

int function VKbdTypingModeHook(string ScriptName)
if scriptName == "TouchTapCurrentElement"
	ClickCurrentVirtualKeyboardButton()
	RemoveHook (HK_SCRIPT, "VKbdTypingModeHook")
	return false
elif scriptName == "DoSecondaryActionForCurrentElement"
	ToggleChildPanelForCurrentVirtualKeyboardButton(VKbd_ChildPanel_Show)
	RemoveHook (HK_SCRIPT, "VKbdTypingModeHook")
	return false
endIf
RemoveHook (HK_SCRIPT, "VKbdTypingModeHook")
return true
endFunction

int function TryProcessTouchForVirtualKeyboard(int gestureType)
if !c_VKbd_State
	;The virtual keyboard code is not processed because the device is not touch capable,
	;or because JAWS gestures are not being processed:
	return false
endIf
;Test for triple tap on the switch shift before testing c_VKbd_State.onButton:
If gestureType == VKbd_Gesture_TripleTap
&& IsVKbdButton(g_UIATreeWalker.currentElement)
	;Triple tap toggles between shift and capslock:
	if g_UIATreeWalker.currentElement.automationID ==UIA_AutomationID_switchShift
	|| g_UIATreeWalker.currentElement.automationID ==UIA_AutomationID_switchRightShift
		var int x, int y
		g_UIATreeWalker.currentElement.GetClickablePoint( intRef(x), intRef(y))
		TouchTapToggleCurrentElement()
		g_UIATreeWalker.currentElement = g_UIA.GetElementFromPoint( x, y )
		SayTouchKeyboardButton(true)
		SetVKBDStatusToInactive()
	endIf
	return true
endIf
if !c_VKbd_State.onButton
	;The gesture is not on a virtual keyboard button.
	;Exploration may have visited the virtual keyboard even though it did not end there,
	;so make sure that the script state for the virtual keyboard is cleared:
	SetVKBDStatusToInactive()
	return false
endIf
;The rest should return true to indicate that processing for a keyboard button was performed.
if c_VKbd_Settings.typingMode == VKbd_TypingMode_Touch
	if gestureType == VKbd_Gesture_ExploreEnd
		; If a button was clicked with split tap and then the finger is lifted without further exploration,
		; the button is not re-clicked on exploration end.
		; However, if a button from the child panel was clicked and the panel was closed,
		; the button under the finger may represent the same button as the one clicked from the child panel
		; but it may not be the same UIA element.
		; To handle this case, we save any child panel button that was clicked with split tap,
		; and compare it with the button at the explore end to see if it represents the same character:
		if g_UIATreeWalker.currentElement.name != c_VKBD_State.prevSplitTappedChildButtonName
			ClickCurrentVirtualKeyboardButton()
		endIf
	elif gestureType == VKbd_Gesture_SplitTap
		ClickCurrentVirtualKeyboardButton()
		; If this is a child panel button, then save the info for this button.
		; See comment for gesture explore end above for an explanation of why this info is saved:
		SaveInfoForCurrentChildPanelVirtualKeyboardButton()
	elif gestureType == VKbd_Gesture_SplitDoubleTap
		ToggleChildPanelForCurrentVirtualKeyboardButton()
	endIf
elif c_VKbd_Settings.typingMode == VKbd_TypingMode_Standard
	if gestureType == VKbd_Gesture_ExploreEnd
		;Set a hook to act on the next gesture:
		AddHook(HK_SCRIPT, "VKbdTypingModeHook")
	elIf gestureType == VKbd_Gesture_SplitTap
		ClickCurrentVirtualKeyboardButton()
	endIf
else
	SetVKBDStatusToInactive()
endIf
return true
EndFunction

void function InitVKBDSettingsForExploration()
;Because the user may change the settings for various options at any time,
;these settings must be obtained at the start of each exploration, but not for each button found during exploration:
if c_VKbd_Settings.exploring  return endIf
c_VKbd_Settings.exploring = true
c_VKbd_Settings.typingMode = GetJCFOption(OPT_TOUCH_TYPING_MODE)
c_VKbd_Settings.typingEcho = GetJCFOption(OPT_TOUCH_TYPING_ECHO)
c_VKbd_Settings.phonetics = VKbd_Phonetics_On
c_VKbd_Settings.childPanelNotification = GetJCFOption(OPT_TOUCH_KEYBOARD_CHILD_PANEL_NOTIFICATION)
EndFunction

void function SetVKBDStatusToInactive()
;This should be called when JAWS starts to initialize the collection for the virtual keyboard status script processing,
;and again when exploration ends to clear its member variables.
if !c_VKbd_State return endIf
c_VKbd_State.state = VKbd_State_Inactive
c_VKbd_State.onButton = false
c_VKbd_State.HoldStart = 0
c_VKbd_State.holdAction = VKbd_NotHolding
UIA_VKBD_InternalListener = Null()
EndFunction

void function SetVKBDStatusForNewKey(object element)
;This should be called when exploration lands on a new virtual keyboard key.
c_VKbd_State.onButton = true
;First test if this should be treated as a new key:
if element.name == g_UIATreeWalker.currentElement.name
	if element.automationId == "0"
	|| g_UIATreeWalker.currentElement.automationId == "0"
		;This is not a new key if the child panel expanded to show related keys.
		;Expanding the child panel results in a new element appearing at the same location as the previous element,
		;and the new element has the same name as the previous element,
		;and the new element represents the same key as the previous element.
		;Also, this is not a new element if
		;the panel expanded, and the panel was then collapsed without exploring to a different key in the child panel.
		;The automation ID of the child panel key baring the same name as the main key is "0".
		;Because processing for a new key should not begin,
		;make sure status is set to completed.
		SetVKBDStatusToCompleted()
		return
	elif element.GetPropertyValue( UIA_IsTogglePatternAvailablePropertyId )
		;Some of the toggle buttons register as different elements when they are toggled to a different state.
		;So if a split tap was performed on a toggle button, do not consider this as a new button.
		SetVKBDStatusToCompleted()
		return
	endIf
endIf
c_VKbd_State.state = VKbd_State_FoundNewKey
c_VKbd_State.HoldStart = 0
c_VKbd_State.holdAction = VKbd_NotHolding
EndFunction

void function SetVKBDStatusToShowingExtras()
;This should be called immediately before expanding the child panel of keys,
;so that the event listener can be ready to detect the panel expanding.
if c_VKbd_State.state == VKbd_State_ShowingExtras return endIf
if !UIA_VKBD_InternalListener
	UIA_VKBD_InternalListener = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	ComAttachEvents(UIA_VKBD_InternalListener,UIA_VKBD_EventNamePrefix)
	UIA_VKBD_InternalListener.AddPropertyChangedEventHandler(UIA_ExpandCollapseExpandCollapseStatePropertyId, c_VKbd_Window.appWindow, TreeScope_Subtree)
endIf
c_VKbd_State.state = VKbd_State_ShowingExtras
c_VKbd_State.HoldStart = 0
c_VKbd_State.holdAction = VKbd_NotHolding
EndFunction

void function SetVKBDStatusToCompleted()
;This should be called after all hold actions for a virtual keyboard key are completed.
if c_VKbd_State.state == VKBD_State_Completed return endIf
c_VKbd_State.state = VKBD_State_Completed
c_VKbd_State.HoldStart = 0
c_VKbd_State.holdAction = VKbd_NotHolding
EndFunction

void function ClearAnyVKBDHoldStatus()
;This should be called when exploring to a new element to ensure that the virtual keyboard status is inactive.
if c_VKbd_State.state == VKbd_State_Inactive return endIf
c_VKbd_State.state = VKbd_State_Inactive
c_VKbd_State.onButton = false
c_VKbd_State.HoldStart = 0
c_VKbd_State.holdAction = VKbd_NotHolding
EndFunction

int function HasVKbdTouchHoldTimeExpired()
if c_VKbd_State.state != VKbd_State_Holding return false endIf
var int time = GetTickCount()-c_VKbd_State.HoldStart
return (c_VKbd_State.holdAction == VKbd_HoldAction_SayPhonetic && time >= VKbd_HoldPhoneticDelayTime)
	|| (c_VKbd_State.holdAction == VKbd_HoldAction_ShowExtras && time >= VKbd_HoldExpandPanelDelayTime)
	|| (c_VKbd_State.holdAction == VKbd_HoldAction_SayTutorMessage && time >= VKbd_HoldTutorMessageDelayTime)
EndFunction

void function TrySetVKBDStatusToHolding()
;This will detect if waiting for a hold action should begin,
;or if not whether the status should be set to completed.
var object element = g_UIATreeWalker.currentElement
var
	string name = element.name,
	string ID = element.automationID
;Check for phonetics or tutor message holding first:
if c_VKbd_State.holdAction != VKbd_HoldAction_SayPhonetic
	if StringLength(name) == 1
	&& StringContains("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",name)
	;&& announce phonetic setting is on
		c_VKbd_State.state = VKbd_State_Holding
		c_VKbd_State.HoldStart = GetTickCount()
		c_VKbd_State.holdAction = VKbd_HoldAction_SayPhonetic
		return
	endIf
endIf
if c_VKbd_State.holdAction != VKbd_HoldAction_SayTutorMessage
	if ID == UIA_AutomationID_switchShift
	|| ID == UIA_AutomationID_switchRightShift
		if !StringContains(element.name,KeyName_CapsLock )
			c_VKbd_State.state = VKbd_State_Holding
			c_VKbd_State.HoldStart = GetTickCount()
			c_VKbd_State.holdAction = VKbd_HoldAction_SayTutorMessage
			return
		endIf
	endIf
endIf
if c_VKBD_Settings.typingMode ==  VKbd_TypingMode_Standard 
	;Standard typing mode does not include hold action for extra keys:
	SetVKBDStatusToCompleted()
	return
endIf
;Next check if there are extra keys to show:
var object pattern = element.GetExpandCollapsePattern()
if !pattern
	;There is no action to hold for:
	SetVKBDStatusToCompleted()
	return
endIf
;Next check if extra keys are already showing:
if pattern .ExpandCollapseState == 1
	SetVKBDStatusToShowingExtras()
	return
endIf
;Hold for showing extra keys:
c_VKbd_State.state = VKbd_State_Holding
c_VKbd_State.HoldStart = GetTickCount()
c_VKbd_State.holdAction = VKbd_HoldAction_ShowExtras
endFunction

void function PerformAnyHoldAction()
;This will perform any actions that were waiting to happen
;and start waiting again for the next action, or set the status to completed if nothing should happen next.
var object element = g_UIATreeWalker.currentElement
if c_VKbd_State.holdAction == VKbd_HoldAction_SayPhonetic
	Say(element.name,ot_phonetic_char)
	TrySetVKBDStatusToHolding()
	return
elif c_VKbd_State.holdAction == VKbd_HoldAction_SayTutorMessage
	;Do not need to call BlockStopSpeechDuringExploration here,
	;because the current element is not changing:
	SayUsingVoice(vctx_message,msgVKbdShiftKeyTutorMessage,ot_tutor)
	;There is no other action to hold for:
	SetVKBDStatusToCompleted()
	return
elIf c_VKbd_State.holdAction == VKbd_HoldAction_ShowExtras
	var object pattern = element.GetExpandCollapsePattern()
	if pattern.ExpandCollapseState == 0
		SetVKBDStatusToShowingExtras()
		pattern.Expand()
		return
	endIf
endIf
SetVKBDStatusToCompleted()
EndFunction

int function TrySplitTapForVirtualKeyboard()
return TryProcessTouchForVirtualKeyboard(VKbd_Gesture_SplitTap)
EndFunction

int function TrySplitDoubleTapForVirtualKeyboard()
return TryProcessTouchForVirtualKeyboard(VKbd_Gesture_SplitDoubleTap)
EndFunction

void function TouchTwoFingersSplitTap()
if TryProcessTouchForVirtualKeyboard(VKbd_Gesture_SplitTap) return endIf
if UIASayCharacterAtExploreLocation() return endIf
TouchTapCurrentElement()
EndFunction

void function TouchTwoFingersSplitDoubleTap()
CreateUIAObject()
if TrySplitDoubleTapForVirtualKeyboard() return endIf
UIASayWordAtExploreLocation()
EndFunction

void function ProcessBlankScreenAreaSound()
c_ExploreArea.isBlank = true
if c_ExploreArea.emptyIteration == EmptyScreenAreaSoundInterval
	if UserBufferIsActive()
		PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchExploreOutsideVirtualViewer))
	else
		PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchExploreEmptyArea))
	endIf
	c_ExploreArea.emptyIteration  = 0
	return
endIf
c_ExploreArea.emptyIteration = (c_ExploreArea.EmptyIteration)+1
EndFunction

int function ProcessedExploreElementWithTextRange(object element, int x, int y)
var
	object textPattern,
	object range,
	string rangeText,
	int bContinueSpeech
if !UIAIsElementWithDocumentRange(element,textPattern,range)
	c_ExploreArea.prevRange = Null()
	return false
endIf
if !g_UIA.CompareElements( element, g_UIATreeWalker.currentElement )
	;bContinueSpeech ensures that this speech is not discarded when the text range is spoken:
	bContinueSpeech = true
	UIASayElementTypeAndState(element)
endIf
range = UIAGetTextLineRangeAtLocation(textPattern, x, y)
var
	object rect,
	int lineheight
rect = range.GetBoundingRectangles()
rect = rect(0)
;By allowing y to have an offset from top or bottom equal to the lineheight,
;we avoid playing the empty range sound when moving between consecutive lines of text.
lineHeight = rect.bottom-rect.top
if rect.left > x
|| rect.right < x
|| rect.top - lineHeight > y
|| rect.bottom + lineHeight < y
	ProcessBlankScreenAreaSound()
elif !c_ExploreArea.prevRange
|| !range.compare(c_ExploreArea.prevRange)
	if !bContinueSpeech StopSpeech() endIf
	rangeText = range.getText(TextRange_NoMaxLength)
	Say(rangeText,ot_line)
endIf
c_ExploreArea.prevRange = range
return true
EndFunction

int function IsElementBlankAreaOfScreen(object element)
if element.name return false endIf
;The touch keyboard child panel pane is an exception because it uses its own unique sound:
if IsVKbdChildPanel(element) return false endIf
return element.controlType == UIA_PaneControlTypeId
	|| element.controlType == UIA_ListControlTypeId
	|| element.controlType == UIA_MenuControlTypeId
	|| element.controlType == UIA_TreeControlTypeId
	|| element.controlType == UIA_GroupControlTypeId
	|| element.controlType == UIA_DataGridControlTypeId
	|| element.controlType == UIA_WindowControlTypeId
	|| element.controlType == UIA_HeaderControlTypeId
	|| element.controlType == UIA_TableControlTypeId
EndFunction

int function IsStopSpeechBlockedDuringExploration()
return StopSpeechDuringExplorationDisallowed
EndFunction

void function UnblockStopSpeechDuringExploration()
ScheduledUnblockSpeechDuringExploration = 0
StopSpeechDuringExplorationDisallowed = false
EndFunction

void function BlockStopSpeechDuringExploration(int duration)
if ScheduledUnblockSpeechDuringExploration UnscheduleFunction(ScheduledUnblockSpeechDuringExploration) endIf
StopSpeechDuringExplorationDisallowed = true
ScheduledUnblockSpeechDuringExploration = ScheduleFunction("UnblockStopSpeechDuringExploration",duration)
EndFunction

int function IsInVirtualKeyboardBoundaryArea(object element)
;Keyboard boundary area includes buttons so that they are detected as being within the keyboard boundary,
;even though a specific button may be skipped over during touch navigation:
return c_VKbd_Window.processID && element.processID == c_VKbd_Window.processID
	&& !(ShouldSkipUIAElementWhenNavigating(element) && element.controltype != UIA_ButtonControlTypeId)
endFunction

void function DetectCrossingVirtualKeyboardBoundary(object element)
if !c_VKbd_Window.processID
	;There is no virtual keyboard window:
	return
endIf
if !c_ExploreArea.prevExploreElement
	;Exploration has started, do not consider this a boundary cross event:
	return
endIf
var
	int elementIsInExplorableAreaOfKeyboardWindow,
	int wasInExplorableAreaOfKeyboardWindow
elementIsInExplorableAreaOfKeyboardWindow = IsInVirtualKeyboardBoundaryArea(element)
wasInExplorableAreaOfKeyboardWindow = IsInVirtualKeyboardBoundaryArea(c_ExploreArea.prevExploreElement)
if !elementIsInExplorableAreaOfKeyboardWindow 
&& wasInExplorableAreaOfKeyboardWindow
	PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchKeyboardExploreExited))
elif !wasInExplorableAreaOfKeyboardWindow
&& elementIsInExplorableAreaOfKeyboardWindow 
	PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchKeyboardExploreEntered))
endIf
EndFunction

int function IsTouchPointInConsoleWindow(int X, int Y)
return !UserBufferIsActive()
	&& GetWindowClass(GetWindowAtPoint(x,y)) == cwc_ConsoleWindowClass
EndFunction

void function ClearOSMExplorationRectAndTouchPoint()
c_ExploreArea.OSMPrevX = 0
c_ExploreArea.OSMPrevY = 0
c_ExploreArea.OSMRectLeft = 0
c_ExploreArea.OSMRectTop = 0
c_ExploreArea.OSMRectRight = 0
c_ExploreArea.OSMRectBottom = 0
EndFunction

void function UpdateOSMExplorationRectAndTouchPoint(int x, int y, int left, int top, int right, int bottom)
c_ExploreArea.OSMPrevX = x
c_ExploreArea.OSMPrevY = y
c_ExploreArea.OSMRectLeft = left
c_ExploreArea.OSMRectTop = top
c_ExploreArea.OSMRectRight = right
c_ExploreArea.OSMRectBottom = bottom
EndFunction

int function IsNewOSMTouchRect(int left, int top, int right, int bottom)
return left != c_ExploreArea.OSMRectLeft
	|| top != c_ExploreArea.OSMRectTop
	|| right != c_ExploreArea.OSMRectRight
	|| bottom != c_ExploreArea.OSMRectBottom
EndFunction

void function SayTouchLocationUsingOSM(int x, int y)
var
	int left,
	int top,
	int right,
	int bottom
if !GetItemRect(x, y, Left, Right, Top, Bottom, it_line)
|| !IsPointInRect(x, y,Left,Top,Right,Bottom)
	ClearOSMExplorationRectAndTouchPoint()
	ProcessBlankScreenAreaSound()
	return
endIf
if !IsNewOSMTouchRect(left,top,right,bottom) return EndIf
SaveCursor()
InvisibleCursor()
SaveCursor()
MoveTo(x,y)
var string sText = GetLine()
RestoreCursor()
RestoreCursor()
if !sText
	ClearOSMExplorationRectAndTouchPoint()
	ProcessBlankScreenAreaSound()
	return
EndIf
UpdateOSMExplorationRectAndTouchPoint(x,y,left,top,right,bottom)
StopSpeech()
Say(sText,ot_line)
EndFunction

void function TouchExplore(int x, int y)
c_ExploreArea.x = x
c_ExploreArea.y = y
InitVKBDSettingsForExploration()
CreateUIAObject()
if !g_UIATreeWalker return endIf
;Make sure to get the desired screen element,
;which may not be the same as the element retrieved using GetElementFromPoint:
var object element = GetDesiredScreenElementFromPoint(x, y, g_UIA, g_UIATreeWalker)
if !element	return EndIf
if UserBufferIsActive()
&& ShouldExcludeNavigationOutsideVirtualViewerWindow(element)
	;Exploration is restricted to the virtual viewer text when the user buffer is active,
	;so treat everywhere else like an empty screen area:
	ProcessBlankScreenAreaSound()
	c_ExploreArea.prevExploreElement = element
	return
endIf
if ProcessedExploreElementWithTextRange(element,x,y)
	g_UIATreeWalker.currentElement = element
	c_ExploreArea.prevExploreElement = element
	return
endIf
if g_touchExploring
&& g_UIA.CompareElements( element, g_UIATreeWalker.currentElement )
	if IsTouchPointInConsoleWindow(X,Y)
		SayTouchLocationUsingOSM(x,y)
	elif c_ExploreArea.isBlank
		ProcessBlankScreenAreaSound()
	elif c_VKbd_State.onButton
		if c_VKbd_State.state == VKbd_State_FoundNewKey
			TrySetVKBDStatusToHolding()
		elif HasVKbdTouchHoldTimeExpired()
			PerformAnyHoldAction()
		endIf
	endIf
	c_ExploreArea.prevExploreElement = element
	return
EndIf
g_touchExploring = true
ClearAnyVKBDHoldStatus()
if element.processID == GetUIAFocusElement(g_UIA).ProcessID
	var object found = element.FindFirst(TreeScope_Element, g_UIATreeWalker.condition)
	if !found
		c_ExploreArea.prevExploreElement = element
		return
	EndIf
endIf
DetectCrossingVirtualKeyboardBoundary(element)
if ShouldSkipUIAElementWhenNavigating(element)
	ProcessBlankScreenAreaSound()
	c_ExploreArea.prevExploreElement = element
	return
EndIf
If IsElementBlankAreaOfScreen(element)
	ProcessBlankScreenAreaSound()
	g_UIATreeWalker.currentElement = element
	c_ExploreArea.prevExploreElement = element
	return
endIf
c_ExploreArea.EmptyIteration = 0
c_ExploreArea.isBlank = false
if IsVKbdButton(element)
	PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchKeyboardKey))
	SetVKBDStatusForNewKey(element)
endIf
g_UIATreeWalker.currentElement = element
if !g_UIADebugging  
&& !IsStopSpeechBlockedDuringExploration()
	StopSpeech()
endIf
if UIASayElementWithDocumentRangeAtLocation(element,X,Y) return endIf
if UIASayTouchKeyboardElement(element) return endIf
UIASayElement(element,false,false)
c_ExploreArea.prevExploreElement = element
EndFunction

void function DoActionForTouchExploreEnd(int x, int y)
if TryProcessTouchForVirtualKeyboard(VKbd_Gesture_ExploreEnd) return endIf
if TrySetCursorToLocation(x,y) return endIf
if GestureModeIsTextReading()
&& !IsTextReadingAppropriateForCurrentElement()
&& !(UserBufferIsActive() && ShouldExcludeNavigationOutsideVirtualViewerWindow(g_UIATreeWalker.currentElement))
	if SetGestureModeForTouchNavigation()
		AnnounceCurrentGestureMode()
	endIf
endIf
if GetMostRecentJAWSGestureName() == "OneFinger+Tap"
	if IsElementBlankAreaOfScreen(g_UIATreeWalker.currentElement)
		PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchExploreEmptyArea))
	else
		UIASayElement(g_UIATreeWalker.currentElement,false,false)
	endIf
endIf
EndFunction

void function TouchExploreEnded( int x, int y )
;Although TouchExplore updates the UIA globals as it fires,
;TouchExploreEnded may occur as a result of a one finger tap,
;in which case the UIA globals must be set:
CreateUIAObject()
;Make sure to get the desired screen element,
;which may not be the same as the element retrieved using GetElementFromPoint:
var object element = GetDesiredScreenElementFromPoint(x, y, g_UIA, g_UIATreeWalker)
g_UIATreeWalker.currentElement = element
g_touchExploring = false
ManageTemporaryRotorItems()
ManageListenerForCurrentElementChanges()
DoActionForTouchExploreEnd(x,y)
CollectionRemoveAll(c_ExploreArea)
c_VKBD_Settings.exploring = false
EndFunction

string function GetUIAControllerForInfo(object element, optional int bIndent)
if !element || element.controllerFor.count == 0 return cscNull endIf
var
	object o,
	string s,
	int i,
	int n,
	string sType,
	string sName,
	string sIndent
if bIndent sIndent = FourSpaces endIf
n = (element.controllerFor.count)-1
for i = 0 to n
	o = element.controllerFor(i)
	sType = o.LocalizedControlType
	sName = o.name
	s = s+sIndent+sType+cscSpace+sName
	if i<n s = s+cscBufferNewLine endIf
endFor
return s
endFunction

string function GetUIADescribedByInfo(object element, optional int bIndent)
if !element || element.describedBy.count == 0 return cscNull endIf
var
	object o,
	string s,
	int i,
	int n,
	string sType,
	string sName,
	string sIndent
if bIndent sIndent = FourSpaces endIf
n = (element.describedBy.count)-1
for i = 0 to n
	o = element.describedBy(i)
	sType = o.LocalizedControlType
	sName = o.name
	s = s+sIndent+sType+cscSpace+sName
	if i<n s = s+cscBufferNewLine endIf
endFor
return s
endFunction
string function GetUIARuntimeIDString(object element)
var object runtimeID = element.GetRuntimeID()
if !runtimeID return cscNull endIf
var
	string s,
	int i
for i = 1 to runtimeID.count
	if i > 1
		s = s + ", "
	EndIf
	s = s + IntToString( runtimeID(i))
EndFor
return s
endFunction

string function UIAGetElementPropertiesStringForElement(object element)
if !element
	if g_UIADebugging SayString(msgDebug_NoElement) endIf
	return cscNull
EndIf
var
	object o,
	string s,
	string sProperty
if !element return cscNull endIf
if element.name
	s = s + FormatString(msgPropertyName, element.name)+cscBufferNewLine
EndIf
if element.acceleratorKey
	s = s + FormatString(msgPropertyAcceleratorKey, element.acceleratorKey)+cscBufferNewLine
EndIf
if element.accessKey
	s = s + FormatString(msgPropertyAccessKey, element.accessKey)+cscBufferNewLine
EndIf
if element.labeledBy
	o = element.labeledBy
	s = s + FormatString(msgPropertyLabeledBy,
		o.name,
		IntToString(o.controlType),
		o.ariaRole,
		o.automationID,
		GetUIARuntimeIDString(o))
		+cscBufferNewLine
endIf
if element.fullDescription
	s = s + FormatString(msgPropertyFullDescription, element.fullDescription)+cscBufferNewLine
EndIf
if element.helpText
	s = s + FormatString(msgPropertyHelpText, element.helpText)+cscBufferNewLine
EndIf
s = s + FormatString(msgPropertyControlType,
	g_UIAControlTypeIntToString[ IntToString(element.controlType)]
	+"("+IntToString( element.controlType)+")")
	+cscBufferNewLine
if element.itemType
	s = s + FormatString(msgPropertyItemType, element.itemType)+cscBufferNewLine
EndIf
if element.localizedControlType
	s = s + FormatString(msgPropertyLocalizedControlType, element.localizedControlType)+cscBufferNewLine
EndIf
if element.ariaProperties
	s = s + FormatString(msgPropertyAriaProperties, element.ariaProperties)+cscBufferNewLine
EndIf
if element.ariaRole
	s = s + FormatString(msgPropertyAriaRole, element.ariaRole)+cscBufferNewLine
EndIf
if element.LandmarkType
	s = s + FormatString(msgPropertyLandmarkType, element.LandmarkType)+cscBufferNewLine
endIf
if element.LocalizedLandmarkType
	s = s + FormatString(msgPropertyLocalizedLandmarkType, element.LocalizedLandmarkType)+cscBufferNewLine
endIf
if element.SizeOfSet > 0
	s = s + FormatString(msgPropertySizeOfSet, element.SizeOfSet)+cscBufferNewLine
	if element.PositionInSet > -1
		s = s + FormatString(msgPropertyPositionInSet, element.PositionInSet)+cscBufferNewLine
	endIf
endIf
if element.Level
&& element.Level > -1
	s = s + FormatString(msgPropertyLevel, element.level)+cscBufferNewLine
endIf
if element.itemStatus
	s = s + FormatString(msgPropertyItemStatus, element.itemStatus)+cscBufferNewLine
EndIf
sProperty = GetUIAControllerForInfo(element,true)
if sProperty
	s = s + FormatString(msgPropertyControllerFor, sProperty)+cscBufferNewLine
endIf
sProperty = GetUIADescribedByInfo(element,true)
if sProperty
	s = s + FormatString(msgPropertyDescribedBy, sProperty)+cscBufferNewLine
endIf
if element.FlowsFrom.Count > 0
	o = element.FlowsFrom((element.FlowsFrom.Count)-1)
	s = s + FormatString(msgPropertyFlowsFrom, o.LocalizedControlType, o.name)+cscBufferNewLine
EndIf
if element.FlowsTo.Count > 0
	o = element.FlowsTo(0)
	s = s + FormatString(msgPropertyFlowsTo, o.LocalizedControlType, o.name)+cscBufferNewLine
EndIf
if element.automationId
	s = s + FormatString(msgPropertyAutomationId, element.automationId)+cscBufferNewLine
EndIf
if element.className
	s = s + FormatString(msgPropertyClassName, element.className)+cscBufferNewLine
EndIf
if element.isKeyboardFocusable
	s = s + msgPropertyIsKeyboardFocusable+cscBufferNewLine
EndIf
if element.hasKeyboardFocus
	s = s + msgPropertyHasKeyboardFocus+cscBufferNewLine
EndIf
if element.isEnabled
	s = s + msgPropertyIsEnabled+cscBufferNewLine
EndIf
;There is a bug with the UIA script API where some properties may be inccorect,
;and BuildUpdatedCache does not update the property if it is out of date.
;We use a work-around in an attempt to determine if the element really is enabled,
;where we perform a findFirst on a copy of the current element with scope of element.
;The condition object specifies what we are looking for in the Find.
;There is also a bug where FindFirst fails to find an element with scope of element, no matter what condition is used for the find.
;If the find failed on the element, opt to show the value retrieved by the property,
;even though it may be wrong.
;Do not create a function to get the true property,
;but instead, add the code directly to wherever you would call the element property.
;The problem with using a function to get property information is that due to events and timing, the property may be asked for by two separate areas of code,
;and if one of these code areas calls the function at the time it was already running then the function would not return and the statement would always evaluate to false.
o = element.FindFirst(treeScope_element,g_UIA.CreateRawViewCondition())
if o.isOffScreen
|| (!o && element.isOffScreen)
	s = s + msgPropertyIsOffscreen+cscBufferNewLine
EndIf
if element.optimizeForVisualContent
	s = s + msgPropertyOptimizeForVisualContent+cscBufferNewLine
EndIf
if element.isDataValidForForm
	s = s + msgPropertyIsDataValidForForm+cscBufferNewLine
EndIf
if element.isRequiredForForm
	s = s + msgPropertyIsRequiredForForm+cscBufferNewLine
EndIf
if element.isPassword
	s = s + msgPropertyIsPassword+cscBufferNewLine
EndIf
if element.IsContentElement
	s = s + msgPropertyIsContentElement+cscBufferNewLine
EndIf
if element.IsControlElement
	s = s + msgPropertyIsControlElement+cscBufferNewLine
EndIf
if element.IsPeripheral
	s = s + msgPropertyIsPeripheral+cscBufferNewLine
endIf
if element.liveSetting
	s = s + FormatString(msgPropertyLiveSetting, IntToString(element.liveSetting))+cscBufferNewLine
endIf
s = s + FormatString( msgPropertyCulture, IntToString( element.culture ) )
	+cscBufferNewLine
if element.orientation
	s = s + FormatString(msgPropertyOrientation, element.orientation)+cscBufferNewLine
EndIf
var object rect = element.BoundingRectangle()
if rect
	s = s + FormatString( msgPropertyBoundingRectangle, rect.left, rect.top, rect.right, rect.bottom )+cscBufferNewLine
EndIf
var int clickX, int clickY
UIAGetPoint(clickX,clickY)
if clickX && clickY
	s = s + FormatString(msgPropertyClickablePoint,clickX,clickY)+cscBufferNewLine
endIf
if element.nativeWindowHandle
	s = s + FormatString(msgPropertyNativeWindowHandle, IntToString( element.nativeWindowHandle ))+cscBufferNewLine
EndIf
s = s + FormatString(msgPropertyProcessId, IntToString( element.processId ))+cscBufferNewLine
sProperty = GetUIARuntimeIDString(element)
if sProperty
	s = s + FormatString(msgPropertyRuntimeID,sProperty) + cscBufferNewLine
EndIf
if element.frameworkID
	s = s + FormatString(msgPropertyFramework,element.frameworkID) +cscBufferNewLine
endIf
if element.providerDescription
	s = s + FormatString(msgPropertyProviderDescription, element.providerDescription)+cscBufferNewLine
EndIf
return FormatString(msgPropertyOutputBlock,s)
EndFunction

string function UIAGetElementPropertiesString(optional object element)
if !g_UIATreeWalker return cscNull endif
if !element
	CreateUIAObject()
	element = g_UIATreeWalker.currentElement
endIf
return UIAGetElementPropertiesStringForElement(element)
EndFunction

string function UIAGetElementAvailablePatternsStringForElement(object element)
if !element return cscNull endIf
var
	string s
if element.GetPropertyValue( UIA_IsInvokePatternAvailablePropertyId )
	s = s+msgAvailablePatternInvoke+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsTogglePatternAvailablePropertyId )
	s = s+msgAvailablePatternToggle+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsExpandCollapsePatternAvailablePropertyId )
	s = s+msgAvailablePatternExpandCollapse+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsValuePatternAvailablePropertyId )
	s = s+msgAvailablePatternValue+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsLegacyIAccessiblePatternAvailablePropertyId )
	s = s+msgAvailablePatternLegacyIAccessible+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsObjectModelPatternAvailablePropertyId )
	s = s+msgAvailablePatternObjectModel+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsTextPatternAvailablePropertyId )
	s = s+msgAvailablePatternText+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsTextPattern2AvailablePropertyId )
	s = s+msgAvailablePatternText2+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsTextChildPatternAvailablePropertyId )
	s = s+msgAvailablePatternTextChild+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsItemContainerPatternAvailablePropertyId )
	s = s+msgAvailablePatternItemContainer+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsGridPatternAvailablePropertyId )
	s = s+msgAvailablePatternGrid+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsGridItemPatternAvailablePropertyId )
	s = s+msgAvailablePatternGridItem+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsTablePatternAvailablePropertyId )
	s = s+msgAvailablePatternTable+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsTableItemPatternAvailablePropertyId )
	s = s+msgAvailablePatternTableItem+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsSpreadsheetPatternAvailablePropertyId )
	s = s+msgAvailablePatternSpreadsheet+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsSpreadsheetItemPatternAvailablePropertyId )
	s = s+msgAvailablePatternSpreadsheetItem+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsRangeValuePatternAvailablePropertyId )
	s = s+msgAvailablePatternRangeValue+cscBufferNewLine
EndIf
if element.GetPropertyValue(UIA_IsScrollPatternAvailablePropertyId)
	s = s+msgAvailablePatternScroll+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsScrollItemPatternAvailablePropertyId )
	s = s+msgAvailablePatternScrollItem+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsSelectionPatternAvailablePropertyId )
	s = s+msgAvailablePatternSelection+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsSelectionItemPatternAvailablePropertyId )
	s = s+msgAvailablePatternSelectionItem+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsAnnotationPatternAvailablePropertyId )
	s = s+msgAvailablePatternAnnotation+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsStylesPatternAvailablePropertyId )
	s = s+msgAvailablePatternStyles+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsVirtualizedItemPatternAvailablePropertyId )
	s = s+msgAvailablePatternVirtualizedItem+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsWindowPatternAvailablePropertyId )
	s = s+msgAvailablePatternWindow+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsDockPatternAvailablePropertyId )
	s = s+msgAvailablePatternDock+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsMultipleViewPatternAvailablePropertyId )
	s = s+msgAvailablePatternMultipleView+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsTransformPatternAvailablePropertyId )
	s = s+msgAvailablePatternTransform+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsTransformPattern2AvailablePropertyId )
	s = s+msgAvailablePatternTransform2+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsSynchronizedInputPatternAvailablePropertyId )
	s = s+msgAvailablePatternSynchronizedInput+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsDragPatternAvailablePropertyId )
	s = s+msgAvailablePatternDrag+cscBufferNewLine
EndIf
if element.GetPropertyValue( UIA_IsDropTargetPatternAvailablePropertyId )
	s = s+msgAvailablePatternDropTarget+cscBufferNewLine
EndIf
if s
	s = FormatString(msgAvailablePatternOutputBlock,s)
endIf
return s
EndFunction

string function UIAGetElementAvailablePatternsString(optional object element)
if !g_UIATreeWalker return cscNull endif
if !element
	CreateUIAObject()
	element = g_UIATreeWalker.currentElement
endIf
return UIAGetElementAvailablePatternsStringForElement(element)
EndFunction

string function GetBooleanValueStringFrompatternData(object patternData)
if patternData
	return msgPatternDataValueTrue
else
	return msgPatternDataValueFalse
endIf
EndFunction

string function TextSelectionIDToString(int id)
if id == SupportedTextSelection_None
	return msgTextSelectionNone
elif id == SupportedTextSelection_Single
	return msgTextSelectionSingle
elif id == SupportedTextSelection_Multiple
	return msgTextSelectionMultiple
endIf
return cscNull
EndFunction

string function AnnotationTypeIDToString(int id)
if id == UIA_AnnotationType_Unknown
	return msgAnnotationTypeUnknown
elif id == UIA_AnnotationType_SpellingError
	return msgAnnotationTypeSpellingError
elif id == UIA_AnnotationType_GrammarError
	return msgAnnotationTypeGrammarError
elif id == UIA_AnnotationType_Comment
	return msgAnnotationTypeComment
elif id == UIA_AnnotationType_FormulaError
	return msgAnnotationTypeFormulaError
elif id == UIA_AnnotationType_TrackChanges
	return msgAnnotationTypeTrackChanges
elif id == UIA_AnnotationType_Header
	return msgAnnotationTypeHeader
elif id == UIA_AnnotationType_Footer
	return msgAnnotationTypeFooter
elif id == UIA_AnnotationType_Highlighted
	return msgAnnotationTypeHighlighted
endIf
return cscNull
EndFunction

string function GetListOfAnnotationTypeStrings(object annotations, string listSeparator)
var
	string s,
	int i,
	int n
if !annotations.count return cscNull endIf
n = (annotations.count)-1
for i = 0 to n
	s = s+AnnotationTypeIDToString(annotations(i))
	if i<n s=s+listSeparator endIf
endFor
return s
EndFunction

string function GetFormattedListFromStringArray(string label, object itemArray)
var
	string s,
	string list,
	string value,
	int i,
	int n
if !itemArray.count return cscNull endIf
n = (itemArray.count)-1
for i = 0 to n
	value = itemArray(i)
	list = FourSpaces+value+cscBufferNewLine
endFor
return label+cscBufferNewLine+list
EndFunction

string function GetListOfElementNames(object elements, int max, int byRef emptyValueCount)
var
	string list,
	string value,
	int i
emptyValueCount = 0
for i = 1 to max
	value = elements(i-1).name
	if !value
	|| StringIsBlank(value)
		value = msgPropertyDataEmptyValue
		emptyValueCount = emptyValueCount+1
	endIf
	list = list+FourSpaces+value+cscBufferNewLine
endFor
return list
EndFunction

string function GetFormattedListOfElementNames(string listLabel, object elements, int limit)
var
	string list,
	int count,
	int emptyValueCount
if elements.count == 0 return cscNull endIf
count = min(elements.count,limit)
list = GetListOfElementNames(elements,count,emptyValueCount)
if emptyValueCount == count
	;substitute a single line for the list of empties:
	list = cscSpace+msgPropertyDataEmptyValue
	if count < elements.count
		list = list+cscSpace+msgElipsis
	endIf
else
	list = cscBufferNewLine+list
	if count < elements.count
		list = list+cscBufferNewLine+FourSpaces+msgElipsis
	endIf
endIf
return listLabel+list
endFunction

string function GetFormattedListOfElementNameTypeAndRuntimeIDStrings(string listLabel, object element)
return FormatString(msgElementNameTypeAndRuntimeID,
	listLabel,
	element.name,
	g_UIAControlTypeIntToString[IntToString(element.controlType)]
		+"("+IntToString(element.controlType)+")",
	GetUIARuntimeIDString(element))
EndFunction

string function GetFormattedListOfElementArrayNameTypeAndRuntimeIDStrings(string listLabel, object elements)
var
	string list,
	string entry,
	int i,
	int n
if !elements.count return cscNull endIf
n = (elements.count)-1
for i = 0 to n
	entry = GetFormattedListOfElementNameTypeAndRuntimeIDStrings(
		FormatString(msgArrayItem,IntToString(i)),elements(i))
	list = list+entry+cscBufferNewLine
endFor
return listLabel+cscBufferNewLine+list
EndFunction

string function GetTextRangePatternDataString(object range)
var
	string s,
	string value,
	object o
if !range return cscNull endIf
;Show text in the range with a maximum length specified by TextRange_MaxLength_Properties_GetText.
;If text range retrieves text longer than this limit, show an elipsis:
value = range.GetText(TextRange_MaxLength_Properties_GetText+1)
if value
	if StringLength(value) > TextRange_MaxLength_Properties_GetText
		value = StringLeft(value,TextRange_MaxLength_Properties_GetText)
		value = value+msgElipsis
	endIf
	s = s+FormatString(msgPropertyTextInRange,value)+cscBufferNewLine
endIf
o = range.GetEnclosingElement()
if o
	s = s+GetFormattedListOfElementNameTypeAndRuntimeIDStrings(msgPropertyTextRangeEnclosingObject,o)+cscBufferNewLine
endIf
o = range.GetBoundingRectangles()
if o
	if o.right - o.left > 0
	&& o.bottom - o.top > 0
		s = s+FormatString(msgPropertyTextRangeBoundingRect,
			FormatString(msgPropertyRectPoints,
				o.left, o.top, o.right, o.bottom ))
			+cscBufferNewLine
	endIf
endIf
o = range.GetChildren()
if o
	value = GetFormattedListOfElementArrayNameTypeAndRuntimeIDStrings(msgPropertyTextRangeChildren,o)
	if value
		s = s+value
	endIf
endIf
return s
endFunction

string function GetTogglePatternDataString(object element)
var
	object pattern,
	string value
pattern = element.GetTogglePattern()
if !pattern return cscNull endIf
if pattern.ToggleState == 0
	value = msgPatternNotChecked
elif pattern.ToggleState == 1
	value = msgPatternChecked
elif pattern.ToggleState == 2
	value = msgPatternPartiallyChecked
else
	value = msgPatternDataError
EndIf
return FormatString(msgPatternDataTogglePattern_toggleState, value)+cscBufferNewLine
EndFunction

string function GetExpandCollapsePatternDataString(object element)
var
	object pattern,
	string value
pattern = element.GetExpandCollapsePattern();
if !pattern return cscNull endIf
if pattern.ExpandCollapseState == 0
	value = msgPatternCollapsed
elif pattern.ExpandCollapseState == 1
	value = msgPatternExpanded
elif pattern.ExpandCollapseState == 2
	value = MsgPatternPartiallyExpanded
elif pattern.ExpandCollapseState == 3
	value = msgPatternLeafNode
else
	value = msgPatternDataError
EndIf
return FormatString(msgPatternDataExpandCollapsePattern_ExpandCollapseState, value )+cscBufferNewLine
EndFunction

string function GetValuePatternDataString(object element)
var
	object pattern,
	string s
pattern = element.GetValuePattern()
if !pattern return cscNull endIf
s = FormatString(msgPatternDataValuePattern_value, pattern.value)+cscBufferNewLine
s = s+FormatString(msgPatternDataValuePatern_isReadOnly,
	GetBooleanValueStringFrompatternData(pattern.IsReadOnly))
	+cscBufferNewLine
return s
EndFunction

string function GetLegacyIAccessiblePatternDataString(object element)
var
	object pattern,
	string s,
	string value
pattern = element.GetLegacyIAccessiblePattern()
if !pattern return cscNull endIf
s = s+FormatString (msgPatternDataLegacyIAccessiblePattern_childID, IntToString(pattern.childID))+cscBufferNewLine
if pattern.defaultAction
	s = s+FormatString (msgPatternDataLegacyIAccessiblePattern_defaultAction, pattern.defaultAction)+cscBufferNewLine
EndIf
if pattern.name
	s = s+FormatString (msgPatternDataLegacyIAccessiblePattern_name, pattern.name)+cscBufferNewLine
EndIf
if pattern.value
	s = s+FormatString (msgPatternDataLegacyIAccessiblePattern_value, pattern.value)+cscBufferNewLine
EndIf
if pattern.description
	s = s+FormatString (msgPatternDataLegacyIAccessiblePattern_description, pattern.description)+cscBufferNewLine
EndIf
if pattern.help
	s = s+FormatString (msgPatternDataLegacyIAccessiblePattern_help, pattern.help)+cscBufferNewLine
EndIf
if pattern.keyboardShortcut
	s = s+FormatString (msgPatternDataLegacyIAccessiblePattern_keyboardShortcut, pattern.keyboardShortcut)+cscBufferNewLine
EndIf
if pattern.role
	s = s+FormatString (msgPatternDataLegacyIAccessiblePattern_role, IntToString( pattern.role ))+cscBufferNewLine
EndIf
if pattern.state
	s = s+FormatString (msgPatternDataLegacyIAccessiblePattern_state,
		IntToString( pattern.state ),
		DecToHex( pattern.state ))
		+cscBufferNewLine
EndIf
return s
EndFunction

string function GetTextPatternDataString(object element)
var
	object pattern,
	string s,
	object o,
	string value,
	int i,
	int n
pattern = element.GetTextPattern()
if !pattern return cscNull endIf
if pattern.GetCaretRange(intRef(n))
	if n
		value = msgPatternDataValueTrue
	else
		value = msgPatternDataValueFalse
	endIf
	s = s+FormatString(msgPatternDataTextControlHasKeyboardFocus,value)+cscBufferNewLine
endIf
if pattern.SupportedTextSelection
	s = FormatString(msgPatternDataTextSupportedTextSelection,TextSelectionIDToString(pattern.SupportedTextSelection))
		+cscBufferNewLine
endIf
o = pattern.DocumentRange()
if o
	value = GetTextRangePatternDataString(o)
	if value s=s+msgPatternDataTextDocumentTextRange+cscBufferNewLine+value+cscBufferNewLine endIf
endIf
o = pattern.GetVisibleRanges()
if o
&& o.count
	n = (o.count)-1
	value = cscNull
	for i = 0 to n
		value = GetTextRangePatternDataString(o(i))+cscBufferNewLine
	endFor
	if value s=s+msgPatternDataTextVisibleRanges+cscBufferNewLine+value endIf
endIf
return s
EndFunction

string function GetTextEditPatternDataString(object element)
var
	object pattern,
	string s,
	object o,
	string value
pattern = element.GetTextEditPattern()
if !pattern  return cscNull endIf
o = pattern.GetActiveComposition()
if o
	s = GetFormattedListOfElementNameTypeAndRuntimeIDStrings(msgPatternDataTextEditActiveComposition,o)
endIf
o = pattern.GetConversionTarget()
if o
	value = GetTextRangePatternDataString(o)
	if value s=s+msgPatternDataTextEditConversionTarget+cscBufferNewLine+value+cscBufferNewLine endIf
endIf
return s
EndFunction

string function GetTextChildPatternDataString(object element)
var
	object pattern,
	string s,
	object o,
	string value
pattern = element.GetTextChildPattern()
if !pattern return cscNull endIf
o = pattern.TextContainer
if o
	value = GetFormattedListOfElementNameTypeAndRuntimeIDStrings(msgPatternDataTextChildPattern_Container,o)
	if value s=s+value+cscBufferNewLine endIf
endIf
o = pattern.TextRange()
if o
	value = GetTextRangePatternDataString(o)
	if value s=s+msgPatternDataTextChildTextRange+cscBufferNewLine+value+cscBufferNewLine endIf
endIf
return s
EndFunction

string function GetGridPatternDataString(object element)
var
	object pattern,
	string s
pattern = element.GetGridPattern()
if !pattern return cscNull EndIf
s =  FormatString (msgPatternDataGridPattern_ColumnCount, IntToString(pattern.ColumnCount))+cscBufferNewLine
s = s+ FormatString (msgPatternDataGridPattern_RowCount, IntToString(pattern.RowCount))+cscBufferNewLine
return s
EndFunction

string function GetGridItemPatternDataString(object element)
var
	object pattern,
	string s
pattern = element.GetGridItemPattern()
if !pattern return cscNull EndIf
s = FormatString (msgPatternDataGridItemPattern_Column, IntToString(pattern.Column))+cscBufferNewLine
s = s+ FormatString (msgPatternDataGridItemPattern_Row, IntToString(pattern.Row))+cscBufferNewLine
if pattern.columnSpan > 1
	s = s+FormatString(msgPatternDataGridItemPattern_columnSpan,IntToString(pattern.columnSpan))+cscBufferNewLine
endIf
if pattern.rowSpan > 1 
	s = s+FormatString(msgPatternDataGridItemPattern_rowSpan,IntToString(pattern.rowSpan ))+cscBufferNewLine
endIf
return s
EndFunction

string function GetTablePatternDataString(object element)
var
	object pattern,
	string sData,
	string value,
	object o
pattern = element.GetTablePattern()
if !pattern return cscNull endIf
if pattern.RowOrColumnMajor == RowOrColumnMajor_RowMajor
	value = msgPatternDataTableRowOrColumnMajor_RowMajor
elif pattern.RowOrColumnMajor == RowOrColumnMajor_ColumnMajor
	value = msgPatternDataTableRowOrColumnMajor_ColumnMajor
elif pattern.RowOrColumnMajor == RowOrColumnMajor_Indeterminate
	value = msgPatternDataTableRowOrColumnMajor_Indeterminate
endIf
sData = FormatString(msgPatternDataTablePatternRowOrColumnMajor,value)+cscBufferNewLine
o = pattern.GetColumnHeaders()
if o
	value = GetFormattedListOfElementNames(msgPatternDataTablePatternHeaderData_ForColumn, o, TableHeaders_List_MaxLength)
	sData = sData+value
endIf
o = pattern.GetRowHeaders()
if o
	value = GetFormattedListOfElementNames(msgPatternDataTablePatternHeaderData_ForRow, o, TableHeaders_List_MaxLength)
	sData = sData+value
endIf
return sData
EndFunction

string function GetTableItemPatternDataString(object element)
var
	object pattern,
	string sData,
	string value,
	object o
pattern = element.GetTableItemPattern()
if !pattern return cscNull endIf
o = pattern.GetColumnHeaderItems()
if o
	value = GetFormattedListOfElementNames(msgPatternDataTableItemPatternHeaderData_ForColumn, o, TableHeaders_List_MaxLength)
	sData = sData+value
endIf
o = pattern.GetRowHeaderItems()
if o
	value = GetFormattedListOfElementNames(msgPatternDataTableItemPatternHeaderData_ForRow, o, TableHeaders_List_MaxLength)
	sData = sData+value
endIf
if sData sData=sData+cscBufferNewLine endIf
return sData
EndFunction

string function GetSpreadsheetItemPatternDataString(object element)
var
	object pattern,
	string s,
	object o,
	string value
pattern = element.GetSpreadsheetItemPattern()
if !pattern return cscNull endIf
if pattern.Formula
	s = FormatString(msgPatternDataSpreadsheetItemFormula,pattern.Formula)
endIf
o = pattern.GetAnnotationObjects()
if o
	value = GetFormattedListOfElementArrayNameTypeAndRuntimeIDStrings(msgPatternDataSpreadsheetItemAnnotationObjects,o)
	if value s=s+value endIf
endIf
o = pattern.GetAnnotationTypes()
if o
	value = GetListOfAnnotationTypeStrings(o,cscSpace)
	if value s = s+value+cscBufferNewLine endIf
endIf
return s
EndFunction

string function GetRangeValuePatternDataString(object element)
var
	object pattern,
	string s
pattern = element.GetRangeValuePattern()
if !pattern return cscNull endIf
s = s+FormatString (msgPatternDataRangeValuePattern_value, IntToString( pattern.value ))+cscBufferNewLine
s = s+FormatString (msgPatternDataRangeValuePattern_minimum, IntToString( pattern.minimum ))+cscBufferNewLine
s = s+FormatString (msgPatternDataRangeValuePattern_maximum, IntToString( pattern.maximum ))+cscBufferNewLine
s = s+FormatString (msgPatternDataRangeValuePattern_largeChange, IntToString( pattern.largeChange))+cscBufferNewLine
s = s+FormatString (msgPatternDataRangeValuePattern_smallChange, IntToString( pattern.smallChange))+cscBufferNewLine
s = s+FormatString (msgPatternDataRangeValuePattern_isReadOnly,
	GetBooleanValueStringFrompatternData(pattern.isReadOnly))
	+cscBufferNewLine
return s
EndFunction

string function GetScrollPatternDataString(object element)
var
	object pattern,
	string s
pattern = element.GetScrollPattern()
if !pattern return cscNull endIf

s = FormatString(msgPatternDataScrollPattern_horizontallyScrollable,
	GetBooleanValueStringFrompatternData(pattern.horizontallyScrollable))
	+cscBufferNewLine
s = s+FormatString(msgPatternDataScrollPattern_verticallyScrollable,
	GetBooleanValueStringFrompatternData(pattern.VerticallyScrollable))
	+cscBufferNewLine
s = s+FormatString(msgPatternDataScrollPattern_horizontalScrollPercent,
	IntToString(pattern.HorizontalScrollPercent))
	+cscBufferNewLine
s = s+FormatString(msgPatternDataScrollPattern_verticalScrollPercent,
	IntToString(pattern.VerticalScrollPercent))
	+cscBufferNewLine
s = s+FormatString(msgPatternDataScrollPattern_HorizontalViewSize,
	IntToString(pattern.HorizontalViewSize))
	+cscBufferNewLine
s = s+FormatString(msgPatternDataScrollPattern_verticalViewSize,
	IntToString(pattern.VerticalViewSize))
	+cscBufferNewLine
return s
EndFunction

string function GetSelectionPatternDataString(object element)
var
	object pattern,
	string s
pattern = element.GetSelectionPattern
if !pattern return cscNull endIf
s = FormatString(msgPatternDataSelectionPattern_IsSelectionRequired,
	GetBooleanValueStringFrompatternData(pattern.IsSelectionRequired))
	+cscBufferNewLine
s = s+FormatString(msgPatternDataSelectionPattern_CanSelectMultiple,
	GetBooleanValueStringFrompatternData(pattern.CanSelectMultiple))
	+cscBufferNewLine
var int count = pattern.getSelection().count
if count > 1
	s = s+FormatString(msgPatternDataSelectionPattern_Count,IntToString(count))+cscBufferNewLine
endIf
return s
EndFunction

string function GetSelectionItemPatternDataString(object element)
var
	object pattern,
	string s,
	object o
pattern = element.GetSelectionItemPattern()
if !pattern return cscNull endIf
s = FormatString(msgPatternDataSelectionItemPattern_isSelected,
	GetBooleanValueStringFrompatternData(pattern.isSelected))
	+cscBufferNewLine
o = pattern.SelectionContainer
if o
	s = s+GetFormattedListOfElementNameTypeAndRuntimeIDStrings(msgPatternDataSelectionItemPattern_ContainingObject,o)
		+cscBufferNewLine
EndIf
return s
EndFunction

string function GetAnnotationPatternDataString(object element)
var
	object pattern,
	string value,
	string s
pattern = element.GetAnnotationPattern()
if !pattern return cscNull EndIf
if pattern.target
	s = GetFormattedListOfElementNameTypeAndRuntimeIDStrings(msgPatternDataAnnotationTarget,pattern.target)+cscBufferNewLine
endIf
if pattern.author
	s = s+FormatString(msgPatternDataAnnotationAuthor,pattern.author)+cscBufferNewLine
endIf
if pattern.dateTime
	s = s+FormatString(msgPatternDataAnnotationDateTime,pattern.dateTime)+cscBufferNewLine
endIf
if pattern.typeID
	value = AnnotationTypeIDToString(pattern.typeID)
	if value
		s = s+FormatString(msgPatternDataAnnotationTypeID,value)+cscBufferNewLine
	endIf
endIf
if pattern.typeName
	s = s+FormatString(msgPatternDataAnnotationtypeName,pattern.typeName)+cscBufferNewLine
endIf
return s
EndFunction

string function GetStylesPatternDataString(object element)
var
	object pattern,
	string s,
	string value
pattern = element.GetStylesPattern()
if !pattern return cscNull endIf
if pattern.StyleName
	s = FormatString(msgPatternDataStyleName,pattern.StyleName)
		+cscBufferNewLine
endIf
if pattern.StyleID
	if pattern.StyleID == StyleId_BulletedList
		value = msgStyleBulletedList
	elif pattern.StyleID == StyleId_Custom
		value = msgStyleCustom
	elif pattern.StyleID == StyleId_Emphasis
		value = msgStyleEmphasis
	elif pattern.StyleID == StyleId_Heading1
		value = msgStyleHeading1
	elif pattern.StyleID == StyleId_Heading2
		value = msgStyleHeading2
	elif pattern.StyleID == StyleId_Heading3
		value = msgStyleHeading3
	elif pattern.StyleID == StyleId_Heading4
		value = msgStyleHeading4
	elif pattern.StyleID == StyleId_Heading5
		value = msgStyleHeading5
	elif pattern.StyleID == StyleId_Heading6
		value = msgStyleHeading6
	elif pattern.StyleID == StyleId_Heading7
		value = msgStyleHeading7
	elif pattern.StyleID == StyleId_Heading8
		value = msgStyleHeading8
	elif pattern.StyleID == StyleId_Heading9
		value = msgStyleHeading9
	elif pattern.StyleID == StyleId_Normal
		value = msgStyleNormal
	elif pattern.StyleID == StyleId_NumberedList
		value = msgStyleNumberedList
	elif pattern.StyleID == StyleId_Quote
		value = msgStyleQuote
	elif pattern.StyleID == StyleId_Subtitle
		value = msgStyleSubtitle
	elif pattern.StyleID == StyleId_Title
		value = msgStyleTitle
	endIf
	s = s+FormatString(msgPatternDataStyleID,value)
		+cscBufferNewLine
endIf
if pattern.FillColor
	value = IntToString(pattern.FillColor)
	s = s+FormatString(msgPatternDataStyleFillColor,value)
		+cscBufferNewLine
endIf
if pattern.FillPatternColor
	value = IntToString(pattern.FillPatternColor)
	s = s+FormatString(msgPatternDataStyleFillPatternColor,value)
		+cscBufferNewLine
endIf
if pattern.Shape
	s = s+FormatString(msgPatternDataStyleShape,pattern.Shape)
		+cscBufferNewLine
endIf
if pattern.ExtendedProperties
	s = s+FormatString(msgPatternDataStyleExtendedProperties,pattern.ExtendedProperties)
		+cscBufferNewLine
endIf
return s
EndFunction

string function GetWindowPatternDataString(object element)
var
	object pattern,
	string s,
	string value
pattern = element.GetWindowPattern()
if !pattern return cscNull endIf
s = s+FormatString(msgPatternDataWindowIsModal,GetBooleanValueStringFrompatternData(pattern.IsModal))
	+cscBufferNewLine
s = s+FormatString(msgPatternDataWindowIsTopMost,GetBooleanValueStringFrompatternData(pattern.IsTopmost))
	+cscBufferNewLine
if pattern.InteractionState == WindowInteractionState_Running
	value = msgWindowInteractionStateRunning
elif pattern.InteractionState == WindowInteractionState_Closing
	value = msgWindowInteractionStateClosing
elif pattern.InteractionState == WindowInteractionState_ReadyForUserInteraction
	value = msgWindowInteractionStateReadyForUserInteraction
elif pattern.InteractionState == WindowInteractionState_BlockedByModalWindow
	value = msgWindowInteractionStateBlockedByModalWindow
elif pattern.InteractionState == WindowInteractionState_NotResponding
	value = msgWindowInteractionStateNotResponding
endIf
s = s+FormatString(msgPatternDataWindowInteractionState,value)
	+cscBufferNewLine
if pattern.VisualState == WindowVisualState_Normal
	value = msgWindowVisualStateNormal
elif pattern.VisualState == WindowVisualState_Maximized
	value = msgWindowVisualStateMaximized
elif pattern.VisualState == WindowVisualState_Minimized
	value = msgWindowVisualStateMinimized
endIf
s = s+FormatString(msgPatternDataWindowVisualState,value)
	+cscBufferNewLine
s = s+FormatString(msgPatternDataWindowCanMaximize,GetBooleanValueStringFrompatternData(pattern.CanMaximize))
	+cscBufferNewLine
s = s+FormatString(msgPatternDataWindowCanMinimize,GetBooleanValueStringFrompatternData(pattern.CanMinimize))
	+cscBufferNewLine
return s
EndFunction

string function GetDockPatternDataString(object element)
var
	object pattern,
	string value
pattern = element.GetDockPattern()
if !pattern return cscNull endIf
if pattern.DockPosition == DockPosition_Top
	value = msgPositionTop
elif pattern.DockPosition == DockPosition_Left
	value = msgPositionLeft
elif pattern.DockPosition == DockPosition_Bottom
	value = msgPositionBottom
elif pattern.DockPosition == DockPosition_Right
	value = msgPositionRight
elif pattern.DockPosition == DockPosition_Fill
	value = msgPositionFill
elif pattern.DockPosition == DockPosition_None
	value = msgPositionNone
endIf
return FormatString(msgDockPatternDataPosition,value)
EndFunction

string function GetMultipleViewPatternDataString(object element)
var
	object pattern,
	string s,
	object o,
	int i,
	int n,
	string name,
	string list
pattern = element.GetMultipleViewPattern()
if !pattern return cscNull endIf
s = FormatString(msgPatternDataMultipleViewCurrentView,pattern.GetViewName(pattern.CurrentView))
	+cscBufferNewLine
o = pattern.GetSupportedViews()
if o.count
	n = (o.count)-1
	for i = 0 to n
		name = pattern.GetViewName(o(i))
		list = list+FourSpaces+Name+cscBufferNewLine
	EndFor
	s = s+FormatString(msgPatternDataMultipleViewSupportedViews,list)
endIf
return s
EndFunction

string function GetTransformPatternDataString(object element)
var
	object pattern,
	string s
pattern = element.GetTransformPattern()
if !pattern return cscNull endIf
s = FormatString(msgPatternDataTransformCanMove,GetBooleanValueStringFrompatternData(pattern.CanMove))
	+cscBufferNewLine
s = s+FormatString(msgPatternDataTransformCanResize,GetBooleanValueStringFrompatternData(pattern.CanResize))
	+cscBufferNewLine
s = s+FormatString(msgPatternDataTransformCanRotate,GetBooleanValueStringFrompatternData(pattern.CanRotate))
	+cscBufferNewLine
if pattern.CanZoom
	s = s+FormatString(msgPatternDataTransformZoomLevel,IntToString(pattern.ZoomLevel))
		+cscBufferNewLine
	s = s+FormatString(msgPatternDataTransformZoomMaximum,IntToString(pattern.ZoomMaximum))
		+cscBufferNewLine
	s = s+FormatString(msgPatternDataTransformZoomMinimum,IntToString(pattern.ZoomMinimum))
		+cscBufferNewLine
endIf
return s
EndFunction

string function GetDragPatternDataString(object element)
var
	object pattern,
	string s,
	object o,
	string value
pattern = pattern.GetDragPattern()
if !pattern return cscNull endIf
s = FormatString(msgPatternDataDragIsGrabbed,GetBooleanValueStringFrompatternData(pattern.IsGrabbed))
	+cscBufferNewLine
s = FormatString(msgPatternDataDragDropEffect,pattern.DropEffect)
	+cscBufferNewLine
o = pattern.DropEffects()
if o
	value = GetFormattedListFromStringArray(msgPatternDataDragDropEffects,o)
	if value s=s+value endIf
endIf
o = pattern.GetGrabbedItems()
if o
	value = GetFormattedListOfElementArrayNameTypeAndRuntimeIDStrings(msgPatternDataDragGrabbedItems,o)
	if value s=s+value endIf
endIf
return s
EndFunction

string function GetDropTargetPatternDataString(object element)
var
	object pattern,
	string s,
	object o,
	string value
pattern = pattern.GetDropTargetPattern
if !pattern return cscNull endIf
if pattern.effect
	s = FormatString(msgPatternDataDropTargetEffect,pattern.effect)
endIf
o = pattern.effects()
if o
	value = GetFormattedListFromStringArray(msgPatternDataDropTargetEffects,o)
	if value s=s+value endIf
endIf
return s
EndFunction

string function UIAGetElementPatternsDataStringForElement(object element)
if  !element return cscNull EndIf
var
	string sData,
	string s
s = GetTogglePatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetExpandCollapsePatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetValuePatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetLegacyIAccessiblePatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetTextPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetTextEditPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetTextChildPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetGridPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetGridItemPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetTablePatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetTableItemPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetSpreadsheetItemPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetRangeValuePatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetScrollPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetSelectionPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetSelectionItemPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetAnnotationPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetStylesPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetWindowPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetDockPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetMultipleViewPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetTransformPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetDragPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
s = GetDropTargetPatternDataString(element)
if s sData=sData+s+cscBufferNewLine endIf
if sData
	return StringTrimTrailingBlanks(FormatString(msgPatternDataOutputBlock,sData))
else
	return cscNull
endIf
EndFunction

string function UIAGetElementPatternsDataString(optional object element)
if !g_UIATreeWalker return cscNull endif
if !element
	CreateUIAObject()
	element = g_UIATreeWalker.currentElement
endIf
return UIAGetElementPatternsDataStringForElement(element)
EndFunction

string function UIAGetElementProperties(optional object element)
var
	string msg,
	string s
msg = UIAGetElementPropertiesString(element)
s = UIAGetElementAvailablePatternsString(element)
if s msg=msg+cscBufferNewLine+s endIf
s = UIAGetElementPatternsDataString(element)
if s msg=msg+cscBufferNewLine+s endIf
return msg
EndFunction

void function UIASayElementProperties()
var string msg
msg = UIAGetElementProperties()
g_SuspendedNavigationLocation = g_UIATreeWalker.currentElement
SayMessage(ot_user_buffer, msg		 )
EndFunction

void function TouchNavigationBoundaryEvent(int navdir)
var
	string longMsg,
	string shortMsg
if NavDir == TouchNavigate_NextElement
	longMsg = msgTouchNavFailedToMoveNextElement_L
	shortMsg = msgTouchNavFailedToMoveNext_S
elif NavDir == TouchNavigate_NextElementOfType
	longMsg = msgTouchNavFailedToMoveNextElementOfType_L
	shortMsg = msgTouchNavFailedToMoveNext_S
elif NavDir == TouchNavigate_NextSibling
	longMsg = msgTouchNavFailedToMoveNextSibling_L
	shortMsg = msgTouchNavFailedToMoveNext_S
elif NavDir == TouchNavigate_PriorElement
	longMsg = msgTouchNavFailedToMovePriorElement_L
	shortMsg = msgTouchNavFailedToMovePrior_S
elif NavDir == TouchNavigate_PriorElementOfType
	longMsg = msgTouchNavFailedToMovePriorElementOfType_L
	shortMsg = msgTouchNavFailedToMovePrior_S
elif NavDir == TouchNavigate_PriorSibling
	longMsg = msgTouchNavFailedToMovePriorSibling_L
	shortMsg = msgTouchNavFailedToMovePrior_S
elif NavDir == TouchNavigate_Parent
	longMsg = msgTouchNavFailedToMoveParent_L
	shortMsg = msgTouchNavFailedToMoveParent_S
elif NavDir == TouchNavigate_FirstChild
	longMsg = msgTouchNavFailedToMoveChild_L
	shortMsg = msgTouchNavFailedToMoveChild_S
endIf
TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound,ot_error,longMsg,shortMsg)
EndFunction

void function UIAGoTo( int param )
CreateUIAObject()
if ! g_UIATreeWalker return EndIf
var int result = 0;
if param == TouchNavigate_NextSibling
	result = g_UIATreeWalker.GoToNextSibling()
elif param == TouchNavigate_PriorSibling
	result = g_UIATreeWalker.GoToPriorSibling()
elif param == TouchNavigate_FirstChild
	result = g_UIATreeWalker.GoToFirstChild()
elif param == TouchNavigate_Parent
	result = g_UIATreeWalker.GoToParent()
else
	return
EndIF
if result == 0
	TouchNavigationBoundaryEvent(param)
	return;
EndIf
ShowAndSayItemAtTouchCursor()
EndFunction

void function UIASayRect()
if ! g_UIATreeWalker return EndIf
var object element = g_UIATreeWalker.currentElement;
if ! element return EndIf
var object rect = element.BoundingRectangle;
if !  rect
	if g_UIADebugging SayString(msgDebug_NoRectangle) endIf
	return
EndIf
var string format = "%1, %2, %3, %4"
SayFormattedMessage (ot_no_disable, format, format, IntToString( rect.left ), IntToString( rect.top ), IntToString( rect.right ), IntToString( rect.bottom ) )
EndFunction

int function UIAGetPoint(int byRef x, int byRef y)
x = 0
y = 0
CreateUIAObject()
if !g_UIATreeWalker return false EndIf
var object element = g_UIATreeWalker.currentElement
if !element return false EndIf
if g_UIA.CompareElements(element,g_UIA.GetRootElement())
	;calling GetClickablePoint on the root element causes JAWS to crash.
	return false
endIf
element.GetClickablePoint( intRef(x), intRef(y))
return true
EndFunction

int function UIAGetRect(int byRef left, int byRef top, int byRef right, int byRef bottom)
left = 0
top = 0
right = 0
bottom = 0
CreateUIAObject()
if !g_UIATreeWalker return false EndIf
var object element = g_UIATreeWalker.currentElement
if !element return false EndIf
var object rect = element.BoundingRectangle
if !rect return false endIf
left = rect.left
top = rect.top
right = rect.right
bottom = rect.bottom
return true
EndFunction

void function UIASayPoint()
CreateUIAObject()
if !g_UIATreeWalker return EndIf
var object element = g_UIATreeWalker.currentElement
if !element return EndIf
if g_UIA.CompareElements(element,g_UIA.GetRootElement())
	;calling GetClickablePoint on the root element causes JAWS to crash.
	return
endIf
var int x, int y
if !element.GetClickablePoint( intRef(x), intRef(y))
	if g_UIADebugging SayString(msgDebug_NoClickablePoint) endIf
	return
EndIf
var string format = "%1, %2"
SayFormattedMessage (ot_no_disable, format, format, IntToString( x ), IntToString( y ) )
EndFunction

void function UIAMakeVisible( object element )
if ! g_UIA return EndIf
if ! element return EndIf
; the following method of finding the scrollable ancestor really ought to be done using
; element.FindFirst and looking for the scroll item pattern property ID among the ancestors
; That does not work however, so we use the less elegant and less robust version below
var object pattern = element.GetScrollItemPattern();
if ! pattern
	UpdateUIAElementRectangle(element)
	var object parent = UIAGetParent( element );
	if ! parent	return EndIf
	pattern = parent.GetScrollItemPattern();
	if ! pattern return EndIf
EndIf
pattern.ScrollIntoView();
UpdateUIAElementRectangle(element)
EndFunction

void function UpdateGestureModeToKeyboardNavState()
if IsObjectTextReviewModeActive()
	SetGestureModeForTextReading()
else
	SetGestureModeForTouchNavigation()
endIf
EndFunction

void function ShowAndSayItemAtTouchCursor(optional int PlayNoSound)
if !g_UIA return EndIf
ManageTemporaryRotorItems()
ManageListenerForCurrentElementChanges()
UIAMakeVisible( g_UIATreeWalker.currentElement )
if !PlayNoSound
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigateSound)
endIf
;g_UIAMenuOpenedEventObject is true if using UIA to monitor for a menu open event.
;In that case, the object is announced and braille is updated when the focus changes to the menu.
if !g_UIAMenuOpenedEventObject
	BrailleRefresh()
	UIASayElement( g_UIATreeWalker.currentElement )
EndIf
EndFunction

int function UIASelectItem( object element )
if !element return false EndIf
var object selectionItem = element.GetSelectionItemPattern()
if !selectionItem return false EndIf
var object selectionContainer = selectionItem.SelectionContainer
if selectionContainer.CanSelectMultiple
	if selectionItem.isSelected
		selectionItem.RemoveFromSelection()
	else
		selectionItem.AddToSelection()
	endIf
endIf
selectionItem.Select()
return true
EndFunction

int function UIAExpandCollapse( object element )
if ! element return false EndIf
var object pattern = element.GetExpandCollapsePattern();
if ! pattern return false EndIf
if pattern.ExpandCollapseState == 0
	pattern.Expand();
	return true
ElIf pattern.ExpandCollapseState == 1
	pattern.Collapse();
	return false
EndIf
return false
EndFunction

int function IsEditableControl(object element)
if !element return false endIf
if !element.isEnabled return false endIf
if !element.isKeyboardFocusable return false endIf
var object pattern = element.GetValuePattern()
if pattern && pattern.IsReadOnly return false endIf
var	int type = element.controlType
if type == UIA_EditControlTypeId
|| type == UIA_DocumentControlTypeId
	return true
endIf
;For client areas of some applications such as MSWord or TextPad:
if type == UIA_PaneControlTypeId
	pattern = element.GetLegacyIAccessiblePattern()
	if pattern
	&& pattern.role == ROLE_SYSTEM_CLIENT
	&& pattern.state & (STATE_SYSTEM_FOCUSABLE | STATE_SYSTEM_FOCUSED)
		return true
	endIf
endIf
return false
endFunction

int function IsTextReadingAppropriateForCurrentElement()
return g_UIATreeWalker.currentElement.controlType == UIA_EditControlTypeId
	|| g_UIATreeWalker.currentElement.controlType == UIA_TextControlTypeId
	|| g_UIATreeWalker.currentElement.controlType == UIA_DocumentControlTypeId
	|| g_UIATreeWalker.currentElement.getTextPattern()
EndFunction

int function CurrentElementIsAvailableForAction()
if !g_UIATreeWalker then
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return false
endIf
if !g_UIATreeWalker.currentElement
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	if g_UIADebugging SayString(msgDebug_NoElement) endIf
	return false
EndIf
if !g_UIATreeWalker.currentElement.isEnabled
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return false
endIf
return true
EndFunction

int function TouchTapInvokeCurrentElement(optional int x, int y)
var object pattern = g_UIATreeWalker.currentElement.GetInvokePattern()
if !pattern return false endIf
if g_UIATreeWalker.currentElement.controlType == UIA_MenuItemControlTypeId
	var object o = g_UIATreeWalker.currentElement.GetExpandCollapsePattern()
	if o.ExpandCollapseState == 0
		UIAStartListeningForMenuOpen()
	endIf
endIf
if pattern.Invoke()
	if x && y
		NotifyTouchInteraction(GetWindowAtPoint(x,y),x,y)
	endIf
	KillUIAObject()
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchClickSound)
	return true
EndIf
return false
EndFunction

int function TouchTapToggleCurrentElement(optional int x, int y)
var object pattern = g_UIATreeWalker.currentElement.GetTogglePattern()
if !pattern return false endIf
pattern.toggle()
if x && y
	NotifyTouchInteraction(GetWindowAtPoint(x,y),x,y)
endIf
TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchClickSound)
KillUIAObject()
CreateUIAObject()
return true
EndFunction

int function TouchTapSelectCurrentElement(optional int x, int y)
if UIASelectItem( g_UIATreeWalker.currentElement)
	if x && y
		NotifyTouchInteraction(GetWindowAtPoint(x,y),x,y)
	endIf
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchClickSound)
	return true
endIf
return false
EndFunction

int function TouchTapDoDefaultActionForCurrentElement(optional int x, int y)
var object pattern = g_UIATreeWalker.currentElement.GetLegacyIAccessiblePattern()
if !pattern return false endIf
if pattern.defaultAction
	pattern.doDefaultAction()
	if x && y
		NotifyTouchInteraction(GetWindowAtPoint(x,y),x,y)
	endIf
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchClickSound)
	return true
EndIf
return false
EndFunction

int function TouchTapExpandCollapseCurrentElement(optional int x, int y)
if UIAExpandCollapse(g_UIATreeWalker.currentElement)
	if x && y
		NotifyTouchInteraction(GetWindowAtPoint(x,y),x,y)
	endIf
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchClickSound)
	return true
EndIf
return false
EndFunction

int function TouchTapSlider(object element, int direction, optional int speakValue)
if element.controlType != UIA_SliderControlTypeId return false endIf
var object pattern = element.GetRangeValuePattern()
if pattern
	if ChangeRangeValue(direction)
		if (SpeakValue) Say	(GetRangeValueString(element.BuildUpdatedCache()),ot_screen_message) endIf
		return true
	endIf
endIf
;Some sliders do not have a range pattern,
;and some with a range pattern do not respond to the range pattern change,
;so try to set the focus and type the key:
if (!element.HasKeyboardFocus) element.SetFocus() endIf
if element.HasKeyboardFocus
	if direction == UIARangeDecrease
		TypeKey(cksDownArrow)
	else
		TypeKey(cksUpArrow)
	endIf
	if (SpeakValue) SayWord() endIf
	return true
endIf
return false
EndFunction

int function TouchTapRangeOfCurrentElement(optional int x, int y)
return TouchTapSlider(g_UIATreeWalker.currentElement, UIARangeIncrease, true)
EndFunction

int function TouchTapSetFocusToCurrentElement(optional int x, int y)
if !g_UIATreeWalker.currentElement.isKeyboardFocusable return false endIf
TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchClickSound)
g_UIATreeWalker.currentElement.SetFocus()
if x && y
	NotifyTouchInteraction(GetWindowAtPoint(x,y),x,y)
endIf
if IsTextReadingAppropriateForCurrentElement()
	if !GestureModeIsTextReading()
		SetGestureModeForTextReading()
		if x && y
			TrySetCursorToLocation(x,y,true)
		endIf
	else
		SetGestureModeForTouchNavigation()
	endIf
	AnnounceCurrentGestureMode()
endIf
if IsEditableControl(g_UIATreeWalker.currentElement)
	ExitTouchNavigation()
	if IsVirtualPCCursor()
		TurnOnFormsMode(FormsModeEventSpeechSilent)
	endIf
endIf
return true
EndFunction

int function ProcessTouchTapCurrentElement(optional int x, int y)
if TouchTapStartTouchKeyboard() return true endIf
if TouchTapInvokeCurrentElement(x,y) return true endIf
if TouchTapToggleCurrentElement(x,y) return true endIf
if TouchTapSelectCurrentElement(x,y) return true endIf
if TouchTapDoDefaultActionForCurrentElement(x,y) return true endIf
if TouchTapExpandCollapseCurrentElement(x,y) return true endIf
if TouchTapRangeOfCurrentElement(x,y) return true endIf
if TouchTapSetFocusToCurrentElement(x,y) return true endIf
return false
EndFunction

void function TouchTapCurrentElement(optional int x, int y)
CreateUIAObject()
if !CurrentElementIsAvailableForAction() return endIf
if !ProcessTouchTapCurrentElement(x,y)
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
endIf
EndFunction

int function TrySetCursorToLocation(int x, int y, optional int bSpeakLocation)
if !(g_UIATreeWalker.currentElement.HasKeyboardFocus || ElementIsVirtualViewerDocument(g_UIATreeWalker.currentElement))return false endIf
var object textPattern = g_UIATreeWalker.currentElement.getTextPattern()
if !textPattern return false endIf
var object range = textPattern.RangeFromPoint(x,y)
if !range return false endIf
range.select()
if !bSpeakLocation return true endIf
var object documentRange = textPattern.documentRange
if documentRange.compareEndPoints(TextPatternRangeEndpoint_Start,documentRange,TextPatternRangeEndpoint_End) == 0
	Say(msgCursorLocationEmptyDocument,ot_JAWS_message)
elif range.compareEndPoints(TextPatternRangeEndpoint_Start,documentRange,TextPatternRangeEndpoint_Start) == 0
	Say(msgCursorLocationStartOfDocument,ot_JAWS_message)
elif range.compareEndPoints(TextPatternRangeEndpoint_Start,documentRange,TextPatternRangeEndpoint_End) == 0
	Say(msgCursorLocationEndOfDocument,ot_JAWS_message)
else
	;Ensure that punctuation is set to all so that punctuation characters are correctly announced:
	var
		string char = GetCharacter(),
		string word = GetWord(),
		int savedPunctuationSetting = GetJCFOption(opt_punctuation)
	SetJCFOption(opt_punctuation,3)
	if char != word
		Say(FormatString(msgCursorLocationCurrentCharacterAndCurrentWord, char, word), ot_jaws_message)
	else
		Say(FormatString(msgCursorLocationCurrentCharacterAndWord, char), ot_jaws_message)
	endIf
	SetJCFOption(opt_punctuation,savedPunctuationSetting)
endIf
return true
EndFunction

void function DoSecondaryActionForCurrentElement()
CreateUIAObject()
if !CurrentElementIsAvailableForAction() return endIf
var
	object element = g_UIATreeWalker.currentElement,
	int type = element.ControlType
if TryProcessTouchForVirtualKeyboard(VKbd_Gesture_TripleTap) return endIf
if type == UIA_ListItemControlTypeId
	ToggleCurrentItemSelection()
	return
elif type == UIA_SliderControlTypeId
	TouchTapSlider(element, UIARangeDecrease, true)
	return
endIf
TouchRightClick(element)
EndFunction

void function TouchRightClick(optional object element)
CreateUIAObject()
if !g_UIATreeWalker then
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return
endIf
;Due to filtering when skipping over elements,
;it may be necessary to specify a different element for the context menu call
;than the element at the touch cursor.
;This sometimes happens for the element of type pane and class Internet Explorer_Server.
;If necessary, supply the optional element for the one to use for the context menu call.
if !element
	element = g_UIATreeWalker.currentElement
endIf
if !element
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	if g_UIADebugging SayString(msgDebug_NoElement) endIf
	return
EndIf
if !element.isEnabled
|| !element.isKeyboardFocusable
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return
endIf
if !element.HasKeyboardFocus
	element.SetFocus()
EndIf
TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchClickSound)
gb_ListeningForContextMenuOpen = true
UIAStartListeningForMenuOpen()
;element.showContextMenu() ;This does not always work, so type the key instead:
TypeKey(cksContextMenu)
;because we don't know if a context menu is available, schedule stop listening:
ScheduleFunction("UIAStopListeningForMenuOpen",30)
EndFunction

void function UIASetFocus()
CreateUIAObject()
if ! g_UIATreeWalker return endif
var object element = g_UIATreeWalker.currentElement;
if  ( ! element )
	if g_UIADebugging SayString(msgDebug_NoElement) endIf
	return
EndIf
if ! element.SetFocus()
	if g_UIADebugging SayString(msgDebug_DidNotSetFocus) endIf
	return
EndIf
KillUIAObject()
EndFunction

int function UIAGoToNextInTree( object treeWalker )
if !treeWalker
	return false
endif
if treeWalker.GoToFirstChild()
	return true
EndIf
if treeWalker.GoToNextSibling()
	return true
EndIf
var object prevElement = treeWalker.currentElement
while ( treeWalker.GoToParent() )
	if treeWalker.GoToNextSibling()
		return true
	EndIf
EndWhile
treeWalker.currentElement = prevElement
return false
EndFunction

void function TouchNextElement()
CreateUIAObject()
if ! g_UIATreeWalker return endif
var object element = g_UIATreeWalker.currentElement;
while UIAGoToNextInTree( g_UIATreeWalker )
	if ! ShouldSkipUIAElementWhenNavigating( g_UIATreeWalker.currentElement )
		ShowAndSayItemAtTouchCursor()
		return
	EndIf
EndWhile
g_UIATreeWalker.currentElement = element
TouchNavigationBoundaryEvent(TouchNavigate_NextElement)
EndFunction

int function UIAGoToLastChild( object treeWalker )
if ! treeWalker return false endif
if ! treeWalker.GoToFirstChild()
	return false
EndIf
while treeWalker.GoToNextSibling()
EndWhile
return true
EndFunction

int function UIAGoToLastDescendant( object treeWalker )
if ! treeWalker return false endIf
var int retVal = false
while (UIAGoToLastChild(treeWalker)) retVal = true EndWhile
return retVal
EndFunction

int function UIAGoToPriorInTree( object treeWalker )
if ! treeWalker
	return false
endIf
if treeWalker.GoToPriorSibling()
	UIAGoToLastDescendant( treeWalker );
	return true
EndIf
if !treeWalker.GoToParent()
	return false
EndIf
return true
EndFunction

void function TouchPriorElement()
CreateUIAObject()
if !g_UIATreeWalker return endif
var object element = g_UIATreeWalker.currentElement
while ( UIAGoToPriorInTree( g_UIATreeWalker ) )
	if ! ShouldSkipUIAElementWhenNavigating( g_UIATreeWalker.currentElement )
		ShowAndSayItemAtTouchCursor()
		return
	EndIf
EndWhile
g_UIATreeWalker.currentElement = element;
TouchNavigationBoundaryEvent(TouchNavigate_PriorElement)
EndFunction

int function ShouldSkipUIAElementOnSayAll(object element)
return !IsAdvancedObjectNavigationModeActive()
	&& ShouldSkipUIAElementWhenNavigating(element)
endFunction

void function UIASayAllCallback()
CreateUIAObject()
if !g_UIATreeWalker return endif
if !UIAGoToNextInTree(g_UIATreeWalker) return EndIf
while ShouldSkipUIAElementOnSayAll(g_UIATreeWalker.currentElement)
	if !UIAGoToNextInTree(g_UIATreeWalker) return EndIf
endWhile
ShowAndSayItemAtTouchCursor(true)
QueueFunction("UIASayAllCallback")
EndFunction

void function TouchSayAll()
CreateUIAObject()
if !g_UIATreeWalker return endif
if IsAdvancedObjectNavigationModeActive()
&&  CurrentScriptWasInvokedByGesture()
	;Gesture for SayAll forces navigation mode to touch navigation,
	;to avoid problems with SayAll reading into untouchable areas.
	UseAdvancedObjectNavigationMode(false)
endIf
UIASayElement( g_UIATreeWalker.currentElement )
QueueFunction ("UIASayAllCallback")
EndFunction

void function TouchStopCurrentSpeechOutput()
StopSpeech()
EndFunction

void function UIAGoToFirstInTree( object treeWalker )
CreateUIAObject()
if ! treeWalker return EndIf
while treeWalker.GoToParent()
EndWhile
while treeWalker.GoToPriorSibling()
EndWhile
EndFunction

void function UIAGoToLastInTree( object treeWalker )
CreateUIAObject()
if ! treeWalker return EndIf
while treeWalker.GoToParent() EndWhile
while treeWalker.GoToNextSibling() EndWhile
UIAGoToLastDescendant( treeWalker )
EndFunction

void function TouchMoveToFirstElement()
CreateUIAObject()
if !g_UIATreeWalker return EndIf
UIAGoToFirstInTree(g_UIATreeWalker)
while ( ShouldSkipUIAElementWhenNavigating( g_UIATreeWalker.currentElement )
&& UIAGoToNextInTree( g_UIATreeWalker ) )
EndWhile
ShowAndSayItemAtTouchCursor()
EndFunction

void function TouchMoveToLastElement()
CreateUIAObject()
if !g_UIATreeWalker return EndIf
UIAGoToLastInTree(g_UIATreeWalker)
while ( ShouldSkipUIAElementWhenNavigating( g_UIATreeWalker.currentElement )
&& UIAGoToPriorInTree( g_UIATreeWalker ) )
EndWhile
ShowAndSayItemAtTouchCursor()
EndFunction

void function TouchMoveToFirstElementInProcessID()
CreateUIAObject()
if !g_UIATreeWalker return EndIf
var object condition = g_UIA.CreateIntPropertyCondition( UIA_ProcessIdPropertyId, g_UIATreeWalker.currentElement.processID)
var object treeWalker = g_UIA.CreateTreeWalker(condition)
if !treeWalker return endIf
treeWalker.currentElement = g_UIATreeWalker.currentElement
UIAGoToFirstInTree(treeWalker)
g_UIATreeWalker.currentElement = treeWalker.currentElement
ShowAndSayItemAtTouchCursor()
EndFunction

void function TouchMoveToLastElementInProcessID()
CreateUIAObject()
if !g_UIATreeWalker return EndIf
var object condition = g_UIA.CreateIntPropertyCondition( UIA_ProcessIdPropertyId, g_UIATreeWalker.currentElement.processID)
var object treeWalker = g_UIA.CreateTreeWalker(condition)
if !treeWalker return endIf
treeWalker.currentElement = g_UIATreeWalker.currentElement
UIAGoToLastInTree(TreeWalker)
g_UIATreeWalker.currentElement = treeWalker.currentElement
ShowAndSayItemAtTouchCursor()
EndFunction

int function UIAGoToElementType( variant type, int goToNext ,
	optional string QuickNavType)
CreateUIAObject()
if !g_UIATreeWalker
	if g_UIADebugging SayString(msgDebug_NoTreeWalker) endIf
	return UIAScriptError
EndIf
var
	object typeCondition,
	int variantType = GetVariantType( type )
if variantType == VT_INT
	typeCondition = CreateControlTypeCondition(type)
ElIf variantType == VT_STRING
	if type == "landmark"
		TypeCondition = g_UIA.CreateNotCondition(g_UIA.CreateIntPropertyCondition( UIA_LandmarkTypePropertyID,0))
	else
		TypeCondition = g_UIA.CreateStringPropertyCondition(UIA_ARIARolePropertyID,type)
	endIf
ElIf variantType == VT_RECORD
	TypeCondition = CreateConditionFromCollection(type)
Else
	if g_UIADebugging SayString(msgDebug_CouldNotCreateTypeConditionFromInputData) endIf
	return UIAScriptError
EndIf
if !typeCondition
	if g_UIADebugging SayString(msgDebug_NoTypeCondition) endIf
	return UIAScriptError
EndIf
var object treeWalker = g_UIA_CreateTreeWalkerWithCondition(typeCondition)
if ! treeWalker
	if g_UIADebugging SayString(msgDebug_FailedToGetTreeWalker) endIf
	return UIAScriptError
EndIf
treeWalker.currentElement = g_UIATreeWalker.currentElement
var int changed
if goToNext
	changed = UIAGoToNextInTree(treeWalker)
else
	changed = UIAGoToPriorInTree(treeWalker)
EndIf
if ! changed
	if QuickNavType
		NotifyTouchQuickNavigationFailed(goToNext,QuickNavType)
		return
	EndIf
	if goToNext
		TouchNavigationBoundaryEvent(TouchNavigate_NextElementOfType)
	else
		TouchNavigationBoundaryEvent(TouchNavigate_PriorElementOfType)
	endIf
	return false
EndIf
g_UIATreeWalker.currentElement = treeWalker.currentElement
ShowAndSayItemAtTouchCursor()
return true
EndFunction

int function TouchMoveToNextElementByType()
CreateUIAObject()
var variant type = g_touchQuickNavElements[g_touchQuickNavHashKeys[g_touchQuickNavIndex]]
if type
	return UIAGoToElementType(type, next)
endIf
;no type indicates that this is a temporary rotor element which does not correspond to a type:
if !gbHasTemporaryRotorElement return endIf
if g_UIATreeWalker.currentElement.controlType == UIA_SliderControlTypeId
	TouchTapSlider(g_UIATreeWalker.currentElement, UIARangeDecrease, true)
endIf
EndFunction

int function TouchMoveToPriorElementByType()
CreateUIAObject()
var variant type = g_touchQuickNavElements[ g_touchQuickNavHashKeys[ g_touchQuickNavIndex ] ]
if type
	return UIAGoToElementType(type, prior)
endIf
;no type indicates that this is a temporary rotor element which does not correspond to a type:
if !gbHasTemporaryRotorElement return endIf
if g_UIATreeWalker.currentElement.controlType == UIA_SliderControlTypeId
	TouchTapSlider(g_UIATreeWalker.currentElement, UIARangeIncrease, true)
endIf
EndFunction

void function TouchChangeElementMovementType( int increment )
CreateUIAObject()
if increment
	g_touchQuickNavIndex = g_touchQuickNavIndex + 1
else
	g_touchQuickNavIndex = g_touchQuickNavIndex - 1
EndIf
var int numOfCurrentRotorElements = GetTouchNavRotorItemCount()
if g_touchQuickNavIndex > numOfCurrentRotorElements
	g_touchQuickNavIndex = 1
ElIf g_touchQuickNavIndex < 1
	g_touchQuickNavIndex = numOfCurrentRotorElements
EndIf
Say(g_touchQuickNavRotorItemNames[g_touchQuickNavIndex],ot_status)
EndFunction

object function CreateContentViewTreeWalker()
CreateUIAObject()
if !g_UIATreeWalker return EndIf
return g_UIA_CreateTreeWalkerWithCondition(g_UIA.ContentViewCondition())
EndFunction

void function TouchCloseApp()
if IsObjectTextReviewModeActive()
	TurnOffTouchNavigationTextReview()
endIf
TypeKey(cksCloseApp)
EndFunction

int function ElementHasTextDocumentRange(object element, optional int controlTypeId)
if !element return false endIf
if controlTypeId
&& element.controlType != controlTypeId
	return false
endIf
var object textPattern = element.GetTextPattern()
if !textPattern return false endIf
var object range = textPattern.documentRange
if !range return false endIf
return true
endFunction

int function StringIsDigits(string s)
if StringIsBlank(s) return false endIf
return StringContainsChars(s,DigitChars)
	&& StringIsBlank(StringReplaceChars(s,DigitChars,cscSpace))
EndFunction

string function UIAGetElementText(object element)
var
	string name,
	string value,
	int controlType
if !element then return cscNull EndIf
controlType = element.controlType
name = element.name
value = GetValueString( element )
if controlType == UIA_HyperlinkControlTypeId
	if name
		;value is typically the link,
		;where name is typically the displayed text:
		return name
	endIf
endIf
if controlType == UIA_TextControlTypeId
&& name
	return name
endIf
if controlType == UIA_TreeItemControlTypeId
|| controlType == UIA_ListItemControlTypeId
	if (name && !value)
	|| (name && value && name == value)
		return name
	elif name && value
	&& StringIsDigits(value)
		if controlType == UIA_TreeItemControlTypeId
			;value is tree level:
			return name+cscBufferNewLine+FormatString(cmsg233_L,value)
		else
			;value is position in group:
			return name
		endIf
	else
		return name+cscSpace+value
	endIf
endIf
if value
	return value
elif name
	return name
else
	return cscNull
EndIf
EndFunction

string function UIAGetCurrentElementText()
CreateUIAObject()
if !g_UIATreeWalker then
	return cscNull
endIf
var object element = g_UIATreeWalker.currentElement.BuildUpdatedCache()
return UIAGetElementText(element)
endFunction

void function InitTouchNavigationConfigurations()
var
	collection c
gc_ObjectNavConfigCachedInfo = new collection
c = new collection
gc_ObjectNavConfigCachedInfo.automatic = c
gc_ObjectNavConfigCachedInfo.currentConfig = cscNull
gc_ObjectNavConfigCachedInfo.currentNavState = ObjectNavigation_Off
gc_ObjectNavConfigCachedInfo.savedNavState = ObjectNavigation_Off
;Object navigation mode for the touch cursor uses 0 for off, 1 for non-advanced and 2 for advanced.
;The jcf option for the default TouchCursorNavigationMode does not use off as a setting,
;so the settings for this option uses 0 for non-advanced and 1 for advanced navigation.
;For this reason, the value assigned to the default touch cursor mode is offset by 1:
gc_ObjectNavConfigCachedInfo.defaultNavMode = GetNonJCFOption(hKey_TouchCursorNavigationMode)+1
EndFunction

int function IsObjectNavigationActive()
return gc_ObjectNavConfigCachedInfo.currentNavState != ObjectNavigation_Off
	&& !(gc_ObjectNavConfigCachedInfo.currentNavState & ObjectNavigation_Suspended)
EndFunction

int function IsTouchCursor()
return gc_ObjectNavConfigCachedInfo.currentNavState == ObjectNavigation_Touch
	|| gc_ObjectNavConfigCachedInfo.currentNavState == ObjectNavigation_Advanced
EndFunction

int function GetObjectNavigationMode()
return gc_ObjectNavConfigCachedInfo.currentNavState
EndFunction

int function IsTouchNavigationModeActive()
return gc_ObjectNavConfigCachedInfo.currentNavState == ObjectNavigation_Touch
EndFunction

int function IsAdvancedObjectNavigationModeActive()
return gc_ObjectNavConfigCachedInfo.currentNavState == ObjectNavigation_Advanced
EndFunction

int function IsObjectTextReviewModeActive()
return gc_ObjectNavConfigCachedInfo.currentNavState & ObjectNavigation_TextReview
	&& !(gc_ObjectNavConfigCachedInfo.currentNavState & ObjectNavigation_Suspended)
EndFunction

int function IsObjectTextReviewModeSuspended()
return gc_ObjectNavConfigCachedInfo.currentNavState & ObjectNavigation_TextReview
	&& gc_ObjectNavConfigCachedInfo.currentNavState & ObjectNavigation_Suspended
EndFunction

int function IsObjectNavigationSuspended()
return gc_ObjectNavConfigCachedInfo.currentNavState & ObjectNavigation_Suspended
EndFunction

int function CurrentlyActivatingObjectTextReviewMode()
return g_ObjectTextReviewMode_TransitionState == Mode_TransitioningToActivated
EndFunction

int function CurrentlyDeactivatingObjectTextReviewMode()
return g_ObjectTextReviewMode_TransitionState == Mode_TransitioningToDeactivated
EndFunction

int function TextReviewWindowIsActive()
return UserBufferIsActive()
	&& UserBufferWindowName() == vwn_ObjectTextReviewOutput
endFunction

int function ShowTextReviewOutput(optional int InvokedByGestureModeChange)
var
	string sText
if UserBufferIsActive()
	UserBufferDeactivate()
EndIf
sText = UIAGetCurrentElementText()
if !sText then
	return false
EndIf
UserBufferClear()
if !InvokedByGestureModeChange
	g_ObjectTextReviewMode_TransitionState = Mode_TransitioningToActivated
	g_SavedSetting_OPT_VIRT_VIEWER = GetJCFOption(OPT_VIRT_VIEWER)
	SetJCFOption(OPT_VIRT_VIEWER,0)
endIf
UserBufferAddText(sText)
UserBufferActivateEx(vwn_ObjectTextReviewOutput,cscNull,0,0)
return true
EndFunction

int function ActivateTouchCursorTextReviewMode(optional int InvokedByGestureModeChange)
if !ShowTextReviewOutput(InvokedByGestureModeChange)
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return false
endIf
if !InvokedByGestureModeChange
	LoadKeyMapSection(KeyMapSection_ObjectTextReview)
	g_ObjectTextReviewMode_TransitionState = Mode_NotTransitioning
endIf
TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchTextReviewActivationSound,
	ot_status,cmsgTouchTextReviewOn,cmsgTouchTextReviewOn)
return true
EndFunction

int function ClearTextReviewOutput(optional int InvokedByGestureModeChange)
if !TextReviewWindowIsActive()
	return false
endIf
if !InvokedByGestureModeChange
	g_ObjectTextReviewMode_TransitionState = Mode_TransitioningToDeactivated
endIf
if UserBufferIsActive()
	UserBufferDeactivate()
endIf
UserBufferClear()
return true
EndFunction

int function DeactivateTouchCursorTextReviewMode(optional int InvokedByGestureModeChange)
if !ClearTextReviewOutput(InvokedByGestureModeChange)
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return false
endIf
TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchTextReviewDeactivationSound,
	ot_status,cmsgTouchTextReviewOff,cmsgTouchTextReviewOff)
if !InvokedByGestureModeChange
	SetJCFOption(OPT_VIRT_VIEWER,g_SavedSetting_OPT_VIRT_VIEWER)
	UnloadKeyMapSection(KeyMapSection_ObjectTextReview)
	g_ObjectTextReviewMode_TransitionState = Mode_NotTransitioning
endIf
return true
EndFunction

void function LoadObjectNavigationKeyMaps(int navigation)
var
	int bLaptop = (FindKeyAliasMatch("JAWSKey") == "Capslock")
;Advanced layers on top of touch:
if navigation & ObjectNavigation_Touch then
	LoadKeymapSection(KeyMapSection_TouchNavigation)
	if bLapTop then
		LoadKeymapSection(KeyMapSection_TouchNavigation_Laptop)
	endIf
endIf
if navigation & ObjectNavigation_Advanced then
	LoadKeymapSection(KeyMapSection_ObjectNavigation)
	if bLapTop then
		LoadKeymapSection(KeyMapSection_ObjectNavigation_Laptop)
	endIf
EndIf
;additionally load quick nav keys if touch quick nav is enabled:
if TouchQuickNavigationKeysEnabled
	if !TouchQuickNavigationKeysAreLoaded
		LoadKeymapSection(KeyMapSection_ObjectQuickNavigation)
		TouchQuickNavigationKeysAreLoaded = true
	endIf
else
	;make sure to turn off virtual quick nav keys too,
	;so that type anywhere is not blocked:
	SetJCFOption(OPT_QUICK_KEY_NAVIGATION_MODE,0)
endIf
EndFunction

void function UnloadObjectNavigationKeyMaps(int navigation)
var
	int bLaptop = (FindKeyAliasMatch("JAWSKey") == "Capslock")
;Advanced layers on top of touch:
if navigation & ObjectNavigation_Advanced then
	UnloadKeymapSection(KeyMapSection_ObjectNavigation)
	if bLapTop then
		UnloadKeymapSection(KeyMapSection_ObjectNavigation_Laptop)
	endIf
EndIf
if navigation & ObjectNavigation_Touch then
	UnloadKeymapSection(KeyMapSection_TouchNavigation)
	if bLapTop then
		UnloadKeymapSection(KeyMapSection_TouchNavigation_Laptop)
	endIf
endIf
;additionally unload quick nav keys if they are loaded:
if TouchQuickNavigationKeysAreLoaded
	unloadKeymapSection(KeyMapSection_ObjectQuickNavigation)
	TouchQuickNavigationKeysAreLoaded = false
endIf
;make sure to restore virtual quick nav keys:
SetJCFOption(OPT_QUICK_KEY_NAVIGATION_MODE,
	GetIntOptionUserSetting(Section_Options,hKey_QuickKeyNavigationMode))
EndFunction

void function SetTouchNavigationMode(int navState, optional int bCancelTextReviewOnSuspension)
var
	int oldState = gc_ObjectNavConfigCachedInfo.currentNavState,
	int newState = navState
if oldState == newState
	;When switching configurations, keymaps loaded for touch navigation will unload.
	;So we need to make sure to reload them.
	if IsTouchCursor()
		LoadObjectNavigationKeyMaps(newState)
	endIf
	return
EndIf
if newState == ObjectNavigation_Suspended then
	if oldState == ObjectNavigation_Off return endIf
	gc_ObjectNavConfigCachedInfo.currentNavState = gc_ObjectNavConfigCachedInfo.currentNavState | ObjectNavigation_Suspended
	if oldState & ObjectNavigation_TextReview
		if bCancelTextReviewOnSuspension
			gc_ObjectNavConfigCachedInfo.currentNavState =
				gc_ObjectNavConfigCachedInfo.currentNavState & ~ObjectNavigation_TextReview
		EndIf
		DeactivateTouchCursorTextReviewMode()
	else
		if oldState == ObjectNavigation_Advanced then
			UnloadObjectNavigationKeyMaps(ObjectNavigation_Advanced | ObjectNavigation_Touch)
		else
			UnloadObjectNavigationKeyMaps(ObjectNavigation_Touch)
		EndIf
	endIf
	SetJCFOption(OPT_VIRTUAL_PC_CURSOR,GetJCFOptionFromFile(SECTION_OSM,hkey_UseVirtualPCCursor))
	KillUIAObject()
	UIARemoveAllEvents()
	UpdateGestureModeToKeyboardNavState()
	return
elif oldState & ObjectNavigation_Suspended then
	oldState = oldState & ~ObjectNavigation_Suspended
	if newState == ObjectNavigation_Off
		gc_ObjectNavConfigCachedInfo.savedNavState = oldState
		gc_ObjectNavConfigCachedInfo.currentNavState = NewState
		UpdateGestureModeToKeyboardNavState()
		return
	endIf
	if newState == oldState
		if !g_UIA
			CreateUIAObject()
		else
			UpdateUIAElementRectangle(g_UIATreeWalker.currentElement)
		endIf
		gc_ObjectNavConfigCachedInfo.currentNavState = NewState
		if newState & ObjectNavigation_TextReview
			ActivateTouchCursorTextReviewMode()
		elif newState == ObjectNavigation_Advanced then
			LoadObjectNavigationKeyMaps(ObjectNavigation_Advanced | ObjectNavigation_Touch)
		else
			LoadObjectNavigationKeyMaps(ObjectNavigation_Touch)
		EndIf
		SetJCFOption(OPT_VIRTUAL_PC_CURSOR,0)
		UpdateGestureModeToKeyboardNavState()
		return
	endIf
endIf
gc_ObjectNavConfigCachedInfo.savedNavState = oldState
gc_ObjectNavConfigCachedInfo.currentNavState = NewState
if newState == ObjectNavigation_Off then
	if oldState & ObjectNavigation_TextReview then
		DeactivateTouchCursorTextReviewMode()
	else
		if oldState == ObjectNavigation_Advanced then
			UnloadObjectNavigationKeyMaps(ObjectNavigation_Advanced | ObjectNavigation_Touch)
		else
			UnloadObjectNavigationKeyMaps(ObjectNavigation_Touch)
		endIf
	endIf
	SetJCFOption(OPT_VIRTUAL_PC_CURSOR,GetJCFOptionFromFile(SECTION_OSM,hkey_UseVirtualPCCursor))
	UpdateUIAElementRectangle()
	UIARemoveAllEvents()
	UpdateGestureModeToKeyboardNavState()
	return
endIf
if newState & ObjectNavigation_TextReview then
	if oldState == ObjectNavigation_Advanced then
		UnloadObjectNavigationKeyMaps(ObjectNavigation_Advanced | ObjectNavigation_Touch)
	else
		UnloadObjectNavigationKeyMaps(ObjectNavigation_Touch)
	EndIf
	if !ActivateTouchCursorTextReviewMode() then
		gc_ObjectNavConfigCachedInfo.currentNavState = newState & ~ObjectNavigation_TextReview
		if oldState == ObjectNavigation_Advanced then
			LoadObjectNavigationKeyMaps(ObjectNavigation_Advanced | ObjectNavigation_Touch)
		else
			LoadObjectNavigationKeyMaps(ObjectNavigation_Touch)
		EndIf
		SetJCFOption(OPT_VIRTUAL_PC_CURSOR,0)
		UpdateGestureModeToKeyboardNavState()
		return
	endIf
elif newState == ObjectNavigation_Touch then
	if oldState & ObjectNavigation_TextReview then
		DeactivateTouchCursorTextReviewMode()
		LoadObjectNavigationKeyMaps(ObjectNavigation_Touch)
	elif oldState == ObjectNavigation_Advanced then
		UnloadObjectNavigationKeyMaps(ObjectNavigation_Advanced)
	else ;was off
		LoadObjectNavigationKeyMaps(ObjectNavigation_Touch)
	EndIf
elif newState == ObjectNavigation_Advanced then
	if oldState & ObjectNavigation_TextReview then
		DeactivateTouchCursorTextReviewMode()
	EndIf
	if oldState == ObjectNavigation_Touch then
		LoadObjectNavigationKeyMaps(ObjectNavigation_Advanced)
	else ;was off or text review:
		LoadObjectNavigationKeyMaps(ObjectNavigation_Advanced | ObjectNavigation_Touch)
	EndIf
EndIf
SetJCFOption(OPT_VIRTUAL_PC_CURSOR,0)
if !g_UIA
	CreateUIAObject()
else
	UpdateUIAElementRectangle(g_UIATreeWalker.currentElement)
endIf
UpdateGestureModeToKeyboardNavState()
EndFunction

void function SuspendObjectNavigation(optional int bCancelTextReview)
SetTouchNavigationMode(ObjectNavigation_Suspended,bCancelTextReview)
EndFunction

void function ResumeObjectNavigation(optional int bSuppressTouchCursorAnnouncement)
SetTouchNavigationMode(gc_ObjectNavConfigCachedInfo.currentNavState & ~ObjectNavigation_Suspended)
;Touch cursor announcement should be automatically spoken in this function if it was called as a result of scheduling.
;If this function was called as a result of configuration change and not scheduled,
;the ConfigurationChangedEvent handles announcement of the touch cursor activation.
if !bSuppressTouchCursorAnnouncement
&& IsTouchCursor()
	SayMessage (ot_status, cmsgTouchCursor_L, cmsgTouchCursor_S)
EndIf
BrailleRefresh()
endFunction

void function FlushTouchNavigationConfiguration(string ConfigName)
var	collection c = gc_ObjectNavConfigCachedInfo.automatic
CollectionRemoveItem(c,configName)
EndFunction

void function UpdateObjectNavigationMode(string ConfigName)
var
	collection c_auto,
	collection c,
	int prevAutoSetting
c_auto = gc_ObjectNavConfigCachedInfo.automatic
;Get the automatic touch cursor activation settings for the configuration which is unloading:
if gc_ObjectNavConfigCachedInfo.currentConfig
	prevAutoSetting = ReadSettingInteger(SECTION_NONJCF_OPTIONS, hKey_AutomaticTouchCursorActivation, 0, FT_CURRENT_JCF,rsStandardLayering, gc_ObjectNavConfigCachedInfo.currentConfig)
endIf
;Make sure the auto collection have the automatic touch cursor activation setting for this config:
if !CollectionItemExists(c_auto,ConfigName)
	c_auto[ConfigName] = GetNonJCFOption(hKey_AutomaticTouchCursorActivation)
EndIf
;Update the current config member to the configuration which is loading:
gc_ObjectNavConfigCachedInfo.currentConfig = ConfigName
;Is the touch cursor suspended because the user buffer was active:
if IsObjectNavigationSuspended() then
	ResumeObjectNavigation(true)
	return
endIf
UIARemoveAllEvents()
;Now set the touch cursor mode for the loading configuration:
SetTouchNavigationMode(c_auto[configName])
;Finally, when transitioning from a configuration where automatic touch cursor activation was on to one where it is off,
;make sure that the default touch cursor mode can be reinstated when the touch cursor becomes activated:
if prevAutoSetting
&& !c_auto[ConfigName]
	gc_ObjectNavConfigCachedInfo.savedNavState= gc_ObjectNavConfigCachedInfo.defaultNavMode
endIf
EndFunction

int function ActivateTouchCursor()
if !(IsLeftButtonDown() || IsRightButtonDown())
&& !IsTouchCursor() then
	if gc_ObjectNavConfigCachedInfo.savedNavState & ObjectNavigation_Touch
	|| gc_ObjectNavConfigCachedInfo.savedNavState & ObjectNavigation_Advanced then
		;The touch cursor has been activated at least once,
		;and the user may have switched from the default setting for the touch cursor.
		;So use the currently set state of advanced or non-advanced:
		SetTouchNavigationMode(gc_ObjectNavConfigCachedInfo.savedNavState & ~ObjectNavigation_TextReview)
	else
		;This is the first activation of the touch cursor,
		;so activate the touch cursor to the default state that it was configured to used:
		SetTouchNavigationMode(gc_ObjectNavConfigCachedInfo.defaultNavMode)
	endIf
	BrailleRefresh()
EndIf
if IsTouchCursor() then
	ManageTemporaryRotorItems()
	ManageListenerForCurrentElementChanges()
	return true
else
	PlayTouchNavigationErrorSound()
	return false
endIf
EndFunction

void function ExitTouchNavigation()
if IsObjectNavigationActive() then
	SetTouchNavigationMode(objectNavigation_Off)
	BrailleRefresh()
EndIf
EndFunction

void function TurnOnTouchNavigationTextReview()
if !IsObjectNavigationActive()
|| IsObjectTextReviewModeActive() then
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return
EndIf
if SetTouchNavigationMode(gc_ObjectNavConfigCachedInfo.currentNavState | ObjectNavigation_TextReview)
	BrailleRefresh()
EndIf
EndFunction

void function TurnOffTouchNavigationTextReview()
if IsObjectTextReviewModeActive() then
	SetTouchNavigationMode(gc_ObjectNavConfigCachedInfo.currentNavState& ~ObjectNavigation_TextReview)
	BrailleRefresh()
EndIf
EndFunction

void function UseAdvancedObjectNavigationMode(int bSetting)
if bSetting then
	SetTouchNavigationMode(ObjectNavigation_Advanced)
else
	SetTouchNavigationMode(ObjectNavigation_Touch)
EndIf
UpdateTreeWalkerWithNewConditions()
EndFunction

int function GetTouchNavElementBrlSubtype()
if !g_UIATreeWalker return wt_Unknown endIf
return g_UIABrlControlTypes[(g_UIATreeWalker.currentElement.controlType)-UIABrlArrayIndexOffsetFromControlType]
EndFunction

string function GetTouchNavElementBrlSubtypeString()
return BrailleGetSubtypeString(GetTouchNavElementBrlSubtype())
EndFunction

string function GetTouchNavElementBrlStateString(int SubtypeCode)
var
	object ExpandCollapsePattern, object TogglePattern,
	int StateBits
ExpandCollapsePattern = g_UIATreeWalker.currentElement.GetExpandCollapsePattern
if ExpandCollapsePattern then
	if SubtypeCode == wt_Menu
	|| SubtypeCode == wt_ContextMenu
		StateBits = StateBits | CTRL_SUBMENU
	endIf
	If ExpandCollapsePattern.ExpandCollapseState == 0 then
		StateBits = StateBits | CTRL_COLLAPSED
	ElIf ExpandCollapsePattern.ExpandCollapseState == 1
	|| ExpandCollapsePattern.ExpandCollapseState == 2 then
		StateBits = StateBits | CTRL_EXPANDED
	EndIf
else
	;the tree branch that appears when a menu is expanded
	;has an element of type menu as parent to the menu items,
	;but it has no ExpandCollapsePattern:
	if (SubtypeCode == wt_Menu || SubtypeCode == wt_ContextMenu)
	&& g_UIATreeWalker.currentElement.ControlType == UIA_MenuControlTypeId
		StateBits = StateBits | CTRL_SUBMENU
	endIf
endIf
TogglePattern = g_UIATreeWalker.currentElement.GetTogglePattern
if TogglePattern then
	If TogglePattern.ToggleState == 0 then
		StateBits = StateBits | CTRL_UNCHECKED
	ElIf TogglePattern.ToggleState == 1 then
		StateBits = StateBits | CTRL_CHECKED
	ElIf TogglePattern.ToggleState == 2 then
		StateBits = StateBits | CTRL_PARTIALLY_CHECKED
	endIf
endIf
if ! g_UIATreeWalker.currentElement.isEnabled then
	StateBits = StateBits | CTRL_DISABLED
endIf
if StateBits then
	return BrailleGetStateString (StateBits)
endIf
EndFunction

string Function GetTouchNavElementBrlPositionString(int SubtypeCode)
if SubtypeCode == WT_TABLECELL then
	var object pattern = g_UIATreeWalker.currentElement.GetGridItemPattern();
	return FormatString( cmsgColumnRowCoordinates, pattern.column + 1, pattern.row + 1);
endIf
return cscNull
endFunction

string function GetTouchNavElementName()
return g_UIATreeWalker.currentElement.Name
EndFunction

string function BrailleGetObjectNameForTouchNavElement()
var string name = g_UIATreeWalker.currentElement.Name
if g_UIATreeWalker.currentElement.controlType == UIA_ListItemControlTypeId
	var object current = g_UIATreeWalker.currentElement
	g_UIATreeWalker.GotoParent()
	if g_UIATreeWalker.currentElement
	&& g_UIATreeWalker.currentElement.controlType == UIA_ListControlTypeId
		name = g_UIATreeWalker.currentElement.Name
	endIf
	g_UIATreeWalker.currentElement = current
endIf
return name
EndFunction

string function GetTouchNavElementValue()
return GetValueString(g_UIATreeWalker.currentElement)
EndFunction

string function BrailleGetObjectValueForTouchNavElement()
var
	int type = g_UIATreeWalker.currentElement.controlType,
	string name = g_UIATreeWalker.currentElement.Name
if type == UIA_ListItemControlTypeId
	return name
endIf
var
	string value = GetValueString(g_UIATreeWalker.currentElement)
;These are control types which in braille are represented as static text:
if type == UIA_DocumentControlTypeId
|| type == UIA_WindowControlTypeId
|| type == UIA_PaneControlTypeId
|| type == UIA_CustomControlTypeId
|| type == UIA_TextControlTypeId
|| type == UIA_GroupControlTypeId
|| type == UIA_ThumbControlTypeId
	;Some of these types should have the localized role string appended to the text.
	;Some have no text, so the only output will be the localized role.
	var string role = g_UIATreeWalker.currentElement.ariaRole
	if role
	&& StringContains(uiaAriaRolesTypeText,role)
		var string localizedType = g_UIATreeWalker.currentElement.LocalizedControlType
		return StringTrimLeadingBlanks(name+cscSpace+localizedType)
	endIf
	if name && !value
		return name
	endIf
endIf
return value
EndFunction

int function TouchElementIsSelected()
if !g_UIATreeWalker.currentElement return cscNull EndIf
var object pattern = g_UIATreeWalker.currentElement.GetSelectionItemPattern()
return pattern && pattern.isSelected
EndFunction

void function NotifyTouchQuickNavigationFailed(int bForward, string sElement)
var	string sMsg
If bForward
	Let sMsg = FormatOutputMessage(ot_error, false,
		cvmsgNoMoreElements_L, cvmsgNoMoreElements_S, sElement)
else
	Let sMsg = FormatOutputMessage(ot_error, false,
		cvmsgNoPriorElements_L, cvmsgNoPriorElements_S, sElement)
endIf
SayMessage(OT_ERROR, sMsg)
endFunction

void function UIAGoToRadioButton(int direction)
UIAGoToElementType(UIA_RadioButtonControlTypeId,direction,msgTouchTypeRadioButtons)
EndFunction

void function UIAGoToButton(int direction)
var
	Collection Types
Types = new collection
Types["Buttons"] = UIA_ButtonControlTypeId
Types["SplitButtons"] = UIA_SplitButtonControlTypeId
UIAGoToElementType(Types,direction,msgTouchTypeButtons)
EndFunction

void function UIAGoToComboBox(int direction)
UIAGoToElementType(UIA_ComboBoxControlTypeId,direction,msgTouchTypeComboBoxes)
EndFunction

void function UIAGoToDocument(int direction)
UIAGoToElementType(UIA_DocumentControlTypeId,direction,msgTouchTypeDocuments)
EndFunction

void function UIAGoToEdit(int direction)
UIAGoToElementType(UIA_EditControlTypeId,direction,msgTouchTypeEdits)
EndFunction

void function UIAGoToFormControl(int direction)
UIAGoToElementType(g_TouchQuickNavElements[touchRotorMemberFormControls],direction,msgTouchTypeFormControls)
EndFunction

void function UIAGoToImage(int direction)
UIAGoToElementType(UIA_ImageControlTypeId,direction,msgTouchTypeImages)
EndFunction

void function UIAGoToHeading(int direction)
UIAGoToElementType("heading",direction,msgTouchTypeHeadings)
EndFunction

void function UIAGoToListItem(int direction)
UIAGoToElementType(UIA_ListItemControlTypeId,direction,msgTouchTypeListItems)
EndFunction

void function UIAGoToHyperlink(int direction)
UIAGoToElementType(UIA_HyperlinkControlTypeId,direction,msgTouchTypeLinks)
EndFunction

void function UIAGoToList(int direction)
UIAGoToElementType(UIA_ListControlTypeId,direction,msgTouchTypeLists)
EndFunction

void function UIAGoToMenu(int direction)
var
	Collection Types
Types = new collection
Types["MenuBars"] = UIA_MenuBarControlTypeId
Types["Menus"] = UIA_MenuControlTypeId
Types["MenuItems"] = UIA_MenuItemControlTypeId
UIAGoToElementType(Types,direction,msgTouchTypeMenus)
EndFunction

void function UIAGoToToolBar(int direction)
UIAGoToElementType(UIA_ToolBarControlTypeId,direction,msgTouchTypeToolBars)
EndFunction

void function UIAGoToPane(int direction)
UIAGoToElementType(UIA_PaneControlTypeId,direction,msgTouchTypePanes)
EndFunction

void function UIAGoToTab(int direction)
var
	Collection Types
Types = new collection
Types["Tabs"] = UIA_TabControlTypeId
Types["TabItems"] = UIA_TabItemControlTypeId
UIAGoToElementType(Types,direction,msgTouchTypeTabs)
EndFunction

void function UIAGoToRegion(int direction)
UIAGoToElementType("region",direction,msgTouchTypeRegions)
EndFunction

void function UIAGoToLandmark(int direction)
UIAGoToElementType("landmark",direction,msgTouchTypeLandmarks)
EndFunction

void function UIAGoToStaticText(int direction)
UIAGoToElementType(UIA_TextControlTypeId,direction,msgTouchTypeTexts)
EndFunction

void function UIAGoToTable(int direction)
var
	Collection Types
Types = new collection
Types["Tables"] = UIA_TableControlTypeId
Types["DataGrids"] = UIA_DataGridControlTypeId
UIAGoToElementType(Types,direction,msgTouchTypeTables)
EndFunction

void function UIAGoToGroup(int direction)
UIAGoToElementType(UIA_GroupControlTypeId,direction,msgTouchTypeGroups)
EndFunction

void function UIAGoToTree(int direction)
UIAGoToElementType(UIA_TreeControlTypeId,direction,msgTouchTypeTrees)
EndFunction

void function UIAGoToCheckBox(int direction)
UIAGoToElementType(UIA_CheckBoxControlTypeId,direction,msgTouchTypeCheckboxes)
EndFunction

void function UIAGoToStatusBar(int direction)
UIAGoToElementType(UIA_StatusBarControlTypeId,direction,msgTouchTypeStatusBars)
EndFunction

void function PlayTouchNavigationErrorSound()
PlaySound(FindJAWSSoundFile(g_TouchNavigationSounds.TouchNavigationErrorSound))
EndFunction

int function UsingTouchNavigationSounds()
return gb_UseTouchNavigationSounds
EndFunction

int function ShouldAddTouchCursorOptionsConfigureTypesBranchToQuickSettings()
return gc_ObjectNavConfigCachedInfo.currentNavState != ObjectNavigation_Off
EndFunction

int function HasAppUIACustomizedTypeConfigurationsFromUser()
var	string fileName = GetActiveConfiguration()
if !fileName return false endIf
return IniReadSectionKeysEx(section_TouchNavigationTypes,FLOC_USER_SETTINGS,fileName+FileExt_JCF) != cscNull
EndFunction

object Function GetProcessTopLevelObject()
CreateUIAObject()
var
	object mainCondition,
	object anotherCondition,
	object orCondition
mainCondition = g_UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_WindowControlTypeId)
anotherCondition = g_UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_PaneControlTypeId)
orCondition = g_UIA.CreateOrCondition(mainCondition, AnotherCondition)
mainCondition = orCondition
anotherCondition = g_UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_CustomControlTypeId)
orCondition = g_UIA.CreateOrCondition(mainCondition, AnotherCondition)
mainCondition = orCondition
var object treeWalker = g_UIA_CreateTreeWalkerWithCondition(mainCondition)
if !treeWalker
	if g_UIADebugging SayString(msgDebug_FailedToGetTreeWalker) endIf
	return Null()
EndIf
var object element = GetUIAFocusElement(g_UIA).BuildUpdatedCache()
if ! element
	if g_UIADebugging SayString(msgDebug_FailedToGetCurrentElement) endIf
	return Null()
EndIf
treeWalker.currentElement = element
while treeWalker.GoToParent() element = treeWalker.currentElement EndWhile
return element
EndFunction

int function CreateAndAttachUIAEvents(object byRef eventObject)
if !eventObject
	eventObject = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
endIf
if !eventObject
	if g_UIADebugging SayString(msgDebug_FailedToCreateEventsObject) endIf
	return false
EndIf
if !ComAttachEvents(eventObject,UIAEventFunctionNamePrefix)
	if g_UIADebugging SayString(msgDebug_FailedToAttachUIAEvents) endIf
	eventObject = Null()
	return false
EndIf
if g_UIADebugging SayString(msgDebug_UIAAtachedEvents) endIf
return true
EndFunction

int function UIAStartListeningForFocusChange()
if !CreateAndAttachUIAEvents(g_UIAFocusChangedEventObject)	return false endIf
if g_UIAFocusChangedEventObject.AddFocusChangedEventHandler()
	if g_UIADebugging SayString(msgDebug_AddedFocusChangeHandler) endIf
	return true
else
	if g_UIADebugging SayString(msgDebug_FailedToAddFocusChangeHandler) endIf
	return false
EndIf
endFunction

void function UIAStopListeningForFocusChange()
g_UIAFocusChangedEventObject = Null()
if g_UIADebugging SayString(msgDebug_RemovedFocusChangeHandler) endIf
endFunction

int function UIAStartListeningForPropertyChange(object eventObject, int PropertyID, object Element, int Scope)
if !CreateAndAttachUIAEvents(eventObject)	return false endIf
if eventObject.AddPropertyChangedEventHandler( PropertyID, 		Element, Scope)
	if g_UIADebugging SayString(msgDebug_AddedPropertyChangeHandler) endIf
	return true
else
	if g_UIADebugging SayString(msgDebug_FailedToAddPropertyChangeHandler) endIf
	return false
EndIf
EndFunction

void function UIAStopListeningForPropertyChange(object eventObject)
eventObject  = Null()
if g_UIADebugging SayString(msgDebug_RemovedPropertyChangeHandler) endIf
EndFunction

int function UIAStartListeningForAutomationChange(object eventObject, int EventID, object Element, int Scope)
if EventID == UIA_MenuOpenedEventId return UIAStartListeningForMenuOpen() endIf
if !CreateAndAttachUIAEvents(eventObject) return false endIf
if eventObject.AddAutomationEventHandler( EventID, Element, Scope)
	if g_UIADebugging SayString(msgDebug_AddedAutomationEventHandler) endIf
	return true
else
	if g_UIADebugging SayString(msgDebug_FailedToAddAutomationEventHandler) endIf
	return false
EndIf
EndFunction

void function UIAStopListeningForAutomationChange(object eventObject)
eventObject = Null()
if g_UIADebugging SayString(msgDebug_RemovedAutomationEventHandler) endIf
EndFunction

int function UIAStartListeningForMenuOpen()
;The menu open must listen for the event occuring in descendents of the application UIA object.
;The context menu open must listen one level higher than the application object.
;We will handle menu open event as a special case,
;rather than using the UIAStartListeningForAutomationChange function to handle it as a general automation event.
;only allow one menu open listener at a time:
g_UIAMenuOpenedEventObject = null()
g_UIAMenuOpenedEventObject = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !ComAttachEvents(g_UIAMenuOpenedEventObject,UIAEventFunctionNamePrefix)
	gb_ListeningForContextMenuOpen = false
	g_UIAMenuOpenedEventObject = null()
	return
endIf
var object o
if gb_ListeningForContextMenuOpen
	gb_ListeningForContextMenuOpen = false
	o = g_UIAMenuOpenedEventObject.GetRootElement()
else
	o = GetProcessTopLevelObject()
endIf
if !o return false endIf
if g_UIAMenuOpenedEventObject.AddAutomationEventHandler(UIA_MenuOpenedEventId, o, TreeScope_Descendants)
	if g_UIADebugging SayString(msgDebug_AddedMenuOpenEventHandler) endIf
	return true
else
	if g_UIADebugging SayString(msgDebug_FailedToAddMenuOpenEventHandler) endIf
	return false
EndIf
EndFunction

void function UIAStopListeningForMenuOpen()
g_UIAMenuOpenedEventObject = Null()
if g_UIADebugging SayString(msgDebug_RemovedMenuOpenEventHandler) endIf
endFunction

void function UIAGoToFirstMenuItem()
CreateUIAObject()
UIAGoToFirstInTree( g_UIATreeWalker)
UIAGoToElementType(UIA_MenuItemControlTypeId,true)
UIAStopListeningForMenuOpen()
if g_UIATreeWalker.currentElement.controlType == UIA_MenuItemControlTypeId
UIASayElement(g_UIATreeWalker.currentElement,	true,true)
endIf
EndFunction

void function UIARemoveAllEvents()
UIAStopListeningForFocusChange()
UIAStopListeningForMenuOpen()
EndFunction

;UIAEvent: void function FocusChangedEvent(object element)
void function UIAEvent_FocusChangedEvent( object element )
if g_UIADebugging
	SayString( FormatString(msgDebug_UIAEvent_FocusChange,
		element.Name))
endIf
EndFunction

;UIAEvent: void function PropertyChangedEvent(object element, int propertyID, variant newValue)
void function UIAEvent_PropertyChangedEvent( object element, int propertyID, variant newValue )
if g_UIADebugging
	SayString(FormatString(msgDebug_UIAEvent_PropertyChange,
		newValue , element.LocalizedControlType, IntToString( propertyID)))
endIf
EndFunction

;UIAEvent: void function AutomationEvent(object element, int eventID)
void function UIAEvent_AutomationEvent( object element, int eventID )
if g_UIADebugging
	SayString(FormatString(msgDebug_UIAEvent_AutomationEvent,
		IntToString(eventID), element.name))
endIf
if eventID == UIA_MenuOpenedEventId
	if !g_UIADebugging  then StopSpeech() endIf
	ScheduleFunction("UIAGoToFirstMenuItem",3)
endIf
EndFunction

int function TouchNavigationHotKeys()
var
	string sMsg
if !IsObjectNavigationActive() then
	return false
endIf
g_SuspendedNavigationLocation = g_UIATreeWalker.currentElement
if IsObjectTextReviewModeActive() then
	sMsg = cmsgTouchNavigationTextReviewHotKeyHelp
else
	if IsTouchNavigationModeActive() then
		sMsg = cmsgTouchNavigationHotKeyHelp
	else ;advanced
		sMsg = FormatString(cmsgAdvancedObjectNavigationHotKeyHelp,
			GetScriptKeyName("ShowUIAElementProperties"),
			GetScriptKeyName("SayUIAPoint"),
			GetScriptKeyName("SayUIARect"),
			GetScriptKeyName("KillUIAObject"))
	endIf
	sMsg = sMsg+cscBufferNewLine+cscBufferNewLine+
		FormatString(cmsgGeneralObjectNavigationHotKeyHelp,
			GetScriptKeyName("TouchSayCurrentElement"),
			GetScriptKeyName("TouchSayAll"),
			GetScriptKeyName("TouchTextReviewOn"),
			GetScriptKeyName("RouteTouchToFocus"))
	sMsg = sMsg+cscBufferNewLine+cscBufferNewLine+
		FormatString(cmsgToggleAdvancedObjectNavigationHotKeyHelp,
			GetScriptKeyName("AdvancedObjectNavigationModeToggle"))
	if IsTouchQuickNavActive()
		;this is the message with list of quick nav keys:
		sMsg = sMsg+cscBufferNewLine+cscBufferNewLine+cmsgTouchNavigationQuickKeysHotKeyHelp
	endIf
	sMsg = sMsg+cscBufferNewLine+cscBufferNewLine+
		FormatString(cmsgTouchNavigationToggleQuickKeysHotKeyHelp,
			GetScriptKeyName("TouchQuickNavEnableToggle"))
endIf
sMsg = sMsg+cscBufferNewLine+cscBufferNewLine+cMsgBuffExit
SayFormattedMessage (OT_USER_BUFFER,sMsg)
return true
EndFunction

void function TouchNavNotifyByPlayOrSay(string Sound,
	optional int OutputType, string LongMsg, string ShortMsg)
if gb_UseTouchNavigationSounds then
	PlaySound(FindJAWSSoundFile(Sound))
	return
endIf
if LongMsg
	SayMessage(outputType,LongMsg,ShortMsg)
endIf
EndFunction

void function NotifyNotAvailableForTouchCursor()
TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound,
	ot_error,msgNotAvailableForTouchCursor_L,msgNotAvailableForTouchCursor_S)
endFunction

int function IsTouchQuickNavEnabled()
return TouchQuickNavigationKeysEnabled
endFunction

int function IsTouchQuickNavActive()
return TouchQuickNavigationKeysAreLoaded
EndFunction

void function SetTouchQuickKeyNavigationMode(int mode)
TouchQuickNavigationKeysEnabled = mode
if IsTouchCursor()
	if TouchQuickNavigationKeysEnabled
		if !TouchQuickNavigationKeysAreLoaded
			LoadKeymapSection(KeyMapSection_ObjectQuickNavigation)
			TouchQuickNavigationKeysAreLoaded = true
		endIf
	else
		if TouchQuickNavigationKeysAreLoaded
			UnloadKeymapSection(KeyMapSection_ObjectQuickNavigation)
			TouchQuickNavigationKeysAreLoaded = false
			;make sure to turn off virtual quick nav keys too,
			;so that type anywhere is not blocked:
			SetJCFOption(OPT_QUICK_KEY_NAVIGATION_MODE,0)
		endIf
	endIf
endIf
EndFunction

void function SetUseTouchNavigationSounds(int Setting)
gb_UseTouchNavigationSounds = Setting
if !g_TouchNavigationSounds
	g_TouchNavigationSounds = iniReadSectionToCollection (Section_TouchNavigationSounds, file_default_jcf, FLOC_SETTINGS)
	if !g_TouchNavigationSounds then
		gb_UseTouchNavigationSounds = false
	EndIf
EndIf
EndFunction

void function AutoStartSetTouchRotor(int setting)
InitQuickNavElementCollection()
if GetTouchNavRotorItemCount()
&& setting > 0
&& setting <= GNumOfFixedRotorElements
	g_touchQuickNavIndex = setting
	ManageTemporaryRotorItems()
endIf
endFunction

int function GetTouchCursorClickablePoint(int byRef x, int byRef y)
CreateUIAObject()
if !g_UIA return false EndIf
var object element = g_UIATreeWalker.currentElement
if !element.GetClickablePoint( IntRef(x),IntRef(y))
	return false
endIf
return true
EndFunction

object function TouchCursorObject()
if !g_UIA return Null() endIf
return g_UIATreeWalker.currentElement
EndFunction

void function UpdateCacheForTouchCursorObject()
if !g_UIA return endIf
g_UIATreeWalker.currentElement.BuildUpdatedCache()
EndFunction

int function CurrentScriptWasInvokedByGesture()
;gesture names are not localizeable
return StringContains(StringLower(GetCurrentScriptKeyName()),"finger")
EndFunction

int function GestureListHelpIsActive()
return ghWndResultsViewer
	&& GetWindowName(ghWndResultsViewer) == cmsgGestureListHelp_Title
endFunction

void function ShowGestureListHelp()
var
	int gestureMode,
	string sMsg
if UserBufferIsActiveResultsViewer()
	if GestureListHelpIsActive()
		;This help screen is already present and in focus:
		return
	endIf
	UserBufferDeactivateResultsViewer ()
EndIf
;We must make sure to deactivate the user buffer,
;since this function may be called from a link in the user buffer.
;failure to clear the user buffer may result in text not being added to the results viewer.
EnsureNoUserBufferActive()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle(cmsgGestureListHelp_Title)
gestureMode = GetGestureMode()
sMsg = FormatString(cmsgGestureListHelp_ModeInformation,GetCurrentGestureModeName())+cscBufferNewLine+cscBufferNewLine
if gestureMode == GestureMode_TouchNavigation
	sMsg = sMsg+FormatString(cmsgGestureListHelp_TouchNavigationMode,
		FormatString(cmsgGestureListHelp_TouchNavigationMode_ForItem,
			GetGestureLabel(GetGestureName("TouchSayCurrentElement")),
			GetGestureLabel(GetGestureName("TouchTapCurrentElement")),
			GetGestureLabel(GetGestureName("TouchRightClick")),
			GetGestureLabel(GetGestureName("GestureContextHelp"))),
		FormatString(cmsgGestureListHelp_TouchNavigationMode_Navigate,
			GetGestureLabel(GetGestureName("TouchNextElement")),
			GetGestureLabel(GetGestureName("TouchPriorElement")),
			GetGestureLabel(GetGestureName("TouchMoveToNextElementByType")),
			GetGestureLabel(GetGestureName("TouchMoveToPriorElementByType")),
			GetGestureLabel(GetGestureName("TouchChangeElementMovementNext")),
			GetGestureLabel(GetGestureName("TouchChangeElementMovementPrior")),
			GetGestureLabel(GetGestureName("TouchMoveToLastElement")),
			GetGestureLabel(GetGestureName("TouchMoveToFirstElement"))),
		FormatString(cmsgGestureListHelp_TouchNavigationMode_Misc,
			GetGestureLabel(GetGestureName("TouchSayAll")),
			GetGestureLabel(GetGestureName("TouchStopCurrentSpeechOutput")),
			GetGestureLabel(GetGestureName("MuteSynthesizer")),
			GetGestureLabel(GetGestureName("GestureEscape")),
			GetGestureLabel(GetGestureName("GestureCloseApp")),
			GetGestureLabel(GetGestureName("GestureToggleShowTouchKeyboard"))))
elif gestureMode == GestureMode_TextReading
	sMsg = sMsg+FormatString(cmsgGestureListHelp_TextReadingMode,
		FormatString(cmsgGestureListHelp_TextReadingMode_TextReadingPart1,
			GetGestureLabel(GetGestureName("TouchSayNextCharacter")),
			GetGestureLabel(GetGestureName("TouchSayPriorCharacter")),
			GetGestureLabel(GetGestureName("TouchSayNextWord")),
			GetGestureLabel(GetGestureName("TouchSayPriorWord")),
			GetGestureLabel(GetGestureName("TouchHome")),
			GetGestureLabel(GetGestureName("TouchEnd"))),
		FormatString(cmsgGestureListHelp_TextReadingMode_TextReadingPart2,
			GetGestureLabel(GetGestureName("TouchSayPriorLine")),
			GetGestureLabel(GetGestureName("TouchSayNextLine")),
			GetGestureLabel(GetGestureName("TouchSayPriorParagraph")),
			GetGestureLabel(GetGestureName("TouchSayNextParagraph")),
			GetGestureLabel(GetGestureName("TouchTopOfFile")),
			GetGestureLabel(GetGestureName("TouchBottomOfFile"))),
		FormatString(cmsgGestureListHelp_TextReadingMode_SayAll,
			GetGestureLabel(GetGestureName("GestureSayAll"))))
elif gestureMode == GestureMode_SpeechSettings
	sMsg = sMsg+FormatString(cmsgGestureListHelp_SpeechSettingsMode,
		GetGestureLabel(GetGestureName("IncreaseVoiceRatePermanent")),
		GetGestureLabel(GetGestureName("DecreaseVoiceRatePermanent")),
		GetGestureLabel(GetGestureName("IncreaseSystemVolume")),
		GetGestureLabel(GetGestureName("DecreaseSystemVolume")),
		GetGestureLabel(GetGestureName("GestureToggleTouchCursor")))
endIf
UserBufferAddTextResultsViewer("<html><body>")
UserBufferAddTextResultsViewer(smsg+cscBufferNewLine)
UserBufferAddTextResultsViewer(FormatString(cmsgGestureListHelp_CommonJAWSCommands,
		GetGestureLabel(GetGestureName("GestureRunJAWSManager")),
		GetGestureLabel(GetGestureName("GestureJAWSWindow")),
		GetGestureLabel(GetGestureName("GestureShutDownJAWS")),
		GetGestureLabel(GetGestureName("PassThroughNextGesture")),
		GetGestureLabel(GetGestureName("TogglePerModeGestures")))
	+cscBufferNewLine)
sMsg = FormatString(cmsgGestureListHelp_Link_GesturePractice,GetGestureLabel(GetGestureName("KeyboardHelp")))
UserBufferAddTextResultsViewer(sMsg, "$KeyboardHelp", sMsg,
	cFont_Aerial, 12, ATTRIB_UNDERLINE, rgbStringToColor(cColor_BLUE), rgbStringToColor(cColor_White))
UserBufferAddTextResultsViewer(cmsgGestureListHelp_Link_CloseResultsViewer,"UserBufferDeactivateResultsViewer",cmsgGestureListHelp_Link_CloseResultsViewer,
	cFont_Aerial, 12, ATTRIB_UNDERLINE, rgbStringToColor(cColor_BLUE), rgbStringToColor(cColor_White))
UserBufferAddTextResultsViewer("</body></html>")
UserBufferActivate()
EndFunction

void function ClearGestureLabels()
GestureLabel = Null()
EndFunction

void function InitGestureLabels()
var
	int finger,
	int fingerCount = StringSegmentCount(cmsgGestureNameFingerCountList,cscBufferNewLine),
	string fingerListItem,
	string fingerKey,
	int gesture,
	int gestureCount = StringSegmentCount(cmsgGestureNameGestureList,cscBufferNewLine),
	string gestureListItem,
	string gestureKey,
	string key,
	string label
if !GestureLabel
	GestureLabel = new collection
else
	CollectionRemoveAll(GestureLabel)
endIf
for finger = 1 to fingercount
	for gesture = 1 to gestureCount
		gestureListItem = StringSegment(cmsgGestureNameGestureList,cscBufferNewLine,gesture)
		gestureKey = StringSegment(gestureListItem,"=",1)
		fingerListItem = StringSegment(cmsgGestureNameFingerCountList,cscBufferNewLine,finger)
		fingerKey =StringSegment(fingerListItem,"=",1)
		key = fingerKey+"+"+gestureKey
		label = FormatString(cmsgReformattedGesturename,
			StringSegment(fingerListItem,"=",2),
			StringSegment(gestureListItem,"=",2))
		gestureLabel[key] = label
	endFor
endFor
EndFunction

string function GetGestureLabel(string gesture)
return GestureLabel[gesture]
EndFunction

void function ClearGestureMode()
GestureMode = Null()
EndFunction

void function InitGestureMode()
if !GestureMode
	GestureMode = new collection
endIf
GestureMode.current = GestureMode_TouchNavigation
GestureMode.saved = GestureMode_TouchNavigation
GestureMode.selecting = false
EndFunction

int function GetGestureMode()
return GestureMode.current
EndFunction

int function GestureModeIsTouchNavigation()
return GestureMode.current == GestureMode_TouchNavigation
EndFunction

int function GestureModeIsTextReading()
return GestureMode.current == GestureMode_TextReading
EndFunction

int function GestureModeIsSpeechSettings()
return GestureMode.current == GestureMode_SpeechSettings
EndFunction

void function EstablishGestureMode(int mode)
GestureMode.current = mode
SetGestureMode(mode)
GestureMode.selecting = false
;ManageSettingsGestureModeHook depends on the value of GestureMode.current, so call it only after setting the current mode:
ManageSettingsGestureModeHook()
EndFunction

void function SaveGestureMode()
GestureMode.saved = GestureMode.current
EndFunction

void function RestoreGestureMode()
EstablishGestureMode(GestureMode.saved)
EndFunction

int function SetGestureModeForTouchNavigation()
if !GestureModeIsAvailable(GestureMode_TouchNavigation) return false endIf
EstablishGestureMode(GestureMode_TouchNavigation)
return true
EndFunction

int function SetGestureModeForTextReading()
if !GestureModeIsAvailable(GestureMode_TextReading) return false endIf
EstablishGestureMode(GestureMode_TextReading)
return true
EndFunction

int function SetGestureModeForSpeechSettings()
if !GestureModeIsAvailable(GestureMode_SpeechSettings) return false endIf
EstablishGestureMode(GestureMode_SpeechSettings)
return true
EndFunction

int function GetNextGestureMode(int Mode, int seekNext)
;CycleAvailableGestureMode calls this to get the next or prior mode.
;It then test for validity of the new mode,
;and if the new mode is invalid continues to call this function until the new mode is valid.
if seekNext
	if mode == LastGestureMode
		return FirstGestureMode
	else
		return mode+1
	endIf
else
	if mode == FirstGestureMode
		return LastGestureMode
	else
		return mode-1
	endIf
endIf
endFunction

int function GestureModeIsAvailable(int mode)
;currently, the only restriction on mode validity is:
;text reading is invalid if the touch cursor is active and there is no text to review for the current element.
if (UserBufferIsActiveResultsViewer() || (UserBufferIsActive() && UserBufferGetText())) return true endIf
return !(mode == GestureMode_TextReading && !UIAGetCurrentElementText())
endFunction

int function CycleAvailableGestureMode(int nextMode)
CreateUIAObject()
;get the mode to be cycled to:
var int NewMode = GetNextGestureMode(gestureMode.current,nextMode)
while !GestureModeIsAvailable(newMode)
	newMode = GetNextGestureMode(newMode,nextMode)
endWhile
if newMode != gestureMode.current
	EstablishGestureMode(newMode)
	;Do not allow any restoration of a saved gesture mode when mode has been cycled:
	GestureMode.saved = gestureMode.current
endIf
;IsObjectNavigationActive() applies to keyboard navigation, not touch:
if IsObjectNavigationActive()
	if GestureMode.current == GestureMode_TouchNavigation
		SetTouchNavigationMode(ObjectNavigation_Touch)
	elif GestureMode.current == GestureMode_TextReading
		SetTouchNavigationMode(ObjectNavigation_TextReview)
	endIf
	return GestureMode.current
endIf
;Now process for gesture modes:
if GestureMode.current == GestureMode_TextReading
	;note that this does not activate text review for the keyboard.
	if !TouchCursorIsAtFocus()
		CreateUIAObject()
		ShowTextReviewOutput(true)
	endIf
else
	if TextReviewWindowIsActive()
		ClearTextReviewOutput(true)
	endIf
endIf
return GestureMode.current
EndFunction

string function GetCurrentGestureModeName()
return StringSegment(cmsgGestureModesList,cscBufferNewLine,(GestureMode.current)+1)
EndFunction

string function GetTouchContextHelpMessage()
CreateUIAObject()
var
	string s,
	string sMsg,
	string sActionList,
	string sActionItemFormat = "    %1\n",
	object element = g_UIATreeWalker.currentElement,
	object pattern = g_UIATreeWalker.currentElement.GetLegacyIAccessiblePattern()
if !element.isEnabled
	return cmsgThisControlIsDisabled
endIf
if element.helpText
	s = element.helpText
	sMsg = sMsg+s+cscBufferNewLine+cscBufferNewLine
EndIf
if pattern
	if pattern.description
		s = pattern.description
		sMsg = sMsg+s+cscBufferNewLine+cscBufferNewLine
	EndIf
	if pattern.help
		s = pattern.help
		sMsg = sMsg+s+cscBufferNewLine+cscBufferNewLine
	EndIf
endIf
s = GetGestureTutorMessage()
if s then sMsg = sMsg+s+cscBufferNewLine+cscBufferNewLine endIf
if element.GetPropertyValue( UIA_IsInvokePatternAvailablePropertyId )
	sActionList = sActionList+FormatString(sActionItemFormat,cmsgInvokeAvailableAction)
endIf
if element.GetPropertyValue( UIA_IsTogglePatternAvailablePropertyId )
	sActionList = sActionList+FormatString(sActionItemFormat,cmsgToggleAvailableAction)
EndIf
if element.GetPropertyValue( UIA_IsSelectionItemPatternAvailablePropertyId )
	var object selectionPattern = element.GetSelectionItemPattern()
	if selectionPattern.isSelected
		;exclude types where announcing deselect as an action makes no sense:
		if element.ControlType != UIA_RadioButtonControlTypeId
			sActionList = sActionList+FormatString(sActionItemFormat,cmsgDeselectAvailableAction)
		endIf
	else
		sActionList = sActionList+FormatString(sActionItemFormat,cmsgSelectAvailableAction)
	endIf
EndIf
if element.GetPropertyValue( UIA_IsScrollPatternAvailablePropertyId )
	sActionList = sActionList+FormatString(sActionItemFormat,cmsgScrollAvailableAction)
EndIf
if element.isKeyboardFocusable
&& !element.HasKeyboardFocus
	sActionList = sActionList+FormatString(sActionItemFormat,cmsgSetFocusAvailableAction)
endIf
if sActionList
	sMsg = sMsg+FormatString(cmsgTouchContextHelp_AvailableCommands,sActionList)
endIf
if element.isRequiredForForm
	sMsg = sMsg+cscBufferNewLine+cmsgControlIsRequiredForForm
EndIf
return sMsg
EndFunction

string function GetGestureTutorMessage()
if !g_UIA
|| !g_UIATreeWalker.currentElement
	return cscNull
endIf
var
	object pattern,
	string msg
pattern = g_UIATreeWalker.currentElement.GetLegacyIAccessiblePattern()
if pattern
&& pattern.defaultAction
	msg = FormatString(cmsgDefaultAction,pattern.defaultAction)
endIf
return msg
EndFunction

int function TouchCursorIsAtFocus()
if !g_UIA return UIAScriptError endIf
return g_UIATreeWalker.currentElement.HasKeyboardFocus
EndFunction

object function GetSemanticZoomElement()
CreateUIAObject()
var	object condition = g_UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_SemanticZoomControlTypeId)
var object treeWalker = g_UIA_CreateTreeWalkerWithCondition(condition)
if !treeWalker
	if g_UIADebugging SayString(msgDebug_FailedToGetTreeWalker) endIf
	return Null()
EndIf
var object element = GetUIAFocusElement(g_UIA).BuildUpdatedCache()
if ! element
	if g_UIADebugging SayString(msgDebug_FailedToGetCurrentElement) endIf
	return Null()
EndIf
treeWalker.currentElement = element
while treeWalker.GoToParent() element = treeWalker.currentElement EndWhile
return element
EndFunction

int function SetSemanticZoom(int state)
var object o = GetSemanticZoomElement()
if !o
|| o.ControlType != UIA_SemanticZoomControlTypeId
|| !o.isEnabled
	return false
endIf
var object pattern = o.GetTogglePattern()
if !pattern return false EndIf
if state == pattern.toggleState return UIAScriptError endIf
pattern.toggle()
return true
EndFunction

object function FindScrollPatternForElement(object element)
if !g_UIA || !element return Null() endIf
if element.GetPropertyValue(UIA_IsScrollPatternAvailablePropertyId)
	return element.GetScrollPattern()
endIf
var
	object ProcessCondition = g_UIA.CreateIntPropertyCondition(UIA_ProcessIdPropertyId,GetUIAFocusElement(g_UIA).ProcessID),
	object treeWalkerCondition = g_UIA.CreateAndCondition(processCondition,g_UIA.CreateRawViewCondition()),
	object treeWalker = g_UIA.CreateTreeWalker(treeWalkerCondition)
if !treewalker return Null() endIf
treeWalker.currentElement = element
while treeWalker.GoToParent()
	if treeWalker.currentElement.GetPropertyValue(UIA_IsScrollPatternAvailablePropertyId)
		return treeWalker.currentElement.GetScrollPattern()
	endIf
EndWhile
return Null()
endFunction

void function TouchScroll(int direction)
CreateUIAObject()
var object pattern = FindScrollPatternForElement(g_UIATreeWalker.currentElement)
if !pattern
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return
endIf
var object percentage
if direction == Screen_Move_Left
|| direction == Screen_Move_Right
	if !pattern.horizontallyScrollable
		TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
		return
	else
		percentage = pattern.HorizontalScrollPercent
	endIf
else
	if !pattern.VerticallyScrollable
		TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
		return
	else
		percentage = pattern.VerticalScrollPercent
	endIf
endIf
var
	int horizontal = ScrollAmount_NoAmount,
	int vertical = ScrollAmount_NoAmount,
	string msg
if direction == Screen_Move_Left && percentage  > 0
	msg = cmsgTouchScroll_Left
	horizontal = ScrollAmount_LargeDecrement
elif direction == Screen_Move_Right && percentage < 100
	msg = cmsgTouchScroll_Right
	horizontal = ScrollAmount_LargeIncrement
elif direction == Screen_Move_Up && percentage > 0
	msg = cmsgTouchScroll_Up
	vertical = ScrollAmount_LargeDecrement
elif direction == Screen_Move_Down && percentage < 100
	msg = cmsgTouchScroll_Down
	vertical = ScrollAmount_LargeIncrement
else
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return
endIf
pattern.scroll(horizontal,vertical)
SayUsingVoice(vctx_message,msg,ot_JAWS_message)
EndFunction

int function ChangeRangeValue(int Increase)
CreateUIAObject()
var object element = g_UIATreeWalker.currentElement.BuildUpdatedCache()
var object pattern = element.GetRangeValuePattern()
if !pattern	return false endIf
var
	int min = pattern.minimum,
	int max = pattern.maximum,
	int value = pattern.value,
	int change
;Change is an arbitrary value,
;because the values retrieved for LargeChange and SmallChange for RangeValue may not be useable.
;Note that setting change to a value of 1 may be too small and may not result in an actual change when used with SetValue.
change = 5
if Increase
	value = value+change
	if value > max value = max endIf
else
	value = value-change
	if value < min value = min endIf
endIf
pattern.SetValue(value)
KillUIAObject()
CreateUIAObject()
return true
EndFunction

int function ToggleCurrentItemSelection()
CreateUIAObject()
var
	object element = g_UIATreeWalker.currentElement,
	object pattern = element.GetSelectionItemPattern()
if !pattern return false endIf
if pattern.isSelected
	pattern.RemoveFromSelection()
else
	pattern.AddToSelection()
endIf
KillUIAObject()
CreateUIAObject()
return true
EndFunction

void function RouteTouchToFocus()
CreateUIAObject()
SetCurrentElementToDeepestFocusElement(g_UIA,g_UIATreeWalker)
EndFunction

string function GetGestureEscapeSoundFileName()
return g_TouchNavigationSounds.GestureEscapeSound
EndFunction

string function GetGestureCloseAppSoundFileName()
return g_TouchNavigationSounds.GestureCloseAppSound
EndFunction

void function PlayTouchTapClickSound()
TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchClickSound)
EndFunction

object function UIAGetElementFromRangeRectangle(object range, optional int bReverseScroll)
var
	object rect,
	int x,
	int y
rect = range.GetBoundingRectangles()
if !rect.count
	range.ScrollIntoView(bReverseScroll)
	rect = range.GetBoundingRectangles()
endIf
if !rect.count return Null() endIf
CreateUIAObject()
x = (rect(0).left+rect(0).right)/2
y = (rect(0).top+rect(0).bottom)/2
return g_UIA.GetElementFromPoint( x, y )
EndFunction

object function UIAGetNearestChildRangeFromTextPattern(object textPattern, object element,
	optional int bSearchBackwards, object byRef childRangeElement)
if !textPattern || !element return Null() endIf
var
	object childRange
childRangeElement = Null()
ChildRange = textPattern.RangeFromChild( element)
if childRange
	childRangeElement = element
	return childRange
endIf
CreateUIAObject()
var object treeWalker = g_UIA.RawViewWalker()
if !treeWalker return Null() endIf
treeWalker.currentElement = element
while UIAWalkTheTree(treeWalker,bSearchBackwards)
	ChildRange = textPattern.RangeFromChild( treewalker.currentElement)
	if childRange
		childRangeElement = treewalker.currentElement
		return childRange
	endIf
endWhile
return Null()
EndFunction

object function UIAGetTextDocumentRange(optional object byRef element, object byRef textPattern)
element = Null()
textPattern = Null()
CreateUIAObject()
if !g_UIATreeWalker.currentElement return Null() endIf
var object textPatternCcondition = g_UIA.createBoolPropertyCondition( UIA_IsTextPatternAvailablePropertyId,UIATrue)
var object hasFocusCondition = g_UIA.createBoolPropertyCondition(UIA_HasKeyboardFocusPropertyId,UIATrue)
var object treeWalker = g_UIA_CreateTreeWalkerWithCondition(
	g_UIA.CreateOrCondition(textPatternCcondition,hasFocusCondition))
if !treeWalker return Null() endIf
treeWalker.currentElement = g_UIATreeWalker.currentElement
var	object documentRange
element = treeWalker.currentElement
textPattern = element.GetTextPattern()
if textPattern
	documentRange = textPattern.DocumentRange
	if documentRange return documentRange endIf
endIf
while treeWalker.gotoParent()
	element = treeWalker.currentElement
	textPattern = element.GetTextPattern()
	if textPattern
		documentRange = textPattern.DocumentRange
		if documentRange return documentRange endIf
	endIf
endWhile
element = Null()
textPattern = Null()
return Null()
EndFunction

void function TouchGoToElement(object element)
CreateUIAObject()
if !g_UIATreeWalker return endif
g_UIATreeWalker.currentElement = element
UIAMakeVisible( g_UIATreeWalker.currentElement )
EndFunction

object function UIAGetTextRangeAtPCCursor(optional object byRef textPattern)
textPattern = Null()
if UserBufferIsActive() return Null() endIf
var int x, int y
saveCursor()
InvisibleCursor()
SaveCursor()
RouteInvisibleToPC()
GetCursorPos(cursor_invisible,smmPixels,x,y)
RestoreCursor()
RestoreCursor()
if !x || !y return Null() endIf
;The retrieved coordinates may result in a text range that is slightly too far right and down, so offset them:
x = x-2
y = y-1
CreateUIAObject()
var object element = g_UIA.GetElementFromPoint(x,y).BuildUpdatedCache()
if !element return Null() endIf
textPattern = element.GetTextPattern()
if !textPattern return Null() endIf
return textPattern.rangeFromPoint(x,y)
EndFunction

string function UIAGetPCCursorTextRangeText(int TextUnit)
var object textRange = UIAGetTextRangeAtPCCursor()
if !textRange return cscNull endIf
textRange.ExpandToEnclosingUnit(textUnit)
return textRange.GetText(TextRange_NoMaxLength)
EndFunction

int function UIAMovePCCursorByTextUnit(int TextUnit, int direction, optional int bSpeak)
;it is sometimes possible to get a text range from Results Viewer,
;but the text range may not be navigable using UIA move methods,
;so just return false when Results Viewer is active:
if UserBufferIsActiveResultsViewer() return false endIf
var object textRange = UIAGetTextRangeAtPCCursor()
if !textRange return false endIf
var int moved = textRange.move(textUnit,direction)
if !moved
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	;Although no move occured, return should indicate that UIA was successful in processing the move request:
	return true
endIf
textRange.select()
if bSpeak
	var int outputType
	textRange.ExpandToEnclosingUnit(textUnit)
	if textUnit == textUnit_character
		outputType = ot_char
	elif textUnit == textUnit_Word
		outputType = ot_word
	else
		outputType = ot_line
	endIf
	Say(textRange.GetText(TextRange_NoMaxLength),outputType)
endIf
return true
EndFunction

int function TouchExploreLocationHasFocus()
return g_UIATreeWalker.currentElement.hasKeyboardFocus()
EndFunction

void function TrySetFocusToElementAtExploreLocation()
g_UIATreeWalker.currentElement.SetFocus()
g_UIATreeWalker.currentElement.buildUpdatedCache()
endFunction

int function UIAGetTextFromRangeAtExploreLocation(string byRef text, int textUnit)
text = cscNull
if !c_ExploreArea.x
|| !c_ExploreArea.y
|| UserBufferIsActive()
	return false
endIf
var object element = g_UIATreeWalker.currentElement
if !element return false endIf
var object textPattern = element.getTextPattern()
if !textPattern return false endIf
var object range = textPattern.RangeFromPoint(c_ExploreArea.x,c_ExploreArea.y)
if !range return false endIf
range.ExpandToEnclosingUnit(textUnit)
text = range.getText(TextRange_NoMaxLength)
return true
EndFunction

int function UIASayCharacterAtExploreLocation()
var
	int result,
	string text
result = UIAGetTextFromRangeAtExploreLocation(text,textUnit_character)
if !result return false endIf
Say(text,ot_char)
return true
EndFunction

string function UIAGetCharacter()
return UIAGetPCCursorTextRangeText(TextUnit_Character)
EndFunction

int function UIASayCharacter()
var string s = UIAGetCharacter()
if !s return false endIf
Say(s,ot_char)
EndFunction

int function UIASayCharacterValue ()
var string s = UIAGetCharacter()
if !s return false endIf
SayInteger(GetCharacterValue(s))
EndFunction

int function UIASayCharacterPhonetic()
var string s = UIAGetCharacter()
if !s return false endIf
Say(s,ot_phonetic_char)
EndFunction

int function UIANextCharacter()
return UIAMovePCCursorByTextUnit(TextUnit_Character,1,false)
EndFunction

int function UIASayNextCharacter()
return UIAMovePCCursorByTextUnit(TextUnit_Character,1,true)
EndFunction

int function UIAPriorCharacter ()
return UIAMovePCCursorByTextUnit(TextUnit_Character,-1,false)
EndFunction

int function UIASayPriorCharacter ()
return UIAMovePCCursorByTextUnit(TextUnit_Character,-1,true)
EndFunction

int function UIASayWordAtExploreLocation(int x, int y)
var
	int result,
	string text
result = UIAGetTextFromRangeAtExploreLocation(text,textUnit_Word)
if !result return false endIf
Say(text,ot_word)
return true
EndFunction

string function UIAGetWord()
return UIAGetPCCursorTextRangeText(TextUnit_Word)
EndFunction


int function UIASayWord()
var string s = UIAGetWord()
if !s return false endIf
Say(s,ot_word)
EndFunction

int function TouchSpellWord()
var string s = UIAGetWord()
if !s return false endIf
Say(s,ot_spell)
EndFunction

int function UIANextWord()
return UIAMovePCCursorByTextUnit(TextUnit_Word,1,false)
EndFunction

int function UIASayNextWord()
return UIAMovePCCursorByTextUnit(TextUnit_Word,1,true)
EndFunction

int function UIAPriorWord()
return UIAMovePCCursorByTextUnit(TextUnit_Word,-1,false)
EndFunction

int function UIASayPriorWord()
return UIAMovePCCursorByTextUnit(TextUnit_Word,-1,true)
EndFunction

string function UIAGetLine()
return UIAGetPCCursorTextRangeText(TextUnit_Line)
EndFunction

int function UIASayLine()
var string s = UIAGetLine()
if !s return false endIf
Say(s,ot_line)
EndFunction

int function UIANextLine()
return UIAMovePCCursorByTextUnit(TextUnit_Line,1,false)
EndFunction

int function UIASayNextLine()
return UIAMovePCCursorByTextUnit(TextUnit_Line,1,true)
EndFunction

int function UIAPriorLine ()
return UIAMovePCCursorByTextUnit(TextUnit_Line,-1,false)
EndFunction

int function UIASayPriorLine ()
return UIAMovePCCursorByTextUnit(TextUnit_Line,-1,true)
EndFunction

string function UIAGetParagraph()
return UIAGetPCCursorTextRangeText(TextUnit_Paragraph)
EndFunction

int function UIASayParagraph()
var string s = UIAGetParagraph()
if !s return false endIf
Say(s,ot_line)
EndFunction

int function UIANextParagraph()
return UIAMovePCCursorByTextUnit(TextUnit_Paragraph,1,false)
EndFunction

int function UIASayNextParagraph()
return UIAMovePCCursorByTextUnit(TextUnit_Paragraph,1,true)
EndFunction

int function UIAPriorParagraph()
return UIAMovePCCursorByTextUnit(TextUnit_Paragraph,-1,false)
EndFunction

int function UIASayPriorParagraph()
return UIAMovePCCursorByTextUnit(TextUnit_Paragraph,-1,true)
EndFunction

string function UIAGetPage()
return UIAGetPCCursorTextRangeText(TextUnit_Page)
EndFunction

int function UIASayPage()
var string s = UIAGetPage()
if !s return false endIf
Say(s,ot_SayAll)
EndFunction

int function UIANextPage()
return UIAMovePCCursorByTextUnit(TextUnit_Page,1,false)
EndFunction

int function UIASayNextPage()
return UIAMovePCCursorByTextUnit(TextUnit_Page,1,true)
EndFunction

int function UIAPriorPage()
return UIAMovePCCursorByTextUnit(TextUnit_Page,-1,false)
EndFunction

int function UIASayPriorPage()
return UIAMovePCCursorByTextUnit(TextUnit_Page,-1,true)
EndFunction

void function TouchToggleSelectionMode()
CreateUIAObject()
if TryProcessTouchForVirtualKeyboard(VKbd_Gesture_TripleTap) return endIf
if !GestureModeIsTextReading() return endIf
gestureMode.selecting = !gestureMode.selecting
if gestureMode.selecting
	Say(msgSelectionModeOn,ot_status)
else
	Say(msgSelectionModeOff,ot_status)
endIf
EndFunction

int function IsTouchSelectionModeActive()
return GestureModeIsTextReading()
	&& gestureMode.selecting
EndFunction

int function GestureActivateTextReview()
if GestureModeIsTextReading()
&& IsTextReadingAppropriateForCurrentElement()
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return false
endIf
if IsTouchCursor()
	SetTouchNavigationMode(ObjectNavigation_TextReview)
	if !IsObjectTextReviewModeActive()
		TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
		return false
	endIf
else
	if !ActivateTouchCursorTextReviewMode(true)
		return false
	endIf
endIf
if !GestureModeIsTextReading()
	if SetGestureModeForTextReading()
		AnnounceCurrentGestureMode()
		return true
	endIf
endIf
return true
endFunction

void function GestureDeactivateTextReview()
if IsTouchCursor()
	SetTouchNavigationMode(ObjectNavigation_Touch)
else
	DeactivateTouchCursorTextReviewMode(true)
endIf
if !GestureModeIsTouchNavigation()
	if SetGestureModeForTouchNavigation()
		AnnounceCurrentGestureMode()
	endIf
endIf
endFunction

void function GestureToggleTextReview()
CreateUIAObject()
if TextReviewWindowIsActive()
	GestureDeactivateTextReview()
	return
endIf
GestureActivateTextReview()
EndFunction

void function ProcessGestureSelectionModeOnFocusChange(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if !IsTouchSelectionModeActive() return endIf
;Typically, in order to allow selection in lists, do not change mode if depth of focus change is -1.
if nChangeDepth < 0 return endIf
if SetGestureModeForTouchNavigation()
	BlockStopSpeechDuringExploration(5)
	AnnounceCurrentGestureMode()
endIf
EndFunction

void function ScheduleAnnounceCurrentGestureMode()
;To handle scenarios where the call is from a continuous gesture,
;schedule the announcement to occur only once:
if Scheduled_AnnounceCurrentGestureMode
	UnscheduleFunction(Scheduled_AnnounceCurrentGestureMode)
endIf
Scheduled_AnnounceCurrentGestureMode = ScheduleFunction("AnnounceCurrentGestureMode",2)
EndFunction

void function AnnounceCurrentGestureMode()
Scheduled_AnnounceCurrentGestureMode = 0
var string modeName = GetCurrentGestureModeName()
SayMessage(ot_status,FormatString(cmsgGestureModeName_L,modeName),FormatString(cmsgGestureModeName_S,modeName))
EndFunction

void function ScheduleAnnounceCurrentGestureModeAsError()
;To handle scenarios where the call is from a continuous gesture,
;schedule the announcement to occur only once:
if Scheduled_AnnounceCurrentGestureMode
	UnscheduleFunction(Scheduled_AnnounceCurrentGestureMode)
endIf
Scheduled_AnnounceCurrentGestureMode = ScheduleFunction("AnnounceCurrentGestureModeAsError",2)
EndFunction

void function AnnounceCurrentGestureModeAsError()
Scheduled_AnnounceCurrentGestureMode = 0
var string modeName = GetCurrentGestureModeName()
PlayTouchNavigationErrorSound()
SayMessage(ot_status,FormatString(cmsgGestureModeName_L,modeName),FormatString(cmsgGestureModeName_S,modeName))
EndFunction

void function ManageSettingsGestureModeHook()
if gbKeyboardHelp
	;do nothing, the keyboard help hook is in place:
	return
endIf
if GestureMode.current == GestureMode_SpeechSettings
	;do not allow any gestures not configured in the settings mode to pass through:
	if !GestureMode.settingsHook 
		GestureMode.settingsHook  = true
		AddHook(HK_SCRIPT,"SettingsGestureModeHook")
		CaptureAllGestures(true)
	endIf
else
	;Allow all gestures when the mode is no longer settings:
	if GestureMode.settingsHook 
		GestureMode.settingsHook  = false
		RemoveHook(HK_SCRIPT,"SettingsGestureModeHook")
		CaptureAllGestures(false)
	endIf
endIf
EndFunction

int function SettingsGestureModeHook(string ScriptName)
ManageSettingsGestureModeHook()
return true
EndFunction

void function SetMostRecentJAWSGestureName(string gestureName)
MostRecentJAWSGestureName = gestureName
EndFunction

string function GetMostRecentJAWSGestureName()
return MostRecentJAWSGestureName 
EndFunction

object function GetDesiredScreenElementFromPoint(int x, int y, optional object oUIA, object treeWalker)
;Normally, use GetElementFromPoint.
;however, for screen exploration with gestures or with mouse speech,
;we may need to get the parent element if it has the same name and bounding rectangle
;as the element retrieved by GetElementFromPoint so that the proper element type is reported.
if !oUIA
	oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
	if !oUIA return Null() endIf
endIf
var object element = oUIA.GetElementFromPoint( x, y )
if element.controlType != UIA_TextControlTypeId
&& element.controlType != UIA_PaneControlTypeId
	return element
endIf
if !treeWalker
	treeWalker = CreateUIARawViewTreeWalker()
endIf
treeWalker.currentElement = element
treeWalker.gotoParent()
var object parent = treeWalker.currentElement
if parent.controlType == UIA_HyperLinkControlTypeId
&& parent.name == element.name
&& ElementBoundingRectsAreIdentical(parent,element)
	return parent
endIf
var object oChild
if element.controlType == UIA_PaneControlTypeId
&& !element.name
	;we may need a child element
	oChild = UIAGetElementWithPointInElementRect(element, x, y)
	if oChild
		element = oChild
	endIf
endIf
treeWalker.currentElement = element
return element
endFunction

void function ManageListenerForCurrentElementChanges()
UIA_CurrentElementListener = Null()
if !g_UIATreeWalker.currentElement return endIf
var object element = g_UIATreeWalker.currentElement
;Currently, only listening for range changes to progress bar elements:
if element.controlType != UIA_ProgressBarControlTypeId return endIf
UIA_CurrentElementListener = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !ComAttachEvents(UIA_CurrentElementListener,UIA_CurrentElementEventNamePrefix)
|| !UIA_CurrentElementListener.AddPropertyChangedEventHandler(UIA_RangeValueValuePropertyId, element, treeScope_element)
	UIA_CurrentElementListener = Null()
endIf
endFunction

void function UIA_CurrentElement_PropertyChangedEvent(object element, int propertyID, variant newValue)
g_UIATreeWalker.currentElement = Null()
g_UIATreeWalker.currentElement = element
BrailleRefresh()
EndFunction

void function ToggleExploreRestriction()
CreateUIAObject()
if ExploreRestrictionLevel == ExploreRestrict_Control
	ExploreRestrictionLevel = ExploreRestrict_None
else
	ExploreRestrictionLevel = ExploreRestrictionLevel+1
endIf
SetExploreRestrictionRect()
SayExploreRestrictionLevel()
EndFunction

void function ClearExploreRestrictionRect()
c_ExploreRestrictionRect.left = 0
c_ExploreRestrictionRect.top = 0
c_ExploreRestrictionRect.right = 0
c_ExploreRestrictionRect.bottom = 0
EndFunction

void function UpdateExploreRestrictionForElement(object element)
var object rect
if element
	rect = element.BoundingRectangle
endIf
if !element
|| !rect
|| (!rect.left && !rect.top && !rect.right && !rect.bottom)
	ExploreRestrictionLevel = ExploreRestrict_None
	ClearExploreRestrictionRect()
else
	c_ExploreRestrictionRect.left = rect.left
	c_ExploreRestrictionRect.top = rect.top
	c_ExploreRestrictionRect.right = rect.right
	c_ExploreRestrictionRect.bottom = rect.bottom
endIf
EndFunction

object function FindElementForExploreRestrictionToWindow(object element)
if element.controlType == UIA_WindowControlTypeId return element endIf
var object treeWalker = g_UIA.CreateTreeWalker(g_UIA.CreateRawViewCondition())
treeWalker.currentElement = element
while treeWalker.gotoParent()
	if treeWalker.currentElement.controlType == UIA_WindowControlTypeId return treeWalker.currentElement endIf
endWhile
;In some instances, such as the desktop, there is no window element in the ancestory.
;In this case, look for a pane element instead of a window.
treeWalker.currentElement = element
if element.controlType == UIA_PaneControlTypeId return element endIf
while treeWalker.gotoParent()
	if treeWalker.currentElement.controlType == UIA_PaneControlTypeId return treeWalker.currentElement endIf
endWhile
return Null()
EndFunction

void function SetExploreRestrictionRect()
if !c_ExploreRestrictionRect c_ExploreRestrictionRect = new collection endIf
if ExploreRestrictionLevel == ExploreRestrict_None
	ClearExploreRestrictionRect()
	return
endIf
if ExploreRestrictionLevel == ExploreRestrict_Window
	UpdateExploreRestrictionForElement(FindElementForExploreRestrictionToWindow(g_UIATreeWalker.currentElement))
elif ExploreRestrictionLevel == ExploreRestrict_Control
	UpdateExploreRestrictionForElement(g_UIATreeWalker.currentElement)
endIf
EndFunction

void function SayExploreRestrictionLevel()
if ExploreRestrictionLevel == ExploreRestrict_None
	Say(msgExploreRestrictionLevel_None,ot_status)
elif ExploreRestrictionLevel == ExploreRestrict_Window
	Say(msgExploreRestrictionLevel_Window,ot_status)
elif ExploreRestrictionLevel == ExploreRestrict_Control
	Say(msgExploreRestrictionLevel_Control,ot_status)
endIf
EndFunction

int function IsExploreOutsideOfRestrictedArea(int x, int y)
if ExploreRestrictionLevel == ExploreRestrict_None return false endIf
return x < c_ExploreRestrictionRect.left
	|| y < c_ExploreRestrictionRect.top
	|| x > c_ExploreRestrictionRect.right
	|| y > c_ExploreRestrictionRect.bottom
EndFunction

void function SayTouchCursorLocationAndAnyExploreRestriction()
var int x, int y
if !UIAGetPoint(x,y)
	var object rect = g_UIATreeWalker.currentElement.BoundingRectangle
	if rect
		x = (rect.left+rect.right)/2
		y = (rect.bottom+rect.top)/2
	endIf
endIf
BeginFlashMessage()
Say(FormatString(msgTouchCursorCenterPoint,IntToString(x),IntToString(y)),ot_status)
if ExploreRestrictionLevel != ExploreRestrict_None
	SayExploreRestrictionLevel()
	Say(FormatString(msgExploreRestrictionRectangleCoordinates,
			IntToString(c_ExploreRestrictionRect.left),
			IntToString(c_ExploreRestrictionRect.top),
			IntToString(c_ExploreRestrictionRect.right),
			IntToString(c_ExploreRestrictionRect.bottom)),
		ot_status)
endIf
EndFlashMessage()
EndFunction

const
	ArrayOfUIAElementPropertiesMAX = 300,
	UIAElementPropertiesSeparator = "\n\n----------------------------------------\n"

int function ShowArrayOfUIAElementPropertiesForSubtree()
if !IsTouchCursor() 
	SayMessage(ot_error, msgTouchCursorNotActiveError_L, msgTouchCursorNotActiveError_S)
	return false
endIf
var string msg, object elements, object condition, object o
condition = g_UIA.CreateRawViewCondition()
elements = g_UIATreeWalker.currentElement.findAll(TreeScope_Subtree,condition)
if !elements
	Say(msgCouldNotGetDiagnosticInformation,ot_error)
	return false
endIf
var int count = elements.count
if count > ArrayOfUIAElementPropertiesMAX
	SayMessage(ot_error, 
		FormatString(msgErrorTooManyElementsToProcess_L, IntToString(count), IntToString(ArrayOfUIAElementPropertiesMAX)),
		FormatString(msgErrorTooManyElementsToProcess_S, IntToString(count), IntToString(ArrayOfUIAElementPropertiesMAX)))
	return false
endIf
forEach o in elements
	msg = msg + UIAGetElementProperties(o) + UIAElementPropertiesSeparator
endForEach
if !msg return false endIf
g_SuspendedNavigationLocation = g_UIATreeWalker.currentElement
SayMessage(ot_user_buffer, msg		 )
return true
EndFunction

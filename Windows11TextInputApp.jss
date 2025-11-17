; Copyright 2021-2022 by Freedom Scientific, Inc.
; Windows 11 Emoji Panel and Clipboard Viewer

include "HJConst.jsh"
include "MSAAConst.jsh"
include "UIA.jsh"
include "common.jsm"
import "UIA.jsd"

const
	ID_framework_MicrosoftEdge = "MicrosoftEdge"

globals
	collection c_TextInputFocus
	; c_TextInputFocus caches things commonly tested for the keyboard focus.
	;
	; Members are:
	; object FocusedElement -- Result of GetKeyboardFocusElement ().
	; string ObjectNameUnfiltered -- Result of GetObjectNameUnfiltered(0).
	
function autoStartEvent()
InitNewTextInputCollections()
SayCurrentSelection()
endFunction

void function InitNewTextInputCollections()
if !c_TextInputFocus c_TextInputFocus = new collection endIf
endFunction

void function UpdateTextInputFocusCollection()
c_TextInputFocus.ObjectNameUnfiltered = GetObjectNameUnfiltered(0)
c_TextInputFocus.FocusedElement = GetKeyboardFocusElement ()
endFunction

function SayCurrentSelection()	
UpdateTextInputFocusCollection()
if getObjectRole () == ROLE_SYSTEM_PUSHBUTTON then
; For buttons and related objects, we need to fall back to normal speaking.
; example: Windows+H then Alt+Windows+H to manage settings for dictation input.
	var int iSubType = GetObjectSubTypeCode(false, 0)
	if iSubType != GetObjectSubTypeCode(SOURCE_CACHED_DATA, 0)
		IndicateControlType (iSubType, c_TextInputFocus.ObjectNameUnfiltered, cMsgSilent)
		return
	endIf
	SayObjectTypeAndText ()
	return
endIf
Say(c_TextInputFocus.ObjectNameUnfiltered, OT_SCREEN_MESSAGE)
Say(PositionInGroupFromUIA (c_TextInputFocus.FocusedElement), OT_POSITION)
endFunction

script SayLine()
SayCurrentSelection()
endScript

script SayPriorCharacter()
PauseFor(150)
SayCurrentSelection()
endScript

script SayNextCharacter()
PauseFor(150)
SayCurrentSelection()
endScript

script SayPriorLine()
PauseFor(150)
SayCurrentSelection()
endScript

script SayNextLine()
PauseFor(150)
SayCurrentSelection()
endScript

script SayCharacter()
PauseFor(150)
SayCurrentSelection()
endScript

script Tab()
PauseFor(150)
SayCurrentSelection()
endScript

script ShiftTab()
; duplicate of script Tab ()
; apparently the key is already going through internally somehow.
; resolves where shift tab was not speaking controls when tab was.
PauseFor(150)
SayCurrentSelection()
endScript

void function HomeEndMovement(int UnitMovement)
HomeEndMovement(UnitMovement)
PauseFor(150)
SayCurrentSelection()
EndFunction

void function SayPageUpDownUnit(int UnitMovement)
SayPageUpDownUnit(UnitMovement)
PauseFor(150)
SayCurrentSelection()
EndFunction

bool function IsForegroundProcessWindows11EmojiAndClipboardViewer(handle hwndFocus)
if GetActiveConfiguration(0) == "Windows11TextInputApp" Then
	; configuration has already been switched, no need to continue with focus change
	return true
endIf
return false
EndFunction

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if IsForegroundProcessWindows11EmojiAndClipboardViewer(hWndFocus) then
	return
EndIf
FocusChangedEventEx(hwndFocus, nObject, nChild,hwndPrevFocus, nPrevObject, nPrevChild,nChangeDepth)
EndFunction

object function GetKeyboardFocusElement ()
var
	object oRoot = FSUIAGetRootElement (),
	object oHasKeyboardFocusCondition = FSUIACreateBoolCondition (UIA_HasKeyboardFocusPropertyId, UIATrue),
	object oWindowCondition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyId, UIA_WindowControlTypeId),
	object oWindowClassCondition = FSUIACreateStringPropertyCondition (UIA_ClassNamePropertyID, "ApplicationFrameWindow"),
	object oWindowAndCondition = FSUIACreateAndCondition (oWindowCondition, oWindowClassCondition),
	object oWindow = oRoot.findFirst(TreeScope_Children, oWindowAndCondition),
	object oFocusedElement = oWindow.findFirst(TreeScope_Descendants, oHasKeyboardFocusCondition)
return oFocusedElement
endFunction

int function IsElementAriaSelected(optional object element)
if !element
	element = FSUIAGetFocusedElement ()
endIf
var
	string sAriaProperties = element.ariaProperties,
	int iPropertyCount = StringSegmentCount (sAriaProperties, UIA_ariaPropertiesDelimiter),
	int i
for i = 1 to iPropertyCount
	if StringSegment (sAriaProperties, UIA_ariaPropertiesDelimiter, i) == UIA_ariaProperties_selected
		return true
	endIf
endFor
return false
endFunction

int function BrailleCallbackObjectIdentify()
if c_TextInputFocus.FocusedElement.frameWorkID != ID_framework_MicrosoftEdge
	return BrailleCallBackObjectIdentify()
endIf
var int iControlType = c_TextInputFocus.FocusedElement.ControlType
if iControlType == UIA_DataItemControlTypeId;clipboard history entries
|| iControlType == UIA_ListItemControlTypeId;navigation menu elements
	return WT_LISTBOXITEM
elIf iControlType == UIA_ButtonControlTypeId;needed for clear all button in clipboard history
	return WT_BUTTON
endIf
return BrailleCallBackObjectIdentify()
endFunction

int function brailleAddObjectName (int nType)
if c_TextInputFocus.FocusedElement.frameWorkID != ID_framework_MicrosoftEdge
	return brailleAddObjectName (nType)
endIf
if nType == WT_BUTTON
	BrailleAddString(c_TextInputFocus.ObjectNameUnfiltered, 0, 0, 0)
	return true
endIf
return brailleAddObjectName (nType)
EndFunction

int function brailleAddObjectValue (int nType)
if c_TextInputFocus.FocusedElement.frameWorkID != ID_framework_MicrosoftEdge
	return brailleAddObjectValue (nType)
endIf
if nType  == WT_LISTBOXITEM
	if c_TextInputFocus.FocusedElement.controlType == UIA_DataItemControlTypeId;clipboard history entries
|| IsElementAriaSelected(c_TextInputFocus.FocusedElement);selected navigation menu element
		BrailleAddString(c_TextInputFocus.ObjectNameUnfiltered, 0, 0, ATTRIB_HIGHLIGHT)
	else
		BrailleAddString(c_TextInputFocus.ObjectNameUnfiltered, 0, 0, 0)
	endIf
	return true
endIf
return brailleAddObjectValue (nType)
EndFunction

int function brailleAddObjectPosition (int nType)
if c_TextInputFocus.FocusedElement.frameWorkID != ID_framework_MicrosoftEdge
	return brailleAddObjectPosition (nType)
endIf
if nType  == WT_LISTBOXITEM
	BrailleAddString(PositionInGroupFromUIA (c_TextInputFocus.FocusedElement), 0, 0, 0)
	return true
endIf
return brailleAddObjectPosition (nType)
endFunction

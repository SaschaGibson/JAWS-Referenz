;Copyright 2015-2017 Freedom Scientific, Inc.
;Freedom Scientific script file for Windows 10 Alarms and Clock

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "common.jsm"
include "Win8Alarms and Clock.jsm"

;Classes and automation IDs:
const
	UIAClass_TimeOfDayPicker = "TimeOfDayPicker",  ;the time picker pane
	UIAClass_LoopingSelector = "CustomLoopingSelector",  ;the lists in the time picker
	UIAClass_ToggleSwitch = "ToggleSwitch"  ;The alarm toggle button

;For UIA events:
const
	AlarmsAndClock_EventPrefix = "AlarmsAndClock"
globals
	object fsUIA_AlarmsAndClock,  ;fsUIA object For the duration of the app being in focus
	object UIA_Focus  ;the focus element

;For managing announcement of focus when FS FocusChangedEvent occurs before the final UIA focus change
;in a series of changes due to loading a new page:
const
	SayObjectTypeAndTextDelayTime = 10
globals
	int ScheduledSayObjectTypeAndText

;Save element data for use with speech and braille:
globals
	collection c_FocusControlInfo
		; This is used to retrieve and cache UIA information about the focus control
		; where the information is not readily available through internal functions.
		; Members vary according to what is needed for the specific control.


void function AutoStartEvent()
InitAlarmsAndClockUIA()
EndFunction

void function AutoFinishEvent()
UIA_Focus = Null()
fsUIA_AlarmsAndClock = Null()
CollectionRemoveAll(c_FocusControlInfo)
c_FocusControlInfo = Null()
EndFunction

void function InitAlarmsAndClockUIA()
fsUIA_AlarmsAndClock = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !ComAttachEvents(fsUIA_AlarmsAndClock,AlarmsAndClock_EventPrefix )
|| !fsUIA_AlarmsAndClock.AddFocusChangedEventHandler()
	fsUIA_AlarmsAndClock = Null()
	return
endIf
c_FocusControlInfo = new collection
UIA_Focus = fsUIA_AlarmsAndClock.GetFocusedElement().BuildUpdatedCache()
UpdateCustomFocusControlInfo()
EndFunction

void function AlarmsAndClockFocusChangedEvent (object element)
UIA_Focus = element
EndFunction

int function GetListBoxFocusInfo()
if (UIA_Focus.controlType != UIA_ListControlTypeID) return false endIf
;Although SetFocus on the element reports success,
;the focus remains on the list.
;So save the element info for use with speech and braille.
var object condition = fsUIA_AlarmsAndClock.createBoolPropertyCondition(UIA_HasKeyboardFocusPropertyId,UIATrue)
var object element = UIA_Focus.FindFirst(TreeScope_Children,condition)
if !element return false endIf
c_FocusControlInfo.name = element.name
c_FocusControlInfo.positionInSet = element.positionInSet
c_FocusControlInfo.sizeOfSet = element.sizeOfSet
var int x, int y
element.GetClickablePoint( intRef(x), intRef(y))
c_FocusControlInfo.clickX = x
c_FocusControlInfo.clickY = y
return true
EndFunction

int function GetToggleSwitchFocusInfo()
if (UIA_Focus.className != UIAClass_ToggleSwitch) return false endIf
;The text for Off or On are in the children of the UIA focus:
var object treewalker = fsUIA_AlarmsAndClock.RawViewWalker()
if (!treewalker) return false endIf
treewalker.currentElement = UIA_Focus
treewalker.gotoFirstChild() ;The first child has the text for the Off state
if UIA_Focus.GetTogglePattern().toggleState
	treewalker.gotoNextSibling() ;And this has the text for the On state
endIf
c_FocusControlInfo.name = UIA_Focus.name
c_FocusControlInfo.stateText = treewalker.currentElement.name
var int x, int y
UIA_Focus.GetClickablePoint( intRef(x), intRef(y))
c_FocusControlInfo.clickX = x
c_FocusControlInfo.clickY = y
return true
EndFunction

void function UpdateCustomFocusControlInfo()
CollectionRemoveAll(c_FocusControlInfo )
if GetListBoxFocusInfo()
|| GetToggleSwitchFocusInfo()
	return
endIf
EndFunction

void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
SaveCursor ()
PCCursor()
var int iObjType = GetObjectSubtypeCode ()
RestoreCursor()
if !nSelectingText
&& iObjType == wt_ListBoxItem
	;Add detection of checkable list items,
	;and then allow the default to say the item.
	;Because ControlCanBeChecked may return a false positive,
	;also check that the UIA focus is a checkbox:
	;if ControlCanBeChecked() 
	if UIA_Focus.controlType == UIA_CheckBoxControlTypeId
		if ControlIsChecked ()
			indicateControlState(wt_ListBoxItem, CTRL_CHECKED)
		else
			indicateControlState(wt_ListBoxItem, CTRL_UNCHECKED)
		endIf
	endIf
endIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

int function SayFocusedListbox()
;Some listboxes gain focus without allowing focus to move to the listbox item:
if (GetObjectSubtypeCode() != wt_ListBox) return false endIf
if (!c_FocusControlInfo.name) return false endIf
IndicateControlType(wt_ListBox,cscNull,c_FocusControlInfo.name)
if (c_FocusControlInfo.sizeOfSet) Say(FormatString(cmsgPosInGroup1,c_FocusControlInfo.positionInSet,c_FocusControlInfo.sizeOfSet),ot_position) endIf
return true
EndFunction

int function SayOnOffToggleButton()
if (GetObjectSubtypeCode() != wt_button) return false endIf
if (!c_FocusControlInfo.name) return false endIf
;Announcing the state separately from the control type and name allows the state to be more emphasized by the speech:
IndicateControlType(wt_button,c_FocusControlInfo.name,cmsgSilent)
Say(c_FocusControlInfo.stateText,ot_item_state)
return true
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
;When opening a page to edit or add an alarm,
;several UIA focus changes fire while only one FS focus change event fires.
;In this case, the FS focus change event may fire and call SayObjectTypeAndText
;before the final UIA focus change event fires.
;If we detect that this has happened,
;exit out of the current SayObjectTypeAndText and schedule a call to it,
;giving the UIA focus change a chance to finish firing all its focus changes.
if (ScheduledSayObjectTypeAndText)
	UnscheduleFunction(ScheduledSayObjectTypeAndText)
	ScheduledSayObjectTypeAndText = 0
endIf
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if GetObjectSubtypeCode() == wt_ListBox
&& UIA_Focus.controlType != UIA_ListControlTypeId
	ScheduledSayObjectTypeAndText = ScheduleFunction("SayObjectTypeAndText",SayObjectTypeAndTextDelayTime)
	return
endIf
if nLevel == 0
	UpdateCustomFocusControlInfo()
	if SayFocusedListbox()
	|| SayOnOffToggleButton()
		return
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if hObj == GetFocus()
&& iObjType == wt_button
&& UIA_Focus.className == UIAClass_ToggleSwitch
	UIA_Focus = UIA_Focus.buildUpdatedCache()
	GetToggleSwitchFocusInfo()
	Say(c_FocusControlInfo.stateText,ot_item_state)
	return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

int function ShouldSayObjectInsteadOfLine()
var int type = GetObjectSubtypeCode()
return type == wt_ListBox
	|| (type == wt_ListBoxItem && UIA_Focus.controlType == UIA_CheckBoxControlTypeId)
	|| UIA_Focus.className == UIAClass_ToggleSwitch
EndFunction

void function SayFocusAfterExitUserBuffer()
if ShouldSayObjectInsteadOfLine()
	SayObjectTypeAndText()
	return
endIf
SayFocusAfterExitUserBuffer()
EndFunction

int function SayByTypeForScriptSayLine()
if ShouldSayObjectInsteadOfLine()
	SayObjectTypeAndText()
	return true
endIf
return SayByTypeForScriptSayLine()
EndFunction

int function BrailleAddObjectState(int nSubtype)
if nSubtype == wt_button
&& c_FocusControlInfo.stateText
	BrailleAddString(c_FocusControlInfo.stateText,c_FocusControlInfo.clickX,c_FocusControlInfo.clickY,attrib_highlight)
	return true
endIf
return BrailleAddObjectState(nSubtype)
EndFunction

int function BrailleAddObjectValue(int nSubtype)
if nSubtype == wt_listBox
&& c_FocusControlInfo.name
	BrailleAddString(c_FocusControlInfo.name,c_FocusControlInfo.clickX,c_FocusControlInfo.clickY,attrib_highlight)
	return true
endIf
return BrailleAddObjectValue(nSubtype)
EndFunction

int function BrailleAddObjectPosition(int nSubtype)
if nSubtype == wt_listBox
&& c_FocusControlInfo.sizeOfSet
	BrailleAddString(FormatString(cmsgPosInGroup1,c_FocusControlInfo.positionInSet,c_FocusControlInfo.sizeOfSet),0,0,0)
	return true
endIf
return BrailleAddObjectPosition(nSubtype)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgWin8AlarmsClockAppName)
EndScript

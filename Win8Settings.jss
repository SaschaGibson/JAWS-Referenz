;Copyright 2015 Freedom Scientific, Inc.
; JAWS script file for Win8Settings, for Windows 10

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "common.jsm"
include "Win8Settings.jsm"

import "touch.jsd"


;UIA event handling:
const
	UIA_Win8Settings_EventFunctionNamePrefix = "Win8Settings"
globals
	object UIA_Win8Settings,
	object UIA_Win8SettingsTreeWalker

;Helper globals updated in the UIA focus changed event and used elsewhere in the scripts:
globals
	object FocusChangeElement,
	string gsTextBlockInfo  ;for speech and braille output

;Because a property change for an alert element may fire several times with the same information
;use an object and time stamp to allow the property change event to test and avoid speaking the same information several times over:
const
	prevPropertyChangeTollerence = 100
globals
	object prevPropertyChangeElement,
	int prevPropertyChangeTimeStamp

;Automation IDs and class names:
const
	AutomationID_ItemsControlScrollViewer = "ItemsControlScrollViewer",
	AutomationIDStringEnd_TitleTextBlock = "_TitleTextBlock",  ;The last part of a string for an automation id
	oClass_Textblock = "TextBlock",
	oClass_ToggleSwitch = "ToggleSwitch"


void function AutoStartEvent()
InitWin8Settings()
EndFunction

void function AutoFinishEvent()
UIA_Win8Settings = Null()
UIA_Win8SettingsTreeWalker = Null()
FocusChangeElement = Null()
prevPropertyChangeElement = Null()
EndFunction

void function InitWin8Settings()
if UIA_Win8Settings return endIf
UIA_Win8Settings = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !UIA_Win8Settings return endIf
if !ComAttachEvents(UIA_Win8Settings,UIA_Win8Settings_EventFunctionNamePrefix)
	UIA_Win8Settings = Null()
	return
endIf
var object focusElement = UIA_Win8Settings.GetFocusedElement().BuildUpdatedCache()
if !focusElement
	UIA_Win8Settings = Null()
	return
endIf
var object processCondition = UIA_Win8Settings.CreateIntPropertyCondition(UIA_ProcessIdPropertyId,focusElement.ProcessID)
if !processCondition
	UIA_Win8Settings = Null()
	return
endIf
var object treeWalker = UIA_Win8Settings.CreateTreeWalker(processCondition)
if !treeWalker
	UIA_Win8Settings = Null()
	return
endIf
treeWalker.currentElement = focusElement
var object appElement = focusElement
while treeWalker.gotoParent() appElement = treeWalker.currentElement endWhile
if !appElement
	UIA_Win8Settings = Null()
	return
endIf
if !UIA_Win8Settings.AddFocusChangedEventHandler()
	UIA_Win8Settings = Null()
	return
endIf
if !UIA_Win8Settings.AddPropertyChangedEventHandler(UIA_AriaPropertiesPropertyId, appElement, TreeScope_subtree)
	UIA_Win8Settings = Null()
	return
endIf
UIA_Win8SettingsTreeWalker = treeWalker
FocusChangeElement = focusElement
UpdateDescriptionTextFromUIA()
BrailleRefresh()
EndFunction

void Function Unknown (string TheName, int IsScript, optional int IsDueToRecursion)
TheName = StringLower (TheName)
if IsDueToRecursion
&& theName == "focusistoggleswitch"
	return
endIf
Unknown (TheName, IsScript, IsDueToRecursion)
EndFunction

int function FocusIsToggleSwitch()
return GetFocus()
	&& FocusChangeElement.className == oClass_ToggleSwitch
	&& !UserBufferIsActive()
EndFunction

void function Win8SettingsFocusChangedEvent (object element)
FocusChangeElement = element
UpdateDescriptionTextFromUIA()
BrailleRefresh()
EndFunction

void function UpdateDescriptionTextFromUIA()
gsTextBlockInfo = cscNull
if FocusChangeElement.controlType != UIA_ListItemControlTypeId return endIf
UIA_Win8SettingsTreeWalker.currentElement = FocusChangeElement
if !UIA_Win8SettingsTreeWalker.gotoFirstChild() return endIf
if UIA_Win8SettingsTreeWalker.currentElement.className != oClass_TextBlock return endIf
;Any element of class TextBlock except the first one is applicable:
var string text
while UIA_Win8SettingsTreeWalker.GoToNextSibling()
	if UIA_Win8SettingsTreeWalker.currentElement.className == oClass_TextBlock
		if !gsTextBlockInfo
			gsTextBlockInfo = UIA_Win8SettingsTreeWalker.currentElement.name
		else
			text = UIA_Win8SettingsTreeWalker.currentElement.name
			gsTextBlockInfo = gsTextBlockInfo+cscSpace+text
		endIf
	endIf
endWhile
EndFunction

void function Win8SettingsPropertyChangedEvent(object element, int propertyID, variant newValue)
if propertyID == UIA_AriaPropertiesPropertyId
&& !StringContains(newValue,"hidden=true")
&& element.ariaRole == "alert"
	;The property change fires multiple times for a single alert change.
	;Because many objects may also be firing a property change,
	;there is no guarantee that the property change for alerts we are watching for will occur consecutively.
	;For this reason, the prev object is only updated inside this block.
	var int ticks = GetTickCount()
	if !UIA_Win8Settings.CompareElements(prevPropertyChangeElement,element)
	|| prevPropertyChangeTimeStamp-ticks > prevPropertyChangeTollerence
		Say(element.name,ot_screen_message)
	endIf
	prevPropertyChangeElement = element
	prevPropertyChangeTimeStamp = ticks
endIf
EndFunction

int function ShouldSkipUIAElementOnSayPageDialogText(object element)
var object parent = UIAGetParent(element)
return element.controltype != UIA_textControlTypeId
	|| StringContains(element.ariaProperties,"hidden=true")
	|| StringContains(parent.ariaProperties,"hidden=true")
EndFunction

void function UIASayPageDialogTextCallBack()
if !UIAGoToNextInTree(UIA_Win8SettingsTreeWalker) return EndIf
while ShouldSkipUIAElementOnSayPageDialogText(UIA_Win8SettingsTreeWalker.currentElement)
	if !UIAGoToNextInTree(UIA_Win8SettingsTreeWalker) return EndIf
endWhile
UIASayElement(UIA_Win8SettingsTreeWalker.currentElement)
QueueFunction ("UIASayPageDialogTextCallBack")
EndFunction

void function UIASayPageDialogText()
UIA_Win8SettingsTreeWalker.currentElement = FocusChangeElement
UIA_Win8SettingsTreeWalker.gotoFirstChild()
QueueFunction ("UIASayPageDialogTextCallBack")
EndFunction

int function ShouldSkipDialogStaticText(int nLevel)
if StringStartsWith(GetObjectName(true,nLevel),"https://login.microsoftonline.com/")
	return true
endIf
UIA_Win8SettingsTreeWalker.currentElement = FocusChangeElement
UIA_Win8SettingsTreeWalker.gotoParent()
if UIA_Win8SettingsTreeWalker.currentElement.controlType == UIA_CustomControlTypeId
	var object rect = UIA_Win8SettingsTreeWalker.currentElement.BoundingRectangle
	if !rect
	|| !(rect.right - rect.left && rect.bottom-rect.top)
		return true
	endIf
endIf
if UIA_Win8SettingsTreeWalker.currentElement.automationId == AutomationID_ItemsControlScrollViewer
	return true
endIf
return false
EndFunction

void function DoFocusChangedEventProcessAncestorsLoopBody(int byRef nLevel, int iType)
;This function exists as a work-around to the lack of a "continue" statement.
;To prevent endless looping, it is crucial that nLevel be decremented in this function body.
if nLevel > 0
	if iType == wt_dialog_page
	&& ShouldSkipDialogStaticText(nLevel)
		nLevel = nLevel-1
		return
	endIf
elif nLevel == 0
	if iType == wt_unknown
	&& !GetObjectName()
	&& GetObjectState() == cMsgNotAvailable
		nLevel = nLevel-1
		return
	endIf
	if iType == wt_dialog_page
		sayObjectTypeAndText(nLevel)
		nLevel = nLevel-1
		;Allow time for the window to populate:
		Delay(10)
		UIASayPageDialogText()
		return
	endIf
endIf
sayObjectTypeAndText(nLevel)
nLevel = nLevel-1
EndFunction

void Function FocusChangedEventProcessAncestors (handle FocusWindow, handle PrevWindow)
var
	int nLevel,
	int iType
nLevel = GetFocusChangeDepth()
while nLevel >= 0
	iType = GetObjectSubtypecode(true,nLevel)
	DoFocusChangedEventProcessAncestorsLoopBody(nLevel,iType)
	;Do not decrement nLevel here, DoFocusChangedEventProcessAncestorsLoopBody will do it.
EndWhile
EndFunction

int function MainProcessShouldSkipUIAElementWhenNavigating(object element)
if !element.isEnabled return true endIf
if element.controlType == UIA_TextControlTypeId
&& element.className == oClass_Textblock
&& StringRight(element.automationID,StringLength(AutomationIDStringEnd_TitleTextBlock)) != AutomationIDStringEnd_TitleTextBlock
	;The title text block element has the same name as its parent,
	;but the other text elements of class Textblock should be explorable:
	return false
endIf
return MainProcessShouldSkipUIAElementWhenNavigating(element)
EndFunction

void function SayAnyDescriptionTextFromUIA()
if gsTextBlockInfo
	SayUsingVoice(vctx_message,gsTextBlockInfo,ot_screen_message)
endIf
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
SayAnyDescriptionTextFromUIA()
EndFunction

string function GetToggleSwitchStateString(object element)
;A toggle switch is a button with a toggle state.
;It is a control with UIA type of button, not checkbox.
;It is similar to a checkbox in that it may be toggled on/off,
;and it may be toggled using space or arrow keys to move the switch.
;The child elements have text blocks for the state which are shown as "off" or "on",
;but since we cannot programmatically predict which text children are used for the states we use localized strings for the state names.
var object pattern = element.buildUpdatedCache().GetTogglePattern()
if !pattern return cscNull endIf
if !pattern.ToggleState
	return cmsgOff
else
	return cmsgOn
endIf
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if nLevel == 0
	if FocusIsToggleSwitch()
		;The localized control type is actually "toggle switch", which we will use to speak the type.
		SayControlEx(GetFocus(),FocusChangeElement.name,FocusChangeElement.localizedControlType,GetToggleSwitchStateString(FocusChangeElement))
		SayAnyDescriptionTextFromUIA()
		return
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
if nLevel == 0
	SayAnyDescriptionTextFromUIA()
endIf
EndFunction

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if FocusIsToggleSwitch()
	;This control does not use the control state for unchecked:
	Say(GetToggleSwitchStateString(FocusChangeElement),ot_item_state)
	return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

string function GetCustomTutorMessage()
if FocusIsToggleSwitch()
	return msgTutorHelpToggleSwitch
endIf
return GetCustomTutorMessage()
EndFunction

int function BrailleAddObjectDescription(int nSubtype)
if nSubtype == wt_listBoxItem
	if gsTextBlockInfo
		BrailleAddString(gsTextBlockInfo,0,0,0)
	endIf
endIf
BrailleAddObjectDescription(nSubtype)
EndFunction

int function BrailleAddObjectState(int nSubtype)
if FocusIsToggleSwitch()
	;Toggle switches do not use control state for unchecked, although they do use control state for checked.
	;We also need to get the clickable point to use for this component.
	var object pattern = FocusChangeElement.buildUpdatedCache().GetTogglePattern()
	if pattern
		var int x, int y
		FocusChangeElement.GetClickablePoint( intRef(x), intRef(y))
		if pattern.toggleState
			BrailleAddString(BrailleGetStateString(CTRL_CHECKED),x,y,0)
		else
			BrailleAddString(BrailleGetStateString(CTRL_UNCHECKED),x,y,0)
		endIf
		return true
	endIf
endIf
return BrailleAddObjectState(nSubtype)
EndFunction

Script BrailleRouting()
if !BrailleIsMessageBeingShown()
&& !gbBrailleStudyModeActive
&& IsPCCursor()
	if FocusIsToggleSwitch()
		var int x, int y
		FocusChangeElement.GetClickablePoint( intRef(x), intRef(y))
		var int nCell = GetLastBrailleRoutingKey()
		if nCell
		&& x+1 == GetBrailleCellColumn(nCell)
		&& y+1 == GetBrailleCellRow(nCell)
			FocusChangeElement.GetTogglePattern().toggle()
			return
		endIf
	endIf
endIf
PerformScript BrailleRouting()
EndScript

script ScriptFileName()
ScriptAndAppNames(msgWin8SettingsAppName)
EndScript

script SayLine()
if FocusIsToggleSwitch()
	;The localized control type is actually "toggle switch", which we will use to speak the type.
	SayControlEx(GetFocus(),FocusChangeElement.name,FocusChangeElement.localizedControlType,GetToggleSwitchStateString(FocusChangeElement))
	SayAnyDescriptionTextFromUIA()
	return
endIf
PerformScript SayLine()
SayAnyDescriptionTextFromUIA()
endScript

; Domain scripts for dev.azure.com

include "HJConst.jsh"
include "HJGlobal.jsh"
include "uia.jsh"
include "MSAAConst.jsh"
include "Common.jsm"
include "AzureDevOps.jsm"

import "uia.jsd"

const
	testExecutionURLFragment = "_testExecution/Index"
	
globals
	int shouldSkipNextNotification

Int Function ShouldSpeakItemAtLevel (int level, int type, int parentType, int focusRole, int focusType)
if level > 0
&& type == wt_dialog
	return false
endIf
return ShouldSpeakItemAtLevel (level, type, parentType, focusRole, focusType)
EndFunction

string function GetDialogName()
var int i, int depth = GetAncestorCount()
for i = 0 to depth
	if GetObjectSubtypeCode(false,i) == wt_dialog
		return GetObjectName(false,i)
	endIf
endFor
return cscNull
EndFunction

int function IsRedirectingFocusFromOffScreenItemInWebDialog(handle hFocus)
if !DialogActive()
|| !IsBrowserContentWindow(hFocus)
	return false
endIf
var object focus = FSUIAGetFocusedElement()
if !focus
|| !focus.isOffScreen
	return false
endIf
var object ancestor = FSUIAGetAncestorOfARIARole(focus,"dialog")
if !ancestor return false endIf
var
	object keyboardFocusableCondition,
	object OnScreenCondition,
	object findCondition
keyboardFocusableCondition = FSUIACreateBoolCondition(UIA_IsKeyboardFocusablePropertyId,UIATrue)
OnScreenCondition = FSUIACreateBoolCondition(UIA_IsOffscreenPropertyId,false)
findCondition = FSUIACreateAndCondition(keyboardFocusableCondition,OnScreenCondition)
var object o = ancestor.findFirst(TreeScope_Descendants,findCondition)
if !o return false endIf
o.SetFocus()
return true
EndFunction

int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if IsRedirectingFocusFromOffScreenItemInWebDialog(hwndFocus)
	return true
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void Function NameChangedEvent (handle hwnd, int objId, int childId, int nObjType,
	string sOldName, string sNewName)
;In a Work Items dashboard where there are checkable rows for selecting work items,
;And when the virtual cursor is inactive,
;Toggling the check status of the row fires a NameChangedEvent when the row becomes unselected.
;We do not want to speak the row, just the changed state, which happens in ObjStateChangedEvent.
if !nObjType
&& GetObjectRole() == ROLE_SYSTEM_ROW
	return
endIf
NameChangedEvent (hwnd, objId, childId, nObjType, sOldName, sNewName)
EndFunction

object function GetCheckboxDescendantOfWorkItemCheckableRow()
;This should only be called after you have verified that the object subtype and role are the expected values.
var object focus = FSUIAGetFocusedElement()
if !focus return Null() endIf
var object grandChild = FSUIAGetFirstChildOfElement(FSUIAGetFirstChildOfElement(focus))
if !grandChild
|| grandChild.controlType != UIA_CheckBoxControlTypeId
	return Null()
endIf
return grandChild
EndFunction

int function OnWorkItemCheckableRow()
;The type is 0 when on the row and the virtual cursor is inactive:
if GetObjectSubtypeCode() != 0;
|| GetObjectRole() != ROLE_SYSTEM_ROW
	return false
endIf
var object element = GetCheckboxDescendantOfWorkItemCheckableRow()
;Do not test for object being null, instead use a not not test:
return !(!element)
EndFunction

string function GetWorkItemCheckableRowCheckboxName()
if !OnWorkItemCheckableRow() return cscNull endIf
var object checkbox = GetCheckboxDescendantOfWorkItemCheckableRow()
if !checkbox return cscNull endIf
return checkbox.name
EndFunction

string function GetNameOfWorkItemCheckableRow()
;The row name includes the checkbox name, which says "select the row".
;This is confusing to hear as part of the row name, so we try to exclude it.
if !OnWorkItemCheckableRow() return cscNull endIf
var
	string name = GetObjectName(),
	string checkboxName = GetWorkItemCheckableRowCheckboxName()
if checkboxName
&& StringStartsWith(name,checkboxName)
	return StringChopLeft(name,StringLength(checkboxName)+1)
endIf
return name
EndFunction

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
If iObjType == WT_ROW
&& GetObjectSubtypeCode() == wt_checkBox
&& hObj == GetFocus()
	;This is a row where a checkbox in the row toggles the selection status of the entire row.	
	;If the focus was already on a row's checkbox before the toggle, the state change we get is for the row, even though what you are toggling is the checkbox for the row.
	;If before the toggle the virtual cursor is on a different row than the focus, what we get is the toggle state for the checkbox belonging to the row.
	;Because we want the announcement when toggling the row's checkbox to be consistent with what happens when checkboxes are toggled, we will announce the checkbox toggle state rather than the row selection state.
	var int checkedState
	if nChangedState & CTRL_SELECTED 
		checkedState = CTRL_CHECKED 
	else
		checkedState = CTRL_UNCHECKED 
	endIf
	IndicatecontrolState(wt_checkbox, checkedState)
	return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if nLevel == 0
	if OnWorkItemCheckableRow()
		;Similar to the behavior of lists, navigating up/down with arrow keys selects the row.
		;We will announce if the row is unselected,
		;otherwise the user should assume the row is selected since it is by default when navigating.
		if !(GetObjectMSAAState() & STATE_SYSTEM_SELECTED)
			Say(cmsg214_L,ot_selected_item)
		endIf
		Say(GetNameOfWorkItemCheckableRow(),ot_line)
		return
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

script SayLine()
if !IsVirtualPCCursor()
&& IsPCCursor()
&& OnWorkItemCheckableRow()
	SayObjectTypeAndText()
	return
endIf
PerformScript SayLine()
EndScript

int function BrailleCallbackObjectIdentify()
if OnWorkItemCheckableRow()
	return wt_row
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectName(int iSubtype)
if iSubtype == wt_Row
&& OnWorkItemCheckableRow()
	;attribs will show the row as highlighted in braille if it is selected:
	var int attribs = 0
	if GetObjectMSAAState() & STATE_SYSTEM_SELECTED
		attribs = attrib_highlight
	endIf
	BrailleAddString(GetNameOfWorkItemCheckableRow(),GetCursorCol(),GetCursorRow(),attribs)
	return true
endIf
return BrailleAddObjectName(iSubtype)
EndFunction

Script VirtualPCCursorToggle ()
PerformScript VirtualPCCursorToggle ()
;Although there is a BrailleRefresh in Chrome,
;we fire an extra one here to make sure that braille actually updates.
BrailleRefresh()
EndScript

script ScriptFileName()
ScriptAndAppNames(msgAzureDevOpsAppName)
EndScript

object function GetItemById(string automationID)
var object focus = FSUIAGetFocusedElement()
if !focus return Null() endIf
var object document
if focus.ControlType == UIA_DocumentControlTypeId
	document = focus
else
	document = FSUIAGetAncestorOfControlType(focus,UIA_DocumentControlTypeId)
EndIf
	
if !document return Null() endIf

var object AutomationIDCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyId, automationID)
var object item = document.findFirst (TreeScope_Subtree, AutomationIDCondition )
if !item return Null() endIf
return item
EndFunction

void function UIANotificationEvent(int notificationKind, int notificationProcessing, string displayString, string activityId, string appName)
if shouldSkipNextNotification  
&& stringContains (NotificationsFilterByActivityID, activityId)
	shouldSkipNextNotification = false
 return
EndIf

UIANotificationEvent(notificationKind, notificationProcessing, displayString, activityId, appName)
endFunction

Script GoForward()
if StringContains (GetDocumentPath (),testExecutionURLFragment)
	var object nextButton = GetItemById("mi_61_next-test-case")
	var int nextDisabled = StringContains (nextButton.AriaProperties,"disabled=true")
	shouldSkipNextNotification = !nextDisabled
EndIf
PerformScript GoForward()
EndScript

Script GoBack()
if StringContains (GetDocumentPath (),testExecutionURLFragment)
	var object prevButton = GetItemById("mi_55_prev-test-case")
	var int prevDisabled = StringContains (prevButton.AriaProperties,"disabled=true")
	shouldSkipNextNotification = !prevDisabled
EndIf
PerformScript GoBack()
EndScript

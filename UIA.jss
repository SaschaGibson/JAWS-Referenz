;Copyright 2016-2018 Freedom Scientific, Inc.
;Freedom Scientific default script file for UIA functions.

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "common.jsm"

import "touch.jsd"


;This group of variables are created when JAWS starts.
;They are intended to allow access to FSUIA object functionality without the need to create an FSUIA object for a minor task.
;Do not call or use these variables directly,
;instead use only the provided scripts functions which wrap the UIA method and property calls for these variables.
;The script function which access this collection should all have names starting with "FSUIA".
globals
	object _FSUIA_Reserved_Global_,
	object _FSUIA_Reserved_treewalker_


void function InitFsUIAReservedGlobal()
_FSUIA_Reserved_Global_ = Null()
_FSUIA_Reserved_treewalker_ = Null()
_FSUIA_Reserved_Global_ = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
_FSUIA_Reserved_treewalker_ = _FSUIA_Reserved_Global_.RawViewWalker()
EndFunction

int function FSUIACompareElements(object element1, object element2)
return (_FSUIA_Reserved_Global_.CompareElements(element1,element2) == UIATrue)
EndFunction

object function FSUIACreateAndCondition(object condition1, object condition2)
return _FSUIA_Reserved_Global_.CreateAndCondition(Condition1,condition2) 
EndFunction

object function FSUIACreateOrCondition(object condition1, object condition2)
return _FSUIA_Reserved_Global_.CreateOrCondition(Condition1,condition2) 
EndFunction

object function FSUIACreateBoolCondition(int PropertyID, int bVal)
;In case the caller use JAWS true rather than UIA true, convert it:
if (bVal == true) bVal = UIATrue endIf
return _FSUIA_Reserved_Global_.CreateBoolPropertyCondition(propertyID,bVal)
EndFunction

object function FSUIACreateTrueCondition()
return _FSUIA_Reserved_Global_.CreateTrueCondition()
EndFunction

object function FSUIACreateFalseCondition()
return _FSUIA_Reserved_Global_.CreateFalseCondition()
EndFunction

object function FSUIACreateNotCondition(object condition)
return _FSUIA_Reserved_Global_.CreateNotCondition(condition)
EndFunction

object function FSUIACreateIntPropertyCondition(int propertyID, int iVal)
return _FSUIA_Reserved_Global_.CreateIntPropertyCondition(propertyID,iVal)
EndFunction

object function FSUIACreateStringPropertyCondition(int propertyID, string sVal, optional int propertyConditionFlags)
if propertyConditionFlags
	return _FSUIA_Reserved_Global_.CreateStringPropertyConditionEx(propertyID,sVal, propertyConditionFlags)
endIf
return _FSUIA_Reserved_Global_.CreateStringPropertyCondition(propertyID,sVal)
EndFunction

object function FSUIAContentViewCondition()
return _FSUIA_Reserved_Global_.ContentViewCondition()
EndFunction

object function FSUIAControlViewCondition()
return _FSUIA_Reserved_Global_.ControlViewCondition()
EndFunction

object function FSUIARawViewCondition()
return _FSUIA_Reserved_Global_.RawViewCondition()
EndFunction

object function FSUIACreateTreeWalker(object condition)
return _FSUIA_Reserved_Global_.CreateTreeWalker(condition)
EndFunction

object function FSUIAContentViewWalker()
return _FSUIA_Reserved_Global_.ContentViewWalker()
EndFunction

object function FSUIAControlViewWalker()
return _FSUIA_Reserved_Global_.ControlViewWalker()
EndFunction

object function FSUIARawViewWalker()
return _FSUIA_Reserved_Global_.RawViewWalker()
EndFunction

object function FSUIAGetFocusedElement(optional int getDeepestFocus)
var object o = _FSUIA_Reserved_Global_.GetFocusedElement()
if !getDeepestFocus return o endIf
SetCurrentElementToDeepestFocusElement(_FSUIA_Reserved_Global_, _FSUIA_Reserved_treewalker_)
return _FSUIA_Reserved_treewalker_.currentElement
EndFunction

object function FSUIAGetRootElement()
return _FSUIA_Reserved_Global_.GetRootElement
EndFunction

object function FSUIAGetElementFromHandle(int hWnd)
return _FSUIA_Reserved_Global_.GetElementFromHandle(hWnd)
EndFunction

object function FSUIAGetElementFromIAccessible(object accessibleObject, int childID)
return _FSUIA_Reserved_Global_.GetElementFromIAccessible(accessibleObject,childID)
EndFunction

object function FSUIAGetElementFromPoint(int x, int y)
return _FSUIA_Reserved_Global_.GetElementFromPoint(x,y)
EndFunction

object function FSUIAGetParentOfElement(object element)
if !element return Null() endIf
_FSUIA_Reserved_treewalker_.currentElement = element
if _FSUIA_Reserved_treewalker_.gotoParent()
	return _FSUIA_Reserved_treewalker_.currentElement
endIf
return Null()
EndFunction

object function FSUIAGetFirstChildOfElement(object element)
if !element return Null() endIf
_FSUIA_Reserved_treewalker_.currentElement = element
if _FSUIA_Reserved_treewalker_.gotoFirstChild()
	return _FSUIA_Reserved_treewalker_.currentElement
endIf
return Null()
EndFunction

Object Function FSUIAGetNthChildOfElement (object element, int iChild)
if !element || !iChild return Null() endIf
var object oChildren = element.findAll(TreeScope_Children, FSUIARawViewCondition ())
iChild = iChild - 1; UIA arrays are 0-based
if !oChildren(iChild)
	return Null()
endIf
return oChildren(iChild)
EndFunction

object function FSUIAGetNextSiblingOfElement(object element)
if !element return Null() endIf
_FSUIA_Reserved_treewalker_.currentElement = element
if _FSUIA_Reserved_treewalker_.gotoNextSibling()
	return _FSUIA_Reserved_treewalker_.currentElement
endIf
return Null()
EndFunction

object function FSUIAGetPriorSiblingOfElement(object element)
if !element return Null() endIf
_FSUIA_Reserved_treewalker_.currentElement = element
if _FSUIA_Reserved_treewalker_.gotoPriorSibling()
	return _FSUIA_Reserved_treewalker_.currentElement
endIf
return Null()
EndFunction

object function FSUIAGetAncestorOfControlType(object element, int UIAControlType)
if !element return Null() endIf
_FSUIA_Reserved_treewalker_.currentElement = element
while _FSUIA_Reserved_treewalker_.gotoParent()
	if _FSUIA_Reserved_treewalker_.currentElement.controlType == UIAControlType
		return _FSUIA_Reserved_treewalker_.currentElement
	endIf
endWhile
return Null()
EndFunction

object function FSUIAGetAncestorOfAriaRole(object element, string ARIARole)
if !element return Null() endIf
_FSUIA_Reserved_treewalker_.currentElement = element
var string role
while _FSUIA_Reserved_treewalker_.gotoParent()
	role = _FSUIA_Reserved_treewalker_.currentElement.ariaRole 
	if role && role == ARIARole
		return _FSUIA_Reserved_treewalker_.currentElement
	endIf
endWhile
return Null()
EndFunction

object function FSUIAGetAncestorWithClass(string class, optional object element, int ByRef level)
if !element
	element = FSUIAGetFocusedElement()
endIf
_FSUIA_Reserved_treewalker_.currentElement = element
level = 0
while _FSUIA_Reserved_treewalker_.gotoParent()
	level = level + 1
	if class == _FSUIA_Reserved_treewalker_.currentElement.className 
		return _FSUIA_Reserved_treewalker_.currentElement
	endIf
endWhile
level = -1
return Null()
EndFunction

string function FSUIAGetFocusedDocumentTextRangeText(optional object element)
if !element
	element = _FSUIA_Reserved_Global_.GetFocusedElement()
endIf
if !element return cscNull endIf
var object range = element.GetTextPattern().DocumentRange()
if !range return cscNull endIf
return range.GetText(TextRange_NoMaxLength)
EndFunction

string function FSUIAGetFocusedElementValueText(optional object element)
if !element
	element = _FSUIA_Reserved_Global_.GetFocusedElement()
endIf
if !element return cscNull endIf
var object oValuePattern = element.GetValuePattern()
if !oValuePattern return cscNull endIf
return oValuePattern.value
EndFunction

object function GetUIAElementAtPoint(int x, int y)
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return Null() endIf
return oUIA.GetElementFromPoint( x, y )
EndFunction

object function GetUIAFocusElement(object UIAObject)
var object element = UIAObject.GetFocusedElement()
if !element
	;Even though there is focus, GetFocusedElement may not retrieve an element
	element = UIAObject.GetElementFromHandle(GetFocus())
endIf
return element
EndFunction

void function SetCurrentElementToFirstElement(object UIAObject, object treeWalker)
if !UIAObject || !treeWalker return Null() endIf
var object element = GetUIAFocusElement(UIAObject).BuildUpdatedCache()
treeWalker.CurrentElement = element
while treeWalker.GoToParent() EndWhile
while treeWalker.GoToPriorSibling() EndWhile
EndFunction

void function SetCurrentElementToDeepestFocusElement(object oUIA, object treeWalker)
;More than one element in a process may show as having the focus,
;this tries to set the current element to the deepest focus element which is keyboard focusable.
if !oUIA || !treeWalker return Null() endIf
var object focusElement = oUIA.GetFocusedElement().BuildUpdatedCache()
if !focusElement
	;Even though there is focus, GetFocusedElement may not retrieve an element
	treeWalker.currentElement = oUIA.GetElementFromHandle(GetFocus())
	return
endIf
var object condition = oUIA.CreateAndCondition(
	oUIA.CreateBoolPropertyCondition(UIA_HasKeyboardFocusPropertyId, UIATrue),
	oUIA.CreateBoolPropertyCondition(UIA_IsKeyboardFocusablePropertyId, UIATrue))
if !condition
	treeWalker.currentElement = FocusElement
	return
endIf
;looking for the focus element which is keyboard focusable will cause a crash if used in the context menu of an item in the system tray:
if focusElement.controltype == UIA_MenuBarControlTypeId
&& focusElement.isOffscreen
	treeWalker.currentElement = oUIA.GetRootElement()
	treeWalker.currentElement = treeWalker.currentElement.FindFirst(TreeScope_Subtree, oUIA.CreateBoolPropertyCondition(UIA_HasKeyboardFocusPropertyId, UIATrue))
	return
endIf
treeWalker.currentElement = oUIA.GetRootElement()
while !!FocusElement && !oUIA.CompareElements(focusElement,treeWalker.currentElement)
	treeWalker.currentElement = focusElement
	focusElement = FocusElement.FindFirst(TreeScope_Subtree, condition ).BuildUpdatedCache()
endWhile
EndFunction

object function CreateUIAFocusElement(int bGetDeepestFocus)
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return Null() endIf
if !bGetDeepestFocus
	return GetUIAFocusElement(oUIA).BuildUpdatedCache()
endIf
var object treeWalker = CreateUIARawViewTreeWalker()
SetCurrentElementToDeepestFocusElement(oUIA,treeWalker)
return treeWalker.currentElement
EndFunction

object function CreateUIAElementFromWindow(optional handle hWnd)
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return Null() endIf
if hWnd
	return oUIA.GetElementFromHandle(hWnd)
else
	return oUIA.GetElementFromHandle(GetFocus())
EndIf
EndFunction

object function CreateUIANextSiblingOfElement(object element)
if !element return Null() EndIf
var object treeWalker = CreateUIARawViewTreeWalker()
TreeWalker.CurrentElement = element
if !treeWalker.GoToNextSibling() return Null() endIf
return TreeWalker.currentElement
EndFunction

object function CreateUIAPriorSiblingOfElement(object element)
if !element return Null() EndIf
var object treeWalker = CreateUIARawViewTreeWalker()
TreeWalker.CurrentElement = element
if !treeWalker.GoToPriorSibling() return Null() endIf
return TreeWalker.currentElement
EndFunction

object function CreateUIAParentOfElement(object element)
if !element return Null() EndIf
var object treeWalker = CreateUIARawViewTreeWalker()
TreeWalker.CurrentElement = element
if !treeWalker.GoToParent() return Null() endIf
return TreeWalker.currentElement
EndFunction

object function CreateUIAFirstChildOfElement(object element)
if !element return Null() EndIf
var object treeWalker = CreateUIARawViewTreeWalker()
TreeWalker.CurrentElement = element
if !treeWalker.GoToFirstchild() return Null() endIf
return TreeWalker.currentElement
EndFunction

object function CreateUIARawViewTreeWalker(optional int bSetCurrentAtFocus)
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return Null() endIf
var object treeWalker = oUIA.CreateTreeWalker(oUIA.CreateRawViewCondition())
if bSetCurrentAtFocus
	treeWalker.CurrentElement = GetUIAFocusElement(oUIA).BuildUpdatedCache()
endIf
return TreeWalker
EndFunction

object function CreateUIATreeWalkerWithCurrentElement(object element, optional object condition)
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return Null() endIf
if !condition condition = oUIA.CreateRawViewCondition() EndIf
var object treeWalker = oUIA.CreateTreeWalker(condition)
TreeWalker.CurrentElement = element
return TreeWalker
EndFunction

object function CreateUIATreeWalkerForFocusProcessId(optional object condition, int bSetCurrentElementToFocus)
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return Null() endIf
if !condition condition = oUIA.CreateRawViewCondition() EndIf
var object element = GetUIAFocusElement(oUIA)
if !element return Null() endIf
var object process = oUIA.CreateIntPropertyCondition(UIA_ProcessIdPropertyId, element.ProcessID)
var object treewalkerCondition = oUIA.CreateAndCondition( process, condition)
var object treeWalker = oUIA.CreateTreeWalker(treeWalkerCondition)
if bSetCurrentElementToFocus
	SetCurrentElementToDeepestFocusElement(oUIA,treeWalker)
else
	SetCurrentElementToFirstElement(oUIA,treeWalker)
endIf
return treeWalker
EndFunction

string function GetWin8AppWindowTitle()
var object focusElement = FSUIAGetFocusedElement()
if !focusElement return cscNull endIf
var int processID = focusElement.processID
var object treewalker
if StringLower(GetObjectProcessName()) == "explorer.exe"
	;Find the correct pane or window and get its title.
	treeWalker = FSUIARawViewWalker()
	treewalker.currentElement = focusElement
	var object element = treewalker.currentElement
	while treewalker.gotoParent()
		if treewalker.currentElement.processID == processID
			element = treewalker.currentElement
		endIf
	endWhile
	;Element is now one level down from the root.
	if element.controlType == UIA_WindowControlTypeID
		;This is a Windows Explorer window, return its name:
		return element.name
	elif element.className == ShellTrayClass
		;Focus is somewhere in the taskbar pane, return the pane name:
		return element.name
	elif element.className == cwc_Progman
	|| element.className == cwc_WorkerW
		;The desktop has the focus, but it has no name.
		;return the name of the root, which is the desktop name.
		return FSUIAGetParentOfElement(element).name
	endIf
	;no match for anticipated tests:
	return cscNull
endIf
;now for apps which are not running with the progman process ID:
var object condition = FSUIACreateAndCondition(
	FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_WindowControlTypeId),
	FSUIACreateIntPropertyCondition(UIA_ProcessIdPropertyId, processID))
if !condition return cscNull endIf
treeWalker = FSUIACreateTreeWalker(condition)
if !treeWalker return cscNull endIf
treeWalker.currentElement = focusElement
while treewalker.gotoParent()
endWhile
if !StringIsBlank(treeWalker.currentElement.name)
	return treeWalker.currentElement.name
endIf
treeWalker.currentElement = FSUIAGetRootElement()
treeWalker.GoToFirstChild()
if !StringIsBlank(treeWalker.currentElement.name)
	return treeWalker.currentElement.name
endIf
while UIAGoToNextInTree(treeWalker)
	if !StringIsBlank(treeWalker.currentElement.name)
		return treeWalker.currentElement.name
	endIf
endWhile
return cscNull
EndFunction


object function FindUIAElementOfProperty(int propertyID, variant property,
	optional int scope, object startElement, object condition)
var	object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return Null() endIf
var object propertyCondition
if GetVariantType(property) == vt_int then
	propertyCondition = oUIA.CreateIntPropertyCondition(propertyID, property)
	if !propertyCondition
		propertyCondition = oUIA.CreateBoolPropertyCondition(propertyID, property)
	endIf
elif GetVariantType(property) == vt_string then
	propertyCondition = oUIA.CreateStringPropertyCondition(propertyID, property)
else
	return Null()
EndIf
if !propertyCondition return Null() endIf
if !scope scope = TreeScope_Subtree endIf
if !startElement startElement = GetUIAFocusElement(oUIA).BuildUpdatedCache() EndIf
if !condition
	var object viewCondition = oUIA.CreateRawViewCondition()
	var object processCondition = oUIA.CreateIntPropertyCondition(
		UIA_ProcessIdPropertyId, GetUIAFocusElement(oUIA).ProcessID)
	condition = oUIA.CreateAndCondition(processCondition,viewCondition)
EndIf
var object andCondition = oUIA.CreateAndCondition(condition, propertyCondition)
return startElement.FindFirst(scope, andCondition )
EndFunction

object function FindAllUIAElementsOfProperty(int propertyID, variant property,
	optional int scope, object startElement, object condition)
var	object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return Null() endIf
var object propertyCondition
if GetVariantType(property) == vt_int
	propertyCondition = oUIA.CreateIntPropertyCondition(propertyID, property)
	if !propertyCondition
		propertyCondition = oUIA.CreateBoolPropertyCondition(propertyID, property)
	endIf
elif GetVariantType(property) == vt_string then
	propertyCondition = oUIA.CreateStringPropertyCondition(propertyID, property)
else
	return Null()
EndIf
if !propertyCondition return Null() endIf
if !scope scope = TreeScope_Subtree endIf
if !startElement startElement = GetUIAFocusElement(oUIA).BuildUpdatedCache() endIf
if !condition
	var object viewCondition = oUIA.CreateRawViewCondition()
	var object processCondition = oUIA.CreateIntPropertyCondition(
		UIA_ProcessIdPropertyId, GetUIAFocusElement(oUIA).ProcessID)
	condition = oUIA.CreateAndCondition( processCondition, viewCondition)
EndIf
var object andCondition = oUIA.CreateAndCondition(condition, propertyCondition)
return startElement.FindAll(scope, andCondition )
EndFunction

object function FindUIAElementOfType(int type, optional object startElement, object condition)
return FindUIAElementOfProperty(UIA_ControlTypePropertyId, type, TreeScope_Subtree, startElement, condition)
EndFunction

object function FindAllUIAElementsOfType(int type, optional object startElement, object condition)
return FindAllUIAElementsOfProperty(UIA_ControlTypePropertyId, type, TreeScope_Subtree, startElement, condition)
EndFunction

int function CompareUIAElements(object element1, object element2)
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
return oUIA.CompareElements(element1,element2)
EndFunction

int function GetBoundingRectFromRectArray(object rectArray, int byRef left, int byRef top, int byRef right, int byRef bottom)
left = 0
top = 0
right = 0
bottom = 0
if !rectArray return false endIf
var	object o
forEach o in rectArray
	if (!left || o.left < left) left = o.left endIf
	if (!right || o.right > right) right = o.right endIf
	if (!top || o.top < top) top = o.top endIf
	if (!bottom || o.bottom > bottom) bottom = o.bottom endIf
endForEach
return (left && top && right && bottom)
EndFunction

int function UIAElementHasValidRect(object element)
if !element return false endIf
var object rect = element.BoundingRectangle
;make sure there really is a rectangle:
if !rect
|| !(rect.right-rect.left)
|| !(rect.bottom-rect.top)
	return false
endIf
return true
endFunction

int function ElementBoundingRectsAreIdentical(object element1, object element2)
;make sure there really are rectangles for both elements:
if !UIAElementHasValidRect(element1)
|| !UIAElementHasValidRect(element2)
	return false
endIf
return element1.BoundingRectangle.left == element2.BoundingRectangle.left
	&& element1.BoundingRectangle.top == element2.BoundingRectangle.top
	&& element1.BoundingRectangle.right == element2.BoundingRectangle.right
	&& element1.BoundingRectangle.bottom == element2.BoundingRectangle.bottom
EndFunction

int function UIAMoveRangeEndPointPastClickablePointRangeFormat(object byRef range, object textPattern, object element,
	optional int bReverseDirection)
var
	object scrollItemPattern,
	object parent,
	object pointRange,
	int x,
	int y
if !range || !element return false endIf
if !element.GetClickablePoint( intRef(x), intRef(y))
	scrollItemPattern = element.GetScrollItemPattern()
	if !scrollItemPattern
			parent = UIAGetParent( element );
		if !parent return false EndIf
		scrollItemPattern = parent.GetScrollItemPattern()
		if !scrollItemPattern return false EndIf
	endIf
	scrollItemPattern.ScrollIntoView()
	if !element.GetClickablePoint( intRef(x), intRef(y)) return false endIf
endIf
pointRange = textPattern.rangeFromPoint(x,y)
if !pointRange return false endIf
pointRange.ExpandToEnclosingUnit(textUnit_format)
if bReverseDirection
	range.MoveEndpointByRange(TextPatternRangeEndpoint_End,pointRange,TextPatternRangeEndpoint_Start)
else
	range.MoveEndpointByRange(TextPatternRangeEndpoint_Start,pointRange,TextPatternRangeEndpoint_End)
endIf
return true
EndFunction


int function UIAMoveRangeEndPointPastChildRange(object byRef range, object textPattern, object element,
	optional int bReverseDirection)
var
	object childRange,
	object childRangeElement
childRange = UIAGetNearestChildRangeFromTextPattern(textPattern, element,bReverseDirection,childRangeElement)
if !childRange return false endIf
if bReverseDirection
	if childRangeElement == element
		range.MoveEndpointByRange(TextPatternRangeEndpoint_End,childRange,TextPatternRangeEndpoint_Start)
	else
		range.MoveEndpointByRange(TextPatternRangeEndpoint_End,childRange,TextPatternRangeEndpoint_End)
	endIf
else
	if childRangeElement == element
		range.MoveEndpointByRange(TextPatternRangeEndpoint_Start,childRange,TextPatternRangeEndpoint_End)
	else
		range.MoveEndpointByRange(TextPatternRangeEndpoint_Start,childRange,TextPatternRangeEndpoint_Start)
	endIf
endIf
return true
endFunction

object function UIAGetNextHeadingRangeFromDocumentRange(object documentRange,
	optional int bReverseDirection, int highestPriority, int lowestPriority)
var
	object h,
	int firstHeadingStyleType,
	int lastHeadingStyletype,
	collection c,
	string k,
	int i,
	int compare
;set the heading style types to use for the search:
if (highestPriority < 1 || highestPriority > 9)
|| (lowestPriority && highestPriority > lowestPriority)
	firstHeadingStyleType = StyleId_Heading1
else
	firstHeadingStyleType = StyleId_Heading1+highestPriority-1
endIf
if (lowestPriority < 1 || lowestPriority > 9)
|| (highestPriority && lowestPriority < highestPriority)
	lastHeadingStyleType = StyleId_Heading9
else
	lastHeadingStyleType = StyleId_Heading1+lowestPriority-1
endIf
;Collect one of each existing heading style range in the specified set of heading level priorities:
c = new collection
for i = firstHeadingStyleType to lastHeadingStyleType
	h = documentRange.FindAttribute( UIA_StyleIdAttributeId,   i, bReverseDirection)
	if h
		c[IntToString(i-StyleId_Heading1+1)] = h.clone()
	endIf
endFor
;Now find the closest heading range:
while CollectionItemCount(c)
	forEach k in c
		if CollectionItemCount(c) == 1 return c[k] endIf
		if !h
			h = c[k]
		else
			compare = c[k].CompareEndPoints(   TextPatternRangeEndpoint_Start, h, TextPatternRangeEndpoint_Start)
			if (!bReverseDirection && compare > 0)
			|| (bReverseDirection && compare < 0)
				CollectionRemoveItem(c,k)
			elif (!bReverseDirection && compare < 0)
			|| (bReverseDirection && compare > 0)
				h = c[k]
			endIf
		endIf
	endForEach
endWhile
return Null()
EndFunction


int function UIAWalkTheTree(object treeWalker, optional int bReverse)
if bReverse
	return UIAGoToPriorInTree(treeWalker)
else
	return UIAGoToNextInTree(treeWalker)
endIf
EndFunction

int function UIAGoToNextInBranch(object oUIA, object treeWalker, object branchStart)
if !(oUIA && treeWalker) return false endIf
if treeWalker.GoToFirstChild() return true EndIf
if treeWalker.GoToNextSibling() return true EndIf
var object prevElement = treeWalker.currentElement
while treeWalker.GoToParent()
	if oUIA.CompareElements(treewalker.currentElement,branchStart) return false endIf
	if treeWalker.GoToNextSibling() return true EndIf
EndWhile
treeWalker.currentElement = prevElement
return false
EndFunction

string function GetTextFromDocumentRange(object element)
if !element return cscNull endIf
var object textPattern = element.GetTextPattern()
if !textPattern return cscNull endIf
var object range = textPattern.documentRange
if !range return cscNull endIf
range.ExpandToEnclosingUnit(TextUnit_Document)
return range.getText(TextRange_NoMaxLength)
EndFunction

object function GetTopLevelAppElement()
return _FSUIA_Reserved_Global_.GetElementFromHandle(GetAppMainWindow (GetFocus ()))
EndFunction

string function GetElementRuntimeIDString(object element)
if !element return Null() endIf
var object elementIDs = element.GetRuntimeID()
if !(elementIDs || elementIDs.count) return Null() endIf
var string s, string retVal
forEach s in elementIDs
	retVal = retVal+DecToHex(StringToInt(s))+"."
endForEach
return StringChopRight(retVal,1)
EndFunction

int function UIAGoToNextInSubtree(object treeWalker, object root)
if (!treeWalker)	return false endIf
if treeWalker.GoToFirstChild() return true EndIf
if FSUIACompareElements(treewalker.currentElement,root)
	;If this is the root and it has no children, there is no subtree to traverse:
	return false
endIf
if treeWalker.GoToNextSibling() return true EndIf
var object prevElement = treeWalker.currentElement
while treeWalker.GoToParent()
	if FSUIACompareElements(treewalker.currentElement,root)
		;If we have moved back to the root then the traversal is over:
		treeWalker.currentElement = prevElement
		return false
	endIf
	if treeWalker.GoToNextSibling() return true EndIf
EndWhile
;There is no next element in the tree:
treeWalker.currentElement = prevElement
return false
EndFunction

string function PositionInGroupFromUIA(object element)
if !element return cscNull endIf
var int index, int size
size = element.sizeOfSet
if !size return cscNull endIf
index = element.positionInSet 
;account for out of bounds UIA where something's wrong:
if (index < 1 || index > size) return cscNull endIf
return formatString (cmsgPosInGroup1, index, size)
EndFunction

int function FSUIAGetWindowVisualState(optional handle hWnd)
if !hWnd
	hWnd = GetAppMainWindow(GetFocus())
endIf
var object oWindowPattern = _FSUIA_Reserved_Global_.GetElementFromHandle(hWnd).GetWindowPattern()
return oWindowPattern.visualState
EndFunction

int function UIAIsPointInElementRect(object element, int x, int y)
if !UIAElementHasValidRect(element) return false endIf
var object rect = element.BoundingRectangle
return IsPointInRect(x, y, rect.left, rect.top, rect.right, rect.bottom)
endFunction

object function UIAGetSiblingElementWithIdenticalRect(object oElement)
var
	object oParent = FSUIAGetParentOfElement(oElement),
	object oCondition = FSUIACreateBoolCondition (UIA_IsEnabledPropertyId, UIATrue),
	object oSiblings = oParent.findAll(TreeScope_Children, oCondition),
	object oSibling
if oSiblings.count <= 1 return Null() endIf
ForEach oSibling in oSiblings
	if !FSUIACompareElements (oElement, oSibling)
	&& ElementBoundingRectsAreIdentical(oElement, oSibling)
		return oSibling
	endIf
EndForEach
return Null()
endFunction

object function UIAGetElementWithPointInElementRect(object oElement, int x, int y)
if !oElement return Null() endIf
var
	object oCondition = FSUIACreateBoolCondition (UIA_IsEnabledPropertyId, UIATrue),
	object oChildren = oElement.findAll(TreeScope_Children, oCondition),
	object oChild
if !oChildren.count
	oElement = UIAGetSiblingElementWithIdenticalRect(oElement)
	if !oElement return Null() endIf
	oChildren = oElement.findAll(TreeScope_Children, oCondition)
endIf
ForEach oChild in oChildren
	if UIAIsPointInElementRect(oChild, x, y)
		return oChild
	endIf
EndForEach
return Null()
endFunction

object function UIAGetDeepestElementWithPointInElementRect(object oElement, int x, int y)
var
	object oRootElement,
	object oDeepestElement
oDeepestElement = oElement
oRootElement = UIAGetElementWithPointInElementRect(oElement, x, y)
while oRootElement
	oRootElement = UIAGetElementWithPointInElementRect(oRootElement, x, y)
	if oRootElement
		oDeepestElement = oRootElement
	endIf
endWhile
return oDeepestElement
endFunction

int function FSUIAGetDescendantCount(object element)
if !element return UIAScriptError endIf
var
	object oDescendants = element.findAll(TreeScope_Descendants, FSUIACreateTrueCondition ())
return oDescendants.count
endFunction

; JAWS script file for Windows 8 Start screen touch navigation and UIA events

include "hjConst.jsh"
include "hjGlobal.jsh"
include "common.jsm"
include "UIA.jsh"
include "TWinUI.jsh"
include "TWinUI.jsm"
import "UIA.jsd"
import "touch.jsd"

const
;UI automation ids:
	automation_CharmBar_window = "Charm Bar"


string function GetValueString(object element)
;this is a fudge of the default GetValueString from touch.jss,
;which allows us to return live tile text as the value string to be used when speaking the Start screen tile.
;If the global tree walker does exist but we are unable to find anything for the live tile,
;we fall back to the default GetValueString function.
var	object oCurrent = TouchCursorObject()
if !oCurrent return cscNull endIf
var object o = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !o return GetValueString(oCurrent) endIf
var object treeCondition = o.CreateRawViewCondition()
if !treeCondition return GetValueString(oCurrent) endIf
var object treeWalker = o.CreateTreeWalker( treeCondition )
if !treeWalker return GetValueString(oCurrent) endIf
var object liveTileCondition = o.CreateStringPropertyCondition( UIA_ClassNamePropertyId,oc_AppSpaceElement)
if !liveTileCondition return GetValueString(oCurrent) endIf
var object liveTile = oCurrent.FindFirst(TreeScope_Children, liveTileCondition)
if !liveTile return GetValueString(oCurrent) endIf
return liveTile.name
EndFunction

void Function UIASayElement( object element , optional int bSilenceHasFocus, optional int bSilencePosition)
;The coordinates are overly verbose on touch navigation,
;so restrict their announcement to say of current element.
var	string currentScript = GetScriptAssignedTo(GetCurrentScriptKeyName())
if currentScript != "TouchSayCurrentElement"
&& !(GetGestureMode() == GestureMode_TouchNavigation && currentScript == "GestureTwoFingersFlickUp")
	bSilencePosition = true
endIf
UIASayElement( element , bSilenceHasFocus, bSilencePosition)
EndFunction

void function SetTouchNavigationMode(int navState, optional int bCancelTextReviewOnSuspension)
;failure to update after deactivation of touch cursor may cause focus item data to be out of date:
SetTouchNavigationMode(navState,bCancelTextReviewOnSuspension)
UpdateFocusItemData()
EndFunction

int function BrailleAddObjectName(int nType)
if nType == wt_list
&& IsTouchCursor()
	;do not show the list item name as the list name
	return true
endIf
BrailleAddObjectName(nType)
EndFunction

int function BrailleAddObjectValue(int nType)
if nType == wt_list
& IsTouchCursor()
	BrailleAddString(BrailleGetObjectNameForTouchNavElement(),0,0,0)
	var string liveContent
	liveContent = GetValueString(TouchCursorObject())
	if liveContent
		BrailleAddString(liveContent,0,0,0)
	endIf
	return true
endIf
BrailleAddObjectValue(nType)
EndFunction

int function DetectCharmsWindow()
var object o = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !o return false endIf
var object element = o.GetFocusedElement().BuildUpdatedCache()
if element.controlType == UIA_WindowControlTypeId
&& element.automationId == automation_CharmBar_window
	SayControlEx (
		0, ; handle
		element.name,
		element.LocalizedControlType,
		cscNull, ;state
		cscNull, ; container name
		cscNull, ; container type
		cscNull, ; value
		cscNull, ;position
		cscNull) ; static text
	return true
endIf
return false
EndFunction

int function MainProcessShouldSkipUIAElementWhenNavigating( object element )
if element.controlType == UIA_PaneControlTypeId
	;a pane element may briefly exist as grandchild to a tile,
	;and if the touch cursor is there when the pane element is destroyed the touch cursor gets stuck.
	;These panes contain no useful information,
	;so we remove these panes from touch navigation.
	var object grandParent = UIAGetGrandParent(element)
	if grandparent.className == oc_GridTileElement
		return true
	endIf
endIf
return MainProcessShouldSkipUIAElementWhenNavigating( element )
EndFunction

void function MoveStartScreenGroup(int direction)
var
	object item = CreateUIAFocusElement(),
	object nextItemBeforeMove,
	object nextItemAfterMove,
	object priorItemBeforeMove,
	object priorItemAfterMove
nextItemBeforeMove = CreateUIANextSiblingOfElement(item)
priorItemBeforeMove = CreateUIAPriorSiblingOfElement(item)
if !nextItemBeforeMove
&& !priorItemBeforeMove
	;there is only one group
	return
endIf
if direction == direction_TileOrGroupLeft
	TypeKey("Alt+Shift+ExtendedLeftArrow")
elif direction == direction_TileOrGroupRight
	TypeKey("Alt+Shift+ExtendedRightArrow")
elif direction == direction_TileOrGroupUp
	TypeKey("Alt+Shift+ExtendedUpArrow")
elif direction == direction_TileOrGroupDown
	TypeKey("Alt+Shift+ExtendedDownArrow")
else
	return
endIf
nextItemAfterMove = CreateUIANextSiblingOfElement(item)
priorItemAfterMove = CreateUIAPriorSiblingOfElement(item)
if CompareUIAElements(priorItemBeforeMove,nextItemAfterMove)
	Say(msgMoveGroupLeft,ot_screen_message)
elif CompareUIAElements(nextItemBeforeMove,priorItemAfterMove)
	Say(msgMoveGroupRight,ot_screen_message)
endIf
EndFunction

void function MoveStartScreenTile(int direction)
var
	object item = CreateUIAFocusElement(),
	object parentBeforeMove,
	string groupNameBeforeMove,
	object parentAfterMove,
	string GroupNameAfterMove,
	object nextItem,
	object priorItem
parentBeforeMove = CreateUIAParentOfElement(item)
GroupNameBeforeMove = parentBeforeMove.name
if direction == direction_TileOrGroupLeft
	TypeKey("Alt+Shift+ExtendedLeftArrow")
elif direction == direction_TileOrGroupRight
	TypeKey("Alt+Shift+ExtendedRightArrow")
elif direction == direction_TileOrGroupUp
	TypeKey("Alt+Shift+ExtendedUpArrow")
elif direction == direction_TileOrGroupDown
	TypeKey("Alt+Shift+ExtendedDownArrow")
else
	return
endIf
item = CreateUIAFocusElement()
parentAfterMove = CreateUIAParentOfElement(item)
groupNameAfterMove = parentAfterMove.name
if !CompareUIAElements(parentBeforeMove,ParentAfterMove)
	PlayNewGroupNavSound()
	nextItem = CreateUIANextSiblingOfElement(item)
	priorItem = CreateUIAPriorSiblingOfElement(item)
	if !nextItem
	&& !priorItem
		;A new group of one tile is being created:
		Say(FormatString(msgCreatingGroupDuringMove,groupNameAfterMove),ot_screen_message)
	else
		if groupNameAfterMove != groupNameBeforeMove
			;The tile moves into a new group:
			Say(FormatString(msgEnteringGroupDuringMove,groupNameAfterMove),ot_screen_message)
		else
			;The tile moves into a new group
			;and the new group has been renamed to the previous group,
			;which was named after the tile being moved:
			Say(FormatString(msgNewGroupRenamedDuringMove,groupNameAfterMove),ot_screen_message)
		endIf
	endIf
else ;group did not change
	if groupNameAfterMove != groupNameBeforeMove
		;Repositioning the tile in a group renamed the group:
		Say(FormatString(msgCurrentGroupRenamedDuringMove,groupNameBeforeMove,groupNameAfterMove),ot_screen_message)
	endIf
endIf
Say(GetGridItemRowAndColumnPosition(item),ot_position)
EndFunction

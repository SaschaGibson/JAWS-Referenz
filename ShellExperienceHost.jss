;Copyright 2015 Freedom Scientific, Inc.
;Freedom Scientific script file for Windows 10 Start Menu

include "hjConst.jsh"
include "hjGlobal.jsh"
include "MSAAConst.jsh"
include "UIA.jsh"
include "common.jsm"
include "ShellExperienceHost.jsm"

import "touch.jsd"

const
;UIA classes:
	UIAClass_Popup = "Popup"

const
	oUIA_ShellExperienceHost_EventFunctionNamePrefix = "ShellExperienceHost"
globals
	object oUIA_ShellExperienceHost,
	object oUIA_ShellExperienceHostTreeWalker,
	object oUIA_ShellExperienceHostFocusElement,
	object oUIA_ShellExperienceHost_ToolTipListener

int function IndicateSelectedListItemState (optional int Braille)
if getObjectRole () != ROLE_SYSTEM_LISTITEM return FALSE endIf
; for selected list items such as sound card in Win 11,
;STATE_SYSTEM_DEFAULT takes the place of selected, and is the only bit set when the item is selected.
; Items in this case can only be selected with space bar, or is the one item in the list.
if getObjectStateCode (TRUE) != STATE_SYSTEM_DEFAULT return FALSE endIf
if Braille then
	BrailleAddString (BrailleGetStateString (CTRL_SELECTED), 0,0,0)
else
	indicateControlState (WT_LISTBOXITEM, CTRL_SELECTED)
endIf
return TRUE
endFunction

script SayLine ()
PerformScript SayLine ()
if ! isSameScript () then ; SpellString gets and spells the selected state.
	IndicateSelectedListItemState ()
endIf
endScript

void function SayObjectTypeAndText (optional int level, int IncludeContainerName)
SayObjectTypeAndText (level, includeContainerName)
if ! level IndicateSelectedListItemState () endIf
endFunction

void function SayObjectActiveItem (optional int AnnouncePosition)
SayObjectActiveItem (AnnouncePosition)
IndicateSelectedListItemState ()
endFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
IndicateSelectedListItemState ()
endFunction

int function BrailleAddObjectState (int subtypeCode)
var int Braille = TRUE
if subtypeCode == WT_LISTBOXITEM && IndicateSelectedListItemState (Braille) return TRUE endIf
return BrailleAddObjectState (subtypeCode)
endFunction

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
If !KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	return false
EndIf
if IndicateSelectedListItemState () return TRUE endIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
endFunction

void function AutoStartEvent()
InitShellExperienceHost()
EndFunction

void function AutoFinishEvent()
oUIA_ShellExperienceHost = Null()
oUIA_ShellExperienceHostTreeWalker = Null()
StopListeningForToolTipOpen()
EndFunction

int function InitShellExperienceHost()
if oUIA_ShellExperienceHost return endIf
oUIA_ShellExperienceHost = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !oUIA_ShellExperienceHost return endIf
if !ComAttachEvents(oUIA_ShellExperienceHost,oUIA_ShellExperienceHost_EventFunctionNamePrefix)
	oUIA_ShellExperienceHost = Null()
	return
endIf
var object focusElement = oUIA_ShellExperienceHost.GetFocusedElement().BuildUpdatedCache()
if !focusElement
	oUIA_ShellExperienceHost = Null()
	return
endIf
if !oUIA_ShellExperienceHost.AddFocusChangedEventHandler()
	oUIA_ShellExperienceHost = Null()
	return
endIf
var object processCondition = oUIA_ShellExperienceHost.CreateIntPropertyCondition(UIA_ProcessIdPropertyId,focusElement.ProcessID)
if !processCondition
	oUIA_ShellExperienceHost = Null()
	return
endIf
oUIA_ShellExperienceHostTreeWalker = oUIA_ShellExperienceHost.CreateTreeWalker(processCondition)
if !oUIA_ShellExperienceHostTreeWalker
	oUIA_ShellExperienceHost = Null()
	return
endIf
oUIA_ShellExperienceHostTreeWalker.currentElement = focusElement
oUIA_ShellExperienceHostFocusElement = focusElement
EndFunction

void function ShellExperienceHostFocusChangedEvent (object element)
oUIA_ShellExperienceHostFocusElement = element
EndFunction

int function IsUIAGridItem()
return !UserBufferIsActive()
	&& oUIA_ShellExperienceHostFocusElement.GetPropertyValue(UIA_IsGridItemPatternAvailablePropertyId)
EndFunction

string function GetCell()
var string text = GetCell()
if !text
&& IsUIAGridItem()
	text = oUIA_ShellExperienceHostFocusElement.name
endIf
return text
EndFunction

void function Saycell()
if !IsUIAGridItem() return SayCell() endIf
var string text = oUIA_ShellExperienceHostFocusElement.name
if text Say(text,ot_line) endIf
EndFunction

int function NextCell()
if !IsUIAGridItem() return NextCell() endIf
var object pattern = oUIA_ShellExperienceHostFocusElement.GetGridItemPattern()
if !pattern return false endIf
var int currentRow = pattern.row
oUIA_ShellExperienceHostTreeWalker.currentElement = oUIA_ShellExperienceHostFocusElement
if !oUIA_ShellExperienceHostTreeWalker.gotoNextSibling() return false endIf
pattern = oUIA_ShellExperienceHostTreeWalker.currentElement.GetGridItemPattern()
if !pattern return false endIf
if pattern.row != currentRow return false endIf
TypeKey(cksRightArrow)
return true
EndFunction

int function PriorCell()
if !IsUIAGridItem() return PriorCell() endIf
var object pattern = oUIA_ShellExperienceHostFocusElement.GetGridItemPattern()
if !pattern return false endIf
var int currentRow = pattern.row
oUIA_ShellExperienceHostTreeWalker.currentElement = oUIA_ShellExperienceHostFocusElement
if !oUIA_ShellExperienceHostTreeWalker.gotoPriorSibling() return false endIf
pattern = oUIA_ShellExperienceHostTreeWalker.currentElement.GetGridItemPattern()
if !pattern return false endIf
if pattern.row != currentRow return false endIf
TypeKey(cksLeftArrow)
return true
EndFunction

int function UpCell()
if !IsUIAGridItem() return UpCell() endIf
var object pattern = oUIA_ShellExperienceHostFocusElement.GetGridItemPattern()
if !pattern return false endIf
if pattern.row == 0 return false endIf
TypeKey(cksUpArrow)
return true
EndFunction

int function DownCell()
if !IsUIAGridItem() return DownCell() endIf
var object pattern = oUIA_ShellExperienceHostFocusElement.GetGridItemPattern()
if !pattern return false endIf
var int CurrentRow = pattern.row
var int rowSpan = pattern.rowSpan 
oUIA_ShellExperienceHostTreeWalker.currentElement = oUIA_ShellExperienceHostFocusElement
if !oUIA_ShellExperienceHostTreeWalker.gotoParent() return false endIf
pattern = oUIA_ShellExperienceHostTreeWalker.currentElement.GetGridPattern()
if !pattern return false endIf
if pattern.RowCount == currentRow+rowSpan return false endIf
TypeKey(cksDownArrow)
return true
EndFunction

string function GetUIAGridItemSpan()
if !IsUIAGridItem() return cscNull endIf
var object pattern = oUIA_ShellExperienceHostFocusElement.GetGridItemPattern()
if !pattern return cscNull endIf
var string colSpan, string rowSpan
if pattern.columnSpan > 1
	colSpan = FormatString(msgSpanMultipleColumns,pattern.columnSpan)
else
	colSpan = FormatString(msgSpanSingleColumn,pattern.columnSpan)
endIf
if pattern.rowSpan > 1
	rowSpan = FormatString(msgSpanMultipleRows,pattern.rowSpan)
else
	rowSpan = FormatString(msgSpanSingleRow,pattern.rowSpan)
endIf
return FormatString( msgGridItemSpanDescription,colSpan,RowSpan)
EndFunction

Void Function SpeakTableCells (int tableNavDir, int nPrevNumOfCells)
var int bIsUIAGridItem = IsUIAGridItem() 
if bIsUIAGridItem
&& tableNavDir != TABLE_NAV_NONE
	;when using table navigation in the start menu tiles, the cell announcement should come from the event rather than the navigation script:
	return
endIf
SpeakTableCells (tableNavDir, nPrevNumOfCells)
;for SayCell on start menu tile:
if bIsUIAGridItem 
	SayUsingVoice(vctx_message,GetUIAGridItemSpan(),ot_position)
endIf
EndFunction

void function StartListeningForToolTipOpen()
oUIA_ShellExperienceHost_ToolTipListener = Null()
oUIA_ShellExperienceHostTreeWalker.currentElement = oUIA_ShellExperienceHostFocusElement
oUIA_ShellExperienceHostTreeWalker.GotoParent()
oUIA_ShellExperienceHostTreeWalker.GotoParent()
if oUIA_ShellExperienceHostTreeWalker.currentElement.controlType != UIA_WindowControlTypeId
|| oUIA_ShellExperienceHostTreeWalker.currentElement.className != UIAClass_Popup
	return
endIf
oUIA_ShellExperienceHostTreeWalker.GotoParent()
if oUIA_ShellExperienceHostTreeWalker.currentElement.controlType != UIA_WindowControlTypeId
|| oUIA_ShellExperienceHostTreeWalker.currentElement.className != cwc_Windows_UI_Core_CoreWindow
	return
endIf
oUIA_ShellExperienceHost_ToolTipListener = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !ComAttachEvents(oUIA_ShellExperienceHost_ToolTipListener,oUIA_ShellExperienceHost_EventFunctionNamePrefix)
	oUIA_ShellExperienceHost_ToolTipListener = Null()
	return
endIf
if !oUIA_ShellExperienceHost_ToolTipListener.AddAutomationEventHandler( UIA_ToolTipOpenedEventId, oUIA_ShellExperienceHostTreeWalker.currentElement, TreeScope_Descendants)
	oUIA_ShellExperienceHost_ToolTipListener = Null()
	return
endIf
EndFunction

void function ShellExperienceHostAutomationEvent( object element, int eventID )
if eventID == UIA_ToolTipOpenedEventId
	Say(element.name,ot_tool_tip)
endIf
EndFunction

void function StopListeningForToolTipOpen()
oUIA_ShellExperienceHost_ToolTipListener = Null()
EndFunction

Void Function MenuModeEvent (handle WinHandle, int mode)
;ToolTipEvent fires for tooltips in the Power menu,
;but no text is passed to the function.
;Use a UIA event listener to detect the tooltip opened event and announce it.
if mode == Menu_Active
&& GetJCFOption(opt_ProcessToolTipEvent)
	StartListeningForToolTipOpen()
elif mode == Menu_Inactive
&& oUIA_ShellExperienceHost_ToolTipListener
	StopListeningForToolTipOpen()
endIf
MenuModeEvent (WinHandle, mode)
EndFunction

int function GetTableCoordinatesForSpeakTableCells(int ByRef nCol, int ByRef nRow, int tableNavDir)
nCol = 0
nRow = 0
var int result = GetTableCoordinatesForSpeakTableCells(nCol, nRow, tableNavDir)
if getObjectClassName () == "TextBlock" then
; Windows 11 Date and Time calendar which is in the system clock,
; as a notification.
	nCol = nCol+1
	nRow = nRow+1
endIf
return result
endFunction

script ScriptFileName()
ScriptAndAppNames(msgShellExperienceHostAppName)
EndScript

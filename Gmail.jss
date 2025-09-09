; Copyright 2023-2024 Freedom Scientific, Inc.
; Scripts file for Gmail

include "hjConst.jsh"
include "Gmail.jsm"

const
	Gmail_ExtendedSelectListboxItem_WaitTime = 4
globals
	int Gmail_SayExtendedSelectListboxItem_scheduleID

script ScriptFileName()
ScriptAndAppNames(msgGMailAppName)
EndScript

int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if nChangeDepth == 5
&& GetObjectSubtypeCode(SOURCE_CACHED_DATA,1) == wt_extendedSelect_listbox
&& GetObjectSubtypeCode() == wt_listboxItem
	;This is for the list which appears when editing a mail recipient.
	;We aren't actually redirecting the focus,
	;but we may want to skip announcement of this focus change if the focus change occurs because the user is editing text.
	if Gmail_SayExtendedSelectListboxItem_scheduleID
		unscheduleFunction(Gmail_SayExtendedSelectListboxItem_scheduleID)
	endIf
	Gmail_SayExtendedSelectListboxItem_scheduleID = ScheduleFunction("SayExtendedSelectListboxItem",Gmail_ExtendedSelectListboxItem_WaitTime)
	return true  ;Focus change announcement is skipped.
endIf
if !nChangeDepth
&& GetObjectSubTypeCode () == WT_DOCUMENT
&& HandleEmptyTabbedInboxCategory()
	return true
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void function SayExtendedSelectListboxItem()
Gmail_SayExtendedSelectListboxItem_scheduleID = 0
;the name of the list is the characters typed.
;We will use ot_line instead of ot_control_name, because we are not announcing the control type
;but are announcing the list name to represent the characters typed:
Say(GetObjectname(SOURCE_CACHED_DATA,1), ot_line)
SayLine()  ;the line is the selected list item
EndFunction

int function HandleEmptyTabbedInboxCategory()
var
	object XMLDomDoc = GetFSXMLDomDoc(),
	string sItemSpec = "//MainRegion//TabControl[@selected = 'true']",
	object oNode = XMLDomDoc.selectSingleNode(sItemSpec),
	string sTab = GetXMLDomNodeText(oNode),
	int fsID
if !oNode
	return false
endIf
sItemSpec = "//MainRegion//TabPanel//Row[1]"
oNode = XMLDomDoc.selectSingleNode(sItemSpec)
fsID = hexToDec(oNode.attributes.GetNamedItem("fsID").nodeValue)
if PerformActionOnElementWithID(Action_setFocus, fsID)
	;There are ads but no messages
	return true
endIf
if !StringIsBlank(sTab)
	;No messages or ads
	SayFormattedMessage (OT_NO_DISABLE, msgEmptyTab_L, msgEmptyTab_S, sTab)
	return true
endIf
return false
endFunction

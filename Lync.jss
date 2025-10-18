;Copyright 2015 Freedom Scientific, Inc.
;Freedom Scientific script file for Skype For Business

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "common.jsm"
include "lync.jsm"

import "UIA.jsd"

;UIA event handling:
const
	UIA_Lync_EventFunctionNamePrefix = "Lync"
globals
	object gUIA_Lync,
	object gUIA_LyncTreeWalker,
	object gUIA_Lync_FocusElement,
	int lyncVersion,
	string priorHistoryItemLinkName

;UIA automation id's and class names
const
	UIAClass_NetUIListViewItem = "NetUIListViewItem",
	UIAClass_NetUIGalleryButton = "NetUIGalleryButton"
	
	
void function AutoStartEvent()
lyncVersion = getProgramVersion (GetAppFilePath ())
InitLync()
delay (5, TRUE)
AddMainUIALyncEventHandler ("lync.exe")
EndFunction

void function AutoFinishEvent()
gUIA_Lync = Null()
gUIA_LyncTreeWalker = Null()
gUIA_Lync_FocusElement = Null()
priorHistoryItemLinkName = cscNull
EndFunction

void function InitLync()
if gUIA_Lync return endIf
gUIA_Lync = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !gUIA_Lync return endIf
if !ComAttachEvents(gUIA_Lync,UIA_Lync_EventFunctionNamePrefix)
	gUIA_Lync = Null()
	return
endIf
if !gUIA_Lync.AddFocusChangedEventHandler()
	gUIA_Lync = Null()
	return
endIf
var object focusElement = gUIA_Lync.GetFocusedElement().BuildUpdatedCache()
if !focusElement
	gUIA_Lync = Null()
	return
endIf
var object processCondition = gUIA_Lync.CreateIntPropertyCondition(UIA_ProcessIdPropertyId,focusElement.ProcessID)
if !processCondition
	gUIA_Lync = Null()
	return
endIf
gUIA_LyncTreeWalker = gUIA_Lync.CreateTreeWalker(processCondition)
if !gUIA_LyncTreeWalker
	gUIA_Lync = Null()
	return
endIf
gUIA_LyncTreeWalker.currentElement = FocusElement
SetCurrentElementToDeepestFocusElement(gUIA_Lync,gUIA_LyncTreeWalker)
gUIA_Lync_FocusElement = gUIA_LyncTreeWalker.currentElement
EndFunction

void function addTextSelectedTextChangeToChatHistory ()
if ! gUIA_Lync_FocusElement return endIf
if lyncVersion <= 15 return endIf
if gUIA_Lync_FocusElement.controlType != UIA_ListItemControlTypeID then
	priorHistoryItemLinkName = cscNull
	return
endIf
var object parent = CreateUIAParentOfElement (gUIA_Lync_FocusElement)
if ! parent then
	priorHistoryItemLinkName = cscNull
	return
endIf
if parent.controlType != UIA_PaneControlTypeID then
	priorHistoryItemLinkName = cscNull
	return
endIf
if parent.className != "NetUIVirtualListView"then
	priorHistoryItemLinkName = cscNull
	return
endIf
gUIA_Lync.AddAutomationEventHandler(UIA_Text_TextSelectionChangedEventId,parent,treeScope_Subtree)
endFunction

void function readFocusedLinkInHistory (object element)
if element.className != "netUIRicherLabel" return endIf
if ! element.IsPeripheral return endIf
if element.liveSetting < 2 return endIf
var object pattern = element.GetTextPattern()
if ! pattern return endIf
var object textRange = pattern.DocumentRange()
if ! textRange return endIf
var object textChildren = textRange.GetChildren
if ! textChildren return endIf
var object link = textChildren(0)
if ! link return endIf
if link.controlType != UIA_HyperlinkControlTypeID return endIf
if link.name != priorHistoryItemLinkName then
	indicateControlType (WT_LINK, link.name)
	priorHistoryItemLinkName = link.name
	BrailleRefresh ()
endIf
endFunction

void function LyncAutomationEvent(object element, int eventID)
if eventID == UIA_Text_TextSelectionChangedEventId
	return readFocusedLinkInHistory (element)
;elIf eventID == somethingElse
endIf
endFunction

void function LyncFocusChangedEvent(object element)
gUIA_Lync_FocusElement = element
priorHistoryItemLinkName = cscNull
addTextSelectedTextChangeToChatHistory ()
EndFunction

int function IsNetUIListViewItem()
return !userBufferIsActive()
	&& gUIA_Lync_FocusElement.className == UIAClass_NetUIListViewItem
EndFunction

int function IsNetUIGalleryButton()
return !userBufferIsActive()
	&& gUIA_Lync_FocusElement.className == UIAClass_NetUIGalleryButton
EndFunction

int function FocusElementHasSelectItemState()
if !gUIA_Lync_FocusElement return false endIf
var object pattern = gUIA_Lync_FocusElement.GetSelectionItemPattern()
if !pattern return false endIf
return pattern.isSelected == UIATrue
EndFunction

int function NameExistsAtLevel1(string text)
if !text return false endIf
if !gUIA_Lync_FocusElement return false endIf
var object condition = gUIA_Lync.CreateAndCondition(
	gUIA_Lync.CreateStringPropertyCondition(UIA_NamePropertyId,text),
	gUIA_Lync.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_TextControlTypeId))
gUIA_LyncTreeWalker.currentElement = gUIA_Lync_FocusElement
if !gUIA_LyncTreeWalker.gotoParent() return false endIf
if !gUIA_LyncTreeWalker.gotoParent() return false endIf
var object found = gUIA_LyncTreeWalker.currentElement.findFirst(TreeScope_Children,condition)
return !!found
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	int nType = GetObjectSubtypeCode(false,nLevel),
	string name = GetObjectName(false,nLevel),
	string value = GetObjectValue(false,nLevel)
if nLevel > 0
&& (!nType || nType == wt_dialog_page)
&& (value && value == GetObjectValue())
	;The value of the level 0 object may be irrelevantly pulled in as the value for higher level objects.
	;Allow the name to be spoken, but not the duplicated value.
	if name && name !=value
		Say(name,ot_dialog_text)
	endIf
	return
elif nLevel == 2
&& !nType
&& NameExistsAtLevel1(name)
	;At this level, the internal logic for GetObjectName is sometimes pulling in text related to a different object:
	return
elif nLevel == 1
	if !nType
	&& name == GetObjectName()
		;Do not duplicate the name announcement of the focus element:
		return
	elif nType == wt_button
	&& IsNetUIListViewItem()
		;do not speak the parent button for the list item:
		return
	endIf
elif nLevel == 0
	if IsNetUIListViewItem()
		;do not speak position in group, since it is always 1 of 1:
		Say(GetObjectname(),ot_line)
		return
	elif IsNetUIGalleryButton()
		;These are list items, which serve as tabs.
		;Speak the type as tab
		;and do not speak position in group, since it is always 1 of 1:
		IndicateControlType(wt_TabControl,GetObjectname(),cmsgSilent)
		if FocusElementHasSelectItemState()
			IndicateControlState(wt_tabControl,CTRL_SELECTED)
		endIf
		return
	endIf	
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

int function BrailleCallbackObjectIdentify()
if !IsTouchCursor()
	if IsNetUIGalleryButton()
		;These are list items,
		;but we want to present them as tab controls:
		return wt_tabControl
	elIf priorHistoryItemLinkName then
		return WT_LINK
	endIf
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectName(int nSubtype)
if nSubtype == wt_TabControl
	if IsNetUIGalleryButton()
		var int isSelected = FocusElementHasSelectItemState()
		if isSelected
			isSelected = ATTRIB_HIGHLIGHT
		endIf
		BrailleAddString(GetObjectName(),GetCursorCol(),GetCursorRow(),isSelected)
		return true
	endIf	
elIf nSubtype == WT_LINK
&& ! stringIsBlank (priorHistoryItemLinkName)
	BrailleAddString (priorHistoryItemLinkName, getCursorCol (), getCursorRow (), 0)
	return TRUE
endIf
return BrailleAddObjectName(nSubtype)
EndFunction

int function BrailleAddObjectValue(int nSubtype)
if nSubtype == wt_static
	var string name = GetObjectName(true)
	if name && !GetObjectValue()
		BrailleAddString(name,0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectValue(nSubtype)
EndFunction

int function BrailleAddObjectPosition(int nSubtype)
if nSubtype == wt_ListBoxItem
	if IsNetUIListViewItem()
	|| nSubtype == wt_TabControl
		;do not add position in group, since it is always 1 of 1:
		return true
	endIf
endIf
return BrailleAddObjectPosition(nSubtype)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgLyncAppName)
EndScript

script SayLine()
if IsPCCursor()
	if IsNetUIListViewItem()
	|| IsNetUIGalleryButton()
		SayObjectTypeAndText()
		return
	endIf	
endIf
PerformScript SayLine()
EndScript

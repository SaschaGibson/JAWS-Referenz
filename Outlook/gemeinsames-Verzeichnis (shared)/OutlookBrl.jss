; Copyright 1995-2023 Freedom Scientific, Inc.
; Script file  for braille support for Microsoft Outlook 2016 and O365

include "HjConst.jsh"
include "HjGlobal.jsh"
include "MSAAConst.jsh"
include "UIA.jsh"
include "Outlook.jsh"
include "Common.jsm"
include "Outlook.jsm"

import "uia.jsd"
import "outlook.jsd"


globals
	collection c_OutlookBrl
	; Members are:
	; string WinClass -- From GetWindowClass of focus.
	; int WinSubtype -- From GetWindowSubtypeCode of focus.
	;string objClass -- From GetObjectClassName.
	; int ObjSubtype -- From getObjectSubtypeCode.
	; int ControlID -- From GetControlID of focus.
	; string RealName -- from GetWindowName of real window.

void function AutoStartEvent()
if !c_OutlookBrl
	c_OutlookBrl = new collection
endIf
EndFunction

void function AutoFinishEvent()
CollectionRemoveAll(c_OutlookBrl)
EndFunction

void function UpdateOutlookBrl(handle hWnd)
CollectionRemoveAll(c_OutlookBrl)
c_OutlookBrl.WinClass = GetWindowClass(hWnd)
c_OutlookBrl.WinSubType = GetWindowSubTypeCode(hWnd)
c_OutlookBrl.objClass = GetObjectClassName()
c_OutlookBrl.ObjSubtype = getObjectSubtypeCode()
c_OutlookBrl.ControlID	= GetControlID(hWnd)
c_OutlookBrl.RealName = GetWindowName(GetRealWindow(hWnd))
EndFunction

int function BrailleCallbackObjectIdentify()
if IsTouchCursor()
	return GetTouchNavElementBrlSubtype()
elIf gbWordIsWindowOwner
	return BrailleCallbackObjectIdentify()
EndIf
var	handle hWnd = GetFocus()
UpdateOutlookBrl(hWnd)
if c_OutlookBrl.WinClass == cwc_RichEdit20WPT
	if c_OutlookBrl.WinSubtype == WT_MULTILINE_EDIT
		c_OutlookBrl.WinSubtype = WT_EDIT
		return WT_EDIT
	elif c_OutlookBrl.WinSubtype != WT_UNKNOWN
		; Occasionally JAWS returns WT_DOCUMENT since the from field returns WT_DOCUMENT from the object subtype.
		; return subtype from window instead:
		return c_OutlookBrl.WinSubtype
	endIf
elif c_OutlookBrl.WinClass == wc_OutlookGrid
&& c_OutlookBrl.ControlID == id_GridView
	Return WT_CUSTOM_CONTROL_BASE + WT_WT_MESSAGES_LIST
elif c_OutlookBrl.WinClass == wc_Rctrl_RenWnd32 
&& c_OutlookBrl.ControlID != id_InfoBar
	;address card views:
	Return wt_Custom_Control_Base + WT_WT_CARDVIEW
elif c_OutlookBrl.WinClass == wc_ATL00007FFA8E48E360
	;The calendar grid, when creating a meeting, in the Room Finder pane:
	return wt_Custom_Control_Base + WT_WT_FindRoomPaneCalendarGrid
elif c_OutlookBrl.ObjClass == wc_NetUIOcxControl
	;The button showing the selection in the calendar grid, when creating a meeting, in the Room Finder pane:
	return wt_button
ElIf InCalendar()
	Return wt_Custom_Control_Base+wt_wt_CalendarGrid
elif OnNetUIGalleryButton()
	return wt_button
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int Function BrailleAddObjectDlgText(int iType)
if gbWordIsWindowOwner
	return word::BrailleAddObjectDlgText (iType)
EndIf
If iType != WT_DIALOG
	Return BrailleAddObjectDlgText (iType)
EndIf
;Tool bar buttons in dialogs need to directly show the button,
;example Signatures dialog from within Tools -> Options
if c_OutlookBrl.WinSubType == WT_TOOLBAR
&& c_OutlookBrl.WinClass == cwcMsoCmd
	return TRUE
endIf
If DialogActive()
&& GetWindowSubtypeCode(GetParent (GetFocus ())) == WT_DIALOG
	var string sText = GetDialogStaticText()
	If !StringIsBlank(sText)
		BrailleAddString (sText,0,0,0)
		Return True
	EndIf
EndIf
Return BrailleAddObjectDlgText (iType)
EndFunction

int function BrailleAddObjectDlgPageName(int iType)
if gbWordIsWindowOwner
	return word::BrailleAddObjectDlgText (iType)
EndIf
if c_OutlookBrl.WinSubType == WT_TOOLBAR
&& c_OutlookBrl.WinClass == cwcMsoCmd
	return TRUE;
endIf
return BrailleAddObjectDlgPageName (iType)
endFunction

int Function BrailleAddObjectType(int type)
if IsTouchCursor()
	Return BrailleAddObjectType (type)
EndIf
if (IsVirtualRibbonActive())
	return FALSE;Internals should handle it
endIf
if gbWordIsWindowOwner
	return word::BrailleAddObjectType (type)
EndIf
If type == WT_CUSTOM_CONTROL_BASE+WT_WT_MESSAGES_LIST
|| type == wt_Custom_Control_Base+WT_WT_CARDVIEW
|| type == WT_LISTBOX
	BrailleAddString (BrailleGetSubtypeString(type),
		GetCursorCol(), GetCursorRow(), GetCharacterAttributes())
	Return TRUE
endIf
Return BrailleAddObjectType(type)
EndFunction

int function BrailleAddObjectName(int Type)
if IsTouchCursor()
	Return BrailleAddObjectName(Type)
elif IsVirtualRibbonActive()
	return default::BrailleAddObjectName(type)
endIf
;When the menu is active and autocomplete is visible we may be editing a message,
;so this block must preceed the generic default to Word:
if type == WT_MENU 
&& IsSecondaryFocusVisible()
	BrailleAddString(GetSecondaryFocusSelectionText(),0,0,attrib_highlight)
	return true
endIf
;needed for autocomplete in Outlook 2019
if type == WT_MENU 
&& IsAutoCompleteListVisible()
	BrailleAddString(AutoCompleteListItemText(),0,0,attrib_highlight)
	return true
endIf
if gbWordIsWindowOwner
	return word::BrailleAddObjectName(Type)
EndIf
if type == wt_button
	if c_OutlookBrl.ObjClass == wc_NetUIOcxControl
		var string name = GetRoomFinderCalendarButtonName()
		if name
			BrailleAddString(name,GetCursorCol(),GetCursorRow(),0)
			return true
		endIf
	elif OnNetUIGalleryButton()
		var string text = GetObjectHelp()
		if text
			var string color = ConvertNetUIGalleryButtonTextToColorName(Text)
			if color
				text = color
			endIf
			var int attrib
			if GetObjectStateCode() & STATE_SYSTEM_DEFAULT
				;This is the selected button:
				attrib = attrib_highlight
			endIf
			BrailleAddString(text,GetCursorCol(),GetCursorRow(),attrib)
			return true
		endIf
	endIf
elif type == wt_ReadOnlyEdit
	if InMessageHeaderReadOnlyMultilineEdit()
		BrailleAddString(GetUIALabelFromPriorElement(),0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectName(Type)
EndFunction

int function BrailleAddObjectValue(int Type)
if IsTouchCursor()
	Return BrailleAddObjectValue(type)
elif IsVirtualRibbonActive()
	return FALSE
elif gbWordIsWindowOwner
	return word::BrailleAddObjectValue(type)
EndIf
if type == WT_CUSTOM_CONTROL_BASE+WT_WT_MESSAGES_LIST
	var int nAttribBits
	if GetObjectStateCode (TRUE) == STATE_SYSTEM_DEFAULT
		;0 = no item selected, 0x100 = STATE_SYSTEM_DEFAULT, instead of normal selection.
		nAttribBits = ATTRIB_HIGHLIGHT
	endIf
	var string line = GetMessageListItemBrlLineText()
	BrailleAddString(line, getCursorCol(),getCursorRow(),nAttribBits)
	return true
elif type == wt_TreeViewItem
	if DialogActive()
	&& !inHjDialog()
	&& c_OutlookBrl.objClass == cwc_SysTreeView32
		;For GoTo Folder, Copy to Folder, and Move to Folder dialogs,
		;the object value gives the name plus the text of open or closed.
		;The object name gives the data we want without the status of open or closed,
		;but only if MSAA mode is set to 2.
		var int MSAAMode = GetJCFOption (opt_MSAA_mode)
		SetJCFOption (opt_MSAA_mode, 2)
		BrailleAddString(GetObjectName(),GetCursorCol(),GetCursorRow(),GetCharacterAttributes())
		SetJCFOption (opt_MSAA_mode, MSAAMode)
		return true
	elif c_OutlookBrl.objClass == wc_NetUIWBTreeDisplayNode
		;The internal code gets the tree item name, which is the correct behavior:
		return false
	endIf
elif type == wt_EditCombo
&& c_OutlookBrl.WinClass == wc_REComboBox20W
	BrailleAddString(GetObjectValue(SOURCE_CACHED_DATA),GetCursorCol(),GetCursorRow(),GetCharacterAttributes())
	return true
endIf
if c_OutlookBrl.ObjSubtype == WT_EDIT
&& GetObjectAutomationId () == "SearchTextBox"
	return false
endIf
return BrailleAddObjectValue(Type)
EndFunction

int function BrailleAddObjectDescription(int Type)
if IsTouchCursor()
	Return BrailleAddObjectDescription(Type)
elif IsVirtualRibbonActive()
	return FALSE
endIf
if gbWordIsWindowOwner
	return BrailleAddObjectDescription(Type);debug
EndIf
if type == WT_CUSTOM_CONTROL_BASE+WT_WT_MESSAGES_LIST
	return true
endIf
return BrailleAddObjectDescription(Type)
EndFunction

int function GetTreeViewItemExpandCollapseStateFromUIA ()
var
	object oFocus = FSUIAGetFocusedElement (),
	object oPattern = oFocus.GetExpandCollapsePattern(),
	int iExpandCollapseState
if !oPattern return endIf
iExpandCollapseState = oPattern.ExpandCollapseState
if iExpandCollapseState == ExpandCollapseState_Expanded
	return CTRL_EXPANDED
elIf iExpandCollapseState == ExpandCollapseState_Collapsed
|| iExpandCollapseState == ExpandCollapseState_PartiallyExpanded
	return CTRL_COLLAPSED
else
	return Null()
endIf
endFunction

int function BrailleAddObjectState (int type)
if type == WT_CUSTOM_CONTROL_BASE+WT_WT_MESSAGES_LIST
&& GetObjectSubTypeCode () == WT_TreeViewItem
	var int iState = GetTreeViewItemExpandCollapseStateFromUIA ()
	if !iState return BrailleAddObjectState (type) endIf
	BrailleAddString(BrailleGetStateString(iState), 0, 0, 0)
	return true
endIf
if type == WT_TREEVIEW
|| type == WT_TREEVIEWITEM
	if inCalendarTreeView ()
		BrailleAddString(BrailleGetStateString(GetTreeViewItemCheckStateFromUIA (GetFocusedTreeItemFromUIA())), 0,0,0)
		var int StateBits = getControlAttributes()&~CTRL_SELECTED
		if stateBits
		; to make Braille pick up the collapsed state properly:
			if stateBits & CTRL_CLOSED then stateBits = stateBits| CTRL_COLLAPSED endIf
			BrailleAddString (BrailleGetStateString (stateBits), 0,0,0)
		endIf
		return TRUE
	endIf
endIf
return BrailleAddObjectState (type)
endFunction

int function BrailleAddObjectContainerName(int Type)
if IsTouchCursor()
	Return BrailleAddObjectContainerName(Type)
elif IsVirtualRibbonActive()
	return FALSE
elif gbWordIsWindowOwner
	return word::BrailleAddObjectContainerName(Type)
elIf inRibbons()
	return true
EndIf
if InContactsList()
	return true
endIf
return BrailleAddObjectContainerName(Type)
EndFunction

int function BrailleAddObjectContainerType(int Type)
if IsTouchCursor()
	Return BrailleAddObjectContainerType(Type)
elif IsVirtualRibbonActive()
	return FALSE
elif gbWordIsWindowOwner
	return word::BrailleAddObjectContainerType(Type)
EndIf
if InContactsList()
	return true
endIf
return BrailleAddObjectContainerType(Type)
EndFunction

int function BrailleAddObjectPosition (int type)
if IsTouchCursor()
	Return BrailleAddObjectPosition (type)
endIf
if type == wt_edit
&& IsSecondaryFocusVisible()
	var string positionInGroup = PositionInGroupForSecondaryFocus()
	if positioninGroup
		BrailleAddString(positioninGroup,0,0,0)
	endIf
	return true
elif type == WT_CUSTOM_CONTROL_BASE + WT_WT_MESSAGES_LIST 
	BrailleAddString(PositionInGroup(),0,0,0)
	return true
endIf
return BrailleAddObjectPosition (type)
EndFunction

int function BrailleAddObjectLevel(int type)
if IsTouchCursor()
	return BrailleAddObjectLevel(type)
elif (IsVirtualRibbonActive())
	return FALSE
elif gbWordIsWindowOwner
	return BrailleAddObjectLevel(type)
EndIf
if type == wt_TreeViewItem
&& InNavigationPane ()
	var object element = GetFocusedTreeItemFromUIA()
	var int level = UIAGetNavigationPaneTreeviewLevel(element)
	BrailleAddString(IntToString(level),0,0,0)
	return true
endIf
return BrailleAddObjectLevel(type)
EndFunction

Int Function BrailleAddObjectAddressAutoComplete (int type)
if type == wt_edit
	if IsSecondaryFocusVisible()
		BrailleAddString(GetSecondaryFocusSelectionText(),0,0,0)
	elIf IsAutoCompleteListVisible()
		BrailleAddString(AutoCompleteListItemText(),0,0,0)
	endIf
endIf
return true
EndFunction

int Function BrailleAddObjectFldName(int nType)
if gbWordIsWindowOwner
	return word::BrailleAddObjectFldName(nType)
EndIf
return false
EndFunction

int Function BrailleAddObjectFldType(int nType)
if gbWordIsWindowOwner
	return word::BrailleAddObjectFldType(nType)
EndIf
return false
EndFunction

int Function BrailleAddObjectFldValue(int nType)
if gbWordIsWindowOwner
	return word::BrailleAddObjectFldValue(nType)
EndIf
return false
EndFunction

int Function BrailleAddObjectFolderName (int nSubTypeCode)
BrailleAddString(getWindowName (getFocus()),0,0,0)
Return TRUE
EndFunction

Int Function BrailleAddObjectCrdName (int nType)
BrailleAddString(GetContactsListItemText(),0,0,0)
return true
EndFunction

int Function BrailleAddObjectCalendarView (int nSubTypeCode)
BrailleAddString(GetCalendarViewBrlText(),FALSE,FALSE,FALSE)
return TRUE
EndFunction

int function BrailleAddObjectCalendarTimeSlot (int type)
BrailleAddString(GetCalendarTimeSlotText(), 0,0,0)
return true
endFunction

int function BrailleAddObjectFocusLine(int type)
BrailleAddFocusLine()
return true
endFunction

int function ContractedBrailleInputAllowedNow()
if c_OutlookBrl.WinClass != cwc_RichEdit20WPT
&& c_OutlookBrl.WinClass != wc_ReComboBox20W
	return ContractedBrailleInputAllowedNow()
endIf
if c_OutlookBrl.WinClass == wc_ReComboBox20W
	return FALSE
endIf
if c_OutlookBrl.ControlID != id_app_subject 
&& c_OutlookBrl.ControlID != id_subject_field
	return FALSE
endIf
if c_OutlookBrl.ControlID == id_app_subject
&& CurrentFormContainsTimeField (GetFocus())
	; meeting and appointment subject should allow contracted input:
	return TRUE
endIf
return ContractedBrailleInputAllowedNow()
endFunction

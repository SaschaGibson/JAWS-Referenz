; Copyright 2019, Freedom Scientific, Inc.
;
; JAWS Script File used by the OneNote Trusted Windows Store App.

include "HJConst.jsh"
include "HJGlobal.jsh"
include "MSAAConst.jsh"

include "common.jsm"

include "Microsoft.Office.OneNote.jsm"

const
	customizeForDocument = 1,
	customizeForItemStatus = 2


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Utility Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

String Function GetTypeStringFromTypeCode(int typeCode)
; Returns the spoken type corresponding to the given typeCode.
; The return value should be identical to what GetWindowType and getObjectType/Subtype would return.
return smmStripMarkup(smmGetStartMarkupForControlType(typeCode))
EndFunction

Int Function ShouldCustomizeSpeakingOfFocusedObject(
	handle window, int nLevel)
var string windowClass = GetWindowClass(window)
var int objectRole = GetObjectRole(nLevel)
if (windowClass == cwc_Windows_UI_Core_CoreWindow && objectRole == ROLE_SYSTEM_DOCUMENT)
	return customizeForDocument
endIf
var string itemStatus = GetObjectItemStatus(nLevel)
if (!StringIsBlank(itemStatus))
	return customizeForItemStatus
endIf
return false
EndFunction

Int Function CustomSayObjectTypeAndText(handle window, int nLevel, int includeContainerName)
var
	int customizeBehavior = ShouldCustomizeSpeakingOfFocusedObject(window, nLevel),
	string objectName = cscNull,
	string objectType = cscNull,
	string objectState = cscNull,
	string objectItemStatus = cscNull,
	string objectValue = cscNull
if (customizeBehavior)
	objectName = GetObjectName(SOURCE_CACHED_DATA, nLevel)
	objectState = GetObjectState(true, nLevel)
	if (customizeBehavior == customizeForDocument)
		objectType = GetTypeStringFromTypeCode(WT_EDIT)
	elif (customizeBehavior == customizeForItemStatus)
		objectType = GetTypeStringFromTypeCode(GetObjectSubTypeCode(SOURCE_CACHED_DATA, nLevel))
		objectItemStatus = GetObjectItemStatus(nLevel)
		objectState = objectState + cscSpace + objectItemStatus
		objectValue = GetObjectValue(SOURCE_CACHED_DATA, nLevel)
	endif
	SayControlEx(
		window, objectName, objectType, objectState,
		cscNull, cscNull, objectValue)
	return true
endIf
;; If the behavior was customized above we will not reach this point. If we do reach this point
;; we need to call the SayObjectTypeAndText function here to use the default behavior.
SayObjectTypeAndText(nLevel, includeContainerName)
return false
EndFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Event Helper Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

Void Function FocusChangedEventProcessAncestors(handle FocusWindow, handle PrevWindow)
var
	int nLevel = 0,
	int iType = 0
nLevel = SetDepthForFocusChangedEventProcessAncestors(FocusWindow, PrevWindow)
while (nLevel >= 0)
	iType = GetObjectSubtypecode(SOURCE_CACHED_DATA, nLevel)
	if (nLevel > 0)
		if (nLevel == 1 && iType == WT_TABLECELL)
			if (globalSpeakHeaderOnCellChange == TABLE_NAV_HORIZONTAL)
				Say(GetColumnHeader(TRUE), OT_SCREEN_MESSAGE)
			elif (globalSpeakHeaderOnCellChange == TABLE_NAV_VERTICAL)
				Say(GetRowHeader(TRUE), OT_SCREEN_MESSAGE)
			EndIf
		EndIf
		if (!IgnoreObjectAtLevel(nLevel))
			CustomSayObjectTypeAndText(FocusWindow, nLevel, false)
		endIf
	else ;at level 0:
		if (
			iType == wt_groupbox
			&& GetObjectSubTypeCode(SOURCE_CACHED_DATA, nLevel + 1) == wt_listview
			)
			SayControlEx(0, GetObjectName(SOURCE_CACHED_DATA), cmsgGrouping);
		else
			CustomSayObjectTypeAndText(FocusWindow, nLevel, false)
		endIf
	EndIf
	nLevel = nLevel - 1
EndWhile
EndFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Script Helper Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

Int Function SelectALinkDialog()
If (UserBufferIsActive())
	default::SelectALinkDialog() ; default behaviors in userBuffer.
	return true
EndIf
If (InHJDialog())
	SayFormattedMessage(OT_error, cMSG337_L, cMSG337_S)
	return true
EndIf
var string sActiveCursorName = GetActiveCursorName()
If (
	!(DialogActive() || GetMenuMode())
	&& sActiveCursorName == "FSDom Edit2 cursor"
	)
	If (!dlgListOfLinks())
		ReportLinksNotAvailable(NotAvailableReason_NotFound)
	EndIf
	return true
EndIf
return false
EndFunction

void function UIANotificationEvent(int notificationKind, int notificationProcessing, string displayString, string activityId, string appName)
var collection notificationRuleActions = ProcessNotification(displayString, appName)
SayNotification (notificationRuleActions, OT_TOASTS)
if !notificationRuleActions.EscludeFromNotificationHistory then
	StoreSpokenNotificationForRepeat(displayString, appName)
endIf
endFunction

int function SelectAHeadingDialog()
if (!dlgListOfHeadings())
	ReportHeadingsNotAvailable(NotAvailableReason_NotFound)
EndIf
return true
EndFunction

void function SayTreeViewItem()
var
	handle focusWindow = getFocus(),
	int bIsMSAAWindow = IsMSAAWindow(focusWindow),
	int nSubtype = GetObjectSubtypeCode(),
	int nState = 0,
	string value = cscNull,
	string itemStatus = cscNull
if (
	!InHjDialog() && bIsMSAAWindow 
	&& nSubtype == WT_TREEVIEWITEM
	)
	value = GetObjectName()
	if (StringIsBlank(value))
		value  = tvGetFocusItemText(focusWindow)
	EndIf
	itemStatus = GetObjectItemStatus()
	SayMessage(OT_LINE, value)
	SayMessage(OT_LINE, itemStatus)
	nState = GetTreeViewItemState()
	if (nState)
		IndicateControlState(nSubtype, nState)
	endIf
	return
endIf
; Fallback to the default behavior
SayTreeViewItem()
EndFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Braille Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

Int Function BrailleAddObjectState(Int nSubType)
var
	handle focusWindow = getFocus(),
	int bIsMSAAWindow = IsMSAAWindow(focusWindow),
	string value = cscNull,
	string objectState = GetObjectState(true, 0),
	string objectItemStatus = GetObjectItemStatus(0),
	string brailleString = cscNull
if (bIsMSAAWindow && !StringIsBlank(objectItemStatus))
	if (!StringIsBlank(objectState))
		brailleString = objectState + cscSpace
	endIf
	brailleString = brailleString + objectItemStatus
	BrailleAddString(brailleString, 0, 0, ATTRIB_HIGHLIGHT)
	return true
endIf
BrailleAddObjectState(nSubtype)
EndFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Scripts
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

script ScriptFileName()
ScriptAndAppNames(OneNoteUniversalAppName)
endScript

Script SayWindowPromptAndText()
var handle window = GetFocus()
if (ShouldCustomizeSpeakingOfFocusedObject(window, 0))
	CustomSayObjectTypeAndText(window, 0, false)
	return
endIf
;; If the behavior was customized above we will not reach this point. If we do reach this point
;; we need to call the default SayWindowPromptAndText script here to use the default behavior.
PerformScript SayWindowPromptAndText()
endScript

Script SayLine()
PerformScript SayLine()
var string itemStatus = GetObjectItemStatus(0)
if (!StringIsBlank(itemStatus))
	Say(itemStatus, OT_LINE)
endif
endScript

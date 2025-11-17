; Copyright 2017-2018 by Freedom Scientific, Inc.
; Freedom Scientific script file for Microsoft Edge

import "UIA.jsd"
import "Virtual.jsd"
import "say.jsd"

Include "HjGlobal.jsh" ; default HJ global variables
Include "hjconst.jsh" ; default HJ constants
include "UIA.jsh"
include "hjHelp.jsh"
Include "common.jsm" ; message file
include "MicrosoftEdge.jsm"
include "ie.jsm"

use "AceHelpers.jsb"

globals
	int lastTableEnteredRowCount,
	int lastTableEnteredColCount,
	int EdgeShouldNotSpeakFocusChange

;For supporting quick navigation:
globals
	collection c_ControlTypes
		; Members are the subtypeCodes, and their value is the UIA controltype to use for the condition to search for the type.

;For script UIA processing:
const
	Notification_LoadingPageBeginsActivityId = "LoadingPageBeginsActivityId",
	oID_NotificationToolBar = "NotificationBarRootNode",
	MicrosoftEdgeEventNamePrefix = "MicrosoftEdge"
globals
	object oEdgeFSUIA,
	object oEdgeTreeWalker,
	object oAppNode

;for scheduling notification bar help message:
const
	SpeakNotificationShortcutHelp_delay = 20
globals
	int inMetroApp,
	int ScheduleID_SpeakNotificationShortcutHelp

;For the notification announcements:
const
	RedundantNotificationThreshold = 2000  ;milliseconds for detecting redundant notifications
globals
	collection c_notification
		; Members are:
		; string Text -- Text of the most recent notification
		; int Ticks -- Tick count for when the most recent notification occurred.


int function ShouldProcessLiveRegion(string text, string attribs)
if inMetroApp then
; the only place we want to allow the LiveRegionEvent to automatically speak:
	return TRUE
endIf
;return ShouldProcessLiveRegion(text, attribs) 
; generally don't process liveRegionEvent speech in Edge:
endFunction

void function AutoStartEvent()
inMetroApp = IsMetroApp ()
MapSubtypeCodeToUIAControlTypeID()
lastTableEnteredRowCount = 0
lastTableEnteredColCount = 0
c_notification = new collection
InitEdgeFSUIA()
;These scripts will load when focus moves to a web page in the Feedback Hub,
;although the current application is still the Feedback Hub.
;Under this condition, we announce to the user that they are entering a web page,
;so that the user is aware that they may now interact with the web page.
;Note that the WindowsFeedbackHub scripts handles announcement of leaving the web page.
if GetMetroAppName() == msgWindowsFeedbackHubAppName
	Say(msgEnteringWebPage,OT_CONTROL_TYPE)
endIf
EndFunction

void function AutoFinishEvent()
oEdgeFSUIA = Null()
oAppNode = Null()
CollectionRemoveAll(c_notification)
c_notification = Null()
EndFunction

void function ConfigurationChangedEvent(string newConfiguration)
inMetroApp = IsMetroApp ()
endFunction

object function GetTopLevelAppNode()
if !oEdgeFSUIA return Null() endIf
;Do not use processID to get the top level app element, since the top level window for Microsoft Edge does not have the same processID as the focus elements.
;AppMainWindow and TopLevelWindow may not provide the window handle for the top element belonging to MicrosoftEdge.
;It appears that we can use ForegroundWindow and get the element from it.
var handle hWnd = GetForegroundWindow()
var object element = oEdgeFSUIA.GetElementFromHandle(hWnd)
return element
EndFunction

void function InitEdgeFSUIA()
if (!oEdgeFSUIA) oEdgeFSUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" ) endIf
if !oEdgeFSUIA return endIf
oEdgeTreewalker = oEdgeFSUIA.CreateTreeWalker(oEdgeFSUIA.CreateRawViewCondition())
if !oEdgeTreeWalker return endIf
oAppNode = GetTopLevelAppNode()
if !oAppNode return endIf
ComAttachEvents(oEdgeFSUIA,MicrosoftEdgeEventNamePrefix)
oEdgeFSUIA.AddAutomationEventHandler(UIA_LiveRegionChangedEventId, oAppNode, treeScope_subtree)
oEdgeFSUIA.AddNotificationEventHandler(oAppNode, treeScope_subtree)
EndFunction

void function MicrosoftEdgeNotificationEvent(object element, int notificationKind,
	int notificationProcessing,string displayString,string activityId)
if activityId == Notification_LoadingPageBeginsActivityId
	;we're opting to not notify the user that the page is loading:
	return
endIf
Say(displayString,ot_JAWS_message)
EndFunction

void function MicrosoftEdgeAutomationEvent(object element, int eventID)
if eventID == UIA_LiveRegionChangedEventId
	oEdgeTreewalker.currentElement = element
	oEdgeTreewalker.gotoParent()
	if (oEdgeTreeWalker.currentElement.automationID != oID_NotificationToolBar) return endIf
	var int ticks = GetTickCount()
	if ticks-c_notification.ticks <= RedundantNotificationThreshold
	&& c_notification.text == element.name
		c_notification.Ticks = ticks
		return
	endIf
	if (ScheduleID_SpeakNotificationShortcutHelp) UnscheduleFunction(ScheduleID_SpeakNotificationShortcutHelp) endIf
	var int queueRank
	if element.liveSetting == Assertive
		queueRank = Assertive
	else
		queueRank = 3
	endIf
	QueueSpeech(element.name,ot_JAWS_message,queueRank)
	c_notification.text = element.name
	c_notification.Ticks = ticks
	ScheduleID_SpeakNotificationShortcutHelp = ScheduleFunction("SpeakNotificationShortcutHelp",SpeakNotificationShortcutHelp_delay)
endIf
EndFunction

void function SpeakNotificationShortcutHelp()
ScheduleID_SpeakNotificationShortcutHelp = 0
Say(msgNotificationBarHelp,ot_help)
EndFunction

script SpeakCurrentNotificationBarText()
if !oEdgeFSUIA
	say(msgSpeakCurrentNotificationBarText_error,ot_error)
	return
endIf
if !oEdgeTreeWalker
	oEdgeTreewalker = oEdgeFSUIA.CreateTreeWalker(oEdgeFSUIA.CreateRawViewCondition())
endIf
if !oAppNode 
	oAppNode = GetTopLevelAppNode()
endIf
var object condition = oEdgeFSUIA.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,oID_NotificationToolBar)
if !condition
	say(msgSpeakCurrentNotificationBarText_error,ot_error)
	return
endIf
var object oNotificationBar = oAppNode.findFirst(treeScope_subtree,condition)
if !oNotificationBar
	Say(msgSpeakCurrentNotificationBarText_NoneFound,ot_JAWS_message)
	return
endIf
condition = oEdgeFSUIA.CreateOrCondition(
		oEdgeFSUIA.CreateIntPropertyCondition(UIA_LiveSettingPropertyId,Assertive),
		oEdgeFSUIA.CreateIntPropertyCondition(UIA_LiveSettingPropertyId,Polite))
var object notifications = oNotificationBar.findAll(treescope_children,condition)
if notifications.count < 1
	Say(msgSpeakCurrentNotificationBarText_NoneFound,ot_JAWS_message)
	return
endIf
var object o
forEach o in notifications
	Say(o.name,ot_JAWS_message)
endForEach
EndScript

void function MapSubtypeCodeToUIAControlTypeID()
if (!c_ControlTypes) c_controlTypes = new collection endIf
c_ControlTypes[IntToString(WT_BUTTON)] = UIA_ButtonControlTypeId
c_ControlTypes[IntToString(WT_CHECKBOX)] = UIA_CheckBoxControlTypeId
c_ControlTypes[IntToString(WT_RADIOBUTTON)] = UIA_RadioButtonControlTypeId
c_ControlTypes[IntToString(WT_EDIT)] = UIA_EditControlTypeId
c_ControlTypes[IntToString(WT_BITMAP)] = UIA_ImageControlTypeId
c_ControlTypes[IntToString(wt_list)] = UIA_ListControlTypeId
c_ControlTypes[IntToString(wt_listItem)] = UIA_ListItemControlTypeId
c_ControlTypes[IntToString(WT_Table)] = UIA_TableControlTypeId
c_ControlTypes[IntToString(wt_comboBox)] = UIA_ComboBoxControlTypeId
EndFunction

int function IsSubtypeMappedToUIA(int subtype)
return c_ControlTypes[IntToString(subtype)] != Null()
endFunction

int function IsQuickNavSupportedForType(int subtype)
return IsSubtypeMappedToUIA(subtype)
EndFunction

int function ConvertTagToControlType( string tag )
if  tag == cscGraphic 
	return WT_BITMAP
ElIf tag == TAG_LIST_ITEM
	return WT_LISTITEM
elif tag == TAG_SELECTABLE_ITEMS_CONTROL
	return wt_comboBox
EndIf
return 0
EndFunction

string function ConvertTypeToControlTypeStringPlural(int type)
if type == wt_ComboBox
	return msgComboControlQuickNavTypes
elif type == wt_Bitmap
	return CVMSGGraphic
endIf
return cscNull
EndFunction

object function GetPageElement(object oUIA)
if !oUIA return Null() endIf
var object treewalker = oUIA.CreateTreeWalker(oUIA.CreateRawViewCondition())
var object element = oUIA.GetFocusedElement().buildUpdatedCache()
var object condition = oUIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId, cwcIEServer)
if (!element || !treewalker || !condition) return Null() endIf
var object found = element.findFirst(treeScope_Subtree,condition)
if found
	treewalker.currentElement = found
	treewalker.gotoFirstChild()
else
	treewalker.currentElement = element
	while (treewalker.currentElement.controlType != UIA_PaneControlTypeId) treewalker.gotoParent() endWhile
endIf
return treewalker.currentElement
EndFunction

int function IsControlFoundOnPage(int subtype)
var int UIAType = c_ControlTypes[IntToString(subtype)]
if !UIAType return false endIf
var object element = GetPageElement(oEdgeFSUIA)
var object condition = oEdgeFSUIA.CreateIntPropertyCondition( UIA_ControlTypePropertyId, UIAType)
if !(element && condition) return false endIf
var object found = element.findFirst(treeScope_Descendants, condition )
;Do not test found against Null, the results are unreliable:
if found
	return true
else
	return false
endIf
endFunction

int function IsFormFieldFoundOnPage()
var object element = GetPageElement(oEdgeFSUIA)
var object condition = oEdgeFSUIA.CreateOrCondition(
		oEdgeFSUIA.CreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_ButtonControlTypeId),
		oEdgeFSUIA.CreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_CheckBoxControlTypeId))
condition = oEdgeFSUIA.CreateOrCondition(condition,oEdgeFSUIA.CreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_RadioButtonControlTypeId))
condition = oEdgeFSUIA.CreateOrCondition(condition,oEdgeFSUIA.CreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_EditControlTypeId))
condition = oEdgeFSUIA.CreateOrCondition(condition,oEdgeFSUIA.CreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_ComboBoxControlTypeId))
if !(element && condition) return false endIf
var object found = element.findFirst(treeScope_Descendants, condition )
;Do not test found against Null, the results are unreliable:
if found
	return true
else
	return false
endIf
EndFunction

int function IsFocusInBrowser()
;First, eliminate the obvious exceptions:
if (UserBufferIsActive() || GetMenuMode()) return false endIf
var object element = oEdgeFSUIA.GetFocusedElement().buildUpdatedCache()
;In case UIA fails, fall back to window class:
if (!element ) return GetWindowClass(GetFocus()) == cwc_Windows_UI_Core_CoreComponentInputSource endIf
;The element retrieved by GetFocusedElement().buildUpdatedCache() may be the custom element which is ancestor to the page,
;and although this was retrieved as the focus element it actually does not have the keyboard focus:
if !element.hasKeyboardFocus
	var object condition = oEdgeFSUIA.CreateBoolPropertyCondition(UIA_HasKeyboardFocusPropertyId, UIATrue)
	element = Element.FindFirst(TreeScope_Descendants, condition ).BuildUpdatedCache()
endIf
return element.frameWorkID == "MicrosoftEdge"
EndFunction

int function DlgListOfLinks( int flags )
var int result = builtin::DlgListOfLinks( flags )
if result == 1095 ; move to link
	EdgeShouldNotSpeakFocusChange = 1;
	ScheduleFunction( "ResetEdgeShouldNotSpeakFocusChange", 10 );
EndIf
return result;
EndFunction
	
int function DlgListOfHeadings()
var int result = builtin::DlgListOfHeadings()
if result == 1095 ; move to heading
	EdgeShouldNotSpeakFocusChange = 1;
	ScheduleFunction( "ResetEdgeShouldNotSpeakFocusChange", 10 );
EndIf
return result;
EndFunction

script SelectAFormField()
if IsManagedVirtualHelpActive() EnsureNoUserBufferActive(false) EndIf
var int iActivatedVCursor
var int RunningProducts = GetRunningFSProducts()
if RunningProducts == product_MAGic
&& GetJCFOption (OPT_VIRTUAL_PC_CURSOR) == 0 then
	; Temporarily enable the virtual cursor so that this dialog
	; can be opened in IE with Speech disabled.
	SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 1)
	iActivatedVCursor = 1
	Pause ()
	Delay (1)
EndIf
var int FormsMode = IsFormsModeActive()
if (FormsMode) TurnOffFormsMode(FormsModeEventSpeechSilent) endIf
var int result = DlgListOfFormFieldsEx()
if result == 0
	RestoreFormsMode(FormsMode)
	SayMessage(OT_ERROR,
		formatString(CMSGNoTagsFound_L,CVMSGFormFields_L),
		FormatString(CMSGNoTagsFound_S,CVMSGFormFields_L))
elif result == 1
	EdgeShouldNotSpeakFocusChange = 1
	ScheduleFunction( "ResetEdgeShouldNotSpeakFocusChange", 10 )
	RestoreFormsMode(FormsMode)
else ;result == 2, moved to formfield:
	EdgeShouldNotSpeakFocusChange = 1
	ScheduleFunction( "ResetEdgeShouldNotSpeakFocusChange", 10 )
	Delay(2)
	;If this original form field activates forms mode, then JAWS fails to move to the newly selected control:
	if IsFormsModeActive () TurnOffFormsMode(FormsModeEventSpeechSilent) EndIf
	var int iObjType = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
	if iObjType == wt_edit
	|| iObjType == wt_multiline_edit
	|| iObjType == wt_editCombo
	|| RunningProducts == product_MAGic
		TurnOnFormsMode()
	EndIf
	builtin::SayElement()
endIf
if iActivatedVCursor
	Delay (1)
	SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
EndIf
EndScript

script VirtualHTMLFeatures ()
var
	int Index,
	string sDlgListItems
If !(GetRunningFSProducts() & product_JAWS) return EndIf
sDlgListItems = StrVirtHTMLDlgLst
index = dlgSelectItemInList (sDlgListItems , cStrVirtHTMLDlgName, TRUE)
Delay(10)
GlobalWasHjDialog = FALSE
If index == 0 Return EndIf
If Index == 1
	PerformScript SelectAFormField ()
ElIf index == 2
	PerformScript SelectAHeading ()
ElIf index == 3
	PerformScript SelectALink ()
EndIf
EndScript

void function ResetEdgeShouldNotSpeakFocusChange()
EdgeShouldNotSpeakFocusChange = 0;
EndFunction
	
void function ProcessSayAppWindowOnFocusChange(handle AppWindow,handle FocusWindow)
if EdgeShouldNotSpeakFocusChange return EndIf
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow,string 
	RealWindowName, handle FocusWindow)
if EdgeShouldNotSpeakFocusChange return EndIf
ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
EndFunction

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName, handle FocusWindow)
if EdgeShouldNotSpeakFocusChange return EndIf
ProcessSayFocusWindowOnFocusChange(RealWindowName,FocusWindow)
EndFunction

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow, optional handle PrevFocusWindow)
if EdgeShouldNotSpeakFocusChange return EndIf
return FocusChangedEventShouldProcessAncestors(FocusWindow, PrevFocusWindow)
EndFunction

int function GetHeadingCount( int level )
; we are only spoofing the number of headings in order to
; get the function ProcessMoveToHeading to work
return 1;
EndFunction

void function TableExitedEvent()
;This event function is triggered when the cursor leaves a table and returns to the surrounding document.
SayMessage( ot_position, cmsgLeavingTable );
endFunction

void function LinkBoundaryEvent(int entering)
if (entering) then
	SayMessage(OT_POSITION,msgEnteringLink)
Else
	SayMessage(OT_POSITION, msgLeavingLink)
EndIf
EndFunction

void function HeadingBoundaryEvent(int level,int entering)
var
	string message
if (entering) then
	message = FormatString( msgEnteringHeading, IntToString(level))
	SayMessage(OT_POSITION,message)
Else
	SayMessage(OT_POSITION, msgLeavingHeading)
EndIf
EndFunction

void function TableEnteredEvent(int nTblCols, int nTblRows, int nTblNesting, int nCurCol, int nCurRow, int bUniform, int bHasMarkedHeaders, int nHeadersColumn, int nHeadersRow )
;This event function is triggered when the cursor moves into a table from outside a table.
var
	string message
lastTableEnteredRowCount = nTblRows 
lastTableEnteredColCount = nTblCols 
if !IsFocusInBrowser() return endIf
if (nTblCols <=1 || nTblRows <= 1) then
	return
EndIf
if (nTblNesting > 0) then
	message = FormatString( cmsgNestedTableWithColumnAndRowCount_L, IntToString(nTblNesting),  IntToString ( nTblCols), IntToString ( nTblRows) )
else
	message = FormatString( cmsgEnteringTable, IntToString ( nTblCols), IntToString ( nTblRows) )
EndIf
SayMessage( ot_position, message );
endFunction

void function CellChangedEvent(int NewCol, int NewRow, int NewNesting, int NewRowColCount,
		string ColHeader, string RowHeader, int PrevCol, int PrevRow, int PrevNesting, int PrevRowColCount)
;This event function is triggered when the cursor moves from one cell in a table to a new cell in either the same table or
;a nested table or parent table.
;ShouldExitcellChangedEvent provides a means by which the default CellChangedEvent can be prevented from executing any code.
if ShouldExitcellChangedEvent() return endIf
if (newCol <= 0 && newRow <= 0) then return endIf
if !IsFocusInBrowser() return endIf
CellChangedEvent(NewCol, NewRow, NewNesting, NewRowColCount, ColHeader, RowHeader, PrevCol, PrevRow, PrevNesting, PrevRowColCount)
endFunction

void function AceRegionEnteredEvent(int type, string label)
var
	string message
if (type == WT_APPLICATION) then
	if (StringLength (label) == 0) then
		message = FormatString( msgEnteringApplicationRegion)
	else
		message = FormatString( msgEnteringNamedApplicationRegion, label)
	EndIf
EndIf
if (type == WT_ARTICLE_REGION) then
	if (StringLength (label) == 0) then
		message = FormatString( msgEnteringArticleRegion)
	else
		message = FormatString( msgEnteringNamedArticleRegion, label)
	EndIf
EndIf
if (type == WT_BANNER_REGION) then
	if (StringLength (label) == 0) then
		message = FormatString( msgEnteringBannerRegion)
	else
		message = FormatString( msgEnteringNamedBannerRegion, label)
	EndIf
EndIf
if (type == WT_COMPLEMENTARY_REGION) then
	if (StringLength (label) == 0) then
		message = FormatString( msgEnteringComplementaryRegion)
	else
		message = FormatString( msgEnteringNamedComplementaryRegion, label)
	EndIf
EndIf
if (type == WT_CONTENTINFO_REGION) then
	if (StringLength (label) == 0) then
		message = FormatString( msgEnteringContentInfoRegion)
	else
		message = FormatString( msgEnteringNamedContentInfoRegion, label)
	EndIf
EndIf
if (type == WT_FORM_REGION) then
	if (StringLength (label) == 0) then
		message = FormatString( msgEnteringFormRegion)
	else
		message = FormatString( msgEnteringNamedFormRegion, label)
	EndIf
EndIf
if (type == WT_Main_REGION) then
	if (StringLength (label) == 0) then
		message = FormatString( msgEnteringMainRegion)
	else
		message = FormatString( msgEnteringNamedMainRegion, label)
	EndIf
EndIf
if (type == WT_NAVIGATION_REGION) then
	if (StringLength (label) == 0) then
		message = FormatString( msgEnteringNavigationRegion)
	else
		message = FormatString( msgEnteringNamedNavigationRegion, label)
	EndIf
EndIf
if (type == WT_REGION) then
	if (StringLength (label) == 0) then
		message = FormatString( msgEnteringRegion)
	else
		message = FormatString( msgEnteringNamedRegion, label)
	EndIf
EndIf
if (type == WT_SEARCH_REGION) then
	if (StringLength (label) == 0) then
		message = FormatString( msgEnteringSearchRegion)
	else
		message = FormatString( msgEnteringNamedSearchRegion, label)
	EndIf
EndIf
SayMessage( ot_jaws_message, message );
EndFunction
	
void function AceRegionExitedEvent(int type, string label)
var
	string message
if (type == WT_Application) then
	message = FormatString( msgLeavingApplicationRegion)
EndIf
if (type == WT_ARTICLE_REGION) then
	message = FormatString( msgLeavingArticleRegion)
EndIf
if (type == WT_BANNER_REGION) then
	message = FormatString( msgLeavingBannerRegion, IntToString ( type))
EndIf
if (type == WT_COMPLEMENTARY_REGION) then
	message = FormatString( msgLeavingComplementaryRegion, IntToString ( type))
EndIf
if (type == WT_CONTENTINFO_REGION) then
	message = FormatString( msgLeavingContentInfoRegion)
EndIf
if (type == WT_FORM_REGION) then
	message = FormatString( msgLeavingFormRegion)
EndIf
if (type == WT_MAIN_REGION) then
	message = FormatString( msgLeavingMainRegion)
EndIf
if (type == WT_NAVIGATION_REGION) then
	message = FormatString( msgLeavingNavigationRegion)
EndIf
if (type == WT_REGION) then
	message = FormatString( msgLeavingRegion)
EndIf
if (type == WT_SEARCH_REGION) then
	message = FormatString( msgLeavingSearchRegion)
EndIf
SayMessage( ot_jaws_message, message );
EndFunction

void function SayCurrentPlaceMarker()
Say(msgPlacemarkerNotAvailableInEdge,ot_error)
EndFunction

void function SpeakPlaceMarkerN(int nPlaceMarker)
If !(GetRunningFSProducts() & product_JAWS) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if SayAllInProgress() return EndIf
Say(msgPlacemarkerNotAvailableInEdge,ot_error)
EndFunction

void function ProcessMoveToPlaceMarker(int MoveDirection)
if !VirtualViewerFeatureAvailable(true,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
Say(msgPlacemarkerNotAvailableInEdge,ot_error)
EndFunction

void function MoveToPlaceMarkerN(int nPlaceMarker)
If !(GetRunningFSProducts() & product_JAWS) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if SayAllInProgress() return EndIf
Say(msgPlacemarkerNotAvailableInEdge,ot_error)
EndFunction

Script DefineATempPlaceMarker()
if !VirtualViewerFeatureAvailable(true,true) return EndIf
Say(msgPlacemarkerNotAvailableInEdge,ot_error)
EndScript

script SelectTextBetweenMarkedPlaceAndCurrentPosition()
if !(IsVirtualPCCursor() || IsFormsModeActive()) || UserBufferIsActive() return endIf
Say(msgSelectTextBetweenMarkedPlaceAndCurrentPositionNotAvailableInEdge,ot_error)
EndScript

Script MoveToFlowTo ()
if !VirtualViewerFeatureAvailable(true,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
SayMessage(ot_error,
	FormatString(msgQuickNavNotAvailableInEdgeForType_L,CVMSGFlow),
	FormatString(msgQuickNavNotAvailableInEdgeForType_S,CVMSGFlow))
EndScript

Script MoveToFlowFrom ()
if !VirtualViewerFeatureAvailable(true,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
SayMessage(ot_error,
	FormatString(msgQuickNavNotAvailableInEdgeForType_L,CVMSGFlow),
	FormatString(msgQuickNavNotAvailableInEdgeForType_S,CVMSGFlow))
EndScript

void function JumpToLine()
If !(GetRunningFSProducts() & product_JAWS) return endIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
Say(msgJumpToLineNotAvailableInEdge,ot_error)
EndFunction

void function JumpReturnFromLine()
If !(GetRunningFSProducts() & product_JAWS) return endIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
Say(msgJumpToLineNotAvailableInEdge,ot_error)
EndFunction

void function ProcessMoveToElement(int MoveDirection, int bSameType)
if !VirtualViewerFeatureAvailable(true,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
var string sNavType
if bSameType
	sNavType = msgSameElementQuickNavType 
else
	sNavType = msgDifferentElementQuickNavType
endIf
SayMessage(ot_error,
	FormatString(msgQuickNavNotAvailableInEdgeForType_L,sNavType),
	FormatString(msgQuickNavNotAvailableInEdgeForType_S,sNavType))
EndFunction

void function ProcessMoveToNonLinkText(int MoveDirection)
if !VirtualViewerFeatureAvailable(true,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
SayMessage(ot_error,
	FormatString(msgQuickNavNotAvailableInEdgeForType_L,msgNonLinkTextQuickNavType),
	FormatString(msgQuickNavNotAvailableInEdgeForType_S,msgNonLinkTextQuickNavType))
EndFunction

void function ProcessMoveToFrame(int MoveDirection, optional int nFrameIndex)
if !VirtualViewerFeatureAvailable(true,true) then return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) return endIf
SayMessage(ot_error,
	FormatString(msgQuickNavNotAvailableInEdgeForType_L,cvmsgFrames1_L),
	FormatString(msgQuickNavNotAvailableInEdgeForType_S,cvmsgFrames1_L))
EndFunction

void function ProcessMoveToList(int MoveDirection)
var
	int bJAWSRequired,
	int bSayAllInProgress
bJAWSRequired = !(MoveDirection == s_Next || MoveDirection == s_Prior)
if !VirtualViewerFeatureAvailable(bJAWSRequired,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) return endIf
bSayAllInProgress = SayAllInProgress ()
if MoveToList(MoveDirection) then
	if !bSayAllInProgress
	|| (MoveDirection == s_Top || MoveDirection == s_Bottom)
		SayLine ()
	EndIf
else
	if !IsControlFoundOnPage(wt_list)
		NotifyNavigationFailed(0xffff,CVMSGList) ;NoItemForNavigation
	else
		NotifyNavigationFailed(MoveDirection,CVMSGList)
	endIf
EndIf
EndFunction

void function ProcessMoveToControlType(int iControlType, string sElementType,
	int bIsFormField, int bShouldSetFocus, int MoveDirection)
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if !IsQuickNavSupportedForType(iControlType)
	var string sType = GetControlTypeName(iControlType)
	SayMessage(ot_error,
		FormatString(msgQuickNavNotAvailableInEdgeForType_L,sType),
		FormatString(msgQuickNavNotAvailableInEdgeForType_S,sType))
	return
endIf
if !MoveToControlType(MoveDirection, iControlType, bShouldSetFocus) then
	if !sElementType
		sElementType = ConvertTypeToControlTypeStringPlural(iControlType)
	endIf
	if IsSubtypeMappedToUIA(iControlType)
	&& !IsControlFoundOnPage(iControlType)
		NotifyNavigationFailed(0xffff,sElementType) ;NoItemForNavigation
	else
		NotifyNavigationFailed(MoveDirection,sElementType)
	endIf
	return
endIf
if ( SayAllInProgress() ) return EndIf
builtin::SayElement();
EndFunction
	
void function ProcessMoveToLink(int MoveDirection, int linkType)
if !VirtualViewerFeatureAvailable(true,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
;Edge does not yet support distinguishing visited from unvisited links.
;For now, we will allow attempting to move to unvisited links as a way to move to any links
;and will report that move to visited links is unsupported.
if linkType == VisitedLink
	Say(FormatString(msgMoveToLinkNotSupported,cVMsgVisitedLinks1_L),ot_error)
	return
elif linkType == UnvisitedLink
	if !MoveToUnvisitedLink(MoveDirection) then
		NotifyNavigationFailed(MoveDirection,cVMsgUnvisitedLinks1_L)
		return
	endIf
else ;linkType == AnyLink
	if !MoveToAnyLink(MoveDirection) then
		NotifyNavigationFailed(MoveDirection,cVMsgLinks1_L)
		return
	endIf
endIf
if !SayAllInProgress()
|| MoveDirection == s_Top
|| MoveDirection == s_Bottom then
	builtin::SayElement()
endIf
EndFunction

void function ProcessMoveToField(int MoveDirection)
var
	int bJAWSRequired
let bJAWSRequired = !(MoveDirection == s_Next || MoveDirection == s_Prior)
if !VirtualViewerFeatureAvailable(bJAWSRequired,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) return endIf
if MoveToFormField(MoveDirection)
	builtin::SayElement();
else
	if !IsFormFieldFoundOnPage()
		NotifyNavigationFailed(0xffff,CVMSGFormFields_L) ;NoItemForNavigation
	else
		NotifyNavigationFailed(MoveDirection,CVMSGFormField)
	endIf
EndIf
EndFunction

Script SelectATable()
if !VirtualViewerFeatureAvailable(true,true,true) return EndIf
SayMessage(ot_error,FormatString(msgSelectFromListForTypeNotYetAvailableInEdge,cVMSGTable))
EndScript

Script SelectaRegion ()
if !VirtualViewerFeatureAvailable(FALSE,true,true) return EndIf
SayMessage(ot_error,FormatString(msgSelectFromListForTypeNotYetAvailableInEdge,cMsgRegions))
EndScript

Script SelectAMailToLink()
if !VirtualViewerFeatureAvailable(true,true,true) return EndIf
SayMessage(ot_error,FormatString(msgSelectFromListForTypeNotAvailableInEdge,cVMsgMailToLinks1_L))
EndScript

void function SelectAFormFieldHelper(int nType, string sTitle)
if IsQuickNavSupportedForType(nType)
	SayMessage(ot_error,FormatString(msgSelectFromListForTypeNotYetAvailableInEdge,ConvertFormFieldTypeToControlNamePlural(nType)))
endIf
EndFunction

void function SelectATagHelper(string sTag, string sAttrList,string sTitle)
if sTag == TAG_SELECTABLE_ITEMS_CONTROL  ;SelectAComboFormField
|| sTag == cscGraphic  ;script SelectAGraphic
	SayMessage(ot_error,FormatString(msgSelectFromListForTypeNotYetAvailableInEdge,ConvertTagToControlString(sTag)))
elif sTag == TAG_LIST_ITEM  ;script SelectAListItem
|| sTag == cscList  ;script SelectAList
|| sTag == cscParagraph  ;script SelectAParagraph
|| sTag == cscObject  ;script SelectAnObject
|| sTag == cscBlockQuote  ;script SelectABlockQuote
|| sTag == cscDivision  ;script SelectADivision
|| sTag == cscSpan  ;script SelectASpan
|| sTag == cscANCHOR  ;script SelectAnAnchor
	SayMessage(ot_error,FormatString(msgSelectFromListForTypeNotAvailableInEdge,ConvertTagToControlString(sTag)))
endIf
EndFunction

Int Function DecrementSmartNavOnDoublePress ()
return false
EndFunction

Script SmartNavToggle ()
Say(msgSmartNavNotAvailableInEdge,ot_error)
EndScript

script OnMouseOver ()
SayCurrentScriptKeyLabel ()
SayMessage(ot_error,
	FormatString(msgQuickNavNotAvailableInEdgeForType_L,cvmsgOnMouseOverElements),
	FormatString(msgQuickNavNotAvailableInEdgeForType_S,cvmsgOnMouseOverElements))
EndScript

script SelectAnOnMouseOverElement()
if !VirtualViewerFeatureAvailable(true,true,true) return EndIf
SayMessage(ot_error,
	FormatString(msgQuickNavNotAvailableInEdgeForType_L,cvmsgOnMouseOverElements),
	FormatString(msgQuickNavNotAvailableInEdgeForType_S,cvmsgOnMouseOverElements))
EndScript

script SelectAnOnClickElement()
if !VirtualViewerFeatureAvailable(true,true,true) return EndIf
SayMessage(ot_error,
	FormatString(msgQuickNavNotAvailableInEdgeForType_L,cvmsgClickableElements),
	FormatString(msgQuickNavNotAvailableInEdgeForType_S,cvmsgClickableElements))
endScript

string function ConvertTagToControlString( string tag )
if tag ==TAG_SELECTABLE_ITEMS_CONTROL
	return msgComboControlQuickNavTypes
else
	return ReturnTagTypeLiteral (Tag)
endIf
EndFunction

void function ProcessMoveToTag(int MoveDirection,
	string sTag, string sTagAttrib, string sElementtype,
	int bSayItemAsObject, int bCheckForContextHelp,
	optional int bMoveUseAttrib, optional int bAllowNesting)
var int controlType = ConvertTagToControlType( sTag )
if (!sTag || !controlType)
&& sTagAttrib
&& !IsQuickNavSupportedForAttribute(sTagAttrib)
	SayMessage(ot_error,
		FormatString(msgQuickNavNotAvailableInEdgeForType_L,sElementtype),
		FormatString(msgQuickNavNotAvailableInEdgeForType_S,sElementtype))
	return
endIf
if !IsQuickNavSupportedForType(controlType)
	var string controlString = ConvertTagToControlString( sTag )
	if (!controlString) controlString = sElementtype endIf
	SayMessage(ot_error,
		FormatString(msgQuickNavNotAvailableInEdgeForType_L,controlString),
		FormatString(msgQuickNavNotAvailableInEdgeForType_S,controlString))
	return
endIf
if controlType == 0 return EndIf
ProcessMoveToControlType( controlType, controlString, false, false, MoveDirection );
EndFunction
	
void function ProcessMoveToHeading(int MoveDirection, optional int nLevel)
var
	int bJAWSRequired,
	int bSayAllInProgress
let bJAWSRequired = (nLevel > 0
	|| !(MoveDirection == s_Next || MoveDirection == s_Prior))
if !VirtualViewerFeatureAvailable(bJAWSRequired,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) return endIf
if nLevel > 6 return endIf
Let bSayAllInProgress = SayAllInProgress ()
if MoveToHeading(MoveDirection,nLevel) then
	If !bSayAllInProgress
	|| MoveDirection == s_Top
	|| MoveDirection == s_Bottom then
		SayCurrentHeading()
	EndIf
else
	NotifyNavigationFailed(MoveDirection,CVMSGHeading, nLevel)
endIf
EndFunction

void function ProcessMoveToTable(int MoveDirection)
var
	int bJAWSRequired,
	int bSayAllInProgress
let bJAWSRequired = !(MoveDirection == s_Next || MoveDirection == s_Prior)
if !VirtualViewerFeatureAvailable(bJAWSRequired,true) then
	return
EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if MoveToTable(MoveDirection) then
	if !SayAllInProgress() then
		PerformScript SayLine()
	endIf
else
	if !IsControlFoundOnPage(wt_table)
		NotifyNavigationFailed(0xffff,CVMSGTable) ;NoItemForNavigation
	else
		NotifyNavigationFailed(MoveDirection,CVMSGTable)
	endIf
EndIf
EndFunction
	
Script MoveToNextRegion ()
if !VirtualViewerFeatureAvailable(FALSE,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if MoveToRegion(s_next,WT_LandmarkRegion) then
	If ! SayAllInProgress() then
		SayLine()
	EndIf
else
	SayFormattedMessage(ot_error, msgNoNextRegion_L, msgNoNextRegion_S)
EndIf
EndScript
	
Script MoveToPriorRegion ()
if !VirtualViewerFeatureAvailable(FALSE,true) return EndIf
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if MoveToRegion(s_prior,WT_LandmarkRegion) then
	If ! SayAllInProgress() then
		SayLine()
	EndIf
else
	SayFormattedMessage(ot_error, msgNoPriorRegion_L, msgNoPriorRegion_S)
EndIf
EndScript

Script SayNextParagraph()
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if IsFormsModeActive()
&& isPcCursor() then
	if getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
		TurnOffFormsMode ()
	EndIf
endIf
NextParagraph()
If SayAllInProgress() then
	Return
EndIf
indicateInconsistenciesInRange(CheckParagraph)
if !SayParagraph() then
	SayMessage(OT_error, cMSG276_L)
	SayMessage(OT_error, cMSG277_L, cmsgSilent)
endIf
EndScript

Script SayPriorParagraph()
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if IsFormsModeActive()
&& isPcCursor() then
	if getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
		TurnOffFormsMode ()
	EndIf
endIf
PriorParagraph()
If SayAllInProgress() then
	Return
EndIf
indicateInconsistenciesInRange(CheckParagraph)
if !SayParagraph() then
	SayMessage(OT_error, cMSG276_L)
	SayMessage(OT_error, cMSG277_L, cmsgSilent)
endIf
EndScript

int function SayWin8AppWindowTitle() 
var object element = GetTopLevelAppNode()
if (!element) return false endIf
SayMessage(ot_USER_REQUESTED_INFORMATION,
	FormatString(cmsg27_L,element.name),
	FormatString(cmsg27_S,element.name))
return true
EndFunction

Script VirtualFind()
if IsFormsModeActive()
	TurnOffFormsMode()
EndIf
if !IsVirtualPCCursor ()
	TypeKey(ks6)
	return
EndIf
SayFormattedMessage (ot_ERROR, MSG2_L, cmsgSilent)
DoJAWSFind(FALSE		)
EndScript

void function NotifyNavigationFailed(int MoveDirection, string sElement, optional int nLevel)
var
	string sMsg,
	int bPostNotification,
	int bWrap
bPostNotification = (GetRunningFSProducts() == product_magic && isSpeechOff ())
bWrap = 0  ;temporarily disabled since this is currently not supported, when supported use getJCFOption (optWrapNavigation)
If MoveDirection == s_Next
&& (!bWrap || nLevel>0)
	if bPostNotification
		if nLevel==1
			sMsg = FormatString(CVmsgNoNextElementsAtLevel_L, sElement, IntToString(nLevel))
		elif nLevel>1
			sMsg = FormatString(CVmsgNoNextElementsAtLevelInSection_L, sElement, IntToString(nLevel))
		else
			sMsg = FormatString(cvmsgNoMoreElements_L, sElement)
		endIf
	else
		if nLevel==1
			sMsg = FormatOutputMessage(ot_error, false,
				CVmsgNoNextElementsAtLevel_L, CVmsgNoNextElementsAtLevel_S,
				sElement, IntToString(nLevel))
		elif nLevel>1
			sMsg = FormatOutputMessage(ot_error, false,
				CVmsgNoNextElementsAtLevelInSection_L, CVmsgNoNextElementsAtLevelInSection_S,
				sElement, IntToString(nLevel))
		else
			sMsg = FormatOutputMessage(ot_error, false,
				cvmsgNoMoreElements_L, cvmsgNoMoreElements_S, sElement)
		endIf
	endIf
Elif MoveDirection == S_Prior
&& (!bWrap || nLevel>0)
	if bPostNotification
		if nLevel==1
			sMsg = FormatOutputMessage(ot_error, false,
				CVmsgNoPriorElementsAtLevel_L, CVmsgNoPriorElementsAtLevel_S,
				sElement, IntToString(nLevel))
		elif nLevel > 1
			sMsg = FormatString(CVmsgNoPriorElementsAtLevelInSection_L, sElement, IntToString(nLevel))
		else
			sMsg = FormatString(cvmsgNoPriorElements_L, sElement)
		endIf
	else
		if nLevel==1
			sMsg = FormatOutputMessage(ot_error, false,
				CVmsgNoPriorElementsAtLevel_L, CVmsgNoPriorElementsAtLevel_S,
				sElement, IntToString(nLevel))
		elif nLevel > 1
			sMsg = FormatOutputMessage(ot_error, false,
				CVmsgNoPriorElementsAtLevelInSection_L, CVmsgNoPriorElementsAtLevelInSection_S,
				sElement, IntToString(nLevel))
		else
			sMsg = FormatOutputMessage(ot_error, false,
				cvmsgNoPriorElements_L, cvmsgNoPriorElements_S, sElement)
		endIf
	endIf
else
	if bPostNotification
		sMsg = FormatString(cvmsgNoElements_L, sElement)
	else
		sMsg = FormatOutputMessage(ot_error, false,
			cvmsgNoElements_L, cvmsgNoElements_S, sElement)
	EndIf
EndIf
if bPostNotification
	ExMessageBox(sMsg, msgFocusToFormFieldDialog, MB_OK|MB_ICONASTERISK)
else
	SayMessage(OT_ERROR, sMsg)
endIf
endFunction

script ScriptFileName()
ScriptAndAppNames(msgMicrosoftEdgAppName)
EndScript

int function AlertVirtualCursorSelectionNotSupported()
return false
EndFunction

script SelectNextCharacter()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectNextCharacter()
EndScript

script SelectPriorCharacter()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectPriorCharacter()
EndScript

script SelectNextWord()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectNextWord()
EndScript

script SelectPriorWord()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectPriorWord()
EndScript

script SelectNextLine()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectNextLine()
EndScript

script SelectPriorLine()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectPriorLine()
EndScript

script SelectFromStartOfLine()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectFromStartOfLine()
EndScript

script SelectToEndOfLine()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectToEndOfLine()
EndScript

script SelectNextParagraph()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectNextParagraph()
EndScript

script SelectPriorParagraph()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectPriorParagraph()
EndScript

script SelectNextScreen()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectNextScreen()
EndScript

script SelectPriorScreen()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectPriorScreen()
EndScript

script SelectFromTop()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectFromTop()
EndScript

script SelectToBottom()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectToBottom()
EndScript

script SelectAll()
if AlertVirtualCursorSelectionNotSupported() return endIf
PerformScript SelectAll()
EndScript

script ReadBoxInTabOrder()
if GetWindowClass(GetFocus()) == cwc_Windows_UI_Core_CoreWindow
&& !UserBufferIsActive()
	var object element = oEdgeFSUIA.GetFocusedElement()
	var object condition = oEdgeFSUIA.CreateAndCondition(
		oEdgeFSUIA.CreateIntPropertyCondition( UIA_ProcessIdPropertyId, element.ProcessID ),
		oEdgeFSUIA.ContentViewCondition())
	;Do not use the global treewalker for traversing, create one with the above condition:
	var object treewalker = oEdgeFSUIA.CreateTreeWalker(condition)
	if !(treewalker && element) return endIf
	treewalker.currentElement = element
	while (!(treewalker.currentElement.controlType == UIA_PaneControlTypeID || treewalker.currentElement.controlType == UIA_WindowControlTypeID) && treewalker.gotoParent()) endWhile
	var
		object RootElement = treewalker.currentElement,
		int reading = true
	while reading
		if !ShouldSkipUIAElementWhenNavigating(TreeWalker.currentElement)
		&& !treewalker.currentElement.isOffScreen
			UIASayElement(treewalker.currentElement,false,true)
		endIf
		;we can use the Edge FSUIA object for the following call,
		;since the FSUIA object is only needed for its CompareElements method.
		reading = UIAGoToNextInBranch(oEdgeFSUIA,treeWalker,RootElement)
	endWhile
	return
EndIf
PerformScript ReadBoxInTabOrder()
EndScript

string function GetScreenSensitiveHelpVirtualDocumentGeneral()
return FormatString(msgScreenSensitiveHelpEdgeVirtualDocumentGeneral)
EndFunction

Script VirtualPCCursorToggle ()
Say(msgVirtualPCCursorToggleNotSupportedInEdge,ot_error)
EndScript

Script ScreenSensitiveHelp ()
if (!getRunningFSProducts () & product_JAWS) return endIf
if IsSameScript () 
	AppFileTopic (topic_MicrosoftEdge )
	return
endIf
PerformScript ScreenSensitiveHelp ()
EndScript

void function ButtonBoundaryEvent(int entering)
if (entering) then
	SayMessage(OT_POSITION, msgEnteringButton)
Else
	SayMessage(OT_POSITION, msgLeavingButton)
EndIf
EndFunction

void function SayLineUnit(int unitMovement, optional int bMoved)
var
int objectType

let objectType = GetObjectSubtypeCode()

if !unitMovement
|| !IsPCCursor()
|| IsVirtualPCCursor()
|| UserBufferIsActive()
|| InHJDialog()
|| GetMenuMode()
|| IsLeftButtonDown()
|| IsRightButtonDown()
|| SupportsEditCallbacks()
|| RibbonsActive() then
return SayLineUnit(unitMovement, bMoved)
EndIf

if (objectType == WT_TREEVIEWITEM)
return true
else
return SayLineUnit(unitMovement, bMoved)
endif
EndFunction

void function SayCharacterUnit(int UnitMovement)
if GetObjectSubtypeCode() == wt_TreeViewItem
&& IsFocusInBrowser()
	;ActiveItemChangedEvent speaks the treeview item
	return
endIf
SayCharacterUnit(UnitMovement)
EndFunction

int function GetTreeViewItemState()
var int State = GetTreeViewItemState()
;The default version specifically excludes the selected state,
;so test for it and add the selected state if the item is selected:
if GetObjectSubtypeCode() == wt_TreeviewItem
&& IsFocusInBrowser()
&& (GetControlAttributes() & CTRL_SELECTED)
	State = (State | CTRL_SELECTED)
endIf
return state
EndFunction

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if iObjType == wt_TreeviewItem
&& IsFocusInBrowser()
	if nChangedState & CTRL_SELECTED
	|| nOldState & CTRL_SELECTED
		SayTreeviewItem()
		return
	endIf
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if nLevel == 0
&& GetObjectSubtypeCode() == wt_TreeviewItem
&& IsFocusInBrowser()
	IndicateControlTYpe(wt_Treeview,cmsgSilent)
	SayTreeViewItem()
	Say(PositionInGroup(),ot_position)
	return
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

int function SayByTypeForScriptSayLine()
if GetObjectSubtypeCode() == wt_TreeviewItem
&& IsFocusInBrowser()
	SayObjectTypeAndText()
	return true
endIf
return SayByTypeForScriptSayLine()
EndFunction

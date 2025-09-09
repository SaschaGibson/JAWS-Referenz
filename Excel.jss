; Copyright 1995-2022 by Freedom Scientific, Inc.
; Script file for Microsoft Excel versions later 2016 and O365.

include "hjconst.jsh"
Include "hjglobal.jsh"
Include "magcodes.jsh"
include "UIA.jsh"
include "HjHelp.jsh"; AppFileTopic
include "common.jsm" ; common messages
include "tutorialHelp.jsm"
include "Office.jsh"
include "MSOffice.jsm"
include "excel.jsh"
include "excel.jsm"
include "MSAAConst.jsh"
include "WinStyles.jsh"; Win Style Bits Constants used by the GetWindowStyleBits function

Use "office.jsb"
Use "ExcelSettings.jsb"
use "ExcelFunc.jsb"
Use "ExcelBrl.jsb"

import "UIA.jsd"

GLOBALS
	int gbManagingWorksheetsFirstRun ; this shift+insert+s menu causes TutorMessageEvent to run twice, so set and unset from there don't use with FocusChange.

globals
	int IDForScheduleXLCellChangedEvent,
	int giPrevWCat

void Function AutoStartEvent ()
gCurrentSheetID = cscNull
EndFunction

int function GetTreeViewItemState()
var
	handle FocusWindow,
	int state,
	int TreeViewItemState
FocusWindow = GetFocus()
state = GetObjectStateCode(GetJCFOption(OPT_MSAA_MODE))
if !(state & CTRL_CHECKED)
&& !(state & CTRL_PARTIALLY_CHECKED)
&& !(state & CTRL_UNCHECKED)
&& cwc_sysTreeview32 == GetWindowClass(FocusWindow)
	TreeViewItemState = TVGetItemStateImageIndex(FocusWindow)
	if (1 == TreeViewItemState) then ; checked
		state = state | CTRL_CHECKED
	ElIf (2 == TreeViewItemState) then ; checked
		state = state | CTRL_PARTIALLY_CHECKED
	ElIf (3 == TreeViewItemState) then ; unchecked
		state = state | CTRL_UNCHECKED
	EndIf
EndIf
return state
EndFunction
int function ComputeSourceType()
	if GetJCFOption(OPT_MSAA_MODE) > 0
		return SOURCE_CACHED_DATA
	else
		return SOURCE_DEFAULT
	EndIf
EndFunction
void Function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if IsVirtualPCCursor()
	SayObjectTypeAndText(nLevel,includeContainerName)
	return
endIf
var
	handle FocusWindow,
	string WindowClass,
	int ObjectSubtypeCode,
	int state
ObjectSubtypeCode = GetObjectSubtypeCode()
if (ObjectSubtypeCode == WT_TABLECELL|| ObjectSubtypeCode == WT_Table) then
	; Office 2013 update renders active cells accessible and so they will double speak.
	; but Active cells are only those cells that contain data, so we filter this out and use our older method to reliably capture all content in all areas.
	Return
endIf
FocusWindow = GetFocus()
WindowClass = GetWindowClass(FocusWindow)
if (cwc_sysTreeview32 == WindowClass)
	state = GetTreeViewItemState() & ~CTRL_SELECTED
	if (nLevel < 0)
		SayMessage(OT_SELECTED_ITEM, TVGetFocusItemText(FocusWindow))
		IndicateControlState(WT_TREEVIEWITEM, state)
	ElIf (nLevel == 0)
		IndicateControlType(WT_TREEVIEW, GetObjectName(ComputeSourcetype(), 1), TVGetFocusItemText(FocusWindow))
		if GetObjectRole () & ROLE_SYSTEM_CHECKBUTTON
			SayFocusedTreeviewThreeWayCheckboxState()
		else
			IndicateControlState(WT_TREEVIEWITEM, state)
		endIf
		sayMessage(OT_POSITION, PositionInGroup())
	else
		SayObjectTypeAndText(nLevel,includeContainerName)
	endIf
	return
; announce groupbox names for NUIDialog controls, some controls in these dialogs may be standard controls
; and have their group name announced such as richedit20 so filter those out by checking getGroupBoxName
; sometimes getGroupBox name has redundant name so in that case we can search for a better group name
; this code only detects groupings that have labels programmatically which is not all NUIDialog controls
elif nLevel == 0
	if ObjectSubtypeCode == wt_comboBox
	&& GetObjectClassName(1) == wc_XLMain
	 if !GetObjectName() && !GetObjectValue()
	 	SayObjectTypeAndText()
	 	var string helpText = GetObjectHelp()
	 	if helpText
	 		SayMessage (OT_HELP, helpText)
	 	else
	 		SayMessage (OT_HELP, cscNotSelected)
	 	endIf
	 	return
	 endIf
	endIf
	if OnSlicer ()
		if ObjectSubtypeCode == wt_bitmap
			Say (GetObjectName (), OT_Control_Name)
			Say (msgSlicerPane, OT_Control_Type)
			return
		endIf
		if ObjectSubtypeCode == WT_ListBoxItem
			IndicateControlType (WT_ListBox, GetObjectName(false, 1), cscNull)
		endIf
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void function SayFocusedTreeviewThreeWayCheckboxState()
var int state = GetObjectMSAAState()
if state & STATE_SYSTEM_CHECKED
	Say(cMSG_checked,ot_item_state)
elif state & STATE_SYSTEM_MIXED
	Say(cMSG_PartiallyChecked,ot_item_state)
else
	Say(cmsg_notchecked,ot_item_state)
endIf
EndFunction

void function SayTreeViewItem()
var
	handle FocusWindow,
	string WindowClass,
	int nSubtype
FocusWindow = GetFocus()
WindowClass = GetWindowClass(FocusWindow)
if (cwc_sysTreeview32 == WindowClass)
	SayMessage(OT_LINE, TVGetFocusItemText(FocusWindow))
	nSubtype = GetObjectSubtypeCode()
	if nSubtype == wt_checkbox
		SayFocusedTreeviewThreeWayCheckboxState()
	else
		var int state = GetTreeViewItemState() & ~CTRL_SELECTED
		IndicateControlState(nSubtype, state)
	endIf
	return
endIf
SayTreeViewItem()
EndFunction

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
If (!KeyIsSpacebar(nKey, strKeyName, nIsBrailleKey)) return false endIf
If isPCCursor()
&& GetWindowClass(GetFocus()) == cwc_sysTreeview32
	If GetObjectSubTypeCode(SOURCE_CACHED_DATA) == WT_TREEVIEWITEM
	&& GetObjectSubTypeCode(SOURCE_CACHED_DATA, 1) == WT_TREEVIEW
	&& GetObjectName(SOURCE_CACHED_DATA, 1) == SC_ManualFilter
		Return TRUE
	EndIf
	var int state = GetTreeViewItemState()
	If state & CTRL_CHECKED
		sayMessage(OT_ITEM_STATE, cMSG_checked)
	ElIf (state & CTRL_PARTIALLY_CHECKED) then
		sayMessage(OT_ITEM_STATE, cMSG_PartiallyChecked)
	ElIf (state & CTRL_UNCHECKED) then
		sayMessage(OT_ITEM_STATE, cmsg_notchecked)
	EndIf
	return true
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function tutorMessageEvent (handle hwndFocus, int nMenuMode)
if (gbManagingWorksheetsFirstRun)
	;This menu causes the event to run twice, once ahead of time and once normally.
	gbManagingWorksheetsFirstRun = OFF
	if menusActive () then ; the script was successful, so wait:
		Return
	endIf
endIf
return tutorMessageEvent (hwndFocus, nMenuMode)
endFunction

void Function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
Var
	Handle hFocus = GetFocus (),
	String sClass = GetWindowClass (hFocus),
	string sLowerKey = stringLower (strKeyName)
if IsPCCursor()
&& !UserBufferIsActive() then
	;to report attribute changes:
	If nKey >= kiLeftCTRL2 && nKey <= kiLeftCtrl5
	|| nKey >= kiRightCTRL2 && nKey >= kiRightCTRl5
		ReportNewAttributeState (nKey)
		Return
	EndIf
EndIf
ProcessKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

int Function NewTextEventShouldBeSilent(Handle hFocus, Handle hWnd, String buffer,
	Int nAttributes, Int nTextColor, Int nBackgroundColor, Int nEcho, String sFrameName)
Var
	Handle hReal = GetRealWindow (hFocus),
	string sClass = GetWindowClass (hWnd),
	String sRealName = GetWindowName (hReal)
If GetWindowCategory (hWnd) == WCAT_SPREADSHEET
	Return TRUE
EndIf
If sClass == WcExcelColon
	;prevent extra text from speaking for when moving from Autofilter dialog to Custom Filter dialog:
	If sRealName == wn_Autofilter
		Return TRUE
	EndIf
EndIf
if nAttributes == ATTRIB_TEXT
&& GetWindowClass(GetParent(GetParent(hWnd))) == wcExcelSemicolon then
	if UsingPointNavigationInDatavalidationEditField() then
		return false
	EndIf
EndIf
return NewTextEventShouldBeSilent (hFocus, hWnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

void Function SayHighLightedText (Handle hWnd, String buffer)
var
	Handle hFocus = GetFocus (),
	Handle hReal = GetRealWindow (hFocus),
	Int iObjectType = GetObjectSubTypeCode(SOURCE_CACHED_DATA),
	string sClass = GetWindowClass (hWnd),
	String sRealName = GetWindowName (hReal)
If GetScreenEcho () > 0
	; special handling for F3 server class:
	If StringContains (GetWindowClass (hFocus), wc_F3Server)
	&& iObjectType == WT_EDITCOMBO
		Say (GetTextInRect (GetWindowLeft (hWnd), GetLineTop (), GetWindowRight (hWnd), GetLineBottom (), 0), OT_LINE)
		IndicateControlType (WT_EDITCOMBO, GetObjectValue (), cscSpace)
		Return
	EndIf
EndIf
Return SayHighLightedText(hWnd, buffer)
EndFunction

void Function SayNonHighlightedText (Handle hWnd, String buffer)
var
	String sClass = GetWindowClass (hWnd)
If GetScreenEcho () > 1
|| sClass == cwc_dlg32771
	SayMessage (OT_NONHIGHLIGHTED_SCREEN_TEXT, buffer)
	Return
EndIf
; status line
If sClass == wcExcel4
	If globalRealWindowName == wn_FunctionArguments
		Return
	EndIf
	If StringContains (buffer, scEdit)
		IndicateControlType (GetWindowSubtypeCode (GetFocus ()), buffer)
		Return
	EndIf
	Return	; done with status line
EndIf	; excel4, status line
if GetWindowClass(hWnd) == wcEDTBX
	If UsingPointNavigationInDatavalidationEditField ()
		SayLine()
		return
	EndIf
EndIf
SayNonHighlightedText (hWnd, buffer)
EndFunction

string Function GetNonhighlightedWindowText(handle hwnd)
Var
	int iLeft,
	int iRight,
	int iTop,
	int iBottom,
	string sText
If GetFocusRect(hwnd,iLeft,iRight,iTop,iBottom) then
	let sText=GetTextInRect(iLeft,iTop,iRight,iBottom)
else
	let sText=GetTextInRect(GetWindowLeft(hwnd),GetLineTop(),GetWindowRight(hwnd),GetLineBottom(),			attrib_text|attrib_strikeout|attrib_highlight|attrib_unselected|0				)
	if !sText then
		let sText=GetTextBetween(GetWindowLeft(hwnd),GetWindowRight(hwnd))
	EndIf
EndIf
if !sText then
	return cmsgBlank1
EndIf
return sText
EndFunction

void Function sayLine (optional int highlightTracking, optional int bSayingLineAfterMovement)
if IsVirtualPCCursor()
|| !isPCCursor()
|| INHjDialog()
	SayLine(highlightTracking,bSayingLineAfterMovement)
	return
EndIf
var
	handle hwnd,
	string strRealName,
	string sText,
	string sClass,
	int iPunctLevel,
	int iTVState,
	int iSubtype,
	int iObjType
let hwnd = GetFocus()
let sClass = GetWindowClass(hwnd)
let iSubtype = GetWindowSubtypeCode(hwnd)
let iObjType = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
If sClass == wc_netUIHwnd
	If iObjType == wt_treeviewItem
		SayLine(highlightTracking,bSayingLineAfterMovement)
		return
	EndIf
EndIf
If DialogActive()
	if iSubtype == wt_edit
		If iObjType == wt_edit then
			let sText = GetTextInRect(GetWindowLeft(hwnd),GetLineTop(),GetWindowRight(hwnd),GetLineBottom(),attrib_text|attrib_highlight|attrib_strikeout)
			if !sText then
				let sText = GetLine()
			EndIf
			Say(sText,ot_line,true)
		Else
			SayLine(highlightTracking,bSayingLineAfterMovement)
		EndIf
		return
	elif iSubtype == wt_editCombo 
		if (getWindowSubtypecode (getFirstChild (hwnd)) == WT_EDITCOMBO)
			sText = GetObjectValue(SOURCE_CACHED_DATA)
			if (stringIsBlank (sText))
				sText = GetWindowText (getFirstChild (hwnd), READ_EVERYTHING)
			endIf
		else
			let sText = GetObjectValue(SOURCE_CACHED_DATA)
		endIf
		if !sText then
			let sText = GetNonhighlightedWindowText(hwnd)
			if !sText then
				SayUsingVoice(vctx_message,cmsgBlank1,ot_word)
			EndIf
		EndIf
		say(sText,ot_line)
		return
	endIf
EndIf
let strRealName = GetWindowName (GetRealWindow (GetFocus ()))
; Office XP has listboxes whose items are checkboxes
If StringContains(strRealName,WN_AutoCorrect)
&& iSubtype == wt_ListBox then
	SetJcfOption(opt_Msaa_mode,2)
	if GetObjectTypeCode() == wt_CheckBox then
		SayFormattedMessage(ot_item_state,FormatString(msgCheckList, GetObjectState(), GetObjectName()))
	EndIf
	SetJcfOption(opt_Msaa_mode,1)
	return
ElIf IsEditingComment()  then
	let sText = GetField(true)
	Say(sText,ot_line)
	return
ElIf OnSpreadSheet() 
;&& getObjectSubtypeCode () != WT_MULTILINE_EDIT then
	;ReadRow is used instead of SayLine when on the spreadsheet
	return
EndIf
If sClass == wcEDTBX
	if iSubtype == wt_edit  then
		; some edit controls show highlighted text, others do not. Yet others show strikeout text.
		; So we apply the following kludge.
		let hwnd = GetCurrentWindow()
		let sText = getWindowText(hwnd,true)
		if StringContains(globalRealWindowName,sText) then
			let sText = GetLine()
		EndIf
		Let iPunctLevel=GetJcfOption(Opt_punctuation)
		SetJCFOption(opt_punctuation,3)
		Say(sText,ot_line)
		SetJCFOption(opt_punctuation,iPunctLevel)
		return
	EndIf
	If BrailleInUse() then
		BrailleRefresh()
	EndIf
EndIf
if sClass == cwc_sysTreeview32 then
	Say(TVGetFocusItemText(hwnd),ot_line,true)
	let iTVState = TVGetItemStateImageIndex(hwnd)
	if iTVState == 1 then ; checked
		sayMessage(ot_item_state,cmsg_checked)
	ElIf iTVState == 3 then ; unchecked
		sayMessage(ot_item_state,cmsg_notChecked)
	elIf iTVState == 2 then ; partially checked
		Say(cMSG_PartiallyChecked,ot_item_state)
	EndIf
	return
EndIf
sayLine(highlightTracking,bSayingLineAfterMovement)
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue, optional int bIsFocusObject)
if !bIsFocusObject ; probably what makes us not read automatically
&& nObjType == WT_COMBOBOX ; the offending control
&& hwnd == getFocus ()
&& getWindowClass (hwnd) == "REComboBox20W"
&& getWindowClass (getRealWindow (hwnd)) == "NUIDialog"
&& !stringIsBlank (sObjValue)
	say (sObjValue, OT_LINE)
	return
endIf
;When delete or paste is used on a cell:
if OnSpreadsheetCell()
&& bIsFocusObject
&& !IsUsingExcelEvents()
	XLCellChangedEvent()
	return
endIf
return ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue, bIsFocusObject)
endFunction

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
;If JAWS starts with Excel already in focus,
;force the focus change to behave as if the app just gained focus:
if !GlobalPrevFocus && !GlobalFocusWindow
	nChangeDepth = getAncestorCount()
;If more than one workbook is open and Alt+F4 is used to close the one in focus,
;the change depth will be reported as -1 when the other workbook gains focus.
;But, we want to force the change depth to the maximum to allow the app change code to run:
elif nChangeDepth == -1
&& GlobalPrevApp != GetAppMainWindow(hwndFocus)
	nChangeDepth = getAncestorCount()
endIf
if OnSlicer() then
	UnloadAllExcelObjectsData ()
endIf
if FocusRedirectedOnFocusChangedEventEx(hwndFocus, nObject, nChild,
		hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
FocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

int function OnSpreadsheetCell()
if UserBufferIsActive()
; for editing a note:
|| getObjectSubtypeCode () == WT_MULTILINE_EDIT
|| !OnSpreadSheet()
	return false
endIf
var int ObjectSubtypeCode = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
; new accessibility renders header cells as column headers
return ObjectSubtypeCode == WT_TABLECELL
	|| ObjectSubtypeCode == WT_Table
	|| objectSubtypeCode == WT_COLUMNHEADER
	|| GetObjectClassName (1) == UIAClass_XLSpreadsheetCell
endFunction

void function ScheduledXLCellChangedEvent()
IDForScheduleXLCellChangedEvent = 0
if !OnSpreadsheetCell() return endIf
XLCellChangedEvent()
EndFunction

int function ProcessFocusChangeOnSpreadSheet()
if !OnSpreadsheetCell() return false endIf
if IsUsingExcelEvents()
	;The Excel event will speak the change.
	return true
endIf
var string sheetID = GetSheetID()
if sheetID 
&& sheetID != gCurrentSheetID
	gCurrentSheetID = sheetID
	xlSheetChangedEvent()
	XLCellChangedEvent()
else
	if IDForScheduleXLCellChangedEvent
		UnscheduleFunction(IDForScheduleXLCellChangedEvent)
	endIf
	if IsKeyWaiting()
		IDForScheduleXLCellChangedEvent = ScheduleFunction("ScheduledXLCellChangedEvent",2)
	else
		XLCellChangedEvent()
	endIf
endIf
return true
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if ProcessFocusChangeOnSpreadSheet() return endIf
var
	string objectName = getObjectName(SOURCE_CACHED_DATA),
	string sHelp
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
if getWindowCategory () == WCAT_SPELL_CHECKER
&& GetObjectSubtypeCode() == wt_ListBoxItem
	spellString (getObjectName(SOURCE_CACHED_DATA))
endIf
sHelp = getExtraHelpFromDialogsOnItemChange ()
if sHelp && !(getWindowClass(getRealWindow(curHwnd)) == wc_NUIDialog && stringContains(getObjectName(SOURCE_CACHED_DATA,2),wn_formatPage) ) then
	say (sHelp, OT_DIALOG_TEXT)
EndIf
endFunction

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow, optional handle prevFocusWindow)
if GetWindowClass (FocusWindow) == wcExcel7 then return FALSE endIf
return FocusChangedEventShouldProcessAncestors(FocusWindow, prevFocusWindow)
endFunction

int function IgnoreObjectAtLevel (int level)
if level == 1
	;Ignore the Window when focus is moving to the ExcelColon combobox:
	if GetObjectSubtypeCode() == wt_combobox
	&& GetObjectClassName(level) == wc_XLMain
		return true
	endIf
endIf
return IgnoreObjectAtLevel (level)
EndFunction

int function FocusRedirectedOnFocusChange(handle hWndFocus)
var
	handle hWnd
if GetWindowClass(hWndFocus) == wcExcel7
&& IsWindowVisible(hWndFocus)
&& !FocusWindowSupportsUIA()
&& GetObjectRole() == 10
	UIARefresh()
	return TRUE
EndIf
if hWndFocus == GetAppMainWindow(hWndFocus) then
	let hWnd = FindWindow(hWndFocus,wcExcel7)
	if IsWindowVisible(hWnd) then
		; after removing StructureChangedEvent hook in Office, 
		; Excel 2016 was no longer focusing on the spreadsheet when coming in from the backstage view.
		; To accomodate JAWS failing to see focus is on the spreadsheet, call both UIA and MSAA Refresh.
		; Focus is already on the spreadsheet, JAWS just thinks it's on the application main window until both refreshes run.
		UIARefresh ()
		MSAARefresh ()
		return TRUE
	EndIf
EndIf
if StringStartsWith (GetWindowClass (hWndFocus), "_WW") then
	NullAllObjectsAndReturnToWord ()
	return true
endIf
return false
EndFunction

void Function ProcessEventOnFocusChangedEvent (Handle AppWindow,
	Handle RealWindow, String RealWindowName,
	Handle FocusWindow, Handle PrevWindow)
if FocusRedirectedOnFocusChange(FocusWindow) return EndIf
LastFocusChangeTime = GetTickCount()
; For the Edit Comment JAWS dialog, when first gains focus,
; must unselect the text:
if globalInEditCommentJAWSDialog then
	TypeKey (cksDownArrow)
	globalInEditCommentJAWSDialog = OFF
endIf
if getWindowClass (FocusWindow) == wcExcel7 then
	if IsUsingExcelEvents()
	&& !AreExcelEventsAttached()
		AttachXLEvents()
	endIf
	; for when first landing on a spreadsheet or returning to one,
	; Braille was not updating the display to show the current cell until the user moved or refreshed manually.
	; when exiting an embedded spreadsheet in Word document:
	ScheduleFunction ("BrailleRefresh", 3)
endIf
GlobalRealWindow = RealWindow
GlobalRealWindowName = RealWindowName
ProcessEventOnFocusChangedEvent (AppWindow, RealWindow, RealWindowName, FocusWindow, PrevWindow)
EndFunction

void function InitializeAndAnnounceNewWorkbookOnAppChange(handle AppWindow)
if !IsListeningForToastsInApp(AppWindow)
	UnhookLiveRegionChangedEvent()
	InitUIAAndHookLiveRegionChangedEvent()
endIf
If IsAppObjInvalid()
	InitializeOExcel()
EndIf
if !IsUsingExcelEvents()
	;XLWorkbookActivatedEvent announces the app and workbook:
	XLWorkbookActivatedEvent()
endIf
EndFunction

void Function ProcessSayAppWindowOnFocusChange (Handle AppWindow, Handle FocusWindow)
if (inHjDialog () || getWindowSubtypeCode (appWindow) == WT_DIALOG)
	return ProcessSayAppWindowOnFocusChange (AppWindow, FocusWindow)
endIf
var
	int iWCat,
	String sAppWindowTitle
iWCat = GetWindowCategory()
If GlobalPrevApp != AppWindow
	if iWCat == WCAT_SPREADSHEET
	|| GetWindowClass(FocusWindow) == wcChartClass
		InitializeAndAnnounceNewWorkbookOnAppChange(appWindow)
	else
		sAppWindowTitle = GetWindowName (AppWindow)
		Say(sAppWindowTitle, OT_LINE)
	endIf
	; Announce spellchecker window title if present on pressing Alt+Tab.
	If iWCat == WCAT_SPELL_CHECKER
		IndicateControlType (WT_DIALOG, wn_Spelling, cSCSpace)
	EndIf
	return
EndIf
If GlobalPrevApp == AppWindow
	;When one workbook is already open and you open another from Windows Explorer,
	;Excel opens to the already open workbook before loading the one chosen from Windows Explorer.
	;After the chosen workbook gains focus,
	;there is yet another focus change which puts a cell on the spreadsheet into focus.
	;by the time we get the focused cell of the chosen workbook in focus, we can no longer use the globalPrevApp not equal to app test.
	;But we can determine whether or not we are listening to UIA events in the focused app window,
	;and if not re-initialize the data and announce the newly focused workbook..
	if (iWCat == WCAT_SPREADSHEET || GetWindowClass(FocusWindow) == wcChartClass)
	&& !IsListeningForToastsInApp(AppWindow)
		InitializeAndAnnounceNewWorkbookOnAppChange(appWindow)
	; opening spellchecker on pressing the F7 key...
	elif GlobalPrevFocus != FocusWindow
	&& GetWindowCategory (FocusWindow) == WCAT_SPELL_CHECKER
		IndicateControlType (WT_DIALOG, wn_Spelling, cSCSpace)
		Return
	EndIf
EndIf
ProcessSayAppWindowOnFocusChange (AppWindow, FocusWindow)
EndFunction

string function getExtraHelpFromDialogsOnItemChange ()
Var
	handle hWnd,
	String sRealName,
	Int iObjectType
let hwnd = GetFocus()
let sRealName = GetWindowName (GetRealWindow (hWnd))
let iObjectType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
if StringContains (sRealName, wn_InsertFunction) then
	if iObjectType == WT_LISTBOXITEM then
		Return GetInsertFunctionHelp()
	EndIf
elif StringContains (sRealName, wn_diagramGallery) then
	if iObjectType == WT_LISTBOXITEM then
		Return GetDiagramGalleryHelp ()
	EndIf
EndIf
Return (MSAAGetDialogStaticText ())
endFunction

string Function MSAAGetDialogStaticText ()
Var
	handle hWnd,
	String sRealName,
	Int iObjectType
let hwnd = GetFocus()
let sRealName = GetWindowName (GetRealWindow (hWnd))
let iObjectType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
if StringContains (sRealName, wn_InsertFunction) then
	if iObjectType == WT_LISTBOXITEM then
		Return GetInsertFunctionHelp()
	EndIf
elif StringContains (sRealName, wn_diagramGallery) then
	if iObjectType == WT_LISTBOXITEM then
		Return GetDiagramGalleryHelp ()
	EndIf
EndIf
Return (MSAAGetDialogStaticText ())
EndFunction

int function ExcelSelectionChangedWithFocusChange()
var	int interval = LastFocusChangeTime - LastExcelSelectionChangeTime
return 550 > interval && interval > -550
EndFunction

int Function HandleCustomWindows (Handle hWnd)
var
	int onFormulaBarUIA = onFormulaBarUIAEditItem(),
	String sClass = GetWindowClass (hWnd),
	string sStart, string sEnd; for selected cells
If InHJDialog()
|| menusActive() then
	Return HandleCustomWindows (hWnd)
endIf
if OnSlicer ()
	SayFocusedObject ()
	return TRUE
endIf
if getObjectSubtypeCode () == WT_BITMAP then
; selecting shapes and images:
	if isChartActive() then
		ReadActiveChartSummary()
		return true
	else
		return default::HandleCustomWindows (hwnd)
	endIf
endIf
if onFormulaBarUIA  ; spreadsheet window but selecting cells in formula or autoSum 
	if StatusBarMode() == Excel_status_comment
		IndicateControlType (WT_EDIT, msgComment,cmsgSilent)
		return true
	endIf
	indicateControlType (WT_EDIT, null (), cmsgSilent)
	SayEditingCellFormula()
	return TRUE
endIf
if GetWindowCategory() == WCAT_SPREADSHEET
|| sClass == wcChartClass
	gbReadSelectedCellsAfterWorkbookDataIsUpdated = IsUpdatingWorkbookData()
	if gbReadSelectedCellsAfterWorkbookDataIsUpdated return true endIf
	If IsAppObjInvalid ()
		InitializeOExcel()
		if IsUsingExcelEvents()
			AttachXLEvents()
		endIf
	EndIf
	if IsUsingExcelEvents()
		XLAppEventWorkbookActivate()
		if !ExcelSelectionChangedWithFocusChange()
			ReadSelectedCells()
		EndIf
	else
		if !IsActiveWorkBookInitialized()
			XLWorkbookActivatedEvent()
		endIf
		XLCellChangedEvent()
	endIf
	Return TRUE
EndIf
if getWindowCategory () == WCAT_SPELL_CHECKER
&& GetObjectSubtypeCode() == wt_ListBoxItem
	sayObjectTypeAndText ()
	spellString (getObjectName(SOURCE_CACHED_DATA))
	return TRUE
endIf
Return HandleCustomWindows (hWnd)
EndFunction

void Function SayFocusedWindow ()
var
	Handle hFocus = GetFocus (),
	Handle hTopLevel = FindTopLevelWindow (cwc_Dlg32771, cscNull),
	Int iObjectType = GetObjectSubTypeCode(SOURCE_CACHED_DATA),
	String sClass = GetWindowClass (hFocus),
	string sMsg,
	string sStart, string sEnd; for selected cells
if InHJDialog()
|| UserBufferIsActive()
|| OnSlicer ()
	return SayFocusedObject ()
endIf
;Keepp alt+tab from over-talking
If hTopLevel
&& IsWindowVisible (hTopLevel)
	Return
EndIf
;refresh list view in Names Manager dialog box:
if (sClass == cscListViewClass
&& getWindowClass (getParent (hFocus)) == "XLLVP")
	MSAARefresh ()
	if (hFocus == globalPrevFocus)
		return
	endIf
endIf
If sClass == wcXLDesk
	;The workbook has lost focus to the parent window
	;This occurs after returning from Rename Sheet
	SetFocus (GetFirstChild (hFocus))
elIf sClass == wcEXCELE
	RestoreFocusToWorksheet ()
elIf StringContains (sClass, wc_F3Server)
&& iObjectType == wt_editCombo
	If globalPrevFocus != hFocus
		SaveCursor ()
		InvisibleCursor ()
		RouteInvisibleToPC ()
		PriorLine ()
		sMsg = GetObjectName ()
		RestoreCursor ()
		SayMessage (OT_CONTROL_GROUP_NAME, sMsg)
		IndicateControlType (iObjectType, GetObjectValue (), cscSpace)
	EndIf
ElIf sClass == wcExcelEquals	; for when current sheet name is manually changed by user:
	IndicateControlType (WT_EDIT, GetWindowText (hFocus, FALSE), cscSpace)
	BrailleRefresh ()
Else
	SayObjectTypeAndText ()
EndIf
; where chart is active, give help:
if isChartActive () then
	SayFormattedMessage(ot_help,msgDisplayChartInVirtualViewerHelp_l,msgDisplayChartInVirtualViewerHelp_s)
endIf
EndFunction

Script SayWindowPromptAndText()
var
	Handle hFocus = GetFocus (),
	Handle hReal = GetRealWindow (hFocus),
	Int iType = GetWindowSubtypeCode (hFocus),
	Int iObjectType = GetObjectSubTypeCode(SOURCE_CACHED_DATA),
	String sClass = GetWindowClass (hFocus),
	String sRealName = GetWindowName (hReal),
	Int nMode = smmTrainingModeActive (),
	Int iCategory = GetWindowCategory (hFocus)
If handleNoCurrentWindow ()
	Return
EndIf
If OnSlicer () then
	PerformScript SayWindowPromptAndText()
	return
endIf
If IsPCCursor ()
&& (! UserBufferIsActive ())
&& (! InHJDialog ())
	If Not iType
		iType = iObjectType
	EndIf
	SMMToggleTrainingMode (TRUE)
	If iCategory == WCAT_SPREADSHEET
		If isSameScript ()
			ReadSelectedCells(getRunningFSProducts ()&product_JAWS)
		Else
			SayActiveSheet()
			ReadSelectedCells()
		EndIf
	ElIf onFormulaBarUIAEditItem() then
		IndicateControlType(wt_Edit,GetObjectName(),cmsgSilent)
		SayEditingCellFormula()
		SayActiveCellCoordinatesInfo()
	ElIf StringContains (sClass, wc_F3Server)
	&& iType == WT_EDITCOMBO
		SayLine ()
	ElIf Not HandleCustomWindows (hFocus)
		SayObjectTypeAndText ()
		SayUsingVoice(VCTX_MESSAGE, GetObjectHelp(), OT_SCREEN_MESSAGE)
	EndIf
	SayWindowPromptAndTextPostProcess (hFocus, iType, nMode, SayWindowPromptAndText_AllProcesses)
	Return
ElIf UserBufferIsActive ()
&& isChartActive() then
	SayFormattedMessage (OT_CONTROL_NAME, FormatString (msgChart1, GetActiveChartName ()))
	SayWindowPromptAndTextPostProcess (hFocus, iType, nMode, SayWindowPromptAndText_AllProcesses)
EndIf
PerformScript SayWindowPromptAndText ()
EndScript

Int Function GetExcelVersion ()
Return (GetProgramVersion (GetAppFilePath ()))
EndFunction

int Function RestoreFocusToWorksheet()
Var
	Handle hSheet = FindWindow (GetAppMainWindow (GetFocus ()), wcExcel7, cscNull)
If hSheet then
	SetFocus(hSheet)
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction

int Function InTextWindow ()
If OnSpreadSheet()
|| onFormulaBarUIAEditItem() then
	Return TRUE
EndIf
Return inTextWindow()
EndFunction

int function IsEditingComment()
return StringStartsWith (GetObjectAutomationId (), AutomationID_Comment)
	&& CaretVisible()
endFunction

int function IsEditingNote()
return GetWindowCategory() == WCAT_SPREADSHEET
	&& GetObjectAutomationId () == AutomationID_LegacyComment
	&& CaretVisible()
endFunction

int function IsExtendedSelectionMode()
return GetWindowCategory() == WCAT_SPREADSHEET
	&& StatusBarMode() == Excel_Status_ExtendedSelection
endFunction

int function IsAddSelectedRangeOfCellsMode()
return GetWindowCategory() == WCAT_SPREADSHEET
	&& StatusBarMode() == Excel_status_AddSelectedRange
EndFunction

int function InExcel2007OrLaterFunctionList()
if !onFormulaBarUIAEditItem() return false EndIf
var handle hWnd = FindTopLevelWindow(wcXLAcoOuter,cscNull)
return hWnd
	&& IsWindowVisible(hWnd)
	&& GetWindowClass(GetFirstChild(hWnd)) == cWcListView
EndFunction

int function UsingPointNavigationInDatavalidationEditField()
return StatusBarMode() == Excel_status_point
	&& GetWindowName(GetRealWindow(GetFocus())) == wn_DataValidation
	&& GetObjectSubtypeCode() == wt_edit
EndFunction

int function OnSpreadSheet()
return GetWindowCategory() == WCAT_SPREADSHEET
	&& StatusBarMode() != Excel_status_comment && !inTextBox()
	&& !IsEditingNote()
	&& getObjectSubtypeCode () != WT_MULTILINE_EDIT
	&& !onFormulaBarUIAEditItem()
	&& !OnSlicer()
EndFunction

void function SayCharacterUnit(int UnitMovement)
var
	handle hwnd = getFocus(),
	string sClass = getWindowClass (hwnd),
	int objectType = getObjectSubtypeCode (),
	int objectRole = getObjectRole ()
If SayCursorMovementException(unitMovement)
|| objectType == WT_MULTILINE_EDIT
|| objectType == WT_EDIT then
	; navigation pane alt+w, k 
	if ! isVirtualPcCursor ()
	&& ObjectRole >= ROLE_SYSTEM_COLUMNHEADER
	&& ObjectRole <= ROLE_SYSTEM_CELL
	&& sClass == cwcIEServer then
		sayObjectTypeAndText () ; doesn't do so automatically.
		return
	endIf
	if StatusBarMode() != Excel_status_point
		SayCharacterUnit(UnitMovement)
	endIf
	return
endIf
if OnSpreadSheet() then
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	EndIf
	return
EndIf
if onFormulaBarUIAEditItem()
	if StatusBarMode() != Excel_status_point
		SayCharacter()
	endIf
	return
EndIf
if CaretVisible() then
	if UsingPointNavigationInDatavalidationEditField() then
		;this is spoken in SayNonHighlightedText
		return
	elif getWindowClass(hWnd) == wc_NUIDialog
	&& (getWindowName(hWnd) == wn_EditSeries || getWindowName(hWnd) == wn_Select_Data_Source)
	&& (statusBarMode() == Excel_status_point || statusBarMode() == Excel_status_enter) then
		say(getLine(),ot_line)
		return
	elif getObjectSubTypeCode(SOURCE_CACHED_DATA)
	&& stringContains(GetWindowName(globalRealWindow), wn_ChartWizard)
	&& (statusBarMode() == Excel_status_point || statusBarMode() == Excel_status_enter) then
		say(getLine(),ot_line)
		return
	;Cell reference edit fields need to read the entire line
	elif getObjectName(SOURCE_CACHED_DATA) == wn_RefersTo
	&& StatusBarMode() != Excel_status_edit then
		say(getLine(),ot_line)
		return
	endIf
EndIf
SayCharacterUnit(UnitMovement)
EndFunction

void Function SayWordUnit (Int UnitMovement)
var int objectType = getObjectSubtypeCode ()
If SayCursorMovementException(unitMovement)
|| objectType == WT_MULTILINE_EDIT
|| objectType == WT_EDIT then
	SayWordUnit (UnitMovement)
	return
endIf
if GetWindowCategory() == WCAT_SPREADSHEET
	if IsEditingComment() || inTextBox() then
		SayWord()
	EndIf
	return
EndIf
SayWordUnit (UnitMovement)
EndFunction

void Function SayLineUnit (int unitMovement, optional  int bMoved)
var
	Handle hFocus = GetFocus (),
	Handle hReal = GetRealWindow (hFocus),
	Int iWindowType = GetWindowSubtypeCode (hFocus),
	Int iObjectType = GetObjectSubTypeCode(SOURCE_CACHED_DATA),
	int ObjectRole = getObjectRole (),
	string sObjValue,
	String sClass = GetWindowClass (hFocus),
	String sRealName = GetWindowName (hReal),
	handle hChild
If SayCursorMovementException(unitMovement,bMoved)
	; navigation pane alt+w, k 
	if ! isVirtualPcCursor ()
	&& ObjectRole >= ROLE_SYSTEM_COLUMNHEADER
	&& ObjectRole <= ROLE_SYSTEM_CELL
	&& sClass == cwcIEServer then
		return
	endIf
	SayLineUnit(unitMovement,bMoved)
	return
elIf getObjectSubtypeCode () == WT_MULTILINE_EDIT then
; editing a note:
	SayLineUnit (unitMovement, bMoved)
	return
elIf getObjectSubtypeCode () == WT_EDIT then
	if StatusBarMode() == Excel_status_point return endIf
	if UnitMovement != UnitMove_Current
	&& IsFocusInSDMSingleLineEdit () then
	; font / point size edit combos that are historic SDM windows
		return
	endIf
endIf
If sClass == wcEXCELE
	RestoreFocusToWorksheet ()
EndIf
if unitMovement == UnitMove_Current
&& onFormulaBarUIAEditItem() then
	; base class of window is spreadsheet, but on UIA edit item for formula bar and rename sheets.
	var string UIAFormulaText = getFocusUIAElementText ()
	if isSameScript () then
		spellString (UIAFormulaText)
	else
		say (UIAFormulaText, OT_LINE)
	endIf
	return
endIf
If OnSpreadSheet() then
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	EndIf
	Return
EndIf
if onFormulaBarUIAEditItem()
	if StatusBarMode() == Excel_status_point
		SayEditingCellFormula ()
	endIf
	Return
EndIf
if sRealName == wn_diagramGallery
&& iObjectType == wt_listboxItem
	SayDiagramGalleryObject (hFocus)
	Return
EndIf
if CaretVisible ()
	if UsingPointNavigationInDatavalidationEditField() then
		;this is spoken in SayNonHighlightedText
		return
	elif worksheetHasFocus()
	&& !inTextBox()
	&& !IsEditingComment()
		; Movement out of cell from editing a cell;
		; do not speak the line being left behind.
		return
	endIf
	; special handling for F3 Server class
	If StringContains (sClass, wc_F3Server)
	&& iObjectType == WT_EDITCOMBO
		Say (GetTextInRect (GetWindowLeft (hFocus), GetLineTop (), GetWindowRight (hFocus), GetLineBottom (), 0), OT_LINE)
		Return
	elIf (getWindowSubtypeCode (getFirstChild (getFocus ())) == WT_EDITCOMBO)
		;No event notifications tell us this has updated:
		delay (2, TRUE) ; wait for the combo to catch up to key press.
		sObjValue = getObjectValue(SOURCE_CACHED_DATA)
		if (! stringIsBlank (sObjValue))
			say (sObjValue, OT_LINE)
		else
			say (getWindowText(getFirstChild(getFocus ()), READ_EVERYTHING), OT_LINE)
		endIf
		return
	EndIf
EndIf
if unitMovement == UnitMove_Current
&& iWindowType == WT_EDITCOMBO
	if isSameScript () then
		SpellLine ()
	else
		sayLine (TRUE)
	endIf
	return
endIf
SayLineUnit(unitMovement, bMoved)
EndFunction

void Function SpeakHomeEndMovement ()
If IsPCCursor() then
	If onFormulaBarUIAEditItem() then
		if StatusBarMode() == Excel_status_point
			BrailleRefresh (brlAutoPanSmart)
		endIf
		return
	EndIf
	if globalRealWindowName==wn_diagramGallery
	&& GetObjectSubtypeCode(SOURCE_CACHED_DATA)==wt_listboxItem then
		SayDiagramGalleryObject(GetFocus())
		return
	EndIf
	If OnSpreadSheet()
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	EndIf
		return
	EndIf
	if CaretVisible() then
		if UsingPointNavigationInDatavalidationEditField() then
			;this is spoken in SayNonHighlightedText
			return
		endIf
	EndIf
EndIf
SpeakHomeEndMovement()
EndFunction

void function SayPageUpDownUnit(int UnitMovement)
if SayCursorMovementException(UnitMovement)
	SayPageUpDownUnit(UnitMovement)
	return
endIf
if onFormulaBarUIAEditItem()
	BrailleRefresh (brlAutoPanSmart)
	return
EndIf
if globalRealWindowName==wn_diagramGallery
&& GetObjectSubtypeCode(SOURCE_CACHED_DATA)==wt_listboxItem then
	SayCurrentScriptKeyLabel ()
	SayDiagramGalleryObject(GetFocus())
	return
EndIf
If OnSpreadSheet()
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	EndIf
	return
EndIf
if CaretVisible() then
	if UsingPointNavigationInDatavalidationEditField() then
		;this is spoken in SayNonHighlightedText
		return
	endIf
EndIf
SayPageUpDownUnit(UnitMovement)
EndFunction

Script ScriptFileName ()
ScriptAndAppNames(msgExcelAppName)
EndScript

Script SayCharacter ()
Var
	Handle hFocus = GetFocus (),
	String sClass = GetWindowClass (hFocus),
	Int iObjectType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
If handleNoCurrentWindow() then
	Return
EndIf
If OnSlicer () then
	PerformScript SayCharacter()
	return
endIf
If isPcCursor () && getObjectSubtypeCode () == WT_BITMAP then
	if isChartActive() then
		ReadActiveChartSummary()
	else
		sayObjectTypeAndText (0)
	endIf
	return
endIf
If IsPCCursor()
&& !UserBufferIsActive()
&& !InHJDialog() then
	If OnSpreadSheet() 
	&& getObjectSubtypeCode () != WT_MULTILINE_EDIT then
		SayCell()
		SayRowHeader()
		SayColumnHeader()
		return
	ElIf GlobalMenuMode == MENUBAR_ACTIVE then
		If iObjectType == WT_BUTTON
			IndicateControlType(WT_BUTTON, GetObjectName ())
			SayMessage(OT_ITEM_STATE, GetObjectState ())
			Return
		EndIf
	EndIf
EndIf
PerformScript SayCharacter ()
EndScript

Script sayWord ()
Var
	int subtypeCode = getObjectSubtypeCode (),
	Int iSame = IsSameScript ()
If handleNoCurrentWindow () then
	Return
EndIf
if subtypeCode == WT_EDIT then
	performScript sayWord ()
	return
elIf subtypeCode == WT_BITMAP then
	if isChartActive() then
		ReadActiveChartSummary()
	else
		sayObjectTypeAndText (0)
	endIf
	return
endIf
If OnSlicer () then
	PerformScript SayWord()
	return
endIf
if IsPCCursor()
&& !IsVirtualPCCursor()
&& OnSpreadSheet() then
	If iSame == 2 then
		SpellActiveCellTextPhonetic()
	Elif iSame == 1 then
		SpellActiveCellText()
	Else
		SayCell()
		SayRowHeader ()
		SayColumnHeader ()
	EndIf
	return
EndIf
if isPcCursor () 
&& onFormulaBarUIAEditItem() then
	var string UIAFormulaText = getFocusUIAElementText ()
	if isSameScript () then
		spellString (UIAFormulaText)
	else
		say (UIAFormulaText, OT_LINE)
	endIf
	return
endIf
PerformScript SayWord ()
EndScript

Script SayLine ()
If handleNoCurrentWindow ()
	Return
EndIf
if !IsPCCursor()
|| UserBufferIsActive()
|| InHJDialog()
	PerformScript SayLine()
	return
endIf
if OnSlicer ()
	if GetObjectSubtypeCode () == WT_ListBoxItem
		PerformScript SayLine()
		return
	endIf
	sayObjectTypeAndText (0)
	return
endIf
if getObjectSubtypeCode () == WT_BITMAP
	if isChartActive() then
		ReadActiveChartSummary()
	else
		sayObjectTypeAndText (0)
	endIf
	return
endIf
if onFormulaBarUIAEditItem()
	var string line = GetLine()
	if !line
		Say(cmsgBlank1,ot_line)
	else
		Var Int iPunctLevel = GetJCFOption (OPT_PUNCTUATION)
		SetJCFOption (OPT_PUNCTUATION, 3) ; all
		if isSameScript ()
			spellString (line)
		else
			say(line, OT_LINE)
		endIf
		SetJCFOption (OPT_PUNCTUATION, iPunctLevel )
	endIf
	return
endIf
If OnSpreadSheet()
	If IsSameScript () then
		SpellLine ()
		Return
	EndIf
	if getObjectSubtypeCode () == WT_EDIT then
		say::SayLine (TRUE)
		return
	endIf
	ReadRow()
	Return
EndIf
var
	Handle hFocus = getFocus(),
	string sClass = GetWindowClass (hFocus)
If sClass == wcExcelEquals
	Say (GetWindowText (hFocus, FALSE), OT_LINE)
	Return
endIf
var int iObjectType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
If StringContains (sClass, wc_F3Server)	; special handling for F3 Server class
&& iObjectType == WT_EDITCOMBO
	SaveCursor ()
	InvisibleCursor ()
	RouteInvisibleToPc ()
	PriorWord ()
	Say (GetWord (), OT_WORD)
	RestoreCursor ()
	Return
elif iObjectType == wt_checkbox
&& sClass == cwc_sysTreeview32
	SayMessage(OT_LINE, TVGetFocusItemText(GetFocus()))
	SayFocusedTreeviewThreeWayCheckboxState()
	return
EndIf
PerformScript SayLine()
EndScript

script sayFromCursor ()
if isPcCursor()
&& OnSpreadSheet() then
	readToEndOfRow()
else
	If IsSameScript() then
		SpellFromCursor()
	Else
		performScript sayFromCursor()
	EndIf
endIf
endScript

script SayToCursor ()
if isPcCursor()
&& OnSpreadSheet() then
	readFromStartOfRow()
else
	If isSameScript() then
		SpellToCursor()
	Else
		sayToCursor()
	EndIf
endIf
endScript

script readRow()
EnsureNoUserBufferActive()
ReadRow()
EndScript

script readFromStartOfRow()
EnsureNoUserBufferActive()
readFromStartOfRow()
EndScript

script readToEndOfRow()
EnsureNoUserBufferActive()
readToEndOfRow()
EndScript

script readColumn()
EnsureNoUserBufferActive()
readColumn()
endScript

script readToBottomOfColumn()
EnsureNoUserBufferActive()
readToBottomOfColumn()
endScript

script readFromTopOfColumn()
EnsureNoUserBufferActive()
readFromTopOfColumn()
endScript

Script ReadRowTotal ()
EnsureNoUserBufferActive()
ReadRowTotal()
BrailleRefresh()
EndScript

Script PostRowTotal()
performScript ReadRowTotal ()
endScript

Script ReadColumnTotal ()
EnsureNoUserBufferActive()
ReadColumnTotal()
BrailleRefresh()
EndScript

Script PostColumnTotal()
performScript ReadColumnTotal ()
endScript

Script setTotalsColumn()
var int nSetting
EnsureNoUserBufferActive()
GetValueToSetTitleColumn (nSetting, 0);just get current.
SetTotalsColumnSetting (nSetting)
UpdateRowTotalText(nSetting)
sayFormattedMessage(ot_status, formatString(msgSetTotalsColumn1_L, setTotalsColumnToCurrent (TRUE)))
EndScript

Script setTotalsRow()
var
	int nSetting
EnsureNoUserBufferActive()
GetValueToSetTitleRow (nSetting, 0)
SetTotalsRowSetting (nSetting)
UpdateColumnTotalText(nSetting)
sayFormattedMessage(ot_status, formatString(msgSetTotalsRow1_L, setTotalsRowToCurrent (TRUE)))
EndScript

Script sayRowTitle ()
EnsureNoUserBufferActive()
sayRowTitleOnDemand()
EndScript

Script PostRowTitle()
performScript sayRowTitle ()
endScript

Script sayColumnTitle ()
EnsureNoUserBufferActive()
sayColumnTitleOnDemand()
EndScript

Script PostColumnTitle()
performScript sayColumnTitle ()
endScript

Script setColTitlesRange ()
var
	int nStart= 0, int nEnd = 0
EnsureNoUserBufferActive()
GetValueToSetTitleRow (nStart, nEnd)
setColumnTitles (nStart, nEnd)
sayFormattedMessage(ot_status, formatString(msgSetColTitlesRange1_L, setColTitlesToRowRange (TRUE)))
EndScript

Script setRowTitlesRange ()
var
	int nStart= 0, int nEnd = 0
EnsureNoUserBufferActive()
GetValueToSetTitleColumn (nStart, nEnd)
setRowTitles (nStart, nEnd)
sayFormattedMessage(ot_status, formatString(msgSetRowTitlesRange1_L, setRowTitlesToColumnRange (TRUE)))
EndScript

Script JAWSEnd ()
if isPcCursor()
&& OnSpreadSheet() then
	sayCurrentScriptKeyLabel()
	JAWSEnd()
	If !IsEditingComment() 
	; and not editing a note:
	&& getObjectSubtypeCode () != wt_multiline_edit then
		SayMessage (OT_smart_help, msg10_L, msg10_S) ;"press any arrow key to move to end of data in current row or column"
	EndIf
Else
	performScript JAWSEnd()
endIf
EndScript

script End ()
performScript JAWSEnd ()
endScript

Script MoveToFirstCell ()
if IsPCCursor() then
	if onFormulaBarUIAEditItem()
		TypeKey(ksCtrlHome)
		if StatusBarMode() != Excel_status_point
			SayLine()
		endIf
		return
	elif OnSpreadSheet() then
		SayMessage(ot_smart_help,msg3_L,cmsgSilent) ;"First cell"
		TypeKey(ksCtrlHome)
		if ShouldFireProtectedSheetEvent()
			ProtectedViewSheetChange()
		EndIf
		return
	elif CaretVisible() then
		if UsingPointNavigationInDatavalidationEditField() then
			SayCurrentScriptKeyLabel()
			TypeCurrentScriptKey()
			;this is spoken in SayNonHighlightedText
			return
		endIf
	EndIf
endIf
performScript topOfFile()
EndScript

Script MoveToLastCell ()
if IsPCCursor() then
	if onFormulaBarUIAEditItem()
		TypeKey(ksCtrlEnd)
		if StatusBarMode() != Excel_status_point
			SayLine()
		endIf
		return
	elif OnSpreadSheet() then
		SayMessage(ot_smart_help,msg4_L,cmsgSilent) ;"Last Cell"
		TypeKey(ksCtrlEnd)
		if ShouldFireProtectedSheetEvent()
			ProtectedViewSheetChange()
		EndIf
		return
	elif CaretVisible() then
		if UsingPointNavigationInDatavalidationEditField() then
			SayCurrentScriptKeyLabel()
			TypeCurrentScriptKey()
			;this is spoken in SayNonHighlightedText
			return
		endIf
	EndIf
endIf
performScript bottomOfFile()
EndScript

Script Alt1()
EnsureNoUserBufferActive()
If GetWindowCategory () == WCAT_MESSAGE then
	PerformScript ReadOutlookHeader(1)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt2()
EnsureNoUserBufferActive()
If GetWindowCategory () == WCAT_MESSAGE then
	PerformScript ReadOutlookHeader(2)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt3()
EnsureNoUserBufferActive()
If GetWindowCategory () == WCAT_MESSAGE then
	PerformScript ReadOutlookHeader(3)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt4()
EnsureNoUserBufferActive()
If GetWindowCategory () == WCAT_MESSAGE then
	PerformScript ReadOutlookHeader(4)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt5()
EnsureNoUserBufferActive()
If GetWindowCategory () == WCAT_MESSAGE then
	PerformScript ReadOutlookHeader(5)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt6()
EnsureNoUserBufferActive()
If GetWindowCategory () == WCAT_MESSAGE then
	PerformScript ReadOutlookHeader(6)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt7()
EnsureNoUserBufferActive()
If GetWindowCategory () == WCAT_MESSAGE then
	PerformScript ReadOutlookHeader(7)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt8()
EnsureNoUserBufferActive()
If GetWindowCategory () == WCAT_MESSAGE then
	PerformScript ReadOutlookHeader(8)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt9()
EnsureNoUserBufferActive()
If GetWindowCategory () == WCAT_MESSAGE then
	PerformScript ReadOutlookHeader(9)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Alt0()
EnsureNoUserBufferActive()
If GetWindowCategory () == WCAT_MESSAGE then
	PerformScript ReadOutlookHeader(10)
	return
EndIf
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

Script ColumnFirstCellFromTop()
SayColumnFirstCellFromTop()
EndScript

Script ColumnSecondCellFromTop()
SayColumnSecondCellFromTop()
EndScript

Script ColumnThirdCellFromTop()
SayColumnThirdCellFromTop()
EndScript

Script ColumnFourthCellFromTop()
SayColumnFourthCellFromTop()
EndScript

Script RowFirstCellFromLeft()
SayRowFirstCellFromLeft()
EndScript

Script RowSecondCellFromLeft()
SayRowSecondCellFromLeft()
EndScript

Script RowThirdCellFromLeft()
SayRowThirdCellFromLeft ()
EndScript

Script RowFourthCellFromLeft()
SayRowFourthCellFromLeft ()
EndScript

int Function SayDataRegion(Int iDirection)
If !IsPCCursor()
|| InHJDialog()
|| UserBufferIsActive() then
	return false
endIf
if onFormulaBarUIAEditItem()
	if StatusBarMode() != Excel_status_point
		if iDirection == UnitMove_Down
		|| iDirection == UnitMove_Up
			SayLine()
		endIf
	endIf
	Return TRUE
EndIf
If OnSpreadSheet() then
	Pause ()
	If iDirection == UnitMove_Down
		SayDataRegionDir(0, 1)
	ElIf iDirection == UnitMove_Up
		SayDataRegionDir(0, -1)
	ElIf iDirection == UnitMove_Prior
		SayDataRegionDir(-1, 0)
	ElIf iDirection == UnitMove_Next
		SayDataRegionDir(1, 0)
	EndIf
	Return TRUE
EndIf
If GetWindowClass(GetFocus()) == cscListviewClass
	Delay (1, TRUE)
	If GetControlAttributes () != CTRL_SELECTED
		SayMessage (OT_ITEM_STATE, cMsgDeselected)	; unselected
		Return TRUE
	EndIf
EndIf
Return FALSE
EndFunction

Script DataRegionDown ()
TypeKey(ksCtrlDownArrow)
SayDataRegion(UnitMove_Down)
EndScript

Script DataRegionUp ()
TypeKey(ksCtrlUpArrow)
SayDataRegion(UnitMove_Up)
EndScript

Script DataRegionLeft ()
if getObjectSubtypeCode () == WT_EDIT then
	if StatusBarMode() == Excel_status_point
		TypeKey (ksCtrlLeftArrow)
		BrailleRefresh (brlAutoPanSmart)
		return
	endIf
	PerformScript SayPriorWord () ; default
	return
endIf
If OnSpreadSheet() then
	TypeKey (ksCtrlLeftArrow)
	If SayDataRegion (UnitMove_Prior)
		Return
	EndIf
EndIf
PerformScript SayPriorWord ()
If onFormulaBarUIAEditItem() then
	BrailleRefresh (brlAutoPanSmart)
EndIf
EndScript

Script DataRegionRight ()
if getObjectSubtypeCode () == WT_EDIT then
	if StatusBarMode() == Excel_status_point
		TypeKey (ksCtrlRightArrow)
		BrailleRefresh (brlAutoPanSmart)
		return
	endIf
	PerformScript SayNextWord()
	return
endIf
If OnSpreadSheet() then
	TypeKey (ksCtrlRightArrow)
	If SayDataRegion (UnitMove_Next)
		Return
	EndIf
EndIf
PerformScript SayNextWord()
If onFormulaBarUIAEditItem() then
	BrailleRefresh (brlAutoPanSmart)
EndIf
EndScript

Script SelectNextRegionRight()
if onFormulaBarUIAEditItem()
	if StatusBarMode() == Excel_status_point
		TypeKey(ksSelectNextRegionRight)
	else
		PerformScript SelectNextWord()
	endIf
	return
elif isVirtualPCCursor()
|| !isPCCursor()
|| UserBufferIsActive()
|| getObjectSubtypeCode () == WT_EDIT
|| IsEditingComment () then
	performScript SelectNextWord()
	return
elif OnSpreadSheet() then
	sayCurrentScriptKeyLabel()
	TypeKey(ksSelectNextRegionRight)
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetSelectionChange()
	elif !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
EndIf
PerformScript SelectNextWord()
EndScript

Script SelectPriorRegionLeft()
if onFormulaBarUIAEditItem()
	if StatusBarMode() == Excel_status_point
		TypeKey(ksSelectPriorRegionLeft)
	else
		PerformScript SelectPriorWord()
	endIf
	return
elif isVirtualPCCursor()
|| !isPCCursor()
|| UserBufferIsActive()
|| getObjectSubtypeCode () == WT_EDIT
|| IsEditingComment() then
	performScript SelectPriorWord()
	return
elif OnSpreadSheet() then
	sayCurrentScriptKeyLabel()
	TypeKey(ksSelectPriorRegionLeft)
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetSelectionChange()
	elif !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
EndIf
PerformScript SelectPriorWord()
EndScript

Script SelectNextRegionDown()
if onFormulaBarUIAEditItem()
	if StatusBarMode() == Excel_status_point
		TypeKey(ksSelectNextRegionDown)
	else
		PerformScript SelectNextLine()
	endIf
	return
elif isVirtualPCCursor()
|| !isPCCursor()
|| getObjectSubtypeCode () == WT_EDIT then
	PerformScript SelectNextLine()
	return
elif OnSpreadSheet() then
	sayCurrentScriptKeyLabel()
	TypeKey(ksSelectNextRegionDown)
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetSelectionChange()
	elif !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
EndIf
PerformScript SelectNextLine()
EndScript

Script SelectPriorRegionUp()
if onFormulaBarUIAEditItem()
	if StatusBarMode() == Excel_status_point
		TypeKey(ksSelectPriorRegionUp)
	else
		PerformScript SelectPriorLine()
	endIf
	return
elif isVirtualPCCursor()
|| !isPCCursor()
|| getObjectSubtypeCode () == WT_EDIT then
	PerformScript SelectPriorLine()
	return
elif OnSpreadSheet() then
	sayCurrentScriptKeyLabel()
	TypeKey(ksSelectPriorRegionUp)
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetSelectionChange()
	elif !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
EndIf
PerformScript SelectPriorLine()
EndScript

script MoveToStartOfRow()
if OnSpreadSheet()
|| StatusBarMode() != Excel_status_point
	PerformScript DataRegionLeft()
else
	PerformScript MoveToStartOfRow()
endIf
EndScript

script MoveToEndOfRow()
if OnSpreadSheet()
|| StatusBarMode() != Excel_status_point
	PerformScript DataRegionRight()
else
	PerformScript MoveToEndOfRow()
endIf
EndScript

script MoveToTopOfColumn()
if OnSpreadSheet()
|| StatusBarMode() != Excel_status_point
	PerformScript DataRegionUp()
else
	PerformScript MoveToTopOfColumn()
endIf
EndScript

script MoveToBottomOfColumn()
if OnSpreadSheet()
|| StatusBarMode() != Excel_status_point
	PerformScript DataRegionDown()
else
	PerformScript MoveToBottomOfColumn()
endIf
EndScript

Script FirstCellInTable()
If DialogActive()
|| globalMenuMode then
	return
Else
	if !IsNoSheetEvent()
		PerformScript FirstCellInTable()
	else
		FirstCell()
	EndIf
EndIf
EndScript

Script LastCellInTable()
If DialogActive()
|| globalMenuMode then
	return
Else
	if !IsNoSheetEvent()
		PerformScript LastCellInTable()
	else
		LastCell()
	EndIf
EndIf
EndScript

Script PriorCell()
If DialogActive()
|| globalMenuMode then
	return
Else
	if !IsNoSheetEvent()
		PerformScript PriorCell()
	else
		PriorCell()
	EndIf
EndIf
EndScript

Script NextCell()
If DialogActive()
|| globalMenuMode then
	return
Else
	if !IsNoSheetEvent()
		PerformScript NextCell()
	else
		NextCell()
	EndIf
EndIf
EndScript

Script UpCell()
If DialogActive()
|| globalMenuMode then
	return
Else
	if !IsNoSheetEvent()
		PerformScript UpCell()
	else
		UpCell()
	EndIf
EndIf
EndScript

Script DownCell()
If DialogActive()
|| globalMenuMode then
	return
Else
	if !IsNoSheetEvent()
		PerformScript DownCell()
	else
		DownCell()
	EndIf
EndIf
EndScript

Script FirstCellInRegion()
If OnSpreadSheet() then
	FirstCellInRegion()
	SayMessage (OT_SMART_HELP, msgFirstCellInCurrentDataRegion, cmsgSilent)
	ScheduleBrailleFlashMessageWithSpeechOutput(OT_SMART_HELP,msgFirstCellInCurrentDataRegion)
EndIf
EndScript

Script LastCellInRegion ()
If OnSpreadSheet() then
	LastCellInRegion()
	SayMessage (OT_SMART_HELP, msgLastCellInCurrentDataRegion, cmsgSilent)
	ScheduleBrailleFlashMessageWithSpeechOutput(OT_SMART_HELP,msgLastCellInCurrentDataRegion)
EndIf
EndScript

int function InTable()
if !IsVirtualPcCursor()
&& OnSpreadSheet() then
	return true
else
	return InTable()
EndIf
EndFunction

int function TableErrorEncountered(optional int NavType)
if InTable() then
	if NavType == TABLE_NAV_JUMP then
		SayMessage (OT_error, cmsgTableNavFeatureNotSupported)
		return true
	endIf
endIf
return TableErrorEncountered(NavType)
EndFunction

Script SelectNextCharacter()
if getObjectSubtypeCode () == WT_EDIT
	if StatusBarMode() == Excel_status_point
		TypeKey(ksShiftRightArrow)
		BrailleRefresh ()
		return
	endIf
	PerformScript SelectNextCharacter()
	return
endIf
If OnSpreadSheet() then
	TypeKey(ksShiftRightArrow)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
endIf
PerformScript SelectNextCharacter()
EndScript

Script SelectPriorCharacter()
if getObjectSubtypeCode () == WT_EDIT then
	if StatusBarMode() == Excel_status_point
		TypeKey(ksShiftLeftArrow)
		BrailleRefresh ()
		return
	endIf
	PerformScript SelectPriorCharacter()
	return
endIf
If OnSpreadSheet() then
	TypeKey(ksShiftLeftArrow)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
endIf
PerformScript SelectPriorCharacter()
EndScript

Script SelectNextWord()
if getObjectSubtypeCode () == WT_EDIT then
	if StatusBarMode() == Excel_status_point
		TypeKey(ksShiftCtrlRightArrow)
		BrailleRefresh ()
		return
	endIf
	PerformScript SelectNextWord()
	return
endIf
if OnSpreadSheet() then
	TypeKey(ksShiftCtrlRightArrow)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
endIf
PerformScript SelectNextWord()
EndScript

Script SelectPriorWord()
if getObjectSubtypeCode () == WT_EDIT then
	if StatusBarMode() == Excel_status_point
		TypeKey(ksShiftCtrlLeftArrow)
		BrailleRefresh ()
		return
	endIf
	PerformScript SelectPriorWord()
	return
endIf
if OnSpreadSheet() then
	TypeKey(ksShiftCtrlLeftArrow)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
endIf
performScript selectPriorWord()
EndScript

Script SelectNextLine()
if getObjectSubtypeCode () == WT_EDIT then
	if StatusBarMode() == Excel_status_point
		TypeKey(ksShiftDownArrow)
		BrailleRefresh ()
		return
	endIf
	PerformScript SelectNextLine()
	return
endIf
if OnSpreadSheet() then
	TypeKey(ksShiftDownArrow)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
endIf
performScript selectNextLine()
EndScript

Script SelectPriorLine()
if getObjectSubtypeCode () == WT_EDIT
	if StatusBarMode() == Excel_status_point
		TypeKey(ksShiftUpArrow)
		BrailleRefresh ()
		return
	endIf
	PerformScript SelectPriorLine()
	return
endIf
if OnSpreadSheet()
	TypeKey(ksShiftUpArrow)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
endIf
performScript selectPriorLine()
EndScript

Script SelectFromStartOfLine()
if getObjectSubtypeCode () == WT_EDIT then
	if StatusBarMode() == Excel_status_point
		TypeKey(ksShiftHome)
		BrailleRefresh ()
		return
	endIf
	PerformScript SelectFromStartOfLine()
	return
endIf
if OnSpreadSheet() then
	TypeKey(ksShiftHome)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
EndIf
performScript selectFromStartOfLine() ; default
EndScript

Script SelectToEndOfLine()
if getObjectSubtypeCode () == WT_EDIT then
	if StatusBarMode() == Excel_status_point
		TypeKey(ksShiftEnd)
		BrailleRefresh ()
		return
	endIf
	PerformScript SelectToEndOfLine()
	return
endIf
if OnSpreadSheet() then
	TypeKey(ksShiftEnd)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
EndIf
performScript SelectToEndOfLine()
EndScript

Script SelectToBeginningOfWorksheet()
if !isPCCursor()
|| isVirtualPCCursor()
|| isEditingComment()
	performScript selectFromTop()
	return
elif GetWindowTypeCode(GetFocus()) == wt_edit
|| getObjectSubtypeCode () == WT_EDIT
	if StatusBarMode() == Excel_status_point
		TypeKey(ksSelectToBeginningOfWorksheet)
		BrailleRefresh ()
		return
	endIf
	performScript SelectFromTop()
	return
endIf
if OnSpreadSheet() then
	sayCurrentScriptKeyLabel()
	TypeKey(ksSelectToBeginningOfWorksheet)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
endIf
performScript SelectFromTop()
EndScript

Script SelectToLastDataCell()
if !isPCCursor()
|| isVirtualPCCursor()
|| isEditingComment()
	performScript SelectToBottom()
	return
elif GetWindowTypeCode(GetFocus()) == wt_edit
|| getObjectSubtypeCode () == WT_EDIT
	if StatusBarMode() == Excel_status_point
		TypeKey(ksSelectToLastDataCell)
		BrailleRefresh ()
		return
	endIf
	performScript SelectToBottom()
	return
endIf
if OnSpreadSheet() then
	sayCurrentScriptKeyLabel()
	TypeKey(ksSelectToLastDataCell)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
EndIf
performScript SelectToBottom()
EndScript

Script SelectToBeginningOfRow()
if getObjectSubtypeCode () == WT_EDIT then
	if StatusBarMode() == Excel_status_point
		TypeKey(ksSelectToBeginningOfRow)
		BrailleRefresh ()
		return
	endIf
	PerformScript SelectFromStartOfLine()
	return
endIf
if OnSpreadSheet() then
	TypeKey(ksSelectToBeginningOfRow)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
EndIf
PerformScript SelectFromStartOfLine()
EndScript

Script SelectRow()
if OnSpreadSheet() then
	SayMessage(ot_smart_help,msg1_L) ;"selected entire row"
	TypeKey(ksShiftSpace)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
elif onFormulaBarUIAEditItem()
	if StatusBarMode() == Excel_status_point
		typeKey (ksShiftSpace)
		return
	endIf
EndIf
SayCurrentScriptKeyLabel()
typeKey (ksShiftSpace)
EndScript

Script SelectColumn()
if OnSpreadSheet() then
	SayMessage(ot_smart_help,msg2_L) ;"Selected entire column"
	TypeKey(ksCtrlSpace)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
elif onFormulaBarUIAEditItem()
	if StatusBarMode() == Excel_status_point
		TypeKey(ksCtrlSpace)
		return
	endIf
EndIf
PerformScript SelectCurrentItem()
EndScript

Script ScreenRight()
;moves one screen to right
if OnSpreadSheet() then
	SayMessage(ot_smart_help,msg9_L,cmsgSilent) ;"Moved right one screen"
	TypeKey (ksAltPageDown)
elif onFormulaBarUIAEditItem()
	TypeKey (ksAltPageDown)
	SayMessage(ot_smart_help,msg9_L,cmsgSilent) ;"Moved right one screen"
endIf
EndScript

Script screenLeft()
;moves one screen to Left
if OnSpreadSheet() then
	SayMessage(ot_smart_help,msg8_L,cmsgSilent) ;"Moved left one screen"
	TypeKey (ksAltPageUp)
elif onFormulaBarUIAEditItem()
	TypeKey (ksAltPageUp)
	SayMessage(ot_smart_help,msg8_L,cmsgSilent) ;"Moved left one screen"
endIf
EndScript

Script SelectPriorScreen()
If OnSpreadSheet() then
	sayCurrentScriptKeyLabel()
	TypeKey(ksSelectPriorScreen)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
elif onFormulaBarUIAEditItem()
	sayCurrentScriptKeyLabel()
	TypeKey(ksSelectPriorScreen)
	pauseForEditingCellFormula()
	SayEditingCellFormula ()
	return
EndIf
PerformScript SelectPriorScreen()
EndScript

Script SelectNextScreen()
If OnSpreadSheet() then
	sayCurrentScriptKeyLabel()
	TypeKey(ksSelectNextScreen)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
elif onFormulaBarUIAEditItem()
	sayCurrentScriptKeyLabel()
	TypeKey(ksSelectNextScreen)
	pauseForEditingCellFormula()
	SayEditingCellFormula ()
	return
EndIf
PerformScript SelectNextScreen()
EndScript

void function speakHelpMoveByWorksheetInFormula()
SayMessage(ot_help,msgMoveByWorksheetInFormulaHlp_l,msgMoveByWorksheetInFormulaHlp_s)
ScheduleBrailleFlashMessage(msgMoveByWorksheetInFormulaHlp_l)
EndFunction

Script NextSheet()
if DialogActive() then
	PerformScript NextDocumentWindow()
	if globalRealWindowName == wn_findAndReplace then
		delay(1,true)
		SayObjectTypeAndText()
	endIf
	return
endIf
If UserBufferIsActive() then
	UserBufferDeactivate()
	UserBufferClear()
EndIf
TypeKey(ksCtrlPageDown)
if onFormulaBarUIAEditItem()
	scheduleFunction("speakHelpMoveByWorksheetInFormula",2)
	Return
EndIf
if ShouldFireProtectedSheetEvent()
	ProtectedViewSheetActivate()
endIf
EndScript

Script PriorSheet()
if DialogActive() then
	PerformScript PreviousDocumentWindow()
	if globalRealWindowName == wn_findAndReplace then
		delay(1,true)
		SayObjectTypeAndText()
	endIf
	return
EndIf
If UserBufferIsActive() then
	UserBufferDeactivate()
	UserBufferClear()
EndIf
TypeKey(ksCtrlPageUp)
if onFormulaBarUIAEditItem()
	scheduleFunction("speakHelpMoveByWorksheetInFormula",2)
	Return
EndIf
if ShouldFireProtectedSheetEvent()
	ProtectedViewSheetActivate()
endIf
EndScript

Script SelectNextSheet ()
TypeKey(ksSelectNextSheet)
if onFormulaBarUIAEditItem()
	scheduleFunction("speakHelpMoveByWorksheetInFormula",2)
	Return
elif OnSpreadSheet()
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
EndIf
if ShouldFireProtectedSheetEvent()
	ProtectedViewSheetSelectionChange()
endIf
EndScript

Script SelectPriorSheet ()
TypeKey(ksSelectPriorSheet)
if onFormulaBarUIAEditItem()
	scheduleFunction("speakHelpMoveByWorksheetInFormula",2)
	Return
elif OnSpreadSheet()
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
EndIf
if ShouldFireProtectedSheetEvent()
	ProtectedViewSheetSelectionChange()
endIf
EndScript

Script SayNewSheet()
EnsureNoUserBufferActive()
SayCurrentScriptKeyLabel()
TypeKey(ksNewSheet)
EndScript

Script SelectRegion ()
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
if onFormulaBarUIAEditItem()
&& StatusBarMode() != Excel_status_point
	SayEditingCellFormula ()
elif OnSpreadSheet()
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
endIf
EndScript

Script SelectAll ()
SelectEntireDocument ()
if onFormulaBarUIAEditItem()
&& StatusBarMode() != Excel_status_point
	SayEditingCellFormula ()
elif OnSpreadSheet()
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
EndIf
EndScript

Script CollapseSelectionToActiveCell()
If OnSpreadSheet() then
	SayMessage(ot_smart_help, msg13_L,msg13_S) ;"collapses selection to active cell"
	TypeKey(ksShiftBackspace)
	if !IsUsingExcelEvents()
		XLSelectionChangedEvent()
	endIf
	return
elif onFormulaBarUIAEditItem()
	if StatusBarMode() == Excel_status_point
		TypeKey(ksShiftBackspace)
		return
	endIf
endIf
SayCurrentScriptKeyLabel()
TypeKey(ksShiftBackspace)
EndScript

Script SayCell()
If OnSpreadSheet()
&& !onFormulaBarUIAEditItem() then
	if CellReadingVerbosity() == readCellContentsAndCoordinates then
		SayActiveCellCoordinates()
	Endif
	SayCell()
EndIf
EndScript

Script SayActiveCellCoordinates ()
EnsureNoUserBufferActive()
If IsSameScript() == 2 then
	SpellActiveCellCoordinatesPhonetic()
Elif IsSameScript() then
	SpellActiveCellCoordinates()
else
	sayActiveCellCoordinatesInfo()
endIf
EndScript

Script SayVisibleRangeCoordinates ()
EnsureNoUserBufferActive()
SayVisibleRangeCoordinates()
EndScript

Script DescribeCellBorder()
EnsureNoUserBufferActive()
DescribeActiveCellBorders()
EndScript

Script SayFont ()
if !IsPCCursor()
|| GetWindowCategory() != WCAT_SPREADSHEET then
	PerformScript SayFont ()
	return
endIf
DescribeActiveCellFont()
EndScript

Script EditCell()
EnsureNoUserBufferActive()
CheckRTLReadingStatus()
SayCurrentScriptKeyLabel()
TypeKey(cksF2)
EndScript

Script EditingNote ()
EnsureNoUserBufferActive()
if EditCommentUsingJAWSDialog () then return endIf
SayCurrentScriptKeyLabel()
TypeKey(ksEditComment)
EndScript

void Function speakSmartHelpTypeInFormula()
	SayMessage (OT_smart_help, msg5_L, msg5_S) ;"type in the formula and press enter"
EndFunction

Script FormulaMode ()
TypeKey(ksEquals)
If OnSpreadSheet() then
	scheduleFunction("speakSmartHelpTypeInFormula",2)
else
	sayCurrentScriptKeyLabel()
endIf
EndScript

Script ReadCellNoteOrComment()
EnsureNoUserBufferActive()
ReadActiveCellNoteOrComment()
EndScript

Script readCellHyperlink ()
EnsureNoUserBufferActive()
SayActiveCellHyperlinkAddress()
EndScript

script SayCurrentCellValidationInputMessage()
EnsureNoUserBufferActive()
SayActiveCellValidationInputMessage()
EndScript

Script AutoSum ()
var
	int onFormulaBarUIA = onFormulaBarUIAEditItem(),
	string sStart, string sEnd,
	string sRange
EnsureNoUserBufferActive()
TypeKey(ksAltEquals) ;Used to autosum
delay(1, TRUE)
UpdateUIAFocusElementCache ()
If onFormulaBarUIA then
	sRange = getFocusUIAElementText ()
else
	sRange = GetSelectedText ()
	if StringSegmentCount (sRange, ":") < 2 then sRange = cscNull endIf
endIf
sRange = stringLower (sRange)
SayMessage(OT_smart_help,msg17_L) ;"Type in the range to Sum using colon to separate or"
if ! onFormulaBarUIA then ; speak from focusChange for all similar 2016 and later windows:
	sayMessage (OT_CHAR, sRange) ; keeps pitch from changing but user can hear the range as it's written.
endIf
EndScript

Script  DateStamp()
;inserts date in cell
typeCurrentScriptKey()
SayMessage(ot_screen_message,msg6_L, msg6_S) ;"Inserted date"
Delay(1,true)
SayLine()
EndScript

Script  TimeStamp()
;inserts time in cell
TypeCurrentScriptKey()
SayMessage(ot_screen_message,msg7_L, msg7_S) ;"Inserted time"
Delay(1,true)
SayLine()
EndScript

string function getActiveCellFormulaText ()
return GetWindowText (FindWindow (GetAppMainWindow (GetFocus ()), wcExcelLess), READ_EVERYTHING)
endFunction

void function PauseForEditingCellFormula()
var
	string sFormula,
	int count
sFormula = getActiveCellFormulaText ()
count = 1
while sFormula == getActiveCellFormulaText () && count <= 4
	delay(1)
	count = count + 1
EndWhile
EndFunction

Script SayFormula ()
Var
	String sFormula = GetActiveCellFormula ()

EnsureNoUserBufferActive ()
If ActiveCellIsFormulaCell()
	If IsSameScript ()
		SayMessage (OT_USER_BUFFER, sFormula)
		UserBufferAddText (cscBufferNewLine)
		SayMessage (OT_USER_BUFFER, cmsgBuffExit)
	Else
		ProcessMessage (sFormula, null (), OT_USER_REQUESTED_INFORMATION, cscNull, MB_OK | MB_ICONINFORMATION)
	EndIf
Else
	SayMessage (OT_JAWS_MESSAGE, msgNoFormula_L, msgNoFormula_S)

EndIf
EndScript

Script PostFormula ()
performScript SayFormula ()
endScript

Script SayCellNavigatedToInFormula()
EnsureNoUserBufferActive()
Var
	string sText,
	int iCount,
	int iPunctLevel
if onFormulaBarUIAEditItem()
	let iPunctLevel = GetJcFOption(opt_punctuation)
	let sText = GetWindowText(FindWindow(GetAppMainWindow(GetFocus()),wcExcelLess),read_everything)
	let iCount = StringSegmentCount(sText,scOperatorDelimiters)
	let sText = StringSegment(sText,scOperatorDelimiters,iCount)
	SetJcfOption(opt_punctuation,3)
	SayMessage(ot_user_requested_information,sText)
	SetJcfOption(opt_punctuation,iPunctLevel)
elIf onFormulaBarUIAEditItem() then
	let iPunctLevel = GetJcFOption(opt_punctuation)
	let sText = getFocusUIAElementText ()
	let iCount = StringSegmentCount(sText,scOperatorDelimiters)
	let sText = StringSegment(sText,scOperatorDelimiters,iCount)
	SetJcfOption(opt_punctuation,3)
	SayMessage(ot_user_requested_information,sText)
	SetJcfOption(opt_punctuation,iPunctLevel)
ElIf OnSpreadSheet() then
	SayCell()
Else
	PerformScript SayParagraph() ;default
EndIf
EndScript

string Function GetInsertFunctionHelp()
Var
	string smsg,
	int index,
	string sList
let sList = GetListOfObjects(GetFocus())
let index = StringSegmentCount(sList,list_item_separator)
let smsg = StringSegment(sList,list_item_separator,index-4)
let smsg = smsg+cscspace+StringSegment(sList,list_item_separator,index-3)
return smsg
EndFunction

string Function GetChartWizardChartTypeHelp ()
SaveCursor()
InvisibleCursor()
JAWSPageDown()
If FindString(GetCurrentWindow(),scSampleButton,s_top,s_unrestricted) then
	PriorWord()
ElIf FindString(GetCurrentWindow(),scSelectGroupbox,s_top,s_unrestricted) then
	NextLine()
	NextWord()
EndIf
If GetObjectSubtypeCode()==wt_static then
	return GetObjectName()
EndIf
RestoreCursor()
EndFunction

Script DisplayActiveChartInvirtualViewer ()
if !isChartActive() then
	sayFormattedMessage(ot_error,msgChartNotActiveError_l,msgChartNotActiveError_s)
	return
endIf
ReadActiveChart()
EndScript

Script SelectActiveChart ()
SelectActiveChart()
EndScript

Script ReportGridlineStatus()
EnsureNoUserBufferActive()
ReportGridlineStatus()
EndScript

Script ViewCustomSummary()
if !GetJcfOption(OPT_USE_CUSTOM_LABELS) then
	SayMessage(ot_error,msgCustomSummaryLabelsOptionError)
	return
endIf
ViewCustomSummary()
EndScript

Script ListRow ()
EnsureNoUserBufferActive ()
if isSameScript () then
	Return
endIf
ListRow()
EndScript

Script ListColumn ()
EnsureNoUserBufferActive ()
if isSameScript () then
	return
endIf
ListColumn()
EndScript

Script ListVisibleCellsWithData()
EnsureNoUserBufferActive()
ListVisibleCellsWithData()
EndScript

Script ListCellsWithFormulas()
EnsureNoUserBufferActive()
ListCellsWithFormulas()
EndScript

Script ListCellsWithNotes()
EnsureNoUserBufferActive()
ListCellsWithNotes()
EndScript

int function SelectALinkDialog()
if UserBufferIsActive() then
	SelectALinkDialog()
	return
endIf
SayMessage(OT_smart_help,msgCollectingLinks_l,msgCollectingLinks_s)
ListHyperlinks()
return true
EndFunction

Script SelectHyperlink()
SelectALinkDialog()
EndScript

int Function ProcessHyperLinkOnEnterKeyPress()
; if current cell has hyperlink, then activate it.
If ActiveCellHasHyperlinks()
|| ActiveCellHasHyperlinkFormula()
	SayCurrentScriptKeyLabel ()
	GotoHyperlink()
	Return TRUE
EndIf
Return FALSE
EndFunction

Script ListCellsAtPageBreaks()
EnsureNoUserBufferActive()
SayMessage (OT_smart_help, msg81_L) ; collecting cells at page breaks
ListCellsAtPageBreaks()
EndScript

Script ShowSmartTagList ()
EnsureNoUserBufferActive()
ListSmartTags()
EndScript

Script ShowTextboxContent ()
EnsureNoUserBufferActive ()
ShowTextboxContent()
EndScript

Script SelectWorksheetObjects ()
EnsureNoUserBufferActive()
SayMessage (OT_smart_help, msg83_L, msg83_S) ; please wait, collecting shapes
ListWorksheetObjects()
EndScript

Script CreatePrompt()
if !GetJcfOption(OPT_USE_CUSTOM_LABELS) then
	SayMessage(ot_error,msgCustomSummaryLabelsOptionError)
	return
endIf
if OnSpreadSheet() then
	manageCustomLabels ()
Else
	performScript CreatePrompt()
EndIf
EndScript

Script ListCellMarkers()
EnsureNoUserBufferActive ()
ListCellMarkers()
EndScript

script SetCellMarker()
var
	string sMarkerAddress,
	string sActiveAddress,
	int iButtonID
EnsureNoUserBufferActive()
let sMarkerAddress = getActiveCellMarker()
let sActiveAddress = GetActiveCellAddress()
if sMarkerAddress == sActiveAddress then
	SayMessage(ot_error,msgCurrentCellAlreadyDefinedAsCellMarker)
	return
elif sMarkerAddress then
	let iButtonId = ExMessageBox(FormatString(msgCellMarkerReplace,sMarkerAddress,sActiveAddress),cscNull,MB_YESNOCANCEL|MB_ICONWARNING)
	if iButtonId == idCancel
	|| iButtonId == idNo then
		return
	endIf
EndIf
if setCellMarker(GetActiveSheetName(), sActiveAddress) then
	SayFormattedMessage (OT_status,formatString(msgSetCellMarker,sActiveAddress))
	return
EndIf
EndScript

Script DefineATempPlaceMarker()
PerformScript SetCellMarker()
endScript

Script SpeakPlaceMarkers ()
PerformScript ReturnToCellMarkerInCurrentSheet ()
endScript

Script ReturnToCellMarkerInCurrentSheet()
EnsureNoUserBufferActive ()
If OnSpreadSheet() then
	MoveToCellMarkerOnCurrentSheet()
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	endIf
EndIf
EndScript

Script ReturnToNextCellMarker()
EnsureNoUserBufferActive ()
If OnSpreadSheet() then
	MoveToCellMarkerOnNextSheet()
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	endIf
endIf
EndScript

Script ReturnToPreviousCellMarker()
EnsureNoUserBufferActive ()
If OnSpreadSheet() then
	MoveToCellMarkerOnPriorSheet()
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	endIf
EndIf
EndScript

Script SetMonitorCells()
var
	String sNewMonitorCellAddress,
	String sOldMonitorCellAddress,
	int monitorCellNumber = StringToInt (StringRight (GetCurrentScriptKeyName (), 1)),
	int iButtonId
if getWindowCategory () != WCAT_SPREADSHEET then
	sayMessage (OT_ERROR, msgCantSetMonitorCells_L, msgCantSetMonitorCells_S)
	return
endIf
EnsureNoUserBufferActive ()
If Not monitorCellNumber then
	MonitorCellNumber = MaxMonitorCells
EndIf
let sOldMonitorCellAddress = GetMonitorCell(MonitorCellNumber)
let sNewMonitorCellAddress = getActiveSelectionRange ()
If sOldMonitorCellAddress then
	If sOldMonitorCellAddress == sNewMonitorCellAddress then
		ProcessMessage (msgCurrentCellAlreadyDefinedAsMonitorCell_l, msgCurrentCellAlreadyDefinedAsMonitorCell_s, OT_ERROR, msgError, mb_OK|MB_ICONERROR)
		Return
	EndIf
	let iButtonID = ExMessageBox (
		FormatString(msgMonitorCellReplace, sOldMonitorCellAddress,sNewMonitorCellAddress), msgMonitorCellAlreadyDefinedWarning, MB_YESNOCANCEL | MB_ICONWARNING)
	If iButtonID == IDNo
	|| iButtonID == IDCancel
		Return
	EndIf
EndIf
If Not SetMonitorCell (MonitorCellNumber)
	ProcessMessage (msgDocSettingsNotSaved1_L, msgDocSettingsNotSaved1_S, OT_ERROR, msgError, mb_OK|MB_ICONERROR)
	Return
EndIf
;Allowing for short and long messages in JAWS.
SayFormattedMessage(OT_STATUS,
	FormatString (msgSetNthMonitorCell1_L, IntToString (monitorCellNumber), sNewMonitorCellAddress),
	FormatString (msgSetNthMonitorCell1_S, IntToString (monitorCellNumber), sNewMonitorCellAddress))
EndScript

Script ReadMonitorCell ()
EnsureNoUserBufferActive()
var
	string sAddress,
	int monitorCellNumber
if GetWindowCategory() != WCAT_SPREADSHEET then
	ProcessMessage (msgMonitorCellInfoUnavailable,msgMonitorCellInfoUnavailable, OT_ERROR, msgError, mb_OK|MB_ICONERROR)
	return
endIf
let monitorCellNumber=stringToInt(stringRight(getCurrentScriptKeyName(),1))
if monitorCellNumber==0 then
	let monitorCellNumber = maxMonitorCells
endIf
let sAddress = getMonitorCell (monitorCellNumber)
if !sAddress then
	ProcessMessage (formatString(msgMonitorCellUndefined1_L,intToString(monitorCellNumber)),null (), OT_ERROR, msgError, mb_OK|MB_ICONERROR)
	return
endIf
readMonitorCell(sAddress)
endScript

script PostMonitorCell ()
performScript ReadMonitorCell ()
endScript

Script returnToStoredCell ()
EnsureNoUserBufferActive ()
If OnSpreadSheet() then
	returnFromMonitorCell()
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	endIf
EndIf
EndScript

Script moveToMonitorCell()
EnsureNoUserBufferActive()
if GetWindowCategory() != WCAT_SPREADSHEET then
	ProcessMessage (msgMonitorCellInfoUnavailable,msgMonitorCellInfoUnavailable, OT_ERROR, msgError, mb_OK|MB_ICONERROR)
	return
endIf
ListMonitorCells()
EndScript

int function HandleIncomingTeamsCall()
var
handle oldFocus=GetFocus()
TypeCurrentScriptKey()
Delay (5, false) ; Allow events to run.
if GetFocus()!=oldFocus then
	return true ; Another app processed the keystroke.
else
	return false ; No-one stole the focus.
endIf
endFunction

Script MoveToWorksheet()
EnsureNoUserBufferActive ()
if HandleIncomingTeamsCall() then
	return
endIf
ListWorksheets()
EndScript

Script ManageWorksheets()
EnsureNoUserBufferActive()
ManageWorksheets()
gbManagingWorksheetsFirstRun = TRUE
EndScript

void function ToggleExtendedSelectionModeHelper ()
If IsPCCursor()
&& OnSpreadSheet() then
	; Update cached status bar data to reflect change:
	UpdateStatusBarMode(GetStatusBarText(true))
	If IsExtendedSelectionMode() then
		SayFormattedMessageWithVoice(vctx_message,ot_help,msgExtendedSelectionModeOn_l,msgExtendedSelectionModeOn_s)
	Else
		SayFormattedMessageWithVoice(vctx_message,ot_help,msgExtendedSelectionModeOff_l,msgExtendedSelectionModeOff_s)
	EndIf
EndIf
endFunction

Script ToggleExtendedSelectionMode()
TypeKey(cksF8)
SayCurrentScriptKeyLabel()
ToggleExtendedSelectionModeHelper ()
EndScript

Script ToggleAddSelectedRangeOfCellsMode()
TypeKey(cksShiftF8)
SayCurrentScriptKeyLabel()
If IsPCCursor()
&& OnSpreadSheet() then
	; Update cached status bar data to reflect change:
	UpdateStatusBarMode(GetStatusBarText(true))
	If IsAddSelectedRangeOfCellsMode() then
		SayFormattedMessageWithVoice(vctx_message,ot_help,msgAddSelectionModeOn_l,msgAddSelectionModeOn_s)
	Else
		SayFormattedMessageWithVoice(vctx_message,ot_help,msgAddSelectionModeOff_l,msgAddSelectionModeOff_s)
	EndIf
EndIf
EndScript

Script UpALevel ()
If UserBufferIsActive() then
	;now regular handling of User buffer in case help is active
	SayCurrentScriptKeyLabel ()
	;If a chart is active then we want to focus active chart and
	;tell the user about it before deactivating the user buffer...
	If isChartActive() then
		;EscapeKey ()
		SayMessage (OT_JAWS_MESSAGE, msgActiveChartSelected_l, msgActiveChartSelected_s)
	EndIf
	If ExitUserBuffer() then
		if !HandleCustomWindows (GetFocus())
			SayFocusedWindow ()
		endIf
	EndIf
	;don't want to pass the Esc key on to the app.
	Return
ElIf IsPCCursor()
&& !InHJDialog() then
	; Update cached status bar data to reflect change:
	UpdateStatusBarMode(GetStatusBarText(true))
	If IsEditingComment() then
		EscapeKey ()
		escapeKey ()
		SayCurrentScriptKeyLabel ()
		delay (2)
		BrailleRefresh ()
		If IsAppObjInvalid ()
			;this happens if a comment edit area is active when the app gains focus.
			InitializeOExcel()
			AttachXLEvents()
		EndIf
		if CellReadingVerbosity() == readCellContentsAndCoordinates then
			SayActiveCellCoordinates()
		Endif
		RefreshCXLActiveCell()
		sayCell()
		Return
	elif InExcel2007OrLaterFunctionList() then
		;escape the function list and move focus to the formula bar
		EscapeKey()
		SayCurrentScriptKeyLabel()
		IndicateControlType(wt_edit,cmsgSilent,cmsgSilent)
		sayEditingCellFormula()
		return
	elif IsExtendedSelectionMode() then
		SayFormattedMessageWithVoice (VCTX_MESSAGE, OT_HELP, msgExtendedSelectionModeOff_l, msgExtendedSelectionModeOff_s)
		escapeKey ()
		return
	elif IsAddSelectedRangeOfCellsMode() then
		SayFormattedMessageWithVoice (VCTX_MESSAGE, OT_HELP, msgAddSelectionModeOff_l, msgAddSelectionModeOff_s)
		escapeKey ()
		return
	EndIf
EndIf
PerformScript UpALevel ()
EndScript

Script Enter ()
If IsPCCursor()
&& !InHJDialog()
&& !UserBufferIsActive()
&& !IsVirtualRibbonActive()
&& !GetMenuMode()
&& !DialogActive()
&& !InRibbons() then
	If ProcessHyperLinkOnEnterKeyPress ()
		Return
	EndIf
	if ShouldFireProtectedSheetEvent()
		EnterKey()
		ProtectedViewSheetChange()
		return
	endIf
EndIf
PerformScript Enter ()
EndScript

Script Tab()
if UserBufferIsActive()
|| InHJDialog ()
|| InRibbons ()
	PerformScript Tab()
	return
EndIf
If OnSpreadSheet() then
	SayCurrentScriptKeyLabel ()
	TabKey ()
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	endIf
	Return
endIf
var handle hFocus = GetFocus ()
if IsStatusBarToolbar (hFocus)
|| InOptionsDialog (hFocus) then
	PerformScript Tab ()
	Return
Endif
SayCurrentScriptKeyLabel ()
TabKey ()
EndScript

Script ShiftTab()
if UserBufferIsActive()
|| InHJDialog ()
|| InRibbons ()
	PerformScript ShiftTab()
	return
EndIf
If OnSpreadSheet() then
	SayCurrentScriptKeyLabel ()
	ShiftTabKey ()
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	endIf
	Return
endIf
var handle hFocus = GetFocus ()
if IsStatusBarToolbar (hFocus)
|| InOptionsDialog (hFocus) then
	PerformScript ShiftTab ()
	Return
Endif
SayCurrentScriptKeyLabel ()
ShiftTabKey ()
EndScript

Script NextDocumentWindow ()
Var
	Handle hFocus = GetFocus (),
	String sText
If hFocus == ghFormulaBar
	TypeKey (cksControlTab)
	Delay (1, TRUE)
	sText = StringDiff (GetWindowName(GetAppMainWindow(hFocus)), wn_mainApp)
	SayMessage (OT_DOCUMENT_NAME, sText)
	Return
EndIf
If DialogActive() then
	PerformScript NextDocumentWindowByPage ()
	Return
EndIf
PerformScript NextDocumentWindow ()
EndScript

Script PreviousDocumentWindow ()
Var
	Handle hFocus = GetFocus (),
	string sText
If hFocus == ghFormulaBar
	TypeKey (cksControlShiftTab)
	Delay (1, TRUE)
	sText = StringDiff (GetWindowName (GetAppMainWindow (hFocus)), wn_mainApp)
	SayMessage (OT_DOCUMENT_NAME, sText)
	Return
EndIf
If DialogActive() then
	PerformScript PreviousDocumentWindowByPage ()
	Return
EndIf
PerformScript PreviousDocumentWindow ()
EndScript

Script CopySelectedTextToClipboard ()
if !(GetRunningFSProducts() & product_JAWS) then
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	return
endIf
If IsPCCursor ()
&& (! UserBufferIsActive ())
&& (! InHJDialog ())
	If GetWindowCategory () == WCAT_SPREADSHEET
		If Not WillOverwriteClipboard ()
			Return
		EndIf
		ClipboardTextChanged = CLIPBOARD_COPIED
		CopySelectionToClipboard ()
		Return
	EndIf
EndIf
PerformScript CopySelectedTextToClipboard ()
EndScript

Script CutToClipboard ()
if !(GetRunningFSProducts() & product_JAWS) then
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	return
endIf
If IsPCCursor ()
&& (! UserBufferIsActive ())
&& (! InHJDialog ())
	If GetWindowCategory () == WCAT_SPREADSHEET
		If !WillOverwriteClipboard ()
			Return
		EndIf
		ClipboardTextChanged = Clipboard_Cut
		TypeKey (cksCut)
		Return
	EndIf
EndIf
If UserBufferIsActive ()
&& IsChartActive ()
	ExitUserBuffer ()
EndIf
PerformScript CutToClipboard ()
EndScript

Script AppendSelectedTextToClipboard ()
if !(GetRunningFSProducts() & product_JAWS) then
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	return
endIf
SayMessage (OT_ERROR, msgAppendToClipboardError_l, msgAppendToClipboardError_s)
EndScript

Script JAWSDelete()
If OnSpreadSheet() then
	TypeKey (cksDelete)
	return
EndIf
PerformScript JAWSDelete ()
if IsEditingComment() then
	refreshWindow (getFocus ())
EndIf
EndScript

script Delete ()
performScript JAWSDelete()
endScript

Script SayColor()
SayColor()
EndScript

Script SayAll()
If !UserBufferIsActive()
&& !IsVirtualPCCursor()
&& isPCCursor()
&& GetWindowCategory () == WCAT_SPREADSHEET
	SayMessage (OT_ERROR, msgSayAllError_l, msgSayAllError_s)
	Return
EndIf
PerformScript SayAll ()
EndScript

Script SayAllFromLocation ()
If !UserBufferIsActive()
&& !IsVirtualPCCursor()
&& isPCCursor()
&& GetWindowCategory () == WCAT_SPREADSHEET
	SayMessage (OT_ERROR, msgSayAllError_l, msgSayAllError_s)
	Return
EndIf
PerformScript SayAllFromLocation ()
endScript

script StartSkimRead ()
If !UserBufferIsActive()
&& !IsVirtualPCCursor()
&& isPCCursor()
&& GetWindowCategory () == WCAT_SPREADSHEET
SayMessage (OT_ERROR, msgSkimReadError_l, msgSkimReadError_s)
Return
EndIf
performScript StartSkimRead ()
endScript

void Function CursorShapeChangedEvent (string CursorType)
let GlobalCursorType = CursorType
If IsJAWSCursor () then
	If CursorType == CT_UNKNOWN then
		SayFormattedMessage (OT_CURSOR, msg16_L) ;"Cross hair cursor"
		Return
	endIf
	PerformScript SayCursorType ()
endIf
EndFunction

int function ShouldExitcellChangedEvent()
return ShouldExitcellChangedEvent()
|| GetObjectAutomationID () == "CellEdit"
endFunction

void function TableEnteredEvent(int nTblCols, int nTblRows, int nTblNesting, int nCurCol, int nCurRow, int bUniform, int bHasMarkedHeaders, int nHeadersColumn, int nHeadersRow )
if GetObjectAutomationID () == "CellEdit" then
; This event is getting called internally when it should not be.
	return
endIf
TableEnteredEvent(nTblCols, nTblRows, nTblNesting, nCurCol, nCurRow, bUniform, bHasMarkedHeaders, nHeadersColumn, nHeadersRow )
endFunction

void function SayWindowTitleForApplication(handle hAppWnd, handle hRealWnd, handle hCurWnd, int iTypeCode)
Var
	string sAppTitle,
	string sSheets,
	string sSheet,
	string sPaneTitle,
	int wCat,
	string sMsg_l,
	string sMsg_s
if DialogActive()
&& stringContains(GetWindowName(hRealWnd), wn_ChartWizard) then
	Say(GetWindowText(hRealWnd,true),ot_user_requested_information)
	return
EndIf
if UserBufferIsActive()
&& isChartActive() then
	sayFormattedMessage(ot_user_requested_information, formatString(msgChart1, GetActiveChartName()))
	return
endIf
GetAppUIAWindowAndPaneTitles(sAppTitle,sPaneTitle)
wCat = GetWindowCategory()
sSheet = GetActiveSheetName()
if wCat == WCAT_SPREADSHEET
	if SheetsAreGrouped()
		sSheets = GetGroupedSheetNames()
		sMsg_L = formatString(cMsg27_l,sAppTitle+cscSpace+sSheet+cscSpace+sSheets)
		sMsg_s = formatString(cmsg27_s,sAppTitle+cscSpace+sSheet+cscSpace+sSheets)
	else
		sMsg_L = FormatString(cMsg27_l,sAppTitle+cscSpace+sSheet)
		sMsg_s = formatString(cmsg27_s,sAppTitle+cscSpace+sSheet)
	endIf
elif (wCat != WCAT_UNKNOWN && wCat != WCAT_SPELL_CHECKER)
|| OnFileTabButton()
|| OnRibbonButton()
|| OnBackstageViewPane()
|| InNUIDialogWindow()
	if sPaneTitle
		sMsg_S = FormatString(cMsg29_S,sAppTitle,sPaneTitle)
		sMsg_L = FormatString (cmsg29_L,sAppTitle,sPaneTitle)
	endIf
endIf
if sMsg_S
|| sMsg_L
	SayFormattedMessage(ot_user_requested_information,sMsg_l,sMsg_s)
else
	SayWindowTitleForApplication(hAppWnd, hRealWnd, hCurWnd, iTypeCode)
endIf
EndFunction

Script SaySelectedText ()
var
	string sBrlSelectionAddress,
	string sBrlSelectedText
If OnSpreadSheet() then
	let sBrlSelectionAddress = getSelectionAddress ()
	let sBrlSelectedText = GetSelectedText (FALSE, FALSE)
	beginFlashMessage ()
	SayMessage (OT_USER_REQUESTED_INFORMATION, msgSelectedRange, msgSelectedRange)	; "selected range"
	ReadSelectedCells (False, True)
	brailleMessage (sBrlSelectionAddress+cscSpace, TRUE)
	BrailleMessage (sBrlSelectedText+cscSpace, TRUE)
	endFlashMessage ()
	Return
EndIf
PerformScript SaySelectedText ()
EndScript

Script SwitchPanes ()
SayCurrentScriptKeyLabel ()
TypeKey (ksSwitchPanes)	; F6 in English
If OnSlicer () then
	sayMessage (OT_CONTROL_NAME, msgSlicerPane)
	sayFocusedObject ()
	return
endIf
EndScript

Script SwitchPanesReverse ()
SayCurrentScriptKeyLabel ()
TypeKey (ksSwitchPanesReverse)	; Shift+F6 in English
If OnSlicer () then
	sayMessage (OT_CONTROL_NAME, msgSlicerPane)
	sayFocusedObject ()
	return
endIf
EndScript

void Function RightMouseButton ()
; following is a kludge to solve problem with RightMouse click causing JAWS to lose focus on chart in Excel XP.
; For case where user is on a chart and wants to handle the chart context options with a right mouse click in Excel XP:
If DisplayChartInvirtualViewer()
&& UserBufferIsActive()
&& !DialogActive() then
	UserBufferDeactivate ()
	TypeKey (ksChartMenu)
EndIf
RightMouseButton()
EndFunction

Void Function ReportNewAttributeState (Int nKey)
Var
	String sToolbarBtn
If GetWindowCategory () == WCAT_SPREADSHEET
	Return
endIf
If nKey == kiLeftCTRL2
|| nKey == kiRightCTRL2
	sToolbarBtn = BtnBold
ElIf nKey == kiLeftCtrl3
|| nKey == kiRightCtrl3
	sToolbarBtn = btnItalic
ElIf nKey == kiLeftCtrl4
|| nKey == kiRightCtrl4 then
	sToolbarBtn = btnUnderline
ElIf nKey == kiLeftCtrl5
|| nKey == kiRightCtrl5 then
	sToolbarBtn = btnStrikethrough
EndIf
If Not StringIsBlank (sToolbarBtn)
	ReportFontStatus(sToolbarBtn)
EndIf
EndFunction

void function ToggleEditFont(string sKey, string sBtnText, string sBtnName)
var
	object UIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest"),
	object treewalker,
	object element, object NameCondition, object ClassCondition, object AndCondition, object pattern,
	int state
TypeKey(sKey)
Delay(3, TRUE)
; control type condition will already be accounted for
NameCondition = UIA.CreateStringPropertyCondition( UIA_NamePropertyId, sBtnText)
ClassCondition = UIA.CreateStringPropertyCondition( UIA_ClassNamePropertyId, "NetUIRibbonButton")
AndCondition = UIA.CreateAndCondition (NameCondition, ClassCondition)
treewalker = CreateUIATreeWalkerForFocusProcessId (AndCondition, FALSE)
element = treewalker.CurrentElement
pattern = element.GetTogglePattern()
if pattern.ToggleState  then
	SayFormattedMessage(ot_item_state,formatString(cmsg240_L,sBtnName), cmsgOn)
else
	SayFormattedMessage(ot_item_state,formatString(cmsg241_L,sBtnName), cmsgOff)
EndIf
EndFunction

Script BoldText()
if onFormulaBarUIAEditItem()
	ToggleEditFont(ksBold,sc_Bold,btnBold)
else ;report the new toggled status of the button on the tool bar:
	TypeKey(ksBold)
	pause()
	ReportFontStatus(btnBold)
EndIf
EndScript

Script ItalicText()
if onFormulaBarUIAEditItem()
	ToggleEditFont(ksItalic,sc_italic,btnItalic)
else ;report the new toggled status of the button on the tool bar:
	TypeKey(ksItalic)
	pause()
	ReportFontStatus(btnItalic)
EndIf
EndScript

Script UnderlineText()
if onFormulaBarUIAEditItem()
	ToggleEditFont(ksUnderline,sc_Underline,btnUnderline)
else ;report the new toggled status of the button on the tool bar:
	TypeKey(ksUnderline)
	pause()
	ReportFontStatus(btnUnderline)
EndIf
EndScript

Script ToggleBrlReadingMode()
SayFormattedMessage(ot_status,ToggleBrlStructuredMode(FALSE))
EndScript

string function UIAGetSuggestionFromList (string ControlName)
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
var object startElement = FSUIAGetElementFromHandle (getParent (getFocus ()))
var object condition = FSUIACreateStringPropertyCondition (UIA_NamePropertyId, ControlName)
var object list = FindUIAElementOfType (UIA_ListControlTypeId, StartElement, Condition)
var string value = list.GetValuePattern().value
if stringIsBlank (value) then value = noSelectedItem endIf
return value
endFunction

int Function SpellCheck(handle hWnd)
if (!stringContains (getWindowName (getRealWindow (hwnd)), wn_Spelling)) return FALSE endIf
if (isMultipageDialog()) return FALSE endIf
var	object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
var object oWindow = oUIA.GetElementFromHandle(GetRealWindow(GetFocus()))
var object condition = oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_EditControlTypeId) 
var object element = oWindow.FindFirst(TreeScope_SubTree,condition)
if !element return false endIf
var string prompt = element.name
var string item = element.GetValuePattern().value
if !prompt || !item return false endIf
sayMessage (OT_CONTROL_NAME, prompt)
sayMessage (OT_DIALOG_TEXT, Item)
spellString (Item)
;Now for the suggestion:
var string sBrlMSG
condition = oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_ListControlTypeId) 
element = oWindow.FindFirst(TreeScope_SubTree,condition)
prompt = element.name
item = element.GetValuePattern().value
if !prompt
|| stringIsBlank (item)
	SayMessage(ot_error,"msgNoSpellingSuggestions1_L,msgNoSuggestions1_L")
	sBrlMSG = sBrlMSG + msg14_L
	BrailleMessage (sBrlMSG)
	return true
endIf
indicateControlType (wt_ListBox, prompt,item)
spellString(item)
sBrlMSG = sBrlMSG + prompt + cscSpace + item
BrailleMessage (sBrlMSG)
return true
endFunction

int function ShouldReEvaluateWindowCategoryType(handle hWnd)
if hwnd != ghCategoryWnd return true endIf
;When moving between the cell edit and the spread sheet,
;or from the sheet to the sheet tabs,
;the window handle does not change.
;But, we don't want the cell edit nor the sheet tab to be evaluated as the spreadsheet:
var
	string automationID = GetObjectAutomationID(),
	int type = GetObjectSubtypeCode()
;the following tests must occur in the specified order:
if (automationID == AutomationID_CellEdit) return giWndCategoryType == WCAT_SPREADSHEET endIf
if (type == wt_TabControl) return giWndCategoryType == WCAT_SPREADSHEET endIf
if (getWindowClass(hwnd) == wc_Spreadsheet) return giWndCategoryType != WCAT_SPREADSHEET endIf
EndFunction

int function FindWindowCategoryType(handle hWnd)
if IsStandardUnknownWindowCategoryType(hwnd)
	giWndCategoryType = WCAT_UNKNOWN
	return giWndCategoryType
endIf
if GetObjectAutomationID() == AutomationID_CellEdit
	giWndCategoryType = wCat_Unknown
	return giWndCategoryType
endIf
if getWindowClass (hwnd) == cwc_NetUIHwnd then
	if FindWindowCategoryType(hWnd) == WCAT_STATUSBAR_TOOLBAR then
		giWndCategoryType = WCAT_STATUSBAR_TOOLBAR
		return giWndCategoryType
	else
		giWndCategoryType = WCAT_UNKNOWN ; norlam dialog for Options.
		return giWndCategoryType
	Endif
endIf
If StringContains (GetWindowName (GetParent (hWnd)), wn_Spelling)
|| StringContains (GetWindowName (GetRealWindow (hWnd)), wn_Spelling)
|| StringContains (GetWindowName (hWnd), wn_Spelling) then
	giWndCategoryType = WCAT_SPELL_CHECKER
	Return giWndCategoryType
EndIf
Return FindWindowCategoryType(hWnd)
endFunction

Script SpellCheck ()
Var
	Handle hFocus = GetFocus (),
	Handle hParent = GetParent (hFocus),
	String sPrompt
If GetWindowCategory () != WCAT_SPELL_CHECKER
	If !DialogActive()
	&& !MenusActive() then
		PerformScript SelectHyperLink ()
		Return
	EndIf
	SayMessage (OT_ERROR, msg15_L)	;"Not in spell checker"
	Return
EndIf
If GetWindowCategory () == WCAT_TASK_PANE	; we are in task pane...
	SayMessage (OT_ERROR, msgTaskPaneLinkError_l, msgTaskpaneLinkError_s)
	Return
EndIf
; check for spellcheck completion dialog as this does not have the spelling same window name.
If GetWindowClass (hParent) == cwc_dlg32770
	Return
EndIf
SpellCheck(hFocus)
EndScript

handle Function FindFilterWindow ()
; this window will be at the same level as the app main window,
;and will be prior to the window.
;We do not know how many movements left to make,
;so we try three times to find the window.
Var
	Handle hWnd = GetPriorWindow (GetAppMainWindow (GetFocus ()))
If GetWindowClass (hWnd) == wcExcelColon then
	Return (hWnd)
Else
	hWnd = GetPriorWindow (hWnd)
	If GetWindowClass (hWnd) == wcExcelColon
		Return (hWnd)
	Else
		hWnd = GetPriorWindow (hWnd)
		If GetWindowClass (hWnd) == wcExcelColon
			Return (hWnd)
		EndIf
	EndIf
EndIf
Return (Null ())
EndFunction

Script OpenListBox ()
Var
	Handle hFilter
If IsPCCursor() then
	; Handle filter Combo boxes in data sheet
	If OnSpreadSheet()
	|| onFormulaBarUIAEditItem() then
		TypeKey (cksAltDownArrow)
		Pause ()
		hFilter = FindFilterWindow ()
		If hFilter
			SetFocus (hFilter)
		EndIf
		Return
	EndIf
EndIf
PerformScript OpenListBox ()
EndScript

Script CloseListBox ()
Var
	Handle hFilter
If IsPCCursor() then
	; Handle filter Combo boxes in data sheet
	If OnSpreadSheet()
	|| onFormulaBarUIAEditItem()
		TypeKey (cksAltUpArrow)
		Pause ()
		hFilter = FindFilterWindow ()
		If hFilter
			SetFocus (hFilter)
		EndIf
		Return
	EndIf
EndIf
PerformScript CloseListBox ()
EndScript

string Function GetDiagramGalleryHelp()
Var
	string smsg,
	int index,
	string sList
let sList = GetListOfObjects(GetFocus())
let index = StringSegmentCount(sList,list_item_separator)
let smsg = StringSegment(sList,list_item_separator,index-2)
let smsg = smsg+cscSpace+StringSegment(sList,list_item_separator,index-3)
return smsg
EndFunction

void Function SayDiagramGalleryObject(handle hwnd)
Var
	String sText,
	int index
	;only need to speak for organization chart
let sText = GetListOfObjects(hwnd)
let index = StringSegmentCount(sText,list_item_separator)
let sText = StringSegment(sText,list_item_separator,index-3)
if sText == sc_organizationChart
	sayMessage(ot_highlighted_screen_text,sText)
	SayMessage(ot_help,GetDiagramGalleryHelp())
EndIf
EndFunction

int function F2TogglesBetweenEditModeAndPointMode()
var
	handle hWnd,
	string sClass,
	int iWinSubtype,
	int iObjType,
	string sObjName,
	string sDlgName,
	string sdlgPage = getDialogPageName ()
hWnd = GetFocus()
sClass = GetWindowClass(hwnd)
iWinSubtype = GetWindowSubtypeCode(hwnd)
iObjType = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
sObjName = GetObjectName(SOURCE_CACHED_DATA)
If (sClass == wcEDTBX
&& StringContains(GetWindowClass(GetParent(hwnd)),wc_sdm))
|| StringContains(sClass,wc_bosa_sdm)
&& iObjType==wt_edit  then
	sDlgName = GetDialogPageName()
	if (StringContains(sDlgName,wn_DataRangePage)
	|| StringContains(sDlgName,wn_SeriesPage)
	|| StringContains(globalRealWindowName,wn_ChartWizard)
	|| ((StringContains(globalRealWindowName,wn_DefineName)
	&& sObjName==wn_RefersTo)
	|| (StringContains(globalRealWindowName,wn_dataValidation)
	&& sObjName==wn_StartDate
	|| sObjName==wn_EndDate
	|| sObjName==wn_StartTime
	|| sObjName==wn_EndTime
	|| sObjName==wn_Minimum
	|| sObjName==wn_maximum
	|| sObjName==wn_Source
	|| sObjName==wn_Formula
	|| sObjName==wn_Value)
	&& iWinSubType!=wt_editCombo)) then
		return true
	endIf
endIf
return false
EndFunction

String Function GetCustomTutorMessage ()
Var
	Handle hFocus = GetFocus (),
	String sClass = GetWindowClass (hFocus),
	Int iObjectType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
If OnSpreadSheet()
&& ActiveCellHasValidationInputMessage() then
	Return (GetInputMessageTutorHelp ())
ElIf GetWindowCategory () == WCAT_SDM then
	; we are in an SDM dialog
	If GetWindowSubtypeCode (hFocus) == WT_TOOLBAR
		; we are on a toolbar control within an sdm dialog.
		; these controls are activated by down-arrow, not spacebar.
		; so we have to force a custom message.
		If StringContains(sClass, wc_MsoCommandBar)
		&& iObjectType == WT_BUTTON
			Return FormatString(cmsgScreenSensitiveHelp1_L)
		elif iObjectType == wt_listBoxItem && GetFocusChangeDepth() > 0 && globalRealWindowName== wn_FormatCells then
			return FormatString(cmsgScreenSensitiveHelp23_L)
		elif iObjectType == wt_listBoxItem && GetFocusChangeDepth() == 0 && globalRealWindowName== wn_FormatCells then
			return cScSpace
		elif iObjectType == wt_listBoxItem then
			return msgListBox
		EndIf
		Return FormatString(cmsgScreenSensitiveHelp23_L)
	EndIf
	If F2TogglesBetweenEditModeAndPointMode()
		Return (msgF2ToggleTutorHelp)
	EndIf
EndIf
Return (GetCustomTutorMessage ())
EndFunction

Script ScreenSensitiveHelp ()
var
	string sClass,
	string sWindowName,
	int iSubtype,
	handle hwnd
if IsSameScript () then
	AppFileTopic(topic_Excel)
	return
endIf
; Temporarily allow virtual viewer to display on-screen
SetJCFOption(OPT_VIRT_VIEWER,1)
If UserBufferIsActive () then
	UserBufferDeactivate ()
	If HasCustomLabels(GetActiveSheetName())
	&& GetJcfOption(OPT_USE_CUSTOM_LABELS) then
		sayMessage(ot_user_buffer,msgScreenSensitiveHelpCustomSummaryView)
		SetJCFOption(OPT_VIRT_VIEWER,0)
		Return
	EndIf
	if !IsChartActive() then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
		SetJCFOption(OPT_VIRT_VIEWER,0)
		Return
	EndIf
	If DisplayChartInVirtualViewer ()
		SayFormattedMessage (OT_USER_BUFFER, msgChartExitXLXPScreenSensitiveHelp)
	Else
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	EndIf
	SetJCFOption(OPT_VIRT_VIEWER,0)
	Return
EndIf
if ScreenSensitiveHelpForOffice() then
	SetJCFOption(OPT_VIRT_VIEWER,0)
	Return
EndIf
let sClass = GetWindowClass (GetCurrentWindow ())
let sWindowName = GetWindowName(GetFocus())
if StringContains(globalRealWindowName,wn_Summary )
&& DialogActive() then
	let iSubtype = GetWindowSubtypeCode(GetFocus())
	screenSensitiveHelpCustomSummary(sWindowName,iSubType)
Elif globalRealWindowName==wn_diagramGallery
&& GetObjectSubtypeCode(SOURCE_CACHED_DATA)==wt_listboxItem then
	sayMessage(ot_user_buffer,msgScreenSensitiveHelpDiagramGallery_l,msgScreenSensitiveHelpDiagramGallery_s)
	sayMessage(ot_user_buffer,cscBufferNewLine)
	sayMessage(ot_user_BUFFER,cmsgBuffExit)
elif GlobalMenuMode == MENUBAR_ACTIVE then
	ScreenSensitiveHelpForKnownClasses (WT_COMMANDBAR)
elif GlobalMenuMode == MENU_ACTIVE then
	ScreenSensitiveHelpForKnownClasses (wt_menu)
elif dialogActive() then
	PerformScript ScreenSensitiveHelp ()
else
	ExcelScreenSensitiveHelp()
endIf
SetJCFOption(OPT_VIRT_VIEWER,0)
EndScript

int Function ExcelHotKeyHelp ()
var
	String strPage
;Temporarily allow display of virtual viewer on-screen
SetJCFOption(OPT_VIRT_VIEWER,1)
if UserBufferIsActive() then
	UserBufferDeactivate()
else
	UserBufferClear()
	UserBufferActivate()
EndIf
if globalRealWindowName== wn_Spelling
|| GetWindowName (GetParent (getFocus())) == wn_Spelling then
	SayMessage (OT_USER_BUFFER, msgXLHotkeyHlp1_L, msgXLHotkeyHlp1_S)
	SetJCFOption(OPT_VIRT_VIEWER,0)
	Return true
elif stringContains(globalRealWindowName, wn_ChartWizard) then
	SetJCFOption(OPT_VIRT_VIEWER,0)
	return true
elif globalRealWindowName== wn_FormatCells then
	let strPage = GetDialogPageName ()
	;wn_Number = "Number"
	if strPage == wn_Number then
		SayMessage (OT_USER_BUFFER, msgXLHotkeyHlp2_L, msgXLHotkeyHlp2_S)
	;wn_Alignment = "Alignment"
	elif strPage == wn_Alignment then
		SayMessage (OT_USER_BUFFER, msgXLHotkeyHlp3_L, msgXLHotkeyHlp3_S)
	;wn_Font = "Font"
	elif strPage == wn_Font then
		SayMessage (OT_USER_BUFFER, msgXLHotkeyHlp4_L, msgXLHotkeyHlp4_S)
	;wn_Border = "Border"
	elif strPage == wn_Border then
		SayMessage (OT_USER_BUFFER, msgXLHotkeyHlp5_L, msgXLHotkeyHlp5_S)
	;wn_Patterns = "Patterns"
	elif strPage == wn_Patterns then
		SayMessage (OT_USER_BUFFER, msgXLHotkeyHlp6_L, msgXLHotkeyHlp6_S)
	;wn_Protection = "Protection"
	elif strPage == wn_Protection then
		SayMessage (OT_USER_BUFFER, msgXLHotkeyHlp7_L, msgXLHotkeyHlp7_S)
	endIf
	SetJCFOption(OPT_VIRT_VIEWER,0)
	return TRUE
elif globalRealWindowName==wn_open then
	SayMessage (OT_USER_BUFFER, msgHotkeyHelpOpen_L,msgHotkeyHelpOpen_S)
	; save as and open use same msgs_L here
	SayMessage (OT_USER_BUFFER,msgHotkeyHelpFilesDlg_L,msgHotkeyHelpFilesDlg_S)
	SetJCFOption(OPT_VIRT_VIEWER,0)
	return true
elif globalRealWindowName==wn_saveAs then
	SayMessage (OT_USER_BUFFER,msgHotkeyHelpSave_L,msgHotkeyHelpSave_S)
	SayMessage (OT_USER_BUFFER,msgHotkeyHelpFilesDlg_L,msgHotkeyHelpFilesDlg_S)
	SetJCFOption(OPT_VIRT_VIEWER,0)
	return true
else
	SetJCFOption(OPT_VIRT_VIEWER,0)
	return FALSE
endIf
EndFunction

Script HotKeyHelp ()
; Clears and sends new help message to user buffer
var
	string sRealName
if TouchNavigationHotKeys() then
	return
endIf
; Temporarily allow virtual viewer to display on-screen
SetJCFOption(OPT_VIRT_VIEWER,1)
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
UserBufferActivate()
let sRealName = GetWindowName(GetRealWindow(GetFocus()))
;wc_sdm="_sdm_"
if stringContains(getWindowClass(GetRealWindow(GetFocus())),wc_sdm) then
	;take care of some known problematic dialogs.  If it is not problematic, then
	ExcelHotKeyHelp()
	userBufferAddText(cscBufferNewLine)
	sayMessage(ot_user_buffer,cmsgBuffExit)
	SetJCFOption(OPT_VIRT_VIEWER,0)
	return
Else
	if isChartActive() then
		sayMessage (OT_USER_BUFFER, msgXLHotkeyHlpChartActive+cscBufferNewLine)
		SayMessage (OT_USER_BUFFER, msgHotkeyHelp1_L, msgHotkeyHelp1_S)
		userBufferAddText(cscBufferNewLine)
		sayMessage(ot_user_buffer,cmsgBuffExit)
		SetJCFOption(OPT_VIRT_VIEWER,0)
		return
	endIf
	SayFormattedMessage(OT_USER_BUFFER, msgHotkeyHelpExcel365+cscBufferNewLine)
	AddAskFSCompanionHotKeyLink()
	sayMessage(ot_user_buffer,cscBufferNewLine+cmsgBuffExit)
	SetJCFOption(OPT_VIRT_VIEWER,0)
endIf
EndScript

Script  WindowKeysHelp()
; Clears and sends new help message to user buffer
; Temporarily allow virtual viewer to display on-screen
SetJCFOption(OPT_VIRT_VIEWER,1)
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
var string messageLong, string messageShort, string OfficeQuickHelp = cmsgWindowKeysHelpOfficeQuickSearch+cscBufferNewLine
MessageLong = OfficeQuickHelp+msgWinKeysHelp1_L
MessageShort = OfficeQuickHelp+msgWinKeysHelp1_S
SayFormattedMessage (OT_USER_BUFFER, MessageLong, MessageShort)
UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
SetJCFOption(OPT_VIRT_VIEWER,0)
EndScript

script FindDlgKey()
TypeKey(ksFindDlg)
SayCurrentScriptKeyLabel()
; Announce the Find page when the hotkey (Alt+D, English) is used:
if GlobalRealWindowName==wn_FindAndReplace then
	SayMessage(ot_dialog_name,msgFindPage)
EndIf
EndScript

script ReplaceDlgKey()
TypeKey(ksReplaceDlg)
SayCurrentScriptKeyLabel()
; Announce the Replace page when the hotkey (Alt+P, English) is used:
if GlobalRealWindowName==wn_FindAndReplace then
	SayMessage(ot_dialog_name,msgReplacePage)
EndIf
EndScript

Script CloseOfficeAssistant ()
CloseOfficeAssistant ()
EndScript

Void Function SayWindowTypeAndText (Handle hWnd)
If GetWindowCategory () == WCAT_MESSAGE
	Return
EndIf
SayWindowTypeAndText (hWnd)
EndFunction

int function SayCellUnit(int UnitMovement)
let LastTableNavTime = getTickCount()
return SayCellUnit(UnitMovement)
EndFunction

Void Function SpeakTableCells (int tableNavDir, int nPrevNumOfCells)
if TableErrorEncountered(tableNavDir) then
	Return
EndIf
if OnSpreadSheet() then
	;do not process all the extra default code, which is irrelevant here.
	SayCellEx()
else
	SpeakTableCells (tableNavDir, nPrevNumOfCells)
EndIf
EndFunction

Script JAWSPageUp()
if OnSpreadSheet() then
	SayCurrentScriptKeyLabel()
	JAWSPageUp()
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	endIf
	return
EndIf
PerformScript JAWSPageUp()
EndScript

script PageUp ()
performScript JAWSPageUp()
endScript

Script JAWSPageDown()
if OnSpreadSheet() then
	SayCurrentScriptKeyLabel()
	JAWSPageDown()
	if ShouldFireProtectedSheetEvent()
		ProtectedViewSheetChange()
	endIf
	return
EndIf
PerformScript JAWSPageDown()
EndScript

script PageDown ()
performScript JAWSPageDown()
endScript

script JAWSHome()
PerformScript JAWSHome()
if ShouldFireProtectedSheetEvent()
	ProtectedViewSheetChange()
endIf
EndScript

script Home ()
performScript JAWSHome()
endScript

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
if (iObjType == wt_listboxitem && getObjectName(SOURCE_CACHED_DATA,1) == scCategories) then
	return
endIf
if GetObjectClassName() == UIAClass_sysTreeview32
&& GetObjectSubtypeCode() == wt_checkbox
	SayFocusedTreeviewThreeWayCheckboxState()
	return
endIf
ObjStateChangedEvent(hObj,  iObjType, nChangedState, nState, nOldState)
EndFunction

void function ProcessSayRealWindowOnFocusChange (handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
var
	int iWCAT = getWindowCategory ()
if iWCAT  != giPrevWCat
	giPrevWCat = iWCAT 
	if iWCAT == WCAT_STATUSBAR_TOOLBAR
		SayFormattedMessage (ot_help, msgStatusBarToolbar)
		return
	elIf OnSlicer ()
		sayMessage (OT_CONTROL_NAME, msgSlicerPane)
		return
	endIf
	if iWCAT == WCAT_SPREADSHEET
	|| GetWindowClass(FocusWindow) == wcChartClass
		If IsAppObjInvalid ()
			InitializeOExcel()
			if !IsUsingExcelEvents()
				;XLWorkbookActivatedEvent announces the app and workbook:
				XLWorkbookActivatedEvent()
			endIf
		EndIf
		return
	endIf
endIf
ProcessSayRealWindowOnFocusChange (AppWindow, RealWindow, RealWindowName, FocusWindow)
endFunction

Script RecalculateSpreadsheet ()
TypeKey (cksF9)
SayCurrentScriptKeyLabel ()
if OnSpreadsheet () then
;No events go off when this happens.
	Delay (2)
	UpdateCXLActiveSheet () ; noncontinguous cells may have been updated.
	UpdateCXLActiveCell ()
	ReadSelectedCells()
	BrailleRefresh ()
EndIf
endScript

Script AltF4 ()
ReleaseEditInterfaces()
excelFunc::UnloadAllExcelObjectsData ()
TypeCurrentScriptKey ()
SayCurrentScriptKeyLabel ()
EndScript

void function DoBackSpace()
;Avoid tendancy for UIA calls in default to sometimes cause excessive delay time before announcing the deletion:
If !IsVirtualPcCursor ()
&&	GetObjectAutomationID() == AutomationID_CellEdit
&& GetObjectIsEditable() == true
	var int bRestore
	if CURSOR_PC != GetActiveCursor()
		bRestore = TRUE
		SaveCursor ()
		PCCursor ()
	endIf
	var
		string strChar,
		int containsMarkup
	GetCharacterInfoForBackSpace(strChar,ContainsMarkup)
	TypeKey (cksBackspace)
	Say(strChar, OT_CHAR, containsMarkup)
	if bRestore then
		RestoreCursor ()
	endIf
	return
endIf
DoBackSpace()
endFunction

int function ShouldIncludeView(string viewName)
; In Excel, if not using the classic scripts, i.e. the base name is Excel, ignore excelClassic views. 
;Note if this file is executing then this is already true.
if viewName == cExcelClassicJBSBase then
	return false
endIf
return ShouldIncludeView(viewName)
endFunction

script VirtualizeCurrentControl()
if !OnSpreadsheetCell()
	PerformScript VirtualizeCurrentControl()
	return
endIf
var
	int level = GetObjectClassName (1) == UIAClass_XLSpreadsheetCell,
	string sText = GetObjectValue (SOURCE_DEFAULT, level)
if !sText then
	SayMessage(OT_ERROR,cmsgNoTextToVirtualize_L,cmsgNoTextToVirtualize_S)
	return
endIf
SayMessage(ot_JAWS_Message,cmsgVirtualizeControl_L,cmsgVirtualizeControl_S)
UserBufferClear()
UserBufferAddText(sText)
UserBufferActivate()
SayLine()
endScript

;Copyright 1995-2021 Freedom Scientific, Inc.
; Freedom Scientific script file for Microsoft Internet Explorer

import "virtual.jsd" ; expose function declarations for the Virtual Cursor
import "UIA.jsd"
use "IECustomSettings.jsb"
use "FlexibleWeb.jsb"

include "ie.jsh"
include "ie.jsm"
include "HjHelp.jsh"
include "hjconst.jsh"
include "hjglobal.jsh"
include "ieCustomSettings.jsh"
include "UIA.jsh"
include "common.jsm"
include "touch.jsm"
include "Winstyles.jsh";style bits:
include "MSAAConst.jsh"
include "acrobat.jsh"

Globals
	int giCustomLVItemSpoken,
	int giTabKeyPressed,
	int gICheckByActiveItem,
	int giDocumentNameSpokenByPageChanged,
	int gbVerbosityOptionSet,
	handle GlobalAppWindow,
	handle GlobalTopWindow,
	handle GlobalPrevTop,
	int gbVistaControlPanelShellViewChanged,
	string gsCachedName,
	string gsCachedGroupName,
	int gbInToolBar,
	int giLastSelectionSpoken,
	string gsPriorTableName,
	int g_iVirtualMSAARefreshRate,
	int gbIsMetroApp,
	int gbIsImeActive,
	int gbLastFocusChangeWithInCombo,
	int prevGridRow,
	int prevGridCol

;for the IE10 Windows 8 tiles showing visited sites:
globals
	collection c_VisitedLocationData

;for view Downloads dialog:
;in addition to knowing the window handle and the change depth on when focus changes,
;we must also be able to distinguish the difference between moving to a list item
;and moving through list items or the list item descendants.
globals
	int g_tracked_PrevObjectType

;For detecting tab page changes:
const
	UIA_IE_EventNamePrefix = "UIAIE",
	DetectNewTabPageOnSelectionChange_Delay = 10,  ;time to wait after the automation event before determining whether this is a new tab page or new browser instance
	InitTabRowListener_Delay = 10,  ;Time to wait in AutoStart to ensure the listener is initialized
	UpdateTabRowDataForAppWindow_Delay = 10  ;time to wait after closing the document window to update the tab row data with the app window handle.
globals
	int ScheduledDetectNewTabPageOnSelectionChangeID,
	int ScheduledInitTabRowListenerID,
	int ScheduledUpdateTabRowDataForAppWindowID,
	object UIA_IE, ;IE global UIA event listener
	collection c_TabRowData
		; Members are:
		;
		; ready -- True if the tab row listener is ready.
		; selectedTab --The selected tab item element.
		; AppWnd -- The handle of the current instance of the IE browser.
		; TabRowTab -- The tab element which is the parent of the tab row tab items.
		; prevTabCount -- The prior count of tabs when attempting to determine if this is a new tab.
		;		This is necessary because the automation event may fire many times when the browser opens.


void Function AutoStartEvent ()
if StringContains(GetWindowName(GetAppMainWindow(GetCurrentWindow())),WN_LIBERA) then
   SwitchToConfiguration (CONFIG_LIBERA)
   return
EndIf
let gbIsImeActive = FALSE
let IEVersion = GetIEVersion()
let gbIsMetroApp = IsMetroApp()
let nSuppressEcho = FALSE
Let gICheckByActiveItem = FALSE
let giTrustChkBx  = FALSE
let giTabKeyPressed  = FALSE
let g_iVirtualMSAARefreshRate = GetJCFOption (OPT_VIRTUAL_MSAA_REFRESH_RATE)
let gbLastFocusChangeWithInCombo = false
let prevGridRow = -1
let prevGridCol = -1
If ! isIEFirstTime then
	Let isIEFirstTime = 1
EndIf
CustomSettingsStart ();For Personalized Settings
loadApplicationSettings()
if gbSwitchingConfiguration then
	let gbSwitchingConfiguration = false
	FocusChangedEvent(GetFocus(),GlobalPrevFocus)
EndIf
loadNonJCFOptions ()
ScheduledInitTabRowListenerID = ScheduleFunction("InitTabRowListener",InitTabRowListener_Delay)
EndFunction

void Function AutoFinishEvent ()
var
	handle hNull
let globalLastIEWindow = hNull
let gsMostRecentRSSFeedPage = cscNull
RestrictCursor (off)
SetJCFOptionsWithGlobals ();For Personalized settings
let bWereCustomSettingsLoaded=FALSE
Let gICheckByActiveItem = FALSE
TurnOffFormsMode(GetRunningFSProducts() == product_magic)
if c_VisitedLocationData then
	ClearVisitedLocationData()
EndIf
UIA_IE = Null()
c_TabRowData = Null()
if ScheduledInitTabRowListenerID
	UnscheduleFunction(ScheduledInitTabRowListenerID)
	ScheduledInitTabRowListenerID = 0
endIf
if ScheduledUpdateTabRowDataForAppWindowID
	UnscheduleFunction(ScheduledUpdateTabRowDataForAppWindowID)
	ScheduledUpdateTabRowDataForAppWindowID = 0
endIf
EndFunction

int function InitUIAIE(optional int ForceNewinitialization)
if (ForceNewinitialization) UIA_IE = Null() endIf
if UIA_IE return true endIf
UIA_IE = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest")
if !UIA_IE return false endIf
if !ComAttachEvents(UIA_IE,UIA_IE_EventNamePrefix )
	UIA_IE = Null()
	return false
endIf
return true
EndFunction

object function GetTabRowTabElement()
if !UIA_IE return Null() endIf
;IE uses a different process ID for the app window and window controls than it does for the focused page:
var object WindowElement = UIA_IE.GetElementFromHandle( GetTopLevelWindow(GetFocus()) )
if !WindowElement 
|| windowElement.className != IEFrameClass
	return Null()
endIf
var object processCondition = UIA_IE.CreateIntPropertyCondition( UIA_ProcessIdPropertyId, WindowElement.ProcessID)
var object tabPaneCondition = UIA_IE.CreateAndCondition(
	UIA_IE.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_PaneControlTypeId),
	UIA_IE.CreateStringPropertyCondition(UIA_ClassNamePropertyId,"TabBandClass"))
var object paneElement = WindowElement.FindFirst(TreeScope_Descendants,tabPaneCondition)
if !paneElement return Null() endIf
var object tabRowCondition = UIA_IE.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_TabControlTypeId)
return paneElement.FindFirst(TreeScope_Descendants,tabRowCondition)
EndFunction

void function InitTabRowListener()
ScheduledInitTabRowListenerID = 0
if c_TabRowData.ready == true return endIf
if !InitUIAIE()
	c_TabRowData = Null()
	return
endIf
c_TabRowData = new collection
c_TabRowData.TabRowTab = GetTabRowTabElement()
if !c_TabRowData.TabRowTab return endIf
if !StartListeningToTabRow() return endIf
var handle hApp = GetAppMainWindow(GetFocus())
if GetWindowClass(hApp) == IEFrameClass
	c_TabRowData.appWnd = hApp
endIf
c_TabRowData.ready = true
EndFunction

int function StartListeningToTabRow()
if !c_TabRowData.TabRowTab return false endIf
if !UIA_IE.AddAutomationEventHandler(UIA_SelectionItem_ElementSelectedEventId, c_TabRowData.TabRowTab, TreeScope_SubTree) return false endIf
return true
EndFunction

void function UIAIEAutomationEvent( object element, int eventID )
if element.controlType != UIA_TabItemControlTypeId return endIf
;The selection change fires multiple times when the tab item selection changes,
;so check if it is a different element from the prior one:
if UIA_IE.CompareElements(element,c_TabRowData.selectedTab) != false return endIf
c_TabRowData.selectedTab = element
if ScheduledDetectNewTabPageOnSelectionChangeID
	UnscheduleFunction(ScheduledDetectNewTabPageOnSelectionChangeID)
endIf
ScheduledDetectNewTabPageOnSelectionChangeID = ScheduleFunction("DetectNewTabPageOnSelectionChange",DetectNewTabPageOnSelectionChange_Delay)
EndFunction

int function GetNumOfPageTabs()
if !c_TabRowData.TabRowTab return 0 endIf
var object condition = UIA_IE.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_TabItemControlTypeId)
var object tabItems = c_TabRowData.TabRowTab.findAll(TreeScope_Children,condition)
if !tabItems return 0 endIf
return tabItems.count
EndFunction

void function DetectNewTabPageOnSelectionChange()
ScheduledDetectNewTabPageOnSelectionChangeID = 0
var handle hApp = GetAppMainWindow(GetFocus())
if GetWindowClass(hApp) != IEFrameClass return endIf
;The automation event may fire multiple times for the item selection of a tab when the browser opens.
;This tends to happen when there is a history of many multiple browser windows being simultaneously open during the current boot session.
;Because of the multiple firings of the automation event for the selected tab item,
;a false positive can occur when testing if the app handle is the same for these events.
;To work around this problem, we can determine if the count of tabs has changed.
;When the browser gains focus, the tab count in the collection is not yet initialized.
;We must therefore test the current tab count when a new tab is selected to insure that actually opening a new tab is detected
;when the user alt-tabbed away then back and then opened a new tab.
var int tabCount = GetNumOfPageTabs()
if !c_TabRowData.prevTabCount
&& tabCount == 1
	;The browser is newly opened, so just set the tab count:
	c_TabRowData.prevTabCount = tabCount
	return
endIf
;determine whether this is a new browser instance or a new tab in the browser:
if hApp == c_TabRowData.appWnd
	;This is a new tab but not a new browser instance.
	SayUsingVoice(vctx_message,msgNewTabPage,ot_screen_message)
else
	;This is a new browser window,
	;update the stored handle but do not announce new tab for a new browser instance.
	;The new browser window is announced in the focus change.
	c_TabRowData.appWnd = hApp
endIf
c_TabRowData.prevTabCount = tabCount
EndFunction

void function UpdateTabRowDataForAppWindow()
ScheduledUpdateTabRowDataForAppWindowID = 0
var handle hApp = GetAppMainWindow(GetFocus())
if GetWindowClass(hApp) != IEFrameClass return endIf
if c_TabRowData.appWnd
&& hApp != c_TabRowData.appWnd
	c_TabRowData.appWnd = hApp
endIf
EndFunction

Void Function TooltipEvent (handle hWnd, string strText, string appName)
var
  int iMouseX,
  int iMouseY
SaveCursor()
JAWSCursor()
GetCursorPos(CURSOR_JAWS,smmPixels,iMouseX,iMouseY)
if (iMouseX == iMouseXPrior && iMouseY == iMouseYPrior) then
  ; Ignore this, otherwise double speaking can occur.
  return
endif
iMouseXPrior = iMouseX
iMouseYPrior = iMouseY

if ! stringContains (strText, "://") then
	SayFormattedMessage (ot_tool_tip, strText)
endIf
let strLastTooltip = strText
Let gStrLastTipFromEvent = strText
Let ghwndToolTip = hWnd
EndFunction

int Function UseNewDocumentReadingFunctionality()
return !GetJCFOption (OPT_USE_LEGACY_IE_SUPPORT)
	&& GetJCFOption (OPT_VIRTUAL_PC_CURSOR)
	&& IsVirtualPCCursor()
EndFunction

Void Function SayAllStarted ()
if GetRunningFSProducts() == product_magic then
	if UseNewDocumentReadingFunctionality() then
		let g_iVirtualMSAARefreshRate = GetJCFOption (OPT_VIRTUAL_MSAA_REFRESH_RATE)
		if g_iVirtualMSAARefreshRate >= 0 then
			SetJCFOption (OPT_VIRTUAL_MSAA_REFRESH_RATE, -1)
		endIf
	endIf
endIf
SayAllStarted ()
EndFunction

Void Function SayAllStoppedEvent ()
if GetRunningFSProducts() == product_magic then
	SetJCFOption (OPT_VIRTUAL_MSAA_REFRESH_RATE, g_iVirtualMSAARefreshRate)
EndIf
SayAllStoppedEvent ()
EndFunction

int function IsIE7()
return 7 == SubString(GetVersionInfoString (GetAppFilePath (), strGetVersionInfoString_ProductVersion),1,1)
EndFunction

int function GetIEVersion()
var
	int VersionNumber,
	string versionInfo,
	int period,
	string substring
let versionInfo = GetVersionInfoString (GetAppFilePath (), strGetVersionInfoString_ProductVersion)
let VersionNumber = StringToInt(StringSegment(versionInfo,VersionInfoSeparator,1))
;Starting with IE7, we'll return the actual version.
;With earlier versions, we return 0, 1 or 2, depending on how the version of IE is grouped.
if VersionNumber >= 7 then
	return VersionNumber
EndIf
let period = StringContains (versionInfo, msgDot1_L)
if ! period then
	if StringToInt (versionInfo) > 4 then
		return ie5
	elif StringToInt (versionInfo) > 3 then
		return ie5
	else
		return ie3
	EndIf
EndIf
let substring = SubString (versionInfo, 1, period - 1)
if StringToInt (substring) <= 3 then
	return ie3
elif StringToInt (substring)  == 4 then
	let substring = SubString (versionInfo, period + 1, 2)
	if (StringToInt (substring) > 70) then
		return ie5
	else
		return ie3
	EndIf
else
	return ie5
EndIf
EndFunction

Script ScriptFileName ()
ScriptAndAppNames (msgIEVer_l)
EndScript

Void Function SayNonHighlightedText (handle hwnd, string buffer)
var
	string TheClass
let TheClass=GetWindowClass(hwnd)
Let gICheckByActiveItem = FALSE
If TheClass==DialogClass then
	; Alt tab is in progress
	Let gICheckByActiveItem = FALSE
	Say (buffer,OT_BUFFER)
	return
EndIf
If !IsVirtualPCCursor ()
&& !IsFormsModeActive() Then
	if IsPCCursor () then
		if nSuppressEcho then
			return
		EndIf
		if !IsVirtualPcCursor()
		|| !IsFormsModeActive() Then
			if TheClass==ie5Class
			&& GetWindowClass(GetFocus()) == ie5Class then
				If globalMenuMode==menu_inactive
				&& !DialogActive()
				&& !CaretVisible() then
					Say(buffer,ot_nonhighlighted_screen_text)
					return
				EndIf
			EndIf
		EndIf
	EndIf
	If GetScreenEcho()>1
	|| TheClass == DialogClass then

		Say(buffer, ot_nonhighlighted_screen_text)
	EndIf
EndIf
EndFunction

void Function SayHighlightedText (handle hwnd, string buffer)
var
	string theClass,
	handle hCurWnd,
	int iWinSubtype,
	int iScreenEcho
let theClass=GetWindowClass(hwnd)
if TheClass == ie5Class then
	return
EndIf
let iScreenEcho=GetScreenEcho()
if !iScreenEcho then
	return
EndIf
if GlobalMenuMode>0 then
	if IsVirtualRibbonActive() then
		default::SayHighlightedText(hwnd,buffer)
	else
		Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
	EndIf
	Return
ElIf !IsVirtualPCCursor() then
	If TheClass == wcComboBox then
		Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
	Else
		let hCurWnd = GetCurrentWindow()
		let iWinSubtype=GetWindowSubtypeCode(hCurWnd)
		if hwnd == hCurWnd
		&& !DialogActive()
		&& iWinSubtype == wt_editCombo
		&& !(GlobalFocusWindow == GetFocus() && GetWindowClass(GetParent(GetParent(hWnd))) == cwc_ComboBoxEx32) then
			return
		else
			Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
			;make sure auto suggest flashes in braille:
			if TheClass == cscListviewClass
			&& GetWindowClass(GetParent(hwnd)) == cwc_AutoSuggestDropdown then
				BrailleMessage(buffer)
			EndIf
		EndIf
		Return
	EndIf
Else
	If theClass==ieComboBoxClass
	|| theClass == ieListBoxClass
	|| TheClass == wcComboBox Then
		If ! IsVirtualPcCursor () then
			; We do not want combo box text to chatter when the VPC is somewhere else.
			Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
		EndIf
	EndIf
	;For the below, we set iWinSubtype at the beginning
	;where we tested if class is ie5class:
	if iWinSubtype == wt_edit
	|| iWinSubtype == wt_multiline_edit then
		Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
	EndIf
EndIf
EndFunction

int Function MoveToSecurityWarningDlgControl (int iDirection)
Var
	handle hParent,
	handle hTemp,
	handle hWnd,
	int iControl
let hWnd =  GetFocus ()
let hParent = GetParent (hWnd)
If GetWindowName (hParent) != WnSecurityWarning Then
	return FALSE
EndIf
let iControl = GetControlID (hWnd)
If iDirection Then
	If giTrustChkBx Then
		let hTemp = FindDescendantWindow (hParent, ID_YesBtn)
		If hTemp Then
			SetFocus (hTemp)
			let giTrustChkBx = FALSE
			return TRUE
		endIf
	EndIf
ElIf !iDirection Then
	If giTrustChkBx Then
		let hTemp = FindDescendantWindow (hParent, ID_DlgText2 )
		If hTemp Then
			SetFocus (hTemp)
			let giTrustChkBx = FALSE
			return TRUE
		EndIf
	EndIf
EndIf
	return FALSE
	EndFunction

Void Function MoveToLink (int nNext)
; 1 = next, 0 = previous
if nNext > 0 then
	If !MoveToSecurityWarningDlgControl (nNext ) Then
		TabKey()
	EndIf
else
	If !MoveToSecurityWarningDlgControl (nNext ) Then
		ShiftTabKey()
	EndIf
EndIf
let nSuppressEcho = true ; to avoid chattering caused by SayNonHighlightedText
if MagGetState () > 0 then
	return
EndIf
let nSuppressEcho = FALSE
EndFunction

Script MoveToNextLink()
Let gICheckByActiveItem = TRUE
SayCurrentScriptKeyLabel ()
MoveToLink(1)
EndScript

Script MoveToPriorLink ()
Let gICheckByActiveItem = TRUE
SayCurrentScriptKeyLabel ()
MoveToLink(0)
EndScript

Script SaySelectedLink ()
var
	string sMessage
If DialogActive () then
	SaySelectedLink4 ()
	Return
EndIf
if (GetControlID (GetCurrentWindow()) == ciLookIn)  && (GetWindowClass (GetCurrentWindow()) == wcEdit) then
	let sMessage = FormatString (msgLookIn1, GetLine ())
	SayFormattedMessage(OT_CONTROL_NAME, sMessage)
else
	SaySelectedLink4 ()
EndIf
EndScript

Script GoBack ()
let BackForward = 1
if !IsWindows8() && UseUnifiedKeyboardProcessing() then
	TypeKey(ks1)
else
	; IENavigate is used to workaround issues when the command requires double press
	IENavigate(IENavBack)
EndIf
if GetRunningFSProducts() & product_JAWS then
SayFormattedMessage (ot_STATUS, msgBack1_L, cmsgSilent)
EndIf
EndScript

Script GoForward ()
let BackForward = 1
if !IsWindows8() && UseUnifiedKeyboardProcessing() then
	TypeKey(ks2)
else
	; IENavigate is used to workaround issues when the command requires double press
	IENavigate(IENavForward)
EndIf
if GetRunningFSProducts() & product_JAWS then
SayFormattedMessage (ot_STATUS, msgForward1_L, cmsgSilent)
endIf
EndScript

Script GoHome ()
IENavigate(IENavHome)
if GetRunningFSProducts() & product_JAWS then
SayFormattedMessage (ot_STATUS, msgHome1_L, cmsgSilent)
EndIf
EndScript

void function DoInformationBarHotKey()
UserBufferDeactivate()
TypeKey(ksInformationBarHotKey)
EndFunction

int function ProcessDocumentLoadAppAlerts()
var
	string sInformationBar
;first, determine if we need to check for any alerts:
if !gbInformationBarAnnounce
&& !gbRSSFeedAvailabilityAnnounce then
	return false
EndIf
if gbInformationBarAnnounce then
	let sInformationBar = CheckForInformationBar()
	if sInformationBar then
		if gbInformationBarAnnounce == DocumentLoadAppAlert_Speak then
			Say(sInformationBar,ot_screen_message)
			SayUsingVoice(vctx_message,ksInformationBarHotKey,ot_access_key)
		else
			;Information bar should be virtualized, and maybe RSS Feeds as well:
			let giVirtualizedDocumentLoadAlerts = flag_VirtualizedDocumentLoadAlert_InformationBar
			if UserBufferIsActive() then
				UserBufferDeactivate()
			EndIf
			UserBufferClear()
			UserBufferAddText(sInformationBar)
			UserBufferAddText(ksInformationBarHotKey,"DoInformationBarHotKey",ksInformationBarHotKey,
				cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
			;if we should alert about RSS Feeds, add to this virtual message:
			if gbRSSFeedAvailabilityAnnounce  == DocumentLoadAppAlert_Virtualize then
				if CheckForRSSFeedAvailability(false) then
					let giVirtualizedDocumentLoadAlerts = giVirtualizedDocumentLoadAlerts + flag_VirtualizedDocumentLoadAlert_RSSFeed
					UserBufferAddText(cscBufferNewLine+msgRssFeedavailabilityAnnouncement_L)
				EndIf
			EndIf
			UserBufferAddText(cscBufferNewLine)
			UserBufferAddText(cmsg40_S,"ExitUserBuffer",cmsg40_S)
			UserBufferActivate()
			JAWSTopOfFile()
			SayAll()
			return true
		EndIf
	EndIf
EndIf
if gbRSSFeedAvailabilityAnnounce == DocumentLoadAppAlert_Virtualize then
	if CheckForRSSFeedAvailability(false) then
		let giVirtualizedDocumentLoadAlerts = flag_VirtualizedDocumentLoadAlert_RSSFeed
		if UserBufferIsActive() then
			UserBufferDeactivate()
		EndIf
		UserBufferClear()
		UserBufferAddText(msgRssFeedavailabilityAnnouncement_L)
		UserBufferAddText(cscBufferNewLine)
		UserBufferAddText(cmsg40_S,"ExitUserBuffer",cmsg40_S)
		UserBufferActivate()
		JAWSTopOfFile()
		SayAll()
		return true
	EndIf
ElIf gbRSSFeedAvailabilityAnnounce == DocumentLoadAppAlert_Speak then
	if CheckForRSSFeedAvailability(false) then
		SayUsingVoice(vctx_message,msgRssFeedavailabilityAnnouncement_S,ot_help)
	EndIf
EndIf
return false
EndFunction

void function DoDefaultDocumentLoadActions()
if giVirtualizedDocumentLoadAlerts == flag_VirtualizedDocumentLoadAlert_InformationBar then
	if CheckForRSSFeedAvailability(false) then
		SayUsingVoice(vctx_message,msgRssFeedavailabilityAnnouncement_S,ot_help)
	EndIf
EndIf
let giVirtualizedDocumentLoadAlerts = 0
DoDefaultDocumentLoadActions()
EndFunction

void function DocumentUpdated(int nLineNumberOfChange, int bUserInvoked)
SetUpStuffForNewPage ();Personalized Settings
DocumentUpdated(nLineNumberOfChange, bUserInvoked)
EndFunction

Void Function DocumentLoadedEvent ()
SetUpStuffForNewPage ();Personalized Settings
SpeakPersonalizeSettingsChange ()
let giReturnPositionFromFrameUpdate = 0
Let gICheckByActiveItem = FALSE
DocumentLoadedEvent ()
EndFunction

Int Function HandleCustomAppWindows(handle hWnd)
var
	handle hReadOnly = FindDescendantWindow (hwnd, 1300),
	string sWndName
If GetWindowClass (hWnd) == strMainWindow Then; main Internet Explorer window
	If InHJDialog () Then
		; returning to IE from Find dialog, so, let default functionality speak app info
		return FALSE
	EndIf
EndIf
If InHjDialog () && ! MenusActive () then
	;Keep extra static text from chattering.
	IndicateControlType (WT_DIALOG, GetWindowName (hWnd), cScSpace)
	if hReadOnly && getWindowSubtypeCode (hReadOnly) == WT_READONLYEDIT  && hReadOnly != getFocus () then
		sayWindow (hReadOnly, READ_EVERYTHING)
	endIf
	Return TRUE
EndIf
if GetWindowClass(hWnd) == cWc_dlg32770
&& IsWinVista() then
	let sWndName = GetWindowName(hWnd)
	if StringCompare(sWndName,wn_DeleteFile) == 0
	|| StringCompare(sWndName,wn_DeleteFolder) == 0
	|| StringCompare(sWndName,wn_DeleteShortcut) == 0 then
		SayWindowTypeAndTextForNonstandardDialogs (hWnd, sWndName)
		return true
	EndIf
EndIf
Return HandleCustomAppWindows(hWnd)
EndFunction

int Function HandleCustomRealWindows (handle hWndReal)
Return HandleCustomRealWindows (hWndReal)
EndFunction

int Function HandleCustomWindows (handle hWnd)
;Design to rectify problem where
;SayObjectTypeAndText (follow the trail in Default.jss, SayWindowPromptAndText)
;breaks in empty folder list views.
;Now, we'll just say "List view",
;rather than "folder view list view".
var
	int nSubTypeCode
Let nSubtypeCode = GetWindowSubtypeCode (hWnd)
If nSubtypeCode == WT_LISTVIEW then;&&
	if menusActive () && getObjectSubtypeCode (TRUE) == WT_MENU then
		return handleCustomWindows (hwnd)
	else
		SayWindowTypeAndText (hWnd)
		Return TRUE
	endIf
EndIf
Return HandleCustomWindows (hWnd)
EndFunction

int Function FocusRedirected (handle hFocusWindow)
Var
	handle hParent,
	handle hTemp,
	handle hWnd,
	int iControl,
	string sRealName
if stringContains (getWindowOwner (GlobalPrevReal), "ResultsViewer") then
	globalPrevReal = GetRealWindow (hFocusWindow)
	return TRUE
endIf
let sRealName =GetWindowName (GetRealWindow (hFocusWindow))
let hParent = GetParent (hFocusWindow)
let iControl = GetControlID (hFocusWindow)
If DialogActive ()
&& StringContains (sRealName,  WnSecurityWarning) Then
	If iControl == ID_AlwaysTrustText
	&& GetWindowSubTypeCode (hFocusWindow) == WT_READONLYEDIT Then
		let hTemp = FindDescendantWindow (GetParent (hFocusWindow), ID_AlwaysTrustCheckBox )
		If hTemp Then
			SetFocus (hTemp)
			let giTrustChkBx = TRUE
			let gsAlwaysTrustText = GetWindowText (FindDescendantWindow (GetParent (GetFocus ()), ID_AlwaysTrustText ), FALSE)
			return TRUE
		EndIf
	EndIf
EndIf
return FALSE
		EndFunction

int function LoadingNewConfiguration(handle FocusWindow)
var
	handle hWnd,
	string sOwner,
	string strApplet
let hWnd = GetRealWindow(FocusWindow)

; Switch back to outlook
sOwner = StringSegment (GetWindowOwner (FocusWindow), cscDoubleBackslash, -1)
if StringContains (sOwner, "OUTLOOK") then
	SwitchToConfiguration ("outlook")
	Return true
EndIf

;code to switch to adobe scripts
if GetWindowClass(FocusWindow) == cwcAdobeDocClass then
	let sOwner = GetWindowOwner(FocusWindow)
	if sOwner then
		let sOwner = StringSegment(sOwner,cScDoubleBackSlash,StringSegmentCount(sOwner,cScDoubleBackSlash))
		if sOwner == cscOwnerApp_AcroRd32
		|| sOwner == cscOwnerApp_Acrobat then
			let gbSwitchingConfiguration = true
			SwitchToConfiguration ("Adobe Acrobat")
			Return true
		EndIf
	EndIf
EndIf
;When a Java Applet is running in IE
;the Java scripts won't be loaded because the actual main window is IE's.
;hence the need to manually load
if IsJavaWindow(focusWindow) then
	let strApplet = GetAppletName()
	if (strApplet != cscNull) then
		SwitchToConfiguration(strApplet)
		return true
	EndIf
EndIf
return false
EndFunction

void function ProcessSayAppWindowOnFocusChange(handle AppWindow, handle FocusWindow)
var
	handle hTemp,
	string sAppWinClass,
	string sPrevAppWinClass,
	int iNewBrowserWindowSpoken,
	string sOwnerApp
let sAppWinClass = GetWindowClass(AppWindow)
if GlobalPrevApp != AppWindow
&& sAppWinClass == IEFrameClass then
	let sPrevAppWinClass = GetWindowClass (globalPrevApp)
	if sPrevAppWinClass == IEFrameClass
	|| (globalLastIEWindow && globalLastIEWindow != AppWindow) then
		Let iNewBrowserWindowSpoken = TRUE
		SayUsingVoice(vctx_message, msgNewBrowserWindow1_L,ot_STATUS)
	;and for webinar software opening in a new IE window:
	elif sPrevAppWinClass == wc_TalkComClass then
		let sOwnerApp = GetWindowOwner(GlobalPrevApp)
		if sOwnerApp then
			let sOwnerApp = StringSegment(sOwnerApp,cScDoubleBackSlash,StringSegmentCount(sOwnerApp,cScDoubleBackSlash))
			if sOwnerApp == sAppName_WebConferencePlugin then
				SayUsingVoice(vctx_message, msgNewBrowserWindow1_L,ot_STATUS)
			EndIf
		EndIf
	EndIf
EndIf
if GlobalPrevApp == AppWindow
|| AppWindow == FocusWindow then
	;We will catch this change Elsewhere, so just return.
	return
EndIf
;check that you are not moving between the app and the JAWS Select Item dialog
if GetWindowClass(globalPrevApp) == IEFrameClass
&& sAppWinClass == IEFrameClass
&& !iNewBrowserWindowSpoken then
	SayUsingVoice(vctx_message, msgNewBrowserWindow1_L,ot_STATUS)
EndIf
if GlobalWasHjDialog then
	;Do not speak the app name when exiting from an HJDialog back to the application.
	if !InHjDialog() then
		return
	else
		;due to timing issues with the JAWS Find dialog,
		;we cannot depend on the value returned by InHJDialog to tell if the dialog has cleared.
		;So, we test the previous hj dialog name:
		if GlobalPrevRealName == cwn_JAWS_Find then
			return
		EndIf
	EndIf
EndIf
if sAppWinClass == wc_AlternateModalTopMost
&& IsWindowDisabled(AppWindow) then
	;A dialog has opened, and this is the app window,
	;but do not announce it because the app has not changed.
	return
EndIf
if sAppWinClass == cWc_dlg32770 then
	let hTemp = GetPriorWindow(GetPriorWindow(AppWindow))
	if IsWindowVisible(hTemp)
	&& GetParent(hTemp) == AppWindow
	&& GetWindowName(hTemp) == wn_FileDownload_SecurityWarning then
		;Announcing the File Download dialog
		;when focus is going to the file download security warning dialog
		;would be too much extraneous verbiage:
		return
	EndIf
EndIf
If !HandleCustomAppWindows(AppWindow) then
	SayWindowTypeAndText(AppWindow)
EndIf
EndFunction

void function ProcessSayTopWindowOnFocusChange(handle AppWindow,handle TopWindow,handle RealWindow,handle FocusWindow)
if appWindow == GlobalPrevApp
&& AppWindow == RealWindow
&& TopWindow == AppWindow
&& TopWindow != GlobalPrevTop
&& GlobalPrevTop != GlobalPrevApp
&& GlobalPrevTop != GlobalPrevReal then
	;this is the scenario when in Windows XP, IE Help is dismissed and focus returns to the IE page.
	Say(GetWindowName(TopWindow),ot_document_name)
EndIf
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
var
	handle hTemp,
	int iSubtype,
	string sDocumentName,
	string sClass
;this test must come before the traditional real window tests:
;TODO: SMcCormack: This does not work in all cases! Needs rework
if gbVistaControlPanelShellViewChanged then
	;SayVistaControlPanelShellViewStaticText()	;Function Commented out
	let gbVistaControlPanelShellViewChanged = false
	return
EndIf
If GlobalPrevRealName == RealWindowName
&& GlobalPrevReal == RealWindow then
	;The real window did not change, so just return.
	return
EndIf
;note that the following block must preceed
;the test for real window = ap or focus window.
if GlobalPrevRealName != RealWindowName then
	;is this the File Download - Security Warning dialog:
	if GetWindowClass(RealWindow) == cWc_dlg32770
	&& RealWindowName == wn_FileDownload_SecurityWarning then
		;first announce the dialog name and type:
		Say(RealWindowName,ot_dialog_name)
		IndicateControlType(wt_dialog,cscSpace,cscSpace)
		;Now speak all window text before the first button:
		let hTemp = GetFirstChild(RealWindow)
		let iSubtype = GetWindowSubtypeCode(hTemp)
		while hTemp
		&& iSubtype != wt_button
			if IsWindowVisible(hTemp) then
				Say(GetWindowTextEx(hTemp,0,0),ot_dialog_text)
			EndIf
			let hTemp = GetNextWindow(hTemp)
			let iSubtype = GetWindowSubtypeCode(hTemp)
		EndWhile
		return
	EndIf
	;Is the focus switching to a different IE page tab:
	let sClass = GetWindowClass(RealWindow)
	if sClass == strMainWindow
	|| (gbIsMetroApp && sClass == cwc_Windows_UI_Core_CoreWindow) then
		;let GlobalDocumentName = IEGetCurrentDocument().title;Don't update global until after check:
		Let sDocumentName = IEGetCurrentDocument().title
		If (StringCompare (sDocumentName, GlobalDocumentName) != 0) then
			Let PrevDocumentName = GlobalDocumentName
			Let GlobalDocumentName = sDocumentName
		EndIf
		If GlobalDocumentName !=PrevDocumentName then
			if ! gbAnnounceValueAfterIEPageChanged  then
				Say(GlobalDocumentName,OT_DIALOG_NAME)
			EndIf
			Let gbAnnounceValueAfterIEPageChanged = FALSE
			return
		EndIf
	EndIf
EndIf
Let gbAnnounceValueAfterIEPageChanged = FALSE
If RealWindow == AppWindow
|| RealWindow == FocusWindow then
	;We will catch this change in the focus window processing, so just return.
	return
EndIf
if GetWindowSubTypeCode(realWindow) == wt_dialog then
	if StringContains(realWindowName, wnAlert1)
	|| StringCompare(realWindowName,wn_DeleteFile) == 0
	|| StringCompare(realWindowName,wn_DeleteFolder) == 0
	|| StringCompare(RealWindowName,wn_DeleteShortcut) == 0 then
		SayWindowTypeAndTextForNonstandardDialogs (realWindow, realWindowName)
		return
	EndIf
EndIf
if GlobalWasHjDialog
&& GetWindowClass(RealWindow) != cWc_dlg32770 then
	;Do not speak the real name when exiting from an HJDialog back to the application.
	if !InHjDialog() then
		;GlobalWasHjDialog prevents over chatter, especially when exiting a list box and returning to a client area.
		;Set GlobalWasHJDialog to FALSE when one HjDialog follows another,
		;For example, the AddBrailleColors function.
		return
	else
		;due to timing issues with the JAWS Find dialog,
		;we cannot depend on the value returned by InHJDialog to tell if the dialog has cleared.
		;So, we test the previous hj dialog name:
		if GlobalPrevRealName == cwn_JAWS_Find then
			return
		EndIf
	EndIf
EndIf
if IsWindows10FlyOutDialog(FocusWindow,AppWindow,RealWindow)
	;This dialog may appear after pressing a button in Internet Explorer Options.
	SayFlyOutDialogText(FocusWindow)
	return	
endIf
sayWindowTypeAndText(RealWindow)
EndFunction

int function IsWindows10FlyOutDialog(optional handle hFocus, handle hApp, handle hReal)
if UserBufferIsActive() return false endIf
if !hFocus hFocus = GetFocus() endIf
if !hApp hApp = GetAppMainWindow(hFocus) endIf
if !hReal hReal = GetRealWindow(hFocus) endIf
return GetWindowClass(hFocus) == cwc_DirectUIhWND
	&& GetWindowClass(hReal) == wc_Shell_Dialog
	&& GetWindowClass(hApp) == wc_shell_Dim
EndFunction

int function GetUIAForFlyOutDialog(object byRef oUIA, object byRef treeWalker, optional handle hWnd)
if !hWnd hWnd = GetFocus() endIf
oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
treeWalker = CreateUIARawViewTreeWalker()
treeWalker.currentElement = oUIA.GetElementFromHandle(hWnd)
if !treeWalker.currentElement
|| treeWalker.currentElement.className != uiaClassName_FlyOutElement
|| treeWalker.currentElement.automationId != uiaAutomationID_Popup
	oUIA = Null()
	treeWalker = Null()
	return false
endIf
return true
EndFunction

string function GetFlyOutDialogText(object oUIA, object treeWalker)
var object condition = oUIA.CreateAndCondition(
	oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_TextControlTypeId),
	oUIA.CreateStringPropertyCondition(UIA_AutomationIDPropertyId,UIAAutomationID_ExecSimpleDialogContentElement))
var object element = treeWalker.currentElement.FindFirst(treeScope_subtree,condition)
if !element return cscNull endIf
return element.name
EndFunction

void function SayFlyOutDialogText(optional handle hWnd)
var
	object oUIA,
	object treeWalker,
	string text
if !hWnd hWnd = GetFocus() endIf
if !GetUIAForFlyOutDialog(oUIA,treeWalker,hWnd) return endIf
text = GetFlyOutDialogText(oUIA,treeWalker)
if text	Say(text,ot_dialog_text) endIf
EndFunction

void function ReadFlyOutDialogFocusableControls(object oUIA, object startElement)
var object condition = oUIA.CreateBoolPropertyCondition(UIA_IsKeyboardFocusablePropertyId,UIATrue)
var object elements = startElement.FindAll(treeScope_subtree,condition)
if !elements || Elements.count == 0 return endIf
var
	string state,
	int i,
	int n = elements.count-1
for i = 0 to n
	if elements(i).name
		Say(FormatString(msgReadDialogFlyoutControls,
				elements(i).name,
				elements(i).localizedControlType,
				GetUIAStateString( elements(i))),
			ot_user_requested_information)
	endIf
endFor
EndFunction

int function ReadFlyOutDialog(optional handle hWnd)
var
	object oUIA,
	object treeWalker,
	string text
if !hWnd hWnd = GetFocus() endIf
if !GetUIAForFlyOutDialog(oUIA,treeWalker,hWnd) return false endIf
text = treeWalker.currentElement.name
if text Say(text,ot_user_requested_information) endIf
text = GetFlyOutDialogText(oUIA,treeWalker)
if text Say(text,ot_user_requested_information) endIf
ReadFlyOutDialogFocusableControls(oUIA,treeWalker.currentElement)
return true
EndFunction

Script ReadBoxInTabOrder()
if IsWindows10FlyOutDialog()
&& ReadFlyOutDialog()
	return
endIf
PerformScript ReadBoxInTabOrder()
EndScript

int function NavigatingIETabControl(handle hFocus, handle hPrevFocus)
if GetWindowClass(hFocus) != cwc_DirectUIhWND then
	return false
EndIf
if GetObjectSubtypeCode() != wt_TabControl then
	return false
EndIf
return hFocus == hPrevFocus
EndFunction

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName, handle FocusWindow)
var
	object oFocus,
	object oWorking,
	object oPrev,
	object oNext,
	string sapptitle
;Special Windows Vista Control Panel/Applet handling
;Windows Update
if InVistaControlPanelApplet(wan_WindowsUpdate) then
	let oFocus = GetFocusObject (0)
	If oFocus.accName (0) == vcp_wup_ViewAvailableUpdates
	|| oFocus.accName (0) == vcp_wup_ViewAvailableExtras then
		let oPrev = oFocus.accNavigate (NAVDIR_PREVIOUS,0)
		Say (oPrev.accName (0), OT_MESSAGE)
		let oNext = oFocus.accNavigate (NAVDIR_NEXT,0)
		While (oNext.accRole (0) != ROLE_SYSTEM_GRAPHIC && oNext.accName (0) != vcp_wup_MostRecent)
			Say (oNext.accName (0), OT_MESSAGE)
			let oNext = oNext.accNavigate (NAVDIR_NEXT,0)
		EndWhile
	ElIf oFocus.accName (0) == vcp_wup_ViewUpdateHistory then
		let oNext = oFocus.accNavigate (NAVDIR_PREVIOUS,0)
		If oNext.accRole (0) == ROLE_SYSTEM_STATICTEXT then
			let oPrev = oNext.accNavigate (NAVDIR_PREVIOUS,0)
			Say (oPrev.accName (0), OT_MESSAGE)
			Say (oNext.accName (0), OT_MESSAGE)
		Endif
	EndIf
ElIf InVistaControlPanelApplet (wan_System) then
	let oFocus = GetFocusObject (0)
	if oFocus.accName (0) == vcp_sys_ExpIndex
	|| oFocus.accName (0) == vcp_sys_NoExpIndex then
		let oPrev = oFocus.accNavigate (NAVDIR_PREVIOUS,0)
		let oWorking = oPrev.accNavigate (NAVDIR_PREVIOUS,0)	; Get past the graphic in front of the link
		While (oWorking && oWorking.accName (0) != vcp_sys_System)
			let oWorking = oWorking.accNavigate (NAVDIR_PREVIOUS,0)	; Get to the 'System' Group label text
		EndWhile
		While (oWorking && oWorking .accName (0) != vcp_sys_Computer)
			If oWorking.accRole (0) == ROLE_SYSTEM_STATICTEXT then
				Say (oWorking.accName (0), OT_MESSAGE)
			EndIf
			let oWorking = oWorking.accNavigate (NAVDIR_NEXT,0)
		EndWhile
	Elif oFocus.accName (0) == vcp_sys_ChangeSettings then
		let oPrev = oFocus.accNavigate (NAVDIR_PREVIOUS,0)
		let oWorking = oPrev.accNavigate (NAVDIR_PREVIOUS,0)	; Get past the graphic in front of the link
		While (oWorking && oWorking.accName (0) != vcp_sys_Computer)
			let oWorking = oWorking.accNavigate (NAVDIR_PREVIOUS,0)	; Get to the Group label text
		EndWhile
		While (oWorking && oWorking .accName (0) != vcp_sys_Activate)
			If oWorking.accRole (0) == ROLE_SYSTEM_STATICTEXT then
				Say (oWorking.accName (0), OT_MESSAGE)
			EndIf
			let oWorking = oWorking.accNavigate (NAVDIR_NEXT,0)
		EndWhile
	Elif oFocus.accName (0) == vcp_sys_ChangeKey then
		let oPrev = oFocus.accNavigate (NAVDIR_PREVIOUS,0)
		let oWorking = oPrev.accNavigate (NAVDIR_PREVIOUS,0)	; Get past the graphic in front of the link
		While (oWorking && oWorking.accName (0) != vcp_sys_Activate)
			let oWorking = oWorking.accNavigate (NAVDIR_PREVIOUS,0)	; Get to the Group label text
		EndWhile
		While oWorking
			If oWorking.accRole (0) == ROLE_SYSTEM_STATICTEXT then
				Say (oWorking.accName (0), OT_MESSAGE)
			EndIf
			let oWorking = oWorking.accNavigate (NAVDIR_NEXT,0)
		EndWhile
	Elif oFocus.accName (0) == vcp_sys_LearnMore then
		let oPrev = oFocus.accNavigate (NAVDIR_PREVIOUS,0)
		If oPrev.accName (0) == vcp_sys_WGAGraphic then
			Say (vcp_sys_WGAGraphicReplace, OT_MESSAGE)
		EndIf
	EndIf
EndIf
;for when focus moves to the virtual ribbon:
; for when document properties pane in MSOffice 2007 applications gains focus.
let sAppTitle=GetAppTitle()
if (StringContains(sAppTitle,wn_MSWord)
|| StringContains(sAppTitle,wn_MSExcel)
|| StringContains(sAppTitle,wn_MSPowerpoint))
&& stringStartsWith(getWindowOwner(getTopLevelWindow(focusWindow)), "MSHTML")
&& !IsFormsModeActive()
&& !IsVirtualRibbonActive() then
	SayLine()
	return
EndIf
ProcessSayFocusWindowOnFocusChange (RealWindowName, FocusWindow)
EndFunction

void function speakTableNameChange()
var
string sTableName
let sTableName=GetObjectName(1,1)
if (sTableName!=gsPriorTableName) then
	sayMessage(OT_CONTROL_GROUP_NAME, sTableName)
	let gsPriorTableName=sTableName
endIf
endFunction

int function ShouldSuppressFocusEventOnComboBox(int type, int objectID, int childID,int prevObjectID, int prevChildID,int changeDepth)
;Focus event should be suppressed from speaking description text for a combo box when expanding the combo box on a web page.
if type != WT_COMBOBOX
|| changeDepth != 0
|| DialogActive()
	return false
EndIf
if (objectID != prevObjectID
	|| childID != prevChildID) then
	return false
EndIf
return true
EndFunction

void function ResetPrevGridCoords(int changeDepth)
if changeDepth == 0 then
	return
EndIf

var
	int changedTable

let changedTable = (GetObjectSubTypeCode (true, changeDepth) == WT_TABLE) 
if InARIAGrid () 
&& !changedTable then
	return
EndIf

prevGridRow = -1
prevGridCol = -1
EndFunction

void function AnnounceGroupBoxInChangeDepth(int nChangeDepth)
var int groupBoxLevel = -1
groupBoxLevel = FindAncestorOfType (WT_GROUPBOX)
if groupBoxLevel > 0
&& groupBoxLevel <= nChangeDepth
	;Only announce the group if it has a name:
	var string name = GetObjectName(true,groupBoxLevel)
	if name
		SayObjectTypeAndText (groupBoxLevel)
	endIf
EndIf
EndFunction

void function FocusChangedEventEx (handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
var
	int iType,
	string sAppName
;Selecting text with copy full content with onscreen selection causes a focus change.
;We want to ignore this or we'll get doublespeaking.
if GetTickCount() -giLastSelectionSpoken< 250 then
	return
endIf
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	

ResetPrevGridCoords(nChangeDepth)

if getObjectSubtypeCode(2,nChangeDepth)==wt_dialog
&& GetWindowClass(hwndFocus)==ie5class then
	IndicateControlType (WT_DIALOG, GetObjectName(1,nChangeDepth), GetObjectDescription (1, nChangeDepth))
endIf

let gbLastFocusChangeWithInCombo = false
if (ShouldSuppressFocusEventOnComboBox(GetObjectSubTypeCode (true, 0), nObject, nChild,nPrevObject, nPrevChild,nChangeDepth)) then
	gbLastFocusChangeWithInCombo = true
	return
EndIf
if nChangeDepth == 2
& getObjectSubtypeCode(2,1) == wt_table
&& getObjectSubTypeCode(2,2) == wt_groupbox then
	;A table within a groupbox is most likely a Date Picker,
	;read the name of the groupbox which contains the month name as it changes.
	say(getObjectname(1,2),OT_CONTROL_GROUP_NAME)
	sayColumnHeader()
	sayCell()
	return
endIf
AnnounceGroupBoxInChangeDepth(nChangeDepth)
;Defect 65725 - ARIA grids: CodeTalks datepicker example: JAWS doesn't announce month name and year when you pass the first or last day of any month with LEFT
;This is a different implementation of a date picker where the table name changes
;Speak table name changes if they occur when active item changes within the table.
if (nChangeDepth==-1 && getObjectSubtypeCode(2,1)==wt_table) then
	SpeakTableNameChange()
endIf
;Eventualy, when focus changes are spoken according to ancestral changes,
;this block to handle tabbing into and out of a
;toolbar can be removed.
if GetObjectSubtypeCode(2,1)==WT_TOOLBAR && GetWindowClass(hwndFocus)==ie5class then
	if !gbInToolBar then
		IndicateControlType(wt_toolbar)
	endIf
	let gbInToolBar=true
else
	let gbInToolBar=false
endIf
MonitorFormsModeComboBox(hwndFocus,hwndPrevFocus,nChild)
;Refresh Braille if header bar has dropped into menu:
Let iType = getWindowSubtypeCode (hwndFocus)
if NavigatingIETabControl(hWndFocus,hwndPrevFocus) then
	return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
EndIf
If hWndFocus == hWndPrevFocus
&& GetWindowSubtypeCode (hWndFocus) == WT_TREEVIEW
&& !InHJDialog() then
	SayTreeViewLevel ()
	Return
EndIf
let sAppName=GetWindowName (GetAppMainWindow (GetCurrentWindow ()))
if StringContains (sAppName,WN_LIBERA) then
	let gbSwitchingConfiguration = TRUE
	SwitchToConfiguration (CONFIG_LIBERA)
	return
Endif
;Return to MSOffice 2007 apps when they gain focus:
If GetWindowOwner(hwndFocus)!=GetWindowOwner(hwndPrevFocus)
&& stringStartsWith(getWindowOwner(getTopLevelWindow(hwndFocus)), "MSHTML")
	if StringContains (sAppName,wn_MSWord) then
		let gbSwitchingConfiguration = TRUE
		SwitchToConfiguration (CONFIG_MSWord)
		return
	Endif
	if StringContains (sAppName,wN_msExcel) then
		let gbSwitchingConfiguration = TRUE
		SwitchToConfiguration (CONFIG_msExcel)
		return
	Endif
	if StringContains (sAppName,WN_MSPowerpoint) then
		let gbSwitchingConfiguration = TRUE
		SwitchToConfiguration (CONFIG_MSPowerpoint2007)
		return
	Endif
endIf
;Handle Vista MSAA Focus bug when moving into Hybrid HTML windows (Control panels, Copy/Move Dialog)
if (wc_DirectUI == GetWindowClass(hWndFocus)) then
	var
		object o
	let o = GetFocusObject(0)
	if (ROLE_SYSTEM_PANE == o.accRole(0)) then
		setFocus(getFirstChild(hWndFocus))
		setFocus(hWndFocus)
		Return
	ElIf nChangeDepth <= 2
		&& hwndFocus == hwndPrevFocus
		&& nObject == nPrevObject
		&& nChild == nPrevChild
		&& GetObjectSubtypeCode() == wt_ListBoxItem
		; Fixes over speaking caused by the call to MSAARefresh in DescriptionChangedEvent
		return;
	EndIf
endIf
; TODO: This does not always detect change in control panel applet changes
if nChangeDepth >= 5 then
	if InVistaControlPanelShellView() then
		let gbVistaControlPanelShellViewChanged = true ;cleared in ProcessSayRealWindowOnFocusChange
	EndIf
EndIf
; to announce clickable only lines in Windows Help.
If GetWindowName (GetRealWindow (GetFocus ())) == WN_HelpAndSupportCenter
&& (nChangeDepth == -1
||nChangeDepth == 2
|| nChangeDepth == 12)
&& IsVirtualPCCursor () then
	SayLine ()
EndIf
if hWndFocus == hWndPrevFocus && GetWindowClass(hwndFocus)==ie5Class && GetMenuMode() then
;This is most likely an ARIA menu.
	return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
elIf IsFormsModeActive ()
&& nChangeDepth == 0
&& getObjectSubtypeCode (TRUE) == WT_LISTBOXITEM then
	return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
endIf
FocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
;Announce any notification which this focus change may be associated with
if GetWindowClass(hwndFocus)==ie5class then
		CheckIE9NotificationBar()
endIf
EndFunction

int function MenusActive()
return MenusActive()
	|| GetWindowClass(GetFocus()) == wc_IE_PopupMenuOwner
EndFunction

int function MenuProcessedOnFocusChangedEventEx(
	handle hwndFocus, handle hwndPrevFocus,
	int nType, optional int nChangeDepth)
if MenusActive() then
	if !nType
	&& GetWindowClass(hWndFocus) == wc_IE_PopupMenuOwner then
		TypeKey(cksDownArrow); Select first item in menus
	EndIf
EndIf
return MenuProcessedOnFocusChangedEventEx(hwndFocus, hwndPrevFocus, nType, nChangeDepth)
EndFunction

Void Function FocusChangedEvent (handle focusWindow, handle prevWindow)
var
	handle RealWindow,
	string RealWindowName
if ReturningFromResearchItDialog ()
|| InHJDialog ()
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
Let gICheckByActiveItem = FALSE
if LoadingNewConfiguration(FocusWindow) then
	return
EndIf
let RealWindow = GetRealWindow(FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let GlobalAppWindow = GetAppMainWindow(FocusWindow)
let GlobalTopWindow = GetTopLevelWindow(FocusWindow)
If FocusRedirected (FocusWindow) Then
	return
EndIf
ProcessSayAppWindowOnFocusChange(GlobalAppWindow,FocusWindow)
ProcessSayTopWindowOnFocusChange(GlobalAppWindow,GlobalTopWindow,RealWindow,FocusWindow)
ProcessSayRealWindowOnFocusChange(GlobalAppWindow,RealWindow,RealWindowName,FocusWindow)
let GlobalFocusWindow = FocusWindow
ProcessSayFocusWindowOnFocusChange (RealWindowName, FocusWindow)
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = GlobalAppWindow
let GlobalPrevTop = GlobalTopWindow
if GetWindowClass (globalPrevApp) == IEFrameClass then
	let globalLastIEWindow = GlobalPrevApp
EndIf
let GlobalPrevFocus = FocusWindow
let PrevDocumentName = GlobalDocumentName
let GlobalWasHJDialog = InHJDialog ()
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

void function SayContextHelp()
If !IsFormsModeActive() then
	;In forms mode we don't want to say context help here or we'll get it spoken twice
	NotifyIfContextHelp()
EndIf
EndFunction

Void Function SayFocusedWindow ()
var
	handle hwnd,
	handle hCheckBoxText,
	string sCheckBoxText,
	string sParentClass, ; for the Help application
	string sClass,
	string sFrame,
	string sHeading,
	handle hWndAdobe,
	int isubtype
If GlobalMenuMode>1 then
	Return
EndIf
If InHjDialog () then
	SayWindowTypeAndText (GlobalFocusWindow)
	If GetWindowSubtypeCode (GlobalFocusWindow) == WT_MULTILINE_EDIT then
		SayWindow (GlobalFocusWindow, READ_HIGHLIGHTED)
	EndIf
	Return
else
	; When JAWSFind is searching, InHJDialog may return false.
	; JAWSFindDialogIsRunning returns true if the JAWSFind dialog is running,
	; in which case nothing should be spoken while the focus briefly moves to the IE page.
	if JAWSFindDialogIsRunning() then
		return
	EndIf
EndIf
let sClass = GetWindowClass (GlobalFocusWindow)
if sClass != ie5Class then
	RestrictCursor (off)
EndIf
if globalFocusWindow == GetNavigationTreeView () then
	let hwnd = GetParent (GetParent (GlobalFocusWindow))
	SaveCursor ()
	InvisibleCursor ()
	MoveToWindow (hwnd)
	SayWord ()
	RestoreCursor ()
EndIf
if GetControlID (GetCurrentWindow())==ciLookIn
&& GetWindowClass (GetCurrentWindow())==wcEdit
&& !DialogActive() then
	SayFormattedMessage(OT_CONTROL_NAME, msgLookIn1)
	return
EndIf
If !DialogActive () then
	Let hWnd = GetParent (GlobalFocusWindow)
	While (hWnd)
		Let sParentClass = GetWindowClass (hWnd)
		Let hWnd = GetParent (hWnd)
	EndWhile
	If sParentClass == cWcHelpParent then
		SwitchToConfiguration ("HTML and Windows Help")
		Return;
	EndIf
EndIf
; speak frame and heading name if either have changed
if IsVirtualPCCursor() then
	if GlobalFocusWindow != GlobalPrevFocus then
		SetUpStuffForNewPage (TRUE);Force an update to the page itself.
	EndIf
	;we have removed the ability to speak heading and frame changes during focus change
	;in order to reduce sluggishness during tabbing.
	;if you want the ability back:
	;remove the semicolons commenting out the following two lines,
	;and then remove the semicolons which comment out the two if statements following this one
	;as well as the semicolons in the two lines which update the global variables following the if statements.
	;let sHeading=GetCurrentHeading()
	;let sFrame=GetHTMLFrameName()
endIf
;if sFrame !=cscNull
;&& sFrame !=sPriorFrame then
	;SayUsingVoice(vctx_message,sFrame,ot_screen_message)
;endIf
;if sHeading !=cscNull
;&& sHeading !=sPriorHeading then
	;sayUsingVoice(vctx_message,sHeading,ot_screen_message)
;endIf
;let sPriorFrame=sFrame
;let sPriorHeading=sHeading
;this is the end of the code which announces heading and frame changes.
If GlobalWasHJDialog then
	let iSubtype = GetObjectSubtypecode()
	if !iSubtype
	|| iSubtype == wt_multiline_edit
	|| iSubtype == wt_ReadOnlyEdit then
		SayLine ()
	else
		SayObjectTypeAndText()
	EndIf
	SayContextHelp()
	return
EndIf
;logic for security warning dialog checkbox:
If DialogActive ()
&& StringContains (GetWindowName (GetRealWindow (GlobalFocusWindow)), WnSecurityWarning)
&& GetControlID (GlobalFocusWindow) == ID_AlwaysTrustCheckBox  Then
	IndicateControlType (WT_CHECKBOX, gsAlwaysTrustText , GetObjectState ())
	return
EndIf
;if we have changed page tabs in IE,
;make sure that we announce focus line and we are on a plain text line,
;except if it is the title line:
if GlobalDocumentName != PrevDocumentName then
	if !GetObjectSubtypeCode()
	&& IsVirtualPCCursor()
	&& GetCursorRow() != 1 then
		SayLine()
		SayContextHelp()
		return
	EndIf
EndIf
if sClass == cwc_DirectUIhWND then
	if IsVirtualPCCursor() then
		SayAll()
		return
	EndIf
EndIf
SayFocusedObject ()
EndFunction

void function PageChangedEvent(handle hWnd, string PageName)
;PageChangedEvent may fire before or after FocusChangedEvent,
;and in some circumstances FocusChangedEvent may not fire at all even though the page name changes.
;In any case, either this event or the focus change should catch the page name change and announce it.
;the var GlobalDocumentName must be updated so that the test for page name change is valid.
if !IsVirtualRibbonActive()
&& PageName != GlobalDocumentName then
	let gbAnnounceValueAfterIEPageChanged = true
	Let PrevDocumentName = GlobalDocumentName
	let GlobalDocumentName = PageName
	;Only speak the document name if still in Internet Explorer.
	;The following condition prevents the page from speaking,
	;When the user has selected to 'Close all tabs' from
	;The msgAlert dialog in Windows Internet Explorer.
	;Probably this bug appears elsewhere, but that's all Test has found thus far.
	;Hence the compare between window ownerships.
	If (GetAppMainWindow (hWnd) == GetAppMainWindow (GetFocus  ())) then
		Say(GlobalDocumentName,OT_DIALOG_NAME)
	EndIf
EndIf
EndFunction

int function OnIE10TouchSwitchOrSlider()
var
	object o,
	string sClass,
	handle hWnd
if IsVirtualPCCursor() then
	return false
EndIf
let hWnd = GetFocus()
if GetWindowClass(hWnd) != cwc_DirectUIhWND
|| GetWindowClass(GetParent(hWnd)) != cwc_Windows_UI_Core_CoreWindow then
	return false
EndIf
let o = GetUIAObjectFocusItem()
if !o then
	return false
EndIf
let sClass = o.ClassName
return sClass == oc_TouchSwitch
	|| sClass == oc_TouchSlider
EndFunction

void function SayCharacterUnit(int UnitMovement)
if IsPCCursor()
&& !(IsLeftButtonDown() || IsRightButtonDown()) then
	if OnIE10TouchSwitchOrSlider() then
		;ValueChangedEvent speaks the new value:
		return
	EndIf
EndIf
SayCharacterUnit(UnitMovement)
EndFunction

void function SayWordUnit(int UnitMovement)
if IsPCCursor()
&& !(IsLeftButtonDown() || IsRightButtonDown()) then
	if OnIE10TouchSwitchOrSlider() then
		;ValueChangedEvent speaks the new value:
		return
	EndIf
EndIf
SayWordUnit(UnitMovement)
EndFunction

void function SayLineUnit(int unitMovement,optional  int bMoved)
if IsPCCursor()
&& !(IsLeftButtonDown() || IsRightButtonDown()) then
	if OnWin8IEAddressEdit() then
		;ItemSelectedEvent speaks the tile name,
		;so don't speak the address:
		return
	elif OnIE10TouchSwitchOrSlider() then
		;ValueChangedEvent speaks the new value:
		return
	EndIf
EndIf
SayLineUnit(unitMovement,bMoved)
EndFunction

void function SpeakHomeEndMovement()
if IsPCCursor()
&& !(IsLeftButtonDown() || IsRightButtonDown()) then
	if OnIE10TouchSwitchOrSlider() then
		;ValueChangedEvent speaks the new value:
		return
	EndIf
EndIf
SpeakHomeEndMovement()
EndFunction

void function SayPageUpDownUnit(int UnitMovement)
if IsPCCursor()
&& !(IsLeftButtonDown() || IsRightButtonDown()) then
	if OnIE10TouchSwitchOrSlider() then
		;ValueChangedEvent speaks the new value:
		return
	EndIf
EndIf
SayPageUpDownUnit(UnitMovement)
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int bIsFocusObject)
var
	int objType
if GetWindowClass(GetFocus())==ie5Class then
	let objType=getObjectSubtypeCode()
	if objType==wt_slider || objType==wt_leftrightslider || objType==wt_updownslider then
				if IEVersion >= 10 && bIsFocusObject then
			Say(sObjValue, ot_line, smartMarkupDetection)
		endIf
		return ; spoken by sayCharacterUnit because not all sliders generate valueChangedEvent and if we speak the ones which do from here, they'll be doublespoken.
	endIf
	if IEVersion >= 10
		if GetWindowClass(hwnd) == cwc_DirectUIhWND
			if sObjValue
			&& sObjName == scNotificationBarText
				;only speak the text if it is not the constantly updating output when multiple downloads are in progress:
				if !StringContains(sObjValue,msgMultipleDownloadsNotificationBarText_Part1)
				&& !StringContains(sObjValue,msgMultipleDownloadsNotificationBarText_Part2)
					SayFormattedMessage (OT_SCREEN_MESSAGE, msgNotificationBarRequiresResponse_L, msgNotificationBarRequiresResponse_S)
					Say(sObjValue, ot_line, smartMarkupDetection)
					BrailleMessage (msgNotificationBarRequiresResponse_S)
					BrailleMessage (sObjValue, TRUE); append to previous Braille message
				endIf
			endIf
			return
		endIf
	endIf
endIf
if gbAnnounceValueAfterIEPageChanged then
	if hwnd == FindDescendantWindow (GetAppMainWindow (GetFocus()), address_bar4) then
		;we must announce the value change on the address bar if the IE page changed:
		let gbAnnounceValueAfterIEPageChanged = false
		Say(sObjValue, ot_line, smartMarkupDetection)
		return
	EndIf
EndIf
ValueChangedEvent(hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

Script ReadCurrentScreen ()
if IsVirtualPCCursor () then
	PerformScript StartSkimRead()
	;SayFormattedMessage (ot_ERROR, cmsgHTML5_L, cmsgHTML5_S)
	return
EndIf
MoveToWindow (GetFocus ())
RestrictCursor (on)
SayAll ()
EndScript

Script ReadNextScreen ()
If DialogActive() then
	PerformScript NextDocumentWindowByPage ()
	Return;
EndIf
If IsVirtualPcCursor () then
	JAWSPageDown()
	Say(cmsg7_L,ot_message)
	SayLine()
	Return
EndIf
If GetWindowClass (GetFocus ()) != IE4Class then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	Return
EndIf
If !IsFormsModeActive() then
	let nSuppressEcho = TRUE
	PCCursor ()
	JAWSPageDown ()
	Delay (2)
	let nSuppressEcho = FALSE
	PerformScript ReadCurrentScreen()
EndIf
EndScript

Script ReadPriorScreen ()
If DialogActive() then
	PerformScript PreviousDocumentWindowByPage ()
	Return;
EndIf
If IsVirtualPcCursor () then
	JAWSPageUp()
	Say(cmsg8_L,ot_message)
	SayLine()
	Return
EndIf
If GetWindowClass (GetFocus ()) != IE4Class then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	Return
EndIf
If !IsFormsModeActive() then
	let nSuppressEcho = TRUE
	PCCursor ()
	JAWSPageUp ()
	Delay (2)
	let nSuppressEcho = FALSE
	PerformScript ReadCurrentScreen()
EndIf
EndScript

string function GetCurrentURL(handle hwndAddressEdit)
var
	int v,
	object o
let o = GetObjectFromEvent(hwndAddressEdit,-4,0,v)
return o.accValue(v)
EndFunction

handle function GetIEAddressBarWindow()
var
	handle hWnd
if IEVersion < 8 then
	return FindDescendantWindow (GetAppMainWindow (GetFocus ()), address_bar4)
else
	;depending on whether or not the mouse is on the address bar,
	;the address can appear in either of two windows:
	let hWnd = FindWindow(GetAppMainWindow (GetFocus ()),wc_AddressDisplayControl)
	if hWnd
	&& !IsWindowVisible(hwnd) then
		let hWnd = GetNextWindow(hWnd)
	EndIf
	return hWnd
EndIf
EndFunction

void function SayAddressBarURL(string sURL)
var
	string sMessage
if sURL then
	let sMessage = FormatString (msgAddress1_L, sURL)
	SayFormattedMessage (ot_user_requested_information, sMessage, sURL)
else
	SayFormattedMessage(ot_user_requested_information, msgAddressBar1_L, cmsgSilent)
EndIf
EndFunction

void function LegacyAddressBar()
var
	handle hwnd
let hwnd = GetIEAddressBarWindow()
if !hWnd then
	SayMessage (ot_ERROR, msgAddressBarNotFound1_L, msgAddressBarNotFound1_S)
	return
EndIf
if IsSameScript () then
	if IsWindowVisible (hwnd)
	&& !IsWindowObscured(hWnd) then
		JAWSCursor()
		MoveToWindow (hwnd)
		Delay(3)
		BrailleRefresh()
	else
		SayMessage(ot_error,msgAddressNotVisible_l,msgAddressNotVisible_S)
		return
	EndIf
EndIf
SayAddressBarURL(GetCurrentURL(hwnd))
EndFunction

Script AddressBar ()
if IEVersion <= 9 then
	LegacyAddressBar()
else
	SayAddressBarURL(GetDocumentPath())
EndIf
EndScript

Script ReadDownColumn ()
if IsJAWSCursor () then
	NextLine ()
	SayChunk ()
else
	PerformScript ControlDownArrow()
EndIf
EndScript

Script ReadUpColumn ()
if IsJAWSCursor () then
	PriorLine ()
	SayChunk ()
else
	PerformScript ControlUpArrow()
EndIf
EndScript

Script ReadColumnLeft ()
if IsJAWSCursor () then
	PriorChunk ()
	;scRightBracket="]"
	while (GetCharacter() == cscNULL) || (GetCharacter() == scRightBracket)
		PriorChunk ()
	EndWhile
	SayChunk ()
else
	PerformScript SayPriorWord()
EndIf
EndScript

Script ReadColumnRight ()
if IsJAWSCursor () then
	NextChunk ()
	;scRightBracket="]"
	while (GetCharacter() == cscNULL) || (GetCharacter() == scRightBracket)
		NextChunk ()
	EndWhile
	SayChunk()
else
	PerformScript SayNextWord()
EndIf
EndScript

string function AddToString (string sFirstString, string sSecondString)
let sFirstString = sFirstString + cScBufferNewLine + sSecondString + cScBufferNewLine
return sFirstString
EndFunction

void Function ScreenSensitiveHelpForKnownClasses (int nSubTypeCode)
var
	string sPageElements
If IsVirtualPCCursor () then
	If !IsJavaWindow (GetCurrentWindow ()) then
		If nSubTypeCode > 0 then
			ScreenSensitiveHelpVirtualCursor(nSubTypeCode)
			Return
		endIf
	endIf
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
var string sCustomScreenSensitiveHelpMsg = GetCustomScreenSensitiveHelpForKnownClasses (nSubTypeCode)
if sCustomScreenSensitiveHelpMsg
	ShowScreenSensitiveHelp(sCustomScreenSensitiveHelpMsg)
	return
endIf
if nSubTypeCode == WT_EDIT
|| nSubTypeCode == WT_MULTILINE_EDIT then
	if IsIE7SearchEdit(GlobalFocusWindow) then
		SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelp16_L
			+cscBufferNewLine+cscBufferNewLine
			+msgIE7SearchControlEditScreenSensitiveAppendedHelp)
		AddHotKeyLinks ()
		Return
	EndIf
endIf
ScreenSensitiveHelpForKnownClasses(nSubTypeCode)
EndFunction

Script HotKeyHelp ()
var
	handle WinHandle,
	string TheClass,
	string sTemp_L,
	string sTemp_S
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
WinHandle = GetFocus ()
TheClass = GetWindowClass(WinHandle)
sTemp_L = FormatString(msgHotKeyHelp1_L) + cScBufferNewLine
sTemp_S = FormatString(msgHotKeyHelp1_S) + cScBufferNewLine
if TheClass == ie5Class
|| GetWindowClass (GetParent (WinHandle)) == ie5Class then
	if IsVirtualPcCursor () then
		BrowserVirtualHotKeyHelp ()
		return
	EndIf
	sTemp_L = AddToString(sTemp_L,FormatString(msgFormsModeHotKeyHelp_L))
	sTemp_S = AddToString(sTemp_S,FormatString(msgFormsModeHotKeyHelp_S))
	SayFormattedMessage (ot_user_buffer, sTemp_L)
	UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	return
EndIf
GeneralJAWSHotKeys ()
EndScript

Script ScreenSensitiveHelp ()
; For support of the Virtual PC Cursor
; namely new class and window types known to JAWS w/ Virtual PC Cursor enabled
; This will not change performance when Virtual PC Cursor is not enabled
; Forms Mode is now respected, and responds correctly with appropriate ScreenSensitiveHelp
var
	int iWinType,
	int iControl,
	string sObjName,
	string sObjHelp
if IsSameScript () then
	AppFileTopic (topic_Internet_Explorer_5_0)
	return
EndIf
sObjHelp = GetObjectHelp ()
If sObjHelp then
	SayMessage (OT_USER_BUFFER, sObjHelp)
	AddHotKeyLinks ()
	Return
EndIf
if GlobalMenuMode > 0 then
	PerformScript ScreenSensitiveHelp()
	return
EndIf
If UserBufferIsActive () then
	PerformScript ScreenSensitiveHelp()
	Return
EndIf
If ScreenSensitiveHelpForJAWSDialogs() then
	Return
EndIf
iWinType = GetWindowSubTypeCode (GetCurrentWindow ())
If !iWinType then;For new control types
	iWinType = GetObjectSubTypeCode ()
EndIf
if iWinType > 0 then
	ScreenSensitiveHelpForKnownClasses (iWinType)
	return
EndIf
if GetWindowClass (GetCurrentWindow ()) == IE5Class then
	iWinType = GetObjectSubTypeCode ()
	;For Forms Mode
	if iWinType > 0 then
		SayFormattedMessage (OT_NO_DISABLE, msgFormsModeOn)
		ScreenSensitiveHelpForKnownClasses (iWinType)
		return
	EndIf
	SayNumOfPageElements ()
 	return
EndIf
if ieVersion >= ie5 then
	ScreenSensitiveHelp4 ()
else
	ScreenSensitiveHelp3 ()
EndIf
EndScript

; *****
; functions specifically written for ie5
; *****
Void Function SaySelectedLink4 ()
SayFocusedObject ()
EndFunction

handle Function GetToolbar ()
var
	handle hWnd
let hWnd = FindDescendantWindow (GetAppMainWindow (GetFocus ()), tool_bar)
if hWnd && GetWindowClass (hWnd) == wc_toolbar then
	return hWnd
EndIf
return 0
EndFunction

Void Function ClickToolBarButton (handle winHandle, string buttonLabel)
var
	string sMessageLong,
	string sMessageShort
SaveCursor ()
JAWSCursor ()
if FindString (winHandle, buttonLabel, s_top, s_restricted) then
	pause ()
	LeftMouseButton ()
else
	let sMessageLong = FormatString (msgLabelNotFound1_L, ButtonLabel)
	let sMessageShort = FormatString (msgLabelNotFound1_S, ButtonLabel)
	SayFormattedMessage (ot_ERROR, sMessageLong, sMessageShort)
EndIf
EndFunction

int Function FindString (handle hwnd, string str, int direction, int restriction)
; overrides the built-in FindString to handle searching for labels in the toolbar.
var
	int c,
	int x,
	int y
if GetControlID (hwnd) == tool_bar
&& GetWindowSubTypeCode (hwnd) == wt_toolbar
&& restriction then
; the search is restricted to the IE toolbar, so search on your own!
	SaveCursor ()
	InvisibleCursor ()
	MoveToWindow (hwnd)
	RestrictCursor (off)
	while GetCurrentWindow () == hwnd && c<20
		if GetWord () == str then
			let x = GetCursorCol ()
			let y = GetCursorRow ()
			RestoreCursor ()
			JAWSCursor ()
			MoveTo (x,y)
			return 1
		EndIf
		NextWord ()
		let c = c+1
	endwhile
	return 0
else
	return FindString (hwnd, str, direction, restriction)
EndIf
EndFunction

string function GetBrowserName(optional int includeMaker)
if includeMaker
	return msgMicrosoftInternetExplorerAppName
else
	return msgInternetExplorerAppName
endIf
EndFunction

Void Function ScreenSensitiveHelp4 ()
var
	handle hwnd,
	String TheClass,
	object doc,
	object window,
	object forms,
	object frames,
	int nFrames,
	int nForms,
	int iObjType,
	string strBuffer,
	string strTemp
let hwnd = GetCurrentWindow ()
let TheClass = GetWindowClass (hwnd)
if TheClass == ie5Class then
	let iObjType = GetObjectSubTypeCode (); for Forms Mode
	if iObjType > 0 then
		if GetJcfOption (OPT_VIRTUAL_PC_CURSOR) > 0 then
			SayFormattedMessage (OT_HELP, msgFormsModeOn1)
		EndIf
		ScreenSensitiveHelpForKnownClasses (iObjType)
		return
	EndIf
	SayNumOfPageElements ()
	return
EndIf
if IsLinksList (hwnd) then
	SayFormattedMessage (ot_help, msgScreenSensitiveHelp2_L, msgScreenSensitiveHelp2_S)
	return
EndIf
if IsToolbarList (hwnd) then
	SayFormattedMessage (ot_help, msgScreenSensitiveHelp3_L, msgScreenSensitiveHelp3_S)
	return
EndIf
PerformScript ScreenSensitiveHelp ()
EndFunction

int Function IsToolbarList (handle hwnd)
if GetWindowSubtypeCode (hwnd) == wt_listbox then
	if GetWindowClass (GetAppMainWindow (hwnd)) == wc_JAWS then
		if GetWindowName (GetRealWindow (hwnd)) == ToolbarDialogName then
			return TRUE
		EndIf
	EndIf
EndIf
return FALSE
EndFunction

Int Function IsLinksList (handle hwnd)
if GetWindowSubtypeCode (hwnd) == wt_listbox then
	if GetWindowClass (GetAppMainWindow (hwnd)) == wc_JAWS then
		if GetWindowName (GetRealWindow (hwnd)) == SelectALinkDialogName then
			return TRUE
		EndIf
	EndIf
EndIf
return FALSE
EndFunction

Void Function SayWindowTypeAndTextForNonstandardDialogs (handle hwnd, string name)
var
	string sMessage
let sMessage = FormatString (msgDialog1_L, name)
Say(sMessage,ot_dialog_name)
let hwnd = GetFirstChild (hwnd)
while hwnd
	if GetWindowSubTypeCode (hwnd) == wt_static
	|| GetWindowClass(hWnd) == cwc_SysLink then
		SayWindow (hwnd, read_everything)
	EndIf
	let hwnd = GetNextWindow (hwnd)
EndWhile
EndFunction

void Function SayWindowTypeAndText (handle hWnd)
var
	string sName,
	string sText
if InHomeRowMode() then
	return builtin::SayWindowTypeAndText(hWnd)
EndIf
If hWnd == GetAppMainWindow (GetFocus ())
&& GetWindowSubtypeCode (GetFocus()) == WT_LISTVIEW then
 	Return Say (GetWindowName (hWnd), OT_CONTROL_NAME);
EndIf
if GetWindowSubtypeCode(hWnd) == wt_dialog then
	let sName = GetWindowName(hWnd)
	let sText = GetWindowTextEx(hWnd,0,0)
	if StringLength(sText) > StringLength(sName)
	&& StringContains(sText,sName) then
		IndicateControlType(wt_dialog,sName,cmsgSilent)
		Say(StringDiff(sText,sName),ot_dialog_text)
		return
	EndIf
EndIf
Return SayWindowTypeAndText (hWnd)
EndFunction

Void Function SelectALink4 ()
var
	object doc,
	object links,
	object all,
	int nLinks,
	string buffer,
	string strTemp,
	int nIdx
if ieVersion == IE3 then
	SayFormattedMessage (ot_ERROR, msgFeatureNotAvailable1_L, msgFeatureNotAvailable1_S)
	return
EndIf
let doc = ie4GetCurrentDocument ()
let links = doc.links
let all = doc.all
let nLinks = links.length
if nLinks == 0 then
	SayFormattedMessage (ot_ERROR, msgNoLinks1_L, msgNoLinks1_S )
	return
EndIf
let nIdx = 0
while nIdx < nLinks
	let strTemp = links(nIdx).InnerText
	if ! strTemp then
		let strTemp = all(links(nIdx).SourceIndex + 1).alt
	EndIf
	if ! strTemp then
		let strTemp = links(nIdx).href
	EndIf
	let buffer = buffer + Separator + strTemp
	let nIdx = nIdx+1
EndWhile
let nIdx = DlgSelectItemInList (buffer, SelectALinkDialogName, false)
if nIdx == 0 then
	return
EndIf
doc.links(nIdx-1).focus
doc.links(nIdx-1).click
EndFunction

String Function GetToolBarButtons (handle hWnd, string ByRef sToolBarItemsIndex)
Var
	int iIndex,
	int iLeft,
	int iRight,
	int iTop,
	int iBottom,
	string sToolbarItems,
	string sToolBarBtn
If !hWnd
|| !IsWindowVisible (hWnd) Then
	let sToolbarItemsIndex = cscNull
	SayFormattedMessage (OT_ERROR, msgToolBarNotFound1_L)
	return cscNull
EndIf
let iIndex = 1
While  tbGetItemRect (hWnd, iIndex, iLeft, iRight, ITop, iBottom)
	let sToolBarBtn = TBGetItemText (hWnd, iIndex)
	If sToolBarBtn != cscNull Then
		let sToolbarItems = sToolbarItems + KeyLabelSeparator   +sToolbarBtn
		let sToolBarItemsIndex = sToolBarItemsIndex + IntToString (iIndex) + KeyLabelSeparator
	EndIf
	let iIndex = iIndex + 1
EndWhile
let sToolBarItems = StringChopLeft (sToolBarItems, 1); remove the left most  | character
return sToolbarItems
EndFunction

Int Function DetermineToolBarButtonIndex (string sDialogName, string sButtonList, string sButtonIndex)
Var
	int iIndex
let iIndex = DlgSelectItemInList (sButtonList, sDialogName, FALSE)
If !iIndex  Then
	return 0
EndIf
return StringToInt (StringSegment (sButtonIndex, KeyLabelSeparator , iIndex))
	EndFunction
	Script ToolBar ()
var
	handle hWnd,
	int item,
	int iIndex,
		int iBottom,
		int iLeft,
		int iRight,
		int iTop,
		int x,
		int y,
		int iState,
		string sButtonList,
		string sButtonIndex
let hWnd = GetToolbar ()
if InHJDialog () then
	SayFormattedMessage (OT_ERROR, cmsg337_L, cmsg337_S)
	return
EndIf
let sButtonList = GetToolBarButtons (hWnd, sButtonIndex)
If sButtonList == cscNull Then
	return
EndIf
let iIndex = DetermineToolBarButtonIndex (ToolbarDialogName, sButtonList, sButtonIndex)
If !iIndex Then
	return ;no slection made in dialog
EndIf
let iState = TBGetItemState (hWnd, iIndex)
If iState & CTRL_DISABLED Then
	SayFormattedMessage (OT_ERROR, MsgButtonDisabled_L, MsgButtonDisabled_S)
	return
EndIf
; Make sure the button can be located within the tool bar
If TBGetItemRect (hWnd, iIndex, iLeft, iRight, iTop, iBottom) Then
	SaveCursor ()
	InvisibleCursor ()
	let x = ((IRight - ILeft) /2) + iLeft
	let y = ((iBottom - iTop) /2) + iTop
	MoveTo (x,y)
RoutePCToInvisible ()
RestoreCursor ()
return
EndIf
SayFormattedMessage (OT_ERROR, MsgButtonNotFound_L, MsgButtonNotFound_S)
/*let item = dlgSelectItemInList (strToolbar, ToolbarDialogName, true)
let nSuppressEcho = true
delay (2)
If item == BackButton then
	ClickToolBarButton (winHandle, fsBack1)
ElIf item == EditButton then
	ClickToolBarButton (winHandle, fsEdit1)
ElIf item == FavoritesButton then
	ClickToolBarButton (winHandle, fsFavorites1)
ElIf item == ForwardButton then
	ClickToolBarButton (winHandle, fsForward1)
ElIf item == HistoryButton then
	ClickToolBarButton (winHandle, fsHistory1)
ElIf item == HomeButton then
	ClickToolBarButton (winHandle, fsHome1)
ElIf item == MailButton then
	ClickToolBarButton (winHandle, fsMail1)
ElIf item == PrintButton then
	ClickToolBarButton (winHandle, fsPrint1)
ElIf item == RefreshButton then
	ClickToolBarButton (winHandle, fsRefresh1)
ElIf item == SearchButton then
	ClickToolBarButton (winHandle, fsSearch1)
ElIf item == StopButton then
	ClickToolBarButton (winHandle, fsStop1)
EndIf
let nSuppressEcho = false*/
EndScript

handle		 Function GetNavigationTreeView ()
var
	handle hwnd
let hwnd = FindDescendantWindow (GetAppMainWindow (GetFocus ()), navigation_treeview)
if hwnd
&& GetWindowClass (hwnd) == wc_treeview
&& GetWindowClass (GetParent (hwnd)) == wc_syspager then
	return hwnd
else
	return 0
EndIf
EndFunction

Void Function AddFramesInWindow (object window, string ByRef strBuf)
var
	object frames,
	int nFrames,
	int i,
	object win,
	string strTemp
let frames = window.frames
let nFrames = frames.length
let i = 0
while i < nFrames && i < 10
	let win = IEGetUnrestrictedWindow(frames(i))
	let strTemp =win.FrameElement.title
	if strTemp==cscNull then
		let strTemp=win.name
	endIf
	if strTemp == cscNull then
		let strTemp = win.location.href
	EndIf
	let strBuf = strBuf + LIST_ITEM_SEPARATOR + strTemp
	let i = i + 1
EndWhile
EndFunction

handle Function GetIEServerWindow (handle hwnd)
var
	handle hIEWindow
let hIEWindow = hwnd
while hIEWindow
	if GetWindowClass (hIEWindow) == ie5Class then
		return hIEWindow
	EndIf
	let hIEWindow = GetParent (hIEWindow)
endwhile
let hIEWindow = GetFirstChild (GetAppMainWindow (hwnd))
while hIEWindow && GetWindowClass (hIEWindow) != strShellView
	let hIEWindow = GetNextWindow (hIEWindow)
endwhile
let hIEWindow = GetFirstChild (hIEWindow)
while hIEWindow && GetWindowClass (hIEWindow) != ie5Class
	let hIEWindow = GetNextWindow (hIEWindow)
endwhile
return hIEWindow
EndFunction

object Function GetFrameInHierarchy (int index, object startWindow)
var
	object frames,
	int nFrames,
	int i,
	int j,
	object windows,
	int nWindows,
	object oNull
let frames = startWindow.frames
let nFrames = frames.length
if index <= nFrames then
	let i = 0
	while i < nFrames
		if i == index - 1 then
			return IEGetUnrestrictedWindow(frames(i))
		EndIf
		let i = i + 1
	endwhile
else
	let index = index - nFrames
EndIf
let windows = startWindow.frames
let nWindows = windows.length
let j = 0
while j < nWindows
	let frames = windows(j).frames
	let nFrames = frames.length
	if index <= nFrames then
		let i = 0
		while i < nFrames
			if i == index - 1 then
				return IEGetUnrestrictedWindow(frames(i))
			EndIf
			let i = i + 1
		endwhile
	else
		let index = index - nFrames
	EndIf
	let j = j + 1
endwhile
return oNull
EndFunction

int Function GetFrameNumber(object all,int nElement)
var
	string strTag,
	int i,
	int nFrame,
	int nElements
let nFrame = 0
let nElements = all.length()
let i = 0
while i< nElements	let strTag = all(i).tagname
	;make sure we don't match FrameSet as Frame
	if StringLength(strTag) == 5
	&& strTag == strFrame then
		if i == nElement then
			return nFrame
		EndIf
		let nFrame = nFrame + 1
	EndIf
	let i = i + 1
EndWhile
return 999
EndFunction

Void Function SpeakDocument (object doc)
var
	int nElement,
	int nFrame,
	object all,
	object textRange
if ! doc then
	let doc = ie4GetCurrentDocument ()
	let nElement = ie4GetFocus()
	let all = doc.all()
	if all (nElement).tagname == strFrame then
		let nFrame =  GetFrameNumber(all,nElement)
		let doc = doc.Frames(nFrame).document()
	EndIf
EndIf
let textRange = doc.body.createTextRange()
Say(textRange.text, ot_NO_DISABLE)
EndFunction

Script SelectAFrame ()
var
	object doc,
	object topWindow,
	object windows,
	int nWindows,
	int i,
	string strBuf,
	int index,
	object frame
if InHJDialog () then
	SayFormattedMessage (OT_ERROR, cmsg337_L, cmsg337_S)
	return
EndIf
if IsVirtualPCCursor() then
	if IsManagedVirtualHelpActive() then
		EnsureNoUserBufferActive(false)
	EndIf
	let strBuf=GetHTMLFrameNames(LIST_ITEM_SEPARATOR)
	if strBuf then
		let index = DlgSelectItemInList (strBuf, SelectAFrameDialogName, false)
		if index > 0 then
			if MoveToHTMLFrameByIndex(index) then
				return
			endIf
		endIf
		return
	else
		SayFormattedMessage (ot_ERROR, msgNoFrames1_L, msgNoFrames1_S)
		return
	endIf
endIf
let doc = ie4GetCurrentDocument ()
let topWindow = doc.parentWindow
let topWindow = topWindow.top
AddFramesInWindow (topWindow, strBuf)
let windows = topWindow.frames
let nWindows = windows.length
let i = 0
while i<nWindows
	AddFramesInWindow (windows(i), strBuf)
	let i = i + 1
endwhile
if strBuf != cscNull then
	let index = DlgSelectItemInList (strBuf, SelectAFrameDialogName, false)
	if index > 0 then
		let frame = GetFrameInHierarchy (index, topWindow)
		if frame then
			frame.document.body.focus ()
			let nSuppressEcho = true
			delay (2)
			ActivateMenuBar ()
			ActivateMenuBar ()
			SpeakDocument (frame.document)
			let nSuppressEcho = false
		EndIf
	EndIf
else
	SayFormattedMessage (ot_ERROR, msgNoFrames1_L, msgNoFrames1_S)
EndIf
EndScript

Script NextFrame ()
var
	object null,
	handle hWnd
if IEVersion >= 7 then
	let hWnd = GetFocus()
	if GetWindowClass (hWnd) == ie5Class
	|| GetWindowClass (GetParent(hWnd)) == wc_AddressBarParent then
		TypeKey (ks3)
		return
	EndIf
EndIf
if GetWindowClass (GetFocus ()) == ie5Class then
	let nSuppressEcho = TRUE
EndIf
TypeKey (ks3)
delay (1)
if GetWindowClass (GetFocus ()) == ie5Class then
	SpeakDocument (null)
	;read the entire content of the new frame with focus
	let nSuppressEcho = FALSE
EndIf
setUpStuffForNewPage ()
EndScript

Script PriorFrame ()
var
	object null,
	handle hWnd
if IEVersion >= 7 then
	let hWnd = GetFocus()
	if GetWindowClass (hWnd) == ie5Class
	|| GetWindowClass (GetParent(hWnd)) == wc_AddressBarParent then
		TypeKey (ks4)
		return
	EndIf
EndIf
if GetWindowClass (GetFocus ()) == ie5Class then
	let nSuppressEcho = TRUE
EndIf
TypeKey (ks4)
delay (1)
if GetWindowClass (GetFocus ()) == ie5Class then
	SpeakDocument (null)
	;read the entire content of the new frame with focus
	let nSuppressEcho = FALSE
EndIf
setUpStuffForNewPage ()
EndScript

void function DoBackSpace()
var
	int TheTypeCode
PCCursor ()
let TheTypeCode = GetWindowSubtypeCode (GetCurrentWindow())
if IsVirtualPCCursor () then
	let BackForward = 1
EndIf
DoBackSpace()
EndFunction

script JAWSBackspace()
DoBackSpace()
EndScript

script Backspace()
DoBackSpace()
EndScript

Script WindowKeysHelp ()
if GetWindowClass (GetFocus () == IE5Class) then
	If UserBufferIsActive() Then
			UserBufferClear()
	EndIf
	SayMessage(ot_user_buffer,
		FormatString(msgWindowsKeyHelp,
			GetScriptKeyName("MoveToNextLink"),
			GetScriptKeyName("MoveToPriorLink"),
			;GetScriptKeyName("Enter"),
			GetScriptKeyName("GoBack"),
			GetScriptKeyName("GoForward"))
			+cscBufferNewLine)
	UserBufferAddText(cmsgWindowKeysHelp1_L)
	UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
	return
EndIf
PerformScript WindowKeysHelp ()
EndScript

Script SayWindowPromptAndText ()
var
	int nMode,
	handle hWnd,
	string sMsg
if handleNoCurrentWindow() then
	return
endIf
If IsVirtualPCCursor () then
	PerformScript VirtualSayWindowPromptAndText ()
	CheckIE9NotificationBar()
	Return
EndIf
If !GlobalMenuMode
&& IsMSAAWindow (GetCurrentWindow ())
&& !InHjDialog () then
	let nMode=smmTrainingModeActive()
	smmToggleTrainingMode(TRUE)
	if getObjectSubtypeCode(2,1)==wt_table && getObjectSubTypeCode(2,2)==wt_groupbox then
		;A table within a groupbox is most likely a Date Picker, read the name of the groupbox which contains the month name.
		say(getObjectname(1,2),OT_CONTROL_GROUP_NAME)
		sayColumnHeader()
		sayCell()
	else
		SaySelectedLink4 ()
		;Notify if auto suggestion is visible:
		let hWnd = FindTopLevelWindow(cwc_AutoSuggestDropdown,cscNull)
		if hWnd
		&& IsWindowVisible(hWnd) then
			let hWnd = GetLastWindow(GetFirstChild(hwnd))
			if hWnd
			&& IsWindowVisible(hwnd)
			&& GetWindowClass(hWnd) == cscListviewClass then
				let sMsg = lvGetItemText(hWnd,lvGetFocusItem(hWnd),1)
				if sMsg then
					SayUsingVoice(vctx_message,sMsg,ot_jaws_message)
				EndIf
			EndIf
		EndIf
	endIf
	SayTutorialHelp(GetObjectSubtypeCode(), TRUE)
	SayTutorialHelpHotKey(GetCurrentWindow(), TRUE)
	IndicateComputerBraille (getCurrentWindow ())
	SpeakProgressBarInfo(TRUE)
	smmToggleTrainingMode(nMode)
ElIf DialogActive ()
&& StringContains (GetWindowName (GetRealWindow (GlobalFocusWindow)), WnSecurityWarning) Then
	let nMode=smmTrainingModeActive()
	smmToggleTrainingMode(TRUE)
	If GetControlID (GlobalFocusWindow) == ID_AlwaysTrustCheckbox Then
		IndicateControlType (WT_CHECKBOX, gsAlwaysTrustText , GetObjectState ())
		SayTutorialHelp (GetObjectSubtypeCode(), TRUE)
		SayTutorialHelpHotKey (GlobalFocusWindow, TRUE)
	EndIf
	smmToggleTrainingMode (nMode)
Else
	PerformScript SayWindowPromptAndText ()
EndIf
EndScript

Script SayLine ()
Var
	handle hWnd,
	int iSubtype,
	string sRealName,
	string sName
if handleNoCurrentWindow() then
	return
endIf
If IsVirtualPcCursor ()
|| IsFormsModeActive() then
	if isVirtualPcCursor () then
	;Smart Navigation:
		if DecrementSmartNavOnDoublePress() then
			sayLine()
			return
		endIf
	endIf
	PerformScript SayLine ()
	NotifyIfContextHelp()
	Return
EndIf
If IsSameScript () then
	SpellLine ()
	Return
EndIf
If DialogActive () then
	let hWnd = GetFocus()
	let iSubtype = GetWindowSubtypeCode(hWnd)
	if !iSubtype then
		let iSubtype = GetObjectSubtypeCode()
	EndIf
	if iSubtype == WT_EDIT_SPINBOX then
		if GetWindowSubtypecode(GetPriorWindow(hWnd)) != wt_static then
			IndicateControlType(iSubtype,GetObjectName(true))
			return
		EndIf
	EndIf
	if IEVersion >= 7 then
		let sRealName = GetWindowName (GetRealWindow (GlobalFocusWindow))
		if StringCompare(sRealName,wn_InternetOptions) == 0 then
			if GetObjectSubtypeCode() == wt_button then
				let sName = GetObjectName()
				if StringCompare(sName,objn_settings_button) == 0
				|| StringCompare(sName,objn_Delete_button) == 0 then
					SayObjectTypeAndText()
					return
				EndIf
			EndIf
			if iSubtype == wt_multiline_edit then
				Say(GetLine(),ot_line)
				return
			ElIf iSubtype == wt_UpDownSlider then
				if GetControlID(GlobalFocusWindow) == id_Privacy_Settings_slider then
					SayWindowTypeAndText(GlobalFocusWindow)
					return
				EndIf
			EndIf
		EndIf
	EndIf
	If StringContains (sRealName, WnSecurityWarning) Then
		If GetControlID (GlobalFocusWindow) == ID_AlwaysTrustCheckBox Then
			IndicateControlType (WT_CHECKBOX, gsAlwaysTrustText , GetObjectState ())
			return
		EndIf
	EndIf
	If InHjDialog ()
	&& IsPcCursor () then
		If GetWindowSubtypeCode (GetFocus ()) == WT_LISTBOX
		&& ! StringToInt (PositionInGroup ()) then
			Say (GetWindowText (GetFocus (), TRUE), OT_LINE)
			Return
		EndIf
	EndIf
	PerformScript SayLine ()
	Return
EndIf
If GetControlID (GetCurrentWindow()) == ciLookIn
&& GetWindowClass (GetCurrentWindow()) == wcEdit then
	Say(GetLine(), ot_line)
	let globalSayingCurrentItem = 1
else
	PerformScript SayLine ()
EndIf
EndScript

Script SayNextLine ()
var
	int iSubtype
	if gbIsImeActive then
		PassKeyThrough()
		TypeKey(cksDownArrow)
		return
	endif

If !IsPcCursor ()
|| GlobalMenuMode then
	PerformScript SayNextLine ()
	Return
EndIf
If GetWindowSubtypeCode (GetCurrentWindow ()) == WT_EXTENDEDSELECT_LISTBOX
&& !IsVirtualPcCursor () && IsMSAAWindow (GetCurrentWindow ()) then
	NextLine ()
	; active item changed event will fire to speak new MSAA item
	Return
EndIf
If IsVirtualPcCursor () then
	PerformScript SayNextLine ()
	NotifyIfContextHelp()
	Return
elIf IsFormsModeActive() then
	PerformScript SayNextLine ()
	let iSubtype = GetObjectSubtypeCode()
	if iSubtype != wt_ListBoxItem
	&& iSubtype != wt_TreeViewItem then
		;we don't want notification as we navigate the list or tree
		NotifyIfContextHelp()
	EndIf
	Return
EndIf
If DialogActive () then
	if IEVersion >= 7 then
		if StringCompare(GetWindowName (GetRealWindow (GlobalFocusWindow)),wn_InternetOptions) == 0 then
			if GetWindowSubtypeCode(GlobalFocusWindow) == wt_multiline_edit then
				NextLine()
				Say(GetLine(),ot_line)
				return
			EndIf
		EndIf
	EndIf
EndIf
PerformScript SayNextLine ()
EndScript

Script SayPriorLine ()
var
	int iSubtype

	if gbIsImeActive then
		PassKeyThrough()
		TypeKey(cksDownArrow)
		return
	endif

If !IsPcCursor ()
|| GlobalMenuMode then
	PerformScript SayPriorLine ()
	Return
EndIf
If GetWindowSubtypeCode (GetCurrentWindow ()) == WT_EXTENDEDSELECT_LISTBOX
&& !IsVirtualPcCursor ()
&& IsMSAAWindow (GetCurrentWindow ()) then
	PriorLine ()
	; active item changed should fire to read the new MSAA item
	Return
EndIf
If IsVirtualPcCursor () then
	PerformScript SayPriorLine ()
	NotifyIfContextHelp()
	Return
elIf IsFormsModeActive() then
	PerformScript SayPriorLine ()
	let iSubtype = GetObjectSubtypeCode()
	if iSubtype != wt_ListBoxItem
	&& iSubtype != wt_TreeViewItem then
		;we don't want notification as we navigate the list or tree
		NotifyIfContextHelp()
	EndIf
	Return
EndIf
If DialogActive () then
	if IEVersion >= 7 then
		if StringCompare(GetWindowName (GetRealWindow (GlobalFocusWindow)),wn_InternetOptions) == 0 then
			if GetWindowSubtypeCode(GlobalFocusWindow) == wt_multiline_edit then
				PriorLine()
				Say(GetLine(),ot_line)
				return
			EndIf
		EndIf
	EndIf
EndIf
PerformScript SayPriorLine ()
EndScript

void function DoPageUp()
var
	int iSubtype
If IsVirtualPcCursor() then
	DoPageUp()
	NotifyIfContextHelp()
	Return
elIf IsFormsModeActive() then
	DoPageUp()
	let iSubtype = GetObjectSubtypeCode()
	if iSubtype != wt_ListBoxItem
	&& iSubtype != wt_TreeViewItem then
		;we don't want notification as we navigate the list or tree
		NotifyIfContextHelp()
	EndIf
	Return
EndIf
If DialogActive () then
	if IEVersion >= 7 then
		if StringCompare(GetWindowName (GetRealWindow (GlobalFocusWindow)),wn_InternetOptions) == 0 then
			if GetWindowSubtypeCode(GlobalFocusWindow) == wt_multiline_edit then
				JAWSPageUp()
				Say(GetLine(),ot_line)
				return
			EndIf
		EndIf
	EndIf
EndIf
DoPageUp ()
EndFunction

Script JAWSPageUp ()
DoPageUp()
EndScript

Script PageUp ()
DoPageUp()
EndScript

void function DoPageDown()
var
	int iSubtype
If IsVirtualPcCursor() then
	DoPageDown ()
	NotifyIfContextHelp()
	Return
elIf IsFormsModeActive() then
	DoPageDown()
	let iSubtype = GetObjectSubtypeCode()
	if iSubtype != wt_ListBoxItem
	&& iSubtype != wt_TreeViewItem then
		;we don't want notification as we navigate the list or tree
		NotifyIfContextHelp()
	EndIf
	Return
EndIf
If DialogActive () then
	if IEVersion >= 7 then
		if StringCompare(GetWindowName (GetRealWindow (GlobalFocusWindow)),wn_InternetOptions) == 0 then
			if GetWindowSubtypeCode(GlobalFocusWindow) == wt_multiline_edit then
				JAWSPageDown()
				Say(GetLine(),ot_line)
				return
			EndIf
		EndIf
	EndIf
EndIf
DoPageDown ()
EndFunction

Script JAWSPageDown ()
DoPageDown()
EndScript

Script PageDown ()
DoPageDown()
EndScript

Script TopOfFile ()
var
	int iSubtype

if InARIAGrid () then
	JAWSTopOfFile ()	
	return
EndIf

PerformScript TopOfFile () ; default
if IsFormsModeActive() then
	let iSubtype = GetObjectSubtypeCode()
	if iSubtype == wt_ListBoxItem
	|| iSubtype == wt_TreeViewItem then
		;we don't want notification as we navigate the list or tree
		return
	EndIf
EndIf

NotifyIfContextHelp()
EndScript

Script SayWord ()
if handleNoCurrentWindow() then
	return
endIf
if isVirtualPcCursor () then
;Smart Navigation:
	if DecrementSmartNavOnDoublePress() then
		sayWord()
		return
	endIf
endIf
If IsSameScript () Then
	SpellWord()
	SayExpandedAcronymOrAbbreviation()
	AddHook (HK_SCRIPT, "SpellWordHook")
	return
EndIf
If DialogActive () then
	If StringContains (GetWindowName (GetRealWindow (GlobalFocusWindow)), WnSecurityWarning) Then
		If GetControlID (GlobalFocusWindow) == ID_AlwaysTrustCheckBox Then
			IndicateControlType (WT_CHECKBOX, gsAlwaysTrustText , GetObjectState ())
			return
		EndIf
	EndIf
EndIf
PerformScript SayWord ()
EndScript

Script BottomOfFile ()
var
	int iSubtype

if InARIAGrid () then
	JAWSBottomOfFile ()	
	return
EndIf

PerformScript BottomOfFile ()
if IsFormsModeActive() then
	let iSubtype = GetObjectSubtypeCode()
	if iSubtype == wt_ListBoxItem
	|| iSubtype == wt_TreeViewItem then
		;we don't want notification as we navigate the list or tree
		return
	EndIf
EndIf
NotifyIfContextHelp()
EndScript

int function ProcessHJDialogKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
VAR
	handle hFocus
If !InHjDialog() then
	return false
EndIf
If KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	let hFocus=getFocus()
	if GetWindowClass(hFocus) == cWcListView then
		if GetWindowName(GetParent(GetParent(hFocus))) == wn_CustomizeListViewHeaders then
			let giCustomLVItemSpoken = TRUE
			Delay (1)
			SayLine ()
			Return true
		EndIf
	EndIf
EndIf
return ProcessHJDialogKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Void Function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
VAR
	handle hFocus,
	int iObjSubtype,
	int iCount
let giCustomLVItemSpoken  = FALSE
let giTabKeyPressed  = FALSE
if UserBufferIsActive() then
	ProcessKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey) ; default
	return
endIf
; We don't want to do any tests if the keys being pressed are
;Alt+Space.  This is opening the System menu and calls to the DOM
;server may be blocked at this point
If ((nKey&0xff) == key_SPACEBAR &&
StringContains(strKeyName,"Alt+")) then
	return
EndIf
if InRSSFeedFilterEdit() then
	let iCount = GetHeadingCount(0)
	if iCount != giRSSFeedHeadings then
		let giRSSFeedHeadings = iCount
		SayUsingVoice(vctx_message,intToString(giRSSFeedHeadings),ot_help)
		return
	EndIf
EndIf
let hFocus = getFocus()
If (nKey == key_tab || nKey == key_shift_tab)
&& !IsVirtualPCCursor () Then
	If GetWindowClass (GetAppMainWindow (hFocus)) == wc_ExploreWClass   Then
		let giTabKeyPressed = TRUE
	EndIf
EndIf
; This is for combo box focus problems in IE7
; see checkForDefocusedComboBox() below for details.
if getWindowClass(hFocus) == IE5Class then
	scheduleFunction("checkForDefocusedComboBox", 5)
endIf
if GetMenuMode() && !nIsScriptKey && stringLength(strKeyName)==1 then
	msaaRefresh(); Bug 61272 - PB: Braille does not show text for "Favorites" in IE8 the first few times you press first letter navigation and land on item.
endIf
ProcessKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey) ; default
EndFunction

void function checkForDefocusedComboBox()
; Focus can get mixed up in IE7 combo boxes while the user scrolls through options in forms mode.
; The result is total silence during arrowing, so this function is here to reset things to prevent this.
var
	handle hwnd,
	object o, int childID
let hwnd = getFocus()
if getWindowClass(hwnd) != IE5Class
|| isVirtualPCCursor() || !isPCCursor() || userBufferIsActive() || menusActive() then
	return
endIf
let o = getFocusObject(childID)
if o.accRole(childID) == Role_System_List
&& o.accState(childID) & State_System_Invisible
&& o.accParent.accRole(ChildID_Self) == Role_System_ComboBox then
	; This can happen in IE7 as arrows are used to scroll through the box:
	; MSAA focus state bits stay ok, but GetFocusObject() starts returning the (invisible) option list object for the box instead of returning the object for the combo itself.
	; The following trick resets MSAA focus as needed.  This causes JAWS to say "combo box" one extra time but is sure better than total silence during arrowing.
	; [DGL, 2007-10-01]
	setFocus(getParent(hwnd))
	setFocus(hwnd)
endIf
endFunction

Script TogglePMFile ()
var
	int iSetting,
	string status
if IsVirtualPCCursor () then
	let iSetting = TogglePMFile()
	If iSetting == 0 then
		let status = cmsgPMUseTitle
	Else
		let status = cmsgPMUseDomain
	EndIf
	SayFormattedMessage (OT_STATUS, FormatString (cmsgPMUsingAsFileName, status))
EndIf
EndScript

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
If DialogActive () Then
	If StringContains (GetWindowName (GetRealWindow (hwndFocus)), WnSecurityWarning) Then
		If GetControlID (hwndFocus) == ID_AlwaysTrustText Then
			return
		EndIf
	EndIf
EndIf

if (gbLastFocusChangeWithInCombo ) then
	gbLastFocusChangeWithInCombo = false
	return
EndIf

tutorMessageEvent(hwndFocus, nMenuMode)
EndFunction

int function InFolderViewListView()
var
	handle hWnd,
	int iSubtype
let iSubtype = GetObjectSubtypeCode()
if iSubtype != wt_ListBoxItem
&& iSubtype != wt_ListView then
	return false
EndIf
if IsWindows7() then
	;The logic used for folderview listview should not apply to Windows 7
	return false
EndIf
let hWnd = GetParent(GetFocus())
while hWnd
&& GetWindowClass(hWnd) != cwc_ShellDll_DefView
	let hWnd = GetParent(hWnd)
EndWhile
if hWnd then
	return true
else
	return false
EndIf
EndFunction

string function GetCurrentListViewItemName()
var
	handle hWnd
let hWnd = GetCurrentWindow()
if lvIsCustomized(hWnd) then
	return lvGetUserDefinedItemText(hWnd,lvGetFocusItem(hWnd))
EndIf
if InFolderViewListView() then
	return lvGetItemText(hWnd,lvGetFocusItem(hWnd),1)
EndIf
if IsMSAAWindow(hWnd) then
	return GetObjectName()
else
	return GetObjectValue()
EndIf
EndFunction

Void Function SelectingText(int nMode)
;Overwrite to suppress double-speaking of custom handler,
;which speaks FolderView list item names in their entirety:
If !MenusActive ()
&& InFolderViewListView() then
	Return ;Suppress for folder name speak
EndIf
SelectingText(nMode)
EndFunction

void function ObjStateChangedEvent(handle hObj, int iObjType, int nChangedState, int nState, int nOldState)
if InARIAGrid()
&& iObjType == WT_ROW then
	var
		int rowLevel = FindAncestorOfType (WT_ROW)

	if rowLevel <= 0 then
		return
	EndIf

	if GetObjectStateCode (true, rowLevel)&CTRL_SELECTED then
		IndicateControlType (WT_ROW, "", "")
		IndicateControlState (WT_ROW, CTRL_SELECTED)
		return
	EndIf
	if nOldState & CTRL_SELECTED then
		IndicateControlType (WT_ROW, "", "")
		SayMessage (OT_ITEM_STATE, CMSG214_L, CMSGSILENT)
		return
	EndIf
EndIf

;Special handling of folderview listview in Window Explorer:
if !nSelectingText then
	if hObj == GetFocus() then
		if InFolderViewListView() then
			if GetRunningFSProducts() == product_magic then
				if !nState
				|| nChangedState == CTRL_SELECTED then
					;Typically, use char .but in this case, that would raise the pitch of the voice for capital letters.
					Say(GetCurrentListViewItemName(),OT_LINE)
				EndIf
			else
			SayLVItemState(hObj)
			;Must fill out all parameters for Say, so that speech markup is honored for customize list view:
			Say(GetCurrentListViewItemName(),ot_line, lvIsCustomized (hObj))
			endIf
			return
		EndIf
	EndIf
EndIf
ObjStateChangedEvent(hObj,iObjType,nChangedState,nState,nOldState)
EndFunction

void function SayLVItemState(handle hWnd)
var
	int iSpeak
let iSpeak = GetJCFOption(opt_indicate_selected)
if !(lvGetItemState(hWnd,lvGetFocusItem(hWnd)) & LVIS_SELECTED) then
	if iSpeak & 0x002 then
		Say(cMsgDeselected,ot_item_state)
	EndIf
else
	if iSpeak & 0x001 then
		Say(cMsgSelected,ot_item_state)
	EndIf
EndIf
EndFunction

void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
;When tabbing from static text with a tabindex to static text with a tabindex, sometimes
;ActiveItemChanged is fired rather than focusChanged.
;This will correctly speak the static text under these circumstances
;SSA issue
var
	int Item,
	int nLeft, int nTop, int nRight, int nBottom
if gICheckByActiveItem
&& IsVirtualPCCursor()
&& (getObjectSubtypeCode()==WT_UNKNOWN) then
	Let gICheckByActiveItem = FALSE
	Say(GetObjectName(),OT_CONTROL_NAME)
	return
endIf
Let gICheckByActiveItem = FALSE
if GetRunningFSProducts() & product_magic then
	If (GetWindowSubtypeCode (curHwnd) == WT_LISTVIEW) Then
		Let Item = lvGetFocusItem (curHwnd)
		If Item then
			lvGetItemRect (curHwnd, Item, nLeft, nRight, nTop, nBottom)
			If (nLeft && nTop && nRight && nBottom) then
				MagSetFocusToRect (nLeft, nRight, nTop, nBottom)
			EndIf
		EndIf
	EndIf
endIf
if !nSelectingText then
	if InFolderViewListView() then
		if curHwnd == GlobalFocusWindow then
			SayLVItemState(CurHwnd)
			;Imperative to fill out all parameters for Say, as List View Markup must be honored.
			Say(GetCurrentListViewItemName(),ot_line, lvIsCustomized (curHwnd))
			return
		EndIf
	EndIf
EndIf
if InViewDownloadsDialogList()
	SayViewDownloadsListItem()
	return
endIf
ActiveItemChangedEvent(curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
EndFunction

string function getAccName()
var
	object o,
	int cid

let o = getFocusObject(cid)
return o.accName(cid)
EndFunction

Script AdjustJAWSVerbosity ()
var
	string sAppToggles
let sAppToggles =
	jvIEInformationBarAnnounce
	+jvIERSSFeedAvailabilityAnnounce
;For SetUpStuffForNewPage function:
Let gbVerbosityOptionSet = TRUE;
JAWSVerbosityCore(sAppToggles)
InitializeGlobalsWithSettingsFromJCF ()
EndScript

Script AdjustJAWSOptions ()
var
	string strListOfOptions
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
Let strListOfOptions =
	UO_IEInformationBar+_DLG_SEPARATOR+
	UO_IERSSFeeds+_DLG_SEPARATOR+
	UO_ToggleHTMLFrameUpdateNotification
;By default, OptionsTreeCore will add the node "Internet Explorer Options" to all options,
;because Internet Explorer is the Configuration's name.
;To this end, create custom callbacks for both functions,
;hlpCallbacks for each, and a callback called:
;InernetExplorerOptionsHlp for the group or node.
;For SetUpStuffForNewPage function:
Let gbVerbosityOptionSet = TRUE;
OptionsTreeCore (strListOfOptions)
InitializeGlobalsWithSettingsFromJCF ()
EndScript

string Function NodeHlp (string sNodeName)
;This is the easiest way for you to create your callback help,
;for your configuration-specific options,
;if you have not specified a node, we have done so using your configuration's name.
;If you don't do this, your top-level or group node will tell your users that no help is available, although we try to be nice about it.
If StringContains (sNodeName, GetActiveConfiguration ()) then
	Return msgUO_InternetExplorerOptionsHlp
Else
	Return NodeHlp (sNodeName);Default for all default and Virtual Cursor groups.
EndIf
EndFunction

string Function UOToggleHTMLFrameUpdateNotification(int iRetCurVal)
if !iRetCurVal then
	if giHTMLFrameUpdateNotification == FrameUpdateNotification_MoveTo then
		let giHTMLFrameUpdateNotification = FrameUpdateNotification_Off
	else
		let giHTMLFrameUpdateNotification = giHTMLFrameUpdateNotification+1
	EndIf
	IniWriteInteger(section_ApplicationVerbositySettings,hKey_HTMLFrameUpdateNotification,giHTMLFrameUpdateNotification,AppJSIFileName,1)
EndIf
return UOToggleHTMLFrameUpdateNotificationTextOutput(giHTMLFrameUpdateNotification)
EndFunction

string function UOToggleHTMLFrameUpdateNotificationTextOutput(int setting)
if setting == FrameUpdateNotification_Off then
	Return cmsg_Off
ElIf setting == FrameUpdateNotification_Indicate then
	Return msgFrameUpdateNotificationSpeakFrameName
ElIf setting == FrameUpdateNotification_MoveTo then
	Return msgFrameUpdateNotificationMoveTo
EndIf
EndFunction

string Function UOToggleHTMLFrameUpdateNotificationHlp()
return FormatString(msgToggleHTMLFrameUpdateNotificationHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOToggleHTMLFrameUpdateNotificationTextOutput(GetIntOptionDefaultJSISetting(JSIFile,section_ApplicationVerbositySettings,hKey_HTMLFrameUpdateNotification)))
EndFunction

void function SavePersonalizedJSISetting(string sJSIFile, string sSection, string sHKey, int iSetting)
var
	int iSharedSetting
let iSharedSetting = IniReadInteger(section_ApplicationVerbositySettings,hKey_HTMLFrameUpdateNotification,giHTMLFrameUpdateNotification,AppJSIFileName)
if iSharedSetting != iSetting then
	IniWriteInteger(sSection,sHKey, iSetting, gStrFileName)
else ;settings layering requires that the key be removed:
	IniRemoveKey(sSection,sHKey,gStrFileName)
EndIf
EndFunction

void function LoadSettingsFromRelevantFile ()
var
	string s
LoadSettingsFromRelevantFile ()
if IniReadSectionKeys(section_ApplicationVerbositySettings, gStrFileName) then
;	if IniReadInteger(Section_ApplicationVerbositySettings,hKey_HTMLFrameUpdateNotification,giHTMLFrameUpdateNotification,GSTRFileName) then
		Let bWereCustomSettingsLoaded  = true
;	EndIf
EndIf
EndFunction

string Function UOCustomClearAllSettings(int iRetCurVal)
If !iRetCurVal then
	IniRemoveSection(section_ApplicationVerbositySettings, gStrFileName)
EndIf
return UOCustomClearAllSettings(iRetCurVal)
EndFunction

string Function UOCustomToggleHTMLFrameUpdateNotification(int iRetCurVal)
var
	int iSetting
If bWereCustomSettingsLoaded then
	let iSetting = IniReadInteger(section_ApplicationVerbositySettings,hKey_HTMLFrameUpdateNotification,giHTMLFrameUpdateNotification,GSTRFileName)
else
	let iSetting = IniReadInteger(section_ApplicationVerbositySettings,hKey_HTMLFrameUpdateNotification,giHTMLFrameUpdateNotification,AppJSIFileName)
EndIf
if !iRetCurVal then
	if iSetting == FrameUpdateNotification_MoveTo then
		let iSetting = FrameUpdateNotification_Off
	else
		let iSetting = iSetting+1
	EndIf
	Let bWereCustomSettingsLoaded = TRUE

	SavePersonalizedJSISetting(GSTRFileName, section_ApplicationVerbositySettings, hKey_HTMLFrameUpdateNotification,iSetting)
;	IniWriteInteger(Section_ApplicationVerbositySettings,hKey_HTMLFrameUpdateNotification,iSetting,GSTRFileName)
	let giHTMLFrameUpdateNotification = iSetting
EndIf
if iSetting == FrameUpdateNotification_Off then
	Return cmsg_Off
ElIf iSetting == FrameUpdateNotification_Indicate then
	Return msgFrameUpdateNotificationSpeakFrameName
ElIf iSetting == FrameUpdateNotification_MoveTo then
	Return msgFrameUpdateNotificationMoveTo
EndIf
EndFunction

string Function UOCustomToggleHTMLFrameUpdateNotificationHlp()
return UOToggleHTMLFrameUpdateNotificationHlp()
EndFunction

string function InformationBarAnnouncement(int iRetCurVal)
if !iRetCurVal then
	if gbInformationBarAnnounce == DocumentLoadAppAlert_Virtualize then
		let gbInformationBarAnnounce = DocumentLoadAppAlert_Off
	else
		let gbInformationBarAnnounce = gbInformationBarAnnounce + 1
	EndIf
	IniWriteInteger(section_ApplicationVerbositySettings,hKey_InformationBarAnnounce,gbInformationBarAnnounce,AppJSIFileName,1)
EndIf
if gbInformationBarAnnounce == DocumentLoadAppAlert_Off then
	return msgInformationBarAnnouncement_Off
ElIf gbInformationBarAnnounce == DocumentLoadAppAlert_Speak then
	return msgInformationBarAnnouncement_Speak
ElIf gbInformationBarAnnounce == DocumentLoadAppAlert_Virtualize then
	return msgInformationBarAnnouncement_Virtualize
EndIf
EndFunction

string Function UOInformationBar (int iRetCurVal)
if !iRetCurVal then
	if gbInformationBarAnnounce == DocumentLoadAppAlert_Virtualize then
		let gbInformationBarAnnounce = DocumentLoadAppAlert_Off
	else
		let gbInformationBarAnnounce = gbInformationBarAnnounce + 1
	EndIf
	IniWriteInteger(section_ApplicationVerbositySettings,hKey_InformationBarAnnounce,gbInformationBarAnnounce,AppJSIFileName,1)
EndIf
return UOInformationBarTextOutput(gbInformationBarAnnounce)
EndFunction

string Function UOInformationBarTextOutput(int setting)
if setting == DocumentLoadAppAlert_Off then
	Return msgUO_Ignore
ElIf setting == DocumentLoadAppAlert_Speak then
	Return msgUO_AnnounceNew
ElIf setting == DocumentLoadAppAlert_Virtualize then
	Return msgUO_VirtualizeContent
EndIf
EndFunction

string Function UOInformationBarHlp (int iRetCurVal)
Return FormatString(msgUO_InformationBarHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOInformationBarTextOutput(GetIntOptionDefaultJSISetting(JSIFile,section_ApplicationVerbositySettings,hKey_InformationBarAnnounce)))
EndFunction

string function CheckForInformationBar()
var
	handle hWnd,
	handle hTemp,
	int iCtrl
let hWnd = GetFocus()
if GetWindowClass(hWnd) != cwcIEServer then
	return cscNull
EndIf
let hWnd = GetNextWindow(hWnd)
while hWnd
	if GetWindowClass(hWnd) == cWc_dlg32770 then
		let hTemp = GetFirstChild(hWnd)
		if IsWindowVisible(hTemp) then
			let iCtrl = GetControlID(hTemp)
			if iCtrl == id_InformationBar_IE6
			|| iCtrl == id_InformationBar_IE7 then
				return GetWindowName(hTemp)
			EndIf
		EndIf
	EndIf
	let hWnd = GetNextWindow(hWnd)
EndWhile
return cscNull
EndFunction

string function RSSFeedAvailabilityAnnouncement(int iRetCurVal)
if !iRetCurVal then
	if gbRSSFeedAvailabilityAnnounce == DocumentLoadAppAlert_Virtualize then
		let gbRSSFeedAvailabilityAnnounce = DocumentLoadAppAlert_Off
	else
		let gbRSSFeedAvailabilityAnnounce = gbRSSFeedAvailabilityAnnounce + 1
	EndIf
	IniWriteInteger(section_ApplicationVerbositySettings,hKey_RSSFeedAvailabilityAnnouncement,gbRSSFeedAvailabilityAnnounce,AppJSIFileName,1)
EndIf
if gbRSSFeedAvailabilityAnnounce == DocumentLoadAppAlert_Off then
	return msgRSSFeedAvailabilityAnnounce_Off
ElIf gbRSSFeedAvailabilityAnnounce == DocumentLoadAppAlert_Speak then
	return msgRSSFeedAvailabilityAnnounce_Speak
ElIf gbRSSFeedAvailabilityAnnounce == DocumentLoadAppAlert_Virtualize then
	return msgRSSFeedAvailabilityAnnounce_Virtualize
EndIf
EndFunction

string function UORSSFeeds(int iRetCurVal)
if !iRetCurVal then
	if gbRSSFeedAvailabilityAnnounce == DocumentLoadAppAlert_Virtualize then
		let gbRSSFeedAvailabilityAnnounce = DocumentLoadAppAlert_Off
	else
		let gbRSSFeedAvailabilityAnnounce = gbRSSFeedAvailabilityAnnounce + 1
	EndIf
	IniWriteInteger(Section_ApplicationVerbositySettings,hKey_RSSFeedAvailabilityAnnouncement,gbRSSFeedAvailabilityAnnounce,AppJSIFileName,1)
EndIf
return UORSSFeedsTextOutput(gbRSSFeedAvailabilityAnnounce)
EndFunction

string function UORSSFeedsTextOutput(int setting)
if setting == DocumentLoadAppAlert_Off then
	return msgUO_ignore
ElIf setting == DocumentLoadAppAlert_Speak then
	return msgUO_AnnounceNew
ElIf setting == DocumentLoadAppAlert_Virtualize then
	return msgUO_VirtualizeContent
EndIf
EndFunction

string function UORSSFeedsHlp()
Return FormatString(msgUO_RSSFeedsHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UORSSFeedsTextOutput(GetIntOptionDefaultJSISetting(JSIFile,section_ApplicationVerbositySettings,hKey_RSSFeedAvailabilityAnnouncement)))
EndFunction

string Function InternetExplorerOptionsHlp ()
Return msgUO_InternetExplorerOptionsHlp
EndFunction

int function CheckForRSSFeedAvailability(int bSpeakOnlyIfChanged)
var
	string sAddress
if RSSFeedAvailable() then
	let sAddress = GetRelevantAddressBarInfo ()
	if bSpeakOnlyIfChanged then
		if sAddress == gsMostRecentRSSFeedPage then
			return false
		EndIf
	EndIf
	;update the page addresses for next time we check to see if the RSS Feed page has changed:
	let gsPriorRSSFeedPage = gsMostRecentRSSFeedPage
	let gsMostRecentRSSFeedPage = sAddress
	return true
EndIf
return false
EndFunction

void function initializeApplicationSpecificGlobals()
let gbInformationBarAnnounce = true
EndFunction

void Function loadApplicationSettings ()
initializeApplicationSpecificGlobals()
let gbInformationBarAnnounce  = iniReadInteger (Section_ApplicationVerbositySettings,hKey_InformationBarAnnounce,gbInformationBarAnnounce  ,AppJSIFileName)
let gbRSSFeedAvailabilityAnnounce  = iniReadInteger (Section_ApplicationVerbositySettings,hKey_RSSFeedAvailabilityAnnouncement,gbRSSFeedAvailabilityAnnounce  ,AppJSIFileName)
let giHTMLFrameUpdateNotification = iniReadInteger (Section_ApplicationVerbositySettings,hKey_HTMLFrameUpdateNotification,gbRSSFeedAvailabilityAnnounce  ,AppJSIFileName)
EndFunction

Void Function WindowCreatedEvent (handle hWnd, int nLeft, int nTop, int nRight, int nBottom)
var
	string sClass
sClass = GetWindowClass(hWnd)
if sClass == wc_MMDEVAPI
	;In IE10, don't know about IE9,
	;This window is created just before the notification bar text appears, then it is destroyed.
	if IEVersion >= 10
		CheckIE9NotificationBar()
	EndIf
EndIf
WindowCreatedEvent(hWnd, nLeft, nTop, nRight, nBottom)
EndFunction

void Function WindowDestroyedEvent (handle hWindow)
WindowDestroyedEvent (hWindow)
;if this is an instance of the browser window closing,
;schedule an update of the app window handle for the tab row data in case another browser instance gains focus:
if CollectionItemExists(c_TabRowData,"appWnd")
&& hWindow == c_TabRowData.appWnd
	if ScheduledUpdateTabRowDataForAppWindowID
		UnscheduleFunction(ScheduledUpdateTabRowDataForAppWindowID)
	endIf
	ScheduledUpdateTabRowDataForAppWindowID = ScheduleFunction("UpdateTabRowDataForAppWindow",UpdateTabRowDataForAppWindow_Delay)
endIf
EndFunction

script ControlShiftEnter()
var
	int nLinkIndex
if GetWindowClass(GetFocus()) == cwcIEServer
&& IEVersion >= 7 then
	SayCurrentScriptKeyLabel ()
	let nLinkIndex = GetCurrentLinkIndex()
	if nLinkIndex then
		FocusToLink(nLinkIndex)
		ControlShiftEnterKey()
	EndIf
	return
EndIf
PerformScript ControlShiftEnter()
EndScript

script ControlEnter()
var
	int nLinkIndex
if GetWindowClass(GetFocus()) == cwcIEServer
&& IEVersion >= 7 then
	SayCurrentScriptKeyLabel ()
	let nLinkIndex = GetCurrentLinkIndex()
	if nLinkIndex then
		FocusToLink(nLinkIndex)
		TypeCurrentScriptKey()
	EndIf
	return
EndIf
PerformScript ControlEnter()
EndScript

int function InRSSFeedFilterEdit()
if !IsFormsModeActive() Then
	return false
EndIf
If GetWindowClass(GetFocus()) != cwcIEServer then
	return false
EndIf
if GetObjectSubtypeCode() != wt_edit then
	return false
EndIf
return StringContains(GetElementDescription(1,false),scDocTypeRSSFeed)
EndFunction

int Function RSSFeedAvailable()
return (StringContains(GetElementDescription(1,false),scRssFeedAvailable) != 0)
EndFunction

int function IsIE7SearchEdit(handle hWnd)
var
	handle hTemp
if GetWindowSubtypeCode(hWnd) != wt_Edit then
	return false
EndIf
if GetObjectSubtypeCode() != wt_Edit then
	return false
EndIf
let hTemp = GetParent(GetParent(GetParent(hWnd)))
if hTemp then
	if GetWindowClass(hTemp) == wn_UniversalSearchBand then
		return true
	EndIf
EndIf
return false
EndFunction

string function GetCustomTutorMessage()
var
	handle hWnd,
	int iSubtype,
	int nBits
if IsIE7SearchEdit(GlobalFocusWindow) then
	return msgIE7SearchControlEditCustomTutorHelp
EndIf
If (! IsPcCursor () ||
GlobalMenuMode) then
	Return GetCustomTutorMessage ()
EndIf
Let hWnd = GetCurrentWindow ()
Let iSubtype = GetWindowSubtypeCode (hWnd)
;Handle tool bar windows differently:
If iSubtype == WT_TOOLBAR then
	Let nBits = GetWindowStyleBits (hWnd)
	If (nBits & BS_USERBUTTON) then
		If GetWindowSubtypeCode (GetPriorWindow (hWnd)) != WT_EDIT then
			Return msgToolBarTutor;Standard button plus arrows to explore.
		EndIf
	EndIf
	Return MsgButtonContextTutor
EndIf
return GetCustomTutorMessage()
EndFunction

string function GetDialogStaticText()
var
	handle hReal,
	handle hTemp,
	int iSubtype,
	string sText
;For the File Download - Security Warning dialog:
let hReal = GetRealWindow(GlobalFocusWindow)
if GetWindowClass(hReal) == cWc_dlg32770 then
	if GetWindowName(hReal) == wn_FileDownload_SecurityWarning then
		;note that we use this function to get text for braille, not for speech,
		;since with speech we want to break the text up into several separate "says" for a more natural sound,
		;but with braille we want one string containing all text.
		;get all window text before the first button:
		let hTemp = GetFirstChild(hReal)
		let iSubtype = GetWindowSubtypeCode(hTemp)
		while hTemp
		&& iSubtype != wt_button
			if IsWindowVisible(hTemp) then
				let sText  = sText+GetWindowTextEx(hTemp,0,0)+cscSpace
			EndIf
			let hTemp = GetNextWindow(hTemp)
			let iSubtype = GetWindowSubtypeCode(hTemp)
		EndWhile
		return StringTrimTrailingBlanks(sText)
	EndIf
EndIf
return GetDialogStaticText()
EndFunction

int function BrailleAddObjectDlgText(int nSubtypeCode)
var
	handle hReal
let hReal = GetRealWindow(GlobalFocusWindow)
if GetWindowClass(hReal) == cWc_dlg32770 then
	if GetWindowName(hReal) == wn_FileDownload_SecurityWarning then
		BrailleAddString(GetDialogStaticText(),0,0,0)
		return true
	EndIf
EndIf
return BrailleAddObjectDlgText(nSubtypeCode)
EndFunction

int function BrailleAddObjectName(int iSubtype)
var
	handle hWnd,
	int iCtrl
if IsTouchCursor() then
	return BrailleAddObjectName(iSubtype)
endIf
if iSubtype == wt_button then
	If DialogActive()
	&& IEVersion >= 7 then
		let hWnd = GetFocus()
		if StringCompare(GetWindowName (GetRealWindow (hWnd)),wn_InternetOptions) == 0 then
			let iCtrl = GetControlID(GetFocus())
			if iCtrl == id_TemporaryInternetFilesAndHistorySettings_button then
				BrailleAddString(wn_TemporaryInternetFilesAndHistorySettings,GetCursorCol(),GetCursorRow(),0)
				return true
			ElIf iCtrl == id_SearchDefaultSettings_button then
				BrailleAddString(scSearchDefaultSettings,GetCursorCol(),GetCursorRow(),0)
				return true
			ElIf iCtrl == id_TabbedBrowsingSettings_button then
				BrailleAddString(wn_TabbedBrowsingSettings,GetCursorCol(),GetCursorRow(),0)
				return true
			ElIf iCtrl == id_PopUpBlockerSettings_button then
				BrailleAddString(wn_PopUpBlockerSettings,GetCursorCol(),GetCursorRow(),0)
				return true
			ElIf iCtrl == id_AutoCompleteSettings_button then
				BrailleAddString(wn_AutoCompleteSettings,GetCursorCol(),GetCursorRow(),0)
				return true
			ElIf iCtrl == id_FeedSettings_button then
				BrailleAddString(wn_FeedSettings,GetCursorCol(),GetCursorRow(),0)
				return true
			ElIf iCtrl == id_BrowsingHistoryDelete_button then
				BrailleAddString(scBrowsingHistoryDelete,GetCursorCol(),GetCursorRow(),0)
				return true
			EndIf
		EndIf
	EndIf
elif iSubtype == WT_EDIT_SPINBOX then
	if GetWindowSubtypecode(GetPriorWindow(GetFocus())) != wt_static then
		BrailleAddString(GetObjectName(true),0,0,0)
		return true
	EndIf
; for autoPlay applet combo boxes
elif iSubtype == wt_comboBox && getWindowClass(getCurrentWindow()) == wc_ComboBox && getWindowClass(getParent(getParent(getCurrentWindow()))) == wc_CtrlNotifySink && gsCachedName then
		BrailleAddString(gsCachedName,0,0,0)
		return true
EndIf
if iSubtype==WT_TABLECELL && InARIAGrid() then
		return BrailleAddObjectName(iSubtype)
EndIf
return default::BrailleAddObjectName(iSubtype)
EndFunction

/*
int function BrailleAddObjectContainerName(int nSubtypeCode)
if nSubtypeCode == wt_checkbox && getWindowName(getRealWindow(getCurrentWindow())) == cwc_ControlPanelAutoPlay && gsCachedGroupName then
	BrailleAddString(gsCachedGroupName,0,0,0)
	return true
Endif
return BrailleAddObjectContainerName(nSubtypeCode)
endFunction
*/

void Function DumpAutoCompleteGlobalVars ()
var handle hNull ; for Compiler issues
Let gbAutoComplete = 0;
Let gstrAutoCompleteSelection = "";
Let ghAutocomplete = hNull;
endFunction

int Function BrailleAddObjectAutocomplete (int iType)
if gbAutoComplete && isWindowVisible (ghAutocomplete)
&& ! stringIsBlank (gstrAutoCompleteSelection) then
	BrailleAddString (gstrAutoCompleteSelection,0,0, ATTRIB_HIGHLIGHT)
	return TRUE;
endIf
return TRUE;
endFunction

int function MenuInactiveProcessed(int mode, int PrevMenuMode)
var
	int result

let result = MenuInactiveProcessed(mode, PrevMenuMode)
if result THEN
	if IsIE7SearchEdit(GetFocus()) then
		MSAARefresh()
	EndIf
EndIf
return result
EndFunction

string Function GetWindowName (handle hWnd)
;Previously was there to solve ampersand reading in title bars.
;Revert toactual name when text is missing.
;Example, Windows Vista.
var
	string sName
If (hWnd == GetAppMainWindow (GetFocus ()) &&
GetWindowSubtypeCode (GetFocus ()) == WT_LISTVIEW) then
	Let sName = GetWindowTextEx (hWnd, READ_EVERYTHING, FALSE)
	If (! sName || StringIsBlank(sName))  then
		;This is where text is wrong or missing:
		Let sName = GetWindowName(hWnd)
	EndIf
	Return sName;
EndIf
Return GetWindowName (hWnd)
EndFunction

int function GetDialogLevel()
var
int nLevel
for nLevel=0 to 15
if getObjectSubtypeCode(2,nLevel)==wt_dialog then
return nLevel
endIf
endFor
return -1
endFunction

Script SayWindowTitle()
var
	int nLevel
BeginFlashMessage()
PerformScript sayWindowTitle()
if GetWindowClass(getFocus())==ie5class && DialogActive() then
	let nLevel=GetDialogLevel()
	if (nLevel >=0)
		IndicateControlType(wt_dialog, GetObjectName(1,nLevel))
	endIf
endIf
EndFlashMessage()
EndScript

Script PersonalizeSettingsByListBox ()
If (GetWindowClass (GetFocus ()) != cwcIEServer) then
	SayFormattedMessage (OT_ERROR, msgPersonalizedSettingsNotAvailable)
	Return;
EndIf
PerformScript PersonalizeSettingsByListBox ()
EndScript

Script PersonalizeSettings ()
var
	string ExtraOptionsList
If (GetWindowClass (GetFocus ()) != cwcIEServer) then
	SayMessage (OT_ERROR, msgPersonalizedSettingsNotAvailable)
	Return
EndIf
let ExtraOptionsList = UO_CustomToggleHTMLFrameUpdateNotification
PersonalizeSettings (ExtraOptionsList)
EndScript

int function InVistaControlPanelShellView()
var
	handle hWnd
if !IsWinVista() then
	return false
EndIf
let hWnd = GetFirstChild(FindWindow(GetTopLevelWindow(GetFocus()),wc_BreadcrumbParent))
if !hWnd then
	return false
EndIf
return 0 == StringCompare(StringLeft(GetWindowTextEx(hWnd,0,0),StringLength(msgControlPanelBreadcrumb)),msgControlPanelBreadcrumb)
EndFunction

int function InVistaControlPanelApplet(string sAppletName)
var
	handle hWnd
if !IsWinVista() then
	return false
EndIf
let hWnd = GetFirstChild(FindWindow(GetTopLevelWindow(GetFocus()),wc_BreadcrumbParent))
if !hWnd then
	return false
EndIf
return sAppletName == GetWindowName(GetRealWindow (hWnd))
EndFunction

int function getMSAARect(object o, int childID, int byRef left, int byRef right, int byRef top, int byRef bottom)
; Returns the 1-based rectangle coordinates of the given MSAA object or element.
o.accLocation(intRef(left), intRef(top), intRef(right), intRef(bottom), childID)
if !left && !top && !right && !bottom then
	return False
endIf
; 0-based to 1-based conversion
let left = left +1
let top = top +1
; width/height to right/bottom conversion
let right = left +right
let bottom = top +bottom
return True
endFunction

int function matchingChunkIsNotStatic(handle hwnd, string name)
; Returns True if it seems reasonable to assert that the object whose name is given is not static text or at least not dialog static text.
var
	int tcode,
	object o, int childID,
	int iRole
saveCursor() invisibleCursor() saveCursor()
moveToWindow(hwnd)
if !findString(hwnd, name, S_Top, S_Unrestricted) then
	; Nothing to say if we've nothing to see
	return False
endIf
if stringCompare(name, getChunk(), True) != 0 then
	; Nothing to say if we can't find a matching text chunk.
	; TODO:  This branch is taken for all multiline text blocks.
	; At least in the Backup and Restore Center, this causes extra speech.  [DGL, 2007-09-14]
	return False
endIf
let tcode = getObjectSubtypeCode()
if tcode != WT_Static then
	; We say it can't be static if its JAWS type isn't static.
	return True
endIf
let o = getObjectAtPoint(childID, getCursorCol(), getCursorRow())
if !o then
	return False
endIf
let iRole = o.accRole(childID)
if iRole != Role_System_StaticText then
	; It's also not static if its MSAA role isn't static, even if its JAWS object type is static.
	; Links can do this.
	return True
endIf
if o.accParent.accRole(ChildID_Self) == ROLE_SYSTEM_ROW then
	; This catches some extra stuff in the Backup and Restore Center.
	return True
endIf
; Finally, we say it's not static if it's right below, and lined up with, a link right above it.
; This is because otherwise, JAWS will say the long descriptions of all manner of links at once when an applet gains focus.
; Inspired by the Default Programs applet.
var
	int left1, int right1, int top1, int bottom1,
	int left2, int right2, int top2, int bottom2
if !getMSAARect(o, childID, left1, right1, top1, bottom1) then
	return False
endIf
priorLine()
let o = getObjectAtPoint(childID, getCursorCol(), getCursorRow())
if !o then
	return False
endIf
if !getMSAARect(o, childID, left2, right2, top2, bottom2) then
	return False
endIf
if left1 == left2
&& o.accRole(childID) == ROLE_SYSTEM_LINK then
	return True
endIf
return False
endFunction

/* SMcCormack -- Remove in favor of context sensitive static text reading
;To do: Add code here to speak the static text
void function SayVistaControlPanelShellViewStaticText()
var
	string list,
	handle hwnd,
	string name,
	int pSubTypeCode,
	int pState,
	string pValue,
	string pDescription,
	string pHotkey,
	string pContainer,
	int segCount,
	int count

let hwnd = FindWindow(getRealWindow(getFocus()),wc_shellTabWindowClass,"")
if hwnd then
; Avoid windows containing well-populated list or combo box controls, because these can cause massive delays below.
; The main Control Panel window in Classic view is an excellent example, and Fonts can contain a prohibitively large list as well.
; Autoplay contains many small combo boxes, but one with over 10 items.
var
	handle hwnd1
let hwnd1 = findWindowByType(hwnd, WT_ListView)
if !hwnd1 then
	let hwnd1 = findWindowByType(hwnd, WT_ComboBox)
endIf
if hwnd1 then
	if getItemCount(hwnd1) > 10 || lvGetItemCount(hwnd1) > 10 then
		return
	endIf
endIf
let list = GetListOfObjects (hwnd, "|")
let count = 1
let segCount = stringSegmentCount(list, "|")
while count <= segCount
	let name = StringSegment (list, "|", count)
	; Weed out "computer" and trailing " icon" (case insensitive) and all but the first duplicate of any name.
	; Also weed out any items for which a text chunk of non-static type exactly matches the name.
	; These weedings are to minimize GetObjectInfoByName calls as much as possible because they can take a lot of time.
	; Example:  A 79-object tree can otherwise take 6-9 seconds on a Core2 Duo 2GHz running Vista.  [DGL, 2007-09-13]
	if !(name == sc_Computer && StringLength(name) == 8)
	&& stringRight(name, 5) != " icon"
	&& count == StringSegmentIndex (list, "|", name, true)
	&& !matchingChunkIsNotStatic(hwnd, name) then
		GetObjectInfoByName (hwnd, name, 1, pSubTypeCode) ;, pState, pValue, pDescription, pHotkey, pContainer)
		if pSubTypeCode == wt_static then
			say(name,ot_message)
		endif
	endIf
	let count = count + 1
EndWhile
Endif
EndFunction */

void Function CopyMoveDialogHandler (handle hWndFocus)
var
	string sButton,
	object oFocus,
	int iLeft,
	int iTop,
	int iWidth,
	int iHeight
let oFocus = GetFocusObject (0)
oFocus.accLocation (intref(iLeft), intref(iTop), intref(iWidth), intref(iHeight), 0)
let sButton = GetTextInRect (iLeft, iTop, iLeft+iWidth, iTop+iHeight)
If !sButton then
	SayObjectTypeAndText ()
	Return
EndIf
Say (sButton+" "+GetObjectType (), ot_message)
EndFunction

int function HasVirtualEnhancedClipboard()
return true
EndFunction

void function FrameLoadedEvent(handle hDoc, string sFrameName, int nFrameIndex)
var
	string sLong,
	string sShort
if !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
;ignore frame load events for documents not in focus:
if hDoc != GetFocus() then
	return
EndIf
let giReturnPositionFromFrameUpdate = 0
if GetDocumentLoadState(GetFocus()) != DocState_Loaded
|| !nFrameIndex then
	return
EndIf
if giHTMLFrameUpdateNotification == FrameUpdateNotification_Off then
	return
EndIf
if !sFrameName
|| StringIsBlank(sFrameName) then
	let sLong=FormatString(cmsgNoNameFrameLoaded,IntToString(nFrameIndex))
	let sShort=FormatString(cmsgNoNameFrameLoaded,IntToString(nFrameIndex))
else
	let sLong=FormatString(cmsgFrameLoaded_L,IntToString(nFrameIndex),sFrameName)
	let sShort=FormatString(cmsgFrameLoaded_S,IntToString(nFrameIndex),sFrameName)
EndIf
BeginFlashMessage()
SayMessage(OT_WINDOW_NAME, sLong,sShort)
endFlashMessage()
if giHTMLFrameUpdateNotification == FrameUpdateNotification_MoveTo
&& !IsFormsModeActive() then
	let giReturnPositionFromFrameUpdate = GetCursorRow ()
	if MoveToHTMLFrameByIndex(nFrameIndex) then
		NextLine(); skip over header
		PerformScript SayLine()
	EndIf
endIf
endFunction

script MoveToPriorFrame()
if giReturnPositionFromFrameUpdate then
	if GotoLineNumber(giReturnPositionFromFrameUpdate) then
		SayLine()
		let giReturnPositionFromFrameUpdate = 0
	EndIf
	return
EndIf
PerformScript MoveToPriorFrame()
EndScript

int function IsSayAllOnDocumentLoadSupported()
;Make sure the ability to toggle SayAll on document load is added to the Adjust JAWS Options tree.
return true
EndFunction

void Function Unknown (string TheName, int IsScript)
If Not StringCompare (TheName, FuncSetGlobals, FALSE) then
	Return
EndIf
Unknown (TheName, IsScript)
EndFunction

void function AutoCompleteWindowShowEvent(handle hwnd)
;saystring("autocomplete open")
if isWindowVisible (hwnd) then
	Let gbAutoComplete = TRUE;
	Let ghAutocomplete = hwnd
endIf
EndFunction

void function AutoCompleteWindowHideEvent(handle hwnd)
;SayString("auto complete closed")
DumpAutoCompleteGlobalVars ();
EndFunction

void function AutoCompleteWindowItemSelectedEvent(handle hwnd)
var
	int nCurrentItem,
	int i, int iMax, ;for lvColumn inexing
	int nState,
	string stmp,
	string strText;
;SayString("auto complete item selected")
Let ghAutocomplete = hwnd;
let nCurrentItem = GetCurrentItem(hwnd)
;let nState = lvGetItemState(hWnd,nCurrentItem)
;if nState&LVIS_SELECTED then
;	saystring(lvGetItemText(hWnd,nCurrentItem,1))
;EndIf
Let iMax = lvGetNumOfColumns (hwnd)
;Columns are 1-based:
while (i < iMax)
	Let i = (i+1)
	Let stmp = lvGetItemText (hwnd, nCurrentItem, i)
	if ! stringIsBlank (stmp) then
		if strText then
			Let strText = (strText+cscSpace)
		endIf
		Let strText = (strText+stmp)
	endIf
endWhile
Say (strText, OT_LINE)
Let gstrAutoCompleteSelection = strText
EndFunction

void function AutoCompleteWindowItemUnselectedEvent(handle hwnd)
; Do stuff
;sayString ("Item Unselected")
Let gstrAutoCompleteSelection = cscNull
EndFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
if hwnd == GetIEAddressBarWindow() && ! gHAutoComplete then
	return FALSE
endIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
endFunction

string function vCursorNavQuickKeyDelay(int iRetCurVal)
;overwritten here to handle Internet Explorer-specific setting.
var
	int iAutoFormsModeSetting,
	int iThresholdSetting,
	int iWhole,
	int iFraction

Let iAutoFormsModeSetting = GetJcfOption(OPT_AUTO_FORMS_MODE)
let iThresholdSetting =GetJCFOption(OPT_AUTOFORMSMODE_THRESHOLD)
If !iRetCurVal then
	if iAutoFormsModeSetting then
		if iThresholdSetting == 5000 then
			let iThresholdSetting = -1
		ElIf iThresholdSetting == -1 then
			let iThresholdSetting = 500
		ElIf iThresholdSetting >= 500 && iThresholdSetting < 2000 then
			let iThresholdSetting = iThresholdSetting+500
		else
			let iThresholdSetting = iThresholdSetting+1000
		EndIf
		SetJCFOption(OPT_AUTOFORMSMODE_THRESHOLD, iThresholdSetting)
		IniWriteInteger(SECTION_FormsMode,hKey_AutoFormsModeThreshold,iThresholdSetting,InternetExplorer_jcf,true)
	EndIf
EndIf
return vCursorNavQuickKeyDelayTextOutput(iThresholdSetting,iAutoFormsModeSetting)
EndFunction

int function GetGridNavDirection(int curGridRow,int curGridCol)
if prevGridCol == -1 
&& prevGridRow == -1 then
	return TABLE_NAV_NONE 
EndIf

if curGridCol == prevGridCol 
&& curGridRow != prevGridRow then
	return TABLE_NAV_VERTICAL
EndIf

if curGridRow == prevGridRow 
&& curGridCol != prevGridCol then
	return TABLE_NAV_HORIZONTAL
EndIf

if curGridRow != prevGridRow 
&& curGridCol != prevGridCol then
	return TABLE_NAV_TABLE_EXTENTS
EndIf

return TABLE_NAV_NONE 
EndFunction

void Function HandleGridCellSpeaking()
var
	int curGridRow,
	int curGridCol,
	int tableNavDir

GetCellCoordinates (curGridCol, curGridRow)
let tableNavDir = GetGridNavDirection(curGridRow,curGridCol)
SpeakTableCells(tableNavDir,false)

let prevGridRow = curGridRow
let prevGridCol = curGridCol

var
	int rowLevel
rowLevel = FindAncestorOfType (WT_ROW)
if (GetObjectStateCode (true, rowLevel)&CTRL_SELECTED) == 0 then
	return
EndIf
if ! isFormFieldInDocument () then
; form fields are not selectable as cells in a grid:
	IndicateControlType (WT_ROW, "", "")
	IndicateControlState (WT_ROW, CTRL_SELECTED)
endIf
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if InARIAGrid () then
	if nLevel == 0 then
		if isFormFieldInDocument () then
			SayObjectTypeAndText(nLevel, FALSE, drawHighLight); don't say 'grid'
		else
			HandleGridCellSpeaking()
		endIf
	EndIf
	return
EndIf
var
	handle hWnd,
	int iLVFocus,
	string sText,
	int iSubtype,
	int iCtrl,
	string sClass
if IsVirtualRibbonActive()
	SayObjectTypeAndText (nLevel, includeContainerName, drawHighLight)
	Return
EndIf
let sClass = getWindowClass(getCurrentWindow())
let gsCachedName = cscNull
let gsCachedGroupName = cscNull
if InFolderViewListView() then
	if lvIsCustomized(hWnd) then
		IndicateControlType(wt_ListView,cscNull,cscNull)
	else
		IndicateControlType(wt_ListView,cscNull,cscSpace)
		let hWnd = GetCurrentWindow()
		let iLVFocus = lvGetFocusItem(hWnd)
		if !(lvGetItemState(hWnd,iLVFocus) & LVIS_SELECTED) then
			let sText = cMsgDeselected+cscSpace
		EndIf
		Say(sText,ot_selected)
		let sText = lvGetItemText(hWnd,iLVFocus,1)
		Say(sText,ot_line)
	EndIf
	Say(PositionInGroup(),ot_position)
	return
elif InViewDownloadsDialogList()
	SayViewDownloadsListItem(true)
	return
EndIf
let iSubtype = GetObjectSubtypeCode()
let hWnd = GetCurrentWindow()
if GetWindowClass(hWnd) == ie5Class then
	if iSubtype == wt_MultiLine_Edit then
		if !IsEmptyEditFormField() then
			IndicateControlType(GetObjectSubtypeCode(),GetObjectName(),cscSpace)
			if (GetJCFOption(OPT_ANNOUNCE_MULTILINE_EDIT))
				IndicateControlState(GetObjectSubtypeCode(), GetObjectStateCode())
			endIf
			if !(GetRunningFSProducts() == product_MAGic) then
				SayUsingVoice(vctx_message,msgContainsText,ot_line)
			endIf
			return
		EndIf
	EndIf
EndIf
if iSubtype == wt_button then
	;Handle Copy/Move File Dialog
	if (GetWindowName (GetAppMainWindow (GetCurrentWindow ()))==wn_copyfile ||
		GetWindowName (GetAppMainWindow (GetCurrentWindow ()))==wn_movefile) then
		CopyMoveDialogHandler (GetCurrentWindow ())
		return
	EndIf
	if DialogActive()
	&& IEVersion >= 7 then
		let sText = GetObjectName()
		if StringCompare(sText,objn_settings_button) == 0 then
			;we must distinguish the IE7 Internet Options settings buttons apart:
			let iCtrl = GetControlID(GetFocus())
			if iCtrl == id_TemporaryInternetFilesAndHistorySettings_button then
				;call the button by the name of the dialog it opens:
				Say(wn_TemporaryInternetFilesAndHistorySettings,ot_control_name)
				IndicateControlType(wt_button,cscSpace,cscSpace)
				return
			ElIf iCtrl == id_SearchDefaultSettings_button then
				;call the button by a modification of the name of the dialog it opens:
				Say(scSearchDefaultSettings,ot_control_name)
				IndicateControlType(wt_button,cscSpace,cscSpace)
				return
			ElIf iCtrl == id_TabbedBrowsingSettings_button then
				;call the button by the name of the dialog it opens:
				Say(wn_TabbedBrowsingSettings,ot_control_name)
				IndicateControlType(wt_button,cscSpace,cscSpace)
				return
			ElIf iCtrl == id_PopUpBlockerSettings_button then
				;call the button by the name of the dialog it opens:
				Say(wn_PopUpBlockerSettings,ot_control_name)
				IndicateControlType(wt_button,cscSpace,cscSpace)
				return
			ElIf iCtrl == id_AutoCompleteSettings_button then
				;call the button by the name of the dialog it opens:
				Say(wn_AutoCompleteSettings,ot_control_name)
				IndicateControlType(wt_button,cscSpace,cscSpace)
				return
			ElIf iCtrl == id_FeedSettings_button then
				;call the button by the name of the dialog it opens:
				Say(wn_FeedSettings,ot_control_name)
				IndicateControlType(wt_button,cscSpace,cscSpace)
				return
			EndIf
		ElIf StringCompare(sText,objn_delete_button) == 0 then
			let iCtrl = GetControlID(GetFocus())
			if iCtrl == id_BrowsingHistoryDelete_button then
				;call the button by a modification of the name of the dialog it opens:
				Say(scBrowsingHistoryDelete,ot_control_name)
				IndicateControlType(wt_button,cscSpace,cscSpace)
				return
			EndIf
		EndIf
	EndIf
ElIf iSubtype == wt_LeftRightSlider then
	if GetWindowName(GetRealWindow(GetFocus())) == wn_EditPlanSettings then
		SayControlEx(hWnd,GetObjectName(1),GetObjectType(),cscNull,cscNull,cscNull,GetObjectValue(1))
		return
	EndIf
ElIf iSubtype == wt_UpDownSlider then
	let hWnd = GetCurrentWindow()
	let iCtrl = GetControlID(hWnd)
	if iCtrl == id_Privacy_Settings_slider then
		SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
		;speak the extra information about the current slider setting:
		let hWnd = GetNextWindow(hWnd)
		say(GetWindowTextEx(hWnd,0,0),ot_line)
		let hWnd = GetNextWindow(hWnd)
		say(GetWindowTextEx(hWnd,0,0),ot_line)
		return
	EndIf
elif iSubtype == WT_EDIT_SPINBOX then
	if GetWindowSubtypecode(GetPriorWindow(hWnd)) != wt_static then
		IndicateControlType(iSubtype,GetObjectName(true))
		return
	EndIf
; for autoplay applet
elif iSubtype == wt_comboBox && sClass == wc_ComboBox && getWindowClass(getParent(getParent(getCurrentWindow()))) == wc_CtrlNotifySink then
	if getObjectName() == cscNull then
		let gsCachedName = getAccName()
		say(gsCachedName,ot_control_name)
	Endif
; for autoPlay applet
elif iSubtype == wt_checkbox && getWindowName(getRealWindow(getCurrentWindow())) == wc_ControlPanelAutoPlay then
	var object o,
		int cid
	let o = getFocusObject(cid)
	if o then
		let o = o.accParent()
	Endif
	if o then
		let o = o.accNavigate(6,0)
	Endif
	if o && o.accRole(cid) == 0x29 then
		let gsCachedGroupName = o.accName(cid)
		say(gsCachedGroupName,ot_control_group_name)
	Endif
elif iSubtype == WT_RADIOBUTTON && GetWindowName(GetAppMainWindow(GetFocus())) == wn_SystemRestore then
	Refresh()
EndIf
If (nLevel == 0
&& GetObjectSubTypeCode (2, 0) == WT_GROUPBOX) then
	var
		string groupName 
	let groupName = GetObjectName(true,0)
	if StringLength (groupName) > 0 then
		SayObjectTypeAndText(nLevel,false, drawHighLight)
		return 
	EndIf
EndIf
If (nLevel == 0
&& IsTypeOfRegion (iSubType)) then
	SayLine ()
	return
EndIf
if sClass == ie5Class
&& FindAncestorOfType (WT_GROUPBOX) > 0
&& GetScriptAssignedTo(GetCurrentScriptKeyName()) != "SayWindowPromptAndText"
	;Do not include announcement of group names when on the web page,
	;the group name has already been handled elsewhere.
	SayObjectTypeAndText(nLevel,false, drawHighLight)
else
	SayObjectTypeAndText(nLevel,includeContainerName, drawHighLight)
endIf
EndFunction

int function IsEmptyEditFormField(optional int bWhiteSpaceIsText)
var
	int iType,
	string sText
if IsFormsModeActive() then
	let iType = GetObjectSubtypeCode()
	if iType == wt_edit
	|| iType == wt_MultiLine_edit
	|| iType == wt_ReadOnlyEdit then
		let sText = IEGetCurrentDocument ().ActiveElement.value
		if !bWhiteSpaceIsText then
			let sText = stringStripAllBlanks(sText)
		EndIf
		return sText == cscNull
	EndIf
EndIf
return IsEmptyEditFormField(bWhiteSpaceIsText)
EndFunction

int function isFormFieldInDocument ()
; specifically to help with ARIA form field speaking in web pages and documents:
if ! isVirtualPcCursor () && ! IsFormsModeActive () then return FALSE endIf
var int type = getObjectSubtypeCode (TRUE)
return type == WT_BUTTON || type == WT_COMBOBOX
|| type == WT_LISTBOX || type == WT_LISTBOXITEM
|| type == WT_CHECKBOX || type == WT_RADIOBUTTON || type == WT_GROUPBOX
|| type == WT_EDIT || type == WT_READONLYEDIT || type == WT_MULTILINE_EDIT ||type == WT_PASSWORDEDIT
endFunction

int function IsTextAnalysisValid()
if GetFocus() == GetIEAddressBarWindow() then
	return false
EndIf
return IsTextAnalysisValid()
EndFunction


int function ContractedBrailleInputAllowedNow ()
if (getWindowClass ( getParent (getFocus ())) == wc_AddressBarParent)
;alt+d from address bar:
	return FALSE;
endIf
return ContractedBrailleInputAllowedNow ()
endFunction

script JAWSHome()
PerformScript JAWSHome()
if BrailleInUse() then
	BrailleRefresh()
EndIf
EndScript

Script JAWSEnd ()
PerformScript JAWSEnd ()
if BrailleInUse() then
	BrailleRefresh()
EndIf
EndScript

int function InViewDownloadsDialogList()
var handle hWnd = GetTopLevelWindow(GetFocus())
if GetWindowClass(hWnd) != cWc_dlg32770 return false endIf
hWnd = GetFirstChild(hWnd)
if GetWindowClass(hWnd) != cwc_DirectUIhWND return false endIf
if (GetObjectSubtypeCode(true,1) != wt_ListBoxItem && GetObjectSubtypeCode() != wt_ListBoxItem) return false endIf
var object element = CreateUIAFocusElement()
return element.name == objn_ViewAndTrackYourDownloads
endFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if nChangeDepth == 0
&& hwndFocus == hwndPrevFocus
	if nObject==nPrevObject then
		if sClass==ie5Class
		&& (nType==wt_slider
		|| nType==wt_leftrightslider
		|| nType==wt_updownslider) then
			return; // sometimes arrowing in a slider causes a focus change which causes doublespeaking.
		endIf
	endIf
endIf
if nChangeDepth > 0
&& c_TabRowData.ready != true
&& !ScheduledInitTabRowListenerID
	;Call InitTabRowListener, in case the listener was not initialized on AutoStart:
	InitTabRowListener()
endIf
if InViewDownloadsDialogList()
	if hwndFocus == hwndPrevFocus
	&& ((nChangeDepth >=3 && GetObjectSubtypecode(true,nChangeDepth) == wt_dialog)
	|| (nObject==nPrevObject))
		;stop bombardment of speech due to dialog updates during download:
		return
	endIf
	if hwndFocus != hwndPrevFocus
	|| nChangeDepth > 0
		;Focus moved from outside the dialog,
		;from the edit search field,
		;or from a sibling of the list to a decendant of a list item in the list:
		FocusChangedEvent(hwndFocus,hwndPrevFocus)
	elif nChangeDepth == -1
	&& !(g_tracked_PrevObjectType==wt_ListBoxItem && nType==wt_ListBoxItem)
		;Focus moved from a sibling item of the list to the list and onto a list item,
		;or from a descendant of a list item to the parent list item:
		FocusChangedEvent(hwndFocus,hwndPrevFocus)
	else
		;Focus moved from one list item to another,
		;or to or through descendants of a list item:
		ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
	endIf
	g_tracked_PrevObjectType = nType
	return
endIf
g_tracked_PrevObjectType = 0
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
endFunction

void Function DescriptionChangedEvent (handle hwnd, int objId, int childId,
	int nObjType, string sOldDescription, string sNewDescription,
	optional int bFromFocusObject)
if hwnd == GetFocus()
&& bFromFocusObject
&& !nObjType then
	if GetWindowClass(hWnd) == cwc_DirectUIhWND
	;even though bFromFocusObject is true and nObjType is 0, the focus object is a listbox item:
	&& GetObjectSubtypeCode() == wt_ListBoxItem then
		;Do not repeat the description changes, which is the download progress and rate,
		;as the current IE9 list item downloads:
		MSAARefresh() ; so that the list item's name will reflect the current download percentage in a SayLine
		return
	endIf
endIf
DescriptionChangedEvent (hwnd, objId, childId, nObjType, sOldDescription, sNewDescription, bFromFocusObject)
EndFunction

handle function IE9FindNotificationBar()
var
	handle hwnd
let hwnd=FindWindow (GetAppMainWindow(GetFocus()), "Frame Notification Bar", "")
if !IsWindowVisible(hwnd) then
	return 0
endIf
return GetFirstChild(hwnd)
endFunction

void function CheckIE9NotificationBar()
var
	handle h,
	string sText
let h=IE9FindNotificationBar()
if h && GetFocus()!=h then
	sText = getWindowText(h,READ_EVERYTHING)
	if ! stringContains (sText, "%")
	&& ! stringContains (sText, scViewDownloads) then
		beginFlashMessage()
		sayMessage(OT_JAWS_MESSAGE, msgNotificationBarRequiresResponse_L, msgNotificationBarRequiresResponse_S)
		sayMessage(OT_JAWS_MESSAGE, sText)
		endFlashMessage()
	endIf
endIf
endFunction

int function ShouldNotifyIfContextHelp()
if getWindowClass (getFocus ()) == "Edit"
&& getWindowClass (getParent (getFocus ())) == "CTRLNotifySink" then
	Return false
endIf
return ShouldNotifyIfContextHelp ()
endFunction

int function BrailleAddObjectContextHelp(int nSubtypeCode)
if nSubtypeCode == WT_EDIT then
if getWindowClass (getFocus ()) == "Edit"
	&& getWindowClass (getParent (getFocus ())) == "CTRLNotifySink" then
		Return TRUE ; do nothing
	endIf
endIf
return BrailleAddObjectContextHelp(nSubtypeCode)
endFunction

void function loadNonJCFOptions ()
gbInformationBarAnnounce = GetNonJCFOption ("InformationBarAnnounce")
gbRSSFeedAvailabilityAnnounce = GetNonJCFOption ("RSSFeedAvailabilityAnnounce")
giHTMLFrameUpdateNotification = GetNonJCFOption ("HTMLFrameUpdateNotification")
return loadNonJCFOptions ()
endFunction

void function IsTypeOfEdit( int type )
return ( type == WT_EDIT
|| type == WT_MULTILINE_EDIT )
EndFunction

Script ControlBackspace()
var int type = GetObjectSubtypeCode()
var string class = GetWindowClass( GetFocus () )

if ( IsVirtualPCCursor ()
	|| ! IsPCCursor ())
	|| ! IsTypeOfEdit( type
	|| class != "Internet Explorer_Server" )
	; in IE9, with the invisible or jaws cursors,
	; the default implementation of this function causes a crash in IE
	if ( IsJAWSCursor () || IsInvisibleCursor () )
		TypeCurrentScriptKey()
	else
		PerformScript ControlBackspace()
	EndIf

	return
EndIf

if ( GetLine () == "" )
	Say( cmsgBlank1, OT_NO_DISABLE )
else
	var string word = GetPriorWord()
	if ( word )
		Say( word, OT_NO_DISABLE );
else
		Say( cmsgBlank1, OT_NO_DISABLE )
	EndIf
EndIf

TypeCurrentScriptKey ()
EndScript

void function TextSelectedEvent(string strText, int bUnSelecting,optional  int bContainsSpeechMarkup)
let giLastSelectionSpoken=GetTickCount()
TextSelectedEvent(strText, bUnSelecting,bContainsSpeechMarkup)
endFunction

int Function ieFocusToFirstField()
var
	object docParent,
	object docChild,
	object frames,
	int nFrames,
	int nIdx
let docParent = ie4GetCurrentDocument()
if !docParent then
	return FALSE
EndIf
if ieFocusToFirstFieldHelper(docParent) then
	return TRUE
EndIf
let frames = docParent.frames
let nFrames = frames.length
let nIdx = 0
while nIdx < nFrames
	if ieFocusToFirstFieldHelper (frames (nIdx).document) then
		return TRUE
	EndIf
	let nIdx = nIdx + 1
endwhile
return FALSE
EndFunction

Int Function ieFocusToFirstFieldHelper (object Doc)
var
	object all,
	object forms,
	int nIdx,
	object element,
	string theType
if ! doc then
	return FALSE
EndIf
let forms = doc.forms
if forms.length <= 0  then
	return FALSE
EndIf
let nIdx = forms(0).SourceIndex()
let all = doc.all
while nIdx < all.length
	let element = all(nIdx)
	let TheType = element.type
	if TheType != cscNull && TheType != scHidden1_L then
		if IsVirtualPcCursor() then
			SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
			doc.body.focus()
			SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 1)
			Delay(1)
		EndIf
		element.focus
		return TRUE
	EndIf
	let nIdx = nIdx + 1
endwhile
return FALSE
EndFunction

void function DoFocusToField(int FocusLocation, string sErrMsg_L, string sErrMsg_S)
var
	int RunningProducts
let RunningProducts = GetRunningFSProducts()
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
If !IsVirtualPcCursor() then
	if GetJcfOption (OPT_VIRTUAL_PC_CURSOR) > 0 then
		if GetWindowClass (GetCurrentWindow ()) != IE5Class then
			if RunningProducts == product_magic then
				ExMessageBox(sErrMsg_L, msgFocusToFormFieldDialog, MB_OK)
			else
				SayFormattedMessage (ot_ERROR, sErrMsg_L, sErrMsg_S)
			endIf
		elif !IsFormsModeActive() then
			if RunningProducts == product_magic then
				ExMessageBox(cmsgFeatureRequiresVirtualCursor_L, msgFocusToFormFieldDialog, MB_OK)
			else
				SayFormattedMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
			endIf
		else
			if RunningProducts == product_magic then
				ExMessageBox(msgFormsModeNavigate1, msgFocusToFormFieldDialog, MB_OK)
			else
				SayFormattedMessage (OT_ERROR, msgFormsModeOn1); Forms Mode is on
				SayFormattedMessage(OT_JAWS_message, msgFormsModeNavigate1)
			endIf
		endIf
	else
		if RunningProducts == product_magic then
			ExMessageBox(msgNotAvailable1_L, msgFocusToFormFieldDialog, MB_OK)
		else
			SayFormattedMessage(ot_ERROR, msgNotAvailable1_L, msgNotAvailable1_S)
		EndIf
	endIf
	return
endIf
if StringLength (GetListOfFormFields ()) == 0 Then
	SayElementNotFound(CVMSGFormField)
	Return
EndIf
let nSuppressEcho = TRUE
if MoveToFormField(FocusLocation) then
	SayObjectTypeAndText(0)
	ProcessNewText()
	NotifyIfContextHelp()
else
	if RunningProducts == product_magic then
		ExMessageBox(sErrMsg_L, msgFocusToFormFieldDialog, MB_OK)
	else
		SayFormattedMessage(ot_ERROR, sErrMsg_L, sErrMsg_S)
	endIf
EndIf
let nSuppressEcho = FALSE
EndFunction

Script FocusToFirstField()
DoFocusToField(s_top,msgFieldNotFound1_L,msgFieldNotFound1_S)
EndScript

Script FocusToFirstFormField()
DoFocusToField(s_top,msgFieldNotFound1_L,msgFieldNotFound1_S)
EndScript

script FocusToLastField()
DoFocusToField(s_bottom,msgFieldNotFound1_L,msgFieldNotFound1_S)
EndScript

Script FocusToLastFormField()
DoFocusToField(s_bottom,msgFieldNotFound1_L,msgFieldNotFound1_S)
EndScript

Script FocusToNextField()
DoFocusToField(s_next,msgFieldNotFound2_L,msgFieldNotFound2_S)
EndScript

Script FocusToNextFormField()
DoFocusToField(s_next,msgFieldNotFound2_L,msgFieldNotFound2_S)
EndScript

Script FocusToPriorField()
DoFocusToField(s_prior,msgFieldNotFound3_L,msgFieldNotFound3_S)
EndScript

Script FocusToPriorFormField()
DoFocusToField(s_prior,msgFieldNotFound3_L,msgFieldNotFound3_S)
EndScript

void function ItemSelectedEvent(handle hwnd,int type,int state,
	string name,string value,string description)
; Called when on the Windows 8 UI IE address-bar and navigating through the
; previously visited sites.
var
	int iBrlMode,
	int bShouldAnnounce
if !c_VisitedLocationData then
	let c_VisitedLocationData = new collection
	ClearVisitedLocationData()
endIf
;This event runs on navigating through the current item as well as when the current item changes.
;Announce if the current item changes,
;or if the user attempts to move past the first or last character in the current item.
SaveCursor()
PCCursor()
let bShouldAnnounce =
	c_VisitedLocationData.Title != name
	|| c_VisitedLocationData.CursorCol == GetCursorCol()
RestoreCursor()
if c_VisitedLocationData.Title != name then
	let c_VisitedLocationData.Title = name
endIf
if c_VisitedLocationData.CursorCol != GetCursorCol() then
	let c_VisitedLocationData.CursorCol = GetCursorCol()
EndIf
if !bShouldAnnounce then
	return
EndIf
IndicateControlType(wt_button,name,cscNull)
if BrailleInUse() then
	;structured mode braille must wait longer than line mode braille before showing a flash message:
	let iBrlMode = GetBrailleMode()
	If iBrlMode == BRL_MODE_LINE then
		let c_VisitedLocationData.ScheduledBrlMessage = ScheduleFunction("ShowBrlVisitedLocationTitle",3)
	elif iBrlMode == BRL_MODE_STRUCTURED then
		let c_VisitedLocationData.ScheduledBrlMessage = ScheduleFunction("ShowBrlVisitedLocationTitle",8)
	EndIf
EndIf
EndFunction

void function ClearVisitedLocationData()
let c_VisitedLocationData.Title = cscNull
let c_VisitedLocationData.CursorCol = 0
EndFunction

void function ShowBrlVisitedLocationTitle()
var
	int iBrlMode,
	string sBrlMsg
let c_VisitedLocationData.ScheduledBrlMessage = 0
let iBrlMode = GetBrailleMode()
let sBrlMsg = c_VisitedLocationData.Title
If iBrlMode == BRL_MODE_LINE then
	BrailleMessage(sBrlMsg+cscSpace+cwc290 )
elif iBrlMode == BRL_MODE_STRUCTURED then
	BrailleMessage(sBrlMsg+cscSpace+BrailleGetSubtypeDisplayName(wt_button),false)
EndIf
EndFunction

int function BrailleCallbackObjectIdentify()
var
	int result,
	int bRescheduleFlash
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
if c_VisitedLocationData.ScheduledBrlMessage then
	;keep unscheduling and rescheduling until the last component is updated
	UnScheduleFunction(c_VisitedLocationData.ScheduledBrlMessage)
	let bRescheduleFlash = true
EndIf
let result = BrailleCallbackObjectIdentify()
if bRescheduleFlash == true then
	let c_VisitedLocationData.ScheduledBrlMessage = ScheduleFunction("ShowBrlVisitedLocationTitle",6)
EndIf
return result
EndFunction

int function BrailleAddObjectValue(int iSubtype)
if IsTouchCursor() then
	return BrailleAddObjectValue(iSubtype)
endIf
if iSubtype == wt_edit
	if OnWin8IEAddressEdit() then
		BrailleAddString(GetObjectValue(true),GetCursorCol(),GetCursorRow(),GetControlAttributes())
		return true
	EndIf
EndIf
return BrailleAddObjectValue(iSubtype)
EndFunction

int function OnWin8IEAddressEdit()
var
	handle hWnd
if IEVersion <= 9 then
	return false
EndIf
let hWnd = GetFocus()
return GetWindowClass(hWnd) == cwc_RichEdit50W
	&& GetWindowClass(GetParent(hWnd)) == wc_AddressBarParent
EndFunction

void function IMEEndCompositionEvent(int p1, int p2)
	gbIsImeActive= FALSE;
EndFunction

void function IMEStartCompositionEvent()
	gbIsImeActive= TRUE;
EndFunction

;For G_UIA object: function CreateTreeWalkerWithCondition(object condition, optional object processCondition)
object function g_UIA_CreateTreeWalkerWithCondition(object condition, optional object processCondition)
;Restrict exploration to HJDialog if one is active:
if inHJDialog()
	ProcessCondition = g_UIA.CreateIntPropertyCondition( UIA_ProcessIdPropertyId, g_UIA.GetFocusedElement().ProcessID )
	return g_UIA_CreateTreeWalkerWithCondition(condition, processCondition)
endIf
;The IE page is in a different process id than the application,
;so we must create a special process id condition for the touch and object nav treewalker.
var
	handle hWndApp,
	int AppProcessID,
	object AppProcessCondition,
	handle hWndPage,
	int PageProcessID,
	object PageProcessCondition
if !processCondition
	hWndApp = GetAppMainWindow(GetFocus())
	AppProcessID = g_UIA.GetElementFromHandle(hWndApp).ProcessID
	hWndPage = FindWindow(hWndApp,cwcIEServer)
	PageProcessID = g_UIA.GetElementFromHandle(hWndPage).ProcessID
	if AppProcessID != PageProcessID
		AppProcessCondition = g_UIA.CreateIntPropertyCondition(UIA_ProcessIdPropertyId,AppProcessID)
		PageProcessCondition = g_UIA.CreateIntPropertyCondition(UIA_ProcessIdPropertyId,PageProcessID)
		if AppProcessCondition && PageProcessCondition
			ProcessCondition = g_UIA.CreateOrCondition(AppProcessCondition,PageProcessCondition)
		endIf
	endIf
endIf
return g_UIA_CreateTreeWalkerWithCondition(condition, processCondition)
EndFunction

int function SayViewDownloadsListItem(optional int bSayListItemInfo)
if !InViewDownloadsDialogList() return false endIf
var
	int type,
	string sName,
	string sHelp,
	string sDesc
type = GetObjectSubtypeCode(true)
if type == wt_ListBoxItem
	if bSayListItemInfo
		;for the list item, the info is the type:
		IndicateControlType(wt_ListBox,cscNull,cscNull)
	endIf
	Say(GetObjectName(),ot_line)
else
	if bSayListItemInfo
		;for descendants of the list item, the info is the name of the list item:
		Say(GetObjectName(true,1),ot_control_name)
	endIf
	SayObjectActiveItem()
endIf
sHelp = GetObjectHelp()
if sHelp
	SayUsingVoice(vctx_Message,sHelp,ot_screen_message)
endIf
sDesc = GetObjectDescription()
if sDesc
	SayUsingVoice(vctx_Message,sDesc,ot_screen_message)
endIf
return true
EndFunction

Void Function SayFocusedObject ()
SayFocusedObject()
var
	int type = GetObjectSubTypeCode (true, 0)
if (type != WT_LISTBOXITEM) then
	return
EndIf
var
	string description = GetObjectDescription (true, 1)
if !description then
	return
EndIf
SayUsingVoice(vctx_Message,description,ot_screen_message)
EndFunction

int function ShouldAddBasicLayerHelpTextBrowser()
return GetWindowClass(GetFocus()) == cwcIEServer
EndFunction

Script PictureSmartWithControl (optional int serviceOptions)
return PictureSmartWithControlShared (PSServiceOptions_Single | serviceOptions)
EndScript

Script PictureSmartWithControlMultiService (optional int serviceOptions)
return PictureSmartWithControlShared (PSServiceOptions_Multi | serviceOptions)
EndScript

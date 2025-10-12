; Copyright 1995-2025 Freedom Scientific, Inc.
; Script file  for Microsoft Outlook 2016 and O365

include "HjConst.jsh"
include "HjGlobal.jsh"
include "UIA.jsh"
include "MSAAConst.jsh"
include "HJHelp.jsh"
include "Outlook.jsh"
include "Common.jsm"
include "TutorialHelp.jsm"
include "Outlook.jsm"
include "OutlookCustomSettings2007.jsh"
include "OutlookCustomSettings2007.jsm"

import "uia.jsd"
import "touch.jsd"

use "word.jsb"
use "OutlookCustomSettings2007.jsb"
use "OutlookBrl.jsb"

globals
	int giScheduleSplitRefreshID,
		int giBrlShowMessagePreview, ; 0 off, 1 on but not currently showing, 2 currently showing.
		int giOutlookSplitModeValue,
int globalVirtualViewerVisible,
	collection c_OutlookVerbosity
	; Members are:
	; int MessageHeader -- MessageHeaderVerbosity.
	; int MessageType -- MessageTypeVerbosity.
	; int MessageSayAll -- MessageSayAllVerbosity.
	; int MessageLinkCount -- MessageLinkCountIndication.
	; int VirtualMessageWindowTitles -- SpeakWindowTitlesForVirtualMessages.
	; int InfoBar -- InformationBarVerbosity.
	; int UseJAWSCustomization -- Customization for message list items.
	; int IndicateUnread -- Whether or not to indicate when a message is unread.
	; int IndicateReplied -- Whether or not to indicate when a message has been replied to.
	; int IndicateForwarded -- Whether or not to indicate when a message is forwarded.

globals
	collection c_OutlookFocus
	; Members are:
	; string WinClassName -- From WindowClass of focus.
	; string ObjClassName -- From GetObjectClassName.
	; int ControlID -- From GetControlID of focus.
	; string RealWindowName -- Result of GetWindowName(GetRealWindow(GetFocus())).
	; string PrevRealWindowName -- The previous real window name.
	; int IsInOutlookMainWindow -- True if focus is in the Outlook main window, not in a message, appointment or dialog etc.
	; int FolderType -- The folder item type as retrieved from the Outlook object model.
	; int IsMessagesList -- True if focus is in an area which is a list of messages.
	; int IsTasksList -- True if focus is in the tasks list.
	; int InCalendar -- Result of evaluating if focus is in a windows belonging to the calendar.
	; int InContactsList -- Result of calling function InContactsList.
	; int TypeOfWindow -- One of the constants representing the type of window.
	; string UnreadMessages -- Retrieved when in the navigation tree.

; c_MessageListItem is for data related to the current item in a message list.
globals
	collection c_MessageListItem,
	; Members are:
	; stringArray Cells -- Contains data for each column cell if on a message, otherwise null if on a group.
	; int ColumnCount -- Count of column cells in the current table item.
	; int ColumnIndex -- Used to keep track of which column we are using when performing table navigation.
	; string SayLineText -- The text to be spoken by SayLine.
	; string BrlLineText -- the text to be shown as the braille value.
	; string PositionInGroup -- The position in group text.
;Do not put the following into the c_MessageListItem collection,
;since timing of focus change and repopulating the collection makes testing unreliable:
	string gsPriorGroupName ;Used to detect when the group changes while navigating the message list.

globals
	collection c_OutlookCalendar
	; Members are:
	; string ViewText -- the name of the calendar view.
	; string ViewBrlText -- The braille short text to use for the view.
	; string Text -- The text to be spoken or shown for the calendar item.

globals
	collection c_OutlookContact
	; Members are:
	; object Element -- UIA element for the current contact.
	; string Text -- The text to be spoken or shown in braille for the current contact.

globals
	collection c_OutlookInfoBar
	; Members are:
	;  handle hWnd -- The window handle of the info bar.
	; string text -- The text of the info bar.

globals
	collection c_BrlFieldStrings
	; This collection is used to gather the various abbreviated braille field strings from outlook.jsm into a collection.
	; The members are the text strings as they appear in Outlook.
	; Each member's value is the braille field abbreviated string.
	; This collection is specifically for managing braille abbreviation of text which appears in the MSAA value.

globals
	collection c_OutlookSounds
	; Members are:
	; string AutoCompleteListEnter -- Name of wave file to play when list appears.
	; string AutoCompleteListExit -- Name of wave file to play when list disappears.

;for calendar treeview state,
;Use a timer to detect if the toggle state should be announced.
;Note that when toggling a tree branch
;there may be several toggle events firing successively,
;since all the descendants may be toggled along with the branch.
const
	CalendarTreeviewStateChange_WaitTime = 3,
	CalendarMonthChange_WaitTime = 3
globals
	int CalendarTreeviewStateChange_ScheduleID

;We sometimes need to schedule a focus change announcement,
;where more than one focus change may or may not fire:
const
	FocusChanged_WaitTime = 20
globals
	int FocusChanged_ScheduleID,
	int FocusChangeTriggeredByMoveToTopOrBottomOfColumn

;No event fires when the last item in the message list is deleted.
;In the JAWSDelete and JAWSShiftDelete scripts we schedule a function to refresh the list if necessary.
;The refresh causes a focus change event, which allows us to announce the focus.
;PreProcessFocusChangedEventEx clears the timer if it was set.
;Also, when moving to top or bottom in a large message list, sometimes focus changes twice,
;where the first change focuses on the table instead of the message being moved to.
;The RefreshListAfterDelete sets the CheckForEmptyListAfterDelete variable,
;so that ActiveItemChangedEvent can test whether the empty list should be announced.
;The only time that ActiveItemChangedEvent should fire for an empty list is after the MSAA refresh.
const
	DeleteEventWaitTime = 3
globals
	int RefreshListAfterDelete_ScheduleID,
	int CheckForEmptyListAfterDelete

const
	OutlookUIAEventPrefix = "OutlookUIA"
globals
	int OutlookVersion,
	int OutlookUpdateVersion,
	int OutlookBuildVersion,
	int isMessageListPositionAndSizeOfSetZeroBased,
	object OmOutlook,
	object OmExplorer,
	object OmFolderItems,
	object oFSUIA_Outlook,
	object oContactsListListener,
	object oControllerForListener,
	object oAutoCompleteListener,
	object oCalendarTreeviewListener,
	object oHelpTextListener,
	object ReusableRawCondition, ;Do not set this to anything except raw, and unfiltered by any condition constraints.
object oAccessibleObjectToolsOutlook ; used for message lists 

;In Outlook, we may process a focus change as an active item change,
;even though the change depth would typically indicate a focus change event should be processed.
;We sometimes need to know which type of focus change event was processed.
;This is specifically used to determine whether or not a tutor message event should fire.
const
	FocusChangeType_Focus = 0,
	FocusChangeType_ActiveItem = 1
globals
	int FocusChangeType,
	int FocusChangeShouldBeSilent

globals
	int gbUsingWordNavQuickKeys

;for controls which are virtualized when in focus:
const
	vwn_CalendarPreviewPane = "Calendar Preview Pane"

;The UIA positionInSet for the message list changed from 0-based to 1-based as of Outlook build 16.0.14324.10000.
const
	updateVersion_MessageListIs1Based = 14324,
	buildNumber_MessageListIs1Based = 10000

const
	AutoComplete_RecentContacts = 1,  ;To and CC address fields
	AutoComplete_AllContacts = 2  ;AtMention in message body

globals
	int AutoCompleteDetectedByValueChange,
		collection c_OutlookAutoComplete
	; Members are:
	; object ListElement -- The element which is the list, not a list item element.
	; int ListType -- One of the AutoComplete constants listed above.
	; string ListHelp -- This is actually the UIA name of the list, but it reads more like help text.
	; string Text -- Text of the selected list item.
	; string PositionInGroup -- Retrieved from UIA SizeOfSet and PositionInSet.

	
prototype string function GetEmailHeaderSentBy()
prototype string function GetEmailHeaderSentAt()
prototype object function GetFocusedUIAObjectSubtree()
;We are trying to make autocomplete of address fields work for systems which do not fire the secondary focus event.
;Since we don't know if the secondary focus event will fire until it does fire,
;we set up the UIA hack and then kill it after the event fires the first time.
globals
	int UsesSecondaryFocus,  ;becomes true the first time a secondary focus event fires.
	int SecondaryFocusItemSpokenByUIA  ;Used to prevent double speaking due to UIA speaking before we kill it off after the secondary focus event fires.


void function CreateAccessibleObjectToolsForInboxIfNeeded()
if oAccessibleObjectToolsOutlook then return endIf
let oAccessibleObjectToolsOutlook = CreateObjectEx("FreedomSci.AccessibleTree",0,"AccessibleObjectTools.x.manifest")
endFunction

void function AutoStartEvent ()
var
	int prevOutlookVersion = OutlookVersion,
	int prevOutlookUpdateVersion = OutlookUpdateVersion,
	int prevOutlookBuildVersion = OutlookBuildVersion
OutlookVersion = GetProgramVersion (GetAppFilePath ())
GetFixedProductVersion(GetAppFilePath (), 0, 0, OutlookUpdateVersion, OutlookBuildVersion)
;Because more than one version of Outlook can be installed,
;test to see if we need to re-detect the value of UsesSecondaryFocus due to a version change:
if prevOutlookVersion != OutlookVersion
|| prevOutlookUpdateVersion != OutlookUpdateVersion
|| prevOutlookBuildVersion != OutlookBuildVersion
	;We need to detect it:
	UsesSecondaryFocus = false
endIf
isMessageListPositionAndSizeOfSetZeroBased = MessageListPositionAndSizeOfSetIsZeroBased()
InitNewOutlookCollections()
InitBrailleCollection()
InitializeOmOutlookObjects()
SetVirtualViewerVisibility()
loadNonJCFOptions()
oFSUIA_Outlook = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
ReusableRawCondition = oFSUIA_Outlook.CreateRawViewCondition()
CreateAccessibleObjectToolsForInboxIfNeeded()
giInitialSplitModeValue=BrailleGetSplitMode()
if AppAllowedToChangeSplitMode() then
	BrailleSplitMode(giOutlookSplitModeValue)
endIf
if !(getRunningFSProducts () & (Product_Fusion | product_ZoomText))
	MouseToTopLeft()
endIf
EndFunction

void function AutoFinishEvent()
ClearAnyScheduledTimers()
NullOmOutlookObjects()
EnsureAllVirtualWindowsAreDeactivated()
ClearAllCollections()
NullAllUIAObjects()
AutoCompleteDetectedByValueChange = false
if AppAllowedToChangeSplitMode() then
	BrailleSplitMode(giInitialSplitModeValue)
endIf
EndFunction

void function SetVirtualViewerVisibility()
globalVirtualViewerVisible = ReadSettingInteger("Options","bVirtViewer",1,FT_CURRENT_JCF)
EndFunction

int function MessageListPositionAndSizeOfSetIsZeroBased()
if OutlookUpdateVersion < updateVersion_MessageListIs1Based return true endIf
if OutlookBuildVersion < buildNumber_MessageListIs1Based return true endIf
return false
EndFunction

void function ClearAnyScheduledTimers()
ClearAnyFocusChangedTimer()
ClearAnyCalendarTreeviewStateChangeTimer()
ClearAnyDeleteEventWaitTimer()
EndFunction

void function InitNewOutlookCollections()
if !c_OutlookVerbosity c_OutlookVerbosity = new collection endIf
if !c_OutlookFocus c_OutlookFocus = new collection endIf
if !c_BrlFieldStrings c_BrlFieldStrings = new collection endIf
if !c_MessageListItem c_MessageListItem = new collection endIf
if !c_OutlookCalendar c_OutlookCalendar = new collection endIf
if !c_OutlookContact c_OutlookContact = new collection endIf
if !c_OutlookAutoComplete c_OutlookAutoComplete = new collection endIf
if !c_OutlookInfoBar c_OutlookInfoBar = new collection endIf
if !c_OutlookSounds c_OutlookSounds = new collection endIf
EndFunction

void function ClearAllCollections()
collectionRemoveAll(c_OutlookVerbosity)
CollectionRemoveAll(c_OutlookFocus)
CollectionRemoveAll(c_BrlFieldStrings)
CollectionRemoveAll(c_MessageListItem)
CollectionRemoveAll(c_OutlookCalendar)
CollectionRemoveAll(c_OutlookContact)
CollectionRemoveAll(c_OutlookAutoComplete)
CollectionRemoveAll(c_OutlookInfoBar)
CollectionRemoveAll(c_OutlookSounds)
EndFunction

void function NullAllUIAObjects()
oFSUIA_Outlook = Null()
ReusableRawCondition = null()
oContactsListListener = Null()
oControllerForListener = Null()
oAutoCompleteListener = Null()
oCalendarTreeviewListener = Null()
oHelpTextListener = Null()
oAccessibleObjectToolsOutlook =Null()
EndFunction

object Function GetNativeOutlookOM()
; Bail if in an hj dialog like Customize Outlook Message List, preventing OM from hanging and stopping the dialog:
if inHjDialog() return null () endIf
if !OutlookVersion
	OutlookVersion = GetProgramVersion (GetAppFilePath ())
endIf
var string ApplicationString = FormatString ("Outlook.Application.%1", OutlookVersion)
var object oOutlook = GetObject(ApplicationString)
If !oOutlook
&& DetectIfInOutlookMainWindow (GetFocus ())
	ApplicationString = FormatString ("Outlook.Application.%1", OutlookVersion)
	oOutlook = CreateObjectEx (ApplicationString, 3)
EndIf
If oOutlook
	oOutlook = oOutlook.Application
EndIf
Return oOutlook
EndFunction

int Function InitializeOmOutlookObjects()
if OmOutlook
&& OmExplorer
&& OmFolderItems
	return true
endIf
OmOutlook = GetNativeOutlookOM()
If !OmOutlook
	Return FALSE
EndIf
OmExplorer = OmOutlook.ActiveExplorer
If !OmExplorer
	OmOutlook = Null()
	Return FALSE
EndIf
OmFolderItems = OmExplorer.CurrentFolder.Items
If !OmFolderItems
	OmOutlook = Null()
	OmExplorer = Null()
	Return FALSE
EndIf
Return TRUE
EndFunction

void function NullOmOutlookObjects()
If OmOutlook
	ComRelease(OmOutlook, true)
	OmOutlook = Null()
EndIf
If OmExplorer
	ComRelease(OmExplorer, true)
	OmExplorer = Null()
EndIf
If OmFolderItems
	ComRelease(OmFolderItems, true)
	OmFolderItems = Null()
EndIf
EndFunction

void function loadNonJCFOptions()
;Ensure we never use virtual cursor in read-only messages when MAGic is running:
if getRunningFSProducts() & product_MAGic
	setJCFOption (OPT_USE_VPC_INSTEAD_OF_ENHANCED_EDIT_FOR_READONLY_DOCS, OFF)
endIf
;Always turn off Document Presentation mode in case it is set to ON:
setJCFOption (optHTMLDocumentPresentationMode, 0)
InitVerbosityCollection()
loadNonJCFOptions()
if !c_OutlookSounds c_OutlookSounds = new collection endIf
c_OutlookSounds.AutoCompleteListEnter = readSettingString (Section_NonJCFOptions, "AutoCompleteListEnterSound", cscNull, FT_CURRENT_JCF, rsStandardLayering)
c_OutlookSounds.AutoCompleteListExit = readSettingString (Section_NonJCFOptions, "AutoCompleteListExitSound", cscNull, FT_CURRENT_JCF, rsStandardLayering)
endFunction

void function InitBrailleCollection()
if !c_BrlFieldStrings c_BrlFieldStrings = new collection endIf
c_BrlFieldStrings[sc_FlagUnread] = msgBrlFlagUnread
c_BrlFieldStrings[sc_FlagReplied] = msgBrlFlagReplied
c_BrlFieldStrings[sc_FlagForwarded] = msgBrlFlagForwarded
c_BrlFieldStrings[sc_MeetingRequest] = msgBrlFlagMeetingRequest
c_BrlFieldStrings[sc_MeetingCancelled] = msgBrlFlagMeetingCancelled
c_BrlFieldStrings[sc_MeetingTentative] = msgBrlFlagMeetingTentative
c_BrlFieldStrings[sc_HasReminder] = msgBrlFlagHasReminder
var int i, int count
var string item, string key, string value
count = StringSegmentCount(msgBrlFlagsCollection,"\n")
For i = 1 To count
	item = StringSegment(msgBrlFlagsCollection, cscBufferNewLine, i)
	If !StringIsBlank (item)
		key = StringSegment (item, "=", 1)
		value = StringSegment (item, "=", 2)
		if key && value
			c_BrlFieldStrings[key] = value
		endIf
	EndIf
EndFor
EndFunction

void function InitVerbosityCollection()
if !c_OutlookVerbosity c_OutlookVerbosity = new collection endIf
c_OutlookVerbosity.MessageHeader = GetNonJCFOption ("MessageHeaderVerbosity")
c_OutlookVerbosity.MessageType = GetNonJCFOption ("MessageTypeVerbosity")
c_OutlookVerbosity.MessageSayAll = GetNonJCFOption ("MessageSayAllVerbosity")
c_OutlookVerbosity.MessageLinkCount = GetNonJCFOption ("MessageLinkCountIndication")
c_OutlookVerbosity.VirtualMessageWindowTitles = getNonJCFOption ("SpeakWindowTitlesForVirtualMessages")
c_OutlookVerbosity.InfoBar = getNonJCFOption ("InformationBarVerbosity")
c_OutlookVerbosity.UseJAWSCustomization = getNonJCFOption ("UseJAWSCustomization")
c_OutlookVerbosity.IndicateUnread = getNonJCFOption("UnreadVerbosity")
c_OutlookVerbosity.IndicateReplied = getNonJCFOption("RepliedVerbosity")
c_OutlookVerbosity.IndicateForwarded = getNonJCFOption("ForwardedVerbosity")
c_OutlookVerbosity.AutoCompletePlaySounds = getNonJCFOption ("AutoCompletePlaySounds") ; Play Sounds For Autocomplete checkbox
EndFunction

void function PlayAutoCompleteSound (string soundFile)
if c_OutlookVerbosity.AutoCompletePlaySounds then
	PlaySound(findJAWSSoundFile(soundFile))
endIf
endFunction

int function ForceFocusToWordDocumentWindow(handle hwndFocus)
if GetWindowClass(hwndFocus) != "_wwb"
	return false
endIf
var handle hwndDocument = findWindow (hwndDocument, wc_wwg)
if isWindowVisible (hwndDocument)
&& GetWindowClass(hwndDocument) == wc_wwg
	SetFocus(hwndDocument)
	return TRUE
endIf
return false
EndFunction

int function OutlookIsActive()
return StringLower(GetAppFileName()) == "outlook.exe"
endFunction

int function InProofingPaneSpellCheckWithSplitButtons()
; This function is only needed in Word. The Word implementation uses FSUIA
; and is extremely slow. Stub it out here so that when we chain down to the
; Word scripts, this version is used instead.
return FALSE
EndFunction

int function InOptionsDialog(optional handle hWnd)
if GetMenuMode() > 0
|| !dialogActive() 
|| inHjDialog()
|| UserBufferIsActive()
	return false
endIf
if hwnd
&& stringContains (getWindowClass (hwnd), "SDM")
	return FALSE
endIf
var	handle hTemp = hWnd
if (!hTemp) hTemp = getFocus() endIf
while hTemp
&& GetWindowClass(hTemp) != wc_NUIDialog
	hTemp = GetParent(hTemp)
EndWhile
if hTemp
	if StringContains(GetWindowName(hTemp),wn_Options)
	|| StringContains(getWindowName(GetRealWindow(hTemp)),wn_options)
		return true
	EndIf
EndIf
return false
EndFunction

int Function InCommonAlertDlg()
;Purpose:	Determines common dialogs with row of buttons, non-SDM, dialog, caption and choice(s)
if !DialogActive() return false endIf
if InHjDialog() return true endIf
if IsMultiPageDialog() return false endIf
var
	handle hWnd,
	int iType
hWnd = GetFocus()
;Focusable controls in alert dialogs = button,checkbox,radio,InlineToolbarButton,similar.
;All fall under typecode of Button
iType = GetWindowtypeCode (hWnd)
If !iType
	iType = GetObjectTypeCode (TRUE)
EndIf
If iType != WT_BUTTON
	return false
EndIf
;These dialogs do not have richEdit in them.
If FindWindow (GetParent (hWnd), cwc_RichEdit20WPT)
	Return FALSE
EndIf
;Property of alert = parent is dialog standard, sibling first and last = static in between = whatever:
if GetWindowClass (GetParent (hWnd)) != cWc_dlg32770
	return false
endIf
iType = GetWindowSubtypeCode (GetFirstWindow (hWnd))
return 	(iType == WT_STATIC || iType == WT_BUTTON)
	;Last window in said dialogs is generally static.
	&& GetWindowSubtypeCode (GetLastWindow (hWnd)) == WT_STATIC
EndFunction

Int Function IsEMailMessage()
return OutlookIsActive()
		&& gbWordIsWindowOwner
EndFunction

int function inReadOnlyEmailMessageUsingVirtualCursor ()
return isVirtualPcCursor () && ! UserBufferIsActive () && GetWindowClass (getFocus ()) == "_WwG"
endFunction

Int Function ShouldMessageHeaderSpeak()
Return c_OutlookVerbosity.MessageHeader == true
endFunction

Int Function ShouldMessageTypeSpeak()
Return c_OutlookVerbosity.MessageType
endFunction

Int Function ShouldMessageSayAll()
Return c_OutlookVerbosity.MessageSayAll
endFunction

Int Function ShouldMessageLinkCountSpeak()
Return c_OutlookVerbosity.MessageLinkCount
endFunction

int Function TypeOfWindow()
return c_OutlookFocus.TypeOfWindow
endFunction

int Function DetectTypeOfWindow(handle hWnd)
var	string title = GetWindowName(GetAppMainWindow(hWnd))
if StringContains (title, scMessage)
	return MessageWindowType
elif StringStartsWith (title, wn_Calendar)
	return CalendarWindowType
elif StringStartsWith(title, wn_Contacts)
	return ContactWindowType
elif StringStartsWith(title, wn_Tasks)
	return TaskWindowType
elif StringContains (title, scReport)
	return ReportWindowType
elif StringContains (title, scMeetingDialog)
	return MeetingWindowType
EndIf
return UnknownWindowType
EndFunction

int function IsCalendarWindow(handle hWnd, optional string className)
if !hWnd return false endIf
if !className className = GetWindowClass(hWnd) endIf
return className == WC_DayViewWnd
	|| className == WC_WeekViewWnd
	; Class is wc_AfxWndW when Schedule View is checked.
	; However, class is also wc_AfxWndW in the Appointment edit dialog,
	; but DialogActive returns false in that scenario.
	|| (className == wc_AfxWndW && GetWindowClass(GetParent(hWnd)) != cWc_dlg32770)
EndFunction


int function CurrentFormContainsTimeField(handle focusWindow)
var handle realWindow = getRealWindow (focusWindow)
return isWindowVisible (FindDescendantWindow (realWindow, id_app_starttime))
endFunction

int Function DetectIfInOutlookMainWindow(handle hWnd)
var	Handle hMainApplicationWindow = GetAppMainWindow(hWnd)
if GetWindowClass(hMainApplicationWindow) != wc_Rctrl_RenWnd32
|| GetActiveConfiguration () != "Outlook"
	return false
endIf
var	Handle hCommandBarDock = FindWindow (hMainApplicationWindow, WC_MsoCommandBarDock, cScNull)
If hCommandBarDock
	While GetWindowClass (GetNextWindow (hCommandBarDock)) == WC_MsoCommandBarDock
		hCommandBarDock = GetNextWindow (hCommandBarDock)
	EndWhile
	If GetFirstChild(hCommandBarDock)
		Return true
	EndIf
EndIf
Return FALSE
EndFunction

void function UpdateOutlookFocus(handle hWnd)
;Note that the order of some of these assignments is significant,
;since some of the tests and assignments depend on other assignments to already be done:
var	string winClassName = GetWindowClass(hWnd)
c_OutlookFocus.WinClassName = winClassName
c_OutlookFocus.ObjClassName = GetObjectClassName()
c_OutlookFocus.ControlID = getControlID(hWnd)
c_OutlookFocus.PrevRealWindowName = c_OutlookFocus.RealWindowName
c_OutlookFocus.RealWindowName = GetWindowName(GetRealWindow(GetFocus()))
var int IsInOutlookMainWindow = DetectIfInOutlookMainWindow(hWnd)
c_OutlookFocus.IsInOutlookMainWindow = IsInOutlookMainWindow
var int folderType = UnknownFolderType
if IsInOutlookMainWindow
&& OmFolderItems
	folderType = OmExplorer.CurrentFolder.DefaultItemType
endIf
c_OutlookFocus.FolderType = folderType
c_OutlookFocus.IsMessagesList = (!DialogActive()
	&& IsInOutlookMainWindow
	&& winClassName == wc_OutlookGrid
	&& c_OutlookFocus.ControlID == id_GridView
	&& (folderType == MailFolderType
		|| folderType == AppointmentFolderType
		|| folderType == ContactFolderType
		|| folderType == TaskFolderType
		|| folderType == SharedPublicFolderType))
c_OutlookFocus.IsTasksList = (c_OutlookFocus.IsMessagesList && folderType == TaskFolderType)
c_OutlookFocus.TypeOfWindow = DetectTypeOfWindow(hWnd)
c_OutlookFocus.InCalendar = IsCalendarWindow(hWnd,winClassName)
c_OutlookFocus.InContactsList = InContactsList()
EndFunction

int function IsInOutlookMainWindow()
return c_OutlookFocus.IsInOutlookMainWindow
EndFunction

int function OnStatusBarToolBar()
return GetObjectRole(1) == ROLE_SYSTEM_STATUSBAR
	|| GetObjectRole(2) == ROLE_SYSTEM_STATUSBAR
EndFunction

int function OnNetUIGalleryButton()
return c_OutlookFocus.ObjClassName == wc_NetUIGalleryButton
	&& !GetObjectName()
	&& !GetObjectValue()
	&& !GlobalMenuMode
	&& !UserBufferIsActive()
	&& IsPCCursor()
EndFunction

string function ConvertNetUIGalleryButtonTextToColorName(string text)
if !StringStartsWith(text,"RGB(") return cscNull endIf
var string s = stringStripAllBlanks(StringReplaceChars(text,"RGB()"," "))
var int count = StringSegmentCount(s,",")
if count != 3 return cscNull endIf
var string r = StringRight(FormatString("00%1", StringSegment(s,",",1)),3)
var string g = StringRight(FormatString("00%1", StringSegment(s,",",2)),3)
var string b = StringRight(FormatString("00%1", StringSegment(s,",",3)),3)
var string rgb = FormatString("%1%2%3", r, g, b)
var string color = GetColorName(RGBStringToColor(RGB))
if !color return cscNull endIf
return StringSegment(color,",",1)
EndFunction

int function InEditableAreaOfMessage()
if c_OutlookFocus.WinClassName != wc_wwg
&& c_OutlookFocus.WinClassName != wc_RichEdit20WPT
	return false
endIf
return GetObjectIsEditable()
EndFunction

int function InMessageList()
return c_OutlookFocus.WinClassName == wc_OutlookGrid
	&& c_OutlookFocus.ControlID == id_GridView
	&& !GlobalMenuMode
	&& !UserBufferIsActive()
	&& IsPCCursor()
EndFunction

handle function FindAncestorDialogWindow(handle hWnd)
var handle h = hWnd
while h
	h = GetParent(h)
	if GetWindowClass(h) == cWc_dlg32770
		return h
	endIf
endWhile
return Null()
EndFunction

int Function InMessageTextWindow()
;Not only for message text,
;but also for meetings and appointments,
;where the editable message area is present:
if c_OutlookFocus.WinClassName == wc_wwg
	return true
endIf
var handle hWnd
if c_OutlookFocus.ObjClassName == wc_NetUIPersona 
	hWnd = FindAncestorDialogWindow(GetFocus())
else
	hWnd = GetParent(GetFocus())
endIf
if !hWnd
|| GetWindowClass(hWnd) != cWc_dlg32770
	return false
endIf
return FindWindow(hWnd, wc_wwg) != Null()
EndFunction

int function InMessageHeaderReadOnlyMultilineEdit()
if c_OutlookFocus.WinClassName != wc_RichEdit20WPT
|| GetWindowSubtypeCode(GetFocus()) != wt_ReadOnlyEdit
|| GetObjectSubtypeCode() != WT_MULTILINE_EDIT
	return false
endIf
return FindWindow(GetParent(GetFocus()), wc_wwg) != Null()
EndFunction

string function GetUIALabelFromPriorElement()
var object oLabel = FSUIAGetPriorSiblingOfElement(GetUIAFocusElement(oFSUIA_Outlook))
if !oLabel return cscNull endIf
return oLabel.name
EndFunction

void function SayMessageHeaderReadOnlyMultilineEdit()
;These controls are particularly non-conforming to accessibility expectations.
;The text we get from the OSM corresponds to the text seen with the cursor,
;so we use it instead of the UIA name which does not correspond to the OSM-visible text.
;However, It appears that UIA is the best option for retrieving the field label text.
IndicateControlType(wt_ReadOnlyEdit,
	GetUIALabelFromPriorElement(),
	GetWindowTextEx(GetFocus(),false,true))
EndFunction

int function OnCalendarPreviewPane()
return c_OutlookFocus.WinClassName == wc_AfxWndW
	&& c_OutlookFocus.ControlID == id_CalendarPreviewPane
EndFunction

int function inCalendar()
return c_OutlookFocus.InCalendar == true
	&& !GlobalMenuMode
	&& !UserBufferIsActive()
	&& IsPCCursor()
endFunction

int function InContactsList()
return c_OutlookFocus.TypeOfWindow == ContactWindowType
	&& c_OutlookFocus.ObjClassName == wc_ContactCard
	&& !GlobalMenuMode
	&& !UserBufferIsActive()
	&& IsPCCursor()
EndFunction

int function InNavigationPane()
return c_OutlookFocus.WinClassName == wc_NetUIHWND
	&& c_OutlookFocus.ObjClassName == wc_NetUIWBTreeDisplayNode
	&& !UserBufferIsActive()
	&& IsPCCursor()
EndFunction

int function inCalendarTreeView()
if !InNavigationPane () return false endIf
var int treeViewNode = FindAncestorOfType (WT_TREEVIEW)
return treeViewNode
	&& stringContains(getObjectName(FALSE, treeViewNode), scCalendar)
endFunction

object function GetFocusedTreeItemFromUIA()
	var object element = FSUIAGetFocusedElement (True)
if element.controlType == UIA_TreeItemControlTypeId
	return element
endIf
;Sometimes what we get is an element of type group,
;and what we want is the parent:
if element.controlType == UIA_GroupControlTypeId
&& element.className == "NetUITreeViewContent"
	element = FSUIAGetParentOfElement(element)
	if element.controlType == UIA_TreeItemControlTypeId
		return element
	endIf
endIf
return Null()
EndFunction

int function UIAGetNavigationPaneTreeviewLevel(object element)
if !element
|| element.controlType != UIA_TreeItemControlTypeId
	return 0
endIf
return element.level
endFunction

int function GetTreeViewItemCheckStateFromUIA(object element)
if !element
|| element.controlType != UIA_TreeItemControlTypeId
	return 0
endIf
; there's a check box next to the leaf node, so we'll get its state:
element = FSUIAGetFirstChildOfElement (element)
if !element || element.controlType != UIA_CheckBoxControlTypeId then return false endIf
var object pattern = element.getTogglePattern()
if !pattern then return FALSE endIf
var int state = pattern.ToggleState 
if state == ToggleState_Off
	return CTRL_UNCHECKED
elif state == ToggleState_On
	return CTRL_CHECKED
elif state == ToggleState_Indeterminate
	return CTRL_PARTIALLY_CHECKED
endIf
return false
endFunction

string function UIAGetNavigationPaneTreeviewItemState (object element)
if !element
|| element.controlType != UIA_TreeItemControlTypeId
	return cscNull
endIf
var object pattern = element.GetExpandCollapsePattern();
if !pattern return cscNull endIf
if pattern.ExpandCollapseState < 3
; not a leaf
	return GetObjectState (TRUE)
endIf
return cscNull
endFunction

string function GetRoomFinderCalendarButtonName()
if c_OutlookFocus.ObjClassName != wc_NetUIOcxControl return cscNull endIf
var object element = FSUIAGetFocusedElement (True)
if !element return cscNull endIf
var string name = element.name
if !name return cscNull endIf
;Strip out the unprintable characters which show in braille as spaces:
return StringRemoveCharsInRange(name,0x200e,0x200e)
EndFunction

int function SayCalendarTreeviewItemObjectTypeAndText()
;For functions which say all information unconditionally,
;such as SayLine and SayObjectTypeAndText.
var object element = GetFocusedTreeItemFromUIA()
if !element return false endIf
var int iLevel = UIAGetNavigationPaneTreeviewLevel(element)
var string sLevel = IntToString (iLevel)
var string sMessage = FormatString (cmsg233_L, sLevel)
SayMessage (OT_POSITION, sMessage, sLevel) ; "level "
var int state = GetTreeViewItemCheckStateFromUIA(element)
If state
	IndicateControlState (WT_TREEVIEW, state)
EndIf
Say(getObjectName(SOURCE_CACHED_DATA), OT_LINE)
indicateControlState (WT_TREEVIEW, getControlAttributes ()&~CTRL_SELECTED)
return true
EndFunction

void Function SayTreeViewLevel(int IntelligentPositionAnnouncement)
var
	String sLabelClosed,
	string sLevel,
	string sMessage,
	Handle hFocus,
	Int iAttributes,
	Int iLevel,
	int nState,
	int bLevelChanged
If InNavigationPane ()
	var object element = GetFocusedTreeItemFromUIA()
	iLevel = UIAGetNavigationPaneTreeviewLevel(element)
	If iLevel != PreviousTreeviewLevel
		bLevelChanged = true
		sLevel = IntToString (iLevel)
		sMessage = FormatString (cmsg233_L, sLevel)
		SayMessage (OT_POSITION, sMessage, sLevel) ; "level "
		PreviousTreeViewLevel= iLevel
	endIf
	If inCalendarTreeView ()
		var int state = GetTreeViewItemCheckStateFromUIA(element)
		IndicateControlState (WT_TREEVIEW, state)
		Say(getObjectName(SOURCE_CACHED_DATA), OT_LINE)
		; speak the open and closed states without speaking "selected":
		indicateControlState (WT_TREEVIEW, getControlAttributes ()&~CTRL_SELECTED)
		Return
	EndIf
	Say (GetObjectName(SOURCE_CACHED_DATA), OT_CONTROL_NAME)
	say (UIAGetNavigationPaneTreeviewItemState (element), OT_ITEM_STATE)
	Return
elIf DialogActive () && ! inHjDialog ()
	iLevel = GetTreeviewLevel()
	If iLevel != PreviousTreeviewLevel
		bLevelChanged = true
		sLevel = IntToString (iLevel)
		sMessage = FormatString (cmsg233_L, sLevel)
		SayMessage (OT_POSITION, sMessage, sLevel) ; "level "
		PreviousTreeViewLevel= iLevel
	endIf
	Say (GetObjectName(SOURCE_CACHED_DATA), OT_LINE)
	nState = GetControlAttributes()& ~CTRL_SELECTED
	IndicateControlState (WT_TREEVIEWITEM, nState)
	if IntelligentPositionAnnouncement
	&& bLevelChanged
		say (positionInGroup (), OT_POSITION)
	endIf
	Return
EndIf
SayTreeViewLevel(IntelligentPositionAnnouncement)
EndFunction

void function SayTreeViewItem()
if InMessageList()
	SayLine ()
	if GetObjectMSAAState (0) & STATE_SYSTEM_EXPANDED
		Say (cMsgExpanded, OT_ITEM_STATE)
	elIf GetObjectMSAAState (0) & STATE_SYSTEM_COLLAPSED
		Say (cMsgCollapsed, OT_ITEM_STATE)
	endIf
	return
endIf
var
	String sTemp,
	String sName,
	String sLine

sName = GetObjectName(SOURCE_CACHED_DATA)
sLine = GetLine ()
; To announce the number of unread messages in the folders in go to folder dialogue, Copy items dialogue, move items dialogue, Copy Folder dialogue, Move Folder dialogue, Create New Folder dialogue.
If StringCompare (sName, sLine, FALSE)
	sTemp = sName
	StringTrimCommon (sTemp, sLine, 1)
	sLine = StringTrimLeadingBlanks (sLine)
	If StringContainsChars (StringSegment (sLine, cScSpace, 1), SC_DigitalChars)
		Say (sName, OT_LINE)
		SayMessage (OT_LINE, FormatString (msgUnread_L, StringSegment (sLine, cScSpace, 1)), FormatString (msgUnread_L, StringSegment (sLine, cScSpace, 1)))
	Else
		If inCalendarTreeView ()
			var object element = GetFocusedTreeItemFromUIA()
			var int state = GetTreeViewItemCheckStateFromUIA(element)
			If state
				IndicateControlState (WT_TREEVIEW, state)
			EndIf
			Say (sName, OT_LINE)
			Return
		EndIf
		Say (sName, OT_LINE)
	EndIf
	SayTVFocusItemExpandState (GetFocus ())
	Return
EndIf
SayTreeViewItem()
EndFunction

object function GetDialogAncestorElement()
var object element = GetUIAFocusElement(oFSUIA_Outlook)
while element
	if element.ClassName == cWc_dlg32770
		return element
	endIf
	element = FSUIAGetParentOfElement(element)
endWhile
return Null()
EndFunction

object function GetTreeViewAncestorElement()
var object element = GetUIAFocusElement(oFSUIA_Outlook)
while element
	if element.controlType == UIA_TreeControlTypeId
		return element
	endIf
	element = FSUIAGetParentOfElement(element)
endWhile
return Null()
EndFunction

void function ManageUIAListeners()
ManageContactsListUIAListener()
ManageEditableMessageUIAListener()
ManageCalendarTreeviewUIAListener()
ManageHelpTextUIAListener()
EndFunction

void function ManageContactsListUIAListener()
if c_OutlookFocus.InContactsList != true
	if oContactsListListener 
		oContactsListListener = Null()
	endIf
	return
EndIf
if oContactsListListener
	return
endIf
var object oFocus = GetUIAFocusElement(oFSUIA_Outlook)
var object element
if oFocus
	element = FSUIAGetParentOfElement(FSUIAGetParentOfElement(oFocus))
endIf
if !element
	return
endIf
oContactsListListener = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oContactsListListener
|| !ComAttachEvents (oContactsListListener, OutlookUIAEventPrefix)
|| !oContactsListListener.AddAutomationEventHandler(UIA_SelectionItem_ElementSelectedEventId, element, TREESCOPE_SUBTREE)
	oContactsListListener = Null()
	return
endIf
;Force firing of the event when listening starts, so that the item gaining focus can be announced:
OutlookUIAAutomationEvent (oFocus, UIA_SelectionItem_ElementSelectedEventId)
EndFunction

void function ManageEditableMessageUIAListener()
if UsesSecondaryFocus return endIf
if !InEditableAreaOfMessage()
	if ManageManualDetectionOfAutoCompleteListClosing()
		return
	endIf
	if oControllerForListener
		oControllerForListener = Null()
	endIf
	return
endIf
if oControllerForListener
	return
endIf
;Set the listener to the dialog,
;so that we catch controllerFor changes to all applicable children:
var object element = GetDialogAncestorElement()
if !element
	return
endIf
oControllerForListener = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oControllerForListener
|| !ComAttachEvents (oControllerForListener, OutlookUIAEventPrefix)
|| !oControllerForListener.AddPropertyChangedEventHandler(UIA_ControllerForPropertyId, Element, TREESCOPE_SUBTREE)
	oControllerForListener = Null()
endIf
element = GetUIAFocusElement(oFSUIA_Outlook)
if element.controllerFor && element.controllerFor.count > 0
	StartListeningForAutoComplete(element.controllerFor(0))
endIf
endFunction

void function ManageCalendarTreeviewUIAListener()
if !inCalendarTreeView()
	if oCalendarTreeviewListener
		oCalendarTreeviewListener = Null()
	endIf
	return
endIf
if oCalendarTreeviewListener
	return
endIf
;Set the listener to the treeview,
;so that we catch toggle pattern changes to all treeview items:
var object element = GetTreeViewAncestorElement()
if !element
	return
endIf
oCalendarTreeviewListener = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oCalendarTreeviewListener
|| !ComAttachEvents (oCalendarTreeviewListener, OutlookUIAEventPrefix)
|| !oCalendarTreeviewListener.AddPropertyChangedEventHandler(UIA_ToggleToggleStatePropertyId, Element, TREESCOPE_SUBTREE)
	oCalendarTreeviewListener = Null()
endIf
EndFunction

void function ManageHelpTextUIAListener()
if oHelpTextListener
|| !c_OutlookFocus.IsInOutlookMainWindow
	return
endIf
var object element = FSUIAGetElementFromHandle (GetAppMainWindow (GetFocus()))
if !element
	return
endIf
oHelpTextListener = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oHelpTextListener
|| !ComAttachEvents (oHelpTextListener, OutlookUIAEventPrefix)
|| !oHelpTextListener.AddPropertyChangedEventHandler(UIA_HelpTextPropertyId, Element, TREESCOPE_Descendants)
	oHelpTextListener = Null()
endIf
EndFunction

void function ClearAnyCalendarTreeviewStateChangeTimer()
if CalendarTreeviewStateChange_ScheduleID
	UnscheduleFunction(CalendarTreeviewStateChange_ScheduleID)
	CalendarTreeviewStateChange_ScheduleID = 0
endIf
EndFunction

void function SetCalendarTreeviewStateChangeTimer()
ClearAnyCalendarTreeviewStateChangeTimer()
CalendarTreeviewStateChange_ScheduleID = ScheduleFunction("DetectCalendarTreeviewStateChange",CalendarTreeviewStateChange_WaitTime)
EndFunction

void function DetectCalendarTreeviewStateChange()
CalendarTreeviewStateChange_ScheduleID = 0
IndicateControlState(wt_treeview, GetTreeViewItemCheckStateFromUIA (GetFocusedTreeItemFromUIA()))
BrailleRefresh()
EndFunction

object function GetSelectedListItem(object list)
if !list return Null() endIf
var object condition = oFSUIA_Outlook.createBoolPropertyCondition(UIA_SelectionItemIsSelectedPropertyId, UIATrue)
if !condition return Null() endIf
return list.FindFirst(TreeScope_Subtree, condition)
endFunction

int function IsAutoCompleteListVisible()
return CollectionItemCount(c_OutlookAutoComplete) > 0
	&& !UserBufferIsActive()
	&& IsPCCursor()
EndFunction

string function AutoCompleteListHelpText()
return c_OutlookAutoComplete.ListHelp
EndFunction

string function AutoCompleteListItemText()
;Do not call BuildUpdatedCache on the element,
;since this causes the name to be empty if it has not changed since last time.
return c_OutlookAutoComplete.element.name
EndFunction

string function AutoCompleteListItemPosition()
return FormatString(cmsgPosInGroup1, 
	c_OutlookAutoComplete.element.positionInSet, 
	c_OutlookAutoComplete.element.sizeOfSet)
EndFunction

void function InitAutoCompleteListData(object list)
if !list return endIf
c_OutlookAutoComplete.ListElement = list
if list.AutomationID == id_idAutoCompleteList
	c_OutlookAutoComplete.ListType = AutoComplete_RecentContacts
elif list.AutomationID == id_idPickerAutoCompleteList 
	c_OutlookAutoComplete.ListType = AutoComplete_AllContacts
endIf
c_OutlookAutoComplete.ListHelp = list.name
EndFunction

int function UpdateAutoCompleteListData(object element)
;Do not remove all from this collection,
;function InitAutoCompleteListData adds necessary data when the list first appears.
if element.name == c_OutlookAutoComplete.element.name
	return false
endIf
c_OutlookAutoComplete.element = element
return true
EndFunction

void function StartListeningForSelectionChange(object element)
if !element return endIf
oAutoCompleteListener = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oAutoCompleteListener
|| !ComAttachEvents(oAutoCompleteListener, OutlookUIAEventPrefix)
|| !oAutoCompleteListener.AddAutomationEventHandler(UIA_SelectionItem_ElementSelectedEventId, element, TREESCOPE_SUBTREE)
	oAutoCompleteListener = Null()
endIf
endFunction

void function OutlookUIAAutomationEvent (object element, int eventID)
if eventID == UIA_SelectionItem_ElementSelectedEventId
	if element.className == wc_ContactCard
		c_OutlookContact.Element = element
		SayLine()
		return
	elif element.className == wc_NetUIListViewItem
	&& !IsSecondaryFocusActive()
		;This is either an address auto complete suggestion or an atMention list item.
		;Address auto complete list items have automationID of id_idListViewItem,
		;however the atMention list item has no automationID.
		;Currently, they are treated the same:
		if UpdateAutoCompleteListData(element)
			Say(AutoCompleteListItemText(),ot_line)
		endIf
		return
	endIf
endIf
EndFunction

void function OutlookUIAPropertyChangedEvent(object element, int propertyID, variant newValue)
if PropertyID == UIA_ControllerForPropertyId
	if element.controllerFor.count > 0
		StartListeningForAutoComplete(element.controllerFor(0))
	else ;No controllerFor, so no list:
		if oAutoCompleteListener
			if c_OutlookAutoComplete.ListType == AutoComplete_RecentContacts
				PlayAutoCompleteSound(findJAWSSoundFile(c_OutlookSounds.AutoCompleteListExit))
			endIf
			oAutoCompleteListener = Null()
			CollectionRemoveAll(c_OutlookAutoComplete)
			BrailleRefresh()
		endIf
	endIf
elif PropertyID == UIA_ToggleToggleStatePropertyId
	;ObjStateChangedEvent does not detect the toggle in the navigation pane tree,
	;so we get no announcement and no braille update unless we manage it here.
	;If a tree branch state is toggled,
	;several of these events may fire,
	;one for each item in the branch as well as the branch itself.
	;Try to detect when toggling is done by scheduling the announcement and braille refresh.
	SetCalendarTreeviewStateChangeTimer()
elif PropertyID == UIA_HelpTextPropertyId
	var object oFocus = FSUIAGetFocusedElement ()
	if FSUIACompareElements (element, oFocus)
	&& !StringContains (StringLower (oFocus.name), StringLower (newValue))
	&& !StringContains (StringLower (newValue), StringLower (oFocus.name))
		Say (newValue, OT_HELP)
	endIf
endIf
EndFunction

void function StartListeningForAutoComplete(object list)
;id_idAutoCompleteList is the automationID for recent contacts such as appear in the To and CC fields,
;and id_idPickerAutoCompleteList is the automationID for picker from all contacts such as appear when doing an atMention.
if oAutoCompleteListener return endIf
InitAutoCompleteListData(list)
if list.AutomationID == id_idAutoCompleteList
	PlayAutoCompleteSound(findJAWSSoundFile(c_OutlookSounds.AutoCompleteListEnter))
endIf
oAutoCompleteListener = list
StartListeningForSelectionChange(oAutoCompleteListener)
;Because we don't get an event for appearance of the address autocomplete,
;We need to announce the list and selected item when the list appears.
if list.AutomationID == id_idAutoCompleteList
	var object e = GetSelectedListItem(list)
	UpdateAutoCompleteListData(e)
	Say(AutoCompleteListItemText(),ot_line)
endIf
EndFunction

void function ClearAnyFocusChangedTimer()
if FocusChanged_ScheduleID
	UnscheduleFunction(FocusChanged_ScheduleID)
	FocusChanged_ScheduleID = 0
endIf
EndFunction

void function SetFocusChangedTimerForOutlookGrid()
ClearAnyFocusChangedTimer()
FocusChanged_ScheduleID = ScheduleFunction("DetectFocusChangedForOutlookGrid",FocusChanged_WaitTime)
EndFunction

void function DetectFocusChangedForOutlookGrid()
FocusChanged_ScheduleID = 0
SayLine()
EndFunction

void function SetFocusChangedTimerForOutlookCalendar(optional int iWaitTime)
if iWaitTime < 1
	iWaitTime = FocusChanged_WaitTime
endIf
ClearAnyFocusChangedTimer()
FocusChanged_ScheduleID = ScheduleFunction("DetectFocusChangedForOutlookCalendar", iWaitTime)
EndFunction

void function DetectFocusChangedForOutlookCalendar()
FocusChanged_ScheduleID = 0
FocusChangeTriggeredByMoveToTopOrBottomOfColumn = false
SayLine()
EndFunction

void function ClearAnyDeleteEventWaitTimer()
if RefreshListAfterDelete_ScheduleID
	UnScheduleFunction(RefreshListAfterDelete_ScheduleID)
	RefreshListAfterDelete_ScheduleID = 0
endIf
EndFunction

void function SetDeleteEventWaitTimer()
ClearAnyDeleteEventWaitTimer()
RefreshListAfterDelete_ScheduleID = ScheduleFunction("RefreshListAfterDelete",DeleteEventWaitTime)
EndFunction

void function RefreshListAfterDelete()
RefreshListAfterDelete_ScheduleID = 0
;The MSAARefresh causes a focus change to fire.
;CheckForEmptyListAfterDelete indicates to ActiveItemChangedEvent that this focus change should be announced if the focus is on the table.
CheckForEmptyListAfterDelete = true
MSAARefresh()
EndFunction

int function ContextMenuProcessed(handle hWnd)
if GetObjectSubTypeCode() == WT_MENU
	;Insure that opening a context menu from a location which itself is not a menu is announced as context menu,
	;but opening a context menu from a menu, such as the Search Edit popup menu which appears when Alt+Q is pressed,  is transparent.
	var int ancestorCount = GetAncestorCount()
	var int i
	for i = 1 to ancestorCount
		if GetObjectSubtypeCode(SOURCE_CACHED_DATA,i) == wt_ContextMenu
			;make sure the context menu isn't descended from a menu:
			var int j
			for j = i+1 to ancestorCount
				if GetObjectSubtypeCode(SOURCE_CACHED_DATA,j) == wt_Menu
					return true
				endIf
			endFor
			IndicateControlType(WT_CONTEXTMENU,cscNull,cscSpace)
			if !IsZoomTextRunning()
			&& !GetObjectName()
				TypeKey (cksDownArrow); Select first item in menus
			endIf
			MenuModeHook ()
			return true
		endIf
	endFor
endIf
return ContextMenuProcessed(hWnd)
EndFunction

void function ConfigurationChangedEvent(string newConfiguration)
if newConfiguration == "JawsDialog"
	;Because the Outlook scripts are running underneath Quick Settings scripts,
	;we must discard data which is used for Outlook focus items:
	CollectionRemoveAll(c_OutlookFocus)
endIf
ConfigurationChangedEvent(newConfiguration)
if newConfiguration == "Outlook"
	;When exiting from Quick Settings back to Outlook,
	;the FocusChangedEventEx which runs all the updates may run before this event,
	;and if so the data for the focus is not updated.
	;We ensure that the updates will run by calling them here:
	RunFocusChangeUpdates(GetFocus())
endIf
EndFunction

void function KillUIAHacksForSecondaryFocusEvents()
if UsesSecondaryFocus return endIf
SecondaryFocusItemSpokenByUIA = true
UsesSecondaryFocus = true
oControllerForListener = Null()
oAutoCompleteListener = Null()
CollectionRemoveAll(c_OutlookAutoComplete)
endFunction

void Function SecondaryFocusActivatedEvent()
KillUIAHacksForSecondaryFocusEvents()
if !DialogActive ()
	PlayAutoCompleteSound(c_OutlookSounds.AutoCompleteListEnter)
endIf
EndFunction

void Function SecondaryFocusDeactivatedEvent()
if !DialogActive ()
	PlayAutoCompleteSound(c_OutlookSounds.AutoCompleteListExit)
endIf
BrailleRefresh()
EndFunction

Void Function SaySecondaryFocusSelectedItem(int includePosition)
if SecondaryFocusItemSpokenByUIA
	;This is the first time that the secondary focus event has fired.
	;UIA has already spoken the item before we terminated the hack to support systems which do not fire the secondary focus event.
	;To prevent double speaking, just return after clearing the global.
	SecondaryFocusItemSpokenByUIA = false
	return
endIf
SaySecondaryFocusSelectedItem(includePosition)
EndFunction

String Function GetSecondaryFocusSelectionText ()
var string sSecondaryFocusSelectionText = GetSecondaryFocusSelectionText()
if !StringIsBlank (sSecondaryFocusSelectionText)
	return sSecondaryFocusSelectionText
endIf
var
	object oFocus = FSUIAGetFocusedElement (),
	object oList = oFocus.controllerFor(0)
if !oList
	return GetSecondaryFocusSelectionText ()
endIf
return GetSelectedListItem(oList).name
EndFunction

void function RunFocusChangeUpdates(handle hWndFocus)
UpdateOutlookFocus(hwndFocus)
gbWordIsWindowOwner = c_OutlookFocus.WinClassName == wc_wwg
	|| c_OutlookFocus.WinClassName == wc_wwn
UpdateMessageListItemData()
UpdateCalendarData()
UpdateContactsData()
ManageUIAListeners()
ManageUserBufferVirtualWindows()
if !gbWordIsWindowOwner 
	setQuickKeyNavigationState(0)	
endIf
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
ClearAnyScheduledTimers()
ShowOrHideBrlReadingPane()
if nChangeDepth >= 0
|| GetWindowClass(hwndFocus) != c_OutlookFocus.WinClassName
	RunFocusChangeUpdates(hwndFocus)
	else
	UpdateMessageListItemData()
endIf
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild,  nChangeDepth)
EndFunction

int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if oContactsListListener
	;A focus event does not reliably fire when navigating the contacts list,
	;so we are using a UIA automation event to detect the change when navigation occurs in the contacts list.
	;However, focus change may fire, so we must ignore it if we are using the automation event:
	return true
endIf
if !MenusActive ()
&& GetObjectSubTypeCode () == WT_CONTEXTMENU
	UIARefresh (false)
	return true
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void function FocusChangedEventEx (handle hwndFocus,int nObject,int nChild,handle hwndPrevFocus, int nPrevObject, int nPrevChild,	int nChangeDepth)
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
	return
endIf
if gbWordIsWindowOwner 
	;Do not scope the following call to Word, 
	;since we need to process outlook focus change script functions:
	return FocusChangedEventEx(hwndFocus,nObject,nChild,hwndPrevFocus, nPrevObject, nPrevChild,	nChangeDepth)
endIf
if InMessageList()
	if hwndFocus == hwndPrevFocus 
		Return ActiveItemChangedEvent (hwndFocus,nObject,nChild,HwndPrevFocus,nPrevObject,nPrevChild)
	else
		return focusChangedEvent (hwndFocus, hwndPrevFocus)
	endIf
endIf
if inCalendar()
	;Navigating in the calendar table can sometimes yield a change depth higher than -1,
	;so we test for equality of prev and current window instead of change depth:
	if hWndFocus == hWndPrevFocus
		if FocusChangeTriggeredByMoveToTopOrBottomOfColumn
			if !FocusChanged_ScheduleID
				SetFocusChangedTimerForOutlookCalendar(CalendarMonthChange_WaitTime)
			endIf
			return
		else
			if FocusChanged_ScheduleID
				ClearAnyFocusChangedTimer()	
			endIf
			return ActiveItemChangedEvent (hwndFocus,nObject,nChild,HwndPrevFocus,nPrevObject,nPrevChild)
		endIf
	else
		return focusChangedEvent (hwndFocus, hwndPrevFocus)
	endIf
endIf
If InNavigationPane()
	if nChangeDepth < 0
	|| hWndFocus == hWndPrevFocus
		return ActiveItemChangedEvent (hwndFocus,nObject,nChild,HwndPrevFocus,nPrevObject,nPrevChild)
	else
		return focusChangedEvent (hwndFocus, hwndPrevFocus)
	endIf
endIf
FocusChangedEventEx(hwndFocus,nObject,nChild,hwndPrevFocus, nPrevObject, nPrevChild,	nChangeDepth)
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
FocusChangeType = FocusChangeType_Focus
FocusChangedEvent (FocusWindow, PrevWindow)
EndFunction

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow,handle PrevWindow)
if c_OutlookFocus.WinClassName == wc_OutlookGrid
|| c_OutlookFocus.RealWindowName == wn_AdvancedFind
|| InMessageTextWindow()
	return FALSE
endIf
return FocusChangedEventShouldProcessAncestors(FocusWindow,PrevWindow)
EndFunction

int function IgnoreObjectAtLevel (int level)
var int subtype = GetObjectSubtypeCode()
if subType == wt_TabControl
&& InRibbons()
	return true
elif subType == wt_button
&& GetObjectClassName(level) == wc_NetUIFolderBarRoot 
	return true
endIf
return IgnoreObjectAtLevel (level)
EndFunction

void function ProcessSayAppWindowOnFocusChange(handle AppWindow,handle FocusWindow)
if GetWindowClass(appWindow) == UIAClass_Root 
	;Don't announce desktop when opening a date picker:
	return
endIf
if GlobalWasHjDialog
|| InHjDialog()
|| InQuickSettingsDialog()
	return default::ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
endIf
if !c_OutlookVerbosity.VirtualMessageWindowTitles
&& IsReadOnlyVirtualMessage()
	;Prevent window title from announcing when focus moves to the window with the open message.
	return
endIf
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName,
	handle FocusWindow)
if GlobalWasHjDialog
|| InHjDialog()
|| InQuickSettingsDialog()
	return default::ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
endIf
if appWindow == globalPrevApp
&& GetWindowClass(RealWindow) == wc_rctrl_renwnd32
	if IsReadOnlyVirtualMessage()
		if IsInOutlookMainWindow()
			;The reading pane was moved to by pressing F6,
			;so read the title of the message:
			SayWindowTypeAndText(FocusWindow)
		endIf
		;Otherwise, DocumentLoadedEvent will announce the new message when moving directly from one message to another:
		return
	elif RealWindowName != GlobalPrevRealName
		;Announce when switching folders while in the message list:
		Say(RealWindowName,ot_dialog_name)
		return
	endIf
endIf
ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
EndFunction

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName, handle FocusWindow)
if GlobalWasHJDialog
&& FocusChangeShouldBeSilent
	return
endIf
FocusChangeShouldBeSilent = false
if InMessageList()
	;When moving from one folder to another,
	;There may be two focus changes firing,
	;one to focus on the table object and the next to focus on the table cell object.
	;If the folder is empty, focus will not land on a table cell.
	;To avoid undesired speech when an interim focus change lands on a table object,
	;and to ensure that "0 items" is announced if the table cell object is not an interim landing,
	;schedule a call to announcing the focus and return if the object is a table cell.
	;If the focus change is immediately followed by another, the scheduled focus announcement call is canceled.
	if GetObjectSubtypeCode() == wt_table
	&& c_OutlookFocus.PrevRealWindowName != c_OutlookFocus.RealWindowName
		SetFocusChangedTimerForOutlookGrid()
		return
	endIf
elif InCalendar()
	if c_OutlookCalendar.ViewText != c_OutlookCalendar.PrevView
		Say(c_OutlookCalendar.ViewText, ot_dialog_name)
	endIf
	if GetObjectSubtypeCode() == wt_table
	&& c_OutlookFocus.PrevRealWindowName != c_OutlookFocus.RealWindowName
		SetFocusChangedTimerForOutlookCalendar()
		return
	endIf
	SayLine()
	return
endIf
ProcessSayFocusWindowOnFocusChange(RealWindowName,FocusWindow)
;When switching to Contacts, JAWS does not properly recognize the focus:
if c_OutlookFocus.ObjClassName == wc_Rctrl_RenWnd32
&& getObjectSubtypeCode () == wt_ListBoxItem
	UIARefresh()
endIf
EndFunction

int function ManualDetectAutoComplete(handle hWnd)
var object element = FSUIAGetElementFromHandle(hWnd)
var object condition = FSUIACreateStringPropertyCondition(UIA_AutomationIdPropertyId,id_idAutoCompleteList)
var object list = element.FindFirst(treeScope_Descendants,condition)
if list
	AutoCompleteDetectedByValueChange = true
	if !c_OutlookAutoComplete.ListElement
		InitAutoCompleteListData(list)
		PlayAutoCompleteSound(findJAWSSoundFile(c_OutlookSounds.AutoCompleteListEnter))
	endIf
	element = GetSelectedListItem(list)
	if UpdateAutoCompleteListData(element)
		Say(AutoCompleteListItemText(),ot_line)
		BrailleRefresh()
	endIf
	return true
endIf
return ManageManualDetectionOfAutoCompleteListClosing()
endFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,optional int bIsFocusObject)
;Some systems do not have a controllerFor property for detecting that the focus has an auto complete list,
;so we'll try to detect its appearance here if necessary.
if !bIsFocusObject
&& nObjType == wt_ListBoxItem
&& !sObjValue
&& GetWindowClass(hWnd) == wc_NetUIHWND
&& c_OutlookFocus.WinClassName == wc_RichEdit20WPT
&& getWindowClass(GetParent(hWnd)) == wc_NetUIToolWindow
&& !IsSecondaryFocusActive()
&& !UsesSecondaryFocus
	if ManualDetectAutoComplete(hWnd)
		return
	endIf
endIf
if !bIsFocusObject
&& nObjType == WT_LISTBOXITEM
&& !sObjValue
&& c_OutlookFocus.WinClassName == wc_ReComboBox20W
	Say (sObjName, OT_LINE)
	return
endIf
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if InMessageList()
	if iObjType == WT_TreeViewItem
	&& nChangedState & CTRL_OPENED
	;Collapsed/expanded state change, as well as using Control+Space or Space to deselect or select, is announced elsewhere.
	;We want to prevent extra announcement as a result of this item becoming selected when the application selects the item immediately after it is navigated to.
	return
	endIf
	;SayLine will include announcement of not selected when message list item is not selected,
	;so we need to announce only the selected state separately:
	if nState & CTRL_SELECTED
	&& iObjType != WT_TreeViewItem
	&& !(nChangedState & CTRL_CLOSED)
		Say(cmsg215_L, ot_selected_item)
	endIf
	SayLine()
	return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

int Function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
If gbWordIsWindowOwner
	return NewTextEventShouldBeSilent(hFocus, hwnd, buffer,nAttributes,nTextColor,nBackgroundColor,nEcho,sFrameName)
endIf
if GetWindowClass(hwnd) == wc_rctrl_renwnd32
	;Calendar dates being written to the screen are often the cause of this,
	;however the focus may not yet be in the calendar view window.
	;Just assume that we don't want any highlight spoken from this window:
	return true
endIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes,	nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

string Function GetDialogStaticText()
var string sDlgText = GetDialogStaticText()
If !StringIsBlank(sDlgText)
	Return sDlgText
EndIf
var
	handle hDlg,
	handle hWnd,
	STRING STMP
hWnd = GetFocus()
hDlg = GetRealWindow(hWnd)
If !FindWindow(hDlg, cwc_RichEdit20WPT)
	Return cscNull
EndIf
hWnd = GetFirstWindow(hWnd)
While (hWnd
&& (GetWindowSubtypeCode (hWnd) == WT_STATIC || GetWindowSubtypeCode (hWnd)  == WT_READONLYEDIT))
	if SdlgText
		sDlgText = sDlgText+cscSpace
	EndIf
	stmp = GetWindowText (hWnd, READ_EVERYTHING)
	if !StringIsBlank(stmp)
		sDlgText = sDlgText+stmp
	EndIf
	hWnd = GetNextWindow(hWnd)
ENDWHILE
Return sDlgText
EndFunction

int function SayTopLevelNuiDialogTypeAndText (handle window)
var object treewalker = FSUIACreateTreeWalker(ReusableRawcondition)
treewalker.currentElement = FSUIAGetElementFromHandle(window)
if !treewalker.currentElement
|| treewalker.currentElement.className != wc_NUIDialog
	return false
endIf
IndicateControltype(wt_dialog, treewalker.currentElement.name, cmsgSilent)
var int searching = true
while searching
	if treewalker.gotoFirstChild()
		if treewalker.currentElement.controlType == UIA_TextControlTypeId
		&& treewalker.currentElement.className == UIAClass_NetUILabel
			Say(treewalker.currentElement.name,ot_dialog_text)
		endIf
	else
		searching = false
	endIf
endWhile
return true
EndFunction

void function sayWindowTypeAndText (handle window)
if InHomeRowMode()
	SayWindowTypeAndText(window)
	return
endIf
var
	string class
class = GetWindowClass(window)
if class == wc_Rctrl_RenWnd32
	;Avoid spamming with irrelevant static text:
	Say(GetWindowName(window),ot_dialog_name)
	return
elif class == wc_NUIDialog
&& GetTopLevelWindow(GetFocus()) == window
&& GetObjectClassname() == objn_NetUISimpleButton
	if SayTopLevelNuiDialogTypeAndText(window)
		return
	endIf
endIf
sayWindowTypeAndText (window)
; extra dialog text coming from dialogs where there is no static text, but it's returned from a richedit:
If dialogActive()
&& getWindowSubtypeCode(window) == WT_DIALOG
&& FindWindow(window , cwc_RichEdit20WPT)
	Say (GetDialogStaticText (), OT_DIALOG_TEXT)
EndIf
endFunction

Script SayWindowPromptAndText()
if handleNoCurrentWindow()
	return
endIf
var	int nMode
If gbWordIsWindowOwner
	If IsAutoCompleteListVisible()
		nMode=smmTrainingModeActive()
		;Add a space to prevent the type text from running against the last word of the second param:
		indicateControlType (WT_MENU, AutoCompleteListHelpText()+cscSpace, AutoCompleteListItemText())
		smmToggleTrainingMode(nMode)
		return
	endIf
	PerformScript SayWindowPromptAndText()
	Return
EndIf
PerformScript SayWindowPromptAndText()
EndScript

void function IndicateGroupChangeInGridLists()
if !getNonJCFOption ("AnnounceGroupChangeInLists") then return endIf
if getObjectSubtypeCode () == WT_GROUPBOX
; we're on a group that is also a list item. Keep from double announcing from Group Change.
	return
endIf
if getObjectSubtypeCode(FALSE, 1) != WT_GROUPBOX
	gsPriorGroupName = cscNull
	return
endIf
var string groupName = getObjectName(FALSE, 1)
if stringCompare(groupName, gsPriorGroupName) != 0
	sayMessage (OT_HELP_BALLOON, groupName)
endIf
gsPriorGroupName = groupName
endFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId, handle prevHwnd, int prevObjectId, int prevChildId)
FocusChangeType = FocusChangeType_ActiveItem
If gbWordIsWindowOwner
	return ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
elIf InHJDialog()
	return ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
EndIf
if InMessageList()
	IndicateGroupChangeInGridLists()
	if giScheduleSplitRefreshID then
		unscheduleFunction(giScheduleSplitRefreshID)
	endIf
	if AppAllowedToChangeSplitMode() then
		giScheduleSplitRefreshID=ScheduleFunction("BrailleRefreshSplitModeBuffer", 3)
	endIf

	if WasMostRecentScriptTableNav()
		;Active item will change when table navigation moves by row.
		;The current cell is announce by the table nav.
		return
	endIf
	if GetObjectSubtypeCode() == wt_table
	&& !CheckForEmptyListAfterDelete
		;Prevent announcement of "0 items" when a double event fires:
		return
	endIf
	CheckForEmptyListAfterDelete = false
	if GetObjectSubtypeCode() == wt_TreeViewItem
		SayTreeViewLevel (true)
		return
endIf
	SayLine()
	return
elif inCalendar()
	;We may get a double firing of focus change,
	;where one lands on the table cell and the other on the table.
	;This tends to happen when switching calendar views.
	;Do not announce the one for the table:
	if GetObjectSubtypeCode() == wt_table
	&& GlobalPrevFocus == GlobalFocusWindow
		return
	endIf
	if c_OutlookCalendar.ViewText != c_OutlookCalendar.PrevView
		Say(c_OutlookCalendar.ViewText, ot_dialog_name)
	endIf
	SayLine()
	return
endIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
if getObjectName(0, 5) == "NUIDocumentWindow"
&& GetControlAttributes () & CTRL_SELECTED
	IndicateControlState (WT_LISTBOXITEM, CTRL_SELECTED)
endIf
EndFunction

void Function DocumentLoadedEvent()
setQuickKeyNavigationState(IsVirtualPcCursor () && (getRunningFSProducts() != PRODUCT_MAGic))
if !IsReadOnlyMessage()
	return
endIf
ResetEmailInformation()
if ShouldMessageHeaderSpeak()
	;True means do not set focus to header field:
		ReadHeader(1, true) ; from field
		ReadHeader(5, true) ; Subject field
else
	var string lastScript = getScriptAssignedTo (GetCurrentScriptKeyName ())
	lastScript = stringLower (lastScript)
	if lastScript == "moveforwarditem"
	|| lastScript == "movebackitem"
		SayMessage (OT_SCREEN_MESSAGE, c_OutlookFocus.RealWindowName)
	endIf
endIf
if ShouldMessageLinkCountSpeak()
	var	int iLinkCount =GetLinkCount()
	if iLinkCount>0
		if shouldItemSpeak (OT_HELP) == MESSAGE_LONG
			SayUsingVoice(vctx_message,FormatString(msgMessageLinkCount,IntToString(iLinkCount)),ot_help)
		else
			SayUsingVoice(vctx_message,FormatString(msgMessageLinkCount_S,IntToString(iLinkCount)),ot_help)
		endIf
	EndIf
EndIf
if ShouldMessageSayAll()
	performScript SayAll()
EndIf
EndFunction

string function PositionInGroup (optional Handle hWnd)
if InContactsList()
	;Cannot retrieve accurate information:
	return cscNull
endIf
if InMessageList()
	return c_MessageListItem.PositionInGroup
endIf
Return PositionInGroup (hWnd)
EndFunction

Void Function SpeakTableHeaderOnCellChangeHelper(int type, int isActiveItemChanged)
;Do not announce the header when focus moves to the message list:
if InMessageList()
	return
endIf
SpeakTableHeaderOnCellChangeHelper(type, isActiveItemChanged)
EndFunction

int function WasSayObjectTypeAndTextExceptionProcessed(optional int nLevel, int includeContainerName)
;Virtualized controls are spoken as they become virtualized:
if UserBufferWindowName ()
	return true
endIf
return WasSayObjectTypeAndTextExceptionProcessed(nLevel, includeContainerName)
EndFunction

Void Function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var int subtype = GetObjectSubtypeCode(0,nLevel)
if nLevel > 0
	if InMessageList()
		if subtype == wt_table
		|| subtype == wt_groupBox
			return
		endIf
	endIf
	if getObjectName(0, nLevel) == "NUIDocumentWindow" then return endIf
	var string objectClassName = getObjectClassName (nLevel)
	if (objectClassName == "NetUINativeHWNDHost" || objectClassName == "NetUIHWNDElement ")
	&& getObjectRole() == ROLE_SYSTEM_PANE
		return
	endIf
elif nLevel == 0
	if InMessageList()
		IndicateControlType(wt_ListBox, cscNull, cscNull)
		SayLine()
		say (positionInGroup (), OT_POSITION)
		return
	elif inCalendar()
	|| InContactsList()
		SayLine()
		return
	elif c_OutlookFocus.WinClassName == wc_wwg
	&& subtype == wt_static
		;SayObjectTypeAndText announces nothing here,
		;but we want to announce that focus is on an edit field:
		if ! c_OutlookVerbosity.MessageSayAll then
		; when message automatic reading is not turned on:
			indicateControlType(wt_readOnlyEdit)
		endIf
		return
	elif InMessageHeaderReadOnlyMultilineEdit()
		SayMessageHeaderReadOnlyMultilineEdit()
		return
	elif inCalendarTreeView()
		if SayCalendarTreeviewItemObjectTypeAndText()
			return
		endIf
	elif c_OutlookFocus.ObjClassName == wc_NetUIOcxControl
		IndicateControlType(wt_button, GetRoomFinderCalendarButtonName(), cmsgSilent)
		return
	elif OnNetUIGalleryButton()
		var string text = GetObjectHelp()
		if text
			;SayObjectTypeAndText gets the type and state, but no text:
			var string color = ConvertNetUIGalleryButtonTextToColorName(Text)
			if color
				text = color
			endIf
			Say(text,ot_line)
			SayObjectTypeAndText(nLevel,includeContainerName)
			return
		endIf
	elIf subtype == wt_ComboBox
	&& c_OutlookFocus.WinClassName == wc_REComboBox20W
		IndicateControlType (wt_EditCombo, GetObjectName (), cmsgSilent)
		Say(GetObjectValue(SOURCE_CACHED_DATA),ot_line)
		return
	elif GetControlID (GetFocus ()) == id_app_AllAttendeesStatus
		Say(GetObjectName (), OT_LINE)
		return
	elIf ReadMisCategorizedField()
		return
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
if nLevel == 0
&& getObjectName(false, 5) == "NUIDocumentWindow"
&& GetControlAttributes () & CTRL_SELECTED
	IndicateControlState (WT_LISTBOXITEM, CTRL_SELECTED)
endIf
EndFunction

int function ReadMisCategorizedField()
;JAWS mis-categorizes some fields as documents.
if GetObjectRole(0) != ROLE_SYSTEM_DOCUMENT
|| c_OutlookFocus.WinClassName != wc_RichEdit20WPT
|| !(GetObjectMSAAState ()&STATE_SYSTEM_READONLY)
	return false
endIf
var
	string sValue = FSUIAGetFocusedElementValueText (),
	string sName
if !sValue
|| !StringSegmentCount (sValue, cscColon+cscSpace)
	return false
endIf
sName = StringSegment (sValue, cscColon+cscSpace, 1) + cscColon
sValue = stringChopLeft (sValue, StringLength(sName+cscSpace))
IndicateControlType (WT_READONLYEDIT, sName, sValue)
return true
endFunction

handle function FindOutlookInfoBarFromWithinMessage()
var	handle hWnd = GetFocus()
while getParent (hWnd) && getWindowClass (hWnd) != cWc_dlg32770
	hWnd = getParent (hWnd)
endWhile
if getWindowClass (hWnd) != cWc_dlg32770
	return Null()
endIf
hWnd = FindDescendantWindow (hWnd, id_InfoBar)
if !hWnd
|| !IsWindowVisible(hWnd)
|| IsWindowDisabled(hWnd)
	return Null()
endIf
return hWnd
EndFunction

string function GetTextFromInfoBar(optional handle hInfoBar)
if !hInfoBar
	;See if the handle is cached from the InfoBarShowEvent:
	hInfoBar = c_OutlookInfoBar.hWnd
endIf
if !hInfoBar
	;This is probably a request to announce the info bar from within a message:
	hInfoBar = FindOutlookInfoBarFromWithinMessage()
endIf
if !hInfoBar return cscNull endIf
var object element = FSUIAGetElementFromHandle(hInfoBar)
if !element return cscNull endIf
return element.GetValuePattern().value
EndFunction

void Function InfoBarShowEvent (handle hWnd)
if !c_OutlookVerbosity.InfoBar return endIf
c_OutlookInfoBar.hWnd = hWnd
c_OutlookInfoBar.Text = GetTextFromInfoBar(hWnd)
if !c_OutlookInfoBar.Text return endIf
if !InMessageList()
	Say(c_OutlookInfoBar.Text,ot_screen_message)
	BrailleMessage(c_OutlookInfoBar.Text)
	if !GetRealWindow (GetFocus ())
		var
			object oRealWindow,
			object oBody,
			object oCondition
		oRealWindow = FSUIAGetElementFromHandle (GetRealWindow (hwnd))
		oCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, id_body)
		oBody = oRealWindow.findFirst(TreeScope_Descendants, oCondition)
		oBody.SetFocus()
	endIf
endIf
EndFunction

void Function InfoBarHideEvent (handle hWnd)
CollectionRemoveAll(c_OutlookInfoBar)
EndFunction

void Function WindowActivatedEvent(handle hWnd)
if c_OutlookVerbosity.InfoBar
	var String sWindowName = GetWindowName(hWnd)
	If StringContains (sWindowName, scAppointment)
		var handle hInfoBar = FindWindowWithClassAndId (hWnd, wc_Rctrl_RenWnd32, id_InfoBar)
		If hInfoBar
		&& IsWindowVisible(hInfoBar)
			InfoBarShowEvent (hInfoBar)
		endIf
	EndIf
EndIf
WindowActivatedEvent(hWnd)
EndFunction

void Function WindowDestroyedEvent(handle hWindow)
If hWindow == c_OutlookInfoBar.hWnd
	CollectionRemoveAll(c_OutlookInfoBar)
	return
endIf
WindowDestroyedEvent(hWindow)
EndFunction

Script AnnounceOutlookInfoBar ()
var string text
if c_OutlookInfoBar.Text
	text = c_OutlookInfoBar.Text
else
	text = GetTextFromInfoBar()
endIf
if text
	SayUsingVoice(VCTX_MESSAGE,text,OT_USER_REQUESTED_INFORMATION)
Else
	SayUsingVoice(VCTX_MESSAGE,MsgInfoBarEmpty,OT_USER_REQUESTED_INFORMATION)
EndIf
EndScript

int Function IsMessageSelected()
If inCalendar()
	Return TRUE
EndIf
If c_OutlookFocus.IsMessagesList
	return GetObjectMSAAState() & STATE_SYSTEM_SELECTED
EndIf
Return FALSE
EndFunction

int function AdvancedFindDialogIsOnScreen()
;Assumes this function is called only from the UpdateMessageListItemData function.
if !StringContains(c_OutlookFocus.RealWindowName,wn_AdvancedFind) return false endIf
var handle hWnd = GetFocus()
While hWnd
	if GetWindowClass(hWnd) == cWc_dlg32770
		return true
	endIf
	hWnd = GetPriorWindow(hWnd)
endWhile
return false
EndFunction

int function ShouldSkipMessageListItemFieldForLineText(string itemType, string field)
if StringIsBlank(field)
	return true
elif itemType == scReminderFlag
&& StringContains (StringLower (field), StringLower (SC_NoReminder))
	return true
elif itemType == scCategories
	return field == scNoCategories
elif itemType == scFlagStatus
	return field == sc_Unflagged
elif itemType == scCompletedFlag
	;Only report if complete is yes"
	return field == scCompleteNo
elif itemType == scDueDate
|| itemType == scStartDate
	;Report due date or start date only if one exists:
	return field == SC_NoDate
elif field == scNormal
|| field == on_NoAttachments
|| field == sc_NoAttachmentsColumnText
|| field == On_Unknown
|| field == On_Unknown2  ;Specifically testing for French variation in spelling.
|| field == scNoData
	return true
endIf
return false
EndFunction

string Function ConvertValueToBrlLineText(string value)
if StringIsBlank(value) return cscNull endIf
var	string brl = value
var string s
ForEach s in c_BrlFieldStrings
	brl = StringReplaceSubstrings(brl, s, c_BrlFieldStrings[s])
endForEach
return brl
endFunction

string Function ConvertFlagStatusToBrlLineText(string flagStatus)
if StringIsBlank(flagStatus) return cscNull endIf
var	string brl = flagStatus
brl = StringReplaceSubstrings (brl, sc_FlagFollowUp, msgBrlFlagFollowUp)
brl = StringReplaceSubstrings (brl, sc_FlagOrange, msgBrlFlagOrange)
brl = StringReplaceSubstrings (brl, sc_FlagRed, msgBrlFlagRed)
brl = StringReplaceSubstrings (brl, sc_FlagBlue, msgBrlFlagBlue)
brl = StringReplaceSubstrings (brl, sc_FlagGreen, msgBrlFlagGreen)
brl = StringReplaceSubstrings (brl, sc_FlagYellow, msgBrlFlagYellow)
brl = StringReplaceSubstrings (brl, sc_FlagPurple, msgBrlFlagPurple)
brl = StringReplaceSubstrings (brl, sc_FlagCompleted, msgBrlFlagCompleted)
brl = StringReplaceSubstrings (brl, sc_HasReminder, MsgBrlFlagHasReminder)
return brl
EndFunction

int function GetMessageCellHeaderAndText(string byRef header, string byRef text)
if !CollectionItemExists(c_MessageListItem,"Cells") return false endIf
var variantArray a = c_MessageListItem.Cells
header = a[c_MessageListItem.ColumnIndex].TableColumnHeader
text = a[c_MessageListItem.ColumnIndex].Name
return true
endFunction

void function BuildMessageItemSpeechAndBrlTextFromMSAA()
var
	string text,
	string name = getObjectName(SOURCE_CACHED_DATA),
	string value = getObjectValue(SOURCE_CACHED_DATA)
if stringContains(value, scUnreadFlag)
	text = value+cscBufferNewLine+name
else
	text = name+cscBufferNewLine+value
endIf
c_MessageListItem.SayLineText = text
c_MessageListItem.BrlLineText = text
endFunction

string function GetWantedValueTextForMessageItem()
var string value = GetObjectValue(SOURCE_CACHED_DATA)
;Note that in some locales, "unread" is two words.
;So we cannot process the value as a string of separate words.
value =StringReplaceSubstrings (value, scMessageItem, cscNull)
value = StringReplaceSubstrings (value, scTaskItem, cscNull)
;Ensure that we remove "read" without mangling "unread":
if !StringContains(value, scUnreadFlag)
	value = StringReplaceSubstrings (value, scReadFlag, cscNull)
endIf
;Now strip out any information the user has configured to be ignored:
if !c_OutlookVerbosity.IndicateUnread
	value = StringReplaceSubstrings (value, scUnreadFlag, cscNull)
endIf
if !c_OutlookVerbosity.IndicateReplied
	value = StringReplaceSubstrings (value, scRepliedFlag, cscNull)
endIf
if !c_OutlookVerbosity.IndicateForwarded
	value = StringReplaceSubstrings (value, scForwardFlag, cscNull)
endIf
value = StringReplaceSubstrings (value, scContactItem, cscNull)
value = StringReplaceSubstrings (value, scAppointmentsItem, cscNull)
value = StringReplaceSubstrings (value, scRSSItem, cscNull)
value = StringTrimTrailingBlanks(StringTrimLeadingBlanks (value))
return value
EndFunction

void function BuildMessageItemCustomSpeechAndBrlText(variantArray a)
;Some text we get from the object value, and some from the table columns.
;We have a tradition of modifying the text for the SayLine and braille,
;and this modification includes announcing any importance and status flags before announcing other columns.
;We will gather the pieces of data and splice them together when done.
var	string SayValue, string BrlValue
SayValue = GetWantedValueTextForMessageItem()
if !StringIsBlank(SayValue)
	;The space after brlValue separates it from the text which follows it,
	;and the newline after the SayValue adds a slight pause to the spoken text before the rest of the text is spoken.
	BrlValue = ConvertValueToBrlLineText(SayValue) + cscSpace
	SayValue = SayValue + "\n"
endIf
;Now get data from the message item columns,
var
	string SayPriorityFields, string BrlPriorityFields,
	string sayFields, string BrlFields,
	string s, int i, int count
count = ArrayLength(a)
for i = 1 to count
	if !ShouldSkipMessageListItemFieldForLineText(a[i].itemType, a[i].Name)
		;Customize some column field for the line:
		if a[i].itemType == scAttachment
		|| a[i].itemType == scO365AttachmentItemType
		|| a[i].itemType == sc_AttachmentsColumnItemType
			s = a[i].TableColumnHeader
			SayFields = SayFields + s + "\n"
			BrlFields = BrlFields + MsgBrlFlagAttachment + cscSpace
		elif a[i].itemType == scImportanceFlag
			s = FormatString("%1 %2", a[i].TableColumnHeader, a[i].Name)
			SayPriorityFields = SayPriorityFields + s + "\n"
			if a[i].Name== scHighFlag
				BrlPriorityFields = BrlPriorityFields + msgBrlImpHigh + cscSpace
			elif a[i].Name == scLowFlag
				BrlPriorityFields = BrlPriorityFields + msgBrlImpLow + cscSpace
			endIf
		elif a[i].itemType == scFlagStatus
			s = a[i].Name
			SayPriorityFields = SayPriorityFields + s + "\n"
			BrlPriorityFields = BrlPriorityFields + ConvertFlagStatusToBrlLineText(s) + cscSpace
		elif a[i].itemType == scCompletedFlag
			s = a[i].TableColumnHeader
			SayPriorityFields = SayPriorityFields + s + "\n"
			BrlPriorityFields = BrlPriorityFields + s + cscSpace
		elif a[i].itemType == scReminderFlag
			s = a[i].Name
			SayFields = SayFields + s + "\n"
			BrlFields= BrlFields + ConvertFlagStatusToBrlLineText(s) + cscSpace
		else
			s = a[i].Name
			SayFields = SayFields + s + "\n"
			BrlFields = BrlFields + s + cscSpace
		endIf
	endIf
endFor
;Simply concatenating the strings with plus can cause a 0 to be substituted if the string is empty, so use FormatString to glue the pieces together:
c_MessageListItem.SayLineText = FormatString("%1%2%3", SayValue, SayPriorityFields, SayFields)
c_MessageListItem.BrlLineText = FormatString("%1%2%3", BrlValue, BrlPriorityFields, StringTrimTrailingBlanks(BrlFields))
EndFunction

collection function FindDataCellsOfElement(object messageItemElement)
var 
object oTree=messageItemElement,
object oChild=messageItemElement.FirstChild
if !oChild return null() endIf
var collection messageItemCells
messageItemcells = new collection
var int i = 1
var int ok = true
while ok
	if oChild.UIAControlType != UIA_TreeItemControlTypeId
		messageItemcells[IntToString(i)] = oChild 
		i = i+1
	else
		ok = false
	endIf
	oTree=oChild
	oChild=oTree.nextSibling
	if !oChild ok = false endIf
endWhile
return messageItemcells
EndFunction

void function GetArrayFromChildElementsCollectionArray(collection cells, int count, variantArray byRef a)
;Regardless of whether or not customization is used,
;cached data is used for table navigation:
var
	object cell,
	object headers,
	collection c,
	int i = 1,  ;index for 1-based array
	string x
for i = 1 to count
	x = IntToString(i)
	c = new collection
	if (cells[x].TableColumnHeader)
		c.TableColumnHeader = cells[x].TableColumnHeader
	endIf	
	c.Name = cells[x].name
	c.itemType = cells[x].itemType
	a[i] = c
endFor
EndFunction

variantArray function FindChildrenOfElement(object messageItemElement)
var 
int childCount=messageItemElement.ChildCount,
variantArray oChildren,
int index=1,
object oChild

if childCount==0 then
	return Null()
endIf

oChildren=new variantArray[childCount]
forEach oChild in messageItemElement
	oChildren[index] = oChild
	index=index+1
endForEach

return oChildren
EndFunction

int function UpdateMessageListItemData()
if IsKeyWaiting()
return
EndIf
var	int savedColumnIndex = c_MessageListItem.ColumnIndex
CollectionRemoveAll(c_MessageListItem)
if !InMessageList() return false endIf
if c_OutlookFocus.ObjClassName == wc_SuperGrid
	;The message list is empty:
	c_MessageListItem.SayLineText = wn_ZeroItems
	c_MessageListItem.BrlLineText = wn_ZeroItems
	return true
elif c_OutlookFocus.ObjClassName == wc_GroupHeader
	;We only need to get the group text:
	var string group = GetObjectName()
	c_MessageListItem.SayLineText = group
	c_MessageListItem.BrlLineText = group
	return true
endIf
;We are on a message item in the list:
CreateAccessibleObjectToolsForInboxIfNeeded()
var 
object oTree = oAccessibleObjectToolsOutlook.BuildFocusSubtreeUsingUIA(getFocus()),
object oFocus = oTree.firstChild, ; the root of the UIA tree is the first child of the root returned from the above function.
int count,
	variantArray childElementsObjectArray,
	collection childElementsCollectionArray

if oFocus .controlType == UIA_TreeItemControlTypeId
	childElementsCollectionArray = FindDataCellsOfElement(oFocus)
	count = CollectionItemCount(childElementsCollectionArray)
else
	childElementsObjectArray = FindChildrenOfElement(oFocus)
	count = arrayLength(childElementsObjectArray)
endIf
if count == 0 return endIf
;We keep track of column index when navigating by table:
c_MessageListItem.ColumnCount = count
if savedColumnIndex == 0
	c_MessageListItem.ColumnIndex = 1
elif savedColumnIndex > count
	c_MessageListItem.ColumnIndex = count
else
	c_MessageListItem.ColumnIndex = savedColumnIndex
endIf

var
int groupLevel,
int groupCount,
int groupIndex
oFocus.GetGroupPosition(intRef(groupLevel), intRef(groupCount), intRef(groupIndex))
c_MessageListItem.PositionInGroup = FormatString(cmsgPosInGroup1, groupIndex, groupCount)
if childElementsObjectArray
	c_MessageListItem.Cells = childElementsObjectArray
else
	var variantArray a
	a = new variantArray[count]
	GetArrayFromChildElementsCollectionArray(childElementsCollectionArray,count,a)
	c_MessageListItem.Cells = a
endIf

if c_OutlookVerbosity.UseJAWSCustomization
	BuildMessageItemCustomSpeechAndBrlText(c_MessageListItem.Cells)
else
	BuildMessageItemSpeechAndBrlTextFromMSAA()
endIf
return true
EndFunction

string function GetMessageListItemBrlLineText()
return c_MessageListItem.BrlLineText
EndFunction

string function GetMessageListItemSayLineText()
return c_MessageListItem.SayLineText
EndFunction

string function GetCalendarView()
if !inCalendar() return cscNull endIf
var
	string view,
	int type
type = GetObjectSubtypeCode()
if type == wt_TableCell
	view = getObjectDescription()
	if view
	&& StringStartsWith(view,scCalendar )
		view = StringTrimLeadingBlanks (stringReplaceSubstrings (view, scCalendar, cscNull))
	endIf
elif type == wt_Table
	view = StringSegment(GetObjectName(SOURCE_CACHED_DATA), ",", 1)
	if !view
		view = scScheduleView
	endIf
endIf
return view
EndFunction

string function CleanUpCalendarItemRawData(string rawData)
if !rawData return cscNull endIf
;The object data from a calendar meeting or appointment is not in a desirable format,
;so try to clean it up into something more presentable.
var string text = rawData
;Strip excess comma-separated values from text.
;The following replace strings call must run twice identically to pick them all up:
text = stringReplaceSubStrings (text, cscSpace+scComma+cscSpace, cscSpace) 
text = stringReplaceSubStrings (text, cscSpace+scComma+cscSpace, cscSpace) 
;And now get rid of double commas:
text = stringReplaceSubStrings (text, scComma+scComma, scComma) 
;Remove the first segment if it is the calendar view name:
var string currentView = c_OutlookCalendar.ViewText
if currentView
&& stringStartsWith(text, currentView+scComma+cscSpace)
	text = stringChopLeft(text, stringLength (currentView)+2)
endIf
;Sometimes when navigating time slots, due to no date field present,
;there's a leading comma flush with the text which must be removed:
if stringStartsWith (text, scComma)
	text = StringChopLeft (text, 1)
endIf
;trim off blanks at either end, for braille:
text = StringTrimLeadingBlanks (StringTrimTrailingBlanks (text))
return text
EndFunction

int function UpdateCalendarData()
var string savedView = c_OutlookCalendar.ViewText
CollectionRemoveAll(c_OutlookCalendar)
if !inCalendar() return false endIf
var string currentView = GetCalendarView()
c_OutlookCalendar.PrevView = savedView
c_OutlookCalendar.ViewText = currentView
c_OutlookCalendar.ViewBrlText = ConvertViewToBrlText(currentView)
var string rawData = GetObjectName()
c_OutlookCalendar.Text = CleanUpCalendarItemRawData(rawData)
return true
EndFunction

string function ConvertViewToBrlText(string viewText)
if stringStartsWith(viewText, scDayView)
	return MsgBrlDayView
elIf stringStartsWith(viewText, scWeekView)
	return MsgBrlWeekView
elIf stringStartsWith(viewText, scWorkWeekView)
	return MsgBrlWorkWeekView
elIf stringStartsWith(viewText, scMonthView)
	return MsgBrlMonthView
Else
	return cscNull
EndIf
EndFunction

string function GetCalendarViewBrlText()
return c_OutlookCalendar.ViewBrlText
EndFunction

string function GetCalendarTimeSlotText()
return c_OutlookCalendar.Text
EndFunction

string function GetContactsListItemText()
return c_OutlookContact.Text
EndFunction

int function UpdateContactsData()
;The element member was provided by event,
;so save it and use it to populate the collection with the new data:
var	object element = c_OutlookContact.Element
CollectionRemoveAll(c_OutlookContact)
if !InContactsList() return false endIf
c_OutlookContact.Element = element
var string data = element.name
if StringRight(data,2) == ", "
	data = StringChopRight(data,2)
endIf
var object condition = oFSUIA_Outlook.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_TextControlTypeId)
var object oData = element.FindAll(TreeScope_Children,condition)
var int count = oData.count
if count > 1
	;The first child contains the name of the contact,
	;which is information that already exists in the parent.
	;Other children may have additional data, so add them:
	var string s, int i
	for i = 1 to count-1
		s = oData(i).name
		if s
			data = FormatString("%1, %2", data, s)
		endIf
	endFor
endIf
c_OutlookContact.Text = data
return true
EndFunction

void function SayPageUpDownUnit(int UnitMovement)
if c_OutlookFocus.WinClassName == wc_RichEdit20W
	Say (GetObjectValue(SOURCE_CACHED_DATA), OT_LINE)
	return
endIf
SayPageUpDownUnit(UnitMovement)
EndFunction

void function SayLineUnit(int UnitMovement, optional int bMoved)
if IsSecondaryFocusVisible()
|| IsAutoCompleteListVisible()
	;The UIA AutomationEvent announces the list item as selection changes:
	return
endIf
if c_OutlookFocus.WinClassName == wc_RichEdit20W
	if !IsKeyWaiting ()
		Pause()
	endIf
	Say (GetObjectValue(SOURCE_CACHED_DATA), OT_LINE)
	return
endIf
SayLineUnit(UnitMovement, bMoved)
EndFunction

void function SayLine(optional int HighlightTracking, int bSayingLineAfterMovement)
If  InMessageList()
	var string SayLineText = GetMessageListItemSayLineText()
	if !SayLineText
		;Sometimes, focus moves to the list before it is populated.
		;UpdateMessageListItemData will not be empty for a list with no items,
		;but it will be empty if we detect that the list expects something but has not yet been populated.
		;We say nothing, and wait for the next event with the populated list.
		return
	endIf
	if SayLineText != wn_ZeroItems
		&& !(GetObjectMSAAState() & STATE_SYSTEM_SELECTED)
		Say(cMsgDeselected,ot_selected_item)
	endIf
	Say(SayLineText, ot_line)
	Return
elif InCalendar()
	if UpdateCalendarData()
		Say(c_OutlookCalendar.Text, ot_line)
	else
		Say(GetObjectName(),ot_line)
	endIf
	return
elif inCalendarTreeView()
	if SayCalendarTreeviewItemObjectTypeAndText()
		return
	endIf
elif InContactsList()
	if UpdateContactsData()
		Say(GetContactsListItemText(),ot_line)
	else
		Say(GetObjectName(),ot_line)
	endIf
	return
elif IsSecondaryFocusVisible()
	;This is for SayLine, not for announcing a line when navigating:
	SayLine() ;speaks the field prompt and entered text
	Delay(5)
	var	string secondaryFocusText = GetSecondaryFocusSelectionText()
	if secondaryFocusText
		var string positionInGroup = PositionInGroupForSecondaryFocus()
		Say(FormatString("%1\n%2", secondaryFocusText, positionInGroup),ot_screen_message)
	endIf
	return
elif IsAutoCompleteListVisible()
	;This is for SayLine, not for announcing a line when navigating:
	SayLine() ;speaks the field prompt and entered text
	Delay(5)
	Say(FormatString("%1\n%2", AutoCompleteListItemText(), AutoCompleteListItemPosition()),ot_screen_message)
	return
elIf c_OutlookFocus.WinClassName == wc_REComboBox20W
	IndicateControlType (wt_EditCombo, GetObjectName (), cmsgSilent)
	Say(GetObjectValue(SOURCE_CACHED_DATA),ot_line)
	return
endIf
SayLine(HighlightTracking, bSayingLineAfterMovement)
EndFunction

handle Function GetHeaderWindow()
var	handle hWnd = GetFirstChild (GetAppMainWindow (GetFocus ()))
while (hWnd && GetWindowClass (hWnd) != wc_AfxWnd)
	hWnd = GetNextWindow (hWnd)
endwhile
if !hWnd return null() endIf
hWnd = GetFirstChild (hWnd)
while (hWnd && GetWindowClass (hWnd) != cwc_Dlg32770)
	hWnd = GetNextWindow (hWnd)
endwhile
return hWnd
EndFunction

handle Function GetHeaderControl(int ctrlId)
var	handle hWnd = GetFirstChild (GetHeaderWindow ())
while (hWnd && GetControlId (hWnd) != ctrlId)
	hWnd = GetNextWindow (hWnd)
endwhile
return hWnd
EndFunction

handle Function GetMessageHeader(Int iField)
Var	Handle hFound
If iField == 3	; To field if present...
	hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, id_to_field2)
	If Not (hFound
	|| IsWindowVisible (hFound))
		hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, id_to_field)
	EndIf
	Return hFound
ElIf iField == 4	; CC field if present...
	hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, id_cc_field3)
	If Not (hFound
	|| IsWindowVisible (hFound))
		hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, id_cc_field)
	EndIf
	Return hFound
ElIf iField == 5	; Subject field if present...
	hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, id_subject_field2)
	If Not (hFound
	|| IsWindowVisible (hFound))
		hFound = FindWindowWithClassAndId (GetParent (GetFocus ()), cwc_RichEdit20WPT, id_subject_field)
	EndIf
	Return hFound
EndIf
Return Null()
EndFunction

void Function ControlNotFound(Int iControlID)
If iControlID == id_from_field
	SayFormattedMessage (OT_ERROR, MSG_FromFieldNotFound_L, MSG_FromFieldNotFound_S)
ElIf iControlID == id_sent_field
	SayFormattedMessage (OT_ERROR, MSG_SentFieldNotFound_L, MSG_SentFieldNotFound_S)
ElIf iControlID == id_to_field
	SayFormattedMessage (OT_ERROR, MSG_ToFieldNotFound_L, MSG_ToFieldNotFound_S)
ElIf iControlID == id_cc_field3
	SayFormattedMessage (OT_ERROR, MSG_CCFieldNotFound_L, MSG_CCFieldNotFound_S)
EndIf
EndFunction

void Function ControlNotFoundInWindow(int controlId, int typeOfWindow)
if typeOfWindow == MessageWindowType
	if controlId == id_from_field
		SayFormattedMessage (ot_ERROR,msg3_L, msg3_S) ;"From field not found"
	elif controlId == id_sent_field
		SayFormattedMessage (ot_ERROR, msg4_L, msg4_S) ;"Sent field not found"
	elif controlId == id_to_field
		SayFormattedMessage (ot_error, msg5_L, msg5_S) ;"To field not found"
	elif controlId == id_cc_field
		SayFormattedMessage (ot_error, msg6_L, msg6_S) ;"Cc field not found"
	EndIf
elif typeOfWindow == TaskWindowType
	if controlId == id_TaskSubject_field
		SayFormattedMessage (ot_ERROR, msg7_L, msg7_S) ;"Subject field not found"
	elif controlId == id_DueDate_field
		SayFormattedMessage (ot_error, msg8_L, msg8_S) ;"Due Date field not found"
	elif controlId == id_StartDate_field
		SayFormattedMessage (ot_error, msg9_L, msg9_S) ; "Start date field not found"
	elif controlId == id_status_combobox
		SayFormattedMessage (ot_error, msg10_L, msg10_S) ;"Status combobox not found"
	elif controlId == id_priority_combobox
		SayFormattedMessage (ot_error, msg11_L, msg11_S) ;"Priority combobox not found"
	elif controlId == id_PercentComplete_field
		SayFormattedMessage (ot_error, msg12_L, msg12_S) ;"% complete field not found"
	EndIf
EndIf
EndFunction

void Function ReadPrompt(int controlId, int typeOfWindow)
if typeOfWindow == MessageWindowType
	if controlId == id_from_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_from_prompt), Read_Everything))
	elif controlId == id_sent_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_sent_prompt), Read_Everything))
	elif controlId == id_to_field
		if GetHeaderControl (id_to_prompt)
			SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_to_prompt), Read_Everything))
		elif GetHeaderControl (id_to_button)
			SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_to_button), Read_Everything))
		EndIf
	elif controlId == id_cc_field
		if GetHeaderControl (id_cc_prompt)
			SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_cc_prompt), Read_Everything))
		elif GetHeaderControl (id_cc_button)
			SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_cc_button), Read_Everything))
		EndIf
	elif controlId == id_Bcc_field
		if GetHeaderControl (id_Bcc_button)
			SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_Bcc_button), Read_Everything))
		EndIf
	elif controlId == id_subject_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_subject_prompt), Read_Everything))
	EndIf
elif typeOfWindow == TaskWindowType
	if controlId == id_TaskSubject_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_TaskSubject_prompt), Read_Everything))
	ElIf controlId == id_DueDate_field03
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_DueDate_prompt), Read_Everything))
	elif controlId == id_StartDate_field
	|| controlId == id_StartDate_field03
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_StartDate_prompt), Read_Everything))
	elif controlId == id_status_combobox
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_status_prompt), Read_Everything))
	elif controlId == id_priority_combobox
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_priority_prompt), Read_Everything))
	elif controlId == id_PercentComplete_field
	|| controlId == id_PercentComplete_field03
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_PercentComplete_prompt), Read_Everything))
	EndIf
elif typeOfWindow == ContactWindowType
	if controlId == id_FullName_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_FullName_button), Read_Everything))
	elif controlId == id_JobTitle_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_JobTitle_Prompt), Read_Everything))
	elif controlId == id_company_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_company_Prompt), Read_Everything))
	elif controlId == id_FileAs_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_FileAs_Prompt), Read_Everything))
	elif controlId == id_business_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_business_Prompt), Read_Everything))
	elif controlId == id_home_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_home_Prompt), Read_Everything))
	elif controlId == id_BusinessFax_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_BusinessFax_Prompt), Read_Everything))
	elif controlId == id_mobile_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_mobile_Prompt), Read_Everything))
	elif controlId == id_address_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_address_button), Read_Everything))
	elif controlId == id_email_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_email_prompt), Read_Everything))
	elif controlId == id_web_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_web_prompt), Read_Everything))
	EndIf
elif typeOfWindow == ReportWindowType
	if controlId == id_report_from_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_from_prompt), Read_Everything))
	elif controlId == id_report_sent_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_sent_prompt), Read_Everything))
	elif controlId == id_report_to_field
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_to_prompt), Read_Everything))
	elif controlId == id_report_subject_field
		; in reports, the control id for subject is the same as cc in other types of windows
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_cc_prompt), Read_Everything))
	EndIf
elif typeOfWindow == MeetingWindowType
	if controlId == id_MeetingFromField
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_MeetingFromLabel), Read_Everything))
	elif controlId == id_MeetingSentField
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_MeetingSentLabel), Read_Everything))
	elif controlId == id_MeetingRequestedField
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_MeetingRequestedLabel), Read_Everything))
	elif controlId == id_MeetingSubjectField
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_MeetingSubjectLabel), Read_Everything))
	elif controlId == id_MeetingWhenField
		SayMessage(OT_USER_REQUESTED_INFORMATION, GetWindowText (GetHeaderControl (id_MeetingWhenLabel), Read_Everything))
	EndIf
EndIf
EndFunction

void Function FocusControl(handle hWnd)
SaveCursor ()
InvisibleCursor()
SaveCursor ()
MoveToWindow (hWnd)
pause ()
RoutePcToInvisible()
var	int subTypeCode = GetWindowSubTypeCode (hWnd)
if subTypeCode == wt_combobox
|| subTypeCode == wt_checkbox
	LeftMouseButton ()
EndIf
RestoreCursor ()
RestoreCursor ()
EndFunction

void Function ReadHeaderControl (int controlId, int typeOfWindow)
var	handle hWnd = GetHeaderControl (controlId)
if !hWnd
	ControlNotFoundInWindow(controlId, typeOfWindow)
	return
endIf
if IsSameScript ()
	FocusControl (hWnd)
	return
endIf
BeginFlashMessage()
ReadPrompt (controlId, TypeOfWindow)
if GetWindowSubTypeCode (hWnd) == wt_checkbox
	SayWindowTypeAndText (hWnd)
else
	Say(GetWindowText(hWnd, read_everything),OT_USER_REQUESTED_INFORMATION)
EndIf
SayFormattedMessage (ot_smart_help, msg13_L, msgSilent1 );" Press twice to edit "
EndFlashMessage()
EndFunction

void Function AutoSayHeader(int nID)
var	handle Hwnd = FindDescendantWindow (GetTopLevelWindow (getFocus ()), nID)
if Hwnd
	SayMessage (OT_SCREEN_MESSAGE,GetWindowText(Hwnd, read_everything))
EndIf
EndFunction

string Function GetFieldText(int iControl)
var
	string sText,
	handle hWnd
hWnd = FindDescendantWindow(GetAppMainWindow(GetFocus()),iControl)
if getWindowClass (hwnd) == cwc_Richedit20WPT
	sText = getWindowText (hWnd, READ_EVERYTHING)
else
	sText=GetWindowTextEx (hWnd, false, false)
endIf
Return  sText
EndFunction

handle function FindParentWindow(handle hWnd,string sClass)
var	handle hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != sClass
	hTemp = GetParent(hTemp)
EndWhile
return hTemp
EndFunction

int Function GetInfoForReadHeader(int iField, handle ByRef hWnd,
	handle ByRef hDlg, handle ByRef hwndSetFocus,
	string ByRef sName, string ByRef sValue,
	int ByRef iState, int ByRef iType,
	int ByRef iControl, int ByRef iInstance,
	int ByRef bUseLegacy, int ByRef bReading)
var
	int bObjNameFound,
	handle hAppWindow,
	string sClass,
	string sWinName,
	string sWinClass,
	int bSubstituteName,
	int bSubstituteValue
iInstance = 1
iControl = 0
bUseLegacy = FALSE
bReading = false
sClass = GetWindowClass(hWnd)
hAppWindow = GetAppMainWindow(hWnd)
sWinName = GetWindowName(hAppWindow)
;The dialog is the window used to search for the objects in some of the contexts...
;search for hDlg window up the hierarchy rather than down,
;since there may be other windows of this class in the application:
hDlg = FindParentWindow(GetFocus(),cwc_Dlg32770)
;What Outlook area are we in?
If (StringContains(sWinName,sc_OutlookMessageDialog)
|| ( StringContains(GetWindowName(hwnd),wn_ReadOnlyMessageInReadingPane))
&& !StringContains(sWinName,sc_OutlookMeetingDialog))
|| StringContains(sWinName,scRSSArticle)
	bUseLegacy = true
	If FindDescendantWindow(hDlg,id_RSSAuthor_Field)
		; RSS feed folder messages...
		bReading = true
		If iField == 1
			sName = on_RSSAuthorField
			iControl = id_rssAuthor_Field
		ElIf iField == 2
			sName = on_RSSPostedOnField
			iControl = id_rssPostedOn_Field
		ElIf iField == 5
			sName = on_RSSSubjectField
			iControl = id_rssSubject_Field
		else
			return GetInfoForReadHeader_NotAvailable
		EndIf
	ElIf FindDescendantWindow(hDlg,id_SentField) 
	|| findDescendantWindow (hDlg, id_Sent_Field2)
		; We are reading a message...
		bReading = true
		If iField == 1
			sName = on_FromFieldReading
			iControl = id_from_Field
			if ! findDescendantWindow (hDlg, iControl)
				iControl = id_from_field2
			endIf
		ElIf iField == 2
			sName = on_SentFieldEditing
			if FindDescendantWindow(hDlg,id_SentField)
				iControl = id_sent_Field
			else
				iControl = id_sent_Field2
			endIf
		ElIf iField == 3
			sName = on_ToFieldEditing
			if findDescendantWindow (hDlg, id_to_Field )
				iControl = id_to_Field
			else
				iControl = id_To_Field3
			endIf
		ElIf iField == 4
			sName = on_CcFieldEditing
			if findDescendantWindow (hDlg, id_CC_Field)
				iControl = id_CC_Field
			else
				iControl = id_CC_Field2
			endIf
		ElIf iField == 5
			sName = on_SubjectFieldEditing
			iControl = id_subject_Field
		ElIf iField == 6
			;BCC field may be availavle for messages sent by the user
			sName = on_BccFieldEditing
			iControl = id_BCC_Field
		else
			return GetInfoForReadHeader_NotAvailable
		EndIf ; End of message reading
	Else ; We are editing a message...
		If iField == 3
			sName = on_ToFieldEditing
			if findDescendantWindow (hDlg, id_to_field)
				iControl = id_to_Field
			else
				iControl = id_To_Field3
			endIf
		ElIf iField == 4
			sName = on_CcFieldEditing
			if findDescendantWindow (hDlg, id_CC_Field)
				iControl = id_CC_Field
			else
				iControl = id_CC_Field2
			endIf
		ElIf iField == 5
			sName = on_SubjectFieldEditing
			iControl = id_subject_Field
		ElIf iField == 6
			sName = on_BccFieldEditing
			if findDescendantWindow (hDlg, id_Bcc_Field)
			iControl = id_BCC_Field
			else
				iControl = id_Bcc_field2
			endIf
		ElIf iField == 7
			sName = on_SignedByField
			bUseLegacy = false
		ElIf iField == 8
			sName = on_LabelFieldReading
			bUseLegacy = false
		ElIf iField == 9
			sName = on_AttachmentsField
			bUseLegacy = false
		else
			return GetInfoForReadHeader_NotAvailable
		EndIf ; End of message Editing
	EndIf ; End of Message reading and editing.
ElIf StringContains(sWinName,sc_OutlookMeetingDialog)
|| StringContains(sWinName,sc_OutlookRecurringMeetingDialog)
	; Meeting request dialog...
	If iField == 1
		if stringContains (sWinName, scTentative) 
		|| stringStartsWith (sWinName, scAccepted)
		|| stringStartsWith (sWinName, scDeclined)
			iControl = id_from_field
		else
			iControl = id_from_field2
		endIf
		hwndSetFocus = findDescendantWindow (hDlg, iControl)
		if hwndSetFocus
			bUseLegacy = TRUE
			sName = on_FromFieldEditing
			bReading = TRUE
		else
			sName = on_OrganizerField2
		endIf
	ElIf iField == 2
		if findDescendantWindow (hDlg, id_ReminderTimeEditBox)
			iControl = id_ReminderTimeEditBox
			sName = getWindowName (findDescendantWindow (hDlg, id_ReminderTimeEditBox) )
		else
		sName = on_SentFieldEditing
		endIf
	ElIf iField == 3
		hwndSetFocus = FindWindowWithClassAndID (hDlg, cwc_RichEdit20WPT, id_MeetingStatusField)
		if hwndSetFocus
			iControl = id_MeetingStatusField
			sName = on_StatusField
		else
			hwndSetFocus = findDescendantWindow (hDlg, id_MeetingWhenField)
		endIf
		if ! iControl && hwndSetFocus && getWindowSubtypeCode (hwndSetFocus) != WT_EDITCOMBO
		; incoming meeting request
			iControl = id_MeetingWhenField
			sName = on_MeetingWhenField2
			bUseLegacy = TRUE
			bSubstituteValue = TRUE
			bReading = TRUE
		elif ! iControl
			sName = on_MeetingRequiredField2
		endIf
		bSubstituteValue = TRUE
		bUseLegacy = TRUE
		if ! iControl
		; prevent acquiring wrong info from similar forms
			if getWindowSubtypeCode (findDescendantWindow (hDlg, id_sent_field)) != WT_STATIC
				hwndSetFocus = findDescendantWindow (getAppMainWindow (hDlg), id_MeetingLocationField2)
				iControl = id_MeetingLocationField2
			else
	 			hwndSetFocus = findDescendantWindow (getAppMainWindow (hDlg), id_MeetingLocationField)
 				iControl = id_MeetingLocationField
 			endIf
 		endIf
	ElIf iField == 4
		hwndSetFocus = findDescendantWindow (hDlg, id_MeetingLocationField)
		if hwndSetFocus && getWindowSubtypeCode (hwndSetFocus) == WT_READONLYEDIT then 
		; incoming meeting request
			iControl = id_MeetingLocationField
			bUseLegacy = TRUE
			bSubstituteValue = TRUE
		endIf
		sName = on_MeetingLocationField2
	ElIf iField == 5
		sName = on_SubjectFieldEditing
		iControl = id_MeetingSubjectField2
		var object element = FSUIAGetFocusedElement ()
		var object appElement = FSUIAGetElementFromHandle (getAppMainWindow (getFocus ()))
		element = FSUIAGetParentOfElement (element)
		while (element.HasKeyboardFocus != UIATrue
		&& FSUIAGetParentOfElement (element)
		&& element != appElement)
			element = FSUIAGetParentOfElement (element)
		endWhile
		var object automationIDCondition, object ControlTypeCondition
		automationIDCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, intToString (iControl))
		controlTypeCondition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyID, UIA_EditControlTypeId)
		var object findCondition = FSUIACreateAndCondition (automationIDCondition, controlTypeCondition)
		element = element.findFirst (TreeScope_Descendants, findCondition)
		if element then
			hwndSetFocus = element.nativeWindowHandle
		else
			hwndSetFocus = FindWindowWithClassAndID (hDlg, cwc_RichEdit20WPT, iControl)
		endIf
		if ! hwndSetFocus 
		|| (getWindowSubtypeCode (hwndSetFocus) != WT_READONLYEDIT && getWindowSubtypeCode (hwndSetFocus) != WT_LINK)
		&& ! element
			iControl = id_MeetingSubjectField
			hwndSetFocus = findDescendantWindow (hDlg, iControl)
		else
			sValue = getWindowText (hwndSetFocus, READ_EVERYTHING)
		endIf
		if hwndSetFocus 
		&& (getWindowSubtypeCode (hwndSetFocus) == WT_READONLYEDIT || getWindowSubtypeCode (hwndSetFocus) == WT_LINK
		; reads as readonly edit, UIA recognizes it correctly, but can be recognized wrong as static.
		|| getWindowSubtypeCode (hwndSetFocus) == WT_STATIC) then
		; incoming meeting request
			bUseLegacy = TRUE
			bSubstituteValue = TRUE
		endIf
	ElIf iField == 6
		sName = on_StartTimeFieldWithoutColon
	ElIf iField == 7
		sName = on_EndTimeFieldWithoutColon
	else
		return GetInfoForReadHeader_NotAvailable
	EndIf ; End of Meeting request.
ElIf StringContains(sWinName,sc_OutlookContactDialog)
	; Outlook Contact Header Fields...
	If iField == 1
		sName = on_ContactFullName
	ElIf iField == 2
		sName = on_ContactJobTitle
	ElIf iField == 3
		sName = on_ContactCompany
	ElIf iField == 4
		sName = on_ContactFileAs
	ElIf iField == 5
		sName = on_ContactBusinessPhone
		bSubstituteName = TRUE
	ElIf iField == 6
		sName = on_ContactHomePhone
		bSubstituteName = TRUE
	ElIf iField == 7
		sName = on_ContactBusinessFaxPhone
		bSubstituteName = TRUE
	ElIf iField == 8
		sName = on_ContactMobilePhone
		bSubstituteName = TRUE
	ElIf iField == 9
		sName = on_ContactAddress
	ElIf iField == 10
		sName = on_ContactEmailAddress
		iInstance = 2
	ElIf iField == 11
		sName = on_ContactInternetAddress
	else
		return GetInfoForReadHeader_NotAvailable
	EndIf
ElIf (StringContains(sWinName,sc_OutlookAppointmentDialog)
|| StringContains(sWinName,sc_OutlookCalendarEventDialog)
|| StringContains(sWinName,sc_OutlookCalendarDialog))
	If iField == 1
		sName = on_StartDateFieldWithoutColon
	ElIf iField == 2
		sName = on_StartTimeFieldWithoutColon
	ElIf iField == 3
		sName = on_EndDateFieldWithoutColon
	ElIf iField == 4
		sName = on_EndTimeFieldWithoutColon
	ElIf iField == 5
		sName = on_SubjectFieldEditing
	ElIf iField == 6
		sName = on_MeetingLocationField2
	ElIf iField == 7
		sName = on_OrganizerField2
	ElIf iField == 8
		sName = on_AllDayEventField
	ElIf iField == 9
		sName = on_NotesFieldWithoutColon
	else
		return GetInfoForReadHeader_NotAvailable
	EndIf ; End of Appointments/Calendar dialog.
ElIf StringContains(sWinName,sc_OutlookTaskDialog)
	; Outlook Task dialog...
	If iField == 1
		sName = on_ToFieldReading
	ElIf iField == 2
		sName = on_SubjectField
	ElIf iField == 3
		sName = on_DueDateField
	ElIf iField == 4
		sName = on_StartDateField
	ElIf iField == 5
		sName = on_StatusField
	ElIf iField == 6
		sName = on_PriorityField
	ElIf iField == 7
		sName = on_PercentCompleteField
	ElIf iField == 8
		sName = on_ReminderField
	ElIf iField == 9
		sName = on_OwnerField
	else
		return GetInfoForReadHeader_NotAvailable
	EndIf ; End of Task dialog
ElIf StringContains(sWinName,sc_OutlookJournalDialog)
	If iField == 1
		sName = on_EntryTypeField
	ElIf iField == 2
		sName = on_CompanyField
	ElIf iField == 3
		sName = on_StartDateFieldWithoutColon
	ElIf iField == 4
		sName = on_StartTimeFieldWithoutColon
	ElIf iField == 5
		sName = on_SubjectField
	ElIf iField == 6
		sName  =on_DurationField
	ElIf iField == 7
		sName = on_NotesFieldWithoutColon
	else
		return GetInfoForReadHeader_NotAvailable
	EndIf ; End of Journal dialog
else
	return GetInfoForReadHeader_Error
EndIf
If bUseLegacy
	hWnd = FindDescendantWindow(hDlg,iControl)
	if !Hwnd
		; try again.
		hWnd = FindDescendantWindow(GetNextWindow(hDlg),iControl)
	endIf
	If hWnd
		iType = GetWindowSubTypeCode(hWnd)
		sValue = GetWindowTextEx (hWnd, FALSE, TRUE)
		; Sent field in meetings has an odd name:
		if sName == on_SentField2013Plus
			sName = on_SentFieldEditing
		endIf
		if StringIsBlank (sValue)
		; Newer windows may yield no value, e.g. Outlook 2016 and later:
			var object TextObject = GetObjectFromEvent (hwnd, OBJID_CLIENT, CHILDID_SELF, 0)
			if TextObject then sValue = TextObject.accvalue(CHILDID_SELF) endIf
		endIf
		Return GetInfoForReadHeader_OK
	else
		Return GetInfoForReadHeader_NotAvailable
	EndIf
EndIf
if sName == on_StartTimeField || sName == on_StartTimeFieldWithoutColon 
|| sName == on_EndTimeField || sName == on_EndTimeFieldWithoutColon
; first instance is just a static window:
	iInstance = 2
endIf
bObjNameFound = GetObjectInfoByName(hDlg,sName,iInstance,iType,iState,sValue)
if !bObjNameFound
;Use specific data to get the objects from the new message and meeting requests:
	bObjNameFound = GetObjectInfoByName(hDlg,on_ToButton,2,iType,iState,sValue)
endIf
if !bObjNameFound
	return GetInfoForReadHeader_NotAvailable
endIf
; When the object name needs to be substituted...
If bSubstituteName
	If sName == on_ContactBusinessPhone
		sName = sc_ContactBusinessPhoneLabel
	ElIf sName == on_ContactBusinessFaxPhone
		sName = sc_ContactBusinessFaxPhoneLabel
	ElIf sName == on_ContactHomePhone
		sName = sc_ContactHomePhoneLabel
	ElIf sName == on_ContactMobilePhone
		sName = sc_ContactMobilePhoneLabel
	EndIf ; End Contact name substitution.
EndIf ; End name substitution
; When value needs substituting...
If bSubstituteValue
	If sName == on_MeetingLocationField
		sValue = GetFieldText(id_MeetingLocationField)
	ElIf sName == on_MeetingWhenField
		sValue = GetFieldText(id_MeetingWhenField)
	ElIf sName == on_StartTimeField
		sValue = GetFieldText(id_StartTimeField)
		iType = wt_Edit
	ElIf sName == on_EndTimeField
		sValue = GetFieldText(id_EndTimeField)
		iType = wt_Edit
	ElIf sName == on_SubjectField
		sValue = GetFieldText (id_MeetingSubjectField)
	elIf sName == on_MeetingRequiredField
		sValue = GetFieldText (id_RequiredField)
	elIf sName == on_MeetingOptionalField
		sValue = GetFieldText (id_OptionalField)
	elIf sName == on_MeetingDescriptionField
		sValue = getWindowText (FINDWINDOW (GETAPPMAINWINDOW (GETFOCUS ()),
			wc_wwg), READ_EVERYTHING)
	EndIf ; End meeting value substitution
EndIf ; End value substitution.
return GetInfoForReadHeader_OK
EndFunction

int function LegacyReadHeader(int ignoreIsSameScript, int bReading, int iField,
	handle hDlg,string sName,string sValue, int iInstance,
	int iControl, int iType, int iState)
if !ignoreIsSameScript && isSameScript() && !IsKeyWaiting()
	if bReading  ; any header field
	|| iField >= 3  ;editing
		;Do not replace this call to SetFocus (hWnd). Replacing causes theEsc key not working for closing the message later.
		;There are a few places where ClickObjectByName doesn't work because there's technically no name:
		if !ClickObjectByName(hDlg,sName,iInstance)
			var handle hwnd = FindDescendantWindow (hDlg, iControl)
			if hwnd && IsWindowVisible (hwnd)
				setFocus (hwnd)
			endIf
		endIf
	endIf
	return
endIf
if bReading
|| iField >= 3
	SayFormattedMessageWithVoice (vctx_PCCursor, OT_USER_REQUESTED_INFORMATION,sName+cscSpace+sValue,sName+cscSpace+sValue)
	IndicateControlState (iType,iState) ; For checkboxes...
Else
	;only announce when the previous window with focus is not 0, it exists.
	;this prevents the below message from getting announced when spellchecker completes automatically prior to sending a message.
	if globalPrevFocus!=0
		SayFormattedMessageWithVoice (	VCTX_MESSAGE,OT_ERROR,sName+cscSpace+msgFieldNotAvailable_L,sName+cscSpace+msgFieldNotAvailable_S)
	endIf
endIf
EndFunction

void Function ReadHeader(int iField, optional int ignoreIsSameScript)
var
	handle hWnd,
	handle hDlg,
	handle hwndSetFocus,
	string sName,
	string sValue,
	int iControl,
	int iInstance,
	int bUseLegacy,
	int iState,
	int iType,
	int bReading, ; for when message is read-only
	int GetInfoForReadHeaderResults
hWnd = GetFocus()
GetInfoForReadHeaderResults =
	GetInfoForReadHeader (iField, hWnd, hDlg, hwndSetFocus,
		sName, sValue, iState, iType, iControl,
		iInstance, bUseLegacy, bReading)
if GetInfoForReadHeaderResults == GetInfoForReadHeader_Error
	SayFormattedMessageWithVoice (  VCTX_MESSAGE,OT_ERROR,msgNotInOpenMessageError_l,msgNotInOpenMessageError_s)
	Return
elif GetInfoForReadHeaderResults == GetInfoForReadHeader_NotAvailable
	SayFormattedMessageWithVoice (	VCTX_MESSAGE,OT_ERROR,
		msgFieldNotAvailable_L,msgFieldNotAvailable_S)
	return
EndIf
If bUseLegacy
	LegacyReadHeader(ignoreIsSameScript, bReading, iField, hDlg,sName,sValue, iInstance, iControl, iType, iState)
	Return
EndIf
; Pressing twice moves to object...
If !ignoreIsSameScript && isSameScript() && !IsKeyWaiting()
	if hwndSetFocus
	&& isWindowVisible (hwndSetFocus)
		setFocus (hwndSetFocus)
	else
		ClickObjectByName(hDlg,sName,iInstance)
	endIf
	Return
endIf
if ShouldMessageHeaderSpeak()
	SayFormattedMessageWithVoice (vctx_PCCursor,ot_screen_message,sName+cscSpace+sValue,sName+cscSpace+sValue)
	Return
EndIf
IndicateControlType(iType,sName,sValue)
IndicateControlState (iType,iState) ; For checkboxes...
EndFunction

Script ReadOutlookHeader (int iField)
If inCalendar()
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	Return
EndIf
ReadHeader(iField)
EndScript

string function TypeOfItem ()
if StringContains(c_OutlookFocus.RealWindowName, scMessage) ; for regular messages
|| StringContains(c_OutlookFocus.RealWindowName,wn_RSSArticle) ; for RSS Feeds
	return scMessageItem
elif StringContains(c_OutlookFocus.RealWindowName, scContacts)
	return scContactItem
elif StringContains(c_OutlookFocus.RealWindowName, scMeetingDialog)
	return scMeetingItem
elif StringContains(c_OutlookFocus.RealWindowName, scAppointmentDialog)
	return scAppointmentsItem
elif StringContains(c_OutlookFocus.RealWindowName, scTasks)
	return scTaskItem
endIf
return cscNull
EndFunction

void function EnsureAllVirtualWindowsAreDeactivated()
;This function must be called by AutoFinishEvent.
if !UserBufferIsActive()then
; ensure the default state for virtual viewer visibility 
; reflects the value from the jcf file 
; whenever focus has not settled in the calendar preview
	setJCFOption (OPT_VIRT_VIEWER, globalVirtualViewerVisible)
	return
endIf
var string VWName = UserBufferWindowName()
if !VWName return endIf
if VWName == vwn_CalendarPreviewPane
	DeactivateVWCalendarPreviewPane()
endIf
EndFunction

int function IsCurrentControlVirtualized()
if !UserBufferIsActive() return false endIf
var string vwName = UserBufferWindowName()
if !vwName return false endIf
return (c_OutlookFocus.ControlID == id_CalendarPreviewPane && vwName == vwn_CalendarPreviewPane)
EndFunction

void function ManageUserBufferVirtualWindows()
;IsCurrentControlVirtualized prevents revirtualizing and respeaking controls if focus change fires twice:
if IsCurrentControlVirtualized() return endIf
EnsureAllVirtualWindowsAreDeactivated()
if c_OutlookFocus.ControlID == id_CalendarPreviewPane
	ActivateVWCalendarPreviewPane()
endIf
EndFunction

int function IsAnyUserBufferVirtualWindowActive()
return UserBufferIsActive()
	&& UserBufferWindowName() != cscNull
EndFunction

Int function GetLengthOfCommonRepeatedParentText(object element)
if !element return 0 endIf
var object parent = FSUIAGetParentOfElement(element)
if !parent return 0 endIf
var string parentName = parent.name
var string childName = element.name
if !parentName || !childName return 0 endIf	
;Now get rid of common start segments,
;removing extra blank segments from the parent,
;then finally common start text which is run into the actual text we want:
var int segmentCount = StringSegmentCount(parentName, ",")
var
	int i,
	string parentSegment,
	string childSegment,
	int length,
	int commonRepeatLength
for i = segmentCount to 1 descending
	parentSegment = StringSegment(parentName, ",", 1)
	childSegment = StringSegment(childName, ",", 1)
	if parentSegment == childSegment
		length = StringLength(childSegment)+1
		parentName = StringChopLeft(parentName,length)
		childName = StringChopLeft(childName,length)
		commonRepeatLength = commonRepeatLength+length
	elif StringIsBlank(parentSegment)
	&& !StringIsBlank(childSegment)
		;There is an extra space followed by comma in the parent.
		;Get rid of it, and continue with the comparison to see how much to trim from the child element text:
		parentName = StringChopLeft(parentName,StringLength(parentSegment)+1)
	else
		;Now determine how much text is actually repeated at the start of these segments:
		length = StringLength(childSegment)
		var int trimmed = StringTrimCommon(parentSegment,childSegment,1)
		if trimmed
			length = length - StringLength(childSegment)
			return commonRepeatLength+length
		endIf
		return commonRepeatLength
	endIf
	SegmentCount = segmentCount -1
endFor
return 0
EndFunction

string function GetCalendarQuickPreviewDataFromPane(object element)
if !element return cscNull endIf
var object condition = oFSUIA_Outlook.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_DataItemControlTypeId)
if !condition return cscNull endIf
var object items = element.findAll(treescope_subtree, condition)
if !items.count return cscNull endIf
;The name of each item begins with excess text,
;which is a repeat of the beginning of the parent element's name.
;Try to detect this repeat,
;so that we can trim it away for the final results:
var	int trimLength = GetLengthOfCommonRepeatedParentText(items(0))
var
	object o,
	string s,
	string text
forEach o in items
	s = o.name
	if trimLength
		s = StringChopLeft(s,trimLength)
	endIf
	if s
		s = CleanUpCalendarItemRawData(s)
	endIf
	if s
		text = text+cscBufferNewLine+s
	endIf
endForEach
return text
EndFunction

int function ActivateVWCalendarPreviewPane()
if c_OutlookFocus.ControlID != id_CalendarPreviewPane return false endIf
var object element = FSUIAGetFocusedElement (True)
if !element
|| element.automationId != id_CalendarPreviewPane
|| !element.name
	return false
	endIf
if UserBufferIsActive()
	UserBufferDeactivate()
EndIf
UserBufferClear()
var string text = element.name
UserBufferAddText(text)
;Now get the text for individual calendar items:
text = GetCalendarQuickPreviewDataFromPane(element)
UserBufferAddText(text)
UserBufferActivateEx(vwn_CalendarPreviewPane, GetControlTypeName(WT_READONLYEDIT), WT_READONLYEDIT, id_app_AllAttendeesStatus, true)
return true
EndFunction

int function DeactivateVWCalendarPreviewPane()
if !UserBufferIsActive() return endIf
if UserBufferWindowName() == vwn_CalendarPreviewPane
	UserBufferDeactivate()
	UserBufferClear()
endIf
EndFunction

int Function RedisplayPrevField(String sPrevVWN)
return RedisplayPrevField(sPrevVWN)
EndFunction

int function UserBufferVirtualWindowDeactivate(string vwName)
if VWName == vwn_CalendarPreviewPane
&& c_OutlookFocus.ControlID == id_CalendarPreviewPane 
	return false
endIf
UserBufferDeactivate()
return true
EndFunction

Script UpALevel()
FocusChangeShouldBeSilent = false
if IsAnyUserBufferVirtualWindowActive()
	EnsureAllVirtualWindowsAreDeactivated()
	EscapeKey ()
	return
endIf
if gbWordIsWindowOwner
&& !MenusActive()
&& !UserBufferIsActive()
	;The Word code tries to execute object model calls, which may cause problems,
	;so we ensure that Escape key is issued without any Word DOM calls:
	SayCurrentScriptKeyLabel ()
	EscapeKey()
	return
endIf
if ManageManualDetectionOfAutoCompleteListClosing()
	EscapeKey()
	return
endIf
PerformScript UpALevel()
EndScript

script SayLine()
if handleNoCurrentWindow()
	return
endIf
If  InMessageList()
|| InCalendar()
|| InContactsList()
	If IsSameScript()
		SpellLine()
		Return
	EndIf
	SayLine()
	If InMessageList()
		say (positionInGroup (), OT_POSITION)
	endIf
	Return
EndIf
if GetControlID (GetFocus ()) == id_app_AllAttendeesStatus
	Say(GetObjectName (), OT_LINE)
	return
endIf
PerformScript SayLine()
EndScript

script SayWord()
if handleNoCurrentWindow()
	return
endIf
If  InMessageList()
|| InCalendar()
|| InContactsList()
	If IsSameScript()
		SpellWord()
		Return
	EndIf
	SayWord()
	Return
endIf
var string char = StringTrimLeadingBlanks(StringTrimTrailingBlanks (GetCharacter()))
if StringLength(char) >= 2
	If IsSameScript()
		Say(UIAGetWord (),ot_spell)
		Return
	EndIf
	Say(UIAGetWord (),ot_line)
	return
EndIf
PerformScript SayWord()
EndScript

void function SayCharacter(optional int IncludeMarkup)
if IsPCCursor()
	;Is this an attachment item in the attachments field:
	if GetObjectClassName() == objn_AttachmentButtonFocusable 
		SayWord()
		return
	endIf
	;Is this a graphical address in an address field:
	var string char = GetCharacter()
	if StringLength(StringTrimLeadingBlanks(StringTrimTrailingBlanks (char))) >= 2
		Say(UIAGetCharacter (), ot_line)		
		return
	endIf
endIf
SayCharacter(IncludeMarkup)
EndFunction

script SayCharacter()
if IsPCCursor()
&& isSameScript()
	var string char
	;Is this an attachment item in the attachments field:
	if GetObjectClassName() == objn_AttachmentButtonFocusable 
		char = GetObjectName()
		SpellString(char)
		return
	endIf
	;Is this a graphical address in an address field:
	char = StringTrimLeadingBlanks(StringTrimTrailingBlanks(GetCharacter()))
	if StringLength(char) >= 2
		SpellString(char)
		return
	endIf
endIf
PerformScript SayCharacter()
EndScript

Script SayNextParagraph()
If gbWordIsWindowOwner
	PerformScript SayNextParagraph()
	Return
elIf  InMessageList()
|| GetObjectSubtypeCode() == WT_LISTBOXITEM
	;ActiveItemChangedEvent announces the movement:
	TypeKey(cksControlDownArrow )
	return
EndIf
PerformScript SayNextParagraph()
EndScript

Script SayPriorParagraph()
If gbWordIsWindowOwner
	PerformScript SayPriorParagraph()
	Return
elIf  InMessageList()
|| GetObjectSubtypeCode() == WT_LISTBOXITEM
	;ActiveItemChangedEvent announces the movement:
	TypeKey(cksControlUpArrow )
	return
EndIf
PerformScript SayPriorParagraph()
EndScript

int function ManageManualDetectionOfAutoCompleteListClosing()
if UsesSecondaryFocus return endIf
;This is used only if autocomplete detection is handled through ValueChangedEvent.
;ValueChangedEvent is used when no controllerFor list element is detected for AutoComplete.
if AutoCompleteDetectedByValueChange 
&& CollectionItemCount(c_OutlookAutoComplete) > 0
	PlayAutoCompleteSound(findJAWSSoundFile(c_OutlookSounds.AutoCompleteListExit))
	CollectionRemoveAll(c_OutlookAutoComplete)
	BrailleRefresh()
	return true
endIf
return false
EndFunction

script TabKey()
if IsAnyUserBufferVirtualWindowActive()
	EnsureAllVirtualWindowsAreDeactivated()
endIf
ManageManualDetectionOfAutoCompleteListClosing()
PerformScript TabKey()
EndScript

script ShiftTabKey()
if IsAnyUserBufferVirtualWindowActive()
	EnsureAllVirtualWindowsAreDeactivated()
endIf
ManageManualDetectionOfAutoCompleteListClosing()
PerformScript ShiftTabKey()
EndScript

script Enter()
ManageManualDetectionOfAutoCompleteListClosing()
PerformScript Enter()
EndScript

Int Function IsAutoPreviewEnabled()
var Object oMenu = MSOGetMenuBarObject ().FindControl (MSO_MenuBar, MSO_View).Controls.Item (3)
If oMenu
&& oMenu.Id == MSO_AutoPreview
	Return oMenu.State
EndIf
Return FALSE
EndFunction

handle Function GetToolbar()
var handle hWnd = FindDescendantWindow (GetAppMainWindow (GetFocus ()), id_ToolBar)
if hWnd && GetWindowClass (hWnd) == wc_MsoCommandBarDock
	return hWnd
EndIf
return Null()
EndFunction

void Function ToolBar()
if InHJDialog ()
	SayFormattedMessage (OT_ERROR, msgToolBar1_L, msgToolBar1_S)
	return
EndIf
if !c_OutlookFocus.IsInOutlookMainWindow
	return
endIf
var int item = dlgSelectItemInList (strToolbar+strToolbar1_New+strToolbar2, ToolbarDialogName, true)
delay (2)
if item == Back
	PerformScript MoveBackItem()
elif item == Forward
	PerformScript MoveForwardItem()
Elif Item == MailMessage
	TypeKey (ksNewMailMessage)
elif Item == PrintDoc
	TypeKey (ksPrintDocument)
elIf Item == MoveToFolder
	TypeKey (ksMoveToFolder)
elif Item == DeleteItem
	TypeKey (ksDeleteItem)
Elif Item == Reply
	TypeKey (ksReply)
Elif Item == ReplyToAll
	TypeKey (ksReplyToAll)
elIf Item == ForwardMessage
	TypeKey (ksForwardMessage)
elif Item == AddressBook
	TypeKey (ksAddressBook)
elif Item == Dial
	TypeKey (ksDialer)
elif Item == AdvancedFind
	TypeKey (ksAdvancedFind)
elif Item == MarkAsRead
	TypeKey (ksMarkAsRead)
elif Item == MarkAsUnread
	TypeKey (ksMarkAsUnread)
elif Item == ClearFormatting
	TypeKey (ksClearFormatting)
elif Item == appointmentChoice
	TypeKey (ksAppointmentDialog)
Elif Item == contact
	TypeKey (ksContactDialog)
elif Item == NewFolder
	TypeKey (ksNewFolder)
Elif Item == Journal
	TypeKey (ksJournalDialog)
elif Item == Note
	TypeKey (ksNotesDialog)
elif Item == MeetingRequest
	TypeKey (ksMeetingRequest)
elIf Item == FindPeople
	TypeKey (ksFindPeople)
elif Item == Task
	TypeKey (ksTaskDialog)
elif Item == TaskRequest
	TypeKey (ksTaskRequest_New)
elif Item == OfficeDocument
	TypeKey (ksNewOfficeDocument)
elif Item == Flag
	TypeKey (ksFlag)
elif Item == Post
	TypeKey (ksPost)
elif Item == CopyItem
	TypeKey (ksCopyItem)
elif Item == InBox
	Pause ()
	TypeKey (ksMoveToInbox)
elif Item == GoToFolder
	TypeKey (ksGoToFolder)
endIf
EndFunction

Script CallToolBars ()
ToolBar()
EndScript

int function inTable()
if c_OutlookFocus.WinClassName == wc_OutlookGrid
	if c_OutlookFocus.ControlID == id_app_AllAttendeesList
		return FALSE
	elif c_OutlookFocus.ControlID == id_GridView
		return true
	endIf
endIf
return inTable()
endFunction

int function NextCell(optional int ShouldWrap)
if InMessageList()
	if c_MessageListItem.ColumnIndex < c_MessageListItem.ColumnCount
		c_MessageListItem.ColumnIndex = c_MessageListItem.ColumnIndex + 1
		return true
	endIf
	;Either we are on a group where there is no column count,
	;or we are on the last cell in the row:
	return false
endIf
return NextCell(ShouldWrap)
endFunction

int function PriorCell(optional int ShouldWrap)
if InMessageList()
	if c_MessageListItem.ColumnIndex > 1
		c_MessageListItem.ColumnIndex = c_MessageListItem.ColumnIndex - 1
		return true
	endIf
	;Either we are on a group where there is no column count,
	;or we are on the first cell in the row:
	return false
endIf
return PriorCell(ShouldWrap)
endFunction

int function StartOfRow()
if InMessageList()
	if c_MessageListItem.ColumnIndex > 0
		c_MessageListItem.ColumnIndex = 1
		return true
	endIf
	;We are on a group where there is no column count:
	return false
endIf
return StartOfRow()
endFunction

int function EndOfRow()
if InMessageList()
	if c_MessageListItem.ColumnIndex > 0
		c_MessageListItem.ColumnIndex = c_MessageListItem.ColumnCount
		return true
	endIf
	;We are on a group where there is no column count:
	return false
endIf
return EndOfRow()
endFunction

int function UpCell()
if InMessageList()
	if c_MessageListItem.ColumnIndex > 0
		;Since the number of items can change due to new items arriving,
		;we must get it in real time rather than caching it:
		var object oFocus = GetUIAFocusElement(oFSUIA_Outlook)
		if oFocus.PositionInSet > 1
			priorLine()
			return true
		endIf
	endIf
	;Either we are on the today group,
	;or there are no table cells,
	;or we are already on the first row with a table:
	return false
endIf
return UpCell()
endFunction

int function DownCell()
if InMessageList()
	if c_MessageListItem.ColumnIndex > 0
		;Since the number of items can change due to new items arriving,
		;we must get it in real time rather than caching it:
		var object oFocus = GetUIAFocusElement(oFSUIA_Outlook)
		if oFocus.PositionInSet > 0
		&& oFocus.PositionInSet < oFocus.SizeOfSet
			NextLine()
			return true
		endIf
	endIf
	;Either we are on the today group,
	;or there are no table cells,
	;or we are already on the last row:
	return false
endIf
return DownCell()
endFunction

int function TopOfColumn()
if InMessageList()
	if c_MessageListItem.ColumnIndex > 0
		JAWSHome()
		return true
	endIf
	;Either we are on the today group,
	;or there are no table cells:
	return false
endIf
return TopOfColumn()
endFunction

int function BottomOfColumn()
if InMessageList()
	if c_MessageListItem.ColumnIndex > 0
		JAWSEnd()
		return true
	endIf
	;Either we are on the today group,
	;or there are no table cells:
	return false
endIf
return BottomOfColumn()
endFunction

int function FirstCell()
if InMessageList()
	if c_MessageListItem.ColumnIndex > 0
		c_MessageListItem.ColumnIndex = 1
		JAWSHome()
		return true
	endIf
	;Either we are on the today group,
	;or there are no table cells:
	return false
endIf
return FirstCell()
endFunction

int function lastCell()
if InMessageList()
	if c_MessageListItem.ColumnIndex > 0
		c_MessageListItem.ColumnIndex = 100 ;will be reset to the count of columns
		JAWSEnd()
		return true
	endIf
	;Either we are on the today group,
	;or there are no table cells:
	return false
endIf
return lastCell ()
endFunction

int function GetCellCoordinates(int byRef col, int byRef row)
if !InMessageList()
	return GetCellCoordinates (col, row)
endIf
if c_MessageListItem.ColumnIndex == 0
	col = 0
	row = 0
	return false
endIf
col = c_MessageListItem.ColumnIndex
;Since the number of items can change due to new items arriving,
;we must get it in real time rather than caching it:
var object oFocus = GetUIAFocusElement(oFSUIA_Outlook)
row = oFocus.PositionInSet
return true
endFunction

int function GetCurrentRowColumnCount()
if InMessageList()
	return c_MessageListItem.ColumnCount
endIf
return GetCurrentRowColumnCount()
endFunction

int function GetEditCellCoordinates(int byRef col, int byRef row)
; prevent false positive where in the Outlook messages list.
if InMessageList()
	col = 0
	row = 0
	return false
endIf
return GetEditCellCoordinates(col,row)
endFunction

string function GetRowHeader(optional int bMarkedHeader)
if InMessageList() return cscNull endIf
return GetRowHeader(bMarkedHeader)
endFunction

string function GetColumnHeader(optional int bMarkedHeader)
if InMessageList()
	if !CollectionItemExists(c_MessageListItem,"Cells")
		return cscNull
	endIf
	var variantArray a = c_MessageListItem.Cells
	return a[c_MessageListItem.ColumnIndex].TableColumnHeader
endIf
return GetColumnHeader(bMarkedHeader)
endFunction

string function getCell()
; used by SayCellEX () used by SpeakTableCells function.
if InMessageList()
	if !CollectionItemExists(c_MessageListItem,"Cells")
		return cscNull
	endIf
	var variantArray a = c_MessageListItem.Cells
	return a[c_MessageListItem.ColumnIndex].name
endIf
return getCell()
endFunction

void function SayCellCoordinatesInfo(optional int iOutputType)
; for modern outlook UIA table support, no coordinates should speak.
if InMessageList() return endIf
SayCellCoordinatesInfo(iOutputType)
endFunction

int function SayCellUnit(int UnitMovement)
if UnitMovement == UnitMove_Top
|| UnitMovement == UnitMove_Bottom
	if stringContains (stringLower (getWindowClass (getFocus ())), "grid")
	&& stringContains (stringLower (getCurrentScriptKeyName ()), "page")
		TypeCurrentScriptKey ()
		SayCurrentScriptKeyLabel ()
		return TRUE
	endIf
endIf
return SayCellUnit(UnitMovement)
endFunction

void function SayCell ()
if InMessageList()
	sayUsingVoice (vctx_Message, getCell(), OT_LINE)
	return 
endIf
sayCell ()
endFunction

Void Function SpeakTableCells (int tableNavDir, int nPrevNumOfCells)
if InMessageList()
	if UpdateMessageListItemData()
		Pause()
	endIf
endIf
SpeakTableCells (tableNavDir, nPrevNumOfCells)
EndFunction

script SayCell ()
if InMessageList()
	UpdateMessageListItemData()
endIf
performScript SayCell ()
endScript

Script SayMSAAData()
If c_OutlookFocus.ControlID != id_GridView
	SayFormattedMessage (OT_ERROR, cMsgSayMSAADataError_L)
	return
endIf
var	string sValue = GetObjectName(SOURCE_CACHED_DATA)
If StringLength(sValue)<2
	sValue = MsgNoItems_L
EndIf
If IsSameScript()
	SpellString(sValue)
Else
	Say(sValue,OT_SCREEN_MESSAGE)
EndIf
EndScript

Script SayMoveForward ()
TypeCurrentScriptKey ()
If InHJDialog () || UserBufferIsActive ()
;These keystrokes do nothing when outside the Outlook main windows.
|| !IsInOutlookMainWindow()
	Return
EndIf
SayMessage (OT_STATUS, MsgForward_L, MsgForward_S)
EndScript

Script SayMoveBack ()
TypeCurrentScriptKey ()
If InHJDialog () || UserBufferIsActive ()
;These keystrokes do nothing when outside the Outlook main windows.
|| !IsInOutlookMainWindow()
	Return
EndIf
SayMessage (OT_STATUS, MsgBack_L, MsgBack_S)
EndScript

Script OutlookAttachmentsList ()
var
	handle hwnd,
	handle hAttachments,
	string sClass
hWnd = GetFocus()
sClass = GetWindowClass(hWnd)
;First, make sure that a message is open:
If (!FindDescendantWindow(GetAppMainWindow(hWnd),id_subject_field)
&& !FindDescendantWindow(GetAppMainWindow(hWnd),id_app_subject))
|| GetCurrentControlID()==id_GridView
	SayMessage(ot_error, msg_NoOpenMessage1_L, msg_NoOpenMessage1_S)
	return
EndIf
hAttachments = FindWindowWithClassAndId (GetAppMainWindow(hWnd),wc_Rctrl_RenWnd32,id_Attachments_New)
if hAttachments
	hAttachments = findWindow (hAttachments, "NetUINativeHWNDHost")
endIf
if hAttachments && isWindowVisible (hAttachments)
	var object element = CreateUIAElementFromWindow (hAttachments)
	var object treeWalker = CreateUIARawViewTreeWalker()
	TreeWalker.CurrentElement = element
	; element.FindFirst by condition doesn't work for some reason.
	while (element.ClassName != objn_AttachmentButtonFocusable && Treewalker.GoToFirstChild())
		element = Treewalker.CurrentElement
	endWhile
	if element.isKeyboardFocusable
		element.SetFocus()
	else
		SayFormattedMessage (OT_ERROR, msgAttachmentsList2_L, msgAttachmentsList2_S)
	endIf
else
	SayFormattedMessage (OT_ERROR, msgAttachmentsList2_L, msgAttachmentsList2_S)
endIf
EndScript

script GrowFont1Point()
SayCurrentScriptKeyLabel()
TypeKey(ksGrowFont1Point) ; ControlRightBracket in English
if gbWordIsWindowOwner
&& !IsActiveDocumentProtected () then  ; in an editable message
	; call SayFontSize function in microsoft word since cannot get point size string from here.
	SayFontSize()
EndIf
EndScript

script ShrinkFont1Point()
SayCurrentScriptKeyLabel()
TypeKey(ksShrinkFont1Point) ; ControlLeftBracket in English
if gbWordIsWindowOwner
&& !IsActiveDocumentProtected () then  ; in an editable message
	; call SayFontSize function in microsoft word since cannot get point size string from here.
	SayFontSize()
EndIf
EndScript

Script ReadBoxInTabOrder()
var handle hReal = GetRealWindow(GetFocus())
if !StringContains(c_OutlookFocus.RealWindowName, wn_AdvancedFind)
	PerformScript ReadBoxInTabOrder()
	return
EndIf
If !GetDialogStaticText ()
	Say(MSAAGetDialogStaticText (), OT_DIALOG_TEXT)
EndIf
Say(c_OutlookFocus.RealWindowName, OT_ERROR)
EnumerateChildWindows(hReal, "DoChildWindows")
EndScript



script ControlDelete()
; Deletes a word in email message
TypeKey(ksDeleteWord) ;Instead of TypeCurrentScriptKey, so additional key assignments to script will work
Pause()
if CaretVisible()
	SayWord()
EndIf
EndScript

Script AltF4 ()
; run from Word to release its objects:
performScript AltF4 ()
EndScript

Script MoveForwardItem()
If gbWordIsWindowOwner
&& !IsActiveDocumentProtected()
	;TypeCurrentScriptKey() ; Use CTRL and brackets, as that's most reliable:
	typeKey (ksGrowFont)
	SayFontSize()
	Return
EndIf
var string sTypeOfItem = TypeOfItem()
TypeCurrentScriptKey()
if sTypeOfItem == cscNull
	return
endIf
var string sMessage_L = FormatString (msgNextItem, sTypeOfItem)
SayFormattedMessage (ot_status, sMessage_L, msgNext);next message/contact/task
EndScript

Script MoveBackItem()
If gbWordIsWindowOwner
&& ! IsActiveDocumentProtected()
	;TypeCurrentScriptKey() ; Use CTRL and brackets, as that's most reliable:
	typeKey (ksShrinkFont)
	SayFontSize()
	Return
EndIf
var string sTypeOfItem = TypeOfItem()
TypeCurrentScriptKey()
if sTypeOfItem == cscNull
	return
endIf
var string sMessage_L = FormatString (msgPreviousItem, sTypeOfItem)
SayFormattedMessage (ot_status, sMessage_L, msgPrevious)
EndScript

Script GoToOutlookMessageBodyWindow ()
if !InMessageTextWindow()
	;SayFormattedMessageWithVoice (  VCTX_MESSAGE,OT_ERROR,msgNotInOpenMessageError_l,msgNotInOpenMessageError_s)
	sayMessage(ot_error,msg_NoOpenMessage1_L,msg_NoOpenMessage1_S)
	return
elIf GetWindowClass(GetFocus()) == wc_wwg
	SayMessage(ot_error,msgEMail_l,msgEMail_S)
	return
endIf
Var	handle hwnd = FindWindow(GetTopLevelWindow(GetFocus()),wc_wwg)
if !hWnd
	sayMessage(ot_error,msg_NoOpenMessage1_L,msg_NoOpenMessage1_S)
	return
endIf
;Even though SetFocus works to set the focus to the window,
;the user may not be able to interact with it.
;Try using move cursor first:
;modify Move to body, so the cursor doesnot always end up at the bottom of the message.
SaveCursor ()
InvisibleCursor ()
SaveCursor ();prev location of invisible
MoveToWindow(hwnd)
if hwnd == getCurrentWindow ()
	;bump the cursor left to avoid activating any links:
	MoveTo(GetCursorCol()-2,GetCursorRow())
	RoutePcToInvisible ()
	restoreCursor () ; Put invisible Cursor back
	restoreCursor () ; put PC Cursor back
	pcCursor ()  ;in case the double restore cursor isn/'t restoring the PC cursor
else ; Old Code, window could not  be moved to by Invisible.
	restoreCursor () ; put PC Cursor back ; Put invisible Cursor back
	restoreCursor ()
	SetFocus (hwnd)
	LeftMouseButton ()
endIf
EndScript

Script GoToMessagesView ()
if UserBufferIsActive ()
	UserBufferDeactivate ()
endIf
TypeKey (KsGoToMessageList)
EndScript

Script GoToContactsView ()
if UserBufferIsActive ()
	UserBufferDeactivate ()
endIf
TypeKey (KsGoToContacts)
EndScript

Script GoToTasksView ()
if UserBufferIsActive ()
	UserBufferDeactivate ()
endIf
TypeKey (KsGoToTasks)
EndScript

Script GoToNotesView ()
if UserBufferIsActive ()
	UserBufferDeactivate ()
endIf
TypeKey (KsGoToNotes)
EndScript

Script GoToCalendarView()
if UserBufferIsActive ()
	UserBufferDeactivate ()
endIf
TypeKey (KsGoToCalendar)
EndScript

void Function MoveToFieldUsingHandle(handle hWnd, string sControlName)
Var
	handle hFocus
hFocus = GetFocus()
If hFocus == hWnd
	SayUsingVoice (VCTX_MESSAGE,msgAlreadyThere+sControlName, OT_STATUS) ; "You are already in the "
	return
EndIf
If !IsWindowVisible(hWnd)
	Say(sControlName+msgNotVisible, OT_ERROR) ; not found. This field may not be visible on the screen
	return
EndIF
MoveToWindow(hWnd)
RoutePcToJAWS() ;does a mouse click
EndFunction

Script ContactFieldsDialog()
if !getRunningFSProducts() & product_JAWS
	return
endIf
if !StringContains (c_OutlookFocus.RealWindowName, scContacts)
	TypeCurrentScriptKey();alt+m
	return
EndIf
;An HJDialog will show a list of Contact dialog field choices,
;and when the list is dismissed the focus will be moved if the user made a choice different from the focus field.
;We don't want the focus to announce when the list dismisses if the focus will change.
;We set the variable to tell the focus change to be silent,
;and clear it in the script for the Escape key to cover the case of canceling the HJDialog.
;This leaves the case of the user choosing the current focus item in the list of the HJDialog,
;but in that case we will be announcing that they are already on that field.
FocusChangeShouldBeSilent = true
var
	handle hFocus = GetFocus(),
	handle hWnd,
	string strFieldNames,
	string strFieldHandles,
	string sName
hWnd = GetFirstWindow(hFocus)
While hWnd
	sName = GetWindowName(HWnd)
	if !IsWindowDisabled(hWnd)
	&& !IsWindowObscured(hWnd)
	&& sName != cscNull
		If GetWindowSubtypeCode(HWnd) == WT_EDIT
			strFieldNames = strFieldNames + sName + cscSpace + GetWindowText (HWnd, 0) + list_item_separator
			strFieldHandles = strFieldHandles + IntToString (HWnd) + list_item_separator
		EndIf
	EndIf
	HWnd = GetNextWindow(HWnd)
EndWhile
if GetWindowClass(GetParent(GetParent(hFocus)))==wc_AFXWnd
	var string realName = c_OutlookFocus.RealWindowName
	strFieldNames = strFieldNames + realName + cscSpace + list_item_separator
	strFieldHandles = strFieldHandles + IntToString (hFocus) + list_item_separator
endIf
var handle HWndApp = GetAppMainWindow(hFocus)
var int index = dlgSelectItemInList(strFieldNames, "JAWS ",False) ;do not sort
If index == 0
	Return; cancelled
EndIf
var	string sChosenField
sChosenField = StringSegment (strFieldNames,LIST_ITEM_SEPARATOR, index)
HWnd = StringToHandle(StringSegment (strFieldHandles,LIST_ITEM_SEPARATOR, index)) ;extract the handle from the list
MoveToFieldUsingHandle(HWnd, sChosenField)
EndScript

Script ClickButton(int iButtonID)
var
	int iButtonControlID,
	int iButtonIsClickable,
	handle hButton,
	string sButtonLabel
If iButtonID == 1
	iButtonControlID = id_to_button
	sButtonLabel = msgToButton
ElIf iButtonID == 2
	iButtonControlID = id_cc_button
	sButtonLabel = msgCcButton
ElIf iButtonID == 3
	iButtonControlID = id_address_button
	sButtonLabel = msgAddressButton
ElIf iButtonID == 4
	If !StringContains(c_OutlookFocus.RealWindowName,scTasks)
		; Not in a Reminder Task...
		SayMessage(OT_ERROR,msgErrorClickReminderSound_L, msgErrorClickReminderSound_s)
		Return
	EndIf
	iButtonControlID = id_ReminderSound_button2
	sButtonLabel = msgReminderSoundButton
Else
	Return
EndIf
SayUsingVoice(VCTX_MESSAGE,sButtonLabel,OT_SCREEN_MESSAGE)
; Find, then move to, button...
hButton = FindDescendantWindow (GetAppMainWindow(GetFocus()), iButtonControlID)
; Find out if the button actually exists.
iButtonIsClickable = ((hButton)
|| (IsWindowVisible (hButton))
|| (!IsWindowObscured (hButton)))
if iButtonIsClickable
	SaveCursor()
	JAWSCursor()
	SaveCursor()
	; Stores location of JAWSCursor
	MoveToWindow (hButton)
	pause()
	LeftMouseButton(); Will work on the toolbar
	RestoreCursor()
	RestoreCursor()
else
	Say(msgLabelNotFound1_L,OT_ERROR)
EndIf
EndScript

Script selectAField()
EnsureNoUserBufferActive()
; parameter to IsDocumentAreaScriptException ensures proper Outlook error handling.
if IsDocumentAreaScriptException(TRUE)
	return
EndIf
ListFields()
EndScript

handle function FindFromField(handle focusWindow)
var
	handle startSearchWindow = Null(),
	handle ret = Null()
if (GetWindowClass(focusWindow) != wc_wwg)
	startSearchWindow = GetRealWindow(focusWindow)
else
	startSearchWindow = GetAppMainWindow(focusWindow)
endIf
ret = FindWindowWithClassAndId(startSearchWindow, cwc_RichEdit20WPT, id_From_Field2)
if (!ret)
	ret = FindWindowWithClassAndId(startSearchWindow, cwc_RichEdit20WPT, id_From_Field)
endIf
return ret
EndFunction

handle function FindToField(handle focusWindow)
var
	handle startSearchWindow = Null(),
	handle ret = Null()
if (GetWindowClass(focusWindow) != wc_wwg)
	startSearchWindow = GetRealWindow(focusWindow)
else
	startSearchWindow = GetAppMainWindow(focusWindow)
endIf
ret = FindWindowWithClassAndId(startSearchWindow, cwc_RichEdit20WPT, id_To_Field3)
if (!ret)
	ret = FindWindowWithClassAndId(startSearchWindow, cwc_RichEdit20WPT, id_To_Field)
endIf
return ret
EndFunction

Int Function AddressMessage(String sAddress)
var
	object oMailItem
If OmOutlook
	oMailItem = OmOutlook.ActiveInspector.CurrentItem
	If oMailItem
		oMailItem.To = sAddress
		ComRelease (oMailItem, TRUE)
		Return (TRUE)
	EndIf
EndIf
Return FALSE
EndFunction

Script ReplyDirectlyToSender()
var
	Handle hFrom,
	Handle hTo,
	Handle hFocus,
	Object oClient,
	string temp,
	string sValue,
	Int v,
	Int iLoop
hFocus = GetFocus()
hFrom = FindFromField(hFocus)
If Not hFrom
; Cannot perform correctly from messages list, because the Outlook object model will not respond.
; open the message first, then do this keystroke.
|| GetControlID (getFocus()) == id_GridView
	Say(msgCannotRetrieveSendersAddress,OT_ERROR)
	Return
EndIf
oClient = GetObjectFromEvent(hFrom, OBJID_CLIENT, CHILDID_SELF, v)
temp = oClient.accValue(v)
sValue = temp
ComRelease (oClient, true)
If StringIsBlank (sValue)
	Say(msgCannotRetrieveSendersAddress,OT_ERROR)
	Return
EndIf
; Placed here for the user to know that the script is started...
SayUsingVoice(VCTX_MESSAGE,msgReplyingToSender,OT_USER_REQUESTED_INFORMATION)
sValue = StringSegment (temp, SC_EMailStart + SC_EMailEnd, 2)
if stringIsBlank (sValue)
	; In case multiple addresses are present, capture the last one which is the user, or 'author'.
	sValue = StringSegment (temp, scListServStartEnd, StringSegmentCount (temp, scListServStartEnd))
endIf
TypeKey(ksReply)
Delay(10)
If Not StringIsBlank (sValue)
&& !AddressMessage(sValue)	
Say(MsgCannotAddressMessage,OT_ERROR)
	Return
EndIf
SpeechOff()
Delay(2)
SpeechOn()
hFocus = GetFocus()
hTo = FindToField(hFocus)
oClient = GetObjectFromEvent(hTo, OBJID_CLIENT, CHILDID_SELF, v)
sValue = oClient.accValue(v)
ComRelease (oClient, true)
If Not StringIsBlank (sValue)
	Say (GetWindowName (hTo), OT_CONTROL_NAME)
	Say (sValue, OT_USER_REQUESTED_INFORMATION)
EndIf
IndicateControlType (WT_EDIT, cScSpace)
EndScript

Script ReplyOrRightJustify()
if gbWordIsWindowOwner
&& !IsActiveDocumentProtected()
&& ksRightJustify == ksReply
	PerformScript RightJustify()
	return
endIf
TypeKey(ksReply)
SetQuickKeyNavigationState(OFF)
EndScript

Script HandleReplyAll()
SayCurrentScriptKeyLabel()
TypeKey(ksReplyToAll)
SetQuickKeyNavigationState(OFF)
EndScript

Script HandleForwardMessage()
SayCurrentScriptKeyLabel()
TypeKey(ksForwardMessage)
SetQuickKeyNavigationState(OFF)
EndScript

void Function ReadWordInContext(optional int bIgnoreNotFoundMessage)
if InbosaSDMMso96Dialog()
	ReadWordInContextForSDMSpellCheck(bIgnoreNotFoundMessage)
else
	ReadWordInContextForEditorSpellCheck(bIgnoreNotFoundMessage)
endIf
EndFunction

void Function ReadWordInContextForSDMSpellCheck (int bIgnoreNotFoundMessage)
var
	object oUIA,
	object oSentenceCondition,
	object oSentence,
	object oRealWindow,
	object textPattern,
	object documentRange,
	string sSentence
oUIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest")
oRealWindow = oUIA.GetElementFromHandle(GetRealWindow (GetFocus ()))
oSentenceCondition = oUIA.createStringPropertyCondition(UIA_AutomationIDPropertyID, id_idSpellCheckDocument)
;Check for UIA errors
if !oRealWindow
|| !oSentenceCondition
	SayMessage (OT_ERROR, msgReadWordInContextNotAvailable)
	return
endIf
oSentence = oRealWindow.findFirst (TreeScope_Descendants, oSentenceCondition)
if !oSentence
	SayMessage (OT_ERROR, msgReadWordInContextNotAvailable)
	return
endIf
textPattern = oSentence.GetTextPattern()
documentRange = textPattern.DocumentRange()
sSentence = documentRange.GetText(TextRange_NoMaxLength)
if !sSentence
	SayMessage (OT_ERROR, msgReadWordInContextNotAvailable)
	return
endIf
SayMessage (OT_User_Requested_Information, sSentence)
EndFunction

void Function ReadWordInContextForEditorSpellCheck (int bIgnoreNotFoundMessage)
var
	object oUIA,
	object oEditorNameCondition,
	object oOriginalSentenceNameCondition,
	object oOriginalSentenceCondition,
	object oTypeCondition,
	object oElement,
	object oOriginalSentence,
	object oEditor,
	object oEditorCondition,
	object oValuePattern,
	string sSentenceValue
oUIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest")
oElement = oUIA.getFocusedElement()
oEditorNameCondition = oUIA.createStringPropertyCondition(UIA_NamePropertyID, wn_Editor)
oTypeCondition = oUIA.createIntPropertyCondition(UIA_ControlTypePropertyId, UIA_PaneControlTypeId)
oEditorCondition = oUIA.createAndCondition(oTypeCondition, oEditorNameCondition)
oOriginalSentenceNameCondition = oUIA.createStringPropertyCondition(UIA_NamePropertyID, wn_OriginalSentence)
oTypeCondition = oUIA.createIntPropertyCondition(UIA_ControlTypePropertyId, UIA_EditControlTypeId)
oOriginalSentenceCondition = oUIA.createAndCondition(oTypeCondition, oOriginalSentenceNameCondition)
;Check for UIA errors
if !oElement
|| !oEditorCondition
|| !oOriginalSentenceCondition
	SayMessage (OT_ERROR, msgReadWordInContextNotAvailable)
	return
endIf
oElement = UIAGetGrandParent (oElement)
if !oElement
	SayMessage (OT_ERROR, msgReadWordInContextNotAvailable)
	return
endIf
oEditor = oElement.findFirst (TreeScope_Subtree, oEditorCondition)
if !oEditor
	SayMessage (OT_ERROR, msgReadWordInContextNotAvailable)
	return
endIf
oOriginalSentence = oEditor.findFirst (TreeScope_Descendants, oOriginalSentenceCondition)
if !oOriginalSentence
	SayMessage (OT_ERROR, msgReadWordInContextNotAvailable)
	return
endIf
oValuePattern = oOriginalSentence.getValuePattern()
sSentenceValue = oValuePattern.value
if !sSentenceValue
	SayMessage (OT_ERROR, msgReadWordInContextNotAvailable)
	return
endIf
SayMessage (OT_User_Requested_Information, sSentenceValue)
EndFunction

int function InbosaSDMMso96Dialog()
return GetWindowClass (GetRealWindow (GetFocus ())) == wc_BosaSDMDlg
EndFunction

Script ReadMistakeAndSuggestion ()
var 
	object oUIA,
	object oEditorNameCondition,
	object oSuggestionsNameCondition,
	object oNoSuggestionsNameCondition,
	object oTypeCondition,
	object oAndCondition,
	object oOrCondition,
	object oElement,
	object oSuggestions,
	object oEditor,
	object oEditorCondition,
	object oSuggestionsOrCondition

oUIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest")
oElement = oUIA.getFocusedElement()
oEditorNameCondition = oUIA.createStringPropertyCondition(UIA_NamePropertyID, wn_Editor)
oTypeCondition = oUIA.createIntPropertyCondition(UIA_ControlTypePropertyId, UIA_PaneControlTypeId)
oEditorCondition = oUIA.createAndCondition(oTypeCondition, oEditorNameCondition)
oSuggestionsNameCondition = oUIA.createStringPropertyCondition(UIA_NamePropertyID, "Suggestions")
oNoSuggestionsNameCondition = oUIA.createStringPropertyCondition(UIA_NamePropertyID, "No suggestions")
oTypeCondition = oUIA.createIntPropertyCondition(UIA_ControlTypePropertyId, UIA_GroupControlTypeId)
oOrCondition = oUIA.createOrCondition(oSuggestionsNameCondition, oNoSuggestionsNameCondition)
oSuggestionsOrCondition = oUIA.createAndCondition(oTypeCondition, oOrCondition)
;Check for UIA errors
if !oElement
|| !oEditorCondition
|| !oSuggestionsOrCondition
	SayMessage (OT_ERROR, MSG_SpellCheckerNeeded_L, MSG_SpellCheckerNeeded_S)
	return
endIf
;Errors from this point on are due to the command being issued in the wrong location.
if !stringContains(GetObjectName(SOURCE_CACHED_DATA, 1), scSpellingDialogName) 
&& !stringContains(GetObjectName(SOURCE_CACHED_DATA, 2), scSpellingDialogName)
	oElement = UIAGetGrandParent (oElement)
	if !oElement
		SayMessage (OT_ERROR, MSG_SpellCheckerNeeded_L, MSG_SpellCheckerNeeded_S)
		return
	endIf
	oEditor = oElement.findFirst (TreeScope_Subtree, oEditorCondition)
	if !oEditor
		SayMessage (OT_ERROR, MSG_SpellCheckerNeeded_L, MSG_SpellCheckerNeeded_S)
		return
	endIf
	oSuggestions = oEditor.findFirst (TreeScope_Descendants, oSuggestionsOrCondition)
	if !oSuggestions
		SayMessage (OT_ERROR, MSG_SpellCheckerNeeded_L, MSG_SpellCheckerNeeded_S)
		return
	endIf
endIf
PerformScript ReadMistakeAndSuggestion()
EndScript

void Function SayAnyHTMLTitleInformation ()
If IsVirtualPCCursor()
&& InMessageTextWindow()
	Return
EndIf
SayAnyHTMLTitleInformation()
EndFunction

void Function SayWindowTitleForApplication (Handle hApp, Handle hReal, Handle hWnd, Int iType)
Var
	String sText1 = GetWindowName(hApp),
	String sText2,
	String sText3
If c_OutlookFocus.IsMessagesList
	If hReal != hApp
		If hReal != hWnd
			sText2 = GetWindowName (hReal)
		EndIf
	EndIf
	SayMessage(ot_USER_REQUESTED_INFORMATION,
		FormatString (cmsg29_L, sText1, sText2),
		FormatString (cMsg29_S, sText1, sText2))
	Return
EndIf
Return SayWindowTitleForApplication (hApp, hReal, hWnd, iType)
EndFunction

string function GetStatusBarWindowInfo()
var
	object oMain = FSUIAGetElementFromHandle (GetAppMainWindow (GetCurrentWindow ())),
	object oDockBottomCondition = FSUIACreateStringPropertyCondition (UIA_namePropertyId, MsoDockBottom),
	object oDockBottom = oMain.findFirst(TreeScope_Children, oDockBottomCondition),
	object oStatusBarCondition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyId, UIA_StatusBarControlTypeId),
	object oStatusBar = oDockBottom.findFirst(TreeScope_Descendants, oStatusBarCondition),
	object oStatusBarItemsCondition = FSUIACreateStringPropertyCondition (UIA_ClassNamePropertyId, objn_NetUISimpleButton),
	object oStatusBarItems,
	object oStatusBarItem,
	string sStatusBarText,
	string sText
if !oStatusBar return cscNull endIf 
oStatusBarItems = oStatusBar.findAll(TreeScope_Children, OStatusBarItemsCondition)
forEach oStatusBarItem in oStatusBarItems
	sText = oStatusBarItem.name
	sStatusBarText = sStatusBarText + cscBufferNewLine + sText
endForEach
return StringChopLeft(sStatusBarText, 1)
EndFunction

script SayBottomLineOfWindow()
var	string sStatusBar
if !DialogActive()
&& !UserBufferIsActive()
&& !GlobalMenuMode
	sStatusBar = GetStatusBarWindowInfo()
	if sStatusBar
		Say(sStatusBar,ot_user_requested_information)
		return
	EndIf
EndIf
PerformScript SayBottomLineOfWindow()
EndScript

Script SayCurrentAccessKey()
var
	string sShortcut,
	string sObjectName
sObjectName = GetObjectName(SOURCE_CACHED_DATA)
If StringContains (c_OutlookFocus.RealWindowName, scMeetingDialog)
|| StringContains (c_OutlookFocus.RealWindowName, scAppointmentDialog)
|| StringContains (c_OutlookFocus.RealWindowName, scJournalDialogue)
	sShortcut = GetCurrentObject (0).accKeyboardShortcut
	If !StringIsBlank (sShortcut)
		SayMessage(ot_help,
			FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_L, sObjectName, sShortcut),
			FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_S, sObjectName, sShortcut))
	Else
		SayFormattedMessage (ot_error, cmsg124_L) ;"no hot key"
	EndIf
	Return
EndIf
PerformScript SayCurrentAccessKey()
EndScript

int function HasVirtualEnhancedClipboard()
return true
EndFunction

void Function TutorMessageEvent (handle hwndFocus, int nMenuMode)
if InRibbons()
	Return tutorMessageEvent(hwndFocus, nMenuMode)
endIf
var
	int iSpeakAccessKeys,
	Int iSpeakTutorMessage,
	Int iControlID,
	String sFocusClassName
iControlID = GetControlID (hwndFocus)
iSpeakAccessKeys=ShouldItemSpeak (OT_ACCESS_KEY)
iSpeakTutorMessage = ShouldItemSpeak (OT_TUTOR)
If (iControlID == idc_24
&& GetWindowName(hWndFocus)==wn_Owner)
&& (iSpeakAccessKeys == 1
|| iSpeakAccessKeys == 3)
	Return
ElIf (iControlID == id_Message_Field
|| iControlID == id_Message_Window)
&& TypeOfItem()==scMessageItem
	; Keeps Alt+j from announcing as hotkey for message field.
	Return
EndIf
; Calendar handling...
If inCalendar()
	If InNavigationPane()
	&& FocusChangeType == FocusChangeType_ActiveItem
		Return
	EndIf
	; To avoid announcements of tutor messages on typing text in the edit box...
	Return (TutorMessageEvent (hwndFocus, nMenuMode))
EndIf
If GetWindowSubtypeCode (hwndFocus) == WT_CONTEXTMENU
&& GetObjectSubTypeCode() == WT_MENU then	; to avoid double speaking of the access key on activating context menu...
	Return TutorMessageEvent (hwndFocus, nMenuMode)
EndIf
If StringContains (c_OutlookFocus.RealWindowName, scMeetingDialog)
|| StringContains (c_OutlookFocus.RealWindowName, scAppointmentDialog)
|| StringContains (c_OutlookFocus.RealWindowName, scJournalDialogue)
|| getWindowClass (hwndFocus) == cwc_RichEdit20WPT
	Return tutorMessageEvent(hwndFocus, nMenuMode)
EndIf
If c_OutlookFocus.IsMessagesList
&& FocusChangeType == FocusChangeType_ActiveItem
	Return
EndIf
tutorMessageEvent(hwndFocus, nMenuMode)
EndFunction

string function GetCustomTutorMessage()
If gbWordIsWindowOwner
	return GetCustomTutorMessage()
EndIf
var
	Handle hFocus,
	Handle hPaneParent,
	Handle hCalendarPane,
	String sFocusWindowClass,
	Int iCalendarView,
	Int iNumberOfCalendars,
	Int iControlID,
	Int iObjectType
hFocus = GetFocus()
iControlID = GetControlID (hFocus)
iObjectType = GetObjectSubTypeCode()
sFocusWindowClass = GetWindowClass (hFocus)
if (StringContains (c_OutlookFocus.RealWindowName, scNoteDialogName))
	;Only add here if in a note:
	if getWindowSubtypeCode (getFocus()) == WT_MULTILINE_EDIT
		return msgNoteBodyTutor;
	endIf
	return cscNull
EndIf
If InNavigationPane()
&& (iObjectType==wt_TreeViewItem
|| iObjectType==wt_TreeView)
	return msgTreeView
EndIf
; to announce help message for contacts listview.
If sFocusWindowClass == WC_Rctrl_RenWnd32
	Return (MsgListBox)
EndIf
If OnStatusBarToolBar()
	Return office::GetCustomTutorMessage()
EndIf
return GetCustomTutorMessage() ; Call default...
EndFunction

int function SayTutorialHelp(int iObjType, optional int nIsScriptKey)
if getObjectName() == wn_InfoBar return TRUE endIf
return SayTutorialHelp(iObjType, nIsScriptKey)
endFunction

Int Function SayTutorialHelpHotKey (handle hHotKeyWindow, int IsScriptKey)
var
	String sRealWindowName,
	String sShortcut,
	Int iControlID
sRealWindowName = GetWindowName (GetRealWindow (hHotKeyWindow))
iControlID = GetControlID (hHotKeyWindow)
; To announce the hotkeys for the fields in new meeting, new appointment and new journal dialogues...
If StringContains (sRealWindowName, scMeetingDialog)
|| StringContains (sRealWindowName, scAppointmentDialog)
|| StringContains (sRealWindowName, scJournalDialogue)
	sShortcut = GetCurrentObject (0).accKeyboardShortcut
	If !StringIsBlank (sShortcut)
		Say (sShortcut, OT_ACCESS_KEY)
		Return TRUE
	EndIf
EndIf
Return (SayTutorialHelpHotKey (hHotKeyWindow, IsScriptKey))
EndFunction

void Function ScreenSensitiveHelpForKnownClasses (int nSubTypecode)
If UserBufferIsActive()
	UserBufferDeactivate()
EndIf
if (nSubTypecode == wt_Supergrid)
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpForKnownClasses1_L, msgScreenSensitiveHelpForKnownClasses1_S)
	AddHotKeyLinks()
	return
endIf
ScreenSensitiveHelpForKnownClasses (nSubTypeCode)
EndFunction

int function ScreenSensitiveHelpForOutlook()
var
	handle hFocus,
	handle hReal,
	string AppWindowName,
	string objectName,
	int iType,
	int IControlID,
	string sHelp_L,
	string sHelp_S
hFocus = GetFocus()
hReal = GetRealWindow(hFocus)
AppWindowName=GetWindowName (GetAppMainWindow (hFocus))
objectName = getObjectName()
IControlID = GetControlID (hFocus)
iType = GetWindowSubtypeCode (GetCurrentWindow())
If !iType
	iType = GetObjectSubTypeCode()
EndIf
if stringContains (c_OutlookFocus.RealWindowName, scNoteDialogName)
&& iType == WT_MULTILINE_EDIT
	showScreenSensitiveHelp (msgScreenSensitiveHelpNoteBody)
	Return true
endIf
If InNavigationPane()
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp_NavigationPane)
	AddHotKeyLinks()
	return true
EndIf
if StringContains (c_OutlookFocus.RealWindowName, scOutlookTodayDialogName )
	SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp2_l, msgScreenSensitiveHelp2_S)
	AddHotKeyLinks()
	return true
EndIf
; Grid view list for Contact, Message, Appointment, Tasks, and notes lists.
If iControlId==id_GridView
|| StringContains (AppWindowName, scContactsList1)
|| StringContains (AppWindowName, scTaskList1)
	If  StringContains(getObjectValue (),scAppointmentsItem)
		sHelp_L=FormatString(cMsgScreenSensitiveHelpAppointmentList_L, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		sHelp_S=FormatString(cMsgScreenSensitiveHelpAppointmentList_S, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
	ElIf  StringContains(objectName,scContactItem)
		sHelp_L=FormatString(cMsgScreenSensitiveHelpContactList_L, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		sHelp_S=FormatString(cMsgScreenSensitiveHelpContactList_S, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
	ElIf StringContains (AppWindowName, scTaskList1)
	|| StringContains (AppWindowName, scToDoList1)
		sHelp_L=FormatString(cMsgScreenSensitiveHelpTaskList_L, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		sHelp_S=FormatString(cMsgScreenSensitiveHelpTaskList_S, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
	ElIf StringContains(c_OutlookFocus.RealWindowName,scNotesItem)
		sHelp_L=FormatString(cMsgScreenSensitiveHelpNoteList_L, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		sHelp_S=FormatString(cMsgScreenSensitiveHelpNoteList_S, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
	ElIf StringContains(objectName,scMessageItem)
	; or on an empty folder, look for column name Subject:
	|| objectName == scMessageItemEmptyFolder2013
	|| StringContains (objectName, scSubject)
		sHelp_L=FormatString(cMsgScreenSensitiveHelpMessageList_L, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		sHelp_S=FormatString(cMsgScreenSensitiveHelpMessageList_S, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayMSAADataScript), GetScriptKeyName(csnAdjustJAWSVerbosityScript))
		If BrailleInUse()
			sHelp_L = sHelp_L+cscBufferNewLine+cscBufferNewLine+
				MsgBrlMessageListHelp_L
			sHelp_S = sHelp_S+cscBufferNewLine+cscBufferNewLine+
				MsgBrlMessageListHelp_S
		EndIf
	EndIf
	SayMessage(OT_USER_BUFFER, sHelp_L, sHelp_S)
	AddHotKeyLinks()
	Return true
EndIf ; End of grid view list.
; Message body...
If StringContains(c_OutlookFocus.RealWindowName,scMessage)
	; Message header fields...
	; for the message header controls
	If iControlId == id_from_field 
		sHelp_L=cMsgFromFieldHelp_L
		sHelp_S=cMsgFromFieldHelp_S
	ElIf iControlId == id_Sent_field
		sHelp_L=cMsgSentFieldHelp_L
		sHelp_S=cMsgSentFieldHelp_S
	ElIf iControlId == id_To_field
		sHelp_L=cMsgToFieldHelp_L
		sHelp_S=cMsgToFieldHelp_S
	ElIf iControlId == id_Cc_field
		sHelp_L=cMsgCCFieldHelp_L
		sHelp_S=cMsgCCFieldHelp_S
	ElIf iControlId == id_Subject_field
		sHelp_L=cMsgSubjectFieldHelp_L
		sHelp_S=cMsgSubjectFieldHelp_S
	ElIf iControlId == id_To_Button
		sHelp_L=cMsgToButtonHelp_L
		sHelp_S=cMsgToButtonHelp_S
	ElIf iControlId == id_CC_Button
		sHelp_L=cMsgCCButtonHelp_L
		sHelp_S=cMsgCCButtonHelp_S
	endIf
	SayFormattedMessage (OT_USER_BUFFER, sHelp_L, sHelp_S)
	AddHotKeyLinks()
	return true
EndIf ; End of Message
If OnStatusBarToolBar()
	SayFormattedMessage (OT_USER_BUFFER, msgStatusBarToolBarTutorialHelp)
	AddHotKeyLinks()
	Return true
EndIf
If inCalendar()
	sHelp_L=FormatString(msgScreenSensitiveHelp3a_L, GetScriptKeyName(csnSayPriorCharacterScript),
	GetScriptKeyName(csnSayNextCharacterScript), GetScriptKeyName(csnSayPriorLineScript),
	GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnJAWSHomeScript),
	GetScriptKeyName(csnJAWSEndScript),  GetScriptKeyName(csnSayLineScript))
	sHelp_L=sHelp_L+cScBufferNewLine+FormatString(msgScreenSensitiveHelp3b_L, cscNull, ;item is also removed from message
		GetScriptKeyName(csnTabKeyScript),		GetScriptKeyName(csnShiftTabKeyScript),
		GetScriptKeyName(csnSayPriorLineScript), 		GetScriptKeyName(csnSayNextLineScript),GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayWindowPromptAndTextScript))
	sHelp_S=FormatString(msgScreenSensitiveHelp3a_S, GetScriptKeyName(csnSayPriorCharacterScript),
		GetScriptKeyName(csnSayNextCharacterScript), GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript),
		GetScriptKeyName(csnJAWSHomeScript), GetScriptKeyName(csnJAWSEndScript),  GetScriptKeyName(csnSayLineScript))
	sHelp_S=sHelp_S+cScBufferNewLine+FormatString(msgScreenSensitiveHelp3b_S, cscNull, ;item is also removed from message
		GetScriptKeyName(csnTabKeyScript),		GetScriptKeyName(csnShiftTabKeyScript),
		GetScriptKeyName(csnSayPriorLineScript), 		GetScriptKeyName(csnSayNextLineScript),GetScriptKeyName(csnEnterScript),
		GetScriptKeyName(snSayWindowPromptAndTextScript))
	SayMessage(OT_USER_BUFFER, sHelp_L, sHelp_S)
	AddHotKeyLinks()
	return true
EndIf
; Calendar's Active Appointment list
if StringContains (AppWindowName, wn_Calendar)
&& IControlID == id_GridView
	sHelp_L=FormatString(msgScreenSensitiveHelp4, GetScriptKeyName(csnSayPriorLineScript),
		GetScriptKeyName(csnSayNextLineScript), GetScriptKeyName(csnSayLineScript), GetScriptKeyName(csnEnterScript))
	SayFormattedMessage(OT_USER_BUFFER,sHelp_L)
	AddHotKeyLinks()
	return true
EndIf
; Reminder window...
If FindDescendantWindow(hReal,id_app_AllAttendeesStatus)
&& (StringContains(c_OutlookFocus.RealWindowName,scMeetingDialog)
|| StringContains(c_OutlookFocus.RealWindowName,scAppointmentDialog))
	; in the Appointment scheduling dialog
	sHelp_L=FormatString(msgScreenSensitiveHelpAppointmentScheduler_L)
	sHelp_S=FormatString(msgScreenSensitiveHelpAppointmentScheduler_S)
	SayMessage(OT_USER_BUFFER, sHelp_L, sHelp_S)
	AddHotKeyLinks()
	Return true
EndIf
; Correct tutor help in the send/Recieve group...
If StringContains (c_OutlookFocus.RealWindowName, wn_SendReceiveSettings)
&& iControlID == id_AccountsList
&& iType == WT_LISTBOXITEM
	ScreenSensitiveHelpForKnownClasses (WT_LISTBOX)
	Return true
EndIf
return false
EndFunction

Script ScreenSensitiveHelp()
if IsSameScript()
	AppFileTopic(topic_outlook)
	return
endIf
If gbWordIsWindowOwner
	PerformScript ScreenSensitiveHelp()
	Return
EndIf
if IsVirtualRibbonActive()
	If GlobalMenuMode == MENUBAR_ACTIVE
	 	ShowScreenSensitiveHelpForVirtualRibbon(true)
	ElIf GlobalMenuMode == MENU_ACTIVE
		ShowScreenSensitiveHelpForVirtualRibbon(false)
	EndIf
	Return
EndIf
if inRibbons()
	PerformScript ScreenSensitiveHelp()
	Return
EndIf
if GlobalMenuMode 
	if GlobalMenuMode == 2
		ScreenSensitiveHelpForKnownClasses (WT_MENU)
	else
		ScreenSensitiveHelpForKnownClasses (WT_MENUBAR)
	EndIf
	return
EndIf
if ScreenSensitiveHelpForJAWSDialogs()
	return
EndIf
If UserBufferIsActive()
 UserBufferDeactivate()
 SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
 Return
EndIf
if ScreenSensitiveHelpForOutlook()
	return
endIf
PerformScript ScreenSensitiveHelp()
EndScript

Script HotKeyHelp()
if TouchNavigationHotKeys()
	return
endIf
If gbWordIsWindowOwner
	PerformScript HotKeyHelp()
	Return
EndIf
If UserBufferIsActive()
	If StringContains (UserBufferGetText(), FormatString(cMsgHotKeysLink))
	&& GetCurrentScriptKeyName() == cKsEnter
		If (! JAWSHotKeys())
			GeneralJAWSHotKeys()
		EndIf
		Return
	EndIf
	UserBufferDeactivate()
EndIf
if inHJDialog()
	performScript HotKeyHelp()
	return
EndIf
var
	Handle hFocus,
	handle hReal,
	Int iObjectType,
	int iWinType,
	string sTemp_L,
	string sTemp_S,
	String sParentWindowClass
sTemp_L =msgHotKeyHelp1_L+cScBufferNewLine
sTemp_S =msgHotKeyHelp1_S+cScBufferNewLine
hFocus = GetFocus()
hReal = GetRealWindow (hFocus)
iObjectType = GetObjectSubTypeCode()
If !DialogActive()
&& IsInOutlookMainWindow()
	sParentWindowClass = GetWindowClass (GetParent (hFocus))
	If c_OutlookFocus.FolderType == MailFolderType
	&& c_OutlookFocus.ControlID == id_GridView
	&& sParentWindowClass == wc_Rctrl_RenWnd32
		sTemp_L = sTemp_L+cscSpace+cMsgHotKeyHelpMessageList_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
		sTemp_S = sTemp_S+cscSpace+cMsgHotKeyHelpMessageList_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
	ElIf c_OutlookFocus.FolderType == AppointmentFolderType
	&& (iObjectType == WT_TableCell
	|| iObjectType == WT_Table)
	&& (c_OutlookFocus.ControlID == 0
	|| c_OutlookFocus.ControlID == id_CalendarPane)
		If c_OutlookFocus.InCalendar
		&& c_OutlookFocus.WinClassName == wc_WeekViewWnd
			sTemp_L = sTemp_L+cscSpace+ cMsgHotKeyHelpCalendarMonthView_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
			sTemp_S = sTemp_S+cscSpace+ cMsgHotKeyHelpCalendarMonthView_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
		Else
			sTemp_L = sTemp_L+cscSpace+ cMsgHotKeyHelpCalendarNotMonthView_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
			sTemp_S = sTemp_S+cscSpace+ cMsgHotKeyHelpCalendarNotMonthView_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
		EndIf
	ElIf c_OutlookFocus.FolderType == ContactFolderType
	&& c_OutlookFocus.ControlID == id_Contact_List
		sTemp_L = sTemp_L+cscSpace+cMsgHotKeyHelpContactList_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
		sTemp_S = sTemp_S+cscSpace+cMsgHotKeyHelpContactList_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
	ElIf c_OutlookFocus.FolderType == TaskFolderType
	&& c_OutlookFocus.ControlID == id_GridView
		sTemp_L = sTemp_L+cscSpace+cMsgHotKeyHelpTaskList_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
		sTemp_S = sTemp_S+cscSpace+cMsgHotKeyHelpTaskList_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
	ElIf c_OutlookFocus.FolderType == NotesFolderType
	&& iObjectType == WT_LISTVIEW
		sTemp_L = sTemp_L+cscSpace+cMsgHotKeyHelpNoteList_L + cScBufferNewLine + cMsgHotKeyHelpChangeViews_L
		sTemp_S = sTemp_S+cscSpace+cMsgHotKeyHelpNoteList_S + cScBufferNewLine + cMsgHotKeyHelpChangeViews_S
	ElIf InNavigationPane()
		sTemp_L = sTemp_L+cscSpace+cMsgHotKeyHelpNavigationPane_L
		sTemp_S = sTemp_S + cscSpace + cMsgHotKeyHelpNavigationPane_S
	ElIf c_OutlookFocus.ControlID == id_GridView
	&& sParentWindowClass == WC_NetUICtrlNotifySink
		sTemp_L = sTemp_L+cscSpace+cMsgHotKeyHelpTaskList_L
		sTemp_S = sTemp_S+cscSpace+cMsgHotKeyHelpTaskList_S
	ElIf (c_OutlookFocus.ControlID == id_CalendarPane
	|| c_OutlookFocus.ControlID == 0)
	&& c_OutlookFocus.WinClassName == wc_AfxWndW
	&& iObjectType == WT_READONLYEDIT
		sTemp_L = sTemp_L+cscSpace+cMsgHotKeyHelpAppointmentList_L
		sTemp_S = sTemp_S+cscSpace+cMsgHotKeyHelpAppointmentList_S
	EndIf
	SayMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	SayFormattedMessage(OT_USER_BUFFER, cscBufferNewLine+msgAskFSCompanionHotKeyLink)
	AddHotkeyLinks()
	Return
EndIf
if DialogActive()
	if (c_OutlookFocus.RealWindowName== scSpellingDialogName) 
		sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp2_L
		sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp2_S
		SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
		AddHotkeyLinks()
		return
	EndIf
EndIf
if (StringContains (c_OutlookFocus.RealWindowName, scNoteDialogName))
	;Only add here if in a note:
	if getWindowSubtypeCode (getFocus()) == WT_MULTILINE_EDIT
		sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp3_L
		sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp3_S
	endIf
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	return
elif (StringContains (c_OutlookFocus.RealWindowName, scTasks))
	sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp4_L
	sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp4_S
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	return
elif (StringContains (c_OutlookFocus.RealWindowName, sc_OutlookMessageDialog))
	sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp6_L
	sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp6_S
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	SayFormattedMessage(OT_USER_BUFFER, cscBufferNewLine+msgAskFSCompanionHotKeyLink)
	AddHotkeyLinks()
	return
EndIf
if (StringContains (c_OutlookFocus.RealWindowName, wn_Calendar))
	If c_OutlookFocus.InCalendar
		sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp5_L
		sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp5_S
	ElIf c_OutlookFocus.ControlID == id_GridView
		sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp10_L
		sTemp_S = sTemp_S+cscSpace+msgHotKeyHelp10_S
	EndIf
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	return
EndIf
if (StringContains (c_OutlookFocus.RealWindowName, scContactsList1))
	sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp7_L
	sTemp_s = sTemp_S+cscSpace+msgHotKeyHelp7_S
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	Return
EndIf
If FindDescendantWindow(hReal,id_app_AllAttendeesStatus)
	; in the Appointment scheduling dialog
	sTemp_L = sTemp_L+cscSpace+msgHotKeyHelpAppointmentScheduler_L
	sTemp_S = sTemp_S+cscSpace+msgHotKeyHelpAppointmentScheduler_L
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	Return
EndIf
; in the Meeting/Appointment scheduling dialog
If  StringContains(c_OutlookFocus.RealWindowName,scMeetingDialog)
|| StringContains(c_OutlookFocus.RealWindowName,scAppointmentDialog)
	sTemp_L = sTemp_L+cscSpace+msgHotKeyHelpAppointmentScheduler_L
	sTemp_S = sTemp_S+cscSpace+msgHotKeyHelpAppointmentScheduler_S
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	Return
EndIf
if StringContains (c_OutlookFocus.RealWindowName, scContactItem)
|| StringContains(c_OutlookFocus.RealWindowName,wn_Appointment)
	sTemp_L = sTemp_L+cscSpace+msgHotKeyHelp7_L
	sTemp_s = sTemp_S+cscSpace+msgHotKeyHelp7_S
	SayFormattedMessage (OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotkeyLinks()
	Return
EndIf
PerformScript HotKeyHelp()
EndScript

Script WindowKeysHelp()
if !getRunningFSProducts() & product_JAWS
	return
endIf
If UserBufferIsActive()
	UserBufferDeactivate()
EndIf
if c_OutlookFocus.RealWindowName == scSpellingDialogName
	SayFormattedMessage (OT_USER_BUFFER, cmsgWindowKeysHelpOfficeQuickSearch+cscBufferNewLine+msgWindowKeysHelp1_L,
	cmsgWindowKeysHelpOfficeQuickSearch+cscBufferNewLine+msgWindowKeysHelp1_S)
	AddHotkeyLinks()
	return
EndIf
SayFormattedMessage (OT_USER_BUFFER, cmsgWindowKeysHelpOfficeQuickSearch+cscBufferNewLine+msgWindowKeysHelp2_L, 
cmsgWindowKeysHelpOfficeQuickSearch+cscBufferNewLine+msgWindowKeysHelp2_S)
AddHotkeyLinks()
EndScript

Script RunJAWSManager()
gbUsingWordNavQuickKeys = gbWordIsWindowOwner
PerformScript RunJAWSManager()
EndScript

void function RunNavQuickKeysManager()
if gbUsingWordNavQuickKeys
	NavigationQuickKeysManager (2)
else
	NavigationQuickKeysManager (0)
EndIf
EndFunction

string function QuickSettingDisabledEvent (string settingID)
var
	string setting = stringSegment (settingID, ".", -1)
if Setting == "ListNestingLevelAnnouncement"
	return qsxmlMakeDisabledSetting (settingID, getJcfOption (OPT_USE_VPC_INSTEAD_OF_ENHANCED_EDIT_FOR_READONLY_DOCS) != 1)
endIf
return QuickSettingDisabledEvent (settingID)
endFunction

void function QuickSettingsPreProcess ()
SetQuickKeyNavigationState (OFF)
QuickSettingsPreProcess ()
EndFunction

void function QuickSettingsPostprocess ()
QuickSettingsPostprocess ()
InitVerbosityCollection()
SetVirtualViewerVisibility()
EndFunction

Script ScriptFileName()
ScriptAndAppNames (msgMsOutlook2013)
EndScript

Script MoveToNextEmail()
ProcessMoveToEmail(s_Next)
EndScript

Script MoveToPriorEmail()
ProcessMoveToEmail(s_Prior)
EndScript

script ReadEmailFromField()
; This script will read the from field in the email header
if IsSameScript() then
	if !MoveToCurrentEmailFromLine() then
		PerformScript ReadOutlookHeader(1)
		return
	EndIf
	SayLine()
	return
EndIf
if IsReadOnlyMessage() then
	var string sentBy
	sentBy = GetEmailHeaderSentBy()
	if !StringIsBlank(sentBy) then
		BeginFlashMessage()
		SayMessage(OT_USER_REQUESTED_INFORMATION, sentBy)
		EndFlashMessage()
		return
	endIf
endIf
PerformScript ReadOutlookHeader(1)
EndScript

script ReadEmailDateField()
; This script will read the date field in the email header
if IsSameScript() then
	if !MoveToCurrentEmailSentLine() then
		PerformScript ReadOutlookHeader(1)
		return
	EndIf
	SayLine()
	return
EndIf
if IsReadOnlyMessage() then
	var string sentAt
	sentAT = GetEmailHeaderSentAt()
	if !StringIsBlank(sentAt) then
		BeginFlashMessage()
		SayMessage(OT_USER_REQUESTED_INFORMATION, sentAT)
		EndFlashMessage()
		return
	endIf
endIf
PerformScript ReadOutlookHeader(2)
EndScript

int function IsCustomizeListViewApplicable(handle hWnd)
If  InMessageList()
|| InCalendar()
|| InContactsList()
	return false
endIf
return IsCustomizeListViewApplicable(hWnd)
EndFunction

script JAWSDelete()
if InMessageList()
	TypeKey(cksDelete)
	SetDeleteEventWaitTimer()
	return
endIf
PerformScript JAWSDelete()
EndScript

script JAWSShiftDelete()
if InMessageList()
	TypeKey(cksShiftDelete)
	SetDeleteEventWaitTimer()
	return
endIf
TypeKey(cksShiftDelete)
EndScript

script JAWSDeleteItem()
if InMessageList()
	TypeKey(ksDeleteItem)
	SetDeleteEventWaitTimer()
	return
endIf
TypeKey(ksDeleteItem)
EndScript

void function SayWordUnit(int UnitMovement)
if GetObjectAutomationId () == id_SearchTextBox
&& !IsLeftButtonDown ()
&& !IsRightButtonDown()
	SayWord()
	return
endIf
SayWordUnit(UnitMovement)
EndFunction

script ReadListviewColumn()
if IsTrueListView(getCurrentWindow())
	PerformScript ReadListviewColumn()
	return
endIf	
var
	int nCol = StringToInt(stringRight(GetCurrentScriptKeyName(),1)),
	int nMaxCols=c_MessageListItem.ColumnCount,
	variantArray a = c_MessageListItem.Cells,
	string sText,
	string sHeader
if !c_OutlookFocus.IsMessagesList
	sayMessage(OT_ERROR,msgNotInMessageList_L,msgNotInMessageList_S)
	return
endIf
if (nCol==0)
	nCol=10
elIf (nCol < 1)
	nCol=1
endIf
if (nCol > nMaxCols)
	SayFormattedMessage(OT_ERROR,formatString(cmsgListviewContainsXColumns_L,intToString(nCol),intToString(nMaxCols)),formatString(cmsgListviewContainsXColumns_S,intToString(nCol)))
	return
endIf
sHeader = a[nCol].TableColumnHeader
sText = a[nCol].Name
BeginFlashMessage ()
say(sHeader, OT_USER_REQUESTED_INFORMATION)
say(sText, OT_USER_REQUESTED_INFORMATION)
EndFlashMessage ()
endScript

Void Function NameChangedEvent (handle hwnd, int objId, int childId, int nObjType,
	string sOldName, string sNewName)
if c_OutlookFocus.inCalendar
	if FocusChangeTriggeredByMoveToTopOrBottomOfColumn
		return;prevent speaking of wrong day when using ALT+PageUp or ALT+PageDown to move by month
	endIf
	var object oFocus = FSUIAGetFocusedElement ()
	if sNewName == oFocus.name
		return;prevent double speaking when using arrow keys to navigate calendar
	endIf
endIf
NameChangedEvent (hwnd, objId, childId, nObjType, sOldName, sNewName)
EndFunction

handle function GetReadingPaneWindow()
var
handle readingPaneWindow = FindWindowWithClassAndId (GetAppMainWindow(GetFocus()), "_WwG", 0)
if readingPaneWindow then
	return readingPaneWindow
else
	return 0
endIf 
endFunction

string function GetReadingPaneText()
var 
object doc,
string text,
handle readingPaneWindow=GetReadingPaneWindow()

if !readingPaneWindow then
	return cscNull
endIf
doc=CreateUIAElementFromWindow(readingPaneWindow)
text=GetTextFromDocumentRange(doc)

return text
endFunction

string function BrailleGetTextForSplitMode()
var
string text
if getWindowClass (GetFocus()) == "OutlookGrid" 
	text = GetReadingPaneText()
	if text!=cscNull then
		giBrlShowMessagePreview=2 ; now showing
		return text
	else
		giBrlShowMessagePreview=1 ; enabled but not currently showing
		return cscNull
	endIf  
else
	return CSCNull ; so internal logic gets it.
endIf
endFunction

void function ShowOrHideBrlReadingPane()
var
string windowClass

windowClass=GetWindowClass(getFocus())
if (windowClass == "OutlookGrid" || windowClass == "SUPERGRID") then
	if giBrlShowMessagePreview && GetReadingPaneWindow() then 
		BrailleSplitMode(brlSplitBufferedDocument)
	endIf
elif giBrlShowMessagePreview==2 && BrailleGetSplitMode()==brlSplitBufferedDocument then
	BrailleSplitMode(brlSplitOff)
	giInitialSplitModeValue = brailleGetSplitMode()
		giBrlShowMessagePreview=1; enabled but not currently showing.
	endIf
endFunction

int function SwitchToScriptedAppView(int scriptedAppViewIndex)
; This function should be overridden in an app's script set to control a scripted Braille view.
var int enabled,
int changed
if giBrlShowMessagePreview > 0 then
	enabled=1
else
	enabled=0
endIf
changed=scriptedAppViewIndex!=enabled
giBrlShowMessagePreview  =! enabled
ShowOrHideBrlReadingPane()
return changed
endFunction

int function GetScriptedAppViewIndex()
; return a 1-based index of the active scripted view.
; If no active scripted view, return 0 so it is no longer highlighted.
if giBrlShowMessagePreview then
	return 1
else
	return 0
endIf
endFunction

string function GetScriptedAppViews()
;Override this in an app's script set to return a delimited list of scripted views. e.g. "Message list + message preview|..."
; In our case we'll just have one view but change it from on to off.
; Note that the message pane must be visible or we can't provide the view.
if GetReadingPaneWindow() ==0 then
	giBrlShowMessagePreview =false
	return cscNull ; can't provide scripted ap view if pane is not visible.
endIf

if giBrlShowMessagePreview then
	return FormatString(msgMessageHeadersPlusPreview, cmsgOn)
else
	return FormatString(msgMessageHeadersPlusPreview, cmsgOff)
endIf
endFunction

int function ShouldIncludeView(string viewName)
if viewName == cOutlookClassicJBSBase then
return false
endIf
if viewName == cOutlook2007JBSBase then
return false
endIf
if viewName == cOutlook2010JBSBase then
return false
endIf

return true
endFunction 

int function IsBrailleSplitMessagePreviewActive()
var
string windowClass

windowClass=GetWindowClass(getFocus())
if (windowClass != "OutlookGrid" && windowClass != "SUPERGRID") then
	return false
endIf
return 	giBrlShowMessagePreview && GetReadingPaneWindow() 
endFunction

void function BrailleSplitModeChangedEvent()
giOutlookSplitModeValue=BrailleGetSplitMode()
if BrailleGetSplitMode()==brlSplitOff then
	giBrlShowMessagePreview =0 ; User has turned off all split modes!
endIf
; update the giInitialSplitModeValue since we're changing views, but only if not changing to an app specific view.
if !IsBrailleSplitMessagePreviewActive() then
	giInitialSplitModeValue=giOutlookSplitModeValue
endIf
endFunction

int function AppAllowedToChangeSplitMode()
; Must have this test first as the scripted view uses buffered mode.
if giBrlShowMessagePreview then
	return true
endIf
; if brlSplitBufferedDocument no  one but the user should change it.
return brailleGetSplitMode() != brlSplitBufferedDocument
endFunction

Script MoveToBottomOfColumn()
if !c_OutlookFocus.InCalendar
	PerformScript MoveToBottomOfColumn()
endIf
FocusChangeTriggeredByMoveToTopOrBottomOfColumn = true
TypeCurrentScriptKey ()
SayCurrentScriptKeyLabel ()
EndScript

Script MoveToTopOfColumn()
if !c_OutlookFocus.InCalendar
	PerformScript MoveToTopOfColumn()
endIf
FocusChangeTriggeredByMoveToTopOrBottomOfColumn = true
TypeCurrentScriptKey ()
SayCurrentScriptKeyLabel ()
EndScript

void function VirtualCursorSynchronizedEvent()
var int type = GetObjectSubtypeCode()
If type >= wt_link && type <= wt_ImageMap_link return endIf
VirtualCursorSynchronizedEvent()
EndFunction

string function GetFocusedAttachmentFileName()	
if GetObjectClassName () != objn_AttachmentButtonFocusable
	return cscNull
endIf

var object oFocus = FSUIAGetFocusedElement ()
if oFocus
	return StringRegexMatch(oFocus.Name, "(.+\\.[a-zA-Z0-9]+)(?:\\s|$)")
endif
return cscNull
EndFunction

int function SaveSelectedAttachment (string filePath)
var
	object oSelection,
	object oMailItem,
	object oAttachment
	
if !OmOutlook return false endif
oSelection = OmOutlook.ActiveExplorer.Selection
if !oSelection && oSelection.Count != 1 return false endif
oMailItem = oSelection.Item(1)
if !oMailItem return false endIf
var int attachmentCount = oMailItem.Attachments.Count
if attachmentCount == 0 return false endif
var string focusedAttachmentFileName = GetFocusedAttachmentFileName()
if !focusedAttachmentFileName return false endif
var int i
for i = 1 to attachmentCount
	oAttachment = oMailItem.Attachments(i)
	if oAttachment
		var string fileName = oAttachment.FileName
		if fileName == focusedAttachmentFileName
			oAttachment.SaveAsFile(filePath)
			ComRelease(oAttachment, TRUE)
			ComRelease(oMailItem, TRUE)
			ComRelease(oSelection, TRUE)
			return true
		endif
		ComRelease(oAttachment, TRUE)
	endif
endFor
ComRelease(oMailItem, TRUE)
ComRelease(oSelection, TRUE)
return false
EndFunction

Script PictureSmartSelectedAttachment(optional int serviceOptions)
var
	int result = OCRResult_Success,
	string question = cscNULL
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if !IsPictureSmartEnabled() then
	Return
endif

if(serviceOptions & PSServiceOptions_AskPrelim) then
	if !PictureSmartPromptPreliminaryQuestion(question) then
		return
	EndIf
EndIf

result = IsTelemetryEnabled(TRUE);
If result == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif result != PSResult_Success then
	; no message needed since the function prompts
	return
EndIf

var string filename = GetTemporaryFilePath()
if !SaveSelectedAttachment(filename)
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_nofileselected)
	return
endif

result = DescribeFile(filename, serviceOptions, question)
DeleteFile(filename)
If result == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
ElIf result == PSResult_NoFileSelected then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_nofileselected)
ElIf result == PSResult_MultipleFilesSelected then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_multiplefileselected)
ElIf result == PSResult_UnsupportedFileSelected then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_unsupportedformat)
elif result != PSResult_Success then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_failedtostart)
endIf
endScript

Script PictureSmartWithSelectedFile (optional int serviceOptions)
PerformScript PictureSmartSelectedAttachment (PSServiceOptions_Single | serviceOptions)
endScript

Script PictureSmartWithSelectedFileAskPrelim ()
PerformScript PictureSmartWithSelectedFile (PSServiceOptions_AskPrelim)
endScript

Script PictureSmartWithSelectedFileMultiService (optional int serviceOptions)
PerformScript PictureSmartSelectedAttachment (PSServiceOptions_Multi | serviceOptions)
endScript

Script PictureSmartWithSelectedFileMultiServiceAskPrelim ()
PerformScript PictureSmartWithSelectedFileMultiService (PSServiceOptions_AskPrelim)
endScript

script PictureSmartAllInOne (optional int serviceOptions)
if GetObjectClassName () == objn_AttachmentButtonFocusable
	PerformScript PictureSmartWithSelectedFile(serviceOptions)
	return
endIf
PerformScript PictureSmartAllInOne (serviceOptions)
endScript

script PictureSmartAllInOneAskPrelim ()
PerformScript PictureSmartAllInOne(PSServiceOptions_AskPrelim)
endScript

script PictureSmartAllInOneMultiService (optional int serviceOptions)
if GetObjectClassName () == objn_AttachmentButtonFocusable
	PerformScript PictureSmartWithSelectedFileMultiService(serviceOptions)
	return
endIf
PerformScript PictureSmartAllInOneMultiService (serviceOptions)
endScript

script PictureSmartAllInOneMultiServiceAskPrelim ()
PerformScript PictureSmartAllInOneMultiService(PSServiceOptions_AskPrelim)
endScript


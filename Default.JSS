; Copyright 1995-2025 by Freedom Scientific, Inc.
; Freedom Scientific default script file

; If you want to modify default.jss, ensure that the lines for ScriptFileVersion and for ScriptFile do not appear in the default script files saved to your user settings.
; If your user default script file include the ScriptFileVersion line and if that file is migrated to a different version of JAWS,
; JAWS will fail to load the default scripts when its version does not match the JAWS version.
; In general, any time you modify a script file from shared and save into the user area,
; the script file in the user area should only contain the functions or scripts which you wish to customize.
; Your customized scripts and functions should contain only the customized code to be executed,
;  then they should call the script or function from the shared area when the customized situation does not apply.
; By following this set of rules, you greatly minimize the risk of failing to receive updates to the shared scripts.
;Do not localize the following two lines:
ScriptFileVersion 26
ScriptFile "Freedom Scientific Default Script"


Include "HjGlobal.jsh" ; default HJ global variables
Include "hjconst.jsh" ; default HJ constants
include "MSAAConst.jsh"
include "iAccessible2.jsh"
include "UIA.jsh"
include "XMLDom.jsh"
include "FSIMouseSpeech.jsh"
Include "HjHelp.jsh" ; Help Topic Constants
include "locale.jsh"
Include "common.jsm" ; message file
include "MAGic.jsm"
Include "JTController.jsm"
;Next two includes for Personalize Web Setting and other IE info.
include "IECustomSettings.jsh"
include "IE.jsm";For Personalize Web Setting and other IE info.
Include "magic.jsh"
Include "magcodes.jsh"
include "WinStyles.jsh"; Win Style Bits Constants used by the GetWindowStyleBits function
include "ZoomSoftware.jsm" ; for Zoom Software alerts
Include "FSLog.jsh"

use "UIA.jsb"
use "HomeRowWindows.jsb"
use "HomeRowMSAA.jsb"
use "HomeRowUIAObject.jsb"
use "HomeRowXMLDom.jsb"
use "magic.jsb"
use "say.jsb"
use "FSXMLDomFunctions.jsb"
use "touch.jsb"
use "Braille.jsb"
use "FSIMouseSpeech.jsb"
Use "Virtual.jsb"
use "TutorialHelp.jsb"
use "UserBufferTemp.jsb"
use "VKeyboard.jsb";For the Select Symbol To Print dialog.
use "htlib.jsb"
use "ph.jsb"
use "FileIO.jsb"	; CollectionToFile and FileToCollection (ini-style).
use "uoSayAllSchemes.jsb"
Use "UserOptions.jsb"
Use "VerbosityCore.jsb"
Use "VoIPHelper.jsb"
use "SkypeWatch.jsb"; Manages Skype Alerts in background.
use "LyncWatch.jsb" ; Skype for Business bakground alerts
use "myExtensions.jsb"
use "LiveResourceLookup.jsb"
Use "QuickSet.jsb" ; For Quick Settings functions / callbacks.
Use "deprecated.jsb" ;speak messages about deprecated script functions
use "SmartNav.jsb"
use "FSLog.jsb"
use "ZTUtil.jsb"
use "FaceInViewFunc.jsb"

Const
; UT_OutputModes
	UT_SayTypeAndText = 0,
	UT_FOCUS = 1,
	UT_CONTROLID = 2,
	UT_CLASS = 3,
	UT_TYPE = 4,
	UT_SUBTYPE = 5,
	UT_REALNAME = 6,
	ut_ObjectName = 0,
	ut_ObjectType = 1,
	ut_ObjectSubType = 2,
	ut_ObjectValue = 3,
	ut_ObjectState = 4

Globals
	string priorTopLineOfNewContent, ; Used to determine where to read when a webpage updates.
;for a short time after a focus change away from the JAWS find dialog, we want to keep OCR text available.
	int JAWSFindComplete,
; for AdjustMAGicOptions dialog box:
	int gbSupportsMAGicOptions,
;For scheduling mouse wheel speech.
	int giFN_SpeakMagLevelMessage,
	int giMagLevel,
;prevents multiple requests for OCRLanguages
	string gstrOCRLangStrings,
;For enabling touch mode specific gestures
	int gbPerModeGesturesEnabled,
; Used by the ShouldDoDeleteSayCharacterAfterDelete function.
	IntArray g_ShouldSayCharacterAfterDeleteArray

;For KeyboardLayoutChanged,
;Update and set by script and event:
const
	DelayWhileKeyboardInputSwitching = 10
globals
	int gbKeyboardLayoutChange,
	int ActiveLangId,
	string ActiveLayoutName

CONST
; for Zoom Software Alerts:
	ZoomNotificationWindowClass = "zoom_acc_notify_wnd"


globals
; for TalkToJAWS keystroke, schedule internal function so that double press of the keystroke won't accidentally make it happen.
; Double Press = ToggleWakeWordSetting script function instead.
	int GlobalTalkToJAWSTimer,
; For the RepeatLastNotification keystroke insert+Space&N
	string LastSpokenNotificationForRepeat,
	; We want to no when the last notification occurred, so we don't repeat ourselves endlessly.
	int LastSpokenNotificationTickCount,
	; Is Notification Manager enabled?
	int g_NotificationManagerEnabled,
	;globals for limiting notifications from SnippingTool:
	int giScheduledUIANotification,
	string gsUIANotificationDisplayString,
	string gsUIANotificationAppName

globals
; for page elements announcement on page load, from same name in NonJCFOptions section.
	int GlobalAnnouncePageElementsOnLoad,
; for the sound when entering a spelling mistake by typing:
	string globalProofingErrorEnteredSound,
	string globalProofingErrorExitedSound,
; for the sound when Microsoft automattically makes a correction when you type:
	string globalAutocorrectSound,
; for Commands Search when Touch Cursor is on,
; so we turn it off, run the search, and then restore it once you exit.
	int g_WasTouchCursorActiveBeforeJAWSSearch,
;The virtual cursor must be active for the JAWS search,
;so it is handled similarly to the touch cursor for pre and post JAWS search management:
	int g_VirtualPCCursorSettingBeforeJAWSSearch,
;For sidebar, do not change.
;Also declared in sidebar.jss, unset upon AutostartEvent there should Sidebar gain focus.
;Do not use elsewhere:
	int gbSideBarCheck,;bool
	int WindowClosed,
; Voice and SayAll globals:
	int globalVoiceChanges,
	string globalVoiceName,
; vars to contain the current setting for each context
	int GlobalPcRate,
	int GlobalPcVolume,
	int GlobalPcPitch,
	int GlobalSayAllRate,
	int GlobalSayAllVolume,
	int GlobalSayAllPitch,
	int GlobalJAWSRate,
	int GlobalJAWSVolume,
	int GlobalJAWSPitch,
	int GlobalKeyboardRate,
	int GlobalKeyboardVolume,
	int GlobalKeyboardPitch,
	int GlobalMessageRate,
	int GlobalMessageVolume,
	int GlobalMessagePitch,
	int GlobalMenuDialogRate,
	int GlobalMenuDialogVolume,
	int GlobalMenuDialogPitch,
	int globalVoiceRate,
	int globalVoiceVolume,
	int globalVoicePitch,
;For SelectAFrame and GetAllFramesText scripts:
	int gbWantAllFrames,
	string gstrFrameText,
	string gstrFrameList,
	int iSavedProgressBarAnnouncementInterval,
; For adding Context Help information to the Screen Sensitive Help message:
	string g_strSSHContextHelp,
; Menu specific:
	string g_strLastMenuName,
	string g_strLastMenuGroupName,
;for setting the scheme back after SayAll scheme was used:
	string gsSavedApplicationScheme,
;timer for the custom page summary:
	int giCustomPageSummarySuppressor,
;timer for speak lost focus (ForegroundIconicEvent)
	int giFN_SpeakLostFocusWindow,
;Timer for invisible, but focused, window - such as Skype invisible or antivirus software (WindowActivatedEvent)
	int giFN_SpeakInvisibleWindow,
; for helper function to DescriptionChangedEvent, make sure caching and real are in sync.
	int giFN_Helper,
;for bringing the Vista error dialog (WerFault.exe) into focus:
	handle ghWndDirectUIWerFault,
	int gbWinVista


;For detecting whether double speaking should be suppressed due to SayNext/PriorLine navigation and some other event also speaking:
const
	NavigationByLineTickThreshold = 200
globals
	int LastLineNavigationTick

;for detecting when to suppress announcement of menu inactive,
;see MenuInactiveProcessed:
const
	MenuInactiveTickToleranceForNonVirtual = 50,
	MenuInactiveTickToleranceForVirtual = 200
globals
; private: OCR document
	int globalDocumentOCR,
	int MenuInactiveTickTime

globals
	string LastBackgroundNotificationText, ; from SkypeWatch and Skype
	handle ghWndAutoCompleteSuggestionList,
	collection InlineTableCellCoordinates

;c_JAWSVersion and c_MAGicVersion are initialized at autostart to cache product version info:
globals
	collection c_JAWSVersion,
	collection c_MAGicVersion

;for announcing Windows 10 notifications:
globals
	handle ghNotificationClassWindow,
; For Zoom Software:
	string zRepeat,
	int ZAlert,
	string zNotificationOutput,
	int zChat,
	int zTimer,
	String zSText

;For managing announcement of deselection in listboxes
const
	ListBoxItemDeselectWaitTime = 2  ;tenths of a second
globals
	int SayLBDeselectedItemScheduleID

;For Windows 10 focusable progress bars and the event for the progress bar change:
const
	FocusableProgressBar_Update_EventPrefix  = "FocusableProgressBar"
globals
	object gUIA_ProgressBarListener,
	collection c_FocusableProgressBar
		; Contains data used by the progress bar listener, and by function to say and show the data in braille.
		; Members are:
		; string value -- The progress bar UIA element range value.
		; int ProgressBarUpdateInterval -- The value retrieved from the JCF option which specifies the minimal interval between announcements of progress bar updates.
		; int prevProgressBarAnnouncementTickCount -- The tick count when the previous progress bar update was announced.

;To queue the function UIAReadBoxInTabOrderCallback, we must use a global treewalker.
;We use UIAReadBoxInTabOrderWindowElement to ensure that reading stops when the treewalker moves outside of the window.
globals
	object UIAReadBoxInTabOrderTreewalker,
	object UIAReadBoxInTabOrderWindowElement

;for the desktop change listener:
const
	fsUIA_Desktop_EventNamePrefix = "Desktop"
globals
	object fsUIA_DesktopChangedListener


globals
; for suppressing volume change notifications:
; corresponds to the IgnoreNotificationsFromVolumeChange NonJCF Option stored in Default and managed by the VolumeControlNotifications script.
	int GlobalIgnoreNotificationsFromVolumeChange

;For Voice Assistant
globals
	string g_voiceAssistant_scheduledPunchline

	globals
	; for SelectNext/PreviousSoundCards scripts
	; We have to wait for the speech driver to switch sound cards,
	; so we need to schedule a function to speak the name of the new sound card
	int GlobalSwitchSoundCardTimerId,
	string GlobalSoundCardName

	globals
		; We need to know if audio was ducked before sound was split
		; 0 = false, 1 = true
	int GlobalAudioDuckingDisabledByRouting,
	; We need to know if sound is routed
	; 0 is false, 1 is true
	int GlobalAudioIsRouted

;A secondary focus may become active for auto suggestion.
;The SecondaryFocusChangedEvent uses a variable to detect whether the secondary focus is becoming active or inactive.
globals
	int giScheduledSaySecondaryFocusSelectedItem,
	int WasSecondaryFocusActive

;A global is used in function VirtualCursorChangedEvent to detect whether the state is actually changing:
globals
	int globalSavedVirtualCursorState

globals
	object goLinksListTetheredViewScenario

const
	DoNotShowMathEditorResultMessageAgain = "DoNotShowMathEditorResultMessageAgain",
	DoNotShowMathViewerResultMessageAgain = "DoNotShowMathViewerResultMessageAgain"

Void Function AutoStartEvent ()
globalSavedVirtualCursorState = IsVirtualPCCursor()
globalSpeakHeaderOnCellChange = TABLE_NAV_NONE
let GlobalSharedDefaultJCFFile = GetSharedSettingsDirectory()+cScDoubleBackSlash+DefaultJCFFile
let GlobalUserDefaultJCFFile = GetUserSettingsDirectory()+cScDoubleBackSlash+DefaultJCFFile
Let gbWinVista = IsWinVista()
let gbSayAllTemporarilyToggledToSAPI = false
let gbAppendedToClipboard = FALSE
let gbPerModeGesturesEnabled = true
let g_JavaIgnoreNextActiveItemChange = 0
let GlobalMousePixel = 3
let g_bShowSoundMixerDiscoveryDialog = true
FrameClearValues ()
VirtualStart ()
If GetRunningFSProducts() & product_JAWS then
	TandemStart()
EndIf
SkypeStart ()
TouchAutoStart()
loadNonJCFOptions () ; for new Quick Settings.
let gbUsingRemotePACMate = UsingRemotePACMateBX()
;Make the following configurable once we have the new Options created.
Let gi_FOCUS_LOSS_TIMER = 30
if DefaultFirstTime == 0
	DefaultFirstTime = 1
endIf
If BrailleInUse () then
	Let GIBrailleActive = on
	BrailleStart ()
	if gbUsingRemotePACMate then
		ScheduleFunction("ShowBrlMsgRemoteModeOn",5)
	EndIf
EndIf
let BackForward=0
let giRestoreFormsModeAfterVirtualizeCPS=FALSE
;For UAC dialog:
if giFN_SpeakInvisibleWindow then
	unScheduleFunction (giFN_SpeakInvisibleWindow)
endIf
InitMouseSpeech()
InitFSProductVersionInfo()
if IsWindows10()
	SpeakAnyVisibleWindowsNotification()
	;c_FocusableProgressBar holds data for progress bar update events, speech and braille:
	if (!c_FocusableProgressBar) c_FocusableProgressBar = new collection endIf
	StartListeningForDesktopChange()
endIf
InitFsUIAReservedGlobal()
globalProofingErrorEnteredSound = readSettingString (SECTION_OPTIONS, hKey_PROOFING_ERROR_ENTERED_SOUND, "", FT_DEFAULT_JCF, rsNoTransient)
globalProofingErrorExitedSound= readSettingString (SECTION_OPTIONS, hKey_PROOFING_ERROR_EXITED_SOUND, "", FT_DEFAULT_JCF, rsNoTransient)
globalAutocorrectSound = readSettingString (SECTION_OPTIONS, hKey_AUTO_CORRECT_SOUND, "", FT_DEFAULT_JCF, rsNoTransient)
g_NotificationManagerEnabled = IsNotificationManagerEnabled()
if IsZoomTextRunning()
	InitZTReservedGlobal()
endIf
EndFunction

Void Function AutoFinishEvent ()
;Put code here that will be triggered when the application is finished.
;It also gets performed when the application is switched from or looses focus, as with ALT+TAB.
;SayFormattedMessage (ot_debug, cmsgDebugAppFinish1_L)
;for focus loss code, during Shut Down or between desktops.
gUIA_ProgressBarListener = Null()
CollectionRemoveAll(c_FocusableProgressBar)
if giFN_SpeakInvisibleWindow then
	unScheduleFunction (giFN_SpeakInvisibleWindow)
endIf
BrailleString (cmsgJAWSUnloaded)
EndFunction

void function InitFSProductVersionInfo()
c_JAWSVersion = new collection
c_MAGicVersion = new collection
var
	int RunningFSProducts,
	string sPath,
	int iMajor,
	int iMinor,
	int iUpdate,
	int iBuild
RunningFSProducts = GetRunningFSProducts()
if RunningFSProducts & product_JAWS
	sPath = GetJAWSDirectory()
	sPath = sPath+"\\jfw.exe"
	GetFixedProductVersion(sPath,iMajor,iMinor,iUpdate,iBuild)
	c_JAWSVersion.major = iMajor
	c_JAWSVersion.minor = iMinor
	c_JAWSVersion.update = iUpdate
	c_JAWSVersion.build = iBuild
else
	c_JAWSVersion.major = 0
	c_JAWSVersion.minor = 0
	c_JAWSVersion.update = 0
	c_JAWSVersion.build = 0
endIf
if RunningFSProducts & product_magic
	var handle hWnd = FindTopLevelWindow(cwc_MAGICUI,cscNull)
	sPath = GetWindowOwner(hWnd)
	GetFixedProductVersion(sPath,iMajor,iMinor,iUpdate,iBuild)
	c_MAGicVersion.major = iMajor
	c_MAGicVersion.minor = iMinor
	c_MAGicVersion.update = iUpdate
	c_MAGicVersion.build = iBuild
else
	c_MAGicVersion.major = 0
	c_MAGicVersion.minor = 0
	c_MAGicVersion.update = 0
	c_MAGicVersion.build = 0
endIf
EndFunction

int function GetJAWSMajorVersionNumber()
return c_JAWSVersion.major
endFunction

int function GetJAWSMinorVersionNumber()
return c_JAWSVersion.minor
EndFunction

int function GetJAWSUpdateVersionNumber()
return c_JAWSVersion.update
EndFunction

int function GetJAWSBuildVersionNumber()
return c_JAWSVersion.build
EndFunction

int function GetMAGicMajorVersionNumber()
return c_MAGicVersion.major
endFunction

int function GetMAGicMinorVersionNumber()
return c_MAGicVersion.minor
EndFunction

int function GetMAGicUpdateVersionNumber()
return c_MAGicVersion.update
EndFunction

int function GetMAGicBuildVersionNumber()
return c_MAGicVersion.build
EndFunction

void function StoreSpokenNotificationForRepeat (string notificationText, optional string appName)
var string appNameToUse = cmsgUnknownApp
if !StringIsBlank(appName) then
	appNameToUse = appName
endIf
if ! stringIsBlank (notificationText)
var int isRepeat = IsRepeatNotification(notificationText)
LastSpokenNotificationForRepeat = notificationText
LastSpokenNotificationTickCount = GetTickCount()
if g_NotificationManagerEnabled && !isRepeat then
	StoreNotification(notificationText, appNameToUse)
endIf
endIf
endFunction

string function GetStoredNotificationText ()
return LastSpokenNotificationForRepeat
endFunction

int function IsRepeatNotification (string notificationText)
var int isRepeat = StringCompare(notificationText, LastSpokenNotificationForRepeat) == 0 && GetTickCount() - LastSpokenNotificationTickCount <= 500
return isRepeat
endFunction

void function StartListeningForDesktopChange()
if IsSecureDesktop()
return
EndIf
fsUIA_DesktopChangedListener = Null()
fsUIA_DesktopChangedListener = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !fsUIA_DesktopChangedListener return false endIf
if !ComAttachEvents(fsUIA_DesktopChangedListener,fsUIA_Desktop_EventNamePrefix) return endIf
var object desktop = fsUIA_DesktopChangedListener.GetRootElement
fsUIA_DesktopChangedListener.AddPropertyChangedEventHandler(UIA_NamePropertyId, desktop, TreeScope_Element)
EndFunction

void function DesktopPropertyChangedEvent(object element, int propertyID, variant newValue)
;we're only listening for the name change to the desktop element,
;so we don't need to test which condition fired this event:
Say(element.name,OT_NO_DISABLE)
EndFunction

void function SpeechOn(optional int wasSynthesizerUnloaded)
var int iSpeechMode = GetDefaultJCFOption (OPT_SPEECH_MODE)
if iSpeechMode
	PerformScript MuteSynthesizer ()
	if wasSynthesizerUnloaded
		SpeechOn(wasSynthesizerUnloaded)
	endIf
else
	SpeechOn(wasSynthesizerUnloaded)
endIf
endFunction

Void Function SpeechToggledEvent (int bSpeechOn)
EndFunction

void  Function VideoToggledEvent(INT bEnabled)
;Because the video may only be toggle when the JTController is in focus,
;this event is only relevant to the JTController scripts.
if bEnabled then
	SayUsingVoice(vctx_message,msgVideoEnabled,ot_status)
	BrailleMessage (msgVideoEnabled)
else
	SayUsingVoice(vctx_message,msgVideoDisabled,ot_status)
	BrailleMessage (msgVideoDisabled)
EndIf
EndFunction

void function ShowBrlMsgRemoteModeOn()
BrailleMessage(cmsgRemoteModeOn_L)
EndFunction

int function IsTableNavSupported()
;The default is to assume that table navigation is supported in the application.
;In an application where table navigation is not supported,
;overwrite this function to return false.
;This will allow table navigation scripts
;to notify the user that table navigation is not supported for the application.
return true
EndFunction

int function TableErrorEncountered(optional int NavType)
var
	int bPost
let bPost = (GetRunningFSProducts() == product_magic
; Now we are causing MAGic to post dialogs only if speech is disabled:
&& isSpeechOff ())
;in applications where table navigation is limited and not all types of navigation is supported,
;use the optional NavType parameter to test for and handle those cases.
if !IsTableNavSupported() then
	if bPost then
		exMessageBox(cMSGTableNavNotSupported_L, cmsgTableNavErrorTitle, IDOK|MB_ICONASTERISK)
	else
		SayMessage (OT_error, cMSGTableNavNotSupported_L, cMSGTableNavNotSupported_S)
	endIf
	return true
endIf
if !InTable() then
	if bPost then
		exMessageBox(cMSGNotInTable_l, cmsgTableNavErrorTitle, IDOK|MB_ICONASTERISK)
	else
		SayMessage (OT_error, cMSGNotInTable_l, cMSGNotInTable_S)
	endIf
	Return true
endIf
return false
endFunction

int function UnitMoveToTableNavDir(int UnitMoveDir)
if UnitMoveDir == UnitMove_Current then
	return TABLE_NAV_NONE
elif UnitMoveDir == UnitMove_Next
|| UnitMoveDir == UnitMove_Prior then
	return TABLE_NAV_HORIZONTAL
elif UnitMoveDir == UnitMove_First
|| UnitMoveDir == UnitMove_Last then
	return TABLE_NAV_ROW_EXTENTS
elif UnitMoveDir == UnitMove_Up
|| UnitMoveDir == UnitMove_Down then
	return TABLE_NAV_VERTICAL
elif UnitMoveDir == UnitMove_Top
|| UnitMoveDir == UnitMove_Bottom then
	return TABLE_NAV_COLUMN_EXTENTS
elif UnitMoveDir == UnitMove_Start
|| UnitMoveDir == UnitMove_End then
	return TABLE_NAV_TABLE_EXTENTS
;we currently don't have a UnitMove that corresponds to TABLE_NAV_SAY_ROW or TABLE_NAV_SAY_COLUMN
else
	return -1
endIf
EndFunction

void Function SayCellEx ()
var
	int Columns, int Rows,
	int iType,
	string sCellText
Let sCellText = GetCell()
Let iType = GetWindowTypeCode(GetCurrentWindow ())
If StringIsBlank (sCellText) then
	if SayCellWhenOnTableBorderOrcaption()
		return
	endIf
	if iType != WT_LINK
	&& iType != WT_BUTTON
	&& iType != wt_Checkbox
	&& iType != wt_RadioButton then
		Let sCellText = cmsgBlank1
		;Ensures that empty form fields still announce as form fields.
		If iType == WT_EDIT
		|| iType == WT_LISTBOX
		|| iType == WT_COMBOBOX then
			Say(GetObjectType (),OT_CONTROL_TYPE)
		EndIf
		SayUsingVoice(VCTX_MESSAGE, sCellText, OT_LINE)
		Return
	EndIf
EndIf
SayCell()
; ameliorate navigation confusion where moving by cell skips cells due to span.
GetCellSpan (Rows, Columns)
if Columns > 1 then
	SayFormattedMessageWithVoice (VCTX_MESSAGE, OT_SCREEN_MESSAGE, cmsgSpansColumns_L, cmsgSpansColumns_S, Columns)
endIf

SpeakRowSpanInfo()
EndFunction

void Function SpeakRowSpanInfo()
var
	int posInSpan,
	int totalSpan
if (!GetRowSpanInfo(posInSpan,totalSpan))
	return
EndIf
SayFormattedMessageWithVoice (VCTX_MESSAGE, ot_JAWS_message, cmsgSpansRows_L, cmsgSpansRows_S, posInSpan,totalSpan)
EndFunction

int function ShouldSpeakTableCellsOnScriptCall(int tableNavDir)
;Return false if an event is used to speak the table cells for table navigation
;to prevent double speaking due to the script calling SpeakTableCells in addition to the event announcing the cells.
if SupportsEditCallbacks () then
	return false;
else
	return true
endIf
EndFunction

int function GetTableCoordinatesForSpeakTableCells(int ByRef nCol, int ByRef nRow, int tableNavDir)
nCol = 0
nRow = 0
return GetEditCellCoordinates(nCol, nRow)
	|| GetCellCoordinates(nCol, nRow)
EndFunction

void function GetRowAndColumnHeadersForSpeakTableCells(int nCol, int nRow, int bMarkedHeader,
	string ByRef sColHeader, string ByRef sRowHeader, string ByRef sColHeaderWithMarkup, string ByRef sRowHeaderWithMarkup)
var
	int bJavaWindow,
	string sLangCodeAbbrev
sRowHeader = cscNull
sColHeader = cscNull
sColHeaderWithMarkup = cscNull
sRowHeaderWithMarkup = cscNull
bJavaWindow = IsJavaWindow (GetCurrentWindow ())
if bJavaWindow
|| nCol > 0
	sRowHeader = GetRowHeader (bMarkedHeader)
endIf
if bJavaWindow
|| nRow > 1
; those rare instances where the header is outside the span of the table, e.g. Outlook Message tables:
|| GetColumnHeader (bMarkedHeader) != getCell () then
	sColHeader = GetColumnHeader (bMarkedHeader)
endIf

var int options=smmGetSpeechMarkupTextOptions(OT_NO_DISABLE)
sLangCodeAbbrev = GetLanguageCodeAtCursor()
sColHeaderWithMarkup = smmMarkupString (sColHeader, options, 0, 0, attrib_Text, cscNull, 0, 0, 0, sLangCodeAbbrev, cscNull)
sRowHeaderWithMarkup = smmMarkupString (sRowHeader, options, 0, 0, attrib_Text, cscNull, 0, 0, 0, sLangCodeAbbrev, cscNull)
EndFunction

int function ShouldSpeakTableHeadersBeforeCellContent()
; 0 = header before content, 1 = content before header.
return GITblHeaderContentOrder == 0
EndFunction

void function SayTableHeadersForSpeakTableCells(int tableNavDir, int nRow, int nCol, int bCellCoordsValid)
;Must use OT_NONHIGHLIGHTED_SCREEN_TEXT instead of OT_SCREEN_MESSAGE to speak the table cells.
;The problem was that customers would turn off screen messages,
;while turning tables to Row.
;So using an output type which will not be accidentally disabled by users.
;In the case of OT_SCREEN_MESSAGE,
;customers disabled this in order to make some websites like Pandora function with less cluttered speech.
;Speaking header info using OT_NONHIGHLIGHTED_SCREEN_TEXT allows them to do so, since it cannot be disabled in Settings Center.
var
	int bMarkedHeader, ;announce marked headers only
	string sColHeader,
	string sRowHeader,
	string sColHeaderWithMarkup,
	string sRowHeaderWithMarkup
bMarkedHeader = (GITblHeaders == TBL_HEADER_MARKED)
GetRowAndColumnHeadersForSpeakTableCells(nCol, nRow, bMarkedHeader, sColHeader, sRowHeader, sColHeaderWithMarkup, sRowHeaderWithMarkup)
if tableNavDir == TABLE_NAV_NONE
&& bCellCoordsValid
	if (GITblHeaders == TBL_HEADER_MARKED && sRowHeader && sColHeader)
	|| GITblHeaders == TBL_HEADER_BOTH
		if sRowHeaderWithMarkup || sColHeaderWithMarkup
			SayUsingVoice (VCTX_MESSAGE, FormatString (cMSGColumnRowHeader, sRowHeaderWithMarkup, sColHeaderWithMarkup),OT_NONHIGHLIGHTED_SCREEN_TEXT, true)
		endIf
	elif (GITblHeaders == TBL_HEADER_MARKED & !sColHeader)
	|| GITblHeaders == TBL_HEADER_ROW
		if sRowHeaderWithMarkup
			SayUsingVoice (VCTX_MESSAGE, sRowHeaderWithMarkup, OT_NONHIGHLIGHTED_SCREEN_TEXT,true)
		endIf
	elif (GITblHeaders == TBL_HEADER_MARKED && !sRowHeader)
	|| GITblHeaders == TBL_HEADER_COL
		if sColHeaderWithMarkup
			SayUsingVoice (VCTX_MESSAGE, sColHeaderWithMarkup, OT_NONHIGHLIGHTED_SCREEN_TEXT, true)
		endIf
	EndIf
elif tableNavDir == TABLE_NAV_VERTICAL
	if GITblHeaders == TBL_HEADER_MARKED
	|| GITblHeaders == TBL_HEADER_BOTH
	|| GITblHeaders == TBL_HEADER_ROW
		if sRowHeaderWithMarkup
			SayUsingVoice (VCTX_MESSAGE, sRowHeaderWithMarkup, OT_NONHIGHLIGHTED_SCREEN_TEXT,true)
		endIf
	endIf
elif tableNavDir == TABLE_NAV_HORIZONTAL
	if GITblHeaders == TBL_HEADER_MARKED
	|| GITblHeaders == TBL_HEADER_BOTH
	|| GITblHeaders == TBL_HEADER_COL
		if sColHeaderWithMarkup
			SayUsingVoice (VCTX_MESSAGE, sColHeaderWithMarkup, OT_NONHIGHLIGHTED_SCREEN_TEXT,true)
		endIf
	endIf
elif tableNavDir == TABLE_NAV_TABLE_EXTENTS
	if sRowHeaderWithMarkup
	|| sColHeaderWithMarkup
		SayUsingVoice (VCTX_MESSAGE, FormatString (cMSGColumnRowHeader, sRowHeaderWithMarkup, sColHeaderWithMarkup),OT_POSITION, true)
	endIf
endIf
EndFunction

void function SayTableCoordinatesForSpeakTableCells(int tableNavDir, int nRow, int nCol, int bCellCoordsValid)
if !bCellCoordsValid return endIf
var	string sMessage
if tableNavDir == TABLE_NAV_NONE
	SayUsingVoice (VCTX_message,FormatString (cMSGColumnAndRow, IntToString (nRow), IntToString (nCol)), ot_position)
elif tableNavDir  == TABLE_NAV_VERTICAL
	if gbDefaultVCursorCellCoordinatesAnnouncement
		sMessage = FormatString (cmsgRowHeaderWithRowCount, IntToString (nRow), intToString(GetTableRowCount()))
		if sMessage
			SayUsingVoice (VCTX_message, sMessage, ot_position)
		endIf
	endIf
elif tableNavDir == TABLE_NAV_HORIZONTAL
	if gbDefaultVCursorCellCoordinatesAnnouncement
		sMessage = FormatString (cmsgColumnHeaderWithColCount, IntToString (nCol), intToString(GetCurrentRowColumnCount ()))
		if sMessage
			SayUsingVoice (VCTX_message, sMessage, ot_position)
		endIf
	endIf
elif tableNavDir == TABLE_NAV_TABLE_EXTENTS
	SayUsingVoice (VCTX_message,FormatString (cMSGColumnAndRow, IntToString (nRow), IntToString (nCol)), ot_position)
endIf
EndFunction

void function SayAnyRowOrColumnCountChangeForSpeakTableCells(int tableNavDir, int nNumRows, int nNumCols, int nPrevNumOfCells)
if tableNavDir  == TABLE_NAV_VERTICAL
|| tableNavDir == TABLE_NAV_COLUMN_EXTENTS
|| tableNavDir == TABLE_NAV_TABLE_EXTENTS
|| tableNavDir == TABLE_NAV_SAY_ROW
	if nNumCols != nPrevNumOfCells
	&& nPrevNumOfCells!=0
		if nNumCols != 1
			SayUsingVoice (VCTX_MESSAGE, FormatString (cMsgTableColumnsChanged, IntToString (nNumCols)), OT_status)
		else
			SayUsingVoice (VCTX_MESSAGE, FormatString (cMsgTableColumnChanged, IntToString (nNumCols)), OT_status)
		endIf
	endIf
elif tableNavDir == TABLE_NAV_SAY_COLUMN
	if nNumRows != nPrevNumOfCells
	&& nPrevNumOfCells!=0
		if nNumRows != 1
			SayUsingVoice (VCTX_MESSAGE, FormatString (cMsgTableRowsChanged, IntToString (nNumRows)), OT_status)
		else
			SayUsingVoice (VCTX_MESSAGE, FormatString (cMsgTableRowChanged, IntToString (nNumRows)), OT_status)
		endIf
	endIf
endIf
EndFunction

void function SayTableExtentLocationForSpeakTableCells(int tableNavDir, int nRow, int nCol, int nNumRows, int nNumCols)
if tableNavDir == TABLE_NAV_ROW_EXTENTS
	if nCol == 1
		SayUsingVoice (VCTX_message, cMSGBeginningOfRow, OT_SCREEN_MESSAGE) ; beginning of row
	elif nCol == nNumCols
		SayUsingVoice (VCTX_message, cMSGEndOfRow, OT_SCREEN_MESSAGE) ;End of row
	endIf
elif tableNavDir == TABLE_NAV_COLUMN_EXTENTS
	if nRow == 1
		SayUsingVoice (VCTX_message, cMSGTopOfColumn, OT_SCREEN_MESSAGE);  Top Of Column
	elif nRow == nNumRows
		SayUsingVoice (VCTX_message, cMSGBottomOfColumn, OT_SCREEN_MESSAGE) ; Bottom of column
	endIf
endIf
EndFunction

Void Function SpeakTableCells (int tableNavDir, int nPrevNumOfCells)
if !ShouldSpeakTableCellsOnScriptCall(tableNavDir)
|| TableErrorEncountered(tableNavDir)
	Return
EndIf
var
	int bCellCoordsValid,
	int nRow,
	int nCol,
	int nNumCols,
	int nNumRows
bCellCoordsValid = GetTableCoordinatesForSpeakTableCells(nCol,nRow,tableNavDir)
nNumCols = GetCurrentRowColumnCount ()
nNumRows = GetTableRowCount ()
if tableNavDir == TABLE_NAV_NONE
	if bCellCoordsValid
		SayTableCoordinatesForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
		if ShouldSpeakTableHeadersBeforeCellContent()
			SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
			SayCellEx ()
		else
			SayCellEx ()
			SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
		endIf
	else
		/*
		In some Java Swing based tables we are not able to get column and row information due
		to limitations in the Java Access Bridge.  This is especially the case if a customized
		cell renderer is used to draw the current cell.  This code block was added to ensure
		that in this case, at least the cell contents would be spoken.
		*
		Before this change, absolutely nothing was spoken if focus landed on a Java Swing
		table cell that used a customized cell renderer or any other table cell for which we
		were unable to obtain the cell coordinates.
		*/
		SayCellEx ()
	endIf
elif tableNavDir  == TABLE_NAV_VERTICAL
	SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
	if ShouldSpeakTableHeadersBeforeCellContent()
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
		SayCellEx ()
	else
		SayCellEx ()
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
	endIf
	SayTableCoordinatesForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
elif tableNavDir == TABLE_NAV_HORIZONTAL
	if ShouldSpeakTableHeadersBeforeCellContent()
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
		SayCellEx ()
	else
		SayCellEx ()
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
	endIf
	SayTableCoordinatesForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
elif tableNavDir == TABLE_NAV_ROW_EXTENTS
	SayTableExtentLocationForSpeakTableCells(tableNavDir, nRow, nCol, nNumRows, nNumCols)
	SayCellEx ()
elif tableNavDir == TABLE_NAV_COLUMN_EXTENTS
	SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
	SayTableExtentLocationForSpeakTableCells(tableNavDir, nRow, nCol, nNumRows, nNumCols)
	SayCellEx ()
elif tableNavDir == TABLE_NAV_TABLE_EXTENTS
	SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
	if ShouldSpeakTableHeadersBeforeCellContent()
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
		SayCellEx ()
		SayTableCoordinatesForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
	else
		SayCellEx ()
		SayTableCoordinatesForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
		SayTableHeadersForSpeakTableCells(tableNavDir, nRow, nCol, bCellCoordsValid)
	endIf
elif tableNavDir == TABLE_NAV_SAY_ROW
	SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
	Say (GetRowText (cscNull, cscNull, cmsgBlank1), OT_line)
elif tableNavDir == TABLE_NAV_SAY_COLUMN
	SayAnyRowOrColumnCountChangeForSpeakTableCells(tableNavDir, nNumRows, nNumCols, nPrevNumOfCells)
	Say (GetColumnText (cscNull, cscNull, cmsgBlank1), OT_line)
endIf
EndFunction

Script JAWSWindow()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
JAWSWindow()
EndScript

Script StartJAWSTaskList ()
; 12-11-98 - TGS - Added this script that basically just calls the built in of the same name.
; Bring up the JAWS Task List Dialog.  This function requires that JAWSTaskList.dll be in the JAWSdirectory
If UserBufferIsActive () then
	UserBufferDeActivate ()
EndIf
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
StartJAWSTaskList()
EndScript

script TouchToggleSelectionMode()
TouchToggleSelectionMode()
EndScript

int function WasSayObjectTypeAndTextExceptionProcessed(optional int nLevel, int includeContainerName)
;This function should only be called from within an overwritten SayObjectTypeAndText,
;to allow default behavior for exceptions known to exist before any application-specific condition testing.
;The app-specific SayObjectTypeAndText should exit if this function returns true.
If InHomeRowMode()
|| !IsPcCursor()
|| UserBufferIsActive()
	SayObjectTypeAndText (nLevel,includeContainerName)
	Return true
EndIf
return false
EndFunction

int function SayCursorMovementException(int UnitMovement, optional int bMoved)
;Return true for conditions that should pass cursor movement management down to the next level JSB file.
;May be used for SayLineUnit, SayWordUnit, SayCharacterUnit, SayPageUpDownUnit, and SpeakHomeEndMovement.
return !IsPCCursor()
	|| UserBufferIsActive()
	|| InHJDialog()
	|| GetMenuMode()
	|| IsFormsModeActive()
	|| IsLeftButtonDown()
	|| IsRightButtonDown()
	|| SupportsEditCallbacks()
	|| RibbonsActive()
EndFunction

void function SpeakHomeEndMovement()
var
	handle hCurrentWindow,
	int iWinType
if !IsPCCursor() then
	return
EndIf
let hCurrentWindow = GetCurrentWindow ()
let iWinType = GetWindowSubTypeCode (hCurrentWindow)
If !iWinType then
	Let iWinType = GetObjectSubTypeCode ()
EndIf
if ((iWinType ==WT_LEFTRIGHTSLIDER || iWinType ==WT_UPDOWNSLIDER) &&
	(GetWindowClass(hCurrentWindow)==cwcIEServer)) then
	; ARIA sliders in Internet explorer do not generate events to update the cached data
	;Thus we must forceably update the cache and wait for the update.
	MSAARefresh()
	delay(1)
	;drop through for normal logic to speak the value
endIf
if IsJavaWindow(hCurrentWindow)
&& !MenusActive() then
	;Because at the time JAWS processes the scripts, Java has not processed the
	;keystroke for the following objects, the responsibility of speaking the object
	;needs to be passed to either ActiveItemChangedEvent or ValueChangedEvent.
	if WT_TABCONTROL == iWinType
	|| WT_UPDOWNSLIDER == iWinType
	|| WT_LEFTRIGHTSLIDER == iWinType
	|| WT_LEFTRIGHTSLIDER == iWinType
	|| WT_TREEVIEW == iWinType
	|| WT_TREEVIEWITEM == iWinType then
		return
	endIf
endIf
if IsSliderControl(iWinType)
	;ValueChangedEvent speaks the slider control if it is not spoken here.
	if ShouldSayFunctionsSpeakSlider (iWinType)
		delay(2)
		SayWord()
	endIf
	return
elif iWinType == WT_TASKBAR then
	delay(2)
	SayWord()
	return
elif iWinType ==wt_TABCONTROL then
	If IsJavaWindow (hCurrentWindow) then
		Return; return here because java will generate an event to speak the item
	EndIf
	; only sayWord if IsMSAAWindow is false because ActiveItemChanged will speak this
	if !IsMSAAWindow(hCurrentWindow) then
		Delay(1)
		sayWord()
		return
	endIf
endIf
EndFunction

void function HomeEndMovement(int UnitMovement)
if UnitMovement == UnitMove_First then
	JawsHome()
ElIf UnitMovement == UnitMove_Last then
	JAWSEnd()
else ;no other movement is valid
	return
EndIf
SpeakHomeEndMovement()
EndFunction

script JAWSHome()
SayCurrentScriptKeyLabel()
HomeEndMovement(UnitMove_First)
EndScript

script Home()
;MAGic scripts do not have JAWS as part of their name
SayCurrentScriptKeyLabel()
HomeEndMovement(UnitMove_First)
EndScript

script TouchHome()
if IsTouchSelectionModeActive()
	PerformScript SelectFromStartOfLine()
else
	Say(cksHome,ot_JAWS_message)
	HomeEndMovement(UnitMove_First)
endIf
EndScript

Script JAWSEnd()
SayCurrentScriptKeyLabel()
HomeEndMovement(UnitMove_Last)
EndScript

Script End()
;MAGic scripts do not have JAWS as part of their name
SayCurrentScriptKeyLabel()
HomeEndMovement(UnitMove_Last)
EndScript

Script TouchEnd()
if IsTouchSelectionModeActive()
	PerformScript SelectToEndOfLine()
else
	Say(cksEnd,ot_JAWS_message)
	HomeEndMovement(UnitMove_Last)
endIf
EndScript

void Function CharacterValueHook (string ScriptName)
if ScriptName == "TouchSayNextCharacter"
&& !IsTouchSelectionModeActive()
	if UIANextCharacter()
		UIASayCharacterValue ()
		return False
	else ;fall back to OSM:
		ScriptName = "SayNextCharacter"
	endIf
endIf
if ScriptName == "SayNextCharacter"
	NextCharacter ()
	if GetWindowClass (GetFocus()) == cwc_Scintilla
		if !IsKeyWaiting ()
			ScheduleFunction ("SayCharacterValue", 1, true)
		endIf
	else
		SayCharacterValue ()
	endIf
	return False
endIf
if ScriptName == "TouchSayPriorCharacter"
&& !IsTouchSelectionModeActive()
	if UIAPriorCharacter()
		UIASayCharacterValue ()
		return False
	else ;fall back to OSM:
		ScriptName = "SayPriorCharacter"
	endIf
endIf
if ScriptName == "SayPriorCharacter"
	PriorCharacter ()
	if GetWindowClass (GetFocus()) == cwc_Scintilla
		if !IsKeyWaiting ()
			ScheduleFunction ("SayCharacterValue", 1, true)
		endIf
	else
		SayCharacterValue ()
	endIf
	return False
endIf
RemoveHook (HK_SCRIPT, "CharacterValueHook")
return True
EndFunction

void Function PhoneticSpellHook (string ScriptName)
if ScriptName == "TouchSayNextCharacter"
&& !IsTouchSelectionModeActive()
	if UIANextCharacter()
		UIASayCharacterPhonetic ()
		return False
	else ;fall back to OSM:
		ScriptName = "SayNextCharacter"
	endIf
endIf
if ScriptName == "SayNextCharacter"
	NextCharacter ()
	SayCharacterPhonetic ()
	return False
endIf
if ScriptName == "TouchSayPriorCharacter"
&& !IsTouchSelectionModeActive()
	if UIAPriorCharacter()
		UIASayCharacterPhonetic ()
		return False
	else ;fall back to OSM:
		ScriptName = "SayPriorCharacter"
	endIf
endIf
if ScriptName == "SayPriorCharacter"
	PriorCharacter ()
	SayCharacterPhonetic ()
	return False
endIf
RemoveHook (HK_SCRIPT, "PhoneticSpellHook")
return True
EndFunction

int function handleNoCurrentWindow()
var
	handle hCurrentWindow
if userBufferIsActive() then
	return False
endIf
let hCurrentWindow = GetCurrentWindow()
if (hCurrentWindow == 0) then ; No focus
if  GetDefaultJCFOption (OPT_FOCUS_LOSS_ANNOUNCE) then
	SayFormattedMessage (OT_HELP, cmsg96_L, cmsg96_S) ; speak No Focus message
endIf
	Return True
endIf
return False
endFunction

Script SayCharacter()
var
	int nTimesPressed
if handleNoCurrentWindow() then
	return
endIf
if IsPCCursor() && IsBrailleOnlyRegion() then
	SayFormattedMessageWithVoice (VCTX_MESSAGE, ot_help, cmsgBrlOnlyRegion_l, cmsgBrlOnlyRegion_s)
	return
endIf
ResetSpeechMarkupAttributes(AttribFieldAll&~AttribFieldOutlineAndIndent)
if IsPCCursor() then
	if (GetObjectTypeCode() == WT_SLIDER) then
		if onViewSliderControl (getObjectSubtypeCode ()) then
		; These sliders' values when gotten direct are the text, e.g. details, list, tiles, etc.
			say (getObjectValue(SOURCE_CACHED_DATA), OT_WORD)
		else
			SayWord() ; says the current setting
		endIf
		return
	endIf
endIf
if isVirtualPcCursor () then
;Smart Navigation:
	if DecrementSmartNavOnDoublePress() then
		sayCharacter()
		return
	endIf
endIf
let nTimesPressed=IsSameScript ()
if (nTimesPressed>=2) then
	SayCharacterValue()
	AddHook (HK_SCRIPT, "CharacterValueHook")
elif nTimesPressed == 1 then
	SayCharacterPhonetic ()
	AddHook (HK_SCRIPT, "PhoneticSpellHook")
else
	let globalSayingCurrentItem = 1
	SayCharacter()
	let globalSayingCurrentItem = 0
endIf
EndScript

void function SayCharacterUnit(int UnitMovement)
var
	int TheTypeCode,
	handle hCurrentWindow,
	string sClass,
	string sMessage,
	int ioSubType
if IsVirtualRibbonActive() then
	return ;spoken by event
endIf
if IsLeftButtonDown()
|| IsRightButtonDown() then
	SelectingText(TRUE)
	pause ()
	SelectingText(false)
	return
endIf
if SupportsEditCallbacks() then ;the CaretMovedEvent will handle this
	return
EndIf
if !IsPCCursor() then
	SayCharacter()
	return
endIf
if IsBrailleOnlyRegion() then
	return
endIf
let hCurrentWindow = GetCurrentWindow()
let TheTypeCode = GetWindowSubTypeCode (hCurrentWindow)
If !TheTypeCode then
	Let TheTypeCode = GetObjectSubTypeCode ()
EndIf
let ioSubType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
if IsJavaWindow(hCurrentWindow) Then
	;Because at the time JAWS processes the scripts, Java has not processed the
	;keystroke for the following objects, the responsibility of speaking the object
	;needs to be passed to either ActiveItemChangedEvent or ValueChangedEvent.
	if WT_TABCONTROL == TheTypeCode
	|| WT_UPDOWNSLIDER == TheTypeCode
	|| WT_LEFTRIGHTSLIDER == TheTypeCode
	|| WT_LEFTRIGHTSLIDER == TheTypeCode
	|| WT_TREEVIEW == TheTypeCode
	|| WT_TREEVIEWITEM == TheTypeCode Then
		return
	elif MenusActive() then
		return
	endIf
endIf
if ((TheTypeCode==WT_LEFTRIGHTSLIDER || TheTypeCode==WT_UPDOWNSLIDER) &&
	(GetWindowClass(hCurrentWindow)==cwcIEServer)) then
	; ARIA sliders in Internet explorer do not generate events to update the cached data
	;Thus we must forceably update the cache and wait for the update.
	MSAARefresh()
	delay(1)
	;drop through for normal logic to speak the value
endIf
if IsSliderControl(theTypeCode)
	;ValueChangedEvent speaks the slider control if it is not spoken here.
	if ShouldSayFunctionsSpeakSlider (theTypeCode)
		delay(2)
		SayWord()
	endIf
	return
elif TheTypeCode == WT_TASKBAR
&& ioSubType == WT_TABCONTROL
	; This is the windows 2000 task bar
	SayWord()
	return
endIf
if CaretVisible() then
	SayCharacter()
	Return
EndIf
;For ARIA grids in Forms or Application Mode when no caret visible:
if ioSubType == WT_TABLECELL
|| ioSubType == WT_ROWHEADER then
	;ActiveItemChangedEvent will speak the cell.
	;set whether the header should be spoken by ActiveItemChangedEvent:
	if GetJCFOption (optTableIndication)
	&& (GITblHeaders == TBL_HEADER_COL || GITblHeaders == TBL_HEADER_BOTH || GITblHeaders == TBL_HEADER_MARKED) then
		let globalSpeakHeaderOnCellChange = TABLE_NAV_HORIZONTAL
	EndIf
endIf
EndFunction

int function IsSliderControl(int theTypeCode)
return theTypeCode == WT_SLIDER
	|| theTypeCode == WT_LEFTRIGHTSLIDER
	|| theTypeCode == WT_UPDOWNSLIDER
EndFunction

Int Function ShouldSayFunctionsSpeakSlider (int theTypeCode)
if !IsSliderControl(theTypeCode)
	return false
EndIf
var
	object slider = GetFocusObject (0)
if (!slider) then
	return true
EndIf
if (slider.accRole() != ROLE_SYSTEM_SLIDER) then
	return true
EndIf
var
	string sliderValue = slider.accValue()
if StringLength (sliderValue) == 0 then
	return true
EndIf
return false
EndFunction

Script SayNextCharacter ()
NextCharacter ()
SayCharacterUnit(UnitMove_Next)
EndScript

Script SayPriorCharacter ()
PriorCharacter ()
SayCharacterUnit(UnitMove_Prior)
EndScript

Script TouchSayNextCharacter ()
if IsTouchSelectionModeActive()
	PerformScript SelectNextCharacter()
elif !UIASayNextCharacter()
	PerformScript SayNextCharacter ()
endIf
EndScript

Script TouchSayPriorCharacter ()
if IsTouchSelectionModeActive()
	PerformScript SelectPriorCharacter()
elif !UIASayPriorCharacter ()
	PerformScript SayPriorCharacter ()
endIf
EndScript

void Function SpellWordHook (string ScriptName)
if ScriptName == "TouchSayNextWord"
&& !IsTouchSelectionModeActive()
	if UIANextWord()
		TouchSpellWord()
		return false
	else ;fall back to OSM:
		ScriptName = "SayNextWord"
	endIf
endIf
if ScriptName == "SayNextWord"
	NextWord ()
	if (!SupportsEditCallbacks())
		SpellWord ()
		SayExpandedAcronymOrAbbreviation()
	endIf
	return false
endIf
if ScriptName == "TouchSayPriorWord"
&& !IsTouchSelectionModeActive()
	if UIAPriorWord()
		TouchSpellWord()
		return false
	else ;fall back to OSM:
		ScriptName = "SayPriorWord"
	endIf
endIf
if ScriptName == "SayPriorWord"
	PriorWord ()
	if (!SupportsEditCallbacks())
		SpellWord ()
		SayExpandedAcronymOrAbbreviation()
	endIf
	return false
endIf
RemoveHook (HK_SCRIPT, "SpellWordHook")
return true
EndFunction

Script SayWord()
if handleNoCurrentWindow() then
	return
endIf
SetDocumentReadingStartLocation ()
if IsPCCursor() && IsBrailleOnlyRegion() then
	SayFormattedMessageWithVoice (VCTX_MESSAGE, ot_help, cmsgBrlOnlyRegion_l, cmsgBrlOnlyRegion_s)
	return
endIf
ResetSpeechMarkupAttributes(AttribFieldAll&~AttribFieldOutlineAndIndent)
if isVirtualPcCursor () then
;Smart Navigation:
	if DecrementSmartNavOnDoublePress() then
		sayWord()
		return
	endIf
endIf
if isPcCursor () && onViewSliderControl (getObjectSubtypeCode ()) then
	var string sliderVal = getObjectValue(SOURCE_CACHED_DATA)
	if isSameScript () then
		spellString (sliderVal)
	else
		say (sliderVal, OT_WORD)
	endIf
	return
endIf
If (IsSameScript ()) Then
	SpellWord()
	SayExpandedAcronymOrAbbreviation()
	AddHook (HK_SCRIPT, "SpellWordHook")
Else
	let globalSayingCurrentItem = 1
	SayWord()
	let globalSayingCurrentItem = 0
endIf
EndScript

void function SayWordUnit(int UnitMovement)
var
	string sClass,
	int iSubtype
if IsLeftButtonDown()
|| IsRightButtonDown() then
	SelectingText(TRUE)
	pause()
	SelectingText(false)
	return
endIf
if SupportsEditCallbacks() then ;CaretMovedEvent will speak
	return
EndIf
if RibbonsActive()
|| GetMenuMode() == MenuBar_Active then
	;The change event should speak:
	return
EndIf
if IsBrailleOnlyRegion() then
	return ; Do not speak anything.
endIf
let sClass = GetWindowClass(GetFocus())
let iSubtype = GetObjectSubtypecode()
if sClass == cwc_NetUiHWnd
|| sClass == cwc_DirectUiHWnd then
	;The change event should speak:
	if iSubtype == wt_Button Then
		return
	EndIf
EndIf
if iSubtype == wt_ListBoxItem
&& !IsvirtualPCCursor()
	;The change event should speak:
	return
EndIf
If (IsPCCursor() && IsJavaWindow(GetFocus()) && iSubtype == WT_Table)
	; In a Java Swing table that supports multiple selections pressing
	; Control + Right Arrow or Control + Left Arrow makes the table cell
	; to the right or left the active item without removing existing
	; selections. This change in the active item will trigger an Active Item
	; Changed event which will cause JAWS to speak the active table cell.
	; Return here so that JAWS does not speak extraneous information.
	return
EndIf
SayWord()
EndFunction

Script SayNextWord()
NextWord()
SayWordUnit(UnitMove_Next)
EndScript

Script SayPriorWord()
PriorWord()
SayWordUnit(UnitMove_Prior)
EndScript

Script TouchSayNextWord()
if IsTouchSelectionModeActive()
	PerformScript SelectNextWord()
elif !UIASayNextWord()
	PerformScript SayNextWord()
endIf
EndScript

Script TouchSayPriorWord()
if IsTouchSelectionModeActive()
	PerformScript SelectPriorWord()
elif !UIASayPriorWord()
	PerformScript SayPriorWord()
endIf
EndScript

int function SayLineWithDocHandler(int iSubtype)
;When MAGic is running,
;if we think that we're in a document window,
;then let the doc handler say the line and return true.
;Otherwise, return false and let the scripts proceed with speaking the line.
var
	int iType = getWindowSubtypeCode (getFocus ())
if GlobalMenuMode then
	return false
endIf
if inHjDialog ()
&& (iType == WT_LISTVIEW || iType == WT_LISTBOX || iType == WT_TREEVIEW) then
	return FALSE
endIf
if DialogActive()
&& iSubtype != wt_MultiLine_Edit
&& iSubtype != wt_ReadOnlyEdit then
	return false
endIf
if UseDocumentServerReadingFunctionality() then
	SetDocumentReadingStartLocation ()
	SayLine(2)
	return true
endIf
if IsFormsModeActive() then
	SetDocumentReadingStartLocation ()
	SayLine(2)
	return true
endIf
if !iSubtype then
	SetDocumentReadingStartLocation ()
	SayLine()
	return true
EndIf
if CaretVisible()
|| iSubtype == wt_MultiLine_Edit
|| iSubtype == wt_ReadOnlyEdit then
	SetDocumentReadingStartLocation ()
	SayLine()
	return true
EndIf
return false
EndFunction

int Function AllAppsClosedFromSystemTray(handle hwnd)
var
	string sClass
let sClass = getWindowClass (hwnd)
if StringContains (cwnFocusLossExceptionsList, globalPrevRealName)
|| StringContains (cwnFocusLossExceptionsList, getWindowName (getRealWindow (hwnd))) then
	return OFF
endIf
if isWindowVisible (ghwndToolTip) then
	return FALSE
endIf
if ! GISuppressStartMenu && isPcCursor () && ! userBufferIsActive ()
&& (sClass == cwcShellTray || sClass == cwcSysTrayParent)
&& ! getWindowSubtypeCode (hwnd)
&& ! getObjectSubtypeCode(SOURCE_CACHED_DATA) then
	Return TRUE
endIf
return FALSE;
endFunction

int function SayByTypeForScriptSayLine()
var
	int shouldUseMSAA = IsMSAAWindow(GetFocus()),
	int type,
	string strVal,
	int state
type = GetWindowSubTypeCode (GetFocus ())
If !type
	type = GetObjectSubTypeCode ()
EndIf
state = GetObjectStateCode()
If type == WT_UPDOWNSLIDER
|| type == WT_LEFTRIGHTSLIDER then
	if onViewSliderControl (type) then
	;We must pass TRUE to getObjectValue so that the text is read out for these controls:
		indicateControlType (type, getObjectName (), getObjectValue(SOURCE_CACHED_DATA))
	else
		SayObjectTypeAndText ()
	endIf
	Return true
EndIf
If type == wt_ListBoxItem then
	if (FocusWindowSupportsUIA() || shouldUseMSAA)
		say(GetObjectName(),ot_line)
		Say(GetObjectValue(),ot_line)
		if (state & ctrl_checked)
			IndicateControlState(wt_checkbox, ctrl_checked)
		elif (state & ctrl_unchecked)
			IndicateControlState(wt_checkbox, ctrl_unchecked)
		endif
		Say(PositionInGroup(),ot_position)
		return true
	EndIf
elif type == WT_MULTISELECT_LISTBOX
|| type == WT_EXTENDEDSELECT_LISTBOX
;|| type == WT_LISTVIEW	;don't include listview here! want sayLine internal to handle it.
|| type == WT_LISTBOX then
	Let strVal = GetObjectValue ()
	If !strVal then
		Let strVal = GetObjectName ()
	EndIf
	SayMessage (OT_LINE, strVal)
	if (type == WT_LISTBOX && shouldUseMSAA)
		if (state & ctrl_checked)
			IndicateControlState(wt_checkbox, ctrl_checked)
		elif (state & ctrl_unchecked)
			IndicateControlState(wt_checkbox, ctrl_unchecked)
		endif
	endIf
	SayMessage (OT_POSITION, PositionInGroup ())
	Return true
elif type == WT_TREEVIEW && TreeWithColumns() then
	SayTreeViewItem ()
	return true
elIf type == WT_TREEVIEW && inHjDialog () then
	sayLine ()
	SayMessage (OT_SCREEN_MESSAGE, FlexibleWebNumberOfActiveRules ())
	Return true
elif type == wt_ButtonMenu
	SayObjectTypeAndText()
	return true
elif type == wt_ProgressBar
&& IsWindows10()
	SayObjectTypeAndText()
	return true
elif (type == WT_Split_Pane)
	Say(GetObjectValue(), ot_line)
	return true
EndIf
return false
EndFunction

Script SayLine()
var
	handle hwnd,
	int TheTypeCode,
	string sClass,
	string sLine
let hwnd = getCurrentWindow ()
if handleNoCurrentWindow() then
	return
endIf
TheTypeCode = GetWindowSubTypeCode(hwnd)
If (!TheTypeCode)
	TheTypeCode = GetObjectSubTypeCode()
EndIf
if IsPCCursor () && IsBrailleOnlyRegion() then
	SayFormattedMessageWithVoice (VCTX_MESSAGE, ot_help, cmsgBrlOnlyRegion_l, cmsgBrlOnlyRegion_s)
	return
endIf
ResetSpeechMarkupAttributes(AttribFieldAll)
if isVirtualPcCursor () then
;Smart Navigation:
	if DecrementSmartNavOnDoublePress() then
		sayLine()
		return
	endIf
endIf
if IsPCCursor ()
&& ! UserBufferIsActive ()
&& SpeakInvisibleWindow () then
		Return
endIf
;All windows have closed, save the desktop and task bar
If AllAppsClosedFromSystemTray (hwnd) then
	SayUsingVoice (vctx_message, cmsgFocusLoss, OT_SCREEN_MESSAGE)
	Return TRUE
endIf
If GetRunningFSProducts() & product_JAWS
&& IsSameScript() then
	SpellLine()
	Return
EndIf
If !IsPcCursor()
|| IsVirtualPcCursor() then
	SetDocumentReadingStartLocation ()
	SayLine(2)
	Return
EndIf
If GlobalMenuMode then
	if globalMenuMode==MENU_ACTIVE then
		let sClass=GetWindowClass(GetParent(GetFocus()))
		if StringContains(sClass,cwcXPStartMenuParentClassSubstring) then
			sayObjectActiveItem()
			return
		endIf
	endIf
	SayLine ()
	Return
EndIf
if SayByTypeForScriptSayLine()
	;This module is for script SayLine to process controls according to their type.
	return
endIf
if IsMAGicRunning() then
	;Place the SayLineWithDocHandler check after most known types,
	;Else we get problem where SayLine tries to move the slider when doing SayLine upon it,
	;After having clicked with the mouse.
	if SayLineWithDocHandler(TheTypeCode) then
		return
	EndIf
EndIf
If CaretVisible() then
	If TheTypeCode != WT_EDITCOMBO then;Edit combos should not speak FormatAndText info.
		let globalSayingCurrentItem = 1
	EndIf
EndIf
SetDocumentReadingStartLocation ()
SayLine()
let globalSayingCurrentItem = 0
EndScript

void function SayLineUnit(int unitMovement, optional int bMoved)
var
	handle hCurrentWindow,
	int WinType,
	int objType,
	int nState,
	int bIsJava
if IsLeftButtonDown() then
	SelectingText(TRUE)
	pause()
	SelectingText(false)
	return
endIf
if SupportsEditCallbacks() then ;CaretMovedEvent will handle
	return
EndIf
if IsVirtualRibbonActive() then
	return ;spoken by event
endIf
if !IsPCCursor () then
	if UsesUnderlyingDom() || !IsJAWSCursorInMenu() then
		SayLine()
	EndIf
	return
endIf
if IsBrailleOnlyRegion() then
	return ; Do not speak anything.
endIf
hCurrentWindow = GetCurrentWindow()
WinType = GetWindowSubTypeCode (hCurrentWindow)
objType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
If !WinType
	WinType = objType
EndIf
if IsJavaWindow (hCurrentWindow)
	bIsJava = TRUE
	;Because at the time JAWS processes the scripts, Java has not processed the
	;keystroke for the following objects, the responsibility of speaking the object
	;needs to be passed to either ActiveItemChangedEvent or ValueChangedEvent.
	if WT_TABCONTROL == WinType
	|| WT_UPDOWNSLIDER == WinType
	|| WT_LEFTRIGHTSLIDER == WinType
	|| WT_LEFTRIGHTSLIDER == WinType
	|| WT_TREEVIEW == WinType
	|| WT_TREEVIEWITEM == WinType then
		return
	elif MenusActive() then
		return
	endIf
endIf
If WinType == WT_TASKBAR
	SayWord()
	Return
endIf
if IsSliderControl(WinType)
	;ValueChangedEvent speaks the slider control if it is not spoken here.
	if ShouldSayFunctionsSpeakSlider (WinType)
		if IsVirtualPCCursor()
			SayObjectTypeAndText(0, true, true)
		else
			SayWord ()
		EndIf
	endIf
	return
endIf
if wt_edit_spinbox == WinType
|| wt_spinbox == WinType
	if !bIsJava
		Say(GetLine(),OT_LINE)
	else
		Say(GetObjectValue(),OT_LINE)
	endIf
	return
endIf
if objType == wt_editCombo
&& !IsVirtualPCCursor()
	if AutoCompleteSuggestionListHasDeselectedItem()
		SayObjectActiveItem()
		BrailleRefresh()
	endIf
	return
endIf
if WinType==wt_editCombo
|| (GetWindowClass(GetFocus()) == cwc_RichEdit50w && !(objType == wt_multiline_edit || objType == wt_document || ObjType == WT_READONLYEDIT
|| WinType == wt_multiline_edit || WinType == wt_document || WinType == WT_READONLYEDIT))
	if !IsVirtualPCCursor() then
		return
	endIf
endIf
if WinType == wt_CheckBox
|| WinType == WT_RADIOBUTTON
|| WinType == WT_Switch then
	if IsVirtualPCCursor() then
		If (DocumentPresentationMode_SimpleLayout == GetJcfOption(optHTMLDocumentPresentationMode))
			SayObjectTypeAndText(0, false, true)
		Else
			SayLine(2, true)
		EndIf
	EndIf
	;Do nothing for non-virtual windows, since for some apps where checkboxes are successive,
	;focus will change and arrow can be used to navigate between the checkboxes.
	;The Say will then cause either double speaking of the new checkbox,
	;or speaking of the checkbox losing focus before the focus change announces the new one with focus.
	return
EndIf
if WinType == WT_MENU then
	if !IsVirtualPCCursor()
	&& GetWindowClass(GlobalFocusWindow) == cwcIEServer then
		return
	EndIf
EndIf
if (WinType == WT_Split_Pane)
	Say(GetObjectValue(), ot_line)
	return
endIf
if CaretVisible() then
	If GetWindowClass(GetFocus()) == cwc_ConsoleWindow
		;Currently, this is used only by SayNonHighlightedText to test if the speech should be suppressed
		;when navigating through a console window command history with up/down arrow.
		;We allow the SayLine and suppress the nonhighlighted text,
		;since not all cases of navigation by line causes new text to appear.
		LastLineNavigationTick = GetTickCount()
	endIf
	if IsVirtualPcCursor() && !UserBufferIsActive()
		SayLine(2,true)
	else
		if !IsMAGicRunning() && !IsZoomTextRunning() then
			IndicateInconsistenciesInRange(CheckLine)
		endIf
		SayLine(0,true)
	endIf
	return
endIf
;For ARIA grids in Forms or Application mode with no caret visible:
if WinType == WT_TABLECELL
|| WinType == WT_COLUMNHEADER then
	;ActiveItemChangedEvent will speak the cell.
	;set whether the header should be spoken by ActiveItemChangedEvent:
	if GetJCFOption (optTableIndication)
	&& (GITblHeaders == TBL_HEADER_Row || GITblHeaders == TBL_HEADER_BOTH || GITblHeaders == TBL_HEADER_MARKED) then
		let globalSpeakHeaderOnCellChange = TABLE_NAV_VERTICAL
	EndIf
endIf
EndFunction

Script SayNextLine()
var
	int bMoved
let bMoved=NextLine()
SayLineUnit(UnitMove_Next,bMoved)
EndScript

Script SayPriorLine ()
var
	int bMoved
let bMoved=PriorLine()
SayLineUnit(UnitMove_Prior,bMoved)
EndScript

Script TouchSayNextLine()
if IsTouchSelectionModeActive()
	PerformScript SelectNextLine()
elif !UIASayNextLine()
	PerformScript SayNextLine()
endIf
EndScript

Script TouchSayPriorLine ()
if IsTouchSelectionModeActive()
	PerformScript SelectPriorLine()
elif !UIASayPriorLine ()
	PerformScript SayPriorLine ()
endIf
EndScript

void function UnitMoveControlNav(int UnitMovement)
var
	HANDLE hwnd,
	int isJavaWindow,
	int TheTypeCode,
	int MenuMode
hwnd = GetFocus ()
isJavaWindow = IsJavaWindow(hwnd)
TheTypeCode = GetObjectSubTypeCode ()
MenuMode = GlobalMenuMode
if IsJAWSCursor()
|| IsInvisibleCursor()
|| (IsVirtualPCCursor() && !isJavaWindow) then
	if UnitMovement == UnitMove_Next then
		PerformScript SayNextParagraph()
	ElIf UnitMovement == UnitMove_Prior then
		PerformScript SayPriorParagraph()
	EndIf
	return
endIf
if !isJavaWindow then
	if TheTypeCode == WT_TREEVIEWITEM
	|| TheTypeCode == wt_TreeView
	|| TheTypeCode == WT_LISTBOXITEM
	|| TheTypecode == wt_ListView
	|| TheTypeCode == wt_edit
	|| TheTypeCode == wt_PassWordEdit
	|| theTypeCode == WT_ROW
	|| theTypeCode == WT_COLUMN
	|| theTypeCode == WT_ROWHEADER
	|| theTypeCode == WT_COLUMNHEADER
	|| theTypeCode == WT_GRID then
		if UnitMovement == UnitMove_Next then
			TypeKey(cksControlDownArrow) ; move without removing selection
		ElIf UnitMovement == UnitMove_Prior then
			TypeKey(cksControlUpArrow) ; move without removing selection
		EndIf
		return
	EndIf
EndIf
if DialogActive ()
|| TheTypeCode == WT_TREEVIEW
|| TheTypeCode == WT_TREEVIEWITEM
|| TheTypeCode == WT_LISTVIEW
|| TheTypeCode == WT_LISTVIEWITEM
|| TheTypeCode == WT_Listbox
|| TheTypeCode == WT_LISTBOXITEM
|| TheTypeCode == WT_Combobox
|| TheTypeCode == 	WT_EDITCOMBO
|| TheTypeCode == WT_MULTISELECT_LISTBOX
|| TheTypeCode == WT_EXTENDEDSELECT_LISTBOX
|| GetWindowClass(hWnd) == cwcMsoCmd then
	if UnitMovement == UnitMove_Next then
		TypeKey(cksControlDownArrow) ; move without removing selection
	ElIf UnitMovement == UnitMove_Prior then
		TypeKey(cksControlUpArrow) ; move without removing selection
	EndIf
	pause ()
	if isJavaWindow then
		; The Java Access Bridge does not send a Property
		; Active Descendent Change event or a Property
		; Selection Change event when navigating through a
		; List control or a Tree control when using Control
		; + Up Arrow or Control + Down Arrow.  Because of this
		; the Java Focus Nav Area is not updated to reflect the
		; new active item.  In order to work around this problem
		; we must call RefreshWindow here.
		Delay (2, TRUE)
		RefreshWindow(hwnd)
	endIf
	return
endIf
if TheTypeCode == WT_TABCONTROL then
	if UnitMovement == UnitMove_Next then
		TypeKey(cksControlDownArrow)
	EndIf
	SayWord()
	return
endIf
if MenuMode then
	If UnitMovement == UnitMove_Next then
		TypeKey(cksControlDownArrow)
	EndIf
	return
endIf
If (isJavaWindow && TheTypeCode == WT_Table)
	If (UnitMovement == UnitMove_Next)
		; In a Java Swing table that supports multiple selections, this makes
		; the table cell that is one cell down the active item without removing
		; existing selections. This will trigger an active item changed event.
		; JAWS will speak the selection change in response to this event.
		TypeKey(cksControlDownArrow)
		return
	ElIf (UnitMovement == UnitMove_Prior)
		; In a Java Swing table that supports multiple selections, this makes
		; the table cell that is one cell up the active item without removing
		; existing selections. This will trigger an active item changed event.
		; JAWS will speak the selection change in response to this event.
		TypeKey(cksControlUpArrow)
		return
	EndIf
EndIf
If (IsZoomTextReaderEnabled())
	; Pass the keys on to ZoomText.
	If (UnitMovement == UnitMove_Next)
		TypeKey(cksControlDownArrow)
		return
	ElIf (UnitMovement == UnitMove_Prior)
		TypeKey(cksControlUpArrow)
		return
	EndIf
EndIf
If UnitMovement == UnitMove_Next then
	PerformScript SayNextParagraph()
ElIf UnitMovement == UnitMove_Prior then
	PerformScript SayPriorParagraph()
EndIf
EndFunction

Script ControlUpArrow ()
if IsFormsModeActive () && isPcCursor ()
&& getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
	TurnOffFormsMode ()
endIf
UnitMoveControlNav(UnitMove_Prior)
EndScript

Script ControlDownArrow ()
var
	handle hWnd,
	int iSubtype
if IsFormsModeActive()
	let hWnd = GetcurrentWindow()
	let iSubtype = GetSubtypeCode(hWnd)
	if IsOpenListBoxApplicable(hWnd, iSubtype) then
		ProcessOpenListBox(hWnd,iSubtype,true)
		return
	elif isPcCursor ()
	&& getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
		TurnOffFormsMode ()
	EndIf
endIf
UnitMoveControlNav(UnitMove_Next)
EndScript

Script TouchSayNextParagraph()
if IsTouchSelectionModeActive()
	PerformScript SelectNextParagraph()
elif !UIASayNextParagraph()
	PerformScript ControlDownArrow()
endIf
EndScript

Script TouchSayPriorParagraph()
if IsTouchSelectionModeActive()
	PerformScript SelectPriorParagraph()
elif !UIASayPriorParagraph()
	PerformScript ControlUpArrow()
endIf
EndScript

Int Function ShouldSayPageUpDownUnitSayLineVirtualCursor(int javaWindow, int winType, int nState)
if (javaWindow)
	if (winType == WT_TABCONTROL || winType == WT_UPDOWNSLIDER
		|| winType == WT_LEFTRIGHTSLIDER || winType == WT_TREEVIEW
		|| winType == WT_TREEVIEWITEM)
		return false
	endif
	if (winType == WT_EDIT && nState & CTRL_SINGLELINE)
		return false
	endIf
endif
return true
EndFunction

Int Function ShouldSayPageUpDownUnitSayLineNonVirtualCursor(int winType, int nState)
if (winType == WT_EDIT && nState & CTRL_SINGLELINE)
	return false
endIf
return (winType == WT_EDIT || winType == WT_MULTILINE_EDIT)
EndFunction

void function SayPageUpDownUnit(int UnitMovement)
var
	handle hCurrentWindow,
	int winType,
	int objType,
	int nState
if IsVirtualRibbonActive() then
	return ;spoken by event
EndIf
hCurrentWindow = GetCurrentWindow ()
winType = GetWindowSubTypeCode (hCurrentWindow)
objType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
If !winType then
	winType = objType
EndIf
nState = GetControlAttributes()
if (winType == WT_LEFTRIGHTSLIDER || winType == WT_UPDOWNSLIDER)
&& GetWindowClass(hCurrentWindow)==cwcIEServer
	; ARIA sliders in Internet explorer do not generate events to update the cached data
	;Thus we must forceably update the cache and wait for the update.
	MSAARefresh()
	delay(2)
	;drop through for normal logic to speak the value
endIf
if IsVirtualPCCursor() then
	SayCurrentScriptKeyLabel ()
	if (ShouldSayPageUpDownUnitSayLineVirtualCursor(IsJavaWindow(hCurrentWindow), winType, nState))
		SayLine()
	endIf
	return
endIf
if !IsPCCursor()
	SayCurrentScriptKeyLabel ()
	return
endIf
if objType == wt_editCombo
	if AutoCompleteSuggestionListHasDeselectedItem()
		SayObjectActiveItem()
		BrailleRefresh()
	endIf
	return
endIf
if IsSliderControl(winType)
	;ValueChangedEvent speaks the slider control if it is not spoken here.
	if ShouldSayFunctionsSpeakSlider (winType)
		delay(2)
		SayWord()
	endIf
	return
elif WT_TABCONTROL == winType
	delay (2)
	SayWord ()
	return
endIf
SayCurrentScriptKeyLabel ()
if (ShouldSayPageUpDownUnitSayLineNonVirtualCursor(winType, nState))
	SayLine()
endIf
EndFunction

void function DoPageDown()
JAWSPageDown()
SayPageUpDownUnit(UnitMove_Next)
EndFunction

Script JAWSPageDown()
DoPageDown()
EndScript

Script PageDown()
DoPageDown()
EndScript

void function DoPageUp()
JAWSPageUp()
SayPageUpDownUnit(UnitMove_Prior)
EndFunction

Script JAWSPageUp()
DoPageUp()
EndScript

Script PageUp()
DoPageUp()
EndScript

Script TouchPageDown()
if UIANextPage()
	UIASayLine()
	return
endIf
DoPageDown()
EndScript

Script TouchPageUp()
if UIAPriorPage()
	UIASayLine()
	return
endIf
DoPageUp()
EndScript

Script PCCursor ()
var
	int bTurnOffFormsMode
If IsOBUtil() then
	return
endIf
let bTurnOffFormsMode =
	IsFormsModeActive()
	&& !IsJAWSCursor()
	&& !IsInvisibleCursor()
	&& !IsTouchCursor()

if (bTurnOffFormsMode
&& IsInsideARIAApplication ()
&& !IsSameScript()) then
	BeginFlashMessage()
	sayMessage(OT_Status,cmsgApplicationMode_L,cmsgApplicationMode_L)
	if ShouldItemSpeak(ot_tutor)
		;tutor messages are normally off for braile,
		;but we want to make sure this is shown in braille:
		Say(cmsgApplicationModeDeactivateTutorMessage,ot_status)
	endIf
	EndFlashMessage()
	return
EndIf

if IsObjectNavigationActive() then
	if IsSameScript()
	|| CurrentScriptWasInvokedByGesture()
		ExitTouchNavigation()
	else
		BeginFlashMessage()
		sayMessage(OT_Status,cmsgTouchCursor_L,cmsgTouchCursor_L)
		if ShouldItemSpeak(ot_tutor)
			;tutor messages are normally off for braile,
			;but we want to make sure this is shown in braille:
			Say(cmsgTouchCursorDeactivateTutorMessage,ot_status)
		endIf
		EndFlashMessage()
		return
	endIf
EndIf
ResetSynth ()
PCCursor ()
If bTurnOffFormsMode
|| IsVirtualPCCursor() then
	TurnOffFormsMode()
endIf
if BrailleInUse () then
	RouteBrailleToPC ()
	BrailleRefresh ()
endIf
If IsVirtualPCCursor () then
	SayFormattedMessage (ot_status, cMSG288_L, cMSG288_S) ; virtual pc cursor
else
	SayFormattedMessage (ot_status, cmsg9_L, cmsg9_S) ; "PC Cursor"
endIf
EndScript

script JAWSCursor ()
If IsOBUtil() then
	return
endIf
If UserBufferIsActive () then
	SayFormattedMessage (OT_status, cmsgVirtualViewer)
	Return
EndIf
if IsObjectNavigationActive() then
	ExitTouchNavigation()
EndIf
ResetSynth ()
if (IsSameScript ()) then
	InvisibleCursor(true)
	if IsInvisibleUIACursor()
		SayFormattedMessage (OT_STATUS, cmsgInvisibleScanCursor_L, cmsgInvisibleScanCursor_S)
	else
		SayFormattedMessage (OT_STATUS, cmsg10_L, cmsg10_S) ;"invisible Cursor"
	endIf
	BrailleRefresh ()
	Return
endIf
JAWSCursor (true)
if IsJawsUIACursor()
	SayFormattedMessage (OT_STATUS, cmsgJawsScanCursor_L, cmsgJawsScanCursor_S)
else
	SayFormattedMessage (ot_status, cmsg11_L, cmsg11_S) ;"JAWS Cursor"
endIf
if BrailleInUse () then
	RouteBrailleToJAWS ()
	BrailleRefresh ()
endIf
EndScript

Void Function SetActiveCursor (int nCursor)
if (nCursor == CURSOR_JAWS) then
	JAWSCursor ()
elif (nCursor == CURSOR_INVISIBLE) then
	InvisibleCursor()
else
	PcCursor ()
endIf
EndFunction

script GraphicsLabeler()
GraphicsLabeler()
EndScript

Script SayDriveLetter ()
var
	int x
let x=0
InvisibleCursor ()
RouteInvisibleToPc ()
while ((GetCharacter () != "(")	&& (x<5))
	NextWord ()
	let x=x+1
endwhile
if (x != 5) then
	NextCharacter ()
	SayCharacter ()
endIf
PcCursor ()
EndScript

script SaySpecialWindowClasses()
var
	handle WinHandle,
	string sMessageShort,
	string sMessageLong,
	string sClass,
	string sSpell
let winHandle = GetCurrentWindow ()
If (winHandle) then ;window handle is not 0
	if (TimesPressedDefault < 4) then
		let TimesPressedDefault = TimesPressedDefault + 1
	else
		let TimesPressedDefault = 1 ; reset it
	endIf ; if times Pressed
if TimesPressedDefault == 1 then
	while (GetParent (WinHandle)) ; loop until 0
		let WinHandle = GetParent (WinHandle)
		let sClass = GetWindowClass (winHandle)
		let sSpell = GetSpellString (sClass)
		let sMessageShort = FormatString (cmsg18_S, sClass, sSpell)
		let sMessageLong = FormatString (cmsg18_L, sClass, sSpell)
		SayFormattedMessage (ot_help, sMessageLong, sMessageShort) ;"Parents class ="
	EndWhile
	SayFormattedMessage (ot_help, cmsg19_L) ; Top level window
	return
endIf ; times pressed =1
if (TimesPressedDefault == 2) then
	let WinHandle = GetPriorWindow (WinHandle)
	let sClass = GetWindowClass (winHandle)
	let sSpell = GetSpellString (sClass)
	let sMessageShort = FormatString (cmsg20_S, sClass, sSpell)
	let sMessageLong = FormatString (cmsg20_L, sClass, sSpell)
	SayFormattedMessage (ot_help, sMessageLong, sMessageShort) ;"Parents class ="
	return
endIf ; times pressed = 2
if (TimesPressedDefault == 3) then
	let WinHandle = GetNextWindow (WinHandle)
	let sClass = GetWindowClass (winHandle)
	let sSpell = GetSpellString (sClass)
	let sMessageShort = FormatString (cmsg21_S, sClass, sSpell)
	let sMessageLong = FormatString (cmsg21_L, sClass, sSpell)
	SayFormattedMessage (ot_help, sMessageLong, sMessageShort) ;"Parents class ="
	return
endIf ; times pressed = 3
if (TimesPressedDefault == 4) then
	let WinHandle = GetFirstChild (WinHandle)
	let sClass = GetWindowClass (winHandle)
	let sSpell = GetSpellString (sClass)
	let sMessageShort = FormatString (cmsg22_S, sClass, sSpell)
	let sMessageLong = FormatString (cmsg22_L, sClass, sSpell)
	SayFormattedMessage (ot_help, sMessageLong, sMessageShort) ;"Parents class ="
	return
endIf ; times pressed = 4
else ; handle = 0
	SayFormattedMessage (ot_help, cmsg23_L, cmsg23_S) ;"the window handle is 0"
endIf
EndScript

int Function WantMarkupForJAWSBackspace ()
if (FocusWindowSupportsUIA())
	return SupportsEditCallbacks ()
endIf
return TRUE
EndFunction

void function GetCharacterInfoForBackSpace(string byRef strChar, int byRef ContainsMarkup)
ContainsMarkup = false
strChar = GetPriorCharacter (WantMarkupForJAWSBackspace ())
If strChar == cScNull then
	strChar = cMsgBlank1
ElIf StringCompare(strChar, cScSpace) == 0 then
	strChar = cMsgSpace1
EndIf
if WantMarkupForJAWSBackspace()
&& StringLength (strChar) > 2 then
	if (stringContains(strChar,"<") && stringContains(strChar,">"))
	|| (stringContains(strChar,"&") && stringContains(strChar,";")) then
		containsMarkup = TRUE
	endIf
endIf
EndFunction

void function DoBackSpace()
var int bRestore,
int textSelected = !StringIsBlank(GetSelectedText())
if CURSOR_PC != GetActiveCursor() then
	bRestore = TRUE
	SaveCursor ()
	PCCursor ()
endIf
If IsVirtualPcCursor ()
	If UserBufferIsActive ()
		Return; Do not process unless so directed in app-specific script file
	EndIf
	;Allow backspace, since it typically goes back a page:
	TypeKey(cksBackspace)
	if (bRestore) RestoreCursor () endIf
	return
EndIf
if IsReadOnlyEditObject()
	if (bRestore) RestoreCursor () EndIf
	Return
endIf
var
	string strChar,
	int TheTypeCode,
	string sClass,
	int containsMarkup
TheTypeCode = GetObjectSubtypeCode()
If TheTypeCode < 1 then
	SClass = GetWindowClass (GetFocus ())
	If sClass == cwcTTY || sClass == cwcTTYGrab then
		BackSpaceMSDos ()
		if bRestore then
			RestoreCursor ()
		endIf
		Return
	endIf
endIf
If TheTypeCode == WT_TREEVIEW
|| TheTypeCode == WT_LISTVIEW
|| TheTypeCode == wt_ListBox
|| TheTypeCode == wt_listBoxItem
	TypeKey(cksBackspace)
	if bRestore then
		RestoreCursor ()
	endIf
	return
endIf
GetCharacterInfoForBackSpace(strChar,ContainsMarkup)
TypeKey (cksBackspace)
if TheTypeCode != WT_STATIC then
	Say(strChar, OT_CHAR, containsMarkup)
		if textSelected then
			SayFormattedMessage(OT_MESSAGE, cMsgSelectionDeleted, cmsgSilent)
	endIf
endIf
if bRestore then
	RestoreCursor ()
endIf
endFunction

Script JAWSBackspace()
DoBackSpace()
EndScript

Script Backspace()
DoBackSpace()
EndScript

Void Function BackSpaceMSDos ()
; Handles special character recognition in dos windows
; The code here does not calculate resolution
; into the mix, because DOS windows appear to be resolution-independent
var
	int iRow,
	int iCol,
	int iNewCol
SaveCursor ()
PcCursor ()
let iRow = getCursorRow ()
let iCol = getCursorCol ()
InvisibleCursor ()
;Fixed calculation works here, because DOS windows appear to be static
MoveTo (iCol-9, iRow+3)
SayCharacter ()
RestoreCursor ()
TypeKey(cksBackspace)
EndFunction

int Function WantMarkupForJAWSDelete ()
	return TRUE
EndFunction

void function InitDoNotSayCharacterAfterDeleteControlTypeArray()
if (g_ShouldSayCharacterAfterDeleteArray)
	return
endIf
g_ShouldSayCharacterAfterDeleteArray = new IntArray[WT_CUSTOM_CONTROL_BASE]
var int i
For i = 1 to WT_CUSTOM_CONTROL_BASE
	g_ShouldSayCharacterAfterDeleteArray[i] = True
EndFor
g_ShouldSayCharacterAfterDeleteArray[WT_BUTTON] = False
g_ShouldSayCharacterAfterDeleteArray[WT_BUTTONDROPDOWN] = False
g_ShouldSayCharacterAfterDeleteArray[WT_BUTTONDROPDOWNGRID] = False
g_ShouldSayCharacterAfterDeleteArray[WT_BUTTONLISTBOX] = False
g_ShouldSayCharacterAfterDeleteArray[WT_CHECKBOX] = False
g_ShouldSayCharacterAfterDeleteArray[WT_COMBOBOX] = False
g_ShouldSayCharacterAfterDeleteArray[WT_EXTENDEDSELECT_LISTBOX] = False
g_ShouldSayCharacterAfterDeleteArray[WT_LEFTRIGHTSLIDER] = False
g_ShouldSayCharacterAfterDeleteArray[WT_LISTBOX] = False
g_ShouldSayCharacterAfterDeleteArray[WT_LISTBOXITEM] = False
g_ShouldSayCharacterAfterDeleteArray[WT_LISTVIEW] = False
g_ShouldSayCharacterAfterDeleteArray[WT_LISTVIEWITEM] = False
g_ShouldSayCharacterAfterDeleteArray[WT_MULTISELECT_LISTBOX] = False
g_ShouldSayCharacterAfterDeleteArray[WT_OUTLINEBUTTON] = False
g_ShouldSayCharacterAfterDeleteArray[WT_RADIOBUTTON] = False
g_ShouldSayCharacterAfterDeleteArray[WT_SLIDER] = False
g_ShouldSayCharacterAfterDeleteArray[WT_SPLITBUTTON] = False
g_ShouldSayCharacterAfterDeleteArray[WT_STARTBUTTON] = False
g_ShouldSayCharacterAfterDeleteArray[WT_STATIC] = False
g_ShouldSayCharacterAfterDeleteArray[WT_TREEVIEW] = False
g_ShouldSayCharacterAfterDeleteArray[WT_TREEVIEWITEM] = False
g_ShouldSayCharacterAfterDeleteArray[WT_UPDOWNSLIDER] = False
EndFunction

int function ShouldDoDeleteSayCharacterAfterDelete(int typeCode)
InitDoNotSayCharacterAfterDeleteControlTypeArray()
if (typeCode <= 0 || typeCode > ArrayLength(g_ShouldSayCharacterAfterDeleteArray))
	return True
endIf
return g_ShouldSayCharacterAfterDeleteArray[typeCode]
EndFunction

void function DoDelete()
var int bRestore,
int textSelected = !StringIsBlank(GetSelectedText())
if (CURSOR_PC != GetActiveCursor())
	bRestore = TRUE
	SaveCursor()
	PCCursor()
endIf
If (IsVirtualPcCursor())
	if (bRestore) RestoreCursor() EndIf
	Return
EndIf
if (IsReadOnlyEditObject())
	if (bRestore) RestoreCursor() EndIf
	Return
endIf
var int TheTypeCode = GetWindowSubTypeCode(GetFocus())
If (! TheTypeCode)
	TheTypeCode = GetObjectSubtypeCode()
EndIf
TypeKey(cksDelete)
if (ShouldDoDeleteSayCharacterAfterDelete(TheTypeCode))
	delay(1)
	SayCharacter(WantMarkupForJAWSDelete())
	if (textSelected)
		SayFormattedMessage(OT_MESSAGE, cMsgSelectionDeleted, cmsgSilent)
	endIf
endIf
if (bRestore)
	RestoreCursor()
EndIf
EndFunction

Script JAWSDelete()
DoDelete()
EndScript

Script Delete()
DoDelete()
EndScript

script RestrictJAWSCursor()
;This script is no longer current
;Please use the updated script RestrictCurrentCursor
if ToggleRestriction() then
	SayFormattedMessage (ot_status, cmsg24_L, cmsg24_S) ;"Restriction on JAWS Cursor"
else
	SayFormattedMessage (ot_status, cmsg25_L) ;"restriction off JAWS Cursor"
endIf
EndScript

script ShutDownJAWS()
if IsUserShutdownAllowed() then
	EnsureNoUserBufferActive()
	SayFormattedMessage (ot_JAWS_message, cmsg26_L) ;"Unloading JAWS"
	ShutDownJAWS()
endIf
EndScript

script LaunchMagic()
EnsureNoUserBufferActive()
TypeCurrentScriptKey()
EndScript

Script ShutDownMagic()
var
	int iBtn
EnsureNoUserBufferActive()
let iBtn = ExMessageBox(cmsgQuitMAGicDlgMessageText, cmsgQuitMAGicDlgMessageTitle, MB_OKCANCEL)
if iBtn == 1 then
	if ShutDownMAGic() then
		Say(cmsgMagicUnloaded,OT_MESSAGE)
	endif
EndIf
EndScript

int function IsInvalidForSayWindowTitle()
if handleNoCurrentWindow() then
	return true
endIf
if SpeakInvisibleWindow () then
	Return TRUE
endIf
return false
EndFunction

int function SayUserBufferWindowTitle()
If UserBufferIsActive () then
	If IsVirtualPcCursor () then
		SayMessage (OT_status, cmsgVirtualViewer)
		Return true
	EndIf
EndIf
return false
EndFunction

void function SayAnyHTMLTitleInformation()
var
	string sFrame,
	string sHeading,
	string regionName,
	string regionType,
	int regionLevel

if IsVirtualPCCursor() then
	let sFrame=GetHTMLFrameName()
	let sHeading=GetCurrentHeading()
	let regionName = GetCurrentRegionName()
	let regionType = GetCurrentRegionType()
	let regionLevel = GetCurrentRegionLevel()
	if (regionName) then
		SayMessage(ot_user_requested_information,
			FormatString(msgRegionNameIs_L,regionName),
			FormatString(msgRegionNameIs_S,regionName))
	endIf
	if (regionType ) then
		SayMessage(ot_user_requested_information,
			FormatString(msgRegionTypeIs_L,regionType),
			FormatString(msgRegionTypeIs_S,regionType))
	endIf
	if (regionLevel > 1 ) then
		SayMessage(ot_user_requested_information,
			FormatString(msgRegionLevelIs_L,regionLevel),
			FormatString(msgRegionLevelIs_S,regionLevel))
	endIf
	if (sHeading) then
		SayMessage(ot_user_requested_information,
			FormatString(msgHeadingIs_L,sHeading),
			FormatString(msgHeadingIs_S,sHeading))
	endIf
	if sFrame then
		SayMessage(ot_user_requested_information,
			FormatString(msgFrameIs_L,sFrame),
			FormatString(msgFrameIs_S,sFrame))
	endIf
elIf IsInsideARIAApplication()
	var object oAriaApplicationElement = GetAriaApplicationElement ()
	if (oAriaApplicationElement.name) then
		SayMessage(ot_user_requested_information,
			FormatString(msgRegionNameIs_L,oAriaApplicationElement.name),
			FormatString(msgRegionNameIs_S,oAriaApplicationElement.name))
	endIf
	if (oAriaApplicationElement.localizedControlType) then
		SayMessage(ot_user_requested_information,
			FormatString(msgRegionTypeIs_L,oAriaApplicationElement.localizedControlType),
			FormatString(msgRegionTypeIs_S,oAriaApplicationElement.localizedControlType))
	endIf
endIf
EndFunction

Object Function GetAriaApplicationElement ()
if !IsInsideARIAApplication () return Null() endIf
var
	object oTreeWalker = FSUIARawViewWalker ()
oTreeWalker.currentElement = FSUIAGetFocusedElement ()
while oTreeWalker.GoToParent()
	if oTreeWalker.currentElement.ariaRole == ARIA_ROLE_APPLICATION
		return oTreeWalker.currentElement
	endIf
endWhile
return Null()
EndFunction

int function SayStartMenuOrButtonTitle(handle hWnd, int iTypeCode)
var
	string sText
If iTypeCode == WT_STARTBUTTON then
	SayMessage(ot_user_requested_information,
		FormatString(cmsg27_L, cmsg31_L),
		FormatString(cmsg27_S, cmsg31_L))
	Return true
elif iTypeCode == WT_STARTMENU then
	let sText = GetWindowText(hWnd,true)
	SayMessage(ot_user_requested_information,
		FormatString(cmsg28_L, cmsg4_L, sText),
		FormatString(cmsg28_S, cmsg4_L, sText))
	Return true
endIf
return false
EndFunction

int function SayWindowTitleForMenus(handle hAppWnd, handle hCurWnd, int iTypeCode)
var
	string sAppText,
	string sMenuText
if RibbonsActive()
	var
		int ribbonState,
		string ribbonTabName,
		string ribbonGroupName,
		string ribbonDesc
	sAppText = GetWindowName(hAppWnd)
	GetRibbonStatus(ribbonState,ribbonTabName,ribbonGroupName,ribbonDesc)
	if IsVirtualRibbonActive()
		SayMessage(ot_user_requested_information,
			formatString(cMsgSayWindowTitleInVirtualRibbons_L,sAppText, ribbonTabname),
			formatString(cMsgSayWindowTitleInVirtualRibbons_S,sAppText, ribbonTabname))
	else
		SayMessage(ot_user_requested_information,
			formatString(cMsgSayWindowTitleInRibbons_L,sAppText, ribbonTabname),
			formatString(cMsgSayWindowTitleInRibbons_S,sAppText, ribbonTabname))
	endIf
	return true
endIf
If GlobalMenuMode == menubar_Active
	; the menubar is active but the menus haven't dropped down
	sAppText = GetWindowName(hAppWnd)
	sMenuText = getMenuName()
	if sMenuText == cscNull then
		sMenuText = getWord()
	endIf
	SayMessage(ot_user_requested_information,
		formatString(cMsgMenubarItem_L,sAppText, sMenuText),
		formatString(cMsgMenubarItem_S,sAppText, sMenuText))
	Return true
EndIf
If iTypeCode == WT_MENU then
	; the menu has dropped down
	sAppText = getWindowName(hAppWnd)
	sMenuText = GetMenuName()
	SayMessage(ot_user_requested_information,
		FormatString (cmsgMenuItem_L, sAppText, sMenuText),
		FormatString (cmsgMenuItem_S, sAppText, sMenuText))
	Return true
elif iTypeCode == WT_CONTEXTMENU then
	sMenuText = GetWindowText(hCurWnd, true)
	SayMessage(ot_user_requested_information,
		FormatString (cmsg28_L, cmsg6_L, sMenuText),
		FormatString (cmsg28_S, cmsg6_L, sMenuText))
	Return true
endIf
return false
EndFunction

int function SayWindowTitleForTaskBarOrSysTray(int iTypeCode)
If iTypeCode == WT_TASKBAR
|| (IsWindows7() && GetWindowClass(GetFocus()) == cwc_MSTaskListWClass) then
	SayMessage(ot_user_requested_information,
		FormatString (cmsg27_L, cmsg32_L),
		FormatString (cmsg27_S, cmsg32_L))
	return true
elif iTypeCode == wt_sysTray then
	SayMessage(ot_user_requested_information,
		formatString(cMsg28_L, cMsgSysTray_L, getObjectName()),
		formatString(cMsg28_S, cMsgSystray_S, getObjectName()))
	return true
endIf
return false
EndFunction

int function SayWindowTitleForDesktopToolBar(handle hCurWnd, int iTypeCode)
if (iTypeCode == wt_button || iTypeCode == wt_toolbar)
&& getWindowClass(getParent(getParent(hCurWnd)))==cwcShellTray then
	SayMessage(ot_user_requested_information,
		formatString(cMsg28_L, cMsgDesktopToolbar_L, getObjectName()),
		formatString(cMsg28_S, cMsgDesktopToolbar_S, getObjectName()))
	return true
endIf
return false
EndFunction

void function GetWindowTitleForApplication(handle hAppWnd, handle hRealWnd, handle hCurWnd, int iTypeCode,
	string ByRef sTitle, string ByRef sSubTitle, int ByRef bHasPage)
var
	string sText1,
	string sText2,
	string sText3
let bHasPage = false
if IsWindowDisabled (hAppWnd)
&& IsWinFormsWindow(hAppWnd)
	sText1 = GetWindowName(hRealWnd)
else
	sText1 = GetWindowName(hAppWnd)
endIf
if hRealWnd != hAppWnd then
	if hRealWnd != hCurWnd
	; An SDM window is a window with subcontrols that take focus,
	; so here we allow them to act like subwindows of a main window.
	|| stringStartsWith(getWindowClass(hCurWnd), cwc_Bosa_sdm_) then
		if IsJavaWindow(hCurWnd) then
			let sText2 = navGetObjectName (navGetRealObjectID (navGetFocusObjectID (), hCurWnd), hCurWnd)
		else
			let sText2 = GetWindowName(hRealWnd)
		endif
	endif
endif
if StringLength(sText2) == 0
&& IsJavaWindow(hCurWnd) then
	let sText2 = navGetObjectName (navGetRealObjectID (navGetFocusObjectID (), hCurWnd), hCurWnd)
endif
If IsMultiPageDialog() then
	if !sText2 then
		let sText2 = sText1
	endIf
	let sText3 = GetDialogPageName ()
	let bHasPage = true
	let sTitle = sText2
	let sSubTitle = sText3
	return
endIf
if sText2
&& stringContains(sText1, sText2) then
	; app window title contains document name
	let sText2 = cscNull
endIf
if focusWindowSupportsUIA()
&& StringContains (GetActiveConfiguration (), "outlook")
; Outlook misreads the title of the window, precluding the word "message" :
&& GetWindowClass (hCurWnd) != cwc_Word_Document
;avoid ghost title speaking, e.g. "title is" followed by nothing else.
&& ! StringIsBlank (GetWindowName(hCurWnd)) then
	let sText1=GetWindowName(hCurWnd)
	let sText2=cscNull
endIf
let sTitle = sText1
let sSubTitle = sText2
EndFunction

void function SayWindowTitleForApplication(handle hAppWnd, handle hRealWnd, handle hCurWnd, int iTypeCode)
var
	string sTitle,
	string sSubTitle,
	int bHasPage
GetWindowTitleForApplication(hAppWnd, hRealWnd, hCurWnd, iTypeCode,
	sTitle, sSubTitle, bHasPage)
if bHasPage then
	SayMessage(ot_user_requested_information,
		FormatString (cmsg30_L, sTitle, sSubTitle),
		FormatString (cmsg30_S, sTitle, sSubTitle))
else
	SayMessage(ot_USER_REQUESTED_INFORMATION,
		FormatString (cmsg29_L, sTitle, sSubTitle),
		FormatString (cMsg29_S, sTitle, sSubTitle))
EndIf
EndFunction

int function SayWin8AppWindowTitle()
if !IsMetroApp() return false endIf
var string sTitle = GetWin8AppWindowTitle()
SayMessage(ot_USER_REQUESTED_INFORMATION,
	FormatString (cmsg29_L, sTitle, cscNull),
	FormatString (cMsg29_S, sTitle, cscNull))
return true
EndFunction

Script SayWindowTitle()
if IsSameScript ()
	SayWindowVisualState()
	return
endIf
var
	handle hCurrentWindow,
	handle hRealWindow,
	handle hAppWindow,
	int iTypeCode
if IsInvalidForSayWindowTitle()
|| SayUserBufferWindowTitle()
|| SayWin8AppWindowTitle()
	return
endIf
let hCurrentWindow = GetCurrentWindow()
; we use window subtype code as object subtype code doesn't distinguish sys tray from other toolbars
Let iTypeCode = GetWindowSubTypeCode (hCurrentWindow)
if !iTypeCode then
	let iTypeCode=getObjectSubtypeCode()
endIf
let hRealWindow = GetRealWindow (hCurrentWindow)
let hAppWindow = GetAppMainWindow (hCurrentWindow)
if SayStartMenuOrButtonTitle(hCurrentWindow,iTypeCode)
|| SayWindowTitleForMenus(hAppWindow,hCurrentWindow,iTypeCode)
|| SayWindowTitleForTaskBarOrSysTray(iTypeCode)
|| SayWindowTitleForDesktopToolBar(hCurrentWindow, iTypeCode) then
	return
EndIf
SayWindowTitleForApplication(hAppWindow, hRealWindow, hCurrentWindow, iTypeCode)
SayAnyHTMLTitleInformation()
SpeakPersonalizeSettings()
EndScript

Void Function SpeakWindowInformation (handle hWnd)
var
	handle hNextWindow,
	int iType,; For subtypecode of hWnd, to keep tab controls and other undesirables from speaking.
	int iNextType
If (GetWindowSubTypeCode (hWnd) == WT_COMBOBOX) then
	If (GetWindowSubTypeCode (GetFirstChild (hWnd)) == WT_EDITCOMBO) then
		;The appropriate prompt will get spoken when the child is processed.
		Return
	EndIf
   EndIf
Let hNextWindow = GetNextWindow (hWnd)
If GetWindowSubTypeCode (hWnd) == WT_STATIC then
	If GetWindowSubTypeCode (hNextWindow) == WT_Static ||
	StringLength (GetWindowText (hWnd, false)) > 5 then
		Let iNextType = GetWindowSubTypeCode (hNextWindow)
		If iNextType == WT_EDIT ||
		iNextType == WT_READONLYEDIT ||
		iNextType == WT_EDITCOMBO ||
		iNextType == WT_SLIDER ||
		iNextType == WT_UPDOWNSLIDER ||
		iNextType == WT_UPDOWNSLIDER ||
		iNextType == WT_COMBOBOX then
			;Do nothing, Type and Text on the next window picks this static up.
			SayFormattedMessage (OT_CONTROL_NAME, cscNull)
		Else
			SayWindow (hWnd, READ_EVERYTHING)
		endIf
	endIf
Else; Not static
	If iType == WT_DIALOG ||
	iType == WT_TABCONTROL then
		SayFormattedMessage (OT_CONTROL_NAME, cscNull)
	Else
		SayWindowTypeAndText (hWnd)
	endIf
endIf
EndFunction

Void Function DoChildWindowsOld (handle hWnd)
var
	handle hPos
Let hPos = hWnd
While (hPos)
	If IsWindowVisible (hPos) then
		SpeakWindowInformation (hPos)
	endIf
	Let hPos = GetNextWindow (hPos)
EndWhile
EndFunction

void function ReadToolbarObjects(handle hWnd)
var
	string sObjList,
	int iObjCount,
	int i,
	string sName,
	int iType
if GetWindowSubtypeCode(hWnd) != wt_toolbar then
	return
EndIf
let sObjList = GetListOfObjects(hWnd)
If StringLength(sObjList) <= 2 Then
	return
EndIf
let iObjCount = StringSegmentCount(sObjList,LIST_ITEM_SEPARATOR)
let i = 1
while i <= iObjCount
	let sName = StringSegment(sObjList,LIST_ITEM_SEPARATOR,i)
	GetObjectInfoByName(hWnd,sName,1,iType)
	IndicateControlType(iType,sName,cscSpace)
	let i = i+1
EndWhile
EndFunction

int function isWindowActuallyVisible(handle hwnd)
; Returns True if hwnd is actually (at least partially) visible on screen.

; If its style says it's invisible, it is.
if !isWindowVisible(hwnd) then
	return False
endIf

; If it's all the way off at least one screen edge, it's invisible.
; Some applications hide windows in this way.
; Similarly if it has 0 width and/or height, it's not visible.
var int left, int right, int top, int bottom
if getWindowRect(hwnd, left, right, top, bottom) && (
	right-left <= 0 || bottom-top <= 0
	|| right < 1 || left > screenGetWidth()
	|| bottom < 1 || top > screenGetHeight()
) then
	return False
endIf

; Sometimes a window whose styileBits say visible can still be
; invisible according to its MSAA Window or Client object. [DGL, 2012-02-14]
; Outlook 2010 actually requires both Window and Client objects to be checked.
var object o, int childID
let o = getObjectFromEvent(hwnd, ObjID_Window, 0, childID)
if o then
	if o.accState(childID) & State_System_Invisible then
		return False
	endIf
endIf
let o = getObjectFromEvent(hwnd, ObjID_Client, 0, childID)
if o then
	if o.accState(childID) & State_System_Invisible then
		return False
	endIf
endIf

return True
endFunction

int Function DoChildWindows (handle hWnd)
var
	int iSubtype,
	handle hTemp,
	string sName,
	string sCtrlLabel1,
	string sCtrlLabel2,
	string sControlValue = getWindowText (hWnd, READ_EVERYTHING)
If !IsWindowActuallyVisible (hWnd) then
	Return TRUE
EndIf
let iSubtype = GetWindowSubtypeCode(hWnd)
let sName = GetWindowName(hWnd)
;attempt to determine if we should avoid double speaking of control names
;due to the static text name label preceding the control:
if iSubtype == wt_EditCombo then
	let hTemp = GetPriorWindow(GetParent(GetParent(hWnd)))
	if hTemp
	&& GetWindowSubtypeCode(hTemp) == wt_static then
		let sCtrlLabel1 = GetWindowName(hTemp)
	EndIf
ElIf iSubtype == wt_Edit
|| iSubtype == wt_ReadOnlyEdit
|| iSubtype == wt_PasswordEdit then
	let hTemp = GetPriorWindow(hWnd)
	if hTemp
	&& GetWindowSubtypeCode(hTemp) == wt_static then
		let sCtrlLabel1 = GetWindowName(hTemp)
	EndIf
ElIf iSubtype == wt_ComboBox then
	let hTemp = GetFirstChild(hWnd)
	if hTemp
	&& GetWindowSubtypeCode(hTemp) == wt_EditCombo then
		;suppress double speaking of the edit combo name and type
		return true
	EndIf
	let hTemp = GetPriorWindow(hWnd)
	if hTemp
	&& GetWindowSubtypeCode(hTemp) == wt_static then
		let sCtrlLabel1 = GetWindowName(hTemp)
	EndIf
ElIf iSubtype == wt_LeftRightSlider
|| iSubtype == wt_UpDownSlider then
	;Sliders may have 1 or 2 static text label fields preceding the control
	let hTemp = GetPriorWindow(hWnd)
	if hTemp
	&& GetWindowSubtypeCode(hTemp) == wt_static then
		let sCtrlLabel2 = GetWindowName(hTemp)
		let hTemp = GetPriorWindow(hWnd)
		if hTemp
		&& GetWindowSubtypeCode(hTemp) == wt_static then
			let sCtrlLabel1 = GetWindowName(hTemp)
		else
			let sCtrlLabel1 = sCtrlLabel2
			let sCtrlLabel2 = cscNull
		EndIf
	EndIf
EndIf
;now speak the window:
if (sCtrlLabel1 && StringCompare(sCtrlLabel1,sName) == 0)
|| (sCtrlLabel2 && StringCompare(sCtrlLabel2,sName) == 0)
|| (sCtrlLabel2 && !stringStripAllBlanks(StringDiff(StringDiff(sName,sCtrlLabel1),sCtrlLabel2))) then
	;Substitute blank for the control name here,
	;since we spoke it earlier when we spoke the label preceding it
	if iSubtype == WT_READONLYEDIT
	|| iSubType == WT_EDIT
	;|| iSubtype == SomeOtherTypeWithTextInItThatMisSpeaks
	&& ! stringIsBlank (sControlValue) then
		if stringCompare (sCtrlLabel1, sName) != 0 then
			if  stringIsBlank (sCtrlLabel1) then
				indicateControlType (iSubtype, sName, sControlValue)
			else
				indicateControlType (iSubtype, sCtrlLabel1, sControlValue)
			endIf
		else
			indicateControlType (iSubtype, cscNull, sControlValue)
		endIf
	else
		SayControlEx(hWnd,cscSpace)
	endIf
ElIf iSubtype == wt_toolbar then
	;announce the toolbar, then list it's objects
	IndicateControlType(wt_toolbar,GetWindowName(hWnd),cscSpace)
	ReadToolbarObjects(hWnd)
elIf iSubtype == WT_READONLYEDIT
|| iSubType == WT_EDIT
;|| iSubtype == SomeOtherTypeWithTextInItThatMisSpeaks
&& ! stringIsBlank (sControlValue) then
	if stringCompare (sCtrlLabel1, sName) != 0 then
		if  ! stringIsBlank (sName) then
			indicateControlType (iSubtype, sName, sControlValue)
		else
			indicateControlType (iSubtype, sCtrlLabel1, sControlValue)
		endIf
	else
		indicateControlType (iSubtype, cscNull, sControlValue)
	endIf
else
	SayWindowTypeAndText (hWnd)
EndIf
;for edits and multiline read-only edits which don't read their text via sayWindowTypeAndText:
if (iSubtype == WT_EDIT || iSubtype == WT_READONLYEDIT || iSubtype == WT_MULTILINE_EDIT)
	if (getWindowStyleBits (hWnd) & ES_MULTILINE)
		;it's the multiline windows who fail to announce the screen-visible text.
		;Only the text which is visible to the user on the screen will be announced.
		sayWindow (hwnd, READ_EVERYTHING)
	endIf
endIf
Return TRUE
EndFunction

int function UserBufferReadBoxInTabOrder()
if !UserBufferIsActive() return false endIf
JAWSTopOfFile ()
SayAll ()
return true
endFunction

void function UIAReadBoxInTabOrder()
var
	object oUIA,
	object element,
	object condition
oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return false endIf
element = GetUIAFocusElement(oUIA).BuildUpdatedCache()
condition = oUIA.CreateIntPropertyCondition( UIA_ProcessIdPropertyId, element.processId)
UIAReadBoxInTabOrderTreewalker = oUIA.CreateTreeWalker(condition)
if !UIAReadBoxInTabOrderTreewalker return false endIf
UIAReadBoxInTabOrderTreewalker.currentElement = element
while UIAReadBoxInTabOrderTreewalker.currentElement.controlType != UIA_WindowControlTypeId && UIAReadBoxInTabOrderTreewalker.gotoParent() endWhile
if UIAReadBoxInTabOrderTreewalker.currentElement.controlType != UIA_WindowControlTypeId return false endIf
UIAReadBoxInTabOrderWindowElement = UIAReadBoxInTabOrderTreewalker.currentElement
UIASayElement(UIAReadBoxInTabOrderTreewalker.currentElement, true)
QueueFunction("UIAReadBoxInTabOrderCallback")
return true
EndFunction

int function IsChildTextElementOfSameName (object element)
var string elementName = element.name
elementName = StringTrimLeadingBlanks (StringTrimTrailingBlanks (elementName))
if ! element || stringIsBlank (elementName) return FALSE endIf
; we want to ignore the text child.
if element.controlType != UIA_TextControlTypeID then
	return FALSE
endIf
; for the case where the child is a link, ignore the parent if it's text and has the same name:
var object childElement = FSUIAGetFirstChildOfElement (element)
if childElement.controlType == UIA_HYPERLINKControlTypeID
&& stringContains (childElement.name, ElementName)
	return TRUE
endIf
var object parentElement = FSUIAGetParentOfElement (element)
if ! parentElement return FALSE endIf
var string parentName = parentElement.name
parentName = StringTrimLeadingBlanks (StringTrimTrailingBlanks (parentName))
if stringIsBlank (parentName) return FALSE endIf
;exclude title bars where named the same as the window.
; title bar contains a value, not a name:
var int controlType = parentElement.ControlType
var int ParentHasDuplicateTextChild = controlType == UIA_HYPERLINKControlTypeID
|| controlType == UIA_ButtonControlTypeID
; or any other control type that matters
; some we don't want to ignore,
; such as a pane with the same name as a text field.
return ParentHasDuplicateTextChild
&& (stringContains (ParentName, ElementName)
|| stringContains (elementName, ParentName))
endFunction

void function UIAReadBoxInTabOrderCallback()
if !UIAReadBoxInTabOrderTreewalker return endif
if !UIAGoToNextInSubtree(UIAReadBoxInTabOrderTreewalker,UIAReadBoxInTabOrderWindowElement) return EndIf
var int ShouldSkipTitleBar = UIAReadBoxInTabOrderTreewalker.currentElement.ControlType == UIA_TitleBarControlTypeID
if ShouldSkipTitleBar then
	if !UIAReadBoxInTabOrderTreewalker.GoToNextSibling() return EndIf
endIf
while ShouldSkipUIAElementOnSayAll(UIAReadBoxInTabOrderTreewalker.currentElement)
|| IsChildTextElementOfSameName (UIAReadBoxInTabOrderTreewalker.currentElement)
|| UIAReadBoxInTabOrderTreewalker.currentElement.isOffScreen
|| !UIAReadBoxInTabOrderTreewalker.currentElement.isEnabled
	if !UIAGoToNextInTree(UIAReadBoxInTabOrderTreewalker) return EndIf
endWhile
;Because this function is queued rather than directly called by a script,
;we must call functions to allow speech output when Speech On Demand is active:
var int isSODActive = (IsSpeechOff() && getJCFOption(OPT_LESS_SPEECH) == 0)
if (isSODActive) JAWSSpeechOnDemandOn() endIf
UIASayElement(UIAReadBoxInTabOrderTreewalker.currentElement, true)
if (isSODActive) JAWSSpeechOnDemandOff() endIf
QueueFunction("UIAReadBoxInTabOrderCallback")
EndFunction

int function MetroAppReadBoxInTabOrder()
if !IsMetroApp() return false endIf
if IsVirtualPcCursor() || IsFormsModeActive() return false endIf
UIAReadBoxInTabOrder()
return true
EndFunction

int function WPFReadBoxInTabOrder(handle hWnd)
if !StringStartsWith(GetWindowClass(hWnd),cwc_HwndWrapper) return false endIf
UIAReadBoxInTabOrder()
return true
EndFunction

int function WinFormsReadBoxInTabOrder(handle hWnd, handle hCurrent)
;Special handling of .Net WinForms
var string class = GetWindowClass(hWnd)
if stringContains( class, "WindowsForms")
|| class == cwc_DirectUIhWND
|| GetWindowClass( GetFirstChild ( hwnd ) ) == cwc_DirectUIhWND
	UIAReadBoxInTabOrder()
	return true
endIf
;the hwnd window may not be visible so try hCurrent:
if !IsWindowVisible (hwnd)
&& stringContains(getWindowClass(hCurrent),"WindowsForms")
	UIAReadBoxInTabOrder()
	return true
EndIf
return false
EndFunction

int function JavaReadBoxInTabOrder(handle hCurrent)
var
	HANDLE FocusedObjectID,
	HANDLE TopLevelObjectID
if !IsJavaWindow(hCurrent) return false EndIf
let FocusedObjectID = navGetFocusObjectID ()
let TopLevelObjectID = navGetTopLevelObjectID (FocusedObjectID, hCurrent)
navSayObjectTypeAndText (TopLevelObjectID, hCurrent)
SayFocusedObject ()
return true
EndFunction

int function readBoxInTabOrderUsingAccessibilityInfrastructure (handle realWindow, handle focusWindow)
; the case inside or outside a dialog where MSAA text is not useful:
var int validWindow = getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_DIALOG
|| stringIsBlank (getWindowTextEX (focusWindow, READ_EVERYTHING, TRUE))
if validWindow then
	Say(GetTypeAndTextStringsForWindow(getFocus()),ot_USER_REQUESTED_INFORMATION)
endIf
return validWindow
endFunction

Script ReadBoxInTabOrder()
;The order in which these tests are placed must be preserved.
if UserBufferReadBoxInTabOrder() return endIf
if MetroAppReadBoxInTabOrder() return endIf
var
	handle hCurrent,
	handle hRealWnd
hCurrent = GetCurrentWindow ()
hRealWnd = GetRealWindow (hCurrent)
if WPFReadBoxInTabOrder(hRealWnd) return endIf
if WinFormsReadBoxInTabOrder(hRealWnd, hCurrent) return endIf
if !DialogActive() then
	if readBoxInTabOrderUsingAccessibilityInfrastructure (hRealWnd, hCurrent) then
	; single-window dialogs are not dialogs, e.g. JAWS does not report DialogActive for these windows
		return
	endIf
	SayMessage(ot_message, GetWindowTextEx(getAppMainWindow(hRealWnd),read_everything, TRUE))
	return
EndIf
if JavaReadBoxInTabOrder(hCurrent) return EndIf
SayMessage(OT_ERROR, formatString(cMsg33_L,getWindowName(hRealWnd)), cMsgSilent) ;<DialogName> dialog
If IsVirtualPcCursor()
	JAWSTopOfFile ()
	SayAll ()
	Let gIVirtualDialogInsertB = TRUE
	Return
EndIf
If IsFormsModeActive() then
	If GetWindowClass (hRealWnd) == cWcHtmlDlg then
		Say(GetWindowTextEX (hRealWnd, FALSE, TRUE), ot_message)
	EndIf
EndIf
If !GetDialogStaticText () then
	Say(MSAAGetDialogStaticText (), OT_DIALOG_TEXT)
EndIf
if getWindowTypeCode(hRealWnd) == wt_dialog
&& getWindowTypeCode(getFirstChild(hRealWnd)) == wt_dialog
&& isDescendedFromWindow(getFirstChild(hRealWnd),hCurrent) then
	EnumerateChildWindows (getFirstChild(GetRealWindow (hCurrent)), "DoChildWindows")
	return
EndIf
EnumerateChildWindows (GetRealWindow (GlobalFocusWindow), "DoChildWindows")
EndScript

Void Function ItemNotFoundEvent (int hwnd)
; event indicating that the requested item can't be found in the OSM
;beep()
EndFunction

void function GestureEvent(string gestureName, int IsAssignedToScript)
SetMostRecentJAWSGestureName(gestureName)
if gbKeyboardHelp
&& !IsAssignedToScript
	var int ticks = GetTickCount()
	if ticks - c_KeyboardHelpData.lastGestureTickCount > ContinuousGestureTickCountThreshold
		var int isSODActive = (IsSpeechOff() && getJCFOption(OPT_LESS_SPEECH) == 0)
		if (isSODActive) JAWSSpeechOnDemandOn() endIf
		Say(GetGestureLabel(gestureName),ot_user_requested_information)
		if (isSODActive) JAWSSpeechOnDemandOff() endIf
	endIf
	c_KeyboardHelpData.lastGestureTickCount = ticks
endIf
EndFunction

void function ProcessBXModifiedKey(string strKeyName)
if gsBXSimulateKey
|| gbBXFunctionKey then
	DoBXModifiedKey(strKeyName)
	let gsBXSimulateKey = cscNull
	let gbBXFunctionKey = false
	if !gbKeyboardHelp then
		TrapKeys(false)
	EndIf
EndIf
EndFunction

int function KeyIsSpacebar(int nKey, string strKeyName, int nIsBrailleKey)
return nKey == KEY_SPACEBAR
	|| (nIsBrailleKey && (gbUsingRemotePACMate || BrailleGetTypeKeysMode ())
	&& StringCompare(strKeyName,cksBrlSpace,0) == 0)
EndFunction

int function ProcessUserBufferKeyTrapExemption(int nKey)
If !(UserBufferIsActive() && UserBufferIsTrappingKeys()) then
	return false
EndIf
If !(NKey == KEY_LEFT_WINDOWS
|| nKey == KEY_RIGHT_WINDOWS
|| nKey == KEY_CONTEXT
|| nKey == KEY_LEFT_ALT_TAB
|| nKey == KEY_RIGHT_ALT_TAB
|| nKey == KEY_ALT_TAB) then
	return false
EndIf
UserBufferDeactivate()
;The following keys would have been eaten, so send them through:
If nKey == KEY_LEFT_WINDOWS
|| nKey == KEY_RIGHT_WINDOWS then
	ActivateStartMenu ()
ElIf NKey == KEY_CONTEXT then
	TypeKey(cksShiftF10)
EndIf
return true
EndFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
let WindowClosed = false
let ClipboardTextChanged = false
Let gbSideBarCheck = FALSE
ProcessBXModifiedKey(strKeyName)
if DiagnosticTestingKeys(nKey,strKeyName) then
	return true
endIf
If !nIsScriptKey then
	;Do not remove this line!
	;Necessary to reset all relevant options for the insert tab under Virtual Cursor feature
	ResetVirtualHook()
	if gbLockedKeyboard then
		if nKey == key_Insert
		|| nKey == key_CapsLock
		|| nKey == key_Control then
			;wait to see if this is part of an allowable key combination,
			;since these keys trigger the KeyPressedEvent on key down.
			;Timer should allow for slow fingering of the key conbination.
			let giScheduleNotifyLockedKeyboard = ScheduleFunction("NotifyLockedKeyboard",15)
		else
			NotifyLockedKeyboard()
		EndIf
		return true
	EndIf
EndIf
if gbKeyboardHelp
|| ProcessUserBufferKeyTrapExemption(nKey) then
	return true
EndIf
return false
EndFunction

int function ProcessHJDialogKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
;All KeyPressedEvent code specific to HJDialogs should be in this function.
var
	handle hFocus
If !InHjDialog() then
	;allow KeyPressedEvent to continue by returning false
	return false
EndIf
If KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	let hFocus=getFocus()
	if GetWindowClass(hFocus) == cWcListView then
		;customize list views could be named anything,
		;but they have multiple columns in them.
		if lvGetNumOfColumns (hFocus) > 1
		|| GetWindowName(GetParent(GetParent(hFocus))) == wn_CustomizeListViewHeaders then
			Delay(1)
			SayLine ()
		EndIf
	EndIf
	BrailleRefresh()
EndIf
;stop KeyPressedEvent from further processing,
;so that other function called by KeyPressedEvent do not need to exception if inHJDialog
return true
EndFunction

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	handle hFocus,
	int iAttrib
If !KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	return false
EndIf
let hFocus=getFocus()
If GetWindowClass(hFocus) == cwc_Listview20wndclass   Then
	let iAttrib = getControlAttributes()
	If iAttrib & ctrl_checked then
		IndicateControlState(wt_checkbox,ctrl_checked)
	Elif iAttrib & ctrl_unchecked then
		IndicateControlState(wt_checkbox,ctrl_unchecked)
	EndIf
	return true
elif GetWindowSubtypeCode(hFocus) == WT_LISTBOX then
	Delay (1)
	DoStateForGraphics ()
	return true
;For the Nullsoft Install systems, or any other OSM-based tree views.
;These respond to TreeViewCheckBoxes, but do not respond to MSAA (objStateChangedEvent)
elIf controlCanBeChecked()
&& GetWindowSubtypeCode(hFocus) == WT_TREEVIEW
;MSAA must not be valid state for these to work.
;Where getObjectState (MSAA / .Net / UIA or anything else modern is handled in objStateChangedEvent
&& !getObjectState (TRUE) then
	delay (2, TRUE)
	;Because these are OSM-based, ControlCanBeChecked and bits from getControlAttributes for
	;checked and unchecked will work.
	;But this must not be used where objStateChangedEvent picks up the state change (more modern controls).
	;hensce there is no default, we only do checked or unchecked.
	let iAttrib = getControlAttributes()
	if iAttrib & CTRL_CHECKED then
		sayMessage (OT_ITEM_STATE, cMSG_checked)
	elIf iAttrib & CTRL_UNCHECKED then
		sayMessage (OT_ITEM_STATE, cmsg_notchecked)
	endIf
	return true
EndIf
;returning false will allow succeeding KeyPressedEvent functions to run:
return false
EndFunction

void function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
;This function can be used to specify behavior in KeyPressedEvent which does not belong in any of the other functions called by that event.
;Currently, the other function are:
;PreProcessKeyPressedEvent, intended for all code which must be processed before any other
;ProcessHJDialogKeyPressed, handles all special processing for HJ dialogs
;ProcessSpaceBarKeyPressed, intended to be overwritten for any behavior tied to the spacebar
if ((!nIsScriptKey
&& StringLength (strKeyName) == 1)
|| StringCompare (strKeyName, "backspace", false) == 0)
&& IsSecondaryFocusActive ()
	giScheduledSaySecondaryFocusSelectedItem = ScheduleFunction ("SaySecondaryFocusSelectedItem", 3, true)
endIf
EndFunction

Void Function KeyPressedEvent (int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
;Do not rearrange the code in this event,
;the tests must occur in the order listed.
if PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
	return
EndIf
if ProcessHJDialogKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
	return
EndIf
if ProcessSpaceBarKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
	return
EndIf
ProcessKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
EndFunction

void Function DoStateForGraphics ()
var
	int nState,
	string sGraphic,
	string sStateMessage;Only for "partially checked"
if (IsJavaWindow (GetFocus ())) then
	return
endIf
SaveCursor ()
InvisibleCursor ()
RouteInvisibleToPC ()
PriorWord ()
If ! (GetCharacterAttributes () & ATTRIB_GRAPHIC) then
	Return
EndIf
Let sGraphic = StringLower(GetCharacter ())
RestoreCursor ()
If ! (StringContains(sGraphic, StringTrimTrailingBlanks(cMSG_checked))) then;This is not a graphic that indicates State.
	Return
EndIf
If StringContains(sGraphic, StringTrimTrailingBlanks(cmsg294_S))
|| StringContains(sGraphic, StringTrimTrailingBlanks(cscUnchecked)) then
	Let nState = CTRL_UNCHECKED
Else
	Let nState = CTRL_CHECKED
EndIf
;The subtype we use here is WT_CHECKBOX,
;Because most list controls don't treat these like radio buttons.
;Now in those rare instances, such as Add/Remove Windows Components,
;We have to monitor for "Partially" and pass graphic name as optional parameter.
If StringContains(sGraphic, StringTrimTrailingBlanks(cMSG_partiallyChecked)) then
	IndicateControlState (WT_CHECKBOX, nState, sGraphic)
Else
	IndicateControlState (WT_CHECKBOX, nState)
EndIf
EndFunction
int function PlayJCFSoundFile(string jcfSection, string jcfSoundFileKey)
var
	string sSoundFile
let sSoundFile = GetSoundFileLocation(
	IniReadString(jcfSection, jcfSoundFileKey, cscNull,
		GetActiveConfiguration()+cScPeriod+jcfFileExt))
if !sSoundFile then
	let sSoundFile = GetSoundFileLocation(
		IniReadString(jcfSection, jcfSoundFileKey, cscNull, DefaultJcfFile))
EndIf
if sSoundFile then
	PlaySound(sSoundFile)
	return true
else
	return false
EndIf
EndFunction

void function KeymapChangedEvent(int iKeyCode, string sKeyName, int iKeyStatus)
var
	string sSoundFile
if iKeyStatus == KeySequenceStart
|| iKeyStatus  == KeySequenceRestarted then
	let GlobalActiveLayer = BasicLayerActive
	PlayJCFSoundFile(section_options,hKey_KeyLayerSound)
	return
elif iKeyStatus == KeySequencePending then
	if GlobalActiveLayer == BasicLayerActive
		HandleBasicLayerKeys(sKeyName)
	elIf GlobalActiveLayer == VolumeLayerActive then
		HandleVolumeLayerKeys(sKeyName)
	elIf GlobalActiveLayer == FaceInViewLayerActive then
		HandleFaceInViewLayerKeys(sKeyName)
	else
		let GlobalActiveLayer = NoLayerActive
	endIf
elif iKeyStatus == KeySequenceComplete
	if GlobalActiveLayer == TableLayerActive then
		PlayJCFSoundFile(section_options,hKey_TableLayerExitSound)
	EndIf
	let GlobalActiveLayer = NoLayerActive
ElIf iKeyStatus == KeySequenceCanceled
	if GlobalActiveLayer == TableLayerActive
	|| GlobalActiveLayer == OCRLayerActive
	|| GlobalActiveLayer == EchoLayerActive
	|| GlobalActiveLayer == VolumeLayerActive
	|| GlobalActiveLayer == JAWSVolumeLayerActive
	|| GlobalActiveLayer == SystemVolumeLayerActive
	|| GlobalActiveLayer == SoundBalanceLayerActive
		PlayJCFSoundFile(section_options,hKey_TableLayerExitSound)
	EndIf
	let GlobalActiveLayer = NoLayerActive
EndIf
EndFunction

void function HandleBasicLayerKeys(string sKeyName)
if StringCompare(sKeyname,KeyLayer_Table) == 0 then
	if InTable ()
	|| gbKeyboardHelp
		let GlobalActiveLayer = TableLayerActive
		SayMessage(ot_status,cmsgTableLayerStart_L,cmsgTableLayerStart_S)
	else; Table layer outside of tables was confusing users.
		let GlobalActiveLayer = NoLayerActive
		sayFormattedMessage (OT_ERROR, cMSGNotInTable_l)
		CancelLayeredKeySequence()
	endIf
elif StringCompare(sKeyName,KeyLayer_OCR) == 0 then
	if !(GetRunningFSProducts() & product_JAWS) then
		let GlobalActiveLayer = NoLayerActive
		CancelLayeredKeySequence()
		return
	endIf
	let GlobalActiveLayer = OCRLayerActive
	SayMessage(ot_status,cmsgOCRLayer_Start)
elif StringCompare(sKeyName,KeyLayer_Inspect) == 0 then
	;this block is only true for browsers.
	let GlobalActiveLayer = InspectLayerActive
	SayMessage(ot_status,cmsgInspectLayer_Start)
elif StringCompare(sKeyName,KeyLayer_Skype) == 0 then
	;this block is only true for browsers.
	let GlobalActiveLayer = SkypeLayerActive
	SayMessage(ot_status,cmsgSkypeLayer_Start)

elif StringCompare(sKeyName,KeyLayer_Picture) == 0 then
	if (IsPictureSmartEnabled()) then
		let GlobalActiveLayer = DescribeLayerActive
		SayMessage(ot_status, cmsgPictureSmartLayer_Start)
	endif
elif StringCompare(sKeyName,KeyLayer_SkypeDesktop) == 0 then
	let GlobalActiveLayer = SkypeDesktopLayerActive
	SayMessage(ot_status, cmsgSkypeDesktopLayer_Start)
elif StringCompare(sKeyName,KeyLayer_Echo) == 0 then
	let GlobalActiveLayer = EchoLayerActive
	SayMessage(ot_status,cmsgMouseEchoLayerStart_L,cmsgMouseEchoLayerStart_S)
elif StringCompare(sKeyName,KeyLayer_Viewer) == 0 then
	let GlobalActiveLayer = ViewerLayerActive
	SayMessage(ot_status,cmsgViewerLayer_Start)
elif StringCompare(sKeyName,KeyLayer_Volume) == 0 then
	let GlobalActiveLayer = VolumeLayerActive
	SayMessage(ot_status,cmsgVolumesLayer_Start)
elif StringCompare(sKeyName,KeyLayer_FaceInView) == 0 then
	GlobalActiveLayer = FaceInViewLayerActive
	SayMessage(ot_status,cmsgFaceInViewLayer_Start)
endIf
EndFunction

void function HandleVolumeLayerKeys(string sKeyName)

; Volume layer has four secondary layers, JAWS volume, System volume, sound balance and sound cards:
if StringCompare(sKeyName,KeyLayer_Volume_JAWS) == 0 then
	let GlobalActiveLayer = JAWSVolumeLayerActive
	SayMessage(ot_status,cmsgJAWSVolumeLayer_Start)
elIf StringCompare(sKeyName,KeyLayer_Volume_System) == 0 then
	let GlobalActiveLayer = SystemVolumeLayerActive
	SayMessage(ot_status,cmsgSystemVolumeLayer_Start)
elIf StringCompare(sKeyName,KeyLayer_Volume_Balance) == 0 then
	let GlobalActiveLayer = SoundBalanceLayerActive
	SayMessage(ot_status,cmsgSoundBalanceLayer_Start)
elIf StringCompare(sKeyName,KeyLayer_Volume_SoundCards) == 0 then
	let GlobalActiveLayer = SoundCardsLayerActive
	SayMessage(ot_status,cmsgSoundCardsLayer_Start)
endIf

EndFunction

script ExitTableLayer()
PlayJCFSoundFile(section_options,hKey_TableLayerExitSound)
EndScript

script ExitVolumeLayer()
PlayJCFSoundFile(section_options,hKey_TableLayerExitSound)
EndScript

script VolumesLayerHelp ()
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cmsgVolumeLayerHelpScreenTitle)
UserBufferAddTextResultsViewer(cmsgVolumeLayerHelp)
EndScript

script SystemVolumeLayerHelp ()
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cmsgSystemVolumeLayerHelpScreenTitle)
UserBufferAddTextResultsViewer (cmsgSystemVolumeLayerFirstLine)
UserBufferAddTextResultsViewer(cmsgJAWSAndSystemVolumesLayerHelp)
EndScript

script JAWSVolumeLayerHelp ()
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cmsgJAWSVolumeLayerHelpScreenTitle)
UserBufferAddTextResultsViewer (cmsgJAWSVolumeLayerFirstLine)
UserBufferAddTextResultsViewer(cmsgJAWSAndSystemVolumesLayerHelp)
EndScript

void function setVolume (int whichVolume, int moveValue, int VolumeDirection)
var
	int volumeSetting, int min, int max

	if WhichVolume == VOLUME_SYSTEM then
	min = 10
	max = 100
	VolumeSetting = getSystemVolume ()
	if VolumeDirection == V_Up then
		VolumeSetting = VolumeSetting + moveValue
	elIf VolumeDirection == V_Down then
		VolumeSetting = VolumeSetting - moveValue
	endIf
	if VolumeSetting < min then VolumeSetting = min endIf
	if VolumeSetting > max then VolumeSetting = max endIf
	setSystemVolume (VolumeSetting)
elIf WhichVolume == VOLUME_JAWS then
	GetVoiceVolumeRange (min, max)
	VolumeSetting = getVoiceVolume (VCTX_GLOBAL)
	if VolumeDirection == V_Up then
		VolumeSetting = VolumeSetting + moveValue
	elIf VolumeDirection == V_Down then
		VolumeSetting = VolumeSetting - moveValue
	endIf
	min = 10
	if VolumeSetting < min then VolumeSetting = min endIf
	if VolumeSetting > max then VolumeSetting = max endIf
	setVoiceVolume (VCTX_GLOBAL, volumeSetting, TRUE)
endIf
Say (FormatString (cmsgPercentage, volumeSetting),ot_status)
endFunction

script SystemVolumeDownSmall ()
setVolume (VOLUME_SYSTEM, VOLUME_SMALL, V_Down)
endScript

script SystemVolumeUpSmall ()
setVolume (VOLUME_SYSTEM, VOLUME_SMALL, V_Up)
endScript

script SystemVolumeDownLarge ()
setVolume (VOLUME_SYSTEM, VOLUME_LARGE, V_Down)
endScript

Script SystemVolumeUpLarge ()
setVolume (VOLUME_SYSTEM, VOLUME_LARGE, V_Up)
endScript

script JAWSVolumeDownSmall ()
setVolume (VOLUME_JAWS, VOLUME_SMALL, V_Down)
endScript

script JAWSVolumeUpSmall ()
setVolume (VOLUME_JAWS, VOLUME_SMALL, V_Up)
endScript

script JAWSVolumeDownLarge ()
setVolume (VOLUME_JAWS, VOLUME_LARGE, V_Down)
endScript

script JAWSVolumeUpLarge ()
setVolume (VOLUME_JAWS, VOLUME_LARGE, V_Up)
endScript

string function GetCurrentListViewItemName()
var
	handle hWnd
let hWnd = GetCurrentWindow()
if lvIsCustomized(hWnd) then
	return lvGetUserDefinedItemText(hWnd,lvGetFocusItem(hWnd))
ElIf IsMSAAWindow(hWnd) then
	return GetObjectName()
else
	return GetObjectValue()
EndIf
EndFunction

int function rangeOverlapPercent(int left1, int right1, int left2, int right2)
; Returns the maximum percentage of the two given ranges shared by both ranges.
; The order of the ranges does not matter, but left1<=right1 and left2<=right2 are assumed.
; Of course, left/right are for convenience; the orientation of the line is immaterial.
var
	int l1, int l2, int l3
let l1 = right1-left1
let l2 = right2-left2
let left1 = max(left1, left2)
let right1 = min(right1, right2)
let l3 = right1-left1
if l3 < 0 then
	return 0
endIf
return max( 100*l3/l1, 100*l3/l2)
endFunction

globals
	collection cLastLVFInfo

collection function getListViewFieldInfo(handle hwnd)
; Returns info about the given ListView field or null if not applicable.
; Collection properties returned: hwnd, left, right, top, bottom, name, value, colno, colcount, rowno, rowcount, tickcount.
var collection info, collection null

; Check structure of controls first.
if !isTrueListView(getParent(hwnd))
|| getWindowTypeCode(getFirstWindow(hwnd)) != WT_HeaderBar
then
	return null
endIf

; If we cached this recently, just use that.
; This helps with Braille and lets Braille and speech calls share results.
if cLastLVFInfo then
	if cLastLVFInfo.hwnd == hwnd
	&& getTickCount() -cLastLVFInfo.tickcount < 500
	then
		return cLastLVFInfo
	endIf
endIf

; Get the left edge and width of the given field.
var object oField, int childID
let oField = getObjectFromEvent(hwnd, ObjID_Client, 0, childID)
if !oField then
	return null
endIf
var int fLeft, int fTop, int fWidth, int fHeight
oField.accLocation(intRef(fLeft), intRef(fTop), intRef(fWidth), intRef(fHeight), childID)
if !fLeft && !fTop && !fWidth && !fHeight then
	return null
endIf

; Get the header object and that of the list itself (for later).
var object oHeader = getObjectFromEvent(getFirstWindow(hwnd), ObjID_Client, 0, childID)
if !oHeader then
	return null
endIf
var object oList = getObjectFromEvent(getParent(hwnd), ObjID_Client, 0, childID)
if !oList then
	return null
endIf

; Scan headers for a significant left/width match.
var int hLeft, int hTop, int hWidth, int hHeight
var int n = oHeader.accChildCount
let childID = 1
while childID <= n
	let hLeft = 0
	let hTop = 0
	let hWidth = 0
	let hHeight = 0
	oHeader.accLocation(intRef(hLeft), intRef(hTop), intRef(hWidth), intRef(hHeight), childID)
	if hLeft || hTop || hWidth || hHeight then
		if rangeOverlapPercent(fLeft, fLeft+fWidth, hLeft, hLeft+hWidth) > 50 then
			; We finally found what we need.
			info = new collection
			info.hwnd = hwnd
			; MSAA coordinates are 0-based but JAWS coordinates are 1-based.
			info.left = fLeft +1
			info.right = info.left +fWidth
			info.top = fTop +1
			info.bottom = info.top +fHeight
			info.name = oHeader.accName(childID)
			; This can help because getObjectValue() can miss what's not on screen.
			info.value = oField.accValue(0)
			info.colno = childID
			info.colcount = n
			if !info.colcount then
				; This may not happen but is here in case.
				info.colcount = oHeader.accNavigate(NavDir_LastChild, 0)
			endIf
			info.rowno = oList.accSelection +0
			info.rowcount = oList.accChildCount +0
			if !info.rowcount then
				; ListViews have been seen to have no row count. [DGL, 2012-02-14]
				info.rowcount = oList.accNavigate(NavDir_LastChild, 0)
			endIf
			info.tickcount = getTickCount()
			cLastLVFInfo = info
			return info
		endIf
	endIf
	let childID = childID +1
endWhile
return null
endFunction

int function HJDialogObjStateChangeSpoken(handle hObj, int iObjType, int nChangedState, int nState, int nOldState)
var
	int iCtrl,
	handle hTemp,
	int i,
	string sText
if !InHJDialog() then
	return false
EndIf
;For tree views:
If iObjType == WT_TREEVIEW ||
iObjType == WT_TREEVIEWITEM then
	SayTreeViewLevel (FALSE)
	Return TRUE;
EndIf
if GetWindowName(GetRealWindow(hObj)) == wn_CustomizeListViewHeaders then
	if iObjType == wt_button
	&& !nState
	&& nOldState == CTRL_PRESSED then
		let iCtrl = GetControlID(hObj)
		if iCtrl == ID_ToggleSpeechBtn
		|| iCtrl == ID_ToggleBrailleBtn then
			let hTemp = GetFirstWindow(hObj)
			let i = 1
			let sText = LVGetItemText(hTemp,LVGetFocusItem(hTemp),i)
			while sText && i<=32
				Say(sText,ot_screen_message)
				let i = i+1
				let sText = LVGetItemText(hTemp,LVGetFocusItem(hTemp),i)
			EndWhile
			return true
		EndIf
	EndIf
EndIf
if iObjType == wt_button then
	if GetControlID(hObj) == id_JAWSOptionsExecuteButton then
		if !nState then
			;Announce the change in the Options tree when the Execute button toggles it:
			Say(tvGetFocusItemText(GetFirstWindow(hObj)),ot_line)
			return true
		EndIf
	EndIf
EndIf
return false
EndFunction

int function ShouldWinformsControlBeSilent (handle hControl)
; for .Net applications,
; either the focus window or its parent will be winForms.
; Where the focus is an edit, check parent as winForms for edit combobox who are dropped down for the first time.
if IsWinFormsWindow (hControl)
|| (IsWinFormsWindow (getParent (hControl)) && getWindowClass (hControl) == cwc_Edit)
|| stringStartsWith (getWindowClass (hControl), "WindowsForms")
|| stringStartsWith (getWindowClass (getParent (hControl)), "WindowsForms") then
	var int winformsSubtype = getObjectSubtypeCode(SOURCE_CACHED_DATA) ; window subtype is invalid for this test.
	if winformsSubtype == wt_editcombo
	|| winformsSubtype == WT_COMBOBOX
	|| winformsSubtype == WT_LISTBOXITEM
	|| winformsSubtype == WT_LISTBOX
	|| winformsSubtype == WT_LISTVIEW then
		return TRUE
	endIf
endIf
endFunction

globals string prevWinFormsListItemName, string prevWinFormsListItemPosition;

int function IsWinFormListItemUnchanged ()
var int result, string name = getObjectName(SOURCE_CACHED_DATA), string position = positionInGroup ()
result = (name == prevWinFormsListItemName
&& position == prevWinFormsListItemPosition)
prevWinFormsListItemName = name prevWinFormsListItemPosition = position
return result
endFunction

void function dumpWinformsListItemGlobals ()
prevWinFormsListItemName = cscNull
prevWinFormsListItemPosition = cscNull
endFunction

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
dumpWinformsListItemGlobals () ; alt+up and down arrow in winForms list boxes
if hObj != GetFocus() then
	return
EndIf
if nSelectingText then
	return
EndIf
if HJDialogObjStateChangeSpoken(hObj,iObjType,nChangedState,nState,nOldState) then
	return
EndIf
if ShouldWinformsControlBeSilent (hObj) return endIf
var string windowClass = GetWindowClass(hObj)
;Announce the list item when it changes state:
if iObjType == wt_ListBoxItem
|| iObjType == wt_ExtendedSelect_ListBox
|| iObjType == wt_MultiSelect_ListBox then
	if (!nState || nChangedState == CTRL_SELECTED)
	&& !InHJDialog()
	&& windowClass != cwc_ComboLBox
		return ObjStateChangedForListBoxxes(hObj, iObjType, nChangedState, nState, nOldState)
	EndIf
EndIf
if iObjType == wt_ListViewItem
	;a listview item may have a control state of 0 if the item is not selected,
	;which causes nothing to be spoken for the control state.
	;Since it would be useful to announce the item is being deselected,
	;we'll test the old state to determine if we should announce deselection:
	if !nChangedState && (nOldState & CTRL_SELECTED)
		Say(cscNotSelected, ot_item_state)
	else
		IndicateControlState(iObjType, nChangedState)
	endIf
	return
endIf
;For the rest of the object types, do not announce change to unavailable state:
if nState == CTRL_GRAYED then
	return
EndIf
if iObjType == wt_RadioButton then
	;if the radio buttons are items in a treeview,
	;then speak them as we would speak a treeview item:
	if GetObjectSubtypeCode(SOURCE_CACHED_DATA) == wt_TreeView then
		SayTreeViewItem()
	elif IsJavaWindow(hObj) then
		IndicateControlState(iObjType, nChangedState)
	elif IsVirtualPCCursor() then
		;when the button has focus but the state has not been toggled,
		;as in after using MoveToField script,
		;obj state changed event will fire when the state changes.
		;If the button has been arrowed to,
		;the focus changes event fires and the obj state changed event does not.
		;To be consistent with the way the button is announced when the focus change happens,
		;the entire object is announced on state change,
		;not merely the state change.
		SayObjectTypeAndText()
	EndIf
	;For all other radio buttons, focusChangedEvent should announce when radio buttons gain focus.
	return
EndIf
if iObjType == WT_TREEVIEW
|| iObjType == WT_TREEVIEWITEM then
	;don't do this if the old state is selected and the new state is not selected
	if ((nOldState&CTRL_SELECTED) && !(nState&CTRL_SELECTED)) then
		;do nothing
	else
		SayTreeViewLevel (InHjDialog ())
	EndIf
ElIf iObjType == wt_button
|| iObjType == wt_StartButton
|| iObjType == wt_Checkbox then
	;for buttons, we do not want announcement of the pressed state.
	if !(nState & ctrl_pressed) then
		if nState & CTRL_Indeterminate then
			;announce only partially checked, not the checked which is also set
			;Must also indicate required or invalid states so can't just pass CONTROL_INDETERMINATE, instead,
			;mask off checked and unchecked
			IndicateControlState(iObjType,nState&~(CTRL_CHECKED|CTRL_UNCHECKED))
		else
			IndicateControlState(iObjType,(nState & ~ctrl_selected))
		EndIf
	EndIf
elif ( iObjType == WT_TOGGLE_BUTTON
&& nOldState == CTRL_PRESSED ) then
	IndicateControlState(iObjType, 0, cmsgNotPressed_l )
else
	;Add check for menus of header bar controls:
	if iObjType == WT_MENU
	&& ! ( nState & ( CTRL_UNCHECKED | CTRL_CHECKED ) )
	&& nOldState & CTRL_CHECKED then
		Let nChangedState = ( nChangedState | CTRL_UNCHECKED )
		Let iObjType = WT_CHECKBOX ; so state indication will be right
	endIf
	IndicateControlState(iObjType, nChangedState)
endIf
EndFunction

void function ObjStateChangedForListBoxxes(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if SayLBDeselectedItemScheduleID != 0
	UnscheduleFunction(SayLBDeselectedItemScheduleID)
	SayLBDeselectedItemScheduleID = 0
endIf
;When the item becomes selected, we only announce the name, not the state.
;Must fill out all parameters for Say, so that speech markup is honored for customize list view:
;When the item becomes deselected, "Not Selected" is part of the name, so we don't need to explicitly announce it.
if nChangedState == CTRL_SELECTED
	Say(GetCurrentListViewItemName(),ot_line, lvIsCustomized (hObj))
	return
endIf
; When some listboxes are navigated,
; the current list item becomes deselected before focus moves to the next list item.
; To prevent announcement of the deselection in these cases
; we schedule announcement of the deselected listbox item,
; and retest before announcing to determine if we really should announce the deselection.
SayLBDeselectedItemScheduleID = ScheduleFunction("SayLBDeselectedItem", ListBoxItemDeselectWaitTime)
EndFunction

void function SayLBDeselectedItem()
SayLBDeselectedItemScheduleID = 0
if GetObjectStateCode() & STATE_SYSTEM_SELECTED
	return
endIf
Say(GetCurrentListViewItemName(),ot_line, lvIsCustomized (GetFocus()))
EndFunction

Void Function FocusPointMovedEvent (int nX, int nY, int nOldX, int nOldY, int nUnit, int nDir, int nTimeElapsed)
; Add your code for FocusPointMovedEvent here.
; Changes made here apply to all applications.
; To make your changes application specific, copy this function to an
; application script file.
EndFunction

void function MonitorNewTextEventAlerts(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
;used to monitor special alerts such as chat programs
EndFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
;overwrite this function to silence new text
var
	int iSubtype,
	string sClass,
	int objectSubtypeCode
if (nAttributes&ATTRIB_OCR_TEXT) && (GetScreenEcho () == ECHO_ALL) then
	return false
endIf
; Prevent the clock from continuously announcing the hour.
; This was a change caused by an updated vid.
if GetScreenEcho () < ECHO_ALL && getWindowSubtypeCode (hwnd) == WT_CLOCK then return TRUE endIf
if GetMenuMode() != MENU_INACTIVE
&& !sFrameName then
	return true
EndIf
if ProcessSelectText(nAttributes,buffer) then
	return true
endIf
if (UsingEnhancedEditSupport(hWnd) || IsVirtualPcCursor ())
&& (sFrameName==cscNull || (sFrameName!=cscNull && (nAttributes&attrib_highlight)))then
	; determine if selected text is coming from action of selecting
	; selection is handled internally but other highlights are not!
	if GetTickCount() -nLastSelectUnitTime < 750
	;SelectEntireDocument fails the timer test,
	;and it will fire once per each line that was selected:
	|| !DialogActive() then
		return true ; handled by internal code which calls TextSelectedEvent
	endIf
endIf
iSubtype = GetWindowSubtypeCode(hFocus)
sClass = GetWindowClass(hWnd)
objectSubtypeCode = GetObjectSubtypeCode()
if ShouldWinformsControlBeSilent (hwnd)
&& not isWindows8 () ; win 8 or higher, 7 uses valueChangedEvent in this context.
	return TRUE
endIf
if hWnd == hFocus
	if sClass == cwcListView
	|| stringContains (sClass, cwcListView) ; winForms listView controls
	|| sClass == cwc_SysTreeView32
	|| sClass == cwc_ListBox
	|| iSubtype == wt_ComboBox
	|| iSubtype == wt_Edit_SpinBox
	|| objectSubtypeCode == WT_Calendar
	|| GetWindowClass(GlobalFocusWindow) == cwc_ComboLBox then
		return true
	EndIf
EndIf
If hWnd != hFocus
	if sClass == cwc_ComboLBox then
		; Avoids double speech on arrowing in open combos and edit combos
		return true
	elif sClass == cWcListView
	&& iSubtype == wt_editCombo
		if GetWindowClass(GetParent(hWnd)) == cwc_AutoSuggestDropdown
			; Avoids double speaking for edit combo dropdown lists
			return true
		endIf
	elif (sClass == cwc_ListBox && isWindows8())
		return true
	endIf
	If iSubtype == WT_TASKBAR then
		;Probably, this is a new conversation.
		;Failing to bail out will make JAWS repeat.
		Return true
	EndIf
EndIf
; Ignore new text from windows on nonfocused threads.
; Override this function to change that behavior.
if (!DoesWindowBelongToFocusedThread(hwnd)) then
	return true
EndIf
return false
EndFunction

Void Function ProcessSpeechOnNewTextEvent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
;overwrite this function to handle the way new text is spoken
if nAttributes& ATTRIB_HIGHLIGHT then
	SayHighlightedText(hwnd,buffer)
else
	SayNonHighlightedText(hwnd,buffer)
endIf
EndFunction

Void Function NewTextEvent(handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
var
	handle hFocus
;Handles all newly written text.
;If the text is contained in a frame, then the frame name is passed as a parameter.
;For most compatible results, overwrite the functions called in this function rather than overwriting this function itself.
let hFocus = GetFocus()
MonitorNewTextEventAlerts(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
if NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName) then
	return
EndIf
ProcessSpeechOnNewTextEvent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

Void Function SayHighLightedText (handle hwnd, string buffer)
; HighlightedText Function for speaking all newly written highlighted
; text.
var
	int iWinType,
	string strVal,
	string sClass
If GlobalMenuMode > 1
&& IsMSAAWindow(hWnd) then
	If hWnd != GetCurrentWindow() then
		Return;Let ActiveItemChangedEvent do its job.
	EndIf
EndIf
if hwnd == GetFocus()
&& SupportsEditCallbacks()
	return; text will be spoken by SelectionChangedEvent
EndIf
if GetScreenEcho() then
	Say(buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
endIf
EndFunction

Void Function SayNonHighlightedText (handle hwnd, string buffer)
; NonHighlightedText  Function for speaking all newly written nonhighlighted
; text.
If GetScreenEcho () > ECHO_NONE
&& hWnd == GetFocus()
	If GetWindowClass(GetFocus()) == cwc_ConsoleWindow
	&& GetTickCount()-LastLineNavigationTick > NavigationByLineTickThreshold
		;New text should be spoken only if it is not a result of navigation by line.
		;This prevents double speaking when navigating through a command history,
		;since the SayLineUnit will already have spoken the new text.
		Say(buffer, OT_NONHIGHLIGHTED_SCREEN_TEXT)
		;Now clear LastLineNavigationTick, just in case more new text appears shortly after the navigation.
		LastLineNavigationTick = 0
		Return
	endIf
endIf
if (GetScreenEcho() > 1) then
	Say (buffer, OT_NONHIGHLIGHTED_SCREEN_TEXT)
endIf
EndFunction

void function SayTextselection(string Select, string sText, int bUseOTChar, optional int bContainsSpeechMarkup)
var
	int OT
;OT should be Word unless selecting by char so that each unit selected doesn't have its case indicated
;unless the user has requested the indication for Words
if bUseOTChar then
	let OT = OT_CHAR
else
	let OT = OT_WORD
endIf
if GetRunningFSProducts() == product_MAGic then
	Say(sText,OT,bContainsSpeechMarkup)
else
	If nSaySelectAfter then
		Say(sText,OT,bContainsSpeechMarkup)
		SayMessage(OT_SELECT, select)
	Else
		SayMessage(OT_SELECT, select)
		Say(sText,OT,bContainsSpeechMarkup)
	EndIf
EndIf
EndFunction

Void Function SelectingText(int nMode)
; handles setting up for and finishing the process of selecting text
; called by each of the scripts which does text selection
var
	string strHighlightAfterSelect,
	string strUnselected,
	string strNewlySelected,
	int nChanged,
	int nStart,
	int nChars,
	int nLen,
	int nLeft,
	int nTop,
	int nRight,
	int nBottom
if UsingEnhancedEditSupport(GetFocus()) then
	if (nMode) then
		let nLastSelectUnitTime=GetTickCount()
	endIf
	return ; handled by internal code which calls TextSelectedEvent
endIf
if nMode then
	let g_strHighlightBeforeSelect = GetSelectedText()
	let nSelectingText = nMode
else
	delay(1)
	ProcessNewText()
	let nSelectingText = 0
	if IsVirtualPCCursor()
	&& IsJavaWindow (GetFocus ()) == FALSE then
		return
	endIf
	let strHighlightAfterSelect = GetSelectedText()
	let	strUnselected = StringDiff(g_strHighlightBeforeSelect,strHighlightAfterSelect)
	if strUnselected then
		; if there's highlighted text prior to the selection command that
		; doesn't exist after the command, this is either because the command
		; deselected the text or the text scrolled off of the screen.
		; We assume that if the text was at the beginning of the old buffer
		; and it isn't in the new buffer, then it scrolled off.
		; This should be true except when selecting text from bottom to top,
		; and deselecting from top to bottom,
		; something that most people probably don't do
		if ! StringsOverlap(g_strHighlightBeforeSelect,strHighlightAfterSelect,nStart,nChars)
		|| nStart<2 then
			let nLen = stringLength(strUnSelected)
			SayTextSelection(cmsg214_L,strUnSelected,nLen==1)
			let nChanged = nChanged+1
		endIf
	endIf
	let strNewlySelected = StringDiff(strHighlightAfterSelect,g_strHighlightBeforeSelect)
	if strNewlySelected then
		let nLen = stringLength(strNewlySelected)
		SayTextSelection(cmsg215_L,strNewlySelected,
			nLen==1 || (nLen<=3 && stringContains(strNewlySelected,"\r")))
		let nChanged = nChanged+1
	endIf
	if !nChanged then
		;screen probably scrolled
		let nLen = stringLength(strHighlightAfterSelect)
		if StringsOverlap(g_strHighlightBeforeSelect,strHighlightAfterSelect,nStart,nChars) then
			let strNewlySelected =  stringRight(strHighlightAfterSelect,nLen-nChars)
			let nLen = stringLength(strNewlySelected)
			; Fixes problem where
			; string contained a newline char causing the word blank or a newline to be
			; indicated prior to speaking the newly selected text
			if stringLeft(strNewlySelected,1)==cScBufferNewLine
			&& nLen > 1
			&& substring(strNewlySelected,2,1) !=cScBufferNewLine then
				let strNewlySelected=stringChopLeft(strNewlySelected,1)
				let nLen=nLen-1;
			endIf
			SayTextSelection(cmsg215_L,strNewlySelected, nLen==1)
		else
			; strings didn't overlap, just speak the current line as being selected
			if GetItemRect (GetCursorCol(), GetCursorRow(), nLeft, nRight, nTop, nBottom, it_Line) then
				let strNewlySelected=GetTextInRect (nLeft, nTop, nRight, nBottom, attrib_Highlight, ignoreColor, ignoreColor, FALSE, FALSE)
			else
				let strNewlySelected=getLine()
			endIf
			let nLen = stringLength(strNewlySelected)
			SayTextSelection(cmsg215_L,strNewlySelected, nLen==1)
		endIf
	endIf
endIf
EndFunction

Int Function ProcessSelectText(int nAttributes,string buffer)
; called at the beginning of the NewTextEvent to check for and
; handle speaking of text being  selected/unselected.  If this function
; returns TRUE, then the NewTextEvent abandons regular processing.
var
	string smyBuf
if nSelectingText == 1 then
	;return TRUE to indicate that this text requires no further
	;handling in NewTextEvent
	return TRUE
else
	if nAttributes & ATTRIB_UNSELECTED then
	 	;only relevant when text is being selected/unselected
	 	;return TRUE to indicate that this text requires no further handling
		return  TRUE
	else
		return false ; allow regular processing
	endIf
endIf
if nAttributes & ATTRIB_HIGHLIGHT
|| nAttributes & ATTRIB_UNSELECTED then
	let smyBuf = Buffer
	if nAttributes & ATTRIB_UNSELECTED
	&& nSelectingText != 2 then
		let nSelectingText = 2
		if GetRunningFSProducts() & product_JAWS
		&& ShouldItemSpeak (ot_select) then
			let smyBuf = FormatString (cmsg214_L, buffer);unselected
		endIf
	elif nAttributes & ATTRIB_HIGHLIGHT
	&& nSelectingText != 4 then
		let nSelectingText = 4
		if GetRunningFSProducts() & product_JAWS
		&& ShouldItemSpeak (ot_select) then
			let smyBuf = FormatString (cmsg215_L, buffer);selected
		endIf
	endIf
	Say(smyBuf, ot_select)
	return true
else
	return FALSE
endIf
EndFunction

void function SayTopBottomUnit(int UnitMovement)
var
	int iSubtype
if SupportsEditCallbacks() then ;CaretMovedEvent will speak
	return
EndIf
let iSubtype = GetObjectSubtypeCode()
if iSubtype == wt_ListView
|| iSubtype == wt_ListBox
|| iSubtype == wt_ListBoxItem
|| iSubtype == wt_ExtendedSelect_ListBox
|| iSubtype == wt_MultiSelect_ListBox
|| iSubtype == wt_TreeView
|| iSubtype == wt_TreeViewItem
|| IsVirtualRibbonActive() then
	return
EndIf
delay (1)
if IsVirtualPCCursor () then
	SayLine ()
	return
endIf
if UnitMovement == UnitMove_Top then
	SayMessage(ot_JAWS_message, cmsg36_L, cmsg36_S) ;"top of file"
ElIf UnitMovement == UnitMove_Bottom then
	SayMessage(ot_JAWS_message, cmsg37_L, cmsg37_S) ;"bottom of file"
EndIf
SayLine()
EndFunction

Script TopOfFile()
JAWSTopOfFile()
SayTopBottomUnit(UnitMove_Top)
EndScript

Script BottomOfFile()
JAWSBottomOfFile()
SayTopBottomUnit(UnitMove_bottom)
EndScript

Script TouchTopOfFile()
if IsTouchSelectionModeActive()
	PerformScript SelectFromTop()
else
	PerformScript TopOfFile()
endIf
EndScript

Script TouchBottomOfFile()
if IsTouchSelectionModeActive()
	PerformScript SelectToBottom()
else
	PerformScript BottomOfFile()
endIf
EndScript

Script SayFont ()
; Identify Font
var
	string sFont,
	string sMessageLong
;If IsVirtualPcCursor () then ; No longer needed as we now support font info in Virtual Cursor
let sFont = GetFont ()
If ! sFont then
	SayMessage (ot_user_requested_information, cmsg38_S)
	Return
EndIf
If IsSameScript () then
	Let sFont = (FormatString (cMsgFontInformation, sFont))
	If UserBufferIsActive () then
		UserBufferClear ()
	EndIf
	SayMessage (OT_USER_BUFFER, sFont)
	AddHotKeyLinks ()
	Return
EndIf
let sMessageLong = FormatString (cmsg38_L, sFont)
SayFormattedMessage (ot_user_requested_information, sMessageLong, sFont) ;"Font is"
EndScript

void function lvSaySelectedText ()
var
	int bSpell,
	int nSpeak,
	int nBits,
	int iLvItem,
	int iLvSelectCount,
	handle hWnd,
	string sMessageLong,
	string sMessageShort
Let hWnd = GetFocus ()
Let iLvSelectCount = lvGetSelectionCount ()
If iLvSelectCount >= 2 then
	Let sMessageLong = FormatString (cmsgLVNumOfSelection_L, IntToString (iLvSelectCount))
	Let sMessageShort = FormatString (cmsgLVNumOfSelection_S, IntToString (iLvSelectCount))
	SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, sMessageLong, sMessageShort)
EndIf
Let sMessageShort = GetSelectedText ()
Let sMessageLong = FormatString (cmsg39_L, sMessageShort)
Let bSpell = IsSameScript ()
If bSpell then
	Let nSpeak = OT_SPELL
	;'fool' the message methods:
	Let sMessageLong = sMessageShort
Else
	Let nSpeak = ot_user_requested_information
EndIf
SayFormattedMessage (nSpeak, sMessageLong, sMessageShort)
EndFunction

Script SaySelectedText()
var
	int StartRow, int StartCol, int EndRow, int EndCol, string StartName, string EndName,
	int bSpell,
	string sSelectedText,
	string sMessageLong,
	int bUsingMarkup
If IsTrueListView(GetFocus())
&& GetSelectedText() then
	Return lvSaySelectedText ()
EndIf
if GetTableSelectionRange( StartRow, StartCol, StartName, EndRow, EndCol, EndName ) then
	let sMessageLong = FormatString( cmsgSelectedCells_L, StartName, EndName )
	sayFormattedMessage( ot_user_requested_information,sMessageLong )
EndIf
let bSpell = (IsSameScript() && GetRunningFSProducts() != product_MAGic)
if IsWindows7()
&& StringCompare(GetWindowName(GetRealWindow(GetFocus())),cWnStartMenu) == 0 then
	let sSelectedText = GetObjectName(SOURCE_CACHED_DATA)
else
	let sSelectedText = GetSelectedText (!bSpell);include markup in text if not spelling
EndIf
if IsPCCursor() && IsBrailleOnlyRegion() then
	SayFormattedMessageWithVoice (VCTX_MESSAGE, ot_help, cmsgBrlOnlyRegion_l, cmsgBrlOnlyRegion_s)
	return
endIf
If ! sSelectedText then
	SayMessage (ot_error, cmsgNothingSelected)
	Return
EndIf
if bSpell then
	SayFormattedMessage(OT_SPELL,sSelectedText)
	return
EndIf
let sMessageLong = FormatString(cmsg39_L,sSelectedText)
SayMessageWithMarkup(ot_user_requested_information,sMessageLong,sSelectedText)
EndScript

; **/1 Start of Selecting Text
Script SelectToEndOfLine()
if IsVirtualRibbonActive() then
	;Just pass the key through so JAWS can process it
	;The Virtual Ribbon code will speak the new item.
	TypeKey(cksSelectToEndOfLine)
	return
endIf
Let nSaySelectAfter = FALSE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectToEndOfLine ()
else
	SelectingText(TRUE)
	SelectToEndOfLine ()
	SelectingText(FALSE)
EndIf
EndScript

Script SelectFromStartOfLine()
if IsVirtualRibbonActive() then
	;Just pass the key through so JAWS can process it
	;The Virtual Ribbon code will speak the new item.
	TypeKey(cksSelectToStartOfLine)
	return
endIf
Let nSaySelectAfter = FALSE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectFromStartOfLine ()
else
	SelectingText(TRUE)
	SelectFromStartOfLine ()
	SelectingText(FALSE)
EndIf
EndScript

Script SelectNextLine()
var
	handle hWnd,
	int nSubType,
	int shouldCallSelectingText = True
let hWnd = GetFocus()
Let nSubType = GetWindowSubTypeCode (hWnd)
If !nSubType then
	Let nSaySelectAfter = FALSE
ElIf nSubType == WT_LISTVIEW then
	Let nSaySelectAfter = TRUE
ElIf nSubType == WT_TREEVIEW then
	Let nSaySelectAfter = TRUE
ElIf nSubType == WT_LISTBOX then
	Let nSaySelectAfter = TRUE
ElIf nSubType == WT_MULTISELECT_LISTBOX then
	shouldCallSelectingText = False
ElIf nSubType == WT_EXTENDEDSELECT_LISTBOX then
	Let nSaySelectAfter = TRUE
Else
	Let nSaySelectAfter = FALSE
EndIf
if (!IsJavaWindow(hWnd) && (IsVirtualPCCursor() || IsFormsModeActive()))
	shouldCallSelectingText = False
EndIf
if (!shouldCallSelectingText)
	SelectNextLine()
else
	SelectingText(TRUE)
	SelectNextLine()
	SelectingText(FALSE)
EndIf
EndScript

Script SelectPriorLine()
var
	handle hWnd,
	int nSubType,
	int shouldCallSelectingText = True
let hWnd = GetFocus()
Let nSubType = GetWindowSubTypeCode (hWnd)
If !nSubType then
	Let nSaySelectAfter = FALSE
ElIf nSubType == WT_LISTVIEW then
	Let nSaySelectAfter = TRUE
ElIf nSubType == WT_TREEVIEW then
	Let nSaySelectAfter = TRUE
ElIf nSubType == WT_LISTBOX then
	Let nSaySelectAfter = TRUE
ElIf nSubType == WT_MULTISELECT_LISTBOX then
	Let nSaySelectAfter = TRUE
	shouldCallSelectingText = False
ElIf nSubType == WT_EXTENDEDSELECT_LISTBOX then
	Let nSaySelectAfter = TRUE
Else
	Let nSaySelectAfter = FALSE
EndIf
if (!IsJavaWindow(hWnd) && (IsVirtualPCCursor() || IsFormsModeActive()))
	shouldCallSelectingText = False
EndIf
if (!shouldCallSelectingText)
	SelectPriorLine()
else
	SelectingText(TRUE)
	SelectPriorLine()
	SelectingText(FALSE)
EndIf
EndScript

Script SelectNextCharacter()
if IsVirtualRibbonActive() || RibbonsActive() then
	;Just pass the key through so JAWS can process it
	;The Virtual Ribbon code will speak the new item.
	TypeKey(cksSelectNextCharacter)
	return
endIf
Let nSaySelectAfter = TRUE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectNextCharacter ()
else
	SelectingText(TRUE)
	SelectNextCharacter ()
	SelectingText(FALSE)
EndIf
if !SupportsEditCallbacks() then
	;Only clear the flag if the selection speaking is not handled by SelectionChangedEvent.
	let nSaySelectAfter = false
endIf
EndScript

Script SelectPriorCharacter()
if IsVirtualRibbonActive() || RibbonsActive() then
	;Just pass the key through so JAWS can process it
	;The Virtual Ribbon code will speak the new item.
	TypeKey(cksSelectPriorCharacter)
	return
endIf
Let nSaySelectAfter = TRUE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectPriorCharacter ()
else
	SelectingText(TRUE)
	SelectPriorCharacter ()
	SelectingText(FALSE)
EndIf
if !SupportsEditCallbacks() then
	;Only clear the flag if the selection speaking is not handled by SelectionChangedEvent.
	let nSaySelectAfter = false
endIf
EndScript

Script SelectNextWord()
Let nSaySelectAfter = TRUE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectNextWord ()
else
	SelectingText(TRUE)
	SelectNextWord ()
	SelectingText(FALSE)
EndIf
if !SupportsEditCallbacks() then
	;Only clear the flag if the selection speaking is not handled by SelectionChangedEvent.
	let nSaySelectAfter = false
endIf
EndScript

Script SelectPriorWord()
Let nSaySelectAfter = TRUE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectPriorWord ()
else
	SelectingText(TRUE)
	SelectPriorWord ()
	SelectingText(FALSE)
EndIf
if !SupportsEditCallbacks() then
	;Only clear the flag if the selection speaking is not handled by SelectionChangedEvent.
	let nSaySelectAfter = false
endIf
EndScript

script SelectNextParagraph()
if IsVirtualRibbonActive() || RibbonsActive() then
	;Just pass the key through so JAWS can process it
	;The Virtual Ribbon code will speak the new item.
	TypeKey(cksSelectNextParagraph)
	return
endIf
Let nSaySelectAfter = TRUE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectNextParagraph()
else
	SelectingText(TRUE)
	SelectNextParagraph()
	SelectingText(FALSE)
EndIf
if !SupportsEditCallbacks() then
	;Only clear the flag if the selection speaking is not handled by SelectionChangedEvent.
	let nSaySelectAfter = false
endIf
EndScript

script SelectPriorParagraph()
if IsVirtualRibbonActive() || RibbonsActive() then
	;Just pass the key through so JAWS can process it
	;The Virtual Ribbon code will speak the new item.
	TypeKey(cksSelectPriorParagraph)
	return
endIf
Let nSaySelectAfter = TRUE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectPriorParagraph()
else
	SelectingText(TRUE)
	SelectPriorParagraph()
	SelectingText(FALSE)
EndIf
if !SupportsEditCallbacks() then
	;Only clear the flag if the selection speaking is not handled by SelectionChangedEvent.
	let nSaySelectAfter = false
endIf
EndScript

Script SelectNextScreen()
Let nSaySelectAfter = FALSE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectNextScreen ()
else
	SelectingText(TRUE)
	SelectNextScreen ()
	SelectingText(FALSE)
EndIf
EndScript

script SelectPriorScreen()
Let nSaySelectAfter = FALSE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectPriorScreen ()
else
	SelectingText(TRUE)
	SelectPriorScreen ()
	SelectingText(FALSE)
EndIf
EndScript

script SelectToBottom()
Let nSaySelectAfter = FALSE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectToBottom ()
else
	SelectingText(TRUE)
	SelectToBottom ()
	SelectingText(FALSE)
EndIf
EndScript

script SelectFromTop()
Let nSaySelectAfter = FALSE
if !IsJavaWindow(GetFocus())
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	SelectFromTop ()
else
	SelectingText(TRUE)
	SelectFromTop ()
	SelectingText(FALSE)
EndIf
EndScript

; **/2 End of Selecting Text Scripts

Script CloseDocumentWindow ()
TypeKey(cksControlF4)
If (! DialogActive ()) then
	; Only initialize variable if child window was actually closed
	let WindowClosed = true
endIf
EndScript

int function ShouldMoveBySentence(int moveDir)
var
	int isJava
let isJava = IsJavaWindow (GetCurrentWindow ())
if IsJAWSCursor() then
	if !isJava then
		if MoveDir == UnitMove_Next then
			PerformScript SayNextSentence()
		elif MoveDir == UnitMove_Prior then
			PerformScript SayPriorSentence()
		EndIf
		return true
	EndIf
elif IsVirtualPCCursor()
&& MoveDir == UnitMove_Prior
&& False == isJava
then
	PerformScript SayPriorSentence()
	return true
elif GetWindowClass(GetFocus()) == cwcIEServer
&& GetObjectSubtypeCode() == wt_dialog_page then
	if MoveDir == UnitMove_Next then
		PerformScript SayNextSentence()
	elif MoveDir == UnitMove_Prior then
		PerformScript SayPriorSentence()
	EndIf
	return true
EndIf
; Manage multiline read-only windows especially in dialogs.
;Situations such as QuickSettings, Settings Center, or even Research It are good examples of where this happens.
if dialogActive () && getWindowStyleBits (getFocus ()) & ES_MULTILINE then
	if MoveDir == UnitMove_Next then
		PerformScript SayNextSentence()
	elif MoveDir == UnitMove_Prior then
		PerformScript SayPriorSentence()
	EndIf
	return true
endIf
return false
EndFunction

void function DoOpenListBoxKeyStroke()
TypeKey(cksAltDownArrow)
EndFunction

void function DoCloseListBoxKeyStroke()
TypeKey(cksAltUpArrow)
EndFunction

int function OpeningFormsModeComboBox()
if !IsVirtualPCCursor() || IsJavaWindow(GetFocus()) then
	return false
EndIf
if GetObjectSubtypeCode() == wt_comboBox then
	LeftMouseButton()
   	SayMessage (ot_JAWS_message, cmsg41_L, cmsgSilent)  ;open list box
	let gbShouldExitFormsModeOnComboBoxClose = true
	DoOpenListBoxKeyStroke()
 	return true
EndIf
return false
EndFunction

int function ClosingFormsModeComboBox()
var
	handle hWnd,
	handle hParent,
	string sClass,
	string sParentClass,
	int iObjType
if !gbShouldExitFormsModeOnComboBoxClose then
	return false
EndIf
if IsFormsModeActive() then
	let hWnd = GetCurrentWindow()
	let sClass = GetWindowClass(hWnd)
	let hParent = GetParent(hWnd)
	let sParentClass = GetWindowClass(hParent)
	let iObjType = GetObjectSubtypeCode()
	if sClass == cwc_ComboLBox
	&& sParentClass != cwc_IE6DropDownComboBox then
		if GetWindowStyleBits(hParent) & CBS_DROPDOWN then
			let gbShouldExitFormsModeOnComboBoxClose = false
			SendMessage(hParent,CB_SHOWDROPDOWN,0, 0)
			SayMessage(ot_JAWS_message, cmsg42_L, cmsgSilent) ;close listbox
			TurnOffFormsMode()
		 	return true
		EndIf
	elif sClass == cwc_IE6DropDownComboBox then
		;The user pressed Alt+DownArrow too many times:
		let gbShouldExitFormsModeOnComboBoxClose = false
		SayMessage(ot_JAWS_message, cmsg42_L, cmsgSilent) ;close listbox
		TurnOffFormsMode()
	 	return true
	ElIf iObjType == wt_ListBoxItem
	|| iObjType == wt_ComboBox then
		let gbShouldExitFormsModeOnComboBoxClose = false
		DoCloseListBoxKeyStroke()
		SayMessage(ot_JAWS_message, cmsg42_L, cmsgSilent) ;close listbox
		TurnOffFormsMode()
	 	return true
 	EndIf
EndIf
return false
EndFunction

int function IsOpenListBoxApplicable(handle hWnd, int iSubtype)
var
	object o,
	int iObj,
	int iChild,
	int v,
	int left,
	int top,
	int right,
	int bottom
;for edit, check the MSAA state for has popup:
if iSubtype == wt_edit then
	if hWnd == GlobalFocusWindow then
		;GetObjectAtPoint is more reliable than GetFocusObject:
		let o = GetObjectAtPoint(iChild,GetcursorCol(),GetCursorRow())
	else
		;Do not use this test for a non-focus window where the window has multiple objects.
		GetWindowRect(hWnd,left,right,top,bottom)
		let o = GetObjectAtPoint(iChild,(left+right)/2,(top+bottom)/2)
		if !o then
			let o = GetObjectFromEvent(hWnd,iObj,iChild,V)
		EndIf
	EndIf
	return o && (o.accState & STATE_SYSTEM_HASPOPUP)
EndIf
return ((DialogActive() || IsFormsModeActive())
		&& !(iSubtype == wt_static
			|| iSubtype == wt_edit
			|| iSubtype == wt_multiline_edit
			|| iSubtype == wt_readOnlyEdit
			|| iSubType==wt_document
|| iSubType==WT_PARAGRAPH
|| (iSubType>=WT_HTML_HEADING1 && iSubType <=WT_HTML_HEADING6)))
	|| iSubtype == 	WT_EDITCOMBO
	|| iSubtype == WT_Listbox
	|| iSubtype == WT_MULTISELECT_LISTBOX
	|| iSubtype == WT_EXTENDEDSELECT_LISTBOX
	|| iSubtype == WT_Combobox
	|| GetWindowClass(hWnd) == cwcMsoCmd
EndFunction

int function OpenVirtualRibbonDropDownControl()
var
	int iSubtype
if !IsVirtualRibbonActive() then
	return false
EndIf
let iSubtype = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
if iSubtype == wt_EditCombo
|| iSubtype == wt_ComboBox then
	SayCurrentScriptKeyLabel()
	LeftMouseButton()
	Delay(2)
	TypeKey(cksAltDownArrow)
	return true
EndIf
return false
EndFunction

int function CloseVirtualRibbonDropDownControl()
var
	int iSubtype
if GlobalMenuMode != Menu_Active
|| !IsFormsModeActive()
|| !IsRibbonControl(GetFocus()) then
	return false
EndIf
let iSubtype = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
if iSubtype == wt_EditCombo then
	SayCurrentScriptKeyLabel()
	TypeKey(cksAltUpArrow)
	Delay(2)
	TurnOffFormsMode()
	return true
EndIf
return false
EndFunction

void function ProcessOpenListBox(handle hWnd, int iSubtype, int bIsFormsMode)
;If this is a combobox that supports dropdown then send the show dropdown message else just use the keystroke
if GetWindowStyleBits(hWnd) & CBS_DROPDOWN then
	SendMessage(hWnd, CB_SHOWDROPDOWN, 1, 0)
   	SayMessage (ot_JAWS_message, cmsg41_L, cmsgSilent)  ;open list box
	if bIsFormsMode
	&& GetJCFOption(OPT_AUTO_FORMS_MODE) then
		let gbShouldExitFormsModeOnComboBoxClose = true
	EndIf
else
	DoOpenListBoxKeyStroke()
	if iSubtype == WT_Combobox
	|| iSubtype == wt_EditCombo then
	   	SayMessage (ot_JAWS_message, cmsg41_L, cmsgSilent)  ;open list box
	elif iSubtype == wt_DateTime then
		SayMessage (ot_JAWS_message, cmsgOpenCalendar_L, cmsgSilent)
	EndIf
	if bIsFormsMode
	&& GetJCFOption(OPT_AUTO_FORMS_MODE)
	&& iSubtype == WT_Combobox then
		let gbShouldExitFormsModeOnComboBoxClose = true
	EndIf
EndIf
EndFunction

Script OpenListBox()
var
	handle hCurWnd,
	int TheTypeCode,
	int IsFormsMode,
	string sClass
if OpenVirtualRibbonDropDownControl() then
	return
elif OpeningFormsModeComboBox() then
	return
EndIf
hCurWnd = GetCurrentWindow ()
TheTypeCode = GetObjectSubtypeCode()
IsFormsMode = IsFormsModeActive()
;Make single-line edits turn off Forms Mode on web pages.
if IsFormsMode
&& isPcCursor()
&& getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
	TurnOffFormsMode ()
	IsFormsMode = FALSE
endIf
sClass = GetWindowClass(hCurWnd)
if TheTypecode == WT_TREEVIEW
|| sClass == cwc_SysTreeView32
|| TheTypecode == WT_LISTVIEW
|| sClass == cWcListView then
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	return
EndIf
if IsOpenListBoxApplicable(hCurWnd, TheTypeCode) then
	ProcessOpenListBox(hCurWnd,TheTypecode,IsFormsMode)
	return
endIf
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

int function IsCloseListBoxApplicable(handle hWnd, int iSubtype)
return DialogActive()
	|| IsFormsModeActive()
	|| iSubtype == WT_EDITCOMBO
	|| iSubtype == WT_Listbox
	|| iSubtype == WT_ListboxItem
	|| iSubtype == WT_LISTVIEWITEM
	|| iSubtype == WT_MULTISELECT_LISTBOX
	|| iSubtype == WT_EXTENDEDSELECT_LISTBOX
	|| iSubtype == WT_Combobox
	|| GetWindowClass(hWnd) == cwcMsoCmd
EndFunction

void function ProcessCloseListBox(handle hWnd, int iSubtype, int bIsFormsMode)
;If this is a combobox that supports dropdown then send the show dropdown message else just use the keystroke
if GetWindowStyleBits(hWnd) & CBS_DROPDOWN
&& GetWindowClass(hWnd) != cwc_IE6DropDownComboBox then
	SendMessage(hWnd,CB_SHOWDROPDOWN,0, 0)
	SayMessage(ot_JAWS_message, cmsg42_L, cmsgSilent) ;close listbox
else
	DoCloseListBoxKeyStroke()
	if bIsFormsMode then
		if (iSubtype == WT_EDITCOMBO || iSubtype == wt_ListBoxItem || iSubtype == WT_Combobox) then
	   		SayMessage(ot_JAWS_message, cmsg42_L, cmsgSilent) ;close listbox
	   	EndIf
	   	return
	EndIf
	;IsComboExpanded may not return accurate information after closing the box,
	;so just assume the box has closed and announce it:
	SayMessage(ot_JAWS_message, cmsg42_L, cmsgSilent) ;close listbox
EndIf
EndFunction

int function MoveToParentFolder()
var handle hWnd = GetFocus()
if GetWindowClass(hWnd) != cwc_DirectUIhWNd
&& GetWindowClass(GetParent(hWnd)) != cwc_ShellDLL_DefView
	return false
endIf
var object treeWalker = CreateUIATreeWalkerForFocusProcessId(Null(),true)
var int iType = GetObjectSubtypeCode()
;MSAA type will normally be listbox if the folder is empty,
;but if in a dialog and the focus has shifted away from the list and back to it then this is unreliable.
;the UIA depth will be 1 less than if the folder is populated.
;MSAA object type will be listboxItem if in the name column and the folder is not empty,
;and will be static if not in the name column and the folder is not empty.
;if in a column other than the name column, the UIA depth will be 1 level deeper than if in the name column.
if iType == wt_static
	treeWalker.gotoParent()
	if treeWalker.currentElement.className != UIAClass_UIItem return false endIf
	treeWalker.gotoParent()
	if treeWalker.currentElement.className != UIAClass_UIItemsView return false endIf
elif iType == wt_listBoxItem
	treeWalker.gotoParent()
	if treeWalker.currentElement.className != UIAClass_UIItemsView
	&& treeWalker.currentElement.className != UIAClass_UIGroupItem
		return false
	endIf
endIf
TypeKey(cksAltUpArrow)
return true
EndFunction

Script CloseListBox()
var
	handle hWnd,
	int TheTypeCode,
	int IsFormsMode,
	string sClass
if !GetFocus() || menusActive () then
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	return
elif CloseVirtualRibbonDropDownControl() then
	return
elif ClosingFormsModeComboBox() then
	return
elif MoveToParentFolder()
	return
EndIf
let TheTypeCode = GetObjectSubtypeCode()
let IsFormsMode = IsFormsModeActive()
;Make single-line edits turn off Forms Mode on web pages.
if IsFormsMode
&& isPcCursor ()
&& getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
	TurnOffFormsMode ()
	Let IsFormsMode = FALSE
endIf
let hWnd = GetCurrentWindow()
let sClass = GetWindowClass(hWnd)
if TheTypecode == WT_TREEVIEW
|| sClass == cwc_SysTreeView32
|| TheTypecode == WT_LISTVIEW
|| sClass == cWcListView then
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	return
EndIf
if IsCloseListBoxApplicable(hWnd,TheTypecode) then
	if GetWindowClass(hWnd) == cwc_ComboLBox then
		let hWnd = GetParent(hWnd)
	EndIf
	ProcessCloseListBox(hWnd,TheTypeCode,IsFormsMode)
	return
endIf
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

Script SelectAll ()
var
	handle hWnd,
	int iSubtype,
	string sSelection,
	int RunningProducts
let hWnd = GetCurrentWindow ()
let iSubtype = GetWindowSubtypeCode(hWnd)
if !iSubtype then
	let iSubtype = GetObjectSubtypeCode()
EndIf
let RunningProducts = GetRunningFSProducts()
if RunningProducts == product_MAGic
&& IsVirtualPcCursor() then
	TypeKey(cksSelectAll)
	return
EndIf
SelectEntireDocument()
if !(RunningProducts & product_JAWS) then
	return
endIf
if iSubtype == wt_ListView
|| iSubtype == wt_ListBox
|| iSubtype == wt_MultiSelect_ListBox
|| iSubtype == wt_ExtendedSelect_ListBox
|| iSubtype == wt_ListBoxItem then
	Pause()
	let sSelection = GetSelectedText()
	if !sSelection then
		let sSelection = GetWindowText(hWnd, true)
	EndIf
	If nSaySelectAfter then
		Say(sSelection,ot_line)
		Say(cmsg215_L,OT_SELECT)
	Else
		Say(cmsg215_L,OT_SELECT)
		Say(sSelection,ot_line)
	EndIf
EndIf
EndScript

script PassKeyThrough()
;cmsg43_L = "Enter key to pass thru"
SayFormattedMessage (ot_JAWS_message, cmsg43_L, cmsg43_S)
PassKeyThrough()
EndScript

void function ProcessBoundaryStrike(handle hWnd, int edge)
var
	int iType
Let iType = GetWindowSubTypeCode(hWnd)
;Exclude List Views in Windows Vista:
If (IsWinVista () && iType == WT_LISTVIEW) then
	;Return if not desktop or folder list view:
	If (GetWindowClass (GetParent (hWnd)) == cwc_ShellDll_DefView) then
		Return
	EndIf
EndIf
if lvIsCustomized(hWnd) then
	Beep ()
	return
endIf
if iType == wt_MultiLine_edit then
	Beep()
	return
EndIf
if IsVirtualPCCursor()
&& !IsFormsModeActive() then
	Beep()
	return
EndIf
if iType == WT_MULTISELECT_LISTBOX
|| iType == WT_EXTENDEDSELECT_LISTBOX
|| iType == WT_LISTBOX
|| iType == WT_LISTVIEW
|| iType == WT_BUTTONLISTBOX
|| iType == wt_TreeView
|| iType == wt_TreeViewItem then
	Beep ()
	Return
endIf
EndFunction

Void Function TopEdgeEvent (handle WindowHandle)
If BrailleFHPTopEdge () then
	Return
EndIf
ProcessBoundaryStrike(WindowHandle,TopEdge)
EndFunction

Void Function BottomEdgeEvent(handle WinHandle)
If BrailleFhpBottomEdge () then
	Return
EndIf
ProcessBoundaryStrike(WinHandle,BottomEdge)
EndFunction

int Function HandleCustomAppWindows (handle hWnd)
var
	handle hReadOnly = FindDescendantWindow (hwnd, 1300)
if inHjDialog () then
	if hReadOnly && getWindowSubtypeCode (hReadOnly) == WT_READONLYEDIT then
		sayWindowTypeAndText (hwnd)
		sayWindow (hReadOnly, READ_EVERYTHING)
		return TRUE
	endIf
endIf
if  IsWindowDisabled (hwnd)
&& (getWindowClass (hwnd) == "JFWUI2"
|| IsWinFormsWindow(hwnd));keep JAWS from saying both the title of the disabled window and the title of the active window
	; Keep JAWS from erroneously saying 'jaws' when dialogs like Flexible Web come up.
	;Instance occurs when JAWS is not set to run in System Tray.
	return TRUE
endIf
Return FALSE
EndFunction

int Function HandleCustomRealWindows (handle hWnd)
; Where JAWS is run as window and not system tray,
; Flexible Web dialog repeats the static text as it does the SayWindowTypeAndText for the control.
if FlexibleWebDialogActive () then
	SayControlEXWithMarkup (hwnd, GetWindowName (hWnd), GetWindowType (hwnd))
	return TRUE
endIf
Return FALSE
EndFunction

int Function HandleCustomWindows (handle hWnd)
var
	int iSubtype
unScheduleFunction (giFN_SpeakInvisibleWindow)
;HjDialogs should always use older WindowTypeAndText code,
;So that on Windows 9X PositionInGroup info never misreports items
If InHjDialog () then
	SayWindowTypeAndText (hWnd)
	let iSubtype = GetWindowSubtypeCode (hWnd)
	;Announce tree item parent node:
	if iSubtype == wt_TreeView
	|| iSubtype == wt_TreeViewItem then
		if GetTreeViewLevel() > 0 then
			SayUsingVoice(vctx_message,tvGetItemText(hWnd, tvGetParent(hWnd,tvGetSelection(hWnd))),ot_position)
		EndIf
		SayMessage (OT_SCREEN_MESSAGE, FlexibleWebNumberOfActiveRules ())
	EndIf
	;For input edit boxes:
	If iSubtype == WT_MULTILINE_EDIT then
		SayWindow (hWnd, TRUE)
	EndIf
	Return TRUE
EndIf
if sayFocusedObjectViewSliders () then return TRUE endIf
; for internal FS windows,
; where they may briefly gain focus and then go away, we don't want to speak:
if ! iSubtype
&& StringContains (GetWindowClass (hwnd), "fsExternalVideoClass")
	return TRUE
endIf
if menusActive () && isPcCursor () then
	Let iSubtype = getWindowSubtypeCode (hwnd)
	if iSubtype == WT_LISTVIEW
	&& getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_MENU then
		indicateControlType (wt_menu, getObjectName(SOURCE_CACHED_DATA))
		Return TRUE
	endIf
endIf
;The current ap is no longer, or the window is invisible:
;All windows have closed, save the desktop and task bar
if GetDefaultJCFOption (OPT_FOCUS_LOSS_ANNOUNCE)
&& AllAppsClosedFromSystemTray (hwnd) then
	Let giFN_SpeakInvisibleWindow = ScheduleFunction ("SpeakInvisibleWindow", gi_FOCUS_LOSS_TIMER)
	Return TRUE
endIf
Return FALSE
EndFunction

int function JavaFocusChangedEvent_ShouldIgnoreEvent(
	handle FocusWindow, handle FocusedObjectID,
	handle PrevWindow, handle PrevObjectID)
if (
	! GlobalWasHjDialog
	&& navIsSameObject(FocusWindow, FocusedObjectID, PrevWindow, PrevObjectID)
	)
	return TRUE
endIf
Return FALSE
EndFunction

int function JavaFocusChangedEvent_ShouldSpeakAppMainObject(
	handle FocusWindow, handle PrevWindow,
	handle AppMainObjectID, handle PrevAppMainObjectID,
	handle TopLevelObjectID, handle PrevTopLevelObjectID,
	handle RealObjectID, handle PrevRealObjectID)
if (
	! GlobalWasHjDialog
	&& ! navIsSameObject(FocusWindow, RealObjectID, FocusWindow, AppMainObjectID)
	&& ! navIsSameObject(FocusWindow, TopLevelObjectID, FocusWindow, AppMainObjectID)
	&& ! navIsSameObject(GetAppMainWindow(FocusWindow), AppMainObjectID, GetAppMainWindow(PrevWindow), PrevAppMainObjectID)
	)
	return TRUE
endIf
Return FALSE
EndFunction

int function JavaFocusChangedEvent_ShouldSpeakTopLevelObject(
	handle FocusWindow, handle PrevWindow,
	handle AppMainObjectID, handle PrevAppMainObjectID,
	handle TopLevelObjectID, handle PrevTopLevelObjectID,
	handle RealObjectID, handle PrevRealObjectID)
if (
	! GlobalWasHjDialog
	&& ! navIsSameObject(GetTopLevelWindow(FocusWindow), TopLevelObjectID, GetTopLevelWindow(PrevWindow), PrevTopLevelObjectID)
	)
	return TRUE
endIf
Return FALSE
EndFunction

int function JavaFocusChangedEvent_ShouldSpeakRealObject(
	handle FocusWindow, handle PrevWindow,
	handle AppMainObjectID, handle PrevAppMainObjectID,
	handle TopLevelObjectID, handle PrevTopLevelObjectID,
	handle RealObjectID, handle PrevRealObjectID)
if (
	! GlobalWasHjDialog
	&& ! navIsSameObject(FocusWindow, AppMainObjectID, FocusWindow, RealObjectID)
	&& ! navIsSameObject(FocusWindow, TopLevelObjectID, FocusWindow, RealObjectID)
	&& ! navIsSameObject(GetRealWindow(FocusWindow), RealObjectID, GetRealWindow(PrevWindow), PrevRealObjectID)
	)
	return TRUE
endIf
Return FALSE
EndFunction

void function JavaFocusChangedEvent_UpdateObjectIDs(
	handle AppMainObjectID, handle TopLevelObjectID,
	handle RealObjectID, handle FocusedObjectID)
let g_PrevAppMainObjectID = AppMainObjectID
let g_PrevTopLevelObjectID = TopLevelObjectID
let g_PrevRealObjectID = RealObjectID
let g_PrevFocusedObjectID = FocusedObjectID
EndFunction

Void Function JavaFocusChangedEvent (handle FocusWindow, handle PrevWindow)
	var
		HANDLE FocusedObjectID,
		HANDLE AppMainObjectID,
		HANDLE TopLevelObjectID,
		HANDLE RealObjectID
	let GlobalFocusWindow = FocusWindow
	let FocusedObjectID = navGetFocusObjectID ()
	if (JavaFocusChangedEvent_ShouldIgnoreEvent(FocusWindow, FocusedObjectID, PrevWindow, g_PrevFocusedObjectID))
		JavaFocusChangedEvent_UpdateObjectIDs(AppMainObjectID, TopLevelObjectID, RealObjectID, FocusedObjectID)
		return
	endIf
	let AppMainObjectID = navGetAppMainObjectID (FocusedObjectID, FocusWindow)
	let TopLevelObjectID = navGetTopLevelObjectID (FocusedObjectID, FocusWindow)
	let RealObjectID = navGetRealObjectID (FocusedObjectID, FocusWindow)
	if (
		JavaFocusChangedEvent_ShouldSpeakAppMainObject(
			FocusWindow, PrevWindow, AppMainObjectID, g_PrevAppMainObjectID,
			TopLevelObjectID, g_PrevTopLevelObjectID,
			RealObjectID, g_PrevRealObjectID)
		)
		navSayObjectTypeAndText(AppMainObjectID, FocusWindow)
	endIf
	if (
		JavaFocusChangedEvent_ShouldSpeakTopLevelObject(
			FocusWindow, PrevWindow, AppMainObjectID, g_PrevAppMainObjectID,
			TopLevelObjectID, g_PrevTopLevelObjectID,
			RealObjectID, g_PrevRealObjectID)
		)
		navSayObjectTypeAndText(TopLevelObjectID, FocusWindow)
	endIf
	if (
		JavaFocusChangedEvent_ShouldSpeakRealObject(
			FocusWindow, PrevWindow, AppMainObjectID, g_PrevAppMainObjectID,
			TopLevelObjectID, g_PrevTopLevelObjectID,
			RealObjectID, g_PrevRealObjectID)
		)
		navSayObjectTypeAndText(RealObjectID, FocusWindow)
	endIf
	SayFocusedObject ()
	JavaFocusChangedEvent_UpdateObjectIDs(AppMainObjectID, TopLevelObjectID, RealObjectID, FocusedObjectID)
EndFunction

void function EnsureVistaDesktopTrackingInMagic(handle hWnd, int nType)
var
	int lvItem,
	int Rect,
	int nLeft,
	int nTop,
	int nBottom,
	int nRight
If nType != WT_LISTBOXITEM
|| GetWindowClass(GetParent(hwnd)) != cwc_ShellDll_DefView
|| !IsMAGicRunning() then
	return
EndIf
Let lvItem = lvGetFocusItem (hwnd)
If lvItem then
	Let Rect = lvGetItemRect(hwnd,lvItem,nLeft,nRight,nTop,nBottom)
EndIf
If Rect then
	MagSetFocusToRect(nLeft,nRight,nTop,nBottom)
EndIf
EndFunction

string function PositionInGroupForSecondaryFocus()
if !IsSecondaryFocusActive() return cscNull endIf
var	int setLevel, int sizeOfSet, int positionInSet
GetSecondaryFocusSelectionGroupPosition(setLevel, sizeOfSet, positionInSet)
if !positionInSet || !sizeOfSet return cscNull endIf
return FormatString(cmsgPosInGroup1, positionInSet, sizeOfSet)
EndFunction

int function ShouldIgnoreSaySecondaryFocusSelectedItem()
return GetObjectIsEditable ()
&& StringIsBlank(GetObjectValue ())
endFunction

void function SaySecondaryFocusSelectedItem(int includePosition)
if giScheduledSaySecondaryFocusSelectedItem
	UnScheduleFunction (giScheduledSaySecondaryFocusSelectedItem)
	giScheduledSaySecondaryFocusSelectedItem = 0
endIf
var string text = GetSecondaryFocusSelectionText()
if !text
|| ShouldIgnoreSaySecondaryFocusSelectedItem()
	return
endIf
Say(text,ot_screen_message)
if !includePosition return endIf
var string positionInGroup = PositionInGroupForSecondaryFocus()
if positionInGroup
	Say(positionInGroup, ot_position)
endIf
EndFunction

Void Function SecondaryFocusChangedEvent()
if !IsSecondaryFocusActive()
	WasSecondaryFocusActive = false
	return SecondaryFocusDeactivatedEvent()
elif !WasSecondaryFocusActive
	;do not return when becoming active,
	;the focus event needs to process the code below this block for the focus change.
	WasSecondaryFocusActive = true
	SecondaryFocusActivatedEvent()
endIf
SaySecondaryFocusSelectedItem(true)
BrailleRefresh()
EndFunction

Void Function SecondaryFocusActivatedEvent()
;Add here only the code which should run when a secondary focus appears.
;The SecondaryFocusChangedEvent function will handle the normal focus change code.
EndFunction

Void Function SecondaryFocusDeactivatedEvent()
;Add any code here which should run when the secondary focus goes away.
if giScheduledSaySecondaryFocusSelectedItem
	UnScheduleFunction (giScheduledSaySecondaryFocusSelectedItem)
	giScheduledSaySecondaryFocusSelectedItem = 0
endIf
EndFunction

void function ClearFocusChangeMenuGlobals()
gstrListViewGroupName = cscNull
g_strLastMenuName = cscNull
g_strLastMenuGroupName = cscNull
EndFunction

int function MenuProcessedOnFocusChangedEventEx(
	handle hwndFocus, handle hwndPrevFocus,
	int nType, optional int nChangeDepth)
var
	int nCurMenuMode,
	string strCurMenuName,
	string strMenuGroupName,
	string strListGroupName
nCurMenuMode = GetMenuMode ()
GlobalMenuMode = nCurMenuMode
if nCurMenuMode == MENU_INACTIVE
	ClearFocusChangeMenuGlobals()
	return false
endIf
GlobalFocusWindow = hwndPrevFocus
if IsVirtualRibbonActive() then
	SayVirtualRibbonItem()
	return true
EndIf
if nType == wt_ContextMenu
&& !(GetObjectName(SOURCE_CACHED_DATA) || GetObjectValue()) then
	;Don't announce the item if it has no name or value,
	;since announcement would cause position infor to be spoken,
	;thus causing a position of a non-speakable item.
	;This happens if the Menu triggered an extra focus change on Start Menu
	;before the focus changed to the first item on the Start Menu.
	return true
EndIf
strCurMenuName = GetMenuName ()
if strCurMenuName != g_strLastMenuName then
	if StringLength (strCurMenuName) != 0
		Say (FormatString (cmsg193_L, strCurMenuName), OT_CONTROL_NAME)
	EndIf
	g_strLastMenuName = strCurMenuName
EndIf
if GetObjectSubtypeCode(false,1) == wt_GroupBox
	strMenuGroupName = GetObjectName(false,1)
	if strMenuGroupName
	&& strMenuGroupName != g_strLastMenuGroupName
		IndicatecontrolType(wt_GroupBox, strMenuGroupName)
	endIf
	g_strLastMenuGroupName = strMenuGroupName
endIf
If nType == WT_EDIT
|| GetWindowSubtypeCode (hWndFocus) == WT_STARTMENU
	MagTrackCustomMenus (hwndFocus)
EndIf
if nType == wt_treeviewItem || getWindowSubtypeCode (hwndFocus) == WT_TREEVIEW
	SayTreeViewLevel (TRUE)
elif nType != WT_LISTBOXITEM
	if nChangeDepth > 0
		nChangeDepth = 0
	endIf
	SayObjectTypeAndText(nChangeDepth)
else
	SayObjectActiveItem (FALSE) ; with no position info
	strListGroupName = lvGetGroupName (hWndFocus, lvGetFocusItem (hWndFocus))
	If strListGroupName != gstrListViewGroupName then
		SayMessage (OT_POSITION,FormatString (cmsgListGroupName, strListGroupName))
	EndIf
	gstrListViewGroupName = strListGroupName
endIf
if stringContains (getObjectClassName (), "NetUIAnchor") then
; Say any object help such as path information etc for Microsoft Office.
	SayUsingVoice(VCTX_MESSAGE, GetObjectHelp(), OT_SCREEN_MESSAGE)
endIf
return true
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
var
	int nParentType
if stringIsBlank (sClass)
	sClass = getWindowClass (hwndFocus)
endIf
if nChangeDepth == -1 then
	; If edit callbacks are enabled, suppress double speaking when arrowing to a cell if it generates a focus event.
	if (SupportsEditCallbacks () && GetObjectTypeCode (true)==WT_TABLECELL) then
		return;
	endIf

	if ShouldWinformsControlBeSilent (hwndFocus)
	&& IsWinFormListItemUnchanged () then
	; filter out double-speaking in winForms drop-down list boxes from combo and edit combo boxes:
		return
	endIf
	return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
EndIf
;if nChangeDepth == 0
if hwndFocus == hwndPrevFocus then
	if sClass == cwc_SysTreeView32 then
		return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
	elif sClass == cWc_Toolbar then
		;Address ToolBar:
		if nType == WT_SPLITBUTTON then
			return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
		EndIf
	elif sClass == cwc_DirectUIhWND then
		let nParentType = GetObjectSubtypeCode(SOURCE_CACHED_DATA,1)
		;File and folder list:
		if nType == wt_ReadOnlyEdit
		&& nParentType == wt_ListBoxItem then
			return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
		;Header ListBox SplitButtons:
		elif nType == WT_SPLITBUTTON
		&& nParentType == wt_ListBox then
			return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
		EndIf
	elif (nType == wt_DateTime && stringStartsWith(sClass, cWc_Winforms, true))
		/* If the author of a Windows Forms application does not explicitly set the
		Accessible Name of a System.Windows.Forms.DateTimePicker control the name
		will be set to the value. This name will be updated every time the value
		changes. This causes FocusChangedEventEx to be called when no focus change
		occurred resulting in extraneous speech. To resolve this issue return here. */
		return
	elif (nType == WT_Calendar)
		return ActiveItemChangedEvent(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild)
	EndIf
EndIf

;Handle tree views where depth changes but the window does not.
;Object remains the same as the child id is the only change that affects selection
;in IE, the object IDs actually change but we still want to speak using active item
if (nType == WT_TREEVIEW || nType == WT_TREEVIEWITEM)
	if ((sClass== cwcIEServer || nObject == nPrevObject)  && hwndFocus == hwndPrevFocus)
		; In Java tree views, GetObjectValue returns the text of the selected object in the
		; tree view. If GetObjectValue returns an empty string, that means that no object is
		; selected. JAWS should not process this event as an active item change in this case.
		if (!IsJavaWindow(hwndFocus) || (IsJavaWindow(hwndFocus) && !StringIsBlank(GetObjectValue())))
			return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
		endIf
	endIf
endIf

FocusChangedEvent(hwndFocus,hwndPrevFocus)
EndFunction

int function ProcessTaskSwitchList(handle hwndFocus)
;Process list that appears when Alt+Tab is used to switch apps
if GetWindowClass(hwndFocus) == cwc_Win10_AltTabWindow ||  ; Windows 10
		GetObjectAutomationId(1) == UIAAutomationID_TaskSwitchingWindow ; Windows 11
	if GetObjectSubTypeCode(SOURCE_CACHED_DATA) == WT_LISTBOXITEM then
		Say(GetObjectName(), OT_WINDOW_NAME)
	endIf
	return true
EndIf
return false
EndFunction

void function ManageWindows10FocusableProgressBarListener()
if !IsWindows10() return endIf
SaveCursor()
PCCursor()
var int typeCode = GetObjectSubtypeCode()
RestoreCursor()
if typeCode != WT_ProgressBar
	gUIA_ProgressBarListener = Null()
	CollectionRemoveAll(c_FocusableProgressBar)
	return
endIf
gUIA_ProgressBarListener = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest")
if !ComAttachEvents(gUIA_ProgressBarListener, FocusableProgressBar_Update_EventPrefix)
	gUIA_ProgressBarListener = Null()
	return
endIf
var object element = gUIA_ProgressBarListener.GetFocusedElement().buildUpdatedCache()
if element.controlType != UIA_ProgressBarControlTypeId
|| !gUIA_ProgressBarListener.AddPropertyChangedEventHandler(UIA_RangeValueValuePropertyId, element, TreeScope_Element)
	gUIA_ProgressBarListener = Null()
	return
endIf
c_FocusableProgressBar.name = element.Name
c_FocusableProgressBar.value = element.buildUpdatedCache().GetRangeValuePattern().value
c_FocusableProgressBar.prevProgressBarAnnouncementTickCount = GetTickCount()
c_FocusableProgressBar.ProgressBarUpdateInterval = GetJCFOption(OPT_PROGRESSBAR_UPDATE_INTERVAL)
EndFunction

void function FocusableProgressBarPropertyChangedEvent(object element, int propertyID, variant newValue)
;use the progress bar update interval JCF option to control how often this event announces:
if GetTickCount()-c_FocusableProgressBar.prevProgressBarAnnouncementTickCount >= c_FocusableProgressBar.ProgressBarUpdateInterval
	Say(FormatString(cmsgPercentage,newValue),ot_screen_message)
	c_FocusableProgressBar.prevProgressBarAnnouncementTickCount = GetTickCount()
endIf
c_FocusableProgressBar.value = newValue
BrailleRefresh()
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
;Use this function to update variables and states before the rest of the code from FocusChangedEventEx runs.
UpdateVirtualCursorRestriction(hwndFocus)
UIAFocusChangedEventEx()
;; Stop speech if all of the following conditions are true.
;; 1. The "Interrupt Speech When A Dialog Box Is Created" option is enabled.
;; 2. The current real window is different from the previous real window.
;; 3. The current real window is either a dialog box or a Windows Forms window.
var handle realWindow = GetRealWindow(hwndFocus)
if (
	gbInterruptSpeechWhenADialogBoxIsCreated
	&& realWindow != GlobalPrevReal
	&& (DialogActive() || IsWinFormsWindow(realWindow))
	)
	OutputDebugStringL("Interrupt Speech For Dialog or Windows Forms Creation", LEVEL_ALWAYS)

	StopSpeech()
EndIf
if SayLBDeselectedItemScheduleID != 0
	UnscheduleFunction(SayLBDeselectedItemScheduleID)
	SayLBDeselectedItemScheduleID = 0
endIf
if giFN_SpeakInvisibleWindow then
	unScheduleFunction (giFN_SpeakInvisibleWindow)
endIf
ProcessGestureSelectionModeOnFocusChange(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
MonitorFormsModeComboBox(hwndFocus,hwndPrevFocus,nChild)
if nChangeDepth > -1 || hwndFocus != hwndPrevFocus then
; destroy cache used to filter extra speaking in winForms drop-down list boxes from combo boxes:
	dumpWinformsListItemGlobals ()
endIf
ManageWindows10FocusableProgressBarListener()
HandleSplitBrailleCommandPrompt(hwndFocus, hwndPrevFocus)
HandleBackgroundOCR(hwndFocus, hwndPrevFocus)
EndFunction

int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
;Return true to prevent anything after this function is called in FocusChangedEventEx from running, false otherwise.
if (hwndFocus != hwndPrevFocus
&& ! nObject && ! nChild && ! nChangeDepth) then
	if GetWindowClass (hwndFocus) == cwc_DirectUIhWND
	&& GetObjectName(SOURCE_CACHED_DATA) == cwnEmptyFolderInDialog then
		MSAARefresh ()
		BrailleRefresh ()
	 	return TRUE
	endIf
endIf
; Only speak focus changes which result from the tab key if focusFollowsVirtualCursor is on, otherwise we'll get double speaking.
if GetJCFOption(optFocusFollowsVirtualCursor) && IsVirtualPCCursor()
&& FocusChangeTriggeredByUserNavigation() then
	return true
endIf
var string sClass = GetObjectClassName ()
if GetObjectSubTypeCode () == WT_CONTEXTMENU
	if sClass == "Microsoft.UI.Content.DesktopChildSiteBridge"
		;Focus first item when opening context menu
		UIARefresh (false)
		return true
	elIf sClass == "MenuFlyout"
	&& !GetObjectName ()
		;Focus first item in submenu of context menu
		FSUIAGetFirstChildOfElement (FSUIAGetFocusedElement ()).SetFocus()
		return true
	endIf
endIf
return FALSE
endFunction

void function RunningProcessDetectedEvent (string ProcessName)
; runs for each application running when JAWS starts,
;and once for each application process who starts during a JAWS session.
; since this runs for every process,
; it's recommended your supporting function first verifies the name of the process before expensive activity.
;AppendToScriptCallStackLog ()
;AppendToScriptCallStackLogEx (FormatString ("ProcessName is: %1", ProcessName))
AddMainUIALyncEventHandler (ProcessName)
endFunction

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf
var
	handle hwndNull,
	string sClass,
	int nType
let sClass = GetWindowClass(hwndFocus)
let nType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
if MenuProcessedOnFocusChangedEventEx(hwndFocus,hwndPrevFocus,nType,nChangeDepth) then
	return
EndIf
if ProcessTaskSwitchList(hWndFocus) then
	return
EndIf
EnsureVistaDesktopTrackingInMagic(hWndFocus,nType)
ProcessEventOnFocusChangedEventEx(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild,nChangeDepth,sClass,nType)
EndFunction

void function ProcessSayAppWindowOnFocusChange(handle AppWindow, handle FocusWindow)
var
	handle hWndPage
if IsMacToolTipWindow (FocusWindow)
	return
endIf
if GlobalPrevApp == AppWindow
|| AppWindow == FocusWindow
	;We will catch this change when we speak the focus window, so just return.
	return
EndIf
if GlobalWasHjDialog
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
var int appWindowSubtypeCode = GetWindowSubtypeCode (appWindow)
if getRunningFSProducts () & Product_Fusion
&& inHjDialog ()
&& ! appWindowSubtypeCode then
; in browsers, insert f2 and insert f3 read the full application title and they should not.
	return
endIf
If !HandleCustomAppWindows(AppWindow) then
	SayWindowTypeAndText(AppWindow)
EndIf
;Now do Dialog, check for first page of wizzard:
If appWindowSubtypeCode == WT_DIALOG then
	;Check for dialog page in wizards:
	Let hWndPage = GetFirstWindow (FocusWindow)
	If GetWindowSubtypeCode (hWndPage) == WT_DIALOG_PAGE
	&& GetTypeAndTextStringsForWindow(AppWindow) != GetTypeAndTextStringsForWindow(hwndPage) then
		SayWindowTypeAndText (hWndPage)
	EndIf
EndIf
EndFunction

int function ProcessSayRealWindowOnFocusChangeFromHJDialog(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
if !GlobalWasHjDialog then
	return false
EndIf
if GISuppressStartMenu then
	;The GISuppressStartMenu function set to TRUE on account of the Real Window Name in Windows XP.
	return false
EndIf
;Do not speak the real name when exiting from an HJDialog back to the application,
;unless we are exiting an HJDialog back to the start menu.
if !InHjDialog() then
	;GlobalWasHjDialog prevents over chatter, especially when exiting a list box and returning to a client area.
	;Set GlobalWasHJDialog to FALSE when one HjDialog follows another,
	;For example, the AddBrailleColors function.
	return true
else
	;due to timing issues with the JAWS Find dialog,
	;we cannot depend on the value returned by InHJDialog to tell if the dialog has cleared.
	;So, we test the previous hj dialog name:
	if GlobalPrevRealName == cwn_JAWS_Find then
		return true
	EndIf
EndIf
return false
EndFunction

void function ProcessSayRealWindowOnFocusChange(
	 handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
var
	string functionName = "ProcessSayRealWindowOnFocusChange",
	handle hChild
if (IsMacToolTipWindow(FocusWindow))
	FormattedOutputDebugStringL(
		"%1 status: IsMacToolTipWindow(0x%1) returned true; returning without speaking the real window.",
		LEVEL_DEBUG, functionName, DecToHex(FocusWindow))
	return
endIf
If (GlobalPrevRealName == RealWindowName && GlobalPrevReal == RealWindow)
	FormattedOutputDebugStringL(
		"%1 status: The real window did not change; returning without speaking the real window.",
		LEVEL_DEBUG, functionName)
	return
EndIf
FormattedOutputDebugStringL(
	"%1 status: RealWindowName is '%2', GlobalPrevRealName is %3, RealWindow is 0x%4, GlobalPrevReal is 0x%5",
	LEVEL_DEBUG, functionName, RealWindowName, GlobalPrevRealName, DecToHex(RealWindow), DecToHex(GlobalPrevReal))
If (RealWindow == AppWindow
&& AppWindow != GlobalPrevApp)
|| (RealWindow == FocusWindow &&  !DoesWindowContainFocusedObject(focusWindow))
	;We will catch this change either in the app window or the focus window processing, so just return.
	return
EndIf
if ProcessSayRealWindowOnFocusChangeFromHJDialog(AppWindow, RealWindow, RealWindowName, FocusWindow) then
	return
EndIf
If !HandleCustomRealWindows(RealWindow) then
	SayWindowTypeAndText(RealWindow)
	let hChild = GetFirstChild(RealWindow)
	if GetWindowClass(hChild) == cWc_dlg32770 then
		if GetWindowSubtypeCode(hChild) == wt_dialog_page
		&& GetTypeAndTextStringsForWindow(RealWindow) != GetTypeAndTextStringsForWindow(hChild) then
			SayWindowTypeAndText(hChild)
		EndIf
	EndIf
endIf
EndFunction

int function IsEmbeddedInternetExplorerWindow(handle window)
var string windowClass = GetWindowClass(window)
if (StringCompare(windowClass, cwcIEServer) != 0)
	return false
endIf
var handle parentWindow = GetParent(window)
if (!parentWindow)
	return false
endIf
var handle grandParentWindow = GetParent(parentWindow)
if (!grandParentWindow)
	return false
endIf
var string grandParentWindowClass = GetWindowClass(grandParentWindow)
return (StringCompare(grandParentWindowClass, cwc_ShellEmbedding) == 0)
EndFunction

/* Determine whether the window is an embedded web browser window. Currently
this function will only detect an embedded Internet Explorer window. It is
written so that it can be extended to support other web browsers in the future
by just adding another if statement before the final return statement. */
int function IsEmbeddedWebBrowserWindow(handle window)
if (IsEmbeddedInternetExplorerWindow(window))
	return true
endIf
/* Add if statements for other web browsers above this line. */
return false
EndFunction

/* This function determines whether focus just landed in an embedded web browser
window; that is the previous focus window was not an embedded web browser window
and the current focus is an embedded web browser window. This function uses and
updates the GlobalPrevFocusWasEmbeddedWebBrowserWindow global variable. */
int function IsEmbeddedWebBrowserWindowFocusTransition(handle FocusWindow, int ByRef shouldRefresh)
shouldRefresh = false
var int isEmbeddedWebBrowser = IsEmbeddedWebBrowserWindow(FocusWindow)
var string DialogIdentifier = cscNull
if (!isEmbeddedWebBrowser)
	isEmbeddedWebBrowser = IsEmbeddedWebBrowserWindow(GetFirstChild(FocusWindow))
endIf
var int ret = (isEmbeddedWebBrowser != GlobalPrevFocusWasEmbeddedWebBrowserWindow)
if (isEmbeddedWebBrowser && !ret)
	DialogIdentifier = GetDialogIdentifier()
	if (StringCompare(DialogIdentifier, GlobalPrevDialogIdentifier) != 0)
		ret = true
		shouldRefresh = true
	endIf
endIf
GlobalPrevFocusWasEmbeddedWebBrowserWindow = isEmbeddedWebBrowser
return ret
EndFunction

void function HandleEmbeddedWebBrowserWindowFocusTransition(handle FocusWindow)
var int shouldRefresh = false
if (!IsEmbeddedWebBrowserWindowFocusTransition(FocusWindow, shouldRefresh))
	return
endIf
if (shouldRefresh)
	Refresh()
endIf
var string objectClassName = GetObjectClassName(0)
if (StringCompare(objectClassName, cWcShellObject) != 0)
	return
endIf
/* Sometimes when focus moves to the an embedded web browser window the focused
window according to the cached MSAA data is the "Shell DocObject View" window
and not the "Internet Explorer_Server" window. When the cached data focused
window is the "Internet Explorer_Server" JAWS speaks correctly. When the cached
data focused window is the "Shell DocObject View" window JAWS fails to speak the
title. Compensate for this by speaking the title here. */
var string documentTitle = GetDocumentTitle()
if (StringIsBlank(documentTitle))
	return
endIf
Say(documentTitle, OT_CONTROL_NAME)
EndFunction

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName, handle FocusWindow)
If GetWindowSubTypeCode (FocusWindow) == WT_STARTMENU
;Windows XP, the Type code is ListView, so:
|| 	RealWindowName == cWnStartMenu then
	;If in Start Menu, and not in Win NT or 95,
	;Speak Object Name instead of the whole Object Type And Text information:
	If GISuppressStartMenu  then
		SayObjectActiveItem()
	EndIf
	;Solve Japan problem where Exit Documents menus was not reporting accurate state.
	Let GISuppressStartMenu = TRUE
	return
EndIf
;Ensure Start Menu flag is off, since we are not in the Start Menu:
Let GISuppressStartMenu = FALSE
If SayFocusedHJDialogWindow(FocusWindow) then
	return
EndIf
HandleEmbeddedWebBrowserWindowFocusTransition(FocusWindow)
If !HandleCustomWindows(FocusWindow) then
	SayFocusedWindow()
EndIf
EndFunction

void function SayFocusedHJDialogWindow(handle FocusWindow)
var
	int bSayTopLineOfEdit,
	int iSubtype,
	handle hWnd
If !InHjDialog()
	return false
EndIf
iSubtype = GetWindowSubtypeCode(FocusWindow)
if getRunningFSProducts () & Product_Fusion
&& iSubtype == WT_STATIC
; this window pops in and out of visibility
&& isWindowObscured (FocusWindow)
; This is Fusion when an HJ dialog is coming into foreground:
	return TRUE
endIf
If iSubtype == WT_READONLYEDIT
	TypeKey (cksControlHome)
	bSayTopLineOfEdit = TRUE
EndIf
SayFocusedObject()
If bSayTopLineOfEdit
	SaveCursor ()
	PcCursor ()
	SayLine ()
	RestoreCursor ()
elIf iSubtype == WT_TREEVIEW
	sayMessage (OT_SCREEN_MESSAGE, FlexibleWebNumberOfActiveRules ())
EndIf
return true
EndFunction

int function ExplorerPaneFocusChangedEvent(handle FocusWindow, handle PrevWindow)
;special processing for the common Explorer Pane components which appears in many Windows 7 dialogs
;such as Open and Save As:
var
	int nLevel,
	int iType,
	string sName,
	int iNameLength,
	string sDesc,
	string sPromptAndName,
	string sPrompt,
	int Left, int Right, int Top, int Bottom,
	int ParentLeft, int ParentRight, int ParentTop, int Parentbottom
if GetWindowClass(FocusWindow) != cwc_DirectUIhWND then
	return false
EndIf
if GetObjectName(SOURCE_CACHED_DATA,2) != objn_ExplorerPane then
	return false
EndIf
;processing is like that done in FocusChangedEventProcessAncestors, but some controls require special handling.
let nLevel = GetFocusChangeDepth()
while (nLevel >= 0)
	let sName = getObjectName(SOURCE_CACHED_DATA,nLevel)
	let sDesc = GetObjectDescription(SOURCE_CACHED_DATA,nLevel)
	;firtst speak any labels which are not obtained with SayObjectTypeAndText:
	if nLevel == 0 then
		let iType = GetObjectSubtypeCode(SOURCE_CACHED_DATA,nLevel)
		if iType == wt_dialog_Page then
			let iNameLength = StringLength(sName)
			GetObjectRect(left,right,top,bottom,true,nLevel)
			let sPromptAndName = GetTextInRect(left,top,right,bottom)
			if iNameLength > 0
			&& stringLength(sPromptAndName) > iNameLength
			&& StringRight(sPromptAndName,iNameLength) == sName then
				Say(StringChopRight(sPromptAndName,iNameLength),ot_control_name)
			EndIf
		elif iType == wt_button
		&& GetObjectSubtypeCode(SOURCE_CACHED_DATA,nLevel+1) == wt_dialog_page then
			GetObjectRect(Left,Right,Top,Bottom,true,nLevel)
			GetObjectRect(ParentLeft,ParentRight,ParentTop,ParentBottom,true,nLevel+1)
			let sPrompt = GetTextInRect(ParentLeft,Top,Left,Bottom)
			if sPrompt then
				Say(sPrompt,ot_control_name)
			EndIf
		EndIf
	EndIf
	;now speak the object:
	if StringCompare(sName,sDesc) == 0 then
		Say(sName,ot_control_name)
	elif nLevel == 0
	&& iType == wt_dialog_page then
		IndicateControltype(wt_button,sName)
	else
		sayobjectTypeAndText(nLevel)
	EndIf
	let nLevel= nLevel-1
EndWhile
return true
EndFunction

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow, optional handle PrevFocusWindow)
var string functionName = "FocusChangedEventShouldProcessAncestors"
if (ShouldOutputDebugString(LEVEL_HIDEBUG))
	FormattedOutputDebugStringL(
		"%1 status: UserBufferIsActive returned %2, InHJDialog returned %3, IsWinFormsWindow returned %4, FocusWindowSupportsUIA returned %5, GetJCFOption(OPT_MSAA_MODE) returned %6, GlobalRibbonState is %7.",
		LEVEL_HIDEBUG, functionName, UserBufferIsActive(), InHJDialog(), IsWinFormsWindow(FocusWindow),
		FocusWindowSupportsUIA(), GetJCFOption(OPT_MSAA_MODE), GlobalRibbonState)
endif
if (UserBufferIsActive() || InHJDialog())
	FormattedOutputDebugStringL("%1 status: returning false.", LEVEL_HIDEBUG, functionName)
	return false
endIf
var int ret = (
	IsWinFormsWindow(FocusWindow)
	|| FocusWindowSupportsUIA()
	|| GetJCFOption(OPT_MSAA_MODE) > 2
	|| GlobalRibbonState)
FormattedOutputDebugStringL("%1 status: returning %2.", LEVEL_HIDEBUG, functionName, ret)
return ret
EndFunction

void function ProcessEventOnFocusChangedEvent(handle AppWindow, handle RealWindow, string RealWindowName,
	handle FocusWindow, handle PrevWindow)
var int ForceSetupStuffForNewPage
if appWindow != globalPrevApp then
	;we've loaded a new app, and in case no local loadNonJCFOptions gets called,
	;but user has set something in QuickSettings and it is a NonJCF Option:
	loadNonJCFOptions ()
	; Update JCF with Global settings, purge out all prior personalized settings that were loaded.
	; This is only relevant when switching between two browser windows of the same application,
	; e.g two pages loaded in Internet Explorer or Firefox, loaded as separated windows.
	if IsMetroApp () then
	;explicitly do no Personalized Settings code,
	; even though the subsequent app window owner conditions can otherwise come true:
		ForceSetupStuffForNewPage = FALSE
	else
		ForceSetupStuffForNewPage = (StringCompare (GetWindowOwner (AppWindow), GetWindowOwner (GlobalPrevApp))
		== 0)
	EndIf
	if ForceSetupStuffForNewPage then
		SetUpStuffForNewPage (TRUE)
	endIf
endIf
let GlobalRibbonState = RibbonsActive()
if FocusChangedEventShouldProcessAncestors(FocusWindow,PrevWindow)
	if GetWindowClass (GetFocus()) == cwc_Windows_UI_Core_CoreWindow
	|| IsWinFormsWindow(AppWindow)
		ProcessSayAppWindowOnFocusChange(AppWindow, FocusWindow)
	endIf
	if IsWinFormsWindow(AppWindow)
		ProcessSayRealWindowOnFocusChange(AppWindow,RealWindow,RealWindowName,FocusWindow)
	endIf
	FocusChangedEventProcessAncestors(FocusWindow, PrevWindow)
	return
elif IsJavaWindow(FocusWindow) then
	JavaFocusChangedEvent (FocusWindow, PrevWindow)
	return
elif ExplorerPaneFocusChangedEvent(FocusWindow,PrevWindow) then
	return
EndIf
if GlobalRibbonState != GlobalPrevRibbonState then
	SpeakRibbonStatus(true)
EndIf
ProcessZTTetheredViewFocusChange (FocusWindow, RealWindow, RealWindowName)
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
ProcessSayRealWindowOnFocusChange(AppWindow,RealWindow,RealWindowName,FocusWindow)
ProcessSayFocusWindowOnFocusChange(RealWindowName,FocusWindow)
EndFunction

int function ReturningFromResearchItDialog ()
if ! inHjDialog ()
&& getWindowSubtypeCode (getFocus ()) != WT_WINSWITCH
&& (globalPrevRealName == cwn_ResearchIt_Input_dlg
|| getWindowName (globalPrevApp) == cwn_ResearchIt_Input_dlg) then
	return TRUE
endIf
endFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	string functionName = "FocusChangedEvent",
	HANDLE FocusedObjectID,
	HANDLE AppMainObjectID,
	HANDLE TopLevelObjectID,
	HANDLE RealObjectID,
	handle RealWindow,
	string RealWindowName,
	string RealWindowClass,
	handle AppWindow
let RealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
RealWindowClass = GetWindowClass(RealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
let GlobalFocusWindow = FocusWindow
let FocusedObjectID = navGetFocusObjectID ()
let AppMainObjectID = navGetAppMainObjectID (FocusedObjectID, FocusWindow)
let TopLevelObjectID = navGetTopLevelObjectID (FocusedObjectID, FocusWindow)
let RealObjectID = navGetRealObjectID (FocusedObjectID, FocusWindow)
FormattedOutputDebugStringL(
	"%1 status: RealWindow is 0x%2, RealWindowName is '%3', RealWindowClass is '%4', AppWindow is 0x%5, FocusWindow is 0x%6",
	LEVEL_DEBUG, functionName, DecToHex(RealWindow), RealWindowName, RealWindowClass,
	DecToHex(AppWindow), DecToHex(FocusWindow))
;suppress focus change when returning from ResearchIt, where
;the focus returns to the application before the viewer is properly spawned and receives the focus.
if ! ReturningFromResearchItDialog () then
ProcessEventOnFocusChangedEvent(AppWindow, RealWindow, RealWindowName, FocusWindow, PrevWindow)
endIf
;now set all the global variables for next time.
let GlobalPrevRibbonState = GlobalRibbonState
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
Let GlobalWasHjDialog = InHjDialog ()
if ( ( False == GlobalWasHjDialog ) && ( IsMacToolTipWindow (RealWindow) ) )
then
	Let GlobalWasHjDialog = True
EndIf
GlobalPrevDialogIdentifier = GetDialogIdentifier()
let g_PrevAppMainObjectID = AppMainObjectID
let g_PrevTopLevelObjectID = TopLevelObjectID
let g_PrevRealObjectID = RealObjectID
let g_PrevFocusedObjectID = FocusedObjectID
EndFunction

int function IgnoreObjectAtLevel (int level)
; by default, handles only panes where no name is present.
; overwrite locally if all of a particular ancestor or type should just not speak, does not apply to focus / level 0 objects.
if getObjectRole (level) == ROLE_SYSTEM_PANE
&& stringIsBlank (getObjectName(0, level)) then
	return TRUE
endIf
; remove redundant name speaking.
; example is where a static control is the parent of an element such as a link, and the two name strings are an exact match.
var int subtypeCodeAtLevel = getObjectSubtypeCode(FALSE, level)
if level > 0
&& subtypeCodeAtLevel == WT_STATIC
&& subtypeCodeAtLevel != getObjectSubtypeCode ()
&& stringCompare (getObjectName(FALSE, level), getObjectName (), TRUE) == 0 then
; This is by nature redundant,
; stringCompare ensure s we're getting an exact case-sensitive match:
	return TRUE
endIf
return FALSE
endFunction

int function SetDepthForFocusChangedEventProcessAncestors(handle FocusWindow, handle PrevWindow)
;App-specific scripts may wish to limit the depth of ancestors processed by FocusChangedEventProcessAncestors
return GetFocusChangeDepth()
EndFunction

String Function GetHeaderToSpeakForSayColumnAndRowHeaders(String columnHeader, String rowHeader)
var string headerToSpeak = cscNull
headerToSpeak = columnHeader
if (!StringIsBlank(rowHeader))
	if (!StringIsBlank(headerToSpeak))
		headerToSpeak = headerToSpeak + cScSpace
	endIf
	headerToSpeak = headerToSpeak + rowHeader
endIf
return headerToSpeak
EndFunction

/* This function is called from FocusChangedEventProcessAncestors and from ActiveItemChangedEvent. It speaks
the column header or row header if it is appropriate to do so. The decision is based on the object type and the
value of the globalSpeakHeaderOnCellChange variable. */
Void Function SpeakTableHeaderOnCellChangeHelper(int type, int isActiveItemChanged)
var string functionName = "SpeakTableHeaderOnCellChangeHelper"
var int earlyReturnNum = 0
FSLog("%1 called: type is %2; isActiveItemChanged is %3; globalSpeakHeaderOnCellChange is %4.",
  	functionName, type, isActiveItemChanged, globalSpeakHeaderOnCellChange)
if (isActiveItemChanged)
	if (type != WT_TABLECELL && type != WT_COLUMNHEADER && type != WT_ROWHEADER)
		earlyReturnNum = earlyReturnNum + 1
		FSLog("%1 status: early return %2.", functionName, earlyReturnNum)
		return
	EndIf
else
	if (type != WT_TABLECELL)
		earlyReturnNum = earlyReturnNum + 1
		FSLog("%1 status: early return %2.", functionName, earlyReturnNum)
		return
	EndIf
EndIf
var
	string columnHeader = GetColumnHeader(TRUE),
	string rowHeader = GetRowHeader(TRUE),
	string headerToSpeak = cscNull
if (globalSpeakHeaderOnCellChange == TABLE_NAV_HORIZONTAL)
	headerToSpeak = columnHeader
elif (globalSpeakHeaderOnCellChange == TABLE_NAV_VERTICAL)
	headerToSpeak = rowHeader
elif (globalSpeakHeaderOnCellChange == TABLE_NAV_SAY_COLUMN_AND_ROW_HEADERS)
	headerToSpeak = GetHeaderToSpeakForSayColumnAndRowHeaders(columnHeader, rowHeader)
else
	earlyReturnNum = earlyReturnNum + 1
	FSLog("%1 status: early return %2.", functionName, earlyReturnNum)
	return
EndIf
FSLog("%1 status: headerToSpeak is '%2'.", functionName, headerToSpeak)
Say(headerToSpeak, OT_SCREEN_MESSAGE)
EndFunction

Void Function SpeakTableColumnAndRowHelper(int type)
var string functionName = "SpeakTableColumnAndRowHelper"
var int earlyReturnNum = 0
FSLog("%1 called: type is %2.",	functionName, type)
if (type != WT_TABLECELL)
	earlyReturnNum = earlyReturnNum + 1
	FSLog("%1 status: early return %2.", functionName, earlyReturnNum)
	return
EndIf
var
	int column = 0,
	int row = 0,
	int cellCoordinatesAreValid = False
cellCoordinatesAreValid = GetTableCoordinatesForSpeakTableCells(column, row, TABLE_NAV_NONE)
FSLog("%1 status: cellCoordinatesAreValid is %2.", functionName, cellCoordinatesAreValid)
if (cellCoordinatesAreValid)
	FSLog("%1 status: column is %2; row is %3.", functionName, column, row)
	SayUsingVoice(VCTX_message, FormatString(cMSGColumnAndRow, IntToString(row), IntToString(column)), ot_position)
endIf
EndFunction

Void Function FocusChangedEventProcessAncestors(handle FocusWindow, handle PrevWindow)
var string functionName = "FocusChangedEventProcessAncestors"
var int earlyReturnNum = 0
var
	int nLevel = SetDepthForFocusChangedEventProcessAncestors(FocusWindow, PrevWindow),
	int iType = 0
FSLog("%1 called: FocusWindow is 0x%2; PrevWindow is 0x%3; nLevel is %4.",
	functionName, DecToHex(FocusWindow), DecToHex(PrevWindow), nLevel)
while (nLevel >= 0)
	iType = GetObjectSubtypecode(SOURCE_CACHED_DATA, nLevel)
	if (nLevel > 0)
		if (!IgnoreObjectAtLevel(nLevel))
			if (nLevel == 1)
				SpeakTableHeaderOnCellChangeHelper(iType, false)
			EndIf
			sayObjectTypeAndText(nLevel)
			SpeakTableColumnAndRowHelper(iType)
			if nLevel == 1
			&& iType == WT_LISTBOXITEM
			&& GetObjectName(false, 3) == cwn_ShellFolderView
				;break out of loop early to prevent extra speaking when navigating up or down a column
				nLevel = earlyReturnNum
			endIf
		endIf
	else ;at level 0:
		SpeakTableHeaderOnCellChangeHelper(iType, false)
		if (
			iType == wt_groupbox
			&& GetObjectSubTypeCode(SOURCE_CACHED_DATA, nLevel + 1) == wt_listview
			)
			SayControlEx(0, GetObjectName(SOURCE_CACHED_DATA), cmsgGrouping);
		else
			sayObjectTypeAndText(nLevel)
			if iType==WT_MULTILINE_EDIT&& stringLength(getObjectValue(2,0)) >= 1 &&
				!IsEmptyEditFormField ()
				SayUsingVoice(vctx_message,msgContainsText,ot_line)
			endIf
		endIf
		SpeakTableColumnAndRowHelper(iType)
	EndIf
	nLevel = nLevel - 1
EndWhile
EndFunction

int function SilenceNonFocusedSeekBarsForMagic(handle hWnd, int nObjType)
if GetRunningFSProducts() != product_MAGic then
	;only silence seek bars if MAGic is the only running product
	return false
endIf
;Check for seek bars in media apps not in focus
If hwnd == GetFocus() then
	return false
EndIf
return nObjType == WT_UPDOWNSLIDER
	|| nObjType == WT_LEFTRIGHTSLIDER
	|| nObjType == WT_SLIDER
endFunction

void function AutoCompleteWindowShowEvent(handle hwnd)
ghWndAutoCompleteSuggestionList = FindWindow(hWnd,cWcListView)
EndFunction

void function AutoCompleteWindowHideEvent(handle hwnd)
; Do not null ghWndAutoCompleteSuggestionList here, that is done in WindowDestroyedEvent.
EndFunction

int function AutoCompleteSuggestionListIsVisible()
return ghWndAutoCompleteSuggestionList
	&& IsWindowVisible(ghWndAutoCompleteSuggestionList)
EndFunction

int function AutoCompleteSuggestionListHasDeselectedItem()
return AutoCompleteSuggestionListIsVisible()
	&& lvGetItemState(ghWndAutoCompleteSuggestionList,lvGetFocusItem(ghWndAutoCompleteSuggestionList)) == 0
endFunction

void function AutoCompleteWindowItemSelectedEvent(handle hwnd)
Say(lvGetItemText(ghWndAutoCompleteSuggestionList,lvGetFocusItem(ghWndAutoCompleteSuggestionList),1),ot_line)
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
var
	int iWinType,
	int iObjType,
	int iObjState
if nSelectingText then
	return
EndIf
SaveCursor ()
PCCursor ()
Let iObjType = GetObjectSubtypeCode ()
iObjState = GetObjectStateCode()
if IsJavaWindow (curHwnd) then
	if g_JavaIgnoreNextActiveItemChange then
		let g_JavaIgnoreNextActiveItemChange = 0
		RestoreCursor ()
		return
	EndIf
	if WT_TABLE == iObjType
	|| WT_TABLECELL == iObjType then
		if !InTable() then
			let g_JavaPrevNumOfCells = 0
			let g_JavaTableNavDir = TABLE_NAV_NONE
		else
			SpeakTableCells (g_JavaTableNavDir, g_JavaPrevNumOfCells)
			let g_JavaPrevNumOfCells = 0
			let g_JavaTableNavDir = TABLE_NAV_NONE
			RestoreCursor ()
			return
		endif
	endIf
endIf
if SilenceNonFocusedSeekBarsForMagic(curHWnd, iObjType) then
	Return
endIf
if iObjType == wt_ListBoxItem
&& FocusWindowSupportsUIA() then
	say(GetObjectName(),ot_line)
if (iObjState & ctrl_checked)
		IndicateControlState(wt_checkbox, ctrl_checked)
	elif (iObjState & ctrl_unchecked)
		IndicateControlState(wt_checkbox, ctrl_unchecked)
	endif
	if ShouldItemSpeak(OT_ANNOUNCE_POSITION_AND_COUNT) then
		SayMessage(OT_POSITION, PositionInGroup())
	endIf
	return
elif (WT_TREEVIEW == iObjType
|| WT_TREEVIEWITEM == iObjType
|| GetWindowClass(curHwnd) == cwc_SysTreeview32)
&& !MenusActive() then
	SayTreeViewLevel (true)
	RestoreCursor ()
	return
elif iObjType == WT_TABLECELL
|| iObjType == WT_COLUMNHEADER
|| iObjType == WT_ROWHEADER then
	SpeakTableHeaderOnCellChangeHelper(iObjType, true)
	;Winforms windows contain their own row / column header data.
	;Example are stand-alone databases copiled as exe.
	if IsWinFormsWindow (curHwnd)
	&& StringIsBlank (GetRowHeader (TRUE) )
	&& StringIsBlank (GetColumnHeader (TRUE)) then
		sayObjectActiveItem ()
		SpeakTableColumnAndRowHelper(iObjType)
	else
		sayCell()
	endIf
	RestoreCursor ()
	return
endIf
let iWinType = getWindowSubtypeCode (curHwnd)
if iWinType != WT_TASKBAR && iWinType != WT_SYSTRAY
&& (iObjType == wt_button
|| iObjType == wt_CheckBox
|| iObjType == wt_RadioButton) then
	if iWinType == WT_LISTVIEW || iWinType == WT_LISTBOX
	|| getWindowClass (CurHwnd) == cwc_ListBox then
	; checkable lists , read just the changing item and not the name and type of the list while navigating in it.
		SayObjectActiveItem (ShouldItemSpeak (OT_ANNOUNCE_POSITION_AND_COUNT))
	else
		SayObjectTypeAndText()
	endIf
else
	; removed code from this spot for special handling of list view items
	; in favor of the internal handling using SayObjectActiveItem()
	;special case for SWT_Window0 (probably should apply to all cases but for safety)
	if StringCompare (GetWindowClass (GetTopLevelWindow (curHwnd)),"SWT_Window0",false) == 0
	&& curHwnd != prevHwnd then
		SayObjectTypeAndText (0)
	else
		SayObjectActiveItemWithDescription(ShouldItemSpeak (OT_ANNOUNCE_POSITION_AND_COUNT)) ; for lists when navigating
		ProcessZTTetheredViewItemChange (curHwnd)
	EndIf
EndIf
RestoreCursor ()
EndFunction

String Function GetObjectPositionString(handle hwnd, int nObjType)
if (nObjType == WT_COMBOBOX)
   var int currentItem = GetCurrentItem(hwnd)
   var int itemCount = GetItemCount(hwnd)
   if (itemCount <= 0)
      ; The GetItemCount function returns -1 when it is not able to get the item count
      ; (the window is not a list view, combo box, edit combo box, or tool bar). In addition,
      ; the GetItemCount function returns 0 for an empty list view, combo box, edit combo box,
      ; or tool bar. If the item count cannot be obtained or the control is empty, JAWS
      ; should not attempt to speak the position string. Thus return an empty string here.
      return cscNull
   endIf
   return (FormatString(cmsgPosInGroup1, IntToString(currentItem), IntToString(itemCount)))
endIf
return cscNull
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,optional int bIsFocusObject)
if IsJavaWindow (hwnd) then
	if (WT_UNKNOWN == nObjType)
	|| (WT_LEFTRIGHTSLIDER == nObjType)
	|| (WT_PROGRESSBAR == nObjType)
	|| (WT_SLIDER == nObjType)
	|| (WT_STATIC == nObjType)
	|| (WT_UPDOWNSLIDER == nObjType) then
		Say(sObjValue,ot_line)
	elif WT_EDIT_SPINBOX == nObjType
	|| WT_SPINBOX == nObjType
		;Do Nothing.  Otherwise the value will be spoken twice, once by SayLineUnit and
		;once in response to the Value Changed Event.
	else
		Say(GetObjectValue(),ot_line)
	endIf
endIf
if SilenceNonFocusedSeekBarsForMagic(hWnd, nObjType) then
	Return
endIf
if bIsFocusObject
	if nObjType == WT_COMBOBOX
		Say(sObjValue, ot_line, smartMarkupDetection)
		var string sObjPosition = GetObjectPositionString(hWnd, nObjType)
		if (!StringIsBlank(sObjPosition))
			Say(sObjPosition, OT_POSITION, smartMarkupDetection)
		endIf
		return
	elif (nObjType == wt_edit || nObjType == wt_editCombo)
	&& GetObjectSubtypeCode(SOURCE_CACHED_DATA) == wt_editCombo
		if !AutoCompleteSuggestionListIsVisible()
		&& GetWindowClass(GetFocus()) != cwc_ChromeWindowClass
			Say(sObjValue, ot_line, smartMarkupDetection)
			var int parentObjType=GetObjectSubTypeCode (SOURCE_DEFAULT, 1)
			if nObjType==WT_EDIT && parentObjType==WT_COMBOBOX then
				sObjPosition = GetObjectPositionString(hWnd, parentObjType)
				if (!StringIsBlank(sObjPosition))
					Say(sObjPosition, OT_POSITION, smartMarkupDetection)
				endIf
			endIf
			return
		endIf
	elif nObjType==WT_SLIDER ; this is a slider with either role of slider or that supports UIA
		if (!ShouldSayFunctionsSpeakSlider (nObjType) || FocusWindowSupportsUIA())
			; sliders whose text actually contains the associated view name selected.
			if onViewSliderControl (getObjectSubtypeCode ()) then
			; custom views sliders where when you change, the new value is expressed in a name such as tiles, etc.:
				Say(getObjectValue(SOURCE_CACHED_DATA), ot_line, smartMarkupDetection)
			else
			Say(sObjValue, ot_line, smartMarkupDetection)
			endIf
			return
		endIf
	elif (nObjType == wt_DateTime)
	|| nObjType == wt_separator
		Say(sObjValue, ot_line, smartMarkupDetection)
	EndIf
else ;!bIsFocusObject
	if nObjType == wt_comboBox
	&& GetWindowClass(hWnd) == cwc_NetUIHwnd
	&& GetWindowClass(GetFocus()) == cwc_Richedit50W
		;Make sure focus is not in the document area:
		var int nFocusObjType = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
		if nFocusObjType == wt_edit
		|| nFocusObjType == wt_editCombo
			;Do not use sObjValue, if the line is empty due to editing
			;the sObjValue contains unwanted extraneous text:
			Say(GetLine(),ot_line)
		endIf
	endIf
endIf
EndFunction

Void Function NameChangedEvent (handle hwnd, int objId, int childId, int nObjType,
	string sOldName, string sNewName)
if !GetParent (hwnd)
&& "SunAwtFrame" == GetWindowClass (hwnd)
&& IsJavaWindow (hwnd)
&& "IEXPLORE.EXE" == GetAppFileName () then
	;This is most likely an Oracle Forms applet
	var
		int navObjectType,
		handle navFocusObjectId,
		int navFocusObjectType
	let navObjectType = navGetObjectTypeCode (objId, hwnd)
	let navFocusObjectId = navGetFocusObjectID ()
	let navFocusObjectType = navGetObjectTypeCode (navFocusObjectId, hwnd)
	if ( objId != navFocusObjectId ) then
		if ( WT_EDIT == navObjectType ) then
			return
		elif WT_STATIC == navObjectType
		&& WT_RADIOBUTTON == navFocusObjectType then
			return
		endIf
	endIf
endIf
if SilenceNonFocusedSeekBarsForMagic(hWnd, nObjType) then
	Return
endIf
Say (sNewName, OT_WINDOW_INFORMATION)
EndFunction

void Function GetDescriptionForRibbons ()
;We don't use the cached description here because that description is technically the wrong one.
;The event sets a timer before calling this.
var string sHelp = GetObjectDescription(SOURCE_CACHED_DATA)
unscheduleFunction (giFN_Helper)
Say (sHelp, OT_WINDOW_INFORMATION)
endFunction

Void Function DescriptionChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldDescription, string
	sNewDescription,optional int bFromFocusObject)
if hwnd != GetFocus() then
	if bFromFocusObject
	&& IsJavaWindow(hwnd) then
		;Do nothing.  Description changed events must be processed for Java windows even if
		;the window handle for the event is not the same as the focused window handle if the
		;bFromFocusObject parameter is true.
		;This can happen if the window for the event is the ancestor of the focus window.
	else
		return
	EndIf
EndIf
if IsVirtualRibbonActive() then
	;eliminate spew of description when navigating virtual ribbons into a new submenu:
	return
EndIf
unscheduleFunction (giFN_Helper)
if !GetParent (hwnd)
&& "SunAwtFrame" == GetWindowClass (hwnd)
&& IsJavaWindow (hwnd)
&& "IEXPLORE.EXE" == GetAppFileName () then
	;This is most likely an Oracle Forms applet
	var
		int navObjectType,
		handle navFocusObjectId,
		int navFocusObjectType
	let navObjectType = navGetObjectTypeCode (objId, hwnd)
	let navFocusObjectId = navGetFocusObjectID ()
	let navFocusObjectType = navGetObjectTypeCode (navFocusObjectId, hwnd)
	if ( objId != navFocusObjectId ) then
		if ( WT_EDIT == navObjectType ) then
			return
		elif WT_STATIC == navObjectType
		&& WT_RADIOBUTTON == navFocusObjectType then
			return
		endIf
	endIf
endIf
if !bFromFocusObject then
	return
EndIf
if GlobalRibbonState
|| menusActive ()
|| globalMenuMode == 2 then
	;The following delay is critical, because the drop down menu in this instance must be drawn.  When this event is first pushed to us, the first menu drop down item still shows as a page tab.
	;delay (1)
	var int iSubtype = getObjectSubtypeCode(SOURCE_CACHED_DATA)
	if (iSubtype == WT_MENU
	;or still shows as a ribbon tab but the menu is preparing to drop down:
	|| iSubtype == WT_TABCONTROL) then
		let giFN_Helper = scheduleFunction ("GetDescriptionForRibbons", 2)
		Return
	endIf
endIf
Say (sNewDescription, OT_WINDOW_INFORMATION)
EndFunction

void function AnnounceDocumentElements()
var
	int nFrames,
	string sFrames,
	int nRegions,
	string sRegions,
	int nHeadings,
	string sHeadings,
	int nLinks,
	string sLinks,
	string sInfo,
	string sMessage,
	int iSpeakMode,
	int glanceHighlightCount,
	string SmartGlanceMsg

AnnounceVisperoConnectedLinkForPageLoad ()
if ! GlobalAnnouncePageElementsOnLoad then return endIf
let nFrames = GetHTMLFrameCount()
if GetRunningFSProducts() & product_JAWS then
	let nRegions = GetRegionCount(WT_LandmarkRegion)
endIf
Let nHeadings = GetHeadingCount (0)
let nLinks = GetLinkCount()
;The following section provides the messages to be formatted into the string for each element type:
;Frames, landmarks, applications, headings and links.
If nFrames == 0 then
	Let sFrames = cScNull
ElIf nFrames == 1 then
	let sFrames = IntToString (nFrames) + cMsgFrame
Else
	let sFrames = IntToString (nFrames) + cMsgFrames
EndIf
If nRegions == 0 then
	Let sRegions = cScNull
ElIf nRegions == 1 then
	let sRegions = IntToString (nRegions) + cMsgRegion
Else
	let sRegions = IntToString (nRegions) + cMsgRegions
EndIf
If nHeadings == 0 then
	Let sHeadings = cScNull
ElIf nHeadings == 1 then
	Let sHeadings = IntToString (nHeadings)+cMsgHeading
Else
	Let sHeadings = IntToString (nHeadings)+cMsgHeadings
EndIf
If nLinks == 0 then
	;Use specific no link message.
	Let sLinks = cMsgNoLinks
ElIf nLinks == 1 then
	Let sLinks = IntToString (nLinks)+cMsgLink
Else
	Let sLinks = IntToString (nLinks)+cMsgLinks
EndIf
let sInfo = FormatOneTwoAndThree( sFrames, sRegions, sHeadings, sLinks )
let iSpeakMode = ShouldItemSpeak(OT_SCREEN_MESSAGE)
if iSpeakMode == message_long then
	Let sMessage = FormatString (cmsgDocumentLoaded3_L, sInfo )
else
	Let sMessage = FormatString (cmsgDocumentLoaded3_S, sInfo )
EndIf

if GETJcfOption(optSmartGlanceHighlightIndication) & 1 then
	let glanceHighlightCount=GetCountOfGlanceHighlights()
	if glanceHighlightCount > 0 then
		if iSpeakMode == message_long then
			let SmartGlanceMsg=formatString(cmsgSmartGlanceHighlightIndicate_L, IntToString(glanceHighlightCount))
		else
			let	SmartGlanceMsg=formatString(cmsgSmartGlanceHighlightIndicate_S, intToString(glanceHighlightCount))
		endIf
		let sMessage = sMessage +cScBufferNewLine
		let sMessage=sMessage+SmartGlanceMsg
	endIf
endIf


SayUsingVoice(vctx_message,sMessage,OT_SCREEN_MESSAGE)
EndFunction

string function SelectStringUsingBit( int bit, string p1, string p2, string p3, string p4,
	string p5, string p6, string p7, string p8 )
var
	string s
if bit == 0 then
	return cscNull
EndIf
if bit & 0x01 then
	let s = p1
ElIf bit & 0x02 then
	let s = p2
ElIf bit & 0x04 then
	let s = p3
ElIf bit & 0x08 then
	let s = p4
ElIf bit & 0x10 then
	let s = p5
ElIf bit & 0x20 then
	let s = p6
ElIf bit & 0x40 then
	let s = p7
ElIf bit & 0x80 then
	let s = p8
EndIf
return s
EndFunction

string function FormatOneTwoAndThree( string p1,optional  string p2, string p3, string p4,
	string p5, string p6, string p7, string p8 )
var
	int validStrings,
	int count,
	int flags,
	string s1,
	string s2,
	string s3,
	string s4,
	string s5,
	string s6,
	string s7,
	string s8,
	string text
; first count the number of valid strings passed in
if p1 then
	let flags = flags | 0x01
	let validStrings = validStrings + 1
EndIf
if p2 then
	let flags = flags | 0x02
	let validStrings = validStrings + 1
EndIf
if p3 then
	let flags = flags | 0x04
	let validStrings = validStrings + 1
EndIf
if p4 then
	let flags = flags | 0x08
	let validStrings = validStrings + 1
EndIf
if p5 then
	let flags = flags | 0x10
	let validStrings = validStrings + 1
EndIf
if p6 then
	let flags = flags | 0x20
	let validStrings = validStrings + 1
EndIf
if p7 then
	let flags = flags | 0x40
	let validStrings = validStrings + 1
EndIf
if p8 then
	let flags = flags | 0x80
	let validStrings = validStrings + 1
EndIf
if validStrings < 1
|| !flags then
	return cscNull
EndIf
var
	int i,
	int found,
	string temp
let i = 1
let count = 1
while count <= 8
	if flags & i then
		let found = found + 1;
		let temp = SelectStringUsingBit( i, p1, p2, p3, p4, p5, p6, p7, p8 );
		if found == 1 then let s1 = temp EndIf
		if found == 2 then let s2 = temp EndIf
		if found == 3 then let s3 = temp EndIf
		if found == 4 then let s4 = temp EndIf
		if found == 5 then let s5 = temp EndIf
		if found == 6 then let s6 = temp EndIf
		if found == 7 then let s7 = temp EndIf
		if found == 8 then let s8 = temp EndIf
		let temp = cscNull
	EndIf
	let count = count + 1
	let i = i * 2
EndWhile
if validStrings == 1 then
	let text = FormatString( cmsgFormatList1, s1 );
ElIf validStrings == 2 then
	let text = FormatString( cmsgFormatList2, s1, s2 );
ElIf validStrings == 3 then
	let text = FormatString( cmsgFormatList3, s1, s2, s3 );
ElIf validStrings == 4 then
	let text = FormatString( cmsgFormatList4, s1, s2, s3, s4 );
ElIf validStrings == 5 then
	let text = FormatString( cmsgFormatList5, s1, s2, s3, s4, s5 );
ElIf validStrings == 6 then
	let text = FormatString( cmsgFormatList6, s1, s2, s3, s4, s5, s6 );
ElIf validStrings == 7 then
	let text = FormatString( cmsgFormatList7, s1, s2, s3, s4, s5, s6, s7 );
ElIf validStrings == 8 then
	let text = FormatString( cmsgFormatList8, s1, s2, s3, s4, s5, s6, s7, s8 );
EndIf
return text
EndFunction

void function ClearCustomPageSummarySuppressor()
let giCustomPageSummarySuppressor = 0
EndFunction

int function ShouldCheckForCustomPageSummary()
return !giCustomPageSummarySuppressor
EndFunction

int function CustomPageSummaryReported()
var
	int nPlaceMarkerCount,
	int nPriorFormsModeState,
	int iCustomPageSummaryOption
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
;Since either or both DocumentLoadedEvent and DocumentUpdate may fire,
;we attempt to keep the custom summary from being reported more than once:
let iCustomPageSummaryOption = GetJCFOption(OPT_CUSTOM_PAGE_SUMMARY)
let giCustomPageSummarySuppressor = ScheduleFunction("ClearCustomPageSummarySuppressor",30)
; Forms mode must be off to get the placemarker count
let nPriorFormsModeState = IsFormsModeActive()
if IsFormsModeActive() then
	TurnOffFormsMode(FormsModeEventSpeechSilent)
endIf
let nPlaceMarkerCount=GetPlaceMarkerCount ()
if nPriorFormsModeState then
	TurnOnFormsMode(FormsModeEventSpeechSilent)
endIf
if nPlaceMarkerCount then
	if iCustomPageSummaryOption == CPSSpeak then
		SpeakCustomPageSummary()
		return true
	elif iCustomPageSummaryOption == CPSVirtualize then
		VirtualizeCustomPageSummary()
		return true
	endIf
endIf
return false
EndFunction

int function DocumentLoadedAtFormField()
var
	int iSubtype
let iSubtype = GetObjectTypeCode()
if iSubtype == WT_EDIT
|| iSubtype == wt_Multiline_Edit
|| iSubtype == wt_PassWordEdit
|| iSubtype == wt_EditCombo
|| iSubtype == wt_ComboBox
|| iSubtype == wt_ListBox
|| iSubtype == wt_MultiSelect_ListBox
|| iSubtype == wt_ExtendedSelect_ListBox then
	if GetRunningFSProducts() != product_MAGic then
		;Speak appropriate tutor message:
		;but only if we haven't spoken the message within 2000 ticks
		if GetTickCount()-giLastDocumentLoadTime > 2000
		&& giLastFormsModeState != IsFormsModeActive() then
			If IsVirtualPcCursor () then
				SayUsingVoice(VCTX_MESSAGE, cMsgPressEnterForFormsMode, OT_SMART_HELP)
			ElIf IsFormsModeActive() then
				SayUsingVoice(VCTX_MESSAGE, cMsgFormsMode, OT_SMART_HELP)
			EndIf
			let giLastFormsModeState=IsFormsModeActive()
		endIf
	endIf
	let giLastDocumentLoadTime=GetTickCount()
	Return true
ElIf iSubtype == wt_Button
|| iSubtype == wt_CheckBox
|| iSubtype == wt_RadioButton then
	if GetRunningFSProducts() != product_MAGic then
		;Speak appropriate tutor message:
		;but only if we haven't spoken the message within 2000 ticks
		if GetTickCount()-giLastDocumentLoadTime > 2000
		&& giLastFormsModeState != IsFormsModeActive() then
			If IsFormsModeActive() then
				SayUsingVoice(VCTX_MESSAGE, cMsgFormsMode, OT_SMART_HELP)
			EndIf
			let giLastFormsModeState=IsFormsModeActive()
		endIf
	EndIf
	let giLastDocumentLoadTime=GetTickCount()
	Return true
EndIf
return false
EndFunction

int function ProcessDocumentLoadAppAlerts()
;Overwrite this function in applications where special alerts are processed during DocumentLoadedEvent.
;Return true if an alert is displayed in the user buffer,
;false if no alerts are displayed in the user buffer or if no alerts are processed.
;DocumentLoadedEvent will use the return value to determine
;if the following default actions should be processed immediately or postponed until the user buffer is dismissed.
return false
EndFunction

int function IsBrowserClassWindowOrDocument()
var string sClass = GetWindowClass(GetFocus())
return sClass == cwcChromeBrowserClass
	|| sClass==cwcIEServer
	|| sClass==cwcFireFoxBrowserClass
	|| sClass == cwcFireFox4BrowserClass
	|| (sClass==cwcAdobeDocClass && GetWindowName(GetCurrentWindow ()) ==wnAdobeDocName)
	|| sClass == cwcFoxitDocClass
EndFunction

int function ShouldSayAllOnDocumentLoad()
if !IsBrowserClassWindowOrDocument() return false endIf
; Ensure dialogs in the virtual buffer read using sayAll
if IsVirtualPCCursor()
&& dialogActive ()
&& !(GetRunningFSProducts() & product_Fusion)
	return true
endIf
return gbDefaultSayAllOnDocumentLoad
EndFunction

void function DoDefaultDocumentLoadActions()
if ShouldCheckForCustomPageSummary()
&& GetJCFOption(OPT_CUSTOM_PAGE_SUMMARY) then
	CustomPageSummaryReported()
	return
EndIf
if DocumentLoadedAtFormField() then
	return
EndIf
let giLastDocumentLoadTime=GetTickCount()
if IsBrowserClassWindowOrDocument()
	PCCursor()
	if IsVirtualPCCursor()
	&& !SayAllInProgress() then
		if !(GetRunningFSProducts() & product_Fusion)
			AnnounceDocumentElements()
		endIf
		if ShouldSayAllOnDocumentLoad()
			QueueFunction( "SayAll()" )
		EndIf
	endIf
endIf
EndFunction

Void Function DocumentLoadedEvent ()
if IsBackgroundOCREnabled()
&& c_BackgroundOCRRect.restrictedToCustomRect
	PerformScript StopBackgroundRecognition()
endIf
Delay (5);Wait to check focus.
priorTopLineOfNewContent=cscNull
if GetJCFOption(OPT_AUTO_FORMS_MODE) == 0
&& GetJCFOption(optFormsModeAutoOff) == 1 then
	TurnOffFormsMode()
EndIf
if BackForward == 1 then
	SayLine()
	let BackForward=0
	return
endIf
let gbDocumentLoadAppAlertShowing = ProcessDocumentLoadAppAlerts()
if !gbDocumentLoadAppAlertShowing then
	DoDefaultDocumentLoadActions()
	;otherwise DoDefaultDocumentLoadActions is called when the user buffer is dismissed
EndIf
EndFunction

void function TurnOffFormsMode(optional int bFormsModeEventSpeechSilent)
let GiIgnoreFormsModeSpeak = bFormsModeEventSpeechSilent
TurnOffFormsMode()
EndFunction

void function TurnOnFormsMode(optional int bFormsModeEventSpeechSilent)
let GiIgnoreFormsModeSpeak = bFormsModeEventSpeechSilent
TurnOnFormsMode()
EndFunction

void function FormsModeEvent(int bEntering, optional int lastMovementUnit)
var int SpeakFormsModeSetting, int FSProducts = getRunningFSProducts ();
;First get relevant data for SpeakFormsModeSetting, since the JCF setting doesn't actually work with both products working together:
if ! (FSProducts & PRODUCT_MAGic) then
	SpeakFormsModeSetting = GetJcfOption(OPT_SPEAK_FORMS_MODE_CHANGES)
else
	if stringIsBlank (iniReadString ("FormsMode", "SpeakFormsModeChanges", "", GetActiveConfiguration()+".jcf"))
		SpeakFormsModeSetting = iniReadInteger ("FormsMode", "SpeakFormsModeChanges", 0, "Default.jcf")
	else
		SpeakFormsModeSetting = iniReadInteger ("FormsMode", "SpeakFormsModeChanges", 0, GetActiveConfiguration()+".jcf")
	endIf
endIf
if GiIgnoreFormsModeSpeak == FormsModeEventSpeechSilent
|| GetJCFOption(OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE) == true
|| SpeakFormsModeSetting == false then
	Let GiIgnoreFormsModeSpeak = FormsModeEventSpeechNormal
	if (bEntering) then
		BrailleRefresh ()
	endIf
	Return
EndIf
;wrap the speech in condition to determine if only JAWS,
;MAGic is not to speak this.
if FSProducts & product_JAWS then
	if (bEntering) then
		SayFormattedMessage (OT_status, cmsg286_L)
		BrailleRefresh ()
		if StringCompare(StringSegment(GetDocumentPath(),cscColon,1),cscHttps) == 0 then
			SayUsingVoice(vctx_message,cmsgSecureConnection,OT_help)
		EndIf
	else
		SayFormattedMessage (OT_status, cmsg287_L)
	endIf
endIf
EndFunction

void function TextSelectedEvent(string strText, int bUnSelecting, optional int bContainsSpeechMarkup)
var
	int iStringLength,
	string strChopped,
	string strNoMarkup,
	int noMarkupLen
if gbSelectingTextBetweenMarkedPlaceAndCurrentPosition then
	;the script will announce that text was selected between marked place and current position,
	;so do not speak the selected text:
	return
endIf
if (bContainsSpeechMarkup) then
	let strNoMarkup=smmStripMarkup(strText)
else
	let strNoMarkup=strText
endIf
let noMarkupLen=stringLength(strNoMarkup)
;First, check to see if we've selected a huge amount of text.
;Without this test, it is possible to overrun speech.
if bUnSelecting then
	If noMarkupLen >= 1000
	&& !(GetRunningFSProducts() == product_MAGic) then
		SayFormattedMessage (OT_SELECT,cmsg214_L)
		SayMessage (OT_NO_DISABLE, FormatString (cmsg380, IntToString ((noMarkupLen-20))))
		let strChopped=StringChopRight (strNoMarkup, (noMarkupLen-20))
		SayMessage (OT_WORD, strChopped)
	else
		SayTextSelection(cmsg214_L,strText,
			noMarkupLen==1,bContainsSpeechMarkup)
	EndIf
else
	If noMarkupLen >= 1000
	&& !(GetRunningFSProducts() == product_MAGic) then
		SayFormattedMessage (OT_SELECT,cmsg215_L)
		SayMessage (OT_NO_DISABLE, FormatString (cmsg380, IntToString ((noMarkupLen-20))))
		let strChopped=StringChopLeft(strNoMarkup, (noMarkupLen-20))
		SayMessage (OT_WORD, strChopped)
		Return;
	else
		SayTextSelection(cmsg215_L,strText,
			noMarkupLen==1,bContainsSpeechMarkup)
	EndIf
endIf
EndFunction

Void Function ClipboardChangedEvent ()
if ClipboardTextChanged == CLIPBOARD_APPENDED then
	SayMessage(OT_JAWS_MESSAGE, cmsgAppendedTextToClipboard_L, cmsgAppendedTextToClipboard_S)
ElIf ClipboardTextChanged == CLIPBOARD_COPIED then
	SayMessage(OT_JAWS_MESSAGE, cmsg52_L, cmsg52_S)
ElIf ClipboardTextChanged == CLIPBOARD_CUT then
	SayMessage(OT_JAWS_MESSAGE, cmsg51_L, cmsg51_S)
endIf
let ClipBoardTextChanged = false
EndFunction

Void Function SayFocusedWindow ()
SayFocusedObject ()
EndFunction

int function onViewSliderControl (int subtypeCode)
if (subtypeCode != WT_LEFTRIGHTSLIDER&& subtypeCode != WT_UPDOWNSLIDER)
|| getObjectClassName (1) != "ViewControlClass" then
	; not in custom slider where views are specified:
	return FALSE
endIf
return TRUE
endFunction

int function sayFocusedObjectViewSliders ()
if ! isPcCursor () || inHjDialog () || UserBufferIsActive () return FALSE endIf
var int subtypeCode = getObjectSubtypeCode ()
if ! onViewSliderControl (subtypeCode) then return FALSE endIf
indicateControlType (subtypeCode, getObjectName (), getObjectValue(SOURCE_CACHED_DATA))
return TRUE
endFunction

string function GetLongestOfObjectNameOrValue()
var
	string name = GetObjectName(),
	int nameLen = StringLength(name),
	string value = GetObjectValue(),
	int valueLen = StringLength(value)
if (nameLen > valueLen)
	return name
elif (valueLen > nameLen)
	return value
endIf
;; If they are the same length return name.
return name
EndFunction

string function SmartGetTreeViewObjectValue()
if (StringCompare(GetWindowClass(GetTopLevelWindow(GetFocus())), "SWT_Window0", false) == 0)
   return GetLongestOfObjectNameOrValue()
endIf
return GetObjectValue()
EndFunction

Void Function SayFocusedObject ()
var
	int bRestore
if GetActiveCursor() != CURSOR_PC then
	let bRestore = TRUE
	SaveCursor ()
	PCCursor ()
endIf
if sayFocusedObjectViewSliders () then return endIf
if (!TreeWithColumns()) then
	SayObjectTypeAndText ()
else
	;this allows alt+tabbing to speak treeview item in eclipse multi column treeview
	var
		string description,
		string value,
		string position,
		handle currentWindow
	Let value = SmartGetTreeViewObjectValue()
	let description = GetObjectDescription(SOURCE_CACHED_DATA, 0)
	if (StringLength(description) && StringContains(value, description) == 0)
		let value = value + cscSpace + description
	EndIf
	let currentWindow = GetFocus ( )
	let position = PositionInGroup()
	SayControlExWithMarkup (currentWindow, GetWindowName(currentWindow), GetWindowType (currentWindow), "", "", "", value, position, "")
EndIf
if bRestore then
	RestoreCursor()
endIf
NotifyIfContextHelp()
EndFunction

int function IsFocusObjectDescendantOfmenu()
var
	int i,
	int count,
	int type
count = GetAncestorCount()
for i = 1 to count
	type = GetObjectSubtypecode(false,i)
	if type == wt_menu
	|| type == wt_ContextMenu
		return true
	endIf
endFor
return false
EndFunction

int function MenuInactiveProcessed(int mode, int PrevMenuMode)
var
	int nonVirtualRibbonState,
	int ticks,
	int elapsedTicks,
	int usingvirtualRibbons
If mode != MENU_INACTIVE then
	return false
EndIf
if !mode
	;If not using virtual ribbons,
	;MenuModeEvent may fire twice if leaving a menu item on the lower ribbon and returning to the document.
	;The current and prev menu mode may both be 0 when leaving the lower ribbons.
	;The event fires once when leaving the lower ribbon where the lower ribbon item was not a menu item,
	;but fires twice when leaving the lower ribbon where the item was a menu item.
	;If using virtual ribbons and leaving the upper ribbon the event fires twice,
	;on the first firing the prev menu mode is menu bar active, but on the second firing it is 0.
	;so we use a test for the elapsed ticks to suppress announcement of the second instance of the event
	;when virtual ribbons are not active and when simultaneously leaving both a menu item and the lower ribbon,
	;or when virtual ribbons are active and leaving the virtual upper ribbon.
	Ticks = GetTickCount()
	elapsedTicks = ticks-MenuInactiveTickTime
	MenuInactiveTickTime = ticks
	usingVirtualRibbons = getJCFOption(OPT_VIRTUAL_RIBBON_SUPPORT)
	if !PrevMenuMode
		if (!usingVirtualRibbons && elapsedTicks <= MenuInactiveTickToleranceForNonVirtual)
		|| (usingVirtualRibbons && elapsedTicks <= MenuInactiveTickToleranceForVirtual)
			return true
		endIf
	endIf
endIf
nonVirtualRibbonState = GetNonVirtualRibbonState()
if nonVirtualRibbonState  == LowerRibbon_Active
	;Don't indicate menu active or inactive when moving to or from a menu item on the lower ribbon:
	return true
endIf
if GetRunningFSProducts() & product_JAWS then
	If PrevMenuMode == MENUBAR_ACTIVE then
		SayFormattedMessage (OT_CONTROL_TYPE, cmsg48_L, cmsg48_S) ;"leaving menu bar"
	else
		if IsFocusObjectDescendantOfmenu()
			;The menus are not really inactive:
			return true
		endIf
		SayFormattedMessage (OT_CONTROL_TYPE, cmsg48_S) ;"Leaving menus"
	endIf
EndIf
return true
EndFunction

int function ContextMenuProcessed(handle hWnd)
var
	int iSubtype,
	string sOwner,
	int injectDownArrow = false
if GetObjectSubTypeCode() != WT_CONTEXTMENU
|| GetWindowSubTypeCode(hwnd) == WT_STARTMENU then
	return false
EndIf
let sOwner = GetWindowOwner(hWnd)
if sOwner then
	let sOwner = StringSegment(sOwner,cScDoubleBackSlash,StringSegmentCount(sOwner,cScDoubleBackSlash))
	if sOwner == cscAppJFWExecutable then
		let sOwner = cscAppJFWFriendly
	ElIf sOwner == cscAppMagicExecutable then
		let sOwner = cscAppMagicFriendly
	ElIf sOwner == cscMAGUtilExecutable then
		if gbAnnounceVoiceProfilesContextMenu then
			let sOwner = cmsgVoiceProfilesContextMenuName
		else
			let sOwner = cmsgMagicContextMenuName
		EndIf
	else
		let sOwner = cscNull
	EndIf
EndIf
IndicateControlType(WT_CONTEXTMENU,sOwner,cscSpace)
let gbAnnounceVoiceProfilesContextMenu = false
let iSubtype = GetObjectSubTypeCode()
if !(iSubtype == wt_Menu) then
	if ! giFN_Helper && !IsZoomTextRunning() then
		injectDownArrow = true
	endIf
EndIf
if GlobalMenuMode == MENUBAR_ACTIVE && GlobalPrevMenuMode == MENU_ACTIVE Then
	injectDownArrow = false
EndIf
var string sClass = GetObjectClassName ()
if sClass == Windows11SysTrayIconsClass
	injectDownArrow = false
	UIARefresh(false)
EndIf
if sClass == "Microsoft.UI.Content.DesktopChildSiteBridge"
	injectDownArrow = false
endIf
if injectDownArrow Then
	TypeKey (cksDownArrow); Select first item in menus
EndIf
MenuModeHook ()
return true
EndFunction

int function MenuBarActiveProcessed(int mode)
If mode != MENUBAR_ACTIVE then
	return false
EndIf
if RibbonsActive() then
	if IsVirtualRibbonActive() then
		Say(cmsgVirtualRibbonsActive,OT_CONTROL_TYPE)
	else
		IndicateControlType(wt_UpperRibbon)
		IndicateControlState (wt_UpperRibbon, GetObjectStateCode (true, 1))
	EndIf
else
	IndicateControlType(WT_MENUBAR)
EndIf
MenuModeHook ()
return true
EndFunction

int function MenuActiveProcessed(int mode, handle hWnd)
If mode != MENU_ACTIVE then
	return false
EndIf
If GetWindowSubTypeCode(hWnd) == WT_STARTMENU then
	IndicateControlType(WT_STARTMENU,cscSpace,cscSpace)
	if !(GetCharacterAttributes() & ATTRIB_HIGHLIGHT) then
		TypeKey(cksDownArrow)
	EndIf
	BrailleMenuModeHelper ()
	Let GISuppressStartMenu = TRUE;
elif getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_HEADERBAR then
	;Vista: any list view, tab to header bar controls, then use DownArrow:
	Let GlobalMenuMode = 2;'force' menus to show as active for Braille:
	IndicateControlType (WT_MENU,cscSpace,cscSpace)
	TypeKey (cksDownArrow)
else
	if RibbonsActive() then
		;only announce the lower ribbons when entering them,
		;not when navigating in and out of groups:
		if GlobalPrevMenuMode != GlobalMenuMode then
			IndicateControlType(WT_LowerRibbon,cscSpace,cscSpace)
		EndIf
	else
		if IsFocusObjectDescendantOfmenu()
			;The menus are already active:
			return true
		endIf
		IndicateControlType(WT_MENU,cscSpace,cscSpace)
	EndIf
endIf
MenuModeHook ()
return true
EndFunction

void function DoExtraMenuProcessing()
var
	handle FocusWindow,
	handle RealWindow,
	handle AppWindow,
	string RealWindowName
let FocusWindow = GetFocus()
If FocusWindow == GlobalPrevFocus then
	let RealWindow = GetRealWindow(FocusWindow)
	let RealWindowName = GetWindowName (RealWindow)
	let AppWindow = GetAppMainWindow(FocusWindow)
	if RealWindow != FocusWindow then
		SayWindowTypeAndText(RealWindow)
	endIf
	SayWindowTypeAndText(FocusWindow)
endIf
MenuModeHook()
EndFunction

Void Function MenuModeEvent (handle WinHandle, int mode)
;The Mode parameter indicates whether the menuBar has become active, a
;Menu  has become active, or the menus are going away.  These are
;represented by the constants MENUBAR_ACTIVE, MENU_ACTIVE, and
;MENU_INACTIVE.
Var
	handle FocusWindow,
	int PrevMenuMode,
	int NCurrentMSAAMode
let g_PrevFocusedObjectID = FocusWindow
let g_JavaIgnoreNextActiveItemChange = 0
let PrevMenuMode = GlobalMenuMode
let GlobalPrevMenuMode = PrevMenuMode
let GlobalMenuMode=mode
let NCurrentMSAAMode=GetJCFOption (	OPT_MSAA_MODE)
if MenuInactiveProcessed(mode,PrevMenuMode) then
	return
EndIf
if ContextMenuProcessed(WinHandle) then
	return
EndIf
if MenuBarActiveProcessed(mode) then
	return
EndIf
if MenuActiveProcessed(mode,WinHandle) then
	return
EndIf
DoExtraMenuProcessing()
; processing for minimized icons when exiting context menu after closing an app, system tray or application menu:
if GetDefaultJCFOption (OPT_FOCUS_LOSS_ANNOUNCE) then
	UnscheduleFunction (giFN_SpeakInvisibleWindow)
	Let giFN_SpeakInvisibleWindow = ScheduleFunction ("SpeakInvisibleWindow", gi_FOCUS_LOSS_TIMER)
endIf
EndFunction

void function MagMenuModeHook()
var
	handle hWnd
if GetRunningFSProducts() & product_MAGic
&& GlobalMenuMode == 2 then
	let hwnd = getFocus()
	If GetWindowSubtypeCode(hWnd) == WT_EDIT then
		MagTrackCustomMenus(hWnd)
	EndIf
EndIf
EndFunction

Void Function MenuModeHook ()
; This Script can be added to application Script files to add onto menu mode.
magMenuModeHook()
ResetVirtualHook ()
EndFunction

;**/3 start of cut/paste Scripts
Script Undo()
TypeKey (cksUndo)
SayFormattedMessage (OT_JAWS_MESSAGE, cmsg50_L)
EndScript

int function ClipboardUpdateInConsoleWindow(int nMethod)
var
	string theClass
let TheClass = GetWindowClass (GlobalFocusWindow)
if !UserBufferIsActive()
&& (theClass == cwcTTY
|| theClass == cwcTTYGrab
|| TheClass == cwc_ConsoleWindow) then
	;Don't add Overwrite Clipboard code here, because
	;Clipboard isnot in use with control c or control x whenin a console window.
	SayCurrentScriptKeyLabel ()
	if nMethod == CLIPBOARD_CUT then
		TypeKey (cksCut)
	else
		CopySelectionToClipboard ()
	endIf
	Return true
EndIf
return false
EndFunction

int function IsNoSelectionForClipboard()
var
	handle hWnd,
	string sClass,
	int iWintype,
	int iObjtype,
	int mode
hWnd = GetFocus()
sClass = GetWindowClass(hWnd)
iWintype = GetWindowSubtypeCode(hWnd)
iObjtype = GetObjectSubtypeCode()
;for some treeviews and lists,
;selected text and highlight cannot be used to determine if there is a selected item:
if iObjType == wt_listBoxItem
&& sClass ==cscListviewClass
	if lvGetItemState(hWnd,lvGetFocusItem(hWnd)) & state_system_selected
		return false
	endIf
elif iObjType == wt_treeViewItem
&& sClass ==cwc_SysTreeView32
	if GetControlAttributes()&CTRL_SELECTED
		return false
	else
		;may need to switch MSAA mode:
		mode = GetJCFOption(opt_msaa_mode)
		SetJCFOption(opt_msaa_mode,2)
		if GetControlAttributes()&CTRL_SELECTED
			SetJCFOption(opt_msaa_mode,mode)
			return false
		endIf
		SetJCFOption(opt_msaa_mode,mode)
	endIf
endIf
return (!GetSelectedText ()
	&& !(GetCharacterAttributes () & ATTRIB_HIGHLIGHT))
	&& (iWinType == wt_edit
	|| iWinType == wt_MultiLine_Edit
	|| iWinType == wt_ReadOnlyEdit
	|| iWinType == wt_PasswordEdit
	|| iWinType == wt_Upload_Edit
	|| iWinType == wt_EditCombo
	|| iWinType == wt_ListView
	|| iWinType == wt_ListViewItem
	|| iWinType == wt_TreeView
	|| iWinType == wt_TreeViewItem
	|| iWinType == wt_Static
	|| (!iWinType && sClass==cwcIEServer))
EndFunction

int function MayOnlyCopyToClipboard()
var
	int iSubtype
let iSubtype = GetWindowSubtypecode(GlobalFocusWindow)
if !iSubtype then
	let iSubtype = GetObjectSubtypeCode()
EndIf
return IsVirtualPcCursor()
	|| iSubtype == wt_ReadOnlyEdit
EndFunction

int function WillOverwriteClipboard()
var
	int iShouldOverwrite,
	int bUserBuffer
if gbAppendedToClipboard then
	let bUserBuffer = UserBufferIsActive()
	If bUserBuffer then
		UserBufferDeactivate ()
	EndIf
	let iShouldOverwrite = ExMessageBox (cmsgOverwriteClipboard,cmsgOverwriteClipboardName,MB_YESNO|MB_DEFBUTTON1|MB_ICONASTERISK)
	If bUserBuffer then
		UserBufferActivate ()
	EndIf
	if iShouldOverwrite != IDYES then
		Return false
	else
		let gbAppendedToClipboard = FALSE
	endIf
endIf
return true
EndFunction

void function updateClipboard(int nMethod)
if !(GetRunningFSProducts() & product_JAWS|product_MAGic) then
	return
endIf
;the following If-ElIf-EnIf block must test the conditions in the order listed:
if ClipboardUpdateInConsoleWindow(nMethod) then
	return
elif IsNoSelectionForClipboard() then
	SayMessage (OT_ERROR, cmsgNothingSelected)
	return
elif MayOnlyCopyToClipboard()
&& nMethod == CLIPBOARD_CUT then
	;just pass the key through
	SayCurrentScriptKeyLabel ()
	TypeKey (cksCut)
	return
elif !WillOverwriteClipboard() then
	return
EndIf
if nMethod == CLIPBOARD_CUT then
	let ClipboardTextChanged = Clipboard_Cut
	TypeKey (cksCut)
else
	let ClipboardTextChanged = Clipboard_Copied
	CopySelectionToClipboard ()
endIf
endFunction

Script CutToClipboard()
var
	int iRunningFSProducts
let iRunningFSProducts = GetRunningFSProducts()
if iRunningFSProducts == product_MAGic then
	SayCurrentScriptKeyLabel ()
	TypeKey(cksCut)
	return
endIf
updateClipboard(CLIPBOARD_CUT)
EndScript

Script CopySelectedTextToClipboard ()
var
	int iRunningFSProducts
let iRunningFSProducts = GetRunningFSProducts()
if iRunningFSProducts == product_MAGic
; virtual viewer was not allowing a copy.
&& ! UserBufferIsActive ()then
	SayCurrentScriptKeyLabel ()
	; some virtual cursor windows like Firefox don't automatically copy the way you'd expect,
	; so copy from JAWS function instead of the keyboard:
	if IsVirtualPcCursor () then
		CopySelectionToClipboard ()
	else
		TypeKey(cksCopy)
	endIf
	return
EndIf
updateClipboard(CLIPBOARD_COPIED)
EndScript

int function InTextWindow()
var
	int iWndSubtype,
	string sWndClass,
	int iObjSubtype
let iWndSubtype = GetWindowSubtypeCode(GlobalFocusWindow)
let sWndClass = GetWindowClass(GlobalFocusWindow)
let iObjSubtype = GetObjectSubtypeCode()
return
	!GlobalMenuMode
	&& (UserBufferIsActive()
		|| CaretVisible()
		|| iWndSubtype == wt_edit
		|| iWndSubtype == wt_multiline_edit
		|| iWndSubtype == wt_ReadOnlyEdit
		|| iWndSubtype == wt_static
		|| iObjSubtype == wt_edit
		|| iObjSubtype == wt_multiline_edit
		|| iObjSubtype == wt_ReadOnlyEdit
		|| iObjSubtype == wt_static
		|| sWndClass == cwcIEServer)
EndFunction

Script AppendSelectedTextToClipboard ()
var
	string sSelectedText,
	string sClipboardText,
	int bAlreadyAppended,
	int bResult
if !InTextWindow() then
	SayMessage(ot_error,cmsgNotInATextWindow)
	return
EndIf
let sSelectedText = GetSelectedText ()
let sClipboardText=GetTextFromClipboard()
let bResult =FALSE
let bAlreadyAppended = FALSE
if sSelectedText
|| GetCharacterAttributes() & ATTRIB_HIGHLIGHT then
	CopySelectionToClipboard()
	;We delay so that the Windows clipboard can propogate the event notification to other apps
	Delay(1)
	let sSelectedText = GetTextFromClipboard() ; get plain text
	let gbAppendedToClipboard = TRUE
	let ClipboardTextChanged = CLIPBOARD_APPENDED
	if sClipboardText then
		let bAlreadyAppended = WasTextAlreadyAppended ( sClipboardText, sSelectedText )
		if bAlreadyAppended
		|| !sSelectedText then
			CopyToClipboard(sClipboardText) ;replace original text
			let bResult = TRUE
		else
			CopyToClipboard (sClipboardText) ;replace original text to make sure it's in plain text format
			Delay(1)
			let bResult=AppendToClipboard( sSelectedText, TRUE) ; put selection at the end
		endIf
	else
		;Clipboard is empty
		CopyToClipboard (sClipboardText) ;replace original text to make sure it's in plain text format
		let bResult = TRUE
		;This copy will not fire the ClipboardChangedEvent, so we call it ourselves:
		ClipboardChangedEvent()
	endIf
else
	let ClipboardTextChanged = false
	SayMessage (OT_ERROR, cmsgNothingSelected)
	return
endIf
if !bResult then
	let ClipboardTextChanged = false
	let gbAppendedToClipboard = false
endIf
EndScript

Script PasteFromClipboard()
TypeKey (cksPaste)
if GetRunningFSProducts() == product_MAGic then
	SayCurrentScriptKeyLabel()
else
SayFormattedMessage (OT_JAWS_MESSAGE, cmsg53_L, cmsg53_S)
endIf
EndScript

; **/4 End of cut and paste scripts

Script RefreshScreen ()
;Used to refresh the screen
ReloadSystemColors()
Refresh ()
MSAARefresh ();So Refresh accurately reloads all cached data
BrailleRefresh();All Braille segments, allows BrailleCallbackObjectIdentify and helpers to use new MSAA data if necessary.
ResetVoiceSettings ()
EscapeFromApplet ()
if GetRunningFSProducts() & product_MAGic then
	MagSendKeyEvent (KI_REFRESH_SCREEN)
endIf
UnmuteJawsSoundcard()
if IsVirtualPCCursor () then
	SayFormattedMessage (ot_JAWS_message, cmsg290_L)
else
	;cmsg54_L = "Screen Refreshed"
	SayFormattedMessage (ot_JAWS_message, cmsg54_L, cmsg54_S)
endIf
EndScript

Int Function IsPointInWindow (handle hwnd, int x, int y)
var
	int top,
	int left,
	int bottom,
	int right
let top = GetWindowTop (hwnd)
let left = GetWindowLeft (hwnd)
let bottom = GetWindowBottom (hwnd)
let right = GetWindowRight (hwnd)
if (left <= x && x <= right && top <= y && y <= bottom) then
	return true
else
	return false
endIf
EndFunction

int Function ReadContextLine ()
var
	int iRestriction,
	handle appWindow,
	handle realWindow,
	handle focusedWindow,
	int iCounter,
	string sMessage
let focusedWindow = GetFocus ()
let RealWindow = GetRealWindow (focusedWindow)
let appWindow = GetAppMainWindow (focusedWindow)
InvisibleCursor ()
; try to find the highlighted word starting at the top of the window
MoveToWindow (appWindow)
let iCounter = 0;
while (FindNextAttribute (attrib_highlight) &&
(iCounter < 20))
	let iCounter = iCounter + 1
	if (!IsPointInWindow (realWindow, getCursorCol (), getCursorRow ()) &&
	(GetCurrentWindow () != appWindow)) then
		RouteJAWSToInvisible ()
		JAWSCursor ()
		SayLine ()
;		RestoreCursor ()
		;above "restore" moves the invisible cursor away from the context
		PCCursor ()
;		to read in context turn on the JAWS cursor
		return TRUE; so we don't try to drag a dialog
	endIf
EndWhile
;start of 2nd block, search from bottom
MoveTo (GetWindowRight (appWindow) - 3, GetWindowBottom (appWindow) - 3)
;above move may not go to right spot every time, cause search to fail?
let iCounter = 0;
while (FindPriorAttribute (attrib_highlight) && (iCounter < 10))
	let iCounter = iCounter + 1
	if (!IsPointInWindow (realWindow, getCursorCol (), getCursorRow ()) && (GetCurrentWindow () != appWindow)) then
		RouteJAWSToInvisible ()
		JAWSCursor ()
		SayLine () ;found it
		PCCursor ()
		return TRUE; So we won't drag the dialog
	endIf
EndWhile
;start of block 3, search from top, different criteria?
Let iRestriction = GetRestriction ()
SetRestriction (RESTRICTNONE)
JAWSPageUp () ;start at top of app
Let iCounter = 0;
while (FindNextAttribute (attrib_highlight) && (iCounter < 10))
	Let iCounter = iCounter+1
	If GetCurrentWindow () != FocusedWindow &&
	GetCurrentWindow () != RealWindow &&
	GetCurrentWindow () != AppWindow &&
	GetRealWindow(GetCurrentWindow ()) != RealWindow then
		RouteJAWSToInvisible ()
		JAWSCursor ()
		SayLine () ;found it
		PCCursor ()
		Return TRUE
	EndIf
EndWhile
;start of block 4, search from bottom
InvisibleCursor ()
RouteInvisibleToPc ()
SetRestriction (RestrictAppWindow)
JAWSPageDown () ;go to bottom of spell check window
SetRestriction (RestrictNone)
NextLine () ;go beyond spell check window
NextLine () ;go beyond spell check window 2 lines
SetRestriction (RestrictappWindow)
JAWSPageDown() ;go to bottom of app window
JAWSEnd() ;go to bottom right corner of app window
Let iCounter = 0;
while (FindPriorAttribute (attrib_highlight) && (iCounter < 10))
	Let iCounter = iCounter+1
	If GetCurrentWindow () != FocusedWindow &&
	GetCurrentWindow () != RealWindow &&
	GetRealWindow (GetCurrentWindow ()) != RealWindow && ;added this, T.H.
	GetCurrentWindow () != AppWindow then
		RouteJAWSToInvisible ()
		JAWSCursor ()
		SayLine ()
		PcCursor ()
		Return TRUE;
	EndIf
EndWhile
PcCursor ()
Return FALSE;
EndFunction

void function DragDialogWindow ()
var
	int DragFromX,
	int DragFromY,
	int iJAWSCol,
	int iJAWSRow,
	string DragObject,
	int x,
	int y,
	String strObject
JAWSCursor ()
Let iJAWSCol = GetCursorCol ();For JAWSCursor
Let iJAWSRow = GetCursorRow ()
MoveToWindow (GetRealWindow (GetFocus ()))
let DragFromX = getCursorCol ()
let DragFromY = getCursorRow () ;save position of spell dialog
let DragObject = GetWord ()
;now move to the top of the app
MoveToWindow (GetAppMainWindow (GetFocus ()))
let x = getCursorCol ()
let y = getCursorRow () ;save position to move to
;don't allow the dialog to be dragged off-screen:
if x>DragFromX  ||Y>DragFromY then
	return
EndIf
; make sure that the left mouse button is unlocked
If IsLeftButtonDown () then
	LeftMouseButtonLock ()
	pause ()
endIf
MoveTo (DragFromX, DragFromY) ;go back to spell dialog
Pause ()
let strObject = GetWord()
LeftMouseButtonLock () ; lock it down
pause ()
MoveTo (x,y) ;drag it
Pause ()
pause ()
pause ()
;cmsg172_L = "dragging "
;let sMessage = FormatString (cmsg172_L, strObject, GetWord ())
;SayFormattedMessage (ot_JAWS_message, sMessage); dragging x to y
LeftMouseButtonLock () ;unlock
;Put the JAWSCursor back where it was:
MoveTo (iJAWSCol, iJAWSRow)
PCCursor ()
EndFunction

int function IsReadWordInContextValid()
;Attempts to determine whether we are in a dialog where the ReadWordInContext script is valid.
;Spellchecker, Find, Replace and the like are good candidates for valid dialogs.
var
	handle hDlg,
	string sDlgName,
	string sDlgWndText
if !DialogActive() then
	return false
EndIf
let hDlg = GetRealWindow(GetFocus())
let sDlgName = GetWindowName(hDlg)
let sDlgWndText = GetWindowTextEx(hDlg,0,0)
return StringContains(sDlgName,cscSpell)
	|| StringContains(sDlgName,cscFind)
	|| StringContains(sDlgName,cscReplace)
	|| StringContains(sDlgWndText,cscSpell)
	|| StringContains(sDlgWndText,cscFind)
	|| StringContains(sDlgWndText,cscReplace)
EndFunction

Script ReadWordInContext ()
; read word in context, for spell check, find, replace, etc.
If !IsReadWordInContextValid() then
	SayFormattedMessage (ot_error, cmsgwordInContextError_l, cmsgWordInContextError_s) ; "Word in context not found "
	Return;Not available outside of dialog windows.
EndIf
If ReadContextLine () then
	Return;Found
EndIf
;now the word has not been found, move the dialog
PcCursor ()
DragDialogWindow ()
Pause()
If ! ReadContextLine () then
	SayFormattedMessage (ot_error, cmsg216_L, cmsg216_S) ; "Word in context not found "
EndIf
EndScript

int Function RedisplayPrevField(String sPrevVWName)
;Scripts can override this function to redisplay a virtual buffer that was active prior to the display of a help buffer.
;This function is called if a user buffer is active and its associated window name (returned by
;UserBufferWindowName) is null.  It is called from CloseButton after the
;current user buffer has been deactivated and immediately before UpALevel exits.
;If it does not wish to redisplay a field it should call the default version of RedisplayPrevField before returning.
;Parameters:
;String/sPrevVWName The value of UserBufferPrevWindowName() prior to the call to UserBufferDeactivate().
return false
EndFunction

void function SayFocusAfterExitUserBuffer()
if GetWindowSubTypeCode (GetCurrentWindow ()) != WT_TASKBAR
&& !(GetCharacterAttributes () & ATTRIB_HIGHLIGHT) then
	SayLine ()
EndIf
EndFunction

int function UserBufferVirtualWindowDeactivate(string vwName)
;Called by ExitUserBuffer,
;to deactivate user buffers with virtual window names.
;Return false if deactivation is not allowed and therefore did not happen,
;otherwise deactivate and return true to notify the ExitUserBuffer function that deactivation occurred and it may proceed.
;The string parameter is the name of the virtual window which is asking for deactivation.
UserBufferDeactivate()
return true
EndFunction

int function ExitUserBuffer()
var
	int UserBufferIsActive = UserBufferIsActive(),
	int UserBufferIsActiveResultsViewer = UserBufferIsActiveResultsViewer()
If !UserBufferIsActive
&& !UserBufferIsActiveResultsViewer
	return false
EndIf
If UserBufferIsActive
	var String sPrevVWName = UserBufferPrevWindowName()
	if !UserBufferWindowName()
		UserBufferDeactivate()
		if sPrevVWName
			Delay(2)
			RedisplayPrevField(sPrevVWName)
		endIf
	else ;The user buffer has a name:
		if !UserBufferVirtualWindowDeactivate(sPrevVWName)
			;Deactivation was not allowed,
			;probably because the focus control is portrayed as  virtual text.
			;Return false to allow Escape key to work.
			return false
		endIf
	endIf
ElIf UserBufferIsActiveResultsViewer
	UserBufferDeactivateResultsViewer()
EndIf
var
	handle hwnd,
	int TheTypeCode,
	string sMessage
if giRestoreFormsModeAfterVirtualizeCPS
	TurnOnFormsMode()
	giRestoreFormsModeAfterVirtualizeCPS=FALSE;
endIf
if gbDocumentLoadAppAlertShowing then
	gbDocumentLoadAppAlertShowing = false
	DoDefaultDocumentLoadActions()
	return true
EndIf
Delay(4)
If IsTouchNavigationModeActive()
|| IsObjectNavigationSuspended()
	;Object navigation resumes when this user buffer window is gone,
	;so do not speak the focus item.
	;Both current and suspended states are tested,
	;because the resumption of object navigation may be immediate or may be scheduled.
	return
endIf
SayFocusAfterExitUserBuffer()
; don't want to pass the Esc key on to the app.
return true
EndFunction

int function ExitFormsModeHelper()
var
handle hAutoSuggest
if ! getJcfOption (OPT_VIRTUAL_PC_CURSOR)
|| !IsFormsModeActive() || !IsPCCursor () then
	return FALSE
EndIf
; If the autosuggest dropdown is visible, then return FALSE
; This will cause an escape to be sent through to the application and close the dropdown.
let hAutoSuggest=FindWindow (0, cwc_AutoSuggestDropdown, "")
if (hAutoSuggest && IsWindowVisible(hAutoSuggest)) then
return FALSE
EndIf
;return FALSE if menus are active so that the menu is exited.
;This is possible in ARIA enabled menus.
if GetMenuMode() then
	return FALSE
endIf
if IsComboExpanded() then
	DoCloseListBoxKeyStroke()
EndIf
TurnOffFormsMode()
if BrailleInUse () then
	RouteBrailleToPC ()
	BrailleRefresh ()
endIf
;it doesn't make sense to have JAWS saying 'Virtual PC Cursor' if inside a dialog,
;such as New Folder or Rename Folder under Organize Favorites in Internet Explorer.
if ! dialogActive () then
	SayFormattedMessage (ot_status, cMSG288_L, cMSG288_S) ; virtual pc cursor
endIf
return TRUE
endFunction

Script UpALevel()
SayCurrentScriptKeyLabel ()
if ExitUserBuffer() then
	return
EndIf
if IsMetroApp() then
	EscapeKey();
	return;
endIf
if ( IsFormsModeActive()
&& ! IsInsideARIAApplication() ) then
if ExitFormsModeHelper() then
	return
endIf
EndIf
EscapeKey();
EndScript

script SayDefaultButton ()
var
	string DefaultButtonName,
	string sMessage
if (DialogActive ()) then
	let DefaultButtonName = GetDefaultButtonName ()
	if (DefaultButtonName != cscNull) then
		let sMessage =   FormatString (cmsg55_L, DefaultButtonName)
		SayFormattedMessage (ot_user_requested_information, sMessage, DefaultButtonName)
	else
		SayFormattedMessage (ot_error, cmsg192_L, cmsg192_S) ; "Can not determine default button in this dialog box "
	endIf
else
	SayFormattedMessage (ot_error, cmsg56_L, cmsg56_S) ;"not in a dialog box"
endIf
EndScript

;**/5  MOUSE FUNCTIONS

script MouseLeft()
;MouseLeft Script
if ! IsJAWSCursor () then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	return
endIf
MouseLeft (GlobalMousePixel)
SayFormattedMessage (ot_status, cmsg57_L, cmsg57_S) ;"Mouse Left"
EndScript

script MouseRight()
;MouseRight Script
if ! IsJAWSCursor () then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	return
endIf
MouseRight (GlobalMousePixel)
SayFormattedMessage (ot_status, cmsg58_L, cmsg58_S) ;"Mouse Right"
EndScript

script MouseDown()
;MouseDown Script
if ! IsJAWSCursor () then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	return
endIf
MouseDown (GlobalMousePixel)
SayFormattedMessage (ot_status, cmsg59_L, cmsg59_S) ;"Mouse Down"
EndScript

script MouseUp()
;MouseUp Script
if ! IsJAWSCursor () then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	return
endIf
MouseUp (GlobalMousePixel)
SayFormattedMessage (ot_status, cmsg60_L, cmsg60_S) ;"Mouse Up"
EndScript

script ControlLeftMouseClick()
;Control Left Mouse Click
ControlLeftMouseClick ()
SayFormattedMessage (ot_status, cmsg61_L) ;"Control Mouse Click"
EndScript

script ShiftLeftMouseClick()
;Shift Left Mouse Click
ShiftLeftMouseClick ()
SayFormattedMessage (ot_status, cmsg62_L) ;"Shift Mouse Click"
EndScript

script AltLeftMouseClick()
AltLeftMouseClick ()
SayFormattedMessage (ot_status, cmsg63_L) ;"Alt Mouse Click"
EndScript
; **/6 End of Mouse Functions

void function DoJAWSFind(optional int bReverse)
var
	int bIsVirtualPCCursor
let InJAWSFind = TRUE ;flag that can be observed by other scripts
;We need to check for the virtual PC cursor before we put up the
; Find dialog, because if we check after the dialog is closed, the focus may
; not have returned to the browser window and we'd get the wrong answer
let bIsVirtualPCCursor = IsVirtualPCCursor()
if JAWSFind(bReverse)  then
	Delay(2) ;make sure the screen has redrawn
	if (bIsVirtualPCCursor) then
		SayLine(2)
	else
		SayWord()
	endIf
endIf
let InJAWSFind = FALSE
let JAWSFindComplete=GetTickCount()
EndFunction

Script JAWSFind ()
DoJAWSFind(false)
EndScript

Script MAGicFind ()
DoJAWSFind(false)
EndScript

void function DoJAWSFindNext()
var
	int found
if (SayAllInProgress()) then
	; Just position to the location of the next occurance of the	search string
	JAWSFindNext ()
	return
EndIf
if IsFormsModeActive() Then
	TurnOffFormsMode()
EndIf
if !GetJAWSFindText() then
	DoJAWSFind(false)
	return
EndIf
let found = JAWSFindNext ()
if (found==FALSE) then
	SayFormattedMessage (ot_error, cmsg64_L, cmsg64_S)
else
	;SayFormattedMessage (ot_JAWS_message, cmsg65_L)
	SayLine(2)
endIf  ; ["Found", "search string NOT found"]
EndFunction

Script JAWSFindNext ()
DoJAWSFindNext()
EndScript

Script MAGicFindNext ()
DoJAWSFindNext()
EndScript

void function DoJAWSFindPrior()
var
	int found
if (SayAllInProgress()) then
	; Just position to the location of the next occurance of the	search string
	JAWSFindNext (TRUE)
	return
EndIf
if IsFormsModeActive() Then
	TurnOffFormsMode()
EndIf
if !GetJAWSFindText() then
	;Perform a JAWSFind with the search direction set to reverse by default:
	DoJAWSFind(true)
	return
EndIf
let found = JAWSFindNext (TRUE)
if (found==FALSE) then
	SayFormattedMessage (ot_error, cmsg64_L, cmsg64_S)
else
	;SayFormattedMessage (ot_JAWS_message, cmsg65_L)
	SayLine(2)
endIf  ; ["Found", "search string NOT found"]
EndFunction

Script JAWSFindPrior()
DoJAWSFindPrior()
EndScript

Script MAGicFindPrior()
DoJAWSFindPrior()
EndScript

Script GraphicsMode ()
var
	int GraphicsMode
let GraphicsMode = GetJcfOption (OPT_GRAPHICS_MODE)
If (GraphicsMode == 0) then
	If (SetJcfOption (OPT_GRAPHICS_MODE, 1) == WAS_SUCCESSFUL)  then
		SayFormattedMessage (ot_status, cmsg76_L, cmsg76_S) ;"Active Graphics Mode"
	Else
		SayFormattedMessage (ot_error, cmsg77_L) ;"Active Graphics Mode could not be set"
	endIf ; WAS_SUCCESSFUL
Else
	If (SetJcfOption (OPT_GRAPHICS_MODE, 0) == WAS_SUCCESSFUL)  then
		SayFormattedMessage (ot_status, cmsg78_L, cmsg78_S) ;"Standard Graphics Mode"
	Else
		SayFormattedMessage (ot_error, cmsg79_L) ;"Standard Graphics Mode could not be set"
	endIf ; WAS_SUCCESSFUL
endIf  ; GraphicsMode == 0
EndScript

Script SayColor()
var
int bSpeakRGB,
int textColor,
int backgroundColor,
string textColorName,
string backgroundColorName,
string sMessage

if IsSameScript() then
	let bSpeakRGB=TRUE
else
	let bSpeakRGB=FALSE
endIf
let textColor=GetColorText()
let backgroundColor=GetColorBackground()
if bSpeakRGB then
	let textColorName=ColorToRGBString(textColor)
	let backgroundColorName=ColorToRGBString(backgroundColor)
else
	let textColorName=StringMixedCaseToMultiword(GetColorName(textColor))
let backgroundColorName=StringMixedCaseToMultiword(GetColorName(backgroundColor))
endIf
let sMessage=FormatString(cmsgColorInfo,textColorName,backgroundColorName)
SayMessage(OT_USER_REQUESTED_INFORMATION,sMessage)
EndScript

Script MinimizeAllApps ()
MinimizeAllApps ()
SayFormattedMessage (ot_JAWS_message, cmsg80_L, cmsgSilent) ;"minimize all apps"
EndScript

Script MenuBar ()
ActivateMenuBar ()
Refresh ()
EndScript

Script StartMenu ()
; Note, this script is not called if defined in [Quick Navigation Keys] with Legacy keyboard enabled
If UserBufferIsActive () then
	UserBufferDeactivate ()
	ActivateStartMenu ()
	return
EndIf
if GetCurrentScriptKeyName () != cksWindows
	ActivateStartMenu ()
endIf
EndScript

; Keep JAWS from saying "space" in an extended select list box
Script SelectCurrentItem ()
var
	int TheTypeCode
SayCurrentScriptKeyLabel ()
TypeKey(cksSelectCurrentItem)
let TheTypeCode = GetObjectSubtypeCode()
if (TheTypeCode ==  WT_EXTENDEDSELECT_LISTBOX) then
	SayLine()
endIf
EndScript

Int Function IsSelectScriptDlg()
var
	HANDLE hExecute
If InHjDialog () then
	If (GetControlID(GetFirstChild(GetRealWindow(GetFocus()))) == ID_SELECT_DLG_LIST) then
	;cwn10 = "JAWS"
	;If (GetWindowName (GetAppMainWindow (GetCurrentWindow ())) == cwn10) then
		let hExecute = FindDescendantWindow (GetParent (GetCurrentWindow ()), ID_SELECT_DLG_EXECUTE)
		return (IsWindowVisible (hExecute))
	endIf
endIf
return FALSE
EndFunction

Int Function IsSelectItemDlg ()
var
	HANDLE hExecute
If (GetControlID(GetFirstChild(GetRealWindow(GetFocus()))) == ID_SELECT_DLG_LIST) then
	;cwn10 = "JAWS"
	If (GetWindowName (GetAppMainWindow (GetCurrentWindow ())) == cwn10) then
		let hExecute = FindDescendantWindow (GetParent (GetCurrentWindow ()), ID_SELECT_DLG_EXECUTE)
		return !(IsWindowVisible (hExecute))
	endIf
endIf
return FALSE
EndFunction

Void Function AddHotKeyLinks ()
VAR
	String strContextHelpMsg
let strContextHelpMsg = ""
;This is just intended to make adding a link to HotKeyHelp and WindowKeysHelp simpler
UserBufferAddText (cScBufferNewLine); Put a blank line in to ensure accurate spacing in the buffer
UserBufferAddText (FormatString(cMsgHotKeysLink), cFuncHotKey, FormatString(cMsgHotKeysFunc),
	cFont_Aerial, 12, ATTRIB_UNDERLINE, rgbStringToColor(cColor_BLUE), rgbStringToColor(cColor_White))
If IsWinKeyHelp () then ; Only do this if WindowKeysHelp is appropriate
	UserBufferAddText (cMsgWindowKeysLink, cFuncWinHotKey, cMsgWindowKeysFunc, cFont_Aerial, 12, ATTRIB_UNDERLINE, rgbStringToColor(cColor_BLUE), rgbStringToColor(cColor_White))
EndIf
if (!stringIsBlank (g_strSSHContextHelp)) then
	UserBufferAddText (cScBufferNewLine, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	let strContextHelpMsg = FormatString (cmsgContextHelpF, g_strSSHContextHelp)
	let g_strSSHContextHelp = ""
	UserBufferAddText (strContextHelpMsg, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	UserBufferAddText (cScBufferNewLine, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
endIf
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndFunction

Int Function ScreenSensitiveHelpForJAWSDialogs()
var
	handle hWnd,
	int id,
	int SubType,
	string sRealName
If !InHjDialog() then
	return false
EndIf
let hWnd = GetCurrentWindow()
let sRealName = GetWindowName(GetRealWindow(hWnd))
if sRealName == AdjustJAWSOptionsDialogName
|| sRealName == cStrBrailleDlgName
|| sRealName == cstrBrailleMarkingDlgName
|| sRealName == StringChopRight(WNPersonalSettings,2) then
	ScreenSensitiveHelpForJAWSOptionsDialog()
ElIf sRealName == cwn11 then
	ScreenSensitiveHelpForColorsDialog()
Elif sRealName == cwn12 then
	ScreenSensitiveHelpForSysTray()
ElIf sRealName == cwn13  then
	ScreenSensitiveHelpForJAWSManager()
ElIf sRealName == cwn15 then
	ScreenSensitiveHelpForFramesListDialog ()
ElIf sRealName == cWn16 then
	ScreenSensitiveHelpForHeadingListDialog ()
ElIf sRealName == cWn17 then; customize listview dialog
	ScreenSensitiveHelpForCustomizeListViewDialog ()
ElIf sRealName == cWn18 Then; Select Voice Alias dialog
	ScreenSensitiveHelpForSelectVoiceAliasDialog ()
ElIf sRealName == cWn19 Then; Skim Reading dialog
	ScreenSensitiveHelpForSkimReadingDialog ()
ElIf sRealName == cWn20 Then; Add rules dialog
	ScreenSensitiveHelpForAddRulesDialog ()
ElIf sRealName == cWn21 Then; JAWS find
	ScreenSensitiveHelpForJAWSFindDialog ()
ElIf StringCompare(sRealName,cwn_LinksList) == 0 then
	ScreenSensitiveHelpForLinksListDialog()
ElIf StringCompare (sRealName,cwnCustomizeListViewDefault) == 0
|| StringCompare (sRealName, cwnCustomizeListViewOutlook) == 0 then
	ScreenSensitiveHelpForCustomizeListViewDialog ()
elIf StringCompare (sRealName,cwn_ResearchIt_Input_dlg) == 0 then
	ScreenSensitiveHelpForResearchItDialog ()
elif StringCompare (sRealName,cscSelectBrailleViewDLGTitle) == 0 then
	ScreenSensitiveHelpForSetBrailleViewDialog()
elif StringCompare (sRealName,cmsgManageCall_Title) == 0 then
	ScreenSensitiveHelpForManageCallDialog()
elif PlaceMarkerDialogActive()
	ScreenSensitiveHelpForPlaceMarkerDialog()
elIf FlexibleWebDialogActive () then
	ScreenSensitiveHelpForFlexibleWebDialog()
elIf StringCompare (sRealName,cwn_LabelManager) == 0 then
	ScreenSensitiveHelpForLabelManagerDialog()
else
	return false
EndIf
return true
EndFunction

Void Function ScreenSensitiveHelpVirtualCursor (int iWinType)
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
var string URL = GetURLForFocusedLink ()
if ! stringIsBlank (URL) then
	; add an extra blank line to format for viewer on top of generalized link messages:
	URL = URL + cscBufferNewLine
endIf
If iWinType == WT_BUTTON then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp1_L,cmsgScreenSensitiveHelp1_S,1)
elif iWinType == WT_CHECKBOX then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp2_L,cmsgScreenSensitiveHelp2_S,1)
ElIf iWinType == WT_RADIOBUTTON then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp3_L,cmsgScreenSensitiveHelp3_S,1)
elif iWinType == WT_EDIT
|| iWinType == WT_MULTILINE_EDIT then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp4_L,cmsgScreenSensitiveHelp4_S,1)
ElIf iWinType == WT_EDITCOMBO then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp5_L,cmsgScreenSensitiveHelp5_S,1)
ElIf iWinType == WT_COMBOBOX then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp6_L,cmsgScreenSensitiveHelp6_S,1)
ElIf iWinType == WT_SPINBOX then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp7_L,cmsgScreenSensitiveHelp7_S,1)
ElIf iWinType == WT_UPLOAD_EDIT then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp61_L,cmsgScreenSensitiveHelp61_S,1)
elif iWinType == WT_MAILTO_LINK then
	ShowScreenSensitiveHelp(URL+cmsgScreenSensitiveHelp8_L,URL+cmsgScreenSensitiveHelp8_S,1)
ElIf iWinType == wt_ImageMap_link then
	ShowScreenSensitiveHelp(URL+cmsgScreenSensitiveHelp9_L,URL+cmsgScreenSensitiveHelp9_S,1)
ElIf iWinType == 	WT_BITMAP then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp10_L,cmsgScreenSensitiveHelp10_S,1)
ElIf iWinType == WT_LINK then
	ShowScreenSensitiveHelp(URL+cmsgScreenSensitiveHelp11_L,URL+cmsgScreenSensitiveHelp11_S,1)
ElIf iWinType == WT_THISPAGE_LINK then
	ShowScreenSensitiveHelp(URL+cmsgScreenSensitiveHelp12_L,URL+cmsgScreenSensitiveHelp12_S,1)
ElIf iWinType == wt_ftp then
	ShowScreenSensitiveHelp(URL+cmsgScreenSensitiveHelp13_L,URL+cmsgScreenSensitiveHelp13_S,1)
ElIf iWinType >= WT_HTML_HEADING1 && iWinType <= WT_HTML_HEADING6 then
	ShowScreenSensitiveHelp(URL+FormatString (cMsgHtmlHeading,IntToString(GetCurrentHeadingLevel())),cscNull,1)
else ;Unknown Types
	SayNumOfPageElements ()
	return
EndIf
AddVisperoConnectedLink()
UserBufferAddText (cScBufferNewLine)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndFunction

string function GetCustomScreenSensitiveHelpForKnownClasses(int nSubTypeCode)
;Use this function in application scripts
;to enable Function ScreenSensitiveHelpForKnownClasses to use a custom screen sensitive help message.
return cscNull
EndFunction

Void Function ScreenSensitiveHelpForKnownClasses (int nSubTypeCode)
var
	int iCtrl,
	handle hWnd,
	string RealName,
	string sMessageLong,
	string sMessageShort,
	string sTreeLevel
If (IsVirtualPCCursor ()) then
	If !IsJavaWindow (GetCurrentWindow ()) then
		If (nSubTypeCode > 0) then
			ScreenSensitiveHelpVirtualCursor (nSubTypeCode)
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
if (nSubTypeCode == WT_BUTTON) then ;#1
	If InHjDialog() then
		let hWnd = GetFocus()
		let RealName = GetWindowName(GetRealWindow(hWnd))
		if RealName == AdjustJAWSOptionsDialogName
		|| RealName == cStrBrailleDlgName
		|| RealName == cstrBrailleMarkingDlgName then
			let iCtrl = GetControlID(hWnd)
			if iCtrl == id_JAWSOptionsCloseButton then
				ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpJAWSOptionsCloseButton)
			ElIf iCtrl == id_JAWSOptionsExecuteButton then
				ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpJAWSOptionsExecuteButton)
			EndIf
			return
		EndIf
	EndIf
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp14_L)
	Return
ElIf (nSubTypeCode == WT_COMBOBOX) then ;#2
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp15_L)
	Return
Elif (nSubTypeCode == WT_EDIT) ||;#3
nSubTypeCode == WT_MULTILINE_EDIT then ; #66
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp16_L)
	Return
endIf
if (nSubTypeCode == WT_LISTBOX) then ;#4
	if (IsSelectScriptDlg()) then
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp17_L)
	elif (IsSelectItemDlg()) then
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp18_L)
	else
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp19_L)
	endIf
	Return
endIf
if (nSubTypeCode == WT_SCROLLBAR) || (nSubTypeCode ==WT_LEFTRIGHTSCROLLBAR) then ;#5
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp20_L)
	Return
elif (nSubTypeCode ==WT_UPDOWNSCROLLBAR) Then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp21_L)
	return
endIf
if (nSubTypeCode == WT_STATIC) then ;#6
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp22_L)
	Return
elif (nSubTypeCode == WT_TOOLBAR) then ;#7
	if IsJAWSCursor()
	|| IsInvisibleCursor() then
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpToolBarJAWSCursor_L)
	else
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp23_L)
	EndIf
	Return
elif (nSubTypeCode == WT_STATUSBAR) then ;#8
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp24_L)
	Return
elif (nSubTypeCode == WT_HEADERBAR) then ;#9
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp25_L)
	Return
elif (nSubTypeCode == WT_SPINBOX) then ;#12
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp26_L)
	Return
elif (nSubTypeCode == WT_MENU) then
	if IsHorizontalMenu() then
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp27a_L)
	else
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp27_L)
	endIf
	Return
elif (nSubTypeCode == WT_DESKTOP) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp28_L)
	Return
elif (nSubTypeCode == WT_ICONTITLE) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp29_L)
	return
elif (nSubTypeCode == WT_MDICLIENT) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp30_L)
	Return
elif (nSubTypeCode == WT_DIALOG) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp31_L)
	Return
elif (nSubTypeCode == WT_RADIOBUTTON) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp32_L)
	Return
elif (nSubTypeCode == WT_CHECKBOX) then
	If InHjDialog()
	&& GetControlID(GetFocus()) == id_JAWSOptionsCheckBox then
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpJAWSOptionsCheckBox)
	else
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp33_L)
	EndIf
	Return
elif (nSubTypeCode == WT_GROUPBOX) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp34_L)
	Return
elif (nSubTypeCode == WT_SDM) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp35_L)
	Return
elif (nSubTypeCode == WT_GENERALPICTURE) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp36_L)
	Return
elif (nSubTypeCode == WT_HOTKEY) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp37_L)
	Return
elif (nSubTypeCode == WT_TABCONTROL) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp38_L)
	Return
elif (nSubTypeCode == WT_LISTVIEW) then
	let RealName = GetWindowName (GetRealWindow (GetCurrentWindow()))
	;cwn4="Desktop"
	if RealName == cwn4 then
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp39_L)
		Return
	else
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp40_L)
		Return
	endIf
elif nSubTypeCode == WT_TREEVIEW
|| nSubTypeCode == WT_TREEVIEWItem then
	If (InHjDialog ()) then
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpJAWSOptionsTreeView)
	Else
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp41_L)
	EndIf
	Return
elif (nSubTypeCode == WT_STARTBUTTON) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp42_L)
	Return
elif (nSubTypeCode == WT_STARTMENU) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp43_L)
	Return
elif (nSubTypeCode == WT_CONTEXTMENU) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp44_L)
	Return
elif (nSubTypeCode == WT_TASKBAR) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp45_L)
	Return
elif (nSubTypeCode == WT_MULTISELECT_LISTBOX) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp46_L)
	Return
elif (nSubTypeCode == WT_EXTENDEDSELECT_LISTBOX) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp47_L)
	Return
elif (nSubTypeCode == WT_LEFTRIGHTSLIDER) then ;#39
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp48_L)
	Return
elif (nSubTypeCode == WT_UPDOWNSLIDER) then ;#40
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp49_L)
	Return
elif (nSubTypeCode == WT_EDITCOMBO) then ;#41
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp50_L)
	Return
elif (nSubTypeCode == WT_PASSWORDEDIT) then ;#42
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp51_L)
	Return
elif (nSubTypeCode == WT_READONLYEDIT) then ;#43
	If InHjDialog()
	&& GetControlID(GetFocus()) == id_JAWSOptionsReadOnlyEdit then
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpJAWSOptionsReadOnlyEdit)
	else
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp52_L)
	EndIf
	Return
elif (nSubTypeCode == WT_COMMANDBAR) then ;#44
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp53_L)
	return
elif nSubTypeCode==WT_SYSTray then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp54_L)
	return
ElIf nSubTypeCode == WT_CLOCK then
	ShowScreenSensitiveHelp(cMsgScreenSensitiveHelpClock)
	return
elif (GlobalMenuMode == MENUBAR_ACTIVE) then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp55_L)
	return
elIf (nSubTypeCode == WT_EDIT_SPINBOX) then ; #62
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp56_L)
	Return
elIf (nSubTypeCode == WT_UPLOAD_EDIT) then
	if (CaretVisible()) then
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp59_L)
	else
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp60_L)
	EndIf
	Return
ElIf nSubTypeCode == WT_LINK then
	ShowScreenSensitiveHelp(cMsgScreenSensitiveHelp63)
	Return
ElIf nSubTypeCode == WT_BUTTONDROPDOWN
|| nSubTypeCode == WT_BUTTONDROPDOWNGRID then
;|| nSubTypeCode == WT_SPLITBUTTON then; split buttons use a directional arrow to open.
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp14_L)
	Return
elIf nSubTypeCode == WT_SPLITBUTTON then
	;state uses a vertical arrow, wheras no state uses horizontal.
	;example of state is the header controls for the list in Windows Explorer, where you change the value and the list sort is changed.
	if ! stringIsBlank (getObjectState ()) then
		ShowScreenSensitiveHelp (cmsgScreenSensitiveHelpSplitButtonWithState)
	else
		ShowScreenSensitiveHelp (cmsgScreenSensitiveHelpSplitButton)
	endIf
	Return
ElIf nSubTypeCode == WT_OUTLINEBUTTON then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp62);
	Return
ElIf nSubTypeCode == wt_3State then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_3State)
	return
elif nSubTypeCode == WT_ButtonMenu then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_ButtonMenu)
	return
elif nSubtypeCode == wt_ListBoxItem then
	if GetObjectSubtypeCode(SOURCE_CACHED_DATA,1) == WT_COMBOBOX
	|| GetObjectSubtypeCode(SOURCE_CACHED_DATA,2) == WT_COMBOBOX then
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp15_L)
	else
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp19_L)
	EndIf
	Return
elif nSubtypeCode == wt_grid then
	ShowScreenSensitiveHelp(cMsgScreenSensitiveHelpGrid)
	return
;This should be the last case, so place all new cases for various type codes above this line:
elIf (! stringIsBlank (g_strSSHContextHelp)) then
	let sMessageLong = FormatString (cmsgContextHelpF, g_strSSHContextHelp)
	let sMessageLong = sMessageLong + cScBufferNewLine + cScBufferNewLine + cMsgBuffExit
	let g_strSSHContextHelp = ""
	SayFormattedMessage (OT_USER_BUFFER, sMessageLong);
	Return
endIf
;if it gets this far it did not recognize the type code.
let sMessageLong = FormatString (cmsgScreenSensitiveHelp57_L, IntToString (nSubTypeCode))
let sMessageShort = FormatString (cmsgScreenSensitiveHelp57_S, IntToString (nSubTypeCode))
SayFormattedMessage (OT_USER_BUFFER, sMessageLong)
ScreenSensitiveHelpForUnknownClasses (); catch everything not yet handled
EndFunction

int Function ScreenSensitiveHelpWinforms ()
;var
If GlobalMenuMode || InHjDialog () then
	Return FALSE
EndIf
if ! StringContains(GetWindowClass(GetFocus()), cWc_Winforms) then
	Return FALSE
EndIf
If getObjectSubtypeCode(SOURCE_CACHED_DATA, 0)==WT_TableCell then
	If getObjectSubtypeCode(SOURCE_CACHED_DATA,1)==wt_Row then
		;Data Grid control
		ShowScreenSensitiveHelp (cMsgScreenSensitiveHelpWinformsDataGrid)
		Return TRUE
	;ElIf NextConditionInDotNetControls
	Else
		Return FALSE
	EndIf;End of .Net controls
	Return FALSE
EndIf;End of classname Winforms.
Return FALSE
EndFunction

int function ScreenSensitiveHelpForRibbons()
if UserBufferIsActive () return false endIf
var int state = RibbonsActive()
if state == ribbons_inactive return false endIf
if IsVirtualRibbonActive() then
	ShowScreenSensitiveHelpForVirtualRibbon(GlobalMenuMode==1)
	return true
endIf
var int iObjType = GetObjectSubtypeCode()
if iObjType == wt_TabControl
	ShowScreenSensitiveHelp(msgRibbonBarScreenSensitiveHelp)
else
	return false
endIf
return true
EndFunction

Script ScreenSensitiveHelp ()
if (IsSameScript ()) then
	AppFileTopic(0) ; Don't display a topic
	return
endIf
If UserBufferIsActive () then
	JAWSTopOfFile ()
	SayAll ()
	Return
EndIf
If (ScreenSensitiveHelpWinforms() ; Special Case .Net Winforms and grids
|| ScreenSensitiveHelpForRibbons()
|| ScreenSensitiveHelpForFusionQuickAccessBar()) then
	return
endIf
If GlobalMenuMode == 1
	ScreenSensitiveHelpForKnownClasses (wt_MenuBar);
	return
endIf
if ScreenSensitiveHelpForJAWSDialogs () then
	return
endIf
var
	handle WinHandle,
	string sRealName
sRealName = GetWindowName(GetRealWindow(WinHandle ))
;for window list
If sRealName == cwn14 then
	ScreenSensitiveHelpWindowList()
	return
;For OCR Camera Recognition dialog:
elif StringCompare(sRealName,cwn_OCR_CameraRecognition_DLG) == 0
|| StringCompare(sRealName,cwn_OCR_CameraRecognition_AdvancedSettings_DLG) == 0
|| StringCompare(sRealName,cwn_OCR_CameraRecognition_AdvancedScannerSettings_DLG) == 0
	ScreenSensitiveHelpForCameraRecognitionDialog(sRealName)
	return
EndIf
var
	int TheTypeCode,
	String TheClass
WinHandle = GetCurrentWindow ()
TheTypeCode = GetWindowSubTypeCode (WinHandle)
If !TheTypeCode then
	TheTypeCode = GetObjectSubtypeCode()
;for windows of class / type button who are really buttons with the horizontal arrow.
;Example: Shut down button in Windows Vista / 7
elIf TheTypeCode == WT_BUTTON && getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_SPLITBUTTON then
	TheTypeCode = getObjectSubtypeCode(SOURCE_CACHED_DATA)
EndIf
if theTypeCode != WT_PASSWORDEDIT then
	g_strSSHContextHelp=GetObjectHelp ()
endIf
If TheTypeCode > wt_unknown
	ScreenSensitiveHelpForKnownClasses (theTypeCode); known types
	return
endIf
TheClass = GetWindowClass (GetFocus ())
If (theClass == cwcTTY
|| theClass == cwcTTYGrab
|| TheClass ==cwc_ConsoleWindow) then
	If UserBufferIsActive () then
		UserBufferDeactivate()
	EndIf
	SayFormattedMessage (OT_USER_BUFFER, cmsg175_L) ;"This is a DOS Window"
	return
endIf
If IsVirtualPcCursor () then
	SayFormattedMessage (OT_USER_BUFFER, GetNumOfPageElements ())
	AddVisperoConnectedLink()
	AddIENavigationKeystrokes()
	Return
EndIf
ScreenSensitiveHelpForUnknownClasses()  ; handle unknown window types and classes
EndScript

Int Function ScreenSensitiveHelpForFusionQuickAccessBar ()
	If GetAppFileName () == QuickAccessBarExe
		var handle hCurrentWindow = GetCurrentWindow ()
		var int iWinType = GetWindowSubTypeCode (hCurrentWindow)
		If !iWinType then
			Let iWinType = GetObjectSubTypeCode ()
		EndIf

		if iWinType == WT_UNKNOWN
			ShowScreenSensitiveHelp(cmsgQuickAccessBarDoubleShortcut)
			return true
		EndIf
	EndIf
	return false
EndFunction

Void Function ScreenSensitiveHelpForUnknownClasses ()
var
	handle hwnd,
	string sMessage
let TimesPressedDefault = 0
let hwnd = GetCurrentWindow ()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
If (hwnd) then ;window handle is not 0
	let sMessage = cmsg84_L
	SayFormattedMessage (OT_USER_BUFFER, sMessage) ;"This is a custom window type"
else ; handle = 0
	SayFormattedMessage (OT_USER_BUFFER, cmsg96) ;"there is currently no item with focus"
endIf
EndFunction

script ScreenSensitiveHelpTechnical()
var
	handle hwnd,
	String TheClass,
	string sControl,
	string sMessage
let hwnd = GetCurrentWindow ()
let TheClass = GetWindowClass (hwnd)
let sControl = IntToString (GetControlID (hwnd))
let sMessage = FormatString (cmsg85_L, sControl, theClass, IntToString (hwnd))
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (OT_USER_BUFFER, sMessage) ;"This is a custom window type"
UserBufferAddText (cScBufferNewLine)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndScript

Void Function ScreenSensitiveHelpForColorsDialog()
var
	handle hWnd,
	int id,
	int SubType
let hWnd = GetCurrentWindow()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlId(hWnd)
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if SubType == WT_LISTBOX  then
	if id == id_ListBox_colorDlg then
		SayFormattedMessage(OT_USER_BUFFER, cmsg367_L)
		return
	Else
		ScreenSensitiveHelpForKnownClasses(SubType)
		return
	EndIf
ElIf SubType == WT_BUTTON then
	if id == id_OK then
		SayFormattedMessage(OT_USER_BUFFER, cmsg365_L)
		return
	ElIf id == id_CANCEL then
		SayFormattedMessage(OT_USER_BUFFER, cmsg366_L)
		return
	ELSE
		ScreenSensitiveHelpForKnownClasses(SubType)
		return
	ENDIF
Else
		PerFormScript ScreenSensitiveHelp()
		return
EndIf
EndFunction

void Function ScreenSensitiveHelpForSysTray()
var
	handle hWnd,
	int id,
	int SubType
let hWnd = GetCurrentWindow()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlId(hWnd)
if SubType == WT_LISTBOX 						 then
	if id == id_listBox_systemTray  then
		ShowScreenSensitiveHelp(cmsg368_L)
	Else
		ScreenSensitiveHelpForKnownClasses(SubType)
	EndIf
	return
ElIf SubType == WT_BUTTON then
	if id == iD_RightSingleClick then
		ShowScreenSensitiveHelp(cmsg369_L)
   ElIf id == iD_LeftSingleClick then
		ShowScreenSensitiveHelp(cmsg370_L)
	ElIf id == iD_LeftDoubleClick then
		ShowScreenSensitiveHelp(cmsg371_L)
	ElIf id == id_CANCEL   then
		ShowScreenSensitiveHelp(cmsg366_L)
	Else
		ScreenSensitiveHelpForKnownClasses(SubType)
	EndIf
	return
EndIf
PerformScript ScreenSensitiveHelp()
EndFunction

void Function ScreenSensitiveHelpForJAWSManager()
var
	handle hWnd,
	int id,
	int SubType
let hWnd = GetCurrentWindow()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlId(hWnd)
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if SubType == WT_LISTVIEW 						 then
	if id == ID_ListView_JAWSManager then
		ShowScreenSensitiveHelp (FormatString (cmsg372_L))
		return
	Else
		ScreenSensitiveHelpForKnownClasses(SubType)
		return
	EndIf
ElIf SubType == WT_BUTTON then
	if Id == id_ok then
		SayFormattedMessage(OT_USER_BUFFER, cmsg365_L)
		return
	ElIf id == id_cancel then
		SayFormattedMessage(OT_USER_BUFFER, cmsg366_L)
		return
	Else
		ScreenSensitiveHelpForKnownClasses(SubType)
		return
	EndIf
Else
	; Former call to Script ScreenSensitiveHelp caused a recursive loop, causing this function to throw.
	ScreenSensitiveHelpForKnownClasses(SubType)
	return
EndIf
EndFunction

Void Function ScreenSensitiveHelpWindowList()
var
	handle hWnd,
	int id,
	int SubType
let hWnd = GetCurrentWindow()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlId(hWnd)
If SubType == WT_LISTBOX then
	if id == id_ListBoxWindowList then
		ShowScreenSensitiveHelp(cmsg373_L)
	Else
		ScreenSensitiveHelpForKnownClasses(SubType)
	EndIf
	return
ElIf SubType == WT_BUTTON then
	if id == id_SwitchTo_btn  then
		ShowScreenSensitiveHelp(cmsg374_L)
	ElIf id == id_About_btn  then
		ShowScreenSensitiveHelp(cmsg375_L)
	ElIf id == id_cancel then
		ShowScreenSensitiveHelp(cmsg366_L)
	Else
		ScreenSensitiveHelpForKnownClasses(SubType)
	EndIf
	return
ElIf SubType == WT_Checkbox then
	if id == id_OnlyIncludeOnTopWindows then
		ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_OnlyIncludeOnTopWindows)
	else
		ScreenSensitiveHelpForKnownClasses(SubType)
	EndIf
	return
EndIf
ScreenSensitiveHelpForKnownClasses(SubType)
EndFunction

void Function ScreenSensitiveHelpForFramesListDialog ()
var
	handle hWnd,
	int id,
	int SubType
let hWnd = GetCurrentWindow()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlId(hWnd)
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if SubType == WT_LISTBOX 						 then
	if id ==  id_lisbox_JAWSManager  then
		SayFormattedMessage(OT_USER_BUFFER, cMsg377_L)
		return
	Else
		ScreenSensitiveHelpForKnownClasses(SubType)
		return
	EndIf
ElIf SubType == WT_BUTTON then
	if Id == id_ok then
		SayFormattedMessage(OT_USER_BUFFER, cmsg378_L)
		return
	ElIf id == id_cancel then
		SayFormattedMessage(OT_USER_BUFFER, cmsg379_L)
		return
	Else
		ScreenSensitiveHelpForKnownClasses(SubType)
		return
	EndIf
Else
	PerformScript ScreenSensitiveHelp()
	return
EndIf
EndFunction

void function ScreenSensitiveHelpForHeadingListDialog ()
var
	handle hWnd,
	int iControl,
	int iTypeCode,
	string strGroupName;Handle radio button groups, especially for the display of headings 1 through 6
Let hWnd = GetCurrentWindow ()
Let iTypeCode = GetWindowSubTypeCode (hWnd)
If iTypeCode == WT_LISTVIEW then
	SayFormattedMessage (OT_USER_BUFFER, cmsgHtmlHeadingsList)
	Return
EndIf
If iTypeCode == WT_RADIOBUTTON then
	Let strGroupName = GetGroupBoxName ()
	If strGroupName == cWnGroup1 then
		SayFormattedMessage (OT_USER_BUFFER, cmsgHtmlHeadingOrder)
		Return
	ElIf strGroupName == cWnGroup2 then
		SayFormattedMessage (OT_USER_BUFFER, cmsgHtmlHeadingLevels)
		Return
	EndIf
	Return
ElIf iTypeCode == WT_BUTTON then
	Let iControl = GetControlID (hWnd)
	If (iControl == ID_HEADING_MOVE_TO) then
		SayFormattedMessage (OT_USER_BUFFER, cmsgHtmlHeadingMoveToButton)
		Return
	ElIf iControl ==ID_CANCEL then
		SayFormattedMessage (OT_USER_BUFFER, cmsgHtmlHeadingCancelButton)
		Return
	EndIf
Else
	PerformScript ScreenSensitiveHelp ()
EndIf
EndFunction

void function ScreenSensitiveHelpForCustomizeListViewDialog ()
Var
	handle hWnd,
	int iControl,
	int iTypeCode,
	string sDlgPageName
Let hWnd = GetCurrentWindow ()
Let iTypeCode = GetWindowSubTypeCode (hWnd)
let sDlgPageName =  GetDialogPageName ()
If sDlgPageName == cWnSpeech Then
	If iTypeCode == WT_TABCONTROL Then; Speech page tab
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpSpeechPage)
	ElIf iTypeCode  == WT_LISTVIEW Then; headings list view
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpHeadingsList)
	ElIf iTypeCode  == WT_BUTTON Then
		let iControl = GetControlID (hWnd)
		If iControl == ID_MoveUpBtn Then
			SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpMoveUpButton)
		ElIf iControl == ID_MoveDownBtn Then
			SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpMoveDownButton)
		ElIf iControl == ID_ToggleSpeechBtn Then
			SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpToggleSpeechButton)
		ElIf iControl == ID_SelectVoiceAliasBtn Then
			SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpVoiceAliasButton)
		ElIf iControl == id_DeleteCustomizationBtn  Then
			SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpDeleteCustomizationButton)
		ElIf iControl == id_ok Then
			SayFormattedMessage (OT_USER_BUFFER, cmsg365_L)
		ElIf iControl == id_cancel Then
			SayFormattedMessage (OT_USER_BUFFER, cmsg366_L)
		EndIf
	ElIf iTypeCode == WT_EDIT Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpCustomTextEdit)
	ElIf iTypeCode == WT_RADIOBUTTON Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpColumnHeaderRadioButtons)
	EndIf
ElIf sDlgPageName == cWnBraille Then
	If iTypeCode == WT_TABCONTROL Then; Braille page tab
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBraillePage)
	ElIf iTypeCode == WT_LISTVIEW then; headings list
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBrlHeadingsList)
	ElIf iTypeCode == WT_BUTTON Then
		let iControl = GetControlID (hWnd)
		If iControl == 7029 Then; Braille move up button
			SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBrlMoveUpButton)
		ElIf iControl == 7048 Then; Braille move down button
			SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBrlMoveDownButton)
		ElIf iControl == 7030 Then; Toggle Braille button
			SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpToggleBrailleButton)
		ElIf iControl == id_ok Then
			SayFormattedMessage (OT_USER_BUFFER, cmsg365_L)
		ElIf iControl == id_cancel Then
			SayFormattedMessage (OT_USER_BUFFER, cmsg366_L)
		EndIf
	ElIf iTypeCode == WT_RADIOBUTTON Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBrlColumnHeaderRadioButtons)
	ElIf iTypeCode == WT_EDIT Then; custom text edit
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBrlCustomTextEdit)
	EndIf
ElIf iTypeCode == WT_BUTTON Then
	let iControl = GetControlID (hWnd)
	If iControl == id_ok Then
		SayFormattedMessage (OT_USER_BUFFER, cmsg365_L)
	ElIf iControl == id_cancel Then
		SayFormattedMessage (OT_USER_BUFFER, cmsg366_L)
	EndIf
else
	ScreenSensitiveHelpForKnownClasses (iTypeCode)
	return
EndIf
UserBufferAddText(cscBufferNewLine+cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndFunction

Void Function ScreenSensitiveHelpForSelectVoiceAliasDialog ()
Var
	handle hWnd,
	int iControl,
	int iTypeCode
let hWnd = GetCurrentWindow ()
let iTypeCode = GetWindowSubTypeCode (hWnd)
If iTypeCode == WT_LISTVIEW Then; voice alias list view
	SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpVoiceAliasListView)
	return
ElIf iTypeCode == WT_BUTTON Then
	let iControl = GetControlID (hWnd)
	If iControl == id_ok Then
		SayFormattedMessage (OT_USER_BUFFER, cmsg365_L)
		return
	ElIf iControl == id_cancel Then
		SayFormattedMessage (OT_USER_BUFFER, cmsg366_L)
		return
	EndIf
EndIf
EndFunction

Void Function ScreenSensitiveHelpForSkimReadingDialog ()
Var
	handle hWnd,
	handle hwndParent,
	int iControl,
	int iTypeCode,
	int iParentTypeCode
let hWnd = GetCurrentWindow ()
let iTypeCode = GetWindowSubTypeCode (hWnd)
let hWndParent = GetParent(hWnd)
let iParentTypeCode = GetWindowSubTypeCode (hWndParent)
If iTypeCode == WT_RADIOBUTTON Then
	SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpUseRuleTypeRadioButtons)
	return
ElIf iTypeCode == WT_BUTTON Then
	let iControl = GetControlID (hWnd)
	If iControl  == ID_AddRuleBtn Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpAddRulesButton)
		return
	ElIf iControl == ID_ModifyRuleBtn Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpModifyRuleButton)
		return
	ElIf iControl == ID_DeleteRuleBtn Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpDeleteRuleButton)
		return
	ElIf iControl == ID_DeleteAllRulesBtn Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpDeleteAllRulesButton)
		return
	ElIf iControl ==  ID_StartSkimReadBtn Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpStartSkimReadBtn)
		return
	ElIf iControl == id_SummarizeSkimReadBtn then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpSummarizeSkimReadBtn)
		return
	ElIf iControl == ID_CloseSkimReadBtn Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgCloseSkimReadBtn)
		return
	ElIf iControl == ID_SkimReadHelpBtn  Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpSkimReadingHelpBtn)
		return
	EndIf
ElIf iTypeCode == WT_CHECKBOX Then
	let iControl = GetControlID (hWnd)
	If IControl == id_SkimReadingIndicationChkBx  Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpSkimReadingIndicationChkBox)
		return
	ElIf iControl == id_UseRegularExpressionChkBx  Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpUseRegularExpressionCheckBox_L)
		return
	ElIf iControl == id_BoldCheckBox Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBoldCheckBox_l)
		return
	ElIf iControl == id_ItalicCheckBox Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpItalicCheckBox_L)
		return
	ElIf iControl == id_UnderLineCheckBox Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpUnderlineCheckBox_L)
		return
	ElIf iControl == id_StrikeOutCheckBox Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpStrikeOUtCheckBox_L)
		return
	ElIf iControl == id_DoubleStrikeOutCheckBox Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpDoubleStrikeoutCheckBox_L)
		return
	ElIf iControl == id_SuperScriptCheckBox Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpSuperScriptCheckBox_L)
		return
	ElIf iControl == id_SubScriptCheckBox Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpSubScriptCheckBox_L)
		return
	ElIf iControl == id_ShadowCheckBox Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpShadowCheckBox_L)
		return
	ElIf iControl == id_OutlineCheckBox Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpOutlineCheckBox_L)
		return
	EndIf
ElIf iTypeCode == WT_COMBOBOX
;or if the combo box has been opened with Alt+DownArrow:
|| (iTypecode == wt_ListBox && iParentTypecode == wt_ComboBox) Then
	if iTypeCode == wt_ComboBox then
		let iControl = GetControlID (hWnd)
	elif iParentTypecode == wt_ComboBox then
		let iControl = GetControlID (hWndParent)
	EndIf
	If iControl == ID_TextRulesCombo Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpTextRulesComboBox)
		return
	ElIf iControl == ID_SpeakUnitCombo Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpSpeakUnitComboBox)
		return
	ElIf iControl == id_TextColorCombo Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpTextColorCombo_l)
		return
	ElIf iControl == id_BackgroundColorCombo Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBackgroundColorCombo_L)
		return
	Else
		SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelp15_L)
		return
	EndIf
ElIf iTypeCode == WT_EDIT Then
	let iControl = GetControlID (hWnd)
	If iControl  == Id_TextSearchPatternEdit  Then
		SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpTextSearchPattern_L)
		return
	ElIf iControl  == id_TextRuleNameEdit Then
		SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpRuleName_L)
		return
	EndIf
EndIf
ScreenSensitiveHelpForKnownClasses(iTypeCode)
EndFunction

Void Function ScreenSensitiveHelpForAddRulesDialog ()
Var
	handle hWnd,
	int iControl,
	int iTypeCode
let hWnd = GetCurrentWindow ()
let iTypeCode = GetWindowSubTypeCode (hWnd)
If iTypeCode == WT_EDIT Then
	let iControl = GetControlID (hWnd)
	If iControl == ID_TextRuleEdit Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpTextRuleEdit)
		return
	ElIf iControl == ID_RuleNameEdit Then; rule name edit
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpRuleNameEdit)
		return
	EndIf
ElIf iTypeCode == WT_BUTTON Then
	let iControl = GetControlID (hWnd)
	If iControl == id_ok Then
		SayFormattedMessage (OT_USER_BUFFER, cmsg365_L)
		return
	ElIf iControl == id_cancel Then
		SayFormattedMessage (OT_USER_BUFFER, cmsg366_L)
	Return
	EndIf
EndIf
PerformScript ScreenSensitiveHelp ()
EndFunction

Void Function ScreenSensitiveHelpForJAWSFindDialog  ()
Var
	handle hWnd,
	int iControl,
	int iTypeCode
let hWnd = GetCurrentWindow ()
let iTypeCode = GetWindowSubTypeCode (hWnd)
If iTypeCode == WT_EDITCOMBO Then
	SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpFindWhatEditCombo_L)
	return
ElIf iTypeCode == wT_RADIOBUTTON Then
	let iControl = GetControlID (hWnd)
	If iControl == id_FindForwardRabioBtn  Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpDirectionForwardRadioButton_L)
		return
	ElIf iControl == id_FindBackwardRadioBtn  	Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpDirectionBackwardRadioButton_L)
		return
	EndIf
ElIf iTypeCode == WT_BUTTON then
	let iControl = GetControlID (hWnd)
	If iControl == id_StartFindBtn Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpFindButton_L)
		return
	ElIf iControl == id_DeleteFindBtn  Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpDeleteButton_L)
		return
	ElIf iControl == id_ClearHistoryBtn  Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpClearFindHistoryButton_L)
		return
	ElIf iControl == id_CancelFindBtn Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpCancelFindButton_L)
		return
	EndIf
ElIf iTypeCode == WT_CHECKBOX Then
	let iControl = GetControlID (hWnd)
	If iControl == id_ContextSpecificHistoryCheckbox then
		SayFormattedMessage (OT_USER_BUFFER,cMsgScreenSensitiveHelpContextSpecificHistoryCheckBox_L)
		return
	elif iControl == id_ClearHistoryCheckBox  Then
		SayFormattedMessage (OT_USER_BUFFER,  cMsgScreenSensitiveHelpMainTainHistoryCheckBox_L)
		return
	ElIf iControl == id_IgnoreCaseCheckBox  Then
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpIgnoreCaseCheckBox_L)
		return
	EndIf
EndIf
PerformScript ScreenSensitiveHelp ()
EndFunction

void function ScreenSensitiveHelpForJAWSOptionsDialog()
var
	handle hWnd,
	int iCtrl
let hWnd = GetFocus()
let iCtrl = GetControlID(hWnd)
if iCtrl == id_JAWSOptionsCloseButton then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpJAWSOptionsCloseButton)
ElIf iCtrl == id_JAWSOptionsExecuteButton then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpJAWSOptionsExecuteButton)
ElIf iCtrl == id_JAWSOptionsCheckBox then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpJAWSOptionsCheckBox)
elif iCtrl == id_JAWSOptions_TreeView then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpJAWSOptionsTreeView)
ElIf iCtrl == id_JAWSOptionsReadOnlyEdit then
	ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpJAWSOptionsReadOnlyEdit)
EndIf
EndFunction

void function ScreenSensitiveHelpForResearchItDialog ()
var
	handle hwnd,
	int iTypeCode,
	int iControl
let hwnd = getCurrentWindow ()
let iControl = GetControlID (hWnd)
let iTypeCode = getWindowSubtypeCode (hwnd)
if iTypeCode == WT_EDITCOMBO then
	SayMessage (OT_USER_BUFFER, cmsgResearchItWordOrPhraseEditCombo)
elIf iTypeCode == WT_LISTVIEW then
	SayFormattedMessage (OT_USER_BUFFER, cmsgResearchItLookupSourcesList)
elIf iTypeCode == WT_READONLYEDIT then
	SayFormattedMessage (OT_USER_BUFFER, cmsgResearchItLookupSourceDescription)
elIf iTypeCode == WT_CHECKBOX then
	let iControl = GetControlID (hWnd)
	if iControl == ID_ResearchIt_MaintainHistory then
		SayMessage (OT_USER_BUFFER, cmsgResearchItMaintainHistoryCheckbox)
	else
		SayMessage (OT_USER_BUFFER, cmsgResearchItIgnoreHistoryCaseCheckBox)
	endIf
ElIf iTypeCode == WT_BUTTON Then
	let iControl = GetControlID (hWnd)
	if iControl == ID_ResearchIt_ClearHistoryItem then
		SayMessage (OT_USER_BUFFER, cmsgResearchItClearHistoryItem)
	elIf iControl == ID_ResearchIt_ClearAllHistoryItems then
		SayMessage (OT_USER_BUFFER, cmsgResearchItClearAllHistoryItems)
	elIf iControl == ID_ResearchIt_Options then
		SayMessage (OT_USER_BUFFER, cmsgResearchItOptions)
	elIf iControl == id_ok Then
		SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelpResearchItDialogOKButton)
	ElIf iControl == id_cancel Then
		SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelpResearchItDialogCancelButton)
	EndIf
EndIf
AddHotKeyLinks ()
endFunction

void function ScreenSensitiveHelpForSetBrailleViewDialog()
var
	handle hwnd,
	int iTypeCode,
	int iControl

let hwnd = getCurrentWindow ()
let iControl = GetControlID (hWnd)
let iTypeCode = getWindowSubtypeCode (hwnd)
if iControl == ID_ListView_JAWSManager then
	SayMessage (OT_USER_BUFFER, cmsgSetBrailleViewSSHList)
ElIf iTypeCode == WT_READONLYEDIT Then
	SayMessage (OT_USER_BUFFER, cmsgSetBrailleViewSSHDesc)
ElIf iTypeCode == WT_BUTTON Then
	if iControl == ID_SetBrailleView_Default
		SayMessage (OT_USER_BUFFER, cmsgSetBrailleViewSSHDefault)
	elif iControl == ID_SetBrailleView_SwapSplit
		SayMessage (OT_USER_BUFFER, cmsgSetBrailleViewSSHSwap)
	elif iControl == ID_SetBrailleView_Options
		SayMessage (OT_USER_BUFFER, cmsgSetBrailleViewSSHOptions)
	else
		SayMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelpButtonSpacebar_L)
	EndIf
EndIf
AddHotKeyLinks ()
endFunction

void function ScreenSensitiveHelpForCameraRecognitionDialog(string dlgName)
var
	handle hwnd,
	int id
hwnd = getCurrentWindow ()
id = GetControlID (hWnd)
;The main dialog:
if StringCompare(dlgName,cwn_OCR_CameraRecognition_DLG) == 0
	if id == ID_CameraRecognition_Camera_ComboBox
		SayMessage(OT_USER_BUFFER, cmsg_CameraRecognition_Camera_ComboBox_ScreenSensitiveHelp)
	elif id == ID_CameraRecognition_Light_ComboBox
		SayMessage(OT_USER_BUFFER, cmsg_CameraRecognition_Light_ComboBox_ScreenSensitiveHelp)
	elif id == ID_CameraRecognition_MotionDetectMultiPageRecognition_Checkbox
		SayMessage(OT_USER_BUFFER, cmsg_CameraRecognition_MotionDetectMultiPageRecognition_Checkbox_ScreenSensitiveHelp)
	elif id == ID_CameraRecognition_Timeout_Checkbox
		SayMessage(OT_USER_BUFFER, cmsg_CameraRecognition_Timeout_Checkbox_ScreenSensitiveHelp)
	elif id == id_ScannerRecognition_UseAutoDocumentFeed_CheckBox
		SayMessage(OT_USER_BUFFER,cmsg_ScannerRecognition_UseAutoDocumentFeed_Checkbox_ScreenSensitiveHelp)
	elif id == ID_CameraRecognition_AdvancedSettings_Button
		SayMessage (OT_USER_BUFFER, cmsg_CameraRecognition_AdvancedSettings_Button_ScreenSensitiveHelp)
	elif id == ID_CameraRecognition_Recognize_Button
		SayMessage (OT_USER_BUFFER, cmsg_CameraRecognition_Recognize_Button_ScreenSensitiveHelp)
	elif id == id_cancel
		SayMessage (OT_USER_BUFFER, cmsg366_L)
	EndIf
else ;In the advanced settings dialog:
	if id == ID_CameraRecognition_LightingCorrection_ComboBox
		SayMessage(OT_USER_BUFFER, cmsg_CameraRecognition_LightingCorrection_ComboBox_ScreenSensitiveHelp)
	elif id == id_ScannerRecognition_FriendlyName_ReadOnlyEdit
		SayMessage(OT_USER_BUFFER,cmsg_ScannerRecognition_AdvancedSettings_UserFriendlyName_ReadOnlyEdit_ScreenSensitiveHelp)
	elif id == id_ScannerRecognition_InterruptCurrentScanWhenCancelingRecognition_CheckBox
		SayMessage(OT_USER_BUFFER,cmsg_ScannerRecognition_AdvancedSettings_Interrupt_CheckBox_ScreenSensitiveHelp)
	elif id == id_ScannerRecognition_ContrastAdjustmentUsesBrightness_CheckBox
		SayMessage(OT_USER_BUFFER,cmsg_ScannerRecognition_AdvancedSettings_ContrastAdjustment_CheckBox_ScreenSensitiveHelp)
	elif id == id_ScannerRecognition_CloseTWAINAfterEachScan_CheckBox
		SayMessage(OT_USER_BUFFER,cmsg_ScannerRecognition_AdvancedSettings_CloseTwain_CheckBox_ScreenSensitiveHelp)
	elif id == id_ScannerRecognition_UseDuplexScanMode_CheckBox
		SayMessage(OT_USER_BUFFER,cmsg_ScannerRecognition_AdvancedSettings_UseDuplex_CheckBox_ScreenSensitiveHelp)
	elif id == id_ok
		SayMessage (OT_USER_BUFFER, cmsg365_L)
	elif id == id_cancel
		SayMessage (OT_USER_BUFFER, cmsg366_L)
	endIf
endIf
SayMessage (OT_USER_BUFFER, cscBufferNewLine+cMsgBuffExit)
endFunction

int function PlaceMarkerDialogActive()
var string sRealName = getWindowName (getRealWindow (getFocus ()))
if !inHjDialog () then Return FALSE endIf
return StringCompare(sRealName,cwn_PlaceMarker_List_dlg) == 0
	|| StringCompare(sRealName,cwn_Add_PlaceMarker_dlg) == 0
	|| StringCompare(sRealName,cwn_Change_PlaceMarker_dlg) == 0
	|| StringCompare(sRealName,cwn_PlaceMarker_RemoveAll_Warning_dlg) == 0
EndFunction

void function ScreenSensitiveHelpForPlaceMarkerDialog()
var
	handle hWnd = getCurrentWindow (),
	int iCtrl = GetControlID(hWnd)
if iCtrl == id_PlaceMarker_ListView
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_ListView)
elif iCtrl == id_PlaceMarker_Add_Button
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_Add_Button)
elif iCtrl == id_PlaceMarker_MoveTo_Button
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_MoveTo_Button)
elif iCtrl == id_PlaceMarker_Change_Button
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_Change_Button)
elif iCtrl == id_PlaceMarker_Remove_Button
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_Remove_Button)
elif iCtrl == id_PlaceMarker_RemoveAll_Button
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_RemoveAll_Button)
elif iCtrl == id_PlaceMarker_DisplayFor_All_RadioButton
|| iCtrl == id_PlaceMarker_DisplayFor_Domain_RadioButton
|| iCtrl == id_PlaceMarker_DisplayFor_URL_RadioButton
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_DisplayFor_RadioButtons)
elif iCtrl == id_PlaceMarker_Name_Edit
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_Name_Edit)
elif iCtrl == id_PlaceMarker_DefineForAllPages_Checkbox
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_DefineForAllPages_Checkbox)
elif iCtrl == id_PlaceMarker_AnchorToText_Checkbox
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_AnchorToText_Checkbox)
elif iCtrl == id_PlaceMarker_AnchorText_Edit
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_AnchorText_Edit)
elif iCtrl == id_PlaceMarker_OK_Button
	return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp_PlaceMarker_OK_Button)
endIf
ScreenSensitiveHelpForKnownClasses(getWindowSubtypeCode (hwnd))
EndFunction

void function ScreenSensitiveHelpForFlexibleWebDialog()
var
	handle hwnd,
	int iTypeCode,
	int iControl
let hwnd = getCurrentWindow ()
let iControl = GetControlID (hWnd)
let iTypeCode = getWindowSubtypeCode (hwnd)
if iTypecode == wt_RadioButton then
	if iControl == id_FlexibleWeb_CreateNew_RadioButton
	|| iControl == id_FlexibleWeb_Retry_RadioButton
	|| iControl == id_FlexibleWeb_SaveTemporary_RadioButton
	|| iControl == id_FlexibleWeb_Undo_RadioButton
	|| iControl == id_FlexibleWeb_ViewOrChange_RadioButton then
		return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpFlexibleWebWhatWouldYouLikeToDoRadioButtons)
	elif iControl == id_FlexibleWeb_HideElement_RadioButton
	|| iControl == id_FlexibleWeb_StartReadingAtElement_RadioButton then
		return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpFlexibleWebCreateRuleRadioButtons)
	EndIf
elif iTypecode == wt_CheckBox then
	if iControl == id_FlexibleWeb_Enable_CheckBox then
		return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpFlexibleWebEnableFlexibleWebCheckBox)
	EndIf
elif iTypecode == wt_ListBox then
	if iControl == id_FlexibleWeb_ElementsToCustomize_ListBox then
		return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpFlexibleWebCustomizeElementListBox)
	elif iControl == id_FlexibleWeb_SelectCustomization_ListBox then
		return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpFlexibleWebSelectCustomizationListBox)
	EndIf
elif iTypecode == wt_ListView then
	if iControl == id_FlexibleWeb_Rules_CheckableListView then
		return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpFlexibleWebSaveCustomizationsCheckableListView)
	elif iControl == id_FlexibleWeb_ViewOrChangeRules_ListView then
		return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpFlexibleWebViewOrChangeRulesList)
	EndIf
elif iTypecode == wt_ComboBox then
	if iControl == id_FlexibleWeb_ApplyThisRuleTo_ComboBox then
		return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpFlexibleWebSaveRuleAppliesToComboBox)
	EndIf
elif iTypecode == wt_Treeview then
	if iControl == id_FlexibleWeb_ViewOrChangeRules_Treeview then
		return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpFlexibleWebViewOrChangeRulesTreeview)
	EndIf
elif iTypecode == wt_Edit then
	if iControl == id_FlexibleWeb_RuleName_Edit then
		return ShowScreenSensitiveHelp(cmsgScreenSensitiveHelpFlexibleWebSaveRuleNameEdit)
	EndIf
EndIf
ScreenSensitiveHelpForKnownClasses(iTypecode)
EndFunction

void function ScreenSensitiveHelpForLinksListDialog()
var
	handle hWnd,
	int iType,
	int iCtrl,
	string SName
let hWnd = GetCurrentWindow()
let iType = GetWindowSubTypeCode(hWnd)
if iType == WT_LISTVIEW then
	SayMessage(ot_user_buffer,sshcmsg_LinksList_LinksList)
elif iType == WT_BUTTON then
	let iCtrl = GetControlID(hWnd)
	if iCtrl == iD_LinksList_MoveToLink then
		SayMessage (ot_user_buffer,sshcmsg_LinksList_MoveToLinkButton)
	elif iCtrl == ID_LinksList_ActivateLink then
		SayMessage (ot_user_buffer,sshcmsg_LinksList_ActivateLinkButton)
	elif iCtrl == ID_Cancel then
		SayMessage (ot_user_buffer,sshcmsg_LinksList_CancelButton)
	else
		ScreenSensitiveHelpForKnownClasses (WT_BUTTON)
	EndIf
elif iType == WT_RADIOBUTTON then
	let sName = GetGroupBoxName()
	if sName == scSortLinks then
		SayMessage (ot_user_buffer,sshcmsg_LinksList_SortLinks)
	elif sName == scDisplayLinks then
		SayMessage(ot_user_buffer,sshcmsg_LinksList_DisplayLinks)
	else
		ScreenSensitiveHelpForKnownClasses (WT_RADIOBUTTON)
	EndIf
else
	ScreenSensitiveHelpForKnownClasses(iType)
EndIf
EndFunction

void function ScreenSensitiveHelpForManageCallDialog()
var
	handle hWnd = GetCurrentWindow(),
	int iType = GetWindowSubTypeCode(hWnd),
	int iCtrl,
	string SName
if iType == WT_LISTVIEW
	SayMessage(ot_user_buffer,sshcmsg_ManageCall_AppList)
elif iType == WT_BUTTON
	iCtrl = GetControlID(hWnd)
	if iCtrl == iD_ManageCall_AcceptWithAudio
	|| iCtrl == ID_Ok
		SayMessage (ot_user_buffer,sshcmsg_ManageCall_AcceptWithAudioButton)
	elif iCtrl == ID_ManageCall_AcceptWithVideo
		SayMessage (ot_user_buffer,sshcmsg_ManageCall_AcceptWithVideoButton)
	elif iCtrl == ID_ManageCall_Decline
		SayMessage (ot_user_buffer,sshcmsg_ManageCall_DeclineButton)
	elif iCtrl == ID_ManageCall_HangUp
		SayMessage (ot_user_buffer,sshcmsg_ManageCall_HangUpButton)
	elif iCtrl == ID_ManageCall_MakePrimary
		SayMessage (ot_user_buffer,sshcmsg_ManageCall_MakePrimaryButton)
	elif iCtrl == ID_Cancel
		SayMessage (ot_user_buffer,sshcmsg_ManageCall_CancelButton)
	else
		ScreenSensitiveHelpForKnownClasses (WT_BUTTON)
	EndIf
else
	ScreenSensitiveHelpForKnownClasses(iType)
EndIf
EndFunction

void function ShowScreenSensitiveHelp(string sHelpMsg_L,optional  string sHelpMsg_S, int bOmitHotKeyLinks)
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if sHelpMSG_S then
	SayFormattedMessage(OT_USER_BUFFER,sHelpMsg_L,sHelpMSG_S)
else
	SayFormattedMessage(OT_USER_BUFFER,sHelpMsg_L)
EndIf

AddVisperoConnectedLink()

if bOmitHotKeyLinks then
	;HotKeyLinks are usually omitted if other text will be appended to this help text.
	return
EndIf
AddHotKeyLinks()
EndFunction

void function ShowScreenSensitiveHelpForVirtualRibbon(optional int bIsUpperRibbon)
if bIsUpperRibbon then
	ShowScreenSensitiveHelp(
		FormatString(cmsgScreenSensitiveHelpForVirtualUpperRibbon,
			cmsgScreenSensitiveHelpForVirtualRibbon_IntoParagraph,
			cmsgScreenSensitiveHelpForVirtualRibbon_LegacyMode))
else
	ShowScreenSensitiveHelp(
		FormatString(cmsgScreenSensitiveHelpForVirtualLowerRibbon,
			cmsgScreenSensitiveHelpForVirtualRibbon_IntoParagraph,
			cmsgScreenSensitiveHelpForVirtualRibbon_LegacyMode))
EndIf
EndFunction

int Function IsWinKeyHelp ()
var
	int iShouldHelp,
	int iTypeCode,
	handle hWnd,
	string sClass
Let hWnd = GetCurrentWindow ()
Let iTypeCode = GetWindowSubTypeCode (hWnd)
If iTypeCode == WT_TASKBAR ||
iTypeCode == WT_DESKTOP ||
GetWindowName (GetRealWindow (hWnd)) == cwn4 || ; Desktop RealName
iTypeCode == WT_STARTBUTTON ||
iTypeCode == WT_STARTMENU ||
iTypeCode == WT_SYSTRAY then
	Let iShouldHelp = TRUE
Else
	Let iShouldHelp = FALSE
EndIf
Return iShouldHelp
EndFunction

Script WindowKeysHelp ()
WindowKeysHelpDefault (Text_replaceUserBuffer)
EndScript

; List of some basic Windows keyboard commands
Void Function WindowKeysHelpDefault (optional int addToBuffer)
If addToBuffer == Text_ReplaceUserBuffer Then ;0
	If UserBufferIsActive() then
		UserBufferDeactivate()
	EndIf
	SayFormattedMessage (OT_USER_BUFFER, cmsgWindowKeysHelp1_L)
	UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
ElIf addToBuffer == Text_PrependToUserBuffer Then ;1
	If UserBufferIsActive() then
		UserBufferDeactivate()
	EndIf
	SayFormattedMessage (OT_USER_BUFFER, cmsgWindowKeysHelp1_L)
ElIf addToBuffer == Text_InsertInUserBuffer Then ;2
	UserBufferAddText(cmsgWindowKeysHelp1_L)
ElIf addToBuffer == Text_AppendToUserBuffer Then ;3
	UserBufferAddText(cmsgWindowKeysHelp1_L)
	UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
EndIf
EndFunction

Void Function CursorShapeChangedEvent (string CursorType)
let GlobalCursorType = CursorType
PerformScript SayCursorType ()
EndFunction

String Function ConvertCursorShape (string CursorType)
let GlobalCursorType = CursorType
If (GlobalCursorType == cscNormal) then
	SayUsingVoice (VCTX_MESSAGE, cmsg97_L, ot_status) ;"Arrow Cursor"
	Return
endIf
If (GlobalCursorType == cscEditCursor) then
	SayUsingVoice (VCTX_MESSAGE, cmsg98_L, ot_status) ;"I beam cursor"
	Return
endIf
If (GlobalCursorType ==cscWAIT) then
	SayUsingVoice (VCTX_MESSAGE, cmsg99_L, ot_status)
	Return
endIf
If (GlobalCursorType ==cscCROSS) then
	SayUsingVoice (VCTX_MESSAGE, cmsg100_L, ot_status) ;"cross hair cursor"
	Return
endIf
SayUsingVoice (VCTX_MESSAGE, GlobalCursorType, ot_status) ;"Cursor Changed"
EndFunction

Script SayCursorType()
convertCursorShape(getCursorShape())
EndScript

String function HotKeyHelpDefaultLoopHelper (handle hwnd, int iBool)
var
	handle hNull,
	int WinTypeCode,
	string sPrompt,
	string sHotKey,
	string sMessageLong,
	string sMessageShort,
	string strText,
	int FoundHotKey
While (hwnd != hNull)
	If (IsWindowVisible (hwnd)) then
	let WinTypeCode = GetWindowSubTypeCode (hwnd)
		If ((WinTypeCode == WT_BUTTON) ||
			(WinTypeCode == WT_STATIC) ||
			(WinTypeCode == WT_RADIOBUTTON) ||
			(WinTypeCode == WT_CHECKBOX) ||
			(WinTypeCode == WT_GROUPBOX) ||
			(WinTypeCode == WT_3STATE) ||
			(WinTypeCode == WT_TABCONTROL)) then
			let sHotKey = GetHotKey (hwnd)
			;cscNull =""
			if (sHotKey != cscNull) then
				if (FoundHotKey == 0) then
					if (iBool == true) then
						;SayFormattedMessage (OT_USER_BUFFER, cmsg101_L) ;"Hot keys are as follows"
						Let strText = FormatString (cmsg101_L, GetWindowName (GetRealWindow (GetFocus ())))+cScBufferNewLine
					endIf
					let FoundHotKey = 1
				endIf
				let sPrompt = GetWindowTextEx (hwnd, false, false)
				let strText = strText + FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_L, sPrompt, sHotKey)+cScBufferNewLine
				let sMessageShort = FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_S, sPrompt, sHotKey)
				;SayFormattedMessage (OT_USER_BUFFER, sMessageLong)
			endIf
		endIf ; condition for static text or button
	endIf ; Window visible
	let hwnd = GetNextWindow (hwnd)
EndWhile
If (FoundHotKey == 0) then
	;SayFormattedMessage (OT_USER_BUFFER, cmsg198_L);"unable to determine hot keys in this dialog"
	Let strText = strText + cmsg198_L
endIf
Return strText
EndFunction

Void Function HotKeyHelpDefaultLoop ()
var
	handle hwnd,
	handle hTemp,
	int iSpeakIntro,
	string strHotKeys
let hwnd = GetRealWindow (GetFocus ())
let hwnd = GetFirstChild (hwnd)
let iSpeakIntro = true
Let strHotKeys = cScNull;
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
If (IsMultiPageDialog ()) then
	let hTemp = GetFirstChild (hwnd)
	Let strHotKeys = strHotKeys+ HotKeyHelpDefaultLoopHelper (hTemp, iSpeakIntro)
	let iSpeakIntro = false
endIf
Let strHotKeys = strHotKeys + HotKeyHelpDefaultLoopHelper (hwnd, iSpeakIntro)
SayFormattedMessage (OT_USER_BUFFER, strHotKeys)
EndFunction

Void Function GeneralJAWSHotKeys ()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (OT_USER_BUFFER, cmsgHotKeyHelp1_L, cmsgHotKeyHelp1_S)
EndFunction

int Function JAWSHotKeys ()
if TouchNavigationHotKeys() then
	return true
endIf
if (IsSelectScriptDlg ()) then
	If UserBufferIsActive () then
		UserBufferDeactivate ()
	EndIf
	SayFormattedMessage (OT_USER_BUFFER, cMsg207)
	return TRUE
elif (IsSelectItemDlg ()) then
	If UserBufferIsActive () then
		UserBufferDeactivate ()
	EndIf
	SayFormattedMessage (OT_USER_BUFFER, cmsg212)
	return TRUE
endIf
return FALSE
EndFunction

; Insert H help messages
Script HotKeyHelp()
if !JAWSHotKeys() then
	GeneralJAWSHotKeys ()
endIf
EndScript

string function FindHotKey(optional string ByRef sPrompt)
var
	int nChildID,
	handle hWnd,
	int iType,
	string sHotKey,
	int iPrefixLength
let hwnd = GetCurrentWindow ()
if RibbonsActive() && ! IsVirtualRibbonActive() then
	sHotKey = stringTrimLeadingBlanks (stringTrimTrailingBlanks (getCurrentObject(nChildID).accHotKey(nChildID)))
	if ! stringIsBlank (sHotKey) then
		return sHotKey
	endIf
	; try accKeyboardShortcut.
	; This is for the BCGSoft lower ribbon.
	sHotKey = stringTrimLeadingBlanks (stringTrimTrailingBlanks (GetHotKey()))
	if ! stringIsBlank (sHotKey) then
		return sHotKey
	endIf
endIf
let sPrompt = cscNull
If GlobalMenuMode
&& !IsJavaWindow(hwnd) then
	let sHotKey = GetHotKey()
	if sHotKey then
		let iPrefixLength = StringLength(cksAltPlusHotKeyPrefixWithSpaces)
		if StringCompare(StringLeft(sHotKey,iPrefixLength),cksAltPlusHotKeyPrefixWithSpaces) == 0 then
			let sHotKey = StringChopLeft(sHotKey,iPrefixLength)
		else
			let iPrefixLength = StringLength(cksAltPlusHotKeyPrefix)
			if StringCompare(StringLeft(sHotKey,iPrefixLength),cksAltPlusHotKeyPrefix) == 0 then
				let sHotKey = StringChopLeft(sHotKey,iPrefixLength)
			EndIf
		EndIf
	elif (gbUseInferredAccessKeys)
		let sHotKey = getCharacter()
	EndIf
	Return sHotKey
endIf
let iType = GetObjectSubtypeCode()
If iType == WT_EDITCOMBO
|| iType == wt_combobox
|| iType == wt_spinbox
|| iType == wt_edit
|| iType == wt_listbox
|| iType == wt_scrollbar
|| iType == wt_slider
|| iType == wt_listview
|| iType == wt_treeview
|| iType == wt_multiselect_listbox
|| iType == wt_extendedselect_listbox
|| iType == wt_leftrightslider
|| iType == wt_updownslider
|| iType == wt_passwordedit
|| iType == wt_readonlyedit
|| iType == wt_edit_spinbox
|| iType == WT_MULTILINE_EDIT then
	let sHotKey = GetHotKey()
	If sHotKey then
		let sPrompt = GetWindowName (hwnd)
		return sHotKey
	EndIf
	let hwnd = GetPriorWindow (hwnd)
	let iType = GetWindowSubTypeCode (hwnd)
	if iType == wt_static
	|| iType == WT_GROUPBOX then
		let sHotKey = GetHotKey (hwnd)
		let sPrompt = GetWindowTextEx (hwnd, false, false)
		If !sHotKey then
			let hwnd = GetPriorWindow (hwnd)
			let iType = GetWindowSubTypeCode (hwnd)
			if iType == WT_GROUPBOX then
				let sHotKey = GetHotKey (hwnd)
			endIf
		endIf
	endIf
	if !sHotKey then
		let sPrompt = cscNull
	EndIf
	return sHotKey
ElIf iType == WT_BUTTON
|| iType == WT_RADIOBUTTON
|| iType == WT_CHECKBOX
|| iType == WT_GROUPBOX
|| iType == WT_3STATE
|| iType == WT_MENUBAR
|| iType == WT_MENU
|| iType == WT_TABCONTROL then
	let sHotKey = GetHotKey()
	let sPrompt = GetWindowTextEx (hwnd, false, false)
	If !sHotKey then
		if ! StringIsBlank (getGroupBoxName ()) then
			While (hwnd && getWindowSubtypeCode (hwnd) != WT_GROUPBOX)
				Let hwnd = getPriorWindow (hwnd)
 			endWhile
			Let sHotKey = getHotKey (hwnd)
		else
			let hwnd = GetPriorWindow (hwnd)
			let iType = GetWindowSubTypeCode (hwnd)
		endIf
		if iType == WT_GROUPBOX then
			let sHotKey = GetHotKey (hwnd)
		endIf
	endIf
	if !sHotKey then
		let sPrompt = cscNull
	EndIf
	return sHotKey
endIf
return sHotKey
EndFunction

Script SayCurrentAccessKey()
var
	string sHotKey,
	string sPrompt
let sHotKey = FindHotKey(sPrompt)
if sHotKey then
	SayMessage(ot_help,
		FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_L, sPrompt, sHotKey),
		FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_S, sPrompt, sHotKey))
else
	Say(cmsg124_L,ot_error) ;"no hot key"
EndIf
EndScript

Void Function MoveToFirstSdmControl ()
var
	int SDMControl,
	handle winhandle
let winhandle = GetRealWindow (GetFocus())
let SDMControl = SDMGetFirstControl (winhandle)
MoveToControl (winhandle, SDMControl)
let GlobalSDMControl = SDMControl
EndFunction

Void Function MoveToNextSdmControl ()
var
	int SDMControl,
	handle winhandle
let winhandle = GetRealWindow (GetFocus())
let SDMControl = SDMGetNextControl (GetCurrentWindow(), GlobalSDMControl)
MoveToControl (GetCurrentWindow(), SDMControl)
let GlobalSDMControl = SDMControl
EndFunction

;Copyright 1996-2017 by Freedom Scientific BLV Group, LLC

;default Script file for desk tops
; 2/12/95, added SDM windows, focus change & insert+f1 Scripts.
; 4/27, added PassKeyThrough
; & separated to use include file.
; added hjglobal.jmh header file
;and new Focus Change,8/8/95, th.


Script ScriptFileName()
ScriptAndAppNames(cmsg238_L) ;"default"
EndScript

string function GetActiveCursorRestrictionName(int MessageLengthType)
var
	int nRestriction
let nRestriction = GetRestriction()
if nRestriction == RestrictAppWindow
|| nRestriction == RestrictAppElement
	if MessageLengthType == message_short then
		return cmsg315_S
	EndIf
	return cmsg315_L
elif nRestriction == RestrictRealWindow then
	if MessageLengthType == message_short then
		return cMSG316_S
	EndIf
	return cMSG316_L
elif nRestriction == RestrictWindow then
	if MessageLengthType == message_short then
		return cMSG317_S
	EndIf
	return cMSG317_L
elif nRestriction == RestrictFocusWindow then
	if MessageLengthType == message_short then
		return cmsgRestrictFocusWindow_S
	EndIf
	return cmsgRestrictFocusWindow_L
elif nRestriction == RestrictNone then
	return cmsg318_L
elif nRestriction == RestrictRect then
	if MessageLengthType == message_short then
		return cMSG319_S
	EndIf
	return cMSG319_L
elif nRestriction == RestrictContainerElement
	if MessageLengthType == message_short then
		return cmsgContainerRestriction_S
	EndIf
	return cmsgContainerRestriction_L
elif nRestriction == RestrictElement
	if MessageLengthType == message_short then
		return cmsgElementRestriction_S
	EndIf
	return cmsgElementRestriction_L
endIf
return cscNull
EndFunction

void function SayRestrictionName(int nRestriction)
if nRestriction == RestrictAppWindow
|| nRestriction == RestrictAppElement
	SayMessage (OT_status, cmsg315_L, cmsg315_S) ;Application window restriction
elif nRestriction == RestrictRealWindow
	SayMessage (OT_status, cMSG316_L, cMSG316_S) ;"Real window restriction"
elif nRestriction == RestrictWindow
	SayMessage (OT_status, cmsg317_L, cmsg317_S) ;"Current window restriction"
elif nRestriction == RestrictFocusWindow
	SayMessage (OT_status, cmsgRestrictFocusWindow_L, cmsgRestrictFocusWindow_S)
elif nRestriction == RestrictNone
	SayMessage (OT_status, cmsg318_L) ;"unrestricted"
elif nRestriction == RestrictRect
	SayMessage (OT_status, cmsg319_L, cmsg319_S) ;"Frame restriction"
elif nRestriction == RestrictContainerElement
	SayMessage (OT_status, cmsgContainerRestriction_L, cmsgContainerRestriction_S) ;"Frame restriction"
elif nRestriction == RestrictElement
	SayMessage (OT_status, cmsgElementRestriction_L, cmsgElementRestriction_S) ;"Frame restriction"
endIf
EndFunction

string function GetButtonLockedNotification(int messageLengthType)
var
	string sMsg
if IsLeftButtonDown() then
	if MessageLengthType == message_short then
		let sMsg = cmsgLeftMouseButtonIsLocked_S
	else
		let sMsg = cmsgLeftMouseButtonIsLocked_L
	EndIf
endIf
If IsRightButtonDown() then
	if sMsg then
		let sMsg = sMsg+cScBufferNewLine
	endIf
	if MessageLengthType == message_short then
		let sMsg = sMsg+cmsgRightMouseButtonLocked_S
	else
		let sMsg = sMsg+cmsgRightMouseButtonLocked_L
	EndIf
endIf
if sMsg then
	let sMsg = sMsg+cScBufferNewLine
endIf
return sMsg
EndFunction

void function SayObjectNavigationCursor()
var
	int nRow,
	int nCol,
	int nPercent,
	string sPercent
BeginFlashMessage()
if IsTouchCursor() then
	sayMessage(OT_USER_REQUESTED_INFORMATION,cmsgTouchCursor_L,cmsgTouchCursor_L)
	if IsAdvancedObjectNavigationModeActive() then
		sayMessage(OT_USER_REQUESTED_INFORMATION,cmsgAdvancedObjectNavigationOn_L,cmsgAdvancedObjectNavigationOn_L)
	EndIf
	UIAGetPoint(nCol,nRow)
	sayMessage(OT_USER_REQUESTED_INFORMATION,
		FormatString(cmsgTouchElementClickablePoint,
			IntToString(nCol),IntToString(nRow)))
elif IsObjectTextReviewModeActive() then
	sayMessage(OT_USER_REQUESTED_INFORMATION,cmsgTouchTextReviewActive,cmsgTouchTextReviewActive)
	let nRow = getCursorRow()
	let nCol = GetCursorCol()
	let nPercent = GetDocumentPercentage()
	if nPercent >= 0 then
		let sPercent = FormatString(cmsgDocumentPercentage,intToString(nPercent))
	endIf
	sayMessage(OT_USER_REQUESTED_INFORMATION,
		FormatString(cmsgTouchTextReviewCursorPosition,
			IntToString(nCol), IntToString(nRow), sPercent))
EndIf
EndFlashMessage()
EndFunction

int function GetDocumentRowAndColumnForSayActiveCursor(int byRef nRow, int byRef nCol)
var
	string sTitle,
	string SPageName,
	string sPageNumber,
	string sTotalPages,
	string sLineNumber,
	string sCharacterPosition,
	string sColumnNumber,
	string sTotalColumns
if !GetDocumentProperties(sTitle, sPageName,
		sPageNumber, sTotalPages, sLineNumber,
		sCharacterPosition, sColumnNumber, sTotalColumns )
	return false
endIf
if !sLineNumber
	sLineNumber = "1"
EndIf
nRow = StringToInt (sLineNumber)
nCol = StringToInt (sCharacterPosition)
return true
EndFunction

string function GetDesiredCursorNameForScriptSayActiveCursor(string sActiveCursorName, int bWantExtendedInformation, int bIsAceOrFSDomEditArea, int isSmartNavActive)
if IsJawsUIACursor()
	return cmsgJawsScanCursor_L
elif IsInvisibleUIACursor()
	return cmsgInvisibleScanCursor_L
EndIf
if !bIsAceOrFSDomEditArea
	return sActiveCursorName
endIf
if !bWantExtendedInformation
	if IsFormsModeActive()
		return FormatString(cmsgFormsModeCursorInfo,cmsgPCCursorActive)
	ElIf sActiveCursorName == "FSDom Edit2 cursor"
		return cmsg9_l ;PC Cursor
	elif !isSmartNavActive
		return cmsgVirtualPCCursorActive
	else ;smart mode level will be announced, do not include cursor name:
		return cscNull
	EndIf
else ;Comment out this else block if you want the real internal name reported for the Ace cursor on double tap.
	;Here we are not allowing the real internal name to be reported for the Ace cursor:
	if StringStartsWith(sActiveCursorName ,cscAceCursorName)
		if IsFormsModeActive()
			return FormatString(cmsgFormsModeCursorInfo,cmsgPCCursorActive)
		else
			return cmsgVirtualPCCursorActive
		endIf
	endIf
EndIf
return sActiveCursorName
EndFunction

Script SayActiveCursor()
if IsObjectNavigationActive() then
	SayObjectNavigationCursor()
	return
endIf
var
	string sMessageShort,
	string sMessageLong
sMessageLong = GetButtonLockedNotification(message_long)
sMessageShort = GetButtonLockedNotification(message_short)
var
	string sRestrictionLong,
	string sRestrictionShort
if IsJAWSCursor()
|| IsInvisibleCursor() then
	sRestrictionLong = GetActiveCursorRestrictionName(message_long)
	sRestrictionShort = GetActiveCursorRestrictionName(message_short)
endIf
var
	int nPercent,
	string sPercent
if !IsFormsModeActive() then
	nPercent = GetDocumentPercentage()
	if nPercent >= 0 then
		sPercent = FormatString(cmsgDocumentPercentage,intToString(nPercent))
	endIf
EndIf
var
	string sActiveCursorName,
	string sDesiredCursorName,
	int bWantExtendedInformation,
	int bIsAceOrFSDomEditArea,
	int bSmartNavActive
sActiveCursorName = GetActiveCursorName()
bIsAceOrFSDomEditArea =
		(StringContains(sActiveCursorName,cscFSDomCursorName)
		|| StringStartsWith(sActiveCursorName ,cscAceCursorName))
bSmartNavActive = IsSmartNavActive()
bWantExtendedInformation = IsSameScript()
sDesiredCursorName = GetDesiredCursorNameForScriptSayActiveCursor(sActiveCursorName, bWantExtendedInformation, bIsAceOrFSDomEditArea, bSmartNavActive)
var
	int nRow,
	int nCol
nRow = getCursorRow()
nCol = GetCursorCol()
if IsUIAReviewCursor()
	var string sRect
	if bWantExtendedInformation
		sRect = FormatString(cmsgRect, "x1", "y1", "x2", "y2")
	endIf
	sMessageShort = sMessageShort
		+FormatString(cmsgActiveUIAReviewCursorInfo,
			sDesiredCursorName,
			intToString(nCol),
			intToString(nRow),
			sRestrictionShort,
			sRect)
	sMessageLong = sMessageLong
		+FormatString(cmsgActiveUIAReviewCursorInfo,
			sDesiredCursorName,
			intToString(nCol),
			intToString(nRow),
			sRestrictionLong,
			sRect)
	if bWantExtendedInformation
		EnsureNoUserBufferActive()
		if ShouldItemSpeak(ot_user_buffer) == message_short
			UserBufferAddText(sMessageShort)
		else
			UserBufferAddText(sMessageLong)
		endIf
		UserBufferActivate()
		JAWSTopOfFile()
		SayAll()
	else
		sayMessage(OT_USER_REQUESTED_INFORMATION,sMessageLong,sMessageShort)
	endIf
	return
endIf
var
	string insideApplicationRegion
if bIsAceOrFSDomEditArea
&& !bWantExtendedInformation
	GetDocumentRowAndColumnForSayActiveCursor(nRow,nCol)
	if (IsInsideARIAApplication ()) then
		insideApplicationRegion = cmsgInsideApplicationRegion
	EndIf
EndIf
sMessageLong = sMessageLong
	+formatString(cmsgActiveCursorInfo_L,
		sDesiredCursorName,
		intToString(nCol),
		intToString(nRow),
		sRestrictionLong,
		sPercent)
		+insideApplicationRegion
sMessageShort = sMessageShort
	+formatString(cmsgActiveCursorInfo_S,
		sDesiredCursorName,
		intToString(nCol),
		intToString(nRow),
		sRestrictionShort,
		sPercent)
		+insideApplicationRegion
; Indicate if Background OCR is enabled for this cursor at the moment.
if IsBackgroundOCREnabled() then
	sMessageLong = sMessageLong + cScBufferNewLine
	sMessageLong= sMessageLong + cmsgBackgroundOCRInProgress_L
	sMessageShort = sMessageShort + cScBufferNewLine
	sMessageShort = sMessageShort + cmsgBackgroundOCRInProgress_S
endIf

BeginFlashMessage ()
if bSmartNavActive
&& ! IsSameScript () then
	speakSmartNavLevelSetting()
endIf
sayMessage(OT_USER_REQUESTED_INFORMATION,sMessageLong,sMessageShort)
EndFlashMessage ()
EndScript

Script TetherJAWSToPC ()
var
	int iTetherOption,
	int iNewChoice
let iTetherOption = GetDefaultJCFOption (OPT_TETHER_JAWS_TO_PC)
If iTetherOption == 0 then
	let iNewChoice = (iTetherOption + 1)
Else
	let iNewChoice = 0
endIf
SetDefaultJCFOption (	OPT_TETHER_JAWS_TO_PC, iNewChoice)
If (iNewChoice == 0) then
	SayFormattedMessage (OT_STATUS, cmsgNoFollowPC1_L, cmsgNoFollowPC1_S); "The JAWS cursor will not follow the PC Cursor"
Else
	SayFormattedMessage (OT_STATUS, cmsgFollowPC1_L, cmsgFollowPC1_S); "The JAWS cursor will follow the PC Cursor"
endIf
If (IsSameScript ()) then
	; Make sure the setting the user last heard got saved
	; Thus letting the reset logic process first
	If (! IniWriteInteger (SECTION_OPTIONS, hKEY_TETHER, iNewChoice, DefaultJCFFile)) then
		SayFormattedMessage (OT_ERROR, cmsgSettingError1_L, cmsgSettingError1_S); "Error saving setting\bJAWS will not remember this setting next time you restart"
		Return
	endIf
	SayFormattedMessage (OT_JAWS_MESSAGE, cmsgSettingSaved1_L, cmsgSettingSaved1_S); "JAWS will remember this setting until you decide to re save it"
	Return
endIf
EndScript

Script RouteJAWSCursorToPc()
if IsObjectNavigationActive() then
	NotifyNotAvailableForTouchCursor()
	return
EndIf
If UserBufferIsActive () then
	SayFormattedMessage (ot_status, cmsgVirtualViewer)
	Return
EndIf
if IsInvisibleCursor ()
	RouteInvisibleToPc ()
	BrailleRefresh ()
	if IsInvisibleUIACursor()
		SayFormattedMessage (OT_STATUS, cmsgRouteInvisibleScanToPC_L, cmsgRouteInvisibleScanToPC_S)
	else
		SayFormattedMessage (OT_STATUS, cmsg146_L, cmsg146_S) ;"Route invisible to p c"
	endIf
	return
endIf
RouteJAWSToPc ()
JAWSCursor (true)
BrailleRefresh ()
if IsVirtualPCCursor ()
	if IsJawsUIACursor()
		SayFormattedMessage (OT_STATUS, cmsgRouteJAWSScanToVirtualPC_L, cmsgRouteJAWSScanToVirtualPC_S)
	else
		SayFormattedMessage (OT_STATUS, cMSG289_L, cMSG289_S)
	endIf
else
	if IsJawsUIACursor()
		SayFormattedMessage (OT_STATUS, cmsgRouteJAWSScanToPC_L, cmsgRouteJAWSScanToPC_S)
	else
		SayFormattedMessage (OT_STATUS, cmsg147_L, cmsg147_S) ;"Route JAWS to p c"
	endIf
endIf
EndScript

script RouteMouseToCursor()
if IsObjectNavigationActive() then
	NotifyNotAvailableForTouchCursor()
	return
EndIf
JAWSCursor()
RouteJAWSToPc()
PCCursor()
SayMessage(OT_STATUS,cmsgMouseToCursor_L,cmsgMouseToCursor_S)
EndScript

Script RoutePCCursorToJAWS()
if IsObjectNavigationActive() then
	NotifyNotAvailableForTouchCursor()
	return
EndIf
if IsVirtualPCCursor () then
	If UserBufferIsActive () then
		SayFormattedMessage (ot_status, cmsgVirtualViewer)
		Return
	EndIf
	RoutePcToJAWS()
	BrailleRefresh ()
	SayFormattedMessage(ot_status,cmsgVirtualToJAWS_l,cmsgVirtualToJAWS_s) ;"Route p c to JAWS"
	return
endIf
if IsInvisibleCursor () then
	RoutePCToInvisible ()
	BrailleRefresh ()
	SayFormattedMessage (ot_status, cmsg149_L, cmsg149_S) ;"Route p c to invisible"
else
	RoutePcToJAWS()
	BrailleRefresh ()
	SayFormattedMessage (ot_status, cmsg148_L, cmsg148_S) ;"Route p c to JAWS"
endIf
PCCursor()
EndScript

script RouteCursorToMouse()
if IsObjectNavigationActive() then
	NotifyNotAvailableForTouchCursor()
	return
EndIf
if IsVirtualPCCursor() then
	RouteVirtualToMouse ()
else
	JAWSCursor ()
	RoutePCToJaws()
	PCCursor()
	PCCursor()
endIf
SayMessage(ot_status,cmsgCursorToMouse_L,cmsgCursorToMouse_S)
EndScript

int Function ClickLastAlert ()
var
	int bJAWSCursor,
	int bClicked
If (! ghwndToolTip ||
! IsWindowVisible (ghwndToolTip)) then
	Return bClicked;
EndIf
Let bJAWSCursor = IsJAWSCursor ()
SaveCursor ()
If ! bJAWSCursor then
	JAWSCursor ()
	;Keep existing JAWSCursor location.
	SaveCursor ()
EndIf
MoveToWindow (ghwndToolTip)
If (ghwndToolTip == GetWindowAtPoint(GetCursorCol(),GetCursorRow())) then
	LeftMouseButton ()
	Let bClicked = TrUe
EndIf
RestoreCursor ()
If ! bJAWSCursor then
	RestoreCursor (); If was not JAWSCursor to start,
	;first restore put JAWSCursor / mouse back where it belonged.
	;This restore turns the PC or Invisible Cursor back on.
EndIf
Return bClicked;
EndFunction

script LeftMouseButton()
if IsObjectNavigationActive() then
	NotifyNotAvailableForTouchCursor()
	return
EndIf
SayMessage(ot_status,cmsg150_L,cmsg150_s)
If ClickLastAlert () then
	Return
EndIf
LeftMouseButton()
EndScript

Script  UtilityLeftMouseButton()
PerformScript LeftMouseButton()
EndScript

script RightMouseButton()
if IsObjectNavigationActive() then
	NotifyNotAvailableForTouchCursor()
	return
EndIf
SayFormattedMessage (ot_status, cmsg151_L, cmsg151_S) ;"right mouse button"
RightMouseButton()
EndScript

; toggle the pressed/released state of the left mouse button
script LeftMouseButtonLock()
if IsObjectNavigationActive() then
	NotifyNotAvailableForTouchCursor()
	return
EndIf
if LeftMouseButtonLock () then
	SayFormattedMessage (ot_status, cmsg152_L, cmsg152_S) ;"left button locked"
else
	SayFormattedMessage (ot_status, cmsg153_L, cmsg153_S) ;"Left button unlocked"
endIf
EndScript

Globals
	collection c_DragAndDropSource,
	collection c_DragAndDropDest
		; Members are:
		; x -- The X coordinate of the drag location
		; y -- The Y coordinate of the drag location
		; text -- The text at the drag location, probably obtained via GetWord if using OSM, or UIA name if using UIA
		; element -- If UIA is being used, The object at the drag location

void function GetDragAndDropCollectionData(collection dragItem)
var int x, int y
if IsObjectNavigationActive()
	;use the touch cursor object and its clickable point if it has one:
	UIAGetPoint(x,Y)
	dragItem.element = TouchCursorObject()
elif isWindows8()
	;We cannot depend on having an OSM,
	;so use the UIA focus object:
	var object element = CreateUIAFocusElement(true)
	element.GetClickablePoint(intRef(x),intRef(y))
	dragItem.element = element
endIf
if X && Y
	;the UIA element had a clickable point:
	dragItem.x = x
	dragItem.y = y
	dragItem.text = dragItem.element.name
	return
endIf
;either the touch cursor is not active,
;or a UIA point was not retrieved,
;so try to get the OSM cursor location:
dragItem.element = Null()
dragItem.x = getCursorCol ()
dragItem.y = getCursorRow ()
dragItem.text = GetWord ()
EndFunction

int function DoSetUpSourceForDragAndDrop()
if (c_DragAndDropSource.x) return false endIf
if (!c_DragAndDropSource) c_DragAndDropSource = new collection endIf
DragAndDropClearValues ()
GetDragAndDropCollectionData(c_DragAndDropSource)
var string sMessage = FormatString (cmsgSettingUpForDragAndDrop_L, GetCurrentScriptKeyName ())
SayFormattedMessage (ot_JAWS_message, sMessage, cmsg170_S)
return true
EndFunction

int function IsReadyToDragSourceToTarget()
if c_DragAndDropSource.element
&& c_DragAndDropDest.element
	;The touch cursor was used for setting both source and destination,
	;so make sure that source and destination are different elements,
	;and that the source is still at the original location:
	return !CompareUIAElements(c_DragAndDropSource.element,c_DragAndDropDest.element)
		&& CompareUIAElements(GetUIAElementAtPoint(c_DragAndDropSource.x,c_DragAndDropSource.y),c_DragAndDropSource.element)
elif c_DragAndDropSource.element
	;The touch cursor was used to set the source but not the destination,
	;so make sure that the destination location is not at the source element,
	;and that the source is still at the original location:
	return !CompareUIAElements(c_DragAndDropSource.element,GetUIAElementAtPoint(c_DragAndDropDest.x,c_DragAndDropDest.y))
		&& CompareUIAElements(GetUIAElementAtPoint(c_DragAndDropSource.x,c_DragAndDropSource.y),c_DragAndDropSource.element)
elif c_DragAndDropDest.element
	;The touch cursor was used to set the destination but not the source,
	return !CompareUIAElements(GetUIAElementAtPoint(c_DragAndDropSource.x,c_DragAndDropSource.y),c_DragAndDropDest.element)
endIf
;OSM was used, or touch cursor was used but failed to get any element at point:
var string strObject = GetWord()
return strObject
	&& strObject == c_DragAndDropSource.text
EndFunction

Script DragAndDrop()
if DoSetUpSourceForDragAndDrop() return endIf
if !c_DragAndDropDest c_DragAndDropDest = new collection endIf
GetDragAndDropCollectionData(c_DragAndDropDest)
SaveCursor ()
JAWSCursor ()
; make sure that the left mouse button is unlocked
If IsLeftButtonDown ()
	LeftMouseButtonLock ()
	pause ()
endIf
MoveTo (c_DragAndDropSource.x, c_DragAndDropSource.y)
Pause ()
if !IsReadyToDragSourceToTarget()
	DragAndDropClearValues ()
	SayFormattedMessage (ot_error, cmsg171_L, cmsg171_S) ; "Object to be dragged not found"
	return
endIf
LeftMouseButtonLock () ; lock it down
pause ()
MoveTo(c_DragAndDropDest.x,c_DragAndDropDest.y)
Pause ()
;cmsg172_L = "dragging "
var string sMessage = FormatString (cmsg172_L, c_DragAndDropSource.Text, c_DragAndDropDest.Text)
SayFormattedMessage (ot_JAWS_message, sMessage); dragging x to y
LeftMouseButtonLock ()
RestoreCursor ()
DragAndDropClearValues()
EndScript

void Function DragAndDropClearValues ()
CollectionRemoveAll(c_DragAndDropSource)
CollectionRemoveAll(c_DragAndDropDest)
EndFunction

; toggle the pressed/released state of the right mouse button
Script RightMouseButtonLock ()
if IsObjectNavigationActive() then
	NotifyNotAvailableForTouchCursor()
	return
EndIf
if RightMouseButtonLock () then
	SayFormattedMessage (ot_status, cmsg154_L, cmsg154_S) ;"right button locked"
else
	SayFormattedMessage (ot_status, cmsg155_L, cmsg155_S) ;"right button unlocked"
endIf
EndScript

Script SayTopLineOfWindow()
var
	int iVPC
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
If IsVirtualPcCursor () then
	If UserBufferIsActive () then
		SayFormattedMessage (ot_user_requested_information, cmsgVirtualViewer)
		Return
	EndIf
EndIf
SaveCursor()
InvisibleCursor()
MoveToWindow (GetFocus ())
JAWSPageUp()
Say (GetLine(), ot_user_requested_information);Ignore all attributes and font
RestoreCursor()
EndScript

string function GetBottomLineOfWindow()
var
	handle hWnd,
	string sWindowText,
	int iLeft,
	int iTop,
	int iRight,
	int iBottom,
	int iLast
if DialogActive() then
	let hWnd = GetRealWindow(GetFocus())
else
	let hWnd = GetAppMainWindow(GetFocus())
EndIf
GetWindowRect(hWnd,iLeft,iRight,iTop,iBottom)
let sWindowText = GetTextInRect(iLeft,iTop,iRight,iBottom,0,IgnoreColor,IgnoreColor,1,0)
if !sWindowText return cscNull endIf
let iLast = StringSegmentCount(sWindowText,"\n")
return StringSegment(sWindowText,"\n",iLast)
EndFunction

object function FindStatusBarUIAElement()
var object element = FSUIAGetElementFromHandle(GetForegroundWindow())
if !element return Null() endIf
var object condition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_StatusBarControlTypeId)
if !condition return Null() endIf
return element.FindFirst(TreeScope_Descendants,condition)
endFunction

string function GetStatusBarTextFromUIA ()
var object statusBar = FindStatusBarUIAElement()
if !statusBar return cscNull endIf
var object element = FSUIAGetFirstChildOfElement(statusBar)
if !element return cscNull endIf
var string text, string name
while element
	if element.controltype == UIA_TextControlTypeID
	&& element.name
		if text text = text+cscSpace endIf
		name = element.name
		text = text+name
	endIf
	element = FSUIAGetNextSiblingOfElement(element)
endWhile
return text
endFunction

script SayBottomLineOfWindow()
var	string sText
if IsMetroApp()
|| IsWPFApplication()
	sText = GetStatusBarTextFromUIA ()
else
	sText = GetBottomLineOfWindow()
endIf
if sText
	Say(sText,ot_user_requested_information)
endIf
EndScript

Script SayToCursor()
SetDocumentReadingStartLocation ()
If IsSameScript () then
	SpellToCursor ()
	Return
EndIf
SayToCursor()
EndScript

script SayFromCursor()
SetDocumentReadingStartLocation ()
If IsSameScript () then
	SpellFromCursor ()
	Return
EndIf
SayFromCursor()
EndScript

void Function SayLastTipFromEvent ()
If ghwndToolTip && IsWindowVisible (ghwndToolTip) then
	SayMessage (OT_USER_REQUESTED_INFORMATION, gStrLastTipFromEvent)
EndIf
EndFunction

int function IsTextAnalysisValid()
;Add condition where window subtype code is actually single-line where objects are multiline:
;This should fix dialogs and email header fields.
if getWindowSubtypeCode (getFocus ()) == WT_EDIT
	return FALSE; text analysis on single-lines is generally invalid.
endIf
return (GetObjectSubtypeCode() == wt_multiline_edit
	|| GetWindowSubtypeCode(GetFocus()) == wt_multiline_edit)
	&& !InHJDialog()
EndFunction

void function AnalyzeTextLine()
var
	int iSavedSetting
if !(GetRunningFSProducts() & product_JAWS)
|| !IsTextAnalysisValid() then
	return
EndIf
let iSavedSetting = GetJCFOption(OPT_TEXT_ANALYSER)
SetJCFOption(OPT_TEXT_ANALYSER,TextAnalyserDescribeAllInconsistencies)
PerformScript IndicateInconsistenciesForLine()
SetJCFOption(OPT_TEXT_ANALYSER,iSavedSetting)
EndFunction

void function SayFolderLocationForDialog ()
if ! dialogActive () then return endIf
var object element = FSUIAGetElementFromHandle (getRealWindow (getFocus ()))
if ! element then return endIf
var object ControlTypeCondition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyId, UIA_ToolBarControlTypeId)
var object AutomationIDCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyId, "1001")
var object searchCriteria = FSUIACreateAndCondition (ControlTypeCondition, AutomationIDCondition)
element = element.findFirst (TreeScope_Subtree, searchCriteria)
if ! element then return endIf
sayUsingVoice (vctx_message, element.name, OT_USER_REQUESTED_INFORMATION)
endFunction

void function SayWindowPromptAndTextPostProcess(handle hWnd, int iSubtype, int nTrainingMode, optional int ProcessFlags)
smmToggleTrainingMode(nTrainingMode)
if dialogActive () then
; open or Save As dialogs will read the toolbar describing location
	SayFolderLocationForDialog ()
endIf
if ProcessFlags & SayWindowPromptAndText_TutorialHelp then
	SayTutorialHelp(GetSubtypeCodeForTutorialHelp(hWnd), TRUE)
	SayTutorialHelpHotKey(hWnd,TRUE)
EndIf
if ProcessFlags & SayWindowPromptAndText_IndicateComputerBraille then
	IndicateComputerBraille(hwnd)
EndIf
if ProcessFlags & SayWindowPromptAndText_AnalyzeTextLine then
	AnalyzeTextLine()
EndIf
if ProcessFlags & SayWindowPromptAndText_SayLastTipFromEvent then
	SayLastTipFromEvent()
EndIf
if ProcessFlagS & SayWindowPromptAndText_SpeakProgressBarInfo then
	SpeakProgressBarInfo(TRUE)
EndIf
EndFunction

void function SayParentGroupboxForWindowPromptAndText()
if GetObjectSubTypeCode(FALSE,1) == WT_GROUPBOX then
	if !(GetObjectSubTypeCode() == WT_GROUPBOX
	&& StringContains(GetObjectName(),GetObjectName(false,1))) then
	   SayObjectTypeAndText (1)
	EndIf
EndIf
EndFunction

Script SayWindowPromptAndText()
var
	handle hWnd,
	int iSubType,
	int nMode
if handleNoCurrentWindow() then
	return
endIf
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If !iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
If UserBufferIsActive () then
	If !iSubType then
		SayFormattedMessage (ot_user_requested_information, cmsgVirtualViewer)
		Return
	EndIf
EndIf
let nMode = smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
;Any code in HandleCustomWindows should make both
;SayFocusedWindow and insert tab speak consistently.
If HandleCustomWindows (hWnd) then
	SayWindowPromptAndTextPostProcess(hWnd, iSubtype, nMode, SayWindowPromptAndText_AllProcesses)
	Return
EndIf
If IsVirtualPCCursor()
&& !IsJavaWindow(hWnd) then
	PerformScript VirtualSayWindowPromptAndText ()
	SayWindowPromptAndTextPostProcess(hWnd, iSubtype, nMode, SayWindowPromptAndText_SayLastTipFromEvent)
	Return
EndIf
If GlobalMenuMode
&& IsWinVista()
&& gstrListViewGroupName
&& iSubType == WT_LISTVIEW then
	;Customize List Views,
	;Windows Vista Start Menu:
	SayMessage (OT_CONTROL_TYPE, cmsg4_L);Start menu.
	SayMessage (OT_CONTROL_NAME, GetObjectName ())
	SayMessage (OT_SCREEN_MESSAGE, FormatString (cmsgListGroupName, gstrListViewGroupName))
	SayMessage (OT_POSITION, PositionInGroup ())
	SayWindowPromptAndTextPostProcess(hWnd, iSubtype, nMode,
		SayWindowPromptAndText_TutorialHelp | SayWindowPromptAndText_SpeakProgressBarInfo)
	Return
EndIf
SayParentGroupboxForWindowPromptAndText()
if ( GetObjectSubTypeCode(SOURCE_CACHED_DATA) == wt_groupbox
&& GetObjectSubTypeCode(SOURCE_CACHED_DATA, 1 ) == wt_listview )
	SayControlEx( 0, GetObjectName(SOURCE_CACHED_DATA), cmsgGrouping );
	return;
EndIf
SayObjectTypeAndText ()
SayWindowPromptAndTextPostProcess(hWnd, iSubtype, nMode, SayWindowPromptAndText_AllProcesses)
EndScript

void Function Unknown (string TheName, int IsScript, optional int IsDueToRecursion)
var
	string sCallStack
if StringIsBlank (TheName) then return endIf
if IsDueToRecursion return endIf
if (HandleDeprecatedFunction(TheName)) then
	return
EndIf
TheName = StringLower (TheName)
If StringContains(TheName,"willoverwriteclipboard") != 0
|| StringContains(TheName,"pointneedsmarking") != 0
|| StringContains(TheName, "magsetfocus") != 0
|| StringContains(TheName, "getlinerect") != 0
|| StringContains(theName,"brailleaddobject") != 0
|| StringContains(TheName,"wdapp_") != 0
;in MAGic if trying to launch QuickSettings dialog right after closing,
;but the dialog has not yet gone away, press very quickly to make happen.
|| stringContains(TheName, "adjustmagicoptions") != 0
|| stringContains(TheName, "quicksettings") !=0
|| StringContains(TheName,cfn_establishquicknavstate)!=0 ;When some apps, like MS Word, gains focus you may get unknown function due to timing
|| StringContains(TheName, "postcomment") != 0
|| StringContains(TheName, "listcolumn") != 0
|| StringContains(TheName, "listrow") != 0
|| StringContains(TheName, "frameloadedevent") != 0
|| StringContains(TheName, "checkforskypealerts") > 0
|| StringContains(TheName, "destroyoldskypealerts") > 0
|| StringContains(TheName, "ismessageslist") != 0
|| StringContains(TheName,"clearfocuschangemenuglobals")
|| StringContains(TheName, "getdocumenttitle")
	return
endIf
;unknown function call notification suppression should be done for debug purposes only:
if IsSuppressingUnknownFunctionCallNotification() then
	return
EndIf
;only save the names of function we haven't planned for:
SaveLastUnknownFunctionName(TheName,IsScript)
if IsScript
&& (InHJDialog()
|| GetAppFileName()=="JFW.exe") then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
elIf ShouldShowUnknownFunctionCallStack()
&& TheName > cScNull then
	let sCallStack = GetScriptCallStack()
	UserBufferDeactivate()
	UserBufferClear()
	if IsScript then
		UserBufferAddText(FormatString(cmsgErr_UnknownScriptCallWithStackOutput,TheName,
			StringReplaceChars(sCallStack,"\t","\n")))
	else
		UserBufferAddText(FormatString(cmsgErr_UnknownFunctionCallWithStackOutput,TheName,
			StringReplaceChars(sCallStack,"\t","\n")))
	EndIf
	UserBufferAddText(cmsgClose,"UserBufferDeactivate()",cmsgClose)
	UserBufferActivate()
	JAWSTopOfFile()
	SayLine()
else
	if IsScript then
		SayMessage(ot_error, FormatString(cmsgErr_UnknownScriptCall,TheName))
		SayUsingVoice(VCTX_MESSAGE, TheName, OT_SPELL)
	else
		If TheName > cScNull then
			SayMessage(ot_error, FormatString(cmsgErr_UnknownFunctionCall,TheName))
			SayUsingVoice(VCTX_MESSAGE, TheName, OT_SPELL)
		EndIf
	EndIf
endIf
EndFunction

string function GetMostRecentFunctionNameFromCallStack()
var
	string sStack = GetScriptCallStack(),
	int iCallCount = StringSegmentCount (sStack, "\n"),
	string sCall,
	int i
for i = 2 to iCallCount
	sCall = StringTrimTrailingBlanks (StringSegment (sStack, "\n", i))
	sCall = StringSegment (sCall, TAB_SEPARATOR, -1)
	if StringSegment (sCall, cscSpace, 1) == "function"
		sCall = StringSegment (sCall, cscSpace, 2)
		sCall = StringSegment (sCall, "(", 1)
		return sCall
	endIf
endFor
return cscNull
endFunction

;*************************
;     Utility Scripts         *
;*************************

Script UtilityTestKeys()
ToggleDiagnosticTestKeyState()
EndScript

script UtilitySayMenuMode()
SayMenuMode()
EndScript

script UtilityShowLastUnknownFunctionName()
ShowLastUnknownFunctionName()
EndScript

script UtilityToggleShowUnknownFunctionCallStack()
ToggleShowUnknownFunctionCallStack()
EndScript

script UtilityToggleSuppressUnknownFunctionCallNotification()
ToggleSuppressUnknownFunctionCallNotification()
EndScript

script UtilitySayCurrentMSAAMode()
SayCurrentMSAAMode()
EndScript

script UtilityTreeCapture()
UtilityTreeCapture()
EndScript

script UtilityNodeCapture()
UtilityNodeCapture()
EndScript

script UtilityShowUIATopObjectTreeInfo()
ShowUIATopObjectTreeInfo()
EndScript

script UtilityShowUIAFocusParentObjectTreeInfo()
ShowUIAFocusParentObjectTreeInfo()
EndScript

script UtilityShowUIAFocusObjectTreeInfo()
ShowUIAFocusObjectTreeInfo()
EndScript

script UtilityShowUIAObjectFocusInfo()
ShowUIAObjectFocusInfo()
EndScript

script UtilityShowUIAObjectFocusAncestorsInfo()
ShowUIAObjectFocusAncestorsInfo()
EndScript

script UtilityToggleUIAObjectBrowserMode()
UtilityToggleUIAObjectBrowserMode()
EndScript

script UtilityShowSDMControls()
UtilityShowSDMControls()
EndScript

script UtilityToggleUseMSAA()
UtilityToggleUseMSAA()
EndScript

script UtilityShowObjectHierarchyInfo()
UtilityShowObjectHierarchyInfo()
EndScript

script UtilityShowObjectList()
UtilityShowObjectList()
EndScript

script UtilityShowObjectListInfoByName()
UtilityShowObjectListInfoByName()
EndScript

script UtilityShowCachedMSAAFocusInfo()
UtilityShowCachedMSAAFocusInfo(false)
EndScript

script UtilityShowCachedMSAAFocusInfoEx()
UtilityShowCachedMSAAFocusInfo(true)
EndScript

script UtilityShowCachedAltFocusInfo()
UtilityShowCachedAltFocusInfo()
EndScript

script UtilityToggleXMLDomDocBrowserMode()
UtilityToggleXMLDomDocBrowserMode()
EndScript

Script UtilityDumpEntireOSM ()
Say (cmsgDumpingOSM, OT_STATUS)
DumpEntireOSM ()
EndScript

Script UtilityDumpScreenOSM ()
Say (cmsgDumpingOSM, OT_STATUS)
DumpOSMWindow ()
EndScript

script HomeRowToggle()
if !(GetRunningFSProducts() & product_JAWS) then
	If isSpeechOff() then
		return
	elif !IsScriptingEditionAuthorized() then
		SayMessage(ot_error,cmsg_ScriptUtilityModeNotAuthorized)
		return
	EndIf
EndIf
HomeRowToggle()
EndScript

script MouseMovementDefault()
MouseMovementDefault()
EndScript

Script MouseMovementDecrement ()
MouseMovementDecrement ()
EndScript

script MouseMovementIncrement()
MouseMovementIncrement()
EndScript

Script SayMouseAndAnsiSettings()
SayMouseAndAnsiSettings()
EndScript

script UtilityHelp()
;{homerow + insert+ h}
SayFormattedMessage (ot_help, cmsgUtilityHotKeys1_L, cmsgUtilityHotKeys1_S)
EndScript

; Find the next requested attribute after the caret
Script UtilityInitializeHomeRowPosition ()
;HomeRow+F5
UtilityInitializeHomeRowPosition()
EndScript

Script UtilityToggleSpeakWindowVisibility ()
UtilityToggleSpeakWindowVisibility()
EndScript

Script UtilitySpeakWindowVisibility ()
UtilitySpeakWindowVisibility()
EndScript

script UtilityToggleNotifyIfWinFormsClass()
UtilityToggleNotifyIfWinFormsClass()
EndScript

script UtilityNextAttribute()
;{homerow+grave accent}
UtilityNextAttribute()
EndScript

; Find the prior requested attribute before the caret
script UtilityPriorAttribute()
;{homerow+shift+grave accent}
UtilityPriorAttribute()
EndScript

; Find the first requested attribute
script UtilityFindFirstAttribute()
;{homerow + control + grave accent}
UtilityFindFirstAttribute()
EndScript

; Find the last requested attribute
script UtilityFindLastAttribute()
;{homerow + shift+control + grave accent}
UtilityFindLastAttribute()
EndScript

; produces the requested ouput on the current window
script UtilitySayInfoAccess()
;{homerow+f1}
UtilitySayInfoAccess()
EndScript

Script UtilitySayMSAAObjectInfoAccess ()
;{homerow+f9}
UtilitySayMSAAObjectInfoAccess()
EndScript

script UtilityPutInfoInBox()
;{homerow + Insert + f1}
UtilityPutInfoInBox()
EndScript

Script UtilityPutMSAAObjectInfoInBox ()
;{homerow + Insert + f9}
UtilityPutMSAAObjectInfoInBox()
EndScript

script UtilityMoveToNextWindow()
UtilityMoveToNextWindow()
EndScript

script UtilityMoveToPriorWindow()
UtilityMoveToPriorWindow()
EndScript

script UtilityMoveToLastWindow()
UtilityMoveToLastWindow()
EndScript

script UtilityMoveToFirstWindow()
UtilityMoveToFirstWindow()
EndScript


;Move down one level
script UtilityMoveToChild()
;{homerow+f2}
UtilityMoveToChild()
EndScript

;Move up one level
script UtilityMoveToParent()
;{homerow+shift+f2}
UtilityMoveToParent()
EndScript

;Adjust UT_OutputMode
Script UtilitySetOutputMode()
;{homerow+f3}
UtilitySetOutputMode()
EndScript

Script UtilitySetOutputModeReverseOrder()
;{Homerow+Shift+F3}
UtilitySetOutputModeReverseOrder()
EndScript

script UtilityJumpToOutputMode()
;{homerow+control+f3}
UtilityJumpToOutputMode()
EndScript

script UtilityJumpToOutputModeReverseOrder()
;{homerow+control+shift+f3}
UtilityJumpToOutputModeReverseOrder()
EndScript


Script UtilitySayOutputMode()
UtilitySayOutputMode()
EndScript

Script UtilitySetMSAAObjectOutputMode ()
;{homerow+f10}
UtilitySetMSAAObjectOutputMode ()
EndScript

Script UtilitySetMSAAObjectOutputModeReverseOrder ()
;{Homerow+Shift+F10}
UtilitySetMSAAObjectOutputModeReverseOrder ()
EndScript

Script UtilitySayMSAAObjectOutputMode ()
;HomeRow+F12
UtilitySayMSAAObjectOutputMode ()
EndScript

;Adjust UT_FontMode
script UtilitySetFontMode()
;{homerow+f4}
UtilitySetFontMode()
EndScript

Script UtilityCopyInfo ()
;HomeRow+Control+F1
UtilityCopyInfo ()
EndScript

Script UtilityCopyMSAAObjectInfo ()
;HomeRow+Control+F9
UtilityCopyMSAAObjectInfo ()
EndScript

Script UtilitySayWindow ()
UtilitySayWindow ()
EndScript

Script UtilityResetOutputMode ()
UtilityResetOutputMode ()
EndScript

Script UtilitySayWindowPromptAndText ()
UtilitySayWindowPromptAndText ()
EndScript

Script UtilityRouteJAWSCursorToPc ()
UtilityRouteJAWSCursorToPc ()
EndScript

Script UtilityWindowClassReassign ()
UtilityWindowClassReassign ()
EndScript

Script AnsiCharsDecrement ()
UtilityAnsiCharsDecrement ()
EndScript

Script SetAnsiCharsIncrement ()
UtilityAnsiCharsIncrement ()
EndScript

Script UtilityToggleSpeakingOfDebugMessages()
ToggleSpeakingOfDebugMessages()
EndScript

Script UtilityChangeDebugLevel()
ChangeDebugLevel()
EndScript

;***End of Utility scripts

script SayFrame(string FrameName)
SayFrame (FrameName)
EndScript

script SayFrameAtCursor()
SayFrameAtCursor ()
EndScript

Void Function ScriptAndAppNames (string sFileName)
var
	string sMessageShort,
	string sMessageLong,
	string sUserBuffer,
	string sApp,
	string activeConfiguration = GetActiveConfiguration (TRUE)
if stringIsBlank (activeConfiguration) then
; not a web specific script
	activeConfiguration = GetActiveConfiguration ()
endIf
	if IsMetroApp() then
		let sApp = GetMetroAppName()
	EndIf
	if (!sApp) then
		let sApp = GetAppFileName ()
	EndIf
	If UserBufferIsActive ()then
		SayFormattedMessage (ot_user_requested_information, cMsgVirtualViewerSettings)
		Return
	EndIf
	If IsSameScript () then
		If bWereCustomSettingsLoaded then
			Let sUserBuffer = msgPagePersonalized + cScPeriod + cScBufferNewLine
		EndIf
		Let sUserBuffer = sUserBuffer + (FormatString (cmsgSettingsInformation, sFileName, sApp, activeConfiguration, GetCurrentSchemeName ()))
		SayMessage (OT_USER_BUFFER, sUserBuffer)
		AddHotKeyLinks ()
		Return
	EndIf
	let sMessageLong = FormatString (cmsg145_L, sFileName, sApp, GetSpellString (sApp))
	let sMessageShort = FormatString (cmsg145_S, sFileName, sApp, GetSpellString (sApp))
	SayFormattedMessage (ot_user_requested_information, sMessageLong, sMessageShort)
	SpeakPersonalizeSettings()
EndFunction

Script ClearValues()
FrameClearValues ()
DragAndDropClearValues ()
BrailleSelectTextClearValues ()
SayFormattedMessage (ot_status, cmsg185_L, cmsg185_S) ; "Values Cleared"
EndScript

;**********************************
;     Extended Key Scripts  *
;**********************************

script SayNextCharacterPCCursor()
If ( ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC)) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript SayNextCharacter()
EndScript

script SayPriorCharacterPCCursor()
If ( ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC)) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript SayPriorCharacter()
EndScript

script SayNextLinePCCursor()
If ( ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC)) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript SayNextLine()
EndScript

script SayPriorLinePCCursor()
If !GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript SayPriorLine()
EndScript

script SayNextWordPCCursor()
If ( ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC)) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript SayNextWord()
EndScript

script SayPriorWordPCCursor()
If ( ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC)) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript SayPriorWord()
EndScript

script ControlDownArrowPCCursor()
If ( ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC)) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript ControlDownArrow()
EndScript

script ControlUpArrowPCCursor()
If ( ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC)) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript ControlUpArrow()
EndScript

Script JAWSHomePcCursor ()
If ( ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC)) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript JAWSHome ()
EndScript

Script JAWSEndPcCursor ()
If ( ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC)) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript JAWSEnd ()
EndScript

Script JAWSPageUpPcCursor ()
If ( ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC)) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript JAWSPageUp ()
EndScript


Script JAWSPageDownPcCursor ()
If ( ! GetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC)) then
	SaveCursor ()
endIf
PcCursor ()
PerformScript JAWSPageDown ()
EndScript




;*************************
;     Braille Scripts         *
;*************************

Script BrailleToggleMode (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SetActiveBrailleMode ()
EndScript

Script BrailleGrade2Translation (optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SetBrailleGradeTwoMode ()
EndScript

Script ChangeContractedBrailleSetting (optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SayBrailleContractedState(ToggleBrailleContractedState())
EndScript

Script BrailleGrade2ExpandCurrentWord (optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SetBrailleExpandCurrentWord ()
EndScript

Script BrailleMovesActive (optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SetBrailleMovesActive ()
EndScript

Script ActiveMovesBraille (optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
; Determins wether or not the braille display follows the active cursor
SetActiveMovesBraille ()
EndScript

Script BrailleToggleSpeechInterrupt (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SetBrailleSpeechInterrupt ()
EndScript

Script BrailleToggleCharactersAndAttributes(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SetBrailleCharactersOrAttributes ()
EndScript

Script BrailleTab(optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
;If is Virtual Pc Cursur, suppress echo of highlighted Text:
Let nLastSelectUnitTime = (GetTickCount()*IsVirtualPCCursor())
BrailleTabKey ()
EndScript

Script BrailleShiftTab (optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
;If is Virtual Pc Cursur, suppress echo of highlighted Text:
Let nLastSelectUnitTime = (GetTickCount()*IsVirtualPCCursor())
BrailleShiftTabKey ()
EndScript

Script BrailleEnter(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleEnterKey ()
EndScript

Script BrailleEscape(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleEscapeKey ()
EndScript

Script BrailleToggleCursor(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
; Toggle between the JAWS and PC cursor
if (IsPCCursor ()) then
	PerformScript JAWSCursor ()
else
	PerformScript PCCursor ()
endIf
EndScript

Script BrailleAltTab (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleAltTabKey ()
EndScript

Script BraillePriorLine (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleNavPriorLine ()
EndScript

Script BrailleNextLine (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleNavNextLine ()
EndScript

Script BraillePanLeft(optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
; If there is more text to the left on the current line, display it.
; If not, display the final segment of the previous line.
BrailleNavPanLeft ()
EndScript

Script BraillePanRight (optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
; If there is more text on the current line, then display it.
; Otherwise, display the first segment of the next line.
BrailleNavPanRight ()
EndScript

Script BrailleMoveLeft (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleNavMoveLeft ()
EndScript

Script BrailleMoveRight (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleNavMoveRight ()
EndScript

Script BrailleToggle8PixelsPerSpace ()
BrailleSet8OrUnlimitedPixels ()
EndScript

Script BrailleRouting()
if DoBrailleRoutingPriorityAction() return endIf
var int nCell = GetLastBrailleRoutingKey ()
BrailleRoutingButton(nCell)
DoBrailleRoutingClickAfterAction()
EndScript

int Function BrailleBuildLine ()
;Note this is only here for backward compatibility.
;JAWS 4.0 no longer uses it but it will still be called before other Braille
;functions. If this function returns true then the new functionality will not
;be used.
return false
EndFunction

Script BrailleTop (optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
if not BrailleIsStructuredLine () || IsVirtualPCCursor() then
	SaveCursor ()
	BrailleCursor ()
	RouteBrailleToPC ()
	JAWSPageUp ()
	JAWSHome ()
	SayFormattedMessage (ot_JAWS_message, cmsg44_L, cmsg44_S) ; "top of window"
elif not BrailleIsMessageBeingShown() then
; if a message is being shown, Braille panning always returns TRUE
;otherwise if it didn't you'd dismiss a message if you panned too far
	while (BraillePanLeft ())
	EndWhile
	SayFormattedMessage (ot_JAWS_message, cmsg220_L, cmsg220_S) ; "Beginning of line"
endIf
EndScript

Script BrailleBottom (optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
if not BrailleIsStructuredLine () || IsVirtualPCCursor() then
	SaveCursor ()
	BrailleCursor ()
	RouteBrailleToPC ()
	JAWSPageDown ()
	JAWSEnd ()
	SayFormattedMessage (ot_JAWS_message, cmsg45_L, cmsg45_S) ; "bottom of window"
elif not BrailleIsMessageBeingShown() then
; if a message is being shown, Braille panning always returns TRUE
;otherwise if it didn't you'd dismiss a message if you panned too far
	while (BraillePanright ())
	EndWhile
	SayFormattedMessage (ot_JAWS_message, cmsg221_L, cmsg221_S) ; "End of line"
endIf
EndScript

Script BrailleSet8PixelsPerSpace(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SetBraille8PixelsPerSpace ()
EndScript

Script BrailleSetUnlimittedPixelsPerSpace(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SetBrailleUnlimitedPixelsPerSpace ()
EndScript

Script BrailleToggleMarking(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
ShowBrailleMarkingOptions()
EndScript

script BrailleTurnMarkingOff(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
TurnOffBrailleMarking ()
EndScript

script BrailleDescribeFont(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleDescribeFontAtCursor ()
EndScript

script BrailleToggle8Dots(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
Set6Or8Dots ()
EndScript

script BrailleSet6Dots(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SetSixDotBraille ()
EndScript

Script BrailleSet8Dots(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SetEightDotBraille ()
EndScript

Script RouteBrailleToPC (optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
RouteBrailleToPC ()
EndScript

Script RouteBrailleToJAWS (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
RouteBrailleToJAWS ()
EndScript

Script RouteBrailleToActiveCursor (optional int index)
var
	int ActiveCursor
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
let activeCursor = GetActiveCursor ()
if (ActiveCursor == cursor_JAWS) then
	RouteBrailleToJAWS ()
ElIf (ActiveCursor == cursor_pc) then
	RouteBrailleToPC ()
endIf
EndScript

Script BrailleSelectText (int index)
;This also uses Selection by routing button, so one should probably not use it as an upper navRow by itself.
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SelectTextWithBraille ()
EndScript

script BrailleControlLeftMouseClick(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleControlLeftMouseClick()
endScript

Script BrailleToggleSpeechHistory(int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
ToggleSpeechHistoryMode ()
EndScript

Script BrailleToggleBrailleLineMode (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleSetToLineMode ()
EndScript

Script BrailleDescribeItem (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleDescribeItemAtCursor ()
EndScript

Script BrailleRightMouseClick (int index)
;not especially a good idea to assign to anything that's not a (lower) routing button in combo with something else,
;since LastRoutingKey is used to determine where we are to click.
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
; for touch cursor right click:
if IsTouchCursor() then
	TouchRightClick()
	return
endIf
RightClickWithBraille ()
EndScript

Script BrailleChangeCursorShape (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
ToggleShapeOfCursors ()
EndScript

Script BrailleLineCursorShapeOff (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleToggleCursorBlinking ()
EndScript

; The following set of scripts are intended for Papenmeier  Braille Displays

;  Announcement for Switches and Toggles

Script FHPBraille2DTogglePCMode ()
	FHPBraille2DTogglePCMode ()
EndScript

Script FHPBraille2DToggleReadingMode ()
	FHPBraille2DToggleReadingMode ()
EndScript

Script FHPBrailleKeyPCMode ()
	FHPBrailleKeyPCMode ()
EndScript

Script FHPBrailleKeyNavigationMode ()
	FHPBrailleKeyNavigationMode ()
EndScript

Script FHPBrailleKeyReadingMode ()
	FHPBrailleKeyReadingMode ()
EndScript

Script FHPBrailleKeySpeechMode ()
	FHPBrailleKeySpeechMode ()
EndScript

Script FHPBrailleKeyBrailleMode ()
	FHPBrailleKeyBrailleMode ()
EndScript

Script FHPBrailleKeyBrailleSpeechMode ()
	FHPBrailleKeyBrailleSpeechMode ()
EndScript


; PC key simulation
; Braillex EL right switch in rear position = PC Mode
script FHPcursorup()

	FHPcursorup()
EndScript

script FHPcursordown()
	FHPcursordown()
EndScript

script FHPcursorright()
	FHPcursorright()
EndScript

script FHPcursorleft()
	FHPcursorleft()
EndScript

Script FHPBrailleTab()
	FHPBrailleTab()
EndScript

Script FHPBrailleShiftTab()
	FHPBrailleShiftTab()
EndScript

Script FHPBrailleEscape()
	FHPBrailleEscape()
EndScript

Script FHPBrailleEnter()
	FHPBrailleEnter()
EndScript


; Navigation Mode
; Braillex EL right switch in central position
Script FHPBraillePriorLine()
	FHPBraillePriorLine()
EndScript

Script FHPBrailleNextLine()
	FHPBrailleNextLine()
EndScript

Script FHPBraillePanLeft()
	FHPBraillePanLeft()
EndScript

Script FHPBraillePanRight()
	FHPBraillePanRight()
EndScript


; Combined Mode
; Braillex EL right key in front position
Script FHPBrailleSpeechPriorLine ()
	FHPBrailleSpeechPriorLine ()
EndScript

Script FHPBrailleSpeechNextLine ()
	FHPBrailleSpeechNextLine ()
EndScript

Script FHPBrailleSpeechPanLeft()
	FHPBrailleSpeechPanLeft()
EndScript

Script FHPBrailleSpeechPanRight()
	FHPBrailleSpeechPanRight()
EndScript


; routing
;
Script FHPRouting()
	FHPRouting()
EndScript

Script FHPLineRouting()
	FHPLineRouting()
EndScript

Script FHPRoutingAux ()
	FHPRoutingAux ()
EndScript

; Attribute handling
;
Script FHPBrailleTurnMarkingOff()
	FHPBrailleTurnMarkingOff()
EndScript

Script FHPBrailleShowBoldMarking()
	FHPBrailleShowBoldMarking()
EndScript

Script FHPBrailleShowHighlightMarking()
	FHPBrailleShowHighlightMarking()
EndScript

Script FHPBrailleShowItalicMarking()
	FHPBrailleShowItalicMarking()
EndScript

Script FHPBrailleShowUnderlineMarking()
	FHPBrailleShowUnderlineMarking()
EndScript

Script FHPBrailleShowAllMarking ()

	FHPBrailleShowAllMarking ()
EndScript

Script FHPBrailleToggleCharactersAndAttributes ()
	FHPBrailleToggleCharactersAndAttributes ()
EndScript

Script FHPBrailleToggleAttributeUp ()
	FHPBrailleToggleAttributeUp ()
EndScript

Script FHPBrailleToggleAttributeDown ()
	FHPBrailleToggleAttributeDown ()
EndScript

;
;
Script FHPBrailleShowWindowsTop ()
	FHPBrailleShowWindowsTop ()
EndScript

Script FHPBrailleShowWindowsBottom ()
	FHPBrailleShowWindowsBottom ()
EndScript

Script FHPBrailleToggle68Dots ()
	FHPBrailleToggle68Dots ()
EndScript

Script FHPToggleCursorMode ()
	FHPToggleCursorMode ()
EndScript

Script FHPBrailleToggleCursorShape ()
	FHPBrailleToggleCursorShape ()
EndScript

Script FHPBrailleActiveCursorTracking ()
	FHPBrailleActiveCursorTracking ()
EndScript

Script FHPBrailleSelectText ()
	FHPBrailleSelectText ()
EndScript

Script FHPBrailleToggleVertical ()
	FHPBrailleToggleVertical ()
EndScript

Script FHPBrailleLineMode ()
	FHPBrailleLineMode ()
EndScript

Script FHPBrailleStructuredMode ()
	FHPBrailleStructuredMode ()
EndScript

Script FHPActivateTaskList ()
	FHPActivateTaskList ()
EndScript

Script FHPBrailleManager ()
	FHPBrailleManager ()
EndScript

Script FHP_RunJAWSManager ()
	FHP_RunJAWSManager ()
EndScript

; scripts for new Braillex EL slimline series

Script FHPAttributSettings  ()
	ScheduleFunction("FHPAttributSettings",3)
EndScript

Script FHPBrailleSettings ()
	ScheduleFunction("FHPBrailleSettings",3)
EndScript

Script FHPWorkingMode ()
	ScheduleFunction("FHPWorkingMode",3)
EndScript

Script FHPBraillexEL1R ()
	FHPBraillexEL1R ()
EndScript

Script FHPBraillexEL1L ()
	FHPBraillexEL1L ()
EndScript

Script FHPBraillexEL1U ()
	FHPBraillexEL1U ()
EndScript

Script FHPBraillexEL1D ()
	FHPBraillexEL1D ()
EndScript

Script FHPBraillexEl2R ()
	FHPBraillexEl2R ()
EndScript

Script FHPBraillexEl2L ()
	FHPBraillexEL2L ()
EndScript

Script FHPBraillexEL2D ()
	FHPBraillexEL2D ()
EndScript

Script FHPBraillexEL2U ()
	FHPBraillexEL2U ()
EndScript

; dummy scripts for further extension

Script FHPBrailleActiveMovesBraille ()
	FHPBrailleActiveMovesBraille ()
EndScript

Script FHPBrailleFuncLURU ()
	FHPBrailleFuncLURU ()
EndScript

Script FHPBrailleFuncLURD ()
	FHPBrailleFuncLURD ()
EndScript

Script FHPBrailleFuncLDRU ()
	FHPBrailleFuncLDRU ()
EndScript

Script FHPBrailleFuncLDRD ()
	FHPBrailleFuncLDRD ()
EndScript

; dummy scripts for braille split mode

Script FHPBrailleSplitMode ()
	FHPBrailleSplitMode ()
EndScript

Script FHPBrailleSplitToggleSide ()
	FHPBrailleSplitToggleSide ()
EndScript

Script FHPBrailleSplitPriorLine ()
	FHPBrailleSplitPriorLine ()
EndScript

Script FHPBrailleSplitNextLine ()
	FHPBrailleSplitNextLine ()
EndScript

Script FHPBrailleSplitPanLeft ()
	FHPBrailleSplitPanLeft ()
EndScript

Script FHPBrailleSplitPanRight ()
	FHPBrailleSplitPanRight ()
EndScript

; EndPapenmeier


;*******

Script KeyboardHelp()
if GetRunningFSProducts() & product_MAGic
&& IsSpeechOff() then
	return
EndIf
let gbKeyboardHelp = true
if !c_KeyboardHelpData then
	let c_KeyboardHelpData = new collection
EndIf
; save and set to infinite prior to speaking the keyboard help on msg
let c_KeyboardHelpData.SavedBrlMessagesMode = GetJcfOption(OPT_BRL_MESSAGES)
let c_KeyboardHelpData.SavedMessageTime=GetJCFOption(OPT_BRL_MESSAGE_TIME)
let c_KeyboardHelpData.SavedTypingEcho = GetJCFOption(OPT_TYPING_ECHO)
Let c_KeyboardHelpData.SavePunctuation = GetJcfOption (OPT_PUNCTUATION)
;c_KeyboardHelpData.lastGestureTickCount is used in GestureEvent to detect continuous gestures,
;so that the gesture is not repeatedly announced while the gesture continues:
let c_KeyboardHelpData.lastGestureTickCount = 0
SetJcfOption(OPT_BRL_MESSAGES,1) ;make sure that braille will flash the keyboard help messages
setJCFOption(OPT_BRL_MESSAGE_TIME,0) ;so keyboard help stays on the display
SayFormattedMessage (ot_status, cmsg167_L, cmsg_on) ; "Keyboard Help on"
SetJcfOption(OPT_TYPING_ECHO,1) ; echo characters
SetJcfOption (OPT_PUNCTUATION, 1); Almost no punctuation spoken but normal inflection
AddHook (HK_SCRIPT, "KeyboardHelpHook")
; ignore any keys not attached to scripts
TrapKeys(TRUE)
CaptureAllGestures(TRUE)
EndScript

void function SpeakKeyboardHelp()
let c_KeyboardHelpData.TimerSchedule = 0
var int isSODActive = (IsSpeechOff() && getJCFOption(OPT_LESS_SPEECH) == 0)
if (isSODActive) JAWSSpeechOnDemandOn() endIf
if c_KeyboardHelpData.HelpType == KeyboardHelpType_Name then
	Say(c_KeyboardHelpData.HelpMessage,ot_user_requested_information)
	SpellString(c_KeyboardHelpData.HelpMessage)
ElIf c_KeyboardHelpData.HelpType == KeyboardHelpType_Synopsis then
	BeginFlashMessage()
	SetJcfOption(OPT_PUNCTUATION,3) ;we want all punctuation when speaking the keystroke
	Say(c_KeyboardHelpData.KeyName,ot_user_requested_information)
	SetJcfOption(OPT_PUNCTUATION,1)
	Say(c_KeyboardHelpData.HelpMessage,ot_user_requested_information)
	EndFlashMessage()
ElIf c_KeyboardHelpData.HelpType == KeyboardHelpType_Description then
	if IsKeystrokeReserved (c_KeyboardHelpData.KeyName) then
		SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, cmsgReservedWebAppKeysDescriptionKeyboardHelp)
	else
		Say(c_KeyboardHelpData.HelpMessage,ot_user_requested_information)
	endIf
elif c_KeyboardHelpData.HelpType == KeyboardHelpType_Gesture
	StopSpeech()
	BeginFlashMessage()
	Say(c_KeyboardHelpData.KeyName,ot_user_requested_information)
	Say(c_KeyboardHelpData.HelpMessage,ot_user_requested_information)
	EndFlashMessage()
EndIf
if (isSODActive) JAWSSpeechOnDemandOff() endIf
EndFunction

void function LookupKeyboardHelpMessage()
var
	string sKey,
	string sText,
	string sFrameName,
	string sScriptName,
	string sCmd,
	string sHelpMessage
sFrameName = c_KeyboardHelpData.FrameName
sScriptName = c_KeyboardHelpData.ScriptName
sCmd = c_KeyboardHelpData.Cmd
if c_KeyboardHelpData.HelpType == KeyboardHelpType_Gesture
	c_KeyboardHelpData.KeyName = GetGestureLabel(GetCurrentScriptKeyName())
	sHelpMessage = GetScriptSynopsis(sScriptName)
elif c_KeyboardHelpData.HelpType >= KeyboardHelpType_Name then
	c_KeyboardHelpData.HelpType = KeyboardHelpType_Name
	if sFrameName then
		sHelpMessage = c_KeyboardHelpData.FrameName
	else ;script name
		sHelpMessage = sScriptName
	EndIf
ElIf c_KeyboardHelpData.HelpType == KeyboardHelpType_Description then
	if sFrameName
	&& GetFrameDescription (sFrameName) then
		sHelpMessage = FormatString (cmsg173_L,GetFrameDescription (sFrameName))
	else
		sHelpMessage = GetScriptDescription(sScriptName)
	endIf
else ;first press of keystroke
	;The tandem keys are mapped internally,
	;so we must explicitly set the key name if it is a tandem key:
	if GetRunningFSProducts() & product_JAWS then
		if sScriptName == StartOrEndTandemSessionScript then
			sKey = StartOrEndTandemSessionKey
		elif sScriptName == ToggleTandemModeScript then
			sKey = ToggleTandemModeKey
		elif sScriptName == PauseTandemVideoScript then
			sKey = PauseTandemVideoKey
   	EndIf
	endIf
  if sScriptName == LaunchWindowsShortcutScript then
      sText = KeyboardHelp_LaunchWindowsShortcut(sFrameName)
      sKey = GetCurrentScriptKeyName()
  elif sScriptName == WindowsCmdScript then
      sText = KeyboardHelp_WindowsCmd(sCmd)
      sKey = GetCurrentScriptKeyName()
	else
		;make sure we don't step on sKey assignments from earlier in this block:
		if !sKey
			sKey = GetCurrentScriptKeyName()
		endIf
	EndIf
	c_KeyboardHelpData.KeyName = ReformatKeyName(sKey)
	if sText then
    sHelpMessage = sText
	else
    if sFrameName then
	    sHelpMessage = FormatString (cmsg174_L, c_KeyboardHelpData.FrameName)
			    +cscSpace
			    +GetFrameSynopsis (sFrameName)
    else
	    sHelpMessage = GetScriptSynopsis(sScriptName)
    endIf
	endIf
endIf
if IsKeystrokeReserved  (sKey) then
	let sHelpMessage = GetKeyboardHelpForReservedKey (sKey)
endIf
let c_KeyboardHelpData.HelpMessage = sHelpMessage
EndFunction

void function SetKeyboardHelpScriptNameData(string ScriptName, string FrameName)
let c_KeyboardHelpData.Cmd = FrameName
; When scripts have numerical arguments, this is mistaken for frame names.
; This converts the script numerical argument to an integer, checks that it is a valid integer,
; then nulls the frame name argument if it is a script parameter.
let c_KeyboardHelpData.FrameNumber = StringToInt(FrameName)
If (c_KeyboardHelpData.FrameNumber == 0 && GetCharacterValue(FrameName)==48)
|| c_KeyboardHelpData.FrameNumber > 0 Then
	let FrameName=cscNull
EndIf
let c_KeyboardHelpData.FrameName = FrameName
let c_KeyboardHelpData.ScriptName = ScriptName
EndFunction

void function UnhookKeyboardHelp()
let gbKeyboardHelp = false
;restore flash message time so that flash messages don't display indefinitely
setJCFOption(OPT_BRL_MESSAGE_TIME,c_KeyboardHelpData.SavedMessageTime)
var int isSODActive = (IsSpeechOff() && getJCFOption(OPT_LESS_SPEECH) == 0)
if (isSODActive) JAWSSpeechOnDemandOn() endIf
SayMessage (ot_status, cmsg168_L, cmsg_off) ; "Keyboard Help off"
if (isSODActive) JAWSSpeechOnDemandOff() endIf
RemoveHook (HK_SCRIPT, "KeyboardHelpHook")
TrapKeys(FALSE)
CaptureAllGestures(FALSE)
SetJcfOption(OPT_TYPING_ECHO,c_KeyboardHelpData.SavedTypingEcho)
SetJcfOption (OPT_PUNCTUATION, c_KeyboardHelpData.SavePunctuation)
SetJcfOption(OPT_BRL_MESSAGES,c_KeyboardHelpData.SavedBrlMessagesMode)
CollectionRemoveAll(c_KeyboardHelpData)
BrailleRefresh()
EndFunction

Void Function KeyboardHelpHook (string ScriptName, string FrameName)
if c_KeyboardHelpData.TimerSchedule then
	UnscheduleFunction(c_KeyboardHelpData.TimerSchedule)
	let c_KeyboardHelpData.TimerSchedule = 0
EndIf
if ScriptName == "BXBuildModifyer" then
	PerformScript BXBuildModifyer()
	return
ElIf ScriptName == "BXBuildFKeyModifyer" then
	PerformScript BXBuildFKeyModifyer()
	return
EndIf
if ScriptName == "KeyboardHelp" then
	UnhookKeyboardHelp()
	return FALSE
endIf
if StringContains(ScriptName,"BraillePan")
&& !StringContains(ScriptName,"BySegment") then
	return TRUE; allow to run so message can be panned
endIf
;Split Braille case
if StringContains(ScriptName,"HWThum") && BrailleCanPanLinesIndependently() then
	return TRUE; allow to run so message can be panned
endIf
; Non-split Braille case.
if ScriptName=="HWThum2" || ScriptName=="HWThum3" then
	return TRUE; allow to run so message can be panned
endIf

if StringContains(ScriptName,"BXBuildModifyer")
|| StringContains(ScriptName,"BXBuildFKeyModifyer") then
	return true ;allow the BX modifyer to build
EndIf
SetKeyboardHelpScriptNameData(ScriptName,FrameName)
if CurrentScriptWasInvokedByGesture()
	c_KeyboardHelpData.HelpType = KeyboardHelpType_Gesture
else
	c_KeyboardHelpData.HelpType = IsSameScript ()+1
endIf
LookupKeyboardHelpMessage()
if ScriptName == "UpALevel"
	SpeakKeyboardHelp()
	UnhookKeyboardHelp()
	return FALSE
endIf
let c_KeyboardHelpData.TimerSchedule = ScheduleFunction("SpeakKeyboardHelp",2)
; by returning  FALSE, a hook function can prevent a script from being run
return FALSE
EndFunction

Int Function RoutePCToInvisible ()
var
	int Row,
	int Column,
	int nSuccess
InvisibleCursor()
let Row = getCursorRow ()
let Column = getCursorCol ()
PCCursor()
let nSuccess = MoveTo (Column, Row)
return nSuccess
EndFunction

string function GetFocusedApplicationVersionInfo ()
; largely unchanged from SayAppVersionScript,
; this function is now just to return the focused app info,
; so Voice Assistant can use it in two new scripts as well.
var
	string sProduct,
	string sVersion,
	string sMessage,
	string sNavModule
	if IsMetroApp() then
		let sProduct = GetMetroAppName()
		let sVersion = GetMetroAppVersion()
	EndIf
	; Some apps like explorer return true for IsMetroApp but don't use the Metro naming/versioning scheme.
	; That's why the standard way of getting the version is not in an else block of the Metro branch
	;but instead is done unconditionally if no name has already been retrieved.
	if (!sProduct) then
		let sProduct = GetVersionInfoString (GetAppFilePath (), cmsg282_L)
		let sVersion = GetVersionInfoString (GetAppFilePath (), cmsg283_L)
	EndIf
	let sMessage = FormatString (cmsg239_L, sProduct, sVersion)
	let sNavModule = GetNavModuleVersionInfo(GetCurrentWindow())
	; May need to work on some translation here.  Presently,
	; the string is passed back by the actual NavModule and is
	; not subject to translation.
	if (sNavModule != "") then
		let sMessage = sMessage + "\n"
		let sMessage = sMessage + GetNavModuleVersionInfo ((GetCurrentWindow()))
	endIf
	return sMessage
endFunction

string function GetJAWSVersionInfo ()
var string JAWSVersionInfoString, string JAWSPath = FindJAWSUtilityProgram ("jfw.exe")
JAWSVersionInfoString = GetVersionInfoString (JAWSPath, cmsg283_L)
return formatString (cmsgJAWSVersion, JAWSVersionInfoString)
endFunction

string function getZoomTextVersionInfo ()
if ! (getRunningFSProducts () & (Product_Fusion | product_ZoomText)) then return cscNull endIf
var string ZTVersionString, string ZtAppObjName = "Zoomtext.application"
var object zt = CreateObjectEx (ZtAppObjName, FALSE)
if ! ZT then return cscNull endIf
var handle ztWindow = zt.WindowHandle()
if ! ztWindow then return cscNull endIf
var string Path = getWindowOwner (ztWindow)
ZTVersionString = GetVersionInfoString (path, cmsg283_L)
ZTVersionString = formatString (cmsgZoomTextVersion, ZTVersionString)
ZT = null ()
return ZTVersionString
endFunction

string function GetFusionVersionInfo()
if ! (getRunningFSProducts() & Product_Fusion) then return cscNull endIf
return FormatString (cmsgFusionVersion, GetFusionVersion())
endFunction

string function GetMAGicVersionInfo ()
if ! GetRunningFSProducts () & product_MAGic then return cscNull endIf
var handle window = findTopLevelWindow (cwc_MAGICUI, "")
if ! window then return cscNull endIf
var string path = getWindowOwner (window)
var string MAGicVersionInfoString = GetVersionInfoString (path, cmsg283_L)
return formatString (cmsgMAGicVersion, MAGicVersionInfoString)
endFunction

string function GetActiveConfigurationInfo ()
var
	string ConfigDetails,
	string app,
	string activeConfiguration = GetActiveConfiguration (TRUE),
	string settings
if stringIsBlank (activeConfiguration) then
; not a web specific script
	activeConfiguration = GetActiveConfiguration ()
endIf
settings = FileNameList (activeConfiguration+".*")
settings = StringTrimLeadingBlanks (StringTrimTrailingBlanks (settings))
if stringIsBlank (settings) then
	settings = cmsg238_L
else
	settings = stringSegment (settings, LIST_ITEM_SEPARATOR, 1)
endIf
if IsMetroApp() then
	app = GetMetroAppName()
EndIf
if ! app then
	app = GetAppFileName ()
EndIf
If UserBufferIsActive ()then
	return cMsgVirtualViewerSettings
EndIf
ConfigDetails = FormatString (cmsgActiveConfigurationInfo, settings, app, activeConfiguration, GetCurrentSchemeName ())
If bWereCustomSettingsLoaded then
	ConfigDetails = ConfigDetails+cScBufferNewLine+msgPagePersonalized + cScPeriod
EndIf
Return ConfigDetails
endFunction

string function GetSystemType ()
var string systemType

if IsSystemX64 () then
	systemType = Architecture_x64
elIf IsSystemARM64 () then
	systemType = Architecture_arm64
endIf

return systemType
endFunction

string function GetOSVersionInfo ()
var string Path = "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion"
var string winVersion
;if isWindows12 () then
	; winVersion = "12"
if isWindows11 () then
	winVersion = "11"
elIf IsWindows10 () then
	winVersion = "10"
elIf IsWindows8 () then
	winVersion = "8"
else
	winVersion = "7"
endIf
var int CurrentMajorVersionNumber = GetRegistryEntryDword (2, path, "CurrentMajorVersionNumber")
var int CurrentMinorVersionNumber = GetRegistryEntryDword (2, path, "CurrentMinorVersionNumber")
var string OSVersion = formatString ("%1.%2", CurrentMajorVersionNumber, CurrentMinorVersionNumber)
var string CurrentBuildNumber = GetRegistryEntryString (2, path, "CurrentBuild")
var string DisplayVersion = GetRegistryEntryString (2, path, "DisplayVersion")
var string ProductVersion = GetRegistryEntryString (2, path, "CurrentVersion")
var string EditionID  = GetRegistryEntryString (2, path, "EditionID")
var int RevisionNumber
var string build
var string SystemType = GetSystemType ()
if IsWindows10 ()
	RevisionNumber = GetRegistryEntryDword (2, path, "UBR");Update Build Revision
	return formatString (cmsgMicrosoftWindows10AndHigherVersionTemplate,
	winVersion, DisplayVersion, RevisionNumber, EditionID, CurrentBuildNumber, SystemType)
else
	RevisionNumber = GetRegistryEntryDword (2, path, "BaseBuildRevisionNumber")
	build = formatString ("%1.%2", CurrentBuildNumber, RevisionNumber)
	return formatString (cmsgMicrosoftWindowsVersionTemplate,
	winVersion, DisplayVersion, build, EditionID, OSVersion)
endIf
endFunction

string function GetExtendedVersionDetailsInfo ()
var string VersionDetails = cmsgVersionDetails
var string JAWSVersionInfo = GetJAWSVersionInfo ()
var int scriptsRevision = GetScriptsRevision()
var string ZoomTextVersionInfo = GetZoomTextVersionInfo ()
var string fusionVersionInfo = GetFusionVersionInfo()
var string MAGicVersionInfo = GetMAGicVersionInfo ()
var string applicationVersionInfo = GetFocusedApplicationVersionInfo ()
var string ActiveConfigurationInfo = GetActiveConfigurationInfo ()
var string OSVersionInfo  = GetOSVersionInfo ()
if ! stringIsBlank (applicationVersionInfo)then
	versionDetails = versionDetails + cscBufferNewLine + applicationVersionInfo
endIf
if ! stringIsBlank (JAWSVersionInfo) then
	versionDetails = versionDetails + cscBufferNewLine + JAWSVersionInfo
endIf
if (scriptsRevision > 0) then
	var string revisionInfo = FormatString(cmsgScriptsRevision, IntToString(scriptsRevision))
	versionDetails = versionDetails + cscBufferNewLine + revisionInfo
endIf
if ! stringIsBlank (MAGicVersionInfo) then
	versionDetails = versionDetails + cscBufferNewLine + MAGicVersionInfo
endIf
if ! stringIsBlank (ZoomTextVersionInfo) then
	versionDetails = versionDetails + cscBufferNewLine + ZoomTextVersionInfo
endIf
if ! stringIsBlank (fusionVersionInfo) then
	versionDetails = versionDetails + cscBufferNewLine + fusionVersionInfo
endIf
if ! stringIsBlank (ActiveConfigurationInfo) then
	versionDetails = versionDetails + cscBufferNewLine + ActiveConfigurationInfo
endIf
if ! stringIsBlank (OSVersionInfo) then
	versionDetails = versionDetails + cscBufferNewLine + OSVersionInfo
endIf
return versionDetails
endFunction

script PutVersionDetailsOnClipboard ()
copyToClipboard (GetExtendedVersionDetailsInfo ())
sayMessage (OT_STATUS, cmsgVersionDetailsCopiedToClipboard)
endScript

script ShowVersionDetails ()
UserBufferClear ()
SayMessage (OT_USER_BUFFER, GetExtendedVersionDetailsInfo ())
endScript

Script SayAppVersion ()
if IsSameScript() then
	PerformScript ShowVersionDetails ()
	return
endIf
var string message = GetFocusedApplicationVersionInfo ()
SayFormattedMessage (ot_help, message)
EndScript

Script SayProgramComments ()
SayFormattedMessage (ot_help, GetVersionInfoString (GetAppFilePath (), cmsg284_L))
EndScript

Void Function RestrictCursor (int nStatus)
if (nStatus == on) then
	SetRestriction(RestrictWindow)
else
	SetRestriction(RestrictAppWindow)
endIf
EndFunction

void function SayWindows7TaskBar ()
var
	handle hWnd,
	string sTaskBarText
let hWnd = FindTopLevelWindow(cwcShellTray,cscNull)
if !hWnd then
	SayFormattedMessage (OT_error, cmsg190_L, cmsg190_S) ; "Task bar is not visible"
	return
EndIf
let hWnd = FindWindow(hWnd,cwc_MSTaskListWClass)
if !hWnd then
	SayFormattedMessage (OT_error, cmsg190_L, cmsg190_S) ; "Task bar is not visible"
	return
EndIf
let sTaskBarText = GetListOfObjects (hWnd)
if !sTaskBarText then
	SayFormattedMessageWithVoice(VCTX_Message, OT_ERROR, cMsgTaskBarEmpty_l, cMsgTaskBarEmpty_s)
else
	Say(sTaskBarText,ot_line)
EndIf
EndFunction
Script SayTaskBar ()
var
	handle hWnd
if IsWindows7() then
	SayWindows7TaskBar ()
	return
EndIf
let hWnd = FindTopLevelWindow (cwcShellTray, cscNull)
let hWnd = GetFirstChild(hWnd)
if (hWnd) then
	while (hWnd && GetWindowClass (hWnd) != cwcMSTask)
		if GetWindowClass (hWnd) == cwcRebarWnd then ; Win_98
			let hWnd = GetFirstChild(hWnd)
		else
			let hWnd = GetNextWindow(hWnd)
		endIf
	EndWhile
	let hWnd = GetFirstChild(hWnd)
	If GetWindowText(hWnd,Read_Everything)==cscNull Then
		; The task bar is empty...
		SayFormattedMessageWithVoice(VCTX_Message, OT_ERROR, cMsgTaskBarEmpty_l, cMsgTaskBarEmpty_s)
		Return
	EndIf
	If GetWindowClass(hWnd) == cwcNewStartMenu
	&& !IsWindowObscured(hWnd)  Then ; Windows XP class for the Taskbar.
		SayWindow(hWnd, READ_EVERYTHING)
		return
	EndIf
	while (hWnd && GetWindowClass (hWnd) != cwcSysTabCtrl32)
		let hWnd = GetNextWindow(hWnd)
	EndWhile
	if (GetWindowClass(hWnd) == cwcSysTabCtrl32 && !IsWindowObscured (hWnd)) then
		SayWindow(hWnd, READ_EVERYTHING)
		return
	endIf
endIf
SayFormattedMessage (OT_error, cmsg190_L, cmsg190_S) ; "Task bar is not visible"
EndScript

Script SaySystemTray ()
var
	handle hWnd
let hWnd = FindTopLevelWindow (cwcShellTray, cscNull)
let hWnd = FindDescendantWindow (hWnd, 303)
if (hWnd) then
	SayWindow(hWnd, READ_EVERYTHING)
else
	SayFormattedMessage (ot_error, cmsg191_L, cmsg191_S) ; "system tray is not visible"
endIf
EndScript

String Function IntToAttribName (int attrib)
if (attrib == attrib_bold) then
	return cmsg139_L ;"Bold"
endIf
if (attrib == attrib_italic) then
	return cmsg140_L ;"Italic"
endIf
if (attrib == attrib_underline) then
	return cmsg141_L ;"Underline"
endIf
if (attrib == attrib_highlight) then
	return cmsg142_L ;"Highlight"
endIf
if (attrib == attrib_strikeout) then
	return cmsg143_L ;"Strikeout"
endIf
if (attrib == attrib_graphic) then
	return cmsg144_L ;"Graphic"
endIf
return cscNull

EndFunction

Void Function AttributesChanged (int attributes, int attributesFound)
var
	int attrib
if attributes == 1 then ; this is normal text
	if attributesFound >= ATTRIB_BOLD then
		SayUsingVoice (VCTX_MESSAGE, cmsg244_L, ot_help) ;" Normal "
	endIf
	return
endIf
let attrib = attrib_bold
while (attrib <= attrib_highlight)
	if attributes & attrib then
		SayUsingVoice (VCTX_MESSAGE, IntToAttribName (attrib), ot_help)
	endIf
	let attrib = attrib * 2
EndWhile
EndFunction

Script SayTextAndAttributes ()
var
	int x,
	int y,
	handle WinHandle,
	int prevAttrib,
	int curAttrib
let WinHandle = GetFocus ()
SaveCursor ()
InvisibleCursor ()
MoveToWindow (WinHandle)
SetRestriction(RestrictAppWindow)
let prevAttrib = 1
let curAttrib = GetCharacterAttributes ()
while ((x != getCursorCol ()) || (y != getCursorRow ()))
	let x = getCursorCol ()
	let y = getCursorRow ()
	SayAttributesChanges (prevAttrib, curAttrib)
	SayField ()
	NextChunk ()
	let prevAttrib = curAttrib
	let curAttrib = GetCharacterAttributes ()
	delay (1)
EndWhile
RestoreCursor ()
EndScript

Void Function SayAttributesChanges (int prevAttrib, int curAttrib)
var
	int attrib,
	string sAttrib
let attrib = attrib_bold
while (attrib <= attrib_highlight)
	if ((prevAttrib & attrib) != (curAttrib & attrib)) then
		if (curAttrib & attrib) then
			let sAttrib = IntToAttribName (attrib)
			let sAttrib = FormatString (cmsg240_L, sAttrib)
			SayFormattedMessage (ot_help, sAttrib)
		else
			let sAttrib = IntToAttribName (attrib)
			let sAttrib = FormatString (cmsg241_L, sAttrib)
			SayFormattedMessage (ot_help, sAttrib)
		endIf
	endIf
	let attrib = attrib * 2
EndWhile
EndFunction

void Function MouseMovedEvent (int x, int y)
;Cancel selection if MAGic is the only product running
; and user starts to select with the mouse.
if getRunningFSProducts () == product_MAGic
&& (isLeftMouseButtonDown () || isLeftButtonDown ())
&& (isVirtualPcCursor () || IsFormsModeActive ())
&& ! stringIsBlank (biltin::GetSelectedText ()) then
	CancelSelection ()
endIf
; Add your code for MouseMovedEvent here.
; Changes made here apply to all applications.
; To make your changes application specific, copy this function to an
; application script file.
EndFunction

void Function MouseButtonEvent (int eventID, int x, int y)
; Add your code for MouseButtonEvent here.
; Changes made here apply to all applications.
; To make your changes application specific, copy this function to an
; application script file.
; Possible event identifiers are as follows:
;	WM_LBUTTONDOWN = 0x0201
;	WM_LBUTTONUP = 0x0202
;	WM_LBUTTONDBLCLK = 0x0203
;	WM_RBUTTONDOWN = 0x0204
;	WM_RBUTTONUP = 0x0205
;	WM_RBUTTONDBLCLK = 0x0206
;	WM_MBUTTONDOWN = 0x0207
;	WM_MBUTTONUP = 0x0208
;	WM_MBUTTONDBLCLK = 0x0209
;	WM_MOUSEWHEEL = 0x020A
if eventID == WM_LBUTTONDOWN
	if GetWindowClass(GetWindowAtPoint(x,y)) == cwc_VirtViewHelp
		;run the code to exit the virtual viewer when the mouse is used to close it:
		var object element = GetUIAElementAtPoint(x,y)
		if element.controlType == UIA_ButtonControlTypeId
		&& (element.name == cscButton_Minimize || element.name == cscButton_Close)
			ExitUserBuffer()
		endIf
	EndIf
endIf
EndFunction

Int Function GetWordWidth ()
var
	int nLength,
	int nPixels,
	int nSafety
let nSafety = 0
let nPixels = 0
let nLength = StringLength (GetWord())
if (nLength == 0) then
	return  0
endIf
SaveCursor()
InvisibleCursor()
RouteInvisibleToPc ()
while (nSafety < nLength)
	let nPixels = nPixels + GetCharacterWidth()
	if (IsWordDelimiter(GetCharacter())) then
		return nPixels
	endIf
	NextCharacter()
	let nSafety = nSafety + 1
endwhile
return nPixels
EndFunction

Int Function IsWordDelimiter (string strChar)
if (StringLength(strChar) > 1) then
	return 0
endIf
return (StringContains (WORD_DELIMITERS, strChar) != 0)
EndFunction

Int Function GetBrailleMode ()
return GetJCFOption(OPT_BRL_MODE)
EndFunction

Void Function SetBrailleMode (int nMode)
SetDefaultJcfOption(OPT_BRL_MODE,nMode)
EndFunction

; ***
; Run Manager section
; ***

Script WindowClassReassign ()
	var
		string TheApp,
		string TheClass,
		string RunIt
	Let TheApp = GetActiveConfiguration ()
	let TheClass = GetWindowClass( GetCurrentWindow() )
	;cwn2="Invalid Window Handle"
	If (TheClass == cwn2) then
		;cwn3="Invalid"
		let TheClass = cwn3
	endIf
	;RunIt = SettingsCenter.exe -a[Application] + -c[Class Name] + d[Dialog mode]
	Let RunIt = FormatString (SettingsCenter_Run_Ex,
					FindJAWSUtilityProgram (Utility_SettingsCenter),
					FLAG_APP, TheApp,
					FLAG_CLASS, TheClass,
					FLAG_CLASS_MODE)
	Run (RunIt)
EndScript

Void Function DoCustomHighlightColors (string strForeground, string strBackground, string sApp)
var
	int nIndex,
	string RunIt
;Protect the FocusChangedEvent from misinterpreting the two successive HJ Dialogs
Let GlobalWasHjDialog = FALSE
let nIndex = DlgSelectItemInList (cmsgCustomHighlight1, cmsgCustomHighlight2, false)
If (nIndex == 0) then
	return
endIf
If (nIndex == 1) then
	RunIt = FormatString (SettingsCenter_Color_Run_Ex,
		FindJAWSUtilityProgram (Utility_SettingsCenter),
		FLAG_APP, sApp,
		FLAG_FOREGROUND_COLOR, strForeground,
			FLAG_BACKGROUND_COLOR, strBackground,
			FLAG_HIGHLIGHTS_MODE)
	ElIf (nIndex == 2) then
		Let RunIt = FormatString (SettingsCenter_Color_Run_Ex,
			FindJAWSUtilityProgram (Utility_SettingsCenter),
			FLAG_APP, sApp,
			FLAG_FOREGROUND_COLOR, strForeground,
			cScNull, cScNull,
			FLAG_HIGHLIGHTS_MODE)
	ElIf (nIndex == 3) then
		Let RunIt = FormatString (SettingsCenter_Color_Run_Ex,
			FindJAWSUtilityProgram (Utility_SettingsCenter),
			FLAG_APP, sApp,
			cScNull, cScNull,
			FLAG_BACKGROUND_COLOR, strBackground,
			FLAG_HIGHLIGHTS_MODE)
	endIf
	Run(RunIt)
EndFunction

Void Function AddBrailleColors (string strForeground, string strBackground, string sApp)
	var
		int nIndex,
		string RunIt
	;Protect the FocusChangedEvent from misinterpreting the two successive HJ Dialogs
	Let GlobalWasHjDialog = FALSE
	let nIndex = DlgSelectItemInList (cmsgCustomHighlight1, cmsgCustomHighlight2, false)
	If (nIndex == 0) then
		return
	endIf
	If (nIndex == 1) then
		Let RunIt = FormatString (SettingsCenter_Color_Run_Ex,
			FindJAWSUtilityProgram (Utility_SettingsCenter),
			FLAG_APP, sApp,
			FLAG_BRL_FOREGROUND_COLOR, strForeground,
			FLAG_BRL_BACKGROUND_COLOR, strBackground,
			FLAG_BRAILLE_COLORS_MODE)
	ElIf (nIndex == 2) then
		Let RunIt = FormatString (SettingsCenter_Color_Run_Ex,
			FindJAWSUtilityProgram (Utility_SettingsCenter),
			FLAG_APP, sApp,
			FLAG_BRL_FOREGROUND_COLOR, strForeground,
			cScNull, cScNull,
			FLAG_BRAILLE_COLORS_MODE)
	ElIf (nIndex == 3) then
		Let RunIt = FormatString (SettingsCenter_Color_Run_Ex,
			FindJAWSUtilityProgram (Utility_SettingsCenter),
			FLAG_APP, sApp,
			cScNull, cScNull,
			FLAG_BRL_BACKGROUND_COLOR, strBackground,
			FLAG_BRAILLE_COLORS_MODE)
	endIf
	Run(RunIt)
EndFunction

Script CustomHighlightAssign ()
var
	string TheApp,
	string strForeground,
	string strBackground
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
Let TheApp = GetActiveConfiguration ()
let strForeground = ColorToRGBString(GetColorText())
let strBackground = ColorToRGBString(GetColorBackground())
DoCustomHighlightColors (strForeground, strBackground, TheApp)
EndScript

Script BrailleColorMarkingAssign (int index)
	var
		string TheApp,
		string strForeground,
		string strBackground
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
	Let TheApp = GetActiveConfiguration ()
	SaveCursor ()
	BrailleCursor ()
	let strForeground = ColorToRGBString(GetColorText())
	let strBackground = ColorToRGBString(GetColorBackground())
	RestoreCursor ()
	AddBrailleColors (strForeground, strBackground, TheApp)
EndScript

Script SettingsCenter ()
var
	Handle hCurrent,
	string sApplication,
	string TheDomain,
	string sClass,
	string sCommandLine
let sApplication = GetActiveConfiguration ()
let TheDomain = GetActiveConfiguration (TRUE)
let hCurrent = GetCurrentWindow ()
If hCurrent then
	let sClass = GetWindowClass (hCurrent)
Else
	;cwn3="Invalid"
	let sClass = cwn3
EndIf
sCommandLine = FormatString (SettingsCenter_Run, FindJAWSUtilityProgram (Utility_SettingsCenter), FLAG_APP, sApplication, FLAG_CLASS, sClass, cScNull)

if TheDomain != cscNull then
	; add the domain option to the command line
	let sCommandLine = sCommandLine + " " + FLAG_DOMAIN + "\"" + TheDomain + "\""
endIf

	Run (sCommandLine)
EndScript

Script MessageCenter ()
RunMessageCenter()
EndScript

String Function CreateDictionaryCommandLine (int bDoAddDialog)
var
	string theword,
	int HighlightFound,
	string TheApp,
	string TheDomain,
	string Runit,
	HANDLE CurrentWindow
let theword = GetWord()
Let TheApp = GetActiveConfiguration ()
Let TheDomain = GetActiveConfiguration (TRUE)
let CurrentWindow = GetCurrentWindow()
if (GetCharacterAttributes() & ATTRIB_GRAPHIC)
&& !IsVirtualPCCursor() then
	SayMessage (ot_error, cmsg177_L) ; "Use the Graphics Labeler to label graphics"
	return cscNull
endIf
;See if there is highlighted text
if CurrentWindow
&& IsPCCursor()
;Verify that we're not in a Enhanced Edit document:
&& GetDocumentPercentage () < 0
&& ! IsVirtualPcCursor() then
	SaveCursor()
	InvisibleCursor ()
	RouteInvisibleToPc ()
	if (GetCharacterAttributes () & ATTRIB_HIGHLIGHT) then
		let theWord = GetField()
	else
		PriorCharacter ()
		if (GetCharacterAttributes () & ATTRIB_HIGHLIGHT) then
			let theWord = GetField()
		endIf
	endIf
	RestoreCursor()
ElIf IsVirtualPcCursor ()
|| GetDocumentPercentage () >= 0 then
	If GetSelectedText () then;Honor selection of multiple words
		Let TheWord = GetSelectedText ()
	Else
		Let TheWord = GetWord ()
	EndIf
EndIf
if (theword != cscNull) then
	;RunIt = "JDiction.exe -a[Application] -r[Rule]
	Let RunIt = FormatString (JDiction_Run_Ex,
		FindJAWSUtilityProgram (MGR_DICTION),
			FLAG_APP, TheApp,
			FLAG_RULE, TheWord)
	if (bDoAddDialog == TRUE) then
		let Runit = Runit + " -d"
	endIf
else
	;RunIt = "JDiction.exe -a[Application]
	Let RunIt = FormatString (JDiction_Run,
			FindJAWSUtilityProgram (MGR_DICTION),
				FLAG_APP, TheApp)
	if (bDoAddDialog == TRUE) then
		let Runit = Runit + " -d"
	endIf
endIf
if TheDomain != cscNull then
	; add the domain option to the command line
	let Runit = Runit + " " + FLAG_DOMAIN + " \"" + TheDomain + "\""

endIf
return RunIt
EndFunction

Script DictionaryManager (optional string strCommandLine)
var
	String RunIt
;Start dictionary Manager
if StringIsBlank (strCommandline) then
	let RunIt = CreateDictionaryCommandLine (FALSE)
else
	let RunIt = strCommandLine
EndIf
if (RunIt != cscNull) then
	Run (RunIt)
endIf
EndScript

Void Function FrameClearValues ()
let GlobalFrameTop = VALUE_NOT_READY
let GlobalFrameLeft = VALUE_NOT_READY
let GlobalFrameBottom = VALUE_NOT_READY
let GlobalFrameRight = VALUE_NOT_READY
let GlobalFrameParentTop = VALUE_NOT_READY
let GlobalFrameParentLeft = VALUE_NOT_READY
let GlobalFrameParentBottom = VALUE_NOT_READY
let GlobalFrameParentRight = VALUE_NOT_READY
EndFunction

void function CreateFrameOrPromptForRegion()
var
	int iChoice,
	int iTask,
	int nMode,
	int iHasPrompt,
	handle hMenu,
	string sMenuClass
let iHasPrompt=(GetFramePrompt()!=cscNull || BrailleGetFramePrompt()!=cscNull ||
	GetFrameTutorMessage()!=cscNull)
Let nMode = GlobalMenuMode
If nMode > 1 then
	Let hMenu = GetCurrentWindow ()
EndIf
If hMenu then
	Let sMenuClass = GetWindowClass (hMenu)
EndIf
if iHasPrompt then
	let iTask = FRAMEVIEW_ModifyPrompt
	let iChoice=dlgSelectItemInList(cModifyFrameOrPromptMenu,cCreateFrameOrPromptTitle,FALSE)
else
	let iTask = FRAMEVIEW_CreatePrompt
	let iChoice=dlgSelectItemInList(cCreateFrameOrPromptMenu,cCreateFrameOrPromptTitle,false)
endIf
if iChoice==1 then
	frameManagerRun(FRAMEVIEW_ShowActiveFrames|FRAMEVIEW_CreateFrame,nMode,hMenu,sMenuClass)
elif iChoice==2 then
	FrameManagerRun(iTask)
endIf
endFunction

Script FrameGetTopLeft ()
if (IsSameScript ()) then
	FrameSetOnWindow (GetCurrentWindow())
else
	;JAWSCursor ()
	let GlobalFrameLeft = getCursorCol ()
	let GlobalFrameTop = GetLineTop ()
	if (!GlobalFrameTop) then
		let GlobalFrameTop = getCursorRow()
	endIf
	SayFormattedMessage (ot_status, cmsg183_L, cmsg183_S) ; "Setting Frame top left corner "
endIf
SetParentDims()
if ((GlobalFrameBottom != VALUE_NOT_READY) && (GlobalFrameRight != VALUE_NOT_READY)) then
	CreateFrameOrPromptForRegion()
	; reset GlobalVariables
	FrameClearValues()
endIf
EndScript

Script FrameGetBottomRight ()
;JAWSCursor ()
let GlobalFrameRight = getCursorCol () + GetCharacterWidth ()
let GlobalFrameBottom = GetLineBottom ()+1;Fudge by 1 pixel to ensure accuracy
;  format Top Left Dimensions to a string
SayFormattedMessage (ot_status, cmsg184_L, cmsg184_S) ; "Setting Frame bottom right corner "
SetParentDims()
if ((GlobalFrameTop != VALUE_NOT_READY) && (GlobalFrameLeft != VALUE_NOT_READY)) then
	CreateFrameOrPromptForRegion()
	; reset GlobalVariables
	FrameClearValues()
endIf
EndScript

Script QuickViewSetTopLeft ()
if QuickViewFramesUnsupported() then
	return
EndIf
if IsSameScript() then
	FrameSetOnWindow(GetWindowAtPoint(GetCursorCol(CURSOR_JAWS), GetCursorRow(CURSOR_JAWS)))
else
	;use rectangles instead of specific functions for coordinates:
	;let GlobalFrameLeft = getCursorCol (CURSOR_JAWS)
	;let GlobalFrameTop = GetLineTop (CURSOR_JAWS)
	saveCursor ()
		JAWSCursor ()
		globalFrameLeft = getCursorCol ()
		getItemRect (GlobalFrameLeft, getCursorRow (), 0, 0, GlobalFrameTop, 0, IT_LINE)
	restoreCursor ()
	if !GlobalFrameTop then
		let GlobalFrameTop = getCursorRow(CURSOR_JAWS)
	endIf
	Say(cmsgQVSetTopLeftCorner,ot_status)
endIf
if GlobalFrameBottom != VALUE_NOT_READY
&& GlobalFrameRight != VALUE_NOT_READY then
	FrameManagerRun(FRAMEVIEW_ShowActiveFrames|FRAMEVIEW_CreateFrame)
	; reset GlobalVariables
	FrameClearValues()
endIf
EndScript

Script QuickViewSetBottomRight ()
if QuickViewFramesUnsupported() then
	return
EndIf
;Use the rectangle to set the frame instead of the specific functions for a given coordinate
let GlobalFrameRight = getCursorCol (CURSOR_JAWS) + GetCharacterWidth ()
;let GlobalFrameBottom = GetLineBottom (CURSOR_JAWS)+1;Fudge by 1 pixel to ensure accuracy
saveCursor ()
	JAWSCursor ()
	getItemRect (GlobalFrameRight, getCursorRow (), 0, 0, 0, GlobalFrameBottom, IT_LINE)
restoreCursor ()
;  format Top Left Dimensions to a string
Say(cmsgQVSetBottomRightCorner,ot_status)
if GlobalFrameTop != VALUE_NOT_READY
&& GlobalFrameLeft != VALUE_NOT_READY then
	FrameManagerRun(FRAMEVIEW_ShowActiveFrames|FRAMEVIEW_CreateFrame)
	; reset GlobalVariables
	FrameClearValues()
endIf
EndScript

Void Function FrameSetOnObject ();Useful for SDM windows
var
	int iLeft, int iTop, int iRight, int iBottom
GetObjectRect (iLeft, iRight, iTop, iBottom)
let GlobalFrameTop = iTop
let GlobalFrameLeft = iLeft
let GlobalFrameBottom = iBottom
let GlobalFrameRight = iRight
EndFunction

Void Function FrameSetOnWindow (handle CurrentWindow)
if (!CurrentWindow) then
	let CurrentWindow = GetCurrentWindow()
endIf
;For SDM Dialogs
If StringContains (GetWindowClass (CurrentWindow),cWcSdmDlg) then
	FrameSetOnObject ()
	Return
EndIf
let GlobalFrameTop = GetWindowTop (CurrentWindow)
let GlobalFrameLeft = GetWindowLeft (CurrentWindow)
let GlobalFrameBottom = GetWindowBottom (CurrentWindow)
let GlobalFrameRight = GetWindowRight (CurrentWindow)
EndFunction

Void Function FrameManagerRun (int nAction, optional int nMode, handle hMenu, string sMenuClass)
var
	HANDLE hRealWindow,
	string sRealName,
	string sClass,
	string sPrompt,
	int nPeriod,
	int nLength
if GlobalFrameTop == VALUE_NOT_READY
|| GlobalFrameLeft == VALUE_NOT_READY
|| GlobalFrameBottom == VALUE_NOT_READY
|| GlobalFrameRight == VALUE_NOT_READY then
	return
endIf
if GetRunningFSProducts() == product_MAGic then
	PcCursor()
	QuickViewManager(nAction,
		VALUE_NOT_READY, VALUE_NOT_READY, VALUE_NOT_READY, VALUE_NOT_READY,
		GlobalFrameTop, GlobalFrameLeft, GlobalFrameBottom, GlobalFrameRight,
		cScNull, cScNull, cScNull)
	return
endIf
If nMode then
	Let hRealWindow = hMenu; Handle of Menu window
	let sClass = sMenuClass;Class of the menu
	Let sRealName = cScNull;Do not pass real window name in for menus
Else
	let hRealWindow = GetTopLevelWindow (GetCurrentWindow())
	let sClass = GetWindowClass(hRealWindow)
	let sRealName = GetWindowName(hRealWindow)
EndIf
let nLength = StringLength(sRealName)
; Make sure that the last character of the RealName does not end with a single slash.
; If it does, then add another slash to it.  One slash alone, combined with the
; end quote, will make an escape sequence.
if (StringRight(sRealName, 1) == "\\" && StringRight(sRealName, 2) != "\\\\") then
	let sRealName = sRealName + "\\"
endIf
; Prompt Code
if (nAction == FRAMEVIEW_CreatePrompt) then
	let sPrompt = GetWindowName(GetCurrentWindow())
else
	let sPrompt = cScNull
EndIf
PcCursor ()
FrameViewer(nAction,
	GlobalFrameParentTop, GlobalFrameParentLeft, GlobalFrameParentBottom, GlobalFrameParentRight,
	GlobalFrameTop, GlobalFrameLeft, GlobalFrameBottom, GlobalFrameRight,
	sRealName, sClass, sPrompt)
EndFunction

Script CreatePrompt()
var
	int nIsWinValid,
	int iShouldClass,
	int iWinType,
	int iTask
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
If !AreUtilitiesAllowed() then
	return
endIf
Let nIsWinValid = PromptValidator ()
;Kill if creating prompt is not appropriate
If ! nIsWinValid then
	SayFormattedMessage (OT_ERROR, cMsg376_L);"Cannot create prompt"
	Return
EndIf
if ShouldUseCustomLabler(getCurrentWindow()) then
	dlgCustomLabel()
	return
endIf
let iShouldClass = FALSE
if (GetFrameNameAtCursor()) then
	let iTask = FRAMEVIEW_ModifyPrompt
else
	let iTask = FRAMEVIEW_CreatePrompt
endif

if (iTask == FRAMEVIEW_CreatePrompt) then
	Let iWinType = GetWindowSubTypeCode (GetCurrentWindow ())
	If ! iWinType then
		Let iShouldClass = ExMessageBox(
			FormatString(cMsgPromptDlg),
			cMsgPromptDlgName,
			MB_YESNOCANCEL|MB_DEFBUTTON1|MB_ICONASTERISK)
		If iShouldClass == IDCANCEL then
			Return
		EndIf

	Else
		Let iShouldClass = FALSE
	EndIf
	If iShouldClass != IDYES then
		Let iShouldClass = FALSE
	EndIf
endif

If ! iShouldClass then
	FrameSetOnWindow (GetCurrentWindow())
	SetParentDims()
	FrameManagerRun(iTask,0,0,cScNull)
	; reset GlobalVariables
	FrameClearValues()
Else
	PerformScript WindowClassReassign ()
EndIf
EndScript

Function SetParentDims ()
var
HANDLE hRealWindow

let hRealWindow = GetTopLevelWindow (GetCurrentWindow ())
let GlobalFrameParentLeft = GetWindowLeft (hRealWindow)
let GlobalFrameParentTop = GetWindowTop (hRealWindow)
let GlobalFrameParentRight = GetWindowRight (hRealWindow)
let GlobalFrameParentBottom = GetWindowBottom (hRealWindow)
EndFunction

Script FrameManager ()
FrameSetOnWindow (GetCurrentWindow())
SetParentDims()
if ((GlobalFrameBottom != VALUE_NOT_READY) && (GlobalFrameRight != VALUE_NOT_READY)) then
	FrameManagerRun(FRAMEVIEW_ShowActiveFrames, GlobalMenuMode,0,cScNull)
	; reset GlobalVariables
	FrameClearValues()
endIf
EndScript

Script KeyboardManager ()
var
	string TheApp,
	string TheDomain,
	string Runit,
	HANDLE CurrentWindow
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
let TheApp = GetActiveConfiguration ()
let TheDomain = GetActiveConfiguration (TRUE)
;RunIt = "JKey.exe -a[Application]" ;;; must have space between -a and appname
if TheDomain == cscNull then
Let RunIt = FormatString (JKey_Run,
				FindJAWSUtilityProgram (MGR_KEYBRD),
				FLAG_APP, TheApp)
else
	Let RunIt = FormatString(JKey_Run_Domain,
					FindJAWSUtilityProgram (MGR_KEYBRD),
					FLAG_APP, TheApp,
					FLAG_DOMAIN, TheDomain)

endif
Run (Runit)
EndScript

Void Function RunJAWSScriptManager ()
	var
		string TheApp,
		string TheDomain,
		string Runit,
		HANDLE CurrentWindow
	let TheApp = GetActiveConfiguration ()
	let TheDomain = GetActiveConfiguration (TRUE)
	;RunIt = "JScript.exe -a [Application]" ;;; must have space between -a and appname
	Let RunIt = FormatString (JScript_Run,
					FindJAWSUtilityProgram (MGR_SCRIPT),
					FLAG_APP, TheApp)

	if TheDomain != cscNull then
		; add the domain option to the command line
		let Runit = Runit + " " + FLAG_DOMAIN + " \"" + TheDomain + "\""
	endIf

	Run (Runit)
EndFunction

void Function RunMAGicScriptManager ()
var
	string TheApp,
	string Runit,
	HANDLE CurrentWindow
	if (! IsScriptingEditionAuthorized())
	then
	SayMessage(ot_error,cmsg_MAGicScriptingNotAuthorized)
	return
endIf
let TheApp = GetActiveConfiguration ()
;RunIt = "JScript.exe -a [Application]" ;;; must have space between -a and appname
	Let RunIt = FormatString(JScript_Run, FindJAWSUtilityProgram(MGR_SCRIPT), FLAG_APP, TheApp)
Run (Runit)
EndFunction

Script ScriptManager ()
var
	int RunningProducts
let RunningProducts = GetRunningFSProducts()
If RunningProducts & product_JAWS then
	;only scripts from the JAWS settings are used when JAWS is run with another FS product:
	RunJAWSScriptManager ()
elIf RunningProducts == product_MAGic then
	RunMAGicScriptManager ()
EndIf
EndScript

script ScriptManagerDefault()
var
	string RunIt
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
let RunIt = "\"" + FindJAWSUtilityProgram(MGR_SCRIPT) + "\" default.jss"
Run(RunIt)
EndScript

void function RunNavQuickKeysManager()
NavigationQuickKeysManager (0)
EndFunction

int function IsCustomizeListViewApplicable(handle hWnd)
;Overwrite for application areas where Customize Listview should not appear in the Run JAWS Manager dialog:
return true
EndFunction

Script RunJAWSManager ()
var
	handle hWnd = getFocus (),
	string sClass,
	string strForeground,
	string strBackground,
	string strBrlForeground,
	string strBrlBackground,
	string sApp,
	string RunIt,
	string sQuery,
	string managersList,
	int bModifyFrame,
	int nMenuMode,
	int index,
	string selectedListItem,
	int bUseCustomLabeler,
	int bViewCustomSummary
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
If !AreUtilitiesAllowed() then
	return
endIf
If BrailleRunManagerHelper () then
	Return
EndIf
Let nMenuMode = GlobalMenuMode
If InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
let bUseCustomLabeler=ShouldUseCustomLabler(GetCurrentWindow())
let bViewCustomSummary=ShouldShowCustomSummary(GetCurrentWindow())
if GetFrameNameAtCursor()
&& !bUseCustomLabeler then
	let bModifyFrame = TRUE;
else
	let bModifyFrame = FALSE;
endif
;get the command line for the dictionary manager so it retains currently selected word
let RunIt = CreateDictionaryCommandLine (false)
if GetSelectedText ()
&& (! isJAWSCursor () && ! isInvisibleCursor ()) then
	let sQuery = getSelectedText ()
else
	let sQuery = getWord ()
endIf

let managersList =
	SettingsCenterItem
	+WindowClassItem
	+DictionManItem
	+FrameManItem
	+KeyManItem
	+ScriptManItem
	+GraphicsLabelerItem
	+CustomHighlightAssignItem
	+BrailleAddColorsItem
if ShouldJawsManagerAddMessageCenter()
	let managersList = managersList +MessageCenterItem
endif
if IsCustomizeListViewApplicable(hWnd)
	let managersList = managersList+CustomizeListViewItem
endIf
let managersList = managersList
	+SkimReadingToolItem
	+AdjustJAWSOptionsItem
	+QuickNavigationKeysItem
	+FlexibleWebItem
;We place the Prompt item here since it may or may not appear in the list,
;and if not added, the list index must not then be off by 1.
If PromptValidator()==TRUE
|| CustomSummaryValidator()==true then
	if bViewCustomSummary then
		let managersList=ManagersList+CustomSummaryDialog
	else
		if bModifyFrame then
			Let ManagersList = ManagersList + ModifyPromptItem
		else
			Let ManagersList = ManagersList + CreatePromptItem
		EndIf
	endIf
EndIf
; for Excel only at this time:
If CustomSummaryValidator() then
	if bViewCustomSummary then
		let ManagersList=ManagersList+ViewCustomSummaryItem
	EndIf
EndIf
If ShouldUseCustomLabler(hWnd) then
	Let ManagersList = ManagersList + LabelManagerItem
EndIf
let ManagersList = ManagersList+ResearchItItem
let ManagersList = ManagersList+JAWSSearchItem
if g_NotificationManagerEnabled then
	let ManagersList = ManagersList+NotificationHistoryItem
endif
let sClass = GetWindowClass (hWnd)
Let sApp = GetActiveConfiguration ()
let strForeground = ColorToRGBString(GetColorText())
let strBackground = ColorToRGBString(GetColorBackground())
;No matter what, Get it at Braille Cursor
;As the Braille cursor can be anywhere.
SaveCursor ()
BrailleCursor ()
Let strBrlForeground = ColorToRGBString(GetColorText())
Let strBrlBackground = ColorToRGBString(GetColorBackground())
RestoreCursor ()
let index = DlgSelectItemInList (ManagersList, RunManagerDialogTitle, TRUE)
If Index == 0 then
	Return
endIf
if stringStartsWith (ManagersList, cscListSeparator) then
	ManagersList = stringChopLeft (ManagersList, 1)
endIf
selectedListItem = StringSegment (ManagersList, cscListSeparator, index)
; add the list separator to compare against items in list:
selectedListItem = cscListSeparator+selectedListItem
; all filtering has been done when building the list.
; So all that needs doing is add new items at the end with functions / scripts to run.
If selectedListItem == SettingsCenterItem
	PerformScript SettingsCenter ()
elif selectedListItem == WindowClassItem
	PerformScript WindowClassReassign ()
elif selectedListItem == DictionManItem
	PerformScript DictionaryManager (RunIt)
elif selectedListItem == FrameManItem
	PerformScript FrameManager ()
elif selectedListItem == CreatePromptItem
	PerformScript CreatePrompt ()
elif selectedListItem == ModifyPromptItem
	FrameSetOnWindow (GetCurrentWindow())
	SetParentDims()
	FrameManagerRun(FRAMEVIEW_ModifyPrompt,nMenuMode,0,cScNull)
	; reset GlobalVariables
	FrameClearValues()
elif selectedListItem == LabelManagerItem
	PerformScript ShowLabelManager()
elif selectedListItem == ViewCustomSummaryItem
	Pause() ; allow time for dialog to be dismissed.
	CustomSummary(sApp)
elif selectedListItem == CustomSummaryDialog
	pause ()
	PerformScript CreatePrompt()
elif selectedListItem == KeyManItem
	PerformScript KeyboardManager ()
elif selectedListItem == ScriptManItem
	PerformScript ScriptManager ()
elif selectedListItem == GraphicsLabelerItem
	PerformScript GraphicsLabeler ()
elif selectedListItem == CustomHighlightAssignItem
	Delay (2)
	DoCustomHighlightColors (strForeground, strBackground, sApp)
elif selectedListItem == BrailleAddColorsItem
	Delay (2)
	AddBrailleColors (strBrlForeground, strBrlBackground, sApp)
elif selectedListItem == CustomizeListViewItem
	PerformScript CustomizeListView()
elif selectedListItem == SkimReadingToolItem
	PerformScript SkimReadDialog()
ElIf selectedListItem  == AdjustJAWSOptionsItem
	PerformScript QuickSettings ()
elif selectedListItem ==QuickNavigationKeysItem
	RunNavQuickKeysManager()
elif selectedListItem ==FlexibleWebItem
	PerformScript DoFlexibleWebDialog();
elif selectedListItem == ResearchItItem
	RunLookupModuleQueryUsingLRL_Dialog (sQuery)
ElIf selectedListItem == JAWSSearchItem
	LaunchCommandsSearchViewer (hWnd)
elif selectedListItem == NotificationHistoryItem
	PerformScript ShowNotificationHistory(Script_InvokedBy_Script)
ElIf selectedListItem == MessageCenterItem
	PerformScript MessageCenter();
	;ElIf selectedListItem == SomeNewItem
	;functionHere()
EndIf
EndScript

; ***
; Window event functions
; ***

Void Function ForegroundWindowChangedEvent (handle newWindow)
EndFunction

int Function SpeakInvisibleWindow ()
var
	handle hFocus,
	string sCursorShape,
	string sProgressName,
	string sProgress
;conditions in which this function should not speak:
let sCursorShape = getCursorShape ()
if sCursorShape == cscWAIT || sCursorShape == cscAppStart then
	return FALSE
endIf
Let hFocus = getFocus ()
;previous or current window in exceptions list, e.g. no announce:
if hFocus
&& (stringContains (cwnFocusLossExceptionsList, globalPrevRealName)
|| StringContains (cwnFocusLossExceptionsList, getWindowName (getRealWindow (globalFocusWindow)))) then
	return
endIf
;tool tip, help balloon: actions are in progress, so not really "out of focus"
if isWindowVisible (ghwndToolTip) then
	return FALSE
endIf
;If a progress bar is running, prevent this from speaking:
if isWindowVisible (GetProgressBarInfo (sProgressName, sProgress))
|| ! StringIsBlank (sProgressName)
|| ! StringIsBlank (sProgress) then
	return FALSE
endIf
if ! hFocus;no foreground
|| (hFocus && ! isWindowVisible (hFocus);foreground is invisible,
;this invalid circumstance mans the whole app's hierarchy is invisible, out of scope but still has keyboard focus.
&& ! isWindowVisible (getParent (hFocus))) then
if hFocus && StringStartsWith(GetWindowClass(hFocus),"Chrome")
return False
EndIf
	SayUsingVoice (vctx_message, cmsgFocusLoss, OT_SCREEN_MESSAGE)
	if hFocus then
		BrailleMessage (cmsgBrlLostFocus, OFF, 10000);keep message up until user can act
	endIf
	;Tutor message goes here, as the event does not go off, and we don't want to create timing problems with duplicate (forced) event calls, resulting in an unknown function call.
	SayUsingVoice (vctx_message, cmsgFocusLossTutor, OT_TUTOR)
	Return TRUE
;All windows have closed, save the desktop and task bar
elIf AllAppsClosedFromSystemTray (hFocus) then
	SayUsingVoice (vctx_message, cmsgFocusLoss, OT_SCREEN_MESSAGE)
	if hFocus then
		BrailleMessage (cmsgBrlLostFocus, OFF, 10000);keep message up until user can act
	endIf
	;Tutor message goes here, as the event does not go off, and we don't want to create timing problems with duplicate (forced) event calls, resulting in an unknown function call.
	if ShouldItemSpeak(OT_TUTOR) == TUTOR_ALL then
		SayMessage (OT_TUTOR, cmsgFocusLossTutor)
	EndIf
	Return TRUE
endIf
endFunction

void Function WindowActivatedEvent(handle hWnd)
unScheduleFunction (giFN_SpeakInvisibleWindow);
;Handle focused window who is invisible:
;Skype and some antivirus software can get in this state, and the user has no way of knowing.
;Also handle ShellTrayWnd window, another "No Man's land" in which we want to say the previous app that lost focus.
;This must be at least half a second, as if the window focused upon is a list or other such window where items are being drawn, it may not be visible for a few hundred milliseconds.
if GetDefaultJCFOption (OPT_FOCUS_LOSS_ANNOUNCE) then
	Let giFN_SpeakInvisibleWindow = ScheduleFunction ("SpeakInvisibleWindow", gi_FOCUS_LOSS_TIMER)
endIf
EndFunction

globals handle hHomeRowPos
Void Function WindowCreatedEvent (handle hWindow, int nLeft, int nTop, int nRight, int nBottom)
var
	handle hFocus
; It is best to override this function in application specific script files.
; Any code placed here will be processed very frequently.
LyncAddConversationToCollection (hWindow)
CheckForWinVistaErrorDialog(hWindow)
CheckForReminderDialog (hWindow)
;If a window is created after focus loss, either User or Application has acted and focus is no longer lost:
UnscheduleFunction (giFN_SpeakInvisibleWindow)
Let giFN_SpeakInvisibleWindow = 0;
if GetDefaultJCFOption (OPT_FOCUS_LOSS_ANNOUNCE) then
	let hFocus = getFocus ()
	if AllAppsClosedFromSystemTray (hFocus)
	|| (hFocus && ! isWindowVisible (hFocus)) then
		Let giFN_SpeakInvisibleWindow = ScheduleFunction ("SpeakInvisibleWindow", gi_FOCUS_LOSS_TIMER)
	endIf
endIf
EndFunction

Function WindowDestroyedEvent (handle hWindow)
;This event is most reliable for changing a system tray item.
DestroyOldSkypeAlerts (hWindow)
RemoveUIALyncConversationWindowData (hWindow)
RemoveMainUIALyncEventHandler (hWindow)
if GetDefaultJCFOption (OPT_FOCUS_LOSS_ANNOUNCE)
&& AllAppsClosedFromSystemTray (getFocus ()) then
	unScheduleFunction (giFN_SpeakInvisibleWindow)
	Let giFN_SpeakInvisibleWindow = ScheduleFunction ("SpeakInvisibleWindow", gi_FOCUS_LOSS_TIMER)
	Return
endIf
If (WindowClosed == true) then
	SayFormattedMessage (OT_JAWS_MESSAGE, cmsg40_L, cmsg40_S)
	let WindowClosed = false
endIf
if hWindow == ghWndAutoCompleteSuggestionList
	ghWndAutoCompleteSuggestionList = ghNull
elif hWindow == ghWndResultsViewer then
	ghWndResultsViewer = ghNull
; Nulls ToggleOutlookReminder-related window variables.
elif hWindow==ghOutlookWindow Then
	ghOutlookWindow=ghNull
	ghReminderDialog=ghNull
ElIf hWindow==ghReminderDialog Then
	ghReminderDialog=ghNull
ElIf hWindow==ghReminderReturn Then
	ghReminderReturn=ghNull
EndIf
EndFunction

void Function WindowMinMaxEvent (handle hWindow, int nMinMaxRest, int nShow)
;Prevent speaking of focus loss, the user or an application has acted:
unScheduleFunction (giFN_SpeakInvisibleWindow)
EndFunction

void Function WindowsToastEvent(string notificationText, string sender)
	ProcessNotificationTextAndSpeakIfAllowed(notificationText, sender)
EndFunction

void Function WindowResizedEvent (handle hWindow, int nLeft, int nTop, int nRight, int nBottom)
if IsBackgroundOCREnabled()
	;The Background OCR rectangle will have changed if the window is resized.
	;Set c_BackgroundOCRRect.shouldUpdateRect to true so that an updated rectangle will be retrieved.
	c_BackgroundOCRRect.shouldUpdateRect = true
endIf
if IsWindows11Version24H2 ()
	;handled through UIANotificationEvent
	return
endIf
if hWindow == c_WinArrow.hWindow
&& (GetTickCount() - c_WinArrow.lastPress) < WinArrowThreshhold
	var int iVisualState = FSUIAGetWindowVisualState(hWindow)
	if iVisualState == WindowVisualState_Normal
		if !SayWindowSnap(hWindow, nLeft, nTop, nRight, nBottom)
			Say (cmsgWindowRestored, OT_STATUS)
		endIf
	elIf iVisualState == WindowVisualState_Maximized
		Say (cmsgWindowMaximized, OT_STATUS)
	elIf iVisualState == WindowVisualState_Minimized
		Say (cmsgWindowMinimized, OT_STATUS)
	endIf
	ClearWinArrowGlobals()
endIf
EndFunction

void Function ProcessNotificationTextAndSpeakIfAllowed(string notificationText, string sender)
var collection notificationRuleActions
if notificationText
	; We don't want to repeat notifications endlessly. If we've previously said the same thing, no need to repeat ourselves.
	if !IsRepeatNotification(notificationText)
 		notificationRuleActions = ProcessNotification(notificationText, sender)
 		if GetJCFOption(OPT_ENABLE_TOAST_NOTIFICATION_PROCESSING) != 0 then
			SayNotification(notificationRuleActions, ot_toasts)
		endIf
	endIf
	; We want to store the original notification to view
	; in the notification Viewer,
	; if the user wants to see the notification there
	if !notificationRuleActions.ExcludeFromNotificationHistory then
		StoreSpokenNotificationForRepeat (notificationText, sender) ; for new insert+Space&N keystroke.
	endIf
endIf
; Skype 8 and later can use toasts, so update the insert+space&r keystroke:
if stringContains (notificationText, "Skype") then  LastBackgroundNotificationText = notificationText endIf
EndFunction

void function SpeakAnyVisibleWindowsNotification(optional handle hWnd)
;WindowResizedEvent should supply a window handle when calling,
;AutoStart should not supply a window handle when calling.
if ghNotificationClassWindow && hWnd
&& hWnd != ghNotificationClassWindow
	;A notification was detected at some prior time, so we know the window handle to use,
	;and this handle does not match the notification handle.
	return
endIf
var string notificationText, string sender
if !ghNotificationClassWindow
	;This is being called from AutoStartEvent,
	;or from WindowResizedEvent and no visible notification has yet been detected.
	;We must determine if a notification window is actually visible,
	;and if so, cache the notification windows handle.
	if hWnd
		;Called by WindowResizedEvent,
		;we don't yet have a handle, this may be the first notification:
		if GetWindowsNotificationTextFromHandle(hWnd,notificationText, sender)
				ghNotificationClassWindow = hWnd
		endIf
	else
		;Called by AutoStart or some other function where we don't have a window handle to use:
		hWnd = GetFirstWindow(GetTopLevelWindow(GetFocus()))
		while hWnd && !notificationText
			if GetWindowClass(hWnd) == cwc_Windows_UI_Core_CoreWindow
			&& GetWindowsNotificationTextFromHandle(hWnd,notificationText, sender)
				ghNotificationClassWindow = hWnd
			endIf
			hWnd = GetNextWindow(hWnd)
		endWhile
	endIf
else
	;A notification has previously been detected,
	;so we know that this is the notification window.
	GetWindowsNotificationTextFromHandle(hWnd,notificationText, sender)
endIf
ProcessNotificationTextAndSpeakIfAllowed(notificationText, sender)
EndFunction

int function GetWindowsNotificationTextFromHandle(handle hWnd, string byRef NotificationText, optional string byRef Sender)
NotificationText = cscNull
Sender = cscNull
var object element = FSUIAGetElementFromHandle(hWnd)
if !element return false endIf
var object child = FSUIAGetFirstChildOfElement(element)
if !child return false endIf
if child.controlType == UIA_WindowControlTypeId
&& child.automationID == UIAAutomationID_NormalToastView
	NotificationText = child.name
endIf
if !notificationText return false endIf
var object notificationElement = FSUIAGetFirstChildOfElement(child)
while(notificationElement)
	if notificationElement.automationID == UIAAutomationID_SenderName then
		Sender = notificationElement.name
		return true
	endIf
	notificationElement = FSUIAGetNextSiblingOfElement(notificationElement)
endWhile
return true
EndFunction

Script SetVERBOSITYLevel ()
SayFormattedMessage (OT_STATUS, VerbosityLevelToggle (FALSE))
EndScript

Script SetBrailleVerbosity (int index)
;List box function:
;AdjustBrailleOptions is tree view version.
var
	string sList
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
Let sList = cStrBrailleList()
if DeviceHasWhizWheels() then
	let sList = sList+cStrBrailleListWhizOption
EndIf
If IsVirtualPcCursor () then
	Let sList = sList+cStrTableBrailleList()
EndIf
If BrailleSupportsTypeKeysMode() then
	Let sList = sList+cStrBrailleTypeKeysModeOption
EndIf
let sList = StringChopLeft(sList,1)
DlgSelectFunctionToRun (sList, cStrBrailleDlgName, false)
EndScript

Script AdjustBrailleOptions (int index);Tree view:
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
QuickSettingsPreProcess ()
LaunchQuickSettings ()
delay (2, TRUE)
loadNonJCFOptions (); update application-wide options.
QuickSettingsLoadDocumentSettings ()
EndScript

Script SetScreenEcho ()
SayFormattedMessage(OT_STATUS, ScreenEchoToggle (FALSE))
EndScript

script SpellMode()
SayMessage (OT_STATUS, SpellModeToggle (FALSE))
EndScript

Script SetTypingEcho ()
SayFormattedMessage(OT_STATUS, TypingEcho(FALSE))
EndScript

script ToggleTypingEcho()
var
	int nNewTypingEcho,
	int bSuccess
bSuccess = MagTypingEchoToggle(nNewTypingEcho)
if bSuccess then
	if nNewTypingEcho then
		Say(cmsgKeyboardEchoOn,ot_status)
	else
		Say(cmsgKeyboardEchoOff,ot_status)
	EndIf
else
	beep()
endif
EndScript

Script SetGraphicsVerbosity ()
SayFormattedMessage (OT_STATUS, GraphicsVerbosity (FALSE))
EndScript

;User Verbosity Dialog, legacy:
Script AdjustJAWSVerbosity ()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
JAWSVerbosityCore (cscNull)
EndScript

;Options Dialog with Tree View:
Script AdjustJAWSOptions ()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
;This function call sends the optional TRUE parameter as second
;so that we retain node settings that we define,
;including those at level 0.
;If you want us to create nodes for you, call the below function in your own copy of this script,
;and include the following:
;Second parameter (optional) = false, or ignore.
;If second parameter is filled in as FALSE, optionally fill in third parameter,
;with a name for the node under which we will place all your options that do not have node paths.
;Otherwise, call this function with just the parameter with your options like this:
;OptionsTreeCore(strMyOptionsLinst)
;And at the top of the Adjust JAWS Options dialog, you will see a node as follows:
;ConfigurationName Options
;Where ConfigurationName is the name of your configuration,
;e.g. Skype Options
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
OptionsTreeCore (cScNull, FALSE, cscNull)
EndScript

int function inQuickSettingsDialog ()
;Only return TRUE from the QuickSettings script file,
; since that gets pushed onto the stack on QuickSettingsLoad,
;and popped on QuickSettings Exit:
return FALSE
endFunction

void function QuickSettingsPreProcess ()
;Code goes here which runs before loading the Quick Settings tool.
EnsureOcrLanguageStrings()
; update the global variable for current language used by Braille tranlation rules:
UpdateBrlLanguageAndMode ()
; Turn off Forms Mode to ensure all internal functions that depend upon the virtual cursor can work.
if IsFormsModeActive () then
	TurnOffFormsMode (FormsModeEventSpeechSilent)
endIf
endFunction

void function QuickSettingsPostProcess ()
;Code goes here which runs after QuickSettings and before loading the document-specific settings..
;FlushTouchNavigationConfiguration allows the touch navigation configuration cache for the current config to update:
FlushTouchNavigationConfiguration(GetActiveConfiguration())
SmartNavSettingsReloadFromQuickSettings ()
endFunction

void function QuickSettingsLoadDocumentSettings ()
;Do not add LoadNonJCFOptions, that is already done for you.
;Add your iniRead code from document-specific files, e.g. Personalized settings.
endFunction

Script QuickSettings ()
if getRunningFSProducts () == product_MAGic then
	;do nothing if MAGic-specific limitations are not met:
	if  ! gbSupportsMAGicOptions && ! isVirtualPcCursor () && ! IsFormsModeActive () then
		return
	endIf
endIf
If !AreUtilitiesAllowed() then
	return
endIf
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
var
int oldSplitMode=BrailleGetSplitMode()
BrailleSplitMode(0)
QuickSettingsPreProcess ()
LaunchQuickSettings ()
delay (2, TRUE)
loadNonJCFOptions (); update application-wide options.
SetUpStuffForNewPage (TRUE)
QuickSettingsPostProcess ()
QuickSettingsLoadDocumentSettings ()
BrailleSplitMode(oldSplitMode)
endScript

Script PersonalizeSettings ()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
;To launch Qick Settings and point specifically to the Document Settings node.
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
QuickSettingsPreProcess ()
LaunchQuickSettings ()
delay (2, TRUE)
loadNonJCFOptions (); update application-wide options.
LoadDocumentSettings ()
EndScript

void Function SayExtendedHelpHotKey ()
var
	string sMessageLong,
	string sMessageShort,
	string sAppName
let sAppName = GetWindowName (GetAppMainWindow (GetCurrentWindow ()))
let sMessageLong = FormatString (cmsg213_L, sAppName)
let sMessageShort = FormatString (cmsg213_S, sAppName)
SayFormattedMessage (OT_APP_START, sMessageLong, sMessageShort)
EndFunction

String Function GetCorrespondingHelpFile (string strApp)
var
	string strHelpFile
let strHelpFile = FindJAWSHelpFile (strApp)
return strHelpFile
EndFunction

Void Function AppFileTopic (int iTopic)
var
	string strHelpFile
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
let strHelpFile = "JFW"
If iTopic then
	ShowHelpByID (strHelpFile, iTopic)
Else
	SayFormattedMessage (ot_error, cmsg201_L, cmsg201_S); "There is no JAWS specific help for this application "
	ShowHelpByID (strHelpFile, 0);Kill Virtual Buffer and close help window ...
endIf
EndFunction

Void Function AppWillNotSpeakEvent (string strApp)
var
	string sMessage
let sMessage = FormatString (cmsg202_L, strApp)
SayFormattedMessage (ot_JAWS_message, sMessage)
EndFunction

Script ListTaskTrayIcons ()
If !(GetRunningFSProducts() & product_JAWS)
	return
endIf
if InHJDialog ()
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
if IsWindows10()
	ListWin10TaskTrayIcons ()
else
	ListWin7TaskTrayIcons ()
endIf
EndScript

void function ListWin7TaskTrayIcons ()
var int nItems = SysTrayGetItemCount ()
if nItems <= 0
	Say (cmsgListTaskTrayIconsError1, OT_ERROR)
	return
endIf
var
	string strTip,
	string GraphicList,
	int nIdx
for nIdx = 1 to nItems
	strTip = SysTrayGetItemToolTip (nIdx)
	;NOTE: The item should be added to the GraphicList even if it is an empty string.
	GraphicList = GraphicList + LIST_ITEM_SEPARATOR + strTip
EndFor
if !GraphicList
	Say (cmsgListTaskTrayIconsError1, OT_ERROR)
	return
endIf
var
	int ScreenHeight = ScreenGetHeight (),
	int ScreenWidth = ScreenGetWidth (),
	int MagicState = MagGetState (),
	int iTetherOption = GetDefaultJCFOption (OPT_TETHER_JAWS_TO_PC),
	int nButton
; Temporarily turn off the Tether JAWS to PC option and the virtual cursor:
SetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC, 0)
nButton = DlgSysTray (GraphicList, nIdx)
if nIdx > 0 && nButton > 7000
	SaveCursor ()
	JAWSCursor ()
	SaveCursor ()
	if (MagicState > 0)
		MoveTo (ScreenWidth - 2, ScreenHeight - 2)
		Delay (10, TRUE)
	endIf
  SysTrayMoveToItem (nIdx)
  if MagicState > 0
    Delay (10, TRUE)
  endIF
  if nButton == iD_RightSingleClick
    RightMouseButton ()
  elif nButton == iD_LeftSingleClick
    LeftMouseButton ()
  elif nButton == iD_LeftDoubleClick
    LeftMouseButton ()
    LeftMouseButton ()
  endIf
	Delay(5)
	RestoreCursor()
	RestoreCursor()
endIf
Pause ()
SetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC, iTetherOption)
EndFunction

void function ListWin10TaskTrayIcons ()
var
	handle hWndTray,
	handle hWndTop
hWndTop = FindTopLevelWindow(ShellTrayClass,cscNull)
if !hWndTop
	Say (cmsgListTaskTrayIconsError1, OT_ERROR)
	return
endIf
var
	object element,
	int iTreeScope = TreeScope_Children
hWndTray = FindWindow(hWndTop,cwc_TrayNotifyWnd)
if hWndTray
	element = FSUIAGetElementFromHandle (hWndTray)
	;It is expected that hWndTray for className cwc_TrayNotifyWnd will be found in all three cases, Win10, early Win11, and newer Win11.
	;However, it is only useful for Win10 and early versions of Win11
	if FSUIAGetFirstChildOfElement (element)
		;Win 10 and Early versions of Win11
		;Need all descendant buttons of hWndTray (className=cwc_TrayNotifyWnd)
		iTreeScope = TreeScope_Descendants
	else
		;Newer versions of Win11
		;hWndTray for className=cwc_TrayNotifyWnd has no children
		;Set hWndTray to Null so that it can be set to the neded window in the next if statement
		hWndTray = Null()
	endIf
endIf
if !hWndTray
	;Windows11SysTrayIconsClass is found in earlier versions of Win11, but it is only an ancestor of a portion of the needed buttons
	;This is why cwc_TrayNotifyWnd is checked before Windows11SysTrayIconsClass
	hWndTray = FindWindow(hWndTop,Windows11SysTrayIconsClass)
	if hWndTray
		element = FSUIAGetElementFromHandle (hWndTray)
	endIf
endIf
if !hWndTray
|| !element
|| !iTreeScope
	Say (cmsgListTaskTrayIconsError1, OT_ERROR)
	return
endIf
var
	object condition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyId,UIA_ButtonControlTypeID),
	object buttons
if condition
	buttons = element.findAll(iTreeScope,condition)
endIf
if !buttons.count
	;in case UIA fails, fallback to legacy:
	ListWin7TaskTrayIcons ()
	return
endIf
var
	variantArray buttonArray,
	collection c,
	int x, int y,
	int i, int j, int n
n = buttons.count
buttonArray = new variantArray[n]
for i = 0 to n-1
	if buttons(i).classNAMe != UIAClass_TrayShowDesktopButtonWClass
		buttons(i).GetClickablePoint( intRef(x), intRef(y))
		c = new collection
		c.name = StringTrimLeadingAndTrailingBlanks (buttons(i).name)
		c.x = x
		c.y = y
		j = j+1
		buttonArray[j] = c
	endIf
endFor
var string dlgList, string dlgListItem
for i = 1 to j
	dlgListItem = buttonArray[i].name
	dlgList = dlgList+LIST_ITEM_SEPARATOR+dlgListItem
endFor
var
	int nIdx,
	int ScreenHeight = ScreenGetHeight (),
	int ScreenWidth = ScreenGetWidth (),
	int MagicState = MagGetState (),
	int iTetherOption = GetDefaultJCFOption (OPT_TETHER_JAWS_TO_PC),
	int nButton
;Temporarily turn off the Tether JAWS to PC option and the virtual cursor:
SetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC, 0)
nButton = DlgSysTray (dlgList,nIdx)
if nIdx > 0 && nButton > 7000
	SaveCursor ()
	JAWSCursor ()
	SaveCursor ()
	if MagicState > 0
		MoveTo (ScreenWidth - 2, ScreenHeight - 2)
		Delay (10, TRUE)
	endIf
  MoveTo(buttonArray[nIdx].x,buttonArray[nIdx].y)
  if MagicState > 0
    Delay (10, TRUE)
  endIF
  if nButton == iD_RightSingleClick
    RightMouseButton ()
  elif nButton == iD_LeftSingleClick
    LeftMouseButton ()
  elif nButton == iD_LeftDoubleClick
    LeftMouseButton ()
    LeftMouseButton ()
  endIf
	Delay(5)
	RestoreCursor()
	RestoreCursor()
endIf
Pause ()
SetDefaultJcfOption (OPT_TETHER_JAWS_TO_PC, iTetherOption)
EndFunction

string function tvGetPathToSelection(handle hWnd)
var
	int iSubtype,
	int iTVLevel,
	int iTVItem,
	string sTVPath
let iSubtype = GetWindowSubtypeCode(hWnd)
if iSubtype != wt_TreeView
&& iSubtype != wt_TreeViewItem then
	return cscNull
EndIf
let iTVItem = tvGetSelection(hWnd)
let iTVLevel = GetTreeviewLevel()
while iTVLevel
	let iTVItem = tvGetParent(hWnd,iTVItem)
	let sTVPath = tvGetItemText(hWnd,iTVItem)+List_item_separator+sTVPath
	let iTVLevel = iTVLevel-1
EndWhile
return sTVPath
EndFunction

int function GetTreeViewItemState()
var int State = GetControlAttributes() & ~CTRL_SELECTED
;All windows whose class name contains the text UI are suspect to not handle closed controls properly:
if stringContains (getWindowClass (getFocus ()), "UI")
	if State && !(State & CTRL_OPENED)  ;closed but using different state bits. 0x0000l attributes = selection normal, leaf node.
		State = (State & CTRL_CLOSED)
	endIf
endIf
return state
EndFunction

void function SayTreeViewItem()
var
	int bIsMSAAWindow = IsMSAAWindow(getFocus()),
	int nSubtype = GetObjectSubtypeCode()
if bIsMSAAWindow
&& (nSubtype == WT_CHECKBOX || nSubtype == WT_RADIOBUTTON)
	SayObjectActiveItem()
	return
endIf
var
	int nOutputType,
	int nState,
	string sValue,
	string sDescription
;Hj Dialogs  set options, so don't use line:
If InHjDialog () then
	nOutputType = OT_TEXT
Else
	nOutputType = OT_LINE
EndIf
if bIsMSAAWindow
&& nSubtype == WT_TREEVIEWITEM
	sValue = GetObjectName ()
	If !sValue
		sValue  = (tvGetFocusItemText (GetFocus ()))
	EndIf
	SayMessage (nOutputType, sValue)
	nState = GetTreeViewItemState()
	if (nState) IndicateControlState (nSubtype, nState) endIf
	sDescription = GetObjectDescription ()
	if sDescription
		Say (sDescription, OT_CONTROL_DESCRIPTION)
	endIf
else
	sValue = SmartGetTreeViewObjectValue()
	if (!sValue)
		sValue = (tvGetFocusItemText (GetFocus ()))
	endif
	; eclipse has treeviews with columns and these columns are in the AccDescription, so if this is a
	; TreeviewWithColumns, append description
	if TreeWithColumns ()
		var string description = GetObjectDescription(SOURCE_CACHED_DATA, 0)
		if (StringLength(description) && StringContains(sValue, description) == 0)
			sValue = sValue + cscSpace + description
		EndIf
	EndIf
	SayMessage (nOutputType, sValue)
	nState = GetTreeViewItemState()
	if (!bIsMSAAWindow)
		; remove open / closed / haschildren properties so only checked and unchecked related states are spoken.
		nState = nState&~(CTRL_HASCHILDREN|CTRL_EXPANDED|CTRL_COLLAPSED|CTRL_OPENED|CTRL_CLOSED)
	endIf
	if (nState) IndicateControlState (nSubtype, nState) endIf
	;FlexibleWebNumberOfActiveRules already checks to ensure we're in in the right place to get any text, otherwise returns null:
	sayMessage (OT_SCREEN_MESSAGE, FlexibleWebNumberOfActiveRules ())
endIf
EndFunction

void Function SayTreeViewLevel(optional int IntelligentPositionAnnouncement)
var
	handle hWnd,
	string sMessage,
	int iLevel,
	int bLevelChanged,
	string sLevel,
	int iItem,
	int iItemParent,
	string sItemParentText,
	string sPath,
	string sPosition
let iLevel = GetTreeviewLevel()
If iLevel != PreviousTreeviewLevel then
	let bLevelChanged = true
	let sLevel = IntToString (iLevel)
	let sMessage = FormatString (cmsg233_L, sLevel)
	SayMessage (OT_POSITION, sMessage, sLevel) ; "level "
	let PreviousTreeViewLevel= iLevel
endIf
let hWnd = GetFocus()
let sPosition = PositionInGroup()
if ( False == IsJavaWindow (hWnd) ) then
	let iItem = tvGetSelection(hWnd)
	let iItemParent = tvGetParent(hWnd,iItem)
	let sPath = tvGetPathToSelection(hWnd)
	if iLevel > 0 then
		if iItemParent != giSayTreeViewLevelPrevItemParent then
			let sItemParentText = tvGetItemText(hWnd, iItemParent)
		EndIf
	EndIf
	let giSayTreeViewLevelPrevItemParent = iItemParent
EndIf
If !IsPcCursor () then
	SayLine ()
	Return
EndIf
SayTreeViewItem()
if !sItemParentText
&& IntelligentPositionAnnouncement
&& !bLevelChanged then
	;we don't want to announce the position or the parent node.
	return
EndIf
if sPath != gsTvPathToPrevSelection
|| bLevelChanged
|| sPosition != gsTVPrevPositionInGroup then
	SayMessage(OT_POSITION, sPosition)
	If InHjDialog () then
		if sItemParentText then
			SayUsingVoice(vctx_message,sItemParentText,ot_position)
		EndIf
	EndIf
EndIf
let gsTvPathToPrevSelection = sPath
let gsTVPrevPositionInGroup = sPosition
EndFunction

Void Function TooltipEvent (handle hWnd, string strText, string appName)
if strText == GetObjectName() then
	;Ignore this, otherwise double speaking occurs when tooltips are announced as an item gains focus.
	;Also, these aren't the kind of tooltips we need to keep track of and report to the user on request.
	return
endIf
strLastTooltip = strText
;if we're on the clock, we need some different text:
if StringContains (strText, cscDateTimeToolTip) then
	strLastTooltip = SysGetTime () + cscBufferNewLine + SysGetDate ()
endIf
gStrLastTipFromEvent = strText
ghwndToolTip = hWnd
;Trim away any text already spoken by mouse echo.
;Save the untrimmed text for recalling the tooltip text,
;but avoid any double speaking by only speaking the trimmed text.
var string strToolTipTextToSpeak = StringTrimSpokenMouseEchoTextFromToolTipText(strLastTooltip )
var int outputType
var collection notificationRuleActions
if GetWindowClass(GetParent(hWnd)) == cwc_ToastChildWindowClass
	outputType = ot_toasts
	notificationRuleActions = ProcessNotification(strToolTipTextToSpeak, appName)
	; Skype 8 and later can use toasts, so update the insert+space&r keystroke:
	if stringContains (strToolTipTextToSpeak, "Skype") then LastBackgroundNotificationText = strToolTipTextToSpeak endIf
	if !notificationRuleActions.ExcludeFromNotificationHistory then
		StoreSpokenNotificationForRepeat (strToolTipTextToSpeak, appName) ; for new insert+Space&N keystroke.
	endIf
	SayNotification(notificationRuleActions, outputType)
	; We need to clear the last notification sender to avoid misattributing notifications to apps
	ClearLastNotificationSender()
else
; Tooltips are not stored in history.
; Do not use collection unnecessarily, creating a new object only to destroy it immediately
	sayMessage(OT_TOOL_TIP, strToolTipTextToSpeak)
endIf
EndFunction

; Auto Graphics labeler section
globals
	int g_AutoLabeledGraphics

String Function GetGraphicNameAtPoint (int iX, int iY)
SaveCursor ()
JAWSCursor ()
MoveTo (iX + 1, iY - 1)
If (GetCharacterAttributes () & ATTRIB_GRAPHIC) Then
	return GetCharacter () ; Use GetWord () if this fails
Else
	return ""
endIf
EndFunction

void Function AutoGraphicsLabelerHelper(int nLeft,int nTop,int nRight,int nBottom)
var
	Int iX,
	Int iY,
	int nGraphicIdNoMouseOnIt,
	int nGraphicIdWithMouseOnIt,
	int nLoops,
	int nAttributes,
	String strLabel,
	String strGraphicName,
	String strTemp
;SaveCursor();No longer needed.
InvisibleCursor()
let iX = nLeft+(nRight-nLeft)/2
let iY = nTop+(nBottom-nTop)/2
MoveTo (iX, iY)
let nGraphicIdNoMouseOnIt = GetGraphicID()
JAWSCursor()
RouteJAWSToInvisible()
let nLoops  = 0
while (nLoops < 15 && strLastTooltip == "")
	delay(1)
	let nLoops = nLoops+1
EndWhile
If (strLastTooltip != "") then
	let strLabel = strLastTooltip
	let nGraphicIdWithMouseOnIt = GetGraphicID()
	if (nGraphicIdWithMouseOnIt) then
		let nAttributes = GetControlAttributes()
			if (nAttributes & CTRL_GRAYED) then
				let strLabel = strLabel + cScSpace +cmsgGrayedGraphic1_L
			endIf
			if (nAttributes & CTRL_PRESSED) then
				let strLabel = strLabel + cScSpace +cmsgPressedGraphic1_L
			endIf
			SetGraphicLabel(nGraphicIdWithMouseOnIt, strLabel, TRUE)
			if (nGraphicIdWithMouseOnIt != nGraphicIdNoMouseOnIt &&
			nGraphicIdNoMouseOnIt != 0) then
				SetGraphicLabel(nGraphicIdNoMouseOnIt,strLabel, TRUE)
			endIf
			let g_AutoLabeledGraphics = g_AutoLabeledGraphics+1
		endIf
	endIf
;RestoreCursor() ; No longer needed.
let strLastTooltip = ""
Delay(2)
if (IsKeyWaiting ())  then
	return 0
else
	return 1
endIf
EndFunction

Script AutoLabelGraphics ()
var
	int bProcessTooltipEvent,
	int nIncludeGraphics,
	string sMessageLong,
	string sMessageShort,
	string sLabeled
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
;cmsg242_L = "Starting auto graphic labeler"
SayFormattedMessage (ot_status, cmsg242_L, cmsg242_S)
Delay(2)
Refresh()
Delay(10)
SaveCursor()
JAWSCursor()
MoveTo(1,1)
let strLastTooltip = cScNull
let bProcessTooltipEvent = GetJcfOption (OPT_PROCESSTOOLTIPEVENT)
let nIncludeGraphics = GetJcfOption(OPT_INCLUDE_GRAPHICS)
SetJcfOption (OPT_PROCESSTOOLTIPEVENT, TRUE)
SetJcfOption (OPT_INCLUDE_GRAPHICS, 2)
let g_AutoLabeledGraphics = 0
GraphicsEnumerate(GetAppMainWindow(GetFocus()),"AutoGraphicsLabelerHelper")
SetJcfOption (OPT_PROCESSTOOLTIPEVENT, bProcessTooltipEvent)
SetJcfOption (OPT_INCLUDE_GRAPHICS, nIncludeGraphics)
RestoreCursor()
;cmsg243_L = "Auto labeler finished"
let sLabeled = IntToString (g_AutoLabeledGraphics)
let sMessageShort = FormatString (cmsg243_S, sLabeled)
let sMessageLong = FormatString (cmsg243_L, sLabeled)
SayFormattedMessage (ot_status, sMessageLong, sMessageShort)
EndScript

globals
	int g_AutoLabeledGraphics,
	string g_strGraphicsList,
	string g_strGraphicsListX,
	string g_strGraphicsListY

void Function GraphicsListHelper(int nLeft,int nTop,int nRight,int nBottom)
SaveCursor()
InvisibleCursor()
MoveTo (nLeft,nBottom-1)
if GetControlAttributes() & CTRL_GRAYED then
	;skip this graphic
	return TRUE
endIf
let g_strGraphicsList = g_strGraphicsList+LIST_ITEM_SEPARATOR+GetWord()
let g_strGraphicsListX = g_strGraphicsListX + LIST_ITEM_SEPARATOR+
IntToString(getCursorRow())
let g_strGraphicsListY = g_strGraphicsListY + LIST_ITEM_SEPARATOR+
IntToString(getCursorCol())
RestoreCursor()
return 1
EndFunction

void function ClickAtPoint(int nCol, int nRow, optional int bUseJAWSCursor)
;In applications where the JAWS cursor must be used to click the graphic,
;then pass true to parameter bUseJAWSCursor.
;In most applications, RoutePCToInvisible will click the graphic.
var
	int savedRestriction
SaveCursor()
if bUseJAWSCursor then
	JAWSCursor()
	savedRestriction = GetRestriction()
	SetRestriction(RestrictNone)
	SaveCursor()
	MoveTo(nCol,nRow)
	SetRestriction(savedRestriction)
	Delay(10)
	LeftMouseButton()
	RestoreCursor()
else
	InvisibleCursor()
	savedRestriction = GetRestriction()
	SetRestriction(RestrictNone)
	SaveCursor()
	MoveTo(nCol,nRow)
	RoutePCToInvisible()
	SetRestriction(savedRestriction)
	RestoreCursor()
EndIf
RestoreCursor()
EndFunction

void function RightClickAtPoint(int nCol, int nRow)
var
	int savedRestriction
SaveCursor()
JAWSCursor()
savedRestriction = GetRestriction()
SetRestriction(RestrictNone)
SaveCursor()
MoveTo(nCol,nRow)
SetRestriction(savedRestriction)
Delay(10)
RightMouseButton()
RestoreCursor()
RestoreCursor()
EndFunction

Script GraphicsList ()
var
	int nIncludeGraphics,
	int nIndex,
	int nRowToClick,
	int nColToClick
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
Refresh()
Delay(10)
SaveCursor()
let nIncludeGraphics = GetJcfOption(OPT_INCLUDE_GRAPHICS)
SetJcfOption (OPT_INCLUDE_GRAPHICS, 1) ; labeld graphics only
let g_strGraphicsList = cscNull
let g_strGraphicsListX = cscNull
let g_strGraphicsListY = cscNull
GraphicsEnumerate(GetAppMainWindow(GetFocus()),"GraphicsListHelper")
; remove leading delimiters
let g_strGraphicsList =stringChopLeft(g_strGraphicsList,1)
let g_strGraphicsListX = stringChopLeft(g_strGraphicsListX,1)
let g_strGraphicsListY =stringChopLeft(g_strGraphicsListY,1)
SetJcfOption (OPT_INCLUDE_GRAPHICS, nIncludeGraphics)
if g_strGraphicsList then
	let nIndex = DlgSelectItemInList (g_strGraphicsList,cMsgSelectGraphic, FALSE);
	if !nIndex then
		return
	endIf
	let nRowToClick = StringToInt(StringSegment(g_strGraphicsListX,LIST_ITEM_SEPARATOR,nIndex))
	let nColToClick = StringToInt(StringSegment(g_strGraphicsListY,LIST_ITEM_SEPARATOR,nIndex))
	ClickAtPoint(nColToClick,nRowToClick,TRUE)
Else
	SayFormattedMessage (OT_ERROR, cmsgNoGraphics1_L, cmsgNoGraphics1_S)
endIf
EndScript

Script SayPriorSentence()
if IsFormsModeActive()
&& isPcCursor() then
	if getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
		TurnOffFormsMode ()
	EndIf
endIf
PriorSentence ()

if SupportsEditCallbacks() then ;CaretMovedEvent will handle
	return
endIf

delay(1)
SaySentence ()
EndScript

Script SayNextSentence()
if IsFormsModeActive()
&& isPcCursor() then
	if getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
		TurnOffFormsMode ()
	EndIf
endIf
NextSentence ()

if SupportsEditCallbacks() then ;CaretMovedEvent will handle
	return
endIf

delay(1)
SaySentence ()
EndScript

Script SaySentence ()
var
	int iType
If IsJAWSCursor()
|| IsInvisibleCursor()
|| IsVirtualPcCursor() then
	indicateInconsistenciesInRange(CheckSentence)
	SaySentence()
	Return
EndIf
Let iType = GetWindowSubtypeCode(GetCurrentWindow ())
If !iType then
	Let iType = GetObjectSubtypeCode()
EndIf
if IsFormsModeActive() then
	if !iType
	|| iType == wt_dialog_page
	|| iType == wt_static
	|| iType == wt_ReadOnlyEdit
	|| iType == wt_multiline_edit then
		indicateInconsistenciesInRange(CheckSentence)
		SaySentence()
	else
		indicateInconsistenciesInRange(CheckLine)
		SayLine()
	EndIf
	return
EndIf
if DialogActive()
|| iType == WT_TREEVIEW
|| iType == WT_Listview
|| iType == 	WT_EDITCOMBO
|| iType == WT_Listbox
|| iType == WT_MULTISELECT_LISTBOX
|| iType == WT_EXTENDEDSELECT_LISTBOX
|| iType == WT_Combobox
|| GetWindowClass (GetCurrentWindow()) == cwcMsoCmd then
	indicateInconsistenciesInRange(CheckLine)
	SayLine ()
	Return
EndIf
SetDocumentReadingStartLocation ()
indicateInconsistenciesInRange(CheckSentence)
SaySentence()
EndScript

Script SayPriorParagraph()
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if IsFormsModeActive()
&& isPcCursor() then
	if getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
		TurnOffFormsMode ()
	EndIf
endIf
if FocusWindowSupportsUIA () then
	TypeKey(cksControlUpArrow)
else
	PriorParagraph()
EndIf
If SayAllInProgress() then
	Return
EndIf
indicateInconsistenciesInRange(CheckParagraph)
if !SayParagraph() then
	SayMessage(OT_error, cMSG276_L)
	SayMessage(OT_error, cMSG277_L, cmsgSilent)
endIf
EndScript

Script SayParagraph ()
SetDocumentReadingStartLocation ()
if !SayParagraph() then
	SayMessage (OT_error, cMSG276_L)
	SayMessage(OT_error, cMSG277_L, cmsgSilent)
endIf
EndScript

Script SayNextParagraph()
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if IsFormsModeActive()
&& isPcCursor() then
	if getObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_EDIT then
		TurnOffFormsMode ()
	EndIf
endIf
if FocusWindowSupportsUIA () then
	TypeKey(cksControlDownArrow)
else
	NextParagraph()
EndIf
If SayAllInProgress() then
	Return
EndIf
indicateInconsistenciesInRange(CheckParagraph)
if !SayParagraph() then
	SayMessage(OT_error, cMSG276_L)
	SayMessage(OT_error, cMSG277_L, cmsgSilent)
endIf
EndScript

void function GetTextInfoForControlBackSpace(string byRef sText)
SaveCursor()
InvisibleCursor ()
RouteInvisibleToPc ()
SaveCursor()
PriorWord ()
if GetCurrentWindow() == GetFocus() then
	sText = GetWord()
EndIf
PCCursor()
RestoreCursor ()
RestoreCursor ()
EndFunction

Script ControlBackSpace ()
If IsVirtualPcCursor () then
	If UserBufferIsActive () then
		Return; Do not process unless so directed in app-specific script file
	EndIf
EndIf
var	string sText
GetTextInfoForControlBackSpace(sText)
if sText
	SayMessage(ot_line,sText)
endIf
TypeCurrentScriptKey ()
EndScript

Script SaySystemTime ()
var
	string sTimeOrDate
if GetRunningFSProducts() == product_MAGic
&& IsSpeechOff() then
	ExMessageBox(FormatString(cMsgGetSysTimeAndDate,SysGetTime(),SysGetDate()),
		cscNull,MB_ICONINFORMATION)
	return
endIf
If (IsSameScript ()) then
	Let sTimeOrDate = FormatString (cmsgGetSysDate, SysGetDate ())
Else
	Let sTimeOrDate = FormatString (cmsgGetSysTime, SysGetTime ())
endIf
SayUsingVoice (	VCTX_MESSAGE, sTimeOrDate, ot_user_requested_information)
EndScript

Script SaySystemTimeWithSeconds ()
var
	string sTime
If (IsSameScript ())
	sTime = FormatString (cmsgSysGetWeekNumber, SysGetWeekNumber ())
else
	sTime = FormatString (cmsgGetSysTimeWithSeconds, SysGetTime (GetSystemLocaleInfo (LOCALE_STIMEFORMAT)))
endIf
SayUsingVoice (	VCTX_MESSAGE, sTime, ot_user_requested_information)
EndScript

Script Enter ()
SayCurrentScriptKeyLabel ()
enterKey()
EndScript

Script ShiftEnter ()
SayCurrentScriptKeyLabel ()
ShiftEnterKey()
EndScript

script ControlShiftEnter ()
SayCurrentScriptKeyLabel ()
ControlShiftEnterKey()
EndScript

script ControlEnter ()
PerformScript ControlEnter ()
EndScript

script MoveToFirstTable ()
MoveToFirstTable ()
EndScript

script MoveToNextTable ()
MoveToNextTable ()
EndScript

script MoveToPriorTable ()
MoveToPriorTable ()
EndScript

script MoveToLastTable ()
MoveToLastTable ()
EndScript

void function SayTableCellCoordinates()
var
int nCurCol,
int nCurRow,
string sMessage

GetCellCoordinates (nCurCol, nCurRow)
let sMessage = FormatString (cMSGColumnAndRow, IntToString (nCurRow), IntToString (nCurCol))
SayMessage(OT_POSITION,sMessage)
endFunction

void function CrossedTableBoundaryEvent(int iPrevTableIndex, int iPrevTableLevel, int iCurTableIndex, int iCurTableLevel)
; Prevent speaking of table boundaries crossing when using the Braille display:
if StringStartsWith (GetScriptAssignedTo(GetCurrentScriptKeyName()), "BraillePan") then return endIf
if iCurTableIndex >=1 then
	if iCurTableLevel  > 0 && iCurTableLevel != iPrevTableLevel && iPrevTableLevel  >=0 then
		; we've changed table nesting level
		SayUsingVoice(VCTX_MESSAGE,formatString(cmsgEnteringNestedTable_L, IntToString(iCurTableLevel)), OT_POSITION)
		SayTableCellCoordinates()
	elif (iCurTableIndex >=1 && iCurTableIndex != iPrevTableIndex) then
		;we've moved into a table, announce it
		SayUsingVoice(VCTX_MESSAGE, formatString(CMSGInTable,GetTableCaption()), OT_CONTROL_GROUP_NAME)
		SayTableCellCoordinates()
	EndIf
elif GetJCFOption(optSmartNavigation)==smartNavControlsAndTables && builtin::InTableCell() then
; indicate that we've just moved into a table.
; Schedule the function, however, so it runs after the script which speaks the result of the navigation.
		scheduleFunction("SayTableCellCoordinates", 1)
else ;not in a table
	if iPrevTableIndex >=1 then
		; we've moved out of a top-level table
		SayUsingVoice(VCTX_MESSAGE,CMSGOutOfTable, OT_POSITION)
	EndIf
endIf
EndFunction

Script Tab ()
globalSpeakHeaderOnCellChange = TABLE_NAV_SAY_COLUMN_AND_ROW_HEADERS
If (InHomeRowMode()) then
	PerformScript UtilityMoveToNextWindow ()
	Return
EndIf
SayCurrentScriptKeyLabel ()
if UserBufferIsActive() then
	If MoveToControlType(s_next,wt_link) then
	 	SayLine()
 	endIf
 	return
EndIf
;If is Virtual Pc Cursur, suppress echo of highlighted Text:
Let nLastSelectUnitTime = (GetTickCount()*IsVirtualPCCursor())
TabKey ()
If IsVirtualPcCursor()
&& !IsJavaWindow(GetCurrentWindow()) then
	NotifyIfContextHelp()
EndIf
EndScript

Script ShiftTab ()
globalSpeakHeaderOnCellChange = TABLE_NAV_SAY_COLUMN_AND_ROW_HEADERS
If (InHomeRowMode()) then
	PerformScript UtilityMoveToPriorWindow ()
	Return
EndIf
SayCurrentScriptKeyLabel ()
if UserBufferIsActive() then
	If MoveToControlType(s_prior,wt_link) then
		SayLine()
		return
	EndIf
EndIf
;If is Virtual Pc Cursur, suppress echo of highlighted Text:
Let nLastSelectUnitTime = (GetTickCount()*IsVirtualPCCursor())
ShiftTabKey ()
If IsVirtualPcCursor()
&& !IsJavaWindow(GetCurrentWindow()) then
	NotifyIfContextHelp()
EndIf
EndScript

script MoveToFirstList()
MoveToFirstList()
EndScript

script MoveToNextList()
MoveToNextList()
EndScript

script MoveToPriorList()
MoveToPriorList()
EndScript

script MoveToLastList()
MoveToLastList()
EndScript

script MoveToFirstVisitedLink()
MoveToFirstVisitedLink()
EndScript

script MoveToLastVisitedLink()
MoveToLastVisitedLink()
EndScript

script MoveToNextVisitedLink()
MoveToNextVisitedLink()
EndScript

script MoveToPriorVisitedLink()
MoveToPriorVisitedLink()
EndScript

script MoveToFirstUnvisitedLink()
MoveToFirstUnvisitedLink()
EndScript

script MoveToLastUnvisitedLink()
MoveToLastUnvisitedLink()
EndScript

script MoveToNextUnvisitedLink()
MoveToNextUnvisitedLink()
EndScript

script MoveToPriorUnvisitedLink()
MoveToPriorUnvisitedLink()
EndScript

script MoveToAnyNextLink()
MoveToAnyNextLink()
EndScript

script MoveToAnyPriorLink()
MoveToAnyPriorLink()
EndScript

Script MoveToNextNonLinkText ()
MoveToNextNonLinkText ()
EndScript

Script MoveToPriorNonLinkText ()
MoveToPriorNonLinkText ()
EndScript

int function GetJCFOptionFromFile(string Section, string JCFKey)
return ReadSettingInteger(section,JCFKey,
	ReadSettingInteger(Section,JCFKey,1,FT_DEFAULT_JCF,rsNoTransient),
	FT_CURRENT_JCF,rsNoTransient)
endFunction

void function VirtualPCCursorToggle ()
var
	int iSetting,
	int iJCFSetting
let iSetting = GetJCFOption (OPT_VIRTUAL_PC_CURSOR)
let iJCFSetting = GetJCFOptionFromFile(SECTION_OSM,hkey_UseVirtualPCCursor)
if IsSameScript () then
	;The setting of 2 is for Win8 apps where it has been specified in the JCF file,
	;and setting default memory to 2 is not generally desirable and so is not allowed.
	if iJCFSetting < 2 then
		SetDefaultJCFOption(OPT_VIRTUAL_PC_CURSOR, iSetting)
		if GetJCFOption (OPT_VIRTUAL_PC_CURSOR)==0 then
			Refresh()
			SayFormattedMessage (OT_status, cMSG338_L, cMSG338_S) ;"The virtual cursor will be turned off for all applications"
		else
			SayFormattedMessage (OT_status, cMSG339_L, cMSG339_S) ;"The virtual cursor will be turned on for all applications"
		endIf
	else
		SayMessage(ot_error,cmsgUseVirtualPCCursorGlobalToggleNotAvailable)
		;now say what it is currently set to:
		if iSetting == 1 then
			SayFormattedMessage(ot_status, cMSG291_L, cMSG_on)
		else
			SayFormattedMessage(ot_status,
				FormatString(cmsgUseVPCResetForApp,GetActiveConfiguration ()))
		EndIf
	EndIf
	;update the global used by VirtualCursorChangedEvent, since it doesn't fire when the script is used to toggle the state:
	globalSavedVirtualCursorState = IsVirtualPCCursor()
	return
endIf
;For Win8 apps where the JCF is set to 2,
;only allow toggle between 1 and 2.
;Otherwise, only allow toggle between 0 and 1.
if iSetting == 0
|| iSetting == 2 then
	SetJCFOption(OPT_VIRTUAL_PC_CURSOR, 1)
	SayFormattedMessage(ot_status, cMSG291_L, cMSG_on)
	if iSetting == 2 then
		;Refresh if setting was 2,
		;to insure focus is updated to current virtual location:
		refresh()
		BrailleRefresh()
	EndIf
else
	if iJCFSetting == 2 then
		SetJCFOption(OPT_VIRTUAL_PC_CURSOR, 2)
		SayFormattedMessage(ot_status,
			FormatString(cmsgUseVPCResetForApp,GetActiveConfiguration ()))
	else
		refresh()
		SetJCFOption(OPT_VIRTUAL_PC_CURSOR, 0)
		SayFormattedMessage(ot_status, cmsg292_l, cmsg_off)
		BrailleRefresh()
	EndIf
endIf
;update the global used by VirtualCursorChangedEvent, since it doesn't fire when the script is used to toggle the state:
globalSavedVirtualCursorState = IsVirtualPCCursor()
EndFunction

void function VirtualUIACursorToggle ()
var int setting = GetJCFOption(OPT_USE_VIRTUAL_CURSOR_FOR_UWP_APPS)
setting = !setting
SetJCFOption(OPT_USE_VIRTUAL_CURSOR_FOR_UWP_APPS,setting)
if setting
	SayFormattedMessage(ot_status, cMSG_UseVPCForUWP_On_L, cMSG_on)
else
	SayFormattedMessage(ot_status, cMSG_UseVPCForUWP_Off_L, cmsg_off)
endIf
EndFunction

Script VirtualPCCursorToggle ()
if IsUIAVirtualCursorApplicable()
	VirtualUIACursorToggle ()
else
	VirtualPCCursorToggle ()
	if IsVirtualPCCursor () && DialogActive(false) then
		RestrictViewToEnclosingType(wt_dialog)
	endIf
endIf
EndScript

Script AdjustHTMLSettings ()
var
	string list
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
if (IsSpeechOff ()) then
	;Note that function MuteSynthesizerToggle is no longer being used to turn off speech.
	JAWSProcessorSpeechOn()
	return
endIf
let list = GraphicsToggleItem +
	LinksToggleItem +
	ImageMapToggleItem +
	LinkTypeToggleItem +
	SamePageLinkToggleItem +
	IncrementMaxLineLengthItem +
	DecrementMaxLineLengthItem +
	IncrementMaxBlockLengthItem +
	DecrementMaxBlockLengthItem +
	FrameIndicationToggleItem +
	ScreenFollowsVCursorToggleItem +
	SkipPastRepeatedTextToggleItem +
	TextLinksVerbosityItem +
	IncrementLinesPerPageItem +
	DecrementLinesPerPageItem+
	IndicateHeadingsItem
DlgSelectFunctionToRun (list, HTMLOptionsDialogName, false)
EndScript

Script SayCell ()
var
	int iNestingLevel
if (FALSE == InTable ()) then
	SayFormattedMessage (OT_error, cMSGNotInTable_L, cMSGNotInTable_S)
	Return;
EndIf
SpeakTableCells (TABLE_NAV_NONE, 0)
let iNestingLevel = GetTableNestingLevel()
if iNestingLevel > 0 then
	SayUsingVoice(VCTX_MESSAGE,formatString(cmsgEnteringNestedTable_L, IntToString(iNestingLevel)), OT_POSITION)
EndIf
EndScript

Script SayNextRow ()
var
	int nPrevNumOfCols,
	int nNumRows,
	int nCurCol,
	int nCurRow
; Virtual Cursor only
if !IsVirtualPcCursor() then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	Return
endIf
if TableErrorEncountered(TABLE_NAV_SAY_ROW) then
	Return
endIf
Let nPrevNumOfCols = GetCurrentRowColumnCount ()
;; Deal with Java JTable objects
if (TRUE == IsJavaWindow (GetCurrentWindow ())) then
	if (TRUE == SayAllInProgress ()) then
		return
	endIf
	let nNumRows = GetTableRowCount ()
	GetCellCoordinates (nCurCol, nCurRow)
	if (nCurRow == nNumRows) then
		SayFormattedMessage (OT_ERROR, cMsgLastRow_L, cMsgLastRow_S)
	else
		let g_JavaPrevNumOfCells = nPrevNumOfCols
		let g_JavaTableNavDir = TABLE_NAV_SAY_ROW
		SaveCursor ()
		PcCursor ()
		TypeKey (cksDownArrow) ; down arrow
	endIf
	return
endIf
if (FALSE == DownCell ()) then
	SayFormattedMessage (OT_ERROR, cMsgLastRow_L, cMsgLastRow_S)
	Return
endIf
if (FALSE == SayAllInProgress ()) then
	SpeakTableCells (TABLE_NAV_SAY_ROW, nPrevNumOfCols)
else ;In SayAll
	StartOfRow ()
endIf
EndScript

Script SayPriorRow ()
var
	int nPrevNumOfCols,
	int nNumRows,
	int nCurCol,
	int nCurRow
; Virtual Cursor only
if !IsVirtualPcCursor() then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	Return
endIf
if TableErrorEncountered(TABLE_NAV_SAY_ROW) then
	Return
endIf
Let nPrevNumOfCols = GetCurrentRowColumnCount ()
;; Deal with Java JTable objects
if (TRUE == IsJavaWindow (GetCurrentWindow ())) then
	if (TRUE == SayAllInProgress ()) then
		return
	endIf
	let nNumRows = GetTableRowCount ()
	GetCellCoordinates (nCurCol, nCurRow)
	if (1 == nCurRow) then
		SayFormattedMessage (OT_ERROR, cMsgFirstRow_L, cMsgFirstRow_S)
	else
		let g_JavaPrevNumOfCells = nPrevNumOfCols
		let g_JavaTableNavDir = TABLE_NAV_SAY_ROW
		SaveCursor ()
		PcCursor ()
		TypeKey (cksUpArrow) ; up arrow
	endIf
	return
endIf
if (FALSE == UpCell ()) then
	SayFormattedMessage (OT_ERROR, cMsgFirstRow_L, cMsgFirstRow_S)
	Return
endIf
if (FALSE == SayAllInProgress ()) then
	SpeakTableCells (TABLE_NAV_SAY_ROW, nPrevNumOfCols)
else ;In SayAll
	StartOfRow ()
endIf
EndScript

Script SayNextColumn()
var
	int nPrevNumOfRows,
	int nNumCols,
	int nCurRow,
	int nCurCol
if !IsVirtualPcCursor() then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	Return
endIf
if TableErrorEncountered(TABLE_NAV_SAY_COLUMN) then
	Return
endIf
Let nPrevNumOfRows = GetTableRowCount()
if IsJavaWindow (GetCurrentWindow()) then
	if SayAllInProgress() then
		return
	endIf
	let nNumCols = GetCurrentRowColumnCount ()
	GetCellCoordinates (nCurCol, nCurRow)
	if nCurCol == nNumCols then
		SayFormattedMessage (OT_ERROR, cMsgLastColumn_L, cMsgLastColumn_S)
	else
		let g_JavaPrevNumOfCells = nPrevNumOfRows
		let g_JavaTableNavDir = TABLE_NAV_SAY_COLUMN
		SaveCursor ()
		PcCursor ()
		TypeKey (cksRightArrow)
	endIf
	return
endIf
if !NextCell() then
	SayFormattedMessage (OT_ERROR, cMsgLastColumn_L, cMsgLastColumn_S)
	Return
endIf
if !SayAllInProgress() then
	SpeakTableCells (TABLE_NAV_SAY_COLUMN, nPrevNumOfRows)
else
	TopOfColumn()
endIf
EndScript

Script SayPriorColumn()
var
	int nPrevNumOfRows,
	int nNumCols,
	int nCurRow,
	int nCurCol
if !IsVirtualPcCursor() then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	Return
endIf
if TableErrorEncountered(TABLE_NAV_SAY_COLUMN) then
	Return
endIf
Let nPrevNumOfRows = GetTableRowCount()
if IsJavaWindow (GetCurrentWindow()) then
	if SayAllInProgress() then
		return
	endIf
	let nNumCols = GetCurrentRowColumnCount ()
	GetCellCoordinates (nCurCol, nCurRow)
	if nCurCol == 1 then
		SayFormattedMessage (OT_ERROR, cMsgFirstColumn_L, cMsgFirstColumn_S)
	else
		let g_JavaPrevNumOfCells = nPrevNumOfRows
		let g_JavaTableNavDir = TABLE_NAV_SAY_COLUMN
		SaveCursor ()
		PcCursor ()
		TypeKey(cksLeftArrow)
	endIf
	return
endIf
if !PriorCell() then
	SayFormattedMessage (OT_ERROR, cMsgFirstColumn_L, cMsgFirstColumn_S)
	Return
endIf
if !SayAllInProgress() then
	SpeakTableCells (TABLE_NAV_SAY_COLUMN, nPrevNumOfRows)
else
	TopOfColumn()
endIf
EndScript

int function NavigateJavaTable(int UnitMovement)
var
	int nCurCol,
	int nCurRow,
	int iCurCellLoc,
	int iBoundaryCellNumber,
	int iBoundaryRowNumber,
	int iBoundaryColNumber
if !IsJavaWindow(GetCurrentWindow()) then
	return false
EndIf
GetCellCoordinates(nCurCol, nCurRow)
if UnitMovement == UnitMove_Prior then
	let iBoundaryCellNumber = 1
	let iCurCellLoc = nCurCol
ElIf UnitMovement == UnitMove_Next then
	let iBoundaryCellNumber = GetCurrentRowColumnCount()
	let iCurCellLoc = nCurCol
ElIf UnitMovement == UnitMove_First then
	let iBoundaryCellNumber = 1
	let iCurCellLoc = nCurCol
ElIf UnitMovement == UnitMove_Last then
	let iBoundaryCellNumber = GetCurrentRowColumnCount()
	let iCurCellLoc = nCurCol
ElIf UnitMovement == UnitMove_Up then
	let iBoundaryCellNumber = 1
	let iCurCellLoc = nCurRow
ElIf UnitMovement == UnitMove_Down then
	let iBoundaryCellNumber = GetTableRowCount()
	let iCurCellLoc = nCurRow
ElIf UnitMovement == UnitMove_Top then
	let iBoundaryCellNumber = 1
	let iCurCellLoc = nCurRow
ElIf UnitMovement == UnitMove_Bottom then
	let iBoundaryCellNumber = GetTableRowCount()
	let iCurCellLoc = nCurRow
ElIf UnitMovement == UnitMove_Start then
	let iBoundaryColNumber = 1
	let iBoundaryRowNumber = 1
ElIf UnitMovement == UnitMove_End then
	let iBoundaryColNumber = GetCurrentRowColumnCount()
	let iBoundaryRowNumber = GetTableRowCount()
EndIf
if iCurCellLoc == iBoundaryCellNumber then
	if UnitMovement == UnitMove_Prior then
		SayUsingVoice (VCTX_message, cMSGBeginningOfRow, OT_JAWS_message)
		SayCell()
	ElIf UnitMovement == UnitMove_Next then
		SayUsingVoice (VCTX_message, cMSGEndOfRow, OT_JAWS_message)
		SayCell()
	ElIf UnitMovement == UnitMove_First then
		SpeakTableCells (TABLE_NAV_ROW_EXTENTS, 0)
	ElIf UnitMovement == UnitMove_Last then
		SpeakTableCells (TABLE_NAV_ROW_EXTENTS, 0)
	ElIf UnitMovement == UnitMove_Up then
		SayUsingVoice (VCTX_message, cMSGTopOfColumn, OT_JAWS_message)
		SayCell()
	ElIf UnitMovement == UnitMove_Down then
		SayUsingVoice (VCTX_message, cMSGBottomOfColumn, OT_JAWS_message)
		SayCell()
	ElIf UnitMovement == UnitMove_Top then
		SpeakTableCells (TABLE_NAV_COLUMN_EXTENTS,GetCurrentRowColumnCount())
	ElIf UnitMovement == UnitMove_Bottom then
		SpeakTableCells (TABLE_NAV_COLUMN_EXTENTS,GetCurrentRowColumnCount())
	EndIf
ElIf nCurCol == iBoundaryColNumber
&& nCurRow == iBoundaryRowNumber then
	if UnitMovement == UnitMove_Start then
		SpeakTableCells(TABLE_NAV_TABLE_EXTENTS,GetCurrentRowColumnCount())
	ElIf UnitMovement == UnitMove_End then
		SpeakTableCells(TABLE_NAV_TABLE_EXTENTS,GetCurrentRowColumnCount())
	EndIf
else
	SaveCursor ()
	PCCursor ()
	if UnitMovement == UnitMove_Prior then
		let g_JavaPrevNumOfCells = 0
		let g_JavaTableNavDir = TABLE_NAV_HORIZONTAL
		TypeKey(cksLeftArrow)
	ElIf UnitMovement == UnitMove_Next then
		let g_JavaPrevNumOfCells = 0
		let g_JavaTableNavDir = TABLE_NAV_HORIZONTAL
		TypeKey(cksRightArrow)
	ElIf UnitMovement == UnitMove_First then
		let g_JavaPrevNumOfCells = 0
		let g_JavaTableNavDir = TABLE_NAV_ROW_EXTENTS
		TypeKey (cksHome) ; Home
	ElIf UnitMovement == UnitMove_Last then
		let g_JavaPrevNumOfCells = 0
		let g_JavaTableNavDir = TABLE_NAV_ROW_EXTENTS
		TypeKey(cksEnd)
	ElIf UnitMovement == UnitMove_Up then
		let g_JavaPrevNumOfCells = GetCurrentRowColumnCount ()
		let g_JavaTableNavDir = TABLE_NAV_VERTICAL
		TypeKey(cksUpArrow)
	ElIf UnitMovement == UnitMove_Down then
		let g_JavaPrevNumOfCells = GetCurrentRowColumnCount ()
		let g_JavaTableNavDir = TABLE_NAV_VERTICAL
		TypeKey(cksDownArrow)
	ElIf UnitMovement == UnitMove_Top then
		let g_JavaPrevNumOfCells = GetCurrentRowColumnCount ()
		let g_JavaTableNavDir = TABLE_NAV_COLUMN_EXTENTS
		TypeKey(cksControlHome)
	ElIf UnitMovement == UnitMove_Bottom then
		let g_JavaPrevNumOfCells = GetCurrentRowColumnCount ()
		let g_JavaTableNavDir = TABLE_NAV_COLUMN_EXTENTS
		TypeKey(cksControlEnd)
	ElIf UnitMovement == UnitMove_Start then
		let g_JavaPrevNumOfCells = GetCurrentRowColumnCount()
		let g_JavaTableNavDir = TABLE_NAV_TABLE_EXTENTS
		let g_JavaIgnoreNextActiveItemChange = 1
		TypeKey(cksControlHome)
		TypeKey(cksHome)
	ElIf UnitMovement == UnitMove_End then
		let g_JavaPrevNumOfCells = GetCurrentRowColumnCount()
		let g_JavaTableNavDir = TABLE_NAV_TABLE_EXTENTS
		let g_JavaIgnoreNextActiveItemChange = 1
		TypeKey(cksControlEnd)
		TypeKey(cksEnd)
	EndIf
endIf
return true
EndFunction

int function SayCellUnit(int UnitMovement)
SayCellUnitEx(UnitMovement, true, false)
endFunction

int function NavigateForSayCellUnitEx(int UnitMovement, int wantErrors, int nextOrPriorCellShouldWrap,
	int byRef iNavDir, int byRef nPrevNumOfCells)
nPrevNumOfCells = 0
if UnitMovement == UnitMove_Prior
	if PriorCell(nextOrPriorCellShouldWrap)
		iNavDir = TABLE_NAV_HORIZONTAL
		return true
	elif wantErrors
		if !SpeakHTMLTableBorderOrCaptionCursorNavigationError()
			SayUsingVoice (VCTX_message, cMSGBeginningOfRow, OT_JAWS_message)
	endIf
	endIf
	return false
ElIf UnitMovement == UnitMove_Next
	if NextCell(nextOrPriorCellShouldWrap)
		iNavDir = TABLE_NAV_HORIZONTAL
		return true
	elif wantErrors
		if !SpeakHTMLTableBorderOrCaptionCursorNavigationError()
			SayUsingVoice (VCTX_message, cMSGEndOfRow, OT_JAWS_message)
		endIf
	endIf
	return false
ElIf UnitMovement == UnitMove_First
	if StartOfRow ()
		iNavDir = TABLE_NAV_ROW_EXTENTS
		return true
	elif wantErrors
		if !SpeakHTMLTableBorderOrCaptionCursorNavigationError()
			SayUsingVoice (VCTX_message, cMsgStartOfRowFailed, OT_JAWS_message)
		endIf
	endIf
	return false
ElIf UnitMovement == UnitMove_Last
	if EndOfRow()
		iNavDir = TABLE_NAV_ROW_EXTENTS
		return true
	elif wantErrors
		if !SpeakHTMLTableBorderOrCaptionCursorNavigationError()
			SayUsingVoice(VCTX_message, cMsgEndOfRowFailed, OT_JAWS_message)
		endIf
	EndIf
	return false
ElIf UnitMovement == UnitMove_Up
	if UpCell()
		iNavDir = TABLE_NAV_VERTICAL
		nPrevNumOfCells = GetCurrentRowColumnCount()
		return true
	elif wantErrors
		if !SpeakHTMLTableBorderOrCaptionCursorNavigationError()
			SayUsingVoice (VCTX_message, cMSGTopOfColumn, OT_JAWS_message)
		endIf
	EndIf
	return false
ElIf UnitMovement == UnitMove_Down
	if DownCell()
	|| MoveFromHTMLTableStartOrCaptionToFirstTableCell()
		iNavDir = TABLE_NAV_VERTICAL
		nPrevNumOfCells = GetCurrentRowColumnCount()
		return true
	elif wantErrors
		;Test for border or caption error, because we cannot provide a way to move when at the end string:
		if !SpeakHTMLTableBorderOrCaptionCursorNavigationError()
			SayUsingVoice (VCTX_message, cMSGBottomOfColumn, OT_JAWS_message)
		endIf
	EndIf
	return false
ElIf UnitMovement == UnitMove_Top
	if TopOfColumn ()
		iNavDir = TABLE_NAV_COLUMN_EXTENTS
		nPrevNumOfCells = GetCurrentRowColumnCount ()
		return true
	elif wantErrors
		if !SpeakHTMLTableBorderOrCaptionCursorNavigationError()
			SayFormattedMessage(OT_error, cMsgTopOfColumnFailed, cMSGNotInTable_S) ; Could not move to Top of column
		endIf
	EndIf
	return false
ElIf UnitMovement == UnitMove_Bottom
	if BottomOfColumn()
		iNavDir = TABLE_NAV_COLUMN_EXTENTS
		nPrevNumOfCells = GetCurrentRowColumnCount ()
		return true
	elif wantErrors
		if !SpeakHTMLTableBorderOrCaptionCursorNavigationError()
			SayFormattedMessage (OT_error, cMsgBottomOfColumnFailed, cMSGNotInTable_s) ; Could not move to Bottom of column
		endIf
	EndIf
	return false
ElIf UnitMovement == UnitMove_Start
	if FirstCell ()
	|| MoveFromHTMLTableStartOrCaptionToFirstTableCell()
		iNavDir = TABLE_NAV_TABLE_EXTENTS
		nPrevNumOfCells = GetCurrentRowColumnCount ()
		return true
	elif wantErrors
		;Test for border or caption error, because we cannot provide a way to move when at the end string:
		if !SpeakHTMLTableBorderOrCaptionCursorNavigationError()
			SayFormattedMessage (OT_ERROR, cMSGNotInTable_l, cMSGNotInTable_S)
		endIf
	EndIf
	return false
ElIf UnitMovement == UnitMove_End
	if LastCell ()
		iNavDir = TABLE_NAV_TABLE_EXTENTS
		nPrevNumOfCells = GetCurrentRowColumnCount ()
		return true
	elif wantErrors
		if !SpeakHTMLTableBorderOrCaptionCursorNavigationError()
			SayFormattedMessage (OT_ERROR, cMSGNotInTable_L, cMSGNotInTable_S)
		endIf
	EndIf
	return false
endIf
return false
EndFunction

int  function SayCellUnitEx(int UnitMovement, int wantErrors, int nextOrPriorCellShouldWrap)
if wantErrors && TableErrorEncountered(UnitMoveToTableNavDir(UnitMovement))
	Return false
endIf
if NavigateJavaTable(UnitMovement)
	return false
EndIf
var
	int iNavDir,
	int nPrevNumOfCells,
	int iPrevTableLevel
iPrevTableLevel = GetTableNestingLevel()
if !NavigateForSayCellUnitEx(UnitMovement, wantErrors, nextOrPriorCellShouldWrap, iNavDir, nPrevNumOfCells)
	;When Smart Navigation is set to Controls And Tables, arrowing left from the start of the first row or right from the end of the last row will fail.
	;If we returned true from here, the Smart Navigation hook function would simply prevent the next/prior character script from running,
	;presuming that the table navigation succeeded.
	;Since we want to allow prior/next character to still work to move to whatever comes before or after this object in the virtual
	;document, we must return FALSE from here.
	;Note that because we are returning if no navigation occurs,
	;The SayCell script does not use this function to speak the current cell.
	return false
endIf
var
	int iTableLevel,
	int iSpeakPosition,
	string sNestingMsg
SpeakTableCells(iNavDir,nPrevNumOfCells)
iTableLevel = GetTableNestingLevel()
if iTableLevel > 0
&& iTableLevel != iPrevTableLevel
&& iPrevTableLevel >= 0
	iSpeakPosition =ShouldItemSpeak(ot_position)
	if iSpeakPosition == message_long
		sNestingMsg = formatString(cmsgNestedTableWithColumnAndRowCount_L,
			IntToString(iTableLevel),
			IntToString(GetTableColumnCount()),
			IntToString(GetTableRowCount()))
	ElIf iSpeakPosition == message_short
		sNestingMsg = formatString(cmsgNestedTableWithColumnAndRowCount_S,
			IntToString(iTableLevel),
			IntToString(GetTableColumnCount()),
			IntToString(GetTableRowCount()))
	EndIf
	if sNestingMsg
		SayUsingVoice(VCTX_MESSAGE, sNestingMsg, OT_POSITION)
	EndIf
EndIf
return true
EndFunction

Script NextCell ()
SayCellUnit(UnitMove_Next)
EndScript

script MoveToEndOfRow ()
SayCellUnit(UnitMove_Last)
EndScript

Script PriorCell ()
SayCellUnit(UnitMove_Prior)
EndScript

script MoveToStartOfRow ()
SayCellUnit(UnitMove_First)
EndScript

Script UpCell ()
SayCellUnit(UnitMove_Up)
EndScript

script MoveToTopOfColumn ()
SayCellUnit(UnitMove_Top)
EndScript

Script DownCell ()
SayCellUnit(UnitMove_Down)
EndScript

script MoveToBottomOfColumn ()
SayCellUnit(UnitMove_Bottom)
EndScript

Script FirstCellInTable ()
SayCellUnit(UnitMove_Start)
EndScript

Script LastCellInTable ()
SayCellUnit(UnitMove_End)
EndScript

int function isChromeWindow(handle hWnd)
var string class = GetWindowClass(hWnd)
return class == cwc_Chrome_WidgetWin_1
	|| class == cwc_ChromeWindowClass
EndFunction

int function isFirefoxWindow(handle hWnd)
var string class = GetWindowClass(hWnd)
return class == cwc_MozillaWindowClass
EndFunction

int function GetWebDocumentUniqueID()
var handle hWnd = GetFocus()
if !isFirefoxWindow(hWnd) && !isChromeWindow(hWnd) return 0 endIf
var int count = GetAncestorCount()
var int i, int documentCount
var int ID
for i = 0 to count
	if GetObjectRole(i) == role_system_document
		if !documentCount
			ID = GetObjectIA2UniqueID(i)
		endIf
		documentCount = documentCount+1
	endIf
endFor
;Since we are looking for a document inside a web page and not the one which encloses the entire web page:
if documentCount <= 1 return 0 endIf
return ID
EndFunction

int function GetWebDialogUniqueID()
var handle hWnd = GetFocus()
if !isFirefoxWindow(hWnd) && !isChromeWindow(hWnd) return 0 endIf
MSAARefresh (true, 50)
var int count = GetAncestorCount()
var int i
var int ID
for i = 0 to count
	if GetObjectRole(i) == role_system_dialog
		ID = GetObjectIA2UniqueID(i)
		return id
	endIf
endFor
return 0 
EndFunction

void Function UpdateVirtualCursorRestriction(handle window)
var int isCurrentlyRestricted = GlobalPrevDocumentIdentifier != 0 || GlobalPrevWebDialogIdentifier != 0
if !isCurrentlyRestricted then
	Return
EndIf

if IsVirtualPCCursor () 
|| IsFormsModeActive() then
	Return
EndIf

var int isInDifferentRestrictedElement = GlobalPrevDocumentIdentifier != GetWebDocumentUniqueID() || GlobalPrevWebDialogIdentifier != GetWebDialogUniqueID()
if !isInDifferentRestrictedElement then
	return
EndIf

virtualCursorRestrictedEvent (window, virtualCursorRestriction_Off)
EndFunction

Void Function virtualCursorRestrictedEvent (handle window, int restrictionChange)
; This is called when the virtual cursor is restricted due to the focus changing, rather than the user toggling restriction with JAWSKey+r.
; Thus we need to speak the new dialog.
if restrictionChange== virtualCursorRestriction_Dialog
	var int currentWebDialogIdentifier = GetWebDialogUniqueID()
	if currentWebDialogIdentifier != GlobalPrevWebDialogIdentifier 
		GlobalPrevWebDialogIdentifier = currentWebDialogIdentifier
	EndIf
EndIf

if restrictionChange == virtualCursorRestriction_Document
	var int currentDocumentIdentifier = GetWebDocumentUniqueID()
	if currentDocumentIdentifier != GlobalPrevDocumentIdentifier 
		GlobalPrevDocumentIdentifier = currentDocumentIdentifier 
	EndIf
EndIf

if restrictionChange == virtualCursorRestriction_Off 
	GlobalPrevDocumentIdentifier = 0
	GlobalPrevWebDialogIdentifier = 0
endIf
EndFunction

void function UserToggleVirtualCursorRestriction()
; This is called when the user toggles restriction with Insert+R.
; See function virtualCursorRestrictedEvent for when the restriction toggles due to a focus change.
if IsVirtualDocumentViewRestricted()
	sayMessage(OT_STATUS, cmsg318_L)
	ClearPriorRestrictionData() ; this will unrestrict the document.
	virtualCursorRestrictionType = virtualCursorRestriction_Off
	return
endIf
if !inWebDialog() && !InDocumentInAppRegion()
	sayMessage(OT_error, cmsgRestrictVirtualError_L, cmsgRestrictVirtualError_S)
	return
endIf
if DialogActive() && RestrictViewToEnclosingType(wt_dialog)
	virtualCursorRestrictionType = virtualCursorRestriction_Dialog
	GlobalPrevDialogIdentifier = GetDialogIdentifier()
	sayMessage(OT_STATUS, cmsgRestrictToWebDialog_L, cmsgRestrictToWebDialog_S)
elif InDocumentInAppRegion() && RestrictViewToEnclosingType(wt_document)
	virtualCursorRestrictionType = virtualCursorRestriction_Document
	sayMessage(OT_STATUS, cmsgRestrictToWebDocument_L, cmsgRestrictToWebDocument_S)
	GlobalPrevDocumentIdentifier = GetWebDocumentUniqueID()
else
	SayMessage(ot_error, cmsgRestrictVirtualError_L, cmsgRestrictVirtualError_S)
endIf
EndFunction

script VirtualDialogRestrictionToggle ()
if (isVirtualPCCursor() || IsFormsModeActive())
	UserToggleVirtualCursorRestriction()
else
	sayMessage (OT_ERROR, cmsgMagicWebDialogRestrictionError)
endIf
endScript

Script RestrictCurrentCursor ()
var	int isUIAScanCursor = (IsJawsUIACursor() || IsInvisibleUIACursor())
if !isUIAScanCursor
&& (isVirtualPCCursor() || IsFormsModeActive())
	UserToggleVirtualCursorRestriction()
	return
endIf
if (IsPCCursor())
	SayFormattedMessage (ot_error, cmsgRestrict1_L, cmsgRestrict1_S)
	return
endIf
var int nCurrent = getRestriction()
;UIA cursors and OSM cursors have different valid restrictions.
if isUIAScanCursor
	if nCurrent < FirstUIACursorRestriction || nCurrent > LastUIACursorRestriction
		nCurrent = FirstUIACursorRestriction
	elif nCurrent == LastUIACursorRestriction
		nCurrent = FirstUIACursorRestriction
	else
		nCurrent = nCurrent +1
	EndIf
else ;handle the OSM cursor restriction
	if nCurrent < FirstOSMCursorRestriction || nCurrent > LastOSMCursorRestriction
		nCurrent = FirstOSMCursorRestriction
	elif nCurrent == LastOSMCursorRestriction
		nCurrent = FirstOSMCursorRestriction
	else
		nCurrent = nCurrent +1
	EndIf
endIf
SetRestriction(nCurrent)
SayRestrictionName(nCurrent)
EndScript

Script RestrictBrailleCursor (int index)
var
	int nCurrent
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
let nCurrent = GetBrailleRestriction()
if (nCurrent == RestrictNone) then
	let nCurrent = RestrictAppWindow
elif (nCurrent == RestrictAppWindow) then
	let nCurrent = RestrictWindow
elif (nCurrent == RestrictWindow)  then
	Let nCurrent = RestrictRect
ElIf (nCurrent == RestrictRect) then
	let nCurrent = RestrictNone
endIf
SetBrailleRestriction (nCurrent)
;Update restriction globals as well:
giDefaultBrlCursorRestriction = GetBrailleRestriction ()
SayFormattedMessage (OT_STATUS, cmsgBraille1_L, cmsgBraille1_S); "Braille Cursor"
SayRestrictionName(nCurrent)
EndScript

Int Function IsHJTrackEngine ()
Var
	Int bSpeechInUse,
	Int bBrailleInUse,
	Handle hwndMAGicUI
let hwndMAGicUI = FindTopLevelWindow ("JFWUI60", "")
if (hwndMAGicUI == 0) Then
	return 0
Else
	let bSpeechInUse = SpeechInUse ()
	let bBrailleInUse = BrailleInUse ()
	If (bSpeechInUse == FALSE && bBrailleInUse == FALSE) Then
		return 1
	endIf
endIf
return 0
EndFunction

Void Function ResetVoiceSettings ()
if globalVoiceChanges then
	if globalVoiceChanges & V_RATE then
		SetAllVoicesToGlobals (V_RATE)
	endIf
	if globalVoiceChanges & V_VOLUME then
		SetAllVoicesToGlobals (V_VOLUME)
	endIf
	if globalVoiceChanges & V_Pitch then
		SetAllVoicesToGlobals (V_PITCH)
	endIf
	;NullAllGlobalSettings ()
	let globalVoiceChanges = 0
	let globalVoiceName = ""
endIf
EndFunction

Void Function SetVoiceGlobalSettings (int iSetting, string ContextName, int CurrentSetting)
If GlobalVoiceName == "" then
	let GlobalVoiceName = ContextName
	If iSetting == V_RATE then
		If ! (GlobalVoiceChanges & V_RATE) then
			let globalVoiceChanges = (globalVoiceChanges | V_RATE)
			InitializeGlobalVoiceSettings (V_RATE)
			Return
		endIf
	ElIf iSetting == V_VOLUME then
		If ! (GlobalVoiceChanges & V_VOLUME) then
			let globalVoiceChanges = globalVoiceChanges | V_VOLUME
			InitializeGlobalVoiceSettings (V_VOLUME)
			Return
		endIf
	ElIf iSetting == V_PITCH then
		If ! (GlobalVoiceChanges & V_PITCH) then
			let globalVoiceChanges = globalVoiceChanges | V_PITCH
			InitializeGlobalVoiceSettings (V_PITCH)
			Return
		endIf
	endIf
endIf
EndFunction

Int Function GetSettingInformation (int Setting, string ContextName,
	Int ByRef MinSetting, Int ByRef MaxSetting)
; Helper function to grab current voice parameter setting
var
	int Information
If Setting == V_RATE then
	let Information = GetVoiceRate (ContextName)
	GetSynthRateRange (MinSetting, MaxSetting)
ElIf Setting == V_Volume then
	let Information = GetVoiceVolume (ContextName)
	GetVoiceVolumeRange (MinSetting, MaxSetting)
ElIf Setting == V_Pitch then
	let Information = GetVoicePitch (ContextName)
	GetSynthPitchRange (MinSetting, MaxSetting)
endIf
;If GlobalVoiceName == "" then
If ! GlobalVoiceChanges then
	SetVoiceGlobalSettings (Setting, ContextName, Information)
endIf
Return Information
EndFunction

Void Function NullAllGlobalSettings (optional int iParamToSet)
If iParamToSet == V_RATE then
	let GlobalPcRate = 0
	let GlobalSayAllRate = 0
	let GlobalJAWSRate = 0
	let GlobalKeyboardRate = 0
	let GlobalMessageRate = 0
	let GlobalMenuDialogRate = 0
ElIf iParamToSet == V_VOLUME then
	let GlobalPcVolume = 0
	let GlobalSayAllVolume = 0
	let GlobalJAWSVolume = 0
	let GlobalKeyboardVolume = 0
	let GlobalMessageVolume = 0
	let GlobalMenuDialogVolume = 0
ElIf iParamToSet == V_PITCH then
	let GlobalPcPitch = 0
	let GlobalSayAllPitch = 0
	let GlobalJAWSPitch = 0
	let GlobalKeyboardPitch = 0
	let GlobalMessagePitch = 0
	let GlobalMenuDialogPitch = 0
endIf
EndFunction

Void Function InitializeGlobalVoiceSettings (int iParamToSet)
If iParamToSet == V_RATE then
	let GlobalPcRate = GetVoiceRate (VCTX_PCCURSOR)
	let GlobalSayAllRate = GetVoiceRate (VCTX_SAY_ALL)
	let GlobalJAWSRate = GetVoiceRate (VCTX_JAWSCURSOR)
	let GlobalKeyboardRate = GetVoiceRate (VCTX_KEYBOARD)
	let GlobalMessageRate = GetVoiceRate (VCTX_MESSAGE)
	let GlobalMenuDialogRate = GetVoiceRate (VCTX_MENU_AND_DIALOG)
ElIf iParamToSet == V_VOLUME then
	let GlobalPcVolume = GetVoiceVolume (VCTX_PCCURSOR)
	let GlobalSayAllVolume = GetVoiceVolume (VCTX_SAY_ALL)
	let GlobalJAWSVolume = GetVoiceVolume (VCTX_JAWSCURSOR)
	let GlobalKeyboardVolume = GetVoiceVolume (VCTX_KEYBOARD)
	let GlobalMessageVolume = GetVoiceVolume (VCTX_MESSAGE)
	let GlobalMenuDialogVolume = GetVoiceVolume (VCTX_MENU_AND_DIALOG)
ElIf iParamToSet == V_PITCH then
	let GlobalPcPitch = GetVoicePitch (VCTX_PCCURSOR)
	let GlobalSayAllPitch = GetVoicePitch (VCTX_SAY_ALL)
	let GlobalJAWSPitch = GetVoicePitch (VCTX_JAWSCURSOR)
	let GlobalKeyboardPitch = GetVoicePitch (VCTX_KEYBOARD)
	let GlobalMessagePitch = GetVoicePitch (VCTX_MESSAGE)
	let GlobalMenuDialogPitch = GetVoicePitch (VCTX_MENU_AND_DIALOG)
endIf
EndFunction

Void Function SetAllVoicesToGlobals (int iParamSet)
If iParamSet == V_RATE then
	SetVoiceRate (VCTX_PCCURSOR, GlobalPCRate)
	SetVoiceRate (VCTX_SAY_ALL, GlobalSayAllRate)
	SetVoiceRate (VCTX_JAWSCURSOR, GlobalJAWSRate)
	SetVoiceRate (VCTX_KEYBOARD, GlobalKeyboardRate)
	SetVoiceRate (VCTX_MESSAGE, GlobalMessageRate)
	SetVoiceRate (VCTX_MENU_AND_DIALOG, GlobalMenuDialogRate)
ElIf iParamSet == V_VOLUME then
	SetVoiceVolume (VCTX_PCCURSOR, GlobalPcVolume)
	SetVoiceVolume (VCTX_SAY_ALL, GlobalSayAllVolume)
	SetVoiceVolume (VCTX_JAWSCURSOR, GlobalJAWSVolume)
	SetVoiceVolume (VCTX_KEYBOARD, GlobalKeyboardVolume)
	SetVoiceVolume (VCTX_MESSAGE, GlobalMessageVolume)
	SetVoiceVolume (VCTX_MENU_AND_DIALOG, GlobalMenuDialogVolume)
ElIf iParamSet == V_PITCH then
	SetVoicePitch (VCTX_PCCURSOR, GlobalPcPitch)
	SetVoicePitch (VCTX_SAY_ALL, GlobalSayAllPitch)
	SetVoicePitch (VCTX_JAWSCURSOR, GlobalJAWSPitch)
	SetVoicePitch (VCTX_KEYBOARD, GlobalKeyboardPitch)
	SetVoicePitch (VCTX_MESSAGE, GlobalMessagePitch)
	SetVoicePitch (VCTX_MENU_AND_DIALOG, GlobalMenuDialogPitch)
endIf
EndFunction

Void Function SetVoiceRatePercentByVoiceCommand (int iPercent)
var
	int InSayAll,
	string ContextNameLocal
let InSayAll = SayAllInProgress ()
let ContextNameLocal = VCTX_GLOBAL
if InSayAll
&& UseSapi5ForSayAll() then
	let ContextNameLocal = VCTX_SAY_ALL
endIf
SetVoiceRatePercent (ContextNameLocal, iPercent)
if !InSayAll
	SayFormattedMessage (OT_STATUS, FormatString (cmsgVoiceRatePercent, iPercent))
endIf
EndFunction

Void Function SetVoiceSetting (int ParameterToSet, int Setting, string ContextName,
	int UpOrDown, int InSayAll, optional int bSaveNewSetting)
var
	string ContextNameLocal
let ContextNameLocal = VCTX_GLOBAL
if InSayAll
&& UseSapi5ForSayAll() then
	let ContextNameLocal = VCTX_SAY_ALL
endIf
If ParameterToSet == V_PITCH then
	SetVoicePitch (ContextNameLocal, Setting)
	If ! InSayAll then
		If UpOrDown == V_Down then
			SayFormattedMessage (OT_STATUS, cmsg354_L); "Lower"
		ElIf UpOrDown == V_UP then
			SayFormattedMessage (OT_STATUS, cmsg355_L); "Higher"
		endIf
	endIf
ElIf ParameterToSet == V_RATE then
	SetVoiceRate (ContextNameLocal, Setting,bSaveNewSetting)
	If ! InSayAll then
		If UpOrDown == V_DOWN then
			SayFormattedMessage (OT_STATUS, cmsg356_L); "Slower"
		ElIf UpOrDown == V_Up then
			SayFormattedMessage (OT_STATUS, cmsg357_L); "Faster", cmsgSilent)
		endIf
	endIf
ElIf ParameterToSet == V_Volume then
	SetVoiceVolume (ContextNameLocal, Setting)
	If ! InSayAll then
		If UpOrDown == V_DOWN then
			SayFormattedMessage (OT_STATUS, cmsg358_L); "Softer"
		ElIf UpOrDown == V_UP then
			SayFormattedMessage (OT_STATUS, cmsg359_L); "Louder"
		endIf
	endIf
endIf
EndFunction

Void Function ChangeVoiceSettingByPercent (int iSetting, int iDirection, int iPercent, int InSayAll, int bSaveNewSetting)
var
	string contextName,
	int CurrentSetting,
	int minSetting,
	int maxSetting,
	int increment
if InSayAll
&& UseSapi5ForSayAll() then
	let contextName = VCTX_SAY_ALL
else
	If IsJAWSCursor() then
		let contextName = VCTX_JAWSCURSOR
	else
		let contextName = VCTX_PCCURSOR
	endIf
endif
let CurrentSetting = GetSettingInformation (iSetting, ContextName, MinSetting, MaxSetting)
If iDirection == V_Down then
	let increment = (maxSetting-minSetting)*iPercent/100
	if increment <= 0 then
		let increment = 1 ; for those synthesizers with a short range
	endIf
	let CurrentSetting = max(minSetting,currentSetting-increment) ; keeps the current value within range
ElIf iDirection == V_Up then
	let increment = ((maxSetting-minSetting)*iPercent)/100
	if increment <= 0 then
		let increment = 1 ; for those synthesizers with a short range
	endIf
	let currentSetting = min(maxSetting,currentSetting+increment)
endIf
SetVoiceSetting (iSetting, CurrentSetting, ContextName, iDirection, InSayAll, bSaveNewSetting)
EndFunction

Void Function ChangeVoiceSetting (int iSetting, int iDirection, int InSayAll, int bSaveNewSetting)
ChangeVoiceSettingByPercent (iSetting, iDirection, 5, InSayAll, bSaveNewSetting)
EndFunction

Script DecreaseVoiceRateTemporaryByVoiceCommand()
var
	int InSayAll
let InSayAll = SayAllInProgress ()
ChangeVoiceSettingByPercent (V_RATE, V_DOWN, 20, InSayAll, (false & !InSayAll))
EndScript

Script IncreaseVoiceRateTemporaryByVoiceCommand()
var
	int InSayAll
let InSayAll = SayAllInProgress ()
ChangeVoiceSettingByPercent (V_RATE, V_UP, 20, InSayAll, (false & !InSayAll))
EndScript

Script DecreaseVoiceRateTemporary()
var
	int InSayAll
let InSayAll = SayAllInProgress ()
ChangeVoiceSetting (V_RATE, V_DOWN, InSayAll, (false & !InSayAll))
EndScript

Script DecreaseVoiceRatePermanent()
var
	int InSayAll
let InSayAll = SayAllInProgress ()
ChangeVoiceSetting (V_RATE, V_DOWN, InSayAll, (GetRunningFSProducts () & product_MAGic) || (!InSayAll))
EndScript

Script IncreaseVoiceRateTemporary()
var
	int InSayAll
let InSayAll = SayAllInProgress ()
ChangeVoiceSetting (V_RATE, V_UP, InSayAll, (false & !InSayAll))
EndScript

Script IncreaseVoiceRatePermanent()
var
	int InSayAll
let InSayAll = SayAllInProgress ()
ChangeVoiceSetting (V_RATE, V_UP, InSayAll, (GetRunningFSProducts () & product_MAGic) || (!InSayAll))
EndScript

Script DecreaseVoiceRate ()
;This script is deprecated, but is here for backwards compatibility
PerformScript DecreaseVoiceRateTemporary()
EndScript

Script IncreaseVoiceRate ()
;This script is deprecated, but is here for backwards compatibility
PerformScript IncreaseVoiceRateTemporary()
EndScript

Script DecreaseVoiceVolume ()
var
	int InSayAll
let InSayAll = SayAllInProgress ()
ChangeVoiceSetting (V_VOLUME, V_DOWN, InSayAll)
EndScript

Script IncreaseVoiceVolume ()
var
	int InSayAll
let InSayAll = SayAllInProgress ()
ChangeVoiceSetting (V_VOLUME, V_UP, InSayAll)
EndScript

Script DecreaseVoicePitch ()
var
	int InSayAll
let InSayAll = SayAllInProgress ()
ChangeVoiceSetting (V_PITCH, V_DOWN, InSayAll)
EndScript

Script IncreaseVoicePitch ()
var
	int InSayAll
let InSayAll = SayAllInProgress ()
ChangeVoiceSetting (V_PITCH, V_UP, InSayAll)
EndScript

Script RestoreVoiceSettings ()
ResetVoiceSettings ()
SayFormattedMessage (OT_STATUS, cmsg360_L, cmsg360_S); "Voice Settings Restored"
EndScript

int function SayLineInsteadOfSayAll()
var
	int iType,
	string sClass
Let iType = GetWindowSubtypeCode (GetFocus ())
IF iType == WT_EDIT_SPINBOX then
	PerformScript SayLine ()
	return true
endIf
If IsPcCursor()
&& !IsVirtualPcCursor()
&& DialogActive() then
	If !(GetWindowStyleBits(GetFocus()) & ES_MULTILINE)
	|| !iType then
		PerformScript SayLine ()
		return true
	EndIf
EndIf
If GlobalMenuMode then
	PerformScript SayLine ()
	return true
EndIf
let sClass = GetWindowClass(GetFocus())
if sClass == cwc_DirectUIhWND then
	if GetObjectSubtypeCode() == wt_Edit then
		PerformScript SayLine ()
		return true
	EndIf
elif sClass == cwc_SysMonthCal32 then
	PerformScript SayLine ()
	return true
EndIf
return false
EndFunction

void function SetSayAllScheme()
var
	string sScheme
let sScheme = GetCurrentSayAllScheme()
if sScheme then
	let gsSavedApplicationScheme = GetCurrentSchemeName()
	SwitchToScheme(sScheme)
EndIf
EndFunction

void function ClearSayAllScheme()
var
	string sScheme
if GetCurrentSayAllScheme() != gsSavedApplicationScheme then
	SwitchToScheme(gsSavedApplicationScheme)
	let gsSavedApplicationScheme = cscNull
EndIf
EndFunction

void function SetSAPILoadedVarForSayALL()
if !gbSAPILoaded then
	let gbSAPILoaded = true
	Say(cmsgLoadingSAPI,ot_help)
EndIf
EndFunction

Script SayAllFromLocation ()
if !IsZoomTextRunning() then
	return
endIf
If SayLineInsteadOfSayAll() then
	return
endIf
SayAll(true)
EndScript

Script SayAll (optional int bIgnoreUseSAPI5DuringSayAllOption)
if SayLineInsteadOfSayAll() then
	return
EndIf
;SetSayAllScheme()
;Uncomment following block if the initial load of SAPI 5 takes too long:
;if GetDefaultJCFOption(OPT_Use_SAPI5_During_Say_All) then
;	SetSAPILoadedVarForSayALL()
;EndIf
SayAll(!bIgnoreUseSAPI5DuringSayAllOption)
EndScript

Void Function SayAllStarted ()
;; This function is called by the built in script function SayAll just before the
;; Speak method of the SAYALL object is called for the first time.
;; It is intended that this function be overridden in a given application's scripts to provide a method
;; of performing actions (such as setting JCF options) just before a Say All is started.  This
;; complements the preexisting SayAllStoppedEvent  which is called whenever a Say All process is
;; stopped.
SetSayAllScheme()
EndFunction

Void Function SayAllStoppedEvent ()
if gbSayAllTemporarilyToggledToSAPI then
	SetDefaultJCFOption (OPT_Use_SAPI5_During_Say_All, 0)
endIf
let gbSayAllTemporarilyToggledToSAPI = false
ClearSayAllScheme()
VirtualSayAllStops ()
EndFunction

void function DialogListHelper (handle ByRef hwnd, string ByRef sList, string ByRef sControlsList, int ByRef iIndex)
var
	handle hNull,
	int iWinType,
	string sWinType,
	string sTemp
While (hwnd != hNull)
	let iWinType = GetWindowSubTypeCode (hwnd)
	While (hwnd != hNull &&
		(!IsWindowVisible (hwnd) || iWinType == wt_static || iWinType == wt_unknown || iWinType == wt_tabcontrol || iWinType == wt_dialog || iWinType == wt_groupbox || iWinType == wt_scrollbar || iWinType == wt_toolbar))
		let hwnd = GetNextWindow (hwnd)
		let iWinType = GetWindowSubTypeCode (hwnd)
	EndWhile
	If (hwnd != hNull) then
		let sWinType = GetWindowType (hwnd)
		If (iWinType == wt_edit || iWinType == wt_listbox || iWinType == wt_listview || iWinType == wt_combobox) then
			let sTemp = GetWindowText (GetPriorWindow (hwnd), false)
		else
			let sTemp = GetWindowText (hwnd, false)
		endIf
		let sList = sList+sTemp+" "+sWinType+LIST_ITEM_SEPARATOR
		let sControlsList = sControlsList+IntToString (hwnd)+LIST_ITEM_SEPARATOR
		let iIndex = iIndex+1
		let hwnd = GetNextWindow (hwnd)
	endIf
EndWhile
;remove trailing delimiters
let sList =stringChopRight(sList,1)
let sControlsList =stringChopRight(sControlsList,1)
EndFunction

Void Function DialogList ()
var
	handle hwnd,
	handle hTemp,
	string sList,
	string sTemp,
	string sControlsList,
	int iIndex,
	int iButton
If !(DialogActive ()) then
	SayFormattedMessage (ot_error, cmsg34_L) ; "Not in a dialog box",
	return
endIf
let hwnd = GetRealWindow (GetFocus ())
let hwnd = GetFirstChild (hwnd)
If (IsMultiPageDialog ()) then
	let hTemp = GetFirstChild (hwnd)
	DialogListHelper (hTemp, sList, sControlsList, iIndex)
	DialogListHelper (hwnd, sList, sControlsList, iIndex)
else
	DialogListHelper (hwnd, sList, sControlsList, iIndex)
endIf
let sList = StringLeft (sList, StringLength (sList)-1)
let sControlsList = StringLeft (sControlsList, StringLength (sControlsList)-1)
let iButton = DlgSelectControls (sList, iIndex, cmsgListOfControls1_L, bt_LeftSingleClick|bt_MoveTo, bt_MoveTo)
If (iIndex == 0) then
	return
endIf
let sTemp = StringSegment (sControlsList, LIST_ITEM_SEPARATOR, iIndex)
let hwnd = StringToHandle (sTemp)
If (iButton == iD_MoveTo) then
	SetFocus (hwnd)
	return
ElIf (iButton == iD_LeftSingleClick) then
	SaveCursor ()
	SpeechOff ()

	JAWSCursor ()
	MoveToWindow (hwnd)
	Delay (1)
	LeftMouseButton ()
	SpeechOn ()
	RestoreCursor ()
	return
endIf
EndFunction

Void function DialogPageChangedEvent(HANDLE hwndNewPage,HANDLE hwndOldPage)
if GetObjectSubTypeCode () == wt_tabcontrol then
   return
EndIf
SayWindowTypeAndText(hwndNewPage)
If BrailleInUse () then
	RefreshBraille ()
endIf
EndFunction
; For those keystrokes on Braille displays which  perform the function NextDocumentWindow and PreviousDocumentWindow

Script NextDocumentWindow ()
If UserBufferIsActive () then
	UserBufferDeActivate ()
EndIf
TypeKey(cksControlTab)
; Since this causes double-speaking in most apps,
; recommend it be localized in those special cases mentioned.
; Handle the special case in which the user calls the NextDocumentWindow script when focus
; is positioned on the Tab Control.  In this special case FocusChangedEvent is not called
; and as a result JAWS does not announce the page change.
;If IsPCCursor() Then
;	Pause ()
;	Delay(1)
;	If GetObjectTypeCode() == WT_TABCONTROL Then
;		SayFocusedObject ()
;	EndIf
;EndIf
EndScript

Script PreviousDocumentWindow ()
If UserBufferIsActive () then
	UserBufferDeActivate ()
EndIf
TypeKey(cksControlShiftTab)
; Since this causes double-speaking in most apps,
; recommend it be localized in those special cases mentioned.
; Handle the special case in which the user calls the NextDocumentWindow script when focus
; is positioned on the Tab Control.  In this special case FocusChangedEvent is not called
; and as a result JAWS does not announce the page change.
;If IsPCCursor() Then
;	Pause ()
;	Delay(1)
;	If GetObjectTypeCode() == WT_TABCONTROL Then
;		SayFocusedObject ()
;	EndIf
;EndIf
EndScript

Script NextDocumentWindowByPage ()
TypeKey (cksControlPageDown)
EndScript

Script PreviousDocumentWindowByPage ()
TypeKey (cksControlPageUp)
EndScript

; SelectAllItems and UnselectAllButCurrent
; For those braille displays which still use these scripts

Script SelectAllItems ()
TypeKey(cksControlSlash)
EndScript

Script UnselectAllButCurrent ()
TypeKey(cksControlBackslash)
EndScript

; *****
; Following scripts for
; JAWS and MAGIc

Script MagSayNextLine ()
TypeCurrentScriptKey ()
EndScript

Script MagSayPriorLine ()
TypeCurrentScriptKey ()
EndScript

Script MagSayPriorCharacter ()
TypeCurrentScriptKey ()
EndScript

Script MagSayNextCharacter ()
TypeCurrentScriptKey ()
EndScript

Script MagSelectNextCharacter ()
TypeCurrentScriptKey ()
EndScript

Script MagSelectPriorCharacter ()
TypeCurrentScriptKey ()
EndScript

; MAG Selection scripts
Script MagSelectToEndOfLine ()
TypeCurrentScriptKey ()
EndScript

Script MagSelectFromStartOfLine ()
TypeCurrentScriptKey ()
EndScript

Script SayToPunctuation()
SayToPunctuation()
EndScript

void function ScreenStabilizedEvent(handle hwndLastScreenWrite)
; override this event in Application specific script files to process information when the screen
;becomes stable after a series of writes. You can determine where the last write occured by
;checking the handle passed to this event. You can thus ignore triggers caused by writing to
;windows for which you are not interested.
endFunction

void Function IndicateComputerBraille (handle hFocus)
var
	int iType,
	int iInput, int iG2Trans
;Because TypeKeysMode and SupportsTypeKeys doesn't work anymore.
if (! BrailleInUse ())
;|| ! BrailleGetTypeKeysMode () )
	return
endIf
if ! ShouldItemSpeak (OT_TUTOR)
&& GetScriptAssignedTo (GetCurrentScriptKeyName ()) != "SayWindowPromptAndText" then
; Avoids Braille viewer speaking this message when tutor is off.
	return
endIf
;the end game here is to make the output minimalist.
iG2Trans = getJCFOption (OPT_BRL_G2TRANSLATION)
if (! iG2Trans)
	;Alert user if they've switched to an app that won't support contracted input.
	iG2Trans = getDefaultJCFOption (OPT_BRL_G2TRANSLATION)
endIf
if (! iG2Trans)
	return
endIf
iInput = getJcfOption (OPT_BRL_CONTRACTED_INPUT)
if (! iInput)
	;Alert user if they've switched to an app that won't support contracted input.
	iInput = getDefaultJCFOption (OPT_BRL_CONTRACTED_INPUT)
endIf
if (! iInput)
	return
endIf
;Only process if the focused type is some sort of edit.
;doesn't make sense to say 'computer Braille' on a list or button.
iType = getObjectTypeCode ();generalize all edit types
if (iType == WT_EDIT && getObjectSubtypeCode () != WT_READONLYEDIT
; exclude read-only where window shows state but object doesn't:
&& GetWindowSubtypeCode (hFocus) != WT_READONLYEDIT
&& GetObjectSubtypeCode(SOURCE_CACHED_DATA) != WT_READONLYEDIT)
	if (ShouldForceComputerBraille (hFocus))
		;The say should use a type which does not flash, since showing the message in braille is conditional:
		SayFormattedMessageWithVoice (vctx_message, OT_line, cmsgComputerBraille)
		if !BrailleIsStructuredLine()
			BrailleMessage (cmsgComputerBraille)
		endIf
	endIf
endIf
endFunction

int function GetSubtypeCodeForTutorialHelp(handle hwndFocus)
var int subtypeCode = getWindowSubtypeCode(hwndFocus)
If (!subtypeCode || IsMSAAWindow(hwndFocus))
	subtypeCode = GetObjectSubTypeCode()
EndIf
return subtypeCode
endFunction

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
var
	int iTutorSpeak,
	int iAccessKeySpeak,
	int iObjType,
	string sCustomTutor
Let iTutorSpeak = ShouldItemSpeak (OT_TUTOR)
Let iAccessKeySpeak = ShouldItemSpeak (OT_ACCESS_KEY)
if GetLastInputSource() == InputSource_Touch
	If iTutorSpeak
		var string sGestureMsg = GetGestureTutorMessage()
		if sGestureMsg
			Say(sGestureMsg,GetTutorialHelpOutputType())
		endIf
	endIf
	return
endIf
iObjType = GetSubtypeCodeForTutorialHelp(hwndFocus)
;Not done here, as the events may be out of sync.
;See ForegroundIconicEvent, WindowActivatedEvent, and HandleCustomWindows for usage:
;if ! isWindowVisible (hwndFocus) then
	;SayMessage (OT_TUTOR, cmsgAppLostFocusTutor)
;endIf
If nMenuMode > 0
|| iObjType == WT_CONTEXTMENU
|| iObjType == WT_STARTMENU then
	If nMenuMode != GlobalPrevTutorMenuMode then
		If iTutorSpeak == TUTOR_ALL then
			SayTutorialHelp(iObjType,false)
		EndIf
		Let GlobalPrevTutorMenuMode = GlobalMenuMode; Accurately monitor the state of the menu
	EndIf
	If iAccessKeySpeak == ACCESS_KEY_ALL ||
	iAccessKeySpeak == ACCESS_KEY_MENUS then
		SayTutorialHelpHotKey(hwndFocus,false)
	EndIf
	Return
Else; Speak it, but not twice during the menus.
	Let sCustomTutor = GetFrameTutorMessage ()
	If iTutorSpeak == TUTOR_CUSTOM_ONLY then
		;avoid potential for braille flashing empty messages:
		If sCustomTutor
			SayMessage (OT_TUTOR, sCustomTutor)
		endIf
	Else
		SayTutorialHelp(iObjType,false)
	EndIf
EndIf
If iAccessKeySpeak == ACCESS_KEY_ALL ||
iAccessKeySpeak == ACCESS_KEY_DIALOGS then
	SayTutorialHelpHotKey(hwndFocus,false)
EndIf
;alert user where contracted input doesn't work:
IndicateComputerBraille (hwndFocus)
Let GlobalPrevTutorMenuMode = GlobalMenuMode; Accurately monitor the state of the menu
endFunction

Script SelectAVoiceProfile ()
if TandemIsConnected() then
	SayUsingVoice(vctx_message,cmsgSelectAVoiceProfileUnavailableDuringTandem,ot_error)
	return
EndIf
if InFSVoiceSettingsDialogBox () then
	SayFormattedMessage (ot_error, cmsgInFSVoiceSettingsDialogBox_L, cmsgInFSVoiceSettingsDialogBox_S)
	return
endIf
if RemoteAccessIsConnected () then
	SayFormattedMessage (ot_error, cmsgNoVoiceProfilesInRemoteJAWSSession_l, cmsgNoVoiceProfilesInRemoteJAWSSession_s)
	return
endIf
DlgSelectAVoiceProfile()
EndScript

script SelectALanguage()
var
	string List,
	string Language,
	int choice,
	int CurrentIndex
let List=GetSynthLanguages (LIST_ITEM_SEPARATOR)
If ! List then
	SayFormattedMessage (OT_ERROR, cMsgNoLanguages)
	Return
EndIf
let CurrentIndex = StringSegmentIndex (List, LIST_ITEM_SEPARATOR, GetActiveSynthLanguage())
let choice = dlgSelectItemInList (List, cDlgSelectALanguageTitle, FALSE, CurrentIndex)
if choice <=0 then
	return
endIf
let Language = stringSegment (List, LIST_ITEM_SEPARATOR, choice)
SetSynthLanguage (Language)
SetJcfOption (OPT_LANGUAGE_DETECTION, 0)
endScript

Script Insert()
if GetJAWSMode() == jawsMode_MagUtil then
	TypeCurrentScriptKey ()
EndIf
EndScript

Script MagicKey()
if (IsSameScript()) then
	TypeCurrentScriptKey()
	;The key toggle is spoken either internally or by function ToggleKeyEvent
endif
EndScript

Script JAWSKey()
if (IsSameScript()) then
	TypeCurrentScriptKey()
	;The key toggle is spoken either internally or by function ToggleKeyEvent
endif
EndScript

Script ScrollLockKey()
if (IsSameScript()) then
	TypeCurrentScriptKey()
	;The key toggle is spoken either internally or by function ToggleKeyEvent
endif
EndScript

void Function ToggleKeyEvent(int vkKey, string strName, int nState)
if GetLastInputSource() == InputSource_Braille
&& strName == "CapsLock" then
; Where inputting capslock key from the Braille keyboard:
	return
endIf
; Certain keys have a toggle state as well as an up/down state.  The three
; toggle keys are capsLock, scrollLock, and numLock.  When the toggle state
; of any one of these keys changes, this event is called.
; vkKey has the following possible values as defined in hjConst.h.
; 	VK_CAPITAL 20 	//capsLock
;	VK_NUMLOCK 144	//numLock
;	VK_SCROLL  145	//scrollLock
var
	int RunningFSProducts,
	String sKeyAlias
; NumLock toggle is spoken internally by both JAWS and MAGic, both when running separately or together.
; CapsLock toggle is spoken internally by JAWS when MAGic is not running,
; except when it is the JAWSKey.
; ScrollLock toggle is spoken internally by MAGic when JAWS is not running.
let RunningFSProducts = GetRunningFSProducts()
let sKeyAlias = FindKeyAliasMatch("MAGicKey")
if RunningFSProducts & product_MAGic
&& strName == sKeyAlias then
	if nState == 1 then
		Say(FormatString(cmsgMAGicKeyOn,StrName),ot_status)
	else
		Say(FormatString(cmsgMAGicKeyOff,StrName),ot_status)
	endif
elif RunningFSProducts & product_JAWS then
	if vkKey == VK_CAPITAL then
		; announce capslock toggle if it's the JAWSKey
		; In case of ZoomText or Fusion also announce it because JAWS doesn't announce modifiers
		let sKeyAlias = FindKeyAliasMatch("JAWSKey")
		if RunningFSProducts & product_ZoomText || strName == sKeyAlias then
			if nState == 1 then
				Say(mscCapsLockOn_L,ot_status)
			else
				Say(mscCapsLockOff_L,ot_status)
			endIf
		endIf
	elif vkKey == VK_SCROLL  then
		;the ScrollLock name is not passed in the strName param
		let strName = FindKeyAliasMatch("ScrollLock")
		if nState == 1 then
			Say(cmsgScrollLockOn_L,ot_status)
		else
			Say(cmsgScrollLockOff_L,ot_status)
		endIf
	endIf
endIf
EndFunction

Void Function BrailleSelectTextClearValues ()
BrailleSelectTextClearValues ()
EndFunction

;Freedom Scientific NoteTaker Scripts

Script FSLeftRockerDown ()
FSLeftRockerDown ()
EndScript

Script FSLeftRockerUp ()
FSLeftRockerUp ()
EndScript

Script FSRightRockerDown ()
FSRightRockerDown ()
EndScript

Script FSRightRockerUp ()
FSRightRockerUp ()
EndScript

Script WhizWheelsOnOff ()
WhizWheelsOnOff ()
EndScript

Script NavRockersOnOff ()
WhizWheelsOnOff ()
EndScript

Script PressLeftWhizWheel ()
PressLeftWhizWheel ()
EndScript

Script LeftWhizWheelUp ()
LeftWhizWheelUp ()
EndScript

Script LeftWhizWheelDown ()
LeftWhizWheelDown ()
EndScript

Script PressRightWhizWheel ()
PressRightWhizWheel ()
EndScript

Script RightWhizWheelUp ()
RightWhizWheelUp ()
EndScript

Script RightWhizWheelDown ()
RightWhizWheelDown ()
EndScript

Script RightFocusWhizWheelDown ()
if BrailleCanPanLinesIndependently() then
	performScript BrailleSplitPanRight()
else
	RightFocusWhizWheelDown ()
endIf
EndScript

Script RightFocusWhizWheelUp ()
if BrailleCanPanLinesIndependently() then
	performScript BrailleSplitPanLeft()
else
	RightFocusWhizWheelUp ()
endIf
EndScript

Script LeftFocusWhizWheelUp ()
LeftFocusWhizWheelUp ()
EndScript

Script LeftFocusWhizWheelDown ()
LeftFocusWhizWheelDown ()
EndScript

Script PressRightFocusWheel ()
PressRightFocusWheel ()
EndScript

Script PressRightFocusNavButton ()
PressRightFocusWheel ()
EndScript

Script PressLeftFocusWheel ()
PressLeftFocusWheel ()
EndScript

Script PressLeftFocusNavButton ()
PressLeftFocusWheel ()
EndScript

script LeftWheelSpeechMode ()
LeftWheelSpeechModeToggle ()
endScript

script RightWheelSpeechMode ()
RightWheelSpeechModeToggle ()
endScript

script FocusGDBHelpMessage ()
;Provides general information about the use of these buttons
;Located between the advance bars of the Focus Braille displays
;From Freedom Scientific
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (OT_USER_BUFFER, cMsgFocusGDB)
AddHotKeyLinks ()
EndScript

int Function ShowFramesTextOnlyHelper(string sFrameName)
var
	string sText
let sText = GetTextInFrame(sFrameName,TRUE)
if sText then
	UserBufferAddText(sText)
EndIf
Return TRUE
EndFunction

script ShowFramesTextOnly()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
If UserBufferIsActive () then
	SayFormattedMessage (OT_STATUS, cmsgVirtualViewer)
	Return
EndIf
UserBufferClear ()
FramesEnumerate ("ShowFramesTextOnlyHelper")
If UserBufferGetLength () <= 2 then
	SayFormattedMessage (OT_ERROR, cMsgNoFrames);
	Return
EndIf
UserBufferActivate ()
JAWSTopOfFile ()
SayAll ()
EndScript

void Function PCCursorFrameMoveHelper(string sFrameName)
var
	int x,
	int y
If UserBufferIsActive() then
	UserBufferDeactivate()
	Delay(10)
EndIf
SaveCursor()
InvisibleCursor()
if MoveToFrame (sFrameName) then
	let x = GetCursorCol()
	let y = GetCursorRow()
EndIf
RestoreCursor()
PCCursor()
if MoveTo(x,y) then
;	Delay(2)
;	if GetFrameNameAtCursor() == sFrameName then
		SayUsingVoice(vctx_message,FormatString(cMsgPCToFrameSuccessful, sFrameName),ot_help)
		return
;	EndIf
EndIf
SayUsingVoice(vctx_message,FormatString(cMsgPCToFrameFailed, sFrameName),ot_help)
EndFunction

void Function FrameMoveHelper(string sFrameName)
var
	string sFrameSpeak
If UserBufferIsActive() then
	UserBufferDeactivate()
	Delay(2)
EndIf
JAWSCursor ()
MoveToFrame (sFrameName)
if GetRunningFSProducts() & product_JAWS then
	Let sFrameSpeak = (FormatString (cMsgJAWSToFrame, sFrameName))
	SayFormattedMessage (OT_SMART_HELP, sFrameSpeak)
else
	PCCursor()
endIf
EndFunction

int function FramesListHelper (string sFrameName, int iTopLeft, int iTopRight, int iBLeft, int iBRight)
Let gstrFrameList = gstrFrameList + LIST_ITEM_SEPARATOR + sFrameName
Return TRUE;
EndFunction

int Function ShowFrameTextHelper (string sFrameName, int iTopLeft, int iTopRight, int iBLeft, int iBRight)
var
	string sFuncTitle,
	string sFuncText, ;for the embedded  function
	string sFrameText
let sFrameText = GetTextInFrame(sFrameName,TRUE)
if !gbWantAllFrames then
	if !sFrameText then
		return true
	EndIf
EndIf
Let sFuncTitle = StringMixedCaseToMultiword(sFrameName)
Let sFuncText = FormatString (cFuncFrame, sFrameName)
UserBufferAddText(sFuncTitle,sFuncText,sFuncTitle,
	cFont_Aerial,14,ATTRIB_UNDERLINE,RGBStringToColor(cColor_Blue),RGBStringToColor(cColor_White),TRUE)
UserBufferAddText (sFrameText+cScBufferNewLine,
	cScNull,cScNull,cFont_Aerial,
	12,0,RGBStringToColor(cColor_Black),RGBStringToColor(cColor_White),TRUE)
Return TRUE;
EndFunction

void function ShowFrameText()
If UserBufferIsActive () then
	SayFormattedMessage (OT_STATUS, cmsgVirtualViewer)
	Return
EndIf
UserBufferClear ()
FramesEnumerate ("ShowFrameTextHelper")
If UserBufferGetLength () <= 2 then
	SayFormattedMessage (OT_ERROR, cMsgNoFrames);
	Return
EndIf
UserBufferActivate ()
JAWSTopOfFile ()
SayAll ()
EndFunction

Script ShowAllFrames()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
let gbWantAllFrames = true
ShowFrameText()
let gbWantAllFrames = false
EndScript

Script ShowFramesWithText()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
let gbWantAllFrames = false
ShowFrameText()
EndScript

Script SelectAFrame ()
var
	int index,
	string sFrame
if QuickViewFramesUnsupported() then
	return
EndIf
if IsVirtualPCCursor() then
	VirtualSelectAFrame ()
	return
endIf
FramesEnumerate ("FramesListHelper")
If gstrFrameList == cscNull then
	SayFormattedMessage (OT_ERROR, cMsgNoFrames)
	Return
EndIf
Let gstrFrameList = StringChopLeft (gstrFrameList, 1)
Let Index = dlgSelectItemInList (gstrFrameList,cwn15,TRUE)
Delay (2)
If index == 0 then
	Let gstrFrameList = cScNull
	Return
EndIf
Let sFrame = StringSegment (gstrFrameList, LIST_ITEM_SEPARATOR, index)
FrameMoveHelper(sFrame)
Let gstrFrameList = cScNull
EndScript

int function SpeakLostFocusWindow ()
unScheduleFunction (giFN_SpeakInvisibleWindow)
if stringContains (cwnFocusLossExceptionsList, globalPrevRealName)
|| StringContains (cwnFocusLossExceptionsList, getWindowName (getRealWindow (globalFocusWindow))) then
	return
endIf
Let giFN_SpeakLostFocusWindow = 0;
;If no window has focus, indicate:
if ! getFocus () || ! isWindowVisible (getFocus ()) then
	;Tutor message goes here, as the event does not go off, and we don't want to create timing problems with duplicate (forced) event calls, resulting in an unknown function call.
	unScheduleFunction (giFN_SpeakInvisibleWindow)
	Let giFN_SpeakInvisibleWindow = ScheduleFunction ("SpeakInvisibleWindow", gi_FOCUS_LOSS_TIMER)
	Return TRUE
endIf
endFunction

void Function ForegroundIconicEvent (HANDLE hwndForeground)
;SayMessage (OT_ERROR, formatString (cmsgAppLostFocus, GlobalPrevRealName))
if GetDefaultJCFOption (OPT_FOCUS_LOSS_ANNOUNCE) then
	unScheduleFunction (giFN_SpeakInvisibleWindow)
	Let giFN_SpeakInvisibleWindow = ScheduleFunction ("SpeakInvisibleWindow", gi_FOCUS_LOSS_TIMER)
endIf
EndFunction

;***************************************************
;Stubs for FSReader,
;in 64-bit Windows where the window gains focus and FSReader scripts have not yet loaded,
;but JAWS calls the events anyway:
void function FSReaderRateChangedEvent(int rate)
;Rate is a percentage of the normal rate (e.g. 100%, 80%, 150%).
;This event is called when the application sets the reducing of pauses. This occurs each time a document is opened.
; If the FSReader application is used to change this, focus will have gotten to the window and the config loaded in time.
;Just preventing startup config loading problems in 64-bit Windows.
EndFunction

void function FSReaderUserChangedRateEvent(int rate)
;Rate is a percentage of the normal rate (e.g. 100%, 80%, 150%).
;This event is called when the user uses the key, toolbar, or menu commands to change the rate.
; when the user actually does this, the FSReader scripts will have been loaded by that time.
endFunction

void function FSReaderReducedPausesEvent(int ReducingPauses)
;ReducingPauses indicates the state of the Reduce Pauses option. 1 = reducing pauses, 0 indicates no pause reduction.
;This event is called when the application changes the reduce pauses option. This occurs each time a document is opened.
;Just preventing startup config loading problems in 64-bit Windows.
EndFunction

void function FSReaderUserReducedPausesEvent(int ReducingPauses)
;ReducingPauses indicates the state of the Reduce Pauses option. 1 = reducing pauses, 0 indicates no pause reduction.
;This event is called when the user uses the key, toolbar, or menu command to change the option.
; when the user actually does this, the FSReader scripts will have been loaded by that time.
EndFunction

void function FSReaderAudioEvent(int state)
;State represents the current state of the audio. 0 = stopped, 1 = playing, 2 = paused.
;Just preventing startup config loading problems in 64-bit Windows.
EndFunction

void function SayBatteryLevelInfo ()
var
	int iPercentage,
	string sPercentage,
	int iLevel,
	string sLevel,
	int iPowerAC,
	string sPowerAC,
	string sTimeRemaining,
	string sMsg
let iLevel = GetBatteryChargeStatus()
if iLevel & 128 then
	Say(cmsgBatteryStatus_ChargeNoSystemBattery,ot_error)
	return
elif iLevel == 255 then
	Say(cmsgBatteryStatus_ChargeUnknown,ot_error)
	return
elif iLevel & 1 then
	let sLevel = cmsgBatteryStatus_ChargeHigh
elif iLevel & 2 then
	let sLevel = cmsgBatteryStatus_ChargeLow
elif iLevel & 4 then
	let sLevel = cmsgBatteryStatus_ChargeCritical
EndIf
let iPercentage = GetSystemPowerStatus()
if iPercentage == BATTERY_STATUS_UNKNOWN then
	Say(cmsgBatteryStatus_PercentageUnknown,ot_error)
	return
else
	let sPercentage = FormatString(cmsgBatteryStatus_Percentage,IntToString(iPercentage))
EndIf
let iPowerAC = GetPowerACLineStatus()
if iPowerAC == 255 then
	Say(cmsgBatteryStatus_PowerACUnknown,ot_error)
	return
elif iPowerAC == 1 then
	let sPowerAC = cmsgBatteryStatus_PowerACOnline
	if iLevel & 8 then
		let sPowerAC = sPowerAC+cscBufferNewLine+cmsgBatteryStatus_ChargeCharging
	EndIf
EndIf
let sTimeRemaining = FormatString(cmsgBatteryStatus_TimeRemaining,
	GetBatteryLifeTimeRemainingString())
if sPowerAC then
	let sMsg = sPowerAC+cscBufferNewLine
		+sLevel+cscBufferNewLine
		+sPercentage
else
	let sMsg = sLevel+cscBufferNewLine
		+sPercentage+cscBufferNewLine
		+sTimeRemaining
EndIf
SayMessage(ot_user_requested_information,sMsg)
endFunction

Script SayBatteryLevel ()
beginFlashMessage ()
SayBatteryLevelInfo ()
sayConnectionStatusInfo ()
endFlashMessage ()
EndScript

void function HelpBalloonEvent(handle hwnd, string sText)
; Windows XP Help Balloons
;For repeat speaking of tips, and storage foh clicking:
Let ghwndToolTip = hWnd
Let gStrLastTipFromEvent = sText
Say(sText,ot_help_balloon)
endFunction

Script FocusToFirstField ()
FocusToFirstField ()
EndScript

Script FocusToNextField ()
FocusToNextField ()
EndScript

Script FocusToPriorField ()
FocusToPriorField ()
EndScript

Script FocusToLastField ()
FocusToLastField ()
EndScript

Script SelectAFormField()
PerformScript SelectAFormField()
EndScript

Script SelectALink ()
SelectALinkDialog()
EndScript

Script MoveToMainRegion ()
PerformScript MoveToMainRegion()
EndScript

Script MoveToNextRegion ()
PerformScript MoveToNextRegion()
EndScript

Script MoveToPriorRegion ()
PerformScript MoveToPriorRegion()
EndScript

Script MoveToNextHeading()
MoveToNextHeading()
EndScript

Script MoveToPriorHeading()
MoveToPriorHeading()
EndScript

Script MoveToFirstHeading()
MoveToFirstHeading()
EndScript

Script MoveToLastHeading()
MoveToLastHeading()
EndScript

Script MoveToNextHeadingLevelN(optional int iLevel)
MoveToNextHeadingLevelN(iLevel)
EndScript

Script MoveToPriorHeadingLevelN(optional int iLevel)
MoveToPriorHeadingLevelN(iLevel)
EndScript

Script MoveToNextHeadingLevelOne ()
PerformScript MoveToNextHeadingLevelN(1)
endScript

Script MoveToPriorHeadingLevelOne ()
PerformScript MoveToPriorHeadingLevelN(1)
endScript

Script MoveToNextHeadingLevelTwo ()
PerformScript MoveToNextHeadingLevelN(2)
endScript

Script MoveToPriorHeadingLevelTwo ()
PerformScript MoveToPriorHeadingLevelN(2)
endScript

Script MoveToNextHeadingLevelThree ()
PerformScript MoveToNextHeadingLevelN(3)
endScript

Script MoveToPriorHeadingLevelThree ()
PerformScript MoveToPriorHeadingLevelN(3)
endScript

Script MoveToNextHeadingLevelFour ()
PerformScript MoveToNextHeadingLevelN(4)
endScript

Script MoveToPriorHeadingLevelFour ()
PerformScript MoveToPriorHeadingLevelN(4)
endScript

Script MoveToNextHeadingLevelFive ()
PerformScript MoveToNextHeadingLevelN(5)
endScript

Script MoveToPriorHeadingLevelFive ()
PerformScript MoveToPriorHeadingLevelN(5)
endScript

Script MoveToNextHeadingLevelSix ()
PerformScript MoveToNextHeadingLevelN(6)
endScript

Script MoveToPriorHeadingLevelSix ()
PerformScript MoveToPriorHeadingLevelN(6)
endScript

Script MoveToFirstHeadingLevelN()
MoveToFirstHeadingLevelN(stringToInt(StringRight(getCurrentScriptKeyName(),1)))
EndScript

Script moveToLastHeadingLevelN()
moveToLastHeadingLevelN(stringToInt(StringRight(getCurrentScriptKeyName(),1)))
EndScript

Script SelectAHeading()
SelectAHeadingDialog()
EndScript

script MoveToNextFrame()
MoveToNextFrame()
EndScript

script MoveToPriorFrame()
MoveToPriorFrame()
EndScript

script MoveToFirstFrame()
MoveToFirstFrame()
EndScript
script MoveToLastFrame()
MoveToLastFrame()
EndScript

script MoveToFrameByNumber()
;When this was originally implemented,
;the frame number was obtained by parsing the key assignment
;rather than using a parameter passed to the script.
;Those key assignments have been commented out for several versions of JAWS,
;but this script continues to use the key assignment parsing
;for backwards compatibilty in case someone still uses the old key assignments.
MoveToFrameByNumber(stringToInt(StringRight(getCurrentScriptKeyName(),1)))
EndScript

script SelectAnArticle()
PerformScript SelectAnArticle()
endScript

script SelectAButtonFormField()
performScript SelectAButtonFormField()
endScript

Script SelectAComboFormField()
PerformScript SelectAComboFormField()
endScript

Script SelectAnEditFormField()
PerformScript SelectAnEditFormField()
endScript

Script SelectARadioButtonFormField()
PerformScript SelectARadioButtonFormField()
endScript

script SelectACheckboxFormField()
performScript SelectACheckboxFormField()
endScript

script SelectATabFormField()
PerformScript SelectATabFormField()
endScript

Script SelectATable()
PerformScript SelectATable()
endScript

script SelectAGraphic()
performScript SelectAGraphic()
endScript

script SelectAListItem()
performScript SelectAListItem()
endScript

script SelectAList()
performScript SelectAList()
endScript

script SelectAParagraph()
performScript SelectAParagraph()
endScript

script SelectAnObject()
performScript SelectAnObject()
endScript

script SelectABlockQuote()
performScript SelectABlockQuote()
endScript

script SelectADivision()
performScript SelectADivision()
endScript

script SelectASpan()
performScript SelectASpan()
endScript

script SelectAnOnMouseOverElement()
performScript SelectAnOnMouseOverElement()
endScript

Script SelectaRegion ()
performScript SelectaRegion ()
endScript

Script SelectAMailToLink()
performScript SelectAMailToLink()
endScript

Script SelectaDropTarget()
performScript SelectaDropTarget()
endScript

string function GetAdditionalSysTrayIconNames ()
Var
	Int TrayIconsCount,
	Int i,
	Handle hTop = FindTopLevelWindow (cwc_ShellNotify, Null ()),
	Handle hTool = FindWindow (hTop, Windows11SysTrayIconsClass),
	Object window = FSUIAGetElementFromHandle (hTool),
	object trayIcons, object trayIcon,
	String Name, string names
if ! hTool || ! window return cscNull endIf
var object condition = FSUIACreateStringPropertyCondition(UIA_AutomationIdPropertyId,
	UIA_AutomationID_Windows_11_Tray_Icon)
if ! condition return cscNull endIf
trayIcons = window.FindAll(TreeScope_Subtree, condition)
if ! TrayIcons || ! TrayIcons.count return cscNull endIf
TrayIconsCount = TrayIcons.count
For i = 0 To TrayIconsCount-1
	trayIcon = trayIcons(i)
	Name = trayIcon.name
	if ! stringIsBlank (name) then
	names = names+cscBufferNewLine+name
endIf
EndFor
; pad the beginning so it can be added to the list of names we get already the old way.
if ! stringIsBlank (names) then names = cscBufferNewLine+names endIf
return names
endFunction

Script ViewSysTrayItems ()
; BY: Stephen Dawes
Var
	int iMax,
	int index,
	string strTemp,
	String strMessage
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
Let iMax = 0
Let index = 0
Let strTemp = ""
Let strMessage = ""
; Initialize the necessary variables
; Get the number of items on the system tray.
Let iMax = SysTrayGetItemCount ()
;Must give user error message if no items found in system tray
If ( 0 == iMax ) then
	SayFormattedMessage (OT_ERROR, cMsgNoSysTrayItems)
	return
EndIf
;;
; Index must start as 1, as 0 would return no item.
Let index = 1
; The SysTrayGetItemToolTip function returns the bubble help that would be displayed if the user
; were to hover over the icon with the mouse.
While (index <= iMax)
	if ( 0 != StringLength (strTemp) ) then
		Let strTemp = strTemp + cScBufferNewLine  ;; Adding NewLine so each item is on separate line.
	endIf
	Let strTemp = strTemp + SysTrayGetItemToolTip (index)
	Let index = index + 1
EndWhile
; now grab the new ones from Windows 11.
; The old ones are still there, or at least some, but many have moved to a new location:
strTemp = strTemp + GetAdditionalSysTrayIconNames () ; will pad if they're there.
;Now put items in string for Virtual Viewer
Let strMessage = FormatString (cmsgSysTrayItems,strTemp)
;Standard Virtual Viewer posting:
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayMessage (OT_USER_BUFFER, strMessage)
EndScript

Script MuteSynthesizer ()
; When toggling the Speech mode via the script, we want this setting to remain
; in effect until either the user invokes it again or restarts JAWS.
; Otherwise, random Default.jcf writes will undo our temporary changes.
; To accomplish this, we'll set the speech mode as a transient session setting.
var
	string message,
	int suppressAnnouncement = GetMostRecentFunctionNameFromCallStack() == "speechon",
	int onDemand = (getJCFOption (OPT_LESS_SPEECH) == 0)
if IsSpeechOff()
	JAWSProcessorSpeechOn()
	setDefaultJCFOption (OPT_SPEECH_MODE, 0)
	WriteSettingInteger (Section_Options, "SpeechMode", 0, FT_DEFAULT_JCF, wdSession)
	if !suppressAnnouncement
		SayMessage(ot_status,cmsgFullSpeech)
	endIf
else
	;only if invoked through this script,
	;tell the user if speech is being turned off or on demand:
	if onDemand then
		message = cmsgSpeechOnDemand
	else
		message = cmsgSpeechMute
	endIf
	setDefaultJCFOption (OPT_SPEECH_MODE, 1)
	WriteSettingInteger (Section_Options, "SpeechMode", 1, FT_DEFAULT_JCF, wdSession)
	if !suppressAnnouncement
		SayMessage(ot_status,message)
	endIf
	Delay(5)
	JAWSProcessorSpeechOff()
EndIf
EndScript

script SpeechOnDemandToggle()
if getJCFOption (OPT_SPEECH_MODE) == 0 then ; full speech is active
	sayMessage (OT_ERROR, cmsgSpeechOnDemandKeystrokeUnavailable)
	return
endIf
var
	string msg,
	int onDemand = (getJCFOption (OPT_LESS_SPEECH) == 0)
if onDemand
	msg = cmsgSpeechOnDemandOff
	setDefaultJCFOption (OPT_LESS_SPEECH, 1)
else
	msg = cmsgSpeechOnDemandOn
	setDefaultJCFOption (OPT_LESS_SPEECH, 0)
endIf
;temporarily turn on synthesizer and speak the message:
JAWSProcessorSpeechOn()
SayMessage(ot_status,msg)
JAWSProcessorSpeechOff()
EndScript

script ReadCurrentRow()
if TableErrorEncountered(TABLE_NAV_SAY_ROW) then
	return
endIf
Say(GetRowText(cscNull,cscNull,cmsgBlank1), ot_line)
endScript

script ReadFromCurrentCell()
var
	int nCurCol,
	int nCurRow
if TableErrorEncountered(TABLE_NAV_SAY_ROW_PARTIAL) then
	return
endIf
GetCellCoordinates(nCurCol,nCurRow)
Say(GetRowText(cscNull,cscNull,cmsgBlank1,nCurCol,0),ot_line)
endScript

script ReadToCurrentCell()
var
	int nCurCol,
	int nCurRow
if TableErrorEncountered(TABLE_NAV_SAY_ROW_PARTIAL) then
	return
endIf
GetCellCoordinates(nCurCol,nCurRow)
Say(GetRowText(cscNull,cscNull,cmsgBlank1,0,nCurCol),ot_line)
endScript

script ReadCurrentColumn()
if TableErrorEncountered(TABLE_NAV_SAY_COLUMN) then
	return
endIf
Say(GetColumnText(cscNull, cscNull, cmsgBlank1), ot_line)
endScript

script ReadToBottomOfColumn()
var
	int nCurCol,
	int nCurRow
if TableErrorEncountered(TABLE_NAV_SAY_COLUMN_PARTIAL) then
	return
endIf
GetCellCoordinates(nCurCol,nCurRow)
Say(GetColumnText(cscNull,cscNull,cmsgBlank1,nCurRow,0),ot_line)
endScript

script ReadFromTopOfColumn()
var
	int nCurCol,
	int nCurRow
if TableErrorEncountered(TABLE_NAV_SAY_COLUMN_PARTIAL) then
	return
endIf
GetCellCoordinates(nCurCol,nCurRow)
Say(GetColumnText(cscNull,cscNull,cmsgBlank1,0,nCurRow),ot_line)
endScript

script SelectHTMLElement()
var
	string sMsgLong,
	string sMsgShort,
	string sElementDescription
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if not IsVirtualPCCursor() then
	SayFormattedMessage(ot_error, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
let sElementDescription=GetElementDescription()
Let sElementDescription = (StringLower (sElementDescription))
If (sElementDescription == TAG_TABLE ||
sElementDescription == TAG_LIST_ORDERED ||
sElementDescription == TAG_LIST_DEFINITION) then
	;let sMsgLong=FormatString(cmsgSelectHTMLElement_L, GetLine ())
	;let sMsgShort=FormatString(cmsgSelectHTMLElement_S, GetLine ())
	;SayFormattedMessage(OT_SELECT, sMsgLong, sMsgShort)
	SelectHierarchicalElement()
	Return
EndIf
;let sMsgLong=FormatString(cmsgSelectHTMLElement_L,cScNull)
;let sMsgShort=FormatString(cmsgSelectHTMLElement_S,cScNull)
;SayFormattedMessage(OT_SELECT, sMsgLong, sMsgShort)
SelectHierarchicalElement()
;SayFormattedMessage (OT_SELECTED_ITEM, GetSelectedText ())
EndScript

script StepToEndOfElement ()
If !(GetRunningFSProducts() & product_JAWS | product_MAGic) then
	return
endIf
if not IsVirtualPCCursor() then
	SayFormattedMessage(ot_error, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
;Enter TRUE for first parameter
; default  second parameter is 0 which means use internal logic to determine number of levels
StepOutOfCurrentElement (TRUE)
If SayAllInProgress () then
	Return
EndIf
SayLine ()
EndScript

Script StepToStartOfElement ()
If !(GetRunningFSProducts() & product_JAWS | product_MAGic) then
	return
endIf
if not IsVirtualPCCursor() then
	SayFormattedMessage(ot_error, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
	return
endIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
;Enter FALSE for first parameter to go backward
; default  second parameter is 0 which means use internal logic to determine number of levels
StepOutOfCurrentElement (FALSE)
If SayAllInProgress () then
	Return
EndIf
SayLine ()
EndScript

script MoveToFirstSameElement ()
MoveToFirstSameElement ()
EndScript

script MoveToNextSameElement ()
MoveToNextSameElement ()
EndScript

Script MoveToPriorSameElement ()
MoveToPriorSameElement ()
EndScript

Script MoveToLastSameElement ()
MoveToLastSameElement ()
 EndScript

Script MoveToNextDifferentElement ()
MoveToNextDifferentElement ()
EndScript

Script MoveToPriorDifferentElement ()
MoveToPriorDifferentElement ()
EndScript

script MoveToFirstButton()
MoveToFirstButton()
EndScript

script MoveToLastButton()
MoveToLastButton()
EndScript

script MoveToNextButton()
MoveToNextButton()
EndScript

script MoveToPriorButton()
MoveToPriorButton()
EndScript

script MoveToNextCheckbox()
MoveToNextCheckbox()
EndScript

script MoveToPriorCheckbox()
MoveToPriorCheckbox()
EndScript

script MoveToNextRadioButton()
MoveToNextRadioButton()
EndScript

script MoveToPriorRadioButton()
MoveToPriorRadioButton()
EndScript

script MoveToNextEdit()
MoveToNextEdit()
EndScript

script MoveToPriorEdit()
MoveToPriorEdit()
EndScript

script MoveToNextMailToLink()
MoveToNextMailToLink()
EndScript

script MoveToPriorMailToLink()
MoveToPriorMailToLink()
EndScript

script MoveToNextObject()
MoveToNextObject()
EndScript

script MoveToPriorObject()
MoveToPriorObject()
EndScript

script MoveToFirstObject()
MoveToFirstObject()
EndScript

script MoveToLastObject()
MoveToLastObject()
EndScript

script MoveToNextBlockQuote()
MoveToNextBlockQuote()
EndScript

script MoveToPriorBlockQuote()
MoveToPriorBlockQuote()
EndScript

script MoveToFirstBlockquote()
MoveToFirstBlockquote()
EndScript

script MoveToLastBlockquote()
MoveToLastBlockquote()
EndScript

script MoveToNextGraphic()
MoveToNextGraphic()
EndScript

script MoveToPriorGraphic()
MoveToPriorGraphic()
EndScript

script MoveToFirstGraphic()
MoveToFirstGraphic()
EndScript

script MoveToLastGraphic()
MoveToLastGraphic()
EndScript

script MoveToNextForm ()
MoveToNextForm ()
EndScript

script MoveToPriorForm ()
MoveToPriorForm ()
EndScript

script MoveToFirstForm ()
MoveToFirstForm ()
EndScript

script MoveToLastForm ()
MoveToLastForm ()
EndScript

script MoveToNextCombo()
MoveToNextCombo()
EndScript

script MoveToPriorCombo()
MoveToPriorCombo()
EndScript

script MoveToNextAnchor()
MoveToNextAnchor()
EndScript

script MoveToPriorAnchor()
MoveToPriorAnchor()
EndScript

script MoveToNextListItem()
MoveToNextListItem()
EndScript

script MoveToPriorListItem()
MoveToPriorListItem()
EndScript

script MoveToNextSeparator()
MoveToNextSeparator()
EndScript

script MoveToPriorSeparator()
MoveToPriorSeparator()
EndScript

script MoveToNextSlider()
MoveToNextSlider()
EndScript

script MoveToPriorSlider()
MoveToPriorSlider()
EndScript

script MoveToNextDivision()
MoveToNextDivision()
EndScript

script MoveToPriorDivision()
MoveToPriorDivision()
EndScript

script MoveToNextSpan()
MoveToNextSpan()
EndScript

script MoveToPriorSpan()
MoveToPriorSpan()
EndScript

script MoveToNextOnClickElement()
MoveToNextOnClickElement()
EndScript

script MoveToPriorOnClickElement()
MoveToPriorOnClickElement()
EndScript

script MoveToNextOnMouseOverElement()
MoveToNextOnMouseOverElement()
EndScript

script MoveToPriorOnMouseOverElement()
MoveToPriorOnMouseOverElement()
EndScript

script MoveToFirstTab()
MoveToFirstTab()
EndScript

script MoveToLastTab()
MoveToLastTab()
EndScript

script MoveToNextTab()
MoveToNextTab()
EndScript

script MoveToPriorTab()
MoveToPriorTab()
EndScript

script MoveToFirstArticle()
MoveToArticle(s_top)
EndScript

script MoveToLastArticle()
MoveToArticle(s_bottom)
EndScript

script MoveToNextArticle()
MoveToArticle(s_next)
EndScript

script MoveToPriorArticle()
MoveToArticle(s_prior)
EndScript

Script BrailleToggleTableHeaders (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleToggleTableHeaders ()
EndScript

Script BrailleToggleTableReading (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleToggleTableReading ()
EndScript

Script DisplayBasicElementInfo ()
PerformScript DisplayBasicElementInfo ()
EndScript

Script DisplayAdvancedElementInfo ()
PerformScript DisplayAdvancedElementInfo ()
EndScript

Script IEFind ()
PerformScript IEFind ()
EndScript

int function PointNeedsMarking(int x, int y)
;This function is only called if the OPT_BRL_CHECK_EXT_MARKING jcf option is on.
;This must then return true if the character at the supplied point needs
;marking on the display
return PointNeedsMarking (x, y)
endFunction

void function PageRefreshPrewarning(int nSeconds, string sURL)
var
string sSeconds
let sSeconds=intToString(nSeconds)

SayFormattedMessage(OT_SMART_HELP, formatString(cmsgPageRefreshPrewarning_L,sSeconds), formatString(cmsgPageRefreshPrewarning_S,sSeconds))
endFunction

void function QuickKeyNavigationModeChanged(int bEnabled)
if SayAllInProgress()
|| UserBufferIsActive () then
	return;
endIf
;if bEnabled then
;	SayFormattedMessage(OT_JAWS_MESSAGE, cmsgNavigationModeOn_L, cmsgNavigationModeOn_S)
;else
;	SayFormattedMessage(OT_JAWS_MESSAGE, cmsgNavigationModeOff_L, cmsgNavigationModeOff_S)
;endIf
endFunction

Script NavigationModeToggle ()
PerformScript NavigationModeToggle ()
EndScript

string function GetTextInWindow(handle hWnd)
var
	int tlx,
	int tly,
	int brx,
	int bry
let tlx=GetWindowLeft(hwnd)
let tly=getWindowTop(hwnd)
let brx=GetWindowRight(hwnd)
let bry=getWindowBottom(hwnd)
return GetTextInRect(tlx,tly,brx,bry,0,IgnoreColor,IgnoreColor,1)
EndFunction

script VirtualizeCurrentControl()
var
	string sText
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsVirtualPCCursor() then
	SayMessage(OT_ERROR,cmsgAlreadyVirtualized_L,cmsgAlreadyVirtualized_S)
	return
elif IsFormsModeActive() then
	SayMessage(OT_ERROR,cmsgVirtualizeUnavailableInFormsMode_L,cmsgVirtualizeUnavailableInFormsMode_S)
	return
endIf
let sText = GetTextInWindow(GetCurrentWindow())
if !sText then
		let sText=GetTypeAndTextStringsForWindow(getFocus())
endIf
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

script SendControlTextToClipboard ()
var
	string sText
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsFormsModeActive() then
	SayMessage(OT_ERROR,cmsgVirtualizeUnavailableInFormsMode_L,cmsgVirtualizeUnavailableInFormsMode_S)
	return
endIf
let sText = GetTextInWindow(GetCurrentWindow())
if !sText then
		let sText=GetTypeAndTextStringsForWindow(getFocus())
endIf
if !sText then
	SayMessage(OT_ERROR,cmsgNoTextToVirtualize_L,cmsgNoTextToVirtualize_S)
	return
endIf
CopyToClipboard (sText)
SayMessage(ot_JAWS_Message,cmsgCopyControl_L,cmsgCopyControl_S)
endScript

script VirtualizeWindow()
var
	string sText
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsVirtualPCCursor() then
	SayMessage(OT_ERROR,cmsgAlreadyVirtualized_L,cmsgAlreadyVirtualized_S)
	return
elif IsFormsModeActive() then
	SayMessage(OT_ERROR,cmsgVirtualizeUnavailableInFormsMode_L,cmsgVirtualizeUnavailableInFormsMode_S)
	return
endIf
let sText = GetTextInWindow(GetRealWindow(GetCurrentWindow()))
if !sText then
		let sText=GetTypeAndTextStringsForWindow(getFocus())
endIf
if !sText then
	SayMessage(OT_ERROR,cmsgNoTextToVirtualize_L,cmsgNoTextToVirtualize_S)
	return
endIf
SayMessage(ot_JAWS_Message,cmsgVirtualizeWindow_L,cmsgVirtualizeWindow_S)
UserBufferClear()
UserBufferAddText(sText)
UserBufferActivate()
SayLine()
endScript

script SendWindowTextToClipboard ()
var
	string sText
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsFormsModeActive() then
	SayMessage(OT_ERROR,cmsgVirtualizeUnavailableInFormsMode_L,cmsgVirtualizeUnavailableInFormsMode_S)
	return
endIf
let sText = GetTextInWindow(GetRealWindow(GetCurrentWindow()))
if !sText then
		let sText=GetTypeAndTextStringsForWindow(getFocus())
endIf
if !sText then
	SayMessage(OT_ERROR,cmsgNoTextToVirtualize_L,cmsgNoTextToVirtualize_S)
	return
endIf
CopyToClipboard (sText)
SayMessage(ot_JAWS_Message,cmsgCopyWindow_L,cmsgCopyWindow_S)
endScript

Script SetPunctuationLevel ()
SayFormattedMessage (OT_STATUS, PunctuationToggle (false))
EndScript

Script BrailleSelectBlock (int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
SelectFromBrailleToPCCursor ()
EndScript

script JumpReturnFromTableCell()
JumpReturnFromTableCell()
EndScript

script JumpToTableCell()
JumpToTableCell()
endScript

script JumpReturnFromLine()
JumpReturnFromLine()
EndScript

script JumpToLine()
JumpToLine()
EndScript

Script JumpTo ()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
If InTable () then
	JumpToTableCell()
Else
	JumpToLine ()
EndIf
EndScript

void function NavigationWrappedEvent(int bForward)
if bForward then
	SayFormattedMessage(OT_STATUS,cmsgWrappingToTop_L,cmsgWrappingToTop_S)
	beep()
else
	sayFormattedMessage(OT_STATUS,cmsgWrappingToBottom_L,cmsgWrappingToBottom_S)
	beep()
endIf
EndFunction

void function SayCharacterValue()
var
	int nFlags
	;nFlags: see cvf constants
let nFlags=cvfWantMarkup; use markup
if GetJCFOption(OPT_USE_HEX_FOR_SAY_CHARACTER_VALUE) then
	let nFlags=nFlags|cvfWantHex
endIf
If getJCFOption(		OPT_CONVERT_UNICODE_CHAR_TO_MULTIBYTE_SEQ)==FALSE then
	let nFlags=nFlags|cvfWantValueOfWideChar
endIf
SayMessageWithMarkup (OT_USER_REQUESTED_INFORMATION,GetCharacterValueString(getCharacter(),nFlags),cscNull)
/*
var
	string hex
if IsUnicodeJAWS() then
SayFormattedMessage(ot_user_requested_information, FormatString(cmsgCharacterValue_L,GetSpellString( DecToHex(GetCharacterValue(GetCharacter())))),
	formatString(cmsgCharacterValue_S,GetSpellString( DecToHex(GetCharacterValue(GetCharacter())))))

else
SayFormattedMessage(ot_user_requested_information, FormatString(cmsgCharacterValue_L,IntToString(GetCharacterValue(GetCharacter()))),
	formatString(cmsgCharacterValue_S,IntToString(GetCharacterValue(GetCharacter()))))
endIf
*/
endFunction

Script SelectAPlaceMarker()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
EnsureNoUserBufferActive(false)
if (IsVirtualPCCursor()) then
	DlgListOfPlaceMarkers(0)
endif
EndScript

script SelectAScheme()
var
	string sFileList,
	string sSchemeFile,
	int iSchemeFileCount,
	string sNameList,
	string sSchemeName,
	int iIndex,
	string sMessageLong,
	string sMessageShort,
	int nCurrentIndex,
	string jcfFileName,
	string jcfSchemeName
let sFileList=FileNameList(cSchemeMask,LIST_ITEM_SEPARATOR)
let iSchemeFileCount = StringSegmentcount(sFileList,LIST_ITEM_SEPARATOR)
for iIndex = 1 to iSchemeFileCount
	let sSchemeFile = stringSegment(sFileList,LIST_ITEM_SEPARATOR,iIndex)
	let sSchemeName = IniReadString(SMF_Section_Information,smf_hKey_Title,sSchemeFile,sSchemeFile+".smf")
	if iIndex < iSchemeFileCount then
		let sNameList = sNameList+sSchemeName+LIST_ITEM_SEPARATOR
	else
		let sNameList = sNameList+sSchemeName
	EndIf
EndFor
if smmTrainingModeActive() then
	let sNameList = cmsgToggleSMMTrainingModeOff_L+LIST_ITEM_SEPARATOR+sNameList
else
	let sNameList=cmsgToggleSMMTrainingModeOn_L+LIST_ITEM_SEPARATOR+sNameList
endIf
let nCurrentIndex=StringSegmentIndex(sFileList,LIST_ITEM_SEPARATOR,GetCurrentSchemeName(),TRUE)
let iIndex=dlgSelectItemInList(sNameList,cDlgSelectASchemeTitle,FALSE,nCurrentIndex+1)
if iIndex <=0 then
	return
endIf
if iIndex==1 then
	toggleSMMTrainingMode()
	return
endIf
let sSchemeFile = stringSegment(sFileList,LIST_ITEM_SEPARATOR,iIndex-1)
let sSchemeName = stringSegment(sNameList,LIST_ITEM_SEPARATOR,iIndex)
let jcfFileName = StringChopRight(GetScriptFilename(true),3)+jcfFileExt
let jcfSchemeName = IniReadString(section_options,hKeySchemeName,jcfSchemeName,jcfFilename)
if SwitchToScheme(sSchemeFile) then
	let sMessageLong=FormatString(cmsgSwitchToScheme_L,sSchemeName)
	let sMessageShort=FormatString(cmsgSwitchToScheme_S,sSchemeName)
	SayFormattedMessage(OT_STATUS,sMessageLong,sMessageShort)
	If StringCompare(sSchemeFile,jcfSchemeName) != 0 then
		IniWriteString(section_options,hKeySchemeName,sSchemeFile,jcfFilename)
	EndIf
Else
	let sMessageLong=FormatString(cmsgSwitchToSchemeError_L,sSchemeName)
	let sMessageShort=FormatString(cmsgSwitchToSchemeError_S,sSchemeName)
	SayFormattedMessage(OT_ERROR,sMessageLong,sMessageShort)
endIf
EndScript

script VirtualHTMLFeatures ()
var
	int Index,
	string sDlgListItems
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
let sDlgListItems = cStrVirtHTMLDlgLst1 + cStrVirtHTMLDlgLst2+cStrVirtHTMLDlgLst3
Let index = dlgSelectItemInList (sDlgListItems , cStrVirtHTMLDlgName, TRUE)
Delay (2)
Let GlobalWasHjDialog = FALSE
If index == 0 then
	Return
EndIf
Let GlobalWasHjDialog = FALSE
If Index == 1 then
	PerformScript SelectAPlaceMarker()
	Return
ElIf Index == 2 then
	PerformScript SelectAFormField ()
	Return
ElIf index == 3 Then
	PerformScript SelectAHeading ()
	return
ElIf index == 4 Then
	PerformScript SelectALink ()
	return
ElIf index == 5 Then
	PerformScript SelectAButtonFormField ()
	return
ElIf index == 6 Then
	PerformScript SelectAnEditFormField ()
	return
ElIf index == 7 Then
	PerformScript SelectAList ()
	return
ElIf index == 8 Then
	PerformScript SelectACheckboxFormField ()
	return
ElIf index == 9 Then
	PerformScript SelectATable ()
	return
ElIf index == 10 Then
	PerformScript SelectARadioButtonFormField ()
	return
ElIf index == 11 Then
	PerformScript SelectABlockQuote ()
	return
ElIf index == 12 Then
	PerformScript SelectAListItem ()
	return
ElIf index == 13 Then
	PerformScript SelectADivision ()
	return
ElIf index == 14 Then
	PerformScript SelectAComboFormField ()
	return
ElIf index == 15 Then
	PerformScript SelectAFrame ()
	return
ElIf index == 16 Then
	PerformScript SelectAParagraph ()
	return
ElIf index == 17 Then
	PerformScript SelectAnAnchor ()
	return
ElIf index == 18 Then
	PerformScript SelectAGraphic ()
	return
ElIf index == 19 Then
	PerformScript SelectAnArticle ()
	return
ElIf index == 20 Then
	PerformScript SelectARegion()
	return
ElIf index == 21 Then
	PerformScript SelectATabFormfield()
	return
ElIf index == 22 Then
	PerformScript SelectAGlanceHighlight()
	return
EndIf
EndScript


;Next two contributions by JC
;For skipping long strings of numbers and punctuation.
Script NumericDataSayNextAsSingleUnit ()
var
	string strCurrentWord,
	int nCount
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
let nCount = 0
let strCurrentWord = GetWord ()
While ((GetWord () == strCurrentWord) && nCount < 10)
	NextWord ()
	let nCount = nCount + 1
EndWhile
SayWord ()
EndScript

Script NumericDataSayPriorAsSingleUnit ()
var
	string strCurrentWord,
	int nCount
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
let nCount = 0
let strCurrentWord = GetWord ()
While ((GetWord () == strCurrentWord) && nCount < 10)
	PriorWord ()
let nCount = nCount +1
EndWhile
SayWord ()
EndScript

; This is just an example of how the InternalFrameChangedEvent
; is used to speak the frame name before the FocusChangedEvent
; is called to speak the FocusObject
void Function InternalFrameChangedEvent (handle hwnd, handle idFrame, string strFrameName)
SayString(strFrameName)
EndFunction

script SpeakNthPlaceMarker()
var
	int nIndex,
	int iNumOfPlaceMarkers,
	int bMoveToPlaceMarker
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
if IsSameScript() then
	let bMoveToPlaceMarker=TRUE
else
	let bMoveToPlaceMarker=FALSE
endIf
let nIndex=stringToInt(stringRight(GetCurrentScriptKeyName(),1))
if nIndex==0 then
	let nIndex=10
endIf
If ! SpeakPlaceMarkerByIndex(nIndex,bMoveToPlaceMarker) then
	;Speak relevant error messages.
	Let iNumOfPlaceMarkers = GetPlaceMarkerCount ()
	If ! iNumOfPlaceMarkers then
		SayFormattedMessage (OT_ERROR, cMsgNoPlaceMarkers_L, cMsgNoPlaceMarkers_S)
		Return
	ElIf iNumOfPlaceMarkers == 1 then
		SayFormattedMessage (OT_ERROR, cmsgOnePlaceMarker_L, cmsgOnePlaceMarker_S)
		Return
	Else
		SayFormattedMessage (OT_ERROR, FormatString (cmsgNumOfPlaceMarkers_L,
		IntToString (iNumOfPlaceMarkers)), FormatString (cmsgNumOfPlaceMarkers_S, IntToString (iNumOfPlaceMarkers)))
		Return
	EndIf
EndIf
endScript

script SpeakPlaceMarkerN(optional int nPlaceMarker)
SpeakPlaceMarkerN(nPlaceMarker)
EndScript

script MoveToPlaceMarkerN(optional int nPlaceMarker)
MoveToPlaceMarkerN(nPlaceMarker)
EndScript

Script MoveToNextPlaceMarker()
MoveToNextPlaceMarker()
EndScript

Script MoveToPriorPlaceMarker()
MoveToPriorPlaceMarker()
EndScript

Script DefineATempPlaceMarker()
PerformScript DefineATempPlaceMarker()
EndScript

void function SpeakCustomPageSummary()
var
	int bPriorFormsMode
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
let bPriorFormsMode=IsFormsModeActive()
if IsFormsModeActive() then
	TurnOffFormsMode(FormsModeEventSpeechSilent)
endIf
;SayFormattedMessage(OT_SMART_HELP,cmsgCustomPageSummary_L,cmsgCustomPageSummary_S)
Refresh()
placeMarkersEnumerate("PlaceMarkersEnumerateCallback",true)
if bPriorFormsMode then
	TurnOnFormsMode(FormsModeEventSpeechSilent)
endIf
endFunction

void function VirtualizeCustomPageSummary()
var
	int bPriorFormsMode
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
let bPriorFormsMode=IsFormsModeActive()
let giRestoreFormsModeAfterVirtualizeCPS=IsFormsModeActive()
if IsFormsModeActive() then
	TurnOffFormsMode(FormsModeEventSpeechSilent)
endIf
Refresh()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (MSG_CustomSummaryResultsTitle)
if (placeMarkersEnumerate("PlaceMarkersEnumerateCallbackVirtual",false))
	UserBufferAddTextResultsViewer (cMsgBuffExit)
endIf
;UserBufferActivate()
endFunction

int function PlaceMarkersEnumerateCallback(int nIndex, string sName, string sText)
if (sName!=smmStripMarkup(sText)) then
	say(sName,OT_JAWS_MESSAGE)
endIf
say(sText,ot_LINE,TRUE)
return TRUE
endFunction

int function PlaceMarkersEnumerateCallbackVirtual(int nIndex, string sName, string sText)
UserBufferAddTextResultsViewer (sName, "MoveToPlaceMarkerByIndex("+intToString(nIndex)+")",sName)
if (stringLength(sName)==StringLength(sText) && sName==sText) then
	return TRUE; don't want to duplicate info
else
	UserBufferAddTextResultsViewer (SText)
endIf
return TRUE
endFunction

void function MoveToPlaceMarkerByIndex(int n)
UserBufferDeactivate()
SpeakPlaceMarkerByIndex(n,TRUE)
if giRestoreFormsModeAfterVirtualizeCPS then
	let GiIgnoreFormsModeSpeak = FormsModeEventSpeechSilent
	EnterKey(); ensure new placemarker gets properly activated rather than Formsmode just being re-enabled
	if IsFormsModeActive() == FALSE then
		TurnOnFormsMode(FormsModeEventSpeechSilent); in case Enterkey didn't do it.
	endIf
	let giRestoreFormsModeAfterVirtualizeCPS=FALSE;
endIf
endFunction

script SpeakPlaceMarkers()
If !(GetRunningFSProducts() & product_JAWS)
|| !(IsVirtualPCCursor() || IsFormsModeActive()) then
	;This may be a native keystroke in some apps:
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
	return
EndIf
if !GetPlaceMarkerCount () then
	sayMessage (OT_ERROR, cMsgNoPlaceMarkers_L, cMsgNoPlaceMarkers_S)
	Return
endIf
if IsSameScript() then
	VirtualizeCustomPageSummary()
else
	SpeakCustomPageSummary()
endIf
endScript
void function ToggleSMMTrainingMode()
var
	int nMode
let nMode=smmTrainingModeActive()
let nMode=!nMode
smmToggleTrainingMode(nMode)
if nMode then
	SayMessage(OT_STATUS,cmsg_on) ;ToggleSMMTrainingModeOn_S
else
	SayMessage(OT_STATUS,cmsg_off) ;ToggleSMMTrainingModeOff_S)
endIf
EndFunction

int function SayListViewCheckBoxObjectState()
;here we catch listviews whose child objects are actually checkboxes, and announce the state if we can.
var
	string sState,
	int iMSAAMode
; Don't want to do this for the Desktop since it doesn't have checkboxes and switching on MSAA mode unnecessarily is expensive.
;(other half of fix to track defect 21587) highlight not updating on the desktop
if GetWindowClass(GetRealWindow(globalFocusWindow))==cwcProgman then
	return false
endIf
let iMSAAMode = GetJCFOption(opt_msaa_mode)
SetJCFOption(opt_msaa_mode,2)
if GetObjectSubtypeCode() == wt_CheckBox then
	let sState = GetObjectState()
	SetJCFOption(opt_msaa_mode,iMSAAMode)
	if sState then
		;the state string may contain leading blanks.
		;be sure to execute the following if statement in this order:
		if StringContains(sState,cmsg_notChecked) then
			Say(smmGetStartMarkupForControlState(wt_ListView,CTRL_UNCHECKED),ot_item_state,true)
			return true
		ElIf StringContains(sState,cMSG_checked) then
			Say(smmGetStartMarkupForControlState(wt_ListView,CTRL_CHECKED),ot_item_state,true)
			return true
		EndIf
	EndIf
EndIf
SetJCFOption(opt_msaa_mode,iMSAAMode)
return false
EndFunction

void function SayLVItemCheckStatus(handle hWnd)
var
	int iState
let iState = lvGetItemState(hWnd,lvGetFocusItem(hWnd))
if iState & lv_ItemChecked then
	Say(smmGetStartMarkupForControlState(wt_ListView,CTRL_CHECKED),ot_item_state,true)
ElIf iState & lv_ItemNotChecked then
	Say(smmGetStartMarkupForControlState(wt_ListView,CTRL_UNCHECKED),ot_item_state,true)
else
	SayListViewCheckBoxObjectState()
EndIf
EndFunction

script BrailleAutoAdvance(optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
; toggle the mode.
var int mode = BrailleAutoadvanceModeActive()
mode =! mode
BrailleAutoAdvanceMode( mode )
EndScript

Script IncreaseBrailleAutoAdvanceSpeed(optional int index)
var
	int nValue
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
let nValue=getJCFOption(OPT_BRL_AUTOADVANCE_INTERVAL)
if nValue > 500 then
	let nValue=nValue-500; decrease by half a second
	SetJCFOption(OPT_BRL_AUTOADVANCE_INTERVAL,nValue); save the new value so when we query it again we get the saved value
endIf
EndScript

Script DecreaseBrailleAutoAdvanceSpeed(optional int index)
var
	int nValue
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
let nValue=getJCFOption(OPT_BRL_AUTOADVANCE_INTERVAL)
if nValue < 10000 then
	let nValue=nValue+500; increase by half a second
	SetJCFOption(OPT_BRL_AUTOADVANCE_INTERVAL,nValue); save the new value so when we query it again we get the saved value
endIf
EndScript

void function SpeakProgressBarInfo(int bSpeakPrompt, optional int bSpeakZeroPercent)
var
	handle hProgress,
	string sName,
	string sValue,
	string sMessage
let hProgress=GetProgressBarInfo(sName,sValue)
if hProgress then
	if !bSpeakZeroPercent then
		if sValue == cmsgZeroPercentProgress then
			return
		EndIf
	EndIf
	if bSpeakPrompt then
		let sMessage=FormatString(CMSGProgressBar,sName,sValue)
	else
		let sMessage=sValue
	endIf
	sayMessage(OT_USER_REQUESTED_INFORMATION,sMessage)
endIf
endFunction

void function ProgressBarChangedEvent(handle hProgress, string sName, string sValue)
sayMessage(OT_POSITION,sValue)
endFunction

int function IsTrueListView(handle hWnd)
var
	string sClass
let sClass = GetWindowClass(hWnd)
return GetWindowTypeCode (hWnd) == WT_LISTVIEW ||
StringContains (StringLower(sClass), cwcListViewGeneric) ||; list view controls with different class
sClass == cWcListView || sClass == cwcATLListView
EndFunction

script CustomizeListView()
var
	handle hCurrent
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
let hCurrent=GetCurrentWindow()
if !IsTrueListView(hCurrent) then
	SayMessage(OT_ERROR,cmsgNotInAListview_L,cmsgNotInAListview_S)
	return
Endif
DlgCustomizeListview(hCurrent)
endScript

script ReadListviewColumn()
var
	int nCol,
	int nMaxCols,
	string sHeader,
	string sText,
	handle hCurrent,
	int nCurrent
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
let hCurrent=getCurrentWindow()
if !IsTrueListView(hCurrent) then
	sayMessage(OT_ERROR,cmsgNotInAListview_L,cmsgNotInAListview_S)
	return
endIf
let nCol=StringToInt(stringRight(GetCurrentScriptKeyName(),1))
let nCurrent=lvGetFocusItem(hCurrent)
if (nCol==0) then
	let nCol=10
endIf
if (nCol < 1) then
	let nCol=1
endIf
let nMaxCols=lvGetNumOfColumns(hCurrent)
if (nCol > nMaxCols) then
	SayFormattedMessage(OT_ERROR,formatString(cmsgListviewContainsXColumns_L,intToString(nCol),intToString(nMaxCols)),formatString(cmsgListviewContainsXColumns_S,intToString(nCol)))
	return
endIf
let sHeader=lvGetColumnHeader(hCurrent,nCol)
let sText=lvGetItemText(hCurrent,nCurrent,nCol)
say(sHeader,OT_NO_DISABLE)
say(sText,OT_NO_DISABLE)
endScript

void function SayControlAttribBits(int Value)
var
	int FlagSet,
	int bit
let FlagSet = GetControlAttributes()
let bit = 0
while bit<16
	if FlagSet & 1<<bit then
		if value then
			;say the numeric value of the bit:
			SayInteger(1<<bit)
		else ;say the bit number:
			SayInteger(bit)
		EndIf
	EndIf
	let bit = bit+1
EndWhile
EndFunction

void function SayTextAttribBits(int value)
var
	int FlagSet,
	int bit
let FlagSet = GetCharacterAttributes()
let bit = 0
while bit<16
	if FlagSet & 1<<bit then
		if value then
			;say the numeric value of the bit:
			SayInteger(1<<bit)
		else ;say the bit number:
			SayInteger(bit)
		EndIf
	EndIf
	let bit = bit+1
EndWhile
EndFunction

Script RefreshScripts()
Say(cmsgRefreshScripts,ot_status)
ReloadAllConfigs()
EndScript

script SkimReadDialog()
If UserBufferIsActiveResultsViewer ()
	; we do not allow a skim read of the results viewer:
	SayFormattedMessage (OT_ERROR, cMSG337_L, cMSG337_S)
	Return
EndIf
dlgSkimRead()
endScript

script StartSkimRead()
SkimRead()
endScript

void function SkimReadMoveToDocOffset(int nOffset)
MoveToDocumentOffset(nOffset)
endFunction

void function SkimReadMoveToDocLine(int nLine)
GotoLineNumber(nLine)
endFunction

void function SkimReadMatchCallback(int nMatch, string sText, int nDocLine, int nDocOffset)
var
	string functNameAndParams,
	string displayName
; we don't want an empty results viewer.
if stringIsBlank (sText) then
	return ;	Keep empty results viewer from showing up.
endIf
if nMatch==1 then
	UserBufferClearResultsViewer ()
	UpdateResultsViewerTitle (cmsgSkimReadingResults)
endIf
;use which ever is most specific, if nDocOffset >=0 it is valid and should be used
if (nDocOffset >=0) then
	let functNameAndParams="SkimReadMoveToDocOffset("+IntToString(nDocOffset)+")"
else
	let functNameAndParams="SkimReadMoveToDocLine("+IntToString(nDocLine)+")"
endIf
let displayName=formatString(cmsgSkimReadMoveToMatch,intToString(nMatch))
let sText = FormatString(cmsgSkimReadSummaryLink,IntToString(nMatch),sText)
UserBufferAddTextResultsViewer (sText, functNameAndParams, displayName, cFont_Times, 12, attrib_Text, 0, 0xffffff, TRUE)
endFunction

void function SkimReadStoppedEvent(int nSkimReadingMode, int nMatches, int bSummarize)
;if creating a summary, this fires once for each match.
;otherwise, it fires when the skim reading is stopped.
var
	string sLong,
	string sShort
if !bSummarize
&& nSkimReadingMode >= srmTextMatchingRegularExpression then
let sLong=FormatString(CMSGSkimReadStopped_L,intToString(nMatches))
let sShort=FormatString(CMSGSkimReadStopped_L,intToString(nMatches))
	SayFormattedMessage(OT_JAWS_MESSAGE,sLong,sShort)
endIf
endFunction

script RepeatLastFlashMessage(optional int index)
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
BrailleMessageRepeatLast()
endScript


Function CheckForReminderDialog (handle hWindow)
; Is newly created window the Outlook Reminder dialog?
If (!ghReminderDialog
&& ghOutlookWindow) Then
; Outlook is open and Reminder dialog is not.
	If GetWindowClass(hWindow)==cwc290
	&& StringContains(GetWindowName(hWindow),cscSnooze) Then
	; It is a button with the name of "Snooze."
		let ghReminderDialog=hWindow
	EndIf
EndIf
EndFunction

; To find the reminder window if the reminder handle is empty.
Int Function EnumToFindReminder (handle hWnd)
If IsWindowVisible (hWnd)
		&& GetWindowTypeCode (hWnd) == WT_DIALOG
		&& StringContains (GetWindowName (hWnd), "Reminder") then
	let ghReminderDialog = hWnd
	Return (FALSE)
EndIf
Return (TRUE)
EndFunction

Script ToggleOutlookReminder ()
var
	Handle hNull,
	handle hParent,
	handle hWnd
let hWnd=GetFocus()
let hParent=GetParent(hWnd)
If Not ghReminderDialog then
	EnumerateChildWindows (hNull, "EnumToFindReminder")
EndIf
If (GetRealWindow(hWnd)!=GetRealWindow(ghReminderDialog)) Then
; Current window is not Reminder dialog.
	If (ghReminderDialog  && IsWindowVisible (ghReminderDialog)) Then
	; Reminder dialog is open and visible, so save current locale and move to that window.
		If hWnd==GetAppMainWindow(hWnd) Then
			; Current focus is main app window...
			let ghReminderReturn=hWnd
		Else ; Get the parent of the current focus.
			let ghReminderReturn=hParent
		EndIf
		SetFocus(ghReminderDialog)
	Else
	; Reminder is not open or is not visible.
		SayFormattedMessage(OT_ERROR,cmsgReminderNotVisible_L,cmsgReminderNotVisible_S)
		Return
	EndIf
ElIf (hWnd!=ghReminderReturn &&  IsWindowVisible(ghReminderReturn)) Then
; Reminder return is not the current window, and it is visible.
	SetFocus(ghReminderReturn)
EndIf
EndScript

/*
Script ToggleOutlookReminder ()
var
	handle hParent,
	handle hWnd
let hWnd=GetFocus()
let hParent=GetParent(hWnd)
If (GetRealWindow(hWnd)!=GetRealWindow(ghReminderDialog)) Then
; Current window is not Reminder dialog.
	If (ghReminderDialog  && IsWindowVisible (ghReminderDialog)) Then
	; Reminder dialog is open and visible, so save current locale and move to that window.
		If hWnd==GetAppMainWindow(hWnd) Then
			; Current focus is main app window...
			let ghReminderReturn=hWnd
		Else ; Get the parent of the current focus.
			let ghReminderReturn=hParent
		EndIf
		SetFocus(ghReminderDialog)
	Else
	; Reminder is not open or is not visible.
		SayFormattedMessage(OT_ERROR,cmsgReminderNotVisible_L,cmsgReminderNotVisible_S)
		Return
	EndIf
ElIf (hWnd!=ghReminderReturn &&  IsWindowVisible(ghReminderReturn)) Then
; Reminder return is not the current window, and it is visible.
	SetFocus(ghReminderReturn)
EndIf
EndScript
*/

void function OnMouseOverActivated(int nx, int ny, int bElementAttributesChanged, int nTextChangedAtLineNumber, int bTitleChanged)
var
string sMessageLong,
string sMessageShort
if (bElementAttributesChanged==FALSE && nTextChangedAtLineNumber ==-1 && bTitleChanged==FALSE) then
	SayFormattedMessage(OT_STATUS,cmsgOnMouseOverNoChange_l,cmsgOnMouseOverNoChange_S)
	return
endIf
BeginFlashMessage()
if (bTitleChanged) && nTextChangedAtLineNumber !=1 then
	SayMessage(OT_STATUS,cmsgOnMouseOverElementPageTitleChanged_L,cmsgOnMouseOverElementPageTitleChanged_S)
endIf
if (bElementAttributesChanged) then
	SayMessage(OT_STATUS,cmsgOnMouseOverElementAttributesChanged_L,cmsgOnMouseOverElementAttributesChanged_S)
endIf
if (nTextChangedAtLineNumber > 0) then
	sayFormattedMessage(OT_STATUS,formatString(cmsgOnMouseOverTextCHANGE_L,intToString(nTextChangedAtLineNumber)),formatString(cmsgOnMouseOverTextCHANGE_S,intToString(nTextChangedAtLineNumber)))
endIf
EndFlashMessage()
endFunction

script SettingsPackager()
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
run("\""+FindJAWSUtilityProgram (MGR_SETTINGS_PACKAGER)+"\"")
endScript

string function LookupBXKeyNames(string sBXKeyName)
var
	int iFirst,
	int iLast,
	int iMiddle,
	int iCompare
let iFirst = 1
let iLast = cicBXKeyNames
While iLast >= iFirst
	let iMiddle = (iFirst+iLast)/2
	let iCompare = StringCompare(sBXKeyName,StringSegment(cscBxKeyDotPatternList,cscBXKeyListSeparator,iMiddle),0)
	if iCompare == 0 then
		return StringSegment(cscBXKeyNameList,cscBXKeyListSeparator,iMiddle)
	ElIf iCompare > 0 then
		let iFirst = iMiddle+1
	Else
		let iLast = iMiddle-1
	EndIf
EndWhile
return cscNull
EndFunction

string function StripBXKeyNamePrefix(string sBXKeyName)
var
	int iLength,
	string sBXK
let gbBXKeyIsAlpha = false
let iLength = StringLength(cscBXKeyNameBrailleDotPrefix)
;First, obliterate Focus key name  Prefix, turn into BX key names.
;let sBXKeyName = (StringReplaceSubstrings (sBXKeyName, cscFocusDotMulti, cscBXKeyNameBrailleDotPrefix))
;let sBXKeyName = (StringReplaceSubstrings (sBXKeyName, cscFocusDot1, cscBXKeyNameBrailleDotPrefix))
if StringCompare(SubString(sBXKeyName,1,iLength),cscBXKeyNameBrailleDotPrefix,0) == 0 then
	let sBXK = stringChopLeft(sBXKeyName, iLength)
else
	let iLength = StringLength(cscBXKeyNameBraillePrefix)
	if StringCompare(SubString(sBXKeyName,1,iLength),cscBXKeyNameBraillePrefix,0) == 0 then
		let sBXK = stringChopLeft(sBXKeyName, iLength)
		if StringLength(sBXK) == 1 then
			let gbBXKeyIsAlpha = true
		EndIf
	EndIf
EndIf
return sBXK
EndFunction

int Function DoBXModifiedKey (string sBXKeyName)
var
	int i,
	string sBXKey,
	int IsSODActive
;Focus keys are sent as letters,
;when passed in Typing Keys Mode, so don't strip or process as Braille keys:
;If (!BrailleGetTypeKeysMode ()) Then
	let sBXKeyName = StripBXKeyNamePrefix(sBXKeyName)
;EndIf
if gbBXKeyIsAlpha then
	;Do we need to translate the key name into the name of a function key:
	if gbBXFunctionKey then
		let i = StringContains(cscBXFunctionKeys,sBXKeyName)
		if !i then
			return 0
		else
			let sBXKeyName = StringSegment(cscBXFunctionKeyNames,cscBXKeyListSeparator,i)
		EndIf
	EndIf
	let gsBXSimulateKey = gsBXSimulateKey+sBXKeyName
	If InHomeRowMode() then
		Let gsBXSimulateKey = (cscHomeRowPrefix+
		cscKeyNameComponentSeparator+gsBXSimulateKey)
	EndIf
	if !gbKeyboardHelp then
		return SimulateKey(gsBXSimulateKey)
	else
		if IsScriptKey(gsBXSimulateKey) then
			SetLastScriptKey(gsBXSimulateKey)
			KeyboardHelpHook(GetScriptAssignedTo(gsBXSimulateKey),cscNull)
		else
			isSODActive = (IsSpeechOff() && getJCFOption(OPT_LESS_SPEECH) == 0)
			if (isSODActive) JAWSSpeechOnDemandOn() endIf
			Say(gsBXSimulateKey,ot_line)
			if (isSODActive) JAWSSpeechOnDemandOff() endIf
		EndIf
	EndIf
else
	if gbBXFunctionKey then
		return 0
	EndIf
	;look it up and match for a key name:
	let sBXKey = LookupBXKeyNames(sBXKeyName)
	if sBXKey then
		let gsBXSimulateKey = gsBXSimulateKey+sBXKey
		if !gbKeyboardHelp then
			return SimulateKey(gsBXSimulateKey)
		else
			if IsScriptKey(gsBXSimulateKey) then
				SetLastScriptKey(gsBXSimulateKey)
				KeyboardHelpHook(GetScriptAssignedTo(gsBXSimulateKey),cscNull)
			else
				isSODActive = (IsSpeechOff() && getJCFOption(OPT_LESS_SPEECH) == 0)
				if (isSODActive) JAWSSpeechOnDemandOn() endIf
				Say(gsBXSimulateKey,ot_line)
				if (isSODActive) JAWSSpeechOnDemandOff() endIf
			EndIf
		EndIf
	EndIf
EndIf
return 0
EndFunction

script BXBuildModifyer()
var
	string sScriptKey,
	string sControl,
	string sAlt,
	string sShift,
	string sWindows,
	string sJAWSKey
Let sScriptKey = GetCurrentScriptKeyName ()
let sScriptKey = StripBXKeyNamePrefix(sScriptKey)
let sScriptKey = StringChopRight(sScriptKey,StringLength(cscBXKeyNameDot8ChordSuffix))
if !sScriptKey then
	return
EndIf
if StringContains(sScriptKey,cscBXControlDot) then
	;let sControl = cscControlModifyer+cscKeyNameComponentSeparator
	Let gsBXSimulateKey = cscControlModifyer+cscKeyNameComponentSeparator
EndIf
if StringContains(sScriptKey,cscBXAltDot) then
	;let sAlt = cscAltModifyer+cscKeyNameComponentSeparator
	Let gsBXSimulateKey = gsBXSimulateKey+cscAltModifyer+cscKeyNameComponentSeparator
EndIf
if StringContains(sScriptKey,cscBXShiftDot) then
	;let sShift = cscShiftModifyer+cscKeyNameComponentSeparator
	Let gsBXSimulateKey = gsBXSimulateKey+cscShiftModifyer+cscKeyNameComponentSeparator
EndIf
if StringContains(sScriptKey,cscBXWindowsDot) then
	;let sWindows = cscWindowsModifyer+cscKeyNameComponentSeparator
	Let gsBXSimulateKey = gsBXSimulateKey+cscWindowsModifyer+cscKeyNameComponentSeparator
EndIf
if StringContains(sScriptKey,cscBXJAWSKeyDot) then
	Let gsBXSimulateKey = gsBXSimulateKey+cscJAWSKeyModifyer+cscKeyNameComponentSeparator
else ;allow either JAWSKey or Insert as modifyers, but not both:
	if StringContains(sScriptKey,cscBXInsertDot) then
		let gsBXSimulateKey = gsBXSimulateKey+cscInsertModifyer+cscKeyNameComponentSeparator
	EndIf
EndIf
;let gsBXSimulateKey = sControl+sAlt+sShift+sWindows+sJAWSKey
TrapKeys(true)
EndScript

script BXBuildFKeyModifyer()
let gbBXFunctionKey = true
PerformScript BXBuildModifyer()
EndScript

Script SendAltKey()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if !UseUnifiedKeyboardProcessing() Then
	TypeKey(cksAlt)
EndIf
EndScript

script SendApplicationKey()
TypeKey(cksShiftF10)
EndScript

script ToggleCapsLock()
var
	int iUpDown,
	int iToggle
GetKeyState ("Capslock", iUpDown, iToggle)
TypeKey(cksCapsLock)
;instead of dealing with timing issues which may arise by getting the state after the toggle,
;we get the state before the toggle and announce the opposite.
if iToggle then
	SayMessage(OT_status,mscCapsLockOff_L,cmsg_off)
else
	SayMessage(OT_status,mscCapsLockOn_L,cmsg_on)
EndIf
EndScript

script PausePACMateRemote()
	; This function purposely says nothing.  If the user is not in a PACMate
	; remote session, this function should not be bound, but if it is, the keystroke
	; will do nothing.  If it is in a PACMate session and is successfully paused,
	; the PACMate will receive a PausePACMateRemote event and will speak appropriate
	; text there.
	PausePACMateRemote()
EndScript

script showEntireListView()
var
	handle hWnd,
	string sText
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
let hWnd = GetCurrentWindow()
if !IsTrueListView(hWnd) then
	SayMessage(OT_ERROR,cmsgNotInAListview_L,cmsgNotInAListview_S)
	return
EndIf
let sText = GetListViewText(hWnd)
if !sText then
	SayMessage(ot_error,cmsgNoTextInListview_L,cmsgNoTextInListview_S)
	return
EndIf
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
UserBufferAddText(sText)
UserBufferActivate()
JAWSTopOfFile()
SayLine()
EndScript

string function GetListViewText(handle hWnd, optional int iColFlags, int bSkipEmptyListItems)
var
	int iLVCount,
	int iLVCols,
	int i,
	int j,
	string sListItem,
	string sBuffer
let iLVCount = lvGetItemCount(hWnd)
if !iLVCount then
	return cscNull
EndIf
let iLVCols = lvGetNumOfColumns(hWnd)
if !iColFlags then
	;default is all columns
	let iColFlags = 0xffffffff
EndIf
let i = 1
while i <= iLVCount
	let j = 1
	let sListItem = cscNull
	while j <= iLVCols
		if 1<<(j-1) & iColFlags then
			let sListItem = sListItem+lvGetItemText(hWnd,i,j)+cscSpace
		EndIf
		let j = j+1
	EndWhile
	let sListItem = StringTrimTrailingBlanks(sListItem)
	if !(bSkipEmptyListItems && !sListItem) then
		let sBuffer = sBuffer+sListItem+"\r\n"
	EndIf
	let i = i+1
EndWhile
if sBuffer then
	let sBuffer = StringChopRight(sBuffer,2)
EndIf
return sBuffer
EndFunction

script StopSpeech()
	StopSpeech()
EndScript

int function IsDescendedFromWindow(handle hAncestor, handle hDescendant)
var
	handle hTemp
let hTemp = hDescendant
while hTemp && hTemp != hAncestor
	let hTemp = GetParent(hTemp)
EndWhile
return hTemp == hAncestor
EndFunction

Script ExitFormsMode()
ExitFormsModeHelper()
EndScript

void function CrossedListBoundaryEvent()
;called from internal code when using a quick nav key to move by list item takes you out of the current list in order to find the next list item
beep()
sayMessage(OT_SMART_HELP, cmsgCrossingListBoundary_L, cmsgCrossingListBoundary_S)
endFunction

void Function ZoomSoftwareSpeakMessagesOnly (string appName)
if StringContains (zRepeat, scChatMessageIndicator) then ; we want it if the user has selected chat only.
	if StringIsBlank (zNotificationOutput) then
		let zNotificationOutput = zRepeat
	else
		let zNotificationOutput = zNotificationOutput+"|"+zRepeat
	endIf
endIf
if ZAlert== 1 then
	var collection notificationRuleActions = ProcessNotification(zRepeat, appName)
	SayNotification(notificationRuleActions, ot_message)
	BrailleMessage (zRepeat)
endIf
EndFunction

int function ProcessAlertAsZoomAlert (handle window, string text, string appName)
if getWindowClass (window) != ZoomNotificationWindowClass then
	return FALSE
endIf
var
	string sMsgLong,
	string sMsgShort;
Let sMsgLong = Text
; Process the alerts and chats.
let zRepeat = Text
if zChat == 1 then
	ZoomSoftwareSpeakMessagesOnly (appName)
	return TRUE
endIf
if StringIsBlank (zNotificationOutput) then
	let zNotificationOutput = zRepeat
else
	let zNotificationOutput = zNotificationOutput+"|"+zRepeat
endIf
if ZAlert== 1 then
	var collection notificationRuleActions = ProcessNotification(zRepeat, appName)
	SayNotification (notificationRuleActions, ot_message)
	brailleMessage (zRepeat)
	; We don't want to save chat messages, or alerts excluded from history by the user
	if !notificationRuleActions.ExcludeFromNotificationHistory && !StringStartsWith(zRepeat, scChatMessageIndicator) then
		StoreSpokenNotificationForRepeat (zRepeat, appName) ; for new insert+Space&N keystroke.
	endIf
endIf
return TRUE
endFunction

void function InterruptSpeechIfAppropriateForMSAAAlertEvent()
;If multiple MSAA alerts are received in rapid succession, we want to allow each of them to speak,
;otherwise we will interrupt the speech.
var int currentAlertTime = GetTickCount()
if currentAlertTime-LastMSAAAlertTime > MSAAAlertTimerThreshold
	StopSpeech()
endIf
LastMSAAAlertTime = currentAlertTime
EndFunction

void function MSAAAlertEvent(handle hwnd, int nTime, string sText, int nAlertLevel, string appName)
if ProcessAlertAsZoomAlert (hwnd, sText, appName) then
; Zoom Alert settings from Zoom Scripts now understood globally.
	return
endIf
InterruptSpeechIfAppropriateForMSAAAlertEvent()
var collection notificationRuleActions = ProcessNotification(sText, appName)
; We want to avoid endless repitions of the same alerts
; So we check if we haven't said the same thing within the last 500 ticks
if !IsRepeatNotification(sText)
	SayNotification(notificationRuleActions, OT_HELP)
endIf
;Because this event gets called when WindowCreatedEvent may not,
; for new versions of Skype:
CheckForSkypeAlerts (hwnd, sText)
if !notificationRuleActions.ExcludeFromNotificationHistory then
	StoreSpokenNotificationForRepeat (sText, appName) ; for new insert+Space&N keystroke.
endIf
endFunction

script AnnounceLastAlert()
var
	string sText,
	int nAlertLevel
if (!GetLastMSAAAlertInfo(sText,nAlertLevel)) then
	SayMessage(OT_ERROR,cmsgNoLastAlert_L,cmsgNoLastAlert_S)
	return
endIf
BeginFlashMessage()
SayMessage(OT_JAWS_MESSAGE,cmsgAlert)
sayMessage(OT_SCREEN_MESSAGE, sText)
EndFlashMessage()
endScript

void function SayTVFocusItemExpandState(handle hWnd)
var
	int iState
if GetWindowSubtypeCode(hWnd) != wt_TreeView then
	return
EndIf
let iState = tvGetFocusItemExpandState(hWnd)
if iState == -1 then
	;item has no children, so it has no expand state
	return
ElIf iState then
	Say(cmsgControlStateOpened,OT_ITEM_STATE)
else
	Say(cmsgControlStateClosed,OT_ITEM_STATE)
EndIf
EndFunction

void function DocumentUpdated(int nLineNumberOfChange, int bUserInvoked)
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
;Note don't want to toggle forms mode if typing in an edit field!
if bUserInvoked==FALSE then
	var int iSubtype = GetObjectSubtypeCode()
	if !IsFormsModeActive()
	&& iSubtype == wt_Edit
	&& iSubtype == wt_multiline_edit then
		return
	EndIf
endIf
if ShouldCheckForCustomPageSummary()
&& GetJCFOption(OPT_CUSTOM_PAGE_SUMMARY) then
	CustomPageSummaryReported()
EndIf

if IsFormsModeActive ()
|| !bUserInvoked
|| nLineNumberOfChange == 1
|| !GetJCFOption (OPT_ALLOW_USER_INVOKED_LOCATION_UPDATE) then
	return
endif

gotoLineNumber(nLineNumberOfChange)
var string currentLine = GetLine ()
if priorTopLineOfNewContent != currentLine
	sayline()
	priorTopLineOfNewContent = currentLine
endif
endFunction

script RoutePCToVirtual()
PCCursor()
SayMessage(OT_JAWS_MESSAGE, CMSGRoutePCToVirtual_L, CMSGRoutePCToVirtual_S)
RoutePCToVirtual()
endScript

Script DoNativeKey()
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

string function GetOwningAppName(handle hWnd)
var
	string sOwner
let sOwner = GetWindowOwner(hWnd)
if sOwner then
	let sOwner = StringSegment(sOwner,cScDoubleBackSlash,StringSegmentCount(sOwner,cScDoubleBackSlash))
EndIf
return sOwner
EndFunction

void function PageChangedEvent(handle hWnd, string PageName )
;fires when switching to a new page tab in IE.
EndFunction

Script FSReaderFastForward ()
TypeKey (cksFSReaderFastForward )
EndScript

Script FSReaderRewind ()
TypeKey (cksFSReaderRewind )
EndScript

Script FSReaderPlay ()
TypeKey (cksFSReaderPlay )
EndScript

script JAWSMemDmp()
;This script exits JAWS and outputs a memory dump.
;Any code in the body of the script is ignored.
EndScript

Script SwitchInputLanguageAndKeyboardLayout ()
var
	handle hWnd
TypeCurrentScriptKey ()
SayCurrentScriptKeyLabel ()
Let gbKeyboardLayoutChange=TRUE
ScheduleFunction("KillgbKeyboardLayoutChange",DelayWhileKeyboardInputSwitching)
EndScript

int function IsMAGicRunning()
return 0 != (GetRunningFSProducts() & product_MAGic)
EndFunction

int function IsZoomTextRunning()
return 0 != (GetRunningFSProducts() & product_ZoomText)
EndFunction

void function KeyboardLanguageChangedEvent(string sLayoutName, int nLangId, string sLangAbbrev)
var
	string sMsg
if GetJCFOption(OPT_DETECT_KEYBOARD_INPUT_LANGUAGE)
	if (sLangAbbrev!=cscNull) then
		;need to use sAbbrev in call to SetTypingEchoLanguage
		SetTypingEchoLanguage(sLangAbbrev)
	endIf
EndIf
if UseUnifiedKeyboardProcessing() Then
	PerformScript SwitchInputLanguage()
EndIf
If ! gbKeyboardLayoutChange then
	Return
EndIf
ScheduleFunction("KillgbKeyboardLayoutChange", DelayWhileKeyboardInputSwitching)
if sLayoutName != cscNull && ActiveLayoutName != cscNull
&& (ActiveLangId != nLangId || ActiveLayoutName != sLayoutName)
	if UseUnifiedKeyboardProcessing() && GetDefaultJCFOption (OPT_TYPING_INTERRUPT)
		; Legacy keyboard has keyboard switching as JAWS script and executing script interrupts speech.
		; Unified doesn't have a script for this and just passes it to the system so we'll need to StopSpeech manually.
		StopSpeech()
	Endif
	let sMsg = FormatString (cKeyboardLayout_L, sLayoutName)
	;Cause OT_STATUS message to be short where it applies:
	SayFormattedMessage(OT_STATUS, sMsg, sLayoutName)
endIf
ActiveLangId = nLangId
ActiveLayoutName = sLayoutName
endFunction

int function lvMoveByLineUnit(int LineMoveUnit, optional int bMayWrap)
var
	handle hWnd,
	int lvCount,
	int lvCurrent
let hWnd = GetFocus()
if LineMoveUnit == lvLineMoveUnitFirst then
	return SetCurrentItem(hWnd,1)
EndIf
let lvCount = lvGetItemCount(hWnd)
if LineMoveUnit == lvLineMoveUnitLast then
	return SetCurrentItem(hWnd,lvCount)
EndIf
let lvCurrent = lvGetFocusItem(hWnd)
if LineMoveUnit == lvLineMoveUnitNext then
	if lvCurrent < lvCount then
		return SetCurrentItem(hWnd,lvCurrent+1)
	ElIf lvCurrent == lvCount
	&& bMayWrap then
		return SetCurrentItem(hWnd,1)
	else
		return 0
	EndIf
ElIf LineMoveUnit == lvLineMoveUnitPrior then
	if lvCurrent > 1 then
		return SetCurrentItem(hWnd,lvCurrent-1)
	ElIf lvCurrent == 1
	&& bMayWrap then
		return SetCurrentItem(hWnd,lvCount)
	else
		return 0
	EndIf
else
	;requested move unit was invalid
	return 0
endIf
EndFunction

void function SelectionContextChangedEvent(int nSelectionContextFlags, int nPrevSelectionContextFlags, int nData1, int nData2,
string sDesc1, string sDesc2, string sDesc3, string sDesc4, string sDesc5)
; this event function is triggered when any of the enabled selection context data flags changes as one navigates in
;supported applications.
;where extra contextual information is required to report the change in context, relevant flags and strings are filled in
;with data.
;For example, navigating into a formfield, nData1 will be the type(see WT_CONSTANTS), nData2 will be the state,
;sDesc1 the prompt, sDesc2 the value, sDesc3 the positional information and sDesc4 the extra help information if available.
;For comments, sDesc1 is the author's name, sDesc2 the initials, sDesc3 the text of the actual comment.
;For footnotes or endnotes, sDesc1 is the reference id and sDesc2 the text of the note.
;For bookmarks and smart tags, sDesc1 is the name of the item.
;For revisions, nData1 is the type of revision, sDesc1 the author, sDesc2 the initials and sDesc3 the text.
;For shapes or objects, nData1 is a type specifier, nData2 a builtin shape type, sDesc1 the name of the object, sDesc2 the text, and sDesc3 the dimentions.
; The units of measure used for the dimentions are in the current desired units of measure as defined by the smmSetDesiredUnitsOfMeasure function.
;For selCtxPageSectionColumnBreaks, nData1=column number, nData2=number of text columns
;sDesc1=page n, sDesc2=sectiony , sDesc3=z text columns (text column count)
;sDesc4=column j (where j is the number of the text column)
; For other contextual information such as spelling and grammar, the relevant bit of the context flags will be set in the
;new and cleared in the old to indicate moving into an error, or vice versa when exiting.
;Table info should be gathered from the table specific events.
;See hjconsnt.jsh for the selCtx constant bit values.
endFunction

void function TabStopEvent(string sNewPos)
;this function gets called in supported apps when the tab key causes the position of the caret to change (ie to move to the next tab stop).
;It is to be used to automatically announce the new caret position.
;Currently this is only enabled in MSWord.
SayMessage(OT_CURSOR, sNewPos)
EndFunction

void Function KillgbKeyboardLayoutChange ()
Let gbKeyboardLayoutChange = FALSE
EndFunction

Function UseUnifiedKeyboardProcessing ()
	if getJCFOption (OPT_USE_LEGACY_KEYBOARD) != 0 Then
		return false
	EndIf
	return true
EndFunction

Script SwitchInputLanguage(int bAltKey);
if !UseUnifiedKeyboardProcessing() Then
	;Updates global bool for InputLanguageChanged:
	;Force key through if using that for language change:
	;Alt key doesn't go through, whereas control key does.
	If bAltKey then
		TypeCurrentScriptKey ()
	EndIf
EndIf
Let gbKeyboardLayoutChange=TRUE
ScheduleFunction("KillgbKeyboardLayoutChange",DelayWhileKeyboardInputSwitching)
EndScript

void function FrameLoadedEvent(handle hDoc, string sFrameName, int nFrameIndex)
;This function fires whenever an HTML frame updates,
;and is currently implemented only in Internet Explorer scripts.
endFunction

int function HasVirtualEnhancedClipboard()
return GetWindowClass(GetFocus()) == cwcIEServer
EndFunction

int function xx_InHJDialog()
; Override of built-in function to make the JAWS Startup Wizard an "HJ Dialog" [DGL]
; This is aimed at making speech/Braille handling identical across all apps instead of depending on app-specific script code.
var
	int result
let result = InHJDialog()
if result then
	return result
endIf
if !DialogActive() then
	return False
endIf
if stringCompare(getWindowName(getTopLevelWindow(getFocus())), cWnJAWSStartup, False) != 0 then
	return False
endIf
return True
/* Replace the above line with the following block if the window name is not to be considered sufficient.
var
	handle hwnd
let hwnd = getFocus()
; JFW.ENU (or other language module) owns some but not all controls in this dialog:
; Some are owned by ComCtl32.dll, and the top-level window is owned by the currently focused app.
if getOwningAppName(hwnd) == "jfw." then
	return True
endIf
; The first child, as of JAWS 9.0.354 or so at least, is a #32770 dialog page owned by JFW.
; I don't want a FindWindow call here for performance reasons; keep this up to date with respect to the structure of the Startup Wizard dialog. [DGL, 2007-10-05]
let hwnd = getFirstChild(getTopLevelWindow(hwnd))
if getOwningAppName(hwnd) == "jfw." then
	return True
endIf
return False
*/
endFunction

script SpeakBrailleStudyCharacterInfo()
if IsBSMCapableBrlDisplay() then
	SALModeButton(GetLastBrailleRoutingKey (),sal_SayCharacter)
EndIf
EndScript

script SpeakBrailleStudyWordInfo(int index)
if IsBSMCapableBrlDisplay()
&& index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
elif IsBSMCapableBrlDisplay()
 SALModeButton (GetLastBrailleRoutingKey (), sal_SpellWord)
EndIf
EndScript

int function IsToolbarWindow(handle hWnd)
return GetWindowClass(hWnd) == cWc_Toolbar
	|| GetWindowSubtypeCode(hWnd) == wt_toolbar
	|| GetObjectSubtypeCode() == wt_Toolbar
EndFunction

string function GetSingleBitControlAttributeString(int attribute)
var
	int i,
	int count
let count = StringSegmentCount(csList_SingleBitControlAttributes,cscListSeparator)
let i = 0
while i < count
&& 1<<i != attribute
	let i = i+1
EndWhile
if i == count then
	return cscNull
EndIf
return StringSegment(csList_SingleBitControlAttributes,cscListSeparator,i+1)
EndFunction

string function GetToolBarButtonList(handle hWnd)
var
	string sObjList,
	int count,
	int i,
	string sName,
	int iType,
	int iState,
	string sFormattedItem,
	string sToolbarList
if !IsToolbarWindow(hwnd) then
	return cscNull
EndIf
let sObjList = GetListOfObjects(hWnd)
If StringLength(sObjList) <= 2 Then
	return cscNull
EndIf
let count = StringSegmentCount(sObjList,LIST_ITEM_SEPARATOR)
let i = 1
while i <= count
	let sName = StringSegment(sObjList ,LIST_ITEM_SEPARATOR,i)
	GetObjectInfoByName(hWnd,sName,1,iType,iState)
	;MSAA may not retrieve a state, so try control attributes:
	if !iState then
		let iState = tbGetItemState(hWnd,i)
	EndIf
	;Disabled and Grayed may acocmpany other attributes,
	;so test for them separately:
	if iState & CTRL_DISABLED then
		let sFormattedItem = FormatString(cmsgToolBarItem,sName,GetSingleBitControlAttributeString(ctrl_disabled))
	ElIf iState & CTRL_GRAYED then
		let sFormattedItem = FormatString(cmsgToolBarItem,sName,GetSingleBitControlAttributeString(ctrl_grayed))
	ElIf !iState then
		let sFormattedItem = sName
	else
		let sFormattedItem = FormatString(cmsgToolBarItem,sName,GetSingleBitControlAttributeString(iState))
	EndIf
	let sToolbarList = sToolbarList+sFormattedItem+cscListSeparator
	let i = i+1
EndWhile
let sToolbarList = StringChopRight(sToolbarList,1)
return sToolbarList
EndFunction

void function ClickToolbarItemByIndex(handle hWnd, int index)
var
	int iLeft,
	int iRight,
	int iTop,
	int iBottom
tbGetItemRect(hwnd,index,iLeft,iRight,iTop,iBottom)
if !iLeft then
	return
EndIf
SaveCursor()
InvisibleCursor()
MoveTo((iLeft+iRight)/2,(iTop+iBottom)/2)
RoutePCToInvisible()
RestoreCursor()
EndFunction

string function MuteSynthesizerToggle(int iRetCurVal)
;This function is now depricated.
;See script SpeechToggle for how this is now managed.
if not iRetCurVal then
; update it
	if (IsSpeechOff ()) then
		SpeechOn(true)
		if gbUsingRemotePACMate && not SpeechInUse () then
			;emergency: failure to return speech
			setSynth ("eloq")
		endIf
	else
		SpeechOff(true)
	endIf
endIf
if (IsSpeechOff ()) then
	return cmsg203_L ;mute on
else
	return cmsg204_L ;mute off
endIf
EndFunction

Script WheelsTracking()
WheelsTracking()
EndScript

Script NavRockersTracking()
WheelsTracking()
EndScript

script OnMouseOver()
Performscript OnMouseOver()
EndScript

int function IsSayAllOnDocumentLoadSupported()
;Return true in apps where DocumentLoadedEvent fires
;and you want to add the option to toggle automatic SayAll on document load
;to the virtual branch of the Adjust JAWS Options tree.
return false
EndFunction

void function LineSpacingChangedEvent(int nLineSpacing, int nLineSpacingRule)
;Currently this function is only called in MSWord when the line spacing changes
;It is fired as part of the SelectionContext event mechanism
;nLineSpacing is in tenths of a point thus a value of 120 is 12 points, 125 12.5 points etc.
;typically 12 points is single, 24 double, 180 1.5, etc.
; other values are possible depending on the line spacing rule,
;eg a value of 36 points would be returned if the rule was multiple and the value 3.
;with a rule of exact and a value of 10 points, the value would be 10.
;divide by 10 to get the points, subtract this from original to get decimal points since script language doesn't have
;floats
;nLinespacingRule is a value specifying the line spacing rule, taken from the MSWord object model.
;    wdLineSpaceSingle = 0,
;    wdLineSpace1pt5 = 1,
;    wdLineSpaceDouble = 2,
;    wdLineSpaceAtLeast = 3,
;    wdLineSpaceExactly = 4,
;    wdLineSpaceMultiple = 5
;saystring("line spacing is now") sayinteger(nLineSpacing)
endFunction

void function LineSpacingDescChangedEvent(string lineSpacingDescription)
; This is called by any UIA enabled app supporting the UIA_LineSpacingAttributeId attribute if the selCtxLineSpacingChange selection context flag is set.
; This is mutually exclusive to the event above.
;It is fired as part of the SelectionContext event mechanism
var int selectionContextFlagsFromFile = getSelectionContextFlags ()
if ! (selectionContextFlagsFromFile & selCtxLineSpacingChange) then
; When line spacing isn't on as a selection context flag, then by default, we eliminate.
; Otherwise, Word will read the line spacing changes during an alt tab.
	return
endIf
var
string template
let template=FormatString(cmsgLineSpacing, lineSpacingDescription)

SayUsingVoice(vctx_message, template, OT_JAWS_MESSAGE)
endFunction

string function cStrBrailleList()
return cStrBrailleList()
EndFunction

string function cstrBrailleMarkingList()
return cstrBrailleMarkingList()
EndFunction

string function cStrDefaultHTMLList()
return cStrDefaultHTMLList()
EndFunction

string function cStrDefaultList()
return cStrDefaultList()
EndFunction

string function cStrTableBrailleList()
return cStrTableBrailleList()
EndFunction

void function EnsureNoUserBufferActive(optional int KeepBufferContent)
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
if !KeepBufferContent then
	UserBufferClear()
EndIf
EndFunction

int function GetNavRowCellOffset(int ActualCellNumber)
var
	int nCell
let nCell = BrailleGetStatusCellCount()
if !nCell then
	return ActualCellNumber
else
	return ActualCellNumber-(nCell+1)
EndIf
EndFunction

void function PageSectionColumnChangedEvent(int nPageNumber, int nPrevPageNumber, int nSectionNumber, int nPrevSectionNumber, int nTextColumnNumber, int nPrevTextColumnNumber, int nTextColumnCount, int nPrevTextColumnCount)
;For apps supporting SelectionContext events such as MSWord
/*if (nPageNumber !=nPrevPageNumber) then
	saystring("page") sayinteger(nPageNumber)
endIf
if (nSectionNumber !=nPrevSectionNumber) then
	saystring("section") sayinteger(nSectionNumber)
endIf
if (nTextColumnNumber!=nPrevTextColumnNumber) then
	saystring("text column") sayinteger(nTextColumnNumber)
endIf
if (nTextColumnCount!=nPrevTextColumnCount) then
	saystring("text column count") sayinteger(nTextColumnCount)
endIf*/
endFunction

void function CheckForWinVistaErrorDialog(handle hWnd)
var
	string sOwner
if IsWinVista() then
	if GetWindowClass(hWnd) == cwc_DirectUIhWND then
		let sOwner = GetWindowOwner(hWnd)
		if sOwner then
			let sOwner = StringSegment(sOwner,cScDoubleBackSlash,StringSegmentCount(sOwner,cScDoubleBackSlash))
			if sOwner == cscOwnerApp_WerFault then
				let ghWndDirectUIWerFault = hWnd
				ScheduleFunction("FocusToWerFaultApp",20)
			EndIf
		EndIf
	EndIf
EndIf
EndFunction

void function FocusToWerFaultApp()
var
	handle hWnd
let hWnd = FindWindow(ghWndDirectUIWerFault,cwc290)
if hWnd then
	SetFocus(hWnd)
EndIf
EndFunction

void function MonitorFormsModeComboBox(handle hwndFocus, handle hwndPrevFocus, int nChild)
if gbShouldExitFormsModeOnComboBoxClose then
	if nChild == 0
	&& !isDescendedFromWindow(hWndFocus,hWndPrevFocus) then
		let gbShouldExitFormsModeOnComboBoxClose = false
	EndIf
EndIf
EndFunction

Script SayClipboard()
var
	string clip
let clip = GetClipboardText()
Say (clip,OT_LINE)
;For Braille users:
BrailleMessage (clip)
EndScript

Script RouteVirtualToPc()
PerformScript RouteVirtualToPc()
endScript

int function AllowFormsModeTransition(int bWantToEnter)
;bWantToEnter is TRUE if JAWS wants to enter forms mode, FALSE if it wants to exit forms mode
;put code here to determine if JAWS should allow the transition, ie a test for autocomplete list active, etc
;return TRUE  to allow the transition, FALSE to disallow
var
	handle hAutoSuggest,
	string sScriptName
if !bWantToEnter then
	let hAutoSuggest=FindWindow (0, cwc_AutoSuggestDropdown, "")
	if hAutoSuggest && IsWindowVisible(hAutoSuggest) then
		let sScriptName = GetScriptAssignedTo(GetCurrentScriptKeyName())
		if StringCompare(sScriptName,"PCCursor") != 0
		&& StringCompare(sScriptName,"UpALevel") != 0 then
			return FALSE
		EndIf
	endIf
endIf
return TRUE
endFunction

void function ExitFormsModeDueToNavigation(int unit)
; When the user navigates out of a formfield in Forms mode with FormsMode
; set to auto , this event gets triggered when we detect that the PC cursor
; can't move in the edit field, we exit forms mode  and the virtual cursor
; is moved to the new content.
if unit==Unit_Line_Next
|| unit==Unit_Line_Prior
|| unit ==Unit_Page_Next
|| unit ==Unit_Page_Prior then
	SayLine()
elif unit==Unit_Sentence_Next || unit ==Unit_Sentence_Prior then
	saySentence()
elif unit==Unit_Paragraph_Next || unit==Unit_Paragraph_Prior then
	sayParagraph()
endIf
endFunction

int function IsEmptyEditFormField(optional int bWhiteSpaceIsText)
var
	string sText,
	int iType,
	int left,
	int right,
	int top,
	int bottom
let iType = GetObjectSubtypeCode()
if iType != wt_edit
&& iType != wt_editcombo
&& iType != wt_MultiLine_edit
&& iType != wt_ReadOnlyEdit then
	return false
EndIf
;First try using MSAA because by default, in areas using NavAreaFSDomEdit2,
;getObjectValue only retrieves the current line, and if the cursor is on a
;blank line, the value will come back empty and the user will not be told that
;the edit contains text.
; if 2 is passed to GetObjectValue, the value is retrieved directly from the
;MSAA/UIA cache.
let sText = GetObjectValue(2)
if !sText
	let sText = GetObjectValue()
endIf
if !sText
&& (IsVirtualPCCursor() || IsFormsModeActive()) then
	GetObjectRect(left,right,top,bottom)
	let sText = GetTextInRect(left,top,right,bottom,0,IgnoreColor,IgnoreColor,true)
EndIf
if !sText
	sText = FSUIAGetFocusedElementValueText()
endIf
if !bWhiteSpaceIsText then
	let sText = stringStripAllBlanks(sText)
EndIf
return !StringLength(sText)
	|| StringCompare(sText,"\160") == 0
EndFunction

script SwitchTranslatorRule(int index)
;in case this is attached to a NavRow button on FS display by User.
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
Say(UOGrade2Rules(false),ot_status)
;make sure that translated braille is displayed:
if !GetJcfOption (OPT_BRL_G2TRANSLATION) then
	SetJcfOption (OPT_BRL_G2TRANSLATION,1)
EndIf
EndScript

script F3Script()
SayCurrentScriptKeyLabel()
If IsFormsModeActive()
|| IsVirtualPCCursor() then
	PerformScript JAWSFindNext()
	return
EndIf
TypeCurrentScriptKey()
EndScript

script ShiftF3Script()
SayCurrentScriptKeyLabel()
If IsFormsModeActive()
|| IsVirtualPCCursor() then
	PerformScript JAWSFindPrior()
	return
EndIf
TypeCurrentScriptKey()
EndScript

int function GetIntOptionDefaultSetting(string sSection, string sKeyName)
var
	string sSharedAppFile
let sSharedAppFile = GetSharedSettingsDirectory()+cScDoubleBackSlash+GetActiveConfiguration()+cScPeriod+jcfFileExt
return IniReadIntegerEx(sSection, sKeyName,
		IniReadIntegerEx(sSection, sKeyName, 0, 0, GlobalSharedDefaultJCFFile),
		0, sSharedAppFile)
EndFunction

int function GetIntOptionUserSetting(string sSection, string sKeyName)
var
	string sUserAppFile,
	string sSharedAppFile
let sSharedAppFile = GetSharedSettingsDirectory()+cScDoubleBackSlash+GetActiveConfiguration()+cScPeriod+jcfFileExt
let sUserAppFile = GetUserSettingsDirectory()+cScDoubleBackSlash+GetActiveConfiguration()+cScPeriod+jcfFileExt
return IniReadIntegerEx(sSection, sKeyName,
	IniReadIntegerEx(sSection, sKeyName,
		IniReadIntegerEx(sSection, sKeyName,
			IniReadIntegerEx(sSection, sKeyName, 0, 0, GlobalSharedDefaultJCFFile),
			0, GlobalUserDefaultJCFFile),
		0, sSharedAppFile),
	0, sUserAppFile)
EndFunction

string function GetStringOptionDefaultSetting(string sSection, string sKeyName)
var
	string sSharedAppFile
let sSharedAppFile = GetSharedSettingsDirectory()+cScDoubleBackSlash+GetActiveConfiguration()+cScPeriod+jcfFileExt
return IniReadStringEx(sSection, sKeyName,
		IniReadStringEx(sSection, sKeyName, cscNull, 0, GlobalSharedDefaultJCFFile),
		0, sSharedAppFile)
EndFunction

int function GetIntOptionDefaultJSISetting(string JSIFileName, string sSection, string sKeyName)
var
	string sFoundJSIFile
let sFoundJSIFile = GetSharedSettingsDirectory()+"\\PersonalizedSettings\\"+JSIFileName+".jsi"
if !sFoundJSIFile then
	return 0
EndIf
return IniReadIntegerEx(sSection, sKeyName, 0, 0, sFoundJSIFile)
EndFunction

string function GetStringOptionDefaultJSISetting(string JSIFileName, string sSection, string sKeyName)
var
	string sFoundJSIFile
let sFoundJSIFile = GetSharedSettingsDirectory()+"\\PersonalizedSettings\\"+JSIFileName+".jsi"
if !sFoundJSIFile then
	return cscNull
EndIf
return IniReadStringEx(sSection, sKeyName, cscNull, 0, sFoundJSIFile)
EndFunction

string function GetActiveSynthGlobalSectionName()
var
	string SShortName,
	string SLongName,
	String SDriver
GetActiveSynthInfo(SShortName, SLongName, SDriver)
return FormatString(cmsgSynthJCFGlobalSectionName,sShortName)
EndFunction

int function ShouldNotifyIfContextHelp()
return GetRunningFSProducts() & product_JAWS
	&& getObjectSubtypeCode(SOURCE_CACHED_DATA) != WT_PASSWORDEDIT
	&& getWindowSubtypeCode (getFocus ()) != WT_PASSWORDEDIT
EndFunction

void function NotifyIfContextHelp()
if !ShouldNotifyIfContextHelp() return endIf
If GetObjectHelp() then
	SayUsingVoice(vctx_message, cMsgContextHelp,OT_SMART_HELP)
EndIf
EndFunction

string function GetSoundFileLocation(string SoundFile)
var
	string sLocation
if !SoundFile then
	return cscNull
EndIf
let sLocation = GetUserSettingsDirectory()+cScDoubleBackSlash+SoundsFolder+cScDoubleBackSlash+SoundFile
if FileExists(sLocation) then
	return sLocation
EndIf
let sLocation = GetSharedSettingsDirectory()+cScDoubleBackSlash+SoundsFolder+cScDoubleBackSlash+SoundFile
if FileExists(sLocation) then
	return sLocation
EndIf
return cscNull
EndFunction

void function TandemStart()
let GlobalTandemConnectSound = GetSoundFileLocation(IniReadString(SECTION_TANDEM,hKey_TandemConnectSound,cscNull,file_default_jcf))
let GlobalTandemDisconnectSound = GetSoundFileLocation(IniReadString(SECTION_TANDEM,hKey_TandemDisconnectSound,cscNull,file_default_jcf))
EndFunction

Script StartOrEndTandemSession()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
;because this key/script binding is done internally, KeyboardHelp must be explicitly called.
if gbKeyboardHelp then
	KeyboardHelpHook(StartOrEndTandemSessionScript,cscNull)
	return
EndIf
If TandemIsConnected() then
	TandemDisconnect()
elif IsTandemInstalled() then
	TandemAcceptConnections()
else
	SayUsingVoice(vctx_message,FormatString(cmsgTandemNotInstalled),ot_error)
	BrailleMessage (FormatString(cmsgTandemNotInstalled))
endif
EndScript

Script ToggleTandemMode()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
;because this key/script binding is done internally, KeyboardHelp must be explicitly called.
if gbKeyboardHelp then
	KeyboardHelpHook(ToggleTandemModeScript,cscNull)
	return
EndIf
;Only the controlling computer may toggle the tandem mode.
;Here we must check to see if a tandem controller window exists before the mode may toggle,
;but the mode may toggle unconditionally in the JTController scripts.
if FindWindow(0,cwc_JTController) then
	SetJTControllerMode(JTCONTROLLER_MODE_TOGGLE)
else
	SayUsingVoice(vctx_message,FormatString(cmsgToggleTandemModeUnavailable),ot_error)
EndIf
EndScript

void function TandemConnectionEvent(int nTandemApp, int nConnectionEvent)
var
	int bShouldPlaySound
let bShouldPlaySound = GetDefaultJCFOption(OPT_USE_SOUNDS_TO_INDICATE_TANDEM)
if nConnectionEvent == Tandem_Status_Connected then
	let GlobalTandemMode = Tandem_Mode_Connected
	;Note that the controller will hear the message spoken on the target side when the connection is made,
	;so it is not necessary to speak the message for the controller as well.
	if bShouldPlaySound
	&& GlobalTandemConnectSound then
		PlaySound(GlobalTandemConnectSound)
	EndIf
	if nTandemApp == Tandem_Target then
		SayMessage(ot_status,cmsg_TandemConnected)
		BrailleMessage (cmsg_TandemConnected)
	EndIf
elif nConnectionEvent == Tandem_Status_Disconnected then
	let GlobalTandemMode = Tandem_Mode_NotConnected
	if bShouldPlaySound
	&& GlobalTandemDisconnectSound then
		PlaySound(GlobalTandemDisconnectSound)
	EndIf
	if nTandemApp == Tandem_Controller then
		SayMessage(ot_status,cmsg_TandemDisconnectedFromTarget)
		BrailleMessage (cmsg_TandemDisconnectedFromTarget)
	elif nTandemApp == Tandem_Target then
		SayMessage(ot_status,cmsg_TandemDisconnectedFromController)
		BrailleMessage (cmsg_TandemDisconnectedFromController)
		if gbLockedKeyboard then
			SetKeyboardLock(false)
		EndIf
	EndIf
EndIf
EndFunction

Script PauseTandemVideo()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
;because this key/script binding is done internally, KeyboardHelp must be explicitly called.
if gbKeyboardHelp then
	KeyboardHelpHook(PauseTandemVideoScript,cscNull)
	return
EndIf
;only the PauseTandemVideo script in JTController may toggle the video.
;The default scripts ensure that an error message is spoken everywhere else.
SayUsingVoice(vctx_message,FormatString(cmsgPauseTandemVideoUnavailable),ot_error)
BrailleMessage (FormatString(cmsgPauseTandemVideoUnavailable))
EndScript

void function RemoteControllerModeChangedEvent(int mode)
if mode == ControllerMode_Minimized then
	let GlobalTandemMode = Tandem_Mode_Connection_Suspended
	SayUsingVoice(vctx_message,cmsgTandemSuspended,ot_status)
	BrailleMessage (cmsgTandemSuspended)
elif mode == ControllerMode_FullScreen then
	let GlobalTandemMode = Tandem_Mode_Connected
	SayUsingVoice(vctx_message,cmsgTandemResumed,ot_status)
	BrailleMessage (cmsgTandemResumed)
EndIf
EndFunction

void function ControllerModeChangedEvent(int mode)
var
	int bShouldPlaySound
if FindWindow(0,cwc_JTController) then
	let bShouldPlaySound = GetDefaultJCFOption(OPT_USE_SOUNDS_TO_INDICATE_TANDEM)
	if mode == ControllerMode_FullScreen then
		let GlobalTandemMode = Tandem_Mode_Connected
		;The controller has either just connected
		;or is using Alt+Insert+Tab to switch to the JTController window.
		if bShouldPlaySound
		&& GlobalTandemConnectSound then
			PlaySound(GlobalTandemConnectSound)
		EndIf
	EndIf
	;Note that the JTController window must play the minimized sound from its ControllerModeChangedEvent.
EndIf
EndFunction

script UtilityManageScriptCallStackLogging()
ManageScriptCallStackLogging()
EndScript

script UtilityManageSayLogging()
ManageSayLogging()
EndScript

script UtilityManageSwitchLogging()
ManageSwitchLogging()
EndScript

int function IsJAWSCursorInMenu()
var
	int iType
if !IsJAWSCursor()
|| !GlobalMenuMode then
	return false
EndIf
let iType = GetWindowSubTypeCode (GetCurrentWindow())
If !iType then
	Let iType = GetObjectSubTypeCode ()
EndIf
return iType == WT_MENU
	|| iType == WT_STARTMENU
	|| iType == WT_CONTEXTMENU
	|| iType == WT_MENUBAR
	|| iType == WT_ButtonMenu
EndFunction

script WordList()
var
	string sList,
	int nIndex,
	string sWord,
	int nOccurrenceIndex,
	int iButton
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
EnsureNoUserBufferActive(false)
if inHJDialog()
|| dialogActive()
|| GetMenuMode()>0
|| GetWindowClass(GetFocus())==cwc_NetUIHwnd then
	return
endIf
let sList = GetWordList(LIST_ITEM_SEPARATOR,TRUE)
if sList == cscNULL then
	return
endIf
;Do not sort, the list will be sorted by highest occurrance first and then in alphabetical order.
let nIndex = DlgSelectItemInList(sList, WordListDlgTitle, FALSE, 1,WordListCustomButtons,iButton)
if nIndex==0 then
	return
endIf
let sWord = StringSegment (sList, LIST_ITEM_SEPARATOR, nIndex)
; strip off the occurrence count, if any
let nOccurrenceIndex = stringContains(sWord,cscSpace)
if nOccurrenceIndex then
	let sWord = stringLeft(sWord,nOccurrenceIndex-1)
endIf
let GlobalCurrentWordFromList = sWord
pause()
if iButton == dlgSelectItemInList_ID_OK then
	if FindString (GetFocus(), sWord, s_NEXT, S_RESTRICTED,TRUE) then
		sayLine()
	endIf
elif iButton == dlgSelectItemInList_ID_Custom1 then
	PresentAllOccurrences(sWord, Occurrence_Sentence)
EndIf
endScript

script PresentAllOccurrencesOfWord()
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
EnsureNoUserBufferActive(false)
if !GlobalCurrentWordFromList then
	PerformScript WordList()
else
	;if the user has changed documents, PresentAllOccurrences may not find the desired word in the new document:
	if !PresentAllOccurrences(GlobalCurrentWordFromList,Occurrence_Sentence) then
		PerformScript WordList()
	EndIf
EndIf
EndScript

int function UsesUnderlyingDom()
return StringContains(GetActiveCursorName(),cscFSDomCursorName)
EndFunction

int function IsRibbonControl(handle hWnd)
var
	handle hTemp
let hTemp = hWnd
while hTemp
	if GetWindowClass(hTemp) == cwc_UIRibbonCommandBar then
		return true
	EndIf
	let hTemp = GetParent(hTemp)
endWhile
return false
EndFunction

int function GetNonVirtualRibbonState()
var
	int iState,
	string sTab,
	string sGroup,
	string sDesc
GetRibbonStatus(iState,sTab,sGroup,sDesc)
return iState
endFunction

int function RibbonsActive()
var
	int iState,
	string sTab,
	string sGroup,
	string sDesc
if UserBufferIsActive()
	return Ribbons_Inactive
endIf
GetRibbonStatus(iState,sTab,sGroup,sDesc)
if iState
&& IsVirtualRibbonActive() then
	;when virtual ribbons are active, GetRibbonStatus
	;cannot be used to determine if the cursor is on the lower ribbon:
	if GetObjectSubtypecode() == wt_menuBar then
		return RibbonTabs_Active
	else
		return LowerRibbon_Active
	EndIf
EndIf
return iState
EndFunction

int function InRibbons()
return RibbonsActive() != Ribbons_Inactive
EndFunction
void function SpeakRibbonStatus(int bIncludeInactiveState)
if !bIncludeInactiveState && GlobalRibbonState == Ribbons_Inactive then
	return
EndIf
Say(StringSegment(RibbonMessages,cscListSeparator,GlobalRibbonState+1),ot_control_type)
EndFunction

Script SkypeRepeatLastCallInfo ()
SayLastCallInfo ()
EndScript

string Function getTermForResearchIt ()
var
	collection here
let here = new collection
;Basic demonstration of how collections work within JAWS.
;This is of course a bit simplistic and the uses are far more wide-ranging than here, but at least the basic idea gets conveyed.
;final note on collections in general - there is no arraycopy or collectioncopy so if you pass it around, it's byref / the address to the original.
;You'd need to for / forEach through it and independently make your own copy if that's what you want,
; but could be memory-intensive.
;this is really simplistic collection.
;We never want selected text anywhere if the JAWS or invisible cursor is active:
if ! isJAWSCursor () && ! isInvisibleCursor () then
	let here.selectedText = stringTrimLeadingBlanks (stringTrimTrailingBlanks (getSelectedText ()))
endIf
let here.word = stringTrimTrailingBlanks (getWord ())
let here.window = getFocus ()
let here.class = getWindowClass (here.window)
let here.type = getWindowSubtypeCode (here.window)
if ! here.type  then
	let here.type = getObjectSubtypeCode(SOURCE_CACHED_DATA)
endIf
let here.isMultiline = (here.type == wt_MULTILINE_EDIT
 || getWindowStyleBits (here.window) & ES_MULTILINE
 ;|| stringContains (getActiveCursorName (), cscFSDomCursorName); FSDom can run in single-line edit controls
 || here.class == cwc_Word_Document || here.class == cwc_Word_Document2 || here.class == cwc_WordPerfect_Document
);
let here.AcceptsSelection = isVirtualPcCursor () || (isPcCursor () && here.isMultiline)
if here.AcceptsSelection then
	if here.selectedText then
		return here.selectedText
	else
	return here.word
	endIf
elIf ! here.selectedText && (here.type == WT_EDIT || here.type == WT_READONLYEDIT || stringContains (here.class, "edit")) then
	return here.word
elIf !isPcCursor () then
	return here.word
else
	return cscNull
endIf
;not necessary for a local script call but invaluable if the collection has been passed around.
;The last pointer that drops the collection causes internal garbage collection, aka no scrubbing needed by you
;Obviously since collections / arrays are done byref only dereference when you or whoever's using your collection doesn't need it anymore.
let here = null();variant nothing = dump it
endFunction

Script ResearchIt ()
performScript ResearchItByEnteringTerm ()
endScript

Script ResearchItByEnteringTerm ()
var
	string strTerm
let strTerm = getTermForResearchIt ()
;Use to run term lookup using LRL_Dialog
if inHjDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return;
endIf
RunLookupModuleQueryUsingLRL_Dialog (strTerm)
endScript

script ResearchItDefaultLookup ()
var
	string sQuery
if InHJDialog () then
; Failure to do this will cause all HJ Dialogs to no longer work until you restart JAWS.
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
if isPCCursor () || isVirtualPcCursor () then
	;because there may be selection, but User wants to use the JAWSCursor to query
	;something other than Selection.
	let sQuery = stringTrimLeadingBlanks (stringTrimTrailingBlanks (getSelectedText ()))
endIf
if StringIsBlank (sQuery) then
	let sQuery = getWord ()
endIf
;Optionally, user may use below function and pass module and rule set parameters - params 2 and 3.
;With only the query param filled in, the primary lookup module is used.
if isJAWSCursor () || isInvisibleCursor () then
	PcCursor ()
endIf
RunLookupModuleQuery (sQuery)
endScript

script ResearchItUsingPrimaryLocation ()
performScript ResearchItDefaultLookup ()
endScript

Script UtilityDebugResearchItRuleSet ()
if InHomeRowMode () then
	performScript HomeRowToggle ()
endIf
DebugLookupModuleQueryUsingLRL_Dialog ()
endScript

script UtilityDomainSpecificConfiguration ()
ShowUtilityDomainSpecificConfigurationInfo ()
endScript

int Function ValidateZipCodeData (string byRef strZipCode, int bPromptForever)
var
	int iChoice, ; for messageBog
	int bUpdateZip
let bUpdateZip = StringIsBlank (strZipCode)
if ! bUpdateZip then
	;Validate string as valid zip
	;not sure if Weather supports international zips and / or if strlen is longer than American zip
endIf
if bUpdateZip then
	let GlobalWasHjDialog = FALSE
	if ! inputBox (cwn_ZIPCODE_INPUT_PROMPT, cwn_ZIPCODE_INPUT_TITLE, strZipCode) then
		return 0
	endIf
	if stringIsBlank (strZipCode) then
		return 0
	endIf
	let GlobalWasHjDialog = TRUE
	let strZipCode = stringTrimTrailingBlanks (StringTrimLeadingBlanks (strZipCode))
	let iChoice = ExMessageBox (formatString (cwn_ZIPCODE_UPDATE_LOCATION_PROMPT, strZipCode), cwn_ZIPCODE_UPDATE_LOCATION_TITLE, MB_YESNOCANCEL|MB_DEFBUTTON1 )
	while (bPromptForever &&iChoice != IDYES && iChoice != IDCANCEL)
		let GlobalWasHjDialog = FALSE
		if ! inputBox (cwn_ZIPCODE_INPUT_PROMPT, cwn_ZIPCODE_INPUT_TITLE, strZipCode) then
			return 0
		endIf
		if stringIsBlank (strZipCode) then
			return 0
		endIf
		let GlobalWasHjDialog = TRUE
		let strZipCode = stringTrimTrailingBlanks (StringTrimLeadingBlanks (strZipCode))
		let iChoice = ExMessageBox (formatString (cwn_ZIPCODE_UPDATE_LOCATION_PROMPT, strZipCode), cwn_ZIPCODE_UPDATE_LOCATION_TITLE, MB_YESNOCANCEL|MB_DEFBUTTON1 )
	endWhile
	if iChoice == IDYES then
		iniWriteString (SECTION_LOCATION, HKEY_ZIPCODE, strZipCode, FILE_MY_LOCATION)
	endIf
endIf
let strZipCode = stringTrimTrailingBlanks (StringTrimLeadingBlanks (strZipCode))
return ! StringIsBlank (strZipCode) ;&& StringLength (strZipCode) > 4
endFunction

Script WeatherWidget ()
;A useful example of combining both scripts and Resource Lookup Rule Sets:
var
	string strWeatherResource,
	string strRuleFile,
	string strZipCode
let strZipCode = iniReadString (SECTION_LOCATION, HKEY_ZIPCODE, cscNull, FILE_MY_LOCATION)
if ! ValidateZipCodeData (strZipCode, FALSE) then
	return;
endIf
let strWeatherResource = csfsWeatherRule
RunLookupModuleQuery (strZipCode, strWeatherResource)
endScript

Script WeatherWidgetClearLocationInfo ()
var
	int iChoice
if iniRemoveKey (SECTION_LOCATION, HKEY_ZIPCODE, FILE_MY_LOCATION) then
	let iChoice = ExMessageBox (cwnClearWeatherWidgetDlgStatic, cwnClearWeatherWidgetDlgTitle, MB_YESNOCANCEL|MB_DEFBUTTON1 )
else
	;let iChoice = ExMessageBox (cwnClearWeatherWidgetDlgStatic, cwnClearWeatherWidgetDlgTitle, MB_YESNOCANCEL|MB_DEFBUTTON1 )
	let iChoice = IDYES
endIf
if iChoice == IDYES then
	ValidateZipCodeData (cscNull, TRUE);forced validate.
endIf
endScript

int function IsKeyboardLayoutChanging()
return gbKeyboardLayoutChange == true
EndFunction

int function IsMacToolTipWindow (handle window)
var
	handle hNull,
	handle RealWindow,
	handle FirstChild,
	int FirstChildControlId
let RealWindow = GetRealWindow (window)
if (
	( cWc_dlg32770 == GetWindowClass (RealWindow) )
	&& ( cscNull == GetWindowName (RealWindow) )
	)
then
	let FirstChild = GetFirstChild (RealWindow)
	if ( hNull == GetNextWindow (FirstChild) )
	then
		let FirstChildControlId = GetControlID (FirstChild)
		if ( 7155 == FirstChildControlId )
		then
			return True
		endIf
	endIf
endIf
return False
EndFunction

int function ContractedBrailleInputAllowedNow()
;Called by internal code to give the scripts an opportunity to disallow Contracted Braille Input
;Override to return FALSE for example if in MSWord's quick navigation mode etc.
;Note if internal code already determines that it is not possible to support Contracted Braille Input in this context,
;this function won't be called.
return ContractedBrailleInputAllowedNow() ; from Braille.jss
endFunction

void function ContractedBrailleInputModeChanged(int bEntering)
; This event function is fired when the user either begins to input Contracted Braille or when the current edit has just
;been committed.
;bEntering is TRUE if the edit has just begun, FALSE if the edit was just committed.
endFunction

void function SetKeyboardLock(int LockStatus)
let gbLockedKeyboard = LockStatus
if LockStatus then
	SayMessage(ot_status, cmsgLockedKeyboard_L, cmsgLockedKeyboard_S)
	let gbLockedSavedActiveFollowsBraille = GetJcfOption (OPT_BRL_MOVE_ACTIVE_CURSOR)
	SetJcfOption (OPT_BRL_MOVE_ACTIVE_CURSOR,0)
	AddHook (HK_SCRIPT, "LockedKeyboardHook")
else
	SayMessage(ot_status, cmsgUnlockedKeyboard_L, cmsgUnlockedKeyboard_S)
	SetJcfOption (OPT_BRL_MOVE_ACTIVE_CURSOR,gbLockedSavedActiveFollowsBraille)
	RemoveHook (HK_SCRIPT, "LockedKeyboardHook")
	BrailleRefresh()
EndIf
TrapKeys(LockStatus)
EndFunction

Script LockKeyboard()
SetKeyboardLock(true)
EndScript

void Function LockedKeyboardHook(string ScriptName, string FrameName)
var
	string sKey
;if any keyboard lock notification was scheduled as a result of KeyPressedEvent, then cancel it:
if giScheduleNotifyLockedKeyboard then
	UnScheduleFunction(giScheduleNotifyLockedKeyboard)
	let giScheduleNotifyLockedKeyboard = 0
EndIf
if giScheduledSayLockedKeyboardHelp then
	UnScheduleFunction(giScheduledSayLockedKeyboardHelp)
	let giScheduledSayLockedKeyboardHelp = 0
EndIf
if StringCompare(ScriptName,"LockKeyboard") == 0 then
	SetKeyboardLock(false)
	return false
elif StringCompare(ScriptName,"BrailleRouting") == 0 then
	if BrailleIsMessageBeingShown() then
		brailleClearMessage()
		return true
	EndIf
elif StringContains(lockedKeyboardPassThroughScripts, scriptNameDelimiter+ScriptName+scriptNameDelimiter) then
	return true
elif IsInvisibleCursor()
&& StringContains(lockedKeyboardPassThroughNavScripts, scriptNameDelimiter+ScriptName+scriptNameDelimiter) then
	return true
elif StringContains(LockKeyboardReleaseAndRunScripts, scriptNameDelimiter+ScriptName+scriptNameDelimiter) then
	SetKeyboardLock(false)
	return true
endIf
NotifyLockedKeyboard()
return false
EndFunction

void function SayLockedKeyboardHelp()
let giScheduledSayLockedKeyboardHelp = 0
SayFormattedMessage(ot_help, cmsgLockedKeyboardHelp_L, cmsgLockedKeyboardHelp_S)
EndFunction

void function NotifyLockedKeyboard()
let giScheduleNotifyLockedKeyboard = 0
SayMessage(ot_error, cmsgLockedKeyboard_L, cmsgLockedKeyboard_S)
if giScheduledSayLockedKeyboardHelp then
	UnScheduleFunction(giScheduledSayLockedKeyboardHelp)
EndIf
let giScheduledSayLockedKeyboardHelp = ScheduleFunction("SayLockedKeyboardHelp",7)
EndFunction

int function IsVirtualRibbonActive()
if GetJCFOption(OPT_VIRTUAL_RIBBON_SUPPORT)==0 then
	return false
endIf
if getActiveCursorName()==cscVirtualRibbonPCCursor then
	return true
endIf
return false
endFunction

int function FlagChangedState(int Source, int Target, int Flag, int ByRef ChangedState)
if (Source&Flag) == (Target&Flag) then
	return false
EndIf
let ChangedState = (Target&Flag)>0
return true
EndFunction

string function GetDetailedFontChangesInfo(collection cFont)
var
	int iInfo,
	int iChangedState,
	string sInfo,
	string sDetails
if cFont.flags & IndicateFontName then
	let sInfo = GetCharacterFont()
	if cFont.name != sInfo then
		let sDetails = sInfo+cscSpace
	EndIf
EndIf
if cFont.flags & IndicateFontSize then
	let iInfo = GetCharacterPoints()
	if cFont.points != iInfo
		let sInfo = FormatString(cmsgFontPoints,IntToString(iInfo))
		let sDetails = sDetails+sInfo+cscSpace
	EndIf
EndIf
if cFont.flags & IndicateTextAttributes then
	let iInfo = GetCharacterAttributes()
	if cFont.attrib != iInfo then
		let sInfo = cscNull
		if FlagChangedState(cFont.attrib, iInfo, attrib_bold, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsg139_L)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsg139_L)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_italic, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsg140_L)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsg140_L)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_underline, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsg141_L)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsg141_L)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_strikeout, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsg143_L)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsg143_L)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_lrm_arabic, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsgFont_LRM_Arabic)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsgFont_LRM_Arabic)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_rtl_text, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsgFont_RTL_Text)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsgFont_RTL_Text)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_double_strikeout, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsgFont_Double_Strikeout)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsgFont_Double_Strikeout)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_superscript, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsgFont_Superscript)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsgFont_Superscript)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_subscript, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsgFont_Subscript)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsgFont_Subscript)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_shadow, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsgFont_Shadow)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsgFont_Shadow)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_outline, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsgFont_Outline)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsgFont_Outline)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_extended, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsgFont_Extended)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsgFont_Extended)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_emboss, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsgFont_Emboss)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsgFont_Emboss)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_engrave, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsgFont_Engrave)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsgFont_Engrave)
				 	+cscSpace
			EndIf
		EndIf
		if FlagChangedState(cFont.attrib, iInfo, attrib_smallcaps, iChangedState) then
			if iChangedState == On then
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_On,cmsgFont_Smallcaps)
				 	+cscSpace
			else
				let sInfo = sInfo+
				 	FormatString(cmsgFontAttrib_Off,cmsgFont_Smallcaps)
				 	+cscSpace
			EndIf
		EndIf
		if sInfo then
			let sDetails = sDetails+sInfo
		EndIf
	EndIf
EndIf
if cFont.flags & IndicateColorChanges then
	let iInfo = GetColorText()
	if cFont.color != iInfo then
		let sInfo = GetColorName(iInfo)
		let sDetails = sDetails+sInfo+cscSpace
	EndIf
	let iInfo = GetColorBackground()
	if cFont.background != iInfo then
		let sInfo = GetColorName(iInfo)
		let sDetails = sDetails+sInfo+cscSpace
	EndIf
EndIf
return StringTrimTrailingBlanks(sDetails)
EndFunction

void function IndicateInconsistency(int nType, string sChars, int nOffset, optional collection cPrevFont)
var
	string msgShort,
	string msgLong,
	int nOldPuncLevel
if nType==MismatchedSymbolPairUnopened then
	let msgLong=cmsgMismatchedSymbolPairUnopened_L
	let msgShort=cmsgMismatchedSymbolPairUnopened_S
elif nType==MismatchedSymbolPairUnclosed then
	let msgLong=cmsgMismatchedSymbolPairUnclosed_L
	let msgShort=cmsgMismatchedSymbolPairUnclosed_S
elif nType==StrayPunctuationSymbol then
	let msgLong=cmsgStrayPunctuationSymbol_L
	let msgShort=cmsgStrayPunctuationSymbol_S
elif nType==UnspacedPunctuationSymbol then
	let msgLong=cmsgUnspacedPunctuationSymbol_L
	let msgShort=cmsgUnspacedPunctuationSymbol_S
elif nType==WhitespaceRun then
	let msgLong=cmsgWhitespaceRun_L
	let msgShort=cmsgWhitespaceRun_S
elif nType==FontChange then
	if CollectionItemExists(cPrevFont,"flags") then
		SayFormattedMessageWithVoice(VCTX_MESSAGE, OT_no_disable,
			FormatString(cmsgFontChangeDetails, GetDetailedFontChangesInfo(cPrevFont)))
		SayWord()
		return
	else ;just report it changed, without any details:
		let msgLong=cmsgFontChange_L
		let msgShort=cmsgFontChange_S
	EndIf
elif nType==MissingInitialCapital then
	let msgLong=cmsgMissingInitialCapital_L
	let msgShort=cmsgMissingInitialCapital_S
elif nType==InvertedCaps then
	let msgLong=cmsgInvertedCaps_L
	let msgShort=cmsgInvertedCaps_S
endIf
; Change punctuation level so that symbols are actually spoken.
let nOldPuncLevel=getJCFOption(opt_punctuation)
setJCFOption(opt_punctuation,3)
SayFormattedMessageWithVoice(VCTX_MESSAGE, OT_no_disable, formatString(msgLong, sChars,intToString(nOffset+1)), formatString(msgShort, sChars,intToString(nOffset+1)))
;Restore the punctuation level to what it was before.
setJCFOption(opt_punctuation, nOldPuncLevel)
endFunction

void function IndicateInconsistenciesInRange(int nRange)
var
	int nCount=0,
	int nFlags=0xffff,
	int nPairedSymbolCategories=0xff,
	int nIdx=0,
	int nType=0,
	string sChars,
	int nOffset=0,
	int nOpt=0
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
let nOpt=GetJCFOption(OPT_TEXT_ANALYSER)
if nOpt==TextAnalyserOff then
	return
endIf
let nFlags=GetJCFOption(OPT_TEXT_ANALYSER_TYPE_FLAGS)
let nPairedSymbolCategories=GetJCFOption(OPT_TEXT_ANALYSER_SYMBOL_FLAGS)
let nCount=GetRangeInconsistencyCount(nRange,nFlags,nPairedSymbolCategories)
if nCount==0 then
	return
endIf
if nOpt==TextAnalyserIndicateWithSound then
	PlaySound(GetSoundFileLocation("InconsistencyBuzzer.wav"))
	return
endIf
if nOpt==TextAnalyserSpeakCount then
	SayFormattedMessageWithVoice(VCTX_MESSAGE, OT_no_disable, formatString(cmsgInconsistencyCount, intToString(nCount)))
	return
endIf
;must be TextAnalyserDescribeAllInconsistencies=3,
for nIdx=0 to nCount-1
	if GetRangeInconsistencyByIndex(nRange, nIdx, nFlags, nPairedSymbolCategories, nType, sChars, nOffset) then
		IndicateInconsistency(nType, sChars, nOffset)
	endIf
endFor
endFunction

script IndicateInconsistenciesForLine()
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
indicateInconsistenciesInRange(CheckLine)
endScript

script IndicateInconsistenciesForSentence()
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
indicateInconsistenciesInRange(CheckSentence)
endScript

script IndicateInconsistenciesForParagraph()
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
indicateInconsistenciesInRange(CheckParagraph)
endScript

collection function GetCurrentFontData(int nFlags)
var
	collection cFont
let cFont = new collection
if nFlags & IndicateFontChanges then
	;make sure all font changes are flagged in the collection:
	let cFont.flags = IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges
else
	let cFont.flags = nFlags
EndIf
if nFlags & IndicateFontName then
	let cFont.name = GetCharacterFont()
EndIf
if nFlags & IndicateFontSize then
	let cFont.points = GetCharacterPoints()
EndIf
if nFlags & IndicateTextAttributes then
	let cFont.attrib = GetCharacterAttributes()
EndIf
if nFlags & IndicateColorChanges then
	let cFont.color = GetColorText()
	let cFont.background = GetColorBackground()
EndIf
return cFont
EndFunction

script MoveToNextInconsistency()
var
	int iSavedOption,
	int nFlags=0xffff,
	int nPairedSymbolCategories=0xff,
	int nType=0,
	string sChars,
	int nOffset=0,
	collection cFont
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
;if off, turn it on temporarily.
let iSavedOption=getJCFOption(OPT_TEXT_ANALYSER)
if !iSavedOption then
	setJCFOption(OPT_TEXT_ANALYSER,TextAnalyserDescribeAllInconsistencies)
endIf
let nFlags = GetJCFOption(OPT_TEXT_ANALYSER_TYPE_FLAGS)
let nPairedSymbolCategories=GetJCFOption(OPT_TEXT_ANALYSER_SYMBOL_FLAGS)
if nFlags & IndicateFontChanges
|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges) then
	let cFont = GetCurrentFontData(nFlags)
endIf
;Check inconsistency by paragraph to ensure we properly match paired symbols.
if MoveToRangeInconsistency(CheckParagraph,s_next,nFlags, nPairedSymbolCategories, nType, sChars, nOffset) then
	if nType == FontChange
	&& (nFlags & IndicateFontChanges
	|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges)) then
		IndicateInconsistency(nType, sChars, nOffset, cFont)
	else
		IndicateInconsistency(nType, sChars, nOffset)
	EndIf
else
	SayMessage(OT_ERROR, cmsgNoNextInconsistency_L, cmsgNoNextInconsistency_S)
endIf
if iSavedOption<TextAnalyserDescribeAllInconsistencies then
	setJCFOption(OPT_TEXT_ANALYSER,iSavedOption)
endIf
endScript

script MoveToPriorInconsistency()
var
	int iSavedOption,
	int nFlags=0xffff,
	int nPairedSymbolCategories=0xff,
	int nType=0,
	string sChars,
	int nOffset=0,
	collection cFont
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
;if off, turn it on temporarily.
let iSavedOption=getJCFOption(OPT_TEXT_ANALYSER)
if !iSavedOption then
	setJCFOption(OPT_TEXT_ANALYSER,TextAnalyserDescribeAllInconsistencies)
endIf
let nFlags=GetJCFOption(OPT_TEXT_ANALYSER_TYPE_FLAGS)
let nPairedSymbolCategories=GetJCFOption(OPT_TEXT_ANALYSER_SYMBOL_FLAGS)
if nFlags & IndicateFontChanges
|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges) then
	let cFont = GetCurrentFontData(nFlags)
endIf
;Check inconsistency by paragraph to ensure we properly match paired symbols.
if MoveToRangeInconsistency(CheckParagraph,s_prior, nFlags, nPairedSymbolCategories, nType, sChars, nOffset) then
	if nType == FontChange
	&& (nFlags & IndicateFontChanges
	|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges)) then
		IndicateInconsistency(nType, sChars, nOffset, cFont)
	else
		IndicateInconsistency(nType, sChars, nOffset)
	EndIf
else
	SayMessage(OT_ERROR, cmsgNoPriorInconsistency_L, cmsgNoPriorInconsistency_S)
endIf
if iSavedOption<TextAnalyserDescribeAllInconsistencies then
	setJCFOption(OPT_TEXT_ANALYSER,iSavedOption)
endIf
endScript

script MoveToFirstInconsistency()
var
	int iSavedOption,
	int nFlags=0xffff,
	int nPairedSymbolCategories=0xff,
	int nType=0,
	string sChars,
	int nOffset=0,
	collection cFont
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
;if off, turn it on temporarily.
let iSavedOption=getJCFOption(OPT_TEXT_ANALYSER)
if !iSavedOption then
	setJCFOption(OPT_TEXT_ANALYSER,TextAnalyserDescribeAllInconsistencies)
endIf
let nFlags=GetJCFOption(OPT_TEXT_ANALYSER_TYPE_FLAGS)
let nPairedSymbolCategories=GetJCFOption(OPT_TEXT_ANALYSER_SYMBOL_FLAGS)
if nFlags & IndicateFontChanges
|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges) then
	let cFont = GetCurrentFontData(nFlags)
endIf
;Check inconsistency by paragraph to ensure we properly match paired symbols.
if MoveToRangeInconsistency(CheckParagraph,s_top, nFlags, nPairedSymbolCategories, nType, sChars, nOffset) then
	if nType == FontChange
	&& (nFlags & IndicateFontChanges
	|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges)) then
		IndicateInconsistency(nType, sChars, nOffset, cFont)
	else
		IndicateInconsistency(nType, sChars, nOffset)
	EndIf
else
	SayMessage(OT_ERROR,cmsgNoInconsistency_L, cmsgNoInconsistency_S)
endIf
if iSavedOption<TextAnalyserDescribeAllInconsistencies then
	setJCFOption(OPT_TEXT_ANALYSER,iSavedOption)
endIf
endScript

script MoveToLastInconsistency()
var
	int iSavedOption,
	int nFlags=0xffff,
	int nPairedSymbolCategories=0xff,
	int nType=0,
	string sChars,
	int nOffset=0,
	collection cFont
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
;if off, turn it on temporarily.
let iSavedOption=getJCFOption(OPT_TEXT_ANALYSER)
if !iSavedOption then
	setJCFOption(OPT_TEXT_ANALYSER,TextAnalyserDescribeAllInconsistencies)
endIf
let nFlags=GetJCFOption(OPT_TEXT_ANALYSER_TYPE_FLAGS)
let nPairedSymbolCategories=GetJCFOption(OPT_TEXT_ANALYSER_SYMBOL_FLAGS)
if nFlags & IndicateFontChanges
|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges) then
	let cFont = GetCurrentFontData(nFlags)
endIf
;Check inconsistency by paragraph to ensure we properly match paired symbols.
if MoveToRangeInconsistency(CheckParagraph,s_bottom, nFlags, nPairedSymbolCategories, nType, sChars, nOffset) then
	if nType == FontChange
	&& (nFlags & IndicateFontChanges
	|| nFlags & (IndicateFontName|IndicateFontSize|IndicateTextAttributes|IndicateColorChanges)) then
		IndicateInconsistency(nType, sChars, nOffset, cFont)
	else
		IndicateInconsistency(nType, sChars, nOffset)
	EndIf
else
	SayMessage(OT_ERROR,cmsgNoInconsistency_L, cmsgNoInconsistency_S)
endIf
if iSavedOption<TextAnalyserDescribeAllInconsistencies then
	setJCFOption(OPT_TEXT_ANALYSER,iSavedOption)
endIf
endScript

script AltEnterKey()
if IsTouchCursor() then
; Applications like Outlook don't do this automatically:
	PerformScript ShowUIAElementProperties ()
	return
endIf
SayCurrentScriptKeyLabel ()
AltEnterKey()
endScript

Script ToggleTextAnalyzer()
var
	int iSavedOption,
	string sMsg_l,
	string smsg_s
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
if !IsTextAnalysisValid() then
	sayMessage(ot_error,cmsgTextAnalyzerNotValid_l,cmsgTextAnalyzerNotValid_s)
	return
EndIf
let iSavedOption=GetJCFOption(OPT_TEXT_ANALYSER)
if iSavedOption==TextAnalyserDescribeAllInconsistencies then ;turn it off.
	setJCFOption(OPT_TEXT_ANALYSER,TextAnalyserOff)
	let smsg_l=cmsgTextAnalyzerOff_l
	let smsg_s=cmsgTextAnalyzerOff_s
else ;set to describe all inconsistencies.
	setJCFOption(OPT_TEXT_ANALYSER,TextAnalyserDescribeAllInconsistencies)
	let smsg_l=formatString(cmsgTextAnalyzerOn_l,cmsgTextAnalyzerDescribeAllInconsistencies )
	let smsg_s=formatString(cmsgTextAnalyzerOn_s,cmsgTextAnalyzerDescribeAllInconsistencies)
endIf
sayFormattedMessage(ot_status,smsg_l,smsg_s)
EndScript

;the below functions are used to handle applications that use the edit callback functions to speak cursor movement
void function StyleChangedEvent(string sName)
SayMessage(OT_POSITION,sName)
EndFunction

void function CaretMovedEvent( int movementUnit,optional int source)
if ( ! ShouldProcessSelectionChangedEvent( source ) ) then
	return
EndIf

; typing  text
if ( movementUnit == 0 ) then
	return
endIf

if ( IsMovingByCharacter( movementUnit ) ) then
	SayCharacterFromCaretMovedEvent()
elif ( IsMovingByWord( movementUnit ) ) then
	SayWordFromCaretMovedEvent()
elif ( IsMovingByLine( movementUnit ) && !WasMostRecentScriptTableNav()) then
	; If navigating by line, we always want to hear the line moved to from this event.
; If however table navigation keystrokes  are used (alt+ctrl+up/down), it will
;generate both a cellChangedEvent and a caretMovedEvent.
; Because the above call to IsMovingByLine checks for a movement unit of cell
;to handle the case when arrowing up and down a column, this would cause
;doublespeaking, hence the check for WasMostRecentScriptTableNav above.
	SayLineFromCaretMovedEvent(movementUnit )
elif ( IsMovingBySentence( movementUnit ) ) then
	SaySentenceFromCaretMovedEvent()
elif ( IsMovingByParagraph( movementUnit ) ) then
	SayParagraphFromCaretMovedEvent();
elif ( IsMovingByHomeOrEnd( movementUnit ) ) then
	SayHomeOrEndFromCaretMovedEvent()
elif ( IsMovingByFirstOrLastLine( movementUnit ) )
	SayFirstOrLastLineFromCaretMovedEvent( movementUnit == Unit_Line_First )
elif ( IsMovingByPage( movementUnit ) ) then
	SayPageFromCaretMovedEvent()
endIf
endFunction

void function SayCharacterFromCaretMovedEvent()
let globalSayingCurrentItem = 1
SayCharacter()
	let globalSayingCurrentItem = 0
EndFunction

void function SelectionChangedEvent( string text, int wasTextSelected, optional int source )
var
	string sSelectionStateMsg
if !ShouldProcessSelectionChangedEvent(source) then
	let nSaySelectAfter = false
	return
EndIf
if wasTextSelected then
	let sSelectionStateMsg = cmsg215_l
else
	let sSelectionStateMsg = cmsg214_l
EndIf
If nSaySelectAfter then
	say(text,ot_line,true)
	SayMessage(ot_select,sSelectionStateMsg)
else
	SayMessage(ot_select,sSelectionStateMsg)
	say(text,ot_line,true)
endIf
let nSaySelectAfter = false
EndFunction

int function IsMovingByCharacter( int movementUnit )
if ( movementUnit == Unit_Char_Next
		|| movementUnit == Unit_Char_Prior ) then
	return true
EndIf

return false
EndFunction

int function IsMovingByWord( int movementUnit )
if ( movementUnit == Unit_Word_Next
		|| movementUnit == Unit_Word_Prior ) then
	return true
EndIf

return false
EndFunction

int function IsMovingByLine( int movementUnit )
if ( movementUnit == Unit_Line_Next
|| movementUnit == Unit_Line_Prior
|| movementUnit ==Unit_Cell_Down
|| movementUnit ==Unit_Cell_UP)
return true;
EndIf
return false;
EndFunction

int function IsMovingBySentence( int movementUnit )
if ( movementUnit == Unit_Sentence_Next
		|| movementUnit == Unit_Sentence_Prior ) then
	return true
EndIf

return false
EndFunction

int function IsMovingByParagraph( int movementUnit )
if ( movementUnit == Unit_Paragraph_Next
		|| movementUnit == Unit_Paragraph_Prior ) then
	return true
EndIf

return false
EndFunction

int function IsMovingByHomeOrEnd( int movementUnit )
if ( movementUnit == Unit_Line_Start
		|| movementUnit == Unit_Line_End ) then
	return true;
EndIf

return false
EndFunction

int function IsMovingByFirstOrLastLine( int movementUnit )
if ( movementUnit == Unit_Line_First
		|| movementUnit == Unit_Line_Last ) then
	return true
EndIf

return false
EndFunction

int function IsMovingByPage( int movementUnit )
if ( movementUnit == Unit_Page_Next
		|| movementUnit == Unit_Page_Prior )
	return true;
EndIf

return false;
EndFunction

void function SayWordFromCaretMovedEvent()
; This check for speech on demand also needs to run only if this was the last navigation keystroke pressed.
;var int isSODActive = (! IsKeyWaiting () && IsSpeechOff() && getJCFOption(OPT_LESS_SPEECH) == 0)
;if (isSODActive) JAWSSpeechOnDemandOn() endIf
if IsHookInstalled(HK_SCRIPT, "SpellWordHook") then
	spellWord()
	SayExpandedAcronymOrAbbreviation()
else
	SayWord()
endIf
;if (isSODActive) JAWSSpeechOnDemandOff() endIf
EndFunction

void function SayLineFromCaretMovedEvent(int movementUnit)
SayLine(0,movementUnit)
EndFunction

void function SaySentenceFromCaretMovedEvent()
SaySentence()
EndFunction

void function SayParagraphFromCaretMovedEvent()
SayParagraph()
EndFunction

void function SayHomeOrEndFromCaretMovedEvent()
if getCharacter()=="\n" then
	say(cmsgBlank1,ot_char)
	return
endIf
SayCharacter()
return
EndFunction

void function SayFirstOrLastLineFromCaretMovedEvent( int isFirstLine )
var int iMovementUnit
if isFirstLine then
	SayMessage(ot_JAWS_message, cmsg36_L, cmsg36_S) ;"top of file"
	iMovementUnit = Unit_Line_First
else
	SayMessage(ot_JAWS_message, cmsg37_L, cmsg37_S) ;"bottom of file"
	iMovementUnit = Unit_Line_Last
EndIf
delay(1)
sayLine(0, iMovementUnit)
EndFunction

void function SayPageFromCaretMovedEvent(optional int movementUnit)
delay(1,true)
If ! InTable() then
	SayLine(0, movementUnit)
endIf
EndFunction

void function SayCellFromCaretMovedEvent()
EndFunction

int function ShouldProcessSelectionChangedEvent( optional int source )
if source==INP_BrailleDisplay then
	;prevent speech.
	return false;
endIf

return true;
EndFunction

int function GetEditCellCoordinates(int byRef col, int byRef row)
if !collectionItemsCount (InlineTableCellCoordinates)
|| isVirtualPcCursor ()
|| !SupportsEditCallbacks()
	return false
endIf
col = InlineTableCellCoordinates.col
row = InlineTableCellCoordinates.row
return col && row ; only valid values.
endFunction

int function ShouldExitcellChangedEvent()
;When alt+Tabbing into Word,
;the default CellChangedEvent may fire rather than the Word CellChangedEvent
;because the WordFunc.jsb function may not yet be on the stack.
;If so, just exit this event.
var string sClass = GetWindowClass(GetFocus())
return stringCompare (sClass, cwc_Word_Document) == 0
	|| stringCompare (sClass, cwc_Word_Document2) == 0
EndFunction

void function UpdateTableCellCoordinatesOnCellChangedEvent(int NewCol, int NewRow)
if ! InlineTableCellCoordinates then InlineTableCellCoordinates = new collection endIf
InlineTableCellCoordinates.col = NewCol
InlineTableCellCoordinates.row = NewRow
EndFunction

void function UpdateTableCache(string colHeader, string rowHeader, int NewCol, int NewRow)
UpdateTableCellCoordinatesOnCellChangedEvent(NewCol,NewRow)
;headers are not cached here, however they are cached in Google Docs.
EndFunction

int function WasMostRecentScriptTableNav()
;Testing script name will not give accurate results
;if cursor keys are used in the table layer:
if GlobalActiveLayer == TableLayerActive return true endIf
var string scriptName = GetScriptAssignedTo(GetCurrentScriptKeyName())
return StringEndsWith(scriptName,"Cell")
	|| StringEndsWith(scriptName,"OfRow")
	|| StringEndsWith(scriptName,"OfColumn")
	|| StringEndsWith(scriptName,"InTable")
EndFunction

int function shouldSpeakTableCoordinates()
return gbDefaultVCursorCellCoordinatesAnnouncement
EndFunction

void function SayColumnAndRowChangeOnCellChangedEvent(int NewCol, int NewRow, int PrevCol, int PrevRow)
if !shouldSpeakTableCoordinates()
	if !WasMostRecentScriptTableNav()
		;Using table nav, it is obvious that a new cell was navigated to.
		;But when cursoring, we announce something to indicate that cursoring moved into a new cell.
		Say(cmsgNewCell,ot_position)
	endIf
	return
endIf
if newRow != prevRow
	SayMessage (ot_position, FormatString ( cmsg_row, IntToString ( newRow ) ))
EndIf
if newCol != prevCol
	SayMessage (ot_position, FormatString ( cmsg_column, IntToString ( newCol ) ))
EndIf
EndFunction

void function SayHeaderChangeOnCellChangedEvent(int NewCol, int NewRow, int PrevCol, int PrevRow, string ColHeader, string RowHeader)
; even though the headers are passed to this function, we do not know if they are marked as headers or guessed.
; If the user only wants to hear marked headers, we need to ignore them if they are not marked.
if (GITblHeaders == TBL_HEADER_MARKED)
	if GetColumnHeader (true)==cscNull
		ColHeader=cscNull
	endIf
	if GetRowHeader (true)==cscNull
		rowHeader=cscNull
	endIf
endIf
if newRow != prevRow
&& RowHeader
&& GITblHeaders != TBL_HEADER_COL
&& GITblHeaders !=0
	SayMessage(ot_position,RowHeader);
EndIf
if newCol != prevCol
&& ColHeader
&& GITblHeaders != TBL_HEADER_ROW
&& GITblHeaders !=0
	SayMessage(ot_position,ColHeader);
EndIf
EndFunction

void function SayTableCellOnCellChangedEvent()
;By default, the navigation which triggered the event will speak the new data at the caret as appropriate.
;If we speak content here we'll get double speaking.
;Overwrite this function in applications where it is necessary to speak the table cell in the CellChangedEvent.
if SupportsEditCallbacks() then
		sayCell()
endIf
EndFunction

void function CellChangedEvent(int NewCol, int NewRow, int NewNesting, int NewRowColCount,
		string ColHeader, string RowHeader, int PrevCol, int PrevRow, int PrevNesting, int PrevRowColCount)
;This event function is triggered when the cursor moves from one cell in a table to a new cell in either the same table or
;a nested table or parent table.
;ShouldExitcellChangedEvent provides a means by which the default CellChangedEvent can be prevented from executing any code.
if ShouldExitcellChangedEvent() return endIf
UpdateTableCache(ColHeader,rowHeader,NewCol,NewRow)
var int SpeakHeadersBeforeContent = ShouldSpeakTableHeadersBeforeCellContent()
if SpeakHeadersBeforeContent
	SayHeaderChangeOnCellChangedEvent(NewCol, NewRow, PrevCol, PrevRow, ColHeader, RowHeader)
	if stringContains(GetScriptAssignedTo (getCurrentScriptKeyName()),"Cell") then
		;Speak the entire cell if table nav was used to move into a cell vs arrowing into a different cell.
		SayTableCellOnCellChangedEvent()
	endIf
else
	if stringContains(GetScriptAssignedTo (getCurrentScriptKeyName()),"Cell") then
		;Speak the entire cell if table nav was used to move into a cell vs arrowing into a different cell.
		SayTableCellOnCellChangedEvent()
	endIf
	SayHeaderChangeOnCellChangedEvent(NewCol, NewRow, PrevCol, PrevRow, ColHeader, RowHeader)
endIf
SayColumnAndRowChangeOnCellChangedEvent(NewCol, NewRow, PrevCol, PrevRow)
endFunction

void function TableExitedEvent()
;This event function is triggered when the cursor leaves a table and returns to the surrounding document.
CollectionRemoveAll (InlineTableCellCoordinates)
InlineTableCellCoordinates = null ()
SayMessage( ot_position, cmsgLeavingTable );
endFunction

void function TableEnteredEvent(int nTblCols, int nTblRows, int nTblNesting, int nCurCol, int nCurRow, int bUniform, int bHasMarkedHeaders, int nHeadersColumn, int nHeadersRow )
;This event function is triggered when the cursor moves into a table from outside a table.
;It is currently only supported in MSWord and IAccessible2 applications.
var
	string message,
	string sClass
if ! InlineTableCellCoordinates then InlineTableCellCoordinates = new collection endIf
InlineTableCellCoordinates.col = nCurCol
InlineTableCellCoordinates.row = nCurRow
let sClass = GetWindowClass(GetFocus())
if stringCompare (sClass, cwc_Word_Document) == 0
|| stringCompare (sClass, cwc_Word_Document2) == 0 then
	;When alt+Tabbing into Word,
	;the default TableEnteredEvent may fire rather than the Word TableEnteredEvent
	;because the WordFunc.jsb function may not yet be on the stack.
	;If so, just exit this event.
	return
EndIf
; restrict to when editing a document.
if SupportsEditCallbacks() then
	sayMessage(OT_CONTROL_GROUP_NAME, GetTableName())
endIf
message = FormatString( cmsgEnteringTable, IntToString ( nTblCols), IntToString ( nTblRows) )
SayMessage( ot_position, message );
endFunction

int function SaveSelectionContextFlags(string section, int flags, string JSIFile, optional int bFlush)
;Save only the context flags which are not set by reading the JCF file
return iniWriteInteger(section,hKey_selCtxFlags,(flags&~JCFSelCtxMask),jsiFile,bFlush)
EndFunction


int function iniDeleteFile (string strFile)
var
	int i, int iMax,
	string sectionList
sectionList = IniReadSectionNames (strFile)
if (stringIsBlank (sectionList))
	return
endIf
iMax = stringSegmentCount (sectionList, cscListSeparator)
for i=1 to iMax
	IniRemoveSection (stringSegment (sectionList, cscListSeparator, i), strFile)
endFor
iniFlush (strFile)
return deleteFile (strFile)
endFunction


; The next script added for German version - used for special German braille routing keys Script
Script BrailleHideMarking()
   BrailleMarkingOnOff()
EndScript

; Start OCR Support section...

int function getOCRLangID  (string strLangString)
var
	int i, int iMax,
	int iLangID,
	string sTmp
;Code goes here which runs before loading the Quick Settings tool.
EnsureOcrLanguageStrings()
iMax = stringSegmentCount (gstrOCRLangStrings, LIST_ITEM_SEPARATOR)
sTmp = stringSegment (gstrOCRLangStrings, LIST_ITEM_SEPARATOR, stringSegmentIndex (gstrOCRLangStrings, LIST_ITEM_SEPARATOR, strLangString))
iLangID = stringToInt (stringSegment (stmp, JAWS_DLG_LIST_SEPARATOR, 2))
return iLangID
endFunction

string function getOCRLangString (int iLangID)
var
	int i, int iMax,
	string sTmp,
	string strLangString
;Code goes here which runs before loading the Quick Settings tool.
EnsureOcrLanguageStrings()
iMax = stringSegmentCount (gstrOCRLangStrings, LIST_ITEM_SEPARATOR)
for i=1 to iMax
	sTmp = stringSegment (gstrOCRLangStrings, LIST_ITEM_SEPARATOR, i)
	sTmp = stringTrimLeadingBlanks (stringTrimTrailingBlanks (sTmp))
	if stringToInt (stringSegment (sTmp, JAWS_DLG_LIST_SEPARATOR, 2)) == iLangID then
		strLangString = stringSegment (sTmp, JAWS_DLG_LIST_SEPARATOR, 2)
		i = iMax+1;Break loop
	endIf
endFor
return strLangString
endFunction

void function EnsureOcrLanguageStrings()
if stringIsBlank (gstrOCRLangStrings) then
	gstrOCRLangStrings = getOCRLanguages ()
endIf
endFunction

void function GetOcrLanguageStrings(int languageIdentifier, stringArray byRef languages, int byRef size, int byRef languageIndex)
var
	int index,
	string item
EnsureOcrLanguageStrings()
size = stringSegmentCount(gstrOCRLangStrings, LIST_ITEM_SEPARATOR)
languages = new stringArray[size]
for index = 1 to size
	item = stringSegment(gstrOCRLangStrings, LIST_ITEM_SEPARATOR, index)
	languages[index] = stringSegment(item, JAWS_DLG_LIST_SEPARATOR, 1)
	if languageIdentifier == stringToInt(stringSegment(item, JAWS_DLG_LIST_SEPARATOR, 2)) then
		languageIndex = index
	endIf
endFor
endFunction

void function OCRWarningEvent (Int JobID, Int Error)
if Error == OCR_Warning_UNKNOWN then
	SayFormattedMessage (OT_ERROR, MSG_OCR_FAILED)
elIf Error == OCR_Warning_LowResImage then
	SayFormattedMessage (OT_ERROR, msg_OCR_Warning_LowResImage)
endIf
endFunction

Void Function OCRCompletedEvent (Int iJobID, Int iResult)
If iJobID == GlobalOCRJobID
	GlobalOCRJobID = 0
	if globalDocumentOCR then
		globalDocumentOCR = OFF
		if iResult == OCR_FAIL then
			if GlobalOCRJobType == OCR_PdfDocument then
				; Announce failure of PDF Document OCR:
				SayMessage (OT_ERROR, MSG_OCR_PDF_FAILED)
			else
				SayMessage (OT_ERROR, MSG_OCR_FAILED)
			endIf
		elIf iResult ==  OCR_SUCCESS_NoText then
			SayFormattedMessage (OT_ERROR, MSG_OCRGotNoText_L, MSG_OCRGotNoText_S)
		elIf iResult == OCR_BadPassword then
			SayFormattedMessage (OT_ERROR, msg_OCR_BadPassword)
		elIf iResult == OCR_LowResImage then
			SayFormattedMessage (OT_ERROR, msg_OCR_LowResImage)
		elIf iResult == OCR_NoDevicesAvailable then
			SayFormattedMessage (OT_ERROR, msg_OCR_NoDevicesAvailable)
		endIf
		BeginFlashMessage()
		SayMessage (OT_JAWS_MESSAGE, MSG_OCRFinished_L, MSG_OCRFinished_S)
		EndFlashMessage()
		return
	endIf
	; If Background OCR is on, don't want to speak any messages.
	if HandleBackgroundOCR(getFocus(), 0)
	return
	endIf

	BeginFlashMessage()
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRFinished_L, MSG_OCRFinished_S)
	EndFlashMessage()
	Pause ()
	If Not iResult || iResult == OCR_SUCCESS_NoText then
		if iResult ==  OCR_SUCCESS_NoText then
			SayFormattedMessage (OT_ERROR, MSG_OCRGotNoText_L, MSG_OCRGotNoText_S)
		else
			SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCR_FAILED)
		endIf
		CancelLayeredKeySequence ()
		gbRecognizingScreenAreaa = FALSE
		Return
	EndIf
	InvalidateCachedCursor()
	PerformScript JAWSCursor()
	if gbRecognizingScreenAreaa then
		gbRecognizingScreenAreaa = FALSE
		setRestriction (restrictNone)
	endIf
EndIf
CancelLayeredKeySequence ()
EndFunction

void function OCRReportNoTextFound(Int iJobID)
If iJobID == GlobalOCRJobID
	SayFormattedMessage (OT_ERROR, MSG_OCRGotNoText_L, MSG_OCRGotNoText_S)
EndIf
EndFunction

Void Function OCRDataInvalidatedEvent ()
if IsBackgroundOCREnabled()
&& c_BackgroundOCRRect.restrictedToCustomRect
	PerformScript StopBackgroundRecognition()
endIf
PCCursor ()
EndFunction

Void Function OcrStartedEvent(Int iJobID, Int type)
	GlobalOCRJobID = iJobId
	GlobalOCRJobType = type
	If type == OCR_ScreenArea then
		globalDocumentOCR = FALSE
		gbRecognizingScreenAreaa = TRUE
	ElIf type == OCR_PdfDocument || type == OCR_ImageFile then
		globalDocumentOCR = TRUE
		gbRecognizingScreenAreaa = FALSE
	ElIf type == OCR_Camera || type == OCR_Camera_MotionDetect then
		globalDocumentOCR = TRUE
		gbRecognizingScreenAreaa = FALSE
		SayMessage (OT_JAWS_MESSAGE, msg_OCRCameraStarted_L, MSG_OCRStarted_S)
	ElIf type == OCR_Scanner then
		globalDocumentOCR = TRUE
		gbRecognizingScreenAreaa = FALSE
		SayMessage (OT_JAWS_MESSAGE, msg_OCRScannerStarted_L, MSG_OCRStarted_S)
	ElIf type == OCR_CameraPsFromMenu || type == OCR_CameraPsFromKeyboard || type == OCR_CameraPsFromFusion then
		globalDocumentOCR = TRUE
		gbRecognizingScreenAreaa = FALSE
		SayMessage (OT_JAWS_MESSAGE, msg_picturesmart_fromcamera_started)
	Else
		globalDocumentOCR = FALSE
		gbRecognizingScreenAreaa = FALSE
	EndIf
EndFunction

Script RecognizeRealWindow ()
var
	Handle hCurrent = GetCurrentWindow (),
	Handle hReal = GetRealWindow (hCurrent),
	Handle hApp = GetAppMainWindow (hCurrent),
	Int iLeft,
	Int iRight,
	Int iBottom,
	Int iTop,
	Int iPrimary = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int iSecondary = ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int useMicrosoftOcr = ReadSettingInteger (section_OCR, hKey_UseMicrosoftRecognitionLanguageForScreenArea, 0, FT_CURRENT_JCF),
	Int microsoftOcrLanguage = ReadSettingInteger (section_OCR, hKey_MicrosoftRecognitionLanguage, 1033, FT_CURRENT_JCF),
	Int bValidRect,
	Int iCanRecognize
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsScreenShadeOn () then
	sayMessage (OT_ERROR, msg_OCR_Unavailable_Screen_Shade)
	return
endIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize == OCR_SUCCESS
	bValidRect = GetWindowRect (hReal, iLeft, iRight, iTop, iBottom) && ((iRight - iLeft) > 0) && ((iBottom - iTop) > 0)
	If (!bValidRect)
		; Use the app main window if the real window is not valid.
		bValidRect = GetWindowRect (hApp, iLeft, iRight, iTop, iBottom) && ((iRight - iLeft) > 0) && ((iBottom - iTop) > 0)
	EndIf
	If bValidRect
		; Only OCR if the rect has non-zero width and height.
		GlobalOCRJobID = OCRScreenArea (iLeft, iTop, iRight, iBottom, iPrimary, iSecondary, useMicrosoftOcr, microsoftOcrLanguage)
		SayScreenOcrStarted(useMicrosoftOcr)
		Return
	EndIf
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRNoWindow_L, MSG_OCRNoWindow_S)
Else
	SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
EndIf
EndScript

Script RecognizeControl ()
var
	Handle hCurrent = GetCurrentWindow (),
	Int iLeft,
	Int iRight,
	Int iBottom,
	Int iTop,
	Int iPrimary = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int iSecondary = ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int useMicrosoftOcr = ReadSettingInteger (section_OCR, hKey_UseMicrosoftRecognitionLanguageForScreenArea, 0, FT_CURRENT_JCF),
	Int microsoftOcrLanguage = ReadSettingInteger (section_OCR, hKey_MicrosoftRecognitionLanguage, 1033, FT_CURRENT_JCF),
	Int iCanRecognize
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsScreenShadeOn () then
	sayMessage (OT_ERROR, msg_OCR_Unavailable_Screen_Shade)
	return
endIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize == OCR_SUCCESS

	If GetWindowRect (hCurrent, iLeft, iRight, iTop, iBottom)
		GlobalOCRJobID = OCRScreenArea (iLeft, iTop, iRight, iBottom, iPrimary, iSecondary, useMicrosoftOcr, microsoftOcrLanguage)
		SayScreenOcrStarted(useMicrosoftOcr)
		Return
	EndIf
Else
	SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
EndIf
EndScript

Script RecognizeScreen ()
var
	Int iRight = ScreenGetWidth (),
	Int iBottom = ScreenGetHeight (),
	Int iPrimary = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int iSecondary = ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int useMicrosoftOcr = ReadSettingInteger (section_OCR, hKey_UseMicrosoftRecognitionLanguageForScreenArea, 0, FT_CURRENT_JCF),
	Int microsoftOcrLanguage = ReadSettingInteger (section_OCR, hKey_MicrosoftRecognitionLanguage, 1033, FT_CURRENT_JCF),
	Int iCanRecognize
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsScreenShadeOn () then
	sayMessage (OT_ERROR, msg_OCR_Unavailable_Screen_Shade)
	return
endIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize == OCR_SUCCESS
	GlobalOCRJobID = OCRScreenArea (0, 0, iRight, iBottom, iPrimary, iSecondary, useMicrosoftOcr, microsoftOcrLanguage)
	gbRecognizingScreenAreaa = TRUE ; so proper unrestricted state can be set for JAWSCursor
	SayScreenOcrStarted(useMicrosoftOcr)
	Return
Else
	SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
EndIf
EndScript

Script RecognizeCamera ()
var
	Int iCanRecognize,
	Int recognitionResult
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
If GlobalOCRJobID
	if OCR_Camera_MotionDetect == GlobalOCRJobType then
		CancelOCR (GlobalOCRJobID)
		GlobalOCRJobID = 0
	else
		SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Endif
	Return
EndIf
Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize == OCR_SUCCESS
	recognitionResult = OCRCamera ()
	if recognitionResult == OCRResult_NoDevicesAvailable then
		SayFormattedMessage (OT_ERROR,  msg_OCR_NoDevicesAvailable)
	elif recognitionResult != OCRResult_Success then
		SayFormattedMessage (OT_ERROR,  MSG_OCR_PDF_FAILED_TO_Start)
	EndIf
	Return
Else
	SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
EndIf
EndScript

Script CancelRecognition ()
var
	Int iCanRecognize
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsBackgroundOCREnabled()
	PerformScript StopBackgroundRecognition()
	return
endIf
If Not GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRCanNotCancel_L, MSG_OCRCanNotCancel_S)
	Return
EndIf
Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize == OCR_SUCCESS
CancelOCR (GlobalOCRJobID)
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRCancelled_L, MSG_OCRCancelled_S)
Else
	SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
EndIf
GlobalOCRJobID = 0
CancelLayeredKeySequence ()
EndScript

script OCRLayerHelp()
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cmsgOCRLayerHelpScreenTitle)
UserBufferAddTextResultsViewer(cmsgOCRLayerHelp)
EndScript

int Function JAWSFindActive()
return InJAWSFind  || (JAWSFindComplete!=0 && GetTickCount()-JAWSFindComplete < 500)
endFunction

int function ShouldInvalidateOCRDataOnPCCursor()
if JAWSFindActive() then
	return false ; Do not invalidate if the JAWS Find dialog is active
else
	return (TRUE)
endIf
endFunction

Int Function ShouldInvalidateOCRDataOnFocusChange ()
if JAWSFindActive() then
	return false ; Do not invalidate if the JAWS Find dialog is active
else
	return (TRUE)
endIf
EndFunction

; End of OCR section.

;Activate Search Edit Box stub for QuickSettings:

Script ActivateSearchBox ()
SayCurrentScriptKeyLabel ()
TypeCurrentScriptKey ()
endScript

script TableLayerHelp()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cmsgTableLayerHelpScreenTitle)
UserBufferAddTextResultsViewer(cmsgTableLayerHelp)
EndScript
string function ConvertTextToLinesWithHTMLLineBreak(string text)
return StringReplaceSubstrings (text,"\n","<br/>")+"<br/>"
EndFunction

string function MarkupLayerHelpSectionTextAsHeading(string sText)
return "<h2>"+sText+"</h2>"
endFunction

string function GetBasicLayerHelpTextGeneral()
var
	string sHeading,
	string sMsg
sHeading = MarkupLayerHelpSectionTextAsHeading(cmsgBasicLayerHelpScreen_Heading_General)
if !IsWindows10()
	sMsg = ConvertTextToLinesWithHTMLLineBreak(cmsgBasicLayerHelpScreen_General_Win7)
else
	sMsg = ConvertTextToLinesWithHTMLLineBreak(cmsgBasicLayerHelpScreen_General_Win10)
endIf
return sHeading+"<br/>"+sMsg+"<br/>"
EndFunction

string function GetBasicLayerHelpTextEditor()
var
	string sHeading,
	string sMsg
sHeading = MarkupLayerHelpSectionTextAsHeading(cmsgBasicLayerHelpScreen_Heading_Editor)
sMsg = ConvertTextToLinesWithHTMLLineBreak(cmsgBasicLayerHelpScreen_Editor)
return sHeading+"<br/>"+sMsg+"<br/>"
EndFunction

string function GetBasicLayerHelpTextMessaging()
var
	string sHeading,
	string sMsg
sHeading = MarkupLayerHelpSectionTextAsHeading(cmsgBasicLayerHelpScreen_Heading_Messaging)
sMsg = ConvertTextToLinesWithHTMLLineBreak(cmsgBasicLayerHelpScreen_Messaging)
return sHeading+"<br/>"+sMsg+"<br/>"
EndFunction

string function GetBasicLayerHelpTextSecondaryLayer()
var
	string sHeading,
	string sMsg
sHeading = MarkupLayerHelpSectionTextAsHeading(cmsgBasicLayerHelpScreen_Heading_SecondaryLayer)
sMsg = cmsgBasicLayerHelpScreen_SecondaryLayer
if stringCompare (getActiveConfiguration (), "Skype") == 0 then
; add the Skype layer only when the application has focus:
	sMsg = sMsg+cscBufferNewLine+cmsgBasicLayerHelpScreen_SecondaryLayerSkype
elIf stringCompare (getActiveConfiguration (true), "Google Docs") == 0 then
	; add the Google Docs Quick Key layer only when Google Docs has focus:
	sMsg = sMsg+cscBufferNewLine+cmsgBasicLayerHelpScreen_SecondaryLayerGoogleDocsQuickKeys
endIf
sMsg = ConvertTextToLinesWithHTMLLineBreak(sMsg)
return sHeading+"<br/>"+sMsg+"<br/>"
EndFunction

int function ShouldAddBasicLayerHelpTextBrowser()
;return true in applications where the basic layer key features for browsers are supported.
return false
EndFunction

string function GetBasicLayerHelpTextBrowser()
if !ShouldAddBasicLayerHelpTextBrowser() return cscNull endIf
var
	string sHeading,
	string sMsg
sHeading = MarkupLayerHelpSectionTextAsHeading(cmsgBasicLayerHelpScreen_Heading_Browser)
sMsg = ConvertTextToLinesWithHTMLLineBreak(cmsgBasicLayerHelpScreen_Browser)
return sHeading+"<br/>"+sMsg+"<br/>"
EndFunction

string function GetBasicLayerHelpScreenText()
;You can overwrite this function to rearrange, add or remove groups of messages which appear in the basic layer help screen.
;note that GetBasicLayerHelpTextBrowser will return null except in web browsers where the features are supported.
return GetBasicLayerHelpTextBrowser()
	+GetBasicLayerHelpTextGeneral()
	+GetBasicLayerHelpTextEditor()
	+GetBasicLayerHelpTextMessaging()
	+GetBasicLayerHelpTextSecondaryLayer()
EndFunction

script BasicLayerHelp()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cmsgBasicLayerHelpScreenTitle)
UserBufferAddTextResultsViewer(GetBasicLayerHelpScreenText())
EndScript

Int Function TreeWithColumns ()
var
	handle currentWindow,
	handle priorWindow

let currentWindow = GetFocus()
if (StringCompare (GetWindowClass (currentWindow), cwc_SysTreeView32) != 0) then
	return false;
EndIf

let priorWindow = GetPriorWindow (currentWindow)
if (!priorWindow || StringCompare (GetWindowClass (priorWindow), cwc_SysHeader32) != 0) then
	return false
EndIf

return true
EndFunction

int function DoJavaControlException(int iSubtype)
if iSubtype == WT_TABCONTROL
|| iSubtype == WT_UPDOWNSLIDER
|| iSubtype == WT_LEFTRIGHTSLIDER
|| iSubtype == WT_LEFTRIGHTSLIDER
|| iSubtype == WT_TREEVIEW
|| iSubtype == WT_TREEVIEWITEM then
	return true
elif iSubtype == WT_EDIT then
	if GetControlAttributes () & CTRL_SINGLELINE then
		return true
	endIf
elif MenusActive() then
	return true
endIf
return false
EndFunction

script DisplayMagicContextMenu()
MagSendKeyEvent(KI_SHOW_MAGIC_CONTEXT_MENU)
EndScript

Script SayColumnFromCurrentPosition()
if UseDocumentServerReadingFunctionality() then
	SetDocumentReadingStartLocation ()
	SayAll ()
	return
endIf
if IsFormsModeActive() then
	SetDocumentReadingStartLocation ()
	SayAll ()
	return
endIf
MagSendKeyEvent(KI_READ_COLUMN_FROM_POSITION)
EndScript

Script PopMagicWindow()
MagSendKeyEvent(KI_POP_MAGIC_WINDOW)
EndScript

Script MagicToolbarShowHide ()
MagSendKeyEvent(KI_POP_MAGIC_WINDOW)
endScript

Script MAGicWindow()
if !MagSendKeyEvent(KI_POP_MAGIC_WINDOW) then
	Say(mag017, OT_MESSAGE)
endif
EndScript

script OverviewUnmagnifiedEnhancementsToggle()
var
	int iResult
if !(GetRunningFSProducts() & product_MAGic) then
	return
endIf
let iResult = MagSendKeyEvent(KI_OVERVIEW_UNMAG_ENH_TOGGLE)
; 0 = on, 1 = off:
if ! iResult then
	Say(cmsgUnmagnifiedEnhancementsOn,ot_status)
else
	Say(cmsgUnmagnifiedEnhancementsOff,ot_status)
endIf
EndScript

Script OverviewUnmagnifiedMouseToggle ()
var
	int iResult
if !(GetRunningFSProducts() & product_MAGic) then
	return
endIf
iResult = MagSendKeyEvent (KI_OVERVIEW_UNMAG_MOUSE_TOGGLE)
; 0 = on, 1 = off:
if ! iResult then
	Say (cmsgUnmagnifiedMouseOn,ot_status)
else
	Say (cmsgUnmagnifiedMouseOff,ot_status)
endIf
EndScript

Script SpeechToggle()
if GetRunningFSProducts() != product_MAGic then
	;for JAWS, see MuteSynthesizer script
	return
endIf
if !IsSpeechOff() then
	;Turning off. Speak state before turning off.
	Say(cmsgSpeechOnDemand,ot_status)
endIf
MagSendKeyEvent (KI_SPEECH_TOGGLE)
if !IsSpeechOff() then
	;Turning on. Now that speech is on, speak state.
	Say(cmsgFullSpeech,ot_status)
endIf
EndScript

Script ProgressBarAnnouncement()
Say(ProgressBarAnnouncementToggle(false),ot_status)
EndScript

Script ExitPanningMode()
;do nothing, here for the hook exit
EndScript

Script PanUp ()
if (IsSecureDesktop()) then
   return
ENDIF
;Mag levels are in hundreds:
if MagGetOption (MID_LEVEL) > 100
&& MagGetOption(MID_ON) then
	EnterPanningMode()
	MagStartPanning(KI_PAN_UP)
else
	Beep ()
ENDIF
EndScript

Script PanDown()
if (IsSecureDesktop()) then
   return
ENDIF
;Mag levels are in hundreds:
if MagGetOption (MID_LEVEL) > 100
&& MagGetOption(MID_ON) then
	EnterPanningMode()
	MagStartPanning(KI_PAN_DOWN)
else
	Beep ()
ENDIF
EndScript

Script PanLeft ()
if (IsSecureDesktop()) then
   return
ENDIF
;Mag levels are in hundreds:
if MagGetOption (MID_LEVEL) > 100
&& MagGetOption(MID_ON) then
	EnterPanningMode()
	MagStartPanning(KI_PAN_LEFT)
else
	Beep ()
ENDIF
EndScript

Script PanRight ()
if (IsSecureDesktop()) then
   return
ENDIF
;Mag levels are in hundreds:
if MagGetOption (MID_LEVEL) > 100
&& MagGetOption(MID_ON) then
	EnterPanningMode()
	MagStartPanning(KI_PAN_RIGHT)
else
	Beep ()
ENDIF
EndScript

Script PanLeftIncrement()
;Mag levels are in hundreds:
if MagGetOption (MID_LEVEL) > 100
&& MagGetOption(MID_ON) then
	MagSendKeyEvent(KI_PAN_LEFT_INCREMENT)
else
	Beep ()
endIf
EndScript

Script PanRightIncrement()
;Mag levels are in hundreds:
if MagGetOption (MID_LEVEL) > 100
&& MagGetOption(MID_ON) then
	MagSendKeyEvent(KI_PAN_RIGHT_INCREMENT)
else
	Beep ()
endIf
EndScript

Script PanUpIncrement()
;Mag levels are in hundreds:
if MagGetOption (MID_LEVEL) > 100
&& MagGetOption(MID_ON) then
	MagSendKeyEvent(KI_PAN_UP_INCREMENT)
else
	Beep ()
endIf
EndScript

Script PanDownIncrement()
;Mag levels are in hundreds:
if MagGetOption (MID_LEVEL) > 100
&& MagGetOption(MID_ON) then
	MagSendKeyEvent(KI_PAN_DOWN_INCREMENT)
else
	Beep ()
endIf
EndScript

Script IncreaseSpeedDuringPanning ()
;when not in panning mode, turn off forms mode
;for laptop keys, we don't ever want to do the FormsMode action here.
;These are real keys which the user may want to type into a form text box.
if ! StringContains (stringLower (getCurrentScriptKeyName ()), "numpad") then
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey()
	return
endIf
If IsFormsModeActive()
|| IsVirtualPCCursor() then
	TurnOffFormsMode()
	SayMessage(ot_status, cMSG288_L, cMSG288_S) ; virtual pc cursor
else
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey()
endIf
EndScript

Script DecreaseSpeedDuringPanning ()
TypeCurrentScriptKey()
SayCurrentScriptKeyLabel ()
EndScript

Script PanNextLine()
TypeCurrentScriptKey()
SayCurrentScriptKeyLabel ()
EndScript

Script MoveToBeginningOfCurrentLine ()
MagSendKeyEvent(KI_GO_TO_HOME)
EndScript

Script MoveToEndOfCurrentLine ()
MagSendKeyEvent(KI_GO_TO_END)
EndScript

Script MoveToTopOfScreen ()
MagSendKeyEvent(KI_GO_TO_TOP)
EndScript

Script MoveToBottomOfScreen ()
MagSendKeyEvent(KI_GO_TO_BOTTOM)
EndScript

Script MoveToBeginningOfNextLine ()
MagSendKeyEvent(KI_GO_TO_HOME_NEXT_LINE)
EndScript

Script MouseEnhancementToggle()
if MagSendKeyEvent(KI_CUSTOM_MOUSE_TOGGLE) == mske_toggle_on then
	Say(cmsgCustomMouseOn,OT_STATUS)
else
	Say(cmsgCustomMouseOff,OT_STATUS)
endif
EndScript

Script SetMouseEcho()
var int iEcho = SetMouseEcho()
if iEcho == MouseEcho_Character
	Say(cmsgMouseEchoCharacter,ot_status)
	MagSendKeyEvent (KI_MOUSE_ECHO_CHARACTER)
ElIf iEcho == MouseEcho_Word
	Say(cmsgMouseEchoWord,ot_status)
	MagSendKeyEvent (KI_MOUSE_ECHO_WORD)
elif iEcho == MouseEcho_Line
	Say(cmsgMouseEchoLine,ot_status)
	MagSendKeyEvent (KI_MOUSE_ECHO_LINE)
elif iEcho == MouseEcho_Paragraph
	Say(cmsgMouseEchoParagraph,ot_status)
	MagSendKeyEvent (KI_MOUSE_ECHO_PARAGRAPH)
ElIf iEcho == MouseEcho_Off
	Say(cmsgMouseEchoOff,ot_status)
	MagSendKeyEvent (KI_MOUSE_ECHO_OFF)
EndIf
EndScript

script ToggleMouseEchoFromLayer()
var int toggle = MouseEchoToggle()
if toggle == ScriptFunctionReturnError return endIf
if toggle == On
	Say(cmsgMouseEchoLayerChoiceOn,ot_status)
else
	Say(cmsgMouseEchoLayerChoiceOff,ot_status)
endIf
MagSendKeyEvent (KI_MOUSE_ECHO_TOGGLE)
EndScript

script SetMouseEchoToCharacter()
if !SetMouseEchoToUnit(MouseSpeechUnit_Character)
	beep()
	return
endIf
Say(cmsgMouseEchoLayerChoiceCharacter,ot_status)
MagSendKeyEvent (KI_MOUSE_ECHO_CHARACTER)
EndScript

script SetMouseEchoToWord()
if !SetMouseEchoToUnit(MouseSpeechUnit_Word)
	beep()
	return
endIf
Say(cmsgMouseEchoLayerChoiceWord,ot_status)
MagSendKeyEvent (KI_MOUSE_ECHO_WORD)
EndScript

script SetMouseEchoToLine()
if !SetMouseEchoToUnit(MouseSpeechUnit_Line)
	beep()
	return
endIf
Say(cmsgMouseEchoLayerChoiceLine,ot_status)
MagSendKeyEvent (KI_MOUSE_ECHO_LINE)
EndScript

script SetMouseEchoToParagraph()
if !SetMouseEchoToUnit(MouseSpeechUnit_Paragraph)
	beep()
	return
endIf
Say(cmsgMouseEchoLayerChoiceParagraph,ot_status)
MagSendKeyEvent (KI_MOUSE_ECHO_PARAGRAPH)
EndScript

script EchoLayerHelp()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cmsgEchoLayerHelpScreenTitle)
UserBufferAddTextResultsViewer(cmsgEchoLayerHelp)
EndScript

Script AutoSwitchToggle()
if MagSendKeyEvent(KI_AUTO_SWITCH) == mske_toggle_on then
	Say(cmsgAutoSwitchOn,ot_status)
else
	Say(cmsgAutoSwitchOff,ot_status)
EndIf
EndScript

Script LineLockToggle()
if MagSendKeyEvent(KI_LINE_LOCK) == mske_toggle_on then
	Say(cmsgLineLockOn,ot_status)
else
	Say(cmsgLineLockOff,ot_status)
EndIf
EndScript

Script MouseToFromDisplay()
MagSendKeyEvent (KI_MOUSE_TO_FROM_DISPLAY)
EndScript

script MoveViewToCursor()
ResetSynth ()
PCCursor ()
MagSetFocusToPoint(GetCursorCol(),GetCursorRow())
Say(cmsgCursorActive,ot_status)
EndScript

script MoveViewToMouse()
ResetSynth ()
JAWSCursor ()
MagSetFocusToPoint(GetCursorCol(),GetCursorRow())
PCCursor()
Say(cmsgMouseActive,ot_status)
EndScript

Script QuickViewManager()
if QuickViewFramesUnsupported() then
	return
EndIf
FrameSetOnWindow(GetWindowAtPoint(GetCursorCol(CURSOR_JAWS), GetCursorRow(CURSOR_JAWS)))
if GlobalFrameBottom != VALUE_NOT_READY
&& GlobalFrameRight != VALUE_NOT_READY then
	FrameManagerRun(FRAMEVIEW_ShowActiveFrames)
	; reset GlobalVariables
	FrameClearValues()
endIf
EndScript

Script QuickViewFrameToggle()
if QuickViewFramesUnsupported() then
	return
EndIf
if MagSendKeyEvent(KI_QUICKVIEW_TOGGLE) == mske_toggle_on then
	Say(cmsgQuickViewFramesOn,ot_status)
else
	Say(cmsgQuickViewFramesOff,ot_status)
EndIf
EndScript

Script SmoothingToggle()
Var
	Int ret,
	String message
Let ret = MagSendKeyEvent(KI_SMOOTH_TOGGLE)
if IsWindows8 () then
	if ret == ui_SmoothingNone then
		message = cmsgSmoothingDisabled
	else; could be 0 or 1, but 0 = HD not available in Windows 8:
		message = cmsgSmoothingEnabled
	endIf
else; classic / Windows 7 smoothing, where we respect 3 states.
	If (ui_SmoothingHD == ret) then
		message = cmsgSmoothingHD
	ElIf (ui_SmoothingClassic == ret) then
		message = cmsgSmoothingClassic
	ElIf (ui_SmoothingNone == ret) then
		message = cmsgSmoothingNone
	EndIf
endIf
Say(message, ot_status)
EndScript

void function SpeakMagLevelMessage ()
Say(GetMagLevelMessage(giMagLevel),OT_STATUS)
endFunction

Script IncreaseMagnification()
unScheduleFunction (giFN_SpeakMagLevelMessage)
if MagGetOption(MID_LEVEL) == MAG_MAX_LEVEL then
	Beep()
	Return
endIf
let giMagLevel = MagSendKeyEvent(KI_INCREASE_MAG_LEVEL)
giFN_SpeakMagLevelMessage = scheduleFunction ("SpeakMagLevelMessage", 1)
EndScript

Script DecreaseMagnification()
unScheduleFunction (giFN_SpeakMagLevelMessage)
if MagGetOption(MID_LEVEL) == 100 then
	Beep()
	Return
endIf
let giMagLevel= MagSendKeyEvent(KI_DECREASE_MAG_LEVEL)
giFN_SpeakMagLevelMessage = scheduleFunction ("SpeakMagLevelMessage", 1)
EndScript

Script VisualEnhancementToggle()
if MagSendKeyEvent(KI_MAGNIFY_TOGGLE) then
	Say(cmsgVisualEnhancementsOn,OT_STATUS)
	Say(GetMagLevelMessage(MagGetOption(MID_LEVEL)),OT_STATUS)
else
	Say(cmsgVisualEnhancementsOff,OT_STATUS)
EndIf
EndScript

Script VisualEnhancementsToggle()
PerformScript VisualEnhancementToggle ()
EndScript

Script MagLevelToggle()
let gbAnnounceNewMagLevel = true
MagSendKeyEvent(KI_MAG_LEVEL_TOGGLE)
EndScript

Script OneXToggle ()
let gbAnnounceNewMagLevel = true
MagSendKeyEvent(KI_MAG_LEVEL_TOGGLE)
EndScript

Script ColorEnhancementToggle()
if MagSendKeyEvent(KI_CUSTOM_COLORS_TOGGLE) == mske_toggle_on then
	say(cmsgCustomColorsOn,ot_status)
else
	say(cmsgCustomColorsOff,ot_status)
EndIf
EndScript

;Now named TrackingToggle:
Script TrackingToggle ()
ToggleTracking ()
EndScript

Script DisplayLocator()
if MultiMonEnabled() then
	SayMessage(ot_error,cmsgLocatorNotSupportedInMultiMonitorMode_L,cmsgNotSupportedInMultiMonitorMode_S)
	return
EndIf
ToggleLocatorMode()
Say(cmsgLocatorsOn,OT_STATUS)
EndScript

Script AcceptLocator()
ToggleLocatorMode()
EndScript

Script CancelLocator()
var
	int bOn
let bOn = MagGetOption(LOC_ON)
if bOn then
	ToggleLocatorMode(1)
	Say(cmsgLocatorsOff,OT_STATUS)
endif
EndScript

Script LocatorUp()
MagSendKeyEvent(KI_LOCATOR_UP)
EndScript

Script LocatorDown()
MagSendKeyEvent(KI_LOCATOR_DOWN)
EndScript

Script LocatorLeft()
MagSendKeyEvent(KI_LOCATOR_LEFT)
EndScript

Script LocatorRight()
MagSendKeyEvent(KI_LOCATOR_RIGHT)
EndScript

Script LocatorNext()
MagSendKeyEvent(KI_LOCATOR_NEXT)
EndScript

Script LocatorPrior()
MagSendKeyEvent(KI_LOCATOR_PRIOR)
EndScript

Script LocatorHome()
MagSendKeyEvent(KI_LOCATOR_HOME)
EndScript

Script LocatorEnd()
MagSendKeyEvent(KI_LOCATOR_END)
EndScript

Script SwitchToNextMagicView()
Say(ToggleView(false,Cycle_Next),ot_status)
EndScript

Script SwitchToPriorMagicView()
Say(ToggleView(false,Cycle_Prior),ot_status)
EndScript

Script FullView()
if (MultiMonEnabled()) then
	Say(cmsgMultiMonVFull, OT_MESSAGE)
	return
endIf
MagSetMagnifiedView(MV_FULL)
Delay(2)
if MagGetMagnifiedView() == MV_FULL then
	Say(cmsgMVFull,ot_status)
EndIf
EndScript

script LensView()
if (MultiMonEnabled()) then
	Say(cmsgMultiMonVFull, OT_MESSAGE)
	return
endIf
MagSetMagnifiedView(MV_LENS)
Delay(2)
if MagGetMagnifiedView() == MV_LENS then
	Say(cmsgMVLens,ot_status)
EndIf
EndScript

Script OverlayView()
if (MultiMonEnabled()) then
	Say(cmsgMultiMonVFull, OT_MESSAGE)
	return
endIf
MagSetMagnifiedView(MV_OVERLAY)
Delay(2)
if MagGetMagnifiedView() == MV_OVERLAY then
	Say(cmsgMVOverlay,ot_status)
EndIf
EndScript

Script SplitView()
if (MultiMonEnabled()) then
	Say(cmsgMultiMonVFull, OT_MESSAGE)
	return
endIf
MagSetMagnifiedView(MV_SPLIT)
Delay(2)
if MagGetMagnifiedView() == MV_SPLIT then
	Say(cmsgMVSplit,ot_status)
EndIf
EndScript

Script ResizeView()
var
	int nView,
	int nMagState
if (MultiMonEnabled()) then
	Say(cmsgMultiMonVFull, OT_MESSAGE)
	return
endIf
let nMagState = MagGetState()
let nView = MagGetMagnifiedView()
if !nMagState then
	Say(mag023,OT_MESSAGE)
	return
elif nView == MV_FULL then
	Say(mag047,OT_MESSAGE)
	return
EndIf
MagSendKeyEvent (KI_SIZE_MAGIC_VIEW)
Say(cmsgResizingTool,OT_MESSAGE)
EndScript

script TetherMouseToDisplayToggle()
If MagSendKeyEvent(KI_TETHER_MOUSE) == mske_toggle_on then
	SayMessage(OT_STATUS,cmsgMouseFollowCursor_L,cmsgMouseFollowCursor_S)
Else
	SayMessage(OT_STATUS,cmsgMouseNotFollowCursor_L,cmsgMouseNotFollowCursor_S)
endIf
EndScript

Script CursorEnhancementToggle()
if MagSendKeyEvent(KI_CUSTOM_CURSOR_TOGGLE) == mske_toggle_on then
	Say(cmsgCustomCursorOn,ot_status)
else
	Say(cmsgCustomCursorOff,ot_status)
EndIf
EndScript

Script JumpToNextDisplay()
ToggleDisplay(Cycle_Next)
EndScript

script TypingEchoToggle()
var
	int nNewTypingEcho,
	int bSuccess
bSuccess = MagTypingEchoToggle(nNewTypingEcho)
if bSuccess then
	if nNewTypingEcho then
		Say(cmsgKeyboardEchoOn,ot_status)
	else
		Say(cmsgKeyboardEchoOff,ot_status)
	EndIf
else
	beep()
endif
EndScript

script MouseEchoToggle()
var int toggle = MouseEchoToggle()
if toggle == ScriptFunctionReturnError return endIf
if toggle == On
	Say(cmsgMouseEchoOn,ot_status)
else
	Say(cmsgMouseEchoOff,ot_status)
endIf
EndScript

Script AdjustMAGicOptions()
if GetRunningFSProducts() & product_JAWS then
	;do not allow to run if JAWS and MAGic are running together
	return
EndIf
if InHJDialog () then
	SayMessage (OT_error, cMSGOpenMAGicDlgError_L, cMSGOpenMAGicDlgError_S)
	return
endIf
if  gbSupportsMAGicOptions || isVirtualPcCursor () || IsFormsModeActive () then
	PerformScript QuickSettings ()
endIf
EndScript

script ViewLock()
;StartViewLocking()
;This script is needed as a place holder for the View Locking key.  The code
;to toggle view locking is internal.
EndScript

int function GetOwningAppNameAndVersionNumberForWindow(handle hWnd, string byRef sApp, int byRef version)
version = 0
sApp = GetWindowOwner(hWnd)
if sApp
	version = GetProgramVersion(sApp)
endIf
return (sApp && version)
EndFunction

Script IncreaseSystemVolume()
var
	int volume = GetSystemVolume()
	; No point in trying to set system volume higher than 100% and having Windows reset it to 100%
if volume >= 95
	SetSystemVolume(100)
else
; We change the system volume in increments of 5 - similar to iOS behavior
	ChangeSystemVolume(V_UP,5)
endIf
volume = GetSystemVolume()
Say(FormatString(cmsgPercentage,IntToString(volume)),ot_status)
EndScript

Script DecreaseSystemVolume()
var
	int volume = GetSystemVolume()
	; The minimum volume should be 10
if volume <= 15
	SetSystemVolume(10)
else
; We change the system volume in increments of 5 - similar to iOS behavior
	ChangeSystemVolume(V_DOWN,5)
endIf
volume = GetSystemVolume()
if volume
	Say(FormatString(cmsgPercentage,IntToString(volume)),ot_status)
endIf
EndScript

Script LaunchWindowsShortcut(string value)
LaunchShortcut(value)
EndScript

Script WindowsCmd(int value)
AppCommand(value)
EndScript

Script DisplayVoiceProfilesContextMenu()
var
	int Message,
	HANDLE hwnd
if GetRunningFSProducts() != product_MAGic then
	return
EndIf
if !HasUserDefinedVoiceProfiles() then
	SayMessage(ot_error,cmsgNoUserDefinedVoiceProfiles)
	return
EndIf
let hwnd = FindTopLevelWindow("JFWUI2",cscNull)
let Message = RegisterWindowMessage(VoiceProfilesContextMenu_MessageStr)
if hwnd
&& Message then
	let gbAnnounceVoiceProfilesContextMenu = true
	PostMessage (hwnd,Message,0,0)
endIf
EndScript

script RestrictMouseToActiveMonitorToggle()
var
	int bResult
let bResult = RestrictMouseToActiveMonitorHandler()
if bResult < 0 then
	beep()
elif bResult == 1 then
	Say(cmsg_RestrictMouseToActiveMonitor_on,ot_status)
elif !bResult then
	Say(cmsg_RestrictMouseToActiveMonitor_off,ot_status)
EndIf
EndScript

Script FocusEnhancementToggle()
if MagSendKeyEvent(KI_FOCUS_ENHANCEMENT_TOGGLE) == mske_toggle_on then
	Say(cmsgFocusEnhancementOn,ot_status)
else
	Say(cmsgFocusEnhancementOff,ot_status)
EndIf
EndScript

script IndicateCaps()
Say(IndicateCapByToggle(false),ot_status)
EndScript

Script ReportMagState()
If (MagGetState () > 0) then
	Say (mag001 + mag002 + IntToString (MagGetOption (MID_LEVEL)), ot_message)
Else
	Say (mag004, ot_message)
EndIf
EndScript

Script CenterMouseInView()
;mag012 = "Mouse Centered"
CenterMouseInView ()
Say (mag012, OT_STATUS)
EndScript

Script MagDecrementMagnificationLevel()
var
	int nLevel
if !IsMAGicRunning() then
	Say(mag017, OT_MESSAGE)
EndIf
if MagGetOption(MID_LEVEL) == 100 then
	Beep()
	Return
endif
let nLevel = MagSendKeyEvent(KI_DECREASE_MAG_LEVEL)
Say(GetMagLevelMessage(nLevel),OT_STATUS)
EndScript

Script MagIncrementMagnificationLevel()
var
	int nLevel
if !IsMAGicRunning() then
	Say(mag017, OT_MESSAGE)
EndIf
if MagGetOption(MID_LEVEL) == MAG_MAX_LEVEL then
	Beep()
	Return
endif
let nLevel = MagSendKeyEvent(KI_INCREASE_MAG_LEVEL)
Say(GetMagLevelMessage(nLevel),OT_STATUS)
EndScript

Script MagLocatorsToggle()
var
	int bOn
if !IsMAGicRunning() then
	Say(mag017, OT_MESSAGE)
EndIf
let bOn = MagGetOption (LOC_ON)
ToggleLocatorMode(1)
if bOn then
	Say(mag025, OT_STATUS)
else
	Say(mag024, OT_STATUS)
endif
EndScript

Script MagnificationToggle()
if !IsMAGicRunning() then
	Say(mag017, OT_MESSAGE)
EndIf
if MagSendKeyEvent (KI_MAGNIFY_TOGGLE) then
	Say(mag026, OT_STATUS)
else
	Say(mag027, OT_STATUS)
	Say(GetMagLevelMessage(MagGetOption(MID_LEVEL)),OT_STATUS)
endif
EndScript

Script MagNextMAGicView()
var
	int nView
let nView = MagGetOption (MID_VIEW)
if (nView == 5) then
	let nView = 0
else
	let nView = nView + 1
endif
if (MagSendKeyEvent (KI_NEXT_MAGIC_VIEW)) then
	;If the MAGic Window has focus, and the focus is actually
	;in the MAGicView window, then don't speak the change.
	;Highlighted text event will catch it.
	if (GetWindowClass(GetAppMainWindow (GetFocus())) == sc1)
	&& (GetControlID(GetFocus()) == 1026 /*MAGicView ID*/) then
		;Don't say anything.  Highlighted text will pick it up.
		return
	endIf
	if 	(nView == 0) then
		Say(mag033, OT_STATUS)
	elif (nView == 1) then
		Say(mag034, OT_STATUS)
	elif (nView == 2) then
		Say(mag035, OT_STATUS)
	elif (nView == 3) then
		Say(mag036, OT_STATUS)
	elif (nView == 4) then
		Say(mag037, OT_STATUS)
	elif (nView == 5) then
		Say(mag038, OT_STATUS)
	endif
else
	Say(mag017, OT_MESSAGE)
endif
EndScript

Script MagResizeMAGicView()
var
	int nView,
	int nMagState
let nMagState = MagGetState()
let nView = MagGetOption (MID_VIEW)
if (nMagState == -1) then
	Say (mag017, OT_MESSAGE)
elif (nMagState < 1) then
	Say (mag023, OT_MESSAGE)
elif (nView == 2 /*full screen*/ || nView == 5 /*tracking lens*/ ) then
	Say (mag047, OT_MESSAGE)
elif (MagSendKeyEvent (KI_SIZE_MAGIC_VIEW)) then
	Say (mag046, OT_MESSAGE)
else
	Say (mag017, OT_MESSAGE)
endif
EndScript

Script MagSmoothToggle()
; mag017 = "MAGic Not running"
; mag052 = "Smoothing On",
; mag053 = "Smoothing Off"
Var
	Int nSpeechStatus,
	Int ret,
	String message
Let nSpeechStatus = SpeechInUse ()
Let ret = MagSendKeyEvent(KI_SMOOTH_TOGGLE)
If (mske_Error == ret) then
	message = mag017
ElIf (ui_SmoothingHD == ret) then
	message = cmsgSmoothingHD
ElIf (ui_SmoothingClassic == ret) then
	message = cmsgSmoothingClassic
ElIf (ui_SmoothingNone == ret) then
	message = cmsgSmoothingNone
		EndIf
		If (nSpeechStatus) then
	Say(message, ot_status)
	EndIf
EndScript

Script MagTrackToggle()
; mag017 = "MAGic Not running"
; mag062 = "Tracking On",
; mag063 = "Tracking Off"
Var
	Int nSpeechStatus,
	Int bOn
Let nSpeechStatus = SpeechInUse ()
Let bOn = MagGetOption (TID_ON)
If (MagSendKeyEvent (KI_TRACK_TOGGLE)) then
	If (bOn) then
		If (nSpeechStatus) then
			Say (mag063, ot_status)
		EndIf
	Else
		If (nSpeechStatus) then
			Say (mag062, ot_status)
		EndIf
	EndIf
Else
	If (nSpeechStatus) then
		Say (mag017, OT_MESSAGE)
	EndIf
EndIf
EndScript

int function FocusFollowsMouse()
var
	int MouseX,
	int MouseY,
	handle Window
if GetMenuMode() < menu_active then
	return false
endIf
GetCursorPos(CURSOR_JAWS, smmPixels, MouseX, MouseY)
Window = GetWindowAtPoint(MouseX, MouseY)
If (IsStartMenu(Window)) Then
	return false
EndIf
return true
EndFunction

void function CopyMAGicScreenShot(int ShotType)
SayCurrentScriptKeyLabel ()
if MagGetState() <= 0 then
	TypeCurrentScriptKey()
	return
EndIf
MagCaptureScreenShot(ShotType)
if ShotType == MAGic_ScreenCaptureMode_FullMAGicViewPort then
	SayMessage(ot_jaws_message,cmsgCopyScreenImage_L,cmsgCopyScreenImage_S)
elif ShotType == MAGic_ScreenCaptureMode_VisibleMagnifiedArea then
	SayMessage(ot_jaws_message,cmsgCopyVisibleMagnifiedWindow_L,cmsgCopyVisibleMagnifiedWindow_S)
EndIf
EndFunction

script CopyScreenImage()
CopyMAGicScreenShot(MAGic_ScreenCaptureMode_FullMAGicViewPort)
EndScript

script CopyVisibleMagnifiedWindow()
CopyMAGicScreenShot(MAGic_ScreenCaptureMode_VisibleMagnifiedArea)
EndScript

script NavigationQuickKeysToggle ()
var int nSetting = getJCFOption (OPT_QUICK_KEY_NAVIGATION_MODE)
if ! isVirtualPcCursor () && ! IsFormsModeActive() then
	SayMessage (OT_ERROR, cmsgQuickKeysNotAvailable, cmsgNotAvailable)
	return
endIf
nSetting = ! nSetting
setJCFOption (OPT_QUICK_KEY_NAVIGATION_MODE, nSetting)
if nSetting == OFF then
	sayMessage (OT_STATUS, cmsgQuickKeysOff, cmsgOff)
else
	sayMessage (OT_STATUS, cmsgQuickKeysOn, cmsgOn)
endIf
endScript

int function ClipboardTextViewerIsActive()
return ghWndResultsViewer
	&& GetWindowName(ghWndResultsViewer) == cmsgClipboardTextTitle
EndFunction

void function ShowClipboardTextInResultsViewer()
var
	string sText,
	int bClipboardTextViewerIsActive
let sText = GetClipboardText()
if !sText then
	SayMessage(ot_error,cmsgNoTextOnClipboard)
	return
endIf
let bClipboardTextViewerIsActive = ClipboardTextViewerIsActive()
if UserBufferIsActiveResultsViewer()
&& !bClipboardTextViewerIsActive then
	UserBufferDeactivateResultsViewer ()
EndIf
UserBufferClearResultsViewer()
if !bClipboardTextViewerIsActive then
	UpdateResultsViewerTitle(cmsgClipboardTextTitle)
endIf
let sText=sText+cScBufferNewLine;
let sText=sText+cScBufferNewLine;
let sText=sText+cMsgViewClipboardTextExit;
UserBufferAddTextResultsViewer(TextToHTML(sText, cmsgClipboardTextTitle))
if !bClipboardTextViewerIsActive then
	UserBufferActivate()
else
	if GetTopLevelWindow(GetFocus()) != ghWndResultsViewer then
		SetFocus(ghWndResultsViewer)
	EndIf
endIf
EndFunction

script ViewClipboardText()
var
	int bOverwrite
if ClipboardTextViewerIsActive() then
	let bOverwrite = ExMessageBox(cmsgClipboardTextViewerOverwritePrompt, cmsgClipboardTextViewerOverwriteTitle, MB_YESNO)
	if bOverwrite == idNo then
		return
	EndIf
endIf
ShowClipboardTextInResultsViewer()
EndScript

script DoFlexibleWebDialog()
	SayMessage(ot_error, msgFlexibleWebNotAvailable)
EndScript

int function FlexibleWebDialogActive ()
var string sRealName = getWindowName (getRealWindow (getFocus ()))
if !inHjDialog () then
	Return FALSE
endIf
return (StringCompare(sRealName,cwn_FlexibleWeb_dlg) == 0
|| StringCompare(sRealName,cwn_ChooseAnAction_dlg) == 0
|| StringCompare(sRealName,cwn_ChooseAnElement_dlg) == 0
|| StringCompare(sRealName,cwn_ChooseACustomization_dlg) == 0
|| StringCompare(sRealName,cwn_SaveTemporaryCustomizations_dlg) == 0
|| StringCompare(sRealName,cwn_SaveTemporaryCustomizationsFinish_dlg) == 0
|| StringCompare(sRealName,cwn_ViewOrChangeWhereRulesAreApplied_dlg) == 0)
endFunction

string function FlexibleWebNumberOfActiveRules ()
var
	handle hwnd = getFocus ()
if ! FlexibleWebDialogActive () || getWindowSubtypeCode (hwnd) != WT_TREEVIEW
|| getControlID (hwnd) != id_FlexibleWeb_ViewOrChangeRules_Treeview then
	return cscNull
endIf
return formatString (cmsgFlexibleWebActiveRules, FlexibleWebGetActiveRulesNumberForSelectedLocation ())
endFunction

object function GetMSAAObjectTree(optional handle hWnd)
var
	object oTree
if ! hWnd then
	let hWnd = GetAppMainWindow (GetFocus ())
EndIf
let oTree = CreateObjectEx ("FreedomSci.AccessibleTree", 0, "AccessibleObjectTools.x.manifest")
if oTree then
	return oTree.BuildUsingMSAA(hWnd)
	EndIf
	return 0
EndFunction

object function GetUIAObjectTree(optional handle hWnd)
var
	object oTree
if !hWnd then
	let hWnd = GetAppMainWindow(GetFocus())
EndIf
let oTree = CreateObjectEx("FreedomSci.AccessibleTree",0,"AccessibleObjectTools.x.manifest")
if oTree then
	return oTree.Build(hWnd)
EndIf
return 0
EndFunction

object function GetUIAObjectFocusItem()
var
	object oTree,
	object oItem
let oTree = GetUIAObjectTree(GetFocus())
if !oTree then
	return 0
EndIf
let oItem = oTree.FindByKeyboardFocus(1)
if !oItem then
	return 0
EndIf
;Sometimes, what is reported as the focus object is actually an ancestor to the focus object.
;If we look further down, we may find a descendent is really the focus object:
while oItem
	let oTree = oItem
	let oItem = oItem.FirstChild.FindByKeyboardFocus(1)
EndWhile
return oTree
EndFunction

object function GetFocusedUIAObjectSubtree()
var
	object oTree
let oTree = CreateObjectEx("FreedomSci.AccessibleTree",0,"AccessibleObjectTools.x.manifest")
if oTree then
	return oTree.BuildFocusSubtreeUsingUIA(getFocus())
EndIf
return 0
EndFunction

void function RibbonStatusChangedEvent(int nStatus, handle hRibbon)
if (nStatus) then
	sayMessage(OT_STATUS, cmsgRibbonExpanded_l, cmsgRibbonExpanded_s)
else
	sayMessage(OT_STATUS, cmsgRibbonCollapsed_l, cmsgRibbonCollapsed_s)
endIf
endFunction

int function GetNavigationQuickKeysSettingFromFile ()
var
	int FileType = FT_CURRENT_JCF,
	int value = readSettingInteger (SECTION_OPTIONS, hKey_QuickKeyNavigationMode, -1, FileType, rsStandardLayering)
if value == -1 then
	FileType = FT_DEFAULT_JCF
	value = readSettingInteger (SECTION_OPTIONS, hKey_QuickKeyNavigationMode, 0, FileType, rsStandardLayering)
endIf
return value
endFunction

Script QuickNavigationKeysSuspendOrResume ()
var
	int nSettingFromFile = GetNavigationQuickKeysSettingFromFile (),
	int iOption = getJCFOption (OPT_QUICK_KEY_NAVIGATION_MODE);
if ! nSettingFromFile then
	return SayMessage (OT_STATUS, cmsgQuickKeysAlreadyDisabled)
endIf
if iOption == 0 then
	iOption = nSettingFromFile
else
	iOption = 0
endIf
setJCFOption (OPT_QUICK_KEY_NAVIGATION_MODE, iOption)
if iOption == 0 then
	return sayMessage (OT_STATUS, cmsgQuickKeysSuspended)
else
	return sayMessage (OT_STATUS, cmsgQuickKeysResume)
endIf
EndScript

Script RepeatLastSkypeNotification ()
SkypeWatch::RepeatLastSkypeNotification ()
endScript

script RepeatLastNotification ()
var string notification = GetStoredNotificationText ()
if stringIsBlank (notification) then
	SayMessage (OT_ERROR, cmsgNoNotification)
else
	sayMessage (OT_USER_REQUESTED_INFORMATION, notification)
endIf
endScript

script ShowNotificationHistory (optional int invokedBy)
if g_NotificationManagerEnabled then
	ShowNotificationHistory(invokedBy)
else
	PerformScript RepeatLastNotification()
endIf
endScript

void function VirtualCursorSynchronizedEvent()
;Called when Outlook or another app moves the VPC to the location of the onscreen caret or cursor
var
string selectedText= GetSelectedText()
if GetObjectSubtypeCode()==wt_static then
	if selectedText!=cscNull then
		say(selectedText, OT_SCREEN_MESSAGE)
	else
		sayWord()
	endIf
else
	if selectedText!=cscNull then
		say(selectedText, OT_SCREEN_MESSAGE)
	else
		sayObjectTypeAndText()
	endIf
endIf
endFunction

globals int gbJAWSFindDialogIsRunning

int function JAWSFindDialogIsRunning()
return gbJAWSFindDialogIsRunning
EndFunction

int function JAWSFind(optional int bFindDirection)
; InHJDialog is false when JAWS find is searching,
; and variables InJAWSFind   and JAWSFindComplete are used
; for specific purposes that extend a short time beyond the actual running of the JAWSFind.
; Variable gbJAWSFindDialogIsRunning is true only during the time that the JAWSFind dialog is active.
var
	int result
let gbJAWSFindDialogIsRunning = true
let result = JAWSFind(bFindDirection)
let gbJAWSFindDialogIsRunning = false
return result
EndFunction

Void Function ApplicationRegionEvent(int enteringRegion)
;if virtual or pc cursor enters or leaves application region, this event is fired.
EndFunction

Void Function RegionBoundaryEvent(string regionType, int enteringRegion)
;if virtual cursor enters or leaves a region, this event is fired.
if (regionType != "details") then
	return
EndIf

;if (enteringRegion) then
	;SayMessage(ot_message, cmsgEnteringDetailsRegion)
;Else
	;SayMessage(ot_message, cmsgLeaving)
;EndIf
EndFunction

string function StringDeleteBlankFields(string sSource, string sFieldDelim)
var
	int FieldCount,
	int i,
	string s,
	string sResult
let FieldCount = StringSegmentCount(sSource,sFieldDelim)
For i = 1 to FieldCount
	let s = StringSegment(sSource,sFieldDelim,i)
	if !StringIsBlank(s) then
		sResult = StringConcatenate (sResult, s, sFieldDelim)
	EndIf
EndFor
return StringChopRight(sResult,StringLength(sFieldDelim))
EndFunction

string Function StringContainsCaseInsensitive(string s1, string s2)
s1 = StringLower (s1)
s2 = StringLower (s2)
return StringContains (s1, s2)
EndFunction

string Function StringConcatenate(string s1, string s2, optional string s3, string s4, string s5, string s6, string s7, string s8, string s9)
return FormatString ("%1%2%3%4%5%6%7%8%9", s1, s2, s3, s4, s5, s6, s7, s8, s9)
EndFunction

string Function StringCharAt(string s, int position)
if !position return Null() endIf
if position < 0
	position = position + StringLength(s) + 1
endIf
return SubString (s, position, 1)
EndFunction

script BraillepanRightBySegment()
var
int nOldPanMode
let nOldPanMode=getJCFOption(OPT_BRL_PAN_MODE)
setJCFOption(OPT_BRL_PAN_MODE, brlUserPanBySegment)
BraillepanRight()
setJCFOption(OPT_BRL_PAN_MODE,nOldPanMode)
endScript

script BraillePanLeftBySegment()
var
int nOldPanMode
let nOldPanMode=getJCFOption(OPT_BRL_PAN_MODE)
setJCFOption(OPT_BRL_PAN_MODE, brlUserPanBySegment)
BraillepanLeft()
setJCFOption(OPT_BRL_PAN_MODE,nOldPanMode)
endScript

int function SpeechHistoryWindowIsActive()
return ghWndResultsViewer
	&& GetWindowName(ghWndResultsViewer) == cmsgSpeechHistoryTitle
EndFunction

void function ShowTextInResultsViewer(string text, string title, bool isWindowActive)
if UserBufferIsActiveResultsViewer()
&& !isWindowActive then
	UserBufferDeactivateResultsViewer()
EndIf
UserBufferClearResultsViewer()
if !isWindowActive then
	UpdateResultsViewerTitle(title)
endIf
if text then
	UserBufferAddTextResultsViewer(text)
else
	UserBufferAddTextResultsViewer(HTML_EmptyDocument)
	let global_EmptyResultsViewerDocument = true
EndIf
if !isWindowActive then
	UserBufferActivate()
else
	if GetTopLevelWindow(GetFocus()) != ghWndResultsViewer then
		SetFocus(ghWndResultsViewer)
	EndIf
endIf
EndFunction

void function ShowSpeechHistoryInResultsViewer()
var string sText = StringTrimTrailingBlanks(GetSpeechHistory())
ShowTextInResultsViewer(sText, cmsgSpeechHistoryTitle, SpeechHistoryWindowIsActive())
EndFunction

script ShowSpeechHistory()
if !GetIntOptionUserSetting(Section_Options, hKey_SpeechHistory) then
	Say(cmsgSpeechHistoryNotAvailable,ot_error)
	return
EndIf
ShowSpeechHistoryInResultsViewer()
EndScript

script ClearSpeechHistory()
Say(cmsgClearSpeechHistory,ot_status)
ClearSpeechHistory()
EndScript

Script CopySpeechHistoryToClipboard()
if (!GetIntOptionUserSetting(Section_Options, hKey_SpeechHistory))
Say(cmsgSpeechHistoryNotAvailable, ot_error)
     return
EndIf
CopyToClipboard(StringTrimTrailingBlanks(GetSpeechHistory()))
Say(cmsgCopySpeechHistory, ot_status)
EndScript

void function ConfigurationChangedEvent(string newConfiguration)
if newConfiguration == "JawsDialog"
|| newConfiguration == "SettingsCenter" then
	if IsObjectNavigationActive() then
		SuspendObjectNavigation(true)
		SayUsingVoice(vctx_message,cmsgTouchCursorSuspended,ot_status)
	endIf
	globalPrevConfiguration = NewConfiguration
	return
endIf
if globalPrevConfiguration == "SettingsCenter" then
;some settings, such as Smart Navigation,may be modified by Settings Center
; without their new values be added into globals memory cache.
	QuickSettingsPostProcess ()
endIf
; Always load Smart navigation global variable as it can be application-specific:
SmartNavStart()
UpdateObjectNavigationMode(newConfiguration)
if IsTouchCursor() then
	SayMessage (ot_status, cmsgTouchCursor_L, cmsgTouchCursor_S)
EndIf
globalPrevConfiguration = NewConfiguration
; Personalized Settings when a domain set of settings is also in use:
CustomSettingsStart ()
EndFunction

script TouchCursor()
ActivateTouchCursor()
if IsTouchCursor() then
	SayMessage (ot_status, cmsgTouchCursor_L, cmsgTouchCursor_S)
EndIf
EndScript

script TouchTextReviewOn()
if IsObjectNavigationActive()
&& IsTouchCursor() then
	TurnOnTouchNavigationTextReview()
EndIf
EndScript

script TouchTextReviewOff()
if IsObjectNavigationActive()
&& !IsTouchCursor() then
	TurnOffTouchNavigationTextReview()
elif CurrentScriptWasInvokedByGesture()
	PerformScript UpALevel()
endIf
EndScript

script TouchTextReviewNext()
if IsObjectTextReviewModeActive() then
	TurnOffTouchNavigationTextReview()
	if !UsingTouchNavigationSounds() then
		SayMessage(ot_status, cmsgTouchTextReviewOff, cmsgTouchTextReviewOff)
	endIf
	if IsTouchNavigationModeActive() then
		PerformScript TouchNextElement()
	elif IsAdvancedObjectNavigationModeActive()
		PerformScript ObjectNavigateToNextSibling()
	endIf
EndIf
EndScript

script TouchTextReviewPrior()
if IsObjectTextReviewModeActive() then
	TurnOffTouchNavigationTextReview()
	if !UsingTouchNavigationSounds() then
		SayMessage(ot_status, cmsgTouchTextReviewOff, cmsgTouchTextReviewOff)
	endIf
	if IsTouchNavigationModeActive() then
		PerformScript TouchPriorElement()
	elif IsAdvancedObjectNavigationModeActive()
		PerformScript ObjectNavigateToPriorSibling()
	endIf
EndIf
EndScript

script AdvancedObjectNavigationModeToggle()
if IsAdvancedObjectNavigationModeActive() then
	UseAdvancedObjectNavigationMode(false)
	SayMessage(ot_status, cmsgAdvancedObjectNavigationOff_L, cmsgAdvancedObjectNavigationOff_S)
elif IsTouchNavigationModeActive() then
	UseAdvancedObjectNavigationMode(true)
	SayMessage(ot_status, cmsgAdvancedObjectNavigationOn_L, cmsgAdvancedObjectNavigationOn_S)
EndIf
EndScript

script ObjectNavigateToNextSibling()
UIAGoTo(TouchNavigate_NextSibling)
EndScript

script ObjectNavigateToPriorSibling()
UIAGoTo(TouchNavigate_PriorSibling)
EndScript

script ObjectNavigateToFirstChild()
UIAGoTo(TouchNavigate_FirstChild)
EndScript

script ObjectNavigateToParent()
UIAGoTo(TouchNavigate_Parent)
EndScript

script ShowUIAElementProperties()
UIASayElementProperties()
EndScript

script ShowUIAElementAndDescendantProperties()
ShowArrayOfUIAElementPropertiesForSubtree()
EndScript

script SayUIARect()
UIASayRect()
EndScript

script SayUIAPoint()
UIASayPoint()
EndScript

Script KillUIAObject()
KillUIAObject()
EndScript

script TouchGoToNextButton()
UIAGoToButton(true)
EndScript

script TouchGoToPriorButton()
UIAGoToButton(false)
EndScript

script TouchGoToNextRadioButton()
UIAGoToRadioButton(true)
EndScript

script TouchGoToPriorRadioButton()
UIAGoToRadioButton(false)
EndScript

script TouchGoToNextComboBox()
UIAGoToComboBox(true)
EndScript

script TouchGoToPriorComboBox()
UIAGoToComboBox(false)
EndScript

script TouchGoToNextDocument()
UIAGoToDocument(true)
EndScript

script TouchGoToPriorDocument()
UIAGoToDocument(false)
EndScript

script TouchGoToNextEdit()
UIAGoToEdit(true)
EndScript

script TouchGoToPriorEdit()
UIAGoToEdit(false)
EndScript

script TouchGoToNextFormControl()
UIAGoToFormControl(true)
EndScript

script TouchGoToPriorFormControl()
UIAGoToFormControl(false)
EndScript

script TouchGoToNextImage()
UIAGoToImage(true)
EndScript

script TouchGoToPriorImage()
UIAGoToImage(false)
EndScript

script TouchGoToNextHeading()
UIAGoToHeading(true)
EndScript

script TouchGoToPriorHeading()
UIAGoToHeading(false)
EndScript

script TouchGoToNextListItem()
UIAGoToListItem(true)
EndScript

script TouchGoToPriorListItem()
UIAGoToListItem(false)
EndScript

script TouchGoToNextHyperlink()
UIAGoToHyperlink(true)
EndScript

script TouchGoToPriorHyperlink()
UIAGoToHyperlink(false)
EndScript

script TouchGoToNextLandmark()
UIAGoToLandmark(true)
EndScript

script TouchGoToPriorLandmark()
UIAGoToLandmark(false)
EndScript

script TouchGoToNextList()
UIAGoToList(true)
EndScript

script TouchGoToPriorList()
UIAGoToList(false)
EndScript

script TouchGoToNextMenu()
UIAGoToMenu(true)
EndScript

script TouchGoToPriorMenu()
UIAGoToMenu(false)
EndScript

script TouchGoToNextToolBar()
UIAGoToToolBar(true)
EndScript

script TouchGoToPriorToolBar()
UIAGoToToolBar(false)
EndScript

script TouchGoToNextPane()
UIAGoToPane(true)
EndScript

script TouchGoToPriorPane()
UIAGoToPane(false)
EndScript

script TouchGoToNextTab()
UIAGoToTab(true)
EndScript

script TouchGoToPriorTab()
UIAGoToTab(false)
EndScript

script TouchGoToNextRegion()
UIAGoToRegion(true)
EndScript

script TouchGoToPriorRegion()
UIAGoToRegion(false)
EndScript

script TouchGoToNextStaticText()
UIAGoToStaticText(true)
EndScript

script TouchGoToPriorStaticText()
UIAGoToStaticText(false)
EndScript

script TouchGoToNextTable()
UIAGoToTable(true)
EndScript

script TouchGoToPriorTable()
UIAGoToTable(false)
EndScript

script TouchGoToNextGroup()
UIAGoToGroup(true)
EndScript

script TouchGoToPriorGroup()
UIAGoToGroup(false)
EndScript

script TouchGoToNextTree()
UIAGoToTree(true)
EndScript

script TouchGoToPriorTree()
UIAGoToTree(false)
EndScript

script TouchGoToNextCheckBox()
UIAGoToCheckBox(true)
EndScript

script TouchGoToPriorCheckBox()
UIAGoToCheckBox(false)
EndScript

script TouchGoToNextStatusBar()
UIAGoToStatusBar(true)
EndScript

script TouchGoToPriorStatusBar()
UIAGoToStatusBar(false)
EndScript

script InvalidTouchCursorAction()
NotifyNotAvailableForTouchCursor()
EndScript

void function UserBufferActivatedEvent()
SaveGestureMode()
SetGestureModeForTextReading()
if IsObjectNavigationActive()
&& !CurrentlyActivatingObjectTextReviewMode()
	SuspendObjectNavigation()
	SayUsingVoice(vctx_message,cmsgTouchCursorSuspended,ot_status)
endIf
EndFunction

void function UserBufferDeactivatedEvent()
RestoreGestureMode()
if IsObjectNavigationSuspended()
&& !CurrentlyDeactivatingObjectTextReviewMode()
	if IsObjectTextReviewModeSuspended()
		;resuming too quickly may result in an empty user buffer for the text review:
		ScheduleFunction("ResumeObjectNavigation",1)
	else
		ResumeObjectNavigation()
	endIf
endIf
EndFunction

script TouchSayCurrentElement()
TouchSayCurrentElement()
EndScript

script RouteTouchToFocus()
Say(cmsgRouteTouchToFocus,ot_status)
RouteTouchToFocus()
TouchSayCurrentElement()
EndScript

script TouchSetFocus()
UIASetFocus()
EndScript

script BrailleTouchTapCurrentElement(int x, int y)
if BrailleIsMessageBeingShown() then
	brailleClearMessage()
	return
endIf
; We know this was invoked by Braille routing, not a gesture.
; Thus we do not need the block testing CurrentScriptWasInvokedByGesture
TouchTapCurrentElement(x,y)
endScript

script TouchTapCurrentElement(int x, int y)
if CurrentScriptWasInvokedByGesture()
	var int mode = GetGestureMode()
	if mode == GestureMode_TextReading
		if IsObjectTextReviewModeActive()
			PlayTouchNavigationErrorSound()
			return
		elif UserBufferIsActive()
			PerformScript Enter()
			return
		EndIf
	endIf
endIf
TouchTapCurrentElement(x,y)
EndScript

script DoSecondaryActionForCurrentElement()
DoSecondaryActionForCurrentElement()
EndScript

script TouchTwoFingersSplitTap()
TouchTwoFingersSplitTap()
EndScript

script TouchTwoFingersSplitDoubleTap()
TouchTwoFingersSplitDoubleTap()
EndScript

script TouchSayCharacter()
if UserBufferIsActive() PerformScript SayCharacter() return endIf
if TrySplitTapForVirtualKeyboard() return endIf
if UIASayCharacterAtExploreLocation() return endIf
if !TouchExploreLocationHasFocus() TrySetFocusToElementAtExploreLocation() endIf
if !TouchExploreLocationHasFocus() PlayTouchNavigationErrorSound() return endIf
PerformScript SayCharacter()
EndScript

script TouchSayWord()
if UserBufferIsActive() PerformScript SayWord() return endIf
if TrySplitDoubleTapForVirtualKeyboard() return endIf
if UIASayWordAtExploreLocation() return endIf
if !TouchExploreLocationHasFocus() TrySetFocusToElementAtExploreLocation() endIf
if !TouchExploreLocationHasFocus() PlayTouchNavigationErrorSound() return endIf
PerformScript SayWord()
EndScript

script TouchNextElement()
TouchNextElement()
EndScript

script TouchPriorElement()
TouchPriorElement()
EndScript

script TouchMoveToFirstElement()
TouchMoveToFirstElement()
EndScript

script TouchMoveToLastElement()
TouchMoveToLastElement()
EndScript

script ObjectNavigateToFirstElementInProcessID()
TouchMoveToFirstElementInProcessID()
EndScript

script ObjectNavigateToLastElementInProcessID()
TouchMoveToLastElementInProcessID()
EndScript

script TouchMoveToNextElementByType()
TouchMoveToNextElementByType()
EndScript

script TouchMoveToPriorElementByType()
TouchMoveToPriorElementByType()
EndScript

script TouchChangeElementMovementPrior()
TouchChangeElementMovementType(0)
EndScript

script TouchChangeElementMovementNext()
TouchChangeElementMovementType(1)
EndScript

script TouchScrollLeft()
TouchScroll(Screen_Move_Left)
EndScript

script TouchScrollRight()
TouchScroll(Screen_Move_Right)
EndScript

script TouchScrollUp()
TouchScroll(Screen_Move_Up)
EndScript

script TouchScrollDown()
TouchScroll(Screen_Move_Down)
EndScript

script TouchCloseApp()
TouchCloseApp()
EndScript

script TouchSayAll()
;This version of SayAll uses UIA to read through all UIA elements,
;rather than performing a traditional SayAll which reads all text of a single control.
TouchSayAll()
EndScript

script GestureSayAll()
;This version of SayAll performs the traditional SayAll which reads all text of a control,
;unlike the TouchSayAll which uses UIA to read through all UIA elements.
;This version of SayAll is only valid for text reading gesture mode.
if !GestureModeIsTextReading() return endIf
;The element must have focus for SayAll to perform:
if !TouchExploreLocationHasFocus()
	TrySetFocusToElementAtExploreLocation()
	if !TouchExploreLocationHasFocus()
		PlayTouchNavigationErrorSound()
		return
	endIf
endIf
PerformScript SayAll()
EndScript

script TouchStopCurrentSpeechOutput()
TouchStopCurrentSpeechOutput()
EndScript

script TouchExplore(int x, int y)
TouchExplore(x,y)
EndScript

script TouchExploreEnded(int x, int y)
if SayAllInProgress()
	return
endIf
TouchExploreEnded(x,y)
EndScript

script TouchRightClick()
TouchRightClick()
EndScript

script SetGestureModeNext()
CycleAvailableGestureMode(true)
AnnounceCurrentGestureMode()
EndScript

script SetGestureModePrior()
CycleAvailableGestureMode(false)
AnnounceCurrentGestureMode()
EndScript

script TrySetGestureModeForTextReading()
if SetGestureModeForTextReading()
	AnnounceCurrentGestureMode()
else
	PlayTouchNavigationErrorSound()
endIf
EndScript

script GestureListHelp()
ShowGestureListHelp()
EndScript

script GestureContextHelp()
if GetLastInputSource() == InputSource_Touch
&& GestureModeIsSpeechSettings()
	return
endIf
EnsureNoUserBufferActive()
UserBufferAddText(GetTouchContextHelpMessage())
UserBufferAddLink(
	FormatString(cmsgGestureCommandListLink,GetGestureLabel(GetGestureName("GestureListHelp"))),
	"ShowGestureListHelp()")
UserBufferActivate()
JAWSTopOfFile()
SayAll()
EndScript

script EnableSemanticZoom()
if GetLastInputSource() == InputSource_Touch
&& GestureModeIsSpeechSettings()
	return
endIf
var int toggle = SetSemanticZoom(true)
if !toggle
	PlayTouchNavigationErrorSound()
endIf
EndScript

script DisableSemanticZoom()
if GetLastInputSource() == InputSource_Touch
&& GestureModeIsSpeechSettings()
	return
endIf
var int toggle = SetSemanticZoom(false)
if !toggle
	PlayTouchNavigationErrorSound()
endIf
EndScript

script GestureToggleTextReview()
GestureToggleTextReview()
EndScript

script GestureRunJAWSManager()
if !GestureModeIsTouchNavigation()
	SetGestureModeForTouchNavigation()
endIf
PerformScript RunJAWSManager()
endScript

script GestureJAWSWindow()
if !GestureModeIsTouchNavigation()
	SetGestureModeForTouchNavigation()
endIf
PerformScript JAWSWindow()
EndScript

script GestureShutDownJAWS()
if !GestureModeIsTouchNavigation()
	SetGestureModeForTouchNavigation()
endIf
PerformScript ShutDownJAWS()
EndScript

script GestureF6()
TypeKey(cksF6)
EndScript

script GestureShiftF6()
TypeKey(cksShiftF6)
EndScript

script GestureEscape()
var int mode = GetGestureMode()
if mode == 	GestureMode_TouchNavigation
	PerformScript UpALevel()
	TouchNavNotifyByPlayOrSay(GetGestureEscapeSoundFileName(),ot_JAWS_message,cmsgGestureAction_Escape)
elif mode == GestureMode_TextReading
	PerformScript TouchTextReviewOff()
	;script has its own logic for play sound or say message
endIf
;Nothing happens for the speech settings mode.
EndScript

script GestureCloseApp()
var int mode = GetGestureMode()
if mode == 	GestureMode_TouchNavigation
|| mode == GestureMode_TextReading
	PerformScript TouchCloseApp()
	TouchNavNotifyByPlayOrSay(GetGestureCloseAppSoundFileName(),ot_JAWS_message,cmsgGestureAction_CloseApp)
endIf
;Nothing happens for the speech settings mode.
EndScript

script GestureToggleTouchCursor()
if !GestureModeIsSpeechSettings()
	PlayTouchNavigationErrorSound()
	return
endIf
if IsObjectNavigationActive() then
	PerformScript PCCursor ()
else
	PerformScript TouchCursor()
endIf
;To allow the script to act like a toggle in speech settings gesture mode,
;make sure gesture mode is now set to speech,
;since toggling touch nav on or off may automatically change the gesture mode.
SetGestureModeForSpeechSettings()
EndScript

script TouchQuickNavEnableToggle()
SetTouchQuickKeyNavigationMode(!IsTouchQuickNavEnabled())
;This script is expected to run only if touch cursor is active,
;but we add the case of someone running it when touch cursor is not active.
if IsTouchCursor()
	if IsTouchQuickNavActive()
		Say(cmsgTouchQuickNavActive,ot_status)
	else
		Say(cmsgTouchQuickNavInactive,ot_status)
	endIf
else ;touch cursor is off:
	if IsTouchQuickNavEnabled()
		Say(cmsgTouchQuickNavEnabled,ot_status)
	else
		Say(cmsgTouchQuickNavDisabled,ot_status)
	EndIf
EndIf
EndScript

Script FHPBraillexELCDirectStart1 ()
	FHPBraillexELCDirectStart(1)
EndScript

Script FHPBraillexELCDirectStart2 ()
	FHPBraillexELCDirectStart(2)
EndScript

Script FHPBraillexELCDirectStart3 ()
	FHPBraillexELCDirectStart(3)
EndScript

Script FHPBraillexELCDirectStart4 ()
	FHPBraillexELCDirectStart(4)
EndScript

Script FHPBraillexELCDirectStartInit ()
	FHPBraillexELCDirectStartInit()
EndScript

Script TextViewerToggle ()
if ! (GetRunningFSProducts () & product_MAGic) then
	SayMessage (OT_ERROR, cmsgTextViewerNotAvailable)
endIf
var int textViewerOn = ToggleTextViewer()
if textViewerOn then
	SayMessage (OT_STATUS, cMsgTextViewerEnabled)
else
	SayMessage (OT_STATUS, cmsgTextViewerDisabled)
endIf
endScript

Script SwitchMonitorTextViewer ()
SwitchTextViewerMonitor()
endScript

Script ToggleTextViewerPosition ()
SwitchTextViewerPosition()
endScript

Script PanLeftTextViewer ()
PanTextLeft()
endScript

Script PanRightTextViewer ()
PanTextRight()
endScript

Script LaunchCommandsSearch()
if IsTouchCursor() then
	g_WasTouchCursorActiveBeforeJAWSSearch = ON
	ExitTouchNavigation ()
endIf
g_VirtualPCCursorSettingBeforeJAWSSearch = GetJCFOption (OPT_VIRTUAL_PC_CURSOR)
if g_VirtualPCCursorSettingBeforeJAWSSearch != 1
 	SetJcfOption (OPT_VIRTUAL_PC_CURSOR, 1)
endIf
LaunchCommandsSearchViewer()
EndScript

int function stringsMatchExcludingWhitespace(string s1, string s2)
var
string s1WhitespaceRemoved,
string s2WhitespaceRemoved

s1WhitespaceRemoved=StringRemoveCharsInRange(s1, 9, 32)
s2WhitespaceRemoved=StringRemoveCharsInRange(s2, 9, 32)

return s1WhitespaceRemoved==s2WhitespaceRemoved
endFunction

int function StringEndsWith(string first, string second, optional int caseSensitive)
var int firstLength = StringLength(first)
var int secondLength = StringLength(second)
if (firstLength == secondLength)
   return (StringCompare(first, second, caseSensitive) == 0)
endIf
if (firstLength < secondLength)
   return false
endIf
var string test = StringRight(first, secondLength)
return (StringCompare(test, second, caseSensitive) == 0)
endFunction

Void Function SayObjectActiveItemWithDescription (optional int AnnouncePosition)
SayObjectActiveItem (announcePosition)
SayObjectDescription(true)
EndFunction

int Function SayObjectDescription(optional int suppressDuplication, optional int level)
var
	string name = GetObjectName(SOURCE_CACHED_DATA, level),
	string description = GetObjectDescription(SOURCE_CACHED_DATA, level)

if StringLength (description) == 0 then
	return false
EndIf

if suppressDuplication
	; Make sure name and desc are not the same (excluding whitespace)
	if stringsMatchExcludingWhitespace(name, description)
		return false
	EndIf

	;make sure description doesn't start with name
	if (StringStartsWith (description, name, false)) then
		return false
	EndIf

	; Make sure the name doesn't end with the description. This is necessary for
	; list view items in SysListview32 windows. In these windows the
	; CAccessibleObjectInfo::Name function will append the list item description to
	; the name. If we do not include this test, there will be double speaking when
	; speaking of the OT_CONTROL_DESCRIPTION output type is enabled.
	if (StringEndsWith(name, description, false))
		return false
	EndIf
endIf

Say(description, OT_CONTROL_DESCRIPTION, false)
return true
EndFunction

void function SelectionRectChangedEvent(int newLeft, int newTop, int newRight, int newBottom, int oldLeft, int oldTop, int oldRight, int oldBottom, int navUnit)
; This event is called when the selCtxSelectionRect flag is set in MSWord when navigating or selecting text.
;It is primarily used for MAGic.
; Note this event is called before any other Selection Context events.
MagSetFocusToRect (newLeft, newRight, newTop, newBottom, MTO_CARET)
EndFunction

int function StringIsAlpha(string s)
return StringLength(s) > 0
	&& (StringRemoveCharsInRange(StringRemoveCharsInRange(s,65,90),97,122) == cscNull)
endFunction

int function StringIsPunctuation(string s)
return StringLength(s) > 0
	&& (StringRemoveCharsInRange(StringRemoveCharsInRange(StringRemoveCharsInRange(StringRemoveCharsInRange(s,33,47),58,64),91,96),123,126) == cscNull)
endFunction

int function StringIsNumeric(string s)
return StringLength(s) > 0
&& (StringRemoveCharsInRange(s,48,57) == cscNull)
endFunction

void function BrailleOnlyRegionBoundaryEvent(int entering, int unit)
var
int oldFlashMessages
if entering then
	let oldFlashMessages=getJCFOption(OPT_BRL_MESSAGES)
	setJCFOption(OPT_BRL_MESSAGES,0) ; Do not flash this message!
	SayFormattedMessageWithVoice (VCTX_MESSAGE, ot_help, cmsgEnteringBrlOnlyRegion_l, cmsgEnteringBrlOnlyRegion_s)
	SetJCFOption(OPT_BRL_MESSAGES,oldFlashMessages)
endIf
;No need to indicate when exiting since regular reading will resume.
endFunction

stringArray function StringArrayCompact(stringArray arrayParam)
var
	int l = ArrayLength(arrayParam),
	stringArray a,
	int i,
int n,
	int j
for i = 1 to l
	if arrayParam[i] != cscNull n = n+1 endIf
endFor
if !n return Null() endIf
a = new StringArray[n]
j = 1
for i = 1 to l
	if arrayParam[i] != cscNull
		a[j] = arrayParam[i]
j = j+1
	endIf
endFor
return a
endFunction

stringArray function StringArrayConcat(stringArray arrayParam1, stringArray arrayParam2, optional int bCompact)
var
	stringArray a1, int l1,
	stringArray a2, int l2,
	stringArray a, int l, int i
if bCompact
	a1 = StringArrayCompact(arrayParam1)
	a2 = StringArrayCompact(arrayParam2)
else
	a1 = arrayParam1
	a2 = arrayParam2
endIf
l1 = ArrayLength(a1)
l2 = ArrayLength(a2)
l = l1+l2
a = new stringArray[l]
for i =1 to l1
	a[i] = a1[i]
endFor
for i = l1+1 to l
	a[i] = a2[i-l1]
endFor
return a
EndFunction

string Function StringJoin(stringArray sArray, optional string sDelimiter)
var
	int iArrayLength = ArrayLength (sArray),
	string sString,
	int i
For i = 1 to iArrayLength
	sString = StringConcatenate (sString, sArray[i], sDelimiter)
EndFor
return stringChopRight (sString, StringLength(sDelimiter))
EndFunction

string Function StringSegmentReplace(string sString, string sDelimiter, int iIndex, string sReplacement)
var int iSegmentCount = StringSegmentCount (sString, sDelimiter)
if abs (iIndex) > iSegmentCount return sString endIf
var stringArray sArray = StringSplit (sString, sDelimiter, false)
if iIndex < 0
	iIndex = iSegmentCount + iIndex + 1
endIf
sArray[iIndex] = sReplacement
return StringJoin(sArray, sDelimiter)
EndFunction

string Function StringSegmentRemove(string sString, string sDelimiter, int iIndex)
var int iSegmentCount = StringSegmentCount (sString, sDelimiter)
if abs (iIndex) > iSegmentCount return sString endIf
var
	stringArray sArray = StringSplit (sString, sDelimiter, false),
	stringArray sNewArray,
	int i,
	int j = 1
if iIndex < 0
	iIndex = iSegmentCount + iIndex + 1
endIf
sNewArray = new stringArray[iSegmentCount-1]
for i = 1 to iSegmentCount
	if i != iIndex
		sNewArray[j] = sArray[i]
		j = j + 1
	endIf
EndFor
return StringJoin(sNewArray, sDelimiter)
EndFunction

string Function StringRemoveNonNumericChars(string s)
s = StringRemoveCharsInRange (s, 0x01, 0x2f)
s = StringRemoveCharsInRange (s, 0x3a, 0xffff)
return s
EndFunction

string Function StringRemoveNumericChars(string s)
return StringRemoveCharsInRange (s, 0x30, 0x39)
EndFunction

string Function StringRemoveNonAlphanumericChars(string s)
s = StringRemoveCharsInRange (s, 0x01, 0x2f)
s = StringRemoveCharsInRange (s, 0x3a, 0x40)
s = StringRemoveCharsInRange (s, 0x5b, 0x60)
s = StringRemoveCharsInRange (s, 0x7b, 0xffff)
return s
EndFunction

string Function StringRemoveNonAlphaChars(string s)
s = StringRemoveCharsInRange (s, 0x01, 0x40)
s = StringRemoveCharsInRange (s, 0x5b, 0x60)
s = StringRemoveCharsInRange (s, 0x7b, 0xffff)
return s
EndFunction

string Function StringRemoveAlphaChars(string s)
s = StringRemoveCharsInRange (s, 0x41, 0x5a)
s = StringRemoveCharsInRange (s, 0x61, 0x7a)
return StringRemoveCharsInRange (s, 0x30, 0x39)
EndFunction

string Function StringRemovePrivateUseChars(string s)
s = StringRemoveCharsInRange (s, 57344, 63743);Private Use Area
s = StringRemoveCharsInRange (s, 983040, 1048573);Supplementary Private Use Area-A
s = StringRemoveCharsInRange (s, 1048576, 1114109);Supplementary Private Use Area-B
return s
EndFunction

string Function StringRemoveZeroWidthSpaceChars(string s)
s = StringRemoveCharsInRange (s, 0x200b, 0x200d);zero width space, zero width non-joiner, and zero width joiner
s = StringRemoveCharsInRange (s, 0x2060, 0x2060);word joiner
s = StringRemoveCharsInRange (s, 0xfeff, 0xfeff);zero width no-break space
return s
EndFunction

string Function StringRemoveControlChars(string s)
s = StringRemoveCharsInRange (s, 0x00, 0x1f);C0
s = StringRemoveCharsInRange (s, 0x7f, 0x7f);delete
s = StringRemoveCharsInRange (s, 0x80, 0x9f);C1
return s
EndFunction

script GestureToggleShowTouchKeyboard()
ToggleShowTouchKeyboard()
EndScript

Script VirtualRibbonToggle()
if GetMenuMode()
|| RibbonsActive()
	Say(cmsgNotAvailableInRibbonsOrMenus_error,ot_error)
	return
endIf
var
	handle hFocus,
	string sApp
hFocus = GetFocus()
sApp = GetWindowOwner(hFocus)
sApp = StringSegment(sApp,cScDoubleBackSlash,StringSegmentCount(sApp,cScDoubleBackSlash))
if (InHJDialog() && StringStartsWith(GetWindowName(GetTopLevelWindow(hFocus)),"QuickSettings"))
|| StringStartsWith(sApp,"SettingsCenter")
	Say(cmsgNotAvailableInQuickSettingsOrSettingsCenter_Error,ot_error)
	return
endIf
;Get the current value,
;and set to the opposite state in memory for both the default and the app-specific,
;just in case there is an app-specific setting in the JCF file.
var int setting = !(GetJCFOption (OPT_VIRTUAL_RIBBON_SUPPORT))
SetDefaultJCFOption(OPT_VIRTUAL_RIBBON_SUPPORT,setting)
SetJCFOption(OPT_VIRTUAL_RIBBON_SUPPORT,setting)
if setting
	SayMessage(ot_status,cmsgVRStatus_On_L)
else
	SayMessage(ot_status,cmsgVRStatus_Off_L)
endIf
EndScript

void function ShiftedCharacterPressedWithCapsLockEvent()
PlaySound(FindJAWSSoundFile("CapsLockWithShiftWarning.wav"))
EndFunction

function TableRowChangedEvent(int oldRow, int newRow)
;Called when arrowing left or right at a row extremity to allow scripts to indicate that the cursor has wrapped to the prior or next table row.
var
string sMessage
if newRow > oldRow then
	playSound(FindJAWSSoundFile("Ascend.wav"))
else
	playSound(FindJAWSSoundFile("descend.wav"))
endIf
if gbDefaultVCursorCellCoordinatesAnnouncement then
	let sMessage = FormatString (cmsgRowHeader, IntToString (newRow))
	SayUsingVoice (VCTX_message, sMessage, ot_position)
endIf
endFunction

Script SmartNavToggle ()
ToggleSmartNavLevelAndResetDocPresentation ()
endScript

void function SpeakMagicEnhancementScheme ()
var string scheme = iniReadStringEx ("scheme", globalEnhancementSchemeType, "", FLOC_USER_SETTINGS, "Default.mcf")
if stringIsBlank (scheme) then
;then we have not updated for some reason.
	scheme = iniReadStringEx ("scheme", globalEnhancementSchemeType, "", FLOC_SHARED_SETTINGS, "Default.mcf")
endIf
if scheme && stringContains (scheme, "+") then
; scheme name from file is tokenized in two segments containing the name and the type.
	scheme = stringSegment (scheme, "+",
		(StringSegmentCount (scheme, "+")-1)
	)
endIf
if ! StringIsBlank (scheme) then
	say (scheme, ot_status)
endIf
endFunction

Script SwitchToNextMouseEnhancementScheme ()
unscheduleFunction (GlobalSpeakEnhancementsTimer)
SwitchToNextMouseScheme ()
globalEnhancementSchemeType = MouseEnhancementScheme
GlobalSpeakEnhancementsTimer = ScheduleFunction ("SpeakMagicEnhancementScheme", 1)
endScript

Script SwitchToPriorMouseEnhancementScheme ()
unscheduleFunction (GlobalSpeakEnhancementsTimer)
SwitchToPriorMouseScheme ()
globalEnhancementSchemeType = MouseEnhancementScheme
GlobalSpeakEnhancementsTimer = ScheduleFunction ("SpeakMagicEnhancementScheme", 1)
endScript

Script SwitchToNextCursorEnhancementScheme ()
unscheduleFunction (GlobalSpeakEnhancementsTimer)
SwitchToNextCursorScheme ()
globalEnhancementSchemeType = CursorEnhancementScheme
GlobalSpeakEnhancementsTimer = ScheduleFunction ("SpeakMagicEnhancementScheme", 1)
endScript

Script SwitchToPriorCursorEnhancementScheme ()
unscheduleFunction (GlobalSpeakEnhancementsTimer)
SwitchToPriorCursorScheme ()
globalEnhancementSchemeType = CursorEnhancementScheme
GlobalSpeakEnhancementsTimer = ScheduleFunction ("SpeakMagicEnhancementScheme", 1)
endScript

Script SwitchToNextColorEnhancementScheme ()
unscheduleFunction (GlobalSpeakEnhancementsTimer)
SwitchToNextColorScheme ()
globalEnhancementSchemeType = ColorEnhancementScheme
GlobalSpeakEnhancementsTimer = ScheduleFunction ("SpeakMagicEnhancementScheme", 1)
endScript

Script SwitchToPriorColorEnhancementScheme ()
unscheduleFunction (GlobalSpeakEnhancementsTimer)
SwitchToPriorColorScheme ()
globalEnhancementSchemeType = ColorEnhancementScheme
GlobalSpeakEnhancementsTimer = ScheduleFunction ("SpeakMagicEnhancementScheme", 1)
endScript

Script ToggleDefaultUserMode()
var
	int currentMode,
	int newMode
currentMode = GetAlternateUserDirectoryMode()
newMode = AlternateUserDirMode_Default
if (currentMode != AlternateUserDirMode_Off)
	newMode = AlternateUserDirMode_Off
endIf
SetAlternateUserDirectoryMode(newMode)
endScript

Void Function AlternateUserDirectoryModeChangedEvent()
var
	int currentMode,
	string longMessage,
	string shortMessage
currentMode = GetAlternateUserDirectoryMode()
if (currentMode == AlternateUserDirMode_Default)
	longMessage = cmsgDefaultAlternateUserDirectoryMode_L
	shortMessage = cmsgDefaultAlternateUserDirectoryMode_S
elif (currentMode == AlternateUserDirMode_Roam)
	longMessage = cmsgRoamAlternateUserDirectoryMode_L
	shortMessage = cmsgRoamAlternateUserDirectoryMode_S
else
	longMessage = cmsgAlternateUserDirectoryModeOff_L
	shortMessage = cmsgAlternateUserDirectoryModeOff_S
endIf
SayMessage(ot_status, longMessage, shortMessage)
EndFunction

int function sayConnectionStatusInfoWindows11 ()
Var
	Int TrayIconsCount,
	Int i,
	Handle hTop = FindTopLevelWindow (cwc_ShellNotify, Null ()),
	Handle hTool = FindWindow (hTop, Windows11SysTrayIconsClass),
	Object window = FSUIAGetElementFromHandle (hTool),
	object trayIcons, object trayIcon,
	String Name
if ! hTool || ! window return FALSE endIf
var object condition = FSUIACreateStringPropertyCondition(UIA_AutomationIdPropertyId,
	UIA_AutomationID_Windows_11_Tray_Icon)
if ! condition return FALSE endIf
trayIcons = window.FindAll(TreeScope_Subtree, condition)
if ! TrayIcons || ! TrayIcons.count return FALSE endIf
TrayIconsCount = TrayIcons.count
For i = 0 To TrayIconsCount-1
	trayIcon = trayIcons(i)
	Name = trayIcon.name
	If StringContains (Name, csc_Network)
	|| StringContains (Name, csc_Access)
	|| StringContains (Name, csc_Connected)
		Say (Name, OT_USER_REQUESTED_INFORMATION)
		return TRUE
	EndIf
EndFor
return FALSE
endFunction

void function sayConnectionStatusInfo ()
if sayConnectionStatusInfoWindows11 () return endIf
Var
	Int iChild,
	Int i,
	Handle hTop = FindTopLevelWindow (cwc_ShellNotify, Null ()),
	Handle hTool = FindWindowWithClassAndId (hTop, cwc_ShellNotifyToolBar, cID_ShellNotifyToolBar),
	Object oTool = GetObjectFromEvent (hTool, OBJID_CLIENT, 0, iChild),
	String sName
if oTool == null () then
;The parent is also a tool bar without a relevant MSAA object.
	hTool = getParent (hTool)
	hTool = FindWindow (hTool, "SysPager")
	hTool = FindWindowWithClassAndId (hTool, cwc_ShellNotifyToolBar, cID_ShellNotifyToolBar)
	oTool = GetObjectFromEvent (hTool, OBJID_CLIENT, 0, iChild)
endIf
For i = 1 To oTool.accChildCount
	sName = oTool.accName (i)
	If StringContains (sName, csc_Network)
	|| StringContains (sName, csc_Access)
	|| StringContains (sName, csc_Connected)
		Say (sName, OT_USER_REQUESTED_INFORMATION)
	EndIf
EndFor
endFunction

Script SayConnectionStatus ()
If Not IsSameScript ()
	SayBatteryLevelInfo ()
	Return
EndIf
sayConnectionStatusInfo ()
EndScript

int function RouteTouchToJAWS()
var int x, int y
GetCursorPos(CURSOR_JAWS,smmPixels,x,y)
if !x && !y return false endIf
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
var object element = oUIA.GetElementFromPoint(X,Y).BuildUpdatedCache()
if !element return false endIf
if IsJAWSCursor() then PCCursor() endIf
ActivateTouchCursor()
SetTouchNavigationMode(2) ;ObjectNavigation_Advanced
g_UIATreeWalker.currentElement = element
BrailleRefresh()
return true
EndFunction

int function RouteJAWSToTouch()
var int x, int y
UIAGetPoint(x,y)
;x or y can be negative if the element is off screen:
if x<=0 || y<=0 return false endIf
if IsTouchCursor() ExitTouchNavigation() endIf
JAWSCursor()
MoveTo(x,y)
return true
EndFunction

script RouteTouchCursorToJAWS()
if !RouteTouchToJAWS()
	Beep()
	return
endIf
SayMessage(ot_status,cmsgRouteTouchToJAWS_L,cmsgRouteTouchToJAWS_S)
EndScript

script RouteJAWSCursorToTouch()
if !RouteJAWSToTouch()
	Beep()
	return
endIf
SayMessage(ot_status,cmsgRouteJAWSToTouch_L,cmsgRouteJAWSToTouch_S)
EndScript

script RouteTouchToMouse()
if !RouteTouchToJAWS()
	Beep()
	return
endIf
SayMessage(ot_status,cmsgRouteTouchToMouse_L,cmsgRouteTouchToMouse_S)
EndScript

script RouteMouseToTouch()
if !RouteJAWSToTouch()
	Beep()
	return
endIf
SayMessage(ot_status,cmsgRouteMouseToTouch_L,cmsgRouteMouseToTouch_S)
EndScript

void function ClearRect(int byRef left, int byRef top, int byRef right, int byRef bottom)
left = 0
top = 0
right = 0
bottom = 0
EndFunction

Script PassThroughNextGesture()
Say(cmsgPassThroughNextGesture,ot_JAWS_message)
SetPassThroughNextGesture(1)
EndScript

Script TogglePerModeGestures ()
gbPerModeGesturesEnabled = !gbPerModeGesturesEnabled
EnablePerModeGestures(gbPerModeGesturesEnabled)
if (gbPerModeGesturesEnabled)
	SayMessage(ot_Status,cmsgJAWSHandlesGestures_L,cmsgJAWSHandlesGestures_S)
else
	SayMessage(ot_Status,cmsgWindowsHandlesGestures_L,cmsgWindowsHandlesGestures_S)
endIf
EndScript

script AnnounceCurrentGestureModeAsError()
;To handle scenarios where the call is from a continuous gesture,
;schedule the announcement to occur only once:
ScheduleAnnounceCurrentGestureModeAsError()
EndScript

script ToggleAudioDucking()
if !IsWindows8()
	Say(msgAudioDuckingOSError,ot_error)
	return
endIf

; To avoid every random write to the default JCF file resetting this setting,
; we save this setting as a transient setting.
var int setting = GetJCFOption(OPT_LOWER_OTHER_APPS_VOLUME)
if setting
	Say(msgAudioDucking_Off,ot_status)
	SetDefaultJCFOption(OPT_LOWER_OTHER_APPS_VOLUME,Off)
	WriteSettingInteger (Section_Options, hKey_LowerAppVolumeWhileJAWSIsRunning, 0, FT_DEFAULT_JCF, wdSession)
	if GlobalAudioDuckingDisabledByRouting == 1 then
		GlobalAudioDuckingDisabledByRouting = 0
	endIf
else
	if GlobalAudioIsRouted == 1 then
			Say(cMsgAudioDuckingDisabledByRoutingError, ot_error)
	else
		SetDefaultJCFOption(OPT_LOWER_OTHER_APPS_VOLUME,On)
		WriteSettingInteger (Section_Options, hKey_LowerAppVolumeWhileJAWSIsRunning, 1, FT_DEFAULT_JCF, wdSession)
		Say(msgAudioDucking_On,ot_status)
	endIf
endIf
EndScript

object function CreateXMLDomDoc()
var object XMLDomDoc
XMLDomDoc = CreateObject("msxml2.DOMDocument.6.0")
if (!XMLDomDoc) return Null() EndIf
XMLDomDoc.async = false
XMLDomDoc.resolveExternals = false
return XMLDomDoc
EndFunction

int function LoadAndParseXML(object XMLDomDoc, string XML)
XMLDomDoc.loadXML(xml)
If XMLDomDoc.parseError.errorCode
	return false
endIf
return true
EndFunction

object function GetFSXMLDomDoc(optional string byRef XMLString)
var object XMLDomDoc = CreateXMLDomDoc()
if !XMLDomDoc return Null() EndIf
XMLString = cscNull
var string xml = getDocumentXML()
if !xml return Null() endIf
XMLString = XML
LoadAndParseXML(XMLDomDoc,XML)
return XMLDomDoc
EndFunction

object function GetFSXMLDomDocUnrestricted(optional string byRef XMLString)
var object XMLDomDoc = CreateXMLDomDoc()
if !XMLDomDoc return Null() EndIf
XMLString = cscNull
var string xml = getDocumentXMLUnrestricted()
if !xml return Null() endIf
XMLString = XML
LoadAndParseXML(XMLDomDoc,XML)
return XMLDomDoc
EndFunction

object function GetFSXMLElementNode(optional int AncestorCount)
var object XMLDomElement = CreateXMLDomDoc()
if !XMLDomElement return Null() endIf
var string xml = getElementXML(AncestorCount)
if !xml return Null() endIf
if !LoadAndParseXML(XMLDomElement,XML) return Null() endIf
var object node = XMLDomElement.SelectSingleNode("/*")
return node
endFunction

string function GetStateInfoFromXMLDomNodeAttributes(object attribs)
if !attribs return cscNull endIf
if attribs.GetNamedItem("aria-disabled").nodeValue=="true"
	return cMsgNotAvailable ; grayed
endIf
if attribs.GetNamedItem("aria-selected").nodeValue=="true"
	return cmsg215_L ; selected
elif attribs.GetNamedItem("aria-pressed").nodeValue=="true"
	return cmsgPressedGraphic1_L ; pressed
elif attribs.GetNamedItem("aria-checked").nodeValue=="true"
|| (attribs.GetNamedItem("checkable").nodeValue == "true" && attribs.GetNamedItem("checked").nodeValue =="true")
	return cMSG_checked ; checked
elif attribs.GetNamedItem("aria-checked").nodeValue=="false"
|| (attribs.GetNamedItem("checkable").nodeValue == "true" && attribs.GetNamedItem("checked").nodeValue =="false")
	return cmsg_notchecked ; not checked
else
	return cscNull
endIf
endFunction

string function GetTextFromXMLDomTextChildNodes(object node)
if !node return cscNull endIf
;node.nodeValue may retrieve too much information,
;since it may retrieve text from all descendants.
;This gets the text from any text child nodes.
var object nodes = node.childNodes
if !nodes return cscNull endIf
var object o, string s, string text
forEach o in nodes
	if o.nodeType == XML_TEXT_NODE
		s = o.text
		if !StringIsBlank(s)
			text = text+s+cscBufferNewLine
		endIf
	endIf
endForEach
return StringChopRight(text,1)
EndFunction

string function GetXMLDomNodeText(object node)
if !node return cscNull endIf
var string text = GetTextFromXMLDomTextChildNodes(node)
if !text
	text = node.text
endIf
if StringIsBlank(text)
	text = node.attributes.GetNamedItem("fsText").nodeValue
endIf
return text
EndFunction

string function GetXMLDomNodeID(object node)
if !node return cscNull endIf
return node.attributes.GetNamedItem("id").nodeValue
EndFunction

string function GetXMLDomNodeFSID(object node)
if !node return cscNull endIf
return node.attributes.GetNamedItem("fsID").nodeValue
EndFunction

string function GetXMLNodeTypeString(object node)
if !node return cscNull endIf
return GetControlTypeName(node.attributes.GetNamedItem("fsType").nodeValue)
EndFunction

string function GetXMLDomNodeTypeAndText(object node)
if !node return cscNull endIf
var
	string typeString,
	string state,
	string text,
	int type
type = node.attributes.GetNamedItem("fsType").nodeValue
typeString = GetControlTypeName(type)
state = GetStateInfoFromXMLDomNodeAttributes(node.attributes)
text = GetXMLDomNodeText(node)
if type == wt_edit
|| type == wt_multiline_edit
	return state+cscSpace+typeString+cscSpace+text
endIf
return text+cscSpace+typeString+cscSpace+state
EndFunction

int function ShouldProcessLiveRegion(string text, string attribs)
; Note: this gets called prior to sending to Braille or speech queue.
; Override this to filter out live regions based on text or attributtes.
; return TRUE if you want the live region to be processed, FALSE to ignore it.
return TRUE
endFunction

void function BrailleLiveRegionEventText (string text, int OutputType)
if ! ShouldItemBraille (OutputType)
|| stringIsBlank (text) then
	return ; no blank messages.
endIf
var string StatusCellsMessage = GetOutputModeName (OutputType, OutputToBrailleDevice)
handleSetBrailleMessageStatusText (StatusCellsMessage)
handleBrailleMessage(text,ShouldAppendFlashMessage())
endFunction

int function SpeakLiveRegionEvent(string text, int suggestedOutputType, int containsSpeechMarkup)
; Note: this gets called at the time the speech queue element is spoken.
; You may override the Output type but do not Flash this in Braille if structured mode is enabled
;as it may be presented in the structured data.
; return true if we speak from here, false to defer to internals.
; Update Braille display as a help balloon, because screenMessage doesn't show in Braille.
var string appName = GetAppFileNameWithoutExtension()
var collection notificationRuleActions = ProcessNotification(smmStripMarkup(text), appName)
if !notificationRuleActions.ExcludeFromNotificationHistory then
 	StoreSpokenNotificationForRepeat (smmStripMarkup(text), appName)
endIf
 if StringCompare(notificationRuleActions.SpeechActionType, NotificationProcessing_GlobalActionNoAction) == 0 then
 	notificationRuleActions.SpeechActionParameter = text
 elif StringCompare(notificationRuleActions.SpeechActionType, NotificationProcessing_SpeechActionShortenSpeechMessage) == 0 then
 	var string languageCode = ExtractLanguageCodeFromMarkup(text)
 	if !StringIsBlank(languageCode) then
 		notificationRuleActions.SpeechActionParameter = AddMarkupForLanguage(languageCode, notificationRuleActions.SpeechActionParameter)
 	endIf
 endIf
 SayNotification(notificationRuleActions, suggestedOutputType, containsSpeechMarkup)
return TRUE
endFunction

void function OCRFileWithType (string byRef documentPath, int type)
var
	int PrimaryLanguage = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	int SecondaryLanguage = ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	int result = OCRResult_Success;
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if CanRecognize () != OCR_SUCCESS then
	SayFormattedMessage (OT_ERROR, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
	Return
endIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
result = RecognizeFile (documentPath, PrimaryLanguage, SecondaryLanguage, GlobalOCRJobID, type)
if result == OCRResult_Success then
	SayMessage (OT_JAWS_MESSAGE, msg_OCRDocumentStarted_L, MSG_OCRStarted_S)
	globalDocumentOCR = TRUE
Else
	StopSpeech()
	If result == OCRResult_NoFileSelected then
		MessageBox(msgOCRNoFileSelected)
	ElIf result == OCRResult_MultipleFilesSelected then
		MessageBox(msgOCRMultipleFilesSelected)
	ElIf result == OCRResult_UnsupportedFileSelected then
		MessageBox(msgOCRUnsupportedFileSelected)
	else
		MessageBox(MSG_OCR_PDF_FAILED_TO_Start)
	endIf
endif
endFunction

void function OCRFile (string byRef documentPath)
OCRFileWithType(documentPath, csConvenientOCR)
endFunction

void function OCRFileToWord (string byRef documentPath)
OCRFileWithType(documentPath, csConvenientOCRToWord)
endFunction

void function OCRReportMultipleFilesSelected()
	MessageBox(msgOCRMultipleFilesSelected)
endFunction

script OCRAllInOne (optional int serviceOptions)
if IsBackgroundOCREnabled()
	HandleBackgroundOCR(0, hwndGlobalOCRBackgroundRecognition)
endIf
if SetCustomBackgroundOCRRect()
	c_BackgroundOCRRect.restrictedToCustomRect = true
	PerformScript StartBackgroundRecognition(serviceOptions)
	return
endIf
PerformScript RecognizeRealWindow()
EndScript

script OCRAllInOneWithSound ()
PerformScript OCRAllInOne (BackgroundOCRServiceOptions_PlaySound)
EndScript

Script OCRSelectedFile ()
Say(cmsgOCRSelectedFileNotAvailable,ot_error)
endScript

Script OCRSelectedFileToWord ()
Say(cmsgOCRSelectedFileNotAvailable,ot_error)
endScript

Script OCRDocument ()
Say(cmsgOCRDocumentNotAvailable,ot_error)
EndScript

Void Function OcrAcquisitionRotated(Int iJobID, Int degreesRotated)
If GlobalOCRJobID != iJobID then
	Return
Endif
If 0 == degreesRotated then
	SayMessage(OT_JAWS_MESSAGE, msg_OCRAcquisitionOrientation_Normal, msg_OCRAcquisitionOrientation_Normal)
ElIf 90 == degreesRotated then
	SayMessage(OT_JAWS_MESSAGE, msg_OCRAcquisitionOrientation_Sideways, msg_OCRAcquisitionOrientation_Sideways)
ElIf 180 == degreesRotated then
	SayMessage(OT_JAWS_MESSAGE, msg_OCRAcquisitionOrientation_UpSideDown, msg_OCRAcquisitionOrientation_UpSideDown)
ElIf 270 == degreesRotated then
	SayMessage(OT_JAWS_MESSAGE, msg_OCRAcquisitionOrientation_SidewaysUpSideDown, msg_OCRAcquisitionOrientation_SidewaysUpSideDown)
Endif
endFunction

string function getScreenShadeUnavailableMessageByProduct ()
var int fsProducts = getRunningFSProducts ()
If fsProducts & product_ZoomText return cmsgScreenShadeUnavailableZoomText
elIf fsProducts & product_MAGic return cmsgScreenShadeUnavailableMAGic
else return cmsgScreenShadeUnavailable endIf
endFunction

script ScreenShadeToggle()
if ! isScreenShadeAvailable () then ; from quickSet.jss
	var string msg
	if IsSecureDesktop () then
		msg = cmsgScreenShadeUnavailableSecureDesktop
	elif ! IsWindows8 () then
		msg = cmsgScreenShadeUnavailableWindows7
	else
		msg = getScreenShadeUnavailableMessageByProduct ()
	endIf
	sayMessage (OT_ERROR, msg)
	return
endIf
ToggleScreenShade ()
var int screenShade = IsScreenShadeOn ()
var string shortMessage, string longMessage;
if screenShade then
	shortMessage = cmsgOn
	longMessage = cmsgScreenShadeOn_L
else
	shortMessage = cmsgOff
	longMessage = cmsgScreenShadeOff_L
endIf
sayMessage (OT_STATUS, longMessage, shortMessage)
endScript

int function IsReadOnlyEditObject()
var int theType = GetObjectSubtypeCode()
if theType == wt_ReadOnlyEdit return true endIf
;Testing window subtypecode will catch some multiline edits which were not caught by the object type code test:
if (GetWindowSubtypeCode(GetFocus()) == wt_ReadOnlyEdit) return true endIf
;additionally check UIA:
if theType != wt_edit
&& TheType != wt_multiline_Edit
&& theType != wt_unknown
&& TheType != wt_document
	return false
endIf
var object element = FSUIAGetFocusedElement().buildUpdatedCache()
return element.GetValuePattern().IsReadOnly == UIATrue
endFunction

void function UIATextEditTextChangedEvent(int changeType, string text)
;This event is generated by JAWS when UIA raises the TextEditTextChangedEvent, when the editor modifies the text.
;An example is when MSWord autocorrects or autocompletes text.
; The changeType and first text change is passed to the script event.
; changeTypes include:
; TextEditChangeType_None	= 0,
; TextEditChangeType_AutoCorrect	= 1,
; TextEditChangeType_Composition	= 2,
; TextEditChangeType_CompositionFinalized	= 3,
; TextEditChangeType_AutoComplete	= 4
endFunction

void function UIANotificationEvent(int notificationKind, int notificationProcessing, string displayString, string activityId, string appName)
; This event is generated by JAWS when UIA raises the NotificationEvent.
;All UIA parameters are passed unchanged to this event.
;Valid values for the notificationKind parameter include:
; NotificationKind_ItemAdded	= 0,
; NotificationKind_ItemRemoved	= 1,
; NotificationKind_ActionCompleted	= 2,
; NotificationKind_ActionAborted	= 3,
; NotificationKind_Other	= 4
;Valid values for the notificationProcessing parameter include:
; NotificationProcessing_ImportantAll	= 0,
; NotificationProcessing_ImportantMostRecent	= 1,
; NotificationProcessing_All	= 2,
; NotificationProcessing_MostRecent	= 3,
; NotificationProcessing_CurrentThenMostRecent	= 4
; For now, all notifications are indicated as Toast mesages  (speech and Braille) dependent on the new JCF option:
; OPT_ENABLE_ACCESSIBLE_NOTIFICATION_EVENTS
if getJCFOption (OPT_ENABLE_ACCESSIBLE_NOTIFICATION_EVENTS) then
	if (GlobalIgnoreNotificationsFromVolumeChange
	&& (ActivityID == Activity_ID_Notification_Volume
	|| ActivityID == Activity_ID_Notification_Volume_Win11))
	|| ActivityID == Activity_ID_Notification_InputSwitch ;Ignore UIA notifications for keyboard switching in favor of KeyboardLanguageChangedEvent
	|| activityId == "TerminalTextOutput"
		return
	endIf
	if notificationKind == NotificationKind_ActionCompleted
	&& activityId == Activity_ID_Notification_WindowSnap
		ClearWinArrowGlobals()
		if StringEndsWith (displayString, cmsgWindowMinimized)
			displayString = cmsgWindowMinimized;remove window title
		else
			var string sWindowName = GetWindowName (GetAppMainWindow (GetFocus ()))
			if sWindowName
			&& StringStartsWith (displayString, sWindowName)
				displayString = StringDiff (displayString, sWindowName);remove window title
			endIf
		endIf
	endIf
	if activityId == "HandleMoved"
		;A flood of notifications is produced when using the SnippingTool
		;Schedule function to only speak/store the most recent notification.
		if giScheduledUIANotification
			UnScheduleFunction (giScheduledUIANotification)
		endIf
		gsUIANotificationDisplayString = displayString
		gsUIANotificationAppName = appName
		giScheduledUIANotification = ScheduleFunction ("ScheduledUIANotification", 2, false)
		return
	endIf
	var collection notificationRuleActions = ProcessNotification(displayString, appName)
	; We need to make sure notifications aren't repeated endlessly.
	; To that end, we check if we've said the same thing less than 500 miliseconds ago
	if !IsRepeatNotification(displayString)
		SayNotification(notificationRuleActions, OT_TOASTS)
	endIf
	; We want to store even if we don't speak, to avoid repititions
	if !notificationRuleActions.ExcludeFromNotificationHistory then
		StoreSpokenNotificationForRepeat (displayString, appName) ; for new insert+Space&N keystroke.
	endIf
endIf
endFunction

void function ScheduledUIANotification()
var collection notificationRuleActions = ProcessNotification(gsUIANotificationDisplayString, gsUIANotificationAppName)
if !IsRepeatNotification(gsUIANotificationDisplayString)
	SayNotification(notificationRuleActions, OT_TOASTS)
endIf
if !notificationRuleActions.ExcludeFromNotificationHistory then
	StoreSpokenNotificationForRepeat (gsUIANotificationDisplayString, gsUIANotificationAppName)
endIf
giScheduledUIANotification = 0
gsUIANotificationDisplayString = cscNull
gsUIANotificationAppName = cscNull
endFunction

void function UIAChangesEvent(int type, string payload, string extraInfo)
;This event is generated by JAWS when UIA raises the ChangesEvent for one of the below properties:
; UIA_AnnotationType_SpellingError	=	60001;
; UIA_AnnotationType_GrammarError	=	60002;
; UIA_AnnotationType_AdvancedProofingIssue	=	60020;
; UIA_AnnotationType_DataValidationError	=	60021;
;UIA_AnnotationType_Author	=	60019
; This event should play the spelling error sound.
if type == UIA_AnnotationType_SpellingError then
	WordMisspelledEvent()
elif type==UIA_AnnotationType_Author then
; This attribute changes when a colaborating author navigates to the same line this user is editing.
; The payload is "author" and extraInfo is the author's name. ExtraInfo may however be empty.
	if extraInfo==cscNull then
		extraInfo=cmsgUnknownAuthor
	endIf
	SayFormattedMessage(OT_JAWS_MESSAGE, cmsgNamedCoAuth_l, cmsgNamedCoAuth_s, extraInfo)
endIf
endFunction

void function SayCharacter(optional int wantMarkup)
var
int pauseTime=GetJCFOption(OPT_PHONETIC_CHAR_AFTER_PAUSE)
if pauseTime > 0 then
	ScheduleFunction("SayCharacterPhoneticAfterPause", pauseTime, true)
endIf
self::SayCharacter(wantMarkup)
endFunction

void function SayCharacterPhoneticAfterPause()
if GetCharacterPhonetic()!=cscNull && stringLength(stringStripAllBlanks(getCharacter()))==1 then
	sayCharacterPhonetic()
endIf
endFunction

int function PictureSmartWithSelectedFileCommon (string filename, int serviceOptions)
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

result = DescribeFile(filename, serviceOptions, question)
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
endFunction

; Describe an image previously captured in DescribeCursorEx. The image is taken at the current location
; of the virtual cursor and stored in the internal cache in the Picture Smart controller.
; To identify the image, its md5 sum is calculated and passed to the Results Viewer.
; param imageHash - an identifier of the image cached in the Picture Smart controller.
; param serviceOptions - additional Picture Smart service options, see PSServiceOptions_* in HJConst
int function PictureSmartWithCachedArea (string imageHash, int serviceOptions)
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

result = DescribeCachedArea(imageHash, serviceOptions, question)
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
endFunction

Int Function PictureSmartWithCameraCommon (int serviceOptions)
var
	Int iCanRecognize,
	Int recognitionResult,
	string question = cscNULL
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if !IsPictureSmartEnabled() then
	Return
endif
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf

if(serviceOptions & PSServiceOptions_AskPrelim) then
	if !PictureSmartPromptPreliminaryQuestion(question) then
		return
	EndIf
EndIf

recognitionResult = IsTelemetryEnabled(TRUE);
If recognitionResult == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif recognitionResult != PSResult_Success then
	; no message needed since the function prompts
	return
EndIf

Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize == OCR_SUCCESS
	recognitionResult = DescribeCamera (serviceOptions, question)
	If recognitionResult == PSResult_DemoMode then
		sayMessage (OT_ERROR,  msg_picturesmart_demomode)
	elif recognitionResult == PSResult_NoDevicesAvailable then
		SayFormattedMessage (OT_ERROR,  msg_OCR_NoDevicesAvailable)
	elif recognitionResult != PSResult_Success then
		SayFormattedMessage (OT_ERROR,  MSG_OCR_PDF_FAILED_TO_Start)
	EndIf
Else
	SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
EndIf
EndFunction

Script PictureSmartWithCamera (optional int serviceOptions)
PictureSmartWithCameraCommon (PSServiceOptions_Single | serviceOptions)
EndScript

Script PictureSmartWithCameraAskPrelim ()
PerformScript PictureSmartWithCamera (PSServiceOptions_AskPrelim)
EndScript

Script PictureSmartWithCameraMultiService (optional int serviceOptions)
PictureSmartWithCameraCommon (PSServiceOptions_Multi | serviceOptions)
EndScript

Script PictureSmartWithCameraMultiServiceAskPrelim ()
PerformScript PictureSmartWithCameraMultiService (PSServiceOptions_AskPrelim)
EndScript

int function PictureSmartWithControlCommon (int serviceOptions, int forceCursor)
var
	Handle hCurrent = GetCurrentWindow (),
	Int iLeft,
	Int iRight,
	Int iBottom,
	Int iTop,
	Int recognitionResult,
	string question = cscNULL
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsScreenShadeOn () then
	sayMessage (OT_ERROR, msg_picturesmart_UnavailableScreenShade)
	return
endIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
if !IsPictureSmartEnabled() then
	Return
endIf

if(serviceOptions & PSServiceOptions_AskPrelim) then
	if !PictureSmartPromptPreliminaryQuestion(question) then
		return
	EndIf
EndIf

recognitionResult = IsTelemetryEnabled(TRUE);
If recognitionResult == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif recognitionResult != PSResult_Success then
	; no message needed since the function prompts
	return
EndIf

if forceCursor || IsVirtualPCCursor() then
	recognitionResult = DescribeCursorEx(serviceOptions, question)
elif GetObjectRect(iLeft, iRight, iTop, iBottom)
	recognitionResult =  DescribeAreaEx (iLeft, iTop, iRight, iBottom, serviceOptions, question)
elif GetWindowRect (hCurrent, iLeft, iRight, iTop, iBottom)
	recognitionResult =  DescribeAreaEx (iLeft, iTop, iRight, iBottom, serviceOptions, question)
endIf

If recognitionResult == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif recognitionResult == PSResult_CursorModeIncorrect then
	sayMessage (OT_ERROR, msg_picturesmart_controlnotgraphic)
elif recognitionResult == PSResult_NoArea then
	sayMessage (OT_ERROR, msg_picturesmart_noarea)
elif recognitionResult != PSResult_Success then
	sayMessage (OT_ERROR, msg_picturesmart_failedtostart)
EndIf
EndFunction

script PictureSmartWithControl (optional int serviceOptions)
var int forceCursor = 0
PictureSmartWithControlCommon (PSServiceOptions_Single | serviceOptions, forceCursor)
endScript

script PictureSmartWithControlAskPrelim ()
PerformScript PictureSmartWithControl (PSServiceOptions_AskPrelim)
endScript

script PictureSmartWithControlMultiService (optional int serviceOptions)
var int forceCursor = 0
PictureSmartWithControlCommon (PSServiceOptions_Multi | serviceOptions, forceCursor)
endScript

script PictureSmartWithControlMultiServiceAskPrelim ()
PerformScript PictureSmartWithControlMultiService (PSServiceOptions_AskPrelim)
endScript

Script PictureSmartWithSelectedFile (optional int serviceOptions)
if !IsPictureSmartEnabled() then
	Return
endif
Say(msg_picturesmart_selectederror, ot_error)
endScript

Script PictureSmartWithSelectedFileAskPrelim ()
PerformScript PictureSmartWithSelectedFile (PSServiceOptions_AskPrelim)
endScript

Script PictureSmartWithSelectedFileMultiService (optional int serviceOptions)
if !IsPictureSmartEnabled() then
	Return
endif
Say(msg_picturesmart_selectederror, ot_error)
endScript

Script PictureSmartWithSelectedFileMultiServiceAskPrelim ()
PerformScript PictureSmartWithSelectedFileMultiService (PSServiceOptions_AskPrelim)
endScript

int function PictureSmartWithScreenShared (int serviceOptions)
var
	Int recognitionResult,
	string question = cscNULL
if IsScreenShadeOn () then
	sayMessage (OT_ERROR, msg_picturesmart_UnavailableScreenShade)
	return
endIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
if !IsPictureSmartEnabled() then
	Return
endif

if(serviceOptions & PSServiceOptions_AskPrelim) then
	if !PictureSmartPromptPreliminaryQuestion(question) then
		return
	EndIf
EndIf

recognitionResult = IsTelemetryEnabled(TRUE);
If recognitionResult == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif recognitionResult != PSResult_Success then
	; no message needed since the function prompts
	return
EndIf

var int screenWidth = ScreenGetWidth();
var int screenHeight = ScreenGetHeight();

recognitionResult = DescribeAreaEx(0, 0, screenWidth, screenHeight, serviceOptions, question);
If recognitionResult == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif recognitionResult != PSResult_Success then
	sayMessage (OT_ERROR, msg_picturesmart_failedtostart)
EndIf
endFunction

script PictureSmartWithScreen (optional int serviceOptions)
PictureSmartWithScreenShared (PSServiceOptions_Single | serviceOptions)
endScript

script PictureSmartWithScreenAskPrelim ()
PerformScript PictureSmartWithScreen (PSServiceOptions_AskPrelim)
endScript

script PictureSmartWithScreenMultiService (optional int serviceOptions)
PictureSmartWithScreenShared (PSServiceOptions_Multi | serviceOptions)
endScript

script PictureSmartWithScreenMultiServiceAskPrelim ()
PerformScript PictureSmartWithScreenMultiService (PSServiceOptions_AskPrelim)
endScript

int function PictureSmartWithWindowShared (int serviceOptions)
var
	Handle hCurrent = GetCurrentWindow (),
	Handle hReal = GetRealWindow (hCurrent),
	Handle hApp = GetAppMainWindow (hCurrent),
	Int iLeft,
	Int iRight,
	Int iBottom,
	Int iTop,
	Int bValidRect,
	Int recognitionResult,
	string question = cscNULL
if IsScreenShadeOn () then
	sayMessage (OT_ERROR, msg_picturesmart_UnavailableScreenShade)
	return
endIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
if !IsPictureSmartEnabled() then
	Return
endif

if(serviceOptions & PSServiceOptions_AskPrelim) then
	if !PictureSmartPromptPreliminaryQuestion(question) then
		return
	EndIf
EndIf

recognitionResult = IsTelemetryEnabled(TRUE);
If recognitionResult == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif recognitionResult != PSResult_Success then
	; no message needed since the function prompts
	return
EndIf

bValidRect = GetWindowRect (hReal, iLeft, iRight, iTop, iBottom) && ((iRight - iLeft) > 0) && ((iBottom - iTop) > 0)
If (!bValidRect)
	; Use the app main window if the real window is not valid.
	bValidRect = GetWindowRect (hApp, iLeft, iRight, iTop, iBottom) && ((iRight - iLeft) > 0) && ((iBottom - iTop) > 0)
EndIf
If (!bValidRect)
	sayMessage (OT_ERROR, msg_picturesmart_noarea)
	return
EndIf

recognitionResult = DescribeAreaEx(iLeft, iTop, iRight, iBottom, serviceOptions, question);
If recognitionResult == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif recognitionResult != PSResult_Success then
	sayMessage (OT_ERROR, msg_picturesmart_failedtostart)
EndIf
endFunction

script PictureSmartWithWindow (optional int serviceOptions)
PictureSmartWithWindowShared (PSServiceOptions_Single | serviceOptions)
endScript

script PictureSmartWithWindowAskPrelim ()
PerformScript PictureSmartWithWindow (PSServiceOptions_AskPrelim)
endScript

script PictureSmartWithWindowMultiService (optional int serviceOptions)
PictureSmartWithWindowShared (PSServiceOptions_Multi | serviceOptions)
endScript

script PictureSmartWithWindowMultiServiceAskPrelim ()
PerformScript PictureSmartWithWindowMultiService (PSServiceOptions_AskPrelim)
endScript

int function PictureSmartWithAreaShared (int serviceOptions, int iLeft, int iTop, int iRight, int iBottom)
var
	Int recognitionResult,
	string question = cscNULL
if !IsPictureSmartEnabled() then
	SayMessage (OT_ERROR, msg_picturesmart_notenabled)
	Return
endIf
if IsScreenShadeOn () then
	sayMessage (OT_ERROR, msg_picturesmart_UnavailableScreenShade)
	return
endIf
If GlobalOCRJobID
	SayMessage (OT_ERROR, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf

if(serviceOptions & PSServiceOptions_AskPrelim) then
	if !PictureSmartPromptPreliminaryQuestion(question) then
		return
	EndIf
EndIf

recognitionResult = IsTelemetryEnabled(TRUE);
If recognitionResult == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif recognitionResult != PSResult_Success then
	; no message needed since the function prompts
	return
EndIf

recognitionResult =  DescribeAreaEx (iLeft, iTop, iRight, iBottom, serviceOptions, question)

If recognitionResult == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif recognitionResult == PSResult_CursorModeIncorrect then
	sayMessage (OT_ERROR, msg_picturesmart_controlnotgraphic)
elif recognitionResult == PSResult_NoArea then
	sayMessage (OT_ERROR, msg_picturesmart_noarea)
elif recognitionResult != PSResult_Success then
	sayMessage (OT_ERROR, msg_picturesmart_failedtostart)
EndIf
EndFunction

script PictureSmartAllInOne (optional int serviceOptions)
PerformScript PictureSmartWithControl(serviceOptions)
endScript

script PictureSmartAllInOneAskPrelim ()
PerformScript PictureSmartAllInOne(PSServiceOptions_AskPrelim)
endScript

script PictureSmartAllInOneMultiService (optional int serviceOptions)
PerformScript PictureSmartWithControlMultiService(serviceOptions)
endScript

script PictureSmartAllInOneMultiServiceAskPrelim ()
PerformScript PictureSmartAllInOneMultiService(PSServiceOptions_AskPrelim)
endScript

script PictureSmartLayerHelp()
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if !IsPictureSmartEnabled() then
	Return
endif
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (msg_picturesmart_helpscreentitle)
UserBufferAddTextResultsViewer(msg_picturesmart_helptext)
EndScript

void function PictureSmartProgress(Int state)
if state == ImageRecognition_Started then
	SayFormattedMessage (OT_STATUS, msg_picturesmart_inprogress)	; starting
elIf state == ImageRecognition_Processing then
	PlaySound(GetSoundFileLocation("Click2.wav"))					; same sound as OCR (see RecognitionDefinitions.h)
elIf state == ImageRecognition_StartError then
	SayFormattedMessage (OT_STATUS, msg_picturesmart_failedtostart)	; play generic error
endIf
endFunction

void function PictureSmartChatProgress()
PlaySound(GetSoundFileLocation("Click2.wav"));
endFunction

void function WordMisspelledEvent()
if getJCFOption(OPT_INDICATE_MISTYPED_WORD) then
	playSound(GetSoundFileLocation (globalProofingErrorEnteredSound))
endIf
endFunction


void function WordCorrectedEvent()
if getJCFOption(OPT_INDICATE_MISTYPED_WORD)  && !IsCurrentWordMisspelled() then
	playSound(GetSoundFileLocation (globalProofingErrorExitedSound))
endIf
endFunction

void function CheckLineAfterEdit()
; This function is called if the current word is misspelled and the user begins to type.
; It will schedule WordCorrectedEvent which if allowed to run, will play the corrected sound if the word is no longer misspelled.
scheduleFunction("WordCorrectedEvent", 2, 1);
endFunction

;This event is triggered when a numrow heading quick nav key causes navigation to move into a new section,
; that is, pass a lower level heading.
void function NewSectionEvent(string headingContext)
; string is of the form digit 1 to 6 for heading level, then text of heading, then 007 delimiter, etc, for each heading in the new section.
; If you move to an h3 in a new section containing an h1 and h2 above this heading three, then the h1 and h2 will be included in the context.
var
int count,
string segment,
int level,
string heading,
int len,
int i
	if (GetJCFOption(optHeadingNavigation)==newSectionPlaySound) then
	playSound(GetSoundFileLocation("NewGroupNav.wav"))
	return
endIf

count=StringSegmentCount (headingContext, LIST_ITEM_SEPARATOR)
for i=1 to count
	segment=StringSegment (headingContext, LIST_ITEM_SEPARATOR, i)
	level=stringToInt(stringLeft(segment,1))
	heading=stringChopLeft(segment,1)
	if (GetJCFOption(optHeadingNavigation)==newSectionSpeakHeadings) then
		IndicateControlType (WT_HTML_HEADING1+level-1, heading, cscNull)
	endIf
endFor
endFunction

script ToggleScreenCaptureMethod()
var
	int mode
; short messages "on" and "off" match the Accessibility Driver setting.
; The reason for this is the Settings Center option is called "Use Accessibility Driver".
mode = ReadSettingInteger (SECTION_OSM, hKey_HookingMode, 0, FT_DEFAULT_JCF)
if mode == 0 then
	writeSettingInteger (SECTION_OSM, hKey_HookingMode, 1, FT_DEFAULT_JCF, wdUser)
	SayMessage (OT_STATUS, cmsgUsingGDI, cmsgOff)
else
	writeSettingInteger (SECTION_OSM, hKey_HookingMode, 0, FT_DEFAULT_JCF, wdUser)
	SayMessage (OT_STATUS, cmsgUsingDDI, cmsgOn)
endIf

EndScript

Script SkypeDesktopDisconnectCall ()
SkypeDesktopEndCall ()
EndScript

Script SkypeDesktopAnswerCall ()
SkypeDesktopAnswerCall ()
EndScript

Script SkypeDesktopFocusSkypeWindow ()
SkypeFocus ()
EndScript

Script SkypeDesktopLayerHelp ()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (msg_SkypeDesktop_HelpScreenTitle)
UserBufferAddTextResultsViewer(msg_SkypeDesktop_HelpText)
endScript


void function VirtualCursorChangedEvent(int vCursorSetting)
;Although vCursorSetting is passed,
;this does not tell us whether or not the virtual cursor is active if the setting is set to 3.
;We will there fore test the state of the virtual cursor against a saved state.
var int state = IsVirtualPCCursor()
if state && state != globalSavedVirtualCursorState
	SayFormattedMessage(ot_status, cMSG291_L, cMSG_on)
elif !state && state != globalSavedVirtualCursorState
	SayFormattedMessage(ot_status, cmsg292_l, cmsg_off)
EndIf
globalSavedVirtualCursorState = state
EndFunction

Script ToggleBrailleViewerEnable ()
var
	int prevEnabled
prevEnabled = IsBrailleViewerEnabled()
if (prevEnabled == 1)
	SayMessage (ot_status, cmsg_Braille_Viewer_Disabling)
Else
	SayMessage (ot_status, cmsg_Braille_Viewer_Enabling)
EndIf
ToggleBrailleViewerEnable()
EndScript

int function InHJDialogError()
if !InHJDialog () return false endIf
SayFormattedMessage (OT_ERROR, cmsg337_L, cmsg337_S)
return true
EndFunction

Script PanBrailleViewerLeft ()
var
	int enabled
enabled = IsBrailleViewerEnabled()
if (enabled == 0)
	SayMessage (ot_error, cmsg_Braille_Viewer_ActionFailedDisabled)
Else
	PerformScript BraillePanLeft()
EndIf
EndScript

Script PanBrailleViewerRight ()
var
	int enabled
enabled = IsBrailleViewerEnabled()
if (enabled == 0)
	SayMessage (ot_error, cmsg_Braille_Viewer_ActionFailedDisabled)
Else
	PerformScript BraillePanRight()
EndIf
EndScript

Script PanBrailleViewerLeftLine2 ()
var
	int enabled
enabled = IsBrailleViewerEnabled()
if (enabled == 0)
	SayMessage (ot_error, cmsg_Braille_Viewer_ActionFailedDisabled)
Else
	PerformScript BrailleSplitPanLeft()
EndIf
EndScript

Script PanBrailleViewerRightLine2 ()
var
	int enabled
enabled = IsBrailleViewerEnabled()
if (enabled == 0)
	SayMessage (ot_error, cmsg_Braille_Viewer_ActionFailedDisabled)
Else
	PerformScript BrailleSplitPanRight()
EndIf
EndScript

Script BrailleViewerPriorLine ()
var
	int enabled
enabled = IsBrailleViewerEnabled()
if (enabled == 0)
	SayMessage (ot_error, cmsg_Braille_Viewer_ActionFailedDisabled)
Else
	PerformScript BraillePriorLine()
EndIf
EndScript

Script BrailleViewerNextLine ()
var
	int enabled
enabled = IsBrailleViewerEnabled()
if (enabled == 0)
	SayMessage (ot_error, cmsg_Braille_Viewer_ActionFailedDisabled)
Else
	PerformScript BrailleNextLine()
EndIf
EndScript

Script ToggleTextViewerEnable ()
var
	int prevEnabled
prevEnabled = IsTextViewerEnabled()
if (prevEnabled == 1)
	SayMessage (ot_status, cmsg_Text_Viewer_Disabling)
Else
	SayMessage (ot_status, cmsg_Text_Viewer_Enabling)
EndIf
ToggleTextViewerEnable()
EndScript

Script PanTextViewerLeft ()
var
	int enabled
enabled = IsTextViewerEnabled()
if (enabled == 0)
	SayMessage (ot_error, cmsg_Text_Viewer_ActionFailedDisabled)
Else
	PanTextViewerLeft()
EndIf
EndScript

Script PanTextViewerRight ()
var
	int enabled
enabled = IsTextViewerEnabled()
if (enabled == 0)
	SayMessage (ot_error, cmsg_Text_Viewer_ActionFailedDisabled)
Else
	PanTextViewerRight()
EndIf
EndScript

;This event is fired when the container of the caret changes, e.g. when arrowing from the main document body in MSWord to the footnote pane, or when arrowing from page to page.
;Such a change may or may not correspond to a focus changed event.
void function CaretContainerChangedEvent(int index, string name, string description, int type)
SayUsingVoice(vctx_message, name, OT_CONTROL_GROUP_NAME)
endFunction

Script BrailleAndTextViewerLayerHelp ()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cmsgBrailleAndTextViewerHelpScreenTitle)
UserBufferAddTextResultsViewer(cmsgBrailleAndTextViewerHelpText)
endScript

void function ToggleWakeWordSetting ()
if CheckAndHandleVoiceAssistantAvailability() then
	var int setting = GetWakeWordEnabled()
	var string WakeWord = GetCurrentWakeWord()
	setting = ! setting
	var string message
	if setting then
		message = formatString (cmsgToggleWakeWordListen, WakeWord)
	else
		message = formatString (cmsgToggleWakeWordIgnore, WakeWord)
	endIf
	sayMessage (OT_USER_REQUESTED_INFORMATION, message)
	SetWakeWordEnabled(setting)
endIf
endFunction

Script TalkToJAWS ()
unscheduleFunction (GlobalTalkToJAWSTimer)
if isSameScript () then
	ToggleWakeWordSetting ()
else
	GlobalTalkToJAWSTimer = ScheduleFunction ("TalkToJAWS", 5)
endIf
EndScript

void function VoiceAssistantFeedbackEvent(Int feedbackID)
var int isSpeechOnDemandActive = (IsSpeechOff() && getJCFOption(OPT_LESS_SPEECH) == 0)
if (isSpeechOnDemandActive)
	JAWSSpeechOnDemandOn()
endIf

if feedbackID == VAFeedback_Error_Unknown then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailed_UnknownError)
elIf feedbackID == VAFeedback_Error_NotInitialized then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailed_NotInitialized)
elIf feedbackID == VAFeedback_Error_NotEnabled then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailedDisabled)
elIf feedbackID == VAFeedback_Error_NoMicrophone then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailed_NoMicrophone)
elIf feedbackID == VAFeedback_Error_SpeechService then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailed_SpeechService)
elIf feedbackID == VAFeedback_Error_SpeechRecognition then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailed_SpeechRecognition)
elIf feedbackID == VAFeedback_Processing_AuthenticationError then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailed_AuthenticationFailure)
elIf feedbackID == VAFeedback_Processing_ConnectionFailure then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailed_ConnectionFailure)
elIf feedbackID == VAFeedback_Processing_ServiceTimeout then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailed_ServiceTimeout)
elIf feedbackID == VAFeedback_Processing_ServiceError then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailed_ServiceError)
elIf feedbackID == VAFeedback_Processing_ServiceUnavailable then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailed_ServiceUnavailable)
elIf feedbackID == VAFeedback_Processing_KeyServiceError then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_ActionFailed_KeyServiceError)
elIf feedbackID == VAFeedback_SpeechRecognized_Empty then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_SpeechRecognized_Empty)
elIf feedbackID == VAFeedback_SpeechRecognized_Unknown then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_SpeechRecognized_Unknown)
elIf feedbackID == VAFeedback_SpeechRecognized_RequiresMSWord then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_SpeechRecognized_RequiresMSWord)
elIf feedbackID == VAFeedback_SpeechRecognized_RequiresMSOutlook then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_SpeechRecognized_RequiresMSOutlook)
elIf feedbackID == VAFeedback_SpeechRecognized_RequiresMSWordOrOutlook then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_SpeechRecognized_RequiresMSWordOrOutlook)
elIf feedbackID == VAFeedback_SpeechRecognized_InvalidVoiceRate then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_SpeechRecognized_InvalidVoiceRate)
elIf feedbackID == VAFeedback_SpeechRecognized_ExitJawsDialog then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_SpeechRecognized_ExitJawsDialog)
elIf feedbackID == VAFeedback_SpeechRecognized_NoJokeAvailable then
	SayFormattedMessage (ot_error, cmsg_Voice_Assistant_SpeechRecognized_NoJokeAvailable)
endIf

if (isSpeechOnDemandActive)
	JAWSSpeechOnDemandOff()
endIf
endFunction

void function TellAJoke (string setup, string punchline)
if setup == cScNull then
	SayString(punchline)
else
	SayString(setup)
	g_voiceAssistant_scheduledPunchline = punchline
	; queue function to make sure the speaking of the setup is complete before scheduling the speaking of the punchline
	QueueFunction("ScheduleSayJokePunchline")
endIf
endFunction

void function ScheduleSayJokePunchline()
var int isSpeechOnDemandActive = (IsSpeechOff() && getJCFOption(OPT_LESS_SPEECH) == 0)
if (isSpeechOnDemandActive)
	JAWSSpeechOnDemandOn()
endIf

ScheduleFunction("SayJokePunchline", 15, true) ;tenths of a second

if (isSpeechOnDemandActive)
	JAWSSpeechOnDemandOff()
endIf
EndFunction

void function SayJokePunchline()
SayString(g_voiceAssistant_scheduledPunchline)
EndFunction

script VolumeControlNotifications ()
if ! GetDefaultJCFOption (OPT_ENABLE_ACCESSIBLE_NOTIFICATION_EVENTS) then
sayMessage (OT_ERROR, cmsgNotificationsDisabled)
return
endIf
GlobalIgnoreNotificationsFromVolumeChange = ! GlobalIgnoreNotificationsFromVolumeChange
if GlobalIgnoreNotificationsFromVolumeChange then ; suppress
	sayMessage (OT_USER_REQUESTED_INFORMATION, cmsgIgnoreVolumeControlNotifications)
else
	sayMessage (OT_USER_REQUESTED_INFORMATION, cmsgAllowVolumeControlNotifications)
endIf
writeSettingInteger (Section_NonJCFOptions, "IgnoreNotificationsFromVolumeChange", GlobalIgnoreNotificationsFromVolumeChange, FT_Default_JCF)
endScript

script PanTextByParagraphOnOrOff ()
var
	int setting,
	string longMessage,
	string shortMessage
setting = getJCFOption (OPT_BRL_NAV_BY_PARA)
setting = ! setting
setJCFOption (OPT_BRL_NAV_BY_PARA, setting)
if setting then
	longMessage = formatString (cmsgPanTextByParagraphOnOrOff, cmsgOn)
	shortMessage = cmsgOn
else
	longMessage = formatString (cmsgPanTextByParagraphOnOrOff, cmsgOff)
	shortMessage = cmsgOff
endIf
sayMessage (OT_STATUS, longMessage, shortMessage)
endScript

void function SayScreenOcrStarted(int useMicrosoftOcr)
if useMicrosoftOcr
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRStarted_MicrosoftOcr_L, MSG_OCRStarted_MicrosoftOcr_S)
else
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRStarted_OmniPage_L, MSG_OCRStarted_OmniPage_S)
endif
endFunction

int function ScriptPerformanceHistoryWindowIsActive()
return ghWndResultsViewer
	&& GetWindowName(ghWndResultsViewer) == cmsgScriptPerformanceHistoryTitle
EndFunction

void function ShowScriptPerformanceHistoryInResultsViewer()
var string sText = StringTrimTrailingBlanks(GetScriptPerformanceHistory())
ShowTextInResultsViewer(sText, cmsgScriptPerformanceHistoryTitle, ScriptPerformanceHistoryWindowIsActive())
EndFunction

script ShowScriptPerformanceHistory()
var
int userAnswer
if InHomeRowMode() Then
	PerformScript HomeRowToggle()
endIf
if !GetIntOptionUserSetting(Section_StabilityAndPerformance, hKey_ScriptPerformanceHistoryEnabled) then
	userAnswer = ExMessageBox(cmsgScriptPerformanceHistoryEnableQuestion, cmsgScriptPerformanceHistoryTitle, MB_YESNO|MB_ICONQUESTION)
	if (userAnswer == IDNO) Then
		return
	endIf
	IniWriteIntegerEx(Section_StabilityAndPerformance, hKey_ScriptPerformanceHistoryEnabled, true, FLOC_USER_SETTINGS, file_default_jcf, true)
	SayMessage(OT_STATUS, cmsgScriptPerformanceHistoryEnabledInformation)
	return
EndIf
ShowScriptPerformanceHistoryInResultsViewer()
EndScript

script ClearScriptPerformanceHistory()
ClearScriptPerformanceHistory()
SayMessage(OT_STATUS, cmsgScriptPerformanceHistoryClearedInformation)
EndScript

Script IndicateLinkSourceURL ()
var string URL
if IsLinkOrHeadingUnderVirtualCursor () then
; headings may contain links.
	URL = GetURLForFocusedLink ()
endIf
if stringIsBlank (URL) then
	return sayMessage (OT_ERROR, cmsgURLNotFound_L, cmsgURLNotFound_S)
endIf
if isSameScript () then
	UserBufferDeactivate ()
	UserBufferClear ()
	SayMessage (OT_USER_BUFFER, URL)
	return
endIf
sayMessage (OT_USER_REQUESTED_INFORMATION, URL)
endScript

string function GetMathEditorResultText(int result)
if (result == MathEditorResult_FailedToLaunch)
	return msgMathEditorError_FailedToLaunch
elif (result == MathEditorResult_ContractedBrailleNotEnabled)
	return msgMathEditorError_ContractedBrailleNotEnabled
elif (result == MathEditorResult_Windows10Required)
	return msgMathEditorError_Windows10Required
elif (result == MathEditorResult_LanguageNotSupported)
	return msgMathEditorError_LanguageNotSupported
elif (result == MathEditorResult_NotEnabled)
	return msgMathEditorError_NotEnabled
endIf
return cscNull
EndFunction

void function NotifyUserOfMathEditorResult(int result)
var string errorMessage = GetMathEditorResultText(result)
if (StringIsBlank(errorMessage))
	return
endIf
DisplayOrSpeakMessage(ShowMathEditorErrorTitle, errorMessage, OT_ERROR, DoNotShowMathEditorResultMessageAgain)
EndFunction

void function ShowMathEditorHelper(string requestor)
var int result = ShowMathEditor(requestor);
NotifyUserOfMathEditorResult(result)
EndFunction

script ShowMathEditor()
ShowMathEditorHelper(MathEditorRequestor_Default)
EndScript

string function GetMathViewerResultText(int result)
if (result == MathViewerResult_NoMathML)
	return msgMathViewerError_NoMathML
elif (result == MathViewerResult_NotEnabled)
	return msgMathViewerError_NotEnabled
endIf
return cscNull
EndFunction

void function NotifyUserOfMathViewerResult(int result)
var string errorMessage = GetMathViewerResultText(result)
if (StringIsBlank(errorMessage))
	return
endIf
DisplayOrSpeakMessage(ShowMathViewerErrorTitle, errorMessage, OT_ERROR, DoNotShowMathViewerResultMessageAgain)
EndFunction

void function ShowMathViewerHelper(string requestor)
var int result = ShowMathViewer(requestor);
NotifyUserOfMathViewerResult(result)
EndFunction

Script OpenQuickAccessBar()
	OpenQuickAccessBar()
EndScript

script LockWorkStation()
LockWorkStation()
EndScript

Script SimulateAltCtrlDelete()
SimulateAltCtrlDelete()
EndScript

script BrailleSelectAProfile()
var
string profileList,
string profileListEntry,
string profileName,
string langIDList,
int index,
int count,
int curIndex

let langIDList=readSettingString (SECTION_BRAILLE, HKey_PREFERRED_BRL_PROFILE_LIST, "", FT_CURRENT_JCF)
let count=StringSegmentCount (langIDList, "|")
if count==0 then
	sayFormattedMessage(OT_ERROR, cmsgNoPreferredBrailleProfileListConfigured_L, cmsgNoPreferredBrailleProfileListConfigured_S)
	return
endIf

for index=1 to count
	let profileName = GetLocaleNameForLangID(StringSegment (langIDList, "|", index))
	if profileName == BrailleGetCurrentProfileName() then
		curIndex=index
	endIf
	profileListEntry=profileName+"|"
	profileList=profileList+profileListEntry
endFor
let index=DlgSelectItemInList (profileList, cscBrlProfileListTitle, FALSE, curIndex)
if index then
; Must load using langID.
	BrailleSetCurrentProfile(StringSegment (langIDList, "|", index), wdSession)
endIf
if BrailleGetSplitMode()==brlSplitTranslation then
	SetSplitTranslationParameters()
endIf
BrailleRefresh()
endScript

script BrailleCycleProfile()
var
string profileList,
string profileListEntry,
string profileName,
string langIDList,
int index,
int count,
int curIndex

let langIDList=readSettingString (SECTION_BRAILLE, HKey_PREFERRED_BRL_PROFILE_LIST, "", FT_CURRENT_JCF)
let count=StringSegmentCount (langIDList, "|")

if count==0 then
	sayFormattedMessage(OT_ERROR, cmsgNoPreferredBrailleProfileListConfigured_L, cmsgNoPreferredBrailleProfileListConfigured_S)
	return
endIf

for index=1 to count

	let profileName = GetLocaleNameForLangID(StringSegment (langIDList, "|", index))
	if profileName == BrailleGetCurrentProfileName() then
		curIndex=index
	endIf
	profileListEntry=profileName+"|"
	profileList=profileList+profileListEntry
endFor
let index=curIndex
if index < count then
	let index=index+1
else
	let index=1
endIf
let profileName=StringSegment (profileList, "|", index)
sayMessage(OT_JAWS_MESSAGE, profileName)
; Must load using langID, not Profile name.
BrailleSetCurrentProfile(StringSegment (langIDList, "|", index), wdSession)
if BrailleGetSplitMode()==brlSplitTranslation then
	SetSplitTranslationParameters()
endIf
BrailleRefresh()
endScript

Script RouteJAWSSoundLeft()
var int setting = GetJCFOption(OPT_LOWER_OTHER_APPS_VOLUME)
if setting
	GlobalAudioDuckingDisabledByRouting = 1
	SetDefaultJCFOption(OPT_LOWER_OTHER_APPS_VOLUME,Off)
	WriteSettingInteger (Section_Options, hKey_LowerAppVolumeWhileJAWSIsRunning, 0, FT_DEFAULT_JCF, wdSession)
else
	GlobalAudioDuckingDisabledByRouting = 0
endIf
RouteJAWSSoundLeft()
EndScript

Script RouteJAWSSoundRight()
var int setting = GetJCFOption(OPT_LOWER_OTHER_APPS_VOLUME)
if setting
	GlobalAudioDuckingDisabledByRouting = 1
	SetDefaultJCFOption(OPT_LOWER_OTHER_APPS_VOLUME,Off)
	WriteSettingInteger (Section_Options, hKey_LowerAppVolumeWhileJAWSIsRunning, 0, FT_DEFAULT_JCF, wdSession)
else
	GlobalAudioDuckingDisabledByRouting = 0
endIf
RouteJAWSSoundRight()
EndScript

Script RestoreSoundBalance()
if GlobalAudioDuckingDisabledByRouting == 1 then
		SetDefaultJCFOption(OPT_LOWER_OTHER_APPS_VOLUME,On)
	WriteSettingInteger (Section_Options, hKey_LowerAppVolumeWhileJAWSIsRunning, 0, FT_DEFAULT_JCF, wdSession)
	; we no longer route, so turn off the flag that audio ducking is disabled
	GlobalAudioDuckingDisabledByRouting = 0
endIf
RestoreSoundBalance()
EndScript

void function SpeakSoundMixerFeedback(int code)
if code == SoundMixerFeedback_RoutedLeft then
	GlobalAudioIsRouted = 1
	SayFormattedMessage(OT_STATUS, cMsgRoutedLeft_l, cMsgRoutedLeft_s)
elIf code == SoundMixerFeedback_RoutedRight then
	GlobalAudioIsRouted = 1
	SayFormattedMessage(OT_STATUS, cMsgRoutedRight_l, cMsgRoutedRight_s)
elIf code == SoundMixerFeedback_RestoredBalance then
GlobalAudioIsRouted = 0
	SayFormattedMessage(OT_STATUS, cMsgRestoredBalance_l, cMsgRestoredBalance_s)
endIf
endFunction

void function SpeakSoundMixerError(int errorCode)
if (errorCode == SoundMixerError_UnsupportedAudioDevice) then
	SayMessage(OT_ERROR, cMsgSoundMixerError_UnsupportedDevice)
else
	SayMessage(OT_ERROR, FormatString(cMsgSoundMixerError_GenericError, IntToString(errorCode)))
endIf
endFunction

Script SoundBalanceHelp()
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cMsgSoundBalanceLayerHelpScreen)
UserBufferAddTextResultsViewer(cMsgSoundBalanceLayerHelp)
EndScript

void function ShowSoundMixerDiscoveryDialog()
var
	int showOption
if (g_bShowSoundMixerDiscoveryDialog == true) then
	let g_bShowSoundMixerDiscoveryDialog = false
	let showOption = ReadSettingInteger (Section_Options, hKey_ShowSoundMixerDiscoveryDialog, 1, FT_DEFAULT_JCF)
	if (showOption == true) then
		ShowSoundMixerDiscoveryDialog()
	endIf
endIf
endFunction

void function SpeakSoundCardName()
var int isSODActive = (IsSpeechOff() && getJCFOption(OPT_LESS_SPEECH) == 0)
if !stringIsBlank(GlobalSoundCardName) then
	if (isSODActive) JAWSSpeechOnDemandOn() endIf
	SayFormattedMessage(OT_STATUS, GlobalSoundCardName)
	if (isSODActive) JAWSSpeechOnDemandOff() endIf
endIf
unScheduleFunction(GlobalSwitchSoundCardTimerId)
GlobalSwitchSoundCardTimerId = 0

endFunction

script SelectNextSoundCard()

GlobalSoundCardName = SelectNextSoundCard()
if GlobalSwitchSoundCardTimerId != 0 then
unScheduleFunction(GlobalSwitchSoundCardTimerId)
GlobalSwitchSoundCardTimerId = 0
endIf
GlobalSwitchSoundCardTimerId = ScheduleFunction("SpeakSoundCardName", 1)

endScript

script SelectPreviousSoundCard()

GlobalSoundCardName = SelectPreviousSoundCard()
if GlobalSwitchSoundCardTimerId != 0 then
unScheduleFunction(GlobalSwitchSoundCardTimerId)
GlobalSwitchSoundCardTimerId = 0
endIf
GlobalSwitchSoundCardTimerId = ScheduleFunction("SpeakSoundCardName", 1)
endScript

Script SoundCardsHelp()
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle (cmsgSoundCardsLayerHelpScreen)
UserBufferAddTextResultsViewer(cmsgSoundCardsLayerHelp)
EndScript

script RestartWithoutDump()
	RestartProductWithoutDump();
EndScript

script BrailleToggleShowTimeInStatusCells()
var
string state,
int val=GetDefaultJCFOption(OPT_BRL_SHOW_TIME_IN_STATUS_CELLS)
; Do not disturb the format in bit 1, only toggle bit 0.
if (val&scTmOn) ; toggle it off.
	val = (val&~scTmOn)
	state=cmsgOff
else
	val = (val | scTmOn) ; toggle it on without disturbing the format.
	state=cmsgOn
endIf
SetDefaultJCFOption(OPT_BRL_SHOW_TIME_IN_STATUS_CELLS, val)
IniWriteInteger (SECTION_BRAILLE, hKEY_Braille_SHOW_TIME_IN_STATUS_CELLS, val, DefaultJCFFile)
sayFormattedMessage(OT_JAWS_MESSAGE, formatString(cmsgShowTimeInStatusCells_L, state), formatString(cmsgShowTimeInStatusCells_S, state))
endScript

string function GetVisperoConnectedLink()
var
	string currentAppOrWebsite,
	string connectedLink

	currentAppOrWebsite= GetObjectProcessName()
if !currentAppOrWebsite return cscNull endIf
if IsVisperoConnectEnabledForSite(currentAppOrWebsite,connectedLink)
	return connectedLink
endIf
; try URL
currentAppOrWebsite=GetDocumentPath()
if IsVisperoConnectEnabledForSite(currentAppOrWebsite,connectedLink)
	return connectedLink
endIf

return cscNull
EndFunction

script LaunchVisperoConnectedLink()
var
string VisperoConnectedLink=GetVisperoConnectedLink()
if VisperoConnectedLink != CSCNull then
	run(VisperoConnectedLink)
else
	SayMessage(OT_ERROR, cmsgNoVisperoConnectLink_l, cmsgNoVisperoConnectLink_S)
endIf
endScript

script ToggleToastNotificationAnnouncement()

var int toastProcessingEnabled = GetDefaultJCFOption(OPT_ENABLE_TOAST_NOTIFICATION_PROCESSING)
if toastProcessingEnabled then
			SetDefaultJCFOption(OPT_ENABLE_TOAST_NOTIFICATION_PROCESSING, Off)
		WriteSettingInteger(Section_Options, hKey_Enable_Toast_Notification_Processing, Off, FT_DEFAULT_JCF, wdSession)
	SayMessage(Ot_Status, cMsgToastNotificationProcessingDisabled_l, cMsgToastNotificationProcessingDisabled_s)
	SendToggleNotificationTelemetryDataPoint(Off)
else
	SetDefaultJCFOption(OPT_ENABLE_TOAST_NOTIFICATION_PROCESSING, On)
		WriteSettingInteger(Section_Options, hKey_Enable_Toast_Notification_Processing, On, FT_DEFAULT_JCF, wdSession)
	SayMessage(Ot_Status, cMsgToastNotificationProcessingEnabled_l, cMsgToastNotificationProcessingEnabled_s)
	SendToggleNotificationTelemetryDataPoint(On)
endIf

endScript

Void Function ProcessZTTetheredViewItemChange (handle hWnd)
if !IsZoomTextRunning()
|| !ZTIsTetheredViewEnabled ()
	return
endIf
if InHJDialog()
&& GetWindowName (GetRealWindow (hWnd)) == cwn_LinksList
	var
		handle hReal = GetRealWindow (hWnd),
		handle hAddress = FindDescendantWindow (hReal, iD_LinksList_Address)
	if StringIsBlank (GetWindowText (hAddress, false))
		ZTHideTetheredViewScenario (goLinksListTetheredViewScenario)
	else
		var object oFocusRect = ZTCreateRectFromUIAElement (FSUIAGetFocusedElement ())
		ZTTetheredViewUpdateLocations (goLinksListTetheredViewScenario, oFocusRect)
		if ZTCurrentTetheredViewScenario () != goLinksListTetheredViewScenario.Name
			ZTShowTetheredViewScenario (goLinksListTetheredViewScenario)
		endIf
	endIf
endIf
EndFunction

Void Function ProcessZTTetheredViewFocusChange (handle hFocus, handle hReal, string sRealWindowName)
if !IsZoomTextRunning()
|| !ZTIsTetheredViewEnabled ()
	return
endIf
if !goLinksListTetheredViewScenario
	goLinksListTetheredViewScenario = ZTGetTetheredViewScenario (cmsgZTTetheredViewScenarioLinksListAddress)
endIf
var
	handle hAddress = FindDescendantWindow (hReal, iD_LinksList_Address)
if InHJDialog()
&&	sRealWindowName == cwn_LinksList
&& GetWindowTypeCode (hFocus) == WT_LISTVIEW
&& !StringIsBlank (GetWindowText (hAddress, false))
	var
		object oFocusRect = ZTCreateRectFromUIAElement (FSUIAGetFocusedElement ()),
		object oSourceRect = ZTCreateRectFromWindow (hAddress)
	ZTTetheredViewUpdateLocations (goLinksListTetheredViewScenario, oFocusRect, oSourceRect)
	ZTShowTetheredViewScenario (goLinksListTetheredViewScenario)
else
	ZTHideTetheredViewScenario (goLinksListTetheredViewScenario)
endIf
EndFunction

script MoveToNextGlanceHighlight()
MoveToGlanceHighlight(s_next, false)
endScript

script MoveToPriorGlanceHighlight()
MoveToGlanceHighlight(s_prior, false)
endScript

script MoveToNextMostRecentGlanceHighlight()
MoveToGlanceHighlight(s_next, true)
endScript

script MoveToPriorMostRecentGlanceHighlight()
MoveToGlanceHighlight(s_prior, true)
endScript

script SelectAGlanceHighlight()
SelectAGlanceHighlightDialog ()
endScript

void function MessageCenterNotification(string msg)
SayMessage (OT_MESSAGE, msg)
BrailleMessage (msg, 0)
endFunction

script FollowDetailsRelation()
FollowDetailsRelation()
EndScript

Object Function GetNotificationWindow ()
if IsSecureDesktop () return Null() endIf
var
	object oDesktop = FSUIAGetRootElement (),
	object oTypeCondition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyID, UIA_WindowControlTypeId),
	object oClassCondition = FSUIACreateStringPropertyCondition (UIA_ClassNamePropertyID, cwc_Windows_UI_Core_CoreWindow),
	object oAndCondition = FSUIACreateAndCondition (oTypeCondition, oClassCondition)
return oDesktop.findFirst(TreeScope_Children, oAndCondition)
EndFunction

object function TeamsFindFirst(object oCondition)
var
	object oElement,
	object oRoot,
	handle hWnd,
	handle hRoot
hWnd = FindWindow (0, cwc_TeamsWebView)
while hWnd
	if GetWindowClass (hWnd) == cwc_TeamsWebView
		hRoot = FindWindow (hWnd, cwc_ChromeWindowClass)
		if hRoot
			oRoot = FSUIAGetElementFromHandle (hRoot)
			oElement = oRoot.findFirst(TreeScope_Descendants, oCondition)
			if oElement
				return oElement
			endIf
		endIf
	endIf
	hWnd = GetNextWindow (hWnd)
endWhile
return Null()
endFunction

Object Function GetTeamsNotificationWindow ()
if IsSecureDesktop () return Null() endIf
var
	object oDesktop = FSUIAGetRootElement (),
	object oTypeCondition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyID, UIA_PaneControlTypeId),
	object oClassCondition = FSUIACreateStringPropertyCondition (UIA_ClassNamePropertyID, cwc_TeamsWebView),
	object oAndCondition = FSUIACreateAndCondition (oTypeCondition, oClassCondition)
return oDesktop.findFirst(TreeScope_Children, oAndCondition)
EndFunction

Int Function RespondToIncomingCall (object oNotificationWnd, string sResponse, optional string sAlternativeResponse)
var
	object oTypeCondition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyID, UIA_ButtonControlTypeID),
	object oNameCondition = FSUIACreateStringPropertyCondition (UIA_NamePropertyID, sResponse),
	object oAlternativeNameCondition,
	object oAndCondition,
	object oButton
if !StringIsBlank (sAlternativeResponse)
	oAlternativeNameCondition = FSUIACreateStringPropertyCondition (UIA_NamePropertyID, sAlternativeResponse)
	oNameCondition = FSUIACreateOrCondition(oNameCondition, oAlternativeNameCondition)
endIf
oAndCondition = FSUIACreateAndCondition (oTypeCondition, oNameCondition)
oButton = oNotificationWnd.findFirst(TreeScope_Descendants, oAndCondition)
if oButton
	oButton.GetInvokePattern().invoke
	return true
else
	return false
endIf
EndFunction

Script AcceptAudioCall ()
var
	object oTeamsCall = GetTeamsNotificationWindow ()
if oTeamsCall
	if RespondToIncomingCall(oTeamsCall, cwnAcceptWithAudio, cwnAccept)
		return
	endIf
endIf
oTeamsCall = GetNotificationWindow ()
if oTeamsCall
	if RespondToIncomingCall(oTeamsCall, cwnAcceptWithAudio, cwnAccept)
		return
	endIf
endIf
TypeKey (cksTeamsAcceptWithAudio)
EndScript

Script ExecuteZoomTextCommand(string command)
ExecuteZoomTextCommand(command)
EndScript

Script DeclineCall ()
var
	object oTeamsCall = GetTeamsNotificationWindow ()
if oTeamsCall
	if RespondToIncomingCall(oTeamsCall, cwnDeclineCall, cwnDecline)
		return
	endIf
endIf
oTeamsCall = GetNotificationWindow ()
if oTeamsCall
	if RespondToIncomingCall(oTeamsCall, cwnDeclineCall, cwnDecline)
		return
	endIf
endIf
TypeKey (cksTeamsDecline)
EndScript

Script AcceptVideoCall ()
var
	object oTeamsCall = GetTeamsNotificationWindow ()
if oTeamsCall
	if RespondToIncomingCall(oTeamsCall, cwnAcceptWithVideo, cwnAccept)
		return
	endIf
endIf
oTeamsCall = GetNotificationWindow ()
if oTeamsCall
	if RespondToIncomingCall(oTeamsCall, cwnAcceptWithVideo, cwnAccept)
		return
	endIf
endIf
TypeKey (cksTeamsAcceptWithVideo)
EndScript

Object Function GetPhoneLinkCallWindow ()
if IsSecureDesktop () return Null() endIf
var
	object oPhoneLinkCondition = FSUIACreateStringPropertyCondition(UIA_NamePropertyId, cwnPhoneLink),
	object oWindowCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_WindowControlTypeID),
	object oAndCondition = FSUIACreateAndCondition(oPhoneLinkCondition, oWindowCondition),
	object oWindow = FSUIAGetRootElement ().findFirst(TreeScope_Children, oAndCondition)
if oWindow.GetPropertyValue(UIA_WindowIsTopmostPropertyId)
	return oWindow
endIf
return Null()
EndFunction

Script AcceptPhoneLinkCall ()
var
	object oNotificationWindow = GetNotificationWindow ()
if !oNotificationWindow return endIf
RespondToIncomingCall(oNotificationWindow, cwnAccept)
EndScript

Script DeclinePhoneLinkCall ()
var
	object oNotificationWindow = GetNotificationWindow ()
if !oNotificationWindow return endIf
RespondToIncomingCall(oNotificationWindow, cwnDecline)
EndScript

Script EndPhoneLinkCall ()
var
	object oCallWindow = GetPhoneLinkCallWindow ()
if !oCallWindow return endIf
var
	object oEndCallCondition = FSUIACreateStringPropertyCondition(UIA_NamePropertyID, cwnEndCall),
	object oButtonCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyID, UIA_ButtonControlTypeID),
	object oAndCondition = FSUIACreateAndCondition(oButtonCondition, oEndCallCondition),
	object oEndCallButton = oCallWindow.findFirst(TreeScope_Descendants, oAndCondition)
if !oEndCallButton return endIf
oEndCallButton.GetInvokePattern().invoke
EndScript

Object Function GetTeamsWindows ()
if IsSecureDesktop () return Null() endIf
var
	object oNameCondition = FSUIACreateStringPropertyCondition(UIA_ClassNamePropertyId, cwc_TeamsWebView),
	object oTypeCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_WindowControlTypeID),
	object oAndCondition = FSUIACreateAndCondition(oNameCondition, oTypeCondition),
	object oElements = FSUIAGetRootElement ().findAll(TreeScope_Children, oAndCondition)
if oElements.count > 0
	return oElements
endIf
oNameCondition = FSUIACreateStringPropertyCondition(UIA_NamePropertyId, cwnMicrosoftTeams, PropertyConditionFlags_MatchSubstring)
oTypeCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_PaneControlTypeID)
oAndCondition = FSUIACreateAndCondition(oNameCondition, oTypeCondition)
oElements = FSUIAGetRootElement ().findAll(TreeScope_Children, oAndCondition)
if oElements.count > 0
	return oElements
endIf
return Null()
EndFunction

object function GetTeamsMuteButton()
var
	object oAutomationIDCondition = FSUIACreateStringPropertyCondition(UIA_AutomationIDPropertyID, UIAAutomationID_TeamsMuteButton),
	object oButtonCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyID, UIA_ButtonControlTypeID),
	object oAndCondition = FSUIACreateAndCondition(oAutomationIDCondition, oButtonCondition),
	object oMuteButton = TeamsFindFirst(oAndCondition)
if oMuteButton
	return oMuteButton
endIf
;The remainder of this script is being left in to support Teams 1
var
	object oTeamsWindows = GetTeamsWindows ()
if !oTeamsWindows return endIf
var
	object oWindow,
	string sOwner
ForEach oWindow in oTeamsWindows
	sOwner = StringSegment (GetWindowOwner (oWindow.nativeWindowHandle), cScDoubleBackSlash, -1)
	if StringContainsCaseInsensitive(sOwner, cscOwnerApp_Teams)
		oMuteButton = oWindow.findFirst(TreeScope_Descendants, oAndCondition)
		if oMuteButton
			return oMuteButton
		endIf
	endIf
EndForEach
EndFunction

Script LeaveTeamsCall ()
var
	object oAutomationIDCondition = FSUIACreateStringPropertyCondition(UIA_AutomationIDPropertyID, UIAAutomationID_TeamsLeaveButton),
	object oAlternativeCondition = FSUIACreateStringPropertyCondition(UIA_NamePropertyID, cwnLeave, PropertyConditionFlags_MatchSubstring),
	object oOrCondition = FSUIACreateOrCondition(oAutomationIDCondition, oAlternativeCondition),
	object oButtonCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyID, UIA_ButtonControlTypeID),
	object oAndCondition = FSUIACreateAndCondition(oOrCondition, oButtonCondition),
	object oLeaveButton = TeamsFindFirst(oAndCondition)
if oLeaveButton
	oLeaveButton.GetInvokePattern().invoke
	return
endIf
;The remainder of this script is being left in to support Teams 1
var
	object oTeamsWindows = GetTeamsWindows ()
if !oTeamsWindows return endIf
var
	object oWindow,
	string sOwner
ForEach oWindow in oTeamsWindows
	sOwner = StringSegment (GetWindowOwner (oWindow.nativeWindowHandle), cScDoubleBackSlash, -1)
	if StringContainsCaseInsensitive(sOwner, cscOwnerApp_Teams)
		oLeaveButton = oWindow.findFirst(TreeScope_Descendants, oAndCondition)
		if oLeaveButton
			oLeaveButton.GetInvokePattern().invoke
			return
		endIf
	endIf
EndForEach
EndScript

Script ManageCall()
var
	string sApp,
	string sResponse,
	int iResponse,
	int iApp,
		string sAppList = cscManageCall_Apps,
	string sPrimary = IniReadString (SECTION_NonJCFOptions, hKey_ManageCallPrimaryApp, cscNull, file_default_jcf, rsNoTransient)
if !StringIsBlank (sPrimary)
&& StringContains (cscManageCall_Apps, sPrimary)
	sAppList = sPrimary + JAWS_DLG_LIST_SEPARATOR + cscManageCall_Apps
	sAppList = StringReplaceSubstrings (sAppList, JAWS_DLG_LIST_SEPARATOR+sPrimary, cscNull)
endIf
iApp = DlgSelectItemInList (sAppList, cmsgManageCall_Title, false, 1, cscManageCall_Buttons, iResponse)
if !iApp return endIf
sApp = StringSegment (sAppList, JAWS_DLG_LIST_SEPARATOR, iApp)
if iResponse == ManageCall_HangUp
	if sApp == cscManageCall_PhoneLink
		PerformScript EndPhoneLinkCall ()
	elIf sApp == cscManageCall_Teams
		PerformScript LeaveTeamsCall ()
	elIf sApp == cscManageCall_Skype
		PerformScript SkypeDesktopDisconnectCall()
	endIf
	return
endIf
if iResponse == ManageCall_MakePrimary
	IniWriteString (SECTION_NonJCFOptions, hKey_ManageCallPrimaryApp, sApp, file_default_jcf, true, wdUser)
	return
endIf
if sApp == cscManageCall_Skype
	if iResponse == ManageCall_Decline
		Say (msgManageCall_SkypeDeclineNotSupported, OT_ERROR)
	else
		PerformScript SkypeDesktopAnswerCall()
	endIf
	return
endIf
if sApp == cscManageCall_Teams
	if iResponse == ManageCall_Decline
		PerformScript DeclineCall()
	elIf iResponse == ManageCall_AcceptWithVideo
		PerformScript AcceptVideoCall()
	else
		PerformScript AcceptAudioCall()
	endIf
elIf sApp == cscManageCall_PhoneLink
	if iResponse == ManageCall_Decline
		PerformScript DeclinePhoneLinkCall()
	else
		PerformScript AcceptPhoneLinkCall()
	endIf
endIf
EndScript

Script MeetingStatus()
var
	object oMuteButton = GetTeamsMuteButton(),
	object oCameraButton,
	object oShareButton,
	object oRoot,
	object oCondition,
	string sMuteStatus,
	string sCameraStatus,
	string sShareStatus
if !oMuteButton
	Say (cmsgMeetingStatus_Unavailable, OT_ERROR)
	return
endIf
oRoot = FSUIAGetAncestorOfControlType (oMuteButton, UIA_ToolBarControlTypeId)
oRoot = FSUIAGetParentOfElement(oRoot)
oCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, UIAAutomationID_TeamsCameraButton)
oCameraButton = oRoot.findFirst(TreeScope_Descendants, oCondition)
oCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, UIAAutomationID_TeamsShareButton)
oShareButton = oRoot.findFirst(TreeScope_Descendants, oCondition)
if StringContainsCaseInsensitive (oMuteButton.name, cwnUnmute)
	sMuteStatus = cmsgMeetingStatus_Muted
else
	sMuteStatus = cmsgMeetingStatus_Unmuted
endIf
if StringContainsCaseInsensitive (oCameraButton.name, cwnTurnCameraOn)
	sCameraStatus = cmsgOff
else
	sCameraStatus = cmsgOn
endIf
if StringContainsCaseInsensitive (oShareButton.name, cwnStopSharing)
	sShareStatus = cmsgMeetingStatus_Sharing
else
	sShareStatus = cmsgMeetingStatus_NotSharing
endIf
SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, msgTeamsMeetingStatus_L, msgTeamsMeetingStatus_S, sMuteStatus, sCameraStatus, sShareStatus)
EndScript

Int Function IsWPFApplication()
return FSUIAGetFocusedElement ().frameworkID == FrameworkID_WPF
EndFunction

void function HandleFaceInViewLayerKeys(string sKeyName)
; FaceInView layer has one secondary layer, camera:
If StringCompare(sKeyName,KeyLayer_FaceInView_Cameras ) == 0 then
	let GlobalActiveLayer = CamerasLayerActive
	SayMessage(ot_status,cmsgCamerasLayer_Start)
endIf
EndFunction

string Function GetJAWSScriptLangDirectory()
var string sSettingsDirectory = GetJAWSSettingsDirectory ()
return StringSegmentReplace(sSettingsDirectory, cScDoubleBackSlash, -2, FolderName_Scripts)
EndFunction

collection Function ParseAttributes (string attributes)
var
	collection cAttributes,
	StringArray attribsAndValues,
	StringArray attribAndValue,
	int i

cAttributes = new collection
attribsAndValues = StringSplit (attributes, ";", true)
For i = 1 To ArrayLength (attribsAndValues)
	attribAndValue = StringSplit (attribsAndValues[i], ":", true)
	cAttributes[attribAndValue[1]] = attribAndValue[2]
EndFor
return cAttributes
EndFunction

string Function GetObjectIA2Attribute (string attributeName, optional int level)
if !attributeName
|| level < 0
	return cscNull
endIf
var collection cAttributes = ParseAttributes(GetObjectAttributes(level))
return cAttributes[attributeName]
EndFunction

int Function HasExplicitName(optional int level)
if GetObjectIA2Attribute ("explicit-name", level)
	return true
EndIf
return false
EndFunction

script ToggleSplitBufferedRefreshOnEnter()
ToggleSplitBufferedRefreshOnEnter()
endScript

;Equivalent of KeyMapChangedEvent but for Braille
void function BrailleKeySequenceEvent(string keyName, int status)
if status==KeySequencePending then
	if BrailleGetSplitMode() == brlSplitBufferedDocument then
		BrailleMessage(cmsgBrlSplitBufLayerFlash,0, -1)
	else
		; If split mode is not enabled, we should cancel the layered sequence
		sayMessage(OT_ERROR, cmsgBrailleSplitBufferError)
		CancelLayeredKeySequence()
	endIf
endIf
endFunction

script BrlSetSplitBufferBookmark(int n)
var
string msg
if BrailleIsMessageBeingShown () then
	BrailleClearMessage ()
endIf
if BrailleSetSplitBufferBookmark(n) then
	let msg=FormatString(cmsgSplitBufferBookmark,n)
	sayMessage(OT_JAWS_MESSAGE, msg)
else
	sayMessage(OT_ERROR, cmsgBrailleSplitBufferError)
endIf
endScript

script BraillePanToSplitBufferBookmark(int n)
if BrailleIsMessageBeingShown () then
	BrailleClearMessage ()
endIf
if BraillePanToSplitBufferBookmark(n) then
; The last two indices 255 and 256 are reserved for bookmarks to move to start and end of buffer
	if n==255 then
		sayMessage(OT_JAWS_MESSAGE, cmsgStartOfBuffer_L, cmsgStartOfBuffer_S, true)
	elif n==256 then
		sayMessage(OT_JAWS_MESSAGE, cmsgEndOfBuffer_L, cmsgEndOfBuffer_S, true)
	else
		sayinteger(n)
	endIf
elif BrailleGetSplitMode()==brlSplitBufferedDocument then
	var string msg=formatString(cmsgSplitBufferBookmarkNotSet,n)
	sayMessage(OT_ERROR, msg)
else
	sayMessage(OT_ERROR, cmsgBrailleSplitBufferError)
endIf
endScript

int function InModalDialog()
if !dialogActive() return false endIf
var int level = FindAncestorOfType(wt_dialog)
if !level return false endIf
if GetObjectIA2State(level) & IA2_STATE_MODAL return true endIf
return false
EndFunction

handle function GetNextWindowOfSameClass(handle hWnd)
if !hWnd return Null() endIf
var string class = GetWindowClass(hWnd)
hWnd = GetNextWindow(hWnd)
while hWnd
	if GetWindowClass(hWnd) == class
		return hWnd
	endIf
	class = GetWindowClass(hWnd)
	hWnd = GetNextWindow(hWnd)
endWhile
return Null()
EndFunction

void function InitBackgroundOCRRectCollection()
if !c_BackgroundOCRRect c_BackgroundOCRRect = new collection endIf
endFunction

int function HasBackgroundOCRRectChanged(int iNewLeft, int iNewTop, int iNewRight, int iNewBottom)
return iNewLeft != c_BackgroundOCRRect.left
|| iNewTop != c_BackgroundOCRRect.top
|| iNewRight != c_BackgroundOCRRect.right
|| iNewBottom != c_BackgroundOCRRect.bottom
endFunction

int function IsValidRect(int iLeft, int iTop, int iRight, int iBottom)
return (iRight - iLeft) > 0
&& (iBottom - iTop) > 0
endFunction

int function ShouldUpdateBackgroundOCRRect()
return c_BackgroundOCRRect.shouldUpdateRect
|| !c_BackgroundOCRRect.rectCached
endFunction

int function UpdateBackgroundOCRRectCollection(int iNewLeft, int iNewTop, int iNewRight, int iNewBottom)
if !IsValidRect(iNewLeft, iNewTop, iNewRight, iNewBottom) return false endIf
InitBackgroundOCRRectCollection()
if HasBackgroundOCRRectChanged(iNewLeft, iNewTop, iNewRight, iNewBottom)
	c_BackgroundOCRRect.rectCached = true
	c_BackgroundOCRRect.shouldUpdateRect = false
	c_BackgroundOCRRect.hasRectChanged = true
	c_BackgroundOCRRect.left = iNewLeft
	c_BackgroundOCRRect.top = iNewTop
	c_BackgroundOCRRect.right = iNewRight
	c_BackgroundOCRRect.bottom = iNewBottom
endIf
return true
endFunction

int function SetCustomBackgroundOCRRect()
;If you want to restrict Background OCR to a specific rectangle when the OCRAllInOne script is invoked,
;override this function to return the result of calling UpdateBackgroundOCRRectCollection with the custom rectangle coordinates.
return false
endFunction

int function SetBackgroundOCRRect()
if !ShouldUpdateBackgroundOCRRect()
	return true
endIf
if c_BackgroundOCRRect.restrictedToCustomRect
	if SetCustomBackgroundOCRRect()
		return true
	else
		PerformScript StopBackgroundRecognition()
		return false
	endIf
endIf
var
	Int iLeft,
	Int iRight,
	Int iBottom,
	Int iTop
if !GetWindowRect (hwndGlobalOCRBackgroundRecognition, iLeft, iRight, iTop, iBottom)
	return false
endIf
return UpdateBackgroundOCRRectCollection(iLeft, iTop, iRight, iBottom)
endFunction

; This function is called on schedule from OCRCompletedEvent
;ifHandleBackgroundOCR returns true.
void function BackgroundRecognitionHelper()
var
	Int iCanRecognize

If GlobalOCRJobID then
	Return
EndIf
Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize != OCR_SUCCESS
	Return
EndIf
If !SetBackgroundOCRRect()
	PerformScript StopBackgroundRecognition()
	return
endIf
if gBackgroundOCRSound
	; Play a discrete sound to let the user know this feature is on in the background.
	playsound(gBackgroundOCRSound)
endIf
GlobalOCRJobID = OCRScreenArea (c_BackgroundOCRRect.left, c_BackgroundOCRRect.top, c_BackgroundOCRRect.right, c_BackgroundOCRRect.bottom, gOCRPrimaryLang, gOCRSecondaryLang, gUseMicrosoftOcr, gMicrosoftOCRLang)
if giBackgroundOCRJustStarted
	giBackgroundOCRJustStarted = false
	if c_BackgroundOCRRect.restrictedToCustomRect
		InvisibleCursor (false)
		MoveTo (c_BackgroundOCRRect.left+1, c_BackgroundOCRRect.top+1)
	endIf
endIf
if c_BackgroundOCRRect.hasRectChanged
&& IsInvisibleCursor ()
	SetRestrictionToRect (c_BackgroundOCRRect.left, c_BackgroundOCRRect.top, c_BackgroundOCRRect.right, c_BackgroundOCRRect.bottom)
endIf
c_BackgroundOCRRect.hasRectChanged = false
EndFunction

; This function is called from the following functions:
;OCRCompletedEvent (to reschedule OCR),
;FocusChangedEventEx (to Cancel if alt tabbing away from this window),
;and from both StartBackgroundRecognition and StopBackgroundRecognition.
int function HandleBackgroundOCR(handle hwndFocus, handle hwndPrevFocus)
hwndFocus = GetTopLevelWindow (hwndFocus)
hwndPrevFocus = GetTopLevelWindow (hwndPrevFocus)
if !hwndGlobalOCRBackgroundRecognition
	return false
endIf
if hwndFocus==hwndPrevFocus then
	return true
endIf
if hwndPrevFocus !=0 && hwndPrevFocus==hwndGlobalOCRBackgroundRecognition
	unscheduleFunction(scheduleGlobalOCRBackgroundRecognitionID)
	CancelOCR (GlobalOCRJobID)
	SendBackgroundOCRTelemetryDataPoint(0)
	GlobalOCRJobID = 0
	ClearBackgroundOCRGlobals()
	return true
endIf
if hwndFocus  && hwndFocus == hwndGlobalOCRBackgroundRecognition
	scheduleGlobalOCRBackgroundRecognitionID=scheduleFunction("BackgroundRecognitionHelper", 5)
endIf
return true
endFunction

; This should be called from the OCR layer to start background recognition for the focused window.
script StartBackgroundRecognition(optional int serviceOptions)
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsScreenShadeOn () then
	sayMessage (OT_ERROR, msg_OCR_Unavailable_Screen_Shade)
	return
endIf
giBackgroundOCRJustStarted = true
; If it is already running, restart.
if IsBackgroundOCREnabled() then
	HandleBackgroundOCR(0, hwndGlobalOCRBackgroundRecognition)
endIf

if(serviceOptions & BackgroundOCRServiceOptions_PlaySound)
	gBackgroundOCRSound=GetSoundFileLocation ("TouchClick.wav")
else
	gBackgroundOCRSound = cscNull
endIf

sayMessage(OT_JAWS_MESSAGE, cmsgBackgroundOCRStarted_l, cmsgBackgroundOCRStarted_S)

hwndGlobalOCRBackgroundRecognition=GetTopLevelWindow (GetFocus())
; We may force Microsoft OCR for this feature since it is far superior for screen recognition.
gOCRPrimaryLang = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF)
gOCRSecondaryLang= ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF)
gUseMicrosoftOcr = TRUE; ReadSettingInteger (section_OCR, hKey_UseMicrosoftRecognitionLanguageForScreenArea, 0, FT_CURRENT_JCF)
gMicrosoftOCRLang= ReadSettingInteger (section_OCR, hKey_MicrosoftRecognitionLanguage, 1033, FT_CURRENT_JCF)
SendBackgroundOCRTelemetryDataPoint(1)
HandleBackgroundOCR(hwndGlobalOCRBackgroundRecognition, 0)
endScript

script StartBackgroundRecognitionWithSound()
PerformScript StartBackgroundRecognition(BackgroundOCRServiceOptions_PlaySound)
EndScript

;This should be called from the q OCR layer script if need be to cancel Background OCR.
script StopBackgroundRecognition()
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
sayMessage(OT_JAWS_MESSAGE, cmsgBackgroundOCRCancelled_l, cmsgBackgroundOCRCancelled_s)
HandleBackgroundOCR(0, hwndGlobalOCRBackgroundRecognition)
ClearBackgroundOCRGlobals()
endScript

void function ClearBackgroundOCRGlobals()
collectionRemoveAll(c_BackgroundOCRRect)
giBackgroundOCRJustStarted = false
gBackgroundOCRSound = cscNull
scheduleGlobalOCRBackgroundRecognitionID = 0
hwndGlobalOCRBackgroundRecognition = ghNull
endFunction

; This is called from the SayActiveCursor script to indicate when Background OCR is enabled for the JAWS cursor.
int function IsBackgroundOCREnabled()
return hwndGlobalOCRBackgroundRecognition
endFunction

string Function GetMessage (int iOutputType, string sLong, string sShort)
var
	int iSpeak = ShouldItemSpeak (iOutputType)
if iSpeak == message_long
	return sLong
elIf iSpeak == message_short
	return sShort
else
	return cscNull
EndIf
EndFunction

int function IsLink( int type )
return ( type == WT_LINK
|| type == WT_MailTo_link
|| type == wt_ftp
|| type == wt_ImageMap_link
|| type == WT_News_link
|| type == WT_THISPAGE_LINK );
EndFunction

Object Function GetAriaGridElement ()
return FSUIAGetAncestorOfARIARole (FSUIAGetFocusedElement (), ARIA_ROLE_GRID)
EndFunction

void function SayNameAndSizeOfGrid()
if !InAriaGrid() return endIf
var
	object oGrid = GetAriaGridElement (),
	string sName = oGrid.name
if sName
	SayMessage(OT_CONTROL_NAME,sName)
EndIf
SayTableOrGridColumnAndRowCountInfo()
SayTableCaptionAndSummary()
EndFunction

int Function ShouldSayAncestorAtLevel(int level, int type, int parentType, int focusRole, int focusType)
if level == 1
	if type == WT_LISTBOXITEM
		return false
	elif type == WT_LISTBOX
	&& FindAncestorOfType(WT_COMBOBOX) != -1
		return false
	endIf
endIf
if type == WT_TABLECELL
|| type == WT_COMBOBOX
|| type == WT_EDITCOMBO
|| type == WT_EDIT
|| type == WT_MULTILINE_EDIT
|| type == WT_DOCUMENT
	return false
elif type == WT_TABLE
&& focusType != WT_TABLECELL
	return false
elif 	type == WT_ROW
	return (GetObjectMSAAState(level) & STATE_SYSTEM_SELECTED)
elif type == WT_TREEVIEWITEM
&& (focusType == WT_TABLECELL || level > 0)
	return false
ElIf type == WT_LISTBOX
&& focusType == WT_LISTBOXITEM
&& StringContains(GetObjectName(SOURCE_DEFAULT, level), GetObjectName(SOURCE_DEFAULT, 0))
	; This is a hack based on a poorly coded page
	; fixes bug 63271 -- PB: Firefox 5: verbose combobox on - http://harkin.senate.gov/contact_opinion.cfm
	return false
elif type == WT_LISTBOXITEM
&& IsLink(focusType)
	return false
elif GetObjectRole(level) == IA2_ROLE_SECTION
&& !HasExplicitName(level)
	return false
endIf
return true
EndFunction

void function SayAncestorAtLevel(int level, int type, int parentType, int focusRole, int focusType)
if type == WT_LISTBOX
&& focusType != WT_LISTITEM
&& focusType != WT_LISTBOXITEM
&& GetObjectName(SOURCE_DEFAULT, level) != cscNull
	; this is an HTML list, not a list box.
	; but we still try to speak the list name, if there is one.
	SayControlEx(0, GetObjectName(SOURCE_DEFAULT, level))
ElIf type == WT_SEPARATOR
	Say(GetObjectName(SOURCE_DEFAULT, level), OT_CONTROL_NAME, false)
ElIf type == WT_ROW
	IndicateControlType (GetObjectSubTypeCode(SOURCE_DEFAULT, level), "", "")
	IndicateControlState (GetObjectSubTypeCode(SOURCE_DEFAULT, level), GetObjectStateCode (true, level), "")
elIf type == WT_GRID
	SayNameAndSizeOfGrid()
elif type == wt_table
&& !IsVirtualPCCursor()
	var string xmlRole = GetObjectIA2Attribute("xml-roles",level)
	if StringContains(StringLower(xmlRole), "grid")
		SayNameAndSizeOfGrid()
	endIf
elif type == wt_tabControl
&& GetObjectRole(level) == role_system_PageTabList
	;To be consistent with the virtual buffer, we will call this a group:
	IndicatecontrolType(wt_groupBox, GetObjectName(SOURCE_DEFAULT, level), cmsgSilent)
elif type == wt_toolbar
	SayObjectTypeAndText(level)
	SayTutorialHelpForObjectAtLevel(type, level)
Else
	SayObjectTypeAndText(level)
EndIf
EndFunction

int function inListDescendedFromCombo (int focusType)
return ((FocusType == WT_LISTBOX || focusType == WT_LISTBOXITEM)
&& FindAncestorOfType(WT_COMBOBOX) != -1)
endFunction

void function SayFocusAtLevel()
; DoSayObjectTypeAndTextFromLevel calls this after processing the ancestors.
;
; When focus moves to a combobox, we get a focus changed event moving focus to the listbox
; to handle this, we added the following statement.
; for drop down lists descended from edit combos, the type ends up as 0:
var int type = getObjectSubtypeCode(SOURCE_DEFAULT) ; explicitly set to focus
if InListDescendedFromCombo(type)
	if type == WT_LISTBOXITEM
		; SayObjectActiveItem causes the control to say "Read-only" instead of
		; just reading the name on up and down navigation.
		say(getObjectName(SOURCE_DEFAULT), OT_CONTROL_NAME)
	else
		SayObjectActiveItem(false)
	endIf
	return
EndIf
if HandleCustomWindows(GetCurrentWindow())
	NotifyIfContextHelp()
	return
EndIf
type = GetObjectSubtypeCode(2)
if type == wt_tabControl
&& GetObjectRole(1) == role_system_PageTabList
	;Do not include the container name when speaking the focus, that was already spoken:
	SayObjectTypeAndText(0,false)
	NotifyIfContextHelp()
	return
endIf
SayObjectTypeAndText()
NotifyIfContextHelp()
EndFunction

void function DoSayObjectTypeAndTextFromLevel(int level)
var
	int parentType,
	;FocusType and focusRole allow us to skip next selection event
	int focusType = GetObjectSubtypeCode(SOURCE_DEFAULT, 0),
	int focusRole = GetCurrentObject(0).accRole(0),
	int type = focusType
while level > 0
	parentType = type ; type will now be set to current type
	type = GetObjectSubtypeCode(SOURCE_DEFAULT, level)
	if ShouldSayAncestorAtLevel(level, type, parentType, focusRole, focusType)
		SayAncestorAtLevel(level, type, parentType, focusRole, focusType)
	EndIf
	level = level - 1
EndWhile
SayFocusAtLevel()
EndFunction

bool function PictureSmartPromptPreliminaryQuestion(string ByRef question)
if IsPictureSmartRestricted()
	Say (msg_picturesmart_restricted, OT_ERROR)
	return false
endIf
if InputBox(msg_picturesmart_preliminaryquestionprompt, cmsgPictureSmartLayer_Start, question) then
	return true
endIf
return false
EndFunction

void function ClearWinArrowGlobals()
if c_WinArrow.scheduleID
	UnScheduleFunction (c_WinArrow.scheduleID)
endIf
CollectionRemoveAll (c_WinArrow)
endFunction

void function ProcessWindowsPlusArrowKeyPress()
if !c_WinArrow c_WinArrow = new collection endIf
c_WinArrow.hWindow = GetAppMainWindow (GetFocus ())
c_WinArrow.display = GetDisplay(c_WinArrow.hWindow)
var
	object oWindow = FSUIAGetElementFromHandle(c_WinArrow.hWindow),
	object oWindowPattern = oWindow.GetWindowPattern(),
	string sScriptName
if oWindowPattern
	sScriptName = GetScriptAssignedTo (GetCurrentScriptKeyName ())
	if !oWindowPattern.canMaximize
	&& oWindowPattern.visualState == WindowVisualState_Normal
	&& sScriptName == "WindowsUpArrow"
		SayMessage (OT_ERROR, cmsgCannotMaximize_L, cmsgCannotMaximize_S)
	elIf !oWindowPattern.canMinimize
	&& sScriptName == "WindowsDownArrow"
		SayMessage (OT_ERROR, cmsgCannotMinimize_L, cmsgCannotMinimize_S)
	elIf !oWindow.GetTransformPattern()
		SayMessage (OT_ERROR, cmsgWindowNotResizable_L, cmsgWindowNotResizable_S)
	else
		c_WinArrow.scheduleID = ScheduleFunction ("SayWindowVisualState", 2, true)
	endIf
else
	SayMessage (OT_ERROR, cmsgWindowNotResizable_L, cmsgWindowNotResizable_S)
endIf
c_WinArrow.lastPress = GetTickCount ()
TypeCurrentScriptKey ()
endFunction

Script WindowsUpArrow()
ProcessWindowsPlusArrowKeyPress()
EndScript

Script WindowsDownArrow()
ProcessWindowsPlusArrowKeyPress()
EndScript

Script WindowsLeftArrow()
ProcessWindowsPlusArrowKeyPress()
EndScript

Script WindowsRightArrow()
ProcessWindowsPlusArrowKeyPress()
EndScript

void function SayWindowVisualState()
var
	handle hWindow,
	object oWindow,
	object oWindowPattern,
	string sVisualState,
	string sDisplay,
	int iOutputType = OT_STATUS,
	int iVisualState, int iLeft, int iTop, int iRight, int iBottom
if c_WinArrow.hWindow
	hWindow = c_WinArrow.hWindow
else
	hWindow = GetAppMainWindow(GetFocus())
endIf
oWindow = FSUIAGetElementFromHandle(hWindow)
oWindowPattern = oWindow.GetWindowPattern()
if !oWindowPattern
	SayMessage (OT_ERROR, cmsgWindowNotResizable_L, cmsgWindowNotResizable_S)
	return
endIf
iVisualState = oWindowPattern.visualState
iLeft = oWindow.BoundingRectangle.left
iTop = oWindow.BoundingRectangle.top
iRight = oWindow.BoundingRectangle.right
iBottom = oWindow.BoundingRectangle.bottom
if iVisualState == WindowVisualState_Normal
	if SayWindowSnap(hWindow, iLeft, iTop, iRight, iBottom)
		ClearWinArrowGlobals()
		return
	endIf
	sVisualState = cmsgWindowRestored
elIf iVisualState == WindowVisualState_Maximized
	sVisualState = cmsgWindowMaximized
elIf iVisualState == WindowVisualState_Minimized
	sVisualState = cmsgWindowMinimized
endIf
if GetScriptAssignedTo (GetCurrentScriptKeyName ()) == "SayWindowTitle"
	sDisplay = FormatString (cmsgWindowDisplay, IntToString(GetDisplay(hWindow)))
	sVisualState = FormatString (cmsgWindowVisualState, sVisualState, sDisplay)
	iOutputType = OT_USER_REQUESTED_INFORMATION
endIf
Say (sVisualState, iOutputType)
ClearWinArrowGlobals()
endFunction

int function SayWindowSnap(handle hWindow, int iNewLeft, int iNewTop, int iNewRight, int iNewBottom)
var
	int iWorkAreaLeft, int iWorkAreaTop, int iWorkAreaRight, int iWorkAreaBottom,
	int iWorkAreaWidth, int iWorkAreaHeight,
	int iWindowWidth, int iWindowHeight,
	int iNewDisplay,
	string sNewDisplay,
	string sSnapped

GetWorkAreaRect(hWindow, iWorkAreaLeft, iWorkAreaRight, iWorkAreaTop, iWorkAreaBottom)
iWorkAreaWidth = iWorkAreaRight - iWorkAreaLeft
iWorkAreaHeight = iWorkAreaBottom - iWorkAreaTop
iWindowWidth = iNewRight - iNewLeft
iWindowHeight = iNewBottom - iNewTop
iNewDisplay = GetDisplay(hWindow)
if iNewDisplay != c_WinArrow.display
	sNewDisplay = FormatString (cmsgWindowDisplay, IntToString(iNewDisplay))
endIf

if iNewLeft <= iWorkAreaLeft
&& iNewRight >= iWorkAreaRight
&& ((iWindowHeight*100)/iWorkAreaHeight) <= VerticalSnapPercentage
	;Full width, not full height
	if iNewTop <= iWorkAreaTop
	&& iNewBottom < iWorkAreaBottom
		;Snapped to top
		if ((iWindowHeight/2)*3) >= iWorkAreaHeight
			sSnapped = FormatString (cmsgWindowSnappedTwoThirds, cmsgWindowSnapTop, sNewDisplay)
		elIf iWindowHeight <= (iWorkAreaHeight/3)
			sSnapped = FormatString (cmsgWindowSnappedThird, cmsgWindowSnapTop, sNewDisplay)
		else
			sSnapped = FormatString (cmsgWindowSnappedHalf, cmsgWindowSnapTop, sNewDisplay)
		endIf
	elIf iNewBottom >= iWorkAreaBottom
	&& iNewTop > iWorkAreaTop
		;Snapped to bottom
		if ((iWindowHeight/2)*3) >= iWorkAreaHeight
			sSnapped = FormatString (cmsgWindowSnappedTwoThirds, cmsgWindowSnapBottom, sNewDisplay)
		elIf iWindowHeight <= (iWorkAreaHeight/3)
			sSnapped = FormatString (cmsgWindowSnappedThird, cmsgWindowSnapBottom, sNewDisplay)
		else
			sSnapped = FormatString (cmsgWindowSnappedHalf, cmsgWindowSnapBottom, sNewDisplay)
		endIf
	elIf iNewBottom < iWorkAreaBottom
	&& iNewTop > iWorkAreaTop
		;Snapped to middle
		sSnapped = FormatString (cmsgWindowSnappedThird, cmsgWindowSnapMiddle, sNewDisplay)
	endIf
elIf iNewTop <= iWorkAreaTop
&& iNewBottom >= iWorkAreaBottom
&& ((iWindowWidth*100)/iWorkAreaWidth) <= HorizontalSnapPercentage
	;Full height, not full width
	if iNewLeft <= iWorkAreaLeft
	&& iNewRight < iWorkAreaRight
	;Snapped to left
		sSnapped = FormatString (cmsgWindowSnappedHalf, cmsgWindowSnapLeft, sNewDisplay)
	elIf iNewLeft > iWorkAreaLeft
	&& iNewRight >= iWorkAreaRight
		;Snapped to right
		sSnapped = FormatString (cmsgWindowSnappedHalf, cmsgWindowSnapRight, sNewDisplay)
	endIf
elIf ((iWindowWidth*100)/iWorkAreaWidth) <= HorizontalSnapPercentage
&& ((iWindowHeight*100)/iWorkAreaHeight) <= VerticalSnapPercentage
	;Not full height or width
	if iNewLeft <= iWorkAreaLeft
	&& iNewTop <= iWorkAreaTop
	&& iNewRight < iWorkAreaRight
	&& iNewBottom < iWorkAreaBottom
		;Snapped to top left
		sSnapped = FormatString (cmsgWindowSnappedQuarter, cmsgWindowSnapTop, cmsgWindowSnapLeft, sNewDisplay)
	elIf iNewLeft > iWorkAreaLeft
	&& iNewTop <= iWorkAreaTop
	&& iNewRight >= iWorkAreaRight
	&& iNewBottom < iWorkAreaBottom
		;Snapped to top right:
		sSnapped = FormatString (cmsgWindowSnappedQuarter, cmsgWindowSnapTop, cmsgWindowSnapRight, sNewDisplay)
	elIf iNewLeft <= iWorkAreaLeft
	&& iNewTop > iWorkAreaTop
	&& iNewRight < iWorkAreaRight
	&& iNewBottom >= iWorkAreaBottom
		;Snapped to bottom left:
		sSnapped = FormatString (cmsgWindowSnappedQuarter, cmsgWindowSnapBottom, cmsgWindowSnapLeft, sNewDisplay)
	elIf iNewLeft > iWorkAreaLeft
	&& iNewTop > iWorkAreaTop
	&& iNewRight >= iWorkAreaRight
	&& iNewBottom >= iWorkAreaBottom
		;Snapped to bottom right:
		sSnapped = FormatString (cmsgWindowSnappedQuarter, cmsgWindowSnapBottom, cmsgWindowSnapRight, sNewDisplay)
	endIf
endIf
if sSnapped
	Say (sSnapped, OT_STATUS)
	return true
endIf
return false
endFunction

void function ListEnteredEvent(int itemCount, int nestingLevel)
var
	string message,
	string itemCountStr

if (itemCount < 1) then
	message = cmsgEnteringListNoItemCount
	else
	itemCountStr = IntToString(itemCount)
	if (nestingLevel > 0) then
		message = FormatString( cmsgEnteringNestedList, itemCountStr, IntToString ( nestingLevel))
	else
		message = FormatString(cmsgEnteringList,itemCountStr)
	EndIf
endIf
SayMessage( OT_ANNOUNCE_POSITION_AND_COUNT, message );
EndFunction

void function ListExitedEvent(int itemCount, int nestingLevel)
var
	string message
if (nestingLevel > 0) then
	message = FormatString( cmsgLeavingNestedList, IntToString ( nestingLevel))
else
	message = cmsgLeavingList
EndIf
SayMessage( OT_ANNOUNCE_POSITION_AND_COUNT, message );
EndFunction

void function MouseToTopLeft()
SaveCursor ()
JAWSCursor ()
MoveTo (1, 1)
RestoreCursor ()
endFunction

void function SpeakFSCompanionError(int status)
if (status == FSCompanionStatus_FailedToLaunch)
	SayMessage(OT_ERROR, msgFSCompanionError_FailedToLaunch)
elif (status == FSCompanionStatus_Restricted)
	SayMessage(OT_ERROR, msgFSCompanionError_Restricted)
elif (status == FSCompanionStatus_NotUserDesktop)
	SayMessage(OT_ERROR, msgFSCompanionError_NotUserDesktop)
elif (status == FSCompanionStatus_NotConnected)
	SayMessage(OT_ERROR, msgFSCompanionError_NotConnected)
endIf
endFunction

Script LaunchFSCompanion()
var int status = builtin::LaunchFSCompanion();
if (status != FSCompanionStatus_Ok)
	SpeakFSCompanionError(status)
endIf
EndScript

void function AddAskFSCompanionHotKeyLink()
UserBufferAddText(FormatString(msgAskFSCompanionHotKeyLink),
	cFuncLaunchFSCompanion,
	FormatString(msgAskFSCompanionHotKeyLink),
	cFont_Aerial, 12, ATTRIB_UNDERLINE, rgbStringToColor(cColor_BLUE), rgbStringToColor(cColor_White))
endFunction

script UILabeler()
var int aiLabelerEnabled = IsAILabelerGateEnabled()
if (aiLabelerEnabled) then
	PerformScript AILabeler()
	return
endif
PerformScript GraphicsLabeler()
EndScript

script AILabeler()
var
	Handle hCurrent = GetCurrentWindow (),
	Int iLeft,
	Int iRight,
	Int iBottom,
	Int iTop,
	Int recognitionResult,
	Int replaceLabel
if IsScreenShadeOn () then
	sayMessage(OT_ERROR, msg_ailabeler_UnavailableScreenShade)
	return
endIf
if !IsPictureSmartEnabled() then
	Return
endif
if gAILabelerRequestInProgress then
	SayMessage (OT_JAWS_MESSAGE, msg_ailabeler_inprogress)
	return
endIf

recognitionResult = IsTelemetryEnabled(TRUE);
if recognitionResult == PSResult_DemoMode then
	sayMessage(OT_ERROR,  msg_ailabeler_demomode)
elif recognitionResult != PSResult_Success then
	; no message needed since the function prompts
	return
endIf

AILabelerRequestStarted()

if IsVirtualPCCursor() then
	recognitionResult = RequestAILabelAtCursor()
elif GetObjectRect(iLeft, iRight, iTop, iBottom)
	recognitionResult =  RequestAILabelAtRect(iLeft, iTop, iRight, iBottom)
elif GetWindowRect (hCurrent, iLeft, iRight, iTop, iBottom)
	recognitionResult =  RequestAILabelAtRect(iLeft, iTop, iRight, iBottom)
endIf

if recognitionResult == PSResult_DemoMode then
	sayMessage(OT_ERROR, msg_ailabeler_demomode)
elif recognitionResult == PSResult_CursorModeIncorrect then
	sayMessage(OT_ERROR, msg_ailabeler_controlunsupported)
elif recognitionResult == PSResult_NoArea then
	sayMessage(OT_ERROR, msg_ailabeler_noarea)
elif recognitionResult != PSResult_Success then
	sayMessage(OT_ERROR, msg_ailabeler_failed)
endIf
EndScript

void function AILabelerProgress(Int state)
if state == ImageRecognition_Started then
	SayFormattedMessage (OT_STATUS, msg_ailabeler_inprogress)	; starting
elIf state == ImageRecognition_Processing then
	PlaySound(GetSoundFileLocation("Click2.wav"))				; same sound as OCR (see RecognitionDefinitions.h)
elIf state == ImageRecognition_StartError then
	SayFormattedMessage (OT_STATUS, msg_ailabeler_failed)		; play generic error
	AILabelerRequestComplete()
endIf
endFunction

void function SpeakAILabel(string label, string type, string state)
var string message = label + ", " + type
if (state)
	message = message + ", " + state
endIf
if (gAILabelerShouldUseCustomLabels)
	if (gAILabelerCustomLabel != cscNull)
		var string question = FormatString(msg_ailabeler_replacelabeldescription, gAILabelerCustomLabel, message)
		var int replaceLabel = ExMessageBox(question, msg_ailabeler_replacelabeltitle, MB_YESNO|MB_DEFBUTTON1)
		if replaceLabel == IDNO
			AILabelerRequestComplete()
			return
		endIf
	endIf
	SetCustomLabel(message, gAILabelerCustomLabelFile, gAILabelerCustomLabelSection, gAILabelerCustomLabelKey)
endIf
SayMessage(OT_USER_REQUESTED_INFORMATION, message)
AILabelerRequestComplete()
endFunction

void function SpeakAILabelError(int status)
if (status != AILabelResult_Success)
	SayMessage(OT_ERROR, msg_ailabeler_badresponse)
endIf
AILabelerRequestComplete()
endFunction

void function AILabelerRequestStarted()
gAILabelerRequestInProgress = true
gAILabelerScheduleRequestComplete = ScheduleFunction("AILabelerRequestComplete", 300)
if (ShouldUseCustomLabler(GetCurrentWindow()))
	gAILabelerShouldUseCustomLabels = true
	gAILabelerCustomLabelFile = GetCustomLabelFileName()
	gAILabelerCustomLabelSection = GetCustomLabelSectionName()
	gAILabelerCustomLabelKey = GetCustomLabelKey()
	gAILabelerCustomLabel = GetCustomLabel()
endIf
endFunction

void function AILabelerRequestComplete()
gAILabelerRequestInProgress = false
if gAILabelerScheduleRequestComplete then
	UnScheduleFunction(gAILabelerScheduleRequestComplete)
endIf
gAILabelerScheduleRequestComplete = 0
gAILabelerShouldUseCustomLabels = false
gAILabelerCustomLabelFile = ""
gAILabelerCustomLabelSection = ""
gAILabelerCustomLabelKey = ""
gAILabelerCustomLabel = ""
endFunction

Script ShowLabelManager()
if ShouldUseCustomLabler(getCurrentWindow()) then
	if (builtin::ShowLabelManager()) then
		Refresh()
	endIf
	return
else
	SayMessage(OT_ERROR, msgLabelManagerDialog_NotAvailable)
endIf
EndScript

void function ScreenSensitiveHelpForLabelManagerDialog()
var handle hWnd = GetCurrentWindow()
var int subtype = GetWindowSubTypeCode(hWnd)
var int id = GetControlId(hWnd)
if subtype == WT_LISTVIEW then
	ShowScreenSensitiveHelp(msgLabelManagerDialog_ListHelp)
elIf subtype == WT_BUTTON then
	if id == ID_EDIT_CUSTOM_LABEL_BUTTON  then
		ShowScreenSensitiveHelp(msgLabelManagerDialog_EditLabelHelp)
	ElIf id == ID_DELETE_CUSTOM_LABEL_BUTTON  then
		ShowScreenSensitiveHelp(msgLabelManagerDialog_DeleteLabelHelp)
	Else
		ScreenSensitiveHelpForKnownClasses(subtype)
	EndIf
	return
else
	ScreenSensitiveHelpForKnownClasses(subtype)
endIf
EndFunction

Script SwitchBrailleMathCode()
	if (IsSecureDesktop()) then
		return
	endIf

	if (!IsMathCatEnabled())
		return
	endIf

	if (!IsBrailleMathCodeAvailable())
		SayMessage(OT_ERROR, msgBrailleProfileNotSupported)
		return
	endIf

	; Switch between Nemeth (2) and UEB math (1) codes
	; Note default (0) is determined by speech language
	var string msg
	var int brailleMathCode = GetBrailleMathCode();
	if (brailleMathCode == 1)
		brailleMathCode = 2
		Let msg = msgNemeth
	else
		brailleMathCode = 1
		Let msg = msgUEBMath
	endIf
	SetBrailleMathCode(brailleMathCode)
	SayMessage(OT_Status, msg)
EndScript

string function GetContractedBrailleDisabledMessage()
	return msgContractedBrailleMustBeEnabled;
endFunction

script ToggleUnicodeBrailleInput()
var int setting = !GetJCFOption(OPT_BRL_INPUT_AS_UNICODE_BRAILLE)
SetJCFOption(OPT_BRL_INPUT_AS_UNICODE_BRAILLE, setting)
if setting
	Say(msgUnicodeBrailleInputOn, ot_status)
else
	Say(msgUnicodeBrailleInputOff, ot_status)
endIf
EndScript

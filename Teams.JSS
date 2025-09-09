; Copyright 2019 - 2025 by Freedom Scientific, Inc.
; Microsoft Teams script file

include "hjConst.jsh"
include "hjGlobal.jsh"
include "MSAAConst.jsh"
include "iAccessible2.jsh"
include "UIA.jsh"
include "common.jsm"
include "Magic.jsm"
include "tutorialHelp.jsm"
include "Teams.jsm"

import "Virtual.jsd"
import "UIA.jsd" ; cache of focused element
import "FSXMLDomFunctions.jsd"

const
	NoItemForNavigation = 0xffff, ;pass to NotifyNavigationFailed when there are no items to move to
	AutomationID_AppBar = "teams-app-bar",
	AutomationID_NewMessage_Prefix = "new-message",
	wc_ChromeRenderWindowClass = "Chrome_RenderWidgetHostHWND"

GLOBALS
	int giScheduledEnsureUseVPCIsSet,
	int suppressAncestorProcessing,
	int FocusRedirectUsingTab,
	int gbAutomaticVirtualizationActive,
	int giTeams_KeyRepeat,
	int giInCallOrMeetingDialog,
	int giTeamsBrailleRefreshScheduleID,
int giTeamsSplitModeValue,
int g_showChatHistoryWhileEditingMessage, 
object gmsxml,
int gScheduleCheckChatHistoryID,
	int giRestrictBackgroundOCRToSlideshow,
	int giHasSlideshowRectChanged,
	collection c_Slideshow
	; c_Slideshow caches things related to the slideshow element.
	; Members are:
	; int rectCached -- true if the slideshow rectangle is currently cached in the collection.
	; int left -- The left coordinate of the slideshow element.
	; int right -- The right coordinate of the slideshow element.
	; int top -- The top coordinate of the slideshow element.
	; int bottom -- The bottom coordinate of the slideshow element.

void function AutoStartEvent()
ManageAutomaticVirtualization(GetFocus())
ShowSoundMixerDiscoveryDialog()
giTeams_KeyRepeat = GetJCFOption (OPT_KEY_REPEAT)
	giInitialSplitModeValue=BrailleGetSplitMode()
if AppAllowedToChangeSplitMode() then
	BrailleSplitMode(giTeamsSplitModeValue)
	checkChatHistory()
endIf
if !EnsureUseVPCIsSet()
	;IsInsideARIAApplication is sometimes checked to soon and returns false.
	;Schedule a check to be sure.
	giScheduledEnsureUseVPCIsSet = ScheduleFunction ("EnsureUseVPCIsSet", 10, false)
endIf
if !(getRunningFSProducts () & (Product_Fusion | product_ZoomText))
	MouseToTopLeft()
endIf
EndFunction

void function AutoFinishEvent()
if giScheduledEnsureUseVPCIsSet
	UnScheduleFunction (giScheduledEnsureUseVPCIsSet)
	giScheduledEnsureUseVPCIsSet = false
endIf
DeactivateAutomaticWindowVirtualization(true)
SetJCFOption (OPT_KEY_REPEAT, giTeams_KeyRepeat)
if AppAllowedToChangeSplitMode() then
	BrailleSplitMode(giInitialSplitModeValue)
endIf
if giRestrictBackgroundOCRToSlideshow
	ClearBackgroundOCRGlobals()
endIf
EndFunction

int function EnsureUseVPCIsSet()
var
	int iUseVPC = GetJCFOption (OPT_VIRTUAL_PC_CURSOR),
	string sPath = StringConcatenate(GetJAWSSettingsDirectory (), cscDoubleBackslash, "Teams.jcf")
if IsInsideARIAApplication ()
	;Newer version of Teams that supports automatically switching to VPC when using Control+Enter to read chat messages
	if !iUseVPC
		IniWriteInteger (SECTION_OSM, hKey_UseVirtualPCCursor, 3, sPath, true, wdUser)
		giScheduledEnsureUseVPCIsSet = false
		return true
	endIf
else
	;Older version of Teams that does not support automatically switching to VPC when using Control+Enter to read chat messages
	if iUseVPC == 3
	&& giScheduledEnsureUseVPCIsSet
		IniRemoveKey (SECTION_OSM, hKey_UseVirtualPCCursor, sPath)
	endIf
endIf
giScheduledEnsureUseVPCIsSet = false
return false
endFunction

int function SayCellUnit(int UnitMovement)
if isVirtualPcCursor () && inTable () then ; probably the Control+Period hot keys help window
	return SayCellUnit (UnitMovement)
endIf
; to solve numerous table issues in Teams,
; outside the virtual cursor, table support shall not work, 
;but the keystrokes should pass through correctly.
typeCurrentScriptKey ()
return TRUE
endFunction

string function FindHotKey(optional string prompt)
if menusActive () return cscNull endIf
return FindHotKey (prompt)
endFunction

int function SupportsEditCallbacks ()
if ! getObjectSubtypeCode () && ! stringIsBlank (getObjectName ()) then
; custom static areas including incoming call and chat history list.
	return FALSE
endIf
return SupportsEditCallbacks ()
endFunction

int function CaretVisible ()
if ! getObjectSubtypeCode () && ! stringIsBlank (getObjectName ()) then
; custom static areas including incoming call and chat history list.
	return FALSE
endIf
return CaretVisible ()
endFunction

int function isDocumentObject (int level)
return (getObjectSubtypeCode(0, level) == WT_DOCUMENT
; getObjectSubtypeCode should return WT_Document here but does not always do so.
|| getObjectRole (level) == ROLE_SYSTEM_DOCUMENT
|| getObjectRole (level) == IA2_ROLE_SECTION)
&& stringStartsWith (getObjectValue(False, Level), "https://")
endFunction

int function isMessageDocumentObject (int level)
return (getObjectSubtypeCode(SOURCE_DEFAULT, level) == WT_DOCUMENT
|| getObjectRole (level) == ROLE_SYSTEM_DOCUMENT)
&& !StringStartsWith (getObjectValue(SOURCE_DEFAULT, Level), "https://")
&& StringStartsWith (GetObjectIA2Attribute ("id", level), "content-")
endFunction

int function ContextMenuProcessed(handle hWnd)
var
	int iSubtype,
	string sOwner
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
MenuModeHook ()
return true
EndFunction

void function sayObjectTypeAndText(optional int Level, int includeContainerName)
if isDocumentObject (level)
; Helps avoid some extra speech.
	return
endIf
if level == 0 && ! isVirtualPcCursor () && getObjectSubtypeCode () == WT_DOCUMENT then
; focus has just changed to the Chromium application.
; This is a bit different since MSAAMode option is set to 3, just like Chrome web browser.
	; This causes the current item with focus to read rather than the document.
	return
elIf level == 0 && ! getObjectSubtypeCode () then
; probably chat history list.
; want to avoid saying "region"
	say (getObjectName (), OT_CONTROL_NAME)
	return
elIf level == 0 && getObjectSubtypeCode () == WT_GROUPBOX then
; don't say "group", just say the name,
; these are the messages in a pop out chat window.
	say (getObjectName (), OT_CONTROL_NAME)
	return
endIf
sayObjectTypeAndText(Level, includeContainerName)
endFunction

int function ShouldProcessLiveRegion(string text, string attribs)
if giTeamsBrailleRefreshScheduleID != 0
	UnscheduleFunction(giTeamsBrailleRefreshScheduleID)
	giTeamsBrailleRefreshScheduleID = 0
endIf
if GetObjectSubTypeCode () == WT_BUTTON
&& IsDescendantOfToolBar ()
	giTeamsBrailleRefreshScheduleID = ScheduleFunction ("ScheduledBrailleRefresh", 5)
endIf
return ShouldProcessLiveRegion(text, attribs)
endFunction

int function SpeakLiveRegionEvent(string text, int suggestedOutputType, int containsSpeechMarkup)
; to handle where backspace doesn't always speak:
var string cleanedUpText = smmStripMarkup (text)
sayMessage (suggestedOutputType, CleanedUpText)
BrailleLiveRegionEventText (CleanedUpText, OT_HELP_BALLOON)
return TRUE
endFunction

int function InKeyboardShortcutsDialog(handle hWndFocus)
If GetWindowClass(hwndFocus) != wc_ChromeRenderWindowClass return false endIf
var int depth = GetAncestorCount()
var int i = 1
for i = 1 to depth
	if GetObjectSubtypeCode(false,i) == wt_dialog
	&& GetObjectDescription(false,i) == scKeyboardShortcuts
		return true
	endIf
endFor
return false
EndFunction

int function IsAutomaticVirtualizationActive()
; We use a global for managing automatic virtualization so that we don't interfere with user's toggling of the virtual cursor.
return gbAutomaticVirtualizationActive
EndFunction

void function ActivateAutomaticWindowVirtualization()
; We use a global for managing automatic virtualization so that we don't interfere with user's toggling of the virtual cursor.
gbAutomaticVirtualizationActive = true
var int iSetting = GetJCFOption(OPT_VIRTUAL_PC_CURSOR)
if iSetting == 1 return endIf
SetJCFOption(OPT_VIRTUAL_PC_CURSOR,1)
SayMessage(ot_status,msgVirtualCursorOn)
EndFunction

void function DeactivateAutomaticWindowVirtualization(int IsAutoFinish)
; We use a global for managing automatic virtualization so that we don't interfere with user's toggling of the virtual cursor.
gbAutomaticVirtualizationActive = false
var int iJCFSetting = GetJCFOptionFromFile(SECTION_OSM,hkey_UseVirtualPCCursor)
if iJCFSetting == 1 return endIf
SetJCFOption(OPT_VIRTUAL_PC_CURSOR,iJCFSetting)
if !IsAutoFinish
	SayMessage(ot_status,msgVirtualCursorOff)
endIf
EndFunction

void function ManageAutomaticVirtualization(handle hwndFocus)
if !InKeyboardShortcutsDialog(hWndFocus)
	if IsAutomaticVirtualizationActive()
		DeactivateAutomaticWindowVirtualization(false)
	endIf
	return
endIf
ActivateAutomaticWindowVirtualization()
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
ManageAutomaticVirtualization(hwndFocus)
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)

EnsureUseVPCIsSet()
if (nType == WT_DOCUMENT ) then
	RestrictViewToEnclosingType (nType)
	virtualCursorRestrictedEvent (hwndFocus, virtualCursorRestriction_Document)
	return
EndIf
if IsInaccesibleDocumentViewer() then
	SayMessage(OT_HELP, msgInaccessibleDocumentViewer_L, msgInaccessibleDocumentViewer_S)
	return
endIf
if nChangeDepth> 7
	giInCallOrMeetingDialog = InCallOrMeetingDialog()
endIf
if nChangeDepth> 1
	SetKeyRepeat()
endIf
if (nType == WT_TREEVIEW || nType == WT_TREEVIEWITEM)
	if nChangeDepth == -1 then
		return ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
	else ; want to speak the tree view's full type and text:
		return FocusChangedEvent(hwndFocus,hwndPrevFocus)
	endIf
endIf
return ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, 
	hwndPrevFocus, nPrevObject, nPrevChild,
	nChangeDepth, sClass, nType)
endFunction

int function SetDepthForFocusChangedEventProcessAncestors(handle FocusWindow, handle PrevWindow)
; Avoid the top level object which is the document:
return GetFocusChangeDepth();-2
endFunction

int function IgnoreObjectAtLevel (int level)
var
	int subtypeCode = getObjectSubtypeCode(0, level),
	int focusSubtypeCode = getObjectSubtypeCode (),
	int parentSubtypeCode = getObjectSubtypeCode(0, level+1)
if ! subtypeCode
|| subtypeCode == WT_DOCUMENT then return TRUE endIf
if level > 0
&& (subtypeCode == WT_TABCONTROL)
&& ! getObjectName(0, level) then
	return TRUE
endIf
if subtypeCode == WT_LISTBOX
&& parentSubtypeCode == WT_NAVIGATION_REGION then
; in toolbar and list box is superfluous and inaccurate.
	return TRUE
elIf subtypeCode == WT_LISTBOXITEM
&& parentSubtypeCode == WT_LISTBOX
&& (focusSubtypeCode == WT_BUTTON || focusSubtypeCode == WT_TOGGLE_BUTTON
; or on initial focus, the subtype may be document:
|| focusSubtypeCode == WT_DOCUMENT) THEN
; listBoxItem is parent of toolbar button.
	return TRUE
endIf
if focusSubtypeCode == WT_TREEVIEWITEM && subtypeCode == WT_TREEVIEWITEM then
; parents and grandparents are the branch node members of the tree.
	return TRUE
endIf
if level <= 5
&& getObjectRole (level) == 1060 
&& (getObjectRole () == 1060 || getObjectRole () == 20) then
	return stringContains (getObjectName(), getObjectName ())
endIf
if level > 1
&& subtypeCode == WT_GROUPBOX
&& StringStartsWith (GetObjectIA2Attribute ("id", level), "reply-chain-summary-")
	return true
endIf
return IgnoreObjectAtLevel (level)
endFunction

int function HandleCustomWindows (handle focusWindow)
if getObjectSubtypeCode () == WT_TREEVIEWITEM then
	FocusChangedEventProcessAncestors(FocusWindow, globalPrevFocus)
	return TRUE
endIf
return handleCustomWindows (focusWindow)
endFunction

int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
var
	int documentObjectHasFocus = isDocumentObject (0)
if documentObjectHasFocus then
	suppressAncestorProcessing = TRUE
endIf
if hwndFocus == hwndPrevFocus
&& nObject == nPrevObject
&& documentObjectHasFocus then
; FocusChange is firing twice and the first is invalid:
	suppressAncestorProcessing = TRUE
	return TRUE
endIf
if getAncestorCount () == 18 ; for chats and the Reply edit field
&& getObjectRole () == 1060 ; region
&& ! getObjectSubtypeCode () then
	;return ! stringStartsWith (GetObjectName (), scThreadedConversation) ; not reliable for multiple languages for the compare string doesn't come first:
	return ! stringContains (GetObjectName (), scThreadedConversation)
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
endFunction

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow,handle PrevWindow)
var
	int shouldProcessAncestors
if suppressAncestorProcessing then
	suppressAncestorProcessing = FALSE
	shouldProcessAncestors = FALSE
elIf isMessageDocumentObject (0)
	;allow document restriction through processsayfocuswindowonfocuschange/handlewebdocumentfocustransition pathway
	shouldProcessAncestors = FALSE
else
	shouldProcessAncestors = FocusChangedEventShouldProcessAncestors(FocusWindow,PrevWindow)
endIf
return shouldProcessAncestors
endFunction

Int Function ShouldSpeakItemAtLevel (int level, int type, int parentType, int focusRole, int focusType)
if level > 0 && type == WT_TABCONTROL && focusType == WT_TABCONTROL
&& stringIsBlank (getObjectName(0, level)) then
; get rid of empty tab speaking from hierarchy
	return FALSE
endIf
return ShouldSpeakItemAtLevel (level, type, parentType, focusRole, focusType)
endFunction



string function getChatParticipantStatusFromMainWindow (object XmlDomDoc)
if (! XmlDomDoc) return cscNull endIf
var string selectNodeSpec = "//Element[@class ='one-on-one header-v2-title-container person-card-hover']"
var object ChatParticipant = XmlDomDoc.SelectSingleNode (SelectNodeSpec )
if (! ChatParticipant) return cscNull endIf
selectNodeSpec = "//Div[@class='app-avatar-container']"
var object status = ChatParticipant.SelectSingleNode(SelectNodeSpec)
if (!status) return cscNull endIf
return Status.Text
endFunction

string function getChatParticipantStatusFromPopoutChat  (object XmlDomDoc)
if (! XmlDomDoc) return cscNull endIf
; the popout windows have dynamic classes and IDs based on the participants.
; So we use different criteria to filter for first the region and then the appropriate graphic.
var string SelectNodeSpec
SelectNodeSpec = "//Region[@labelledby='chat-header-reader-text']"
var object ChatParticipant = XmlDomDoc.SelectSingleNode(SelectNodeSpec)
if (! ChatParticipant) return cscNull endIf
; The graphic is 2 of 2, where the invalid one has a value 'block' for the display attribute.
selectNodeSpec = "//Div/Graphic[@display='flex']"
var object statusGraphic = ChatParticipant.SelectSingleNode(SelectNodeSpec)
if (! StatusGraphic) return cscNull endIf
var object attribs = StatusGraphic.Attributes
if (! attribs) return cscNull endIf
; for this graphic, there is no alt text or other attribute, but FSText gives it to us:
return attribs.GetNamedItem("fsText").NodeValue
endFunction

string function GetChatParticipantStatus ()
var object XMLDomDoc = GetFSXMLDomDoc ()
if (!XMLDomDoc) return cscNull EndIf
var string statusText = getChatParticipantStatusFromMainWindow (XMLDomDoc)
if stringIsBlank (StatusText) then
	statusText = getChatParticipantStatusFromPopoutChat (XMLDomDoc)
endIf
return StatusText
endFunction

void function SayWindowTitleForApplication(handle hAppWindow, handle hRealWindow, handle hCurrentWindow, int iTypeCode)
; appends the chat status if available as a separate entry to the title.
;Both the title and the chat status (if available) will both be on the Braille display because of BeginFlashMessage and EndFlashMessage.
beginFlashMessage ()
SayWindowTitleForApplication(hAppWindow, hRealWindow, hCurrentWindow, iTypeCode)
var string statusInfo = GetChatParticipantStatus ()
if ! stringIsBlank (statusInfo ) then
	sayMessage (OT_USER_REQUESTED_INFORMATION, statusInfo )
endIf
endFlashMessage ()
endFunction

script scriptFileName ()
scriptAndAppNames (msgConfigName)
endScript

void function SayLine  (optional int iDraw, int bDoNotUseObjInfo)
if isPcCursor () && ! isVirtualPcCursor ()
if IsInaccesibleDocumentViewer() then
	SayMessage(OT_HELP, msgInaccessibleDocumentViewer_L, msgInaccessibleDocumentViewer_S)
	return
endIf
	if getObjectSubtypeCode () == WT_DOCUMENT then
		return
	endIf
endIf
SayLine  (iDraw, bDoNotUseObjInfo)
endFunction

Void Function GetTextInfoForControlBackSpace (string ByRef text)
text = GetPriorWord (false)
EndFunction

Script ControlBackSpace ()
var	string sText
GetTextInfoForControlBackSpace(sText)
if sText
	SayMessage(ot_line,sText)
endIf
TypeCurrentScriptKey ()
EndScript

script VirtualizeCurrentControl ()
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
sText = getObjectName ()
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
sText = getObjectName ()
if !sText then
		let sText=GetTypeAndTextStringsForWindow(getFocus())
endIf
if !sText then
	SayMessage(OT_ERROR,cmsgNoTextToVirtualize_L,cmsgNoTextToVirtualize_S)
	return
endIf
CopyToClipboard (sText)
sayMessage(ot_JAWS_Message,cmsgCopyControl_L,cmsgCopyControl_S)
endScript

int function clickButtonUsingDOM(string buttonName, optional string attribute)
var
	int left,
	int right,
	int top,
	int bottom
; button and label should not be localized hence they are not in the messages file.
; if optional parameter is not filled in, it is set to "label", which can change.
if stringIsBlank (attribute) attribute = "label" endIf
return PerformActionOnElementWithTagAndAttribute (2, "BUTTON", attribute, buttonName, left, top, right, bottom)
endFunction

int function IsInaccesibleDocumentViewer()
return GetObjectRole (0)==ROLE_SYSTEM_APPLICATION 
&&(StringContains(GetObjectName(),scInaccessibleDocViewer)
; in the new full screen viewer, when first opened, GetObjectName can be empty.
; fortunately, we always have a FSUIA cache of the focused object and its name is exactly what we want.
|| StringContains(FSUIAGetFocusedElement().name,scInaccessibleDocViewer))
endFunction
  
script UpALevel()
if IsInaccesibleDocumentViewer() then
	SayCurrentScriptKeyLabel()
	clickButtonUsingDOM(scBackButton, "title")
else
	performScript UpALevel()
endIf
endScript

script BackButton()
sayMessage(OT_JAWS_MESSAGE, msgBack)
clickButtonUsingDOM(scBackButton, "title")
endScript

script SelectATab()
var
string tabList,
int vpcValue,
int index,
int indicateFormsModeWithSound

indicateFormsModeWithSound=GetJCFOption(OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE) 
SetJCFOption(OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE, 0) 
GiIgnoreFormsModeSpeak =true

vpcValue=getJCFOption(OPT_VIRTUAL_PC_CURSOR)
setJCFOption(OPT_VIRTUAL_PC_CURSOR ,true)

tabList=GetListOfFormFields (LIST_ITEM_SEPARATOR, WT_TABCONTROL)
index=DlgSelectItemInList (tabList, cMsgSelectATab, false, 0, "", -1)
if MoveToFormFieldByIndex (index, WT_TABCONTROL) then
	leftMouseButton()
endIf
setJCFOption(OPT_VIRTUAL_PC_CURSOR ,vpcValue)
SetJCFOption(OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE, indicateFormsModeWithSound) 
GiIgnoreFormsModeSpeak =false
endScript

script FocusToTabN()
var
string tabList,
string keyName,
int vpcValue,
int index,
int indicateFormsModeWithSound

keyName=GetCurrentScriptKeyName()

indicateFormsModeWithSound=GetJCFOption(OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE) 
SetJCFOption(OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE, 0) 
GiIgnoreFormsModeSpeak =true

vpcValue=getJCFOption(OPT_VIRTUAL_PC_CURSOR)
setJCFOption(OPT_VIRTUAL_PC_CURSOR ,true)
tabList=GetListOfFormFields (LIST_ITEM_SEPARATOR, WT_TABCONTROL)

index=StringToInt(StringRight(keyName,1))

if MoveToFormFieldByIndex (index, WT_TABCONTROL) then
	leftMouseButton()
else
	sayMessage(OT_ERROR, msgTabNotFound)
endIf
setJCFOption(OPT_VIRTUAL_PC_CURSOR ,vpcValue)
SetJCFOption(OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE, indicateFormsModeWithSound) 
GiIgnoreFormsModeSpeak =false
endScript

script SelectAButton()
var
string buttonList,
int vpcValue,
int index

vpcValue=getJCFOption(OPT_VIRTUAL_PC_CURSOR)
setJCFOption(OPT_VIRTUAL_PC_CURSOR ,true)
buttonList=GetListOfFormFields (LIST_ITEM_SEPARATOR, WT_BUTTON)
index=DlgSelectItemInList (buttonList, cMsgSelectAButton, false, 0, "", -1)
if MoveToFormFieldByIndex (index, WT_BUTTON) then
		leftMouseButton()
endIf
setJCFOption(OPT_VIRTUAL_PC_CURSOR ,vpcValue)
endScript

script HotKeyHelp()
if JAWSHotKeys() then
	return 
endIf
		If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (OT_USER_BUFFER,msgTeamsHotKeyHelp, msgTeamsHotKeyHelp)
endScript

script WindowKeysHelp ()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (OT_USER_BUFFER, msgTeamsWindowKeysHelp, msgTeamsWindowKeysHelp)
endScript

script GoToTree()
var
int left,
int right,
int top,
int bottom

if !PerformActionOnElementWithTagAndAttribute (3, "UL", "acc-role-dom", "tree", left, top, right, bottom) then
	sayMessage(OT_ERROR, msgTreeNotVisible_l, msgTreeNotVisible_S)
endIf
endScript

script LaunchKeyboardShortcutsDialog ()
sayFormattedMessage (OT_ERROR, msgKeyboardShortcutsDialogInsertWInstead)
TypeCurrentScriptKey ()
endScript

void function ObjStateChangedEvent(handle hObj, optional int iObjType, int nChangedState, int nState, int nOldState)
if iObjType == WT_TREEVIEWITEM
&& GetObjectStateCode () == nState
&& GetObjectName(SOURCE_CACHED_DATA, 3) == scChatList
	;remove speaking of initial chat item before speaking the chat being moved to
	return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

Void Function ScheduledBrailleRefresh ()
giTeamsBrailleRefreshScheduleID = 0
BrailleRefresh ()
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,optional int bIsFocusObject)
if IsChatInputElement() then
	ScheduleFunctionCheckChatHistory()
endIf
if bIsFocusObject
	if nObjType == WT_EDITCOMBO
		if !IsSearchInputElement ()
			Say(sObjValue, ot_line, smartMarkupDetection)
		endIf
		return
	endIf
endIf
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

Int Function InCallOrMeetingDialog ()
var
	object oAutomationIDCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, UIAAutomationID_TeamsMuteButton),
	object oRoot = FSUIAGetElementFromHandle (GetFocus ()),
	object oMuteButton
oMuteButton = oRoot.findFirst(TreeScope_descendants, oAutomationIDCondition)
if oMuteButton return true endIf
return false
EndFunction

Void Function SetKeyRepeat ()
var int iType = GetObjectSubTypeCode ()
if (iType != WT_MULTILINE_EDIT
|| IsVirtualPCCursor())
&& giInCallOrMeetingDialog
	SetJCFOption (OPT_KEY_REPEAT, OFF)
else
	SetJCFOption (OPT_KEY_REPEAT, giTeams_KeyRepeat)
endIf
EndFunction

int function GetLevelForTabList()
var
	int iCount = GetAncestorCount (),
	int i
For i = 1 to iCount
	if GetObjectRole (i) == ROLE_SYSTEM_PAGETABLIST
		return true
	endIf
endFor
return ScriptFunctionReturnError
endFunction

String Function GetTutorMessageForTabItem ()
var
	int level = GetLevelForTabList(),
	int state = GetObjectIA2State(level)
if state & IA2_STATE_HORIZONTAL
	return msgHorizontalMenu + cscSpace + msgEnterButton
elIf state & IA2_STATE_VERTICAL
	return msgMenu + cscSpace + msgEnterButton
else
	return msgEnterButton
endIf
EndFunction

Int Function IsDescendantOfToolBar ()
var
	int iCount = GetAncestorCount (),
	int i
For i = 1 to iCount
	if GetObjectRole (i) == ROLE_SYSTEM_TOOLBAR
		return true
	endIf
endFor
return false
EndFunction

Int Function IsDescendantOfAppBar ()
var
	int iCount = GetAncestorCount (),
	int i
For i = 1 to iCount
	if GetObjectAutomationId (i) == AutomationID_AppBar
		return true
	endIf
endFor
return false
EndFunction

string function GetCustomTutorMessage()
if IsVirtualPCCursor () return GetCustomTutorMessage() endIf
var
	int iSubtypeCode = getObjectSubtypeCode (),
	string sMessage
if iSubtypeCode == WT_TabControl
	return  GetTutorMessageForTabItem ()
endIf
if IsDescendantOfToolBar ()
	sMessage = msgHorizontalMenu
elIf IsDescendantOfAppBar ()
	sMessage = msgMenu
endIf
if iSubtypeCode == WT_SPLITBUTTON
; some split buttons identify as subtype code ButtonMenu in Teams, but announce as split buttons and behave as such:
|| iSubtypeCode == WT_ButtonMenu then
	sMessage = sMessage + cscSpace + msgTeamsSplitButtonTutorHelp
endIf
if !StringIsBlank (sMessage)
	return sMessage
endIf
	return GetCustomTutorMessage()
EndFunction

Void Function SayTutorialHelp (int iObjType,optional  int IsScriptKey)
var
	string sCustomTutor = GetCustomTutorMessage (),
	int iSpeak = GetTutorialHelpOutputType(IsScriptKey)
if !StringIsBlank (sCustomTutor)
	SayUsingVoice (VCTX_MESSAGE, sCustomTutor, iSpeak)
	if iObjType == WT_TabControl
	|| iObjType == WT_SPLITBUTTON
	|| iObjType == WT_ButtonMenu then
		return
	endIf
endIf
;Scoping to default is necessary to prevent SayTutorialHelp from using the same GetCustomTutorMessage twice
default::SayTutorialHelp (iObjType,IsScriptKey)
EndFunction

void function ScheduleFunctionCheckChatHistory()
if gScheduleCheckChatHistoryID then
unscheduleFunction(gScheduleCheckChatHistoryID)
endIf
gScheduleCheckChatHistoryID=ScheduleFunction("CheckChatHistory", 10)
endFunction

void function checkChatHistory()
var
int inChatEdit=IsChatInputElement()
if !g_showChatHistoryWhileEditingMessage  || !inChatEdit then
	if BrailleGetSplitMode()==brlSplitScriptDefined then
		BrailleSplitMode(giInitialSplitModeValue)
		giTeamsSplitModeValue =giInitialSplitModeValue
	EndIf
	return
endIf
if inChatEdit then
	if BrailleGetSplitMode()!=brlSplitScriptDefined then
		BrailleSplitMode(brlSplitScriptDefined)
		giTeamsSplitModeValue =brlSplitScriptDefined
	endIf
	updateCachedMessages()
EndIf
endFunction

String Function GetRecentMessage (int iRecentMessage, optional object XMLDomDoc)
if !XMLDomDoc
	XMLDomDoc = GetFSXMLDomDoc()
endIf
iRecentMessage = iRecentMessage -1
var
	string sMessageSpec = "//Div[@id='chat-pane-list']/Div[contains(@class, 'fui-Primitive')][position() = last()-" + IntToString(iRecentMessage) + "]/child::*",
	object oMessageNode = XMLDomDoc.selectNodes(sMessageSpec),
	object node,
	string sText,
	string sMessage
ForEach node in oMessageNode
                sText = StringTrimLeadingAndTrailingBlanks (node.text)
                if !StringIsBlank (sText)
                if StringSegmentCount (sText, cscSpace) == 2
                && StringSegment (sText, cscSpace, 1) == "Link"
                                sText = StringSegment (sText, cscSpace, -1)
                endIf
                                sMessage = sMessage + sText + cScBufferNewLine
                endIf
EndForEach
return sMessage
EndFunction

string function GetRecentMessages()
var
	object XMLDomDoc = GetFSXMLDomDoc(),
	string msgs,
	string msg,
	int index

for index = 1 to 5
	msg=GetRecentMessage (index, XMLDomDoc)
	if msg != cscNull then
	msg=StringReplaceChars (msg, "\r\n", cscSpace)
	msgs=msgs+cScBufferNewLine 
	msgs=msgs+msg
	else
	return msgs
	endIf
endFor

return msgs
endFunction
globals
string cachedMessages

void function updateCachedMessages()
cachedMessages = GetRecentMessages()
endFunction


string function BrailleGetTextForSplitMode()
if IsChatInputElement() then
		return cachedMessages
endIf
return ""
endFunction

int function SwitchToScriptedAppView(int scriptedAppViewIndex)
; This function should be overridden in an app's script set to control a scripted Braille view.
var int changed=scriptedAppViewIndex!=g_showChatHistoryWhileEditingMessage 
g_showChatHistoryWhileEditingMessage =!g_showChatHistoryWhileEditingMessage 
if g_showChatHistoryWhileEditingMessage then
; Force it to become active immediately.
	checkChatHistory()
endIf
return changed
endFunction

int function GetScriptedAppViewIndex()
; return a 1-based index of the active scripted view.
; If no active scripted view, return 0 so it is no longer highlighted.
if g_showChatHistoryWhileEditingMessage then
	return 1
else
	return 0
endIf
endFunction

string function GetScriptedAppViews()
;Override this in an app's script set to return a delimited list of scripted views. e.g. "Message list + message preview|..."
; In our case we'll just have one view but change it from on to off.
if g_showChatHistoryWhileEditingMessage then
	return FormatString(msgBrailleSplitChatView, cmsgOn)
else
	return FormatString(msgBrailleSplitChatView, cmsgOff)
endIf
endFunction

void function BrailleSplitModeChangedEvent()
giTeamsSplitModeValue = BrailleGetSplitMode()
if giTeamsSplitModeValue >=brlSplitBufferedDocument && giTeamsSplitModeValue  <=brlSplitWindow then
; User has just switched modes, turn off scripted app view.
	g_showChatHistoryWhileEditingMessage =0
endIf
if !g_showChatHistoryWhileEditingMessage then
	giInitialSplitModeValue=giTeamsSplitModeValue
endIf
endFunction

int Function IsChatInputElement ()
return StringStartsWith (GetObjectIA2Attribute ("id"), "new-message")
EndFunction

int Function IsSearchInputElement ()
return GetObjectIA2Attribute ("id") == "ms-searchux-input"
EndFunction

int function IsEmptyEditFormField(optional int bWhiteSpaceIsText)
if !IsChatInputElement()
	return IsEmptyEditFormField (bWhiteSpaceIsText)
endIf
var string sText = GetXMLDomNodeText (GetXMLDomDocFocusElement ())
if !bWhiteSpaceIsText then
	let sText = stringStripAllBlanks(sText)
EndIf
return !StringLength(sText)
|| StringCompare(sText,"\160") == 0
EndFunction

Script MoveToToolBar()
var
	string sItemSpec
if giInCallOrMeetingDialog
	;Set focus to the mute button
	sItemSpec = StringConcatenate("//Button[@id='", UIAAutomationID_TeamsMuteButton, "']")
else
	;Set focus to the first item in the first tool bar
	sItemSpec = "//ToolBar[1]//*[@fsFocusable='true']"
endIf
SetFocusToXMLDomDocItem(sItemSpec)
EndScript

Script MeetingStatus ()
if !giInCallOrMeetingDialog
	PerformScript MeetingStatus ()
	return
endIf
var
	object oXMLDomDoc = GetFSXMLDomDoc(),
	object oMuteNode = oXMLDomDoc.selectSingleNode("//Button[@id='"+UIAAutomationID_TeamsMuteButton+"']"),
	object oCameraNode = oXMLDomDoc.selectSingleNode("//Button[@id='"+UIAAutomationID_TeamsCameraButton+"']"),
	object oShareNode = oXMLDomDoc.selectSingleNode("//Button[@id='"+UIAAutomationID_TeamsShareButton+"']"),
	string sMute = GetXMLDomNodeText(oMuteNode),
	string sCamera = GetXMLDomNodeText(oCameraNode),
	string sShare = GetXMLDomNodeText(oShareNode),
	string sMuteStatus,
	string sCameraStatus,
	string sShareStatus
if StringIsBlank (sMute)
|| StringIsBlank (sCamera)
	Say (cmsgMeetingStatus_Unavailable, OT_ERROR)
	return
endIf
if StringContainsCaseInsensitive (sMute, cwnUnmute)
	sMuteStatus = cmsgMeetingStatus_Muted
else
	sMuteStatus = cmsgMeetingStatus_Unmuted
endIf
if StringContainsCaseInsensitive (sCamera, cwnTurnCameraOn)
	sCameraStatus = cmsgOff
else
	sCameraStatus = cmsgOn
endIf
if StringContainsCaseInsensitive (sShare, cwnStopSharing)
	sShareStatus = cmsgMeetingStatus_Sharing
else
	sShareStatus = cmsgMeetingStatus_NotSharing
endIf
SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, msgTeamsMeetingStatus_L, msgTeamsMeetingStatus_S, sMuteStatus, sCameraStatus, sShareStatus)
EndScript

int Function InOpenChat (object ByRef XMLDomDoc)
var
	string sItemSpec = "//Div[@id='chat-pane-list']",
	object oChatContainerNode
if IsVirtualDocumentViewRestricted ()
	XMLDomDoc = GetFSXMLDomDocUnrestricted()
else
	XMLDomDoc = GetFSXMLDomDoc()
endIf
oChatContainerNode = XMLDomDoc.selectSingleNode(sItemSpec)
if !oChatContainerNode
	return false
endIf
return true
EndFunction

Script RecentMessage (int iMsg)
var object XMLDomDoc
if !InOpenChat (XMLDomDoc)
	SayMessage (OT_ERROR, msgNotInChat_L, msgNotInChat_S)
	return
endIf
Var string sMessage = GetRecentMessage(iMsg, XMLDomDoc)
if StringIsBlank (sMessage)
	SayFormattedMessage (OT_ERROR, msgNoMessage_L, msgNoMessage_S, IntToString(iMsg))
	return
endIf
if IsSameScript ()
	SayMessage(OT_USER_BUFFER, sMessage)
else
	SayMessage(OT_USER_REQUESTED_INFORMATION, sMessage)
endIf
EndScript

int function GetSharedContentRect(int byref iLeft, int byref iTop, int byref iRight, int byref iBottom)
if !giInCallOrMeetingDialog return false endIf
var
	object oNameCondition = FSUIACreateStringPropertyCondition (UIA_NamePropertyID, scContentSharedBy, PropertyConditionFlags_MatchSubstring|PropertyConditionFlags_IgnoreCase),
	object oTypeCondition = FSUIACreateIntPropertyCondition (UIA_ControlTypePropertyID, UIA_MenuItemControlTypeId),
	object oAndCondition = FSUIACreateAndCondition(oTypeCondition, oNameCondition),
	object oRoot = FSUIAGetElementFromHandle(GetFocus()),
	object oSharedContent = oRoot.findFirst(TreeScope_Descendants, oAndCondition)
if !UIAElementHasValidRect(oSharedContent) return false endIf
iLeft = oSharedContent.BoundingRectangle.left
iTop = oSharedContent.BoundingRectangle.top
iRight = oSharedContent.BoundingRectangle.right
iBottom = oSharedContent.BoundingRectangle.bottom
return true
endFunction

int function GetSlideshowRect(int byref iLeft, int byref iTop, int byref iRight, int byref iBottom)
if !giInCallOrMeetingDialog return false endIf
var
	object oSlideshowIdCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, "slideshow-app-container"),
	object oRoot = FSUIAGetElementFromHandle(GetFocus()),
	object oSlideshow = oRoot.findFirst(TreeScope_Descendants, oSlideshowIdCondition)
if !oSlideshow return false endIf
var
	object oImageTypeCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ImageControlTypeId),
	object oImage = oSlideshow.findFirst(TreeScope_Children, oImageTypeCondition)
	if !UIAElementHasValidRect(oImage) return false endIf
iLeft = oImage.BoundingRectangle.left
iTop = oImage.BoundingRectangle.top
iRight = oImage.BoundingRectangle.right
iBottom = oImage.BoundingRectangle.bottom
return true
endFunction

void function PictureSmartAllInOneTeams (int serviceOptions)
var
	int left, int top, int right, int bottom
if GetSlideshowRect(left, top, right, bottom)
	PictureSmartWithAreaShared(serviceOptions, left, top, right, bottom)
	return
endIf
if GetSharedContentRect(left, top, right, bottom)
	PictureSmartWithAreaShared(serviceOptions, left, top, right, bottom)
	return
endIf
PerformScript PictureSmartWithControl(serviceOptions)
EndFunction

script PictureSmartAllInOne (optional int serviceOptions)
PictureSmartAllInOneTeams (PSServiceOptions_Single | serviceOptions)
endScript

script PictureSmartAllInOneAskPrelim ()
PerformScript  PictureSmartAllInOne (PSServiceOptions_AskPrelim)
endScript

script PictureSmartAllInOneMultiService (optional int serviceOptions)
PictureSmartAllInOneTeams (PSServiceOptions_Multi | serviceOptions)
endScript

script PictureSmartAllInOneMultiServiceAskPrelim (optional int serviceOptions)
PerformScript  PictureSmartAllInOneMultiService (PSServiceOptions_AskPrelim)
endScript

int function SetCustomBackgroundOCRRect()
if !giInCallOrMeetingDialog return false endIf
var
	int iLeft, int iRight, int iTop, int iBottom
if !GetSharedContentRect(iLeft, iTop, iRight, iBottom)
	if !GetSlideshowRect(iLeft, iTop, iRight, iBottom)
		return false
	endIf
endIf
return UpdateBackgroundOCRRectCollection(iLeft, iTop, iRight, iBottom)
endFunction

object function GetFSXMLDomDoc()
if IsVirtualPCCursor ()
	return GetFSXMLDomDoc()
endIf
var
	int iUseVPC = GetJCFOption (OPT_VIRTUAL_PC_CURSOR),
	object XMLDomDoc
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
XMLDomDoc = GetFSXMLDomDoc()
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, iUseVPC)
return XMLDomDoc
endFunction

object function GetFSXMLDomDocUnrestricted()
if IsVirtualPCCursor ()
	return GetFSXMLDomDocUnrestricted()
endIf
var
	int iUseVPC = GetJCFOption (OPT_VIRTUAL_PC_CURSOR),
	object XMLDomDoc
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
XMLDomDoc = GetFSXMLDomDocUnrestricted()
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, iUseVPC)
return XMLDomDoc
endFunction

int function PerformActionOnElementWithID(int action, int uniqueID, optional int ByRef left, int ByRef top, int ByRef right, int ByRef bottom)
if IsVirtualPCCursor ()
	return PerformActionOnElementWithID(action, uniqueID, left, top, right, bottom)
endIf
var
	int iUseVPC = GetJCFOption (OPT_VIRTUAL_PC_CURSOR),
	int result
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
result = PerformActionOnElementWithID(action, uniqueID, left, top, right, bottom)
SetJCFOption (OPT_VIRTUAL_PC_CURSOR, iUseVPC)
return result
EndFunction

Void Function virtualCursorRestrictedEvent (handle window, int restrictionChange)
if restrictionChange == virtualCursorRestriction_Document
	if isMessageDocumentObject (0)
	&& GetCursorRow () > 1
		GotoLineNumber (1)
	endIf
endIf
virtualCursorRestrictedEvent(window,restrictionChange)
endFunction

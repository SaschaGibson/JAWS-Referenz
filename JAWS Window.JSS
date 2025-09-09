; Copyright 1998-2021  by Freedom Scientific BLV Group, LLC
; Script file for the JAWS user interface

Include "hjconst.jsh"
Include "hjglobal.jsh"
include "common.jsm"
include "TutorialHelp.jsm"
Include "jfw.jsh"
Include "jfw.jsm"

use "RemoteSupportUI.jsb"

const
	wcPrefix_GetVoicesDialog = "HwndWrapper[GetVoices.exe"

GLOBALS
	collection wpfProgressBarInfo,
	int giBrlWizard,
	string gStrBrlWizardText


void function autoStartEvent ()
wpfProgressBarInfo = null ()
endFunction

void function AutoFinishEvent ()
wpfProgressBarInfo = null ()
endFunction

void function QuickSettingsPreProcess ()
globalPrevApp = null ()
globalPrevReal = null ()
globalWasHjDialog = OFF
QuickSettingsPreProcess ()
endFunction

int function getWPFProgressBarInfo (int Type, int State, string Name, string Value, string Description)
if type != WT_PROGRESSBAR
&& type != WT_STATIC then
	return TRUE
endIf
if type == WT_STATIC then
	if stringIsBlank (name) then
		wpfProgressBarInfo.name = value
	else
		wpfProgressBarInfo.name = name
	endIf
elIf type == WT_PROGRESSBAR then
	wpfProgressBarInfo.value = stringSegment (value, cscSpace, 1); instead of the full word percent, looks like normal progress bars.
	wpfProgressBarInfo.value = StringTrimTrailingBlanks (wpfProgressBarInfo.value)
	if stringRight (wpfProgressBarInfo.value,1) != "%" then
	; insert the percent sign only if it isn't there for Braille users:
		wpfProgressBarInfo.value = wpfProgressBarInfo.value+"%"
	endIf
endIf
; 0 will stop the enumeration, we got what we need:
return type != WT_PROGRESSBAR ; false when we want to stop enumerating.
endFunction

void function FocusableProgressBarPropertyChangedEvent(object element, int propertyID, variant newValue)
if CollectionItemsCount (wpfProgressBarInfo) then
; default handling of this property only stores the int value as its collection member.
; But since the string as presented from enumerateTypeAndTextStringsForWindow is already formatted, we keep it consistent here.
	wpfProgressBarInfo.value = StringTrimTrailingBlanks (newValue)
	if stringRight (wpfProgressBarInfo.value , 1) != "%" then
	; only add percent sigh if absent so it looks right in Braille but doesn't double the symbol
		wpfProgressBarInfo.value = wpfProgressBarInfo.value+"%"
	endIf
endIf
return FocusableProgressBarPropertyChangedEvent(element, propertyID, newValue)
endFunction

int function InGetVoicesDialog()
return StringStartsWith(GetWindowClass(GetFocus()),wcPrefix_GetVoicesDialog)
EndFunction

int Function BrailleAddObjectDlgText (int nSubtypeCode)
If giBrlWizard then
	Return BrailleAddString (GetDialogStaticText ()+gStrBrlWizardText,0,0,0)
Else
	Return BrailleAddObjectDlgText (nSubtypeCode)
EndIf
EndFunction

int function BrailleAddObjectName(int iSubtype)
var
	int inGetVoicesWindow = stringContains (getWindowClass (globalFocusWindow), "GetVoices.exe"),
	int focusSubtypeCode, ; for progressbars in Get Voices dialog
	handle hWnd
hWnd = GetFocus()
focusSubtypeCode = getObjectSubtypeCode ()
if inGetVoicesWindow
&& iSubtype == WT_PROGRESSBAR || focusSubtypeCode == WT_PROGRESSBAR
&& stringIsBlank (getObjectName ()) then ; in case they put object names on the progress bars,
; will Braille what voice is being installed instead of just the progress
; progress is in the value component
	var string ProgressBarName = FSUIAGetPriorSiblingOfElement(FSUIAGetFocusedElement () ).name
	if ! stringIsBlank (ProgressBarName) then
		BrailleAddString (ProgressBarName, 0,0,0)
		return TRUE
	endIf
endIf
if iSubtype == wt_LeftRightSlider then
	BrailleAddString(GetWindowName(GetPriorWindow(GetPriorWindow(hWnd))),0,0,0)
	BrailleAddString(GetWindowName(GetPriorWindow(hWnd)),0,0,0)
	return true
EndIf
If iSubtype == WT_PROGRESSBAR
&& collectionItemExists (wpfProgressBarInfo, "name") 
&& stringContains (getWindowClass (hwnd), "GetVoices.exe") then
	BrailleAddString (wpfProgressBarInfo.name, 0,0,0)
	return TRUE
endIf
return BrailleAddObjectName(iSubtype)
EndFunction

int function BrailleAddObjectValue (int subtypeCode)
var int inGetVoicesWindow = stringContains (getWindowClass (globalFocusWindow), "GetVoices.exe")
var int focusSubtypeCode = getObjectSubtypeCode () ; where the progress bar subtype isn't sent to the Braille display.
var string objectValue
if subtypeCode == WT_PROGRESSBAR || focusSubtypeCode == WT_PROGRESSBAR 
&& inGetVoicesWindow then
	objectValue = getObjectValue(SOURCE_CACHED_DATA) ; or doesn't get us a value without forced cache
	if ! stringIsBlank (objectValue) then
		BrailleAddString (objectValue, 0,0,0)
		return TRUE
	endIf
elIf subtypeCode == WT_STATIC && inGetVoicesWindow then
	var string text = getObjectName ()
	if ! stringIsBlank (text) then
		BrailleAddString (text, 0,0,0)
		return TRUE
	endIf
elIf subtypeCode == WT_PROGRESSBAR && inGetVoicesWindow
&& collectionItemExists (wpfProgressBarInfo, "value") then
	text = wpfProgressBarInfo.value
	; make absolutely sure there are no more instances of % than just one:
	text = StringReplaceSubstrings (text, "%", "")
	text=text+"%"
	BrailleAddString (text, 0,0,0)
	return TRUE
endIf
endFunction

int function BrailleAddObjectDescription(int subtype)
if subtype == wt_button
&& InGetVoicesDialog()
	; Since this is a WPF app which is behaving like a dialog,
	; we will simulate adding dialog static text by adding the static text to button descriptions.
	; Note that OK button, Yes button and Finish button all have the same automationID,
	; and that Cancel button and No button also share the same automationID:
	var string buttonID = GetObjectAutomationID()
	if (buttonID == "OKButton" || buttonID == "CancelButton")
	&& GetObjectSubtypeCode(false,2) == wt_Window
		var string text = GetObjectName(false,1)
		if text
			BrailleAddString(text,0,0,0)
			return true
		endIf
	endIf
endIf
return BrailleAddObjectDescription(subtype)
EndFunction

string function FindHotKey(string ByRef sPrompt)
var
	handle hWnd
let hwnd = GetCurrentWindow ()
;The button in question belongs to the same control group as the combo box for 'Synthesizer Name'.
;The hot key is associated with the control group, who places focus on the first control, e.g. the combo box.
;To that end, the default functionality is overridden here for this particular button which does not have a hot key associated.
if getControlID (hWnd) == id_voice_profiles_detect_SAPI_4_synthesizers_button
;in case there is a hot key assigned:
&& ! getHotKey (hWnd) then
	Return cscNull;
endIf
return FindHotKey(sPrompt)
endFunction

Void Function AddHotKeyLinks ()
UserBufferAddText (cScBufferNewLine); Put a blank line in to ensure accurate spacing in the buffer
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndFunction

string Function GetSynthesizerInfo ()
var
	Int Index,
	Int iNumOfSynths = SynthCount (),
	String sDefaultShortName,
	String sDefaultLongName,
	String sDefaultDriver,
	String sDefault,
	String sDefaultInfo,
	String sPortInfo,
	String sSynthInfo,
	String strSynthList,;Not delimited, but the information for each synthesizer
	String sTemp,
	String strInfo

GetDefaultSynthInfo (sDefaultShortName, sDefaultLongName, sDefaultDriver)
sDefault = sDefaultLongName
;If default local profile is VCSpeech, e.g. PACMate Remote:
If sDefault == scRemote
&& ! gbUsingRemotePACMate
	sDefault = cscNull
EndIf
;If using PAC Mate Desktop
If gbUsingRemotePACMate
&& sDefault == scRemote
	sDefaultInfo = msgRemoteSynth
	sDefault = Synth_Remote;Condition false to overwrite.
EndIf
For Index = 1 To iNumOfSynths
	sSynthInfo = SynthLongName (Index)
	sPortInfo = SynthPort (Index)
	sTemp = StringTrimTrailingBlanks (FormatString (msgSynthXInfo, sSynthInfo, sPortInfo))
	If StringIsBlank (sPortInfo)
		sTemp = StringChopRight (sTemp, 3) + StringRight (sTemp, 1)
	EndIf
	strSynthList = strSynthList + cScBufferNewLine + sTemp
EndFor
sDefaultInfo = sDefault
strInfo = FormatString (msgSynth, IntToString (iNumOfSynths), sDefaultInfo) + strSynthList
Return strInfo
EndFunction

string Function GetBrailleDisplayInfo ()
var
	int index,
	int iNumOfDisplays = BrailleCount (),
	int iDefault,
	int nCellCount = BrailleGetCellCount (),
	string sDefaultShortName,
	string sDefaultLongName,
	string sDefaultDriver,
	string sDefaultInfo,
	string sPortInfo,
	string sDisplayInfo,
	string strDisplayList,;Not delimited, but the information for each display
	string sTemp,
	string strInfo

GetDefaultBrailleDisplayInfo (sDefaultShortName, sDefaultLongName, sDefaultDriver)
sDefaultInfo = sDefaultLongName
If gbUsingRemotePACMate
&& nCellCount
	sDefaultInfo = FormatString (msgRemoteBraille, IntToString (nCellCount))
EndIf
For Index = 1 To iNumOfDisplays
	If BrailleDriver (Index) != SC_NoBrailleDriver
		sDisplayInfo = BrailleLongName (Index)
		sPortInfo = BraillePort (Index)
		If sPortInfo == cScNull then
			sPortInfo = msgBrlNoPort
		EndIf
		;Initialize and/or add Display list elements.
		strDisplayList = strDisplayList+ cScBufferNewLine+ FormatString (msgBrailleDisplayXInfo, sDisplayInfo, sPortInfo)
	EndIf
EndFor
If iNumOfDisplays == 0
	Return msgNoDisplay
EndIf
;Reduce display count by one since 'No display' shows up as a display.
If iNumOfDisplays >= 2
	iNumOfDisplays = iNumOfDisplays - 1
EndIf
strInfo = FormatString (msgDisplay, IntToString (iNumOfDisplays), sDefaultInfo) + strDisplayList
Return strInfo
EndFunction

string function GetLockingAndAuthCodeInfoForVirtualViewer()
var
	string sLocking,
	string sAuth
let sLocking = GetLockingCode()
if !sLocking then
	return cscNull
EndIf
let sLocking = FormatString(msgLockingCodeInfo,sLocking)
let sAuth = GetAuthCode()
if sAuth then
	let sAuth = FormatString(msgAuthCodeInfo,sAuth)
else
	let sAuth = msgAuthCodeUnavailable
EndIf
return sLocking+cscBufferNewLine+sAuth+cscBufferNewLine
EndFunction

string Function GetUnifiedKeyboardInfo()
; only add this information if setting is not default
if !UseUnifiedKeyboardProcessing() Then
	return cScBufferNewLine + cScBufferNewLine + 
		FormatString (msgKeyboardProcessingMethod_Label, msgKeyboardProcessingMethod_Legacy)
EndIf
EndFunction

script SayAppVersion ()
var
	string strTemp,
	string strAppInfo,
	string smaExpiration
; JAWS info:
let strTemp = FormatString (
	msgJAWSVersionInfo,
	GetVersionInfoString (GetAppFilePath (), cmsg283_L))
Let strAppInfo = strTemp + cScBufferNewLine
let strTemp = GetLockingAndAuthCodeInfoForVirtualViewer ()
if ( strTemp ) then
	let strAppInfo = strAppInfo + strTemp
EndIf
Let smaExpiration = GetJFWSMAExpiration();
if (StringLength(smaExpiration) < 1) then
Let strTemp = FormatString (
	msgSerialInfo,
	IntToString (GetJFWSerialNumber ()),
	IntToString (GetJFWSMACount ()))
else
Let strTemp = FormatString (
	msgSerialInfoSmaExpiration,
	IntToString (GetJFWSerialNumber ()),
	IntToString (GetJFWSMACount ()),
	smaExpiration)
EndIf
Let strAppInfo = StrAppInfo + strTemp + cScBufferNewLine
var int scriptsRevision = GetScriptsRevision()
if (scriptsRevision > 0) then
	var string revisionInfo = FormatString(cmsgScriptsRevision, IntToString(scriptsRevision))
	Let strAppInfo = strAppInfo + revisionInfo + cScBufferNewLine
endIf
Let strAppInfo = strAppInfo + cScBufferNewLine
; synthesizer info:
Let strAppInfo = strAppInfo + GetSynthesizerInfo () + cScBufferNewLine + cScBufferNewLine
; braille display info:
Let strAppInfo = strAppInfo + GetBrailleDisplayInfo ()
Let strAppInfo = strAppInfo + GetUnifiedKeyboardInfo()
SayFormattedMessage (OT_USER_BUFFER, strAppInfo)
AddHotKeyLinks ()
EndScript

Script ScriptFileName ()
ScriptAndAppNames (msg0_L)
EndScript

int function ScreenSensitiveHelpForBasicsDialog(string sRealName)
var
	handle hwnd,
	int SubType,
	int id,
	string sHelp_L,
	string sHelp_S
if StringCompare(sRealName,wn_Basic_Settings) != 0 then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
if SubType ==	WT_RADIOBUTTON then
	if ID ==	id_AnnounceMenuCont
	|| ID ==	id_TurnOffMenuCont
	|| ID == id_AnnCustomMsgOnly  then
		let sHelp_L = FormatString(cMsgScreenSensitiveHelp32_L)+cscBufferNewLine+msgScreenSensitiveHelp3_L
		let sHelp_S = FormatString(cMsgScreenSensitiveHelp32_S)+cscBufferNewLine+msgScreenSensitiveHelp3_S
	Else
		let sHelp_L = FormatString(cMsgScreenSensitiveHelp32_L)+cscBufferNewLine+msgScreenSensitiveHelp4_L
		let sHelp_S = FormatString(cMsgScreenSensitiveHelp32_S)+cscBufferNewLine+msgScreenSensitiveHelp4_S
	EndIf
elif SubType ==		WT_CHECKBOX  then
	if ID == id_AuttoStart  then
		let sHelp_L = FormatString(cMsgScreenSensitiveHelp33_L)+cscBufferNewLine+msgScreenSensitiveHelp5_L
		let sHelp_S = FormatString(cMsgScreenSensitiveHelp33_S)+cscBufferNewLine+msgScreenSensitiveHelp5_S
	elif ID == ID_PromptToConfirmWhenExitingJAWS then
		let sHelp_L = FormatString(cMsgScreenSensitiveHelp33_L)+cscBufferNewLine+msgScreenSensitiveHelp_PromptToConfirmWhenExitingJAWS
		let sHelp_S = FormatString(cMsgScreenSensitiveHelp33_S)+cscBufferNewLine+msgScreenSensitiveHelp_PromptToConfirmWhenExitingJAWS
	elif ID == id_Launch_PACMate_At_StartUp  Then
		let sHelp_L = FormatString(cMsgScreenSensitiveHelp33_L)+cscBufferNewLine+msgScreenSensitiveHelp39_l
		let sHelp_S = FormatString(cMsgScreenSensitiveHelp33_L)+cscBufferNewLine+msgScreenSensitiveHelp39_l
	elif ID == id_RunFromTray  then
		let sHelp_L = FormatString(cMsgScreenSensitiveHelp33_L)+cscBufferNewLine+msgScreenSensitiveHelp6_L
		let sHelp_S = FormatString(cMsgScreenSensitiveHelp33_S)+cscBufferNewLine+msgScreenSensitiveHelp6_S
	elif ID == id_ShowVirtualViewerOn then
		let sHelp_L = FormatString(cMsgScreenSensitiveHelp33_L)+cscBufferNewLine+msgScreenSensitiveHelp33_L
		let sHelp_S = FormatString(cMsgScreenSensitiveHelp33_L)+cscBufferNewLine+msgScreenSensitiveHelp33_L
	elif ID == id_AutomaticNotificationOfUpdates then
		let sHelp_L = FormatString(cMsgScreenSensitiveHelp33_L)+cscBufferNewLine+sshmsg_AutomaticNotificationOfUpdatesCheckBox
		let sHelp_S = FormatString(cMsgScreenSensitiveHelp33_S)+cscBufferNewLine+sshmsg_AutomaticNotificationOfUpdatesCheckBox
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
elif SubType ==		WT_COMBOBOX then
	let sHelp_L = msgComboBox+cscBufferNewLine+msgScreenSensitiveHelp7_L
	let sHelp_S = msgComboBox+cscBufferNewLine+msgScreenSensitiveHelp7_S
elif SubType == wt_BUTTON then
	if ID == id_OK then
		let sHelp_L = msgButton+cscBufferNewLine+msgScreenSensitiveHelp8_L
		let sHelp_S = msgButton+cscBufferNewLine+msgScreenSensitiveHelp8_S
	elif ID == id_Cancel then
		let sHelp_L = msgButton+cscBufferNewLine+msgScreenSensitiveHelp9_L
		let sHelp_S = msgButton+cscBufferNewLine+msgScreenSensitiveHelp9_S
	elif ID == ID_REGISTER then
		let sHelp_L = msgButton+cscBufferNewLine+msgRegInfo
		let sHelp_S = msgButton+cscBufferNewLine+msgRegInfo
	elif id == id_Modify_System_Parameters_Button then
		let sHelp_L = msgButton+cscBufferNewLine+msgScreenSensitiveHelpModifySystemParametersButton_l
		let sHelp_L = msgButton+cscBufferNewLine+msgScreenSensitiveHelpModifySystemParametersButton_l
	elif id == id_Advanced_Options_Button then
		let sHelp_L = msgButton+cscBufferNewLine+MsgScreenSensitiveHelpAdvancedOptionsButton_L
		let sHelp_L = msgButton+cscBufferNewLine+MsgScreenSensitiveHelpAdvancedOptionsButton_L
	;WinVista::StartJAWSAutomatic
	elif id == ID_AutomaticallyStartJAWS then
		let sHelp_L = msgScreenSensitiveHelpAutomaticallyStartJAWS
		let sHelp_S = msgScreenSensitiveHelpAutomaticallyStartJAWS
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
EndIf
SayFormattedMessage(OT_USER_BUFFER, sHelp_L,sHelp_S)
AddHotKeyLinks ()
return true
EndFunction

int function ScreenSensitiveHelpForStartUpDialog(string sRealName)
;Windows Vista::AutoStartOptions
var
	handle hwnd,
	int id,
	string sHelp_L,
	string sHelp_S
if StringCompare(sRealName,WN_STARTUP_WIZARD) != 0
&& StringCompare(sRealName,wn_Vista_Autostart) != 0 then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let id = GetControlID (hWnd)
if ID == id_OK
||	id == ID_Finish then
	let sHelp_L=msgButton+cscBufferNewLine+msgScreenSensitiveHelp8_L
	let sHelp_S=msgButton+cscBufferNewLine+msgScreenSensitiveHelp8_S
	SayFormattedMessage (OT_USER_BUFFER, sHelp_L,sHelp_S)
	AddHotKeyLinks ()
elif ID == id_Cancel then
	let sHelp_L=msgButton+cscBufferNewLine+msgScreenSensitiveHelp9_L
	let sHelp_S=msgButton+cscBufferNewLine+msgScreenSensitiveHelp9_S
	SayFormattedMessage (OT_USER_BUFFER, sHelp_L,sHelp_S)
	AddHotKeyLinks ()
elif id == id_StartJAWSLogonScreen then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpStartJAWSLogonScreen)
	AddHotKeyLinks ()
elif id == ID_StartJAWSAllUsers then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpStartJAWSAllUsers)
	AddHotKeyLinks ()
elif id == ID_StartJAWSThisUser then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpStartJAWSThisUser)
	AddHotKeyLinks ()
elif ID == id_voice_rate_slider then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpStartupRate)
	AddHotKeyLinks ()
elif ID == ci_Punctuation_combo then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpPunctuationStartup)
	AddHotKeyLinks ()
elif ID == id_volume_ducking_checkbox then
	SayFormattedMessage (OT_USER_BUFFER,msgScreenSensitiveHelpVolumeDuckingStartup)
	AddHotKeyLinks ()
elif ID == id_voice_assistant_checkbox
; we don't want this to become a link, but we do want the keystroke recognized.
	SayMessage (OT_USER_BUFFER,formatString (msgScreenSensitiveHelpVoiceAssistantStartup))
	AddHotKeyLinks ()
;Typing Echo radio Button Group:
elif (ID >= 1019 && ID <= 1021) || ID == 5119 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpTypingEchoStartup)
	AddHotKeyLinks ()
elif ID == id_SAPI_DURING_SAYALL then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpSapiDuringSayAllStartup)
	AddHotKeyLinks ()
elif ID == ID_AutomaticallyStartJAWSWizard then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpJAWSOnStartup)
	AddHotKeyLinks ()
elif ID == ID_StartJAWSLogonScreen then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpStartJAWSLogonScreenStartupWizard)
	AddHotKeyLinks ()
elif ID == ID_StartJAWSAllUsers then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpStartJAWSAllUsersWizard)
	AddHotKeyLinks ()
elif ID == ID_StartJAWSThisUser then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpStartJAWSThisUserWizard)
	AddHotKeyLinks ()
elif ID == id_RunFromTray then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpRunFromSystemTrayWizard)
	AddHotKeyLinks ()
elIf ID == IDC_CONFIRM_WHEN_EXITING_JAWS then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp_PromptToConfirmWhenExitingJAWS)
	AddHotKeyLinks ()
elif ID == 5149 then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpVirtualRibbons)
	AddHotKeyLinks ()
elIf ID >= 7236 && ID <= 7238 then
	SayFormattedMessage (OT_USER_BUFFER, sshmsg_SmartNavigationRadioButtons)
	AddHotKeyLinks ()
elIf ID >= 7240 && ID <= 7242 then
	SayFormattedMessage (OT_USER_BUFFER, sshmsg_FormsMode)
	AddHotKeyLinks ()
elif ID == ID_KEYBOARD_LAYOUT_WIZARD then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpKeyboardLayoutWizard)
	AddHotKeyLinks ()
;Numlock Key State on Startup:
elif (ID >= 5114 && ID <= 5116) then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpNumlockStateWizard)
	AddHotKeyLinks ()
;Tutor Help:
elif (ID >= 1154 && ID <= 1156) then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpTutorMessagesWizard)
	AddHotKeyLinks ()
;Access Key Help:
elif (ID >= 1157 && ID <= 1160) then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpAccessKeyMessagesWizard)
	AddHotKeyLinks ()
elif (ID >= 5125 && ID <= 5127) then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpUserVerbosityLevelWizard)
	AddHotKeyLinks ()
elif (ID >= 5129 && ID <= 5131) then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpGraphicsVerbosityLevelWizard)
	AddHotKeyLinks ()
elif ID == ID_BRAILLE_LANGUAGE_COMBOBOX
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpBrailleLanguageStartup)
	AddHotKeyLinks ()
elif ID == ID_BRAILLE_OUTPUT_COMBOBOX
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpBrailleOutputStartup)
	AddHotKeyLinks ()
elif ID == ID_BRAILLE_INPUT_COMBOBOX
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpBrailleInputStartup)
	AddHotKeyLinks ()
elif ID == ID_GRADE2_EXPANDWORD then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpGrade2ExpandWordStartup)
	AddHotKeyLinks ()
elIf ID == ID_ENABLE_FLASH_MESSAGES then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpFlashMessages)
	AddHotKeyLinks ()
elIf ID == ID_WORDWRAP_CHECKBOX then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpWordWrap)
	AddHotKeyLinks ()
elIf ID == ID_REVERSEPANNINGKEYS_CHECKBOX then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpReversePanningKeys)
	AddHotKeyLinks ()
elIf ID == ID_BRAILLEMODE_COMBOBOX then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpBrailleMode)
	AddHotKeyLinks ()
elIf ID == ID_POSITIONOFSTATUSCELLS_COMBOBOX then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpPositionOfStatusCells)
	AddHotKeyLinks ()
elIf ID == ID_DOTFIRMNESS_SLIDER then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpDotFirmness)
	AddHotKeyLinks ()
elIf ID == ID_PRIMARYBRAILLETABLE_COMBOBOX then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelpPrimaryBrailleTable)
	AddHotKeyLinks ()
Else
	PerformScript ScreenSensitiveHelp ()
EndIf
return true
EndFunction

int function ScreenSensitiveHelpForVIDEOINTERCEPTDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id
if StringCompare(sRealName,WN_VIDEO_INTERCEPT) != 0 then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
If SubType == WT_RADIOBUTTON then
	SayFormattedMessage (OT_USER_BUFFER, msgVideoInterceptRadio)
elif SubType == WT_READONLYEDIT then
	SayFormattedMessage (OT_USER_BUFFER, msgVideoInterceptEdit)
elif SubType == WT_BUTTON THEN
	If ID == ID_VIDEO_EXECUTE then
		SayFormattedMessage (OT_USER_BUFFER, msgVideoInterceptExecute)
	elif ID == ID_VIDEO_HELP then
		SayFormattedMessage (OT_USER_BUFFER, msgVideoInterceptHelp)
	elif ID == ID_VIDEO_CLOSE then
		SayFormattedMessage (OT_USER_BUFFER, msgVideoInterceptClose)
	Else
		PerformScript ScreenSensitiveHelp ()
		Return true
	EndIf
EndIf
AddHotKeyLinks ()
Return true
EndFunction

int function ScreenSensitiveHelpForWindowsSystemParametersDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id,
	string sHelp_L,
	string sHelp_S
if StringCompare(sRealName,wn_Windows_System_Parameters) != 0 then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
If subtype == wt_CheckBox then
	let sHelp_L = FormatString(cmsgScreenSensitiveHelp2_L) +cscBufferNewLine+msgScreenSensitiveHelp_Modify_System_Parameters
	SayFormattedMessage (ot_user_buffer, sHelp_L)
elif Subtype == wt_Button then
	If id == id_OK then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp_MSP_OK_Button)
	elif id == id_Cancel then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp_MSP_Cancel_Button)
	EndIf
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function ScreenSensitiveHelpForAboutDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id,
	string sHelp_L,
	string sHelp_S
if StringCompare(sRealName,wn_AboutJAWS) != 0 then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
if Subtype == wt_Button then
	if id == id_Access_Code_Button then
		let sHelp_L=msgButton+cscBufferNewLine+msgScreenSensitiveHelpAccessCodeButton
		let sHelp_S=msgButton+cscBufferNewLine+msgScreenSensitiveHelpAccessCodeButton
		SayMessage (OT_USER_BUFFER, sHelp_L,sHelp_S)
		AddHotKeyLinks ()
		return true
	EndIf
EndIf
return false
EndFunction

int function ScreenSensitiveHelpForEnterAnAccessCodeDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id
if StringCompare(sRealName,wn_EnterAnAccessCode) != 0 then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
if Subtype == wt_Edit then
	if id == id_Access_Code_Edit then
		SayMessage(ot_user_buffer,msgScreenSensitiveHelpAccessCodeEdit)
	EndIf
	AddHotKeyLinks ()
	return true
EndIf
return false
EndFunction

int function ScreenSensitiveHelpForAdvancedOptionsDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id,
	string sHelp_L
if StringCompare(sRealName,wn_Advanced_Options) != 0 then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
If subtype == wt_CheckBox then
	If id == id_Automatic_Updates_Available_Checkbox Then
		let sHelp_L = FormatString(cmsgScreenSensitiveHelp33_L)+cscBufferNewLine+MsgScreenSensitiveHelpAutomaticUpdatesAvailableCheckbox
		SayFormattedMessage (ot_user_buffer, sHelp_L)
	elif Id == id_Try_Remote_Access_Speech_On_StartUp then
		let sHelp_L = FormatString(cmsgScreenSensitiveHelp33_L) + cscBufferNewLine + msgScreenSensitiveHelp37_l
		SayFormattedMessage (OT_USER_BUFFER, sHelp_L )
	elif Id == id_Try_Remote_Access_Braille_On_StartUp then
		let sHelp_L = FormatString(cmsgScreenSensitiveHelp33_L) + cscBufferNewLine + msgScreenSensitiveHelp38_l
		SayFormattedMessage (OT_USER_BUFFER, sHelp_L )
	elif ID == id_UseAuthorizationFromPm  Then
		let sHelp_L = FormatString(cmsgScreenSensitiveHelp33_L) + cscBufferNewLine + MsgScreenSensitiveHelpUseAuthorizationFromPM
		SayFormattedMessage (OT_USER_BUFFER, sHelp_L)
	elif id == id_EnableRemoteAccessClient  Then
		let sHelp_L = FormatString(cmsgScreenSensitiveHelp33_L) + cscBufferNewLine + MsgScreenSensitiveHelpEnableRemoteAccessClient_L
		SayFormattedMessage (OT_USER_BUFFER, sHelp_L)
	elif id == id_EnableRemoteAccessServer  Then
		let sHelp_L = FormatString(cmsgScreenSensitiveHelp33_L) + cscBufferNewLine + MsgScreenSensitiveHelpEnableRemoteAccessServer_L
		SayFormattedMessage (OT_USER_BUFFER, sHelp_L)
	elif id == id_RunJAWSwithoutspeech then
		let sHelp_L = FormatString(cmsgScreenSensitiveHelp33_L) + cscBufferNewLine + msgssh_RunJAWSwithoutspeech
		SayFormattedMessage(OT_USER_BUFFER,sHelp_L)
	EndIf
	AddHotKeyLinks ()
	return true
elif Subtype == wt_Button then
	If id == id_OK then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp_MSP_OK_Button)
		AddHotKeyLinks ()
		return true
	elif id == id_Cancel then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp_MSP_Cancel_Button)
		AddHotKeyLinks ()
		return true
	EndIf
EndIf
return false
EndFunction

int function ScreenSensitiveHelpForVoiceOPTIONSDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id
if !StringContains(sRealName, wn_VOICE_OPTIONS) then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
if (ID == id_VOLUME) then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp2_l, msgScreenSensitiveHelp2_s)
	AddHotKeyLinks ()
	return true
EndIf
if SubType == WT_RADIOBUTTON then
	SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp36_L)
elif SubType == WT_LEFTRIGHTSLIDER then
	if id == id_voice_rate_slider
	|| ID == id_voice_profiles_rate_slider then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp11_L, msgScreenSensitiveHelp11_S)
	elif id == id_voice_pitch_slider
	|| ID == id_voice_profiles_pitch_slider then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp35_L)
	Else
		return ScreenSensitiveHelpForVoiceProfilesDialogs (sRealName)
		;return true
	EndIf
elif SubType == WT_COMBOBOX then
	if id == id_voice_Punctuation_combo	then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp12_L, msgScreenSensitiveHelp12_S)
	elif id == id_voice_Person_combo  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp16_L)
	elif ID == ci_Voice_to_Modify_combo then
		SayFormattedMessage (OT_USER_BUFFER,msgScreenSensitiveHelp14_L)
	else
		return ScreenSensitiveHelpForVoiceProfilesDialogs (sRealName)
		;return true
	EndIf
elif SubType == WT_EDIT then
	If ID == ID_voice_UPPERCASE_EDIT then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp13_L, msgScreenSensitiveHelp13_S)
	Else;New Spell Rate Edit box.
		SayFormattedMessage(OT_USER_BUFFER,msgSpellRate)
	EndIf
elif SubType == WT_BUTTON then
	if ID == id_OK then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp8_L, msgScreenSensitiveHelp8_S)
	elif ID == id_Cancel then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp9_L, msgScreenSensitiveHelp9_S)
	elif ID == ci_ApplyButton then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp27_L)
	elif ID == ID_DEFAULTS then
		SayFormattedMessage (OT_USER_BUFFER, msgRestoreToDefaults)
	Else
		return ScreenSensitiveHelpForVoiceProfilesDialogs (sRealName)
		;return true
	EndIf
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function ScreenSensitiveHelpForVoiceSettingsDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id
if !StringContains(sRealName, wn_VOICE_SETTINGS) then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
if ID == id_VOLUME then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp2_l, msgScreenSensitiveHelp2_s)
	AddHotKeyLinks ()
	return true
EndIf
if SubType == WT_RADIOBUTTON then
	SayFormattedMessage(OT_USER_BuFFER,msgScreenSensitiveHelp10_L, msgScreenSensitiveHelp10_S)
elif SubType == WT_LEFTRIGHTSLIDER then
	if id == id_voice_profiles_rate_slider then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp11_L, msgScreenSensitiveHelp11_S)
	elif id == id_voice_profiles_pitch_slider then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp35_L)
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
elif SubType == WT_COMBOBOX then
	if id == id_voice_Punctuation_combo	then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp12_L, msgScreenSensitiveHelp12_S)
	elif id == id_voice_Person_combo  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp34_L)
	elif ID == ci_Voice_to_Modify_combo then
		SayFormattedMessage (OT_USER_BUFFER,msgScreenSensitiveHelp14_L)
	else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
elif SubType == WT_EDIT then
	If ID == ID_voice_UPPERCASE_EDIT then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp13_L, msgScreenSensitiveHelp13_S)
	Else;New Spell Rate Edit box.
		SayFormattedMessage(OT_USER_BUFFER,msgSpellRate)
	EndIf
elif SubType == WT_BUTTON then
	if ID == id_OK then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp8_L, msgScreenSensitiveHelp8_S)
	elif ID == id_Cancel then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp9_L, msgScreenSensitiveHelp9_S)
	elif ID == ci_ApplyButton then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp27_L)
	elif ID == ID_DEFAULTS then
		SayFormattedMessage (OT_USER_BUFFER, msgRestoreToDefaults)
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function ScreenSensitiveHelpForVoiceProfilesDialogs(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id
if StringCompare(sRealName,WN_SELECT_PROFILE) != 0
; && StringCompare(sRealName,wn_Global_Voice_Profiles_dialog) != 0
; && StringCompare(sRealName, wn_Individual_Voices_dialog) != 0 then
&& ! StringContains(sRealName, wn_VOICE_OPTIONS) then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
if ! subtype then let subtype = getObjectSubtypeCode () endIf
let id = GetControlID (hWnd)
;if SubType == WT_RADIOBUTTON then
if SubType == WT_COMBOBOX then
	if id == id_voice_profiles_modify_default_COMBOBOX then
		SayMessage(OT_USER_Buffer,msgssh_global_voice_profiles_modify_default_RadioButton)
	elif id == id_voice_profiles_modify_application_COMBOBOX then
		SayMessage(OT_USER_Buffer,msgssh_voice_profiles_modify_application_RadioButton)
	elIf id == id_Voice_profiles_context_voice_combo then
		SayMessage(OT_USER_BUFFER,msgssh_Voice_profiles_context_voice_combo)
	elif id == id_voice_profiles_profile_name_combo then
		if sRealName == wn_Global_Voice_Profiles_dialog then
			SayMessage(OT_USER_BUFFER,msgssh_global_voice_profiles_profile_name_combo)
		else
			SayMessage(OT_USER_BUFFER,msgssh_individual_voice_profiles_profile_name_combo)
		EndIf
	elif id == id_voice_profiles_synthesizer_name_combo then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_synthesizer_name_combo)
	elif id == id_voice_profiles_synthesizer_language_combo then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_synthesizer_language_combo)
	elif id == id_voice_Punctuation_combo	then
		SayMessage(OT_USER_BUFFER,msgssh_voice_Punctuation_combo)
	elif id == id_voice_Person_combo  then
		SayMessage(OT_USER_BUFFER,msgssh_voice_Person_combo)
	elif id == id_voice_profiles_SayAll_synthesizer_combo then
		SayMessage (OT_USER_BUFFER,msgssh_voice_profiles_SayAll_synthesizer_combo)
	elif id == id_voice_profiles_SayAll_punctuation_combo then
		SayMessage (OT_USER_BUFFER,msgssh_voice_profiles_SayAll_punctuation_combo)
	elif id == id_voice_profiles_SayAll_person_combo then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_SayAll_person_combo)
	else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
elIf subtype == WT_CHECKBOX then
	SayMessage(OT_USER_BUFFER,msgssh_EnableAdditionalVoiceProfilesForInstalledVocalizerExpressive2Voices)
elif SubType == WT_LEFTRIGHTSLIDER then
	if id == id_voice_profiles_rate_slider then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_rate_slider)
	elif id == id_voice_profiles_pitch_slider then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_pitch_slider)
	elif ID == id_voice_profiles_volume_slider then
		SayMessage(ot_USER_BUFFER,msgssh_voice_profiles_volume_slider)
	elif id == id_voice_profiles_SayAll_rate_slider then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_SayAll_rate_slider)
	elif id == id_voice_profiles_SayAll_pitch_slider then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_SayAll_pitch_slider)
	elif id == id_voice_profiles_SayAll_volume_slider then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_SayAll_volume_slider)
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
elif SubType == WT_EDIT then
	if id == id_voice_spell_rate_change_edit then
		SayMessage(OT_USER_BUFFER,msgssh_voice_spell_rate_change_edit)
	elif ID == ID_voice_UPPERCASE_EDIT then
		SayMessage(OT_USER_BUFFER,msgssh_voice_UPPERCASE_EDIT)
	EndIf
elif SubType == WT_BUTTON then
	if ID == id_OK then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_OK_button)
	elif ID == id_Cancel then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_cancel_button)
	elif ID == id_apply_button then
		SayMessage(OT_USER_BUFFER, msgScreenSensitiveHelp27_L)
	elif id == id_voice_profiles_save_as_button then
		if sRealName == wn_Global_Voice_Profiles_dialog then
			SayMessage(OT_USER_BUFFER,msgssh_global_voice_profiles_save_as_button)
		else
			SayMessage(OT_USER_BUFFER,msgssh_individual_voice_profiles_save_as_button)
		EndIf
	elif ID == id_voice_restore_to_default_button then
		SayMessage (OT_USER_BUFFER,msgssh_voice_restore_to_default_button)
	elIf ID == id_voice_profiles_set_as_default_button then ; set primary
		SayFormattedMessage (OT_USER_BUFFER, msgSetAsPrimary)
	elif id == id_voice_profiles_speak_sample then
		SayFormattedMessage (OT_USER_BUFFER, msgSpeakSample)
	elif id == id_voice_profiles_delete_button then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_delete_button)
	elif id == id_voice_profiles_detect_SAPI_4_synthesizers_button then
		SayMessage(OT_USER_BUFFER,msgssh_voice_profiles_detect_SAPI_4_synthesizers_button)
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function ScreenSensitiveHelpForModifyBrailleSettingsDialog(string sRealName)
var
	handle hwnd,
	handle hTemp,
	int Subtype,
	int id
if  !StringContains(sRealName, wn_modify_braille_settings ) then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
if SubType == WT_EDITCOMBO then
	let hTemp = GetFirstChild (GetNextWindow(GetNextWindow(GetFirstChild (GetRealWindow (hWnd)))))
	if hWnd == hTemp then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp25_L, msgScreenSensitiveHelp25_S)
	Else
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp26_L, msgScreenSensitiveHelp26_S)
	EndIf
elif SubType == WT_BUTTON then
	If ID == id_OK then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp8_L, msgScreenSensitiveHelp8_S)
	elif ID == id_Cancel then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp9_L, msgScreenSensitiveHelp9_S)
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
Else
	PerformScript ScreenSensitiveHelp()
	return true
EndIf
AddHotKeyLinks()
return true
EndFunction

int function ScreenSensitiveHelpForGraphicslabelerDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id
if !StringCompare(sRealName,wn_Graphics_labeler) == 0 then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
if SubType == WT_EDIT then
	if id == id_SpokenLabel	then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp31_L)
	elif id == id_BrailleLabel  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp32_L)
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
	AddHotKeyLinks()
	return true
elif SubType == WT_RADIOBUTTON then
	if id == id_applicationFile_rdb
	|| id == id_default_rdb
	|| id == id_bothFiles_rdb then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp30_L)
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
	AddHotKeyLinks()
	return true
elif SubType == WT_BUTTON then
	if id == id_OK  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp8_L)
	elif id == id_Cancel  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp9_L)
	elif id == id_help	then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp29_L)
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
	AddHotKeyLinks()
	return true
ELSE
	PerformScript ScreenSensitiveHelp()
	return true
EndIf
EndFunction

int function ScreenSensitiveHelpForCursorAndMessageVoiceDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id
if StringCompare(sRealName,wn_Cursor_and_Message_Voice ) != 0 Then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
if ID == id_VOLUME then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp2_l, msgScreenSensitiveHelp2_s)
	AddHotKeyLinks ()
	return true
EndIf
if SubType == WT_RADIOBUTTON then
	SayFormattedMessage(OT_USER_BuFFER,msgScreenSensitiveHelp10_L, msgScreenSensitiveHelp10_S)
elif SubType == WT_COMBOBOX then
	If ID == ci_Voice_to_Modify_combo  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp14_L, msgScreenSensitiveHelp14_S)
	elif ID == ci_Punctuation_combo then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp15_L, msgScreenSensitiveHelp15_S)
	Else
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp16_L, msgScreenSensitiveHelp16_S)
	EndIf
elif SubType == WT_LEFTRIGHTSLIDER then
	if ID == ci_rate then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp17_L, msgScreenSensitiveHelp17_S)
	Else
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp18_L, msgScreenSensitiveHelp18_S)
	EndIf
elif SubType == WT_BUTTON then
	if ID == id_OK then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp8_L, msgScreenSensitiveHelp8_S)
	elif ID == id_Cancel then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp9_L, msgScreenSensitiveHelp9_S)
	elif ID == ci_ApplyButton  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp27_L, msgScreenSensitiveHelp27_S)
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function ScreenSensitiveHelpForBrailleBasicSettingsDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id
if StringCompare(sRealName,wn_Brl_Basic_Settings ) != 0 then
 	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
if SubType == WT_CHECKBOX then
	SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp24_L, msgScreenSensitiveHelp24_S)
	AddHotKeyLinks ()
	return true
elif SubType == WT_COMBOBOX then
	if ID ==id_default_brl_dsply then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp22_L, msgScreenSensitiveHelp22_S)
	elif ID == id_translation_table then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp23_L, msgScreenSensitiveHelp23_S)
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
elif SubType == WT_BUTTON then
	if ID == id_modify_settings_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp19_L, msgScreenSensitiveHelp19_S)
	elif ID == id_add_display_btn  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp20_L, msgScreenSensitiveHelp20_S)
	elif ID == id_advanced_btn  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp21_L, msgScreenSensitiveHelp21_S)
	elif ID == id_OK then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp8_L, msgScreenSensitiveHelp8_S)
	elif ID== id_Cancel then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp9_L, msgScreenSensitiveHelp9_S)
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
Else
	PerformScript ScreenSensitiveHelp()
	return true
EndIf
AddHotKeyLinks ()
return true
EndFunction

int function ScreenSensitiveHelpForManageApplicationSettingsDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id
if StringCompare(sRealName,wn_ManageApplicationSettings ) != 0 Then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
If SubType == WT_LISTBOX Then
	SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpApplicationSettingsListBox_L)
	AddHotKeyLinks ()
	return true
elif SubType == WT_BUTTON Then
	If ID == Id_EnableAllBtn Then
		SayFormattedMessage (OT_UsER_BUFFER, MsgScreenSensitiveHelpEnableAllBtn_L)
	elif ID ==  Id_DisableAllBtn Then
		SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpDisableAllBtn_L)
	elif ID == id_RemoveSelectedBtn Then
		SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpRemoveSelectedBtn_L)
	elif ID == ID_OK Then
		SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpOkBtn_L)
	elif ID == id_Cancel Then
		SayFormattedMessage (OT_USER_BUFFER, MsgScreenSensitiveHelpCancelBtn_L)
	EndIf
	AddHotKeyLinks ()
	return true
EndIf
return false
EndFunction

int function ScreenSensitiveHelpForNavigationQuickKeysManagerDialog(string sRealName)
var
	handle hwnd,
	int Subtype,
	int id
if StringCompare(sRealName,wn_NavigationQuickKeyManager) != 0
&&StringCompare(sRealName,wn_EditNavigationQuickKeyAssignment) != 0 Then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
let id = GetControlID (hWnd)
if id == 7163 then
	SayMessage(OT_USER_BUFFER,sshmsg_AssignedNavQuickKeysList)
elif id == 7029 then
	SayMessage(OT_USER_BUFFER,sshmsg_EditNavQuickKeyAssignmentButton)
elif id == 7162 then
	SayMessage(OT_USER_BUFFER,sshmsg_DeleteNavQuickKeyAssignmentButton)
elif id == 1001 then
	SayMessage(OT_USER_BUFFER,sshmsg_AssignNewNavQuickKeyEditCombo)
else
	return false
EndIf
	AddHotKeyLinks ()
	return true
EndFunction

int function ScreenSensitiveHelpFormaineJAWSui(string sRealName)
var
	handle hwnd,
	int Subtype
if StringCompare(sRealName,wn_maine_JAWS_ui) != 0 then
	return false
EndIf
let hwnd = GetCurrentWindow ()
let SubType = GetWindowSubtypeCode (hWnd)
if SubType == WT_STATIC  then
	SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp28_L)
	SayFormattedMessage(OT_USER_BUFFER,cscBufferNewLine+GetLockingAndAuthCodeInfoForVirtualViewer())
	AddHotKeyLinks()
	return true
Else
	PerformScript ScreenSensitiveHelp()
	return true
EndIf
EndFunction

int function ScreenSensitiveHelpGetVoicesUtility (string windowClass, string realWindowName)
if ! stringContains (windowClass, "GetVoices.exe") return FALSE endIf
var string HelpID = getObjectAutomationID()
if stringIsBlank (helpID) && getObjectSubtypeCode () == WT_LISTBOXITEM then
; inside of a list or group where help tags don't exist:
	helpID = HelpID_PremiumVoices
endIf
if HelpID == HelpID_SelectALanguage then
	SayMessage (OT_USER_BUFFER, sshMsg_SelectALanguage)
	AddHotKeyLinks ()
	return TRUE
elIf HelpID == HelpID_PremiumVoices then
	if realWindowName == wn_RemoveAVoice_Dialog then
		SayMessage (OT_USER_BUFFER, sshMsg_PremiumVoicesRemove)
	else
		SayMessage (OT_USER_BUFFER, sshMsg_PremiumVoices)
	endIf
	AddHotKeyLinks ()
	return TRUE
elIf HelpID == HelpID_PlaySample then
	SayMessage (OT_USER_BUFFER, sshMsg_PlaySample)
	AddHotKeyLinks ()
	return TRUE
elIf HelpID == HelpID_InstallSelectedVoices then
	SayMessage (OT_USER_BUFFER, sshMsg_InstallSelectedVoices)
	AddHotKeyLinks ()
	return TRUE
elIf HelpID == HelpID_RemoveAVoice then
	SayMessage (OT_USER_BUFFER, sshMsg_RemoveAVoice)
	AddHotKeyLinks ()
	return TRUE
elIf HelpID == HelpID_RemoveAllCompactVoices then
	SayMessage (OT_USER_BUFFER, sshMsg_RemoveAllCompactVoices)
	AddHotKeyLinks ()
	return TRUE
elIf HelpID == HelpID_RemoveAllVoices then
	SayMessage (OT_USER_BUFFER, sshMsg_RemoveAllVoices)
	AddHotKeyLinks ()
	return TRUE
elIf HelpID == HelpID_RemoveSelectedVoices then
	SayMessage (OT_USER_BUFFER, sshMsg_RemoveSelectedVoices)
	AddHotKeyLinks ()
	return TRUE
elIf HelpID == HelpID_Close then
	SayMessage (OT_USER_BUFFER, sshMsg_Close)
	AddHotKeyLinks ()
	return TRUE
else
	PerformScript ScreenSensitiveHelp()
	return true
endIf
endFunction

int function ScreenSensitiveHelpVoiceAssistantSettings (handle window, string realWindowName)
if realWindowName != wn_Voice_Assistant_settings then return FALSE endIf
var
	int subtype = getWindowSubtypeCode (window),
	int controlID = GetControlID (window)
if ! subtype then subtype = getObjectSubtypeCode () endIf
if subtype == WT_LINK then
	SayMessage (OT_USER_BUFFER, SSHMsgVoiceAssistantPrivacyPolicy)
	AddHotKeyLinks ()
	return TRUE
elIf subtype == WT_COMBOBOX then
	SayMessage (OT_USER_BUFFER, SSHMsgVoiceAssistantMicrophoneInputDevice)
	AddHotKeyLinks ()
	return TRUE
elIf subtype == WT_RADIOBUTTON 
&& (controlID == 17 || controlID == 18) then
	SayMessage (OT_USER_BUFFER, SSHMsgVoiceAssistantWakeWordRadioButtonGroup)
	AddHotKeyLinks ()
	return TRUE
elIf subtype == WT_CHECKBOX then
	if controlID == 19 then
		SayMessage (OT_USER_BUFFER, SSHMsgVoiceAssistantDoNotListenForWakeWord)
		AddHotKeyLinks ()
		return TRUE
	elIf controlID == 15 then
		SayMessage (OT_USER_BUFFER, SSHMsgVoiceAssistantEnableCheckBox)
		AddHotKeyLinks ()
		return TRUE
	elIf controlID == 20 then
		SayMessage (OT_USER_BUFFER, SSHMsgVoiceAssistantEnableSounds)
		AddHotKeyLinks ()
		return TRUE
	endIf
elIf subtype == WT_BUTTON && controlID == 1 then
	SayMessage (OT_USER_BUFFER, sshMsg_Close)
	AddHotKeyLinks ()
	return TRUE
endIf
performScript ScreenSensitiveHelp ()
return TRUE
endFunction

Script ScreenSensitiveHelp ()
var
	handle hwnd,
	string theClass,
	string sRealWindow
if GlobalMenuMode == 1 then
	ScreenSensitiveHelpForKnownClasses(wt_MenuBar)  ;known types
	return
EndIf
If UserBufferIsActive () then
	PerformScript ScreenSensitiveHelp()
	Return
EndIf
let hwnd = GetCurrentWindow ()
let theClass = GetWindowClass (hwnd)
let sRealWindow = GetWindowName(GetRealWindow(hWnd))
if theClass == wc_JAWS
|| (theClass == wc_EmptySpace && GetWindowClass (GetParent (hwnd)) == wc_JAWS) then
	SayFormattedMessage (OT_USER_BUFFER, msgScreenSensitiveHelp1_l, msgScreenSensitiveHelp1_s)
	AddHotKeyLinks ()
	return
elif ScreenSensitiveHelpForBasicsDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForStartUpDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForVIDEOINTERCEPTDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForWindowsSystemParametersDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForAboutDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForEnterAnAccessCodeDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForAdvancedOptionsDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForVoiceProfilesDialogs(sRealWindow) then
	return
elif ScreenSensitiveHelpForVoiceOPTIONSDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForVoiceSettingsDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForModifyBrailleSettingsDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForGraphicslabelerDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForCursorAndMessageVoiceDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForBrailleBasicSettingsDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForManageApplicationSettingsDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpForNavigationQuickKeysManagerDialog(sRealWindow) then
	return
elif ScreenSensitiveHelpFormaineJAWSui(sRealWindow) then
	return
elIf ScreenSensitiveHelpGetVoicesUtility (theClass, sRealWindow) then
	return
elIf ScreenSensitiveHelpVoiceAssistantSettings (hwnd, sRealWindow) then
	return
elIf ScreenSensitiveHelpRemoteDesktopDialog() then
	return
EndIf
PerformScript ScreenSensitiveHelp()
EndScript

int Function IsIbmJapanUppercaseDialog(HANDLE hwndReal)
	var
		HANDLE hwndTmp,
		String szSystemDefaultLang,
		String szTmp
	if (DialogActive ()==INACTIVE) then
		return 0
	endif
	let hwndTmp=FindDescendantWindow (hwndReal, IDC_MSG1_STATIC)
	if (hwndTmp!=0) then
		if (GetWindowSubtypeCode (hwndTmp)!=WT_STATIC) then
			return 0
		endif
	else
		return 0
	endif
	let hwndTmp=FindDescendantWindow (hwndReal, IDC_MSG2_STATIC)
	if (hwndTmp!=0) then
		if (GetWindowSubtypeCode (hwndTmp)!=WT_STATIC) then
			return 0
		endif
	else
		return 0
	endif
	let hwndTmp=FindDescendantWindow (hwndReal, IDC_NUM_PITCH2_PROMPT)
	if (hwndTmp!=0) then
		if (GetWindowSubtypeCode (hwndTmp)!=WT_STATIC) then
			return 0
		endif
	else
		return 0
	endif
	let hwndTmp=FindDescendantWindow (hwndReal, IDC_NUM_PITCH2_DETAILS)
	if (hwndTmp!=0) then
		if (GetWindowSubtypeCode (hwndTmp)!=WT_STATIC) then
			return 0
		endif
	else
		return 0
	endif
	let hwndTmp=FindDescendantWindow (hwndReal, IDC_NUM_PITCH3_PROMPT)
	if (hwndTmp!=0) then
		if (GetWindowSubtypeCode (hwndTmp)!=WT_STATIC) then
			return 0
		endif
	else
		return 0
	endif
	let hwndTmp=FindDescendantWindow (hwndReal, IDC_NUM_PITCH3_DETAILS)
	if (hwndTmp!=0) then
		if (GetWindowSubtypeCode (hwndTmp)!=WT_STATIC) then
			return 0
		endif
	else
		return 0
	endif
	let hwndTmp=FindDescendantWindow (hwndReal, IDC_NUM_PITCH4_PROMPT)
	if (hwndTmp!=0) then
		if (GetWindowSubtypeCode (hwndTmp)!=WT_STATIC) then
			return 0
		endif
	else
		return 0
	endif
	let hwndTmp=FindDescendantWindow (hwndReal, IDC_NUM_PITCH4_DETAILS)
	if (hwndTmp!=0) then
		if (GetWindowSubtypeCode (hwndTmp)!=WT_STATIC) then
			return 0
		endif
	else
		return 0
	endif
	let hwndTmp=FindDescendantWindow (hwndReal, IDC_NUM_PITCH2)
	if (hwndTmp!=0) then
		if (GetWindowSubtypeCode (hwndTmp)!=WT_EDIT) then
			return 0
		endif
	else
		return 0
	endif
	let hwndTmp=FindDescendantWindow (hwndReal, IDC_NUM_PITCH3)
	if (hwndTmp!=0) then
		if (GetWindowSubtypeCode (hwndTmp)!=WT_EDIT) then
			return 0
		endif
	else
		return 0
	endif
	let hwndTmp=FindDescendantWindow (hwndReal, IDC_NUM_PITCH4)
	if (hwndTmp!=0) then
		if (GetWindowSubtypeCode (hwndTmp)!=WT_EDIT) then
			return 0
		endif
	else
		return 0
	endif
	return 1
EndFunction

void function SayAboutJAWSDialog()
var
	handle hWnd
if GlobalRealWindowName != wn_AboutJAWS then
	return
EndIf
IndicateControlType(wt_dialog,GlobalRealWindowName,cscSpace)
let hWnd = GetFirstChild(GlobalRealWindow)
while hWnd
	if IsWindowVisible(hWnd) then
		if GetWindowSubtypeCode(hWnd) == wt_button then
			SayWindowTypeAndText(hWnd)
		else
			Say(GetWindowTextEx(hWnd,0,0),ot_dialog_text)
		EndIf
	EndIf
	let hWnd = GetNextWindow(hWnd)
EndWhile
EndFunction

void function ReadWelcomeMessage()
var
	int controlId
;; An impatient user may have exited the dialog box already or pressed Tab rather than wait
;; for the dialog box to finish speaking. Verify that focus is still in the dialog box and
;; in the welcome message edit before continuing.
if !StringContains(GlobalRealWindowName, wn_WelcomeDialog) then
	return
EndIf
controlId = GetControlID(GetFocus())
if (controlId != IDC_WELCOME_MESSAGE_EDIT)
   return
EndIf
JAWSTopOfFile()
SayAll()
EndFunction

void function SayWelcomeDialog()
var
	handle hWnd,
	int type
if !StringContains(GlobalRealWindowName, wn_WelcomeDialog) then
	return
EndIf
IndicateControlType(wt_dialog,GlobalRealWindowName,cscSpace)
ScheduleFunction("ReadWelcomeMessage", 10)
EndFunction

int Function ReadCustomRealWindows(HANDLE hwndRealWindow)
Var
	HANDLE hwndTmp,
	HANDLE hwndMsg1,
	HANDLE hwndMsg2,
	String szTitle,
	String szType,
	String szMsg1,
	String szMsg2,
	String szBuffer
If MenusActive () then
	Return TRUE;Kill kludj now fixed internally.
EndIf
if getObjectSubtypeCode () == WT_STATIC then
; prevent main JAWS window from reading version info:
	say (GlobalRealWindowName, OT_DIALOG_NAME)
	return TRUE
endIf
if GlobalRealWindowName == wn_AboutJAWS then
	SayAboutJAWSDialog()
	return true
elif StringContains(GlobalRealWindowName, wn_WelcomeDialog) then
	SayWelcomeDialog()
	return true
elIf stringContains (GlobalRealWindowName, wn_Activation) then
	; the static no longer appears in correct location, so read the static if it exists:
	hwndTmp = findWindow (hwndRealWindow, "Static")
	if hwndTmp then
		SayWindowTypeAndText (hwndRealWindow) ; the dialog window
		SayWindowTypeAndText (hwndTmp) ; the static indicating need to authorize.
		return TRUE
	endIf
EndIf
if (hwndRealWindow==0) then
	if (IsPCCursor ()) then
		let hwndTmp=GetFocus ()
	else
		let hwndTmp=GetCurrentWindow ()
	endif
	let hwndRealWindow=GetRealWindow (hwndTmp)
endif
if (IsIbmJapanUppercaseDialog(hwndRealWindow)==0) then
	return 0
else
	let hwndMsg1=FindDescendantWindow (hwndRealWindow, IDC_MSG1_STATIC)
	let hwndMsg2=FindDescendantWindow (hwndRealWindow, IDC_MSG2_STATIC)
	if (hwndMsg1==0 || hwndMsg2==0) then
		return 0
	endif
	let szTitle=GetWindowName (hwndRealWindow)
	let szType=GetWindowType (hwndRealWindow)
	let szMsg1=GetWindowText (hwndMsg1, FALSE)
	let szMsg2=GetWindowText (hwndMsg2, FALSE)
	let szBuffer=szMsg1+"\r\n\r\n"+szMsg2
	SayControlExWithMarkup (hwndRealWindow,szTitle,szType,"","","","","",szBuffer)
	return 1
endif
return 0
EndFunction

int Function ReadCustomControls(HANDLE hwndRealWindow,HANDLE hwndControl)
Var
	int iID,
	int iTmp,
	HANDLE hwndTmp,
	String szTmp
If MenusActive () then
	Return 0;Kill kludj now fixed internally.
EndIf
if (hwndRealWindow==0) then
	let hwndRealWindow=GetRealWindow (hwndControl)
endif
If getWindowSubtypeCode (hwndControl) == WT_READONLYEDIT 
&& getControlID (hwndControl) == ID_FSCast_DESCRIPTION 
&& getRealWindow (hwndControl) != GlobalPrevReal then
	SayWindowTypeAndText (hwndControl)
	sayMessage (OT_NO_DISABLE, GetWindowText (hwndControl, READ_EVERYTHING))
	return TRUE
EndIf
if (IsIbmJapanUppercaseDialog(hwndRealWindow)==0) then
	return 0
else
	let iID=GetControlID (hwndControl)
	if (iID==IDC_NUM_PITCH2) then
		let iTmp=IDC_NUM_PITCH2_DETAILS
	elif (iID==IDC_NUM_PITCH3) then
		let iTmp=IDC_NUM_PITCH3_DETAILS
	elif (iID==IDC_NUM_PITCH4) then
		let iTmp=IDC_NUM_PITCH4_DETAILS
	else
		let iTmp=0
	endif
	if (iTmp==0) then
		return 0
	else
		let hwndTmp=FindDescendantWindow (hwndRealWindow, iTmp)
		let szTmp=GetWindowText (hwndTmp, FALSE)
		SayWindowTypeAndText (hwndControl)
		Say(szTmp,OT_CONTROL_NAME)
		return 1
	endif
endif
return 0
EndFunction

int function SayVoiceProfilesSlider(handle hWnd)
var
	int iSubtype,
	int iCtrl
let iSubtype = GetWindowSubtypeCode(hWnd)
if iSubtype != wt_LeftRightSlider then
	return false
EndIf
let iCtrl = GetControlID(hWnd)
if iCtrl == id_Voice_Profiles_rate_slider
|| iCtrl == id_Voice_Profiles_pitch_slider
|| iCtrl == id_voice_profiles_SayAll_rate_slider
|| iCtrl == id_voice_profiles_SayAll_pitch_slider
|| iCtrl == id_voice_profiles_SayAll_volume_slider
|| iCtrl == id_voice_rate_slider
|| iCtrl == id_voice_pitch_slider then
	SayControlEx(hWnd,GetWindowName(GetPriorWindow(GetPriorWindow(hWnd)))+cscSpace+GetWindowName(GetPriorWindow(hWnd)))
	return true
elif iCtrl == id_Voice_profiles_volume_slider then
	SayControlEx(hWnd,GetWindowName(GetPriorWindow(GetPriorWindow(GetPriorWindow(hWnd))))+cscSpace+GetWindowName(GetPriorWindow(hWnd)))
	return true
EndIf
return false
EndFunction

void function SayWindowTypeAndText(handle hWnd)
if SayVoiceProfilesSlider(hWnd) then
	return
EndIf
SayWindowTypeAndText(hWnd)
EndFunction

Void Function SayFocusedWindow ()
var
	HANDLE hwndControl,
	string sWinName
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
if IsPCCursor() then
	let hwndControl=GetFocus ()
else
	let hwndControl=GetCurrentWindow ()
endif
if ReadCustomControls(GetRealWindow (hwndControl),hwndControl) == 1 then
	return
EndIf
if !gbRealWindowSpoken then
	;if we are searching for the authorization CD, say the static text:
	let sWinName = GetWindowName(GlobalFocusWindow)
	if sWinName == wn_CancelSearchButton then
		;make sure of the string compare:
		if StringLength(sWinName) == StringLength(wn_CancelSearchButton) then
			Say(GetWindowTextEx(GetFirstWindow(GlobalFocusWindow),0,0),ot_dialog_text)
		EndIf
	EndIf
EndIf
SayFocusedWindow ()
EndFunction

void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle hTmpWizard,
	handle RealWindow,
	string RealWindowName,
	handle AppWindow,
	int bSayTopLineOfEdit
WPFProgressBarInfo = new collection
if getObjectSubtypeCode () == WT_PROGRESSBAR
;&& ! dialogActive ()
&& stringContains (getWindowClass (focusWindow), "GetVoices.exe") then
; update progress bar info for Braille display:
	EnumerateTypeAndTextStringsForWindow (focusWindow, "getWPFProgressBarInfo")
endIf
if ReturningFromResearchItDialog () 
; or we're in the getVoices window which is written in WPF:
|| stringContains (getWindowClass (focusWindow), "GetVoices") then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let RealWindow = GetRealWindow (FocusWindow)
let GlobalRealWindow = RealWindow
let RealWindowName = GetWindowName (RealWindow)
let GlobalRealWindowName = RealWindowName
let AppWindow = GetAppMainWindow (FocusWindow)
;we announce nothing for the app change.
If ((GlobalPrevRealName != RealWindowName) ; name has changed
|| (GlobalPrevReal != RealWindow)) then ; or handle has changed, then
	;sometimes, we must speak the dialog static text when it changes.
	;but, we do not want to double speak, so we use a global var to test if the real window was spoken:
	let gbRealWindowSpoken = true ;cleared in FocusChangedEvent after focus window is spoken
	if (ReadCustomRealWindows(RealWindow)==0) then
		SayWindowTypeAndText (RealWindow)
	endif
endIf
let GlobalFocusWindow = FocusWindow
if GlobalPrevFocus != focusWindow
&& GetWindowTypeCode(focusWindow) != WT_TOOLBAR then
	If (InHjDialog ()) then
		If (GetWindowSubtypeCode (FocusWindow) == WT_READONLYEDIT) then
			TypeKey (cksControlHome)
			;Let bSayTopLineOfEdit = TRUE ; old behavior, now causes double-speaking
		EndIf
	EndIf
	SayFocusedWindow () ; will use global variable GlobalFocusWindow
	If bSayTopLineOfEdit then
		SaveCursor ()
		PcCursor ()
		SayLine ()
		RestoreCursor ()
	EndIf
else
	if getWindowSubtypeCode (FocusWindow) == WT_LEFTRIGHTSLIDER
	|| getWindowSubtypeCode (FocusWindow) == WT_UPDOWNSLIDER  then
		Return;Allow processing by other events:
	else
		SayFocusedObject ()
	endIf
endIf
let gbRealWindowSpoken = false
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

Script  SayWindowPromptAndText()
var
	HANDLE hwndControl,
	int iSubType,
	int nMode
If GlobalMenuMode > 0 then;default:
	PerformScript  SayWindowPromptAndText()
	Return
EndIf
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
If IsPcCursor () then
	if getObjectSubtypeCode () == WT_LISTBOXITEM
	&&stringContains (getWindowClass (getFocus ()), "GetVoices.exe") then 
		sayObjectTypeAndText (1)
		sayObjectTypeAndText ()
		smmToggleTrainingMode(nMode)
		Return
	endIf
	If GetWindowSubtypeCode (GlobalFocusWindow) == WT_STATIC then
		PerformScript SayLine ()
		smmToggleTrainingMode(nMode)
		Return
	EndIf
EndIf
if (IsPCCursor ()) then
	let hwndControl=GetFocus ()
else
	let hwndControl=GetCurrentWindow ()
endif
Let iSubType = GetWindowSubTypeCode (hwndControl)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
if (ReadCustomControls(GetRealWindow (hwndControl),hwndControl)!=1) then
	SayObjectTypeAndText ()
	SayTutorialHelp (iSubType, TRUE)
	SayTutorialHelpHotKey (hwndControl, TRUE)
endif
smmToggleTrainingMode(nMode)
EndScript

Script OptionsMenu ()
SayCurrentScriptKeyLabel ()
If ! DialogActive () &&
GetWindowSubTypeCode (GetFocus ()) != WT_CONTEXTMENU then
	TypeKey (ksOptions)
Else
	TypeCurrentScriptKey ()
EndIf
EndScript

script JAWSWindow ()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
EndScript

Script UpALevel()
var
	handle hwnd,
	int TheTypeCode,
	string sMessage,
	string sRealWindow
Let hWnd = GetCurrentWindow()
let sRealWindow = GetWindowName(GetRealWindow(hWnd))
If StringCompare(sRealWindow,wn_maine_JAWS_ui) == 0 then
	SayCurrentScriptKeyLabel ()
	if UserBufferIsActive() then
		UserBufferDeactivate()
		; don't want to pass the Esc key on to the app.
		return
	endIf
	TypeKey(cksEscape) ;escape
	If GIBrailleActive then
		BrailleRefresh()
	endIf
	SaveCursor()
	PCCursor()
	let hwnd = GetCurrentWindow ()
	let TheTypeCode = GetWindowSubtypeCode(hwnd)
	If (TheTypeCode == WT_MENU) then
		let sMessage =   FormatString (cmsg3_L, GetWindowText (hwnd, true))
		SayFormattedMessage (ot_control_name, sMessage)
		return
	endIf
	if (TheTypeCode == WT_STARTMENU) then
		let sMessage =   FormatString (cmsg4_L, GetWindowText (hwnd, true))
		SayFormattedMessage (ot_control_name, sMessage)
		return
	endIf
	if (TheTypeCode == WT_CONTEXTMENU) then
		let sMessage =   FormatString (cmsg5_L, GetWindowText (hwnd, true))
		SayFormattedMessage (ot_control_name, sMessage)
	EndIf
	return
Else
	PerformScript UpALevel()
endIf



EndScript

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
if GlobalRealWindowName == wn_Activation then
	;we don't want to anounce when in the activation process
	return
EndIf
tutorMessageEvent(hwndFocus,nMenuMode)
EndFunction

Void Function SayTutorialHelp (int iObjType, int IsScriptKey)
if GlobalRealWindowName == wn_Activation then
	;we don't want to anounce when in the activation process
	return
EndIf
SayTutorialHelp(iObjType,IsScriptKey)
EndFunction

Int Function SayTutorialHelpHotKey (handle hHotKeyWindow, int IsScriptKey)
if GlobalRealWindowName == wn_Activation then
	;we don't want to anounce when in the activation process
	return false
EndIf
SayTutorialHelpHotKey(hHotKeyWindow,IsScriptKey)
EndFunction

Script SayAll ()
if !GlobalMenuMode
&& GetWindowSubtypeCode(GlobalFocusWindow) == wt_Static
&& GetControlID(GlobalFocusWindow) == -1 then
	Say(GetWindowTextEx(GlobalFocusWindow,0,0),ot_line)
else
	PerformScript SayAll()
EndIf
EndScript

script SayLine()
if IsPCCursor()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	if SayVoiceProfilesSlider(GetFocus()) then
		return
	EndIf
EndIf
PerformScript SayLine()
EndScript

Script SayNextLine()
var
	int nMode
performScript sayNextLine()
If IsPcCursor ()
&& !IsVirtualPCCursor()
&& GlobalMenuMode == 0
	If GetWindowSubtypeCode (GlobalFocusWindow) == WT_STATIC then
		let nMode=smmTrainingModeActive()
		smmToggleTrainingMode(TRUE)
		PerformScript SayLine ()
		smmToggleTrainingMode(nMode)
	EndIf
EndIf
EndScript

Script SayPriorLine()
var
	int nMode
performScript sayPriorLine()
If IsPcCursor ()
&& !IsVirtualPCCursor()
&& GlobalMenuMode == 0
	If GetWindowSubtypeCode (GlobalFocusWindow) == WT_STATIC then
		let nMode=smmTrainingModeActive()
		smmToggleTrainingMode(TRUE)
		PerformScript SayLine ()
		smmToggleTrainingMode(nMode)
	EndIf
EndIf
EndScript

Script ReadBoxInTabOrder()
;Reads thru Dialog Box in Tab order
var
	int safety,
	handle hCurrent,
	handle hWnd,
	handle hPos, ; for dialog inside a dialog
	handle hPosChild

let safety = 0
let hCurrent = GetCurrentWindow ()
let hWnd = GetRealWindow (hCurrent)
if getWindowTypeCode(hwnd) ==wt_dialog && getWindowTypeCode(getFirstChild(hwnd)) == wt_dialog && !UserBufferIsActive () && DialogActive () then
	SayFormattedMessage (OT_ERROR, formatString(cMsg33_L,getWindowName(hwnd)), cMsgSilent);"Reed Box in tab order "
	If ! GetDialogStaticText () then
		Say (MSAAGetDialogStaticText (), OT_DIALOG_TEXT)
	EndIf
	EnumerateChildWindows (getFirstChild(GetRealWindow (hCurrent)), "DoChildWindows")
	let hwnd = FindWindow (hwnd, scSysTabControl32, "")
	let hwnd = getNextWindow(hwnd)
	while hwnd && safety < 10
		if isWindowVisible(hwnd) then
			SayWindowTypeAndText (hWnd)
		Endif
		let hwnd  = getNextWindow(hwnd)
		let safety = safety + 1
	EndWhile
	return
EndIf

performScript ReadBoxInTabOrder()
EndScript

int Function DoChildWindows (handle hWnd)
var
	int iSubtype,
	handle hPrior = GetPriorWindow (hwnd),
	handle hNext = getNextWindow (hwnd),
	string sName,
	string sCtrlLabel1,
	string sCtrlLabel2
If !IsWindowActuallyVisible (hWnd) then
	Return TRUE
EndIf
let iSubtype = GetWindowSubtypeCode(hWnd)
let sName = GetWindowName(hWnd)
if iSubtype == WT_READONLYEDIT && hwnd != getFocus () then
	; Internal SayWindowTypeAndText gets these windows wrong,
	;using the focused window's text as text.
	indicateControlType (iSubtype, getWindowName (hwnd), getWindowText (hwnd, READ_EVERYTHING))
	return TRUE
elIf iSubtype == WT_STATIC then
	if getWindowSubtypeCode (hPrior) == WT_STATIC
	&& stringCompare (sName, getWindowName (hPrior)) == 0 THEN
		;Prevent duplication of window reading:
		return TRUE
	elIf hNext != getFocus () ; focused text box needs the prior static to read.
	&& getWindowSubtypeCode (hNext) == WT_READONLYEDIT
	&& stringCompare (sName, getWindowName (hNext)) == 0 THEN
		;Eliminate these static windows from reading, as the text box will catch it:
		return TRUE
	endIf
endIf
return DoChildWindows (hWnd)
endFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd,
	string sRealName,
	string sName
let hWnd = GetCurrentWindow()
;note that voice sliders are in the StartUp wizard,
;so run this code before the normal test for StartUp Wizard code:
if SayVoiceProfilesSlider(hWnd) then
	return
EndIf
; Voices Utility window:
if stringContains (getWindowClass (hwnd), "GetVoices.exe") then
	Return SayObjectTypeAndText(nLevel,includeContainerName)
EndIf
If stringContains (GetWindowName (GetRealWindow (hWnd)), WN_STARTUP_WIZARD) then
	Return SayObjectTypeAndText(nLevel,includeContainerName)
EndIf
let sRealName = GetWindowName(GetRealWindow(hWnd))
if StringCompare(sRealName,wn_Global_Voice_Profiles_dialog ) == 0
|| StringCompare(sRealName,wn_Individual_Voices_dialog) == 0 then
	let sName = GetWindowName(hWnd)
	if sName == wn_NameComboBox then
		;accomodate those who don't want control group names on but want to hear them anyway:
		if !GetJCFOption(OT_CONTROL_GROUP_NAME) then
			Say(GetWindowName(GetPriorWindow(GetPriorWindow(hWnd))),OT_CONTROL_NAME)
		EndIf
	EndIf
EndIf
if nLevel == 0
	if GetObjectSubtypeCode() == wt_static
	&& GetControlID(hWnd) == id_JAWSMainWindow
		;do not announce the main window content when it gains focus
		return
	endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

Int Function ShouldSayFunctionsSpeakSlider (int theTypeCode)
;Because the synthesizer slider controls may allow for movement in increments less than a percentage,
;and the slider value only changes when the percentage changes,
;the JAWS window sliders will use the Say functions for the sliders instead of the value changed event.
return IsSliderControl(theTypeCode)
EndFunction

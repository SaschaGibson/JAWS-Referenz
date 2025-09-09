; Copyright 1995-2015 by Freedom Scientific, Inc.
; JAWS default script file
;Callback functions for Quick Settings support.

include "hjConst.jsh"
include "hjGlobal.jsh"
include "Braille.jsh" ; contains Braille-specific globals
include "braille.jsm" ; for strings for callback.
include "common.jsm"
include "UO.jsh"
include "ieCustomSettings.jsh" ; added for default page refresh value

;Use "IECustomSettings.jsb" ; This is done from within the Browser files who use Browser.qs

import "UserOptions.jsd"
import "uoSayAllSchemes.jsd"

const 
OutlookUIAReadOnlyMessageRegKey = "Software\\Freedom Scientific\\FSDomSrv\\2025",
OutlookUIAReadOnlyMessageRegValue = "UseUIAForOutlookReadonlyMessages",
; Used to consult the Feature Gate for Outlook Readonly message UIA support. 
OutlookUIAReadOnlyMessageOverrideRegValue = "UseUIAForOutlookReadonlyMessagesOverride"

GLOBALS
; for AnnouncePageElementsOnLoad
	int GlobalAnnouncePageElementsOnLoad,
; from Personalized Web Settings, to ensure globals are updated for resets in Virtual Cursor where personalized settings apply:
; These should be copied from ieCustomSettings.jss and correspond with any custom callback you will be overwriting for a Virtual Cursor setting,
; so that the proper global variable data gets cached accordingly.
	int gIDocumentPresentation,
	int GILinkText,
	int gIFormsModeAutoOff,
	int giAutoFormsMode,
; End of Personalized Settings options
	string gstrOCRLangStrings,
	int GIPrevBrlMarking,
; for language filter combo box	
	collection BrlLanguageAndMode,
; members:
; BrlLanguageAndMode.ModeID
; BrlLanguageAndMode.ModeName
; BrlLanguageAndMode.LangID
; BrlLanguageAndMode.LangName
; BrlLanguageAndMode.LangComboBoxID ; the selection in the language combo box
;lists are linear arrays to store values which get filled by read and selected / used by write methods:
;BrlLanguageAndMode.ModesList ; list of mode IDs.
;BrlLanguageAndMode.LangsList ; list of language codes
; end members
;Private: array of collections for SayAllSchemes
	variantArray UOSayAllSchemesData,
;overwrites of UserOptions and Verbosity globals:
	int GiPrevHTMLRefresh,
	int iSavedProgressBarAnnouncementInterval,
	string GDocumentSayAllScheme,
	int giPrevFormsModeThreshold,
	int GlobalIgnoreNotificationsFromVolumeChange, ; for Volume Control Notifications script
	;For Personalized Settings:
	int bWereCustomSettingsLoaded,
	string GStrAddress,
	string gStrFileName

messages
@SetDisabled
 Enabled="False"
@@
@ListReadResponseStart
<ReadResponse ID="ListItems">
@@
@DisabledListReadResponseStart
<ReadResponse ID="ListItems" Enabled="False">
@@
@ListValuesStart
	<ListValues SettingsID="%1" SelectIndex="%2">
@@
@ListValue
		<ListValue Text="%1"/>
@@
@ListValuesEnd
	</ListValues>
@@
@ListReadResponseEnd
</ReadResponse>
@@
@BooleanReadResponse
<ReadResponse ID="BooleanSelection">
	<Selected SettingsID ="%1" Value="%2" />
</ReadResponse>
@@
@DisabledBooleanReadResponse
<ReadResponse ID="BooleanSelection" Enabled="False">
	<Selected SettingsID ="%1" Value="%2" />
</ReadResponse>
@@
;\037 is the % character used to keep from interfering with formatted strings.
@VariableReadResponse
<ReadResponse ID="VariableResult">
	<VariableValue ID="\037%1\037" Value="%2" />
</ReadResponse>
@@
@DependeeChange
<OnDependeeChanged ID="%1" DependeeType="%2">
	<ChangedValue Index="%3" />
</OnDependeeChanged>
@@
@DisabledStateReturn
<ExcludeResponse ID="%1" Show="%2" />
@@
endMessages

Messages;Test
@OCRInfo
<ReadResponse ID="ListItems">
	<ListValues SettingsID="ConvenientOCR.%1" SelectIndex="0">
		<ListValue Text="Bulgarian"/>
		<ListValue Text="Catalan"/>
		<ListValue Text="Czech"/>
		<ListValue Text="Danish"/>
		<ListValue Text="German"/>
	</ListValues>
</ReadResponse>
@@
@ExtraOCRInfo
		<ListValue Text="Greek"/>
		<ListValue Text="English - United States"/>
		<ListValue Text="Finnish"/>
		<ListValue Text="French"/>
		<ListValue Text="Hungarian"/>
		<ListValue Text="Icelandic"/>
		<ListValue Text="Italian"/>
		<ListValue Text="Dutch"/>
		<ListValue Text="Norwegian (Bokmål)"/>
		<ListValue Text="Polish"/>
		<ListValue Text="Portuguese - Brazil"/>
		<ListValue Text="Romanian"/>
		<ListValue Text="Russian"/>
		<ListValue Text="Croatian"/>
		<ListValue Text="Slovak"/>
		<ListValue Text="Albanian"/>
		<ListValue Text="Swedish"/>
		<ListValue Text="Turkish"/>
		<ListValue Text="Indonesian"/>
		<ListValue Text="Ukrainian"/>
		<ListValue Text="Belarusian"/>
		<ListValue Text="Slovenian"/>
		<ListValue Text="Estonian"/>
		<ListValue Text="Latvian"/>
		<ListValue Text="Lithuanian"/>
		<ListValue Text="Azeri (Latin)"/>
		<ListValue Text="Basque"/>
		<ListValue Text="FYRO Macedonian"/>
		<ListValue Text="Afrikaans"/>
		<ListValue Text="Faeroese"/>
		<ListValue Text="Malay"/>
		<ListValue Text="Galician"/>
		<ListValue Text="English - United Kingdom"/>
		<ListValue Text="Portuguese - Portugal"/>
		<ListValue Text="Serbian - Serbia (Latin)"/>
		<ListValue Text="Spanish"/>
		<ListValue Text="Serbian - Serbia (Cyrillic)"/>
	</ListValues>
</ReadResponse>
@@
endMessages

void function autoStartEvent ()
endFunction

int function qsxmlConvertStateToBoolean (string xmlState)
if xmlState == "False" then
	return FALSE
elIf xmlState == "True" then
	return TRUE
;else
endIf
endFunction

string function qsxmlMakeBooleanState (int nJAWSState)
if nJAWSState <= FALSE then
	return "False"
else
	return "True"
endIf
endFunction

string function qsxmlMakeDisabledSetting  (string settingID, int nState)
return formatString (DisabledStateReturn, settingID, qsxmlMakeBooleanState (nState))
endFunction

string function QsxmlMakeList (string settingID, int nSelectIndex, stringArray listItems, int nArraySize, int bDisabledSetting)
var
	string sTab = "\t",
	int i=1,
	string sList,
	string sItem
;As JAWS script arrays, like Python, are 1-based, and internsal xml indeces, like PERL, are 0-based,
;we need to round down to ensure that selection indeces fall within range.
if (nSelectIndex >= nArraySize)
	nSelectIndex = nArraySize-1 ;
elIf (nSelectIndex < 0)
	nSelectIndex = 0; lower bound for array of indeces.
endIf
if bDisabledSetting then
	sList = DisabledListReadResponseStart
else
	sList = ListReadResponseStart
endIf
sList = sList+cscBufferNewLine+sTab
	+formatString (ListValuesStart, settingID, nSelectIndex)+cscBufferNewLine
for i=1 to nArraySize
	if ! stringIsBlank (listItems[i])then
		sItem = formatString (ListValue, listItems[i])
	endIf
	sItem = sTab+sTab+sItem
	sList = sList+sItem+cscBufferNewLine
endFor
sList = sList+sTab+ListValuesEnd+cscBufferNewLine+ListReadResponseEnd
return sList
endFunction

/* Makes the XML list from a delimited segmented string rather than an array */
string function QsxmlMakeListFromDelimitedString(string settingID, int nSelectIndex, string sSegments, string sDelim, int bDisabledSetting)
var
stringArray arr,
int nArraySize,
int nIndex
let nArraySize=stringSegmentCount(sSegments,sDelim)
if (nArraySize==0)
	return cscNull
endIf
let arr=new stringArray[nArraySize]
for nIndex=1 to nArraySize
	arr[nIndex]=StringSegment(sSegments,sDelim,nIndex)
endFor
return QsxmlMakeList (settingID, nSelectIndex, arr, nArraySize, bDisabledSetting)
endFunction

string function qsxmlMakeBoolean (string settingID, string state, int bDisabledSetting)
if bDisabledSetting then
	return formatString (DisabledBooleanReadResponse, settingID, state)
else
	return formatString (BooleanReadResponse, settingID, state)
endIf
endFunction

string function qsxmlMakeVariable (string settingID, string sValue)
return stringReplaceSubStrings (formatString (VariableReadResponse, settingID, smmMarkupString (sValue)), "\\037", "%")
endFunction

void function parseXMLListWriteRequest (string sxml, int byRef item,
	optional string byRef sItemText, optional string byRef settingID)
var
	string stmp,
	string stripped,
	;these are tokens to support the parts of the string we need.
	string ID = "|", string selectedIndex = "$", string text = "^", string quote = "\""
;top line is just the declaration of type.
stripped = stringTrimLeadingBlanks (stringChopLeft (sXml,	stringLength (stringSegment (sXml, ">", 1))+1))
;all we need is the inner node to support the callback requests from the scripts:
stripped = stringTrimLeadingBlanks (stringLeft (stripped,	stringLength (stringSegment (stripped, ">", 1))))
;now, for convenience, break the string up to allow gleaning.
stripped = stringReplaceSubstrings (stripped, "ID=", ID)
stripped = stringReplaceSubstrings (stripped, "SelectedIndex=", selectedIndex)
stripped = stringReplaceSubstrings (stripped, "Text=", text)
stmp = stringTrimLeadingBlanks (stringSegment (stripped, selectedIndex, 2))
stmp = stringTrimLeadingBlanks (stringSegment (stmp, quote, 2))
item = stringToInt (stmp)
stmp = stringTrimLeadingBlanks (stringSegment (stripped, text, 2))
stmp = stringTrimLeadingBlanks (stringSegment (stmp, quote, 2))
;convert identity references  for quotes if there are any in the text
sItemText = stringReplaceSubStrings (stmp, "&quot;", quote)
stmp = stringTrimLeadingBlanks (stringSegment (stripped, ID, 2))
stmp = stringTrimLeadingBlanks (stringSegment (stmp, quote, 2))
settingID = stmp
endFunction

void function parseXMLBooleanWriteRequest (string sxml, int byRef nState, optional string byRef settingID)
var
	string stmp,
	string stripped,
	;these are tokens to support the parts of the string we need.
	string ID = "|", string selected = "$", string quote = "\""
;top line is just the declaration of type.
stripped = stringTrimLeadingBlanks (stringChopLeft (sXml,	stringLength (stringSegment (sXml, ">", 1))+1))
;all we need is the inner node to support the callback requests from the scripts:
stripped = stringTrimLeadingBlanks (stringLeft (stripped,	stringLength (stringSegment (stripped, ">", 1))))
;now, for convenience, break the string up to allow gleaning.
stripped = stringReplaceSubstrings (stripped, "ID=", ID)
stripped = stringReplaceSubstrings (stripped, "Selected=", selected)
stmp = stringTrimLeadingBlanks (stringSegment (stripped, selected, 2))
stmp = stringLower (stringTrimLeadingBlanks (stringTrimTrailingBlanks (stringSegment (stmp, quote, 2))))
;convert state string to actual state.
nState = qsxmlConvertStateToBoolean  (stmp)
stmp = stringTrimLeadingBlanks (stringSegment (stripped, ID, 2))
stmp = stringTrimLeadingBlanks (stringSegment (stmp, quote, 2))
settingID = stmp
endFunction

void function ParseXMLDependenceEvent (string sXMLWriteRequest, int byRef iSelection, optional string byRef sDependee, optional string byRef sType)
var
	string stripped, string sTmp,
;tokens for parts of the write request:
	string quote = "\"", string sID = "|", string selection = "~",string type = "^"
;prepare for segmentation
stripped = stringReplaceSubstrings (sXMLWriteRequest, "OnDependeeChanged ID=", sID)
stripped = stringReplaceSubstrings (stripped , "DependeeType=", Type)
stripped = stringReplaceSubstrings (stripped , "Index=", selection)
Stripped = StringTrimLeadingBlanks (stringTrimTrailingBlanks (stripped ))
stmp = stringSegment (stripped, selection, 2)
if stmp then
	stmp = stringSegment (stmp, quote, 2)
	iSelection = stringToInt (stmp)
endIf
stmp = stringSegment (stripped, type, 2)
if stmp then
	stmp = stringSegment (stmp, quote, 2)
	sType = stmp
endIf
stmp = stringSegment (stripped, sID, 2)
if stmp then
	stmp = stringSegment (stmp, quote, 2)
	sDependee = stmp
endIf
endFunction

;Custom Settings:
int function GetNonJCFOption (string sOption, optional int nReadSource)
var
	string section = SECTION_NONJCF_OPTIONS,
	string sValue
;All these thus far are ints, but using string to determine if the file was ever written to.
sValue = ReadSettingString (Section, sOption, "", FT_CURRENT_JCF, nReadSource)
if (stringIsBlank (sValue))
	sValue = ReadSettingString (Section, sOption, "", FT_DEFAULT_JCF, nReadSource)
endIf
return stringToInt (sValue)
endFunction

int function GetNonJCFOptionEx(string sOption, int defaultValue, optional int nReadSource)
var
	string section = SECTION_NONJCF_OPTIONS,
	string activeConfiguration1 = GetActiveConfiguration(true),
	string activeConfiguration2 = GetActiveConfiguration(false),
	string sValue
; All these thus far are ints, but using string to determine if the file was ever written
; to.
sValue = ReadSettingString(Section, sOption, "", FT_CURRENT_JCF, nReadSource, activeConfiguration1)
if (stringIsBlank(sValue) && activeConfiguration1 != activeConfiguration2)
	sValue = ReadSettingString(Section, sOption, "", FT_CURRENT_JCF, nReadSource, activeConfiguration2)
endIf
if (stringIsBlank(sValue))
	sValue = ReadSettingString(Section, sOption, "", FT_DEFAULT_JCF, nReadSource)
endIf
if (stringIsBlank(sValue))
	return defaultValue
endIf
return stringToInt(sValue)
endFunction

void function loadNonJCFOptions ()
;Braille Study Mode:
if inHjDialog ()
; exclude QuickSettings in case it's still up when this function runs:
&& ! inQuickSettingsDialog () then
	return
endIf
if IsBSMCapableBrlDisplay() then
;do not turn this option on anywhere if non-Study-mode display is connectedd.
	gbBrailleStudyModeActive = GetNonJCFOption ("BrailleStudyModeActive")
endIf
giBrlTBLZoom = GetNonJCFOption("BrlTBLZoom")
giBrlTblHeader = GetNonJCFOption("BrlTblHeader")
giBrlShowCoords = GetNonJCFOption("BrlShowCoords")
;Virtual Cursor options:
;SSB-SM We must set auto forms mode global variable so it takes effect right away in Firefox
giAutoFormsMode = GetJCFOption (OPT_AUTO_FORMS_MODE)
;Allow for current or legacy setting:
;separate options for JAWS and MAGic
if getRunningFSProducts () == PRODUCT_MAGic then
	gbDefaultSayAllOnDocumentLoad = getJCFOption (OPT_AUTO_SPEAK_WEB_PAGES)
else ;For JAWS and Fusion:
	gbDefaultSayAllOnDocumentLoad = GetJCFOption (OPT_SAYALL_ON_DOCUMENT_LOAD)
endIf
gbDefaultVCursorCellCoordinatesAnnouncement = GetNonJCFOption(hKey_VCursorCellCoordinatesAnnouncement)
giTblHeaders = GetNonJCFOption ("TblHeaders")
gbDefaultVCursorCellCoordinatesAnnouncement = GetNonJCFOption ("DefaultVCursorCellCoordinatesAnnouncement")
gbInterruptSpeechWhenADialogBoxIsCreated = GetNonJCFOption(hKey_InterruptSpeechWhenADialogBoxIsCreated)
GlobalAnnouncePageElementsOnLoad = getNonJCFOption ("AnnouncePageElementsOnLoad")
GlobalIgnoreNotificationsFromVolumeChange = getNonJCFOption ("IgnoreNotificationsFromVolumeChange")
gbUseInferredAccessKeys = GetNonJCFOptionEx("UseInferredAccessKeys", True)
;The following is technically not a NonJCF option, but must be loaded manually to take effect:
if ! stringIsBlank (readSettingString (SECTION_OPTIONS, "Punctuation", "", FT_CURRENT_JCF, rsStandardLayering)) then
	setJcfOption (OPT_PUNCTUATION, ReadSettingInteger (SECTION_OPTIONS, "Punctuation", getJcfOption (OPT_PUNCTUATION), FT_CURRENT_JCF, rsStandardLayering))
endIf
SetTouchQuickKeyNavigationMode(GetNonJCFOption(hKey_TouchQuickKeyNavigationMode))
SetUseTouchNavigationSounds(GetNonJCFOption(hKey_UseTouchNavigationSounds))
SetTouchRotorInitialQuickNavIndex(GetNonJCFOption(hKey_TouchRotorInitialType))
endFunction

string function QuickSettingDisabledEvent (string settingID)
var
	string sItem = stringSegment (settingID, ".", -1),
	string sRoot = stringSegment (settingID, ".", 1)
if sRoot == "TouchCursorOptions"
	if sItem == "ConfigureTypes"
		return qsxmlMakeDisabledSetting (settingID, ShouldAddTouchCursorOptionsConfigureTypesBranchToQuickSettings())
	elif sItem == "RestoreToDefault"
		return qsxmlMakeDisabledSetting (settingID,HasAppUIACustomizedTypeConfigurationsFromUser())
	endIf
endIf
if sRoot == "BrailleOptions"
&& stringCompare (settingID, sRoot) == 0 then
	return qsxmlMakeDisabledSetting  (settingID, BrailleInUse ())
endIf
; This catches both VerticalAlignment and VerticalAlignmentType options.
if stringContains(settingID, "BrailleOptions.MultilineOptions.VerticalAlignment") then
	return qsxmlMakeDisabledSetting  (settingID, IsVerticalAlignmentRelevant())
endIf
if sRoot == "VirtualCursorOptions"
&& stringCompare (settingID, sRoot) == 0 then
	return qsxmlMakeDisabledSetting  (settingID, isVirtualPcCursor () || IsFormsModeActive())
endIf
if sItem == "NavigationQuickKeyDelay" then
	return qsxmlMakeDisabledSetting  (settingID, getJCFOption (OPT_AUTO_FORMS_MODE))
endIf
if (sItem == "LayoutTables" || sItem == "TableTitlesAnnounce")
	If ! GetJCFOption (optTableIndication) then
		Return qsxmlMakeDisabledSetting  (settingID, TRUE)
	EndIf
endIf
if (sItem == "StudyMode")
	if !IsBSMCapableBrlDisplay() then
		return qsxmlMakeDisabledSetting  (settingID, TRUE)
	EndIf
elIf sItem == "EnableScreenShade" then
	return qsxmlMakeDisabledSetting (settingID, IsScreenShadeAvailable ())
endIf
if settingID
endIf
return qsxmlMakeDisabledSetting  (settingID, FALSE)
endFunction

void function OnDependeeInfoChange (string settingID, string xmlWriteRequest)
;Do nothing as we don't want a write change, just a read:
endFunction

;Callbacks:

;Variable callback:

string function getMagFileNameForVariable (string settingID, string sxmlWriteRequest)
var
	string sAppName
sAppName = GetActiveConfiguration ()+".mcf"
return qsxmlMakeVariable (settingID, sAppName)
endFunction

;Comprised of splitting the related UserOption function callbacks,
;where the get*Info functions is the return side
;and the set*Info functions are the Update side of the old functions.


string function getMagicSayAllOnWebPagesInfo (string settingID, int nReadSource)
;This is only for MAGic, writes to the MCF file which QuickSettings will not do by itself.
var
	int nSetting = getJCFOption (OPT_AUTO_SPEAK_WEB_PAGES)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (nSetting))
endFunction

void function setMagicSayAllOnWebPagesInfo (string settingID, string sXmlWriteRequest)
var
	int nSetting,
	string sAppName = GetActiveConfiguration ()+".mcf"
parseXMLBooleanWriteRequest (sxmlWriteRequest, nSetting)
setJCFOption (OPT_AUTO_SPEAK_WEB_PAGES, nSetting)
iniWriteIntegerEX ("Mag", "AutoSpeakWebPages", nSetting, FLOC_USER_SETTINGS, sAppName)
iniFlushEX (FLOC_USER_SETTINGS, sAppName)
endFunction

void function UpdateBrlLanguageAndMode ()
var
	int modeID = ReadSettingInteger (SECTION_Braille, hKey_Braille_TranslatorMode, ReadSettingInteger (SECTION_Braille, hKey_Braille_TranslatorMode, 0, FT_DEFAULT_JCF), FT_CURRENT_JCF),
	string modeString = GetBrailleModeForModeId (modeID)
BrlLanguageAndMode = new collection
if ! modeString then return endIf
BrlLanguageAndMode.ModeID = stringToInt (stringSegment (ModeString, "|", 1))
BrlLanguageAndMode.ModeName = stringSegment (ModeString, "|", 2)
BrlLanguageAndMode.LangID = stringSegment (ModeString, "|", 3)
BrlLanguageAndMode.LangName = stringSegment (ModeString, "|", 4)
BrlLanguageAndMode.LangComboBoxID = BrlLanguageAndMode.LangID
endFunction

string function getBrailleTranslationLanguageInfo (string settingID, int nReadSource)
var
	int i,
	int bDisabled,
	int nSelectIndex = 0,
	string Languages = GetBrailleTranslatorSupportedLanguages (),
	stringArray szListItems,
	StringArray LangsList,
	string slice,
	int nSize = StringSegmentCount (Languages, "#")
bDisabled = (! nSize)
bDisabled = (bDisabled || ! GetJCFOption (OPT_BRL_G2TRANSLATION))
szListItems = new stringArray[nSize]
LangsList = new stringArray[nSize]
for i=1 to nSize
	slice = stringSegment (languages, "#", i)
	LangsList[i] = stringSegment (slice, "|", 1)
	szListItems[i] = stringSegment (slice, "|", 2)
	if LangsList[i] == BrlLanguageAndMode.LangComboBoxID then
	;decrement by 1 since internal arrays are 0-based:
		nSelectIndex = i-1
	endIf
endFor
BrlLanguageAndMode.LangsList = LangsList
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize, bDisabled)
endFunction

void function setBrailleTranslationLanguageInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	StringArray LangsList,
	string LangId
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
; we're collecting from a 1-based array so must increment:
iSelection = iSelection+1
LangsList = BrlLanguageAndMode.LangsList
LangId = LangsList[iSelection]
BrlLanguageAndMode.LangID = LangId
; write the first mode ID to the file.
var	
	int mode,
	string modeString = GetBrailleModesForLanguage (BrlLanguageAndMode.LangID)
modeString = StringSegment (modeString, "#", 1)
mode = StringToInt (StringSegment (modeString, "|", 1))
BrlLanguageAndMode.ModeID = mode
BrailleSetTranslatorMode (mode)
writeSettingInteger (SECTION_BRAILLE, hKey_Braille_TranslatorMode, mode, FT_CURRENT_JCF, nWriteDestination)
endFunction

string function getBrailleTranslationRulesInfo (string settingID, int nReadSource)
var
	intArray ModesList,
	int i,
	int bDisabled,
	int nSelectedModeIndex = 0,
	int nCurrentTranslatorModeId = BrlLanguageAndMode.ModeID,
	int modeId = 0,
	string ModesByLanguage = GetBrailleModesForLanguage (BrlLanguageAndMode.LangID),
	stringArray szListItems,
	string slice,
	int nSize = StringSegmentCount (ModesByLanguage, "#")
bDisabled = (! nSize)
bDisabled = (bDisabled || ! GetJCFOption (OPT_BRL_G2TRANSLATION))
If ! nSize then; undefined rule:
	nSize = 1
endIf
; fill combo box with empty items if less than the maximum allowable:
szListItems = new stringArray[nSize]
ModesList = new intArray[nSize]
BrlLanguageAndMode.ModesList = null ()
BrlLanguageAndMode.ModesList = ModesList
if ! nCurrentTranslatorModeId || StringIsBlank (ModesByLanguage) then
	szListItems[1] = cmsgUndefined
else
	for i=1 to nSize
		slice = StringSegment (ModesByLanguage, "#", i)
		szListItems[i] = stringSegment (slice, "|", 2)
		modeId = StringToInt (stringSegment (slice, "|", 1))
		ModesList[i] = modeId
		if modeId == nCurrentTranslatorModeId
			nSelectedModeIndex = i-1
		endIf
	endFor
endIf
BrlLanguageAndMode.ModesList = modesList
return QsxmlMakeList (settingID, nSelectedModeIndex, szListItems, nSize, bDisabled)
endFunction

void function setBrailleTranslationRulesInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	intArray ModesList,
	int iSelection,
	int iModeId
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
; we're collecting from a 1-based array so must increment:
iSelection = iSelection+1
modesList = BrlLanguageAndMode.ModesList
iModeId = ModesList[iSelection]
BrailleSetTranslatorMode (iModeId)
writeSettingInteger (SECTION_BRAILLE, hKey_Braille_TranslatorMode, iModeId, FT_CURRENT_JCF, nWriteDestination)
endFunction

string function getProgressBarsInfo (string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 2
szListItems = new stringArray[nSize]
szListItems[1] = msgUO_Spoken
szListItems[2] = msgUO_Silent
if getJCFOption(OPT_PROGRESSBAR_UPDATE_INTERVAL) then
	nSelectIndex = 0;spoken
else
	nSelectIndex = 1; silent
endIf
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setProgressBarsInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int iProgressBarAnnounce = getJCFOption(OPT_PROGRESSBAR_UPDATE_INTERVAL)
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
if iSelection == 1 then; ignore
	let iSavedProgressBarAnnouncementInterval = iProgressBarAnnounce
	let iProgressBarAnnounce = 0
elIf iSelection == 0 then; Announce
	let iProgressBarAnnounce = iSavedProgressBarAnnouncementInterval
EndIf
WriteSettingInteger (Section_Options, hKey_ProgressBarUpdateInterval, iProgressBarAnnounce, FT_CURRENT_JCF, nWriteDestination, getActiveConfiguration ())
endFunction

string function getOCRLanguageInfo (string settingID, string setting)
var
	int i,
	int iDefault = ReadSettingInteger (section_OCR, setting, 1033, FT_DEFAULT_JCF),
	Int iCurrent = ReadSettingInteger (section_OCR, setting, iDefault, FT_CURRENT_JCF),
	int nSelectIndex,
	stringArray szListItems,
	string sItem,
	int nSize
EnsureOcrLanguageStrings()
if stringIsBlank (gstrOCRLangStrings) then
	szListItems = new StringArray[1]
	szListItems[1] = cMsgNotAvailable
	return QsxmlMakeList (settingID, 0, szListItems, 1)
endIf
GetOcrLanguageStrings(iCurrent, szListItems, nSize, nSelectIndex)
return QsxmlMakeList (settingID, nSelectIndex - 1, szListItems, nSize)
endFunction

string function getPrimaryOCRLanguageInfo (string settingID)
return getOCRLanguageInfo(settingID, hKey_PrimaryRecognitionLanguage)
endFunction

void function setPrimaryOCRLanguageInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int i, int iMax,
	int iSelection,
	int iSetting,
	string sItem
EnsureOcrLanguageStrings()
if stringIsBlank (gstrOCRLangStrings) then
	Return
endIf
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
iSelection = iSelection+1 ; the strSegments are 1-based.
sItem = stringSegment (gstrOCRLangStrings, LIST_ITEM_SEPARATOR, iSelection)
sItem = stringSegment (sItem, JAWS_DLG_LIST_SEPARATOR, 2)
iSetting = getOCRLangID (sItem)
return writeSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, iSetting, FT_CURRENT_JCF, nWriteDestination)
endFunction

string function getSecondaryOCRLanguageInfo (string settingID)
return getOCRLanguageInfo(settingID, hKey_SecondaryRecognitionLanguage)
endFunction

void function setSecondaryOCRLanguageInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int i, int iMax,
	int iSelection,
	int iSetting,
	string sItem
EnsureOcrLanguageStrings()
if stringIsBlank (gstrOCRLangStrings) then
	Return
endIf
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
iSelection = iSelection+1 ; the strSegments are 1-based.
sItem = stringSegment (gstrOCRLangStrings, LIST_ITEM_SEPARATOR, iSelection)
sItem = stringSegment (sItem, JAWS_DLG_LIST_SEPARATOR, 2)
iSetting = getOCRLangID (sItem)
return writeSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, iSetting, FT_CURRENT_JCF, nWriteDestination)
endFunction

string function getSayAllSchemeInfo (string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize,
	string sScheme,
	int i
InitUOSayAllSchemesData()
let sScheme = GetCurrentSayAllScheme()
nSize = uoSayAllSchemeCount+1
if ReadSettingString (Section_Options, hKey_SayAllScheme, cscNull, FT_CURRENT_JCF)
|| ReadSettingString (Section_Options, hKey_SayAllScheme, cscNull, FT_DEFAULT_JCF) THEN
	nSelectIndex = GetSchemePositionInUOSayAllSchemesData(sScheme)
endIf
if nSelectIndex then
	nSelectIndex = nSelectIndex -1 ; Indeces are 1 less than array position, as that is 1-based.
else
	nSelectIndex = nSize  ; will be "no change"
endIf
szListItems = new stringArray[nSize]
for i=1 to uoSayAllSchemeCount
	szListItems[i] = UOSayAllSchemesData[i].title
endFor
szListItems[nSize] = uoSayAllSchemeNoChange
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
;return UoSayAllSchemeTextOutput(GetCurrentSayAllScheme())
endFunction

void function setSayAllSchemeInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	string sScheme,
	int iSchemeChoice
InitUOSayAllSchemesData()
;let sScheme = GetCurrentSayAllScheme()
let GDocumentSayAllScheme = cscNull ;allow the application scheme to toggle
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
iSelection = iSelection+1 ; JAWS arrays are 1-based.
if iSelection<= uoSayAllSchemeCount then ;  not 'No Change'
	let sScheme = GetSchemeFileNameInUOSayAllSchemesData (iSelection)
	WriteSettingString (section_options, hKey_SayAllScheme, sScheme, FT_CURRENT_JCF, nWriteDestination, getActiveConfiguration ())
else
	let sScheme = cScNull
	IniRemoveKey(section_options,hKey_SayAllScheme, getActiveConfiguration()+".JCF", true)
EndIf
endFunction

string function getSayAllReadsByInfo (string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 4
szListItems = new stringArray[nSize]
szListItems[1] = cmsg364_S ; Line without pauses
szListItems[2] = cMSG248_S ; line with pauses
szListItems[3] = cMSG249_S ; sentences
szListItems[4] = cMSG250_S ; paragraphs
;in this case, nSelectIndex will equal the real value,
;since a valid JAWS value is 0
nSelectIndex = getJCFOption (OPT_SAY_ALL_MODE)
if ! nSelectIndex then
	;lines = 0, but pauses is a separate option.
	nSelectIndex =  nSelectIndex+getJCFOption (OPT_LINE_PAUSES)
else; skip 1 so as not to accidentally assert lines with pauses:
	nSelectIndex = nSelectIndex+1
endIf
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
;return SayAllReadsByTextOutput(getJCFOption (OPT_SAY_ALL_MODE),getJCFOption (OPT_LINE_PAUSES))
endFunction

void function SetSayAllReadsByInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int iSayAllMode,
	int iLinePause
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
;the numbers look a little wacky because it's not a straight index.
;Items 0 and 1 correspond to lines with or without pauses.
if iSelection < 2 then ; either lines or lines without pauses
	iSayAllMode = 0
	iLinePause = iSelection
else
	iSayAllMode = iSelection - 1
endIf
WriteSettingInteger (Section_Options, "SayAllMode", iSayAllMode, FT_CURRENT_JCF, nWriteDestination, getActiveConfiguration ())
WriteSettingInteger (Section_Options, "LinePauses", iLinePause, FT_CURRENT_JCF, nWriteDestination, getActiveConfiguration ())
endFunction

string function getTranslatorInfo (string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 3
szListItems = new stringArray[nSize]
szListItems[1] = msgBrlOptionOff
szListItems[2] = msgBrlContractedMode_OutputOnly
szListItems[3] = msgBrlContractedMode_InputAndOutput
nSelectIndex = GetBrailleContractedState ()
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
;return UOGradeTwoModeOptionTextOutput (GetBrailleContractedState ())
endFunction

void function setTranslatorInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	string strConfig = getActiveConfiguration (),
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
;WriteSettingInteger would have been fine except we have a dependent,
;so also set the JCF option for benefit of ExpandCurrentWord setting.
if iSelection == ContractedBraille_OutputOnly then
	setJCFOption (OPT_BRL_G2TRANSLATION, 1)
	WriteSettingInteger (Section_Braille, hKey_Grade2Translation, 1, FT_CURRENT_JCF, nWriteDestination, strConfig)
	setJCFOption (OPT_BRL_CONTRACTED_INPUT, 0)
	WriteSettingInteger (Section_Braille, hKey_ContractedBrailleInput, 0, FT_CURRENT_JCF, nWriteDestination, strConfig)
	setJCFOption (OPT_BRL_G2EXPAND_CURRENT_WORD, GetIntOptionUserSetting(Section_Braille, hKey_Grade2ExpandCurrentWord))
	WriteSettingInteger (Section_Braille, hKey_Grade2ExpandCurrentWord,GetIntOptionUserSetting(Section_Braille, hKey_Grade2ExpandCurrentWord), FT_CURRENT_JCF, nWriteDestination, strConfig)
elif iSelection == ContractedBraille_InputAndOutput then
	setJCFOption (OPT_BRL_G2TRANSLATION, 1)
	WriteSettingInteger (Section_Braille, hKey_Braille_Grade2Translation, 1, FT_CURRENT_JCF, nWriteDestination, strConfig)
	setJCFOption (OPT_BRL_CONTRACTED_INPUT, 1)
	WriteSettingInteger (Section_Braille, hKey_ContractedBrailleInput, 1, FT_CURRENT_JCF, nWriteDestination, strConfig)
	setJCFOption (OPT_BRL_G2EXPAND_CURRENT_WORD, 0)
	WriteSettingInteger (Section_Braille, hKey_Grade2ExpandCurrentWord, 0, FT_CURRENT_JCF, nWriteDestination, strConfig)
elif iSelection == ContractedBraille_Off then
	setJCFOption (OPT_BRL_G2TRANSLATION, 0)
	WriteSettingInteger (Section_Braille, hKey_Grade2Translation, 0, FT_CURRENT_JCF, nWriteDestination, strConfig)
	setJCFOption (OPT_BRL_CONTRACTED_INPUT, 0)
	WriteSettingInteger (Section_Braille, hKey_ContractedBrailleInput, 0, FT_CURRENT_JCF, nWriteDestination, strConfig)
EndIf
return TRUE
endFunction

string function getMarkingUsesDots7and8Info (string settingID, int nReadSource)
var
	int nMarking,
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 2
nMarking = getJCFOption (OPTBRL_MARKING)
if nMarking then
	GIPrevBrlMarking = nMarking
endIf
nSelectIndex = (nMarking > 0)
szListItems = new stringArray[nSize]
szListItems[1] = cmsgOff
szListItems[2] = cmsgOn
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setMarkingUsesDots7and8Info (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
if iSelection then
	WriteSettingInteger (Section_Braille, "BrailleShowMarking", GIPrevBrlMarking, FT_CURRENT_JCF, nWriteDestination)
else
	WriteSettingInteger (Section_Braille, "BrailleShowMarking", 0, FT_CURRENT_JCF, nWriteDestination)
endIf
endFunction

string function getMarkingBitInfo (string settingID, int nBit)
var
	int iMark = GetJcfOption (OPTBRL_MARKING)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (iMark&nBit))
;return MarkOptionTextOutput(iMark & nBit)
endFunction

void function setMarkingBitInfo (string settingID, string sxmlWriteRequest, int nBit, int nWriteDestination)
var
	int nState,
	int iMarking = GetJcfOption (OPTBRL_MARKING)
; Use to set all possible bits in Braille marking.
parseXMLBooleanWriteRequest (sxmlWriteRequest, nState)
If (nState) then
	Let iMarking = (iMarking+nBit)
Else
	Let iMarking = (iMarking-nBit)
EndIf
if iMarking then
	GIPrevBrlMarking = iMarking
endIf
return WriteSettingInteger (Section_Braille, "BrailleShowMarking", iMarking, FT_CURRENT_JCF, nWriteDestination, getActiveConfiguration ())
endFunction

string function getHighlightMarkingInfo (string settingID)
return getMarkingBitInfo (settingID, BRL_MARKING_HIGHLIGHT)
endFunction

void function setHighlightMarkingInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
setMarkingBitInfo (settingID, sxmlWriteRequest, BRL_MARKING_HIGHLIGHT, nWriteDestination)
endFunction

string function getBoldMarkingInfo (string settingID)
return getMarkingBitInfo (settingID, BRL_MARKING_BOLD)
endFunction

void function setBoldMarkingInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
setMarkingBitInfo (settingID, sxmlWriteRequest, BRL_MARKING_BOLD, nWriteDestination)
endFunction

string function getUnderlineMarkingInfo (string settingID)
return getMarkingBitInfo (settingID, BRL_MARKING_UNDERLINE)
endFunction

void function setUnderlineMarkingInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
setMarkingBitInfo (settingID, sxmlWriteRequest, BRL_MARKING_UNDERLINE, nWriteDestination)
endFunction

string function getItalicMarkingInfo (string settingID)
return getMarkingBitInfo (settingID, BRL_MARKING_ITALIC)
endFunction

void function setItalicMarkingInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
setMarkingBitInfo (settingID, sxmlWriteRequest, BRL_MARKING_ITALIC, nWriteDestination)
endFunction

string function getStrikeOutMarkingInfo (string settingID)
return getMarkingBitInfo (settingID, BRL_MARKING_STRIKEOUT)
endFunction

void function setStrikeOutMarkingInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
setMarkingBitInfo (settingID, sxmlWriteRequest, BRL_MARKING_STRIKEOUT, nWriteDestination)
endFunction

string function getColorsMarkingInfo (string settingID)
return getMarkingBitInfo (settingID, BRL_MARKING_COLOR)
endFunction

void function setColorsMarkingInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
setMarkingBitInfo (settingID, sxmlWriteRequest, BRL_MARKING_COLOR, nWriteDestination)
endFunction

string function getScriptDefinedMarkingInfo (string settingID)
return getMarkingBitInfo (settingID, BRL_MARKING_EXTENDED)
endFunction

void function setScriptDefinedMarkingInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
setMarkingBitInfo (settingID, sxmlWriteRequest, BRL_MARKING_EXTENDED, nWriteDestination)
endFunction

string function getBrailleStudyModeInfo (string settingID, int nReadSource)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (gbBrailleStudyModeActive), !IsBSMCapableBrlDisplay ())
endFunction

void function setBrailleStudyModeInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
parseXMLBooleanWriteRequest (sxmlWriteRequest, gbBrailleStudyModeActive)
writeSettingInteger (SECTION_NonJCF_Options, "BrailleStudyModeActive", gbBrailleStudyModeActive, ft_current_jcf, nWriteDestination)
endFunction

string function getCurrentWordExpandInfo (string settingID, int nReadSource)
var
	int nState = getJCFOption (OPT_BRL_G2EXPAND_CURRENT_WORD),
	int bDisabled = GetBrailleContractedState () != ContractedBraille_OutputOnly
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (nState), bDisabled)
endFunction

void function setCurrentWordExpandInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int nState
parseXMLBooleanWriteRequest (sxmlWriteRequest, nState)
writeSettingInteger (SECTION_BRAILLE, hKey_Grade2ExpandCurrentWord, nState, ft_current_jcf, nWriteDestination)
endFunction

; this function is used both by the app level and the personalized settings code and thus includes the file type parameter
string function GetPageRefreshInfoHelper (string settingID, int nReadSource, int iFileType)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 3,
	int iSetting,
	string strSettingName,
	int iCustomSetting,
	string sFileName

; prep the file name
if iFileType == FT_JSI then
	let sFileName = GSTRFileName
else
	let sFileName = cScNull ; null is fine as it will trigger getActiveConfiguration
endif
let iSetting = ReadSettingInteger (SECTION_HTML, hKey_PageRefreshFilter, -999, iFileType, nReadSource, sFileName)

; -999 is the sentinel to indicate that no value was returned
; if no value was returned from personal settings try the app level
if iSetting == -999 && iFileType == FT_JSI then
	let iSetting = ReadSettingInteger (SECTION_HTML, hKey_PageRefreshFilter, -999, FT_CURRENT_JCF, nReadSource)
Endif
; if app level returned no setting either way let's get it from getJCF
; another option might be to set to 0 which is automatic refresh - the default when nothing is specified
if iSetting == -999 then
	let iSetting = GetJcfOption (optPageRefreshFilter)
Endif

;Divide by 1000 to make for easy reading user output.
If iSetting > 0 then ; 0 and -1 0 is automatic and -1 is off
	Let iSetting = (iSetting/1000)
elif iSetting == - 2 then  ; sometimes -2 is set by browser scripts to indicate not set -- if not set use global if valid or default value of 60 seconds
	if GiPrevHTMLRefresh > 1000 then ; if we hae something valid > 0 stored from before offer that to the user
		let iSetting = giPrevHTMLRefresh / 1000
	else  ; if nothing else valid offer the default
		let iSetting = PageRefreshDefaultValue/1000 ; 60 seconds
	endif
EndIf
; set custom display value - should be same code as what would be written in setPageRefreshInfo
if iSetting < 1 ; could be -1 or 0 and any value between 0 and 1 second - iSettings is already divided by 1000 here
	if GiPrevHTMLRefresh > 1000 then ; if we have a valid value greater than 1 second
		Let iCustomSetting = GiPrevHTMLRefresh / 1000; seting to offer users
	else ; giPrevHTMLRefresh contains a bad value then set to default
		let iCustomSetting = PageRefreshDefaultValue/1000 ; 60 seconds
	endIf
else ; we had something 1 second or greater
	let iCustomSetting = iSetting
Endif
; iSettings may also be a custom value which will be displayed if > 0
szListItems = new stringArray[nSize]
szListItems[1] = cMsg_off ; setting will be -1 or off.
szListItems[2] = cMsgRefreshAuto ; value 0 = automatic.
szListItems[3] = FormatString (cMsgXSeconds, IntToString (iCustomSetting)); setting from jcf file.
If iSetting == -1 then
	nSelectIndex = 0 ; off
ElIf iSetting == 0 then
	nSelectIndex = 1 ; automatic
Else
	nSelectIndex = 2
EndIf
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

string function GetPageRefreshInfo (string settingID, int nReadSource)
return GetPageRefreshInfoHelper (settingID, nReadSource, FT_CURRENT_JCF)
EndFunction

; called for personalized settings
string function GetCustomPageRefreshInfo (string settingID, int nReadSource)
return GetPageRefreshInfoHelper (settingID, nReadSource, FT_JSI)
endFunction

int function SetPageRefreshInfoHelper (string settingID, string sxmlWriteRequest, int nWriteDestination, int iFileType)
var
	int iSelection,
;	int iSetting = GetJcfOption (optPageRefreshFilter),
;	int iSetting = DiscoverCorrectOption (optPageRefreshFilter)
;	int iSetting = ReadSettingInteger (SECTION_HTML, hKey_PageRefreshFilter, iSetting, FT_CURRENT_JCF, nWriteDestination)
	int iSetting,
	string sFileName

; determine read file name - to save prior value if it was useful
if iFileType == FT_JSI then
	let sFileName = GSTRFileName
else
	let sFileName = cScNull ; null is fine as it will trigger getActiveConfiguration
endif
; purpose of getting this is so we can save it if it's a useful custom value in milliseconds
; iFileType is FT_JSI wdUser will be ignored
let iSetting = ReadSettingInteger (SECTION_HTML, hKey_PageRefreshFilter, -999, iFileType, wdUser, sFileName)
; if we didn't get anything back from reading the file then get the value from the getJCF
if iSetting == -999 then
	let iSetting = GetJcfOption (optPageRefreshFilter)
Endif

parseXMLListWriteRequest (sxmlWriteRequest, iSelection)

; save our value since the user is toggle away from it
if iSetting > 0 then ; back up setting
	GiPrevHTMLRefresh = iSetting ; in milliseconds
endIf
if iSelection == 0 then  ; off a value of -1
	Let iSetting = -1 ; Set to off
ElIf iSelection == 1 then
	Let iSetting = 0 ; Set to automatic
ElIf iSelection == 2 then; custom page refresh rate
	; GiPrevHTMLRefresh should be equal to iSetting at this point
	if GiPrevHTMLRefresh > 1000 then ; if we have a valid value greater than 1 second
		Let iSetting = GiPrevHTMLRefresh
	else ; giPrevHTMLRefresh contains a bad value then set to default
		let iSetting = PageRefreshDefaultValue ; 60 seconds
	endIf
EndIf
setJcfOption (optPageRefreshFilter, iSetting) ; should not be needed
if iFileType == FT_CURRENT_JCF then
	return WriteSettingInteger (SECTION_HTML, hKey_PageRefreshFilter, iSetting, FT_CURRENT_JCF, nWriteDestination)
elif iFileType == FT_JSI then
	return WriteSettingInteger (SECTION_HTML, hKey_PageRefreshFilter, iSetting, FT_JSI, nWriteDestination, gStrFileName)
endif
endFunction

int function SetPageRefreshInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
	return SetPageRefreshInfoHelper (settingID, sxmlWriteRequest, nWriteDestination, FT_CURRENT_JCF)
EndFunction

void function SetCustomPageRefreshInfo (string settingID, string sxmlWriteRequest)
	return SetPageRefreshInfoHelper (settingID, sxmlWriteRequest, wdUser, FT_JSI) ; wdUser will be ignored
endFunction

string function getCustomSayAllSchemeInfo (string settingID, int nReadSource)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize,
	string sScheme,
	int i
InitUOSayAllSchemesData()
let sScheme = GetCurrentSayAllScheme()
nSize = uoSayAllSchemeCount+1
if ReadSettingString (Section_Options, hKey_SayAllScheme, cscNull, FT_JSI, nReadSource, GSTRFileName) then
; || ReadSettingString (Section_Options, hKey_SayAllScheme, cscNull, FT_CURRENT_JCF) THEN
	nSelectIndex = GetSchemePositionInUOSayAllSchemesData(sScheme)
endIf
if nSelectIndex then
	nSelectIndex = nSelectIndex -1 ; Indeces are 1 less than array position, as that is 1-based.
else
	nSelectIndex = nSize  ; will be "no change"
endIf
szListItems = new stringArray[nSize]
for i=1 to uoSayAllSchemeCount
	szListItems[i] = UOSayAllSchemesData[i].title
endFor
szListItems[nSize] = uoSayAllSchemeNoChange
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
;return UoSayAllSchemeTextOutput(GetCurrentSayAllScheme())
endFunction

void function setCustomSayAllSchemeInfo (string settingID, string sxmlWriteRequest)
var
	int iSelection,
	string sScheme,
	int iSchemeChoice
InitUOSayAllSchemesData()
;let sScheme = GetCurrentSayAllScheme()
let GDocumentSayAllScheme = cscNull ;allow the application scheme to toggle
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
iSelection = iSelection+1 ; JAWS arrays are 1-based.
if iSelection<= uoSayAllSchemeCount then ;  not 'No Change'
	let sScheme = GetSchemeFileNameInUOSayAllSchemesData (iSelection)
	let bWereCustomSettingsLoaded = true
	let GDocumentSayAllScheme = sScheme
	IniWriteString(section_options,hKey_SayAllScheme, sScheme, gStrFileName, true)
else
	;scheme will be same as app when it is not one listed in the app's scheme choices:
	let sScheme = uoSayAllSchemeSameAsApp
	let bWereCustomSettingsLoaded = false
	let GDocumentSayAllScheme = cscNull
	IniRemoveKey(section_options,hKey_SayAllScheme, gStrFileName, true)
EndIf
return TRUE
endFunction

string function getVoicePunctuationInfo (string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 4
szListItems = new stringArray[nSize]
nSelectIndex = getJcfOption (OPT_PUNCTUATION)
szListItems[1] = cmsg81_L; None
szListItems[2] = cmsg278_L ; Some
szListItems[3] = cmsg279_L; Most
szListItems[4] = cmsg280_L ; All
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setVoicePunctuationInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int nPunctuationLevel , int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
;setVoicePunctuation (VCTX_GLOBAL, iSelection)
nPunctuationLevel  = iSelection
SetJCFOption (opt_punctuation, nPunctuationLevel )
writeSettingInteger (SECTION_OPTIONS, "Punctuation", iSelection, FT_CURRENT_JCF, nWriteDestination)
endFunction

stringArray  function getNavQuickKeyDelayInfoList ()
var
	stringArray szListItems
szListItems = new stringArray[8]
szListItems[1] = cmsgNavQuickKeyDelayNever
szListItems[2] = cmsgNavQuickKeyDelay0_5Secs
szListItems[3] = cmsgNavQuickKeyDelay1Sec
szListItems[4] = cmsgNavQuickKeyDelay1_5Secs
szListItems[5] = cmsgNavQuickKeyDelay2Secs
szListItems[6] = cmsgNavQuickKeyDelay3Secs
szListItems[7] = cmsgNavQuickKeyDelay4Secs
szListItems[8] = cmsgNavQuickKeyDelay5Secs
return szListItems
endFunction

int function getNavQuickKeyDelayJCFFromIndex (int index)
var
	int iVal
if index	 == 0 then iVal = -1
elIf index == 1 then iVal = 500
elIf index == 2 then iVal = 1000
elIf index == 3 then iVal = 1500
elIf index == 4 then iVal = 2000
elIf index == 5 then iVal = 3000
elIf index == 6 then iVal = 4000
elIf index == 7 then iVal = 5000
endIf
return iVal
endFunction

int function getNavQuickKeyDelayIndexFromSetting (int iSetting)
var
	int index
if iSetting == -1 then index	 = 0
elIf iSetting == 500 then index = 1
elIf iSetting == 1000 then index = 2
elIf iSetting == 1500 then index = 3
elIf iSetting == 2000 then index = 4
elIf iSetting == 3000 then index = 5
elIf iSetting == 4000 then index = 6
elIf iSetting == 5000 then index = 7
endIf
return index
endFunction

string function getSelectandCopyInfo (string settingID, int nReadSource)
var
	int VirtualEnhancedClipboard = getJCFOption (OPT_VPC_ENHANCED_CLIPBOARD), 	;SSB-SM: Get the current state of the setting just in case everything else fails for some reason.
	stringArray listItems,
	int size = 2
listItems = new stringArray[size]
listItems[1] = msgUO_Virtual_Cursor
listItems[2] = msgUO_FullContent_Visual
let VirtualEnhancedClipboard  = readSettingInteger(SECTION_OSM, hKey_VirtualCursorEnhancedClipboard, VirtualEnhancedClipboard, FT_DEFAULT_JCF, nReadSource)	; SSB-SM: Get the global setting from default.jcf or return nState if no setting is found in default.jcf
let VirtualEnhancedClipboard  = readSettingInteger(SECTION_OSM, hKey_VirtualCursorEnhancedClipboard, VirtualEnhancedClipboard, ft_current_jcf, nReadSource)	; SSB-SM: Get the application setting from application.jcf or return nState which now contains the global setting.
; because the only valid value is 0 or 2, but there are only two entries in the list:
if VirtualEnhancedClipboard then VirtualEnhancedClipboard = 1 endIf
return QsxmlMakeList (settingID, VirtualEnhancedClipboard, listItems, size)
endFunction

void function setSelectandCopyInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int VirtualEnhancedClipboard
parseXMLListWriteRequest (sxmlWriteRequest, VirtualEnhancedClipboard)
; because values for file are 0 or 2, but 1 would be returned from the two-item list:
if VirtualEnhancedClipboard then VirtualEnhancedClipboard = 2 endIf
SetJCFOption (OPT_VPC_ENHANCED_CLIPBOARD, VirtualEnhancedClipboard)
giEnhancedClipboard = VirtualEnhancedClipboard
writeSettingInteger (SECTION_OSM, hKey_VirtualCursorEnhancedClipboard, VirtualEnhancedClipboard, ft_current_jcf, nWriteDestination)
EndFunction

string function getAutoFormsModeInfo (string settingID, int nReadSource)
var
	int currentAutoFormsMode = getJCFOption (OPT_AUTO_FORMS_MODE), 	;SSB-SM: Get the current state of the setting just in case everything else fails for some reason.
	stringArray listItems,
	int size = 3
listItems = new stringArray[size]
listItems[1] = cmsgManualFormsMode
listItems[2] = cmsgAutoFormsMode
listItems[3] = cmsgSemiAutoFormsMode
let currentAutoFormsMode = readSettingInteger(SECTION_FormsMode, hKey_AutoFormsMode, currentAutoFormsMode, FT_DEFAULT_JCF, nReadSource)	; SSB-SM: Get the global setting from default.jcf or return nState if no setting is found in default.jcf
let currentAutoFormsMode = readSettingInteger(SECTION_FormsMode, hKey_AutoFormsMode, currentAutoFormsMode , ft_current_jcf, nReadSource)	; SSB-SM: Get the application setting from application.jcf or return nState which now contains the global setting.
return QsxmlMakeList (settingID, currentAutoFormsMode , listItems, size)
endFunction

void function setAutoFormsModeInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int currentAutoFormsMode 
parseXMLListWriteRequest (sxmlWriteRequest, currentAutoFormsMode )
setJCFOption (OPT_AUTO_FORMS_MODE, currentAutoFormsMode )
giAutoFormsMode = currentAutoFormsMode 
writeSettingInteger (SECTION_FormsMode, hKey_AutoFormsMode, currentAutoFormsMode , ft_current_jcf, nWriteDestination)
endFunction

string function getFormsModeOffWhenNewPageLoadsInfo (string settingID, int nReadSource)
var
	int nState = getJCFOption (optFormsModeAutoOff),
	int bDisabled
bDisabled =readSettingInteger(SECTION_FormsMode, hKey_AutoFormsMode, 0, FT_DEFAULT_JCF, nReadSource)	; SSB-SM: Get the global setting from default.jcf or return nState if no setting is found in default.jcf
if bDisabled then
	return qsxmlMakeDisabledSetting  (settingID, nState)
else
	return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (nState))
endIf
endFunction

void function SetFormsModeOffWhenNewPageLoadsInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int nState
parseXMLBooleanWriteRequest (sxmlWriteRequest, nState)
setJCFOption (optFormsModeAutoOff, nState)
gIFormsModeAutoOff = nState
writeSettingInteger (SECTION_FormsMode, hKey_FormsModeAutoOff, nState, FT_CURRENT_JCF, nWriteDestination)
endFunction

string function getQuickNavigationKeyDelayInfo (string settingID, int nReadSource)
var
	int nAutoFormsMode,
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 8
nAutoFormsMode = getJCFOption (OPT_AUTO_FORMS_MODE)
delay(2)
szListItems = getNavQuickKeyDelayInfoList ()
nSelectIndex = getNavQuickKeyDelayIndexFromSetting (getJCFOption (OPT_AUTOFORMSMODE_THRESHOLD))
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize, ! nAutoFormsMode)
endFunction

void function setQuickNavigationKeyDelayInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int iSetting
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
let iSetting = getNavQuickKeyDelayJCFFromIndex (iSelection)
writeSettingInteger (SECTION_FormsMode, hKey_AutoFormsModeThreshold, iSetting, FT_CURRENT_JCF, nWriteDestination)
giAutoFormsModeThreshhold = iSetting
endFunction

string function getNavigationQuickKeysInfo (string settingID, int nReadSource)
var
	int nSelectIndex = GetJcfOption (opt_quick_key_navigation_mode),
	stringArray szListItems,
	int nSize = 3
szListItems = new StringArray[nSize]
szListItems[1] =cmsg_off
szListItems[2] = cMsgSayAllOnly
szListItems[3] = cmsg_on
if nSelectIndex == 2 then
	nSelectIndex = 1
elIf nSelectIndex == 1 then
	nSelectIndex = 2
endIf
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setNavigationQuickKeysInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int iSetting
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
; because SayAllOnly and On are inverse according to their location in the list:
if iSelection == 2 then
	iSetting = 1
elIf iSelection == 1 then
	iSetting = 2
else
	iSetting = iSelection
EndIf
SetJcfOption (opt_quick_key_navigation_mode, iSetting)
writeSettingInteger (SECTION_Options, hKey_QuickKeyNavigationMode, iSetting, FT_CURRENT_JCF, nWriteDestination)
gIQuickKeys= iSetting
endFunction

string function getTextLinksInfo (string settingID, int nReadSource)
var
	int nTextLinks,
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 5
szListItems = new StringArray[nSize]
;bearing in mind that these arrays are 1-based, not 0-based:
szListItems[1] = cmsg328_S ; title
szListItems[2] = cmsg329_S ; screen text
szListItems[3] = cmsg328_L ; Alt Attribute
szListItems[4] = cmsg330_S ; Longest
szListItems[5] = cmsgCustomSearch
nSelectIndex = getJCFOption (optLinkText)
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setTextLinksInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int iSetting
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
let iSetting = iSelection
GILinkText = iSelection
writeSettingInteger (SECTION_HTML, hKey_LinkText, iSetting, FT_CURRENT_JCF, nWriteDestination)
endFunction

string Function GetUntaggedGraphicalLinkShowInfo(string settingID, int nReadSource)
var
	int nTextLinks,
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 2
szListItems = new StringArray[nSize]
;bearing in mind that these arrays are 1-based, not 0-based:
szListItems[1] = msgUO_GraphicalLinksShowImage
szListItems[2] = msgUO_GraphicalLinksShowLinkSRC
nSelectIndex = getJCFOption (optGraphicalLinkLastResort)
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
EndFunction

void Function SetUntaggedGraphicalLinkShowInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int iSetting
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
iSetting = iSelection
writeSettingInteger (SECTION_HTML, hKey_GraphicalLinkLastResort, iSetting, FT_CURRENT_JCF, nWriteDestination)
GIGraphicLinksLastResort = iSetting
EndFunction

string function GetDocumentPresentationInfo (string settingID, int nReadSource)
var
	int bDisabled = GetJCFOption (optSmartNavigation) > 0,
	int nSelectIndex = getJcfOption (optHTMLDocumentPresentationMode),
	;int nSelectIndex = ReadSettingInteger (SECTION_HTML, hKey_DocumentPresentationMode, FT_CURRENT_JCF, nReadSource),
	stringArray szListItems,
	int nSize = 2
szListItems = new stringArray[nSize]
szListItems[1] = cmsgDocumentPresentationModeOff_L; Simple layout
szListItems[2] = cmsgDocumentPresentationModeOn_L ; Screen Layout
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize, bDisabled)
endFunction

void function SetDocumentPresentationInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
setJcfOption (optHTMLDocumentPresentationMode, iSelection)
gIDocumentPresentation = iSelection ; for QuickSettings
writeSettingInteger (SECTION_HTML, hKey_DocumentPresentationMode, iSelection, FT_CURRENT_JCF, nWriteDestination)
endFunction

string function GetLanguageDetectChangeInfo (string SettingID, int nReadSource)
var
	int nState = readSettingInteger(SECTION_OPTIONS, hKey_LanguageDetection, -1, FT_CURRENT_JCF, nReadSource)
if nState == -1 then ; not current jcf, load from default:
	nState = readSettingInteger(SECTION_OPTIONS, hKey_LanguageDetection, 0, FT_DEFAULT_JCF, nReadSource)
endIf
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (nState))
endFunction

void function SetLanguageDetectChangeInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int nState
parseXMLBooleanWriteRequest (sxmlWriteRequest, nState)
setJcfOption (OPT_LANGUAGE_DETECTION, nState)
writeSettingInteger (SECTION_OPTIONS, hKey_LanguageDetection, nState, FT_CURRENT_JCF, nWriteDestination)
GIAutoLanguageDetect = nState ; protect against overwrite by setJCFOptionsWithGlobals, from PersonalizedWebSettings.
endFunction

string function getAllowWebAppReservedKeystrokesInfo (string SettingID, int nReadSource)
var
	int nState = getJCFOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (nState))
endFunction

void function setAllowWebAppReservedKeystrokesInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int nState
parseXMLBooleanWriteRequest (sxmlWriteRequest, nState)
setJcfOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES, nState)
writeSettingInteger (SECTION_OPTIONS, hKey_AllowWebAppReservedKeystrokes, nState, FT_CURRENT_JCF, nWriteDestination)
giWebAppReservedKeys = nState ; protect against overwrite by setJCFOptionsWithGlobals, from PersonalizedWebSettings.
endFunction

int function IsScreenShadeAvailable ()
var int products = getRunningFSProducts ()
; because JAWS can run with either of these products:
if IsSecureDesktop () return FALSE endIf
if products & (product_MAGic) return FALSE endIf
if (products & product_Fusion)
	; Fusion screen shade will work on any Windows version
	return TRUE 
endIf
if products & product_ZoomText
	; not available in Zoomtext, unless Fusion
	return FALSE 
endIf
; not available in Windows 7 or earlier.
if ! IsWindows8 () then return FALSE endIf
; available in JAWS and Fusion only.
if products & product_JAWS return TRUE endIf
return FALSE
endFunction

string function getScreenShadeInfo (string SettingID, int nReadSource)
var int state = IsScreenShadeOn ()
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (State))
endFunction

void function setScreenShadeInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
; function should automatically toggle Screen Shade state, 
; no values are passed from scripts.
ToggleScreenShade ()
endFunction

string function GetHeadingsInfo (string SettingID, int nReadSource)
var
	int nSelectIndex = GetJCFOption (optHeadingIndication),
	stringArray szListItems,
	int nSize = 3
szListItems = new stringArray[nSize]
szListItems[1] = cmsg_off
szListItems[2] = cmsg_on
szListItems[3] = cmsgHeadings2 ; 'headings with level'
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
EndFunction

void function SetHeadingsInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
SetJCFOption (optHeadingIndication, iSelection)
WriteSettingInteger (Section_HTML, hKey_HeadingIndication, iSelection, FT_CURRENT_JCF, nWriteDestination)
giHeadingIndication = iSelection ; for DiscoverCorrectOption and other PersonalizedSettings info stuff.
endFunction

/*
void function QuickNavigationDelayKeyDependee (string settingID, string xmlWriteRequest)
var
	int iSelection,
	string sDependee
;ParseXMLDependenceEvent (xmlWriteRequest, iSelection)
;do nothing but behave as stubs.
return TRUE
endFunction
*/


string function GetBraillePreferredTranslationTableInfo(string settingID, int nReadSource)
var
	string curTable,
	string preferredTableList,
	string temp,
	int index,
	int i, int count,
	int bDisabledSetting
let bDisabledSetting=FALSE
;Note this is only ever read from and written to the default file.
let curTable=ReadSettingString (Section_Braille, hKey_Braille_TranslationTable, "", FT_DEFAULT_JCF, nReadSource)
let preferredTableList=ReadSettingString (Section_Braille, hKey_Braille_Preferred_Tables, curTable, FT_DEFAULT_JCF, nReadSource)
count = StringSegmentCount(preferredTableList, _DLG_SEPARATOR)
if preferredTableList==CsCNull || count <=1 then
	let bDisabledSetting=TRUE
endIf
bDisabledSetting = bDisabledSetting || (GetJCFOption (OPT_BRL_G2TRANSLATION) > 0)
let index=StringSegmentIndex(preferredTableList,  _DLG_SEPARATOR, curTable)
; replace names with friendly names in the tables list:
for i=1 to count
	temp = temp+GetBrailleTableDisplayName (StringSegment (preferredTableList, _DLG_SEPARATOR, i))+_DLG_SEPARATOR
endFor
PreferredTableList = temp
if index==0 then
	let index=1
endIf
return  QsxmlMakeListFromDelimitedString(settingID, index-1, preferredTableList, _DLG_SEPARATOR, bDisabledSetting)
endFunction

function SetBraillePreferredTranslationTableInfo(string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection,
string newTable,
string curTable,
string preferredTableList
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
let curTable=IniReadString (Section_Braille, hKey_Braille_TranslationTable, "", DefaultJcfFile)
let preferredTableList=IniReadString (Section_Braille, hKey_Braille_Preferred_Tables, curTable, DefaultJcfFile)
let newTable=stringSegment(preferredTableList,_DLG_SEPARATOR, iSelection+1); stringseg 1 based, qs 0-based
if (newTable!=cscNull && newTable!=curTable) then
	BrailleSetTranslationTable(newTable)
	WriteSettingString (Section_Braille, hKey_Braille_TranslationTable, newTable, FT_DEFAULT_JCF, nWriteDestination)
endIf
endFunction

string function GetTableDisplayBrailleZoomInfo (string settingID, int nReadSource)
var
	int nSelectIndex = giBrlTBLZoom,
	stringArray szListItems,
	int nSize = 3

if IsVerticalAlignmentRelevant() then
	nSize = 5
endIf
	
szListItems = new stringArray[nSize]
szListItems[1] = cMsgBRLZoomToCell
szListItems[2] = cmsgBRLZoomToRow
szListItems[3] = cMsgBrlZoomToCol
if nSize == 5 then
	szListItems[4] = cMSGBrlZoomToRowPlusColTitles
	szListItems[5] = cMSGBrlZoomToCurAndPriorRow
endIf
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize,getJcfOption(optHTMLDocumentPresentationMode))
endFunction

void function SetTableDisplayBrailleZoomInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
let GIBrlTBLZoom = iSelection
writeSettingInteger (SECTION_NonJCF_Options, hKey_BrlTBLZoom, GIBrlTBLZoom, FT_CURRENT_JCF, nWriteDestination)
endFunction

string function getDocumentAutomaticallyReadsInfo (string settingID)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (gbDefaultSayAllOnDocumentLoad))
endFunction

void function setDocumentAutomaticallyReadsInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var int setting
parseXMLBooleanWriteRequest (sxmlWriteRequest, setting)
gbDefaultSayAllOnDocumentLoad = setting
setJCFOption(OPT_SAYALL_ON_DOCUMENT_LOAD, setting)
writeSettingInteger (SECTION_HTML, "SayAllOnDocumentLoad", setting, FT_CURRENT_JCF, wdUser)
endfunction

string function RestoreToDefaultQuickSettingsOptionReadEvent(string settingID)
return qsxmlMakeBoolean(settingID,qsxmlMakeBooleanState(! HasAppUIACustomizedTypeConfigurationsFromUser()))
EndFunction

string function RestoreToDefaultQuickSettingsOptionWriteEvent(string settingID, string sxmlWriteRequest, int nWriteDestination)
RemoveAppCustomizedUIAConditionSettings()
parseXMLBooleanWriteRequest (sxmlWriteRequest, HasAppUIACustomizedTypeConfigurationsFromUser ())
EndFunction

;Object / Touch Navigation read and write callbacks,
;One read and one write manages all object types.
; The ID must be formatted with the type last in the string, see default.qs TouchCursorOptions.ConfigureTypes except for RestoreToDefault
string function QuickSetttingsTouchNavigationReadEvent (string settingID, int nReadSource)
var
	int Setting,
	string Key,
	string sTemp = stringSegment (settingID, ".", -1)
if sTemp != "Region" && sTemp != "Heading" then
	Key = formatString ("UIA_%1ControlTypeId", sTemp)
else ; heading and region are not UIA structure types and so are not formatted like that, just raw:
	Key = sTemp
endIf
Setting  = ReadSettingInteger (section_TouchNavigationTypes, Key, -1, FT_CURRENT_JCF, nReadSource)
;If not local, then read from Default:
if Setting == -1 then
	Setting  = ReadSettingInteger (section_TouchNavigationTypes, Key, -1, FT_DEFAULT_JCF, nReadSource)
endIf
if stringContains (Key, "Calendar") then AppendToScriptCallStackLogEX (formatString ("Calendar %1", Setting)) endIf
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (Setting))
endFunction

void function QuickSetttingsTouchNavigationWriteEvent (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int Setting,
	string Key,
	string sTemp = stringSegment (settingID, ".", -1)
if sTemp != "Region" && sTemp != "Heading" then
	Key = formatString ("UIA_%1ControlTypeId", sTemp)
else ; heading and region are not UIA structure types and so are not formatted like that, just raw:
	Key = sTemp
endIf
parseXMLBooleanWriteRequest (sxmlWriteRequest, Setting)
WriteSettingInteger (section_TouchNavigationTypes, Key, Setting, FT_CURRENT_JCF, nWriteDestination)
endFunction

; The original function tries the specific section first for reading and falls back to the general section.
prototype string function GetBrailleDisplaySectionName()
string function GetBrlDisplaySectionName ()
var
string brailleDisplaySpecificSection = GetBrailleDisplaySectionName(),
	string FilePath = GetSharedSettingsDirectory ()+"\\"+DefaultJCFFile
if iniReadSectionKeys (brailleDisplaySpecificSection, FilePath) then
	return brailleDisplaySpecificSection
else
	return Section_Braille
endIf
endFunction

;Since this is in the context of writing, we should always return the display specific section.
string function getBrailleDisplayNameForVariable (string settingID, string sxmlWriteRequest)
return qsxmlMakeVariable (settingID, GetBrailleDisplaySectionName())
endFunction

prototype int function getRegistryEntryDWORD (int key, string key, string subKey, optional int valueNotSet)

int function OutlookReadOnlyMsgsUseUIA()
var
int val,
int ConsultFeatureGate =0xff
val=getRegistryEntryDWORD (HKEY_CURRENT_USER, OutlookUIAReadOnlyMessageRegKey, OutlookUIAReadOnlyMessageRegValue, ConsultFeatureGate)
if val==ConsultFeatureGate  then
	val=getRegistryEntryDWORD (HKEY_CURRENT_USER, OutlookUIAReadOnlyMessageRegKey, OutlookUIAReadOnlyMessageOverrideRegValue, 0)
endIf
return val== 1
endFunction

string function GetOutlookReadOnlyMsgsUseUIA(string settingID)
return qsXmlMakeBoolean (SettingID, qsxmlMakeBooleanState (OutlookReadOnlyMsgsUseUIA()))
endFunction

void function SetOutlookReadOnlyMsgsUseUIA(string settingID, string xmlWriteRequest)
var int state
parseXMLBooleanWriteRequest (xmlWriteRequest, state)

SetRegistryEntryDWORD (HKEY_CURRENT_USER, OutlookUIAReadOnlyMessageRegKey, OutlookUIAReadOnlyMessageRegValue, state )
endFunction


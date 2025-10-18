;Copyright 1995-2015 Freedom Scientific, Inc.
;Support for domain-specific verbosity settings

include "HjConst.jsh"
include "hjglobal.jsh"
Include "Common.jsm"
Include "IECustomSettings.jsh"
include "IE.jsm";Default Internet Explorer and HTML Message File
include "uo.jsh"
use "UserOptionsTextOutput.jsb"
use "uoSayAllSchemes.jsb"

import "quickset.jsd"

GLOBALS
	int gbVerbosityOptionSet,
	int GiCustomPrevHTMLRefresh,
	int GiCustomPrevActiveContentRefresh

int function GetJCFOption(int iOption)
if iOption == PseudoOpt_TableTitlesAnnounce then
	return GiTblHeaders
EndIf
return GetJCFOption(iOption)
EndFunction

int function SetJCFOption(int iOption, int iValue)
if iOption == PseudoOpt_TableTitlesAnnounce then
	if bWereCustomSettingsLoaded then
		let giTblHeaders = iValue
	else
		let giTblHeaders = GetNonJCFOption ("TblHeaders")
	endIf
	return true
endIf

if iOption == OPT_SAYALL_ON_DOCUMENT_LOAD then
	if bWereCustomSettingsLoaded then
		let gbDefaultSayAllOnDocumentLoad = iValue
	else
		let gbDefaultSayAllOnDocumentLoad = GetJCFOption(OPT_SAYALL_ON_DOCUMENT_LOAD)
	endIf
	return true
endIf
if GetJCFOption (iOption) == iValue return endIf
return SetJCFOption(iOption,iValue)
EndFunction

void function CustomSettingsStart ()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
InitializeGlobalsWithSettingsFromJCF ()
SetUpStuffForNewPage(true)
EndFunction

void Function CustomSettingsFinish ()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
If bWereCustomSettingsLoaded then
	SetJCFOptionsWithGlobals() ;For Personalized settings
EndIf
Let gStrAddress = cScNull
EndFunction

string function GetRelevantFilePathInfoFromAddress(string sURL)
if !StringStartsWith(sURL,scFileURI)
	return cscNull
endIf
var string path = StringChopLeft(sURL,StringLength(scFileURI))
;a slash may immediately follow the file uri, chop it:
if StringStartsWith(path,scDomainEnd)
	path = StringChopLeft(path,StringLength(scDomainEnd))
endIf
path = StringReplaceSubStrings(path,cscSpace,"%20")
path = StringReplaceChars(path,":|%/\\",".")
return path
EndFunction

string function GetRelevantAddressBarInfo()
var
	string domain,
	string address,
	string filePathInfo
domain = GetDomainName()
address = GetDocumentPath()
If domain == scAboutProtocol
|| StringStartsWith(address, scAboutProtocol)
	return domain
EndIf
filePathInfo = GetRelevantFilePathInfoFromAddress(address)
if filePathInfo
	return filePathInfo
endIf
var string segment1 = StringSegment(domain,cscPeriod,1)
If StringStartsWith(segment1,scURL2)
	;domain starts with www
	domain = StringChopLeft(domain,StringLength(segment1)+1)
endIf
return domain
EndFunction

void Function MakeFileNameFromAddress ()
; Passing TRUE to FindJAWSPersonalizedSettingsFile to force path creation to
; the user directory and not the shared directory.
Let GSTRFileName = FindJAWSPersonalizedSettingsFile (GStrAddress + ".jsi",TRUE)
Let GSTRFileName = FindJAWSPersonalizedSettingsFile (GetRelevantAddressBarInfo () + ".jsi",TRUE)
EndFunction

string function getAddressJSIName ()
return GStrAddress + ".jsi"
endFunction

string function getAddressJSINameForVariable (string settingID, string sxmlWriteRequest)
return qsxmlMakeVariable (settingID, getAddressJSIName ())
endFunction

void Function SetUpStuffForNewPage(optional int iForcePageChange)
;Loads the custom or jcf settings,
;and sets up globals as necessary
;Page by page basis.
var
	int bPrevAddress,
	;Change a setting and come back.
	string strNewAddress
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
Let bPrevAddress = StringLength (gStrAddress)
Let strNewAddress = GetRelevantAddressBarInfo ()
If gbVerbosityOptionSet then
	;prev Focus was in the Options dialog
	Let gbVerbosityOptionSet = FALSE
	; regardless, always get these web applications if available, and dispense with the old ones:
	UpdateReservedWebAppKeysCollection ()
	Return
EndIf
if InHjDialog () then
	;If we are in an HjDialog, the web page may be periodically updating due to
	;dynamic content.  If so strNewAddress will be null.  In this case we use
	;the GStrAddress
	strNewAddress = GStrAddress
EndIf
If GStrAddress == strNewAddress
&& !iForcePageChange then
	;We're not loading any new stuff.
	let gINewPersonalSettings = FALSE
	; regardless, always get these web applications if available, and dispense with the old ones:
	UpdateReservedWebAppKeysCollection ()
	Return
EndIf
MakeFileNameFromAddress()
;Let bWereCustomSettingsLoaded =
	;(FileExists(gStrFileName) && IniReadSectionNames(gStrFileName))
bWereCustomSettingsLoaded = ! StringIsBlank (IniReadSectionNames (gstrFileName))
Let gINewPersonalSettings = bWereCustomSettingsLoaded
If GStrAddress != strNewAddress then
	;always start with non-custom settings,
	;so that a new page doesn't accidentally inherit old custom settings.
	SetJCFOptionsWithGlobals()
EndIf
If bWereCustomSettingsLoaded then
	LoadSettingsFromRelevantFile()
EndIf
Let GStrAddress = strNewAddress
; regardless, always get these web applications if available, and dispense with the old ones:
UpdateReservedWebAppKeysCollection ()
EndFunction

;Load document settings again on QuickSettings dialog exit.
void function QuickSettingsLoadDocumentSettings ()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
InitializeGlobalsWithSettingsFromJCF()
SetJCFOptionsWithGlobals()
;ensure that we know about a new personalized setting file that may have been created during QuickSettings usage.
Let GSTRFileName = FindJAWSPersonalizedSettingsFile (GStrAddress + ".jsi",TRUE)
LoadSettingsFromRelevantFile()
QuickSettingsLoadDocumentSettings ()
InitializeGlobalsWithSettingsFromJCF()
endFunction

void Function SpeakPersonalizeSettingsChange ()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
gStrAddress = GetRelevantAddressBarInfo ()
MakeFileNameFromAddress ()
bWereCustomSettingsLoaded = ! StringIsBlank (IniReadSectionNames (gstrFileName))
If bWereCustomSettingsLoaded then
	; Tell user about custom settings for the page only if the address has changed since we last spoke the message,
	;or if the application has been closed down and restarted.
	let ghWndHTMLApp = GetTopLevelWindow(GetFocus())
	if GStrPriorAddress !=GStrAddress
	|| ghWndHTMLApp != ghWndPrevHTMLApp then
		SayUsingVoice (VCTX_MESSAGE, msgPagePersonalized, OT_STATUS)
		; note giLastFormsModeState is set in default.jss documentLoadedEvent
		let giLastFormsModeState=-1
		let GStrPriorAddress=GStrAddress
		let ghWndPrevHTMLApp = ghWndHTMLApp
	endIf
EndIf
EndFunction

void Function SpeakPersonalizeSettings()
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
; announce message without regard for status actually changing
;called from sayWindowTitle etc.
If bWereCustomSettingsLoaded then
	SayUsingVoice (VCTX_MESSAGE, msgPagePersonalized, OT_STATUS)
EndIf
EndFunction

;***The following functions must be modified to include your option and key.
;Add your modifications to the below functions, until you find that we say you no longer need to add.
;The purpose is to make sure the Personalize Web Settings knows not only about your option, but
;Can also replace your option with the Default value.
;To make an additional entry, just name the function as it is in the Default, but change "HTML" to "Custom"
;Now see how this is done below, add both a global variable and a key for the JSI file
;In the accompanying header:  IECustomSettings.jsh
;To support the User Options Dialog-style presentation,
;Add your function and string using the UO_ constant prefix for strings.
;Use CustomUO as a part of the name, but duplicate the functionality, so we use same global and same key.
;Then you can use existing or new hlp callbacks for the new help text window which appears for each option
;or node in the dialog's tree view.

int Function ConvertCustomToJCF (string sCustomOption)
;If the custom option is your key,
;Return the option in question.
;This is the option, not the setting.
If StringCompare(sCustomOption, hKey_VirtualDocumentLinkActivationMethod) == 0 then
	Return OPT_VIRTUAL_DOCUMENT_LINK_ACTIVATION_METHOD
elIf StringCompare(sCustomOption,HKEY_VPC_ENHANCED_CLIPBOARD) == 0 then
	Return OPT_VPC_ENHANCED_CLIPBOARD
ElIf StringCompare(sCustomOption,HKEY_quick_key_navigation_mode) == 0 then
	Return opt_quick_key_navigation_mode
ElIf StringCompare(sCustomOption,HKEY_Document_Presentation_Mode) == 0 then
	return optHTMLDocumentPresentationMode
ElIf StringCompare(sCustomOption,HKEY_BlockQuote) == 0 then
	Return optBlockQuoteIndication
ElIf StringCompare(sCustomOption ,HKEY_List) == 0 then
	Return optListIndication
ElIf StringCompare(sCustomOption ,HKEY_Tables) == 0 then
	Return optTableIndication
ElIf StringCompare(sCustomOption,HKEY_TableDetect) == 0 then
	Return optTableDetection
ElIf StringCompare(sCustomOption,hKey_IncludeGraphics) == 0 then
	Return optIncludeGraphics
elif StringCompare(sCustomOption,HKEY_FilterConsecutiveDuplicateLinks) == 0 then
	return optFilterConsecutiveDuplicateLinks
ElIf StringCompare(sCustomOption,HKEY_GraphicLinks) == 0 then
	Return optIncludeGraphicLinks
ElIf StringCompare(sCustomOption,HKEY_GraphicLastResort) == 0 then
	Return optGraphicalLinkLastResort
ElIf StringCompare(sCustomOption,HKEY_ImageMaps) == 0 then
	Return optIncludeImageMapLinks
ElIf StringCompare(sCustomOption,HKEY_Frames) == 0 then
	Return optFrameIndication
ElIf StringCompare(sCustomOption,HKEY_IgnoreFramesWithAds) == 0 then
	Return optIgnoreInlineFrames
ElIf StringCompare(sCustomOption,HKEY_SkipRepeatedText) == 0 then
	Return optSkipPastRpeatedText
ElIf StringCompare(sCustomOption,HKEY_TextLink) == 0 then
	return optLinkText
ElIf StringCompare(sCustomOption,HKEY_TextBlockLength) == 0 then
	Return optTextBlockLength
ElIf StringCompare(sCustomOption,HKEY_HEADING) == 0 then
	Return optHeadingIndication
ElIf StringCompare(sCustomOption,HKEY_ShowGraphics) == 0 then
	Return optGraphicRendering
ElIf StringCompare(sCustomOption,hKey_ButtonTextOptions) == 0 then
	Return optButtonText
ElIf StringCompare(sCustomOption,HKEY_ExpandAbbreviations) == 0 then
	Return optExpandAbbreviations
ElIf StringCompare(sCustomOption,HKEY_ExpandAcronyms) == 0 then
	Return optExpandAcronyms
ElIf StringCompare(sCustomOption,HKEY_ExpandAcronyms) == 0 then
	Return optExpandAcronyms
ElIf StringCompare(sCustomOption,hKey_FormFieldPromptOptions) == 0 then
	Return OPTFormFieldPrompts
ElIf StringCompare(sCustomOption,HKEY_FormVirtual) == 0 then
	Return OPT_USE_VIRTUAL_INFO_IN_FORMS_MODE
ElIf StringCompare(sCustomOption,HKEY_LANGUAGE_DETECT) == 0 then
	Return OPT_LANGUAGE_DETECTION
ElIf StringCompare(sCustomOption,HKEY_FLASH) == 0 then
	Return OPT_VIRTUAL_MSAA_REFRESH_RATE
ElIf StringCompare(sCustomOption,HKEY_PageRefreshFilter) == 0 then
	Return optPageRefreshFilter
ElIf StringCompare(sCustomOption,HKEY_ANNOUNCE_LIVE_REGION_UPDATES) == 0 then
	return optAnnounceLiveRegionUpdates
ElIf StringCompare(sCustomOption,HKEY_ScreenFollowsVCursor) == 0 then
	Return OPTScreenFollowsVCursor
ElIf StringCompare(sCustomOption,HKEY_optIndicateElementAttributes) == 0 then
	Return optIndicateElementAttributes
ElIf StringCompare(sCustomOption,HKEY_LineLength) == 0 then
	Return optMaxLineLength
ElIf StringCompare(sCustomOption,HKEY_FlashShow) == 0 then
	Return optEmbeddedActiveXSupport
ElIf StringCompare(sCustomOption,HKEY_LinkType) == 0 then
	Return optIdentifyLinkType
ElIf StringCompare(sCustomOption,HKEY_SamePageIdentify) == 0 then
	Return optIdentifySamePageLinks
elif StringCompare(sCustomOption,hKey_AutoFormsModeThreshold) == 0 then
	return OPT_AUTOFORMSMODE_THRESHOLD
elif StringCompare(sCustomOption,HKEY_optFormsModeAutoOff) == 0 then
	return optFormsModeAutoOff
elif StringCompare(sCustomOption,HKEY_OPT_CUSTOM_PAGE_SUMMARY) == 0 then
	return OPT_CUSTOM_PAGE_SUMMARY
ElIf StringCompare(sCustomOption,HKEY_OPT_VIRTUAL_CURSOR) == 0 then
	return OPT_VIRTUAL_PC_CURSOR
ElIf StringCompare(sCustomOption,HKEY_OPT_STYLE_SHEET_PROCESSING) == 0 then
	return optStyleSheetProcessing
ElIf StringCompare(sCustomOption,HKEY_OPT_SUPPRESS_READ_ONLY_STATE_INDICATION) == 0 then
	Return OPT_SUPPRESS_READ_ONLY_STATE_INDICATION
ElIf StringCompare(sCustomOption,hKey_AutoFormsMode) == 0 then
	return OPT_AUTO_FORMS_MODE
ElIf StringCompare(sCustomOption,HKEY_PseudoOpt_Table_Titles_Announcement) == 0 then
	Return PseudoOpt_TableTitlesAnnounce
ElIf StringCompare(sCustomOption,hKey_PseudoOpt_SayAllOnDocumentLoad) == 0 then ;no longer pseudo as of JAWS 19
	return OPT_SAYALL_ON_DOCUMENT_LOAD
ElIf StringCompare (sCustomOption, hKey_AllowWebAppReservedKeystrokes) == 0
	return OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES
elif StringCompare (sCustomOption,hKey_VirtualVerbosityLevel) == 0
	return optVirtualCursorVerbosityLevel
elif StringCompare (sCustomOption,hKey_JAWSDeterminesLayoutTable) == 0
	return optJAWSDeterminesLayoutTable
elif StringCompare (sCustomOption,HKEY_IndicateInsAndDelInVirtualDocs) == 0
	return opt_IndicateInsAndDelInVirtualDocs
EndIf
EndFunction

string Function ConvertJCFToCustom (int iJCFOption)
;reverse of the previous function,
;Purpose here is to return the key name to be used, basically, if  it's the JCF option (not setting)
;That is used by your function / Verbosity setting,
;return the key name.
if iJCFOption==OPT_VIRTUAL_DOCUMENT_LINK_ACTIVATION_METHOD
	return hKey_VirtualDocumentLinkActivationMethod
elIf iJCFOption == OPT_VPC_ENHANCED_CLIPBOARD then
	Return HKEY_VPC_ENHANCED_CLIPBOARD
ElIf iJCFOption == opt_quick_key_navigation_mode then
	Return HKEY_quick_key_navigation_mode
ElIf iJCFOption == optHTMLDocumentPresentationMode then
	Return HKEY_Document_Presentation_Mode
ElIf iJCFOption == optBlockQuoteIndication then
	Return HKEY_BlockQuote
ElIf iJCFOption == optListIndication then
	Return HKEY_List
ElIf iJCFOption ==  optTableIndication then
	Return HKEY_Tables
ElIf iJCFOption == optTableDetection then
	Return HKEY_TableDetect
ElIf iJCFOption ==  optIncludeGraphics then
	Return hKey_IncludeGraphics
ElIf iJCFOption == optFilterConsecutiveDuplicateLinks then
	Return HKEY_FilterConsecutiveDuplicateLinks
ElIf iJCFOption == optIncludeGraphicLinks then
	Return HKEY_GraphicLinks
ElIf iJCFOption == optGraphicalLinkLastResort then
	Return HKEY_GraphicLastResort
ElIf iJCFOption == optIncludeImageMapLinks then
	Return HKEY_ImageMaps
ElIf iJCFOption == optFrameIndication then
	Return HKEY_Frames
ElIf iJCFOption == optIgnoreInlineFrames then
	Return HKEY_IgnoreFramesWithAds
ElIf iJCFOption == optSkipPastRpeatedText then
	Return HKEY_SkipRepeatedText
ElIf iJCFOption == optLinkText then
	return HKEY_TextLink
ElIf iJCFOption == optTextBlockLength then
	Return HKEY_TextBlockLength
ElIf iJCFOption == optHeadingIndication then
	Return HKEY_HEADING
ElIf iJCFOption == optGraphicRendering then
	Return HKEY_ShowGraphics
ElIf iJCFOption == optButtonText then
	Return hKey_ButtonTextOptions
ElIf iJCFOption == optExpandAbbreviations then
	Return HKEY_ExpandAbbreviations
ElIf iJCFOption == optExpandAcronyms then
	Return HKEY_ExpandAcronyms
ElIf iJCFOption == OPTFormFieldPrompts then
	Return hKey_FormFieldPromptOptions
ElIf iJCFOption == OPT_USE_VIRTUAL_INFO_IN_FORMS_MODE then
	Return HKEY_FormVirtual
ElIf iJcfOption == OPT_LANGUAGE_DETECTION then
	Return HKEY_LANGUAGE_DETECT
ElIf iJCFOption == OPT_VIRTUAL_MSAA_REFRESH_RATE then
	Return HKEY_FLASH
ElIf iJCFOption == optPageRefreshFilter then
	Return hKey_PageRefreshFilter
ElIf iJCFOption == optAnnounceLiveRegionUpdates then
	return HKEY_ANNOUNCE_LIVE_REGION_UPDATES;
ElIf iJCFOption ==  OPTScreenFollowsVCursor then
	Return HKEY_ScreenFollowsVCursor
ElIf iJCFOption == optIndicateElementAttributes then
	Return HKEY_optIndicateElementAttributes
ElIf iJCFOption == optMaxLineLength then
	Return HKEY_LineLength
ElIf iJCFOption == optEmbeddedActiveXSupport then
	Return HKEY_FlashShow
ElIf iJcfOption == optIdentifyLinkType then
	Return HKEY_LinkType
ElIf iJCFOption == optIdentifySamePageLinks then
	Return HKEY_SamePageIdentify
elif iJCFOption == OPT_AUTOFORMSMODE_THRESHOLD then
	return hKey_AutoFormsModeThreshold
elif iJCFOption == optFormsModeAutoOff then
	return HKEY_optFormsModeAutoOff
elif iJCFOption ==OPT_CUSTOM_PAGE_SUMMARY then
	return HKEY_OPT_CUSTOM_PAGE_SUMMARY
ElIf iJCFOption == OPT_VIRTUAL_PC_CURSOR  Then
	return HKEY_OPT_VIRTUAL_CURSOR
ElIf iJCFOption ==optStyleSheetProcessing then
	return HKEY_OPT_STYLE_SHEET_PROCESSING
ElIf iJCFOption == OPT_SUPPRESS_READ_ONLY_STATE_INDICATION then
	Return HKEY_OPT_SUPPRESS_READ_ONLY_STATE_INDICATION
ElIf iJCFOption == OPT_AUTO_FORMS_MODE then
	return hKey_AutoFormsMode
ElIf iJCFOption == PseudoOpt_TableTitlesAnnounce then
	Return HKEY_PseudoOpt_Table_Titles_Announcement
ElIf iJCFOption == OPT_SAYALL_ON_DOCUMENT_LOAD then
	return hKey_PseudoOpt_SayAllOnDocumentLoad ;No longer pseudo as of JAWS 19
ElIf iJCFOption == OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES then
	return hKey_AllowWebAppReservedKeystrokes
elif iJCFOption == optVirtualCursorVerbosityLevel then
	return hKey_VirtualVerbosityLevel
elif iJCFOption == optJAWSDeterminesLayoutTable then
	return 	hKey_JAWSDeterminesLayoutTable
elif iJCFOption == opt_IndicateInsAndDelInVirtualDocs
	return HKEY_IndicateInsAndDelInVirtualDocs
EndIf
EndFunction

void function InitializeGlobalsWithSettingsFromJCF()
;Now, update your global by setting the JCF option.
; Just copy and substitute from your function below or copy one of mine ...
;Don't forget to add your global to IECustomSettings.jsh, if you've not done so already.
var
	string sConfigFile
let giVirtualDocumentLinkActivationMethod = GetJcfOption(OPT_VIRTUAL_DOCUMENT_LINK_ACTIVATION_METHOD)
Let giEnhancedClipboard = GetJcfOption (OPT_VPC_ENHANCED_CLIPBOARD)
Let giReadOnlyState = GetJcfOption (OPT_SUPPRESS_READ_ONLY_STATE_INDICATION)
let giIndicateINSAndDEL=GetJcfOption (opt_IndicateInsAndDelInVirtualDocs)   
Let gIQuickKeys = GetJcfOption (opt_quick_key_navigation_mode)
let gIDocumentPresentation = GetJcfOption (optHTMLDocumentPresentationMode)
Let GIBlockQuoteIndication = GetJCFOption (optBlockQuoteIndication)
Let GIListIndication = GetJcfOption (optListIndication)
Let GITableIndication = GetJcfOption (optTableIndication)
Let GITableDetection = GetJcfOption (optTableDetection)
Let GIIncludeGraphics = GetJcfOption (optIncludeGraphics)
Let GIIncludeGraphicLinks = GetJcfOption (optIncludeGraphicLinks)
let GIFilterConsecutiveDuplicateLinks = GetJcfOption (optFilterConsecutiveDuplicateLinks)
let GIGraphicLinksLastResort = GetJCFOption (optGraphicalLinkLastResort)
Let GIIncludeImageMapLinks = GetJcfOption (optIncludeImageMapLinks)
Let GIFrameIndication = GetJcfOption (optFrameIndication)
Let GIIgnoreInlineFrames = GetJcfOption (optIgnoreInlineFrames)
Let GISkipPastRpeatedText = GetJcfOption (optSkipPastRpeatedText)
Let GILinkText = GetJcfOption (optLinkText)
Let GIHeadingIndication = GetJcfOption (optHeadingIndication)
Let GIGraphicRendering = GetJcfOption (optGraphicRendering)
Let GIButtonText = GetJcfOption (optButtonText)
let giExpandAbbreviations = GetJCFOption(optExpandAbbreviations)
let giExpandAcronyms = GetJCFOption(optExpandAcronyms)
Let GIFormFieldPrompts = GetJCFOption (OPTFormFieldPrompts)
Let gIFormVirtual = GetJcfOption (OPT_USE_VIRTUAL_INFO_IN_FORMS_MODE)
Let GIAutoLanguageDetect = GetJcfOption (OPT_LANGUAGE_DETECTION)
Let GIFlash = GetJcfOption (OPT_VIRTUAL_MSAA_REFRESH_RATE)
Let GIHtml = GetJcfOption (optPageRefreshFilter)
let gIAnnounceLiveRegionUpdates = GetJcfOption (optAnnounceLiveRegionUpdates)
Let GiOptIndicateElementAttributes = GetJcfOption (OptIndicateElementAttributes)
Let gIVTrack = GetJcfOption (OPTScreenFollowsVCursor)
Let GIMaxLineLength = GetJcfOption (optMaxLineLength)
Let gITextBlockLength = GetJcfOption (optTextBlockLength)
Let gIShowFlash = GetJcfOption (optEmbeddedActiveXSupport)
Let gILinkType = GetJcfOption (optIdentifyLinkType)
Let gISamePageLink = GetJcfOption (optIdentifySamePageLinks)
Let gIFormsModeAutoOff= GetJcfOption (optFormsModeAutoOff)
Let gICustomPageSummary=GetJCFOption(OPT_CUSTOM_PAGE_SUMMARY)
let gIVirtualCursor = GetJCFOption (OPT_VIRTUAL_PC_CURSOR )
let gIStyleSheetProcessing=GetJCFOption (optStyleSheetProcessing)
let giAutoFormsMode = GetJCFOption(OPT_AUTO_FORMS_MODE)
let giAutoFormsModeThreshhold = GetJCFOption(OPT_AutoFormsMode_THRESHOLD)
GITblHeaders = GetNonJCFOption ("TblHeaders")
GITblHeaderContentOrder = GetNonJCFOption ("TblHeaderContentOrder")
let gbDefaultSayAllOnDocumentLoad = GetJCFOption(OPT_SAYALL_ON_DOCUMENT_LOAD)
let giWebAppReservedKeys = getJCFOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES)
let GIVirtualCursorVerbosityLevel = GetJCFOption(optVirtualCursorVerbosityLevel)
;following are any string settings, which are not JCF option integers:
let sConfigFile = GetActiveConfiguration()+cScPeriod+jcfFileExt
let GDocumentSayAllScheme = readSettingString (section_options,hKey_SayAllScheme,
		IniReadString(section_options,hKey_SayAllScheme,cscNull,file_default_jcf),
		FT_CURRENT_JCF, rsNoTransient, sConfigFile)
EndFunction

void Function SetJCFOptionsWithGlobals()
;Once again, backwards from the previous function.
;The last one set up you as part of the template, this one puts the setting back.
;If you don't you'll get bugs on account of settings not being restored when pages get changed to a new domain.
;Doing this means that all your settings are in place.
SetJcfOption (OPT_VIRTUAL_DOCUMENT_LINK_ACTIVATION_METHOD, giVirtualDocumentLinkActivationMethod)
SetJcfOption (OPT_SUPPRESS_READ_ONLY_STATE_INDICATION,giReadOnlyState)
SetJcfOption (opt_IndicateInsAndDelInVirtualDocs, giIndicateINSAndDEL)
SetJcfOption (OPT_VPC_ENHANCED_CLIPBOARD, giEnhancedClipboard)
SetJcfOption (opt_quick_key_navigation_mode, gIQuickKeys)
SetJcfOption (optHTMLDocumentPresentationMode,GIDocumentPresentation)
SetJCFOption (optBlockQuoteIndication, GIBlockQuoteIndication)
SetJcfOption (optListIndication, GIListIndication)
SetJcfOption (optTableIndication, GITableIndication)
SetJcfOption (optTableDetection, GITableDetection)
SetJcfOption (optIncludeGraphics, GIIncludeGraphics)
SetJcfOption (optIncludeGraphicLinks, GIIncludeGraphicLinks)
SetJcfOption (optFilterConsecutiveDuplicateLinks, GIFilterConsecutiveDuplicateLinks)
SetJCFOption (optGraphicalLinkLastResort, GIGraphicLinksLastResort)
SetJcfOption (optIncludeImageMapLinks, GIIncludeImageMapLinks)
SetJcfOption (optFrameIndication, GIFrameIndication)
SetJcfOption (optIgnoreInlineFrames, GIIgnoreInlineFrames)
SetJcfOption (optSkipPastRpeatedText, GISkipPastRpeatedText)
SetJcfOption (optLinkText, GILinkText)
SetJcfOption (optHeadingIndication, GIHeadingIndication)
SetJcfOption (optGraphicRendering, GIGraphicRendering)
SetJcfOption (optButtonText, GIButtonText)
SetJCFOption(optExpandAbbreviations,giExpandAbbreviations)
SetJCFOption(optExpandAcronyms,giExpandAcronyms)
SetJCFOption (OPTFormFieldPrompts, GIFormFieldPrompts)
SetJcfOption (OPT_USE_VIRTUAL_INFO_IN_FORMS_MODE, gIFormVirtual)
SetJcfOption (OPT_LANGUAGE_DETECTION, GIAutoLanguageDetect)
SetJcfOption (OPT_VIRTUAL_MSAA_REFRESH_RATE, GIFlash)
SetJcfOption (optPageRefreshFilter, GIHtml)
SetJcfOption (optAnnounceLiveRegionUpdates, GIAnnounceLiveRegionUpdates)
SetJCFOption (OPTScreenFollowsVCursor, gIVTrack)
SetJcfOption (OptIndicateElementAttributes, GiOptIndicateElementAttributes)
SetJcfOption (optMaxLineLength, gIMaxLineLength)
SetJcfOption (optTextBlockLength, gITextBlockLength)
SetJcfOption (optEmbeddedActiveXSupport, gIShowFlash)
SetJcfOption (optIdentifyLinkType, gILinkType)
SetJcfOption (optIdentifySamePageLinks, gISamePageLink)
SetJcfOption (optFormsModeAutoOff, gIFormsModeAutoOff)
SetJCFOption(OPT_CUSTOM_PAGE_SUMMARY,gICustomPageSummary)
setJCFOption (OPT_VIRTUAL_PC_CURSOR , gIVirtualCursor)
SetJCFOption (optStyleSheetProcessing,gIStyleSheetProcessing)
SetJCFOption(OPT_AutoFormsMode_THRESHOLD,giAutoFormsModeThreshhold)
SetJCFOption(OPT_AUTO_FORMS_MODE,giAutoFormsMode)
SetJCFOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES, giWebAppReservedKeys)
SetJCFOption (OPT_SAYALL_ON_DOCUMENT_LOAD, gbDefaultSayAllOnDocumentLoad)
SetJCFOption (optVirtualCursorVerbosityLevel, GIVirtualCursorVerbosityLevel)
;following are any string settings, which are not JCF option integers:
let GDocumentSayAllScheme = cscNull
EndFunction

;***End of template needed by your custom function

int Function LoadSectionSettingsFromRelevantFile(string sSection)
;If you've got everything added properly, you shouldn't have to do anything here.
;Just remember to put your actual function in, declare it in the JSD (that's easy just copy everything)
;Make sure you have a global and a key.
;Of course, you must add the Custom version of the relevant HTML function.
;Use one of the other functions as templates.
;Basically, just use DiscoverCorrectOption and WriteCustomOption for Get and Set.
;Fill in your values in the above functions and make sure you've added your values to the IECustomSettings.jsh file.
var
	int iSegment,
	int iOption,
	int iSetting,
	string sTemp,
	string strString,
	int nKeyMax
Let strString = IniReadSectionKeys (sSection, gStrFileName)
let nKeyMax = StringSegmentCount(strString,KeyLabelSeparator)
If !strString then
	Return false
EndIf
Let iSegment = 1
While iSegment <= nKeyMax
	Let sTemp = StringSegment (strString, KeyLabelSeparator, iSegment)
	if StringLength (sTemp) > 0 then
		Let iOption = ConvertCustomToJCF (sTemp)
		Let iSetting = IniReadInteger (sSection, sTemp, -1, gStrFileName)
		SetJCFOption (iOption, iSetting)
	endif
	Let iSegment = iSegment+1
EndWhile
return true
EndFunction

int function LoadStringSettings()
let GDocumentSayAllScheme = IniReadString(section_options,hKey_SayAllScheme, cscNull, gStrFileName)
return GDocumentSayAllScheme != cscNull
EndFunction

void Function LoadSettingsFromRelevantFile()
var
	int bHTMLSectionLoaded,
	int bFormsSectionLoaded,
	int bOptionsSectionLoaded,
	int bVirtualCursorVerbositySectionLoaded,
	int bStringKeysLoaded
let bHTMLSectionLoaded = LoadSectionSettingsFromRelevantFile(section_HTML)
let bFormsSectionLoaded = LoadSectionSettingsFromRelevantFile(section_FormsMode)
let bOptionsSectionLoaded = LoadSectionSettingsFromRelevantFile(section_Options)
let bStringKeysLoaded = LoadStringSettings()
let bVirtualCursorVerbositySectionLoaded = LoadSectionSettingsFromRelevantFile(section_VirtualCursorVerbosity)
Let bWereCustomSettingsLoaded  = bHTMLSectionLoaded || bFormsSectionLoaded || bOptionsSectionLoaded || bStringKeysLoaded || bVirtualCursorVerbositySectionLoaded
EndFunction

string function GetIniSectionName(int iOption)
if iOption == OPT_AUTOFORMSMODE_THRESHOLD
|| iOption == optFormsModeAutoOff
|| iOption == OPT_AUTO_FORMS_MODE then
	return Section_FormsMode
elif iOption == OPT_VIRTUAL_DOCUMENT_LINK_ACTIVATION_METHOD
|| iOption == OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES then
	return Section_Options
elif iOption == optVirtualCursorVerbosityLevel then
	return section_VirtualCursorVerbosity
else
	return Section_HTML
EndIf
EndFunction

int Function DiscoverCorrectOption (int iOption)
var
	string strKey,
	string sVal
If !bWereCustomSettingsLoaded then;We haven't made a file yet.
	Return GetJcfOption (iOption)
EndIf
Let strKey = ConvertJCFToCustom (iOption)
Let sVal = IniReadString(GetIniSectionName(iOption), strKey, cScNull, gStrFileName)
If !sVal then
	Return GetJCFOption (iOption)
Else
	Return StringToInt (sVal)
EndIf
EndFunction

void Function WriteCustomOption (int iOption, int iSetting)
var
	string strKey
Let strKey = ConvertJCFToCustom (iOption)
return WriteSettingInteger (GetIniSectionName (iOption), strKey, iSetting, FT_JSI, wdUser, gStrFileName)
EndFunction

;Now for the fake versions of the html option functions.
;Just add your extra one, mimmicking the way we've done it as your final step.

string function CustomIncludeGraphicsToggle (int iRetCurVal)
var
	int iGraphicsLevel
let iGraphicsLevel = DiscoverCorrectOption (optIncludeGraphics)
if not iRetCurVal then
	If iGraphicsLevel == 2 then
		let iGraphicsLevel=0
	Else
		let iGraphicsLevel=iGraphicsLevel+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optIncludeGraphics, iGraphicsLevel)
	SetJCFOption (optIncludeGraphics, iGraphicsLevel)
endIf
;now return the value
if (iGraphicsLevel == 0) then
	return cmsg334_S
elIf (iGraphicsLevel == 1) then
	return cmsg335_S
ElIf (iGraphicsLevel == 2) then
	return cmsg336_S
endIf
EndFunction

string function UOCustomGraphicsShow (int iRetCurVal)
var
	int iGraphicsLevel
let iGraphicsLevel = DiscoverCorrectOption (optIncludeGraphics)
if not iRetCurVal then
	If iGraphicsLevel == 2 then
		let iGraphicsLevel=0
	Else
		let iGraphicsLevel=iGraphicsLevel+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optIncludeGraphics, iGraphicsLevel)
	SetJCFOption (optIncludeGraphics, iGraphicsLevel)
endIf
return vCursorGraphicsShowTextOutput(iGraphicsLevel)
EndFunction

string function UOCustomGraphicsShowHLP()
Return vCursorGraphicsShowHlp()
EndFunction

string Function CustomIncludeLinksToggle (int iRetCurVal)
var
	int iLinksLevel
Let iLinksLevel = DiscoverCorrectOption (optIncludeGraphicLinks)
if not iRetCurVal then
;update it
	If (iLinksLevel == 2) then
		let iLinksLevel=0
	Else
		let iLinksLevel=iLinksLevel+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption(optIncludeGraphicLinks, iLinksLevel)
	SetJCFOption (optIncludeGraphicLinks, iLinksLevel)
endIf
;now return the value
if (iLinksLevel == 0) then
	return cmsg295_S
elIf (iLinksLevel == 1) then
	return cmsg296_S
ElIf (iLinksLevel == 2) then
	return cmsg297_S
endIf
EndFunction

string function CustomFilterConsecutiveDuplicateLinks(int iRetcurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption (optFilterConsecutiveDuplicateLinks)
if !iRetCurVal then
	let iSetting = !iSetting
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption(optFilterConsecutiveDuplicateLinks,iSetting)
	SetJCFOption (optFilterConsecutiveDuplicateLinks,iSetting)
endIf
return VCursorFilterConsecutiveDuplicateLinksTextOutput(iSetting)
EndFunction

string Function CustomFilterConsecutiveDuplicateLinksHlp()
Return VCursorFilterConsecutiveDuplicateLinksHlp()
EndFunction

string Function UOCustomGraphicalLinksSet (int iRetCurVal)
var
	int iLinksLevel
Let iLinksLevel = DiscoverCorrectOption (optIncludeGraphicLinks)
if not iRetCurVal then
;update it
	If (iLinksLevel == 2) then
		let iLinksLevel=0
	Else
		let iLinksLevel=iLinksLevel+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption(optIncludeGraphicLinks, iLinksLevel)
	SetJCFOption (optIncludeGraphicLinks, iLinksLevel)
endIf
;now return the value
if (iLinksLevel == 0) then
	return cmsg334_S
elIf (iLinksLevel == 1) then
	return cmsg335_S
ElIf (iLinksLevel == 2) then
	return cmsg336_S
endIf
EndFunction

string Function UOCustomGraphicalLinksSetHlp()
Return vCursorGraphicalLinksSetHlp()
EndFunction

string function getCustomGraphicalLinksInfo (string settingID, int nReadSource)
var
	int iLinksLevel= getJCFOption (optIncludeGraphicLinks), 	
	stringArray listItems,
	int size = 3
listItems = new stringArray[size]
listItems[1] = cmsg334_S
listItems[2] = cmsg335_S
listItems[3] = cmsg336_S
iLinksLevel = DiscoverCorrectOption (optIncludeGraphicLinks)
; because the only valid value is 0 or 2, but there are only two entries in the list:
if iLinksLevel then iLinksLevel = 1 endIf
return QsxmlMakeList (settingID, iLinksLevel, listItems, size)
endFunction

void function setCustomGraphicalLinksInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iLinksLevel
parseXMLListWriteRequest (sxmlWriteRequest, iLinksLevel)
; because values for file are 0 or 2, but 1 would be returned from the two-item list:
WriteCustomOption(optIncludeGraphicLinks, iLinksLevel)
SetJCFOption (optIncludeGraphicLinks, iLinksLevel)
GIIncludeGraphicLinks = iLinksLevel
EndFunction

string Function CustomGraphicsLinkLastResortToggle (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optGraphicalLinkLastResort)
if not iRetCurVal then
	;update it
	Let iOption = (! iOption)
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optGraphicalLinkLastResort, iOption)
	SetJCFOption (optGraphicalLinkLastResort, iOption)
EndIf
If iOption then
	Return msgUO_GraphicalLinksShowLinkSRC
Else
	Return msgUO_GraphicalLinksShowImage
EndIf
EndFunction

string Function UOCustomUntaggedGraphicalLinkShow (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optGraphicalLinkLastResort)
if not iRetCurVal then
	;update it
	Let iOption = (! iOption)
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optGraphicalLinkLastResort, iOption)
	SetJCFOption (optGraphicalLinkLastResort, iOption)
EndIf
If iOption then
	Return msgUO_GraphicalLinksShowLinkSRC
Else
	Return msgUO_GraphicalLinksShowImage
EndIf
EndFunction

string Function UOCustomUntaggedGraphicalLinkShowHlp()
Return vCursorUntaggedGraphicalLinkShowHlp()
EndFunction

string Function CustomIncludeImageMapLinksToggle (int iRetCurVal)
var
	int iImageMapLevel
let iImageMapLevel = DiscoverCorrectOption (optIncludeImageMapLinks)
if not iRetCurVal then
;update it
	If (iImageMapLevel == 2) then
		let iImageMapLevel =0
	Else
		let iImageMapLevel =iImageMapLevel +1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption(optIncludeImageMapLinks, iImageMapLevel)
	SetJCFOption (optIncludeImageMapLinks, iImageMapLevel)
endIf
;now return the value
if (iImageMapLevel == 0) then
	return cmsg334_S
elIf (iImageMapLevel == 1) then
	return cmsg335_S
ElIf (iImageMapLevel == 2) then
	return cmsg336_S
endIf
EndFunction

string Function UOCustomImageMapLinksShow (int iRetCurVal)
var
	int iImageMapLevel
let iImageMapLevel = DiscoverCorrectOption (optIncludeImageMapLinks)
if not iRetCurVal then
;update it
	If (iImageMapLevel == 2) then
		let iImageMapLevel =0
	Else
		let iImageMapLevel =iImageMapLevel +1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption(optIncludeImageMapLinks, iImageMapLevel)
	SetJCFOption (optIncludeImageMapLinks, iImageMapLevel)
endIf
;now return the value
if (iImageMapLevel == 0) then
	return cmsg334_S
elIf (iImageMapLevel == 1) then
	return cmsg335_S
ElIf (iImageMapLevel == 2) then
	return cmsg336_S
endIf
EndFunction

string Function UOCustomImageMapLinksShowHlp()
Return vCursorImageMapLinksShowHlp()
EndFunction

string Function CustomFrameIndicationToggle (int iRetCurVal)
var
	int iFrameIdentify
let iFrameIdentify = DiscoverCorrectOption (optFrameIndication)
if not iRetCurVal then
	let iFrameIdentify = !iFrameIdentify
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optFrameIndication, iFrameIdentify)
	SetJCFOption (optFrameIndication, iFrameIdentify)
endIf
if !iFrameIdentify then
	return msgUO_Off
else
	return msgUO_On
endIf
EndFunction

string Function UOCustomFramesShowStartAndEnd (int iRetCurVal)
var
	int iFrameIdentify
let iFrameIdentify = DiscoverCorrectOption (optFrameIndication)
if not iRetCurVal then
	let iFrameIdentify = !iFrameIdentify
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optFrameIndication, iFrameIdentify)
	SetJCFOption (optFrameIndication, iFrameIdentify)
endIf
if !iFrameIdentify then
	return msgUO_Off
else
	return msgUO_On
endIf
EndFunction

string Function UOCustomFramesShowStartAndEndHlp()
Return vCursorFramesShowStartAndEndHlp()
EndFunction

string Function CustomTextLinkVerbosityToggle (int iRetCurVal)
var
int iLinkVerbosity
let iLinkVerbosity  = DiscoverCorrectOption (optLinkText)
if not iRetCurVal then
;update it
	If iLinkVerbosity == 4 then
		let iLinkVerbosity=0
	else
		let iLinkVerbosity=iLinkVerbosity+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optLinkText, iLinkVerbosity)
	SetJCFOption (optLinkText, iLinkVerbosity)
endIf
;now return the value
if iLinkVerbosity == 0 then
	return cmsg328_S
elIf iLinkVerbosity == 1 then
	return cmsg329_S
ElIf iLinkVerbosity == 2 then
	return cmsg330_L
ElIf iLinkVerbosity == 3 then
	return cmsg330_S
ElIf iLinkVerbosity == 4 then
	Return cmsgCustomSearch;
endIf
EndFunction

string Function UOCustomTextLinksShow (int iRetCurVal)
var
	int iLinkVerbosity
let iLinkVerbosity  = DiscoverCorrectOption (optLinkText)
if not iRetCurVal then
;update it
	If iLinkVerbosity == 4 then
		let iLinkVerbosity=0
	else
		let iLinkVerbosity=iLinkVerbosity+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optLinkText, iLinkVerbosity)
	SetJCFOption (optLinkText, iLinkVerbosity)
endIf
;now return the value
if iLinkVerbosity == 0 then
	return cmsg328_S
elIf iLinkVerbosity == 1 then
	return cmsg329_S
ElIf iLinkVerbosity == 2 then
	return cmsg330_L
ElIf iLinkVerbosity == 3 then
	return cmsg330_S
ElIf iLinkVerbosity == 4 then
	Return cmsgCustomSearch;
endIf
EndFunction

string Function UOCustomTextLinksShowHlp()
Return vCursorTextLinksShowHlp()
EndFunction

string function getCustomSelectandCopyInfo (string settingID, int nReadSource)
var
	int VirtualEnhancedClipboard = getJCFOption (OPT_VPC_ENHANCED_CLIPBOARD), 	;SSB-SM: Get the current state of the setting just in case everything else fails for some reason.
	stringArray listItems,
	int size = 2
listItems = new stringArray[size]
listItems[1] = msgUO_Virtual_Cursor
listItems[2] = msgUO_FullContent_Visual
let VirtualEnhancedClipboard  = readSettingInteger(SECTION_OSM, hKey_VirtualCursorEnhancedClipboard, VirtualEnhancedClipboard, FT_DEFAULT_JCF, nReadSource)	; SSB-SM: Get the global setting from default.jcf or return nState if no setting is found in default.jcf
VirtualEnhancedClipboard = DiscoverCorrectOption (OPT_VPC_ENHANCED_CLIPBOARD)
; because the only valid value is 0 or 2, but there are only two entries in the list:
if VirtualEnhancedClipboard then VirtualEnhancedClipboard = 1 endIf
return QsxmlMakeList (settingID, VirtualEnhancedClipboard, listItems, size)
endFunction

void function setCustomSelectandCopyInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int VirtualEnhancedClipboard
parseXMLListWriteRequest (sxmlWriteRequest, VirtualEnhancedClipboard)
; because values for file are 0 or 2, but 1 would be returned from the two-item list:
if VirtualEnhancedClipboard then VirtualEnhancedClipboard = 2 endIf
SetJCFOption (OPT_VPC_ENHANCED_CLIPBOARD, VirtualEnhancedClipboard)
giEnhancedClipboard = VirtualEnhancedClipboard
WriteCustomOption (OPT_VPC_ENHANCED_CLIPBOARD, VirtualEnhancedClipboard)
EndFunction

string function getCustomAutoFormsModeInfo(string settingID, int nReadSource)
var
	int currentAutoFormsMode,
	stringArray listItems,
	int size = 3
listItems = new stringArray[size]
listItems[1] = cmsgManualFormsMode
listItems[2] = cmsgAutoFormsMode
listItems[3] = cmsgSemiAutoFormsMode

currentAutoFormsMode = DiscoverCorrectOption (OPT_AUTO_FORMS_MODE)
return QsxmlMakeList (settingID, currentAutoFormsMode , listItems, size)
endFunction

void function setCustomAutoFormsModeInfo(string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int currentAutoFormsMode
parseXMLListWriteRequest (sxmlWriteRequest, currentAutoFormsMode )
setJCFOption (OPT_AUTO_FORMS_MODE, currentAutoFormsMode )
giAutoFormsMode = currentAutoFormsMode
WriteCustomOption (OPT_AUTO_FORMS_MODE, currentAutoFormsMode)
endFunction

string function getCustomTextLinksInfo (string settingID, int nReadSource)
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
nSelectIndex = DiscoverCorrectOption (optLinkText)
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setCustomTextLinksInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int iSetting
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
let iSetting = iSelection
setJCFOption (optLinkText, iSetting)
WriteCustomOption (optLinkText, iSetting)
endFunction

string Function GetCustomUntaggedGraphicalLinkShowInfo(string settingID, int nReadSource)
var
	int nTextLinks,
	int nSelectIndex,
	stringArray szListItems,
	int nSize = 2
szListItems = new StringArray[nSize]
;bearing in mind that these arrays are 1-based, not 0-based:
szListItems[1] = msgUO_GraphicalLinksShowImage
szListItems[2] = msgUO_GraphicalLinksShowLinkSRC
nSelectIndex = DiscoverCorrectOption (optGraphicalLinkLastResort)
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
EndFunction

void Function SetCustomUntaggedGraphicalLinkShowInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int iSetting
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
iSetting = iSelection
setJCFOption (optGraphicalLinkLastResort, iSetting)
WriteCustomOption (optGraphicalLinkLastResort, iSetting)
EndFunction

string Function CustomButtonTextVerbosityToggle (int iRetCurVal)
var
int iButtonText
let iButtonText = DiscoverCorrectOption (optButtonText)
if not iRetCurVal then
;update it
	If iButtonText== 4 then
		let iButtonText=0
	else
		let iButtonText=iButtonText+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optButtonText, iButtonText)
	SetJCFOption (optButtonText, iButtonText)
endIf
;now return the value
if iButtonText == 0 then
	return cmsg328_S
elIf iButtonText == 1 then
	return cmsg329_S
ElIf iButtonText == 2 then
	return cmsg328_L
ElIf iButtonText == 3 then
	return cmsgButtonValue_L
ElIf iButtonText == 4 then
	Return cmsg330_S;
endIf
EndFunction

string Function UOCustomButtonsShowUsing (int iRetCurVal)
var
	int iButtonText
let iButtonText = DiscoverCorrectOption (optButtonText)
if not iRetCurVal then
;update it
	If iButtonText== 5 then
		let iButtonText=0
	else
		let iButtonText=iButtonText+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optButtonText, iButtonText)
	SetJCFOption (optButtonText, iButtonText)
endIf
;now return the value
if iButtonText == 0 then
	return cmsg328_S
elIf iButtonText == 1 then
	return cmsg329_S
ElIf iButtonText == 2 then
	return cmsg328_L
ElIf iButtonText == 3 then
	return cmsgButtonValue_L
ElIf iButtonText == 4 then
	Return cmsg330_S;
ElIf iButtonText == 5 then
	return cmsgCustomSearch
endIf
EndFunction

string Function UOCustomButtonsShowUsingHlp()
Return vCursorButtonsShowUsingHlp()
EndFunction

string Function CustomExpandAbbreviationsVerbosityToggle (int iRetCurVal)
var
	int iExpandAbbreviations
let iExpandAbbreviations = DiscoverCorrectOption(optExpandAbbreviations)
if !iRetCurVal then
	let iExpandAbbreviations = !iExpandAbbreviations
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optExpandAbbreviations,iExpandAbbreviations)
	SetJCFOption(optExpandAbbreviations,iExpandAbbreviations)
endIf
if iExpandAbbreviations then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string Function UOCustomAbbreviationsExpand (int iRetCurVal)
var
	int iExpandAbbreviations
let iExpandAbbreviations = DiscoverCorrectOption(optExpandAbbreviations)
if !iRetCurVal then
	let iExpandAbbreviations = !iExpandAbbreviations
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optExpandAbbreviations,iExpandAbbreviations)
	SetJCFOption(optExpandAbbreviations,iExpandAbbreviations)
endIf
if iExpandAbbreviations then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string Function UOCustomAbbreviationsExpandHlp()
Return vCursorAbbreviationsExpandHlp()
EndFunction

string Function CustomExpandAcronymsVerbosityToggle (int iRetCurVal)
var
	int iExpandAcronyms
let iExpandAcronyms = DiscoverCorrectOption(optExpandAcronyms)
if !iRetCurVal then
	let iExpandAcronyms = !iExpandAcronyms
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optExpandAcronyms,iExpandAcronyms)
	SetJCFOption(optExpandAcronyms,iExpandAcronyms)
endIf
if iExpandAcronyms then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string Function UOCustomAcronymsExpand (int iRetCurVal)
var
	int iExpandAcronyms
let iExpandAcronyms = DiscoverCorrectOption(optExpandAcronyms)
if !iRetCurVal then
	let iExpandAcronyms = !iExpandAcronyms
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optExpandAcronyms,iExpandAcronyms)
	SetJCFOption(optExpandAcronyms,iExpandAcronyms)
endIf
if iExpandAcronyms then
	return msgUO_on
else
	return msgUO_off
endIf
EndFunction

string Function UOCustomAcronymsExpandHlp()
Return vCursorAcronymsExpandHlp()
EndFunction

string function CustomFormFieldPromptsRenderingToggle (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optFormFieldPrompts)
If ! iRetCurVal then
	;Update it.
	If iOption == 5 then
		Let iOption = 0
	Else
		Let iOption = iOption + 1
	EndIf
		Let bWereCustomSettingsLoaded = TRUE
				 WriteCustomOption (optFormFieldPrompts, iOption)
	SetJcfOption (optFormFieldPrompts, iOption)
EndIf
If iOption == 0 then
	Return cMsgLabelTag
ElIf iOption == 1 then
	Return cmsg328_S
ElIf iOption == 2 then
	Return cMsgAltAttribute
ElIf iOption == 3 then
	Return cmsg330_S
ElIf iOption == 4 then
	Return cmsgTitleLabel
ElIf iOption == 5 then
	Return cMsgAltLabel
EndIf
EndFunction

string function UOCustomFormFieldsIdentifyPromptUsing (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optFormFieldPrompts)
If ! iRetCurVal then
	;Update it.
	If iOption == 5 then
		Let iOption = 0
	Else
		Let iOption = iOption + 1
	EndIf
		Let bWereCustomSettingsLoaded = TRUE
				 WriteCustomOption (optFormFieldPrompts, iOption)
	SetJcfOption (optFormFieldPrompts, iOption)
EndIf
If iOption == 0 then
	Return cMsgLabelTag
ElIf iOption == 1 then
	Return cmsg328_S
ElIf iOption == 2 then
	Return cMsgAltAttribute
ElIf iOption == 3 then
	Return cmsg330_S
ElIf iOption == 4 then
	Return cmsgTitleLabel
ElIf iOption == 5 then
	Return cMsgAltLabel
EndIf
EndFunction

string function UOCustomFormFieldsIdentifyPromptUsingHlp()
Return vCursorFormFieldsIdentifyPromptUsingHlp()
EndFunction

String Function CustomToggleLanguageDetection (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (OPT_LANGUAGE_DETECTION)
If ! iRetCurVal then
	;Update it
	Let iOption = ! iOption;Toggle
	WriteCustomOption (OPT_LANGUAGE_DETECTION, iOption)
	SetJCFOption (OPT_LANGUAGE_DETECTION, iOption)
EndIf
;Now return the value
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

String Function UOCustomLanguageDetectChange (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (OPT_LANGUAGE_DETECTION)
If ! iRetCurVal then
	;Update it
	Let iOption = ! iOption;Toggle
	WriteCustomOption (OPT_LANGUAGE_DETECTION, iOption)
	SetJCFOption (OPT_LANGUAGE_DETECTION, iOption)
EndIf
;Now return the value
If iOption then
	Return msgUO_on
Else
	Return msgUO_off
EndIf
EndFunction

String Function UOCustomLanguageDetectChangeHlp()
Return FormatString(msgCustomUO_LanguageDetectChangeHlp)
EndFunction

string function getCustomLanguageDetectChangeInfo (string SettingID, int ReadSource)
var
	int iOption = DiscoverCorrectOption (OPT_LANGUAGE_DETECTION)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (iOption))
endFunction

void Function SetCustomLanguageDetectChangeInfo (string settingID, string sXmlWriteRequest)
var
	int Setting
parseXMLBooleanWriteRequest (sxmlWriteRequest, Setting)
WriteCustomOption (OPT_LANGUAGE_DETECTION, Setting)
SetJcfOption (OPT_LANGUAGE_DETECTION, Setting)
GIAutoLanguageDetect = Setting
endFunction

string Function CustomGraphicReadingVerbosityToggle (int iRetCurVal)
var
int iVerbosity
let iVerbosity  = DiscoverCorrectOption (optGraphicRendering)
if not iRetCurVal then
;update it
	If iVerbosity == 4 then
		let iVerbosity=0
	else
		let iVerbosity=iVerbosity+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optGraphicRendering, iVerbosity)
	SetJCFOption (optGraphicRendering, iVerbosity)
endIf
;now return the value
if iVerbosity == 0 then
	return cmsg328_S
elIf iVerbosity == 1 then
	return cmsg328_L
ElIf iVerbosity == 2 then
	return cmsg330_L
ElIf iVerbosity == 3 then
	return cmsg330_S
ElIf iVerbosity == 4 then
	Return cmsgCustomSearch;
endIf
EndFunction

string Function UOCustomGraphicsSetRecognition (int iRetCurVal)
var
int iVerbosity
let iVerbosity  = DiscoverCorrectOption (optGraphicRendering)
if not iRetCurVal then
;update it
	If iVerbosity == 4 then
		let iVerbosity=0
	else
		let iVerbosity=iVerbosity+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optGraphicRendering, iVerbosity)
	SetJCFOption (optGraphicRendering, iVerbosity)
endIf
;now return the value
if iVerbosity == 0 then
	return cmsg328_S
elIf iVerbosity == 1 then
	return cmsg328_L
ElIf iVerbosity == 2 then
	return cmsg330_L
ElIf iVerbosity == 3 then
	return cmsg330_S
ElIf iVerbosity == 4 then
	Return cmsgCustomSearch;
endIf
EndFunction

string Function UOCustomGraphicsSetRecognitionHlp()
Return vCursorGraphicsSetRecognitionHlp()
EndFunction

string Function CustomIndicateTablesToggle(int iRetCurVal)
var
int iIndicateTables
let iIndicateTables = DiscoverCorrectOption (optTableIndication)
if not iRetCurVal then
	;update it
	let iIndicateTables=not iIndicateTables
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optTableIndication, iIndicateTables)
	SetJCFOption (optTableIndication, iIndicateTables)
endIf
;now return the value
If iIndicateTables  then
	return cmsg_on
Else
	return cmsg_off
endIf
EndFunction

string Function UOCustomTablesShowStartAndEnd (int iRetCurVal)
var
int iIndicateTables
let iIndicateTables = DiscoverCorrectOption (optTableIndication)
if not iRetCurVal then
	;update it
	let iIndicateTables=not iIndicateTables
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optTableIndication, iIndicateTables)
	SetJCFOption (optTableIndication, iIndicateTables)
endIf
;now return the value
If iIndicateTables  then
	return msgUO_On
Else
	return msgUO_Off
endIf
EndFunction

string Function UOCustomTablesShowStartAndEndHlp()
Return vCursorTablesShowStartAndEndHlp()
EndFunction

string Function CustomDetectTables (int iRetCurVal)
var
	int iTables
If ! GetJCFOption (optTableIndication) then
	Return cMsgNotAvailable
EndIf
Let iTables = DiscoverCorrectOption (optTableDetection)
If ! iRetCurVal then
	;Update it
	Let iTables = (! iTables)
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optTableDetection, iTables)
	SetJcfOption (optTableDetection, iTables)
EndIf
If iTables then
	Return cmsg_off
Else
	Return cmsg_on
EndIf
EndFunction

string Function UOCustomLayoutTables (int iRetCurVal)
var
	int iTables
If ! GetJCFOption (optTableIndication) then
	Return cMsgNotAvailable
EndIf
Let iTables = DiscoverCorrectOption (optTableDetection)
If ! iRetCurVal then
	;Update it
	Let iTables = (! iTables)
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optTableDetection, iTables)
	SetJcfOption (optTableDetection, iTables)
EndIf
If iTables then
	Return msgUO_Off
Else
	Return msgUO_On
EndIf
EndFunction

string Function UOCustomLayoutTablesHlp()
return vCursorLayoutTablesHlp()
EndFunction

string Function UOCustomTableTitlesAnnounce(int iRetCurVal)
var
	int iSetting
If !GetJCFOption (optTableIndication) then
	Return cMsgNotAvailable
EndIf
Let iSetting = DiscoverCorrectOption(PseudoOpt_TableTitlesAnnounce)
If !iRetCurVal then
	if iSetting == TBL_HEADER_MARKED then
		let iSetting = 0
	else
		let iSetting = iSetting+1
	EndIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption(PseudoOpt_TableTitlesAnnounce,iSetting)
	SetJcfOption(PseudoOpt_TableTitlesAnnounce,iSetting)
EndIf
If iSetting == OFF then
	Return msgUO_off
ElIf iSetting == TBL_HEADER_ROW then
	Return cmsgRowTitles
ElIf iSetting == TBL_HEADER_COL then
	Return cMsgColumnTitles
ElIf iSetting == TBL_HEADER_BOTH then
	Return cMsgBothTitles
Else ; Marked headers
	Return cMsgMarkedTitles
EndIf
EndFunction

string Function UOCustomTableTitlesAnnounceHlp()
Return vCursorTableTitlesAnnounceHlp()
EndFunction

string Function CustomIndicateHeadingsToggle (int iRetCurVal)
var
int iIndicateHeadings
let iIndicateHeadings = DiscoverCorrectOption (optHeadingIndication)
if not iRetCurVal then
;update it
	if (iIndicateHeadings==2) then
		let iIndicateHeadings=0
	else
		let iIndicateHeadings=iIndicateHeadings+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optHeadingIndication, iIndicateHeadings)
	SetJCFOption (optHeadingIndication, iIndicateHeadings)
endIf
;now return the value
If iIndicateHeadings==0 then
	return cmsg_off
Elif iIndicateHeadings==1 then
	return cmsg_on
Elif iIndicateHeadings==2 then
	return cmsgHeadings2
endIf
EndFunction

string Function UOCustomHeadingsAnnounce (int iRetCurVal)
var
int iIndicateHeadings
let iIndicateHeadings = DiscoverCorrectOption (optHeadingIndication)
if not iRetCurVal then
;update it
	if (iIndicateHeadings==2) then
		let iIndicateHeadings=0
	else
		let iIndicateHeadings=iIndicateHeadings+1
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optHeadingIndication, iIndicateHeadings)
	SetJCFOption (optHeadingIndication, iIndicateHeadings)
endIf
;now return the value
If iIndicateHeadings==0 then
	return cmsg_off
Elif iIndicateHeadings==1 then
	return cmsg_on
Elif iIndicateHeadings==2 then
	return cmsgHeadings2
endIf
EndFunction

string function GetCustomHeadingsInfo (string SettingID, int nReadSource)
var
	int nSelectIndex = DiscoverCorrectOption (optHeadingIndication),
	stringArray szListItems,
	int nSize = 3
szListItems = new stringArray[nSize]
szListItems[1] = cmsg_off
szListItems[2] = cmsg_on
szListItems[3] = cmsgHeadings2 ; 'headings with level'
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
EndFunction

void function SetCustomHeadingsInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
SetJCFOption (optHeadingIndication, iSelection)
;writeSettingInteger (GetIniSectionName (optHeadingIndication), hKey_HeadingIndication, iSelection, FT_JSI, wdUser, gStrFileName)
bWereCustomSettingsLoaded = TRUE
WriteCustomOption (optHeadingIndication, iSelection)
endFunction

string Function UOCustomHeadingsAnnounceHlp()
Return vCursorHeadingsAnnounceHlp()
EndFunction

string Function CustomIndicateBlockQuotes (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optBlockQuoteIndication)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optBlockQuoteIndication,iOption)
	SetJcfOption (optBlockQuoteIndication,iOption)
EndIf
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string Function UOCustomBlockQuotesIdentifyStartAndEnd (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optBlockQuoteIndication)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optBlockQuoteIndication,iOption)
	SetJcfOption (optBlockQuoteIndication,iOption)
EndIf
If iOption then
	Return msgUO_On
Else
	Return msgUO_Off
EndIf
EndFunction

string Function UOCustomBlockQuotesIdentifyStartAndEndHlp()
Return vCursorBlockQuotesIdentifyStartAndEndHlp()
EndFunction

string Function CustomIndicateLists (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optListIndication)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optListIndication,iOption)
	SetJcfOption (optListIndication,iOption)
EndIf
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string Function UOCustomListsIdentifyStartAndEnd (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optListIndication)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optListIndication,iOption)
	SetJcfOption (optListIndication,iOption)
EndIf
If iOption then
	Return msgUO_On
Else
	Return msgUO_Off
EndIf
EndFunction

string Function UOCustomListsIdentifyStartAndEndHlp()
Return vCursorListsIdentifyStartAndEndHlp()
EndFunction

string Function GetCustomIndicateListsInfo (string settingID, int nReadSource)
var
	int iOption = DiscoverCorrectOption (optListIndication)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (iOption))
endFunction

void Function SetCustomIndicateListsInfo (string settingID, string sXmlWriteRequest)
var
	int Setting
parseXMLBooleanWriteRequest (sxmlWriteRequest, Setting)
WriteCustomOption (optListIndication, Setting)
SetJcfOption (optListIndication, Setting)
GIListIndication = Setting
endFunction

string function getCustomReserveWebAppKeysInfo (string SettingID, int ReadSource)
var
	int iOption = DiscoverCorrectOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (iOption))
endFunction

void Function SetCustomReserveWebAppKeysInfo (string settingID, string sXmlWriteRequest)
var
	int Setting
parseXMLBooleanWriteRequest (sxmlWriteRequest, Setting)
WriteCustomOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES, Setting)
SetJcfOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES, Setting)
giWebAppReservedKeys = Setting
endFunction

string Function CustomToggleIgnoreInlineFrames (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optIgnoreInlineFrames)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optIgnoreInlineFrames,iOption)
	SetJcfOption (optIgnoreInlineFrames,iOption)
EndIf
If iOption then
	Return cMsgHidden
Else
	Return cMsgDisplayed
EndIf
EndFunction

string Function UOCustomInlineFramesShow (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optIgnoreInlineFrames)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optIgnoreInlineFrames,iOption)
	SetJcfOption (optIgnoreInlineFrames,iOption)
EndIf
;Double-negative on string, e.g. if option is on, then frames are off, as it's actually an ignore option in jcf, whereas to user it is show.
If iOption then
	Return msgUO_Off
Else
	Return msgUO_On
EndIf
EndFunction

string Function UOCustomInlineFramesShowHlp()
Return vCursorInlineFramesShowHlp()
EndFunction

string Function CustomSkipPastRepeatedTextToggle (int iRetCurVal)
var
	int iSkipRepeatedText
let iSkipRepeatedText = DiscoverCorrectOption (optSkipPastRpeatedText)
if not iRetCurVal then
;update it
	let iSkipRepeatedText =not iSkipRepeatedText
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optSkipPastRpeatedText, iSkipRepeatedText )
	SetJCFOption (optSkipPastRpeatedText, iSkipRepeatedText )
endIf
 ;now return the value
If iSkipRepeatedtext then
	return cmsg_on
Else
	return cmsg_off
endIf
EndFunction

string Function UOCustomRepeatedTextSkip (int iRetCurVal)
var
	int iSkipRepeatedText
let iSkipRepeatedText = DiscoverCorrectOption (optSkipPastRpeatedText)
if not iRetCurVal then
;update it
	let iSkipRepeatedText =not iSkipRepeatedText
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optSkipPastRpeatedText, iSkipRepeatedText )
	SetJCFOption (optSkipPastRpeatedText, iSkipRepeatedText )
endIf
 ;now return the value
If iSkipRepeatedtext then
	return msgUO_On
Else
	return msgUO_Off
endIf
EndFunction

string Function UOCustomRepeatedTextSkipHlp()
Return vCursorRepeatedTextSkipHlp()
EndFunction

string Function CustomRefreshHTML (int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption (optPageRefreshFilter)
If !iRetCurVal then
	;-1 = off, 0 = Automatic, 60000 = 60 seconds
	If iSetting == -1 then
		Let iSetting = 0
	ElIf iSetting == 0 then
		let iSetting = 60000
	Else
		Let iSetting = -1
	EndIf
	WriteCustomOption (optPageRefreshFilter, iSetting)
	SetJcfOption (optPageRefreshFilter, iSetting)
EndIf
If iSetting == -1 then
	Return cMsg_off; refreshOff
ElIf iSetting == 0 then
	Return cMsgRefreshAuto
Else
	Return cMsgOnceAMinute
EndIf
EndFunction

string Function UOCustomPageRefresh (int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption (optPageRefreshFilter)
If !iRetCurVal then
	;-1 = off, 0 = Automatic, 60000 = 60 seconds
	If iSetting == -1 then
		Let iSetting = 0
	ElIf iSetting == 0 then
		let iSetting = 60000
	Else
		Let iSetting = -1
	EndIf
	WriteCustomOption (optPageRefreshFilter, iSetting)
	SetJcfOption (optPageRefreshFilter, iSetting)
EndIf
If iSetting == -1 then
	Return cMsg_off; refreshOff
ElIf iSetting == 0 then
	Return cMsgRefreshAuto
Else
	Return cMsgOnceAMinute
EndIf
EndFunction

string Function UOCustomPageRefreshHlp()
Return PageRefreshHlp()
EndFunction

string Function CustomAnnounceLiveRegionUpdates (int iRetCurVal)
var
	int setting,
	string display
let setting = DiscoverCorrectOption (optAnnounceLiveRegionUpdates)
if ( ! iRetCurVal ) then
if ( setting == 0 ) then
let setting = 1
else
let setting = 0
EndIf
WriteCustomOption (optAnnounceLiveRegionUpdates, setting)
	SetJcfOption (optAnnounceLiveRegionUpdates, setting)
EndIf

; now choose a string to display
if ( setting == 1 ) then
let display = msgUO_On
Else
let display = msgUO_Off
EndIf

return display
EndFunction

string Function CustomAnnounceLiveRegionUpdatesHlp()
Return AnnounceLiveRegionUpdatesHlp()
EndFunction

string function CustomRefreshActiveContent (int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption  (OPT_VIRTUAL_MSAA_REFRESH_RATE)
If ! iRetCurVal then
	;Update it.
	;-1 = off, 0 = Automatic, that's all we care about here.
	If iSetting == -1 then
		Let iSetting = 0
	Else
		Let iSetting = -1
	EndIf
	WriteCustomOption (OPT_VIRTUAL_MSAA_REFRESH_RATE, iSetting)
	SetJcfOption (OPT_VIRTUAL_MSAA_REFRESH_RATE, iSetting)
EndIf
If iSetting == -1 then
	Return cMsg_off ;RefreshOff
ElIf iSetting == 0 then
	Return cMsgRefreshAuto
Else
	Return cMsgOnceAMinute
EndIf
EndFunction

string Function CustomClearAllSettings (int iRetCurVal)
If !iRetCurVal then
	IniRemoveSection (Section_HTML, gStrFileName)
	IniRemoveSection (Section_FormsMode, gStrFileName)
	IniRemoveSection (Section_Options, gStrFileName)
	SetJCFOptionsWithGlobals();Return options to normal.
	Let bWereCustomSettingsLoaded = FALSE
	Return msgCleared
EndIf
If bWereCustomSettingsLoaded then
	Return msg1OrMoreSet
Else
	return msgCleared
EndIf
EndFunction

string Function UOCustomClearAllSettings (int iRetCurVal)
If !iRetCurVal then
	IniRemoveSection (Section_FormsMode, gStrFileName)
	IniRemoveSection (Section_HTML, gStrFileName)
	IniRemoveSection (Section_Options, gStrFileName)
	SetJCFOptionsWithGlobals ();Return options to normal.
	Let bWereCustomSettingsLoaded = FALSE
	Return msgCleared
EndIf
If bWereCustomSettingsLoaded then
	Return msg1OrMoreSet
Else
	return msgCleared
EndIf
EndFunction

string Function UOCustomClearAllSettingsHlp()
Return FormatString(msgUO_CustomClearAllSettingsHlp)
EndFunction

string Function CustomToggleUseVirtualInfoInFormsMode (int iRetCurVal)
var
	int iSetting
let iSetting=DiscoverCorrectOption (OPT_USE_VIRTUAL_INFO_IN_FORMS_MODE)
if not iRetCurVal then
	; update it
	let iSetting=!iSetting
	WriteCustomOption (OPT_USE_VIRTUAL_INFO_IN_FORMS_MODE, iSetting)
	SetJcfOption(OPT_USE_VIRTUAL_INFO_IN_FORMS_MODE, iSetting)
EndIf
;now return the value
if iSetting then
	return cmsg_on ;UseVirtualInfoInFormsModeOn
else
	return cmsg_off ;UseVirtualInfoInFormsModeOff
endIf
EndFunction


string function CustomScreenFollowsVCursorToggle (int iRetCurVal)
var
	int iScreenFollowsVCursor
let iScreenFollowsVCursor = DiscoverCorrectOption (optScreenFollowsVCursor)
if not iRetCurVal then
;update it
	let iScreenFollowsVCursor =not iScreenFollowsVCursor
	WriteCustomOption (optScreenFollowsVCursor, iScreenFollowsVCursor)
	SetJCFOption (optScreenFollowsVCursor, iScreenFollowsVCursor)
endIf
;now return the value
If iScreenFollowsVCursor  then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string function UOCustomScreenTrack (int iRetCurVal)
var
	int iScreenFollowsVCursor
let iScreenFollowsVCursor = DiscoverCorrectOption (optScreenFollowsVCursor)
if not iRetCurVal then
;update it
	let iScreenFollowsVCursor =not iScreenFollowsVCursor
	WriteCustomOption (optScreenFollowsVCursor, iScreenFollowsVCursor)
	SetJCFOption (optScreenFollowsVCursor, iScreenFollowsVCursor)
endIf
;now return the value
If iScreenFollowsVCursor  then
	return msgUO_On
else
	return msgUO_Off
endIf
EndFunction

string function UOCustomScreenTrackHlp()
Return vCursorScreenTrackHlp()
EndFunction

string Function CustomElementAttributeAnnounce (int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption (optIndicateElementAttributes)
If ! iRetCurVal then
	;Update it
	Let iSetting = ! iSetting
	SetJcfOption (optIndicateElementAttributes, iSetting)
	WriteCustomOption (optIndicateElementAttributes, iSetting)
EndIf
If iSetting then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string Function UOCustonAttributesIndicate (int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption (optIndicateElementAttributes)
If ! iRetCurVal then
	;Update it
	Let iSetting = ! iSetting
	SetJcfOption (optIndicateElementAttributes, iSetting)
	WriteCustomOption (optIndicateElementAttributes, iSetting)
EndIf
If iSetting then
	return msgUO_On
else
	return msgUO_Off
endIf
EndFunction

string Function UOCustonAttributesIndicateHlp()
Return vCursorAttributesIndicateHlp()
EndFunction

string Function CustomIncrementMaxLineLength (int iRetCurVal)
Var
	int iLineLength
let iLineLength = DiscoverCorrectOption (optMaxLineLength)
if not iRetCurVal then
;update it
	If iLineLength < 245 Then
		let iLineLength=iLineLength + 10
	Else
		let iLineLength = 10
	endIf
	SetJCFOption (optMaxLineLength, iLineLength)
	WriteCustomOption (optMaxLineLength, iLineLength)
endIf
;now return the value
return FormatString (cmsg305_S, intToString(iLineLength))
EndFunction

string function CustomDecrementMaxLineLength (int iRetCurVal)
Var
	int iLineLength
let iLineLength = DiscoverCorrectOption (optMaxLineLength)
if not iRetCurVal then
;update it
	If iLineLength > 11 Then
		let iLineLength = iLineLength - 10
	Else
		let iLineLength = 254
	endIf
	SetJCFOption (optMaxLineLength, iLineLength)
	WriteCustomOption (optMaxLineLength, iLineLength)
endIf
;now return the value
return FormatString (cmsg305_S, intToString(iLineLength))
EndFunction

string function CustomSayAllScheme(int iRetCurVal)
var
	string sScheme,
	int iSchemeChoice
InitUOSayAllSchemesData()
If !bWereCustomSettingsLoaded then
	let sScheme = uoSayAllSchemeSameAsApp
else
	Let sScheme = IniReadString(section_options,hKey_SayAllScheme, cScNull, gStrFileName)
EndIf
let iSchemeChoice = GetSchemePositionInUOSayAllSchemesData(sScheme)
;scheme will revert to same as app if it not found in the list of schemes for the app:
if !iSchemeChoice then
	let sScheme = uoSayAllSchemeSameAsApp
EndIf
if !iRetCurVal then
	if iSchemeChoice == uoSayAllSchemeCount then
		;scheme will be same as app when it is not one listed in the app's scheme choices:
		let sScheme = uoSayAllSchemeSameAsApp
		let bWereCustomSettingsLoaded = false
		let GDocumentSayAllScheme = cscNull
		IniRemoveKey(section_options,hKey_SayAllScheme, gStrFileName, true)
	else
		let iSchemeChoice = iSchemeChoice+1
		let sScheme = GetSchemeFileNameInUOSayAllSchemesData(iSchemeChoice)
		let bWereCustomSettingsLoaded = true
		let GDocumentSayAllScheme = sScheme
		IniWriteString(section_options,hKey_SayAllScheme, sScheme, gStrFileName, true)
	EndIf
endIf
return CustomSayAllSchemeTextOutput(sScheme)
EndFunction

string function CustomToggleSayAllOnDocumentLoad(int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption(OPT_SAYALL_ON_DOCUMENT_LOAD)
If !iRetCurVal then
	let iSetting = !iSetting
	Let bWereCustomSettingsLoaded = TRUE
	SetJcfOption(OPT_SAYALL_ON_DOCUMENT_LOAD,iSetting)
	WriteCustomOption(OPT_SAYALL_ON_DOCUMENT_LOAD,iSetting)
EndIf
if iSetting then
	return cmsg_on
else
	return cmsg_off
EndIf
EndFunction

string function CustomToggleSayAllOnDocumentLoadHlp()
return FormatString(msgCustomUO_SayAllOnDocumentLoadHlp)
EndFunction

string Function CustomNavigationQuickKeysMode (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (opt_quick_key_navigation_mode)
If ! iRetCurVal then
	;Update it
	If iOption == 1 then
		Let iOption = 0
	ElIf iOption == 0 then;Special case
		Let iOption = 2
	ElIf iOption == 2 then
		Let iOption = 1
	EndIf
	SetJcfOption (opt_quick_key_navigation_mode,iOption)
	WriteCustomOption (opt_quick_key_navigation_mode,iOption)
EndIf
If iOption == 0 then
	Return cmsg_off
ElIf iOption == 1 then
	Return cmsg_on
ElIf iOption == 2 then
	Return cMsgSayAllOnly
EndIf
EndFunction

string Function UOCustomNavigationQuickKeysSet (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (opt_quick_key_navigation_mode)
If ! iRetCurVal then
	;Update it
	If iOption == 1 then
		Let iOption = 0
	ElIf iOption == 0 then;Special case
		Let iOption = 2
	ElIf iOption == 2 then
		Let iOption = 1
	EndIf
	SetJcfOption (opt_quick_key_navigation_mode,iOption)
	WriteCustomOption (opt_quick_key_navigation_mode,iOption)
EndIf
If iOption == 0 then
	Return cmsg_off
ElIf iOption == 1 then
	Return cmsg_on
ElIf iOption == 2 then
	Return cMsgSayAllOnly
EndIf
EndFunction

string Function UOCustomNavigationQuickKeysSetHlp()
Return NavigationQuickKeysSetHlp()
EndFunction

string Function CustomFlashOnWebPagesToggle (int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption (optEmbeddedActiveXSupport)
If ! iRetCurVal then
	;Update it
	Let iSetting = ! iSetting
	SetJcfOption (optEmbeddedActiveXSupport, iSetting)
	WriteCustomOption (optEmbeddedActiveXSupport, iSetting)
EndIf
If iSetting then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string Function UOCustomFlashMoviesRecognize (int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption (optEmbeddedActiveXSupport)
If ! iRetCurVal then
	;Update it
	Let iSetting = ! iSetting
	SetJcfOption (optEmbeddedActiveXSupport, iSetting)
	WriteCustomOption (optEmbeddedActiveXSupport, iSetting)
EndIf
If iSetting then
	return msgUO_On
else
	return msgUO_Off
endIf
EndFunction

string Function UOCustomFlashMoviesRecognizeHlp()
Return FlashMoviesRecognizeHlp()
EndFunction

string function CustomIncrementMaxBlockLength (int iRetCurVal)
Var
int iBlockLength
let iBlockLength = DiscoverCorrectOption (optTextBlockLength)
if not iRetCurVal then
;update it
	If iBlockLength < 145 Then
		let iBlockLength = iBlockLength + 10
	Else
		let iBlockLength = 10
	endIf
	SetJCFOption (optTextBlockLength, iBlockLength)
	WriteCustomOption (optTextBlockLength, iBlockLength)
endIf
;now return the value
return FormatString (cmsg306_S, intToString(iBlockLength))
EndFunction

string Function CustomDecrementMaxBlockLength (int iRetCurVal)
Var
	int iBlockLength
let iBlockLength = DiscoverCorrectOption (optTextBlockLength)
if not iRetCurVal then
;update it
	If iBlockLength > 11 Then
		let iBlockLength = iBlockLength - 10
	Else
		let iBlockLength = 154
	endIf
	SetJCFOption (optTextBlockLength, iBlockLength)
	WriteCustomOption (optTextBlockLength, iBlockLength)
endIf
;now return the value
return FormatString (cmsg306_S, intToString(iBlockLength))
EndFunction

string function CustomIdentifyLinkTypeToggle (int iRetCurVal)
var
	int iAnnounceLinkType
let iAnnounceLinkType = DiscoverCorrectOption (optIdentifyLinkType)
if not iRetCurVal then
;update it
	let iAnnounceLinkType =not iAnnounceLinkType
	SetJCFOption (optIdentifyLinkType, iAnnounceLinkType)
	WriteCustomOption (optIdentifyLinkType, iAnnounceLinkType)
endIf
;now return the value
If iAnnounceLinkType  then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string function UOCustomLinksIdentifyType (int iRetCurVal)
var
	int iAnnounceLinkType
let iAnnounceLinkType = DiscoverCorrectOption (optIdentifyLinkType)
if not iRetCurVal then
;update it
	let iAnnounceLinkType =not iAnnounceLinkType
	SetJCFOption (optIdentifyLinkType, iAnnounceLinkType)
	WriteCustomOption (optIdentifyLinkType, iAnnounceLinkType)
endIf
;now return the value
If iAnnounceLinkType  then
	return msgUO_On
else
	return msgUO_Off
endIf
EndFunction

string function UOCustomLinksIdentifyTypeHlp()
Return vCursorLinksIdentifyTypeHlp()
EndFunction

string function CustomIdentifySamePageLinksToggle (int iRetCurVal)
var
	int iSamePage
let iSamePage = DiscoverCorrectOption (optIdentifySamePageLinks)
if not iRetCurVal then
	let iSamePage = !iSamePage
	SetJCFOption (optIdentifySamePageLinks, iSamePage)
	WriteCustomOption (optIdentifySamePageLinks, iSamePage)
endIf
;now return the value
If iSamePage  then
	return cmsg_on
Else
	return cmsg_off
endIf
EndFunction

string function UOCustomLinksIdentifySamePage (int iRetCurVal)
var
	int iSamePage
let iSamePage = DiscoverCorrectOption (optIdentifySamePageLinks)
if not iRetCurVal then
;update it
	let iSamePage=not iSamePage
	SetJCFOption (optIdentifySamePageLinks, iSamePage)
	WriteCustomOption (optIdentifySamePageLinks, iSamePage)
endIf
;now return the value
If iSamePage  then
	return msgUO_On
Else
	return msgUO_Off
endIf
EndFunction

string function UOCustomLinksIdentifySamePageHlp()
Return vCursorLinksIdentifySamePageHlp()
EndFunction

string function CustomToggleFormsModeAutoOff(int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optFormsModeAutoOff)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optFormsModeAutoOff, iOption)
	SetJcfOption (optFormsModeAutoOff,iOption)
EndIf
If iOption then
	Return cmsgFormsModeAutoOffEnabled
Else
	Return cmsgFormsModeAutoOffDisabled
EndIf
EndFunction

string function UOCustomFormsModeAutoOff (int iRetCurVal)
var
	int iFormsModeAutoOffOption,
	int iAutoFormsModeSetting
Let iAutoFormsModeSetting = DiscoverCorrectOption(OPT_AUTO_FORMS_MODE)
Let iFormsModeAutoOffOption = DiscoverCorrectOption (optFormsModeAutoOff)
If !iRetCurVal then
	if !iAutoFormsModeSetting then
		Let iFormsModeAutoOffOption = !iFormsModeAutoOffOption
		Let bWereCustomSettingsLoaded = TRUE
		WriteCustomOption(optFormsModeAutoOff, iFormsModeAutoOffOption)
		SetJcfOption (optFormsModeAutoOff,iFormsModeAutoOffOption)
	EndIf
EndIf
if iAutoFormsModeSetting then
	return cMsgNotAvailable
elif iFormsModeAutoOffOption then
	Return cmsgFormsModeAutoOffEnabled
Else
	Return cmsgFormsModeAutoOffDisabled
EndIf
EndFunction

string function UOCustomFormsModeAutoOffHlp()
if DiscoverCorrectOption(OPT_AUTO_FORMS_MODE) then
	Return FormatString(msgUO_vCursorFormsModeAutoOffUnavailableHlp)
EndIf
Return FormatString(msgUO_vCursorFormsModeAutoOffHlp)
EndFunction

string function CustomCustomPageSummary(int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (OPT_CUSTOM_PAGE_SUMMARY)
If ! iRetCurVal then
	;Update it
	if iOption < CPSVirtualize then
		let iOption=iOption+1
	else
		let iOption=CPSOff
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (OPT_CUSTOM_PAGE_SUMMARY, iOption)
	SetJcfOption (OPT_CUSTOM_PAGE_SUMMARY,iOption)
EndIf
If iOption==CPSOff then
	Return cmsg_off ;CPSOff
elif iOption==CPSSpeak then
	return cmsgCPSSpeak
else
	Return cmsgCPSVirtualize
EndIf
EndFunction

string function UOCustomCustomPageSummary (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (OPT_CUSTOM_PAGE_SUMMARY)
If ! iRetCurVal then
	;Update it
	if iOption < CPSVirtualize then
		let iOption=iOption+1
	else
		let iOption=CPSOff
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (OPT_CUSTOM_PAGE_SUMMARY, iOption)
	SetJcfOption (OPT_CUSTOM_PAGE_SUMMARY,iOption)
EndIf
If iOption==CPSOff then
	Return msgUO_Off ;CPSOff
elif iOption==CPSSpeak then
	return cmsgCPSSpeak
else
	Return cmsgCPSVirtualize
EndIf
EndFunction

string function UOCustomCustomPageSummaryHlp()
Return vCursorCustomPageSummaryHlp()
EndFunction

String Function CustomToggleVirtualCursor (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (OPT_VIRTUAL_PC_CURSOR)
If ! iRetCurVal then
	;Update it
	Let iOption = ! iOption;Toggle
	Let bWereCustomSettingsLoaded = TRUE
		WriteCustomOption (OPT_VIRTUAL_PC_CURSOR, iOption)
	SetJCFOption (OPT_VIRTUAL_PC_CURSOR, iOption)
EndIf
;Now return the value
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

String Function UOCustomVirtualCursorSet (int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (OPT_VIRTUAL_PC_CURSOR)
If ! iRetCurVal then
	;Update it
	Let iOption = ! iOption;Toggle
	Let bWereCustomSettingsLoaded = TRUE
		WriteCustomOption (OPT_VIRTUAL_PC_CURSOR, iOption)
	SetJCFOption (OPT_VIRTUAL_PC_CURSOR, iOption)
EndIf
;Now return the value
If iOption then
	Return msgUO_On
Else
	Return msgUO_Off
EndIf
EndFunction

String Function UOCustomVirtualCursorSetHlp()
Return FormatString(msgUO_CustomVirtualCursorSetHlp)
EndFunction

string function CustomStyleSheetProcessing(int iRetCurVal)
var
	int iOption
Let iOption = DiscoverCorrectOption (optStyleSheetProcessing)
If ! iRetCurVal then
	;Update it
	if iOption < StyleSheetsProcessImported then
		let iOption=iOption+1
	else
		let iOption=StyleSheetsIgnore
	endIf
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (optStyleSheetProcessing, iOption)
	SetJcfOption (optStyleSheetProcessing,iOption)
EndIf
If iOption==StyleSheetsIgnore then
	Return cmsgStyleSheetsIgnore
elif iOption==StyleSheetsProcessTopLevel then
	return cmsgStyleSheetsTopLevel
else
	Return cmsgStyleSheetsProcessImported
EndIf
EndFunction

string Function CustomDocumentPresentationModeToggle(int iRetCurVal)
var
	int iSetting
if IsMAGicRunning() then
	return cMsgNotAvailable
EndIf
Let iSetting = DiscoverCorrectOption (optHTMLDocumentPresentationMode)
If ! iRetCurVal then
	;Update it
	Let iSetting = ! iSetting
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption(optHTMLDocumentPresentationMode, iSetting)
	SetJcfOption(optHTMLDocumentPresentationMode, iSetting)
EndIf
If iSetting then
	return cmsgDocumentPresentationModeOn_l
else
	return cmsgDocumentPresentationModeOff_l
endIf
EndFunction

string Function UOCustomDocumentPresentationSet (int iRetCurVal)
var
	int iSetting
if IsMAGicRunning() then
	return msgUO_Unavailable
EndIf
Let iSetting = DiscoverCorrectOption (optHTMLDocumentPresentationMode)
If ! iRetCurVal then
	;Update it
	Let iSetting = ! iSetting
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption(optHTMLDocumentPresentationMode, iSetting)
	SetJcfOption(optHTMLDocumentPresentationMode, iSetting)
EndIf
If iSetting then
	return cmsgDocumentPresentationModeOn_l
else
	return cmsgDocumentPresentationModeOff_l
endIf
EndFunction

string Function UOCustomDocumentPresentationSetHlp()
return DocumentPresentationSetHlp()
EndFunction

string function GetCustomDocumentPresentationInfo (string settingID)
var
	int nSelectIndex = DiscoverCorrectOption (optHTMLDocumentPresentationMode),
	int bDisabled = GetJCFOption (optSmartNavigation) > 0,
	stringArray szListItems,
	int nSize = 2
szListItems = new stringArray[nSize]
szListItems[1] = cmsgDocumentPresentationModeOff_L; Simple layout
szListItems[2] = cmsgDocumentPresentationModeOn_L ; Screen Layout
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize, bDisabled)
endFunction

void function SetCustomDocumentPresentationInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int iSelection
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
SetJCFOption (optHTMLDocumentPresentationMode, iSelection)
WriteCustomOption (optHTMLDocumentPresentationMode, iSelection)
endFunction

string Function CustomEnhancedClipboardToggle (int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption (OPT_VPC_ENHANCED_CLIPBOARD)
If ! iRetCurVal then
	let iSetting = !iSetting
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (OPT_VPC_ENHANCED_CLIPBOARD, iSetting)
	SetJCFOption (OPT_VPC_ENHANCED_CLIPBOARD, iSetting)
EndIf
If iSetting then
	Return msgUO_FullContent_Visual
Else
	Return msgUO_Virtual_Cursor
EndIf
EndFunction

string Function UOCustomEnhancedClipboard (int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption (OPT_VPC_ENHANCED_CLIPBOARD)
If ! iRetCurVal then
	let iSetting = !iSetting
	Let bWereCustomSettingsLoaded = TRUE
	SetJCFOption (OPT_VPC_ENHANCED_CLIPBOARD, iSetting)
	WriteCustomOption (OPT_VPC_ENHANCED_CLIPBOARD, iSetting)
EndIf
if iSetting then
	Return msgUO_FullContent_Visual
Else
	Return msgUO_Virtual_Cursor
EndIf
EndFunction

string Function UOCustomEnhancedClipboardHlp()
Return vCursorEnhancedClipboardHlp()
EndFunction

string Function UOCustomAutoFormsMode(int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption(OPT_AUTO_FORMS_MODE)
If !iRetCurVal then
	Let iSetting = !iSetting
	Let bWereCustomSettingsLoaded = TRUE
	SetJCFOption(OPT_AUTO_FORMS_MODE, iSetting)
	WriteCustomOption(OPT_AUTO_FORMS_MODE, iSetting)
EndIf
If iSetting then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string function UOCustomAutoFormsModeHlp()
return vCursorAutoFormsModeHlp()
EndFunction

string function UOCustomNavQuickKeyDelay(int iRetCurVal)
var
	int iThresholdSetting,
	int iWhole,
	int iFraction
if !DiscoverCorrectOption(OPT_AUTO_FORMS_MODE) then
	return msgUO_Unavailable
EndIf
let iThresholdSetting = DiscoverCorrectOption(OPT_AUTOFORMSMODE_THRESHOLD)
If !iRetCurVal then
	if iThresholdSetting == 5000 then
		let iThresholdSetting = -1
	ElIf iThresholdSetting == -1 then
		let iThresholdSetting = 500
	ElIf iThresholdSetting >= 500 && iThresholdSetting < 2000 then
		let iThresholdSetting = iThresholdSetting+500
	else
		let iThresholdSetting = iThresholdSetting+1000
	EndIf
	Let bWereCustomSettingsLoaded = TRUE
	SetJCFOption(OPT_AUTOFORMSMODE_THRESHOLD, iThresholdSetting)
	WriteCustomOption(OPT_AUTOFORMSMODE_THRESHOLD,iThresholdSetting)
EndIf
if iThresholdSetting == -1 then
	Return msgNavQuickKeyThresholdNever
Else
	let iWhole = iThresholdSetting/1000
	let iFraction = iThresholdSetting%1000
	if iFraction then
		Return FormatString(msgNavQuickKeyThresholdWithFraction,IntToString(iWhole),IntToString(iFraction/100))
	else
		if iWhole == 1 then
			Return FormatString(msgNavQuickKeyThresholdSingle,IntToString(iWhole))
		else
			Return FormatString(msgNavQuickKeyThresholdWhole,IntToString(iWhole))
		EndIf
	EndIf
EndIf
EndFunction

string function getCustomQuickNavigationKeyDelayInfo (string settingID)
var
	int nSelectIndex,
	stringArray szListItems,
	int nSize
if ! DiscoverCorrectOption (OPT_AUTO_FORMS_MODE) then
	nSize = 1
	szListItems = new stringArray[nSize]
	szListItems[1] = cMsgNotAvailable
else
	nSize = 8
	szListItems = new stringArray[nSize]
	szListItems = getNavQuickKeyDelayInfoList ()
	nSelectIndex = getNavQuickKeyDelayIndexFromSetting (DiscoverCorrectOption (OPT_AUTOFORMSMODE_THRESHOLD))
endIf
return QsxmlMakeList (settingID, nSelectIndex, szListItems, nSize)
endFunction

void function setCustomQuickNavigationKeyDelayInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iSelection,
	int iSetting
if ! getJcfOption (OPT_AUTO_FORMS_MODE) then
	return ; Not available
endIf
parseXMLListWriteRequest (sxmlWriteRequest, iSelection)
iSetting = getNavQuickKeyDelayJCFFromIndex (iSelection)
Let bWereCustomSettingsLoaded = TRUE
WriteCustomOption(OPT_AUTOFORMSMODE_THRESHOLD, iSetting)
endFunction

string function UOCustomNavQuickKeyDelayHlp()
if !DiscoverCorrectOption(OPT_AUTO_FORMS_MODE) then
	return FormatString(msgUO_vCursorNavQuickKeyDelayUnavailableHlp)
EndIf
return FormatString(msgUO_vCursorNavQuickKeyDelayHlp)
EndFunction

string Function CustomReadOnlyState (int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption (OPT_SUPPRESS_READ_ONLY_STATE_INDICATION)
If !iRetCurVal then
	Let iSetting = ! iSetting;
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (OPT_SUPPRESS_READ_ONLY_STATE_INDICATION, iSetting)
	SetJcfOption (OPT_SUPPRESS_READ_ONLY_STATE_INDICATION, iSetting)
EndIf
return vCursorReadOnlyStateTextOutput(iSetting)
EndFunction

string Function CustomReadOnlyStateHlp()
Return vCursorReadOnlyStateHlp()
EndFunction

string Function CustomVirtualDocumentLinkActivationMethod(int iRetCurVal)
var
	int iSetting
Let iSetting = DiscoverCorrectOption (OPT_VIRTUAL_DOCUMENT_LINK_ACTIVATION_METHOD)
If !iRetCurVal then
	Let iSetting = ! iSetting;
	Let bWereCustomSettingsLoaded = TRUE
	WriteCustomOption (OPT_VIRTUAL_DOCUMENT_LINK_ACTIVATION_METHOD, iSetting)
	SetJcfOption (OPT_VIRTUAL_DOCUMENT_LINK_ACTIVATION_METHOD, iSetting)
EndIf
return vCursorVirtualDocumentLinkActivationMethodTextOutput(iSetting)
EndFunction

string Function CustomVirtualDocumentLinkActivationMethodHlp()
Return vCursorVirtualDocumentLinkActivationMethodHlp()
EndFunction

Script PersonalizeSettingsByListBox ()
var
	string strDlgName,
	string strPersonalizeList
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
If DialogActive () ||
MenusActive () Then
	SayFormattedMessage (OT_ERROR, msgPersonalizedSettingsNotAvailable)
	Return;
EndIf
SetUpStuffForNewPage (TRUE)
Let strDlgName = FormatString (WNPersonalSettings, 	gStrAddress)
let strPersonalizeList=jvCustomClearAllSettings
if HasVirtualEnhancedClipboard() then
	let strPersonalizeList = strPersonalizeList+ jvCustomEnhancedClipboard
EndIf
let strPersonalizeList = strPersonalizeList
	+ UO_CustomReadOnlyState
	+ jvCustomToggleVirtualCursor
	+ jvCustomNavigationQuickKeysMode
	+ jvCustomDocumentPresentationModeToggle
	+ jvCustomIncludeGraphicsToggle
	+ jvCustomGraphicReadingVerbosityToggle
	+ jvCustomIncludeLinksToggle
	+ jvCustomGraphicsLinkLastResortToggle
	+ jvCustomIncludeImageMapLinksToggle
	+ jvCustomTextLinkVerbosityToggle
	+ jvCustomIdentifyLinkTypeToggle
	+ jvCustomIdentifySamePageLinksToggle
	+ jvCustomButtonTextVerbosityToggle
	+ jvCustomExpandAbbreviationsVerbosityToggle
	+ jvCustomExpandAcronymsVerbosityToggle
;	+ jvCustomToggleUseVirtualInfoInFormsMode
	+ jvCustomToggleFormsModeAutoOff
	+ jvCustomToggleLanguageDetection
	+ jvCustomFormFieldPromptsRenderingToggle
	+ jvCustomFrameIndicationToggle
	+ jvCustomToggleIgnoreInlineFrames
	+ jvCustomScreenFollowsVCursorToggle
	+ jvCustomSkipPastRepeatedTextToggle
;The following four aren't in Verbosity anymore, so should not be in Personalized Settings either.
;These are not page-specific but general options to set once:
;	+ jvCustomIncrementMaxLineLength
;	+ jvCustomDecrementMaxLineLength
;	+ jvCustomIncrementMaxBlockLength
;	+ jvCustomDecrementMaxBlockLength
	+ jvCustomIndicateBlockQuotes
	+ jvCustomIndicateLists
	+ jvCustomElementAttributeAnnounce
	+ jvCustomIndicateTablesToggle
	+ jvCustomDetectTables
	+ jvCustomIndicateHeadingsToggle
	+ jvCustomFlashOnWebPagesToggle
;	+ jvCustomRefreshActiveContent
	+ jvCustomRefreshHTML
	+jvAnnounceLiveRegionUpdates
	+ jvCustomCustomPageSummary
;	+ jvCustomStyleSheetProcessing
    + UO_CustomVirtualDocumentLinkActivationMethod
dlgSelectFunctionToRun (strPersonalizeList, strDlgName, FALSE)
EndScript

void function PersonalizeSettings (string AdditionalItemsList)
var
	string strDlgName,
	string sNodeName,
	string sMiniList,
	string strPersonalizeList
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
If DialogActive ()
|| MenusActive () Then
	SayMessage(OT_ERROR, msgPersonalizedSettingsNotAvailable)
	Return
EndIf
SetUpStuffForNewPage (TRUE)
Let strDlgName = FormatString (WNPersonalSettings, 	gStrAddress)
;level 0 options:
let strPersonalizeList = UO_CustomClearAllSettings+_DLG_SEPARATOR
if AdditionalItemsList then
	if SubString(AdditionalItemsList,1,1) == _DLG_SEPARATOR then
		let AdditionalItemsList = StringChopLeft(AdditionalItemsList,1)
	EndIf
	if SubString(AdditionalItemsList,StringLength(AdditionalItemsList),1) != _DLG_SEPARATOR then
		let AdditionalItemsList = AdditionalItemsList+_DLG_SEPARATOR
	EndIf
	let strPersonalizeList = strPersonalizeList+AdditionalItemsList
EndIf
if HasVirtualEnhancedClipboard() then
	Let sMiniList = UO_CustomEnhancedClipboard+_DLG_SEPARATOR
EndIf
Let sMiniList = sMiniList+
	UO_CustomReadOnlyState+_DLG_SEPARATOR
ConvertListToNodeList (sMiniList, sNodeName)
Let strPersonalizeList = strPersonalizeList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
; Forms Options:
Let sNodeName = NODE_VCURSOR_FORMS
Let sMiniList =
	uo_CustomAutoFormsMode +_DLG_SEPARATOR+
	uo_CustomNavQuickKeyDelay+_DLG_SEPARATOR+
	UO_CustomButtonsShowUsing+_DLG_SEPARATOR+
	UO_CustomFormFieldsIdentifyPromptUsing+_DLG_SEPARATOR+
	UO_CustomFormsModeAutoOff+_DLG_SEPARATOR
ConvertListToNodeList (sMiniList, sNodeName)
Let strPersonalizeList = strPersonalizeList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
;general Options:
Let sNodeName = NODE_GENERAL;
Let sMiniList = UO_CustomVirtualCursorSet+_DLG_SEPARATOR
if IsSayAllOnDocumentLoadSupported() then
	Let sMiniList = uo_CustomSayAllOnDocumentLoad+_DLG_SEPARATOR+sMiniList
EndIf
Let sMiniList = sMiniList+
	UO_CustomNavigationQuickKeysSet+_DLG_SEPARATOR+
	UO_CustomDocumentPresentationSet+_DLG_SEPARATOR+
	UO_CustomLanguageDetectChange+_DLG_SEPARATOR+
	UO_CustomAttributesIndicate+_DLG_SEPARATOR+
	UO_CustomCustomPageSummary+_DLG_SEPARATOR+
	UO_CustomFlashMoviesRecognize+_DLG_SEPARATOR+
	UO_CustomPageRefresh+_DLG_SEPARATOR+
	UO_CustomAnnounceLiveRegionUpdates+_DLG_SEPARATOR+
	UO_CustomSayAllScheme +_DLG_SEPARATOR +
	UO_CustomVirtualDocumentLinkActivationMethod +_DLG_SEPARATOR
ConvertListToNodeList (sMiniList, sNodeName)
Let strPersonalizeList = strPersonalizeList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
;Text Options:
Let sNodeName = NODE_VCURSOR_TEXT
Let sMiniList =
	UO_CustomAbbreviationsExpand+_DLG_SEPARATOR+
	UO_CustomAcronymsExpand+_DLG_SEPARATOR+
	UO_CustomRepeatedTextSkip+_DLG_SEPARATOR+
	UO_CustomBlockQuotesIdentifyStartAndEnd+_DLG_SEPARATOR+
	UO_CustomScreenTrack+_DLG_SEPARATOR
ConvertListToNodeList (sMiniList, sNodeName)
Let strPersonalizeList = strPersonalizeList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
; Graphics Options:
Let sNodeName = NODE_VCURSOR_GRAPHICS
Let sMiniList =
	UO_CustomGraphicsShow+_DLG_SEPARATOR+
	UO_CustomGraphicsSetRecognition+_DLG_SEPARATOR
ConvertListToNodeList (sMiniList, sNodeName)
Let strPersonalizeList = strPersonalizeList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
;Links Options:
Let SnodeName = NODE_VCURSOR_LINKS
Let sMiniList =
	UO_CustomFilterConsecutiveDuplicateLinks+_DLG_SEPARATOR+
	UO_CustomGraphicalLinksSet+_DLG_SEPARATOR+
	UO_CustomUntaggedGraphicalLinkShow+_DLG_SEPARATOR+
	UO_CustomImageMapLinksShow+_DLG_SEPARATOR+
	UO_CustomTextLinksShow+_DLG_SEPARATOR+
	UO_CustomLinksIdentifyType+_DLG_SEPARATOR+
	UO_CustomLinksIdentifySamePage+_DLG_SEPARATOR
ConvertListToNodeList (sMiniList, sNodeName)
Let strPersonalizeList = strPersonalizeList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
;Heading and Frame Options:
Let sNodeName = NODE_VCURSOR_HEADINGS_FRAMES
Let sMiniList =
	UO_CustomFramesShowStartAndEnd+_DLG_SEPARATOR+
	UO_CustomInlineFramesShow+_DLG_SEPARATOR+
	UO_CustomHeadingsAnnounce+_DLG_SEPARATOR
ConvertListToNodeList (sMiniList, sNodeName)
Let strPersonalizeList = strPersonalizeList+sMiniList;
Let sNodeName = Null()
Let sMiniList = Null()
;List and Table Options:
Let sNodeName = NODE_VCURSOR_LISTS_TABLES
Let sMiniList =
	UO_CustomListsIdentifyStartAndEnd+_DLG_SEPARATOR+
	UO_CustomTablesShowStartAndEnd+_DLG_SEPARATOR+
	UO_CustomLayoutTables+_DLG_SEPARATOR+
	UO_CustomTableTitlesAnnounce+_DLG_SEPARATOR
ConvertListToNodeList (sMiniList, sNodeName)
Let strPersonalizeList = strPersonalizeList+sMiniList;
Let sMiniList = Null()
Let gbVerbosityOptionSet = FALSE;
dlgSelectTreeFunctionToRun (strPersonalizeList, strDlgName, FALSE)
EndFunction

string function QuickSettingDisabledEvent (string settingID)
if settingID == "DocumentSettings" then
	return qsxmlMakeDisabledSetting  (settingID, isVirtualPcCursor () || IsFormsModeActive())
endIf
return QuickSettingDisabledEvent (settingID)
endFunction

int function GetNavigationQuickKeysSettingFromFile ()
var int nSetting = ReadSettingInteger (GetIniSectionName (OPT_QUICK_KEY_NAVIGATION_MODE), HKEY_quick_key_navigation_mode, -1, FT_JSI, wdUser, gStrFileName)
if bWereCustomSettingsLoaded && nSetting >= 0 then
	return nSetting
else
	return GetNavigationQuickKeysSettingFromFile ()
endIf
endFunction

void function SetNavigationQuickKeysState (int nState)
if bWereCustomSettingsLoaded then
	writeSettingInteger (GetIniSectionName (OPT_QUICK_KEY_NAVIGATION_MODE), HKEY_quick_key_navigation_mode, nState, FT_JSI, wdUser, gStrFileName)
else
	SetNavigationQuickKeysState (nState)
endIf
endFunction

Script AdjustJAWSVerbosity ()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
;For SetUpStuffForNewPage function:
Let gbVerbosityOptionSet = TRUE;
PerformScript AdjustJAWSVerbosity ()
InitializeGlobalsWithSettingsFromJCF ()
SetJCFOptionsWithGlobals()
EndScript

Script AdjustJAWSOptions ()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
;For SetUpStuffForNewPage function:
Let gbVerbosityOptionSet = TRUE;
PerformScript AdjustJAWSOptions ()
InitializeGlobalsWithSettingsFromJCF()
SetJCFOptionsWithGlobals()
EndScript

string function getCustomNavigationQuickKeysInfo (string settingID, int nReadSource)
var
	int nSelectIndex = DiscoverCorrectOption (opt_quick_key_navigation_mode),
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

void function setCustomNavigationQuickKeysInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
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
WriteCustomOption (opt_quick_key_navigation_mode, iSetting)
gIQuickKeys = iSetting
endFunction

string function getVirtualCursorVerbosityLevelInfo(string settingID, int nReadSource)
var
	int iVerbosityLevel = getJCFOption (optVirtualCursorVerbosityLevel), 	
	stringArray listItems,
	int size = 3
listItems = new stringArray[size]
listItems[1] = cmsgVirtualCursorVerbosityLevelLow
listItems[2] = cmsgVirtualCursorVerbosityLevelMedium
listItems[3] = cmsgVirtualCursorVerbosityLevelHigh
iVerbosityLevel = DiscoverCorrectOption (optVirtualCursorVerbosityLevel)
return QsxmlMakeList (settingID, iVerbosityLevel, listItems, size)
endFunction

void function setVirtualCursorVerbosityLevelInfo(string settingID, string sXmlWriteRequest, int nWriteDestination)
var
	int iVerbosityLevel
parseXMLListWriteRequest (sxmlWriteRequest, iVerbosityLevel)
WriteCustomOption(optVirtualCursorVerbosityLevel, iVerbosityLevel)
SetJCFOption (optVirtualCursorVerbosityLevel, iVerbosityLevel)
GIVirtualCursorVerbosityLevel  = iVerbosityLevel
EndFunction

string function getVCVElementDescriptionInfo(string settingID)
var int state = GetVCVItemState(VCVO_ElementDescription)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (state))
endFunction

string function SetVCVElementDescriptionInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
;ToggleVCVItemState toggles the state and saves it,
;to a domain jcf file if one exists,
;otherwise it is saved to the application jcf.
return ToggleVCVItemState(VCVO_ElementDescription)
endFunction

string function getCustomAllowWebAppReservedKeystrokesInfo (string SettingID, int nReadSource)
var
	int iOption = DiscoverCorrectOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (iOption))
endFunction

void function setCustomAllowWebAppReservedKeystrokesInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int Setting
parseXMLBooleanWriteRequest (sxmlWriteRequest, Setting)
WriteCustomOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES, Setting)
SetJcfOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES, Setting)
giWebAppReservedKeys = Setting
endFunction

string function getCustomDocumentAutomaticallyReadsInfo (string settingID)
var
	int iOption = DiscoverCorrectOption (OPT_SAYALL_ON_DOCUMENT_LOAD)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (iOption))
endFunction

void function setCustomDocumentAutomaticallyReadsInfo (string settingID, string sXmlWriteRequest, int nWriteDestination)
var int setting
parseXMLBooleanWriteRequest (sxmlWriteRequest, setting)
gbDefaultSayAllOnDocumentLoad = setting
setJCFOption(OPT_SAYALL_ON_DOCUMENT_LOAD, setting)
WriteCustomOption (OPT_SAYALL_ON_DOCUMENT_LOAD, Setting)
endfunction

string function GetCustomJAWSDeterminesLayoutTable(string SettingID, int nReadSource)
var
	int iOption = DiscoverCorrectOption (optJAWSDeterminesLayoutTable)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (iOption))
endFunction

void function SetCustomJAWSDeterminesLayoutTable(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int Setting
parseXMLBooleanWriteRequest (sxmlWriteRequest, Setting)
WriteCustomOption (optJAWSDeterminesLayoutTable, Setting)
SetJcfOption (optJAWSDeterminesLayoutTable, Setting)
endFunction
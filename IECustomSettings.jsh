; Copyright 1995-2015 by Freedom Scientific, Inc.

CONST
;None of these SC constants should be translated.
	scURL1="://",
	scURL2="www",;Leave off period because of www2, www3, etc.
	scDomainEnd="/",
	scDomainToExclude = "about:", ;These are always excluded as they are not actually on the net
	scAboutProtocol = "about",
	scFilePath = "\\PersonalizedSettings\\",
	scFileURI = "file://",
;Increment this as you add keys, constants, etc to your file
	KEY_MAX_LIMIT = 33,
;This is the default dummy value if a custom option isn't set.
	scDefaultVal = "Pagamimi",
	SEC_HTML = "HTML",
	SEC_FormsMode = "FormsMode",
;Custom keys:
	HKEY_VPC_ENHANCED_CLIPBOARD = "EnhancedClipboard",
	HKEY_quick_key_navigation_mode = "QuickKeys",
	HKEY_Document_Presentation_Mode = "DocumentPresentationMode",
	HKEY_List = "Lists",
	HKEY_TableDetect = "WhichTable",;For all or data only.
	HKEY_GraphicLastResort = "GraphicLastResort",
	HKEY_ImageMaps = "ImageMapLinks",
	HKEY_IgnoreFramesWithAds = "InlineFrames",
	HKEY_SamePageIdentify = "SamePageIdentify",
	HKEY_FormVirtual="VirtualFormPrompts",
	HKEY_LANGUAGE_DETECT = "DetectLanguage",
	HKEY_FlashShow = "ShowFlash",
	HKEY_FLASH = "flsh",
	HKEY_HTML = "pg",
	HKEY_ANNOUNCE_LIVE_REGION_UPDATES = "AnnounceLiveRegionUpdates",
	HKEY_optIndicateElementAttributes = "ElementAttribAnnounce",
	HKEY_optFormsModeAutoOff="FormsModeAutoOff",
	HKEY_OPT_CUSTOM_PAGE_SUMMARY="CustomPageSummary",
	HKEY_OPT_VIRTUAL_CURSOR = "VirtualCursor",
	HKEY_OPT_STYLE_SHEET_PROCESSING= "StyleSheetProcessing",
	HKEY_OPT_SUPPRESS_READ_ONLY_STATE_INDICATION = "ReadOnlyState",
	HKEY_PseudoOpt_Table_Titles_Announcement = "TableTitlesAnnounce",
	hKey_PseudoOpt_SayAllOnDocumentLoad = "SayAllOnDocumentLoad",
	hKey_VirtualVerbosityLevel = "VirtualCursorVerbosityLevel",
	hKey_JAWSDeterminesLayoutTable = "JAWSDeterminesLayoutTable",
	HKEY_IndicateInsAndDelInVirtualDocs= "IndicateInsAndDelInVirtualDocs",
;pseudo JCF opt constants:
	PseudoOpt_TableTitlesAnnounce = 9001,
; page refresh default 60 seconds 60000 miliseconds as set in Settings Center
	PageRefreshDefaultValue = 60000

GLOBALS
;The following address string and app handles are for determining when a new page loads:
	string GStrAddress,
	string GStrPriorAddress,
	handle ghWndHTMLApp,
	handle ghWndPrevHTMLApp,

	string GStrOptions,
	string gStrFileName,
	int bWereCustomSettingsLoaded,;Set to TRUE when we load from our custom file.
	int gINewPersonalSettings,;always TRUE if domain has changed.
	int GIBlockQuoteIndication,
	int GIListIndication,
	int GITableIndication,
	int GITableDetection,;For all or data only.
	int GIIncludeGraphics,
	int giFilterConsecutiveDuplicateLinks,
	int GIIncludeGraphicLinks,
	int GIGraphicLinksLastResort,
	int GIIncludeImageMapLinks,
	int GIFrameIndication,
	int GIIgnoreInlineFrames,
	int GISkipPastRpeatedText,
	int GILinkText,
	int GIHeadingIndication,
	int GIGraphicRendering,
	int GIButtonText,
	int giExpandAbbreviations,
	int giExpandAcronyms,
	int GIFormFieldPrompts,
	int gIFormVirtual,
	int GIAutoLanguageDetect,
	int GIFlash,
	int GIHtml,
	int gIAnnounceLiveRegionUpdates,
	int gIVTrack,
	int GiOptIndicateElementAttributes,
	int gIMaxLineLength,
	int gIQuickKeys,
	int gIDocumentPresentation,
	int gIShowFlash,
	int gITextBlockLength,
	int gISamePageLink,
	int gILinkType,
	int gIFormsModeAutoOff,
	int gICustomPageSummary,
	int gIVirtualCursor,
	int gIStyleSheetProcessing,
	int giEnhancedClipboard,
	int giReadOnlyState,
	int giAutoFormsMode,
	int giAutoFormsModeThreshhold,
	int giVirtualDocumentLinkActivationMethod,
	int giWebAppReservedKeys,
	int GIVirtualCursorVerbosityLevel,
int GIJAWSDeterminesLayoutTable,
int giIndicateINSAndDEL
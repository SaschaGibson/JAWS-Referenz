;Copyright 1998-2016 by Freedom Scientific BLV Group, LLC
;JAWS script header file for Microsoft Internet Explorer

Const
;IE nav constants:
	IENavForward = 1,
	IENavBack = 2,
	IENavHome = 3,
;application jcf filename:
	InternetExplorer_jcf = "Internet Explorer.jcf",
	strShellView = "Shell DocObject View",
	strFrame = "frame",
	strJavaApplet="SunAwtCanvas",
	strMainWindow="IEFrame",
;Identifier string used for param to function GetVersionInfoString:
	strGetVersionInfoString_ProductVersion = "ProductVersion",
; version
	ie3 = 0,
	ie4 = 1,
   	ie5 = 2,
;JSI file, section and key names:
	AppJSIFileName = "IE.jsi",
	JSIFile = "IE",
	hKey_InformationBarAnnounce = "InformationBarAnnounce",
	hKey_RSSFeedAvailabilityAnnouncement = "RSSFeedAvailabilityAnnouncement",
	hKey_HTMLFrameUpdateNotification = "HTMLFrameUpdateNotification",
; object class names:
	oc_TouchSwitch = "TouchSwitch",
	oc_TouchSlider = "TouchSlider",
; window classes
	ie4Class = "internet explorer_server",
	ie5Class = "internet explorer_server",
	ie3Class = "html_Internet Explorer",
	ieComboBoxClass="Internet Explorer_TridentCmbobx",
	ieListBoxClass="Internet Explorer_TridentLstBox",
;window classes:
	wc_IE_PopupMenuOwner = "IE_PopupMenuOwner",
	wc_AlternateModalTopMost = "Alternate Modal Top Most",
	wc_AddressDisplayControl = "AddressDisplay Control",
	wc_SunAWTCanvas = "SunAWTCanvas",
	wc_MMDEVAPI = "MMDEVAPI",
	wc_TabWindowClass = "TabWindowClass",
	wc_ReBarWindow32 = "ReBarWindow32",
	wc_toolbar = "ToolbarWindow32",
	wc_AcrobatClass = "AfxWnd42s",
	wc_JAWS = "JFWUI2",
	wcEdit1_L = "Edit",
	DialogClass = "#32771",
	IEFrameClass = "IEFrame",
	wc_treeview = "SysTreeView32",
	wc_syspager = "SysPager",
	wcComboBox = "ComboLBox",
	wcEdit = "Edit",
	wcShell = "Shell DocObject View",
	wc_AVL_AVView = "AVL_AVView",
	wc_ExploreWClass = "ExploreWClass",

;IE 11 on Windows 10, Options dialog fly out or popup dialogs:
	wc_Shell_Dialog = "Shell_Dialog",
	wc_Shell_Dim = "Shell_Dim",
	uiaClassName_FlyOutElement = "FlyOutElement",
	uiaAutomationID_Popup = "Popup",
	uiaClassName_RichText = "RichText",
	UIAAutomationID_ExecSimpleDialogContentElement = "ExecSimpleDialogContentElement",
	
;for the Web Conference Plugin app:
	wc_TalkComClass = "TalkComClass", ;app window class
	sAppName_WebConferencePlugin = "WebConferencePlugin.exe", ;name of the executable
;App owner executable name for IE:
	sAppName_IE = "IEFRAME.dll",

wn5 = "[",
wn6 = "]",

;for information bar announcement:
	id_InformationBar_IE6 = 10711,
	id_InformationBar_IE7 = 37425,
;for frame update notification:
	FrameUpdateNotification_Off = 0,
	FrameUpdateNotification_Indicate = 1,
	FrameUpdateNotification_MoveTo = 2,

; Control IDs
	id_Privacy_Settings_slider = 5334,
	address_bar4 = 41477,
	address_bar3 = 40962,
	tool_bar = 40960,
	Navigation_treeview = 100,
	ciLookIn = 1003,
;the settings buttons in IE7 Internet Options:
	id_TemporaryInternetFilesAndHistorySettings_button = 1490,
	id_SearchDefaultSettings_button = 5503,
	id_TabbedBrowsingSettings_button = 5505,
	id_PopUpBlockerSettings_button = 5401,
	id_AutoCompleteSettings_button = 321,
	id_FeedSettings_button = 771,
;The delete button in IE7 Internet Options:
	id_BrowsingHistoryDelete_button = 5501,
;Control id for the static text in the security dialog
	ciSecurityDialogText = 1032,
;for the IE toolbar dialog:
	BackButton = 1,
	ForwardButton = 2,
	StopButton = 3,
	RefreshButton = 4,
	HomeButton = 5,
	SearchButton = 6,
	FavoritesButton = 7,
	HistoryButton = 8,
	MailButton = 9,
	PrintButton = 10,
	EditButton = 11,
	ChannelsButton = 12,
	FullScreenButton = 13,
; Security Warning dialog names control ID's
ID_DlgText1 = 5011,
ID_DlgText2 = 5012,
ID_DlgText3 = 5013,
ID_AlwaysTrustCheckBox = 5020,
ID_AlwaysTrustText = 5015,
ID_YesBtn = 6,
ID_NoBtn = 7,

;settings for document load app-specific alert toggles:
	DocumentLoadAppAlert_Off = 0,
	DocumentLoadAppAlert_Speak = 1,
	DocumentLoadAppAlert_Virtualize = 2,
;flags to determine which alerts are being shown in the virtual viewer:
	flag_VirtualizedDocumentLoadAlert_None = 0,
	flag_VirtualizedDocumentLoadAlert_InformationBar = 1,
	flag_VirtualizedDocumentLoadAlert_RSSFeed = 2,

; Functions to suppress unknown function call
FuncSetGlobals = "setglobals"

Globals
;AutoComplete vars, web forms:
	int gbAutoComplete,
	string gstrAutoCompleteSelection,
	handle ghAutocomplete,
	int ieVersion,
	int nSuppressEcho,
	int isIEFirstTime,
	int gINoSpeakFormFields,
	string sPriorFrame,
	string sPriorHeading,
	int giTrustChkBx,
	string gsAlwaysTrustText,
	handle globalLastIEWindow,
	string GlobalDocumentName,
	string PrevDocumentName,
	int gbInformationBarAnnounce,
	int gbRSSFeedAvailabilityAnnounce,
	int gbAnnounceValueAfterIEPageChanged,
	int giRSSFeedHeadings,
	string gsMostRecentRSSFeedPage,
	string gsPriorRSSFeedPage ,
	int giVirtualizedDocumentLoadAlerts,
;for frame update notification:
	int giHTMLFrameUpdateNotification,
	int giReturnPositionFromFrameUpdate,
; Used for filtering ToolTips in IE8
	int iMouseXPrior,
	int iMouseYPrior

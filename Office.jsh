; Copyright 1995-2021 Freedom Scientific, Inc.
; JAWS header file for Office

CONST
;Application names for determining window owner:
;Comparison uses lower case, so use lowercase for the app name strings.
	WordAppDocumentArea = "wwlib", ;Specifically for the document area, other areas of Word do not have this as owner.
	WordApp = "winword.exe", ;for areas of Word outside the document area.
	OutlookApp = "outlook.exe",

;Used to prepend to app name for displaying version info
	scMicrosoft = "Microsoft",

;Object class names:
	class_OpusApp = "OpusApp",
	class_NetUICtrlNotifySink = "NetUICtrlNotifySink",
	class_NetUIRibbonTab = "NetUIRibbonTab",
	class_NetUIRibbonButton = "NetUIRibbonButton",
	Class_NetUIComboboxAnchor = "NetUIComboboxAnchor",
	class_NetUIOrderedGroup = "NetUIOrderedGroup",
	class_NetUIChunk = "NetUIChunk",
	class_NetUIPanViewer = "NetUIPanViewer",
	class_NetUITWBtnCheckMenuItem = "NetUITWBtnCheckMenuItem",

; Gallery button UIA ClassName:
	GalleryButtonClassName = "NetUIGalleryButton",
; some gallery buttons have a stray paragraph marker (Unicode symbol) at the beginning which we need to chop off:
	paragraphMarker = "¶",
;used with SelectionContextChangedEvent:
	Outlook_SelCtx_BeforeCaretMoveMask = 0x10280, ;selCtxTables|selCtxStyle|selCtxBorders
	Outlook_SelCtx_BeforeCaretMoveMask_MAGic = 0x80, ;selCtxFields
	Word_SelCtx_BeforeCaretMoveMask = 0x290290, ;selCtxTables|selCtxTableCell|selCtxPageSectionColumnBreaks|selCtxStyle|selCtxBorders|selCtxFormfields
	Word_SelCtx_BeforeCaretMoveMask_MAGic = 0x90, ;|selCtxFormFields
;for delimiting hot keys:
	scComma = ",",
;whitespace codes:
	scPageBreak="\12",
	scTab="\9",
	scLineFeed="\10",
	vbcr="\13",
;For EnumerateTypeAndTextStringsForWindow function:
	ABORT		0,
	CONTINUE		1,
;UIA object classes:
	oc_NetUIPropertyTextbox = "NetUIPropertyTextbox",
;window classes:
	wcNavigationBar = "AwesomeBar",
	wc_OfficeSplashScreen = "MsoSplash",
	wc_MsoCommandBarDock = "MsoCommandBarDock",
	WC_TASK_PANE_WINDOWS = "NUIPane,MsoWorkPane", ; either can be part of a task pane or sidebar.
	wc_FullpageUIHost = "FullpageUIHost",
	wc_SINGLE_CLASS = "UIHwnd",
	wc_Word_Windows = "_WwG,_WwN",
	WC_OutLookMessage = "rctrl_renwnd32",	; greatgrandparent of current window when MS Outlook is loaded from Excel.
;category consts for foregroundGetCategory ()
	WCAT_UNKNOWN			0,
	WCAT_SDM				1,
	WCAT_TASK_PANE			2,
	WCAT_SINGLE_CLASS		3,
	WCAT_SPELL_CHECKER		4,
	WCAT_STATUSBAR_TOOLBAR	5,
;Client area window categories:
	WCAT_DOCUMENT			10,
	WCAT_SPREADSHEET		11,
	WCAT_PRESENTATION		12,
	WCAT_MESSAGE			13,
	WCAT_DOCUMENT_WORKSPACE	14,

;Control ID constants for legacy SDM controls:
	cId_FolderComboXP=30, ;SDM control id of folder to save in or look in Office XP
	ID_INSERT_SYMBOL_EDIT = 27,
	ID_SYMBOL_VALUE_STATIC = 30,

; Window classes:
	wc_ParentClass_FULLPAGEUIHost="FULLPAGEUIHost", ;parent class of NETUiHwnd windows that are menus.
;for the clipboard dialog when it gains focus but does not fully have focus from the main document area:
	wc_OfficePassiveTooltip="OfficePassiveTooltip",
	wc_Spreadsheet = "EXCEL7",
	wc_Presentation = "paneClassDC",
	wc_bosa_sdmGeneral="bosa_sdm_", ;includes ones that have "_Mso9", etc.
	wc_OUTLOOK_MESSAGE_LIST = "SUPERGRID",
	wc_NuiPane="NUIPane",
	wc_edit="Edit",
 	wc_documentWindowParentClass="_WwB",
	wc_NetUIToolWindow="Net UI Tool Window",
	wc_wwg="_WwG",
	wc_wwn="_WwN",
	wc_wwC = "_WwC",
	wc_wwf="_wwf",
	wc_NetUIHwndElement = "NetUIHwndElement",
	wc_MSOWorkPane = "MSOWorkPane",
	wc_NUIDialog = "NUIDialog",
	wc_Shell_TrayWnd = "Shell_TrayWnd",
	wc_OfficeDropdown="OfficeDropdown",
	wc_SDM="_sdm_",
	wc_Word2010SDM="bosa_sdm_msword",
	wc_bosa_sdm_Mso96="bosa_sdm_Mso96",
	wc_NetUIHWND = "NetUIHWND",
	wc_ReComboBox20W="REComboBox20W",
	wcReListBox="REListBox20W",
	wc_msoCommandBar="MsoCommandBar",
	wc_msoCommandBarPopup="MsoCommandBarPopup", ; parent of some msoCommandbarGrid
	wc_openListView="OpenListView", ; for save as /open
	wc_OOCWindow="OOCWindow",
	WC_ResultsTypeParent="ResultsTypeParent",
	wc_SearchInParent="SearchInParent",
	wc_static="Static",
	wc_wordMainDocumentWindow="_WwG",
	wc_msoUniStat="MSOUNISTAT",
	wc_f3Server="F3 Server",

;Automation ID's:
	AutomationID_CellEdit = "CellEdit",  ;Excel cell edit, Office 2016
	AutomationID_FormulaBar = "FormulaBar",  ;Excel cell edit, Office 2016
	AutomationID_FileList = "NavBarMenu",
;JCF section for RichEdit support:
	section_richEditAndOsmOptions="RichEdit and Edit Control Options",
;Values returned from InTemporaryContextMenu
	NotInTemporaryContextMenu=0,
	TemporaryContextMenuItemNotSelected=1,
	TemporaryContextMenuItemSelected=2,
; keys for .jsi files used in common between Outlook 2007 and Word 2007:
	hKey_BrlTableNumberDisplay="DisplayBrlTableNumber",
	hKey_ObjectCountDetection="DetectObjectCount",
	hKey_DetectSpelling="DetectSpelling",
	hKey_DetectGrammar="DetectGrammar",
	hKey_tableDescription="TableDescription",
	hKey_announceCellCoordinates="AnnounceCellCoordinates",
	hKey_MeasurementUnits="MeasurementUnits",
; fjsi names
	Outlook2007JSI="Outlook2007.jsi",
	Word2007JSI="word2007.jsi",
; for Braille string compares in titles with ampersand character
	sc_Amp="&amp;",
	sc_ampersandChar="&",
;for keyname string compares:
	scPlusDelim="+",
	sc_RightControl="RightControl",
	scCtrl="Control",
	scAlt="Alt",
; delimiter and bullet type contstant
	sCDash="-",
; Constants for SetMSAALevel function in Outlook and Access.
	MSAA_OFF=0,
	MSAA_ON=1,
	MSAA_ADVANCED=2,
	scDoubleSpace="  ",
	scNewLine="\r\n",
	scStar="*",
;key codes for KeyPressedEvent
	ki_dash=0xB,
	KiControlUp = 0x8048, ;32840 in dec.
	kiControlDwn = 0x8050, ;32848 in dec.
;filter constants
	scFilterItemSeparator="|",
	scRGB = "RGB",
	scRGBSeparator = ",",
	iSmartTagFilterCount=8,
; constants for handling comdlg32.dll and comctl32.dll dialogues...
; common dialogues DLL names...
	ComDLGName = "comdlg32.dll",
	ComCtlName = "Comctl32.dll"

GLOBALS
;custom static text of SDM dialogs, used by speech and braille:
	string gstrCustomDlgStaticText,
; Effective color of contextual spelling errors in spell check dialogs.
	int giContextualSpellingErrorColor,
; see if we really need these globals
	handle globalRealWindow, string globalRealWindowName,
	handle hGlobalOoc,
	int globalObscuredText,
	int GlobalDetectAutoCorrect,
	int GlobalDetectSmartTags,
; For outlook Message.jss usage?
	int gbMessageHasBeenRead,
	handle ghMessageBodyWindow,
	handle globalCommandBarWindow,
	handle globalPrevCommandBarWindow

;The below is used in Office 2016/O365:
;Because GetWindowCategory is hit so often,
;Store the most recent handle and category that was evaluated,
;and only re-evaluate if the handle actually changed.
globals
	handle ghCategoryWnd,
	int giWndCategoryType
	
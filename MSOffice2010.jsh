; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS header file for Office 2010/2013

const
;nontranslatable string compares:
	scColon=":",
; General control ID's...
	ID_PathToolBar = 1001,
;function names for Unknown function:
	fn_inMainDocumentWindow="inmaindocumentwindow",
	fn_IsTextSelected="istextselected",
	fn_BrailleAddObjectTblInfo="brailleaddobjecttblinfo",
	fn_CaretMovedEvent="caretmovedevent",
	fn_QuickNavKeyTrapping="quicknavkeytrapping",
	fn_EstablishQuickNavState="establishquicknavstate",
	fn_toggleselctxflag="toggleselctxflag",
	fn_UserBufferOverVirtualDocument="userbufferovervirtualdocument",
	fnINOptionsDialog="inoptionsdialog",
	fnIsFormfield="isformfield",
	fn_pointNeedsMarking="pointneedsmarking",
	fn_IsStatusBarToolBar="isstatusbartoolbar",
;Office versions:
	office2010=14,
	office2007=12,
	office2003=11,
	officeXP=10,
	office2000=9,
;application section for richedit and osm options in .jcf file:
	section_richEditAndOsmOptions="RichEdit and Edit Control Options",
; jcf keys used in both Outlook and Word:
	hKey_IndentIndication="Indentation",
	hKey_documentPresentationSet="DocumentPresentationMode",
	;hKey_Brl_UseOSMForEdit="UseOSMForEdit", deprecated
	hKey_Brl_UseOSM="UseOSM",
	hKey_jcfTableIndication="TableIndication",
	hKey_selCtxWithMarkup="RequestMarkedUpContent",
	hKey_TabMeasurementIndication="TabMeasurementIndication",
	hKey_nonbreakingSymbols="IndicateNonbreakingSymbols",
; keys for .jsi files used in common between Outlook 2010 and Word 2010:
	hKey_BrlTableNumberDisplay="DisplayBrlTableNumber",
	hKey_ObjectCountDetection="DetectObjectCount",
	hKey_DetectSpelling="DetectSpelling",
	hKey_DetectGrammar="DetectGrammar",
	hKey_tableDescription="TableDescription",
	hKey_announceCellCoordinates="AnnounceCellCoordinates",
	hKey_MeasurementUnits="MeasurementUnits",
; fjsi names
	Outlook2010JSI="Outlook2010.jsi",
	Outlook2013JSI="Outlook2013.jsi",
	Word2010JSI="word2010.jsi",
;string compares
	sc_ampersandChar="&",
	scSlash="/",
	scRGB="RGB",
	scPageBreak="\12",
	scLineFeed="\10",
	vbcr="\13",
	scTab="\9",
; Outlook 2010 control IDs...
	ciMeetingSubjectField = 4100,
	ciMeetingLocationField=4101,
	ciMeetingWhenField=4102,
	ciStartTimeField=4096,
	ciEndTimeField=4097,
	ciSentField=4098,
	ciRequiredField = 4098,
	ciOptionalField = 4099,
;for keyname string compares:
	scPlusDelim="+",
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
	KiControlUp = 32840,
	kiControlDwn = 32848,
;Filters:
	scFilterItemSeparator="|",
	iSmartTagFilterCount=8,

; Window classes:
	wc_richEdit60W="RICHEDIT60W",
	wc_bosa_sdmGeneral="bosa_sdm_", ;includes ones that have "_Mso9", etc.
	wc_MerenguePane="MerenguePane",
	wc_bosa_sdm_Mso96="bosa_sdm_Mso96",
	wc_ParentClass_FULLPAGEUIHost="FULLPAGEUIHost", ;parent class of NETUiHwnd windows that are menus.
	wc_OUTLOOK_MESSAGE_LIST = "SUPERGRID",
	wc_NuiPane="NUIPane",
	wc_edit="Edit",
 	wc_documentWindowParentClass="_WwB",
	wc_NetUIToolWindow="Net UI Tool Window",
	wc_wwg="_WwG",
	wc_wwn="_WwN",
	wc_MSOWorkPane = "MSOWorkPane",
	wc_NUIDialog = "NUIDialog",
	wc_Shell_TrayWnd = "Shell_TrayWnd",
	wc_OfficeDropdown="OfficeDropdown",
	wc_SDM="_sdm_",
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
;Values returned from InTemporaryContextMenu
	NotInTemporaryContextMenu=0,
	TemporaryContextMenuItemNotSelected=1,
	TemporaryContextMenuItemSelected=2,
; for AdjustJAWSVerbosity:
	hKey_detectAutoCorrect="DetectAutoCorrect",
	hKey_detectSmartTags="DetectSmartTags"

globals
int GlobalTemporaryContextMenuState, ;one of the states returned by the InTemporaryContextMenu function
int nSuppressEcho, ; used for general supression of premature highlight speaking
int GlobalDetectSmartTags, ; verbosity option boolean
int GlobalSmartTagFlag, ; for determining smart tag detection
int GlobalSmartTagActionsTutorHelp,
int GlobalDetectAutoCorrect, ; verbosity option boolean
int GlobalObscuredText, ; for detecting AutoCorrect or smart tag object obscuring text
int GlobalPrevTreeviewLevel,
int globalSuppressHighlightedText, ; only used during selection changes when extended selection mode is on to enable speaking of selected unit before actual selected text.
Int globalFocusChanged, ; for when FocusChangedEvent fires.
int globalPageChanged, ; for when dialog page name changes within multipage dialog.
int GlobalCurrentControl,
int GlobalPrevCurrentControl,
	int gbMessageHasBeenRead,
	handle ghMessageBodyWindow,
	HANDLE globalRealWindow,
	string GlobalRealWindowName,
	handle GlobalAppWindow,
	string GlobalAppWindowName,
	handle hGlobalOoc, ;ooc window handle
	handle hNull,
	object oNull,
;for Word 2003 help window, next flag is tested in SayFocusedWindow and cleared if true ti prevent double-speaking when SayFocusedWindow fires twice.
;the flag is set  in SayPriorCharacter, SayPriorLine, SayNextCharacter, and SayNextLine scripts when needed.
	int giSayingTreeviewItem ,
	int giGroupboxTutorHelp,
	int giDocumentPropertiesPane,
; When Outlook is the active app...
	int gbOutlookIsActive,
;	for when Outlook is the application but window owner is Word.
	int gbWordIsWindowOwner,
	int giEnterKey,
	int giAlreadySpoken, ; for dealing with autocomplete testing in NewTextEvent and SayNonhighlightedText functions
	int giTicksInAutoStart, ; for dealing with unknown function calls when switching script configurations between Outlook and Word.
; for testing certain key navigation
	int gbUpDownNavigation,
	int gbLeftRightNavigation,
	int gbTabShiftTabNavigation,
	int gbCurrentLine,
;for screenStabilizedEvent
	int gbScreenStabilized,
;For determining if in SmartTag dialog in ScreenSensitiveHelpForOffice:
	int InSmartTagListDlg,
; for _WwN class window names in Braille:
	string gsBrlWindowName,
	int gbActiveItemChanged, ; set when spacebar is pressed in a JAWS dialog, cleared in ActiveItemChangedEvent
; the detection flags in effect
	int giSelCTXFlags,
; for application units of measure and desired unit of measure
	string gsAppUnitOfMeasure,
	int giDesiredUnit,
; for Braille proofreading mark indication:
	int giBrlProofreadingMark,
; for bullet type indication:
	int giIndicateBulletType,
	int giIndicateBrailleBulletType,
; for language detection:
	int globalDetectLanguages,
; for nonbreaking symbols:
	int giIndicateNonbreakingSymbols,
; for headings announcement independent of other style changes in Outlook 2010 and Word:
	int giMSOfficeHeadingIndication,
; for when ribbon had focus and app has lost it:
; set FocusChangedEventEx in msoffice2010 and clear it in SayFocusedWindow in app.
	int gbRibbonHadFocus,
; for Outlook read-only message quick keys mode
	int gbReadOnlyMessage,
; for whether to indicate measurement when Tab key is pressed:
	int gbTabMeasurementIndication,
; for when apply styles or Styles dialog had focus,
;used by FocusChangedEventEx inmsoffice2010.hss, and by NewTextEvent  and  Enter script and SayFocusedWindow in microsoft word 2010.jss.
	handle ghMainDocumentWindow, ; handle of the window to return to if gbApplyStylesHadFocus flag or gbStylesDlgHadFocus is true.
	int gbApplyStylesDlgHadFocus,
	int gbStylesDlgHadFocus,
	int gbSelCtxWithMarkup, ;flag for when using express mode where speech markup is disabled.
; for tables
	int gb_jcfTableIndication, ; flag for .jcf table indication option setting
	int gbAnnounceCellCoordinates, ; flag for whether to announce cell coordinates as table is navigated.
	int gbDocumentPresentationSet,; for whether to display tables in cell or document layout.
	;int gbBrlUseOSMForEdit,  for Braille OSM (legacy) or DOM mode
	int gbBrlUseOSM, ; for Braille OSM hybrid
	Int giTableDescription,
; for spelling and grammatical errors:
	int giDetectSpelling,
	int giDetectGrammar,
;for Outlook 2010 messages:
	int gbObjectCountDetection, ; flag for whether to announce number of objects in the current document or worksheet.
; flag for whether to display table numbers in Braille.
	int gbBrlTableNumberDisplay,
	int globalSelectionMode,
	int gbDefaultOption, ;flag to test whether to save to the application or document or workbook.jsi.
;vars to hold bit flag order for second parm of SetSelectionContextFlags function calls.
;to occur prior to CaretMovedEvents.
;for Outlook 2007 and above, the var is different because certain bit flags are always off.
	int giWordSelCtxBeforeCaretMoveBitFlagOrderMask,
	int giOutlookSelCtxBeforeCaretMoveBitFlagOrderMask,
;used to manage depth changes in SDM dialogs that shoulddn't result in ActiveItemChanged
	int giPrevTypeFromProcessEventOnFocusChange

; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 12.0.xx
; JAWS header file for Office apps through Office XP and 2003

const
;nontranslatable string compares:
	scColon=":",
;function names for unknown function:
	fn_inMainDocumentWindow="inmaindocumentwindow",
	fn_BrailleAddObjectTblInfo="brailleaddobjecttblinfo",
	fn_CaretMovedEvent="caretmovedevent",
	fn_BrailleAddObjectTblCellContent="brailleaddobjecttblcellcontent",
	fn_UserBufferOverVirtualDocument="userbufferovervirtualdocument",
	fn_toggleselctxflag="toggleselctxflag",
	fn_Istextselected="istextselected",
	
;For Outlook Message send button:
	cId_EMailSendOptions=4524,
;for Express Navigation Mode bit flags:
	WordInitialSelCtxFlags=2635932,
	Outlook2007InitialSelCtxFlags=2228364,
	Outlook2007SelCtxWithMarkupFlags=2097291,
	WordSelCtxWithMarkupFlags=1075839119,

	scPageBreak="\12",
	scLineFeed="\10",
	vbcr="\13",
	scTab="\9",
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
	iSmartTagFilterCount=8,
;TaskPane types:
	WD_TaskPaneFormatting=0,
	WD_TaskPaneRevealFormatting=1,
	WD_TaskPaneMailMerge=2,
	WD_TaskPaneTranslate=3,
	WD_TaskPaneSearch=4,

; Window classes:
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
; for AdjustJAWSOptions:
; keys for .jsi and .jcf files:
	hKey_IndentIndication="Indentation",
	hKey_documentPresentationSet="DocumentPresentationMode",
	;hKey_Brl_UseOSMForEdit="UseOSMForEdit",  deprecated
	hKey_Brl_UseOSM="UseOSM",
	hKey_ObjectCountDetection="DetectObjectCount",
	hKey_jcfTableIndication="TableIndication",
	hKey_selCtxWithMarkup="RequestMarkedUpContent",
	hKey_TabMeasurementIndication="TabMeasurementIndication",
	hKey_nonbreakingSymbols="IndicateNonbreakingSymbols",
	hKey_detectAutoCorrect="DetectAutoCorrect",
	hKey_detectSmartTags="DetectSmartTags"

globals
int GlobalInTaskPaneMenu, ;becomes true when entering TaskPane, false when leaving
int GlobalTemporaryContextMenuState, ;one of the states returned by the InTemporaryContextMenu function
int nSupressTaskPaneEcho, ; Set to true when need to supress TaskPane speaking of SayHighlightedText
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
HANDLE globalRealWindow,
string GlobalRealWindowName,
handle GlobalAppWindow,
handle hGlobalOoc, ;ooc window handle
handle hNull,
object oNull,
;for Word 2003 help window, next flag is tested in SayFocusedWindow and cleared if true ti prevent double-speaking when SayFocusedWindow fires twice.
;the flag is set  in SayPriorCharacter, SayPriorLine, SayNextCharacter, and SayNextLine scripts when needed.
	int giSayingTreeviewItem ,
	int giTaskPaneTutorHelp, ; for Office 2003 only when task pane gains focus and is not in edit control
	int giGroupboxTutorHelp,
	int giEnterKey,
; for value of button menu objects when changed by pressing enter
	string gsButtonMenuValue,
; for When Word is the editor for Outlook
; and/or the autocomplete history window is present:
	int gbAddressListHistoryWindow,
	int giHasAddressAutoComplete,
	string gsBrlAutoComplete,
; for testing certain key navigation
	int gbUpDownNavigation,
	int gbLeftRightNavigation,
	int gbTabShiftTabNavigation,
	int gbCurrentLine,
;for screenStabilizedEvent
	int gbScreenStabilized,
;	for when Outlook is the application but window owner is Word.
	int gbWordIsWindowOwner, ; mostly for Outlook 2007 and above.
	int gbActiveItemChanged, ; set when spacebar is pressed in a JAWS dialog, cleared in ActiveItemChangedEvent
; for nonbreaking symbols:
	int giIndicateNonbreakingSymbols,
; for headings announcement independent of other style changes in Outlook 2007 and above and in Word:
	int giMSOfficeHeadingIndication,
; for Outlook read-only message quick keys mode
	int gbReadOnlyMessage,
	int gbDocumentPresentationSet,; for whether to display tables in cell or document layout.
	;int gbBrlUseOSMForEdit,  for Braille OSM (legacy) or DOM mode
	int gbBrlUseOSM, ; for Braille OSM hybrid
; for whether to indicate measurement when Tab key is pressed:
	int gbTabMeasurementIndication,
	int giTicksInAutoStart,	; for dealing with unknown function calls when switching script configurations between Outlook and Word.
	int gbSelCtxWithMarkup, ;flag for when using express mode where speech markup is disabled.
	int gb_jcfTableIndication, ; flag for .jcf table indication option setting
	int gbEMailMessage, ; For when in an Outlook email message, frequently from within Word.
	int gbObjectCountDetection, ; flag for whether to announce number of objects in the current document or worksheet.
	int gbDefaultOption, ;flag, to test whether to save to the application or workbook.jsi.
;vars to hold bit flag order for second parm of SetSelectionContextFlags function calls. 
;to occur prior to CaretMovedEvents. 
;for Outlook 2007 and above, the var is different because certain bit flags are always off.
	int giWordSelCtxBeforeCaretMoveBitFlagOrderMask,
	int giOutlookSelCtxBeforeCaretMoveBitFlagOrderMask 
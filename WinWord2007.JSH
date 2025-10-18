; Copyright 1995-2015 Freedom Scientific, Inc. ; JAWS 6.0.xx
; JAWS 11.0.xx Constants and Globals for Microsoft Word 2007 only

Const
;timer for schedule functions that produce random double-speaking issues
	iTimer=3,
; for new line indication settings:
	indicateParagraphMarks=12,
	wdIndicateDuringSayAll=4,
; constants formerly in word.hsh
; line spacing constants
	wdLineSpaceSingle=0,
	wdLineSpace1pt5=1,
	wdLineSpaceDouble=2,
	wdLineSpaceAtLeast=3,
	wdLineSpaceExactly=4,
	wdLineSpaceMultiple =5,
; wdInlineShapes, inlineShape abrev to IS or some const names too long
	wdISEmbeddedOLEObject=1,
	wdISHorizontalLine=6,
	wdISLinkedOLEObject=2,
	wdISLinkedPicture=4,
	wdISLinkedPictureHorizontalLine=8,
	wdISOLEControlObject=5,
	wdISOWSAnchor=11,
	wdISPicture=3,
	wdISPictureBullet=9,
	wdISPictureHorizontalLine=7,
	wdISScriptAnchor=10,
; Braille Custom Control types
	WD_WT_TABLE=1,
	WD_WT_FRMEDIT=2,
	WD_WT_FRMCHK=3,
	WD_WT_FRMMNU=4,
	WD_WT_FIELD=5,
	WD_WT_SHAPE=6,
	WD_WT_NOTE=7,
	WD_WT_OLE_CHECKBOX=8,
	WD_WT_OLE_RADIOBUTTON=9,
	WD_WT_OLE_LISTBOX=10,
	WD_WT_OLE_GENERIC=11,
	WD_WT_OLE_UNKNOWN=12,
	wd_wt_inf_balloon=13,
	;wd_wt_revision=14,
	wd_wt_bookmark=14,
	wd_wt_smarttag=15,

	icTabChar=9,

	word_12=12,

;winstyle bits:
	ES_MULTILINE = 0x0004L,
; delimiters
	scBrlTblColMark=" | ",
;	scSlash="/", Moved to MsOffice2007 (DBrown) 8/14/07
; Word 12 vertical caret maximum height
	Word12VertCaretMaxY=90,
;default jcf filename:
	default_jcf="default.jcf",
; ms word jcf file names:
	Word2007_jcfFileName="microsoft Word 2007.jcf",
	jcfFileName="Microsoft Word.jcf",

; jsi filename
jsiFileName="word2007.jsi",
jsiDocFilename="word2007_%1.jsi",	; %1=document name
; application keys for .jsi files:
	hKey_DetectBookmarks="DetectBookmarks",
	hKey_LineSpacingDetection="LineSpacingDetection",
	hKey_styleChanges="StyleChanges",
	hKey_formfieldHelp="FormfieldHelp",
	hKey_DetectRevisions="DetectRevisions",
	hKey_SchemeDocSpecific="SchemeDocSpecific", ; off by default meaning scheme works throughout application instead of being document-specific.
	hKey_NamedTitlesApp="NamedTitles",
	hKey_NotesDetection="Notes",
; application keys for .jcf filename reading/writing:
		hKey_ExpandAnnotationsInline="ExpandAnnotationsInline",
	hKey_IndicateNewLines="IndicateNewLinesAndParagraphs",
; document specific verbosity settings section
	Section_documentVerbositySettings="Document Verbosity Settings",
	section_table="Table %1", ;%1=table number
	section_tables="Tables",
	section_Scheme="Current Scheme",
; document keys
	hKey_titleReading="TitleReading",
	hKey_titleRow="TitleRow",
	hKey_titleColumn="TitleColumn",
	hKey_NamedTitlesFile="NamedTitles",
;winword.jcf section and key for Braille Marking
Key_Marking="BrailleShowMarking",
; Keycodes for KeyPressedEvent and quick key mode or read-only mode in Outlook 2007
	;may need localizing:
	;following two keys are for when message has been sent, Alt+s in English
	kiLeftSendMessage=0x10001F, ;1048607 in dec
	kiRightSendMessage=0x101F, ;4127 in dec
	kiRightAlt8 = 0x1000,
	kiCtrlA=0x1001E,
	kiCtrlB=0x10030,
	kiCtrlC=0x1002E,
	kiRightAltslash = 0x1035,
	kiAltL = 0x100026,  ;note that this is with left alt, not alt or right alt, which is 0x1026
	kiControlK = 0x425,
	kiNextSelectedParagraph = 0x400450,
	kiRightCtrlNextSelectedParagraph =0x200150,
	kiPriorSelectedParagraph = 0x400448,
	kiRightCtrlPriorSelectedParagraph =0x200148,
	kiNextSelectedParagraphLaptop=0x800450,
	kiPriorSelectedParagraphLaptop=0x800448,
	kiCtrlApostrophe = 0x428,  ;note this is with left control, right control is 0x128
	kiCtrlGrave = 0x429,  ;note this is with left control, with right control it is 0x129
	kiCtrlTilde = 0x400429,  ;note that this is with left control and left shift, the other combinations are 0x400129 0x100129 0x100429
	kiCtrlCaret = 0x810007,
	kiCtrlColon = 0x400427,  ;note that this is with left control and left shift, the other combinations are 0x400127 0x100127 0x100427
	kiCtrlAt = 0x810003,
	kiCtrlAnd = 0x810008,
	kiCtrlComma = 0x10033,
	kiCtrlSlash = 0x435,  ;note that this is with left control, for right control use 0x135
	kiAltCtrlQuestion = 0x500435,  ;note that this is with left control, left alt and left shift, other combinations are 0x300435 0x500135 0x401435 0x300135 0x201435 0x201135
	kiAltCtrlExclaim = 0x500402,  ;note that this is with left contro, left alt and left shift, other combinations are 0x300402 0x500102 0x401402 0x300102 0x201402 0x201102
	kiEuro = 0x100412,  ;note this is with left control and left alt, other combinations are 0x100112 0x1412 0x1112
	kiCopyRight = 0x10042e,  ;note this is with left control and left alt, other combinations are 0x20122e 0x142e 0x112e
	kiRegistered = 0x100413,  ;note this is with left control and left alt, other combinations are 0x100113 0x1413 0x1113
	kiTrademark = 0x100414,  ;note this is with left control and left alt, other combinations are 0x100114 0x1414 0x1114
	kiElipsis = 0x100434,  ;note this is with left control and left alt, other combinations are 0x100134 0x1434 0x1134
	kiLeftShiftExclaim = 0x800002,
	kiLeftShiftQuestion = 0x800035,
	kiRightShiftExclaim = 0x800002,
	KIRightShiftQuestion = 0x800035,
	kiRightAltF4 = 0x103e,
;	Verbosity option levels:
; For items like Proof reading, notes detection etc, level 2 alerts when you move to a line containing at least one of the specified detection items
wdVerbosityOff=0, ; equivalent to false
wdVerbosityOn=1, ; equivalent to true
wdVerbosityLow=1,
wdVerbosityHigh=2,
wdVerbosityHighest=3,
; for Revision Detection
SpeakRevNone=0,
SpeakRevType=1,
SpeakRevTypeAuthor=2,
SpeakRevtypeAuthorDate=3,
speakRevcount=4, ; used as a bit flag
; window classes
	wc_wwo="_WwO",
	wc_NewDlg="NewDlgClass", ; Windows XP New documents/templates dialog off the File menu.
	wcF3Server="F3 Server 60000000", ; for embedded ole controls
	wc_opusApp="OpusApp", ; parent of controls like the Insert Table toolbar button
	wc_msoCommandbarGrid="MsoCommandbarGrid",
	wc_StatusBar = "_WwC",
	wc_wwf="_wwf",
	wc_HyphenationWindow="_WwI", ; manual hyphenation edit box where hyphenated word is displayed.
; for EmailMessage Send Options window that appears only when Outlook uses Word as the editor to send a message from Outlook.
	cId_EMailSendOptions=4524,
	cId_ToField=4097,
	cId_CCField=4098,
	cId_bccField=4100,
	cId_SubjectField=4102,
; for Find and Replace dialog:
	cId_ReplaceEditCombo=27, ;	SDM cID for autocorrect dialog in Autocorrect page for Office <=9.
	cId_ReplaceEditCombo2=30, 	;SDM cID for autocorrect dialog in Autocorrect page for Office =10.
	cId_ReplaceEditCombo3=31, 	;SDM cID for autocorrect dialog in Autocorrect page for Office >=11.

cId_AutotextEditCombo=1821, ;	SDM cId for Autocorrect dialog in Autotext page.
cId_tipOfTheDay=17,
cId_tipOfTheDayCheckbox=18,
; font dialog
cId_FontName=1792,
cId_FontStyle=1794,
cId_FontSize=1796,
cId_FontUnderlineStyle=1806,
; borders and shading
cID_BorderNoneBtn=1852,
cId_BorderCustomBtn=1856,
cId_BorderWidth=43,
cId_borderStyleListbox=37,
cId_PageBorderArtCombo=45,
cID_TopBorderButton=50,
cID_BottomBorderButton=52,
cID_DiagonalUpBorderButton=53,
cID_LeftBorderButton=54,
cID_RightBorderButton=56,
cID_DiagonalDownBorderButton=57,
cId_BorderColorButtonMenu=1081,
;Table Properties dialog
cId_TableAlignmentLeftBtn=61,
cId_TableAlignmentRightWrapBtn=66,
cId_TableTextWrappingNoneBtn=71,
cId_TableTextWrappingAroundBtn=74,
cId_TableCellSizeEditSpin=31,
cId_TableCellVerticalAlignmentTopBtn=38,
cId_TableCellVerticalAlignmentBottomBtn=40,
; Table Options dialog
cId_TableOptionsCellMarginsTop=18,
cId_TableOptionsCellMarginsRight=24,
cId_TableOptionsCellSpacing=26,
; Cell Options dialog
cId_CellOptionsMarginsSameAsTable=17,
cId_CellOptionsmarginsRight=25,
;the Search dialog in the WordXP TaskPane
cID_AdvancedSearchProperty=1030,
cID_SearchIn=1044,
cID_SearchValue=1035,
; Spelling and Grammar
colorMisspelledWord="255000000",
colorGrammaticalError="000128000",
colorHyperlink="000000255",
cID_SpellingSuggestionList=19,
cID_SpellingIgnoreBtn=20,
cID_Spelling97IgnoreBtn=23,
CId_NotInDictionary_EditBox1 = 20,
CId_NotInDictionary_EditBox2 = 18,
cId_CheckGrammar97CheckBox = 17,
cId_CheckGrammar2000CheckBox = 34,
cId_CheckGrammarXPCheckBox = 35,
cId_LanguageInUse=26, ; Office 2000

; For SDM controls requiring extra attention in SaySDMFocusedWindow
cID_BackButton= 30,
cId_XPBackButton=36,
cID_Tools=30,
cID_HistoryButton=28,
cId_XPHistoryButton=34,
cID_ColorMenuButton=1079,
cID_RestartNumberingRadioButton=30,
cID_ContinuePreviousListRadioButton=31,
; for sdm dialogs requiring extra attention in sayHighlightedText
cId_wordCountClose=2, ; we use this as it is the same in both 97 and 2000,
; For Modify Style
cId_ModifyStyleButtonMenu=28,
; For Page Number Format dialog
cId_StartAtEdit=29,
cId_bookMarkSortByLocation=19, ; bookmark sort by radio buttons
cId_bookMarkSortByName=20, ; bookmark sort by radio buttons
; Mail Merge/Creat Data Source
btnMoveUp="^",
btnMoveDown="V",
; Save As/Open
cId_FileTypeCombo=51, ; SDM control id of FilesOfType or SaveAsType for Office 2000
cId_FileTypeXPCombo=57, ; SDM control id of FilesOfType or SaveAsType for Word XP
cId_FolderCombo=25, ; SDM control id of folder to save in or look in Office 2000
cId_FolderComboXP=30, ;SDM control id of folder to save in or look in Office XP
cId_ListViewXP=35,
cId_openButton=31, ; Word 2000 (used in screen sensitive help to tell user about context menu)
cId_folderCombo97=17, ; Office 97
; Track Changes Options dialog for Word 2000
cId_MarkInserted=18,
cId_colorInserted=19,
cId_markDeleted=23,
cId_colorDeleted=24,
cId_markChangedFormatting=28,
cId_colorChangedFormatting=29,
cId_markChangedLines=33,
cId_colorChangedLines=34,
; Accept or Reject controls
cId_findForward=1027,
cId_findBackward=1028,
; Find and Replace dialog
cId_findNext=1032,
cId_FindAndReplaceTab=16,
; Mail Merge Helper Word 97
cId_MailMergeCreate=16,
cId_mailMergeEdit=17,
cId_mailMergeGetData=19,
cId_mailMergeEditDataSource=20,
cId_firstRecord=36,
cId_PreviousRecord=37,
cId_nextRecord=39,
cId_lastRecord=40,
cId_ShadingColor=30,
cId_ShadingColorName=37,
cIdEnvelopesLabelsTab=16,
cId_returnAddressButton2000=23,
cId_returnAddressButton97=24,
cId_deliveryAddressButton1=17,
cId_deliveryAddressButton2=18,
cId_DeliveryAddressEditBox=21,
cId_ReturnAddressEditBox=25,
cId_MacroName=16, ; edit combo in macros dialog.
; title reading for tables
	readNoTitles=0,
	readColumnTitles=1,
	readRowTitles=2,
	readBothTitles=3,

;the following are values of the giBrailleFlashModify variable:
	BrlFlash_default = 0,
	BrlFlash_On = 1,
	BrlFlash_Off = 2,
; for Braille marking:
	wdBrlMarkSpell=1,
	wdBrlMarkGrammar=2,
	wdBrlMarkSpellingAndGrammar=3,
; zoom level exceeds functionality (many pages).
	ZOOM_MANY_PAGES = 10

Globals
int globalInBorderedText, ; detecting bordered text.
int globalInBorderedParagraph,
int globalInBorderedSection,
int globalTablePriorColumn, ; detecting change in row or column
int globalTablePriorRow,
int globalTableStart, ; to detect if we are in the same or a new table.
int giTableNestingLevel,
int giCurCol,
int giCurRow,
int giPrevCol,
int giPrevRow,
int GlobalNestingLevel, ; table nesting
int giMaxColumns,
int giMaxRows,
int giDetectHeaderFooter, ; detect when cursor moves between header and footer in header footer pane.
int globalTitleReading, ; table title reading
int globalTitleRow, ; row index of table where column titles are stored
int globalTitleColumn, ; column index of table where row titles are stored
int globalTableEndOfRow, ; Braille support
int globalLastCellInTable, ; Braille support
int globalTableNumber,
int globalPriorTableNumber,
string globalTableDefsTitleReading, ; array of table defs for title reading for each table in a document
string globalTableDefsTitleRows, ; list of table defs for title rows for each table
string globalTableDefsTitleCols, ; list of table defs for title columns for all tables
int globalDetectNotes, ; footnote/endnote and comment detection
int globalPriorLanguageId,
int globalDefaultLanguage, ; default language to use when not in document window.
int giPriorStoryType,
handle eventTriggered,
int InMainDocumentWindow,
int WordVersion,
int WinWordFirstTime, ; to say auto start message only first time
handle WinWordContextHandle, ; read word in context
int CId_NotInDictionary_EditBox,
; used to determine if the spellchecker edit box has changed
	string globalPriorWindowText,
	int GlobalMisspelledCol,
	int GlobalMisspelledRow,
	int globalPriorPageNumber,
int globalCalculateLineRange, ; used to determine whether the range for the current line needs calculating during sayLine
string globalPriorWordDocumentName,
int globalNoSave, ; used to prevent section being rewritten when it is deleted from a jsi
int globalPriorTextColumnNumber,
int globalSuppressCell, ; used to avoid double speaking when doing a sayLine in a table cell which is highlighted, caused when the screen is updated.
int GlobalSelectedCharCount, ;Keeps track of the amount of text selected when using Find and Goto in Extended Selection mode
int giSelectionPriorCharCount, ; for SelectionChangedEvent to determine paragraph selection announcement
int GlobalInSpellChecker, ; true when in spellchecker, false otherwise
int GlobalUseOSm,
int GlobalSayOpenListViewItem,
int GlobalSayStabilizedOpenListViewItem,
int GlobalSayToggleButton,
int GlobalIncDecFontSize,
int GlobalWindowStateToggle,
int GlobalNewSDMDialog,
int GlobalPerformedReadMistakeAndSuggestion,
int cId_CheckGrammarCheckBox,
Int globalCId_FolderCombo,
; This next flag is used to determine whether Find What edit  control has already been spoken before when user presses Alt+p or Alt+d, or
; to determine whether accelerator key has been pressed in XP or higher Save-As dialog to navigate to folder combo box.
Int globalSpokenBefore,
String globalSchemeName,
String globalPriorSchemeName,
int globalSchemeDocSpecific,
int globalTextOptions,
int gbSayLineScheduled,
int gbSayParagraphScheduled,
int gbSaySentenceScheduled,
Handle globalAppMain, ; handle  of app window when Word first opens.
int globalNewAddressListDialog,
Int giSelectedPara,
int giSelectedParaKey,
int giSelectingText,
string gsSpellingSuggestionInList,  ;used in braille flash message
int giBrailleFlashModify,  ;when we alter normal braille flash behavior when code is used by both flashing and non-flashing messages
int ClipboardTextChanged, ; for copy to and cut to clipboard scripts
int gbBookmarkItem, ; Set in SaySDMFocusedWindow, cleared in GetFindItemType
int gbObjectItem, ; Set in SaySDMFocusedWindow, cleared in GetFindItemType
int giNextIsAccentedChar, ; used by KeypressedEvent for accented characters.
int giOverrideNamedTitles, ; flag that determines whether to check for named title
int giOverrideApp, ; flag that determines whether to check for anamed titles for entire app
int giOverrideFile,; gflag that determines whether to check current file only
int giReadingLayout, ; for reading layout view in Word 11.
int giCustomLabels, ; flag (on by default) to determine whether to use or suppress custom labels for training/demo purposes in the current session of the application only.
int giPriorQuickNavMode,
; to determine which message to speak. If from verbosity dialog, only say on/off.
; otherwise, say "quick keys".;
	int giSetQuickNavModeFromScript,
	int gbQuickNavState,
	int gbQuickNavKeyTrapping,
	int gbRestartSayAll,
; for listbox items that incorrectly state that they are not selected
	int giSelectedState,
; Suppress highlight when line range was detected:
	int GlobalSuppressSayLineHighlight,; globalMultipleColumnText is set to true in print layout view when
;text is in newspaper style columns or when in a table and table ;
;detection is on:
	int globalMultipleColumnText,
;misc:
	int giCheckForTitle,
 	int giWasHyperlinkField,; for when value changed event fires
 	int giBrlMarking,
; for revision detection during quick key navigation mode:
	int giRevisionType, ; 1=inserted text, 2=deleted text, more may be added later
	int giSayBlankLineCount,
; for table type, 1=uniform, 0=nonuniform
	int gbTableUniformType,
	int gbFormFieldSelected, ; for when a formfield is selected from a list.
; set in movement functions and tested in ProcessBoundaryStrike to determine when to beep.
	int gbMoveBySentenceOrParagraph,
	int gbMoveByChar,
	int gbMoveByWord,
	int giDetectRevision,
	int gbInTable, ; used when in AdjustJAWSOptions dialog since can't determine whether caret is in table from there.
	int gbIsHyperlink, ; used to determine whether to activate a link or show one in Braille.
; for formfields:
	string gsF1Help,
; for revisions:
	string gsBrlRevType,
	string gsBrlRevText,
	string gsBrlRevAuthor,
	String gsBrlRevDate,
; for Braille formfields:
	string gsBrlFormfieldPrompt,
	int giBrlFormFieldType,
	string gsBrlFormFieldState,
	string gsBrlFormFieldValue,
	string gsBrlFormfieldPosition,
	string gsBrlFormfieldF1Help,
; for Braille comments, footnotes, and endnotes, determined from SelectionContextChangedEvent:
	string gsBrlCommentText,
	string gsBrlFootnoteText,
	string gsBrlEndnoteText,
	string gsBrlCommentauthor,
	string gsBrlFootnoteAuthor,
	string gsBrlEndnoteAuthor,
;for general fields:
	string gsBrlFieldName,
	string gsBRLFieldType,
	string gsBrlFieldValue,
;for bookmarks:
	string gsBrlBookmark,
;for smarttags:
	string gsBrlSmarttag,
; for current selection context:
	int giSelectionContext,
	int gbMovedByRow, ; used to determine whether or not to announce row title information in CellChangedEvent.
	int giFormfieldHelp,
	string gsJSIDocFileName,
; for when table was just entered at a row marker instead of a cell:
	int gbTableWasEnteredAtRowMarker,
;flag to test for when SayFocusedWindow fires and formfield has been spoken to prevent double-speaking when moving by line
	int gbFormfieldSpoken,
; for when switching active panes, obtained from StoryChangedEvent
	int giStoryType,
; for style changes, three-way switch
	int giStyleChanges,
; for application units of measure and speech mark-up desired unit of measure
	string gsAppUnitOfMeasure, ;the application's unit of measure
	int giDesiredUnit, ; the speech mark-up unit of measure
	int giPriorAppUnitOfMeasure,
	int giAppUnitOfMeasure, ; the application unit of measure
	int gbDesiredUnit, ; flag to indicate whether user has changed speech mark-up unit of measure, off by default.
; for line spacing change detection
	int giPriorLineSpacing,
	int gbLineSpacingDetection,
	int giDetectBookmarks, ; flag for whether to detect bookmarks with/without text.
	int gSayAll,
	object globalInlineShape,
	string globalBorderStyleValue,
	string GlobalBorderArtValue,
; for when Braille proofreading needs updating in SayFocusedWindo
	int giPriorBrlProofreadingMark  ,
; for testing whether to announce that a document has inline and/or embedded objects:
	int giPriorObjectCount,
	int gbIsProtectedForm, ;flag for when form is protected so that last cell in table warning messages are not announced./
;for event triggers:
	int gbStyleChangedEventTriggered, ;for when StyleChangedEvent function fires.
	int gbSelectionChangedEventTriggered, ; for when SelectionChangedEvent function fires.
	int gbTableEnteredEventTriggered,
	int gbTableExitedEventTriggered,
	int gbCellChangedEventTriggered,
; for new line and paragraph indication levels:
	int giIndicateNewLines,
;flag for when message has been sent but remains open
	int gbMessageHasBeenSent,
	int gbBrlShowBrailleError, ;flag for when Braille error message gets stepped on and needs to be redisplayed.
	int gbRTLReadingStatus, ; flag that determines whether RTL language processor is installed.
	int gbWasQuickKeyTrapping ;flag that determines whether quick keys were enabled prior to activating a context menu.	
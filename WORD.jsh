; Copyright 1995-2018 Freedom Scientific, Inc.
; JAWS Constants and Globals for Microsoft Word

; constants for unicode left / right quotes and single quote apostrophe.
; represented by their unicode values.
; Rather than create a list, they are separated, so we don't walk a string of constants every time an autocorrect happens,
; GetChraracterValue comparison against an integer will be faster:
const 
	AutocorrectApostrophe = 8217,
	AutocorrectLeftQuote = 8220,
	AutocorrectRightQuote = 8221


Const
;JCF and JSI file names:
	jsiFileName="word.jsi",
	jsiDocFilename="word_%1.jsi",	; %1=document name
	WordJCFFileName = "Word.jcf",
;sections:
	section_table="Table %1", ;%1=table number
	section_doc = "doc",
; jcf keys used in both Outlook and Word:
	hKey_IndentIndication="Indentation",
	hKey_documentPresentationSet="DocumentPresentationMode",
	;hKey_Brl_UseOSMForEdit="UseOSMForEdit", deprecated
	hKey_Brl_UseOSM="UseOSM",
	hKey_jcfTableIndication="TableIndication",
	hKey_selCtxWithMarkup="RequestMarkedUpContent",
	hKey_TabMeasurementIndication="TabMeasurementIndication",
	hKey_nonbreakingSymbols="IndicateNonbreakingSymbols",
; keys for .jsi files used in common between Outlook 2007 and Word 2007:
	hKey_IndicateNewLines="IndicateNewLinesAndParagraphs",
	hKey_ExpandAnnotationsInline="ExpandAnnotationsInline",
	hKey_DetectBookmarks="DetectBookmarks",
	hKey_LineSpacingDetection="LineSpacingDetection",
	hKey_styleChanges="StyleChanges",
	hKey_formfieldHelp="FormfieldHelp",
	hKey_DetectRevisions="DetectRevisions",
	hKey_BrlProofreadingMark="BrlProofreadingMark",
	hKey_SchemeDocSpecific="SchemeDocSpecific", ; off by default meaning scheme works throughout application instead of being document-specific.
	hKey_NamedTitlesApp="NamedTitles",
	hKey_NotesDetection="Notes",
; document keys
	hKey_titleReading="TitleReading",
	hKey_titleRow="TitleRow",
	hKey_titleColumn="TitleColumn",
	hKey_NamedTitlesFile="NamedTitles",
;PlaceMark .jsi name and key
	MarkedPlaceDocJSIFileName="word_MarkedPlaceDocuments.jsi",
	;the section names in this file are the documents which have marked places set.
	hKey_MarkedPlace="MarkedPlace", ;temporary key
;for querying .smf file:
	Section_smm_ControlType = "ControlType", ;BehaviorTableSection
	FileNameExt_Wav = ".wav",
; for showing links of  items in the virtual viewer:
	fn_MoveToLinkItem="MoveToLinkItem(%1,%2)",
;word versions:
	Word_11 = 11,
	Word_12 = 12,
	word_14 = 14,
	word_15 = 15,
;Word application owner names:
	WordApp_2003 = "winword",
	WordApp_2007 = "wwlib", ;also true for 2010
; Word 11 vertical caret maximum height
	Word11VertCaretMaxY = 90,
	SpeakAnnotationCount=3,
; window classes
	wc_MSOBALLOON="MSOBALLOON",
	wc_wwo="_WwO",
	wc_sdm_msWord = "_sdm_msword",
	wc_sdm_Outlook = "bosa_sdm_Mso96",
	wc_NewDlg="NewDlgClass", ; Windows XP New documents/templates dialog off the File menu.
	wcF3Server="F3 Server 60000000", ; for embedded ole controls
	wc_opusApp="OpusApp", ; parent of controls like the Insert Table toolbar button
	wc_msoCommandbarGrid="MsoCommandbarGrid",
	wc_StatusBar = "_WwC",
	wc_HyphenationWindow="_WwI", ; manual hyphenation edit box where hyphenated word is displayed.
	AutomationID_COPILOT_PROMPT = "IPE_Input_Prompt_Field", ;the automation ID for the copilot edit field 
; for EmailMessage Send Options window that appears only when Outlook uses Word as the editor to send a message from Outlook.
	cId_ToField=4097,
	cId_CCField=4098,
	cId_bccField=4100,
	cId_SubjectField=4102,
; for Word Count dialog:
	cId_WordCountSDMStaticDlgTextMainLabel = 34,
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
	colorContextualSpellingError="000000255",
	colorHyperlink="000000255",
	noSelectedItem="no selected item", ; when no suggestions
	notSelected="not selected",
	suggestionsListboxPrompt="suggestions:",
	cID_SpellingSuggestionList=19,
	cID_SpellingSuggestionList_2003 = 21,
	CID_GRAMMAR_SUGGESTIONS_LIST = 24,
	cID_SpellingIgnoreBtn=20,
	cID_Grammar_Prompt_2010 = 17,
	CId_NotInDictionary_EditBox = 18,
	CId_NotInDictionary_EditBox1 = 20,
	CId_NotInDictionary_EditBox2 = 18,
	cId_CheckGrammar2000CheckBox = 34,
	cId_CheckGrammarXPCheckBox = 35,
	cId_LanguageInUse=26, ; Office 2000
;SDM control ID's specific to O365 Outlook's spell checker:
	cID_O365_SuggestionListPrompt = 19,
	cID_O365_SpellingSuggestionsList = 20,
	cID_O365_GrammarSuggestionsList = 24,
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
	cId_wordCountClose=2,
; For Modify Style
	cId_ModifyStyleButtonMenu=28,
; For Page Number Format dialog
	cId_StartAtEdit=29,
	cId_bookMarkSortByLocation=19, ; bookmark sort by radio buttons
	cId_bookMarkSortByName=20, ; bookmark sort by radio buttons
	cId_CustomizeToolbarListbox=18, ; 2000 Customize toolbar listbox control in Toolbars page of Customize dialog off Tools menu.
; Mail Merge/Creat Data Source
	btnMoveUp="^",
	btnMoveDown="V",
; Save As/Open
	cId_FileTypeCombo=51, ; SDM control id of FilesOfType or SaveAsType for Office 2000
	cId_FileTypeXPCombo=57, ; SDM control id of FilesOfType or SaveAsType for Word XP
	cId_FolderCombo=25, ; SDM control id of folder to save in or look in Office 2000
	cId_ListViewXP=35,
	cId_openButton=31, ; Word 2000 (used in screen sensitive help to tell user about context menu)
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
	cId_deliveryAddressButton1=17,
	cId_deliveryAddressButton2=18,
	cId_DeliveryAddressEditBox=21,
	cId_ReturnAddressEditBox=25,
	cId_MacroName=16, ; edit combo in macros dialog.
; zoom level exceeds functionality (many pages).
	ZOOM_MANY_PAGES = 10,
;Verbosity option levels:
;for items such as Proof reading, notes detection etc, level 2 alerts when you move to a line containing at least one of the specified detection items
	wdVerbosityOff=0, ; equivalent to false
	wdVerbosityOn=1, ; equivalent to true
	wdVerbosityLow=1,
	wdVerbosityHigh=2,
	wdVerbosityHighest=3,
; title reading for tables:
	readNoTitles=0,
	readColumnTitles=1,
	readRowTitles=2,
	readBothTitles=3,
	readMarkedTitles = 4,
;for Revision Detection:
	SpeakRevNone=0,
	SpeakRevType=1,
	SpeakRevTypeAuthor=2,
	SpeakRevtypeAuthorDate=3,
	speakRevcount=4,
; for new line indication settings:
	indicateParagraphMarks=12,
	wdIndicateDuringSayAll=4,
; for Braille marking:
	wdBrlMarkSpell=1,
	wdBrlMarkGrammar=2,
	wdBrlMarkSpellingAndGrammar=3,
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
	wd_wt_coltitles_and_row=16,
	wd_wt_prior_and_cur_row=17,
; Single digit constants
	ciOne=1,
	ciTwo=2,
; Keycodes for KeyPressedEvent and quick key mode
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
;for left or right key name distinction:
	scLeft="Left",
	scRight="Right",
;Tab character value:
	TabCharValue = 9

;for Outlook:
const
	to_field = 4099

;The following event_ constants are used for determining which
;tracked event was most recently fired.
;Not all events are tracked, just the ones we need to know about.
;If a non-tracked event fires after a tracked one,
;this is not noted and so it cannot be detected.
;If you do need to know about a non-tracked event, then add it to the tracked ones.
;Note: In order for an event to be tracked,
;use the TrackEvent function to track it,
;and the GetLastTrackedEvent function to test which one most recently fired.
;The tracked events are used to control speech behavior in the document.
const
	event_AutoStart = 1,
	event_DocumentChanged = 2,
	event_CaretMoved = 3,
	Event_CellChanged = 4,
	event_FocusChanged = 5,
	event_MenuMode = 6,
	event_TableEntered = 7,
	event_QuickNavEnabled = 8,
; Do not localize these, they must match the filenames in the installer for the JBS files minus the jbs extension
	cWordPerfectPrefixJBSBase="WordPerfect",
	cWordClassicJBSBase="wordclassic"

globals
; Determine if in classic settings or no for WordSettings.jss and elsewhere:
	int wordUpdateVersion,
;document name, used for document change:
	string GlobalRealWindowName,
	string globalDocumentName,
	string globalPrevDocumentName,
	int gWordVersion,
	int gbWinWordFirstTime,
	handle WinWordContextHandle, ; read word in context
	int gbWordContextMenuActive,
	int giScheduledDocumentTopAndBottomEdgeAlert,
	int giQuickNavStateFromScript

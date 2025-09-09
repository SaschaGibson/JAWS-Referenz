; Copyright 1995-2018 Freedom Scientific, Inc.
;JAWS Message file for Microsoft Word

Const
;For spellcheck dialog, when running Spellcheck in Word:
	capitalization_prompt = "Capitalization:",
	extra_Space = "Extra Space",
	invalid_spacing = "Spacing:",
		invalid_punctuation = "Punctuation:",
		invalid_agreement = "Agreement:",
;string segment delimiters for text selection to find word breaks in the selected text:
	sc_selectionWordDelimiters = " \r\n\t\007",
;The following native Word table keys conflict with Skype hangup and answer keys:
	ks_Word_MoveToTopOfColumn = "Alt+PageUp",
	ks_Word_MoveToTopOfColumn_Extended = "Alt+ExtendedPageUp",
	ks_Word_MoveToBottomOfColumn = "Alt+PageDown",
	ks_Word_MoveToBottomOfColumn_Extended = "Alt+ExtendedPageDown",
;The following native Word table keys conflict with Calendar move to start and end of week keys:
	ks_Word_MoveToStartOfRow = "Alt+Home",
	ks_Word_MoveToEndOfRow = "Alt+End",
;The following Word native key is used outside of tables for browsing objects:
	ks_Word_Browse_Objects = "Alt+Control+Home", ;must match exactly key name from KeyPressedEvent
;keystroke names for spellcheck keys.
;these are the accelerators or access keys for the buttons in SpellCheck.
;Within a spreadsheet, run spell check and these are the row of buttons, Ignore, Ignore All, Change, Change All, 
; and Add to Dictionary.
;These are all done in lower case to make things simpler, so when translating the keys for your language, use lowercase letters.
; They should correspond to what you assigned in Word.jkm to the SpellCheckAccelerators script,
; so they match the user expectation in your language for what the keystroke would be for that version of Word.
	ksAddToDictionary = "alt+a",
	ksIgnore = "alt+i",
	ksIgnoreAll = "alt+g",
	ksChange = "alt+c",
	ksChangeAll = "alt+l",
	ksCurrentSentence = "Alt+semicolon",
;spoken delimiter for when screen layout is enabled and punctuation is set to most or all:
ScreenLayoutVerticalBar="|",
; for showing links of  items in the virtual viewer:
	ListItemsToDisplay = "|Comments|Footnotes|Endnotes|Revisions",
	ListItemsToDisplay_singular = "|Comment|Footnote|Endnote|Revision", ;same as ListItemsToDisplay, but items have the singular form.
	scComments="Comments",
	scFootnotes="Footnotes",
	scEndnotes="Endnotes",
	scRevisions="Revisions",

; Text label vertically between Move-Up and Move-Down buttons in dialogs containing them.
; Must match what is displayed in the dialog.
; Example: Form Options dialog for a dropdown Word form field.
	scMove = "Move",

; for table title reading used in word.hss to load table definitions.
; for bilingual usage, localize the three corresponding variables.
	Title="title",
	TitleLocal="title",
	ColumnTitle="columntitle",
	ColumnTitleLocal="columntitle",
	RowTitle="rowtitle",
	RowTitleLocal="rowtitle",
; For shading property:
	Texture10Percent="10",
	Texture12Pt5Percent="12.5",
	Texture15Percent="15",
	Texture17Pt5Percent="17.5",
	Texture20Percent="20",
	Texture22Pt5Percent="22.5",
	Texture25Percent="25",
	Texture27Pt5Percent="27.5",texture2Pt5Percent="2.5",
	Texture30Percent="30",
	Texture32Pt5Percent="32.5",
	Texture35Percent="3.5",
	Texture37Pt5Percent="37.5",
	texture40Percent="40",
	Texture42Pt5Percent="42.5",
	Texture45Percent="45",
	Texture47Pt5Percent="47.5",
	Texture50Percent="50",
	Texture52Pt5Percent="52.5",
	Texture55Percent="5.5",
	Texture57Pt5Percent="57.5",
	Texture5Percent="5",
	Texture60Percent="60",
	Texture62Pt5Percent="62.5",
	Texture65Percent="65",
	Texture67Pt5Percent="67.5",
	Texture70Percent="70",
	Texture72Pt5Percent="72.5",
	Texture75Percent="75",
	Texture77Pt5Percent="77.5",
	Texture7Pt5Percent="7.5",
	Texture80Percent="80",
	Texture82Pt5Percent="82.5",Texture85Percent="85",Texture87Pt5Percent="87.5",Texture90Percent="90",Texture92Pt5Percent="92.5",Texture95Percent="95",Texture97Pt5Percent="97.5",
	TextureCross="light grid",
	TextureDarkCross="dark grid",
	TextureDarkDiagonalCross="dark diagonal trellis",
	TextureDarkDiagonalDown="dark diagonal down stripes",
	TextureDarkDiagonalUp="dark diagonal up stripes",
	TextureDarkHorizontal="dark  horizontal stripes",
	TextureDarkVertical="dark vertical stripes",
	TextureDiagonalCross="diagonal trellis",
	TextureDiagonalDown="diagonal down stripes",
	TextureDiagonalUp="diagonal up stripes",
	TextureHorizontal="Horizontal stripes",
	TextureNone="Clear",
	TextureSolid="solid",
	TextureVertical="Vertical stripes",
; Verbosity options:
; Note to localizers:
;The following constants should only be translated starting with the character after the colon.
; verbosity dlg extra items
;For MSWordVerbosityItems:
jv_documentPresentationSet="|DocumentPresentationSet:Document presentation",
	jvToggleShowBrlProofreadingMark="|ToggleShowBrlProofreadingMark:Braille proofreading indication",
jvToggleSetDesiredUnitOfMeasure="|ToggleSetDesiredUnitOfMeasure:Measurement units",
	jvToggleBorderDetection="|ToggleBorderDetection:Borders",
	jvTogglePictureDetection="|TogglePictureDetection:Pictures",
	jvToggleShadingDetection="|ToggleShadingDetection:Shading detection",
	jvToggleSpellingErrorDetection="|ToggleSpellingErrorDetection:Spelling error detection",
	jvToggleGrammaticalErrorDetection="|ToggleGrammaticalErrorDetection:Grammatical error detection",
	jvToggleExtraHelpIndication="|ToggleExtraHelpIndication:Extra Help",
	jvToggleBookmarkDetection="|ToggleBookmarkDetection:Bookmark indication",
	jvToggleStyleDetection="|ToggleStyleDetection:Style Changes",
	jvToggleNotesDetection="|ToggleNotesDetection:Comments, Footnotes & Endnotes",
	jvToggleRevisionDetection="|ToggleRevisionDetection:Track Changes",
	jvToggleCountBefore="|ToggleCountBefore:Item Counts",
	jvTogglePositionDetection="|TogglePositionDetection:Page Breaks, Tab Position & Multiple Columns",
	jv_vCursorLayoutTables = "|vCursorLayoutTables:Layout Tables",
	jv_vCursorTableTitlesAnnounce = "|vCursorTableTitlesAnnounce:Table Titles Announce",
	jvToggleTableTitleReading="|ToggleTableTitleReading:Title Reading",
	jvSetColumnTitlesRow="|SetColumnTitlesRow:Set Column Titles Row",
	jvSetRowTitlesColumn="|SetRowTitlesColumn:Set Row Titles Column",
	jvClearTitleRowAndColumnDefinition="|ClearTitleRowAndColumnDefinition:Clear Title Definitions",
	jvToggleScheme="|ToggleScheme:Speech and Sound schemes",
	jvToggleOverrideDocNamedTitles="|ToggleOverrideDocNamedTitles:Override named titles",
	jvToggleIndicateBulletType="|ToggleIndicateBulletType:Bullet type indication",
	jvToggleIndicateBrailleBulletType="|ToggleIndicateBrailleBulletType:Braille bullet type indication",
	jvToggleTableDescription="|ToggleTableDescription:Table description",
;keystrokes
	ksReply="CONTROL+r",
	ksControlBackSpace="Control+Backspace",
	ksF4="F4", ;Find in message window of Outlook 2007 and higher
	ksToggleCase="Shift+F3",
	ksGoForward="Alt+RightArrow",
	ksGoBack="Alt+LeftArrow",
	ksHeading2Style="Alt+Control+2",
	ksUndoAutoAction="Alt+Shift+F10",
	ksEmailHeader3="Alt+3",
	ksEmailHeader4="Alt+4",
	ksThesaurus="Shift+F7",
	ksCopyFormat="Alt+Control+c", ; in English
	ksPasteFormat="Alt+Control+v", ; in English
	ksToggleTrackChanges= "Control+Shift+E",
	ksFontDialog="Control+Shift+F",
	ksPointSize="Control+Shift+P",
	ksStyle="Control+shift+S",
	ksToggleBetweenAllAndHeadingsOnly="Alt+Shift+A",
	ksIndent="Control+M",
	ksOutdent="Control+Shift+M",
	ksHangingIndent="Control+T",
	ksRemoveHangingIndent="Control+Shift+T",
	ksCopySelectedTextToClipboard="Control+C",
	ksGrowFont1Point="Control+]",
	ksShrinkFont1Point="Control+[",
	ksGrowFont="Control+Shift+Period",
	ksShrinkFont="Control+Shift+,",
	ksSayFirstCellInColumn="Alt+1",
	ksPreviousItem="Control+PageUp",
	ksNextItem="Control+PageDown",
	ksUpOneLevel="Alt+2",
	ksSelectionByUnitMode="F8",
	ksReduceSelectionUnit="Shift+F8",
	ksSelectionByMovementMode="Control+Shift+F8",
	ksShowHeading1="Alt+Shift+1",
	ksShowHeading2="Alt+Shift+2",
	ksShowHeading3="Alt+Shift+3",
	ksShowHeading4="Alt+shift+4",
	ksShowHeading5="Alt+Shift+5",
	ksShowHeading6="Alt+Shift+6",
	ksShowHeading7 ="Alt+Shift+7",
	ksShowHeading8 ="Alt+Shift+8",
	ksShowHeading9 ="Alt+Shift+9",
	ksSmartTagActionsMenu="Alt+Shift+F10",
	ksToggleWindowState="Alt+F10",
	ksSelectPriorHeadingOrListLevelStyle="Alt+Shift+LeftArrow",
	ksSelectNextHeadingOrListLevelStyle="Alt+Shift+RightArrow",
	ksMoveHeadingUp="Alt+Shift+UpArrow",
	ksMoveHeadingDown="Alt+Shift+DownArrow",
	ksLabelsDlg="Alt+L",
	ksEnvelopesDlg="Alt+E",
	ksGotoPageDlg="Alt+G",
	ksFirstCellInTable="Alt+Control+Home",
	ksNextComment="n",
	ksPriorComment="Shift+n",
	ksReturnToMarkedPlace="Windows+k",
	ksNextTable="t",
	ksPriorTable="Shift+t",
	ks_ShiftF10="Shift+F10",
	ksNextGrammaticalError="a",
	ksPriorGrammaticalError="Shift+a",
	ksNextHeading="h",
	ksPriorHeading="Shift+h",
	ksNextFootnote="o",
	ksPriorFootnote="Shift+o",
	ksNextEndnote="d",
	ksPriorEndnote="Shift+d",
	ksNextBookmark="b",
	ksPriorBookMark="Shift+b",
	ksNextGraphic="g",
	ksPriorGraphic="Shift+g",
	ksNextField="f",
	ksPriorField="Shift+f",
;spellchecker
	SpellcheckFragment="Fragment (consider revising)",
;string compares:
;Style constants, moved from word.hsh
;as these are real human-readable strings, they are presumed to be localizable.
	scHeadingStyle="Heading",
	scTitleStyle="Title",
	sc_normal="Normal",
; next three constants used for phonetic spelling due to chars being obtained from
;Object Model and not OSM
	alphabet="abcdefghijklmnopqrstuvwxyz",
	phoneticDefinitions="Alpha,Bravo,Charlie,Delta,Echo,Foxtrot,Golf,Hotel,India,Juliet,Kilo,Leama,Mike,November,Oscar,Papa,Quebec,Romeo,Sierra,Tango,Uniform,Victor,Whisky,XRay,Yanky,Zulu",
;for the aqctive document name when the document has never been saved:
	scDocument="Document",
;for field types:
	scFieldFillin="FILLIN",
	scFieldOCX="OCX",
	scFieldToc="TOC",
	scFieldPageRef="PageRef",
	scFieldRef="Ref",
	scFieldDate="DATE",
	scFieldTime="TIME",
	scFieldSymbol="SYMBOL",
	scFieldFormula="FORMULA",
	scFieldIndex="INDEX",
	scFieldExpression="EXPRESSION",

	;scOutlook2007Classic="Outlook2007Classic", deprecated
	scNoEndLinks="3|MessageVoice|||",

	scTocFld=" TOC",
	scHeading="Heading",
; for field types:
	sc_embed="EMBED",
; for cursor position message:
	sc_minus=" -",
	scColumn="column",
	scTabStop="tab",
	scFromLeft=" from left", ;keeping the leading space char is important, for announcing location of cursor in document
	scReplace="Replace:",
	; scSentenceTerminator contains only those punctuation marks
	; which can cause Word to calculate an invalid range for a sentence
	scSentenceTerminator=".?!",
	scCellMarker="\13\007", ; end of cell marker
	scVBRet="\r",
	scQuestion="?", ; for custom bullets that do not otherwise calculate properly when tested to speak/display in Braille, often shown as "Windings63" symbol
	scHollowRound="o", ;  for hollow round bullets
	scClassic="Classic",
	scQuote="\"",
	scHyperlink="HYPERLINK",
	scLink="Link",
	scBookmarkName="Enter bookmark name:",
	scBookmarkItem="Bookmark",
	scObjectName="Enter object name:",
	scObjectItem="Object",

;the name of the Search and clear split buttons in the navigation Search pane:
	objn_Search_SplitButton = "Search",
; for objn_Clear_SplitButton, this only appears in some versions of Office 2016 built in 2017 or later.
; The Search split button becomes a Clear split button after one or more search results have happened.
; Do Find | Find Next a time or two, then Search split button becomes Clear.
	objn_Clear_SplitButton = "Clear",
; for objn_NextResult_Button, found in some languages of Office.
; Becomes available after one or more search results have happened.
; Do Find | Find Next a time or two, then Search split button becomes Clear.
	objn_NextResult_Button = "Next result",
; Name of the Property edit field in the advanced Search dialog of the WordXP TaskPane
	scAdvancedSearchProperty="Property:",
; name of the Search In edit field in the Search dialog of the WordXP TaskPane:
	scSearchIn="Search in:",
; name of the value edit field in the advanced Search dialog of the WordXP TaskPane:
	scSearchValue="Value:",
; Underline style combo box name:
	scUnderlineStyle="underline style:",
; prompt terminators
; Used when locating form field prompts.
	scPromptTerminator1=":",
	scPromptTerminator2="?",
	scScrollSymbol="Scroll ", ; ignore scroll symbols when looking at prompt right of object, eg scroll down symbol.
; The following are used in PointsToDefaultUnits in word.hss
	scDecimalPoint=".",
	scEScientific="E",
	scZeroPoint="0.",
	scZeros="00000",
	scZero="0",
; end of pointsToDefaultUnits constants

; Command bars and buttons
cbOutlining="Outlining",
btnAll="All",
btnHeading1="Show Heading 1",
btnHeading2="Show Heading 2",
btnHeading3="Show Heading 3",
btnHeading4="Show Heading 4",
btnHeading5="Show Heading 5",
btnHeading6="Show Heading 6",
btnHeading7="Show Heading 7",
btnFirstLineOnly="First Line Only View",
; following are several constants for Word XP and Word 11 outlining Show Levels toolbar listbox control.
; In prior versions of Word, these were buttons on the Outlining toolbar.
; We need to use these to test for various heading levels and/or all levels choice made by user.
lbxShowLevel="Show Level",
lbxOutlineLevel="Outline Level",
scShowLevel1_2003="Show Level 1",
scShowLevel1_2007="Level 1",
scShowLevel2_2003="Show Level 2",
scShowLevel2_2007="Level 2",
scShowLevel3_2003="Show Level 3",
scShowLevel3_2007="Level 3",
scShowLevel4_2003="Show Level 4",
scShowLevel4_2007="Level 4",
scShowLevel5_2003="Show Level 5",
scShowLevel5_2007="Level 5",
scShowLevel6_2003="Show Level 6",
scShowLevel6_2007="Level 6",
scShowLevel7_2003="Show Level 7",
scShowLevel7_2007="Level 7",
scShowLevel8_2003="Show Level 8",
scShowLevel8_2007="Level 8",
scShowLevel9_2003="Show Level 9", ; body text, equivalent to Headings only" in prior versions of Word.
scShowLevel9_2007="Level 9", ; body text, equivalent to Headings only" in prior versions of Word.
scShowAllLevels_2003 ="Show All Levels",
scShowAllLevels_2007 ="All Levels",

; border style listbox control name, requires special handling with MSAA
SDMBorderStyleListbox="Style:",
; border art combo box control name, requires special handling with MSAA
SDMBorderArtComboBox="Art:",
; border shading UpDown scroll bar control name, requires special handling with MSAA
SDMBorderShadingScrollBar="Shading:",
; for ole object classes (OLE object recognition)
	scMSForms="forms",
	scTypeForm="FORM", ; for form field detection
	scChkBox="checkbox",
	scOptionButton="optionButton",
	scLstBox="listBox",
	scComboBox="ComboBox",
	scScrlBar="ScrollBar",
	sc_WordApp= "Word.Application",
	sc_2 = "0",
	sc_3 = ".",
	sc_4 = "_",
; end of OLE recognition info
; for help balloons
	scBallon="Ballon",
	sc_toc="_Toc", ; for table of contents subaddress
; Language strings as appearing in the JAWS Synth Language Menu
; These are used when language detection is enabled to switch Eloquence to the
;detected language.
; see word.hsh for the MSWord constants for the language IDS
; Eloquence:
eloqAmericanEnglish="American English",
eloqBritishEnglish="British English",
eloqFrench="French",
eloqGerman="German",
eloqItalian="Italian",
eloqCastilianSpanish="Castilian Spanish",
eloqLatinAmericanSpanish="Latin American Spanish",
eloqBrazilianPortuguese="Brazilian Portuguese",
EloqFinnish="Finnish",
; synthesizers other than Eloquence
SynthAmericanEnglish="English (U.S.)",
SynthBritishEnglish="English (U.K.)",
SynthFrench="French",
SynthCanadianFrench="French (Canada)",
SynthGerman="German",
SynthItalian="Italian",
SynthCastillianSpanish="Castillian Spanish",
SynthLatinAmericanSpanish="Latin American Spanish",
SynthPortuguese="Portuguese",
SynthFinnish="Finnish",
SynthRussian="Russian",
SynthArabic="Arabic",
SynthGreek="Greek",
SynthDutch="Dutch",
SynthCatalan="Catalan",
SynthCroatian="Croatian",
SynthRomanian="Romanian",
SynthCzech="Check",
SynthSlovak="Slovak",
SynthWelsh="Welsh",
SynthDanish="Danish",
SynthSwedish="Swedish",
SynthNorwegian="Norwegian",
SynthPolish="Polish",
SynthMalaysian="Malaysian",
SynthIndonesian="indonesian",
SynthJapanese="japanese",
SynthChinese="Chinese",
SynthTurkish="Turkish",
SynthSwahili="Swahili",
SynthIcelandic="icelandic",
SynthGaelicIreland="Gaelic Ireland",
SynthMaltese="Maltese",
SynthBulgarian="Bulgarian",
SynthLithuanian="Lithuanian",
SynthLatvian="Latvian",
SynthEstonian="Estonian",

;button names in the Spell Check dialog:
	scUndoEditBtn="Undo Edit",
	scResumeBtn="Resume",
;object value string for no selected item:
	scNoSelectedItem="No selected item",
;on-screen text for no spelling suggestions:
	scNoSpellingSuggestions="(no spelling suggestions)",
;scSpellCheckDelimiter appears before and after misspelled words and suggestions that are spaced out in the Microsoft Editor issue checker.
;As an example, use the following sentence in a Word 365 document and press F7 to go to spell check:
;This is a tesst.
;The element that indicates the misspelled word should read like the following line:
;Misspelled, tesst, t e s s t, This is a tesst.
;The first suggestion that is offered should read like the following line:
;test, t e s t, similar to examination, tryout, trial
;scSpellCheckDelimiter refers to the first two commas in both cases.
	scSpellCheckDelimiter = ",",
; for formatting in Find and Replace dialog:
	sc_Format="Format:",
	sc_NotBold="Not Bold",
	sc_notItalic="Not Italic",
	sc_NoUnderline="No underline",
	scWindows="Windows", ;formerly in word quicknav.jsm
; window names:
; For wn_AppStore, Windows 8.1 Word 2013:
; Insert ribbon tab, Store button in Apps group,
; get window name from Script Utility Row.
	wn_AppStore = "App",
;for Options dialog page names:
	wn_ViewPage="View",
	wn_GeneralPage="General",
	wn_EditPage="Edit",
	wn_PrintPage="Print",
	wn_SavePage="Save",
	wn_SpellingAndGrammarPage="Spelling and Grammar",
;wn_Editor applies to Office O365.
;It is the name of the ancestor object for the spell and grammar check pane.
;In script utility mode, you can use Alt+Control+F9 to see the focus object and its ancestors,
;or you can use the touch cursor advanced properties to see the information about the object at the touch cursor.
;The object whose name we want has a class of NetUInetpane,
;and is a UIA type of custom control.
	wn_Editor = "Editor",
	wn_SearchResultsList = "Search results list.",;parent of search results from find
;For wn_Proofing_Pane_Spelling	 and wn_Proofing_Pane_Grammar, the text = the object name of the parent object.
	wn_Proofing_Pane_Spelling = "Spelling",
	wn_Proofing_Pane_Grammar = "Grammar",
	wn_WordCountDialog = "Word Count",
	wn_SecurityPage="Security",
	wn_TrackChangesPage="Track Changes",
	wn_UserInformationPage="User Information",
	wn_CompatibilityPage="Compatibility",
	wn_FileLocationsPage="File Locations",
	wn_symbol="Symbol", ; Symbols dialog
	wn_TextFormFieldOptions="Text Form Field Options", ;form properties window
	wn_DropdownFormFieldOptions="Drop-Down Form Field Options",
	wn_security="Security",
	wn_GrammarSettings="Grammar Settings",
	wn_SelectNames="Select Names", ; for Outlook address book when Word is being used as the editor
	wn_SelectName="Select Name",
	wn_properties="Properties",
	wn_Info="Information",
	wn_macro="Macro", ; for macros dialog.
	wn_GoToPage="Go To",
	wn_NewAddressList="New Address List",
	wn_MailMergeRecipients="Mail Merge Recipients",
	wn_FontSize="Font Size",
	wn_spelling="Spelling:", ; for use with Outlook before sending
	wn_2010WordNavigationPane = "Navigation", ;2010 Find and Replace, or when user checks Navigation pane from the View ribbon
	wn_InfoTab = "Info",	; the name of the info tab from file menu in Word 2013.
; sound filename
	snElementNotFound="HarpString.wav",
; types of quick keys
	Pages="pages",
	SpellingErrors="spelling errors",
	GrammaticalErrors="grammatical errors",
	Revisions="revisions",
	Graphics="graphics",
	Sections="sections",
	Bookmarks="bookmarks",
	Headings="headings",
	Tables="tables",
	Comments="comments",
	Footnotes="footnotes",
	Endnotes="endnotes",
	Fields="fields",
	ComboBoxes="ComboBox formfields",
	Checkboxes="Checkbox formfields",
	EditFormfields="Edit formfields",
	on_MessageField = "Message",

;For Word 2010/2007 Multilevel list grid items
;object names in multilevel list, Home ribbon:
	UIAName_pane_MultilevelList = "Multilevel List", ;UIA ancestor to list item in multilevel list grid
	UIAName_Group_ListLibrary = "List Library" ;UIA parent object of library list item
Messages
;msgMultilevelListNamesFromWord2003 is a multiline message,
;where each line is the name of the multilevel list object from the Word 2003 dialog for bullets and numbered lists.
;These names taken from Word 2003 are to be used in Word 2007/2010 as substitutes for the long multilevel list names.
;Note that the first multilevel list is simply "None", and needs no short name substitution,
;therefore it is not included in this message.
;The object names, or lines in the message, are listed in the order detected by PositionInGroup,
;so that the first name starts with the object at position "2 of 8",
;and the last name ends with the object at position "8 of 8".
;It is imparitive that this order be preserved so that the Word 2007/2010 multilevel list items are identified correctly.
@msgMultilevelListNamesFromWord2003
1) a) i) indented
1. 1.1. 1.1.1. Indented
Changing Bullets Indented
Article 1 Section 1 (a)
1. 1.1. 1.1.1. with Heading, Indented
1. A. 1. with Heading
Chapter and Headings
@@
EndMessages

Messages
@msgWAppStart1_L
For %product% Hotkey Help with Microsoft Word use %keyFor(hotkeyHelp).
For a list of MSWord short cut keys use  %KeyFor(WindowKeysHelp).
To hear the %product% help topic for Microsoft Word press insert+f1 twice quickly.
@@
@msgWAppStart1_S
For hotkey help use %KeyFor(hotkeyHelp).
For MSWord shortcut keys use  %KeyFor(WindowKeysHelp).
%product% help topic for Microsoft Word insert+f1 twice quickly.
@@
; verbosity toggle options:
@msg_OnCount
On + Count
@@
@msgSpeakRevType_l
Speak Type
@@
@msgSpeakRevTypeAuthor_L
Speak Type and Author
@@
@msgSpeakRevTypeAuthorDate_L
Speak Type, Author, and Date
@@
@msgSpeakRevTypeCount_l
Speak Type + Count
@@
@msgSpeakRevTypeAuthorCount_L
Speak Type and Author + Count
@@
@msgSpeakRevTypeAuthorDateCount_L
Speak Type, Author, and Date + Count
@@
@msgNotesIndication
Indicate annotations
@@
@msgNotesAndDetails
Indicate annotations and speak content
@@
@msgNotesDetail
Speak annotation content only
@@
@msgSchemeNameDoc
document specific
@@
@msgSchemeNameApp
always the same
@@
; for msgTableSpacingHelp, and all of the msgTablePaddingHelp messages,
; %1 is the number of points
@msgTableSpacingHelp_L
Spacing between cells in the table is %1 points.
@@
@msgTableSpacingHelp_S
Table spacing is %1 points
@@
@msgTableTopPaddingHelp_L
Table top padding is %1 points.
@@
@msgTableTopPaddingHelp_S
Table top padding is %1
@@
@msgTableBottomPaddingHelp_L
Table bottom padding is %1 points.
@@
@msgTableBottomPaddingHelp_S
Table bottom padding is %1
@@
@msgTableLeftPaddingHelp_L
Table left padding is %1 points.
@@
@msgTableLeftPaddingHelp_S
Table left padding is %1
@@
@msgTableRightPaddingHelp_L
Table right padding is %1 points.
@@
@msgTableRightPaddingHelp_S
Table right padding is %1
@@
@msgTableAutoFitHelpOn
Table will automatically resize to fit content.
@@
@msgTableAutoFitHelpOff
Table will not automatically resize to fit content.
@@
; table title reading
@msgReadColumnTitles1_L
Read Column Titles
@@
@msgReadRowTitles1_L
Read Row Titles
@@
@msgReadBothTitles1_L
Read Both Titles
@@
@msgNoChangeInTableSetting
No Change
@@
@msgCantDefineForNestedTable1_L
Can't Define For Nested Table
@@
;for msgNotDefinedForTable1_L, %1=table number
@msgNotDefinedForTable1_L
Not Defined for Table %1
@@
; for msgSetRowTitlesColumn_L/S, %1=column number, %2=table number
@msgSetRowTitlesColumn1_L
Column %1 in Table %2
@@
@msgColumnTitle
Column Title
@@
@msgRowTitle
Row Title
@@
@msgSetRowTitlesColumn2_L
Not in a Table
@@
; for msgSetColTitlesRow_L/S, %1=row number, %2=table number
@msgSetColTitlesRow1_L
Row %1 in Table %2
@@
@msgSetColTitlesRow2_L
Not in a Table
@@
@msgUndefined
Undefined
@@
;for msgLanguageDetectionOn1_L, %1=language name
@msgLanguageDetectionOn1_L
On: %1
@@
@msgAllowJAWSAndInvisibleToDetectContextOff1_L
PCCursor Will Detect Context
@@
@msgAllowJAWSAndInvisibleToDetectContextOn1_L
All Cursors Will Detect Context
@@
@msgCountItemsBeforeSpeakingOff1_L
Speak After Text
@@
@msgCountItemsBeforeSpeakingOn1_L
Speak Before Text
@@
; for msgBuildNo (used in sayAppVersion), %1=appName, %2=build number
@msgBuildNo1
%1 %2
@@
; for XOfY1, %1=X, %2=Y. This is used to add an item count for partial
;processing to dialog titles such as SelectAField, selectAHyperlink etc.
; when processing is interruptted and the resulting list contains an
;incomplete list of items.
; also used when constructing OLE listbox item counts
@msgXOfY1
%1 of %2 items
@@
; msgPToDURetVal is used in PointsToDefaultUnits to construct the return value
;%1=measure and %2=unit, eg 1.25 centimeters
@msgPToDURetVal1
%1 %2
@@
; for units of measure
@msgPixels
pixels
@@
@msgSpaces
spaces
@@
@msgInches1_L
Inches
@@
@msgMillimeters1_L
Millimeters
@@
@msgCentimeters1_L
Centimeters
@@
@msgPicas1_L
Picas
@@
@msgPoints1_L
Points
@@
; text identifying the save dialog when exiting Word
; special handling is required when saving to floppy to avoid an IPF error
@msgSaveChanges1
Do you want to save the changes you made to
@@
@msgIndent1_L
indent
@@
@msgIndent1_S
indent
@@
@msgOutDent1_L
out dent
@@
@msgOutdent1_S
out dent
@@
@msgHangingIndent1_L
hanging indent
@@
@msgHangingIndent1_S
hanging indent
@@
@msgRemoveHangingIndent1_L
hanging indent removed
@@
@msgRemoveHangingIndent1_S
hanging indent removed
@@
; for msgFirstLineIndented_L/s, msgParaHangingIndent_l/s,
;msgLeftIndent/rightIndent_L/s, %1 is a value returned from
;pointsToDefaultUnits in word.hss, ie x centimeters, x inches etc.
@msgFirstLineIndented1_L
first line indented by %1
@@
@msgFirstLineIndented1_S
first line indented %1
@@
@msgParaHangingIndent1_L
hanging indent of %1
@@
@msgParaHangingIndent1_S
hanging indent %1
@@
@msgLeftIndent1_L
left indent of %1
@@
@msgLeftIndent1_S
left indent %1
@@
@msgRightIndent1_L
right indent of %1
@@
@msgRightIndent1_S
right indent %1
@@
; for msgCellHelp1/2_L/S, %1=current col, %2=current row,
;%3=table number, %4=table row count, %5=table col count.
@msgCellHelp1_L
This is a cell in column %1 row %2 in table %3
which has %4 rows and %5 columns.
@@
@msgCellHelp1_S
cell in column %1 row %2
table %3
%4 rows
%5 columns
@@
@msgCellHelp2_L
This is a cell in column %1 row %2 in table %3
which has %4 rows.
The table is non-uniform, which means that each row may have a varying number of columns, or a cell may span more than one row.
This particular row has %5 columns.
@@
@msgCellHelp2_S
cell in column %1 row %2
table %3
%4 rows
non-uniform
%5 columns in this row
@@
@msgRowSpan
At least one cell in this table spans more than one row.
@@
@msgColumnSpan
At least one cell in this table spans more than one column.
@@
; The following two messages are used to announce type of table.
@msgNonuniformTable
Nonuniform Table
@@
@MsgUniformTable
uniform Table
@@
@msgCellFitTextHelp_L
The size of text in this cell will be visually reduced to fit within the column width.
@@
@msgCellFitTextHelp_S
Text in this cell will be visually reduced to fits within the column width
@@
@msgReadCellLine1_L
Pressing up or down arrow will read lines within the cell.
To move from cell to cell use tab and shift tab.
When you tab to a cell, its contents are automatically selected.
To hear the contents of the current cell, use %keyFor(SayWindowPromptAndText).
To hear the cell coordinates, use %KeyFor(readWordInContext).
@@
@msgReadCellLine1_S
up or down arrow will read lines within cell
move between cells with Tab and Shift Tab
@@
@msgMainDocWindow1_L
This is a document window.
@@
@msgCommentPaneInDocument
This is the comment pane of the active document.
@@
@msgFootnotePaneInDocument
This is the footnote pane of the active document.
@@
@msgEndnotePaneInDocument
This is the endnote pane of the active document.
@@
@msgTextAreaOfOpenDocument1_L
This is the text area of an open document.
@@
@msgTextAreaOfOpenDocument1_S
text area of open document
@@
; for msgTable_L/S, %1 is the table number
@msgTableNumber
 table %1
@@
@msgTable
table
@@
@msgTableEnd
Table end
@@
@msgNonUniform1_L
non uniform table
@@
;for msgWarningColumnCountChange_L/S, %1=new column count, %2=old column count
@msgWarningColumnCountChange_L
Number of columns changed to %1 from %2
@@
@msgWarningColumnCountChange_S
column count now %1
@@
;for msgWarningRowCountChange_L/S, %1=new row count, %2=old row count
@msgWarningRowCountChange_L
Number of Rows changed to %1 from %2
@@
@msgWarningRowCountChange_S
Row count now %1
@@
; for msgDestination1/Source1_L/S,  %1=folder name
@msgDestinationFolder1_L
The selected destination folder is %1
@@
@msgDestinationFolder1_S
destination folder %1
@@
@msgSourceFolder1_L
The selected source folder is %1
@@
@msgSourceFolder1_S
source folder %1
@@
@msgBack1_L
Back
@@
@msgUpOneLevel1_L
Up one level
@@
; for msgPrevItem and msgNextItem messages, %1 is the type of object, page by default.
@msgNextItem
Next %1
@@
@msgPrevItem
Previous %1
@@
@msgPage
page
@@
@msgEdit
edited text
@@
@msgComment
comment
@@
;msgCommentMessageBoxTitle is used by MAGic to post comment:
@msgCommentMessageBoxTitle
Comment
@@
@msgEndnote
endnote
@@
@msgFootnote
footnote
@@
@msgSection
section
@@
@msgField
field
@@
@msgFind
occurrence
@@
@msgGotoBookmark
bookmark
@@
@msgGoToObject
object
@@
@msgGotoLine
line
@@
@msgGraphic
graphic
@@
@msgHeading
heading
@@

@msgForAccurate1_L
For the accurate point size of the printed document use the PC cursor with this function.
@@
@msgInsertionPointFormatting1_L
Insertion point formatting
@@
@msgCurrentCharFormatting1_L
Character formatting:
@@
@msgDoubleStrikeThrough1_L
Double strike through
@@
@msgStrikeThrough1_L
Strike through
@@
@msgShadowed1_L
Shadowed
@@
@msgSubscript1_L
Subscript
@@
@msgSuperscript1_L
Superscript
@@
@msgOutlined1_L
Outlined
@@
@msgEmbossed1_L
Embossed
@@
@msgEngraved1_L
Engraved
@@
@msgSmallCaps1_L
small caps
@@
@msgHidden1_L
Hidden
@@
@msgHighlighted1_L
Highlighted
@@
@msgMixedStyle
Mixed style
@@
@msgMixedFont1_L
Mixed font
@@
; for msgPoint_L/s, %1=number of points. This is used in sayFont in word.hss to speak the font size
@msgPoint1_L
%1 point
@@
@msgPoint1_S
%1
@@
@msgMixedSize1_L
Mixed point size
@@
@msgMixedSize1_S
Mixed size
@@
@msgParagraphFormatting
Paragraph formatting:
@@
@msgMixedAlignment
Mixed alignment
@@
;for  msgOutlineLevel_L/s, %1=outline level ie 1, 2, 3, or body text.
@msgOutlineLevel1_L
Outline level: %1
@@
@msgOutlineLevel1_S
level %1
@@
@msgBodyText
body text
@@
; for ScriptFileName, configuration mname
;Note that the version of Word is not being reported for versions 2016 and O365,
;and that versions 2013 and earlier are reported as Word Classic.
@msgWordForWindowsAppName
Microsoft Word
@@
@msgWordForWindowsWDAGAppName
Microsoft Word in Windows Device Application Guard
@@
@msgWordForWindowsClassicAppName
Word Classic
@@
@msgFontOnToolbar1
Font
@@
@msgPointSizeOnToolbar1
point size
@@
@msgStyleOnToolbar1
style
@@
; for msgStyle_l/s, %1 is the name of the style to be spoken
@msgStyle1_L
%1 style
@@
@msgStyle1_S
%1
@@
; for the Spelling dialog
@msgNoSpellingSuggestions1_L
No spelling suggestions
@@
@msgNoSuggestions1_L
No suggestions
@@
; for table handling
; for msgTableCoordinates_L/S, %1=column number, %2=row number
@msgTableCoordinates1_L
column %1 row %2
@@
@msgTableCoordinates1_S
col %1 row %2
@@
; for msgColumnIndex_L/S and msgRowIndex_L/S, %1 is the number of the row or column
@msgColumnIndex_L
Column %1
@@
@msgColumnIndex_S
Col %1
@@
@msgRowIndex_L
Row %1
@@
@msgRowIndex_S
Row %1
@@
@msgNewRow
new row
@@
@msgFirstColumn
first column in table
@@
@msgLastColumn
last column in table
@@
@msgFirstRow
first row in table
@@
@msgLastRow
last row in table
@@
; msgTableListItem is used in selectATable function
;%1=index, %2=table column count and %3=table row count
@msgTableListItem1
%1: %2 columns by %3 rows
@@
@msgTableColumn1_L
column %1 of %2
@@
@msgTableColumn1_S
col %1
@@
@msgTableRow1_L
row %1 of %2
@@
;for msgRow1_L/S, %1 is the row number
@msgTableRow1_S
row %1
@@
@msgRow1_L
Row %1
@@
@msgRow1_S
%1
@@
;for msgRow/ColumnNoTitle, %1=col/row index
@msgColumnNoTitle
 Column %1 no title
@@
@msgRowNoTitle
 Row %1 no title
@@
@msgLineAndColumn
line %1 column %2
@@
@msgSettingGlobalTitleRow1_L
Since you are not in a table, the global title row will default to 1.
@@
@msgSettingGlobalTitleRow1_S
global title row=1
@@
@msgBottomOfTable1_L
bottom of table
@@
@msgSettingGlobalTitleCol1_L
Since you are not in a table, the global title column will default to 1.
@@
@msgSettingGlobalTitleCol1_S
global title col=1
@@
@msgTopOfTable1_L
top of table
@@
@msgStartOfRow1_L
start of row
@@
@msgClearDefinitions1_L
Table %1 Definitions Cleared
@@
@msgClearDefinitions2_L
Default Table Definitions Cleared
@@
@msgClearSchemeDefinitions1
DEFAULT scheme definitions cleared
@@
@msgClearSchemeDefinitions2
scheme definitions cleared
@@
@msgTableToText1_L
Table converted to text
@@
; checkbox states
@msgNotChecked1
unchecked
@@
@msgSelected1
selected
@@
@msgNotSelected1
not selected
@@
@msgDisabled1
disabled
@@
@msgZeroItems1
0 items
@@
; for msgMultiselect, %1=class type
@msgMultiSelect1
multi select %1
@@
@msgNoSelection1
no selection
@@
@msgNoFields1_L
no fields
@@
@msgNoFormFields1_L
no form fields
@@
@msgNotInDocumentWindow1_L
 You must be in the main document window and in an open document to use this feature.
@@
;message content changed from "Select a field" to "List Fields" for consistency with other similar listing dialogs.
@msgSelectAFieldDialogName1_L
List Fields
@@
;message content changed from "Select a table" to "List Tables" for consistency with other similar listing dialogs.
@msgSelectATableDialogName1_L
List Tables
@@
@msgSelectAListDialogName1_L
List Lists
@@
@msgOutOfFormField1_L
out of form field
@@
@msgOutOfFormField1_S
out of form field
@@
@msgOutOfField1_L
out of field
@@
@msgOutOfField1_S
out of field
@@
; for msgField1, %1=field type
@msgField1
 %1 field
@@
@msgNoLists1_L
no lists
@@
@msgNoTables1_L
no tables
@@
@msgLastCell1_L
Last cell in table.
@@
@msgLastCell1_S
Last cell
@@
@msgWarningCreateCells1_L
Warning! Pressing tab here adds an extra row.
@@
@msgWarningCreateCells1_S
Pressing tab here adds an extra row
@@
@msgOutOfTable1_L
out of table
@@
@msgOutOfTable1_S
out of table
@@
@msgEndOfRowMark1_L
end of row marker
@@
@msgEndOfRowMark1_S
row marker
@@
@msgBlankCell1_L
blank cell
@@
@msgThisTableIsNested1_L
This table is nested within another table.
@@
@msgNestingExplanation1_L
The outermost table has a nesting level of 1. The nesting level of each successively nested table is one higher than the previous table.
@@
@msgTopLevel1_L
top level
@@
@msgTopLevel1_S
top level
@@
; for msgNestingLevel_L/S, %1=the nesting level of the current table or list
@msgNestingLevel1_L
nesting level %1
@@
@msgNestingLevel1_S
level %1
@@
@msgMisspelled1_L
Misspelled word
@@
@msgMisspelled1_S
misspelled
@@
@msgError
Error!
@@
; for msgErrors1_L, %1=number of proofreading errors on the current line
@msgErrors1_L
%1 errors
@@
@msgOneError1_L
1 error
@@
; for msgReferences1_L, %1=number of references on the current line
@msgReferences1_L
%1 references
@@
@msgOneReference1_L
1 reference
@@
@msgOneField1_L
1 field
@@
; for msgFields_L, %1=field count
@msgFields1_L
%1 fields
@@
@msgOneRevision1_L
1 revision
@@
; for msgRevisions1_L, %1=field count
@msgRevisions1_L
%1 revisions
@@
@msgOutOfSpellingError1_L
out of spelling error
@@
@msgOutOfSpellingError1_S
out of error
@@
@msgSpellingError1_L
spelling error
@@
@msgSpellingError1_S
spelling
@@
@msgOutOfGrammaticalError1_L
out of grammatical error
@@
@msgOutOfGrammaticalError1_S
out of error
@@
@msgGrammaticalError1_L
grammatical error
@@
@msgGrammaticalError1_S
grammar
@@
;for msgRevAuthor_L/S, %1=author's name
@msgRevAuthor_L
revised by %1
@@
@msgRevAuthor_S
by %1
@@
;for msgRevDate_L/S, %1=revision date
@msgRevDate_L
on %1
@@
@msgRevDate_S
%1
@@
@msgOutOfRevision1_L
Out of revision
@@
@msgOutOfRevision1_S
Out of revision
@@
@msgNoSelectedRevision1_L
No selected revision, press the find forward or find backward button to locate the first revision.
@@
@msgCommentedText1_L
commented text
@@
@msgCommentedText1_S
commented
@@
@msgOutOfCommentedText1_L
out of commented text
@@
@msgOutOfCommentedText1_S
out of commented text
@@
@msgNoComment1_L
No comment mark at cursor.
@@
;for msgInsertingComment, %1 is the number of the comment, %2, the author, and %3, the initials.
@msgInsertingComment
Inserting Comment %1 by %2 (%3)
@@
@msgHeaderFooter1_L
This is the Header and Footer pane.
To move between the Header and Footer use up and down arrows.
To close this pane,
select Normal from the View Menu.
@@
@msgHeaderFooter1_S
Header and Footer pane.
move between Header and Footer use up and down arrows.
To close this pane select Normal View
@@
@msgFootnoteAreaFootnoteEndnotePane1_L
This is the Footnotes area of the Footnote and EndNote pane.
To close this pane, uncheck the Footnotes option on the View Menu.
@@
@msgFootnoteAreaFootnoteEndnotePane1_S
Footnotes area
Footnote and EndNote pane.
to close this pane, uncheck the Footnotes option on the View Menu.
@@
@msgFootnoteAreaFootnoteEndnotePane2_L
This is the Footnotes area.
To return to the document, arrow up into the document..
@@
@msgEndnoteAreaFootnoteEndnotePane1_L
This is the endNotes area of the Footnote and EndNote pane.
To close this pane, uncheck the Footnotes option on the View Menu.
@@
@msgEndnoteAreaFootnoteEndnotePane1_S
endNotes area
Footnote and EndNote pane.
to close this pane, uncheck the Footnotes option on the View Menu.
@@
@msgEndnoteAreaFootnoteEndnotePane2_L
This is the endNotes area.
To return to the document area, arrow up out of the pane into the document.
@@
@msgCommentPane1_L
This is the comments pane.
To close this pane
uncheck the Comments option on the View Menu.
@@
@msgCommentPane1_S
comments pane.
close this pane, uncheck Comments option on View Menu.
@@
@msgCommentPane2_L
This is the comments pane.
To close this pane, press escape.
@@
; following used in switch panes function
@msgFootnotePane1
footnote pane
@@
@msgEndNotePane1
endNote pane
@@
@msgCommentPane2
comment pane
@@
@msgHeaderFooterPane1
header footer pane
@@
; for msgDocumentPane, %1=pane number
@msgDocumentPane1
document pane %1
@@
; for msgDocFramePane, %1=frame name, %2=pane number
@msgDocFramePane1
Frame %1 document pane %2
@@
; for msgWindowSplit1_L/S, %1=number of panes, %2=current pane number
@msgWindowSplit1_L
The window is split into %1 panes.
The cursor is in pane %2.
The frame in this pane is %3
To switch between panes use f6.
@@
@msgWindowSplit1_S
%1 panes.
pane %2.
frame %3
switch panes use f6.
@@
; for msgWindowSplit2_L/S, %1=number of panes, %2=current pane number
@msgWindowSplit2_L
The window is split into %1 panes.
The cursor is in pane %2.
To switch between panes use f6.
@@
@msgWindowSplit2_S
%1 panes.
pane %2.
To switch between panes use f6.
@@
@msgSectionDesc1_L
The document has %1 section(s).
The cursor is in section %2.
@@
@msgSectionDesc1_S
section %1 of %2
@@
;for msgHeader/Footer messages:
;%1 is the header or footer text
;%2 is the page number position
;msgHasHeader/Footer messages do not include text or page numbers,
;they are spoken when navigating only to indicate the presence or headers or footers in a section.
@msgPrimaryHeader1
Page Header: %1, %2
@@
@msgHasPrimaryHeader
Has Page Header
@@
@msgHeaderFirstPage1
First Page Header: %1, %2
@@
@msgHasHeaderFirstPage
Has First Page Header
@@
@msgHeaderEvenPages1
Even Page Header: %1, %2
@@
@msgHasHeaderEvenPages
Has Even Page Header
@@
@msgPrimaryFooter1
Page Footer: %1, %2
@@
@msgHasPrimaryFooter
Has Page Footer
@@
@msgFooterFirstPage1
First Page Footer: %1, %2
@@
@msgHasFooterFirstPage
Has First Page Footer
@@
@msgFooterEvenPages1
Even Page Footer: %1, %2
@@
@msgHasFooterEvenPages
Has Even Page Footer
@@
;msgSectionHasHeadersFooters is used to announce the presence of headers and footers when a document opens,
;or when focus switches to a document in Section 1, usually with Alt+Tab.
;%1 is the section number, for now it will be 1,
;%2 is one of the msgHasHeader/Footer messages above.
@msgSectionHasHeadersFooters
Section %1 %2
@@
; for msgSectionColumnDescEven_L/S,
;%1=number of columns,
;%2=width of column returned as value from pointsToDefaultUnits ie x centimetres etc.
;%3=width of gap between columns returned as value from pointsToDefaultUnits ie x centimetres etc.
@msgSectionColumnDescEven1_L
The section contains %1 newspaper style columns which are %2 wide.
The columns are evenly spaced.
The gap between columns is %3 wide.
@@
@msgSectionColumnDescEven1_S
%1 evenly spaced newspaper columns
%2 wide.
%3 gap
@@
@msgSectionColumnDescVary1_L
The section contains %1 newspaper style columns which vary in width.
Each column's width and gap is as follows:
@@
@msgSectionColumnDescVary1_S
%1 varying width newspaper columns
widths and gaps are as follows:
@@
@msgColumnDesc1_L
column %1 is %2 wide with %3 spacing after.
@@
@msgColumnDesc1_S
column %1: %2 wide, %3 after.
@@
                    @msgLineBetween1_L
There is a vertical line between the columns.
@@
; for msgMirrorMargins_L/S and msgMargins|L/S,
;%1=left, %2=right, %3=top and %4=bottom margin as value returned from
;pointsToDefaultUnits function, eg 1.25 inches etc.
@msgMirrorMargins1_L
Margins for this section are set as follows:
Mirror Margins are set:
		 inside %1
		 outside %2
top %3
bottom %4
@@
@msgMirrorMargins1_S
Mirror Margins:
inside %1
		 outside %2
top %3
bottom %4
@@
@msgMargins1_L
Margins for this section are set as follows:
left %1
right %2
top %3
bottom %4
@@
@msgMargins1_S
Margins:
left %1
right %2
top %3
bottom %4
@@
; for msgCellWidth_L/S, %1=value returned from pointsToDefaultUnits in word.hss
; eg 3 centimetres, 5 inches etc.
@msgCellWidth1_L
cell width is %1
@@
@msgCellWidth1_S
cell width is %1
@@
@msgCellHeightAuto1_L
cell height changes automatically.
@@
@msgCellHeightAuto1_S
cell height auto
@@
; for msgCellHeightAtLeast_L/S and msgCellHeightExactly_L/S, %1 is value
;returned from pointsToDefaultUnits in word.hss, ie 3 centimetres, 5 inches, etc.
@msgCellHeightAtLeast1_L
cell height is at least %1
@@
@msgCellHeightAtLeast1_S
cell height is at least %1
@@
@msgCellHeightExactly1_L
cell height is %1
@@
@msgCellHeightExactly1_S
cell height is %1
@@
; picture description
; for msgPictureDesc, %1=altText, %2=type.
;width and height is returned through SelectionContextChangedEvent.
@msgPictureDesc1
%1 %2
@@
@msgInterrupted1_L
Operation interrupted at user's request.
@@
; for msgPleaseWait_L/S, %1=number of items to process
@msgPleaseWait1_L
Please wait processing %1 items
@@
 @msgPleaseWait1_S
 processing %1 items
 @@
; MSWord options:
@msgSpellingIsCheckedAsYouType1_L
Spelling is checked as you type.
@@
@msgGrammarIsCheckedAsYouType1_L
Grammar is checked as you type.
@@
@msgTrackChangesIsEnabled1_L
Track Changes is enabled.
@@
; border Text Units
@msgBorderedText
bordered text
@@
@msgBorderedSection
bordered section
@@
@msgOutOfBorderedText
out of bordered text
@@
@msgOutOfBorderedParagraph
out of bordered paragraph
@@
@msgOutOfBorderedSection
out of bordered section
@@
; next border messages used when describing borders
@msgCellBorder
Cell Border
@@
@msgTableBorder
Table Border
@@
@msgParagraphBorder
Paragraph Border:
@@
@msgTextBorder
Text Border:
@@
@msgSectionBorder
Section Border:
@@
; for msgBorderLine, %1 is the border style (string) returned from getBorderLineStyle in word.hss
@msgBorderLine1
%1 line
@@
; for msgBorderDetailedDesc1, %1=textUnit, %2=color description,
;%3=border line style, %4=border line width, %5=border art style
@msgBorderDetailedDesc1
%1: surrounding %2 %3 with width of %4 and art style %5.
@@
; for msgBorderDetailedDesc2, %1=textUnit, %2=color description,
;%3=border line style, %4=border line width
@msgBorderDetailedDesc2
%1: surrounding %2 %3 with width of %4.
@@
; for noncontiguous borders or borders whose style etc changes from component
;to component
;for msgBorderTextUnit, %1 is the text unit.
@msgBorderTextUnit1
%1:
@@
; for msgBorderDetailedDesc3, %1=border name (eg top, left, etc), %2=color description,
;%3=border line style, %4=border line width, %5=border art style
@msgBorderDetailedDesc3
%1=%2 %3 with width of %4 and art style %5.
@@
; for msgBorderDetailedDesc4, %1=border name, %2=color description,
;%3=border line style, %4=border line width
@msgBorderDetailedDesc4
%1=%2 %3 with width of %4.
@@
@msgCursorNotWithinBorderedRegion1_L
The cursor is not within a bordered region.
@@
@msgFunctionUnavailableWhenDocProtected1_L
This function is unavailable when the document is protected.
@@
; for msgDocDrawingLayerObjects_L/S and msgDocTextLayerObjects_L/S,
;%1 is the number of objects.
@msgDocDrawingLayerObjects1_L
The document contains %1 objects in the drawing layer.
%product% can only detect objects in the Text Layer.
To attempt to place Drawing Layer objects in the Text Layer press %keyFor(convertShapesToInline).
@@
@msgDocDrawingLayerObjects1_S
%1 Drawing Layer objects
%product% can only detect Text Layer objects.
To convert objects press %keyFor(convertShapesToInline).
@@
@msgDocTextLayerObjects1_L
The document contains %1 objects in the Text Layer.
%product% will detect text layer objects if
the Graphics option under General Options is on in the Quick Settings dialog.
@@
@msgDocTextLayerObjects1_S
%1 Text Layer objects
@@
@msgMovingDrawingLayerObjects1_L
Moving %1 objects from the Drawing Layer to the Text Layer.
@@
@msgMovingDrawingLayerObjects1_S
Moving %1 objects from Drawing to Text Layer
@@
@msgObjectsMoved1_L
%1 objects moved successfully.
@@
@msgObjectsMoved1_S
%1 objects moved
@@
@msgObjectsNotMoved1_L
%1 objects could not be moved.
@@
; for msgDocTables_L/S %1=number of tables in the document
@msgDocTables1_L
The document contains %1 table(s).
@@
@msgDocTables1_S
%1 table(s)
@@
; for msgDocFields_L/S, %1 is the number of fields.
@msgDocFields1_L
The document contains %1 field(s) in total.
@@
@msgDocFields1_S
%1 field(s) in total
@@
; for msgDocLinks_L/S, %1 is the number of links.
@msgDocLinks_L
The document contains %1 link(s), some of which may be link type fields.
@@
@msgDocLinks_S
%1link(s), some may be link type fields
@@
@msgNoObjectsInDrawingLayer1_L
There are no objects in the drawing layer to convert.
@@
@msgNoObjectsInTextLayer1_L
There are no objects in the text layer.
@@
@msgInlineObjects1_L
Inline Objects
@@
; for msgLanguageInUse_L/S, %1 is the name of the language in use
@msgLanguageInUse1_L
Language in use: %1
@@
@msgNoComments1_L
There are no comments in the document.
@@
@msgReviewersComments1_L
Reviewers' Comments
@@
@msgNoFootnotes_l
There are no footnotes in the document.
@@
@msgNoFootnotes_s
no footnotes
@@
@msgFootnotes
Footnotes
@@
@msgNoEndnotes_l
There are no end notes in the document.
@@
@msgNoEndnotes_s
no end notes
@@
@msgEndnotes
End Notes
@@
; for msgCommentItem (used in list reviewers' comments)
;%1=initials of author, %2=comment
@msgCommentItem1
%1: %2
@@
@msgNoFootnoteOrEndNote1_L
No footnote or EndNote reference at cursor.
@@
; for msgFootNoteReference/EndnoteRevference, %1 is the number and %2 is the text of the footnote or end note.
@msgFootnoteReference
footnote reference: %1 %2
@@
@msgEndNoteReference
end note reference: %1 %2
@@
; for msgFootnoteCount_l/msgFootnoteCount_s, %1 is the number of items in the document.
@msgFootnoteCount_l
The document contains %1 footnotes.
@@
@msgFootnoteCount_s
%1 footnotes
@@
; for msgEndnoteCount_l/msgEndnoteCount_s, %1 is the number of items in the document.
@msgEndnoteCount_l
The document contains %1 end notes.
@@
@msgEndnoteCount_s
%1 end notes
@@
; for msgCommentCount_l/msgCommentCount_s, %1 is the number of items in the document.
@msgCommentCount_l
The document contains %1 comments.
@@
@msgCommentCount_s
%1 comments
@@
;for msgComment1_L/S, %1=the comment, %2=the author of the comment's name
@msgComment1_L
Comment Reference:
%1
By %2
@@
@msgComment1_S
Comment:
%1
By %2
@@
;for msgCommentWithDateL/S, %1=the comment, %2=the author of the comment's name, %3 the date.
@msgCommentWithDate_L
Comment Reference:
%1
By %2
On %3
@@
@msgCommentWithDate_S
Comment:
%1
By %2
On %3
@@
@msgNoHyperlinks1_L
no hyperlinks in document
@@
;message content changed from "Select a link" to "List Links" for consistency with other similar listing dialogs.
@msgSelectALink1_L
List Links
@@
@msgBtnMoveUp1_L
Move up
@@
@msgBtnMoveDown1_L
Move down
@@
; for msgColorDesc, %1=foreground color name, %2=background color name
@msgColorDesc1
%1 on %2
@@
;for msgCaretPos, %1=x units where x units is a value returned
;from the pointsToDefaultUnits function in word.hss. This function returns the
;unit amount and the unit of measure, eg 1.55 inches or 2.04 centimetres etc.
;%2=y units as described above.
;%3=the page number.
@msgCaretPos1_L
 %1 from left edge
 %2 from top edge
 page %3
@@
@msgCaretPos1_S
 %1 from left
 %2 from top
 page %3
@@
;for msgCaretPosWithoutPageNumber,
;%1 and %2 are the same as in msgCaretPos
@msgCaretPos1WithoutPageNumber_L
 %1 from left edge
 %2 from top edge
@@
@msgCaretPos1WithoutPageNumber_S
 %1 from left
 %2 from top
 @@
;for msgFromLeft_L/S, %1=x units where x units is a value returned
;from the pointsToDefaultUnits function in word.hss. This function returns the
;unit amount and the unit of measure, eg 1.55 inches or 2.04 centimetres etc.
; removed "from left edge" since it is redundant.
@msgFromLeft1_L
%1
@@
@msgFromLeft1_S
%1
@@
; for msgPageNo, %1 is the page number (used for page break detection
@msgPageNo
page %1
@@
; for msgTextColumnNo, %1 is the number of the text column in multiple column layout
@msgTextColumnNo
text column %1
@@
; for msgSectionNo, %1 is the section number.
@msgSectionNo
Section %1
@@
; for msgTextColumnCount, %1 is the number of text columns
@MsgTextColumnCount
%1 text columns
@@
; Track Changes Options Dialog Prompts
@msgInsertedText1_L
Inserted:
@@
@msgDeletedText1_L
Deleted:
@@
@msgChangedFormatting1_L
Changed Formatting:
@@
@msgChangedLines1_L
Changed Lines:
@@
; Accept or Reject Changes prompts
@msgFindBackward1_L
backward
@@
@msgFindForward1_L
Forward
@@
; outline levels
; for msgHeadingsOnly1_l, %1 is ListLevel .
@msgHeadingsOnly1_L
Headings Only through %1
@@
@msgAllText1_L
All Text
@@
@msgOutlineView1_L
The document is in outline view.
@@
@msgNotInOutlineView
not in outline view
@@
@msgLevel
through %1
@@
@msgAllHeadingsAreVisible1_L
All headings are visible.
@@
@msgAllHeadingsAreVisible1_s
all headings
@@
@msgAllTextIsVisible1_L
All text is visible.
@@
@msgAllTextIsVisible1_s
all text
@@
; for msgLevel1_L, %1=level of heading
@msgLevel1_L
headings through Level %1 are visible
@@
@msgLevel1_S
headings through Level %1
@@
@msgTheFirstLine1_L
Only the first line of body text paragraphs are visible.
@@
@msgTheFirstLine1_s
Only first line of body text paragraphs visible
@@
@msgBullet1_L
bullet
@@
; selection mode msgs_S
@msgSelectionModeOn1_L
Extended selection mode on
@@
@msgSelectionModeOff1_L
Extended Selection Mode off.
@@
@msgExtSelModeHelp1_L
Extended Selection Mode is on.
To extend the selection, use the arrow keys or f8.
To cancel the mode and leave the text selected,
press Escape.
@@
@msgExtSelModeHelp1_S
Extended Selection Mode
to extend selection, arrows or f8
to cancel, escape
@@
;For msgExtSelModeFindHelp1_L,
;%1 is the information returned by GetSelectionInfo (which is msgSelectionInfo)
@msgExtSelModeFindHelp1_L
Extended selection mode is on
This is the Find and Replace dialog
Selection is extended from the starting point to the new location with each successful search
Currently, %1
@@
@msgExtSelModeFindHelp2_L
Extended selection mode is on
This is the Find and Replace dialog
Selection is extended from the starting point to the new location with each successful search
Currently, no text is selected
@@
; The following msgSelect*1 messages are the selection unit spoken during extended selection mode,
; eg: word, sentence, paragraph, documentnt
@msgSelectWord1
word:
@@
@msgSelectSentence1
sentence:
@@
@msgSelectParagraph1
paragraph:
@@
@msgSelectEntireDocument1
entire document
@@
@msgStartAt1_L
Start at:
@@
@msgSortBy1_L
Sort by
@@
@msgColorButtonMenu1_L
Color
@@
@msgCreateButtonMenu1_L
Create
@@
@msgEditButtonMenu1_L
Edit
@@
@msgGetDataButtonMenu1_L
Get Data
@@
@msgEditDataSourceButtonMenu1_L
Edit Data Source
@@
@msgFormatButtonMenu1_L
Format
@@
@msgButtonMenu1_L
button menu
@@
@msgFirstRecord1_L
First Record
@@
@msgPreviousRecord1_L
Previous Record
@@
@msgNextRecord1_L
Next Record
@@
@msgSelectReturnAddress1_L
Select Return Address
@@
@msgSelectReturnAddress1_S
Select Return Address
@@
@msgReturnAddress
Return address
@@
@msgSelectDeliveryAddress1_L
Select Delivery Address
@@
@msgSelectDeliveryAddress1_S
Select Delivery Address
@@
@msgDeliveryAddress
Delivery address
@@
@msgAppSettingsSaved1_L
Application Settings saved
@@
@msgDocSettingsSaved1_L
Document Settings saved
@@
@msgAppSettingsNotSaved1_L
Application Settings were not saved
@@
@msgDocSettingsNotSaved1_L
Document Settings were not saved
@@
@msgLastRecord1_L
Last Record
@@
@msgCheckSpellingDisabled1
The option to check spelling as you type is disabled.
@@
@msgCheckGrammarDisabled1
The option to check grammar as you type is disabled.
@@
@msgTrackChangesNotEnabled1
Track Changes is disabled. Press the Word command, CONTROL+SHIFT+E, to enable the feature.
@@
; msgRevisionListItem is used in listRevisions
;%1=revision text, %2=revision type, %3=author, %4=date
@msgRevisionListItem1
%1 %2 by %3 on %4
@@
; for msgCursorInTextCol_L/S, %1 is the text column number
@msgCursorInTextCol1_L
The cursor is in text column %1.
@@
@msgCursorInTextCol1_S
The cursor is in text column %1.
@@
@msgOutOfColumns1_L
out of columns
@@
@msgOutOfColumns1_S
out  of columns
@@
;for email message composition, when Word is the editor.
@msgHotKeyHelpEmailMessageCompose
To select the TO Button,  Press %KeyFor(showHeading3).
To select the CC Button,  Press   %KeyFor(showHeading4).
To move to the body window,  Press %KeyFor(GoToBodyWindow).
To read the TO field, press %KeyFor(ReadOutlookHeader(3)).
To read the Carbon copy field, press %KeyFor(ReadOutlookHeader(4)).
To read the Blind Carbon copy field when editing, press %KeyFor(ReadOutlookHeader(6)).
To read the Subject field, press %KeyFor(ReadOutlookHeader(5)).
@@
@msgWHotKeyHelp1_L
Hot keys are as follows
Document Template  alt t
Attach...  alt a
Automatically update document styles  alt u
GlobalTemplates and Add ins  alt g
add...  alt d
organizer...  alt o
@@
@msgWHotKeyHelp1_S
Hot keys are as follows
Document Template  alt t
Attach...  alt a
Automatically update document styles  alt u
GlobalTemplates and Add ins  alt g
add...  alt d
organizer...  alt o
@@
@msgWHotKeyHelp2_L
Hot keys are as follows
top  alt t
bottom  alt b
left  alt f
right  alt g
gutter  alt u
header  alt e
footer  alt r
apply to  alt a
default  alt d
mirror margins  alt i
@@
@msgWHotKeyHelp2_S
Hot keys are as follows
top  alt t
bottom  alt b
left  alt f
right  alt g
gutter  alt u
header  alt e
footer  alt r
apply to  alt a
default  alt d
mirror margins  alt i
@@
@msgWHotKeyHelp3_L
Hot keys are as follows
apply to  alt a
default  alt d
Paper size  alt r
width  alt w
height  alt e
portrait  alt i
landscape  alt c
@@
@msgWHotKeyHelp3_S
Hot keys are as follows
apply to  alt a
default  alt d
Paper size  alt r
width  alt w
height  alt e
portrait  alt i
landscape  alt c
@@
@msgWHotKeyHelp4_L
Hot keys are as follows
apply to  alt a
default  alt d
first page  alt f
other pages  alt o
@@
@msgWHotKeyHelp4_S
Hot keys are as follows
apply to  alt a
default  alt d
first page  alt f
other pages  alt o
@@
@msgWHotKeyHelp5_L
Hot keys are as follows
apply to  alt a
default  alt d
section start  alt r
different odd and even  alt o
different first page  alt f
vertical alignment  alt v
Line numbers  alt n
@@
@msgWHotKeyHelp5_S
Hot keys are as follows
apply to  alt a
default  alt d
section start  alt r
different odd and even  alt o
different first page  alt f
vertical alignment  alt v
Line numbers  alt n
@@
@msgWHotKeyHelp6_L
Hot keys are as follows
number of columns  alt c
number of rows  alt r
column width  alt w
wizard  alt z
auto format  alt a
@@
@msgWHotKeyHelp6_S
Hot keys are as follows
number of columns  alt c
number of rows  alt r
column width  alt w
wizard  alt z
auto format  alt a
@@
@msgWHotKeyHelp7_L
Hot keys are as follows
formula  alt f
number format  alt n
paste function  alt u
paste bookmark  alt b
@@
@msgWHotKeyHelp7_S
Hot keys are as follows
formula  alt f
number format  alt n
paste function  alt u
paste bookmark  alt b
@@
@msgWHotKeyHelp8_L
Hot keys are as follows
default  alt d
spacing  alt s
Spacing by  alt b
position  alt p
position by  alt y
kerning for fonts  alt k
points and above  alt o
@@
@msgWHotKeyHelp8_S
Hot keys are as follows
default  alt d
spacing  alt s
Spacing by  alt b
position  alt p
position by  alt y
kerning for fonts  alt k
points and above  alt o
@@
@msgWHotKeyHelp9_L
Hot keys are as follows
default  alt d
font  alt f
font style  alt o
size  alt s
underline  alt u
color  alt c
strike through  alt k
superscript  alt p
subscript  alt b
hidden  alt i
small caps  alt m
all caps  alt eigh
@@
@msgWHotKeyHelp9_S
Hot keys are as follows
default  alt d
font  alt f
font style  alt o
size  alt s
underline  alt u
color  alt c
strike through  alt k
superscript  alt p
subscript  alt b
hidden  alt i
small caps  alt m
all caps  alt eigh
@@
@msgWHotKeyHelp10_L
Hot keys are as follows
File Name  Alt n
Files of Type  Alt t
Look In  Alt i
Open  alt o
@@
@msgWHotKeyHelp10_S
Hot keys are as follows
File Name  Alt n
Files of Type  Alt t
Look In  Alt i
Open  alt o
@@
@msgWHotKeyHelp11_L
Back  Alt 1
Up One Level  Alt 2
Search The Web  Alt 3
Create A New Folder  Alt 5
Cancel  Escape
Tools  Alt L
@@
@msgWHotKeyHelp11_S
Back  Alt 1
Up One Level  Alt 2
Search The Web  Alt 3
Create A New Folder  Alt 5
Cancel  Escape
Tools  Alt L
@@
@msgWHotKeyHelp12_L
Hot keys are as follows
Save in  Alt i
Save  Alt s
@@
@msgWHotKeyHelp12_S
Hot keys are as follows
Save in  Alt i
Save  Alt s
@@
@msgWHotKeyHelp13_L
Options  Alt p
Save Version  Alt v
@@
@msgWHotKeyHelp13_S
Options  Alt p
Save Version  Alt v
@@
@msgWHotKeyHelp14_L
File Name  Alt n
Save AS Type  Alt t
@@
@msgWHotKeyHelp14_S
File Name  Alt n
Save AS Type  Alt t
@@
@msgWHotKeyHelp15_L
Back  Alt 1
Up One Level  Alt 2
Search The Web  Alt 3
Create A New Folder  Alt 5
Cancel  Escape
Tools  Alt L
@@
@msgWHotKeyHelp15_S
Back  Alt 1
Up One Level  Alt 2
Search The Web  Alt 3
Create A New Folder  Alt 5
Cancel  Escape
Tools  Alt L
@@
@msgWHotKeyHelp16_L
Hotkeys are as follows:
Not in dictionary  Alt colon
Suggestions  Alt n
Ignore  Alt i
Ignore All  Alt g
Add  alt a
Dictionary Language  Alt t
Check Grammar  Alt k
Options  alt o
@@
@msgWHotKeyHelp16_S
Not in dictionary  Alt colon
Suggestions  Alt n
Ignore  Alt i
Ignore All  Alt g
Add  Alt a
Dictionary Language  Alt t
Check Grammar  Alt k
Options  alt o
@@
@msgJHotkeyHelp1_L
Listen to the incorrect word or phrase and the first suggestion  %KeyFor(ReadMistakeAndSuggestion)
Say the word or phrase in context  %KeyFor(ReadWordInContext)
@@
@msgJHotkeyHelp1_S
listen to incorrect word or phrase and first suggestion  %KeyFor(ReadMistakeAndSuggestion)
Say word or phrase in context  %KeyFor(ReadWordInContext)
@@
;for msgJHotkeyHelp2_L/S, %1=dialog name
@msgJHotkeyHelp2_L
This is the %1 dialog
To move between the controls, use tab and shift tab.
For screen sensitive help, use %KeyFor(screenSensitiveHelp).
@@
@msgJHotkeyHelp2_S
This is the %1 dialog.
To move between the controls, use tab and shift tab.
For screen sensitive help, use %KeyFor(ScreenSensitiveHelp).
@@
; for next two messages, the key assignment for selecting a hyperlink from a list has been moved to the same key assignment as ReadMistakeAndSuggestion.
; this is for consistency with that key assignment in IE. It does not break functionality for the Spellchecker.
@msgJHotkeyHelp3_L
Set Quick Settings %KeyFor(QuickSettings)
Say the current field  %KeyFor(SayField)
Say the line and column of the caret  %KeyFor(SayLineAndColumn)
Toggle the writing mode from Insert to Overtype  %KeyFor(ToggleWritingMode)
Say the first cell in the current column  %KeyFor(SayFirstCellInColumn)
Say the first cell in the current row  %KeyFor(SayFirstCellInRow)
Say the version of MS Word being used  %KeyFor(SayWordVersion)
Move the focus to the first form field  %KeyFor(focusToFirstFormfield)
List fields  %KeyFor(SelectAField)
List tables  %KeyFor(selectATable)
List words marked as misspelled  %KeyFor(listSpellingErrors)
List grammatical errors  %KeyFor(listGrammaticalErrors)
List document revisions  %KeyFor(listRevisions)
List bookmarks  %KeyFor(ListBookmarks)
List objects such as clipart  and textboxes %KeyFor(listObjects)
List reviewers' comments  %KeyFor(listComments)
List document footnotes  %KeyFor(ListFootnotes)
List document end notes  %KeyFor(ListEndnotes)
List headings in the current document  %KeyFor(ListHeadings)
List hyperlinks in the current document  %KeyFor(ReadMistakeAndSuggestion )
List ms word short cut keys  %KeyFor(WindowKeysHelp)
Describe the border around the active cell, table, paragraph or section  %KeyFor(describeBorderOfTextUnit)
Convert all drawing layer objects to text layer objects  %KeyFor(convertShapesToInline)
Say the column title for the current cell  %KeyFor(sayColumnTitle)
Say the row title for the current cell  %KeyFor(sayRowTitle)
Say the current table column %KeyFor(readCurrentColumn)
Say the current table row %KeyFor(ReadCurrentRow)
Move to and say the prior table column %keyFor(SayPriorColumn)
Move to and say the next table column %keyFor(SayNextColumn)
Move to and say the prior table row %keyFor(SayPriorRow)
Move to and say the next table row %keyFor(SayNextRow)
Announce the detected language  %KeyFor(sayLanguageInUse)
Announce the comment referenced at the cursor location  %KeyFor(announceComment)
Announce the footnote or endnote referenced at the cursor location  %KeyFor(announceFootnoteOrEndNote)
Announce the revision referenced at the cursor location  %KeyFor(AnnounceRevision)
Toggle revision detection on/off when document is in original or final view without showing markup  %KeyFor(RevisionDetectionToggle).
Show comments, footnotes, endnotes, or revisions in virtual viewer  %KeyFor(ShowItemsInVirtualViewer).
Switch between open panes and the main document text  %KeyFor(SwitchPanes)
Mark place in the current document  %KeyFor(MarkPlace).
Return to the marked place in the current document  %KeyFor(ReturnToMarkedPlace).
Select text between the marked place and the current position in the current document  %KeyFor(SelectTextBetweenMarkedPlaceAndCurrentPosition).
@@
; Window Keys help messages
@msgWinKeysHelp1_L
the following Ms Word short cut keys may be useful
Create a new document  control + N
Open an existing document  control + O
Save a document  control + S
Print a document  control + P
Undo the last edit command  control + Z
Repeat the last edit command  control + Y
Cut the selected text to the clipboard  control + X
Copy the selected text to the clipboard  control + C
Paste text from the clipboard into a document  control + V
Select the entire document  control + A
Search for specific words or phrases  control + F
Find and replace specific words or phrases  control + H
Go to a specific line paragraph or page  control + G
Center text  control + E
Left justify text  control + L
Right justify text  control + R
Justify text  control + J
Change the point size of the font  control + shift + P
Change the font face  control + shift + F
Delete the current word  control + delete
Delete the previous word  control + backspace
Bold text  control + B
Italicize text  control + I
Underline text  control + U
Insert a hyperlink  control + K
Check spelling or grammar  F7
Name and save a document  F12
@@
@msgWinKeysHelp1_S
create new document control + N
open document control + O
save document control + S
print document control + P
undo last edit control + Z
repeat last edit control + Y
cut selected text to clipboard control + X
copy selected text to clipboard control + C
paste text from clipboard control + V
select document control + A
search control + F
find and replace control + H
go to control + G
center text control + E
left justify text control + L
right justify text control + R
justify text control + J
change point size control + shift + P
change font face control + shift + F
delete word control + delete
delete previous word control + backspace
bold text control + B
italicize text control + I
underline text control + U
insert  hyperlink control + K
check spelling or grammar F7
name and save document F12
@@
; Sccreen Sensitive Help Messages
@msgScrnSensitiveHelp1_L
There is currently no open document. Press Control+o to open a document.
@@
@msgScrnSensitiveHelp1_S
no open document
@@
@msgScrnSensitiveHelp2_L
This is the Open button. Press Enter to open the selected file or
Press down arrow to access the context menu containing alternative options for opening the file.
Press tab to move to the next control.
@@
@msgScrnSensitiveHelp2_S
Open button.
Enter to open the selected file
down arrow to access the context menu
tab to move to the next control.
@@
@msgScrnSensitiveHelp3_L
this edit box contains the sentence including the word or phrase that is in question
you may use standard editing to make the correction here and press Alt c to accept the change
or tab to move to the next control
you can hear the hotkey help for more details on Spell checker
@@
@msgScrnSensitiveHelp3_S
this edit box contains the sentence including the word or phrase that is in question
you may use standard editing to make the correction here and press Alt c to accept the change
or tab to move to the next control
you can hear the hotkey help for more details on Spell checker
@@
@msgScrnSensitiveHelp4_L
This is the menu or command bar.
Select the desired button or menu option using the arrow keys.
Move between the menu and the command bars using control+tab and shift+control+tab.
Press the Enter key to activate a button or menu item.
Press the Escape key to backup to the prior menu level or return to the document.
@@
@msgScrnSensitiveHelp4_S
menu or command bar
select button or menu using arrows
move between menu and command bars using control+tab and shift+control+tab
enter key to activate button or menu
escape key to cancel
@@
; Formfield Screen Sensitive help
@msgFormfieldHelp1_L
This is a Check Box form field.
 To toggle the state of the checkbox use the Spacebar.
@@
@msgFormfieldHelp1_S
Check Box form field.
toggle state with Spacebar
@@
@msgFormfieldHelp2_L
This is a Drop Down form field.
Activate the dropdown menu by pressing Alt+DownArrow.
@@
@msgFormfieldHelp2_S
Drop Down form field.
Activate dropdown with Alt+DownArrow
@@
@msgFormfieldHelp3_L
This is an Edit form field in which you can type information.
Edit the text with standard editing commands.
@@
@msgFormfieldHelp3_S
Edit form field
@@
@msgFormfieldHelp4_L
To move between fields use Tab and Shift+Tab.
@@
@msgFormfieldHelp4_S
Move between fields with Tab and Shift+Tab
@@
; Braille messages for Brailling fields
; for msgBrlTable, %1=table number, %2=row number, %3=column number
@msgBrlTable1
tbl%1r%2c%3
@@
; for msgBrlNestedTable, %1=table number, %2=nesting level,
;%3=row number, %4=column number
@msgBrlNestedTable1
tbl%1n%2r%3c%4
@@
;The following messages break up the table info,
;so coordinates verbosity settings are respected.
;for msgbrlTblCoords, %1 = row, %2 = col.
@msgbrlTblCoords
r%1c%2
@@
;For msgbrlTable, %1 = table number
@msgbrlTable
tbl%1
@@
;for msgBrlTbl, there is no table number as this is meant only for when table number is not to be displayed.
@msgBrlTbl
tbl
@@
;For msgBrlNesting, %1 = nesting level
@msgBrlNesting
n%1
@@
; for msgBrlTableEndRow, %1=table number
@msgBrlTableEndRow1
tbl%1 end of row
@@
@msgBrlFootnote1
fn:
@@
@msgBrlEndnote1
en:
@@
@msgBrlComment1
cmt:
@@
@msgBrlRevision
rev:
@@
@msgBrlSmartTag
smtag:
@@
;for msgBrlField, %1=field type, %2=field contents
@msgBrlField1
%1 field %2
@@
; for msgBrlPictureDesc (used in constructing Braille representation of
;inline shapes),%1=width and %2=height,
;width and height as returned from pointsToDefaultUnits, eg 3 centimeters.
@msgBrlPicDesc1
%1 wide by %2 high
@@
@msg1_L
edit
@@
@msg13_L
OverType mode active
@@
@msg13_S
OverType
@@
@msg14_L
Insert mode active
@@
@msg14_S
Insert
@@
@msg15_L
unable to determine the default button in this dialog
@@
@msg19_L
checkbox
@@
@msg20_L
dropdown
@@
@msg21_L
edit
@@
; Document Protection types:
@msgAllowOnlyComments
Allow only comments
@@
@msgAllowOnlyFormFields
Allow only form fields
@@
@msgAllowOnlyRevisions
Allow only revisions
@@
@msgNoProtection
No protection
@@
@msgReadOnly
Read-only
@@
; for msgProtectionStatus, %1 is the document's protection status.
@msgProtectionStatus
Document protection status is %1.
@@
@msgProtectionStatusExplained
This means that navigation and editing is restricted.
@@
@msgNoSpellingErrors
no spelling errors
@@
@msgNoGrammaticalErrors
no grammatical errors
@@
@msgSpellingErrors
Spelling Errors
@@
; inline shape types
@msg31_L
EmbeddedOLEObject
@@
@msg32_L
HorizontalLine
@@
@msg33_L
LinkedOLEObject
@@
@msg34_L
LinkedPicture
@@
@msg35_L
LinkedPictureHorizonta
@@
@msg36_L
OWSAnchor
@@
@msg37_L
Picture
@@
@msg38_L
PictureBullet
@@
@msg39_L
PictureHorizontalLine
@@
@msg40_L
ScriptAnchor
@@
@msgGrammaticalErrors
Grammatical Errors
@@
@msgRevisions
Revisions
@@
@msgNoRevisions_l
There are no revisions in the document.
@@
@msgNoRevisions_s
No revisions
@@
@msgNoRevision
No Revision
@@
@msgRevisionConflict
Revision Conflict
@@
@msgRevisionDeletedText
Deleted
@@
@msgRevisionDisplayField
Revision Display Field
@@
@msgRevisionParagraphNumber
Revision ParagraphNumber
@@
@msgRevisionProperty
Revision Property
@@
@msgRevisionReconcile
Revision Reconcile
@@
@msgRevisionReplace
Revision Replace
@@
@msgRevisionStyle
Revision Style
@@
; page numbering positions
@msg54_L
Page Number is Centered.
@@
@msg55_L
PageNumber Inside.
@@
@msg56_L
Page Number is on the Left.
@@
@msg57_L
Page Number Outside.
@@
@msg58_L
Page Number is on the Right.
@@
;cell alignment types
@msgCellVerticalAlignmentTop
top
@@
@msgCellVerticalAlignmentCenter
center
@@
@msgCellVerticalAlignmentBottom
bottom
@@
; for msgCellVerticalAlignment, %1 is one of the cell vertical alignment types
@msgCellVerticalAlignment_L
Cell alignment is %1.
@@
@msgCellVerticalAlignment_S
Cell alignment is %1
@@
; border types
@msg59_L
Bottom
@@
@msg60_L
DiagonalDown
@@
@msg61_L
DiagonalUp
@@
@msg62_L
Horizontal
@@
@msg63_L
Left
@@
@msg64_L
Right
@@
@msg65_L
Top
@@
@msg66_L
Vertical
@@
; line style messages for border description
@msg67_L
Dash Dot
@@
@msg68_L
Dash Dot Dot
@@
@msg69_L
Dash Dot Stroked
@@
@msg70_L
Dash Large Gap
@@
@msg71_L
Dash Small Gap
@@
@msg72_L
Dotted
@@
@msg73_L
Double
@@
@msg74_L
Double Wavy
@@
@msg75_L
Emboss 3D
@@
@msg76_L
Engrave 3D
@@
@msg77_L
Inset
@@
@msg78_L
None
@@
@msg79_L
Outset
@@
@msg80_L
Single
@@
@msg81_L
Single Wavy
@@
@msg82_L
Thick Thin Large Gap
@@
@msg83_L
Thick Thin Medium Gap
@@
@msg84_L
Thick Thin Small Gap
@@
@msg85_L
Thin Thick Large Gap
@@
@msg86_L
Thin Thick Medium Gap
@@
@msg87_L
Thin Thick Small Gap
@@
@msg88_L
Thin Thick Thin Large Gap
@@
@msg89_L
Thin Thick Thin Medium Gap
@@
@msg90_L
Thin Thick Thin Small Gap
@@
@msg91_L
Triple
@@
@msg92_L
mixed
@@
; Page Art messages
@msg93_L
Apples
@@
@msg94_L
ArchedScallops
@@
@msg95_L
BabyPacifier
@@
@msg96_L
BabyRattle
@@
@msg97_L
Balloons3Colors
@@
@msg98_L
BalloonsHotAir
@@
@msg99_L
BasicBlackDashes
@@
@msg100_L
BasicBlackDots
@@
@msg101_L
BasicBlackSquares
@@
@msg102_L
BasicThinLines
@@
@msg103_L
BasicWhiteDashes
@@
@msg104_L
BasicWhiteDots
@@
@msg105_L
BasicWhiteSquares
@@
@msg106_L
BasicWideInline
@@
@msg107_L
BasicWideMidline
@@
@msg108_L
BasicWideOutline
@@
@msg109_L
Bats
@@
@msg110_L
Birds
@@
@msg111_L
BirdsFlight
@@
@msg112_L
Cabins
@@
@msg113_L
CakeSlice
@@
@msg114_L
CandyCorn
@@
@msg115_L
CelticKnotwork
@@
@msg116_L
CertificateBanner
@@
@msg117_L
ChainLink
@@
@msg118_L
ChampagneBottle
@@
@msg119_L
CheckedBarBlack
@@
@msg120_L
CheckedBarColor
@@
@msg121_L
Checkered
@@
@msg122_L
ChristmasTree
@@
@msg123_L
CirclesLines
@@
@msg124_L
CirclesRectangles
@@
@msg125_L
ClassicalWave
@@
@msg126_L
Clocks
@@
@msg127_L
Compass
@@
@msg128_L
Confetti
@@
@msg129_L
ConfettiGrays
@@
@msg130_L
ConfettiOutline
@@
@msg131_L
ConfettiStreamers
@@
@msg132_L
ConfettiWhite
@@
@msg133_L
CornerTriangles
@@
@msg134_L
CouponCutoutDashes
@@
@msg135_L
CouponCutoutDots
@@
@msg136_L
CrazyMaze
@@
@msg137_L
CreaturesButterfly
@@
@msg138_L
CreaturesFish
@@
@msg139_L
CreaturesInsects
@@
@msg140_L
CreaturesLadyBug
@@
@msg141_L
CrossStitch
@@
@msg142_L
Cup
@@
@msg143_L
DecoArch
@@
@msg144_L
DecoArchColor
@@
@msg145_L
DecoBlocks
@@
@msg146_L
DiamondsGray
@@
@msg147_L
DoubleD
@@
@msg148_L
DoubleDiamonds
@@
@msg149_L
Earth1
@@
@msg150_L
Earth2
@@
@msg151_L
EclipsingSquares1
@@
@msg152_L
EclipsingSquares2
@@
@msg153_L
EggsBlack
@@
@msg154_L
Fans
@@
@msg155_L
Film
@@
@msg156_L
Firecrackers
@@
@msg157_L
FlowersBlockPrint
@@
@msg158_L
FlowersDaisies
@@
@msg159_L
FlowersModern1
@@
@msg160_L
FlowersModern2
@@
@msg161_L
FlowersPansy
@@
@msg162_L
FlowersRedRose
@@
@msg163_L
FlowersRoses
@@
@msg164_L
FlowersTeacup
@@
@msg165_L
FlowersTiny
@@
@msg166_L
Gems
@@
@msg167_L
GingerbreadMan
@@
@msg168_L
Gradient
@@
@msg169_L
Handmade1
@@
@msg170_L
Handmade2
@@
@msg171_L
HeartBalloon
@@
@msg172_L
HeartGray
@@
@msg173_L
Hearts
@@
@msg174_L
HeebieJeebies
@@
@msg175_L
Holly
@@
@msg176_L
HouseFunky
@@
@msg177_L
Hypnotic
@@
@msg178_L
IceCreamCones
@@
@msg179_L
LightBulb
@@
@msg180_L
Lightning1
@@
@msg181_L
Lightning2
@@
@msg182_L
MapleLeaf
@@
@msg183_L
MapleMuffins
@@
@msg184_L
MapPins
@@
@msg185_L
Marquee
@@
@msg186_L
MarqueeToothed
@@
@msg187_L
Moons
@@
@msg188_L
Mosaic
@@
@msg189_L
MusicNotes
@@
@msg190_L
Northwest
@@
@msg191_L
Ovals
@@
@msg192_L
Packages
@@
@msg193_L
PalmsBlack
@@
@msg194_L
PalmsColor
@@
@msg195_L
PaperClips
@@
@msg196_L
Papyrus
@@
@msg197_L
PartyFavor
@@
@msg198_L
PartyGlass
@@
@msg199_L
Pencils
@@
@msg200_L
People
@@
@msg201_L
PeopleHats
@@
@msg202_L
PeopleWaving
@@
@msg203_L
Poinsettias
@@
@msg204_L
PostageStamp
@@
@msg205_L
Pumpkin1
@@
@msg206_L
PushPinNote1
@@
@msg207_L
PushPinNote2
@@
@msg208_L
Pyramids
@@
@msg209_L
PyramidsAbove
@@
@msg210_L
Quadrants
@@
@msg211_L
Rings
@@
@msg212_L
Safari
@@
@msg213_L
Sawtooth
@@
@msg214_L
SawtoothGray
@@
@msg215_L
ScaredCat
@@
@msg216_L
Seattle
@@
@msg217_L
ShadowedSquares
@@
@msg218_L
SharksTeeth
@@
@msg219_L
ShorebirdTracks
@@
@msg220_L
Skyrocket
@@
@msg221_L
SnowflakeFancy
@@
@msg222_L
Snowflakes
@@
@msg223_L
Sombrero
@@
@msg224_L
Southwest
@@
@msg225_L
Stars
@@
@msg226_L
Stars3D
@@
@msg227_L
StarsBlack
@@
@msg228_L
StarsShadowed
@@
@msg229_L
StarsTop
@@
@msg230_L
Sun
@@
@msg231_L
Swirligig
@@
@msg232_L
TornPaper
@@
@msg233_L
TornPaperBlack
@@
@msg234_L
Trees
@@
@msg235_L
TriangleParty
@@
@msg236_L
Triangles
@@
@msg237_L
Tribal1
@@
@msg238_L
Tribal2
@@
@msg239_L
Tribal3
@@
@msg240_L
Tribal4
@@
@msg241_L
Tribal5
@@
@msg242_L
Tribal6
@@
@msg243_L
TwistedLines1
@@
@msg244_L
TwistedLines2
@@
@msg245_L
Vine
@@
@msg246_L
Waveline
@@
@msg247_L
WeavingAngles
@@
@msg248_L
WeavingBraid
@@
@msg249_L
WeavingRibbon
@@
@msg250_L
WeavingStrips
@@
@msg251_L
WhiteFlowers
@@
@msg252_L
Woodwork
@@
@msg253_L
XIllusions
@@
@msg254_L
ZanyTriangles
@@
@msg255_L
ZigZag
@@
@msg256_L
ZigZagStitch
@@
; line widths
@msg257_L
0.25 points
@@
@msg258_L
0.5 points
@@
@msg259_L
0.75 points
@@
@msg260_L
1 point
@@
@msg261_L
1.5 points
@@
@msg262_L
2.25 points
@@
@msg263_L
3 points
@@
@msg264_L
4.5 points
@@
@msg265_L
6 points
@@
; color descriptions from object browser:
@msg266_L
Aqua
@@
@msg267_L
Black
@@
@msg268_L
Blue
@@
@msg269_L
BlueGray
@@
@msg270_L
BrightGreen
@@
@msg271_L
Brown
@@
@msg272_L
DarkBlue
@@
@msg273_L
DarkGreen
@@
@msg274_L
DarkRed
@@
@msg275_L
DarkTeal
@@
@msg276_L
DarkYellow
@@
@msg277_L
Gold
@@
@msg278_L
Gray05
@@
@msg279_L
Gray10
@@
@msg280_L
Gray125
@@
@msg281_L
Gray15
@@
@msg282_L
Gray20
@@
@msg283_L
Gray25
@@
@msg284_L
Gray30
@@
@msg285_L
Gray35
@@
@msg286_L
Gray375
@@
@msg287_L
Gray40
@@
@msg288_L
Gray45
@@
@msg289_L
Gray50
@@
@msg290_L
Gray55
@@
@msg291_L
Gray60
@@
@msg292_L
Gray625
@@
@msg293_L
Gray65
@@
@msg294_L
Gray70
@@
@msg295_L
Gray75
@@
@msg296_L
Gray80
@@
@msg297_L
Gray85
@@
@msg298_L
Gray875
@@
@msg299_L
Gray90
@@
@msg300_L
Gray95
@@
@msg301_L
Green
@@
@msg302_L
Indigo
@@
@msg303_L
Lavender
@@
@msg304_L
LightBlue
@@
@msg305_L
LightGreen
@@
@msg306_L
LightOrange
@@
@msg307_L
LightTurquoise
@@
@msg308_L
LightYellow
@@
@msg309_L
Lime
@@
@msg310_L
OliveGreen
@@
@msg311_L
Orange
@@
@msg312_L
PaleBlue
@@
@msg313_L
Pink
@@
@msg314_L
Plum
@@
@msg315_L
Red
@@
@msg316_L
Rose
@@
@msg317_L
SeaGreen
@@
@msg318_L
SkyBlue
@@
@msg319_L
Tan
@@
@msg320_L
Teal
@@
@msg321_L
Turquoise
@@
@msg322_L
Violet
@@
@msg323_L
White
@@
@msg324_L
Yellow
@@
; line spacing messages
@msg325_L
Single
@@
@msg326_L
one point five
@@
@msg327_L
Double
@@
; for msg328-329, %1 is the number of points
@msg328_L
At Least %1 points
@@
@msg329_L
Exactly %1 points
@@
@msg330_L
Line spacing:
@@
; for msg331_L, %1=number of lines
@msg331_L
 %1 lines.
@@
; list types
@msg332_L
List with No Numbering
@@
@msg333_L
List designated by ListNum fields
@@
@msg334_L
Bulleted List
@@
; for msg335_L-msg337_L, %1=listString for list item returned from object model
@msg335_L
List with Simple Numbering.
item %1
@@
@msg336_L
List with Outline Numbering.
item %1
@@
@msg337_L
List with Mixed Numbering.
item %1
@@
; Underline styles
@msg338_L
Dashed
@@
@msg339_L
Dashed Heavy
@@
@msg340_L
Dashed Long
@@
@msg341_L
Dashed Long Heavy
@@
@msg342_L
Dot Dashed
@@
@msg343_L
Dot Dash Heavy
@@
@msg344_L
Dot Dot Dashed
@@
@msg345_L
Dot Dot Dash Heavy
@@
@msg346_L
Dotted
@@
@msg347_L
Dotted Heavy
@@
@msg348_L
Double
@@
@msg349_L
Single
@@
@msg350_L
Thick
@@
@msg351_L
Wavy
@@
@msg352_L
Wavy Double
@@
@msg353_L
Wavy Heavy
@@
@msg354_L
Words Only
@@
@msg355_L
underline
@@
; for msg356_L/S, %1=control name, %2=hotkey as returned by MSAA, ie including the word alt
@msg356_L
%1 use %2
@@
@msg356_S
%1 %2
@@
@msgRevisionParagraphProperty
Revision Paragraph Property
@@
@msgRevisionSectionProperty
Revision Section Property
@@
@msgRevisionStyleDefinition
Revision Style Definition
@@
@msgRevisionTableProperty
Revision Table Property
@@
@msgMSAASetError
Error settings MSAA mode
@@
;For msgListItemCount, %1 is the number of items in the list - returned by object model
@msgListItemCount
List has %1 items
@@
;For MsgUnderLineStyleComboBoxPromptAndValue, %1 = the Underline Style combo box prompt, %2 = the displayed value
@MsgUnderLineStyleComboBoxPromptAndValue
%1 %2
@@
; for msgSelectionInfo:; %1 = the first word in the selected range,
;%2 = the last word in the selected range,
; %3 = the approximate number of selected word or punctuation delimmiters in the selected range,
; %4 = the number of sentences in the selected range,
;%5 = the number of paragraphs in the selected range
@msgSelectionInfo
Selected ranges from %1 to %2
Selection ranges over approximately %3 words or punctuation delimmiters, %4 sentences, and %5 paragraphs
To hear the currently selected text, escape this dialog then use %KeyFor(SaySelectedText)
@@
@msgLineMode
Line
@@
; msgSpace is the spoken space character " "
@msgSpace
space
@@
@msgColorMenuButton_l
Color Menu Button
@@
@msgMoveItemUp_L
Move item up
@@
@msgMoveItemUp_S
Up
@@
@msgMoveItemDown_L
Move item down
@@
@msgMoveItemDown_S
Down
@@
; msgTrackChangesOn/Off tells the WordXP user the state of Track Changes when toggled with Control+Shift+E
@msgTrackChangesOn_l
Track Changes on
@@
@msgTrackChangesOn_S
On
@@
@msgTrackChangesOff_l
Track Changes off
@@
@msgTrackChangesOff_S
Off
@@
; the following messages are the names of the Envelopes page and the Labels page
; in the Envelopes and Labels dialog:
@MsgLabels_L
Labels
@@
@MsgLabels_S
Labels
@@
@MsgEnvelopes_L
Envelopes
@@
@MsgEnvelopes_S
Envelopes
@@
; msgBorderButtonsPrompt is the on-screen text
; for the border buttons in the Borders and Shading dialog
@msgBorderButtonsPrompt
Buttons to apply borders
@@
; msgTablePropertiesTextWrappingPrompt and msgTablePropertiesAlignmentPrompt
; is text which appears on-screen
; in the Table Properties dialog on the Tables page,
; and is the prompt relating to the buttons for wrapping and alignment
@msgTablePropertiesTextWrappingPrompt
Text wrapping
@@
@msgTablePropertiesAlignmentPrompt
Alignment
@@
; msgTablePropertiesCellSizePrompt is the on-screen prompt for the cell Size edit spin box
; in the Table Properties dialog on the cells page
@msgTablePropertiesCellSizePrompt
Size
@@
; msgTablePropertiesCellVerticalAlignmentPrompt is text which appears on-screen
; in the Table Properties dialog on the cells page,
; and is the prompt relating to the buttons for cell vertical alignment
@msgTablePropertiesCellVerticalAlignmentPrompt
Vertical alignment
@@
; msgTableOptionsDefaultCellMargins is the on-screen text prompt
; for the cell margin edit spin boxes
; in the Table Options dialog under the Table Properties dialog
@msgTableOptionsDefaultCellMargins
Default cell margins
@@
; msgTableOptionsDefaultCellSpacing is the on-screen prompt for the cell spacing checkbox
; in the Table Options dialog under the Table Properties dialog
@msgTableOptionsDefaultCellSpacing
Default cell spacing
@@
; msgCellOptionsCellMarginsPrompt is the on-screen text for cell margins
; in the Cell options dialog under the Table Properties dialog
@msgCellOptionsCellMarginsPrompt
Cell margins
@@
;for msgSpellingSuggestionListBoxPrompt, %1 is the name (suggestions), %2 is the type (list box):
@msgSpellingSuggestionListBoxPrompt
%1 %2
@@
@msgSuggestionsListNotAvailable_L
The suggestions list is currently unavailable
@@
@msgSuggestionsListNotAvailable_S
Not available
@@
@msgWindowStateToggleMaximize
Maximize
@@
@msgWindowStateToggleRestore
Restore
@@
@msgDocumentView_L
%1 View
@@
@msgDocumentView_s
%1
@@
@msgZoomManyPages_l
Zoom level set to Many Pages; press %KeyFor(ScreenSensitiveHelp) to learn how to change the level.
@@
@msgZoomManyPages_s
Zoom level set to Many Pages; %KeyFor(ScreenSensitiveHelp) to learn how to change level
@@
;The following are strings for the names of views.
;These are used by the msgDocumentView message
@msgNormal
Normal
@@
@msgDraft
Draft
@@
@msgOutline
Outline
@@
@msgPrint
Print
@@
@msgPrintPreview
Print Preview
@@
;Master is outline.
@msgMaster
Outline
@@
@msgWeb
Web Layout
@@
@msgReading
reading layout
@@
@MsgSdmToolbar
To change the selection use the Arrow keys.
@@
@msgButton
Button
@@
@msgOccurrence
Find tab
@@
@msgReplace
Replace tab
@@
@msgGoto
Go to page tab
@@
@msgCountAnnotationsOn
Count Annotations
@@
@msgCountAnnotationsOff
Do not count Annotations
@@
; for msgSchemeName_l and msgSchemeName_s, %1 is the name of the currently loaded scheme.
@msgSchemeName_l
the currently loaded scheme is %1
@@
@msgSchemeName_s
current scheme is %1
@@
@msgInformationBalloon
information balloon
@@
@msgInformationBalloonTutorHelp
For help, press Spacebar.
@@
@MsgInformationBalloonScrnSensitiveHelp_l
To bring up "What's this" help, press the Application key or %product%+RightMouse click followed by Enter.
@@
@MsgInformationBalloonScrnSensitiveHelp_s
For help, press %product%+RightMouseClick followed by Enter.
@@
@msgCopyFormat_l
copying format to clipboard
@@
@msgCopyFormat_s
copying format
@@
@msgPasteFormat_l
applied format from clipboard
@@
@msgPasteFormat_s
applied format
@@
@msgScreenSensitiveHelpEditCombo
To set the value use the Arrow keys or type the value.
@@
; for msgCellListItemCount, %1 is the number of list items, if any, contained in the current cell.
@msgCellListItemCount
Cell list has %1 items.
@@
@msgCustomBullet
custom bullet
@@
@MsgEMail_l
Word is not in use as your EMail editor for Outlook.
@@
@msgEMail_s
Not using Outlook for Email.
@@
@msgF1Help
Press F1 for help.
@@
@msgF1HelpWithFormfield
Read with formfield
@@
@msgNamedTitlesApp
On For All Files
@@
@msgNamedTitlesFile
On For The Current File
@@
; for reading layout view in Word 2003:
@msgReadingLayout
WARNING! %product% does not support this view. Press %product% Key+F1 to learn how to disable Reading Layout view. To exit Reading Layout view, press ESC.
@@
@msgScreenSensitiveHelp_ReadingLayout
Reading Layout view is the default view for attachments. %product% does not support this view.  To turn off Reading Layout view, do the following:
1. From the Tools menu, choose Options.
2. Press CTRL+TAB until you switch to the General tab in the Options dialog.
3. Move to and clear the Allow Starting in Reading Layout check box.
4. Press ENTER to close the Options dialog and return to the document.

Word continues to display the current document in Reading Layout view until you close this message and press ESC. However, the next time you open an attachment,
Word displays it in Normal view.
@@
@msgNotFormatted
not formatted
@@
; for msgBulletType, %1 is the type of bullet
@msgBulletType
%1 bullet
@@
@MsgFilledRound
filled round
@@
@msgFilledSquare
filled square
@@
@msgFilledDiamond
filled diamond
@@
@msgHollowSquare
hollow square
@@
@msgHollowDiamond
hollow diamond
@@
@msgCheckmark
checkmark
@@
@msgArrow
arrow
@@
@msgStar
star
@@
@msgTreeviewItem
To move through or expand items use the Arrow keys.
@@
@msg_EmailHeaderNotFound1_L
The requested header information was not found.
@@
@msg_EmailHeaderNotFound1_s
requested header not found
@@
@msgScreenSensitiveHelpQuickNav
Quick Navigation mode is on for this document. This means you can only use the keys available in quick navigation mode.

To return to standard editing mode where you can type text directly into the document, press JAWSKEY+Z.

@@
@msgFirstPageHeader
first page header
@@
@msgFirstPageFooter
first page footer
@@
@msgEvenPagesHeader
even pages header
@@
@msgEvenPagesFooter
even pages footer
@@
@msgHeader
header
@@
@msgFooter
footer
@@
@msgHeadings
Headings
@@
@msgNoHeadings_l
There are no headings in this document.
@@
@msgNOHeadings_s
no headings
@@
@msgPleaseWaitForHeadings_l
Please wait! processing headings list.
@@
@msgPleaseWaitForHeadings_s
Processing headings.
@@
@msgPasswordPrompt
Password to open:
@@
@msgFieldOCX
ole
@@
@msgFieldPageRef
pgref
@@
@msgFieldRef
indxref
@@
@msgFieldHyperlink
lnk
@@
@msgFieldTocRef
tocpgref
@@
@msgFieldDate
dte
@@
@msgFieldTime
time
@@
@msgFieldSymbol
symb
@@
@msgFieldFormula
forml
@@
@msgFieldIndex
indx
@@
@msgFieldExpression
exp
@@
@msgFieldToc
toc
@@
@msgNORowTitle_l
No row title is defined for this table.
@@
@msgNoRowTitle_s
row title not defined
@@
@msgNoColTitle_l
No column title is defined for this table.
@@
@msgNoColTitle_s
column title not defined
@@
@msgColumnPrecedesTitleCol_l
This cell precedes the row containing column titles.
@@
@msgColumnPrecedesTitleCol_S
Cell precedes column title
@@
@msgRowPrecedesTitleCol_l
This cell precedes the column containing row titles.
@@
@msgRowPrecedesTitleCol_S
Cell precedes row title
@@
@msgTitleCol_l
This is the title column, containing row titles.
@@
@msgTitleCol_s
row title column
@@
@msgTitleRow_l
This is the title row, containing column titles.
@@
@msgTitleRow_s
column title row
@@
; for msgGrammaticalAndSpellingError_l/s, %1 is the first spelling error.
@msgGrammaticalAndSpellingError_l
spelling error %1 with grammatical error
@@
@msgGrammaticalAndSpellingError_s
%1 with grammatical error
@@
@msgBeginningOfTable
beginning of table
@@
@msgEndOfTable
end of table
@@
@msgScreenSensitiveHelpCheckboxFormField_l
This is a checkbox formfield in an unprotected form.
You must protect the form first in order to change the state of this formfield.
@@
@msgScreenSensitiveHelpCheckboxFormField_s
This is a checkbox formfield in an unprotected form.
Protect the form to change its state.
@@
@msgScreenSensitiveHelpDropdownFormField_l
This is a dropdown formfield in an unprotected form.
You must protect the form first in order to choose one of the items in the list of this formfield.
@@
@msgScreenSensitiveHelpDropdownFormField_s
This is a dropdown formfield in an unprotected form.
Protect the form to choose one of the items in the list.
@@
@msgScreenSensitiveHelpEditFormField_l
This is an edit formfield in an unprotected form.
You must protect the form first in order to type in this formfield.
@@
@msgScreenSensitiveHelpEditFormField_s
This is an edit formfield in an unprotected form.
Protect the form to type in it.
@@
@msgQuickKeys
Move to next grammatical error %KeyFor(MoveToNextGrammaticalError )
Move to prior grammatical error %KeyFor(MoveToPriorGrammaticalError)
Move to next bookmark  %KeyFor(MoveToNextBookMark)
Move to prior bookmark  %KeyFor(MoveToPriorBookMark)
Move to next comment %KeyFor(MoveToNextComment)
Move to prior comment  %KeyFor(MoveToPriorComment)
Move to next protected edit form field  %KeyFor(MoveToNextEdit)
Move to prior protected edit form field  %KeyFor(MoveToPriorEdit)
Move to next protected checkbox form field  %KeyFor(MoveToNextCheckbox)
Move to prior protected checkbox form field  %KeyFor(MoveToPriorCheckbox)
Move to next protected combo box form field  %KeyFor(MoveToNextCombo)
Move to prior protected combo box form field  %KeyFor(MoveToPriorCombo)
Move to next endnote %KeyFor(MoveToNextEndnote)
Move to prior endnote %KeyFor(MoveToPriorEndnote)
Move to next field %KeyFor(MoveToNextField)
Move to prior field %KeyFor(MoveToPriorField)
Move to next graphic %KeyFor(MoveToNextGraphic)
Move to prior graphic %KeyFor(MoveToPriorGraphic)
Move to next heading %keyFor(moveToNextHeading)
Move to prior heading %KeyFor(moveToPriorHeading)
Move to next heading level 1  %KeyFor(MoveToNextHeading(1))
Move to next heading level 2  %KeyFor(MoveToNextHeading(2))
Move to next heading level 3  %KeyFor(MoveToNextHeading(3))
Move to next heading level 4  %KeyFor(MoveToNextHeading(4))
Move to next heading level 5  %KeyFor(MoveToNextHeading(5))
Move to next heading level 6  %KeyFor(MoveToNextHeading(6))
Move to next heading level 7  %KeyFor(MoveToNextHeading(7))
Move to next heading level 8  %KeyFor(MoveToNextHeading(8))
Move to next heading level 9  %KeyFor(MoveToNextHeading(9))
Move to prior heading level 1  %KeyFor(MoveToPriorHeading(1))
Move to prior heading level 2  %KeyFor(MoveToPriorHeading(2))
Move to prior heading level 3  %KeyFor(MoveToPriorHeading(3))
Move to prior heading level 4  %KeyFor(MoveToPriorHeading(4))
Move to prior heading level 5  %KeyFor(MoveToPriorHeading(5))
Move to prior heading level 6  %KeyFor(MoveToPriorHeading(6))
Move to prior heading level 7  %KeyFor(MoveToPriorHeading(7))
Move to prior heading level 8  %KeyFor(MoveToPriorHeading(8))
Move to prior heading level 9  %KeyFor(MoveToPriorHeading(9))
Move to next footnote %keyFor(MoveToNextFootnote)
Move to prior footnote %KeyFor(MoveToPriorFootnote)
Move to next page %KeyFor(MoveToNextPage)
Move to prior page %KeyFor(MoveToPriorPage)
Say next paragraph %keyFor(SayNextParagraph)
Say prior  paragraph %keyFor(SayPriorParagraph)
Move to next section %KeyFor(MoveToNextSection)
Move to prior section %keyFor(MoveToPriorSection)
Move to next spelling error %keyFor(MoveToNextSpellingError)
Move to prior spelling error %KeyFor(MoveToPriorSpellingError)
Move to next revision %keyFor(MoveToNextRevision)
Move to prior revision %keyFor(MoveToPriorRevision)
Move to next table  %KeyFor(MoveToNextTable)
Move to prior table  %KeyFor(MoveToPriorTable)
Move past end of table  %KeyFor(StepToEndOfElement)
Move to before start of table  %KeyFor(StepToStartOfElement)
Move to next word in word list  %KeyFor(MoveToNextWordFromList)
Move to prior word in word list  %KeyFor(MoveToPriorWordFromList)
@@
@msgEnd
End
@@
@msgCustomStyleError_l
The document may have custom style headings.
@@
@msgCustomStyleError_s
document may have custom style headings
@@
;For msgOnlyOneHeading l/s, %1 is the style of the heading, %2 its name.
@msgOnlyOneHeading_l
%1 heading is the only heading, and it starts the document.
%2
@@
@msgOnlyOneHeading_s
%1 is the only heading, and it starts the document.
@@
;navigating out of shaded table cells:
@msgOutOfShadedRegion
Out of shaded region
@@
; for shading property, %1 is the amount of shading.
@msgShaded
shaded %1
@@
@msgClearShading
%1 %2 pattern
@@
; for msgShadingDesc, %1 is the pattern of shading, %2 is its color.
@msgShadingDesc
%1 shaded %2 percent pattern
@@
; For msgSolidShading, %1 is the color.
@msgSolidShading
shaded %1
@@
; for msgPatternAndShadingDesc, %1 is the  foreground, %2 the pattern, and %3 the backgroun.
@msgPatternAndShadingDesc
%1 %2 pattern on %3 background
@@
@msgForwardFromToc_l
moving forward from table of contents
@@
@msgScreenSensitiveHelpForCellShading
The current cell is shaded:
@@
@msgForwardFromToc_s
Forward from table of contents
@@
@msgReturnToToc_l
returning to table of contents
@@
@msgReturnToToc_s
back to table of contents
@@
;For msgOutlineCustomBullet, %1 is the bullet type.
@msgOutlineCustomBullet
outline %1 bullet
@@
; following are some chars not caught by standard means:
@msgBindingSpace
nonbreaking space
@@
@msgBindingHyphen
nonbreaking hyphen
@@
@msgSoftHyphen
soft hyphen
@@
@msgPageBreak
page break
@@
; for customized line width:
@msgCustomWidth
custom width
@@
@msgDeletedTextTemplate
<voice name=DeletedTextVoice>%1</voice>
@@
@msgInsertedTextTemplate
<voice name=InsertedTextVoice>%1</voice>
@@
; for msgHeadingLevel, %1 is the heading level.
@msgHeadingLevel
Heading %1
@@
@msgNoEmbeddedObjects_l
There are no  embedded objects in the document.
@@
@msgNoEmbeddedObjects_s
No embedded objects
@@
@msgEmbeddedObjects
Embedded Objects
@@
; for msgExtraInfo, %1 is the author's initials, %2 is the date of the item.
@msgExtraInfo
Initials: %1 on %2
@@
; for msgSetToUnitOfMeasure, %1 is the unit of measure.
@msgSetToUnitOfMeasure
Set to %1
@@
; for msgDefaultUnitOfMeasure, %1 is the application setting.
@msgDefaultUnitOfMeasure
%1 (default)
@@
@msgEndOfCellOrRowMarker_l
end of cell or row marker
@@
@msgEndOfCellOrRowMarker_s
end of cell or row
@@
@msgBrlMarkSpelling
Spelling errors
@@
@msgBrlMarkGrammar
Grammatical errors
@@
@msgBrlMarkSpellingAndGrammar
Spelling and grammatical errors
@@
@msgBrlMarkSpellingAndGrammarOff
No spelling or grammatical errors
@@
; for msgFootNote1/Endnote_L/S, %1 is the text of the footnote or end note.
@msgFootnote1_L
footnote reference: %1
@@
@msgFootnote1_S
footnote: %1
@@
@msgEndNote1_L
end note reference: %1
@@
@msgEndNote1_S
end note: %1
@@
;for msgBookmark, %1 is the name of the item.
@msgBookmark
Bookmark %1
@@
;for msgSmartTag, %1 is the name of the item.
@msgSmartTag
SmartTag %1
@@
@msgAnnounceRevisionError_l
You must enable Track Changes in order to use this feature.
@@
@msgAnnounceRevisionError_s
Enable Track Changes.
@@
@msgBookmarkList
Bookmark List
@@
@msgNoBookmarks_l
There are no bookmarks in the document.
@@
@msgNoBookmarks_s
no bookmarks
@@
; for msgLink, %1 is the field value.
@msgLink
Link %1
@@
@msgSchemeStyleChanges
Detected only by scheme
@@
@msgSchemeAndStyleChanges
Always announced
@@
;Messages for ClickButton when word is the editor for Outlook:
@msgOLHeader1
header
@@
@msgOLToButton
To Button
@@
@msgOLCcButton
CC Button
@@
@msgOLAddressButton
Address Button
@@
@msgOLReminderSoundButton
Reminder Sound Button
@@
@msgOLButtonNotFound
Not Found
@@
; for msgLineSpacing and msgNumberOfLines,%1 is the type of spacing or number of lines.
@msgLineSpacing
%1 spaced
@@
@msgNumberOfLines
%1 lines
@@
@msgMultipleNumberOfLines
%1 lines or more
@@
@msgTooManyGrammaticalErrors_l
There are too many errors to list in this document. Please use quick keys instead to jump from one grammatical error to the next.
@@
@msgTooManyGrammaticalErrors_s
Too many errors to list; use quick keys instead.
@@
@msgWaitForList
Please wait: This may take a few seconds.
@@
@msg_AnnotationOnWithText
On With Text
@@
@msgOutOfLink
out of link
@@
; for the object count messages, %1 is the number of objects.
@msgObjectCount_l
The document has %1 objects.
@@
@msgObjectCount_s
%1 objects
@@
@msgGraphicsListNotAvailable_l
This command is not available in Microsoft Word. Press %KeyFor(ListObjects) to obtain a list of objects.
@@
@msgGraphicsListNotAvailable_s
not available in Microsoft Word; %KeyFor(ListObjects)
@@
@msgTableTitlesBookmarkDefined
Not available when Defined Bookmark Table Column and Row Titles Override is off.
@@
@msgRevisionDetectionOff_l
Revision Detection is off in Original or Final view not showing markup.
@@
@msgRevisionDetectionOff_s
Revision Detection off in Original or Final view.
@@
@msgRevisionDetectionAlreadyOff
Revision Detection is already off.
@@
;for msgRevisionDetectionIsAlreadyOn, %1 is the revision detection level.
@msgRevisionDetectionAlreadyOn
Revision Detection is already set to %1.
@@
@msgRevisionDetectionDefault_l
Setting Revision Detection back to default setting, Speak Type.
@@
@msgRevisionDetectionDefault_s
Revision Detection back to Speak Type.
@@
@msgIndicateWhenTyping
when typing
@@
@msgIndicateWhenNavigating
when navigating
@@
@msgIndicateWhenReading
when reading
@@
@msgIndicateDuringSayAll
during Say All
@@
@msgIndicateWhenTypingAndNavigating
when typing and navigating
@@
@msgIndicateWhenTypingAndReading
when typing and  reading
@@
@msgIndicateWhenTypingAndNavigatingAndReading
when typing, navigating, and reading
@@
@msgIndicateWhenNavigatingAndReading
when navigating and  reading
@@
@msgWebViewNewLineIndicationWarning
WARNING: turning off new line indication in Web view!
@@
@msgErrorSayAllProtectedForm_l
Say All is not available for a protected form. Instead, use quick key navigation to jump to edit, checkbox, or combo box fields.
@@
@msgErrorSayAllProtectedForm_s
Say All not available for protected form. Use quick key navigation instead.
@@
@msgJHotkeyHelpOutline
ToggleBetweenAllAndHeadingsOnly  %KeyFor(toggleBetweenAllAndHeadingsOnly)
ShowHeading1  %KeyFor(showHeading1)
ShowHeading2  %KeyFor(showHeading2)
ShowHeading3  %KeyFor(showHeading3)
ShowHeading4  %KeyFor(showHeading4)
ShowHeading5  %KeyFor(showHeading5)
ShowHeading6  %KeyFor(showHeading6)
ShowHeading7  %KeyFor(showHeading7)
ShowHeading8  %KeyFor(showHeading8)
ShowHeading9  %KeyFor(ShowHeading9)
SelectNextHeading OrListLevelStyle  %KeyFor(selectNextHeadingOrListLevelStyle)
SelectPriorHeadingOrListLevelStyle  %KeyFor(selectPriorHeadingOrListLevelStyle)
MoveHeadingUp  %KeyFor(moveHeadingUp)
MoveHeadingDown  %keyFor(moveHeadingDown)
@@
@msgNoItemsToDisplay
There are no items to display.
@@
@msgListOfItemsToDisplayInVV
Items to Display in Virtual Viewer
@@
;for msgListItemsPleaseWait, %1 is the type of item.
@msgListItemsPleaseWait
Please wait: Processing %1
@@
;for msgListLevelNum, %1 is the list string, %2 the level.
@msgListLevelNum
%1 list level %2
@@
;For msgHeadingLevelNum, %1 is the heading, %2 the level.
@msgHeadingLevelNum
%1 heading level %2
@@
@msgNonuniformTableFirstCellInColumnError
Cannot determine first cell in this column because the table is nonuniform.
@@
@msgScreenSensitiveHelpListbox
Use all the arrow keys to move through and select items in this list.
@@
;for msgPageName, %1 is the page name
@msgPageName
%1 page
@@
@msgNonUniformTableColumnError_l
Since this table is nonuniform, you cannot  read columns because not all columns have the same number of cells.
@@
@msgNonUniformTableColumnError_s
The table is nonuniform, so you cannot  read the current column.
@@
;for msgOnlyOneItemToDisplayInVirtualViewer, %1 is the type of item.
@msgOnlyOneItemToDisplayInVirtualViewer
There is only one %1 to display.
@@
;for msgNumberOfItemsToDisplayInVirtualViewer, %1 is the number of items, %2 is the type.
@msgNumberOfItemsToDisplayInVirtualViewer
There are %1 %2 in this document.
@@
@msgCheckForLinkFields
Check for link type fields with %KeyFor(SElectAField).
@@
@msgShapeTypeSelected
The object is selected.
@@
@msgAutoShape
autoshape
@@
@msgCallout
callout
@@
@msgCanvas
canvas
@@
@msgChart
chart
@@
@msgCommentObject
comment
@@
@msgDiagram
diagram
@@
@msgEmbeddedOLEObject
embedded OLE
@@
@msgFormControl
form control
@@
@msgFreeform
free form
@@
@msgGroup
group
@@
@msgLine
line
@@
@msgLinkedOLEObject
linked OLE
@@
@msgLinkedPicture
linked picture
@@
@msgMedia
media
@@
@msgOLEControlObject
OLE control
@@
@msgPicture
picture
@@
@msgPlaceholder
placeholder
@@
@msgScriptAnchor
script anchor
@@
@msgShapeTypeMixed
mixed type
@@
@msgTableObject
table
@@
@msgTextbox
textbox
@@
@msgTextEffect
text effect object
@@
@msgDefinedTableBookmarkTitlesError
!(Change the Defined Bookmark Table Column and Row Titles Override option to set the current setting manually.)
@@
@msgBrlMathStatusCells
math
@@
@msgBrlRevisionStatusCells
r
@@
@msgBrlDeletedRevisionStatusCells
dr
@@
@msgBrlInsertedRevisionStatusCells
ir
@@
@msgBrlComment
c
@@
@msgMarkingPlace
marking place
@@
@msgPlaceAlreadyMarked
place already marked
@@
@msgReturningToMarkedPlace
returning to marked place
@@
@msgMarkedPlaceError_l
There is no marked place for this document.
@@
@msgMarkedPlaceError_s
no marked place for this document
@@
@msgAlreadyAtMarkedPlace_l
You are already at the marked place in this document.
@@
@msgAlreadyAtMarkedPlace_s
already at marked place
@@
@msgMarkedPlaceSaveStoryError_l
A marked place may be saved only while in the main document text.
@@
@msgMarkedPlaceBeginningOfDocumentError_L
Setting a marked place at the beginning of the document is not valid.
@@
@msgMarkedPlaceBeginningOfDocumentError_S
Marked place is not valid at beginning of document.
@@
@msgMarkedPlaceSaveDocError_l
You must save this document before marking a place to return to later.
@@
@msgMarkedPlaceSaveDocError_s
Save document before marking place.
@@
@msgMarkedPlaceNotValidError_l
The marked place set is past the end of this document.
@@
@msgMarkedPlaceNotValidError_s
marked place past end of document
@@
@msgMarkedPlaceSelectingTextError_l
You must first mark a place in the document with %KeyFor(MarkPlace) so you can select text between that place and your current location.
@@
@msgMarkedPlaceSelectingTextError_s
Mark a place in the document with %KeyFor(MarkPlace) so you can select between that place and your current location.
@@
@msgMarkedPlaceSelectingText
selecting between marked place and current position
@@
; for msgSelectedPictureDesc used in constructing representation of
;selected inline shapes or embedded objects,%1=alternative text if it exists, or name, if it exists, %2=width and %3=height,
;width and height as returned from pointsToDefaultUnits, eg 3 centimeters.
@msgSelectedPictureDesc
%1, %2 wide by %3 high
@@
@msgChangedCaseFrom
changed case for the range of words starting with
@@
@msgChangedCaseTo
to the word
@@
@msgSelectedTextMarkingPlaceError_l
Cannot determine where to mark place when text is selected.
@@
@msgProtectedDocOrFormMarkingPlaceError_l
A protected document or form cannot be marked for returning to a marked place later.
@@
@msgProtectedDocOrFormMarkingPlaceError_s
A protected document or form cannot be marked for later use.
@@
@msgScreenSensitiveHelp_ZoomLevel_l
The zoom level is set to "Many pages". For best results, change the zoom level through the View menu Zoom option to something closer to 100%.
@@
@msgScreenSensitiveHelp_ZoomLevel_s
zoom level set to "Many pages". Change the zoom level through the View menu Zoom option to something closer to 100%.
@@
;for when cell coordinates are off and user navigates to new cell by character, word or line:
@msgNewCell
new cell
@@
;Pane Types
@msgMainDocPane
Document pane
@@
@msgFootNotePane
Footnote pane
@@
@msgEndNotePane
end note pane
@@
@msgCommentPane
comment pane
@@
@msgTextFramePane
text frame pane
@@
@msgEvenPagesHeaderPane
even pages header pane
@@
@msgPrimaryHeaderPane
primary header pane
@@
@msgEvenPagesFooterPane
even pages footer pane
@@
@msgPrimaryFooterPane
primary footer pane
@@
@msgFirstPageHeaderPane
first page header pane
@@
@msgFirstPageFooterPane
first page footer pane
@@
@msgQuickNavNotAvailable_L
The ability to toggle Quick Navigation on and off is only available in an open document, editable message,  or unprotected form.
@@
@msgNoDocTables_L
There are no tables in this document.
@@
@msgNoDocTables_S
No tables
@@
@msgNoDocFields_L
There are no fields in this document.
@@
@msgNoDocFields_s
No fields
@@
@msgNoDocBookmarks_L
There are no bookmarks in this document.
@@
@msgNoDocBookmarks_S
No bookmarks
@@
@msgNoDocEndnotes_L
There are no end notes in this document.
@@
@msgNoDocEndnotes_S
No end notes
@@
@msgNoDocFootnotes_L
There are no footnotes in this document.
@@
@msgNoDocFootnotes_S
No footnotes
@@
@msgNoDocComments_L
There are no comments in this document.
@@
@msgNoDocComments_S
No comments
@@
@msgNoDocGraphics_L
There are no graphics in this document.
@@
@msgNoDocGraphics_S
No graphics
@@
@msgNoDocPages_l
There is only one page in this document.
@@
@msgNoDocPages_s
only one page
@@
@msgMoveToPageError_L
Error moving to page
@@
@msgMoveToPageError_S
Error moving to page
@@
@msgNoDocSections_L
There is only one section in this document.
@@
@msgNoDocSections_S
only one section
@@
@msgJumpToLineNotAvailable_L
Jump to line is only available on the Internet.
@@
@msgNoGrammaticalErrors_l
There are no grammatical errors in this document.
@@
@msgNoGrammaticalErrors_s
No grammatical errors
@@
@msgNoSpellingErrors_l
There are no spelling errors in this document.
@@
@msgNoSpellingErrors_s
No spelling errors
@@
@msgNoDocRevisions_l
There are no revisions in this document.
@@
@msgNoDocRevisions_s
no revisions
@@
@MsgNoDocHeadings_l
There are no headings in this document.
@@
@msgNoDocHeadings_s
No headings
@@
@msgHTMLKey_l
This key is unavailable in Microsoft Word.
@@
@msgHTMLKey_s
unavailable in Microsoft Word
@@
@msgOutlookHTMLKey_l
This key is unavailable in Microsoft Outlook 2007 or above.
@@
@msgOutlookHTMLKey_s
unavailable in Microsoft Outlook 2007 or above
@@
@msgQuickKeyTrackChanges_l
You must turn on Track Changes to enable this feature. The Word shortcut key is  CONTROL+SHIFT+E.
@@
@msgQuickKeyTrackChanges_s
Turn on Track Changes. The shortcut is  CONTROL+SHIFT+E.
@@
@msgRevisionInsertedText
Inserted
@@
@msgDeletedText
Deleted:
@@
@msgCheckSpellingDisabled
The option to check spelling as you type is disabled.
@@
@msgCheckGrammarDisabled
The option to check grammar as you type is disabled.
@@
@msgOutOfList
out of list
@@
@msgNoComboBoxes_l
There are no ComboBox formfields in this document.
@@
@msgNoComboBoxes_s
no ComboBox formfields
@@
@msgNoCheckBoxes_l
There are no Checkbox formfields in this document.
@@
@msgNoCheckBoxes_s
no Checkbox formfields
@@
@msgNoEditFormFields_l
There are no Edit formfields in this document.
@@
@msgNoEditFormfields_s
no Edit formfields
@@
@msgSMMInsertedText
Inserted Text
@@
@msgSMMDeletedText
Deleted Text
@@
; For msgCommentRef, %1 is the text, %2 the author of the comment.
@msgCommentRef
Comment reference: %1 by %2
@@
;for msgNoBookmarkname_l/s, %1 is the text the bookmark is on.
@msgNoBookmarkName_l
Bookmark at %1. This bookmark is not named.
@@
@msgNoBookmarkName_s
bookmark at %1; not named
@@
@msgOutlookQuickKeys
Move to next grammatical error %KeyFor(MoveToNextGrammaticalError )
Move to prior grammatical error %KeyFor(MoveToPriorGrammaticalError)
Move to next field %KeyFor(MoveToNextField)
Move to prior field %KeyFor(MoveToPriorField)
Move to next graphic %KeyFor(MoveToNextGraphic)
Move to prior graphic %KeyFor(MoveToPriorGraphic)
Move to next heading %keyFor(moveToNextHeading)
Move to prior heading %KeyFor(moveToPriorHeading)
Move to next heading level 1  %KeyFor(MoveToNextHeading(1))
Move to next heading level 2  %KeyFor(MoveToNextHeading(2))
Move to next heading level 3  %KeyFor(MoveToNextHeading(3))
Move to next heading level 4  %KeyFor(MoveToNextHeading(4))
Move to next heading level 5  %KeyFor(MoveToNextHeading(5))
Move to next heading level 6  %KeyFor(MoveToNextHeading(6))
Move to next heading level 7  %KeyFor(MoveToNextHeading(7))
Move to next heading level 8  %KeyFor(MoveToNextHeading(8))
Move to next heading level 9  %KeyFor(MoveToNextHeading(9))
Move to prior heading level 1  %KeyFor(MoveToPriorHeading(1))
Move to prior heading level 2  %KeyFor(MoveToPriorHeading(2))
Move to prior heading level 3  %KeyFor(MoveToPriorHeading(3))
Move to prior heading level 4  %KeyFor(MoveToPriorHeading(4))
Move to prior heading level 5  %KeyFor(MoveToPriorHeading(5))
Move to prior heading level 6  %KeyFor(MoveToPriorHeading(6))
Move to prior heading level 7  %KeyFor(MoveToPriorHeading(7))
Move to prior heading level 8  %KeyFor(MoveToPriorHeading(8))
Move to prior heading level 9  %KeyFor(MoveToPriorHeading(9))
Say next paragraph %keyFor(SayNextParagraph)
Say prior  paragraph %keyFor(SayPriorParagraph)
Move to next spelling error %keyFor(MoveToNextSpellingError)
Move to prior spelling error %KeyFor(MoveToPriorSpellingError)
Move to next table  %KeyFor(MoveToNextTable)
Move to prior table  %KeyFor(MoveToPriorTable)
Move past end of table  %KeyFor(StepToEndOfElement)
Move to before start of table  %KeyFor(StepToStartOfElement)
Move to next word in word list  %KeyFor(MoveToNextWordFromList)
Move to prior word in word list  %KeyFor(MoveToPriorWordFromList)
@@
@msgOutlookHotkeyHelp
To move to the next email, press %KeyFor(MoveToNextEmail)
To move to the prior email in this thread, press %KeyFor(MoveToPriorEmail)

To move to the relevant field, press one of the following keys to hear the contents of the field; press twice to jump to that field:
Read From field  %KeyFor(ReadEmailFromField).
Read Sent field  %KeyFor(ReadEmailDateField).
Read TO field  %KeyFor(ReadOutlookHeader(3)).
Read Carbon copy field  %KeyFor(ReadOutlookHeader(4)).
Read Blind Carbon copy field  %KeyFor(ReadOutlookHeader(6)).
Read Subject field  %KeyFor(ReadOutlookHeader(5)).
Go to Message field, %KeyFor(GotoOutlookMessageBodyWindow).
Cancel message, %KeyFor(UpALevel).
Hear Outlook Info Bar text, %KeyFor(AnnounceOutlookInfoBar).
Reply directly to Sender, %KeyFor(ReplyDirectlyToSender).

Display global key stroke dialog list,  Press %KeyFor(CallToolBars).
Hear %product% help topic for Outlook,   press %KeyFor(ScreenSensitiveHelp) twice quickly.

Set Quick Settings  %KeyFor(QuickSettings)
Say the current field  %KeyFor(SayField)
Say the version of MS Outlook being used  %KeyFor(SayAppVersion)
List Fields  %KeyFor(SelectAField)
List Tables  %KeyFor(selectATable)
List words marked as misspelled  %KeyFor(listSpellingErrors)
List grammatical errors  %KeyFor(listGrammaticalErrors)
List objects such as clipart  or textboxes %KeyFor(listObjects)
List hyperlinks in the current message %KeyFor(ReadMistakeAndSuggestion )
List headings in the current message  %KeyFor(ListHeadings)
List ms Outlook short cut keys  %KeyFor(WindowKeysHelp)
Say the current table column %KeyFor(ReadCurrentColumn)
Say the current table row %KeyFor(ReadCurrentRow)
Move to and say the prior table column %keyFor(SayPriorColumn)
Move to and say the next table column %keyFor(SayNextColumn)
Move to and say the prior table row %keyFor(SayPriorRow)
Move to and say the next table row %keyFor(SayNextRow)
@@
;for msgLargeRangeOfSelectedDocumentText
;%1 is the count of characters selected
;%2 is the first few words in the selection
;%3 is the last few words in the selection
@msgLargeRangeOfSelectedDocumentText
%1 characters selected,
from %2
through %3
@@
;Fake name for advanced 'More' symbols dialog box.
;The name doesn't really exist, we are just making it up.
;Word 2007 or 2010, the edit field this is for is found:
;Insert, Symbol, More Symbols
;but you're not localizing anything that is actually there, we're just adding a name.
@msgSelectASymbol
Select a Symbol:
@@
@msgRevision
Revision
@@
@msgSuggestion
Suggestion:
@@
;For msgSuggestions, %1 is the number of suggestions available in the issue checker of the Microsoft Editor.
@msgSuggestions
Suggestions: %1
@@
@msgProofingAcceleratorsNotAvailable
Press the accelerator key only, without the ALT key in Office 2013 or later.
@@
@msgReadWordInContextNotAvailable
Word in context is no longer available in the Word 2013 proofing pane.
@@
@msgReadWordInContextNotAvailableInOutlook2013
Word in context is no longer available in dialogs for Outlook 2013 or later.
@@
@msgReasonTextAvailable
Reason text is virtualized.
@@
@msgExtendedSelectionNotAvailableVirtualizedMessages
Extended selection not available in virtualized Outlook messages.
@@
@msgSelectedHugeAmountOfText
Selected %1 characters from %2 through %3.
@@
;msgCommentDocumentText is used to show the text in the document to which a comment applies.
;Double-tap AnnounceComment script to show the comment in the user buffer.
;%1 is the text in the document to which the comment applies.
@msgCommentDocumentText
Document text:
%1
@@
;msgNoOpenDocument is spoken when focus is in the Word client area and there are no open documents
@msgNoOpenDocument
No open document
@@
;msgBasicLayerHelpScreen_Heading_MSWord will appears in the basic layer help screens in Microsoft Word.
;It is the heading for the section of help text in cmsgBasicLayerHelpScreen_MSWord.
@msgBasicLayerHelpScreen_Heading_MSWord
Microsoft Word
@@
;msgBasicLayerHelpScreen_MSWord will appear in the basic layer help screen and will list the features for Microsoft Word.
@msgBasicLayerHelpScreen_MSWord
The following commands are available in Microsoft Word documents.
Select text between marked place and current position = M.
Text Analyzer On/Off = A.
@@
@msgWordInContextError2013andLater
Not available outside of tables or Spellchecker in Office 2013 or later.
@@
; for msgSpellCheckSentenceTutor, this is the tutor messae for Office365 with the new spellcheck for split buttons.
; This is only for the Current Sentence edit field.
@msgSpellCheckSentenceTutor
Press enter to accept default suggestion.
@@
@msgChangeAllError
To change all, tab to the suggestion you want, press Alt+DownArrow and select Change All.
@@
; for msgAutocorrect, %1 is the text of the autocorrection as presented by the UIA event.
@msgAutocorrect
Auto correct: %1
@@
@msgMathErrorMessage
Not on math content
@@
@msgMathContentScreenSensitiveHelp
This is math content in the active document.
To view this equation or formula in Math Viewer,  press JAWSKey+Space followed by the equals sign.
Math Viewer lets you navigate individual parts of an equation like variables, terms, coefficients, exponents, etc. 
As you navigate to the various components, pressing ENTER will let you drill down into and navigate within that level of the equation using RIGHT and LEFT ARROW. Pressing UP ARROW will move you back to the prior level.

Press Escape to close this message.
@@
@msgShouldAbortFromLargeDocumentDialogTitle
Document Probably Too Big For proofing errors lists.
@@
; for msgShouldAbortFromLargeDocumentDialogText, %1 = the word count from the active document.
;%2 = the threshold over which it may be unsafe to list spelling errors.
; see Word.jcf, NonJCFOptions section, WordCountThresholdForSpellingErrors
@msgShouldAbortFromLargeDocumentDialogText
This document contains %1 words. 
A document over %2 words in length may cause Word to become unresponsive when gathering all misspellings at once.
We recommend you use Quick Navigation Keys for proofing errors instead.
Are you sure you want to bring up the list of errors now?
@@
; for msgAnnotationAuthor, %1 is the author string from UIA
@msgAnnotationAuthor
by %1
@@
; for msgAnnotationDateTime %1 = the dateTime string from UIA
@msgAnnotationDateTime
on %1
@@
@msgNoAnnotationAtCursor_L
No annotation at cursor
@@
@msgNoAnnotationAtCursor_S
No annotation
@@
@msgHeaderFooterContainsGraphics
Contains one or more graphics.

@@
@msgEditHeaderInstructions
Edit the header to examine graphics and any alternative text. Press alt+q for Office Quick Search, then type "Edit header" to quickly find this option in the ribbons.
@@
@msgEditFooterInstructions
Edit the footer to examine graphics and any alternative text. Press alt+q for Office Quick Search, then type "Edit footer" to quickly find this option in the ribbons.
@@
; msgTableDimensionsChanged messages are spoken when the table regains focus when deleting or adding rows or columns in the table.
; For uniform tables, %1 is the count of columns, %2 the count of rows.
@msgTableDimensionsChanged_NonUniformTable_L
table dimensions changed
@@
@msgTableDimensionsChanged_NonUniformTable_S
dimensions changed
@@
@msgTableDimensionsChanged_UniformTable_L
table dimensions changed to %1 columns and %2 rows
@@
@msgTableDimensionsChanged_UniformTable_S
dimensions changed to %1 by %2
@@
endMessages

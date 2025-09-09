; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS common message file
;UO.jsm:
;= companion to common.jsm,
;contains support strings for 'Adjust JAWS Options' dialog.

CONST
	WN_ADJUST_JAWS_OPTIONS = "Adjust JAWS Options",
;Nodes:
	NODE_PATH_DELIMITER = "^",
	NODE_GENERAL = "General Options",
	NODE_READING = "Reading Options",
	NODE_SAYALL = "SayAll Options",
	NODE_EDITING = "Editing Options",
	NODE_SPELLING = "Spelling Options",
	Node_Numbers = "Numbers Options",
	NODE_VCURSOR = "Virtual Cursor Options",
	NODE_VCURSOR_TEXT = "Text Options",
	NODE_VCURSOR_GRAPHICS = "Graphics Options",
	NODE_VCURSOR_LINKS = "Links Options",
	NODE_VCURSOR_FORMS = "Forms Options",
	NODE_VCURSOR_HEADINGS_FRAMES = "Heading and Frame Options",
	NODE_VCURSOR_LISTS_TABLES = "List and Table Options",
;Braille Options nodes:
;The following is the root of the Braille Options for AdjustJAWSOptions.
;The AdjustBrailleOptions dialog, per its title, needs no such root node.
	NODE_BRL_ = "Braille Options",
	NODE_BRL_G2 = "Translation Options",
	NODE_BRL_CURSOR = "Cursor Options",
	NODE_BRL_PANNING = "Panning Options",
	NODE_BRL_TABLE = "Table Options",
	NODE_BRL_MARKING = "Marking Options",
;String constants for tree child items:
;For main User Options:
	UO_VerbositySetLevel = "VerbositySetLevel:User Verbosity",
	uo_UseTandemConnectSounds = "UseTandemConnectSounds:Tandem Connect Sounds",
	UO_VirtualRibbonSupport = "ToggleVirtualRibbons:Virtual Ribbon Menu",
	UO_FocusLossAnnounce = "UOToggleFocusLossAnnounce:Focus Loss Announcement",
	uo_TextAnalyzerToggle = "TextAnalyzerToggle:Text Analyzer",
	UO_SmartWordReadingSet="SmartWordReadingSet:Smart Word Reading",
	UO_StopWordsExceptionDictionaryToggle = "StopWordsExceptionDictionaryToggle:Stopwords Exception Dictionary",
	UO_SpellModeSet = "SpellModeSet:Text Spell",
	UO_AlphaNumCombinations = "AlphaNumCombinations:Alphanumeric Text",
	UO_SpeakSingleDigitsThreshold = "SpeakSingleDigitsThreshold:Speak Single Digits Threshold",
	UO_SpeakSingleDigitsDashes = "SpeakSingleDigitsDashes:Speak Single Digits If Number Contains Dashes ",
	UO_ProgressBarSetAnnouncement = "ProgressBarSetAnnouncement:Progress Bars",
	UO_TypingEchoSet = "TypingEchoSet:Typing Echo",
	UO_ScreenEchoSet = "ScreenEchoSet:Screen Echo",
	UO_GraphicsShow = "GraphicsShow:Graphics",
	UO_CustomLabelsSet = "CustomLabelsSet:Custom Labels",
	UO_TopAndBottomEdgeIndicate = "TopAndBottomEdgeIndicate:Top And Bottom Edge",
	UO_LanguageDetectChange = "LanguageDetectChange:Language Detect Change",
	UO_CustomLanguageDetectChange = "UOCustomLanguageDetectChange:Language Detect Change",
	UO_SayAllScheme = "UOSayAllScheme:Scheme",
	UO_CustomSayAllScheme = "CustomSayAllScheme:Scheme",
	UO_SayAllReadsBy = "SayAllReadsBy:SayAll Reads By",
	UO_CapsIndicateDuringSayAll = "CapsIndicateDuringSayAll:Capitalization",
	UO_CapsIndicate = "CapsIndicate:Caps Indicate",
	UO_PunctuationSetLevel = "PunctuationSetLevel:Punctuation",
	UO_IndentationIndicate = "IndentationIndicate:Indentation",
	UO_SynthesizerMute = "SynthesizerMute:Synthesizer",
;For Virtual Cursor Options
	UO_CustomVirtualDocumentLinkActivationMethod = "CustomVirtualDocumentLinkActivationMethod:Link activation",
	UO_SayAllOnDocumentLoad = "ToggleSayAllOnDocumentLoad:Document automatically reads",
	UO_CustomSayAllOnDocumentLoad = "CustomToggleSayAllOnDocumentLoad:Document automatically reads",
	UO_NavigationQuickKeysSet = "NavigationQuickKeysSet:Navigation Quick Keys",
	UO_CustomNavigationQuickKeysSet = "UOCustomNavigationQuickKeysSet:Navigation Quick Keys",
	UO_DocumentPresentationSet = "DocumentPresentationSet:Document Presentation",
	UO_CustomDocumentPresentationSet = "UOCustomDocumentPresentationSet:Document Presentation",
	;For Personlize Settings, we use Custom instead of vCursor:
	UO_vCursorGraphicsShow = "vCursorGraphicsShow:Graphics Show",
	UO_CustomGraphicsShow = "UOCustomGraphicsShow:Graphics Show",
	UO_vCursorGraphicsSetRecognition = "vCursorGraphicsSetRecognition:Graphics recognize by",
	UO_CustomGraphicsSetRecognition = "UOCustomGraphicsSetRecognition:Graphics recognize by",
	UO_vCursorFilterConsecutiveDuplicateLinks = "VCursorFilterConsecutiveDuplicateLinks:Filter Consecutive Duplicate Links",
	UO_CustomFilterConsecutiveDuplicateLinks = "CustomFilterConsecutiveDuplicateLinks:Filter Consecutive Duplicate Links",
	UO_vCursorGraphicalLinksSet = "vCursorGraphicalLinksSet:Graphical Links Show",
	UO_CustomGraphicalLinksSet = "UOCustomGraphicalLinksSet:Graphical Links Show",
	UO_vCursorUntaggedGraphicalLinkShow = "vCursorUntaggedGraphicalLinkShow:Untagged Graphical Links Show",
	UO_CustomUntaggedGraphicalLinkShow = "UOCustomUntaggedGraphicalLinkShow:Untagged Graphical Links Show",
	UO_vCursorImageMapLinksShow = "vCursorImageMapLinksShow:Links In Image Maps Show",
	UO_CustomImageMapLinksShow = "UOCustomImageMapLinksShow:Links In Image Maps Show",
	UO_vCursorTextLinksShow = "vCursorTextLinksShow:text Links show Using",
	UO_CustomTextLinksShow = "UOCustomTextLinksShow:text Links show Using",
	UO_vCursorLinksIdentifyType = "vCursorLinksIdentifyType:Links Identify Type",
	UO_CustomLinksIdentifyType = "UOCustomLinksIdentifyType:Links Identify Type",
	UO_vCursorEnhancedClipboard = "vCursorEnhancedClipboard:Select and Copy",
	uo_vCursorAutoFormsMode = "vCursorAutoFormsMode:Auto Forms Mode",
	uo_CustomAutoFormsMode = "UOCustomAutoFormsMode:Auto Forms Mode",
	uo_vCursorIndicateFormsModeWithSounds = "vCursorIndicateFormsModeWithSounds:Use Sound",
	uo_vCursorNavQuickKeyDelay = "vCursorNavQuickKeyDelay:Navigation Quick Key Delay",
	uo_CustomNavQuickKeyDelay = "UOCustomNavQuickKeyDelay:Navigation Quick Key Delay",
	UO_CustomEnhancedClipboard = "UOCustomEnhancedClipboard:Select and Copy",
	UO_vCursorReadOnlyState = "vCursorReadOnlyState:Read Only State",
	UO_CustomReadOnlyState = "CustomReadOnlyState:Read Only State",
	;Note to translators:
	;In the following text string,
	;The final segment contains the escape sequence:
	;\34, which mean s double quote.
	;This is a quote representation around the text.
	;Feel free to move the character set \34 in its entirety to suit your needs,
	;but keep that set intact.
	UO_vCursorLinksIdentifySamePage = "vCursorLinksIdentifySamePage:Links Identify \34Same Page\34",
	UO_CustomLinksIdentifySamePage = "UOCustomLinksIdentifySamePage:Links Identify \34Same Page\34",
	UO_vCursorButtonsShowUsing = "vCursorButtonsShowUsing:Buttons Show Using",
	;This  isn't a custom button setting, but settings for Custom or Personalized Web Settings regarding buttons:
	UO_CustomButtonsShowUsing = "UOCustomButtonsShowUsing:Buttons Show Using",
	UO_vCursorAbbreviationsExpand = "vCursorAbbreviationsExpand:Abbreviations Expand",
	UO_CustomAbbreviationsExpand = "UOCustomAbbreviationsExpand:Abbreviations Expand",
	UO_vCursorAcronymsExpand = "vCursorAcronymsExpand:Acronyms Expand",
	UO_CustomAcronymsExpand = "UOCustomAcronymsExpand:Acronyms Expand",
	UO_vCursorFormFieldsIdentifyPromptUsing = "vCursorFormFieldsIdentifyPromptUsing:Form Fields Identify Prompt Using",
	UO_CustomFormFieldsIdentifyPromptUsing = "UOCustomFormFieldsIdentifyPromptUsing:Form Fields Identify Prompt Using",
	UO_vCursorFramesShowStartAndEnd = "vCursorFramesShowStartAndEnd:Frames Show Start And End",
	UO_CustomFramesShowStartAndEnd = "UOCustomFramesShowStartAndEnd:Frames Show Start And End",
	UO_vCursorInlineFramesShow = "vCursorInlineFramesShow:Inline Frames Show",
	UO_CustomInlineFramesShow = "UOCustomInlineFramesShow:Inline Frames Show",
	UO_vCursorScreenTrack = "vCursorScreenTrack:Screen Track Virtual Cursor",
	UO_CustomScreenTrack = "UOCustomScreenTrack:Screen Track Virtual Cursor",
	UO_vCursorRepeatedTextSkip = "vCursorRepeatedTextSkip:Repeated Text Skip",
	UO_CustomRepeatedTextSkip = "UOCustomRepeatedTextSkip:Repeated Text Skip",
	UO_vCursorBlockQuotesIdentifyStartAndEnd = "vCursorBlockQuotesIdentifyStartAndEnd:Block Quotes Identify Start And End",
	UO_CustomBlockQuotesIdentifyStartAndEnd = "UOCustomBlockQuotesIdentifyStartAndEnd:Block Quotes Identify Start And End",
	UO_vCursorListsIdentifyStartAndEnd = "vCursorListsIdentifyStartAndEnd:Lists Identify Start And End",
	UO_CustomListsIdentifyStartAndEnd = "UOCustomListsIdentifyStartAndEnd:Lists Identify Start And End",
	UO_vCursorAccessKeysShow = "vCursorAccessKeysShow:Access Keys Show",
	UO_vCursorAttributesIndicate = "vCursorAttributesIndicate:Attributes Indicate",
	UO_CustomAttributesIndicate = "UOCustonAttributesIndicate:Attributes Indicate",
	UO_vCursorTablesShowStartAndEnd = "vCursorTablesShowStartAndEnd:Tables Show Start and End",
	UO_CustomTablesShowStartAndEnd = "UOCustomTablesShowStartAndEnd:Tables Show Start and End",
	UO_vCursorLayoutTables = "vCursorLayoutTables:Layout Tables",
	UO_CustomLayoutTables = "UOCustomLayoutTables:Layout Tables",
	UO_vCursorTableTitlesAnnounce = "vCursorTableTitlesAnnounce:Table Titles Announce",
	UO_CustomTableTitlesAnnounce = "UOCustomTableTitlesAnnounce:Table Titles Announce",
	UO_vCursorCellCoordinatesAnnouncement ="VCursorCellCoordinatesAnnouncement:Cell coordinates announcement",
	UO_vCursorHeadingsAnnounce = "vCursorHeadingsAnnounce:Headings Announce",
	UO_CustomHeadingsAnnounce = "UOCustomHeadingsAnnounce:Headings Announce",
	UO_vCursorFlashMoviesRecognize = "FlashMoviesRecognize:Flash Movies Recognize",
	UO_CustomFlashMoviesRecognize = "UOCustomFlashMoviesRecognize:Flash Movies Recognize",
	UO_vCursorPageRefresh = "PageRefresh:Page Refresh",
	UO_vCursorAnnounceLiveRegionUpdates = "AnnounceLiveRegionUpdates:Announce live region updates",
	UO_CustomPageRefresh = "UOCustomPageRefresh:Page Refresh",
	UO_CustomAnnounceLiveRegionUpdates = "CustomAnnounceLiveRegionUpdates:Announce live region updates",
	UO_vCursorFormsModeAutoOff = "vCursorFormsModeAutoOff:Forms Mode Off When New Page Loads",
	UO_CustomFormsModeAutoOff = "UOCUstomFormsModeAutoOff:Forms Mode Off When New Page Loads",
	UO_vCursorCustomPageSummary = "vCursorCustomPageSummary:Custom Page Summary",
	UO_CustomCustomPageSummary = "UOCustomCustomPageSummary:Custom Page Summary",
	;Personalized Settings Clear Option
	UO_CustomVirtualCursorSet = "UOCustomVirtualCursorSet:Virtual Cursor",
	UO_CustomClearAllSettings = "UOCustomClearAllSettings:Personalized Settings",
;For Braille Main User Options:
	UO_ActiveModeOption = "UOActiveModeOption:Mode",
	UO_GradeTwoModeOption = "UOGradeTwoModeOption:Translator",
	uo_Grade2Rules = "UOGrade2Rules:Rules",
	UO_G2CapsSuppress = "UOG2CapsSuppress:Capital Signs Suppress",
	UO_CurrentWordExpand = "UOCurrentWordExpand:Current Word Expand",
	UO_ActiveFollowsBraille = "UOActiveFollowsBraille:Active Follows Braille",
	UO_BrailleFollowsActive = "UOBrailleFollowsActive:Braille Follows Active",
	UO_FlashMessages = "UOFlashMessages:Flash Messages",
	UO_BrailleKeysInterruptSpech = "UOBrailleKeysInterruptSpech:Braille Keys Interrupt Speech",
	UO_BrailleMarking = "UOBrailleMarking:Marking uses dots 7 and 8",
	UO_EightDotBraille = "UOEightDotBraille:Eight Dot Braille",
	UO_PanBy = "UOPanBy:Pan By",
	UO_WordWrap = "UOWordWrap:Word Wrap",
	UO_AutoPan = "UOAutoPan:Auto Pan",
	UO_BrailleZoom = "BrailleZoom:Table Display",
	UO_BrailleShowHeaders = "BrailleShowHeaders:Table Show Titles",
	UO_BrailleShowCoords = "BrailleShowCoords:Table Show Coordinates",
	uo_BrailleStudyMode = "ToggleBrailleStudyMode:Study Mode",
;Marking Options, dots 7 and 8:
	UO_MarkHighlight = "MarkHighlight:Highlight",
	UO_MarkBold = "MarkBold:Bold",
	UO_MarkUnderline = "MarkUnderline:Underline",
	UO_MarkItalic = "MarkItalic:Italic",
	UO_MarkStrikeOut = "MarkStrikeOut:Strike Out",
	UO_MarkColor = "MarkColor:Colors",
	UO_MarkScript	= "MarkScript:Script Defined",



;UNUSED_VARIABLES

	UO_BrailleTypeKeysModeOption = "ToggleTypeKeysMode:Typing Mode"

;END_OF_UNUSED_VARIABLES

Messages
@msgUO_On
On
@@
@msgUO_Off
Off
@@
@msgUO_spoken
Spoken
@@
@msgUO_Silent
Silent
@@
@msgUO_Indicate
Indicate
@@
@msgUO_Announce
Announce
@@
@msgUO_Ignore
Ignore
@@
@msgUO_AlertSound
Alert With Sound
@@
@msgUO_Unavailable
Unavailable
@@
@msgUO_Enabled
Enabled
@@
@msgUO_Disabled
Disabled
@@
@msgUO_BVerbosity_Beginner
Beginner
@@
@msgUO_BVerbosity_Intermediate
Intermediate
@@
@msgUO_BVerbosity_Advanced
Advanced
@@
@msgUO_SpellTextStandard
Alphabetically
@@
@msgUO_SpellTextPhonetic
Phonetically
@@
@msgUO_CombinationsReadNormal
Read As Word
@@
@msgUOCombinationsSpell
Spell
@@
@msgUO_CombinationsSpellPhonetic
Spell Phonetically
@@
@msgUO_CapsIndicateChar
On Character
@@
@msgUO_CapsIndicateWord
On Character And Word
@@
@msgUO_CapsIndicateLine
On Character, Word, and Line
@@
@msgUO_CapsIndicateNever
Never
@@
@msgUO_GraphicalLinksShowImage
Image Source
@@
@msgUO_GraphicalLinksShowLinkSRC
URL
@@
@msgUOSummarySpeak
Speak PlaceMarkers
@@
@msgUO_CustomSummaryShowVCursor
Virtualize PlaceMarkers
@@
;Callback hlp strings:
@msgUO_UnknownItemHlp_ChildObject
Press the space bar on this item to view all settings for this option. Each press of the space bar set the option to the new setting.
@@
@msgUO_UnknownItemHlp_LeafCollapsed
Press the right arrow to open the group. Then press the down arrow to view all its options.
@@
@msgUO_UnknownItemHlp_LeafExpanded
Use the up and down arrow keys to view options within this group.
@@
@msgUO_VerbositySetLevelHlp
This option controls the Verbosity, or amount of information, spoken by %product%.
The level settings are Beginner, Intermediate, and Advanced.
To customize what %product% speaks for each level, see the Verbosity Options dialog in Settings Center.
@@
@msgUO_SmartWordReadingSetHlp
This option controls how %product% reads words with punctuation in them, such as phone numbers.
When off, %product% reads the punctuation symbol under the cursor.
When on, %product% reads the entire word.
@@
@msgUO_SpellModeSetHlp
This option controls how %product% spells text when you issue one of the Spell commands, such as SpellWord, which is the SayWord command twice quickly, or SpellLine, which is the SayLine command twice quickly.
Select to have %product% spell phonetically or alphabetically.
When set to spell Alphabetically, %product% spells the letters one by one, such as "J A W S."
When set to spell Phonetically, %product% uses words to represent the letters, such as: "Juliet Alpha Whiskey Sierra."
@@
@msgUO_AlphaNumCombinationsHlp
This option controls how %product% speaks letter and number combinations, such as license plate numbers.
Available settings are Off (read as word), Spell, and Spell Phonetically.
@@
@msgUO_ProgressBarSetAnnouncementhlp
This option controls whether or not %product% announces progress bar updates.
When set to Spoken, %product% will periodically read the percentages in installations, or when performing other tasks like copying large files or burning CDs.
To control how often %product% announces progress bar changes, see Progress Bar Updates Announcement in Settings Center.
@@
@msgUO_TypingEchoSetHlp
This option controls how %product% speaks as you type.
The available settings are Characters, Words, Both Characters and Words, and Off.
@@
@msgUO_ScreenEchoSetHlp
This option controls how %product% responds to text as it is written to the screen.
Set to Off in a window where %product% is reading over and over.
Set to Highlighted to read list items or other highlights as they change.
Set to All when in a terminal, telnet or command window, or other location where you want to hear any and all text written to the screen.
@@
@msgUO_GraphicsShowHlp
This option controls which graphics %product% shows when reading with arrow keys or when viewing the braille display.
All shows all graphics with or without labels. Those without labels are shown as Graphic followed by the number.
Labeled only shows those graphics with labels, such as the attachment paperclip in Microsoft Outlook.
None shows no graphics at all.
Note: This setting does not apply to images or graphics on Web pages.  These are graphic icon and symbols in Windows.
@@
@msgUO_CustomLabelsSetHlp
This option controls whether or not %product% uses custom labels that you previously defined on Web pages or in Microsoft Word.
@@
@msgUO_StopWordsExceptionDictionaryToggleHlp
This option controls whether or not a stopwords exception dictionary is used by the Word List feature. A stopwords exception dictionary contains the list of words to be ignored.
@@
@msgUO_TopAndBottomEdgeIndicateHlp
This option controls whether or not %product% beeps when it encounters a top or bottom boundary while you navigate.
@@
@msgUO_LanguageDetectChangeHlp
This option controls whether or not %product% detects changes in language within documents which support language tags.
For example, if %product% finds Spanish text on a Web page, that text is spoken in Spanish. This detection only affects those synthesizers,
such as Eloquence, that support multiple languages.

This option, and many others, can be set using Personalized Settings (%product% KEY+SHIFT+ V).
The advantage to setting it with INSERT SHIFT V instead of INSERT V is that you will have the setting apply on that particular URL/Domain
only without impacting all web sites.
@@
@msgCustomUO_LanguageDetectChangeHlp
This option controls whether or not %product% detects changes in language within documents which support language tags.
For example, if %product% finds Spanish text on a Web page, that text is spoken in Spanish. This detection only affects those synthesizers,
such as Eloquence, that support multiple languages.
@@
@msgUOSayAllSchemeHlp
This option allows you to load a different scheme to be used during SayAll. It applies only to HTML documents, or to documents with HTML elements such as some Microsoft Word documents.

If the scheme is set to No Change for the application, a different sound scheme will not be loaded during SayAll.
If set to Same As Application in Personalized Settings, it means that the SayAll scheme will be the same as used for the application.

The SayAll Text With Sounds scheme speaks the text of links and headings, but plays a subtle sound instead of announcing links and headings.

The SayAll Text Only scheme gives no indication of links and headings, it merely speaks the text of the links and headings.
@@
@msgUO_SayAllReadsByHlp
This option controls how %product% reads when you perform a SayAll.
The available settings are:  Line With Pauses, Line Without Pauses, Sentence, and Paragraph.
@@
@msgUO_CapsIndicateDuringSayAllHlp
This option controls whether or not capitalization is indicated while reading with SayAll.
By default, %product% indicates capitalization by raising the pitch of the active voice.
Use Indicate Caps During Say All in Settings Center to turn this option on or off.
@@
@msgUO_CapsIndicateHlp
This option controls when %product% indicates capitalization while reading with reading keys or typing text.
Available settings are On Character; On Character and Word; On Character, Word, and Line; and Never.
By default, %product% indicates capitalization by raising the pitch of the active voice.
To change how %product% indicates capitalization, see Indicate Capitalization in Settings Center.
@@
@msgUO_PunctuationSetLevelHlp
This option controls the amount of punctuation %product% will speak.
Available settings are None, Some, Most, and All.
To control which punctuation is spoken at a given level, see Customize Punctuation in Settings Center.
@@
@msgUO_IndentationIndicateHlp
This option controls whether or not %product% will indicate indentation as you navigate using reading commands.
By default, when using the Classic scheme, %product% indicates indentation by announcing the number of spaces.
To control what indentation to indicate, and how it should be indicated, See the Speech and Sounds Manager Indentation page.
@@
@msgUO_SynthesizerMuteHlp
This option controls whether or not the synthesizer is temporarily muted. The
available settings are Speech On, which is the default, and Speech Off. When
you turn speech off, it applies to the active application. If you exit the
application or switch to another application, speech is automatically turned on
again.

To permanently turn off speech, do the following: Press INSERT+J to open
the %product% application window. Next, press ALT+L to choose the Language menu.
Finally, press V to choose Voice Profiles, select either Default or your application, and then N to choose No Speech.

Note: Do not do this unless you have a braille display, magnification software,
or other means to use the computer. Turning speech off is temporary, whereas
changing the voice profile to No Speech, especially in default, is permanent until you either change it
or restart %product%.
@@
@msgUO_SayAllOnDocumentLoadHlp
When this option is turned on, %product% performs a Say All and automatically begins reading the Web page that is open in your browser as usual.
This mode is convenient when surfing the Web with Internet Explorer or Firefox; however, there are many times when a user would prefer that %product%
just loads the page and reports the number of links and headings, but avoids starting a say all. This could be very useful to disable if
you are working on pages with forms or using JAWS in conjunction with MAGic.

The default setting for this option is on.

Note: If you would like to customize %product% so that continuous reading is disabled for specific Web pages, you can use Personalized Web Settings
to turn off this option.  To do this, press SHIFT+INSERT+V, navigate to the Document Reads Automatically option, and turn it off.
@@
@msgCustomUO_SayAllOnDocumentLoadHlp
When this option is turned on, %product% performs a Say All and automatically begins reading the Web page that is open in your browser as usual.
This mode is convenient when surfing the Web with Internet Explorer or Firefox; however, there are many times when a user would prefer that %product%
just loads the page and reports the number of links and headings, but avoids starting a say all. This could be very useful to disable
if you are working on pages with forms or using JAWS in conjunction with MAGic.

The default setting for this option is on.
@@
@msgUO_NavigationQuickKeysSetHlp
This option controls whether or not %product% uses Navigation Quick Keys in the virtual cursor.
Navigation Quick Keys are simple keys for quickly moving through documents and web pages using the virtual cursor. These keys do not interfere with typing in Forms mode.
@@
@msgUO_DocumentPresentationSetHlp
This option controls how %product% formats virtual documents.
The simple layout is line-by-line format, much as you might see in a braille book.
Columns in a table follow each other in linear format, with special representation removed.
The On Screen layout formats text and tables as they appear on screen.
A line contains an entire row, rather than a single cell.  Cell padding, or borders, are indicated with a | (vertical bar or pipe) symbol.
@@
@msgUO_vCursorGraphicsShowHlp
This option controls which graphics are shown in the virtual cursor.
Available settings are None, Tagged, and All.
Tagged means that there are tags associated in the page which %product% can use to describe the graphic.
@@
@msgUO_vCursorGraphicsSetRecognitionHlp
This option controls which attribute of the graphic is used by %product% in showing a graphic's name.
The most common attribute used by web page developers is the Alt attribute.
The available settings for this option are: Title, Alt Attribute, On Mouse Over, Longest and Custom Search.
For more information on the Custom Search option, see the Graphics page of the HTML Options dialog box in Settings Center.
@@
@msgUO_VCursorFilterConsecutiveDuplicateLinksHlp
This option controls whether consecutive links pointing to the same location, one graphical and one text, are filtered.
The available settings are On and Off. When on, only the text link will be shown.
@@
@msgUO_vCursorGraphicalLinksSetHlp
This option controls which graphical links are shown in the virtual cursor.
Available settings are None, Tagged and All.
Tagged means that there are tags associated in the page which %product% can use to describe the graphical link.
@@
@msgUO_vCursorUntaggedGraphicalLinkShowHlp
This option controls how %product% shows graphical links without tags.
Available settings are URL and Image Source.
The URL points to the page you will be on if you click the link.
The image source points to the name of the file used as the graphic or image.
@@
@msgUO_vCursorImageMapLinksShowHlp
This option controls which links in image maps %product% shows.
Available settings are none, tagged, and all.
@@
@msgUO_vCursorTextLinksShowHlp
This option controls what information %product% uses to show text links in the virtual cursor.
These links do not have graphical content, but are embedded in the text of the content of the web page or document.
Available settings are Screen Text, On Mouse Over, Title, Longest, and Custom Search.
@@
@msgUO_vCursorLinksIdentifyTypeHlp
This option controls whether or not %product% identifies the link type as it reads and displays the Web page on the braille display.
When this option is off, %product% still identifies links, it just does not identify links as mail, ftp, or other link types.
It still identifies links as image map, graphic or graphic link.
@@
@msgUO_vCursorLinksIdentifySamePageHlp
This option controls whether or not %product% identifies the "same page" status of links pointing to another place on the same web page or document.
When this option is off, %product% still identifies links in speech and braille, but does not announce "same page" as part of the link identification.
@@
@msgUO_vCursorButtonsShowUsingHlp
This option controls which attribute %product% uses to show buttons in the virtual cursor.
The available settings are Title, Screen Text, Alt Attribute, Value, Longest, or Custom Search.
The default setting is Screen Text.  You may want to experiment with other settings on pages where the buttons have images instead of text.
You know this when buttons are identified with words like "images/," "gif," or "jpg."
@@
@msgUO_vCursorAbbreviationsExpandHlp
This option controls how %product% shows abbreviations in the virtual cursor.
If on, %product% will use the title attribute, if provided by the web page author, for the given abbreviation.
If off, %product% will display the abbreviation as it is on screen.
@@
@msgUO_vCursorAcronymsExpandHlp
This option controls how %product% shows acronyms in the virtual cursor.
If on, %product% uses the title attribute, if provided by the Web page author, for the given acronym.
If off, %product% displays the acronym as it is on screen.
@@
@msgUO_vCursorFormFieldsIdentifyPromptUsingHlp
This option controls which method %product% uses to identify prompts or labels for form fields.
Available settings are Label Tag, Title Attribute, Alt Attribute, Longest, and Both Label and Title.
For Both Label and Title, %product% only uses both if they are different.
@@
@msgUO_vCursorFramesShowStartAndEndHlp
This option controls whether or not %product% shows start and end markings for frames in the virtual cursor.
%product% shows these markings by displaying the name of the frame, followed by "frame," at the start of the frame.
At the end, %product% displays the name of the frame followed by "frame end."
These markings in the virtual cursor appear on their own lines.
@@
@msgUO_vCursorInlineFramesShowHlp
This option controls whether or not the contents of inline frames are shown in the virtual cursor.
Inline frames are often those which contain banner ads, but can be used by Web page authors to present information.
You may want to turn this off if a particular Web page has a lot of frame start and end markings with useless or no content in between.
Settings for this option determine whether the whole content, including start and end marks if appropriate, is shown or not.
@@
@msgUO_vCursorScreenTrackHlp
This option controls whether or not %product% causes the screen to track the virtual cursor.
When %product% does this, sighted users can more easily tell where you are on the Web page.  Since Web pages do not have a cursor, like Microsoft Word does, this tracking feature works to keep the content you are viewing on screen.
@@
@msgUO_vCursorRepeatedTextSkipHlp
This option controls whether or not %product% skips repeated (or common) text at the top of new links when you click them on Web pages.
This text is usually the same for a given Web site, such as navigation information found at the top of the page.
When this option is on, %product% places the virtual cursor below the "repeated" or common text.
@@
@msgUO_vCursorBlockQuotesIdentifyStartAndEndHlp
This option controls whether or not %product% identifies block quotations with start and end markings.
At the beginning of a block quotation you will see:
block quote
And at the end of the quotation you will find
block quote end.
Like all markings of this type shown in the virtual cursor, they are shown on their own lines.
@@
@msgUO_vCursorListsIdentifyStartAndEndHlp
This option controls whether or not %product% identifies lists using start and end markings in the virtual cursor.
When a list is identified this way, you see the following at its beginning:
list of x items (nesting level y)
where x is the number of items in the list and y is the level deep.
There is not always a nesting level, but only when there is a list within a list.
The end marking is List end, or List End nesting level y.
Besides simply list, you may see definition list, in which each item is an item and its definition.
@@
@msgUO_vCursorAccessKeysShowHlp
This option controls whether or not %product% shows access keys coded into web pages in the virtual cursor.
These keys are designed by web page authors so you can quickly move to certain sections or activate certain controls on web pages.
@@
@msgUO_vCursorAttributesIndicateHlp
This option controls whether or not %product% indicates attributes, such as clickable and onMouseover.
With speech, %product% indicates these by saying "Clickable" or "onMouseover" respectively.
You can change what is said, or what sound to use in the Speech and Sounds Manager.
In braille, you see clk and omo respectively, after the text of the element or item.
To activate the onMouseOver attribute, press control insert enter.
To activate Clickable, tap with a cursor routing button or press enter or the left mouse button on the item.
@@
@msgUO_vCursorTablesShowStartAndEndHlp
This option controls whether or not %product% shows start and end markings for tables in the virtual cursor.
The start marking shows as follows:
table with x columns and y rows
where x is the number of columns and y is the number of rows.
The end marking is shown as follows:
table end
If this option is off, you can still use Table navigation commands within tables, or quick navigation table commands to find tables.
@@
@msgvCursorLayoutTablesHlp
This option controls whether or not %product% recognizes tables used exclusively for formatting purposes.
Such tables are often used as navigation bars at the top, bottom, or side of the Web page.
You will still see the buttons within the navigation bar and they will still be shown one after the other in the virtual cursor, but you will not see the table start and end marks.
@@
@msgvCursorTablesUnavailableHlp
This option is unavailable because Table Show Start and End is turned off.
@@
@msgUO_vCursorTableTitlesAnnounceHlp
This option controls which table header titles are to be announced when a table cell is spoken.

Select 'Off' to have no titles announced.

You can select row, column, both row and column, or only marked headers. If you choose only marked headers, only the explicitly marked headers will be spoken for the row or column title.

If you choose row, column or both headers, %product% will first look for the explicitly marked headers for the row or column title. If marked headers are not found, %product% will guess which row or column to use for the title.

As you navigate, only the changed title matching your title announcement choice is spoken.
If you use the SayCell script, all titles matching your announcement choice are spoken.
@@
@msgUO_VCursorCellCoordinatesAnnouncementHlp
This options controls whether or not cell coordinates are announced when table navigation is used.
When on, table cell coordinates are announced after the cell content.
@@
@msgUO_vCursorHeadingsAnnounceHlp
This option controls how %product% announces headings in virtual documents.
Select between Off, On, and Heading and Level.
@@
@msgUO_FlashMoviesRecognizeHlp
This option controls whether or not %product% recognizes flash content on Web pages.
If on, %product% marks the flash content with flash movie start and flash movie end markings surrounding the content.  This content may update frequently, and for that reason, you may opt to turn this option off to more easily navigate the page.
If you turn this option off, the Quick Navigation Keys O and SHIFT+O will not take you to the flash content.  This is different from tables or frames, because the content in this case is not shown at all in the virtual cursor.
@@
@msgUO_PageRefreshHlp
This option controls whether %product% refreshes content on Web pages.
The settings for this option are Off, or the setting you selected in Settings Center.  The default is Automatically, but this Settings Center setting can be set to a number of milliseconds where %product% checks to see if dynamic content has been updated.
@@
@msgUO_AnnounceLiveRegionUpdatesHlp
This option controls the announcement of live region updates on web pages that support them.
When set to off, no live region updates will be spoken.
@@
@msgUO_vCursorFormsModeAutoOffHlp
This option controls whether or not %product% automatically turns off Forms mode when a new page loads, or you switch to a new tab or window.
With this feature enabled, you can have Forms mode on in a search window, while viewing results in another window or tab freely with the virtual cursor.
@@
@msgUO_vCursorFormsModeAutoOffUnavailableHlp
This feature is unavailable if Auto Forms Mode is on.
@@
@msgUO_vCursorCustomPageSummaryHlp
This option controls what %product% does with the Custom Page Summary.
This summary is the PlaceMarkers which you have defined for the given page.
Select to Speak PlaceMarkers if you want them spoken when the page loads.
Select Virtualize PlaceMarkers to show only the PlaceMarkers in the virtual viewer.
This option adds power to your use of PlaceMarkers within %product%.
@@
@msgUO_CustomVirtualCursorSetHlp
This Personalized Settings Option controls whether or not %product% uses the virtual cursor on the current web page.
@@
@msgUO_vCursorEnhancedClipboardHlp
This option controls whether or not %product% will use the Text Selection and Copy Commands from the Web browser, e-mail software, or other owner of a virtual document.
With the "From Virtual Cursor" setting, text is copied as plain text without formatting, pictures, and HTML attributes.
With the "Full Content Using Onscreen Highlight" setting, the text and elements you select are highlighted onscreen as you press selection keys from the keyboard just as it would be in programs like Word Processors. The content is then copied with all formatting.
@@
@msgUO_vCursorAutoFormsModeHlp
This feature determines if %product% will automatically switch between Forms Mode and Virtual mode when working in Applications such as IE, Firefox, Help,
Acrobat, etc. When on, you will be able to navigate to controls with the arrow keys where input is needed and %product% will automatically switch to Forms Mode.
If you continue to arrow past the control, Forms mode will be disabled again automatically. It will make interacting with Forms much more transparent. If
you disable AutoForms mode here, it will remain off and you will be forced to manually go in and out of Forms Mode with the Enter Key and PC Cursor Key.
@@
@msgUO_vCursorNavQuickKeyDelayHlp
When using Navigation Quick Keys to move through forms, this option determines how long it takes before the Auto Forms Mode feature causes forms mode to turn on in controls such as Edits, where Auto Forms Mode would normally turn Forms Mode on.

Settings for this option range from 0.5 seconds to 5 seconds. There is also an option of Never, which is the default setting. This means that when using Navigation Quick Keys, %product% will not automatically enter Forms Mode. If users wish to go into Forms Mode in this case, they will need to turn it on manually with the Enter Key.

Setting another choice, such as 3 seconds, will allow Forms Mode to be activated following a
3-second delay when landing on a control.

Note: This option is unavailable if Auto Forms Mode is off.
Note: %product% can be configured to emit a sound when you enter or exit a form
field. The sound is heard when Forms Mode becomes active.
@@
@msgUO_vCursorNavQuickKeyDelayUnavailableHlp
This feature is unavailable if Auto Forms Mode is off.
@@
@msgUO_vCursorIndicateFormsModeWithSoundsHlp
As you move into and out of a form field, %product% can use sounds to indicate when it switches between Virtual Mode and Forms Mode instead of speaking the
traditional messages, Forms Mode On and Forms Mode Off. Clear this option box if you do not want to hear
sounds and would prefer to hear the traditional spoken messages.
@@
@msgUO_vCursorReadOnlyStateHlp
This option controls whether to announce or ignore read-only state information in form fields.
It applies to Adobe Acrobat documents.
@@
@msgUO_CustomClearAllSettingsHlp
This option clears all Personalized Settings you have defined for this Web page or document.
Press the space bar on this option to have all settings cleared.
@@
@msgUO_BrlActiveModeOption
This option controls which mode, or method, %product% uses to display text and contextual information.
Select Structured to have %product% intelligently display text and contextual information. Symbols are used to represent the type and state of the control.
Line mode displays text "as is" on your display.  This is not the way sighted users experience Windows, as it is without symbols and you have no context into which you can view relevant text.
So if you see the word OK on your display, it could be an OK button, or it could be the text of the word OK written in a document.
Select Speech Output to display all spoken text
Select Attributes to show only the attributes of the text.  When multiple attributes are present, %product% displays each attribute for a short time, then rotates to the next one.
You will not see text with this setting, only attribute symbols.
@@
@msgUO_BrlGradeTwoModeOptionHlp
This option controls whether translated braille is available on the braille display.

Available settings are off, output only, as well as input and output.

If off, the braille is shown untranslated on the display and braille input is also untranslated.

If output only, the braille is shown on the display as translated but braille input is not translated.

If input and output, the braille shown on the display is translated and the braille input is also translated where possible.
Note that even with input and output both on, braille input is not always allowable depending on the currently focused window.
@@
@msgUO_Grade2RulesHlp
This option controls which translation rules are used when the braille translator is turned on.
The choices are Contracted English Braille or Unified English Braille.
@@
;The next message is "For all options which require Grade 2" to be enabled first.
@msgUO_brlG2UnavailableHlp
This option is unavailable because braille Translation is turned off.
@@
@msgUO_BrlCurrentWordExpandHlp
This option controls how the word under the Active Cursor is displayed.
Turn this option on to have the word expanded, or shown in computer braille.
To display all text including the current word in translated braille, turn this option off.
@@
@msgUO_BrlCurrentWordExpandUnavailableHlp
This option is only available when the translator option is set to output only.
@@
@msgUO_BrlG2CapsSuppressHlp
This option controls whether or not %product% will suppress capital sign indicators.
This is dot 6 before each single instance of a capital letter, or two dot-6 characters before a group of contiguous capital letters, such as in the word %product%. If the capitalization stops in the middle of a word, such as the word MAGic, the first lowercase letter is preceded by a dot 6 followed by dot 3 followed by the letter.
Turn this option off to suppress all indication of capitalization.
@@
@msgUO_BrlActiveFollowsBrailleHlp
This option controls whether or not the active cursor automatically follows the braille display as it moves.
With this option off, you can move the braille display to a different place in the window, away from the active cursor.
You can look at a status bar, toolbar or other information outside a document area.
@@
@msgUO_BrlBrailleFollowsActiveHlp
This option controls whether or not the braille display automatically follows the active cursor.
When this option is on, the braille display automatically follows the cursor as you use navigation keys on the keyboard.
@@
@msgUO_BrlFlashMessagesHlp
This option controls whether or not %product% flashes messages to the braille display.
Flash messages are generally announcements not otherwise contextual to the display.  For example, if a link in Internet Explorer opens a new window, the braille display flashes "New Browser Window."
@@
@msgUO_BrlBrailleKeysInterruptSpechHlp
This option controls whether or not braille keys interrupt speech.
If this option is on, speech is interrupted any time you press a braille key.
If off, you can pan or otherwise interact with the braille display and speech is not interrupted.
%product% could be announcing or reading one thing, while you quickly look at or adjust something else from your braille display.
@@
@msgUO_BrlBrailleMarkingHlp
This option controls whether or not %product% marks text containing attributes.
Marking is done with dots 7 and 8.
Select either on or off.
When this option is on, you can turn various attributes on or off for marking.
@@
@msgUO_BrlUOEightDotBrailleHlp
This option controls whether or not %product% display is eight-dot braille.
In eight dot braille, dot 7 is used for capital letters in computer braille, and both dots 7 and 8 are used to represent non-alphanumeric characters.
Even if eight-dot braille is turned off, braille marking is still shown if you have it turned on.
@@
@msgUO_BrlPanByHlp
This option controls how text displays as you pan with the braille display.
Available settings are, Best Fit, Fixed Increment, Maximize Text, and Automatic.
The Automatic setting allows %product% to figure out the best way to display text while you pan.
Maximize Text presents as much text as possible on the display, regardless of display length.
Best Fit checks available space on your display and only displays what will fit logically.
Fixed Increment is based on the length of your display.
@@
@msgUO_BrlWordWrapHlp
This option controls whether or not %product% displays part of a word, even if it cuts off at the end of the braille display.
If this option is on, only the text that can fit as words on the braille display as shown.
If this option is off, you may see part of a word at the end of the display, and when you pan, you will see the remainder of it on the left edge of the display.
@@
@msgUO_BrlAutoPanHlp
This option controls how the content of the braille display is updated when the active cursor moves outside the area currently displayed.
Select Off to turn off automatic panning. If you select Minimal, %product% pans the braille display just enough to show the next word at the location of the
active cursor.
If you select Match User Panning, %product% pans the braille display using the same method specified in the User Pan list.
If you select To Middle, %product% keeps the word at the location of the active cursor in the center of the braille display.
If you select Maximize Text after Cursor, %product% pans the display so that text that appears after the location of the active cursor is shown on the braille
display.
If you select Maximize Text before Cursor, %product% pans the display so that text that appears before the location of the active cursor is shown on the Braille
display.
Select Automatic to allow %product% to choose the best method for showing text on your braille display.
@@
@msgUO_MarkingHlp
Select to mark one or more of the items in this group.
All items are marked with dots 7 and 8.
@@
@msgUO_BrailleZoomHlp
This option controls how %product% displays table text.  You can display current cell, current row, or current column.
If you have a multiline display, you can also show column titles plus current row, or the prior and current row.
@@
@msgUO_BrailleShowHeadersHlp
This option controls which headers, if any, are displayed for the active table cell.
@@
@msgUO_BrailleShowCoordsHlp
This option controls whether coordinates for the active cell are on or off.
@@
@msgUOToggleTypeKeysModeHlp
When TypeKeys mode is enabled, characters typed using the display are inserted into the foreground application.
@@
@msgUO_BrailleStudyModeOptionHlp
The Braille Study Mode announces the Braille character at the cursor position, or speaks and spells the word.
If on, %product% speaks the current braille character or symbol when a front row routing button is pressed; %product% speaks and spells the current braille word if a back row hot button is pressed.
Braille Study Mode will remain toggled on until toggled off again or until %product% is restarted.
@@
@msgUO_BrailleStudyModeOptionUnavailableHlp
The Braille Study Mode is unavailable because the braille display you are using does not support this feature.

The Braille Study Mode announces the Braille character at the cursor position, or speaks and spells the word.
If on, %product% speaks the current braille character or symbol when a front row routing button is pressed; %product% speaks and spells the current braille word if a back row hot button is pressed.
Braille Study Mode will remain toggled on until toggled off again or until %product% is restarted.
@@
;Node callback help strings:
@msgUO_GeneralOptionsHlp
This group contains options that control overall %product% behavior.
@@
@msgUO_ReadingOptionsHlp
This group contains options that control how %product% behaves when reading and navigating text.
@@
@msgUO_SayAllOptionsHlp
This group contains options that control how %product% behaves during SayAll.
@@
@msgUO_EditingOptionsHlp
This group contains options  that control how %product% behaves when you are editing text.
@@
@msgUO_SpellingOptionsHlp
This group contains options that control how %product% behaves when spelling text.
@@
@msgUO_VirtualCursorOptionsHlp
This group contains options and groups of options that control how %product% behaves when the virtual cursor is active.
@@
@msgUO_TextOptionsHlp
This group contains options that control how text is formatted in the virtual cursor.
@@
@msgUO_GraphicsOptionsHlp
This group contains options that control graphics recognition and reading in the virtual cursor.
@@
@msgUO_LinksOptionsHlp
This group contains options that control link recognition and reading in the virtual cursor.
@@
@msgUO_FormsOptionsHlp
This group contains options for reading and interacting with form controls in the virtual cursor.
@@
@msgUO_HeadingAndFrameOptionsHlp
This group contains options that determines how frames and headings are shown in the virtual cursor.
@@
@msgUO_ListAndTableOptionsHlp
This group contains options that control how lists and tables are shown in the virtual cursor.
@@
@msgUO_BrailleOptionsHlp
This group contains options and groups of options that control your braille display. These include options for panning, translated braille output, braille marking, 8-dot braille, and more.
@@
@msgUO_Grade2OptionsHlp
This group contains options for translated braille output.
@@
@msgUO_CursorOptionsHlp
This group contains options that control the relationship between the active cursor and your braille display.
@@
@msgUO_PanningOptionsHlp
This group contains options that control panning of your braille display and presentation of text. These options work with the relationship between the display and line length.
@@
@msgUO_TableOptionsHlp
This group contains options that control table presentation on your braille display.
@@
@msgUO_MarkingOptionsHlp
This group contains the options that control which attributes are marked with dots 7 and 8 on your braille display. Attributes are modifications to text such as bold, italic, highlight, and so on.  This group also contains options for script defined marking and color marking.
@@
@msgUO_UnknownHlp
This group contains custom settings for the active application.
There is no category-specific help for this group.  There may be help for each item in the group.
@@
@msgUO_Virtual_Cursor
From Virtual Cursor
@@
@msgUO_FullContent
Full content
@@
@msgUO_FullContent_Visual
Full content using onscreen highlight
@@
;for msgNavQuickKeyThreshold messages
;%1 is the number of seconds
;%2 is the half second fraction
@msgNavQuickKeyThresholdWithFraction
%1.%2 seconds
@@
@msgNavQuickKeyThresholdSingle
%1 second
@@
@msgNavQuickKeyThresholdWhole
%1 seconds
@@
@msgNavQuickKeyThresholdNever
Never
@@
@msgUO_NotAvailableWhenMAGicIsRunningHlp
This option is not available when both MAGic and JAWS are running.
@@
;for msgShowOptionDefaultSetting
;%1 is the text as it appears in the Options tree of the default setting.
@msgShowOptionDefaultSetting
The default setting is %1.
@@
;for msgShowOptionAppAndPersonalizedDefaultSetting
;%1 is the text as it appears in the application Options tree of the default setting.
;%2 is the text as it appears in the personalized settings list for the default setting.
@msgShowOptionAppAndPersonalizedDefaultSetting
The default application setting is %1.
The default personalized setting is %2.
@@
@msgUseTandemConnectSounds
You can choose whether or not to hear a wave sound played in addition to the speech notifying you when tandem connects or disconnects. If enabled, you will hear wave files played both when connecting and disconnecting. If you are operating the controlling computer, you will also hear the wave files played when suspending or resuming a tandem session.
Clear this option if you do not want to hear wave sounds in addition to speech when tandem connects or disconnects.
@@
@msgUO_TandemUnavailableHlp
This option is unavailable while a tandem session is active and not in suspended mode.
@@
@msgUO_VirtualRibbonsHlp
This setting applies to applications where ribbons are present instead of the classic menu bar and menus.

When on, the virtual ribbon menu provides an alternative  representation of the Microsoft Ribbon to present a predictable navigation experience.

The upper ribbon contains ribbon tabs, similar to a classic menu bar containing menus.
Left and right arrows move through the tabs on the upper ribbon.
Arrowing down from an Upper Ribbon tab moves to a lower ribbon, similar to navigating to a classic menu.
Arrowing up and down on a lower ribbon moves between each group, and each group is similar to a classic submenu.
Space, Enter or Right Arrow will move focus into the items within the group.
Once in a group, Up and Down Arrow moves between all items in the group.
First letter navigation is available and moves to any group on the lower ribbon or to any item in the opened group.
Escape or left arrow moves up the Menu Hierarchy, eventually to the upper ribbon and then finally back to the document.
@@
@msg_ControlledBySynthesizer
Controlled By Synthesizer
@@
;for msg_NOrMoreDigits
;%1 is a number for the number of digits threshold
@msg_NOrMoreDigits
%1 or more digits
@@
@msgUO_SpeakSingleDigitsThresholdHlp
Use this option to set a threshold value for %product% so that a number string is read as individual digits. For example, if a string contains five or more digits, %product% will announce each digit as a standalone number. The string 54321 is read as 5 4 3 2 1.

This is useful when reading long number strings such as telephone numbers, serial numbers, and part numbers. Note that this rule will apply under the following conditions: the number string is not preceded by or followed by an alpha character, and it does not contain a dash, colon, decimal, or slash to separate the digits similar to what is used for telephone, time, or date formatting. If you want to override the dash exception of this rule, select the Dashes option located next in the Numbers Options.

Other values for this option are Six or More Digits, Seven or More Digits, Eight or More Digits, and Controlled by Synthesizer. When the latter is selected, the current synthesizer determines how numbers are read.
@@
@msgUO_SpeakSingleDigitsDashesHlp
Select this option so that number strings containing dashes are read by %product% as individual digits. This will apply when the dash is preceded by and followed by a digit similar to telephone number formatting.
@@
@msgUO_ToggleFocusLossAnnounceTextOutputHlp
Use this option to decide whether or not %product% will announce loss of focus.
This can happen frequently in some versions of Windows, and thus may become too verbose.
When you change this setting, it is stored between %product% sessions.
@@
@msgUO_TextAnalyserOff
Off
@@
@msgUO_TextAnalyserIndicateWithSound
Indicate With Sound
@@
@msgUO_TextAnalyserSpeakCount
Speak Count
@@
@msgUO_TextAnalyserDescribeAllInconsistencies
Describe Inconsistencies
@@
@msgUO_TextAnalyzerToggleHlp
Use this option to identify inconsistencies such as unmatched parentheses, unintentional format changes, extra whitespace, and stray or unspaced punctuation when editing or proofreading a document by line, sentence, paragraph, or Say All command.
Select Indicate with Sound to use a WAV file to identify inconsistencies. Select Speak Count to announce the number of inconsistencies in the current text. Select Describe Inconsistencies for a description of the error.
@@
;uoSayAllSchemeNoChange is the option that specifies no change for SayAll scheme
@uoSayAllSchemeNoChange
No Change
@@
;uoSayAllSchemeSameAsApp is the option that specifies the personalized setting for the scheme is the same as the application
@uoSayAllSchemeSameAsApp
Same As Application
@@
@msgUO_VirtualDocumentLinkActivationMethodEnterSendsEnterKey
Enter sends Enter key
@@
@msgUO_VirtualDocumentLinkActivationMethodEnterSimulatesMouseClick
Enter simulates mouse click
@@
@msgUO_VirtualDocumentLinkActivationMethodHlp
This option affects how links are activated when the user presses the ENTER key in a virtual document.
When this option is set to "Enter simulates mouse click," pressing the ENTER key on a link actually simulates a left mouse click on the link. This is how JAWS behaved prior to JAWS 15.
When this option is set to "Enter sends Enter key," pressing the ENTER key on a link instead causes the ENTER key to be passed on to the system.
You may want to consider setting this option to "Enter sends Enter key" if pressing ENTER does not activate a Web element unless you first press JAWSKey+3 to enable the Pass Key Through feature.
The default setting is "Enter simulates mouse click."
@@


;UNUSED_VARIABLES

@msgMarkingNotAvailableHlp
This group of items is not available because the "Marking uses dots 7 and 8" option is turned off.
@@
@msgUOContractedBrailleInputUnavailableHlp
Contracted braille input is available only in supported applications.
Supported applications includes any application whose text editing capability may be programmatically controlled.
Applications using standard edit, richedit or HTML controls such as notepad, wordpad, Internet Explorer, Outlook, Microsoft Word are some examples.
@@

;END_OF_UNUSED_VARIABLES

EndMessages

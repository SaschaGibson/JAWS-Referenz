;Legacy support:
;Support for AdjustJAWSVerbosity dialog options strings and callbacks.

CONST

	AdjustJAWSVerbosityDialogName = "Adjust JAWS Verbosity",
;for cStrDefaultList:
	jvVerbosityLevelToggle="|VerbosityLevelToggle:User Verbosity",
	jvSmartWordReadingToggle="|SmartWordReadingToggle:Smart Word Reading",
	jvSpellModeToggle="|SpellModeToggle:Spell Text",
	jvSpellAlphaNumericDataToggle = "|SpellAlphaNumericDataToggle:Spell Alphanumeric Data",
	jvProgressBarAnnouncementToggle="|ProgressBarAnnouncementToggle:Progress Bar Announcement",
	jvTypingEcho="|TypingEcho:Typing Echo",
	jvScreenEchoToggle="|ScreenEchoToggle:Screen Echo",
	jvGraphicsVerbosity="|GraphicsVerbosity:Graphics Verbosity",
	jvCustomLabelsToggle = "|CustomLabelsToggle:Custom Labels",
	jvToggleTopAndBottomEdgeAlert = "|ToggleTopAndBottomEdgeAlert:Top And Bottom Edge Alert",
	jvToggleLanguageDetection="|ToggleLanguageDetection:Language Detection",
	jvSayAllBy="|SayAllBy:Say All By",
	jvSayAllIndicateCaps="|SayAllIndicateCaps:Announce Caps During Say All",
	jvToggleIndicateCaps="|ToggleIndicateCaps:Caps Indicated",
	jvPunctuationToggle="|PunctuationToggle:Punctuation",
	jvToggleIndicateIndentation="|ToggleIndicateIndentation:Indentation Indication",
	jvMuteSynthesizerToggle="|MuteSynthesizerToggle:Synthesizer",

;	for cStrDefaultHTMLList :
 	jvNavigationQuickKeysMode="|NavigationQuickKeysMode:Navigation Quick Keys",
	jvDocumentPresentationModeToggle = "|DocumentPresentationModeToggle:Document Presentation",
	jvHTMLIncludeGraphicsToggle="|HTMLIncludeGraphicsToggle:Graphics In HTML",
	jvHTMLGraphicReadingVerbosityToggle="|HTMLGraphicReadingVerbosityToggle:Graphics Recognized by",
	jvHTMLIncludeLinksToggle="|HTMLIncludeLinksToggle:Links with Graphics",
	jvHtmlGraphicsLinkLastResortToggle="|HtmlGraphicsLinkLastResortToggle:As a last resort",
	jvHTMLIncludeImageMapLinksToggle="|HTMLIncludeImageMapLinksToggle:Links In Image Maps",
	jvHTMLTextLinkVerbosityToggle="|HTMLTextLinkVerbosityToggle:Links With Text Only",
	jvHTMLIdentifyLinkTypeToggle="|HTMLIdentifyLinkTypeToggle:Link Type Announcement",
	jvHTMLIdentifySamePageLinksToggle="|HTMLIdentifySamePageLinksToggle:Link, Same Page Announcement",
	jvHTMLButtonTextVerbosityToggle="|HTMLButtonTextVerbosityToggle:Buttons Recognized by",
	jvHTMLExpandAbbreviationsToggle = "|ToggleExpandAbbreviations:Expand Abbreviations",
	jvHTMLExpandAcronymsToggle = "|ToggleExpandAcronyms:Expand Acronyms",
	jvHTMLFormFieldPromptsRenderingToggle="|HTMLFormFieldPromptsRenderingToggle:Form Field Prompts Use",
	jvHTMLFrameIndicationToggle="|HTMLFrameIndicationToggle:Frame Announcement",
	jvHTMLToggleIgnoreInlineFrames="|HTMLToggleIgnoreInlineFrames:Inline Frames",
	jvHTMLScreenFollowsVCursorToggle="|HTMLScreenFollowsVCursorToggle:Screen Follow Virtual Cursor",
	jvHTMLSkipPastRepeatedTextToggle="|HTMLSkipPastRepeatedTextToggle:Skip Past Repeated Text On New Pages",
	jvHTMLIndicateBlockQuotes="|HTMLIndicateBlockQuotes:Block Quote Announcement",
	jvHTMLIndicateLists="|HTMLIndicateLists:List Announcement",
	jvHTMLIndicateElementAccessKeys="|HTMLIndicateElementAccessKeys:Element Access Key Announcement",
	jvhtmlElementAttributeAnnounce="|htmlElementAttributeAnnounce:Element Attribute Announcement",
	jvIndicateTablesToggle="|IndicateTablesToggle:Table Announcement",
	jvDetectTables="|DetectTables:Layout Tables",
	jvSetTableTitleReading="|SetTableTitleReading:Table Titles",
	jvHTMLIndicateHeadingsToggle="|HTMLIndicateHeadingsToggle:Heading Announcement",
	jvhtmlFlashOnWebPagesToggle="|HtmlFlashOnWebPagesToggle:Flash Movies",
	jvRefreshHTML="|RefreshHTML:Refresh Page",
	jvHTMLToggleFormsModeAutoOff="|HTMLToggleFormsModeAutoOff:Forms Mode Auto Off",
	jvVirtualCustomPageSummary="|VirtualCustomPageSummary:Custom Page Summary",
	jvEnhancedClipboard = "|EnhancedClipboardToggle:Select and Copy",
	jvCustomEnhancedClipboard = "|CustomEnhancedClipboardToggle:Copy Full Web Content",
; for cStrBrailleList :
	jvActiveModeOption="|ActiveModeOption:Braille Mode",
	jvGradeTwoModeOption="|GradeTwoModeOption:Grade 2 Translation",
	jvToggleG2CapSuppression="|ToggleG2CapSuppression:Grade 2 Suppress Capital Signs",
	jvExpandCurrentWordOption="|ExpandCurrentWordOption:Grade 2 Expand Current Word",
	jvBrailleMovesActiveOption="|BrailleMovesActiveOption:Active Follows Braille",
	jvActiveMovesBrailleOption="|ActiveMovesBrailleOption:Braille Follows Active",
	jvToggleFlashMessages="|ToggleFlashMessages:Flash Messages",
	jvSpeechInterruptOption="|SpeechInterruptOption:Braille Keys Interrupt Speech",
	jvMarkingOption="|MarkingOption:Mark with dots 7 and 8",
	jvSixOrEightDotOption="|SixOrEightDotOption:Display In",
	jvPanModeOption="|PanModeOption:User Pan Mode",
	jvBrlWordWrapOption="|BrlWordWrapOption:Word Wrap",
	jvAutoPanModeOption="|AutoPanModeOption:Auto Pan Mode",
cStrBrailleListWhizOption = "|WhizWheelsOption:Whiz Wheels",
;For HTML tables verbosity options.
; for cStrTableBrailleList
	jvBrailleZoom="|BrailleZoom:Table Display",
	jvBrailleShowHeaders="|BrailleShowHeaders:Table Title Reading",
	jvBrailleShowCoords="|BrailleShowCoords:Table Show Coordinates",

;For the TypeKeys mode option
cStrBrailleTypeKeysModeOption = "|ToggleTypeKeysMode:Typing Mode",
;For attributes to be marked with Dots 7 and 8
; for cstrBrailleMarkingList:
	jvMarkHighlight="|MarkHighlight:Highlight",
	jvMarkBold="|MarkBold:Bold",
	jvMarkUnderline="|MarkUnderline:Underline",
	jvMarkItalic="|MarkItalic:Italic",
	jvMarkStrikeOut="|MarkStrikeOut:Strike Out",
	jvMarkColor="|MarkColor:Colors",
	jvMarkScript	="|MarkScript:Script Defined",




;UNUSED_VARIABLES

	jvRefreshActiveContent="|RefreshActiveContent:Refresh Flash Movies",
	jvToggleUseVirtualInfoInFormsMode="|ToggleUseVirtualInfoInFormsMode:Forms Mode Uses Virtual Labels",
	jvHTMLStyleSheetProcessing="|HTMLStyleSheetProcessing:Style Sheet Processing"

;END_OF_UNUSED_VARIABLES


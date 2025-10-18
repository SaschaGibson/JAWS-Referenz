;Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 12.0.xx

;contains support strings for 'Adjust JAWS Options' dialog for all versions of Microsoft Word.

Const
;separates item from state in AdjustJAWSOptions dialog
	sc_DashWithSpaces=" - ",
;for Indentation option in AdjustJAWSOptionsConst
	sc_indentation="Indentation", 
;Nodes:
	NODE_Formatting="Formatting",
	NODE_Tables="Tables",
	NODE_DocumentSettings="Document Settings",
;	String constants for tree child items:
	UO_ToggleAutoCorrectDetection="ToggleAutoCorrectDetection:AutoCorrect Detection",
	UO_ToggleSmartTagsIndication="ToggleSmartTagsIndication:Smart Tags Indication",
	UO_WordDocumentPresentationSet="WordDocumentPresentationSet:Document Presentation",
	UO_ToggleShowBrlProofreadingMark="ToggleShowBrlProofreadingMark:Mark Proofreading Indication in Braille",
	UO_ToggleSetDesiredUnitOfMeasure="ToggleSetDesiredUnitOfMeasure:Measurement Units",
	UO_ToggleShadingDetection="ToggleShadingDetection:Shading Detection",
	UO_ToggleSpellingErrorDetection="ToggleSpellingErrorDetection:Spelling Error Detection",
	UO_ToggleGrammaticalErrorDetection="ToggleGrammaticalErrorDetection:Grammatical Error Detection",
	UO_ToggleExtraHelpIndication="ToggleExtraHelpIndication:F1 Help Prompt",
	UO_ToggleBookmarkDetection="ToggleBookmarkDetection:Bookmark Indication",
	UO_ToggleStyleDetection="ToggleStyleDetection:Style Changes",
	UO_ToggleRevisionDetection="ToggleRevisionDetection:Track Changes",
	UO_ToggleCountBefore="ToggleCountBefore:Item Counts",
	UO_TogglePositionDetection="TogglePositionDetection:Page, Section, and Multiple Column Breaks",
	UO_ToggleAnnounceListNestingLevel="ToggleAnnounceListNestingLevel:List Nesting Level Announcement",
	UO_ToggleTableDetection="ToggleTableDetection:Table Detection",
	UO_SetColumnTitlesRow="SetColumnTitlesRow:Column Titles Row Set",
	UO_SetRowTitlesColumn="SetRowTitlesColumn:Row Titles Column Set",
	UO_ClearTitleRowAndColumnDefinition="ClearTitleRowAndColumnDefinition:Title Definitions Clear",
	UO_ToggleScheme="ToggleScheme:Speech and Sound Schemes",
	UO_ToggleOverrideDocNamedTitles="ToggleOverrideDocNamedTitles:Defined Bookmark Table Column and Row Titles Override",
	UO_ToggleIndicateBulletType="ToggleIndicateBulletType:Bullet Type Indication",
	UO_ToggleIndicateBrailleBulletType="ToggleIndicateBrailleBulletType:Braille Bullet Type Indication",
	UO_ToggleTableDescription="ToggleTableDescription:Description",
	UO_ToggleNotesDetection="ToggleNotesDetection:Comments, Footnotes & Endnotes Detection",
	UO_ToggleBorderDetection="toggleBorderDetection:Border Changes",
	UO_IndicateNonbreakingSymbolsToggle="IndicateNonbreakingSymbolsToggle:Nonbreaking Symbols Indication",
	UO_TabMeasurementIndication="TabMeasurementIndication:TAB Measurement Indication",
	UO_ToggleLineSpacingDetection="ToggleLineSpacingDetection:Line Spacing Detection",
	UO_toggleCellCoordinatesDetection="ToggleCellCoordinatesDetection:Cell Coordinates Announcement",
	UO_ToggleSelCtxWithMarkup="ToggleSelCtxWithMarkup:Express Navigation Mode",
	UO_ToggleNewLinesAndParagraphsIndication="ToggleNewLinesAndParagraphsIndication:New Lines and Paragraphs Indication",
	UO_ToggleObjectCountDetection="ToggleObjectCountDetection:Object Count Detection",
	UO_ToggleBrlTableNumberDisplay="ToggleBrlTableNumberDisplay:Table Number Display"
	
	Messages
@msgDefaultSettingIsOn
The default setting is On.
@@
@msgDefaultSettingIsOff
The default setting is Off.
@@

;Node callback help strings:
@msgUO_WordGeneralOptionsHlp
This group of options is specific to Word for how to read tables  as well as controlling overall %product% behavior.
@@
@msgUO_WordEditingOptionsHlp 
This group of options controls whether %product% detects various types of objects while you are editing text in the document. Types of objects in Word include autocorrect, spelling and grammatical errors, and revisions. The group also contains options  that control how %product% behaves when you are editing text in general.
@@
@msgUO_WordReadingOptionsHlp
This group of options controls whether %product% detects various types of objects while reading through a document. Types of objects specific to Word include bookmarks, borders, comments, footnotes, and end notes, breaks for pages, columns, and sections, pictures, and  smart tags. The group also controls how %product% behaves when reading and navigating text in general. 
@@
@msgUO_FormattingHlp
This group of options controls which formatting changes are detected while reading the document. Types of changes include: bullet types, extra help, shading changes in tables, measurement units, and style. 
@@
@msgUO_DocumentSettingsHlp
This group of options controls document-specific settings. Options include whether Speech and Sound Manager schemes are the same for all documents or document-specific.
@@
@msgUO_TablesHlp
This group of options controls how %product% behaves when reading and navigating tables.
@@
@msgUO_WordVCursorTableTitlesAnnounceHlp
This option controls whether %product% detects row and column title while reading tables cells in the document.  If the option for overriding defined bookmark table titles is turned off, the default setting is to Announce Only Marked Headers. This means that %product% detects only the defined bookmarked headers in each table. You cannot manually change the setting.

In order to change table titles announcement manually, you first need to turn on Defined Bookmark Table Column and Row Titles override. When you do this, your choices include reading column titles, row titles, both, or none. 
@@
@msgUO_ToggleNotesDetectionHlp
This option controls whether to detect comments, footnotes, and end notes  while reading the document. 

Options include:
Off - No comments, footnotes, or end notes are detected.
On - Comments, footnotes, and end notes are detected as the document is navigated.
On with text - The text of the comment, footnote, or endnote is announced when the item is detected as the document is navigated by line.
On plus count - The number of Comments, footnotes, and end notes on the current line is detected as the document is navigated by line.

If a Braille display is attached, the footnote or endnote reference along with its text appears in Braille to the left of its number. For a comment, the text of the comment appears along with its reference.

It is important to note, however, that a comment, footnote, or endnote are not actually located at the place where their references appear in the document. To edit or review the text of such references, the view of the document must be changed to the reference type. So for example, to view footnotes or endnotes, change the view to Footnotes. For comments, bring up the context menu and choose "Edit Comment".

To return to document reading:
From footnotes or endnotesview, change the view back to Normal (or Draft for  Word 2007), or Print Layout.
From the Comment pane, press F6 until "document pane 1" is heard.

%1
@@
@msgUO_ToggleBorderDetectionHlp
This option controls whether to detect changes in borders while reading the document. %1
@@
@msgUO_WDOLGraphicsShowHlp
This option controls whether to detect graphical objects while reading the document in Word or an Outlook 2007 message. This includes pictures, textboxes, and other types of objects, as well as embedded objects. %1

While not in the document window of Word or the message window of an Outlook 2007 message, graphics behave as default settings do. That is:
All shows all graphics with or without labels. Those without labels are shown as Graphic followed by the number.
Labeled only shows those graphics with labels, such as the attachment paperclip in Microsoft Outlook.
None shows no graphics at all.
Note: This setting does not apply to images or graphics on Web pages.  These are graphic icon and symbols in Windows.
@@
@msgUO_ToggleShadingDetectionHlp
This option controls whether to detect changes in shading while navigating table cells . %1
@@
@msgUO_SetColumnTitlesRowHlp
This document-specific option allows the user manually to define the currently selected cell or group of cells as a title row.

In order to use this feature, you first need to change the default setting for "Defined Bookmark Table Column and Row Titles Override". That feature is off by default. This means that %product% honors named titles for columns and rows already present in the document itself, if such bookmark named titles exist. The bookmark named titles must be of a certain form for %product% to recognize them. For example, for Table 1 row and column titles, the bookmark name would be, "Title1". For only column titles, it would be, "ColumnTitle1", and for only row titles, it would be, "RowTitle1".

To learn more about how to use Defined Bookmark Table Column and Row Titles, see the Help topic for the feature.

To set the current title row(s) manually, first move up to the Defined Table Bookmark Titles Override option in the list. Then press SPACEBAR to toggle the override on. Choose either "On for all files" or "On for the current file".

Now move back down the list to define the current title row(s) and press SpaceBar. Press Enter to save the setting changes you have made.
@@
@msgUO_SetRowTitlesColumnHlp
This document-specific option allows the user manually to define the currently selected cell or group of cells as a title column.

In order to use this feature, you first need to change the default setting for "Defined Bookmark Table Column and Row Titles Override". That feature is off by default. This means that %product% honors named titles for columns and rows already present in the document itself, if such bookmark named titles exist. The bookmark named titles must be of a certain form for %product% to recognize them. For example, for Table 1 row and column titles, the bookmark name would be, "Title1". For only column titles, it would be, "ColumnTitle1", and for only row titles, it would be, "RowTitle1".

To learn more about how to use Defined Bookmark Table Column and Row Titles, see the Help topic for the feature.

To set the current title column(s) manually, first move up to the Defined Table Bookmark Titles Override option in the list. Then press SPACEBAR to toggle the override on. Choose either "On for all files" or "On for the current file".

Now move back down the list to define the current title column(s) and press SpaceBar. Press Enter to save the setting changes you have made.
@@
@msgUO_ToggleOverrideDocNamedTitlesHlp
This option controls whether to override detection of any Defined Bookmark Table Column and Row titles contained in the current document. %1 This means that %product% detects bookmark table titles and ignores any table titles assigned manually by the user in a settings file.

The other options are:
On for all files - %product% overrides detection of any Defined Bookmark Table titles that may exist in any document. None are read unless the user manually sets them and saves them in a settings file.

On only for the current file - %product% overrides any Defined Bookmark Table titles that may exist in the current document, but does detect them in other documents.
@@
@msgUO_WordBrailleOptionsHlp
This group of options controls your Braille display while reading a Word document. It also contains groups of options that control your braille display in genreral. 
These include options for panning, contracted braille output, braille marking, 8-dot braille, and more.
@@
@msgUO_WordDocumentPresentationSetHlp
This option controls how %product% formats tables in any version of Microsoft Word or Microsoft Outlook 2007 messages.

The simple layout is line-by-line format, much as you might see in a braille book.
Columns in a table follow each other in linear format, with special representation removed.
The On Screen layout formats text and tables as they appear on screen.
A line contains an entire row, rather than a single cell.  Cell padding, or borders, are indicated with a | (vertical bar or pipe) symbol. 

The default setting is "Simple Layout". This means that only the current cell is spoken and displayed in Braille.
@@
@msgUO_ToggleAutoCorrectDetectionHlp
This option controls whether to detect that Word is autocorrecting spelling errors. %1
@@
@msgUO_ToggleSmartTagsIndicationHlp
This option controls whether to detect that Word is marking smart tags. %1
@@
@msgUO_ToggleShowBrlProofreadingMarkHlp
This option controls whether to show Braille proofreading marks for spelling errors only, grammatical errors only, both, or neither. %1 This means that no Braille marking for spelling or grammatical errors is shown in Braille.

Mark Proofreading Indication in Braille works only if "Active Follows Braille" is on.
@@
@msgUO_ToggleSpellingErrorDetectionHlp
This option controls whether to detect spelling errors while reading through the document.

Options include:
Off - No spelling errors are detected.
On - Errors are detected as the document is navigated.
On plus count - Errors are detected along with the number of errors on the current line as the document is navigated by line.

%1 If Braille is in use, the default is to mark spelling errors in Braille.
@@
@msgUO_ToggleGrammaticalErrorDetectionHlp
This option controls whether to detect grammatical errors while reading through the document. 

Options include:
Off - No grammatical errors are detected.
On - Errors are detected as the document is navigated.
On plus count - Errors are detected along with the number of errors on the current line as the document is navigated by line.
%1 If Braille is in use, the default is not to mark grammatical errors in Braille.
@@
@msgUO_ToggleSetDesiredUnitOfMeasureHlp
This option allows the user to set a desired unit of measure without affecting the application's current setting. For example, if the application is set to inches but centimeters is preferred,  this option allows the user to change the desired unit of measure so that indentation levels are read in that measurement unit. 

In Microsoft Word, fonts are proportionally spaced. So if the user chooses the Spaces option , the measurement unit would normally be announced as pixels. In this case, %product% announces tab stops instead to provide a clearer understanding of where the cursor is on the page.

The default setting is whatever the application setting is for the current locale. In the U.S., for example, this means the default is set to inches.
@@
@msgUO_ToggleExtraHelpIndicationHlp
This option controls whether to detect F1 help information for formfields, such as Help that has been written into the form template by its author. The option has three states:

Off - No F1 help prompt is announced when a formfield containing F1 Help gains focus.

On - The message, "Press F1 for help." is announced when a formfield containing F1 help gains focus.

On with Formfield - The F1 help message associated with a formfield that contains F1 help is announced when the formfield gains focus.

%1 This means that the prompt that F1 help is available is announced when a formfield containing F1 help gains focus.
@@
@msgUO_ToggleBookmarkDetectionHlp
This option controls whether to detect bookmarks while reading through the document. On means that bookmarks are announced and shown in Braille as the document is navigated by character or word. On with Text means that when the bookmark is detected while navigating the document by character or word, the text of the bookmark itself is also announced. %1
@@
@msgUO_ToggleStyleDetectionHlp
This option controls whether to detect style changes while reading through the document. %1 

The two other options include:
always announced - Style changes are announced regardless of what scheme is used.

Detected only by scheme - Style changes are announced when the scheme is of type, Classic. Such schemes include Classic, WordClassic, Classic with Quotes, etc.

If Detected Only by Scheme is in effect, style changes are not announced when the scheme is something other than type Classic. In that case, the scheme itself handles the way a style is detected. For example, in the proofreading with attributes scheme, headings are detected in a different voice, but the announcement of that style is not heard.
@@
@msgUO_ToggleRevisionDetectionHlp
This option controls whether %product% detects and announces any insertions, deletions, or formatting changes made to a document using Word's Track Changes feature.  

The options are:
Do not detect revisions. The option is turned off. 
Speak revision type.  %product% announces only the revision type (default).
Speak revision type plus count.  %product% also announces the number of revisions on the current line.
Speak revision type and  Author.  %product% announces the type of revision and its author. 
Speak revision type and Author plus count.  %product% also announces the number of revisions on the current line.
Speak revision type, Author, and date. %product% also announces the date the revision was made. 
Speak revision type, Author, and date plus count. 

The default setting is to speak only the revision type. This means that %product% will announce the revisions as they are encountered while navigating by character or word, and during SayAll. If a revision appears as the first word on a line and the cursor is on the first character of that revision, %product% will announce that revision when moving by lines. But this is only possible because the cursor happens to be on that revision. If the revision is further along in the line and the cursor is not positioned within the revision, %product% will not announce the revision  when moving by lines.

However, if any of the above-mentioned "Plus Count" options is enabled, %product% wil be able to detect the number of revisions and their types as the document is navigated by lines.

Note: There is a side effect when Plus count is enabled for Revisions , or any other Word object that provides the Plus Count option. when Plus Count is enabled for any Word object, navigating by line causes %product% to announce the number of objects on the line  for those objects that can be counted. These include spelling and grammatical errors, comments, footnotes, endnotes, and fields, as well as revissions.
@@
@msgUO_TogglePositionDetectionHlp
this option controls whether %product% detects page, section, and column breaks while reading through the document. %1
@@
@msgUO_ToggleIndicateBulletTypeHlp
This option controls whether to indicate bullet types while reading through the document. %1
@@
@msgUO_ToggleIndicateBrailleBulletTypeHlp
This option controls whether %product% detects bullets in Braille with a single-cell indicator - the asterisk (*), or with multi-cell abbreviations that represent different bullet types. %1 This means that the multi-cell bullet abrreviations are displayed. This option works only if "Active Follows Braille" is on.
@@
@msgUO_ToggleSchemeHlp
This option controls whether the currently active scheme is always the same for all Word files or the scheme is document-specific.

The default setting is Always the Same.

If you change the default scheme for all of %product% and that scheme is something other than Classic, Word also changes to that scheme. But this is only in effect if all Word documents are set to use the same scheme. If Word is set to have document-specific schemes, changing the scheme setting for the rest of %product% does not impact which Word schemes are in effect. As you load different documents in Word, whatever scheme is set for each document remains in effect.
@@
@msgUO_ToggleTableDetectionHlp
This option controls whether %product% detects that you are entering or exiting a table while reading through the document. %1 This means that when you enter a table , %product% indicates this by announcing table number, cell content, etc., and by displaying relevant table information in Braille. When you exit a table,%product% also indicates that the table has been exited. If the option is turned off, the table can still be navigated normally, but %product% does not indicate when you enter or exit a table or anything about the table itself, its number, type, number of rows and columns it contains, etc.
@@
@msgUO_ClearTitleRowAndColumnDefinitionHlp
This option allows the user to clear all table row and column definitions explicitly set. It has no effect on document named bookmark table headers.
@@
@msgUO_ToggleCountBeforeHlp
This option controls whether %product% announces item counts before or after speaking text. The default setting is to speak them before text.
@@
@msgUO_WordNavigationQuickKeysSetHlp
You can toggle this option on and off from within any document by pressing JAWSKey+z. This option is specific to Microsoft Word and has no effect when the virtual viewer is active. The option controls whether quick navigation keys are enabled for the current document. %1
@@
@msgUO_ToggleAnnounceListNestingLevelHlp
This option controls whether to announce list nesting levels as the document is navigated. %1
@@
@msgUO_ToggleTableDescriptionHlp
This option controls whether descriptive information about the current table is announced as the table is navigated. This includes column and row position information for columns and rows that do not have a header asociated with them. %1
@@
@MsgUO_IndicateNonbreakingSymbolsToggleHlp
This option controls whether %product%  detects nonbreaking symbols while navigating a document. When turned off, all nonbreaking symbols are treated as their standard counterparts: i.e., nonbreaking spaces as spaces, nonbreaking hyphens as hyphens, etc. The options include navigating the document by:
1. Characters
2. Characters and words
3. Characters, words, lines, sentences, and paragraphs
4. Even during SayAll

Pressing the SayCurrentCharacter  keystroke three times quickly always indicates the symbol's true value even when the feature is turned off.

The default setting is by characters only. This means that when navigating only by character, the nonbreaking symbols are detected. 
@@
@msgUO_WordVCursorHeadingsAnnounceHlp
This option controls how %product% announces headings in Word documents.
Select between Off, On, and Heading and Level. The default settings is Heading and Level. If you want all styles to be indicated instead of just headings, choose the Style Changes option rather than Headings Announce from the AdjustJAWSOptions dialog. 
@@
@msgUO_TabMeasurementIndicationHlp
This option controls whether to indicate the new measurement from the left margin when the TAB key is pressed. %1
@@
@msgUO_WordLanguageDetectChangeHlp
This option controls whether %product% detects changes in language within documents which support language tags. %1

This detection only affects those synthesizers, such as Eloquence, that support multiple languages.
@@
@msgUO_ToggleLineSpacingDetectionHlp
This option controls whether %product% announces and displays in Braille document line spacing changes. The default setting in Microsoft Word is single-spaced. But part or all of a document can be double-spaced, triple-spaced, even set to fractional  line spacing. To hear when such changes occur in a document, turn on the setting. The default setting is Off.
@@
@msgUO_toggleCellCoordinatesDetectionHlp
This option controls whether %product% announces cell coordinates for tables as the document is navigated. %1
@@
@msgUO_WordIndentationIndicateHlp
This option controls whether %product% indicates indentation as you navigate using reading commands.
When using the WordClassic or Classic scheme, %product% indicates indentation by announcing the number of %1. This number depends on the application setting for measurement units and whether you have set a desired unit of measure.

For example, the application setting for measurement units may be inches. but if you have set a desired unit of measure to centimeters, then indentation is announced in centimeters. If you have not set a desired unit of measure, indentation is announced based on the application setting for measurement unit. This is typically inches in the U.S. and centimeters elsewhere.

To control what indentation to indicate, and how it should be indicated, See the Speech and Sounds Manager Indentation page.
@@
@msgUO_ToggleSelCtxWithMarkupHlp
This option controls whether %product% detects changes in text context  with schemes. The purpose of Express Navigation  Mode is to speed up reading performance where a large document is being read or where it is not important to hear context changes as they are announced using for a particular scheme. 

When Express Navigation Mode is on, Context detection includes detection of spelling or grammatical errors, revisions, headings, and tables. This means that these types of context changes are still detected, just not announced using the settings for the scheme you are using at the time.

If you turn off Express Navigation Mode, %product% returns to its default settings for all context detection. At that point, any scheme you have in place will once again honor context detection using its own settings. %1
@@
@msgUO_ToggleNewLinesAndParagraphsIndicationHlp
This option determines whether new lines and paragraph marks are announced. For paragraph marks to be announced, they must be visible in the document. This means that the option must be turned on in the application.
The option is unavailable by default when paragraph marks are not visible in the document. The option is set to "When reading" by default when paragraph marks are visible in the document.
To make paragraph marks visible in the document, do not use the native keystroke combination CTRL+Shift+8. Instead, please change the setting from the Options dialog. In versions prior to Microsoft Word 2007, the checkbox for making paragraph marks visible is found in the View page of the Options dialog. In Microsoft Word 2007 and above, the checkbox is found in the Display category of the Options dialog.
The %product% options for the New Lines and Paragraphs Indication setting are as follows:
When typing, if text wraps to a new line while typing, the "new line" indication is announced.
When navigating, if navigating by character or word and ttext wraps to a new line, the "new line" indication is announced.
When reading, if reading the document by lines, sentences, or paragraphs and text wraps to a new line, the "new line" indication is announced. Note that if paragraph marks are not visible in the document, the "new line" indication may be heard twice when moving over paragraph marks.
During SayAll, if paragraph marks are visible in the document, they are heard both during SayAll and when reading. But new lines within paragraphs are not indicated at all. If paragraph marks are not visible in the document, the "new line" indication is heard only where a paragraph mark exists. In this case, the new line indication may be heard twice to show that a double hard return is present.
In addition, You can combine any of these features. For example, you can choose to have new lines indicated when typing and navigating only, or when typing and reading, or when navigating and reading.
@@ 


@msgUO_ToggleObjectCountDetectionHlp
This option controls whether %product% detects and announces the number of embedded objects in the currently opened document. %1

when the option is on, as a document opens, or if you add one from the Insert ribbon in Office 2007, or the Insert menu in prior versions of Office, %product% announces the number of objects in the document.
@@
@msgUO_ToggleBrlTableNumberDisplayHlp
This option determines whether to display table numbers in Braille. %1

The option is independent of whether to display cell coordinates in Braille. When the option is on, table numbers are displayed as "tbl" followed by the number of the table where the cursor is located. When the option is off, only "tbl" is displayed to indicate that the cursor is within a table. But no table number is displayed.
@@


;UNUSED_VARIABLES

@msgUO_ToggleTitleReadingVerbosityHlp
This document-specific option controls whether title reading is on for both columns and rows, on only for columns, on only for rows, or off altogether. The default setting is Off unless the current table contains Defined Bookmar, Table Column and Row titles.
@@

;END_OF_UNUSED_VARIABLES

EndMessages

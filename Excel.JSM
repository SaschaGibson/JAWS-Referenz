; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 12.0.xx script Message file for Microsoft Excel
; Common messages for Excel 2003 and higher.

const
;scR1C1_R, scR1C1_C, and scNegative all refer to components of the R1C1 style of a cell reference
;To switch Excel to using the R1C1 reference style, File > Options > Formulas > R1C1 reference style
	scR1C1_R = "R",
	scR1C1_C = "C",
	; scNegative is the - displayed inside brackets to indicate a negative offset when constructing a formula.
	;With Excel set to use the R1C1 reference style, start a formula in cell R2C1 by typing =
	;Arrow up once. You should get R[-1]C.
	scNegative = "-",
; for scItemStatusFilter, this is duplicate text that UIA provides in the ItemStatus property of a cell which we already provide via other means.
; For example: We already announce that a cell has formula, and this is tied to a setting.
; Move onto a cell that contains a formula,
; Touch Cursor -> Advanced Mode -> Alt+Enter and down arrow to ItemStatus.
; copy your language's term for formula, this is case sensitive, in English the status text has Formula with a capital F.
; Words in this string are separated by vertical bars:
	scItemStatusFilter = "|Formula|",
;scItemStatusBlankSheet is the text to be replaced with the message msgSheetItemStatus_EmptySheet.
;To get this text:
;In Excel Quick Settings, go to Excel Settings > Reading Options.
;Make sure that "Object Count Detection" is checked.
;Open or create an Excel workbook with more than one sheet.
;Use Control+PageUp or Control+PageDown to move to a sheet.
;when you move to an empty sheet, scItemStatusBlankSheet  will be spoken.
;You can use speech history to copy the exact text which was spoken.
	scItemStatusBlankSheet = "End of sheet A1, 0 cells, 0 objects.",
;UIA classes:
; Sort combo box in Excel
; put data on a sheet, select region
; Context menu | sort | custom sort
; tab / shift+tab to the combo box
; alt+down arrow to open the combo box.
; To get the string:
; turn on Touch cursor | Advanced Mode (shift+NumPadPlus, NumPadStar)
; press alt+enter.
; Copy the text after the string:
; className: 
; English example: className: NetUIDropdown
	UIA_WC_Dropdown = "NetUIDropdown",
; Spellcheck dialog
	noSelectedItem="No selected item", ; when no suggestions
	suggestionsListboxPrompt="Suggestions:",
;keystroke names for spellcheck keys.
;these are the accelerators or access keys for the buttons in SpellCheck.
;Within a spreadsheet, run spell check and these are the row of buttons, Ignore, Ignore All, Change, Change All.
;These are all done in lower case to make things simpler, so when translating the keys for your language, use lowercase letters.
	ksIgnore = "alt+i",
	ksIgnoreAll = "alt+g",
	ksChange = "alt+c",
	ksChangeAll = "alt+l",
; for section in .jsi file that is also used in View Custom Summary and Create Prompt dialogs:
	Section_customSummary="Summary", ; unlimited number of custom labels a user can designate
;delimiter on title bar where workbook name is included with app name:
	sAppWinTitleDelimiter = "-",
;some page setup format codes
	scD="D", ;Prints the current date.
	scT="T", ;Prints the current time.
	scF="F", ;Prints the name of the document.
	scA="A", ;Prints the name of the workbook tab.
	scP="P", ;Prints the page number.
	;&PlusNumber=P+number Prints the page number plus the specified number.
	;&P-number Prints the page number minus the specified number.
	;&& Prints a single ampersand.
	;& "fontname" Prints the characters that follow in the specified font. Be sure to include the double quotation marks.
	;&nn Prints the characters that follow in the specified font size. Use a two-digit number to specify a size in points.
	scN="N", ;Prints the total number of pages in the document.
;format codes delimiter to be shown for easier readability when format code strings are shown
	scSemi="; ",
;for the Ampersand appearing as part of a set of format codes, as in for page setup:
	scAmpersand="&",
;Status bar strings:
	StatusBar_Ready = "Ready",  ;normal, waiting for action
	StatusBar_Edit = "Edit",  ;f2 was pressed
	StatusBar_Enter = "Enter",  ;immediately after typing equal sign directly in cell
	StatusBar_Point = "Point",  ;navigation after pressing equals directly in cell
	StatusBar_Point_Extend_Selection = "Point Extend Selection", ;navigation after pressing equals, formula name, and colon for the end of range navigation directly in cell
	StatusBar_Comment = "commented",  ;editing a comment
	StatusBar2003_ext = "EXT",  ;user presses F8 or Shift+F8:
	StatusBar2007_ext = "Extend Selection",  ;user presses F8 or Shift+F8:
	StatusBar2003_add = "ADD",  ;user presses F8 or Shift+F8:
	StatusBar2007_add = "Add to Selection",  ;user presses F8 or Shift+F8:
	StatusBar_AddOrRemoveSelection = "Add or Remove Selection",  ;User presses SHIFT+F8
;for the word "and" to appear as part of a message string
	scAnd=" and ",
; for the letter "a" in column A
	scColumnA="a",
	scUpperColumnA="A ",

; Constants for Name comparisons to be used with Title Name feature:
; An Excel named bookmark starting with any of the following strings
; will be considered a valid titled name by JAWS.
; The start point of the region is the address in the Address field of the defined name,
; the end point is the address specified in the name following the second period in the name.
; Assuming that a named title is at address A1,
; all of the following are equivalent:
;	TitleRegion1.A1.J10.1
;	Title.A1.j10
;	Title_Averages.A1.J10
;	Title..J10
;	Title_Averages..J10
;	title..j10
; Notes:
; The terminating sheet number is no longer required.
; The title strings are in lower case so that comparison may be case-insensitive.
; A named title with no end point in the name will be considered to be open-ended.
;For English:
	NameTitle="title",
	NameColumnTitle="columntitle",
	NameRowTitle="rowtitle",
;For localization into non-English:
	NameLocalTitle="title",
	NameLocalColumnTitle="columntitle",
	NameLocalRowTitle="rowtitle",

; RGB MSAA name comparision (Format cells | Fill | background color)
	NameRGB="RGB",

; RGB character constants for RGB color vlaues such as background colors in fill tab or format cell dialog
	cScRGBComma = ",",
	cScRGBLeftParen = "(",
	cScRGBFiller = "0",

;Window names:
; for window names in Datavalidation dialog:

	wn_autofilter="Autofilter",
 	wn_FunctionArguments="Function Arguments",
;scheduled functions
	fnMsgsf1 = "CheckForSelectionChange",
;Keystrokes
	ksSmartTagActionsMenu="Alt+Shift+F10",
	ksNewSheet="Alt+Shift+F1",
	ksEditComment="Shift+F2",
	ksSelectToBeginningOfRow="Shift+Home",
	ksSelectToBeginningOfWorksheet="Control+SHIFT+HOME",
	ksSelectToLastDataCell="Control+Shift+End",
	ksSelectPriorScreen="Shift+PageUp",
	ksSelectNextScreen="Shift+PageDown",
	ksSelectNextRegionRight="Control+Shift+RightArrow",
	ksSelectPriorRegionLeft="Control+Shift+LeftArrow",
	ksSelectNextRegionDown="Control+Shift+DownARrow",
	ksSelectPriorRegionUp="Control+Shift+UpArrow",
	ksSelectNextSheet = "Control+Shift+PageDown",
	ksSelectPriorSheet = "Control+Shift+PageUp",
	ksCopy="Control + C",
	ksChartMenu="Alt+C",
;string compares
	scExclaim="!",
	scSheetNameRemnant="''!",
	scHyperlinkInFormula="=HYPERLINK",
	scDollar="$",
	scSpellcheck="spellcheck",  ; for unknown function call testing, no need to localize.
; for multiple region names where periods must be replaced with underline chars to display properly in treeviews:
	sc_period=".",
	sc_underlineChar="_",
	;For listbox item in the Diagram Gallery dialog off the Insert menu.
 	sc_OrganizationChart="Organization chart",

	; when cell is a number too big to be displayed with current column width
	scNumberSigns="###",
	scRed="red",
	scSampleButton="Press and Hold to View Sample",
	scSelectGroupbox="Select from",
	scEquals = "=",
	scPercent = "%",
	scFormulaSheetDelimiter="!", ; used for extracting the sheet name from a formula's range
	scFormulaRangeDelimiter=",", ; used for formula delimiter when distinguishing the parts of a formula specifying a range of cells
; formula substring used for col/row totals
scTotalFormulaStr="=SUM",
; Categories listbox
scCategories="Categories",
; for XLCountFunction, %1 is the coordinates of the range in a1:b1 notation
; note this should only be translated if the Excel worksheet function for
;counting cells with data is different in your installation of VBA.
XLCountFunction="countA(%1)",
; Note to  translators, this should only be translated if the Excel Worksheet Round Function is different in your VBA installation.
; for XLRoundPercentCalcFunction,
;%1=valueRangeSourceSheet
;%2=point address
;%3=valueRange
; note the double %%. This is required in order to pass the % to the formula
XLRoundPercentCalcFunction="=round(%1%2/SUM(%3)%%,0)",
scPressed="Pressed",
; scEdit used to detect when f2 is pressed and the UI enters edit mode
scEdit="Edit",
; number format identifiers
	scFormatDelimiter="_",
	scFormatSectionDelimiter=";",
	scFormatGeneral="GENERAL",
	scFormatAccounting="*",
	scFormatNumber=".",
	scFormatPercent="%",
	scFormatCurrency="$#",
	scFormatScientific="E",
	scFormatText="@",
	scFormatFraction="?/?",
	scFormatDate="m",
	scFormatTime="h",
	scDecimalPoint=".",
; used by ColumnNumberToLetter
alphabet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ",
; functions called from User Buffer when chart is active
fnSelectChartTitle="SelectChartTitle(chart)", ; actual function string
fnDisplaySelectChartTitle="Select Chart Title", ; what is displayed in dlgListOfLinks dialog
fnSelectCategoryAxisTitle="SelectCategoryAxisTitle(chart)", ; actual function string
fnDisplaySelectCategoryAxisTitle="Select Category Axis Title", ; what is displayed in dlgListOfLinks dialog
fnSelectValueAxisTitle="SelectValueAxisTitle(chart)", ; actual function string
fnDisplaySelectValueAxisTitle="Select Value Axis Title", ; what is displayed in dlgListOfLinks dialog

;window names
;For the macro dialog, the control that lets a user define a shortcut key for the macro being created.
	wn_InsertFunction="Insert Function",
; Next few items are for JAWS custom summary dialog:
	wn_Summary="Summary",
	wn_add="Add",
	wn_Change="Change Name...",
	wn_Remove="Remove",
	wn_RemoveAll="Remove All",
	wn_MoveUp="Move UP",
	wn_MoveDown="Move Down",
	wn_OK="OK",
	wn_Cancel="Cancel",
;end of JAWS custom summary dialog items.
	wn_RefersTo="Refers to:",
	wn_MainApp="Microsoft Excel - ",
	wn_chartType="Chart Type",
	wn_ChartWizard = "Chart Wizard",
	wn_DataRangePage="Data Range",
	wn_FormatCells="Format Cells",
	wn_Spelling = "Spelling",
	wn_Number = "Number",
	wn_Alignment = "Alignment",
	wn_Border = "Border",
	wn_Patterns = "Patterns",
	wn_Protection = "Protection",
	; Keyword that appears in format dialogs such as from chart area - select chart > context menu > format chart area
	wn_FormatPage="Format",
	wn_SeriesPage="Series",
	wn_EditSeries="Edit Series",
	wn_DefineName="Define Name",
	wn_DataValidation="Data Validation",
	wn_Select_Data_Source = "Select Data Source",
	wn_StartDate="Start date:",
	wn_EndDate="End date:",
	wn_StartTime="Start time:",
	wn_EndTime="End time:",
	wn_minimum="Minimum:",
	wn_maximum="Maximum:",
	wn_source="Source:",
	wn_Value="Value:",
; button names
	BtnBold="bold",
	btnItalic="italic",
	btnUnderline="underline",
	btnStrikethrough="StrikeThrough",
	sc_Formatting="Formatting",
	; Object name for a parent object in popup window with a treeview located in autofilter dropdown...
	SC_ManualFilter = "Manual Filter",
; Edit Comment dialog box title and prompt:
	EditCommentDlgTitle = "Edit comment",
	EditCommentDlgTextPrompt = "Add or Update Comment:",
	EditNoteDlgTitle = "Edit note",
	EditNoteDlgTextPrompt = "Add or Update Note:",
;functions for the virtual viewer:
cFuncEscapeToPriorSheet="EscapeToPriorSheet()",
cFuncEscapeToNextSheet="EscapeToNextSheet()",


;UNUSED_VARIABLES

;for processing large numbers of filtered columns and rows:
 	scColumns="columns",
 	scRows="rows",

; for script key names:
	sn_ReturnToCellMarker="ReturnToCellMarker",
	sn_SelectWorksheetObjects="SelectWorkSheetObjects",

	NameTitleLocal="title",
	NameColumnTitleLocal="columntitle",
	NameRowTitleLocal="rowtitle",
	NameRegionTitle="titleregion",
	NameRegionTitleLocal="titleregion",
	NameRegionColumnTitle="columntitleregion",
	NameRegionColumnTitleLocal="columntitleregion",
	NameRegionRowTitle="rowtitleregion",
	NameRegionRowTitleLocal="rowtitleregion",
	NameRegionTopLeft="TopLeftRegion",
	NameRegionTopLeftLocal="TopLeftRegion",
	NameRegionBottomRight="BottomRightRegion",
	NameRegionBottomRightLocal="BottomRightRegion",
	wn_ColumnWidth="Column Width",
	wn_FindFormat="Find Format",
	wn_CustomSummaryView="Summary for workbook",
	wn_FormattingRule="Formatting Rule", ; for Formatting Rules Manager NewRule, Edit Rule, or Delete Rule subdialogs
	wn_ConditionalFormattingRulesManager="Conditional Formatting Rules Manager",
	wn_ImportWizard="Import Wizard",
	wn_grouping="Grouping", ; grouping dialog for items such as pivot table from context menu.
	wn_Title="Title:",
	wn_InputMessage="Input message:",
	wn_ErrorMessage="Error message:",
	wn_parameters="Parameters", ;from context menu
	wn_Symbol="Symbol",
	wn_AdvancedFilter="Advanced Filter",
;Verbosity Dialog items
; Note to localizers:
;The following constants should only be translated starting with the character after the colon.
; for XLVerbosityItems:
	jvToggleCellReadingVerbosity="|ToggleCellReadingVerbosity:Cell Verbosity",
	jvToggleSelectionReadingVerbosity="|ToggleSelectionReadingVerbosity:Selection Verbosity",
	jvToggleNumberFormatVerbosity="|ToggleNumberFormatVerbosity:Number format changes",
	jvToggleFormulas="|ToggleFormulas:Formulas",
	jvToggleComments="|ToggleComments:Comments",
	jvToggleMergedCells="|ToggleMergedCells:Merged cells",
	jvToggleCellBorderVerbosity="|toggleCellBorderVerbosity:Border changes",
	jvToggleCellshadingChanges="|ToggleCellShadingChanges:Shading changes",
	jvToggleFontChanges="|ToggleFontChanges:Font, color, and attribute changes",
	jvToggleMultipleRegionSupport="|ToggleMultipleRegionSupport:Regions",
	jvToggleTitleReadingVerbosity="|ToggleTitleReadingVerbosity:Title Reading",
	jvToggleTitleRestriction="|ToggleTitleRestriction:Read Titles for",
	jvSetColTitlesToRowRange="|SetColTitlesToRowRange:Set Column Titles to Row Range",
	jvSetRowTitlesToColumnRange="|SetRowTitlesToColumnRange:Set Row Titles to Column Range",
	jvSetTotalsColumnToCurrent="|SetTotalsColumnToCurrent:Set Totals Column",
	jvSetTotalsRowToCurrent="|SetTotalsRowToCurrent:Set Totals Row",
	jvSetNextAvailableMonitorCell="|SetNextAvailableMonitorCell:Define Monitor Cells",
	jvToggleMonitorCellTitles="|ToggleMonitorCellTitles:Announce monitor cell titles",
	jvClearMonitorCells="|ClearMonitorCells:Clear monitor cells",
	jvClearRegionDefinitions="|ClearRegionDefinitions:Clear Title & Total Definitions",
	jvToggleBrlStructuredMode="|ToggleBrlStructuredMode:Braille Mode",
	jvToggleDocSettingsAssoc="|ToggleDocSettingsAssoc:workbook Settings",
	jvToggleOverrideDocNamedTitles="|ToggleOverrideDocNamedTitles:Override named titles",
	jvToggleAnnounceTextVisible="|ToggleAnnounceTextVisible:Cell text visibility",
	jvToggleDetectFormatConditions="|ToggleDetectFormatConditions:Format conditions detection",
;function name for EnumerateTypeAndTextForWindows
	fn_isStaticText="isStaticText",
	Excel2003_ksSpellcheckIgnoreButton = "ALT+SHIFT+i",
	Excel2007_ksSpellcheckIgnoreButton = "ALT+SHIFT+i",
	ksActivateDropDown="alt+downarrow",  ;Activate drop down listBox
	ksSpellcheckChangeButton="Alt+C",
	ksSpellcheckIgnoreAllButton="Alt+G",
	ksInsertDate="Control+Semicolon",
	ksInsertTime="Control+Shift+Semicolon",
	scNextBtn="Next >", ;found in dialogs such as the Import wizard dialog.
	scSummary="Summary", ; for custom summary as part of sheet name section in .ini file
	scGeneral="General", ;for the general section for sheet names in .jsi files, used for refreshing and removing section names.
	scIsDocumentPropertiesPane="IsDocumentPropertiesPane", ;for unknown function call testing, no need to localize.
	sc_Preview="Preview:",
	sc_sheet="Sheet", ; for determining what kind of address the current hyperlink item is
	scUnderline = "_",
; autofilter custom dlg:
	scCustomAutofilter="(Custom...)",
	scAllAutofilter="(All)",
	scTop10Autofilter="(Top 10...)",

; application object name
	scExcelApp="Excel.Application",
; List of border styles displayed in radio buttons with cIds 5600 to 5613
;have to use \007 here as can't use literal + const syntax
lstBorderStyles="none\007hairline continuous\007thin dot\007thin dash dot dot\007thin dash dot\007thin dash\007thin continuous\007medium dash dot dot\007medium slant dash dot\007medium dash dot\007medium dash\007medium continuous\007thick continuous\007thick double",
;window names
	wn_ShortCutKey="Shortcut key:",
	wn_command="Commands",
	wn_addins="Add-Ins",
	wn_SourceData="Source Data", ; for source data SDM dialog for charts.
;	For the Delete Conditional Formatting dialog, a subdialog off the Conditional Formatting dialog in the Format menu:
	wn_DeleteConditionalFormat="Delete Conditional Format",
	wn_SortOptions="Sort Options",
	wn_NotInDictionary = "Not in Dictionary",
	wn_Capitalization = "Capitalization:",
	wn_RepeatedWord = "Repeated Word:",
	wn_NoSuggestions= "(No Suggestions)",
	wn_replace = "Replace",
	wn_macro = "Macro",
	wn_macroOptions="Macro Options",
	wn_subtotle = "Subtotal",
	wn_data_validation = "Data Validation",
	wn_consolidate = "Consolidate",
	wn_run_querry = "Run Query",
	wn_import = " Import Text File",
	wn_CreateNames="Create Names",
	wn_save_workspace = "Save Workspace",
	wn_page_setup = "Page Setup",
	wn_move_or_copy = "Move or Copy",
	wn_CustomAutofilter="Custom AutoFilter",
	wn_NewName="New Name", ; dialog name in Excel 2007 for Define Name dialog in prior versions.
	scBoldBtn="bold button",
	scItalicBtn="italics button",
	scUnderlineBtn="underline button",
	scStrikethroughBtn="strikethrough button",
	btnAlignLeft="Align Left",
	btnAlignRight="Align Right",
	btnCenter="Center",
;on-screen dialog text for control prompts follows.
;For the Page Setup dialog:
;Page Tab, for the orientation radio buttons
cMsgOrientation="Orientation",
;for the percentage of normal size
cMsgPercentNormalSize="% normal size",
;for the page wide and page tall
;note that in English, the prompts and controls are in the form
;"# page(s) by # tall" (with # being the edit spinbox controls)
;we form the prompt since the user will usually only hear one portion of the prompt at a time when tabbing.
cMsgPagesWide="page(s) wide",
cMsgPagesTall="page(s) tall",
;Margins Tab, for the centering checkboxes
cMsgCenterOnPage="Center on page",
;Sheet Tab, for the "print" check boxes such as Gridlines
cMsgPrint="Print",
;For the Page order radio buttons
cMsgPageOrder="Page order",
; for 2000: check status of listbox items in Customize toolbar listbox not otherwise obtainable
scUnChecked="corner",
scChecked="check mark"

;END_OF_UNUSED_VARIABLES

messages
;for ScriptFileName, the configuration name
;Note that the version of Excel is not being reported for versions 2016 and O365,
;and that versions 2013 and earlier are reported as Excel Classic.
@msgExcelAppName
Microsoft Excel
@@
@msgExcelClassicAppName
Excel Classic
@@
@msgScrnSensitiveHlp2_L
This is a chart.
To return to the worksheet press Escape.
@@
@msgScrnSensitiveHlp2_S
chart
return to worksheet Escape
@@
; for msgScrnSensitiveHlp3_L/S, %1=name of worksheet
; and %2=number of worksheet.
@msgScrnSensitiveHlp3_L
This is the spreadsheet area.
The worksheet name is %1 and its number is %2.
@@
@msgScrnSensitiveHlp3_S
spreadsheet area
worksheet %1
@@
@msgScrnSensitiveHlp3a_l
The worksheet has a custom summary. To view the summary, pres %1 and choose the Show Custom Summary option.
@@
@msgScrnSensitiveHlp3a_s
has summary
 %KeyFor(RunJAWSManager) and Show Custom Summary to view
@@
; for msgScrnSensitiveHlp4_L_S, %1=number of objects (shapes) in the drawing layer of the worksheet
@msgScrnSensitiveHlp4_L
The worksheet contains %1 objects.
To select an object on the worksheet  use %KeyFor(SelectWorksheetObjects).
@@
@msgScrnSensitiveHlp4_S
worksheet contains %1 objects.
select object use %KeyFor(SelectWorksheetObjects).
@@
;for msgScrnSensitiveHlp4a_L/S, %1=number of cells with comments on the current sheet
@msgScrnSensitiveHlp4a_L
The worksheet contains %1 cells with comments.
To list cells with comments on the current worksheet use %KeyFor(listCellsWithComments).
@@
@msgScrnSensitiveHlp4a_S
worksheet contains %1 comments
list cells with comments %KeyFor(listCellsWithComments).
@@
;msgScrnSensitiveHlp4a_O365_L/S, %1=number of cells with notes or comments on the current sheet
@msgScrnSensitiveHlp4a_O365_L
The worksheet contains %1 cells with notes or comments.
To list cells with notes on the current worksheet use %KeyFor(listCellsWithNotes).
@@
@msgScrnSensitiveHlp4a_O365_S
worksheet contains %1 notes or comments
list cells with notes %KeyFor(listCellsWithNotes).
@@

; for next two messages, the key assignment for selecting a hyperlink from a list has been moved to the same key assignment as ReadMistakeAndSuggestion.
; this is for consistency with that key assignment in IE. It does not break functionality for the Spellchecker.
; for msgScrnSensitiveHlp5_L/S, %1=number of hyperlinks on the worksheet
@msgScrnSensitiveHlp5_L
The worksheet contains %1 hyperlinks.
To select a hyperlink on the worksheet use %KeyFor(SpellCheck).
@@
@msgScrnSensitiveHlp5_S
worksheet contains %1 hyperlinks.
select hyperlink use %KeyFor(SpellCheck).
@@
; for msgScrnSensitiveHlp6_L/S, %1=number of worksheets in current workbook
; %2=name of current workbook
@msgScrnSensitiveHlp6_L
There are %1 worksheets in the %2 workbook.
To move to a particular worksheet use %KeyFor(moveToWorksheet).
@@
@msgScrnSensitiveHlp6_S
%1 worksheets in %2
move to worksheet use %KeyFor(moveToWorksheet).
@@
@msgHotkeyHelp1_L
Press escape to return to the worksheet.
@@
@msgHotkeyHelp1_S
escape to return to worksheet.
@@
; Other Excel SDM dialog Hotkey Help
@msgXLHotkeyHlp1_L
hot keys are as follows
To repeat the misspelled word and suggestion use %KeyFor(SpellCheck).
To move to suggestions list box use Alt N
To return to Change to: edit box use Alt T
To Choose the ignore option use Alt I
To choose the ignore all option use Alt G
To accept the recommended change use Alt C
To accept the recommended change for all occurrances use Alt L
To select the always suggest check box use Alt y
To select the ignore uppercase check box use alt e
To Add word to dictionary use Alt A
To select a specific dictionary to add words use Alt W
To undo last change use Alt U
To choose auto correct use alt r
For Help with spell checker use Alt H
To cancel spellchecker use Escape.
@@
@msgXLHotkeyHlp1_S
repeat misspelled word and suggestion use %KeyFor(SpellCheck).
suggestions list box use Alt N
Change to: edit box use Alt T
ignore option use Alt I
ignore all option use Alt G
accept change use Alt C
accept change for all occurrances use Alt L
always suggest check box use Alt y
ignore uppercase check box use alt e
Add word to dictionary use Alt A
select specific dictionary use Alt W
undo last change use Alt U
auto correct use alt r
Help with spell checker use Alt H
cancel spellchecker use Escape.
@@
@msgXLHotkeyHlp2_L
hot keys are as follows
category use alt c
@@
@msgXLHotkeyHlp2_S
category alt c
@@
@msgXLHotkeyHlp3_L
hot keys are as follows
horizontal group
general use alt g
left use alt l
center use alt c
right use alt r
fill use alt f
justify use alt j
center across selection use alt a
vertical group
top use alt t
center use alt e
bottom use alt b
justify use alt u
wrap text use alt e
orientation use alt n
@@
@msgXLHotkeyHlp3_S
horizontal group
general alt g
left alt l
center alt c
right alt r
fill alt f
justify alt j
center across selection alt a
vertical group
top alt t
center alt e
bottom alt b
justify alt u
wrap text alt e
orientation alt n
@@
@msgXLHotkeyHlp4_L
hot keys are as follows
Font use alt f
Font styles use alt o
size use alt s
strike through use alt k
Superscript use alt e
Subscript use alt b
Underline use alt u
Normal font use alt n
color use alt c
@@
@msgXLHotkeyHlp4_S
Font alt f
Font styles alt o
size alt s
strike through alt k
Superscript alt e
Subscript alt b
Underline alt u
Normal font alt n
color alt c
@@
@msgXLHotkeyHlp5_L
hot keys are as follows
right use alt r
top use alt t
bottom use alt b
Style group use alt e
color use alt c
border group
outline use alt o
left use alt l
@@
@msgXLHotkeyHlp5_S
right alt r
top alt t
bottom alt b
Style group alt e
color alt c
border group
outline alt o
left alt l
@@
@msgXLHotkeyHlp6_L
hot keys are as follows
Color palette use alt c
pattern use alt p
@@
@msgXLHotkeyHlp6_S
Color palette alt c
pattern alt p
@@
@msgXLHotkeyHlp7_L
hot keys are as follows
locked use alt l
hidden use alt i
@@
@msgXLHotkeyHlp7_S
locked alt l
hidden alt i
@@
@msgXLHotkeyHlpChartActive
To display a description of the active chart in the virtual viewer, press %KeyFor(DisplayActiveChartInVirtualViewer).
@@
@msgWinKeysHelp1_L
Here are some Excel Keyboard shortcuts
Auto sum, use Alt plus equals
Go to cell, use F5
to start a formula, use equals
Select the entire column, use control plus space bar
Select the entire row, use shift plus space bar
use standard window selecting keystrokes to select specific cells
move to edge of data regions, use control and arrow keys
Switch sheets, use control and page up or down
Move left or right one screen, use Alt plus Page down or up
to move to the end of any row or column
 use the end key then the arrow key in the desired direction
selecting text, use combinations of control and shift with arrows, home and end
Insert the date, use control plus semicolon
Insert the time, use Control plus shift plus semicolon
@@
@msgWinKeysHelp1_S
Excel shortcut keys
Auto sum, use Alt plus equals
Go to cell, use F5
formula mode, use equals
Select column, use control plus space bar
Select row, use shift plus space bar
use standard window selecting keystrokes to select specific cells
move to edge of data regions, use control and arrow keys
Switch sheets, use control and page up or down
Move left or right one screen, use Alt plus Page down or up
to move to the end of any row or column
 use the end key then the arrow key in the desired direction
selecting text, use combinations of control and shift with arrows, home and end
Insert date, use control plus semicolon
Insert time, use Control plus shift plus semicolon
@@
; for msgColorFGOnBG, %1=foreground color name, %2=background color name
@msgColorFGOnBG1
%1 on %2
@@
; for msgListItem1, %1=cell coordinates %2=cell title, %3=cell content
@msgListItem1
%1: %2 %3
@@
; for msgListItem2, %1=cell coordinates %2=cell content
@msgListItem2
%1: %2
@@
; for msgListItem1Reverse, %1=cell coordinates %2=cell title, %3=cell content
@msgListItem1Reverse
%2 %3: %1
@@
; for msgListItem2Reverse, %1=cell coordinates %2=cell content
@msgListItem2Reverse
%2: %1
@@
; for msgListItemH/VPageBrk, %1=coordinates, %2=cell content
@msgListItemHPageBrk1
%1: %2 horizontal
@@
@msgListItemVPageBrk1
%1: %2 vertical
@@
; for msgListItemShape, %1=shape name, %2=spanning coordinates, %3=text
@msgListItemShape1
%1 %2: %3
@@
; for msgVisibleRange, %1=starting cell coordinates, %2=ending cell coordinates
; %3=number of cells with data which are visible
;%4=total number of visible cells
@msgVisibleRange1_L
visible range is %1 through %2
%3 of the %4 visible cells contain data.
@@
@msgVisibleRange1_S
%1 through %2
%3 of the %4 visible cells contain data.
@@
; for msgSpans, %1=start coordinates, %2=end coordinates. ;
;This is used when showing the cells spanned by a drawing layer object.
@msgSpans1
%1-%2
@@
; for msgChart, %1=title, used when describing ole objects
@msgChart1
chart: %1
@@
@msgSelecting1
select
@@
@msgUnselecting1
unselect
@@
; for msgNewRegion_L/S, %1=new region's name if any
@msgNewRegion1_L
new region %1
@@
@msgRegionSpans1_L
The region %1 spans %2 through %3
@@
@msgRegionSpans1_S
region %1 spans %2 through %3
@@
;for msgRegionName1_L, %1=top left coordinates, %2=bottom right coordinates
;used for dlgSelectFunctionToRun
@msgRegionSpans2_L
%1-%2
@@
;next two messages used for value displayed in dlgSelectFunctionToRun when setting row/column titles or totals
;for msgRangeMultipleCells1_L, %1=start row/col ID and %2=end row/col ID
@msgRangeMultipleCells1_L
%1-%2
 @@
;for msgRangeOneCell1_L, %1=row/col ID
@msgRangeOneCell1_L
%1
@@
@msgUndefined1_L
Undefined
@@
@msgAuto1_L
Auto
@@
;for msgSetRowTitlesRange1_L, %1=column range
@msgSetRowTitlesRange1_L
Setting row titles column range to %1
@@
;for msgSetColTitlesRange1_L, %1=row range
@msgSetColTitlesRange1_L
Setting column titles row range to %1
@@
;for msgSetTotalsColumn1_L, %1=totals col
@msgSetTotalsColumn1_L
Setting totals column to %1
@@
;for msgSetTotalsRow1_L, %1=totals row
@msgSetTotalsRow1_L
Setting totals row to %1
@@
;for msgRowTotalDlgTitle, %1 = the row number for the total cell
@msgRowTotalDlgTitle
Total of Row %1
@@
;for msgColumnTotalDlgTitle, %1 = the column letter for the total cell.
@msgColumnTotalDlgTitle
Total of Column %1
@@
@msgRowTotal1_L
row total=%1
@@
@msgRowTotal1_S
total=%1
@@
@msgColTotal1_L
column total=%1
@@
@msgColTotal1_S
total=%1
@@
; for msgSetNthMonitorCell_L/S, %1=monitor cell number, ie 1 through 10 and
;%2=coordinates of cell to monitor.
@msgSetNthMonitorCell1_L
Setting monitor cell %1 to %2
@@
@msgSetNthMonitorCell1_S
monitor cell %1=%2
@@
@msgSetNthMonitorCellTitle
Monitor cell %1
@@
@msgNoMonitorCellsAvailable1_L
No Monitor Cells Available
@@
;for msgAssignedMonitorCells1_L, %1=list of numbers of assigned Monitor Cells
@msgAssignedMonitorCells1_L
Assigned: %1
@@
;for the next two messages (monitor cells list), %1= the monitor cell, %2 = the cell coordinates.
@msgAssignedMonitorCellsInList
%1 already set to %2.
@@
@msgAssignNewMonitorCellInList
Set %1 to %2.
@@
@msgNoMonitorCellsAssignedInList
No assignment
@@
@msgClearMonitorCellsInList
Clear All Assignments
@@
@msgDontAssignFromList
Do not assign
@@
@msgAssignedMonitorCells2_L
None Assigned
@@
@msgMonitorCellInfoUnavailable
Monitor cell information is unavailable while editing a cell or when focus is not on a spreadsheet.
@@
@msgMonitorCellUndefined1_L
monitor cell %1 undefined
@@
@msgMoveToMonitorCell1_L
Move to Monitor Cell
@@
;for msgNoMonitorCellsDefined1_l,
;%1 is the name of the sheet.
@msgNoMonitorCellsDefined1_L
No monitor cells defined for %1
@@
@msgNoMonitorCellsDefined1_S
No monitor cells
@@
; Quick Settings messages relating to cell assignments (e.g., monitor cells).
; %1 is a single cell address like C4 or may in some cases be a range.
; Option for assigning a cell or leaving it assigned.
@msgQSAssigned
Assigned to %1
@@
; Option for reassigning from one cell to another.
@msgQSReassigned
Reassigned to %1
@@
; Option for clearing or leaving unassigned a cell.
@msgQSUnassigned
Unassigned
@@
; Error message on an attempt to assign a monitor cell to a cell that's already one.
@msgQSDuplicateCell
Cell %1 is already assigned as monitor cell %2
@@
; Used to describe a Quick Settings item value that was in effect when Quick Settings opened.
; %1 is the original item value.
@msgQSNoChange
%1 (No Change)
@@
; for msgPoint_L, %1=number of points, ie used for reporting font size
@msgPoint1_L
%1 point
@@
; for msgComment1 and msgNote1, %1=the comment or note for the cell
;This is shown in braille as the comment component when focus is on a cell with a comment, where msgNote1 is used in Excel O365 and msgComment1 in earlier versions.
@msgComment1
comment: %1
@@
@msgNote1
note: %1
@@
; for msgHyperlink, %1=link address
@msgHyperlink1
link: %1
@@
@msgCellFont1_L
Cell Font and Formatting:
@@
@msgCellFont1_S
Font and Formatting:
@@
@msgTitleCellFont1_L
Title Cell Font and Formatting:
@@
;for msgCellBackgroundColor, %1 is the background color.
@msgCellBackgroundColor
background color %1
@@
;for msgCellTextColor, %1 is the background color.
@msgCellTextColor
text color %1
@@
;for msgTitleCellBackgroundColor, %1 is the background color.
@msgTitleCellBackgroundColor
background color %1
@@
;for msgTitleCellTextColor, %1 is the background color.
@msgTitleCellTextColor
text color %1
@@
; for msgCellH/VAlignment_L/S, %1=alignment description
@msgCellHAlignment1_L
Horizontal alignment is %1.
@@
@msgCellHAlignment1_S
horizontal alignment %1
@@
@msgCellVAlignment1_L
Vertical alignment is %1.
@@
@msgCellVAlignment1_S
vertical alignment %1
@@
; for msgCellIndentLevel_L/S, %1=indent level
@msgCellIndentLevel1_L
indent level %1
@@
; for msgTitleCellIndentLevel_L/S, %1=indent level
@msgTitleCellIndentLevel1_L
indent level %1
@@
; for msgTitleCellNumberFormat, %1=cell number format
@msgTitleCellNumberFormat1_L
Number format is %1.
@@
@msgTitleCellNumberFormat1_S
format %1
@@
@msgCellNumberFormat1_S
format %1
@@
; for msgCellDimensions, %1=width in points, %2=hight in points of given cell
@msgCellDimensions1_L
Cell dimensions are %1 points wide by %2 points high.
@@
@msgCellDimensions1_S
dimensions %1 by %2
@@
; for msgTitleCellDimensions, %1=width in points, %2=hight in points of given cell
@msgTitleCellDimensions1_L
Ccell dimensions are %1 points wide by %2 points high.
@@
; for msgAreas_L/S, %1=number of noncontiguous ranges (or areas)
@msgAreas1_L
%1 areas
@@
@msgAreas1_S
%1 areas
@@
; for msgXThroughY messages, %1=start of range either as coordinates or cell title,
;%2=end of range either as coordinates or cell title
@msgXThroughY1
 %1 through %2
@@
@msgXThroughYBrlIndicator
 %1:%2
@@
;for msgCategoryAxisTitle1_L, %1=category axis title's caption
@msgCategoryAxisTitle1_L
Category axis: %1
@@
@msgCategoryAxisTitle2_L
 The Category Axis is unlabeled.
@@
@msgCategory1
CATEGORY
@@
;for msgValueAxisTitle1_L, %1=value axis title's caption
@msgValueAxisTitle1_L
Value axis: %1
@@
@msgValueAxisTitle2_L
 The Value Axis is unlabeled.
@@
@msgValue1
value
@@
; for msgChartContainsSeriesDesc_L, %1=number of series and
;%2=series description, eg 5 lines
@msgChartContainsSeriesDesc1_L
the chart contains %1 %2
@@
; for msgSeriesLegend, %1=text of legend of series.
@msgSeriesLegend1
 legend: %1
@@
; for msgSeriesPointCount_L:
;%1=number of points in series
;%2=description of point, eg points, bars, etc.
@msgSeriesPointCount1_L
has %1 %2
@@
; for msgPointCategoryDesc, %1=point description, eg bar, point, etc plus index
;%2=data label,
;%3=category axis title
;%4=category axis reading
@msgPointCategoryDesc1
%1 %2 %3=%4
@@
; for msgPointValueDesc, %1=value axis title, %2=value axis reading
@msgPointValueDesc1
%1=%2
@@
; for msgContributesPercentage, %1=percentage contributed to chart unit,
;eg in a pie chart segment, value may contribute 30%
@msgContributesPercentage1
contributes %1 percent
@@
; when grouping a set of points with the same value axis reading,
;we say point x through y has value z
; ie we read the first category axis title and reading, the first value axis
;title and reading, followed by through, followed by the last point's category
;axis title and reading and value axis title and reading.
@msgThrough1
through
@@
; for msgChartDescription_L, %1=chart description
;note extra blank line
@msgChartDescription1_L
Description: %1

@@
; singular and plural descriptions for series of points
; for singular descriptions, %1 is the number of the item, eg line 1, point 10, etc
@msgLineSingular1
line %1
@@
@msgLinePlural1
lines
@@
@msgPointSingular1
point %1
@@
@msgPointPlural1
points
@@
@msgSetOfHorizBars1
distinct sets of horizontal bars
@@
@msgSetSingular1
set %1
@@
@msgBarSingular1
bar %1
@@
@msgBarPlural1
bars
@@
@msgSetOfVertColumns1
distinct sets of vertical columns
@@
@msgColumnSingular1
Column %1
@@
@msgColumnPlural1
Columns
@@
@msgSeriesSingular1
series %1
@@
@msgSeriesPlural1
series
@@
@msgSliceSingular1
slice %1
@@
@msgSlicePlural1
slices
@@
@msgSetOfSlices1
distinct sets of slices
@@
@msgBack1_L
Back
@@
@msgReadFirstAndLastCellInSelection1_L
Read First and Last Cell
@@
@msgReadSelectedRange1_L
Read All Cells
@@
@msgDetectCellNumberFormatChangeOff1_L
Off
@@
@msgDetectCellNumberFormatChangeOn1_L
On
@@
@msgDetectCellBorderChangeOff1_L
Off
@@
@msgDetectCellBorderChangeOn1_L
On
@@
@msgBrlModeCell
Active Cell
@@
@msgBrlModeRow
Current Row
@@
@msgBrlModeColumn
Current Column
@@
;for msgFileAssocExact/BestMatch, %1=workbook JSI in use.
@msgFileAssocExact
Exact Match %1
@@
@msgAssocBestMatch
Best Match %1
@@
@msgAssocNewMatch
New JSI file
@@
@msgNOSettings
No Settings
@@
@msgAppSettingsSaved1_L
Application Settings saved
@@
@msgDocSettingsSaved1_L
Workbook Settings saved
@@
@msgDocSettingsSaved1_S
Workbook Settings saved
@@
;*** the following messages are for announcing saving of worksheet and region settings,
;new with use of collections in Excel refactor.
@msgSheetSettingsSaved
Worksheet settings saved
@@
@msgRegionSettingsSaved
Region settings saved
@@
@msgSheetSettingsNotSaved
Worksheet settings not saved
@@
@msgRegionSettingsNotSaved
Region settings not saved
@@
@msgAppSettingsNotSaved1_L
Application Settings were not saved
@@
@msgDocSettingsNotSaved1_L
Workbook Settings were not saved
@@
@msgDocSettingsNotSaved1_S
Workbook Settings not saved
@@
@msgTotalColumnAndRowSettingsSaved
Total Column and Row Settings saved
@@
@msgTotalColumnAndRowSettingsNotSaved
Total Column and Row Settings not saved
@@
; Number formats:
@msgFormatGeneral1_L
general
@@
; for msgFormatAccounting_L, %1=number of decimal places
@msgFormatAccounting1_L
accounting
%1 decimal places
@@
;for msgFormatNumber1_L, %1=number of decimal places
@msgFormatNumber1_L
number
%1 decimal places
@@
@msgFormatPercent1_L
percentage
@@
; for msgFormatCurrency_L, %1=number of decimal places
@msgFormatCurrency1_L
currency
%1 decimal places
@@
; for msgFormatScientific, %1=number of decimal places
@msgFormatScientific1_L
scientific
%1
@@
@msgFormatText1_L
text
@@
@msgFormatFraction1_L
fraction
@@
; for msgFormatDate, %1=format of date
@msgFormatDate1_L
date
%1
@@
; for msgFormatTime_L, %1=format of the time, eg HHMMSS etc
@msgFormatTime1_L
time
%1
@@
@msgFormatCustom1_L
custom
@@
; shape types
@msgShapeType1_L
Button Control
@@
@msgShapeType2_L
CheckBox
@@
@msgShapeType3_L
Dropdown
@@
@msgShapeType4_L
Edit Box
@@
@msgShapeType5_L
Group Box
@@
@msgShapeType6_L
Label
@@
@msgShapeType7_L
List Box
@@
@msgShapeType8_L
Option Button
@@
@msgShapeType9_L
Scroll Bar
@@
@msgShapeType10_L
Spinner
@@
@msg1_L
selected entire row
@@
@msg2_L
Selected entire column
@@
@msg3_L
First cell
@@
@msg4_L
Last Cell
@@
@msg5_L
type in the formula and press enter
@@
@msg5_S
enter formula
@@
@msg6_L
Inserted date
@@
@msg6_S
date
@@
@msg7_L
Inserted time
@@
@msg7_S
time
@@
@msg8_L
Moved left one screen
@@
@msg9_L
Moved right one screen
@@
@msg10_L
press any arrow key to move to end of data in current row or column
@@
@msg10_S
press arrow key to move to end of data
@@
@msgSelectedRange
selected range
@@
@msgFirstCellInCurrentDataRegion
First cell in current data region
@@
@msgLastCellInCurrentDataRegion
Last cell in current data region
@@
@msgEdgeOfCurrentDataRegion
edge of current data region
@@
@msg13_L
Selection collapsed to active cell
@@
@msg13_S
collapsed
@@
@msg15_L
Not in spell checker
@@
@msg16_L
Cross hair cursor
@@
@msg17_L
Type in the range to Sum using colon to separate or
Press enter to accept default range
@@
@msgHasFormula
has formula
@@
@msgNoHorizontalOrVerticalPagebreaks
no horizontal or vertical page breaks.
@@
@msg23_L
single underline
@@
@msg24_L
single accounting underline
@@
@msg25_L
double underline
@@
@msg26_L
double accounting underline
@@
@msg27_L
strike through
@@
@msg28_L
subscript
@@
@msg29_L
superscript
@@
@msg33_L
Distributed
@@
@msg35_L
Centered across selection
@@
@msg36_L
Filled
@@
@msg37_L
General
@@
; extras for vertical alignment
@msg38_L
Bottom
@@
@msg39_L
Top
@@
;msg40_L applies to Excel versions prior to O365,
;msg40_O365_L applies to Excel O365.
;The message is spoken when you use the script to read comment on a cell where there is no comment.
@msg40_L
No comment visible for this cell.
@@
@msg40_O365_L
No note or comment visible for this cell.
@@
@msg41_L
has comment
@@
@msg42_L
has hyperlink
@@
@msg43_L
no hyperlink associated with this cell.
@@
; border line style constants from object browser
@msg45_L
Continuous
@@
@msg46_L
Dash
@@
@msg47_L
Dash Dot
@@
@msg48_L
Dash Dot Dot
@@
@msg49_L
Dot
@@
@msg50_L
Double
@@
@msg51_L
Grid Line
@@
@msg52_L
Slant Dash Dot
@@
; border weight constants from object browser
@msg53_L
Hairline
@@
@msg54_L
Medium
@@
@msg55_L
Thick
@@
@msg56_L
Thin
@@
; For next few messages describing border positions:
; %1 is the border color
; %2 is the border weight
; %3 is the border line type
@msg57_L
%1 %2 %3 Diagonal Down
@@
@msg58_L
%1 %2 %3 Diagonal Up
@@
@msg59_L
%1 %2 %3 Bottom Edge
@@
@msg60_L
%1 %2 %3 Left Edge
@@
@msg61_L
%1 %2 %3 Right Edge
@@
@msg62_L
%1 %2 %3 Top Edge
@@
@msg63_L
%1 %2 %3 Inside Horizontal
@@
@msg64_L
%1 %2 %3 Inside Vertical
@@
;msgCellBorderGroup messages are used in
;Excel active border description messages
;%1 is the border color
;%2 is the border weight
;%3 is the border line type
@msgCellBordersGroupNone
There are no borders surrounding the active cell.
@@
@msgCellBordersGroupAll
%1 %2 %3 surrounding Border of active cell.
@@
@msgCellBorderGroupTopBottom
%1 %2 %3 top and bottom borders of active cell.
@@
@msgCellBorderGroupTopBottomLeft
%1 %2 %3 left, top and bottom borders of active cell.
@@
@msgCellBorderGroupTopBottomRight
%1 %2 %3 right, top and bottom borders of active cell.
@@
@msgCellBorderGroupLeftRight
%1 %2 %3 left and right borders of active cell.
@@
@msgCellBorderGroupLeftRightTop
%1 %2 %3 top, left and right borders of active cell.
@@
@msgCellBorderGroupLeftRightBottom
%1 %2 %3 bottom, left and right borders of active cell.
@@
@msgCellBorderGroupTopLeft
%1 %2 %3 top and left borders of active cell.
@@
@msgCellBorderGroupTopRight
%1 %2 %3 top and right borders of active cell.
@@
@msgCellBorderGroupBottomLeft
%1 %2 %3 bottom and left borders of active cell.
@@
@msgCellBorderGroupBottomRight
%1 %2 %3 bottom and right borders of active cell.
@@
;for msg66_L, %1=row number
@msg66_L
Row %1
@@
;for msg67_L, %1=column letter(s)
@msg67_L
Col %1
@@
@msg68_L
No cells with data in current row.
@@
@msg68_S
No cells
@@
@msg69_L
No cells with data in current column.
@@
;msgNoComments is the message spoken when you run the script to list all cells with comments on a spreadsheet where there are no comments.
;This message is for Excel versions prior to O365.
@msgNoComments
No cells with comments visible in active window.
@@
;msgNoNotes is the message spoken when you run the script to list all cells with notes on a spreadsheet where there are no notes.
;This message is for Excel versions O365, where Microsoft has renamed non-threaded comments to notes.
@msgNoNotes
No cells with notes visible in active window.
@@
;msgCellsWithComments and msgCellsWithNotes is the dialog title for the script to list cells with comment or list cells with notes.
;List cells with comments applies to Excel versions prior to O365,
;list cells with notes applies to Excel O365.
@msgCellsWithComments
Cells with Comments
@@
@msgCellsWithNotes
Cells with Notes
@@
@msgNoFormulas
No cells with formulas in current worksheet.
@@
@msgCellsWithFormulas
Cells with Formulas
@@
@msgPleaseWait
Please wait
@@
@msg73_L
no cells with data visible in active window.
@@
@msg74_L
Cells with Data
@@
@msg75_L
Gridlines are off
@@
@msg76_L
Gridlines are on
@@
@msg77_L
No visible range in active window.
@@
@msg80_L
Cells at PageBreaks
@@
@msg81_L
Collecting cells at PageBreaks.
@@
@msg82_L
Select an object
@@
@msg83_L
Please wait, collecting objects.
@@
@msg83_S
Please wait, collecting objects.
@@
@msg84_L
Worksheet contains no objects.
@@
@msg84_S
Worksheet contains no objects.
@@
@msgNoLinks_l
No hyperlinks on worksheet.
@@
@msgNoLinks_S
No hyperlinks
@@
@msgSelectLinks
Select Hyperlink
@@
@msgLinkSelected
Hyperlink selected.
@@
@msgCollectingLinks_L
Please wait, collecting hyperlinks.
@@
@msgCollectingLinks_S
Collecting hyperlinks.
@@
; autoshape descriptions:
@msg92_L
16 point star
@@
@msg93_L
24 point star
@@
@msg94_L
32 point star
@@
@msg95_L
4 point star
@@
@msg96_L
5 point star
@@
@msg97_L
8 point star
@@
@msg98_L
action Button back or previous
@@
@msg99_L
action button beginning
@@
@msg100_L
action button custom
@@
@msg101_L
action button document
@@
@msg102_L
action button end
@@
@msg103_L
action button forward or next
@@
@msg104_L
action button help
@@
@msg105_L
action button home
@@
@msg106_L
action button information
@@
@msg107_L
action button movie
@@
@msg108_L
action button return
@@

@msg109_L
action button sound
@@
@msg110_L
arc
@@
@msg111_L
balloon
@@
@msg112_L
bent arrow
@@
@msg113_L
bent up arrow
@@
@msg114_L
bevel
@@
@msg115_L
block arc
@@
@msg116_L
can
@@
@msg117_L
chevron
@@
@msg118_L
circular arrow
@@
@msg119_L
cloud callout
@@
@msg120_L
cross
@@
@msg121_L
cube
@@
@msg122_L
curved down arrow
@@
@msg123_L
curved down ribbon
@@
@msg124_L
curved left arrow
@@
@msg125_L
curved right arrow
@@
@msg126_L
curved up arrow
@@
@msg127_L
curved up ribbon
@@
@msg128_L
diamond
@@
@msg129_L
donut
@@
@msg130_L
double brace
@@
@msg131_L
double bracket
@@
@msg132_L
double wave
@@
@msg133_L
down arrow
@@
@msg134_L
down arrow callout
@@
@msg135_L
down ribbon
@@
@msg136_L
explosion 1
@@
@msg137_L
explosion 2
@@
@msg138_L
flowchart alternate process
@@
@msg139_L
flowchart card
@@
@msg140_L
flowchart collate
@@
@msg141_L
flowchart connector
@@
@msg142_L
flowchart data
@@
@msg143_L
flowchart decision
@@
@msg144_L
flowchart delay
@@
@msg145_L
flowchart direct access storage
@@
@msg146_L
flowchart display
@@
@msg147_L
flowchart document
@@
@msg148_L
flowchart extract
@@
@msg149_L
flowchart internal storage
@@
@msg150_L
flowchart magnetic disk
@@
@msg151_L
flowchart manual input
@@
@msg152_L
flowchart manual operation
@@
@msg153_L
flowchart merge
@@
@msg154_L
flowchart multi document
@@
@msg155_L
flowchart off page connector
@@
@msg156_L
flowchart or
@@
@msg157_L
flowchart predefined process
@@
@msg158_L
flowchart preparation
@@
@msg159_L
flowchart process
@@
@msg160_L
flowchart punched tape
@@
@msg161_L
flowchart sequential access storage
@@
@msg162_L
flowchart sort
@@
@msg163_L
flowchart stored data
@@
@msg164_L
flowchart summing junction
@@
@msg165_L
flowchart terminator
@@
@msg166_L
folded corner
@@
@msg167_L
heart
@@
@msg168_L
hexagon
@@
@msg169_L
horizontal scroll
@@
@msg170_L
isosceles triangle
@@
@msg171_L
left arrow
@@
@msg172_L
left arrow callout
@@
@msg173_L
left brace
@@
@msg174_L
left bracket
@@
@msg175_L
left right arrow
@@
@msg176_L
left right arrow callout
@@
@msg177_L
left right up arrow
@@
@msg178_L
left up arrow
@@
@msg179_L
lightning bolt
@@
@msg180_L
line callout 1
@@
@msg181_L
line callout 1 accent bar
@@
@msg182_L
line callout 1 border and accent bar
@@
@msg183_L
line callout 1 no border
@@
@msg184_L
line callout 2
@@
@msg185_L
line callout 2 accent bar
@@
@msg186_L
line callout 2 border and accent bar
@@
@msg187_L
line callout 2 no border
@@
@msg188_L
line callout 3
@@
@msg189_L
line callout 3 accent bar
@@
@msg190_L
line callout 3 border and accent bar
@@
@msg191_L
line callout 3 no border
@@
@msg192_L
line callout 4
@@
@msg193_L
line callout 4 accent bar
@@
@msg194_L
line callout4 border and accent bar
@@
@msg195_L
line callout 4 no border
@@
@msg196_L
moon
@@
@msg197_L
no symbol
@@
@msg198_L
notched right arrow
@@
@msg199_L
not primitive
@@
@msg200_L
octagon
@@
@msg201_L
oval
@@
@msg202_L
oval callout
@@
@msg203_L
parallelogram
@@
@msg204_L
pentagon
@@
@msg205_L
plaque
@@
@msg206_L
quad arrow
@@
@msg207_L
quad arrow callout
@@
@msg208_L
rectangle
@@
@msg209_L
rectangular callout
@@
@msg210_L
regular pentagon
@@
@msg211_L
right arrow
@@
@msg212_L
right arrow callout
@@
@msg213_L
right brace
@@
@msg214_L
right bracket
@@
@msg215_L
right triangle
@@
@msg216_L
rounded rectangle
@@
@msg217_L
rounded rectangular callout
@@
@msg218_L
smiley face
@@
@msg219_L
striped right arrow
@@
@msg220_L
sun
@@
@msg221_L
trapezoid
@@
@msg222_L
up arrow
@@
@msg223_L
up arrow callout
@@
@msg224_L
up down arrow
@@
@msg225_L
up down arrow callout
@@
@msg226_L
up ribbon
@@
@msg227_L
uTurn arrow
@@
@msg228_L
vertical scroll
@@
@msg229_L
wave
@@
; end of autoshape descriptions.
; non autoshape descriptions
@msg230_L
callout
@@
@msg232_L
embedded OLE object
@@
@msg233_L
freeform
@@
@msg234_L
group
@@
@msg235_L
line
@@
@msg236_L
linked OLE object
@@
@msg237_L
linked picture
@@
@msg238_L
OLE control object
@@
@msg239_L
picture
@@
@msg240_L
text box
@@
@msg241_L
Excel 97 Chart
@@
@msg242_L
Ms Graph 97 Chart
@@
@msg243_L
Bitmap Picture
@@
@msg244_L
Ms Clipart
@@
@msg245_L
Word 97 Document
@@
@msg246_L
Powerpoint 97 Presentation
@@
@msg247_L
Powerpoint 97 Slide
@@
@msg248_L
Content Only
@@
@msg249_L
Content + Coordinates
@@
@msg250_L
Single (%1)
@@
@msg251_L
Multiple - Current is %1
@@
@msg252_L
Off
@@
@msg253_L
Read Column Titles
@@
@msg254_L
Read Row Titles
@@
@msg255_L
Read Both Titles
@@
@msg256_L
no totals column defined and I cannot find a sum formula in the current row.
@@
@msg257_L
no totals row defined and I cannot find a sum formula in the current column.
@@
@msg258_L
Cleared
@@
; chart type strings
@msg259_L
Area with a 3-D visual effect.
@@
@msg260_L
Stacked area with a 3-D visual effect.
@@
@msg261_L
100% stacked area with a 3-D visual effect.
@@
@msg262_L
Clustered bar with a 3-D visual effect.
@@
@msg263_L
Stacked bar with a 3-D visual effect.
@@
@msg264_L
100% stacked bar with a 3-D visual effect.
@@
@msg265_L
3-D Column. Compares values across categories and across series.
@@
@msg266_L
Clustered column with a 3-D visual effect.
@@
@msg267_L
Stacked column with a 3-D visual effect.
@@
@msg268_L
100% stacked column with a 3-D visual effect.
@@
@msg269_L
3-D Line. Line with a 3-D visual effect.
@@
@msg270_L
Pie with a 3-D visual effect.
@@
@msg271_L
Exploded pie with a 3-D visual effect.
@@
@msg272_L
Area. Displays the trend of values over time or categories.
@@
@msg273_L
Stacked Area. Displays the trend of the contribution of each value over time or categories.
@@
@msg274_L
100% Stacked Area. Displays the trend of the percentage each value contributes over time or categories.
@@
@msg275_L
Clustered Bar. Compares values across categories.
@@
@msg276_L
Bar of Pie. Pie with user-defined values extracted and combined into a stacked bar.
@@
@msg277_L
Stacked Bar. Compares the contribution of each value to a total across categories.
@@
@msg278_L
100% Stacked Bar. Compares the percentage each value contributes to a total across categories.
@@
@msg279_L
Bubble. Compares sets of 3 values. Like a scatter chart with the third value displayed as the size of the bubble marker.
@@
@msg280_L
Bubble with a 3-D visual effect.
@@
@msg281_L
Clustered Column. Compares values across categories.
@@
@msg282_L
Stacked Column. Compares the contribution of each value to a total across categories.
@@
@msg283_L
100% Stacked Column. Compares the percentage each value contributes to a total across categories.
@@
@msg284_L
Bar with a conical shape.
@@
@msg285_L
Stacked bar with a conical shape.
@@
@msg286_L
100% Stacked bar with a conical shape.
@@
@msg287_L
3-D Column with a conical shape.
@@
@msg288_L
Column with a conical shape.
@@
@msg289_L
Stacked column with a conical shape.
@@
@msg290_L
100% Stacked column with a conical shape.
@@
@msg291_L
Bar with a cylindrical shape.
@@
@msg292_L
Stacked bar with a cylindrical shape.
@@
@msg293_L
100% Stacked bar with a cylindrical shape.
@@
@msg294_L
Column with a cylindrical shape.
@@
@msg295_L
3-D Column with a cylindrical shape.
@@
@msg296_L
Stacked column with a cylindrical shape.
@@
@msg297_L
100% Stacked column with a cylindrical shape.
@@
@msg298_L
Doughnut. Like a pie chart, but can contain multiple series.
@@
@msg299_L
Exploded Doughnut. Like an exploded pie chart, but can contain multiple series.
@@
@msg300_L
Line. Displays trend over time or categories.
@@
@msg301_L
Line with markers displayed at each data value.
@@
@msg302_L
Stacked line with markers displayed at each data value.
@@
@msg303_L
100% Stacked Line with markers displayed at each data value.
@@
@msg304_L
Stacked Line. Displays the trend of the contribution of each value over time or categories.
@@
@msg305_L
100% Stacked Line. Displays the trend of the percentage each value contributes over time or categories.
@@
@msg306_L
Pie. Displays the contribution of each value to a total.
@@
@msg307_L
Exploded Pie. Displays the contribution of each value to a total while emphasizes individual values.
@@
@msg308_L
Pie of Pie. Pie with user-defined values extracted and combined into a second pie.
@@
@msg309_L
Bar with a pyramid shape.
@@
@msg310_L
Stacked bar with a pyramid shape.
@@
@msg311_L
100% Stacked bar with a pyramid shape.
@@
@msg312_L
3-D Column with a pyramid shape	.
@@
@msg313_L
Column with a pyramid shape.
@@
@msg314_L
Stacked column with a pyramid shape.
@@
@msg315_L
100% Stacked column with a pyramid shape.
@@
@msg316_L
Radar. Displays changes in values relative to a center point.
@@
@msg317_L
Filled Radar. Radar with the area covered by a data series filled with a color.
@@
@msg318_L
Radar with markers at each data point.
@@
@msg319_L
Stock High-Low-Close. Requires three series of values in this order.
@@
@msg320_L
Stock Open-High-Low-Close. Requires four series of values in this order.
@@
@msg321_L
Stock Volume-High-Low-Close. Requires four series of values in this order.
@@
@msg322_L
Stock Volume-Open-High-Low-Close. Requires five series of values in this order.
@@
@msg323_L
3-D Surface. Shows trends in values across two dimensions in a continuous curve.
@@
@msg324_L
Contour. Surface chart viewed from above. Colors represent ranges of values.
@@
@msg325_L
Wireframe Contour. Contour chart without color.
@@
@msg326_L
Wireframe 3-D Surface. 3-D surface chart without color.
@@
@msg327_L
Scatter. Compares pairs of values.
@@
@msg328_L
Scatter with data points connected by lines.
@@
@msg329_L
Scatter with data points connected by lines without markers.
@@
@msg330_L
Scatter with data points connected by smoothed Lines.
@@
@msg331_L
Scatter with data points connected by smoothed Lines without markers.
@@
; end of chart types
@msg332_L
No chart active.
@@
@msgNoWorksheets
No worksheets
@@
@msgMoveToWorksheet
Move to Worksheet
@@
@msgNoRowTitle
no row title
@@
@msgNoColumnTitle
no column title
@@
; color descriptions from object browser:
@msg338_L
Aqua
@@
; we don't actually report this one
; we don't actually report this one
@msg339_L
Black
@@
@msg340_L
Blue
@@
@msg341_L
BlueGray
@@
@msg342_L
BrightGreen
@@
@msg343_L
Brown
@@
@msg344_L
DarkBlue
@@
@msg345_L
DarkGreen
@@
@msg346_L
DarkRed
@@
@msg347_L
DarkTeal
@@
@msg348_L
DarkYellow
@@
@msg349_L
Gold
@@
@msg350_L
Gray05
@@
@msg351_L
Gray10
@@
@msg352_L
Gray125
@@
@msg353_L
Gray15
@@
@msg354_L
Gray20
@@
@msg355_L
Gray25
@@
@msg356_L
Gray30
@@
@msg357_L
Gray35
@@
@msg358_L
Gray375
@@
@msg359_L
Gray40
@@
@msg360_L
Gray45
@@
@msg361_L
Gray50
@@
@msg362_L
Gray55
@@
@msg363_L
Gray60
@@
@msg364_L
Gray625
@@
@msg365_L
Gray65
@@
@msg366_L
Gray70
@@
@msg367_L
Gray75
@@
@msg368_L
Gray80
@@
@msg369_L
Gray85
@@
@msg370_L
Gray875
@@
@msg371_L
Gray90
@@
@msg372_L
Gray95
@@
@msg373_L
Green
@@
@msg374_L
Indigo
@@
@msg375_L
Lavender
@@
@msg376_L
LightBlue
@@
@msg377_L
LightGreen
@@
@msg378_L
LightOrange
@@
@msg379_L
LightTurquoise
@@
@msg380_L
LightYellow
@@
@msg381_L
Lime
@@
@msg382_L
OliveGreen
@@
@msg383_L
Orange
@@
@msg384_L
PaleBlue
@@
@msg385_L
Pink
@@
@msg386_L
Plum
@@
@msg387_L
Red
@@
@msg388_L
Rose
@@
@msg389_L
SeaGreen
@@
@msg390_L
SkyBlue
@@
@msg391_L
Tan
@@
@msg392_L
Teal
@@
@msg393_L
Turquoise
@@
@msg394_L
Violet
@@
@msg395_L
White
@@
@msg396_L
Yellow
@@
@msg397_l
periwinkle
@@
; for msgXl2010Color messages,
; this appears like duplication but the new colors are different RGB values, so someone may wish to change the definitions.
; The rgb values are different enough that they must look different also.
@msgxl2010ColorPurple
purple
@@
@msgxl2010ColorDarkBlue
dark blue
@@
@msgxl2010ColorBlue
blue
@@
@msgxl2010ColorLiteBlue
light blue
@@
@msgxl2010ColorGreen
green
@@
@msgxl2010ColorLiteGreen
light green
@@
@msgxl2010ColorOrange
orange
@@
@msgxl2010ColorDarkRed
dark red
@@
;this indicates a blank cell in Braille
@msgBrlBlankCell
-
@@
; for Selection delimiter in Braille
@msgBrlDelim
-
@@
@msgSelectingChartTitle
Selecting chart title
@@
@msgSelectingCategoryAxisTitle
Selecting category axis chart title
@@
@msgSelectingValueAxisTitle
Selecting value axis chart title
@@
@msgSheetIsChartOnly
This sheet contains only the chart.
@@
@msgPriorSheetLink
Prior Sheet
@@
@msgNextSheetLink
Next Sheet
@@
@msgTitleRestrictionOff
Any Data Cell
@@
@msgTitleRestrictionOn
Cells Right and Below
@@
;%1=sheet name
@msgHiddenSheet
%1 hidden
@@
@msgExcel11ScriptKeyHelp
For Excel 2003:
If F1 is pressed for Help, press F6 to move between the Task Pane and the main spreadsheet window.

For Excel 2007 and later:
If F1 is pressed for Help, press Alt+Tab to move between the Help window and the document window. Close the Help window by pressing Alt+F4 to return focus to the document window.
@@
; for validation message types:
@msgInputMessage
input message
@@
@msgBrlInputMessage
inp msg
@@
@msgValidateDropDown
has drop down
@@
@msgBrlValidateDropdown
drpdn
@@
@msgValidateCustom
custom input
@@
@msgBrlValidateCustom
cus inp
@@
@msgValidateDate
date input
@@
@msgBrlValidateDate
dt inp
@@
@msgValidateTime
time input
@@
@msgBrlValidateTime
tm inp
@@
@msgValidateTextLength
text length input
@@
@msgBrlValidateTextLength
txtlen inp
@@
@msgValidateDecimal
decimal input
@@
@msgBrlValidateDecimal
dec inp
@@
@msgValidateWholeNumber
whole number input
@@
@msgBrlValidateNumber
num inp
@@
@msgBrlInputMessageNotShown
inp
@@
@msgInputMessageError_l
This cell has no input message.
@@
@msgInputMessageError_s
no input message
@@
; for the address of the cell being edited, %1 is the  address of the active cell, and %2 is the workbook and worksheet name.
@msgEditedCellCoord_l
The cell being edited is %1 in %2.
@@
@msgEditedCellCoord_s
Edited cell %1 in %2
@@
@msgMergedCells
merged cells
@@
@msgNamedTitlesApp
On for All Files
@@
@msgNamedTitlesFile
On for the Current File
@@
@msgScreenSensitiveHelpDropdown
This cell has a dropdown list. Press ALT+DOWNARROW to open the list of values. Select a value with the arrow keys. Then press Enter to insert it into the cell.
@@
@msgDropdownTutorHelp
Press ALT+DOWNARROW to view the message. Press Enter to return to normal cell navigation.
@@
@msgScreenSensitiveHelpInputOnly
This is an input message cell. Type any characters and press Enter to insert them into the cell.
@@
@msgInputOnlyTutorHelp
Type in any characters and press Enter.
@@
@msgScreenSensitiveHelpInputValidValue
This is an input cell. Type in one of the expected values designated by the input type and press Enter to insert it into the cell.
@@
@msgInputValidValueTutorHelp
Type one of the expected values and press Enter.
@@
@msgScreenSensitiveHelpInputCustom
This is an input cell. Type in a valid formula and ppress Enter to insert it into the cell.
@@
@msgInputCustomTutorHelp
Type in a valid formula and press Enter.
@@
@msgActiveJSIFileName_l
The current settings file name is %1.
@@
@msgActiveJSIFileName_s
settings file name %1
@@
@msgNoWorkbookSettings
There are no custom %product% settings for this workbook, worksheet or region.
@@
; for msgTextCroppedRight, %1 is the cell address where the text is cropped.
@msgTextCroppedRight
cropped right at %1
@@
; for msgTextCroppedLeft, %1 is the cell address where the text is cropped.
@msgTextCroppedLeft
cropped left at %1
@@
; for msgTextOverlapRight, %1 is the cell address of the last cell where the text is overlapping.
@msgTextOverlapRight
overlaps right near %1
@@
; for msgCellTextOverlapLeft, %1 is the cell address of the last cell where the text is overlapping.
@msgTextOverlapLeft
overlaps left near %1
@@
; for msgCustomSummaryTitle, %1 is the name of the active workbook.
@msgCustomSummaryTitle
Summary for workbook: %1
@@
; for msgCustomSummary, %1 is the active worksheet name.
@msgCustomSummary
Summary for worksheet: %1
@@
@msgCustomSummaryBuffExit
Press Enter on a link to return to the worksheet at the cell indicated by the link. If the link refers to a group of cells, pressing Enter returns to the worksheet at the first cell in the group.
Press Esc to close this summary and return to the worksheet at the last active cell.
@@
; for msgNoSummary_l and msgNOSummary_s, %1 is the active worksheet name, and %2 is the current workbook.
@msgNOSummary_l
There is no summary defined for %1 or any other worksheet in %2.
@@
@msgNoSummary_s
no summary for %1, or any other worksheet in %2
@@
; for msgCustomLabel, %1 is the custom label and address of the cell ro for the range of cells,
; %2 is the sheet name, and %3 is the address itself.
@msgCustomLabel
%1: %2 %3
@@
@msgCustomSummaryNotAvailable_l
A custom summary is not available in this view. Deactivate  chart view to see the custom summary for this worksheet.
@@
@msgCustomSummaryNotAvailable_s
Custom summary not available. Deactivate chart view.
@@
@msgHasCustomSummary_l
has custom summary
@@
@msgHasCustomSummary_s
has summary
@@
@msgMoveByWorksheetInFormulaHlp_l
Press arrows to select cells, or type an operator and then arrows to select cells in a different worksheet from where the cell is being edited.
@@
@msgMoveByWorksheetInFormulaHlp_s
Press arrows to select cells, or type an operator, then arrows to select cells.
@@
@msgCellValue
Type: Cell Value
@@
@msgExpression
Type: Expression
@@
; for next few messages, relating to the validation options for data validation,or for format conditions, %1 is the first allowed value and %2 is the second allowed value.
@msgBetween
between %1 and %2
@@
@msgNotBetween
not between %1 and %2
@@
@msgEqual
equal to %1
@@
@msgNotEqual
not equal to %1
@@
@msgGreater
greater than %1
@@
@msgLess
less than %1
@@
@msgGreaterEqual
greater than or equal to %1
@@
@msgLessEqual
less than or equal to %1
@@
@msgScreenSensitiveHelpCustomSummaryListBox
This dialog allows the user to assign and manipulate custom summary labels for the current workbook.

The list view displays all custom summary labels currently assigned to individual cells or groups of cells in the active workbook. The order of the labels determines the order in which they appear in the custom summary. Use the UP and DOWN ARROW keys to select a label. Use the Change Name button to rename the selected label. Use the Move Up and Move Down buttons to move the selected label to a higher or lower position in the list. Use the Remove button to delete the selected label.
@@
@msgScreenSensitiveHelpCustomSummaryAddButton
Choose this button to assign a new custom summary label to the current cell or group of selected cells.
@@
@msgScreenSensitiveHelpCustomSummaryChangeButton
Choose this button to rename the currently selected custom summary label.
@@
@msgScreenSensitiveHelpCustomSummaryMoveUpButton
Choose this button to move the currently selected custom summary label one position higher in the list view. The order of the labels in the list view determines the order in which they appear in the custom summary.
@@
@msgScreenSensitiveHelpCustomSummaryMoveDownButton
Choose this button to move the currently selected custom summary label one position lower in the list view. The order of the labels in the list view determines the order in which they appear in the custom summary.
@@
@msgScreenSensitiveHelpCustomSummaryRemoveButton
Choose this button to delete the currently selected custom summary label.
@@
@msgScreenSensitiveHelpCustomSummaryRemoveAllButton
Choose this button to delete all custom summary labels in the current workbook.
@@
@msgScreenSensitiveHelpCustomSummaryOKButton
Choose this button to close this dialog box and apply your changes.
@@
@msgScreenSensitiveHelpCustomSummaryCancelButton
Choose this button to close this dialog box without applying your changes.
@@
@msgScreenSensitiveHelpCustomSummaryView
This is a custom summary for the current workbook.

Navigate through the summary using standard reading commands.

To move to the cell where a custom summary label is located, press %KeyFor(enter) on the label's link. If a link refers to a group of cells, pressing enter moves to the first cell in the group.

To see a list of links for the custom summary labels in the entire workbook, press %keyFor(SpellCheck). Use the arrow keys to select an item and then press %KeyFor(Enter) to move to its location in the worksheet.

Press Esc to return to the cell in the current worksheet where the active cursor was located before activating the summary.

Press Esc to close this message.

@@
; the following several messages are for describing cell appearance:
@msgWrapText
text wrapped
@@
@msgShrinkToFit
text shrunk to fit
@@
@msgOrientation
rotated %1 degrees
@@
@MSGNormalOrientation
normal orientation
@@
@msgTitleCellOrientation
cell rotated %1 degrees
@@
; for msgCellWidth %1 is the number of characters the column is wide.
@msgCellWidth
column about %1 characters wide
@@
; for msgCellHeight %1 is the number of characters the row is high.
@msgCellHeight
row about %1 lines high
@@
@msgCellAppearance
Description of cell:

@@
; for msgInvertedNegative, %1 is the color red, %2 is the background color.
@msgInvertedNegative
inverted negative number %1 on %2
@@
; for msgFontColor, %1 is the foreground color and %2 is the background color of the cell's font.
;this color combination may or may not be the same as the text if the text is inverted negative number.
@msgCellFontColor
cell font text color %1
cell font background color %2
@@
; for next several messages, %1 is the foreground color and %2 is the background color.
; for situations where  only  background is desired, %1 is the background color.
@msgPatternNone
%1 foreground %2 background
@@
@msgPatternSolid
%1 solid
@@
@msgPatternAutomatic
automatic
@@
@msgPatternChecker
%1 diagonal crosshatch on %2 background
@@
@msgPatternCrissCross
%1 crosshatch on %2 background
@@
@msgPatternDown
%1 reverse diagonal stripes on %2 background
@@
@msgPatternGray16
12.5% gray on %1 background
@@
@msgPatternGray25
25% gray on %1 background
@@
@msgPatternGray50
50% gray on %1 background
@@
@msgPatternGray75
75% gray on %1 background
@@
@msgPatternGray8
6.25% gray on %1 background
@@
@msgPatternGrid
%1 thin horizontal crosshatch on %2 background
@@
@msgPatternHorizontal
%1 horizontal stripes on %2 background
@@
@msgPatternLightDown
%1 thin reverse diagonal stripes on %2 background
@@
@msgPatternLightHorizontal
%1 thin horizontal stripes on %2 background
@@
@msgPatternLightUp
%1 thin diagonal stripes on %2 background
@@
@msgPatternLightVertical
%1 thin vertical stripes on %2 background
@@
@msgPatternSemiGray75
%1 thick diagonal crosshatch on %2 background
@@
@msgPatternUp
%1 diagonal stripes on %2 background
@@
@msgPatternVertical
%1 vertical stripes on %2 background
@@
@msgSayAllError_l
Say All is not available from a worksheet in Excel.
@@
@msgSayAllError_s
not available from a worksheet
@@
@msgSkimReadError_l
Skim Read is not available from a worksheet in Excel.
@@
@msgSkimReadError_s
not available from a worksheet
@@

@msgCellObscured_l
text is obscured
widen column
@@
@msgCellObscured_s
obscured
widen
@@
@msgExtendedSelectionModeOn_l
extended selection mode on
@@
@msgExtendedSelectionModeOff_l
extended selection mode off
@@
@msgExtendedSelectionModeOn_s
extended on
@@
@msgExtendedSelectionModeOff_s
extended off
@@
@msgAddSelectionModeOn_l
add selected range of cells mode on
@@
@msgAddSelectionModeOff_l
add selected range of cells mode off
@@
@msgAddSelectionModeOn_s
add selected range on
@@
@msgAddSelectionModeOff_s
add selected range off
@@
@msgScreenSensitiveHelpDiagramGallery_L
To navigate the diagram gallery options, use any arrow key.

@@
@msgScreenSensitiveHelpDiagramGallery_s
Use any arrow key to navigate.

@@
;For msgHyperlinkScreenTip, %1 is the message itself.
@msgHyperlinkScreenTip
ScreenTip %1
@@
;for next several messages, %1 is the font color or attribute.
@msgTextColor
%1 text
@@
@msgBackgroundcolor
%1 background
@@
@msgBold
bold
@@
@msgNotBold
not bold
@@
@msgItalic
italic
@@
@msgNotItalic
not italic
@@
@msgUnderline
underline
@@
@msgNotUnderline
not underline
@@
@msgStrikethrough
strike through
@@
@msgNotStrikethrough
not strike through
@@
@msgFontSize
%1 points
@@
@msgComment
Comment
@@
@msgFormatConditions
has format conditions
@@
;for msgWorksheetHasEmbeddedObjects, %1 is the number of embedded objects in the current worksheet.
@msgWorksheetHasEmbeddedObjects
This worksheet has %1 embedded objects.
@@
@msgCustomSummaryLabelsOptionError
Turn on the Custom Summary Labels option in order to use this feature.
@@
@msgAutoFilterModeOn_l
AutoFilter is On.
@@
@msgAutoFilterModeOn_s
Autofilter On.
@@
@msgCustomFilterModeOn_l
Custom Filter is On.
@@
@msgCustomFilterModeOn_s
Custom Filter On.
@@
;for msgFilterDescription, %1 is the number of the filter, %2 is the total number of filters, and %3 is the operator type.
@msgFilterDescription
Filter %1 of %2 is %3.
@@
@msgAnd
And
@@
@msgBottom10Items
Bottom 10 Items
@@
@msgBottom10Percent
Bottom 10 Percent
@@
@msgOr
Or
@@
@msgTop10Items
Top 10 Items
@@
@msgTop10Percent
Top 10 Percent
@@
@msgActiveChartSelected_l
The active chart is selected.
@@
@msgActiveChartSelected_s
active chart selected
@@
@msgNoCharts_l
There are no charts on this worksheet.
@@
@msgNoCharts_s
no charts on worksheet
@@
@msgNotInWorksheetArea_l
You are not on an active worksheet.
@@
@msgNotInWorksheetArea_s
not on an active worksheet
@@
@msgStartOfNewDataRegion
start of new Data Region
@@
@msgF2ToggleTutorHelp
To toggle between edit mode and point mode in this field, press F2.
@@
;for msgMonitorCellReplace, %1 is the existing monitor cell already defined, %2 the cell that would replace it.
@msgMonitorCellReplace
Replace monitor cell %1 with %2?
@@
	@msgMonitorCellAlreadyDefinedWarning
WARNING! This monitor cell is already defined.
@@
@msgCurrentCellAlreadyDefinedAsMonitorCell_l
The current cell is already defined as a monitor cell.
@@
@msgCurrentCellAlreadyDefinedAsMonitorCell_s
current cell already defined
@@
;for msgSelectedTextboxContent, %1 is the textbox number, %2 its content.
@msgSelectedTextboxContent
This is the content of the currently selected textbox:  Number %1

%2
@@
@msgSelectedTextboxBuffExit
When you press ESC to close this message, the textbox will still be selected. Bring up the context menu to format or edit the textbox.
@@
@msgNoTextboxes_l
There are no textboxes on this worksheet.
@@
@msgNoTextboxes_s
no textboxes
@@
; for msgTextboxNum, %1 is the number of textboxes on the worksheet.
@msgTextboxNum
There are %1 textboxes on this worksheet.
@@
@msgTextboxContent
This is the content of the textbox on this worksheet:

%1
@@
@msgTextboxBuffExit
When you press ESC to close this message, the textbox may not be selected. So press CONTROL+SHIFT+o to select a worksheet object.
@@
@msgMultilineCell
multiline cell
@@
@msgFreezePanesWindow
FreezePanes
@@
@msgSplitWindow
Split
@@
;for msgFreezePanesOrSplitWindowView, %1 is the type of window view.
@msgFreezePanesOrSplitWindowView
This worksheet is in a %1 window view.
@@
;for msgFreezePanesOrSplitWindowError_L/s, and msgFreezePanesOrSplitWindowError__O365L/s
;%1 is the type of window view.
;The O365 messages apply to Excel O365, the others apply to versions of Excel prior to O365.
@msgFreezePanesOrSplitWindowError_l
This worksheet is in a %1 window view. To change the view, use the Window menu for Excel prior to 2007, or View ribbon for Excel 2007 or higher. Then press %KeyFor(ListCellsWithComments) again for the list of comments.
@@
@msgFreezePanesOrSplitWindowError_s
%1 window view: Change the view, then press %KeyFor(ListCellsWithComments) again to get the list of comments.
@@
@msgFreezePanesOrSplitWindowError_O365_l
This worksheet is in a %1 window view. To change the view, use the View ribbon. Then press %KeyFor(ListCellsWithNotes) again for the list of notes.
@@
@msgFreezePanesOrSplitWindowError_O365_s
%1 window view: Change the view, then press %KeyFor(ListCellsWithNotes) again to get the list of notes.
@@
;for msgFormControl, %1 is the type of control.
@msgFormControl
%1 form control
@@
; for msgFormControlRange, %1 is the type of control, %2 the top left cell, %3 the bottom right cell of the range.
@msgFormControlRange
%1 control range %2 through %3
@@
; for msgFilterItemOn, %1 is the item number.
@msgFilterItemOn
Filter %1 is on.
@@
;for msgCriteria, %1 is the item number, %2 is criteria1, %3 is the filter operator, and %4 is criteria2.
@msgCriteria
For Filter %1, Criteria 1 is %2, ffiltered as %3, with Criteria 2 as %4.
@@
;For msgCriteria1, %1 is the item number, %2 Criteria 1.
@msgCriteria1
For Filter %1, Criteria 1 is %2, but Criteria 2 is not defined.
@@
;For msgCriteria2, %1 is the item number, %2 Criteria 2.
@msgCriteria2
For Filter %1, Criteria1 is not defined, but Criteria2 is %2.
@@
;next few messages are for print page info:
@msgPrintPageInfo
Printable Pages Information:
@@
@msgPortrait
portrait
@@
@msgLandscape
landscape
@@
;for msghPageBreaks, %1 is the number of full page breaks, %2 partial.
@msgHPageBreaks
%1 horizontal full page breaks, %2 pages for print area.
@@
;for msgVPageBreaks, %1 is the number of full page breaks, %2 partial.
@msgVPageBreaks
%1 vertical full page breaks, %2 pages for print area.
@@
;for msgTotalNumberOfPages, %1 is the number of pages to be printed, %2 the orientation.
@msgTotalNumberOfPages
%1 %2 page(s) can be printed from this worksheet.
@@
; for next few messages, %1 is the content of the header or footer section.
@msgLeftHeader
Left Header: %1
@@
@msgCenterHeader
Center header: %1
@@
@msgRightHeader
Right header: %1
@@
@msgLeftFooter
Left footer: %1
@@
@msgCenterFooter
Center footer: %1
@@
@msgRightFooter
Right footer: %1
@@
@msgHeadersAndFooters
Headers and Footers:
@@
@msgNoHeadersOrFooters
There are no headers or footers for this worksheet.
@@
;following several messages are for format codes of page setup:
@msgDate
current date
@@
@msgTime
current time
@@
@msgFile
current filename
@@
@msgWorkbook
current workbook
@@
@msgPage
current page number
@@
@msgNumberOfPages
total number of pages
@@
;for pagebreak types:
@msgHasPagebreak
%1 pagebreak
@@
@msgBothManualPagebreak
column and row manual
@@
@msgColManualPagebreak
column manual
@@
@msgRowManualPagebreak
row manual
@@
@msgBothAutomaticPagebreak
column and row automatic
@@
@msgColAutomaticPagebreak
column automatic
@@
@msgRowAutomaticPagebreak
row automatic
@@
; for msgPagebreakAtCurrentCell, %1 is the current cell address, %2 the pagebreak type.
@msgPagebreakAtCurrentCell
The current cell, %1, has a %2 pagebreak.
@@
@msgAlreadyDefinedTitlesError
!(This setting is already defined. To set it manually, change the Define Name Titles Override option. )
@@
@msgDefineNameTitlesError
!(Change the Define Name Titles Override option to set the current setting manually.)
@@
@msgAppendToClipboardError_l
This feature is not available in Excel at this time.
@@
@msgAppendToClipboardError_s
not available in Excel
@@
;for msgFilteredNonconsecutiveRowsRange and msgFilteredNonconsecutiveColumnsRange, %1 is the first item in the range, %2 is the last.
@msgFilteredNonconsecutiveRowsRange
Nonconsecutive rows between %1 and %2 are filtered.
@@
@msgFilteredNonconsecutiveColumnsRange
Nonconsecutive columns between %1 and %2 are filtered.
@@
@msgFilteredNonconsecutiveRangeHlp
Press %KeyFor(ScreenSensitiveHelp) for a complete list of filtered items.
@@
; for msgFilteredRowsRange, %1 is the first row, %2 is the last row.
@msgFilteredRowsRange
Rows from %1 to %2 are filtered.
@@
;for msgFilteredColumnsRange, %1 is the first column, and %2 is the last column.
@msgFilteredColumnsRange
Columns from %1 to %2 are filtered.
@@
;for msgScreenSensitiveHlpFilteredRows and msgScreenSensitiveHlpFilteredColumns, %1 is the list of filtered rows or filtered columns respectively.
@msgScreenSensitiveHlpFilteredRows
The following rows are filtered:
%1
@@
@msgScreenSensitiveHlpFilteredColumns
The following columns are filtered:
%1
@@
;for msgScreenSensitiveHlpFilteredRow and msgScreenSensitiveHlpFilteredColumn, %1 is the filtered row or filtered column respectively.
@msgScreenSensitiveHlpFilteredRow
Row %1 is filtered.
@@
@msgScreenSensitiveHlpFilteredColumn
Column %1 is filtered.
@@
;for msgFilteredRow and msgFilteredColumn, %1 is the number of the row or letter(s) of the column being filtered.
@msgFilteredRow
Row %1 is filtered for this column.
@@
@msgFilteredColumn
Column %1 is filtered for this row.
@@
@msgFilteredColumn_l
This column is filtered.
@@
@MsgFilteredRow_l
This row is filtered.
@@
@msgFilteredColumnOrRow
filtered
@@
;for msgPleaseWaitForListOfFormulas _l/s, %1 is thenumber of items being retreived.
@msgPleaseWaitForListOfFormulas_l
There are too many formulas to list at once. Collecting nearest %1 to current active cell.
@@
@msgPleaseWaitForListOfFormulas_s
too many formulas to list at once; collecting nearest %1 to current cell
@@
;For msgHasHyperlinkAtAddress, %1 is the address.
@msgHasHyperlinkAtAddress
has hyperlink pointing to %1
@@
; for msgSetCellMarker, %1=the coordinates of cell to mark.
@msgSetCellMarker
Setting Cell Marker at %1.
@@
;for CellMarkerReplace, %1 is the existing cell already marked, %2 the cell that would replace it.
@msgCellMarkerReplace
Replace Marked Cell %1 with %2?
@@
@msgCurrentCellAlreadyDefinedAsCellMarker
The current cell is already defined as a Cell Marker.
@@
@msgCellMarkerNotFound_l
There is no Cell Marker defined for this sheet.
@@
@msgCellMarkerNotFound_s
no Cell Marker defined for this sheet
@@
@msgNoCellMarkersDefined_l
There are no Cell Markers defined for this workbook.
@@
@msgNoCellMarkersDefined_s
no Cell Markers defined for this workbook
@@
@msgNoMoreCellMarkersDefined_l
There are no more Cell Markers defined for this workbook.
@@
@msgNoMoreCellMarkersDefined_s
no more Cell Markers defined
@@
@msgNoPriorCellMarkersDefined_l
There are no prior Cell Markers defined for this workbook.
@@
@msgNoPriorCellMarkersDefined_s
no prior Cell Markers defined
@@
@msgCellMarkers
List of Cell Markers
@@
;for msgCellMarkerListItem, %1 is the section name minus the CellMarker tag, the sheet name, and %2 is the key value, the cell coordinates of the Cell Marker.
@msgCellMarkerListItem
%1 at Cell Marker %2
@@
;for msgTitleCellStyle, %1 is the cell style name.
@msgTitleCellStyle
%1 style
@@
;for msgStyle, %1 is the cell style name.
@msgStyle
%1 style
@@
;for msgSheetsSelected, %1 is the total count of  sheets selected.
@MsgSheetsSelected
%1 sheets selected
@@
;For msgFilterRowsProcessingError/msgFilterColumnsProcessingError, %1 is the number of items that would be processed.
@msgFilterRowsProcessingError
Processing %1 rows for filtered status would take too long.
@@
@msgFilterColumnsProcessingError
Processing %1 columns for filtered status would take too long.
@@
@msgChartNotActiveError_l
The chart is not active. You must first press %keyFor(SelectActiveChart) to select it.
@@
@msgChartNotActiveError_s
chart not active; first press %keyFor(SelectActiveChart).
@@
;for msgTotalColumnRow, %1=row number.
@msgTotalColumnRow
Row %1
@@
;for msgTotalRowColumn, %1=column number.
@msgTotalRowColumn
Column%1
@@
@msgSortOnCellColor
sort on cell color
@@
@msgSortOnFontColor
sort on font color
@@
@msgSortOnIcon
sort on icon
@@
@msgSortOnValues
sort on values
@@
@msgSortByCOLUMNS
BY COLUMNS
@@
@msgSortByRows
BY ROWS
@@
;for msgSortDescription, %1 is the sort on type, %2 the orientation, and %3 is the range.
@msgSortdescription
autofilter is set to %1 %2 in the cell range %3.
@@
@msgAutoFilterDropDown
Autofilter drop down
@@
;for msgTitleColumnCellInfo/msgTitleRowCellInfo, %1 is all the related description information for the title row or column cell.
@msgTitleColumnCellInfo
Column %1
@@
@msgTitleRowCellInfo
Row %1
@@
;for msgAutoFilterRangeScreenSensitiveHelp, %1 is the first cell in the range, %2 is the last.
@msgAutoFilterRangeScreenSensitiveHelp
The autofilter range is from %1 to %2.
@@
@msgDisplayChartInVirtualViewerHelp_l
To display the chart in the virtual viewer, press %KeyFor(DisplayActiveChartInvirtualViewer);  press Esc to return to the worksheet.
@@
@msgDisplayChartInVirtualViewerHelp_s
display chart in virtual viewer, %KeyFor(DisplayActiveChartInvirtualViewer);  Esc to return to worksheet
@@
@msgChartExitXLXPScreenSensitiveHelp
The selected object is an Excel chart.
Press the Applications Key to display a context menu that provides many options for dealing with charts, such as cut or copy.

To change the formatting properties of the chart, press the Applications Key and then press F to choose Format Object.
To move out of the chart and back into your spreadsheet, press ESC.

To edit the chart object, press the Applications Key, and then O to Edit the chart object. This returns you to the chart itself. But now you can press the Applications key again and all the editing options for objects are available. For example, to change the X- or Y-Axis of the chart, pick Chart Options. This brings up a dialog where you can make changes.

Press Esc to close this message.
@@
@msgHotkeyHelpExcel365
Say a list of some common Excel shortcuts  %KeyFor(WindowKeysHelp)
Say the coordinates of the current cell  %KeyFor(SayActiveCellCoordinates)
Say a cell's formula  %keyFor(sayFormula)
Put the cell's formula in the virtual viewer %keyFor(sayFormula) twice quickly
Say the row title  %keyFor(sayRowTitle)
Say the column title  %keyFor(sayColumnTitle)
Say the row total  %KeyFor(ReadRowTotal)
Say the column total  %KeyFor(readColumnTotal)
Set the Row Titles Range  %KeyFor(setRowTitlesRange)
Set the Column Titles Range  %KeyFor(setColTitlesRange )
Set up to 10 monitor cells for the current worksheet  JAWSKey+Shift+1 through 0 on the number row
Say any of the ten monitor cells for this sheet  Alt+Shift+1 through 0 on the number row
Move to a monitor cell  %KeyFor(moveToMonitorCell)
Return to the last cell which had focus before moving to a monitor Cell  %keyFor(returnToStoredCell)
Set a Cell Marker/Place Marker %KeyFor(DefineATempPlaceMarker)
Select Cells between existing Cell Marker and current cell  %KeyFor(SelectTextBetweenMarkedPlaceAndCurrentPosition)
Review selected cells  %keyFor(saySelectedText)
Move to Cell Marker location in current sheet  %KeyFor(SpeakPlaceMarkers)
Move to next available Cell Marker in a subsequent sheet  %KeyFor(ReturnToNextCellMarker)
Move to previous available Cell  Marker in a prior sheet  %KeyFor(ReturnToPreviousCellMarker)
List all Cell Markers in current book  %KeyFor(ListCellMarkers)
Move to the prior or next worksheet  control+page up or control+page down
Move to a particular worksheet  %KeyFor(moveToWorksheet)
Manage worksheets, such as changing the current sheet name  %KeyFor(ManageWorksheets)
List cells with notes on the current worksheet  %KeyFor(listCellsWithNotes)
Say a cell's note or comment if visible  %KeyFor(ReadCellNoteOrComment)
List cells with formulas  %KeyFor(listCellsWithFormulas)
List cells with data visible in the active window  %KeyFor(ListVisibleCellsWithData)
List cells with data in the current row  %KeyFor(listRow)
List cells with data in the current column  %keyFor(listColumn)
List cells at horizontal and vertical PageBreaks  %KeyFor(ListCellsAtPageBreaks)
Select an object on the worksheet  %KeyFor(SelectWorksheetObjects)
Show the content of a textbox on the worksheet  %KeyFor(ShowTextboxContent)
Select the active chart on the current workshsheet  %KeyFor(SelectActiveChart)
Display the active selected chart in the virtual viewer  %KeyFor(DisplayActiveChartInVirtualViewer).
Select a hyperlink on the worksheet  %KeyFor(SpellCheck)
Say the hyperlink address for a cell containing a hyperlink  %KeyFor(readCellHyperlink)
Describe the border of the active cell  %KeyFor(DescribeCellBorder)
Announce the coordinates of the range of cells visible in the active window  %KeyFor(sayVisibleRangeCoordinates)
Say the status of gridlines in the active window  %KeyFor(reportGridlineStatus)
Show the context of a textbox object  %KeyFor(ShowTextboxContent)
Select Prior worksheet  %KeyFor(SelectPriorSheet)
Select next worksheet  %KeyFor(SelectnextSheet)
Set Quick Settings  %KeyFor(QuickSettings)
@@
@msgHotkeyHelp2_L
Set Quick Settings  %KeyFor(QuickSettings)
Say a list of some common Excel shortcuts  %KeyFor(WindowKeysHelp)
Say the coordinates of the current cell  %KeyFor(SayActiveCellCoordinates)
Say a cell's formula  %keyFor(sayFormula)
Put the cell's formula in the virtual viewer %keyFor(sayFormula) twice quickly
Review selected cells  %keyFor(saySelectedText)
Say the row title  %keyFor(sayRowTitle)
Say the column title  %keyFor(sayColumnTitle)
Say the row total  %KeyFor(ReadRowTotal)
Say the column total  %KeyFor(readColumnTotal)
Set the Row Titles Range  %KeyFor(setRowTitlesRange)
Set the Column Titles Range  %KeyFor(setColTitlesRange )
Set up to 10 monitor cells for the current worksheet  JAWSKey+Shift+1 through 0 on the number row
Say any of the ten monitor cells for this sheet  Alt+Shift+1 through 0 on the number row
Move to a monitor cell  %KeyFor(moveToMonitorCell)
Return to the last cell which had focus before moving to a monitor Cell  %keyFor(returnToStoredCell)
Move to the prior or next worksheet  control+page up or control+page down
Move to a particular worksheet  %KeyFor(moveToWorksheet)
Manage worksheets, such as changing the current sheet name  %KeyFor(ManageWorksheets)
List cells with comments on the current worksheet %KeyFor(listCellsWithComments)
Say a cell's comment if visible  %KeyFor(ReadCellComment)
List cells with formulas  %KeyFor(listCellsWithFormulas)
List cells with data visible in the active window  %KeyFor(ListVisibleCellsWithData)
List cells with data in the current row  %KeyFor(listRow)
List cells with data in the current column  %keyFor(listColumn)
List cells at horizontal and vertical PageBreaks  %KeyFor(ListCellsAtPageBreaks)
Select an object on the worksheet  %KeyFor(SelectWorksheetObjects)
Show the content of a textbox on the worksheet  %KeyFor(ShowTextboxContent)
Select the active chart on the current workshsheet  %KeyFor(SelectActiveChart)
Display the active selected chart in the virtual viewer  %KeyFor(DisplayActiveChartInVirtualViewer).
Select a hyperlink on the worksheet  %KeyFor(SpellCheck)
Say the hyperlink address for a cell containing a hyperlink  %KeyFor(readCellHyperlink)
Describe the border of the active cell  %KeyFor(DescribeCellBorder)
Announce the coordinates of the range of cells visible in the active window  %KeyFor(sayVisibleRangeCoordinates)
Say the status of gridlines in the active window  %KeyFor(reportGridlineStatus)
Show the context of a textbox object  %KeyFor(ShowTextboxContent)
Set a Cell Maarker  %KeyFor(SetCellMarker)
Return to Cell Marker in current sheet  %KeyFor(ReturnToCellMarkerInCurrentSheet)
Return to next available Cell Marker in a subsequent sheet  %KeyFor(ReturnToNextCellMarker)
Return to previous available Cell  Marker in a prior sheet  %KeyFor(ReturnToPreviousCellMarker)
List Cell Markers %KeyFor(ListCellMarkers)
Select Prior worksheet  %KeyFor(SelectPriorSheet)
Select next worksheet  %KeyFor(SelectnextSheet)
@@
@msgHotkeyHelp2_S
Set Quick Settings  %KeyFor(QuickSettings)
Excel shortcuts %KeyFor(WindowKeysHelp)
Coordinates of current cell %KeyFor(SayActiveCellCoordinates)
Speak formula %keyFor(sayFormula)
Put the cell's formula in the virtual viewer %keyFor(sayFormula) twice quickly
Review selected cells %keyFor(saySelectedText)
Row title %keyFor(sayRowTitle)
Column title %keyFor(sayColumnTitle)
Row total %KeyFor(ReadRowTotal)
Column total %KeyFor(readColumnTotal)
Set Row Titles Range  %KeyFor(setRowTitlesRange)
Set Column Titles Range  %KeyFor(setColTitlesRange )
Set up to 10 monitor cells for current worksheet Alt+Control+Shift+1 through 0 on number row
Read monitor cells Alt+Shift+1 through 0 on the number row
Move to monitor cell %KeyFor(moveToMonitorCell)
Return to last cell which had focus before moving to monitor Cell use %keyFor(returnToStoredCell).
Move to prior or next worksheet control+page up or control+page down
Move to worksheet %KeyFor(moveToWorksheet)
Manage worksheets  %KeyFor(ManageWorksheets)
Cells with comments %KeyFor(listCellsWithComments)
Read cell comment %KeyFor(ReadCellComment)
Cells with formulas  %KeyFor(listCellsWithFormulas)
Cells with data %KeyFor(ListVisibleCellsWithData)
Current row or column %KeyFor(listRow) or %keyFor(listColumn)
Horizontal and vertical PageBreaks %KeyFor(ListCellsAtPageBreaks)
Select object %KeyFor(SelectWorksheetObjects)
Select active chart  %KeyFor(SelectActiveChart)
Display active selected chart in virtual viewer  %KeyFor(DisplayChartInVirtualViewer).
Select hyperlink %KeyFor(Spellcheck)
Read cell hyperlink %KeyFor(readCellHyperlink)
Describe cell border %KeyFor(DescribeCellBorder)
Visible range %KeyFor(sayVisibleRangeCoordinates)
Speak gridline status %KeyFor(reportGridlineStatus)
Show context of textbox object  %KeyFor(ShowTextboxContent)
Set a Cell Maarker  %KeyFor(SetCellMarker)
Return to Cell Marker in current sheet  %KeyFor(ReturnToCellMarkerInCurrentSheet)
Return to next available Cell Marker in a subsequent sheet  %KeyFor(ReturnToNextCellMarker)
Return to previous available Cell  Marker in a prior sheet  %KeyFor(ReturnToPreviousCellMarker)
List Cell Markers %KeyFor(ListCellMarkers)
Select Prior worksheet  %KeyFor(SelectPriorSheet)
Select next worksheet  %KeyFor(SelectnextSheet)
@@
@msg2003HotkeyHelp2_L
Set Quick Settings  %KeyFor(QuickSettings)
Say a list of some common Excel shortcuts  %KeyFor(WindowKeysHelp)
Say the coordinates of the current cell  %KeyFor(SayActiveCellCoordinates)
Say a cell's formula  %keyFor(sayFormula)
Put the cell's formula in the virtual viewer %keyFor(sayFormula) twice quickly
Review selected cells  %keyFor(saySelectedText)
Say the row title  %keyFor(sayRowTitle)
Say the column title  %keyFor(sayColumnTitle)
Say the row total  %KeyFor(ReadRowTotal)
Say the column total  %KeyFor(readColumnTotal)
Set the Row Titles Range  %KeyFor(setRowTitlesRange)
Set the Column Titles Range  %KeyFor(setColTitlesRange)
Set up to 10 monitor cells for the current worksheet  JAWSKey+Shift+1 through 0 on the number row
Say any of the ten monitor cells for this sheet  Alt+Shift+1 through 0 on the number row
Move to a monitor cell  %KeyFor(moveToMonitorCell)
Return to the last cell which had focus before moving to a monitor Cell  %keyFor(returnToStoredCell)
Move to the prior or next worksheet  control+page up or control+page down
Move to a particular worksheet  %KeyFor(moveToWorksheet)
List cells with comments on the current worksheet %KeyFor(listCellsWithComments)
Say a cell's comment if visible  %KeyFor(ReadCellComment)
List cells with formulas  %KeyFor(listCellsWithFormulas)
List cells with data visible in the active window  %KeyFor(ListVisibleCellsWithData)
List cells with data in the current row  %KeyFor(listRow)
List cells with data in the current column  %keyFor(listColumn)
List cells at horizontal and vertical PageBreaks  %KeyFor(ListCellsAtPageBreaks)
Select an object on the worksheet  %KeyFor(SelectWorksheetObjects)
Show the content of a textbox on the worksheet  %KeyFor(ShowTextboxContent)
Select the active chart on the current workshsheet  %KeyFor(SelectActiveChart)
Display the active selected chart in the virtual viewer  %KeyFor(DisplayActiveChartInVirtualViewer).
Select a hyperlink on the worksheet  %KeyFor(SpellCheck)
Say the hyperlink address for a cell containing a hyperlink  %KeyFor(readCellHyperlink)
Describe the border of the active cell  %KeyFor(DescribeCellBorder)
Announce the coordinates of the range of cells visible in the active window  %KeyFor(sayVisibleRangeCoordinates)
Say the status of gridlines in the active window  %KeyFor(reportGridlineStatus)
Show the context of a textbox object  %KeyFor(ShowTextboxContent)
Set a Cell Maarker  %KeyFor(SetCellMarker)
Return to Cell Marker in current sheet  %KeyFor(ReturnToCellMarkerInCurrentSheet)
Return to next available Cell Marker in a subsequent sheet  %KeyFor(ReturnToNextCellMarker)
Return to previous available Cell  Marker in a prior sheet  %KeyFor(ReturnToPreviousCellMarker)
List Cell Markers %KeyFor(ListCellMarkers)
Select Prior worksheet  %KeyFor(SelectPriorSheet)
Select next worksheet  %KeyFor(SelectnextSheet)

The table layer commands include extra key commands for Excel. Alt with 1 through 4 reads the first four cells in the column, and Control with 1 through 4 reads the first four cells in the current row.
@@
@msg2003HotkeyHelp2_S
Set Quick Settings  %KeyFor(QuickSettings)
Excel shortcuts %KeyFor(WindowKeysHelp)
Coordinates of current cell %KeyFor(SayActiveCellCoordinates)
Speak formula %keyFor(sayFormula)
Put the cell's formula in the virtual viewer %keyFor(sayFormula) twice quickly
Review selected cells %keyFor(saySelectedText)
Row title %keyFor(sayRowTitle)
Column title %keyFor(sayColumnTitle)
Row total %KeyFor(ReadRowTotal)
Column total %KeyFor(readColumnTotal)
Set Row Titles Range  %KeyFor(setRowTitlesRange)
Set Column Titles Range  %KeyFor(setColTitlesRange )
Set up to 10 monitor cells for current worksheet Alt+Control+Shift+1 through 0 on number row
Read monitor cells Alt+Shift+1 through 0 on the number row
Move to monitor cell %KeyFor(moveToMonitorCell)
Return to last cell which had focus before moving to monitor Cell use %keyFor(returnToStoredCell).
First 4 cells in column alt key with 1 through 4 on the number row
First 4 cells in row alt+control key with 1 through 4 on the number row
Move to prior or next worksheet control+page up or control+page down
Move to worksheet %KeyFor(moveToWorksheet)
Cells with comments %KeyFor(listCellsWithComments)
Read cell comment %KeyFor(ReadCellComment)
Cells with formulas  %KeyFor(listCellsWithFormulas)
Cells with data %KeyFor(ListVisibleCellsWithData)
Current row or column %KeyFor(listRow) or %keyFor(listColumn)
Horizontal and vertical PageBreaks %KeyFor(ListCellsAtPageBreaks)
Select object %KeyFor(SelectWorksheetObjects)
Select active chart  %KeyFor(SelectActiveChart)
Display active selected chart in virtual viewer  %KeyFor(DisplayChartInVirtualViewer).
Select hyperlink %KeyFor(Spellcheck)
Read cell hyperlink %KeyFor(readCellHyperlink)
Describe cell border %KeyFor(DescribeCellBorder)
Visible range %KeyFor(sayVisibleRangeCoordinates)
Speak gridline status %KeyFor(reportGridlineStatus)
Show context of textbox object  %KeyFor(ShowTextboxContent)
Set a Cell Maarker  %KeyFor(SetCellMarker)
Return to Cell Marker in current sheet  %KeyFor(ReturnToCellMarkerInCurrentSheet)
Return to next available Cell Marker in a subsequent sheet  %KeyFor(ReturnToNextCellMarker)
Return to previous available Cell  Marker in a prior sheet  %KeyFor(ReturnToPreviousCellMarker)
List Cell Markers %KeyFor(ListCellMarkers)
Select Prior worksheet  %KeyFor(SelectPriorSheet)
Select next worksheet  %KeyFor(SelectnextSheet)
@@


;UNUSED_VARIABLES

@msgAppStart1_L
For %product% Hotkey Help with Microsoft Excel use %keyFor(hotkeyHelp).
For a list of Excel short cut keys use  %KeyFor(WindowKeysHelp).
To hear the %product% help topic for Microsoft Excel press %keyFor(screenSensitiveHelp) twice quickly.
@@
@msgAppStart1_S
hotkey help use %KeyFor(hotkeyHelp).
Excel shortcut keys use  %KeyFor(WindowKeysHelp).
%product% help topic for Excel %keyFor(screenSensitiveHelp) twice quickly.
@@
@msgScrnSensitiveHlp1_L
This is the Open button. Press Enter to open the selected file or
Press down arrow to access the context menu containing alternative options for opening the file.
Press tab to move to the next control.
@@
@msgScrnSensitiveHlp1_S
Open button.
Enter to open the selected file
down arrow to access the context menu
tab to move to the next control.
@@
;for msgXOfY, %1=current index, %2=count, eg border style list of radio buttons
@msgXOfY1
%1 of %2
@@
@msgTitleCellFont1_S
Title Cell Font and Formatting:
@@
; for msgCellIndentLevel_L/S, %1=indent level
@msgCellIndentLevel1_S
level %1
@@
; for msgTitleCellIndentLevel_L/S, %1=indent level
@msgTitleCellIndentLevel1_S
level %1
@@
; for msgTitleCellDimensions, %1=width in points, %2=hight in points of given cell
@msgTitleCellDimensions1_S
cell dimensions %1 by %2
@@
@msgAutoFilterTitle1
Autofilter
@@
; for msgDestination/SourceFolder1_L, %1=folder name
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
@msgUpOneLevel1_L
Up one level
@@
@msgUpOneLevel1_S
Up one level
@@
@msgBorderPresetNone1_L
preset none
@@
@msgBorderPresetOutline1_L
preset outline
@@
@msgBorderLeft1_L
left border
@@
@msgBorderTop1_L
top border
@@
@msgBorderBottom1_L
bottom border
@@
@msgBorderRight1_L
right border
@@
@msgBorderBackDiag1_L
backward diagonal border
@@
@msgBorderForwardDiag1_L
forward diagonal border
@@
@msgPatternButtonMenu1_L
pattern
@@
@msgPatternColorPalette1_L
pattern
@@
@msgColorPalette1_L
color palette
@@
@msgColorButtonMenu1_L
color
@@
@msgButtonMenu1_L
button menu
@@
@msgAppSettingsSaved1_S
Application Settings saved
@@
@msgGeneralDocSettingsSaved1_L
General Workbook Settings saved
@@
@msgGeneralDocSettingsSaved1_S
General Settings saved
@@
@msgAppSettingsNotSaved1_S
Application Settings not saved
@@
@msgGeneralDocSettingsNotSaved1_L
General Workbook Settings were not saved
@@
@msgGeneralDocSettingsNotSaved1_S
General Settings not saved
@@
@msg14_L
no suggestions
@@
@msgBorderStyle
Border Style:
@@
@msgAutoFilter
Auto filter.
@@
@msgAutoFilterError
 not found. Could not focus on Autofilter menu item.
@@
@msg249_S
coordinates and content
@@
@msgEndOfChart
End of Chart
@@
@msgInitMessageBoxTitle
Initialization
@@
@msgInitMessageBoxText
gathering required information
@@
@msgDisplayChartInVirtualViewerOn_L
On
@@
@msgDisplayChartInVirtualViewerOff_L
Off
@@
@msgNoSpellingSuggestions
No spelling suggestions
@@
@msgChartExitXL9ScreenSensitiveHelp
The selected object is an Excel chart.

Press the Applications Key to display a context menu that provides many options for dealing with charts, such as cut or copy.

To change the formatting properties of the chart, press the Applications Key and then press F to choose Format Object. To move out of the chart and back into your spreadsheet, press ESC.

To edit the chart object, press the Applications Key, and then e to Edit the chart object. This returns you to the chart itself. But now you can press the Applications key again and all the editing options for objects are available. For example, to change the X- or Y-Axis of the chart, pick Object Options. This brings up a dialog where you can make changes.

Press Esc to close this message.
@@
@msgInputMessageNotShown
not visible
@@
; for msgMoveToCell, %1 is the cell address to move to, %2 is the sheet name.
@msgMoveToCellFunc
%1 %2
@@
@MSGTitleCellNormalOrientation
cell normal orientation
@@
@msgPrintPreview
Print Preview
@@
@msgPrintPreviewError
did not find anything to print
@@
; for msgScreenSensitiveHelpEmbeddedObjects, %1 is the number of embedded objects in the current worksheet,
;%2 is the name of the script to run to get the list of objects.
@msgScreenSensitiveHelpEmbeddedObjects
The current worksheet has %1 embedded objects. To bring up the objects list, press %2.
@@
@msgHasEmbeddedObject
Has embedded object
@@
@msgTooManyCellsSelected_l
There are too many selected cells to read. Reading only first and last cells.
@@
@msgTooManyCellsSelected_s
too many selected cells to read; first and last only
@@
@msgAutoFilterModeOff_l
Autofilter is Off.
@@
@msgAutoFilterModeOff_s
Autofilter Off.
@@
@msgFilterValues
Filter Values
@@
@msgFilterNoIcon
Filter No Icon
@@
@msgFilterNoFill
Filter No Fill
@@
@msgFilterIcon
Filter Icon
@@
@msgFilterFontColor
Filter Font Color
@@
@msgFilterDynamic
Filter Dynamic
@@
@msgFilterCellColor
Filter Cell Color
@@
@msgFilterAutomaticFontColor
Filter Automatic Font Color
@@
@msgScrSensitiveHlpManageWorksheets
To manage worksheets, such as changing the current sheet name,  press %KeyFor(ManageSheets). this brings up a menu of options  for the currently active sheet.
@@
;for format conditions:
@msgTrue
true
@@
@msgFalse
false
@@
;for msgFormatConditionStatus:
;%1 is the type, %2 is the operator, %3 the state.
@msgFormatConditionStatus
The condition %1 for formula %2 is %3.
@@
@msgAutomaticPagebreak
automatic
@@
@msgManualPagebreak
manual
@@
@msgVerticalPagebreak
vertical
@@
@msgHorizontalPagebreak
horizontal
@@
@msgCellMarkerAlreadyDefinedWarning
WARNING! A Cell Marker is already defined.
@@
;for msgFilterProcessingPleaseWait_l/s, %1 is either rows or columns.
@msgFilterProcessingPleaseWait_l
Please wait: processing over 5000 %1 for filtered status.
@@

;END_OF_UNUSED_VARIABLES

; Home tab | cell grouping | format cells | border tab
@msgPresets
Presets
@@
; Cells | Format Cells | Format Cell dialog | Fill tab
@msgBackgroundColorToolbar
Background Color
@@
; used for RGB reconcatenation as string concat in JAWS does additional on strings that are integers!
@msgConcatenateTwoStrings
%1%2
@@
@msgConcatenateThreeStrings
%1%2%3
@@
;msgDetectedShadingChangeNone:
;when shading detection is on and a cell is navigated to where there is no shading
@msgDetectedShadingChangeNone
No shading
@@
@msgError
Error!
@@
;for msgRowTitle, %1=row id
@msgRowTitle
title of row %1 .
@@
@msgColumnTitle
title of column %1 .
@@
@msgPostMonitorCell
Post Monitor Cell.
@@
@msgCantSetMonitorCells_L
Cannot set monitor cells outside of the worksheet area
@@
@msgCantSetMonitorCells_S
Cannot set monitor cells
@@
@msgFunctionListAcceptanceHlp_L
Press %KeyFor (Tab) to accept selected function.
@@
@msgFunctionListAcceptanceHlp_S
%KeyFor (Tab) - accept selected function.
@@
@msgNoFormula_L
No formula in current cell.
@@
@msgNoFormula_S
No formula
@@
@msgCellContainsErrors
Contains errors. Press alt+Shift+f10 to interact.
@@
@msgSlicerPane
Slicer
@@
@msgSparkLineSingular
1 sparkline
@@
; for msgSparkLines, %1 = the number of sparklines gathered at runtime while user is navigating. 
; Sparklines are a stylistic data affectation presented by the object model.
@msgSparkLines
%1 sparklines
@@
@msgNoSparklines
No sparklines
@@
@msgSelectFromSavedLocationError_L
First mark the cell at the start location with %keyfor(DefineATempPlaceMarker), then move to the last cell to be included in the selection and press %keyFor(SelectTextBetweenMarkedPlaceAndCurrentPosition).
@@
@msgSelectFromSavedLocationError_S
Save start with %keyfor(DefineATempPlaceMarker), then move to end and press %keyFor(SelectTextBetweenMarkedPlaceAndCurrentPosition).
@@
@msgChartTooLargeToProcess_L
The Chart is too large to process.
@@
@msgSheetItemStatus_EmptySheet
empty sheet
@@
;For msgR1C1, %1 is the row number, %2 is the column number
;To switch Excel to using the R1C1 reference style, File > Options > Formulas > R1C1 reference style
@msgR1C1
R%1C%2
@@
EndMessages

; Build 4.0.137
; QuatroPro 9.0 and 10.0 Script Message File for JAWS 4.0
; Copyright 2010-2020 by Freedom Scientific, Inc.
; by Joseph K Stephen (formerly Dunn)
; Last Modify by: Sean Murphy, 29th Oct 2001.

const
; for Adjust JAWS Verbosity dialog:
; note only text after the colon should be translated in the next section
	jvCellReading = "ToggleCellReadingVerbosity:Cell reading verbosity",
	jvCellFormatChange = "|ToggleCellFormatChangeDetection:Detect Cell Format Change",
	jvCellBorderChange = "|ToggleCellBorderChangeDetection:Detect Cell Border Change",
	jvToggleTitleReading = "|ToggleTitleReadingVerbosity:Toggle title reading verbosity",
	jvSetColumnTitle = "|SetColTitlesToRow:Set column titles to row",
	jvSetRowTitle = "|SetRowTitlesToColumn:Set row titles to column",
	jvSetTotalColumn = "|SetTotalColumnToCurrent:Set total column to current",
	jvSetTotalRow = "|SetTotalRowToCurrent:Set total Row to current",
	jvSetNextAvailableMonitorCell = "|NextAvailableMonitorCell:Set next monitor cell to current",
	jvClearMonitorCells = "|UndefineMonitorCells:Clear worksheet's Monitor Cells",
	jvClearSheetDefinitions = "|UndefineSheetDefinitions:Clear sheet title/total definitions",
scVersion = "productVersion",
scAddressDelimiter=":", ; used in Perfect Script to delimit cell addresses from sheet identifiers
; for detecting when a mnemonic has been pressed in owner drawn custom dialogs
scMnemonicId="Alt+",
scMenubar="File Edit View Tools Favorites Help", ; because the menubar is written directly to the dialog we need to suppress its reading when the dialog is spoken.
scEdit="EDIT", ; for detecting edit mode (on status bar)
scReady = "Ready", ;used to detect if in Ready mode or not in qpw 9 and 10.
; Window Names
wn_WritingTools = "Writing Tools",
wn_FunctionDlg = "Functions",
wn_PublishToInternetDlg = "Publish to Internet",
wn_MoveSheetsDlg = "Move Sheets",
; extreme care should be taken in translation as the rest of these constants 
;before the messages need to be checked with the PerfectScript implementation 
;used in your local version of Quattro Pro
; Note these are the functions passed to the PerfectScript interpreter 
;%1 is the coordinates or other argument to the function
notebookNameFunction="@property(\"active_notebook.statistics.fileName\")",
selectedCellsFunction="@property(\"active_block.selection\")", ; coordinates of range of selected cells
CellCoordinatesFunction="@CellPointer(\"address\")", ; coordinates of active cell
cellTypeFunction="@CellPointer(\"type\")", ; cell type, b,v,l
cellTypeGeneralFunction="@Cell(\"type\", %1)",
cellColumnFunction="@cellPointer(\"col\")", ; column index of active cell
cellRowFunction="@cellPointer(\"row\")", ; row index of active cell
cellColumnGeneralFunction="@cell(\"col\",%1)", 
cellRowGeneralFunction="@cell(\"row\",%1)", 
cellFontFunction="@property(\"active_block.font\")", ; font of active cell
cellStyleFunction="@property(\"active_block.style\")", ; cell style
cellAlignmentFunction="@property(\"active_Block.alignment\")", ; cell alignment
cellConstraintsFunction="@property(\"active_block.constraints\")", ; cell constraints 
columnWidthFunction="@property(\"active_block.column_width\")", ; column width
rowHeightFunction="@property(\"row_height\")", ; the row height
cellLineDrawingFunction="@property(\"active_block.line_drawing\")", ; border details of cell
cellLabelAlignmentFunction="@cellPointer(\"prefix\")", ; if active cel is a label, prefix char determining label alignment
cellFormatFunction="@cellPointer(\"format\")", ; cell numeric format eg currency etc.
cellFormatGeneralFunction="@cell(\"format\",%1)", ; cell numeric format eg currency etc.
cellTypeBlank="b",
cellTypeValue="v",
cellTypeLabel="l",
; When cell is a label, folowing constants define alignment
cellLeftAligned="'",
cellCentered="^",
cellRightAligned="\"",
; time functions:
timeHoursFunction="@hour(%1)",
timeMinutesFunction="@minute(%1)",
timeSecondsFunction="@second(%1)",
dateMonthFunction="@month(%1)",
dateYearFunction="@year(%1)",
dateDayFunction="@day(%1)",
dateDayOfWeekFunction="@weekday(%1)",
dateZeroYear=1900,
timeAm=" A M",
timePm=" P M",
dayNames="Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
shortMonths="Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec",
longMonths="January,February,March,April,May,June,July,August,September,October,November,December",
sheetDisplayGridlinesFunction="@property(\"active_page.display.grid_lines\")",
sheetDisplayBordersFunction="@property(\"active_page.display.borders\")",
defaultBorderType="NoChange", ; for border description
; delimiters for stringSegment used for extracting coordinates from a range
ColenDelimiter=":",
PeriodDelimiters = ".",
argDelimiter=",",
; values for bold, underline etc.
attribOn="yes",
; formula substring used for col/row totals
globalTotalFormulaStr="@SUM",
; alphabet used by columnNumberToLetter, note need space at beginning.
alphabet=" ABCDEFGHIJKLMNOPQRSTUVWXYZ",
dollarSign="$", ; used in cell coordinates 
; Cell Format types:
cellFormatFn="F", ; Fixed (n = 0-15)
cellFormatSn="S", ; 	Scientific (n = 0-15)
cellFormatCn="C", ;	Currency (n = 0-15)
cellFormatG="G", ; General
cellFormatPn="P", ; Percent (n = 0-15)
cellFormatD="D", ; DateD1 = DD-MMM-YY D2 = DD-MMMD3 = MMM-YYD4 = MM/DD/YY, DD/MM/YY, DD.MM.YY, YY-MM-DDD5 = MM/DD, DD/MM, DD.MM, MM-DD D6-D9		TimeD6 = HH:MM:SS AM/PMD7 = HH:MM AM/PMD8 = HH:MM:SS-24hr, HH.MM.SS-24hr, HH,MM,SS-24hr, HHhMMmSSsD9 = HH:MM-24hr, HH.MM-24hr, HH,MM, HHhMMm.
cellFormatT="T", ; Show Formulas (Text)
cellFormatH="H", ; Hidden
cellFormatU="U", ; 	User-defined
; number constants for consistency
nOne="1",
nTwo="2",
nThree="3",
nFour="4",
nFive="5",
nSix="6",
nSeven="7",
nEight="8",
nNine="9",
nZero="0",
; for owner drawn dialog control identification in SP4 and higher 
stateChecked="Checked",
stateSelected="selected",
itemCountId=" of ",
ctlCheckbox="check",
ctlRadioButton="radio",
ctlEdit="edit",
ctlTab="tab",
ctlListbox="list",
ctlButton="button",
ctlComboBox="combo",
ctlSpinControl="spin",
; keystrokes
ksDummy="`", ; in owner drawn dialogs, when toggling checkboxes with spacebar, hidden window isn't updated until another keyboard key is pressed so we press a dummy to ensure that the window is updated.
ksSpacebar="space" ,; for activating buttons and toggling checkboxes



;UNUSED_VARIABLES

scDash="-",
scColonSpace=": ", ; used in Braille
wnSpellChecker = "Spell Checker",
wnThesaurus = "Thesaurus",
wnDictionary = "Dictionary",
wn_PerfectExpertDlg = "PerfectExpert", 
wn_OpenDlg = "Open File ",
wn_SaveAsDlg = "Save File ",
wn_InsertImageDlg = "Insert Image ",
wn_OpenDatabaseFileDlg = "Open Database File ",
wn_OptionsDlg = "Options",
cellRepeated="\\",
; values for bold, underline etc.
attribOff="no",
cellFormatComma="," ;	Commas used to separate thousands (n = 0-15)

;END_OF_UNUSED_VARIABLES

messages
@msgAppStart1_L
To hear the %product% help topic for Corel Quattro Pro press %keyFor(screenSensitiveHelp) twice quickly.
@@
@msgAppStart1_S
%product% help topic for Quattro Pro %keyFor(screenSensitiveHelp) twice quickly.
@@
;for msgCellRange, %1=start cell coordinates, %2=start cell value, 
;%3=end cell coordinates, %4=end cell value
@msgCellRange
%1 %2 through %3 %4
@@
;for msgMonitorCellInfo, %1=cell coordinates, %2=cell value
@msgMonitorCellInfo
%1 %2
@@
; date formats d1 through d9 correspond to date/time formats returned by Quattro Pro
;d1, %1=day number, %2=short month name, %3=year suffix, eg 00 
@msgD1
%1-%2-%3
@@
;d2, %1=day number, %2=short month name 
@msgD2
%1-%2
@@
 ;d3, %1=short month name, %2=year suffix
@msgD3
%1-%2
@@
;D4 = MM/DD/YY, DD/MM/YY, DD.MM.YY, YY-MM-DD
;%1=day name, %2=day number, %3=month long name, %4=year
@msgD4
%1, %2 %3 %4
@@
;D5 = MM/DD, DD/MM, DD.MM, MM-DD 
@msgD5
%1/%2
@@
;D6 = HH:MM:SS AM/PM
;%1=hour, %2=minute, %3=second, %4=AM/PM 
@msgD6
%1:%2:%3 %4
@@
;D7 = HH:MM AM/PM
@msgD7
%1:%2 %3
@@
;D8 = HH:MM:SS-24hr, HH.MM.SS-24hr, HH,MM,SS-24hr, HHhMMmSSs
;%1=hour, %2=minute, %3=second
@msgD8
%1:%2:%3
@@
;D9 = HH:MM-24hr, HH.MM-24hr, HH,MM, HHhMMm.
;%1=hour, %2=minute
@msgD9
%1:%2
@@
@msg1
QuattroPro
@@
@msgHasFormula
Has Formula
@@
@msgLabel
label
@@
@msgValue
value
@@
@msgLeftAligned
Left Aligned
@@
@msgCentered
Centered
@@
@msgRightAligned
Right Aligned
@@
;for msgCellAlignmentHoriz, %1=horizontal alignment description
@msgCellAlignmentHoriz
Horizontal alignment %1 
@@
;for msgCellAlignmentVert, %1=vertical alignment description 
@msgCellAlignmentVert
Vertical alignment %1 
@@
;for msgStyle, %1=style name
@msgStyle
Style %1
@@
;for msgOrientation, %1=orientation description
@msgOrientation
Orientation %1 
@@
;for msgTextWraps, %1=yes or no
@msgTextWraps
Wrap text? %1 
@@
;for msgColumnWidth, %1=rule, %2=number of twips width
@msgColumnWidth
Column width %1 %2 twips 
@@
;for msgRowHeight, %1=height in twips
@msgRowHeight
Row Height %1 twips 
@@
;for msgCellConstraints, %1=description of constraint
@msgCellConstraints
Cell constraints %1 
@@
@msgCellBorder
Cell border: 
@@
@msgCellBorderNone
No border
@@
@msgTitleReadingOff_S
Off
@@
@msgReadColumnTitles_S
Column
@@
@msgReadRowTitles_S
Row
@@
@msgReadBothTitles_S
Both
@@
@msgSettingColumnTitlesToRow_S
Titles Row=%1
@@
@msgSettingRowTitlesToColumn_S
Titles Column=%1
@@
;for msgColNoTitle, %1=column letter
@msgColNoTitle
 column %1 no title
@@
;for msgRowNoTitle,%1=row number
@msgRowNoTitle
row %1 no title
@@
@msgNoTitle
no title
@@
;for msgSettingMonitorCellTo_L/S, %1=monitor cell number, %2=cell coordinates
@msgSettingMonitorCellTo_L
Setting monitor cell %1 to %2 
@@
@msgSettingMonitorCellTo_S
monitor cell %1=%2 
@@
@msgEquals
equals
@@
@msgClearingDefinitions_L
Clearing sheet definitions.
@@
@msgClearingDefinitions_S
Clearing
@@
@msgCellContent_S
Content
@@
@msgCellCoordinatesAndContent_S
Coordinates and content
@@
@msgNoTotalColumnDefined
No Total column defined.
@@
@msgNoTotalRowDefined
No Total row defined.
@@
;for msgRowTotal, %1=total
@msgRowTotal
Row total=%1
@@
;for msgColumnTotal, %1=total
@msgColumnTotal
Column total=%1
@@
@msgSettingColumnTotalsRowTo_S
Totals Row=%1
@@
@msgSettingRowTotalsColumnTo_S
Totals Column=%1
@@
@msgPleaseWait
Please wait, collecting cell data.
@@
@msgNoCellsWithDataInColumn_L 
No cells with data in current column
@@
@msgNoCellsWithDataInColumn_S
no data in column
@@
@msgNoCellsWithDataInRow_L
No cells with data in current row.
@@
@msgNoCellsWithDataInRow_S
No data in row
@@
 @msgRowCellsWithData
Row Cells With Data
@@
@msgColumnCellsWithData
Column Cells With Data
@@
;for msgListItem1/2, %1, %2 and %3 are optional list components, 
;eg cell coordinates, row/col title, cell value
@msgListItem1
%1 %2: %3
@@
;cell format messages:
@msgListItem2
%1: %2
@@
;for msgCellFormat, %1=format description
@msgCellFormat
Cell format %1 
@@
;cell type is not parameterised 
@msgCellType
Cell Type: 
@@
@msgFormatFn
Fixed 
@@
@msgFormatSn
Scientific 
@@
@msgFormatCn
Currency 
@@
@msgFormatG
General
@@
@msgFormatPn
Percent 
@@
@msgFormatD1
date: DD-MMM-YY
@@
@msgFormatD2
Date: DD-MMM
@@
@msgFormatD3
Date: MMM-YY
@@
@msgFormatD4
Date: MM/DD/YY
@@
@msgFormatD5
Date: MM/DD
@@
@msgFormatD6
Time: HH:MM:SS AM/PM
@@
@msgFormatD7
Time: HH:MM AM/PM
@@
@msgFormatD8
Time: HH:MM:SS-24hr
@@
@msgFormatD9
Time: HH:MM-24hr
@@
@msgFormatT
Text
@@
@msgFormatH
Hidden
@@
@msgFormatU
User Defined
@@
; for End Mode
@msgEndModeHelp
Press a direction arrow to move focus to the extreme cell in the desired direction.
@@
; for cell selection
@msgSelectedCells
Selected block:
@@
@msgThrough
 through 
@@
;for msgFontIs, %1=font name, %2=font size
@msgFontIs
Font is %1 %2 point 
@@
@msgBold
Bold
@@
@msgItalic
Italic
@@
@msgUnderline
Underline
@@
@msgStrikeout
Strikeout
@@
@msgWhatsThis
What's this
@@
@msgSpellChecker
Spell Checker
@@
@msgDebugMode
Debug mode
@@
@msgMacroPlay
Play macro
@@
@msgFormulaComposer
Formula Composer
@@
@msgMacroList
List macros
@@
@msgSpreadsheetFunctionList
List Spreadsheet functions
@@
@msgNameCell
Name cell
@@
@msgExitQP
Exit QuattroPro
@@
@msgCloseWindow
Close window
@@
@msgQuickTab
Quick tab
@@
@msgGroupMode
Group mode
@@
@msgPreviousWindow
Previous window
@@
@msgNextWindow
Next window
@@
@msgSelectionMode
Selection mode
@@
@msgOutlineGroup
Outline group
@@
@msgOutlineUngroup
Outline ungroup
@@
@msgExpandOutlineGroup
Expand outline group
@@
@msgCollapseOutlineGroup
Collapse outline group
@@
@msgVBEditor
Visual Basic editor
@@
@msgNotebookProperties
Notebook properties
@@
@msgAppProperties
Application properties
@@
@msgSpreadsheetProperties
Spreadsheet properties
@@
@msgDataSort
Data sort
@@
@msgGridlineStatus
Gridline status: 
@@
@msgHorizontalGridlines
Horizontal gridlines visible.
@@
@msgNoHorizontalGridlines
no horizontal gridlines
@@
@msgVerticalGridlines
Vertical gridlines visible.
@@
@msgNoVerticalGridlines
no vertical gridlines
@@
@msgRowBorders
Row borders visible.
@@
@msgColumnBorders
Column borders visible.
@@
@msgNoColumnBorders
no column borders
@@
@msgNoRowBorders
no row borders
@@
@msgSurroundingBorder
surrounding border %1 line 
@@
;for msgBorders, %1=top border description,
;%2=left border description, %3=right border description
;%4=bottom border description
@msgBorders
top %1 line 
left %2 line 
right %3 line 
bottom %4 line 
@@
;for msgTop/left,right/bottom, %1=border description
@msgTop
top %1 line
@@
@msgLeft
left %1 line
@@
@msgRight
right %1 line
@@
@msgBottom
bottom %1 line
@@
@msgDefault
default
@@
; Hotkey help:
@msgHotkeyHelp1_L
To hear the cell formula use %keyFor(sayFormula). 
Press the keystroke twice to present it in a %product% message box.
To set up automatic title reading and other %product% features use %keyFor(adjustJAWSOptions). 
To describe the font and cell characteristics use %keyFor(sayFont).
To hear the coordinates of the current cell use %keyFor(readWordInContext). 
To describe the border around the active cell use %keyFor(DescribeCellBorder). 
To hear the selected range of cells use %keyFor(saySelectedText).
To hear the current row title use %keyFor(sayRowTitle). 
To hear the current column title use %keyFor(sayColumnTitle). 
To read the current row total use %keyFor(readRowTotal). 
To read the current column total use %keyFor(readColumnTotal). 
To set up to 10 monitor cells for the current worksheet use Alt+Control+Shift+1 through 0 on the numbers row.
To read the monitor cells use Alt+Shift+1 through 0 on the numbers row.
To move to a monitor cell use %keyFor(moveToMonitorCell). 
To list cells with data in the current row use %keyFor(listRow). 
To list cells with data in the current column use %keyFor(listColumn). 
To hear the gridline status use %keyFor(sayGridlineStatus). 
@@
@msgHotkeyHelp1_S
cell formula %keyFor(sayFormula) 
set up automatic title reading and other %product% features %keyFor(adjustJAWSOptions) 
describe font and cell characteristics %keyFor(sayFont)
coordinates of current cell %keyFor(readWordInContext) 
describe border %keyFor(DescribeCellBorder) 
selected range %keyFor(saySelectedText)
row title %keyFor(sayRowTitle) 
column title %keyFor(sayColumnTitle) 
row total %keyFor(readRowTotal) 
column total %keyFor(readColumnTotal) 
set monitor cells Alt+Control+Shift+1 through 0 on the numbers row
read monitor cells Alt+Shift+1 through 0 on the numbers row
move to monitor cell %keyFor(moveToMonitorCell) 
list cells in current row %keyFor(listRow) 
list cells in current column %keyFor(listColumn) 
gridline status %keyFor(sayGridlineStatus) 
@@
;Screen Sensitive Help 
;for msgSpreadSheetWindow_L/S, %1=active cell coordinates
@msgSpreadSheetWindow_L
This is the spreadsheet window.
To navigate the spreadsheet use the Tab and shift Tab or Arrow keys.
The active cell is %1. 
@@
@msgSpreadSheetWindow_S
This is the spreadsheet window.
To navigate the spreadsheet use the Tab and shift Tab or Arrow keys.
%1. 
@@
;Custom property sheet help
; SpellChecker msgs
@msgSpellCheckerHelp_L
The spellchecker is active.
To read the misspelled word and first suggestion use %keyFor(readMisspelledAndSuggestion).
You must use the JAWS cursor to locate and activate options in this dialog.
@@
@msgSpellCheckerHelp_S
The spellchecker is active.
read the misspelled word and first suggestion use %keyFor(readMisspelledAndSuggestion).
@@
; error messages
@QPWErrorMsg1
you must be in the Spell Checker dialog to read misspelled word and suggestion.
@@
@msgAppSettingsSaved
Application Settings saved
@@
@msgDocSettingsSaved
Notebook Settings saved
@@
@msgAppSettingsNotSaved
Application Settings could not be saved
@@
@msgDocSettingsNotSaved
Notebook Settings could not be saved
@@
;for msgPage, %1=page identifier, eg page A
@msgPage
page: %1 
@@
@QPMsgToggleCellFormatChangeOff_S
off
@@
@QPMsgToggleCellFormatChangeOn_S
On
@@
@QPMsgToggleCellBorderChangeOff_S
Off
@@
@QPMsgToggleCellBorderChangeOn_S
on
@@
;for msgClearingMonitorCells_L, %1=sheet name 
@msgClearingMonitorCells_L
Clearing monitor cell definitions for %1
@@
@msgClearingMonitorCells_S
Clearing
@@
;for msgMonitorCellUndefined, %1=monitor cell number
@msgMonitorCellUndefined
monitor cell %1 undefined 
@@
@msgNoMonitorCellsAvailable_S
No Monitor Cells Available
@@
@msgMoveToMonitorCell_L
Move to Monitor Cell
@@
;for msgNoMonitorCellsDefined_L, %1=sheet name
@msgNoMonitorCellsDefined_L
No monitor cells defined for %1 
@@
@msgNoMonitorCellsDefined_S
No monitor cells
@@
@msgToActivateTheButton_L
To activate the selector button associated with this edit control press F4
@@
@msgToActivateTheButton_S
Press f4 to activate selector button
@@
@WPHelpMsg100_L
This edit control has an associated button.
To activate it use f4.
@@
@WPHelpMsg100_S
This edit control has an associated button.
To activate it use f4.
@@
@msgDialog
 %1 dialog
@@
@msgUnsupportedControl
unsupported custom control
@@
@msgBrlBlankCell
Blank Cell
@@
@msgBrlDelim
-
@@
@MsgSynopsis
Synopsis:
@@
@MsgDescription
Description: 
@@
@MsgMenu_L
Menu
@@



;UNUSED_VARIABLES

; for title reading:
@msgTitleReadingOff_L
Title reading off
@@
@msgReadColumnTitles_L
Read column titles
@@
@msgReadRowTitles_L
Read row titles
@@
@msgReadBothTitles_L
Read both titles
@@
;for msgSettingColumnTitlesToRow_L/S, %1=row number
@msgSettingColumnTitlesToRow_L
Setting column titles to row %1 
@@
;for msgSettingRowTitlesToColumn_L/S, %1=column letter
@msgSettingRowTitlesToColumn_L
Setting row titles to column %1 
@@
@msgCellContent_L
Cell Content only
@@
@msgCellCoordinatesAndContent_L
Cell coordinates and content
@@
;for msgSettingColumnTotalsRowTo_L/S, %1=row number
@msgSettingColumnTotalsRowTo_L
Setting column totals row to %1 
@@
;for msgSettingRowTotalsColumnTo_L/S, %1=column letter
@msgSettingRowTotalsColumnTo_L
Setting row totals column to %1
@@
@QPMsgToggleCellFormatChangeOff_L
do not detect cell format changes
@@
@QPMsgToggleCellFormatChangeOn_L
detect cell format changes
@@
@QPMsgToggleCellBorderChangeOff_L
do not detect cell border changes
@@
@QPMsgToggleCellBorderChangeOn_L
detect cell border changes
@@
@msgNoMonitorCellsAvailable_L
No monitor cells available, you must redefine an existing monitor cell
@@
@msgBrlCellRange
%1: %2-%3: %4
@@

;END_OF_UNUSED_VARIABLES

EndMessages
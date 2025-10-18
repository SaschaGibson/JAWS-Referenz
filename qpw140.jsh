; Build 4.0.146
; QuattroPro 14.0  Script Header File for JFW 4.0
; Copyright 2010-2020 by Freedom Scientific, Inc.
;By: Sean Murphy 
; Original code by Joseph K Stephen (formerly Dunn)
; last modify on: 5th nov 2001
; General constants and globals
const
; Next section defines JSI file names and sections/keys where settings are saved
jsiFileName="qpw10.jsi", ; app specific settings stored in qpw.jsi
jsiDocFileName="qpw_%1.JSI", ; %1=document name
; jsi section for app specific settings
Section_AppVerbositySettings="Application Verbosity Settings",
; keys for Application Verbosity Settings section
hKey_CellReadingVerbosity="CellReadingVerbosity",
hKey_DetectCellNumberFormatChange="DetectCellNumberFormatChange",
hKey_DetectCellBorderChange="DetectCellBorderChange",
; each of the following will be stored in a notebook specific jsi 
;under the worksheet name section 
hKey_TitleReadingVerbosity="TitleReadingVerbosity",
hKey_TitleCol="TitleCol",
hKey_TitleRow="TitleRow",
hKey_TotalsColumn="totalsColumn",
hKey_TotalsRow="TotalsRow",
hKey_RowTotalAutoFind="AutomaticallyFindRowTotal",
hKey_ColumnTotalAutoFind="AutomaticallyFindColumnTotal",
section_monitorCells="%1 MonitorCells", ; %1=page id, up to ten monitor cells can be stored for a given worksheet.
hKey_MonitorCell="MonitorCell%1", ; %1=monitor cell number
; Control IDs:
cId_statusBar100=1, 
cId_statusBar = 59393, 
cID_spreadsheet=59648, ; QPW version 9/10 
cId_SubMenu = 59392, ; Control id of the currently selected item in the sub menu.
cId_MainMenuBar = 1, ; Control id of the main menu control.
;The following controls id are found in the Writing tool dialogue.
CId_DialoguePage = 1000, ; The Multi dialogue page control for the Writing Tool dialogue.
cId_HelpButton = 1002,
cid_CloseButton = 1001,
; for Spell Checker
;The following control ids are on the same logical level, in window handle order of the Spell check dialogue page.
CId_NotFound_Prompt = 121, 
CId_NotFound_field = 120,
CId_replaceWith_Prompt = 117,
CId_ReplaceWith_field = 118,
CId_replacements_Prompt100 = 122, 
CId_replacements_list = 65277,
CId_replacements_list100 = 119, ;For Quattro Pro Version 10.0.
cId_ReplaceButton = 103,
cId_SkipOnceButton = 104, 
cId_SkipAllButton = 105,
cId_AddButton = 106,
cId_AutoReplaceButton = 100,
cId_UndoButton = 101,
cId_Optionbutton = 102,
cId_CheckMethodStaticText = 115,
cId_checkMethodcomboBox = 116,
; dictionary dialogue page.
cId_DefinitionComboBox = 272,
cId_WordListBox = 273,
cId_DictionaryComboBox = 288,
cId_OxfordDictionaryButton = 310,
cId_LookUpStaticText = 306,
cId_DefinitionBox = 305,
; Thesaurus 
cId_ThesaurusTreeView1 = 1315,
cId_ThesaurusLookupComboBox = 1308,
; Control Ids found in the Cell Naming dialogue.
cId_CellNamingAddButton = 1003,
cId_CellNamingListBox = 1001,
; control Ids for the Function dialogue.
cId_FunctionListBox = 1001,
cId_SynopsisStatusText = 1003,
cId_DescriptionStatusText = 1004,
; Control Ids for the Open and Save Dialogue.
cId_LastModifyEditComboBox = 1001, 
cid_LastModifiedComboBox = 3227,
; common Control Ids for the Publish to Internet and Find & replace dialogues.
Cid_RangeEdit = 26, 
; Control Id for the Move Sheets dialogue.
cid_MoveToEdit = 1000,
; Control Ids for the Options dialogue.
; Control ids for the Find and Replace dialogues
cId_FindEdit = 1065,
; control Ids for the Speed format dialogue.
cid_FormatListbox = 1078, 
cId_ExampleStaticText = 1092,
; Numeric format dialogue.
cid_NumbericFormat = 4000,
; Window classes
wc_QuattroProChildWnd = "QPChildWnd.14.00", ; QPW14
wc_QuattroProApplication = "QPBaseWdw.14.00", 
wc_ButtonEdit="WPfne140",
wc_rangePicker="QPRangeCtrl",
wc_dialog="#32770",
wc_Menu = "Afx:20000000:8:10011:0:0",
WC_Menu2 = "Afx:20000000:8:10011:0:0",
; title reading constants
readNoTitles=0,
readColumnTitles=1,
readRowTitles=2,
readBothTitles=3,
maxMonitorCells=10, ; note just changing this will not mean more monitor cells may be defined and read 
monitorCellUndefined="-",
maxRowsToSearch=256, ; up to 65536
maxRows=1000000, ; total max rows
maxColumns=256,
ksQPW100ScriptFileCurrent = "wpw100"

globals
int QPHasRunBefore,
int globalTitleReading, ; 0 off, 1 column titles, 2 row titles, 3 both
int globalTitleCol,
int globalTitleRow,
int globalTotalColumn,
int globalTotalRow,
int globalRowTotalAutoFind, ; true if JFW finds the row total, false if specified by user
int globalColumnTotalAutoFind, ; true if JFW finds the column total automatically or false if manually set by user
string globalMonitorCells,
int GlobalPriorRow,
int globalPriorCol,
int globalCellReadingVerbosity,
int globalDetectCellNumberFormatChange, ;true if we detect and announce number format changes, false otherwise
string globalPriorCellFormat,
int globalDetectCellBorderChange, ; true if we detect cell border changes
string globalPriorTopBorder,
string globalPriorRightBorder,
string globalPriorBottomBorder,
string globalPriorLeftBorder,
int suppressEcho,
;string BrlCellInfo,
int globalNoSave, ; true if clear definitions has been selected and a section deleted from a jsi to avoid an empty section being rewritten.
Handle GlobalWritingToolFocus,  ;Used to track the focus within the Virtual Tab order of the Writing Tool Dialogues.
int GlobalMSAAHasTriggered, ; set to true, if the ActiveItemChangedEvent  function has executed.
int iEditCell, ;Set to true, when the user edits a formula or cell.
int QPWFirstTimeCombo,
int GlobalSystemMenuActivated, ; This flag is set when the the tutor event is triggered.
int GlobalMenu2Activated  ; This flag is set when the the tutor event is triggered.

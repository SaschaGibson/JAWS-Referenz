; Build 3.71.06.001
; QuatroPro 9.0 Script Header File for JFW 3.7
; Copyright 2010-2020 by Freedom Scientific, Inc.
; by Joseph K Stephen (formerly Dunn)
; Build QP3710631 last modified on November 1, 2000
; General constants and globals
const
kiServicePack4Id=883,
; Next section defines JSI file names and sections/keys where settings are saved
jsiFileName="qpw.jsi", ; app specific settings stored in qpw.jsi
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
cId_statusBar=59393,
cID_spreadsheet=59648, ; QPW9
CId_DialoguePage = 1000, ; spellchecker is active if this is visible
; for Spell Checker
CId_NotFound_Prompt = 121, 
CId_NotFound_field = 120,
CId_replaceWith_Prompt = 117,
CId_ReplaceWith_field = 118,
CId_replacements_list = 65277,
cId_ReplaceButton = 103,  
; Window classes
wc_QuattroPro9="QPChildWnd.9.00", ; QPW9
wc_ButtonEdit="WPfne90",
wc_rangePicker="QPRangeCtrl",
wc_QuattroPro8="QPWChildWdw.8.00", ; QPW8 
wc_qp8dialog="QPWDialogWdw.8.00",
wc_dialog="#32770",
; title reading constants
readNoTitles=0,
readColumnTitles=1,
readRowTitles=2,
readBothTitles=3,
maxMonitorCells=10, ; note just changing this will not mean more monitor cells may be defined and read 
monitorCellUndefined="-",
maxRowsToSearch=256, ; up to 65536
maxRows=1000000, ; total max rows
maxColumns=256

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
int globalIsSP4 


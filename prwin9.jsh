;Script header file for Corel Presentations 9 (Service Pack 4)
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Version 3.7
;by Joseph Stephen
;17 July 2000
; Build PR3710513 by Joseph Stephen last modified on 4 October 2000
;Accompanying executables to this application are:
; prwin9.exe, prlmen.dll

const
; Application verbosity items
cStrPrwin9VerbosityItems="|ToggleUnitsOfMeasure:Toggle Units of Measure",
PRJSIName="PRWin9.jsi",
; application verbosity settings section
Key_UnitsOfMeasure="UnitsOfMeasure",
PRMeasurePoints="Points",
PRMeasureWPUnits="WP Units",
hNull=0,
; window classes
wc_writingToolsDlg="wtPrToolMgrWndClass",
wc_PRArray="PR_ArrayClass.9.32",
wc_bitmapButton="PR_BitmapButton.9.32",
wc_Dialog="#32770",
wc_slideShowRunning="PR_SlideShow.9.32",
wc_PRGLB="PRGLB",
wc_charMapGrid="WPChrMapGrid90",
wc_drawArea="PR_DrawAreaChild.9.32",
wc_glb="GLB90",
wc_PFPpreselComboBox="PFPpreselComboBox90",
wc_ButtonEdit="WPfne90",
wc_dateEdit="WPdate90",
wc_spinEdit="WPCNT90",
; control ids
; Spell checker page of Writing Tools Dialog
cId_notFoundPrompt=121,
cId_notFoundEdit=120,
cId_ReplaceWithPrompt=117,
cId_replaceWithEdit=118
Globals
	int CorelPresentations9FirstTime,
	int nSuppressEcho,
	string g_strGraphicsList,
	string g_strGraphicsListX,
	string g_strGraphicsListY,
string gsUnitsOfMeasure,
string gsDefaultUnitsOfMeasure,
; repeated but same as default.jss
int WindowClosed,
int clipboardTextChanged,
int priorGraphicId

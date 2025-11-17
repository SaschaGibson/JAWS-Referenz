;Script header file for Corel Presentations 15
; Copyright 2010-2020 by Freedom Scientific, Inc.
; Version 3.7
;by Joseph Stephen
;17 July 2000
; Build 4.0.130
; last Modify by: Sean Murphy on 22nd Oct 2001
;Accompanying executables to this application are:
; prwin15.exe, prlmen.dll

const
; Application verbosity items
cStrPrwin9VerbosityItems="|ToggleUnitsOfMeasure:Toggle Units of Measure",
PRJSIName="PRWin15.jsi",
; application verbosity settings section
Key_UnitsOfMeasure="UnitsOfMeasure",
PRMeasurePoints="Points",
PRMeasureWPUnits="WP Units",
hNull=0,
; window classes
wc_writingToolsDlg="wtPrToolMgrWndClass",
wc_PRArray="PR_ArrayClass.15",
wc_bitmapButton="PR_BitmapButton.15",
wc_Dialog="#32770",
wc_slideShowRunning="PR_SlideShow.15",
wc_PRGLB="PRGLB",
wc_charMapGrid="WPChrMapGrid150",
wc_drawArea="PR_DrawAreaChild.15",
wc_glb="GLB150",
wc_PFPpreselComboBox="PFPpreselComboBox150",
wc_ButtonEdit="WPfne150",
wc_dateEdit="WPdate150",
wc_spinEdit="WPCNT150",
; control ids
; Spell checker page of Writing Tools Dialog
cId_notFoundPrompt=121,
cId_notFoundEdit=120,
cId_ReplaceWithPrompt=117,
cId_replaceWithEdit=118,
cid_WritingToolTabStrip = 1000
Globals
	int CorelPresentations15FirstTime,
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

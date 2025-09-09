; Build 4.0.125
; JFW 3.7 Header File for Wordperfect 9
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Build WP3710544 by Joseph K Stephen Last Modified on September 26, 2000
; Special thanks for reference information from Marco Zehe OmniPc Germany.
; last modify by: Sean Murphy on 18th oct 2001

; General constants and globals
const
; For Import Registry Key file
strRegFile="\\CorelOpt.reg",
; jsi filename
jsiFileName="wp.jsi",
; application keys:
hKey_PageAndColumnBreakDetection="PageAndColumnBreakDetection",
hKey_detectTables="DetectTables",
hKey_detectStyleChanges="DetectStyleChanges",
hKey_detectBorders="DetectBorders",
hKey_detectLanguages="DetectLanguages",
; Control IDs
CId_DocumentWindow = 4297,
CId_StatusBar = 4398,
CId_FontWindow = 34023,
CId_PointSizeWindow = 34025,
CId_StyleWindow = 34027,
cId_StyleCombo=4101,
cId_fontCombo=1001,
cId_positionButton=24013,
cId_relativeSizeButton=24015,
; for Spell Checker
CId_MisspelledWindow = 34132,
CId_NotFound_Prompt = 121,
CId_NotFound_field = 120,
CId_replaceWith_Prompt = 117,
CId_ReplaceWith_field = 118,
CId_replacements_list = 65277,
cId_ReplaceButton = 103,
CId_DialoguePage = 1000,
;For The Thesaurus.
CId_Replace_With = 1001,
CId_Synonym = 108,
CId_Synonym2 = 112,
CId_Synonym3 = 114,
CId_Definitions = 110,
;The Gramma checker
CId_Replacement = 305,
CId_Sentence = 307,
;The find and Replace dialogue.
CId_find_Prompt = 10,
CId_EditFindPrompt = 11,
cId_BorderStyleListBox=15, ; Paragraph Border/Fill border style
; The Quick Finder Manager
cId_quickFinderStatic=1143,
; Window classes
wc_PFPpreselComboBox="PFPpreselComboBox90",
wc_outlineArray="WP8OutlineArray",
wc_WPvscrollListBox = "WPvscrollListBox.7.32", ; used in the Paragraph, Page border style/fill dialogues.
wc_ButtonEdit="WPfne90",
wc_dateEdit="WPdate90",
wc_spinEdit="WPCNT90",
wc_wpClient="WordPerfect.9.32",
wc_MainDocumentWindow="WPDocClient",
wc_updateStatic90="WPUpdateStatic90",
wc_dialog1="#32770",
wc_dialog2="#32771",
wc_static1="wPStatic90", ; border descriptions use this
wc_StatusBar = "WPTBarWindowClassWP",
wc_popout="WPpopoutbutton.7.32",
wc_mru="MRU90",
wc_pfpMru="PFPI90_MRU",
wc_pfpPreselButton="PFPpreselButton90",
wc_static="static",
WC_FindAndReplace = "WPWin_FINDDLG_WPWin",
WC_PageSetup = "PFDlgPropPage90",
Wc_Tooltip= "WPCBTAText90",
Wc_toolbar="WPBBar90",
wc_treeview="sysTreeview32",
wc_edit="edit"

globals
int WP9HasRunOnce,
int globalInTableFlag,
string GlobalPriorStyle,
int globalDetectTables,
int globalDetectStyleChanges,
int globalDetectLanguages,
int globalDetectBorders,
int globalDetectPageAndColumnBreaks,
int suppressEcho,
string globalDefaultLanguage,
int globalMultipleColumns


; JFW Header File for WordPerfect 2021
; Copyright (C) 1999-2021 by Freedom Scientific BLV Group, LLC.
; Special thanks for reference information from Marco Zehe OmniPc Germany.

; General constants and globals
const
; For Import Registry Key file
strRegFile="\\Corel21opt.reg",
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
;Spell checker, Grammar checker, Thesaurus and Dictionary dialogue.
CId_DialoguePage = 1000,
; for Spell Checker
CId_MisspelledWindow = 34132,
CID_MisspelledAsYouGoEdit = 4101,
CId_NotFound_Prompt = 121,
CId_NotFound_field = 120,
CId_replaceWith_Prompt = 117,
CId_ReplaceWith_field = 118,
CId_replacements_list = 119,
cId_ReplaceButton = 103,
;for the Gramma Checker
CID_GrammaCheckerSentenceListBox = 3124,
;For The Thesaurus.
CID_ThesaurusComboBoxLookupWord = 1308,
CID_ThesaurusOptionButton =  1311,
;The Dictionary
CID_DictionaryComboBoxLookupWord = 272,
CID_DictionaryComboBoxSearchWord = 288,
CID_DictionaryListBox = 100,
CID_DictionaryOptionButton = 309,
CID_DictionaryDefinitionField = 305,
;The find and Replace dialogue.
CId_find_Prompt = 10,
CId_EditFindPrompt = 11,
cId_BorderStyleListBox=15, ; Paragraph Border/Fill border style
; The Quick Finder Manager
cId_quickFinderStatic=1143,
; This control id is found in all dialogues that perform a file action.  EG.  Open a file, Save file as, etc.
cid_LastModifiedComboBox = 3227,
; Window classes
;wc_PFPpreselComboBox="PFPpreselComboBox210",
wc_outlineArray="WP8OutlineArray",
wc_PR_ArrayClass = "PR_ArrayClass.21", ; found in the data sheet view.
wc_glb="GLB210", ; found in the Data sheet, in the Legal dialogue.
wc_bitmapButton="PR_BitmapButton.21",
wc_ButtonEdit="WPfne210",
wc_dateEdit="WPdate210",
wc_spinEdit="WPCNT210",
wc_wpClient="WordPerfect.21.0",
wc_MainDocumentWindow="WPDocClient",
wc_updateStatic210="WPUpdateStatic210",
wc_dialog1="#32770",
wc_dialog2="#32771",
wc_static1="wPStatic210", ; border descriptions use this
wc_StatusBar = "WPTBarWindowClassWP",
wc_popout="WPpopoutbutton.7.32",
wc_WPpopoutwindow = "WPpopoutwindow.7.32",
wc_mru="MRU210",
;wc_pfpMru="PFPI210_MRU",
;wc_pfpPreselButton="PFPpreselButton210",
wc_static="static",
WC_PageSetup = "PFDlgPropPage210",
Wc_Tooltip= "WPCBTAText210",
Wc_toolbar="WPBBar210",
wc_treeview="sysTreeview32",
wc_WPvscrollListBox = "WPvscrollListBox.7.32", ; used in the Paragraph, Page border style/fill dialogues.
wc_edit="edit",
wc_EqnWinClass = "EQNWINCLASS", ; found in the equation editor.
wc_WPLB="WPlb210"

globals
int WP21HasRunOnce,
int suppressEcho,
int SubpressLastModifyCombo,
int LastModifyFirstTime,
int GlobalPowerBar,
; used within the WpWin binary.
int globalInTableFlag,
string GlobalPriorStyle,
int globalDetectTables,
int globalDetectStyleChanges,
int globalDetectLanguages,
int globalDetectBorders,
int globalDetectPageAndColumnBreaks,
string globalDefaultLanguage,
int globalMultipleColumns,
; to prevent double-speaking
int giIgnoreActiveItemChange

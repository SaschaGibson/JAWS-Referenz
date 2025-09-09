; Build 3.7.10.001
; JFW 3.7 Header File for Wordperfect 8
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Build WP370830 by Joseph K Stephen Last Modified on April 20, 2000
; Special thanks for reference information from Marco Zehe OmniPc Germany.

; General constants and globals
const
; jsi filename
jsiFileName="wp.jsi",
; application keys:
hKey_PageAndColumnBreakDetection="PageAndColumnBreakDetection",
hKey_detectTables="DetectTables",
hKey_detectStyleChanges="DetectStyleChanges",
hKey_detectBorders="DetectBorders",
hKey_detectLanguages="DetectLanguages",
; Eloquence Language strings
eloqAmericanEnglish="American English",
eloqBritishEnglish="British English",
eloqFrench="French",
eloqGerman="German",
eloqItalian="Italian",
eloqCastilianSpanish="Castilian Spanish",
eloqLatinAmericanSpanish="Latin American Spanish",
; Control IDs
CId_DocumentWindow = 4297,
CId_StatusBar = 4398,
CId_FontWindow = 34023,
CId_PointSizeWindow = 34025,
CId_StyleWindow = 34027,
cId_StyleCombo=4101,
cId_fontCombo=1001,
CId_MisspelledWindow = 34132,
; for Spell Checker
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
; Window classes
wc_wpClient="WordPerfect.8.32",
wc_MainDocumentWindow="WPDocClient",
wc_dialog1="#32770",
wc_dialog2="#32771",
wc_static1="wPStatic80", ; border descriptions use this
wc_StatusBar = "WPTBarWindowClassWP",
wc_popout="WPpopoutbutton.7.32",
wc_mru="MRU80",
wc_pfpMru="PFPI80_MRU",
wc_pfpPreselButton="PFPpreselButton80",
wc_static="static",
WC_FindAndReplace = "WPWin_FINDDLG_WPWin",
WC_PageSetup = "PFDlgPropPage80",
Wc_Tooltip= "WPCBTAText80",
Wc_toolbar="WPBBar80",
; strings used in Window Name and string contains
wn1 = "Spell Checker",
wn2 = "Grammatik",
wn3 = "Thesaurus",
wn4="Find and Replace", ; for the Find and Replace Dialog.
wn5="Font Properties",
wn6="Font", ; font page of Font Properties multipage dialog
wn7="Underline", ; Underline page of Font Properties multipage dialog.
wn8="PerfectExpert",
wn9="Create New",
wn10="Work On",
wn11="Open File", ; open file dialog
wn12="Save As", ; Save As dialog
wn13="Properties", ; File Properties multipage dialog
wn14="Summary", ; summary tab
wn15="Information", ; information tab
wn16="Page Setup",
wn17="Size",
wn18="Margins/Layout",
wn19="Paragraph Border/Fill",
; colors:
colorRed="red",
colorWhite="white",
colorBlue="blue",
colorBlack="black",
; symbols:
scrollDownSymbol="Scroll Down Symbol",
; Braille representations
BRLTbl="tbl ",
; for status line search
WPPageNo="Pg",
WPPos="Pos"

globals
int WP8HasRunOnce,
int globalInTableFlag,
string globalBRLTableCell,
string globalTablePriorCoordinates,
string GlobalPriorStyle,
string globalPriorLanguage,
int globalDetectTables,
int globalDetectStyleChanges,
int globalDetectLanguages,
int globalDetectBorders,
int globalBorderedParagraph,
int globalBorderedPage,
int globalPriorPageNumber,
int globalPriorTextColumnNumber,
int globalDetectPageAndColumnBreaks,
int suppressEcho,
string globalDefaultLanguage

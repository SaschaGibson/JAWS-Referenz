; Build 3.71.05.001
; JFW 3.7 Script Globals and Constants for Microsoft Visual Basic 6.0
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Written by Joseph K Stephen
; Build vb3710533 Last modified on 6 October 2000

const
; custom window types
wt_designer=1,
wt_code_win=2,
; Verbosity Items
StrVB6VerbosityItems="|ToggleReadWholeCodeLine:Read Code Line When Partially Visible|toggleOverlapAlert:Alert When Controls Overlap",
StrNotVB6IdeVerbosityItems="|incrementMovementUnit:Increment Control Movement Unit|decrementMovementUnit:Decrement Control Movement Unit",
;jsi filename and section
jsiFilename="vb6.jsi",
hKey_ControlMovementUnit="ControlMovementUnit",
hKey_DetectOverlappingControls="DetectOverlappingControls",
hKey_ReadWholeCodeLine="ReadWholeCodeLine",
; indent unit used in menu editor to determine a menu item's level
indentUnit=12, ; 12 pixels per level.
; Window Cclasses
wc_thunderForm="ThunderForm",
wc_thunderUserControl="ThunderRT6UserControlDC",
wc_thunderFormDC="ThunderRT6FormDC",
wc_vbBubble="vbBubble", ; toolbox tooltips
wc_thunderRt6Listbox="ThunderRT6ListBox",
wc_PropertiesAndMethodsList="NameListWndClass",
wc_vbaWindow="vbaWindow",
wc_toolsPalette="ToolsPalette",
wc_f3server="F3 Server 60000000",
wc_vbaToolbox="F3 minFrame 60000000",
wc_thunderRT6Frame="ThunderRT6Frame", ; used in forms and wizards
wc_popupTipWndClass="PopupTipWndClass",
wc_propertiesStatic="wndclass_pbrs",
wc_openListView="openListView", ; for save as /open
; Control IDS
cId_ObjectsCombo=2800,
cId_MembersCombo=2801,
cId_ObjBrowserLibraries=3008,
cId_objBrowserSearch=1001,
cId_objBrowserClasses=1,
cId_objBrowserMembers=2,
cId_objBrowserDefinition=5000,
cId_PropertiesList=4098,
cId_propertiesValueEdit=4100,
cId_propertiesObjectCombo=4096,
cId_propertiesOrderTab=4097,
; Menu Editor Controls
cId_MnuEdCaption=4512,
cId_MnuEdName=4519,
cId_MnuEdIndex=4516,
cId_MnuEdShortcut=4511,
cId_MnuEdHelpContextId=4525,
cId_MnuEdNegotiatePosition=4510,
cId_MnuEdEnable=4515,
cId_MnuEdVisible=4523,
cId_MnuEdWindowList=4524,
cId_MnuEdMoveLeft=4526,
cId_MnuEdMoveRight=4527,
cId_MnuEdMoveUp=4528,
cId_MnuEdMoveDown=4529,
cId_MnuEdNext=4520,
cId_MnuEdInsert=4517,
cId_MnuEdDelete=4514,
cId_MnuEdList=4518,
cId_MnuEdOk=4521,
cId_MnuEdCancel=4522,
; App Wizard Intro screen:
cId_OpenProfile=1,
; Control IDS for App Interface Type screen of Ap Wizard
cId_mdi=41,
cId_sdi=42,
cId_explorer=43,
; Control Ids for Menu Screen Of App Wizard
cId_menuAdd=26,
cId_menuDel=34,
cId_menuUp=27,
cId_menuDown=28,
cId_SubmenuAdd=30,
cId_SubmenuDel=35,
cId_submenuUp=31,
cId_submenuDown=32,
; Internet Connectivity screen of App Wizard
cId_yesCheckbox=11,
cId_noCheckbox=13,
; Standard Forms screen of App Wizard
cId_formTemplates=9,
; Finish screen of App Wizard
cId_saveProfile=1,
; Wizard Manager
cId_wizTmpMoveAllStepsOffScreen=6,
cId_wizTmpAddStep=3,
cId_wizTmpInsertStep=2,
cId_wizTmpRefreshListOfSteps=7,
cId_wizTmpMoveStepDown=4,
cId_wizTmpMoveStepUp=5,
; movement units for controls
minMovementUnit=10,
maxMovementUnit=100,
; Braille constants
brlSuggestionCodeDelimiter="-",
brlLeftParen="(",
brlRightParen=")",
; Implements screenStableEvent
stabilizeTime=2, ; the time after the last screen write before screen is deemed stable
JFWScreenStableEvent="screenStableEvent",
notSelected="not selected" ; used to compare value returned from GetObjectValue in open/save as listview

globals
int isVB6Ide,
int globalControlMovementUnit,
int globalDetectOverlappingControls, ; flag to announce overlapping controls during form design
int globalReadWholeCodeLine,
int globalVB6HasRunBefore,
int focusChangeTriggered,
handle globalQuickInfoHandle, ; Quick Info/Parameter Info Tip Window handle
int globalScreenStableEventScheduled,
string globalPriorWizardScreenTitle,
string globalBrlControl, ; Braille control representation on designers
string globalBrlControlOverlapDesc, ; overlap description representation
int globalDesignerActive, ; used in BrailleBuildLine when a designer which can support Braille is active
int globalCodeWindowActive, ; used in BrailleBuildLine when code window is active
string globalCodeSuggestion, ; used for tracking the code suggestion in Braille when autoComplete is active
int globalSuggestionCol, ; x-coordinate of suggestion for Braille click
int globalSuggestionRow, ; y-coordinate of suggestion for Braille click
int globalPriorMenuLevel ; used in menu editor

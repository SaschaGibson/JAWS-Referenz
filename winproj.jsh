; Copyright 1995-2015 Freedom Scientific, Inc.
; build 6.10.798
; Microsoft Project 2000 Script Header
; JAWS for Windows 6.1
; Build PJ3710518 by Joseph Kelton Stephen last modified 28 September 2000
; last updated March 10, 2005 by Olga Espinola

const
; for non-standard multipage dialogs:
	icTaskInformationPages=5,  ; number of pages in the Task Information dialog
	icOptionsPages=9,  ; number of pages in the Options dialog


; jsi section and keys
jsiFileName="project.jsi",
hKey_AnnounceDependencies="AnnounceTaskDependencies",
hKey_AnnounceOutlineLevel="AnnounceTaskOutlineLevel",
hKey_IndicateNotes="IndicateTaskOrResourceHasNotes",
hKey_AnnounceStatusInfo="AnnounceStatusInformation",
hKey_SelectionVerbosity="SelectionVerbosity",

; verbosity settings for Selection Verbosity
verbosityNormal=0,
verbosityTerse=1,

; MSAA Modes
MSAALevel2=2,
MSAAOff=0,

; max fields (readable using alt+numbers row
maxFields=10,

; Window Classes
wc_winProjDialog="JWinproj-MLSDialog",
wc_ProjectGrid="JWinproj-GridClass",
wc_gridEditCombo="JWinProj-Edit",
wc_Pert="JWinProj-PERT", ; network diagram
wc_relationshipDiagram="TP_class",
wc_ResourceGraph="jWinproj-resHist", ; Resource graph
wc_MonthCal="SysMonthCal32",
wc_monthBox="JWinproj-WhimperMonthBox",
wc_openListView="openListView", ; for save as /open
wc_MsoUniStat="MsoUniStat",
wc_msoCommandBar="MsoCommandBar",
wc_sdm="_sdm_",

; Control Ids
cId_changeToEdit=12, ; spelling dialog change to does not work if MSAA Mode is set to 2.
cId_browserToolbar=59392, ; Browser Toolbar id
cId_DeadLine=30,
cId_Priority=22,
cIdOptionsViewFirstCtrl=13,
cIdOptionsGeneralFirstCtrl=21,
cIdOptionsSaveFirstCtrl=11,
cIdOptionsCalendarFirstCtrl=6,
cIdOptionsCalculationFirstCtrl=15,
cIdOptionsWorkgroupFirstCtrl=4,
cIdOptionsSpellingFirstCtrl=5,

; Value used to compare with result of GetObjectValue in open/save as listview
notSelected="not selected",

; calendar colors
calSelectedDayText="255255255", ; white
calSelectedDayBackground="255255255" ; selected day background color

globals
int iGlobalMsProjFirstTime,
int iGlobalPriorTaskId, ; used to determine if the task in the grid has changed
int iGlobalPriorResourceId, ; used to determine if the resource in the grid has changed
int iGlobalPriorTaskOutlineLevel, ; tasks can be at different levels showing task dependencies.
int iGlobalFocusChangeCalled, ; determines if the focus changed when the tab or shift tab was pressed
int iGlobalAnnounceDependencies, ; announce task dependency counts
int iGlobalAnnounceOutlineLevel, ; announce task outline level
int iGlobalIndicateNotes,
int iGlobalAnnounceStatusInfo,
int iGlobalExtendedSelectionMode, ; tracks state of extended selection mode
int iGlobalSelectionVerbosity, ; normal or terse
string sLastSelectedField,
int iPriorSelectionRowCount, ; used to track how many tasks or resources are selected
int iPriorSelectionFieldCount, ; used to determine if selecting or unselecting
string sLastSelectedFieldName,
string GlobalNonStandardDlgName,
string TaskInformationPageNames,
string OptionsPageNames,
handle GlobalRealWindow,
string GlobalRealName,
handle GlobalFocusWindow,
int GlobalSayOpenListViewItem,
int GlobalSayStabilizedOpenListViewItem

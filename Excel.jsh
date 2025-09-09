; Copyright 1995-2022 Freedom Scientific, Inc.
; JAWS common header file for Excel.

Const
;status bar modes:
	Excel_status_unknown = 0,
	Excel_status_ready = 1,
	Excel_status_edit = 2,
	Excel_status_enter = 3,
	Excel_status_point = 4,
	Excel_status_comment = 5,
	Excel_Status_ExtendedSelection = 6,
	Excel_status_AddSelectedRange = 7,
;added Titles Override constants:
	OVERRIDE_TITLES_OFF = 0,
	OVERRIDE_TITLES_ALL = 1,
	OVERRIDE_TITLES_FILE = 2,
;added to section names of user defined rather than document named titles:
	UserDefinedTag="UserDefined",
	;localizers should add localized version of next string.
	scTitleRegionRangeName="titleregion",
; excel versions
	verExcel2000=9,
	VerExcelXP=10,
	VerExcel2003=11,
	verExcel2007=12,
	verExcel2010=14,
	verExcel2013=15,
;list delimiters
	csList_Delim="|",
;list test string
	csListTest="xxx",
; title reading constants
	readNoTitles=0,
	readColumnTitles=1,
	readRowTitles=2,
	readBothTitles=3,
;Title Restriction constants
	restrictTitlesOff=0,
	restrictTitlesRightAndBelow=1,
	TitleForCellsRightAndBelow = 0,
	TitleForCellsAny = 1,
; Selection reading verbosity
	readFirstAndLastCellInSelectionOnly=0,
	readSelectedRange=1,
; Cell Reading Verbosity
	readCellContentsOnly=0,
	readCellContentsAndCoordinates=1,
; Point Mode Verbosity
	PointModeVerbosity_None=0,
	PointModeVerbosity_CellContent=1,
	PointModeVerbosity_FormulaValue=2,
	PointModeVerbosity_CellContentAndFormulaValue=3,
;Braille Structured Modes:
	XL_CELL_VIEW=0,
	XL_ROW_VIEW=1,
	XL_COL_VIEW=2,
	XL_ROW_WITH_COLTITLES_VIEW=3,
	XL_PRIOR_AND_CUR_ROW_VIEW=4,
;JSI Assoc methods
	ASSOC_EXACT_MATCH=0,
	ASSOC_BEST_match=1,
	ASSOC_NEW_MATCH=2,
; jsi filename
	jsiFileName="excelSettings.jsi",
	jsiUserFileName="excelUserSettings.jsi",
	jsiWorkbookFile="excel_%1.jsi", ; %1=workbook name
; jsi section for app specific settings
	Section_AppVerbositySettings="Application Verbosity Settings",
; sections for worksheet specific settings
	section_cellMarker="CellMarker",
	;new for refactir:
	section_cellMarkers = "CellMarkers",
	Section_worksheetGeneral="General",
	Section_monitorCells="MonitorCells", ; up to ten monitor cells can be stored for a given worksheet.
; keys for Application Verbosity Settings section
	HKEY_SMART_TAGS = "DetectSmartTags",
	HKEY_OBJECTS_COUNT = "DetectObjectCount",
	hKey_HyperlinkAddressAnnouncement="HyperlinkAddressAnnouncement",
	hKey_DetectFilters="DetectFilters",
	hKey_DisplayChartInVirtualViewer="DisplayChartInVirtualViewer",
	hKey_CellReadingVerbosity="CellReadingVerbosity",
	hKey_SelectionReadingVerbosity="SelectionReadingVerbosity",
	hKey_DetectCellNumberFormatChange="DetectCellNumberFormatChange",
	hKey_DetectCellBorderChange="DetectCellBorderChange",
	hKey_BrailleMode="BrailleMode", ; only relevant when Structured Mode is on
	hKey_SettingsFileAssoc="SettingsFileAssoc", ; exact or best match
	hKey_MonitorCellTitles="MonitorCellTitles",
	hKey_NamedTitlesApp="NamedTitles",
; each of the following will be stored in a workbook specific jsi under the worksheet and region name or in a worksheet general section
	hKey_DisallowPerformanceImpactingFeatures="DisallowPerformanceImpactingFeatures",
	hKey_TitleCellFontAndFormattingIndication="TitleCellFontAndFormattingIndication",
	hKey_OrientationIndication="OrientationIndication",
	hKey_CellMarker="Marked Cell",
	hKey_PagebreaksDetection="DetectPagebreaks",
	hKey_FormControlsDetection="DetectFormControls",
	hKey_ShadingChanges="ShadingChanges",
	hKey_FontChanges="FontChanges",
	hKey_CelltextVisibility="CellTextVisibility",
	hKey_FormatConditionsDetection="FormatConditionsDetection",
	hKey_hasRegionBoundaries="RegionBoundaries",
	hKey_MultipleRegionSupport="MultipleRegionSupport", ; determines if simple Title Reading as in JFW 3.5 or multiple Title Reading as in JFW 3.70.47.
	hKey_TitleReadingVerbosity="TitleReadingVerbosity",
	hKey_TitleRestrictionVerbosity="TitleRestrictionVerbosity",
	hKey_TitleSpeaksForCells = "TitleSpeaksForCells",
	hKey_TitleColStart="TitleColStart",
	hKey_TitleColEnd="TitleColEnd",
	hKey_TitleRowStart="TitleRowStart",
	hKey_TitleRowEnd="TitleRowEnd",
	hKey_regionLeft="RegionLeft",
	hKey_regionTop="RegionTop",
	hKey_regionRight="RegionRight",
	hKey_regionBottom="RegionBottom",
	hKey_RowTotalAutoFind="AutomaticallyFindRowTotal",
	hKey_ColumnTotalAutoFind="AutomaticallyFindColumnTotal",
	hKey_TotalsColumn="TotalsColumn", ; column total for row
	hKey_TotalsRow="TotalsRow",; row total for column
	hKey_MonitorCell="MonitorCell%1", ; %1=cell number
	hKey_StoredCoordinates="StoredCoordinates", ; used to return to cell prior to relocation to a monitor cell
	hKey_NamedTitlesFile="NamedTitles",
	hKey_Formulas="Formulas",
	hKey_Comments="Comments",
	hKey_mergedCells="MergedCells",
	excel_jcf="excel.jcf",
	hKey_MaxChartDataPoints="MaxChartDataPoints",
	hKey_MaxChartLegendLen="MaxChartLegendLen",
; maximum number of Monitor Cells
; note changing this constant will not necessarily immediately allow
;more monitor cells.
	maxMonitorCells=10,
; window classes
	wc_XLMain = "XLMAIN",
	wc_bosa_sdm="bosa_sdm_XL9",
	wcExcelLess="EXCEL<",
	wcXLDesk="XLDESK",
	wcExcele="EXCELE",
	wcExcelColon="EXCEL:",
	wcExcelSemicolon="EXCEL;",
	wcEDTBX="EDTBX", ; was wc3
	wcExcel4="excel4",
	wcExcel6="EXCEL6",
	wcExcel7="EXCEL7",
	wcChartClass="ExcelC",
	wcExcelEquals="Excel=",
	wcXLAcoOuter = "__XLACOOUTER",
;Automation ID's
	AutomationID_LegacyComment = "Legacy Comment",
	AutomationID_Comment = "cardEditor_5_",;prefix for comment edit
	AutomationID_Dropdown = "Dropdown",
; Control IDS
	cId_AddinsListbox2000=20,
	cId_AddInsListbox=17, ; for xp and higher
	cId_openButton=31, ; Word 2000 (used in screen sensitive help to tell user about context menu)
	cID_HistoryButton=28, ; Excel 2000
	cId_HistoryXPButton=34,
	cId_BackButton=30,
	cId_BackXPButton=36,
	cId_FolderCombo=25, ; SDM control id of folder to save in or look in Office 2000
	;cId_AddInsListbox=17, ; for xp and higher
	;cId_HistoryButton=34,
	;cId_BackButton=36,
	cId_NotInDictionary_EditBox=17, ; Excel 2000
	cid_suggestionList=18,
	cId_msoGenericControlContainer=4686, ; Excel 97 Cell Format dialog for color button menu
; Cell Format, Border page
	cId_borderColorMenu=5417,
	cId_borderStyleNone=5600, ; different styles go from 5601 to 5613
	cId_borderStyleLast=5613,
	cId_BorderPresetNone=101,
	cId_borderPresetOutline=103,
	cId_borderLeft=108,
	cId_borderTop=109,
	cId_borderBottom=110,
	cId_borderRight=111,
	cId_borderBackDiagonal=114,
	cId_borderForwardDiagonal=115,
	cId_PatternColorPalette=120,
	cId_patternButtonMenu=122,
;control ID's in the Page Setup dialog:
	cID_PageOrientationPortraitRadioButton=17,
	cID_PageOrientationLandscapeRadioButton=18,
	cID_PercentNormalSizeSpinBox=21,
	cID_PagesWideSpinbox=22,
	cID_PagesTallSpinbox=23,
	cID_CenterOnPageHorizontallyCheckBox=41,
	cID_CenterOnPageVerticallyCheckBox=43,
	cID_PrintGridlinesCheckBox=55,
	cID_PrintBlackAndWhiteCheckbox=56,
	cID_PrintDraftQualityCheckbox=57,
	cID_PrintRowAndColumnHeadings=58,
	cID_PrintPageOrderDownThenOver=60,
	cID_PrintPageOrderOverThenDown=61,
;data validation dialog:
	cId_StartValueEdit = 23,
	cId_EndValueEdit = 25,
; for Customize dialog:
	cId_CustomizeMenuListbox=25,
	cId_CustomizeXPMenuListbox=29, ; XP
	cId_Customize11MenuListbox=28, ; 2003
	cId_CustomizeToolbarListbox=18, ; Excel 2000 and 2003
	cId_CustomizeXPToolbarListbox=19, ; xp
	cId_DataRange=18, ; for data range control in Source Data SDM dialog for charts.
	cId_SeriesValues=5570, ; for series page of Source Data dialog values control
	cId_StandardChartType=18,
	cId_CustomizedChartType=35,
; keycodes for KeyPressedEvent
	kiLeftCTRL2=0x403, ; 1027 in dec
	kiRightCTRL2=0x103, ;259 in dec
	kiLeftCtrl3=0x404, ;1028 in dec
	kiRightCtrl3=0x104, ;260 in dec
	kiLeftCtrl4=0x405, ;1029 in dec
	kiRightCtrl4=0x105, ;261 in dec
	kiLeftCtrl5=0x406, ;1030 in dec
	kiRightCtrl5=0x106, ;262 in dec
	kiF2=0x3C, ;60 in dec
	kiEquals=0xD, ;13 in dec
	kiShiftF4=0x20003E, ; 2097214 in dec
; file name constant for loading Microsoft Outlook from Excel:
	MsOutlook="microsoft outlook",
; for default value of cell range to show parsing between first and last cell text values
; appears in edit control for adding custom label when user selects more than one cell to include in the label.
	cs_elipsis=" ... ",
; function names
	fn_MoveToCell="self::MoveToCell(%1,\"%2\")", ; %1 is the cell address, %2 is the sheet name.
; string compares
	scRedNumber="[Red]",
	scOperatorDelimiters="|+|-|*|/|%|^|<|>|<>|<=|>=|&|:|,|=| ",
;command bars
	CBFormatting="formatting"

Globals
	int Excel_StatusBar_Mode,  ;updated when the Excel input mode changes, as shown on the status bar
;for detecting initial run of Excel:
	int giExcelHasRunOnce,
;For determing the version of Excel:
	int giExcelVersion,
;for editing cells in 2007 or later:
	INT gbEditingCell,
;for formula bar
	Handle ghFormulaBar,
	string gsCellContentForFormulaBar,
	string gsFormulaValueForFormulaBar,
;for when highlight window has the focus under certain circumstances:
;The class is EXCEL:.
;These include the filter window for all versions when the list is opened by pressing Alt+DownARrow.
;or in 2007 only when entering a formula and the functions list drops down automatically to allow autocommpletion.
;or in 2010 only when entering a formula and the functions list drops down automatically to allow autocommpletion.
	handle ghSysListview32,
;These include the filter window for versions prior to 2007 when the list is opened by pressing Alt+DownARrow.
	handle ghExcelColon,
;flag to determine whether the current function was called directly from a script:
	int gbSetTitlesFromScript

;for selection event to determin selection direction:
const
	SelectionDirection_Forward = 1,
	SelectionDirection_Backward = 2,
; Do not localize this it must match the filenames in the installer for the JBS files minus the jbs extension
	cExcelClassicJBSBase="ExcelClassic"

;Event timing variables are used to prevent double speaking:
globals
	int globalInEditCommentJAWSDialog,
	int gbReadSelectedCellsAfterWorkbookDataIsUpdated,
	int gbAlertNewTextInFormulaBar,
	int LastFocusChangeTime,
	int LastExcelSelectionChangeTime,
	int LastTableNavTime

globals
	string gCurrentSheetID  ;Set when sheet changes, comparison detects if the new sheet matches or not.

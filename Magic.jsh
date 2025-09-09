const
; Control ID constants
	ID_MAGIC_UI_STATUSBAR = 59393,
	ID_SERIAL_NUMBER_FIELD = 4215,
	ID_TIME_REMAINING_EDIT = 4228,
	ID_TIME_REMAINING_STATIC = 4219,
;window names:
	wnAltTab = "#32771",
;Window classes:
	wc_help_popup = "hh_popup",
;maximum level of magnification supported by MAGic:
	MAG_MAX_LEVEL = 6000,
;  Constant to set the maximum level of magnification at which the MAGic focus rectangle will attempt to include
;  the text and the icon associated with the text in a list view.
	ListViewIconMax = 10,
;  Constant to set the maximum level of magnification at which the MAGic focus rectangle will attempt to include
;  the control and the static text associated with the control in a dialog box.
	DialogControlAndPromptMax = 10,
;  Constant to set the list of window types to allow MagSetFocusRect to act in
	WindowTypeListR = "3|41|42|43",
;  Constant to set the list of window classes to allow MagSetFocusRect to act in
	WindowClassListR = " Internet Explorer_Server | TClipDoc | _Wwg | _WwG | ConsoleWindowClass | OKttbx | EXCEL6 | EXCEL7 | WPDocClient",
;  Constant to set the list of window classes in which to call MagSetFocusItem in the arrow key scripts
	NewTextSetFocusWindows = "WT_4 | WT_33 | WT_38 | #32771 | bosa_sdm_Microsoft Word 8.0 | bosa_sdm_Mso96 | bosa_sdm_XL8 | ComboLBox | ComboBox | rctl_renwnd32 | SUPERGRID | SysTreeView ",

; Window names used in the MAGic Tracking functions
	mWN_MAppWin = "MAGic Screen Magnification",
	mWN_IEWin = "Internet Explorer_Server",
	mWN_OfficeBar = "MsoCommandBar",
	mWN_STV32 = "SysTreeView32",
	mWN_SPG = "SUPERGRID",
	mWN_ListBox = "ListBox",
	mWN_STV = "SysTreeView",
	mWN_WP = "WP",
	mWN_AltTab = "#32771",
	mWN_Winword1 = "_WwG",
	mWN_Winword2 = "_Wwg",
	mWN_Access = "OKttbx",
	mWN_OE5_ATL = "ATL:SysListView32",
	mWN_SysProperties = "System Properties",
	mWC_BosaSDM = "bosa_sdm",
	NotePadApp = "Notepad.exe",
	strWT_ = "WT_",
	strSLV = "SysListView",
	mWN_ComboLBox = "ComboLBox",
	mWN_ComboBox = "ComboBox",
	mWC_Edit = "Edit",

; MAGic builtin function constants
; Tracking Alignment
	TRACK_ALIGNMENT_EDGE = 0,
	TRACK_ALIGNMENT_CENTER = 1,
	TRACK_ALIGNMENT_CONTINUOUS = 2,
	TRACK_ALIGNMENT_PREDICTIVE = 3,
;window classes
mwc1 = "RichEdit20W",
mwc2 = "bosa_sdm",
mwc3 = "SUPERGRID",

; Color Mask Attributs
    COLOR_NORMAL = 0,
    COLOR_INVERTED = 1,
    COLOR_MASKED = 2,
; Enhancement Schemes:
	MouseEnhancementScheme = "Mouse_Scheme",
	CursorEnhancementScheme = "Cursor_Scheme",
	ColorEnhancementScheme = "Color_Scheme"


Globals
	int GlobalSpeakEnhancementsTimer, ; scheduler for MAGic next / prior enhancements scripts
	string globalEnhancementSchemeType, ; the key name from default.mcf
	Int TargetItem,
	Int TheTypeCode,
	Handle cwHandle,
	Handle nteHandle,
	Int cwLeft,
	Int cwTop,
	 String cwButtonLabel,
	Int MagMenuMode  ; The menu mode


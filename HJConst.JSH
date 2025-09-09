; Copyright 1995 - 2024 by Freedom Scientific, Inc.
; JAWS header file of HJ constants
;do not add your own constants to this file,
;you can create a new header file with your own constants.

include "HJIni.jsh"

const
;Framework ID's
	FrameworkID_WPF = "WPF",
;Activity IDs for UIANotificationEvent and other related events:
	Activity_ID_Notification_Volume = "DB56CBE9-2CA4-4E60-BB92-3DE45FDF5761",
	Activity_ID_Notification_Volume_Win11 = "Windows.Shell.VolumeAnnouncement",
	Activity_ID_Notification_InputSwitch = "Windows.Shell.InputSwitch.SwitchNotification", ;When switching keyboards with ALT+SHIFT
	Activity_ID_Notification_WindowSnap = "Windows.Shell.SnapComponent.SnapHotKeyResults", ;When snapping, maximizing, or restoring a window with Windows+ArrowKey
;The following is maximum number,
;of items to speak with SaySelectedText,
;to prevent speaking the entire list:
	LV_SELECTION_MAX = 25,
;name of folder containing scripts
	FolderName_Scripts = "Scripts",
; Script Name constants
	csnAdjustJawsVerbosityScript="AdjustJawsVerbosity",
	csnEnterScript="Enter",
	csnHotKeyHelpScript="HotKeyHelp",
	csnJawsEndScript="JawsEnd",
	csnJawsHomeScript="JawsHome",
	csnKeyboardHelpScript="KeyboardHelp",
	csnRightMouseButton="RightMouseButton",
	csnRunJAWSManagerScript="RunJAWSManager",
	csnSayLineScript="SayLine",
	csnSayNextCharacterScript="SayNextCharacter",
	csnSayNextLineScript="SayNextLine",
	csnSayPriorCharacterScript="SayPriorCharacter",
	csnSayPriorLineScript="SayPriorLine",
	csnScreenSensitiveHelpScript="ScreenSensitiveHelp",
	csnScriptFileNameScript="ScriptFileName",
	csnShiftTabKeyScript="ShiftTabKey",
	csnTabKeyScript="TabKey",

;Sounds folder:
	SoundsFolder = "Sounds",

;SMF file:
	smfFileExt="smf",
;JCF file:
	jcfFileExt="jcf",
	file_default_jcf = "default.jcf",
;	hKey_VirtualCursor = "VirtualCursor",
	hKey_ElementAttribAnnounce = "IndicateElementAttributes",
	hKey_Frames = "Frames",
	hKey_InlineFrames = "InlineFrames",
	hKey_Heading = "Heading",
	hKey_Lists = "Lists",
	hKey_Tables = "Tables",
	hKey_WhichTable = "WhichTable",
	hKey_HTML_HeadingIndication = "HeadingIndication",
	hKey_HTML_ShowFlash = "ShowFlash",
	hKey_Punctuation = "Punctuation",
	hKey_VPCENHANCEDCLIPBOARD = "VirtualCursorEnhancedClipboard",
	hKey_TETHER = "TetherJAWSToPC",
	DefaultJCFFile = "Default.jcf",
	hKey_Caps = "capital",
	hKey_NumLock="numlock",
	hKeySchemeName="Scheme",
	hKey_Scroll = "scroll",
;jsi file names and keys:
JSIFileName_Virtual = "virtual.jsi",
sVirtualOptions = "Virtual Options",
	hKey_SayAllOnDocumentLoad = "SayAllOnDocumentLoad",
	hKey_SayAllOnDocumentLoadFusion = "SayAllOnDocumentLoadFusion",
	hKey_VCursorCellCoordinatesAnnouncement = "VCursorCellCoordinatesAnnouncement",
	HKEY_BRL_MARKING="BrailleShowMarking",
	hKey_Braille_BrailleMode = "BrailleMode",
		hKey_Braille_BrailleMoveActiveCursor = "BrailleMoveActiveCursor",
	hKey_Braille_BrailleAutoRouteToCursor = "BrailleAutoRouteToCursor",
	hKey_Braille_BrailleMessages = "BrailleMessages",
	hKey_Braille_BrailleKeyInterruptSpeech = "BrailleKeyInterruptSpeech",
	hKey_Braille_BrailleShowMarking = "BrailleShowMarking",
	hKey_Braille_EightDotBraille = "EightDotBraille",
	hKey_Braille_BraillePanMode = "BraillePanMode",
	hKey_Braille_BraillePanIncrement = "BraillePanIncrement",
	hKey_Braille_WordWrap = "WordWrap",
	hKey_Braille_AutoPanMode = "AutoPanMode",
	hKey_Braille_Grade2SuppressCapitalSigns = "Grade2SuppressCapitalSigns",
	hKEY_Braille_SHOW_TIME_IN_STATUS_CELLS="ShowTimeInStatusCells",
hKEY_Braille_VerticalAlignment="VerticalAlignmentDelimiters",
hKey_Braille_Multitranslation="SplitTranslationLine2",
hKey_BRAILLE_MultilineView="MultilineView",
hKey_BRAILLE_CROPPED_MODE="CroppedMode",
hKey_BRAILLE_SPLIT_DATA_LINE="SplitDataLine",
hKey_BRAILLE_SPLIT_BUFFER_UNIT="SplitBufferUnit",
hKey_BRAILLE_SPLIT_AUTO_REBUFFER="AutoRebuffer",
;Synth Enumeration constants(Not translated)
	FILE_SYNTH="\\jfw.ini",;where the synth information for installed synths is stored
	hKey_SynthX="synth",;Enum through list
;What follows are the four appended strings to the key after the synth value is enumerated
	hKey_Name="Name",
	hKey_LongName="LongName",
	hKey_Port="Port",
	hKey_Driver="Driver",

;Fusion QuickAccessBar
	QuickAccessBarExe="QuickAccessBar.exe",

;file/section/key constants for MyLocation.jsi
	FILE_MY_LOCATION = "MyLocation.jsi",
	SECTION_LOCATION = "Location",
	HKEY_ZIPCODE = "ZipCode",
	HKey_PREFERRED_BRL_PROFILE_LIST="PreferredBrailleProfiles",
;generic rule file constants for reading the rule set friendly name:
;Table Constants
	TBL_HEADER_ROW=1,
	TBL_HEADER_COL=2,
	TBL_HEADER_BOTH=3,
	TBL_HEADER_MARKED=4,
;Tutor and AccessKey Constants
	TUTOR_ALL=1,
	TUTOR_CUSTOM_ONLY=2,
	ACCESS_KEY_ALL=1,
	ACCESS_KEY_MENUS=2,
	ACCESS_KEY_DIALOGS=3,
; IME Conversion Mode Constants
	imeCModeUnknown=0,
	imeCModeInactive=1,
	imeCModeOff=2,
	imeCModeAlphaHalf=3,
	imeCModeAlphaFull=4,
	imeCModeKatakanaHalf=5,
	imeCModeKatakanaFull=6,
	imeCModeHiraganaHalf=7,
	imeCModeHiraganaFull=8,
;Run Constants for
;The managers
	;For JConfig_Run, %1 = TheJAWSDirectory,
	;%2=Config Manager's exec name,
	;%3=Config Manager flag
	;%4=parameter info for %3
	;%5=Second parameter flag
	;%6=parameter 2's info
	;%7=Parameter 3
	;JConfig_Run="\"%1\\%2\" %3\"%4\" %5\"%6\" %7",
	;JConfig_Color_Run = "\"%1\\%2\" %3\"%4\" %5\"%6\" %7\"%8\" %9",

	;For JConfig_Run_Ex
	; %1=full path to Config Manager EXE file,
	; %2=Config Manager flag
	; %3=parameter info for %3
	; %4=Second parameter flag
	; %5=parameter 2's info
	; %6=Parameter 3
	JConfig_Run_Ex= "\"%1\" %2\"%3\" %4\"%5\" %6",
	;JConfig_Color_Run_Ex = "\"%1\" %2\"%3\" %4\"%5\" %6\"%7\" %8",

	;For SettingsCenter_Run
	; %1=full path to Settings Center EXE file,
	; %2=SettingsCenter flag
	; %3=parameter info for %2
	; %4=Second parameter flag
	; %5=parameter 2's info
	; %6=Parameter 3
	SettingsCenter_Run = "\"%1\" %2\"%3\" %4\"%5\" %6",

	;For SettingsCenter_Run_Ex
	; %1=full path to Config Manager EXE file,
	; %2=Config Manager flag
	; %3=parameter info for %3
	; %4=Second parameter flag
	; %5=parameter 2's info
	; %6=Parameter 3
	SettingsCenter_Run_Ex= "\"%1\" %2\"%3\" %4\"%5\" %6",
	SettingsCenter_Color_Run_Ex = "\"%1\" %2\"%3\" %4\"%5\" %6\"%7\" %8",

	;For JDiction_Run,
	;  %1=full path to Dictionary Manager EXE file,
	;  %2=FLAG_APP
	;  %3=Active Configuration name
	;For JDiction_Run_Ex,
	;  %4=FLAG_RULE
	;  %5=Rule
	JDiction_Run   ="\"%1\" %2\"%3\"",
	JDiction_Run_Ex="\"%1\" %2\"%3\" %4\"%5\"",

	;For JKey_Run,
	;  %1=full path to Keybrd Manager EXE file,
	;  %2=FLAG_APP
	;  %3=Active Configuration name
	;NOTE: ;;; must have space between -a and appname
	JKey_Run = "\"%1\" %2 \"%3\"",

	;For JKey_Run_Domain,
	;  %1=full path to Keybrd Manager EXE file,
	;  %2=FLAG_APP
	;  %3=Active Application name
	;  %4=FLAG_DOMAIN
	;  %5=Active Domain name
	;NOTE: ;;; must have space between -a and appname
	JKey_Run_Domain = "\"%1\" %2 \"%3\" %4 \"%5\"",

	;For JScript_Run,
	;  %1=full path to Script Manager EXE file,
	;  %2=FLAG_APP
	;  %3=Active Configuration name
	;NOTE: ;;; must have space between -a and appname
	JScript_Run = "\"%1\" %2 \"%3\"",



;Authorization Constants
;These are returned by built-in authorization functions.
;Authorization Scheme strings
	SCHEME_EVERLOCK = "Everlock",
	SCHEME_SQS = "SQS",
	SCHEME_RESTRICTED = "Restricted",
	SCHEME_DEMO = "Demo",
	SCHEME_TIMED_DEMO = "TimedDemo",
	SCHEME_HJ_TRACK = "HJTrack",
	SCHEME_SSA = "SSA",
	SCHEME_SENTINEL_SP = "SentinelSP",
;Authorization categories by Language
	AUTHCAT_ERROR = 0,
	AUTHCAT_ENGLISH = 1,
	AUTHCAT_FRENCH_CANADIAN = 2,
	AUTHCAT_WESTERN_EUROPE = 3,
	AUTHCAT_SPANISH = 4,
	AUTHCAT_JAPANESE = 5,
	AUTHCAT_ALL_LANGUAGES = 6,
;Authorization of languages for scripts
	AUTHCAT_SCRIPT_ALL = 0,; any language
	AUTHCAT_SCRIPT_ENGLISH = 328,
	AUTHCAT_SCRIPT_ITALIAN = 318,
;End of Authorization Constants
; Clipboard constants
	CLIPBOARD_NONE = 0,
	CLIPBOARD_COPIED = 1,
	CLIPBOARD_CUT = 2,
	CLIPBOARD_APPENDED = 3,
; Key Codes
; Numeric Constants for Key Names
	key_Insert = 0x52,
	key_CapsLock = 0x3a,
	key_escape = 0x01,
	key_tab=0x0f,
	key_shift_tab = 0x80000f,
	key_ENTER = 0x1c,
	key_control=0x1d,
	key_semicolon=0x27,
	key_colon = 0x800027,
	key_leftShift=0x2a,
	key_RightShift=0x36,
	key_SPACEBAR = 0x39,
	key_delete=0x53,
	key_Control_Tab = 0x1000f,
	key_shift_control_tab = 0x81000f,
	KEY_LEFT_WINDOWS=0x5b,
	KEY_RIGHT_WINDOWS=0x5c,
	KEY_CONTEXT=0x4000005d,
	KEY_RIGHT_ALT_TAB = 0x100f,
	KEY_LEFT_ALT_TAB = 0x10000f,
	KEY_ALT_TAB= 0x800f,
	key_leftShiftEscape = 0x400001,
	key_ctrl_f6 = 0x440,
	key_UpArrow=0x48,
	key_DownArrow=0x50,
	key_Backspace=0x0e,
; Window type codes (The WT prefix stands for Window Type)
	WT_UNKNOWN = 0,
	WT_BUTTON = 1,
	WT_COMBOBOX = 2,
	WT_EDIT = 3,
	WT_LISTBOX = 4,
	WT_SCROLLBAR = 5,
	WT_STATIC = 6,
	WT_TOOLBAR = 7,
	WT_STATUSBAR = 8,
	WT_HEADERBAR = 9,
	WT_BUTTONLISTBOX = 10,
	WT_SLIDER = 11,
	WT_SPINBOX = 12,
	WT_MENU = 13,
	WT_DESKTOP = 14,
	WT_WINSWITCH = 15,
	WT_ICONTITLE = 16,
	WT_MDICLIENT = 17,
	WT_DIALOG = 18,
	WT_RADIOBUTTON = 19,
	WT_CHECKBOX = 20,
	WT_GROUPBOX = 21,
	WT_3STATE = 22,
	WT_SDM = 23,
	WT_BITMAP =24,
	WT_GENERALPICTURE= 25,
	WT_ProgressBar = 26,
	WT_ToolTip = 27,
	WT_HOTKEY= 28,
	WT_TABCONTROL=29,
	WT_LISTVIEW=30,
	WT_TREEVIEW=31,
	WT_STARTBUTTON=32,
	WT_STARTMENU=33,
	WT_CONTEXTMENU=34,
	WT_TASKBAR=35,
	WT_MENUBAR=36,
	WT_MULTISELECT_LISTBOX=37,
	WT_EXTENDEDSELECT_LISTBOX=38,
	WT_LEFTRIGHTSLIDER=39,
	WT_UPDOWNSLIDER=40,
	WT_EDITCOMBO=41,
	WT_PASSWORDEDIT=42,
	WT_READONLYEDIT=43,
	WT_COMMANDBAR=44,
	WT_UPDOWNSCROLLBAR=45,
	WT_LEFTRIGHTSCROLLBAR=46,
	WT_LINK=47,
WT_MailTo_link=48,
wt_ftp=49,
wt_ImageMap_link=50,
	WT_HTMLBODY=51,
	WT_HTMLFRAME=52,
	WT_DOCUMENT=53,
	WT_Table = 54,
	WT_LISTBOXITEM=55,
	WT_TREEVIEWITEM=56,
	WT_LISTVIEWITEM = 57,
	WT_ButtonMenu = 58,
	WT_News_link = 59,
	WT_THISPAGE_LINK=60,
	WT_SYSTRAY=61,
	WT_EDIT_SPINBOX = 62,
	WT_FRAME=63,
	WT_TABLECELL=64,
	WT_DIALOG_PAGE=65,
	WT_MULTILINE_EDIT=66,
	WT_UPLOAD_EDIT=67,
	WT_HTML_HEADING1=68,
	WT_HTML_HEADING2=69,
	WT_HTML_HEADING3=70,
	WT_HTML_HEADING4=71,
	WT_HTML_HEADING5=72,
	WT_HTML_HEADING6=73,
	WT_CLOCK=74,
	WT_IPADDRESS=75,
	WT_BUTTONDROPDOWN=76,
	WT_BUTTONDROPDOWNGRID=77,
	WT_SPLITBUTTON=78,
	WT_OUTLINEBUTTON=79,
	WT_ROW=80,
	WT_COLUMN=81,
	WT_ROWHEADER=82,
	WT_COLUMNHEADER=83,
	WT_PDFSIGNATURE=84,
	WT_LIST=85,
	WT_LISTITEM=86,
	wt_DateTime=87,
	wt_Separator=88,
	wt_ImageMap=89,
	wt_Shape=90,
	WT_FOOTNOTE=91,
		WT_PAGEHEADER=92,
	WT_PAGEFOOTER=93,
	WT_EMBEDDEDOBJECT=94,
	WT_UPPERRIBBON=95,
	WT_LOWERRibbon=96,
	WT_APPLICATION = 97,
	WT_ANCHOR = 98,
	WT_PARAGRAPH = 99,
	WT_TOGGLE_BUTTON = 100,
	WT_BLOCK=101,
	WT_TREEGRID=102,
	WT_REGION=103,
	WT_ARTICLE_REGION=104,
	WT_BANNER_REGION=105,
	WT_COMPLEMENTARY_REGION=106,
	WT_CONTENTINFO_REGION=107,
	WT_FORM_REGION=108,
	WT_MAIN_REGION=109,
	WT_NAVIGATION_REGION=110,
	WT_SEARCH_REGION=111,
	WT_LOG=112,
	WT_GENERIC_REGION=113,
	WT_NOTE=114,
	WT_GRID=115,
	WT_TABPANEL=116,
	WT_MathContent = 117,
	WT_Switch = 118,
	WT_SearchBox = 119,
	WT_FIGURE = 120,
	WT_FEED = 121,
	WT_LandmarkRegion = 122,
	WT_Meter = 123,
	WT_Split_Pane = 124,
	WT_Calendar = 125,
	wt_Window = 126,
	wt_ProgramManager = 127,
	wt_docChapter = 128,
	wt_docIntroduction = 129,
	wt_docConclusion = 130,
	wt_docAbstract = 131,
	wt_docForeword = 132,
	wt_docPageBreak = 133,
	wt_docTableOfContents = 134,
	wt_docNotice = 135,
	wt_docPart = 136,
	wt_docAfterword = 137,
	wt_docAppendix = 138,
	wt_docBibliography = 139,
	wt_docDedication = 140,
	wt_docEpilogue = 141,
	wt_docExample = 142,
	wt_docGlossary = 143,
	wt_docIndex = 144,
	wt_docPreface = 145,
	wt_docPrologue = 146,
	wt_docAcknowledgments = 147,
	wt_docErrata = 148,
	wt_docCover = 149,
; Note: A range is reserved for the number of internally recognized types to grow before reaching the custom control base.
;from 1 to 32 are added to the custom control number for Braille definitions.
	WT_CUSTOM_CONTROL_BASE=200,
; Text Attribute identifiers
	ATTRIB_TEXT=1,
	ATTRIB_BOLD = 2,
	ATTRIB_ITALIC = 4,
	ATTRIB_UNDERLINE = 8,
	ATTRIB_STRIKEOUT = 16,
	ATTRIB_GRAPHIC = 32,
	ATTRIB_HIGHLIGHT = 64,
	ATTRIB_UNSELECTED=128,
	ATTRIB_LRM_ARABIC=256,
	ATTRIB_RTL_TEXT=512,
	ATTRIB_DOUBLE_STRIKEOUT=1024,
	ATTRIB_SUPERSCRIPT=2048,
	ATTRIB_SUBSCRIPT=4096,
	ATTRIB_SHADOW=8192,
	ATTRIB_OUTLINE=16384,
	ATTRIB_EXTENDED=0x8000,
	; Depricated! See below note.
	;Note for extended attributes higher than ATTRIB_OUTLINE, the extended bit is always set, i.e. emboss is actually 0x18000, editing locked is 0x80008000, etc.
	; This is because internally two WORDS are used, one for everything up to outline and another for everything above.
	; SO, if ATTRIB_EXTENDED is set, you know to look at the high WORD of the attributes.
	ATTRIB_EMBOSS=0x10000,
	ATTRIB_ENGRAVE=0x20000,
	ATTRIB_SMALLCAPS=0x40000,
	ATTRIB_HYPERTEXT= 0x80000,
		ATTRIB_DOTTED_LINE= 0x100000,
		ATTRIB_MISSPELL = 0x200000,
		ATTRIB_OCR_TEXT = 0x400000,
	ATTRIB_CONTIGUOUS_CHUNK= 0x800000,
		ATTRIB_GRAMMAR = 0x1000000,
		ATTRIB_INVALID= 0x2000000,
		ATTRIB_INSERTION= 0x4000000,
		ATTRIB_DELETION= 0x8000000,
		ATTRIB_REVISED=0x10000000,
		ATTRIB_ADVANCED_PROOFING=0x20000000,
		ATTRIB_HAS_COMMENT=0x40000000,
		ATTRIB_EDITING_LOCKED=0x80000000,
; Because extended attributes are now 32 bits on their own, there is no longer room to return them as part of GetCharacterAttributes
; A new function has been added called GetCharacterExtAttributes which return all 32 bits of extended attributes.
; Note the depricated attributes above can't be removed for backward compatibility, and GetCharacterAttributes will continue to return the lower 16 bits of these extended attributes
;however the new function and constants should be used going forward.
extAttribEmboss=1,
extAttribEngrave=2,
extAttribSmallCaps=4,
extAttribHypertext = 8,
extAttribDottedLine = 16,
extAttribMisspell = 32, ; used with aria-invalid="spelling" (A spelling error was detected.)
extAttribOCRText = 0x40,
extAttribContiguousChunk = 0x80,
extAttribGrammar = 0x100, ; used with aria-invalid="grammar" (A grammatical error was detected.)
extAttribInvalid = 0x200,; used with aria-invalid="true" (The value entered by the user has failed validation.)
extAttribInsertion = 0x400 , ; used to indicate that this is inserted text.
extAttribDeletion = 0x800 , ; used to indicate that this is deleted text.
extAttribRevised=0x1000, ; Any of the UIA annotations to do with track changes not covered by the above two.
extAttribAdvancedProofing=0x2000, ; Used by UIA for any proofreading errors other than spelling and grammar.
extAttribHasComment=0x4000, ; this text has a comment referring to it.
extAttribEditingLocked=0x8000,
	extAttribDetails = 0x10000,
	extAttribHidden=0x20000,
	extAttribMark=0x40000,
;Single bit Control Attribute identifiers
	CTRL_NONE = 0x0000,
	CTRL_CHECKED = 0x0001,
	CTRL_UNCHECKED = 0x0002,
	CTRL_GRAYED = 0x0004,
	CTRL_DISABLED = 0x0008,
	CTRL_SUBMENU = 0x0010,
	CTRL_PRESSED = 0x0020,
	CTRL_OPENED = 0x0040,
	CTRL_CLOSED = 0x0080,
	CTRL_SELECTED = 0x0100,
	CTRL_SINGLELINE = 0x0200,
	CTRL_MULTILINE = 0x0400,
	CTRL_EXPANDED = 0x0800,
	CTRL_COLLAPSED = 0x1000,
	CTRL_HASCHILDREN = 0x2000,
	CTRL_VISITED = 0x4000,
	CTRL_Indeterminate = 0x8000,
;Multi bit Control Attribute identifiers
	CTRL_PARTIALLY_CHECKED = 0x8000,
	CTRL_READONLY = 0X10000,
	CTRL_REQUIRED = 0X20000,

;for checkable listviews:
	lv_ItemNotChecked = 4096,
	lv_ItemChecked = 8192,

; commonly used constants
	S_TOP = 0, ; s INDICATES SEARCH TYPE, for find string, find graphic, FindColors
	S_BOTTOM = 1,
	s_next = 2,
	s_prior = 4,
	S_RESTRICTED = 1, ; for find string, find graphic,
	S_UNRESTRICTED = 0,
	TRUE = 1,
	FALSE = 0,
	ForceUpdate = 1,
	DoNotForceUpdate = 0,
	FormsModeEventSpeechNormal = 0,
	FormsModeEventSpeechSilent = 1,
	Cycle_Next = 1,
	Cycle_Prior = 2,
	NO_OFFSET = 0xffffffff,  ;  = -1

; GetObjectSubtypeCode, GetObjectName, GetObjectValue, etc. all take a first parameter  which indicates the method used to retrieve the data. These used to be specified as numbers .These are equivalent constants.
	SOURCE_DEFAULT=0,
	SOURCE_CROSS_PROCESS=1,
	SOURCE_CACHED_DATA=2,


;For error codes for ResearchIt debugging:
;when checking these, make sure you're validating the error less than 0,
;i.e. if error == (0-RESEARCHIT_E_RULESET_NOT_FOUND) or let error = 0-error then check against constant directly.
	RESEARCHIT_E_SUCCESS = 0,
	RESEARCHIT_E_INSUFFICIENT_BUFFER = 0x01,
	RESEARCHIT_E_RULESET_NOT_FOUND = 0x02,
	RESEARCHIT_E_REQUEST_FAILED = 0x03,
	RESEARCHIT_E_REQUEST_NO_RESULTS = 0x04,
	RESEARCHIT_E_REQUEST_TIMEOUT = 0x05,

; for toggle restriction etc.
	ON=1,
	OFF=0,
; Output modes
	OT_BUFFER=0,
	OT_NO_DISABLE = 0,
	OT_HELP=1,
	OT_APP_START=2,
	OT_JAWS_MESSAGE=3,
	OT_SCREEN_MESSAGE=4,
	OT_CONTROL_NAME=5,
	OT_CONTROL_TYPE=6,
	OT_DIALOG_NAME=7,
	OT_DIALOG_TEXT=8,
	OT_DOCUMENT_NAME=9,
	OT_SELECTED_ITEM=10,
	OT_ITEM_STATE=11,
	OT_POSITION=12,
	OT_ERROR=13,
	OT_ITEM_NUMBER=14,
	OT_TOOL_TIP=15,
	OT_STATUS=16,
	OT_CONTROL_GROUP_NAME=17,
	OT_SMART_HELP=18,
	OT_SELECT=19,
	OT_TUTOR=20,
	OT_ACCESS_KEY=21, ; this is what it really is internally
	OT_HELP_BALLOON=22, ;Windows XP
	OT_USER_REQUESTED_INFORMATION=23,
	OT_CONTROL_DESCRIPTION = 24,
	OT_DEBUG=25,
	OT_TOASTS = 46,
OT_ANNOUNCE_POSITION_AND_COUNT=50,
	; Duplicate output modes here
	OT_HELP_BEGINNER=18,
	OT_WINDOW_NAME=5,
	OT_APP_NAME=9,
	OT_MESSAGE=4,
	OT_STATIC=8,
	OT_SELECTED=10,
; Internal use only:
	OT_STRING=26,
	OT_GRAPHIC=27,
	OT_CHAR=28,
	OT_WORD=29,
	OT_FIELD=30,
	OT_CHUNK=31,
	OT_LINE=32,
	OT_SPELL=33,
	OT_SAYALL=34,
	OT_KEYBOARD=37,
	OT_USER_BUFFER=40, ; used to redirect SayMessage and SayFormattedMessage strings to the User Buffer.
	OT_PHONETIC_CHAR=41,
	OT_BRAILLE_MESSAGE=42,
	OT_HIGHLIGHTED_SCREEN_TEXT=43,
	OT_NONHIGHLIGHTED_SCREEN_TEXT=44,
	OT_MOUSE_SPEECH=45,
	OT_MOUSE_SPEECH_CONTROL_TYPE=47,
	OT_MOUSE_SPEECH_ITEM_STATE=48,
OT_SPEECH_TO_FILE=49,
;depricated output modes
	OT_TEXT=35,
	OT_WINDOW_INFORMATION=0,
	OT_DIALOG_INFORMATION=0,
	OT_APP_INFORMATION=0,
	OT_FONT=36,
	OT_CURSOR=38,

; Item Types
	IT_CHUNK = 1,
	IT_WORD = 2,
	IT_CHAR = 4,
	IT_FIELD = 8,
	IT_COLORFIELD = 16,
    IT_PROMPT = 32,
    IT_CARET=64,
    IT_BOUNDINGRECT=128,
    IT_MAGNIFIED=256,
    IT_LINE = 512,
    IT_PRIOR_WORD = 1024,
    IT_NEXT_WORD = 2048,
    IT_HIGHLIGHT = 4096,
    IT_CHUNK_COLOR_NA 8192,
; Modes for the Braille display
	BRL_MODE_LINE = 0,
	BRL_MODE_STRUCTURED=1,
	BRL_MODE_SPEECHBOX=2, ; replaced by BRL_MODE_SPEECH|HISTORY
	BRL_MODE_SPEECH_HISTORY=2,
	BRL_MODE_ATTRIB = 3,
	BRL_MODE_PUSH = 4,
; Braille Marking types
	brlMarkNothing= 0,
	brlMarkText = 1,
	brlMarkBold = 2,
	brlMarkItalic = 4,
	brlMarkUnderline = 8,
	brlMarkStrikeout = 16,
	brlMarkGraphic = 32,
	brlMarkHighlight = 64,
	brlMarkColor= 128, ; see brlOptColorsToMark string option
	brlMarkExtended=256, ; things like spelling and grammatical errors in MSWord etc, script defined marking
	brlMarkDoubleStrikeout=512,
	brlMarkSuperscript=1024,
	brlMarkSubscript=2048,
	brlMarkShadow=4096,
	brlMarkOutline=8192,
	brlMarkEmboss=16384,
	brlMarkEngrave=32768,
; old depricated constants (updated to point to equivalent)
  BRL_MARKING_NONE=0,
	BRL_MARKING_HIGHLIGHT=64,
	BRL_MARKING_BOLD=2,
	BRL_MARKING_UNDERLINE=8,
	BRL_MARKING_ITALIC =4,
	BRL_MARKING_STRIKEOUT=16,
	BRL_MARKING_COLOR=128,
	BRL_MARKING_EXTENDED=256,
	BRL_MARKING_ALL=0xffff,
;Manual (user) panning modes
	     brlUserPanBestFit=0,; pan the width of a display but do not break words
brlUserPanFixed=1,; always pan a fixed increment (may break words in the middle).
brlUserPanMaximizeText=2, ; like best fit but allow overlap of previously displayed text on last segment.
brlUserPanBySegment=3, ; pan by structured segment or component such as name, type, value, etc
brlUserPanSmart=255, ; chooses the best algorithm for the situation
;Auto Panning Modes
brlAutoPanOff=0, ;we will not auto pan to include the cursor
brlAutoPanMinimal=1,; move display minimally to include whole word at cursor
brlAutoPanMatchUserPan=2,;move the display as if we were panning from the start of the line to include the cursor
brlAutoPanToMiddle=3,; pan such that the word containing the cursor is nearest the middle of the display
brlAutoPanMaximizeTextAfterCursor=4,;autoPan to show the maximum amount of text after the cursor
brlAutoPanMaximizeTextBeforeCursor=5,;autoPan to show the maximum amount of text before the cursor
brlAutoPanToDefaultSegment=6, ; autopan to the default structured segment for a control
brlAutoPanSmart=255, ; chooses the best algorithm for the given situation.

; verbosity
	BEGINNER=0,
	INTERMEDIATE=1,
	ADVANCED=2,
message_off = 0,
message_long = 1,
message_short= 2,

; FSCast Update Description Control ID:
ID_FSCast_DESCRIPTION = 5220,
;button control ID's
id_ok = 1,
id_CANCEL = 2,

iD_RightSingleClick = 7001,
iD_LeftSingleClick = 7002,
iD_LeftDoubleClick = 7003,
iD_MoveTo = 7004,
ID_HEADING_MOVE_TO = 1095,
id_SwitchTo_btn = 5,
id_OnlyIncludeOnTopWindows = 1003,
id_About_btn = 57664,
ID_ResearchIt_ClearHistoryItem = 5208,
ID_ResearchIt_ClearAllHistoryItems = 5207,
ID_ResearchIt_Options = 5203,

;Check box Control ID constants:
ID_ResearchIt_MaintainHistory = 5206,

;list box control id constants
id_listBox_systemTray = 7000,
id_ListBox_colorDlg = 1089,
id_lisbox_JAWSManager = 1089,
ID_ListView_JAWSManager = 7193,
id_ListBoxWindowList = 1000,

;Control ID's for Camera Recognition:
	ID_CameraRecognition_Camera_ComboBox = 7222,
	ID_CameraRecognition_MotionDetectMultiPageRecognition_Checkbox = 7249,
	ID_CameraRecognition_Timeout_Checkbox = 7250,
	ID_CameraRecognition_Light_ComboBox = 7252,
	ID_CameraRecognition_AdvancedSettings_Button = 7029,
	ID_CameraRecognition_LightingCorrection_ComboBox = 7253,
	id_ScannerRecognition_UseAutoDocumentFeed_CheckBox = 7254,
	id_ScannerRecognition_FriendlyName_ReadOnlyEdit = 7256,
	id_ScannerRecognition_InterruptCurrentScanWhenCancelingRecognition_CheckBox = 7257,
	id_ScannerRecognition_ContrastAdjustmentUsesBrightness_CheckBox = 7258,
	id_ScannerRecognition_CloseTWAINAfterEachScan_CheckBox = 7259,
	id_ScannerRecognition_UseDuplexScanMode_CheckBox = 7260,
	ID_CameraRecognition_Recognize_Button =1 ,

;Control ID's for PlaceMarker dialogs:
	id_PlaceMarker_DisplayFor_All_RadioButton = 7176,
	id_PlaceMarker_DisplayFor_Domain_RadioButton = 7036,
	id_PlaceMarker_DisplayFor_URL_RadioButton = 7035,
	id_PlaceMarker_ListView = 7027,
	id_PlaceMarker_Add_Button = 7019,
	id_PlaceMarker_MoveTo_Button = 7004,
	id_PlaceMarker_Change_Button = 7031,
	id_PlaceMarker_Remove_Button = 7021,
	id_PlaceMarker_RemoveAll_Button = 7022,
	id_PlaceMarker_Name_Edit = 7032,
	id_PlaceMarker_DefineForAllPages_Checkbox = 7177,
	id_PlaceMarker_AnchorToText_Checkbox = 7178,
	id_PlaceMarker_AnchorText_Edit = 7179,
	id_PlaceMarker_OK_Button = 1,

;Control ID's for Flexible Web:
id_FlexibleWeb_CreateNew_RadioButton = 7203,
id_FlexibleWeb_Retry_RadioButton = 7209,
id_FlexibleWeb_SaveTemporary_RadioButton = 7204,
id_FlexibleWeb_Undo_RadioButton = 7205,
id_FlexibleWeb_ViewOrChange_RadioButton = 7206,
id_FlexibleWeb_Enable_CheckBox = 7207,
id_FlexibleWeb_HideElement_RadioButton = 7210,
id_FlexibleWeb_StartReadingAtElement_RadioButton = 7211,
id_FlexibleWeb_ElementsToCustomize_ListBox = 7215,
id_FlexibleWeb_SelectCustomization_ListBox = 7213,
id_FlexibleWeb_RuleName_Edit = 1300,
id_FlexibleWeb_Rules_CheckableListView = 7221,
id_FlexibleWeb_ApplyThisRuleTo_ComboBox = 7222,
id_FlexibleWeb_ViewOrChangeRules_Treeview = 7217,
id_FlexibleWeb_ViewOrChangeRules_ListView = 7216,


;button types
bt_RightSingleClick = 1,
bt_LeftSingleClick = 2,
bt_LeftDoubleClick = 4,
bt_MoveTo = 8,

; general
	INACTIVE = 0,
	ACTIVE = 1,
	WAS_SUCCESSFUL = 1,
	WAS_NOT_SUCCESSFUL = 0,
	CURSOR_JAWS = 0,
	CURSOR_PC = 1,
	CURSOR_INVISIBLE = 2,
	CURSOR_BRAILLE = 3,
;The following is used by GetActiveCursorName and relates to new FSDom Edit functionality
	CURSOR_FSDOM_EDIT = "FSDom edit2 cursor",
	READ_EVERYTHING = 0,
	READ_HIGHLIGHTED = 1,
	ECHO_NONE = 0,
	ECHO_HIGHLIGHTED = 1,
	ECHO_ALL = 2,
	GRAPHIC_FIRST = 0,
	GRAPHIC_NEXT = 1,
	GRAPHIC_PRIOR = 2,
	GRAPHIC_LAST = 3,
	POINTER_ATTACHED = 1,
	POINTER_DETACHED = 0,

; Option identifiers to be used by SetJcfOption and GetJCFOption functions:
;The following were used, but are now replaced with the Schemes and aliases.
;These are commented and set to 0, as their values are no longer necessary.
;OPT_FORMAT_AND_TEXT = 0,
;OPT_FORMAT_ATTRIBUTES = 0,
;OPT_FORMAT_FONT = 0,
;OPT_FORMAT_POINT_SIZE = 0,
;OPT_FORMAT_TEXT_COLOR = 0,
;OPT_FORMAT_BACKGROUND_COLOR = 0,
	OPTBRL_EIGHT_DOT=1,
	OPTBRL_ALL_DOTS_CURSOR=2,
	OPTBRL_CURSOR_BLINK_RATE=3,
	OPTBRL_MARKING=4,
	OPT_TYPING_ECHO=5,
	OPT_TYPING_INTERRUPT=6,
	OPT_KEY_REPEAT=7,
	OPT_SCREEN_ECHO=8,
	OPT_READING_INTERRUPT=9,
	OPT_LINE_PAUSES=10,
	OPT_ACRONYMS=11,
	OPT_DICTIONARY=12,
	OPT_CARET_BLINK_RATE=13,
	OPT_NUMBERS=14,
	OPT_CASE=15,
	OPT_FILTER=16,
	OPT_RESTRICT=17,
	OPT_USER_MODE=18,
	OPT_INSERT_KEY_MODE=19,
	OPT_CARET_DETECT=20,
	OPT_MIXED_CASE=21,
	OPT_CARET_TIMEOUT=22,
	OPT_SPEAK_ANSI_CHARS=23,; depricated
	OPT_SPEAK_CHAR_VALUE=23,
	OPT_BRL_MOVE_ACTIVE_CURSOR=24,
	OPT_BRL_AUTO_ROUTE_TO_CURSOR=25,
	OPT_BRL_MODE = 26,
	opt_brl_verbosity = 27,
	OPT_BRL_PC_CURSOR_DOTS=28,
	OPT_BRL_JAWS_CURSOR_DOTS=29,
	OPT_BRL_INVISIBLE_CURSOR_DOTS=30,
	OPT_BRL_G2TRANSLATION = 31,
	OPT_BRL_G2EXPAND_CURRENT_WORD = 32,
	opt_punctuation=33,
	OPT_PROCESSTOOLTIPEVENT = 34,
	OPT_BRL_MESSAGE_TIME=35,
	OPT_BRL_MESSAGE_STATUS_TEXT=36,
	OPT_BRL_G2SUPPRESS_CAPS=37,
	OPT_BRL_AUTOADVANCE_INTERVAL=38,
	OPT_INDICATE_NEWLINES=39,
	OPT_PROGRESSBAR_UPDATE_INTERVAL=40,
	OPT_INDICATE_REPETITIONS = 41,
	OPT_INDICATE_ATTRIBUTES_IN_DIALOGS_AND_MENUS=42,
	OPT_MSAA_MODE=43,
	OPT_SAY_ALL_MODE=44,
	OPT_TRACK_ENGINE=45,
	OPT_SAY_CURSOR_SHAPE_CHANGE = 46,
	OPT_INDICATE_INDENTATION  = 47,
	OPT_BRL_SHOW_COMPLETE_WORD = 48,
	OPT_LEFT_SHIFT_SKIPBACK=49,
	OPT_TETHER_JAWS_TO_PC=50,
	OPT_BRL_KEY_INTERRUPT_SPEECH=51,
	OPT_SEPARATE_MODIFIERS_MODE=52,
	OPT_CHAR_BY_EXAMPLE=53,
	OPT_PHRASE_BY_EXAMPLE=54,
	OPT_READ_ALL_PHRASES=55,
	OPT_USE_STANDARD_KEYBOARD=56,
	OPT_BRL_PAN_MODE=57,
	OPT_BRL_PAN_INCREMENT=58,
	OPT_VIRT_VIEWER=59,
	OPT_BRL_FILTER_CTRL_CHARS=60,
	OPT_BRL_POSITIONING_MODE=61, ; obsolete
	OPT_BRL_AUTOPAN_MODE=61, ;new name for positioning mode as of 6.0
	OPT_GENERALIZE_MODIFIERS=62,
	OPT_WSP_DISABLE_HIDE_ALT_KEY=63,
	OPT_WSP_DISABLE_PERSONALIZED_MENUS=64,
	OPT_WSP_DISABLE_SHADOW_MOUSE=65,
	OPT_WSP_DISABLE_STICKY_KEY=66,
	OPT_ACCESSIBILITY_IGNORE_COLORS_WEB_PAGES=72,
	OPT_WSP_DISABLE_LANGUAGE_BAR = 73,
	OPT_WSP_ENABLE_ENFORCEWRITEPROTECTION = 74,
	OPT_BRL_DOT_FIRMNESS=80,
	OPT_BRL_STATUS_CELLS_START=81,;depricated!
	OPT_BRL_STATUS_CELLS_POS=81, ;0 left, 1 right, 2 off, use instead
	OPT_BRL_STATUS_CELLS=82, ; only used if a display defines none of its own
	OPT_BRL_TEXT_CELLS_START=83, ;depricated
	OPT_BRL_TEXT_CELLS=84, ; number of cells to use for text ;depreicated
	OPT_BRL_RAPID_READING=85, ; depricated
	OPT_BRL_SLEEP_MODE = 86,
	;; The following option is a Get Option only. Cannot be set
	OPT_BRL_ACTIVE=87,
	OPT_BRL_WORDWRAP=88,
	OPT_SPELL_PHONETIC=90, ; 0 spell normal, 1 spell phonetic
	OPT_INDICATE_CAPS=91, ; if 0, use uppercase pitch change, if 1, say cap or all caps
	OPT_QUICK_KEY_NAVIGATION_MODE=92, ; 0 off, 1 on, 2 on in SayAll only
	OPT_MSGFILTER_REJECT_RETRY_TIME = 93,
	OPT_MSGFILTER_RETRYLATER_TIME = 94,
	OPT_SAY_ALL_INDICATE_CAPS=95, ; announce cap and all caps in SayAll, 0 off, 1 on
	OPT_LANGUAGE_DETECTION=96,
	OPT_MSGFILTER_TIMEOUT = 97,
	OPT_MSGFILTER_COM_CALL_TIMEOUT = 98,
	OPT_LISTBOX_CHECKBOXES=99, ; 0 off, 1 non-ownerdrawn listboxes, 2 also check listboxes with LBS_OWNERDRAWVARIABLE or LBS_OWNERDRAWFIXED window style.
	; determines how often an embedded ActiveX control causes the Virtual HTML area to be updated
	;when receiving rapid ValueChange events from MSAA
	; 0 means allow refresh rate to be dictated by MSAA
	; a positive number means only refresh every X miliseconds
	; -1 means don't refresh at all.
	OPT_VIRTUAL_MSAA_REFRESH_RATE=100,
	OPT_CUSTOM_PAGE_SUMMARY=101,
	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW=102,
	OPT_ON_SCREEN_KEYBOARD = 103,
	OPT_BRL_MESSAGES=104,
	OPT_BRL_MESSAGE_PREFIX=105,
	OPT_SKIM_READ_INDICATION= 110, ; when skimming over text, beep every 10 lines or so.
	OPT_SMART_WORD_READING=115,
	OPT_SPELL_ALPHANUMERIC_DATA=116,
	OPT_GENERALIZE_LANGUAGE_DIALECT=117,
	OPT_GENERALIZE_BULLETS=118,
	OPT_BRL_GENERALIZE_BULLETS=119,
	OPT_USE_HEX_FOR_SAY_CHARACTER_VALUE=120,
	OPT_CONVERT_UNICODE_CHAR_TO_MULTIBYTE_SEQ=121,
	OPT_BRL_AUTO_LINE_MODE=122,
	OPT_MSAA_ALERTS=123,
	OPT_MOUSE_MOVEMENT_STOPS_SPEECH = 124,
	OPT_PROMPT_OVERWRITE_VOICE_PROFILES = 125,
	OPT_TOP_AND_BOTTOM_EDGE_ALERT = 126,
	OPT_MOUSE_SPEECH_ENABLED = 127,
	OPT_MOUSE_ECHO_UNIT = 203,
	OPT_AUTO_SPEAK_WEB_PAGES = 129,
	OPT_INDICATE_CAPS_BY = 130,
	OPT_SPEAK_FORMS_MODE_CHANGES = 131,
	OPT_USE_CUSTOM_HIGHLIGHT = 132,
	OPT_USE_WINDOWS_HIGHLIGHT = 133,
	OPT_ENABLE_BILINGUAL_USER_INTERFACE = 134,
	OPT_ENABLE_MAGIC_TRACKING = 135,
	OPT_ENABLE_TYPEKEYS_NUMPAD = 136,
	OPT_Use_SAPI5_During_Say_All = 137,
	OPT_HIGHLIGHT_STYLE = 138,
	OPT_INDICATE_NONBREAKING_SYMBOLS=141,
	OPT_BRL_ENABLE_UEB = 142,
	OPT_JTCONTROLLER_DISPLAY_WINDOW=143,
	;OPT_IA2DESCRIPTION_INDICATION=144,
	OPT_BRL_USE_OSM=145, ; 0 use DOM when available, 1 use DOM except when WT=edit, 2 hybrid, 3 always use OSM
	OPT_BRL_USE_OSM_FOR_EDIT=145,; depricated,
	OPT_SINGLE_DIGIT_THRESHOLD=146,
	OPT_SINGLE_DIGIT_DASHES=147,
	OPT_FOCUS_LOSS_ANNOUNCE = 148,
	OPT_WORDINDEX_STOPWORDS=149,
	OPT_BRL_CONTRACTED_INPUT=150,
	OPT_TEXT_ANALYSER=151,
	OPT_TEXT_ANALYSER_TYPE_FLAGS=152,
	OPT_TEXT_ANALYSER_SYMBOL_FLAGS=153,
	OPT_BRL_REVERSE_PANNING_BUTTONS=155,
	OPT_SOD_ALLOW_SPEECH_ON_DEMAND=156,
	OPT_SOD_ALLOW_MOUSE_ECHO=157,
	OPT_SOD_ALLOW_TYPING_ECHO=158,
	OPT_SOD_ALLOW_DESIGNATED_READING_COMMANDS=159,
	OPT_SPEECH_MODE = 161,
	OPT_LESS_SPEECH = 162,
	OPT_PLAY_JAWS_SOUNDS=163,
	OPT_USE_STATUSCELLS_FOR_CONTROLTYPE=171,
	OPT_STR_MODE_ALIGN_SEGMENT=172,
	OPT_STR_MODE_REVERSE_ORDER=173,
	OPT_BRL_DYNAMIC_AUTOADVANCE=174,
	OPT_VIRTUAL_DOCUMENT_LINK_ACTIVATION_METHOD=175,
	OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES = 176,
	OPT_TOUCH_TYPING_MODE = 177,
	OPT_TOUCH_TYPING_ECHO = 178,
	OPT_TOUCH_KEYBOARD_NOTIFICATION = 179,
	OPT_TOUCH_KEYBOARD_CHILD_PANEL_NOTIFICATION = 180,
	OPT_DETECT_KEYBOARD_INPUT_LANGUAGE = 190,
	OPT_PHONETIC_CHAR_AFTER_PAUSE=191,
	OPT_INDICATE_MISTYPED_WORD=192,
	OPT_ANNOUNCE_MULTILINE_EDIT = 193,
	OPT_INDICATE_OUTLINE_LEVEL = 194,
	OPT_LP_USE_PRIMARY_SPEAKER_FORNUMBERS = 195,
	OPT_LP_NORMALIZE_READING_ORDER = 196,
	OPT_ENABLE_ACCESSIBLE_NOTIFICATION_EVENTS = 197,
	OPT_ENABLE_TOAST_NOTIFICATION_PROCESSING = 199,
	OPT_MouseEchoSpeaksControlTypeAndState = 200,
	OPT_MouseEchoSpeaksHelpAndDescription = 201,
	OPT_MouseEchoScreenLocationTones = 202,
	OPT_VirtualCursorIsTabSpecific = 205,
	OPT_BRL_NAV_BY_PARA=207,
	OPT_USE_VIRTUAL_CURSOR_FOR_UWP_APPS = 209,
	OPT_BRL_INPUT_AS_UNICODE_BRAILLE = 210,
	OPT_BRL_BACKTRANSLATE_UNICODE_BRAILLE = 211,
	OPT_BRL_LANGUAGE_DETECTION = 212,
	OPT_BRL_SHOW_TIME_IN_STATUS_CELLS=213,
	OPT_BRL_CROPPED_MODE=214,
	OPT_BRL_VERTICAL_ALIGNMENT_TYPE = 215,
	OPT_SPLIT_DATA_LINE_INDEX=216,
	OPT_SPLIT_BUFFER_UNIT=217,
	OPT_AUTO_REBUFFER=218,
	OPT_BRL_SHOW_TYPEFORM_MARKS=219,
	OPT_ALLOW_USER_INVOKED_LOCATION_UPDATE=220,
	OPT_USE_SOUNDS_TO_INDICATE_TANDEM=996,
	OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE=997,
	OPT_AUTO_FORMS_MODE=998,
	OPT_AUTOFORMSMODE_THRESHOLD=999,
	OPT_USE_VIRTUAL_INFO_IN_FORMS_MODE=1000,
	OPT_PIXELS_PER_SPACE = 1001,
	OPT_INCLUDE_GRAPHICS=1002,
	OPT_GRAPHICS_MODE=1003,
	OPT_VIRTUAL_PC_CURSOR = 1004,
	OPT_TRIM_BRAILLE_GRAPHICS = 1005,
	OPT_LEFT_MARGIN=1006,
	OPT_EDIT_PROMPT_SEARCH=1007,
	OPT_PIXELS_PER_BLANK_LINE=1008,
	OPT_PIXELS_PER_TAB=1009,
	OPT_USE_DDI_HOOKS = 1011,
	OPT_USE_LEGACY_IE_SUPPORT = 1012,;depricated, does nothing in 8.0!
	OPT_USE_VIRTUAL_PC_CURSOR_IN_WEB_DIALOGS=1013,
	OPT_USE_CUSTOM_LABELS=1014,
	OPT_TABLE_LINE_SEGMENT=1015,
	OPT_VPC_ENHANCED_CLIPBOARD=1017,
	OPT_UNDERLINE_PROOFREADING_ERRORS=1018,
	OPT_SUPPRESS_READ_ONLY_STATE_INDICATION=1019,
	OPT_ADD_BLANK_LINES_FOR_PARAGRAPHS=1020,
	OPT_VIRTUAL_RIBBON_SUPPORT=1021,
	OPT_USE_VPC_INSTEAD_OF_ENHANCED_EDIT_FOR_READONLY_DOCS=1022,
	OPT_USE_SDM_API=1023,
	OPT_USE_LEGACY_KEYBOARD=1024,
	OPT_DETAILS_ANNOUNCEMENT=1025,
; HTML specific options
	optVirtualCursorVerbosityLevel = 2000,
	optTextBlockLength=2001,
	optIncludeGraphics=2002,
	optIncludeGraphicLinks=2003,
	optIncludeImageMapLinks=2004,
	optMaxLineLength=2005,
	optLinesPerPage=2006,
	optMultipleLinksPerLine=2007,
	optIdentifySamePageLinks=2008,
	optIdentifyLinkType=2009,
;Depricated! Do not use from  JAWS 19 onward
	optFrameIndication=2010,
	optScreenFollowsVCursor=2011,
	optFilterDuplicateLinks=2012,
	optSkipPastRpeatedText=2013,
	optLinkIndication=2014,
	optLinkText=2015,
	optTableIndication = 2016,
	optHeadingIndication=2017,
	optElementAccessKeys=2018,
;Depricated! Do not use from  JAWS 19 onward
	optListIndication=2019,
	optTableDetection=2020, ; detect all or only data tables
;Depricated! Do not use from  JAWS 19 onward
	optBlockQuoteIndication=2021,
	optGraphicRendering=2022,
	optPageRefreshFilter=2023,
	;Next options used for configuring how data tables are detected
	;This option specifies the minimum number of valid data rows that a table must contain in order for it to be considered a data table.
	optTblMinValidDataRows=2024, ;The default value is 2
	;This option specifies the minimum number of cells that a row must contain in order for it to be considered a valid data row.
	optTblValidRowThreshold=2025, ; default value is 3
	;This option specifies the minimum number of rows which must contain text in order for the table to be considered a data table.
	optTblMinTextRows=2026, ; default value is 2
	;This option specifies the minimum number of columns which must contain text in order for the table to be considered a data table.
	optTblMinTextColumns=2027, ; default value is 2
	optMinTblCellTextLength=2028, ; default 1
	optMaxTblCellTextLength=2029, ; default 250
	; used for determining how button tags are rendered
	optButtonText=2030,
	optIgnoreInlineFrames=2031,
	optExpandAbbreviations=2032,
	optExpandAcronyms=2033,
	optWrapNavigation=2034,
	; when a graphical link or its enclosing anchor has no useful title or alt, should we favor the graphic's src or the anchor's href
	optGraphicalLinkLastResort=2035,
	;how to render formfield prompts
	;0 favor label tag, 1 favor title attribute, 2 favor alt attribute, 3 favor longest,
	;4 use both label and title (if different), 5 use both label and alt (if different)
	optFormFieldPrompts=2036,
	optIndicateElementAttributes=2037,
	optEmbeddedActiveXSupport=2038,
	optFormsModeAutoOff=2039,
	optStyleSheetProcessing=2040,
	optHTMLDocumentPresentationMode=2041,
	optHTMLIndicateColSpan=2042,
	optTblSpeakMostSpecificColumnTitleFirst=2043,
	OPT_INDICATE_SELECTED=2044,
	optDocPresModeMaxLineLength = 2045,
	optAnnounceLiveRegionUpdates = 2048,
	optFilterConsecutiveDuplicateLinks=2049,
;Depricated! Do not use from  JAWS 19 onward
	optIndicateGroupStartAndEnd=2051,
	optSmartNavigation=2052,
;Depricated! Do not use from  JAWS 19 onward
	optIndicateToolbarStartAndEnd=2053,
; new in 2019
	optHeadingNavigation=2054,
	; New in 2020 February update
	optIgnoreApplicationRegions=2055,
	;new in JAWS 2021
	optJAWSDeterminesLayoutTable=2056,
	; New in 2023
	optSmartGlanceHighlightIndication=2057,
	opt_IndicateInsAndDelInVirtualDocs=2060,
	optFocusFollowsVirtualCursor=2061,
; RichEdit/Edit control options
	OPT_EDIT_USE_OSM=3000, ; Whether to use the OSM or directly query the control for information for reading and navigating in Edit controls
	OPT_EDIT_USE_OSM_THRESHOLD=3001, ; if a document is larger than this number of characters then we'll always use the OSM as interacting with the Edit control directly becomes too slow (due to the RichEdit control taking too long to process our messages).
	OPT_EXPAND_ANNOTATIONS_INLINE=3002,
	OPT_REQUEST_MARKEDUP_CONTENT=3003, ; request formatted text from DOM to support Speech and Sound Schemes.
	OPT_APPEND_SHAPE_DIMENSIONS=3004,;When describing graphics in MSWord, whether or not to append the shape's dimensions.
	OPT_LOWER_OTHER_APPS_VOLUME = 3005,; Audio Ducking control.  Boolean. 0 or 1 are the allowed values.  This sets the ducking for the default and current application.
	OPT_SAYALL_ON_DOCUMENT_LOAD = 3006,; Document and Web Pages Automatically Read When Loaded
	OPT_INCLUDE_STYLE_INFO=3025,
	OPT_AVOID_SPEECH_CUT_OFF=3026 ; Boolean value denoting if the Avoid Speech cut off feature is enabled, 0 meand off and 1 means on.

; Enumerated virtual cursor verbosity options:
const
	VCVO_BlockQuotation = 0,
	VCVO_Feed = 1,
	VCVO_Figure = 2,
	VCVO_FlashObject = 3,
	VCVO_Frame = 4,  ;inline and non-inline
	VCVO_GroupBox = 5,
	VCVO_List = 6,
	VCVO_Log = 7,
	VCVO_Note = 8,
	VCVO_TableOrGrid = 9,  ;also treeGrid
	VCVO_TabPanel = 10,
	VCVO_Toolbar = 11,
	VCVO_ApplicationRegion = 12,
	VCVO_ArticleRegion = 13,
	VCVO_BannerRegion = 14,
	VCVO_ComplementaryRegion = 15,
	VCVO_ContentInfoRegion = 16,
	VCVO_DocumentRegion = 17,
	VCVO_FormRegion = 18,
	VCVO_MainRegion = 19,
	VCVO_NavigationRegion = 20,
	VCVO_Region = 21,  ;for the uncategorized region simply called region
	VCVO_SearchRegion = 22,
	VCVO_ClickableElements = 23,
	VCVO_DescribedBy = 24,
	VCVO_EditableSection = 25,
	VCVO_ElementDescription = 26,
	VCVO_OptionsCount = 27


; Following are the restriction types, used with builtin functions SetRestriction and GetRestriction:
; RestrictNone through RestrictRect are valid only for the OSM JAWS and Invisible cursors.
const
	FirstOSMCursorRestriction = 0,
	RestrictNone = 0,
	RestrictAppWindow = 1,
	RestrictRealWindow = 2,
	RestrictWindow = 3,
	RestrictFocusWindow = 4,
	RestrictRect = 5,
	LastOSMCursorRestriction = 5,
; RestrictAppElement through RestrictElement are valid only for the UIA JAWS and Invisible cursors.
	FirstUIACursorRestriction = 6,
	RestrictAppElement = 6,
	RestrictContainerElement = 7,
	RestrictElement = 8,
	LastUIACursorRestriction = 8,

; cursor types
	CT_UNKNOWN = 0,
	CT_ARROW = 1,
	CT_IBEAM = 2,
	CT_WAIT = 3,
	CT_CROSS = 4,
	CT_UPARROW = 5,
	CT_SIZE = 6,
	CT_ICON = 7,
	CT_SIZENWSE = 8,
	CT_SIZENESW = 9,
	CT_SIZEWE = 10,
	CT_SIZENS = 11,

; Menu modes
	MENU_INACTIVE= 0,
	MENUBAR_ACTIVE=1,
	MENU_ACTIVE=2,
	OS_WIN31=1,
	OS_WIN95=2,
	OS_WIN_NT=3,

;default files
;	DEFAULT_OTHER =0,
;	DEFAULT_DESK = 1,
;	DEFAULT_LAP = 2,

;Magic Focus types (MF prefix)
	MF_OVERLAY	= 0,
	MF_LENS = 1,
	MF_TRACK_LENS = 2,
	MF_VERTICAL_SPLIT = 3,
	MF_HORIZONTAL_SPLIT = 4,
	MF_OVERLAY_OVER_RECT = 5,
	MF_LENS_OVER_RECT = 6,
	MF_TRACK_LENS_OVER_RECT = 7,

;Magic Tracking Objects
	MTO_MOUSE = 1,
	MTO_GENERIC = 2,
	MTO_CARET = 4,
	MTO_MENUS = 8,
	MTO_DIALOG = 16,

;Magic Area modes (MA prefix)
	MA_HORIZONTAL = 1,
	MA_VERTICAL = 2,
	MA_FULL_SCREEN = 3,
	MA_OVERLAY = 4,
	MA_LENS = 5,
	MA_TRLENS = 6,

;Tracking Engines
	TE_JFW = 0,
	TE_MAG = 1,


;Hook types
	HK_SCRIPT = 0,
	HK_EVENT_TRACE  = 1,

;Utility flags
	FLAG_APP = "-a",
	FLAG_DOMAIN = "-m",
	FLAG_CLASS = "-c",
	FLAG_RULE = "-r",
	FLAG_CLASS_MODE = "-dCLASSES",
	FLAG_HIGHLIGHTS_MODE=" -dHIGHLIGHTS",
	FLAG_BRAILLE_COLORS_MODE = "-dBRAILLECOLORS",
	FLAG_BRL_FOREGROUND_COLOR="-g",
	FLAG_BRL_BACKGROUND_COLOR="-h",
	FLAG_FOREGROUND_COLOR="-f",
	FLAG_BACKGROUND_COLOR="-b",

;Utilities
	Utility_SettingsCenter = "SettingsCenter.exe",
	MGR_DICTION = "JDiction.exe",
	MGR_FRAME = "JFrame.exe",
	MGR_SCRIPT = "JScript.exe",
	MGR_KEYBRD = "JKey.exe",
	MGR_SETTINGS_PACKAGER="SettingsPackager.exe",
	MGR_LOCATION_MAGUTIL = "Magutil",

;Word delimiters
	WORD_DELIMITERS = "!@#$%^&*()+,.<>?/\"",
; used by FindColors to search for foreground or background color only
	IgnoreColor = 0xff000000,
; list of apps for AppFileTopic
	strListOfAppsWithTopics = "cakeaud.exe,calc.exe,eudora.exe,wpwin7.exe,wpwin8.exe,winword.exe,shdocvw.dll,hhctrl.ocx,msimnui.dll,msimn.exe,msaccess.exe,excel.exe,netscape.exe,outllib.dll,powerpnt.exe,qw.exe",
	strListOfAppsWithTopics2="gmw4.exe,realplay.exe,msoe.dll,browseui.dll,nlnotes.exe,nnotesws.dll,AIM.exe,Wndutils.dll,oscarui.dll,oscres.dll,wndutils.dll,icbmui.ocm,spsswin.exe,fpxpress.exe,nmres.dll,conf.exe,cb32.dll,wb32.dll,agent.exe,",
	strListOfAppsWithTopics3="manager.exe,cchat.exe,vtiform.dll,fpexpress.exe,frontpg.exe,juno.exe,cscape.exe,qvwin.exe,qvread.dll,faxmng32.exe,wfxctl32.exe,",
	strListOfAppsWithTopics4="hjpad.exe,wfxres32.dll,welcome.exe,wpwin9.exe,voxchat.exe,tx32.exe,faxmng32.exe,wfxctl32.exe,wfxres32.dll,welcome.exe,wfcvr32.exe,Gme2000.exe,Gme2000t.exe,GME99.exe,textbridge.exe,itp32.exe,taxact99.exe,qpw.exe,wnw.exe,Ruhd30.exe,Theophil.exe,",
	StrListOfAppsWithTopics5="Spsswin.exe,grpwise.exe,gwdta1us.exe,gme2000.exe,gme2000t.exe,gme99.exe,gme99t.exe,aim.exe,rhud30.exe,",
	StrListOfAppsWithTopics6="Forge32.exe,gravity.exe,gallery.exe,",
	strListOfExcludedApps = "jscript.exe,jkey.exe,jconfig.exe,jframe.exe,jdiction.exe,jfw.exe",

; JAWS control ID
	ID_SELECT_DLG_LIST = 1089,
	ID_SELECT_DLG_EXECUTE = 1055,
; for buttons with modern UIA class name simpleBuuton
	NetUIModernButton = "NetUISimpleButton",
; for the list of items in the system tray
	ShellTrayClass = "Shell_TrayWnd",
	Windows11SysTrayIconsClass = "Windows.UI.Input.InputSite.WindowClass",
	cwc_Progman = "Progman",
	TrayClass = "TrayNotifyWnd",
; format
	FORMAT_ATTRIBS = 1,
	FORMAT_FONT = 2,
	FORMAT_POINTS = 4,
	FORMAT_TEXTCOLOR = 8,
	FORMAT_BACKGROUNDCOLOR = 16,
	FORMAT_REPETITIONS = 32,
	FORMAT_CAPITALIZATION = 64,
	FORMAT_INDENTATION = 128,
	FORMAT_FIRSTSEGMENT = 256,
	FORMAT_ALL = 511,
; capitalization types
	CAPITALIZATION_UNDEFINED = 0,
	CAPITALIZATION_LOWER = 1,
	CAPITALIZATION_CAP = 2,
	CAPITALIZATION_ALLCAPS = 3,
; Voice context names. This section should NOT be translated.
	VCTX_GLOBAL = "Global",
	VCTX_MESSAGE = "Message",
	VCTX_KEYBOARD = "Keyboard",
	VCTX_PCCURSOR = "PCCursor",
	VCTX_JAWSCURSOR = "JAWSCursor",
	VCTX_SAY_ALL = "SayAll",
	VCTX_MENU_AND_DIALOG = "MenuAndDialog",
; Constants to represent the various parameters of the voice.
	V_VOLUME = 1,
	V_RATE = 2,
	V_PITCH = 4,
	V_PUNCTUATION = 8,
	V_PERSON = 16,
	V_Up = 101,
	V_Down = 100,
; consts for which volume to set, JAWS or system:
	VOLUME_JAWS = 1,
	VOLUME_SYSTEM = 2,
; consts for what increment to set, small = 2%, large = 10%
	VOLUME_SMALL = 2,
	VOLUME_LARGE = 10,

; Movement Unit Values
/*
	Old Values
	UNIT_CHAR = 0,
	UNIT_WORD = 1,
	UNIT_FIELD =2,
	UNIT_ITEM = 3,
	UNIT_LINE = 4,
  UNIT_PAGE = 5,
  UNIT_CHAR_SELECT = 6,
  UNIT_WORD_SELECT = 7,
  UNIT_LINE_SELECT = 8,
  UNIT_PARTIAL_LINE_SELECT = 9,
  UNIT_PAGE_SELECT = 10,
  UNIT_PARTIAL_DOC_SELECT = 11,
  UNIT_SENTENCE = 13,
  UNIT_PARAGRAPH = 14,
*/
	Unit_None=0,
	Unit_None_Up=1,
	Unit_Char_Next=2,
	Unit_Char_Prior=3,
	Unit_Word_Next=4,
	Unit_Word_Prior=5,
	Unit_Line_Next=6,
	Unit_Line_Prior=7,
	Unit_Page_Next=8,
	Unit_Page_Prior=9,
	Unit_Line_End=10,
	Unit_Line_Start=11,
	Unit_Line_Last=12,
	Unit_Line_First=13,
	Unit_Sentence_Next=14,
	Unit_Sentence_Prior=15,
	Unit_Paragraph_Next=16,
	Unit_Paragraph_Prior=17,
	Unit_Field_Next=18,
	Unit_Field_Prior=19,
	Unit_Color_Field_Next=20,
	Unit_Color_Field_Prior=21,
	Unit_Chunk_Next=22,
	Unit_Chunk_Prior=23,
	Unit_Chunk_Down=24,
	Unit_Chunk_Up=25,
	Unit_Cell_Next=26,
	Unit_Cell_Prior=27,
	Unit_Cell_Down=28,
	Unit_Cell_Up=29,
	Unit_Cell_First=30,
	Unit_Cell_Last=31,
	Unit_Cell_TopOfColumn=32,
	Unit_Cell_BottomOfColumn=33,
	Unit_Cell_StartOfRow=34,
	Unit_Cell_EndOfRow=35,
	Unit_Char_Select_Next=36,
	Unit_Char_Select_Prior=37,
	Unit_Word_Select_Next=38,
	Unit_Word_Select_Prior=39,
	Unit_Line_Select_Next=40,
	Unit_Line_Select_Prior=41,
	Unit_Line_Select_To_End=42,
	Unit_Line_Select_To_Start=43,
	Unit_Page_Select_Next=44,
	Unit_Page_Select_Prior=45,
	Unit_Doc_Select_To_End=46,
	Unit_Doc_Select_To_Start=47,
	Unit_Doc_Select_All=48,
	Unit_Hierarchical_Element_Select=49,
	Unit_Doc_To_End=50,
	Unit_Doc_To_Start=51,
	Unit_Backspace=52,
	Unit_Delete=53,
	Unit_Sentence_Select_Next=54,
	Unit_Sentence_Select_Prior=55,
	Unit_Paragraph_Select_Next=56,
	Unit_Paragraph_Select_Prior=57,
	Unit_Focus_Next=58,
	Unit_Focus_Prior=59,
	Unit_Misc_Element=60,
	Unit_Click=61,
	Unit_Max=62,
;  Movement Direction Values
	MOVE_FORWARD = 0,
	MOVE_BACK = 1,

;Screen movement directions, such as for scrolling:
	Screen_Move_Left = 1,
	Screen_Move_Right = 2,
	Screen_Move_Up = 3,
	Screen_Move_Down = 4,

;Unit movement constants
;movement directions for units such as line, word, char, etc.:
	UnitMove_Current = 0,
	UnitMove_Next = 1,
	UnitMove_Prior = 2,
	UnitMove_First = 3,
	UnitMove_Last = 4,
	UnitMove_Up = 5,
	UnitMove_Down = 6,
	UnitMove_Top = 7,
	UnitMove_Bottom = 8,
	UnitMove_Start = 9,
	UnitMove_End = 10,

; The string to use between items in dlgSelectItemInList
LIST_ITEM_SEPARATOR = "\007",
JAWS_DLG_LIST_SEPARATOR = "|",
_DLG_SEPARATOR = "|",
TAB_SEPARATOR = "\t",

;the following constants are for use with the WindowsMinMaxEvent
SW_HIDE              =0,
SW_SHOWNORMAL       = 1,
SW_NORMAL            = 1,
SW_SHOWMINIMIZED    = 2,
SW_SHOWMAXIMIZED    = 3,
SW_MAXIMIZE         = 3,
SW_SHOWNOACTIVATE   = 4,
SW_SHOW             = 5,
SW_MINIMIZE         = 6,
SW_SHOWMINNOACTIVE  = 7,
SW_SHOWNA           = 8,
SW_RESTORE          = 9,
SW_SHOWDEFAULT      = 10,
SW_FORCEMINIMIZE    = 11,
SW_MAX            =  11,

;; Message Box Type Specifiers
;; These values are used to specify the Message Box type in the function
;; MessageBoxEx.  These values may be ored together as follows
;; MB_YESNO | MB_DEFBUTTON3.
MB_OK=0x00000000L,
MB_OKCANCEL=0x00000001L,
MB_ABORTRETRYIGNORE=0x00000002L,
MB_YESNOCANCEL=0x00000003L,
MB_YESNO=0x00000004L,
MB_RETRYCANCEL=0x00000005L,
MB_ICONHAND=0x00000010L,
MB_ICONQUESTION=0x00000020L,
MB_ICONEXCLAMATION=0x00000030L,
MB_ICONASTERISK=0x00000040L,

MB_USERICON=0x00000080L,
MB_ICONWARNING=MB_ICONEXCLAMATION,
MB_ICONERROR=MB_ICONHAND,

MB_ICONINFORMATION=MB_ICONASTERISK,
MB_ICONSTOP=MB_ICONHAND,

MB_DEFBUTTON1=0x00000000L,
MB_DEFBUTTON2=0x00000100L,
MB_DEFBUTTON3=0x00000200L,
MB_DEFBUTTON4=0x00000300L,

MB_APPLMODAL=0x00000000L,
MB_SYSTEMMODAL=0x00001000L,
MB_TASKMODAL=0x00002000L,
MB_HELP=0x00004000L,

MB_NOFOCUS=0x00008000L,
MB_SETFOREGROUND=0x00010000L,
MB_DEFAULT_DESKTOP_ONLY=0x00020000L,

MB_TOPMOST=0x00040000L,
MB_RIGHT=0x00080000L,
MB_RTLREADING=0x00100000L,

;; Message Box Return Values
;; These are the values returned by the MessageBoxEx Function.
IDOK = 1,
IDCANCEL = 2,
IDABORT = 3,
IDRETRY = 4,
IDIGNORE = 5,
IDYES = 6,
IDNO = 7,

IDCLOSE = 8,
IDHELP = 9,

; The following options are used when SayAll calls script functions such as in MSWord
saSayAllUnsupported=0, ; use internal processing rather than external function
saSayAllUnitSpoken=1, ; the unit was successfully spoken
saSayAllUnitBlank=2, ; a blank paragraph was spoken
saSayAllEndOfDocument=3, ; a move was unsuccessful.
saSayAllByLine=0,
saSayAllBySentence=1,
saSayAllByParagraph=2,
; The following options are used when SkimRead calls script functions such as in MSWord
srSkimReadUnsupported=0, ; use internal processing rather than external function
srSkimReadUnitSpoken=1, ; the unit was successfully spoken
srSkimReadUnitSkipped=2, ; the unit was skipped
srSkimReadEndOfDocument=3, ; a move was unsuccessful.
; Values for FrameViewer Activities
FRAMEVIEW_ShowActiveFrames = 1,
FRAMEVIEW_CreateFrame = 2,
FRAMEVIEW_FramesList = 4,
FRAMEVIEW_CreatePrompt = 8,
FRAMEVIEW_ModifyPrompt = 16,
;Html Tags
TAG_TABLE = "table",
TAG_LIST_ORDERED = "ol",
TAG_LIST_DEFINITION = "dl",
TAG_FORM = "form",
TAG_GRAPHIC = "img",
TAG_BLOCKQUOTE = "Blockquote",
TAG_OBJECT = "object",
; Integer value of 0xffffffff actually initializes to -1:
VALUE_NOT_READY 0xffffffff,
;For New Speech Markup Behaviors
smmIgnore=0,
smmSpeakItem=1,
smmPlaySound=2,
smmChangeVoice=3,
smmChangeLanguage=4,
smmSpeakAndPlaySound=5,
;Units of measure used for Speech Markup
smmTwips=0,
smmPixels=1,
smmSpaces=2,
smmCharacters=2, ;same as spaces but more intuitive to think in terms of character column and line offsets
smmPoints=3,
smmMM=4,
smmCM=5,
smmInches=6,
smmTabs=7,
;TextOptions to be used with smmMarkupString
toNothing=0,
toStateBefore=0x02,
toTypeBefore=0x04,
toStateAfter=0x08,
toTypeAfter=0x10,
toFontName=0x20,
toFontSize=0x40,
toTextColor=0x80,
toBackgroundColor=0x0100,
toAttributes=0x0200,
toRepeatCount=0x0400,
toIndent=0x0800,
;note some bits skipped, only used internally
toSymbols=0x4000,
toGraphics=0x8000,
toTrailingSpaces=0x00010000,
toLanguage=0x00200000,
toCaps=0x00400000,
toSpell=0x00800000,
toPhoneticSpell=0x01000000,
toQuote=0x02000000,
toStyleInfo=0x04000000,
toBorderDescription=0x08000000,
toWordOffsets=0x10000000,
toAnnotationIndication=0x20000000,
toAnnotationDetail=0x40000000,

; For selection Context information such as spelling errors, grammatical errors etc
; Notes:
;	* means that in MSWord, these are included in RTF and thus these flags should be left off.
;	! means that the setting for the flag comes from a JCF value
	selCtxSpellingErrors=0x01,
	selCtxGrammaticalErrors=0x02,
	selCtxRevisions=0x04,
	selCtxFields=0x08,;*
	selCtxFormFields=0x10,;*
	selCtxEmbeddedObjects=0x20,;*
	selCtxShapes=0x40,;*
	selCtxTables=0x80,
	selCtxListItemData=0x100,
	selCtxBorders=0x200,
	selCtxShading=0x400,
	selCtxComments=0x800,;*
	selCtxFootnotes=0x1000,;*
	selCtxEndnotes=0x2000,;*
	selCtxBookmarks=0x4000,
	selCtxSmartTags=0x8000,
	selCtxStyle=0x10000,
	selCtxExtraHelpIndication=0x20000,
	selCtxRightToLeftReadingOrder=0x40000,
	selCtxPageSectionColumnBreaks=0x80000,
	selCtxIndentation=0x100000, ;!
	selCtxTableCell=0x200000,
	selCtxStoryChange=0x400000,
	selCtxLineSpacingChange=0x800000,
	selCtxHorizTabStopPos=0x1000000,
	selCtxSelectionRect=0x2000000,
	selCtxMax=0x20000000, ; must be higher than any flags used for determining actual selection data.
	selCtxCountItemsInRange=0x40000000, ; speak the number of items in the navigation unit, eg when arrowing by line
	selCtxIndicateAfter=0x80000000, ; indicate selection context data after rather than before text content
	JCFSelCtxMask = 0x100000, ;The flags in this mask are to be excluded when saving the selection flagset to a JSI file

; Flags for Get/SetCountedSelectionContextItems.
; (new in JAWS 14):
	SelCtxCountNothing = 0,
	SelCtxCountRevisions = 0x1,
	SelCtxCountSpellingErrors = 0x2,
	SelCtxCountGrammaticalErrors = 0x4,
	SelCtxCountComments = 0x8,
	SelCtxCountFootnotes = 0x10,
	SelCtxCountEndNotes = 0x20,
	SelCtxCountFields = 0x40,
	SelCtxCountFormFields = 0x80,
	SelCtxCountEmbeddedObjects = 0x100,
	SelCtxCountShapes = 0x200,
	SelCtxCountBookmarks = 0x400,
	SelCtxCountSmartTags = 0x800,

; Table speaking and Navigation Directions
; The following constants serve as the first parameter to the utility
; function SpeakTableCells to control how it speaks in response to
; navigating between cells in a table via one of the Table Navigation
; Scripts.
;
; The default table navigation direction,
; Used by the SayCell script:
	TABLE_NAV_NONE=0,
; Indicates that that movement occured one cell in a vertical
; direction.
; Used by UpCell and DownCell:
	TABLE_NAV_VERTICAL=1,
; Indicates that that movement occured one cell in a horizontal
; direction.
; Used by PriorCell and NextCell:
	TABLE_NAV_HORIZONTAL=2,
; Indicates that movement occured within a row to either the end or
; the beginning of the row (to the extents of the row).
; Used by MoveToEndOfRow and MoveToStartOfRow:
	TABLE_NAV_ROW_EXTENTS=3,
; Indicates that movement occured within a column to either the end or
; the beginning of the column (to the extents of the column).
; Used by MoveToTopOfColumn and MoveToBottomOfColumn:
	TABLE_NAV_COLUMN_EXTENTS=4,
; Indicates that movement occured to either the first cell or the last cell
; in the table.  Used by the scripts FirstCellInTable and LastCellInTable:
	TABLE_NAV_TABLE_EXTENTS=5,
; Used by ReadCurrentRow, SayNextRow and SayPriorRow:
	TABLE_NAV_SAY_ROW=6,
; Used by ReadCurrentColumn, SayNextColumn and SayPriorColumn:
	TABLE_NAV_SAY_COLUMN=7,
; Used by ReadFromCurrentCell and ReadToCurrentCell to speak part of the row:
	TABLE_NAV_SAY_ROW_PARTIAL=8,
; Used by ReadFromTopOfColumn and ReadToBottomOfColumn to speak part of the column:
	TABLE_NAV_SAY_COLUMN_PARTIAL=9,
; used by JumpToTableCell and JumpReturnFromTableCell:
	TABLE_NAV_Jump=10,
; Used by Tab and Shift Tab
	TABLE_NAV_SAY_COLUMN_AND_ROW_HEADERS = 11,

; for Custom Page summary
CPSOff=0,
CPSSpeak=1,
CPSVirtualize=2,
; for SendMessage and Post message functions, other constants to be added as needed
WM_SETREDRAW=0x000B,
WM_SETFOCUS=0x0007,
WM_SETTEXT=0x000C,
WM_SETCURSOR=0x0020,
WM_NEXTDLGCTL = 0x28,
WM_CUT=0x0300,
WM_COPY=0x0301,
WM_PASTE=0x0302,
CB_SHOWDROPDOWN=0x014F,
;Output Destinations
OutputToSpeechDevice=0,
OutputToBrailleDevice=1,
;Skimreading Modes
srmOff=0,
srmFirstLineOfParagraph=1,
srmFirstSentenceOfParagraph=2,
srmTextMatchingRegularExpression=3,
srmMatchAttributesOrColor=4,
;NewLineOrParaIndicationContexts
indicateWhenTyping=1,
indicateWhenNavigating=2,
indicateWhenReading=4,
indicateDuringSayAll=8,
;File Location constants (for IniRead*Ex and IniWrite*Ex functions)
;Must agree with definitions in C++ header file <FileTypes.H>
FLOC_UNKNOWN=0,  ;use the given path
FLOC_PROGRAM_PATH=1,  ;file is in program directory
FLOC_HELP=2,  ;file is in Help directory
FLOC_MANUALS=3,  ;file is in Manuals directory
FLOC_FACTDEF=4,  ;file is in FactDef directory
FLOC_SETTINGS=5,  ;file is either in User Settings or Shared Settings directory
FLOC_USER_SETTINGS=6,  ;file is in User Settings directory
FLOC_SHARED_SETTINGS=7,  ;file is in Shared Settings directory
FLOC_PERSONALIZED_SETTINGS=8,  ;file is in either User or Shared PersonalizedSettings directory
FLOC_USER_PERSONALIZED_SETTINGS=9,  ;file is in User PersonalizedSettings directory
FLOC_SHARED_PERSONALIZED_SETTINGS=10,  ;file is in Shared PersonalizedSettings directory
FLOC_PLACEMARKERS=11,  ;file is in either User or Shared Placemarkers directory
FLOC_USER_PLACEMARKERS=12,  ;file is in User Placemarkers directory
FLOC_SHARED_PLACEMARKERS=13,  ;file is in Shared Placemarkers directory
FLOC_SOUNDS=14,  ;file is in either User or Shared Sounds directory
FLOC_USER_SOUNDS=15,  ;file is in User Sounds directory
FLOC_SHARED_SOUNDS=16,  ;file is in Shared Sounds directory
FLOC_MAX=17,
;Values for File Type:
  FT_MODULE_INI = 0,
  FT_JFW_INI = 0,
  FT_DEFAULT_JCF = 3,
  FT_CURRENT_JCF = 5,
  FT_JSI = 40,
  FT_SHARED_DEFAULT_JCF = 102,
  FT_SHARED_CURRENT_JCF = 103,
;Values for WriteDestination
	; /** Indicates that the setting should be saved to the user settings file. */
	wdUser = 0,
	; /** Indicates that the setting should be saved to the transient session settings file. */
	wdSession = 1,
	; /** Indicates that the setting should be saved to the transient focus settings file. */
	wdFocus = 2,
;ReadSource Constants
; /** Indicates that the standard layering behavior should be used.  That is
; to read from the transient focus file first, then the transient session
; file, then the user settings file, and finally the shared settings file,
; stopping at the first file in which the desired setting is found. */
	rsStandardLayering = 0,
; /** Indicates that the data should be read from the transient session file only. */
	rsSession = 1,
; /* Indicates that the data should be read from the transient focus file only. */
	rsFocus = 2,
;/** Indicates that both the transient session and transient focus files should be ignored.
;Data will only be read from the user settings file and the shared settings file
; with the data obtained from the user settings file taking precedence and being layered over the data obtained from the shared settings file.*/
	rsNoTransient = 3,
; Control ID's for the Custom Listview Headers  and Skim Reading dialogs
ID_SkimReadHelpBtn = 1033,
ID_TextRuleEdit = 1054,
Id_TextSearchPatternEdit = 1315,
ID_SelectVoiceAliasBtn = 1412,
ID_ToggleSpeechBtn = 7029,
ID_BrlMoveUpBtn = 7029,
ID_AddRuleBtn = 7029,
ID_ToggleBrailleBtn = 7030,
ID_BrlMoveDownBtn = 7048,
ID_MoveUpBtn = 7049,
ID_MoveDownBtn = 7050,
ID_SpeakUnitCombo = 7052,
ID_TextRulesCombo = 7053,
ID_DeleteAllRulesBtn = 7054,
id_SkimReadingIndicationChkBx = 7055,
id_TextRuleNameEdit = 7057,
ID_DeleteRuleBtn = 7061,
ID_RuleNameEdit = 7065,
id_DeleteCustomizationBtn = 7069,
ID_ModifyRuleBtn = 7070,
ID_SummarizeSkimReadBtn = 7071,
id_TextColorCombo = 7105,
id_BackgroundColorCombo = 7106,
id_BoldCheckBox = 7107,
id_ItalicCheckBox = 7108,
id_UnderLineCheckBox = 7109,
id_StrikeOutCheckBox = 7110,
id_DoubleStrikeOutCheckBOX = 7111,
id_SuperScriptCheckBox = 7112,
id_SubScriptCheckBox = 7119,
id_ShadowCheckBox = 7120,
id_OutlineCheckBox = 7121,
id_UseRegularExpressionChkBx = 7129,
ID_StartSkimReadBtn = 1,
ID_CloseSkimReadBtn = 2,
; Control ID's for the JAWS FindDialog:
id_StartFindBtn = 1,
id_CancelFindBtn = 2,
id_FindForwardRabioBtn = 1066,
id_FindBackwardRadioBtn = 1067,
id_IgnoreCaseCheckBox = 1068 ,
id_ContextSpecificHistoryCheckbox = 7201,
id_ClearHistoryBtn = 7029,
id_ClearHistoryCheckBox = 7103 ,
id_DeleteFindBtn = 7104,
; JAWS Options dialog control ID's:
	id_JAWSOptions_TreeView = 7153,
	id_JAWSOptionsCheckBox = 7156,
	id_JAWSOptionsReadOnlyEdit = 1300,
	id_JAWSOptionsCloseButton = 1,
	id_JAWSOptionsExecuteButton = 1055,
; Character Value Flags
cvfWantHex=0x01,
cvfWantMarkup=0x02,
cvfWantValueOfWideChar=0x04, ; (do not convert to multibyte sequence)
cvfWantHexIfMultibyteConversionFails=0x08,

; html tag constants used in virtual.jss
	cscAnchor = "ANCHOR",
	cscATag = "A",
	cscHRef = "href",
	cscMailTo = "mailto:",
	cscAnchorAttribs = "title,alt,name",
	cscGraphic = "IMG",
	cscGraphicAttribs = "fs:clbl,alt,title,src",
	cscList = "LIST",
	cscParagraph = "P",
	cscObject = "OBJECT",
	cscObjectAttribs = "title,alt",
	cscBlockQuote = "BLOCKQUOTE",
	cscBlockQuoteAttribs = "cite",
	cscHRSeparator = "HR",
	cscDivision = "DIV",
	cscDivisionAttribs = "title,",
	cscSpan = "SPAN",
	cscSpanAttribs = "span",
	cscSelectableItemCibtrolAttribs = "fs:clbl,label,title,alt,guess",
	cscAttribOnClick="onclick",
	cscAttribOnMouseOver="onmouseover",
	cscArticle="ARTICLE",

;for BX remote access:
;BX modifyer combo key name prefixes:
	cscBXKeyNameBrailleDotPrefix = "Braille Dot",
	cscBXKeyNameBraillePrefix = "Braille ",
	;For Focos Dot sequence,
	;Use to convert Focus key to BX key for modify:
	cscFocusDot1 = "Braille Dot ",
	cscFocusDotMulti = "Braille Dots ",
;BX modifyer combo key name suffix:
	cscBXKeyNameDot8ChordSuffix = "8 Chord",
;The BX modifyer dots in the modifyer chord:
	cscBXInsertDot = "2",
	cscBXControlDot = "3",
	cscBXWindowsDot = "4",
	cscBXJAWSKeyDot = "5",
	cscBXAltDot = "6",
	cscBXShiftDot = "7",
;for the qwerty-like key names used in key simulation:
	cscControlModifyer = "Control",
	cscAltModifyer = "Alt",
	cscShiftModifyer = "Shift",
	cscWindowsModifyer = "Windows",
	cscJAWSKeyModifyer = "JAWSKey",
	cscInsertModifyer = "Insert",
	cscKeyNameComponentSeparator = "+",
	cscHomeRowPrefix = "HomeRow",

;Toggle Keys:
	VK_CAPITAL=0x14,
	VK_NUMLOCK=0x90,
	VK_SCROLL=0x91,

;BX function key arrays:
	cscBXFunctionKeys = "abcdefghijkl",
	cscBXFunctionKeyNames = "F1|F2|F3|F4|F5|F6|F7|F8|F9|F10|F11|F12",

;HTML Style Sheet Processing
;depricated, unused anymore:
;Note inline styles are always processed,
;these settings only apply to linked and imported sheets
StyleSheetsIgnore=0,
StyleSheetsProcessTopLevel=1,
StyleSheetsProcessImported=2, ;includes top level and all imported sheets

;pseudo tags which may be passed to the tag related functions for special processing:
	TAG_SELECTABLE_ITEMS_CONTROL = "SELECTABLE_ITEMS_CONTROL",
	TAG_ANCHOR = "ANCHOR",
	TAG_LIST_ITEM="LIST_ITEM",
	TAG_LIST="LIST",

;for ProcessBoundaryStrike, used by TopEdgeEvent and BottomEdgeEvent:
	TopEdge = 1,
	BottomEdge = 2,

;MouseButtonEvent Identifiers
	WM_LBUTTONDOWN = 0x0201,
	WM_LBUTTONUP = 0x0202,
	WM_LBUTTONDBLCLK = 0x0203,
	WM_RBUTTONDOWN = 0x0204,
	WM_RBUTTONUP = 0x0205,
	WM_RBUTTONDBLCLK = 0x0206,
	WM_MBUTTONDOWN = 0x0207,
	WM_MBUTTONUP = 0x0208,
	WM_MBUTTONDBLCLK = 0x0209,
	WM_MOUSEWHEEL = 0x020A,
;lvGetItemState function return states:
	LVIS_FOCUSED = 1, ;The item has the focus
	LVIS_SELECTED = 2, ;The item is selected
	LVIS_CUT = 4, ;The item is marked for a cut-and-paste operation
	LVIS_DROPHILITED = 8, ;The item is highlighted as a drag-and-drop target
;tbGetItemState function return states:
	TBSTATE_CHECKED = 1,
	TBSTATE_PRESSED = 2,
	TBSTATE_ENABLED = 4,
	TBSTATE_HIDDEN = 8,
	TBSTATE_INDETERMINATE = 16,
	TBSTATE_WRAP = 32,
	TBSTATE_ELLIPSES = 64,
; JAWS Mode Constants
	; Only returned if an error occurred while determining the JAWS Mode
	jawsMode_Invalid = 0xffffffff,
	jawsMode_Full = 0,
	jawsMode_Tray = 1,
	jawsMode_MagUtil = 2,
; Registered Window Message Constants
; These strings should not be translated.
	VoiceProfilesContextMenu_MessageStr = "VoiceProfilesContextMenu",

;Document Load States
	DocState_Unknown = 0,
	DocState_Loading = 1,
	DocState_Loaded	= 2,

	; Cursor Coordinate System Constants
	COORDSYS_PIXELS=0,
	COORDSYS_COLUMN_ROW=1,
	COORDSYS_POINTS=4,

;for use with lvMoveByLineUnit:
	lvLineMoveUnitFirst = 1,
	lvLineMoveUnitLast = 2,
	lvLineMoveUnitPrior = 3,
	lvLineMoveUnitNext = 4,
;	For Proofreading Element types
	peSpellingError=0,
	peGrammaticalError=1,
	peRevision=2,
	peComment=3,
	peFootnote=4,
	peEndnote=5,
	peInlineShape=6,
	peObject=7,
	peField=8,
	peBookmark=9,
;	;Nonbreaking symbol constants
	IndicateNonbreakingSymbolsOff=0,
	IndicateNonbreakingSymbolsSayChar=1,
	IndicateNonbreakingSymbolsSayWord=2,
	IndicateNonbreakingSymbolsSayLineOrHigher=3,
	IndicateNonbreakingSymbolsSayAll=4,

;for use with NextLine, PriorLine, TypeKey and Enter
; lines up to the enumeration defined in FSSDK/<branch>/include/jInputDefines.h
	INP_Keyboard = 1,
	INP_BrailleDisplay = 2,
	INP_Mouse = 3,

;To specify how a function will add text to the user buffer:
	Text_replaceUserBuffer = 0,
	Text_PrependToUserBuffer = 1,
	Text_AppendToUserBuffer = 2,
	Text_InsertInUserBuffer = 3,

;SALModeFunction output types:
	sal_SayCharacter = 0,
	sal_SpellWord = 1,

;for the Links List dialog:
	ID_LinksList_MoveToLink = 1095,
	iD_LinksList_ActivateLink = 1100,
	iD_LinksList_Address = 1115,
;For the Manage Call dialog
	ID_ManageCall_AcceptWithAudio = 7171,
	ID_ManageCall_AcceptWithVideo = 7172,
	ID_ManageCall_Decline = 7173,
	ID_ManageCall_HangUp = 7174,
	ID_ManageCall_MakePrimary = 7175,
;For the Set Braille View dialog
	ID_SetBrailleView_Default = 7171,
	ID_SetBrailleView_SwapSplit = 7172,
	ID_SetBrailleView_Options = 7173,
;For GetNearestLink and the dlgListOfLinks dialog functions, or these together:
FSLinkVisited=1,
FSLinkUnvisited=2,
FSSamePageLink=4,
FSURLLink=8,
FSMailLink=16,
FSFTPLink=32,
FSNewsLink=64,
FSImageMapLink=128,
FSLinksAll=0xffff,

;for function ProcessMoveToLink, the link type to move to:
	UnvisitedLink = 0,
	VisitedLink = 1,
	AnyLink = 2,

;
relation_controlledBy = 1,
relation_controllerFor = 2,
relation_describedBy = 4,
relation_descriptionFor = 8,
relation_embeddedBy = 16,
relation_embeds = 32,
relation_flowsFrom = 64,
relation_flowsTo = 128,
relation_labelFor = 256,
relation_labelledBy = 512,
relation_memberOf = 1024,
relation_nodeChildOf = 2048,
relation_parentWindowOf = 4096,
relation_popupFor = 8192,
relation_subwindowOf = 16384,
relation_aria_owns=0x8000,
relation_aria_active_descendant=0x10000,
relation_node_parent_of=0x20000,
relation_aria_error_message=0x40000 ,
relation_aria_error_for=0x80000 ,
relation_aria_details=0x100000 ,
relation_aria_details_for=0x200000,

;for setting the JTController mode.
	JTCONTROLLER_MODE_MIN = 0,
	JTCONTROLLER_MODE_FULL = 1,
	JTCONTROLLER_MODE_SLEEP = 2,
	JTCONTROLLER_MODE_TOGGLE = 3,
	JTCONTROLLER_MODE_VIDTOGGLE = 4,

;tandem modes:
	Tandem_Mode_NotConnected = 0,
	Tandem_Mode_Connected = 1,
	Tandem_Mode_Connection_Suspended = 2,

;In TandemConnectionEvent:
	Tandem_Controller = 0,
	Tandem_Target = 1,
	Tandem_Status_Disconnected = 0,
	Tandem_Status_Connected = 1,

;for the RemoteControllerModeChangedEvent:
	ControllerMode_Minimized = 0,
	ControllerMode_FullScreen = 1,

;Control ID's for save and open dialogs
	CID_SaveAsEditCombo = 1001,
	CID_OpenEditCombo = 1148,

;Control ID's:
	cID_ShellNotifyToolBar = 1504,
;Window classes:
	cwc_TeamsWebView = "TeamsWebView",
	cwc_Scintilla = "Scintilla",
	cwc_VirtViewHelp = "VIRTVIEWHELP",
	cwc_JTController = "JTController",
	cwc_FeatureTree = "FeatureTree",
	cWcMenuClass = "#32768",
	cwc_Xaml_WindowedPopupClass = "Xaml_WindowedPopupClass",
	cwc_ComboLBox = "ComboLBox",
	cwc_ShellDLL_DefView = "SHELLDLL_DefView",
	cwc_ShellNotify = "Shell_TrayWnd",
	cwc_ShellNotifyToolBar = "ToolbarWindow32",
	cwc_ToastChildWindowClass = "ToastChildWindowClass",
 	cwc_SystemToastActivatedWindow = "SystemToastActivatedWindow",
 	cwc_TrayShowDesktopButtonWClass = "TrayShowDesktopButtonWClass",
 	cwc_TrayNotifyWnd = "TrayNotifyWnd",
 	cwc_CiceroUIWndFrame = "CiceroUIWndFrame",
 	cwc_ConsoleWindowClass = "ConsoleWindowClass",
 	cwc_MozillaWindowClass = "MozillaWindowClass",  ;Firefox application area, not the content area
 	CWC_MozillaContentWindowClass  = "MozillaContentWindowClass",  ;The browser content area
 	cwc_MozillaDialogClass = "MozillaDialogClass",
 	cwc_MozillaPrefix = "Mozilla",  ;Firefox windows prefix
	cwc_ChromeWindowClass = "Chrome_RenderWidgetHostHWND",
	cwc_Chrome_WidgetWin_1 = "Chrome_WidgetWin_1",
 	cwc_Rctrl_RenWnd32="Rctrl_RenWnd32",  ;Outlook top level window for open messages
 	cwc_SuperGrid = "SUPERGRID",  ;Outlook 2010 message list
 	cwc_OutlookGrid = "OutlookGrid",  ;Outlook 2013 and later message list
 	cwc_Wwg = "_Wwg",  ;Word document and Outlook messages
	cwc_Bosa_sdm_ = "bosa_sdm_", ;this is the class name prefix, not the entire class name,
	cwc_Excel7 = "EXCEL7",
	cwc_Windows_UI_Core_CoreWindow = "Windows.UI.Core.CoreWindow",
	cwc_Windows_UI_Core_CoreComponentInputSource = "Windows.UI.Core.CoreComponentInputSource",
	cwc_segment_ZoomText = "AiSquared.ZoomText.UI.exe",
	cwc_HwndWrapper = "HwndWrapper",  ;first part of window class name for WPF applications
	cscListviewClass="SysListview32",
	; Window class of Alt+Tab list on Windows 10, not on Windows 11
	cwc_Win10_AltTabWindow = "MultitaskingViewFrame",

;UIA class names:
	UIAClass_Root = "#32769",
	UIAClass_UIItemsView = "UIItemsView",
	UIAClass_UIGroupItem = "UIGroupItem",
	UIAClass_UIItem = "UIItem",
	UIAClass_SysListView32 = "SysListView32",
	UIAClass_sysTreeview32 = "sysTreeview32",
	UIAClass_ProperTreeHost = "ProperTreeHost",
	UIAClass_ShellDLL_DefView = "SHELLDLL_DefView",
	UIAClass_DUIListView = "DUIListView",
	UIAClass_NetUISlabContainer = "NetUISlabContainer",
	UIAClass_NetUILabel = "NetUILabel",
	UIAClass_NetUIPropertyTextbox = "NetUIPropertyTextbox",
	UIAClass_NetUIImage = "NetUIImage",
	UIAClass_NetUISimpleButton = "NetUISimpleButton",
	UIAClass_MAGicUI_StatusBar = "BCGPStatusBar:",  ;first portion of className for MAGic UI status bar
	UIAClass_MAGicUI_RibbonBar = "BCGPRibbonBar:",  ;first portion of className for MAGic UI ribbon bar
	UIAClass_TrayShowDesktopButtonWClass = "TrayShowDesktopButtonWClass",
	UIAClass_XLSpreadsheetCell = "XLSpreadsheetCell",
	UIAClass_XLGridRowHeader = "XLGridRowHeader",
	UIAClass_XLGridColumnHeader = "XLGridColumnHeader",
;Automation ID's:
	UIA_AutomationID_Windows_11_Tray_Icon = "SystemTrayIcon",

; Automation ID for Windows+tab Window On Windows 10 and Windows 11,
; and the ID of the Alt+Tab list on Windows 11 only.
	UIAAutomationID_TaskSwitchingWindow = "SwitchItemListControl", ; listbox containing  running apps

	UIAAutomationID_NormalToastView = "NormalToastView",
	UIAAutomationID_SenderName = "SenderName",
	UIAAutomationID_TeamsLeaveButton = "hangup-button",
	UIAAutomationID_TeamsMuteButton = "microphone-button",
	UIAAutomationID_TeamsCameraButton = "video-button",
	UIAAutomationID_TeamsShareButton = "share-button",
;For increasing and decreasing a range value via UIA:
	UIARangeDecrease = 0,
	UIARangeIncrease = 1,

;names of internal key bindings for tandem and their scripts:
	StartOrEndTandemSessionKey = "JAWSKey+Alt+T",
	StartOrEndTandemSessionScript = "StartOrEndTandemSession",
	ToggleTandemModeKey = "JAWSKey+Alt+Tab",
	ToggleTandemModeScript = "ToggleTandemMode",
	PauseTandemVideoKey = "JAWSKey+Control+Shift+V",
	PauseTandemVideoScript = "PauseTandemVideo",


;user buffer window names:
;note that these window names are used for internal identification only and are not to be translated
	cwubn_ManagedVirtualHelp = "Managed Virtual Help User Buffer",

;DlgSelectItemInList button constants:
	dlgSelectItemInList_ID_Cancel = 0,
	dlgSelectItemInList_ID_OK = 0xffffffff,
	dlgSelectItemInList_ID_Custom1 = 1,
	dlgSelectItemInList_ID_Custom2 = 2,
	dlgSelectItemInList_ID_Custom3 = 3,
	dlgSelectItemInList_ID_Custom4 = 4,
	dlgSelectItemInList_ID_Custom5 = 5,

;PresentAllOccurrences occurrence types:
	Occurrence_Line = 0,
	Occurrence_Sentence = 1,
	Occurrence_Paragraph = 2,

	; the following flags are used by ApplicationModeEvent
	appModeOn = 1,
	appModeChange = 2,
	appModeAnnounceChange = 4,
	appModeEmbeddedDoc = 8,
	appModeEmbeddedDocChange = 16,
	appModeEmbeddedDocAnnounceChange = 32,

;values for the key status in KeymapChangedEvent:
	KeySequenceComplete = 0,
	KeySequenceRepeating = 1,
	KeySequencePending = 2,
	KeySequenceCanceled = 3,
	KeySequenceStart = 4,
	KeySequenceRestarted = 5,

;for ribbons:
	Ribbons_Inactive = 0,
	RibbonTabs_Active = 1,
	LowerRibbon_Active = 2,
	RibbonCollapsed=3,
;Constants for different module ID types, returned by GetObjectModuleId:
	MID_Unknown = 0,
	MID_RichEdit = 1,
	MID_Flash = 2,
	MID_ITunes = 3,
	MID_UIA = 4,
	MID_Workplace = 5,
	MID_PDF = 6,
	MID_MSWord = 7,
	MID_CommonMSAA = 8,
	MID_IE = 9,
	MID_Firefox = 10,
;brlInitialShowRange constants for use with BrailleRefresh
	brlShowFirstRange=0, ; show the first display worth of data
	brlShowSameRange=1, ; attempt to align to same relative offset in data as prior show
	brlShowLastRange=2, ; show the last range of the data
	brlShowRangeContainingCursor=3, ; show the range containing the cursor acording to the autoPanMode.
;for Braille DOM and OSM support:
	BrlUseDOMAlways=0, ;DOM whenever it is available
	BrlUseLegacy=1, ; OSM except for edit windows
	BrlUseHybrid=2, ;use DOM except when panning away from the focused line. This is the new hybrid mode.
	BrlUseOSMAlways=3, ;always use OSM, never use DOM even if available.

;shortcut and windows command script names
    LaunchWindowsShortcutScript = "LaunchWindowsShortcut",
    WindowsCmdScript = "WindowsCmd",

; the following values are returned by GetRelationshipBetweenCurrentAndPreviousFocusObjects
CurrentAndPreviousFocusNotRelated = 0,
CurrentFocusIsParentOfPrevious = 1,
PreviousFocusIsParentOfCurrent = 2,
;How to indicate inconsistencies
TextAnalyserOff=0,
TextAnalyserIndicateWithSound=1,
TextAnalyserSpeakCount=2,
TextAnalyserDescribeAllInconsistencies=3,
;range to check for inconsistencies
CheckLine=0,
CheckSentence=1,
CheckParagraph=2,
;For Inconsistency types detected by the JAWS 12 Text Analyser feature
;returned byref from functions like GetRangeInconsistencyByIndex and MoveToRangeInconsistency
MismatchedSymbolPairUnopened=1,
MismatchedSymbolPairUnclosed=2,
StrayPunctuationSymbol=3,
UnspacedPunctuationSymbol=4,
WhitespaceRun=5,
FontChange=6,
MissingInitialCapital=7,
InvertedCaps=8,
MixedWidthCharacters=9,
;flags governing which inconsistencies are detected by the text analyser
IndicateMismatchedSymbolPairs=0x01,
IndicateStrayPunctuation=0x02,
IndicateUnspacedPunctuation=0x04,
IndicateWhitespaceRuns=0x08,
IndicateFontChanges=0x10,
IndicateMissingInitialCapital=0x20,
IndicateInvertedCaps=0x40,
IgnoreSolitaryPairedSymbol=0x80,
IndicateFontName=0x100,
IndicateFontSize=0x200,
IndicateTextAttributes=0x400,
IndicateColorChanges=0x800,
IndicateMixedWidthKatakana=0x1000,
;Flags governing which symbol categories are checked for correct pairing
CheckParentheses=0x01,
CheckBrackets=0x02,
CheckBraces=0x04,
CheckAngleBrackets=0x08,
CheckQuotes=0x10,
CheckInvertedMarks=0x20, ; inverted question and exclamation marks in spanish text.
		CheckJapaneseParens=0x80, ; chars 0x300c/0x300d, 0x300e/0x300f, 0xff08/0xff09
	;types of ARIA landmarks
LANDMARK_NONE=0,
LANDMARK_BANNER=0x01,
LANDMARK_COMPLEMENTARY=0x02,
LANDMARK_CONTENTINFO=0x04,
LANDMARK_MAIN=0x08,
LANDMARK_NAVIGATION=0x10,
LANDMARK_NOTE=0x20,
LANDMARK_SEARCH=0x40,
LANDMARK_STATUS=0x80,
LANDMARK_APPLICATION=0x100,
LANDMARK_FORM=0x200,
LANDMARK_REGION=0x400,
LANDMARK_ARTICLE=0x800,
LANDMARK_ANY=0xffffffff,
;ARIA roles
	ARIA_ROLE_APPLICATION = "application",
	ARIA_ROLE_GRID = "grid",
;Process flags for SayWindowPromptAndTextPostProcess, denoting which optional processes will run in the function:
	SayWindowPromptAndText_TutorialHelp = 0x01,
	SayWindowPromptAndText_IndicateComputerBraille = 0x02,
	SayWindowPromptAndText_AnalyzeTextLine = 0x04,
	SayWindowPromptAndText_SayLastTipFromEvent = 0x08,
	SayWindowPromptAndText_SpeakProgressBarInfo = 0x10,
	SayWindowPromptAndText_AllProcesses = 0x1f, ;must equal all flags

;the modes for contracted braille:
	ContractedBraille_Off= 0,
	ContractedBraille_OutputOnly = 1,
	ContractedBraille_InputAndOutput = 2,

;for determining the battery status:
	BATTERY_STATUS_UNKNOWN = 255,

; Specifies the size of a document that is considered to be a large
; document.
	LargeDocumentSize = 50000,

;for the key layers, the type of layers:
	NoLayerActive = 0,
	BasicLayerActive = 1,
	TableLayerActive = 2,
	OCRLayerActive = 3,
	EchoLayerActive = 4,
	InspectLayerActive = 5,
	SkypeLayerActive = 6,
	GoogleDocsLayerActive = 7,
	DescribeLayerActive = 8,
	SkypeDesktopLayerActive = 9,
	ViewerLayerActive = 10,
	VolumeLayerActive = 11,
	; The next four layers are secondary to the volume layer:
	JAWSVolumeLayerActive = 12,
	SystemVolumeLayerActive = 13,
	SoundBalanceLayerActive = 14,
	SoundCardsLayerActive = 15,
	FaceInViewLayerActive = 16,
	CamerasLayerActive = 17,

;for the return values of CanRecognize:
	OCR_FAIL = 0,
	OCR_SUCCESS = 1,
	OCR_SUCCESS_NoText = 2,
	OCR_NOT_SUPPORTED = 2, ; used by CanRecognize () function
	OCR_BadPassword = 3, ; inacurate password for Adobe PDF
	OCR_LowResImage = 4, ; image in the document is too low for recognition.
	OCR_PasswordRequired = 5, ; the job has completed, JAWS will prompt the user for a password and initiate a new job
	OCR_NoDevicesAvailable = 6, ; there are no devices available for a camera recognition
	OCR_Warning_UNKNOWN = 0, ; should never happen
	OCR_Warning_LowResImage = 1,

;for the type of OcrStartedEvent
	OCR_ScreenArea = 0,
	OCR_PdfDocument = 1,
	OCR_ImageFile = 2,
	OCR_Camera = 3,
	OCR_Camera_MotionDetect = 4,
	OCR_Scanner = 5,
	OCR_CameraPsFromMenu = 6,
	OCR_CameraPsFromKeyboard = 7,
	OCR_CameraPsFromFusion = 8,

; return values from recognition internal functions
	OCRResult_Success = 0,
	OCRResult_Failure = 1,
	OCRResult_NoFileSelected = 2,
	OCRResult_MultipleFilesSelected = 3,
	OCRResult_UnsupportedFileSelected = 4,
	OCRResult_NoDevicesAvailable = 5,
; Background OCR service options (flags)
	BackgroundOCRServiceOptions_Default = 0,
	BackgroundOCRServiceOptions_PlaySound = 1,

; RecognizeFile Types
	csConvenientOCR = 0,
	csPictureSmartFromMenu = 1,
	csPictureSmartFromKeyboard = 2,
	csPictureSmartFromFusion = 3,
	csConvenientOCRToWord = 4,

; return values from Picture Smart functions
	PSResult_Success = 0,
	PSResult_Failure = 1,
	PSResult_NoFileSelected = 2,
	PSResult_MultipleFilesSelected = 3,
	PSResult_UnsupportedFileSelected = 4,
	PSResult_NoDevicesAvailable = 5,
	PSResult_DemoMode = 6,
	PSResult_CursorModeIncorrect = 7,
	PSResult_NoArea = 8,
	PSResult_NoTelemetry = 9,
	PSResult_FileInsideArchive = 10,

; Picture Smart service options (flags)
	PSServiceOptions_Single = 0,
	PSServiceOptions_Multi = 1,
	PSServiceOptions_FaceInView = 2,
	PSServiceOptions_Legacy = 4,
	PSServiceOptions_AskPrelim = 8,

; image recognition status
	ImageRecognition_Started = 0,			; processing started message
	ImageRecognition_Processing = 1,		; processing occuring beep
	ImageRecognition_StartError = 2,		; generic error occurred message

; voice assistant feedback id
	VAFeedback_Error_Unknown = 0,
	VAFeedback_Error_NotInitialized = 1,
	VAFeedback_Error_NotEnabled = 2,
	VAFeedback_Error_NoMicrophone = 4,
	VAFeedback_Error_SpeechService = 5,
	VAFeedback_Error_SpeechRecognition = 6,

	VAFeedback_Processing_AuthenticationError = 100,
	VAFeedback_Processing_ConnectionFailure = 101,
	VAFeedback_Processing_ServiceTimeout = 102,
	VAFeedback_Processing_ServiceError = 103,
	VAFeedback_Processing_ServiceUnavailable = 104,
	VAFeedback_Processing_KeyServiceError = 105,

	VAFeedback_SpeechRecognized_Empty = 200,
	VAFeedback_SpeechRecognized_Unknown = 201,
	VAFeedback_SpeechRecognized_RequiresMSWord = 202,
	VAFeedback_SpeechRecognized_RequiresMSOutlook = 203,
	VAFeedback_SpeechRecognized_RequiresMSWordOrOutlook = 204,
	VAFeedback_SpeechRecognized_InvalidVoiceRate = 205,
	VAFeedback_SpeechRecognized_NoJokeAvailable = 206,
	VAFeedback_SpeechRecognized_ExitJawsDialog = 207,

; Math Editor built-in function results. Search ScriptBuiltinFunctions for MathEditorResult
	MathEditorResult_Success = 0,
	MathEditorResult_FailedToLaunch = 1,
	MathEditorResult_ContractedBrailleNotEnabled = 2,
	MathEditorResult_Windows10Required = 3,
	MathEditorResult_LanguageNotSupported = 4,
	MathEditorResult_NotEnabled = 5,

; Math Viewer built-in function results. Search ScriptBuiltinFunctions for MathViewerResult
	MathViewerResult_Success = 0,
	MathViewerResult_NoMathML = 1,
	MathViewerResult_NotEnabled = 2,

; App requesting the Math Editor
	MathEditorRequestor_Default = "Script",
	MathEditorRequestor_MSWord = "MS-Word",

; App requesting the Math Viewer
	MathViewerRequestor_Default = "Script",
	MathViewerRequestor_MSWord = "MS-Word",

; Products info bits, for	getRunningFSProducts () function
	product_JAWS	1,
	product_MAGic	2,
	product_OpenBook	4,
	product_ZoomText 8,
	product_Fusion 16,

;cursor names, not to be translated:
	cscVirtualRibbonPCCursor="Virtual Ribbon PC Cursor",
	cscFSDomCursorName = "FSDom",  ;partial name
	cscFSDomEditCursorName = "FSDom edit",  ;partial name of FSDomEdit2 cursor
	cscAceCursorName = "Ace", ;partial name

;for the locked keyboard:
	scriptNameDelimiter = ".",

; MAGic screen capture modes:
	MAGic_ScreenCaptureMode_FullMAGicViewPort = 0,
	MAGic_ScreenCaptureMode_VisibleMagnifiedArea = 1,

; Reason identifiers used by the ReportLinksNotAvailable and ReportHeadingsNotAvailable
; function.
	NotAvailableReason_NotVirtualDocument = 0,
	NotAvailableReason_NotFound = 1,

; Document Presentation Modes
	; Used by JAWS, user configurable
	DocumentPresentationMode_SimpleLayout = 0,
	; Used by JAWS, user configurable
	DocumentPresentationMode_ScreenLayout = 1,
	; Used only by MAGic, whenever MAGic is running
	DocumentPresentationMode_EnhancedScreenLayout = 2,

; Contains Markup Options for Say and SayUsingVoice
	noMarkup = 0,
	hasMarkup = 1,
	smartMarkupDetection = 2

;the following messages are not to be translated:
Messages
;LockKeyboardReleaseAndRunScripts are scripts which will release the lock and run,
;LockedKeyboardPassThroughScripts are scripts permitted to run while the lock remains active.
;Each script name must have the beginning and ending marker.
;Note that the LockKeyboard script itself is intentionally omitted from the LockKeyboardReleaseAndRunScripts list
;because the script is the lock toggle.
@LockKeyboardReleaseAndRunScripts
.ShutDownJAWS.
.JAWSMemDmp.
@@
@lockedKeyboardPassThroughScripts
.SayWindowPromptAndText.
.SayLine.
.SayToCursor.
.SayFromCursor.
.SayWord.
.SayCharacter.
.SayTopLineOfWindow.
.SayBottomLineOfWindow.
.SayCell.
.SayWindowTitle.
.BraillePanRight.
.BraillePanLeft.
.BrailleNextLine.
.BraillePriorLine.
.BrailleMoveRight.
.BrailleMoveLeft.
.BrailleTop.
.BrailleBottom.
.RouteBrailleToActiveCursor.
.RestrictBrailleCursor.
.BrailleGrade2ExpandCurrentWord.
.BrailleGrade2Translation.
.ReadBoxInTabOrder.
.SaySystemTime.
.SayBatteryLevel.
.PCCursor.
.JAWSCursor.
.RefreshScreen.
@@
@lockedKeyboardPassThroughNavScripts
.RestrictCurrentCursor.
.RouteJAWSCursorToPc.
.SayNextLine.
.SayPriorLine.
.SayNextWord.
.SayPriorWord.
.SayNextCharacter.
.SayPriorCharacter.
.JAWSHome.
.JAWSEnd.
.TopOfFile.
.BottomOfFile.
.JAWSPageUp.
.JAWSPageDown.
@@
EndMessages

;Input source constants, for use with GetLastInputSource
const
	InputSource_Keyboard = 1,
	InputSource_Braille = 2,
	InputSource_Touch = 4

;used by Keyboard Help:
const
	KeyboardHelpType_Synopsis = 1,
	KeyboardHelpType_Description = 2,
	KeyboardHelpType_Name = 3,
;KeyboardHelpType_Gesture should not use next higher number than KeyboardHelpType_Name,
;to avoid accidental triggering of gesture help by more than three presses of a keyboard key:
	KeyboardHelpType_Gesture = 0xffff,

;ContinuousGestureTickCountThreshold is used to prevent repeatedly announcing a continuous gesture while it is performed.
;The value is the number of ticks which must elapse between gestures before it is considered to not be continuous:
ContinuousGestureTickCountThreshold = 300,

; Variant types returned from the function GetVariantType( variant )
	VT_EMPTY = 0,
	VT_INT = 3,
	VT_STRING = 8,
	VT_OBJECT = 9,
	VT_RECORD = 36,

;empty HTML document string for Results viewer:
	HTML_EmptyDocument = "<html><body></body></html>",

;UIA objects return -1 for true, 0 for false.
;To distinguish from UIA object true, UIA script error code is set to -2:
	UIAScriptError = 0xfffffffe,

;touch navigation directions, used for advanced touch navigation:
	TouchNavigate_NextSibling = 1,
	TouchNavigate_PriorSibling = 2,
	TouchNavigate_FirstChild = 3,
	TouchNavigate_Parent = 4,
;for touch and object navigation:
;the text review virtual window name is not displayed to the user,
;so it does not need localization:
	vwn_ObjectTextReviewOutput = "ObjectTextReviewOutput",
	; Braille Routing Types
	RouteAndClick = 0,
	RouteOnly = 1,
; constants for FindElementAndPerformAction function
	Action_setFocus=0,
	Action_makeVisible=1,
	Action_doDefaultAction=2,
	Action_leftMouseClick=3,
	Action_rightMouseClick=4,
;Smart Navigation levels
; Now a bit pattern so controls and tables can be toggled independently.
	smartNavOff=0,
	smartNavControls=1,
	smartNavTables=2,
	smartNavControlsAndTables=3,
	smartNavigationReset = 0x80,
;Gesture modes are for managing the actions performed by gestures on touch devices:
	GestureMode_TouchNavigation = 0, ;this is the default mode
	GestureMode_TextReading = 1, ;For navigating text anywhere, not just in the context of object text review
	GestureMode_SpeechSettings = 2, ;Makes speech settings easily available
	FirstGestureMode = 0, ;for cycling through gesture modes
	LastGestureMode = 2, ;Used for cycling through modes, this must equal the highest mode number
; Alternate User Directory Modes are provide control control over the location that will be used as
; the user settings directory in order to provide support for the use of alternate user directories
; in JAWS and MAGic.
	; This is the default. This causes the standard user directory for the product to be used.
	AlternateUserDirMode_Off = 0,
	; This mode causes user settings to be saved in a subdirectory of the temp directory. The
	; contents of this directory are transient; that is the contents of this directory are deleted
	; when the product, JAWS or MAGic, enters or exits the mode. This mode is used for diagnostic
	; purposes to determine if problems may be the result of user settings. Since the directory is
	; initially empty this essentially causes the product to use factory default settings.
	;
	; This Alternate User Directory Mode replaces the Default User Mode that was introduced in JAWS 6.
	AlternateUserDirMode_Default = 1,
	; This mode causes user settings to be saved in a subdirectory of the ProgramData directory. The
	; contents of this directory are persistent. This mode is intended for use on systems that have
	; multiple user accounts and one blind user that must log in to the various different user accounts.
	; It allows the blind user to configure JAWS once and use the same settings for all user accounts.
	AlternateUserDirMode_Roam = 2

;The following section contains non-localizable messages moved from common.jsm:
Messages
@cmsg282_L
ProductName
@@
@cmsg283_L
ProductVersion
@@
@cmsg284_L
Comments
@@
EndMessages

;For script functions which return an error value:
const
	ScriptFunctionReturnError = 0xffffffff

;for determining which product controls mouse speech:
;MouseEchoControlledBy enumerates the products which control mouse echo,
;and MouseEchoControllingProduct (in hjGlobal.jsh) is assigned one of their values.
const
	MouseEchoControlledBy_Magic = 1,
	MouseEchoControlledBy_JAWS = 2

const
	DigitChars = "0123456789",
; For Heading Navigation
		newSectionStop=0, ; Stop if navigation passes a higher level, e.g. h2 or h1 when searching for h3.
		newSectionSpeakHeadings=1, ; Speak the h1 and h2 immediately relevant to the new h3.
		newSectionPlaySound=2 ; Play a sound to indicate navigation has passed an h1 or h2 while searching for an h3.

;constants for fields to include when resetting speech markup attributes
const
AttribFieldNone=0x0,
AttribFieldControlTypeAndState = 0xf,
AttribFieldAttributes = 0x30,
AttribFieldColorInfo = 0x1c0,
AttribFieldLanguage = 0x200,
AttribFieldPositionInfo = 0x7800,
AttribFieldOutlineAndIndent = 0x8400,
AttribFieldFontInfo = 0x30000,
AttribFieldStyle = 0x40000,
AttribFieldAll = 0xFFFFFFFF,
; Registry Hive entries:
;0=HKEY_CLASSES_ROOT, 1=HKEY_CURRENT_USER, 2=HKEY_LOCAL_MACHINE, 3=HKEY_USERS.
HKEY_CLASSES_ROOT   	0,
	HKEY_CURRENT_USER     1,
	HKEY_LOCAL_MACHINE    2,
	HKEY_USERS            3

; The following contants are debug levels used by the GetDebugLevelName, OutputDebugStringL,
; and FormattedOutputDebugStringL functions in say.jss.
const
	LEVEL_ALWAYS = -1,
	LEVEL_MIN = 0,
	LEVEL_SEVERE = 0,
	LEVEL_ERROR = 1,
	LEVEL_WARNING = 2,
	LEVEL_INFO = 3,
	LEVEL_ENTRY = 4,
	LEVEL_PARAM = 5,
	LEVEL_DEBUG = 6,
	LEVEL_HIDEBUG = 7,
	LEVEL_MAX = 7,
	; Braille Profile States as returned by BrailleGetProfileState
		brlComputerInComputerOut=0,
	brlComputerInContractedOut=1,
	brlContractedInContractedOut=2,
; constants for Show Time in Status Cells are bits, bit 0 on/off, bit 1 format, 0 hours and minutes, 1 minutes and seconds.
	scTmOff=0,
	scTmOn=1,
	sctmHoursMinutes=0x0,
	sctmMinutesSeconds=0x02

; Alert timer thresholds, used to test for time since last alert:
const
	MSAAAlertTimerThreshold = 500  ;milliseconds

; FSLog levels
const
	TRACE_LEVEL_CRITICAL = 1, /* Abnormal exit or termination */
	TRACE_LEVEL_ERROR = 2, /* Severe errors that need logging */
	TRACE_LEVEL_WARNING = 3, /* Warnings such as allocation failure */
	TRACE_LEVEL_INFORMATION = 4, /* Includes non-error cases(e.g.,Entry-Exit) */
	TRACE_LEVEL_VERBOSE = 5 /* Detailed traces from intermediate steps */

; SoundMixer feedback codes
const
SoundMixerFeedback_RoutedLeft=1,
SoundMixerFeedback_RoutedRight=2,
SoundMixerFeedback_RestoredBalance=3,

; SoundMixer feedback known errors
SoundMixerError_UnsupportedAudioDevice = 2

; Notification Processing results
const
NotificationProcessing_GlobalActionNoAction = "NoAction",
NotificationProcessing_SpeechActionMute = "Mute",
NotificationProcessing_SpeechActionShortenSpeechMessage = "ShortenSpeechMessage",
NotificationProcessing_SpeechActionPlaySound = "PlaySound",
NotificationProcessing_BrailleActionNoFlashMessage = "NoBrailleFlash",
NotificationProcessing_BrailleActionShortenFlashMessage = "ShortenBrailleFlash"

; Script invocation contexts
const
Script_InvokedBy_Keystroke = 0,
Script_InvokedBy_VoiceAssistant = 1,
Script_InvokedBy_Script = 2,
Script_InvokedBy_Internals = 3

; Architecture Names
const
Architecture_x64 = "x64",
Architecture_arm64 = "Arm64"

;Braille Split Modes
const
brlSplitOff=0,
brlSplitBufferedDocument=1,
brlSplitAnnotations=2,
brlSplitTextAndAttributes=3,
brlSplitBrailleAndSpeech=4,
brlSplitTranslation=5,
brlSplitJAWSCursorLine=6,
brlSplitWindow=7,
brlSplitCommandPromptAndHistory=253,
brlSplitScriptDefined=254,
; the values of brlMultilineView come from the selected item in the Default
; Line View combo of Settings Center with one exception. Wrapped and
; Cropped both are written with a value of 0 because cropped has its own
; flag for good reason, cropped mode is not mutually exclusive to other modes.
	brlMultilineViewNotSet=-1,
	brlMultilineViewWrapped=0,
	brlMultilineViewCropped=0, ; has index of 1 in combo but is written as 0 and combined with the cropped mode flag.
	brlMultilineViewAnnotations=2,
	brlMultilineViewAttributes=3,
	brlMultilineViewSpeechHistory=4,
	brlMultilineViewSplitTranslation=5
;Responses for the ManageCall script
const
	ManageCall_AcceptWithAudio = 1,
	ManageCall_AcceptWithVideo = 2,
	ManageCall_Decline = 3,
	ManageCall_HangUp = 4,
	ManageCall_MakePrimary = 5

;virtualCursorRestrictionType constants:
const
	virtualCursorRestriction_Off = 0,
	virtualCursorRestriction_Dialog = 1,
	virtualCursorRestriction_Document = 2

; TaskDialog and OptionalTaskDialog constants:
const
	TDCBF_OK_BUTTON = 0x0001, ; selected control return value IDOK
	TDCBF_YES_BUTTON = 0x0002, ; selected control return value IDYES
	TDCBF_NO_BUTTON = 0x0004, ; selected control return value IDNO
	TDCBF_CANCEL_BUTTON = 0x0008, ; selected control return value IDCANCEL
	TDCBF_RETRY_BUTTON = 0x0010, ; selected control return value IDRETRY
	TDCBF_CLOSE_BUTTON = 0x0020, ; selected control return value IDCLOSE
	TD_WARNING_ICON = -1,
	TD_ERROR_ICON = -2,
	TD_INFORMATION_ICON = -3,
	TD_SHIELD_ICON = -4,
	ID_TASK_DIALOG_NOT_DISPLAYED = 32001

;For snapping and window visual state functionality used with windows+arrow keys:
const
	WinArrowThreshhold = 150,;milliseconds
	VerticalSnapPercentage = 95,;window height must be less than this percentage of the work area height
	HorizontalSnapPercentage = 60;window width must be less than this percentage of the work area width

; FSCompanionStatus codes must be kept in sync with duplicated values in FSCompanion.h
const
	FSCompanionStatus_Ok = 0,
	FSCompanionStatus_FailedToLaunch = 1,
	FSCompanionStatus_Restricted = 2,
	FSCompanionStatus_NotUserDesktop = 3,
	FSCompanionStatus_NotConnected = 4

; AILabelResult codes must be kept in sync with duplicated values in IImageRecognitionManager.h
const
	AILabelResult_Success = 0,
	AILabelResult_Error = 1

; Control IDs for Label Manager Dialog
const
	ID_EDIT_CUSTOM_LABEL_BUTTON = 60052,
	ID_DELETE_CUSTOM_LABEL_BUTTON = 60053

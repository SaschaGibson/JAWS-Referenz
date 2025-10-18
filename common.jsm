; Copyright 1995-2024 Freedom Scientific, Inc.

include"UO.jsm"; For User Options, the AdjustJAWSOptions and related dialogs / callback functions
include"vcore.jsm"; Legacy, VerbosityCore.jss, AdjustJAWSVerbosity.


const
cscBrailleViewNoSplit="No Split:The full display is used for the current line. This is the default when no other Line Mode view is in effect.|",
cscBrailleViewWrapped="Wrapped Mode:Text from the current line will be wrapped to the 2nd line of the display. This is the default when no other Line Mode view is in effect.|",
cscBrailleViewCropped="Cropped Mode:The display shows as many lines of text as there are supported Braille lines, vertically aligned at certain delimiters such as tabs. This is ideal for viewing numerical or tabular data. Panning is synchronized. Select the vertical alignment type and delimiter from Quick Settings, under the Braille/Split and Multiline/Vertical Alignment Character option.|",
; The format of the next few constants is:
; list item name, a colon, the description, and a vertical bar to terminate the description.
; If no description is needed then list item name and vertical bar is ok also.
;These are concatenated to form the SetBrailleView dialog list.
cscBrailleSplitModeListBuf="Buffered Text:Focused control + buffered text from the current document.|",
cscBrailleSplitModeListAnn="Annotations:Focused line + text annotations such as footnotes, endnotes and comments.|",
cscBrailleSplitModeListAtt="Attribute Indicators:Focused line + attribute indicators, e.g. b for bold, i for italic, u for underline, s for strikeout, h for highlight etc.|",
cscBrailleSplitModeListSpc="Speech History:Focused control + what is sent to the speech synthehsizer.|",
cscBrailleSplitModeListTrn="Translation Split:E.g. Contracted Braille in region 1 and uncontracted Braille in region 2.|",
cscBrailleSplitModeListJCr="JAWS Cursor:Focused control + Line at JAWS Cursor.|",
cscBrailleSplitModeListWin="Window Text:Focused control + text from another live window.",
; end of strings for SetBrailleView list.
cscSelectBrailleViewDLGTitle="Select Braille View",
cscSetBrlViewButtons="&Default|&Swap split|&Options...",
cscDefaultJBS="Default", ; Must match actual default.jbs name without extension.
cscBrlProfileListTitle="Select A Braille Profile",
;Note the below two strings must be kept in sync.
;I've used period for the delimiter since it isn't used as an alignment delimiter.
cscVerticalAlignmentListDelimiter=".",
cscVerticalAlignmentCharNames="Tab.Comma.Vertical Bar.Semicolon",
cscVerticalAlignmentChars="0x09.,.|.;",
; For Split Options dialogs
cscSplitBufferedOptionsDlgTitle="Buffer Unit",
cscSplitBufferedOptionsDlgList="Paragraph|Document (up to 64KB)|Selected Text|Clipboard Text|",
;%1 is on or off
cscSplitBufferedOptionsRebuffer="Refresh buffered document on Enter %1|",
cscSplitTranslationOptionsDlgTitle="Split Translation Region 2",
;Ordered list of BX dot patterns and list key names:
;note that cscBxKeyDotPatternList is the dot patterns representing qwerty keys
;when building the key name of a modified key,
;and that cscBXKeyNameList contains the names to use in the key name string,
;not script mapping key names.
;it is imparitive that:
;1. cscBxKeyDotPatternList is an ordered list,
;2. that items in cscBXKeyNameList parallel items in cscBxKeyDotPatternList,
;3. and that cicBXKeyNames be the number of items in the list.
;Failure to get this exactly correct will cause PAC Mate BX not to work correctly
;when simulating keys of a qwerty keyboard during PAC Mate remote.
	cicBXKeyNames = 43,
	cscBxKeyDotPatternList = "123456|123456 Chord|124567|12567|2|23|23456|235|2356|236|2467|25|256|26|3|34|35|356|36|4|45 Chord|46 Chord|46|56|6|7|8|DownArrow|DownArrow+Dot2|F1|F3|F6|F7|F7 Chord|F8|k Chord|LeftArrow|LeftArrow+Dot3|RightArrow|RightArrow+Dot3|Space|UpArrow|UpArrow+Dot2",
	cscBXKeyNameList = "Equals|Delete|]|Backslash|1|2|)|6|7|8|[|3|4|5|Apostrophe|/|9|0|-|`|Tab|End|.|Semicolon|,|Backspace|Enter|DownArrow|PageDown|Escape|NumPadStar|NumPadMinus|NumPadSlash|Capslock|NumPadPlus|Home|LeftArrow|Home|RightArrow|End|Space|UpArrow|PageUp",
	cscBXKeyListSeparator = "|"


const
;keys to start sub layers, must match the key assignments used in default.jkm,
;see sublayers of Insert+Space:
	KeyLayer_Echo = "e",
	KeyLayer_Inspect = "i",  ;only valid for browser scripts
	KeyLayer_FaceInView = "f",
	KeyLayer_FaceInView_Cameras = "c",
	KeyLayer_OCR = "o",
	KeyLayer_Skype = "q",
	KeyLayer_GoogleDocs = "g",
	KeyLayer_Table = "t",
	KeyLayer_Picture = "p",
	KeyLayer_SkypeDesktop = "Y",
	KeyLayer_Viewer = "b",
	KeyLayer_Volume = "v",
	KeyLayer_Volume_JAWS = "j",
	KeyLayer_Volume_System = "s",
	KeyLayer_Volume_Balance = "b",
	KeyLayer_Volume_SoundCards = "c",
;function names for unknown function:
	cfn_EstablishQuickNavState="establishquicknavstate",
;Legacy support for old AdjustJAWSVerbosityDialog.
;Source for this: VerbosityCore.jss,
;Same constents as previous versions of JAWS.

;Braille display layout names, must match section names in default.jkm without the "Key" part of the name:
	csPMDisplay20 = "PMDisplay20",
	csPMDisplay40 = "PMDisplay40",
	csFocus40 = "Focus40",
	csFocus80 = "Focus80",
	csFocusXT = "FocusXT",
;csFSLookupModule is not translatable: defined name of Freedom Scientific's web services dll.
	csFSLookupModule = "LiveResourceLookup",
;csfsWeatherRule is the same as the "FriendlyName" key for the LRL_Weatherunderground.rul rule file.  If this was localized, you must localize the constant here as well.
	csfsWeatherRule = "Weather",
;Weather widget controls:
	cwn_ZIPCODE_INPUT_PROMPT = "airport code; city, state (US); city, country (intl); or US ZIP code",
	cwn_ZIPCODE_INPUT_TITLE = "Weather widget needs location info",
	cwn_ZIPCODE_UPDATE_LOCATION_TITLE = "Update location info",
;for cwn_ZIPCODE_UPDATE_LOCATION_PROMPT, %1= the zip code to use.
	cwn_ZIPCODE_UPDATE_LOCATION_PROMPT = "Would you like to save %1 as your default location for future use?",
	cwnClearWeatherWidgetDlgTitle = "Weather Widget info cleared",
	cwnClearWeatherWidgetDlgStatic = "Would you like to enter new location info now?",
;For QuickSettings dialog, the first part of the dialog's name:
	cwnQuickSettings = "QuickSettings",
; For cwnBrlClockStringToRemove, get the object name from the system clock on the system tack tray.
; Restart your computer, press Windows+B to go to System Tray.
; Left arrow to the clock, Script Utility Mode -> Control+F9 to copy the name.
;String to include is any part of the text you don't want on the Braille display, when showing the time.
;This is for the Value component of the Braille structured line.
; For small displays, having text like "System Clock, " is too much real estate.
	cwnBrlClockStringToRemove = "System Clock, ",
; for cwnEmptyFolderInDialog,	open Notepad,
; bring up the Open dialog box, shift tab twice to the list of items,
; select an empty folder and press Enter on it:
; Script Utility Row | Object name.
; Once this is properly localized, you will no longer see the scroll bar named window because JAWS will properly refresh the MSAA.
; Hence you will not see this in English, but only in your own language before the string is localized.
	cwnEmptyFolderInDialog = "Horizontal Scroll Bar",
; for cwnEmptyFolderInDialogBrl:
; first localize message cwnEmptyFolderInDialog, then compile the scripts and restart JAWS.
; The refresh will subsequently work, and now you can perform the following steps to get the Object Name for this Braille message.
; bring up the Open dialog box, shift tab twice to the list of items,
; select an empty folder and press Enter on it:
; Script Utility Row | Object name.
	cwnEmptyFolderInDialogBrl = "Items View",
;running application names:
	sApp_shlwapi = "shlwapi.dll", ;Windows+D or alt+tab to Windows 7 desktop
;FS application names:
	cscAppJFWExecutable = "JFW.EXE", ;the real app name
	cscAppJFWFriendly = "JAWS",  ;what we tell the user for the app name
	cscAppMagicExecutable = "MAGIC.EXE", ;the real app name
	cscAppMagicFriendly = "Magic",  ;what we tell the user for the app name
	cscMAGUtilExecutable = "MAGUtil.exe",
;application names for determining window owner:
	cscOwnerApp_MSHTML = "mshtml.dll",
	cscOwnerApp_AcroRd32 = "AcroRd32.dll",
	cscOwnerApp_Acrobat = "acrobat.dll",
	cscOwnerApp_WerFault = "WerFault.exe",
	cscOwnerApp_Teams = "Teams.exe",
;configuration names for SwitchToConfiguration:
	config_IE = "internet explorer",
;CscButtons of applications:
	cscButton_Minimize = "Minimize",  ;title bar Minimize button name
	cscButton_Close = "Close", ;title bar Close button name
; for Date and Time tool tip, it's the text from the tool tip on the clock at the bottom of the screen, right corner.
	cscDateTimeToolTip = "Date and Time",
; FHP messages
	fhpmsg01 = "PC mode",
	fhpmsg02 = "Navigation mode",
	fhpmsg03 = "Combined mode",
	fhpmsg04 = "Speech mode",
	fhpmsg05 = "Braille mode",
	fhpmsg06 = "Switch has no function",
	fhpmsg07 = "Dialog box",
	fhpmsg08 = "Current attribute",
	fhpmsg09 = "see below for current settings",
	fhpmsg10 = "Attribute display",
	fhpmsg11 = "BRAILLEX EL",
	fhpmsg12 = "Grade Two Translation",
	fhpmsg13 = "Translate Word Under Cursor",
	fhpmsg14 = "Mark with dots 7 and 8",
	fhpmsg15 = "Text display in Braille",
	fhpmsg16 = "Display In",
	fhpmsg17 = "Easy Access Bar assignment",
	fhpmsg18 = "modified",
	fhpmsg19 = "the active cursor will not move the braille display",
 	fhpmsg20 = "The active cursor will move the braille display",
 	fhpmsg21 = "Colors",
 	fhpmsg22 = "Script defined marking",
 	fhpmsg23 = "Flash messages",
 	fhpmsg24 = "Talking navigation mode",
 	fhpmsg25 = "Expert mode",
 	fhpmsg27 = "not available",
 	fhpmsg28 = "not possible in structured mode",
 	fhpmsg29 = "active",
 	fhpmsg30 = "Extended working modes",
	BraillemanagerItem = "|BDAS Configuration Manager",

;text strings to match single bit control attributes found in HJConst.jsh:
	csList_SingleBitControlAttributes = "checked|unchecked|grayed|disabled|submenu|pressed|opened|closed|selected|single line|multi line|expanded|collapsed|has children|visited|indeterminate",

;graphic messages:
	cMsgSelectGraphic="Select Graphic To Click",
;Fonts and colors used by the virtual buffer/user buffer
	cFont_Times = "Times New Roman",
	cFont_Aerial="Arial",
	cColor_Black = "000000000",
	cColor_White = "255255255",
	cColor_Blue = "000000255",
;Function names to be displayed in the user buffer
	cFuncHotKey = "script HotKeyHelp ()",
	cFuncWinHotKey = "script WindowKeysHelp ()",
	cFuncLaunchFSCompanion = "script LaunchFSCompanion ()",
	cFuncFrame = "PCCursorFrameMoveHelper (%1)",
	KeyLabelSeparator = "|",
;Schemes dialog for SelectAScheme
	cDlgSelectASchemeTitle="Select a Scheme",
	cSchemeMask="*.smf",
;for toolbar button lists:
	cscListSeparator = "|",
; for the Select a Link dialog
	SelectALinkDialogName = "Links List",
; for the Select a Heading dialog
	SelectAHeadingDialogName = "Headings List",
; Window Classes
	cwcTextViewer = "TextViewer",
	cwc_WorkerW = "WorkerW", ;top level for shlwapi.dll
	cwc_UIRibbonCommandBar = "UIRibbonCommandBar",
	cwc_SysMonthCal32 = "SysMonthCal32",
	cwc_Word_Document = "_WwG",
	cwc_Word_Document2 = "_WwN",
	cwc_WordPerfect_Document = "WPDocClient",
	cwc_SysLink="SysLink",
	cWc_Sidebar = "SideBar_AppBarWindow",
	cwcSidebarChild = "SideBar_AppBarBullet",
	cwcSidebarGadgetMain = "BasicWindow",
	cwc_ComboBox = "ComboBox",
	cwc_ComboBoxEx32="ComboBoxEx32",
	cwc_MAGICUI = "MAGICUI",
	cWc_Winforms = "WindowsForms10",
	cwc_MSTaskListWClass = "MSTaskListWClass",
	cwc_DirectUIhWND="DirectUIHwnd",
	cwc_NetUIHwnd = "NetUIHwnd",
	CWC_DATETIME_PICKER = "SysDateTimePick32",
	cwc_SysTreeView32="SysTreeView32",
	cwc_SysHeader32="SysHeader32",
	cwc_StatusBar32="MSCtls_Statusbar32",
	cwc_dlg32771="#32771", ; task switch window classs
	cwc_Edit = "Edit",
	cwc_ListBox="ListBox",
	cwcExtendedSelectListBox = "extended select list box",
	cwc_RichEdit="RICHEDIT",
	cwc_RichEdit20="RICHEDIT20",
	cwc_RichEdit20A = "RichEdit20A",
	cwc_RichEdit20W="RichEdit20W",
	cwc_RichEdit20WPT="RichEdit20WPT",
	cwc_RichEdit50W="RICHEDIT50W",
	cwc_Richedit60W = "RICHEDIT60W",
	cwc_Listview20wndclass = "Listview20wndclass" ,
;For CustomizeListview Feature
	wn_CustomizeListViewHeaders = "Customize Headers",
; for console window class:
	cwc_ConsoleWindow="ConsoleWindowClass",
; For Windows Terminal (Windows 11)
cwcWindows11Terminal="Windows.UI.Input.InputSite.WindowClass",
;For SDM  dialog
	cWcSdmDlg="bosa_sdm_Microsoft",
	cwc_AutoSuggestDropdown = "Auto-Suggest Dropdown",
	cWcHtmlDlg = "Internet Explorer_TridentDlgFrame",
	cWcHelpParent = "HH Parent",
	cWcShellObject="Shell DocObject View",
	cwc_ShellEmbedding="Shell Embedding",
	cWcNewStartMenu = "ToolbarWindow32",
	cWc_Toolbar = "ToolbarWindow32",
	cWc_dlg32770="#32770",
	cwcMsoCmd = "MsoCommandBar",
	cwcIEServer = "Internet Explorer_Server",
	cwc_IE6DropDownComboBox = "Internet Explorer_TridentCmboBx",
	cwcFireFoxBrowserClass="MozillaWindowClass",
	cwcFireFox4BrowserClass="MozillaContentWindowClass",
	cwcChromeBrowserClass="Chrome_RenderWidgetHostHWND",
; Start menu MSAA object name
	objn_StartMenu = "Start menu",
; Windows 7 explorer pane in dialogs such as Open and Save As:
	objn_ExplorerPane = "Explorer Pane",
;Windows 7 ribbon object names:
	objn_RibbonTabs= "Ribbon tabs",
	objn_LowerRibbon = "Lower Ribbon",
; for Adobe Acrobat
	cwcAdobeDocClass="AVL_AVView",
	wnAdobeDocName="AVPageView",
; for Foxit PhantomPDF
    cwcFoxitDocClass="FoxitDocWnd",
;For the JAWS class
	cwcJAWS = "JFWUI2",
	cwcTTY = "TTY",
	cwcTTYGrab = "TTYGrab",
	;For the Messenger Alert class
	cWcMessengerAlert="MSBLPopupMsgWClass",
	cWcMessengerAlert2="HiddenWindowClass",
	cwcShellTray = "Shell_TrayWnd",
	cwcClock = "TrayClockWClass",
	cwcSysTrayParent = "TTrayIconManager.UnicodeClass",
	cwcMSTask = "MSTaskSwWClass",
	cwcRebarWnd = "ReBarWindow32",
	cwcSysTabCtrl32 = "SysTabControl32",
	cwc290 = "Button",
	cwc_button="Button",
	cwc291 = "static text",
	cwcProgman = "Progman",
	cWcListView="SysListView32",
	cwcListViewGeneric = "listview",
	cwcATLListView = "ATL:SysListView32",
	cwcTelnetW = "TelnetWClass",
	cwcConsole = "ConsoleWindowClass",
	cwcXPStartMenuParentClassSubstring="Desktop",

;keystrokes
;The following two key names are specific to the Windows Sidebar.
;Press left windows + space, or right windows + space in Windows Vista,
;to produce the Sidebar if active.
	cksAltPlusHotKeyPrefixWithSpaces = "alt + ", ;to be trimmed from the hotkey when in menus
	cksAltPlusHotKeyPrefix = "alt+", ;to be trimmed from the hotkey when in menus
	cksAlt = "Alt",
	cksAltDownArrow = "alt+downarrow",
	cksAltTab = "alt+tab",
	cksAltUpArrow = "alt+uparrow",
	cksCtrlRightArrow = "Control+RightArrow",
	cksCtrlLeftArrow = "Control+LeftArrow",
	cksShiftControlRightArrow = "Shift+Control+RightArrow", ;Modifyers must not be abbreviated and must match the order.
	cksShiftControlLeftArrow = "Shift+Control+LeftArrow", ;Modifyers must not be abbreviated and must match the order.
	cksBackspace = "backspace",
	cksDeleteWord = "Control+delete",
	cksControlBackSpace="Control+Backspace",
	cksCapsLock = "CAPSLOCK",
	cksControl = "Control",
	cksSelectAll = "Control+A",
	cksSelectCurrentItem = "Control+Space",
	cksSelectNextCharacter = "Shift+RightArrow",
	cksSelectPriorCharacter = "Shift+LeftArrow",
	cksSelectNextWord = "Control+Shift+RightArrow",
	cksSelectPriorWord = "Control+Shift+LeftArrow",
	cksSelectNextLine = "Shift+DownArrow",
	cksSelectPriorLine = "Shift+UpArrow",
	cksSelectNextParagraph = "Control+Shift+DownArrow",
	cksSelectPriorParagraph = "Control+Shift+UpArrow",
	cksSelectNextScreen = "Shift+PageDown",
	cksSelectPriorScreen = "Shift+PageUp",
	cksSelectToStartOfLine = "Shift+Home",
	cksSelectToEndOfLine = "Shift+End",
	cksSelectToTop = "Control+Shift+Home",
	cksSelectToBottom = "Control+Shift+End",
	cksControlBackslash = "control+backslash", ;UnselectAllButCurrent
	cksCopy= "Control+C",
	cksControlDownArrow = "control+downarrow",
	cksControlPageDown = "CTRL+PageDown",
	cksControlPageUp = "CTRL+PageUp",
	cksControlEnd = "Control+End",
	cksFind = "Control+f",
	cksControlF4 = "control+f4", ;close document window
	cksControlHome = "control+home",
	cksControlShiftTab = "control+shift+tab", ;prev document window
	cksControlSlash = "control+slash", ;select all items
	cksControlSpace = "Control+Space",
	cksControlTab = "control+tab", ;next document window
	cksControlUpArrow = "control+uparrow",
	cksPaste = "Control+v",
	cksCut = "Control+x",
	cksUndo = "Control+Z",
	cksDelete = "delete",
	cksShiftDelete = "shift+delete",
	cksDownArrow = "downarrow",
	cksEnd = "end",
	cksEnter = "Enter",
	cksEsc = "esc",
	cksEscape = "Escape",
	cksF2 = "F2",
	cksF6 = "F6",
	cksF8 = "F8",
	cksHome = "home",
	cksLeftArrow = "LeftArrow",
	cksNumLock = "NUMLOCK",
	cksPageDown = "PageDown",
	cksPageUp = "PageUp",
	cksRightArrow = "RightArrow",
	cksScrollLock = "SCROLLLOCK",
	cksShift = "Shift",
	cksShiftF8="Shift+F8",
	cksShiftF10 = "Shift+F10",
	cksContextMenu = "Shift+F10", ;in case context menu key varies with localization
	cksShiftTab = "shift+tab",
	cksSpace = "Space",
	cksShiftSpace = "Shift+Space",
	cksTab = "tab",
	cksUpArrow = "UpArrow",
	cksSemicolon = "semicolon",
	cksCloseApp = "Alt+F4",
;braille key names:
	cksBrlSpace = "Braille Space",
	; keystrokes for FSReader
	cksFSReaderFastForward = "control+period",
	cksFSReaderRewind = "control+comma",
	cksFSReaderPlay = "control+p",
; keystrokes for responding to Teams calls
	cksTeamsAcceptWithAudio = "Shift+Control+S",
	cksTeamsAcceptWithVideo = "Shift+Control+A",
	cksTeamsDecline = "Shift+Control+D",
;Window names for comparisons
;For UAC "fake" details button:
cwnUAC_Details = "Details",
;For Braille in Start Menu Search Results, Windows Vista:
cwnBrlResultsList = "Search Results",
;For JAWS Startup Wizard:
cWnJAWSStartup = "JAWS Startup Wizard",
;for ZoomText:
	cwn_ZoomText = "ZoomText",  ;Beginning text of the Window name for the ZoomText installer
	cwn_ZoomTextKeyboard = "ZoomText Keyboard",  ;Beginning text of the Window name for the ZoomText Keyboard installer
;for Windows 7 Folder Options:
	cwn_Windows7_FolderOptions = "Folder Options",
	cwn_ShellFolderView = "Shell Folder View",;parent of Items List View in File Explorer and Open/Save dialogs
;For Task Scheduler:
cwn2 = "Invalid Window Handle",
cwn4 = "Desktop",
cwn10 = "JAWS",
cwn11 = "Choose An Option",
cwn12 = "Select a System Tray Icon",
cwn13 = "Run JAWS Manager",
cwn14 = "Window List",
cwn15 = "Select An Onscreen Frame",
cWn16 = "Heading List",
cWn17 = "Customize Listview Headers",
cWn18 = "Select Voice Alias",
cWn19 = "Skim Reading",
cWn20 = "Add Rules",
cWn21= "JAWS Find",
;for the JAWS find dialog:
cwn_JAWS_Find = "JAWS Find",
;the Links List dialog
	cwn_LinksList = "Links List",
;for cwn_QueriesList, cwn_Query_List_Debug_title, cwn_Query_Input_Debug__Title, cwn_Query_Input_Debug__Title
;JAWS-Script generated  Dialog.
;Research It list, Insert F2 | Research It item.
	cwn_QueriesList = "Research It",
;name of dialog produced by pressing Research It Options ... button
	cwn_ResearchIt_Options = "Research It Options",
	;cwn_Query_List_Debug_title - Script Utility | Windows+Insert+D - this is a debug console dialog.
	cwn_Query_List_Debug_title = "Select rule set to debug",
	;For Script-based debugger tquery edit.
	cwn_Query_Input_Debug__Title = "Apply Search term to debug",
	cwn_Query_Input_Debug_Prompt = "Enter search term",
;JAWS-Script generated  Dialog.
;JAWS 11 Update1 and later: this is one dialog, one name now:
	cwn_ResearchIt_Input_dlg = "Research It",
;PlaceMarker list dialog window names:
	cwn_PlaceMarker_List_dlg = "PlaceMarker List",
	cwn_Add_PlaceMarker_dlg = "Add PlaceMarker",
	cwn_Change_PlaceMarker_dlg = "Change PlaceMarker",
	cwn_PlaceMarker_RemoveAll_Warning_dlg = "PlaceMarker RemoveAll Warning",
;various Flexible Web dialog real names:
	cwn_FlexibleWeb_dlg = "Flexible Web",
	cwn_ChooseAnAction_dlg = "Choose an Action",
	cwn_ChooseAnElement_dlg = "Choose an element",
	cwn_ChooseACustomization_dlg = "Choose a customization",
	cwn_SaveTemporaryCustomizations_dlg = "Save Temporary Customizations",
	cwn_SaveTemporaryCustomizationsFinish_dlg = "Save Temporary Customizations Finish",
	cwn_ViewOrChangeWhereRulesAreApplied_dlg = "View or Change Where Rules are Applied",
; Customize Listview dialog page names
cWnSpeech = "Speech",
cWnBraille = "Braille",
cwnCustomizeListViewDefault = "Customize Headers",
;Default copied from Outlook.jsm:
cwnCustomizeListViewOutlook = "Customize Outlook Message List",
;The following two are group box names within the Headings Dialog
cWnGroup1 = "Sort Headings",
cWnGroup2 = "Display",
cWnStartMenu = "Start Menu",

;Strings used for comparison:
cScPeriod = ".",
cScLess = "<",
cScGreater = ">",
cScJcf="jcf",
cScJbs = "jbs",
cScDoubleBackSlash = "\\",
cscNotSelected = "Not Selected",
cscUnchecked="unchecked",
cscChecked="checked",
;cursor names for string comparison
	cscNormal = "normal",
	cscEditCursor = "edit",
	cscWAIT = "WAIT",
	cscCROSS = "CROSS",
	;the constant cscAppStart represents the flashlight or starting instance cursor
	;for example, when an app like Skype or Outlook is loading.
	;To localize this / see what string is used by your language of the operating system,
	;you may wish to set your Braille display to Speech History, or add the code:
	;CopyToClipboard (getClipboardText()+getCursorShape())
	;so you will be able to paste and see all the changes,
	;being that it will go from Arrow to App Start to Hour Glass to the cursor of the app.
	cscAppStart = "App start",
;null and silent strings:
	cscNull = "",
	cScSpace = " ",
	cmsgSilent = " ",
;string compares for Spellcheck, Find and Replace dialogs, used by IsReadWordInContextValid function:
	cscSpell = "Spell",
	cscFind = "Find",
	cscReplace = "Replace",
; String compares used in Reminder Dialog script
	cscSnooze="Snooze",
;The following string compare is in the DoesFHPExist  function of bdas.hss
csc1 = "BDAS.Display",
cScColon=":"
;These items are messages but must be defined using the const syntax because
; they require that \007 and \n be converted to special characters,
; and the message syntax inserts everything literally into the string
;with no character conversion.  So a message with \n would insert a
; backslash followed by the letter n, not an ASCII 10.
const
; msgDebugLevelNames is used by the GetDebugLevelName function in say.jss which
; converts a numeric debug level to a spoken name.
; The value returned by the GetDebugLevelName function is spoken when UtilityChangeDebugLevel is used.
	msgDebugLevelNames = "SEVERE\007ERROR\007WARNING\007INFO\007ENTRY\007PARAM\007DEBUG\007HIDEBUG",
	cScBufferNewLine = "\n",; Do not use to speak, just to post new line to buffer.
	cmsgCustomHighlight1="Set foreground and background\007Set foreground only\007Set background only",
;separators for table cells when table zoom is set to row or column:
	cmsgTableCellTextSeparator = " | ",
	cmsgTablePostFocusCellTextSeparator = "| ", ;immediately after the focus cell the leading whitespace is not needed
; for the Run JAWS Manager dialog
	ConfigManItem = "Configuration Manager",
	SettingsCenterItem = "|Settings Center",
	WindowClassItem = "|Window Class Reassign",
	DictionManItem = "|Dictionary Manager",
	FrameManItem = "|Frame Viewer",
	CreatePromptItem="|Prompt Create",
	ModifyPromptItem="|Prompt Modify",
	CreateCustomLabelItem="|Custom Label",
	DeleteCustomLabelItem="|Custom Label Delete",
	DeleteAllCustomLabelsItem="|Custom Label Delete All",
	LabelManagerItem="|Label Manager",
	KeyManItem = "|Keyboard Manager",
	ScriptManItem = "|Script Manager",
	GraphicsLabelerItem = "|Graphics Labeler",
	CustomHighlightAssignItem = "|Custom Highlight Assign",
	MessageCenterItem = "|Message Center",
	BrailleAddColorsItem="|Mark Colors in Braille",
	CustomizeListViewItem="|Customize ListView",
	SkimReadingToolItem="|Skim Reading Tool",
	QuickNavigationKeysItem = "|Navigation Quick Keys",
	AdjustBrailleOptionsItem = "|Adjust Braille Options",
	;AdjustJAWSOptionsItem = "|Adjust JAWS Options",
	AdjustJAWSOptionsItem = "|Quick Settings",
	CustomSummaryDialog="|Custom Summary Labels",
	ViewCustomSummaryItem="|View Custom Summary",
	ResearchItItem = "|Research It",
	JAWSSearchItem = "|Commands Search",
	FlexibleWebItem = "|Flexible Web",
	NotificationHistoryItem = "|Notification History",
	RunManagerDialogTitle = "Run JAWS Manager",
; for the Adjust options dialogs:
	AdjustJAWSOptionsDialogName = "Adjust JAWS Options",
	cStrBrailleDlgName = "Adjust Braille Options",
	cstrBrailleMarkingDlgName="Select Braille Marking Options",
;For the Virtual HTML Features dialog
cStrVirtHTMLDlgName = "Virtual HTML Features",
cStrVirtHTMLDlgLst1 = "PlaceMarkers|Form Fields List|Headings List|Links List|Buttons List|Edit Boxes List|Lists List|Check Boxes List|Tables List|Radio Buttons List,",
cStrVirtHTMLDlgLst2 = "|Block Quotes List|List Items List|Divisions List|Controls (Selectable ARIA, combo, lists and trees) List|Frames List|Paragraphs List|Anchors List|Graphics List|Articles List|Regions List|Tabs List",
cStrVirtHTMLDlgLst3 = "|Smart Glance Highlight List",
;The following 007 delimited list is for the CreateFrameOrPromptForRegion
;function
cCreateFrameOrPromptMenu="Frame Create\007Prompt Create",
cCreateFrameOrPromptTitle="Create Frame or Prompt",
cModifyFrameOrPromptMenu="Frame Create\007Prompt Modify",

cmsgPMUseTitle = "Title",
cmsgPMUseDomain = "Domain",
cmsgPMUsingAsFileName = "PlaceMarker file name based on %1",

cscHttps = "https",

;from GetProgressBarInfo function, 0%:
	cmsgZeroPercentProgress = "0%",

;For WNPersonalSettings, %1 = The domain or base of the page, e.g. Microsoft.com:
	WNPersonalSettings = "Personalize settings for %1",

;for the Word List feature:
	WordListDlgTitle = "Word List",
	WordListCustomButtons = "&Summary",

;used for comparison in script GetConnectionStatus:
 csc_Network = "Network",  ;network status icon in system tray
 csc_Access = "Internet access",  ;network status icon in system tray
 csc_Connected = "connected",  ;network status icon in system tray

;messages for ribbon activity:
;following are the three notification messages for ribbon activity.
;note that the messages must appear in the following order:
; leaving ribbon | ribbon tabs active | lower ribbon active.
	RibbonMessages = "Leaving ribbons|Ribbon Tab list|Lower ribbon",
; For SelectALanguage dialog, this is the title
	cDlgSelectALanguageTitle="Select a Language",



;UNUSED_VARIABLES

;Weather widget controls:
	cwn_ZIPCODE_INVALID_TITLE = "That was not valid location info!",

;Password dialog,
;Using Welcome Screen in Windows XP
;Text to check does not include a space, nor does it include the actual user name:
cScPasswordDlgName = "Type your password",

;Configuration name(s) for Get Configuration, check in regards to Windows Sidebar:
	CONFIG_SIDEBAR_VISTA = "sidebar",

	SynthDialogName="Select a Synthesizer",

;Next string is just the voice profile dialog name, translate
	VoiceProfileDialogName="Select a Voice Profile",

;The following constant is used in displaying the port information in the list box
	SynthListItemExtraText=" Set to ",

;Schemes dialog for SelectAScheme

; Window Classes
	cwc_SearchControl="Search Control",
	cwc_ScrollBar="Scroll bar",
	cwc_UIRibbonWorkPane = "UIRibbonWorkPane",

;For SDM  dialog
	cWcVBCheckBox = "ThunderRT",
;Windows 7 ribbon object names:
	objn_Ribbon = "Ribbon",

;For the JAWS class
	cwc_static="static text",
	cwcBasebar = "BaseBar",
	cwcListViewGeneric2 = "UserList",;for Skype and other related apps

;keystrokes
	cksSidebarLeft="LeftWindows+Space",
	cksSidebarRight = "RightWindows+Space",

;for cksToggleSpeech, see the Customize List View dialog under insert+f2 | toggle speech button.
;Remember to access this dialog, you must be in a list view.
;Keep the letter lowercase so the code recognizes it:
	cksToggleSpeech = "alt+e",

;for PACMate Remote: BX, where keyName corresponds with tab and shift+tab
	cksPMRemoteBXShiftTab = "Braille B Chord",
	cksPMRemoteBXTab = "Braille Dot45 Chord",

	cksMouseLeftClick = "MouseLeftClick",
	cksF1 = "F1",
	cksF3 = "F3",
	cksF4 = "F4",
	cksF5 = "F5",
	cksShiftF6 = "Shift+F6",
	cksF7 = "F7",
	cksF9 = "F9",
	cksF10 = "F10",
	cksF11 = "F11",
	cksF12 = "F12",
	cksWindows = "Windows",

;For Task Scheduler:
cWnScheduleTasks = "Scheduled Task Wizard",
cwn7 = "Save",
cwn8 = "Save As",
cwn9 = "Print Setup",

cwn_ResearchIt_Input_txt = "Word or Phrase:",
cScBatteryIcon = "remain",

cwn_OCR_CameraRecognition_DLG = "Camera and Scanner Recognition", ;the window name of the OCR Camera Recognition dialog
cwn_OCR_CameraRecognition_AdvancedSettings_DLG = "Advanced Camera Settings", ; Window name of the advanced settings dialog for camera recognition
cwn_OCR_CameraRecognition_AdvancedScannerSettings_DLG = "Advanced Scanner Settings", ; Window name of the advanced scanner settings dialog for scanner recognition


;For cwn_BRL_EMAIL
;Condition: any edit field whose name is E-mail
;This is for Contracted Braille input.
cwn_BRL_EMAIL = "E-mail",
cwn_BRL_USERNAME = "UserName",
; Partial name used to find Microsoft Teams windows
	cwnMicrosoftTeams = "Microsoft Teams",
;Microsoft Teams button names for responding to calls
	cwnAcceptWithAudio = "Accept with audio",
	cwnAcceptWithVideo = "Accept with video",
	cwnDeclineCall = "Decline call",
;Button names for items in the Meeting controls tool bar of Microsoft Teams
	cwnUnmute = "Unmute",;name of button when microphone is muted
	cwnTurnCameraOn = "Turn camera on",;name of button when camera is off
	cwnStopSharing = "Stop sharing",;name of button when sharing screen
;Partial name of button for leaving a Teams call/meeting:
	cwnLeave = "Leave",
;Microsoft PhoneLink names
	cwnPhoneLink = "Phone Link",
	cwnAccept = "Accept",
	cwnDecline = "Decline",
	cwnEndCall = "End call",
;A | delimited list of app names used in the ManageCall script.
	cscManageCall_Apps="Teams|Phone Link|Skype",
;A | delimited list of button names used in the ManageCall script.
;The "&" character is placed before the letter that will be used for the hotkey for the respective button.
	cscManageCall_Buttons = "&Accept with Audio|Accept with &Video|&Decline|&Hang up|Make &Primary",
; String compares used in ManageCall script
	cscManageCall_Teams = "Teams",
	cscManageCall_PhoneLink = "Phone Link",
	cscManageCall_Skype = "Skype",

; String compares used in Reminder Dialog script
	cscReminder="Reminder",
	cscOverdue="Overdue",

;The following string compare is in the DoesFHPExist  function of bdas.hss
csc2 = "JFW Braille Viewer",
csc3 = "Startup",
csc4 = "Enabled",

;scheduled functions
;This string compare is in the file bdas.hss and in the function FHP_BDAS_Start
sf1 = "BDASTimer",
	sf2 = "BDASNewApp",
	csfSidebar = "SidebarMonitor",

; html tag constants used in virtual.jss
	cscListItem = "LI",

;For Script Manager Select dialog box:
cStrScriptManDlgName = "Select Script Development Environment",
cStrScriptManList="JAWS\007MAGic",

; The following constants are used for the HTML Options Dialog
HTMLOptionsDialogName = "Adjust HTML Options",
GraphicsToggleItem = "|HTMLIncludeGraphicsToggle:HTML Graphics Verbosity",
LinksToggleItem = "|HTMLIncludeLinksToggle:Graphical Links Verbosity",
ImageMapToggleItem = "|HTMLIncludeImageMapLinksToggle:Image Map Links Verbosity",
LinkTypeToggleItem = "|HTMLIdentifyLinkTypeToggle:Say Link Type",
SamePageLinkToggleItem = "|HTMLIdentifySamePageLinksToggle:Identify Same Page Links",
IncrementMaxLineLengthItem = "|HTMLIncrementMaxLineLength:Increment Maximum Line Length",
DecrementMaxLineLengthItem = "|HTMLDecrementMaxLineLength:Decrement Maximum Line Length",
IncrementMaxBlockLengthItem = "|HTMLIncrementMaxBlockLength:Increment Maximum Text Block Length",
DecrementMaxBlockLengthItem = "|HTMLDecrementMaxBlockLength:Decrement Maximum Text Block Length",
FrameIndicationToggleItem = "|HTMLFrameIndicationToggle:New Frame Indication",
ScreenFollowsVCursorToggleItem = "|HTMLScreenFollowsVCursorToggle:Screen Track Virtual Cursor",
SkipPastRepeatedTextToggleItem = "|HTMLSkipPastRepeatedTextToggle:Skip Past Repeated Text On New Pages",
TextLinksVerbosityItem = "|HTMLTextLinkVerbosityToggle:Text Links Verbosity",
IncrementLinesPerPageItem = "|HTMLIncrementLinesPerPageItem:Increment Lines Per Page",
DecrementLinesPerPageItem = "|HTMLDecrementLinesPerPageItem:Decrement Lines Per Page",
IndicateTablesItem = "|HTMLIndicateTablesToggle:Indicate Tables",
IndicateHeadingsItem = "|HTMLIndicateHeadingsToggle:Indicate Headings",

; Label Manager Dialog
cwn_LabelManager = "Label Manager"

;END_OF_UNUSED_VARIABLES

Messages
@cmsgUndefined
Undefined
@@
; 0 items string for Braille types like listbox:
@cmsgBrlPositionZeroItems
0 items
@@
;shlwapi is the desktop, but it has no window name,
;so we use a string to announce the app name as Desktop
@cmsgAppName_shlwapi
Desktop
@@
@cmsgTableLayerStart_L
Table layer
@@
@cmsgTableLayerStart_S
Table
@@
@cmsgOn
On
@@
@cmsgOff
Off
@@
;Window names
@cwn3
Invalid
@@
;For cwnFocusLossExceptionsList, the names of common dialogs are one per line.
;These should be self-explanatory: Run, Shut Down, User Account, etc.
;Add any name to this list, for a known dialog or app on whose exit Focus Loss info should not speak.
;The check is via StringContains, so the full name is not required.
@cwnFocusLossExceptionsList
Run
Desktop
Start
Shut down
Quit
End program
Log off
Log on
@@
;messages
@cMsgPromptDlg
If you assign this control to a known window class, %product% might properly speak its name.
Would you like to try assigning a known window class before specifying a prompt?
@@
@cMsgPromptDlgName
Window Information
@@
@cMsgBrlFormat_L
Line up text on display
@@
@cmsgBrlFormat_S
Line Up Text
@@
@cmsgbrlNoSelectText
All text you select must be in the same document window.
@@
@cmsgScreenFormat_L
Show text as on screen
@@
@cmsgScreenFormat_S
As on screen
@@
;for msg3, %1 represents the highlighted text of a menu
@cmsg3_L
Menu %1
@@
@cmsg4_L
Start Menu
@@
;for msg5, %1 represents the highlighted text of a context menu
@cmsg5_L
Context Menu %1
@@
@cmsg6_L
Context Menu
@@
@cmsgContextMenu1
Context Menu
@@
@cmsg7_L
Page down
@@
@cmsg8_L
Page up
@@
@cmsg9_L
PC Cursor
@@
@cmsg9_S
PC
@@
@cmsg10_L
invisible Cursor
@@
@cmsg10_S
invisible
@@
@cmsg11_L
JAWS Cursor
@@
@cmsg11_S
JAWS
@@
;cmsgJAWSScanCursor and cmsgInvisibleScanCursor messages are the names of the JAWS and Invisible scan cursors announced upon cursor activation.
@cmsgJAWSScanCursor_L
JAWS scan cursor
@@
@cmsgJAWSScanCursor_S
JAWS scan
@@
@cmsgInvisibleScanCursor_L
Invisible scan cursor
@@
@cmsgInvisibleScanCursor_S
Invisible scan
@@
;cmsgTouchCursor messages are for when the touch cursor becomes active
@cmsgTouchCursor_L
touch cursor
@@
@cmsgTouchCursor_S
touch
@@
;cmsgTouchCursorSuspended is spoken when the touch cursor is temporarily suspended,
;such as when an HJ dialog is activated.
@cmsgTouchCursorSuspended
touch cursor suspended
@@
;cmsgTouchCursorDeactivateTutorMessage is spoken on single tap of PC cursor when touch cursor is active
@cmsgTouchCursorDeactivateTutorMessage
Double tap to activate the PC cursor
@@
;cmsgRouteTouchToFocus is spoken when running RouteTouchToFocus script
@cmsgRouteTouchToFocus
Route touch to focus
@@
;AdvancedObjectNavigation messages are spoken when the advanced object navigation mode is toggled on/off
@cmsgAdvancedObjectNavigationOn_L
Advanced navigation on
@@
@cmsgAdvancedObjectNavigationOn_S
Advanced on
@@
@cmsgAdvancedObjectNavigationOff_L
Advanced navigation off
@@
@cmsgAdvancedObjectNavigationOff_S
Advanced off
@@
;
;cmsgTouchElementClickablePoint is spoken as the cursor clickable point
;when touch cursor is active and SayActiveCursor is used.
;%1 is the x coordinate, %2 is the Y.
@cmsgTouchElementClickablePoint
Clickable point %1, %2
@@
;TouchTextReview messages may be spoken when in touch navigation and the user toggles text review mode on/off
;These messages are not spoken if the text review toggle outputs a sound instead of a spoken message
@cmsgTouchTextReviewOn
Review on
@@
@cmsgTouchTextReviewOff
Review off
@@
;cmsgTouchTextReviewActive and cmsgTouchTextReviewCursorPosition
;are spoken when SayActiveCursor is used when touch cursor is active.
;Note: messages for text review are change to remove the term "text",
;hopefully reducing the confusion between "text reading mode" and "text review mode".
;Text reading mode is exclusively a gesture mode for using gestures to move through characters, words and lines of text,
;and is not applicable to keyboard touch cursor navigation, since a keyboard user may turn off the touch cursor and use the PC cursor.
;text review mode is a method used to show text from a UIA element in the virtual viewer,
;allowing a control name or value to be reviewed by characters, words and lines.
;Elements such as button names can be read by means of the virtual viewer using text review mode,
;but cannot be navigated using text reading mode because the PC cursor cannot move through the characters in the button name.
@cmsgTouchTextReviewActive
Touch navigation review active
@@
;for cmsgTouchTextReviewCursorPosition,
;%1 and %2 are the cursor row and column,
;%3 is the document percentage.
@cmsgTouchTextReviewCursorPosition
%1, %2
%3
@@
;cmsgApplicationMode messages are for when inside an application region on web pages
@cmsgApplicationMode_L
application mode
@@
;cmsgApplicationModeDeactivateTutorMessage is spoken on single tap of PC cursor when application mode is active
@cmsgApplicationModeDeactivateTutorMessage
Double tap to activate the virtual PC cursor
@@
@cmsg12_L
Beginner
@@
@cmsg13_L
Intermediate
@@
@cmsg14_L
Advanced
@@
@cmsg16_L
Highlighted
@@
@cmsg17_L
All
@@
;for msg18-21, %1 = the class name of the parent window, %2 represents the spelling of this class
@cmsg18_L
Parents class = %1, %2
@@
@cmsg18_S
Parent %1, %2
@@
@cmsg19_L
Top level window
@@
@cmsg20_L
Prior window class = %1, %2
@@
@cmsg20_S
Prior window %1, %2
@@
@cmsg21_L
next window class = %1, %2
@@
@cmsg21_S
next window %1, %2
@@
@cmsg22_L
first child window class = %1, %2
@@
@cmsg22_S
first child %1, %2
@@
@cmsg23_L
The window handle is 0. This may be an item that is minimized. Press the enter key or click the mouse button to open it.
@@
@cmsg23_S
Window handle = 0
@@
@cmsg24_L
Restriction on JAWS Cursor
@@
@cmsg24_S
Restrict JAWS Cursor
@@
@cmsg25_L
restriction off JAWS Cursor
@@
@cmsg26_L
Unloading JAWS
@@
;cmsgJAWSUnloaded will be sent to the braille display when shutting down JAWS
@cmsgJAWSUnloaded
JAWS unloaded
@@
;for msg27, %1 = the window title
@cmsg27_L
Title is
%1
@@
@cmsg27_S
%1
@@
;for msg28, %1 = the window title, %2 = the window text
;for cMsgMenubarItem_L/S, %1=app title, %2=current menuBar selection, this is used in SayWindowTitle
@cMsgMenubarItem_L
Title is
%1
menu bar
%2
@@
@cMsgMenubarItem_S
%1
menu bar
%2
@@
;for cMsgMenuItem_L/S, %1=app title, %2=current menu selection, this is used in SayWindowTitle
@cMsgMenuItem_L
title is
%1
menu
%2
@@
@cMsgMenuItem_S
%1
menu
%2
@@
;For cMsgSayWindowTitleInRibbons messages,
;%1 is the application window title
;%2 is the current ribbon tab
@cMsgSayWindowTitleInRibbons_L
Title is
%1
Ribbon
%2
@@
@cMsgSayWindowTitleInRibbons_S
%1
Ribbon
%2
@@
;for cMsgSayWindowTitleInVirtualRibbons messages,
;%1 is the application window title
;%2 is the current ribbon tab
@cMsgSayWindowTitleInVirtualRibbons_L
Title is
%1
Virtual ribbons
%2
@@
@cMsgSayWindowTitleInVirtualRibbons_S
%1
Virtual ribbons
%2
@@
@cmsg28_L
Title is
%1
%2
@@
@cmsg28_S
%1
%2
@@
;for msg29, %1 = the App Window Name, %2 = the Real Window name
@cmsg29_L
Title is
%1
%2
@@
@cmsg29_S
%1
%2
@@
;for msg30, %1 = the window title, %2 = the dialog page name
@cmsg30_L
Title is
%1
Page is
%2
@@
@cmsg30_S
%1
%2
@@
;cmsgComputerBraille is for contracted input alerts user that current control doesn't support contraced
@cmsgComputerBraille
Computer Braille
@@
@cmsg31_L
Start Button
@@
@cmsg32_L
TaskBar
@@
@cMsgSysTray_L
System Tray
@@
@cMsgSysTray_S
Tray
@@
@cMsgDesktopToolbar_L
Toolbar
@@
@cMsgDesktopToolbar_S
toolbar
@@
;for msg33, %1 = the name of the current dialog
@cmsg33_L
%1 dialog
@@
@cmsg34_L
Read window from top to bottom
@@
@cmsg36_L
top of file
@@
@cmsg36_S
top
@@
@cmsg37_L
Bottom of file
@@
@cmsg37_S
Bottom
@@
;for msg38, %1 = Font information
@cmsg38_L
Font is %1
@@
@cmsg38_S
No font
@@
;for msg39, %1 = the selection
@cmsg39_L
Selection is
%1
@@
;For cmsgGianListViewSelect, %1 = number of items selected "up to" the focused item.
@cmsgLVNumOfSelection_L
%1 items selected
@@
@cmsgLVNumOfSelection_S
%1 items
@@
@cmsg40_L
Close Document Window
@@
@cmsg40_S
Close
@@
@cmsg41_L
Open List Box
@@
@cmsg42_L
Close List Box
@@
@cmsgOpenCalendar_L
Open calendar
@@
@cmsg43_L
Enter key to pass through
@@
@cmsg43_S
Pass key through
@@
;cmsgPassThroughNextGesture is spoken when the pass through gesture is used
@cmsgPassThroughNextGesture
Pass through next gesture
@@
@cmsg44_L
Top of window
@@
@cmsg44_S
Top
@@
@cmsg45_L
Bottom of Window
@@
@cmsg45_S
Bottom
@@
;cmsgLeavingCommandBar used in Windows 8 when leaving command bar
@cmsgLeavingCommandBar
Leaving command bar
@@
@cmsg48_L
leaving menu bar
@@
@cmsg48_S
Leaving menus
@@
@cmsg50_L
Undo
@@
@cmsg51_L
cut selection to clipboard
@@
@cmsg51_S
cut
@@
@cmsg52_L
Copied selection to clipboard
@@
@cmsg52_S
Copied
@@
@cmsg53_L
Pasted from clipboard
@@
@cmsg53_S
Pasted
@@
@cmsgAppendedTextToClipboard_L
Appended selection to clipboard
@@
@cmsgAppendedTextToClipboard_S
Appended
@@
@cmsgNotInATextWindow
Not in a text window
@@
@cmsg54_L
Screen Refreshed
@@
@cmsg54_S
Refreshed
@@
;for msg55, %1 = the name of the default button
@cmsg55_L
default button is %1
@@
@cmsg56_L
Not in a dialog box
@@
@cmsg56_S
Not in a dialog
@@
@cmsg57_L
Mouse Left
@@
@cmsg57_S
Left
@@
@cmsg58_L
Mouse Right
@@
@cmsg58_S
Right
@@
@cmsg59_L
Mouse Down
@@
@cmsg59_S
Down
@@
@cmsg60_L
Mouse Up
@@
@cmsg60_S
Up
@@
@cmsg61_L
Control Mouse Click
@@
@cmsg62_L
Shift Mouse Click
@@
@cmsg63_L
alt Mouse Click
@@
@cmsg64_L
search string NOT found
@@
@cmsg64_S
NOT found
@@
@cmsg76_L
Active Graphics Mode
@@
@cmsg76_S
Active
@@
@cmsg77_L
Active Graphics Mode could not be set
@@
@cmsg78_L
Standard Graphics Mode
@@
@cmsg78_S
Standard
@@
@cmsg79_L
Standard Graphics Mode could not be set
@@
@cmsg80_L
minimize all apps
@@
@cmsg81_L
None
@@
@cmsg82_L
Characters
@@
@cmsg83_L
Words
@@
@cmsg84_L
%product% may not recognize this control.
To show %product% what type of control it is, press %KeyFor(WindowClassReassign).
To see more technical information on the control, press %KeyFor(ScreenSensitiveHelpTechnical).
@@
;for msg85, %1 = the control ID of the current window, %2 = the current window class
;%3 = the window handle
@cmsg85_L
Window Technical Information:
Control ID  %1
Class  %2
Handle  %3
@@
@cmsg86_L
this is a tool bar
@@
@cmsg87_L
This is an application status bar
@@
@cmsg88_L
This is a header bar
@@
@cmsg89_L
This is a spin box
@@
@cmsg90_L
This is a dialog box
@@
@cmsg91_L
This is a check box
@@
@cmsg92_L
This is a group box
@@
@cmsg93_L
This is a hot key or short cut key edit control
@@
@cmsg94_L
This is a horizontal slider
@@
@cmsg95_L
This is a vertical slider
@@
;For ScreenSensitiveHelp
@cmsg96
No window is active.
Press Escape and then press Windows Key+M.
@@
;For insert+t
@cmsg96_L
No window is active.
Press Windows Key+M to go to the desktop.
@@
@cmsg96_S
No window is active
@@
@cmsg97_L
Arrow
@@
@cmsg98_L
I beam
@@
@cmsg99_L
Hour Glass
@@
@cmsg100_L
cross hair
@@
;For cMsg101_L, %1 = the name of the dialog.
@cmsg101_L
Here is a list of the hot keys for the %1 dialog.
Promt  Hot Key

@@
@cmsg124_L
no hot key
@@
@cmsgUtilityHotKeys1_L
To initialize the script utility position to the window containing the active cursor, press %KeyFor(UtilityInitializeHomeRowPosition).
To hear the specified output information for the window currently referenced by the script utility, press %KeyFor(UtilitySayInfoAccess).
To adjust the output mode, press %KeyFor(")UtilitySetOutputMode).
To move to the next window, press %KeyFor(UtilityMoveToNextWindow).
To move to the prior window, press %KeyFor(UtilityMoveToPriorWindow).
To move to the child window, press %KeyFor(UtilityMoveToChild).
To move to the parent window, press %KeyFor(UtilityMoveToParent).
To move to the next attribute, press %KeyFor(UtilityNextAttribute).
To move to the prior attribute, press %KeyFor(UtilityPriorAttribute).
To move to the first attribute, press %KeyFor(UtilityFindFirstAttribute).
To move to the last attribute, press %KeyFor(UtilityFindLastAttribute).
To adjust the text attribute mode, press %KeyFor(UtilitySetFontMode).
To toggle the automatic speaking of the visible state of windows when navigating with the script utility, press %KeyFor(")UtilityToggleSpeakWindowVisibility).
To hear the visible state of the window indicated by the script utility, press %KeyFor(UtilitySpeakWindowVisibility).
To Copy the information spoken by F1 to the clipboard, press %KeyFor(UtilityCopyInfo).
To put the information spoken by the F1 keystroke into a message box, press %KeyFor(UtilityPutInfoInBox).
To change the current output mode to WindowTypeAndText, press %KeyFor(UtilityResetOutputMode).
To hear the Currently selected output mode, press %KeyFor(UtilitySayOutputMode).
To hear the specified output information for the currently active MSAA object, press %KeyFor(UtilitySayMSAAObjectInfoAccess).
To adjust the output mode for MSAA, press %KeyFor(UtilitySetMSAAObjectOutputMode).
To copy the information spoken by the F9 keystroke to the clipboard, press %KeyFor(UtilityCopyMSAAObjectInfo).
To put the information spoken by the F9 keystroke into a message box, press %KeyFor(UtilityPutMSAAObjectInfoInBox).
To hear the currently selected output mode for MSAA objects, press %KeyFor(UtilitySayMSAAObjectOutputMode).
@@
@cmsgUtilityHotKeys1_S
Initialize script utility position to current window, %KeyFor(UtilityInitializeHomeRowPosition).
Speak specified output for the current window, press %KeyFor(UtilitySayInfoAccess).
Adjust the output mode, %KeyFor(UtilitySetOutputMode).
Move to next window, %KeyFor(UtilityMoveToNextWindow).
Move to prior window, %KeyFor(UtilityMoveToPriorWindow).
Move to child window, %KeyFor(UtilityMoveToChild).
Move to parent window, %KeyFor(UtilityMoveToParent).
Move to next attribute, %KeyFor(UtilityNextAttribute).
Move to prior attribute, %KeyFor(UtilityPriorAttribute).
Move to first attribute, %KeyFor(UtilityFindFirstAttribute).
Move to last attribute, %KeyFor(UtilityFindLastAttribute).
Adjust the text attribute mode, %KeyFor(UtilitySetFontMode).
toggle automatic speaking of window visibility, %KeyFor(UtilityToggleSpeakWindowVisibility).
Say current window visibility, %KeyFor(UtilitySpeakWindowVisibility).
Copy information to clipboard, %KeyFor(UtilityCopyInfo).
info message box, %KeyFor(UtilityPutInfoInBox).
Say Current output mode, %KeyFor(UtilitySayOutputMode).
Set output mode to WindowTypeAndText, %KeyFor(UtilityResetOutputMode).
Say MSAA object information, %KeyFor(UtilitySayMSAAObjectInfoAccess).
Adjust the output mode for MSAA, %KeyFor(UtilitySetMSAAObjectOutputMode).
copy MSAA object info to clipboard, %KeyFor(UtilityCopyMSAAObjectInfo).
MSAA object info message box, %KeyFor(UtilityPutMSAAObjectInfoInBox).
Say current MSAA object output mode, %KeyFor(UtilitySayMSAAObjectOutputMode).
@@
@cmsg139_L
Bold
@@
@cmsg140_L
Italic
@@
@cmsg141_L
Underline
@@
@cmsg142_L
Highlight
@@
@cmsg143_L
Strikeout
@@
@cmsg144_L
Graphic
@@
@cmsgFont_LRM_Arabic
LRM Arabic
@@
@cmsgFont_RTL_Text
RTL Text
@@
@cmsgFont_Double_Strikeout
Double strikeout
@@
@cmsgFont_Superscript
Superscript
@@
@cmsgFont_Subscript
Subscript
@@
@cmsgFont_Shadow
Shadow
@@
@cmsgFont_Outline
Outline
@@
@cmsgFont_Extended
Extended
@@
@cmsgFont_Emboss
Emboss
@@
@cmsgFont_Engrave
Engrave
@@
@cmsgFont_Smallcaps
Smallcaps
@@
;for msg145, %1 = the name of the current script file, %2 = the app name, %3 = the spelling of the app name
@cmsg145_L
%1 settings are loaded
The application currently being used is %2
%3
@@
@cmsg145_S
%1 settings. %2, %3
@@
;RouteInvisibleScanToPC, RouteJAWSScanToPC and RouteJAWSScanToVirtualPC messages are spoken when a scan cursor is routed.
@cmsgRouteInvisibleScanToPC_L
Route invisible scan to PC
@@
@cmsgRouteInvisibleScanToPC_S
invisible scan to PC
@@
@cmsgRouteJAWSScanToPC_L
Route JAWS scan to PC
@@
@cmsgRouteJAWSScanToPC_S
JAWS scan to PC
@@
@cmsgRouteJAWSScanToVirtualPC_L
Route JAWS scan to Virtual PC
@@
@cmsgRouteJAWSScanToVirtualPC_S
JAWS scan to Virtual PC
@@
@cmsg146_L
Route invisible to PC
@@
@cmsg146_S
invisible to PC
@@
@cmsg147_L
Route JAWS to PC
@@
@cmsg147_S
JAWS to PC
@@
@cmsg148_L
Route PC to JAWS
@@
@cmsg148_S
PC to JAWS
@@
@cmsg149_L
Route PC to invisible
@@
@cmsg149_S
PC to invisible
@@
@cmsg150_L
left mouse button
@@
@cmsg150_S
left Click
@@
@cmsg151_L
right mouse button
@@
@cmsg151_S
right Click
@@
@cmsg152_L
left button locked
@@
@cmsg152_S
locked
@@
@cmsg153_L
Left button unlocked
@@
@cmsg153_S
unlocked
@@
@cmsg154_L
right button locked
@@
@cmsg154_S
locked
@@
@cmsg155_L
right button unlocked
@@
@cmsg155_S
unlocked
@@
@cmsg158_L
Braille marking off
@@
@cmsg159_L
Braille marking  highlight
@@
@cmsg159_S
Highlight
@@
@cmsg160_L
Braille marking  bold
@@
@cmsg160_S
Bold
@@
@cmsg161_L
Braille marking  underline
@@
@cmsg161_S
Underline
@@
@cmsg162_L
Braille marking  italic
@@
@cmsg162_S
Italic
@@
@cmsg163_L
Braille marking  strike out
@@
@cmsg163_S
Strike out
@@
@cmsg164_L
Braille marking all
@@
@cmsg164_S
All
@@
@cmsg165_L
Six dot braille
@@
@cmsg165_S
Six dot
@@
@cmsg166_L
Eight dot Braille
@@
@cmsg166_S
Eight dot
@@
@cmsg167_L
Keyboard Help on
@@
@cmsg168_L
Keyboard Help off
@@
@cmsg169_L
This is a command bar
@@
;cmsgSettingUpForDragAndDrop_L replaces cmsg170_L:
;for cmsgSettingUpForDragAndDrop_L, %1 = the current script key name
@cmsgSettingUpForDragAndDrop_L
To drag and drop, place the JAWS, PC or touch cursor in the drop location and press %1.
@@
@cmsg170_S
Drag object
@@
@cmsg171_L
The object to be dragged was not found. This may be because it has been covered by another window.
The drag and drop action has been canceled.
@@
@cmsg171_S
Object to be dragged not found. Ddrag and drop canceled.
@@
;for msg172, %1 = the object being dragged, %2 = the drag destination
@cmsg172_L
dragging %1 to %2
@@
;for msg173-174, %1 = the frame name
@cmsg173_L
This frame %1
@@
@cmsg174_L
says the content of the frame %1
@@
; for Dos Windows
@cmsg175_L
This is a dos window.
You can close this window by typing exit and pressing the enter key.
To switch between this window and your other applications, use alt + tab.
@@
@cmsg177_L
Use the Graphics Labeler to label graphics
@@
@cmsgLeftMouseButtonIsLocked_L
the left mouse button is locked
@@
@cmsgLeftMouseButtonIsLocked_S
left mouse button locked
@@
@cmsgRightMouseButtonLocked_L
the right mouse button  is locked
@@
@cmsgRightMouseButtonLocked_S
right mouse button  locked
@@
;for cmsgErr_UnknownScriptCall and cmsgErr_UnknownFunctionCall,
;%1 is the name of the script or function.
@cmsgErr_UnknownScriptCall
unknown script call to:
%1
@@
@cmsgErr_UnknownFunctionCall
unknown function call to:
%1
@@
;for cmsgErr_UnknownScriptCallWithStackOutput and cmsgErr_UnknownFunctionCallWithStackOutput
;%1 is the name of the script or function,
;%2 is the call stack output.
@cmsgErr_UnknownScriptCallWithStackOutput
unknown script call to: %1

Call Stack:
%2
@@
@cmsgErr_UnknownFunctionCallWithStackOutput
unknown function call to: %1

Call stack:
%2
@@
@cmsg183_L
Setting Region top left corner
@@
@cmsg183_S
top left corner
@@
@cmsg184_L
Setting Region bottom right corner
@@
@cmsg184_S
bottom right corner
@@
@cmsg185_L
Clearing start settings for frame, drag and drop, and Braille Select Text
@@
@cmsg185_S
Cleared
@@
@cmsg186_L
Structured Mode
@@
@cmsg186_S
Structured
@@
@cmsg187_L
Line Mode
@@
@cmsg187_S
Line
@@
@cmsg188_L
Text Attribute Indicators
@@
@cmsg188_S
Attributes
@@
@cmsg189_L
characters
@@
@cmsg190_L
Task bar is not visible
@@
@cmsg190_S
Task bar not visible
@@
@cmsg191_L
system tray is not visible
@@
@cmsg191_S
system tray is not visible
@@
@cmsg192_L
cannot determine default button in this dialog box
@@
@cmsg192_S
cannot determine default button
@@
;for msg193, %1 = the menu name
@cmsg193_L
%1 menu
@@
@cmsg196_L
The active cursor will not follow the braille cursor
@@
@cmsg196_S
Active does not follow Braille
@@
@cmsg197_L
The Active cursor will follow the braille cursor
@@
@cmsg197_S
Active follows Braille
@@
@cmsg198_L
cannot determine hot keys in this dialog
@@
@cmsg199_L
The Braille display will not follow the active cursor
@@
@cmsg199_S
Braille will not follow active
@@
@cmsg200_L
The Braille display will follow the active cursor
@@
@cmsg200_S
Braille will follow active
@@
@cmsg201_L
There is no %product% specific help for this application
@@
@cmsg201_S
No %product% help topic
@@
;for msg202, %1 = the current application name
@cmsg202_L
%1, requires a Restart if you wish to continue with speech
@@
;cmsg203_L and cmsg204_L are for turning speech on and off
@cmsg203_L
Speech Off
@@
@cmsg204_L
Speech On
@@
;cmsgSpeechOnDemandOn and cmsgSpeechOnDemandOff are announced when speech on demand is toggled:
@cmsgSpeechOnDemandOn
speech off set to speech on demand
@@
@cmsgSpeechOnDemandOff
Speech off set to speech mute
@@
@cmsgFullSpeech
Full Speech
@@
@cmsgSpeechOnDemand
Speech On Demand
@@
@cmsgSpeechMute
Speech Mute
@@
@cmsgSpeechOnDemandKeystrokeUnavailable
Not available in Full Speech mode
@@
@cMsg207
Hot keys for this execute item dialog:
To select an item, use the up or down arrow.
To execute the selected item once, press the space bar or alt e.
To exit this dialog, press enter or escape.
@@
@cMsg212
Hot keys for this select item dialog:
To select an item, use the up or down arrow.
To execute your selection, press enter.
To cancel this dialog, press escape.
@@
;for msg213, %1 = the application name
@cmsg213_L
To hear the JAWS help topic for %1, hold down the JAWS key and press F1 twice QUICKLY.
@@
@cmsg213_S
To hear the %product% help topic for %1, press JAWSKey+F1 twice quickly.
@@
;for msg214, %1 = the unselected text
@cmsg214_L
Unselected
@@
;for msg215, %1 = selected text
@cmsg215_L
selected
@@
@cmsg215_S
%1
selected
@@
@cmsg216_L
Word in context not found
@@
@cmsg216_S
Word not found
@@
@cmsgWordInContextError_l
Not available outside of tables, or Spellchecker and Find and Replace dialog windows.
@@
@cmsgWordInContextError_s
Not available outside of tables or relevant dialog windows.
@@
@cmsg219_L
Speech Output Mode
@@
@cmsg219_S
Speech Output
@@
@cmsg220_L
Beginning of line
@@
@cmsg220_S
Beginning
@@
@cmsg221_L
End of line
@@
@cmsg221_S
End
@@
@cmsg222_L
Selecting Text
@@
@cmsg222_S
Selecting
@@
@cmsg223_S
Intermediate
@@
@cmsg224_S
Advanced
@@
@cmsg225_S
Beginner
@@
@cmsg226_L
None
@@
@cMSG227_L
Labeled
@@
@cmsg228_L
All
@@
;for msg229, %1 = the dialog name in braille
@cmsg229_L
%1 dlg
@@
;for msg230, %1 = the dialog page name in braille
@cmsg230_L
%1 page
@@

;for msgBrailleStruc1, %1 = the checked/unchecked braille symbol, %2 = the text of the radio button or checkbox,
;%3 = the window type
@cmsgBrailleStruc1
%1 %2 %3
@@
;for msgBrailleStruc2, %1 = the control name, %2= the control type
@cmsgBrailleStruc2
%1 %2
@@
;for cMsgBrailleStruc4, %1=control prompt, %2=control type, %3=control value
@cMsgBrailleStruc4
%1 %2 %3
@@
;for cMsgBrailleStruc5, %1=treeview prompt, %2=treeview type, %3=treeview level
@cMsgBrailleStruc5
%1 %2 %3
@@
@cmsg231_L
%1 gb
@@
;for msg232, %1= the button name in braille
@cmsg232_L
%1 button
@@
@cMsgBrlTabControl
tab control
@@
@cMsgBrlSliderUD
ud-slider
@@
@cMsgBrlSliderLR
lr-slider
@@
@cMsgBrlEditSpinbox
edit spinbox
@@
@cMsgBrlSpinbox
spinbox
@@
@cMsgBrlEditCombo
edit combo
@@
@cMsgBrlExtSelListbox
extsel list box
@@
@cMsgBrlMultiSelListbox
multisel list box
@@
@cMsgBrl3State
3st
@@
;for msg233, %1 = the tree view level
@cmsg233_L
level %1
@@
@cmsg234_L
Translation on
@@
@cmsgContractedBrailleOff
Contracted Braille off
@@
@cmsgContractedBrailleOnForDisplay_L
Contracted Braille on for display
@@
@cmsgContractedBrailleOnForDisplay_S
On for display
@@
@cmsgContractedBrailleOnForInput_L
Contracted Braille on for input
@@
@cmsgContractedBrailleOnForInput_S
on for input
@@
@cmsg235_L
Translation off
@@
@cmsg236_L
Expanding current word
@@
@cmsg236_S
current word
@@
@cmsg237_L
Translating whole line
@@
@cmsg237_S
Whole line
@@
@cmsg238_L
Default
@@
;for msg239, %1 = theProduct Name, %2 = the Version number
@cmsg239_L
%1 Version %2
@@
;for msg240-241, %1 = a text Attribute name
@cmsg240_L
%1 on
@@
@cmsg241_L
%1 off
@@
@cmsg242_L
Starting auto graphic labeler
@@
@cmsg242_S
Start
@@
;for msg243, %1 = the number of labeled graphics
@cmsg243_L
Auto labeler finished. %1 graphics were labeled.
@@
@cmsg243_S
finished. %1 graphics labeled.
@@
; for the SayFormatAndText functions
@cmsg244_L
 Normal
@@
@cmsg247_L
all caps
@@
@cMSG248_S
Line with pauses
@@
@cMSG249_S
Sentence
@@
@cMSG250_S
Paragraph
@@
@cMsg253_L
This is
@@
@cMsg254_L
the label for
@@
@cMsg254_S
Label for
@@
@cMsg255_L
item
@@
@cMsg256_L
Text
@@
@cMsg257_L
minimized window
@@
@cMsg258_L
radio button
@@
@cMsg259_L
Bitmap
@@
@cMsg260_L
In
@@
@cMsg261_L
tab
@@
@cMsg262_L
icon in a list view:
@@
@cMsg263_L
an item in a tree view
@@
@cMsg264_L
This is an unknown window type
@@
@cMsg264_S
unknown window type
@@
@cMsg265_L
Combo box
@@
@cMsg266_L
edit
@@
@cMsg267_L
password edit
@@
@cMsg268_L
edit combo
@@
@cMsg269_L
list box
@@
@cMsg270_L
shortcut edit
@@
@cMsg271_L
on tab page
@@
@cMsg271_S
page
@@
@cMsg272_L
in dialog box
@@
@cMsg272_S
dialog box
@@
@cMsg273_L
from menu
@@
@cMsg273_S
menu
@@
@cMsg274_L
in application
@@
@cMsg274_S
application
@@
@cMSG276_L
 This paragraph may be too large to fit on the Screen
@@
@cMSG277_L
maximize the window and try again or read this using Sentence or line
@@
@cmsg278_L
Some
@@
@cmsg279_L
Most
@@
@cmsg280_L
All
@@
@cmsg281_L
speech Output mode off
@@
@cmsg286_L
forms mode on
@@
@cmsg287_L
forms Mode off
@@
@cMSG288_L
virtual PC Cursor
@@
@cMSG288_S
virtual PC
@@
@cMSG289_L
Route JAWS to Virtual PC
@@
@cMSG289_S
JAWS to Virtual PC
@@
@cmsgVirtualToJaws_l
route Virtual PC to JAWS
@@
@cmsgVirtualToJAWS_s
Virtual PC to JAWS
@@
@cmsg290_L
Screen updated
@@
@cMSG291_L
use virtual PC cursor on
@@
@cmsg292_L
use virtual PC cursor off
@@
;cMSG_UseVPCForUWP_On_L and cMSG_UseVPCForUWP_Off_L are the long messages spoken when the virtual cursor is toggled using Insert+Z
;in a Universal Windows Platform application, such as Microsoft Weather.
@cMSG_UseVPCForUWP_On_L
use virtual PC cursor on for UWP apps
@@
@cMSG_UseVPCForUWP_Off_L
use virtual PC cursor off for UWP apps
@@
;for cmsgUseVPCResetForApp
;%1 is the name of the configuration for the focus application
@cmsgUseVPCResetForApp
use virtual PC cursor reset for %1
@@
@cmsgUseVirtualPCCursorGlobalToggleNotAvailable
Use virtual PC cursor global toggle is not available in this application
@@
@cmsg294_S
not
@@
;messages for HTML
;for msgHTML1-2, %1 = Number of Frames, %2 = number of links
@cmsgHTML1_L
Page has %1 frames, and %2 link
@@
@cmsgHTML1_S
%1 frames, and %2 link
@@
@cmsgHTML2_L
Page has %1 frames, and %2 links
@@
@cmsgHTML2_S
%1 frames, and %2 links
@@
;for msgHTML3-4, %1 = Number of links
@cmsgHTML3_L
Page has %1 link
@@
@cmsgHTML3_S
%1 link
@@
@cmsgHTML4_L
Page has %1 links
@@
@cmsgHTML4_S
%1 links
@@
@cmsgHTML5_L
						Not available with virtual PC cursor
@@
@cmsgHTML5_S
  Not available in virtual PC
@@
;Note about the following messages:
; 1 contains everything; headings, frames and links.
;2 contains headings and links only,
; or frames and links, but not all three.
;3 Contains one value, either headings or links only.
;We never speak 'no' for a 0-value
; for anything but links.
;
;The messages for links, headings and frames e.g. @cmsgFrame,
; must maintain the spacing around the word as their value is used as a part of the longer message.
;This will allow for greater flexibility for the new heading feature and ordering of text.
@cmsgDocumentLoaded1_L
Page has %1, %2 and %3
@@
@cmsgDocumentLoaded1_S
%1, %2 and %3
@@
@cmsgDocumentLoaded2_L
Page has %1 and %2
@@
@cmsgDocumentLoaded2_S
%1 and %2
@@
@cmsgDocumentLoaded3_L
Page has %1
@@
@cmsgDocumentLoaded3_S
%1
@@
@cMsgFrame
frame
@@
@cmsgFrames
frames
@@
@cmsgHeading
 heading
@@
@cmsgHeadings
 headings
@@
@cMsgLink
 link
@@
@cMsgLinks
 links
@@
@cMsgNoLinks
no links
@@
@cmsgBrailleChecked1_L
<x>
@@
@cmsgBrailleUnChecked1_L
< >
@@
@cmsgBraillePartiallyChecked1_L
<->
@@
@cMsgBrailleExpanded
expnd
@@
@cMsgBrailleCollapsed
cllpsd
@@
@cmsgGrayedGraphic1_L
 grayed
@@
@cmsgPressedGraphic1_L
pressed
@@
@cmsgNotPressed_L
Not pressed
@@
@cmsgBrailleInterruptOn1_L
Keystrokes from the Braille display will interrupt speech
@@
@cmsgBrailleInterruptOn1_S
Braille keys will interrupt speech
@@
@cmsgBrailleInterruptOff1_L
Keystrokes from the Braille display will not interrupt speech
@@
@cmsgBrailleInterruptOff1_S
Braille keys will not interrupt speech
@@
;the below messages are plural forms of HTML element types inserted into messages.
@cVMsgLinks1_L
links
@@
@cVMsgVisitedLinks1_L
visited links
@@
@cVMsgUnvisitedLinks1_L
unvisited links
@@
@cvmsgFrames1_L
frames
@@
@cVMsgButton1_L
Buttons
@@
@cVMsgCheckBox1_L
Check boxes
@@
@cVMsgRadioButton1_L
radio buttons
@@
@cVMsgEdit1_L
edit boxes
@@
@cVMsgEditCombo1_L
edit combo boxes
@@
@cVMsgComboBox1_L
comboboxes
@@
@CVMSGComboboxListBoxTreeView1_L
Selectable ARIA controls, comboboxes, listboxes or treeviews
@@
@cVMsgSpinBox1_L
Spinboxes
@@
@cVMsgLink1_L
Link
@@
@cVMsgMailToLinks1_L
mailto Links
@@
@CVMSGFormFields_L
form fields
@@
@cVMsgPlacemarkers1_L
PlaceMarkers
@@
@cmsg295_S
none
@@
@cmsg296_S
Labeled
@@
@cmsg297_S
All
@@
@cmsg298_S
none
@@
@cmsg299_S
Labeled
@@
@cmsg300_S
All
@@
@cmsg305_S
%1
@@
@cmsg306_S
%1
@@
@cmsg315_L
Application window restriction
@@
@cmsg315_S
Application
@@
@cMSG316_L
Real window restriction
@@
@cMSG316_S
Real
@@
@cmsg317_L
Current window restriction
@@
@cmsg317_S
Current
@@
@cmsgRestrictFocusWindow_L
Focus window restriction
@@
@cmsgRestrictFocusWindow_S
Focus
@@
@cmsg318_L
Unrestricted
@@
@cmsg319_L
Frame restriction
@@
@cmsg319_S
Frame
@@
;cmsgContainerRestriction messages are for speaking the restriction level when toggling restriction when the UIA JAWS or UIA Invisible cursor is active.
@cmsgContainerRestriction_L
Container  restriction
@@
@cmsgContainerRestriction_S
Container
@@
;cmsgElementRestriction messages are for speaking the restriction level when toggling restriction when the UIA JAWS or UIA Invisible cursor is active.
@cmsgElementRestriction_L
Element restriction
@@
@cmsgElementRestriction_S
Element
@@
@cmsgDocumentPresentationModeOn_L
Screen Layout
@@
@cmsgDocumentPresentationModeOff_L
Simple Layout
@@
@cmsgBraille1_L
Braille Cursor
@@
@cmsgBraille1_S
Braille
@@
@cmsg328_L
Alt Attribute
@@
@cmsg328_S
Title
@@
@cmsg329_S
Screen Text
@@
@cmsg330_L
On Mouse Over
@@
@cmsg330_S
Longest
@@
@cMsgAltAttribute
Alt Attribute
@@
@cMsgLabelTag
Label Tag
@@
@cmsgTitleLabel
Label and Title If Different
@@
@cMsgAltLabel
Label and Alt If Different
@@
@cmsgButtonValue_L
Value
@@
@cmsg331_S
%1
@@
@cmsg334_S
None
@@
@cmsg335_S
Tagged
@@
@cmsg336_S
All
@@
@cMSG337_L
There is currently an open %product% dialog box. Only one %product% dialog box can be opened at a time.

You must close the current dialog by pressing Escape in order to bring up the requested dialog box
and then activate the desired dialog box.
@@
@cMSG337_S
There is an open %product% dialog. Only one %product% dialog box can be opened at a time.
You must close the current dialog before opening a new one.
@@
@cMSG338_L
The virtual cursor will be turned off for all applications
@@
@cMSG338_S
Off for all applications
@@
@cMSG339_L
The virtual cursor will be turned on for all applications
@@
@cMSG339_S
On for all applications
@@
@cmsgUnknown
Unknown
@@
@cmsg354_L
Lower
@@
@cmsg355_L
Higher
@@
@cmsg356_L
Slower
@@
@cmsg357_L
Faster
@@
@cmsg358_L
Softer
@@
@cmsg359_L
Louder
@@
@cmsg360_L
Voice Settings Restored
@@
@cmsg360_S
Restored
@@
@cmsg361_L
Both characters and words
@@
@cmsgIndicateCapByNoIndication
No Indication
@@
@cmsgIndicateCapByPitchIncrement
Pitch Increment
@@
@cmsgIndicateCapBySayCap
Say Cap
@@
@cmsgCustomHighlight2
Choose An Option
@@
@cmsgSettingError1_L
Error saving setting,%product% will not remember this setting next time you restart
@@
@cmsgSettingError1_S
Error saving setting
@@
@cmsgSettingSaved1_L
%product% will remember this setting until you decide to re save it
@@
@cmsgSettingSaved1_S
Setting Saved
@@
@cmsgNoFollowPC1_L
The JAWS cursor will not follow the PC Cursor
@@
@cmsgNoFollowPC1_S
JAWS will not follow PC
@@
@cmsgFollowPC1_L
The JAWS cursor will follow the PC Cursor
@@
@cmsgFollowPC1_S
JAWS will follow PC
@@
;For the two messages that follow,
; the translation is to be the same as their values in synbols.ini
@cmsgBlank1
blank
@@
@cMsgSpace1
space
@@
;in the two messages that follow,
;%1 = a window prompt, and %2 = the hot key
@cmsgHotKeyDefaultHelpLoopPrompt1_L
%1  %2

@@
@cmsgHotKeyDefaultHelpLoopPrompt1_S
%1, %2
@@

;Dialog names
@cmsgListOfControls1_L
List Of Controls
@@

@cmsgRestrict1_L
You must turn on either the JAWS or Invisible cursor, or the virtual cursor must be in a web dialog before you can set restriction.
@@
@cmsgRestrict1_S
Not available for PC
@@
@cmsgNoGraphics1_L
no clickable graphics found
@@
@cmsgNoGraphics1_S
no graphics
@@

;the following messages are used for screen sensitive help
@cMsgScreenSensitiveHelpWinformsDataGrid
This is a data grid.
Use the arrow keys or tab to navigate.
Pressing F2 will let you edit the current cell.
@@
@cMsgScreenSensitiveHelpGrid
To navigate the items on this grid, use the UP and DOWN ARROW keys to move between rows and the LEFT and RIGHT ARROW keys to move between columns.
@@
@cMsgScreenSensitiveHelpBuf
Navigate messages displayed in the virtual viewer with standard reading commands.
Read by line, Word, or character.
Select text with standard commands and copy it to the clipboard.
To activate a link, move to it and press ENTER.
To list all links in a message and select the link you want to use, press Insert+F7.
Links take you to other messages or activate commands in the application you are using.

Press ESC to close this message.
@@
@cmsgScreenSensitiveHelpButtonSpacebar_L
to activate this button, Press Spacebar.
@@
@cmsgScreenSensitiveHelpButtonSpacebar_S
To activate this button, press Spacebar.
@@
@cmsgScreenSensitiveHelp1_L
to activate this button, Press ENTER.
@@
@cmsgScreenSensitiveHelp1_S
To activate this button, press ENTER.
@@
@cmsgScreenSensitiveHelp2_L
To check or clear this check box, press the space bar.
@@
@cmsgScreenSensitiveHelp2_S
To check or clear this check box, press the space bar.
@@
@cmsgScreenSensitiveHelp3_L
To change the selection in a group of radio buttons,
move to the radio button you want to select and press the space bar.
@@
@cmsgScreenSensitiveHelp3_S
To change the selection in a group of radio buttons,
move to the radio button you want to select and press the space bar.
@@
@cmsgScreenSensitiveHelp4_L
Press ENTER to activate Forms Mode Before you type text in this edit field.
@@
@cmsgScreenSensitiveHelp4_S
Press ENTER to activate Forms Mode Before typing  text in this edit field.
@@
@cmsgScreenSensitiveHelp5_L
To change the selection in an edit-combo box,
press ENTER to activate Forms Mode,
then type in the value or use UP or DOWN ARROW.
@@
@cmsgScreenSensitiveHelp5_S
To change the selection in an edit-combo box,
press ENTER to activate Forms Mode,
then type in the value or use UP or DOWN ARROW.
@@
@cmsgScreenSensitiveHelp6_L
To change the selection in a combo box,
press ENTER to activate Forms Mode,
then use UP or DOWN ARROW.
In some combo boxes, you may need to first press ALT+DOWN ARROW to open
the list of items.
@@
@cmsgScreenSensitiveHelp6_S
To change the selection in a combo box,
press ENTER to activate Forms Mode,
then use UP or DOWN ARROW.
@@
@cmsgScreenSensitiveHelp7_L
To change the selection in a spin box,
press ENTER to activate Forms Mode,
then use UP or DOWN ARROW.
@@
@cmsgScreenSensitiveHelp7_S
To change the selection in a spin box,
press ENTER to activate Forms Mode,
then use UP or DOWN ARROW.
@@
@cmsgScreenSensitiveHelp8_L
Selecting this Send Mail Link with ENTER
opens a new e-mail message with the
To field containing the e-mail address from this link.
@@
@cmsgScreenSensitiveHelp8_S
Selecting this Send Mail Link with ENTER
opens a new e-mail message with the
To field containing the e-mail address from this link.
@@
@cmsgScreenSensitiveHelp9_L
To activate this image map link, press ENTER.
@@
@cmsgScreenSensitiveHelp9_S
To activate this image map link, press ENTER.

@@
@cmsgScreenSensitiveHelp10_L
The content of this graphic image is not directly accessible by %product%.
Any specified alternate text is read, and if the graphic
is part of a link, ENTER activates it.
@@
@cmsgScreenSensitiveHelp10_S
The content of this graphic image is not directly accessible by %product%.
Any specified alternate text is read, and if the graphic
is part of a link, ENTER activates it.
@@
@cmsgScreenSensitiveHelp11_L
This link, pointing to another web page,
is activated with ENTER.
@@
@cmsgScreenSensitiveHelp11_S
This link, pointing to another web page,
is activated with ENTER.
@@
@cmsgScreenSensitiveHelp12_L
This link, pointing to another location on the current page,
is activated with ENTER.
@@
@cmsgScreenSensitiveHelp12_S
This link, pointing to another location on the current page,
is activated with ENTER.
@@
@cmsgScreenSensitiveHelp13_L
This FTP link,
pointing to a file or directory on an FTP site,
is activated with ENTER.
@@
@cmsgScreenSensitiveHelp13_S
This FTP link,
pointing to a file or directory on an FTP site,
is activated with ENTER.
@@
@cmsgScreenSensitiveHelp14_L
Press the SPACEBAR to activate this button.
@@
@cmsgScreenSensitiveHelp14_S
Press the SPACEBAR to activate this button.
@@
@cmsgScreenSensitiveHelp15_L
To select an item in a combo box,
press the first letter of the item,
or use UP or DOWN ARROW to move through the list.
In some combo boxes, you may need to first press ALT+DOWN ARROW to open the list of items.
@@
@cmsgScreenSensitiveHelp15_S
To select an item in a combo box,
press the first letter of the item,
or use UP or DOWN ARROW to move through the list.
In some combo boxes, you may need to first press ALT+DOWN ARROW to open the list of items.
@@
@cmsgScreenSensitiveHelp16_L
You can type text in this edit field or navigate using standard reading commands.
@@
@cmsgScreenSensitiveHelp16_S
You can type text in this edit field or navigate using standard reading commands.
@@
@cmsgScreenSensitiveHelp17_L
This %product% list box contains configurable options.
To move to an item, Use the arrow keys,
or type the first letter of the item.
Press SPACEBAR to toggle the setting for the selected item.
Press ENTER to close the dialog.
@@
@cmsgScreenSensitiveHelp18_L
In this select item list box:
To move to an item, use the Arrow keys or the First letter of an item.
To Choose an item and exit the dialog, press ENTER.
To cancel the dialog, press ESC.
@@
@cmsgScreenSensitiveHelp19_L
Use the UP and DOWN ARROW keys to select an item in this list box.
You can also use first letter navigation to move quickly to an item.
@@
@cmsgScreenSensitiveHelp19_S
Use the UP and DOWN ARROW keys to select an item in this list box.
You can also use first letter navigation to move quickly to an item.
@@
@cmsgScreenSensitiveHelp20_L
To increase the value of a scroll bar, press RIGHT ARROW, DOWN ARROW, or PAGE DOWN.
To decrease the value, press LEFT ARROW, UP ARROW, or PAGE UP.
@@
@cmsgScreenSensitiveHelp21_L
To increase the value of a scroll bar, press RIGHT ARROW, DOWN ARROW, or PAGE DOWN.
To decrease the value, press LEFT ARROW, UP ARROW, or PAGE UP.
@@
@cmsgScreenSensitiveHelp22_L
To navigate and read this read-only text, use standard reading commands.
@@
@cmsgScreenSensitiveHelp22_S
To navigate and read this read-only text, use standard reading commands.
@@
@cmsgScreenSensitiveHelpToolBarJAWSCursor_L
Use JAWS cursor navigation to move to buttons on this toolbar.
Press left mouse button to activate the toolbar button under the JAWS cursor.
@@
@cmsgScreenSensitiveHelp23_L
Use the arrow keys to move through the buttons on this toolbar.
Press ENTER to activate the selected toolbar button.
@@
@cmsgScreenSensitiveHelp24_L
Status bars provide contextual information within applications.
To access status bar information, press %KeyFor(SayBottomLineOfWindow).
@@
@cmsgScreenSensitiveHelp25_L
This header bar contains titles for the columns below it.
Click on a column title with the JAWS cursor to sort the list based on the information in that column.
@@
@cmsgScreenSensitiveHelp26_L
Type the value in the spin box,
or press UP or DOWN ARROW to adjust the value.
@@
@cmsgScreenSensitiveHelp27_L
Use the UP and DOWN ARROW keys to select commands on this menu.
You can press RIGHT ARROW to open submenus. Press ENTER to carry out the currently selected command.
@@
@cmsgScreenSensitiveHelp27a_L
Use the Left and Right ARROW keys to select commands on this menu.
Press ENTER to carry out the currently selected command.
@@
@cmsgScreenSensitiveHelp28_L
From the desktop,
press the WINDOWS key to open the Start menu,
press %keyFor(StartJAWSTaskList) to list open applications,
or use the Arrow keys to move through the items on the Desktop.

@@
@cmsgScreenSensitiveHelp29_L
To activate this minimized application or folder,
press ENTER if using the PC Cursor,
or press %KeyFor(LeftMouseButton) if using the JAWS cursor.
@@
@cmsgScreenSensitiveHelp30_L
This multiple document interface client window
is the space underlying documents in an application.
To open a document or to exit the application,
use the application's menus.
@@
@cmsgScreenSensitiveHelp31_L
To move through this dialog box, press TAB.
To read the entire window. press %KeyFor(ReadBoxInTabOrder).
@@
@cmsgScreenSensitiveHelp32_L
Use the arrow keys to select one of the radio buttons in this group.
@@
@cmsgScreenSensitiveHelp32_S
Use the arrow keys to select one of the radio buttons in this group.
@@
@cmsgScreenSensitiveHelp33_L
Press the SPACEBAR to check or uncheck this check box.
@@
@cmsgScreenSensitiveHelp33_S
Press the SPACEBAR to check or uncheck this check box.
@@
@cmsgScreenSensitiveHelp34_L
This group box is used to group items that are related such as radio buttons.
@@
@cmsgScreenSensitiveHelp35_L
To read the contents of this dialog, press %KeyFor(ReadBoxInTabOrder).
To determine the default button activated by ENTER, press %KeyFor(SayDefaultButton).
To exit the dialog and discard changes, press ESC.
@@
@cmsgScreenSensitiveHelp36_L
This is a General picture.
@@
@cmsgScreenSensitiveHelp37_L
Use this short cut key edit control to define
a unique keyboard command to open the application at any time.
Press the letter key you wish to assign, and Windows adds ALT+CTRL,
or press any combination of ALT, CTRL, or SHIFT with a letter key to specify the exact keys to use.
@@
@cmsgScreenSensitiveHelp38_L
To move between the pages in a multi-page dialog box, Press RIGHT or LEFT ARROW on this tab control.
You can also press CTRL+TAB or CTRL+SHIFT+TAB to switch the pages from anywhere within the dialog without having to move back to the tab control.
@@
@cmsgScreenSensitiveHelp38_S
To move between the pages in a multi-page dialog box, Press RIGHT or LEFT ARROW on this tab control.
You can also press CTRL+TAB or CTRL+SHIFT+TAB to switch the pages from anywhere within the dialog without having to move back to the tab control.
@@
@cmsgScreenSensitiveHelp39_L
The desktop list view contains application icons and desktop items.
Press the first letter of the desired item to move to it.
To open or start it, Press ENTER.
To open the Start Menu, Press the Windows Key.
@@
@cmsgScreenSensitiveHelp40_L
Use all the arrow keys to move through and select items in this list.
You can also use first letter navigation to move quickly to an item.
@@
@cmsgScreenSensitiveHelp40_S
Use all the arrow keys to move through and select items in this list.
You can also use first letter navigation to move quickly to an item.
@@
;for msgScreenSensitiveHelp41, %1 = the current tree view level
@cmsgScreenSensitiveHelp41_L
Use the UP and DOWN ARROW keys to move through and select items in this tree view.
To expand the selected item, press RIGHT ARROW.
To collapse an item, press LEFT ARROW.
You can also use first letter navigation to move quickly to an item.
@@
@cmsgScreenSensitiveHelp42_L
From the Start Button, press ENTER to open the Start Menu,
or TAB to move to the Taskbar.
The Start menu provides access to applications and Windows utilities.
The taskbar lists running applications.
@@
@cmsgScreenSensitiveHelp43_L
Items in the Start menu are used to launch applications.
Use the UP and DOWN ARROW keys to select the items.
If %product% indicates an item has a submenu, RIGHT ARROW opens and moves to it.
Press ENTER to carry out the currently selected command.
@@
@cmsgScreenSensitiveHelp44_L
Use the UP and DOWN ARROW keys to select commands on this menu.
You can press RIGHT ARROW to open submenus.
Press ENTER to carry out the currently selected command.
@@
@cmsgScreenSensitiveHelp45_L
The task bar contains currently running applications.
Press ENTER to make an application active.
Running applications may also be listed by pressing %KeyFor(StartJAWSTaskList).
@@
@cmsgScreenSensitiveHelp46_L
In this multiselect listbox,
multiple items that are next to each other are selected by
holding down SHIFT then using UP or DOWN ARROW.
To select multiple items not next to each other,
hold down CTRL as you arrow up and down and press SPACEBAR
to select each item.
@@
@cmsgScreenSensitiveHelp47_L
Use the UP and DOWN ARROW keys to select an item in this list box.
You can also use first letter navigation to move quickly to an item.
To select more than one item, hold CTRL and use the arrow keys to move through the list.
Press SPACEBAR to add an item to the selection.
@@
@cmsgScreenSensitiveHelp48_L
Use the LEFT and RIGHT ARROW keys to move this slider to the desired value or use PAGE DOWN or PAGE UP to move by larger increments.
@@
@cmsgScreenSensitiveHelp49_L
Use the LEFT and RIGHT ARROW keys to move this slider to the desired value or use PAGE DOWN or PAGE UP to move by larger increments.
@@
@cmsgScreenSensitiveHelp50_L
Use the UP and DOWN ARROW keys to select an item from the list or type the name of the item.
@@
@cmsgScreenSensitiveHelp50_S
Use the UP and DOWN ARROW keys to select an item from the list or type the name of the item.
@@
@cmsgScreenSensitiveHelp51_L
Characters typed into this password edit field are usually
displayed as asterisks or blank spaces.
@@
@cmsgScreenSensitiveHelp52_L
To navigate and read this read-only text, use standard reading commands.
@@
@cmsgScreenSensitiveHelp53_L
This command bar consists of a row of buttons.
To move through the buttons, press RIGHT ARROW or LEFT ARROW.
To activate a button, press ENTER.
To move to the next command bar, press CTRL+TAB.
To leave the command bar, press ESC.
@@
@cmsgScreenSensitiveHelp54_L
The system tray  contains currently running applications
not listed on the taskbar.
To move between the items, press LEFT ARROW or RIGHT ARROW.
@@
@cMsgScreenSensitiveHelpClock
To adjust date,time and time zone, press enter.
Check the current time from anywhere by pressing %KeyFor(SaySystemTime) once.
Check the current date from anywhere by pressing %KeyFor(SaySystemTime) twice.
Move to the system tray with the arrow keys.
Go to the desktop with Windows+M.
@@
@cmsgScreenSensitiveHelp55_L
Use the LEFT and RIGHT ARROW keys to move between the different menus on this menu bar.
Press ENTER or DOWN ARROW to open the selected menu.
@@
@cmsgScreenSensitiveHelp56_L
Type a value in this spin box or use the UP and DOWN ARROW keys to increase or decrease the value.
@@
;for msgScreenSensitiveHelp57, %1 = the window sub type code for the current window
@cmsgScreenSensitiveHelp57_L
The Type Code is %1.
@@
@cmsgScreenSensitiveHelp57_S
Type Code %1.
@@
@cmsgScreenSensitiveHelp59_L
Type in the name of a file to upload.
@@
@cmsgScreenSensitiveHelp60_L
To choose a file to upload,
press ENTER or SPACEBAR on this button.
@@
@cmsgScreenSensitiveHelp61_L
After entering forms mode,
type in the name of a file to upload.
@@
@cmsgScreenSensitiveHelp61_S
After entering forms mode,
type in the name of a file to upload.
@@
@cmsgScreenSensitiveHelp62
To collapse or expand this outline button, press the space bar.
When this button is expanded, press the down arrow key to view buttons with more options.
@@
@cmsgScreenSensitiveHelpSplitButton
To activate the default option on this split button, press the space bar or enter.
To view additional options, show the menu by pressing right arrow.
Navigate the menu of options with up and down arrow.
to select an option, press enter.
To cancel the menu at any time, press Left Arrow.
@@
@cmsgScreenSensitiveHelpSplitButtonWithState
This is one of a row of split buttons.
Navigate between the buttons with left and right arrow.
To select a button, press Enter.
To expand, press the space bar or down arrow.
Navigate the menu with up and down arrow.
To select an option from the menu, press enter.
To collapse the menu and return to the row of buttons, press ESC.
@@
@cMsgScreenSensitiveHelp63
This link, pointing to another location in Windows,
is activated with ENTER.
@@
@cMsgScreenSensitiveHelp_3state
Press the spacebar to toggle between the three states of this checkbox.
@@
@cmsgScreenSensitiveHelp_ButtonMenu
Press the space bar to drop down the menu associated with this control, if one is available.
@@
@cmsgWindowKeysHelp1_L
Following are useful windows keyboard commands:
To access an application menu bar, press ALT.
To open the start menu, press CTRL+ESC or the Windows Key.
For Windows help, press F1.
To exit an application, press ALT+F4.
To cycle between the taskbar, start button, and desktop,
press CTRL+ESC, ESC, and then press TAB to cycle between the three.
To display a context menu for a selected item, press the APPLICATIONS key or SHIFT+F10.
To display the properties dialog, press ALT+ENTER.
To toggle Multi-Select Mode for extended select lists, press SHIFT+F8.
@@
@cmsgWindowKeysHelpOfficeQuickSearch
To activate Quick Search in Office applications, press alt+q.
To expand a split button, press ALT+DownArrow.

@@
@cmsgHotKeyHelp1_L
Here are some %product% hot keys for general use:
description  hot key
Screen Sensitive Help  %KeyFor(ScreenSensitiveHelp)
Windows tips on navigation  %KeyFor(WindowKeysHelp)
Read window title  %KeyFor(SayWindowTitle)
Search for JAWS commands  %KeyFor(LaunchCommandsSearch).
Lock or unlock the keyboard  %KeyFor(LockKeyboard).
Turn Screen Shade on or off  %KeyFor(ScreenShadeToggle).
Learn commands in the keyboard layers  %KeyFor(BasicLayerHelp).
Activate the JAWS window  %KeyFor(JAWSWindow)
Minimize all applications and move to the desktop WINDOWS KEY+M or CTRL+ESC, ALT+M
Close JAWS at any time  %KeyFor(ShutDownJAWS)
Access the JAWS search dialog  %KeyFor(JAWSFind)
Toggle Quick Settings %KeyFor(QuickSettings)
Restrict the JAWS Cursor  %KeyFor(RestrictCurrentCursor)
Read current window  %KeyFor(ReadBoxInTabOrder)
Copy text in the current window to the Virtual Buffer  %KeyFor(VirtualizeWindow)
Refresh screen  %KeyFor(RefreshScreen)
Open %product% Help for specific applications, press and hold INSERT, then press F1 twice quickly
Open a JAWS utility   %KeyFor(RunJAWSManager).
Ask FSCompanion %KeyFor(LaunchFSCompanion)

Press Esc to close this message.
@@
@cmsgHotKeyHelp1_S
General %product% hot keys:
Screen Sensitive Help, %KeyFor(ScreenSensitiveHelp).
Window Keys Help, %KeyFor(WindowKeysHelp).
Read window title, %KeyFor(SayWindowTitle).
JAWS window, %KeyFor(JAWSWindow).
Minimize all applications, WINDOWS KEY+M or %KeyFor(MinimizeAllApps).
Close JAWS, %KeyFor(ShutDownJAWS).
JAWS search, %KeyFor(JAWSFind).
Quick Settings dialog, %KeyFor(QuickSettings).
Restrict JAWS Cursor, %KeyFor(RestrictCurrentCursor).
Read current window, %KeyFor(ReadBoxInTabOrder).
Refresh screen, %KeyFor(RefreshScreen).
%product% Help for applications, %KeyFor(ScreenSensitiveHelp) twice quickly.
JAWS utilities, %KeyFor(RunJAWSManager).
Ask FSCompanion %KeyFor(LaunchFSCompanion)
@@
@cmsgNoHeadings
no headings
@@
@cmsgVirtualViewer
Virtual Viewer
@@
@cMsgVirtualViewerSettings
Virtual Viewer Settings are loaded
@@
@cMsgHotKeysLink
List %product% Hot Keys
@@
@cMsgHotKeysFunc
List %product% Hot Keys
@@
@cMsgWindowKeysLink
List Windows Hot Keys
@@
@cMsgWindowKeysFunc
List Windows Hot Keys
@@
@cMsgBuffExit
Press ESCAPE to close this message.
@@
@cMsgResultsViewerExit
<html>
<body>
<p>
Press ESCAPE to close Results Viewer.
</p>
</body>
</html>
@@
@cmsgBrlColor_L
Braille marking custom colors
@@
@cmsgBrlColor_S
custom colors
@@
;For cmsgMagKeyState, %1= The label of the key, %2 = the state; on or off.
@cmsgMagKeyState
%1 %2
@@
@cmsg364_S
Line without pauses
@@
;for ok and cancel buttons in dialogs
@cmsg365_L
Select this button to accept changes and close this dialog.
@@
@cmsg366_L
Select this button to discard changes and close this dialog.
@@
@cmsg367_L
Use this list box to specify the text to be indicated:
text matching both text (foreground) and background colors at the active cursor,
text matching only the text (foreground) color at the active cursor,
or text matching only the background color at the active cursor.
@@
;for system tray
@cmsg368_L
Use this list box to select the System Tray item you wish to access.
To simulate a right single mouse click on the selected item, press ENTER.
@@
@cmsg369_L
To simulate a right single mouse click on the selected system tray item, select this button with SPACEBAR.
@@
@cmsg370_L
To simulate a left single mouse click on the selected system tray item, select this button with SPACEBAR.
@@
@cmsg371_L
To simulate a left double mouse click on the selected system tray item, select this button with SPACEBAR.
@@
@cmsg372_L
This list contains several utilities that are used to customize %product% in various ways.
To select the desired utility, use your arrow keys and press ENTER.
Each utility opens so that you can adjust settings for the application you were in before opening this dialog.
@@
;for Window list dialog
@cmsg373_L
Select the application you wish to move to and press ENTER.
@@
@cmsgScreenSensitiveHelp_OnlyIncludeOnTopWindows
Check this checkbox to show a list of any windows that are set to always appear on top of other windows.
Uncheck it to show the list of windows not set to appear always on top of other windows.
@@
@cmsg374_L
To move to the application selected in the list, select this button.
@@
@cmsg375_L
To view copyright information for the Window List dialog, select this button.
@@
@cMsg376_L
A prompt cannot be created at this location.
@@
@cMsg377_L
This list box lists all currently active frames, which are those that
were created in the current window. To activate the JAWS cursor and
move to a frame, select the frame from the list and press ENTER.
@@
@cmsg378_L
To turn on the JAWS Cursor and place it in the frame you selected in the list, select this button.
@@
@cmsg379_L
To close the list of active frames, select this button.
@@
;For cMsg380, %1=The number of characters
;Up to represents what will be spoken as the final twenty characters.
@cmsg380
%1 characters up to
@@
@cMsgPCToFrameSuccessful
Successful
@@
@cMsgPCToFrameFailed
Could not move the PC cursor to Frame %1
@@
@cMsgJAWSToFrame
The JAWS cursor is placed in Frame %1
@@
@cMsgNoFrames
No frames found
@@
;message for when on heading in a page:
@cMsgHtmlHeading
This is a heading at level %1,
and is used to indicate the beginning of a section
or subsection of the page.
When used properly, headings indicate
the relationship of each section of the page to the page as a whole.
To move between headings, press %KeyFor(moveToNextHeading)
or %KeyFor(MoveToPriorHeading).
To display a list of the headings on the page, press %KeyFor(SelectAHeading)
and select a heading to move to it.
@@
;Headings List
@cmsgHtmlHeadingsList
This list contains the headings found on the current page.
Headings are used to indicate how a page is structured,
and are often found at the beginning of sections within the page.
To move to a particular heading in the list, use Up Arrow, Down Arrow,
or the heading's first letter
To move to the selected heading's location on the page, press enter.
Press ALT+1 through 6 to list only headings at that level.
To list all headings, press ALT+L.
@@
@cmsgHtmlHeadingMoveToButton
To move to the location  of the heading selected in the list,
select this button with SPACEBAR
@@
@cmsgHtmlHeadingCancelButton
To exit this dialog, select this button.
@@
;tab or alphabetic order radio buttons:
@cmsgHtmlHeadingOrder
Select to have the headings listed in TAB order or in alphabetic order.
In TAB order, it may be easier to gain an overview of
the page from the listed headings.
In alphabetic order, it may be easier to find
specific sections of interest.
@@
;levels radio buttons:
@cmsgHtmlHeadingLevels
Select the level of headings you wish to have listed.
Select levels 1 through 6,
or select to display all headings.
@@
;%1=number of links greater than 1
@msgPageHasNLinks
This page contains %1 links.
@@
@msgPageHasOneLink
This page contains one link.
@@
@msgPageHasNoLinks
There are no links on this page.
@@
@msgFormsOnPage1_l
There is 1 form.
@@
@msgFormsOnPage_l
There are %1 forms.
@@
@msgFramesOnPage1_l
There is 1 frame.
@@
@msgFramesOnPage_l
There are %1 frames.
@@
@cmsgScreenSensitiveHelpVirtualDocumentGeneral
This is an HTML or PDF document.
You can use the standard %product% reading commands or Navigation Quick Keys to navigate and read this document. %product% can also
display lists of certain elements on this page. For example, you can press INSERT+F7 for a list of links, INSERT+F6 for a list of headings, or INSERT+F5
for a list of form fields. In addition, if you hold down CTRL+INSERT while pressing a Navigation Quick Key, %product% displays a list of all elements of that
type on the page.

By default, Auto Forms Mode is on. This means that when you navigate to an edit field, %product% automatically turns on Forms Mode so that you can immediately type text in the edit field. Forms Mode will turn off when you exit the edit field.
If you turn off the Auto Forms Mode option, using the Quick Settings dialog box (INSERT+V), you must now press ENTER to manually trigger Forms Mode before you can type in the edit field. Press ESC or NUMPAD PLUS to manually exit Forms Mode.

You can create PlaceMarkers to help you bookmark important locations on the page for easy reference. Press CTRL+Windows+K to create a temporary PlaceMarker that
you can return to by pressing the Navigation Quick Key K. To create a permanent PlaceMarker at your current location, press CTRL+SHIFT+K to open the PlaceMarker
dialog.

You can assign custom labels to almost any element on the page. To assign a custom label to a link, image, button, or other element on the page, move to
it and press CTRL+INSERT+TAB. Alternatively, you can press INSERT+F2 and choose "Custom Label."
@@
@cmsgScreenSensitiveHelpIERSSFeed
If a Web page supports a Web feed, %product% will announce, "RSS Feeds available." A Web feed is a way to subscribe to your favorite Web sites and
receive updated content. This content can consist of headlines, articles, podcasts, summaries, and so on. Internet Explorer 7 or later constantly
scans the Web pages that you visit to see if they support Web feeds.

To add a feed in Internet Explorer 7, press ALT+J to open the Feeds context menu. Select the feed that you want and press ENTER.
To add a feed in Internet Explorer 8 or later, select Feed Discovery from the Tools menu  to open a context menu containing feeds and web slices for the current page.
Select the feed that you want and press ENTER.
Next, select the "Plus button subscribe to this feed" link, or the "Subscribe to this feed" link. Finally, choose "Subscribe."

To view a list of feeds, press CTRL+G, and use the UP or DOWN ARROW keys to navigate the Feeds list.
@@
@cmsgScreenSensitiveHelpVirtualDocumentForMoreHelp
For more details on these features, refer to the %product% Help system. You can also press INSERT+H to view a complete list of %product% hot keys for HTML or PDF
documents.
@@
@msgPageAddress_l
  The address of the current page is %1
@@
@cMsgNoSysTrayItems
No items found in System Tray
@@
@cmsgSysTrayItems
Items In System Tray:
%1
@@
;For the General Display Buttons on the Focus Braille Displays.
@cMsgFocusGDB
The two buttons on the Focus display between the advance bars are user  definable. They are
referred to as Left Selector and Right Selector. The Selector Buttons are
available for you to assign %product%  commands to them in the way that will assist you most.

Use Keyboard Manager to assign default or application specific commands  to these buttons, just
as you would with any other command.

When you assign commands to these buttons, you are told that they are
already assigned to FocusGDBHelpMessage, which only generates this  message. Select the Ok button
to continue with assigning the command in  Keyboard Manager.

Follow these steps to assign %product% commands to these buttons.

Press INSERT+F2 to open the Run %product% Manager dialog.
Move to Keyboard Manager and press ENTER.
Find the application for which you wish to assign commands, or locate  default if you wish to
assign a default command.
TAB to the keystrokes list, and locate the command you want to assign.
Press CTRL+A to add a keystroke.
Press either or both of the Selector Buttons to assign the  command and press ENTER.
TAB to Ok to confirm that you want to continue.
Press ENTER again to confirm the keystroke assignment.
Press ALT+F4 to exit Keyboard Manager.
@@
@cmsgFeatureRequiresVirtualCursor_L
This feature is only available from within a virtual document, such as a page on the Internet.
@@
@cmsgFeatureRequiresVirtualCursor_S
feature only available in virtual document.
@@
@cMsgBrlBlankCell
-
@@
@cMsgBRLZoomToCell
Current cell
@@
@cmsgBRLZoomToRow
Current row
@@
@cMSGBrlZoomToCol
Current column
@@
@cMSGBrlZoomToRowPlusColTitles
Current row plus column titles
@@
@cMSGBrlZoomToCurAndPriorRow
Current and prior row
@@
@cMsgWheelsOff
Whiz Wheels Off
@@
@cMsgWheelsOn
Whiz Wheels on
@@
@cmsgWheelsTrackFocus
track focus
@@
@cmsgWheelsTrackBrlCursor
Track Braille Cursor
@@
;The next two messages are short help reminders for the whiz wheels,
;When both are pressed simultaneouslyand Full Screen is selected.
;User encounters these when pressing a single wheel  when in Full Screen view.
;Press both wheels again to return to Track Focus.
;left = lines, right = left/right, no wrap.
@cmsgFullScreenLeftWheel
Vertical screen navigation
@@
@cmsgFullScreenRightWheel
Horizontal screen navigation
@@
@cMsgColumnTitles
Column
@@
@cMsgRowTitles
Row
@@
@cMsgBothTitles
Both Row and Column
@@
@cMsgMarkedTitles
Only Marked Headers
@@
@cMsgSpellPhonetic
Phonetically
@@
@cMsgSpellStandard
alphabetically
@@
@cMsgNoPriorTable_L
No prior tables found
@@
@cMsgNoPriorTable_S
No prior tables
@@
@cMsgStartOfRowFailed
Could not move to start of row
@@
@cMsgEndOfRowFailed
Could not move to end of row
@@
@cMsgTopOfColumnFailed
Could not move to Top of column
@@
@cMsgBottomOfColumnFailed
Could not move to bottom of column
@@
@cMsgListModeOn
List Mode On
@@
@cMsgListModeOff
List Mode Off
@@
;For cMsgBasicElementInfo, %1 = the element info
@cMsgBasicElementInfo
Element Information:

%1

Press ESC to close this message.
@@
;For cMsgAdvancedElementInfo, %1 = the element info
@cMsgAdvancedElementInfo
Advanced Element Information:

%1

Press ESC to close this message.
@@
@cmsgCustomSearch
Custom search
@@
@cKeyboardLayout_L
Setting Keyboard Layout to %1
@@
@cMsgLastRow_L
You are on the last row in the table.
@@
@cMsgLastRow_S
Last row
@@
@cMsgFirstRow_L
You are on the first row of the table.
@@
@cMsgFirstRow_S
First row
@@
@cMsgLastColumn_L
You are on the last column in the row.
@@
@cMsgLastColumn_S
Last column
@@
@cMsgFirstColumn_L
You are on the first column of the row.
@@
@cMsgFirstColumn_S
First column
@@
@cMsgRefreshAuto
Automatically
@@
;For cMsgXSeconds, %1 = time in seconds.
@cMsgXSeconds
Every %1 seconds
@@
@cMsgOnceAMinute
Once a minute
@@
;For cMsgTableColumnsChanged and cMsgTableRowsChanged
;%1 = number of columns or rows after navigation.
@cMsgTableColumnsChanged
%1 columns
@@
@cMsgTableColumnChanged
%1 column
@@
@cMsgTablerowsChanged
%1 rows
@@
@cMsgTableRowChanged
%1 row
@@
@cmsgPageRefreshPrewarning_L
This page will automatically refresh in %1 seconds.
@@
@cmsgPageRefreshPrewarning_S
page will refresh in %1 seconds.
@@
@cmsgNavigationModeOn_L
Quick Keys on
@@
@cmsgNavigationModeOn_S
Quick Keys on
@@
@cmsgNavigationModeOff_L
quick Keys off
@@
@cmsgNavigationModeOff_S
Quick Keys off
@@
@cMsgSayAllOnly
Say all only
@@
;For cMsgNavigationMode, %1 = The new setting, Off On or SayAll Only.
@cMsgNavigationMode
Navigation Quick Keys
%1
@@
@cmsgNoMoreVisitedLinks_L
No more visited links found
@@
@cmsgNoMoreVisitedLinks_S
No more visited links
@@
@cmsgNoPriorVisitedLinks_L
No prior visited links found
@@
@cmsgNoPriorVisitedLinks_S
No prior visited links
@@
@cmsgNoVisitedLinks_L
No visited links found
@@
@cmsgNoVisitedLinks_S
No visited links
@@
;In cMsgScreenSensitiveHelpTable:
;The parameters are the key names.
@cMsgScreenSensitiveHelpTable
Tables contain rows and columns of information, arranged for easier readability
or to show how items relate to each other.
To move between table cells, use ALT+CTRL+UP, DOWN, LEFT or RIGHT ARROWS.
You can also jump directly to a table cell using %1.
Press %2 to read the current row, and %3 to read the current column.
To move to the next table on a page, press T.
To move out of the table and continue reading the rest of the page, press %4.
@@
;In cMsgScreenSensitiveHelpList:
;The parameters are the key names.
@cMsgScreenSensitiveHelpList
Lists contain related items, sequential steps, or terms and their definitions.
To move to the next list on the page, press L.
To move out of the list and continue reading, press %1.
@@
@cmsgNoMoreUnvisitedLinks_L
No more unvisited links found
@@
@cmsgNoMoreUnvisitedLinks_S
No more unvisited links
@@
@cmsgNoPriorUnvisitedLinks_L
No prior unvisited links found
@@
@cmsgNoPriorUnvisitedLinks_S
No prior unvisited links
@@
@cmsgNoUnvisitedLinks_L
No unvisited links found
@@
@cmsgNoUnvisitedLinks_S
No unvisited links
@@
@msgFrameIs_L
frame = %1
@@
@msgFrameIs_S
%1
@@
@msgHeadingIs_L
heading is %1
@@
@msgHeadingIs_S
%1
@@
@msgRegionNameIs_L
%1
@@
@msgRegionNameIs_S
%1
@@
@msgRegionTypeIs_L
%1
@@
@msgRegionTypeIs_S
%1
@@
@msgRegionLevelIs_L
level %1
@@
@msgRegionLevelIs_S
%1
@@
@cmsgCopyControl_L
Copied current control to clipboard
@@
@cmsgCopyControl_S
Copied control
@@
@cmsgCopyWindow_L
Copied current window to clipboard
@@
@cmsgCopyWindow_S
Copied window
@@
@cmsgVirtualizeWindow_L
Virtualizing current window
@@
@cmsgVirtualizeWindow_S
Virtualizing window
@@
@cmsgVirtualizeControl_L
Virtualizing current control
@@
@cmsgVirtualizeControl_S
Virtualizing control
@@
@cmsgNoTextToVirtualize_L
No text in current window
@@
@cmsgNoTextToVirtualize_S
No text
@@
@cmsgAlreadyVirtualized_L
The current location is already in a virtual view
@@
@cmsgAlreadyVirtualized_S
Already virtualized
@@
@cmsgVirtualizeUnavailableInFormsMode_L
Virtualizing is unavailable when forms mode is active
@@
@cmsgVirtualizeUnavailableInFormsMode_S
Virtualizing unavailable in forms mode
@@
@cmsgIndicateCaps0
Never
@@
@cmsgIndicateCaps1
When Reading by Character
@@
@cmsgIndicateCaps2
When Reading by Word
@@
@cmsgIndicateCaps3
When Reading by Line
@@
@cmsgRouteVirtualToPc1_L
Route Virtual to PC
@@
@cmsgRouteVirtualToPc1_S
Virtual to PC
@@
@cmsgHeadings2
Heading and Level
@@
@cmsgNoNextButton_L
no more buttons found
@@
@cmsgNoNextbutton_S
no more buttons
@@
@cmsgNoPriorButton_L
no prior buttons found
@@
@cmsgNoPriorbutton_S
no prior buttons
@@
@cmsgNoButtonsFound_L
no buttons found
@@
@cmsgNoButtonsFound_S
no buttons
@@
@cmsgNoNextObject_L
no more objects found
@@
@cmsgNoNextObject_S
no more objects
@@
@cmsgNoPriorObject_L
no prior objects found
@@
@cmsgNoPriorObject_S
no prior objects
@@
@cmsgNoObjectsFound_L
no objects found
@@
@cmsgNoObjectsFound_S
no objects
@@
@cmsgNoNextBlockQuote_L
no more BlockQuotes found
@@
@cmsgNoNextBlockQuote_S
no more BlockQuotes
@@
@cmsgNoPriorBlockQuote_L
no prior BlockQuote found
@@
@cmsgNoPriorBlockQuote_S
no prior BlockQuote
@@
@cmsgNoBlockQuotesFound_L
no BlockQuotes found
@@
@cmsgNoBlockQuotesFound_S
no BlockQuotes
@@
@cmsgNoNextGraphic_L
no more Graphics found
@@
@cmsgNoNextGraphic_S
no more Graphics
@@
@cmsgNoPriorGraphic_L
no prior Graphic found
@@
@cmsgNoPriorGraphic_S
no prior Graphic
@@
@cmsgNoGraphicsFound_L
no Graphics found
@@
@cmsgNoGraphicsFound_S
no Graphics
@@
@cMsgNoForms_L
No forms found
@@
@cmsgNoForms_S
No Forms
@@
@cmsgNoNextForm_L
No more forms found
@@
@cmsgNoNextForm_S
No more forms
@@
@cmsgNoPriorForm_L
No prior forms found
@@
@cmsgNoPriorForm_S
No prior forms
@@
@cmsgWrappingToTop_L
wrapping to top
@@
@cmsgWrappingToTop_S
wrapping to top
@@
@cmsgWrappingToBottom_L
wrapping to bottom
@@
@cmsgWrappingToBottom_S
wrapping to bottom
@@
;For cmsgNoMoreElements and cMsgNoPriorElements, %1 = the type of element: e.g. button.
@cmsgNoMoreElements
No more %1 found
@@
@cMsgNoPriorElements
No prior %1 found
@@
@cMsgNoMoreDifferences
No more different elements found.
@@
@CMsgNoPriorDifferences
This is the first element on the page.
@@
@cmsgMoveToTableCellPrompt
Go To (Column,Row):
@@
@cmsgMoveToTableCellTitle
Jump To Table Cell
@@
@cmsgMoveToLineTitle
Jump To Line
@@
;%1 is line count
@cmsgMoveToLinePrompt
Enter Line Number (1 to %1):
@@
@cmsgNoPreviousJump
No previous jump
@@
@cmsgJumpFailed
Jump not successful
@@
@cmsgMoveToTableCellError_L
Couldn't jump to cell (%1,%2)
@@
@cmsgMoveToTableCellError_S
invalid coordinates
@@
;for cmsgDocumentPercentage, %1 is percentage of document read
@cmsgDocumentPercentage
%1%%
@@
@cmsgDisplayed
Shown
@@
@cMsgHidden
Hidden
@@
@cMsgNotAvailable
Unavailable
@@
;For cMsgFontInformation, %1 = the value of GetFont, i.e. Times New Roman Bold
@cMsgFontInformation
Font information:
%1
@@
;For cmsgSettingsInformation, %1 = the Settings in use, %2 = The application filename, %3 = The Configuration Name, %4 = the active scheme.
@cmsgSettingsInformation
%product% Settings Information:
%1 settings are used in the %2 application.
The configuration name is %3.
The current Speech and Sounds Scheme is %4.
@@
@cmsgNothingSelected
Nothing selected
@@
@cMsgOpen
Open
@@
@cMsgClosed
Closed
@@
@cMsgSelected
Selected
@@
@cMsgDeselected
Not selected
@@
@cMsgUnselected
unselected
@@
@cMsgExpanded
Expanded
@@
@cMsgCollapsed
Collapsed
@@
@cmsgSwitchToScheme_L
Switched to scheme %1
@@
@cmsgSwitchToScheme_S
Scheme %1
@@
@cmsgSwitchToSchemeError_L
Couldn't switch to scheme %1
@@
@cmsgSwitchToSchemeError_S
Couldn't switch to %1
@@
@cMsgGraphicLastResortLink
Link's URL
@@
@cMsgGraphicLastResortGraphic
graphic's URL
@@
;For cMsgVirtualHasChanged, %1 = The verbosity option in use, e.g. OnMouseOver, Alt attribute or Screen Text
@cMsgVirtualHasChanged
This item changed with %1.
Begin reading from the new position.
@@
@cMsgContextHelp
Insert f1 Help.
@@
@cMsgContextHelpBRL
+|{
@@
@cMsgFormsMode
Forms Mode
@@
@cMsgPressEnterForFormsMode
Press enter for Forms Mode
@@
@cMsgNoPlaceMarkers_L
No placemarkers on current page
@@
@cMsgNoPlaceMarkers_S
No PlaceMarkers
@@
;For cmsgNumOfPlaceMarkers, %1 = The total number of PlaceMarkers on the page.
@cmsgNumOfPlaceMarkers_L
Only %1 PlaceMarkers were found
@@
@cmsgNumOfPlaceMarkers_S
Only %1 PlaceMarkers
@@
@cmsgOnePlaceMarker_L
Only 1 PlaceMarker was found
@@
@cmsgOnePlaceMarker_S
One PlaceMarker
@@
@cMsgPlaceMarkerVirtualCursor_L
Not available because the virtual PC cursor is off
@@
@cMsgPlaceMarkerVirtualCursor_S
Not available without Virtual Cursor
@@
@cMsgNoMorePlaceMarkers_L
No more PlaceMarkers were found
@@
@cMsgNoMorePlaceMarkers_S
No more PlaceMarkers
@@
@cMsgNoPriorPlaceMarkers_L
No prior PlaceMarkers were found
@@
@cMsgNoPriorPlaceMarkers_S
No prior PlaceMarkers
@@
;For cMsgNotGoToLine, %1 = Line Number.
@cMsgNotGoToLine
Line %1 was not found
@@
;For cMsgSysGetTime, %1 = The time.  Append or prepend with relevant localization text.
@cMsgGetSysTime
%1
@@
;For cMsgSysGetTimeWithSeconds, %1 = The time including seconds.  Append or prepend with relevant localization text.
@cMsgGetSysTimeWithSeconds
%1
@@
;For cmsgSysGetWeekNumber, %1 = The ISO 8601 week number.
@cmsgSysGetWeekNumber
Week %1
@@
;For cMsgSysGetDate, %1 = The date.  Append or prepend with relevant localization text.
@cmsgGetSysDate
%1
@@
;cMsgSysGetTimeAndDate is shown in MAGic when no speech is running,
;%1 = The time
;%2 = the date
@cMsgGetSysTimeAndDate
%1, %2
@@
@cMsgTempPlaceMarkerDropped
Temporary PlaceMarker set
@@
@cmsgFormsModeAutoOffEnabled
Enabled
@@
@cmsgFormsModeAutoOffDisabled
Disabled
@@
@cMsgErrorDefiningPlaceMarker
Error defining placemarker
@@
@cmsgCPSSpeak
Speak Custom Summary
@@
@cmsgCPSVirtualize
Virtualize Custom Summary
@@
@cmsgContextHelpF
Context Help
%1
@@
@cmsgToggleSMMTrainingModeOn_L
Toggle Speech and Sounds Training Mode on
@@
@cmsgToggleSMMTrainingModeOff_L
Toggle Speech and Sounds Training Mode Off
@@
@CMSGSkimReadStopped_L
%1 matches found
@@
;for cmsgSkimReadSummaryLink,
;%1 is the link number,
;%2 is the text for the match
@cmsgSkimReadSummaryLink
%1. %2
@@
@CMSGSelectATable
Select a Table
@@
@cMsgSelectAButton
Select a Button
@@
@cMsgSelectAParagraph
Select a Paragraph
@@
@cMsgSelectAComboBox
Select a Combo Box
@@
@cMsgSelectARadioButton
Select a Radio Button
@@
@cMsgSelectAnEditBox
Select an Edit Box
@@
@cMsgSelectACheckBox
Select a Check Box
@@
@cMsgSelectAnAnchor
Select an Anchor
@@
@cMsgSelectAGraphic
Select a Graphic
@@
@cMsgSelectAList
Select a List
@@
@cMsgSelectAListItem
Select a List item
@@
@cMsgSelectABlockQuote
Select a Block Quote
@@
@cMsgSelectADivision
Select a Division
@@
@cMsgSelectASpan
Select A Span Element
@@
@cMsgSelectAnObject
Select an Object
@@
;the following messages for no tags is what is spoken
;when a user presses a quick nav key and no tags of that type exist are found.
;following the messages for no items of type tag
;are the cVMSG messages which are the items that get inserted as the item the user searched for.
@CMSGNoNextTag_L
no next %1 found
@@
@CMSGNoNextTag_S
no next %1
@@
@CMSGNoPriorTag_L
no prior %1 tag
@@
@CMSGNoPriorTag_S
no prior %1
@@
@CMSGNoTagsFound_L
no %1 were found
@@
@CMSGNoTagsFound_S
no %1
@@
@cVMSGHeading
headings
@@
@CVMSGList
lists
@@
@cVMSGTable
tables
@@
@CVMSGAnchor
anchors
@@
@CVMSGFlow
flows
@@
@CVMSGDivision
divisions
@@
@CVMSGSpan
span elements
@@
@CVMSGListItem
list items
@@
@CVMSGObject
objects
@@
@CVMSGBlockQuote
block quotes
@@
@CVMSGGraphic
Graphics
@@
@CVMSGForm
forms
@@
@cvmsgSeparator
separators
@@
@cvmsgSlider
sliders
@@
;%1 is table caption if any
@CVMSGFormField
form fields
@@
@CVMSGEmail
Emails
@@
@CMSGInTable
%1 table
@@
@CMSGOutOfTable
out of table
@@
@cmsgEnteringNestedTable_L
table nesting level %1
@@
;for cmsgNestedTableWithColumnAndRowCount
;%1 is the nesting level
;%2 is the number of columns
;%3 is the number of rows
@cmsgNestedTableWithColumnAndRowCount_L
table nesting level %1
with %2 columns and %3 rows
@@
@cmsgNestedTableWithColumnAndRowCount_S
table nesting %1
%2 columns %3 rows
@@
@cMsgTaskBarEmpty_l
Task bar is empty
@@
@cMsgTaskBarEmpty_s
empty
@@
;Reminder dialog
@cmsgReminderNotVisible_L
The Reminder dialog is not visible
@@
@cmsgReminderNotVisible_S
Reminder dialog not visible
@@

; %1 prompt %2 value
@CMSGProgressBar
%1 %2
@@
@cmsgNotInAListview_L
The active cursor must be in a ListView to use this feature.
@@
@cmsgNotInAListview_S
Not in a ListView
@@
@cmsgNoTextInListview_L
No text in listview
@@
@cmsgNoTextInListView_S
No text
@@
@cmsgListviewContainsXColumns_L
%1 out of range
this listview only contains %2 columns.
@@
@cmsgListviewContainsXColumns_S
%1 out of range
@@
;%1 name of cursor, %2 column, %3 row, %4 restriction, %5 percent
@cmsgActiveCursorInfo_L
%1
%2, %3
%4
%5
@@
@cmsgActiveCursorInfo_S
%1
%2, %3
%4
%5
@@
;cmsgActiveUIAReviewCursorInfo message is used by script SayActiveCursor when the JAWS Scan or Invisible Scan cursors are active.
;%1 is the cursor name
;%2 and %3 are the X and Y location of the cursor
;%4 is the restriction
;%5 is cmsgRect, which is the element rectangle (only shown on double tap of SayActiveCursor)
@cmsgActiveUIAReviewCursorInfo
%1
%2, %3
%4
%5
@@
;cmsgRect is a message used to represent a rectangle's top left and bottom right points.
@cmsgRect
(%1,%2)-(%3,%4)
@@
;%1 text color, %2 background color
@cmsgColorInfo
%1 on %2
@@
; Customize Listview dialog help messages
@cMsgScreenSensitiveHelpSpeechPage
Use the options on this tab to customize how %product% announces column headers for the current list view.
You can press CTRL+TAB to switch to the Braille tab.
@@
@cMsgScreenSensitiveHelpHeadingsList
This area displays all the column headers in the current list view.
It shows each column's name, assigned behavior, and additional data. %product% reads columns in the list view in the order that they appear here.

Use the UP and DOWN ARROW keys to select a column. Press the SPACEBAR to change the behavior of the selected column.

To change the position of the selected column, use the Move Up and Move Down buttons.

You can change how %product% announces the selected column by using the options in the Column Headers area.

Column descriptions include, for example:
Message: %product% announces the message status as read, unread, forwarded, or
replied.

Flag Status: %product% announces the follow up flag status of the message, for
example, unflagged, red flag, and so on.

For complete information about Column Header descriptions, refer to the %product% help file
and open the Outlook help topic titled Customizing an Outlook Message List.
@@
@cMsgScreenSensitiveHelpMoveUpButton
Select a column in the list and choose this button to move that column to a higher place in the reading order.
%product% reads columns at the top of the list before those on the bottom.
@@
@cMsgScreenSensitiveHelpMoveDownButton
Select a column from the list and choose this button to move the column to a lower place in the reading order.
%product% reads columns on the bottom of the list after those on the top.
@@
@cMsgScreenSensitiveHelpToggleSpeechButton
Choose this button to change the behavior of the selected column.
If the behavior is "Do Not Speak", %product% does not read the contents of the column in this list view. If the behavior is "Speak Column", %product% reads the column normally.
@@
@cMsgScreenSensitiveHelpVoiceAliasButton
You can use this button to select a voice alias that you want %product% to use when reading column headers for the current list view.
You can view or modify voice aliases in Settings Center.
@@
@cMsgScreenSensitiveHelpDeleteCustomizationButton
Use this button to delete the customization for the current list view.
@@
@cMsgScreenSensitiveHelpCustomTextEdit
Select a column from the list and type any custom text that you want to associate with that column in this edit box.
%product% reads the custom text instead of, or in addition to, the column header, depending on the radio button you select in the Column Headers area.
@@
@cMsgScreenSensitiveHelpColumnHeaderRadioButtons
These radio buttons allow you to customize how %product% announces the column headers in this list view.
The selected option applies to all columns. If you select Ignore, %product% does not read column headers or any custom text.
If you select Speak Custom Text OR Header %product% reads the custom text that you entered instead of the column header.
If you have not assigned any custom text, %product% reads the column header instead.
If you select Speak Custom Text AND Header, %product% reads the column header in addition to any custom text that you have assigned.
Lastly, if you select Speak Custom Text Only, %product% only reads custom text assigned to columns and does not read the column headers.
@@
@cMsgScreenSensitiveHelpBraillePage
Use the options on this tab to customize how %product% displays column headers for the current list view on your Braille display.
You can press CTRL+TAB to switch to the Speech tab.
@@
@cMsgScreenSensitiveHelpBrlHeadingsList
This area displays all the columns in the current list view.
It shows each column's name, assigned behavior, and additional data. %product% displays columns in the list view in the order that they appear here. Use the UP and DOWN ARROW keys to select a column. Press the SPACEBAR to change the behavior of the selected column. To change the position of the selected column, use the Move Up and Move Down buttons. You can change how %product% displays the selected column by using the options in the Column Headers area.
@@
@cMsgScreenSensitiveHelpBrlMoveUpButton
Select a column header from the list and choose this button to move the column to a higher place in the display order.
%product% displays columns at the top of the list before those on the bottom.
@@
@cMsgScreenSensitiveHelpBrlMoveDownButton
Select a column header from the list and choose this button to move the column to a lower place in the display order.
%product% displays columns on the bottom of the list after those on the top.
@@
@cMsgScreenSensitiveHelpToggleBrailleButton
Choose this button to change the behavior of the selected column.
If the behavior is "Do Not Braille", %product% does not display the contents of the column in this list view.
If the behavior is "Speak Column", %product% displays the column normally.
@@
@cMsgScreenSensitiveHelpBrlColumnHeaderRadioButtons
These radio buttons allow you to customize how %product% displays the column headers in this list view on your Braille display.
The selected option applies to all the columns. If you select Ignore, %product% does not display column headers or custom text in Braille.
If you select Braille Custom Text OR Header %product% displays the custom text that you entered instead of the column header.
If you have not assigned any custom text, %product% displays the column header instead.
If you select Braille Custom Text AND Header, %product% displays the column header and any custom text that you have assigned.
Lastly, if you select Braille Custom Text Only, %product% only displays custom text assigned to columns and does not display the column headers.
@@
@cMsgScreenSensitiveHelpBrlCustomTextEdit
Select a column from the list and type any custom text that you want to associate with that column in this edit box.
%product% displays the custom text instead of, or in addition to, the column header, depending on the radio button you select in the Column Headers area.
@@
@cMsgScreenSensitiveHelpVoiceAliasListView
This list contains all of the defined voice aliases.
Included are the alias name, the "person" or voice that is used to announce it, the voice pitch and voice rate.
@@
; Help messages for Skim Reading dialog
@cMsgScreenSensitiveHelpUseRuleTypeRadioButtons
Use the UP and DOWN ARROW keys to select the skim reading mode you want to use.

If you select Read First Line of Paragraph, %product% reads the first line of each paragraph when you use skim reading. This is the default setting.

If you select Read First Sentence of Paragraph, %product% reads the first sentence of each paragraph when you use skim reading.

If you select Text Rules Apply for Reading, %product% searches for text according to a text rule that you define. %product% then reads the line, sentence, or paragraph
containing the matching text, depending on the option you have selected in the Speak Unit list.

If you select Attributes and Color Rules Apply for Reading, %product% searches for text according to the selected text color and attributes.  The selections made are cumulative, meaning that if you select bold and red text, %product% will only search for text that is red and bold. If you add the italic attribute, then %product% will only search for text that is red, bold, and italic. Any text that lacks any of these attributes or color is ignored by %product%.
@@
@cMsgScreenSensitiveHelpAddRulesButton
Choose the Add Rules button to create a new text rule. For information on creating a logical expression for a text rule and some examples, refer to the %product% Help system.
@@
@cMsgScreenSensitiveHelpModifyRuleButton
If you want to change or rename a text rule, select it in the Text Rules list and then choose this button. You can then change the text that the rule searches for or type a new name.
@@
@cMsgScreenSensitiveHelpDeleteRuleButton
To delete a text rule, select it in the Text Rules list and then choose the Delete Rule button.
@@
@cMsgScreenSensitiveHelpDeleteAllRulesButton
To delete all your saved text rules, choose the Delete All Rules button.
@@
@cMsgScreenSensitiveHelpSkimReadingIndicationChkBox
If you select this check box, %product% notifies you when skimming past units of text that do not match the currently selected text rule.
%product% beeps once for every 20 units that it skips.
@@
@cMsgScreenSensitiveHelpTextRulesComboBox
This combo box allows you to create a new text reading rule or select an existing text reading rule. Text rules are logical expressions that tell %product% to search for specific text when skim reading. %product% then reads the line, sentence, or paragraph that contains the matching text, depending on the option you have selected in the Speak Unit list. You must select either the Text Rules Apply for Reading radio button or the Attributes and Color Rules Apply for Reading radio button if you want to use text rules while skim reading.

If you are creating a new text rule, select <New> from the combo box and then enter the appropriate search pattern, color or attribute rules, or speak unit rules. Once the rule is configured, press the Start Skim Reading button or the Create Summary button to save and start the new skim reading rule.

<New> is the default setting for this combo box.
@@
@cMsgScreenSensitiveHelpSpeakUnitComboBox
Select whether %product% should read the paragraph, sentence, or line containing any text that matches the currently selected text rule.
@@
@MsgScreenSensitiveHelpTextSearchPattern_L
Use this edit box to create a new text rule. You can then enter a plain text search for a word or phrase that you want %product% to find while skim reading. Optionally, you can use a logical, or regular, expression to further refine your search. Note: When using a regular expression for a search pattern, you must select the Use Regular Expression check box that appears in the Skim Reading dialog.

There are many different ways to create these expressions. If you only want to search for text units that contain two or more words, separate each word with ".*" (be sure not to include any spaces between words). For example, you can use the following expression to search for text units containing both the words "JAWS" and "MAGic":

JAWS.*MAGic

If you want to search for text units that contain any of several different words, separate each word with "|" (be sure not to include any spaces between words). For example, you can use the following expression to search for text units containing either the words "JAWS" or "MAGic":

JAWS|MAGic

You can create more advanced expressions as well. For example, you can use the following expression to search for text units containing any year starting with "19":
19\d{2}\s.
@@
@MsgScreenSensitiveHelpRuleName_L
The name for the skim reading rule appears in this edit box. As you type information into the Text Search Pattern edit box, the same information appears for the rule name. If you would like to further describe the name, place your cursor into the edit box and type additional descriptive text.
@@
@cMsgScreenSensitiveHelpUseRegularExpressionCheckBox_L
A regular expression is a search string that uses special characters to help you define the search and match text patterns. This feature is used primarily by advanced users. Do not select this check box if you are simply performing a plain text search. This check box is unchecked by default.
@@
@cMsgScreenSensitiveHelpTextColorCombo_L
Use this combo box to select or enter a specific color that a passage of text uses. You can use the UP and DOWN ARROWS to cycle through a list of text colors, or you can type a color into the combo box. %product% uses word prediction to predict the color that you want. An asterisk appears as the default setting.
@@
@cMsgScreenSensitiveHelpBackgroundColorCombo_L
Use this combo box to select a background color to be used for the skim reading rule. You can use the UP and DOWN ARROWS to cycle through a list of text colors, or you can type a color into the combo box. %product% uses word prediction to predict the color that you want. An asterisk appears as the default setting.
@@
@cMsgScreenSensitiveHelpBoldCheckBox_L
Select this check box to search for bold text in the document or Web page. The bold attribute can be used in conjunction with any other text attribute. This check box, which is unchecked by default, is only available when the Attributes and Color Rules Apply for Reading radio button is selected.
@@
@cMsgScreenSensitiveHelpItalicCheckBox_L
Select this check box to search for italic text in the document or Web page. The italic attribute can be used in conjunction with any other text attribute. This check box, which is unchecked by default, is only available when the Attributes and Color Rules Apply for Reading radio button is selected.
@@
@cMsgScreenSensitiveHelpUnderlineCheckBox_L
Select this check box to search for underlined text in the document or Web page. The underlined attribute can be used in conjunction with any other text attribute. This check box, which is unchecked by default, is only available when the Attributes and Color Rules Apply for Reading radio button is selected.
@@
@cMsgScreenSensitiveHelpStrikeoutCheckBox_L
Select this check box to search for strikethrough text in the document or Web page. This attribute can be used in conjunction with any other text attribute. This check box, which is unchecked by default, is only available when the Attributes and Color Rules Apply for Reading radio button is selected.
@@
@cMsgScreenSensitiveHelpDoubleStrikeoutCheckBox_L
Select this check box to search for double strikethrough text in the document or Web page. This attribute can be used in conjunction with any other text attribute. This check box, which is unchecked by default, is only available when the Attributes and Color Rules Apply for Reading radio button is selected.
@@
@cMsgScreenSensitiveHelpSuperScriptCheckBox_L
Select this check box to search for superscript text in the document or Web page. This attribute can be used in conjunction with any other text attribute. This check box, which is unchecked by default, is only available when the Attributes and Color Rules Apply for Reading radio button is selected.
@@
@cMsgScreenSensitiveHelpSubScriptCheckBox_L
Select this check box to search for subscript text in the document or Web page. The subscript attribute can be used in conjunction with any other text attribute. This check box, which is unchecked by default, is only available when the Attributes and Color Rules Apply for Reading radio button is selected.
@@
@cMsgScreenSensitiveHelpShadowCheckBox_L
Select this check box to search for shadow text in the document or Web page. The shadow attribute can be used in conjunction with any other text attribute. This check box, which is unchecked by default, is only available when the Attributes and Color Rules Apply for Reading radio button is selected.
@@
@cMsgScreenSensitiveHelpOutlineCheckBox_L
Select this check box to search for outline text in the document or Web page. The outline attribute can be used in conjunction with any other text attribute. This check box, which is unchecked by default, is only available when the Attributes and Color Rules Apply for Reading radio button is selected.
@@
; help messages for Add Rules Dialog
@cMsgScreenSensitiveHelpTextRuleEdit
In the Text Rule edit box, enter a word or phrase that you want %product% to search for while skim reading.
Optionally, you can use a logical expression to further refine your search.
There are many different ways to create these logical expressions. If you only want to search for text units that contain two or more words, separate each word with ".*" (be sure not to include any spaces between words).
For example, you can use the following expression to search for text units containing both the words "JAWS" and "MAGic":

JAWS.*MAGic

If you want to search for text units that contain one of several different words, separate each word with "|" (be sure not to include any spaces between words).
For example, you can use the following expression to search for text units containing either the words "JAWS" or "MAGic":

JAWS|MAGic

You can create more advanced expressions as well. For example, you can use the following expression to search for text units containing any year starting with "19":

19\d{2}\s
@@
@cMsgScreenSensitiveHelpRuleNameEdit
In the Rule Name edit box, type a name for this text rule.
@@
@cMsgScreenSensitiveHelpSkimReadingHelpBtn
Use this button to read more detailed help on using the Skim Reading feature.
@@
@cMsgScreenSensitiveHelpStartSkimReadBtn
Choose this button to save your changes and begin skim reading from your current location.
@@
@cMsgScreenSensitiveHelpSummarizeSkimReadBtn
Choose this button to display a summary of the current page in the Virtual Viewer.
This summary contains all the text you would hear if you began skim reading from your present location using your currently selected options.
You can review the summary in the Virtual Viewer using the standard %product% reading commands. Each segment of text in the summary is also a link.
You can press ENTER to move to the current segment's location within the document. To review this summary in the Virtual Buffer at any time, press WINDOWS Key+INSERT+DOWN ARROW.
The summary remains available until you create another summary or quit %product%.

If you specified a text rule, only lines, sentences, or paragraphs that match your criteria are included in the summary.
The number of text rule matches found appears at the bottom of the Virtual Viewer.
@@
@cMsgCloseSkimReadBtn
Choose this button to close the dialog box without saving the last changes made.
@@
; help messages for the JAWS Find dialog:
@cMsgScreenSensitiveHelpFindWhatEditCombo_L
Enter a word or phrase that you want to search for using the Find dialog. This edit combo box maintains a history of the last 20 entries. It will always default to the last entry.
Note: The Find what edit combo box only keeps an entry history if the Maintain History of Recent Finds check box is selected.
@@
@cMsgScreenSensitiveHelpContextSpecificHistoryCheckBox_L
This check box controls whether or not the Find history is context specific for the current site. The check box is selected by default.
@@
@cMsgScreenSensitiveHelpMainTainHistoryCheckBox_L
This check box controls whether or not a history of the last 20 entries is maintained in the Find what edit combo box. The check box is selected by default.
@@
@cMsgScreenSensitiveHelpDirectionForwardRadioButton_L
Select this radio button to search forward in a document or Web page and find the next instance of the word or phrase. Forward is the default setting.
@@
@cMsgScreenSensitiveHelpDirectionBackwardRadioButton_L
Select this radio button to move backwards through a document or Web page to find the next instance of a word or phrase.
@@
@cMsgScreenSensitiveHelpIgnoreCaseCheckBox_L
When this check box is selected, %product% Find overlooks whether or not the word or phrase is entered using uppercase, lowercase, or mixed case spelling. The %product% Find will find all instances of the word regardless of case. This check box is selected by default.
When unchecked, %product% Find will match the word or phrase's case as it appears in the Find what edit combo box.
@@
@cMsgScreenSensitiveHelpFindButton_L
Press the Find button to start the %product% Find search.
@@
@cMsgScreenSensitiveHelpDeleteButton_L
Press the Delete button to remove text from the Find what combo edit box.
@@
@cMsgScreenSensitiveHelpClearFindHistoryButton_L
Press this button to remove all entries that appear in the Find what combo edit box.
@@
@cMsgScreenSensitiveHelpCancelFindButton_L
Press this button to cancel the search and close the %product% Find dialog.
@@
@cmsgScreenSensitiveHelpJAWSOptionsTreeView
This tree view contains groups of %product% options.
Press tab to read the help text for the selected item.
@@
@cmsgScreenSensitiveHelpJAWSOptionsCheckBox
The Expand Tree View check box lets you expand or collapse the tree view. The tree view is expanded by default. To collapse it, use the SPACEBAR to uncheck this check box. Changes to the check box setting take effect immediately while the Adjust %product% Options dialog box is open. The advantage of having the tree view expanded is to make first letter navigation work easier. The advantage of having it collapsed is that you can navigate by main group headings.

Note: You may also navigate through the tree view using the RIGHT ARROW and LEFT ARROW keys to expand and collapse groups. Use the UP ARROW and DOWN ARROW keys to move up and down in the tree.
@@
@cmsgScreenSensitiveHelpQuickSettingsCheckBox
The Expand Tree View check box lets you expand or collapse the tree view. The tree view is expanded by default. To collapse it, use the SPACEBAR to uncheck this check box. Changes to the check box setting take effect immediately while the QuickSettings dialog box is open. The advantage of having the tree view expanded is to make first letter navigation work easier. The advantage of having it collapsed is that you can navigate by main group headings.

Note: You may also navigate through the tree view using the RIGHT ARROW and LEFT ARROW keys to expand and collapse groups. Use the UP ARROW and DOWN ARROW keys to move up and down in the tree.
@@
@cmsgScreenSensitiveHelpJAWSOptionsReadOnlyEdit
The Read-only Text Area contains a description of the current %product% option selected in the above tree view. Use Standard %product% reading commands to navigate and read this text.
@@
@cmsgScreenSensitiveHelpJAWSOptionsCloseButton
The Close button saves any changes made to %product% options and closes the Adjust %product% Options dialog box. Press the SPACEBAR to activate this button.
@@
@cmsgScreenSensitiveHelpJAWSOptionsExecuteButton
The Execute button lets you cycle through and select the values available for the %product% option currently selected in the tree view. This functionality is the same as pressing the SPACEBAR while the option is highlighted in the tree view. To activate the Execute button, press the SPACEBAR.
@@
@cmsgScreenSensitiveHelpResearchItDialogOKButton
The OK button conducts the research using the selected Research It item in the list.
@@
@cmsgScreenSensitiveHelpResearchItDialogCancelButton
The cancel button exits the Research It dialog.
@@
;For new LRL_Dialog, 11.0.Update1 and later
@cmsgResearchItWordOrPhraseEditCombo
Enter a word or phrase that will be passed to the selected Research It lookup source.  This edit combo box maintains a history of the last 20 entries.  It will always default to the last entry.  Note:  The Word or Phrase edit combo box only keeps an entry history if the "Maintain Word or Phrase History" check box is checked.
@@
@cmsgResearchItLookupSourcesList
This list contains the possible options you currently have available with the Research It tool.
The primary item in the list is the item that will be activated automatically if you just press %keyFor(ResearchItDefaultLookup).
This keystroke lets you avoid entering this dialog if you generally use the same Research It lookup each time.
For look ups such as Wiktionary or Wikipedia, the feature is designed to look up the word at the active cursor.
There are development options available for anyone to create their own custom look ups and add them to their %product%.
Please see the Help for more information.
@@
@cmsgResearchItLookupSourceDescription
The Read-only Text Area contains a description of the current lookup source selected in the above list view.  Use Standard %product% reading commands to navigate and read this text.
@@
@cmsgResearchItMaintainHistoryCheckbox
This check box controls whether or not a history of the last 20 entries is maintained in the Word or Phrase edit combo box.  The check box is checked by default.
@@
@cmsgResearchItIgnoreHistoryCaseCheckBox
When this check box is selected, newly entered text replaces any item in the History List that is different only by case.
@@
@cmsgResearchItClearHistoryItem
Press the Clear History Item button to remove text from the Word or Phrase combo edit box.
@@
@cmsgResearchItClearAllHistoryItems
Press the Clear All History Button to remove all entries that appear in the Word or Phrase combo edit box.
@@
@cmsgResearchItOptions
Press this button to dismiss the Research It dialog and open the Research It Options dialog.  The Research It Options dialog is used to enable or disable Research It lookup sources and to select your primary Research It lookup source.
@@
@cmsgOnMouseOverTextCHANGE_L
text changed at line %1
@@
@cmsgOnMouseOverTextCHANGE_S
change at line %1
@@
@cmsgOnMouseOverNoChange_L
Could not detect change in content.
@@
@cmsgOnMouseOverNoChange_S
Couldn't detect change.
@@
@cmsgOnMouseOverElementAttributesChanged_L
    The Current element's attributes have changed.
@@
@cmsgOnMouseOverElementAttributesChanged_S
element's attributes changed.
@@
@cmsgOnMouseOverElementPageTitleChanged_L
The page's title changed
@@
@cmsgOnMouseOverElementPageTitleChanged_S
title changed
@@
@cMsgAnchors
anchors
@@
@cmsgBlockQuotes
block quotes
@@
@cMsgDivisions
divisions
@@
@cMsgGraphics
graphics
@@
@cMsgLists
lists
@@
@cMsgListItems
list items
@@
@cMsgObjects
objects
@@
@cMsgParagraphs
paragraphs
@@
@cmsgOtherControls
Selectable Aria controls, ComboBoxes, lists or TreeViews
@@
@cmsgCustomLabelError_L
A Custom Label cannot be created for this item.
@@
@cmsgCustomLabelError_S
Cannot create Custom Label for item
@@
@cmsgDeleteLabelErrorMsg_L
There is no Custom Label to delete for this item.
@@
@cmsgDeleteLabelErrorMsg_S
No Custom Label to delete
@@
@cmsgSkimReadMoveToMatch
Move to match %1
@@
@cmsgSkimReadSummary
SkimRead Summary
@@
@cmsgSkimReadingResults
Skim Reading Results
@@
@cmsgNoSkimReadSummary_L
No SkimRead Summary available.
@@
@cmsgNoSkimReadSummary_S
No SkimRead summary
@@
@cmsgTypeKeysModeEnabled_l
Typing mode enabled
@@
@cmsgTypeKeysModeEnabled_s
enabled
@@
@cmsgTypeKeysModeDisabled_l
Typing Mode disabled
@@
@cmsgTypeKeysModeDisabled_s
disabled
@@
@cmsgTypeKeysModeNotSet_l
Typing Mode could not be toggled
@@
@cmsgTypeKeysModeNotSet_s
not toggled
@@
;for announcing the capslock toggle:
@mscCapsLockOn_L
Caps lock on
@@
@mscCapsLockOff_L
Caps lock off
@@
@cmsgScrollLockOn_L
ScrollLock on
@@
@cmsgScrollLockOff_L
ScrollLock off
@@
@cmsgRefreshScripts
Scripts Initialized
@@
;For Style Sheet Processing
@cmsgStyleSheetsIgnore
Ignore all
@@
@cmsgStyleSheetsTopLevel
Top Level Style Sheets
@@
@cmsgStyleSheetsProcessImported
Imported Style Sheets
@@
@cmsgRemoteModeOn_L
PACMate remote mode on
@@
@cmsgOverwriteClipboard
Pressing Control+C or Control+X will overwrite the clipboard. Do you want to continue this operation?
@@
@cmsgOverwriteClipboardName
Overwrite Clipboard
@@
@cmsgCrossingListBoundary_L
new list
@@
@cmsgCrossingListBoundary_S
new list
@@
;for cmsgFormsModeCursorInfo
;%1 is the output from GetActiveCursor, or a simulation of it.
@cmsgFormsModeCursorInfo
Forms Mode %1
@@
;cmsgPCCursorActive must be an exact replica of
;the text returned by GetActiveCursor when the virtual cursor is active
@cmsgPCCursorActive
PC Cursor active
@@
;cmsgVirtualPCCursorActive must be an exact replica of
;the text returned by GetActiveCursor when the virtual cursor is active
@cmsgVirtualPCCursorActive
Virtual PC Cursor active
@@
@cmsgAlert
Alert!
%1
@@
@cmsgNoLastAlert_L
no prior MSAA alert
@@
@cmsgNoLastAlert_S
no alert
@@
@cmsgListTaskTrayIconsError1
Failed to obtain the list of task tray icons
@@
@cmsgControlStateOpened
opened
@@
@cmsgControlStateClosed
closed
@@
@CMSGRoutePCToVirtual_L
Route PC to Virtual Cursor
@@
@CMSGRoutePCToVirtual_S
PC to Virtual
@@
;replaces many duplications of the message
@cmsg_on
On
@@
;replaces many duplications of the message
@cmsg_off
Off
@@
;spoken in script FirstCellInTable
;currently in Word, may later be in other places
@cmsgBeginningOfTable
beginning of table
@@
;spoken in script LastCellInTable
;currently in Word, may later be in other places
@cmsgEndOfTable
last cell in table
@@
;cmsg324_l:
@cmsgTopOfColumn
top of column
@@
;cmsg325_l:
@cmsgBottomOfColumn
bottom of column
@@
;cmsgStartOfRow is spoken by table nav in Word,
;and is just a shorter spoken message in English than the cmsgBeginningOfRow message
@cmsgStartOfRow
start of row
@@
;cmsg326_l:
@cmsgBeginningOfRow
beginning of row
@@
;cmsg327_l:
@cmsgEndOfRow
end of row
@@
; cmsgTableNavErrorTitle is used by MAGic as the error dialog title
; when an error message about table navigation is posted:
@cmsgTableNavErrorTitle
Table Navigation Error
@@
;Error message when user attempts to perform unsupported table navigation or reading,
;such as to start/end of row/column, or SayNext/Prior Row/Column,
;or reading from top or to bottom of column,
;in applications where only limited table reading or navagation is supported:
@cmsgTableNavFeatureNotSupported
This type of table reading or navigation is not supported in this application.
@@
;cmsg320: for msgColumnAndRow, %2 = the column number, %1 =  the row number
@cMSGColumnAndRow
Column %2, Row %1
@@
;cmsg321: for msgColumnRowHeader, %1 = the row header in a table, %2 = the column header
@cMSGColumnRowHeader
%2 %1
@@
;cmsg322_l: for msgColumnHeader, %1 = the column header
@cmsgColumnHeader
Column %1
@@
@cmsgColumnHeaderWithColCount
Column %1 of %2
@@
;cmsg322_s: For cmsgColumnRowCoordinates, %1=Column Coordinates,
;%2=row coordinates
@cmsgColumnRowCoordinates
r%2c%1
@@
;cmsg323: for msgRowHeader, %1 = the row header
@cmsgRowHeader
Row %1
@@
@cmsgRowHeaderWithRowcount
Row %1 of %2
@@
;cmsgColumnCoordinate and cmsgRowCoordinate is for showing the coordinate of only the column or row
;%1 is the numeric coordinate for the column or row
@cmsgColumnCoordinate
c%1
@@
@cmsgRowCoordinate
r%1
@@
;cMSGTableNavNotSupported:
;error message for when table navigation is attempted in application where it is not supported.
@cMSGTableNavNotSupported_L
Table navigation is not supported in this application
@@
@cMSGTableNavNotSupported_S
Table nav not supported
@@
;cmsg314_l:
@cMSGNotInTable_l
Not in a Table
@@
;cmsg314_s:
@cMSGNotInTable_s
Not in table
@@
@cMSG_checked
checked
@@
@cMSG_PartiallyChecked
partially checked
@@
@cmsg_notchecked
not checked
@@
@cmsgSecureConnection
Secure connection
@@
@cmsgSelectedCells_L
selected %1 through %2
@@
@cmsgSpellAlphaNumericDataSpell
Spell
@@
@cmsgSpellAlphaNumericDataSpellPhonetically
Spell phonetically
@@
@cvmsgClickableElements
clickable elements
@@
@cvmsgOnMouseOverElements
onMouseOver elements
@@
@cmsgLoadingSAPI
Loading SAPI 5
@@
;The following message belongs to Windows Vista,
;Start menu list view, as search takes place,
;and as items change, the group to whom they belong should now speak.
;It is also used for group names on the Windows 8 Start screen if verbosity is beginner.
;For cmsgListGroupName, %1 = The group name to which the selected menu item belongs, e.g. All Programs
@cmsgListGroupName
%1 Group
@@
;cmsgRibbonGroupBoxName is used to speak the name of a ribbon group box
;where the group box contains a set of related controls.
;%1 is the name of the group
@cmsgRibbonGroupBoxName
%1 Group Box
@@
;cmsgBrlSearchTermEdit is the fake value for the search term edit box in the start menu,
;of Windows Vista.
;On the display, by default, it is marked with dots 7 and 8 as if it were highlighted.
@cmsgBrlSearchTermEdit
<Enter Search Term>
@@
@cmsgSidebarActive
Side Bar Already Active
@@
@cmsgSidebarInactive_L
The Windows Sidebar is not active.
To start Windows Sidebar, type sidebar with no spaces in the Windows Run dialog.
@@
@cmsgSidebarInactive_S
Windows Sidebar not active.
@@
@cmsgGadgetsGallery
View Available Gadgets
@@
@cmScreenSensitiveHelp_SidebarGallery
Press enter to activate this button and open the Sidebar Gallery, where you can choose the gadgets you wish to have displayed in the side bar.
To move from gadget to gadget, press windows+g.
@@
@cmScreenSensitiveHelp_SidebarGadget
To move into this gadget's mini web page and read content, press tab.
When in the mini web page, use your reading keys to read the text, and press enter to activate links and buttons, or enter forms mode on form controls.
To move from gadget to gadget, press Windows+G.
To view available options for this gadget, press the applications key or shift+f10.
@@

;For cmsgCustomItemsAdd, %1 = the configuration name.
;This is used to build custom items to the TreeCore functions in AdjustJAWSOptions dialog box.
;%1 equals the configuration name, but if the script author chooses, the string is loaded with their own configuration name,
;To be explicitly added to the items for all custom segments
;for the application in question.
;This isn not used in Default, as we have prepended all items with node structure,,
;level0Level1.Level2.etc..item
;Where level0 is first level, etc.
@cmsgCustomItemsAdd
%1 Options
@@
;%1 frame number, %2 frame name
@cmsgFrameLoaded_L
Frame %1
%2
updated
@@
@cmsgFrameLoaded_S
Frame %2 updated
@@
@cmsgNoNameFrameLoaded
Frame %1 updated
@@
@cmsgButtonMenuScreenSensitiveHelp
To navigate through the options in this button menu, press one of the following: Enter, Spacebar, or DownArrow. To close the menu after making a selection, press Enter.
@@
;for cmsgToolBarButtonItem
;%1 is the name of the item
;%2 is the state if the item has a special state, such as disabled
@cmsgToolBarItem
%1 (%2)
@@
@cmsgInFSVoiceSettingsDialogBox_L
A voice settings dialog box is currently active
@@
@cmsgInFSVoiceSettingsDialogBox_S
In voice settings dialog box
@@
@cmsgNoRegionsOnPage
No regions were found on the page
@@
@cMsgRegion
 Region
@@
@cMsgRegions
 Regions
@@
@cmsgRegionsOnPage1_l
There is 1 region.
@@
@cmsgRegionsOnPage_L
there are %1 regions.
@@
@cMsgApplicationRegion
 Application
@@
@cMsgApplicationRegions
 Applications
@@
@cmsgNoDropTargetsOnPage
No droppable elements were found on the page
@@
; the following strings are used for formatting when there are multiple items to be spoken in a list
@cmsgFormatList1
%1
@@
@cmsgFormatList2
%1 and %2
@@
@cmsgFormatList3
%1, %2 and %3
@@
@cmsgFormatList4
%1, %2, %3 and %4
@@
@cmsgFormatList5
%1, %2, %3, %4 and %5
@@
@cmsgFormatList6
%1, %2, %3, %4, %5 and %6
@@
@cmsgFormatList7
%1, %2, %3, %4, %5, %6 and %7
@@
@cmsgFormatList8
%1, %2, %3, %4, %5, %6, %7 and %8
@@
@cmsgNoVoiceProfilesInRemoteJAWSSession_l
Voice profiles are not available when %product% is running in a remote session
@@
@cmsgNoVoiceProfilesInRemoteJAWSSession_s
Voice profiles not available in a remote session
@@
@sshcmsg_LinksList_LinksList
This list contains the links found on the current page.  Use Up Arrow, Down Arrow, or the link's first letter to move to a particular link.  Press enter to activate the selected link and move to the new page.
For other options regarding this list, press tab.
@@
@sshcmsg_LinksList_MoveToLinkButton
Choosing this button will move you to the selected link without activating the link.
@@
@sshcmsg_LinksList_ActivateLinkButton
Choosing this button will activate the selected link and take you to the new page.
@@
@sshcmsg_LinksList_CancelButton
Choosing this button will close links list and return you to the current page.
@@
@sshcmsg_LinksList_SortLinks
These choices change the order that links appear in the links list.
@@
@sshcmsg_LinksList_DisplayLinks
These choices determine which links from the current page will be displayed in the list.
@@
;for cmsgSynthJCFGlobalSectionName
;%1 is the name of the synthesizer as it appears in default.jcf section names
@cmsgSynthJCFGlobalSectionName
%1-GlobalContext
@@
@cmsg_TandemConnected
Tandem connection opened
@@
@cmsg_TandemDisconnectedFromTarget
Connection to target computer closed
@@
@cmsg_TandemDisconnectedFromController
Connection to controlling computer closed
@@
@cmsgTandemSuspended
Tandem suspended
@@
@cmsgTandemResumed
Tandem resumed
@@
@cmsgPauseTandemVideoUnavailable
This feature is only available from the %product% tandem controller window.
@@
@cmsgToggleTandemModeUnavailable
This feature is only available on the controlling computer during a %product% tandem session.
@@
@cmsgSelectAVoiceProfileUnavailableDuringTandem
Selecting a voice profile is not available while a tandem session is open.
@@
@cmsgTandemNotInstalled
The %product% Tandem feature is not currently installed.
@@
@cmsgApplicationModeOn_L
Application Mode on
@@
@cmsgApplicationModeOff_L
Application Mode off
@@
@cmsgClose
Close
@@
@cmsgFocusLoss
Lost focus
@@
@cmsgFocusLossTutor
Press ALT Tab
@@
@cmsgBrlLostFocus
Lost focus. Press ALT+Tab.
@@
@cmsgNoWordList
No word list has been created.
To create the word list, press %Keyfor(WordList).
@@
@cmsgNoNextWord_L
no next word found
@@
@cmsgNoNextWord_S
no next word
@@
@cmsgNoPriorWord_L
no prior word found
@@
@cmsgNoPriorWord_S
no prior word
@@
@cmsgEmbeddedDocument
Embedded document
@@
@cmsgOutOfEmbeddedDocument
Leaving embedded document
@@
@cmsgPrimaryLookupNotFound
Primary Lookup Module not found.
@@
@cmsgLookupNotFound
Lookup module not found.
@@
;for cmsgQueryError and cmsgQueryTimedOut, %1 = rule set (friendly name), and %2 = search term (usually word under cursor or selected text)
@cmsgQueryError
%1 searched for %2 and got no results.
@@
@cmsgQueryTimedOut
%1 timed out while searching for %2.
@@
@cmsgTitleTemplate
%1 - Research It! Results
@@

;for cmsgResearchItDebugErrorNumber, %1 = raw int of error ncode.
@cmsgResearchItDebugErrorNumber
Error code: %1
@@
@cmsgResearchItDebugSuccess
Your rule set ran successfully.
@@
@cmsgResearchItDebugInsufficientBuffer
Insufficient buffer
@@
@cmsgResearchItDebugRulesetNotFound
Rule set not found.
@@
@cmsgResearchItDebugRequestFailed
Search request failed.
@@
@cmsgResearchItDebugNoResults
Search returned no results.
@@
@cmsgResearchItDebugRequestTimeOut
Request timed out.
@@
@cmsgPunctuationNone
None
@@
@cmsgScreenEchoNone
None
@@
;for cmsgPercentage,
;%1 is the percentage number
@cmsgPercentage
%1 percent
@@
;cmsgUnknownPercentage is used where percentage cannot be obtained
@cmsgUnknownPercentage
Percentage unknown
@@
;cmsgPrimaryLookup is for the Research It dialogs example in insert f2, the primary item.
;even though the dialog contains a space before this string, that is added by the functions.
@cmsgPrimaryLookup
(primary)
@@
; for cmsgKeyboardEchoOn and cmsgKeyboardEchoOff, the string is changed to say 'Typing Echo',
;in compliance with MAGic 12 and later where it has been renamed Typing Echo.
;The constant name remains the same for consistency and retro-compatibility.
@cmsgKeyboardEchoOn
Typing echo on
@@
@cmsgKeyboardEchoOff
Typing echo off
@@
@cmsgLockedKeyboard_L
Locked keyboard
@@
@cmsgLockedKeyboard_S
Locked
@@
@cmsgUnlockedKeyboard_L
Unlocked keyboard
@@
@cmsgUnlockedKeyboard_S
Unlocked
@@
@cmsgLockedKeyboardHelp_L
To unlock the keyboard, press %KeyFor(LockKeyboard)
@@
@cmsgLockedKeyboardHelp_S
To unlock, press %KeyFor(LockKeyboard)
@@
;for cmsgBrailleStatusLockedKeyboard
;and for cmsgBrailleStatusTouchNavigation
;the messages contain leading 0's, which will be stripped if not needed. Do not remove the 0's for localization.
;%1 is the number of the current line, without any leading 0's, and should not be localized.
;l is the character which denotes the lock, and may be localized.
;t is the character which denotes the touch cursor is active, and may be localized.
@cmsgBrailleStatusLockedKeyboard
000%1l
@@
@cmsgBrailleStatusTouchNavigation
000%1t
@@
;For the Text Analyser feature
@cmsgInconsistencyCount
%1 errors
@@
@CMSGMismatchedSymbolPairUnopened_L
Unopened %1 at column %2
@@
@cmsgMismatchedSymbolPairUnclosed_L
Unclosed %1 at column %2
@@
@cmsgStrayPunctuationSymbol_L
Stray punctuation %1 at column %2
@@
@cmsgUnspacedPunctuationSymbol_L
Unspaced punctuation %1 at column %2
@@
@cmsgWhitespaceRun_L
Space run at column %2
@@
@cmsgFontChange_L
Font change at column %2
@@
@cmsgMissingInitialCapital_L
Missing initial cap %1 at column %2
@@
@cmsgInvertedCaps_L
Inverted cap %1 at column %2
@@
@CMSGMismatchedSymbolPairUnopened_S
Unopened %1 at %2
@@
@cmsgMismatchedSymbolPairUnclosed_S
Unclosed %1 at %2
@@
@cmsgStrayPunctuationSymbol_S
Stray punctuation %1 at %2
@@
@cmsgUnspacedPunctuationSymbol_S
Unspaced punctuation %1 at %2
@@
@cmsgWhitespaceRun_S
Space run at %2
@@
@cmsgFontChange_S
Font change at %1
@@
@cmsgMissingInitialCapital_S
initial cap %1 at %2
@@
@cmsgInvertedCaps_S
Inverted cap %1 at %2
@@
;cmsgFontChangeDetails is used when navigating to a font change with Text Analyzer and details will be reported about what specifically changed.
;%1 is the details of the font change: name, point, attribute, color, background
@cmsgFontChangeDetails
Font change
%1
@@
;cmsgFontAttrib_Off and cmsgFontAttrib_On is used in cmsgFontChangeDetails if there was an attribute change
;%1 is one of the attribute messages, such as cmsg139_L, cmsg140_L, cmsg141_L, etc.
@cmsgFontAttrib_Off
%1 off
@@
@cmsgFontAttrib_On
%1 on
@@
;cmsgFontPoints is used in cmsgFontChangeDetails if there was a point change
;%1 is the point size
@cmsgFontPoints
%1 points
@@
@cmsgNoNextInconsistency_L
No more inconsistencies in document.
@@
@cmsgNoNextInconsistency_S
No more inconsistencies
@@
@cmsgNoPriorInconsistency_L
No prior inconsistency in document.
@@
@cmsgNoPriorInconsistency_S
No prior inconsistency
@@
@cmsgNoInconsistency_L
No inconsistencies detected.
@@
@cmsgNoInconsistency_S
No inconsistencies
@@
;for cmsgTextAnalyzerOn_l/s, %1 is the manner in which inconsistencies will be detected.
@cmsgTextAnalyzerOn_l
The Text Analyzer will %1.
@@
@cmsgTextAnalyzerOff_l
The Text Analyzer is off.
@@
@cmsgTextAnalyzerOn_s
Text Analyzer will %1
@@
@cmsgTextAnalyzerOff_s
Text Analyzer off
@@
@cmsgTextAnalyzerNotValid_l
Checking for text inconsistencies is not valid here.
@@
@cmsgTextAnalyzerNotValid_s
checking for text inconsistencies not valid here
@@
@cmsgTextAnalyzerDescribeAllInconsistencies
describe all inconsistencies
@@
@cmsgVirtualRibbonsActive
Virtual Ribbons
@@
@cmsg_column
Column %1
@@
@cmsg_row
Row %1
@@
@cmsgEnteringTable
Entering Table with %1 Columns and %2 Rows
@@
@cmsgLeavingTable
Leaving Table
@@
;cmsgScreenSensitiveHelpForVirtualRibbon_IntoParagraph is inserted into messages
;cmsgScreenSensitiveHelpForVirtualUpperRibbon and cmsgScreenSensitiveHelpForVirtualLowerRibbon
@cmsgScreenSensitiveHelpForVirtualRibbon_IntoParagraph
The Virtual Ribbon Menu provides predictable navigation, lets you see everything in the Ribbon, and offers consistency when navigating with ARROW Keys.  It is off by default and can be switched on or off from within Settings Center. When the Virtual Ribbon Menu is on, the Ribbon is navigated using a traditional menu and submenu format familiar to most %product% users.
@@
;cmsgScreenSensitiveHelpForVirtualRibbon_LegacyMode is inserted into messages
;cmsgScreenSensitiveHelpForVirtualUpperRibbon and cmsgScreenSensitiveHelpForVirtualLowerRibbon
@cmsgScreenSensitiveHelpForVirtualRibbon_LegacyMode
If a keystroke sequence that uses ALT combined with a letter to invoke a command is available for an application, %product% uses that keystroke; and the Virtual Ribbon Menu does not appear.
@@
;for cmsgScreenSensitiveHelpForVirtualUpperRibbon,
;%1 is cmsgScreenSensitiveHelpForVirtualRibbon_IntoParagraph
;%2 is cmsgScreenSensitiveHelpForVirtualRibbon_LegacyMode
@cmsgScreenSensitiveHelpForVirtualUpperRibbon
You are in the virtual ribbon menu, on the upper ribbon.

%1

To move between tabs on the upper ribbon, use Left or Right Arrow.
To move to the lower ribbon of the current tab, use Down Arrow.
To leave the upper ribbon and return to the document, use Escape or Alt.

%2
@@
;for cmsgScreenSensitiveHelpForVirtualLowerRibbon,
;%1 is cmsgScreenSensitiveHelpForVirtualUpperRibbon_IntoParagraph
;%2 is cmsgScreenSensitiveHelpForVirtualRibbon_LegacyMode
@cmsgScreenSensitiveHelpForVirtualLowerRibbon
You are in the virtual ribbon menu, on a lower ribbon.

%1

To navigate through the items on this menu, use Up or Down arrow.
To move to a submenu, use Enter or Right Arrow.
To move up one level in the virtual ribbon menus, 	use Escape or Left Arrow.

First-letter navigation is available in the lower ribbon of virtual ribbon menus, and moves to items starting with the letter pressed.
If only one item exists starting with the letter pressed, the item is activated and the virtual ribbon menu is dismissed; otherwise, items starting with the letter pressed will be moved to but not activated.
If no items exist starting with the letter pressed, no action is taken.

The following navigation is also available from within submenus:
To Move to the first submenu, use Shift+Home.
To move to the last submenu, use Shift+End.
To move to the prior submenu, use Shift+Left Arrow.
To move to the next submenu, use Shift+Right Arrow.

To leave the lower ribbon and return directly to the document, use Alt.
Pressing Alt from the document will return to the last location in the virtual ribbon menus.

Forms mode is used to activate edit and edit combos. Use Enter or Numpad Slash to activate forms mode, and Escape or PCCursor to exit.

%2
@@
;cmsgBrl_describedby is the same message as found in the describedby key of the HTML Attribute Behavior Table of classic.smf
@cmsgBrl_describedby
Use JawsKey+Alt+R to read descriptive text
@@
;all of the following battery status string are for laptop battery status
;note that several messages may be combined, one per line,
;such as AC status, level, percentage, and time remaining.
@cmsgBatteryStatus_PercentageUnknown
Battery percentage status unknown
@@
;for cmsgBatteryStatus
;%1 is the percentage of the battery
@cmsgBatteryStatus_percentage
Battery %1 percent
@@
@cmsgBatteryStatus_ChargeNoSystemBattery
No system battery
@@
@cmsgBatteryStatus_ChargeUnknown
Battery charge unknown
@@
@cmsgBatteryStatus_ChargeHigh
Battery level: high
@@
@cmsgBatteryStatus_ChargeLow
Battery level: low
@@
@cmsgBatteryStatus_ChargeCritical
Battery level: critical
@@
@cmsgBatteryStatus_ChargeCharging
Recharging battery
@@
@cmsgBatteryStatus_PowerACUnknown
AC status unknown
@@
@cmsgBatteryStatus_PowerACOnline
AC connected
@@
;for cmsgBatteryStatus_TimeRemaining,
;%1 is the time remaining in localized format
@cmsgBatteryStatus_TimeRemaining
Time remaining: %1
@@
@cmsgDumpingOSM
Dumping OSM
@@

@cmsgPleaseWait
Please wait
@@
;cmsgDocumentLoading, message for the user
;if SayAll was attempted before the document is finished loading:
@cmsgDocumentLoading
Document loading...
@@
; cmsgToggleKeyOn and cmsgToggleKeyOff are spoken
; when the scripts handle the speaking of capslock or scroll lock toggle.
; NumLock toggle is spoken internally by both JAWS and MAGic, both when running separately or together.
; CapsLock toggle is spoken internally by JAWS when MAGic is not running.
; ScrollLock toggle is spoken internally by MAGic when JAWS is not running.
; %1 is the key name.
@cmsgToggleKeyOn
%1 on
@@
@cmsgToggleKeyOff
%1 off
@@
; For cMsgNoLanguages, this is the list of languages available.
@cMsgNoLanguages
There are no additional languages installed for your synthesizer.
@@

;UNUSED_VARIABLES

; for DragAndDrop
;for msg170, %1 = the current script key name
@cmsg170_L
 To drag and drop, place the JAWS or PC cursor in the drop location and press %1.

@@
;for cmsgMultipartListItem, translators may not wish to localize.
;This is to specify which item goes on what side of the dash:
;Se Live Resource Lookup.jss, where we put the rule set, the dash and then the module name associated with it.
;Conversesely, Script developers should not use this resource string to format data that would otherwise be localized.
@cmsgMultipartListItem
%1 - %2
@@
@cMsgPromptExit
If the prompt is still incorrect, press this keystroke again to enter a new prompt.
@@
@cMsgPromptExitName
Information
@@
@cmsgbrl
@@
@cmsg1_L
End
@@
@cmsg2_L
Home
@@
@cmsg12_S
Beginner
@@
@cmsg13_S
Intermediate
@@
@cmsg14_S
Advanced
@@
@cmsg15_L
None
@@
;for msg35, %1 = the window text of the real window
@cmsg35_L
application window equals %1
@@
@cmsgCloseCalendar_L
Close calendar
@@
@cmsg46_L
Menu bar
@@
@cmsg47_L
Menu active
@@
@cmsg47_S
active
@@
@cmsg65_L
Found
@@
@cmsgTEKeys_L
Keys
@@
@cmsgTEKeysAndChars_L
Both Keys and Characters
@@
@cmsgTEKeysAndChars_S
Keys and Characters
@@
@cmsg102_L
you can type in a path and file name then enter or
@@
@cmsg103_L
You can Tab through the controls or jump using the following Windows hot keys
@@
@cmsg104_L
For the list of disk drives, use Alt V then type the drive letter
@@
@cmsg105_L
To select the path use Alt D for the directories list box
@@
@cmsg106_L
Now type the first letter for each directory or subdirectory
@@
@cmsg107_L
To choose the type of files you are looking for, Use Alt T
@@
@cmsg108_L
Now arrow through the list to find your choice
@@
@cmsg109_L
Use Alt N to return to File Name edit box and type in a name or tab to list box
@@
@cmsg110_L
Now you can type the first letter of the file you want and then enter
@@
@cmsg111_L
Use escape to cancel
@@
@cmsg112_L
type in a path and file name then enter or
@@
@cmsg113_L
To choose the file type you would like to save it as, Use Alt T
@@
@cmsg114_L
Use the down arrow and find your choice
@@
@cmsg115_L
Use Alt N to return to File Name edit box and type in a name
@@
@cmsg116_L
Tab through the controls to make selections or use the following Windows keys
@@
@cmsg117_L
To select Default printer use ALT+D
@@
@cmsg117_S
select Default printer, ALT+D
@@
@cmsg118_L
To select specific printer use ALT+P
@@
@cmsg118_S
select specific printer, ALT+P
@@
@cmsg119_L
select Paper size, ALT+Z
@@
@cmsg119_S
select Paper size, ALT+Z
@@
@cmsg120_L
To select Paper source use ALT+S
@@
@cmsg120_S
select Paper source, ALT+S
@@
@cmsg121_L
Printing Portrait use ALT+R
@@
@cmsg122_L
Printing Landscape use ALT+L
@@
@cmsg123_L
For other printing options use ALT+O
@@
@cmsg125_L
next attribute not found
@@
@cmsg126_L
prior attribute not found
@@
@cmsg127_L
First Attribute not found
@@
@cmsg128_L
Last Attribute not found
@@
@cmsg128_S
not found
@@
@cmsg129_L
Message box not available for Focus or Control ID
@@
@cmsg129_S
not available for Focus or Control ID
@@
@cmsg130_L
Child window not found
@@
@cmsg131_L
Parent window not found
@@
@cmsg132_L
focus
@@
@cmsg133_L
say type and text
@@
@cmsg133_S
type and text
@@
@cmsg134_L
control i d
@@
@cmsg134_S
control
@@
@cmsg135_L
Class
@@
@cmsg136_L
Type
@@
@cmsg137_L
Sub type code
@@
@cmsg137_S
Sub type
@@
@cmsg138_L
Real name
@@
@cmsgAppStart1_L
For screen sensitive help, press %KeyFor(ScreenSensitiveHelp).
@@
@cmsgAppStart1_S
For Screen Sensitive Help, press %KeyFor(ScreenSensitiveHelp).
@@
@cmsg156_L
8 pixels per space
@@
@cmsg156_S
8 pixels
@@
@cmsg157_L
Unlimitted pixels per space
@@
@cmsg157_S
Unlimitted
@@
@cmsg175_S
This is a DOS window.
@@
;for msg176, %1= the global mouse pixel setting
@cmsg176_L
Mouse Pixel setting is %1
@@
@cmsg176_S
Mouse Pixel = %1
@@
@cmsg178_L
the left mouse button is locked
@@
@cmsg178_S
left mouse button locked
@@
@cmsg179_L
the right mouse button  is locked
@@
@cmsg179_S
right mouse button  locked
@@
@cmsg180_L
unknown script call to:

@@
@cmsg181_L
unknown function call to:

@@
@cmsg182_L
output mode is
@@
@cmsg194_L
Desktop
@@
@cmsg195_L
Task Bar
@@
@cmsg198_S
Can't determine hot keys
@@
@cmsg203_S
Speech Off
@@
@cmsg204_S
Speech On
@@
@cmsg205_L

To choose the item and exit the dialog, press enter
@@
@cmsg206_L

To cancel the dialog, press escape
@@
@cmsg207_L
This is an execute item dialog
@@
@cmsg208_L
Use
@@
@cmsg209_L
 for help specific to each control
@@
@cmsg210_L
to execute the selected item once use ALT+e
@@
@cmsg211_L
to exit this dialog, press enter or escape
@@
@cmsg212_L
this is a select item dialog
@@
@cMsg214_S
%1
Unselected
@@
@cmsg217_L
no next window
@@
@cmsg218_L
no prior window
@@
@cmsg223_L
Braille Verbosity Intermediate
@@
@cmsg224_L
Braille Verbosity Advanced
@@
@cmsg225_L
Braille Verbosity Beginner
@@
@cmsg226_S
None
@@
@cMSG227_S
Labeled
@@
@cmsg228_S
All
@@
;for msgBrailleStruc3, %1 = the checked/unchecked braille symbol, %2 represents the control name
@cmsgBrailleStruc3
%1 %2
@@
;for cMsgBrailleStruc6, %1=control type/name, %2=control value, primarily used for systray and toolbars
@cMsgBrailleStruc6
%1 %2
@@
@cMsgBrlSystray
systray
@@
;for cMsgBrlTasks, %1=task name (used when alt tabbing between tasks to show current task)
@cMsgBrlTasks
tasks: %1
@@
@cmsg245_L
 point
@@
@cmsg246_L
cap
@@
@cMSG248_L
Say All by Line with pauses
@@
@cMSG249_L
Say all by sentence
@@
@cMSG250_L
Say all by Paragraph
@@
@cmsg275_L
 pixels
@@
@cMSG285_L
A script cannot be called from within itself
@@
;For cmsgUnSelecting1_L %1 is the selected item
@cmsgUnselecting1_L
Unselecting
%1
@@
;For cmsgSelecting1_L %1 is the selected item
@cmsgSelecting1_L
Selecting
%1
@@
;for vmsgBrailleStruc1, %1 = the window type in virtual mode, %2 = the checked state of the control
;this is for radio buttons and checkboxes using the virtual cursor
@cvmsgBrailleStruc1
%1 %2
@@
@cVMsgMailtoLink1_L
 Mail to link
@@
@cvmsgImageMapLink1_L
Image Map Link
@@
@cVMsgBitMap1_L
 Graphic
@@
@cVMsgFtpLink1_L
FTP Link
@@
@cmsg295_L
Never include graphical links
@@
@cmsg296_L
include graphical links that have labels
@@
@cmsg297_L
include all graphical links
@@
@cmsg298_L
never include image map links
@@
@cmsg299_L
Include image map links that have labels
@@
@cmsg300_L
Include all image map links
@@
@cmsg301_L
Identify link type enabled
@@
@cmsg302_L
Announce link only
@@
@cmsg303_L
Identify same page links on
@@
@cmsg304_L
Identify same page links off
@@
;for msg305, %1 = the maximum line length
@cmsg305_L
Set To   %1
@@
;for msg306, %1 = the maximum block length
@cmsg306_L
Set To   %1
@@
@cmsg307_L
Give No indication of Frame Change
@@
@cmsg308_L
Say the name of the frame at the beginning and end of each frame
@@
@cmsg308_S
Both beginning and end
@@
@cmsg309_L
Say New Frame at the beginning of each frame
@@
@cmsg309_S
Beginning
@@
@cmsg310_L
Will automatically scroll to display the line on which the VCursor is positioned
@@
@cmsg311_L
Will not scroll to display the line on which the VCursor is positioned
@@
@cmsg312_L
Virtual Cursor Will Skip Text that was repeated when a new page is loaded
@@
@cmsg313_L
Virtual Cursor Will Not Skip Text that was repeated when a new page is loaded
@@
@cmsgDocumentPresentationModeOn_S
On
@@
@cmsg329_L
Speak Screen Text
@@
;for msg331, %1 = the number of lines per HTML page
@cmsg331_L
Lines Per Page Set To %1
@@
@cmsg332_L
All Tables
@@
@cmsg333_L
Data Only
@@
@cmsg334_L
No HTML Graphics
@@
@cmsg335_L
Tagged HTML Graphics
@@
@cmsg336_L
All HTML Graphics
@@
@cmsg340_L
Route HomeRow to current window
@@
@cmsg340_S
HomeRow to current
@@
@cmsg341_L
SpeakWindowVisibility on
@@
@cmsg342_L
SpeakWindowVisibility off
@@
@cmsg343_L
Visible
@@
@cmsg344_L
Not visible
@@
@cmsg345_L
Exiting the window tree for the currently active application
@@
@cmsg345_S
Exiting window tree for active app
@@
@cmsg346_L
Entering the window tree for the currently active application
@@
@cmsg346_S
Entering window tree for active app
@@
@cmsg347_L
Name
@@
@cmsg348_L
Type
@@
@cmsg349_L
SubType
@@
@cmsg3491_L
value
@@
@cmsg3492_L
State
@@
@cmsg350_L
Message box not available for object sub type codes
@@
@cmsg350_S
Not available for object sub type codes
@@
@cmsg352_L
Route JAWS to Home Row
@@
@cmsg352_S
JAWS to Home Row
@@
@cmsg353_L
Route Invisible to Home Row
@@
@cmsg353_S
Invisible to Home Row
@@
@cmsg361_S
Both
@@
@cmsg362_L
Could not determine hot keys in this dialog.
@@
@cmsg363_L
Read box in tab order.
@@
;debug messages
@cmsgDebugAppFinish1_L
AutoFinishEvent
@@
@cMsgScreenSensitiveHelpTimePicker
Select hour, minute or AM/PM with left and right arrows.
Change your selection with up and down arrows.
@@
@cmsgScreenSensitiveHelp17_S
This %product% list box contains configurable options.
Arrow keys move between items.
SPACEBAR toggles settings.
ENTER closes the dialog.
@@
@cmsgScreenSensitiveHelp18_S
In this select item list box:
To move to an item, use the Arrow keys or the First letter of an item.
To Choose an item and exit the dialog, press ENTER.
To cancel the dialog, press ESC.
@@
@cmsgScreenSensitiveHelp20_S
To increase the value of a scroll bar, press RIGHT ARROW, DOWN ARROW, or PAGE DOWN.
To decrease the value, press LEFT ARROW, UP ARROW, or PAGE UP.
@@
@cmsgScreenSensitiveHelp21_S
To increase the value of a scroll bar, press RIGHT ARROW, DOWN ARROW, or PAGE DOWN.
To decrease the value, press LEFT ARROW, UP ARROW, or PAGE UP.
@@
@cmsgScreenSensitiveHelpToolBarJAWSCursor_S
Use JAWS cursor navigation to move to buttons on this toolbar.
Press left mouse button to activate the toolbar button under the JAWS cursor.
@@
@cmsgScreenSensitiveHelp23_S
Use the arrow keys to move through the buttons on this toolbar.
Press ENTER to activate the selected toolbar button.
@@
@cmsgScreenSensitiveHelp24_S
Status bars provide contextual information within applications.
To access status bar information, press %KeyFor(SayBottomLineOfWindow).
@@
@cmsgScreenSensitiveHelp25_S
This header bar contains titles for the columns below it.
Click on a column title with the JAWS cursor to sort the list based on the information in that column.
@@
@cmsgScreenSensitiveHelp26_S
Type the value in the spin box,
or press UP or DOWN ARROW to adjust the value.
@@
@cmsgScreenSensitiveHelp27_S
Use the UP and DOWN ARROW keys to select commands on this menu.
You can press RIGHT ARROW to open submenus. Press ENTER to carry out the currently selected command.
@@
@cmsgScreenSensitiveHelp28_S
From the desktop,
press the WINDOWS key to open the Start menu,
press %keyFor(StartJAWSTaskList) to list open applications,
or use the Arrow keys to move through the items on the Desktop.
@@
@cmsgScreenSensitiveHelp29_S
To activate this minimized application or folder,
press ENTER if using the PC Cursor,
or press %KeyFor(LeftMouseButton) if using the JAWS cursor.
@@
@cmsgScreenSensitiveHelp30_S
This multiple document interface client window
is the space underlying documents in an application.
To open a document or to exit the application,
use the application's menus.
@@
@cmsgScreenSensitiveHelp31_S
To move through this dialog box, press TAB.
To read the entire window. press %KeyFor(ReadBoxInTabOrder).
@@
@cmsgScreenSensitiveHelp34_S
This group box is used to group items that are related such as radio buttons.
@@
@cmsgScreenSensitiveHelp35_S
To read the contents of this dialog, press %KeyFor(ReadBoxInTabOrder).
To determine the default button activated by ENTER, press %KeyFor(SayDefaultButton).
To exit the dialog and discard changes, press ESC.
@@
@cmsgScreenSensitiveHelp36_S
This is a General picture.
@@
@cmsgScreenSensitiveHelp37_S
Use this short cut key edit control to define
a unique keyboard command to open the application at any time.
Press the letter key you wish to assign, and Windows adds ALT+CTRL,
or press any combination of ALT, CTRL, or SHIFT with a letter key to specify the exact keys to use.
@@
@cmsgScreenSensitiveHelp39_S
The desktop list view contains application icons and desktop items.
Press the first letter of the desired item to move to it.
To open or start it, Press ENTER.
To open the Start Menu, Press the Windows Key.
@@
@cmsgScreenSensitiveHelp41_S
Use the UP and DOWN ARROW keys to move through and select items in this tree view.
To expand the selected item, press RIGHT ARROW.
To collapse an item, press LEFT ARROW.
You can also use first letter navigation to move quickly to an item.
@@
@cmsgScreenSensitiveHelp42_S
From the Start Button, press ENTER to open the Start Menu,
or TAB to move to the Taskbar.
The Start menu provides access to applications and Windows utilities.
The taskbar lists running applications.
@@
@cmsgScreenSensitiveHelp43_S
Items in the Start menu are used to launch applications.
Use the UP and DOWN ARROW keys to select the items.
If %product% indicates an item has a submenu, RIGHT ARROW opens and moves to it.
Press ENTER to carry out the currently selected command.
@@
@cmsgScreenSensitiveHelp44_S
Use the UP and DOWN ARROW keys to select commands on this menu.
You can press RIGHT ARROW to open submenus.
Press ENTER to carry out the currently selected command.
@@
@cmsgScreenSensitiveHelp45_S
The task bar contains currently running applications.
Press ENTER to make an application active.
Running applications may also be listed by pressing %KeyFor(StartJAWSTaskList).
@@
@cmsgScreenSensitiveHelp46_S
In this multiselect listbox,
multiple items that are next to each other are selected by
holding down SHIFT then using UP or DOWN ARROW.
To select multiple items not next to each other,
hold down CTRL as you arrow up and down and press SPACEBAR
to select each item.
@@
@cmsgScreenSensitiveHelp47_S
Use the UP and DOWN ARROW keys to select an item in this list box.
You can also use first letter navigation to move quickly to an item.
To select more than one item, hold CTRL and use the arrow keys to move through the list.
Press SPACEBAR to add an item to the selection.
@@
@cmsgScreenSensitiveHelp48_S
Use the LEFT and RIGHT ARROW keys to move this slider to the desired value or use PAGE DOWN or PAGE UP to move by larger increments.
@@
@cmsgScreenSensitiveHelp49_S
Use the LEFT and RIGHT ARROW keys to move this slider to the desired value or use PAGE DOWN or PAGE UP to move by larger increments.
@@
@cmsgScreenSensitiveHelp51_S
Characters typed into this password edit field are usually
displayed as asterisks or blank spaces.
@@
@cmsgScreenSensitiveHelp52_S
To navigate and read this read-only text, use standard reading commands.
@@
@cmsgScreenSensitiveHelp53_S
This command bar consists of a row of buttons.
To move through the buttons, press RIGHT ARROW or LEFT ARROW.
To activate a button, press ENTER.
To move to the next command bar, press CTRL+TAB.
To leave the command bar, press ESC.
@@
@cmsgScreenSensitiveHelp54_S
The system tray  contains currently running applications
not listed on the taskbar.
To move between the items, press LEFT ARROW or RIGHT ARROW.
@@
@cmsgScreenSensitiveHelp55_S
Use the LEFT and RIGHT ARROW keys to move between the different menus on this menu bar.
Press ENTER or DOWN ARROW to open the selected menu.
@@
@cmsgScreenSensitiveHelp56_S
Type a value in this spin box or use the UP and DOWN ARROW keys to increase or decrease the value.
@@
@ScreenSensitiveHelp58_L
To choose one of the items in this group of radio buttons,
use the arrow keys.
@@
@cmsgScreenSensitiveHelp59_S
Type in the name of a file to upload.
@@
@cmsgScreenSensitiveHelp60_S
To choose a file to upload,
press ENTER or SPACEBAR on this button.
@@
@cmsgWindowKeysHelp1_S
Menu bar, ALT.
Start menu, CTRL+ESC.
Windows help, F1.
Exit application, ALT+F4.
Context menu, SHIFT+F10.
Properties dialog, ALT+ENTER.
Multi-Select Mode for extended select lists, SHIFT+F8.
@@
  ;for magic
@cmag1
up
@@
@cmag2
down
@@
@cmsgUserBufferNotActive
The Virtual Window is not active.
@@
@cmsg364_L
Say All by Line without pauses
@@
@cMsgMenuSelect
Down arrow selects
@@
;For cmsgHeadingsDesc1_L %1=The number of headings
@cmsgHeadingsDesc1_L
there is 1 heading.
@@
@cmsgHeadingsDesc1_S
1 heading
@@
@cmsgHeadingsDescMultiple_L
there are %1 headings:
@@
@cmsgHeadingsDescMultiple_S
%1 headings
@@
@cmsgHeadingsDescAtLevel_L
%1 at level %2,
@@
@cmsgHeadingsDescAtLevel_S
%1 at level %2,
@@
@msgIENavigation
This is an HTML or PDF document.
You can use the standard %product% reading commands or Navigation Quick Keys to navigate and read this document. %product% can also
display lists of certain elements on this page. For example, you can press INSERT+F7 for a list of links, INSERT+F6 for a list of headings, or INSERT+F5
for a list of form fields. In addition, if you hold down CTRL+INSERT while pressing a Navigation Quick Key, %product% displays a list of all elements of that
type on the page.

By default, Auto Forms Mode is on. This means that when you navigate to an edit field, %product% automatically turns on Forms Mode so that you can immediately type text in the edit field. Forms Mode will turn off when you exit the edit field.
If you turn off the Auto Forms Mode option, using the Quick Settings dialog box (INSERT+V), you must now press ENTER to manually trigger Forms Mode before you can type in the edit field. Press ESC or NUMPAD PLUS to manually exit Forms Mode.

You can create PlaceMarkers to help you bookmark important locations on the page for easy reference. Press CTRL+Windows+K to create a temporary PlaceMarker that
you can return to by pressing the Navigation Quick Key K. To create a permanent PlaceMarker at your current location, press CTRL+SHIFT+K to open the PlaceMarker
dialog.

You can assign custom labels to almost any element on the page. To assign a custom label to a link, image, button, or other element on the page, move to
it and press CTRL+INSERT+TAB. Alternatively, you can press INSERT+F2 and choose "Custom Label."

For more details on these features, refer to the %product% Help system. You can also press INSERT+H to view a complete list of %product% hot keys for HTML or PDF
documents.
@@
@cMsgBatteryNotFound
Battery status not found
@@
@cmsgSelectHTMLElement_L
Selecting %1
@@
@cmsgSelectHTMLElement_S
selecting %1
@@
@cMsgKeyboardLoggingEnabled_S
Enabled
@@
@cMsgKeyboardLoggingDisabled_S
Disabled
@@
@cMsgKeyboardLoggingEnabled_L
Keyboard Logging Enabled
@@
@cMsgKeyboardLoggingDisabled_L
Keyboard Logging Disabled
@@
@msgIgnoreInlineFrames
Ignore Inline Frames
@@
@cmsgHeadings1
Heading Only
@@
;for cmsgCharacterValue_L/S, %1 is character's numeric value
@cmsgCharacterValue_L
character %1
@@
@cmsgCharacterValue_S
%1
@@
@cMsgPlaceMarkerOnPage
There is %1 PlaceMarker
@@
@cMsgPlaceMarkersOnPage
There are %1 PlaceMarkers
@@
@cMsgNoVoiceProfiles
Failed to obtain the list of voice profiles.
@@
;Custom Page Summary messages
@cmsgCustomPageSummary_L
Custom Page Summary
@@
@cmsgCustomPageSummary_S
Custom Summary
@@
; Title for Results Viewer representing custom page summary.
@MSG_CustomSummaryResultsTitle
Custom Summary Results
@@
@cmsgToggleSMMTrainingModeOn_S
on
@@
@CMSGSkimReadStopped_S
%1 matches
@@
@cMsgSelectAControl
Select a Control
@@
@CMSGSelectATag
Select an Element
@@
@cmsgEnteringNestedTable_S
table nesting %1
@@
@cmsgWindowNotVisible_L
The window handle has changed,
use Alt+Tab to return focus.
@@
@cmsgWindowNotVisible_S
window handle changed,
use Alt+Tab to return.
@@
@cmsgNotAvailableInMSAAListView_L
This feature is not available in listviews where MSAA is used by %product%.
@@
@cmsgNotAvailableInMSAAListView_S
Not available in MSAA listviews
@@
@cmsgTopOfList_L
Top of list
@@
@cmsgTopOfList_S
at top
@@
@cmsgBottomOfList_L
Bottom of list
@@
@cmsgBottomOfList_S
at bottom
@@
@cMsgScreenSensitiveHelpLookInTextOnlyRadioButton_L
Select this radio button to limit the %product% search to only text that appears in the document or page. Text Only is the default setting.
@@
@cMsgScreenSensitiveHelpLookInGraphicsOnlyRadioButton_L
Use this radio button to limit the %product% search to only graphics that appear in the document or page.
@@
@cmsgScreenSensitiveHelpResearchItDialogListOfItems
This list contains the possible options you currently have available with the Research It tool.
The primary item in the list is the item that will be activated automatically if you just press %keyFor(ResearchItDefaultLookup).
This keystroke lets you avoid entering this dialog if you generally use the same Research It lookup each time.
For look ups such as Wiktionary or Wikipedia, the feature is designed to look up the word at the active cursor.
You also have the option to press %keyFor(ResearchItByEnteringTerm) and bring up an edit control where you can type in the term you'd like to look up with research it.
It will then use the Primary Look up item which is user definable in the Settings Center.
There are development options available for anyone to create their own custom look ups and add them to their %product%.
Please see the Help for more information.

The Default Primary is Wiktionary
@@
;PlaceMarker screen sensitive help messages are named to describe which controls in the PlaceMarker dialogs they apply to:
@cmsgScreenSensitiveHelp_PlaceMarker_ListView
This list contains the placemarkers for the current Web page or document.
Use UP ARROW, DOWN ARROW, or first letter navigation to select a placemarker, then press ENTER to move to that location.
@@
@cmsgScreenSensitiveHelp_PlaceMarker_Add_Button
Choose this button to add a new placemarker.
@@
@cmsgScreenSensitiveHelp_PlaceMarker_MoveTo_Button
Choose this button to move to the location of the selected placemarker.
@@
@cmsgScreenSensitiveHelp_PlaceMarker_Change_Button
Choose this button to rename the selected placemarker.
@@
@cmsgScreenSensitiveHelp_PlaceMarker_Remove_Button
Choose this button to delete the selected placemarker.
@@
@cmsgScreenSensitiveHelp_PlaceMarker_RemoveAll_Button
Choose this button to delete all placemarkers.
@@
@cmsgScreenSensitiveHelp_PlaceMarker_DisplayFor_RadioButtons
Use the ARROW keys to choose what types of PlaceMarkers are displayed in the list.
@@
@cmsgScreenSensitiveHelp_PlaceMarker_Name_Edit
Enter a name for the placemarker.
@@
@cmsgScreenSensitiveHelp_PlaceMarker_DefineForAllPages_Checkbox
Select this check box to use the placemarker on every page of the current domain.
When this check box is cleared, the placemarker will only be used on the current Web page or HTML document.
@@
@cmsgScreenSensitiveHelp_PlaceMarker_AnchorToText_Checkbox
Select this check box if you want to link the PlaceMarker with specific text, such as a heading, that appears on the page.
This can be useful on frequently updated Web pages where text and elements tend to drift from their original position.
@@
@cmsgScreenSensitiveHelp_PlaceMarker_AnchorText_Edit
Enter the text to associate with the placemarker.
By default, this field contains the text at the location where the placemarker will be set.
@@
@cmsgScreenSensitiveHelp_PlaceMarker_OK_Button:
Choose this button to close the dialog box and save the placemarker.
@@
;flexible web screen sensitive help messages are named to describe which controls they apply to:
@cmsgScreenSensitiveHelpFlexibleWebWhatWouldYouLikeToDoRadioButtons
Use the ARROW keys to select one of the radio buttons in this group.

Choose Create a new customization to create a new, temporary customization.
This is the only available option if there are no temporary customizations currently defined.

Choose Retry to remove the last temporary customization and create a new one.

Choose Save temporary customizations as a rule to Save a group of temporary customizations as a rule which can be applied to the current Web page, site, or globally to all sites.

Choose Undo to remove the most recent temporary customization.

Choose View or change where rules are applied to view or change saved Flexible Web rules.
@@
@cmsgScreenSensitiveHelpFlexibleWebEnableFlexibleWebCheckBox
Use this check box to enable or disable Flexible Web.
The default setting is enabled.
@@
@cmsgScreenSensitiveHelpFlexibleWebCreateRuleRadioButtons
Use these radio buttons to determine how the page is customized.
If you select Hide an element, JAWS will not show the selected element as part of the web page.
If you select Start reading at an element, JAWS will begin reading at the selected element each time the page loads.
@@
@cmsgScreenSensitiveHelpFlexibleWebCustomizeElementListBox
Select the element you wish to customize from this list.
@@
@cmsgScreenSensitiveHelpFlexibleWebSelectCustomizationListBox
Select how you want jaws to identify the element.
The choices in this list will depend on what element was selected when you open Flexible Web, and what selections were made previously in this wizard.
@@
@cmsgScreenSensitiveHelpFlexibleWebSaveRuleNameEdit
Type a name that will identify this group of Flexible Web customizations.
@@
@cmsgScreenSensitiveHelpFlexibleWebSaveCustomizationsCheckableListView
Use this list to review the customizations which will be included in this rule.
Use the SPACEBAR to clear the check boxes for any customizations you do not want to include.
@@
@cmsgScreenSensitiveHelpFlexibleWebSaveRuleAppliesToComboBox
Use this combo box to choose which pages this rule applies to.
You can apply the rule to the current page, current site, or all sites.
@@
@cmsgScreenSensitiveHelpFlexibleWebViewOrChangeRulesTreeview
This treeview contains all of the Web sites and pages that have been customized.
Use the ARROW keys to select an item, then press TAB to move to the list of rules for that Web site or page.
@@
@cmsgScreenSensitiveHelpFlexibleWebViewOrChangeRulesList
This is a list of rules associated with the Web site or page that is selected in the treeview.
Use the SPACEBAR to enable or disable a rule.
Press the APPLICATIONS Key to open a context menu where you can rename, delete, or view the properties of the selected rule.
@@
@msgRibbonBarScreenSensitiveHelp
Use Left or Right arrows to change ribbons, Tab or Shift Tab to navigate the current ribbon.
Use Escape to dismiss the ribbon bar.
@@
@cmsgSpans
spans
@@
@cMsgInputLanguageDidNotChange_L
input language did not change.
@@
@cMsgInputLanguageDidNotChange_S
No change.
@@
@cmsgCopyNotAvailable_L
Copy not available
@@
@cmsgCopyNotAvailable_S
Not available
@@
@cmsgCutNotAvailable_L
Cut not available
@@
@cmsgCutNotAvailable_S
Not available
@@
@cmsgPasteNotAvailable_L
Paste not available
@@
@cmsgPasteNotAvailable_S
Not available
@@
@NoSpeechItem
No Speech
@@
; For positionInGroup-type output, e.g., "1 of 5" and "5 items."
@cmsgPosInGroup1
%1 of %2
@@
@cmsgPosInGroup2
%1 items
@@
; for cmsgRelationDescription
;%1 is the description text, or help text, of the MSAA object.
@cmsgRelationDescription
Description:
%1
@@
;default, enables switching to application mode in Aria apps
@cmsgVirtualCursorAuto_L
Virtual Cursor auto
@@
@cmsgVirtualCursorAuto_S
auto
@@
@cmsgApplicationModeOn_S
App Mode on
@@
@cmsgApplicationModeOff_S
App Mode off
@@
;for cmsgAppLostFocus, %1 = the name of application or dialog who just lost focus, meaning you're in a state where you can do nothing.
@cmsgAppLostFocus
%1 has lost focus
@@
@cmsgResearchItDebugErrorZero
Rule set failed.
@@
;cmsgVirtualRibbonGroup is the type announced when on a group in the virtual ribbons
@cmsgVirtualRibbonGroup
Group
@@

;END OF UNUSED_VARIABLES

;cmsgInspectLayer_Start is spoken when the Inspect layer is activated.
;The Inspect layer keys are defined in the JKM files for the browsers.
@cmsgInspectLayer_Start
Inspect
@@
;cmsgSkypeLayer_Start is spoken when the Skype layer is activated.
;The Skype layer keys are defined in the Skype.JKM file.
@cmsgSkypeLayer_Start
Skype
@@
;cmsgPictureSmartLayer_Start is spoken when the Picture Smart layer is activated.
;The Picture Smart layer keys are defined in the JKM files for the browsers.
@cmsgPictureSmartLayer_Start
Picture Smart
@@
@cmsgSkypeDesktopLayer_Start
Skype Desktop Application
@@
;cmsgViewerLayer_Start is spoken when the BrailleAndTextViewer (BTViewer) layer is activated.
;The BrailleAndTextViewer (BTViewer) layer keys are defined in the Default.JKM file.
@cmsgViewerLayer_Start
Braille and Text Viewer
@@
;cmsgVolumesLayer_Start is spoken when the JAWS and System Volume layer is activated.
;The JAWS and System Volume layer keys are defined in the Default.JKM file.
@cmsgVolumesLayer_Start
Volume
@@
; JAWS and System Volume Secondary Layers Messages
@cmsgJAWSVolumeLayer_Start
JAWS
@@
@cmsgSystemVolumeLayer_Start
System
@@
@cmsgSoundBalanceLayer_Start
Balance
@@
@cmsgSoundCardsLayer_Start
Sound cards
@@
@cmsgVolumeLayerHelpScreenTitle
Volume layer help screen
@@
@cmsgVolumeLayerHelp
The following commands are available in the VOLUME layer.
Adjust JAWS Volume, J.
Adjust System Volume, S.
Adjust Sound Balance, B.
Cycle through the list of available sound cards, c.
@@
@cmsgSystemVolumeLayerHelpScreenTitle
System Volume layer help screen
@@
@cmsgJAWSVolumeLayerHelpScreenTitle
JAWS Volume layer help screen
@@
@cmsgSystemVolumeLayerFirstLine
The following commands are available in the System VOLUME layer.
@@
@cmsgJAWSVolumeLayerFirstLine
The following commands are available in the JAWS VOLUME layer.
@@
; Both JAWS and system bolume layers use the same keystrokes:
@cmsgJAWSAndSystemVolumesLayerHelp
Increase volume small amount, RightArrow or UpArrow.
Decrease volume small amount, LeftArrow or DownArrow.
Increase volume large amount, PageUp.
Decrease volume large amount, PageDown.
@@
@cMsgSoundBalanceLayerHelpScreen
Sound balance layer help screen
@@
@cMsgSoundBalanceLayerHelp
The folowing commands are available in the Sound Balance layer:
Route JAWS to the left and all other apps to the right, left arrow
Route JAWS to the right and all other apps to the left, right arrow
Restore sound balance to the default, up arrow
@@
@cmsgSoundCardsLayerHelpScreen
Sound cards layer help screen
@@
@cmsgSoundCardsLayerHelp
The following commands are available in the sound cards layer:
Move to the next sound card in the list, down arrow.
Move to the previous sound card in the list, up arrow.
@@
; FaceInView messages
@cmsgFaceInViewLayer_Start
Face in View
@@
@cmsgCamerasLayer_Start
Cameras
@@
@cmsgFaceInViewCameraLayerHelpScreen
Camera layer help screen
@@
@cmsgFaceInViewCameraLayerHelp
The following commands are available in the camera layer:
Move to the next camera in the list, down arrow.
Move to the previous camera in the list, up arrow.
@@
; OCR messages
@cmsgOCRLayer_Start
OCR
@@
@MSG_OCRStarted_OmniPage_L
OCR started using OmniPage.
@@
@MSG_OCRStarted_OmniPage_S
started, OmniPage.
@@
@MSG_OCRStarted_MicrosoftOcr_L
OCR started using Microsoft OCR.
@@
@MSG_OCRStarted_MicrosoftOcr_S
started, Microsoft OCR.
@@
@MSG_OCRStarted_S
started.
@@
@MSG_OCRFinished_L
finished.
@@
@MSG_OCRFinished_S
finished.
@@
@MSG_OCRCancelled_L
OCR cancelled.
@@
@MSG_OCRCancelled_S
cancelled.
@@
@MSG_OCRAlreadyInProgress_L
Recognition job is already in progress. Please either wait until the prior job is finished or cancel it.
@@
@MSG_OCRAlreadyInProgress_S
Recognition job is already in progress.
@@
@MSG_OCRCanNotCancel_L
You can not cancel a Recognition job that does not exist.
@@
@MSG_OCRCanNotCancel_S
Can not cancel
@@
@MSG_OCRNotInstalled_L
OCR component is not installed on your system. Please check your internet connection and run the %product% setup again Or Contact Freedom Scientific Technical Support.
@@
@MSG_OCRNotInstalled_S
OCR component is not installed.
@@
@MSG_OCRGotNoText_L
no text found to recognize.
@@
@MSG_OCRGotNoText_S
text not found
@@
@MSG_OCR_FAILED
Failed to recognize text.
@@
@MSG_OCR_PDF_FAILED
Failed to recognize PDF document.
@@
@MSG_OCR_PDF_FAILED_TO_Start
OCR Failed to start.
@@
@msg_OCR_BadPassword
The password you supplied was incorrect.
@@
@msg_OCR_LowResImage
Document image resolution is too low for recognition.
@@
@msg_OCR_Warning_LowResImage
Image resolution is low. OCR quality may be poor.
@@
@msg_OCR_NoDevicesAvailable
OCR Failed to start. No supported cameras or scanners available.
@@
@msg_OCR_Unavailable_Screen_Shade
OCR cannot recognize screen text while screen shade is on.
@@
;cmsgOCRLayerHelpScreenTitle is the title of the help screen which appears in Results Viewer for the OCR layer.
@cmsgOCRLayerHelpScreenTitle
OCR Layer Help Screen
@@
;cmsgOCRLayerHelp is the help text which appears in Results Viewer for the OCR layer.
@cmsgOCRLayerHelp
The following commands are available in the OCR layer.
Acquire and OCR a print document from a Scanner or Freedom Scientific Camera such as PEARL, using the letter A.
OCR a scanned PDF Document opened in Acrobat Reader using the letter D.
From Windows Explorer, you can OCR any Image File or PDF using the letter F.
From Windows Explorer, you can OCR any Image File or PDF directly to a Word document using the letter R.
From the computer screen itself, you can OCR a Control with C, Window with W, or the entire Screen with S.
From any window, you can start Background OCR using the letter B. To have a sound play periodically to indicate that Background OCR is active, use Control+B.
By simply pressing Enter, JAWS will choose the most appropriate command based on the current application and its state.

You can press Q to quit or cancel an OCR job.
@@
@MSG_OCRNoWindow_L
There is no window in this application to OCR. Press INSERT+SPACEBAR, O, S to OCR the screen.
@@
@MSG_OCRNoWindow_S
No window to OCR.
@@
;cmsgTableLayerHelpScreenTitle is the title of the help screen which appears in Results Viewer for the table layer.
@cmsgTableLayerHelpScreenTitle
Table Layer Help Screen
@@
;cmsgTableLayerHelp is the help text which appears in Results Viewer for the table layer.
@cmsgTableLayerHelp
The following commands are available in the table layer.
Move by cell using the Arrow Keys.
Move to the end or beginning of the row or column using Control and arrow keys.
Move to the beginning or end of the row using Home or End.
Move the first or last cell in the table using Control Home or End.
Read current row = Shift UpArrow.
Read current column = Shift NumPad 5.

The table layer will remain active while these commands are used.
Press Escape to exit the table layer.

See Help for a full list of options.
@@
;cmsgBasicLayerHelpScreenTitle is the title of the help screen for the basic key layer which appears in Results Viewer when Insert+Space&Shift+Slash is pressed.
;This screen contains a group of help messages, the messages where the message name starts with cmsgBasicLayerHelpScreen.
;The number of included messages will vary depending on feature availability.
@cmsgBasicLayerHelpScreenTitle
Basic Layer Help Screen
@@
;cmsgBasicLayerHelpScreen_Heading_General will appear in all basic layer help screens.
;It is the heading for the section of help text in cmsgBasicLayerHelpScreen_General_Win7 or cmsgBasicLayerHelpScreen_General_Win10.
@cmsgBasicLayerHelpScreen_Heading_General
General Commands
@@
;cmsgBasicLayerHelpScreen_General_Win7 will appear in all basic layer help screens where the operating system is less than Windows 10.
@cmsgBasicLayerHelpScreen_General_Win7
The following are commands generally available in this key layer.
Restart JAWS or Fusion = F4.
FSCompanion = F1.
Commands Search feature = J.
Toggle Speech between full speech and less speech mode = S.
While in Less Speech mode, toggle between Speech on Demand or full mute = Shift + S.
List recent notifications = N.
Repeat last spoken notification = Shift+N.
Review recent history of what was spoken = H.
Clear previous history of what was recently spoken = Shift + H.
Copy to clipboard the text of what was recently spoken = Control + H.
ResearchIt feature = R.
View text currently on the clipboard = C.
Temporary Lock keyboard toggle on/off = L.
Temporary bypass using current User Settings and use JAWS factory default = Z.
@@
;cmsgBasicLayerHelpScreen_General_Win10 will appear in all basic layer help screens where the operating system is Windows 10 or later.
@cmsgBasicLayerHelpScreen_General_Win10
The following are commands generally available in this key layer.
Restart JAWS or Fusion = F4.
FSCompanion = F1.
Commands Search feature = J.
Screen Shade toggle On/Off for privacy = PrintScreen.
Toggle Speech between full speech and less speech mode = S.
While in Less Speech mode, toggle between Speech on Demand or full mute = Shift + S.
Show a list of recently received notifications = N.
Repeat last notification = Shift+N.
Toggle toast notification announcement = Control+N.
Toggle Volume Control Notifications For External Multimedia Devices = Grave accent.
Review recent history of what was spoken = H.
Clear previous history of what was recently spoken = Shift + H.
Copy to clipboard the text of what was recently spoken = Control + H.
ResearchIt feature = R.
View text currently on the clipboard = C.
Audio ducking toggle on/off = D.
Temporary Lock keyboard toggle on/off = L.
Temporary bypass using current User Settings and use JAWS factory default = Z.
Braille Math Editor feature = Shift + Equals.
Message Center feature = Shift + M.
@@
;cmsgBasicLayerHelpScreen_Heading_Editor will appears in basic layer help screens,
;unless specific word processors such as Microsoft Word omit this secction of messages
;and substitute different messages listing additional app-specific features.
;It is the heading for the section of help text in cmsgBasicLayerHelpScreen_Editor.
@cmsgBasicLayerHelpScreen_Heading_Editor
Editors, Email, and Word Processors
@@
;cmsgBasicLayerHelpScreen_Editor will appears in basic layer help screens,
;unless it is omitted and a different section of help text is substituted for a specific application.
@cmsgBasicLayerHelpScreen_Editor
The following commands are available in editable documents.
Text Analyzer On/Off = A.
@@
;cmsgBasicLayerHelpScreen_Heading_Messaging will appears in all basic layer help screens.
;It is the heading for the section of help text in cmsgBasicLayerHelpScreen_Messaging.
@cmsgBasicLayerHelpScreen_Heading_Messaging
Messaging Applications
@@
;cmsgBasicLayerHelpScreen_Messaging will appears in all basic layer help screens.
@cmsgBasicLayerHelpScreen_Messaging
Repeat last background notification from Skype = Shift + R.
@@
;cmsgBasicLayerHelpScreen_Heading_SecondaryLayer will appears in all basic layer help screens.
;It is the heading for the section of help text in cmsgBasicLayerHelpScreen_SecondaryLayer.
@cmsgBasicLayerHelpScreen_Heading_SecondaryLayer
Secondary Layers
@@
;cmsgBasicLayerHelpScreen_SecondaryLayer will appears in all basic layer help screens.
@cmsgBasicLayerHelpScreen_SecondaryLayer
The following keys activate a secondary layer. You can press Questionmark in any of these layers to show a help screen.
Mouse Echo layer = E.
Face in View layer = F.
OCR layer = O.
Picture Smart layer = P.
Skype Desktop Application layer = Y.
Activate Table Navigation layer while in a table = T.
Braille and Text Viewers layer = B.
Volume layer = V.
@@
;cmsgBasicLayerHelpScreen_SecondaryLayerSkype will appears in all basic layer help screens when Skype 8 or later has focus..
@cmsgBasicLayerHelpScreen_SecondaryLayerSkype
Skype navigation keys = Q.
@@
;cmsgBasicLayerHelpScreen_SecondaryLayerGoogleDocsQuickKeys will appear in basic layer help when Google Docs has focus.
@cmsgBasicLayerHelpScreen_SecondaryLayerGoogleDocsQuickKeys
Google Docs Quick Keys = G.
@@
;cmsgBasicLayerHelpScreen_Heading_Browser will appear in the basic layer help in browsers where the functionality is supported.
;It is the heading for the section of help text in cmsgBasicLayerHelpScreen_Browser.
;Currently, the MicrosoftEdge browser does not support these features.
@cmsgBasicLayerHelpScreen_Heading_Browser
Web Browsers
@@
;cmsgBasicLayerHelpScreen_Browser will appear in the basic layer help screen for browsers where the functionality is supported.
@cmsgBasicLayerHelpScreen_Browser
The following commands are available in Browsers.
Flexible web customization = X.
Select text between marked place and current position = M.
@@
;For Navigation Quick Keys Delay,
;replaces strings in qsm file, as this is now being handled by custom callback:
@cmsgNavQuickKeyDelayNever
Never
@@
@cmsgNavQuickKeyDelay0_5Secs
0.5 Seconds
@@
@cmsgNavQuickKeyDelay1Sec
1 Second
@@
@cmsgNavQuickKeyDelay1_5Secs
1.5 Seconds
@@
@cmsgNavQuickKeyDelay2Secs
2 seconds
@@
@cmsgNavQuickKeyDelay3Secs
3 seconds
@@
@cmsgNavQuickKeyDelay4Secs
4 seconds
@@
@cmsgNavQuickKeyDelay5Secs
5 seconds
@@
;for cmsgDeprecatedFunctionV14, %1 is the function name
@cmsgDeprecatedFunctionV14
The %1 function is no longer available in JAWS after version 13
@@
;for cmsgOCRLanguages, leave the number and the | in place.
;Only translate the text to the right of the vertical line (|)
;If you want to add a new OCR language not listed, use langCode|Human-readable name
;where langCode is the recognized numeric code for the language.
;The string to the right of the vertical line is not used, except by humans, so that is to be localized.
@cmsgOCRLanguages
1078|Afrikaans
1052|Albanian
1068|Azeri (Latin)
1069|Basque
1059|Belarusian
1026|Bulgarian
1027|Catalan
1050|Croatian
1029|Czech
1030|Danish
1043|Dutch
2057|English - United Kingdom
1033|English - United States
1061|Estonian
1080|Faeroese
1035|Finnish
1036|French
1071|FYRO Macedonian
1110|Galician
1031|German
1032|Greek
1038|Hungarian
1039|Icelandic
1057|Indonesian
1040|Italian
1062|Latvian
1063|Lithuanian
1086|Malay
1044|Norwegian (Bokmal)
1045|Polish
1046|Portuguese - Brazil
2070|Portuguese - Portugal
1048|Romanian
1049|Russian
3098|Serbian - Serbia (Cyrillic)
2074|Serbian - Serbia (Latin)
1051|Slovak
1060|Slovenian
3082|Spanish
1053|Swedish
1055|Turkish
1058|Ukrainian
@@
@cmsgSmoothingHD
HD Smoothing
@@
@cmsgSmoothingClassic
Classic Smoothing
@@
@cmsgSmoothingNone
No Smoothing
@@
; For Windows 8 and later where smoothing is either on or off.
@cmsgSmoothingDisabled
Smoothing Disabled
@@
@cmsgSmoothingEnabled
Smoothing Enabled
@@
@cmsgCopyScreenImage_L
Copied screen image
@@
@cmsgCopyScreenImage_S
Copied screen
@@
@cmsgCopyVisibleMagnifiedWindow_L
Copied visible magnified window
@@
@cmsgCopyVisibleMagnifiedWindow_S
Copied visible
@@
@msgFlexibleWebNotAvailable
Flexible Web is not available for this application
@@
;for the clipboard text viewer:
@cmsgClipboardTextTitle
Clipboard Text
@@
@cmsgNoTextOnClipboard
There is no text on the clipboard
@@
@cMsgViewClipboardTextExit
Press Escape to close the clipboard text viewer.
@@
@cmsgClipboardTextViewerOverwriteTitle
Overwrite Clipboard Text Viewer
@@
@cmsgClipboardTextViewerOverwritePrompt
There is currently an open clipboard text viewer window.
Do you want to overwrite it with the current clipboard text content?
@@
; For MAGic Text Viewer:
@cMsgTextViewerEnabled
Text viewer enabled
@@
@cmsgTextViewerDisabled
Text viewer disabled
@@
@cmsgTextViewerNotAvailable
Text viewer not available unless MAGic is running.
@@
;for cmsgHeaderTemplate
;%1 is the text to be spoken using the header voice alias
@cmsgHeaderTemplate
<voice name=HeaderVoice>%1</voice>
@@
@cmsgMagNoLinks_L
No links found in document.
@@
@msgMagNoHeadings_L
No headings found in document.
@@
@cmsgQuickKeysNotAvailable
Navigation Quick Keys not available
@@
@cmsgQuickKeysOff
Navigation Quick Keys off
@@
@cmsgQuickKeysOn
Navigation Quick Keys on
@@
; The following represents groupings within list views
@cmsgGrouping
Grouping
@@
@cmsgRibbonCollapsed_L
ribbon collapsed
@@
@cmsgRibbonCollapsed_s
collapsed
@@
@cmsgRibbonExpanded_l
ribbon expanded
@@
@cmsgRibbonExpanded_s
expanded
@@
@cmsgQuickKeysAlreadyDisabled
Quick Keys Already Disabled
@@
@cmsgQuickKeysSuspended
Quick Keys Suspended
@@
@cmsgQuickKeysResume
Resuming Quick Keys
@@
;for cmsgFlexibleWebActiveRules, %1 = the number of active rules.
@cmsgFlexibleWebActiveRules
%1 Active
@@
@cmsgInsideApplicationRegion
Inside Application Region
@@
@cmsgHasDetails
Has Details
@@
@cmsgEnteringDetailsRegion
Entering Details
@@
@cmsgLeaving
Leaving
@@
@cmsgClearSpeechHistory
Speech history cleared
@@
@cmsgCopySpeechHistory
Copy speech history to clipboard
@@
@cmsgSpeechHistoryNotAvailable
Speech history disabled
@@
@cmsgSpeechHistoryTitle
Speech History
@@
@cmsgScriptPerformanceHistoryTitle
Script Performance History
@@
@cmsgScriptPerformanceHistoryEnableQuestion
Script Performance History is disabled. Would you like to enable it?
@@
@cmsgScriptPerformanceHistoryEnabledInformation
Setting ScriptPerformanceHistoryEnabled has been set to 1. You can manually disable it later in default.jcf
@@
@cmsgScriptPerformanceHistoryClearedInformation
Script Performance History has been cleared
@@
;The following HotKeyHelp messages are used for touch navigation,
;The replaceable parameters are the keys assigned to the scripts.
@cmsgTouchNavigationHotKeyHelp
Move to the next touch element, right arrow.
Move to the prior touch element, left arrow.
Move to the next element by types using the rotor settings, down arrow.
Move to the prior element by types using the rotor settings, up arrow.
Choose the next navigation type from the rotor, page down.
Choose the prior navigation type from the rotor, page up.
Move to the first touch element, Control+Home.
Move to the last touch element, Control+End.
@@
@cmsgAdvancedObjectNavigationHotKeyHelp
Move to the next sibling object, right arrow.
Move to the prior sibling object, left arrow.
Move to the parent object,up arrow.
Move to the first child object, down arrow.

View UIA element properties, %1.
Say the clickable point of the UIA element, %2.
Say the rectangle of the UIA element, %3.
Release the UIA object, %4.
@@
@cmsgGeneralObjectNavigationHotKeyHelp
Tap the item at the touch cursor, Space or Enter.
Say the element at the touch cursor, %1.
Say all starting at the touch cursor, %2.
Activate text review, %3.
Route the touch cursor to the focus location, %4.
@@
@cmsgToggleAdvancedObjectNavigationHotKeyHelp
To toggle advanced object navigation on or off, %1.
@@
@cmsgTouchNavigationQuickKeysHotKeyHelp
The following are quick navigation keys. Use Shift with the key to move backward to a prior occurrence, the key alone to move forward to the next occurrence.
Radio button, A.
Button, B.
Combo box, C.
Document, D.
Edit, E.
Form control, F.
Image, G.
Heading, H.
List item, I.
Hyperlink, K.
List, L.
Menu, M.
Tool bar, O.
Pane, P.
Tab control, Q.
Region, R.
Static text, S.
Table, T.
Group, U.
Tree, V.
Checkbox, X.
Status bar, Z.
@@
@cmsgTouchNavigationToggleQuickKeysHotKeyHelp
Use %1 to toggle touch navigation quick keys on or off.
You can set the default state of touch navigation quick keys for this application using the Touch Quick Keys option in Quick Settings.
@@
@cmsgTouchNavigationTextReviewHotKeyHelp
Use cursor keys to navigate through the text.
Press Escape to exit review back to touch navigation.
Tab and Shift+Tab exits review and moves to the next or prior item with the touch cursor.
@@
;cmsgHasFocus is spoken after the focus item is spoken,
;when using the touch cursor and the item at the touch cursor location is the focus item.
@cmsgHasFocus
has focus
@@
;For cmsgGestureNameFingerCountList and cmsgGestureNameGestureList:
;Only translate the right side of the equal sign.
;The left side of the equal sign is taken from the non-localizable gestures names.
;The right side is the user-friendly, or localizable translation,
;of the text used to create the gesture names which will be used in help messages, such as keyboard help.
;cmsgGestureNameFingerCountList is a list of the possible values for gesture names which indicate the finger count.
;In the JKM file, the finger count is to the left of the first plus sign of the full gesture name.
;cmsgGestureNameGestureList is a list of the possible values for gesture names which indicate the gesture.
;In the JKM file, the gesture is to the right of the first plus sign of the full gesture name.
@cmsgGestureNameFingerCountList
OneFinger=one finger
TwoFingers=two fingers
ThreeFingers=three fingers
FourFingers=four fingers
FiveFingers=five fingers
@@
@cmsgGestureNameGestureList
Tap=tap
DoubleTap=double tap
TripleTap=triple tap
Tap+Explore=explore the screen
Tap+ExploreEnd=explore the screen
FlickDown=flick down
FlickUp=flick up
FlickRight=flick right
FlickLeft=flick left
SwipeDown=swipe down
SwipeUp=swipe up
SwipeRight=swipe right
SwipeLeft=swipe left
SwipeLeftRight=swipe left then right
SwipeLeftUp=swipe left then up
SwipeLeftDown=swipe left then down
SwipeRightLeft=swipe right then left
SwipeRightUp=swipe right then up
SwipeRightDown=swipe right then down
SwipeUpDown=swipe up then down
SwipeUpRight=swipe up then right
SwipeUpLeft=swipe up then left
SwipeDownUp=swipe down then up
SwipeDownRight=swipe down then right
SwipeDownLeft=swipe down then left
SplitTap=split tap
SplitDoubleTap=split double tap
PinchIn=pinch close
PinchOut=pinch open
RotateClockwise=rotate clockwise
RotateCounterclockwise=rotate counterclockwise
@@
;for cmsgReformattedGesturename,
;%1 is taken from cmsgGestureNameFingerCountList
;%2 is taken from cmsgGestureNameGestureList
;and this is what will be used for the user-friendly gesture name in help messages.
@cmsgReformattedGesturename
%1 %2
@@
;for cmsgGestureListHelp_TouchNavigationMode,
;%1 is cmsgGestureListHelp_TouchNavigationMode_ForItem
;%2 is cmsgGestureListHelp_TouchNavigationMode_Navigate
;%3 is cmsgGestureListHelp_TouchNavigationMode_Misc
;for cmsgGestureListHelp_TouchNavigationMode_ForItem
;for cmsgGestureListHelp_TouchNavigationMode_Navigate messages
;the replaceable parameters are the gesture names created by cmsgReformattedGesturename.
@cmsgGestureListHelp_Title
Gesture List
@@
;for cmsgGestureListHelp_ModeInformation,
;%1 is the gesture mode, one of the lines from cmsgGestureModesList
@cmsgGestureListHelp_ModeInformation
The current gesture mode is %1. Use two fingers rotate to cycle through the available gesture modes.
@@
@cmsgGestureListHelp_TouchNavigationMode
Explore the screen by touching with one finger, or by moving one finger around on the screen.

%1

%2

%3

@@
@cmsgGestureListHelp_TouchNavigationMode_ForItem
%1 = speaks the item at the touch cursor.
%2 = tap the item at the touch cursor.
%3 = context menu for the item at the touch cursor.
%4 = context help for the item at the touch cursor.
@@
@cmsgGestureListHelp_TouchNavigationMode_Navigate
%1 = move to next item.
%2 = move to prior item.
%3 = move to next item of specified type.
%4 = move to prior item of specified type.
%5 = specify movement item to next type.
%6 = specify movement item to prior type.
%7 = move to last item.
%8 = move to first item.
@@
@cmsgGestureListHelp_TouchNavigationMode_Misc
%1 = start reading at the touch cursor with say all.
%2 = stop speech currently in progress.
%3 = toggle speech on or off.

%4 = Escape.
%5 = close the application.
%6 = show or hide the touch keyboard.
@@
;for cmsgGestureListHelp_TextReadingMode
;%1 is cmsgGestureListHelp_TextReadingMode_TextReadingPart1
;%2 is cmsgGestureListHelp_TextReadingMode_TextReadingPart2
;%3 is cmsgGestureListHelp_TextReadingMode_SayAll
@cmsgGestureListHelp_TextReadingMode
Read text using the following gestures:

%1
%2

%3

@@
@cmsgGestureListHelp_TextReadingMode_TextReadingPart1
%1 and %2 move to next and prior character.
%3 and %4 move to next and prior word.
%5 and %6 move to home and end.
@@
@cmsgGestureListHelp_TextReadingMode_TextReadingPart2
%1 and %2 perform Up and Down arrow cursor movements.
%3 and %4 perform Control+Up and Control+Down cursor movements.
%5 and %6 perform Control+Home and Control+End cursor movements.
@@
@cmsgGestureListHelp_TextReadingMode_SayAll
%1 performs a SayAll on the text of a document or on a text control, starting from the cursor location.
Single tap anywhere stops the SayAll.
@@
;for cmsgGestureListHelp_SpeechSettingsMode
;The replaceable parameters are the names of gestures.
@cmsgGestureListHelp_SpeechSettingsMode
Use %1 and %2 to change speech rate.
Use %3 and %4 to change system volume.
Toggle between Touch and PC cursor with %5.
@@
;for cmsgGestureListHelp_CommonJAWSCommands,
;The replaceable parameters are the names of gestures.
@cmsgGestureListHelp_CommonJAWSCommands
%1 brings up the list of JAWS managers.
%2 brings up the JAWS application window.
%3 shuts down JAWS.

%4 passes the next gesture directly to Windows.
%5 toggles gesture handling to Windows, use again to toggle gesture handling back to JAWS.
@@
;cmsgGestureListHelp_Link_ messages are links added at the bottom of cmsgGestureListHelp messages
;%1 is the gesture label
@cmsgGestureListHelp_Link_GesturePractice
Use %1, or tap here to turn on gesture practice
@@
@cmsgGestureListHelp_Link_CloseResultsViewer
Tap here to close Results Viewer.
@@
;for cmsgGestureModesList:
;Each line is the name of a mode, and may be spoken when switching gesture modes
;or when reporting the name of the current gesture mode.
;Translate each line as a separate string, and do not change the order of the lines.
;The scripts depend on the order of these lines to speak the correct gesture mode name.
;Also see cmsgGestureModeName messages for how these mode names are used.
@cmsgGestureModesList
touch navigation
text reading
speech settings
@@
;for cmsgGestureModeName messages,
;%1 is one of the lines belonging to cmsgGestureModesList
@cmsgGestureModeName_L
%1 mode
@@
@cmsgGestureModeName_S
%1
@@
;cmsgDefaultAction is used as a tutor message
;%1 is the text returned by UIA as the default action.
@cmsgDefaultAction
Default action is %1
@@
;For cmsgTouchContextHelp_AvailableCommands
;This is a portion of the context help for touch.
;This message may be preceded by help text retrieved from UIA,
;and by a line listing the default action.
;It may be followed by other information if contextually applicable.
;%1 is an indented list of actions for the current touch element.
@cmsgTouchContextHelp_AvailableCommands
Available actions include:
%1
@@
;cmsgThisControlIsDisabled is used in touch context help
;to inform the user that the control is disabled.
@cmsgThisControlIsDisabled
This control is disabled.
@@
;Following cmsg AvailableAction messages are used in the action list of the touch context help to describe available actions.
@cmsgInvokeAvailableAction
activate
@@
@cmsgToggleAvailableAction
toggle
@@
@cmsgSelectAvailableAction
select
@@
@cmsgDeselectAvailableAction
deselect
@@
@cmsgScrollAvailableAction
scroll
@@
@cmsgSetFocusAvailableAction
set focus
@@
;cmsgControlIsRequiredForForm is used in touch context help to indicate that the control is required when filling out a form.
@cmsgControlIsRequiredForForm
This control is required when filling out the form.
@@
;cmsgGestureCommandListLink is a link for the gestures list.
;%1 is the gesture assigned to the script GestureListHelp.
@cmsgGestureCommandListLink
Double tap here, or use %1 for a list of all available gestures.
@@
;cmsgGestureAction messages are spoken when specific gestures are used
;and JAWS has been configured to speak a message rather than play a sound
;to indicate that a specific gesture has been performed.
;cmsgGestureAction_Escape for gesture escape
;cmsgGestureAction_CloseApp for gesture close app
@cmsgGestureAction_Escape
escape
@@
@cmsgGestureAction_CloseApp
close app
@@
;cmsgTouchQuickNavActive and cmsgTouchQuickNavInactive are spoken
;when quick navigation keys for touch or object navigation is toggled on or off while the touch cursor is active.
;cmsgTouchQuickNavEnabled and cmsgTouchQuickNavDisabled are spoken
;if the user toggles touch quick nav ability when touch cursor is not active.
;The case of toggling when touch cursor is not active is not expected,
;since the script is only mapped in the touch cursor section,
;but it is planned for just in case.
@cmsgTouchQuickNavActive
Touch quick navigation on
@@
@cmsgTouchQuickNavInactive
Touch quick navigation off
@@
@cmsgTouchQuickNavEnabled
Quick navigation enabled for touch cursor
@@
@cmsgTouchQuickNavDisabled
Quick navigation disabled for touch cursor
@@
;cmsgTouchScroll messages are spoken when a scroll gesture is performed and when the scroll is carried out:
@cmsgTouchScroll_Down
Scroll down
@@
@cmsgTouchScroll_Up
Scroll up
@@
@cmsgTouchScroll_Right
Scroll right
@@
@cmsgTouchScroll_Left
Scroll left
@@
@cmsgManualFormsMode
Manual
@@
@cmsgSemiAutoFormsMode
SemiAuto
@@
@cmsgAutoFormsMode
Auto
@@
; for cmsgReservedWebAppKeyAndAction, %1 = key name, %2 = action
; where key name is keystroke name as provided by the web application, usually single letter or shift+letter, or punctuation mark / number / symbol.
; where action is action as provided by the web application.
; These actions may be language-specificc but the translators for the web applications themselves are responsible for this.
@cmsgReservedWebAppKeyAndAction
%1: %2
@@
;for cmsgReservedWebAppKeyAndActionHotKeyHelp, %1 is the list of actions and their corresponding reserved web app keys.
;The text of the action comes from the web application itself, and the responsibility for localizing the text belongs to the web application developer.
@cmsgReservedWebAppKeyAndActionHotKeyHelp
What follows is a list of Reserved Web application keys:

%1

End of Reserved Web application keys. Continue reading to see what actions these keys normally have.
@@
@cmsgReservedWebAppKeyAndActionScreenSensitiveHelp
To view the available web application keys, press %KeyFor(HotKeyHelp).
@@
@cmsgReservedWebAppKeysDescriptionKeyboardHelp
This keystroke is reserved by the web application.
@@
@cmsgEnteringBrlOnlyRegion_l
Entering Braille only region
@@
@cmsgEnteringBrlOnlyRegion_s
Entering Braille region
@@
@cmsgBrlOnlyRegion_l
Braille only region
@@
@cmsgBrlOnlyRegion_s
Braille region
@@
;Error messages for indicating when a JAWS action is not available:
@cmsgNotAvailableInRibbonsOrMenus_error
Not available in ribbons or menus
@@
@cmsgNotAvailableInQuickSettingsOrSettingsCenter_Error
Not available in QuickSettings or Settings Center
@@
;cmsgVRStatus messages are spoken when the script is used to toggle virtual ribbons on/off:
@cmsgVRStatus_Off_L
Virtual ribbons off
@@
@cmsgVRStatus_On_L
Virtual ribbons on
@@
@cmsgSmartNavOff
Off
@@
@cmsgSmartNavControls
Controls
@@
@cmsgSmartNavControlsAndTables
Controls and Tables
@@
@cmsgSmartNavWordAndCharacter
Words and characters
@@
; for cmsgSmartNavigationSetting, %1 = the current setting.
@cmsgSmartNavigationSetting
Smart Navigation: %1
@@
; for cmsgSpansColumns_L and cmsgSpansColumns_S, %1 = the number of columns
; strings begin with a blank line in order to ensure separation of spoken string from cell text being read.
@cmsgSpansColumns_L

Spans %1 columns
@@
@cmsgSpansColumns_S

Spans %1
@@
; for cmsgSpansRows_L and cmsgSpansRows_S, %1 = current cell position in the span and %2 = the total row span size
; strings begin with a blank line in order to ensure separation of spoken string from cell text being read.
@cmsgSpansRows_L

cell %1 of row spanning %2 rows
@@
@cmsgSpansRows_S

%1 in row span of %2
@@
@cmsgNoBrailleTables
No preferred Braille tables selected.
@@
;for cmsgSingleBrailleTable, %1 is the selected Braille Table name
@cmsgSingleBrailleTable
%1 is the only preferred Braille table selected.
@@
@cmsgBrailleTableUnavailable
Not available while the Braille translator is on. To turn it off, press %KeyFor(ChangeContractedBrailleSetting).
@@
@cmsgAlternateUserDirectoryModeOff_L
Alternate user directory mode off
@@
@cmsgAlternateUserDirectoryModeOff_S
off
@@
@cmsgDefaultAlternateUserDirectoryMode_L
Default alternate user directory mode
@@
@cmsgDefaultAlternateUserDirectoryMode_S
Default
@@
@cmsgRoamAlternateUserDirectoryMode_L
Roam alternate user directory mode
@@
@cmsgRoamAlternateUserDirectoryMode_S
Roam
@@

;RouteMouseToTouch and RouteJAWSToTouch messages are spoken by MAGic or JAWS respectively when the RouteMouseToTouch script is used to route the JAWS cursor.
@cmsgRouteMouseToTouch_L
Route mouse to touch
@@
@cmsgRouteMouseToTouch_S
Mouse to touch
@@
@cmsgRouteJAWSToTouch_L
Route JAWS to touch
@@
@cmsgRouteJAWSToTouch_S
JAWS to touch
@@


;RouteTouchToMouse and RouteTouchToJAWS messages are spoken by MAGic or JAWS respectively when the RouteTouchToMouse script is used to route the touch cursor.
@cmsgRouteTouchToMouse_L
Route touch to mouse
@@
@cmsgRouteTouchToMouse_S
Touch to mouse
@@
@cmsgRouteTouchToJAWS_L
Route touch to JAWS
@@
@cmsgRouteTouchToJAWS_S
Touch to JAWS
@@
;cmsgMouseEcho messages are spoken When using the script to cycle through the available mouse echo settings:
@cmsgMouseEchoCharacter
Mouse echo character
@@
@cmsgMouseEchoWord
Mouse echo word
@@
@cmsgMouseEchoLine
Mouse echo line
@@
@cmsgMouseEchoParagraph
Mouse echo paragraph
@@
@cmsgMouseEchoOff
Mouse echo off
@@
@cmsgMouseEchoOn
Mouse echo on
@@
@cmsgMouseEchoItemDescriptionExceptionAdded
Mouse echo item description exception added
@@
@cmsgMouseEchoItemDescriptionExceptionRemoved
Mouse echo item description exception removed
@@
@cmsgMouseEchoItemDescriptionExceptionError
Unable to toggle Mouse echo item description exception
@@
;cmsgMouseEchoLayerStart messages are spoken when the mouse echo layer is entered by using the beginning of the layered key sequence,
;and cmsgMouseEchoLayerChoice messages are spoken when using the final key of the layered key sequence to set mouse echo off or on, or to a specific echo unit.
@cmsgMouseEchoLayerStart_L
Mouse echo layer
@@
@cmsgMouseEchoLayerStart_S
Mouse echo
@@
@cmsgMouseEchoLayerChoiceCharacter
character
@@
@cmsgMouseEchoLayerChoiceWord
word
@@
@cmsgMouseEchoLayerChoiceLine
line
@@
@cmsgMouseEchoLayerChoiceParagraph
paragraph
@@
@cmsgMouseEchoLayerChoiceOff
off
@@
@cmsgMouseEchoLayerChoiceOn
on
@@
;cmsgEchoLayerHelpScreenTitle is the title of the help screen which appears in Results Viewer for the Mouse Echo layer.
@cmsgEchoLayerHelpScreenTitle
Mouse Echo Layer Help Screen
@@
;cmsgEchoLayerHelp is the help text which appears in Results Viewer for the Mouse Echo layer.
@cmsgEchoLayerHelp
The following commands are available in the Mouse Echo layer.
Toggle mouse echo On/Off = O.
Set mouse echo to character = C.
Set mouse echo to word = W.
Set mouse echo to line = L.
Set mouse echo to paragraph = P.
@@
; cmsgRestrictToWebDialog and cmsgRestrictToWebDocument messages are spoken when Insert+R is pressed and the virtual cursor is successfully restricted.
@cmsgRestrictToWebDialog_L
Dialog Restriction.
@@
@cmsgRestrictToWebDialog_S
Restricted
@@
@cmsgRestrictToWebDocument_L
Document Restriction.
@@
@cmsgRestrictToWebDocument_S
Restricted
@@
; cmsgRestrictVirtualError messages are used when the user presses a key to turn on virtual cursor restriction,tion, but the restriction fails to occur.
@cmsgRestrictVirtualError_L
Focus must be in a web dialog or document to toggle virtual cursor restriction.
@@
@cmsgRestrictVirtualError_S
Focus is not in a web dialog or document.
@@
;cmsgJAWSHandlesGestures and cmsgWindowsHandlesGestures messages
;are spoken when gesture handling is toggled between JAWS and Windows.
@cmsgJAWSHandlesGestures_L
JAWS handles gestures
@@
@cmsgJAWSHandlesGestures_S
JAWS gestures
@@
@cmsgWindowsHandlesGestures_L
Windows handles gestures
@@
@cmsgWindowsHandlesGestures_S
Windows gestures
@@
;msgAudioDuckingOSError is spoken when the ToggleAudioDucking script is used in an operating system which does not support it:
@msgAudioDuckingOSError
Audio ducking is only available in Windows 8 or later.
@@
; cmsgDisabledByRoutingError is spoken when audio ducking cannot be enabled due to JAWS being routed
@cMsgAudioDuckingDisabledByRoutingError
Audio ducking cannot be turned on while JAWS is routed.
@@
;msgAudioDucking_On and msgAudioDucking_Off are spoken when the ToggleAudioDucking script runs:
@msgAudioDucking_On
Duck other audio
@@
@msgAudioDucking_Off
Do not duck other audio
@@
@cmsgMagicWebDialogRestrictionError
Cannot toggle web dialog restriction outside of Forms Mode or the virtual cursor
@@
;cmsgTouchCursorProgressBarText is the spoken and brailled text when the touch cursor is on a progress bar element,
;and when the percentage and value information are both available and different from each other.
;%1 is the percentage text, retrieved from the legacyIAccessible value property, it is typically #%, where # is a percentage number.
;%2 is the progress bar value retrieved from rangeValue.value, it is a number between the progress bar min and max values.
;%3 is the least possible number for value, retrieved from rangeValue.minimum, often it is 0.
;%4 is the greatest possible number for value, retrieved from rangeValue.maximum, it does not need to correspond to 100.
@cmsgTouchCursorProgressBarText
%1 (%2 of %3 - %4)
@@
@msg_OCRDocumentStarted_L
Document OCR started.
@@
;cmsgOCRDocumentNotAvailable is spoken when the script to OCR a PDF document (Insert+Space,O,D) is used anywhere outside of Adobe Acrobat.
@cmsgOCRDocumentNotAvailable
OCR Failed to start.
OCR document is only available inside of Adobe Acrobat.
To OCR a document, you must first open a PDF document in Adobe Acrobat.
@@
@msgOCRNoFileSelected
OCR Failed to start. No file currently selected.
@@
;cmsgOCRSelectedFileNotAvailable is spoken when the script to recognize selected file (Insert+Space,O,F) is used anywhere outside of Windows Explorer.
@cmsgOCRSelectedFileNotAvailable
OCR Failed to start.
To OCR a file, you must open Windows Explorer and select a file to be recognized.
Or, when not in Windows Explorer, you may use the context menu while focus is on a file and choose Recognize With JAWS.
@@
@msgOCRMultipleFilesSelected
OCR Failed to start. Multiple files currently selected.
@@
@msgOCRUnsupportedFileSelected
OCR Failed to start. Unsupported file currently selected.
@@
@msg_OCRCameraStarted_L
Camera OCR started.
@@
@msg_OCRScannerStarted_L
Scanner OCR started.
@@
;cmsg_CameraRecognition and cmsg_ScannerRecognition are Screen sensitive help messages for controls in the Convenient OCR dialog.
@cmsg_CameraRecognition_Camera_ComboBox_ScreenSensitiveHelp
Contains a list of cameras and scanners available as sources for recognition.
@@
@cmsg_CameraRecognition_MotionDetectMultiPageRecognition_Checkbox_ScreenSensitiveHelp
Utilizes the motion detection feature of the camera to determine when to start each page of the recognition.
Motion such as turning the page of a book or placing a new document in the camera's view will cause a new image to be captured and recognized. Recognition will continue until canceled or optionally times out.
@@
@cmsg_CameraRecognition_Timeout_Checkbox_ScreenSensitiveHelp
Enables an inactivity timeout for the Multi-Page Motion Detect mode.
With this setting enabled, should thirty seconds pass with no motion detected by the camera, recognition will stop.
@@
@cmsg_CameraRecognition_Light_ComboBox_ScreenSensitiveHelp
The selection indicates the light mode to use during recognition.
Automatic indicates that the light will be turned on if the camera reports that light levels are too low for image acquisition. This is supported only by the Pearl camera.
On indicates that the light will be on for the duration of the recognition.
Off indicates that the light will not be changed during recognition. Please note, if the light is already on when recognition starts, its state will not be changed by this setting.
@@
@cmsg_CameraRecognition_AdvancedSettings_Button_ScreenSensitiveHelp
Camera and scanner specific advanced settings.
These settings apply to all devices of the currently selected camera or scanner. Changes to these settings will persist between JAWS sessions.
@@
@cmsg_CameraRecognition_LightingCorrection_ComboBox_ScreenSensitiveHelp
Fluorescent light correction frequency flicker correction.
The camera will ensure that its captures are not affected by fluorescent light flicker.
@@
@cmsg_CameraRecognition_Recognize_Button_ScreenSensitiveHelp
Begin the recognition.
@@
@cmsg_ScannerRecognition_UseAutoDocumentFeed_Checkbox_ScreenSensitiveHelp
Use the scanner's automatic document feeder, if one is available.
@@
@cmsg_ScannerRecognition_AdvancedSettings_UserFriendlyName_ReadOnlyEdit_ScreenSensitiveHelp
Scanner user-friendly name.
@@
@cmsg_ScannerRecognition_AdvancedSettings_Interrupt_CheckBox_ScreenSensitiveHelp
Some scanners allow you to interrupt an active scan. Select this item to support that feature.
@@
@cmsg_ScannerRecognition_AdvancedSettings_ContrastAdjustment_CheckBox_ScreenSensitiveHelp
Some scanners can adjust contrast levels based upon brightness. Select this item to support that feature.
@@
@cmsg_ScannerRecognition_AdvancedSettings_CloseTwain_CheckBox_ScreenSensitiveHelp
Some scanners require that TWAIN be reset each time a document is scanned. Select this item to support that feature.
@@
@cmsg_ScannerRecognition_AdvancedSettings_UseDuplex_CheckBox_ScreenSensitiveHelp
Some scanners can scan both sides of a document. Select this item to support that feature.
@@
@msg_OCRAcquisitionOrientation_Normal
Page is right side up.
@@
@msg_OCRAcquisitionOrientation_Sideways
Page is sideways.
@@
@msg_OCRAcquisitionOrientation_UpSideDown
Page is upside down.
@@
@msg_OCRAcquisitionOrientation_SidewaysUpSideDown
Page is sideways upside down.
@@
;cmsgVirtualCursorVerbosityLevel messages are used in Quick Settings Personalized Settings for the virtual cursor verbosity level options.
;They must match the strings in Settings Center for the verbosity level under Web/HTML/PDFs > Reading Options > Verbosity Level.
@cmsgVirtualCursorVerbosityLevelLow
Low
@@
@cmsgVirtualCursorVerbosityLevelMedium
Medium
@@
@cmsgVirtualCursorVerbosityLevelHigh
High
@@
@cmsgScreenShadeOn_L
Screen Shade on
@@
@cmsgScreenShadeOff_L
Screen Shade off
@@
; fallback unavailable message for screen shade
@cmsgScreenShadeUnavailable
Screen Shade unavailable.
@@
@cmsgScreenShadeUnavailableZoomText
JAWS Screen Shade Feature Unavailable while running with ZoomText, must use Fusion.
@@
@cmsgScreenShadeUnavailableMAGic
JAWS Screen Shade Feature Unavailable while running with MAGic.
@@
@cmsgScreenShadeUnavailableWindows7
Screen Shade not available in Windows 7
@@
@cmsgScreenShadeUnavailableSecureDesktop
Screen Shade not available at secure desktop
@@
@CVMSGTab1_l
tabs
@@
@cMsgSelectATab
Select a Tab
@@
@CVMSGArticle1_l
articles
@@
@cMsgSelectAnArticle
Select an article
@@
@cmsgSaveCurrentLocation_L
Location saved.
@@
@cmsgSaveCurrentLocation_S
Saved.
@@
@cmsgSelectFromSavedLocationError_L
First save the start location with %keyfor(DefineATempPlaceMarker), then move to the end of the text you wish to select and press %keyFor(SelectTextBetweenMarkedPlaceAndCurrentPosition).
@@
@cmsgSelectFromSavedLocationError_S
Save start with %keyfor(DefineATempPlaceMarker), then move to end and press %keyFor(SelectTextBetweenMarkedPlaceAndCurrentPosition).
@@
;cmsgTrue and cmsgFalse may be used to speak the state of true or false where JAWS announces a state or condition as true or false.
@cmsgTrue
true
@@
@cmsgFalse
false
@@
; For cmsgRegionNameAndType, %1 is name, %2 is type
@cmsgRegionNameAndType
%1 %2
@@
;cmsgJAWSInspectShowAriaLiveNotification is spoken when the script to open the JAWS Inspect Aria Live viewer opens the viewer.
@cmsgJAWSInspectShowAriaLiveNotification
JAWS Inspect aria live update viewer opened.
@@
@msg_picturesmart_helpscreentitle
Picture Smart Layer Help Screen
@@
@msg_picturesmart_helptext
<h1>The following commands are available in the Picture Smart layer.</h1>
<p>Acquire and describe an image from a Scanner or Freedom Scientific Camera such as PEARL, using the letter A.</p>
<p>From Windows Explorer, you can describe any image file using the letter F.</p>
<p>From the computer screen or application, you can describe a Control with the letter C.</p>
<p>Describe the entire screen using the letter S.</p>
<p>Describe the current application window using the letter W.</p>
<p>By simply pressing Enter, JAWS will choose the most appropriate command based on the current application and its state.</p>
<p>An image can be described by saving it to the "PictureSmart" directory in your  User's "Pictures" folder.</p>
<p>To get full results from all available services, add the shift key to any of the above keystrokes.</p>
<p>To ask a question about the image, add the Alt key to any of the above keystrokes.</p>
<p>To get legacy results without generative AI, add the control key to any of the above keystrokes.</p>
@@
@msg_picturesmart_inprogress
Picture Smart is in progress.
@@
@msg_picturesmart_selectederror
Picture Smart failed to start.
To describe a file, you must open Windows Explorer and select a file.
@@
@msg_picturesmart_noarea
Could not determine the area to Picture Smart.
@@
@msg_picturesmart_nofileselected
Picture Smart failed to start. No file currently selected.
@@
@msg_picturesmart_multiplefileselected
Picture Smart failed to start. Multiple files currently selected.
@@
@msg_picturesmart_fileinsidearchive
Picture Smart failed to start.
To describe this file, you must first extract it from this Zip or archive.
@@
@msg_picturesmart_unsupportedformat
Picture Smart failed to start. Unsupported file currently selected.
@@
@msg_picturesmart_failedtostart
Picture Smart failed to start.
@@
@msg_picturesmart_controlnotgraphic
The current control is not a picture.
@@
@msg_picturesmart_fromcamera_started
Picture Smart started from the camera.
@@
@msg_picturesmart_demomode
Not available without license activation.
@@
@msg_picturesmart_notenabled
Picture Smart is not enabled. Please contact your system administrator for assistance.
@@
@msg_picturesmart_restricted
Picture Smart AI is not enabled. Please contact your system administrator for assistance.
@@
@msg_picturesmart_preliminaryquestionprompt
Ask a question about the image:
@@
@msg_picturesmart_UnavailableScreenShade
Picture Smart cannot describe image while screen shade is on.
@@
@msg_ailabeler_UnavailableScreenShade
Labeling unavailable while screen shade is on.
@@
@msg_ailabeler_demomode
Labeling not available without license activation.
@@
@msg_ailabeler_controlunsupported
Could not label the current type of control.
@@
@msg_ailabeler_noarea
Could not determine the area of the control.
@@
@msg_ailabeler_failed
Error labeling the current control.
@@
@msg_ailabeler_badresponse
Could not label the current control.
@@
@msg_ailabeler_inprogress
Labeling is in progress.
@@
@msg_ailabeler_replacelabeltitle
Replace label
@@
@msg_ailabeler_replacelabeldescription
The current custom label is "%1".
Do you want to replace it with this new label?
"%2"
@@
@cmsgUnknownAuthor
A co-author
@@
@cmsgNamedCoAuth_l
%1 is editing the same line.
@@
@cmsgNamedCoAuth_s
%1 editing same line.
@@
@cmsgUsingDDI
Using Accessibility driver on
@@
@cmsgUsingGDI
Using Accessibility driver off
@@
@msg_SkypeDesktop_HelpScreenTitle
Skype Desktop Application Layer Help Screen
@@
@msg_SkypeDesktop_HelpText
<h1>The following commands are available in the Skype Desktop Application layer.</h1>
<p>Answer incoming call, UpArrow or A.</p>
<p>Disconnect ongoing call, DownArrow or D.</p>
<p>Set focus to Skype Desktop application, S.</p>
@@
;cmsg_Braille_Viewer_ActionFailedDisabled is spoken when a user attempts to navigate the braille  viewer and the viewer is disabled.
@cmsg_Braille_Viewer_ActionFailedDisabled
Action Failed. The Braille Viewer is disabled.
@@
;cmsg_Text_Viewer_ActionFailedDisabled is spoken when a user attempts to navigate the text viewer and the viewer is disabled.
@cmsg_Text_Viewer_ActionFailedDisabled
Action Failed. The Text Viewer is disabled.
@@
;cmsg_Braille_Viewer_Enabling is spoken when a braille viewer is enabled.
@cmsg_Braille_Viewer_Enabling
Enabling the Braille Viewer.
@@
;cmsg_Braille_Viewer_Disabling is spoken when a braille viewer is disabled.
@cmsg_Braille_Viewer_Disabling
Disabling the Braille Viewer.
@@
;cmsg_Text_Viewer_Enabling is spoken when a text viewer is enabled.
@cmsg_Text_Viewer_Enabling
Enabling the Text Viewer.
@@
;cmsg_Text_Viewer_Disabling is spoken when a text viewer is disabled.
@cmsg_Text_Viewer_Disabling
Disabling the Text Viewer.
@@
@cmsgBrailleAndTextViewerHelpScreenTitle
Braille And Text Viewer Layer Help Screen
@@
@cmsgBrailleAndTextViewerHelpText
<h1>The following commands are available in the Braille And Text Viewer layer.</h1>
<p>Turn Text Viewer on or off, T.</p>
<p>Turn Braille Viewer on or off, B.</p>
<h2>Braille Viewer Commands</h2>
<p>Pan left, LeftArrow.</p>
<p>Pan right, RightArrow.</p>
<p>Up one line, UpArrow.</p>
<p>Down one line, DownArrow.</>
<h2>Text Viewer Commands</h2>
<p>Pan left, Control+LeftArrow.</p>
<p>Pan right, Control+RightArrow.</p>
@@
@cmsg_Voice_Assistant_ActionFailed_UnknownError
The Voice Assistant has encountered an error.
@@
@cmsg_Voice_Assistant_ActionFailed_NotInitialized
The Voice Assistant has failed to initialize.
@@
;cmsg_Voice_Assistant_ActionFailedDisabled is spoken when a user attempts to tell perform a voice assistant action like listenting and voice assistant is disabled.
@cmsg_Voice_Assistant_ActionFailedDisabled
Action Failed. The Voice Assistant is disabled.
@@
@cmsg_Voice_Assistant_ActionFailed_NoMicrophone
The Voice Assistant cannot be used without a microphone.
@@
@cmsg_Voice_Assistant_ActionFailed_SpeechService
The Voice Assistant has encountered a speech recognition error.
@@
@cmsg_Voice_Assistant_ActionFailed_SpeechRecognition
The Voice Assistant has failed to start speech recognition.
@@
@cmsg_Voice_Assistant_ActionFailed_AuthenticationFailure
The Voice Assistant has encountered an authentication error. Please check your Internet connection and try again.
@@
@cmsg_Voice_Assistant_ActionFailed_ConnectionFailure
The Voice Assistant has failed to connect to the service. Please check your Internet connection and try again.
@@
@cmsg_Voice_Assistant_ActionFailed_ServiceTimeout
The Voice Assistant service has timed out. Please check your Internet connection and try again.
@@
@cmsg_Voice_Assistant_ActionFailed_ServiceError
The Voice Assistant has encountered a service error. Please check your Internet connection and try again.
@@
@cmsg_Voice_Assistant_ActionFailed_ServiceUnavailable
The Voice Assistant service is not available at this time. Please check your Internet connection and try again.
@@
@cmsg_Voice_Assistant_ActionFailed_KeyServiceError
The Voice Assistant has failed to communicate with the key service. Please check your Internet connection and try again.
@@
;cmsg_Voice_Assistant_SpeechRecognized messages are spoken if an error is encountered when issuing a speech command
@cmsg_Voice_Assistant_SpeechRecognized_Empty
Sorry, I didn't hear anything.
@@
@cmsg_Voice_Assistant_SpeechRecognized_Unknown
Sorry, I didn't catch that.
@@
@cmsg_Voice_Assistant_SpeechRecognized_RequiresMSWord
Please go to Word to use this.
@@
@cmsg_Voice_Assistant_SpeechRecognized_RequiresMSOutlook
Please go to Outlook to use this.
@@
@cmsg_Voice_Assistant_SpeechRecognized_RequiresMSWordOrOutlook
Please go to Word or Outlook to use this.
@@
@cmsg_Voice_Assistant_SpeechRecognized_InvalidVoiceRate
Voice rate must be between 0 and 100 percent.
@@
@cmsg_Voice_Assistant_SpeechRecognized_NoJokeAvailable
Sorry, I don't have a joke right now.
@@
@cmsg_Voice_Assistant_SpeechRecognized_ExitJawsDialog
Please exit the JAWS dialog to use this.
@@
; Generic "enabled" and "Disabled" state string messages:
@cmsgEnabled
enabled
@@
@cmsgDisabled
disabled
@@
;%1 value of the UIA_LineSpacingAttributeId  UIA text attribute
@cmsgLineSpacing
Line spacing %1
@@
@cmsgNoNotification
No notification
@@
@cmsgNotificationsDisabled
Enable Accessible Notification Events is turned off in Settings Center.
@@
@cmsgIgnoreVolumeControlNotifications
Ignore Notifications from Volume Control
@@
@cmsgAllowVolumeControlNotifications
Allow Notifications from Volume Control
@@
; for cmsgToggleWakeWordListen and cmsgToggleWakeWordIgnore, %1 = the Wake Word found in Default.jcf VAWakeWord=Sharky
@cmsgToggleWakeWordListen
%1 is listening
@@
@cmsgToggleWakeWordIgnore
%1 is no longer listening
@@
; for cmsgPanTextByParagraphOnOrOff, %1 = the "on" or "off strings from cmsgOn and cmsgOff
@cmsgPanTextByParagraphOnOrOff
Pan Text by Paragraph %1
@@
@cmsgURLNotFound_L
URL not found
@@
@cmsgURLNotFound_S
not found
@@
;for cmsgVoiceRatePercent, %1 = percentage of the voice rate.
@cmsgVoiceRatePercent
%1%%
@@
; for cmsgJAWSVersion, cmsgMAGicVersion, cmsgFusionVersion and cmsgZoomTextVersion
; %1 is the product version string as presented by the application resource.
@cmsgJAWSVersion
JAWS version %1
@@
@cmsgMAGicVersion
MAGic version %1
@@
@cmsgZoomTextVersion
ZoomText version %1
@@
@cmsgFusionVersion
Fusion version %1
@@
@cmsgActiveConfigurationInfo
Current settings: %1.
Current application: %2.
Active configuration: %3.
Current Speech and Sounds Scheme: %4.
@@
@cmsgVersionDetails
Version Details Information:
@@
@cmsgScriptsRevision
Scripts Revision: %1
@@
@cmsgVersionDetailsCopiedToClipboard
Version Details Copied To Clipboard
@@
@cmsgQuickAccessBarDoubleShortcut
This shortcut has two actions. Activate the shortcut by selecting it with ENTER, then adjust the value with the UP and DOWN ARROW keys. To deactivate the shortcut, press ENTER again or ESC.
@@
;msgMathEditorError messages are spoken when the ShowMathEditor script fails to launch the Braille Math editor
@msgMathEditorError_FailedToLaunch
Failed to start the Braille Math Editor.
@@
@msgMathEditorError_ContractedBrailleNotEnabled
Contracted braille must be enabled to use the Braille Math Editor.
@@
@msgMathEditorError_Windows10Required
The Braille Math Editor feature is only available on Windows 10 and above.
@@
@msgMathEditorError_LanguageNotSupported
The Braille Math Editor is not supported by the current Braille language.
@@
@msgMathEditorError_NotEnabled
This feature requires services that connect to the Internet which were disabled using a specific option during JAWS installation. Please contact your system administrator for assistance.
@@
@msgMathEditorError_WordVersionNotSupported
The Braille Math Editor is not supported with this version of Microsoft Word.
@@
; msgMathViewerError messages are spoken when the ShowMathViewer script fails to launch the Math Viewer
@msgMathViewerError_NoMathML
Not on math content
@@
@msgMathViewerError_NotEnabled
This feature requires services that connect to the Internet which were disabled using a specific option during JAWS installation. Please contact your system administrator for assistance.
@@
; Email navigation messages
@CMSGSentByAndAt
%1 on %2
@@
@CMSGReachedTopOfEmailChain
Top of email thread
@@
; The following messages are used by the GetDebugLevelName function in say.jss.
; These messages are spoken when UtilityChangeDebugLevel is used.
@msgUnknownDebugLevelFormat
Unknown debug level %1
@@
@msgAlwaysDebugLevel
ALWAYS
@@
; The following message is spoken when UtilityToggleSpeakingOfDebugMessages is used.
@msgSpeakingOfDebugMessagesFormat
Speaking of debug messages is now %1.
@@
; The following message is spoken when UtilityChangeDebugLevel is used.
@msgChangeDebugLevelFormat
The debug level is now set to %1.
@@
@cmsgNoPreferredBrailleProfileListConfigured_L
No  Preferred Braille profile list configured.
@@
@cmsgNoPreferredBrailleProfileListConfigured_S
No list configured.
@@
@cmsgBrailleProfileStateCompInOut
Computer Braille
@@
@cmsgBrailleProfileStateCompInContractedOut
Contracted out/Computer in
@@
@cmsgBrailleProfileStateContractedInOut
Contracted Braille
@@
; SoundMixer messages
@cMsgRoutedLeft_l
JAWS is routed to the left
@@
@cMsgRoutedLeft_s
Left
@@
@cMsgRoutedRight_l
Jaws is routed to the right
@@
@cMsgRoutedRight_s
Right
@@
@cMsgRestoredBalance_l
Balance has been restored for all apps
@@
@cMsgRestoredBalance_s
Balance restored
@@
@cMsgSoundMixerError_UnsupportedDevice
Unsupported audio device. We are unable to route JAWS.
@@
@cMsgSoundMixerError_GenericError
An error has occurred, and we were unable to route JAWS. Error code %1
@@
;VisperoConnectMsg is the text shown in Insert+F1 on a web page where the Vispero Connect feature is available for the web site.
@VisperoConnectMsg
Provide Feedback on the page or application using JAWS Connect
@@
;VisperoConnectDocLoadMsg is the text spoken after page load on a web page where the Vispero Connect feature is available for the web site.
@VisperoConnectDocLoadMsg
Feedback Enabled for this website using JAWS Connect. Press %KeyFor(SelectALink) for link.
@@
@cMsgSelectionDeleted
Selection deleted
@@
; %1 on or off
@cmsgShowTimeInStatusCells_L
Show time in status cells %1
@@
@cmsgShowTimeInStatusCells_S
show time %1
@@
; for cmsgMicrosoftWindowsVersionTemplate, you shouldn't have to translate this, but these are tokens for the version info of Windows.
; They come from the system registry so you don't really need to get them:
; %1 is the major OS version, 10, 11, 8, etc.
; %2 is DisplayVersion from registry
; %3 is Current Build, the minor build that comes after the decimal point
; %4 is the edition: Pro, Student, or whatever they show in the registry.
; %5 is the OS literal major / minor version, e.g 10.0, 8.1
@cmsgMicrosoftWindowsVersionTemplate
Microsoft Windows %1 %4 %2 %5.%3
@@
; for cmsgMicrosoftWindows10AndHigherVersionTemplate, these are tokens for the version info of Windows.
; They come from the system registry so you don't really need to get them:
; %1 is the major OS version, 10, 11, etc.
; %2 is DisplayVersion from registry
; %3 is Update Build Revision, the revision that comes after the decimal point
; %4 is the edition: Pro, Student, or whatever they show in the registry.
; %5 is Current Build, the build that comes before the decimal point and revision number
; %6 is the system type which is the processor architecture this os targets
@cmsgMicrosoftWindows10AndHigherVersionTemplate
Microsoft Windows %1 %4 Version %2 (OS Build %5.%3), System Type %6
@@
@cmsgNoVisperoConnectLink_l
Vispero Connect Feedback is not supported for this application or website.
@@
@cmsgNoVisperoConnectLink_s
Feedback not supported
@@
; We can't tie an app name to a notification
@cmsgUnknownApp
Unknown app
@@
@cmsgSelectAGlanceHighlight
Select a Smart Glance Highlight
@@
@cvmsgGlanceHighlights
Glance Highlights
@@
@cmsgSmartGlanceHighlightIndicate_L
There are %1 Smart Glance Highlights on this page.
@@
@cmsgSmartGlanceHighlightIndicate_S
%1 Smart Glance Highlights
@@
; Toast Notification processing
@cMsgToastNotificationProcessingEnabled_l
Toast notification announcements enabled
@@
@cMsgToastNotificationProcessingEnabled_s
Toasts enabled
@@
@cMsgToastNotificationProcessingDisabled_l
Toast notification announcements disabled
@@
@cMsgToastNotificationProcessingDisabled_s
Toasts disabled
@@
;Messages used as names of ZoomText Tethered View Scenarios.
;These will be displayed to the user in the Fusion UI, Magnifier tab>Window>Tethered View>Settings
@cmsgZTTetheredViewScenarioLinksListAddress
Links List Address
@@
; cmsgNavigateFromTableCaptionFailedHlp is spoken when the user attempts to use table navigation while on a table caption and the navigation cannot be performed.
@cmsgNavigateFromTableCaptionFailedHlp
You are on the table caption. You can use alt+Control+Down or Alt+Control+Home to move directly to the first cell in the table.
@@
; cmsgTableCaptionTypeTextforSayCell is spoken if the user presses SayCell while on a table caption,
; and text could be retrieved for the caption.
; It is spoken after the caption text.
@cmsgTableCaptionTypeTextforSayCell
table caption
@@
; cmsgTableSummaryTypeTextforSayCell is spoken if the user presses SayCell while on a table summary,
; and text could be retrieved for the summary.
; It is spoken after the summary text.
@cmsgTableSummaryTypeTextforSayCell
table summary
@@
; cmsgNavigateTableFailedHlp is spoken when the user attempts to use table navigation while on a table start or end string,
;or on a heading inside a table but not in a table cell.
@cmsgNavigateTableFailedHlp
You are on a table, but not in a table cell. You can use alt+Control+Down or Alt+Control+Home to move directly to the first cell in the table.
@@
; cmsgNavigateFromTableEndFailedHlp is spoken when the user attempts to use table navigation while on a table end string.
; Note that for this scenario we cannot provide a way for table navigation to move back into the table from the end string.
;This message is only spoken if function InTable returns true. If InTable returns false, cMSGNotInTable_l is spoken.
@cmsgNavigateFromTableEndFailedHlp
You are at the end of a table. You must move back into the table to navigate it using table navigation.
@@
;cmsgNewCell is used when cell coordinates are off and user navigates to new cell by character, word or line:
@cmsgNewCell
new cell
@@
; cmsgPlaceholder is used when the user navigates to an empty edit field.
; Web page authors may define a short text string (a placeholder) associated with an edit field
; that is shown instead of the value when the edit field is empty. The placeholder can be an example,
; a hint or a suggested format of the value to be entered by the user in the edit.
; The placeholder is removed from the screen when the user types anything into the edit field.
; When the user navigates to the empty field, JAWS speaks the cmsgPlaceholder message plus
; the placeholder value provided by the web page author.
@cmsgPlaceholder
placeholder
@@
; For cmsgSplitDataLine, %1 is the line index
@cmsgSplitDataLine
line %1
@@
@cmsgSetBrailleViewSSHList
This list contains the various Braille views which may be selected for the current context.
Use up or down arrows to select the desired view
and press Enter to make the view active.
You can also use tab and shift tab to navigate the rest of the controls in the dialog.
@@
@cmsgSetBrailleViewSSHDesc
This field contains a description of the currently selected Braille view.
Navigate it with standard reading commands as in a read only edit control.
You can also use tab and shift tab to navigate the rest of the controls in the dialog.
@@
@cmsgSetBrailleViewSSHDefault
Activating this button will return the Braille view to its default for this context.
@@
@cmsgSetBrailleViewSSHSwap
Activating this button will swap the regions so that the main and split information will be on opposite sides of the display.
@@
@cmsgSetBrailleViewSSHOptions
Activate this button to select options for this Split Braille mode.
@@
;msgManageCall_Title is the title of the dialog invoked by the ManageCall script.
@cmsgManageCall_Title
Manage Call
@@
@msgManageCall_SkypeDeclineNotSupported
Declining calls is not supported for Skype.
@@
@cmsgNoOptionsForSplitMode
No options may be configured for this Braille Split Mode.
@@
@sshcmsg_ManageCall_AppList
This list contains the available apps supported by the Manage Call dialog.  Use Up Arrow, Down Arrow, or the app's first letter to move to a particular app.  Press enter to accept an incoming call with audio using the selected app.
For other options regarding this list, press tab.
@@
@sshcmsg_ManageCall_AcceptWithAudioButton
Choosing this button will accept an incoming call with audio for the app selected in the list.
@@
@sshcmsg_ManageCall_AcceptWithVideoButton
Choosing this button will accept an incoming call with video for the app selected in the list. For apps that do not support the accept with video option, the accept with audio option will be used instead.
@@
@sshcmsg_ManageCall_DeclineButton
Choosing this button will decline an incoming call for the app selected in the list. Note, not all apps support this functionality.
@@
@sshcmsg_ManageCall_HangUpButton
Choosing this button will hang up an active call for the app selected in the list.
@@
@sshcmsg_ManageCall_MakePrimaryButton
Choosing this button will make the app selected in the list appear at the top of the list for subsequent uses of the Manage Call dialog.
@@
@sshcmsg_ManageCall_CancelButton
Choosing this button will close the Manage Call dialog without taking any action on a call.
@@
; Text prior to the colon is shown in the SetBrailleView list.
; Text after the colon is the help text shown in the readonly edit.
; %1 is the word on or off.
@cmsgSplitCommandHistory
Command Prompt History Split %1:Select this option to show lines above the current command in the split region.  You can independently pan through the command history without losing your place in the current command line.
@@
;%1 on or off
@cmsgRebufferOnEnterToggle
Refresh buffered document on Enter %1
@@
@cmsgBrailleSplitBufferError
Braille must be set to Split Buffered Text to use this feature.
@@
;%1 bookmark number
@cmsgSplitBufferBookmark
Set bookmark %1
@@
;%1 bookmark number
@cmsgSplitBufferBookmarkNotSet
bookmark %1 not set.
@@
@cmsgBrlSplitBufLayerFlash
dot 1-8 go bkmrk, Shft1+dot 1-8 set bkmrk, Dots 123 go start, Dots 456 go end, other cancel.
@@
@cmsgStartOfBuffer_L
Start of buffer
@@
@cmsgStartOfBuffer_S
Start
@@
@cmsgEndOfBuffer_L
End of buffer
@@
@cmsgEndOfBuffer_S
end
@@
;cmsgMeetingStatus_Sharing and cmsgMeetingStatus_NotSharing are used to indicate the status of screen sharing in meetings, such as Teams
@cmsgMeetingStatus_Sharing
Sharing
@@
@cmsgMeetingStatus_NotSharing
Not sharing
@@
;cmsgMeetingStatus_Muted and cmsgMeetingStatus_Unmuted are used to indicate the status of the microphone in meetings, such as Teams
@cmsgMeetingStatus_Muted
Muted
@@
@cmsgMeetingStatus_Unmuted
Unmuted
@@
@cmsgMeetingStatus_Unavailable
Meeting status unavailable
@@
;For msgTeamsMeetingStatus_L and msgTeamsMeetingStatus_S,
;%1 is either cmsgMeetingStatus_Muted or cmsgMeetingStatus_Unmuted
;%2 is either cmsgOn or cmsgOff
;%3 is either cmsgMeetingStatus_Sharing or cmsgMeetingStatus_NotSharing
@msgTeamsMeetingStatus_L
Microphone %1
Camera %2
%3 screen
@@
@msgTeamsMeetingStatus_S
%1
Camera %2
%3
@@
@DoNotShowAgain
Do not show this message again
@@
@ShowMathEditorErrorTitle
Braille Math Editor is unavailable
@@
@ShowMathViewerErrorTitle
Math Viewer is unavailable
@@
@cmsgBackgroundOCRStarted_L
Background OCR started
@@
@cmsgBackgroundOCRStarted_S
Background OCR
@@
@cmsgBackgroundOCRCancelled_L
Background OCR cancelled
@@
@cmsgBackgroundOCRCancelled_S
OCR cancelled
@@
@cmsgBackgroundOCRInProgress_L
Background OCR is enabled
@@
@cmsgBackgroundOCRInProgress_S
Background OCR 
@@
@cmsgWindowMaximized
maximized
@@
@cmsgWindowMinimized
minimized
@@
@cmsgWindowRestored
restored
@@
@cmsgWindowNotResizable_L
Focus is not in a resizable window
@@
@cmsgWindowNotResizable_S
not resizable
@@
@cmsgCannotMaximize_L
This window cannot be maximized
@@
@cmsgCannotMaximize_S
cannot maximize
@@
@cmsgCannotMinimize_L
This window cannot be minimized
@@
@cmsgCannotMinimize_S
cannot minimize
@@
; Snap is a MS Windows term - https://support.microsoft.com/en-us/windows/snap-your-windows-885a9b1e-a983-a3b1-16cd-c531795e6241
@cmsgWindowSnapTop
top
@@
@cmsgWindowSnapBottom
bottom
@@
@cmsgWindowSnapLeft
left
@@
@cmsgWindowSnapRight
right
@@
@cmsgWindowSnapMiddle
middle
@@
;For cmsgWindowSnappedHalf,
;%1 is one of the directions defined by cmsgWindowSnapTop, cmsgWindowSnapBottom, cmsgWindowSnapLeft, or cmsgWindowSnapRight.
;When the window has just snapped to a new display,
;%2 will be cmsgWindowDisplay.
@cmsgWindowSnappedHalf
snapped %1 half %2
@@
;For cmsgWindowSnappedTwoThirds,
;%1 is one of the directions defined by cmsgWindowSnapTop or cmsgWindowSnapBottom.
;When the window has just snapped to a new display,
;%2 will be cmsgWindowDisplay.
@cmsgWindowSnappedTwoThirds
snapped %1 two thirds %2
@@
;For cmsgWindowSnappedThird,
;%1 is one of the directions defined by cmsgWindowSnapTop, cmsgWindowSnapBottom, or cmsgWindowSnapMiddle.
;When the window has just snapped to a new display,
;%2 will be cmsgWindowDisplay.
@cmsgWindowSnappedThird
snapped %1 third %2
@@
;For cmsgWindowSnappedQuarter,
;%1 is one of the directions defined by cmsgWindowSnapTop or cmsgWindowSnapBottom.
;%2 is one of the directions defined by cmsgWindowSnapLeft or cmsgWindowSnapRight.
;When the window has just snapped to a new display,
;%3 will be cmsgWindowDisplay.
@cmsgWindowSnappedQuarter
snapped %1 %2 quarter %3
@@
;For cmsgWindowVisualState,
;%1 will be one of cmsgWindowMaximized, cmsgWindowMinimized, or cmsgWindowRestored,
;%2 will be cmsgWindowDisplay
@cmsgWindowVisualState
%1 %2
@@
;For cmsgWindowDisplay,
;%1 is the display number a window is on.
;This will then be used in cmsgWindowVisualState or one of the cmsgWindowSnapped messages.
@cmsgWindowDisplay
on display %1
@@
@cmsgLeavingList
exit list
@@
@cmsgLeavingNestedList
exiting list nesting level %1
@@
;Used when item count is unknown
@cmsgEnteringListNoItemCount
Entering List
@@
@cmsgEnteringNestedList
list of %1 items nesting Level %2
@@
@cmsgEnteringList
list with %1 items
@@
@msgFSCompanionError_FailedToLaunch
Failed to open FSCompanion.
@@
@msgFSCompanionError_Restricted
FSCompanion not available in restricted environments.
@@
@msgFSCompanionError_NotUserDesktop
FSCompanion is only available on the user desktop.
@@
@msgFSCompanionError_NotConnected
FSCompanion requires services that connect to the Internet which were disabled during installation. Please contact your system administrator for assistance.
@@
@msgAskFSCompanionHotKeyLink
Ask FSCompanion %KeyFor(LaunchFSCompanion)
@@
;cmsgCommaSpaceSeparator is for general use when needing to speak items with pauses between them
@cmsgCommaSpaceSeparator
, 
@@
; For localizing the Computer Braille indicator symbol
@cmsgCompBrlIndicator
_+
@@
@msgSelectActionTitle
Select an Action
@@
@msgNoActionsAvailable
No ARIA actions available!
@@
@msgFailedToInvokeAction
Could not complete action!
@@
@msgBrailleProfileNotSupported
Not available for the current Braille profile!
@@
@msgContractedBrailleMustBeEnabled
Contracted braille must be enabled to view math content.
@@
@msgNemeth
Nemeth
@@
@msgUEBMath
UEB Math
@@
@msgRestrictedToDocument_L
Restricted to document
@@
@msgRestrictedToDialog_L
Restricted to dialog
@@
@msgRestricted_S
Restricted
@@
@msgSuggestionsAvailable
Suggestions Available
@@
@msgLabelManagerDialog_NotAvailable
Custom labels are not available in this application.
@@
@msgLabelManagerDialog_ListHelp
This list contains the custom labels defined for the current web domain or document.
To edit a label, select it from the list, TAB to the Edit Label button, and press SPACEBAR.
To delete a label, select it from the list, TAB to the Delete Label button, and press SPACEBAR.
@@
@msgLabelManagerDialog_EditLabelHelp
Choose this button to edit the custom label currently selected in the list.
@@
@msgLabelManagerDialog_DeleteLabelHelp
Choose this button to delete the custom label currently selected in the list.
@@
; msgUnicodeBrailleInput messages are spoken when unicode braille input is toggled on or off.
@msgUnicodeBrailleInputOn
Unicode braille input on
@@
@msgUnicodeBrailleInputOff
Unicode braille input off
@@
EndMessages

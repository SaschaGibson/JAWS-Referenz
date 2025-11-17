; Copyright 1998-2018  by Freedom Scientific BLV Group, LLC
; script header file for the JAWS user interface

Const
; Automation IDs for Quick Access Bar
	AutomationID_PinButton = "PinButton",
	AutomationID_UnpinButton = "UnpinButton",
	AutomationID_ShortcutsView= "ShortcutsView",
	AutomationID_ShortcutsList = "Shortcuts",
	AutomationID_ZoomButton = "DoubleShortcut_IncreaseMagnification",
	AutomationID_ZoomSlider = "DoubleShortcut_Slider_Zoom",
	AutomationID_ZoomOutButton = "DoubleShortcut_Decrease_Zoom",
	AutomationID_ZoomInButton = "DoubleShortcut_Increase_Zoom",
	AutomationID_SpeechButton = "SingleShortcut_ToggleSpeech",
	AutomationID_SpeechRateButton = "DoubleShortcut_IncreaseSpeechRate",
	AutomationID_SpeechRateSlider = "DoubleShortcut_Slider_Speech Rate",
	AutomationID_DecreaseSpeechRateButton = "DoubleShortcut_DecreaseSpeechRate",
	AutomationID_IncreaseSpeechRateButton = "DoubleShortcut_IncreaseSpeechRate",
	AutomationID_ColorButton = "SingleShortcut_ToggleColorEnhancements",
	AutomationID_SpeechHistoryButton = "SingleShortcut_ShowSpeechHistory",
	AutomationID_MouseEchoButton = "SingleShortcut_MouseEchoMode",
	AutomationID_JAWSManagerButton = "SingleShortcut_RunJAWSManager",
	AutomationID_SelectVoiceProfileButton = "SingleShortcut_SelectAVoiceProfile",
	AutomationID_ShowShortcutNamesButton = "ShowShortcutNamesButton",
	AutomationID_ShortcutNamesCustomizeButton = "CustomizeButton",
 ; Help ID constants for GetVoices utility.
; These are never to be localized, even if they have the appearance of being readable text
;This utility is written in WPF and so we'll use GetAutomationID instead of GetControlID which wouldn't work:
	HelpID_SelectALanguage = "SelectALanguageComboBox",
	HelpID_PremiumVoices = "SelectVoicesListBox",
	HelpID_PlaySample = "PlaySampleButton",
	HelpID_InstallSelectedVoices = "InstallSelectedVoicesButton",
	HelpID_RemoveAVoice = "RemoveAVoiceButton",
	HelpID_RemoveAllCompactVoices = "RemoveCompactVoicesButton",
	HelpID_RemoveAllVoices = "RemoveAllVoicesButton",
	HelpID_RemoveSelectedVoices  = "RemoveSelectedVoicesButton",
	HelpID_Close = "CloseButton",
	;do not translate,
	;compare for remote speech:
	scRemote = "vcSpeech",
	;Do not translate, "Fake synth key for loop:
	Synth_Remote = "Synth9999",
;Ini settings and info
	FILE_JFW_INI = "jfw.ini",
	FILE_IE="\\BrowseUI.dll",
	SECTION_BRAILLE_DISPLAYS = "BrailleDisplays",
	HKEY_SYNTH = "Synthesizer",
	HKEY_SYNTH_X="Synth%1",
	HKEY_BRAILLE_DISPLAY="BrailleDisplay",
	HKEY_BRAILLE_DISPLAY_X="Braille",
	DISPLAY_NAME_FSBRL = "fsbrl",
; window classes
	wc_JAWS = "JFWUI2",
	wc_EmptySpace = "AfxFrameOrView42",
; Control ID
	;For the main JAWS window, when not running from the system tray:
		id_JAWSMainWindow = 7016,
	; Advanced options dialog under Basic dialog.
		id_Advanced_Options_Button = 1192,
		id_Automatic_Updates_Available_Checkbox = 7039,
		id_Launch_PACMate_At_StartUp = 7040,
		id_Try_Remote_Access_Speech_On_StartUp = 7072,
		id_Try_Remote_Access_Braille_On_StartUp = 7073,
		id_UseAuthorizationFromPm = 7097,
		id_EnableRemoteAccessClient = 7074,
		id_EnableRemoteAccessServer = 7075,
		id_RunJAWSwithoutspeech = 7160,
		id_VOLUME = 1054,
		ID_DEFAULTS=1055,
		IDC_MSG1_STATIC=1125,
		IDC_MSG2_STATIC=1126,
		IDC_NUM_PITCH2_PROMPT=1127,
		IDC_NUM_PITCH2_DETAILS=1128,
		IDC_NUM_PITCH3_PROMPT=1129,
		IDC_NUM_PITCH3_DETAILS=1130,
		IDC_NUM_PITCH4_PROMPT=1131,
		IDC_NUM_PITCH4_DETAILS=1132,
		IDC_NUM_PITCH2=1104,
		IDC_NUM_PITCH3=1002,
		IDC_NUM_PITCH4=1004,
	;for Basic Options dialog
		id_AnnounceMenuCont = 1156,
		id_TurnOffMenuCont = 1155,
		id_AnnCustomMsgOnly = 1154,
		id_AuttoStart = 1149,
		id_RunFromTray = 1150,
		ID_KEYBOARD_LAYOUT_WIZARD = 1151,
		id_ShowVirtualViewerOn = 1188,
		id_AutomaticNotificationOfUpdates = 7197,
		id_help = 1033,
		ID_REGISTER = 1055,
		id_Modify_System_Parameters_Button = 1191,
	;for Windows System Parameters
		id_Sticky_Key_Toggle = 1336,
		id_Disable_Pointer_Shadow = 1337,
		id_Hide_Keybd_Indication = 1339,

		ID_BRAILLE_LANGUAGE_COMBOBOX = 1058,
		ID_BRAILLE_OUTPUT_COMBOBOX = 7245,
		ID_BRAILLE_INPUT_COMBOBOX = 7223,

;		ID_GRADE2_TRANSLATOR = 1199,
;		ID_CONTRACTED_COMBOBOX = 5145, ; Off / contracted output / contracted input and output
;		ID_CONTRACTED_LANGUAGE = 7222, ; language for translator modes to use
;		ID_CONTRACTED_MODE = 7244, ; mode / rule set of translator to use

		ID_GRADE2_EXPANDWORD = 1200,
		ID_ENABLE_FLASH_MESSAGES = 7200,
		ID_WORDWRAP_CHECKBOX = 7201,
		ID_REVERSEPANNINGKEYS_CHECKBOX = 7202,
		ID_BRAILLEMODE_COMBOBOX = 7227,
		ID_POSITIONOFSTATUSCELLS_COMBOBOX = 7228,
		ID_DOTFIRMNESS_SLIDER = 7229,
		ID_PRIMARYBRAILLETABLE_COMBOBOX = 7230,
	;for voice settings and voice profiles:
		id_voice_profiles_modify_default_RadioButton = 1117,
		id_voice_profiles_modify_default_COMBOBOX = 7187,
		id_voice_profiles_modify_application_RadioButton = 1118,
		id_voice_profiles_modify_APPLICATION_COMBOBOX = 7188,
		id_voice_profiles_context_voice_combo = 1148,
		id_voice_profiles_profile_name_combo = 7087,
		id_voice_profiles_set_as_default_button = 7029,
		id_voice_profiles_speak_sample = 7232,
		id_voice_profiles_delete_button = 7088,
		id_voice_profiles_synthesizer_name_combo = 7090,
		id_voice_profiles_synthesizer_language_combo = 7091,
		id_voice_profiles_detect_SAPI_4_synthesizers_button = 7092,
		id_voice_rate_slider = 1002,
		id_voice_profiles_rate_slider = 10996,
		id_voice_Punctuation_combo = 1007,
		id_volume_ducking_checkbox = 7246,
		id_voice_assistant_checkbox = 7247,
		id_voice_Person_combo = 1006,
		id_voice_pitch_slider = 1003,
		id_voice_profiles_pitch_slider = 11000,
		id_Voice_profiles_volume_slider = 11003,
		id_voice_spell_rate_change_edit = 7013,
		ID_voice_UPPERCASE_EDIT = 1103,
		id_voice_profiles_SayAll_synthesizer_combo = 7142,
		id_voice_profiles_SayAll_rate_slider = 7149,
		id_voice_profiles_SayAll_punctuation_combo = 7144,
		id_voice_profiles_SayAll_person_combo = 7145,
		id_voice_profiles_SayAll_pitch_slider = 7152,
		id_voice_profiles_SayAll_volume_slider = 7158,
		id_voice_profiles_save_as_button = 7098,
		id_apply_button = 1056,
		id_voice_restore_to_default_button = 1055,
	;out of voice settings and foice profiles.
		ID_AutomaticallyStartJAWSWizard = 7125,
		id_SAPI_DURING_SAYALL = 5120,
	;for the cursor and message voice settings dialog
		ci_Voice_to_Modify_combo = 1148,
		ci_Punctuation_combo= 1007,
		ci_Person_combo = 1006,
		ci_rate = 1002,
		ci_ApplyButton = 1056,
	;for the braille basic settings dialog
		id_modify_settings_btn = 1172,
		id_add_display_btn = 1171,
		id_advanced_btn 1165,
		id_default_brl_dsply = 1178,
		id_translation_table = 1104,
	;for graphics labeler
		id_applicationFile_rdb = 1081,
		id_default_rdb = 1082,
		id_bothFiles_rdb = 1083,
		id_SpokenLabel = 1012,
		id_BrailleLabel = 1013,
	;For Video Intercept:
		ID_VIDEO_EXECUTE=2006,
		ID_VIDEO_HELP=2007,
		ID_VIDEO_CLOSE=2,
	;for the Manage Application Settings dialog:
				id_ManageApplicationSettings_ListBox = 4241,
		id_DisableAllBtn = 4242,
		ID_EnableAllBtn = 4243,
		id_RemoveSelectedBtn = 1321,
	;for the Access Code:
		id_Access_Code_Button = 13,
		id_Access_Code_Edit = 1318,
	;Windows Vista "Automatically Start JAWS ..."
		ID_AutomaticallyStartJAWS = 7033,
		ID_PromptToConfirmWhenExitingJAWS = 59815,
		ID_StartJAWSLogonScreen = 7130,
		ID_StartJAWSAllUsers = 7131,
		ID_StartJAWSThisUser = 7132,
		ID_Finish = 12325,
	; Welcome dialog box
	IDC_WELCOME_MESSAGE_EDIT = 1300,
	IDC_CONFIRM_WHEN_EXITING_JAWS = 59820



globals
	handle GlobalRealWindow,
	string GlobalRealWindowName,
	int gbRealWindowSpoken

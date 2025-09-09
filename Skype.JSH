; Copyright 1995-2015 by Freedom Scientific, Inc.
; JAWS 11.0.xxx
;Skype header file

CONST
;notifier types:
	NOTIFIER_CALL	1,
	NOTIFIER_CHAT	2,
	NOTIFIER_NOTIFICATION 3,
;string compares
	sc_chatstyle="chatstyle", ; for chat appearance listbox control in Options dialog
; Window Classes...
	wcSkypeCheckboxInDialog = "TAccessibleRichCheckBox", ; can contain a link
	wcSkypeWidget = "TWidgetControl",
	wc_ScreenSharing = "TScreenSharingDialog",
	WC_HOTKEYS_LIST = "TAccessibleListView",
	wc_About_Dialog = "TAboutSplash",
	wc_Notification_IncomingCaller = "TCallNotificationWindow",
	wc_Notification_MSAA_Alert = "TAccAlert",
	wc_notification_incoming_chat_parent = "TConversationForm",
	wc_chat_edit_parent = "TChatEntryControl",
	wc_notification_incoming_chat = "TChatContentControl",
	wc_notification_incoming_chat2 = "TConversationsControl",
	wc_notification_tray_alert = "TTrayAlert",
	wc_OptionTabCaption="TOptionTabCaptionControl",
	wc_TPanel="TPanel",
	wc_ChatEditWindow="TRichViewEdit ",
	WC_ChatEditWindowSkype5 = "TChatRichEdit",
	wc_ChatAppearanceListboxControl="TChatContentControl", ; occurs when the combo box in the Chat Appearance page of Options dialog gains focus.
	wc_CallQualityButton = "TSkZapActionButton",
	WC_CheckBox = "TTntCheckBox.UnicodeClass",
	WC_RadioButton = "TTntRadioButton.UnicodeClass",
	WC_OptionsDialogue = "TOptionsForm",
	WC_Skype4OptionsDialogue = "TOptionsForm.UnicodeClass",
	WC_OptionsTreeView = "TOptionsTreeView", ; for Skype 4, see wc_dialog_pages_tree for newer.
	WC_Edit = "TMaskEdit",
	WC_AccessibleEdit = "TAccessibleTntEdit.UnicodeClass",
	WC_Page = "TTntTabSheet.UnicodeClass",
	wc_Dialog_Page = "TTabSheet",
	wc_dialog_pages_tree = "TOptionsPanel",
	WC_Link = "TRichLabel",
	WC_ComboBox = "TTntComboBox.UnicodeClass",
	wcCountryComboBox = "TCountryComboBox",
	WC_ScrollBox = "TTntScrollBox.UnicodeClass",
	WC_Panel = "TTntPanel.UnicodeClass",
	WC_Button = "TTntButton.UnicodeClass",
	WC_StandardEdit = "Edit",
	WC_NormalEdit = "TTntEdit.UnicodeClass",
	WC_ListBox = "TTntStringGrid.UnicodeClass",
	WC_Listbox2 = "TTntListBox.UnicodeClass",
	WC_CheckableListbox = "TTntCheckListBox.UnicodeClass",
	WC_Skype4CheckableListbox = "TDevicesGrid.UnicodeClass",
	WC_AccessibleCheckableListbox = "TAccessibleTntListView.UnicodeClass",
	WC_CheckabelListView = "TTntListView.UnicodeClass",
	WC_Panner = "TBannerControl",
	WC_ContactList = "TMainUserList",
	WC_Skype4ContactList = "TConversationList",
	WC_ConversationList = "TInboxList",
	WC_HistoryList = "THistoryList",
	wc_HistoryEventsList="TMyselfControl",
	WC_Skype4SkypeStyleMenuBar = "TChromeMenu.UnicodeClass",
	WC_ContactListFilterEdit = "TNavigableTntEdit.UnicodeClass",
	WC_VolumeControl = "TVolumeControl",
	WC_Skype6CheckableListBox = "TAccessibleCheckListBox",

	; Non-translateable window names...
	WN_GeneralPage = "tsGeneral",
	WN_AudioPage = "tsAudio",
	WN_AdvancedAudioPage = "tsAudioAdvanced",
	WN_VideoPage = "tsVideo",
	WN_PrivacyBasicPage = "tsPrivacyBasic",
	WN_Skype4PrivacyBasicPage = "tsBasicOptions",
	WN_BlockedPage = "tsBlocked",
	WN_NotificationsPage = "tsNotifications",
	WN_AlertsPage = "tsAlerts",
	WN_CallForwardingPage = "tsCallForwarding",
	WN_VoiceMailPage = "tsVoicemail",
	wn_ChatSettings="tsChats",
	WN_ChatAppearancePage = "tsChatApperance",
	WN_SMSPage = "tsSms",
	WN_UpdatesPage = "tsUpdates",
	WN_ConnectionPage = "tsConnection",
	WN_RingTonesPage = "tsRingtones",
	WN_HotkeysPage = "tsHotkeys"

Globals
	int gbLastCallCameFromAlert,
	handle ghwndLastNotify, ; last window notified, destroy on AutoStart within Skype main Window for incoming calls
	int giFN_RepeatLastCall, ;repeat incoming call in case user missed the announcement.
	int giFN_UpdateChats, ; collection iterator seeking incoming chat messages.
	string gsBrlStaticText, ;for cases where static text in dialog needs to be Brailled.
	string gsBrlState, ; for left-right slider grayed out state
	int gbAlreadySpoken,
	handle ghHelpWindow, ; for help messages from Show Example links,
	string gsBrlControlLabel,	; for when link needs to include control label
	string	gsBrlListboxText, ; for cases where listbox text must be derived from screen
	string GlobalRealWindowName,
	string gStrLastChatNotify, ; since Skype can double up on the window notifications.
	; imports from MSNHelper:
	handle hMSNWindow1,
	handle hMSNWindow2,
	handle hMSNWindow3,
	handle hMSNWindow4,
	handle hMSNWindow5,
	string gsConversationName1,
	string gsConversationName2,
	string gsConversationName3,
	string gsConversationName4,
	string gsConversationName5,
	string gstrLastConversationItem ; from focused chat window, prevents repetition.
	
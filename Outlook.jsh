const

;Applications:
	sc_wordApp = "wwlib",

;constants which act like enumerations:
;Type of windows, returned by functions TypeOfWindow  and DetectTypeOfWindow:
	UnknownWindowType = 0,
	MessageWindowType = 1,
	TaskWindowType = 2,
	ContactWindowType = 3,
	ReportWindowType = 4,
	MeetingWindowType = 5,
	CalendarWindowType = 6,
;Outlook folder item types:
	UnknownFolderType = 0xffff,  ;Unknown is our own addition, not from the Outlook OM
	MailFolderType = 0,
	AppointmentFolderType = 1,
	ContactFolderType = 2,
	TaskFolderType = 3,
	JournalFolderType = 4,
	NotesFolderType = 5,
	SharedPublicFolderType = 6,
;Identifiers for MSO menus:
	MSO_View = 30004,
	MSO_AutoPreview = 1744,
;types of MSO controls:
	MSO_Button = 1,
	MSO_MenuBar = 10,
;Names for MsoDock panes:
;Note, although these are names, they are not localized.
	MsoDockBottom = "MsoDockBottom",
;Returned by GetInfoForReadHeader:
	GetInfoForReadHeader_Error = 0xffff,  ;not in message or dialog
	GetInfoForReadHeader_NotAvailable = 0,  ;header not available for message or dialog
	GetInfoForReadHeader_OK = 1,  ;header info retrieved successfully
;JAWS-supplied toolbar list items:
	Back = 1,
	Forward = 2,
	MailMessage = 3,
	PrintDoc = 4,
	MoveToFolder = 5,
	DeleteItem = 6,
	Reply = 7,
	ReplyToAll = 8,
	ForwardMessage = 9,
	AddressBook =10,
	Dial = 11,
	AdvancedFind = 12,
	MarkAsRead = 13,
	MarkAsUnread = 14,
	ClearFormatting = 15,
	AppointmentChoice = 16,
	Contact = 17,
	NewFolder = 18,
	Journal = 19,
	Note =20,
	MeetingRequest = 21,
	FindPeople = 22,
	Task = 23,
	TaskRequest = 24,
	OfficeDocument = 25,
	Flag = 26,
	Post = 27,
	CopyItem = 28,
	InBox = 29,
	GoToFolder = 30,

;Window classes:
	wc_AwesomeBar = "AwesomeBar",
	wc_Rctrl_RenWnd32 = "Rctrl_RenWnd32",
	wc_AfxWnd = "AfxWnd",
	wc_AfxWndW = "AfxWndW",
	wc_AfxWndA = "AfxWndA",
	wc_OutlookGrid = "OutlookGrid",
	wc_RichEdit20W = "RichEdit20W",
	wc_RichEdit20WPT = "RichEdit20WPT",
	wc_ReComboBox20W = "REComboBox20W",
	wc_ReListBox20W ="REListBox20W",
	wc_NetUIHWND = "NetUIHWND",
	WC_NetUICtrlNotifySink = "NetUICtrlNotifySink",
	wc_NetUIToolWindow = "Net UI Tool Window",
	wc_NUIDialog = "NUIDialog",
	wc_msoCommandBar = "MsoCommandBar",
	wc_MsoCommandBarDock = "MsoCommandBarDock",
	wc_BosaSDMDlg = "bosa_sdm_Mso96",
	WC_WeekViewWnd = "WeekViewWnd",
	WC_DayViewWnd = "DayViewWnd",
	wc_wwg = "_WwG",
	wc_wwn = "_WwN",
	wc_ATL00007FFA8E48E360 = "ATL:00007FFA8E48E360",
;Object classes:
	wc_SuperGrid = "SuperGrid",
	wc_LeafRow = "LeafRow",
	wc_GroupHeader = "GroupHeader",
	wc_ContactCard = "Contact Card",
	wc_NetUIPersona = "NetUIPersona",
	wc_NetUIFolderBarRoot = "NetUIFolderBarRoot",
	wc_NetUIWBTreeDisplayNode = "NetUIWBTreeDisplayNode",
	wc_NetUIGalleryButton = "NetUIGalleryButton",
	wc_NetUIListViewItem = "NetUIListViewItem",
	wc_NetUIOcxControl = "NetUIOcxControl",
;UIA automation ID's:
	id_idAutoCompleteList = "idAutoCompleteList",
	id_idListViewItem = "idListViewItem",
	id_idPickerAutoCompleteList = "idPickerAutoCompleteList",
	id_SearchTextBox = "SearchTextBox",
	id_idSpellCheckDocument = "18",
	id_body = "Body",
	
;Control ID's:
;For dialogs with multiple header controls in which the controls can be customized:
	idc_1 = 4512,
	idc_2 = 4097,
	idc_3 = 4523,
	idc_4 = 4107,
	idc_5 = 4524,
	idc_6 = 0,
	idc_7 = 4514,
	idc_8 = 4099,
	idc_9 = 4520,
	idc_10 = 4105,
	idc_11 = 4521,
	idc_12 = 4106,
	idc_13 = 4515,
	idc_14 = 4100,
	idc_15 = 4516,
	idc_16 = 4101,
	idc_17 = 4517,
	idc_18 = 4102,
	idc_19  = 4513,
	idc_20 = 4098,
	idc_21 = 4526,
	idc_22 = 4096,
	idc_23 = 1001,
	idc_24 = 4103,
;Send/Receive:
	id_AccountsList = 4657,
;Calendar:
	id_CalendarPane = 109,
;Appointments:
	id_CategoriesListBox = 8193,
;Meeting or Appointment recurrence fields:
	id_RecurrencePatternDailyEvery = 8242,
	id_RecurrencePatternDailyWeekday = 8243,
	id_RecurrencePatternMonthlyDay = 8282,
	id_RecurrencePatternMonthlyThe = 8283,
;Message rules:
	id_RulesConditionCheckList = 1000,
	id_RulesList = 1002,
;Message list:
	id_StatusBar = 101,
	id_FolderTreeView = 100,
	id_GridView = 4704,
;In message:
	id_InfoBar = 4262,
	id_message_window = 8224,
;for open editable messatge attachments list:
	id_Attachments_New = 4306,
;For Manage all views listbox:
	id_ManageAllViewsListbox = 1001,
	id_ManageAllViewsEditBox = 1010,
;MSOCommandBar:
	id_ToolBar = 0,
;More:
	id_DistributionList = 4513,
	id_NewAddressEntry = 116,
;For Advanced Find dialog:
	id_AdvancedFindNowButton = 4363,
	id_AdvancedFindResultList = 101,
;For the message header controls:
	id_RSSPostedOn_Field = 4105,
	id_RSSAuthor_Field = 4107,
	id_RSSSubject_Field = 4108,
	id_from_field = 4097,
	id_from_field2 = 4292,
	id_to_field = 4099,
	id_to_field2 = 4097,
	id_To_Field3 = 4117,
	id_sent_field = 4098,
	id_Sent_Field2 = 4315,
	id_cc_field = 4100,
	id_CC_Field2 = 4126,
	id_CC_Field3 = 4098,
	id_Bcc_field = 4103,
	id_BCC_Field2 = 4104,
	id_subject_field = 4101,
	id_subject_field2 = 4102,
	id_from_prompt = 4512,
	id_sent_prompt = 4513,
	id_to_prompt = 4514,
	id_cc_prompt = 4515,
	id_subject_prompt = 4516,
	id_to_button = 4352,
	id_cc_button = 4353,
	id_Bcc_button = 4358,
	id_message_field = 2748,
	id_report_from_field = 4096,
	id_report_sent_field = 4097,
	id_report_to_field = 4098,
	id_report_subject_field = 4099,
;In meeting requests or appointments:
	id_CollapseAppointmentQuickViewButton = 4301,
	id_ExpandAppointmentQuickViewButton = 4302,
	id_CalendarPreviewPane = 4266,
;For the appointment dialog:
	id_ContactAddressField = 4119,
;For the appointment header controls:
	id_app_AllAttendeesList = 4542,
	id_app_AllAttendeesStatus = 4720,
	id_app_Required = 4690,
	id_Meeting_required = 4109,
	id_Meeting_Optional = 4110,
	id_app_toField = 4106,
	id_app_subject = 4100,
	id_app_starttime = 4096,
	id_app_enddate = 4099,
	id_StartTimeField = 4096,
	id_EndTimeField = 4097,
	id_SentField = 4098,
	id_RequiredField = 4098,
	id_OptionalField = 4099,
;Meeting dialog:
	id_MeetingFromLabel = 4512,
	id_MeetingFromField = 4096,
	id_MeetingSentLabel = 4513,
	id_MeetingSentField = 4097,
	id_MeetingRequestedLabel = 4514,
	id_MeetingRequestedField = 4098,
	id_MeetingSubjectLabel = 4516,
	id_MeetingSubjectField = 4100,
	id_MeetingSubjectField2 = 4294,
	id_MeetingLocationField = 4101,
	id_MeetingLocationField2 = 4106,
	id_MeetingWhenLabel = 4518,
	id_MeetingWhenField = 4102,
	id_MeetingStatusField = 4107,
;For the task header controls:
	id_ParentTaskBody_field = 4106,
	id_TaskSubject_field = 4097,
	id_TaskSubject_prompt = 4521,
	id_DueDate_field03 = 4101,
	id_DueDate_field = 4100,
	id_DueDate_prompt = 4523,
	id_StartDate_field = 4099,
	id_StartDate_prompt = 4514,
	id_StartDate_Field03 = 4100,
	id_status_combobox = 4481,
	id_status_prompt = 4516,
	id_priority_combobox = 4480,
	id_priority_prompt = 4522,
	id_PercentComplete_field = 4104,
	id_PercentComplete_field03 = 4112,
	id_PercentComplete_prompt = 4518,
	id_reminder_checkbox = 4226,
	id_ReminderSound_Button2 = 4360,
	id_ReminderTimeEditBox=4108,
	id_TaskToField = 4096,
;For the Contacts header controls:
	id_Contact_List = 109,
	id_ParentContactBody_field = 4102,
	id_fullName_field = 4096,
	id_FullName_button = 4354,
	id_JobTitle_field = 4480,
	id_JobTitle_prompt = 4515,
	id_company_field = 4481,
	id_company_prompt = 4514,
	id_FileAs_field = 1001, ; this is the parent of the actual edit field
	id_FileAs_prompt = 4516,
	id_business_field = 4097,
	id_business_prompt = 4541,
	id_home_field = 4098,
	id_home_prompt = 4542,
	id_BusinessFax_field = 4099,
	id_BusinessFax_prompt = 4543,
	id_mobile_field = 4100,
	id_mobile_prompt = 4544,
	id_address_field = 4101,
	id_address_button = 28459,
	id_email_field = 4103,
	id_email_prompt = 4545,
	id_web_field = 4521,
	id_web_prompt = 4522,
;For the Spelling dialog
	id_NotInDictionary_field = 13002,
	id_changeTo_field = 13003,
;For the Rules Wizard dialog in Outlook 2003:
	id_RuleDescriptionListBox = 1001,
;From the preferences:
	id_DefaultColour = 4098,
	id_OverdueTaskColour = 4480,
	id_CompletedTaskColour = 4481,

;Braille custom types, start at 21, reserving for Word the first 20 types:
	WT_WT_CalendarGrid = 21, ; Type for Braille call back for Calendar Grid.
	WT_WT_AutoComplete = 23, ; Type for Braille call back for Address Auto-complete.
	WT_WT_MESSAGES_LIST = 24,;Messages List has new output type to separate it from other list boxes.
	WT_WT_CARDVIEW = 25,;  Contacts -> Business card views (see View | Current View)
	WT_WT_FindRoomPaneCalendarGrid = 30, ;Calendar grid in Find A Room Pane, in dialog for creating a meeting
;Other window types:
	wt_Supergrid = 500,

;UIA object class names:
	objn_AttachmentButtonFocusable = "NetUIAttachmentItemButton",
	objn_AttachmentButton = "NetUISimpleButton",
	objn_NetUISimpleButton = "NetUISimpleButton",
; Do not localize these, they must match the filenames in the installer for the JBS files minus the jbs extension
	cOutlook2007JBSBase="Outlook 2007",
	cOutlook2010JBSBase="Outlook 2010",
	cOutlookClassicJBSBase="Outlook classic"

globals
	int gbWordIsWindowOwner

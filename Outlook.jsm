; Copyright 1995-2021 Freedom Scientific, Inc.
; Script message file  for Microsoft Outlook 2016 and O365

const

;Window names:
	wn_Options="Options",
	wn_AdvancedFind = "Advanced Find",
	wn_ZeroItems = "0 Items",
	wn_Calendar = "Calendar -",
	wn_Tasks = "Tasks -",
	wn_Contacts = "Contacts -",
	wn_Notes = "Notes -",
	wn_StatusBar = "Status Bar",
	wn_SendReceiveSettings = "Send/Receive Settings",
	wn_Owner = "Owner:",
	wn_Appointment = "Appointment",
	wn_Editor = "Editor", ; name of F7 spell check window
	wn_OriginalSentence = "Original Sentence", ; name of control containing the original sentence in the F7 spell check dialog.

;window names
; window name for Outlook Options Dialog:
; Real window name go File Menu | Options
; Can be copy translated via Script Utility Row | Real Name | control f1 to copy to clipboard:
;	wn_OutlookOptions = "Outlook Options",

;for an untitled or other named event dialog as in an appointment dialog not yet completed:
	wn_any_event="(%1) - Event",
; for read-only message in reading pane of Outlook 2007:
	wn_ReadOnlyMessageInReadingPane="Message",
; for RSS feed messages, the window name of the RSS feed message:
	wn_RSSArticle="RSS Article",
	wn_CheckNames="Check Names",
	wn_ReminderWindow = "Reminder",
	wn_InfoBar="Info Bar", ; Information bar object name.

;When returning to an empty folder, the MSAA Object name is temporarily this value;
;For translators, uncomment the CopyToClipboard line in CheckForNoMoreItems function in Microsoft Outlook 2007.jss,
;Further instructions are there as to how to get this string to validate.
;You'll know if it's wrong because when switching back to an empty mail folder with an accellerator like backspace or CTRL Shift I - Inbox in English -
;JAWS won't report 0 items.
;This may only be happening when using Microsoft Exchange through VPN, where changing folders cases a re-sync of the new folder.
	scFolderLoading = "Loading...",

SC_DigitalChars = "0123456789",
SC_EMailStart = "[",
SC_EMailEnd = "]",

; for scListServStartEnd, its value is the characters surrounding an email address in a header field coming from a list serv:
; example: list <list@domain.com>;user <user@domain.com>;
; this may or may not be localized, not sure what Outlook does here.
scListServStartEnd = "<>",

; Dialog names
scMeetingDialog = "- Meeting ",
scAppointmentDialog = "- Appointment",
scJournalDialogue = "- Journal",
ToolbarDialogName = "Outlook Global ToolBar Items",
scRecurrence = "Recurrence", ; Dialog name of Appointment Recurrance/ create appointment dialog.
strToolbar = "Item Move Back - Control+Comma|Item Move Forward - Control+Period|Mail Message Create - Control+Shift+M|Document Print - Control+P|Folder Move Item To - Control+Shift+V|Delete - Control+D|Reply - Control+R|Reply To All - Control+Shift+R|Message Forward Control+F|Address Book - Control+Shift+B|Dial - Control+Shift+D|Advanced Find - Control+Shift+F|Mark As Read - Control+Q|Mark As Unread - Control+U|Formatting Clear - Control +Shift+Z",
strToolbar1 = "|Appointment Create - Control+Shift+ A|Contact Create - Control+Shift+C|New Folder Create - Control+Shift+E|Journal Entry Create - Control+Shift+J|Note Create - Control+Shift+N|Meeting Request Create - Control+Shift+Q|People Find - Control+Shift+P|Task Create - Control+Shift+K|Task Request Create - Control+Shift+U|Office Document Create - Control+Shift+H|Flag For Follow Up - Control+Shift+G",
strToolbar1_New = "|Appointment Create - Control+Shift+A|Contact Create - Control+Shift+C|New Folder Create - Control+Shift+E|Journal Entry Create - Control+Shift+J|Note Create - Control+Shift+N|Meeting Request Create - Control+Shift+Q|People Find - Control+Shift+P|Task Create - Control+K|Task Request Create - Control+Shift+K|Office Document Create - Control+Shift+H|Flag For Follow Up - Control+Shift+G",
strToolbar2 = "|Item Post - Control+Shift+S|Item Copy - Control+Shift+Y|Inbox Move To -  Control+Shift+I|Folder Go To - Control+Y",

;for the TypeOfItem and List identifier scripts
scMessageItem = "Message",
; Outlook 2013 Empty folder: Table View comes from Object name (Script Utility Mode f9)
scMessageItemEmptyFolder2013 = "Table View",
scTaskItem = "Task",
scContactItem = "Contact",
scNotesItem = "Notes",
scAppointmentsItem = "Appointment",
scMeetingItem = "Meeting",
scRSSItem = "RSS message",
;Retrieved from HomeRow F9's Value when message has a flag in Message list.
scAttachmentYes = "Attachment Yes",
scAttachment = "Attachment",
scFlagStatus = "Flag Status",
scFlag = "Flag",
scFlagged = "Flagged",
scUnflagged = "Unflagged",
scNoCategories = "No Categories",
scImportanceFlag = "Importance", ; HomeRow+F9 value while in Message list, or SayMSAAData.)
scNormal = "Normal",
scHighFlag = "High",
scLowFlag = "Low",
scOrangeFlag = "Orange",
scRedFlag = "Red",
scBlueFlag = "Blue",
scGreenFlag = "Green",
scYellowFlag = "Yellow",
scPurpleFlag = "Purple",
scCompletedFlag = "Complete",
scRepliedFlag = "Replied",
scUnreadFlag = "Unread",
scReadFlag = "Read",
scForwardFlag = "Forwarded",
scReminderFlag = "Reminder",
scMeetingRequestFlag = "Meeting Request",

;For scO365AttachmentItemType,
;the text is the UIA text of the itemType property of the element in the attachment column of the message item.
;Note that there are several different messages which are for attachments, this is due to inconsistent use of UI text for attachments.
;In some languages, the actual text for attachment may vary depending on where it is located in the UI.
;Also, the text may vary for different versions of Outlook.
;To find the correct text for the O365 attachment column header, focus on a message in the list with an attachment.
;Turn on the touch cursor, with Shift+NumpadPlus.
;Make sure you toggle the touch cursor to advanced mode by pressing NumpadStar (next to numpadminus).
;Press Down arrow to move to the child item of the focus.
;Now tab until you reach the item for attachment, often it is the third or fourth item.
;Now press Alt+Enter to bring up the virtual viewer showing the properties for this item.
;The text you want to localize is in the line starting with "ItemType:".
;When done, press Escape then double tap Numpad Plus to exit the touch cursor and return to normal.
scO365AttachmentItemType = "Attachment",

;Object Name Comparison
scView = "View",
scGroupBy = "Group By",
; calendar view constants
scSubject = "Subject",
scDayView = "Day View",
scWeekView="Week View",
scWorkWeekView="Work Week View",
scMonthView = "Month View",
; for scScheduleView, translate to the text string the localizer wishes to have spoken as Schedule View name.
scScheduleView = "Schedule View",
scPrivate = ", Private", ; HomeRow F9 value while in appointment edit box on private appointment.
scRecurring = "Recurring",
scSpellingDialogName = "Spelling",
scRSSArticle="- RSS Article", ; Window title from opened RSS feed item within RSS folder.
scMessage = " - Message",
scContactGroup = " - Contact Group",
scReport = " - Report",
scContactsList1 = "Contacts",
scContacts = " - Contact",
scTaskList1 = "Tasks",
; for scToDoList1, this is the name of the To Do or Tasks list window retrievable by Script Utility Row -> f3 cycle to RealWindow Name -> control+f1 will copy.
scToDoList1 = "To-Do List",
scTasks = " - Task ",
scOutlookTodayDialogName = "Folders - Microsoft Outlook",
scNoteDialogName = "Note",
scRichEdit = "RichEdit",
scAppointment = "Appointment",
scResponse = "Response",
scCalendar = "Calendar",
scCalendarClass = "afxwnd",
scComma = ",",
scMeeting = "Meeting",
scAccepted = "Accepted",
scTentative = "Tentative",
; for scDeclined, the string is the beginning text of the title of a declined meeting request.
; Send a meeting request and have it declined by someone.
scDeclined = "Declined",
scRequest = "Request",
scCategories = "Categories", ; Found in Create appointment dialog's (Control+Shift+A) Categories: field.

; for sc_PreviewTextPrefix, I'm not sure if Microsoft has localized this string but probably, since Narrator reads it.
; You must first enable message preview reading using the registry files, ask your localization team for this.
; Focus on a message in a mailbox,
; Script Utility Mode | f10 to Object Name | Control+F9 to copy.
; This is the string which contains the segment we want.
; All segments start with a comma, this is the last one.
; Leaving the spacing, just translate the word Preview to whatever they're using for your language.
; This string is case sensitive.
sc_PreviewTextPrefix = ", Preview ",

; Script names for ScreenSensativeHelp msgs.
snSayDateScript = "SayDate",
snSayMSAADataScript = "SayMSAAData",
snGetAttendeesStatusScript = "GetAttendeesStatus",
snAppointmentsAndAttachmentsScript="AppointmentsAndAttachments",
snSayWindowPromptAndTextScript="SayWindowPromptAndText",

;keystrokes
	ksSwitchPanes = "F6",
	ksSwitchPanesReverse = "Shift+F6",
	ksNewMailMessage = "Control+Shift+M", ;mail message
	ksPrintDocument = "Control+p", ;Print document
	ksMoveToFolder = "Control+shift+v", ;move to folder
	ksDeleteItem = "Control+d",; delete item
	ksRightJustify="Control+R", ;when editing messages
	ksReply = "Control+r", ;reply
	ksReplyToAll = "Control+shift+r", ;reply to all
	ksForwardMessage = "Control+f", ;forward message
	ksAddressBook = "Control+shift+b", ;addressbook
	ksDialer = "Control+shift+d", ;dial
	ksAdvancedFind = "Control+shift+f", ;advanced find
	ksMarkAsRead = "Control+q", ;mark as read
	ksMarkAsUnread = "Control+u", ;mark as uread
	ksClearFormatting = "Control+shift+z", ;clear formatting
	ksAppointmentDialog = "Control+shift+a",  ;appointment choice
	ksContactDialog = "Control+shift+c", ;contact
	ksNewFolder = "Control+shift+e", ;new folder
	ksJournalDialog = "Control+shift+j", ;journal
	ksNotesDialog = "Control+shift+n", ;note icon
	ksMeetingRequest = "Control+shift+q", ;meeting request
	ksFindPeople = "Control+shift+p", ;find people
	ksTaskDialog = "Control+shift+k", ;tasks
	ksTaskRequest = "Control+shift+u", ;task request
	ksTaskRequest_New = "Control+Shift+K",
	ksNewOfficeDocument = "Control+shift+h", ;new office document
	ksFlag = "Control+shift+g", ;flag
	ksPost = "Control+shift+s", ;post
	ksCopyItem = "Control+shift+y", ;copy item
	ksMoveToInbox = "Control+shift+i", ;in box
	ksGoToFolder = "Control+y", ;go to folder
	ksGrowFont = "CTRL+RightBracket",
	ksShrinkFont = "CTRL+LeftBracket",
	KsGoToMessageList = "Control+1",
	KsGoToCalendar = "Control+2",
	KsGoToContacts = "Control+3",
	KsGoToTasks = "Control+4",
	KsGoToNotes = "Control+5",


; Document name for Sharepoint, comes from getObjectName when in SharePoint libraries list:
;This is like the text 'Message' as part of a message's MSAA name in Microsoft Outlook.
	scDocument = "Document",
; the unflagged value from the message MSAA return.
	SC_Unflagged = "Unflagged",
; The none word comes from the value of task list when there is no dates present...
; Press aplications key in the message list, choose Follow-up and then No date.
	SC_NoDate = "None",
; The 'no' word eventually comes from the messages in message lists like 'Inbox'...
; It is very hard to find such messages, I do not know why Outlook marked some of them as reminder no in the Value
; but try to find such a message to translate this word to your native.
	SC_NoReminder = "no",

;In Tasks, there is a column for "Complete", with text of "Yes" or "No".
;We are assuming that the localization of scCompletedFlag = "Complete" applies to the Complete header field and UIA itemType text.
;We want to simply say "Complete" if the task is complete, and nothing if it is not complete.
;You will need to create two tasks,
;and use the context menu to mark one complete so that you now have one complete and the other not complete.
;To get the text for the value of the Complete column, either:
;1. Turn on script utility mode,
;and use F9 to get the MSAA Name text for the current item columns.
;The default is to show the Complete column first, so you should get text starting with "Complete Yes," or "Complete No,".
;We are looking for the "Yes" or the "No" text from this output.
;Or:
;2. Turn on the Touch cursor, and toggle it to advanced mode using numpad asterisk.
;Press Down arrow to move to the first child of the focus.
;Press Right arrow until you hear something like "No image row 1 column 2" or "Yes image row 1 column 2".
;To make sure that this is the correct column, you will need to press Alt+Enter and look at the output. The name should be either "Yes" or "No",
;and the itemType should be "Complete".
;If this is not the correct column (the ItemType is not "Complete"), press Escape and right arrow until you find the correct column.
;Press Escape to cancel the virtualized properties, and double tap numpad Plus to cancel the Touch cursor.
;Note that the text comparison is case sensitive.
	scCompleteYes = "Yes",
	scCompleteNo = "No",
;In the message list of tasks, for scDueDate and scStartDate, we only want to report these if they are set to something other than "None".
;The easiest way to see the column headers for due date and start date is to create a task without due date or start date,
;then use script utility mode to get the information.
;In script utility mode, press F9 to get the MSAA name.
;You will get a string of headers and values, something like:
;"Complete No, Subject test, Due Date None, Start Date None, Flag Status Unflagged,"
;the "Due Date" and "Start Date" text is the header text we want.
;Note that the text comparison is case sensitive.
	scDueDate = "Due Date",
	scStartDate = "Start Date",

; for sc_WithAttachments and sc_AttachmentWithAttachments
; select message in mailbox that has an attachment and copy out Object name:
; Script Utility Mode -> f10 to Object name -> Control+f9 to retrieve name.
; Then copy only up to the first punctuation mark, comma in case of English:
sc_WithAttachments = "With Attachments",
sc_AttachmentWithAttachments = "Attachment With Attachments",

; Outlook apparently has named objects related to attachments in a way which is inconsistent in different areas of the application.
; sc_NoAttachmentsColumnText and sc_AttachmentsColumnItemType is taken from the UIA properties of one of the cells in the row which represents a message list item.
; To find the text to be localized:
; Focus on a message in the list which has no attachments.
; Activate the touch cursor with Shift+NumpadPlus.
; If necessary, toggle advanced navigation mode to On using NumpadAsterisk.
; Press DownArrow to move from the element representing the row to the first child element.
; Press right Arrow until you hear JAWS announce "No Attachments".
; Press Alt+Enter to show the properties for this UIA element.
; The text you are looking for is:
; name: No Attachments ("No Attachments" is the text for sc_NoAttachmentsColumnText)
; itemType: Attachment (""Attachment" is the text for sc_AttachmentsColumnItemType)
; When done, press Escape to dismiss the properties screen, then double tap NumpadPlus to dismiss the touch cursor.
sc_NoAttachmentsColumnText = "No Attachments",
sc_AttachmentsColumnItemType = "Attachment",

;In some languages, scNoData appears as the value of the attachment field of the message list item.
;scNoData should be localized to prevent announcement of this field when navigating the message list.
	scNoData = "N/D",

; for flags, meeting requests, attachments:
; select the item in an inbox or mail folder.
; On Outlook versions 2010 or earlier, get the object name.
; for 2013 or greater, get the object value.
	sc_Attachment = "Attachment",
	sc_ImpHigh= "Importance High",
	sc_ImpLow = "Importance Low",
	sc_FlagFollowUp = "Follow Up Flag",
	sc_FlagForwarded = "Forwarded",
	sc_FlagOrange = "Orange Flag",
	sc_FlagRed = "Red Flag",
	sc_FlagBlue = "Blue Flag",
	sc_FlagGreen = "Green Flag",
	sc_FlagYellow = "Yellow Flag",
	sc_FlagPurple = "Purple Flag",
	sc_FlagCompleted = "Completed",
	sc_FlagReplied = "Replied",
	sc_FlagUnread = "Unread",
	sc_FlagRead = "Read",
	sc_HasReminder = "Has Reminder",
	sc_MeetingRequest = "Meeting Request",
	; From meeting notifications in Inbox
	sc_MeetingCancelled = "Cancelled",
	sc_MeetingAccepted = "Acceptance",
	sc_MeetingTentative = "Tentative Acceptance",
	sc_Meeting = "Meeting",
	sc_appointment = "Appointment",

; Office 2013, Open or Save As dialog, 
; the tool bar button that toggles between Hide Folders and Browse Folders when the space bar is pressed.
; Script Utility Row | Object Name
	OBJN_HIDE_FOLDERS_BTN = "Hide Folders",
	OBJN_BROWSE_FOLDERS_BTN = "Browse Folders",

;Object names
	on_MinimizeTheRibbon = "Minimize the Ribbon", ; button in ribbon, case sensitive, must be correct
	on_AutoActions="Undo Auto Actions",
;Backstage object names:
	on_PinThisItemToTheList = "Pin this item to the list", ;for each file name in Save As, Recent documents, etc.
;object values:
	objv_slab = "slab", ;backstage ancestor object, often a groupbox
	objv_BUTTONCATEGORY = "BUTTONCATEGORY", ;backstage ancestor object, often groupbox
;comma space separator in backstage file name and location list item:
	scCommaSpaceSeparator = ", ", ;separates the file name from the full path location

; Outlook 2007 constants
	on_MessageField = "Message",
; Header objectss:Read Message or RSS feeds in RSS folder
	on_RSSPostedOnField="Posted On:",
	on_RSSAuthorField="Author:",
	on_RSSSubjectField="Subject:",
	on_FromFieldReading = "From:",
	on_SentFieldReading = "Sent:",
	on_ToFieldReading = "To:",
	on_CcFieldReading = "Cc:",
	on_SubjectField = "Subject:",
	on_SignedByField = "Signed By:",
	on_LabelFieldReading = "Label:",
	on_AttachmentsField = "Attachments:",
; Header objectss: Reply/Create messages
	on_ToFieldEditing = "To",
	on_CcFieldEditing = "Cc",
	on_BccFieldEditing = "Bcc",
	on_SubjectFieldEditing = "Subject",
	on_SentFieldEditing = "Sent",
	; for on_SentField2013Plus, the name of the sent field in the received meeting request.  Likely not to have been translated.
	on_SentField2013Plus = "PersonaControl",
; Outlook Contact Header Fields...
	on_ContactFullName = "Full Name",
	on_ContactJobTitle = "Job title:",
	on_ContactCompany = "Company:",
	on_ContactFileAs = "File as:",
	on_ContactBusinessPhone = "Phone 1",
	on_ContactHomePhone = "Phone 2",
	on_ContactBusinessFaxPhone = "Phone 3",
	on_ContactMobilePhone = "Phone 4",
	on_ContactAddress = "Address",
	on_ContactEmailAddress = "E-mail",
	on_ContactInternetAddress = "Web page address",
	on_DueDateField="Due date:",
	on_StartDateField="Start date:",
	on_StatusField="Status:",
	on_PriorityField="Priority:",
	on_PercentCompleteField="% Complete:",
	on_ReminderField="Reminder:",
	on_OwnerField="Owner:",
	on_MeetingLocationField="Location:",
	; For outlook 2013, same as on_MeetingLocationField without the colon.
	on_MeetingLocationField2 = "Location",
	on_MeetingWhenField="When:",
	on_MeetingWhenField2 = "When",
	on_MeetingDescriptionField="Description:",
	on_MeetingRequiredField="Required:",
	on_MeetingRequiredField2 = "Required",
	on_MeetingOptionalField="Optional:",
	on_MeetingOptionalField2="Optional",
	on_StartDateFieldWithoutColon="Start date",
	on_StartTimeFieldWithoutColon="Start time",
	on_StartTimeField="Start time:",
	on_EndDateField="End date:",
	on_EndTimeField="End time:",
; for on_EndDateFieldWithoutColon and on_EndTimeFieldWithoutColon:
; The strings are the same as on_EndDateField and on_EndTimeField, Date and time fields in appointment dialog,
; Outlook 2016 Office365,
; in this case same name, no colon character at the end.
	on_EndDateFieldWithoutColon = "End date",
	on_EndTimeFieldWithoutColon = "End time",
	on_OrganizerField="Organizer:",
; Outlook 2013 and later:
	on_OrganizerField2 = "Organizer",
	on_AllDayEventField="All day event",
	on_NotesFieldWithoutColon="Notes",
	on_EntryTypeField="Entry type:",
	on_CompanyField="Company:",
	on_DurationField="Duration:",

;In message list, some of the "table cells" for the current list item may be named "unknown".
;The names of the table cells may only be obtained by using the touch cursor in advanced navigation mode.
;In the message list, turn on the touch cursor, tap the numpad asterisk to toggle to advanced navigation.
;Press down arrow to move to the children of the current item, these are the table cells.
;As you arrow across, the name and type of each table cell will be spoken.
;Unknown is the typical status of the "Header Status" column,
;however it is possible that this applies to other columns, but this one is the one we know about.
;The Header Stats is one of the columns available when customizing the Outlook columns.
;Go to View ribbon -> View Settings... -> Columns... -> and set Select Available Columns From list to All Document Fields.
;Find and add Header Status to the list of displayed columns, and save changes.
;You should now have this column for each item in the message list, and you can now see its name.
;Follow the same procedure for attachments and Reminder columns,
;to get the text for "no Attachments".
	On_Unknown = "Unknown",
	on_NoAttachments = "No Attachments",
; In some languages such as french, the word for "unknown" may appear in more than one form.
; So "unknown" in French may appear as "Inconnu" or "Inconnu(e)".
; On_Unknown2 is used to match on the text "Inconnu(e)".
	On_Unknown2 = "unknown",

; Outlook dialog names...
	sc_OutlookMessageDialog = "- Message",
	sc_OutlookCalendarDialog = "- Calendar",
	sc_OutlookCalendarEventDialog = "- Event",
	sc_OutlookContactDialog = "- Contact",
	sc_OutlookMeetingDialog = "- Meeting",
	sc_OutlookRecurringMeetingDialog = "- Recurring Meeting",
	sc_OutlookAppointmentDialog = "- Appointment",
	sc_OutlookJournalDialog = "- Journal",
	sc_OutlookTaskDialog = "- Task",
	sc_ContactBusinessPhoneLabel="Business:",
	sc_ContactBusinessFaxPhoneLabel="Business fax:",
	sc_ContactHomePhoneLabel="Home:",
	sc_ContactMobilePhoneLabel="Mobile:",

;Keystroke constants
;keystrokes combined with native app-specific modifier keys such as Ctrl and Alt:
;Note to localizers: These should be checked in case they need to be localized.
	ksGrowFont1Point="Control+]",
	ksShrinkFont1Point="Control+[",
	ksDeleteWord = "Control+delete",

;Object names:
	on_RecentDocuments = "Recent Documents",
	on_ToButton = "To...",
	on_FromFieldEditing = "From"

Messages
@msgSilent1

@@
@msg_HeaderInfoNotFound1_L
The requested header information was not found in this window.
@@
@msg_HeaderInfoNotFound1_S
Requested info not found
@@
@msg3_L
From field not found
@@
@msg3_S
From not found
@@
@msg4_L
Sent field not found
@@
@msg4_S
Sent not found
@@
@msg5_L
To field not found
@@
@msg5_S
To not found
@@
@msg6_L
Cc field not found
@@
@msg6_S
Cc not found
@@
@msg7_L
Subject field not found
@@
@msg7_S
Subject not found
@@
@msg8_L
Due Date field not found
@@
@msg8_S
Due date not found
@@
@msg9_L
Start date field not found
@@
@msg9_S
Start date  not found
@@
@msg10_L
Status combobox not found
@@
@msg10_S
Status not found
@@
@msg11_L
Priority combobox not found
@@
@msg11_S
Priority not found
@@
@msg12_L
% complete field not found
@@
@msg12_S
% complete not found
@@
@msg13_L
Press twice to edit.
@@
@msg15_L
You must open a message or task to read its contents.
@@
@msg15_S
Open message or task to read its content
@@

;This is for the tool bars
@msgLabelNotFound1_L
 Button not found
@@
@msgMSOutlook2013
Microsoft Outlook
@@
@msgToButton
To Button
@@
@msgCcButton
CC Button
@@
@msgAddressButton
Address Button
@@
@msgReminderSoundButton
Reminder Sound Button
@@
@cMsgFromFieldHelp_L
This is the From field.
When reading a message, it contains the sender's name or address.
When replying or creating a new message, it contains your name or address.
@@
@cMsgFromFieldHelp_S
When reading, contains sender's address.
When editing, contains your address.
@@
@cMsgToFieldHelp_L
This is the To field.
When reading a message, it contains the addresses the message was sent to.
When replying to a message, it contains the original sender's name or address.
When creating a new message, you enter the address you wish to send the message to.
@@
@cMsgToFieldHelp_S
When reading, contains the recipient's name or address.
When replying, it contains the original sender's address.
When creating a new message, enter recipient's address.
@@
@cMsgSentFieldHelp_L
This is the Sent/Date field.
It contains the date the message was sent to the recipient.
@@
@cMsgSentFieldHelp_S
Contains the date the message was sent.
@@
@cMsgCcFieldHelp_L
This is the CC Carbon copy field.
When reading, it contains the addresses of other recipients of this message.
When replying or creating, you can enter the addresses of anyone else you want to send a copy of this message.
@@
@cMsgCCFieldHelp_S
When reading, contains the addresses of everyone that received a copy of this message.
When editing, enter addresses of everyone you wish to recieve a copy.
@@
@cMsgSubjectFieldHelp_L
This is the Subject field.
When reading and replying, it contains the topic of the message.
When creating a new message, enter the topic of the message.
@@
@cMsgSubjectFieldHelp_S
When reading, contains the topic of the current message.
When editing, enter the topic of your message.
@@
@cMsgToButtonHelp_L
This button is to select recipients for  the To field.
@@
@cMsgToButtonHelp_S
For selecting recipients for the To field.
@@
@cMsgCCButtonHelp_L
This button is to select recipients for  the CC carbon copy field.
@@
@cMsgCCButtonHelp_S
For selecting recipients for the CC carbon copy field.
@@
@msgScreenSensitiveHelp2_l
This is the Outlook Today window.  It is in HTML format, therefore the same commands that are used in a web page are used here.  Use the tab and shift tab to move between links and the enter key to activate link.
@@
@msgScreenSensitiveHelp2_S
Outlook Today Window.  This window is in HTML format.  Use Tab and shift tab to navigate links.  Enter activates.
@@
; Calendar view Screen-Sensitive Help messages
;%1 = SayPriorCharacter, %2 = SayNextCharacter, %3 = SayPriorLine
;%4 = SayNextLine, %5 = JAWSHome, %6 = JAWSEnd
;%7 = SayLine
@msgScreenSensitiveHelp3a_L
You are focused within the Outlook Calendar.
You can select one of the four views with the following keystrokes:
Alt+Control+1 moves to the Day View.
Alt+Control+2 moves to the Work Week View, usually Monday through Friday.
Alt+Control+3 moves to the Week View, usually Sunday through Saturday.
Alt+Control+4 moves to the Month View.

While in the Day, Work Week, or Week views,use the following keystrokes:
%1 and %2 move to the previous and next days.
Press %5 to move to the time slot at the start of the work day, and %6 to
move to the time slot at the end of the work day.
When using %3 to move to the previous time slot, and %4 to move to the next time slot within the current day,
%product% will announce all appointments associated with that time slot.
%7 will repeat the appointment at the current time slot.

While in the Month View, use %1 and %2 to move between days, %3 and %4 to move through weeks.

@@
;%1=Insert+A, %2 = TabKey, %3 = ShiftTabKey
;%4 = Enter, %5=Insert+Tab,%6 and %7 are Up and Down.
@msgScreenSensitiveHelp3b_L

When you move to a new date or date range, %product% will announce if appointments exist within that range.  If in Day view, the appointment count will be announced for that day; if in Week or Month views, the appointment count will be for the current view's entire range.
If you type characters here, you will change focus to an edit box where you can make a note at the current time slot.

To hear the next appointment on the current day, press %2.  Press this key again to hear subsequent appointments.
To hear the prior appointment on the current day, press %3.
To exit an appointment field, either continue pressing one of these keys
or press %4 or %5, and the current calendar view will return.
These appointments are read-only edit boxes in which you cannot use standard editing and movement keys to navigate the text.
Pressing %6 while within one of these fields will take you to the Notes field of the current appointment.

Pressing %7 repeats the current appointment.

In the new appointment dialog, save  the appointment by pressing Control+S.
to both save and close the appointment, press Alt+S.
@@
;%1 = SayPriorCharacter, %2 = SayNextCharacter, %3 = SayPriorLine
;%4 = SayNextLine, %5 = SayLine, %6 = JAWSHome,
;%7 = JAWSEnd, %8 = TabKey, %9 = ShiftTabKey.
@msgScreenSensitiveHelp3a_S
You are focused within the Outlook Calendar.
Select one of the four views:
Alt+Control+1 = Day View.
Alt+Control+2 = Work Week View.
Alt+Control+3 = Week View.
Alt+Control+4 = Month View.

In all but Month View:
%1 and %2 move to previous and next days.
%3 moves to start of the day; %4 to the end of the day.
When using %5 and %6 to move through time slot within the current day,
all appointments within that time slot get announced.
%7 repeats the current appointment.

Month View:
%1 and %2 moves between days, %5 and %6 moves through weeks.

@@
;%1 = TabKey, %2 = ShiftTabKey
;%3 = Enter, %4=Insert+Tab, %5=Insert+A, %6 and %7 are Up and Down.
@msgScreenSensitiveHelp3b_S

All views:

Start typing to enter a new appointment at current time slot.
%2 and %3 cycle through appointments within current range.
Continue pressing those keys to return to calendar, or press %4 and %5 to exit appointment fields.
%6, while in one of the fields, opens appointment and focuses in notes field.

These appointments are read-only edit boxes in which you cannot use standard editing and movement keys to navigate the text.

%7 repeats current appointment.

In appointment dialog, save  with Control+S.
Save and close, use Alt+S.
@@



; ScreenSensitiveHelp4
; %1 = SayPriorLine, %2 = SayNextLine, %3 = SayLine, %4 = Enter
; %5 = SayMSAAData, %6 = AdjustJAWSOptions.
@msgScreenSensitiveHelp4
This is the Active Appointment list box for the Calendar view.

You can use the %1 and %2 to move up and down through the list of active appointments.
Use %3 to repeat the current item, and %4 will open the Appointment's dialog for editing the details of the current appointment.
In Outlook 2002 or later, to hear the MSAA data for the current item, press %5.

Press Control+S to save the edited appointment, or Alt+S to both save and exit the dialog.
@@
; screen sensitive message for the outlook 2007 navigation pane.
@msgScreenSensitiveHelp_NavigationPane
This is the Outlook Navigation pane.
The items displayed in this pane change depending on which view you have selected.
Some of the items found in the navigation pane include radio buttons, tree view items and links.
Use the UP and DOWN ARROW keys, or first letter navigation, to move through the list of items.
Press the SPACEBAR to select a tree view item in the list.
To expand the selected tree view item, press RIGHT ARROW.
To collapse the tree view item, press LEFT ARROW.
Press the SPACEBAR to select the desired radio button in the list.
Press the SPACEBAR to activate the desired link in the list.
@@
; %1 = SayNextLine, %2 = SayPriorLine, %3 = Enter, %4 = SAYMSAAData %5 = AdjustJAWSOptions.
@cMsgScreenSensitiveHelpMessageList_L
This is the Outlook Message list.
Use %1 and %2 to move up and down through the list, and %3 to open a message for reading.
If using braille to read the opened message, you may want to toggle the Read messages automatically setting off via QuickSettings.
Use Control+R to reply to the current message, or Control+N to create a new message.
Use Delete to delete the current message.
To hear the current message with no JAWS customization, press %4.
Note: If you have the Reading Pane enabled in the View menu, it needs to be set to display on bottom, rather than the default.
@@
@cMsgScreenSensitiveHelpMessageList_S
Outlook Message list.
%1 and %2 moves through the list, %3 to open message.
Control+R to reply to current message, or Control+N to create new message.
Delete deletes current message.
To hear the current message with no JAWS customization, press %4.

Note: If Reading Pane enabled, set it to display on bottom.

@@
; %1 = SayNextLine, %2 = SayPriorLine, %3 = Enter, %4 = SAYMSAAData %5 = AdjustJAWSOptions.
@cMsgScreenSensitiveHelpAppointmentList_L
This is the Outlook Appointment list.
Use %1 and %2 to move up and down through the list, and %3 to open an appointment for editing.
Use Control+N to dcreate  appointment.
Use Delete to delete the current Appointment.
In Outlook 2002 or later, to hear the MSAA data for the current Appointment, press %4.

@@
@cMsgScreenSensitiveHelpAppointmentList_S
Outlook Active Appointment list.
%1 and %2 moves through the list, %3 to open Appointment for editing.
Control+N to create new Appointment.
Delete deletes current Appointment.
In Outlook 2002 or later:
Announce MSAA data for current Appointment, %4.

@@
; %1 = SayNextLine, %2 = SayPriorLine, %3 = Enter, %4 = SAYMSAAData %5 = AdjustJAWSOptions.
@cMsgScreenSensitiveHelpContactList_L
This is the Outlook Contact list.
Use %1 and %2 to move up and down through the list, and %3 to open a Contact for editing.
Use Control+N to create a new Contact.
Use Delete to delete the current Contact.
In Outlook 2002 or later:
To hear the MSAA data for the current Contact, press %4.

@@
@cMsgScreenSensitiveHelpContactList_S
Outlook Contact list.
%1 and %2 moves through the list, %3 to open Contact.
Control+N to create new Contact.
Delete deletes current Contact.
In Outlook 2002 or later:
Announce MSAA data for current Contact, %4.

@@
; %1 = SayNextLine, %2 = SayPriorLine, %3 = Enter, %4 = SAYMSAAData %5 = AdjustJAWSOptions.
@cMsgScreenSensitiveHelpNoteList_L
This is the Outlook Notes list.
Use %1 and %2 to move up and down through the list, and %3 to open a Notes
for editing.
Use  Control+N to create a new Note.
Use Delete to delete the current Note.
In Outlook 2002 or later:
To hear the MSAA data for the current Note, press %4.

@@
@cMsgScreenSensitiveHelpNoteList_S
Outlook Notes list.
%1 and %2 moves through the list, %3 to open Notes.
Control+N to create new Notes.
Delete deletes current Note.
In Outlook 2002 or later:
Announce MSAA data for current Note, %4.

@@
; %1 = SayNextLine, %2 = SayPriorLine, %3 = Enter, %4 = SAYMSAAData %5 = AdjustJAWSOptions.
@cMsgScreenSensitiveHelpTaskList_L
This is the Outlook Task list.
Use %1 and %2 to move up and down through the list, and %3 to open a Task for editing.
Use Control+N to create a new Task.
Use Delete to delete the current Task.
In Outlook 2002 or later:
To hear the MSAA data for the current Task, press %4.

@@
@cMsgScreenSensitiveHelpTaskList_S
Outlook Task list.
%1 and %2 moves through the list, %3 to open Task.
Control+N to create new Task.
Delete deletes current Task.
In Outlook 2002 or later:
Announce MSAA data for current Task, %4.

@@
@msgScreenSensitiveHelpAppointmentScheduler_L
This is the Appointment Scheduling dialog.
Tab through the fields to set the appointment subject, location, category,
and start/end time and date, then press Control+Shift+Tab to select the
attendees of the scheduled appointment.
@@
@msgScreenSensitiveHelpAppointmentScheduler_S
Appointment Scheduling dialog.
Tab through the fields to set the appointment subject, location, category,
and start/end time and date.
Control+Shift+Tab to select attendees.
@@
@msgHotKeyHelp1_L
To display the global key stroke dialog list, press %KeyFor(CallToolBars).
To hear the %product% help topic for Outlook,   press %KeyFor(ScreenSensitiveHelp) twice quickly.
@@
@msgHotKeyHelp1_S
Display global key stroke dialog list, %KeyFor(CallToolBars).
%product% help topic for Outlook,  %KeyFor(ScreenSensitiveHelp) twice quickly.
@@
@msgHotKeyHelp2_L
To read the misspelled word and suggestion, press %KeyFor(ReadMisspelledAndSuggestion).
@@
@msgHotKeyHelp2_S
Read misspelled word and suggestion,  %KeyFor(ReadMisspelledAndSuggestion).
@@
@msgHotKeyHelp3_L
To save and close the open note, press %KeyFor(UpALevel).
@@
@msgHotKeyHelp3_S
Save and close	%KeyFor(UpALevel)
@@
@msgNoteBodyTutor
Type in text for the note.
@@
@msgScreenSensitiveHelpNoteBody
Use standard editing and reading commands within this note.
To save and close, press ESC.
More options are available from the system menu accessed with ALT+space,
or the context menu accessed with the applications key.
@@
@msgHotKeyHelp4_L
To select the Reminder Button, press %KeyFor(ClickButton(4)).
@@
@msgHotKeyHelp4_S
Select Reminder Button,  %KeyFor(ClickButton(4)).
@@
@msgHotKeyHelp5_L
Hot key help for the Outlook calendar.
To move to the previous day, press %KeyFor(SayPriorCharacter).
To move to the next day, press %KeyFor(SayNextCharacter).
To say the date, or date range with focus, press %KeyFor(SayDate).
To move to the time slot at the start of the work day on the present day, press %KeyFor(JAWSHome).
To move to the next time slot on the current day, press %KeyFor(SayNextLine).
To move to the previous time slot on the present day, press %KeyFor(SayPriorLine).
To move to the time slot at the end of the work day on the present day, press %KeyFor(JAWSEnd).

In the Month view:
To move to the previous day, press %KeyFor(SayPriorCharacter).
To move to the next day, press %KeyFor(SayNextCharacter).
To move to the next week, press %KeyFor(SayNextLine).
To move to the previous week, press %KeyFor(SayPriorLine).

To repeat the appointment at the current time slot, press %KeyFor(SayLine).
To hear the next appointment on the current day, press %KeyFor(TabKey).  Press this key again to hear subsequent appointments.
To hear the prior appointment on the current day, press %KeyFor(ShiftTabKey).
These keys will cycle through all the appointments within the current view.
Keep pressing these keys, or use the up or down navigation keys to return to the calendar.
While within an appointment field, press the Enter key to edit the current appointment's text.
press %KeyFor(SayWindowPromptAndText) to repeat the current appointment field's text.
In the new appointment dialog, save  the appointment by pressing Control+S; to both save and close the appointment, press Alt+S.
@@
@msgHotKeyHelp5_S

Hot keys for calendar View.
move to previous day, %KeyFor(SayPriorCharacter).
move to next day, %KeyFor(SayNextCharacter).
say date and view with focus,  %KeyFor(SayDate).
Twice quickly for date range.

Move to first time slot current day, %KeyFor(JAWSHome).
move to next time slot current day, press %KeyFor(SayNextLine).
move to previous time slot current day, press %KeyFor(SayPriorLine).
Move to last time slot current day, %KeyFor(JAWSEnd).

In Month view:
Move to previous day, %KeyFor(SayPriorCharacter).
Move to next day, %KeyFor(SayNextCharacter).
Move to the next week, %KeyFor(SayNextLine).
Move to the previous week, %KeyFor(SayPriorLine).

repeat appointment at current time slot, press %KeyFor(SayLine).
Appointment summary, %KeyFor(AppointmentsAndAttachments).
Twice quickly to place appointments into virtual viewer.

next appointment, press %KeyFor(TabKey).  Press again to hear subsequent appointments.
prior appointment, press %KeyFor(ShiftTabKey).
Edit current appointment, %KeyFor(Enter).
Use the navigation keys to exit appointment field.

Repeat current appointment field, %KeyFor(SayWindowPromptAndText).
Twice quickly to place appointments into virtual viewer.

In new appointment dialog, save with Control+S, save and close with Alt+s.
@@
; removed from the next message:
; first line: 'To move to the list of attachments, press %KeyFor(OutlookAttachmentsList).'
@msgHotKeyHelp6_L
To select the AddressBook button, press %KeyFor(ClickButton(3)).
To select the CC Button, press   %KeyFor(ClickButton(2)).
To select the TO Button, press %KeyFor(ClickButton(1)).
To move to the body window, press %KeyFor(GoToOutlookMessageBodyWindow).
@@
; removed from the next message:
; first line: 'Move to attachments,  %KeyFor(AttachmentsList).'
@msgHotKeyHelp6_S
Select AddressBook button, %KeyFor(ClickButton(3)).
Select CC Button, %KeyFor(ClickButton(2)).
Select TO Button, %KKeyFor(ClickButton(1)).
Move to body window, %KeyFor(GoToOutlookMessageBodyWindow).
@@
@msgHotKeyHelp7_l
To get a list of edit fields in the contacts dialog,
press %KeyFor(ContactFieldsDialog).
Then use the arrow keys to select the desired field, and press enter to focus on that field.
@@
@msgHotKeyHelp7_s
Get list of contact edit fields,
%KeyFor(ContactFieldsDialog)
@@
@msgHotKeyHelp10_L
Hotkey help for the Active Appointments list.

To move to the Prior appointment in the list, press %KeyFor(SayPriorLine).
To move to the next appointment in the list, press %KeyFor(SayNextLine).
To repeat the current appointment in the list, press %KeyFor(SayLine).
To edit the current appointment in the list, press %KeyFor(Enter).
To hear the MSAA data for the current item, press %KeyFor(SayMSAAData).
@@
@msgHotKeyHelp10_S
Hotkey help for the Active Appointments list.

Move to Prior appointment, %KeyFor(SayPriorLine).
Move to next appointment, %KeyFor(SayNextLine).
Repeat current appointment, %KeyFor(SayLine).
Edit current appointment, %KeyFor(Enter).
Announce MSAA data current item,  %KeyFor(SayMSAAData).

@@
@cMsgHotKeyHelpChangeViews_L
You can also use the
%KeyFor (GoToMessagesView) to go directly to the Messages view,
%KeyFor (GoToCalendarView) to go directly to calendar view,
%KeyFor (GoToContactsView) to go directly to the Contacts view,
%KeyFor (GoToTasksView) to go directly to the To Do list view,
%KeyFor (GoToNotesView) to go directly to the Notes view.

@@
@cMsgHotKeyHelpChangeViews_S
Also use the
%KeyFor (GoToMessagesView) for the Messages view,
%KeyFor (GoToCalendarView) for the Calendar view,
%KeyFor (GoToContactsView) for the contacts view,
%KeyFor (GoToTasksView) for the To Do list view,
%KeyFor (GoToNotesView) for the Notes view.

@@
@cMsgHotKeyHelpMessageList_L
This is the Outlook Message list.
Use
%KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
 to move up and down through the list.
Use %KeyFor(Enter) to open a message for reading.
Use %KeyFor(SayMSAAData) to hear the MSAA data for the current message.

@@
@cMsgHotKeyHelpMessageList_S
Outlook Message list.
%KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
moves through list.
%KeyFor(Enter) open message.
%KeyFor(SayMSAAData) Announce MSAA data for current message.

@@
@cMsgHotKeyHelpCalendarNotMonthView_L
This is the Outlook Calendar view.
Use %KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
 to move up and down through the time slots.
Use %KeyFor (SayPriorCharacter)
and
%KeyFor (SayNextCharacter)
to move right and left threw dates.
Use %KeyFor (ShiftTabKey)
and
%KeyFor (TabKey)
to move threw the appointments during the period.
Use %KeyFor(Enter) to open an appointment for editing.
Use %KeyFor(SayMSAAData) to hear the MSAA data for the current Appointment.

@@
@cMsgHotKeyHelpCalendarNotMonthView_S
Outlook Calendar view.
%KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
moves through the time slots.
%KeyFor (SayPriorCharacter)
and
%KeyFor (SayNextCharacter)
moves threw dates.
%KeyFor (ShiftTabKey)
and
%KeyFor (TabKey)
moves threw the appointments.
%KeyFor(Enter) opens an Appointment.
%KeyFor(SayMSAAData) the MSAA data for the Appointment.

@@
@cMsgHotKeyHelpCalendarMonthView_L
This is the Outlook Calendar view.
Use %KeyFor(SayPriorLine),
%KeyFor(SayNextLine),
%KeyFor (SayPriorCharacter)
and
%KeyFor (SayNextCharacter)
to move up, down, right and left threw dates.
Use %KeyFor (ShiftTabKey)
and
%KeyFor (TabKey)
to move threw the appointments during the period.
Use %KeyFor(Enter) to open an appointment for editing.
Use %KeyFor(SayMSAAData) to hear the MSAA data for the current Appointment.

@@
@cMsgHotKeyHelpCalendarMonthView_S
Outlook Calendar view.
%KeyFor(SayPriorLine),
%KeyFor(SayNextLine),
%KeyFor (SayPriorCharacter)
and
%KeyFor (SayNextCharacter)
moves threw dates.
%KeyFor (ShiftTabKey)
and
%KeyFor (TabKey)
moves threw the appointments.
%KeyFor(Enter) opens an Appointment.
%KeyFor(SayMSAAData) the MSAA data for the Appointment.

@@
@cMsgHotKeyHelpAppointmentList_L
This is the Outlook Active Appointment list.
Use %KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
 to move up and down through the list.
Use %KeyFor(Enter) to open an appointment for editing.
Use %KeyFor(SayMSAAData) to hear the MSAA data for the current Appointment.

@@
@cMsgHotKeyHelpAppointmentList_S
Outlook Appointment list.
%KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
moves through list.
%KeyFor(Enter) open Appointment.
%KeyFor(SayMSAAData) Announce MSAA data for current Appointment.

@@
@cMsgHotKeyHelpContactList_L
This is the Outlook Contact list.
Use %KeyFor(SayPriorLine),
and
%KeyFor(SayNextLine)
to move up and down through the list.
Use %KeyFor (SayPriorCharacter)
and
%KeyFor (SayNextCharacter)
to move left and right threw the list.
Use %KeyFor(Enter) to open a Contact for editing.
Use %KeyFor(SayMSAAData) to hear the MSAA data for the current Contact.

@@
@cMsgHotKeyHelpContactList_S
Outlook Contact list.
%KeyFor(SayPriorLine),
%KeyFor(SayNextLine),
%KeyFor (SayPriorCharacter)
and
%KeyFor (SayNextCharacter)
moves through list.
%KeyFor(Enter) open Contact.
%KeyFor(SayMSAAData) Announce MSAA data for current Contact.

@@
@cMsgHotKeyHelpTaskList_L
This is the Outlook Task list.
Use %KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
to move up and down through the list.
Use %KeyFor(Enter) to open a Task for editing.
Use %KeyFor(SayMSAAData) to hear the MSAA data for the current Task.

@@
@cMsgHotKeyHelpTaskList_S
Outlook Task list.
%KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
moves through list.
%KeyFor(Enter) open Task.
%KeyFor(SayMSAAData) Announce MSAA data for current Task.

@@
@cMsgHotKeyHelpNoteList_L
This is the Outlook Note list.
Use %KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
to move up and down through the list.
Use %KeyFor(Enter) to open a Note for editing.
Use %KeyFor(SayMSAAData) to hear the MSAA data for the current Note.

@@
@cMsgHotKeyHelpNoteList_S
Outlook Note list.
%KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
moves through list.
%KeyFor(Enter) open Note.
%KeyFor(SayMSAAData) Announce MSAA data for current Note.

@@
@msgHotKeyHelpAppointmentScheduler_L
This is the Appointment/Meeting scheduler dialog
Use the Tab key to move through the fields.
Use the SpaceBar to select buttons.
@@
@msgHotKeyHelpAppointmentScheduler_S
Appointment/Meeting scheduler dialog
%KeyFor(TabKey) to move through the fields.
SpaceBar to select buttons.
@@
@cMsgHotKeyHelpNavigationPane_L
This is the Outlook Navigation pane.
Use %KeyFor (SayPriorLine)
and
%KeyFor (SayNextLine)
to move up and down the list of folders.
Use SpaceBar
and
%KeyFor (Enter)
to select the current folder.

@@
@cMsgHotKeyHelpNavigationPane_S
Outlook Navigation pane.
%KeyFor (SayPriorLine)
and
%KeyFor (SayNextLine)
moves up and down the folders.
SpaceBar
and
%KeyFor (Enter)
selects the folder.

@@
@msgToolBar1_L
There is currently an open %product% dialog box.  Only one %product% dialog box can be opened at a time.  In order to bring up the requested dialog box, you must close the current dialog by pressing escape and then activate the desired dialog box.
@@
@msgToolBar1_S
There is currently an open %product% dialog box.  Only one %product% dialog can be opened at a time.  Close the current dialog by pressing Escape and then activate the desired dialog.
@@
@msgScreenSensitiveHelpForKnownClasses1_L
This dialog box lets you customize the format of the information that appears in your Outlook To-Do list. Press TAB to move between Description buttons, and press SPACEBAR to change the parameters for the selected view items.
@@
@msgScreenSensitiveHelpForKnownClasses1_S
Customize the format of the information in your Outlook To-Do list. Press TAB to move between Description buttons, and SPACEBAR to change the parameters for the selected view items.
@@
@msgWindowKeysHelp1_L
To ignore the word found, use Alt + I.
To ignore all occurrences of word found, use Alt + G.
To change the word found, use Alt + C.
To change all occurrences of the word found, use Alt + L.
To Add the word found to the custom dictionary, use Alt + A.
To bring up the dictionary options for the spell checker, use Alt + O.
@@
@msgWindowKeysHelp1_S
Ignore word found,  Alt + I.
Ignore all occurrences of word found,  Alt + G.
Change word found, Alt + C.
Change all occurrences of  word found, Alt + L.
Add word to dictionary, Alt + A.
Bring up dictionary options for spell checker,  Alt + O.
@@
@msgWindowKeysHelp2_L
To display the screen tips for Outlook, use Shift + F1.
To Dial from Outlook, use Control + Shift + D.
To perform an advanced find, use Control + shift + F.
To move to the next item, use Control + period.
To move to the previous item, use Control + comma.
To mark an item as read, use Control + Q.
To mark an item as unread, use Control + U.
To reply to a message, use Control + r.
To reply to all in a message, use Control + Shift + R.
To forward a message, use Control + F.
To switch between upper and lower case, use Shift + F3.
To clear formatting, use Control + Shift + Z.
To create an appointment, use Control + Shift + A.
To create a contact, use Control + shift + C.
To create a new folder, use Control + Shift + E.
To create a journal entry, use Control + Shift + J.
To create a message, use Control + Shift + M.
To create a note, use Control + Shift + N.
To create a meeting request, use Control + Shift + Q.
To find people, use Control + Shift + P.
To create a task, use Control + Shift + K.
To create a task request, use Control + shift + U.
To create a new office document, use Control + Shift + H.
To receive Email messages, use F5.
To flag item for follow up Use, Control + shift + G.
To save and close an item, use alt + S.
To go to a specific folder, use Control + Y.
To post item to a specific folder, use Control + Shift + S.
To copy an item, use Control + shift + Y.
To move an item to a specific folder, use Control + Shift + V.
To open the address book, use Control + Shift + B.
To display short cuts for Outlook, use shift + F10.
To search for text, use F4.
To search for the next occurrance of text, use Shift + F4.
To move to the In Box from anywhere, use Control + shift + I.
@@
@msgWindowKeysHelp2_S
Display screen tips for Outlook,  Shift + F1.
Dial from Outlook,  Control + Shift + D.
Perform advanced find,  Control + shift + F.
Move to next item,  Control + period.
Move to previous item,  Control + comma.
Mark item as read, Control + Q.
Reply to message,  Control + r.
Reply to all in message, Control + Shift + R.
Forward message,  Control + F.
Switch between upper and lower case,  Shift + F3.
Clear formatting,  Control + Shift + Z.
Create appointment,  Control + Shift + A.
Create contact,  Control + shift + C.
Create new folder, Control + Shift + E.
Create journal entry,  Control + Shift + J.
Create message,  Control + Shift + M.
Create note,  Control + Shift + N.
Create meeting request,  Control + Shift + Q.
Find people,  Control + Shift + P.
Create task,  Control + Shift + K.
Create task request,   Control + shift + U.
Create new office document,  Control + Shift + H.
Receive messages,  F5.
Flag for follow up,  Control + shift + G.
Save and close item,  alt + S.
Go to specific folder,  Control + Y.
Post item to specific folder,  Control + Shift + S.
Copy item,  Control + shift + Y.
Move item to specific folder,  Control + Shift + V.
Open address book,  Control + Shift + B.
Display short cuts for Outlook,  shift + F10.
Search for text,  F4.
Search for next occurrance of text,  Shift + F4.
Move to In Box from anywhere,  Control + shift + I.
@@
@msgAttachmentsList2_L
There are no attachments in this message.
@@
@msgAttachmentsList2_S
No attachments.
@@
@msg_NoOpenMessage1_L
Not in an open message
@@
@msg_NoOpenMessage1_S
No open message
@@
@msgSayHeader_L
There is not a message file open.  This function is only available in a message file.
@@
@msgSayHeader_S
No open message file.
@@
@msgErrorClickReminderSound_L
There is not a task open.  This function is only available when a task is open
@@
@msgErrorClickReminderSound_s
No Task Open
@@
@msgNext
Next
@@
;for msgNextItem, %1 = the type of item: message, task, contact
@msgNextItem
Next %1
@@
@msgPrevious
Previous
@@
;for msgPreviousItem, %1 = the type of item: message, task, contact
@msgPreviousItem
Previous %1
@@
@msgNotInAdvancedFind_L
Not in Advanced Find
This keystroke combination only works in the Advanced Find dialog
@@
@msgNotInAdvancedFind_S
Not in Advanced Find
@@
@msgMustPerformFind_L
The Found Items list is not available until a Find is performed
@@
@msgMustPerformFind_S
Not available until a Find is performed
@@
;%1 is the number of attachments
@msgAttachments
%1 attachments
@@
@msgOneAttachment
One Attachment
@@
;%1 is the number of attachments
@msgScreenSensitiveHelpAttachmentEdit
%1

Press LEFT or RIGHT ARROW to move to the previous or next attachment.
Press ENTER to open the current attachment.
@@

@msgNoEvents
No Events
@@
@msgNoAppointments
No Appointments
@@
@msgAlreadyThere
you are already in the
@@
@msgNotVisible
this item may not be visible on the screen
@@
@msgAppointment
appointment
@@
@msgAppSettingsSaved1_L
Application Settings saved
@@
@msgAppSettingsNotSaved1_L
Application Settings could not be saved
@@
; calendar view tutor messages
@MsgDayViewTutorHelp
Press %KeyFor (SayPriorLine) or %KeyFor (SayNextLine) to move between time slots.
Press %KeyFor (SayPriorCharacter) or %KeyFor (SayNextCharacter) to move between days.
Press %KeyFor (TabKey) or %KeyFor (ShiftTabKey) to move between appointments.
@@
@MsgMonthViewTutorHelp
Press %KeyFor (SayPriorLine) and %KeyFor (SayNextLine) to move between weeks.
Press %KeyFor (SayPriorCharacter)  and %KeyFor (SayNextCharacter) to move between days.
Press %KeyFor (TabKey) or %KeyFor (ShiftTabKey) to move between appointments.
@@
@MsgAppointmentFieldTutorHelp
Press  %KeyFor (Enter) to edit the field,
 %KeyFor (TabKey) or %KeyFor (ShiftTabKey) to move between appointments,
Arrow keys exits.
@@
@MSG_CalendarPanesTravellingHelp
%1
Press F6 key to move between %2 calendars present on the screen and navigation pane.
@@
@MSG_CalendarPaneTravellingHelp
%1
Press F6 key to move between the calendar present on the screen and navigation pane.
@@
@MsgThisMonth
 this month
@@
@MsgThisWeek
 this week
@@
@MsgThisWorkWeek
 this workweek
@@
@cMsgSayMSAADataError_L
Must be in the Message, Appointment, Contact, Task, or Notes list.
@@
@cMsgOneOfTwo
 one of two
@@
@cMsgTwoOfTwo
two of two
@@
@cMsgAutoPickPreviousTime
Auto pick previous
@@
@MsgNoItems_L
No more items in this view.
@@
@MsgCannotAddressMessage
Cannot address message.
@@
@MsgCannotRetrieveSendersAddress
Cannot retrieve Sender's address.
@@
@msgReplyingToSender
Replying directly to sender
@@
; Braille messages
@MsgBrlMessageListHelp_L
Outlook Message List Braille Flags are represented by the Flag Status item:

unrd = Message Unread.
atch = Message Attachment.
rpd			Message Replied To.
fwd = Message Forwarded.

The Importance item controls the following flags:
ih = Message Importance High.
il = Message Importance Low.

The Flag Status item controls the following set of flags:
flg = Message Flagged.
flwup = Follow Up Message.
fo = Follow up status: Orange.
fr = Follow up status: Red.
fb = Follow up status: Blue.
fg = Follow up status: Green.
fy = Follow up status: Yellow.
fp = Follow up status: Purple.
fcmp = Follow up status: Completed.

The Show Meeting Status item controls the following:
mreq = Meeting Requested.
mcncld = Meeting Cancelled.
macpt = Meeting Accepted.
mtnt = Meeting Tentative.
@@
@MsgBrlMessageListHelp_S
Outlook Message List Braille Flagsfor the Listbox control type:
unrd = Message Unread.
atch = Message Attachment.
rpd			Message Replied To.
fwd = Message Forwarded.

The Show Importance Flag:
ih = Message Importance High.
il = Message Importance Low.

The Show Message Status Flags:
flg = Message Flagged.
flwup = Follow Up Message.
fo = Follow up status: Orange.
fr = Follow up status: Red.
fb = Follow up status: Blue.
fg = Follow up status: Green.
fy = Follow up status: Yellow.
fp = Follow up status: Purple.
fcmp = Follow up status: Completed.

The Show Meeting Status Flag:
mreq = Meeting Requested.
mcncld = Meeting Cancelled.
macpt = Meeting Accepted.
mtnt = Meeting Tentative.
@@

@msgBrlCalendarGridHelp_L
The Calendar Grid control type controls the following flags while navigating the Outlook Calendar:
ap = Appointment.
rec = Recurring Appointment.
pvt = Private Appointment.
dy = Day View.
ww = WorkWeek View.
wk = Week View.
mn = Month View.
ev = All-Day Event.
@@
@msgBrlCalendarGridHelp_S
Outlook Calendar Grid Braille Flags
ap = Appointment.
rec = Recurring Appointment.
pvt = Private Appointment.
dy = Day View.
ww = WorkWeek View.
wk = Week View.
mn = Month View.
ev = All-Day Event.
@@
@MsgBrlFlagAttachment
atch
@@
@msgBrlRecurring
rec
@@
@MsgBrlPrivate
pvt
@@
; Importance flags
@MsgBrlImpHigh
ih
@@
@MsgBrlImpLow
il
@@
; Status flags
@MsgBrlFlagged
flg
@@
@MsgBrlFlagForwarded
fwd
@@
@MsgBrlFlagOrange
fo
@@
@MsgBrlFlagRed
fr
@@
@MsgBrlFlagBlue
fb
@@
@MsgBrlFlagGreen
fg
@@
@MsgBrlFlagYellow
fy
@@
@MsgBrlFlagPurple
fp
@@
@MsgBrlFlagCompleted
fcmp
@@
@MsgBrlFlagReplied
rpd
@@
@MsgBrlFlagUnread
unrd
@@
@MsgBrlFlagMeetingRequest
mreq
@@
@MsgBrlFlagMeetingCancelled
mcncld
@@
@MsgBrlFlagMeetingAccepted
macpt
@@
@MsgBrlFlagMeetingTentative
mtnt
@@
@MsgBrlFlagHasReminder
rmd
@@
@MsgBrlEmpty
empty
@@
@MsgBrlAppointment
ap
@@
@MsgBrlDayView
dy
@@
@MsgBrlWorkWeekView
ww
@@
@MsgBrlWeekView
wk
@@
@MsgBrlMonthView
mn
@@
@msgAttendeesStatusNotFound
Attendees status not found.
@@
@msgAttendeesStatusTitle
Attendees Status:
@@
@msgPressEscapeToClose
Press Escape to close this window.
@@
@MsgInfoBarEmpty
Info bar is empty.
@@
; for msgMessageLinkCount, %1 is the number of links in the message.
@msgMessageLinkCount
Message has %1 links.
@@
@msgMessageLinkCount_S
%1 links.
@@
@MsgForward_L
Move forward
@@
@MsgForward_S
Forward
@@
@MsgBack_L
Move back
@@
@MsgBack_S
Back
@@
@msgOneUnread_L
One unread message
@@
@msgUnread_L
 %1 unread messages
@@
@msgUnread_S
 %1 unread
@@
@msgAddDigit
%1%2
@@
@msgNotInOpenMessageError_l
That field is not available outside an open message.
@@
@msgNotInOpenMessageError_s
not available outside an open message
@@
@MSG_TimeSlotSelection_L
Selection is from %1 to %2
@@
@MSG_TimeSlotSelection_S
Selection is from %1 to %2
@@
@MSG_SpellCheckerNeeded_L
You must be in spellchecker or message body to use this keystroke.
@@
@MSG_SpellCheckerNeeded_S
Not a spellchecker or message body.
@@
@MSG_PositionInformation
%1 of %2
@@
@MsgBrlFlagFollowUp
flwup
@@
@msgReadWordInContextNotAvailableInOutlook2013
Word in context is no longer available in the spell checker for Outlook 2013 or later.
@@
@msgReadWordInContextNotAvailable
Word in context is not available.
@@
@msgMessageIndicator
Message
@@
@MSG_Size
%1 bytes
@@
; for msgBrlFlagsCollection,
; if you've translated JAWS before, open your Outlook.jbs file and go to:
; CustomControl24
; Copy the strings that start with the text 
; value:
; Do not include the text value or the colon in this message.
; on the left side of the equals (=) sign is the localized description of the item as presented in Outlook, e.g. Meeting Request. 
; see the comments for NumberOfSegmentsOfMeetingRequest for how to get those, if JAWS has not been localized for your language yet.
; on the right side of the equals sign is the Braille abbreviation you want to use. In English we write mreq for meeting request.
;The left side is very important because that has to match what is in Outlook itself, see the item NumberOfSegmentsOfMeetingRequest for comments on how to get that.
; When the left side matches the item you're on in Outlook, the right side abbreviation will be what you see in Braille.
; So if JAWS has not been localized before in your language, and you can't copy from the jbs file:
; The left side of the equals sign is what JAWS is supposed to look for. 
; The right side is what to show in Braille.
; Note that the left side is case-sensitive, in English the words must be capitalized to be properly matched against Outlook text.
@msgBrlFlagsCollection
Meeting Request=mreq
Task Request=treq
Meeting Cancelation=mcncl
Meeting Acceptance=macpt
Automatic Reply=aurply
@@
@MSG_FromFieldNotFound_L
From field not found
@@
@MSG_FromFieldNotFound_S
From not found
@@
@MSG_SentFieldNotFound_L
Sent field not found
@@
@MSG_SentFieldNotFound_S
Sent not found
@@
@MSG_ToFieldNotFound_L
To field not found
@@
@MSG_ToFieldNotFound_S
 To not found
@@
@MSG_CCFieldNotFound_L
Cc field not found
@@
@MSG_CCFieldNotFound_S
Cc not found
@@
@MSG_SubjectFieldNotFound_L
Subject field not found
@@
@MSG_SubjectFieldNotFound_S
Subject not found
@@
;For keystrokes which are not available in Outlook virtual messages:
@msgNotAvailableInOutlook
Not available in Outlook virtual messages
@@
; for msgRetail and msgSubscription, %1 is the name of the Office app, e.g. Word, Excel.
@msgRetail
%1 Retail
@@
@msgSubscription
%1 Subscription
@@
; for MsgCheckList, %1 is the check state, %2 is the item name
@MsgCheckList
%1 %2
@@
@msgTabControlOfficeTutorHelp
To switch pages, press Control+Tab.
@@
@msgOffice12ScriptKeyHelp
If F1 is pressed for Help, press Alt+F4 to close Help and return to the document window.
@@
@msgPleaseWait1
please wait ...
@@
@msgReady1
ready
@@
;for msgSDMToggleButton_L/S, %1 is the name of the button,
;%2 will say "pressed" when the button is pressed, and nothing when the button is not pressed
@msgSDMToggleButton_L
%1 button %2
@@
@msgSDMToggleButton_S
%1 button %2
@@
@msgBoldOn1_L
Bold On
@@
@msgBoldOff1_L
Bold Off
@@
@msgItalicOn1_L
Italic On
@@
@msgItalicOff1_L
Italic Off
@@
@msgUnderlineOn1_L
Underline On
@@
@msgUnderlineOff1_L
Underline Off
@@
@msgGroupboxTutorHelp
Groups together related controls.
@@
@msgFindPage
Find page
@@
@msgReplacePage
Replace page
@@
@msgHotkeyHelpOpen_L
Hotkeys are as follows:
File Name use Alt n
Files of Type use Alt t
Look In use Alt i
Open use alt o
@@
@msgHotkeyHelpopen_S
File Name Alt n
Files of Type Alt t
Look In Alt i
Open alt o
@@
@msgHotkeyHelpFilesDlg_L
Back use Alt 1
Up One Level use Alt 2
Search The Web use Alt 3
Create A New Folder use Alt 5
Cancel use Escape
Tools use Alt L
@@
@msgHotkeyHelpFilesDlg_S
Back Alt 1
Up One Level Alt 2
Search The Web Alt 3
Create A New Folder Alt 5
Cancel Escape
Tools Alt L
@@
@msgHotkeyHelpSave_L
Hotkeys are as follows:
Save in use Alt i
Save use Alt s
File Name use Alt n
Save AS Type use Alt t
@@
@msgHotkeyHelpSave_S
Save in Alt i
Save Alt s
File Name Alt n
Save AS Type Alt t
@@
; text attributes
@msgHighlighted
highlighted
@@
@msgBolded
bolded
@@
@msgItalicized
italicized
@@
@msgUnderlined
underlined
@@
@msgAlignedLeft
Aligned left
@@
@msgCentered
Centered
@@
@msgAlignedRight
aligned right
@@
@msgJustified
justified
@@
@msgNotInSpellchecker
Not in Spellchecker.
@@
;for msgStateScreenSensitiveHelp
;%1 is the object state (usually for "unavailable" state)
@msgStateScreenSensitiveHelp
(%1)
@@
;for msgAccessKeyScreenSensitiveHelp,
;%1 is the application access key tip
@msgAccessKeyScreenSensitiveHelp
Access Key: %1
@@
@msgStatusBarToolBarTutorialHelp
To move through the buttons on this tool bar, use Tab or Shift Tab. To move between the Status Bar tool bar, the ribbon bar and the document area, use F6.
@@
@msgRecentDocumentsPushPinTutorialHelp
To toggle, press space bar.
@@
@msgClipboardDialogTutorialHelp
To move through the controls in this dialog, use Tab or Shift Tab. To move between the Clipboard dialog, Status Bar tool bar, the ribbon bar and the document area, use F6.
@@
@msgResearchToolbarTutorialHelp
To move through the controls on  this toolbar, use Tab or Shift Tab. To move between the Research toolbar, Status Bar tool bar, the ribbon bar and the document area, use F6.
@@
@msgOfficeRibbonBarScreenSensitiveHelp
Use Left or Right arrows to change ribbons, Tab or Shift Tab to navigate the current ribbon.
Use F6 or Shift+F6 to cycle between the ribbons, the document area, and the Status Bar tool bar.
Use Escape to dismiss the ribbon bar and return to the document area.
@@
@msgRecentDocumentsPushPinScreenSensitiveHelp
Use space bar to toggle the push pin button for this document,
use arrow keys to navigate the Recent Document and file menu.
@@
@msgStatusBarToolBarOrQuickAccessToolBarScreenSensitiveHelp
Select an access key to choose a command from the Ribbon,  Status bar Toolbar or Quick Access Toolbar.
@@
@msgStateNotPressed
Not pressed
@@
; Outlook messages...
@msgNotInDialog_L
not in one of Outlook's read, create, or modify dialogs.
@@
@msgNotInDialog_S
not in one of Outlook's dialogs.
@@
@msgFieldNotAvailable_L
That field is not available in this particular dialog.
@@
@msgFieldNotAvailable_S
not available
@@
@MsgEMail_l
You are already in the message body.
@@
@msgEMail_s
Already in message body.
@@
@msgScreenSensitiveHelpSmartArt
SmartArt Graphics dialog:
Arrow up and down to a SmartArt graphic type. Tab to the diagram gallery  options available for it . Then to select one , use the arrow keys.
@@
@msgScreenSensitiveHelpOptionsDlgListbox
Options dialog:

This is a category in the list of Options.
To pick a category, arrow up and down through the list, or Ctrl+Tab and Ctrl+Shift+Tab through the pages of the dialog. Then Tab through the options available for that type. Press Spacebar to check or uncheck any of the choices or to open a subdialog.
@@
@msgScreenSensitiveHelpNetUiLists
Use all the arrow keys to move through and select items in this list.
Optionally use TAB and Shift+TAB to perform the same function.
@@
@MsgLookIn
Look in
@@
@msgSaveIn
Save in
@@
@msgRibbonEditCombo
Edit combo
@@
@msgSubmenu
submenu
@@
@msgSubmenuGrid
submenu grid
@@
; ribbon submenu is type ButtonDropdown, 76.
@msgSubmenuScreenSensitiveHelp
Press Enter to bring up this ribbon submenu. Then press Up or Down Arrow to move through the options on the submenu.
@@
; ribbon submenu grid is type ButtonDropdown, 77.
@msgSubmenuGridScreenSensitiveHelp
Press Enter or Spacebar to bring up this ribbon submenu grid. Press any Arrow navigation keys to move through the options on the grid.
@@
@msgEditComboScreenSensitiveHelp
Type the first character of an item known to be in the list of options for this edit combo control, or press DOWNARROW or ALT+DOWNARROW to bring up the list of options.
@@
@msgSplitButton
split button
@@
@msgMenuSplitButtonScreenSensitiveHelp
Press ENTER to open a dialog or SPACEBAR for more options.
Navigate menus with UP/DOWN ARROWS.
Use RIGHT ARROW to open submenus, and use SPACEBAR to open split button controls.
Press ENTER to carry out the selected item.
@@
@msgClipboardDialogScreenSensitiveHelp
This is the Office Clipboard dialog.

To move through the controls in this dialog, use Tab or Shift Tab.
to move between the Clipboard dialog, Status Bar tool bar, the ribbon bar and the document area, use F6.

To close this dialog, use CONTROL+SPACEBAR and choose from the menu of options presented.
@@
@msgResearchToolbarScreenSensitiveHelp
This is the Research toolbar.

To move through the controls on this toolbar, use Tab or Shift Tab.
to move between the Research toolbar, Status Bar tool bar, the ribbon bar and the document area, use F6.

To close this toolbar, use CONTROL+SPACEBAR and choose from the menu of options presented.
@@
@msgApplyStylesScreenSensitiveHelp
This is the Apply Styles dialog.

To move through the controls in this dialog, use Tab or Shift Tab.
to move between the Apply Styles dialog, Status Bar tool bar, the ribbon bar and the document area, use F6.

To close this dialog, use CONTROL+SPACEBAR and choose from the menu of options presented.
@@
@msgColumnHeaderScreenSensitiveHelp
To navigate through the options in this control, press the UP ARROW and DOWN ARROW keys.
@@
@msgRowHeaderScreenSensitiveHelp
To navigate through the options in this control, press the UP ARROW and DOWN ARROW keys.
@@
@msgRibbonSplitButtonScreenSensitiveHelp
Press ENTER or SPACEBAR for more options.
Navigate menu options with UP/DOWN ARROWS.
Press ENTER to carry out the selected item.
@@
@msgStatusBarToolbarButtonHelp
Press ENTER or SPACEBAR to activate this button.
@@
@msgOptionsDlgCategoriesTutorHelp
To select an item in this Categories list, press the first letter of the item,
or use UP or DOWN ARROW to move through the list.
@@
@msgMenuSplitButtonTutorHelp
To move to an item, use the RIGHT ARROW, then use  UP and DOWN ARROWS to select one.
@@

;the following message is for Outlook 2010:
@msgOffice2003Command
Continue typing the Office 2003 menu find key sequence, or press Escape to cancel.
@@
; selection mode msgs_S
@msgSelectionModeOn1_L
Extended selection mode on
@@
@msgSelectionModeOff1_L
Extended Selection Mode off.
@@
;for Office 2010 backstage view tutor help
@msgBackStageViewTabTutorHellp
To navigate among Backstage View tabs, use the Up or Down ARROW keys. to open the current one, press ENTER.
@@
@msgInsertSymbolTutor
To select a symbol, use the arrow keys and then press enter.
@@
;the following messages are for expanded/collapsed state of ribbons.
;For msgRibbonTab, %1 is the ribbon tab name.
@msgRibbonTab
%1 ribbon tab
@@
;for msgRibbonGroup, %1 is the ribbon group name.
@msgRibbonGroup
%1 ribbon group
@@
@msgRibbonInactive
ribbon expanded, inactive
@@
@msgUpperRibbonActive
upper ribbon
@@
@msgLowerRibbonActive
lower ribbon
@@
;when Control+F1 is pressed, and we can't determine the state:
@msgToggleRibbonState
Toggle ribbon state
@@
@msgRibbonCollapsed
ribbon collapsed
@@
@msgRibbonExpanded
Ribbon expanded
@@
@msgRibbonToggleStateScreenSensitiveHelp
Ribbons are collapsed. To expand the ribbons, Press %KeyFor(ToggleRibbonState).
@@
@msgTaskPaneHelp1_L
This is the task pane.
Use Tab and Shift Tab to move between items on the task pane.
Use F6 to switch between the task pane window and the document window.
@@
@msgTaskPaneHelp1_S
This is the task pane.
Use Tab and Shift Tab to move between items on the task pane.
Use F6 to switch between the task pane window and the document window.
@@
@msgTaskPane
Task Pane
@@
;for msgPaneNameWithFocus,
;This is the string returned by function GetPaneNameWithFocus in office.jss,
;and is spoken as the real window name or pane name when focus changes to the pane.
;%1 is the pane name, such as "task" or "navigation"
;%2 is the string in the constant wtn_Pane.
@msgPaneNameWithFocus
%1 %2
@@
@msgAutocorrection_L
ALT Shift F10 to adjust Auto Correction
@@
@msgAutocorrection_S
ALT Shift F10
@@
@msgCustomControl
Custom control
@@
@msgNotInMessageList_L
You must be on a message in a message list to use this feature.
@@
@msgNotInMessageList_S
Not on a message in the message list
@@
;%1 on or off
@msgMessageHeadersPlusPreview
Message List + Preview Pane %1:Select this option to show or hide the text of the currently selected message while in the message list. The message pane must be visible. You can independently pan through the text of the message without losing your place in the message list.
@@
EndMessages

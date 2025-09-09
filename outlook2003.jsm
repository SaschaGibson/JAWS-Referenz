;Copyright 1995-2015 Freedom Scientific, Inc.
;JAWS 10.X Message file for Outlook 2000 through 2003.

const
	; Should be left for OL 2000 functionality.
scShortMonthValues = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec",
scLongMonthValues = "January|February|March|April|May|June|July|August|September|October|November|December",
scShortDaysOfWeek = "Mon|Tue|Wed|Thu|Fri|Sat|Sun",
scLongDaysOfWeek = "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday",
scDayLetters="M T W T",
scDay = "Day",
scWorkWeek = "Work",
scWeek = "Week",
scMonth = "Month",
; these are left for XP functionality...
scEnglish="ENU",
; This string is for language abbreviations that should be excluded from
; appointment text processing within the date/time routine.
; Localization teams add abbreviations that needs the entire appointment text spoken.
; Should stay English, and upper-case, separated by a comma.
scCalendarLanguageExceptions="FRA,FRC",
scMMM="MMMM",
scYYY="yyyy",
scAmPmIndicator="tt",
; End of forced left constants...
WN_AutomaticFormatting = "Automatic Formatting",
wn_CardView="Card View",
wn_MenuBar="Menu Bar",
wn_PercentComplete="% Complete:",
wn_NavigationPaneOptions="Navigation Pane Options",
wn_DisplayButtonOrderList="Display buttons in this order ",
wn_SelectMembers="Select Members",
wn_MembersList="Members List",
wn_Addressing="Addressing",
;wn_CheckNames="Check Names",
wn_NewEntry="New Entry",
wn_WhenOutlookIsOffline="When Outlook is offline, ",
wn_ZeroItems="0 Items",
wn_FormatColumns="Format Columns",
wn_ColumnWidth="Width:",
wn_Calendar="Calendar -",
wn_Tasks="Tasks -",
wn_Contacts="Contacts -",
wn_Notes="Notes -",
wn_RepeatedWord = "Repeated word:",
MsOutlook2K="Microsoft Outlook 2000", ; Script name for Outlook 2k.
;for parsing in folder trees the number of unread messages:
	scFolderTreeUnreadMsgsStartChar = "(",
	scFolderTreeNumOfMsgsEndChars = ")]",
	; Digit characters for comparisons...
	SC_DigitalChars = "0123456789",
SC_Static = "Static",	; class name, do not translate
scOnBehalfOf="on behalf of",
; Prompt titles
scFromField="From:",
scToField="To:",
scSubjectField="Subject:",
; These are messages that are found in the info bar, and are filtered out.
scExtraLineBreaks="xtra line breaks",  ; "Extra line breaks are present/were removed from this message."
scInternetZone="Internet zone",  ; "You are viewing this message in the Internet zone."
scInvitationsHaveNot="Invitations have not been sent", ; "Invitations have not been sent for this Meeting"
;The following is an addendum string to be stripped off when speaking the info bar relevant text upon opening a new meeting.
;Find the text in the exact same place as above string- new meeting (when in the past) on the info bar near top of screen.
scInvitationsHaveNotSupplemental = " for this meeting",
scMeetingDialog="- Meeting ",
scAppointmentDialog="- Appointment",
scJournalDialogue = "- Journal",
ToolbarDialogName = "Outlook Global ToolBar Items",
strToolbar = "Item Move Back|Item Move Forward|Mail Message Create|Document Print|Folder Move Item To|Delete|Reply|Reply To All|Message Forward|Address Book|Dial|Advanced Find|Mark As Read|Formatting Clear",
strToolbar1 = "|Appointment Create|Contact Create|New Folder Create|Journal Entry Create|Note Create|Meeting Request Create|People Find|Task Create|Task Request Create|Office Document Create|Flag For Follow Up",
strToolbar2 = "|Item Post|Item Copy|In Box Move To|Folder Go To",
;for the TypeOfItem and List identifier scripts
scMessageItem = "Message",
scTaskItem = "Task",
scContactItem = "Contact",
scNotesItem="Notes",
scAppointmentsItem="Appointments",
scMeetingItem="Meeting",
;Retrieved from HomeRow F9's Value when message has a flag in Message list.
scAttachmentYes="Attachment Yes",
scAttachment="Attachment",
; 2k-specific
scFlagStatusUnflagged="Flag Status unflagged,", ; HomeRow+F9 value while in Message list, or SayMSAAData.)
; End of 2k-specific
scFlagStatus="Flag Status",
scFlag="Flag",
scFlagged="Flagged",
scUnflagged="Unflagged",
scImportanceFlag="Importance", ; HomeRow+F9 value while in Message list, or SayMSAAData.)
scNormal="Normal",
scHighFlag="High",
scLowFlag="Low",
scOrangeFlag="Orange",
scRedFlag="Red",
scBlueFlag="Blue",
scGreenFlag="Green",
scYellowFlag="Yellow",
scPurpleFlag="Purple",
scCompletedFlag="Complete",
scRepliedFlag="Replied",
scUnreadFlag="Unread",
scReadFlag="Read",
scForwardFlag="Forwarded",
; End of Message list flags.
scGoToBodyWindow="gotobodywindow",
scDuration="Duration",
scTime="time:", ; Found in Create appointment dialog's (Control+Shift+A) Start time: field.
scPriority="Priority:", ; Found in Create Task dialog's (Control+Shift+K) Reminder time: field.
scRecurrence="Recurrence", ; Dialog name of Appointment Recurrance/ create appointment dialog.
scEditableText="Editable Text", ; found in object name (homerow F9) in recurrence dialog, Occur every and End after occurences fields.
; Previous and Next time buttons in Scheduler
scPreviousTimeButton="<<",
scNextTimeButton=">>",
scAllAttendeesStatus="All Attendees Status", ; All Attendees status window when creating appointments.
scRulesWizard = "Rules Wizard",
scExitWithUnsentMail="There are still e-mail",
scCancel="Cancel",
scSendReceiveSpecify="can specify", ; In the Send/Receive Settings dialog.
; key names
HKey_CalendarHighlightColor = "CalendarHighlightColor",
; Script names for ScreenSensativeHelp msgs.
snSayDateScript="SayDate",
snSayMSAADataScript="SayMSAAData",
snGetAttendeesStatusScript="GetAttendeesStatus",
;keystrokes
ksSpellCheckAddToDictionary="Alt+A",
ksSpellCheckChange="Alt+C",
ksSpellCheckIgnoreAll="Alt+G",
ksSpellCheckIgnore="Alt+I",
ksSpellCheckChangeAll="Alt+L",
ksSpellCheckDelete="Alt+D",
ksNewMailMessage = "Control+Shift+M", ;mail message
ksPrintDocument = "Control+p", ;Print document
ksMoveToFolder = "Control+shift+v", ;move to folder
ksDeleteItem = "Control+d",; delete item
ksReply = "Control+r", ;reply
ksReplyToAll = "Control+shift+r", ;reply to all
ksForwardMessage = "Control+f", ;forward message
ksAddressBook = "Control+shift+b", ;addressbook
ksDialer = "Control+shift+d", ;dial
ksAdvancedFind = "Control+shift+f", ;advanced find
ksMarkAsRead = "Control+q", ;mark as read
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
ksNewOfficeDocument = "Control+shift+h", ;new office document
ksFlag = "Control+shift+g", ;flag
ksPost = "Control+shift+s", ;post
ksCopyItem = "Control+shift+y", ;copy item
ksMoveToInbox = "Control+shift+i", ;in box
ksGoToFolder = "Control+y", ;go to folder
ksCloseOfficeAssistant = "h", ;close office assistant
ksSendMessage = "Alt+s", ;send message
ksEditItem = "Control+O", ;Edit appointment
	KsGoToMessageList = "Control+1",
	KsGoToCalendar = "Control+2",
	KsGoToContacts = "Control+3",
	KsGoToTasks = "Control+4",
	KsGoToNotes = "Control+5",
;Object Name Comparison
scView = "View",
scClosed = "closed",
scGroupBy = "Group By",
scGroupByConversation = "Conversation :",
scGroupByFlagStatus = "Flag status :",
scGroupByFrom = "From :",
;window names
wn_OpeningMailAttachment="Opening Mail Attachment", ; Dialog name when opening an email attachment.
wn_SaveAllAttachments = "Save All Attachments",
wn_And="and", ; for "Size in kb" in Advanced find.
wn_CustomizeView="Customize View:", ; for 2003
wn_CustomizeViewXp="View Summary", ; for xp and 2k.
wn_CustomizeToolbar_dialog = "Customize",  ;view menu > toolbars > Customize
wn_StandardCommandBar="Standard",
wn_ContactPageNames = "General|Details|Activities|Certificates|All Fields", ; used by the AnnounceContactPageName function
wn_AppointmentPageNames="General|Attendees", ; Appointment scheduling page names.
wn_AppointmentScheduler="Appointment Scheduler", ; Window title of Appointment creation dialog.
wn_MicrosoftOutlook="Microsoft Outlook",
wn_MsOfficeOutlook="Microsoft Office Outlook",
wn_SaveAttachment="Save Attachment",
wn_RulesWizard = "Rules Wizard",
wn_RulesAndAlerts="Rules and Alerts",
wn_FlagForFollowUp="Flag for Follow Up",
wn_FollowUpTime="Time",
wn_FlagColor="Flag color:",
wn_AdvancedFind="Advanced Find",
wn_AdvancedOptions="Advanced Options",
wn_Appointment="Appointment",
wn_ReminderWindow="Reminder",
wn_SendReceiveGroups="Send/Receive Groups",
wn_GoToFolder="Go to Folder",
wn_CopyItems="Copy Items",
wn_MoveItems="Move Items",
wn_Owner="Owner:",
wn_FileAs="File as:", ; Contact properties field name.
wn_AddressBook="Address Book",
;string compares
scSearch="Search",
scSearchFor="Sear&ch",
scShowNames="Show Names from the:",
scSemiColon = ";",
; calendar view constants
scSubject="Subject",
scDayView = "Day View",
scWeekView = "Week View",
scMonthView = "Month View",
scSingleTimeSlot="to ,",
scItem="Item", ; Found on status bar when calendar is in use.
scPrivate=", Private", ; HomeRow F9 value while in appointment edit box on private appointment.
scRecurringEvent=", Recurring event", ; HomeRow F9 value when in appointment edit box on recurring appointment.
scRecurring="Recurring",
; Words used in parsing MSAA string retrieved for Calendar appointment...
scLocationItem=", Location ",
scTimeItem=", Time ",
scSubjectItem=", Subject",
; minute values used in SpeakAppointment Time function
scFullHour = "00",
scHalfHour = "30",
scPM=" pm", ; Used in Outlook XP calendar to search for time AM or PM.
scPlainText = "Plain Text",
scRichText = "Rich Text",
scFrom = "from",
scTo = "to",
scSuggestionList="Suggestions:",
scSpellingDialogName = "Spelling",
scMessage = " - Message",
scMessage1 = "Message",
scReport = " - Report",
scContactsList1 = "Contacts",
scContacts = " - Contact",
scDistributionList="- Distribution List",
scTaskList1 = "Tasks",
scTasks = " - Task ",
scOutlookTodayDialogName = "Folders - Microsoft Outlook",
scNoteDialogName = "Note",
;Note to translators:
;The following constant scOutlookMain is used in Braille files to support the Folder Name.
;We're just testing the length of the following string, so the characters you want are
;all of those to the right of the name of the folder,
;as shown in the title bar or result of
;GetWindowName (GetRealWindow (GetFocus ()))
;or equivalent.
scOutlookMain = " - Microsoft Outlook",
scRichTextHeaderString = "(Rich Text)", ; From message header in Rich Text format.
scPlainTextheaderString = "(Plain Text)",  ; From message header in Plain Text format.
scHTmLHeaderString = "(HTML)",  ; From message header in HTML format.
scRichEdit = "RichEdit",
scAppointment="Appointment",
sc50 = "Response",
scCalendar = "Calendar",
scCalendarClass="afxwnd",
sc47 = "es",
scSelectNames = "Type Name or Select from List:",
scOUTEXVLB = "OUTEXVLB",
scMoveToDialogName = "Move Items",
scComma = ",",
scAnniversary = "Anniversary:",
scEmail = "E-mail",
scManagersName = "Manager's name:",
scMeeting = "Meeting",
scAccepted="Accepted",
scTentative="Tentative",
scRequest="Request",

;for speaking unread message in the message list box
scUnread = "Unread",  ; for building the string consisting of the TreeView level in Outlook 11

; names that correspond to the constants for CalendarView. These are spoken and can be translated, but keep the | when doing so
	scCalendarViewNames = "Day View|Work Week View|Week View|Month View",
	; This string will replace the customize listview item in run JAWS manager dialogue.
	CustomizeOutlookMessageListItem = "|Customize Outlook Message List",
	; Customize Outlook Message List title for the JAWS dialogue to be displayed...
	DLG_CustomizeOutlookMessageListTitle = "Customize Outlook Message List",



;UNUSED_VARIABLES

wn_ShortcutsList="Shortcuts",
wn_FoldersList="Folder list",
wn_Resources="Resources",
wn_SendMeetingNotification="Send Meeting Notification",
wn_DayCalendar="Day Calendar",
MsOutlook="Microsoft Outlook", ; Script name for Outlook 2002/2003.
	scFolderTreeSpecialMsgCountStartChar = "[",

; for handling go to folder, copy folder, move folder, copy items, move items, create new folder dialogues...
SC_GoTo = "Go To",
SC_Move = "Move",
SC_Copy = "Copy",
SC_CreateNew = "Create New",
SC_Folder = "Folder",
SC_Item = "Item",

scSendMeeting="Send ",
scSendReceiveComplete="Complete",
scCCField="CC:",
scBccField="BCC:",
scDateField="Date:",
scSentField="Sent:",
; for the Attachments dialog
AttachmentsListDialogName = "Attachments List",
scBlank="blank",
scFlagStatusNormal="Flag Status Normal,", ; HomeRow+F9 value while in Message list, or SayMSAAData.)
scFollowUpFlag="Follow up",
scCategories="Categories", ; Found in Create appointment dialog's (Control+Shift+A) Categories: field.
scRecurEvery="Recur every",
scRecurEveryEditableText="Recur every Recur every Editable Text", ; Double window name text.
scChecked="checked", ; Found with HomeRow F9 in Categories list accessed with Control+Shift+A, Categories... button.
scNotChecked="not checked",
scAllAttendeesList="All attendees", ; All Attendees list name in Appointment creation dialog.
; Maximize button label
scMaximizeButton="maximize symbol",
scScrollUpSymbol="scroll up symbol",
scSaveAndClose = "Save and Close",
scOk="OK",
; Standard string digits.
scOne="1",
scTwo="2",
scThree="3",
scFour="4",
scFive="5",
scSix="6",
scSeven="7",
scEight="8",
scNine="9",
scZero="0",
snReplyDirectlyToSenderScript="ReplyDirectlyToSender",
msgFN1 = "java",
msgFN2 = "outllib",
; Font name constant
cscFontMarlett="Marlett",
scOpen = "open",
cscAttachmentsRemoved="unsafe attachment",
wn_ContextMenu="Context Menu",
wn_SelectASound="Select a Sound",
wn_AddToFavorites = "Add To Favorites",
wn_Favorites = "Favorites",
wn_DueBy="Due by:",
wn_FlagTo="Flag to:",
wn_ReminderTime="Reminder time", ; Found in Task creation with Reminder item checked.
wn_ReminderOpenItem="Open Item",
wn_ZeroReminders="0 Reminders",
wn_ReminderDismissAll="Dismiss All",
wn_AccountsList="Accounts",
wn_SendReceiveSettings="Send/Receive Settings",
wn_SendReceiveWhen="Send/Receive when",
scCriteria="criteria", ; Define more criteria window in Advanced find.
scButtonPressed="Pressed",
scNoItems="There are no items", ; Found on status bar when message list is empty.
scAM="am",
scHtml = "HTML",
scNotesList1 = "Notes",
scEdit = "Edit",
scEvent = " - Event",
sc26_L = "Full Name...",
sc31_L = "Reminder Sound Button",
sc32_L = "Job Title:",
sc33_L = "Address:",
sc34_L = "Business:",
sc35_L = "Home:",
sc36_L = "Business Fax:",
sc37_L = "Call Now Button",
sc38_L = "Mobile",
sc39_L = "New Journal Entry Button",
sc40_L = "Show",
sc41_L = "This is the mailing address",
sc42_L = "Subject:",
sc43_L = "Due Date:",
sc44_L = "Start Date:",
sc45_L = "Actual Work:",
sc46 = "Outlook.Application",
scBrlUnRead = " unrd",; Braill eequivalent of scUnread
; The title of the dialog that we display in Outlook XP when moving to the attachments of a message
dlgAttachmentsListName = "Attachments",
MsgColorNotFound = "Color not found"

;END_OF_UNUSED_VARIABLES

Messages
@msg_UnreadMessage_L
unread
@@
@msg_UnreadMessage_S
unread
@@
@msgSilent1

@@
@wnNoSuggest1
No Suggestions
@@
@msg_HeaderInfoNotFound1_L
The requested header information was not found in this window.
@@
@msg_HeaderInfoNotFound1_S
Requested info not found
@@
; Names of the months
; for the attachments list

@msg1_L
Attachments
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
@msg14_L
Message field not found
@@
@msg15_L
You must open a message or task to read its contents.
@@
@msg15_S
Open message or task to read its content
@@
@msg16_L
No suggestions
@@
@msg17_L
Not in spell checker
@@
@msg21_L
Office Assistant closed
@@
@msg21_S
Closed
@@
@msg22_L
Office Assistant not found
@@

;This is for the tool bars
@msgLabelNotFound1_L
 Button not found
@@

;messages for the buttons in the contact dialog
@msg23_L
Phone Number description
@@
@msg24_L
Enter Multiple Address
@@
@msg25_L
Enter Multiple Email Addresses
@@
@msg27_L
Address...
@@
@msg28_L
Email Address:
@@
@msg29_L
Contact Notes:
@@
@msg30_L
Tasks Notes:
@@


;additional messages for the hot key help
@msgMSOutlook2K
Microsoft Outlook 2000
@@
@msgMSOutlook
Microsoft Outlook 2003
@@
@msgMSOutlookXP
Microsoft Outlook 2002 / XP
@@

;for SayCustomWindows
@msg48_L
Show Journal Entries
@@
@msg49_L
New Journal entries Fields
@@
@Msg52_l
Manager's name:
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
If you have multiple accounts, this becomes a combo box for selecting the account you wish to send from.
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
@msgScreenSensitiveHelp1a_L
This is the message body window in which you can read or compose a message.
Use standard navigation keys to move through the message.
Press insert plus h to get a list of hot keys.
@@
@msgScreenSensitiveHelp1a_S
This is the message body window in which you can read or compose a message.
Use standard navigation keys to move through the message.
Press insert plus h to get a list of hot keys.
@@
@msgScreenSensitiveHelp1b_L
This is the message body field where you type your message or reply.
Use standard navigation and editing keys to move through and edit the text.

Press insert plus h to get a list of hot keys.
@@
@msgScreenSensitiveHelp1b_S
This is the message body field where you type your message or reply.
Use standard navigation and editing keys to move through and edit the text.
Press insert plus h to get a list of hot keys.
@@
@msgScreenSensitiveHelp2_l
This is the Outlook Today window.  It is in HTML format, therefore the same commands that are used in a web page are used here.  Use the tab and shift tab to move between links and the enter key to activate link.
@@
@msgScreenSensitiveHelp2_S
Outlook Today Window.  This window is in HTML format.  Use Tab and shift tab to navigate links.  Enter activates.
@@
; Screen Sensitive help
; Calendar view Screen-Sensitive Help messages
;%1=SayPriorCharacter, %2=SayNextCharacter, %3=SayPriorLine
;%4=SayNextLine, %5=JAWSHome, %6=JAWSEnd
;%7=SayLine
@msgScreenSensitiveHelp3a_L
You are focused within the Outlook Calendar.
You can select either the Day, Week or Month  View from the View
menu, activated with alt+V.
Use the %4 to move to the most appropriate view and press Enter.

While in the Day View,use %1 to move to the previous day and %2 to move to
the next day.
Press %5 to move to the time slot at the start of the work day, and %6 to
move to the time slot at the end of the work day.
%3 moves to the previous time slot, and %4 moves to the next time slot for the current work day; when
using these commands, %product% will advise whether appointments exist. If an
appointment  extends past a single time slot, %product% will keep announcing the
word Appointment.
%7 will repeat the appointment at the current time slot.

While in the Week View, use %1, %2, %3, and %4 to move between days.

While in the Month View, use %1 and %2 to move between weeks, %3 and %4 to move through days.


@@
;%1=TabKey, %2=ShiftTabKey
;%3=Enter, %4=SayDate

@msgScreenSensitiveHelp3b_L


In all views:
When you move to a new date or date range, %product% will announce if
appointments exist within that range.  If in Day view, the appointment count will be announced for that day; if in Week or Month views, the appointment count will be for the current week's entire range.
If you type characters here, you will change focus to an edit box where you can make a note at the current time slot.

To hear the next appointment on the current day, press %1.  Press this key
again to hear subsequent appointments.
To hear the prior appointment on the current day, or to determine if appointments exist prior to your current time slot, press %2.

These appointments are edit boxes in which you can use standard editing and movement keys to navigate the text.  Pressing %3 while within one of these boxes will take you to the Notes field of the current appointment.
After using the %1 or %2 key to hear appointments on a given day, you must keep pressing
those keys until %product% says the name of the view again in order to use the other movement keys to navigate to a different time or day.

To say the date with focus,  Press %4.

In the new appointment dialog, save  the appointment by pressing Control+S.
to both save and close the appointment, press Alt+S.
@@
; ScreenSensitiveHelp3_s
;%1=SayPriorCharacter, %2=SayNextCharacter, %3=SayPriorLine
;%4=SayNextLine, %5=SayLine, %6=JAWSHome,
;%7=JAWSEnd, %8=TabKey, %9=ShiftTabKey.
@msgScreenSensitiveHelp3_s
calendar View.

In Day view, use %1 and %2 to move to the prior or next day, %3 and %4 to move between the various times on this day.
Press %5 to repeat the current time slot, and press %6 or %7 to go to the start or end of the work day.

While in the Week View, use %1, %2, %3, and %4 to move between days, and in the Month View, use %1 and %2 to move between weeks, %3 and %4 to move through days.

In all the views...
%product% will announce whether or not appointments exist within the current view's range.
Press %8 or %9 to list the appointments until %product% announces the view title, such as DayView, or No Appointments.
@@
; ScreenSensitiveHelp4
; %1=SayPriorLine, %2=SayNextLine, %3=SayLine, %4=Enter
; %5=SayMSAAData, %6=AdjustJAWSOptions.
@msgScreenSensitiveHelp4
This is the Active Appointment list box for the Calendar view.

You can use the %1 and %2 to move up and down through the list of active appointments.
Use %3 to repeat the current item, and %4 will open the Appointment's dialog for editing the details of the current appointment.
In Outlook 2002 or later, to hear the MSAA data for the current item, press %5.

Press Control+S to save the edited appointment, or Alt+S to both save and exit the dialog.
@@
@msgScreenSensitiveHelp_ReminderWindow
This is the reminder window.  Press %KeyFor(SayReminderWindow) to focus on current reminder, when the window is visible.
@@
; screen sensitive message for the outlook 2003 navigation pane.
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
; %1=SayNextLine, %2=SayPriorLine, %3=Enter, %4=SAYMSAAData %5=AdjustJAWSOptions.
@cMsgScreenSensitiveHelpMessageList_L
This is the Outlook Message list.
Use %1 and %2 to move up and down through the list, and %3 to open a message for reading.
If using braille to read the opened message, you may want to toggle the Read messages automatically setting off via the verbosity menu.
Use Control+R to reply to the current message, or Control+N to create a new message.
Use Delete to delete the current message.
In Outlook 2002 or later, to hear the MSAA data for the current message, press %4.

Note: If you have the Reading Pane enabled in the View menu, it needs to be set to display on bottom, rather than the default.

@@
@cMsgScreenSensitiveHelpMessageList_S
Outlook Message list.
%1 and %2 moves through the list, %3 to open message.
Control+R to reply to current message, or Control+N to create new message.
Delete deletes current message.
In Outlook 2002 or later:
Announce MSAA data for current message, %4.

Note: If Reading Pane enabled, set it to display on bottom.

@@
; %1=SayNextLine, %2=SayPriorLine, %3=Enter, %4=SAYMSAAData %5=AdjustJAWSOptions.
@cMsgScreenSensitiveHelpAppointmentList_L
This is the Outlook Appointment list.
Use %1 and %2 to move up and down through the list, and %3 to open a Appointment for editing.
Use Control+N to dcreate  Appointment.
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
; %1=SayNextLine, %2=SayPriorLine, %3=Enter, %4=SAYMSAAData %5=AdjustJAWSOptions.
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
; %1=SayNextLine, %2=SayPriorLine, %3=Enter, %4=SAYMSAAData %5=AdjustJAWSOptions.
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
; %1=SayNextLine, %2=SayPriorLine, %3=Enter, %4=SAYMSAAData %5=AdjustJAWSOptions.
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
While selecting attendees, use %1 to get the busy/free status of the
attendees.
@@
@msgScreenSensitiveHelpAppointmentScheduler_S
Appointment Scheduling dialog.
Tab through the fields to set the appointment subject, location, category,
and start/end time and date.
Control+Shift+Tab to select attendees.
%1 gets attendee's status.
@@
@msgHotKeyHelp1_L
To display the global key stroke dialog list,  Press %KeyFor(CallToolBars).
To hear the %product% help topic for Outlook,   press %KeyFor(ScreenSensitiveHelp) twice quickly.
@@
@msgHotKeyHelp1_S
Close office assistant, %KeyFor(CloseOfficeAssistant).
Display global key stroke dialog list, %KeyFor(CallToolBars).
%product% help topic for Outlook,  %KeyFor(ScreenSensitiveHelp) twice quickly.
@@
@msgHotKeyHelp2_L
To read the misspelled word and suggestion,  Press %KeyFor(ReadMisspelledAndSuggestion).
@@
@msgHotKeyHelp2_S
Read misspelled word and suggestion,  %KeyFor(ReadMisspelledAndSuggestion).
@@
@msgHotKeyHelp3_L
To save and close the open note, press %KeyFor(UpALevel).
@@
@msgHotKeyHelp3_S
To save and close the open note, press %KeyFor(UpALevel).
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
To select the Reminder Button, Press %KeyFor(ClickButton(4)).
@@
@msgHotKeyHelp4_S
Select Reminder Button,  %KeyFor(ClickButton(4)).
@@
@msgHotKeyHelp5_L
Hot key help for the Day View and Work Week view in the Outlook calendar.
Make sure either the Day View or Workweek view is selected by going to the view menu in the Outlook Calendar and choosing either Day or Workweek View.
To move to the previous day, press %KeyFor(SayPriorCharacter).
To move to the next day, press %KeyFor(SayNextCharacter).
To say the date with focus,  Press %KeyFor(SayDate).
To move to the time slot at the start of the work day on the present day, press %KeyFor(JAWSHome).
To move to the next time slot on the current day, press %KeyFor(SayNextLine).
To move to the previous time slot on the present day, press %KeyFor(SayPriorLine).
To move to the time slot at the end of the work day on the present day, press %KeyFor(JAWSEnd).
To repeat the appointment at the current time slot, press %KeyFor(SayLine).
To hear the next appointment on the current day, press %KeyFor(TabKey).  Press this key again to hear subsequent appointments.
To hear the prior appointment on the current day, press %KeyFor(ShiftTabKey).
If in Workweek view, these keys will cycle through all the appointments within that workweek.
These appointments are edit boxes in which you can use the arrows to navigate the text.
After using these keys to hear appointments, you must keep pressing until %product%  says the view title again in order to use the navigation keys to navigate to a different time or day.
In the new appointment dialog, save  the appointment by pressing Control+S; to both save and close the appointment, press Alt+S.
@@
@msgHotKeyHelp5_S

Hot keys for calendar Day View.
move to previous day, %KeyFor(SayPriorCharacter).
move to next day, %KeyFor(SayNextCharacter).
say date with focus,  %KeyFor(SayDate).
Move to first time slot pcurrent day, %KeyFor(JAWSHome).
move to next time slot current day, press %KeyFor(SayNextLine).
move to previous time slot current day, press %KeyFor(SayPriorLine).
Move to last time slot current day, %KeyFor(JAWSEnd).
repeat appointment at current time slot, press %KeyFor(SayLine).
next appointment, press %KeyFor(TabKey).  Press again to hear subsequent appointments.
prior appointment, press %KeyFor(ShiftTabKey).
to use the navigation keys to navigate to a different time or day, tab back to Day or Workweek View.
In new appointment dialog, save with Control+S, save and close with Alt+s.
@@
@msgHotKeyHelp6_L
To move to the list of attachments,  Press %KeyFor(AttachmentsList).
To select the AddressBook button, Press %KeyFor(ClickButton(3)).
To select the CC Button,  Press   %KeyFor(ClickButton(2)).
To select the TO Button,  Press %KeyFor(ClickButton(1)).
To move to the body window,  Press %KeyFor(GoToBodyWindow).
To reply directly to Sender, press %KeyFor(ReplyDirectlyToSender).
@@
@msgHotKeyHelp6_S
Move to attachments,  %KeyFor(AttachmentsList).
Select AddressBook button, %KeyFor(ClickButton(3)).
Select CC Button, %KeyFor(ClickButton(2)).
Select TO Button, %KKeyFor(ClickButton(1)).
Move to body window,  %KeyFor(GoToBodyWindow).
Reply directly to Sender, %KeyFor(ReplyDirectlyToSender).

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
@msgHotKeyHelp9_L
Hot key help for the Week View and Month view in the Outlook calendar.
Make sure either the Week View or Month view is selected by going to the view menu in the Outlook Calendar and choosing either Week or Month View.
In the week view:
To move back three days, press %KeyFor(SayPriorCharacter).
To move ahead three days, press %KeyFor(SayNextCharacter).
To move to the next day in the current week, press %KeyFor(SayNextLine).
To move to the previous day within the current week, press %KeyFor(SayPriorLine).
In the Month view:
To move to the previous day, press %KeyFor(SayPriorCharacter).
To move to the next day, press %KeyFor(SayNextCharacter).
To move to the next week, press %KeyFor(SayNextLine).
To move to the previous week, press %KeyFor(SayPriorLine).

In either view:

To move to the day at the end of the present week, press %KeyFor(JAWSEnd).
To move to the day at the start of the present week, press %KeyFor(JAWSHome).
To repeat the appointment at the current time slot, press %KeyFor(SayLine).
To say the date with focus,  Press %KeyFor(SayDate).
To hear the next appointment within the current week, press %KeyFor(TabKey).  Press this key again to hear subsequent appointments.
To hear the previous appointment within the current week, press %KeyFor(ShiftTabKey).  Press this key again to hear subsequent appointments.
These appointments are edit boxes in which you can use the arrows to navigate the text.
The dates will announce before each appointment.
After using these keys o hear appointments, you must keep pressing until %product%  says the view title again in order to use the navigation keys to navigate to a different day or week.
@@
@msgHotKeyHelp9_S
Hot keys for calendar Week and Month View.
In Week view:
Move back three days, %KeyFor(SayPriorCharacter).
Move ahead three days, %KeyFor(SayNextCharacter).
Move to the next day in the current week, %KeyFor(SayNextLine).
Move to the previous day within the current week, %KeyFor(SayPriorLine).

In Month view:
Move to previous day, %KeyFor(SayPriorCharacter).
Move to next day, %KeyFor(SayNextCharacter).
Move to the next week, %KeyFor(SayNextLine).
Move to the previous week, %KeyFor(SayPriorLine).

In either view:
Say the date with focus,  %KeyFor(SayDate).
Move to the day at the start of the present week, %KeyFor(JAWSHome).
Move to the day at the end of the present week, %KeyFor(JAWSEnd).
Repeat the appointment at the current day, %KeyFor(SayLine).
next appointment, press %KeyFor(TabKey).  Press again to hear subsequent appointments.
prior appointment, press %KeyFor(ShiftTabKey).
to use the navigation keys to navigate to a different week or day, tab back to Week or Month View.
@@
@msgHotKeyHelp10_L
Hotkey help for the Active Appointments list.

To move to the Prior appointment in the list, press %KeyFor(SayPriorLine).
To move to the next appointment in the list, press %KeyFor(SayNextLine).
To repeat the current appointment in the list, press %KeyFor(SayLine).
To edit the current appointment in the list, press %KeyFor(Enter).
In Outlook 2002 or later:
To hear the MSAA data for the current item, press %KeyFor(SayMSAAData).
@@
@msgHotKeyHelp10_S
Hotkey help for the Active Appointments list.

Move to Prior appointment, %KeyFor(SayPriorLine).
Move to next appointment, %KeyFor(SayNextLine).
Repeat current appointment, %KeyFor(SayLine).
Edit current appointment, %KeyFor(Enter).
In Outlook 2002 or later:
Announce MSAA data current item,  %KeyFor(SayMSAAData).

@@
@msgHotKeyHelp11_L
To move through links contained in this message, press
%KeyFor(Tab)
and
%KeyFor(ShiftTabKey)
To select a link from a list of all the available links, press  %KeyFor(SelectALink).
To go to the Message field, press %KeyFor(GoToBodyWindow).
To read the entire message, press %KeyFor(SayAll).
To go to the next message, press %KeyFor(MoveForwardItem).
To go to the previous message, press %KeyFor(MoveBackItem).
To delete the message, press %KeyFor(MessageBodyDelete).
To close the message, press %KeyFor(UpALevel).
To reply directly to Sender, press %KeyFor(ReplyDirectlyToSender).

Press the following keys once to read a field, or twice to move focus to that field.
To read the From field, press %KeyFor(ReadOutlookHeader(1)).
To read the Sent field, press %KeyFor(ReadOutlookHeader(2)).
To read the TO field, press %KeyFor(ReadOutlookHeader(3)).
To read the Carbon copy field, press %KeyFor(ReadOutlookHeader(4)).
To read the Blind Carbon copy field when editing, press %KeyFor(ReadOutlookHeader(6)).
To read the Subject field, press %KeyFor(ReadOutlookHeader(5)).

@@
@msgHotKeyHelp12_L

To edit one of the header fields, use
%KeyFor(Tab)
and
%KeyFor(ShiftTabKey)
to move to the relevant field, or press one of the following keys to hear the contents of the field; press twice to jump to that field:

Read From field, %KeyFor(ReadOutlookHeader(1)).
Read Sent field, %KeyFor(ReadOutlookHeader(2)).
Read TO field, %KeyFor(ReadOutlookHeader(3)).
Read Carbon copy field, %KeyFor(ReadOutlookHeader(4)).
Read Blind Carbon copy field when editing, %KeyFor(ReadOutlookHeader(6)).
Read Subject field, %KeyFor(ReadOutlookHeader(5)).
Other keys...
Go to Message field, %KeyFor(GotoBodyWindow).
Cancel message, %KeyFor(UpALevel).
Reply directly to Sender, %KeyFor(ReplyDirectlyToSender).

@@
@cMsgHotKeyHelpChangeViews_L
You can also use the
%KeyFor (GoToMessagesView) to go directly to the Messages view,
%KeyFor (GoToCalendarView) to go directly to calendar view,
%KeyFor (GoToContactsView) to go directly to the Contacts view,
%KeyFor (GoToTasksView) to go directly to the Task list view,
%KeyFor (GoToNotesView) to go directly to the Notes view.

@@
@cMsgHotKeyHelpChangeViews_S
Also use the
%KeyFor (GoToMessagesView) for the Messages view,
%KeyFor (GoToCalendarView) for the Calendar view,
%KeyFor (GoToContactsView) for the contacts view,
%KeyFor (GoToTasksView) for the Task list view,
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
@cMsgHotKeyHelpAppointmentList_L
This is the Outlook Active Appointment list.
Use %KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
 to move up and down through the list.
Use %KeyFor(Enter) to open a Appointment for editing.
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
Use %KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
to move up and down through the list.
Use %KeyFor(Enter) to open a Contact for editing.
Use %KeyFor(SayMSAAData) to hear the MSAA data for the current Contact.

@@
@cMsgHotKeyHelpContactList_S
Outlook Contact list.
%KeyFor(SayPriorLine)
and
%KeyFor(SayNextLine)
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
Use the %KeyFor(GetAttendeesStatus) to get attendee status.
@@
@msgHotKeyHelpAppointmentScheduler_S
Appointment/Meeting scheduler dialog
%KeyFor(TabKey) to move through the fields.
SpaceBar to select buttons.
%KeyFor(GetAttendeesStatus) to get attendee status.
@@

@msgToolBar1_L
There is currently an open %product% dialog box.  Only one %product% dialog box can be opened at a time.  In order to bring up the requested dialog box, you must close the current dialog by pressing escape and then activate the desired dialog box.
@@
@msgToolBar1_S
There is currently an open %product% dialog box.  Only one %product% dialog can be opened at a time.  Close the current dialog by pressing Escape and then activate the desired dialog.
@@

@msgScreenSensitiveHelpForKnownClasses1_L
This is a custom type of list box, which contains an edit field
where you can change information about this item.  Pressing the tab key moves you to the next column of information.  Pressing the enter opens the dialog for the item with focus.  Using the arrow keys takes you to the next or previous item in the list.
@@
@msgScreenSensitiveHelpForKnownClasses1_S
Custom type of list box, containing an edit field where item info can be changed.  Tab moves to next column of information.  Pressing enter opens dialog for item with focus.  The arrow keys moves to next or previous item in list.
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
To create a new office document, use Control + Chift + H.
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
Create new office document,  Control + Chift + H.
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
@msgAttachmentsList1_L

To be able to read the attachments in a Rich text message, it is recommended that you open the file menu and choose save attachments from the menu.
@@
@msgAttachmentsList1_S
To read attachments in a Rich text message, choose save attachments from file menu.
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
@msgVersion
Outlook version
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

@msgChecked
Checked
@@
@msgUnchecked
Unchecked
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
; the following message is used to speak the time values when arrowing through the day ivew of the calendar
; %1 is the hour value, %2 is the minute value, and %3 is the AM/PM value
@MsgAppointmentTime
%1:%2 %3
@@
@msgAM
AM
@@
@msgPM
PM
@@
@msgAppointment
appointment
@@
; For MsgFolderName, %1 is the name of the folder, %2 is its state
@msgFolderName
%1 %2
@@
; additional messages for 2003 contacts dialog
@MsgAnniversary
Anniversary:
@@
@msgAppSettingsSaved1_L
Application Settings saved
@@
@msgAppSettingsNotSaved1_L
Application Settings could not be saved
@@
; calendar view tutor messages
@MsgDayViewTutorHelp
Press %KeyFor (SayPriorLine) or %KeyFor (SayNextLine) to move between time slots in this view.
Press %KeyFor (SayPriorCharacter) or %KeyFor (SayNextCharacter) to move between days.
Press %KeyFor (Tab) or %KeyFor (ShiftTab) to move between appointments.
@@
@MsgWeekViewTutorHelp
Press the  %KeyFor (SayPriorLine)  and %KeyFor (SayNextLine) to move between days in this view.
Press the %KeyFor (SayPriorCharacter) and %KeyFor (SayNextCharacter) to move between half-weeks.
Press the %KeyFor (Tab) or %KeyFor (ShiftTab) to move between appointments.
@@
@MsgMonthViewTutorHelp
Press the %KeyFor (SayPriorLine) and %KeyFor (SayNextLine) to move between weeks.
Press the  %KeyFor (SayPriorCharacter)  and %KeyFor (SayNextCharacter) to move between days in this view.
Press the %KeyFor (Tab) or %KeyFor (ShiftTab) to move between appointments.
@@
@MSG_CalendarPanesTravellingHelp
%1
Press F6 key to move between %2 calendars present on the screen and navigation pane.
@@
@MSG_CalendarPaneTravellingHelp
%1
Press F6 key to move between the calendar present on the screen and navigation pane.
@@
@MsgWorkWeekCalendar
Work Week Calendar
@@
@MsgMonthCalendar
Month Calendar
@@
@MsgWeekCalendar
Week Calendar
@@
@MsgDeterminingHighlightColor
Determining calendar highlight color
@@
@cMsgCalendarColorRetrained
calendar highlight color successfully retrained
@@
@cMsgColorIs
Color is %1
@@
@cMsgErrorHighlightRetrain_L
You must be in the Calendar Day View to retrain the highlight color.
You can select this settings from the View menu Alt+V.

@@
@cMsgErrorHighlightRetrain_S
You must be in the Calendar Day View to retrain the highlight color.
Select this settings from the Outlook View menu.

@@
@cMsgThisMonth
 this month
@@
@cMsgThisWeek
 this week
@@
@cMsgAllDay
All day
@@
@cMsgAllDayEvent_S
Event
@@
@cMsgMultipleAppointments_L
 appointments exist
@@
@cMsgMultipleAppointments_S
 appointments
@@
@cMsgSingleAppointment_L
 appointment exists
@@
@cMsgSingleAppointment_S
 appointment
@@
@cMsgTimed
Timed
@@
@cMsgNoTimedAppointments
No timed appointments
@@
@cMsgPrivateAppointment
 Private
@@
@cMsgRecurringEvent
 Recurring event
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
@cMsgAutoPickNextTime
Auto pick Next
@@
@cMsgSizeInKilobytes
Size in kilobytes
@@
@msgAlignLeft_L
Align left
@@
@msgCenter_L
center
@@
@msgAlignRight_L
Align Right
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
@MsgBrlStructuredModeHelp
If using braille...
Outlook Structured Braille Flags:
To Add or Remove flags,
1. Open the Braille Options dialog within the %product% Settings Center.
2. Select Define Structured Mode....
3. Select a Control type.
4.  Select Modify...
5.  Add or Remove from the Show on... list.

@@
@MsgBrlMessageListHelp_L
Outlook Message List Braille Flags are selected for the Listbox control type:

unrd=Message Unread.
atch=Message Attachment.
rpd			Message Replied To.
fwd=Message Forwarded.

The Show Importance Flag controls the following flags:
ih=Message Importance High.
il=Message Importance Low.

The Show Message Status Flags controls the following set of flags:
flg=Message Flagged.
flwup=Follow Up Message.
fo=Follow up status: Orange.
fr=Follow up status: Red.
fb=Follow up status: Blue.
fg=Follow up status: Green.
fy=Follow up status: Yellow.
fp=Follow up status: Purple.
fcmp=Follow up status: Completed.

The Show Meeting Status flag controls the following:
mreq=Meeting Requested.
mcncld=Meeting Cancelled.
macpt=Meeting Accepted.
mtnt=Meeting Tentative.
@@
@MsgBrlMessageListHelp_S
Outlook Message List Braille Flagsfor the Listbox control type:
unrd=Message Unread.
atch=Message Attachment.
rpd			Message Replied To.
fwd=Message Forwarded.

The Show Importance Flag:
ih=Message Importance High.
il=Message Importance Low.

The Show Message Status Flags:
flg=Message Flagged.
flwup=Follow Up Message.
fo=Follow up status: Orange.
fr=Follow up status: Red.
fb=Follow up status: Blue.
fg=Follow up status: Green.
fy=Follow up status: Yellow.
fp=Follow up status: Purple.
fcmp=Follow up status: Completed.

The Show Meeting Status Flag:
mreq=Meeting Requested.
mcncld=Meeting Cancelled.
macpt=Meeting Accepted.
mtnt=Meeting Tentative.
@@

@msgBrlCalendarGridHelp_L
The Calendar Grid control type controls the following flags while navigating the Outlook Calendar:
ap=Appointment.
rec=Recurring Appointment.
pvt=Private Appointment.
dy=Day View.
ww=WorkWeek View.
wk=Week View.
mn=Month View.
ev=All-Day Event.
@@
@msgBrlCalendarGridHelp_S
Outlook Calendar Grid Braille Flags
ap=Appointment.
rec=Recurring Appointment.
pvt=Private Appointment.
dy=Day View.
ww=WorkWeek View.
wk=Week View.
mn=Month View.
ev=All-Day Event.
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
@MsgBrlFlagFollowUp
flwup
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
@MsgInfoBarNotVisible_L
The info bar is not visible.
@@
@MsgInfoBarNotVisible_S
Info bar not visible.
@@
@MsgForward_L
Move Forward
@@
@MsgForward_S
Forward
@@
@MsgBack_L
Move Back
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
@MSG_TimeSlotSelection_L
Selection is from %1 to %2
@@
@MSG_TimeSlotSelection_S
Selection is from %1 to %2
@@


;UNUSED_VARIABLES

@msg2_L
 Edit
@@
@msg18_L
Note Icon not found
@@
@msg18_S
Not found
@@
@msg19_L
Saturday
@@
@msg20_L
Sunday
@@
;strings setup for the dialog names
@JournalDialogName1
Journal Entry
@@
@AppointmentDialogName1
Appointment
@@
@MeetingDialogName1
Meeting
@@
@msgTaskPadTitle
Task Pad
@@
;messages added for the attachments list
@msg46_L
There are
@@
@msg47_L
Attachments In this message.
@@
@msg47_S
Attachments
@@
@fsNoteIcon1
Notes Icon
@@
@msgMonday1_L
Monday
@@
@msgTuesday1_L
Tuesday
@@
@msg51_L
Day View not in focus
@@
;Messages for ClickButton
@msgHeader1
header
@@
@msgNotFound1
Not Found
@@
@msgAutoStart1_L
For screen sensitive help Press  %KeyFor(ScreenSensitiveHelp).
@@
@msgAutoStart1_S
Screen sensitive help  %KeyFor(ScreenSensitiveHelp).
@@
@MsgHotKeyHelp8_L
To focus to the reminder window when present, press %KeyFor(SayReminderWindow).
@@
@MsgHotKeyHelp8_S
Focus to, then announce reminder window with %KeyFor(SayReminderWindow).
@@
@msgAttachmentsList3_L
To be able to read the attachments in the message, it is recommmended that you open the file menu and choose save attachments from the menu.
@@
@msgAttachmentsList3_S
To read attachments in the message, choose save attachments from file menu.
@@
@msgAttachmentsList4_L
There are no attachments in this message.
@@
@msgAttachmentsList4_S
No attachments.
@@
@msgAttachmentsList5_L
Attachments collection could not be found.
@@
@msgAttachmentsList5_S
Attachments collection not found.
@@
@msgAttachmentsList6_L
The Attachments List is not available in Rich Text Edit format.  In order to use this function, you must choose Format from the menu and then choose Plain text as your format.
@@
@msgAttachmentsList6_S
Not available in Rich Text. Choose Format Plain Text from the menu.
@@
; The next two messages are for the dialog for OfficeXP
; when attachments collection is not initially obtained
@MsgAttachmentListPromptDlgName
Attachments List
@@
@MsgAttachmentListPromptDlg
Could not get the attachment collection.
Do you want %product% to try again?
@@
@msg_NextMessage_L
Next message
@@
@msg_NextMessage_S
Next
@@
@msg_PreviousMessage_L
Previous Message
@@
@msg_PreviousMessage_S
Previous
@@
@msgErrorNoReminderWindow
The Reminder window is not visible
@@
@msgInAttachmentEdit
You are in the attachment edit field.
@@
@msgNotInTheCalendar_l
This keystroke is valid only in the calendar view
@@
@msgNotInTheCalendar_s
not in the calendar
@@
@msgAppointmentSaved
Appointment Saved
@@
@msgNotInAContact_l
A contact is not currently open.
This key is used only when you have opened a contact from within the contacts folder.
@@
@msgNotInAContact_s
No contact is open
@@
; the following  messages are spoken by JAWS to indicate the view with focus in the calendar.
@MsgDayCalendar
Day Calendar
@@
@cMsgThisWorkWeek
 this workweek
@@
@cMsgAllDayEvent_L
All day event
@@
@msgJustify_L
Justify
@@
@MsgNoItems_S
No more items
@@
; Sensitivity flags
@MsgBrlSenPersonal
spr
@@
@MsgBrlSenConfidential
scn
@@
@MsgBrlAllDayEvent
ev
@@

;END_OF_UNUSED_VARIABLES

EndMessages

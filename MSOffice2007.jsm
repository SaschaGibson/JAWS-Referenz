; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 12.0.xx
; JAWS message file for Microsoft Office 2007 and later

Const
; Office 2013, Open or Save As dialog, 
; the tool bar button that toggles between Hide Folders and Browse Folders when the space bar is pressed.
; Script Utility Row | Object Name
	OBJN_HIDE_FOLDERS_BTN = "Hide Folders",
	OBJN_BROWSE_FOLDERS_BTN = "Browse Folders",
; for AdjustJAWSVerbosity:
	sSmartTagListTitle="Smart Tag List", ; title for DlgSelectItemInList
	sSmartTagNameDelimmiter="#", ;preceeds the name to display from the SmartTag object

;Object names
	on_MinimizeTheRibbon = "Minimize the Ribbon", ; button in ribbon, case sensitive, must be correct
	on_SmartTagActions="Smart Tag Actions",
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

; End of Header Outlook objects.
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
; End Outlook constants
; String compare for Office 2003 Quick Command for Office 2010 only
	sc2010Office2003="Office access key:",
;Tree view (false) name:
; for scTreeViewName, this is the Window Name for tree view controls in dialogs in Office applications.
;Get this from the Script Utility Row from any Save As dialog, for example, within Office.
	scTreeViewName = "Tree View",
;string compare for TaskPaneDockedWindowName
;To find it, Office 2003 View menu -> Task Pane
; f6 into Task Pane and then find the window as follows:
; Script Utility Mode -> use shift+f2 to move two to three times up the hierarchy to msoDockLeft, f3 to Window Name and then CTRL+f1 to copy it to the clipboard.
;Most probably not localizable, but that is where it is.
	TaskPaneDockedWindowName = "MsoDockLeft",
;For the next two strings in order to localize, see Office.jss -> function WindowCreatedEvent
;remove the semicolon in front of the line copyToClipboard (sName) ; for localizers, do not remove this line:
;Then in an Office app such as Word 2010 push an old accelerator from office 2003 and it will automatically put the text on the clipboard.
;don't forget to put the semicolonb back.
; this is the easiest way for a user to know what to change the string to, as it isn't really there in HomeRow, it's attached to Varchild of an object on an event.
; String compare for Office 2003 Quick Command for Office 2007 only
	scOffice2003 = "Office 2003",
; String compare for Office 2003 Quick Command for Office 2010 or greater
	scOfficeAccessKey = "Office access key:",
; string compares for application executables and names
	sc_excel2007="excel",
	sc_excel2010="excel",
	sc_msHTML = "mshtml",
	sc_SelectedState = "selected",
	sc_mso="mso.dll",
	sc_word2007 = "wwlib",
	sc_word2010 = "wwlib",
	sc_outlook2007 = "OUTLOOK",
	sc_outlook2010 = "OUTLOOK",
	sc_outllibr = "OUTLLIBR",
	sc_Outlook_AddrBk_mapir="mapir",
	sc_outlook_AddrBk_outex="outex",
	sc_outlookExpress="msoe",
;application names
	an_msWord = "Microsoft Word 2007",
	an_msOutlook="Microsoft Outlook 2007",
	an_Envelope = "ENVELOPE",
;Keystroke constants
; keystrokes combined with native app-specific modifier keys such as Ctrl and Alt:
;Note to localizers: These should be checked in case they need to be localized.
	ksGrowFont1Point="Control+]",
	ksShrinkFont1Point="Control+[",
	ksCurrentLine="JAWSKey+UpArrow",
	ksInFolder="Alt+I",
	ksCtrlLeftArrow = "Control+LeftArrow",
	ksCtrlRightArrow = "Control+RightArrow",
	ksCtrlPageUp = "Control+PageUp",
	ksCtrlPageDown = "Control+PageDown",
	ksSpaceBar = "SpaceBar",
	ksBackspace = "Backspace",
	ksAltShiftLeftArrow = "Alt+Shift+LeftArrow",
	ksAltShiftRightArrow = "Alt+Shift+RightArrow",
; Keystrokes assigned to tasks
	ksReplaceDlg = "Alt+P",
	ksFindDlg = "Alt+D",
	ksSwitchPanes = "F6",
	ksSwitchPanesReverse = "Shift+F6",
	ksLeftJustify = "Control+L",
	ksCenterText = "Control+E",
	ksRightJustify = "Control+R",
	ksDeleteWord = "Control+delete",
	ksBold = "Control+B",
	ksItalic = "Control+I",
	ksUnderline = "Control+U",
; Names to filter out of displayed Smart Tag list:
	scSmartTagFilterList="GivenName|Sn|Place|City|State|Country-Region|Street|PostalCode|Time",

;Object names:
	on_RecentDocuments = "Recent Documents",
; Window Names
;for Accessibility Checker in 2010:
	wn_2010AccessibilityChecker="Accessibility Checker",
;for 2010 Find and Replace when it is invoked by user and remains open
;even after returning to document,
;or when user checks Navigation pane from the View ribbon.
	wn_2010WordNavigationPane="Navigation",
	wn_Office2010SaveQuestionDlg="Save", ;the Office 2010 save/don't save question  dialog.
;Word 2010 | for new search Results dialog replacing find and Replace dialog:
	wn_SearchDocument="Search Document",
	wn_SearchResult="Search Result",
;for compatibility mode in Outlook 2010 messages that may come up in this mode:
	wn_CompatibilityMode="Compatibility Mode",
;for the button control on the ribbon that is called Split, not to be confused with a split button control:
	wn_split="Split",
;for Status bar toolbar button names:
	wn_Zoom="Zoom",
	wn_PageNumber="Page Number",
; for New Document or New ... dialog off the ribbons or file menus:
	wn_NewDocumentDlg="New Document",
	wn_NewDlg="New ",
; for Data Sort dialog in Excel
	wn_Excel2007Sort="Sort",
	wn_Excel2010Sort="Sort",
; for apply Styels dialog in word
	wn_ApplyStyles="apply Styles",
;for Styles dialog, not to be confused with ApplyStyles dialog:
	wn_Styles="Styles",
; for Office Research toolbar:
	wn_Research="Research",
; for Office clipboard dialog:
	wn_OfficeClipboard="Office Clipboard",
; for read-only message in reading pane of Outlook 2007:
	wn_ReadOnlyMessageInReadingPane="Message",
; for RSS feed messages, the window name of the RSS feed message:
	wn_RSSArticle="RSS Article",
	wn_CheckNames="Check Names",
	wn_Print = "Print",
	wn_SmartArtGraphic="SmartArt Graphic",
	wn_Ribbon = "Ribbon",
	wn_StatusBar = "Status Bar",
	wn_DocumentRecovery = "Document Recovery",
	wn_Goto = "Go To",
	WN_AutoCorrect = "AutoCorrect",
	wn_Help = "Help",
	wn_About = "About Microsoft",
	wn_Find	= "Find",
	wn_AcceptOrReject = "Accept or Reject Changes",
	wn_TemplatesAndAddIns = "Templates and Add-ins",
	wn_PageSetup = "Page Setup",
	wn_Margins = "Margins",
	wn_PaperSize = "Paper Size",
	wn_PaperSource = "Paper Source",
	wn_Layout = "Layout",
	Wn_InsertTable = "Insert Table",
	wn_Formula = "Formula",
	wn_Font = "Font",
	wn_CharacterSpacing = "Character Spacing",
	wn_OutlookSpelling="Spelling:",
	wn_SpellingAndGrammar = "Spelling and Grammar:",
	wn_SpellingGrammar = "Spelling & Grammar",
	wn_Suggestions = "Suggestions:",
	wn_Customize = "Customize",
	wn_ReadabilityStatistics = "Readability Statistics",
	wn_WordCount = "Word Count",
	wn_ModifyStyle = "Modify Style",
	wn_SaveAs = "Save As",
	wn_Open = "Open",
	wn_InsertFile = "Insert File",
	WN_InsertPicture = "Insert Picture",
	wn_SelectPicture = "Select Picture",
	wn_LinkToFile = "Link to File",
	wn_Browse = "Browse",
	wn_Sort = "Sort",
	wn_TrackChanges = "Track Changes",
	wn_MailMergeHelper = "Mail Merge Helper",
	wn_DataForm = "Data Form",
	wn_BulletsAndNumbering = "Bullets and Numbering",
	wn_BordersAndShading = "Borders and Shading",
	wn_EnvelopesAndLabels = "Envelopes and Labels",
	wn_PageNumberFormat = "Page Number Format",
	wn_BookMark = "Bookmark",
	wn_FindAndReplace = "Find and Replace",
	wn_Options = "Options",
	wn_TableProperties = "Table Properties",
	wn_tableOptions = "Table Options",
	wn_CellOptions = "Cell Options",
	WN_OutlookMessage = "Message",	; window name of Outlook message contains this string
; Window type name for all pane windows used by GetPaneNameWithFocus
	wtn_Pane="Pane",
; string compares
	sc_BackstageView="Backstage view",
	sc_ErrorsWereDetected="Errors were detected ", ; incorrect object name that occurs in some SDM dialogs which JAWS should suppress
	sc_AltComma="Alt,", ;part of text in ribbon hotkeys
	sc_OptionsDlgCategories="Categories", ;categories list in Options dialog
	sc_PageBreaks="Page Breaks", ; for Breaks menu items off the ribbon
; StringContains (case-sensitive!) text for identifying Next/Previous buttons in dialogs.
	sc_Previous = "Previous",
	sc_Next = "Next",
; for Zoom sliders in Sstatus bar toolbars:
	sc_zoomslider="Zoom slider",
; for quick access toolbar Braille support:
	sc_QuickAccessToolbar="Quick Access Toolbar",
	brl_quickAccessToolbar="qat",
	sc_Button="button",
	sc_selected = " selected",
	scDocumentRecovery = "Document Recovery task pane",
	sc_bold = "Bold",
	sc_italic = "Italic",
	sc_underline = "Underline",

;control names:
;Open, Save As, and similar SDM dialogs:
	sdmCtrlName_LookIn = "Look in:",

;UIA object strings:
	UIAName_DetailedInformation = "Detailed Information", ;2013 backstage, Export or sharing tab, UIA group name on same level as sticky buttons


;UNUSED_VARIABLES

	JVAutoCorrectDetection="|ToggleAutoCorrectDetection:AutoCorrect",
	jvSmartTagDetection="|ToggleSmartTagsDetection:Smart Tags", ; For Smart Tag dialog
	ON_ShowClipboardAutomatically="Show Office Clipboard Automatically",
	ON_CollectWithoutShowingClipboard="Collect Without Showing Office Clipboard",
	ON_ShowClipboardOnTaskbar="Show Office Clipboard Icon on Taskbar",
	ON_ShowClipboardStatusNearTaskbar="Show Status Near Taskbar When Copying",
	ON_SearchText="Search Text:",
	ON_StopAutoCapitalizing="Stop Auto-capitalizing",
	ON_StopAutomaticallyCorrecting="Stop Automatically Correcting",
	on_Book="Book",
	on_InfoBar = "Info Bar",
	on_SendButton = "Send",
	on_AccountsButton = "Account",
	on_Attached = "Attached:",
	on_Attachments = "Attachments",
	on_FromFieldEditing = "From",
	on_FromButton = "From...",
	on_ToButton = "To...",
	on_CCButton = "Cc...",
	on_BccButton = "Bcc...",
	on_NotesField="Notes:",
	sc_OutlookNoteDialog = "- Note",
	sc_Word2007DlgOwner="WINWORD.EXE",
	sc_Word2010DlgOwner="WINWORD.EXE",
	sc_powerpoint2007 = "ppcore",
	sc_OfficeHelp = "clview",
	ksAlt1 = "Alt+1",
	ksAlt2 = "Alt+2",
	ksAlt3 = "Alt+3",
	ksAltShift1 = "Alt+Shift+1",
	ksAltShift2 = "Alt+Shift+2",
	ksAltShift3 = "Alt+Shift+3",
	ksAltShift4 = "Alt+Shift+4",
	ksAltShift5 = "Alt+Shift+5",
	ksAltShift6 = "Alt+Shift+6",
	ksAltShift7 = "Alt+Shift+7",
	ksCtrlDownArrow = "Control+DownArrow",
	ksCtrlUpArrow = "Control+UpArrow",
	ksAltPageUp = "Alt+PageUp",
	ksAltPageDown = "Alt+PageDown",
	ksCtrlHome = "Control+Home",
	ksCtrlEnd = "Control+End",
	ksAltEquals = "Alt+Equals",
	ksShiftSpace = "Shift+Space",
	ksCtrlSpace = "Control+Space",
	ksCtrlS = "Control+S",
	ksEquals = "equals",
	ksCtrlSemiColon = "Control+;",
	ksCtrlShiftSemiColon = "Control+Shift+;",
	ksShiftHome = "Shift+Home",
	ksShiftEnd = "Shift+End",
	ksShiftDownArrow = "Shift+DownArrow",
	ksShiftUpArrow = "Shift+UpArrow",
	ksShiftLeftArrow = "Shift+LeftArrow",
	ksShiftRightArrow = "Shift+RightArrow",
	ksShiftCtrlRightArrow = "Shift+Control+RightArrow",
	ksShiftCtrlLeftArrow = "Shift+Control+LeftArrow",
	ksShiftCtrlHome = "Shift+Control+Home",
	ksShiftCtrlEnd = "Shift+Control+End",
	ksShiftCtrl8 = "Shift+Control+8",
	ksShiftBackspace = "Shift+Backspace",
	ksEnter = "Enter",
	ksEscape = "Escape",
	ksTab = "Tab",
	ksShiftTab = "Shift+Tab",
	ksAltShiftUpArrow = "Alt+Shift+UpArrow",
	ksAltShiftDownArrow = "Alt+Shift+DownArrow",
	ksEuro = "E",
	ksCopyright = "C",
	ksRegistered = "R",
	ksTrademark = "T",
	ksPeriod = ".", ; for elipsis
	ksJustifyText = "Control+J",
	wn_CustomizeKeyboard = "Customize Keyboard",
	wn_commands = "Commands",
	WN_TemporaryContextMenu = "Temporary context menu",
	WN_ClipboardOptions = "Options",
	wn_Search = "Search",
	wn_CrossReference = "Cross-reference",
	wn_TipOfTheDay = "tip of the day",
	wn_Thesaurus = "Thesaurus:",
	wn_InsertField = "Field",
	wn_NewStyle = "New Style",
	wn_Style = "Style",
	WN_InsertHyperLink = "Insert Hyperlink",
	wn_FormatParagraph = "Paragraph",
	wn_Merge = "Select File to Merge Into Current Document",
	wn_NewDocumentDialog = "New", ; the new document/template dialog from the Files menu
; for replacement of ampersand character in a message title:
	sc_and="and",
	scUnderlineChar = "_",
	scTopic = "topic",
	sc_AlignLeft = "align left",
sc_AlignRight = "align right",
	sc_Center = "center",				sc_Justify = "justify"

;END_OF_UNUSED_VARIABLES

messages
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
@msgSmartTag1_L
Has Smart Tag
@@
@msgSmartTag1_S
Smart Tag
@@
@msgNoSmartTags_L
There are no smart tags in this document
@@
@msgNoSmartTags_S
no smart tags
@@
@msgNoClickableSmartTags_L
There are no clickable smart tags in this document
@@
@msgNoClickableSmartTags_S
No clickable smart tags
@@
@msgNotOnSmartTag_L
You are not on a smart tag
@@
@msgNotOnSmartTag_S
Not a smart tag
@@
@msgSmartTagListHelp_L
Choose a smart tag from the list
and press ENTER to move to the location of the smart tag in the document.
Then, press ALT+CTRL+S
to activate the context menu for the smart tag.
@@
@msgSmartTagListHelp_S
Choose a smart tag from the list
and press ENTER to move to the location of the smart tag in the document.
Then, press ALT+CTRL+S
to activate the context menu for the smart tag.
@@
@msgTabControlOfficeTutorHelp
To switch pages, press Control+Tab.
@@
@msgSmartTagActionsTutorHelp1_L
To show the Smart Tag Actions menu press %KeyFor(SmartTagActionsMenu)
@@
@msgSmartTagActionsTutorHelp1_S
To show the Smart Tag Actions menu press %KeyFor(SmartTagActionsMenu)
@@
@msgOfficeScriptKeyHelp
List smart tags in this document  %KeyFor(ShowSmartTagList)
Show Smart Tag Actions menu  %KeyFor(SmartTagActionsMenu)
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

;UNUSED_VARIABLES

@msgTemporaryContextMenuHelp1_l
This is a temporary context menu.
Use the Enter key to toggle the status of checkable items.
Use Up and Down arrows to move between items.
Press Escape to exit the menu.
@@
@msgTemporaryContextMenuHelp1_S
This is a temporary context menu.
Use the Enter key to toggle the status of checkable items.
Use Up and Down arrows or Tab and Shift Tab to move between items.
Press Escape to exit the menu and save the option settings.
@@
@msgCopiedToOfficeClipboard_l
Copied to Office Clipboard
@@
@msgCopiedToOfficeClipboard_S
Copied to Office Clipboard
@@
@msgOfficeClipboard_l
Office Clipboard
@@
@msgOfficeClipboard_s
Office Clipboard
@@
; For msgCheckableContextMenuItem, %1 = name, %2 = state
@msgCheckableContextMenuItem
%1 %2
@@
; for msgTemporaryContextMenuItemNotSelected, %1 is the menu item
@msgTemporaryContextMenuItemNotSelected
Not selected
%1
@@
; for MsgCheckListSection, %1 is the section divider separating checkable options in the list
@msgCheckListSection
%1 Section:
@@
@msgShowSmartTagsActionsButtonError1_L
Cannot show Smart Tags Action Button.
The JAWS cursor is already at the PC cursor location.
Move the PC cursor to another character in this smart tag and try again.
@@
@msgShowSmartTagsActionsButtonError1_S
Cannot show Smart Tags Action Button
@@
@msgHeaderTemplate
<voice name=HeaderVoice>%1</voice>
@@
@msgHelpDlgOkBtn
OK
@@
@msgDash
dash
@@
@msgNotRelevant
not relevant
@@

@msgBrowserOptionHelp
WARNING: Some messages with complex tables or other formatting are difficult to read with %product% when opened using Outlook versions higher than 2003. This is because Microsoft Word is now used to render the HTML content, which may make it difficult for the screen reader to display the message. If you have a message, such as a newsletter or e-mail invoice, you can use your browser to read the message more like earlier versions of Outlook.

If the current message is hard to read, either because of complex graphics or nested tables, open the message in your browser instead, as follows:

Dismiss the current screen-sensitive help message by pressing ESC. Then press ALT then H then X then V, followed by ENTER. These are shortcuts to quickly navigate the ribbon to the View in Browser submenu item.

When you press ENTER, a Security Warning dialog appears regarding opening messages in the browser. Select OK. Note, you can press TAB to navigate to the Please Do Not Show this Dialog Again checkbox, and press SPACEBAR to select it. This will prevent the Security Warning dialog box from displaying in the future.
@@
@msgBrowserOptionVirtualRibbonsOnHelp
WARNING: Some messages with complex tables or other formatting are difficult to read with JAWS when opened using Outlook versions higher than 2003. This is because Microsoft Word is now used to render the HTML content, which may make it difficult for the screen reader to display the message. If you have a message, such as a newsletter or e-mail invoice, you can use your browser to read the message more like earlier versions of Outlook.

If the current message is hard to read, either because of complex graphics or nested tables, open the message in your browser instead, as follows:

Dismiss the current screen-sensitive help message by pressing ESC. Then press ALT, then the letter m, then a, then o, then v. These are shortcuts to quickly navigate the ribbon to the View in Browser submenu item.

When you press v, a Security Warning dialog appears regarding opening messages in the browser. Select OK. Note, you can press TAB to navigate to the Please Do Not Show this Dialog Again checkbox, and press SPACEBAR to select it. This will prevent the Security Warning dialog box from displaying in the future.
@@
@msg2010BrowserOptionHelp
WARNING: Some messages with complex tables or other formatting are difficult to read with %product% when opened using Outlook versions higher than 2003. This is because Microsoft Word is now used to render the HTML content, which may make it difficult for the screen reader to display the message. If you have a message, such as a newsletter or e-mail invoice, you can use your browser to read the message more like earlier versions of Outlook.

If the current message is hard to read, either because of complex graphics or nested tables, open the message in your browser instead, as follows:

Dismiss the current screen-sensitive help message by pressing ESC. Then press ALT+H, then the letter A, then V. These are shortcuts to quickly navigate the ribbon to the View in Browser submenu item.

When you press the last letter - the V - a Security Warning dialog appears regarding opening messages in the browser. Select OK. Note, you can press TAB to navigate to the Please Do Not Show this Dialog Again checkbox, and press SPACEBAR to select it. This will prevent the Security Warning dialog box from displaying in the future.
@@
@msg2010BrowserOptionVirtualRibbonsOnHelp
WARNING: Some messages with complex tables or other formatting are difficult to read with JAWS when opened using Outlook versions higher than 2003. This is because Microsoft Word is now used to render the HTML content, which may make it difficult for the screen reader to display the message. If you have a message, such as a newsletter or e-mail invoice, you can use your browser to read the message more like earlier versions of Outlook.

If the current message is hard to read, either because of complex graphics or nested tables, open the message in your browser instead, as follows:

Dismiss the current screen-sensitive help message by pressing ESC. Then press ALT then the letter m, then m, then a, then v. These are shortcuts to quickly navigate the ribbon to the View in Browser submenu item.

When you press the last letter - the V - a Security Warning dialog appears regarding opening messages in the browser. Select OK. Note, you can press TAB to navigate to the Please Do Not Show this Dialog Again checkbox, and press SPACEBAR to select it. This will prevent the Security Warning dialog box from displaying in the future.
@@

;END_OF_UNUSED_VARIABLES

EndMessages

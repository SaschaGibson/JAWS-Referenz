; Message file for Windows Mail under Vista
; Copyright 2007-2015, Freedom Scientific, Inc.
;  03/13/07  DBrown
;

const
; Translate *after* the ":" character only.
jvToggleMessageHeaderVerbosity = "|ToggleMessageHeaderVerbosity:Message Header Fields  Announced with Message",
jvToggleMessageSayAllVerbosity = "|ToggleMessageSayAllVerbosity:Messages Read Automatically",
; Key names...
ksSpellCheckAddToDictionary="Alt+A",
ksSpellCheckChange="Alt+C",
ksSpellCheckIgnoreAll="Alt+G",
ksSpellCheckIgnore="Alt+I",
ksSpellCheckChangeAll="Alt+L",
ksSpellCheckDelete="Alt+D",
ksSpellCheckUndo="Alt+U",
ksDeleteMessage="Control+D",
ksReply="Control+R",
; Script names
cscSayPriorCharacterScript="SayPriorCharacter",
cscSayNextCharacterScript="SayNextCharacter",
; Spell check buttons
scYesButton="Yes",
scOkButton="OK",
scThereAre="There are", ; "There are no items" message when message list is empty.
sc_1 = "*",
scSeparator  = "\007",
scNull = "",
scComma = ",", ; Used in string segmenting of the status bar
scDateTimePickerControl="Date Time Picker",
scFrom="From:",
scHighlightWatchedMessages="Highlight watched messages:",
scOptions="Options",
scMessages="Message count",
;object names in links list dialog
scSortLinks = "Sort Links",
scDisplayLinks = "Display",
scAltI=" Alt+i", ; The object name in a particular area has just the hotkey.


;the following string should be translated from default.jgf
scCheckMark = "check mark",  ;graphic label for marlett97, marlett98
scCorner = "corner",  ;graphic label for marlett99, marlett100, marlett101, marlett102
cscAttachmentsRemoved="unsafe attachment",
scSearchResultsList="FTSearch",
;Window names
wn_SearchResults="Search results:",
wn_ChangeTo="Change To:",
wn_SuggestionsList="Suggestions:",
wn_Spelling="Spelling",
wnNewMessage="New Message",
wn_ColumnsDialog="Columns", ; Dialog name of Alt+V View menu, Columns...
wnAttachmentList="Attachments: ",
wn_help = "Windows Mail Help",
wnFindMessage = "Find Message",
wnLinks_List = "Links List",
wnToolBarList = "Select a Toolbar Button",
wnCheckSpelling = "Spelling",
wnBlockedSendersList="Blocked Senders List",
wnNewMailRule="New Mail Rule",
wnNewNewsRule="New News Rule",
wnMessageRules="Message Rules",
wnGoToFolder = "Go to Folder",
wnFolderList = "Folder List",
wn_FontDialog="Font",
wn_FontList="Font:",
wn_SizeList="Size:",
wn_StyleList="Style:",
;file names
msgFN4 = "HTML and Windows Help",

;function names -- do not translate
sf_TurnSuppressHighlightOff = "TurnSuppressHighlightOff",
sf_ReadPlainTextMessage="ReadPlainTextMessage",



;UNUSED_VARIABLES

; Translate *after* the ":" character only.
jvToggleMessageElementsVerbosity="|ToggleMessageElementsVerbosity:Frame and Link Count Announcement",

ToolbarDialogName = "Windows Mail Toolbar",
strToolbar = "Compose Message|Reply to Author|Reply to All|Forward Message|Send and Receive|Delete|Address Book",
HelpToolbarDialogName = "Windows Mail Help Toolbar",

; for the help Toolbar dialog
strToolbar1 = "Hide|Back|Forward|Options|Web",
strToolbar2 = "Show|Back|Forward|Options|Web",

; for the Select Tab dialog
SelectTabDialogName = "Select Tab",
strTabControl = "Contents|Index|Search",
cscSayLineScript="SayLine",

; Spell check buttons
scNoButton="No",

sc_2 = "GraphicsListHelper",
sc_3 = "Select a Link",
scVerticleBar = "|",

;for speaking unread message in the message list box
/* Note to translators

scRedMessage and scReadMessage should both be translated to
whatever the graphic for "read message" is labeled as in
the file Windows Mail.jgf
scUnreadMessage should be translated to whatever the graphic
for "unread message" is labeled as in the file Windows Mail.jgf */

scRedMessage = "red message",
scReadMessage = "read message",
scUnreadMessage = "unread message",

wn_NotInDictionary="Not In Dictionary:",
wn_RepeatedWord="Repeated Word:",
wn_Capitalization="Capitalization:",
OEdlg_RealName = "Windows Mail",
wnEditMailRule="Edit Mail Rule",
wnEditNewsRule="Edit News Rule",
wnMailRules="Mail Rules",
wnNewsRules="News Rules",
wnRulesList="Rules List",
wn_ColorList="Color:",
msgFN1 = "msohelp",
msgFN2 = "java",
msgFN3 = "default",
;function names -- do not translate
sf_TurnSuppressCheckForBoldOff = "TurnSuppressCheckForBoldOff"

;END_OF_UNUSED_VARIABLES

Messages
@msgNotChecked
not checked
@@
@msgChecked
checked
@@
;For msgOEVer_l %1 = the version of Windows Mail
@msgOEVer_l
OutlookExpress %1
@@
@msg_UnreadMessage_S
unread
@@
@msgBrlUnread
unrdmsg
@@
@msg_NoOpenMessage1_L
Not in an open message
@@
@msg_NoOpenMessage1_S
No open message
@@
@msg_NoAttachments1_L
There are no attachments in this message.
@@
@msg_NoAttachments1_S
no attachments
@@
@msg_from1_L
From
@@
@msg_date1_L
Date
@@
@msg_to1_L
To
@@
@msg_cc1_L
Cc
@@
@msg_bcc1_L
Bcc
@@
@msg_subject1_L
Subject
@@
@msg_FieldNotFound1_L
Field not found
@@
@msg_FieldNotFound1_S
Not found
@@
@msg_NextMessage1_L
Next message
@@
@msg_NextMessage1_S
Next
@@
@msg_PreviousMessage1_L
Previous Message
@@
@msg_PreviousMessage1_S
Previous
@@
@msg_DeleteMessage_L
MessageDeleted
@@
@msg_DeleteMessage_S
Deleted
@@
@msgNoLinks_L
No links found on page
@@
@msgNoSuggestions
No suggestions
@@
@msgNotInSpellChecker
Not in spell checker
@@
@msgAlreadyInMessageBody_L
Already in Message Body Window
@@
@msgAlreadyInMessageBody_S
Already in Message Body
@@
@msgPageHas1_L
Page Has
@@
@msgFramesAnd1_L
Frames, and
@@
@msgLink1_L
Link
@@
@msgLinks1_L
Links
@@
@msgToolbarListError1_L
You must exit the current dialog in order to access the toolbar
@@
@msgToolbarListError2_L
Toolbar not found
@@
@msgListName1
Select a Toolbar Button
@@
@msgHotKeyHelp1a_L
To move through links contained in this message, press %KeyFor(Tab) and %KeyFor(SHIFTTAB)
To select a link from a list of all the available links, press  %KeyFor(SelectALink).
Press the following keys once to read a field, or twice to move focus to that field.
Read From field, %KeyFor(ReadFromField).
Read Date field, %KeyFor(ReadDateField).
Read TO field, %KeyFor(ReadToField).
Read Carbon Copy field, %KeyFor(ReadCcField).
Read Blind Carbon Copy field, %KeyFor(ReadBccField).
Read Subject field, %KeyFor(ReadSubjectField).
Go to the Message body, %KeyFor(GoToMessageField).
Reply directly to sender, %KeyFor(ReplyDirectlyToSender).

@@
@msgHotKeyHelp1b_L
To edit one of the header fields, use %KeyFor(Tab) and %KeyFor(ShiftTab) to move to the relevant field, or press one of the following keys to hear the contents of the field, press twice to jump to that field:
Read From field, %KeyFor(ReadFromField).
Read Date field, %KeyFor(ReadDateField).
Read TO field, %KeyFor(ReadToField).
Read Carbon Copy field, %KeyFor(ReadCcField).
Read Blind Carbon Copy field, %KeyFor(ReadBccField).
Read Subject field, %KeyFor(ReadSubjectField).
Go to the Message body, %KeyFor(GoToMessageField).
Check spelling, F7.
Reply directly to sender, %KeyFor(ReplyDirectlyToSender).
Cancel the message, %KeyFor(UpALevel).
To save the message, Alt+S.
@@
@msgHotKeyHelp2_L
To click a button in the toolbar, use %KeyFor(ToolbarList)
@@
@msgScreenSensitiveHelp1a_L
This is the message body window in which you can read or compose a message.
Use standard navigation keys to move through the message.
Press insert plus h to get a list of hot keys.
@@
@msgScreenSensitiveHelp1b_L
This is the message body field where you type your message or reply.
Use standard navigation and editing keys to move through and edit the text.

Press insert plus h to get a list of hot keys.
@@
@msgScreenSensitiveHelp3_L
This is a list of the buttons in the Windows Mail toolbar.
Select a button using the arrow keys or the first letter of the label and press enter to
click on it.
@@
;%1=SayNextCharacter,%2=SayPriorCharacter
;%3=SayNextLine,%4SayPriorLine, %5=Tab
@msgDateTimePicker_L
This is the Date selection list box.
To activate the list, press the SpaceBar.
Press %1 and %2 to move between the month, day, and year fields.
Press %3 and %4 to alter their values.
@@
@msgDateTimePicker_S
Date selection list box.
SpaceBar activates the list.
%1 and %2 moves between the fields.
%3 and %4 alters their value.
@@

@msgScreenSensitiveHelpMesssageList_L
This is a list view. Use %1 and %2 to read through the items
Use %3 to open a message.
@@
@msgScreenSensitiveHelpMesssageList_S
Use %1 and %2 to read through the items
%3 opens the message.
@@
;for links list ScreenSensitiveHelp
@msgScreenSensitiveHelp7_L
This list contains the links found in the current message.
Use %1, %2, or the link's first letter to move to a particular link.
Press %3 to launch your web browser, activate the selected link
and move to the web page the linc points to.
For other options regarding this list, press %4.
@@
@msgScreenSensitiveHelp8_L
This is the Blocked Senders list.
There are two checkboxes that can only be accessed with the mouse.
The first checkbox is for blocking the current entry from email, and the second checkbox is to block within News groups.
To check or uncheck the two checkboxes, activate the JAWS cursor and click on the desired checkbox.
The SpaceBar cannot be used to do this task.

@@
@msgMoveToLinkButton
Choosing this button will move you to the selected link without activating the link.
@@
@msgActivateLinkButton
Choosing this button will activate the selected link and take you to the
web page the linc points to.
@@
@msgCancelButton
Choosing this button will close links list and return you to the current message.
@@
@msgSortLinks
These choices change the order that links appear in the links list.
@@
@msgDisplayLinks
These choices determine which links from the current page will be displayed in the list.
@@
; for MsgUnReadMessages, %1 is the numbr of unread mesages
@MsgUnReadMessages
%1 unread
@@
@MsgMessageListTitle_L
Windows Mail Message List
@@
; %1=SayPriorCharacter, %2=SayNextCharacter
@MsgMessageRulesTabControl
 To switch pages press %1 or %2.
@@
@MsgBlockSendersModifyMessage
 Select the Modify button to change the checkbox states.
@@
@msgAppSettingsSaved1_L
Application Settings saved
@@
@msgAppSettingsNotSaved1_L
Application Settings could not be saved
@@
@msgReplyingDirectlyToSender
Replying directly to sender.
@@


;UNUSED_VARIABLES

@msg_UnreadMessage_L
unread message
@@
@VMsgEdit1_L
edit
@@
@msgNoSuggestions1_L
no suggestions
@@
@msgNoLinks_S
No links found
@@
@msgReply
Reply
@@
@msgAlreadyInHJDialog_L
There is currently an open %product% dialog box
Only one %product% dialog  box can be opened at a time
In order to bring up the requested dialog box, you must close the current dialog by pressing Escape and then activate the desired dialog box
@@
@msgAlreadyInHJDialog_S
There is currently an open %product% dialog box
Only one %product% dialog can be opened at a time
You must close the current dialog and then activate the desired dialog box
@@
@msgOEHelpTopic_L
To hear the %product% help topic for Windows Mail, hold down the insert key and press F1 twice in rapid succession
@@
@msgOEHelpTopic_S
For help topics for Windows Mail, hold insert and press F1 twice rapidly
@@
@msgOExpress1_L
Windows Mail Version 6
@@
@msgHotKeyHelp3_L
Press the following keys once to read a field, or twice to
move focus to that field.

Read From field, %KeyFor(ReadFromField).
Read Date field, %KeyFor(ReadDateField).
Read TO field, %KeyFor(ReadToField).
Read Carbon Copy field, %KeyFor(ReadCcField).
Read Blind Carbon Copy field, %KeyFor(ReadBccField).
Read Subject field, %KeyFor(ReadSubjectField).
Go to the Message body, %KeyFor(GoToMessageField).
Reply directly to sender, %KeyFor(ReplyDirectlyToSender).

@@
@msgScreenSensitiveHelp2_L
This is a list of all the links contained on the current nessage.
Select a link using the arrow keys or the first letter and press enter to go to it.
@@
@msgScreenSensitiveHelp4_L
This is the help topic window in which you can read the currently loaded document.
To switch to the left pane in the help window, use %KeyFor(NextDocumentWindow).
To select a page, press %KeyFor(SelectHelpTab).
For more %product% hotkeys, press %KeyFor(HotKeyHelp).
@@
@MsgYes
Yes
@@
@MsgNo
No
@@

;END_OF_UNUSED_VARIABLES

EndMessages

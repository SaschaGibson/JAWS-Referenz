; Copyright 1995-2018 by Freedom Scientific, Inc.
; JAWS 11.0.xxx
;Skype message file

Const
; Skype Keystrokes Dialog List:
	dlg_SkypeKeystrokesList_Title = "Skype Keystrokes List",
	LIST_ITEM_BACK = "Back - %keyFor(BackButton)",
	LIST_ITEM_CHAT_EDIT = "Chat Edit Field - %keyFor(MoveToChatEntryField)",
	LIST_ITEM_CHAT_HISTORY = "Chat History List - %keyFor(MoveToChatHistoryList)",
	LIST_ITEM_CONVERSATIONS = "Conversations List - %keyFor(MoveToConversationsList)",
;string compares:
; for scConversationsList, focus on the conversations list in the main window.
; Touch Cursor -> Advanced Mode -> Up Arrow to Parent object -> alt+Enter.
; Copy the name from the resulting Vurtual buffer.
	scConversationsList = "Conversations list",
; for scChatEntryField and scChatEntryField2, tab to and find the chat entry field on the Skype window.
; Script Utility Mode -> f10 to Object Name -> Control+f9 to copy.
; scChatEntryField is for Skype 8.50 and later, and may not even have changed in your language.
	scChatEntryField = "Type a message here",
	scChatEntryField2 = "Type a message",
; for scCreateNewGroup , find the chat history in an open conversation, and press shift+tab once to the button.
; Script Utility Mode -> f10 to Object Name -> control+f9 to copy.
	scCreateNewGroup = "Create new group",
; for scAddToGroup, find button labeled Add To group	in Group Conversation Window 
; From Skype main window, press control+G Create New Group.
; Name the group, hit Next.
; Use Search and add contacts to group, use enter on the contact name to select the checkbox.
; Press Done.
;Tab around to the button labeled Add To Group
; Script Utility Mode -> f10 to Object Name -> control+f9 to copy.
	scAddToGroup = "Add to Group",
; for scNewChat, tab to the New Chat button menu on the main Skype window.
; Script Utility Mode -> f10 to object name -> control+f9 to copy.
	scNewChat = "New Chat",
; for scClearText, open a conversation. 
; Set focus to the chat entry field and shift tab until you find it.
; It is one button next to the Create New Group button,
;between Create New Group and the chat history list.
; Script Utility Mode -> Control+F9 to copy the Object Name for your language.
	scClearText = "Clear text",
;for scHistoryLongDescriptionTimeSeparator, this is the text in the history list Object name after the message, before the username:
;example: from Joe at 7:25 AM
; Available via GetObjectName (TRUE) script function, 
; or Script Utility Row -> Control+f9 to copy to clipboard from the history window.
; this is the chat history when in an open Skype conversation.
	scHistoryLongDescriptionTimeSeparator = " at ",
;for checkable listbox graphics:
	scCheckmark="check mark",
	scUnchecked="corner",
;for scroll symbol in some listboxes:
	scScrollSymbol="scroll",

;for parsing labels and help messages:
	SC_Dots = "...",
	sc_RightParen=")",

;window names:
	wn_SkypeOptions = "Skype™ - Options",
	; for Name_Profile, open a conversation and tab to the button with the person's name, followed by the text View profile
	; This is the last part of the name for this button, contains the string view profile.
	; Script Utility Mode -> f10 to object name -> Control+f9 gets you the name.
	; Paste that in a text file and extract the part at the very end which corresponds to View profile
	Name_Profile = "View profile",
	; for Name_BackButton, find the back button when you open a conversation.
	; This is only available in Skype 8.33 and later.
	; It also stopped being available in early 2019, so if you don't find it, probably you don't need to worry about it.
	; Script Utility Mode -> f10 to Object Name -> control+F9 to copy
	Name_BackButton = "Back",



;UNUSED_VARIABLES

;for stripping out "selected"  from some listboxes:
	scSelected="selected"

;END_OF_UNUSED_VARIABLES

Messages
@MSG_ContactListHelp
This is a contact list containing all of your contacts that are recognized by Skype.
Use %KeyFor(SayNextLine) and %KeyFor(SayPriorLine) to move through the contact list.
Press Enter to perform a call to the selected contact.
@@
@MSG_HistoryListHelp
This is a list containing the whole history of your calls, chat messages and voice mails.
Use %KeyFor(SayNextLine) and %KeyFor(SayPriorLine) to move through the list.
Press Enter to perform a call to the contact that is under the selected history list item.
@@
@MSG_Skype4ListHelp
This is a %1 containing your contacts that are recognized by Skype.
Use %KeyFor(SayNextLine) and %KeyFor(SayPriorLine) to move through the contact list.
Press Enter or Spacebar to get additional information on the selected contact.
@@
;For msgSkypeVersion, %1 is the version number.
@msgSkypeVersion
Skype Version %1
@@
@msgHideHelpWindow
Hide Help Window.

@@
@MSG_UpdateRequest
This is Skype version 4.0. It is not readily accessible. For best performance with %product%, please upgrade to Skype version 4.1 or above.
@@
@MSG_ContactListScreenSensitiveHelp
This is the %1. To move to an item press the Arrow keys. To select the particular contact, press the SPACEBAR or ENTER key. You can shrink the contact list by starting to type the name of the contact you want.
@@
@msgHotKeyHelpBackgroundNotification
To hear the last Skype background notification announced from anywhere, press %KeyFor(RepeatLastSkypeNotification)
@@
@MsgHotKeyHelpOutsideChatWindow
From within a Skype chat window:
@@
@msgChatEditWindowHotkeyHelp
To place focus on the chat text entry field, press %KeyFor(MoveToChatEntryField).
To review the last ten messages sent or received, press Control with 1 through 0, where 1 is the most recent message and 0 is the 10th most recent message.
To set the current conversation window as one of the five conversation window presets, press Control+Windows+1 through 5.
To return to this conversation from another application, press JAWSKey+Space followed by the number of the preset you assigned it to.
@@
@msgHotKeyHelpSkype8Plus
To move to the chat edit field for the active conversation, press %keyFor(MoveToChatEntryField).
To move to the history list for the active conversation, press %keyFor(MoveToChatHistoryList).
To move to the list of available conversations, press %keyFor(MoveToConversationsList).

Press Escape to close this message.
@@
@MSG_ContactsLeft_L
%1 contacts left in the list, namely: %2.
@@
@MSG_ContactsLeft_S
%1 contacts left.
@@
@msgChatHistoryListboxHotkeyHelp
This is a list containing the history of the contents of your chats. You can navigate this list by lines to see what each person has said and when.
@@
@msgConversationWindowNotFound
Conversation window not available.
@@
;for msgNthConversationNotFound, %1 = the number of the conversation, from 1 through 10
@msgNthConversationNotFound
Message %1 not available.
@@
@msgChatWindowNotAvailable
No chat window available.
@@
@msgChatHistoryNotAvailable
No chat history available.
@@
@msgConversationsListNotAvailable
No conversations list available.
@@
@msgConversationNotOpen_L
No conversation open. Select and open a conversation before using this keystroke.
@@
@msgConversationNotOpen_S
Conversation not open.
@@
@msgBackButtonNotAvailable
Back button not available
@@
@msgBackButton
Back
@@
@msgChatWindow
Focus to Chat window
@@
@msgMoveToConversationsList
Conversations list
@@
@msgMoveToHistoryList
History list
@@
@msgBeginningOfConversation
Beginning of conversation.
@@
@msgNoPreviousNotification
No previous Skype notification since you started JAWS.
@@
@msgAboutSkype
About Skype dialog
@@
@msgSkypeLayerHelpScreenTitle
Skype Layer Help Screen
@@
@msgSkypeLayerHelp
The following commands are available in the Skype layer.
To move to the chat entry field, press E.
To move to the chat history, press H.
To move to the list of conversations, press C.
Press Escape to exit the Skype layer.
@@
; msgWindowKeysHelp is specific to Skype version 8 or higher and is not called from the legacy Skype 7 scripts:
@msgWindowKeysHelp
To open the Notification panel, press Control + I
to open app settings, press Control+comma
to open Help in default browser, press Control+H
To launch main dial pad, press Control+D
To start an audio call, press Control+Shift+P
To start a video call, press Control+Shift+K
To hang up, press Control+E
To toggle mute, press Control+M
To send a file, press Control+Shift+F
To start a new conversation, press Control+N
To start a new group, press Control+G
To search for all contacts, messages and bots, press Control+F
To search within the selected message, press Control+Shift+S
To navigate to recent chats, press Alt+1
To open contacts, press Alt+2
To open contact screen to bots, press Alt+3
To send feedback to Microsoft, press Control + O
To refresh the app, press Control+R
Open themes, press Control+T
To edit the last message sent, press Up arrow after sending a message
To show the conversation profile, press Control+P
To add people to the conversation, press Control+Shift+A
To mark the item as unread, press Control+Shift+U
To take a snapshot, press Control+S

Press ESCAPE to close this message.
@@

;UNUSED_VARIABLES

@MSG_OptionsTreeViewHelp
This is the page selection treeview in the Options window. You are on the %1 item to %2.
Use %KeyFor(SayNextLine) and %KeyFor(SayPriorLine) to move through the treeview and select a different page.
Press %KeyFor (Tab) to move through the controls of that page.
@@
@MSG_OptionsTreeViewAdditionalHelp
This is the page selection treeview in the Options Window. You are on the %1 item for %2.
Use %KeyFor(SayNextLine) and %KeyFor(SayPriorLine) to move through the treeview and select a different page. 
Press %KeyFor (Tab) to move through the controls of that page.
@@
@MSG_OptionsPageAdditionalHelp
This is page %1 in the Options Window. You are  on the %2 item for %3. Press %KeyFor (Tab) to move through the controls of this page.
@@
@MSG_OptionsPageHelp
This is page %1 in the Options window. You are  on the %2 item to %3. Press %KeyFor (Tab) to move through the controls of this page.
@@
@msgTreeviewItemsScreenSensitiveHlp
This is the Options dialog tree view. Arrow up and down  the list to navigate and select topics. When you select the topic, TAB to move to the dialog pane to view the associated controls.

There are 25 items in this tree view list. Six level-one group titles include General, Privacy, Notifications, Calls, IM & SMS, and Advanced. These group headings are visually represented and act as group headings only. So they are in the numeric status order, such as 1 out of 25 and 6 out of 25 items. But they are not directly accessed. Instead, these main group headings expand and collapse as you arrow up or down through the list. The accessible topics for each group are exposed.

Press PAGE UP and PAGE down to move by group. Press HOME to move to the first topic in the list and END to move to the last topic in the list.
@@

;END_OF_UNUSED_VARIABLES

EndMessages
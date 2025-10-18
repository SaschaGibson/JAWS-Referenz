; Copyright 2010-2024 Freedom Scientific, Inc.
; JAWS script Message file for Mozilla Thunderbird e-mail client

Const
	CustomizeMessageListDialogueTitle = "Customize Message List",

	; JAWS options dialogue items...
	HeadersAnnouncementItemName = "Headers Announcement",
	AutoReadMessageItemName = "Auto Read Message",
	
	wn_SaveMessage = "Save Message",
	wn_CC = "cc",
	wn_ReplyTo = "reply-to",
	wn_To = "to",
	wn_Write = "Write",
	; for wn_CheckSpelling, bring up spell check in Thunderbird, get the window name from the focused window 
	; Script Utility row | f3 to window name | control+F1 to copy the name to the clipboard.
	wn_CheckSpelling = "Check Spelling"

Messages
@MSG_NotInThisDialogue_L
This field is not available in this particular dialogue.
@@
@MSG_NotInThisDialogue_S
Not available.
@@
@MSG_OptionsTemplate
%1 Options
@@
; help messages to JAWS options...
@MSG_HeadersAnnouncementHelp
This option is used to toggle on or off the announcement of headers when automatic reading of messages occurs. The default value is to read headers while automatic reading of messages.
@@
@MSG_AutoReadMessagesHelp
This option is used to toggle on or off the automatic reading of messages on opening. The default value is to read messages automatically.
@@
@MSG_JunkStatus
Junk
@@
@MSG_SearchMessagesWindowTitle
Search Messages
@@
@msg_column
Column %1
@@
@msg_row
Row %1
@@
; msgCountOfMessages is announced as part of the SaybottomLineOfWindow script, after announcing the status bar, when in a message list.
; %1 is the count of messages in the current message list.
@msgCountOfMessages
%1 messages
@@
; msgToolBar is added as an announcement by JAWS when focus moves to the tool bar for message list column headers or the toolbar in an open message.
@msgToolBar
toolbar
@@
EndMessages

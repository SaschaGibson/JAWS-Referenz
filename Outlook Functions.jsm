; Common object messages file for Microsoft Outlook 2003 - 2007.
; Copyright 2009-2015, Freedom Scientific, Inc.

Const
; for all constants starting with NumberOf:
; We need the values to show up in the .po file and so these are in quotes.
; you'll have to translate these in order for their flags to show on the Braille display and be read out.
	; Note for localizers:
	; for correct changing of the constants you have to get the Object name of the unread replyed message in the folder.
	; for doing this - select an ordinary message that was replyed and mark it as unread by pressing Control+U on it.
	; Press the HomeRowToggle hotkey (Windows+JAWSKey+NumPadMinus by default)
	; after that you have to cycle through different pieces of information by pressing the F10 key untill you hear 'Name'
	; and then press the F9 key to get the name in a virtual viewer. You will get something like: 'Message Unread Replyed'.
	; The constants following this comment do provide the number of segments separated by spaces for the all the pieces of the information you got in a Virtual Viewer respectively.
	NumberOfSegmentsOfMessage = "1",	; Number of segments in a 'Message' header or whatever it sounds like on your language - see an above example.
	; Note for localizers:
	; for correct changing of the constants you have to get the Object name of the unread replyed Meeting Request in the folder.
	; for versions of Outlook newer than 2010, use the object value instead of the name.
	; for doing this - select a Meeting Request that was replyed and mark it as unread by pressing Control+U on it.
	; The same actions should also be performed for 'Meeting accepted' and 'Meeting declined' ones.
	; Press the HomeRowToggle hotkey (Windows+JAWSKey+NumPadMinus by default)
	; after that you have to cycle through different pieces of information by pressing the F10 key untill you hear 'Name'
	; and then press the F9 key to get the name in a virtual viewer. You will get something like: 'Meeting Request Unread Replyed'.
	; The constant following this comment do provide the number of segments separated by spaces you got in a Virtual Viewer.
	NumberOfSegmentsOfMeetingRequest = "2",	; Number of segments in a 'Meeting Request' header or whatever it sounds like on your language - see an above example.
	NumberOfSegmentsOfMeetingAcceptance = "2",	; number of segments in a 'Meeting Accepted' header or whatever it sounds like on your language - see an above example.
	NumberOfSegmentsOfMeetingDeclined = "2",	; number of segments in a 'Meeting declined' header or whatever it sounds like on your language - see an above example.
	NumberOfSegmentsOfMeetingDancellation = "2",	; number of segments in a 'Meeting cancelled' header or whatever it sounds like on your language - see an above example.
	; Note for localizers:
	; for correct changing of the constants you have to get the Object name of the unread replyed Undelivered report in the folder.
	; for doing this - select a undelivered report that was replyed and mark it as unread by pressing Control+U on it.
	; Press the HomeRowToggle hotkey (Windows+JAWSKey+NumPadMinus by default)
	; after that you have to cycle through different pieces of information by pressing the F10 key untill you hear 'Name'
	; and then press the F9 key to get the name in a virtual viewer. You will get something like: 'Undelivered Report (Message) Unread Replyed'.
	; The constant following this comment do provide the number of segments separated by spaces you got in a Virtual Viewer.
	NumberOfSegmentsOfUndeliveredReport = "3",	; number of segments in a 'Undelivered report' header or whatever it sounds like on your language - see an above example.
	NumberOfSegmentsOfOutOfOfficeAutoReply = "4",
	NumberOfSegmentsOfTaskRequest = "2",

	; Note for localizers:
	; for correct changing of the constants you have to get the Object name of the read message in the folder.
	; for doing this - select an ordinary message that was read in the folder.
	; Press the HomeRowToggle hotkey (Windows+JAWSKey+NumPadMinus by default)
	; after that you have to cycle through different pieces of information by pressing the F10 key untill you hear 'Name'
	; and then press the F9 key to get the name in a virtual viewer. You will get something like: 'Message Read'.
	; The constant following this comment do provide the number of segments separated by spaces you got in a Virtual Viewer.
	NumberOfSegmentsOfReadFlag = "1",	; Number of segments in the 'Read' flag or whatever it sounds like in your language - see an above example.
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
	; for sc_WithAttachments and sc_AttachmentWithAttachments
	; Office 2016 and later only.
		; select message in mailbox that has an attachment and copy out Object name:
		; Script Utility Mode -> f10 to Object name -> Control+f9 to retrieve name.
		; Then copy only up to the first punctuation mark, comma in case of English:
sc_WithAttachments = "With Attachments",
sc_AttachmentWithAttachments = "Attachment With Attachments",
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
	sc_MeetingRequest = "Meeting Request",
	; From meeting notifications in Inbox
	sc_MeetingCancelled = "Cancelled",
	sc_MeetingAccepted = "Acceptance",
	sc_MeetingTentative = "Tentative Acceptance",
	sc_Meeting = "Meeting",
	sc_appointment = "Appointment",



;UNUSED_VARIABLES

	NumberOfSegmentsOfUnreadFlag = 1,	; Number of segments in the 'Unread' flag or whatever it sounds like in your language - see an above example.
	NumberOfSegmentsOfReplyedFlag = 1,	; Number of segments of 'Replyed' flag or whatever it sounds like on your language.

	; The reminder column header is not returned from OOM for some reason, so I had to hardcode it...
	; To get the exact value select the appointment with the reminder and look at the object value...
	SC_ReminderLabel = "Reminder",

	sc_SendPersonal = "Personal",
	sc_SendConfidential = "Confidential",
	sc_Recurring = "Recurring",
	sc_Private = "Private",
	sc_flagged = "Flagged"

;END_OF_UNUSED_VARIABLES

Messages
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
; None of this applies if you have a localized outlook.jbs file with these strings you can copy from, and remove the value: segment at the beginning.
@msgBrlFlagsCollection
meeting request=mreq
task request=treq
meeting cancelation=mcncl
@@
EndMessages

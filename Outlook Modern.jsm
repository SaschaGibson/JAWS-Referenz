;Copyright 2024 by Freedom Scientific, Inc.
;Unified Outlook  message file

const
	;label of Cc field in open read only message
	scCc = "Cc:",
	;label of Bcc field in open read only message from sent folder
	scBcc = "Bcc:",
	;label for attachments field in open readonly or editable message
	scFileAttachments = "file attachments",
	;prefix of contact name in first line of from field in read only message when using virtual cursor
	scOpensProfileCard = "Opens Profile Card for",
	;prefix of contact name(s) in To field of read only message
	scOpensCard = "Opens card for"

Messages
@msgOutlookModern
Outlook Modern
@@
; msgMoveToMessageListError is spoken when the script to move to the message list fails.
@msgMoveToMessageListError
Could not move to message list
@@
;msgFrom is used to indicate the From field in an open read only message when pressing ALT+1.
;%1 is the contact the message is from.
@msgFrom
From: %1
@@
;msgSent will indicate the Sent information in an open read only message when pressing ALT+2.
;%1 is the date/time the message was received.
@msgSent
Sent: %1
@@
;msgTo is used to indicate the To field in an open read only or editable message when pressing ALT+3.
;%1 is the contact(s) the message is to.
@msgTo
To: %1
@@
;msgCc is used to indicate the Cc field in an open read only or editable message when pressing ALT+4.
;%1 is the contact(s) in the Cc field.
@msgCc
Cc: %1
@@
;msgSubject is used to indicate the subject of an open read only or editable message when pressing ALT+5.
;%1 is the subject.
@msgSubject
Subject: %1
@@
;msgBcc is used to indicate the Bcc field in an open read only or editable message when pressing ALT+6.
;%1 is the contact(s) in the Bcc field.
@msgBcc
Bcc: %1
@@
EndMessages

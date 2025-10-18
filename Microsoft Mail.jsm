const
; for scCalendar, start Calendar and note the name of the calendar as presented by Insert+T
	; or use Script Utility Row | Real Window Name
	; But without the view name, just the string Calendar in English
	scCalendar = "Calendar"
messages
;for msgHeaders, don't replace the blank lines, just translate the text.
; These are just text, not from window or object, since the Mail app doesn't present the header names.
@msgHeaders
From:
Sent:
Subject:
@@
; for msgMessagesListName, there is no name in the application, we provide one. 
@msgMessagesListName
Messages
@@
; for msgMessageLinkCount, %1 is the number of links in the message.
@msgMessageLinkCount
Message has %1 links.
@@
@msgMessageLinkCount_S
%1 links.
@@
endMessages
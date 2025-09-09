;9.x Message file for OutlookCustomSettings script set.
; Copyright 2010-2015 Freedom Scientific, Inc.
; 06/27/07 DBrown

Const
; constants for verbosity settings
; Translate text *after* the ":" character only.
	jvToggleMessageHeader="|ToggleMessageHeaderVerbosity:Message Header Fields Announced With Message",
	jvToggleMessageElements="|ToggleMessageElementsVerbosity:Frame and Link Count Announcement",
	jvToggleMessageSayAll="|ToggleMessageSayAllVerbosity:Messages Read Automatically",
	jvToggleAttachments="|ToggleAttachmentsVerbosity:Message Attachment Notification Using MSAA",
	jvToggleInfoBar="|ToggleInfoBarVerbosity:Information Bar Messages Announcement",
	jvToggleAutoComplete="|ToggleAutoCompleteVerbosity:Address List Auto-Complete Announcement",
	jvToggleMessageStatus="|ToggleMessageStatusVerbosity:Message Read/Unread Status Indication",
	jvToggleMeetingRequest="|ToggleMeetingRequestVerbosity:Message Meeting Request Indication",
	jvToggleMessageFlag="|ToggleMessageFlagVerbosity:Message Flags Announcement",
	jvToggleForwardedFlag="|ToggleForwardedFlagVerbosity:Message Forwarded Flag Indication",
	jvToggleRepliedFlag="|ToggleRepliedFlagVerbosity:Message Replied Flag Indication",


;UNUSED_VARIABLES

	jvToggleMessageTitle="|ToggleMessageTitleVerbosity:Message Title Announced When Reading.",
	jvToggleMessageReadingPane="|ToggleReadingPaneVerbosity:Reading Pane Reads Automatically",
	jvToggleFollowUpFlag="|ToggleFollowUpFlagVerbosity:Message Follow-up Flag Indication"

;END_OF_UNUSED_VARIABLES

Messages
@MsgSayUnRead
Say Unread
@@
@MsgSilent
Silent
@@


;UNUSED_VARIABLES

@msgOn
On
@@
@msgOff
Off
@@

;END_OF_UNUSED_VARIABLES

EndMessages
;Copyright 1995-2015 Freedom Scientific, Inc.
;JAWS 12.0.xx Header file for OutlookCustomSettings 2007 script set.

Globals
; for Outlook 2007 and abovelink counts:
	int gbMessageLinkCountIndication,
; for SayAllReadsBy options:
	int giSayAllReadBy,
;other Outlook settings:
	int giOutlookAutoCompleteVerbosity,
	int giOutlookMeetingRequestVerbosity,
	int giOutlookMessageStatusVerbosity,
	int giOutlookRepliedFlagVerbosity,
	int giOutlookForwardedFlagVerbosity,
	int giOutlookFollowUpFlagVerbosity,
	int giOutlookMessageFlagVerbosity,
	int giOutlookMessageSayAllVerbosity,
	int giOutlookMessageHeaderVerbosity,
	Int giOutlookMessageTypeVerbosity,
	int giOutlookAttachmentsVerbosity,
	int giOutlookInfoBarVerbosity,
	int giOutlookBlockQuoteIndication,
	int giOutlookFrameIndication,
	int giOutlookHeadingIndication,
	int giOutlookListIndication,
	int giOutlookTableIndication,
	int giOE6MessageSayAllVerbosity,
	int giOE6ElementsVerbosity,
	int giOE6MessageHeaderVerbosity,
	int giOE6BlockQuoteIndication,
	int giOE6FrameIndication,
	int giOE6HeadingIndication,
	int giOE6ListIndication,
	int giOE6TableIndication,
	int OutlookVersion

Const
	OE6=6,
; JSI File names...
	fn_OutlookExpressJSI="OutlookExpress.JSI",
	fn_WindowsLiveMailJSI="Windows Live Mail.JSI",
	fn_WindowsMailJSI="Windows Mail.JSI",
; JSI Section names...
	snOptions="Options",
	snHTML="HTML",
; JSI Key names...
	HKey_AutoComplete= "AutoCompleteVerbosity",
	HKey_MessageStatus= "MessageStatusVerbosity",
	HKey_ForwardedFlag= "ForwardedFlagVerbosity",
	HKey_RepliedFlag= "RepliedFlagVerbosity",
	HKey_FollowUpFlag= "FollowUpFlagVerbosity",
	HKey_MessageFlag= "MessageFlagVerbosity",
	HKey_MessageSayAll= "MessageSayAllVerbosity",
	HKey_MessageHeader= "MessageHeaderVerbosity",
	HKey_Attachments= "AttachmentsVerbosity",
	HKey_InfoBar= "InformationBARVerbosity",
	HKey_MeetingRequest= "MeetingRequestVerbosity",
	hKey_SayAllReadBy="SayAllReadBy",
	hKey_MessageLinkCountIndication="MessageLinkCountIndication"
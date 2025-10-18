; Copyright 2010-2015 Freedom Scientific, Inc.
;9.x header file for OutlookCustomSettings script set.


Globals
; for SayAllReadsBy options:
	int giSayAllReadBy,
; active application flag identifiers:
	int gbOE6IsActive,
	int gbWindowsMailIsActive,
	int gbWindowsLiveMailIsActive,
	int giOutlookMessageElementsVerbosity,
	int gbMessageLinkCountIndication,
	int giOutlookMessageTitleVerbosity,
	int gbOutlookReadingPaneVerbosity,
	int giOutlookAutoCompleteVerbosity,
	int giOutlookMeetingRequestVerbosity,
	int giOutlookMessageStatusVerbosity,
	int giOutlookRepliedFlagVerbosity,
	int giOutlookForwardedFlagVerbosity,
	int giOutlookFollowUpFlagVerbosity,
	int giOutlookMessageFlagVerbosity,
	int giOutlookMessageSayAllVerbosity,
	int giOutlookMessageHeaderVerbosity,
	int giOutlookAttachmentsVerbosity,
	int giOutlookInfoBarVerbosity,
; Outlook Express 6
	int giOE6MessageSayAllVerbosity,
	int giOE6MessageHeaderVerbosity,
	int giOE6MessageElementsVerbosity,
	int gbOE6MessageTitleVerbosity,
	int gbOE6ReadingPaneVerbosity,
	int gbWMMessageSayAllVerbosity,
	int gbWMMessageHeaderVerbosity,
	int gbWMMessageElementsVerbosity,
	int gbWMReadingPaneVerbosity,
	int gbWMMessageTitleVerbosity,
; Windows Live Mail
	int gbWLMMessageSayAllVerbosity,
	int gbWLMMessageHeaderVerbosity,
	int gbWLMMessageElementsVerbosity,
	int gbWLMMessageTitleVerbosity,
	int gbWLMReadingPaneVerbosity,
	int OutlookVersion

Const
	OE6=6,
	WM7=7,
	WLM=12,
; JSI File names...
	fn_OutlookJSI="Outlook.JSI",
	fn_OutlookExpressJSI="OutlookExpress.JSI",
	fn_WindowsMailJsi="Windows Mail.jsi",
	fn_WindowsLiveMailJsi="Windows Live Mail.jsi",
; JSI Section names...
	snOptions="Options",
	snHTML="HTML",
; JSI Key names...
	HKey_MessageElements= "MessageElementsVerbosity",
	hKey_MessageSayAllVerbosity = "MessageSayAllVerbosity",
	HKey_MessageTitle= "MessageTitleVerbosity",
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
	HKey_ReadingPane= "ReadingPaneVerbosity",
	hKey_SayAllReadBy="SayAllReadBy"
;Copyright 1995-2015 Freedom Scientific, Inc.; Outlook Custom Settings Script Set
;JAWS 12.00.xx

; These files contain the Outlook and Outlook Express verbosity functions.
include "HjConst.jsh"
include "HjGlobal.jsh"
include "Common.jsm"
include "outlook2007.jsm"
include "OutlookCustomSettings2007.jsh"
include "OutlookCustomSettings2007.jsm"
include "olUO.jsm"

Const
	Office2010=14,
	Office2007=12


String Function ToggleIndicateBlockQuotesVerbosity (int iRetCurVal)
var
	int iOption
Let iOption = getJcfOption (optBlockQuoteIndication)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	SetJcfOption (optBlockQuoteIndication,iOption)
EndIf
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

String Function ToggleIndicateFramesVerbosity (int iRetCurVal)
var
	int iOption
Let iOption = getJcfOption (optFrameIndication)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	SetJcfOption (optFrameIndication,iOption)
EndIf
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

String Function ToggleIndicateHeadingsVerbosity (int iRetCurVal)
var
	int iOption
Let iOption = getJcfOption (optHeadingIndication)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	SetJcfOption (optHeadingIndication,iOption)
EndIf
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

String Function ToggleIndicateListsVerbosity (int iRetCurVal)
var
	int iOption
Let iOption = getJcfOption (optListIndication)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	SetJcfOption (optListIndication,iOption)
EndIf
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

String Function ToggleIndicateTablesVerbosity (int iRetCurVal)
var
	int iOption
Let iOption = getJcfOption (optTableIndication)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	SetJcfOption (optTableIndication,iOption)
EndIf
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

String function toggleMeetingRequestVerbosity (int iRetCurVal)
If not iRetCurVal then
	;update the value
	let giOutlookMeetingRequestVerbosity =!giOutlookMeetingRequestVerbosity
	EndIf
;now return the value
if giOutlookMeetingRequestVerbosity then
	return cmsg_On
else
	return cmsg_Off
EndIf
EndFunction

String Function ToggleAttachmentsVerbosity (int iRetVal)
If not iRetVal Then
	Let giOutlookAttachmentsVerbosity = !giOutlookAttachmentsVerbosity
EndIf  ; update it
If !giOutlookAttachmentsVerbosity  then
	return cmsg_Off
Else
	return cMsg_On
	EndIf
EndFunction

String 				Function ToggleMessageStatusVerbosity (int iRetVal)
If not iRetVal Then
	Let giOutlookMessageStatusVerbosity = !giOutlookMessageStatusVerbosity
EndIf  ; update it
If giOutlookMessageStatusVerbosity  then
	return MsgSayUnread
Else
	return MsgSilent
EndIf
EndFunction

String Function ToggleMessageFlagVerbosity (int iState)
If !iState Then
	Let giOutlookMessageFlagVerbosity = !giOutlookMessageFlagVerbosity
EndIf  ; update it
If !giOutlookMessageFlagVerbosity  then
	return cMsgOff
Else
	return cMsgOn
	EndIf
EndFunction

String Function ToggleMessageSayAllVerbosity (int iState)
var
	int iOption
If !iState Then
	Let giOutlookMessageSayAllVerbosity = !giOutlookMessageSayAllVerbosity
EndIf
Let iOption=giOutlookMessageSayAllVerbosity
If !iOption Then
	return cmsgOff
Else
	return cmsgOn
	EndIf
EndFunction

String Function ToggleMessageHeaderVerbosity (int iState)
var
	int iOption
If !iState Then
	Let giOutlookMessageHeaderVerbosity = !giOutlookMessageHeaderVerbosity
EndIf
Let iOption=giOutlookMessageHeaderVerbosity
If !iOption Then
	return cmsgOff
Else
	return cmsgOn
	EndIf
EndFunction

String Function ToggleInfoBarVerbosity (int iState)
If !iState Then
	Let giOutlookInfoBarVerbosity = !giOutlookInfoBarVerbosity
EndIf  ; update it
If !giOutlookInfoBarVerbosity  then
	return cmsgOff
Else
	return cmsgOn
EndIf
EndFunction

String function toggleAutoCompleteVerbosity (int iRetCurVal)
If not iRetCurVal then
	;update the value
	let giOutlookAutoCompleteVerbosity =!giOutlookAutoCompleteVerbosity
	EndIf
;now return the value
if giOutlookAutoCompleteVerbosity then
	return cmsg_On
else
	return cmsg_Off
EndIf
EndFunction

String Function ToggleFollowUpFlagVerbosity (int iRetVal)
If not iRetVal Then
	Let giOutlookFollowUpFlagVerbosity = !giOutlookFollowUpFlagVerbosity
EndIf  ; update it
If !giOutlookFollowUpFlagVerbosity  then
	return cmsgOff
Else
	return cMsgOn
EndIf
EndFunction

String Function ToggleForwardedFlagVerbosity (int iRetVal)
If not iRetVal Then
	Let giOutlookForwardedFlagVerbosity = !giOutlookForwardedFlagVerbosity
EndIf  ; update it
If !giOutlookForwardedFlagVerbosity  then
	return cmsgOff
Else
	return cMsgOn
	EndIf
EndFunction

String Function ToggleRepliedFlagVerbosity (int iRetVal)
If not iRetVal Then
	Let giOutlookRepliedFlagVerbosity = !giOutlookRepliedFlagVerbosity
EndIf  ; update it
If !giOutlookRepliedFlagVerbosity  then
	return cmsgOff
Else
	return cMsgOn
	EndIf
EndFunction

string Function ToggleMessageLinkCountIndication(int iState)
If !iState Then
	Let gbMessageLinkCountIndication= !gbMessageLinkCountIndication
EndIf
If !gbMessageLinkCountIndication then
	return cmsgOff
Else
	return cmsgOn
EndIf
EndFunction

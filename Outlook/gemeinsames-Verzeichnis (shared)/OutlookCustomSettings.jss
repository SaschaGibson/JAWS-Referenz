; Outlook Custom Settings Script Set
; Copyright 2010-2015, Freedom Scientific, Inc.
; 06/27/07 DBrown

; These files contain the Outlook, Outlook Express, Windows Mail, and Windows Live Mail verbosity functions.
include "HjConst.jsh"
include "HjGlobal.jsh"
include "Common.jsm"
include "outlook2003.jsm"
include "OutlookCustomSettings.jsh"
include "OutlookCustomSettings.jsm"
include "oluo.jsm"
use "olUserOptions.jsb"

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
If OutlookVersion==OE6  Then
	If !iState Then
		Let giOE6MessageSayAllVerbosity = !giOE6MessageSayAllVerbosity
	EndIf
	let iOption=giOE6MessageSayAllVerbosity
ElIf OutlookVersion==WM7 Then
	If !iState Then
		Let gbWMMessageSayAllVerbosity = !gbWMMessageSayAllVerbosity
	EndIf
	let iOption=gbWMMessageSayAllVerbosity
ElIf OutlookVersion==WLM Then
	If !iState Then
		Let gbWLMMessageSayAllVerbosity = !gbWLMMessageSayAllVerbosity
	EndIf
	let iOption=gbWLMMessageSayAllVerbosity
Else ; Outlook
	If !iState Then
		Let giOutlookMessageSayAllVerbosity = !giOutlookMessageSayAllVerbosity
	EndIf
	Let iOption=giOutlookMessageSayAllVerbosity
EndIf  ; update it
If !iOption Then
	return cmsgOff
Else
	return cmsgOn
	EndIf
EndFunction

String Function ToggleMessageHeaderVerbosity (int iState)
var
	int iOption
If OutlookVersion==OE6  Then
	If !iState Then
		Let giOE6MessageHeaderVerbosity = !giOE6MessageHeaderVerbosity
	EndIf
	let iOption=giOE6MessageHeaderVerbosity
ElIf OutlookVersion==WM7 Then
	If !iState Then
		Let gbWMMessageHeaderVerbosity = !gbWMMessageHeaderVerbosity
	EndIf
	let iOption=gbWMMessageHeaderVerbosity
ElIf OutlookVersion==WLM Then
	If !iState Then
		Let gbWLMMessageHeaderVerbosity = !gbWLMMessageHeaderVerbosity
	EndIf
	let iOption=gbWLMMessageHeaderVerbosity
Else ; Outlook
	If !iState Then
		Let giOutlookMessageHeaderVerbosity = !giOutlookMessageHeaderVerbosity
	EndIf
	Let iOption=giOutlookMessageHeaderVerbosity
EndIf  ; update it

If !iOption Then
	return cmsgOff
Else
	return cmsgOn
	EndIf
EndFunction

String Function ToggleReadingPaneVerbosity (int iState)
var
	int iOption
If OutlookVersion==OE6  Then
	If !iState Then
		Let gbOE6ReadingPaneVerbosity = !gbOE6ReadingPaneVerbosity
	EndIf
	let iOption=gbOE6ReadingPaneVerbosity
ElIf OutlookVersion==WM7 Then
	If !iState Then
		Let gbWMReadingPaneVerbosity = !gbWMReadingPaneVerbosity
	EndIf
	let iOption=gbWMReadingPaneVerbosity
ElIf OutlookVersion==WLM Then
	If !iState Then
		Let gbWLMReadingPaneVerbosity = !gbWLMReadingPaneVerbosity
	EndIf
	let iOption=gbWLMReadingPaneVerbosity
Else ; Outlook
	If !iState Then
		Let gbOutlookReadingPaneVerbosity = !gbOutlookReadingPaneVerbosity
	EndIf
	Let iOption=gbOutlookReadingPaneVerbosity
EndIf  ; update it

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

String Function ToggleMessageElementsVerbosity (int iState)
var
	int iOption
If OutlookVersion==OE6  Then
	If !iState Then
		Let giOE6MessageElementsVerbosity = !giOE6MessageElementsVerbosity
	EndIf
	let iOption=giOE6MessageElementsVerbosity
ElIf OutlookVersion==WM7 Then
	If !iState Then
		Let gbWMMessageElementsVerbosity = !gbWMMessageElementsVerbosity
	EndIf
	let iOption=gbWMMessageElementsVerbosity
ElIf OutlookVersion==WLM Then
	If !iState Then
		Let gbWLMMessageElementsVerbosity = !gbWLMMessageElementsVerbosity
	EndIf
	let iOption=gbWLMMessageElementsVerbosity
Else ; Outlook
	If !iState Then
		Let giOutlookMessageElementsVerbosity = !giOutlookMessageElementsVerbosity
	EndIf
	Let iOption=giOutlookMessageElementsVerbosity
EndIf  ; update it

If !iOption Then
	return cmsgOff
Else
	return cmsgOn
	EndIf
EndFunction

String Function ToggleMessageTitleVerbosity (int iState)
var
	int iOption
If OutlookVersion==OE6  Then
	If !iState Then
		Let gbOE6MessageTitleVerbosity = !gbOE6MessageTitleVerbosity
	EndIf
	let iOption=gbOE6MessageTitleVerbosity
ElIf OutlookVersion==WM7 Then
	If !iState Then
		Let gbWMMessageTitleVerbosity = !gbWMMessageTitleVerbosity
	EndIf
	let iOption=gbWMMessageTitleVerbosity
ElIf OutlookVersion==WLM Then
	If !iState Then
		Let gbWLMMessageTitleVerbosity = !gbWLMMessageTitleVerbosity
	EndIf
	let iOption=gbWLMMessageTitleVerbosity
Else ; Outlook
	If !iState Then
		Let giOutlookMessageTitleVerbosity = !giOutlookMessageTitleVerbosity
	EndIf
	Let iOption=giOutlookMessageTitleVerbosity
EndIf  ; update it

If !iOption Then
	return cmsgOff
Else
	return cmsgOn
	EndIf
EndFunction

Script AdjustJAWSOptions()
Var
	string sNodeMainApp,
	string sOLList,
	int iPrevMeetingRequest,
	int iPrevMessageStatus,
	int iPrevRepliedFlag,
	int iPrevForwardedFlag,
	int iPrevMessageFlag,
	int iPrevMessageSayAll,
	int iPrevAutoComplete,
	int iPrevAttachments,
	int iPrevInfoBar,
	int iPrevMessageTitle,
	int iPrevMessageElements,
	int iPrevMessageHeader,
	string sList
;	save the current values
let iPrevMeetingRequest= giOutlookMeetingRequestVerbosity
let  iPrevMessageStatus= giOutlookMessageStatusVerbosity
let  iPrevForwardedFlag= giOutlookForwardedFlagVerbosity
let  iPrevRepliedFlag= giOutlookRepliedFlagVerbosity
let  iPrevMessageFlag= giOutlookMessageFlagVerbosity
let  iPrevMessageSayAll= giOutlookMessageSayAllVerbosity
let  iPrevAutoComplete= giOutlookAutoCompleteVerbosity
let  iPrevAttachments= giOutlookAttachmentsVerbosity
let  iPrevInfoBar= giOutlookInfoBarVerbosity
let  iPrevMessageTitle= giOutlookMessageTitleVerbosity
let  iPrevMessageElements= giOutlookMessageElementsVerbosity
let  iPrevMessageHeader= giOutlookMessageHeaderVerbosity
;construct the options branch:
let sNodeMainApp = OutlookOptions+NODE_PATH_DELIMITER
let sOLList = GetMSOutlookOptionsBranch(sNodeMainApp)
OptionsTreeCore(sOLList,true)
If iPrevMeetingRequest !=  giOutlookMeetingRequestVerbosity
|| iPrevAutoComplete !=giOutlookAutoCompleteVerbosity
|| iPrevRepliedFlag !=  giOutlookRepliedFlagVerbosity
|| iPrevMessageFlag !=  giOutlookMessageFlagVerbosity
|| iPrevMessageSayAll !=  giOutlookMessageSayAllVerbosity
|| iPrevAttachments !=  giOutlookAttachmentsVerbosity
|| iPrevInfoBar !=  giOutlookInfoBarVerbosity
|| iPrevMessageElements !=  giOutlookMessageElementsVerbosity
|| iPrevMessageHeader !=  giOutlookMessageHeaderVerbosity
|| iPrevMessageTitle !=  giOutlookMessageTitleVerbosity
|| iPrevMessageStatus !=  giOutlookMessageStatusVerbosity Then
	If saveApplicationSettings() then
		SayUsingVoice(VCTX_MESSAGE, msgAppSettingsSaved1_L,OT_STATUS)
	Else
		SayFormattedMessage(ot_error, msgAppSettingsNotSaved1_L)
	EndIf
EndIf
EndScript

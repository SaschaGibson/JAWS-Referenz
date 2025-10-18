;Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 12.00.xx
; Microsoft Outlook and Outlook Express user options.

include "hjglobal.jsh"
Include "hjconst.jsh"
include "common.jsm"
include "outlook2007.jsm"
include "OutlookCustomSettings.jsh"
include "OutlookCustomSettings.jsm"
include "olUO.jsm"
include "msoffice2007.jsh"
include "winword2007.jsh"
include "wdUO.jsm"
use "UserOptionsTextOutput.jsb"

void function loadNonJCFOptions ()
; Load personal preferences
giOutlookAutoCompleteVerbosity = getNonJCFOption (HKey_AutoComplete)
giOutlookMeetingRequestVerbosity = getNonJCFOption (HKey_MeetingRequest)
giOutlookMessageStatusVerbosity = getNonJCFOption (HKey_MessageStatus)
giOutlookForwardedFlagVerbosity = getNonJCFOption (HKey_ForwardedFlag)
giOutlookRepliedFlagVerbosity = getNonJCFOption (HKey_RepliedFlag)
giOutlookMessageFlagVerbosity = getNonJCFOption (HKey_MessageFlag)
giOutlookMessageSayAllVerbosity = getNonJCFOption (HKey_MessageSayAll)
giOutlookAttachmentsVerbosity = getNonJCFOption (HKey_Attachments)
giOutlookInfoBarVerbosity = getNonJCFOption (HKey_InfoBar)
giOutlookMessageHeaderVerbosity = getNonJCFOption (HKey_MessageHeader)
giOutlookMessageElementsVerbosity = getNonJCFOption (HKey_MessageElements)
giOutlookMessageTitleVerbosity = getNonJCFOption (HKey_MessageTitle)
LoadNonJCFOptions ()
EndFunction

string Function NodeHlp (string sNodeName)
;Outlook-specific nodes:
If StringContains (sNodeName,Node_MessageFlags) then
	return FormatString(msgUO_MessageFlagsHlp)
ElIf StringContains (sNodeName,Node_Formatting) then
	return FormatString(msgUO_FormattingHlp)
ElIf StringContains(sNodeName,NODE_Tables) then
	return FormatString(msgUO_TablesHlp)
ElIf StringContains(sNodeName,NODE_reading) then
	return FormatString(MSGUO_OutlookReadingOptionsHlp)
Else
	Return NodeHlp (sNodeName);Default
EndIf
EndFunction

String Function BrailleHlp ()
Return FormatString(msgUO_OutlookBrailleOptionsHlp)
EndFunction

String Function MessageFlagsHlp()
Return FormatString(msgUO_MessageFlagsHlp)
EndFunction

String Function toggleMessageHeaderVerbosityHlp(int iRetCurVal)
var
	string sMsg
if OutlookVersion == wlm
&& !gbOutlookIsActive then
	let sMsg = FormatString(msgUO_ToggleMessageHeaderHlp,msgDefaultSettingIsOff)
ElIf OutlookVersion == wm7
|| !gbOutlookIsActive then
	let sMsg = FormatString(msgUO_ToggleMessageHeaderHlp,msgDefaultSettingIsOn)
else
	let sMsg = FormatString(msgUO_ToggleMessageHeaderHlp,msgDefaultSettingIsOn)
EndIf
return sMsg
EndFunction

String Function ToggleMessageElementsVerbosityHlp(int iRetCurVal)
var
	string sMsg
if OutlookVersion == wlm
|| gbOutlookIsActive then
	let sMsg = FormatString(msgUO_ToggleMessageElementsHlp,msgDefaultSettingIsOff)
else
	let sMsg = FormatString(msgUO_ToggleMessageElementsHlp,cscNull)
EndIf
return sMsg
EndFunction

String Function ToggleMessageLinkCountIndicationHlp(int iRetCurVal)
return formatString(msgUO_ToggleMessageLinkCountIndicationHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleMessageTitleVerbosityHlp(int iRetCurVal)
return formatString(msgUO_ToggleMessageTitleHlp,msgDefaultSettingIsOn)
EndFunction

String function ToggleMessageSayAllVerbosityHlp(int iRetCurVal)
var
	string sMsg
if OutlookVersion == wlm
|| gbOutlookIsActive then
	let sMsg = FormatString(msgUO_ToggleMessageSayAllHlp,msgDefaultSettingIsOff)
ElIf OutlookVersion == wm7  then
	let sMsg = FormatString(msgUO_ToggleMessageSayAllHlp,msgDefaultSettingIsOn)
else
	let sMsg = FormatString(msgUO_ToggleMessageSayAllHlp,cscNull)
EndIf
return sMsg
EndFunction

String Function ToggleMessageReadingPaneVerbosityHlp(int iRetCurVal)
return FormatString(msgUO_ToggleMessageReadingPaneHlp)
EndFunction

String Function ToggleAttachmentsVerbosityHlp(int iRetCurVal)
Return formatString(msgUO_ToggleAttachmentsHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleInfoBarVerbosityHlp(int iRetCurVal)
return formatString(msgUO_ToggleInfoBarHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleAutoCompleteVerbosityHlp(int iRetCurVal)
return formatString(msgUO_ToggleAutoCompleteHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleMessageStatusVerbosityHlp(int iRetCurVal)
return FormatString(msgUO_ToggleMessageStatusHlp)
EndFunction

String Function ToggleMeetingRequestVerbosityHlp(int iRetCurVal)
return formatString(msgUO_ToggleMeetingRequestHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleMessageFlagVerbosityHlp(int iRetCurVal)
return formatString(msgUO_ToggleMessageFlagHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleFollowUpFlagVerbosityHlp(int iRetCurVal)
Return formatString(msgUO_ToggleFollowUpFlagHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleForwardedFlagVerbosityHlp(int iRetCurVal)
return formatString(msgUO_ToggleForwardedFlagHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleRepliedFlagVerbosityHlp(int iRetCurVal)
return formatString(msgUO_ToggleRepliedFlagHlp,msgDefaultSettingIsOff)
EndFunction

string function GetMSOutlookOptionsBranch(string sAppNode)
var
	string sAppOptions,
	string sBranch,
	string sBranchList
;MessageFlags Options:
let sBranch = node_MessageFlags+NODE_PATH_DELIMITER
if OutlookVersion >= office2007 then
	Let sBranchList =
		;UO_ToggleAttachments+_dlg_separator+
		;UO_ToggleMessageStatus+_dlg_separator+
		;UO_ToggleMeetingRequest+_dlg_separator+
		;UO_ToggleMessageFlag+_dlg_separator+
		UO_ToggleFollowUpFlag+_dlg_separator+
		UO_ToggleForwardedFlag+_dlg_separator
		;UO_ToggleRepliedFlag+_dlg_separator
else
	Let sBranchList =
		;UO_ToggleAttachments+_dlg_separator+
		;UO_ToggleMessageStatus+_dlg_separator+
		UO_ToggleMeetingRequest+_dlg_separator+
		;UO_ToggleMessageFlag+_dlg_separator+
		UO_ToggleForwardedFlag+_dlg_separator
		;UO_ToggleRepliedFlag+_dlg_separator
EndIf
ConvertListToNodeList(sBranchList,sBranch)
let sAppOptions=sAppOptions+sBranchList
let sBranchList=Null()
let sBranch=Null()

;only for Outlook 2007 and higher:
if outlookVersion>=office2007 then
	;now set up each branch or group under the main application branch.
	;Formatting Options:
	let sBranch=node_Formatting+NODE_PATH_DELIMITER
	;set the leaves in this branch.
	Let sBranchList=
		UO_ToggleIndicateBulletType+_dlg_separator
	ConvertListToNodeList (sBranchList, sBranch)
	let sAppOptions=sAppOptions+sBranchList
	let sBranchList=Null()
	let sBranch=Null()

	;Tables:
	let sBranch=node_Tables+node_path_delimiter
	;set the leaves in this branch.
	Let sBranchList=
		UO_toggleCellCoordinatesDetection+_dlg_separator+
		UO_ToggleTableDetection+_dlg_separator+
		UO_ToggleTableDescription+_dlg_separator
	ConvertListToNodeList (sBranchList, sBranch)
	let sAppOptions=sAppOptions+sBranchList
	let sBranchList=Null()
	let sBranch=Null()

	; add to existing nodes:
	;Editing Options:
	let sBranch=node_Editing+node_path_delimiter
	;Add to the leaves in this branch.
	let sBranchList=
		UO_ToggleSpellingErrorDetection+_dlg_separator+
		UO_ToggleGrammaticalErrorDetection+_dlg_separator+
		UO_TabMeasurementIndication+_dlg_separator
	ConvertListToNodeList (sBranchList, sBranch)
	let sAppOptions=sAppOptions+sBranchList
	let sBranchList=Null()
	Let sBranch= Null()

	;Reading Options:
	let sBranch =  node_reading+node_path_delimiter
	if gbWordIsWindowOwner then
		if IsDocProtected()<0 then ;read-only message
			let sBranchList =
				UO_ToggleAutoComplete+_dlg_separator+
				UO_ToggleInfoBar+_dlg_separator+
				UO_ToggleMessageHeader+_dlg_separator+
				UO_ToggleMessageLinkCountIndication+_dlg_separator+
				UO_ToggleMessageSayAll+_Dlg_separator+
				UO_ToggleBorderDetection+_dlg_separator+
				UO_ToggleSelCtxWithMarkup+_dlg_separator+
				UO_ToggleAnnounceListNestingLevel+_dlg_separator+
				UO_IndicateNonbreakingSymbolsToggle+_dlg_separator
		else ;editable message
			let sBranchList =
				UO_ToggleAutoComplete+_dlg_separator+
				UO_ToggleInfoBar+_dlg_separator+
				UO_ToggleMessageHeader+_dlg_separator+
				UO_ToggleMessageLinkCountIndication+_dlg_separator+
				UO_ToggleMessageSayAll+_Dlg_separator+
				UO_ToggleBorderDetection+_dlg_separator+
				UO_ToggleSelCtxWithMarkup+_dlg_separator+
				UO_ToggleAnnounceListNestingLevel+_dlg_separator+
				UO_IndicateNonbreakingSymbolsToggle+_dlg_separator
		endIf
	else ;not in a message window
		let sBranchList =
			UO_ToggleAutoComplete+_dlg_separator+
			UO_ToggleInfoBar+_dlg_separator+
			UO_ToggleMessageHeader+_dlg_separator+
			UO_ToggleMessageSayAll+_Dlg_separator
	EndIf
	ConvertListToNodeList(sBranchList,sBranch)
	let sAppOptions=sAppOptions+sBranchList
	let sBranchList=Null()
	Let sBranch= Null()

	;General   Options:
	let sBranch=node_General+node_path_delimiter
	;Add to the leaves in this branch.
	let sBranchList=
		UO_WordDocumentPresentationSet+_Dlg_separator
	ConvertListToNodeList (sBranchList, sBranch)
	let sAppOptions=sAppOptions+sBranchList
	let sBranchList=Null()
	Let sBranch= Null()
else ; not Outlook 2007 or higher
	;Reading Options:
	let sBranch =  node_reading+node_path_delimiter
	let sBranchList =
		UO_ToggleInfoBar+_dlg_separator+
		UO_ToggleMessageHeader+_dlg_separator+
		UO_ToggleMessageElements+_dlg_separator+
		UO_ToggleMessageSayAll+_Dlg_separator
	ConvertListToNodeList(sBranchList,sBranch)
	let sAppOptions=sAppOptions+sBranchList
	let sBranchList=Null()
	Let sBranch= Null()
EndIf
return sAppOptions
EndFunction

string function GetOutlookExpressOptionsBranch(string sAppNode)
var
	string sBranch,
	string sBranchList
let sBranch = sAppNode
Let sBranchList =
	UO_ToggleMessageHeader+_dlg_separator+
	UO_ToggleMessageElements+_dlg_separator+
	UO_ToggleMessageSayAll+_dlg_separator
ConvertListToNodeList(sBranchList,sBranch)
return sBranchList
EndFunction

string function GetWindowsLiveMailOptionsBranch(string sAppNode)
var
	string sBranch,
	string sBranchList
let sBranch = sAppNode
Let sBranchList =
	UO_ToggleMessageHeader+_dlg_separator+
	UO_ToggleMessageElements+_dlg_separator+
	UO_ToggleMessageSayAll+_dlg_separator
ConvertListToNodeList(sBranchList,sBranch)
return sBranchList
EndFunction

string function GetWindowsMailOptionsBranch(string sAppNode)
var
	string sBranch,
	string sBranchList
let sBranch = sAppNode
Let sBranchList =
	UO_ToggleMessageHeader+_dlg_separator+
	UO_ToggleMessageElements+_dlg_separator+
	UO_ToggleMessageSayAll+_dlg_separator
ConvertListToNodeList(sBranchList,sBranch)
return sBranchList
EndFunction

String Function FormattingHlp()
Return FormatString(msgUO_FormattingHlp)
EndFunction

String Function ToggleShowBrlProofreadingMarkHlp(int iRetCurVal)
return FormatString(msgUO_ToggleShowBrlProofreadingMarkHlp)
EndFunction

String function ToggleSpellingErrorDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleSpellingErrorDetectionHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleGrammaticalErrorDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleGrammaticalErrorDetectionHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleStyleDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleStyleDetectionHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleIndicateBulletTypeHlp(int iRetCurVal)
return formatString(msgUO_ToggleIndicateBulletTypeHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleIndicateBrailleBulletTypeHlp(int iRetCurVal)
Return formatString(msgUO_ToggleIndicateBrailleBulletTypeHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleBorderDetectionHlp(int iRetCurVal)
return formatString(msgUO_ToggleBorderDetectionHlp,msgDefaultSettingIsOff)
EndFunction

String Function NavigationQuickKeysSetHlp(int iRetCurVal)
Return FormatString(msgUO_OutlookNavigationQuickKeysSetHlp)
EndFunction

String function ToggleAnnounceListNestingLevelHlp(int iRetCurVal)
return formatString(msgUO_ToggleAnnounceListNestingLevelHlp,msgDefaultSettingIsOff)
EndFunction

String Function IndicateNonbreakingSymbolsToggleHlp(int iRetCurVal)
return formatString(msgUO_OutlookIndicateNonbreakingSymbolsToggleHlp,msgDefaultSettingIsOff)
EndFunction

String function vCursorHeadingsAnnounceHlp (int iRetCurVal)
Return FormatString(msgUO_OutlookVCursorHeadingsAnnounceHlp)
EndFunction

String function TabMeasurementIndicationHlp(int iRetCurVal)
Return formatString(msgUO_TabMeasurementIndicationHlp,msgDefaultSettingIsOn)
EndFunction

String Function LanguageDetectChangeHlp (int iRetCurVal)
Return formatString(msgUO_OutlookLanguageDetectChangeHlp,msgDefaultSettingIsOff)
EndFunction

String Function ToggleSelCtxWithMarkupHlp(int iRetCurVal)
return FormatString(msgUO_OutlookToggleSelCtxWithMarkupHlp,msgDefaultSettingIsOff)
EndFunction

string Function ToggleBrlTableNumberDisplayHlp(int iRetCurVal)
return formatString(msgUO_ToggleBrlTableNumberDisplayHlp,msgDefaultSettingIsOn)
EndFunction

string function GraphicsShowHlp()
Return formatString(msgUO_WDOLGraphicsShowHlp,
	FormatString(msgShowOptionDefaultSetting,
			GraphicsShowTextOutput(GetIntOptionDefaultSetting(SECTION_OSM,hKey_IncludeGraphics))))
EndFunction

Script AdjustJAWSOptions ()
var
	int bPriorUserBufferState,
	int bPriorTrapKeys,
	string sNodeName,
	string sList,
	string sOLList,
	int iPrevMeetingRequest,
	int iPrevMessageStatus,
	int iPrevRepliedFlag,
	int iPrevFollowUpFlag,
	int iPrevForwardedFlag,
	int iPrevMessageFlag,
	int iPrevMessageSayAll,
	int iPrevAutoComplete,
	int iPrevAttachments,
	int iPrevInfoBar,
	int iPrevMessageHeader,
	int priorDetectLanguages,
	int priorIndicateBulletType,
	int priorIndicateBrailleBulletType,
	int priorBrlProofreadingMark,
	int priorBrlTableNumberDisplay,
	int PriorDetectSpelling,
	int PriorDetectGrammar,
	int priorSayAllReadBy,
	int PriorMessageLinkCountIndication,
	int PriorIndicateNonbreakingSymbols,
	int PriorHeadingIndication,
	int PriorTabMeasurementIndication,
	int PriorTableDescription,
	int PriorDocumentPresentationSet,
	int priorAnnounceCellCoordinates,
	int PriorSelCtxWithMarkup,
	int bPriorQuickNavState,
	int iSelCtxFlags ; bit flags set before any changes
let giSetQuickNavModeFromScript=false
; to prevent calling of non existing function from outlook express options dialogue
If ! InHJDialog () then
	let bPriorQuickNavState=QuickNavKeyTrapping()
EndIf
let bPriorUserBufferState=UserBufferIsActive()
let bPriorTrapKeys=UserBufferIsTrappingKeys()
let iPrevMeetingRequest= giOutlookMeetingRequestVerbosity
let iPrevMessageStatus= giOutlookMessageStatusVerbosity
let iPrevFollowUpFlag=giOutlookFollowUpFlagVerbosity
let iPrevForwardedFlag= giOutlookForwardedFlagVerbosity
let iPrevRepliedFlag= giOutlookRepliedFlagVerbosity
let iPrevMessageFlag= giOutlookMessageFlagVerbosity
let iPrevMessageSayAll= giOutlookMessageSayAllVerbosity
let iPrevAutoComplete= giOutlookAutoCompleteVerbosity
;let iPrevAttachments= giOutlookAttachmentsVerbosity
let iPrevInfoBar= giOutlookInfoBarVerbosity
let iPrevMessageHeader= giOutlookMessageHeaderVerbosity
let iSelCtxFlags=giSelCtxFlags
let priorDetectLanguages=globalDetectLanguages
let priorIndicateBulletType=giIndicateBulletType
let priorIndicateBrailleBulletType=giIndicateBrailleBulletType
let PriorBrlProofreadingMark=giBrlProofreadingMark
let priorBrlTableNumberDisplay=gbBrlTableNumberDisplay
let priorDetectSpelling=giDetectSpelling
let priorDetectGrammar=giDetectGrammar
let PriorSayAllReadBy=giSayAllReadBy
let PriorMessageLinkCountIndication=gbMessageLinkCountIndication
let PriorIndicateNonbreakingSymbols=giIndicateNonbreakingSymbols
let PriorHeadingIndication=giMSOfficeHeadingIndication
let PriorTabMeasurementIndication=gbTabMeasurementIndication
let PriorTableDescription=giTableDescription
let PriorDocumentPresentationSet=gbDocumentPresentationSet
let priorAnnounceCellCoordinates=gbAnnounceCellCoordinates
let PriorSelCtxWithMarkup=gbSelCtxWithMarkup ;for Express Navigation Mode
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
; Since Outlook can be in virtual state while screen-sensitive help is active, we need the below test.
;Instead, see if we were in aVirtual document, so your settings come up, even from within a standard user buffer, e.g. user pushed insert h.
if UserBufferOverVirtualDocument ()
&& bPriorTrapKeys then
	performScript AdjustJAWSOptions() ;default
else
	;set up the main application branch:
	if gbOutlookIsActive then
		let sNodeName=OutlookOptions
		let sOLList = GetMSOutlookOptionsBranch(sNodeName)
	elif gbOe6IsActive then
		let sNodeName=OutlookExpressOptions
		;let sOLList = GetOutlookExpressOptionsBranch(sNodeName)
	elif gbWindowsMailIsActive then
		let sNodeName=WindowsMailOptions
		;let sOLList = GetWindowsMailOptionsBranch(sNodeName)
	ElIf gbWindowsLiveMailIsActive then
		let sNodeName=windowsLiveMailOptions
		;let sOLList = GetWindowsLiveMailOptionsBranch(sNodeName)
	EndIf
	;Process the master list along with the default list.
	; the second parm set to true ensures application-specific branch is properly included.
	OptionsTreeCore(sOLList,true,cscNull)
EndIf
;must test	 here for whether to save application or document settings
;since Outlook can be in virtual state.
;if it is, we don't want to save application or document settings.
if !bPriorUserBufferState then
	; determine which settings changed
	pause()
	SetSelectionContextFlags(giSelCtxFlags,giOutlookSelCtxBeforeCaretMoveBitFlagOrderMask)
	let giSelCtxFlags=GetSelectionContextFlags()
	If iPrevMeetingRequest !=  giOutlookMeetingRequestVerbosity
	|| iPrevAutoComplete !=giOutlookAutoCompleteVerbosity
	|| iPrevFollowUpFlag!=giOutlookFollowUpFlagVerbosity
	|| iPrevForwardedFlag!=giOutlookForwardedFlagVerbosity
	|| iPrevRepliedFlag !=  giOutlookRepliedFlagVerbosity
	|| iPrevMessageFlag !=  giOutlookMessageFlagVerbosity
	|| iPrevMessageSayAll !=  giOutlookMessageSayAllVerbosity
	|| iPrevAttachments !=  giOutlookAttachmentsVerbosity
	|| iPrevInfoBar !=  giOutlookInfoBarVerbosity
	|| iPrevMessageHeader !=  giOutlookMessageHeaderVerbosity
	|| iPrevMessageStatus !=  giOutlookMessageStatusVerbosity
	|| iSelCtxFlags!=giSelCtxFlags
	|| priorDetectLanguages!=globalDetectLanguages
	|| priorIndicateBulletType!=giIndicateBulletType
	|| priorIndicateBrailleBulletType!=giIndicateBrailleBulletType
	|| PriorBrlProofreadingMark!=giBrlProofreadingMark
	|| priorBrlTableNumberDisplay!=gbBrlTableNumberDisplay
	|| priorDetectSpelling!=giDetectSpelling
	|| PriorDetectGrammar!=giDetectGrammar
	|| priorSayAllReadBy!=giSayAllReadBy
	|| priorMessageLinkCountIndication!=gbMessageLinkCountIndication
	|| priorIndicateNonbreakingSymbols!=giIndicateNonbreakingSymbols
	|| PriorHeadingIndication!=giMSOfficeHeadingIndication
	|| priorTabMeasurementIndication!=gbTabMeasurementIndication
	|| PriorTableDescription!=giTableDescription
	|| PriorDocumentPresentationSet!=gbDocumentPresentationSet
	|| priorAnnounceCellCoordinates!=gbAnnounceCellCoordinates
	|| PriorSelCtxWithMarkup!=gbSelCtxWithMarkup then
		If saveApplicationSettings() then
			SayUsingVoice(VCTX_MESSAGE, msgAppSettingsSaved1_L,OT_STATUS)
		Else
			SayFormattedMessage(ot_error, msgAppSettingsNotSaved1_L)
		EndIf
	EndIf
EndIf
pause()
; if Outlook was in a virtual state before the dialog was launched, return to that state.
if bPriorUserBufferState then
	UserBufferActivate(bPriorTrapKeys)
endIf
;check quick key navigation state change:
if bPriorQuickNavState then
	;check for whether it has changed.
	if 	GetJcfOption(opt_quick_key_navigation_mode)==0 then  ;turn it off.
		SetJcfOption(opt_quick_key_navigation_mode,0)
		SetQuickKeyNavigationState(0)
	EndIf
EndIf
EndScript

int function IsSayAllOnDocumentLoadSupported()
;Microsoft Outlook and Outlook Express both have an option for automatic message reading,
;which is for all messages--both HTML and non-HTML.
;SayAll on document load is not included since it would conflict with the automatic message reading option.
return false
EndFunction

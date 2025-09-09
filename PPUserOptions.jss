;Copyright 1995-2018 Freedom Scientific, Inc.
; Microsoft Powerpoint user options.

include "hjglobal.jsh"
Include "hjconst.jsh" ; constants for attributes, window class
include "common.jsm"
;include "powerpnt.jsh"
include "powerpnt.jsm"
include "powerpntcommon.jsh"
include "ppUO.jsm"

string Function NodeHlp (string sNodeName)
If StringContains (sNodeName,Node_Objects) then
	return FormatString(msgUO_ObjectsHlp)
elIf StringContains (sNodeName,node_Slides) then
	return FormatString(msgUO_SlidesHlp)
Else
	Return NodeHlp (sNodeName);Default
EndIf
EndFunction

String Function ObjectsHlp()
Return FormatString(msgUO_ObjectsHlp)
EndFunction

String Function SlidesHlp()
Return FormatString(msgUO_SlidesHlp)
EndFunction

String Function ToggleTableReadingMethodHlp(int iRetCurVal)
Return FormatString(msgUOTableReadingHlp)
EndFunction

String Function ToggleOverlapAlertHlp(int iRetCurVal)
return formatString(msgUOAlertOverlapHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleOverflowAlertHlp(int iRetCurVal)
return formatString(msgUOOverflowAlertHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleDescribeObjectsHlp(int iRetCurVal)
return formatString(msgUODescribeObjectsHlp,msgDefaultSettingIsOn)
EndFunction

String Function ToggleSlideTransitionsHlp()
return formatString(msgUOSlideTransitionsHlp,msgDefaultSettingIsOff	)
EndFunction

int function UserBufferOverVirtualDocument ()
if (isSlideShow()
;&& anything else we're missing / should account for
&& isVirtualPcCursor ()) then
	return OFF
endIf
Return UserBufferOverVirtualDocument ()
endFunction

String Function TreeCoreGetDefaultOptions ()
;Overwritten here as not all options from default apply in Powerpoint.
var
	string sMiniList,;For node sections, add to strList:
	string sNodeName,
	string cStrDefaultList;
;let cStrDefaultList =
;General Options:
Let cstrDefaultList = cstrDefaultList + TreeCoreGetDefaultGeneralOptions();
Let sMiniList = Null()
Let sNodeName = Null()
;Reading Options:
Let sNodeName = NODE_READING
Let sMinilist =
	UO_SmartWordReadingSet+_dlg_separator
	ConvertListToNodeList (sMiniList, sNodeName)
Let cstrDefaultList = cstrDefaultList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
;Reading Options.SayAll Options:
Let sNodeName = sNodeName+NODE_PATH_DELIMITER+NODE_SAYALL;
Let sMiniList =
	UO_SayAllReadsBy+_dlg_separator+
	UO_CapsIndicateDuringSayAll+_dlg_separator
ConvertListToNodeList (sMiniList, sNodeName)
Let cstrDefaultList = cstrDefaultList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
;Editing Options:
Let sNodeName = NODE_EDITING;
Let sMiniList =
	UO_TypingEchoSet+_dlg_separator+
	UO_CapsIndicate+_dlg_separator+
	UO_PunctuationSetLevel+_dlg_separator+
	UO_IndentationIndicate+_dlg_separator
ConvertListToNodeList (sMiniList, sNodeName)
Let cstrDefaultList = cstrDefaultList+sMiniList;
Let sMiniList = Null()
Let sNodeName = Null()
;Editing Options.Spelling Options:
Let sNodeName = sNodeName+NODE_PATH_DELIMITER+NODE_SPELLING
Let sMiniList =
	UO_SpellModeSet+_dlg_separator+
	UO_AlphaNumCombinations+_dlg_separator
ConvertListToNodeList (sMiniList, sNodeName)
Let cstrDefaultList = cstrDefaultList+sMiniList;
Let sMiniList = Null()
;Numbers Options:
Let sNodeName = NODE_Numbers
Let sMiniList =
	UO_SpeakSingleDigitsThreshold+_dlg_separator+
	UO_SpeakSingleDigitsDashes +_dlg_separator
ConvertListToNodeList (sMiniList, sNodeName)
Let cstrDefaultList = cstrDefaultList+sMiniList;
Let sMiniList = Null()
;Default, add Mute as 0-level object:
;Let cstrDefaultList = cStrDefaultList+UO_SynthesizerMute
return cStrDefaultList
EndFunction

Script AdjustJAWSOptions ()
var
	int bPriorUserBufferState,
	int bPriorTrapKeys,
	int priorTableReadingMethod,
	int priorDetectOverlappingShapes,
	int priorDetectTextOverflow,
	int PriorSlideTransitions,
	int PriorDescribeObjects,
	string sNodeName,; the branch or group for application-speicific options.
	string sList,; the list of options in a particular branch or group.
	string sPPList ;the master list that comprises all the items in the main application branch,
	;all its children branches, and leaves.

let bPriorUserBufferState=UserBufferIsActive()
let bPriorTrapKeys=UserBufferIsTrappingKeys()
; store settings to see what changes
let priorTableReadingMethod=globalTableReadingMethod
let priorDetectOverlappingShapes=globalDetectOverlappingShapes
let priorDetectTextOverflow=globalDetectTextOverflow
let priorSlideTransitions=giSlideTransitions
let priorDescribeObjects=giDescribeObjects

if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
; Since Powerpoint can have virtual state while slideshow is active, we need the below test.
;Allow standard virtual viewers to use custom options, e.g ScreenSensitiveHelp.
If UserBufferOverVirtualDocument ()
|| (isSlideShow() && isVirtualPcCursor ()) Then
	performScript AdjustJAWSOptions() ;default
else
	;set up each branch or group of application-specific options.

	;set up branch:
	;Objects:
	let sNodeName=node_Objects+NODE_PATH_DELIMITER
	;set the leaves in this branch.
	Let sList=
		uo_OverlapAlert+_DLG_SEPARATOR+
		uo_OverflowAlert+_DLG_SEPARATOR+
		uo_DescribeObjects+_dlg_separator
	ConvertListToNodeList (sList, sNodeName)
	let sPPList=sPPList+sList
	let sList=Null()
	let sNodeName=Null()

	;set up branch:
	;Slides:
	let sNodeName=node_Slides	+NODE_PATH_DELIMITER
	;set the leaves in this branch.
	Let sList=
		uo_TableReadingMethod+_DLG_SEPARATOR+
		uo_SlideTransitions
	ConvertListToNodeList (sList, sNodeName)
	let sPPList=sPPList+sList
	let sList=Null()
	let sNodeName=Null()

	;Process the master list along with the default list.
	; the second parm set to true ensures application-specific branch is properly included.
	OptionsTreeCore (sPPList,true)
EndIf
;must test here for whether to save application settings since PowerPoint can be in virtual state.
;if it is, we don't want to save application settings.
if !bPriorUserBufferState then
	if priorTableReadingMethod!=globalTableReadingMethod
	|| priorDetectOverlappingShapes!=globalDetectOverlappingShapes
	|| priorDetectTextOverflow!=globalDetectTextOverflow
	|| priorSlideTransitions!=giSlideTransitions
	|| priorDescribeObjects!=giDescribeObjects then
		if saveApplicationSettings() then
			SayMessage(ot_status,msgAppSettingsSaved1_L, cMsgSilent)
		else
			SayMessage (ot_error, msgAppSettingsNotSaved1_L)
		endIf
	EndIf
EndIf
pause()
; if Powerpoint was in a virtual state before the dialog was launched, return to that state.
if bPriorUserBufferState then
	UserBufferActivate(bPriorTrapKeys)
endIf
EndScript
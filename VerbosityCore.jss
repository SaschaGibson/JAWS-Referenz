;Legacy support for VerbosityCore.
;****Note: Recommended use is:
;VerbosityTreeCore usage,
;Now found in UserOptions.jss
;This file is linked only for legacy usage.
;If you do not specify a tree node for your option,
;We will create one based upon your configuration's name:

Include "HjConst.jsh"
Include "HjGlobal.jsh"
Include "common.jsm"
GLOBALS
	int iSavedProgressBarAnnouncementInterval


String Function cStrDefaultList()
var
	string cStrDefaultList
let cStrDefaultList =
	jvVerbosityLevelToggle+
	jvSmartWordReadingToggle+
	jvSpellModeToggle+
	jvSpellAlphaNumericDataToggle+
	jvProgressBarAnnouncementToggle+
	jvTypingEcho+
	jvScreenEchoToggle+
	jvGraphicsVerbosity+
	jvCustomLabelsToggle+
	jvToggleTopAndBottomEdgeAlert+
	jvToggleLanguageDetection+
	jvSayAllBy+
	jvSayAllIndicateCaps+
	jvToggleIndicateCaps+
	jvPunctuationToggle+
	jvToggleIndicateIndentation+
	jvMuteSynthesizerToggle
return cStrDefaultList
EndFunction

String Function cStrDefaultHtmlList()
Var
	String cStrDefaultHtmlList
if HasVirtualEnhancedClipboard() then
	let cStrDefaultHtmlList =
		jvNavigationQuickKeysMode
		+jvEnhancedClipboard
else
	let cStrDefaultHtmlList =
		jvNavigationQuickKeysMode
EndIf
let cStrDefaultHtmlList = cStrDefaultHtmlList
	+UO_vCursorReadOnlyState
	+jvDocumentPresentationModeToggle
	+jvHTMLIncludeGraphicsToggle
	+jvHTMLGraphicReadingVerbosityToggle
	+jvHTMLIncludeLinksToggle
	+jvHtmlGraphicsLinkLastResortToggle
	+jvHTMLIncludeImageMapLinksToggle
	+jvHTMLTextLinkVerbosityToggle
	+jvHTMLIdentifyLinkTypeToggle
	+jvHTMLIdentifySamePageLinksToggle
	+jvHTMLButtonTextVerbosityToggle
	+jvHTMLExpandAbbreviationsToggle
	+jvHTMLExpandAcronymsToggle
	+jvHTMLFormFieldPromptsRenderingToggle
	+jvHTMLFrameIndicationToggle
	+jvHTMLToggleIgnoreInlineFrames
	+jvHTMLScreenFollowsVCursorToggle
	+jvHTMLSkipPastRepeatedTextToggle
	+jvHTMLIndicateBlockQuotes
	+jvHTMLIndicateLists
	+jvHTMLIndicateElementAccessKeys
	+jvhtmlElementAttributeAnnounce
	+jvIndicateTablesToggle
	+jvDetectTables
	+jvSetTableTitleReading
	+jvHTMLIndicateHeadingsToggle
	+jvhtmlFlashOnWebPagesToggle
;	+jvRefreshActiveContent
	+jvRefreshHTML
;	+jvToggleUseVirtualInfoInFormsMode
	+jvHTMLToggleFormsModeAutoOff
	+jvVirtualCustomPageSummary
;	+jvHTMLStyleSheetProcessing
return cStrDefaultHtmlList
EndFunction

String Function cStrBrailleList()
Var
	String cStrBrailleList
let cStrBrailleList=jvActiveModeOption+
 jvGradeTwoModeOption+
 jvToggleG2CapSuppression+
 jvExpandCurrentWordOption+
 jvBrailleMovesActiveOption+
 jvActiveMovesBrailleOption+
 jvToggleFlashMessages+
 jvSpeechInterruptOption+
 jvMarkingOption+
 jvSixOrEightDotOption+
 jvPanModeOption+
 jvBrlWordWrapOption+
 jvAutoPanModeOption
return cStrBrailleList
EndFunction

String Function cStrTableBrailleList()
Var
	string cStrTableBrailleList
let cStrTableBrailleList=jvBrailleZoom+
	jvBrailleShowHeaders+
	jvBrailleShowCoords
Return cStrTableBrailleList
EndFunction

String Function cstrBrailleMarkingList()
Var
	String sBrailleMarkingList
let sBrailleMarkingList =
	jvMarkHighlight+
	jvMarkBold+
	jvMarkUnderline+
	jvMarkItalic+
	jvMarkStrikeOut+
	jvMarkColor+
	jvMarkScript
return StringChopLeft(sBrailleMarkingList,1)
EndFunction

;Main:
void Function JAWSVerbosityCore (string sCustomItems)
var
	String list,
	int i
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
if IsSpeechOff () then
	SayFormattedMessage (OT_STATUS, MuteSynthesizerToggle(FALSE))
	return
endIf
Let list = sCustomItems  ; app-specific stuff from the caller
If IsVirtualPCCursor ()
|| IsFormsModeActive() Then;Forms Mode means we need to keep track of virtual stuff as well.
	UpdateVirtualGlobals ()
	let list = list + cStrDefaultHtmlList()
endIf
Let list = list + cStrDefaultList()
; remove any leading delimiters
Let i=0 ; just make sure this seemingly unnecesary loop terminates
while ((SubString (list, 1, 1) == "|") && i < 5)  ; leading delimiter is present
	Let list = StringChopLeft (list, 1); Get rid of leading delimiter
	Let i = i+1
EndWhile
DlgSelectFunctionToRun (list, AdjustJAWSVerbosityDialogName, false)
EndFunction


;Callbacks:

string function VerbosityLevelToggle(int iRetCurVal)
Var
	int Verbosity
if ! iRetCurVal then
	; update it
	VerbosityLevel ()
endIf
let Verbosity = GetVerbosity ()
if Verbosity == 0 then
	return cmsg12_L
elif Verbosity == 1 then
	return cmsg13_L
elif Verbosity == 2 then
	return cmsg14_L
endIf
EndFunction

string function SmartWordReadingToggle(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption(OPT_SMART_WORD_READING)
If !iRetCurVal then
	Let iSetting = !iSetting
	SetJcfOption(OPT_SMART_WORD_READING,iSetting)
EndIf
If !iSetting then
	return cmsg_Off
else
	return cmsg_On
EndIf
EndFunction

string function BrailleVerbosity (int iRetCurVal)
var
int iMode
let iMode=GetJcfOption (OPT_BRL_verbosity)
if ! iRetCurVal then
	if iMode==2 then
	let iMode=0
	else
	let iMode=iMode+1
	endIf
	SetJcfOption (OPT_BRL_verbosity, iMode)
endIf
;now return the value
if  iMode==0 then
	return cmsg225_S ; "Braille Verbosity Beginner"
elif iMode==1 then
	return cmsg223_S ; "Braille Verbosity Intermediate"
elif iMode==2 then
	return cmsg224_S ; "Braille Verbosity Advanced"
endIf
EndFunction

string function ScreenEchoToggle (int iRetCurVal)
if not iRetCurVal then
; update it
	ScreenEcho()
endIf
if GetScreenEcho() == 0 then
	return cmsgScreenEchoNone
elif GetScreenEcho() == 1 then
	return cmsg16_L ;"highlighted"
elif GetScreenEcho() == 2 then
	return cmsg17_L ;"all"
endIf
EndFunction

string Function SpellModeToggle (int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (OPT_SPELL_PHONETIC)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
EndIf
SetJcfOption (OPT_SPELL_PHONETIC, iOption)
If ! iOption then
	Return cMsgSpellStandard
Else
	Return cMsgSpellPhonetic
EndIf
EndFunction

string function SpellAlphaNumericDataToggle(int iRetCurVal)
Var
	Int iSetting
let iSetting = GetJCFOption(OPT_SPELL_ALPHANUMERIC_DATA)
if !iRetCurVal then
	If iSetting == 2 Then
		let iSetting = 0
	Else
		let iSetting = iSetting+1
	endIf
	SetJcfOption(OPT_SPELL_ALPHANUMERIC_DATA,iSetting)
endIf
If iSetting == 0 then
	return cmsg_off
ElIf iSetting == 1 then
	return cmsgSpellAlphaNumericDataSpell
Elif iSetting == 2 then
	return cmsgSpellAlphaNumericDataSpellPhonetically
EndIf
EndFunction

string function TypingEcho (int iRetCurVal)
Var
	Int iEcho
let iEcho =GetJCFOption (opt_typing_Echo)
if not iRetCurVal then
; update it
	If (iEcho == 3) Then
		let iEcho=0
	Else
		let iEcho=iEcho+1
	endIf
	SetJcfOption (Opt_Typing_Echo, iEcho)
endIf
; now return the value
If (iEcho == 0) Then
	return cmsg81_L ;"None"
ElIf (iEcho == 1) Then
	return cmsg82_L ;"Keys"
ElIf (iEcho == 2) Then
	return cmsg83_L ;"Words"
ElIf (iEcho == 3) then
	return cmsg361_L ; "Both characters and words"
endIf
EndFunction

string function GraphicsVerbosity (int iRetCurVal)
var
int iMode
let iMode= GetJCFOption (OPT_INCLUDE_GRAPHICS)
if not iRetCurVal then
; update it
	If iMode== 2 Then
		let iMode=0
	else
		let iMode=iMode+1
	endIf
	SetJcfOption (OPT_INCLUDE_GRAPHICS, iMode)
endIf
;now return the value
If iMode== 0 Then
	return cmsg226_L ; none
ElIf iMode== 1 Then
	return cMSG227_L ; "Labeled"
ElIf iMode==2 Then
	return cmsg228_L ;"All graphics"
endIf
EndFunction

string  function CustomLabelsToggle(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption(OPT_USE_CUSTOM_LABELS)
If !iRetCurVal then
	Let iSetting = !iSetting
	SetJcfOption(OPT_USE_CUSTOM_LABELS,iSetting)
EndIf
If !iSetting then
	return cmsg_Off
else
	return cmsg_On
EndIf
EndFunction

string Function SetTableTitleReading (int iRetCurVal)
If ! GetJCFOption (optTableIndication) then
	Return cMsgNotAvailable
EndIf
If ! iRetCurVal then
	If GITblHeaders == TBL_HEADER_MARKED then
		Let GITblHeaders=OFF;
	Else
		Let GITblHeaders=GITblHeaders+1
	EndIf
EndIf
If GITblHeaders == OFF then
	Return cmsg_off
ElIf GITblHeaders == TBL_HEADER_ROW then
	Return cmsgRowTitles
ElIf GITblHeaders == TBL_HEADER_COL then
	Return cMsgColumnTitles
ElIf GITblHeaders == TBL_HEADER_BOTH then
	Return cMsgBothTitles
Else ; Marked headers
	Return cMsgMarkedTitles
EndIf
EndFunction

string function ProgressBarAnnouncementToggle(int iRetCurVal)
var
	int iProgressBarAnnounce
let iProgressBarAnnounce =getJCFOption(OPT_PROGRESSBAR_UPDATE_INTERVAL)
if not iRetCurVal then
	if iProgressBarAnnounce then
		let iSavedProgressBarAnnouncementInterval = iProgressBarAnnounce
		let iProgressBarAnnounce = 0
	else
		let iProgressBarAnnounce = iSavedProgressBarAnnouncementInterval
	EndIf
	SetJcfOption(OPT_PROGRESSBAR_UPDATE_INTERVAL, iProgressBarAnnounce)
EndIf
if iProgressBarAnnounce then
	return cmsg_on ;VerbosityListProgressBarAnnouncementOn_L
else
	return cmsg_off ;VerbosityListProgressBarAnnouncementOff_L
endIf
EndFunction

string function PunctuationToggle (int iRetCurVal)
var
	int nPunctuationLevel
let nPunctuationLevel = GetJCFOption (opt_punctuation)
if not iRetCurVal then
; update it
	If (nPunctuationLevel == 3) then
		let nPunctuationLevel=0
	Else
		let nPunctuationLevel=nPunctuationLevel+1
	endIf
	SetJCFOption (opt_punctuation, nPunctuationLevel )
endIf
; now return the value
If (nPunctuationLevel == 0) then
	return cmsgPunctuationNone
elIf (nPunctuationLevel == 1) then
	return cmsg278_L
ElIf (nPunctuationLevel == 2) then
	return cmsg279_L
Elif (nPunctuationLevel == 3) then
	return cmsg280_L
endIf
EndFunction

string function SayAllBy (int iRetCurVal)
var
	int iSayAllMode,
	int iLinePause
let iSayAllMode=getJCFOption(OPT_SAY_ALL_MODE)
let iLinePause=getJCFOption(OPT_LINE_PAUSES)
if not iRetCurVal then
	; update it
	if iLinePause==1 then
		let iLinePause=0
	ElIf iSayAllMode==2 then
		let iSayAllMode=0
		let iLinePause=1
	else
		let iSayAllMode=iSayAllMode+1
	EndIf
	SetJcfOption(OPT_SAY_ALL_MODE, iSayAllMode)
	SetJcfOption(OPT_LINE_PAUSES, iLinePause)
EndIf
;now return the value
if iSayAllMode==0 then
	if iLinePause==1 then
		return cMSG248_S
	else
		return cmsg364_S
	EndIf
elif iSayAllMode==1 then
	return cMSG249_S
ElIf iSayAllMode==2 then
	return cMSG250_S
endIf
EndFunction

string function SayAllIndicateCaps (int iRetCurVal)
var
	int iSayAllIndicateCaps
let iSayAllIndicateCaps=getJCFOption(OPT_SAY_ALL_INDICATE_CAPS)
if not iRetCurVal then
	; update it
	If iSayAllIndicateCaps==1 then
		let iSayAllIndicateCaps=0
	else
		let iSayAllIndicateCaps=1
	EndIf
	SetJcfOption(OPT_SAY_ALL_INDICATE_CAPS, iSayAllIndicateCaps)
EndIf
;now return the value
if iSayAllIndicateCaps==0 then
	return cmsg_off
elif iSayAllIndicateCaps==1 then
	return cmsg_on
endIf
EndFunction

string function HTMLIncludeLinksToggle (int iRetCurVal)
var
	int iLinksLevel
let iLinksLevel = GetJCFOption (optIncludeGraphicLinks)
if not iRetCurVal then
;update it
	If (iLinksLevel == 2) then
	let iLinksLevel=0
	Else
	let iLinksLevel=iLinksLevel+1
	endIf
	SetJCFOption (optIncludeGraphicLinks, iLinksLevel)
endIf
;now return the value
if (iLinksLevel == 0) then
	return cmsg295_S
elIf (iLinksLevel == 1) then
	return cmsg296_S
ElIf (iLinksLevel == 2) then
	return cmsg297_S
endIf
EndFunction

string Function HtmlGraphicsLinkLastResortToggle (int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optGraphicalLinkLastResort)
if not iRetCurVal then
	;update it
	Let iOption = (! iOption)
	SetJcfOption (optGraphicalLinkLastResort, iOption)
EndIf
If iOption then
	Return cMsgGraphicLastResortLink
Else
	Return cMsgGraphicLastResortGraphic
EndIf
EndFunction

string function HTMLIncludeGraphicsToggle (int iRetCurVal)
var
	int iGraphicsLevel
let iGraphicsLevel = GetJCFOption (optIncludeGraphics)
if not iRetCurVal then
;update it
	If iGraphicsLevel == 2 then
		let iGraphicsLevel=0
		Else
		let iGraphicsLevel=iGraphicsLevel+1
		endIf
	SetJCFOption (optIncludeGraphics, iGraphicsLevel)
endIf
;now return the value
if (iGraphicsLevel == 0) then
	return cmsg334_S
elIf (iGraphicsLevel == 1) then
	return cmsg335_S
ElIf (iGraphicsLevel == 2) then
	return cmsg336_S
endIf
EndFunction

string function HTMLIncludeImageMapLinksToggle (int iRetCurVal)
var
	int iImageMapLevel
let iImageMapLevel = GetJCFOption (optIncludeImageMapLinks)
if not iRetCurVal then
;update it
	If (iImageMapLevel == 2) then
		let iImageMapLevel =0
	Else
		let iImageMapLevel =iImageMapLevel +1
	endIf
	SetJCFOption (optIncludeImageMapLinks, iImageMapLevel)
endIf
;now return the value
if (iImageMapLevel == 0) then
	return cmsg298_S
elIf (iImageMapLevel == 1) then
	return cmsg299_S
ElIf (iImageMapLevel == 2) then
	return cmsg300_S
endIf
EndFunction

string function HTMLIdentifyLinkTypeToggle (int iRetCurVal)
var
	int iAnnounceLinkType
let iAnnounceLinkType = GetJCFOption (optIdentifyLinkType)
if not iRetCurVal then
;update it
	let iAnnounceLinkType =not iAnnounceLinkType
	SetJCFOption (optIdentifyLinkType, iAnnounceLinkType)
endIf
;now return the value
If iAnnounceLinkType  then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string function HTMLIdentifySamePageLinksToggle (int iRetCurVal)
var
	int iSamePage
let iSamePage = GetJCFOption (optIdentifySamePageLinks)
if not iRetCurVal then
;update it
	let iSamePage=not iSamePage
	SetJCFOption (optIdentifySamePageLinks, iSamePage)
endIf
;now return the value
If iSamePage  then
	return cmsg_on
Else
	return cmsg_off
endIf
EndFunction

string Function HTMLIncrementMaxLineLength (int iRetCurVal)
Var
int iLineLength
let iLineLength = GetJCFOption (optMaxLineLength)
if not iRetCurVal then
;update it
	If iLineLength < 245 Then
		let iLineLength=iLineLength + 10
	Else
		let iLineLength = 10
	endIf
	SetJCFOption (optMaxLineLength, iLineLength)
endIf
;now return the value
return FormatString (cmsg305_S, intToString(iLineLength))
EndFunction

string function HTMLDecrementMaxLineLength (int iRetCurVal)
Var
int iLineLength
let iLineLength = GetJCFOption (optMaxLineLength)
if not iRetCurVal then
;update it
	If iLineLength > 11 Then
		let iLineLength = iLineLength - 10
	Else
		let iLineLength = 254
	endIf
	SetJCFOption (optMaxLineLength, iLineLength)
endIf
;now return the value
return FormatString (cmsg305_S, intToString(iLineLength))
EndFunction

string function HTMLIncrementMaxBlockLength (int iRetCurVal)
Var
int iBlockLength
let iBlockLength = GetJCFOption (optTextBlockLength)
if not iRetCurVal then
;update it
	If iBlockLength < 145 Then
		let iBlockLength = iBlockLength + 10
	Else
		let iBlockLength = 10
	endIf
	SetJCFOption (optTextBlockLength, iBlockLength)
endIf
;now return the value
return FormatString (cmsg306_S, intToString(iBlockLength))
EndFunction

string Function HTMLDecrementMaxBlockLength (int iRetCurVal)
Var
	int iBlockLength
let iBlockLength = GetJCFOption (optTextBlockLength)
if not iRetCurVal then
;update it
	If iBlockLength > 11 Then
		let iBlockLength = iBlockLength - 10
	Else
		let iBlockLength = 154
	endIf
	SetJCFOption (optTextBlockLength, iBlockLength)
endIf
;now return the value
return FormatString (cmsg306_S, intToString(iBlockLength))
EndFunction

string function HTMLFrameIndicationToggle (int iRetCurVal)
var
	int iFrameIdentify
let iFrameIdentify = GetJCFOption (optFrameIndication)
if not iRetCurVal then
	let iFrameIdentify=!iFrameIdentify
	SetJCFOption (optFrameIndication, iFrameIdentify)
endIf
if !iFrameIdentify then
	return cmsg_off
else
	return cmsg_on
endIf
EndFunction

string function HTMLScreenFollowsVCursorToggle (int iRetCurVal)
var
	int iScreenFollowsVCursor
let iScreenFollowsVCursor = GetJCFOption (optScreenFollowsVCursor)
if not iRetCurVal then
;update it
	let iScreenFollowsVCursor =not iScreenFollowsVCursor
	SetJCFOption (optScreenFollowsVCursor, iScreenFollowsVCursor)
endIf
;now return the value
If iScreenFollowsVCursor  then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string function HTMLSkipPastRepeatedTextToggle (int iRetCurVal)
var
int iSkipRepeatedText
let iSkipRepeatedText = GetJCFOption (optSkipPastRpeatedText)
if not iRetCurVal then
;update it
	let iSkipRepeatedText =not iSkipRepeatedText
	SetJCFOption (optSkipPastRpeatedText, iSkipRepeatedText )
endIf
 ;now return the value
If iSkipRepeatedText then
	return cmsg_on
Else
	return cmsg_off
endIf
EndFunction

string function HTMLTextLinkVerbosityToggle (int iRetCurVal)
var
int iLinkVerbosity
let iLinkVerbosity  = GetJCFOption (optLinkText)
if not iRetCurVal then
;update it
	If iLinkVerbosity == 4 then
		let iLinkVerbosity=0
	else
		let iLinkVerbosity=iLinkVerbosity+1
	endIf
	SetJCFOption (optLinkText, iLinkVerbosity)
endIf
;now return the value
if iLinkVerbosity == 0 then
	return cmsg328_S
elIf iLinkVerbosity == 1 then
	return cmsg329_S
ElIf iLinkVerbosity == 2 then
	return cmsg330_L
ElIf iLinkVerbosity == 3 then
	return cmsg330_S
ElIf iLinkVerbosity == 4 then
	Return cmsgCustomSearch;
endIf
EndFunction

string function HTMLButtonTextVerbosityToggle (int iRetCurVal)
var
int iButtonText
let iButtonText= GetJCFOption (optButtonText)
if not iRetCurVal then
;update it
	If iButtonText== 4 then
		let iButtonText=0
	else
		let iButtonText=iButtonText+1
	endIf
	SetJCFOption (optButtonText, iButtonText)
endIf
;now return the value
if iButtonText == 0 then
	return cmsg328_S
elIf iButtonText == 1 then
	return cmsg329_S
ElIf iButtonText == 2 then
	return cmsg328_L
ElIf iButtonText == 3 then
	return cmsgButtonValue_L
ElIf iButtonText == 4 then
	Return cmsg330_S;
endIf
EndFunction

string function HTMLGraphicReadingVerbosityToggle (int iRetCurVal)
var
int iVerbosity
let iVerbosity  = GetJCFOption (optGraphicRendering)
if not iRetCurVal then
;update it
	If iVerbosity == 4 then
		let iVerbosity=0
	else
		let iVerbosity=iVerbosity+1
	endIf
	SetJCFOption (optGraphicRendering, iVerbosity)
endIf
;now return the value
if iVerbosity == 0 then
	return cmsg328_S
elIf iVerbosity == 1 then
	return cmsg328_L
ElIf iVerbosity == 2 then
	return cmsg330_L
ElIf iVerbosity == 3 then
	return cmsg330_S
ElIf iVerbosity == 4 then
	Return cmsgCustomSearch;
endIf
EndFunction

string function HTMLIncrementLinesPerPageItem (int iRetCurVal)
Var
int iPageLength
let	 iPageLength = GetJCFOption (optLinesPerPage)
if not iRetCurVal then
;update it
	If (iPageLength < 145) Then
		let iPageLength = iPageLength + 10
	Else
		let iPageLength = 10
	endIf
	SetJCFOption (optLinesPerPage, iPageLength)
endIf
;now return the value
return FormatString (cmsg331_S, intToString(iPageLength))
EndFunction

string function HTMLDecrementLinesPerPageItem (int iRetCurVal)
Var
int iPageLength
let iPageLength = GetJCFOption (optLinesPerPage)
if not iRetCurVal then
;update it
	If (iPageLength > 11) Then
		let iPageLength = iPageLength - 10
	Else
		let iPageLength = 155
	endIf
	SetJCFOption (optLinesPerPage, iPageLength)
endIf
;now return the value
return FormatString (cmsg331_S, intToString(iPageLength))
EndFunction

String Function IndicateTablesToggle (int iRetCurVal)
var
int iIndicateTables
let iIndicateTables = GetJCFOption (optTableIndication)
if not iRetCurVal then
;update it
let iIndicateTables=not iIndicateTables
	SetJCFOption (optTableIndication, iIndicateTables)
endIf
;now return the value
If iIndicateTables  then
	return cmsg_on
Else
	return cmsg_off
endIf
EndFunction

String Function DetectTables (int iRetCurVal)
var
	int iTables
If ! GetJCFOption (optTableIndication) then
	Return cMsgNotAvailable
EndIf
Let iTables = GetJCFOption (optTableDetection)
If ! iRetCurVal then
	;Update it
	Let iTables = (! iTables)
EndIf
SetJcfOption (optTableDetection, iTables)
If iTables then
	Return cmsg_off
Else
	Return cmsg_on
EndIf
EndFunction

string function HTMLIndicateHeadingsToggle(int iRetCurVal)
var
int iIndicateHeadings
let iIndicateHeadings= GetJCFOption (optHeadingIndication)
if not iRetCurVal then
;update it
	if (iIndicateHeadings==2) then
		let iIndicateHeadings=0
	else
		let iIndicateHeadings=iIndicateHeadings+1
	endIf
	SetJCFOption (optHeadingIndication, iIndicateHeadings)
endIf
;now return the value
If iIndicateHeadings==0 then
	return cmsg_off
Elif iIndicateHeadings==1 then
	return cmsg_on
Elif iIndicateHeadings==2 then
	return cmsgHeadings2
endIf
EndFunction

string function HTMLIndicateBlockQuotes (int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optBlockQuoteIndication)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
EndIf
SetJcfOption (optBlockQuoteIndication,iOption)
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string function HTMLIndicateLists (int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optListIndication)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
EndIf
SetJcfOption (optListIndication,iOption)
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string function HTMLIndicateElementAccessKeys (int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optElementAccessKeys)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
EndIf
SetJcfOption (optElementAccessKeys,iOption)
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string function HTMLToggleIgnoreInlineFrames(int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optIgnoreInlineFrames)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
EndIf
SetJcfOption (optIgnoreInlineFrames,iOption)
If iOption then
	Return cMsgHidden
Else
	Return cMsgDisplayed
EndIf
EndFunction

string Function ToggleLanguageDetection (int iRetCurVal)
var
	int iOption
Let iOption = GetJCFOption (OPT_LANGUAGE_DETECTION)
If ! iRetCurVal then
	;Update it
	Let iOption = ! iOption;Toggle
	SetJCFOption (OPT_LANGUAGE_DETECTION, iOption)
EndIf
;Now return the value
If iOption then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string function ToggleIndicateCaps (int iRetCurVal)
var
	int iIndicateCaps
let iIndicateCaps=getJCFOption(OPT_INDICATE_CAPS)
if not iRetCurVal then
	; update it
	If iIndicateCaps==3 then
		let iIndicateCaps=0
	else
		let iIndicateCaps=iIndicateCaps+1
	EndIf
	SetJcfOption(OPT_INDICATE_CAPS, iIndicateCaps)
EndIf
;now return the value
if iIndicateCaps==0 then
	return cmsgIndicateCaps0
elif iIndicateCaps==1 then
	return cmsgIndicateCaps1
elif iIndicateCaps==2 then
	return cmsgIndicateCaps2
elif iIndicateCaps==3 then
	return cmsgIndicateCaps3
endIf
EndFunction

string function ToggleIndicateIndentation(int iRetCurVal)
var
	int iIndicateIndentation
let iIndicateIndentation=getJCFOption(OPT_INDICATE_INDENTATION)
if not iRetCurVal then
	; update it
	let iIndicateIndentation=!iIndicateIndentation
	SetJcfOption(OPT_INDICATE_INDENTATION, iIndicateIndentation)
EndIf
;now return the value
if iIndicateIndentation then
	return cmsg_on
else
	return cmsg_Off
endIf
EndFunction

string function ToggleExpandAbbreviations(int iRetCurVal)
var
	int iExpandAbbreviations
let iExpandAbbreviations=getJCFOption(optExpandAbbreviations)
if ! iRetCurVal then
	; update it
	let iExpandAbbreviations=!iExpandAbbreviations
	SetJcfOption(optExpandAbbreviations, iExpandAbbreviations)
EndIf
;now return the value
if iExpandAbbreviations then
	return cmsg_on ;ExpandAbbreviationsOn
else
	return cmsg_off ;ExpandAbbreviationsOff
endIf
EndFunction

string function ToggleExpandAcronyms(int iRetCurVal)
var
	int iExpandAcronyms
let iExpandAcronyms=getJCFOption(optExpandAcronyms)
if ! iRetCurVal then
	; update it
	let iExpandAcronyms=!iExpandAcronyms
	SetJcfOption(optExpandAcronyms, iExpandAcronyms)
EndIf
;now return the value
if iExpandAcronyms then
	return cmsg_on ;ExpandAcronymsOn
else
	return cmsg_off ;ExpandAcronymsOff
endIf
EndFunction

string function ToggleUseVirtualInfoInFormsMode(int iRetCurVal)
var
	int iSetting
let iSetting=getJCFOption(OPT_USE_VIRTUAL_INFO_IN_FORMS_MODE)
if ! iRetCurVal then
	; update it
	let iSetting=!iSetting
	SetJcfOption(OPT_USE_VIRTUAL_INFO_IN_FORMS_MODE, iSetting)
EndIf
;now return the value
if iSetting then
	return cmsg_on ;UseVirtualInfoInFormsModeOn
else
	return cmsg_off ;UseVirtualInfoInFormsModeOff
endIf
EndFunction

string function HTMLToggleFormsModeAutoOff(int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optFormsModeAutoOff)
If ! iRetCurVal then
	;Update it
	Let iOption = (! iOption)
	SetJcfOption (optFormsModeAutoOff,iOption)
EndIf
If iOption then
	Return cmsgFormsModeAutoOffEnabled
Else
	Return cmsgFormsModeAutoOffDisabled
EndIf
EndFunction

string function VirtualCustomPageSummary(int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (OPT_CUSTOM_PAGE_SUMMARY)
If ! iRetCurVal then
	;Update it
	if iOption < CPSVirtualize then
		let iOption=iOption+1
	else
		let iOption=CPSOff
	endIf
	SetJcfOption (OPT_CUSTOM_PAGE_SUMMARY,iOption)
EndIf
If iOption==CPSOff then
	Return cmsg_off ;CPSOff
elif iOption==CPSSpeak then
	return cmsgCPSSpeak
else
	Return cmsgCPSVirtualize
EndIf
EndFunction

string function ToggleTopAndBottomEdgeAlert(int iRetCurVal)
var
	int bOpt,
	string jcfFileName
let bOpt = GetJCFOption(opt_top_and_bottom_edge_alert)
if ! iRetCurVal then
	let bOpt = !bOpt
	SetJCFOption(opt_top_and_bottom_edge_alert,bOpt)
	let jcfFileName = StringChopRight(GetScriptFilename(true),3)+jcfFileExt
	IniWriteInteger(SECTION_OPTIONS,hKEY_TopAndBottomEdgeAlert,bOpt,jcfFileName)
endIf
if bOpt then
	return cmsg_on
else
	return cmsg_off
EndIf
EndFunction

string Function EnhancedClipboardToggle (int iRetCurVal)
var
	int iSetting,
	string JCFFileName
Let iSetting = GetJcfOption (OPT_VPC_ENHANCED_CLIPBOARD)
If ! iRetCurVal then
	;Update it:
	If iSetting == 2 then
		Let iSetting = 0;
	Else
		Let iSetting = (iSetting+1)
	EndIf
	SetJCFOption (OPT_VPC_ENHANCED_CLIPBOARD, iSetting)
	let jcfFileName = StringChopRight(GetScriptFilename(true),3)+jcfFileExt
	IniWriteInteger(SECTION_OSM,hKey_VPCENHANCEDCLIPBOARD,iSetting,jcfFileName,true)
EndIf
;Use constants from UO.jsm, same text:
If iSetting == 1 then
	Return msgUO_FullContent
ElIf iSetting == 2 then
	Return msgUO_FullContent_Visual
Else
	Return msgUO_Virtual_Cursor
EndIf
EndFunction


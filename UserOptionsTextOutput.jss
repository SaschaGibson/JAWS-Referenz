; Copyright 1995-2015 Freedom Scientific, Inc.; User Options text output functions
;these are the functions which generate the text shown for the settings of user options

include "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "uo.jsh"
use "uoSayAllSchemes.jsb"

string Function GeneralOptionsHlp ()
Return FormatString(msgUO_GeneralOptionsHlp)
EndFunction

string Function ReadingOptionsHlp ()
Return FormatString(msgUO_ReadingOptionsHlp)
EndFunction

string Function SayAllOptionsHlp ()
return FormatString(msgUO_SayAllOptionsHlp)
EndFunction

string Function EditingOptionsHlp ()
Return FormatString(msgUO_EditingOptionsHlp)
EndFunction

string Function SpellingOptionsHlp ()
Return FormatString(msgUO_SpellingOptionsHlp)
EndFunction

string Function VirtualCursorOptionsHlp ()
Return FormatString(msgUO_VirtualCursorOptionsHlp)
EndFunction

string Function TextOptionsHlp ()
Return FormatString(msgUO_TextOptionsHlp)
EndFunction

string Function GraphicsOptionsHlp ()
Return FormatString(msgUO_GraphicsOptionsHlp)
EndFunction

string Function LinksOptionsHlp ()
Return FormatString(msgUO_LinksOptionsHlp)
EndFunction

string Function FormsOptionsHlp ()
Return FormatString(msgUO_FormsOptionsHlp)
EndFunction

string Function HeadingAndFrameOptionsHlp ()
Return FormatString(msgUO_HeadingAndFrameOptionsHlp)
EndFunction

string Function ListAndTableOptionsHlp ()
Return FormatString(msgUO_ListAndTableOptionsHlp)
EndFunction

string Function BrailleOptionsHlp ()
Return FormatString(msgUO_BrailleOptionsHlp)
EndFunction

string Function Grade2OptionsHlp ()
Return FormatString(msgUO_Grade2OptionsHlp)
EndFunction

string Function CursorOptionsHlp ()
Return FormatString(msgUO_CursorOptionsHlp)
EndFunction

string Function PanningOptionsHlp ()
Return FormatString(msgUO_PanningOptionsHlp)
EndFunction

string Function TableOptionsHlp ()
Return FormatString(msgUO_TableOptionsHlp)
EndFunction

string Function MarkingOptionsHlp ()
Return FormatString(msgUO_MarkingOptionsHlp)
EndFunction

string Function NodeHlp (string sNodeName)
If sNodeName == NODE_GENERAL then
	Return GeneralOptionsHlp();
ElIf sNodeName == NODE_READING then
	Return ReadingOptionsHlp();
ElIf sNodeName == NODE_SAYALL then
	Return SayAllOptionsHlp();
ElIf sNodeName == NODE_EDITING then
	Return EditingOptionsHlp();
ElIf sNodeName == NODE_SPELLING then
	Return SpellingOptionsHlp()
ElIf sNodeName == NODE_VCURSOR then
	Return VirtualCursorOptionsHlp();
ElIf sNodeName == NODE_VCURSOR_TEXT then
	Return TextOptionsHlp();
ElIf sNodeName == NODE_VCURSOR_GRAPHICS then
	Return GraphicsOptionsHlp();
ElIf sNodeName == NODE_VCURSOR_LINKS then
	Return LinksOptionsHlp();
ElIf sNodeName == NODE_VCURSOR_FORMS then
	Return FormsOptionsHlp();
ElIf sNodeName == NODE_VCURSOR_HEADINGS_FRAMES then
	Return HeadingAndFrameOptionsHlp();
ElIf sNodeName == NODE_VCURSOR_LISTS_TABLES then
	Return ListAndTableOptionsHlp();
ElIf sNodeName == NODE_BRL_ then
	Return BrailleOptionsHlp();
ElIf sNodeName == NODE_BRL_G2 then
	Return Grade2OptionsHlp();
ElIf sNodeName == NODE_BRL_CURSOR then
	Return CursorOptionsHlp();
ElIf sNodeName == NODE_BRL_PANNING then
	Return PanningOptionsHlp();
ElIf sNodeName == NODE_BRL_TABLE then
	Return TableOptionsHlp();
ElIf sNodeName == NODE_BRL_MARKING then
	Return MarkingOptionsHlp();
Else
	Return UnknownHlp()
EndIf
EndFunction

string Function UnknownHlp ()
Return FormatString(msgUO_UnknownHlp)
EndFunction

string function VerbositySetLevelTextOutput(int setting)
if setting == BEGINNER then
	return msgUO_BVerbosity_Beginner
elif setting == INTERMEDIATE then
	return msgUO_BVerbosity_INTERMEDIATE
elif setting == ADVANCED then
	return msgUO_BVerbosity_ADVANCED
endIf
EndFunction

string function VerbositySetLevelHlp()
Return FormatString(msgUO_VerbositySetLevelHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	VerbositySetLevelTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_Verbosity)))
EndFunction

string function UseTandemConnectSoundsTextOutput(int setting)
if setting then
	return cmsg_on
else
	return cmsg_off
EndIf
EndFunction

string function UseTandemConnectSoundsHlp()
if GlobalTandemMode ==Tandem_Mode_Connected then
	return msgUO_TandemUnavailableHlp
EndIf
return msgUseTandemConnectSounds+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UseTandemConnectSoundsTextOutput(GetIntOptionDefaultSetting(SECTION_TANDEM,hKey_IndicateTandemConnectionWithSounds)))
EndFunction

string function ToggleVirtualRibbonsTextOutput(int setting)
if setting then
	return cmsg_on
else
	return cmsg_off
EndIf
EndFunction

string function ToggleVirtualRibbonsHlp()
Return FormatString(msgUO_VirtualRibbonsHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	ToggleVirtualRibbonsTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_VirtualRibbonSupport)))
EndFunction

string function TextAnalyzerToggleTextOutput(int iSetting)
if iSetting == TextAnalyserOff then
	return msgUO_TextAnalyserOff
elif iSetting == TextAnalyserIndicateWithSound then
	return msgUO_TextAnalyserIndicateWithSound
elif iSetting == TextAnalyserSpeakCount then
	return msgUO_TextAnalyserSpeakCount
elif iSetting == TextAnalyserDescribeAllInconsistencies then
	return msgUO_TextAnalyserDescribeAllInconsistencies
EndIf
EndFunction

string function TextAnalyzerToggleHlp(int iSetting)
Return FormatString(msgUO_TextAnalyzerToggleHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	TextAnalyzerToggleTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_TextAnalyser)))
EndFunction

string function SmartWordReadingSetTextOutput(int setting)
If setting then
	return msgUO_On
else
	return msgUO_Off
EndIf
EndFunction

string function SmartWordReadingSetHlp()
Return FormatString(msgUO_SmartWordReadingSetHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	SmartWordReadingSetTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_SmartWordReading)))
EndFunction

string Function SpellModeSetTextOutput(int setting)
If !setting then
	Return msgUO_SpellTextStandard
Else
	Return msgUO_SpellTextPhonetic
EndIf
EndFunction

string Function SpellModeSetHlp()
Return FormatString(msgUO_SpellModeSetHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	SpellModeSetTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_SpellPhonetic )))
EndFunction

string function AlphaNumCombinationsTextOutput(int setting)
If setting == 0 then
	return msgUO_CombinationsReadNormal
ElIf setting == 1 then
	return msgUOCombinationsSpell
Elif setting == 2 then
	return msgUO_CombinationsSpellPhonetic
EndIf
EndFunction

string function AlphaNumCombinationsHlp()
Return FormatString(msgUO_AlphaNumCombinationsHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	AlphaNumCombinationsTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_SpellAlphanumericData)))
EndFunction

string function SpeakSingleDigitsThresholdTextOutput(int iSetting)
if !iSetting then
	return msg_ControlledBySynthesizer
else
	return FormatString(msg_NOrMoreDigits,IntToString(iSetting))
EndIf
EndFunction

string function SpeakSingleDigitsThresholdHlp()
Return FormatString(msgUO_SpeakSingleDigitsThresholdHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	SpeakSingleDigitsThresholdTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_SingleDigitThreshold)))
EndFunction

string function SpeakSingleDigitsDashesTextOutput(int iSetting)
if iSetting then
	return cmsg_on
else
	return cmsg_off
EndIf
EndFunction

string function SpeakSingleDigitsDashesHlp()
Return FormatString(msgUO_SpeakSingleDigitsDashesHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	SpeakSingleDigitsDashesTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_SpeakNumbersSepByDashesAsDigits)))
EndFunction

string function ProgressBarSetAnnouncementTextOutput(int setting)
if setting then
	return msgUO_Spoken
else
	return msgUO_Silent
endIf
EndFunction

string function ProgressBarSetAnnouncementHlp()
Return FormatString(msgUO_ProgressBarSetAnnouncementHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	ProgressBarSetAnnouncementTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_ProgressBarUpdateInterval)))
EndFunction

string function TypingEchoSetTextOutput(int setting)
;For this function, we used the strings from common.jsm,
;Since those strings are not used elsewhere.
;The only exception is that instead of 'None', we use msgUO_Off.
If setting == 0 Then
	return msgUO_Off
ElIf setting == 1 Then
	return cmsg82_L ;"Keys"
ElIf setting == 2 Then
	return cmsg83_L ;"Words"
ElIf setting == 3 then
	return cmsg361_L ; "Both characters and words"
endIf
EndFunction

string function TypingEchoSetHlp()
Return FormatString(msgUO_TypingEchoSetHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	TypingEchoSetTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_TypingEcho)))
EndFunction

string function ScreenEchoSetTextOutput(int setting)
;For this function, we used the strings from common.jsm,
;Since those strings are not used elsewhere.
;The only exception is that instead of 'None', we use msgUO_Off.
if setting == 0 then
	return msgUO_Off
elif setting == 1 then
	return cmsg16_L ;"highlighted"
elif setting == 2 then
	return cmsg17_L ;"all"
endIf
EndFunction

string function ScreenEchoSetHlp()
Return FormatString(msgUO_ScreenEchoSetHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	ScreenEchoSetTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_ScreenEcho)))
EndFunction

string function GraphicsShowTextOutput(int setting)
;For this function, we used the strings from common.jsm,
;Since those strings are not used elsewhere.
If setting == 0 Then
	return cmsg226_L ; none
ElIf setting == 1 Then
	return cMSG227_L ; "Labeled"
ElIf setting ==2 Then
	return cmsg228_L ;"All graphics"
endIf
EndFunction

string function GraphicsShowHlp()
Return FormatString(msgUO_GraphicsShowHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	GraphicsShowTextOutput(GetIntOptionDefaultSetting(SECTION_OSM,hKey_IncludeGraphics)))
EndFunction

string function CustomLabelsSetTextOutput(int setting)
If !setting then
	return msgUO_Off
else
	return msgUO_On
EndIf
EndFunction

string function CustomLabelsSetHlp()
Return FormatString(msgUO_CustomLabelsSetHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	CustomLabelsSetTextOutput(GetIntOptionDefaultSetting(SECTION_OSM,hKey_UseCustomLabels)))
EndFunction

string function StopWordsExceptionDictionaryToggleTextOutput(int setting)
If !setting then
	return msgUO_Off
else
	return msgUO_On
EndIf
EndFunction

string function StopWordsExceptionDictionaryToggleHlp()
Return FormatString(msgUO_StopWordsExceptionDictionaryToggleHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	CustomLabelsSetTextOutput(GetIntOptionDefaultSetting(SECTION_Options,hKey_WordIndexStopwords)))
EndFunction

string function TopAndBottomEdgeIndicateTextOutput(int setting)
if setting then
	return msgUO_AlertSound
else
	return msgUO_silent
EndIf
EndFunction

string function TopAndBottomEdgeIndicateHlp()
Return FormatString(msgUO_TopAndBottomEdgeIndicateHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	TopAndBottomEdgeIndicateTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_TopAndBottomEdgeAlert)))
EndFunction

string Function LanguageDetectChangeTextOutput(int setting)
If setting then
	Return msgUO_on
Else
	Return msgUO_off
EndIf
EndFunction

string Function LanguageDetectChangeHlp()
Return FormatString(msgUO_LanguageDetectChangeHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	LanguageDetectChangeTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_LanguageDetection)))
EndFunction

string function UOSayAllSchemeTextOutput(string sSetting)
var
	string sSchemeTitle
if sSetting
&& sSetting != uoSayAllSchemeNoChange then
	let sSchemeTitle = LookupSchemeTitleInUOSayAllSchemesData(sSetting)
EndIf
;if the scheme was not found in the lookup, it is the same as No Change
if !sSchemeTitle then
	return uoSayAllSchemeNoChange
EndIf
return sSchemeTitle
EndFunction

string function UOSayAllSchemeHlp()
Return FormatString(msgUOSayAllSchemeHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOSayAllSchemeTextOutput(GetStringOptionDefaultSetting(SECTION_OPTIONS,hKey_SayAllScheme)))
EndFunction

string function CustomSayAllSchemeTextOutput(string sSetting)
if !sSetting
|| sSetting == uoSayAllSchemeSameAsApp then
	return uoSayAllSchemeSameAsApp
else
	Return LookupSchemeTitleInUOSayAllSchemesData(sSetting)
EndIf
EndFunction

string function CustomSayAllSchemeHlp()
Return FormatString(msgUOSayAllSchemeHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionAppAndPersonalizedDefaultSetting,
	UOSayAllSchemeTextOutput(GetStringOptionDefaultSetting(SECTION_OPTIONS,hKey_SayAllScheme)),
	CustomSayAllSchemeTextOutput(GetStringOptionDefaultSetting(SECTION_OPTIONS,hKey_SayAllScheme)))
EndFunction

string function SayAllReadsByTextOutput(int setting, int LinePause)
if setting ==0 then
	if LinePause==1 then
		return cMSG248_S
	else
		return cmsg364_S
	EndIf
elif setting ==1 then
	return cMSG249_S
ElIf setting ==2 then
	return cMSG250_S
endIf
EndFunction

string function SayAllReadsByHlp()
Return FormatString(msgUO_SayAllReadsByHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
		SayAllReadsByTextOutput(
		GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_SayAllMode),
		GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_LinePauses)))
EndFunction

string function CapsIndicateDuringSayAllTextOutput(int setting)
if setting ==0 then
	return msgUO_Ignore
elif setting ==1 then
	return msgUO_Indicate
endIf
EndFunction

string function CapsIndicateDuringSayAllHlp()
Return FormatString(msgUO_CapsIndicateDuringSayAllHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	CapsIndicateDuringSayAllTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_SayAllIndicateCaps)))
EndFunction

string function CapsIndicateTextOutput(int setting)
if setting ==0 then
	return msgUO_CapsIndicateNever
elif setting ==1 then
	return msgUO_CapsIndicateChar
elif setting ==2 then
	return msgUO_CapsIndicateWord
elif setting ==3 then
	return msgUO_CapsIndicateLine
endIf
EndFunction

string function CapsIndicateHlp()
Return FormatString(msgUO_CapsIndicateHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	CapsIndicateTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_IndicateCaps)))
EndFunction

string function PunctuationSetLevelTextOutput(int setting)
If setting == 0 then
	return cmsgPunctuationNone
elIf setting == 1 then
	return cmsg278_L
ElIf setting == 2 then
	return cmsg279_L
Elif setting == 3 then
	return cmsg280_L
endIf
EndFunction

string function PunctuationSetLevelHlp()
Return FormatString(msgUO_PunctuationSetLevelHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
		PunctuationSetLevelTextOutput(
			GetIntOptionDefaultSetting(GetActiveSynthGlobalSectionName(),hKey_Punctuation)))
EndFunction

string function IndentationIndicateTextOutput(int setting)
if setting then
	return msgUO_Indicate
else
	return msgUO_Ignore
endIf
EndFunction

string function IndentationIndicateHlp()
Return FormatString(msgUO_IndentationIndicateHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	IndentationIndicateTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_Indentation)))
EndFunction

string function SynthesizerMuteTextOutput(int setting)
if setting then
	return cmsg203_L ;mute on
else
	return cmsg204_L ;mute off
endIf
EndFunction

string function SynthesizerMuteHlp()
Return FormatString(msgUO_SynthesizerMuteHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	SynthesizerMuteTextOutput(0))
EndFunction

string function ToggleSayAllOnDocumentLoadHlp()
return FormatString(msgUO_SayAllOnDocumentLoadHlp)
EndFunction

string Function NavigationQuickKeysSetTextOutput(int setting)
If setting == 0 then
	Return cmsg_off
ElIf setting == 1 then
	Return cmsg_on
ElIf setting == 2 then
	Return cMsgSayAllOnly
EndIf
EndFunction

string Function NavigationQuickKeysSetHlp()
Return FormatString(msgUO_NavigationQuickKeysSetHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	NavigationQuickKeysSetTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_QuickKeyNavigationMode)))
EndFunction

string Function DocumentPresentationSetTextOutput(int setting)
If setting then
	return cmsgDocumentPresentationModeOn_l
else
	return cmsgDocumentPresentationModeOff_l
endIf
EndFunction

string Function DocumentPresentationSetHlp()
if IsMAGicRunning() then
	return msgUO_NotAvailableWhenMAGicIsRunningHlp
else
	Return FormatString(msgUO_DocumentPresentationSetHlp)+cscBufferNewLine+cscBufferNewLine+
		FormatString(msgShowOptionDefaultSetting,
		DocumentPresentationSetTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_DocumentPresentationMode)))
EndIf
EndFunction

string function vCursorGraphicsShowTextOutput(int setting)
;now return the value
if setting == 0 then
	return cmsg334_S
elIf setting == 1 then
	return cmsg335_S
ElIf setting == 2 then
	return cmsg336_S
endIf
EndFunction

string function vCursorGraphicsShowHlp()
Return FormatString(msgUO_vCursorGraphicsShowHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorGraphicsShowTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_IncludeGraphics)))
EndFunction

string function vCursorGraphicsSetRecognitionTextOutput(int setting)
if setting == 0 then
	return cmsg328_S
elIf setting == 1 then
	return cmsg328_L
ElIf setting == 2 then
	return cmsg330_L
ElIf setting == 3 then
	return cmsg330_S
ElIf setting == 4 then
	Return cmsgCustomSearch;
endIf
EndFunction

string function vCursorGraphicsSetRecognitionHlp()
Return FormatString(msgUO_vCursorGraphicsSetRecognitionHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorGraphicsSetRecognitionTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_GraphicRenderingOption)))
EndFunction

string function VCursorFilterConsecutiveDuplicateLinksTextOutput(int iSetting)
if iSetting then
	return cmsg_On
else
	return cmsg_Off
EndIf
EndFunction

string function VCursorFilterConsecutiveDuplicateLinksHlp()
Return FormatString(msgUO_VCursorFilterConsecutiveDuplicateLinksHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	VCursorFilterConsecutiveDuplicateLinksTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_FilterConsecutiveDuplicateLinks)))
EndFunction

string function vCursorGraphicalLinksSetTextOutput(int setting)
if setting == 0 then
	return cmsg334_S
elIf setting == 1 then
	return cmsg335_S
ElIf setting == 2 then
	return cmsg336_S
endIf
EndFunction

string function vCursorGraphicalLinksSetHlp()
Return FormatString(msgUO_vCursorGraphicalLinksSetHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorGraphicalLinksSetTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_IncludeGraphicLinks)))
EndFunction

string Function vCursorUntaggedGraphicalLinkShowTextOutput(int setting)
If setting then
	Return msgUO_GraphicalLinksShowLinkSRC
Else
	Return msgUO_GraphicalLinksShowImage
EndIf
EndFunction

string Function vCursorUntaggedGraphicalLinkShowHlp()
Return FormatString(msgUO_vCursorUntaggedGraphicalLinkShowHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorUntaggedGraphicalLinkShowTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_GraphicalLinkLastResort)))
EndFunction

string function vCursorImageMapLinksShowTextOutput(int setting)
if setting == 0 then
	return cmsg334_S
elIf setting == 1 then
	return cmsg335_S
ElIf setting == 2 then
	return cmsg336_S
endIf
EndFunction

string function vCursorImageMapLinksShowHlp()
Return FormatString(msgUO_vCursorImageMapLinksShowHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorImageMapLinksShowTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_IncludeImageMapLinks)))
EndFunction

string function vCursorTextLinksShowTextOutput(int setting)
if setting == 0 then
	return cmsg328_S
elIf setting == 1 then
	return cmsg329_S
ElIf setting == 2 then
	return cmsg330_L
ElIf setting == 3 then
	return cmsg330_S
ElIf setting == 4 then
	Return cmsgCustomSearch;
endIf
EndFunction

string function vCursorTextLinksShowHlp()
Return FormatString(msgUO_vCursorTextLinksShowHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorTextLinksShowTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_LinkText)))
EndFunction

string function vCursorLinksIdentifyTypeTextOutput(int setting)
If setting then
	return msgUO_On
else
	return msgUO_Off
endIf
EndFunction

string function vCursorLinksIdentifyTypeHlp()
Return FormatString(msgUO_vCursorLinksIdentifyTypeHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorLinksIdentifyTypeTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_IdentifyLinkType)))
EndFunction

string function vCursorLinksIdentifySamePageTextOutput(int setting)
If setting then
	return msgUO_on
Else
	return msgUO_off
endIf
EndFunction

string function vCursorLinksIdentifySamePageHlp()
Return FormatString(msgUO_vCursorLinksIdentifySamePageHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorLinksIdentifySamePageTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_IdentifySamePageLinks)))
EndFunction

string function vCursorButtonsShowUsingTextOutput(int setting)
if setting == 0 then
	return cmsg328_S
elIf setting == 1 then
	return cmsg329_S
ElIf setting == 2 then
	return cmsg328_L
ElIf setting == 3 then
	return cmsgButtonValue_L
ElIf setting == 4 then
	Return cmsg330_S
elIf setting == 5 then
	return cmsgCustomSearch;
endIf
EndFunction

string function vCursorButtonsShowUsingHlp()
Return FormatString(msgUO_vCursorButtonsShowUsingHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorButtonsShowUsingTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_ButtonTextOptions)))
EndFunction

string function vCursorAbbreviationsExpandTextOutput(int setting)
if setting then
	return msgUO_on
else
	return msgUO_off
endIf
EndFunction

string function vCursorAbbreviationsExpandHlp()
Return FormatString(msgUO_vCursorAbbreviationsExpandHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorAbbreviationsExpandTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_ExpandAbbreviations)))
EndFunction

string function vCursorAcronymsExpandTextOutput(int setting)
if setting then
	return msgUO_on
else
	return msgUO_off
endIf
EndFunction

string function vCursorAcronymsExpandHlp()
Return FormatString(msgUO_vCursorAcronymsExpandHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorAcronymsExpandTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_ExpandAcronyms)))
EndFunction

string function vCursorFormFieldsIdentifyPromptUsingTextOutput(int setting)
If setting == 0 then
	Return cMsgLabelTag
ElIf setting == 1 then
	Return cmsg328_S
ElIf setting == 2 then
	Return cMsgAltAttribute
ElIf setting == 3 then
	Return cmsg330_S
ElIf setting == 4 then
	Return cmsgTitleLabel
ElIf setting == 5 then
	Return cMsgAltLabel
EndIf
EndFunction

string function vCursorFormFieldsIdentifyPromptUsingHlp()
Return FormatString(msgUO_vCursorFormFieldsIdentifyPromptUsingHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorFormFieldsIdentifyPromptUsingTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_FormFieldPromptOptions)))
EndFunction

string function vCursorFramesShowStartAndEndTextOutput(int setting)
if !setting then
	return msgUO_off
else
	return msgUO_on
endIf
EndFunction

string function vCursorFramesShowStartAndEndHlp()
Return FormatString(msgUO_vCursorFramesShowStartAndEndHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorFramesShowStartAndEndTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_FrameIndication)))
EndFunction

string function vCursorInlineFramesShowTextOutput(int setting)
;Double-negative on string, e.g. if option is on, then frames are off, as it's actually an ignore option in jcf, whereas to user it is show.
If setting then
	Return msgUO_off
Else
	Return msgUO_On
EndIf
EndFunction

string function vCursorInlineFramesShowHlp()
Return FormatString(msgUO_vCursorInlineFramesShowHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorInlineFramesShowTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_InlineFrames)))
EndFunction

string function vCursorScreenTrackTextOutput(int setting)
If setting then
	return msgUO_on
else
	return msgUO_off
endIf
EndFunction

string function vCursorScreenTrackHlp()
Return FormatString(msgUO_vCursorScreenTrackHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorScreenTrackTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_ScreenFollowsVCursor)))
EndFunction

string function vCursorRepeatedTextSkipTextOutput(int setting)
if setting then
	return msgUO_on
Else
	return msgUO_off
endIf
EndFunction

string function vCursorRepeatedTextSkipHlp()
Return FormatString(msgUO_vCursorRepeatedTextSkipHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorRepeatedTextSkipTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_SkipPastRepeatedText)))
EndFunction

string function vCursorBlockQuotesIdentifyStartAndEndTextOutput(int setting)
If setting then
	Return msgUO_On
Else
	Return msgUO_Off
EndIf
EndFunction

string function vCursorBlockQuotesIdentifyStartAndEndHlp()
Return FormatString(msgUO_vCursorBlockQuotesIdentifyStartAndEndHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorBlockQuotesIdentifyStartAndEndTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_BlockQuoteIndication)))
EndFunction

string function vCursorListsIdentifyStartAndEndTextOutput(int setting)
If setting then
	Return msgUO_On
Else
	Return msgUO_Off
EndIf
EndFunction

string function vCursorListsIdentifyStartAndEndHlp()
Return FormatString(msgUO_vCursorListsIdentifyStartAndEndHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorListsIdentifyStartAndEndTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_ListIndication)))
EndFunction

string function vCursorAccessKeysShowTextOutput(int setting)
If setting then
	Return msgUO_On
Else
	Return msgUO_Off
EndIf
EndFunction

string function vCursorAccessKeysShowHlp()
Return FormatString(msgUO_vCursorAccessKeysShowHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorAccessKeysShowTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_AccessKeys)))
EndFunction

string Function vCursorAttributesIndicateTextOutput(int setting)
If setting then
	return msgUO_On
else
	return msgUO_Off
endIf
EndFunction

string Function vCursorAttributesIndicateHlp()
Return FormatString(msgUO_vCursorAttributesIndicateHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorAttributesIndicateTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_ElementAttribAnnounce)))
EndFunction

string Function vCursorTablesShowStartAndEndTextOutput(int setting)
If setting then
	Return msgUO_On
Else
	Return msgUO_Off
EndIf
EndFunction

string Function vCursorTablesShowStartAndEndHlp()
Return FormatString(msgUO_vCursorTablesShowStartAndEndHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorTablesShowStartAndEndTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_Tables)))
EndFunction

string Function vCursorLayoutTablesTextOutput(int setting)
If setting then
	Return cmsg_off
Else
	Return cmsg_on
EndIf
EndFunction

string Function vCursorLayoutTablesHlp()
If ! GetJCFOption (optTableIndication) then
	Return msgvCursorTablesUnavailableHlp
EndIf
;With TableDetection, 0 indicate all tables, 1 only indicate data tables.
;This is why we flip the result from GetIntOptionDefaultSetting below to indicate whether layout tables are shown.
Return FormatString(msgvCursorLayoutTablesHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorLayoutTablesTextOutput(!GetIntOptionDefaultSetting(SECTION_HTML,hKey_TableDetection )))
EndFunction

string Function vCursorTableTitlesAnnounceTextOutput(int setting)
If setting == OFF then
	Return msgUO_off
ElIf setting == TBL_HEADER_ROW then
	Return cmsgRowTitles
ElIf setting == TBL_HEADER_COL then
	Return cMsgColumnTitles
ElIf setting == TBL_HEADER_BOTH then
	Return cMsgBothTitles
Else ; Marked headers
	Return cMsgMarkedTitles
EndIf
EndFunction

string Function vCursorTableTitlesAnnounceHlp()
If ! GetJCFOption (optTableIndication) then
	Return msgvCursorTablesUnavailableHlp
EndIf
Return FormatString(msgUO_vCursorTableTitlesAnnounceHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorTableTitlesAnnounceTextOutput(TBL_HEADER_MARKED))
;note that this is a pseudo option which does not have a default jcf setting
EndFunction

string function VCursorCellCoordinatesAnnouncementTextOutput(int setting)
if setting then
	return cmsg_on
else
	return cmsg_off
EndIf
EndFunction

string function VCursorCellCoordinatesAnnouncementHlp()
return msgUO_VCursorCellCoordinatesAnnouncementHlp
EndFunction

string function vCursorHeadingsAnnounceTextOutput(int setting)
If setting == 0 then
	return msgUO_off
Elif setting == 1 then
	return msgUO_on
Elif setting == 2 then
	return cmsgHeadings2
endIf
EndFunction

string function vCursorHeadingsAnnounceHlp()
Return FormatString(msgUO_vCursorHeadingsAnnounceHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorHeadingsAnnounceTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_HTML_HeadingIndication )))
EndFunction

string Function vCursorEnhancedClipboardTextOutput(int setting)
If setting then
	Return msgUO_FullContent_Visual
Else
	Return msgUO_Virtual_Cursor
EndIf
EndFunction

string Function vCursorEnhancedClipboardHlp (int iRetCurVal)
Return FormatString(msgUO_vCursorEnhancedClipboardHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorEnhancedClipboardTextOutput(GetIntOptionDefaultSetting(SECTION_OSM,hKey_VPCENHANCEDCLIPBOARD)))
EndFunction

string Function vCursorAutoFormsModeTextOutput(int setting)
If setting then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string function vCursorAutoFormsModeHlp()
return FormatString(msgUO_vCursorAutoFormsModeHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorAutoFormsModeTextOutput(GetIntOptionDefaultSetting(SECTION_FormsMode,hKey_AutoFormsMode)))
EndFunction

string Function vCursorIndicateFormsModeWithSoundsTextOutput(int setting)
If setting then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string Function vCursorIndicateFormsModeWithSoundsHlp()
return FormatString(msgUO_vCursorIndicateFormsModeWithSoundsHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorIndicateFormsModeWithSoundsTextOutput(GetIntOptionDefaultSetting(SECTION_FormsMode,hKey_IndicateFormsModeWithSounds)))
EndFunction

string function vCursorNavQuickKeyDelayTextOutput(int setting, int AutoFormsModeSetting)
var
	int iWhole,
	int iFraction
if !AutoFormsModeSetting then
	return msgUO_Unavailable
ElIf setting == -1 then
	Return msgNavQuickKeyThresholdNever
Else
	let iWhole = Setting/1000
	let iFraction = Setting%1000
	if iFraction then
		Return FormatString(msgNavQuickKeyThresholdWithFraction,IntToString(iWhole),IntToString(iFraction/100))
	else
		if iWhole == 1 then
			Return FormatString(msgNavQuickKeyThresholdSingle,IntToString(iWhole))
		else
			Return FormatString(msgNavQuickKeyThresholdWhole,IntToString(iWhole))
		EndIf
	EndIf
EndIf
EndFunction

string function vCursorNavQuickKeyDelayHlp()
if !GetJcfOption(OPT_AUTO_FORMS_MODE) then
	return msgUO_vCursorNavQuickKeyDelayUnavailableHlp
EndIf
return FormatString(msgUO_vCursorNavQuickKeyDelayHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorNavQuickKeyDelayTextOutput(GetIntOptionDefaultSetting(SECTION_FormsMode,hKey_AutoFormsModeThreshold),
	GetIntOptionDefaultSetting(SECTION_FormsMode,hKey_AutoFormsMode)))
EndFunction

string Function FlashMoviesRecognizeTextOutput(int setting)
If setting then
	return msgUO_on
else
	return msgUO_off
endIf
EndFunction

string Function FlashMoviesRecognizeHlp()
Return FormatString(msgUO_FlashMoviesRecognizeHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	FlashMoviesRecognizeTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_EmbeddedActiveXSupport)))
EndFunction

string Function PageRefreshHlp()
Return FormatString(msgUO_PageRefreshHlp)
EndFunction

string Function AnnounceLiveRegionUpdatesTextOutput(int iSetting)
if iSetting then
	return msgUO_On
Else
	return msgUO_Off
EndIf
EndFunction

string Function AnnounceLiveRegionUpdatesHlp()
Return FormatString(msgUO_AnnounceLiveRegionUpdatesHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	AnnounceLiveRegionUpdatesTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_AnnounceLiveRegionUpdates)))
EndFunction

string function vCursorFormsModeAutoOffTextOutput(int setting, int option)
if setting then
	return msgUO_Unavailable
ElIf option then
	Return msgUO_Enabled
Else
	Return msgUO_Disabled
EndIf
EndFunction

string function vCursorFormsModeAutoOffHlp()
if GetJcfOption(OPT_AUTO_FORMS_MODE) then
	Return msgUO_vCursorFormsModeAutoOffUnavailableHlp
EndIf
Return FormatString(msgUO_vCursorFormsModeAutoOffHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorFormsModeAutoOffTextOutput(GetIntOptionDefaultSetting(SECTION_FormsMode,hKey_AutoFormsMode),
	GetIntOptionDefaultSetting(SECTION_FormsMode,hKey_FormsModeAutoOff)))
EndFunction

string function vCursorCustomPageSummaryHlp (int iRetCurVal)
Return FormatString(msgUO_vCursorCustomPageSummaryHlp)
EndFunction

string Function vCursorReadOnlyStateTextOutput(int setting)
If setting then
	Return msgUO_Ignore
Else
	Return msgUO_Announce
EndIf
endFunction

string Function vCursorReadOnlyStateHlp()
Return FormatString(msgUO_vCursorReadOnlyStateHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorReadOnlyStateTextOutput(GetIntOptionDefaultSetting(SECTION_HTML,hKey_ReadOnlyState)))
EndFunction

string function UOToggleFocusLossAnnounceTextOutput (int iSetting)
if iSetting then
	return msgUO_On
else
	return msgUO_Off
endIf
endFunction

string Function UOToggleFocusLossAnnounceTextOutputHlp ()
return FormatString(msgUO_ToggleFocusLossAnnounceTextOutputHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString (msgShowOptionDefaultSetting,
	UOToggleFocusLossAnnounceTextOutput ( GetIntOptionDefaultSetting(SECTION_Options,hKey_AnnounceFocusLoss)))
EndFunction

string Function UOToggleFocusLossAnnounceHlp ()
return UOToggleFocusLossAnnounceTextOutputHlp ()
endFunction

string Function vCursorVirtualDocumentLinkActivationMethodTextOutput(int setting)
If setting then
	Return msgUO_VirtualDocumentLinkActivationMethodEnterSendsEnterKey
Else
	Return msgUO_VirtualDocumentLinkActivationMethodEnterSimulatesMouseClick
EndIf
endFunction

string Function vCursorVirtualDocumentLinkActivationMethodHlp()
Return FormatString(msgUO_VirtualDocumentLinkActivationMethodHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	vCursorVirtualDocumentLinkActivationMethodTextOutput(GetIntOptionDefaultSetting(SECTION_OPTIONS,hKey_VirtualDocumentLinkActivationMethod)))
EndFunction

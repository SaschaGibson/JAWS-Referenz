; Copyright 1995-2015 Freedom Scientific, Inc.
; Companion Source File to AdjustJAWSOptions Script

include "common.jsm"
include "HjConst.jsh"
include "HjGlobal.jsh"
include "uo.jsh"
use "UserOptionstextOutput.jsb"
Use "VoIPHelper.jsb"
use "uoSayAllSchemes.jsb"


GLOBALS
;overwrites of Verbosity globals:
	int iSavedProgressBarAnnouncementInterval


void Function MakeNodePath (string ByRef strPath, string strList)
var
	int nidx,
	int iMax,
	string sTmp
Let iMax = SgringSegmentCount (strList, uoPipe);
Let nIdx = 1;Pascal-style 1 is first element:
While (nIdx <= iMax)
	Let sTmp = StringSegment (strList, uoPipe, nIdx)
	If sTmp then;
		Let strPath = strPath + NODE_PATH_DELIMITER + sTmp
	EndIf
	let nIdx = (nIdx+1)
EndWhile
EndFunction

string Function PrependItemWithNode (string strItem, string strNode)
;Presumes fully constructed node, use levelStrings / FormatString:
var
	string sItemWithNode,
	string sTmp
Let	sItemWithNode = StringSegment (strItem, cscColon, 1);
Let sItemWithNode  = sItemWithNode +cscColon;
Let sTmp = StringSegment (strItem, cscColon, 2);
;Now remove prepending dot if there is one, so as not to create an empty branch:
If StringLeft (sTmp,1) == NODE_PATH_DELIMITER then
	Let sTmp = (StringChopLeft (sTmp,1))
EndIf
Let sTmp = (strNode+NODE_PATH_DELIMITER+sTmp)
;Now, if the node doesn't contain a dot, we add
;consistently use the path character in the node portion of the string:
Let sItemWithNode = sItemWithNode+sTmp;Segment1:Segment2 w/node delimiter.
Return sItemWithNode;
EndFunction

void Function CleanupNodePathStrings (string byRef szNodeList)
var
	int i,
	int iMax,
	int bAssertNew,
	string sValidDelim,
	string sInvalidDelim,
	string stmp,
	string sNewTmp
If ! szNodeList then
	Return Null();
EndIf
Let iMax = StringSegmentCount (szNodeList, uoPipe);
If ! iMax then;Not valid list:
	Return Null();
EndIf
Let sValidDelim = NODE_PATH_DELIMITER
Let sInvalidDelim = (sValidDelim+sValidDelim)
Let i = 1;Start of list:
While (i < iMax)
	;Cleanup happens on second parameter.
	Let sTmp = StringSegment (szNodeList, uoPipe,i)
	Let sTmp = (StringSegment (sTmp,cscColon,2))
	Let sNewTmp = sTmp;
	;First, kill all propending and allending path strings:
	If (StringLeft (sNewTmp,1) == sValidDelim) then
		Let bAssertNew = TRUE;
		let sNewTmp = (StringChopLeft (sNewTmp,1))
	EndIf
	If (StringRight (sNewTmp,1) == sValidDelim) then
		Let bAssertNew = TRUE;
		let sNewTmp = (StringChopRight (sNewTmp,1))
	EndIf
	If (StringContains (sNewTmp, sInvalidDelim)) then
		Let bAssertNew = TRUE;
		;First see if there's an instance of tree dods, replacing with 1:
		Let sNewTmp = (StringReplaceSubstrings (sNewTmp, (sInvalidDelim+sValidDelim), sValidDelim))
		;Run StringReplace thrice to see that we get all instances of two, 3, or more dot combos.
		Let sNewTmp = (StringReplaceSubstrings (sNewTmp, sInvalidDelim, sValidDelim))
		Let sNewTmp = (StringReplaceSubstrings (sNewTmp, sInvalidDelim, sValidDelim))
		Let sNewTmp = (StringReplaceSubstrings (sNewTmp, sInvalidDelim, sValidDelim))
	EndIf
	If bAssertNew then
		Let szNodeList = StringReplaceSubstrings (szNodeList, sTmp, sNewTmp);
	EndIf
	Let i = (i+1)
EndWhile
EndFunction

void Function ConvertListToNodeList (string ByRef strList, string sNode)
;All items in list belong to same node path.
;For example, use this to add all items to Virtual Cursor Options.Forms Options:
var
	int nIdx,
	int iMax,
	string sReplace,
	string sTmp;
If ! sNode then;Do not add node delimiter:
	Return Null()
EndIf
Let sTmp = Null()
Let iMax = StringSegmentCount (strList, uoPipe);
;Let nIdx = 1;
While (nIdx <= iMax)
	Let sTmp = StringSegment (strList, uoPipe, nIdx)
	If sTmp then
		Let sReplace = PrependItemWithNode (sTmp, sNode)
		Let strList = StringReplaceSubstrings (strList, sTmp, sReplace)
	EndIf
	let nIdx = (nIdx+1)
EndWhile
CleanupNodePathStrings (strList)
EndFunction

void Function AddCustomNodes (string byRef sCustomItems,optional  string strNewNode)
;The custom list, if it contains an element without a node path,
;must be handed a path to a structure
;created using the configuration's name:
var
	int iSegment,
	int iMax,
	string strItemsList,
	string strtmpArray,
	string strTmpSeg1,
	string strtmpSeg2
Let iMax = StringSegmentCount (sCustomItems, uoPipe)
Let iSegment = 1;
;Now, check to see if strNewNode is loaded.
;If not, we load based upon the configuration name of the given app to support.
;This should make finding options easier, especially when
;developers may not be familiar with the new node structure.
If (! strNewNode ||
StringLength (strNewNode) <= 1) then
	Let strNewNode = FormatString (cmsgCustomItemsAdd,
	GetActiveConfiguration ())
EndIf
Let strItemsList = cscNull;
Let strtmpArray = cscNull;
Let strtmpSeg1 = cscNull;
Let strtmpSeg2 = cscNull;
While (iSegment <= iMax);
	Let strtmpArray = (StringSegment (sCustomItems, uoPipe, iSegment))
	If (strtmpArray &&
	StringContains (strtmpArray, cScColon)) then
		;Create slices:
		Let strtmpSeg1 = StringSegment (strtmpArray, cscColon, 1)
		Let strtmpSeg2 = StringSegment (strtmpArray, cscColon, 2)
		If (! StringContains (strtmpSeg2, NODE_PATH_DELIMITER)) then
			;Prepend the segment:
			Let strtmpSeg2 = (strNewNode+
			NODE_PATH_DELIMITER+strtmpSeg2)
		EndIf
		Let strtmparray = (strtmpSeg1+
		cscColon+strtmpseg2)
		;Append with new item:
		If strItemsList then
			Let strItemsList = strItemsList+uoPipe
		EndIf
		;Add item to array.  If the first item,
		;no "|" in this go-round:
		Let strItemsList = (strItemsList+
		strtmpArray);
	EndIf
	Let iSegment = (iSegment+1);
EndWhile
If (strItemsList) then
	Let sCustomItems = cscNull;
	Let sCustomItems = strItemsList
EndIf
EndFunction


string Function InsertCustomNodesInBranch(string sOriginalBranch, string sNewNodes)
var
	string sBranchName,
	string sInsertableNodes
let sBranchName = StringSegment(sOriginalBranch,":"+uoPipe,2)
let sBranchName = StringChopRight(sBranchName,StringLength(StringSegment(sBranchName,NODE_PATH_DELIMITER,-1))+1)
let sInsertableNodes = sNewNodes
ConvertListToNodeList(sInsertableNodes,sBranchName)
return sInsertableNodes+sOriginalBranch
EndFunction

string Function UnknownItemHlp (optional int iRetCurVal)
var
	handle hWnd,
	int nItemBits,
	int bCursorSaved,
	string sReturnString
Let hWnd = GetFocus ()
If GetWindowSubtypeCode (hWnd) != WT_TREEVIEW then
	Let hWnd = FindWindow (GetRealWindow (hWnd), cwc_SysTreeView32)
	If ! hWnd then
		Return cscNULL
	EndIf
	Let bCursorSaved = TRUE
	SaveCursor ()
	InvisibleCursor ()
	MoveToWindow (hWnd)
	If ! (GetCharacterAttributes () & ATTRIB_HIGHLIGHT) then
		FindFirstAttribute (ATTRIB_HIGHLIGHT)
	EndIf
EndIf
Let nItemBits = GetControlAttributes ()
If bCursorSaved then
	RestoreCursor ()
EndIf
If ! (nItemBits & CTRL_HASCHILDREN) then;Child node, leaf level:
	let sReturnString = msgUO_UnknownItemHlp_ChildObject
	Return sReturnString
EndIf
If (nItemBits & CTRL_COLLAPSED) then;String for closed node with xxx items.
	Let sReturnString = msgUO_UnknownItemHlp_LeafCollapsed
	Return sReturnString
ElIf (nItemBits & CTRL_EXPANDED) then;Message to scroll down for options.
	Let sReturnString = msgUO_UnknownItemHlp_LeafExpanded
	Return sReturnString
EndIf
EndFunction

int function ShouldAddVirtualRibbonsOption()
return IsWindows7()
EndFunction

string function TreeCoreGetDefaultGeneralOptions()
var
	string sBranch
let sBranch =
	UO_VerbositySetLevel+uoPipe+
	uo_UseTandemConnectSounds+uoPipe
if ShouldAddVirtualRibbonsOption() then
	let sBranch = sBranch+UO_VirtualRibbonSupport+uoPipe
EndIf
let sBranch = sBranch+
	UO_ProgressBarSetAnnouncement+uoPipe+
	UO_TopAndBottomEdgeIndicate+uoPipe+
	UO_GraphicsShow+uoPipe+
	UO_ScreenEchoSet+uoPipe+
	UO_FocusLossAnnounce+uoPipe
ConvertListToNodeList(sBranch,NODE_GENERAL)
return sBranch
EndFunction

string function TreeCoreGetDefaultReadingOptions()
var
	string sBranch
Let sBranch =
	uo_TextAnalyzerToggle+uoPipe+
	UO_SmartWordReadingSet+uoPipe+
	UO_LanguageDetectChange+uoPipe+
	UO_CustomLabelsSet+uoPipe+
	UO_StopWordsExceptionDictionaryToggle+uoPipe
ConvertListToNodeList(sBranch,NODE_READING)
return sBranch
EndFunction

string function TreeCoreGetDefaultSayAllOptions()
var
	string sBranch
Let sBranch =
	UO_SayAllScheme+uoPipe+
	UO_SayAllReadsBy+uoPipe+
	UO_CapsIndicateDuringSayAll+uoPipe
ConvertListToNodeList(sBranch,NODE_SAYALL)
return sBranch
EndFunction

string function TreeCoreGetDefaultEditingOptions()
var
	string sBranch
Let sBranch =
	UO_TypingEchoSet+uoPipe+
	UO_CapsIndicate+uoPipe+
	UO_PunctuationSetLevel+uoPipe+
	UO_IndentationIndicate+uoPipe
ConvertListToNodeList(sBranch,NODE_EDITING)
return sBranch
EndFunction

string function TreeCoreGetDefaultSpellingOptions()
var
	string sBranch
Let sBranch =
	UO_SpellModeSet+uoPipe+
	UO_AlphaNumCombinations+uoPipe
ConvertListToNodeList(sBranch,NODE_SPELLING)
return sBranch
EndFunction

string function TreeCoreGetDefaultNumbersOptions()
var
	string sBranch
Let sBranch =
	UO_SpeakSingleDigitsThreshold+uoPipe+
	UO_SpeakSingleDigitsDashes +uoPipe
ConvertListToNodeList(sBranch,NODE_Numbers)
return sBranch
EndFunction

string Function TreeCoreGetDefaultOptions ()
return
	TreeCoreGetDefaultGeneralOptions()
	+TreeCoreGetDefaultReadingOptions()
	+TreeCoreGetDefaultSayAllOptions()
	+TreeCoreGetDefaultEditingOptions()
	+TreeCoreGetDefaultSpellingOptions()
	+TreeCoreGetDefaultNumbersOptions()
EndFunction

String Function TreeCoreGetDefaultVCursorTopLevelOptions()
var
	string sBranch
if HasVirtualEnhancedClipboard() then
	Let sBranch = UO_vCursorEnhancedClipboard+uoPipe
EndIf
let sBranch = sBranch+uoPipe+
	UO_vCursorReadOnlyState+uoPipe
ConvertListToNodeList(sBranch,NODE_VCURSOR)
return sBranch
EndFunction

String Function TreeCoreGetDefaultVCursorFormsOptions()
var
	string sBranch
Let sBranch =
	uo_vCursorAutoFormsMode+uoPipe+
	uo_vCursorIndicateFormsModeWithSounds+uoPipe+
	uo_vCursorNavQuickKeyDelay+uoPipe+
	UO_vCursorButtonsShowUsing+uoPipe+
	UO_vCursorFormFieldsIdentifyPromptUsing+uoPipe+
	UO_vCursorFormsModeAutoOff+uoPipe
ConvertListToNodeList(sBranch,NODE_VCURSOR+NODE_PATH_DELIMITER+NODE_VCURSOR_FORMS)
return sBranch
EndFunction

String Function TreeCoreGetDefaultVCursorGeneralOptions()
var
	string sBranch
Let sBranch =
	UO_NavigationQuickKeysSet+uoPipe+
	UO_DocumentPresentationSet+uoPipe+
	UO_vCursorCustomPageSummary+uoPipe+
	UO_vCursorAccessKeysShow+uoPipe+
	UO_vCursorAttributesIndicate+uoPipe+
	UO_vCursorFlashMoviesRecognize+uoPipe+
	UO_vCursorPageRefresh+uoPipe+
	UO_vCursorAnnounceLiveRegionUpdates+uoPipe+
	UO_vCursorScreenTrack+uoPipe
	if IsSayAllOnDocumentLoadSupported() then
		Let sBranch = uo_SayAllOnDocumentLoad+uoPipe+sBranch
	EndIf
ConvertListToNodeList(sBranch,NODE_VCURSOR+NODE_PATH_DELIMITER+NODE_GENERAL)
return sBranch
EndFunction

String Function TreeCoreGetDefaultVCursorTextOptions()
var
	string sBranch
Let sBranch =
	UO_vCursorAbbreviationsExpand+uoPipe+
	UO_vCursorAcronymsExpand+uoPipe+
	UO_vCursorRepeatedTextSkip+uoPipe+
	UO_vCursorBlockQuotesIdentifyStartAndEnd+uoPipe
ConvertListToNodeList(sBranch,NODE_VCURSOR+NODE_PATH_DELIMITER+NODE_VCURSOR_TEXT)
return sBranch
EndFunction

String Function TreeCoreGetDefaultVCursorGraphicsOptions()
var
	string sBranch
Let sBranch =
	UO_vCursorGraphicsShow+uoPipe+
	UO_vCursorGraphicsSetRecognition+uoPipe
ConvertListToNodeList(sBranch,NODE_VCURSOR+NODE_PATH_DELIMITER+NODE_VCURSOR_GRAPHICS)
return sBranch
EndFunction

String Function TreeCoreGetDefaultVCursorLinksOptions()
var
	string sBranch
Let sBranch =
	;UO_vCursorLinksIdentifyType+uoPipe+
	UO_vCursorFilterConsecutiveDuplicateLinks+uoPipe+
	UO_vCursorGraphicalLinksSet+uoPipe+
	UO_vCursorUntaggedGraphicalLinkShow+uoPipe+
	UO_vCursorImageMapLinksShow+uoPipe+
	UO_vCursorTextLinksShow+uoPipe+
	UO_vCursorLinksIdentifyType+uoPipe+
	UO_vCursorLinksIdentifySamePage+uoPipe
ConvertListToNodeList(sBranch,NODE_VCURSOR+NODE_PATH_DELIMITER+NODE_VCURSOR_LINKS)
return sBranch
EndFunction

String Function TreeCoreGetDefaultVCursorHeadingAndFrameOptions()
var
	string sBranch
Let sBranch =
	UO_vCursorHeadingsAnnounce+uoPipe+
	UO_vCursorFramesShowStartAndEnd+uoPipe+
	UO_vCursorInlineFramesShow+uoPipe
ConvertListToNodeList(sBranch,NODE_VCURSOR+NODE_PATH_DELIMITER+NODE_VCURSOR_HEADINGS_FRAMES)
return sBranch
EndFunction

String Function TreeCoreGetDefaultVCursorListAndTableOptions()
var
	string sBranch
Let sBranch =
	UO_vCursorListsIdentifyStartAndEnd+uoPipe+
	UO_vCursorTablesShowStartAndEnd+uoPipe+
	UO_vCursorLayoutTables+uoPipe+
	UO_vCursorTableTitlesAnnounce+uoPipe+
	UO_vCursorCellCoordinatesAnnouncement+uoPipe
ConvertListToNodeList(sBranch,NODE_VCURSOR+NODE_PATH_DELIMITER+NODE_VCURSOR_LISTS_TABLES)
return sBranch
EndFunction

String Function TreeCoreGetDefaultVCursorOptions ()
return
	TreeCoreGetDefaultVCursorTopLevelOptions()
	+TreeCoreGetDefaultVCursorFormsOptions()
	+TreeCoreGetDefaultVCursorGeneralOptions()
	+TreeCoreGetDefaultVCursorTextOptions()
	+TreeCoreGetDefaultVCursorGraphicsOptions()
	+TreeCoreGetDefaultVCursorLinksOptions()
	+TreeCoreGetDefaultVCursorHeadingAndFrameOptions()
	+TreeCoreGetDefaultVCursorListAndTableOptions()
EndFunction

string Function TreeCoreGetDefaultBrailleMarkingList()
;Nodeless marking list.
return
	UO_MarkHighlight+uoPipe+
	UO_MarkBold+uoPipe+
	UO_MarkUnderline+uoPipe+
	UO_MarkItalic+uoPipe+
	UO_MarkStrikeOut+uoPipe+
	UO_MarkColor+uoPipe+
	UO_MarkScript
EndFunction

void Function ShowBrailleMarkingOptions()
var
	string sOptions
If InHjDialog() then
	PerformScript RunJAWSManager();Let defaults speak message
	Return
EndIf
let sOptions = TreeCoreGetDefaultBrailleMarkingList()
ConvertListToNodeList(sOptions,cscNull)
DlgSelectTreeFunctionToRun (sOptions, cStrBrailleDlgName, false)
EndFunction

String Function TreeCoreGetDefaultBrailleOptions (optional int DiscardRootNode)
Var
	string sBranchLeaves,
	string sBranchName,
	string sRootName,
	String cStrBrailleList
if !DiscardRootNode then
	let sRootName = NODE_BRL_+NODE_PATH_DELIMITER
EndIf
;Default Option at top:
	Let sBranchName = sRootName
	Let sBranchLeaves =
		UO_ActiveModeOption+uoPipe
	ConvertListToNodeList(sBranchLeaves, sBranchName)
	Let cStrBrailleList = cStrBrailleList+sBranchLeaves;
;Grade 2 Output Options:
	Let sBranchName = sRootName+NODE_BRL_G2
	Let sBranchLeaves =
		UO_GradeTwoModeOption+uoPipe+
		uo_Grade2Rules+uoPipe+
		UO_CurrentWordExpand+uoPipe+
		UO_G2CapsSuppress+uoPipe
	ConvertListToNodeList(sBranchLeaves, sBranchName)
	Let cStrBrailleList = cStrBrailleList+sBranchLeaves;
;Cursor Options:
	Let sBranchName = sRootName+NODE_BRL_CURSOR
	Let sBranchLeaves =
		UO_ActiveFollowsBraille+uoPipe+
		UO_BrailleFollowsActive+uoPipe
	ConvertListToNodeList(sBranchLeaves, sBranchName)
	Let cStrBrailleList = cStrBrailleList+sBranchLeaves;
;Panning Options:
	Let sBranchName = sRootName+NODE_BRL_PANNING
	Let sBranchLeaves =
		UO_PanBy+uoPipe+
		UO_WordWrap+uoPipe+
		UO_AutoPan+uoPipe
	ConvertListToNodeList(sBranchLeaves, sBranchName)
	Let cStrBrailleList = cStrBrailleList+sBranchLeaves;
;Levl0 items, general:
	Let sBranchName = sRootName
	Let sBranchLeaves =
		UO_EightDotBraille+uoPipe+
		UO_BrailleMarking+uoPipe
	ConvertListToNodeList(sBranchLeaves, sBranchName)
	Let cStrBrailleList = cStrBrailleList+sBranchLeaves;
;Braille Marking Options:
	Let sBranchName = sRootName+NODE_BRL_MARKING
	Let sBranchLeaves = TreeCoreGetDefaultBrailleMarkingList()+uoPipe
	ConvertListToNodeList(sBranchLeaves, sBranchName)
	Let cStrBrailleList = cStrBrailleList+sBranchLeaves
;Table Options for Braille:
	Let sBranchName = sRootName+NODE_BRL_TABLE
	Let sBranchLeaves =
		UO_BrailleZoom+uoPipe+
		UO_BrailleShowHeaders+uoPipe+
		UO_BrailleShowCoords+uoPipe
	ConvertListToNodeList(sBranchLeaves, sBranchName)
	Let cStrBrailleList = cStrBrailleList+sBranchLeaves
;Final level 0 items, don't relate to any of the categories:
	Let sBranchName = sRootName
	Let sBranchLeaves =
		UO_FlashMessages+uoPipe+
		UO_BrailleKeysInterruptSpech+uoPipe+
		;UO_BrailleTypeKeysModeOption+uoPipe+
		uo_BrailleStudyMode+uoPipe
	ConvertListToNodeList(sBranchLeaves, sBranchName)
	Let cStrBrailleList = cStrBrailleList+sBranchLeaves
return cStrBrailleList
EndFunction

;Main:
void function OptionsTreeCorePreProcess()
;used to perform any actions which must be done before displaying the options tree.
let uogbShouldShowContractedBrailleInputOption = IsContractedBrailleInputSupported()
EndFunction

void function OptionsTreeCorePostProcess()
;used to perform any actions which must be done after displaying the options tree.
EndFunction

void Function OptionsTreeCore (string sCustomItems,optional  int iRetNodeSettings, string strNewNode)
var
	string synthName,
	string synthLongName,
	string synthDriverName,
	String strList,
	int i
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
if GetActiveSynthInfo (synthName, synthLongName, synthDriverName) then
	if IsSpeechOff () then
		SpeechOn()
		SayMessage(OT_STATUS, cmsg204_L) ;Speech On
		return
	endIf
endIf
OptionsTreeCorePreProcess()
If ! (iRetNodeSettings) then
	;Update string with node path items, inserting node structure for items without it:
	AddCustomNodes (sCustomItems, strNewNode)
EndIf
Let strList = sCustomItems  ; app-specific stuff from the caller
If IsSkypeActive () then
	Let strList = strList + uoPipe + TreeCoreGetDefaultSkypeOptions ()
EndIf
;Check Virtual Cursor Options before a user buffer was active, e.g. before user pushed insert h.
If UserBufferOverVirtualDocument ()
|| IsFormsModeActive()
|| (isVirtualPcCursor () && ! UserBufferIsActive ()) Then;Forms Mode means we need to keep track of virtual stuff as well.
	UpdateVirtualGlobals ()
	let strList = strList + uoPipe + TreeCoreGetDefaultVCursorOptions ()
endIf
Let strList = strList + uoPipe + TreeCoreGetDefaultOptions ()
If (BrailleInUse ()) then
	Let strList = (strList + uoPipe + TreeCoreGetDefaultBrailleOptions (0))
EndIf
Let strList = strList +uoPipe + UO_SynthesizerMute
;Cleanup:
While (I < 5 && StringContains (strList,uoPipe+uoPipe))
	Let strList = (StringReplaceSubstrings (
	strList, uoPipe+uoPipe, uoPipe))
	Let i = (i+1)
EndWhile
If (StringLeft (strList,1) == uoPipe) then
	Let strList = (StringRight (strList,
		StringLength(strList)-1))
EndIf
CleanupNodePathStrings (strList)
DlgSelectTreeFunctionToRun (strList, WN_ADJUST_JAWS_OPTIONS, false)
OptionsTreeCorePostProcess()
EndFunction

;Callback functions:
;Each callback is succeeded by its callback help equivalent.

string function VerbositySetLevel (int iRetCurVal)
Var
	int iVerbosity
if ! iRetCurVal then
	VerbosityLevel ()
endIf
return VerbositySetLevelTextOutput(GetVerbosity ())
EndFunction

string function UseTandemConnectSounds(int iRetCurVal)
var
	int iSetting
if GlobalTandemMode ==Tandem_Mode_Connected then
	return msgUO_Unavailable
EndIf
let iSetting = GetDefaultJCFOption(OPT_USE_SOUNDS_TO_INDICATE_TANDEM)
if !iRetCurVal then
	let iSetting = !iSetting
	SetDefaultJCFOption(OPT_USE_SOUNDS_TO_INDICATE_TANDEM,iSetting)
	IniWriteInteger(section_tandem,hKey_IndicateTandemConnectionWithSounds,iSetting,file_default_jcf,true)
endIf
return UseTandemConnectSoundsTextOutput(iSetting)
EndFunction

string function ToggleVirtualRibbons(int iRetCurVal)
Var
	Int iSetting
let iSetting = GetJCFOption(OPT_VIRTUAL_RIBBON_SUPPORT)
if !iRetCurVal then
	let iSetting = !iSetting
	SetDefaultJcfOption(OPT_VIRTUAL_RIBBON_SUPPORT,iSetting)
	IniWriteInteger(section_Options,hKey_VirtualRibbonSupport,iSetting,file_default_jcf,true)
endIf
return ToggleVirtualRibbonsTextOutput(iSetting)
EndFunction

string function TextAnalyzerToggle(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption(OPT_TEXT_ANALYSER)
If !iRetCurVal then
	if iSetting == TextAnalyserDescribeAllInconsistencies then
		let iSetting = TextAnalyserOff
	else
		let iSetting = iSetting+1
	EndIf
	SetJcfOption(OPT_TEXT_ANALYSER,iSetting)
EndIf
return TextAnalyzerToggleTextOutput(iSetting)
EndFunction

string function SmartWordReadingSet(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption(OPT_SMART_WORD_READING)
If !iRetCurVal then
	Let iSetting = !iSetting
	SetJcfOption(OPT_SMART_WORD_READING,iSetting)
EndIf
return SmartWordReadingSetTextOutput(iSetting)
EndFunction

string Function SpellModeSet(int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (OPT_SPELL_PHONETIC)
If ! iRetCurVal then
	Let iOption = (! iOption)
	SetJcfOption (OPT_SPELL_PHONETIC, iOption)
EndIf
return SpellModeSetTextOutput(iOption)
EndFunction

string function AlphaNumCombinations (int iRetCurVal)
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
return AlphaNumCombinationsTextOutput(iSetting)
EndFunction

string function SpeakSingleDigitsThreshold(int iRetCurVal)
Var
	Int iSetting
let iSetting = GetJCFOption(OPT_SINGLE_DIGIT_THRESHOLD)
if !iRetCurVal then
	if iSetting == 0 Then
		let iSetting = 5
	elif iSetting == 8 Then
		let iSetting = 0
	else
		let iSetting = iSetting+1
	endIf
	SetJcfOption(OPT_SINGLE_DIGIT_THRESHOLD,iSetting)
endIf
return SpeakSingleDigitsThresholdTextOutput(iSetting)
EndFunction

string function SpeakSingleDigitsDashes(int iRetCurVal)
Var
	Int iSetting
let iSetting = GetJCFOption(OPT_SINGLE_DIGIT_Dashes)
if !iRetCurVal then
	let iSetting = !iSetting
	SetJcfOption(OPT_SINGLE_DIGIT_Dashes,iSetting)
endIf
return SpeakSingleDigitsDashesTextOutput(iSetting)
EndFunction

string function ProgressBarSetAnnouncement (int iRetCurVal)
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
return ProgressBarSetAnnouncementTextOutput(iProgressBarAnnounce)
EndFunction

string function TypingEchoSet (int iRetCurVal)
Var
	Int iEcho
let iEcho =GetJCFOption (opt_typing_Echo)
if not iRetCurVal then
	If (iEcho == 3) Then
		let iEcho=0
	Else
		let iEcho=iEcho+1
	endIf
	SetJcfOption (Opt_Typing_Echo, iEcho)
endIf
return TypingEchoSetTextOutput(iEcho)
EndFunction

string function ScreenEchoSet (int iRetCurVal)
if not iRetCurVal then
	ScreenEcho()
endIf
return ScreenEchoSetTextOutput(GetScreenEcho())
EndFunction

string function GraphicsShow (int iRetCurVal)
var
	int iMode
let iMode= GetJCFOption (OPT_INCLUDE_GRAPHICS)
if not iRetCurVal then
	If iMode== 2 Then
		let iMode=0
	else
		let iMode=iMode+1
	endIf
	SetJcfOption (OPT_INCLUDE_GRAPHICS, iMode)
endIf
return GraphicsShowTextOutput(iMode)
EndFunction

string function CustomLabelsSet(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption(OPT_USE_CUSTOM_LABELS)
If !iRetCurVal then
	Let iSetting = !iSetting
	SetJcfOption(OPT_USE_CUSTOM_LABELS,iSetting)
EndIf
return CustomLabelsSetTextOutput(iSetting)
EndFunction

string function StopWordsExceptionDictionaryToggle(int iRetCurVal)
var
	int iSetting,
	string JCFFileName
Let iSetting = GetJcfOption(OPT_WORDINDEX_STOPWORDS)
If !iRetCurVal then
	Let iSetting = !iSetting
	SetJcfOption(OPT_WORDINDEX_STOPWORDS,iSetting)
	let jcfFileName = StringChopRight(GetScriptFilename(true),3)+jcfFileExt
	IniWriteInteger(SECTION_OPTIONS,hKey_WordIndexStopwords,iSetting,jcfFileName)
EndIf
return StopWordsExceptionDictionaryToggleTextOutput(iSetting)
EndFunction

string function TopAndBottomEdgeIndicate (int iRetCurVal)
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
return TopAndBottomEdgeIndicateTextOutput(bOpt)
EndFunction

string Function LanguageDetectChange (int iRetCurVal)
var
	int iOption
Let iOption = GetJCFOption (OPT_LANGUAGE_DETECTION)
If ! iRetCurVal then
	Let iOption = ! iOption;Toggle
	SetJCFOption (OPT_LANGUAGE_DETECTION, iOption)
EndIf
return LanguageDetectChangeTextOutput(iOption)
EndFunction

string function UoSayAllScheme(int iRetCurVal)
var
	string sScheme,
	int iSchemeChoice,
	string sConfigFile
InitUOSayAllSchemesData()
let sScheme = GetCurrentSayAllScheme()
if !iRetCurVal then
	let GDocumentSayAllScheme = cscNull ;allow the application scheme to toggle
	if sScheme
	&& sScheme != uoSayAllSchemeNoChange then
		let iSchemeChoice = GetSchemePositionInUOSayAllSchemesData(sScheme)
	EndIf
	if iSchemeChoice == uoSayAllSchemeCount then
		let sScheme = uoSayAllSchemeNoChange
	else
		let iSchemeChoice = iSchemeChoice+1
		let sScheme = GetSchemeFileNameInUOSayAllSchemesData(iSchemeChoice)
	EndIf
	let sConfigFile = GetActiveConfiguration()+cScPeriod+jcfFileExt
	IniWriteString(section_options,hKey_SayAllScheme, sScheme, sConfigFile, true)
endIf
return UoSayAllSchemeTextOutput(sScheme)
EndFunction

string function SayAllReadsBy (int iRetCurVal)
var
	int iSayAllMode,
	int iLinePause
let iSayAllMode=getJCFOption(OPT_SAY_ALL_MODE)
let iLinePause=getJCFOption(OPT_LINE_PAUSES)
if not iRetCurVal then
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
return SayAllReadsByTextOutput(iSayAllMode,iLinePause)
EndFunction

string function CapsIndicateDuringSayAll (int iRetCurVal)
var
	int iSayAllIndicateCaps
let iSayAllIndicateCaps=getJCFOption(OPT_SAY_ALL_INDICATE_CAPS)
if not iRetCurVal then
	If iSayAllIndicateCaps==1 then
		let iSayAllIndicateCaps=0
	else
		let iSayAllIndicateCaps=1
	EndIf
	SetJcfOption(OPT_SAY_ALL_INDICATE_CAPS, iSayAllIndicateCaps)
EndIf
return CapsIndicateDuringSayAllTextOutput(iSayAllIndicateCaps)
EndFunction

string function CapsIndicate (int iRetCurVal)
var
	int iIndicateCaps
let iIndicateCaps=getJCFOption(OPT_INDICATE_CAPS)
if not iRetCurVal then
	If iIndicateCaps==3 then
		let iIndicateCaps=0
	else
		let iIndicateCaps=iIndicateCaps+1
	EndIf
	SetJcfOption(OPT_INDICATE_CAPS, iIndicateCaps)
EndIf
return CapsIndicateTextOutput(iIndicateCaps)
EndFunction

string function PunctuationSetLevel (int iRetCurVal)
var
	int nPunctuationLevel
let nPunctuationLevel = GetJCFOption (opt_punctuation)
if not iRetCurVal then
	If (nPunctuationLevel == 3) then
		let nPunctuationLevel=0
	Else
		let nPunctuationLevel=nPunctuationLevel+1
	endIf
	SetJCFOption (opt_punctuation, nPunctuationLevel )
endIf
return PunctuationSetLevelTextOutput(nPunctuationLevel)
EndFunction

string function IndentationIndicate (int iRetCurVal)
var
	int iIndicateIndentation
let iIndicateIndentation=getJCFOption(OPT_INDICATE_INDENTATION)
if not iRetCurVal then
	let iIndicateIndentation=!iIndicateIndentation
	SetJcfOption(OPT_INDICATE_INDENTATION, iIndicateIndentation)
EndIf
return IndentationIndicateTextOutput(iIndicateIndentation)
EndFunction

string function SynthesizerMute(int iRetCurVal)
if not iRetCurVal then
	if (IsSpeechOff ()) then
		SpeechOn()
	else
		SpeechOff()
	endIf
endIf
return SynthesizerMuteTextOutput(IsSpeechOff ())
EndFunction

string function ToggleSayAllOnDocumentLoad(int iRetCurVal)
If !iRetCurVal then
	let gbDefaultSayAllOnDocumentLoad = !gbDefaultSayAllOnDocumentLoad
	if GetRunningFSProducts() & product_Fusion
		IniWriteInteger(sVirtualOptions, hKey_SayAllOnDocumentLoadFusion, gbDefaultSayAllOnDocumentLoad, JSIFileName_Virtual, true)
	else
		IniWriteInteger(sVirtualOptions, hKey_SayAllOnDocumentLoad, gbDefaultSayAllOnDocumentLoad, JSIFileName_Virtual, true)
	endIf
EndIf
if gbDefaultSayAllOnDocumentLoad then
	return cmsg_on
else
	return cmsg_off
EndIf
EndFunction

string Function NavigationQuickKeysSet (int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (opt_quick_key_navigation_mode)
If ! iRetCurVal then
	If iOption == 1 then
		Let iOption = 0
	ElIf iOption == 0 then;Special case
		Let iOption = 2
	ElIf iOption == 2 then
		Let iOption = 1
	EndIf
EndIf
SetJcfOption (opt_quick_key_navigation_mode,iOption)
return NavigationQuickKeysSetTextOutput(iOption)
EndFunction

string Function DocumentPresentationSet(int iRetCurVal)
var
	int iSetting
if IsMAGicRunning() then
	return msgUO_Unavailable
EndIf
Let iSetting = GetJcfOption(optHTMLDocumentPresentationMode)
If ! iRetCurVal then
	Let iSetting = ! iSetting
	SetJcfOption(optHTMLDocumentPresentationMode, iSetting)
EndIf
return DocumentPresentationSetTextOutput(iSetting)
EndFunction

string function vCursorGraphicsShow(int iRetCurVal)
var
	int iGraphicsLevel
let iGraphicsLevel = GetJCFOption (optIncludeGraphics)
if not iRetCurVal then
	If iGraphicsLevel == 2 then
		let iGraphicsLevel=0
	Else
		let iGraphicsLevel=iGraphicsLevel+1
	endIf
	SetJCFOption (optIncludeGraphics, iGraphicsLevel)
endIf
return vCursorGraphicsShowTextOutput(iGraphicsLevel)
EndFunction

string function vCursorGraphicsSetRecognition(int iRetCurVal)
var
	int iVerbosity
let iVerbosity  = GetJCFOption (optGraphicRendering)
if not iRetCurVal then
	If iVerbosity == 4 then
		let iVerbosity=0
	else
		let iVerbosity=iVerbosity+1
	endIf
	SetJCFOption (optGraphicRendering, iVerbosity)
endIf
return vCursorGraphicsSetRecognitionTextOutput(iVerbosity)
EndFunction

string function VCursorFilterConsecutiveDuplicateLinks(int iRetCurVal)
var
	int iSetting
let iSetting = GetJCFOption (optFilterConsecutiveDuplicateLinks)
if !iRetCurVal then
	let iSetting = !iSetting
	SetJCFOption(optFilterConsecutiveDuplicateLinks,iSetting)
endIf
return VCursorFilterConsecutiveDuplicateLinksTextOutput(iSetting)
EndFunction

string function vCursorGraphicalLinksSet(int iRetCurVal)
var
	int iLinksLevel
let iLinksLevel = GetJCFOption (optIncludeGraphicLinks)
if not iRetCurVal then
	If (iLinksLevel == 2) then
		let iLinksLevel=0
	Else
		let iLinksLevel=iLinksLevel+1
	endIf
	SetJCFOption (optIncludeGraphicLinks, iLinksLevel)
endIf
return vCursorGraphicalLinksSetTextOutput(iLinksLevel)
EndFunction

string Function vCursorUntaggedGraphicalLinkShow(int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optGraphicalLinkLastResort)
if not iRetCurVal then
	Let iOption = (! iOption)
	SetJcfOption (optGraphicalLinkLastResort, iOption)
EndIf
return vCursorUntaggedGraphicalLinkShowTextOutput(iOption)
EndFunction

string function vCursorImageMapLinksShow(int iRetCurVal)
var
	int iImageMapLevel
let iImageMapLevel = GetJCFOption (optIncludeImageMapLinks)
if not iRetCurVal then
	If (iImageMapLevel == 2) then
		let iImageMapLevel =0
	Else
		let iImageMapLevel =iImageMapLevel +1
	endIf
	SetJCFOption (optIncludeImageMapLinks, iImageMapLevel)
endIf
return vCursorImageMapLinksShowTextOutput(iImageMapLevel)
EndFunction

string function vCursorTextLinksShow(int iRetCurVal)
var
	int iLinkVerbosity
let iLinkVerbosity  = GetJCFOption (optLinkText)
if not iRetCurVal then
	If iLinkVerbosity == 4 then
		let iLinkVerbosity=0
	else
		let iLinkVerbosity=iLinkVerbosity+1
	endIf
	SetJCFOption (optLinkText, iLinkVerbosity)
endIf
return vCursorTextLinksShowTextOutput(iLinkVerbosity)
EndFunction

string function vCursorLinksIdentifyType(int iRetCurVal)
var
	int iAnnounceLinkType
let iAnnounceLinkType = GetJCFOption (optIdentifyLinkType)
if not iRetCurVal then
	let iAnnounceLinkType =not iAnnounceLinkType
	SetJCFOption (optIdentifyLinkType, iAnnounceLinkType)
endIf
return vCursorLinksIdentifyTypeTextOutput(iAnnounceLinkType)
EndFunction

string function vCursorLinksIdentifySamePage(int iRetCurVal)
var
	int iSamePage
let iSamePage = GetJCFOption (optIdentifySamePageLinks)
if not iRetCurVal then
	let iSamePage=not iSamePage
	SetJCFOption (optIdentifySamePageLinks, iSamePage)
endIf
return vCursorLinksIdentifySamePageTextOutput(iSamePage)
EndFunction

string function vCursorButtonsShowUsing  (int iRetCurVal)
var
	int iButtonText
let iButtonText= GetJCFOption (optButtonText)
if not iRetCurVal then
	If iButtonText== 5 then
		let iButtonText=0
	else
		let iButtonText=iButtonText+1
	endIf
	SetJCFOption (optButtonText, iButtonText)
endIf
return vCursorButtonsShowUsingTextOutput(iButtonText)
EndFunction

string function vCursorAbbreviationsExpand(int iRetCurVal)
var
	int iExpandAbbreviations
let iExpandAbbreviations=getJCFOption(optExpandAbbreviations)
if ! iRetCurVal then
	let iExpandAbbreviations=!iExpandAbbreviations
	SetJcfOption(optExpandAbbreviations, iExpandAbbreviations)
EndIf
return vCursorAbbreviationsExpandTextOutput(iExpandAbbreviations)
EndFunction

string function vCursorAcronymsExpand(int iRetCurVal)
var
	int iExpandAcronyms
let iExpandAcronyms =getJCFOption(optExpandAcronyms)
if ! iRetCurVal then
	let iExpandAcronyms = !iExpandAcronyms
	SetJcfOption(optExpandAcronyms, iExpandAcronyms)
EndIf
return vCursorAcronymsExpandTextOutput(iExpandAcronyms)
EndFunction

string function vCursorFormFieldsIdentifyPromptUsing(int iRetCurVal)
;0 favor label tag, 1 favor title attribute, 2 favor alt attribute, 3 favor longest,
;4 use both label and title (if different), 5 use both label and alt (if different)
var
	int iOption
Let iOption = GetJcfOption (optFormFieldPrompts)
If ! iRetCurVal then
	If iOption == 5 then
		Let iOption = 0
	Else
		Let iOption = iOption + 1
	EndIf
	SetJcfOption (optFormFieldPrompts, iOption)
EndIf
return vCursorFormFieldsIdentifyPromptUsingTextOutput(iOption)
EndFunction

string function vCursorFramesShowStartAndEnd(int iRetCurVal)
var
	int iFrameIdentify
let iFrameIdentify = GetJCFOption (optFrameIndication)
if not iRetCurVal then
	let iFrameIdentify=!iFrameIdentify
	SetJCFOption (optFrameIndication, iFrameIdentify)
endIf
return vCursorFramesShowStartAndEndTextOutput(iFrameIdentify)
EndFunction

string function vCursorInlineFramesShow(int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optIgnoreInlineFrames)
If ! iRetCurVal then
	Let iOption = (! iOption)
	SetJcfOption (optIgnoreInlineFrames,iOption)
EndIf
return vCursorInlineFramesShowTextOutput(iOption)
EndFunction

string function vCursorScreenTrack(int iRetCurVal)
var
	int iScreenFollowsVCursor
let iScreenFollowsVCursor = GetJCFOption (optScreenFollowsVCursor)
if not iRetCurVal then
	let iScreenFollowsVCursor =not iScreenFollowsVCursor
	SetJCFOption (optScreenFollowsVCursor, iScreenFollowsVCursor)
endIf
return vCursorScreenTrackTextOutput(iScreenFollowsVCursor )
EndFunction

string function vCursorRepeatedTextSkip(int iRetCurVal)
var
	int iSkipRepeatedText
let iSkipRepeatedText = GetJCFOption (optSkipPastRpeatedText)
if not iRetCurVal then
	let iSkipRepeatedText =not iSkipRepeatedText
	SetJCFOption (optSkipPastRpeatedText, iSkipRepeatedText )
endIf
return vCursorRepeatedTextSkipTextOutput(iSkipRepeatedText)
EndFunction

string function vCursorBlockQuotesIdentifyStartAndEnd(int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optBlockQuoteIndication)
If ! iRetCurVal then
	Let iOption = (! iOption)
	SetJcfOption (optBlockQuoteIndication,iOption)
EndIf
return vCursorBlockQuotesIdentifyStartAndEndTextOutput(iOption)
EndFunction

string function vCursorListsIdentifyStartAndEnd(int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optListIndication)
If ! iRetCurVal then
	Let iOption = (! iOption)
	SetJcfOption (optListIndication,iOption)
EndIf
return vCursorListsIdentifyStartAndEndTextOutput(iOption)
EndFunction

string function vCursorAccessKeysShow(int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optElementAccessKeys)
If ! iRetCurVal then
	Let iOption = (! iOption)
	SetJcfOption (optElementAccessKeys,iOption)
EndIf
return vCursorAccessKeysShowTextOutput(iOption)
EndFunction

string Function vCursorAttributesIndicate(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption (optIndicateElementAttributes)
If ! iRetCurVal then
	Let iSetting = ! iSetting
	SetJcfOption (optIndicateElementAttributes, iSetting)
EndIf
return vCursorAttributesIndicateTextOutput(iSetting)
EndFunction

String Function vCursorTablesShowStartAndEnd(int iRetCurVal)
var
	int iTables
Let iTables = GetJCFOption (optTableIndication)
If !iRetCurVal then
	Let iTables = (! iTables)
	SetJcfOption (optTableIndication, iTables)
EndIf
return vCursorTablesShowStartAndEndTextOutput(iTables)
EndFunction

String Function vCursorLayoutTables  (int iRetCurVal)
var
	int iTables
If ! GetJCFOption (optTableIndication) then
	Return cMsgNotAvailable
EndIf
Let iTables = GetJCFOption (optTableDetection)
If ! iRetCurVal then
	Let iTables = (! iTables)
	SetJcfOption (optTableDetection, iTables)
EndIf
return vCursorLayoutTablesTextOutput(iTables)
EndFunction

string Function vCursorTableTitlesAnnounce (int iRetCurVal)
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
;'Prev' global serves as placeholder for this setting.
;Since it's not a real JCF, Custom Settings can lose the default without this 'prev':
return vCursorTableTitlesAnnounceTextOutput(GITblHeaders)
EndFunction

string function VCursorCellCoordinatesAnnouncement(int iRetCurVal)
if !iRetCurVal then
	let gbDefaultVCursorCellCoordinatesAnnouncement = !gbDefaultVCursorCellCoordinatesAnnouncement
	IniWriteInteger(sVirtualOptions, hKey_VCursorCellCoordinatesAnnouncement, gbDefaultVCursorCellCoordinatesAnnouncement, JSIFileName_Virtual, true)
EndIf
return VCursorCellCoordinatesAnnouncementTextOutput(gbDefaultVCursorCellCoordinatesAnnouncement)
EndFunction

string function vCursorHeadingsAnnounce(int iRetCurVal)
var
	int iIndicateHeadings
let iIndicateHeadings= GetJCFOption (optHeadingIndication)
if not iRetCurVal then
	if (iIndicateHeadings==2) then
		let iIndicateHeadings=0
	else
		let iIndicateHeadings=iIndicateHeadings+1
	endIf
	SetJCFOption (optHeadingIndication, iIndicateHeadings)
endIf
return vCursorHeadingsAnnounceTextOutput(iIndicateHeadings)
EndFunction

string Function vCursorEnhancedClipboard(int iRetCurVal)
var
	int iSetting,
	string jcfFileName
Let iSetting = GetJcfOption(OPT_VPC_ENHANCED_CLIPBOARD)
If !iRetCurVal then
	let iSetting = !iSetting
	SetJCFOption (OPT_VPC_ENHANCED_CLIPBOARD, iSetting)
	let jcfFileName = StringChopRight(GetScriptFilename(true),3)+jcfFileExt
	IniWriteInteger(SECTION_OSM,hKey_VPCENHANCEDCLIPBOARD,iSetting,jcfFileName,true)
EndIf
return vCursorEnhancedClipboardTextOutput(iSetting)
EndFunction

string Function vCursorAutoFormsMode(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption(OPT_AUTO_FORMS_MODE)
If !iRetCurVal then
	Let iSetting = !iSetting
	SetDefaultJCFOption(OPT_AUTO_FORMS_MODE, iSetting)
	IniWriteInteger(SECTION_FormsMode,hKey_AutoFormsMode,iSetting,file_default_jcf,true)
EndIf
return vCursorAutoFormsModeTextOutput(iSetting)
EndFunction

string Function vCursorIndicateFormsModeWithSounds(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption(OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE)
If !iRetCurVal then
	Let iSetting = !iSetting
	SetDefaultJCFOption(OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE,iSetting)
	IniWriteInteger(SECTION_FormsMode,hKey_IndicateFormsModeWithSounds,iSetting,file_default_jcf,true)
EndIf
return vCursorIndicateFormsModeWithSoundsTextOutput(iSetting)
EndFunction

string function vCursorNavQuickKeyDelay(int iRetCurVal)
var
	int iAutoFormsModeSetting,
	int iThresholdSetting,
	int iWhole,
	int iFraction
Let iAutoFormsModeSetting = GetJcfOption(OPT_AUTO_FORMS_MODE)
let iThresholdSetting = GetJcfOption(OPT_AUTOFORMSMODE_THRESHOLD)

If !iRetCurVal then
	if iAutoFormsModeSetting then
		if iThresholdSetting == 5000 then
			let iThresholdSetting = -1
		ElIf iThresholdSetting == -1 then
			let iThresholdSetting = 500
		ElIf iThresholdSetting >= 500 && iThresholdSetting < 2000 then
			let iThresholdSetting = iThresholdSetting+500
		else
			let iThresholdSetting = iThresholdSetting+1000
		EndIf
		SetDefaultJCFOption(OPT_AUTOFORMSMODE_THRESHOLD, iThresholdSetting)
		IniWriteInteger(SECTION_FormsMode,hKey_AutoFormsModeThreshold,iThresholdSetting,file_default_jcf,true)
	EndIf
EndIf
return vCursorNavQuickKeyDelayTextOutput(iThresholdSetting,iAutoFormsModeSetting)
EndFunction

string Function FlashMoviesRecognize(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption (optEmbeddedActiveXSupport)
If ! iRetCurVal then
	Let iSetting = ! iSetting
	SetJcfOption (optEmbeddedActiveXSupport, iSetting)
EndIf
return FlashMoviesRecognizeTextOutput(iSetting)
EndFunction

string Function PageRefresh(int iRetCurVal)
;Settings to retrieve are off, automatically or the number of milliseconds for refresh rates.
Return HandleRefresh (iRetCurVal, optPageRefreshFilter)
EndFunction

string Function AnnounceLiveRegionUpdates (int iRetCurVal)
var
	int iSetting
let iSetting = GetJCFOption( optAnnounceLiveRegionUpdates )
if !iRetCurVal then
	let iSetting = !iSetting
	SetJCFOption(optAnnounceLiveRegionUpdates,iSetting)
EndIf
return AnnounceLiveRegionUpdatesTextOutput(iSetting)
EndFunction

string function vCursorFormsModeAutoOff(int iRetCurVal)
var
	int iFormsModeAutoOffOption,
	int iAutoFormsModeSetting
Let iAutoFormsModeSetting = GetJcfOption(OPT_AUTO_FORMS_MODE)
Let iFormsModeAutoOffOption = GetJcfOption (optFormsModeAutoOff)
If !iRetCurVal then
	if !iAutoFormsModeSetting then
		Let iFormsModeAutoOffOption = !iFormsModeAutoOffOption
		SetJcfOption(optFormsModeAutoOff,iFormsModeAutoOffOption)
	EndIf
EndIf
return vCursorFormsModeAutoOffTextOutput(iAutoFormsModeSetting,iFormsModeAutoOffOption)
EndFunction

string function vCursorCustomPageSummary (int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (OPT_CUSTOM_PAGE_SUMMARY)
If ! iRetCurVal then
	if iOption < CPSVirtualize then
		let iOption=iOption+1
	else
		let iOption=CPSOff
	endIf
	SetJcfOption (OPT_CUSTOM_PAGE_SUMMARY,iOption)
EndIf
If iOption==CPSOff then
	Return msgUO_off
elif iOption==CPSSpeak then
	return msgUOSummarySpeak
else
	Return msgUO_CustomSummaryShowVCursor
EndIf
EndFunction

string Function vCursorReadOnlyState(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption (OPT_SUPPRESS_READ_ONLY_STATE_INDICATION)
If !iRetCurVal then
	Let iSetting = ! iSetting
	SetJcfOption (OPT_SUPPRESS_READ_ONLY_STATE_INDICATION, iSetting)
EndIf
return vCursorReadOnlyStateTextOutput(iSetting)
EndFunction

string function UOToggleFocusLossAnnounce (int iRetCurVal)
var
	int iSetting
let iSetting = GetDefaultJCFOption (OPT_FOCUS_LOSS_ANNOUNCE)
if !iRetCurVal then
	let iSetting = ! iSetting
	SetDefaultJCFOption (OPT_FOCUS_LOSS_ANNOUNCE, iSetting)
	IniWriteInteger (section_options, hKey_AnnounceFocusLoss, iSetting, DefaultJCFFile)
EndIf
return UOToggleFocusLossAnnounceTextOutput(iSetting)
endFunction

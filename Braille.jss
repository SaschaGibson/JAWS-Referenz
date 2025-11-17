;Copyright 2001-2015 by Freedom Scientific, Inc.
;braille support used by JAWS in the Default and other script files

Include "HjConst.jsh"
Include "HjGlobal.jsh"
include "MSAAConst.jsh"
Include "common.jsm"
include "uo.jsh"
include "braille.jsm"
include "braille.jsh"
include "FSI_ML.jsh"

import "touch.jsd"

;Linked Braille binaries:
use "fhp_brai.jsb"
use "bdas.jsb"
Use"FSI_ML.jsb"
use "mbrl.jsb"

const
	ObjetClassOrAutomationIDSearchPartial = "search",
; constants to look for in result of GetElementDescription in BrailleAddHTMLAttributes
; not translatable
	HTMLAttribOnClick="onclick=",
	HTMLAttribOnMouseOver="onmouseover=",
	HTMLAttribVisitedLink="visited=",
	HTMLExcludedOnClickTags="A,AREA,BODY,BUTTON,INPUT,SELECT"

globals
	int FHPExists,
	int BrailleStudyModeSupported,
	Int Grade2Caps, ;variable used for Capitals in German build
	Int GIPrevBrlMarking, ; variable used for setting Braille marking in German build
int g_savedProfileState

;c_FocusableProgressBar is a global defined and created in default.jss:
globals
	collection c_FocusableProgressBar


void Function BrailleStart ()
;This function is not an event, but is called once from AutoStartEvent
If ! BrailleFirstTime then
	let FHPExists = DoesFHPExist ()
	let BrailleStudyModeSupported = IsBSMCapableBrlDisplay()
;HTML tables
	let GIBrlShowCoords = Default_Braille_TableShowCoords
	let GIBrlTblHeader=Default_Braille_TableHeaders
	let GIBrlTBLZoom=Default_Braille_TableZoom
	;Sets setting for Braille cursor restriction, so applications who must force set it are able to put it back.
	;Example: Code window in Visual Basic 6.
	giDefaultBrlCursorRestriction = GetBrailleRestriction ()
	BrlFSIInit ()
	g_savedProfileState=-1

;The BrailleFirstTime global must be set last:
	Let BrailleFirstTime = 1
EndIf
let BrailleOldBlinkRate = GetDefaultJCFOption (optbrl_cursor_blink_rate)
let BrailleCursorShape = 0
let BrailleStatusMode = 0
EndFunction

int function IsBSMCapableBrlDisplay()
var
	string sBrlDisplay
if BrailleFirstTime then
	return BrailleStudyModeSupported
EndIf
let sBrlDisplay = GetBrailleKeyboardLayout()
let BrailleStudyModeSupported =
	StringCompare(sBrlDisplay,csFocus40) == 0
	|| StringCompare(sBrlDisplay,csFocus80) == 0
	|| StringCompare(sBrlDisplay,csPMDisplay20) == 0
	|| StringCompare(sBrlDisplay,csPMDisplay40) == 0
	|| StringContains (sBrlDisplay, csFocusXT)
return BrailleStudyModeSupported
EndFunction

int function BrailleBuildStatus ()
if gbLockedKeyboard then
	BrailleSetStatusCells(StringRight(FormatString(cmsgBrailleStatusLockedKeyboard,intToString(GetCursorRow())),BrailleGetStatusCellCount()))
	Return TRUE
elif IsObjectNavigationActive() then
	var
		int TouchNavElementSubtype ,
		string subtypeString,
		int statusCellCount
	TouchNavElementSubtype = GetTouchNavElementBrlSubtype()
	if TouchNavElementSubtype
		subtypeString = BrailleGetSubtypeString(TouchNavElementSubtype)
	endIf
	statusCellCount = BrailleGetStatusCellCount()
	if !getJcfOption (OPT_USE_STATUSCELLS_FOR_CONTROLTYPE)
	|| !TouchNavElementSubtype
	|| !subtypeString
		BrailleSetStatusCells(StringRight(FormatString(cmsgBrailleStatusTouchNavigation,intToString(GetCursorCol())),statusCellCount))
	else
		BrailleSetStatusCells(StringRight(FormatString(cmsgBrailleStatusTouchNavigation,
			StringLeft (subtypeString, statusCellCount-1)),
			statusCellCount))
	endIf
	return true
EndIf
Return BrailleBuildStatus ()
EndFunction

void function BrailleNavPriorLine ()
if BrailleCanPanLinesIndependently() then
	performScript BrailleSplitPriorLine()
else
	BraillePriorLine ()
endIf
EndFunction

void function BrailleNavNextLine ()
if BrailleCanPanLinesIndependently() then
	performScript BrailleSplitNextLine()
else
	BrailleNextLine ()
endIf
EndFunction

void Function BrailleNavPanLeft ()
BraillePanLeft(TRUE)
EndFunction

void Function BrailleNavPanRight ()
BraillePanRight(TRUE)
EndFunction

string Function MarkingOption (optional int iRetCurVal)
var
	int markingNow,
	string sApp
Let sApp = GetAppFileName ()
Let sApp = PathRenameExtension(sApp,cScJcf)
If (! FileExists (FindJAWSSettingsFile(sApp)) ) then
	Let sApp = DefaultJCFFile
EndIf
let markingNow = GetJcfOption(OPTBRL_MARKING)
If ! iRetCurVal then
	If ! MarkingNow then ; We're off, so either set to what's in the file, or highlight by default.
		Let MarkingNow = IniReadInteger (SECTION_BRAILLE, HKEY_BRL_MARKING, 1, sApp)
		If ! MarkingNow then ; There's probably no setting in app-specific file
			Let sApp = DefaultJCFFile
			Let MarkingNow = IniReadInteger (SECTION_BRAILLE, HKEY_BRL_MARKING, 1, sApp)
		EndIf
	Else
		Let MarkingNow = FALSE; We're turning it off
	EndIf
	SetJcfOption(OPTBRL_MARKING,markingNow)
EndIf
If MarkingNow > 0 then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string Function UOBrailleMarking (int iRetCurVal)
var
	int markingNow,
	string sApp
Let sApp = GetAppFileName ()
Let sApp = PathRenameExtension(sApp,cScJcf)
If (! FileExists (FindJAWSSettingsFile(sApp)) ) then
	Let sApp = DefaultJCFFile
EndIf
let markingNow = GetJcfOption(OPTBRL_MARKING)
If ! iRetCurVal then
	If ! MarkingNow then ; We're off, so either set to what's in the file, or highlight by default.
		Let MarkingNow = IniReadInteger (SECTION_BRAILLE, HKEY_BRL_MARKING, 1, sApp)
		If ! MarkingNow then ; There's probably no setting in app-specific file
			Let sApp = DefaultJCFFile
			Let MarkingNow = IniReadInteger (SECTION_BRAILLE, HKEY_BRL_MARKING, 1, sApp)
		EndIf
	Else
		Let MarkingNow = FALSE; We're turning it off
	EndIf
	SetJcfOption(OPTBRL_MARKING,markingNow)
EndIf
return UOBrailleMarkingTextOutput(MarkingNow)
EndFunction

string function UOBrailleMarkingTextOutput(int setting)
If setting > 0 then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string Function UOBrailleMarkingHlp()
Return FormatString(msgUO_BrlBrailleMarkingHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOBrailleMarkingTextOutput(GetIntOptionDefaultSetting(SECTION_BRAILLE, HKEY_BRL_MARKING)))
EndFunction

int Function BrailleFHPTopEdge ()
If FHPExists then ; Don't fire FHP function unless FHP display is present
	If FHPTopEdgeHelper () then
		Return TRUE
	endIf
endIf
EndFunction

int Function BrailleFhpBottomEdge ()
If FHPExists then; Don't fire FHP function unless FHP display is present
	If FHPBottomEdgeHelper () then
		Return TRUE
	endIf
endIf
EndFunction

void Function BrailleMenuModeHelper ()
;This is right now for start menu and only for the Braillex displays.
If FHPExists then
	FHPMenuModeHelper (); for the Papenmeier Displays
endIf
EndFunction

int Function BrailleRunManagerHelper ()
If FHPExists then
	PerformScript FHP_RunJAWSManager ()
	Return TRUE
else
	Return FALSE
endif
EndFunction

int function BrailleAddObjectContextHelp(int nSubtypeCode)
If GetObjectHelp () then
	SuppressG2TranslationForNextStructuredModeSegment()
	BrailleAddString (cMsgContextHelpBRL,0,0,0)
	Return TRUE
Else
	return FALSE
EndIf
EndFunction

int function BrailleAddObjectHelp(int nSubtypeCode)
If GetObjectHelp () then
	BrailleAddString(getObjectHelp(),0,0,0) 
	return true
else
	return false
EndIf
EndFunction

int function BrailleAddObjectRbntype(int nSubtypeCode)
brailleAddString(BrailleGetSubtypeString (nSubtypeCode),0,0,0)
return true
endFunction

int	 function BrailleAddHTMLAttributes(int nSubtypeCode, string sAttributes)
;Note this function is called by internal code if the VPC is active and the focus is in an HTML document
; If it returns false the internal code will handle according to the JBS HTML Attributes section
return FALSE
endFunction

int function BrailleAddObjectParentName(int nSubtypeCode)
var
	handle hWnd,
	string sParentName
If MenusActive () then
	Return true
EndIf
If nSubtypeCode == WT_TreeVIEW
|| nSubtypeCode == wt_TreeViewItem then
	if InHJDialog() then
		if GetTreeViewLevel() > 0 then
			Let hWnd = GetFocus ()
			let SParentName = tvGetItemText(hWnd, tvGetParent(hWnd,tvGetSelection(hWnd)))
			BrailleAddString(sParentName,0,0,0)
			return true
		EndIf
	EndIf
EndIf
return true
endFunction

int function BrailleAddObjectFlexibleWebActiveRules (int iType)
BrailleAddString (FlexibleWebNumberOfActiveRules (), 0,0,0)
return TRUE
endFunction

int function BrailleAddObjectComputerBrailleIndicator (int Type)
var
	int iG2Trans = getJCFOption (OPT_BRL_G2TRANSLATION),
	int iInput = getJcfOption (OPT_BRL_CONTRACTED_INPUT)
;if input and / or g2Translation are off in the app, the symbol is unnecessary.
if (! iG2Trans || ! iInput)
	return TRUE;
endIf
if ShouldForceComputerBraille (getFocus ()) then
	; final param to BrailleAddString is to disregard translating the string,
	; so that symbol remains as it should
	BrailleAddString (cmsgCompBrlIndicator, 0,0,0,TRUE)
	; Ensure that the next segment added will not be translated.
	SuppressG2TranslationForNextStructuredModeSegment()
endIf
return TRUE
endFunction

int function FocusIsExpectingAutocompleteSearchSuggestions ()
; overwrite this function wherever you enable autocomplete support in JAWS scripts.
if stringContains (stringLower (getObjectClassName ()), ObjetClassOrAutomationIDSearchPartial)
|| stringContains (stringLower (getObjectAutomationID ()), ObjetClassOrAutomationIDSearchPartial) then
; These are fields with search suggestions.
	return TRUE
endIf
return FALSE
endFunction

int Function ShouldForceComputerBraille (handle hwndTrans)
;Copy from PAC Mate, where it lives as an event but here we can use to support it.
var
	int iType,
	string sName,
	int iInput, int iG2Trans
iG2Trans = getJCFOption (OPT_BRL_G2TRANSLATION)
iInput = getJcfOption (OPT_BRL_CONTRACTED_INPUT)
;if input and / or g2Translation are off in the app return TRUE
;so we can alert, IndicateComputerBraille will
;make sure there's only an alert when there should be:
if isVirtualPcCursor () then
; Contracted input is technically not supported, and the internal function is technically right,
; but the downside is the text of an edit field is shown in computer Braille.
	return FALSE
endIf
if (! iG2Trans || ! iInput)
	return TRUE;
endIf
if ( ! IsContractedBrailleInputSupported () )
	return TRUE
endIf
if FocusIsExpectingAutocompleteSearchSuggestions () then
; these fields might otherwise allow contracted input,
; but that makes it impossible to benefit from search suggestions as you type:
	return TRUE
endIf
Let iType = getWindowSubtypeCode (hwndTrans)
if ! iType then
	let iType = getObjectSubtypeCode ()
endIf
if iType == WT_PASSWORDEDIT || iType == WT_SPINBOX
|| iType == WT_EDITCOMBO
|| iType == WT_EDIT_SPINBOX || iType == WT_IPADDRESS || iType == WT_HOTKEY
|| iType == wt_DateTime then
	return TRUE
endIf
if (iType == WT_EDIT || iType == WT_MULTILINE_EDIT)
	if ( ! IsContractedBrailleInputSupported () )
		return TRUE
	endIf
endIf
return FALSE;
endFunction

int function ContractedBrailleInputAllowedNow ()
;event function designed to return FALSE on controls that would otherwise support contracted input.
;Example would be an application whose edit controls may also support quick navigation keys, once said keys are on return false from this function to turn them off.
;This function is only called when the item with focus supports contracted input to begin with.
 var string class=getWindowClass(getFocus())
 
if class == cwc_ConsoleWindowClass || class == cwcWindows11Terminal then
; Disallow in command prompt because commands get combined with prompt.
	return false
endIf
if FocusIsExpectingAutocompleteSearchSuggestions () then
; these fields might otherwise allow contracted input,
; but that makes it impossible to benefit from search suggestions as you type:
	return FALSE
endIf
return true
endFunction

string function ActiveModeOption (optional int iRetCurVal)
var
	int iSetting,
 	int iMode,
	string strListText,
	int splitMode=BrailleGetSplitMode()
Let iMode = GetBrailleMode()
if ! iRetCurVal then
	;Update it
	If iMode == BRL_MODE_LINE then
		Let iSetting = BRL_MODE_STRUCTURED
	ElIf iMode == BRL_MODE_STRUCTURED && !splitMode then
		Let iSetting = BRL_MODE_speechbox
	ElIf iMode == BRL_MODE_speechbox && !splitMode then
		Let iSetting = BRL_MODE_ATTRIB
	elif iMode==BRL_MODE_ATTRIB || splitMode then
		let iSetting=BRL_MODE_LINE
	Else; Default
		Let iSetting = iMode
	EndIf
	SetBrailleMode (iSetting)
Else; Not updating
	Let iSetting = iMode
EndIf
If iSetting == BRL_MODE_LINE then
	Return msgBrlLineMode_S
ElIf iSetting == BRL_MODE_STRUCTURED then
	Return msgBrlStructuredMode_S
ElIf iSetting == BRL_MODE_SPEECHBOX then
	Return msgBrlSpeechHistoryMode_S
ElIf iSetting == BRL_MODE_ATTRIB then
	;This option is disabled while displaying in Attributes
	Return msgBrlAttributeMode_S
EndIf
EndFunction

int Function SetActiveBrailleMode ()
var
	int nMode,
int splitMode=BrailleGetSplitMode()
	
let nMode=GetBrailleMode()
if nMode == BRL_MODE_LINE then
	let nMode=BRL_MODE_STRUCTURED
	SayFormattedMessage (ot_status, msgBrlStructuredMode_L, msgBrlStructuredMode_S)
elif nMode == BRL_MODE_STRUCTURED && !splitMode then
	let nMode=BRL_MODE_speechbox
 	SayFormattedMessage (ot_status, msgBrlSpeechHistoryMode_L, msgBrlSpeechHistoryMode_S)
elif nMode == BRL_MODE_speechbox && !splitMode then
	let nMode=BRL_MODE_attrib
	SayFormattedMessage (ot_status, msgBrlAttributeMode_L, msgBrlAttributeMode_S)
elif nMode == BRL_MODE_attrib || splitMode then
	let nMode=BRL_MODE_LINE
	SayFormattedMessage (ot_status, msgBrlLineMode_L, msgBrlLineMode_S)
endIf
SetBrailleMode(nMode)
if GlobalPixelsPerSpace then
	SetJCFOption(OPT_PIXELS_PER_SPACE, GlobalPixelsPerSpace)
endIf
if GetJcfOption (OPT_BRL_AUTO_ROUTE_TO_CURSOR) == 1 then
	RouteBrailleToPc()
endIf
return nMode
EndFunction

string function UOActiveModeOption(int iRetCurVal)
var
	int iSetting,
	string strListText
Let iSetting = GetBrailleMode()
if ! iRetCurVal then
	if iSetting ==BRL_MODE_ATTRIB then
		let iSetting=BRL_MODE_LINE
	Else
		Let iSetting = iSetting+1
	EndIf
	SetBrailleMode (iSetting)
EndIf
return UOActiveModeOptionTextOutput(iSetting)
EndFunction

string function UOActiveModeOptionTextOutput(int setting)
If setting == BRL_MODE_LINE then
	Return msgBrlLineMode_S
ElIf setting == BRL_MODE_STRUCTURED then
	Return msgBrlStructuredMode_S
ElIf setting == BRL_MODE_SPEECHBOX then
	Return msgBrlSpeechHistoryMode_S
ElIf setting == BRL_MODE_ATTRIB then
	;This option is disabled while displaying in Attributes
	Return msgBrlAttributeMode_S
EndIf
EndFunction

string function UOActiveModeOptionHlp()
Return FormatString(msgUO_BrlActiveModeOption)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOActiveModeOptionTextOutput(GetIntOptionDefaultSetting(Section_Braille, hKey_Braille_BrailleMode)))
EndFunction

string Function GradeTwoModeOption (optional int iRetCurVal)
var
	int state=BrailleGetProfileState()
if !iRetCurVal then
	;Update it
	if state == brlComputerInComputerOut then
		state=brlComputerInContractedOut
	else
		state=brlComputerInComputerOut
	endIf
EndIf
If state then
	Return msgBrlOptionOn
Else
	Return msgBrlOptionOff
EndIf
EndFunction

int Function SetBrailleGradeTwoMode ()
var
	int state=BrailleGetProfileState()
if g_savedProfileState==-1 then
	g_savedProfileState=state
	if state!=brlComputerInComputerOut
		state=brlComputerInComputerOut
	else
	state=brlComputerInContractedOut
			endIf
else
	state=g_savedProfileState
	g_savedProfileState=-1
endIf

if state >= 1 then
	SayMessage (ot_status, cmsg234_L, cmsg_on) ; "Grade two translation on ",
else
	SayMessage (ot_status, cmsg235_L, cmsg_off); "Grade two translation off "
endIf
if BrailleGetSplitMode()==brlSplitTranslation && state==0 then
; If switching to Computer Braille, disable split translation.
	BrailleSplitMode(0)
	UpdateMultilineViewInJCF()
endIf

BrailleSetProfileState(state)
Return state
EndFunction

void function SayBrailleContractedState (int state)
if state == brlComputerInComputerOut then
	SayMessage (ot_status, cmsgBrailleProfileStateCompInOut); "Grade two translation off "
elif state==brlComputerInContractedOut then
	SayMessage (ot_status, cmsgBrailleProfileStateCompInContractedOut) ; "Grade two translation on ",
elif state==brlContractedInContractedOut then
	sayMessage (ot_status, cmsgBrailleProfileStateContractedInOut)
endIf
EndFunction

int Function ToggleBrailleContractedState ()
var
	int state=BrailleGetProfileState()
if state < brlContractedInContractedOut then
	state=state+1
else
	state=brlComputerInComputerOut
endIf
if BrailleGetSplitMode()==brlSplitTranslation && state==0 then
; If switching to Computer Braille, disable split translation.
	BrailleSplitMode(0)
	UpdateMultilineViewInJCF()
endIf

BrailleSetProfileState(state, wdSession)
return state
EndFunction

string Function UOGradeTwoModeOption(int iRetCurVal)
var
	int iSetting
let iSetting = GetBrailleContractedState ()
if !iRetCurVal then
	let iSetting = ToggleBrailleContractedState ()
EndIf
return UOGradeTwoModeOptionTextOutput(iSetting)
EndFunction

string Function UOGradeTwoModeOptionTextOutput(int setting)
If !setting then
	Return msgBrlOptionOff
elif Setting == ContractedBraille_OutputOnly then
	return msgBrlContractedMode_OutputOnly
elif Setting == ContractedBraille_InputAndOutput then
	return msgBrlContractedMode_InputAndOutput
EndIf
EndFunction

string Function UOGradeTwoModeOptionHlp()
Return FormatString(msgUO_BrlGradeTwoModeOptionHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOGradeTwoModeOptionTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Grade2Translation)
		+GetIntOptionDefaultSetting(section_braille,hKey_ContractedBrailleInput)))
EndFunction

; These UOGrade2Rules functions are deprecated and no longer in use.
string Function UOGrade2Rules(int iRetCurVal)
var
	int iBrlTranslatorMode,
	int bUEBEnabled
let iBrlTranslatorMode = BrailleGetCurrentTranslatorMode()
if iBrlTranslatorMode == -1 then
	Let bUEBEnabled = GetJcfOption(OPT_BRL_ENABLE_UEB)
	if !iRetCurVal then
		let bUEBEnabled = !bUEBEnabled
		SetDefaultJCFOption(OPT_BRL_ENABLE_UEB,bUEBEnabled)
	EndIf
else
	if !iRetCurVal then
		if iBrlTranslatorMode+1 == BrailleGetTranslatorModeCount() then
			let iBrlTranslatorMode = 0
		else
			let iBrlTranslatorMode = iBrlTranslatorMode+1
		EndIf
		BrailleSetTranslatorMode(iBrlTranslatorMode)
	EndIf
EndIf
return UOGrade2RulesTextOutput(iBrlTranslatorMode,bUEBEnabled)
EndFunction

string Function UOGrade2RulesTextOutput(int iMode, int bUEB)
if iMode == -1 then
	If bUEB then
		Return msgTranslationUEB
	else
		Return msgTranslationCEB
	EndIf
EndIf
return BrailleGetTranslatorModeName(iMode)
EndFunction

string Function UOGrade2RulesHlp()
if BrailleGetCurrentTranslatorMode() == -1 then
	return FormatString(msgUO_Grade2RulesHlp)+cscBufferNewLine+cscBufferNewLine+
		FormatString(msgShowOptionDefaultSetting,
		UOGrade2RulesTextOutput(0xffffffff,GetIntOptionDefaultSetting(section_braille,hKey_BrailleTranslationType)))
else
	return FormatString(msgUO_Grade2RulesHlp)+cscBufferNewLine+cscBufferNewLine+
		FormatString(msgShowOptionDefaultSetting,
		UOGrade2RulesTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_TranslatorMode),0))
EndIf
EndFunction

string function ExpandCurrentWordOption (optional int iRetCurVal)
var
	int iNewSetting
Let iNewSetting = GetJCFOption (OPT_BRL_G2EXPAND_CURRENT_WORD)
if !iRetCurVal then
	;Update it
	Let iNewSetting = !iNewSetting
	SetJcfOption (OPT_BRL_G2EXPAND_CURRENT_WORD, iNewSetting)
EndIf
if iNewSetting == 1 then
	Return cmsg_on ;brlG2ExpandCurrentWordOn
else
	return cmsg_off ;brlG2ExpandCurrentWordOff
endIf
EndFunction

int Function SetBrailleExpandCurrentWord ()
var
	int iNewSetting
Let iNewSetting = !GetJCFOption(OPT_BRL_G2EXPAND_CURRENT_WORD)
SetDefaultJcfOption (OPT_BRL_G2EXPAND_CURRENT_WORD, iNewSetting)
if iNewSetting == 1 then
	SayFormattedMessage (ot_status, cmsg236_L, cmsg236_S); "Expanding current word ",
else
	SayFormattedMessage (ot_status, cmsg237_L, cmsg237_S); "Translating whole line ",
endIf
Return iNewSetting
EndFunction

string function UOCurrentWordExpand(int iRetCurVal)
var
	int iSetting
If !GetJcfOption (OPT_BRL_G2TRANSLATION)
|| getJcfOption (OPT_BRL_CONTRACTED_INPUT) then
	Return msgUO_Unavailable
EndIf
Let iSetting = GetJCFOption (OPT_BRL_G2EXPAND_CURRENT_WORD)
if !iRetCurVal then
	Let iSetting = !iSetting
	SetJcfOption (OPT_BRL_G2EXPAND_CURRENT_WORD, iSetting)
EndIf
return UOCurrentWordExpandTextOutput(iSetting)
EndFunction

string function UOCurrentWordExpandTextOutput(int setting)
if setting == 1 then
	Return msgUO_On ;brlG2ExpandCurrentWordOn
else
	return msgUO_Off ;brlG2ExpandCurrentWordOff
endIf
EndFunction

string function UOCurrentWordExpandHlp()
If !GetJcfOption (OPT_BRL_G2TRANSLATION)
|| getJcfOption (OPT_BRL_CONTRACTED_INPUT) then
	Return msgUO_BrlCurrentWordExpandUnavailableHlp
EndIf
Return msgUO_BrlCurrentWordExpandHlp +cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOCurrentWordExpandTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_Grade2ExpandCurrentWord)))
EndFunction

int Function SetBrailleMovesActive ()
var
	int iSetting
Let iSetting = !GetJcfOption(OPT_BRL_MOVE_ACTIVE_CURSOR)
SetDefaultJcfOption (OPT_BRL_MOVE_ACTIVE_CURSOR, iSetting)
if (iSetting == 0) then
	SayFormattedMessage (ot_status, cmsg196_L, cmsg196_S) ; "The active cursor will not follow the Braille cursor"
else
	SayFormattedMessage (ot_status, cmsg197_L, cmsg197_S) ; "The active cursor will follow the Braille cursor"
endIf
return iSetting
EndFunction


int Function SetActiveMovesBraille ()
var
	int iSetting
Let iSetting = !GetJcfOption(OPT_BRL_AUTO_ROUTE_TO_CURSOR)
SetDefaultJcfOption (	OPT_BRL_AUTO_ROUTE_TO_CURSOR, iSetting)
if (iSetting == OFF) then
	SayFormattedMessage (ot_status, cmsg199_L, cmsg199_S) ; "The active cursor will not move the Braille cursor"
else
	SayFormattedMessage (ot_status, cmsg200_L, cmsg200_S) ; "The active cursor will move the Braille cursor"
endIf
EndFunction

string Function BrailleMovesActiveOption (optional int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption (OPT_BRL_MOVE_ACTIVE_CURSOR)
if !iRetCurVal then
	;Update it
	Let iSetting = !iSetting
	SetJcfOption (OPT_BRL_MOVE_ACTIVE_CURSOR, iSetting)
EndIf
if (iSetting == 0) then
	Return cmsg_off
else
	Return cmsg_on
endIf
EndFunction

string Function UOActiveFollowsBraille(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption (OPT_BRL_MOVE_ACTIVE_CURSOR)
if !iRetCurVal then
	Let iSetting = !iSetting
	SetJcfOption (OPT_BRL_MOVE_ACTIVE_CURSOR, iSetting)
EndIf
return UOActiveFollowsBrailleTextOutput(iSetting)
EndFunction

string function UOActiveFollowsBrailleTextOutput(int setting)
if setting then
	Return cmsg_on
else
	Return cmsg_off
endIf
EndFunction

string Function UOActiveFollowsBrailleHlp()
Return FormatString(msgUO_brlActiveFollowsBrailleHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOActiveFollowsBrailleTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BrailleMoveActiveCursor)))
EndFunction

string Function ActiveMovesBrailleOption (optional int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption (OPT_BRL_AUTO_ROUTE_TO_CURSOR)
if !iRetCurVal then
	;Update it
	Let iSetting = !iSetting
	SetJcfOption (OPT_BRL_AUTO_ROUTE_TO_CURSOR, iSetting)
EndIf
if (iSetting == OFF) then
	Return cmsg_off
else
	Return  cmsg_on
endIf
EndFunction

string Function UOBrailleFollowsActive(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption (OPT_BRL_AUTO_ROUTE_TO_CURSOR)
if !iRetCurVal then
	Let iSetting = !iSetting
	SetJcfOption (OPT_BRL_AUTO_ROUTE_TO_CURSOR, iSetting)
EndIf
return UOBrailleFollowsActiveTextOutput(iSetting)
EndFunction

string Function UOBrailleFollowsActiveTextOutput(int setting)
if setting == OFF then
	Return msgUO_Off
else
	Return  msgUO_On
endIf
EndFunction

string Function UOBrailleFollowsActiveHlp()
Return FormatString(msgUO_BrlBrailleFollowsActiveHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOBrailleFollowsActiveTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BrailleAutoRouteToCursor)))
EndFunction

string Function ToggleFlashMessages(int iRetCurVal)
var
	int iFlashMessages
Let iFlashMessages = GetJcfOption(OPT_BRL_MESSAGES)
if !iRetCurVal then
	;Update it
	Let iFlashMessages = !iFlashMessages
	SetJCFOption(OPT_BRL_MESSAGES,iFlashMessages)
EndIf
if iFlashMessages then
	Return cmsg_on ;FlashMessagesOn
Else
	Return cmsg_off ;FlashMessagesOff
EndIf
EndFunction

string Function UOFlashMessages(int iRetCurVal)
var
	int iFlashMessages
Let iFlashMessages = GetJcfOption(OPT_BRL_MESSAGES)
if !iRetCurVal then
	Let iFlashMessages = !iFlashMessages
	SetJCFOption(OPT_BRL_MESSAGES,iFlashMessages)
EndIf
return UOFlashMessagesTextOutput(iFlashMessages)
EndFunction

string Function UOFlashMessagesTextOutput(int setting)
if setting then
	Return msgUO_On
Else
	Return msgUO_Off
EndIf
EndFunction

string Function UOFlashMessagesHlp()
Return FormatString(msgUO_BrlFlashMessagesHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOFlashMessagesTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BrailleMessages)))
EndFunction

int Function SetBrailleSpeechInterrupt ()
var
	int iSetting
let iSetting = !GetJcfOption(OPT_BRL_KEY_INTERRUPT_SPEECH)
SetJcfOption (OPT_BRL_KEY_INTERRUPT_SPEECH, iSetting)
If iSetting == 0 then
	SayFormattedMessage (OT_STATUS, cmsgBrailleInterruptOff1_L, cmsgBrailleInterruptOff1_S)
Else
	SayFormattedMessage (OT_STATUS, cmsgBrailleInterruptOn1_L, cmsgBrailleInterruptOn1_S)
endIf
EndFunction

string Function SpeechInterruptOption (optional int iRetCurVal)
var
	int iSetting
let iSetting = GetJcfOption (OPT_BRL_KEY_INTERRUPT_SPEECH)
if !iRetCurVal then
	;Update it
	Let iSetting = !iSetting
	SetJcfOption (OPT_BRL_KEY_INTERRUPT_SPEECH, iSetting)
EndIf
If iSetting == 0 then
	Return cmsg_off
Else
	Return cmsg_on
endIf
EndFunction

string Function UOBrailleKeysInterruptSpech(int iRetCurVal)
var
	int iSetting
let iSetting = GetJcfOption (OPT_BRL_KEY_INTERRUPT_SPEECH)
if !iRetCurVal then
	Let iSetting = !iSetting
	SetJcfOption (OPT_BRL_KEY_INTERRUPT_SPEECH, iSetting)
EndIf
return UOBrailleKeysInterruptSpechTextOutput(iSetting)
EndFunction

string Function UOBrailleKeysInterruptSpechTextOutput(int setting)
If setting then
	Return msgUO_On
Else
	Return msgUO_Off
endIf
EndFunction

string Function UOBrailleKeysInterruptSpechHlp()
Return FormatString(msgUO_BrlBrailleKeysInterruptSpechHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOBrailleKeysInterruptSpechTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BrailleKeyInterruptSpeech)))
EndFunction
int Function SetBrailleCharactersOrAttributes ()
if (GetBrailleMode() == BRL_MODE_attrib) then
	SetBrailleMode (Previous_Braille_Mode)
	SayFormattedMessage (ot_status, cmsg189_L) ; "characters"
	return Previous_Braille_Mode
endIf
Let Previous_Braille_Mode = GetBrailleMode ()
SetBrailleMode (BRL_MODE_ATTRIB)
SayFormattedMessage (ot_status, cmsg188_L) ; "Attributes"
Return BRL_MODE_ATTRIB
EndFunction

string Function BrailleZoom(int iRetCurVal)
var
int maxOption
if BrailleGetLineCount() > 1 && !BrailleIsSimulatingTwoLines()then
	maxOption=ZOOM_TO_CUR_AND_PRIOR_ROW
else
	maxOption=ZOOM_TO_CURRENT_COL
endIf

If !iRetCurVal then
	If GIBrlTBLZoom < maxOption then
		Let GIBrlTBLZoom = GIBrlTBLZoom + 1
	Else
		Let GIBrlTBLZoom = ZOOM_TO_CURRENT_CELL
	EndIf
EndIf
return BrailleZoomTextOutput(GIBrlTBLZoom)
EndFunction

string Function BrailleZoomTextOutput(int setting)
If setting == ZOOM_TO_CURRENT_CELL then
	Return cMsgBRLZoomToCell
ElIf setting == ZOOM_TO_CURRENT_ROW then
	Return cmsgBRLZoomToRow
ElIf setting == ZOOM_TO_CURRENT_COL then
	Return cMsgBrlZoomToCol
elif setting == ZOOM_TO_CUR_ROW_AND_COLTITLES then
	return cMSGBrlZoomToRowPlusColTitles
elif setting == ZOOM_TO_CUR_AND_PRIOR_ROW then
	return cMSGBrlZoomToCurAndPriorRow
EndIf
EndFunction

string Function BrailleZoomHlp()
Return FormatString(msgUO_BrailleZoomHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	BrailleZoomTextOutput(Default_Braille_TableZoom))
EndFunction

string Function BrailleShowCoords(int iRetCurVal)
If !iRetCurVal then
	Let GIBrlShowCoords = !GIBrlShowCoords
EndIf
return BrailleShowCoordsTextOutput(GIBrlShowCoords)
EndFunction

string Function BrailleShowCoordsTextOutput(int setting)
If setting then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string Function BrailleShowCoordsHlp (int iRetCurVal)
Return FormatString(msgUO_BrailleShowCoordsHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	BrailleShowCoordsTextOutput(Default_Braille_TableShowCoords))
EndFunction

String Function BrailleShowHeaders(int iRetCurVal)
If !iRetCurVal then
		If GIBrlTblHeader == HEADER_BOTH then
		Let GIBrlTblHeader = OFF
	Else
		Let GIBrlTblHeader = (GIBrlTblHeader+1)
	EndIf
EndIf
return BrailleShowHeadersTextOutput(GIBrlTblHeader)
EndFunction

String Function BrailleShowHeadersTextOutput(int setting)
If setting == HEADER_COLUMN then
	Return cMsgColumnTitles
ElIf setting == HEADER_ROW then
	Return cMsgRowTitles
ElIf setting == HEADER_BOTH then
	Return cMsgBothTitles
Else
	Return cmsg_off
EndIf
EndFunction

String Function BrailleShowHeadersHlp()
Return FormatString(msgUO_BrailleShowHeadersHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	BrailleShowHeadersTextOutput(Default_Braille_TableHeaders))
EndFunction

void Function BrailleTabKey ()
TabKey ()
EndFunction

void Function BrailleShiftTabKey ()
ShiftTabKey ()
EndFunction

void Function BrailleEnterKey ()
EnterKey ()
if BrailleGetTypeKeysMode() then
	If GetJCFOption(OPT_TYPING_ECHO) & 1 Then
		SayFormattedMessage (OT_KEYBOARD,cksEnter)
	EndIf
else
	SayCurrentScriptKeyLabel ()
EndIf
EndFunction

void Function BrailleEscapeKey ()
If UserBufferIsActive () then
	UserBufferDeactivate ()
	Return;
EndIf
TypeKey(cksEsc)
EndFunction

void Function BrailleAltTabKey ()
TypeKey(cksAltTab)
EndFunction

void Function BrailleNavMoveLeft ()
if (GetJcfOption(OPT_Brl_Move_Active_Cursor) == 0) Then
	SaveCursor()
	BrailleCursor()
endIf
if not BraillePanLeft() then
	Beep()
endIf
EndFunction

void Function BrailleNavMoveRight ()
if (GetJcfOption(Opt_Brl_Move_Active_Cursor) == 0) Then
	SaveCursor()
	BrailleCursor()
endIf
if not BraillePanRIGHT() then
	Beep()
endIf
EndFunction

int function SetBraille8PixelsPerSpace ()
SayFormattedMessage (ot_status, cmsgScreenFormat_L, cmsgScreenFormat_S) ;"8 pixels per space"
SetJcfOption(OPT_PIXELS_PER_SPACE,8)
return 8
EndFunction

int function SetBrailleUnlimitedPixelsPerSpace ()
SayFormattedMessage (ot_status, cMsgBrlFormat_L, cMsgBrlFormat_S) ;"Unlimitted pixels per space"
SetJcfOption(OPT_PIXELS_PER_SPACE,999)
return 999
EndFunction

int function BrailleSet8OrUnlimitedPixels ()
If (GetJcfOption(Opt_Pixels_Per_Space) == 999) Then  ; Current setting is unlimited
	Return SetBraille8PixelsPerSpace()
Else
	Return SetBrailleUnlimitedPixelsPerSpace()
endIf
EndFunction

String Function FormatOption (optional int iRetCurVal)
var
	int iMode,
	int iSetting
Let iMode = GetJcfOption(Opt_Pixels_Per_Space)
Let iSetting = iMode
If !iRetCurVal then
	;Update it
	If iMode >= 999 then
		Let iSetting = 8
	ElIf iMode == 8 then
		Let iSetting = 999
	EndIf
	SetJcfOption (OPT_PIXELS_PER_SPACE, iSetting)
EndIf
if iSetting == 8 then
	Return cmsgScreenFormat_S
ElIf iSetting >= 999 then
	return cmsgBrlFormat_S
EndIf
EndFunction

int Function SetBrailleMarking ()
var
	int markingNow
let markingNow = GetJcfOption(OPTBRL_MARKING)
if (markingNow >= BRL_MARKING_ALL) then
	let markingNow = BRL_MARKING_NONE
ElIf MarkingNow == BRL_MARKING_NONE then
	Let MarkingNow = BRL_MARKING_HIGHLIGHT
ElIf MarkingNow == BRL_MARKING_HIGHLIGHT then
	Let MarkingNow = BRL_MARKING_BOLD
ElIf MarkingNow == BRL_MARKING_BOLD then
	Let MarkingNow = BRL_MARKING_UNDERLINE
ElIf MarkingNow == BRL_MARKING_UNDERLINE then
	Let MarkingNow = BRL_MARKING_ITALIC
ElIf MarkingNow == BRL_MARKING_ITALIC then
	Let MarkingNow = BRL_MARKING_STRIKEOUT
ElIf MarkingNow == BRL_MARKING_STRIKEOUT then
	Let MarkingNow = BRL_MARKING_COLOR
ElIf MarkingNow == BRL_MARKING_COLOR then
	Let MarkingNow = BRL_MARKING_ALL
endIf
SetJcfOption(OPTBRL_MARKING,markingNow)
if (markingNow == BRL_MARKING_NONE) then
	SayFormattedMessage (ot_status, cmsg_off, cmsg_off) ;"Braille marking off"
ElIf (markingNow == BRL_MARKING_HIGHLIGHT) then
	SayFormattedMessage (ot_status, cmsg159_L, cmsg159_S) ;"Braille marking  highlight"
ElIf (markingNow == BRL_MARKING_BOLD) then
	SayFormattedMessage (ot_status, cmsg160_L, cmsg160_S)  ;"Braille marking  bold"
ElIf (markingNow == BRL_MARKING_UNDERLINE) then
	SayFormattedMessage (ot_status, cmsg161_L, cmsg161_S) ; "Braille marking  underline"
ElIf (markingNow == BRL_MARKING_ITALIC) then
	SayFormattedMessage (ot_status, cmsg162_L, cmsg162_S) ; "Braille marking  italic"
ElIf (markingNow == BRL_MARKING_STRIKEOUT) then
	SayFormattedMessage (ot_status, cmsg163_L, cmsg163_S) ; "Braille marking  strike out"
ElIf MarkingNow == BRL_MARKING_COLOR then
	SayFormattedMessage (OT_STATUS, cmsgBrlColor_L, cmsgBrlColor_S);"Braille marking custom color"
ElIf (markingNow == BRL_MARKING_ALL) then
	SayFormattedMessage (ot_status, cmsg164_L, cmsg164_S) ; "Braille marking all "
EndIf
Return markingNow
EndFunction

int function SetMarkingBit (int iBit)
var
	int iMarking
Let iMarking = GetJcfOption (OPTBRL_MARKING)
; Use to set all possible bits in Braille marking.
If (iMarking & iBit) then
	Let iMarking = (iMarking-iBit)
Else
	Let iMarking = (iMarking+iBit)
EndIf
Return iMarking
EndFunction

string function MarkOption(int iRetCurVal, int iOption)
var
	int iMark
Let iMark = GetJcfOption (OPTBRL_MARKING)
If !iRetCurVal then
	Let iMark = SetMarkingBit(iOption)
	SetJcfOption (OPTBRL_MARKING, iMark)
EndIf
return MarkOptionTextOutput(iMark & iOption)
EndFunction

string function MarkOptionTextOutput(int setting)
If setting then
	Return msgBrlOptionOn
Else
	Return msgBrlOptionOff
EndIf
EndFunction

string function MarkHighlight (optional int iRetCurVal)
Return MarkOption (iRetCurVal, BRL_MARKING_HIGHLIGHT)
EndFunction

string function MarkHighlightHlp()
Return FormatString(msgUO_MarkingHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	MarkOptionTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BrailleShowMarking) & BRL_MARKING_HIGHLIGHT))
EndFunction

string function MarkBold (optional int iRetCurVal)
Return MarkOption (iRetCurVal, BRL_MARKING_BOLD)
EndFunction

string function MarkBoldHlp()
Return FormatString(msgUO_MarkingHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	MarkOptionTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BrailleShowMarking) & BRL_MARKING_BOLD))
EndFunction

string function MarkUnderline (optional int iRetCurVal)
Return MarkOption (iRetCurVal, BRL_MARKING_UNDERLINE)
EndFunction

string function MarkUnderlineHlp()
Return FormatString(msgUO_MarkingHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	MarkOptionTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BrailleShowMarking) & BRL_MARKING_UNDERLINE))
EndFunction

string function MarkItalic (optional int iRetCurVal)
Return MarkOption (iRetCurVal, BRL_MARKING_ITALIC)
EndFunction

string function MarkItalicHlp()
Return FormatString(msgUO_MarkingHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	MarkOptionTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BrailleShowMarking) & BRL_MARKING_ITALIC))
EndFunction

string function MarkStrikeOut (optional int iRetCurVal)
Return MarkOption (iRetCurVal, BRL_MARKING_STRIKEOUT)
EndFunction

string function MarkStrikeOutHlp()
Return FormatString(msgUO_MarkingHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	MarkOptionTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BrailleShowMarking) & BRL_MARKING_STRIKEOUT))
EndFunction

string function MarkColor (optional int iRetCurVal)
Return MarkOption (iRetCurVal, BRL_MARKING_COLOR)
EndFunction

string function MarkColorHlp()
Return FormatString(msgUO_MarkingHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	MarkOptionTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BrailleShowMarking) & BRL_MARKING_COLOR))
EndFunction

string  function MarkScript (optional int iRetCurVal)
Return MarkOption (iRetCurVal, BRL_MARKING_EXTENDED)
EndFunction

string  function MarkScriptHlp()
Return FormatString(msgUO_MarkingHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	MarkOptionTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BrailleShowMarking) & BRL_MARKING_EXTENDED))
EndFunction

void Function MarkingList()
If InHjDialog() then
	PerformScript RunJAWSManager();Let defaults speak message
	Return
EndIf
dlgSelectFunctionToRun(cstrBrailleMarkingList(),cstrBrailleMarkingDlgName,FALSE)
EndFunction

void function TurnOffBrailleMarking ()
SetJcfOption (OPTBRL_MARKING, BRL_MARKING_NONE)
SayFormattedMessage (ot_status, cmsg_off, cmsg_off) ;"Braille marking off"
EndFunction

void function BrailleDescribeFontAtCursor ()
var
	int nX,
	int nY,
	int nCell
let nCell = GetLastBrailleRoutingKey()
if (nCell > 0) then
	let nX = GetBrailleCellColumn(nCell)
	let nY = GetBrailleCellRow(nCell)
	SaveCursor()
	InvisibleCursor()
	MoveTo(nX,nY)
	SayFont()
	RestoreCursor()
endIf
EndFunction

int function Set6Or8Dots ()
var
	int EightDot
let EightDot = !GetJcfOption(OPTBRL_EIGHT_DOT)
SetJcfOption (OPTBRL_EIGHT_DOT, EightDot)
if !EightDot then
	SayFormattedMessage (ot_status, cmsg165_L, cmsg165_S) ;"six dot braille"
else
	SayFormattedMessage (ot_status, cmsg166_L, cmsg166_S) ;"eight dot braille"
endIf
return EightDot
EndFunction

string function SixOrEightDotOption (optional int iRetCurVal)
var
	int EightDot
let EightDot = GetJcfOption (OPTBRL_EIGHT_DOT)
If !iRetCurVal then
	;Update it
	Let EightDot = !EightDot
	SetJcfOption (OPTBRL_EIGHT_DOT, EightDot)
EndIf
if !EightDot then
	Return cmsg165_L
else
	Return cmsg166_L
EndIf
EndFunction

string function UOEightDotBraille(int iRetCurVal)
var
	int EightDot
let EightDot = GetJcfOption (OPTBRL_EIGHT_DOT)
If !iRetCurVal then
	Let EightDot = !EightDot
	SetJcfOption (OPTBRL_EIGHT_DOT, EightDot)
EndIf
return UOEightDotBrailleTextOutput(EightDot)
EndFunction

string function UOEightDotBrailleTextOutput(int setting)
if setting then
	Return msgUO_On
else
	Return msgUO_Off
EndIf
EndFunction

string function UOEightDotBrailleHlp()
Return FormatString(msgUO_BrlUOEightDotBrailleHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOEightDotBrailleTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_EightDotBraille)))
EndFunction

void Function SetSixDotBraille ()
SetJcfOption (OPTBRL_EIGHT_DOT, FALSE)
SayFormattedMessage (ot_status, cmsg165_L, cmsg165_S) ;"six dot braille"
EndFunction

void Function SetEightDotBraille ()
SetJcfOption (OPTBRL_EIGHT_DOT, TRUE)
SayFormattedMessage (ot_status, cmsg166_L, cmsg166_S) ;"eight dot braille"
EndFunction

void Function SelectTextWithBraille ()
var
int nLastRoutingCell,
int oldFlashMessageValue,
int oldBrailleMovesActive
let nLastRoutingCell=GetLastBrailleRoutingKey ()
if (nLastRoutingCell <=0) then
	return
endIf
if BrailleSplitModeSupportsSelection(nLastRoutingCell ) then
	builtin::BrailleRoutingButton(nLastRoutingCell, 2) ; 2 has a special meaning for the buffered data. It sets up the selection ancors.
	var
	int start,
	int end,
	string text
	if BrailleGetSplitModeSelection(start,end,text) then
	CopyToClipboard (text)
	endIf
	return;
endIf

if (SelectSet == false) then
	BrailleRoutingButton(nLastRoutingCell, 1)
	SaveCurrentLocation()
	let SelectSet = true
	BrailleSetAllCursorsBlinkRate (0)
; We know we're selecting text so no need to flash or it disrupts the operation since we have to wait for the message to be dismissed. 
	let oldFlashMessageValue=getJCFOption(OPT_BRL_MESSAGES)
	setJCFOption(OPT_BRL_MESSAGES, 0)
	SayFormattedMessage (ot_JAWS_message, cmsg222_L, cmsg222_S) ; "Selecting Text"
	setJCFOption(OPT_BRL_MESSAGES, oldFlashMessageValue)
	return
endIf
BrailleRoutingButton(nLastRoutingCell,1)
;Please note! Saving BrailleMovesActive and setting to FALSE to get around issue of selection causing Braille to subsequently move PCCursor thereby undoing selection in 
;Notepad and Wordpad.
;Once this internal bug is fixed, this hack can be removed (added 7 Nov 2014 JKS)
let oldBrailleMovesActive=getJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR)
setJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR,FALSE)
SelectFromSavedLocationToCurrent()
BrailleRefresh() ; Force refresh before we revert JCF value to original.
setJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR, oldBrailleMovesActive)
BrailleSetAllCursorsBlinkRate (BrailleOldBlinkRate)
let SelectSet = false
EndFunction

Void Function BrailleSelectTextClearValues ()
if SelectSet then
	let SelectSet = false
	ClearSavedLocation()
	PerformScript BrailleChangeCursorShape ()
endIf
EndFunction

		void function BrailleControlLeftMouseClick()
var
int nLastRoutingCell;
let nLastRoutingCell=GetLastBrailleRoutingKey ()
if (nLastRoutingCell< 0) then
	return
endIf
BrailleRoutingButton(nLastRoutingCell)
RouteJAWSToBraille()
ControlLeftMouseClick()
SayFormattedMessage (ot_status, cmsg61_L) ;"Control Mouse Click"
endFunction

int function ToggleSpeechHistoryMode ()
var
	int Current_Braille_Mode
let Current_Braille_Mode = GetBrailleMode()
if (Current_Braille_Mode == BRL_MODE_Line ||
Current_Braille_Mode == BRL_MODE_Structured ||
Current_Braille_Mode == BRL_MODE_Speechbox) then
	if (Current_Braille_Mode != BRL_MODE_Speechbox) Then
		let Previous_Braille_Mode = Current_Braille_Mode
		Let Current_Braille_Mode = BRL_MODE_Speechbox
		SetBrailleMode(Current_Braille_Mode)
		SayFormattedMessage (OT_status, cmsg219_L, cmsg219_S) ; Speech Box Mode
		return Current_Braille_Mode
	Else
  		SetBrailleMode(Previous_Braille_Mode)
		SayFormattedMessage (OT_status, cmsg281_l, cmsg_off); "Speech box mode off"
		return Previous_Braille_Mode
	endIf
endIf
EndFunction

int Function BrailleSetToLineMode ()
var
	int mode
let mode = GetBrailleMode ()
if (mode != BRL_MODE_Line) then
	SetBrailleMode(BRL_MODE_Line)
	SayFormattedMessage (OT_status, cmsg187_L, cmsg187_S)
	return TRUE
Else
	SayFormattedMessage (OT_status, cmsg187_L, cmsg187_S)
	return FALSE
endIf
EndFunction

void Function BrailleDescribeItemAtCursor ()
var
	int nX,
	int nY,
	int nCell,
	handle TheWindow,
	handle TheRealWindow,
	handle TheAppWindow,
	int TheType,
	int TheRealType,
	string String1,
	string TheChunk,
	string TheLine,
	string TheMenu,
	int MenuItem,
	;int MenuBar,
	String ThePageName,
	int IsDialogTabPage,
	int HasPrompt,
	string TheControlName,
	int PromptSelected,
	string TheGroupBoxName,
	handle TheGroupBox,
	string TheWord,
	string TheCharacter
let nCell = GetLastBrailleRoutingKey()
If (nCell>200) then
	let nCell=NCell-200
endIf
let nX = GetBrailleCellColumn(nCell)
let nY = GetBrailleCellRow(nCell)
if (nY == 0) then
	return
endIf
SaveCursor()
InvisibleCursor ()
MoveTo(nX,nY)
let TheWindow=GetCurrentWindow ()
let TheChunk=GetChunk ()
let TheWord=GetWord()
let TheCharacter=GetCharacter()
let TheLine=GetLine ()
let TheMenu=GetMenuName ()
let ThePageName=GetDialogPageName ()
let IsDialogTabPage=IsMultiPageDialog ()
;Let TheGroupBoxName=GetGroupBoxName ()
If (GetWindowSubTypeCode (TheWindow)==WT_UNKNOWN)  then
	if ((GetWindowClass (TheWindow)=="Opuswwd") ||(GetWindowClass (TheWindow)=="_WwG"))then
	;We are in MS-Word
		Say (TheWord, OT_help)
		Say (TheCharacter, OT_help)
		SayColor()
		PerformScript SayFont ()
	else
		SayChunk()
		SayFormattedMessage (OT_help, cMsg264_L, cMsg264_S);"This is an unknown window type"
			SayFont ()
			SayColor ()
		endIf
return
endIf
RestoreCursor()
let TheType=GetWindowSubTypeCode (TheWindow)
let TheRealWindow=GetRealWindow(TheWindow)
let TheRealType=GetWindowTypeCode(TheRealWindow)
If ((TheType!=WT_TOOLBAR)&&(TheType!=WT_HEADERBAR)&&(TheType!=WT_STATUSBAR)&&
	(TheType!=WT_SPINBOX)&&(TheType!=WT_DIALOG)&&(TheType!=WT_CHECKBOX)&&
	(TheType!=WT_GROUPBOX)&&(TheType!=WT_3STATE)&&(TheType!=WT_LEFTRIGHTSLIDER)&&
	(TheType!=WT_UPDOWNSLIDER)&&(TheType!=WT_COMMANDBAR))Then
	SayFormattedMessage (OT_help, cMsg253_L, cmsgSilent);"This is "
endIf

If (TheType==WT_STATIC)  then
;check if it's not some prompt
	If ( GetWindowName (GetNextWindow (TheWindow))==TheChunk) Then
		SaveCursor()
		InvisibleCursor ()
		MoveToWindow (GetNextWindow (TheWindow))
		let TheWindow=GetCurrentWindow ()
		let TheChunk= cscNull
		RestoreCursor()
		SayFormattedMessage (OT_help, cMsg254_L, cMsg254_S);"Prompt text to ",
		let TheType=GetWindowTypeCode (TheWindow)
		let PromptSelected=TRUE
	Else
		Say (cwc291, OT_help);"static text"
	endIf
endIf
If (TheType==WT_BUTTON)  then
	Say (cwc290, OT_help);"Button"
ElIf (TheType==WT_COMBOBOX)  then
	If Not (TheChunk==cscNull) Then
		SayFormattedMessage (OT_help, cMsg255_L);"Item "
	endIf
	let HasPrompt=TRUE
ElIf (TheType==WT_EDIT)  then
	If Not (TheChunk==cscNull) Then
		SayFormattedMessage (OT_help, cMsg256_L);"Text "
	endIf
	let HasPrompt=TRUE
ElIf (TheType==WT_LISTBOX)  then
	If Not (TheChunk==cscNull) Then
		SayFormattedMessage (OT_help, cMsg255_L);"Item "
	endIf
	let HasPrompt=TRUE
ElIf (TheType==WT_SCROLLBAR)  then
	let HasPrompt=TRUE
ElIf (TheType==WT_TOOLBAR)  then
	SaveCursor()
	InvisibleCursor ()
	MoveToGraphic (GRAPHIC_PRIOR)
	MoveToGraphic (GRAPHIC_NEXT)
	let TheChunk=GetChunk ()
	RestoreCursor()
	SayFormattedMessage (OT_help, cmsg86_L+cwc290);"this is a tool bar"+"Button"
ElIf (TheType==WT_STATUSBAR)  then
	SayFormattedMessage (OT_help, cmsg87_L);"This is an application status bar"
ElIf (TheType==WT_HEADERBAR)  then
	SayFormattedMessage (OT_help, cmsg88_L);"This is a header bar"
ElIf (TheType==WT_BUTTONLISTBOX)  then
	let HasPrompt=TRUE
ElIf (TheType==WT_SLIDER)  then
	SayFormattedMessage (OT_help, cMsg257_L);	"Minimized Window"
	let HasPrompt=TRUE
ElIf (TheType==WT_SPINBOX)  then
	SayFormattedMessage (OT_help, cmsg89_L);"This is a spin box"
	let HasPrompt=TRUE
ElIf (TheType==WT_MENU)  then
	SayFormattedMessage (OT_help, cmsg193_L+cMsg255_L);" menu"+"Item "
	let MenuItem=TRUE
;WT_DESKTOP not implemented
;WT_WINSWITCH not implemented
ElIf (TheType==WT_ICONTITLE)  then
	SayFormattedMessage (OT_help, cMsg257_L);"Minimized Window"
;WT_MDICLIENT not implemented
ElIf (TheType==WT_DIALOG)  then
	SayFormattedMessage (OT_help, cmsg90_L);"This is a dialog box"
	Say (GetWindowName (TheWindow), OT_help)
	let TheChunk=cscNull
ElIf (TheType==WT_RADIOBUTTON)  then
	SayFormattedMessage (OT_help, cMsg258_L);"RadioButton "
	let TheChunk=GetWindowName (TheWindow)
;	Let HasPrompt=TRUE	 ; only if grouboxname can be retrieved
ElIf (TheType==WT_CHECKBOX)  then
	SayFormattedMessage (OT_help, cmsg91_L);"This is a check box"
	let TheChunk=GetWindowName (TheWindow)
ElIf (TheType==WT_GROUPBOX)  then
	SayFormattedMessage (OT_help, cmsg92_L);"This is a groupbox"
ElIf (TheType==WT_3STATE)  then
	SayFormattedMessage (OT_help, cmsg91_L);"This is a check box"
ElIf (TheType==WT_SDM)  then
	SayFormattedMessage (OT_help, cmsg90_L);"This is a dialog box"
ElIf (TheType==WT_BITMAP)  then
	SaveCursor()
	InvisibleCursor ()
	MoveToGraphic (GRAPHIC_PRIOR)
	MoveToGraphic (GRAPHIC_NEXT)
	let TheChunk=GetChunk ()
	RestoreCursor()
	SayFormattedMessage (OT_help, cMsg259_L);"Bitmap "
ElIf (TheType==WT_HOTKEY)  then
	If Not (TheChunk==cscNull) Then
		SayFormattedMessage (OT_help, cmsg93_L);"This is a hot key or short cut key edit control"
	endIf
	let HasPrompt=TRUE
ElIf (TheType==WT_TABCONTROL)  then
	SayFormattedMessage (OT_help, cMsg261_L);"Tab Control "
	let IsDialogTabPage=FALSE
ElIf (TheType==WT_LISTVIEW)  then
	SayFormattedMessage (OT_help, cMsg262_L);"An Icon in a listview "
	let TheChunk=cscNull
ElIf (TheType==WT_TREEVIEW)  then
	SayFormattedMessage (OT_help, cMsg263_L);"An item in a Tree view "
	let TheChunk=cscNull
ElIf (TheType==WT_STARTBUTTON)  then
	SayFormattedMessage (OT_help, cmsg31_L);"Start Button"
	let TheChunk=cscNull
ElIf (TheType==WT_STARTMENU)  then
	SayFormattedMessage (OT_help, cmsg4_L+cMsg255_L);"Start Menu"+"Item "
	let TheChunk=TheLine
ElIf (TheType==WT_CONTEXTMENU)  then
	SayFormattedMessage (OT_help, cmsg5_L+cMsg255_L);"Context Menu"+"Item "
	let TheChunk=TheLine
ElIf (TheType==WT_TASKBAR)  then
	SayFormattedMessage (OT_help, cmsg32_L+ cwc290);"TaskBar"+"Button"
;WT_MENUBAR not implemented
ElIf (TheType==WT_MULTISELECT_LISTBOX)  then
	let TheType=WT_LISTBOX
	If Not (TheChunk==cscNull) Then
		SayFormattedMessage (OT_help, cMsg255_L);"Item "
	endIf
	let HasPrompt=TRUE
ElIf (TheType==WT_EXTENDEDSELECT_LISTBOX)  then
	let TheType=WT_LISTBOX
	If Not (TheChunk==cscNull) Then
		SayFormattedMessage (OT_help, cMsg255_L);"Item "
	endIf
	let HasPrompt=TRUE
ElIf (TheType==WT_LEFTRIGHTSLIDER)  then
	let TheType=WT_SLIDER
	SayFormattedMessage (OT_help, cmsg94_L);"This is a horizontal slider"
	let HasPrompt=TRUE
ElIf (TheType==WT_UPDOWNSLIDER)  then
	let TheType=WT_SLIDER
	SayFormattedMessage (OT_help, cmsg95_L);"This is a vertical slider"
	let HasPrompt=TRUE
ElIf (TheType==WT_EDITCOMBO)  then
	If Not (TheChunk==cscNull) Then
		SayFormattedMessage (OT_help, cMsg256_L);"Text "
	endIf
	let HasPrompt=TRUE
ElIf (TheType==WT_PASSWORDEDIT)  then
	let HasPrompt=TRUE
ElIf (TheType==WT_READONLYEDIT)  then
	If Not (TheChunk==cscNull) Then
		SayFormattedMessage (OT_help, cMsg256_L);"Text "
	endIf
	let HasPrompt=TRUE
ElIf (TheType==WT_COMMANDBAR)  then
	SayFormattedMessage (OT_help, cmsg169_L);"This is a command bar"
ElIf (TheType==WT_UPDOWNSCROLLBAR)  then
	let HasPrompt=TRUE
	let TheType=WT_SCROLLBAR
ElIf (TheType==WT_LEFTRIGHTSCROLLBAR)  then
	let HasPrompt=TRUE
	let TheType=WT_SCROLLBAR
endIf
If (Not MenuItem ) then
	If ((TheType==WT_STATUSBAR)||(TheType==WT_HEADERBAR))  then
		;Do nothing because this probably gives to much spoken text
	Elif ((TheType==WT_SCROLLBAR)||(TheType==WT_SLIDER)||(TheType==WT_SPINBOX)) then
		;Do nothing because their should be an empty string in TheChunk
	Else
		Say (TheChunk+" ", OT_help)
	endIf
	If (HasPrompt) Then
		If ((Not PromptSelected)&&(TheChunk!=cscNull)) Then
				SayFormattedMessage (OT_help, cMsg260_L, cmsgSilent);"In "
		endIf
		let TheControlName=GetWindowName (TheWindow)
		If (TheType==WT_COMBOBOX)  then
			SayFormattedMessage (OT_help, cMsg265_L+TheControlName);"Combobox "
		ElIf (TheType==WT_EDIT)  then
			SayFormattedMessage (OT_help, cMsg266_L+TheControlName);"Edit "
		ElIf (TheType==WT_PASSWORDEDIT)  then
			SayFormattedMessage (OT_help, cMsg267_L+TheControlName);"PassWord Edit "
		ElIf (TheType==WT_EDITCOMBO)  then
			SayFormattedMessage (OT_help, cMsg268_L+TheControlName);"Edit Combo"
		ElIf (TheType==WT_LISTBOX)  then
			SayFormattedMessage (OT_help, cMsg269_L+TheControlName);"Listbox "
		ElIf (TheType==WT_RADIOBUTTON)  then
		ElIf (TheType==WT_HOTKEY)  then
			SayFormattedMessage (OT_help, cMsg270_L+TheControlName);"HotKeyEdit "
		Else
			Say (TheControlName, OT_help)
		endIf
	endIf ;(HasPrompt)
	If ((TheRealType==WT_DIALOG)&&(TheType!=WT_DIALOG)&&(TheChunk!=cscNull))then
		If (IsDialogTabPage) Then
			SayFormattedMessage (OT_help, cMsg271_L + ThePageName+ " ", cMsg271_S + thePageName + " ");"on tabpage"
		endIf
		SayFormattedMessage (OT_help, cMsg272_L + GetWindowName (TheRealWindow)+ " ", cMsg272_S + GetWindowName (TheRealWindow)+ " ");"in dialog window "
	endIf
Elif (MenuItem) then
	SayFormattedMessage (OT_help, TheLine+cMsg273_L+TheMenu+" ", TheLine+cMsg273_S+TheMenu+" ");"from menu "
endIf
let TheAppWindow=GetAppMainWindow (TheWindow)
If Not (GetWindowName (TheAppWindow)==cscNull) Then
	SayFormattedMessage (OT_help, cMsg274_L + GetWindowName (TheAppWindow), cMsg274_S + GetWindowName (TheAppWindow));"in application "
endIf
EndFunction

void Function RightClickWithBraille ()
var
	int nX,
	int nY,
	int nCell,
	;Virtual Pc Cursor:
	int nvpcX,
	int nvpcY
let nCell = GetLastBrailleRoutingKey()
If (nCell>200) then
	let nCell=NCell-200
endIf
let nX = GetBrailleCellColumn(nCell)
let nY = GetBrailleCellRow(nCell)
;If 1 then BrailleMessage (IntToString(nX)+","+IntToString(nY)) Return EndIf
;if (nY == 0) then;???
;	return;???
;endIf;???
If UserBufferIsActive () then
	Return;No right-click option
EndIf
If (IsVirtualPcCursor ()) Then
	Let nvpcX = GetCursorCol ()
	Let nvpcY = GetCursorRow ()
	If (nvpcX != nX || nvpcY != nY) then
		;Move Virtual PcCursor to BrailleCursor location
		PcCursor ()
		MoveTo(nvpcX,nvpcY)
	EndIf
	;If not editable, use RigetMouse.  Else, we send the application key through
	If (IsFormsModeActive() || GetObjectTypeCode() == WT_EDIT ||
	GetWindowTypeCode (GetCurrentWindow ()) == WT_EDIT) then
		PerformScript SendApplicationKey()
	Else
		RightMouseButton()
	EndIf
	Return
ElIf (BrailleIsStructuredLine ()) then;
	;If coords are zero, run PC Apps key:
	If (nX <= 1 || nY <= 1) then
		PerformScript SendApplicationKey()
		Return
	EndIf
EndIf
;If 1 then BrailleMessage("KILL") Return EndIf
;Default:
;modifications made, so we can support new fsdom documents:
;First, position cursor, especially relevant in fsDOM edit windows like Office:
;Also, do not double-tap if Braille and PC at same pos:
;If 1 then BrailleMessage(IntToString (GetActiveCursor ())) Return EndIf
;If 1 then BrailleMessage (GetActiveCursorName()) Return EndIf
;If IsPcCursor () && (nX != GetCursorCol() || nY != GetCursorRow()) then
If StringContains (GetActiveCursorName(), CURSOR_FSDOM_EDIT) then
	;If 1 then BrailleMessage ("Right Area") Return EndIf
	BrailleRoutingButton (NCELL);SET BRAILLE CURSOR;
	PerformScript SendApplicationKey()
	Return
EndIf
SaveCursor()
JAWSCursor ()
SaveCursor ()
MoveTo(nX,nY)
;RouteJAWSToBraille ()
RightMouseButton ()
RestoreCursor()
EndFunction

Void Function BrailleSetAllCursorDots (string PcCursorDots, string JAWSCursorDots,
string InvisibleCursorDots)
SaveCursor()
PcCursor()
BrailleSetCursorDots (PcCursorDots)
JAWSCursor()
BrailleSetCursorDots (JAWSCursorDots)
InvisibleCursor()
BrailleSetCursorDots (InvisibleCursorDots)
RestoreCursor()
EndFunction

Void Function BrailleSaveAllCursorDots ()
SaveCursor()
PcCursor()
let OldPcCursorDots = BraillegetCursorDots()
JAWSCursor()
let OldJAWSCursorDots = BraillegetCursorDots()
InvisibleCursor()
let OldInvisibleCursorDots = BraillegetCursorDots()
RestoreCursor()
EndFunction

Void Function BrailleSetAllCursorsBlinkRate (int NewBlinkRate)
SaveCursor()
PcCursor()
SetDefaultJcfOption (optbrl_cursor_blink_rate, NewBlinkRate)
JAWSCursor()
SetDefaultJcfOption (optbrl_cursor_blink_rate, NewBlinkRate)
InvisibleCursor()
SetDefaultJcfOption (optbrl_cursor_blink_rate, NewBlinkRate)
RestoreCursor()
EndFunction

void Function ToggleShapeOfCursors ()
If (BrailleCursorShape == 0) Then
	let BrailleCursorShape = BrailleCursorShape + 1
	BrailleSetAllCursorsBlinkRate(0)
Return
ElIf (BrailleCursorShape == 1) Then
	let BrailleCursorShape = BrailleCursorShape + 1
	BrailleSaveAllCursorDots()
	BrailleSetAllCursorDots("78", "78", "78")
	BrailleSetAllCursorsBlinkRate(500)
	Return
ElIf (BrailleCursorShape == 2) Then
	let BrailleCursorShape = BrailleCursorShape + 1
	BrailleSetAllCursorsBlinkRate(0)
	Return
ElIf (BrailleCursorShape == 3) Then
	let BrailleCursorShape = BrailleCursorShape + 1
	BrailleSetAllCursorDots("12345678", "12345678", "12345678")
	BrailleSetAllCursorsBlinkRate(500)
	Return
ElIf (BrailleCursorShape == 4) Then
	let BrailleCursorShape = BrailleCursorShape + 1
	BrailleSetAllCursorsBlinkRate(0)
	Return
ElIf (BrailleCursorShape == 5) Then
	let BrailleCursorShape = 0
	BrailleSetAllCursorDots(OldPcCursorDots, OldJAWSCursorDots, OldInvisibleCursorDots)
	BrailleSetAllCursorsBlinkRate(BrailleOldBlinkRate)
EndIf
EndFunction

Void Function BrailleToggleCursorBlinking ()
var
	int Current_Blink_Rate
let Current_Blink_Rate=GetDefaultJcfOption(OptBrl_Cursor_Blink_Rate)
If (Current_Blink_Rate !=0-1) Then
	let BrailleOldBlinkRate2 = GetDefaultJcfOption(OptBrl_Cursor_Blink_Rate)
	BrailleSetAllCursorsBlinkRate(0-1)
Else
	BrailleSetAllCursorsBlinkRate (BrailleOldBlinkRate2)
endIf
EndFunction

; obsolete but retained for backward compatibility, must return false to use
;new code
;just in case external scripts contain the old BrailleBuildLine which may call
;the folllowing three functions
int function BrailleBuildMenu()
return false
endFunction

int Function BrailleBuildDialog (handle hwndReal)
return false
endFunction

int Function BrailleBuildOther (int WindowSubTypeCode)
return false
endFunction

int function ToggleBraillePanMode()
var
	int nPanMode,
	int nIncrement
let nPanMode=GetDefaultJCFOption(OPT_BRL_PAN_MODE)
if nPanMode == brlUserPanSmart then
	let nPanMode = brlUserPanBestFit
else
	let nPanMode = nPanMode+1
EndIf
let nIncrement = GetDefaultJCFOption(OPT_BRL_PAN_INCREMENT)
if !nIncrement then
	let nIncrement = BrailleGetCellCount()
endIf
SetDefaultJCFOption(OPT_BRL_PAN_MODE,nPanMode)
if nPanMode == brlUserPanSmart then
	SayMessage(ot_status, msgBrlUserPanAutomatic_L, msgBrlUserPanAutomatic_S)
ElIf nPanMode == brlUserPanMaximizeText then
	SayMessage(ot_status, msgBrlUserPanMaxText_L, msgBrlUserPanMaxText_S)
ElIf nPanMode == brlUserPanFixed then
	SayMessage(ot_status, formatString(msgBrlUserPanFixedInc_L, intToString(nIncrement)), formatString(msgBrlUserPanFixedInc_S, intToString(nIncrement)))
ElIf nPanMode == brlUserPanBestFit then
	SayMessage(ot_status, msgBrlUserPanBestFit_L, msgBrlUserPanBestFit_S)
endIf
Return nPanMode
endFunction

String Function PanModeOption (optional int iRetCurVal)
var
	int nPanMode,
	int nIncrement,
	string strListText
let nPanMode = GetJCFOption(OPT_BRL_PAN_MODE)
let nIncrement = GetJCFOption(OPT_BRL_PAN_INCREMENT)
if !nIncrement then
	let nIncrement = BrailleGetCellCount()
endIf
If !iRetCurVal then
	;Update it
	if nPanMode == brlUserPanSmart then
		let nPanMode = brlUserPanBestFit
	else
		let nPanMode = nPanMode+1
	EndIf
	SetJcfOption(OPT_BRL_PAN_MODE, nPanMode)
EndIf
if nPanMode == brlUserPanSmart then
	return msgBrlUserPanAutomatic_S
ElIf nPanMode == brlUserPanMaximizeText then
	return msgBrlUserPanMaxText_S
ElIf nPanMode == brlUserPanFixed then
	return formatString(msgBrlUserPanFixedInc_S, intToString(nIncrement))
ElIf nPanMode == brlUserPanBestFit then
	return msgBrlUserPanBestFit_S
endIf
EndFunction

String Function UOPanBy(int iRetCurVal)
var
	int nPanMode,
	int nIncrement,
	string strListText
let nPanMode = GetJCFOption(OPT_BRL_PAN_MODE)
let nIncrement = GetJCFOption(OPT_BRL_PAN_INCREMENT)
if !nIncrement then
	let nIncrement = BrailleGetCellCount()
endIf
If !iRetCurVal then
	if nPanMode == brlUserPanSmart then
		let nPanMode = brlUserPanBestFit
	else
		let nPanMode = nPanMode+1
	EndIf
	SetJcfOption(OPT_BRL_PAN_MODE, nPanMode)
EndIf
return UOPanByTextOutput(nPanMode,nIncrement)
EndFunction

string function UOPanByTextOutput(int setting, int increment)
if setting == brlUserPanSmart then
	return msgBrlUserPanAutomatic_S
ElIf setting == brlUserPanMaximizeText then
	return msgBrlUserPanMaxText_S
ElIf setting == brlUserPanFixed then
	return formatString(msgBrlUserPanFixedInc_S, intToString(increment))
ElIf setting == brlUserPanBestFit then
	return msgBrlUserPanBestFit_S
endIf
EndFunction

String Function UOPanByHlp()
Return FormatString(msgUO_BrlPanByHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOPanByTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_BraillePanMode),
		GetIntOptionDefaultSetting(section_braille,hKey_Braille_BraillePanIncrement)))
EndFunction

int function BrailleIncreasePanIncrement()
var
	int nInc
let nInc=GetDefaultJCFOption(OPT_BRL_PAN_INCREMENT)
if nInc+5 <=BrailleGetCellCount() then
	let nInc=nInc+5
else
	let nInc=5
endIf
SetDefaultJCFOption(OPT_BRL_PAN_INCREMENT, nInc)
SayFormattedMessage(ot_status, formatString(msgBrlUserPanIncrement_L, intToString(nInc)), formatString(msgBrlUserPanIncrement_S, intToString(nInc)))
return nInc
endFunction

string Function IncreasePanIncrementOption (optional int iRetCurVal)
var
	int nPanMode,
	int nInc
let nPanMode=GetJCFOption(OPT_BRL_PAN_MODE)
;Don't change this setting if not set to Fixed panning:
if nPanMode == brlUserPanSmart then
	return msgBrlUserPanAutomatic_S
ElIf nPanMode == brlUserPanMaximizeText then
	return msgBrlUserPanMaxText_S
ElIf nPanMode == brlUserPanBestFit then
	return msgBrlUserPanBestFit_S
endIf
let nInc=GetJCFOption(OPT_BRL_PAN_INCREMENT)
If !iRetCurVal then
	;Update it
	if nInc+5 <=BrailleGetCellCount() then
		let nInc=nInc+5
	else
		let nInc=5
	endIf
	SetJCFOption(OPT_BRL_PAN_INCREMENT, nInc)
EndIf
Return formatString(msgBrlUserPanIncrement_S, intToString(nInc))
EndFunction

int function BrailleDecreasePanIncrement()
var
	int nInc
let nInc=GetDefaultJCFOption(OPT_BRL_PAN_INCREMENT)
if nInc >=10 then
	let nInc=nInc-5
else
	let nInc=BrailleGetCellCount()
endIf
SetDefaultJCFOption(OPT_BRL_PAN_INCREMENT, nInc)
SayFormattedMessage(ot_status, formatString(msgBrlUserPanIncrement_L, intToString(nInc)), formatString(msgBrlUserPanIncrement_S, intToString(nInc)))
return nInc
endFunction

string Function DecreasePanIncrementOption (optional int iRetCurVal)
var
	int nPanMode,
	int nInc
let nPanMode=GetJCFOption(OPT_BRL_PAN_MODE)
;Don't change this setting if not set to Fixed panning:
if nPanMode == brlUserPanSmart then
	return msgBrlUserPanAutomatic_S
ElIf nPanMode == brlUserPanMaximizeText then
	return msgBrlUserPanMaxText_S
ElIf nPanMode == brlUserPanBestFit then
	return msgBrlUserPanBestFit_S
endIf
let nInc=GetJCFOption(OPT_BRL_PAN_INCREMENT)
If !iRetCurVal then
	;Update it
	if nInc >=10 then
		let nInc=nInc-5
	else
		let nInc=BrailleGetCellCount()
	endIf
	SetJcfOption (OPT_BRL_PAN_INCREMENT, nInc)
EndIf
Return formatString(msgBrlUserPanIncrement_S, intToString(nInc))
EndFunction

string Function BrlWordWrapOption (int iRetCurVal)
var
	int iWordWrap
Let iWordWrap = GetJcfOption(OPT_BRL_WORDWRAP)
if !iRetCurVal then
	;Update it
	Let iWordWrap = !iWordWrap
	SetJCFOption(OPT_BRL_WORDWRAP,iWordWrap)
EndIf
If iWordWrap then
	Return msgBrlOptionOn
Else
	Return msgBrlOptionOff
EndIf
EndFunction

string Function UOWordWrap(int iRetCurVal)
var
	int iWordWrap
Let iWordWrap = GetJcfOption(OPT_BRL_WORDWRAP)
if !iRetCurVal then
	Let iWordWrap = !iWordWrap
	SetJCFOption(OPT_BRL_WORDWRAP,iWordWrap)
EndIf
return UOWordWrapTextOutput(iWordWrap)
EndFunction

string Function UOWordWrapTextOutput(int setting)
If setting then
	Return msgUO_On
Else
	Return msgUO_Off
EndIf
EndFunction

string Function UOWordWrapHlp()
Return FormatString(msgUO_BrlWordWrapHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOWordWrapTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_WordWrap)))
EndFunction

string Function AutoPanModeOption(int iRetCurVal)
var
	int nPanMode,
	string strListText
let nPanMode = GetJCFOption(OPT_BRL_POSITIONING_MODE)
If !iRetCurVal then
	;Update it
	if nPanMode == brlAutoPanSmart then
		let nPanMode = brlAutoPanOff
	else
		let nPanMode = nPanMode+1
	EndIf
	SetJcfOption(OPT_BRL_POSITIONING_MODE, nPanMode)
EndIf
if nPanMode == brlAutoPanSmart then
	return msgBrlAutoPanSmart_S
ElIf nPanMode == brlAutoPanMaximizeTextBeforeCursor then
	return msgBrlAutoPanMaximizeTextBeforeCursor_S
ElIf nPanMode == brlAutoPanMaximizeTextAfterCursor then
	return msgBrlAutoPanMaximizeTextAfterCursor_S
ElIf nPanMode == brlAutoPanToMiddle then
	return msgBrlAutoPanToMiddle_S
ElIf nPanMode == brlAutoPanMatchUserPan then
	return msgBrlAutoPanMatchUserPan_S
ElIf nPanMode == brlAutoPanMinimal then
	return msgBrlAutoPanMinimal_S
ElIf nPanMode == brlAutoPanOff then
	return msgBrlAutoPanOff_S
endIf
EndFunction

string Function UOAutoPan(int iRetCurVal)
var
	int nPanMode,
	string strListText
let nPanMode = GetJCFOption(OPT_BRL_POSITIONING_MODE)
If !iRetCurVal then
	if nPanMode == brlAutoPanSmart then
		let nPanMode = brlAutoPanOff
	else
		let nPanMode = nPanMode+1
	EndIf
	SetJcfOption(OPT_BRL_POSITIONING_MODE, nPanMode)
EndIf
return UOAutoPanTextOutput(nPanMode)
EndFunction

string Function UOAutoPanTextOutput(int setting)
if setting == brlAutoPanSmart then
	return msgBrlAutoPanSmart_S
ElIf setting == brlAutoPanMaximizeTextBeforeCursor then
	return msgBrlAutoPanMaximizeTextBeforeCursor_S
ElIf setting == brlAutoPanMaximizeTextAfterCursor then
	return msgBrlAutoPanMaximizeTextAfterCursor_S
ElIf setting == brlAutoPanToMiddle then
	return msgBrlAutoPanToMiddle_S
ElIf setting == brlAutoPanMatchUserPan then
	return msgBrlAutoPanMatchUserPan_S
ElIf setting == brlAutoPanMinimal then
	return msgBrlAutoPanMinimal_S
ElIf setting == brlAutoPanOff then
	return msgBrlAutoPanOff_S
endIf
EndFunction

string Function UOAutoPanHlp()
Return FormatString(msgUO_BrlAutoPanHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOAutoPanTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_AutoPanMode)))
EndFunction

int function BrailleAddObjectName (int nSubtypeCode)
var
	handle hWnd,
	string strNameText
if IsTouchCursor() then
	BrailleAddString(BrailleGetObjectNameForTouchNavElement(),0,0,0)
	return true
EndIf
;The reasoning here is that if we support edit callbacks, the best thing to show is the line segment at the cursor.
if nSubtypeCode==WT_TABLECELL && GetObjectIsEditable() then
	brailleAddFocusLine()
	return true
endIf 
if nSubtypeCode == wt_ListBox
|| nSubtypeCode == wt_ListBoxItem
	;Normally we want to show the list name,
	;but for the Windows Explorer Items View list
	;and default Open and Save As dialog Items View lists,
	;popular demand is that we suppress the name output:
	if GetObjectClassName(2) == UIAClass_ShellDLL_DefView
	|| GetObjectClassName(3) == UIAClass_ShellDLL_DefView
	|| IsEmptyFolder()
		return true
	endIf
endIf
If ! MenusActive () then
	Return FALSE
EndIf
Let hWnd = GetFocus ()
;If GetWindowSubtypeCode (hWnd) == WT_LISTVIEW then
If nSubtypeCode == WT_LISTVIEW then
/*Add Name component by string, look for EndComment:
	Let strNameText = lvGetItemText (
	hWnd, lvGetFocusItem (hWnd), 1)
	;Add attributes to support where they aren't, e.g. ATTRIB_HIGHLIGHT bit:
	If strNameText then
		BrailleAddString (strNameText,
		GetCursorCol (), GetCursorRow (), ATTRIB_HIGHLIGHT)
		Return TRUE;No further processing, avoid OSM
	EndIf
EndComment:*/
	Let strNameText = cwnBrlResultsList
	BrailleAddString (strNameText,0,0,0)
	Return TRUE;
EndIf
If nSubtypeCode == WT_EDIT then
	BrailleAddString (
	GetWindowName (hWnd),0,0,0)
	Return TRUE
EndIf
return false
endFunction

int function BrailleAddObjectType(int nSubtypeCode)
if IsTouchCursor() then
	BrailleAddString(GetTouchNavElementBrlSubtypeString(),0,0,0)
	return true
EndIf
if (nSubtypeCode == WT_TABLECELL
	&& !InARIAGrid()) then
	return true
EndIf
return false
endFunction

int function BrailleAddObjectRowHeader(int nSubtypeCode)
if IsTouchCursor() then
	return FALSE
EndIf
if (!InARIAGrid ())
	return false
EndIf
if (!IsFormsModeActive () && !IsInsideARIAApplication ())
	return false
EndIf
If GIBrlTBLZoom != ZOOM_TO_CURRENT_CELL then
	;headers are handled as part of the zoom to row or column:
	return true
EndIf
var
	string rowHeader
let rowHeader = GetRowHeader(GIBrlTblHeader==HEADER_MARKED)
if RowHeader then
	BrailleAddString (rowHeader, 0, 0,0)
EndIf
return true
endFunction

int function BrailleAddObjectColumnHeader(int nSubtypeCode)
if IsTouchCursor() then
	return FALSE
EndIf
if (!InARIAGrid())
	return false
EndIf
if (!IsFormsModeActive () && !IsInsideARIAApplication ())
	return false
EndIf
If GIBrlTBLZoom != ZOOM_TO_CURRENT_CELL then
	;headers are handled as part of the zoom to row or column:
	return true
EndIf
var
	string columnHeader
let columnHeader = GetColumnHeader(GIBrlTblHeader==HEADER_MARKED)
if columnHeader then
	BrailleAddString (columnHeader, 0, 0,0)
EndIf
return true
EndFunction

int function BrailleAddObjectValue(int nSubtypeCode)
var
	int objectSubtypeCode = GetObjectSubtypeCode(SOURCE_CACHED_DATA),
	string sValue
if IsTouchCursor() then
	BrailleAddString(BrailleGetObjectValueForTouchNavElement(),0,0,
		TouchElementIsSelected()<<6)
	return true
EndIf
If MenusActive () then
	If nSubtypeCode == WT_EDIT then
		var string SearchItem = GetObjectValue(SOURCE_CACHED_DATA)
		if ! StringIsBlank (SearchItem) then
		; object value will leave off the last character, but WindowText gets it correctly.
			BrailleAddString (GetWindowText (GetFocus (), READ_EVERYTHING), 0,0,ATTRIB_HIGHLIGHT)
			Return TRUE
		endIf
		BrailleAddString (
		cmsgBrlSearchTermEdit,GetCursorCol(),GetCursorRow(),ATTRIB_HIGHLIGHT)
		Return TRUE;
	EndIf
	;For Vista ListViews in Search Results under Start Menu:
	If nSubtypeCode == WT_LISTVIEW then
		BrailleAddString (GetObjectName(SOURCE_CACHED_DATA),
		GetCursorCol (), GetCursorRow (), ATTRIB_HIGHLIGHT)
		Return TRUE
	EndIf
EndIf
if nSubtypecode == WT_CLOCK then
	sValue = getObjectName ()
	if stringIsBlank (sValue) then return FALSE endIf
	if StringContains (sValue, cwnBrlClockStringToRemove) then
		sValue = stringReplaceSubstrings (sValue, cwnBrlClockStringToRemove, cscNull)
	endIf
	if stringIsBlank (sValue) then return FALSE endIf ; in case there was no time, but just a name, let internals do it.
	BrailleAddString (sValue, 0,0,0)
	return TRUE
endIf
; make sure inline tables get their coordinates represented when editing documents.
; Example, Microsoft Mail.
if nSubtypeCode == WT_TABLE
&& (objectSubtypeCode == wt_multiline_edit || objectSubtypeCode == WT_DOCUMENT) then
	var int col, int row
	if GetEditCellCoordinates(col, row) then
		BrailleCoordinates (col, row)
	endIf
	return FALSE; Allow internals to handle the actual text.
endIf
;Ensure that DateTime Picker gets the focus line.
;This keeps track of cursor position and renders accurate marking.
If nSubtypeCode == wt_DateTime then
	BrailleAddFocusLine ()
	Return TRUE;
EndIf
if nSubtypeCode == wt_ProgressBar
&& c_FocusableProgressBar
&& CollectionItemExists(c_FocusableProgressBar,"value")
	BrailleAddString(FormatString(cmsgDocumentPercentage,c_FocusableProgressBar.value),0,0,0)
	return true
endIf
if nSubtypeCode == WT_TASKBAR then
	if IsWindows7() then
		BrailleAddString(GetObjectName()+cscSpace+BrailleGetSubtypeString(GetObjectSubtypeCode()),GetCursorCol(), GetCursorRow(),0)
		return true
	EndIf
elIf inHjDialog () then
	if nSubtypeCode == WT_COMBOBOX then
		sValue = getObjectValue(SOURCE_CACHED_DATA)
		if ! stringIsBlank (sValue) then
			BrailleAddString (sValue, getCursorCol (), getCursorRow (), ATTRIB_HIGHLIGHT)
			return TRUE
		endIf
	endIf
elIf onViewSliderControl (ObjectSubtypeCode)
	BrailleAddString (getObjectValue(SOURCE_CACHED_DATA), 0,0,0)
	return TRUE
EndIf
return false
endFunction

int function BrailleAddObjectState(int nSubtypeCode)
var
	int nMSAAState = 0
if IsTouchCursor() then
	SuppressG2TranslationForNextStructuredModeSegment()
	BrailleAddString (GetTouchNavElementBrlStateString(nSubtypeCode), 0,0,0)return TRUE
EndIf
If nSubtypeCode == WT_LISTVIEW then
	If GetWindowSubtypeCode (GetFocus ()) == WT_LISTVIEW then
		If gstrListViewGroupName then
			BrailleAddString (gstrListViewGroupName,0,0,0)
			Return TRUE;
		EndIf
	EndIf
elIf nSubtypeCode == WT_GROUPBOX then
	;old-fashioned group boxes in dialogs should not have states at all:
	if getWindowClass (getRealWindow (getFocus ())) == cWc_dlg32770
	&& controlCanBeChecked () || getGroupBoxName () then
		return TRUE;no Braille no state.
	endIf
elIf ((nSubtypeCode == WT_TREEVIEW || nSubtypeCode == WT_TREEVIEWITEM)
;All windows whose class name contains the text UI are suspect to not handle closed controls properly:
&& stringContains (getWindowClass (getFocus ()), "UI"))
	; tree view items whose state is gotten via MSAA, and misreports:
	;nMSAAState = GetObjectStateCode (TRUE) ; if hotfix gets this we need to use getControlAttributes  without selection to reflect STATE_SYSTEM_NORMAL
	nMSAAState = GetControlAttributes()& ~CTRL_SELECTED
	if ( nMSAAState && ! (nMSAAState & CTRL_OPENED))
	; && (getControlAttributes () & CTRL_HASCHILDREN))
		SuppressG2TranslationForNextStructuredModeSegment()
		BrailleAddString (BrailleGetStateString(CTRL_COLLAPSED), 0,0,0)
		return TRUE
	endIf
elif nSubtypeCode == WT_TabControl
	nMSAAState = (GetObjectStateCode() & (CTRL_OPENED | CTRL_CLOSED))
	if nMSAAState
		SuppressG2TranslationForNextStructuredModeSegment()
		BrailleAddString(BrailleGetStateString(CTRL_HASCHILDREN|nMSAAState),GetCursorCol(),GetCursorRow(),0,0)
		return true
	EndIf
elIf nSubtypeCode == wt_Listbox
&& IsEmptyFolder()
	;do not show read only state in empty folders
	return true
endIf
return false
endFunction

int function ShouldAddCellCoordinates(int subtypeCode)
return (InARIAGrid() && IsFormsModeActive () && IsInsideARIAApplication ()) 
|| (subtypeCode==WT_TABLECELL && SupportsEditCallbacks()) 
endFunction

int function BrailleAddCellCoordinates()
var
	int col,
	int row,
	string coordinates
if !GetCellCoordinates( col, row ) then
	return false
endIf
Let coordinates = FormatString(cmsgColumnRowCoordinates,IntToString (Col),IntToString (row))
BrailleAddString (coordinates,0,0,0)
return true
endFunction
 
int function BrailleAddObjectPosition(int nSubtypeCode)
if IsTouchCursor() then
	BrailleAddString(GetTouchNavElementBrlPositionString(nSubtypeCode),0,0,0)
	return TRUE
endIf
if nSubtypeCode == WT_LISTBOX
&& StringIsBlank (PositionInGroup ()) 
; protect list boxes where position info is missing but there is a focused item.
&& StringIsBlank (GetObjectValue(SOURCE_CACHED_DATA)) then
	BrailleAddString (cmsgBrlPositionZeroItems, 0,0,0)
	return TRUE
endIf
if ShouldAddCellCoordinates(nSubtypeCode) then
	return BrailleAddCellCoordinates()
endIf
return false
endFunction

int function BrailleAddObjectLevel(int nSubtypeCode)
;for treegrid row level:
if nSubtypeCode == wt_row
	var string levelAttrib = GetObjectIA2Attribute("level")
	if levelAttrib
		var string level = IntToString(StringToInt(levelAttrib)-1)
		brailleAddString(level,0,0,0,0)
		return true
	endIf
endIf
; for treeview level:
return false
endFunction

int function BrailleAddObjectDlgPageName(int nSubtypeCode)
return false
endFunction

int function BrailleAddObjectDlgText(int nSubtypeCode)
var
	handle hWnd,
	string sdlgText
;Handle wizard text,
;where dialog static doesn't exist, but Dialog Page Static does:
Let sDlgText = GetDialogStaticText ()
If ! sDlgText then
	Let sDlgText = MSAAGetDialogStaticText ()
EndIf
If sDlgText then
	Return FALSE
EndIf
Let hWnd = GetFirstWindow (GetFocus ())
If GetWindowSubtypeCode (hWnd) != WT_DIALOG_PAGE then
	Return FALSE
EndIf
if stringCompare(getWindowName(getTopLevelWindow(hwnd)), cWnJAWSStartup, False) == 0
|| inHjDialog () then
	; Prevents extra text from showing in Braille in the JAWS Startup Wizard.
	return False
endIf
Let sdlgText	= GetWindowText (hWnd, FALSE)
If (! sdlgText)	then
	return false
EndIf
BrailleAddString (sdlgText,0,0,0)
return true
endFunction

int function BrailleAddObjectContainerName(int nSubtypeCode)
return false
endFunction

int function BrailleAddObjectContainerType(int nSubtypeCode)
return false
endFunction

int function BrailleAddObjectTime(int nSubtypeCode)
; primarily used for taskbar but can add time to any other control's components
return false
endFunction

int function BrailleAddObjectDescription(int nSubtypeCode)
return false
EndFunction

int function BrailleCallbackObjectIdentify()
; when a window type is unknown, ie 0, this function is called.
;It is responsible for returning the subtype code or a custom code for one of
;upto 32 custom controls which maybe defined.
; for example, if in MSWord, a table is active then you could return wt_TABLE.
;If in MSAccess and the object model exposes a checkbox then you could return
;WT_CHECKBOX
; note that in most cases, if the window type is unknown, you will also have
;to override the other braille related functions regardless of whether you map
;the unknown control to a standard control or to one of the 32 custom controls.
; to map to one of the 32 custom controls, you must add a section to the jbs
;for the application. The section must be called [CustomControlN] where N is
;a number between 1 and 32.
;This function must then return WT_CUSTOM_CONTROL_BASE+N.
;For tables in HTML,
;or Other tables handled by the Virtual Cursor
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
if InTable () 
&& (GetSelectionContext () & selCtxTableCell) then 
	var int ObjectSubtypeCode = getObjectSubtypeCode(SOURCE_CACHED_DATA)
	if ObjectSubtypeCode == wt_multiline_edit 
	|| ObjectSubtypeCode == wt_DOCUMENT then
		return WT_TABLE ; coordinates get updated as part of value.
	endIf
endIf
; empty folder in open or save as dialogs.
if IsEmptyFolder()
	return WT_LISTBOX
endIf
return 0
endFunction

int function PointNeedsMarking(int x, int y)
;This function is only called if the OPT_BRL_CHECK_EXT_MARKING jcf option is on.
;This must then return true if the character at the supplied point needs
;marking on the display
return false
endFunction

;*********
;HTML Table Functions
;For display in Tables.

Void Function BrailleCoordinates(int iCol, int iRow)
var
	string sCoords
If iCol == 0 ||
iRow == 0 then
	Return
EndIf
Let sCoords = FormatString(cmsgColumnRowCoordinates,IntToString (iCol),IntToString (iRow))
BrailleAddString (sCoords,0,0,0)
EndFunction

Void Function BrailleColumnHeader()
var
	string sHDR
SaveCursor()
BrailleCursor()
Let sHDR = GetColumnHeader(GIBrlTblHeader==HEADER_MARKED)
If !sHDR then
	RestoreCursor()
	Return FALSE
EndIf
BrailleAddString (sHDR,0,0,0)
RestoreCursor()
Return TRUE
EndFunction

Void function BrailleRowHeader()
var
	string sHDR
	SaveCursor()
	BrailleCursor()
Let sHDR = GetRowHeader(GIBrlTblHeader==HEADER_MARKED)
If !sHDR then
	restoreCursor()
	Return FALSE
EndIf
BrailleAddString (sHDR,0,0,0)
RestoreCursor()
Return TRUE
EndFunction

Void function BrailleColumn(optional int iCol, int iRow)
var
	string sText,
	string sHeader,
	int iRowCount
SaveCursor()
BrailleCursor()
If GIBrlShowCoords then
	let sText = FormatString(cmsgColumnCoordinate,iCol)+cscSpace
EndIf
if iRow > 1 then
	let sText = sText+GetColumnText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,1,iRow-1)
EndIf
If GIBrlShowCoords then
	let sText = sText+FormatString(cmsgRowCoordinate,iRow)
EndIf
If GIBrlTblHeader & HEADER_ROW
|| GIBrlTblHeader & HEADER_MARKED then
	let sHeader = GetRowHeader(GIBrlTblHeader==HEADER_MARKED)
	if sHeader then
		let sText = sText+cscSpace+sHeader
	EndIf
EndIf
if sText then
	BrailleAddString(sText,0,0,0)
	SetStructuredSegmentAlignmentToLastStringAdded(); Ensure we align to the coordinates or header just added.
EndIf
BrailleAddFocusCell()
let iRowCount = GetTableRowCount()
if iRow < iRowCount
	let sText = cmsgTablePostFocusCellTextSeparator
		+GetColumnText (cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,iRow+1,iRowCount)
else
	let sText = cmsgTablePostFocusCellTextSeparator
EndIf
BrailleAddString(sText,0,0,0)
RestoreCursor()
EndFunction

Void function BrailleRow(optional int iCol, int iRow)
var
	string sText,
	string sHeader,
	int iColCount
SaveCursor()
BrailleCursor()
If GIBrlShowCoords then
	let sText = FormatString(cmsgRowCoordinate,iRow)+cscSpace
EndIf
if iCol > 1 then
	let sText = sText+GetRowText(cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,1,iCol-1)
EndIf
If GIBrlShowCoords then
	let sText = sText+FormatString(cmsgColumnCoordinate,iCol)
EndIf
If GIBrlTblHeader & HEADER_COLUMN
|| GIBrlTblHeader & HEADER_MARKED then
	let sHeader = GetColumnHeader(GIBrlTblHeader==HEADER_MARKED)
	if sHeader then
		let sText = sText+cscSpace+sHeader
	EndIf
EndIf
if sText then
	BrailleAddString(sText,0,0,0)
	SetStructuredSegmentAlignmentToLastStringAdded(); Ensure we align to the coordinates or header just added.
EndIf
BrailleAddFocusCell()
let iColCount = GetCurrentRowColumnCount()
if iCol < iColCount
	let sText = cmsgTablePostFocusCellTextSeparator
		+GetRowText (cmsgTableCellTextSeparator,cScNull,cMsgBrlBlankCell,iCol+1,iColCount)
else
	let sText = cmsgTablePostFocusCellTextSeparator
EndIf
BrailleAddString(sText,0,0,0)
RestoreCursor()
EndFunction

Void function BrailleTableCell(int iCol, int iRow)
var
	string strText
If iRow == 0 then
	Return
EndIf
Let strText = GetRowText (cScSpace,cScNull,cMsgBrlBlankCell,iCol,iCol)
BrailleAddString (strText,0,0,0)
EndFunction

int function OnFirstLineOfMultilineCell()
if (!InTable()) then
	return false;
endIf
var
string sCellContent=GetCell(),
int nLines=StringSegmentCount(sCellContent,cScBufferNewLine)
if (nLines <=1) then
	return true
endIf
if (StringSegment(sCellContent, cScBufferNewLine, 1)==GetLine()) then
	return true
endIf
return false
endFunction

Int function BrailleAppropriateCellData (int nSubType, int iCol, int iRow)
;Depends on Braille Zoom feature
If GIBrlTBLZoom == ZOOM_TO_CURRENT_CELL then
	If GetJCFOption(optHTMLDocumentPresentationMode)
	|| (!IsVirtualPCCursor() && !OnFirstLineOfMultilineCell())
	|| (nSubType != WT_STATIC && nSubType != WT_TABLECELL) then
		Return FALSE
	endIf
	BrailleAddFocusCell(); This will allow cursor tracking with in the cell data.
ElIf GIBrlTBLZoom == ZOOM_TO_CURRENT_ROW then
	BrailleRow(iCol,iRow)
ElIf GIBrlTBLZoom == ZOOM_TO_CURRENT_COL then
	BrailleColumn(iCol,iRow)
ElIf GIBrlTBLZoom == ZOOM_TO_CUR_ROW_AND_COLTITLES then
	BrailleRowWithColTitles(iCol,iRow)
ElIf GIBrlTBLZoom == ZOOM_TO_CUR_AND_PRIOR_ROW then
	BraillePriorAndCurRow(iCol,iRow)
EndIf
Return TRUE;No further processing.
EndFunction

;For the BrailleToggleTableHeaders Script
void function BrailleToggleTableHeaders ()
;Pass FALSE as parameter to update value
Say (BrailleShowHeaders(FALSE), ot_JAWS_message)
EndFunction

void function BrailleToggleTableReading ()
;Pass FALSE as parameter to update value
Say (BrailleZoom(FALSE), ot_JAWS_message)
EndFunction

int function ShouldAddTableData()
if GIBrlTBLZoom==ZOOM_TO_CURRENT_COL 
	return true ; always do it for column
endIf
; If in screen layout or smart nav mode, never add data from here.
if (GetJCFOption(optHTMLDocumentPresentationMode) || GetJCFOption(optSmartNavigation))
	return false
endIf
return true
endFunction

int Function BrailleTableObjects (int nSubType, int nCol, int nRow)
If !IsVirtualPcCursor()
	Return FALSE;
EndIf
;In Screen Presentation layout, we now show headers and coordinates prior to the screen line, if the cursor is within a table.
If GIBrlTBLZoom == ZOOM_TO_CURRENT_CELL then
	If GIBrlTblHeader == HEADER_ROW
	;Both on, still	do Rows first.
	|| GIBrlTblHeader == HEADER_BOTH
	|| GIBrlTblHeader == HEADER_Marked then
		BrailleRowHeader ()
	EndIf
	If GIBrlTblHeader & HEADER_COLUMN
	|| GIBrlTblHeader == HEADER_Marked then
		BrailleColumnHeader()
	EndIf
	If GIBrlShowCoords then
		BrailleCoordinates(nCol,nRow)
	EndIf
EndIf
; Only do this if not in Screen Presentation Mode.
; If in Screen Presentation Mode, internal code will add the current screen line.
; So, only call BrailleAppropriateCellData for case when doc presentation is not screen layout, or user has chosen to show the current column
if ShouldAddTableData() then
	Return BrailleAppropriateCellData (nSubType,nCol,nRow)
endIf
return false
EndFunction

int function BrailleAddVirtualTableData(int nControlType, int nNestingLevel, int nCol, int nRow)
; add appropriate code and return TRUE if you want to handle
;return false ; let internal code handle
; Cases where an application supports UIA and the user brings up classic virtual viewer,
; such as insert+h, insert+f1,
; links would otherwise show table coordinates instead of the link's name:
if userBufferIsActive ()
&& ! UserBufferIsActiveResultsViewer () then
	return FALSE ; let internal code handle
endIf
Return BrailleTableObjects (nControlType,nCol,nRow)
endFunction

void Function SelectFromBrailleToPCCursor ()
var
	int nPCCol,
	int nPCRow,
	int nBrailleCol,
	int nBrailleRow,
	int nBrailleRoutingKey,
	handle hWnd
If GlobalMenuMode then
	SayFormattedMessage (OT_ERROR, cmsgbrlNoSelectText)
	Return
EndIf
If InHjDialog () then
	SayFormattedMessage (OT_ERROR, cmsgbrlNoSelectText)
	Return
EndIf
If IsVirtualPcCursor () ||
UserBufferIsActive () then
	SayFormattedMessage (OT_ERROR, cmsgbrlNoSelectText)
	Return
EndIf
If !CaretVisible () then
	;Text selection happens in windows with a caret.
	SayFormattedMessage (OT_ERROR, cmsgbrlNoSelectText)
	Return
EndIf
Let nBrailleRoutingKey = GetLastBrailleRoutingKey()
If nBrailleRoutingKey <= 0 then
	SayFormattedMessage (OT_ERROR, cmsgbrlNoSelectText)
	Return
EndIf
Let nBrailleCol = GetBrailleCellColumn (nBrailleRoutingKey)
Let nBrailleRow = GetBrailleCellRow (nBrailleRoutingKey)
SaveCursor ()
PcCursor ()
Let nPCCol = GetCursorCol ()
Let nPcRow = GetCursorRow ()
Let hWnd = GetCurrentWindow ()
RestoreCursor ()
SaveCursor ()
BrailleCursor ()
If hWnd != GetCurrentWindow () then
	SayFormattedMessage (OT_ERROR, cmsgbrlNoSelectText)
	Return
EndIf
RestoreCursor ()
SaveCursor ()
JAWSCursor ()
SaveCursor ()
MoveTo (nPcCol, nPcRow)
Pause ()
LeftMouseButtonLock ()
Delay (1)
MoveTo (nBrailleCol, nBrailleRow)
Pause ()
LeftMouseButtonLock ()
RestoreCursor ()
RestoreCursor ()
EndFunction

string Function ToggleG2CapSuppression(int iRetCurVal)
var
	int iG2Caps
Let iG2Caps = GetJcfOption(OPT_BRL_G2SUPPRESS_CAPS)
if !iRetCurVal then
	;Update it
	Let iG2Caps = !iG2Caps
	SetJCFOption(OPT_BRL_G2SUPPRESS_CAPS,iG2Caps)
EndIf
if iG2Caps then
	Return cmsg_on ;BrlG2CapsOn
Else
	Return cmsg_off ;BrlG2CapsOff
EndIf
EndFunction

string Function UOG2CapsSuppress(int iRetCurVal)
var
	int iG2Caps
If ! GetJcfOption (OPT_BRL_G2TRANSLATION)then
	Return msgUO_Unavailable
EndIf
Let iG2Caps = GetJcfOption(OPT_BRL_G2SUPPRESS_CAPS)
if !iRetCurVal then
	Let iG2Caps = !iG2Caps
	SetJCFOption(OPT_BRL_G2SUPPRESS_CAPS,iG2Caps)
EndIf
return UOG2CapsSuppressTextOutput(iG2Caps)
EndFunction

string Function UOG2CapsSuppressTextOutput(int setting)
if setting then
	Return msgUO_On
Else
	Return msgUO_Off
EndIf
EndFunction

string Function UOG2CapsSuppressHlp()
If ! GetJcfOption (OPT_BRL_G2TRANSLATION)then
	Return msgUO_brlG2UnavailableHlp
EndIf
Return FormatString(msgUO_BrlG2CapsSuppressHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	UOG2CapsSuppressTextOutput(GetIntOptionDefaultSetting(section_braille,hKey_Braille_Grade2SuppressCapitalSigns)))
EndFunction

string Function ToggleTypeKeysMode(int iRetCurVal)
var
	int iTypeKeysMode
if (! BrailleSupportsTypeKeysMode ())
	return (msgUO_Unavailable)
endIf
if (GetBrailleDisplayName () == PM_DISPLAY_NAME)
	if (! gbUsingRemotePACMate)
		return (msgUO_Unavailable)
	endIf
endIf
Let iTypeKeysMode = BrailleGetTypeKeysMode()
if !iRetCurVal then
	;Let iTypeKeysMode = !iTypeKeysMode ; Never ever turn this thing off!
	BrailleSetTypeKeysMode(iTypeKeysMode)
EndIf
return ToggleTypeKeysModeTextOutput(iTypeKeysMode)
EndFunction

string Function ToggleTypeKeysModeTextOutput(int setting)
if setting then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string function ToggleTypeKeysModeHlp()
return FormatString(msgUOToggleTypeKeysModeHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	ToggleTypeKeysModeTextOutput(0))
EndFunction

string function ToggleBrailleStudyMode(int iRetCurVal)
if !IsBSMCapableBrlDisplay() then
	return msgUO_Unavailable
EndIf
if !iRetCurVal then
	let gbBrailleStudyModeActive = !gbBrailleStudyModeActive
EndIf
return ToggleBrailleStudyModeTextOutput(gbBrailleStudyModeActive)
EndFunction

string function ToggleBrailleStudyModeTextOutput(int setting)
if setting then
	return msgUO_On
else
	return msgUO_Off
EndIf
EndFunction

string function ToggleBrailleStudyModeHlp()
if !IsBSMCapableBrlDisplay() then
	return FormatString(msgUO_BrailleStudyModeOptionUnavailableHlp)
EndIf
return FormatString(msgUO_BrailleStudyModeOptionHlp)+cscBufferNewLine+cscBufferNewLine+
	FormatString(msgShowOptionDefaultSetting,
	ToggleBrailleStudyModeTextOutput(0))
EndFunction


;For non-FS displays, supports TypeKeysMode toggle as it did in versions 11 and prior.
Script ToggleTypeKeysMode (int index)
var
	int bTypeKeysMode
;index in case that key assignment to upper NavRow button on FS display is made by user.
if gbBrailleStudyModeActive && index then
	SALModeButton(GetNavRowCellOffset(index),sal_SpellWord)
	return
EndIf
let bTypeKeysMode = !BrailleGetTypeKeysMode ()
if (BrailleSetTypeKeysMode (bTypeKeysMode) == TRUE) then
	if (bTypeKeysMode == TRUE) then
		SayFormattedMessage (ot_status, cmsgTypeKeysModeEnabled_l, cmsgTypeKeysModeEnabled_s) ; "Type Keys mode enabled"
	else
		SayFormattedMessage (ot_status, cmsgTypeKeysModeDisabled_l, cmsgTypeKeysModeDisabled_s) ; "Type Keys mode disabled"
	endif
else
	SayFormattedMessage (ot_status, cmsgTypeKeysModeNotSet_l, cmsgTypeKeysModeNotSet_s) ; "Type Keys mode could not be set"
endif
EndScript

void function CBIEchoCommandAndChars(string sKeys, string sChars)
; When CBI is enabled, this function is called to speak the character being backspaced or the new character after the user
;deletes a character
say(sChars,ot_keyboard)
endFunction

; Used on routing keys for German build
Void Function BrailleMarkingOnOff()
  If GetJcfOption (OPTBRL_MARKING) Then
    Let GIPrevBrlMarking = GetJcfOption (OPTBRL_MARKING)
    SetJcfOption (OPTBRL_MARKING, BRL_MARKING_NONE)
  Else
    SetJcfOption (OPTBRL_MARKING, GIPrevBrlMarking)
  EndIf
EndFunction

; To get Caps spoken correctly within German build
Void Function G2CapsDeuSync()
Var Int rc,
	string sFilePath

  Let sFilePath= GetRegistryEntryString (2, "SOFTWARE\\Microsoft\\Windows\\CurrentVersion", "ProgramFilesDir")
  Let sFilePath= sFilePath + "\\Freedom Scientific\\Shared\\Braille\\10.12\\Default.jgt"
  Let rc = GetJCFOption(OPT_BRL_G2SUPPRESS_CAPS)
  If rc != Grade2Caps Then
    let Grade2Caps = rc
    If Grade2Caps == 1 Then
 	IniWriteString("Optionen","Grossbuchstaben","aus",sFilePath )
    Else
 	IniWriteString("Optionen","Grossbuchstaben","ein",sFilePath )
    EndIf
  EndIf
EndFunction

int function BrailleDotPatternToBits(string sDots)
var
	int PatternLength,
	int i,
	int Bits
let PatternLength = StringLength(sDots)
for i = 1 to PatternLength
	let Bits = Bits | 1<<StringToInt(SubString(sDots,i,1))-1
endFor
return Bits
EndFunction

string function BitsToBrailleDotPattern(int bits)
var
	int i,
	string sDots
if !Bits then
	return cscNull
EndIf
for i = 1 to 8
	if Bits & 1<<(i-1) then
		;note that appending strings that are made up solely of digits
		;results in a string with the digits being added rather than an appended string.
		let sDots = sDots+cscSpace+IntToString(i)
	endIf
endFor
return stringStripAllBlanks(sDots)
EndFunction

; The following four scripts are explicitly provided for Humanware Braille displays with thumb keys 1 to 4
 ; To support Split Braille
; Basically, when not in split mode, t1/t4 move by line and t2/t3 pan left/right.
; In Split mode, t1/t2 pan the active side of the display and t3/t4 pan the split side of the display.
script HWThum1()
if BrailleCanPanLinesIndependently() then
	performScript BraillePanLeft()
else
	performScript BraillePriorLine()
endIf
 endScript
 
script HWThum2()
if BrailleCanPanLinesIndependently() then
	performScript BraillePanRight()
else
	performScript BraillePanLeft()
endIf
endScript
 
script HWThum3()
 if BrailleCanPanLinesIndependently() then
	performScript BrailleSplitPanLeft()
else
	performScript BraillePanRight()
endIf
endScript
 
script HWThum4()
if BrailleCanPanLinesIndependently() then
	performScript BrailleSplitPanRight()
else
	performScript BrailleNextLine()
endIf
 endScript

; Begin - Split Braille for the ALVA BC
; AlvaBC key: BrailleLeft
Script AlvaBC_BraillePanLeft_BrailleSplitPanLeft ()
performScript BraillePanLeft()
EndScript

; AlvaBC key: BrailleUp
Script AlvaBC_BraillePriorLine_BrailleSplitPanRight ()
If brailleCanPanLinesIndependently() then
	performScript BraillePanRight()
Else
	performScript BraillePriorLine()
EndIf
EndScript

; AlvaBC key: BrailleDown
Script AlvaBC_BrailleNextLine_BrailleSplitPanLeft ()
If brailleCanPanLinesIndependently() then
	performScript BrailleSplitPanLeft()
Else
	performScript BrailleNextLine()
EndIf
EndScript

; AlvaBC key: BrailleRight
Script AlvaBC_BraillePanRight_BrailleSplitPanRight ()
If brailleCanPanLinesIndependently() then
	performScript BrailleSplitPanRight()
Else
	performScript BraillePanRight()
EndIf
EndScript

; AlvaBC key: F12
Script AlvaBC_rightWhizWheelUp_BrailleSplitPriorLine ()
If brailleCanPanLinesIndependently() then
	performScript BrailleSplitPriorLine()
Else
	performScript RightWhizWheelUp()
EndIf
EndScript

; AlvaBC key: F13
Script AlvaBC_rightWhizWheelDown_BrailleSplitNextLine ()
If brailleCanPanLinesIndependently() then
	performScript BrailleSplitNextLine()
Else
	performScript RightWhizWheelDown()
EndIf
EndScript
; End - Split Braille for the ALVA BC

int function IsEmptyFolder()
if GetWindowClass (getFocus ()) == cwc_DirectUIhWND
&& GetObjectName(SOURCE_CACHED_DATA) == cwnEmptyFolderInDialogBrl then
	; empty folder in File Explorer or open or save as dialogs.
	return true
endIf
return false
EndFunction

int function DoBrailleRoutingPriorityAction()
; These are the responses which should always be acted upon first if appropriate.
; Returning true means that no further action will be taken by the BrailleRouting script.
if BrailleIsMessageBeingShown()
	brailleClearMessage()
	return true
endIf
var int nCell = GetLastBrailleRoutingKey()
if gbBrailleStudyModeActive
	SALModeButton(nCell,sal_SayCharacter)
	return true
EndIf
; For clicking status cells on the left end of the display:
if nCell < 0
	BrailleRoutingButton(nCell)
	return true
endIf
if IsJAWSCursor()
	BrailleRoutingButton(nCell)
	LeftMouseButton()
	return true
endIf
if !GetFocus()
	MinimizeAllApps()
	return true
endIf
return false
EndFunction

int function IsUnicodeBraille(int ch)
return ch >=0x2800 && ch <=0x28ff
endFunction

prototype string function GetCharacterDescription()
int function HandleEmojiAfterBrailleClick()
if IsUnicodeBraille(GetCharacterValue(getCharacter())) return false endIf
var string charDesc=GetCharacterDescription()
if charDesc == cscNull
	return false
endIf
sayCharacter()
BrailleMessage(charDesc)
return true
endFunction

void function SpeakAfterBrailleRoutingClick()
If getObjectTypeCode()==wt_tabControl then
	delay(1)
	sayObjectActiveItem()
endIf
EndFunction

void function DoBrailleRoutingClickAfterAction()
if HandleEmojiAfterBrailleClick() return endIf
SpeakAfterBrailleRoutingClick()
EndFunction

void function BrailleRoutingButton(int nCell, optional int routingType)
var
	int iType = GetObjectSubTypeCode(),
	int iState = GetObjectMSAAState ()
if iType == WT_TREEVIEWITEM
|| iType == WT_ROW
	if iState&STATE_SYSTEM_EXPANDED
		TypeKey (cksLeftArrow)
		return
	elIf iState&STATE_SYSTEM_COLLAPSED
		TypeKey (cksRightArrow)
		return
	endIf
endIf
BrailleRoutingButton(nCell, routingType)
endFunction

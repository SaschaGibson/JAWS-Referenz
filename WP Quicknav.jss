; Copyright 1995-2021 Freedom Scientific, Inc.
; JAWS 8.00.xx Script file to be used by WordPerfect 12 and up.

include "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "IE.jsm"
include "WP QuickNav.jsm"
include "wpwin.jsh"

int function ClearQuickNavSayAllRestart()
let gbRestartSayAll = false
EndFunction

int function QuickNavSayAllRestart()
return gbRestartSayAll
EndFunction

int function QuickNavState()
return gbQuickNavState 
EndFunction

void function AutoFinishEvent()
let gbQuickNavState = false
EnsureQuickNavKeyTrapReleased()
EndFunction

int function QuickNavKeyTrapping()
return gbQuickNavKeyTrapping
EndFunction

int function IsTrappableKey(int nKey)
;returns true for all alphanumeric and punctuation keys, plus Backspace, Enter, space and their shifted equivalents.
;The following keycodes are the excluded values in the range 1-53:
;Escape=1
;Tab=15
;Control=29
;LeftShift=42
return
	(nKey>key_escape && nKey<key_tab)
	|| (nKey>key_tab && nKey<key_enter)
	|| (nKey>key_LeftShiftEscape && nKey<2098167)
	|| (nKey>2098167 && nKey<2097181)
	|| (nKey>key_control && nKey<key_LeftShift)
	|| (nKey>2097181 && nKey<2097194)
	|| (nKey>key_leftShift && nKey<key_RightShift)
	|| (nKey>kiLeftShiftExclaim && nKey<=kiLeftShiftQuestion)
	|| nKey==key_spacebar
	|| nKey == key_delete
	|| (nKey>=kiRightShiftExclaim && nKey<=kiRightShiftQuestion)
EndFunction

int function QuickNavKeyTrapKey(int nKey, string sKeyName, int nIsScriptKey)
var
	int iTrappable
	
let iTrappable = IsTrappableKey(nKey)
if !nIsScriptKey then
	if !iTrappable   then
		If gbKeyboardHelp then
			pause()
			return true
		elIf globalMenuMode>0  then
			pause()
			SimulateKey(sKeyName)
			return false
		ElIf nKey==key_Ctrl_f6
		|| nKey==key_alt_tab
		|| nKey==key_right_alt_tab
		|| nKey==key_left_alt_tab then
			SetQuickKeyNavigationState(0)
			SetJcfOption (opt_quick_key_navigation_mode,0)
			SimulateKey(sKeyName)
			return false
		Else
			SimulateKey(sKeyName)
			return false
		EndIf
	Else
		if globalMenuMode>0 then
			SimulateKey(sKeyName)
			return false
		EndIf
		If !SayAllInProgress()  then
			SayMessage(ot_error,msgKeyNotAvailable_L,msgKeyNotAvailable_S)
		EndIf
		let gbRestartSayAll=true
	EndIf
EndIf
return true
EndFunction

void function EnsureQuickNavKeyTrapReleased()
if !(gsBXSimulateKey 
|| gbKeyboardHelp) then
	let gbQuickNavKeyTrapping = false
	TrapKeys(false)
EndIf
EndFunction

void function EstablishQuickNavState()
if gbQuickNavState == 1 then
	if InDocumentWindow() then
		let gbQuickNavKeyTrapping = true
		TrapKeys(true, false)
		SetQuickKeyNavigationMode(1)
	else
		EnsureQuickNavKeyTrapReleased()
	EndIf
EndIf
EndFunction

void function SetQuickKeyNavigationState(int iState)
SetQuickKeyNavigationMode(iState)
if iState then
	let gbQuickNavState = 1
	let gbQuickNavKeyTrapping = true
	TrapKeys(true, false)
else
	let gbQuickNavState = 0
	let gbQuickNavKeyTrapping = false
	TrapKeys(false)
EndIf
EndFunction

string  function NavigationQuickKeysMode(int iRetCurVal)
var
	int iOption,
	string smsgOn,
	string smsgOff
if giSetQuickNavModeFromScript  then
	let smsgOff=cmsgNavigationModeOff_l
	let smsgOn=cmsgNavigationModeOn_l
Else
	let smsgOff=cmsg_off
	let smsgOn=cmsg_on
EndIf
Let iOption = GetJcfOption (opt_quick_key_navigation_mode)
if !iRetCurVal then
	;update the value
	If iOption == 1 then
		Let iOption = 0
	ElIf iOption == 0 
	|| iOption==2 then;Special case
		Let iOption = 1
	EndIf
	SetJcfOption(opt_quick_key_navigation_mode,iOption)
	if InDocumentWindow() then
		SetQuickKeyNavigationState(iOption==1)
	else
		let gbQuickNavState = iOption==1
	EndIf
EndIf
If iOption == 0 then
	Return smsgOff
ElIf iOption == 1 
|| iOption==2  then
	Return smsgOn
EndIf
EndFunction

script NavigationModeToggle()
var
	int iMode
let iMode = QuickKeyNavigationModeActive()
if !iMode
&& !InDocumentWindow() then
	SayMessage(ot_error, msgQuickNavNotAvailable_L, msgQuickNavNotAvailable_S)
	return
EndIf
let giSetQuickNavModeFromScript=true
SayUsingVoice(vctx_message,NavigationQuickKeysMode(0),ot_status)
EndScript

void function SayQuickKeynavigationNotAvailable()
SayMessage(ot_error,msgKeyNotAvailable_L,msgKeyNotAvailable_S)
EndFunction

script MoveToNextTable()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToTable(s_next) then
	if !SayAllInProgress() then
		PerformScript SayCell()
	EndIf
else
	sayMessage(ot_error,FormatString(cmsgNoMoreElements,Tables))
EndIf
endScript

script MoveToPriorTable()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToTable(s_Prior) then
	if !SayAllInProgress() then
		PerformScript SayCell()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoPriorElements,tables))
EndIf
endScript

script MoveToNextHeading()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToHeading(s_next,0) then
	if !SayAllInProgress() then
		SayLine()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoMoreElements,headings))
EndIf
endScript

script MoveToPriorHeading()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToHeading(s_Prior,0) then
	if !SayAllInProgress() then
		SayLine()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoPriorElements,headings))
EndIf
endScript
 
script MoveToNextFootnote ()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToFootnote (s_next) then
	if !SayAllInProgress() then
		SayLine ()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoMoreElements,Footnotes))
EndIf
endScript

script MoveToPriorFootnote ()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToFootnote (s_Prior) then
	if !SayAllInProgress() then
		SayLine ()
	EndIf
else
	SayMessage(ot_ERROR,FormatString(cmsgNoPriorElements,Footnotes))
EndIf
endScript

script MoveToNextEndnote()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToEndnote(s_next) then
	if !SayAllInProgress() then
		SayLine()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoMoreElements,endnotes))
EndIf
endScript

script MoveToPriorEndnote()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToEndnote(s_Prior) then
	if !SayAllInProgress() then
		SayLine()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoPriorElements,endnotes))
EndIf
endScript

script MoveToNextComment()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToComment(s_next) then
	if !SayAllInProgress() then
		SayLine()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoMoreElements,comments))
EndIf
endScript

script MoveToPriorComment()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToComment(s_Prior) then
	if !SayAllInProgress() then
		SayLine()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoPriorElements,comments))
EndIf
endScript

script MoveToNextPage()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToPage(s_next) then
	if !SayAllInProgress() then
		SayLine()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoMoreElements,pages))
EndIf
endScript

script MoveToPriorPage()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToPage(s_Prior) then
	if !SayAllInProgress() then
		SayLine()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoPriorElements,pages))
EndIf
endScript

script MoveToNextIndex ()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToIndex (s_next) then
	if !SayAllInProgress() then
		SayLine()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoMoreElements,Indexes))
EndIf
endScript

script MoveToPriorIndex ()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToSection(s_Prior) then
	if !SayAllInProgress() then
		SayLine()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoPriorElements,Indexes))
EndIf
endScript

int function StepOutOfCurrentElement(int bForward)
if inTable() then
	if StepOutOfTable(bForward) then
		DetectContext()
		return true
	EndIf
EndIf
return false
EndFunction

Script StepToStartOfElement ()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
StepOutOfCurrentElement(FALSE)
If SayAllInProgress () then
	Return
EndIf
if InTable() then
	SayCell()
else
	SayLine ()
EndIf
EndScript

script StepToEndOfElement ()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
StepOutOfCurrentElement (TRUE)
If SayAllInProgress () then
	Return
EndIf
if InTable() then
	SayCell()
else
	SayLine ()
EndIf
EndScript

; next several scripts are not available in Microsoft Word at this time. 
; They are listed here in order that keyboard help is correct.
Script JumpToLine ()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script JumpToTableCell()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script JumpReturnFromTableCell()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToNextButton()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorButton()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToNextPlaceMarker()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorPlaceMarker()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToNextDifferentElement()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorDifferentElement()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToNextToa ()
if SayAllInProgress() then
	let gbRestartSayAll=true
	return
EndIf
if MoveToToa (s_next) then
	if !SayAllInProgress() then
		SayLine ()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoMoreElements,TableOfAuthorities))
EndIf
EndScript

Script MoveToPriorToa ()
if SayAllInProgress() then
	let gbRestartSayAll=true
	return
EndIf
if MoveToToa (s_prior) then
	if !SayAllInProgress() then
		SayLine ()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoPriorElements,TableOfAuthorities))
EndIf
EndScript

Script MoveToNextNonlinkText()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorNonlinkText()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToNextHeadingLevelN()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorHeadingLevelN()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToNextUnvisitedLink()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorUnvisitedLink()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToNextVisitedLink()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorVisitedLink()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToNextCheckbox()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorCheckbox()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript



Script MoveToNextListItem()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorListItem()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToNextList()
If !SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToList (s_next) then
	if !SayAllInProgress() then
		SayLine ()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoMoreElements,Lists))
EndIf
EndScript

Script MoveToPriorList()
If !SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToList (s_prior) then
	if !SayAllInProgress() then
		SayLine ()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoPriorElements,Lists))
EndIf
EndScript

Script MoveToNextBlockQuote()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorBlockQuote()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToNextDivision()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorDivision()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Void Function SayOrPlayMessage(string smsg_l,string smsg_s)
Var
	string sSoundFile
let sSoundFile=FindJAWSSoundFile(snElementNotfound)
if !SayAllInProgress() then
	SayMessage(ot_error,smsg_l,smsg_s)
else
	PlaySound(sSoundFile)
EndIf
EndFunction

script MoveToNextCrossRef()
if SayAllInProgress() then
	let gbRestartSayAll=true
EndIf
if MoveToCrossRef(s_next) then
	if !SayAllInProgress() then
		SayLine ()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoMoreElements,CrossReferences))
EndIf
endScript

script MoveToPriorCrossRef ()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if MoveToCrossRef (s_prior) then
	if !SayAllInProgress() then
		SayLine ()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoPriorElements,CrossReferences))
EndIf
endScript

Script MoveToNextToc ()
if SayAllInProgress() then
	let gbRestartSayAll=true
	return
EndIf
if MoveToToa (s_next) then
	if !SayAllInProgress() then
		SayLine ()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoMoreElements,TableOfContents))
EndIf
EndScript

Script MoveToPriorToc ()
if SayAllInProgress() then
	let gbRestartSayAll=true
	return
EndIf
if MoveToToC (s_prior) then
	if !SayAllInProgress() then
		SayLine ()
	EndIf
else
	SayMessage(ot_error,FormatString(cmsgNoPriorElements,TableOfContents))
EndIf
EndScript

Script MoveToNextFrame ()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

Script MoveToPriorFrame ()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

script MoveToNextGraphic()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

script MoveToPriorGraphic()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

script MoveToNextSameElement()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

script MoveToPriorSameElement()
If !SayAllInProgress() then
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
	return
EndIf
SayAll()
EndScript

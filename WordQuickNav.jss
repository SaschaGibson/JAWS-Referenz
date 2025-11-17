; Copyright 1995-2021 Freedom Scientific, Inc.
; JAWS script file for Microsoft Word quick navigation, versions later 2016 and O365.

include "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "IE.jsm"
include "Word QuickNav.jsm"
include "word.jsh"
include "office.jsh"
import "wordFunc.jsd"
import "wordsettings.jsd"
import "say.jsd" ; for FormatOutputMessage, ensure Script Manager will compile.

const
	QuickNavOff = 0,
	QuickNavOn = 1,
	QuickNavSuspended = 0xffffffff
globals
	int giQuickNavState,
	int gbQuickNavKeyTrapping,
	int gbWrappedTriggered,
	int gbWrapToTop,
	int gbWrapToBottom,
	int gbRestartSayAll,
	int gbSavedQuickKeyNavigationMode,
	int gbQuickKeyNavigationModeWasSaved


int function DocumentExceedsSizeThresholdForProofing ()
return getActiveDocumentWordCount () >= getDocumentwordCountThreshold ()
endFunction

int function UserBufferActivate (optional int iTrapKeys)
if DocumentQuickNavIsOn()
	SuspendDocumentQuickNav(true) ;True to keep quick nav active for virtual cursor
endIf
return UserBufferActivate (iTrapKeys)
endFunction

int function UserBufferActivateEX (string name, string typeString, int TypeCode, int ControlID, optional int iAllowAllKeys)
if DocumentQuickNavIsOn()
	SuspendDocumentQuickNav(true) ;True to keep quick nav active for virtual cursor
endIf
return UserBufferActivateEX (name, typeString, TypeCode, ControlID, iAllowAllKeys)
endFunction

int function UserBufferAddTextResultsViewer (string text, string FunctionString,
	string FunctionDisplayName, string FontName,
	int PointSize, int Attributes, int TextColor, int BackgroundColor, int AddLineBreak, int ControlType, int ControlState)
if DocumentQuickNavIsOn()
	SuspendDocumentQuickNav(true) ;True to keep quick nav active for virtual cursor
endIf
UserBufferAddTextResultsViewer (text, FunctionString, FunctionDisplayName, FontName, PointSize, Attributes, TextColor, BackgroundColor, AddLineBreak, ControlType, ControlState)
endFunction

int function UserBufferDeactivate ()
if DocumentQuickNavIsSuspended()
	UnsuspendDocumentQuickNav()
endIf
return UserBufferDeactivate ()
endFunction

int function UserBufferDeactivateResultsViewer ()
if DocumentQuickNavIsSuspended()
	UnsuspendDocumentQuickNav()
endIf
return UserBufferDeactivateResultsViewer ()
endFunction

void function SaveCurrentQuickKeyNavigationMode()
gbQuickKeyNavigationModeWasSaved = true
gbSavedQuickKeyNavigationMode = GetJCFOption(opt_quick_key_navigation_Mode)
EndFunction

void function RestoreSavedQuickKeyNavigationMode()
if !gbQuickKeyNavigationModeWasSaved return endIf
SetJCFOption(opt_quick_key_navigation_Mode,gbSavedQuickKeyNavigationMode)
gbQuickKeyNavigationModeWasSaved = false
EndFunction

void function WordQuickNavInit ()
setJcfOption (opt_quick_key_navigation_mode, (getRunningFSProducts() != PRODUCT_MAGic))
if  OutlookIsActive () then return endIf
if DocumentQuickNavIsSuspended()
	UnsuspendDocumentQuickNav()
; if the setting for Quick Navigation Keys is on by Default for Word, 
; excluding Default setting, and only in Word document:
elIf ! IsVirtualPcCursor () 
	if (inDocument ())
		setQuickKeyNavigationState(0)
	endIf
endIf
endFunction

void function AutoStartEvent ()
; Do not add code to this function.
;Instead, add to WordQuickNavInit ()
;as it will be called from the Word main AutoStartEvent.
endFunction

void function AutoFinishEvent()
if  UserBufferIsActiveResultsViewer () then
	;Do not disable,
	;we want users to use ResearchIt and Skim Read freely without disrupting quick navigation keys:
	if DocumentQuickNavIsOn()
		SuspendDocumentQuickNav(true) ;True to keep quick nav active for virtual cursor
	endIf
	return
ElIf DocumentQuickNavIsSuspended()
	return ; for JAWS Commands Search and other areas
endIf
TurnOffDocumentQuickNav()
let gbWrapToTop=false
let gbWrapToBottom=false
EndFunction

void function SetQuickKeyNavigationState(int iState)
if userBufferIsActive ()
|| UserBufferIsActiveResultsViewer () then
	;Do not allow quick nav keys to be turned off:
	return
endIf
;does not change the JCF option,
;but sets the quick nav state and the trapping key state:
if iState
	TurnOnDocumentQuickNav()
else
	TurnOffDocumentQuickNav()
EndIf
EndFunction

void function EnsureQuickNavIsOff()
;if quick nav is on, turns off the state and the key trapping,
; and if it is suspended, set state to ON but do nothing else as WordQuickNavInit picked that up:
if DocumentQuickNavIsSuspended()
	UnsuspendDocumentQuickNav()
	return
endIf
if !DocumentQuickNavIsOff()
	TurnOffDocumentQuickNav()
EndIf
EndFunction

void function EstablishQuickNavState()
if getRunningFSProducts () == PRODUCT_MAGic then
	TurnOffDocumentQuickNav()
	return
endIf
;appendToScriptCallStackLog ()
;used when focus or menu mode changes to set the quick nav state.
if IsWordContextMenuActive()
|| InHJDialog()
; QuickSettings is an applet:
|| inQuickSettingsDialog () then
	if DocumentQuickNavIsOn()
		SuspendDocumentQuickNav()
	endIf
	return
EndIf
if !DocumentQuickNavIsOff() ;may be on or suspended
	If OutlookIsActive()
		If isActiveDocumentReadOnly() || IsActiveWindowProtected() Then
			let gbQuickNavKeyTrapping = true
			TrapKeys(true, false)
			let giQuickNavState = QuickNavOn
			SetQuickKeyNavigationMode(1)
		else
			let gbQuickNavKeyTrapping = false
			TrapKeys(false)
			let giQuickNavState = QuickNavOff
			SetQuickKeyNavigationMode(0)
			setJCFOption(opt_quick_key_navigation_Mode,0)
		EndIf
		return
	EndIf
	If GetWindowCategory() == wCat_document 
		TurnOnDocumentQuickNav()
	else
		TurnOffDocumentQuickNav()
	EndIf
EndIf
EndFunction

void function SuspendDocumentQuickNav(optional int KeepQuickNavActiveForVirtualCursor)
giQuickNavState = QuickNavSuspended
gbQuickNavKeyTrapping = false
TrapKeys(false)
if !KeepQuickNavActiveForVirtualCursor
	SetQuickKeyNavigationMode(0)
endIf
EndFunction

void function UnsuspendDocumentQuickNav()
if giQuickNavState == QuickNavSuspended
	giQuickNavState = QuickNavOn
	gbQuickNavKeyTrapping = true
	TrapKeys(true, false)
	SetQuickKeyNavigationMode(1)
endIf
EndFunction

void function TurnOffDocumentQuickNav()
giQuickNavState = QuickNavOff
gbQuickNavKeyTrapping = false
TrapKeys(false)
SetQuickKeyNavigationMode(0)
EndFunction

void function TurnOnDocumentQuickNav()
giQuickNavState = QuickNavOn
gbQuickNavKeyTrapping = true
TrapKeys(true, false)
SetQuickKeyNavigationMode (1)
EndFunction

int function DocumentQuickNavIsSuspended()
return giQuickNavState == QuickNavSuspended
EndFunction

int function DocumentQuickNavIsOff()
return giQuickNavState == QuickNavOff
EndFunction

int function DocumentQuickNavIsOn()
return giQuickNavState == QuickNavOn
EndFunction

int function QuickNavKeyTrapping()
return gbQuickNavKeyTrapping
EndFunction

int function IsTrappableKey(int nKey)
;returns true for all alphanumeric and punctuation keys,
;plus Backspace, Enter, space and their shifted equivalents.
;The following keycodes are the excluded values in the range 1-53:
;Escape=1
;Tab=15
;Control=29
;LeftShift=42
var
	int nMaskedKey
;nMaskedKey allows us to compare nKey while ignoring if shift is part of the key combo
let nMaskedKey = nKey & 0xff1fffff
; exception for context key which now has a high bit:
if nKey == KEY_CONTEXT then return FALSE endIf
return
	(nMaskedKey>key_escape && nMaskedKey<key_tab)
	|| (nMaskedKey>key_tab && nMaskedKey<key_enter)
	|| (nMaskedKey>key_control && nMaskedKey<key_LeftShift)
	|| (nMaskedKey>key_leftShift && nMaskedKey<key_RightShift)
	|| (nKey>kiLeftShiftExclaim && nKey<=kiLeftShiftQuestion)
	|| nMaskedKey==key_spacebar
	|| nMaskedKey == key_delete
	|| (nKey>kiCtrlC && nKey<kiRightAltSlash)
	|| nKey==Key_Left_Windows ; for when Alt+Windows+Arrow keys are used within a table
EndFunction

string Function TrimKeyName(string sKeyName)
if stringContains(sKeyName,scLeft) then
	let sKeyName=StringReplaceSubstrings(sKeyName,scLeft,cscNull)
EndIf
If stringContains(sKeyName,scRight) then
	let sKeyName=StringReplaceSubstrings(sKeyName,scRight,cscNull)
EndIf
return sKeyName
EndFunction

int function QuickNavTrappedKeyProcessed(int nKey, string sKeyName, int nIsScriptKey)
var
	int iTrappable,
	int nMaskedKey,
	string sReal,
	int iTypingEcho
let nMaskedKey = nKey & 0xff1fffff
; handle theAlt+tab problem whether left or right Alt is used.
if (StringContains(StringLower(sKeyName),cksAltTab)
&& !gbKeyboardHelp)
|| GetMenuMode()>0 then ;handles the situation for just pressing Alt alone.
	SetQuickKeyNavigationState(0)
	pause()
	return false
endIf
If InHJDialog() then
	let sReal=GetWindowName(GetRealWindow(GetFocus()))
	if sKeyName==cksSpace
	|| (nMaskedKey>key_tab && nMaskedKey<key_enter)
	|| (nMaskedKey>key_control && nMaskedKey<key_LeftShift)
	|| (nMaskedKey>key_leftShift && nMaskedKey<key_RightShift) ; the punctuation keys
	|| nMaskedKey == key_delete
	|| nMaskedKey==key_backSpace then
		; ensure that keyboard help keys are not passed through to the JAWS dialog.
		if gbKeyboardHelp then
			pause()
			return true
		endIf
		SetQuickKeyNavigationState(0)
		;Prevent skim reading dialog problems with quick keys turned on.
		if sReal==cWn19; skim Reading
		|| sReal==cwn_JAWS_find then
			TypeKey(sKeyName)
			return false
		endIf
		pause()
		TypeKey(sKeyName)
		pause()
		; return to quick nav state.
		SetQuickKeyNavigationState(1)
	endIf
	return false
endIf
if DialogActive()
|| GetWindowCategory() != wCat_document then
	SetQuickKeyNavigationState(0)
	return false
endIf
let iTrappable = IsTrappableKey(nKey)
if !nIsScriptKey then
	if !iTrappable   then
		If gbKeyboardHelp then
			pause()
			return true
		Elif nKey==key_context 
		|| nKey == KEY_CONTEXT then
			TypeKey(ks_ShiftF10)
			return false
		ElIf globalMenuMode>0
		|| nKey==key_Ctrl_f6 then
			SetQuickKeyNavigationState(0)
			SimulateKey(sKeyName)
			return false
		elIf StringContains(FindKeyAliasMatch(sKeyName),scWindows) then
			SetQuickKeyNavigationState(0)
			let sKeyName=trimKeyName(sKeyName)
			;Do not simulate Windows key modifier plus alphanum key presses
			;or two instances of programs or dialogs may appear:
			if !StringContains(sKeyName,scWindows) then
				SimulateKey(sKeyName)
			EndIf
			return false
		Else
			; If key is passed through to the app without  checking for Alt, The app closes since Alt is being handled internally.
			if !StringContains(sKeyName,scAlt) then
				let sKeyName=trimKeyName(sKeyName) ; allows both left and right Control keys to pass through to the app.
				TypeKey(sKeyName)
			EndIf
			return false
		EndIf
	Else ;key is trappable but not script key.
		if globalMenuMode>0 then
			SimulateKey(sKeyName)
			return false
		ElIf (nKey>=kiRightAlt8
		&& nKey<=kiRightAltSlash)then
			let sKeyName=TrimKeyName(sKeyName)
			SimulateKey(sKeyName)
			return false
		EndIf
		If !SayAllInProgress()  then
			SayMessage(ot_error,cmsgNotAvailable)
		EndIf
		SetSayAllRestart()
	EndIf ;end of test for trappable but not script key
elIf globalMenuMode>0 then
	SetQuickKeyNavigationState(0)
	simulateKey(sKeyName)
	return false
EndIf
return true
EndFunction

int function QuickNavState()
return giQuickNavState
EndFunction

void function SetSayAllRestart()
let gbRestartSayAll = true
EndFunction

int function ClearSayAllRestart()
let gbRestartSayAll = false
EndFunction

int function SayAllWillRestart()
return gbRestartSayAll
EndFunction

void function SayAllRelocateCursor(int iSayAllMode,int iUnitsToRetreat,	int iWordsSpokenInCurrentUnit)
if SayAllWillRestart()
	return
EndIf
SayAllRelocateCursor(iSayAllMode,iUnitsToRetreat,iWordsSpokenInCurrentUnit)
SayWord() ; speak word on which cursor lands when SayAll is stopped by user.
endFunction

void Function SayAllStoppedEvent()
var
	int iQuickNavMode
RestoreSavedQuickKeyNavigationMode()
if getRunningFSProducts () == PRODUCT_MAGic then
	TurnOffDocumentQuickNav()
	return
endIf
; check for Outlook read-only message.
;must return to quick nav state if read-only message.
; May be later moved to 'Outlook Message' file.
if OutlookIsActive()
&& (isActiveDocumentReadOnly ()
|| IsActiveWindowProtected ())
	SetQuickKeyNavigationState(1)
	SayAllStoppedEvent ()
	return
endIf
SetQuickKeyNavigationState(0)
SetFindItemToPage()
ClearSayAllRestart()
SayAllStoppedEvent()
EndFunction

void Function SayWrapMessageError(string sElementType)
let gbWrappedTriggered=false
if gbWrappedTriggered then
	If gbWrapToTop then
		let gbWrapToTop=false
	Else
		let gbWrapToBottom=false
	EndIf
else
	let gbWrapToTop=false
	let gbWrapToBottom=false
EndIf
EndFunction

void Function SayOrPlayMessage(string smsg_l,optional string smsg_s)
Var
	string sSoundFile
let sSoundFile = FindJAWSSoundFile(snElementNotfound)
if !SayAllInProgress() then
	SayFormattedMessage(ot_error,smsg_l,smsg_s)
else
	PlaySound(sSoundFile)
EndIf
EndFunction

void Function SayKeyNotAvailableAppMessage()
If OutlookIsActive() then
	SayMessage(ot_error,msgOutlookHTMLKey_l,msgOutlookHTMLKey_s)
Else
	SayMessage(ot_error,msgHTMLKey_l,msgHTMLKey_s)
EndIf
EndFunction

void function NavigationWrappedEvent(int bForward)
if !DocumentUpdateNotificationMode() then
	return
endIf
let gbWrappedTriggered = true
if bForward then
	SayFormattedMessage(OT_STATUS,cmsgWrappingToTop_L,cmsgWrappingToTop_S)
	beep()
	if bForward == 4 then
		let gbWrapToTop = true
	EndIf
else
	sayFormattedMessage(OT_STATUS,cmsgWrappingToBottom_L,cmsgWrappingToBottom_S)
	beep()
	let gbWrapToBottom = true
endIf
EndFunction

int function MoveToProofreadingElement (int ProofreadingElement, int MoveDirection,string ByRef sText)
var int moved = MoveToProofreadingElement (ProofreadingElement,MoveDirection,sText)
;Because when we return from JAWS Search, we are not updating Braille.
if BrailleInUse () then BrailleRefresh () endIf
return moved
endFunction

void function ProcessMoveToSpellingError(int moveDirection)
Var
	string sText,
	int iFlagStatus
if GetWindowCategory () != wCat_document then
	return
endIf
if SayAllInProgress () then
	SetSayAllRestart()
endIf
if ! IsCheckSpellingAsYouTypeEnabled() then
	SayMessage (OT_ERROR, msgCheckSpellingDisabled)
	return
EndIf
if DocumentExceedsSizeThresholdForProofing () then
	if IsKeyWaiting () || isSameScript () then return endIf
	sayMessage (OT_ERROR, cmsgPleaseWait)
endIf
let iFlagStatus = getStateOfSelectionBit (selCtxSpellingErrors)
if ! iFlagStatus then
	ToggleSelectionBit (selCtxSpellingErrors)
endIf
if MoveToProofreadingElement (peSpellingError,MoveDirection,sText) then
	if !AtStartOfDocument () then
		If GetProofreadingElementCount (peSpellingError)==0
		&& !OutlookIsActive() then ;unable to distinguish between no spelling errors or the setting is not enabled for Outlook.
			SayOrPlayMessage (msgNoSpellingErrors_l,msgNoSpellingErrors_s)
			if ! iFlagStatus then
				ToggleSelectionBit (selCtxSpellingErrors)
			endIf
			return
		endIf
	endIf
	if StringLength(sText)
		Say (sText, OT_LINE,TRUE)
		SpellString (sText)
	endIf
	if ! SayAllInProgress () then
		SaySentence ()
	endIf
	SayWrapMessageError (SpellingErrors)
endIf
if ! iFlagStatus then
	ToggleSelectionBit (selCtxSpellingErrors)
endIf
endFunction

script MoveToFirstSpellingError()
ProcessMoveToSpellingError(s_top)
EndScript

script MoveToNextSpellingError()
If IsReadOnlyVirtualMessage() then
	return default::MoveToNextFrame()
EndIf
ProcessMoveToSpellingError(s_next)
EndScript

script MoveToPriorSpellingError()
If IsReadOnlyVirtualMessage() then
	return default::MoveToPriorFrame()
EndIf
ProcessMoveToSpellingError(s_prior)
EndScript

script MoveToLastSpellingError()
ProcessMoveToSpellingError(s_bottom)
EndScript

void function ProcessMoveToGrammaticalError(int moveDirection)
Var
	string sText,
	int iFlagStatus

If GetWindowCategory () != wCat_document then
	if isVirtualPcCursor () then
		sayMessage (OT_ERROR, msgCheckGrammarDisabled)
	endIf
	return
EndIf
If Not IsVirtualPCCursor ()	; in case of virtual PCCursor go to default functionality.
	if SayAllInProgress () then
		SetSayAllRestart()
	endIf
	if ! IsCheckGrammarAsYouTypeEnabled () then
		sayMessage (OT_ERROR, msgCheckGrammarDisabled)
		return
	endIf
	if DocumentExceedsSizeThresholdForProofing () then
		if IsKeyWaiting () || isSameScript () then return endIf
		sayMessage (OT_ERROR, cmsgPleaseWait)
	endIf
	let iFlagStatus = getStateOfSelectionBit (selCtxGrammaticalErrors)
	if ! iFlagStatus then
		ToggleSelectionBit (selCtxGrammaticalErrors)
	endIf
	if MoveToProofreadingElement (peGrammaticalError, MoveDirection, sText) then
		if !atStartOfDocument () then
			if GetProofreadingElementCount (peGrammaticalError) == 0 then
				SayOrPlayMessage (msgNoGrammaticalErrors_l,msgNoGrammaticalErrors_s)
				if ! iFlagStatus then
					ToggleSelectionBit (SelCtxGrammaticalErrors)
				endIf
				return
			endIf
		endIf
		Say (sText, OT_LINE,TRUE)
		SayWrapMessageError (GrammaticalErrors)
	endIf
	if ! iFlagStatus then
		ToggleSelectionBit (selCtxGrammaticalErrors)
	endIf
	Return
EndIf
Return ProcessMoveToControlType(wt_radiobutton, CVMSGRadiobutton1_L, true, UsesFocusChangeDepth(), moveDirection)
endFunction

script MoveToFirstGrammaticalError()
ProcessMoveToGrammaticalError(s_top)
EndScript

Script MoveToNextGrammaticalError()
If IsReadOnlyVirtualMessage() then
	return default::MoveToNextRadioButton()
EndIf
ProcessMoveToGrammaticalError(s_next)
EndScript

Script MoveToPriorGrammaticalError()
If IsReadOnlyVirtualMessage() then
	return default::MoveToPriorRadioButton()
EndIf
ProcessMoveToGrammaticalError(s_prior)
EndScript

script MoveToLastGrammaticalError()
ProcessMoveToGrammaticalError(s_bottom)
EndScript

void function ProcessMoveToField(int MoveDirection, optional string ErrorMsg)
var
	String sText,
	string sAuthor,
	string sInitials,
	string sDesc,
	string sDate
If IsReadOnlyVirtualMessage() then
	Return default::ProcessMoveToField(MoveDirection)
EndIf
If GetWindowCategory () != wCat_document then
	return
EndIf
if SayAllInProgress () then
	SetSayAllRestart()
endIf
If !GetProofreadingElementCount (peField) then
	SayOrPlayMessage (msgNoDocFields_L, msgNoDocFields_S)
	Return
endIf
if isActiveDocumentProtectedForm () then
	pause ()
endIf
if moveToProofreadingElement (pefield, MoveDirection, sText) then
	if ! sayAllInProgress () then
		if getObjectSubtypeCode () == WT_LINK then
			SayField ()
			return
		endIf
		if isFormField () then
			;The SelectioncontextChangedEvent will speak the new formfield
			return
		endIf
		if ! GetAnnotationAtCaret (0, cscNull, sAuthor, sText, sDate, sDesc) then
			getProofreadingElementInfo (peField, sText, sAuthor, sInitials, sDesc, sDate)
		endIf
		say (sText+cscSpace+sDesc, OT_LINE, TRUE)
	endIf
else
	sayMessage (OT_ERROR, ErrorMsg)
EndIf
endFunction

script MoveToFirstField()
ProcessMoveToField(s_top,
	FormatOutputMessage(ot_error,true,
		msgNoDocFields_l,msgNoDocFields_s))
EndScript

script MoveToNextField()
ProcessMoveToField(s_next,
	FormatString(cmsgNoMoreElements,fields))
EndScript

script MoveToPriorField()
ProcessMoveToField(s_prior,
	FormatString(cmsgNoPriorElements,headings))
EndScript

script MoveToLastField()
ProcessMoveToField(s_bottom,
	FormatString(cmsgNoMoreElements,fields))
EndScript

void function ProcessMoveToHeading (int MoveDirection, optional int nLevel, string ErrorMsg)
if getWindowCategory () != wCat_document then
	return
endIf
If IsReadOnlyVirtualMessage() then
	Return default::ProcessMoveToHeading (MoveDirection, nLevel)
EndIf
if sayAllInProgress () then
	SetSayAllRestart()
endIf
if MoveToHeading (MoveDirection, nLevel) then
	if ! sayAllInProgress () then
		if GetObjectSubtypeCode () == WT_LINK then
			sayField ()
			return
		endIf
		if inList () then
			sayLine ()
			return
		endIf
		sayCurrentHeading ()
	endIf
else
	if MoveDirection == s_top
	|| MoveDirection == s_bottom then
		SayOrPlayMessage (ErrorMsg, ErrorMsg)
	else
		SayMessage (OT_ERROR, ErrorMsg)
	endIf
endIf
endFunction

script MoveToFirstHeading(int nLevel)
ProcessMoveToHeading(s_top, nLevel,
	FormatOutputMessage(ot_error, true, msgNoDocHeadings_L,msgNODocheadings_s))
EndScript

script MoveToNextHeading(int nLevel)
if nLevel > 6
&& IsReadOnlyVirtualMessage() then
	;virtual headings, unlike word headings, are limited to 6.
	;The default for virtual quick nav 7 8 9 and 0 is to speak placemarkers:
	return default::SpeakPlaceMarkerN(nLevel-6)
EndIf
ProcessMoveToHeading(s_next, nLevel,
	FormatString(cmsgNoMoreElements,headings))
EndScript

script MoveToPriorHeading(int nLevel)
if nLevel > 6
&& IsReadOnlyVirtualMessage() then
	;virtual headings, unlike word headings, are limited to 6.
	;The default for virtual quick nav shift+ 7 8 9 and 0 is to move to placemarkers:
	return default::MoveToPlaceMarkerN(nLevel-6)
EndIf
ProcessMoveToHeading(s_prior, nLevel,
	FormatString(cmsgNoPriorElements,headings))
EndScript

script MoveToLastHeading(int nLevel)
ProcessMoveToHeading(s_bottom, nLevel,
	FormatString(cmsgNoMoreElements,headings))
EndScript

void function ProcessMoveToTable(int MoveDirection, optional string ErrorMsg)
If GetWindowCategory () != wCat_document then
	return
EndIf
If IsReadOnlyVirtualMessage() then
	Return default::ProcessMoveToTable (MoveDirection)
EndIf
if SayAllInProgress () then
	SetSayAllRestart()
endIf
If StringLength (GetListOfTables ()) == 0 then
	SayOrPlayMessage (msgNoDocTables_L, msgNoDocTables_S)
	Return
endIf
if moveToTable (MoveDirection) then
	delay (3, TRUE)
/*;!!!!!! ToDo: Do we need this?
	if getTableIndex()!=globalPriorTableNumber then
		resetTableGlobals()
		RunSelectionContextEvents()
	endIf
	SayCell()
*/
else
	SayMessage (OT_ERROR, ErrorMsg)
endIf
endFunction

script MoveToFirstTable ()
ProcessMoveToTable(s_top,
	FormatOutputMessage(ot_error,true,
		msgNoDocTables_L,msgNoDocTables_S))
EndScript

script MoveToNextTable ()
ProcessMoveToTable(s_next,
	FormatString(cmsgNoMoreElements,Tables))
EndScript

script MoveToPriorTable ()
ProcessMoveToTable(s_prior,
	FormatString(cmsgNoPriorElements,tables))
EndScript

script MoveToLastTable ()
ProcessMoveToTable (s_bottom,
	FormatString(cmsgNoMoreElements,tables))
EndScript

void function ProcessMoveToBookmark (int MoveDirection, string ErrorMsg)
var
	string sText,
	string sAuthor,
	string sInitials,
	string sDesc,
	string sDate
if GetWindowCategory () != wCat_document then
	return
endIf
if sayAllInProgress () then
	SetSayAllRestart()
endIf
if OutlookIsActive () then
	SayKeyNotAvailableAppMessage ()
	return
endIf
If GetProofreadingElementCount (peBookmark) == 0 then
	SayOrPlayMessage (msgNoDocBookmarks_L, msgNoDocBookmarks_S)
	Return
endIf
if MoveToProofreadingElement (peBookmark, MoveDirection, sText) then
	if ! SayAllInProgress () then
		if ! GetAnnotationAtCaret (0, cscNull, sAuthor, sText, sDate, sDesc) then
			GetProofreadingElementInfo (peBookmark, sText, sAuthor, sInitials, sDesc, sDate)
		endIf
		if sDesc != cscNull then
			if BookmarkDetection () == wdVerbosityHigh		then
				return ;SelectionContextChangedEvent handles it.
			else
				say (sDesc, ot_line, TRUE)
			endIf
		else
			SayWord ()
		endIf
	endIf
else
	sayMessage (OT_ERROR, ErrorMsg)
endIf
endFunction

Script MoveToFirstBookmark ()
ProcessMoveToBookmark(s_top,
	FormatOutputMessage(ot_error,true,
		msgNoDocBookmarks_L,msgNoDocBookmarks_S))
EndScript

Script MoveToNextBookmark()
ProcessMoveToBookmark(s_next,
	FormatString(cmsgNoMoreElements,bookmarks))
EndScript

Script MoveToPriorBookmark()
ProcessMoveToBookmark(s_prior,
	FormatString(cmsgNoPriorElements,bookmarks))
EndScript

Script MoveToLastBookmark()
ProcessMoveToBookmark(s_bottom,
	FormatOutputMessage(ot_error,true,
		msgNoDocBookmarks_L,msgNoDocBookmarks_S))
EndScript

void function ProcessMoveToComment (int MoveDirection, string ErrorMsg)
Var
	string sText,
	String sAuthor,
	string sInitials,
	string sDesc,
	string sDate
if getWindowCategory () != wCat_document then
	return
endIf
if sayAllInProgress () then
	SetSayAllRestart()
endIf
if OutlookIsActive () then
	sayKeyNotAvailableAppMessage ()
	return
endIf
if getProofreadingElementCount (peComment) == 0 then
	sayOrPlayMessage (msgNoDocComments_L, msgNoDocComments_S)
	Return
endIf
if moveToProofreadingElement (peComment, MoveDirection, sText) then
	if ! sayAllInProgress () then
		announceComment (OT_USER_REQUESTED_INFORMATION)
	endIf
else
	sayMessage (OT_ERROR, ErrorMsg)
endIf
endFunction

script MoveToFirstComment ()
ProcessMoveToComment(s_top,
	FormatOutputMessage(ot_error,true,
		msgNoDocComments_L,msgNoDocComments_S))
EndScript

script MoveToNextComment ()
ProcessMoveToComment(s_next,
	FormatString(cmsgNoMoreElements,comments))
EndScript

script MoveToPriorComment ()
ProcessMoveToComment(s_prior,
	FormatString(cmsgNoPriorElements,comments))
EndScript

script MoveToLastComment ()
ProcessMoveToComment(s_bottom,
	FormatString(cmsgNoMoreElements,comments))
EndScript

void function ProcessMoveToFootnote (int MoveDirection, string ErrorMsg)
Var
	string sAuthor,
	string sInitials,
	string sDesc,
	string sDate,
	string sText
if GetWindowCategory () != wCat_document then
	return
endIf
if SayAllInProgress () then
	SetSayAllRestart()
endIf
if OutlookIsActive () then
	SayKeyNotAvailableAppMessage ()
	return
endIf
if getProofreadingElementCount (peFootnote) == 0 then
	sayOrPlayMessage (msgNoDocFootnotes_L, msgNoDocFootnotes_S)
	Return
endIf
if moveToProofreadingElement (peFootnote, MoveDirection, sText) then
	if ! SayAllInProgress () then
		if ! GetAnnotationAtCaret (0, cscNull, sAuthor, sText, sDesc, sDate) then
			GetProofreadingElementInfo (peFootnote, sText, sAuthor, sInitials, sDesc,sDate)
		endIf
		Say (sText, OT_LINE,TRUE)
	endIf
else
	SayMessage (OT_ERROR, ErrorMsg)
endIf
endFunction

script MoveToFirstFootnote ()
ProcessMoveToFootnote(s_top,
	FormatOutputMessage(ot_error,true,
		msgNoDocFootnotes_L,msgNoDocFootnotes_S))
EndScript

script MoveToNextFootnote ()
ProcessMoveToFootnote(s_next,
	FormatString(cmsgNoMoreElements,footnotes))
EndScript

script MoveToPriorFootnote ()
ProcessMoveToFootnote(s_prior,
	FormatString(cmsgNoPriorElements,footnotes))
EndScript

script MoveToLastFootnote ()
ProcessMoveToFootnote(s_bottom,
	FormatString(cmsgNoMoreElements,footnotes))
EndScript

Void function ProcessMoveToEndnote (int MoveDirection, string ErrorMsg)
Var
	string sAuthor,
	string sInitials,
	string sDesc,
	string sDate,
	string sText
If GetWindowCategory () != wCat_document then
	return
EndIf
if SayAllInProgress () then
	SetSayAllRestart()
endIf
if OutlookIsActive () then
	sayKeyNotAvailableAppMessage ()
	return
endIf
If GetProofreadingElementCount (peEndnote) == 0 then
	SayOrPlayMessage (msgNoDocEndnotes_L, msgNoDocEndnotes_S)
	Return
endIf
if moveToProofreadingElement(peEndnote,MoveDirection,sText) then
	if ! sayAllInProgress () then
		if ! GetAnnotationAtCaret (0, cscNull, sAuthor, sText, sDate, sDesc) then
			getProofreadingElementInfo (peEndNote, sText, sAuthor, sInitials, sDesc, sDate)
		endIf
		say (sText, OT_LINE,true)
	endIf
else
	sayMessage (OT_ERROR, ErrorMsg)
endIf
endFunction

script MoveToFirstEndnote()
ProcessMoveToEndnote(s_top,
	FormatOutputMessage(ot_error,true,
		msgNodocEndnotes_L,msgNodocEndnotes_S))
EndScript

script MoveToNextEndnote()
ProcessMoveToEndnote(s_next,
	FormatString(cmsgNoMoreElements,endnotes))
EndScript

script MoveToPriorEndnote()
ProcessMoveToEndnote(s_prior,
	FormatString(cmsgNoPriorElements,endnotes))
EndScript

script MoveToLastEndnote()
ProcessMoveToEndnote(s_bottom,
	FormatString(cmsgNoMoreElements,endnotes))
EndScript

void function ProcessMoveToRevision (int moveDirection, string ErrorMsg)
Var
	string sText,
	string sAuthor,
	string sInitials,
	string sDesc,
	string sDate
If getWindowCategory () != wCat_document then
	return
endIf
if sayAllInProgress () then
	SetSayAllRestart()
endIf
if OutlookIsActive () then
	sayKeyNotAvailableAppMessage ()
	return
endIf
If getProofreadingElementCount (peRevision) == 0 then
	SayOrPlayMessage (msgNoDocRevisions_l, msgNoDocRevisions_s)
	return
endIf
if MoveToProofreadingElement (peRevision, moveDirection,sText) then
	if ! GetAnnotationAtCaret (0, cscNull, sAuthor, sText, sDate, sDesc) then
		getProofreadingElementInfo (peRevision, sText, sAuthor, sInitials, sDesc,sDate)
	endIf
	if sDesc == msgSMMInsertedText then
		SayMessageWithMarkup (OT_SCREEN_MESSAGE,	FormatString (msgInsertedTextTemplate	, sText))
	elIf sDesc == msgSMMDeletedText then
		SayMessageWithMarkup (OT_SCREEN_MESSAGE,	FormatString (msgDeletedTextTemplate	, sText))
	else
		say (sText, OT_LINE,true)
	endIf
	if RevisionDetection () >= SpeakRevTypeAuthorDate then
		sayUsingVoice (vctx_message, FormatString (msgRevDate_L, sDate), OT_HELP)
	endIf
	if ! SayAllInProgress () then
		saySentence ()
	endIf
else
	sayMessage (OT_ERROR, msgNoDocRevisions_l, msgNoDocRevisions_s)
endIf
endFunction

script MoveToFirstRevision ()
ProcessMoveToRevision(s_top,
	FormatOutputMessage(ot_error,true,
		msgNoDocRevisions_l,msgNoDocRevisions_s))
endScript

script MoveToNextRevision()
ProcessMoveToRevision(s_next,
	FormatString(cmsgNoMoreElements,Revisions))
endScript

script MoveToPriorRevision()
ProcessMoveToRevision(s_prior,
	FormatString(cmsgNoPriorElements,Revisions))
endScript

script MoveToLastRevision()
ProcessMoveToRevision(s_bottom,
	FormatOutputMessage(ot_error,true,
		msgNoDocRevisions_l,msgNoDocRevisions_s))
endScript

void function ProcessMoveToGraphic (int MoveDirection,
	optional string ErrorMsg_L, optional string ErrorMsg_S)
Var
	string sText
if getWindowCategory () != wCat_document then
	return
endIf
If IsReadOnlyVirtualMessage() then
	Return default::ProcessMoveToTag (MoveDirection, cscGraphic, cscGraphicAttribs, CVMSGGraphic, false, false)
EndIf
if sayAllInProgress () then
	SetSayAllRestart()
endIf
if getProofreadingElementCount (peInlineShape) + GetProofreadingElementCount (peObject) == 0 then
	sayOrPlayMessage (msgNoDocGraphics_L, msgNoDocGraphics_S)
	return
endIf
if moveToProofreadingElement (peInlineShape, MoveDirection, sText)
|| moveToProofreadingElement (peObject, MoveDirection, sText) then
	if ! sayAllInProgress () then
		sayInlineShape ()
	endIf
else
	if MoveDirection == s_top then
		SayOrPlayMessage (ErrorMsg_L, ErrorMsg_S)
	else
		sayMessage (ot_error, ErrorMsg_L)
	endIf
endIf
endFunction

script moveToFirstGraphic()
ProcessMoveToGraphic (s_top,
	msgNoDocGraphics_L,msgNoDocGraphics_S)
EndScript

script MoveToNextGraphic()
ProcessMoveToGraphic(s_next,
	FormatString(cmsgNoMoreElements,graphics))
EndScript

script MoveToPriorGraphic()
ProcessMoveToGraphic(s_prior,
	FormatString(cmsgNoPriorElements,graphics))
EndScript

script MoveToLastGraphic()
ProcessMoveToGraphic(s_bottom,
	FormatString(cmsgNoMoreElements,graphics))
EndScript

void function ProcessMoveToPage (int MoveDirection,
	string ErrorMsg_L, optional string ErrorMsg_S)
If GetWindowCategory () != wCat_document then
	return
endIf
if SayAllInProgress () then
	SetSayAllRestart()
endIf
if OutlookIsActive () then
	sayKeyNotAvailableAppMessage ()
	return
endIf
if getDocPageCount () == 1 then
	sayOrPlayMessage (msgNoDocPages_l, msgNoDocPages_s)
	return
endIf
if moveToPage (MoveDirection) then
	if !SayAllInProgress () then
		pause ()
		default::SayLine ()
	endIf
else
	if MoveDirection == s_top
	|| MoveDirection == s_bottom then
		SayOrPlayMessage (ErrorMsg_L, ErrorMsg_S)
	else
		SayMessage (OT_ERROR, ErrorMsg_L)
	endIf
endIf
endFunction

script MoveToFirstPage()
ProcessMoveToPage(s_Top,
	msgMoveToPageError_L, msgMoveToPageError_S)
EndScript

script MoveToNextPage()
ProcessMoveToPage(s_next,
	FormatString(cmsgNoMoreElements,pages))
EndScript

script MoveToPriorPage()
ProcessMoveToPage(s_prior,
	FormatString(cmsgNoPriorElements,pages))
EndScript

script MoveToLastPage()
ProcessMoveToPage(s_bottom,
	msgMoveToPageError_L, msgMoveToPageError_S)
EndScript

void function processMoveToSection (int MoveDirection, string ErrorMsg)
If getWindowCategory () != wCat_document then
	return
endIf
if sayAllInProgress () then
	SetSayAllRestart()
endIf
If OutlookIsActive () then
	SayKeyNotAvailableAppMessage ()
	return
endIf
if GetDocSectionCount () == 1 then
	SayOrPlayMessage (msgNoDocSections_L, msgNoDocSections_S)
	Return
endIf
if MoveToSection (MoveDirection) then
	if ! SayAllInProgress () then
		pause ()
		default::SayLine ()
	endIf
else
	sayMessage (OT_ERROR, ErrorMsg)
endIf
endFunction

script MoveToFirstSection()
ProcessMoveToSection(s_top,
	FormatOutputMessage(ot_error,true,
		msgNoDocSections_L,msgNoDocSections_S))
EndScript

script MoveToNextSection()
ProcessMoveToSection(s_next,
	FormatString(cmsgNoMoreElements,sections))
EndScript

script MoveToPriorSection()
ProcessMoveToSection(s_prior,
	FormatString(cmsgNoPriorElements,sections))
EndScript

script MoveToLastSection()
ProcessMoveToSection(s_bottom,
	FormatString(cmsgNoMoreElements,sections))
EndScript

Void Function ProcessMoveToControlType(Int iControlType, String sElementType, Int bIsFormField, Int bShouldSetFocus, Int MoveDirection)
Var
	String sList,
	Int index,
	Int iCount,
	String smsg,
	int bForward
If IsReadOnlyVirtualMessage() then
	Return ProcessMoveToControlType (iControlType, sElementType, bIsFormField, bShouldSetFocus, MoveDirection)
EndIf
If GetWindowCategory () != wCat_document
	Return
EndIf
If SayAllInProgress ()
	SetSayAllRestart()
	Return
EndIf
sList = getListOfFormfields (list_item_separator, iControlType)
iCount = StringSegmentCount (sList, list_item_separator)
If Not iCount
	SayOrPlayMessage (FormatString (msgNoControlOfTypeFormFields_l, smmStripMarkup(smmGetStartMarkupForControlType(iControlType))))
	Return
EndIf
index = GetFormfieldIndex (iControlType)
smsg = FormatString (cmsgNoMoreElements, sElementType)
bForward = True
if MoveDirection == S_Prior then
	bForward = False
endIf
ProcessFormfieldMovement (index, iControlType, iCount, bForward, smsg)
EndFunction

Void Function ProcessFormfieldMovement (int index, int iControlType, int iCount, int bForward, string sMsgElementTypeError)
if ! iCount then
	sayFormattedMessage (OT_ERROR, sMsgElementTypeError)
	return
endIf
if bForward then
	let index = index + 1 ;move to next formfield of same type
elIf ! bForward then
	let index = index - 1 ;move to prior formfield of same type.
endIf
if ! MoveToFormFieldByIndex (index, iControlType) then
	sayFormattedMessage (OT_ERROR, sMsgElementTypeError)
	default::SayObjectTypeAndText ()
	SayF1Help ()
	return
endIf
endFunction

script MoveToNextCombo()
;for word, the combobox is a formfield, but for HTML it is a tagged element
If IsReadOnlyVirtualMessage() then
	MoveToNextCombo()
else
	ProcessMoveToControlType(wt_ComboBox, CVMSGComboBox1_L, true, UsesFocusChangeDepth(), s_Next)
endIf
EndScript

script MoveToPriorCombo()
;for word, the combobox is a formfield, but for HTML it is a tagged element
If IsReadOnlyVirtualMessage() then
	MoveToPriorCombo()
else
	ProcessMoveToControlType(wt_ComboBox, CVMSGComboBox1_L, true, UsesFocusChangeDepth(), s_Prior)
endIf
EndScript

void function ProcessUnavailableQuickNavKey()
if GetWindowCategory () != wCat_document then
	return
endIf
if ! SayAllInProgress () then
	sayKeyNotAvailableAppMessage ()
	return
endIf
SayAll ()
endFunction

Script MoveToNextBlockQuote()
If IsReadOnlyVirtualMessage() then
	return default::MoveToNextBlockQuote()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script MoveToPriorBlockQuote()
If IsReadOnlyVirtualMessage() then
	return default::MoveToPriorBlockQuote()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script JumpToLine()
If IsReadOnlyVirtualMessage() then
	return JumpToLine()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script JumpToTableCell()
If IsReadOnlyVirtualMessage() then
	return default::JumpToTableCell()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script JumpReturnFromTableCell()
If IsReadOnlyVirtualMessage() then
	return default::JumpReturnFromTableCell()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script MoveToNextPlaceMarker()
If IsReadOnlyVirtualMessage() then
	return default::MoveToNextPlaceMarker()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script MoveToPriorPlaceMarker()
If IsReadOnlyVirtualMessage() then
	return default::MoveToPriorPlaceMarker()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script SpeakPlaceMarkerN(int n)
If IsReadOnlyVirtualMessage() then
	return default::SpeakPlaceMarkerN(n)
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script MoveToPlaceMarkerN(int n)
If IsReadOnlyVirtualMessage() then
	return default::MoveToPlaceMarkerN(n)
EndIf
ProcessUnavailableQuickNavKey()
EndScript

void function ProcessMoveToElement(int MoveDirection, int bSameType, optional string ErrorMsg)
If IsReadOnlyVirtualMessage() then
	Return default::ProcessMoveToElement (MoveDirection, bSameType, ErrorMsg)
EndIf
ProcessUnavailableQuickNavKey()
EndFunction

Script MoveToNextNonlinkText()
If IsReadOnlyVirtualMessage() then
	return default::MoveToNextNonlinkText()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script MoveToPriorNonlinkText()
If IsReadOnlyVirtualMessage() then
	return default::MoveToPriorNonlinkText()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Void Function ProcessMoveToLinkInDocument (Int MoveDirection, Int linkType)
var int linkCount = getLinkCount ()
; this function has support for visited and unvisited links if the two following were to occur:
; Word supported the notion of visited and unvisited links,
; and our internal functions supported this.
if linkType == VisitedLink
	if !MoveToVisitedLink(MoveDirection) then
		;NotifyNavigationFailed(MoveDirection,cVMsgVisitedLinks1_L)
		if linkCount then
			if MoveDirection == S_NEXT then
				sayMessage (OT_ERROR, msgNoMoreHyperlinks_L, msgNoMoreHyperlinks_S)
				return
			elIf MoveDirection == S_PRIOR then
				sayMessage (OT_ERROR, msgNoPriorHyperlinks_L, msgNoPriorHyperlinks_S)
				return
			endIf
		endIf
		sayMessage (OT_ERROR, msgNoHyperlinks1_L, msgNoHyperlinks1_S)
		return
	endIf
elif linkType == UnvisitedLink
	if !MoveToUnvisitedLink(MoveDirection) then
		;NotifyNavigationFailed(MoveDirection,cVMsgUnvisitedLinks1_L)
		if linkCount then
			if MoveDirection == S_NEXT then
				sayMessage (OT_ERROR, msgNoMoreHyperlinks_L, msgNoMoreHyperlinks_S)
				return
			elIf MoveDirection == S_PRIOR then
				sayMessage (OT_ERROR, msgNoPriorHyperlinks_L, msgNoPriorHyperlinks_S)
				return
			endIf
		endIf
		sayMessage (OT_ERROR, msgNoHyperlinks1_L, msgNoHyperlinks1_S)
		return
	endIf
else ;linkType == AnyLink
	if !MoveToAnyLink(MoveDirection) then
		;NotifyNavigationFailed(MoveDirection,cVMsgLinks1_L)
		if linkCount then
			if MoveDirection == S_NEXT then
				sayMessage (OT_ERROR, msgNoMoreHyperlinks_L, msgNoMoreHyperlinks_S)
				return
			elIf MoveDirection == S_PRIOR then
				sayMessage (OT_ERROR, msgNoPriorHyperlinks_L, msgNoPriorHyperlinks_S)
				return
			endIf
		endIf
		sayMessage (OT_ERROR, msgNoHyperlinks1_L, msgNoHyperlinks1_S)
		return
	endIf
endIf
if !SayAllInProgress()
|| MoveDirection == s_Top
|| MoveDirection == s_Bottom then
	SayLine ()
endIf
endFunction

Void Function ProcessMoveToLink (Int MoveDirection, Int linkType)
If IsReadOnlyVirtualMessage() then
	Return ProcessMoveToLink (MoveDirection, linkType)
elIf GetWindowCategory () == wCat_document
	Return ProcessMoveToLinkInDocument (MoveDirection, AnyLink) ; Word has no notion of visited or unvisited links.
EndIf
Return (ProcessUnavailableQuickNavKey())
EndFunction

Script MoveToNextListItem()
If IsReadOnlyVirtualMessage() then
	MoveToNextListItem()
else
	ProcessUnavailableQuickNavKey()
endIf
EndScript

Script MoveToPriorListItem()
If IsReadOnlyVirtualMessage() then
	MoveToPriorListItem()
else
	ProcessUnavailableQuickNavKey()
endIf
EndScript

Void Function ProcessMoveToList (Int MoveDirection, optional string ErrorMsg)
var
	int bSayAllInProgress
If IsReadOnlyVirtualMessage() then
	Return default::ProcessMoveToList(MoveDirection)
EndIf
Let bSayAllInProgress = SayAllInProgress ()
If GetWindowCategory () != wCat_document then
	return
EndIf
if SayAllInProgress () then
	SetSayAllRestart()
endIf
If StringLength (GetListOfLists ()) == 0 then
	SayOrPlayMessage (msgNoLists1_L, msgNoLists1_S)
	Return
endIf
if MoveToList(MoveDirection) then
	if !bSayAllInProgress
	|| (MoveDirection == s_Top || MoveDirection == s_Bottom) then
		SayLine ()
	EndIf
else
	if MoveDirection == s_top
	|| MoveDirection == s_bottom then
		SayOrPlayMessage (ErrorMsg, ErrorMsg)
	else
		SayMessage (OT_ERROR, ErrorMsg)
	endIf
EndIf
endFunction

Script MoveToNextList()
ProcessMoveToList (s_next, FormatString(cmsgNoMoreElements,lists))
EndScript

Script MoveToPriorList()
ProcessMoveToList (s_prior, FormatString(cmsgNoPriorElements,lists))
EndScript

Script MoveToNextSpan()
If IsReadOnlyVirtualMessage() then
	return default::MoveToNextSpan()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script MoveToPriorSpan()
If IsReadOnlyVirtualMessage() then
	return default::MoveToPriorSpan()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script MoveToNextDivision()
If IsReadOnlyVirtualMessage() then
	return default::MoveToNextDivision()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

Script MoveToPriorDivision()
If IsReadOnlyVirtualMessage() then
	return default::MoveToPriorDivision()
EndIf
ProcessUnavailableQuickNavKey()
EndScript

int function StepOutOfCurrentElement (int bForward)
If IsReadOnlyVirtualMessage() then return builtin::StepOutOfCurrentElement (bForward) EndIf
if InTable () then
	if StepOutOfTable (bForward) then
		return TRUE
	endIf
elIf inList () then
	if stepOutOfList (bForward) then
		sayMessage (OT_STATUS, msgOutOfList)
	endIf
endIf
return FALSE
endFunction

Script StepToStartOfElement()
If IsReadOnlyVirtualMessage() then
	PerformScript StepToStartOfElement()
	return 
EndIf
If GetWindowCategory() != wCat_document then
	return
EndIf
if SayAllInProgress() then
	SetSayAllRestart()
EndIf
if InTable() then
	ScrollTableIntoView(true)
	Pause()
endIf
if StepOutOfCurrentElement (FALSE) then
	If SayAllInProgress () then
		Return
	EndIf
	delay(5)
	default::SayLine ()
endIf
EndScript

script StepToEndOfElement()
If IsReadOnlyVirtualMessage() then
	PerformScript StepToEndOfElement()
	return
EndIf
If GetWindowCategory() != wCat_document then
	return
EndIf
if SayAllInProgress() then
	SetSayAllRestart()
EndIf
if InTable() then
	ScrollTableIntoView(false)
	Pause()
endIf
if StepOutOfCurrentElement (TRUE) then
	If SayAllInProgress () then
		Return
	EndIf
	delay(5)
	default::SayLine ()
endIf
EndScript

script MoveToNextWordFromList()
If GetWindowCategory() != wCat_document then
	return
EndIf
if SayAllInProgress() then
	SetSayAllRestart()
EndIf
if !GlobalCurrentWordFromList then
	SayOrPlayMessage(cmsgNoWordList,cmsgNoWordList)
	return
endIf
if FindString(GetFocus(),GlobalCurrentWordFromList,s_next,S_RESTRICTED,UsesUnderlyingDom()) then
	if !SayAllInProgress() then
		sayLine()
		NotifyIfContextHelp ()
	endIf
else
	SayMessage(ot_error,cmsgNoNextWord_L,cmsgNoNextWord_S)
EndIf
EndScript

script MoveToPriorWordFromList()
If GetWindowCategory() != wCat_document then
	return
EndIf
if SayAllInProgress() then
	SetSayAllRestart()
EndIf
if !GlobalCurrentWordFromList then
	SayOrPlayMessage(cmsgNoWordList,cmsgNoWordList)
	return
endIf
if FindString(GetFocus(),GlobalCurrentWordFromList,s_prior,S_RESTRICTED,UsesUnderlyingDom()) then
	if !SayAllInProgress() then
		sayLine()
		NotifyIfContextHelp ()
	endIf
else
	SayMessage(ot_error,cmsgNoPriorWord_L,cmsgNoPriorWord_S)
EndIf
EndScript

void Function SayQuickKeyNavigationNotAvailable ()
if ! SayAllInProgress ()
&& ! IsVirtualPCCursor () then
	if GetWindowCategory () == wCat_document then
		sayMessage (OT_ERROR, cmsgNotAvailable)
	endIf
	return
endIf
sayAll (2)
endFunction

string function NavigationQuickKeysSet(int iRetCurVal)
if !inDocument()
	return NavigationQuickKeysSet (iRetCurVal)
endIf
;the option must be on for SetQuickKeyNavigationMode to take effect if turned on:
setJcfOption (opt_quick_key_navigation_mode, (getRunningFSProducts() != PRODUCT_MAGic))
if ! iRetCurVal then
	;update the value
	if giQuickNavState == 1 then
		giQuickNavState = 0
	else
		giQuickNavState = 1
	endIf
	setQuickKeyNavigationState (giQuickNavState)
	if ! OutlookIsActive () then
		setFindItemToPage () ; for Word windows only.
	endIf
endIf
if giQuickNavState == 0 then
	Return cmsg_off
else
	return cmsg_on
endIf
EndFunction

Script NavigationModeToggle ()
Var
	String sMsg,
	Int iMode = QuickKeyNavigationModeActive ()

If (!iMode
&& ! InDocument ()
|| (OutlookIsActive ()
&& (isActiveDocumentReadOnly ()
|| IsActiveWindowProtected ())))
	SayMessage (OT_ERROR, msgQuickNavNotAvailable_L, cmsgNotAvailable)
	Return
EndIf
sMsg = NavigationQuickKeysSet(0)
If StringCompare (sMsg, cmsg_on) == 0
	SayUsingVoice (vctx_message, cmsgNavigationModeOn_l, OT_STATUS)
	TrackEvent(event_QuickNavEnabled)
Else
	SayUsingVoice (vctx_message, cmsgNavigationModeOff_l, OT_STATUS)
EndIf
giQuickNavStateFromScript = giQuickNavState
EndScript

globals
	collection c_QuickNavScripts

Script KeyboardHelp()
PerformScript KeyboardHelp()
InitQuickNavScriptNameConversionTable()
EndScript

void function UnhookKeyboardHelp()
UnhookKeyboardHelp()
CollectionRemoveAll(c_QuickNavScripts)
EndFunction

void function InitQuickNavScriptNameConversionTable()
var
	string sTableItem,
	int ItemCount,
	int i,
	int bOutlookIsActive,
	int bVPCActive,
	int iOutlookEntry,
	collection c,
	string sScriptName
let bVPCActive = IsVirtualPCCursor()
let bOutlookIsActive = OutlookIsActive()
if !c_QuickNavScripts then
	let c_QuickNavScripts = new collection
EndIf
let i = 1
let ItemCount = StringSegmentCount(msgQuickNavScriptNameConversionTable,"\n")
while i <= ItemCount
	let sTableItem = StringSegment(msgQuickNavScriptNameConversionTable,"\n",i)
	let c = new collection
	let c.Default = StringSegment(sTableItem,"=",2)
	let sScriptName = StringSegment(sTableItem,"=",1)
	if sScriptName == cscNull then
		;This script is unavailable unless the virtual cursor is active.
		let sScriptName = c.Default
		let c.Available = bVPCActive
	else
		if bOutlookIsActive then
			;Is the script available in Outlook:
			let iOutlookEntry = StringToInt(StringSegment(sTableItem,"=",3))
			if iOutlookEntry == 0 then
				;the hook function receives the default script name:
				let sScriptName = c.Default
				let c.Available = false
			elif iOutlookEntry == 1 then
				let c.Available = !bVPCActive
			elif iOutlookEntry == 2 then
				let sScriptName = c.Default
				let c.Available = bVPCActive
			EndIf
		else ;This is a Word script:
			let c.Available = true
		EndIf
	EndIf
	let c_QuickNavScripts[sScriptName] = c
	let i = i+1
EndWhile
EndFunction

void function SetKeyboardHelpScriptNameData(string ScriptName, string FrameName)
var
	string sDefault,
	int iParam
let c_KeyboardHelpData.UseDefaultJSD = false
let c_KeyboardHelpData.ScriptAvailable = true
SetKeyboardHelpScriptNameData(ScriptName,FrameName)
if CollectionItemExists(c_QuickNavScripts,c_KeyboardHelpData.ScriptName) then
	if IsVirtualPCCursor() then
		let sDefault = c_QuickNavScripts[c_KeyboardHelpData.ScriptName].Default
		;now see if there are multiple default script name possibilities:
		if StringContains(sDefault,"|") then
			;there are multiple possibilities currently for headings and placemarker quicknav scripts
			let iParam = StringToInt(c_KeyboardHelpData.Cmd)
			if ScriptName == scScript_moveToNextHeading
			|| ScriptName == scScript_moveToPriorHeading then
				if iParam > 0 && iParam < 7 then
					let c_KeyboardHelpData.ScriptName = StringSegment(sDefault,"|",2)
				elif iParam >= 7 then
					let c_KeyboardHelpData.ScriptName = StringSegment(sDefault,"|",3)
				EndIf
			EndIf
		else
			let c_KeyboardHelpData.ScriptName = sDefault
		EndIf
		let c_KeyboardHelpData.UseDefaultJSD = true
	else
		let c_KeyboardHelpData.ScriptAvailable = c_QuickNavScripts[c_KeyboardHelpData.ScriptName].Available
	EndIf
EndIf
EndFunction

void function LookupKeyboardHelpMessage()
if c_KeyboardHelpData.ScriptAvailable == true
|| c_KeyboardHelpData.HelpType >= KeyboardHelpType_Name then
	LookupKeyboardHelpMessage()
else
	If c_KeyboardHelpData.HelpType == KeyboardHelpType_Description then
		let c_KeyboardHelpData.HelpMessage = msgKeyboardHelpSynopsisQuickNavNotAvailable
	else ;first press of keystroke
		let c_KeyboardHelpData.KeyName = GetCurrentScriptKeyName ()
		let c_KeyboardHelpData.HelpMessage = msgKeyboardHelpDescriptionQuickNavNotAvailable
	EndIf
EndIf
EndFunction

string function GetScriptDescription(string sScriptName, optional int UseDefaultJSD)
if c_KeyboardHelpData.UseDefaultJSD == true then
	return GetScriptDescription(sScriptName,c_KeyboardHelpData.UseDefaultJSD)
else
	return GetScriptDescription(sScriptName,UseDefaultJSD)
EndIf
EndFunction

string function GetScriptSynopsis(string sScriptName, optional int UseDefaultJSD)
if c_KeyboardHelpData.UseDefaultJSD == true then
	return GetScriptSynopsis(sScriptName,c_KeyboardHelpData.UseDefaultJSD)
else
	return GetScriptSynopsis(sScriptName,UseDefaultJSD)
EndIf
EndFunction

Script LaunchCommandsSearch()
if giQuickNavState == QuickNavOn then
	giQuickNavState = QuickNavSuspended
	let gbQuickNavKeyTrapping = false
	TrapKeys(false)
endIf
PerformScript LaunchCommandsSearch()
endScript


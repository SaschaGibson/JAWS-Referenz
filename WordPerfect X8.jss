; Copyright 1995-2021 by Freedom Scientific, Inc.
;JAWS Script File for WordPerfect 18.0 (Corel WordPerfect Office X8)
; Special thanks for reference information from Marco Zehe OmniPc Germany.
; Some original code taken from WPWin8.* by Sean Murphy.
; Special Thanks to Julie Westergren, www.wpmacros.com
;for the string descriptions corresponding to the int values returned by EnvRightCode for
;Reveal Codes support.

; Note while this file is similar to WpWin8.jss, it is not identical to it and
;care must be taken when copying code between  the files.
; Other scripts files that are associated with this file are:
;
; eqnedt32, for the WordPerfect Equation editor.
; wpwin, the object model code for WordPerfect.
include"HjHelp.jsh"
include "hjconst.jsh"
include "hjglobal.jsh"
include "wpwin.jsh"
include "wpwin18.jsh"
include "common.jsm"
include "wpwin18.jsm"
use "wpwin.jsb"
use "WP Quicknav.jsb"

Void Function AutostartEvent ()
/*
If !WPVersionSupported () Then
	UserBufferDeactivate ()
	UserBufferClear ()
	Say (msgVersionNotResponding, ot_user_Buffer)
	UserBufferAddText(cscBufferNewLine+cmsgBuffexit)
EndIf
*/
if (GetWindowClass (GetFocus())==wc_MainDocumentWindow) Then
	let GlobalPowerBar= OFF
EndIf
if wp18HasRunOnce==false then
	let wp18HasRunOnce=true
	PowerBar (GlobalPowerBar)
	resetDetectionFlags()
endIf
Let giIgnoreActiveItemChange = FALSE
loadApplicationSettings()
EndFunction


Function initializeApplicationGlobals ()
let globalDetectPageAndColumnBreaks=false ; off by default
let globalDetectTables=false
let globalDetectStyleChanges=false
let globalDetectLanguages=false
let globalDetectBorders=false
SetJcfOption(opt_quick_key_navigation_mode,0) ; off by default
EndFunction

Void Function AutoFinishEvent ()
if globalDetectLanguages then
	setEloqLanguage(globalDefaultLanguage)
endIf
EndFunction

Script  ScriptFileName()
;announces the name of the application and currently executing scriptfile.
If UserBufferIsActive ()then
	SayFormattedMessage (OT_NO_DISABLE, cMsgVirtualViewerSettings)
	Return
EndIf
ScriptAndAppNames (MsgCorelWordperfect1_L)
EndScript

Script SayFont ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
sayFont()
EndScript

Script toggleBold ()
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
TypeKey(ksBold)
pause()
; check if text is highlighted as reporting of status is inaccurate when text is highlighted
if getSelectedText() !=cscNull then
	SayFormattedMessage (ot_JAWS_message, msgBold1_L)
	return
endIf
if fontIsBold() || getCharacterAttributes() & attrib_bold then
	SayFormattedMessage (ot_JAWS_message, formatString(cMsg240_L, msgBold1_L))
else
	SayFormattedMessage (ot_JAWS_message, formatString(cMsg241_L, msgBold1_L))
endIf
EndScript

Script toggleUnderline ()
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
TypeKey(ksUnderline)
pause()
; check if text is highlighted as reporting of status is inaccurate when text is highlighted
if getSelectedText() !=cscNull then
	SayFormattedMessage (ot_JAWS_message, msgUnderline1_L)
	return
endIf
if fontIsUnderlined() || getCharacterAttributes() & attrib_underline then
	SayFormattedMessage (ot_JAWS_message, formatString(cMsg240_L, msgUnderline1_L))
else
	SayFormattedMessage (ot_JAWS_message, formatString(cMsg241_L, msgUnderline1_L))
endIf
EndScript

Script toggleItalic ()
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
typeKey(ksItalic)
pause()
; check if text is highlighted as reporting of status is inaccurate when text is highlighted
if getSelectedText() !=cscNull then
	SayFormattedMessage (ot_JAWS_message, msgItalic1_L)
	return
endIf
if fontIsItalic() || getCharacterAttributes() & attrib_italic then
	SayFormattedMessage (ot_JAWS_message, formatString(cMsg240_L, msgItalic1_L))
else
	SayFormattedMessage (ot_JAWS_message, formatString(cMsg241_L, msgItalic1_L))
endIf
EndScript

Script justifyCenter ()
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
; If not in document window, pass keystroke through to application.
if inDocumentWindow() then
	SayFormattedMessage (ot_JAWS_message, msgJustifyCenter1_L)
	justifyCenter()
Else
	TypeKey(ksCenterText)
EndIf
EndScript

Script justifyRight ()
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
; If not in document window, pass keystroke through to application.
if inDocumentWindow() then
	SayFormattedMessage (ot_JAWS_message, msgJustifyRight1_L)
	justifyRight()
Else
	TypeKey(ksRightJustify)
EndIf
EndScript

Script justifyLeft ()
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
; If not in document window, pass keystroke through to application.
if inDocumentWindow() then
	SayFormattedMessage (ot_JAWS_message, msgJustifyLeft1_L)
	justifyLeft()
Else
	TypeKey(ksLeftJustify)
EndIf
EndScript

Script justifyFull ()
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
; If not in document window, pass keystroke through to application.
if inDocumentWindow() then
	SayFormattedMessage (ot_JAWS_message, msgJustifyFull1_L)
	justifyFull()
Else
	TypeKey(ksJustifyFull)
EndIf
EndScript

Script centerLine ()
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
; If not in document window, pass keystroke through to application.
if inDocumentWindow() then
	SayFormattedMessage (ot_JAWS_message, msgCenterLine1_L)
	centerLine()
Else
	typeCurrentScriptKey()
EndIf
EndScript

Script flushRight ()
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
; If not in document window, pass keystroke through to application.
if inDocumentWindow() then
	SayFormattedMessage (ot_JAWS_message, msgFlushRight1_L)
	flushRight()
Else
	typeCurrentScriptKey()
EndIf
EndScript

Script OpenFontWindow ()
Var
	Handle HWnd, ;Handle of window.
	handle hwndSize
; in SP2 and higher, Point Size and Font Size have same cId.
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if inDocumentWindow() then
	let GlobalPowerBar	= ON
	PowerBar (GlobalPowerBar )
	Delay (3)
	let Hwnd = FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CId_FontWindow)
	let HwndSize=FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CId_PointSizeWindow)
	If IsWindowVisible (HWnd) Then
		if !hWndSize then
			MoveToWindow (getNextWindow(HWnd))
		else
			MoveToWindow (HWnd)
		endIf
		SayUsingVoice(vctx_pcCursor,WPMsg4_L, ot_JAWS_message)
		delay (3)
		LeftMouseButton ()
	endIf
	PcCursor	()
EndIf
EndScript

Script OpenPointSizeWindow ()
Var
	Handle Hwnd, ;Handle of window
	handle hWndFont
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if inDocumentWindow() then
	let GlobalPowerBar	= ON
	PowerBar (GlobalPowerBar  )
	delay (2)
	let HWnd = FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CId_PointSizeWindow)
	let hWndFont = FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CId_FontWindow)
	If IsWindowVisible (HWnd) Then
		MoveToWindow (Hwnd)
		SayUsingVoice(vctx_pcCursor,WPMsg5_L, ot_JAWS_message)
		Delay (5)
		LeftMouseButton ()
	elif isWindowVisible(hwndFont) then
		MoveToWindow (HwndFont)
		SayUsingVoice(vctx_pcCursor,WPMsg5_L, ot_JAWS_message)
		Delay (5)
		LeftMouseButton ()
	endIf
	PcCursor ()
EndIf
EndScript

Script OpenStyleWindow ()
Var
	Handle Hwnd ;Handle of window.
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if inDocumentWindow() then
	let GlobalPowerBar	= ON
	PowerBar (GlobalPowerBar  )
	Delay (2)
	JAWSCursor()
	let HWnd = FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CId_StyleWindow)
	If hwnd && IsWindowVisible (HWnd) Then
		MoveTo(getWindowRight(hwnd)-8,getWindowBottom(hwnd))
		SayUsingVoice(vctx_pcCursor,WPMsg6_L, ot_JAWS_message)
		Delay (3)
		LeftMouseButton ()
		TypeKey (cksDownArrow)
	endIf
	PcCursor ()
EndIf
EndScript

Script SpellAsYouGo ()
Var
	Handle AppWin, ;the Application window handle.
	Int ForeColor, ;foreground color of text.
	Int BackColor, ;Stores the background color of the text.
	int quickThesaurusActive,
	string firstSuggestion,
	Handle Hwnd, ;window handle of the Prompt as you go window.
	String Word ;Current word the cursor is on.
if QuickNavKeyTrapping() then
	return
EndIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if inDocumentWindow() then
	let GlobalPowerBar	= On
	PowerBar (GlobalPowerBar  )
	delay  (3)
	If (GetWindowClass (GetCurrentWindow ()) == WC_MainDocumentWindow) Then
		;Store the current word where the pc cursor is situated.
		let Word =getWord()
		let AppWin = GetAppMainWindow (GetCurrentWindow ()) ;application window handle
		;The following line finds the Prompt as you go edit combo box window handle.
		saveCursor()
		InvisibleCursor ()
		let Hwnd = FindDescendantWindow (AppWin, CId_MisspelledWindow)
		;There is two windows associated with the prompt as you go window.
		;the first window is an edit combo box which has a unique control id.
		;this is obtain by the FindDecendentWindow function found above.
		;The test tries to move to this combo box window.
		If MoveToWindow (Hwnd) Then
			;The second window (the second child window of the combo box) is the actual edit box
			;with the first correction in it.	the following function moves the JAWS cursor to this
			;window.
			MoveToWindow (FindDescendantWindow (HWnd, CID_MisspelledAsYouGoEdit))
			;Store the foreground and background colours.
			let ForeColor = GetColorText ()
			let BackColor = GetColorBackGround ()
			If (GetWord () == cscNull) then
				SayUsingVoice(vctx_pcCursor, formatString(WPMsg11_L, word), ot_error)
				restoreCursor()
				let GlobalPowerBar	= Off
				PowerBar (GlobalPowerBar  )
				Return ;Nothing in the prompt as you go window.
			endIf ;(GetWord == cscNull)
			; get the first suggestion
			let firstSuggestion=getWindowText(getCurrentWindow(),read_everything)
			;The following "If" test checks the color that the cursor is on.
			let quickThesaurusActive=false
			;If the colors are Red on White, then the
			;current word is misspelled and the quick spell checker is active.
			If (GetColorName (ForeColor) == colorRed)
			&& (GetColorName (BackColor) == colorWhite) Then
				SayUsingVoice(vctx_pcCursor, formatString(WPMsg7_L, Word), ot_smart_help)
				pcCursor() ; ensure that the spell strings get spoken in the pc cursor voice.
				SpellString (Word)
				sayUsingVoice(vctx_pcCursor, formatString(WPMsg8_L, firstSuggestion), ot_smart_help)
				spellString(firstSuggestion)
			ElIf (GetColorName (ForeColor) == colorBlue)
			&& (GetColorName (BackColor) == colorWhite) Then
				SayUsingVoice(vctx_pcCursor, formatString(WPMsg9_L, word), ot_smart_help)
				SayUsingVoice(vctx_pcCursor, formatString(WPMsg8_L, firstSuggestion), ot_no_disable)
			ElIf (GetColorName (ForeColor) == colorBlack)
			&& (GetColorName (BackColor) == colorWhite) Then
				SayUsingVoice(vctx_pcCursor, formatString(WPMsg12_L, word), ot_smart_help)
				let quickThesaurusActive=true
			endIf ;end of checking the colors.
		endIf ;Move to Misspelled window
		restoreCursor()
		RoutePcToInvisible ()
	endIf ;Focus is in the main edit window.
EndIf
EndScript

string function toggleLanguageDetection (int iRetCurVal)
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if not iRetCurVal then
	;update the value
	if globalDetectLanguages then
		let globalDetectLanguages=false
		setEloqLanguage(globalDefaultLanguage)
	else
		let globalDetectLanguages=true
	endIf
EndIf
if globalDetectLanguages then
	return msgDetectLanguagesOn1_S
else
	return msgDetectLanguagesOff1_S
endIf
EndFunction

string function toggleStyleDetection (int iRetCurVal)
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if not iRetCurVal then
	;update the value
	let globalDetectStyleChanges=!globalDetectStyleChanges
	let globalPriorStyle=CSCNULL ; reset to force announcement
EndIf
if globalDetectStyleChanges then
	return msgDetectStylesOn1_S
else
	return msgDetectStylesOff1_S
endIf
EndFunction

string function toggleTables (int iRetCurVal)
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if not iRetCurVal then
	;update the value
	let globalDetectTables=!globalDetectTables
EndIf
if globalDetectTables then
	return msgDetectTablesOn1_S
else
	return msgDetectTablesOff1_S
endIf
EndFunction

string function toggleBorderDetection (int iRetCurVal)
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if not iRetCurVal then
	;update the value
	let globalDetectBorders=!globalDetectBorders
EndIf
if globalDetectBorders then
	return msgDetectBordersOn1_S
else
	return msgDetectBordersOff1_S
endIf
EndFunction

Script AdjustJAWSVerbosity ()
var
string list,
String StrWpwinVerbosityItems,
int priorDetectPageAndColumnBreaks,
int priorDetectTables,
int priorDetectStyleChanges,
int priorDetectBorders,
int priorDetectLanguages

	if (IsSpeechOff ()) then
	    PerformScript MuteSynthesizer()
	    return
endIf
if InHJDialog () then
	SayFormattedMessage (OT_error, cMsg337_L, cMsg337_S)
	return
endIf
Let StrWpwinVerbosityItems = jvPageAndColumnBreakDetection
	+jvStyleDetection
	+jvTables
	+jvLanguageDetection
	+jvBorderDetection
let list = StrWpwinVerbosityItems+cStrDefaultList()
; store prior settings to see what changes
let priorDetectPageAndColumnBreaks=globalDetectPageAndColumnBreaks
let priorDetectTables=globalDetectTables
let priorDetectStyleChanges=globalDetectStyleChanges
let priorDetectBorders=globalDetectBorders
let priorDetectLanguages=globalDetectLanguages
DlgSelectFunctionToRun (list, AdjustJAWSVerbosityDialogName, false)
; see if any app specific settings have changed
if (priorDetectPageAndColumnBreaks!=globalDetectPageAndColumnBreaks) ||
	(priorDetectTables!=globalDetectTables) ||
	(priorDetectStyleChanges!=globalDetectStyleChanges) ||
	(priorDetectBorders!=globalDetectBorders) ||
	(priorDetectLanguages!=globalDetectLanguages) then
	if saveApplicationSettings() then
		SayFormattedMessage (ot_JAWS_message, msgAppSettingsSaved1_L, cmsgSilent)
	else
		SayFormattedMessage (ot_error, msgAppSettingsNotSaved1_L, cmsgSilent)
	endIf
endIf
EndScript

int Function inDocumentWindow ()
; the control id is 0 if the menubar is active but is non-zero if the document window has focus.
return getWindowClass(globalFocusWindow)==wc_mainDocumentWindow && getCurrentControlId() !=0
EndFunction

Script SayPriorSentence ()
if isPcCursor() && inDocumentWindow() then
	if inTable() then
		typeKey(cksAltUpArrow)
		pause()
		detectContext()
		sayCellLineSegment()
		return
	endIf
	PriorSentence ()
	delay(2)
	detectContext()
	SaySentence ()
else
	PerformScript SayPriorSentence ()
endIf
EndScript

Script SayNextSentence ()
if isPcCursor() && inDocumentWindow() then
	if inTable() then
		TypeKey(cksAltDownArrow)
		pause()
		detectContext()
		sayCellLineSegment()
		return
	endIf
	NextSentence ()
	delay(2)
	detectContext()
	SaySentence ()
Else
	PerformScript SayNextSentence ()
EndIf
EndScript

Script sayPriorParagraph ()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if isPcCursor() && inDocumentWindow() then
	moveToPriorParagraph()
	if not isKeyWaiting() then
		detectContext()
		sayParagraph()
	endIf
else
	performScript sayPriorParagraph()
endIf
EndScript

Script sayNextParagraph ()
if SayAllInProgress() then
	let gbRestartSayAll = true
EndIf
if isPcCursor() && inDocumentWindow() then
	moveToNextParagraph()
	if not isKeyWaiting() then
		detectContext()
		sayParagraph()
	endIf
else
	performScript sayNextParagraph()
endIf
EndScript

Script sayPriorCharacter ()
if isPcCursor() && inDocumentWindow() then
	priorCharacter()
	if ((IsLeftButtonDown()) || (IsRightButtonDown())) then
	  SelectingText(TRUE)
	  pause ()
	  SelectingText(false)
	  return
	endIf
	detectContext()
	sayCharacter()
	return
elif getWindowClass(getFocus())==wc_outlineArray then
	priorCharacter()
	sayWPOutlineArraySelection()
ElIf (GetWindowClass (GlobalFocusWindow) == wc_WPPopOutWindow) Then
	PriorCharacter ()
	SayLine ()
else
	performScript sayPriorCharacter() ;default
endIf
EndScript

Script sayNextCharacter ()
if isPcCursor() && inDocumentWindow() then
		nextCharacter()
	if ((IsLeftButtonDown()) || (IsRightButtonDown())) then
	  SelectingText(TRUE)
	  pause ()
	  SelectingText(false)
	  return
	endIf
	detectContext()
	sayCharacter()
elif getWindowClass(getFocus())==wc_outlineArray then
	nextCharacter()
	sayWPOutlineArraySelection()
ElIf (GetWindowClass (GlobalFocusWindow) == wc_WPPopOutWindow) Then
	NextCharacter ()
	SayLine ()
else
	performScript sayNextCharacter() ; default
endIf
EndScript

Script priorTableColumn ()
typeCurrentScriptKey()
if isPcCursor() && inDocumentWindow() then
	pause()
	detectContext()
;	if InTable ()	 then
if globalInTableFlag  Then
	sayCellLineSegment()
elif globalMultipleColumns then
	sayColumnLineSegment()
else
		sayWord()
	endIf
endIf
EndScript

Script nextTableColumn ()
typeCurrentScriptKey()
if isPcCursor() && inDocumentWindow() then
	pause()
	detectContext()
;	if inTable() then
If globalInTableFlag  Then
		sayCellLineSegment()
elif globalMultipleColumns then
	sayColumnLineSegment()
else
		sayWord()
	endIf
endIf
EndScript

Script sayPriorLine ()
var
string TheClass,
string grandparentClass

let grandparentClass=getWindowClass(getParent(getParent(globalFocusWindow)))
Let TheClass = GetWindowClass (GlobalFocusWindow)
if isPcCursor() && inDocumentWindow() then
	priorLine()
	if ((IsLeftButtonDown()) || (IsRightButtonDown())) then
	  SelectingText(TRUE)
	  pause ()
	  SelectingText(false)
	  return
	endIf
	if not isKeyWaiting() then
		detectContext()
		sayLine()
	endIf
; Handle the style, Spell as-you-go, font and point size  combo on the powerbar.
elif (getControlId(globalFocusWindow)==cId_styleCombo ||
getControlId(globalFocusWindow)==cId_FontCombo ||
getControlId(globalFocusWindow)==cId_MisspelledAsYouGoEdit) &&
 grandParentClass==wc_toolbar then
	priorLine()
;	let suppressEcho=true
	Say (GetWindowText (GlobalFocusWindow, FALSE), OT_NO_DISABLE)
	return
elif getWindowClass(getFocus())==wc_outlineArray then
	priorLine()
	sayWPOutlineArraySelection()
ElIf (GetWindowClass (GlobalFocusWindow) == wc_WPPopOutWindow) Then
	PriorLine()
	SayLine ()
ElIf (TheClass == wc_GLB) Then
	PriorLine ()
	SayObjectTypeAndText ()
	SayFormattedMessage (ot_control_type, WPMsgImageArray_L, cMsgSilent)
else
	performScript sayPriorLine() ; default
endIf
EndScript

Script sayNextLine ()
var
string TheClass,
string grandParentClass
let grandparentClass=getWindowClass(getParent(getParent(globalFocusWindow)))
Let TheClass = GetWindowClass (GlobalFocusWindow)
if isPcCursor() && inDocumentWindow() then
	nextLine()
	if ((IsLeftButtonDown()) || (IsRightButtonDown())) then
	  SelectingText(TRUE)
	  pause ()
	  SelectingText(false)
	  return
	endIf
	if not isKeyWaiting() then
		detectContext()
		sayLine()
	endIf
; Handle the style, Spell as-you-go, font and point size  combo on the powerbar.
elif (getControlId(globalFocusWindow)==cId_styleCombo ||
getControlId(globalFocusWindow)==cId_FontCombo ||
getControlId(globalFocusWindow)==cId_MisspelledAsYouGoEdit) &&
 grandParentClass==wc_toolbar then
	nextLine()
;	let suppressEcho=true
	Say (GetWindowText (GlobalFocusWindow, FALSE), OT_NO_DISABLE)
	return
elif getWindowClass(getFocus())==wc_outlineArray then
	nextLine()
	sayWPOutlineArraySelection()
ElIf (GetWindowClass (GlobalFocusWindow) == wc_WPPopOutWindow) Then
	nextLine()
	SayLine ()
ElIf (TheClass == wc_GLB) Then
	NextLine ()
	SayObjectTypeAndText ()
	SayFormattedMessage (ot_control_type, WPMsgImageArray_L, cMsgSilent)
else
	performScript sayNextLine() ; default
endIf
EndScript

Script sayPriorWord ()
if isPcCursor() && inDocumentWindow() then
	priorWord()
	if ((IsLeftButtonDown()) || (IsRightButtonDown())) then
	  SelectingText(TRUE)
	  pause ()
	  SelectingText(false)
	  return
	endIf
	detectContext()
	sayWord()
ElIf (GetWindowClass (GlobalFocusWindow) == wc_WPPopOutWindow) Then
	PriorWord ()
	SayLine ()
else
	performScript sayPriorWord() ;default
endIf
EndScript

Script sayNextWord ()
if isPcCursor() && inDocumentWindow() then
	nextWord()
	if ((IsLeftButtonDown()) || (IsRightButtonDown())) then
	  SelectingText(TRUE)
	  pause ()
	  SelectingText(false)
	  return
	endIf
	detectContext()
	sayWord()
ElIf (GetWindowClass (GlobalFocusWindow) == wc_WPPopOutWindow) Then
	NextWord ()
	SayLine ()
else
	performScript sayNextWord() ;default
endIf
EndScript


Script JAWSHome ()
performScript JAWSHome() ; default
if isPcCursor() && inDocumentWindow() then
	detectContext()
endIf
EndScript


Script JAWSEnd ()
performScript JAWSEnd() ;default
if isPcCursor() && inDocumentWindow() then
	detectContext()
endIf
EndScript

Script JAWSPageUp ()
performScript JAWSPageUp() ;default
if isPcCursor() && inDocumentWindow() then
	detectContext()
endIf
EndScript

Script JAWSPageDown ()
performScript JAWSPageDown() ;default
if isPcCursor() && inDocumentWindow() then
	detectContext()
endIf
EndScript

Script TopOfFile ()
if isPcCursor() && inDocumentWindow() then
	JAWSTopOfFile()
	SayFormattedMessage (ot_JAWS_message, cmsg36_L, cmsg36_S) ;"top of file"
	detectContext()
	SayLine ()
Else
	performScript topOfFile() ; default
endIf
EndScript

Script bottomOfFile ()
if isPcCursor() && inDocumentWindow() then
	JAWSBottomOfFile ()
	SayFormattedMessage (ot_JAWS_message, cmsg37_L, cmsg37_S) ;"Bottom of file"
	detectContext()
	SayLine ()
Else
	performScript bottomOfFile() ; default
endIf
EndScript

Script tabKey ()
If UserBufferIsActive () Then
	PerformScript Tab()
	return
EndIf
sayCurrentScriptKeyLabel()
if QuickNavKeyTrapping() then
	if !inTable()
	|| IsLastCellInTable() then
		return
	EndIf
EndIf
tabKey()
if isPcCursor() && inDocumentWindow() then
	delay(3)
	detectContext()
	if globalInTableFlag  Then
		sayCellLineSegment()
	else
		sayIndentMeasure()
	endIf
endIf
EndScript

Script shiftTabKey ()
If UserBufferIsActive () Then
	PerformScript Tab()
	return
EndIf
sayCurrentScriptKeyLabel()
if QuickNavKeyTrapping() then
	if !inTable()
	|| IsFirstCellInTable() then
		return
	EndIf
EndIf
shiftTabKey()
if isPcCursor() && inDocumentWindow() then
	delay(3)
	detectContext()
	if globalInTableFlag  Then
		sayCellLineSegment()
	else
		sayIndentMeasure()
	endIf
endIf
EndScript

string Function getGroupBoxName ()
var
string gbName,
handle currentWindow,
handle null,
handle hwnd

let gbName=getGroupboxName() ; default
if gbName==cscNull then
; didn't get it, we'll search for it
	let currentWindow=getCurrentWindow()
	let hwnd=getFirstWindow(currentWindow)
	while hwnd
		if getWindowClass(hwnd)==sc_4
		&& getWindowText(hwnd,0)!=cscNull then
			let gbName=getWindowText(hwnd,0)
			let hwnd=null
		else
			let hwnd=getNextWindow(hwnd)
		endIf
	endWhile
endIf
return gbName
EndFunction

script sayWindowPromptAndText ()
var
	handle hWnd,
	int iSubType,
	int nMode
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
If UserBufferIsActive () then
	If ! iSubType then
		SayFormattedMessage (OT_NO_DISABLE, cmsgVirtualViewer)
		Return
	EndIf
EndIf
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
sayFocusedWindow()
SayTutorialHelp (iSubType, TRUE)
SayTutorialHelpHotKey (hWnd, TRUE)
IndicateComputerBraille (hwnd)
smmToggleTrainingMode(nMode)
EndScript

Void Function SayNonHighlightedText (handle hwnd, string buffer)
; NonHighlightedText  Function for speaking all newly written nonhighlighted
; text.
var
	string TheClass,
	int iRealNameLength,
	int iPrevRealNameLength
let TheClass = GetWindowClass(hwnd)
;Searches for the "Find & Replace" dialogue.
If StringContains (GetWindowName (HWnd), wnWP4) Then
	Return
endIf
if (GetScreenEcho() > ECHO_HIGHLIGHTED) ||
	(theClass==wc_static1 && getWindowTypeCode(getNextWindow(hwnd))!=wt_edit) ||
	theClass==wc_updateStatic180 then
	SayFormattedMessage (OT_NONHIGHLIGHTED_SCREEN_TEXT, buffer)
endIf
/*if ((TheClass == wc_dialog1) ||
	(theClass==wc_dialog2)) && getScreenEcho() > 0 then
	if !stringContains(buffer,scMenuBar1) Then
		say(buffer,ot_dialog_text)
	endIf
endIf */
;Checks to see if the spellchecker is active and the Not Found window contents has changed.
if StringContains (GetWindowName (GetAppMainWindow (GlobalFocusWindow)), WnWP1) &&
  (GetControlId (HWnd) == CId_NotFound_field) Then
;The following test only  activates if the word in context was not found.
;This occurs when the spellcheck dialogue hides the misspelled word which is highlighted by wp
	If StringIsBlank (FindWordInContext ()) Then
		PerformScript ReadMisspelledAndSuggestion()
	EndIf ;StringIsBlank (FindWordInContext ())
EndIf ;Spellchecker dialogue is active and Not Found window contents has changed.
; The focusChangedEvent function is not called when the Header, Footer and  FootNote
; windows are closed.  This is because they use the same window class as the
; main document area.  The following code reports if one of these windows closes.
If inDocumentWindow () Then
	; Obtain the length of the current and previous real window name.
	let iPrevRealNameLength = StringLength (GlobalPrevRealName)
	let iRealNameLength = StringLength (getWindowName (GetRealWindow (GlobalFocusWindow)))
	; If the two string lengths do not equal zero, then check to see if the contents of the
	; previous real window name contains Header, Footer, EndNote, FootNote in its name.
	If (iPrevRealNameLength - iRealNameLength) &&
	(StringContains (GlobalPrevRealName, WN_HeaderA) ||
	StringContains (GlobalPrevRealName, WN_HeaderB) ||
	StringContains (GlobalPrevRealName, WN_FooterA) ||
	StringContains (GlobalPrevRealName, WN_FooterA) ||
	StringContains (GlobalPrevRealName, WN_FootNote) ||
	StringContains (GlobalPrevRealName, WN_EndNote)) Then
		let GlobalPrevRealName = GetWindowName (GetRealWindow (GlobalFocusWindow))
		Say (GlobalPrevRealName, OT_NONHIGHLIGHTED_SCREEN_TEXT)
		SayFocusedWindow ()
		Return
	EndIf
EndIf
SayNonHighlightedText  (hWnd, Buffer)
EndFunction

Script ReadMisspelledAndSuggestion ()
; Sean Murphy's original code
;Updated: 14/08/2001 by Sean Murphy
var
	handle WinHandle,
	Handle AppWindow,
	Handle NotFoundField,
	Handle ReplaceField

If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
;Pause ()
let AppWindow = GetAppMainWindow (GlobalFocusWindow)
let WinHandle = FindDescendantWindow (AppWindow, Cid_DialoguePage)
if StringContains (GetWindowName (WinHandle), wnWP1) then
	let NotFoundfield = FindDescendantWindow (WinHandle, CId_NotFound_field)
	let ReplaceField = FindDescendantWindow (WinHandle, CId_ReplaceWith_field)
	SayUsingVoice (VCTX_MESSAGE, GetWindowText (FindDescendantWindow (WinHandle, CId_NotFound_Prompt), FALSE), OT_STATIC)
	SayUsingVoice (VCTX_MESSAGE, GetWindowText (NotFoundfield, FALSE), OT_STATIC)
	SpellString (GetWindowText (NotFoundfield, FALSE))
	SayUsingVoice (VCTX_MESSAGE, GetWindowText (FindDescendantWindow (WinHandle, CId_ReplaceWith_Prompt), FALSE), OT_STATIC)
	SayUsingVoice (VCTX_MESSAGE, GetWindowText (ReplaceField, FALSE), OT_STATIC)
SpellString (GetWindowText (ReplaceField, FALSE))
else
	SayFormattedMessage (ot_error, WPErrorMsg2_L) ; "you must be in the Spell Checker dialog to read misspelled word and suggestion"
endIf
PcCursor ()
EndScript

Script ReplaceMisspelledWord ()
var
	handle AppWindow, ;Aplication window handle
	Handle WinHandle, ;Window Handle
	int controlId ;control Id of the current window with focus.

If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
; check script
if QuickNavKeyTrapping() then
	If getJcfOption(opt_quick_key_navigation_mode)==2 then
		If giPriorQuickNavMode then
			SetJcfOption(opt_quick_key_navigation_mode,1)
			SetQuickKeyNavigationState(1)
			let giPriorQuickNavMode=0
			SayFormattedMessageWithVoice(vctx_message,ot_status,cmsgNavigationModeOn_l,cmsgNavigationModeOn_s)
			return
		else
			SetJcfOption(opt_quick_key_navigation_mode,0)
			SetQuickKeyNavigationState(0)
			let giPriorQuickNavMode=0
			return
		EndIf
	EndIf
	SetJcfOption(opt_quick_key_navigation_mode,0)
	SetQuickKeyNavigationState(0)
	SayFormattedMessageWithVoice(vctx_message,ot_status,cmsgNavigationModeOff_l,cmsgNavigationModeOff_s)
	return
EndIf
if GlobalPowerBar Then
	let GlobalPowerBar	= OFF
	PowerBar (GlobalPowerBar  )
	SayCurrentScriptKeyLabel ()
	TypeCurrentScriptKey ()
	Return
EndIf
let AppWindow = GetAppMainWindow (GlobalFocusWindow)
let WinHandle = FindDescendantWindow (AppWindow, CID_DialoguePage)
let ControlId = GetControlId (GetFocus ())
SayCurrentScriptKeyLabel()
SpeechOff ()
if StringContains (GetWindowName (WinHandle), wnWP1) then
	;We are in the spell checker.
	If (ControlId == CId_ReplaceWith_Field) ||
	(controlId == CId_replacements_list) Then
		SetFocus (FindDescendantWindow (WinHandle, cId_ReplaceButton))
	endIf ;We are on the Replace with field or the suggestion list.
endIf ;You are in a spell checker
delay (1)
EnterKey ()
SpeechOn ()
EndScript


String Function FindWordInContext ()
var
	handle WinHandle,
	Handle PriorWinHandle
let PriorWinHandle = GetFocus ()
let WinHandle = GetAppMainWindow (GetFocus ())
let WinHandle = FindDescendantWindow (WinHandle, CID_DocumentWindow)
SaveCursor ()
InvisibleCursor ()
if moveToWindow (WinHandle) Then
	PriorCharacter () ; to include the case when the misspelled word is the first one on the window
	if (FindNextAttribute (attrib_highlight) &&
		(GetWindowClass (GetCurrentWindow ()) == wc_MainDocumentWindow)) then
		SayFormattedMessage (ot_error, WPErrorMsg3_L) ; "Word in context:"
	Return GetLine ()
	else
		PCCursor ()
		SayFormattedMessage (ot_error, WPErrorMsg4_L) ; "highlighted word not found"
	endIf
else
	SayFormattedMessage (ot_error, WPErrorMsg5_L) ; "main document window not found "
endIf
RestoreCursor ()
PcCursor ()
Return CSCNULL
EndFunction

Script  ReadWordInContext()
Var
	String SWordInContext ;Stores the line that contains the word in context.
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if inDocumentWindow() && inTable() then
	sayCellCoordinates()
	return
endIf
Let SWordInContext = FindWordInContext ()
If !StringIsBlank (SWordInContext) Then
	SayFormattedMessage (ot_JAWS_message, SWordInContext)
EndIf
EndScript

Void Function SayFindPrompt ()
Var
	Handle Hwnd,
	Handle RealWin

let RealWin = GetRealWindow (GlobalFocusWindow) ;Handle of real window.
;Handle of the edit prompt static text.
let Hwnd = FindDescendantWindow (RealWin, CId_Find_Prompt)
If (GetControlId (GetParent (GlobalFocusWindow)) == CId_EditfindPrompt) Then
	SayWindow (Hwnd, Read_Everything)
endIf
Return
EndFunction

Script sayCursorPosition ()
Var
	Handle WinHandle,
	string sWPHelpText_l
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
let WinHandle =FindDescendantWindow (getAppMainWindow(globalFocusWindow), cId_statusBar)
if winHandle then
	SaveCursor ()
	InvisibleCursor ()
	moveToWindow(winHandle)
	FindString (GetCurrentWindow (), scWPPageNo, s_top, s_restricted)
	sayFromCursor()
	restoreCursor()
else
	SayFormattedMessage (ot_error, WPErrorMsg1_L)
endIf
EndScript

Script sayCursorPosInTable ()
Var
	string sWPHelpText_l
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if inTable() then
	Let sWPHelpText_l = formatString(WPHelpMsg7_L, getTableCellCoordinates(), getTableName())
	SayFormattedMessage (ot_JAWS_message, sWPHelpText_l)
else
	SayFormattedMessage (ot_error, msgNotInATable1_L)
endIf
EndScript

handle Function GetRealWindow (handle hWindow)
var
	handle hWnd

let hWnd = FindDescendantWindow (GetAppMainWindow (GetFocus ()), CId_DialoguePage)
If hWnd && StringContains (GetWindowName (hWnd), wnWP3) Then
; Prevent over chatter in the Thesaurus dialogue.
	return 0
Else
	return GetRealWindow (hWindow)
EndIf
EndFunction

handle Function getLastWindow (handle startWindow)
var
handle tmp,
handle lastWindow

let tmp=startWindow
while tmp
	let lastWindow=tmp
	let tmp=getNextWindow(tmp)
endWhile
return lastWindow
EndFunction

handle Function getLastStatic (handle startWindow)
var
handle tmp,
handle lastStatic
let tmp=getLastWindow(startWindow)
while tmp
	if getWindowClass(tmp)==wc_static then
		let lastStatic=tmp
	endIf
	let tmp=getPriorWindow(tmp)
endWhile
return lastStatic
EndFunction

Function sayEditWithButtonControl ()
var
handle hFocus,
handle hParent,
handle hParentPrev,
handle hParentNext,
int iParentNextType

let hFocus=getFocus()
let hParent=getParent(hFocus)
let hParentNext=getNextWindow(hParent)
let hParentPrev=getPriorWindow(hParent)
let iParentNextType=getWindowTypeCode(hParentNext)
; if the focus is an edit which has a button associated with it then speak its prompt, type, contents and help message.
if getWindowTypeCode(hFocus)==wt_edit && getWindowClass(hParent)==wc_buttonEdit then
	if getWindowTypeCode(hParentPrev)==wt_static then
		SayFormattedMessage(ot_control_name,getWindowName(hParentPrev))
	endIf
	say(getWindowType(hFocus),ot_control_type) ; announce the type
	sayWindow(hFocus,read_everything) ; read the contents
	SayFormattedMessage(ot_smart_help, msgToActivateTheButton1_L, msgToActivateTheButton1_S)
endIf
EndFunction

Void Function SayHighlightedText (handle hwnd, string buffer)
; next test stops double speaking when moving by char when reveal codes is active.
if suppressEcho then
	let suppressEcho=false
	return
endIf
; prevent duplicated text being spoken in the Last Modify control within any dialogue that perform file actions.
; I.E.  The Open Dialogue, Save as dialogue, etc.
; The code is only called when focus is on the Last Modify ComboBox control.
;if SubpressLastModifyCombo then
If (GetControlId (GetParent (GlobalFocusWindow)) == cid_LastModifiedComboBox) &&
(IsWindowVisible (GetFirstWindow(GetForeGroundWindow ()))) Then
	If (GlobalFocusWindow == Hwnd) Then
	; The highlight is drawn twice.
	; First time is for the edit control
	; The second time for the combo_l_box control.
	; We are preventing the Edit control from speaking the highlight, because it is truncated.
		return
	EndIf
	let SubpressLastModifyCombo=false
	; The text is being extracted from control.
	; This control is at the same level as the application window handle.
	; It is the first window of that level and the text is contained in a child window.
	SayFormattedMessage (OT_HIGHLIGHTED_SCREEN_TEXT, GetWindowText (GetFirstWindow(GetForeGroundWindow ()), TRUE))
	return
	endIf

if (GetWindowSubtypeCode (GlobalFocusWindow)== WT_COMBOBOX) ||
(GetWindowSubtypeCode (GlobalFocusWindow)==	WT_EDITCOMBO) Then
	;If (GetWindowSubtypeCode (hWnd)== 	WT_LISTBOX) Then
	if (GlobalFocusWindow != hWnd) &&
	(! IsWindowVisible (GetFirstWindow(GetForeGroundWindow ()))) Then
	; Prevents the highlighted text in the list box being spoken, when the combo box
	; or an Edit ComboBox control value has changed.
	; E.G.  New Project or the Bullet and Number/create dialogue.
	; Don't read the highlighted text in the list box control
	Return
	EndIf
EndIf

;checks to see if a word in the document window is highlighted.
If (GetControlId (hwnd)==CId_DocumentWindow) then
; a highlighted word has been written to the document window
;Now check to see if the spellchecker, Gramma Checker, Thesaurus or  dictionary are active.
	if StringContains (GetWindowName (FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CID_dialoguePage)), wnWP1)  Then
; The spell checker dialogue is active.
	;A misspelled word was found, execute readMisspelledAndSuggestion script.
		PerformScript ReadMisSpelledAndSuggestion ()
	Return
	elIf StringContains (GetWindowName (FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CID_dialoguePage)), wnWP2)  Then
	;The gramma checker is active, we dont' want the highlighted word in the document spoken.
		Return
	elIf StringContains (GetWindowName (FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CID_dialoguePage)), wnWP3)  Then
	;The Thesaurus is active, we dont' want the highlighted word in the document spoken.
		Return
	elIf StringContains (GetWindowName (FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CID_dialoguePage)), wnWP21)	Then
	;The Dictionary is active, we dont' want the highlighted word in the document spoken.
		Return
	EndIf
endIf ;GetControlId (hwnd) == cID_DocumentWindow
;Prevents unnecessary chatter in the spellchecker.
If StringContains (GetWindowName (FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CID_dialoguePage)), wnWP1)  Then
	If (MenusActive () == ACTIVE) Then
		SayFormattedMessage (OT_HIGHLIGHTED_SCREEN_TEXT, buffer)
		Return
	EndIf
	If (GetWindowSubTypeCode (GlobalFocusWindow) != wt_listbox)
	&& (GetWindowSubTypeCode (GlobalFocusWindow) != WT_COMBOBOX) Then
		Return
	EndIf
EndIf
If StringContains (GetWindowName (FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CID_dialoguePage)), wnWP21)  Then
	If (MenusActive () == ACTIVE) Then
		SayFormattedMessage (OT_HIGHLIGHTED_SCREEN_TEXT, buffer)
		Return
	EndIf
	If (GetWindowSubTypeCode (GlobalFocusWindow) != wt_listbox)
	|| (GetWindowSubTypeCode (GlobalFocusWindow) != WT_COMBOBOX) Then
		Return
	EndIf
EndIf
If StringContains (GetWindowName (FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CID_dialoguePage)), wnWP2)  Then
	If (MenusActive () == ACTIVE) Then
		SayFormattedMessage (OT_HIGHLIGHTED_SCREEN_TEXT, buffer)
		Return
	EndIf
	If (GetWindowSubTypeCode (GlobalFocusWindow) != wt_listbox)
	|| (GetWindowSubTypeCode (GlobalFocusWindow) != WT_COMBOBOX) Then
		Return
	EndIf
EndIf
SayHighlightedText (hWnd, buffer)
EndFunction

Script toggleRevealCodes ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
typeCurrentScriptKey()
pause()
if inDocumentWindow() then
	if isRevealCodesActive() then
		SayFormattedMessage (ot_JAWS_message, msgRevealCodesOn1_L, msgRevealCodesOn1_S)
	else
		SayFormattedMessage (ot_JAWS_message, msgRevealCodesOff1_L, msgRevealCodesOff1_S)
	endIf
EndIf
EndScript

Script spellchecker ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgSpellchecker1_L)
typeCurrentScriptKey()
EndScript


Script thesaurus ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgThesaurus1_L)
typeCurrentScriptKey()
EndScript

Script draft ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgDraft1_L)
typeCurrentScriptKey()
EndScript


Script showRuler ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
typeCurrentScriptKey()
pause()
if inDocumentWindow() then
	if isRulerBarActive() then
		SayFormattedMessage (ot_JAWS_message, msgRulerVisible1_L, msgRulerVisible1_S)
	else
		SayFormattedMessage (ot_JAWS_message, msgRulerNotVisible1_L, msgRulerNotVisible1_S)
	endIf
EndIf
EndScript

Script hideBars ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgHideBars1_L)
typeCurrentScriptKey()
EndScript

Script pageView ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgPage1_L)
typeCurrentScriptKey()
EndScript

Script editGraphicBox ()
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgEditGraphicBox1_L)
typeCurrentScriptKey()
EndScript


Script showCodes ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgShow1_L)
typeCurrentScriptKey()
EndScript

Script toggleBlockMode ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
typeCurrentScriptKey()
pause()
if inDocumentWindow() then
	if isBlockModeActive() then
		SayFormattedMessage (ot_JAWS_message, msgBlockOn1_L, msgBlockOn1_S)
	else
		SayFormattedMessage (ot_JAWS_message, msgBlockOff1_L, msgBlockOff1_S)
	endIf
EndIf
EndScript

Script styles ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgStyle1_L)
typeCurrentScriptKey()
EndScript

Script playMacro ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgPlayMacro1_L)
typeCurrentScriptKey()
EndScript

Script recordMacro ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgRecordMacro1_L)
typeCurrentScriptKey()
EndScript

Script sort ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgSort1_L)
typeCurrentScriptKey()
EndScript

Script merge ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgMerge1_L)
typeCurrentScriptKey()
EndScript

Script WPSettings ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgSettings1_L)
typeCurrentScriptKey()
EndScript

Script vbEditor ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgVBEditor1_L)
typeCurrentScriptKey()
EndScript

Script grammatik ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgGrammatik1_L)
typeCurrentScriptKey()
EndScript

Script ScreenSensitiveHelp ()
var
	String TheClass,
int NumberOfTextColumns,
int currentTextColumnNumber,
string sWPHelpText_l, ;Long version of wordPerfect help text
string sWPHelpText_s ;Short version of wordPerfect help text

let TheClass = GetWindowClass (GetCurrentWindow ())
if (IsSameScript ()) then
	AppFileTopic(topic_WordPerfect)
	return
endIf
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
; if focus is lost, next test will attempt to focus on the document window
if not GetFocus() then
; focus was lost
	resetFocusToGlobalFocus()
	pause()
endIf
;The next if test checks to see if the current window class belongs to the wp document window and
; that the menu bar is not active.
If isPcCursor() && inDocumentWindow() then
	if isDocumentReadOnly() then
		Let sWPHelpText_L = WPHelpMsg2_L
	else
		Let sWPHelpText_L = WPHelpMsg1_L
	endIf
	if inTable() then
		Let sWPHelpText_l = sWPHelpText_L + "\r\n" + formatString(WPHelpMsg7_L, getTableCellCoordinates(), getTableName())
		Let sWPHelpText_s = sWPHelpText_s + "\r\n" + formatString(WPHelpMsg7_S, getTableCellCoordinates(), getTableName())
	endIf
	if isBlockModeActive() then
		Let sWPHelpText_l = sWPHelpText_L + "\r\n" +WPHelpMsg6_l
	endIf
	if isRevealCodesActive() then
		Let sWPHelpText_L = sWPHelpText_L + "\r\n" + WPHelpMsg5_L
	endIf
	if isTypeOverActive() then
		Let sWPHelpText_L = sWPHelpText_L + "\r\n" + WPHelpMsg3_L
	else
		Let sWPHelpText_L = sWPHelpText_L + "\r\n" + WPHelpMsg4_L
	endIf
	let numberOfTextColumns=getTextColumnCount ()
	let currentTextColumnNumber=getCurrentTextColumnIndex ()
	if numberOfTextColumns > 1 then
; Doc contains multiple columns, announce this.
		Let sWPHelpText_L = sWPHelpText_L + "\r\n" + formatString(WPHelpMsg8_L, intToString(numberOfTextColumns), intToString(currentTextColumnNumber))
		Let sWPHelpText_s = sWPHelpText_s + "\r\n" + formatString(WPHelpMsg8_S, intToString(numberOfTextColumns), intToString(currentTextColumnNumber))
	endIf
	SayFormattedMessage (OT_USER_BUFFER, sWPHelpText_L, sWPHelpText_S)
	UserBufferAddText(cscBufferNewline+cmsgBuffExit)
	Return
elif getWindowTypeCode(getCurrentWindow())==wt_edit && getWindowClass(getParent(getCurrentWindow()))==wc_spinEdit then
	screenSensitiveHelpForKnownClasses(wt_spinbox)
elif theClass==wc_outlineArray then
	SayFormattedMessage(ot_USER_BUFFER,WPHelpMsg11_L, WPHelpMsg11_S)
Elif TheClass==wc_bitmapButton then
	SayFormattedMessage(ot_User_Buffer, PRMsgBitmapBtnHelp1_L, PRMsgBitmapBtnHelp1_S)
elIf (TheClass == wc_PR_ArrayClass) || (TheClass == wc_GLB) Then
	SayFormattedMessage(ot_User_Buffer, PRMsgGLBHelp1_L, PRMsgGLBHelp1_S)
else
	performScript ScreenSensitiveHelp ()
	if getWindowTypeCode(globalFocusWindow)==wt_edit && getWindowClass(getParent(globalFocusWindow))==wc_buttonEdit then
		SayFormattedMessage(ot_USER_BUFFER, WPHelpMsg9_L, WPHelpMsg9_S)
	endIf
	if getWindowTypeCode(globalFocusWindow)==wt_edit && getWindowClass(getParent(globalFocusWindow))==wc_dateEdit then
		SayFormattedMessage(ot_USER_BUFFER, WPHelpMsg10_L, WPHelpMsg10_S)
	endIf
endIf
EndScript

Script  WindowKeysHelp()
	If UserBufferIsActive () then
		UserBufferDeactivate ()
		SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
		Return
	EndIf
	if inDocumentWindow() then
		SayFormattedMessage (ot_USER_BUFFER, msgWinKeysHelp1_L, msgWinKeysHelp1_S)
		UserBufferAddText(cscBufferNewline+cmsgBuffExit)
		return
	endIf
	WindowKeysHelpDefault ()
EndScript

Script  HotKeyHelp()
var
	handle WinHandle,
	String TheClass,
	int IControlID,
	string sHotkeyHelp1_L
if TouchNavigationHotKeys() then
	return
endIf
let IControlID = GetControlID (GetCurrentWindow ())
let WinHandle = GetFocus ()
let TheClass = GetWindowClass (WinHandle)
If UserBufferIsActive () then
	UserBufferDeactivate ()
	SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if inDocumentWindow() then
	SayFormattedMessage (ot_USER_BUFFER, msgHotkeyHelp1_L, msgHotkeyHelp1_S)
	UserBufferAddText(cscBufferNewline+cmsgBuffExit)
	return
endIf
if StringContains (GetWindowName (FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CID_dialoguePage)), wnWP1) then
	SayFormattedMessage (ot_USER_BUFFER, msgHotkeyHelp2_L, msgHotkeyHelp2_S)
	return
elif StringContains (GetWindowName (GetRealWindow(globalFocusWindow)), wnWP4) then
; find and replace dialog
	SayFormattedMessage (ot_USER_BUFFER, msgHotkeyHelp3_L, msgHotkeyHelp3_S)
	return
endIf
EndScript

Void Function resetFocusToGlobalFocus ()
if getWindowClass(getFocus())==wc_WPClient then
	setFocus(globalPrevFocus)
else
	setFocus(globalFocusWindow)
endIf
EndFunction

Script refreshScreen ()
performScript refreshScreen() ; default
if not GetFocus() || getWindowClass(getFocus())==wc_WpClient then
; focus is in la la land
	resetFocusToGlobalFocus()
endIf
if InDocumentWindow () Then
	let GlobalPowerBar	= OFF
	PowerBar (GlobalPowerBar  )
EndIf
EndScript

Script JAWSCursor ()
; reset for JAWS or invisible cursor
; so Braille gets updated. only want coordinates if PcCursor is active
let globalInTableFlag=false
performScript JAWSCursor() ; default
EndScript

Script closeApplication ()
SayFormattedMessage (ot_JAWS_message, msgCloseWP1_L)
typeCurrentScriptKey()
EndScript


Script priorWindowPane ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgPriorWindowPane1_L)
typeCurrentScriptKey()
EndScript


Script priorDocument ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgPriorDocument1_L)
typeCurrentScriptKey()
EndScript

Script nextDocument ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgNextDocument1_L)
typeCurrentScriptKey()
EndScript


Script priorWindow ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgPriorWindow1_L)
typeCurrentScriptKey()
EndScript

Script nextWindow ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgNextWindow1_L)
typeCurrentScriptKey()
EndScript

Function sayIndentMeasure ()
Var
	Handle WinHandle
let WinHandle =FindDescendantWindow (getAppMainWindow(globalFocusWindow), cId_statusBar)
if winHandle then
	SaveCursor ()
	InvisibleCursor ()
	moveToWindow(winHandle)
	FindString (GetCurrentWindow (), scWPPos, s_top, s_restricted)
	nextWord()
	sayFromCursor()
	restoreCursor()
else
	SayFormattedMessage (ot_error, WPErrorMsg1_L)
endIf
EndFunction

Script indent ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgIndent1_L)
typeCurrentScriptKey()
sayIndentMeasure()
EndScript

Script hangingIndent ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgHangingIndent1_L)
typeCurrentScriptKey()
sayIndentMeasure()
EndScript

Script doubleIndent ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgDoubleIndent1_L)
typeCurrentScriptKey()
sayIndentMeasure()
EndScript

Script SayAll ()
let giPriorQuickNavMode=GetJCFOption(opt_quick_key_navigation_Mode)
setJCFOption(opt_quick_key_navigation_Mode,2) ; on by default
PerformScript SayAll()
SetQuickKeyNavigationState(1)
EndScript

Void Function SayQuickKeyNavigationNotAvailable()
If !SayAllInProgress()
&& !IsVirtualPCCursor() then
	SayQuickKeyNavigationNotAvailable() ; default
	return
EndIf
QuickNavSayAllRestart()
SayAll()
EndFunction

Script deleteWordAtCursor ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, WPMsg13_L) ; delete word
typeCurrentScriptKey()
pause()
sayCurrentWord()
 EndScript

Script deleteToEndOfLine ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, WPMsg14_L) ; delete to end of line
typeCurrentScriptKey()
Pause()
sayLine()
EndScript

string function togglePageAndColumnBreakDetection (int iRetCurVal)
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if not iRetCurVal then
	;update the value
	if globalDetectPageAndColumnBreaks then
		let globalDetectPageAndColumnBreaks=false
		let globalMultipleColumns=false
	else
		let globalDetectPageAndColumnBreaks=true
	endIf
EndIf
if globalDetectPageAndColumnBreaks then
	return msgDetectBreaksOn1_S
else
	return msgDetectBreaksOff1_S
endIf
EndFunction

Script insertPageBreak ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
typeCurrentScriptKey()
if inDocumentWindow() then
	SayFormattedMessage (ot_JAWS_message, msgPageBreak1_L)
	detectContext()
endIf
EndScript

Script priorPage ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
typeCurrentScriptKey()
if isPcCursor() && inDocumentWindow() then
	detectContext()
	sayLine()
endIf
EndScript


Script nextPage ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
typeCurrentScriptKey()
if isPcCursor() && inDocumentWindow() then
	detectContext()
	sayLine()
endIf
EndScript

Script ImportRegistrySettings ()
; by Ben Key.
; mod by JKS to use new dlg
Var
	String strRegFileName,
	Int iResult
let iResult=exMessageBox (msgImportRegPrompt1_L, msgImportRegKeyTitle1_L,mb_yesNo|MB_DEFBUTTON1)

if iResult==IDNo then
	return
endIf
; must be IDYes
let strRegFileName = FindJAWSSettingsFile(strRegFile) ;"Corel20Opt.reg"
Run ("regedit /s \""+strRegFileName +"\"")
SayFormattedMessage (ot_JAWS_message, msgImportSuccessful1_L)
EndScript

Script SayCell ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if inDocumentWindow() && IsPcCursor () then
	SayCell()
	sayCellCoordinates()
EndIf
EndScript


Script NextCell()
if inDocumentWindow() && isPcCursor () then
	if NextCell() then
		SayCell()
		sayCellCoordinates()
	else
	SayFormattedMessage (ot_error, msgNotInATable1_L)
	endIf
EndIf
EndScript

Script PriorCell()
if inDocumentWindow() && isPcCursor () then
	if PriorCell() then
		SayCell()
		sayCellCoordinates()
	else
		SayFormattedMessage (ot_error, msgNotInATable1_L)
	endIf
EndIf
EndScript




script UpCell()
if inDocumentWindow() && isPcCursor () then
	if UpCell() then
		SayCell()
		sayCellCoordinates()
	else
		SayFormattedMessage (ot_error, msgNotInATable1_L)
	endIf
EndIf
EndScript

script DownCell()
if inDocumentWindow() && isPcCursor () then
	if DownCell() then
		SayCell()
		sayCellCoordinates()
	else
		SayFormattedMessage (ot_error, msgNotInATable1_L)
	endIf
EndIf
EndScript

Script BrailleRouting ()
var
	int nCell
if BrailleIsMessageBeingShown() then
	brailleClearMessage()
	return
endIf
let nCell = GetLastBrailleRoutingKey ()
if gbBrailleStudyModeActive then
	SALModeButton(nCell,sal_SayCharacter)
	return
EndIf
BrailleRoutingButton(nCell)
if IsJAWSCursor () then
	LeftMouseButton()
endIf
if InDocumentWindow () then
	delay(1)
	if isPCCursor() || isJAWSCursor() then
		detectContext()
	endIf
endIf
EndScript


int Function saveApplicationSettings ()
var
int iResult
let iResult=iniWriteInteger(Section_applicationVerbositySettings,hKey_pageAndColumnBreakDetection,globalDetectPageAndColumnBreaks,jsiFileName)
iniWriteInteger(Section_ApplicationVerbositySettings,hKey_detectTables,globalDetectTables,jsiFileName)
iniWriteInteger(Section_ApplicationVerbositySettings,hKey_detectStyleChanges,globalDetectStyleChanges,jsiFileName)
iniWriteInteger(Section_ApplicationVerbositySettings,hKey_detectBorders,globalDetectBorders,jsiFileName)
iniWriteInteger(Section_ApplicationVerbositySettings,hKey_detectLanguages,globalDetectLanguages,jsiFileName)
return iResult
EndFunction


Function loadApplicationSettings ()
initializeApplicationGlobals()
let globalDetectPageAndColumnBreaks=iniReadInteger(Section_applicationVerbositySettings,hKey_pageAndColumnBreakDetection,globalDetectPageAndColumnBreaks,jsiFileName)
let globalDetectTables=iniReadInteger(Section_ApplicationVerbositySettings,hKey_detectTables,globalDetectTables,jsiFileName)
let globalDetectStyleChanges=iniReadInteger(Section_ApplicationVerbositySettings,hKey_detectStyleChanges,globalDetectStyleChanges,jsiFileName)
let globalDetectBorders=iniReadInteger(Section_ApplicationVerbositySettings,hKey_detectBorders,globalDetectBorders,jsiFileName)
let globalDetectLanguages=iniReadInteger(Section_ApplicationVerbositySettings,hKey_detectLanguages,globalDetectLanguages,jsiFileName)
EndFunction


Script changeCase ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage(ot_JAWS_message,WPMsgChangeCase1_L, cmsgSilent)
typecurrentScriptKey()
pause()
spellWord()
EndScript


Function sayWPOutlineArraySelection ()
if getWindowClass(getCurrentWindow())==wc_outlineArray && getWindowTypeCode(getPriorWindow(getPriorWindow(getCurrentWindow())))==wt_static then
	sayWindow(getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(getCurrentWindow())))),read_everything)
endIf
EndFunction

Script OpenListBox ()
var
handle hFocus,
int iParentSubtype

let hFocus=getFocus()
let iParentSubtype=getWindowSubtypeCode(getParent(hFocus))
if isPCCursor() && getWindowSubtypeCode(hFocus)==wt_edit &&
	(iParentSubtype==wt_combobox || iParentSubtype==wt_editCombo) then
SayFormattedMessage (ot_JAWS_message, cmsg41_L, cmsgSilent) ;open list box
TypeKey (ks2)
else
	performScript openListbox()
endIf
EndScript

Script Dictionary ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgDictionary1_L)
typeCurrentScriptKey()
EndScript


Script IncreaseTableColumn ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, WPMsgIncreaseTableColumn_l)
typeCurrentScriptKey()
if inDocumentWindow() && isPcCursor () then
		SayFormattedMessage (ot_JAWS_message, FormatString (WPMsgTo, GetCellWidth ()))
EndIf
EndScript

Script DecreaseTableColumn ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, WPMsgDecreaseTableColumn_l)
typeCurrentScriptKey()
if inDocumentWindow() && isPcCursor () then
		SayFormattedMessage (ot_JAWS_message, FormatString (WPMsgTo, GetCellWidth ()))
EndIf
EndScript


Script SelectNextParagraph ()
Let nSaySelectAfter = TRUE
SelectingText(TRUE)
TypeCurrentScriptKey ()
SelectingText(FALSE)
Let nSaySelectAfter = FALSE
EndScript

Script SelectPriorParagraph ()
Let nSaySelectAfter = TRUE
SelectingText(TRUE)
TypeCurrentScriptKey ()
SelectingText(FALSE)
Let nSaySelectAfter = FALSE
EndScript

Script SelectPriorPage ()
Let nSaySelectAfter = TRUE
SelectingText(TRUE)
TypeCurrentScriptKey ()
SelectingText(FALSE)
Let nSaySelectAfter = FALSE
EndScript

Script SelectNextPage ()
Let nSaySelectAfter = TRUE
SelectingText(TRUE)
TypeCurrentScriptKey ()
SelectingText(FALSE)
Let nSaySelectAfter = FALSE
EndScript

Script SelectEndOfColumn ()
Let nSaySelectAfter = TRUE
SelectingText(TRUE)
TypeCurrentScriptKey ()
SelectingText(FALSE)
Let nSaySelectAfter = FALSE
EndScript


Script SelectBeginningOfColumn ()
Let nSaySelectAfter = TRUE
SelectingText(TRUE)
TypeCurrentScriptKey ()
SelectingText(FALSE)
Let nSaySelectAfter = FALSE
EndScript

Script SelectPriorColumn ()
If IsPCCursor () && inDocumentWindow () Then
	Let nSaySelectAfter = TRUE
	SelectingText(TRUE)
	TypeCurrentScriptKey ()
	SelectingText(FALSE)
	Let nSaySelectAfter = FALSE
Else
	PerformScript MouseLeft()
EndIf
EndScript

Script SelectNextColumn ()
If IsPCCursor () && inDocumentWindow () Then
	Let nSaySelectAfter = TRUE
	SelectingText(TRUE)
	TypeCurrentScriptKey ()
	SelectingText(FALSE)
	Let nSaySelectAfter = FALSE
Else
	PerformScript MouseRight ()
EndIf
EndScript

Script EndOfColumn ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgEndOfColumn_L)
TypeCurrentScriptKey ()

if isPcCursor() && inDocumentWindow() then
	pause()
	detectContext()
;	if inTable() then
If globalInTableFlag  Then
		sayCellLineSegment()
elif globalMultipleColumns then
	sayColumnLineSegment()
else
		sayWord()
	endIf
EndIf
EndScript

Script BeginningOfColumn ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgBeginningEndOfColumn_L)
TypeCurrentScriptKey ()
if isPcCursor() && inDocumentWindow() then
	pause()
	detectContext()
;	if inTable() then
If globalInTableFlag  Then
		sayCellLineSegment()
elif globalMultipleColumns then
	sayColumnLineSegment()
else
		sayWord()
	endIf
EndIf


EndScript


Script WPSave ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage (ot_JAWS_message, msgSave_L)
TypeCurrentScriptKey ()
EndScript


Script Redo ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
TypeCurrentScriptKey ()
SayFormattedMessage (ot_JAWS_message, msgRedo_L)
EndScript


Script PasteSpecial ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, MsgPasteSpecial_L)
TypeCurrentScriptKey ()
EndScript

Script LineHorizontal ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, MsgLineHorizontal_L)
TypeCurrentScriptKey ()
EndScript


Script LineVertical  ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, MsgLineVertical_L)
TypeCurrentScriptKey ()
EndScript

Script FormatTable ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, MsgFormatTable_L)
TypeCurrentScriptKey ()
EndScript


Script TableBorderFill ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, MsgTableFillBorder_L)
TypeCurrentScriptKey ()
EndScript

Script TableQuickFill ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, MsgTableQuickFill_L)
TypeCurrentScriptKey ()
EndScript

Script ReferenceGenerate ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, MsgReferenceGenerate_L)
TypeCurrentScriptKey ()
EndScript


Script WhatThis ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf

SayFormattedMessage (ot_JAWS_message, MsgWhatThis_L)
TypeCurrentScriptKey ()
EndScript

Script FindPreviousOccurrence ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf

SayFormattedMessage (ot_JAWS_message, MsgFindNext_L)
TypeCurrentScriptKey ()
EndScript

Script FindNextOccurrence ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf

SayFormattedMessage (ot_JAWS_message, MsgFindNext_L)
TypeCurrentScriptKey ()
EndScript


Script DeleteToEndOfPage ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, MsgDeleteToEndOfPage_L)
TypeCurrentScriptKey ()
Pause ()
SayLine ()
EndScript

Script FindPrevious ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf

SayFormattedMessage (ot_JAWS_message, MsgFindPreviousText_L)
TypeCurrentScriptKey ()
EndScript

Script TabHardDecimal ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, MsgTabHardDecimal_L)
TypeCurrentScriptKey ()
EndScript


Script CalculateDocument ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
if QuickNavKeyTrapping() then
	return
EndIf
SayFormattedMessage (ot_JAWS_message, MsgCalculateDocument_L)
TypeCurrentScriptKey ()
EndScript

void Function SayTreeViewLevel ()
var
	string sMessage,
	int iLevel,
	string sLevel
If (GetTreeViewLevel() != PreviousTreeviewLevel) then
	let iLevel = GetTreeviewLevel()
	let sLevel = IntToString (iLevel)
	let sMessage = FormatString (cmsg233_L, sLevel)
	SayFormattedMessage (OT_POSITION, sMessage, sLevel) ; "level "
	let PreviousTreeViewLevel= iLevel
endIf

If ! IsPcCursor () then
	SayLine ()
	Return
EndIf
If StringContains (GetWindowName (FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), CID_dialoguePage)), wnWP3)  Then
	; focus is on the tree view and the default method of anouncing the treeview contents
	; says "....".  This fixes this problem.
	SayFormattedMessage (OT_LINE, GetWindowText (GlobalFocusWindow, TRUE))
else
	SayFormattedMessage (OT_LINE, GetObjectValue ())
EndIf
SayFormattedMessage (OT_POSITION, PositionInGroup ())
EndFunction

Script UpALevel()
;if GlobalPowerBar && InDocumentWindow () Then
if GlobalPowerBar Then
	Let GlobalPowerBar = OFF
	PowerBar (GlobalPowerBar)
EndIf
if UserBufferIsActive() then
	UserBufferDeactivate()
	If QuickNavKeyTrapping()
	&& inDocumentWindow () then
		SetQuickKeyNavigationState(1)
	EndIf
	if inDocumentWindow() then
		sayWindowPromptAndText()
	endif
	; don't want to pass the Esc key on to the app.
	return
endIf
PerformScript UpALevel()
EndScript

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
Var
	String sRealWindowName
If giIgnoreActiveItemChange Then
	Let giIgnoreActiveItemChange = 0
	Return
EndIf
Let sRealWindowName = GetWindowName (GetRealWindow (curHwnd))
If GetWindowClass (curHwnd) == wc_wplb
&& (sRealWindowName == wn_Toolbars
|| sRealWindowName == wn_ProgramBarProperties) Then
	Let giIgnoreActiveItemChange = TRUE
	return
EndIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	int BStopProcessing
let bStopProcessing = PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
if !bStopProcessing
	if QuickNavKeyTrapping() then
		if QuickNavKeyTrapKey(nKey,strKeyName,nIsScriptKey) then
			return true
		EndIf
	EndIf
EndIf
return bStopProcessing
EndFunction

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	handle hFocus,
	int iObjType
if KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	Let hFocus = GetFocus ()
	Let iObjType = GetWindowSubtypeCode (hFocus)
	If !iObjType then
		Let iObjType = GetObjectSubtypeCode ()
	EndIf
	If iObjType == WT_EXTENDEDSELECT_LISTBOX Then
		Delay (2)
		DoStateForGraphics ();Handle custom check boxes.
		return true
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

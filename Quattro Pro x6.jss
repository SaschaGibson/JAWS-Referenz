; Copyright 1995-2020 Freedom Scientific, Inc. 
;JAWS 8.00.xx
; QuattroPro 16.0 Script File for JAWS 4.0

include"HjHelp.jsh"
include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "qpw160.jsh"
include "qpw.jsm"
	use "QpwFunc.jsb"

void function autoStartEvent()
;SetJCFOption (OPT_MSAA_MODE, 1)
if QPHasRunBefore==false then
SayFormattedMessage(OT_APP_START, msgAppStart1_L, msgAppStart1_S)
	let QPHasRunBefore=true
endIf
loadApplicationSettings()
loadDocumentSettings()
loadMonitorCells()
endFunction

Function initializeApplicationSettings ()
let globalCellReadingVerbosity=0 ; default, read coordinates and content
let globalDetectCellBorderChange=false
let globalDetectCellNumberFormatChange=false
EndFunction

Function initializeDocumentSettings ()
; set up default title column and row
let globalTitleRow=1
let globalTitleCol=1
let globalTitleReading=readNoTitles
; totals
let globalTotalColumn=0
let globalTotalRow=0
let globalRowTotalAutoFind=true ; true if JFW finds the row total, false if specified by user
let globalColumnTotalAutoFind=true ; true if JFW finds the column total automatically or false if manually set by user
EndFunction

Script  ScriptFileName()
;announces the name of the application and currently executing scriptfile.
ScriptAndAppNames (msg1)
EndScript

Script saySelectedText ()
let nSelectingText = TRUE
saySelectedText()
Delay (3)
Let nSelectingText = FALSE
EndScript

Script sayFont ()
sayFont()
EndScript

Script describeCellBorder ()
describeCellBorder()
EndScript

Script sayFormula ()
sayFormula()
EndScript

int Function inSpreadsheet ()
var
string theClass

let theClass=getWindowClass(getCurrentWindow())
return isPCCursor() && getCurrentControlId()!=0 && (theClass==wc_QuattroProChildWnd) && not inWritingTools () && (not UserBufferIsActive ())
EndFunction

Int Function inWritingTools ()
var
handle winHandle,
int iReturnValue

let WinHandle = FindDescendantWindow (getRealWindow(getFocus()), Cid_DialoguePage)
if StringContains (GetWindowName (getRealWindow(WinHandle)), wn_WritingTools) then
	Let iReturnValue = TRUE
else
	Let iReturnValue = false
endIf
Return iReturnValue
EndFunction

int Function InSpellChecker ()
var
handle winHandle,
int iReturnValue

let WinHandle = FindDescendantWindow (getRealWindow(getFocus()), Cid_DialoguePage)
if StringContains (GetWindowName (getRealWindow(WinHandle)), wn_WritingTools) &&
 FindDescendantWindow (WinHandle, cId_NotFound_Prompt) Then
	Let iReturnValue = TRUE
else
	Let iReturnValue = false
endIf
Return iReturnValue
EndFunction


Int Function InDictionary ()
var
handle winHandle,
int iReturnValue

; Quattro Pro by default has two Window Trees, one for the Application and another for AddIns programs.
; When the Writing Tool dialogue is invoked, another window tree is created.
; When the focus is forced to certain controls that do not normally get focus, JAWS cannot find the Real Window handle.
; This problem occurs in the Dictionary dialogue and the following line gets the correct window handle for the Writing Tool dialogue.
Let WinHandle = GetForegroundWindow ()
if StringContains (GetWindowName (getRealWindow(WinHandle)), wn_WritingTools) &&
 FindDescendantWindow (WinHandle, cId_DefinitionComboBox) Then
	Let iReturnValue = TRUE
Else
	Let iReturnValue = false
endIf
Return iReturnValue
EndFunction

Int Function InThesaurus ()
var
handle winHandle,
int iReturnValue

let WinHandle = FindDescendantWindow (getRealWindow(getFocus()), Cid_DialoguePage)
if StringContains (GetWindowName (getRealWindow(WinHandle)), wn_WritingTools) &&
 FindDescendantWindow (WinHandle, cId_ThesaurusTreeView1) Then
	Let iReturnValue = TRUE
else
	Let iReturnValue = false
endIf
Return iReturnValue
EndFunction

Int Function inCustomDialog  ()
/*
* This function originates from Quattro Pro 9 which had custom dialogues.
* The controls within the dialogue had 0 for the control id.
*  This scripts are used by braille and has been left for that reason.
*/
return FALSE
EndFunction

Void Function sayEditWithButtonControl ()
var
handle hFocus,
handle hParent,
string sParentClass,
handle hParentPrev,
handle hParentNext,
int iParentNextType

let hFocus=getFocus()
let hParent=getParent(hFocus)
let sParentClass=getWindowClass(hParent)
let hParentNext=getNextWindow(hParent)
let hParentPrev=getPriorWindow(hParent)
let iParentNextType=getWindowTypeCode(hParentNext)
; if the focus is an edit which has a button associated with it then speak its prompt, type, contents and help message.
if getWindowTypeCode(hFocus)==wt_edit && (sParentClass==wc_buttonEdit || sParentClass==wc_rangePicker) then
	if getWindowTypeCode(hParentPrev)==wt_static then
		SayFormattedMessage(ot_control_name, getWindowName(hParentPrev))
	endIf
	say(getWindowType(hFocus),ot_control_type) ; announce the type
	sayWindow(hFocus,read_everything) ; read the contents
	if sParentClass==wc_buttonEdit then
		SayFormattedMessage(ot_smart_help, msgToActivateTheButton_L, msgToActivateTheButton_S)
	endIf
endIf
EndFunction
void Function SayFunctionStaticText ()
	SayFormattedMessage (ot_JAWS_message, MsgSynopsis)
SayFormattedMessage (OT_CONTROL_NAME, getWindowText (FindDescendantWindow (GetParent (GlobalFocusWindow), cId_SynopsisStatusText), READ_EVERYTHING))
SayFormattedMessage(ot_JAWS_message,  MsgDescription)
SayFormattedMessage (OT_CONTROL_NAME, GetWindowText (FindDescendantWindow (GetParent (GlobalFocusWindow), cId_DescriptionStatusText), READ_EVERYTHING))
EndFunction



HANDLE Function GetRealWindow (handle hWindow)
var
	string sClass

; Quattro pro is using non-standard menu windows.
; This code prevents JAWS from thinking that the menu window is a real window, when it is not.
; this occurs when you move between the menus or sub-menus.
Let sClass = GetWindowclass (hWindow)
If (sClass == wc_MENU) || (sClass == wc_MENU2) || (sclass == wc_QuattroProApplication) then
	Return 0
Else
	Return GetRealWindow (hWindow)
EndIf
EndFunction

HANDLE Function GetAppMainWindow  (handle hWindow)
var
	string sClass
; Quattro pro is using non-standard menu windows.
; This code prevents JAWS from thinking that the menu window is a new application window, when it is not.
; this occurs when you close a menus or sub-menu.
Let sClass = GetWindowclass (hWindow)
If (sClass == wc_MENU) || (sClass == wc_MENU2) || (sclass == wc_QuattroProApplication) then
	Return 0
Else
	Return GetAppMainWindow (hWindow)
EndIf
EndFunction

void function sayFocusedWindow()
var
	String sClass,
	string sParentClass, ;Class name of the parent window class.
	Int iControlId, ; Control Id with Focus
		string sWindowText, ; stores the contents of the window for prompts.
	String sWindowName ; Name of the current dialogue with focus.
Let sWindowName = GetWindowName (GetRealWindow (GlobalFocusWindow))
Let iControlId = GetControlId (GlobalFocusWindow)
let sClass = GetWindowClass (GlobalFocusWindow)
let sParentClass=getWindowClass(getParent(globalFocusWindow))
If MenusActive () == Active Then
	; When a menu is open, the following permits the first menu item to be spoken by the SayHighlighedText function.
	; This is because the ActiveItemChangedEvent is not being triggered, by Quattro Pro when a menu is open.
	Let GlobalMSAAHasTriggered = FALSE
	If (sClass == wc_MENU2)	&& (GlobalMenuMode == MENUBAR_ACTIVE) Then
	; Insures that the context menu is open correctly.
		NextLine ()
		Pause ()
		EndIf
elIf (inSpreadsheet ()) &&
 ((getWindowClass (GlobalPrevFocus) == wc_Menu) || (getWindowClass (GlobalPrevFocus) == wc_Menu2)) Then
 ; We have just exited the MenuBar of Quattro Pro 10.
 ; Insure that the correct menu is assigned to the global variable and passed to the MenuModeEvent function.
	Let GlobalMenuMode = MENUBAR_ACTIVE
	MenuModeEvent (GlobalFocusWindow, MENU_INACTIVE)
ElIf (sClass == wc_Menu) && (MenusActive () == InActive) Then
	If (GlobalMenuMode == MENU_ACTIVE) Then
	; tells the menuModeEvent that the menubar is now active.
				MenuModeEvent (GlobalFocusWindow, MENUBAR_ACTIVE)
	EndIf
; Announces the next item on the menuBar without letting the user know that the focus has just changed again.
	SayObjectActiveItem()
ElIf (sClass == wc_MENU2) Then
	If (getWindowClass (GlobalPrevFocus) == wc_QuattroProChildWnd) Then
	; MenuBar is now active from the spreadsheet area.
	; Pass the correct menu mode to the MenuModeEvent function.
	MenuModeEvent (GlobalFocusWindow, MENUBAR_ACTIVE)
		SayWord ()
		Return
	ElIf (GlobalMenuMode == MENU_ACTIVE) Then
	; prevents double speaking of menu items.
		Return
	EndIf
	; Announce the menu item on the menubar,
	; after focus is recieved from the system menu.
	SayWord ()
ElIf (GetWindowClass(GlobalFocusWindow) == wc_QuattroProChildWnd) &&
 StringContains (sWindowName, wn_WritingTools) then
	; solves a problem with the Writing Tool Dialogue losing focus when switching from another application.
	if GetFirstChild (GlobalWritingToolFocus) Then
		SetFocus (GetFirstChild (GlobalWritingToolFocus) )
	Else
		SetFocus (GlobalWritingToolFocus)
	EndIf
Return
Elif InSpellChecker () then
	; Focus is in the spell checker.
	If (GetControlId (getParent (GlobalFocusWindow)) == CId_replacements_list100) Then
		;Update the GlobalWritingToolFocus variable with the parent window handle of the current control, to keep them in sinc.
		Let GlobalWritingToolFocus = GetParent (GlobalFocusWindow)
	else
		;Update the GlobalWritingToolFocus with all other controls in the SpellCheck dialogue that recieve focus.
		Let GlobalWritingToolFocus = GlobalFocusWindow
	EndIf
	If (iControlID == CId_ReplaceWith_field) &&
	 ((GetControlId (GlobalPrevFocus) != CId_replacements_list100) && (GetControlId (GlobalPrevFocus) != cID_dialoguePage)) Then
	;If the previous controls are either the replacement listbox or the Spell check tab control, then this code will not be executed.
	;If this is not the case, execute the ReadMisspelledAndSuggestion script.
	performScript readMisspelledAndSuggestion()
		Return
	EndIf
	SayWindowTypeAndText (GlobalFocusWindow)
;	Return
ElIf InDictionary () Then
	; the focus is in the dictionary dialogue.
	If (GetControlId (getParent (GlobalFocusWindow)) == cId_DefinitionComboBox) ||
	 (GetControlId (getParent (GlobalFocusWindow)) == cId_WordListBox) ||
 (GetControlId (getParent (GlobalFocusWindow)) == cId_DefinitionBox) Then
		;Update the GlobalWritingToolFocus variable with the parent window handle of the current control, to keep them in sinc.
		Let GlobalWritingToolFocus = GetParent (GlobalFocusWindow)
	else
		;Update the GlobalWritingToolFocus with all other controls in the SpellCheck dialogue that recieve focus.
		Let GlobalWritingToolFocus = GlobalFocusWindow
	EndIf
	SayWindowTypeAndText (GlobalFocusWindow)
elif inSpreadsheet() then
	; the focus is in the spreadsheet
	if worksheetChanged() then
		loadDocumentSettings()
		loadMonitorCells()
	endIf
	sayCurrentCell()
	ElIf StringContains (SWindowName, wn_PublishToInternetDlg) &&
	(iControlId == cId_RangeEdit) Then
		; Provides a prompt for the range edit field.
		SayFormattedMessage (OT_CONTROL_NAME, "Cell Range")
		SayWindowTypeAndText (GlobalFocusWindow)
	ElIf StringContains (SWindowName, "Find and Replace") Then
	; Corrects the prompts that are spoken in the Find and Replace dialogue.
		If (iControlId == cId_FindEdit) Then
		Let sWindowText = GetWindowText (GetFirstWindow (GlobalFocusWindow), READ_EVERYTHING)
		SayControlExWithMarkup(globalFocusWindow, sWindowText)
		Return
	ElIf (iControlId == cId_RangeEdit) Then
		Let sWindowText = GetWindowText (GetPriorWindow (GetPriorWindow (GetPriorWindow (GetFirstWindow (GlobalFocusWindow)))), READ_EVERYTHING)
		SayControlExWithMarkup(globalFocusWindow, sWindowText)
	Return
EndIf
SayWindowTypeAndText (GlobalFocusWindow)
elif getWindowTypeCode(globalFocusWindow)==wt_edit && (sParentClass==wc_buttonEdit || sParentClass==wc_rangePicker) then
	BrailleCleanVars () ; reset
; say the prompt for this edit control with button
	sayEditWithButtonControl()
	;SayObjectTypeAndText ()
	ElIf (StringContains (sWindowName, wn_FunctionDlg)) &&
 (iControlId == cId_FunctionListbox) Then
 ; announces the synopsis and description for the function listbox when it receives focus.
	SayWindowTypeAndText(globalFocusWindow)
	SayFunctionStaticText ()
ElIf (StringContains (sWindowName, wn_MoveSheetsDlg) &&
(iControlId == Cid_MoveToEdit)) Then
	; Forces JAWS to announce the correct prompt which is "Move To".
	SayControlExWithMarkup (GlobalFocusWindow, GetWindowText (GetPriorWindow (GetPriorWindow (GlobalFocusWindow)), READ_EVERYTHING))
ElIf (iControlId == cId_LastModifyEditComboBox) &&
 (GetControlId (GetParent (GlobalFocusWindow)) == cid_LastModifiedComboBox) Then
	let QPWFirstTimeCombo = TRUE
	sayWindowTypeAndText(globalFocusWindow)
	ElIf (iControlId == cid_NumbericFormat) Then
		SayWindow (GetPriorWindow (GlobalFocusWindow), READ_EVERYTHING)
		sayWindowTypeAndText(globalFocusWindow)
Else
	BrailleCleanVars () ; reset
	sayWindowTypeAndText(globalFocusWindow)
endIf
endFunction


Function MenuModeEvent (handle WinHandle, int Mode)
; The following code is to handle the non-standard menus that is used in Quattro Pro.
; MSAA is used to gain the currently select menu item.
If (GetWindowClass (WinHandle) == WC_MENU2) Then
	If (Mode == MENU_ACTIVE) Then
	; When closing a sub-menu, the ActiveItemChangedEvent is not being triggered, which is used to read out MSAA objects.
	; the following lines fixes this problem.
		SayFormattedMessage (ot_no_disable, GetWindowText (WinHandle, READ_HIGHLIGHTED))
		let GlobalPrevMenuMode = GlobalMenuMode
		Let GlobalMenuMode = mode
		Return
	ElIf (mode == MENU_INACTIVE) && (GlobalMenuMode == MenuBar_Active) Then
		return ; Prevents "Leaving Menu Bar" being spoken.
	ElIf (GlobalMenuMode == MENU_ACTIVE) && (Mode == MENU_INACTIVE) Then
		Return ; Prevents "leaving menu" message from being spoken, when moving between menus.
	EndIf
ElIf (GetWindowClass (WinHandle) == wc_MENU) Then
	If (MenusActive () == Active) && (Mode == MENUBAR_ACTIVE) Then
		let Mode = MENU_ACTIVE ; Assign Menu mode, instead of the Menubar mode which is by default.
		If (GlobalMenuMode == MENU_ACTIVE) Then
			SayFormattedMessage (OT_NO_DISABLE, MsgMenu_L, cMsgSilent)
			Return ; Do not run the MenuModeEvent, to prevent the "menu Active" being spoken
		EndIf
	ElIf (Mode == MENU_INACTIVE) Then
		Return ; prevent the leaving menu from being spoken, when return to the menubar.
	EndIf
EndIf
MenuModeEvent (WinHandle, Mode) ; call the default MenuModeEvent function.
EndFunction

script sayWindowPromptAndText()
var
	handle hWnd,
	int iSubType,
	int nMode
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
If InWritingTools () &&
 (GlobalFocusWindow != GlobalWritingToolFocus) Then
	;The following code handles the objects in the Spellcheck which cannot recieve focus.
	;Announces the object that has got psudo focus.
	SayWindowTypeAndText (GlobalWritingToolFocus)
	;Assign the sub type value of the object that has got the psudo focus.
	Let iSubType = GetWindowSubtypeCode (GlobalWritingToolFocus)
Else
	;The following code handles objects that have the true focus.
	Let hWnd = GetCurrentWindow ()
	Let iSubType = GetWindowSubTypeCode (hWnd)
	If ! iSubType then
		Let iSubType = GetObjectSubTypeCode ()
	EndIf
	sayFocusedWindow()
EndIf
SayTutorialHelp (iSubType, TRUE)
SayTutorialHelpHotKey (hWnd, TRUE)
IndicateComputerBraille (hwnd)
smmToggleTrainingMode(nMode)
endScript

Script tabKey ()
var
	Handle hWnd

Let hWnd = FindDescendantWindow (getRealWindow(getFocus()), Cid_DialoguePage)
sayCurrentScriptKeyLabel()
tabKey()
if inSpreadSheet() Then
	Let ieditCell = FALSE
	sayCurrentCell()
EndIf
EndScript

Script shiftTabKey ()
sayCurrentScriptKeyLabel()
shiftTabKey()
if inSpreadSheet() then
	Let ieditCell = FALSE
	sayCurrentCell()
endIf
EndScript

script sayPriorLine()
if inSpreadsheet() && not iEditCell then
	priorLine()
	sayCurrentCell()
else
	performScript sayPriorLine() ; default
endIf
endScript

script sayLine()
If IsSameScript () then
	SpellLine ()
	Return;
EndIf
If (GetWindowClass (GetCurrentWindow ()) == wc_Menu ) && IsPCCursor () && !UserBufferIsActive () Then
	SayObjectActiveItem ()
	Return
EndIf
if inSpreadSheet() && not caretVisible() then
	sayCell()
else
	performScript sayLine() ; default
endIf
endScript

script sayNextLine()
if inSpreadsheet() && not iEditCell then
	nextLine()
	sayCurrentCell()
		else
	performScript sayNextLine() ; default
endIf
endScript

script sayPriorCharacter()
if inSpreadsheet() && not iEditCell then
	priorCharacter()
	sayCurrentCell()
ElIf (GetWindowClass (GlobalFocusWindow) == wc_QuattroProApplication) &&
 (MenusActive () == Active) then
	ShiftTabKey ()
else
	performScript sayPriorCharacter() ; default
endIf
endScript

script sayCharacter()
/*If (GetWindowClass (GetCurrentWindow ()) == wc_Menu ) && IsPCCursor ()&& !UserBufferIsActive ()Then
	SayObjectActiveItem ()

	Return
EndIf*/
if inSpreadSheet() && not caretVisible() then
	sayCell()
	;ElIf (MenusActive () == Active) Then

else
	performScript sayCharacter() ; defaulte
endIf
endScript

script sayNextCharacter()
if inSpreadsheet() && Not iEditCell then
	nextCharacter()
	sayCurrentCell()
ElIf (GetWindowClass (GlobalFocusWindow) == wc_QuattroProApplication) &&
 (MenusActive () == Active) then
	TabKey ()
else
	performScript sayNextCharacter()
endIf
endScript

script sayPriorWord()
if inSpreadSheet() && not iEditCell then
	typeCurrentScriptKey()
	pause()
	sayCurrentCell()
else
	performScript sayPriorWord() ;default
endIf
endScript

script sayWord()
If (GetWindowClass (GetCurrentWindow ()) == wc_Menu ) && IsPCCursor ()&& !UserBufferIsActive ()Then
	SayObjectActiveItem ()
	Return
EndIf
if inSpreadsheet() && not CaretVisible() then
	if isSameScript() then
		spellCell()
	else
		sayCell()
	endIf
Else
	performScript sayWord() ;default
endIf
endScript

script sayNextWord()
if inSpreadsheet() && not iEditCell then
	typeCurrentScriptKey()
	pause()
	sayCurrentCell()
else
	performScript sayNextWord() ; default
endIf
endScript

Script SayPriorParagraph ()
if inSpreadSheet() then
	sayCurrentScriptKeyLabel()
	typeCurrentScriptKey()
	pause()
	sayCurrentCell()
	return
endIf
performScript sayPriorParagraph() ; default
EndScript

Script SayNextParagraph ()
if inSpreadSheet() then
	sayCurrentScriptKeyLabel()
	typeCurrentScriptKey()
	pause()
	sayCurrentCell()
	return
endIf
performScript sayNextParagraph() ; default
EndScript

Script home ()
if inSpreadSheet() && not iEditCell then
	sayCurrentScriptKeyLabel()
	JAWSHome()
	sayCurrentCell()
else
	performScript JAWSHome()
endIf
EndScript

Script end ()
If inSpreadSheet() && not iEditCell then
	sayCurrentScriptKeyLabel()
	JAWSEnd()
	SayFormattedMessage(ot_smart_help, msgEndModeHelp)
else
	performScript JAWSEnd()
endIf
EndScript


Script firstCell ()
;For the User Buffer
If inSpreadSheet() then
	typeCurrentScriptKey()
	pause()
	sayCurrentCell()
else
	performScript topOFFile()
endIf
EndScript

Script ControlEnd ()
if inSpreadSheet() then
	typeCurrentScriptKey()
	SayFormattedMessage(ot_smart_help, msgEndModeHelp)
else
	performScript bottomOfFile()
endIf
EndScript

string function ToggleCellReadingVerbosity (int iRetCurVal)
if not iRetCurVal then
	;update the value
	let globalCellReadingVerbosity=!globalCellReadingVerbosity
EndIf
if globalCellReadingVerbosity then
	return msgCellContent_S
else
	return msgCellCoordinatesAndContent_S
endIf
EndFunction

string function toggleTitleReadingVerbosity (int iRetCurVal)
if not iRetCurVal then
	;update the value
	if globalTitleReading==readBothTitles then
		let globalTitleReading=readNoTitles
	elif globalTitleReading==readNoTitles then
		let globalTitleReading=readColumnTitles
	elif globalTitleReading==readColumnTitles then
		let globalTitleReading=readRowTitles
	else
		let globalTitleReading=readBothTitles
	endIf
EndIf
;now return the value
if globalTitleReading==readBothTitles then
	return msgReadBothTitles_S
elif globalTitleReading==readNoTitles then
	return msgTitleReadingOff_S
elif globalTitleReading==readColumnTitles then
	return msgReadColumnTitles_S
else
	return msgReadRowTitles_S
endIf
EndFunction

script SetTitleReadingVerbosity ()
SayFormattedMessage (OT_STATUS, toggleTitleReadingVerbosity(FALSE))
if not saveDocumentSettings() then
	SayFormattedMessage (OT_STATUS, msgDocSettingsNotSaved)
endIf
EndScript

Script SetColTitlesToRow ()
SayFormattedMessage (OT_STATUS, setColTitlesToRow(false))
if not saveDocumentSettings() then
	SayFormattedMessage (ot_error, msgDocSettingsNotSaved)
endIf
EndScript

Script SetRowTitlesToColumn ()
SayFormattedMessage (OT_STATUS, setRowTitlesToColumn(false))
if not saveDocumentSettings() then
	SayFormattedMessage (ot_error, msgDocSettingsNotSaved)
endIf
EndScript

Script sayRowTitle ()
SayRowTitle()
EndScript

Script sayColumnTitle ()
SayColumnTitle()
EndScript

Script ReadRowTotal ()
var
	string sTotal
let sTotal = GetRowTotal()
if sTotal == cscNull then
SayFormattedMessage (ot_error,msgNoTotalColumnDefined)
return
EndIf
SayFormattedMessage (ot_no_disable, formatString(msgRowTotal, sTotal))
EndScript

Script ReadColumnTotal ()
var
	string sTotal
let sTotal = GetColumnTotal()
if sTotal == cscNull then
		SayFormattedMessage (ot_error,msgNoTotalRowDefined)
		return
EndIf
SayFormattedMessage (ot_no_disable, formatString(msgColumnTotal, sTotal))
EndScript

Script SetTotalColumnToCurrent ()
SayFormattedMessage (OT_STATUS, setTotalColumnToCurrent(false))
if not saveDocumentSettings() then
	SayFormattedMessage (ot_error, msgDocSettingsNotSaved)
endIf
EndScript

Script SetTotalRowToCurrent ()
SayFormattedMessage (OT_STATUS, setTotalRowToCurrent(false))
if not saveDocumentSettings() then
	SayFormattedMessage (ot_error, msgDocSettingsNotSaved)
endIf
EndScript

Script SetMonitorCellToCurrent ()
setMonitorCellToCurrent()
EndScript

string function UndefineSheetDefinitions (int iRetCurVal)
var
	string sSectionName,
	string sJsiName
if not iRetCurVal then
	;update the value
	initializeDocumentSettings ()
	let sSectionName=getWorksheetName()
	let sJsiName=getNotebookJSIName()
	IniRemoveSection (sSectionName,sJsiName)
	let globalNoSave=true
EndIf
return CSCNull
EndFunction

script clearSheetDefinitions ()
UndefineSheetDefinitions (FALSE)
SayFormattedMessage(OT_STATUS, msgClearingDefinitions_L, msgClearingDefinitions_S) ; clearing ...
EndScript

Script ListColumn ()
if InHJDialog () then
	SayFormattedMessage(ot_error, cMsg337_L, cMsg337_S)
return
endIf
listColumn()
EndScript

Script ListRow ()
if InHJDialog () then
	SayFormattedMessage(ot_error, cMsg337_L, cMsg337_S)
return
endIf
listRow()
EndScript

Script AdjustJAWSVerbosity ()
var
	string list,
	string StrQpwVerbosityItems,
	int priorCellReadingVerbosity,
	int priorDetectCellNumberFormatChange,
	int priorDetectCellBorderChange,
	int priorTitleReading,
	int priorTitleCol,
	int priorTitleRow,
	int priorTotalColumn,
	int priorTotalRow,
	string priorMonitorCells
if InHJDialog () then
	SayFormattedMessage(ot_error, cMsg337_L, cMsg337_S)
	return
endIf
if (IsSpeechOff ()) then
	    PerformScript MuteSynthesizer()
	    return
endIf
Let StrQpwVerbosityItems = jvCellReading
	+jvCellFormatChange
	+jvCellBorderChange
	+jvToggleTitleReading
	+jvSetColumnTitle
	+jvSetRowTitle
	+jvSetTotalColumn
	+jvSetTotalRow
	+jvSetNextAvailableMonitorCell
	+jvClearMonitorCells
	+jvClearSheetDefinitions
let list = StrQpwVerbosityItems+cStrDefaultList()
; store prior settings to determine if any change
let priorCellReadingVerbosity=globalCellReadingVerbosity
let priorDetectCellNumberFormatChange=globalDetectCellNumberFormatChange
let priorDetectCellBorderChange=globalDetectCellBorderChange
let priorTitleReading=globalTitleReading
let priorTitleCol=globalTitleCol
let priorTitleRow=globalTitleRow
let priorTotalColumn=globalTotalColumn
let priorTotalRow=globalTotalRow
let priorMonitorCells=globalMonitorCells
DlgSelectFunctionToRun (list, AdjustJAWSVerbosityDialogName, false)
; see if any have changed and save if they have
if (priorCellReadingVerbosity!=globalCellReadingVerbosity) ||
	(priorDetectCellNumberFormatChange!=globalDetectCellNumberFormatChange) ||
	(priorDetectCellBorderChange!=globalDetectCellBorderChange) then
	if saveApplicationSettings() then
		SayFormattedMessage(ot_JAWS_message, msgAppSettingsSaved)
	else
		SayFormattedMessage(ot_error, msgAppSettingsNotSaved)
	endIf
endIf
if globalNoSave then
; this will be true if clear all definitions was selected
; we want to avoid rewriting an empty section to the jsi since clear all definitions just deleted the relevant section
	let globalNoSave=false ; reset.
	return
endIf
; now if clear all definitions was not selected then we want to see if any relevant document specific settings have
;changed and save the notebook's jsi
if (priorTitleReading!=globalTitleReading) ||
	(priorTitleCol!=globalTitleCol) ||
	(priorTitleRow!=globalTitleRow) ||
	(priorTotalColumn!=globalTotalColumn) ||
	(priorTotalRow!=globalTotalRow) ||
	(priorMonitorCells!=globalMonitorCells) then
	if saveDocumentSettings() then
		SayFormattedMessage(ot_JAWS_message, msgDocSettingsSaved)
	else
		SayFormattedMessage(ot_error, msgDocSettingsNotSaved)
	endIf
endIf
EndScript

Void Function SayHighLightedText (handle hwnd, string buffer)
Var
	String sWindowName ; contains the name of the window.
Let sWindowName = GetWindowName (GetRealWindow (HWnd))
let suppressEcho=true ; item about to be spoken by sayHighlightedText
; HighlightedText Function for speaking all newly written highlighted text.
If (MenusActive () == ACTIVE) Then
	;The highlighted text of menus will be spoken, only if the MSAA is not being activated.
	If GlobalMSAAHasTriggered Then
	; Do not speak the highlighted menu item.
		Return
	EndIf
EndIf
If ((GetWindowSubtypeCode (GlobalFocusWindow) == WT_LISTBOX) ||
(GetWindowSubtypeCode (GlobalFocusWindow)==WT_LISTVIEW)) &&
(GlobalFocusWindow != hWnd) Then
; Prevent other highlight text from speaking when the focus doesn't equal the highlight text.
	Return
EndIf
If (GetWindowSubtypeCode (GlobalFocusWindow)== WT_COMBOBOX) || (GetWindowSubtypeCode (GlobalFocusWindow)==	WT_EDITCOMBO) Then
	If (GetWindowSubtypeCode (hWnd)==	WT_LISTBOX) &&
	 (GetWindowClass (hWnd) != "ComboLBox") Then
; Prevents the highlighted text in the list box being spoken,
;when the combo box or an Edit ComboBox control value has changed.
;	E.G.  New Project or the Bullet and Number/create dialogue.
	; Don't read the highlighted text in the list box control
	Return
	EndIf
	If (GetControlId (hWnd) == cId_LastModifyEditComboBox ) Then
		If QPWFirstTimeCombo Then
			Let QPWFirstTimeCombo = FALSE
		Else
			return
		EndIf
	EndIf
EndIf
If (Not GetCurrentWindow ()) Then
;The following if test fixes a focus lost problem with the Naming dialogue.
; If the focus is on the add button and this button is activated,
;the focus is lost because the add button becomes unavailable.
	If (GetControlId (HWnd) == cId_CellNamingListBox)
	&& (GetControlId (GlobalFocusWindow) == cId_CellNamingAddButton) Then
		;Set the focus to the Cell Name List box.
		SetFocus (HWnd)
	EndIf
	;Do not announce the highlighted text.
	Return
EndIf
if (GetWindowSubTypeCode (hwnd) == WT_TREEVIEW) Then
	SayTreeViewLevel ()
	Return
EndIf
If StringContains (sWindowName, wn_FunctionDlg) &&
(GetControlId (GlobalFocusWindow) == cId_FunctionListBox) Then
	; Automatically read out the synopsis and description for
	; the function listbox.
	SayFormattedMessage(ot_buffer, buffer)
	SayFunctionStaticText ()
	Return
EndIf

SayHighLightedText (hWnd, Buffer) ; call the default SayHighLightedText function.
EndFunction


Script whatsThis ()
SayFormattedMessage(ot_JAWS_message, msgWhatsThis)
typeCurrentScriptKey()
EndScript

Script spellChecker ()
SayFormattedMessage(ot_JAWS_message, msgSpellChecker)
SpeechOff ()
{alt+t}
{s}
SpeechOn ()
;typeCurrentScriptKey()
;delay(5)
EndScript

Script debugMode ()
SayFormattedMessage(ot_JAWS_message, msgDebugMode)
typeCurrentScriptKey()
EndScript

Script playMacro ()
SayFormattedMessage(ot_JAWS_message, msgMacroPlay)
typeCurrentScriptKey()
EndScript

Script formulaComposer ()
SayFormattedMessage(ot_JAWS_message, msgFormulaComposer)
typeCurrentScriptKey()
EndScript

Script listMacros ()
SayFormattedMessage(ot_JAWS_message, msgMacroList)
typeCurrentScriptKey()
EndScript

Script listSpreadsheetFunctions ()
SayFormattedMessage(ot_JAWS_message, msgSpreadsheetFunctionList)
typeCurrentScriptKey()
EndScript

Script nameCell ()
SayFormattedMessage(ot_JAWS_message, msgNameCell)
typeCurrentScriptKey()
EndScript

Script exitQP ()
SayFormattedMessage(ot_JAWS_message, msgExitQP)
typeCurrentScriptKey()
EndScript

Script closeWindow ()
SayFormattedMessage(ot_JAWS_message, msgCloseWindow)
typeCurrentScriptKey()
EndScript

Script quickTab ()
SayFormattedMessage(ot_JAWS_message, msgQuickTab)
typeCurrentScriptKey()
EndScript

Script toggleGroupMode ()
SayFormattedMessage(ot_JAWS_message, msgGroupMode)
typeCurrentScriptKey()
EndScript

Script previousWindow ()
SayFormattedMessage(ot_JAWS_message, msgPreviousWindow)
typeCurrentScriptKey()
EndScript

Script nextWindow ()
SayFormattedMessage(ot_JAWS_message, msgNextWindow)
typeCurrentScriptKey()
EndScript

Script selectionMode ()
SayFormattedMessage(ot_JAWS_message, msgSelectionMode)
typeCurrentScriptKey()
EndScript

Script outlineGroup ()
SayFormattedMessage(ot_JAWS_message, msgOutlineGroup)
typeCurrentScriptKey()
EndScript

Script outlineUngroup ()
SayFormattedMessage(ot_JAWS_message, msgOutlineUngroup)
typeCurrentScriptKey()
EndScript

Script expandOutlineGroup ()
SayFormattedMessage(ot_JAWS_message, msgExpandOutlineGroup)
typeCurrentScriptKey()
EndScript

Script collapseOutlineGroup ()
SayFormattedMessage(ot_JAWS_message, msgCollapseOutlineGroup)
typeCurrentScriptKey()
EndScript

Script contextMenu ()
SayFormattedMessage(ot_JAWS_message, cmsgContextMenu1)
typeCurrentScriptKey()
EndScript

Script visualBasicEditor ()
SayFormattedMessage(ot_JAWS_message, msgVBEditor)
typeCurrentScriptKey()
EndScript

Script notebookProperties ()
SayFormattedMessage(ot_JAWS_message, msgNotebookProperties)
typeCurrentScriptKey()
EndScript

Script applicationProperties ()
SayFormattedMessage(ot_JAWS_message, msgAppProperties)
typeCurrentScriptKey()
EndScript

Script spreadsheetProperties ()
SayFormattedMessage(ot_JAWS_message, msgSpreadsheetProperties)
typeCurrentScriptKey()
EndScript

Script sortData ()
SayFormattedMessage(ot_JAWS_message, msgDataSort)
typeCurrentScriptKey()
EndScript

Script SelectFromStartOfLine()
if inSpreadsheet() then
	typeKey(cksSelectToStartOfLine)
	performScript saySelectedText()
else
	performScript selectFromStartOfLine() ; default ; default
endIf
EndScript

Script SelectFromTop()
if inSpreadsheet() then
	typeKey(cksSelectToTop)
	performScript saySelectedText()
else
	performScript selectFromTop()
endIf
EndScript

Script SelectToBottom()
if inSpreadsheet() then
	typeKey(cksSelectToBottom)
	performScript saySelectedText()
else
	performScript selectToBottom()
endIf
EndScript

Script SelectPriorLine()
if inSpreadsheet() then
	typeKey(cksSelectPriorLine)
	performScript saySelectedText()
else
	performScript selectPriorLine()
endIf
EndScript

Script SelectNextLine()
if inSpreadsheet() then
	typeKey(cksSelectNextLine)
	performScript saySelectedText()
else
	performScript selectNextLine()
endIf
EndScript

Script SelectPriorCharacter()
if inSpreadsheet() then
	typeKey(cksSelectPriorCharacter)
	performScript saySelectedText()
else
	performScript selectPriorCharacter()
endIf
endScript

Script SelectNextCharacter()
if inSpreadSheet() then
	typeKey(cksSelectNextCharacter)
	performScript saySelectedText()
else
	performScript selectNextCharacter()
endIf
EndScript

Script SelectPriorWord()
if inSpreadsheet() then
	typeKey(cksSelectPriorWord)
	performScript saySelectedText()
else
	performScript selectPriorWord()
endIf
EndScript

Script SelectNextWord()
if inSpreadsheet() then
	typeKey(cksSelectNextWord)
	performScript saySelectedText()
else
	performScript selectNextWord()
endIf
EndScript

Script readWordInContext ()
readWordInContext()
EndScript

Script sayGridlineStatus ()
sayGridlineStatus()
EndScript

Script hotkeyHelp ()
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
	SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if inSpreadSheet() then
	SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp1_l, msgHotKeyHelp1_s)
	return
endIf
performScript hotkeyHelp() ; default
EndScript

Script screenSensitiveHelp ()
if (IsSameScript ()) then
	AppFileTopic(topic_Quattro_Pro)
	return
endIf
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if InWritingTools () then
	SayFormattedMessage(ot_USER_BUFFER, msgSpellCheckerHelp_L, msgSpellCheckerHelp_S) ;"The spellchecker is active.",
	if getWindowTypeCode(getFocus()) ==wt_unknown then
		return
	endIf
elif inSpreadsheet() then
	SayFormattedMessage(ot_USER_BUFFER, formatString(msgSpreadsheetWindow_L, getCellCoordinates()), formatString(msgSpreadsheetWindow_S, getCellCoordinates()))
	performScript sayGridlineStatus()
	return
EndIf
If (GlobalMenuMode == MENUBAR_ACTIVE) then
	ScreenSensitiveHelpForKnownClasses (wt_MenuBar);
	return
	elIf (GlobalMenuMode == MENU_ACTIVE) Then
	ScreenSensitiveHelpForKnownClasses (wt_Menu);
	return
	EndIf
performScript screenSensitiveHelp() ; default
	if getWindowTypeCode(globalFocusWindow)==wt_edit &&
	getWindowClass(getParent(globalFocusWindow))==wc_buttonEdit then
		SayFormattedMessage(ot_USER_BUFFER, WPHelpMsg100_L, WPHelpMsg100_S)
endIf
EndScript


Script ReadMisspelledAndSuggestion ()
var
	handle WinHandle,
	Handle AppWindow,
	Handle NotFoundField,
	Handle ReplaceField

let WinHandle = FindDescendantWindow (getRealWindow(getFocus()), Cid_DialoguePage)
if StringContains (GetWindowName (getRealWindow(WinHandle)), wn_writingTools) then
	Let NotFoundfield = FindDescendantWindow (WinHandle, CId_NotFound_field)
	Let ReplaceField = FindDescendantWindow (WinHandle, CId_ReplaceWith_field)
	SayUsingVoice (VCTX_MESSAGE, GetWindowText (FindDescendantWindow (WinHandle, CId_NotFound_Prompt), FALSE), OT_STATIC)
	SayUsingVoice (VCTX_MESSAGE, GetWindowText (NotFoundfield, FALSE), OT_STATIC)
	SpellString (GetWindowText (NotFoundfield, FALSE))
	SayUsingVoice (VCTX_MESSAGE, GetWindowText (FindDescendantWindow (WinHandle, CId_ReplaceWith_Prompt), FALSE), OT_STATIC)
	SayUsingVoice (VCTX_MESSAGE, GetWindowText (ReplaceField, FALSE), OT_STATIC)
	SpellString (GetWindowText (ReplaceField, FALSE))
else
	SayFormattedMessage(ot_error, QPWErrorMsg1) ; "you must be in the Spell Checker dialog to read misspelled word and suggestion"
endIf
EndScript

Script SayCell ()
if not inSpreadsheet() then
	SayFormattedMessage(ot_error, cmsgNotInTable_L )
	return
endIf
if globalTitleReading & readRowTitles then
	SayRowHeader()
endIf
if globalTitleReading & readColumnTitles then
	SayColumnHeader()
endIf
SayCell()
EndScript

Script NextCell()
if not inSpreadsheet() then
	SayFormattedMessage(ot_error, cmsgNotInTable_L )
	return
endIf
if NextCell() then
	if globalTitleReading & readColumnTitles then
		SayColumnHeader()
	endIf
	SayCell()
	sayCellCoordinates()
else
	SayFormattedMessage(ot_JAWS_message, cMSGEndOfRow)
endIf
EndScript

Script PriorCell()
if not inSpreadsheet() then
	SayFormattedMessage(ot_error, cmsgNotInTable_L )
	return
endIf
if PriorCell() then
	if globalTitleReading & readColumnTitles then
		SayColumnHeader()
	endIf
	SayCell()
	sayCellCoordinates()
else
	SayFormattedMessage(ot_JAWS_message, cMSGBeginningOfRow)
endIf
EndScript

script UpCell()
if not inSpreadsheet() then
	SayFormattedMessage(ot_error, cmsgNotInTable_L )
	return
endIf
if UpCell() then
	if globalTitleReading & readRowTitles then
		SayRowHeader()
	endIf
	SayCell()
	sayCellCoordinates()
else
	SayFormattedMessage(ot_JAWS_message, cMSGTopOfColumn)
endIf
EndScript

script DownCell()
if not inSpreadsheet() then
	SayFormattedMessage(ot_error, cmsgNotInTable_L )
	return
endIf
if DownCell() then
	if globalTitleReading & readRowTitles then
		SayRowHeader()
	endIf
	SayCell()
	sayCellCoordinates()
else
	SayFormattedMessage(ot_JAWS_message, cMSGBottomOfColumn)
endIf
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
if getCurrentControlId()!=0 && (getWindowClass(getCurrentWindow())==wc_QuattroProChildWnd) && not InWritingTools () then
	delay(1)
	if isPcCursor() || isJAWSCursor() then
		sayCurrentCell()
	endIf
endIf
EndScript

int Function saveApplicationSettings ()
var
int iResult

let iResult=IniWriteInteger (Section_appVerbositySettings, hKey_CellReadingVerbosity, globalCellReadingVerbosity,jsiFileName)
iniWriteInteger(Section_appVerbositySettings,hKey_DetectCellNumberFormatChange,globalDetectCellNumberFormatChange,jsiFileName)
iniWriteInteger(Section_appVerbositySettings,hKey_DetectCellBorderChange,globalDetectCellBorderChange,jsiFileName)
return iResult
EndFunction

void Function loadApplicationSettings ()
initializeApplicationSettings()
let globalCellReadingVerbosity=iniReadInteger (Section_appVerbositySettings, hKey_CellReadingVerbosity, globalCellReadingVerbosity,jsiFileName)
let globalDetectCellNumberFormatChange=iniReadInteger(Section_appVerbositySettings,hKey_DetectCellNumberFormatChange,globalDetectCellNumberFormatChange,jsiFileName)
let globalDetectCellBorderChange=iniReadInteger(Section_appVerbositySettings,hKey_DetectCellBorderChange,globalDetectCellBorderChange,jsiFileName)
EndFunction

int Function saveDocumentSettings ()
var
string sWorksheetName,
string sJsiName,
int iResult

let sWorksheetName=getWorksheetName()
let sJsiName=getNotebookJSIName()
let iResult=iniWriteInteger(sWorksheetName,hKey_TitleReadingVerbosity,globalTitleReading,sJsiName)
iniWriteInteger(sWorksheetName,hKey_TitleCol,globalTitleCol,sJsiName)
iniWriteInteger(sWorksheetName,hKey_TitleRow,globalTitleRow,sJsiName)
iniWriteInteger(sWorksheetName,hKey_TotalsColumn,globalTotalColumn,sJsiName)
iniWriteInteger(sWorksheetName,hKey_TotalsRow,globalTotalRow,sJsiName)
iniWriteInteger(sWorksheetName,hKey_RowTotalAutoFind,GlobalRowTotalAutoFind,sJsiName)
iniWriteInteger(sWorksheetName,hKey_ColumnTotalAutoFind,GlobalColumnTotalAutoFind,sJsiName)
return iResult
EndFunction

Void Function loadDocumentSettings ()
var
string sWorksheetName,
string sJSIName
; initialize globals so if we don't load anything, the default settings are used
initializeDocumentSettings()
let sWorksheetName=getWorksheetName()
let sJsiName=getNotebookJSIName()
; Note that if no settings are found for the specific worksheet then default settings are used
let globalTitleReading=iniReadInteger(sWorksheetName,hKey_TitleReadingVerbosity,globalTitleReading,sJsiName)
let globalTitleCol=iniReadInteger(sWorksheetName,hKey_TitleCol,globalTitleCol,sJsiName)
let globalTitleRow=iniReadInteger(sWorksheetName,hKey_TitleRow,globalTitleRow,sJsiName)
let globalTotalColumn=iniReadInteger(sWorksheetName,hKey_TotalsColumn,globalTotalColumn,sJsiName)
let globalTotalRow=iniReadInteger(sWorksheetName,hKey_TotalsRow,globalTotalRow,sJsiName)
let globalColumnTotalAutoFind=iniReadInteger(sWorksheetName,hKey_ColumnTotalAutoFind,globalColumnTotalAutoFind,sJsiName)
let globalRowTotalAutoFind=iniReadInteger(sWorksheetName,hKey_RowTotalAutoFind,globalRowTotalAutoFind,sJsiName)
EndFunction


Script nextSheet ()
If DialogActive() then
	PerformScript NextDocumentWindowByPage ()
	Return;
EndIf
if inSpreadsheet() then
	typeCurrentScriptKey()
	pause()
	saySheetIdentifier()
	if worksheetChanged() then
		loadDocumentSettings()
		loadMonitorCells()
	endIf
	sayCurrentCell()
else
	sayCurrentScriptKeyLabel()
	typeCurrentScriptKey()
endIf
EndScript

Script priorSheet ()
If DialogActive() then
	PerformScript PreviousDocumentWindowByPage ()
	Return;
EndIf
if inSpreadsheet() then
	typeCurrentScriptKey()
	pause()
	saySheetIdentifier()
	if worksheetChanged() then
		loadDocumentSettings()
		loadMonitorCells()
	endIf
	sayCurrentCell()
else
	sayCurrentScriptKeyLabel()
	typeCurrentScriptKey()
endIf
EndScript

string function toggleCellFormatChangeDetection (int iRetCurVal)
if not iRetCurVal then
	;update the value
	let globalDetectCellNumberFormatChange=!globalDetectCellNumberFormatChange
EndIf
if globalDetectCellNumberFormatChange then
	return QPMsgToggleCellFormatChangeOn_S
else
	return QPMsgToggleCellFormatChangeOff_S
endIf
EndFunction

string function toggleCellBorderChangeDetection (int iRetCurVal)
if not iRetCurVal then
	;update the value
	let globalDetectCellBorderChange=!globalDetectCellBorderChange
EndIf
if globalDetectCellBorderChange then
	return QPMsgToggleCellBorderChangeOn_S
else
	return QPMsgToggleCellBorderChangeOff_S
endIf
EndFunction

string function UndefineMonitorCells (int iRetCurVal)
var
	string sJsiName,
	string sSection
if not iRetCurVal then
	;update the value
	let sSection=getMonitorCellsSection()
	let sJsiName=getNotebookJsiName()
	IniRemoveSection (sSection, sJsiName)
	loadMonitorCells()
EndIf
return CSCNull
EndFunction

Script clearMonitorCells ()
var
	string sWorksheetName
UndefineMonitorCells(FALSE)
let sWorksheetName=getWorksheetName()
SayFormattedMessage(OT_STATUS, formatString(msgClearingMonitorCells_L, sWorksheetName),msgClearingMonitorCells_S)
EndScript

Function loadMonitorCells ()
var
int index,
string sSection,
string sJsiName

let sJsiName=getNotebookJSIName()
let sSection=getMonitorCellsSection()

let globalMonitorCells=cscNull
let index=1
while index <=maxMonitorCells
	let globalMonitorCells=globalMonitorCells+list_item_separator+iniReadString(sSection,formatString(hKey_monitorCell, intToString(index)),monitorCellUndefined,sjsiName)
	let index=index+1
endWhile
; remove leading delimiter
let globalMonitorCells=stringChopLeft(globalMonitorCells,1)
EndFunction

Script moveToMonitorCell ()
if stringLength(globalMonitorCells)==2*maxMonitorCells then
	SayFormattedMessage(ot_error, formatString(msgNoMonitorCellsDefined_L,getWorkSheetName(), formatString(msgNoMonitorCellsDefined_S, getWorksheetName())))
	return
endIf
if InHJDialog () then
	SayFormattedMessage(ot_error, cMSG337_L, cMsg337_S)
return
endIf
moveToMonitorCell()
EndScript
string function NextAvailableMonitorCell (int iRetCurVal)
var
	int index,
	string cellCoordinates,
	int monitorCellNumber
if not iRetCurVal then
	;update the value
	let index=1
	let monitorCellNumber=0
	while index <=maxMonitorCells
		if stringSegment(globalMonitorCells,list_item_separator,index)==monitorCellUndefined then
			; this is a blank monitor cell
			let monitorCellNumber=index
			let index=maxMonitorCells
		endIf
		let index=index+1
	endWhile
	if monitorCellNumber then
		setNthMonitorCellToCurrent(monitorCellNumber)
	EndIf
EndIf
;now return the value
if !monitorCellNumber then
	return msgNoMonitorCellsAvailable_S
else
	return CSCNull
endIf
EndFunction

Script setNextAvailableMonitorCell ()
SayFormattedMessage (OT_STATUS, NextAvailableMonitorCell(FALSE))
EndScript

Script setMonitorCells ()
var
int index

let index=stringToInt(stringRight(getCurrentScriptKeyName(),1))
if index==0 then
	let index=maxMonitorCells
endIf
setNthMonitorCellToCurrent(index)
EndScript

Script ReadMonitorCell ()
var
int index

let index=stringToInt(stringRight(getCurrentScriptKeyName(),1))
if index==0 then
	let index=maxMonitorCells
endIf
readMonitorCell(index)
endScript

Script upALevel ()
if inSpreadsheet() then
	sayCurrentScriptKeyLabel()
	TypeKey(cksEscape) ;escape
	pause()
	if iEditCell && Not stringContains(getStatusBarText(),scEdit) then
; was editing a cell, now back at cell navigation level
		Let iEditCell = FALSE
		sayCurrentCell()
	endIf
ElIf (GetWindowClass (GlobalFocusWindow) == wc_QuattroProApplication) &&
	(MenusActive () == Active) then
	; By default, when the focus is on the system menu, pressing escape will return
	;you to the MenuBar.  The below code will force the focus to be placed on to the spreadsheet.
	sayCurrentScriptKeyLabel()
	TypeKey(cksEscape) ;escape
	TypeKey(cksEscape) ;escape
else
	performScript upALevel() ;default
endIf
EndScript

string function getStatusBarText()
var
handle hStatusBar
let hStatusBar=FindDescendantWindow (getAppMainWindow(getFocus()), cId_statusBar100)
if hStatusBar && isWindowVisible(hStatusBar) then
	return getWindowText(hStatusBar, read_everything)
else
	return cscNull
endIf
endFunction


Void Function NextSpellCheckControl ()
Var
	Handle hWindow

;Stores the window handle, in case there is no next window handle.
Let HWindow = GetNextWindow (GlobalWritingToolFocus)
;Checks to see if their is a window handle.
If hWindow Then
	If (GetControlId (hWindow) == cID_UnDoButton) Then
		;The Undo button is not a part of the virtual tab, because it doesn't appear to ever be available.
		;Moves the focus to the Replace, Skip Once, Skip All, Add, Auto Replace and Option buttons.
		Let hWindow = GetNextWindow (hWindow)
	ElIf (GetControlId (hWindow) == cID_CheckMethodStaticText) Then
		;Moves the focus to the Check Method ComboBox
		Let hWindow = GetNextWindow (hWindow)
	ElIf (GetControlId (hWindow) == CId_replacements_Prompt100) Then
	;Moves the focus to the Replacement list box.
		Let hWindow = GetNextWindow (GetFirstChild (hWindow))
	ElIf (GetControlId (hWindow) == CId_CloseButton) Then
	;Move the focus to Replace With: field, which is the first in the tab order and is ready for the foreword tab navigation.
		Let hWindow = FindDescendantWindow (GetPriorwindow (hWindow), cId_ReplaceWith_Field)
	EndIf
else
	;the following If test are triggered because they are at the end of the window handles of the current logical level.
	;They move to the next control in the virtual tab order.
	If (GetControlId (GlobalWritingToolFocus) == cID_HelpButton) Then
	;Announces the Spellcheck dialogue page name.
		Let hWindow = GetFirstWindow (GlobalWritingToolFocus)
	ElIf (GetControlId (GlobalWritingToolFocus) == cID_CheckMethodComboBox) Then
	;Announces the Close Button.
		Let hWindow = GetNextWindow (GetParent (GetParent (GlobalWritingToolFocus)))
	EndIf
EndIf ;hWindow
SetFocus (hWindow)
EndFunction

Void Function PriorSpellcheckControl ()
Var
	Handle hWindow

;Stores the window handle, in case there is no previous window handle.
Let hWindow = GetPriorWindow (GlobalWritingToolFocus)
;Checks to see if their is a window handle.
If hWindow Then
	If (GetControlId (hWindow) == cID_UnDoButton) Then
		;The Undo button is not a part of the virtual tab, because it doesn't appear to ever be available.
		;Moves the focus to the Replace, Skip Once, Skip all, Add, Auto Replace, Option and Undo buttons
		Let hWindow = GetPriorwindow (hWindow)
	elIf (GetControlId (hWindow) == cID_CheckMethodStaticText) Then
	;Moves the focus to the Option button
		Let hWindow = GetPriorWindow (hWindow)
	ElIf (GetControlId (hWindow) == CId_dialoguePage) Then
		;Moves the focus to the Check Method combo box
	Let hWindow = FindDescendantWindow (hWindow, CId_CheckMethodComboBox)
	ElIf (GetControlId (hWindow) == CId_ReplaceWith_Prompt) Then
	;Moves the focus to the Spellcheck tab.
		Let hWindow = GetParent (GetParent(hWindow))
	ElIf (GetControlId (hWindow) == CId_replacements_Prompt100) Then
		;Sets focus to the Replace with field.
		Let hWindow = GetPriorWindow (hWindow)
	ElIf (GetControlId (hWindow) == CId_replacements_List100) Then
		;Moves focus to the replacement listbox.
		Let hWindow = GetFirstChild (hWindow)
	EndIf
else
	;the following code is executed because there are no more window handles  at this level.
	Let hWindow = FindDescendantWindow (GetParent (GlobalWritingToolFocus), cId_HelpButton)
EndIf ;hWindow
SetFocus (hWindow)
EndFunction


Void Function NextDictionaryControl ()
Var
	Handle hWindow, ; The window handle of the next window.
	Int iControlId ; contains the control id of the new control.

Let hWindow = GetNextWindow (GlobalWritingToolFocus )
If hWindow Then
	Let iControlId = GetControlId (hWindow)
	If (iControlid == cId_WordListBox) ||
	 (iControlId == cId_DefinitionBox) Then
		;Moves to the list box or the explaination box.
		Let hWindow = GetFirstChild (hWindow)
	ElIf (iControlId == cId_LookupStaticText) Then
		;Moves the focus to the Lookup combo box.
		Let hWindow = getNextWindow (hWindow)
	ElIf (iControlId == cId_DictionaryComboBox) Then
	;Moves the focus to the Go to Button.
		Let hWindow = GetNextWindow (GetNextWindow (GetNextWindow (hWindow)))
	ElIf (iControlId == CId_CloseButton) Then
		;Moves to the definition combo box.
		let hWindow = FindDescendantWindow (GetParent (hWindow), cId_DefinitionComboBox)
	EndIf
else
	Let iControlId = GetControlid (GlobalWritingToolFocus)
	;the following If test are triggered because they are at the end of the window handles of the current logical level.
	;They move to the next control in the virtual tab order.
	If (iControlId == cID_HelpButton) Then
	;Announces the Spellcheck dialogue page name.
		Let hWindow = GetFirstWindow (GlobalWritingToolFocus)
	ElIf (iControlId == cId_DefinitionBox) Then
	;Announces the Close Button.
		Let hWindow = GetNextWindow (GetParent (GetParent (GlobalWritingToolFocus)))
	EndIf
EndIf
SetFocus (hWindow)
EndFunction

Function PriorDictionaryControl ()
Var
	Handle hWindow, ; The window handle of the next window.
	Int iControlId ; contains the control id of the new control.

Let hWindow = GetPriorWindow (GlobalWritingToolFocus )
If hWindow Then
	Let iControlId = GetControlId (hWindow)
	If (iControlId == CId_dialoguePage) Then
		;Moves the focus to the definition box.
		let hWindow = GetFirstChild (FindDescendantWindow (GetParent (hWindow), cId_DefinitionBox))
	ElIf (iControlId == cId_LookupStaticText) Then
		;Moves to the Go To Button
	Let hWindow = GetPriorWindow (hWindow)
	ElIf (iControlId == cId_OxfordDictionaryButton) Then
		;Moves to the word list box.
		let hWindow = GetFirstChild (FindDescendantWindow (GetParent (HWindow), cId_WordListBox))
	EndIf
Else
	;the following code is executed because there are no more window handles  at this level.\
	If (GetControlId (GlobalFocusWindow) == cId_DialoguePage) Then
		;Moves the focus to the help button.
		Let hWindow = FindDescendantWindow (GetParent (GlobalWritingToolFocus), cId_HelpButton)
	Else
		;Moves the focus to the Dictionary tab.
		Let hWindow = GetParent (GetParent (GlobalWritingToolFocus))
	EndIf
		EndIf
SetFocus (hWindow)
EndFunction

Script EditCell ()
SayCurrentScriptKeyLabel ()
let iEditCell = Not stringContains(getStatusBarText(),scReady)
TypeCurrentScriptKey ()
EndScript


Script Enter ()
SayCurrentScriptKeyLabel ()
EnterKey ()
If inSpreadsheet () Then
	let iEditCell = FALSE
	sayCurrentCell()
EndIf
EndScript


Script JAWSDelete ()
If inSpreadsheet () && (not CaretVisible ()) Then
	TypeKey(cksDelete)
	Delay (2)
	sayCurrentCell()
Else
	PerformScript JAWSDelete()
EndIf
EndScript

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
var
	int iAccessKeySpeak
Let iAccessKeySpeak = ShouldItemSpeak (OT_ACCESS_KEY)
SaveCursor ()
PCCursor ()
SayObjectActiveItem()
RestoreCursor ()
If (GetWindowClass (curHwnd) == wc_Menu) Then
	; Prevents the highlighted text in the menus and sub-menus from being spoken.
	Let GlobalMSAAHasTriggered  = TRUE
	If (GlobalMenuMode == MENU_ACTIVE) then
		If iAccessKeySpeak == ACCESS_KEY_ALL ||
		iAccessKeySpeak == ACCESS_KEY_MENUS then
			SayTutorialHelpHotKey(curHwnd,false)
		EndIf
	EndIf
EndIf
EndFunction


void Function tutorMessageEvent (handle hwndFocus, int MenuMode)
var
	int iAccessKeySpeak
Let iAccessKeySpeak = ShouldItemSpeak (OT_ACCESS_KEY)
If (GetWindowClass (hwndFocus) == wc_QuattroProApplication) Then
	; set the flag to prevent the first item on the menu bar from repeating the tutor info.
	; this is due to the menu bar receiving focus three times for three different menu classes.
	let GlobalSystemMenuActivated= TRUE
elIf (GetWindowClass (hwndFocus) == wc_Menu2) Then
	; set the flag to prevent the second item on the menu bar from repeating the tutor info.
	; this is due to the menu bar receiving focus three times for three different menu classes.
	Let GlobalMenu2Activated  = TRUE
	If GlobalSystemMenuActivated Then
		; Only announce the access key, not the tutor help.
	let GlobalSystemMenuActivated= FALSE
		If iAccessKeySpeak == ACCESS_KEY_ALL ||
		iAccessKeySpeak == ACCESS_KEY_MENUS then
			SayTutorialHelpHotKey(hwndFocus,false)
		EndIf
		Return
	EndIf
elIf (GetWindowClass (hwndFocus) == wc_Menu) Then
	If (MenuMode == MENU_INACTIVE) && (GlobalPrevMenuMode == MENU_INACTIVE) Then
	; Prevents the wc_menu window class repeating the tutor help because it has already been spoken.
		Return
	elIf (MenuMode == MENUBAR_ACTIVE) && (GlobalMenuMode == MENU_ACTIVE) Then
		; prevents the tutor help from being spoken before the highlighted text.
	Return
	elif GlobalMenu2Activated   && (MenuMode == MENUBAR_ACTIVE) Then
	; Prevents the access key on the menubar from being spoken twice after a menu has closed.
	let GlobalMenu2Activated= FALSE
		If iAccessKeySpeak == ACCESS_KEY_ALL ||
		iAccessKeySpeak == ACCESS_KEY_MENUS then
			SayTutorialHelpHotKey(hwndFocus,false)
		EndIf
		Return
	EndIf
Endif
tutorMessageEvent (hwndFocus, MenuMode)
EndFunction

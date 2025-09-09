; Copyright 1995-2021 by Freedom Scientific, Inc.
; JAWS Script files for Corel Presentations X8
;Accompanying executables to this application are:
; prwin18.exe, prlmen.dll

Include "HjConst.jsh"
Include "HjGlobal.jsh"
include "common.jsm"
Include "prwin18.jsh"
Include "prwin18.jsm"
use "prFunc.jsb" ; object model interface code

Function glbFocusRead ()
var
handle hFocus
let hFocus=getFocus()
if getWindowClass(hFocus)==wc_GLB then
	say(getWindowName(hFocus),ot_line)
endIf
EndFunction


Function PRArrayFocusRead ()
var
handle hFocus
let hFocus=getFocus()
if getWindowClass(hFocus)==wc_PRArray then
	say(getWindowName(hFocus),ot_line)
endIf
	EndFunction

Void Function SaySlideSorterFocus ()
SayFormattedMessage(ot_help, formatString(PRMsgSlide, intToString(getSlideNumber())))
saySlideTitle()
if doesSlideHaveSpeakerNotes() then
	SayFormattedMessage(ot_help, PRMsgHasNotes_L, PRMsgHasNotes_S)
endIf
setBrlSlideInfo() ; sets up Braille globals for tracking in Slide Sorter View
EndFunction

int function HandleCustomWindows (handle hwnd)
var
handle hParent,
handle hParentPrior,
handle hPrior,
handle hNext,
int iNextType,
int iPriorType,
	int iType,
int iParentType,
int iParentPriorType,
string sParentClass,
int iControl,
string sClass,
string sRealName,
string sName

If GlobalMenuMode then ; Safety so we don't break menus or menu bars
	Return false ;
endIf
let iType = GetWindowSubTypeCode (hWnd)
let hPrior=getPriorWindow(hwnd)
let hNext=getNextWindow(hwnd)
let iNextType=getWindowSubtypeCode(hNext)
let iPriorType=getWindowSubtypeCode(hPrior)
let hParent=getParent(hwnd)
let hParentPrior=getPriorWindow(hParent)
let sParentClass=getWindowClass(hParent)
let iParentType=getWindowSubtypeCode(hParent)
let iParentPriorType=getWindowSubtypeCode(hParentPrior)
let iControl = GetControlID (hwnd)
let sName= GetObjectName ()
let sClass=getWindowClass(hwnd)
let sRealName=getWindowName(getRealWindow(hwnd))
If isWritingToolsActive () && (sClass == "PR_TEXTTOOL.18") Then
	;If the writing tool is present on the screen, inform the user.
	SayFormattedMessage (OT_Help, msgWritingToolsError_l, cMsgSilent)
EndIf
if sClass==wc_bitmapButton then
	say(getWindowName(hwnd),ot_control_name)
	say(PRMsgBitmapButton,ot_control_type)
	if controlIsChecked() then
		say(PRMsgPressed,ot_item_state)
	endIf
	return true
elIf (iType==wt_edit || iType==wt_editCombo) && (iParentType==wt_comboBox || iParentType==wt_editCombo) then
; say the prompt
		if iParentPriorType==wt_static then
		say(getWindowName(hParentPrior),ot_control_name)
	endIf
	; say the type
	say(cVMsgEditCombo1_L,ot_control_type)
; say the contents
	sayWindow(hwnd,read_everything)
	return true
elif iType==wt_edit && sParentClass==wc_spinEdit then
	if iParentPriorType==wt_static || iParentPriortype==wt_radioButton then
; say the prompt
		say(getWindowName(hParentPrior),ot_control_name)
	elif getWindowClass(hParentPrior)==wc_prglb && getWindowTypeCode(getPriorWindow(hParentPrior))==wt_static then
; use the button's label
		say(getWindowName(getPriorWindow(hParentPrior)),ot_control_name)
	endIf
; say the type
	say(cVMsgSpinBox1_L, ot_control_type)
	; say the contents
	sayWindow(hwnd,read_everything)
	return true
elif iType==wt_edit && sParentClass==wc_buttonEdit then
	if iParentPriorType==wt_static then
		say(getWindowName(hParentPrior),ot_control_name)
	endIf
	say(getWindowType(hwnd),ot_control_type) ; announce the type
	sayWindow(hwnd,read_everything) ; read the contents
	SayFormattedMessage(ot_smart_help, PRMsgToActivateTheButton_L, PRMsgToActivateTheButton_S)
	return true
elif iType==wt_treeView && iPriorType==wt_static then
; say the prompt
	say(getWindowName(hPrior),ot_control_name)
	sayObjectTypeAndText()
	return true
elif sClass==wc_GLB then
; say the prompt:
	if iPriorType==wt_static then
		say(getWindowName(hPrior),ot_control_name)
	elif sParentClass==wc_PRGLB && iParentPriorType==wt_static then
		say(getWindowName(hParentPrior),ot_control_name)
	endIf
	say(PRMsgGLB,ot_control_type)
; read the description
	glbFocusRead()
	return true
elif sClass==wc_PRArray then
; say the prompt:
	if iPriorType==wt_static then
		say(getWindowName(hPrior),ot_control_name)
	endIf
	say(PRMsgPRArray,ot_control_type)
; read the description
	PRArrayFocusRead()
	return true
elif sClass==wc_charMapGrid then
SayString ("Chart map test ")
	if iPriorType==wt_static then
		say(getWindowName(hPrior),ot_control_name)
	endIf
	say(PRMsgCharGrid,ot_control_type)
	sayCharacter()
	return true
elif sRealName==wn_perfectExpert && getDialogPageName()==wn_createNewPage && iType==wt_listbox then
	sayWindowTypeAndText(hwnd)
	SayFormattedMessage (ot_screen_message, getWindowName(hNext))
	return true
elif sClass==wc_slideShowRunning then
SayString ("slid show running test ")
	SayFormattedMessage(ot_help,PRMsgSlideShowRunning_L, PRMsgSlideShowRunning_S)
	return true
elIf not dialogActive() then
	setGlobalMode() ; this sets up a global which is used in Braille support
	sayCurrentView()
	sayCurrentDrawingTool()
	if isNavigationMode() then
		sayFocusedSlideObject()
	elIf isSlideSorter() then
	SaySlideSorterFocus()
	endIf
	return true
else
	return false
endIf
EndFunction

int function HandleCustomRealWindows (handle hwnd)
var
	string sRealName
let sRealName = GetWindowName (GetRealWindow (hwnd))
EndFunction

void function AutoStartEvent ()
let nSuppressEcho = false
If ! CorelPresentations18FirstTime then
	let CorelPresentations18FirstTime = 1
	SayFormattedMessage(OT_APP_START, msgAppStart1_L, msgAppStart1_S)
endIf
let gsDefaultUnitsOfMeasure=PRMeasureWPUnits
let gsUnitsOfMeasure=IniReadString (Section_ApplicationVerbositySettings, Key_UnitsOfMeasure, gsDefaultUnitsOfMeasure, PRJSIName)
EndFunction


Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow
let RealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
if (GlobalPrevApp != AppWindow && AppWindow != FocusWindow) then
  ; we've switched to a different app main window,
  ; and it does not have the focus, so announce it
  SayWindowTypeAndText (AppWindow)
endIf
If ((GlobalPrevRealName != RealWindowName) || ; name has changed
(GlobalPrevReal != RealWindow)) then ; or handle has changed, then
	If ((RealWindow != AppWindow) &&
	(RealWindow != FocusWindow)) then
		If (! HandleCustomRealWindows (RealWindow)) then
			SayWindowTypeAndText (RealWindow)
		endIf
	endIf
endIf
let GlobalFocusWindow = FocusWindow
if (GlobalPrevFocus != focusWindow) then
	If (! HandleCustomWindows (FocusWindow)) then
		SayFocusedWindow () ; will use global variable GlobalFocusWindow
	endIf
Else
  SayFocusedObject ()
endIf
;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

Void Function SayFocusedWindow ()
If (! HandleCustomWindows (GlobalFocusWindow)) then
	SayWindowTypeAndText (GlobalFocusWindow)
endIf
EndFunction

void function SayNonHighlightedText (handle hwnd, string buffer)
var
string sClass,
	int iControl,
handle hPrior
let sClass=getWindowClass(hwnd)
let iControl = GetControlID (hwnd)
if iControl==cId_notFoundEdit then
	if getWindowName(getRealWindow(hwnd))==wn_writingTools then
		performScript readMisspelledAndSuggestion()
		return
	endIf
endIf
if getWindowName(getRealWindow(hwnd))==wn_perfectExpert then
	let hPrior=getPriorWindow(hwnd)
	if getWindowTypeCode(hwnd)==wt_static && getWindowTypeCode(hPrior)==wt_listbox && globalFocusWindow==hPrior then
		say(Buffer,ot_screen_message)
	endIf
endIf
if sClass==wc_dialog && getScreenEcho() > 0 then
	if !stringContains(buffer,scMenuBar) then
		say(buffer,ot_dialog_text)
		return
	endIf
endIf
If (nSuppressEcho == on) then
	return
endIf
SayNonHighlightedText (hwnd, buffer)
EndFunction

void function SayHighlightedText (handle hwnd, string buffer)
var
	int iControl
let iControl = GetControlID (hwnd)

if (GetWindowSubtypeCode (GlobalFocusWindow)== WT_COMBOBOX) || (GetWindowSubtypeCode (GlobalFocusWindow)== 	WT_EDITCOMBO) Then
	If (GetWindowSubtypeCode (hWnd)== 	WT_LISTBOX) Then
	; Prevents the highlighted text in the list box being spoken, when the combo box or an Edit ComboBox control value has changed.
	; E.G.  New Project or the Bullet and Number/create dialogue.
	; Don't read the highlighted text in the list box control
	Return
	EndIf
EndIf
; This next test avoids the contents of a listbox being repeated each time the contents of the edit field change in the
;Format/Box Fields dialog, Add new field edit.
if hwnd!=globalFocusWindow && getWindowSubtypeCode(globalFocusWindow)==wt_edit then
	return
endIf
SayHighlightedText (hwnd, buffer)
EndFunction

Script  ScriptFileName()
If UserBufferIsActive ()then
	SayFormattedMessage (ot_user_requested_information, cMsgVirtualViewerSettings)
	Return
EndIf
ScriptAndAppNames(msgAppName)
EndScript

Script ScreenSensitiveHelp ()
var
string sClass,
handle hFocus,
string sRealName,
int iControlId

If (IsSameScript ()) then
	; Use the constant definition in HjHelp.jsh for your application
	AppFileTopic (0)
	return
endIf
if not isPCCursor() then
	performScript screenSensitiveHelp()
	return
endIf
let hFocus=getFocus()
let iControlId=getControlId(hFocus)
let sClass=getWindowClass(hFocus)
let sRealName=getWindowName(getRealWindow(hFocus))
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
 	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if sClass==wc_bitmapButton then
	SayFormattedMessage(ot_User_Buffer, PRMsgBitmapBtnHelp1_L, PRMsgBitmapBtnHelp1_S)
elif sClass==wc_glb then
	SayFormattedMessage(ot_User_Buffer, PRMsgGLBHelp1_L, PRMsgGLBHelp1_S)
elif sClass==wc_slideShowRunning then
	SayFormattedMessage(ot_User_Buffer, PRMsgSlideShowRunning1_L, PRMsgSlideShowRunning1_S)
elif isNavigationMode() then
	SayFormattedMessage(ot_User_Buffer, formatString(PRMsgScreenSensitiveHelp1_L, getCurrentView(), getCurrentDrawingToolDesc(), intToString(getSlideObjectCount())), formatString(PRMsgScreenSensitiveHelp1_S, getCurrentView(), getCurrentDrawingToolDesc(), intToString(getSlideObjectCount())))
	if doesSlideHaveSpeakerNotes() then
		SayFormattedMessage(ot_User_Buffer, PRMsgHasNotes_L, PRMsgHasNotes_S)
	endIf
elif isSlideSorter() then
	SayFormattedMessage(ot_User_Buffer, formatString(PRMsgScreenSensitiveHelp2_L, getCurrentView(), intToString(getSlideCount())), formatString(PRMsgScreenSensitiveHelp2_S, getCurrentView(), intToString(getSlideCount())))
	if doesSlideHaveSpeakerNotes() then
		SayFormattedMessage(ot_User_Buffer, PRMsgHasNotes_L, PRMsgHasNotes_S)
	endIf
elif isTextEditMode() then
	SayFormattedMessage(ot_User_Buffer, formatString(PRMsgScreenSensitiveHelp3_L, getCurrentView()), formatString(PRMsgScreenSensitiveHelp3_S, getCurrentView()))
	if isSlideLayer() then
		SayFormattedMessage(ot_User_Buffer, PRMsgExitEdit_L, PRMsgExitEdit_S)
	endIf
elif isCreaterTool() then
	SayFormattedMessage(ot_User_Buffer, formatString(PRMsgScreenSensitiveHelp4_L, getCurrentView(), getCurrentDrawingToolDesc()), formatString(PRMsgScreenSensitiveHelp4_S, getCurrentView(), getCurrentDrawingToolDesc()))sayCurrentView()
elif getCurrentMode() then
	SayFormattedMessage(ot_User_Buffer, formatString(PRMsgScreenSensitiveHelp5_L, getCurrentView()), formatString(PRMsgScreenSensitiveHelp5_S, getCurrentview()))
elif getWindowTypeCode(getCurrentWindow())==wt_edit && getWindowClass(getParent(getCurrentWindow()))==wc_spinEdit then
	screenSensitiveHelpForKnownClasses(wt_spinbox)
else
	performScript screenSensitiveHelp() ; default
	if getWindowTypeCode(globalFocusWindow)==wt_edit && getWindowClass(getParent(globalFocusWindow))==wc_buttonEdit then
		SayFormattedMessage(ot_User_Buffer, PRMsgEditWithButton_L, PRMsgEditWithButton_S)
	endIf
endIf
endScript

Script HotKeyHelp ()
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
	SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
If (DialogActive ()) then
	SayFormattedMessage(OT_User_Buffer, msgExtendedHelp_L, msgExtendedHelp_S )
	return
endIf
SayFormattedMessage(ot_User_Buffer, PRMsgHotkeyHelp1_L, PRMsgHotkeyHelp1_S)
EndScript

Script SayWindowPromptAndText ()
var
	handle hwnd,
	int iSubType,
	int nMode
let hwnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
If UserBufferIsActive () then
	If ! iSubType then
		SayFormattedMessage (ot_user_requested_information, cmsgVirtualViewer)
		Return
	EndIf
EndIf
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
If (! HandleCustomWindows (hwnd)) then
	SayWindowTypeAndText (hWnd)
	SayTutorialHelp (iSubType, TRUE)
	SayTutorialHelpHotKey (hWnd, TRUE)
	IndicateComputerBraille (hwnd)
Else
	SayTutorialHelp (iSubType, TRUE)
	SayTutorialHelpHotKey (hWnd, TRUE)
	IndicateComputerBraille (hwnd)
endIf
smmToggleTrainingMode(nMode)
EndScript

Script ToolbarList ()
var
	int nIncludeGraphics,
	int nIndex,
int nRowToClick,
int nColToClick
if inHJDialog() then
	SayFormattedMessage(ot_error, cMsg337_L, cMsg337_S)
		return
		endIf
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
If (DialogActive ()) then
	SayFormattedMessage (ot_error, msgToolbarListError1_l) ; "You must exit the current dialog in order to access the toolbar"
	return
endIf
let nIncludeGraphics = GetJcfOption(OPT_INCLUDE_GRAPHICS)
SetJcfOption (OPT_INCLUDE_GRAPHICS, 1) ; labeld graphics only
let g_strGraphicsList = cscNULL
let g_strGraphicsListX = cscNULL
let g_strGraphicsListY = cscNull

GraphicsEnumerate(GetAppMainWindow(GetFocus()),"GraphicsListHelper")
SetJcfOption (OPT_INCLUDE_GRAPHICS, nIncludeGraphics)
if  !(g_strGraphicsList) then
	SayFormattedMessage (ot_error, msgToolbarListError2_l) ; "Toolbar not found"
	return
endIf
let g_strGraphicsListX = StringChopLeft (g_strGraphicsListX, 1)
let g_strGraphicsListy = StringChopLeft (g_strGraphicsListy, 1)
let nIndex = DlgSelectItemInList (g_strGraphicsList,msgListName, true)
If (nIndex != 0) then
	let nSuppressEcho = on
let nRowToClick =
StringToInt(StringSegment(g_strGraphicsListX,"\007",nIndex))
let nColToClick =
StringToInt(StringSegment(g_strGraphicsListY,"\007",nIndex))
SaveCursor()
JAWSCursor()
MoveTo(nColToClick,nRowToClick)
LeftMouseButton()
	RestoreCursor ()
	let nSuppressEcho = off
endIf
EndScript

script sayNextCharacter()
var
string sClass
If IsVirtualPCCursor ()  && UserBufferIsActive () Then
	NextCharacter ()
	SayCharacter ()
	return
Elif not isPcCursor() then
	performScript sayNextCharacter()
	return
endIf
let sClass=getWindowClass(getFocus())
if sClass==wc_glb then
	nextCharacter()
	GLBFocusRead()
elif sClass==wc_slideShowRunning then
	nextCharacter()
elif isSlideSorter() then
	nextCharacter()
	SaySlideSorterFocus()
elif isCreaterTool() && not isKeyWaiting() then
	nextCharacter()
	sayPointerX()
else
	performScript sayNextCharacter()
endIf
endScript

script sayPriorCharacter()
var
string sClass
If IsVirtualPCCursor ()  && UserBufferIsActive () Then
	PriorCharacter ()
	SayCharacter ()
	return
Elif not isPcCursor() then
	performScript sayPriorCharacter()
	return
endIf
let sClass=getWindowClass(getFocus())
if sClass==wc_glb then
	priorCharacter()
	GLBFocusRead()
elif sClass==wc_slideShowRunning then
	priorCharacter()
elif isSlideSorter() then
	priorCharacter()
	SaySlideSorterFocus()
elif isCreaterTool() && not isKeyWaiting() then
	PriorCharacter()
	sayPointerX()
else
	performScript sayPriorCharacter()
endIf
endScript

script sayPriorLine()
var
string sClass
If IsVirtualPCCursor ()  && UserBufferIsActive () Then
	PriorLine ()
	SayLine ()
	return
Elif not isPcCursor() then
	performScript sayPriorLine()
	return
endIf
let sClass=getWindowClass(getFocus())
if sClass==wc_glb then
	priorLine()
	GLBFocusRead()
elif sClass==wc_slideShowRunning then
	priorLine()
elif isSlideSorter() then
	priorLine()
	SaySlideSorterFocus()
elif isCreaterTool() && not isKeyWaiting() then
	priorLine()
	sayPointerY()
else
	performScript sayPriorLine()
endIf
endScript

script sayNextLine()
var
string sClass
If IsVirtualPCCursor ()  && UserBufferIsActive () Then
	NextLine ()
	SayLine ()
	return
Elif not isPcCursor() then
	performScript sayNextLine()
	return
endIf
let sClass=getWindowClass(getFocus())
if sClass==wc_glb then
	nextLine()
	GLBFocusRead()
elif sClass==wc_slideShowRunning then
	nextLine()
elif isSlideSorter() then
	nextLine()
	SaySlideSorterFocus()
elif isCreaterTool() && not isKeyWaiting() then
	NextLine()
	sayPointerY()
else
	performScript sayNextLine()
endIf
endScript

script sayCharacter()
var
string sClass

if IsVirtualPCCursor () && UserBufferIsActive () then
	SayCharacter ()
	Return
ElIf Not IsPcCursor () Then
performScript sayCharacter()
	return
endIf
let sClass=getWindowClass(getFocus())
if sClass==wc_bitmapButton || sClass==wc_slideShowRunning then
	handleCustomWindows(getCurrentWindow())
	return
elif sClass==wc_glb then
	glbFocusRead()
	return
elif isSlideLayer() then
	sayFocusedSlideObject()
elif isLayoutLayer() then
	sayFocusedObjectName()
elif isSlideSorter() then
	SaySlideSorterFocus()
else
	performScript sayCharacter()
endIf
endScript

script sayWord()
var
string sClass
let sClass=getWindowClass(getCurrentWindow())
if sClass==wc_bitmapButton || sClass==wc_slideShowRunning then
	handleCustomWindows(getCurrentWindow())
	return
elif sClass==wc_glb then
	glbFocusRead()
	return
elif not isPcCursor() then
	performScript sayWord()
	return
endIf
if isSlideLayer() then
	sayFocusedSlideObject()
elif isLayoutLayer() then
	sayFocusedObjectName()
elif isSlideSorter() then
	SaySlideSorterFocus()
else
	performScript sayWord()
endIf
endScript

script sayLine()
var
string sClass
If IsSameScript () then
	SpellLine ()
	Return;
EndIf
let sClass=getWindowClass(getCurrentWindow())
If not IsPCCursor () && UserBufferIsActive () Then
	SayLine ()
	return
Elif sClass==wc_bitmapButton || sClass==wc_slideShowRunning then
	handleCustomWindows(getCurrentWindow())
	return
elif sClass==wc_glb then
	glbFocusRead()
	return
elif not isPcCursor() then
	performScript sayLine()
	return
endIf
if isSlideLayer() then
	sayFocusedSlideObject()
elif isLayoutLayer() then
	sayFocusedObjectName()
elif isSlideSorter() then
	SaySlideSorterFocus()
else
	performScript sayLine()
endIf
endScript

script tab()
If UserBufferIsActive () Then
	UserBufferDeactivate ()
EndIf
if isNavigationMode() then
	tabKey()
	pause()
	sayFocusedSlideObject()
else
	performScript tab() ; default
endIf
endScript

script shiftTab()
If UserBufferIsActive () Then
	UserBufferDeactivate ()
EndIf

if isNavigationMode() then
	shiftTabKey()
	pause()
	sayFocusedSlideObject()
else
	performScript shiftTab() ; default
endIf
endScript


script sayAll()
if isNavigationMode() then
	saySlideText()
else
	PerformScript sayAll()
endIf
endScript

Script nextSlide ()
if isNavigationMode() then
	typeCurrentScriptKey()
	pause()
	SayFormattedMessage(ot_help, formatString(PRMsgSlideIndex, intToString(getSlideNumber()), intToString(getSlideCount())))
	saySlideTitle()
else
	performScript JAWSPageDown()
endIf
EndScript

Script priorSlide ()
if isNavigationMode() then
	typeCurrentScriptKey()
	pause()
	SayFormattedMessage(ot_help, formatString(PRMsgSlideIndex, intToString(getSlideNumber()), intToString(getSlideCount())))
	saySlideTitle()
else
	performScript JAWSPageUp()
endIf
EndScript

Script sayObjectDimensionsAndLocation ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
sayFocusedObjectName()
sayFocusedObjectDimensions()
sayFocusedObjectTopLeft()
EndScript

Script readSpeakerNotes ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
SayFormattedMessage(ot_JAWS_message, formatString(PRMsgSpeakerNotesFor_L, getSlideTitle()), formatString(PRMsgSpeakerNotesFor_S, getSlideTitle()))
readSpeakerNotes()
EndScript

Script deleteObject ()
var
int iPriorObjectCount,
int iPriorSlideCount
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
If isNavigationMode() then
	let iPriorObjectCount=getSlideObjectCount()
	typeKey(ksDelete)
	pause()
	if iPriorObjectCount > getSlideObjectCount() then
		SayFormattedMessage(Ot_JAWS_message, PRMsgObjectDeleted, PRMsgDeleted)
	endIf
else
	performScript JAWSDelete()
endIf
EndScript

Script SaySlideInfo ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	Return
EndIf
SayFormattedMessage(ot_help, formatString(PRMsgSlide, intToString(getSlideNumber())))
saySlideTitle()
saySlideLayoutTitle()
saySlideBackgroundTitle()
saySlideObjectCount()
if doesSlideHaveSpeakerNotes() then
	SayFormattedMessage(ot_help, PRMsgHasNotes_L, PRMsgHasNotes_S)
endIf
 EndScript

handle function getRealWindow(handle hwnd)
if getWindowClass(getParent(hwnd))==wc_PRglb then
	return getRealWindow(getParent(hwnd))
else
	return getRealWindow(hwnd)
endIf
endFunction

script windowKeysHelp()
If UserBufferIsActive () then
 UserBufferDeactivate ()
 SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
 UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
 Return
EndIf
SayFormattedMessage (Ot_User_Buffer, msgWKeysHelp1_l, msgWKeysHelp1_s)
UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
endScript

Script sayCurrentTool ()
If UserBufferIsActive () Then
	SayFormattedMessage (OT_ERROR, FormatString (msgVirtualError_l, GetCurrentScriptKeyName ()), cmsgSilent)
	return
EndIf
sayCurrentDrawingTool()
EndScript

Script upALevel ()
performScript upALevel()
if not dialogActive() && not menusActive() then
	if hasDrawingToolChanged() then
		sayCurrentDrawingTool()
	endIf
endIf
EndScript

Script AdjustJAWSVerbosity ()
var
	String list,
string sPriorUnitsOfMeasure

if InHJDialog () then
	SayFormattedMessage(ot_error, cMsg337_L, cMsg337_S)
	return
endIf
let sPriorUnitsOfMeasure=gsUnitsOfMeasure
if (IsSpeechOff ()) then
	PerformScript MuteSynthesizer()
	return
endIf
If (IsVirtualPCCursor ()) Then
	let list = cStrDefaultHTMLList()+cStrDefaultList()
Else
	let list = cStrPrwin9VerbosityItems+cStrDefaultList()
endIf
DlgSelectFunctionToRun (list, AdjustJAWSVerbosityDialogName, false)
if sPriorUnitsOfMeasure!=gsUnitsOfMeasure then
; Units of Measure have changed, save new setting
	if IniWriteString (Section_ApplicationVerbositySettings, Key_UnitsOfMeasure, gsUnitsOfMeasure, PRJSIName) then
		SayFormattedMessage(ot_JAWS_message, PRMsgAppSettingsSaved_L, PRMsgAppSettingsSaved_S)
	else
		SayFormattedMessage(ot_error, PRMsgAppSettingsNotSaved_L, PRMsgAppSettingsNotSaved_S)
	endIf
endIf
EndScript

   string function toggleUnitsOfMeasure (int iRetCurVal)
if not iRetCurVal then
	;update the value
	if gsUnitsOfMeasure==PRMeasurePoints then
		let gsUnitsOfMeasure=PRMeasureWPUnits
	else
		let GsUnitsOfMeasure=PRMeasurePoints
	endIf
EndIf
if gsUnitsOfMeasure==PRMeasurePoints then
	return PRMsgUnitPoints_S
else
	return PRMsgUnitWPUnits_S
endIf
EndFunction

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	int iCreaterToolActive,
	int nState
if !UserBufferIsActive()
&& KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	let iCreaterToolActive=isCreaterTool()
	if iCreaterToolActive then
		delay(3)
		; must detect if a dialog has become active, eg chart type dialog
		if !dialogActive() then
			if !isCreaterTool() then
				; have dropped an object
				sayFocusedSlideObject()
				SayFormattedMessage(ot_JAWS_message,PRMsgObjInserted_L,PRMsgObjInserted_S)
				sayCurrentDrawingTool()
			endIf
		endIf
		return true
	endIf
	if GetObjectTypeCode()==WT_LISTBOX then
		Delay(1)
		let nState = GetControlAttributes()
		If nState& CTRL_CHECKED then
			SayMessage (ot_ITEM_STATE, cmsg_Checked)
		ElIf nState& CTRL_UNCHECKED then
			SayMessage (ot_item_state, cmsg_notChecked) ; not checked
		endIf
		return true
	endIf
endIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Int Function isWritingToolsActive ()
return FindTopLevelWindow (wc_writingToolsDlg, wn_writingTools)
EndFunction

Script readMisspelledAndSuggestion ()
var
handle hWritingTools,
handle hNotFoundPrompt
let hWritingTools=FindTopLevelWindow (wc_writingToolsDlg, wn_writingTools)
if hWritingTools then
	if isSameScript() then
		setFocus(getFirstChild(GetFirstChild(hWritingTools)))
		return
	endIf
	let hNotFoundPrompt=FindDescendantWindow (hWritingTools, cId_notFoundPrompt)
	sayWindow(hNotFoundPrompt,read_everything)
	sayWindow(FindDescendantWindow (hWritingTools, cId_notFoundEdit),read_everything)
	if getWindowName(hNotFoundPrompt)==wn_paused || getWindowName(hNotFoundPrompt)==wn_ready then
		return
		endIf
	spellString(getWindowText(FindDescendantWindow (hWritingTools, cId_notFoundEdit),read_everything))
	sayWindow(FindDescendantWindow (hWritingTools, cId_replaceWithPrompt),read_everything)
	sayWindow(FindDescendantWindow (hWritingTools, cId_replaceWithEdit),read_everything)
	spellString(getWindowText(FindDescendantWindow (hWritingTools, cId_replaceWithEdit),read_everything))
else
; not active
	SayFormattedMessage(ot_error, PRMsgWritingToolsNotVisible_L, PRMsgWritingToolsNotVisible_S)
endIf
EndScript

Script SetFocusWritingTools ()
If isWritingToolsActive () && (GetWindowClass (GlobalFocusWindow) == "PR_TEXTTOOL.18") Then
SetFocus (FindDescendantWindow (isWritingToolsActive (), cId_WritingToolTabStrip))
EndIf
EndScript

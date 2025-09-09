; Copyright 1995-2021 Freedom Scientific, Inc.
; JAWS 8.0.xx scripts for Microsoft Visual Basic 6.0 Environment


include "hjHelp.jsh"
include "hjconst.jsh"
include "hjglobal.jsh"
include "Visual Basic 6.jsh"
include "Visual Basic 6.jsm"
include "common.jsm"
use "vbfunc.jsb"


void function autoStartEvent()
if globalVB6HasRunBefore==false then
	;SayFormattedMessage (ot_app_start, msgAppStart1_L, msgAppStart1_S)
	let globalVB6HasRunBefore=true
endIf
loadApplicationSettings()
endFunction

void function autoFinishEvent ()
SetBrailleRestriction (giDefaultBrlCursorRestriction)
endFunction

Function initializeApplicationSettings ()
; The following line determines if overlapping controls will be detected during form design
let globalDetectOverlappingControls=true
; The following global determines if the whole line of code is read even when not visible
let globalReadWholeCodeLine=true
; The next global sets the default unit to move a control by when using VBA and the Alt+Shift+arrows
let globalControlMovementUnit=20
EndFunction

Script selectToolboxControl ()
if InHJDialog () then
	SayFormattedMessage (ot_error, cMSG337_L)
	return
endIf
selectToolboxControl()
EndScript

Script sayWindowPromptAndText ()
var
	handle hWnd,
	int iSubType,
	int nMode
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
if inAppWizard() then
	speakWizardTextAndFocus()
	SayTutorialHelp (iSubType, TRUE)
	SayTutorialHelpHotKey (hWnd, TRUE)
	IndicateComputerBraille (hwnd)
else
	sayFocusedWindow()
	IndicateComputerBraille (hwnd)
endIf
smmToggleTrainingMode(nMode)
EndScript

Script setFocusToFormControl ()
if InHJDialog () then
	SayFormattedMessage (ot_error, cMSG337_L)
		return
endIf
setFocusToFormControl()
EndScript

Script sayNextWord ()
if isMSFormDesigner() then
	moveMSFormControlRight(1)
elif isVBFormDesigner() then
	typeCurrentScriptKey()
	pause()
	sayActiveControlLeft()
	testActiveControlOverlap()
else
	performScript sayNextWord() ; default
endIf
EndScript

Script mouseRight ()
if not isPcCursor() then
	mouseRight(globalMousePixel)
	return
endIf
if isMSFormDesigner() then
	moveMsFormControlRight(globalControlMovementUnit)
endIf
EndScript

Script sayPriorWord ()
if isMSFormDesigner() then
	moveMSFormControlLeft(1)
elif isVBFormDesigner() then
	typeCurrentScriptKey()
	pause()
	sayActiveControlLeft()
	testActiveControlOverlap()
else
	performScript sayPriorWord() ; default
endIf
EndScript

Script mouseLeft ()
if not isPcCursor() then
	mouseLeft(globalMousePixel)
	return
endIf
if isMSFormDesigner() then
	moveMsFormControlLeft(globalControlMovementUnit)
endIf
EndScript

Script sayPriorParagraph ()
if isMSFormDesigner() then
	moveMsFormControlUp(1)
elif isVBFormDesigner() then
	typeCurrentScriptKey()
	pause()
	sayActiveControlTop()
	testActiveControlOverlap()
else
	typeCurrentScriptKey()
	pause()
	if isCodeWindow() then
		sayCurrentProcedureName ()
	endIf
endIf
EndScript

Script mouseUp()
if not isPcCursor() then
	mouseUp(globalMousePixel)
	return
endIf
if isMSFormDesigner() then
	moveMsFormControlUp(globalControlMovementUnit)
endIf
EndScript

Script sayNextParagraph ()
if isMSFormDesigner() then
	moveMsFormControlDown(1)
elif isVBFormDesigner() then
	typeCurrentScriptKey()
	pause()
	sayActiveControlTop()
	testActiveControlOverlap()
else
	typeCurrentScriptKey()
	pause()
	if isCodeWindow() then
		sayCurrentProcedureName ()
	endIf
endIf
EndScript

Script mouseDown ()
if not isPcCursor() then
	mouseDown(globalMousePixel)
	return
endIf
if isMSFormDesigner() then
	moveMsFormControlDown(globalControlMovementUnit)
endIf
EndScript

Script sayContextInfo ()
if isSameScript() then
	readComponentProperties()
	return
endIf
if (isMSFormDesigner() || isVBFormDesigner()) then
	sayActiveControlDimensions()
	sayActiveFormDimensions()
	sayActiveFormType()
elif isCodeWindow() then
	sayCodeCursorLocation ()
	if isCursorInProcedure () then
		SayFormattedMessage (ot_help, formatString(msgCodeWindowHelp3_L, getCurrentProcedureName(), intToString(getProcLineCount())), formatString(msgCodeWindowHelp3_S, getCurrentProcedureName(), intToString(getProcLineCount())))
	endIf
	sayModuleMemberCount()
	sayDeclarationLineCount()
	sayCodeLineCount()
else
	sayObjectTypeAndText()
endIf
EndScript

Script tabKey ()
var
	string partialStatement,
	string completedStatement
let focusChangeTriggered=false
sayCurrentScriptKeyLabel()
if isMSFormDesigner() then
	setFocusToNextControl()
	pause()
	if not focusChangeTriggered then
		sayActiveControl()
	endIf
	if formContainsSelectedControls () then
		sayActiveControlLeft()
		sayActiveControlTop()
		testActiveControlOverlap()
	endIf
elif isVBFormDesigner() then
	tabKey()
	pause()
	if not focusChangeTriggered then
		sayActiveControl()
	endIf
	if formContainsSelectedControls () then
		sayActiveControlLeft()
		sayActiveControlTop()
		testActiveControlOverlap()
	endIf
elif isCodeWindow() then
	; handle autoCompletion
	let partialStatement=stringLower(getChunk())
	typeCurrentScriptKey()
	delay(1)
	let completedStatement=stringLower(getChunk())
	if stringContains(completedStatement,partialStatement) && stringLength(completedStatement) > stringLength(partialStatement) then
		sayUsingVoice(vctx_message,msgCompleted1_L,ot_field)
	endIf
else
	tabKey()
endIf
EndScript

Script shiftTabKey ()
let focusChangeTriggered=false
sayCurrentScriptKeyLabel()
if isMSFormDesigner() then
	setFocusToPriorControl()
	pause()
	if not focusChangeTriggered then
		sayActiveControl()
	endIf
	if formContainsSelectedControls () then
		sayActiveControlLeft()
		sayActiveControlTop()
		testActiveControlOverlap()
	endIf
elif isVBFormDesigner() then
	shiftTabKey()
	pause()
	if not focusChangeTriggered then
		sayActiveControl()
	endIf
	if formContainsSelectedControls () then
		sayActiveControlLeft()
		sayActiveControlTop()
		testActiveControlOverlap()
	endIf
else
	shiftTabKey()
endIf
EndScript

Script topOfFile ()
if isMSFormDesigner() then
	setFocusToFirstControl()
else
	performScript topOfFile()
endIf
EndScript

Script bottomOfFile ()
if isMSFormDesigner() then
	setFocusToLastControl()
else
	performScript bottomOfFile()
endIf
EndScript

void function downLines(int num)
var
	int i
let i=1
while i <=num
	nextLine()
	let i=i+1
endWhile
endFunction

void Function speakWizardTextAndFocus()
var
	int controlId,
	string wizardScreenTitle,
	handle focus,
	handle realWindow,
	int restriction,
	int TopX,
	int TopY,
	int BottomX,
	int BottomY
let focus=getFocus()
let realWindow=getRealWindow(focus)
let wizardScreenTitle=getWindowName(getForegroundWindow())
let controlId=getControlId(focus)
let TopX=getWindowLeft(realWindow)
let TopY=getWindowTop(realWindow)
let BottomX=getWindowRight(realWindow)
let BottomY=getWindowBottom(realWindow)
; first speak wizard text if the output type is allows to speak
if shouldItemSpeak(ot_dialog_text) then
	saveCursor()
	invisibleCursor()
	routeInvisibleToPc()
	let restriction=getRestriction()
	setRestriction(restrictRealWindow)
	if GlobalPriorWizardScreenTitle==wizardScreenTitle then
; we don't want to repeat the wizard text
; just do nothing here.
	elif stringContains(wizardScreenTitle,wn_appWizIntro) then
		JAWSPageUp()
		JAWSHome()
		let TopY=getCursorRow()
		downLines(4)
		let BottomY=getCursorRow()
		say(getTextInRect(TopX,TopY,BottomX,BottomY),ot_field)
	elif stringContains(wizardScreenTitle,wn_appWizInterfaceType) then
		JAWSPageUp()
		JAWSHome()
		nextLine()
		sayLine()
	elif stringContains(wizardScreenTitle,wn_appWizMenus) then
		JAWSPageUp()
		JAWSHome()
		let topY=getCursorRow()
		downLines(4)
		let bottomY=getCursorRow()
		say(getTextInRect(topX,topY,bottomX,bottomY),ot_field)
	elif stringContains(wizardScreenTitle,wn_appWizToolbarCustomize) then
		JAWSPageUp()
		JAWSHome()
		let topY=getCursorRow()
		downLines(3)
		let bottomY=getCursorRow()
		say(getTextInRect(topX,topY,bottomX,bottomY),ot_field)
	elif stringContains(wizardScreenTitle,wn_appWizResources) then
		JAWSPageUp()
		JAWSHome()
		let topY=getCursorRow()
		downLines(8)
		let bottomY=getCursorRow()
		say(getTextInRect(topX,topY,bottomX,bottomY),ot_field)
	elif stringContains(wizardScreenTitle,wn_appWizINet) then
		JAWSPageUp()
		JAWSHome()
		let topY=getCursorRow()
		downLines(2)
		let bottomY=getCursorRow()
		say(getTextInRect(topX,topY,bottomX,bottomY),ot_field)
; now speak the text to the left of the checkboxes
		nextLine()
		JAWSHome()
		sayChunk()
		nextLine()
		sayChunk()
		nextLine()
		sayChunk()
; Now speak the text at the bottom of the window
		nextLine()
		let topY=getCursorRow()
		let topX=getWindowLeft(realWindow)
		let bottomX=GetWindowRight(realWindow)
		downLines(3)
		let bottomY=getcursorRow()
		say(getTextInRect(topX,topY,bottomX,bottomY),ot_field)
	elif stringContains(wizardScreenTitle,wn_appWizStandardForms) then
		JAWSPageUp()
		JAWSHome()
		let topY=getCursorRow()
		downLines(2)
		let bottomY=getCursorRow()
		say(getTextInRect(topX,topY,bottomX,bottomY),ot_field)
	elif stringContains(wizardScreenTitle,wn_appWizDataAccess) then
		JAWSPageUp()
		JAWSHome()
		let topY=getCursorRow()
		downLines(2)
		let bottomY=getCursorRow()
		say(getTextInRect(topX,topY,bottomX,bottomY),ot_field)
	elif stringContains(wizardScreenTitle,wn_appWizFinished) then
		JAWSPageUp()
		JAWSHome()
		let topY=getCursorRow()
		downLines(2)
		let bottomY=getCursorRow()
		say(getTextInRect(topX,topY,bottomX,bottomY),ot_field)
		downLines(3)
		sayLine() ; speak the line about how to get a summary report of the wizard's actions
	endIf
	setRestriction(restriction)
	restoreCursor()
endIf
; now handle wizard controls which do not have prompts
if stringContains(wizardScreenTitle,wn_appWizIntro) then
	if controlId==cId_OpenProfile then
		;SayFormattedMessage (ot_control_name, msgOpenProfile1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
			IndicateControlType (GetObjectTypeCode (), msgOpenProfile1_L)
		return
	endIf
elif stringContains(wizardScreenTitle,wn_appWizInterfaceType) then
	if controlId==cId_Mdi || controlId==cId_sdi || controlId==cId_explorer then
		sayObjectTypeAndText()
		if shouldItemSpeak(ot_control_name) then
			saveCursor()
			invisibleCursor()
			routeInvisibleToPc()
			JAWSPageUp()
			JAWSHome()
			nextLine()
			nextLine()
			nextWord()
			let topX=getCursorCol()
			let topY=getCursorRow()
			nextLine()
			nextLine()
			nextLine()
			nextChunk()
			let bottomX=getCursorCol()
			let bottomY=getCursorRow()
			say(getTextInRect(topX,topY,bottomX,bottomY),ot_field)
			restoreCursor()
		endIf
		return
	endIf
elif stringContains(wizardScreenTitle,wn_appWizMenus) then
; we will say the object name and type and return for each of these
; controls rather than letting the sayObjectTypeAndText do it later
; This is because the label will be repeated
; but the graphic label is incomplete as it labels a graphic which is used elsewhere
	if controlId==cId_menuAdd then
		;SayFormattedMessage (ot_control_name, msgTopLevelMenuAdd1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
			IndicateControlType (GetObjectTypeCode (), msgTopLevelMenuAdd1_L)
		return
	elif controlId==cId_menuDel then
		;SayFormattedMessage (ot_control_name, msgTopLevelMenuDel1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgTopLevelMenuDel1_L)
		return
	elif controlId==cId_menuUp then
		;SayFormattedMessage (ot_control_name, msgTopLevelMenuUp1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgTopLevelMenuUp1_L)
		return
	elif controlId==cId_menuDown then
		;SayFormattedMessage (ot_control_name, msgTopLevelMenuDown1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgTopLevelMenuDown1_L)
		return
	elif controlId==cId_submenuAdd then
		;SayFormattedMessage (ot_control_name, msgSubmenuAdd1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgSubmenuAdd1_L)
		return
	elif controlId==cId_submenuDel then
		;SayFormattedMessage (ot_control_name, msgSubMenuDel1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgSubMenuDel1_L)
		return
	elif controlId==cId_submenuUp then
		;SayFormattedMessage (ot_control_name, msgSubmenuUp1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgSubmenuUp1_L)
		return
	elif controlId==cId_submenuDown then
		;SayFormattedMessage (ot_control_name, msgSubmenuDown1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgSubmenuDown1_L)
		return
	endIf
elif stringContains(wizardScreenTitle,wn_appWizINet) then
	if controlId==cId_yesCheckbox || controlId==cId_noCheckbox then
		if shouldItemSpeak(ot_control_name) then
			saveCursor()
			invisibleCursor()
			routeInvisibleToPc()
			JAWSPageUp()
			downLines(3)
			priorChunk()
		nextChunk()
			priorLine()
			let topX=getcursorCol()
			let topY=getCursorRow()
			let bottomX=getWindowRight(realWindow)
			downLines(2)
			let bottomY=getCursorRow()
			restoreCursor()
			say(getTextInRect(topX,topY,bottomX,bottomY),ot_field)
		endIf
	endIf
elif stringContains(wizardScreenTitle,wn_appWizStandardForms) then
	if controlId==cId_formTemplates then
		if shouldItemSpeak(ot_control_name) then
			saveCursor()
			invisibleCursor()
			routeInvisibleToPc()
			priorLine()
			sayLine()
			restoreCursor()
		endIf
	endIf
elif stringContains(wizardScreenTitle,wn_appWizFinished) then
; there are two buttons with control id of 1, the save profile button and
;the print report button.
	if controlId==cId_saveProfile && getWindowTypeCode(getNextWindow(focus))==wt_combobox then
		;SayFormattedMessage (ot_control_name, msgSaveProfile1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (WT_EDIT, msgSaveProfile1_L)
		return
	endIf
elif stringContains(wizardScreenTitle,wn_wizardManager) then
	if controlId==cId_wizTmpMoveAllStepsOffScreen then
		;SayFormattedMessage (ot_control_name, msgWizTmpMoveAllStepsOffScreen1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgWizTmpMoveAllStepsOffScreen1_L)
		return
	elif controlId==cId_wizTmpAddStep then
		;SayFormattedMessage (ot_control_name, msgWizTmpAddStep1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgWizTmpAddStep1_L)
		return
	elif controlId==cId_wizTmpInsertStep then
		;SayFormattedMessage (ot_control_name, msgWizTmpInsertStep1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgWizTmpInsertStep1_L)
		return
	elif controlId==cId_wizTmpRefreshListOfSteps then
		;SayFormattedMessage (ot_control_name, msgWizTmpRefreshListOfSteps1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgWizTmpRefreshListOfSteps1_L)
		return
	elif controlId==cId_wizTmpMoveStepDown then
		;SayFormattedMessage (ot_control_name, msgWizTmpMoveStepDown1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgWizTmpMoveStepDown1_L)
		return
	elif controlId==cId_wizTmpMoveStepUp then
		;SayFormattedMessage (ot_control_name, msgWizTmpMoveStepUp1_L)
		;SayFormattedMessage(ot_control_type,getObjectType())
		IndicateControlType (GetObjectTypeCode (), msgWizTmpMoveStepUp1_L)
		return
	endIf
endIf
sayObjectTypeAndText()
endFunction

int Function inAppWizard ()
var
	handle foregroundWindow
let foregroundWindow=getForegroundWindow()
if getWindowClass(foregroundWindow)==wc_thunderFormDC && stringContains(getWindowName(foregroundWindow),wn_wizard) then
	return true
else
	return false
endIf
EndFunction

Void Function sayFocusedWindow ()
var
	int controlId,
	string realWindowName,
	handle focus,
	handle realWindow
setAppObject()
let focus=getFocus()
let realWindow=getRealWindow(focus)
let realWindowName=getWindowName(RealWindow)
let controlId=getControlId(focus)
let globalDesignerActive=false
let globalCodeWindowActive=false
if inAppWizard() then
; handled elsewhere
	return
endIf
if isMSFormDesigner() || isVBFormDesigner() then
let globalDesignerActive=true
	sayActiveFormName()
	sayActiveControl()
	if formContainsSelectedControls () then
		sayActiveControlLeft()
		sayActiveControlTop()
		testActiveControlOverlap()
	endIf
elif isActiveXDesigner() && isAddinDesigner() then
	if getWindowTypeCode(getFocus())==wt_unknown then
; There are two non-focusable controls which we must tab passed when initially setting focus on the Addin Designer.
		tabKey()
		tabKey()
		delay(1)
	else
		sayObjectTypeAndText()
	endIf
elif isCodeWindow() then
	if getWindowClass(focus)==wc_vbaWindow then
		let globalCodeWindowActive=true
		sayActiveWindowTypeDesc()
		sayCurrentProcedureName ()
		sayLine()
		return
	elif getWindowTypeCode(focus)==wt_comboBox then
		if ControlId==cId_objectsCombo then
		;SayFormattedMessage(ot_control_name,msgObjectsCombo1)
		IndicateControlType (WT_READONLYEDIT, msgObjectsCombo1)
		; This fixes the problem where you have to press the down arrow twice before you can move through the combo.
		NextLine()
		elif controlId==cId_membersCombo then
		;SayFormattedMessage(ot_control_name,msgMembersCombo1)
		IndicateControlType (WT_READONLYEDIT, msgMembersCombo1)
		endIf
	endIf
	sayObjectTypeAndText()
elif getWindowName(getRealWindow(getFocus()))==wn_menuEditor then
	if getControlId(GetFocus())==cId_MnuEdList then
		saySubMenuLevel()
	endIf
	sayObjectTypeAndText()
elIf StringContains(GetWindowName(GetParent(Focus)),wn_properties)
&& GetWindowSubtypeCode(focus)==wt_comboBox then
	IndicateControlType(wt_combobox,GetObjectValue(),PositionInGroup())
Else
	sayObjectTypeAndText()
endIf
EndFunction

handle Function getPropertiesAndMethodsListHandle ()
return findTopLevelWindow(wc_propertiesAndMethodsList,cscNull)
EndFunction

Void Function sayLine (optional int HighlightTracking, optional int bSayingLineAfterMovement)
var
	handle hwnd,
	handle hFocus
let hFocus=getFocus()
if getWindowClass(hFocus)==wc_thunderRt6Listbox then
	sayLine(HighlightTracking,bSayingLineAfterMovement)
	; attempt to read the checked status of the selected item.
	saveCursor()
	invisibleCursor()
	routeInvisibleToPc()
	priorWord()
	if getCharacterAttributes()==attrib_graphic && getWindowClass(getCurrentWindow())==wc_thunderRT6ListBox then
		sayWord()
	endIf
	restoreCursor()
	return
elif isVBFormDesigner() then
	sayActiveControl()
	testActiveControlOverlap()
	return
elif isCodeWindow() then
; initialize Braille code tracking variables which track suggestions when using autoComplete
	let globalSuggestionCol=0
	let globalSuggestionRow=0
	let globalCodeSuggestion=cscNull
	let hwnd=getPropertiesAndMethodsListHandle()
	if hwnd && isWindowVisible(hwnd) then
		let globalCodeSuggestion=getWindowText(hwnd,read_highlighted)
		saveCursor()
		invisibleCursor()
		if moveToWindow(hwnd) then
			if FindFirstAttribute (attrib_highlight) then
				if getParent(getCurrentWindow())==hwnd then
					; define the row and column to click if the suggestion is activated from the Braille display
					let globalSuggestionCol=getCursorCol()
					let globalSuggestionRow=getCursorRow()
				endIf
			endIf
		endIf
		sayUsingVoice(vctx_message,globalCodeSuggestion, ot_line)
		return
	endIf
	if globalReadWholeCodeLine && not isAppObjectInvalid() then
		readCurrentCodeLine()
		return
	endIf
elif getWindowName(getRealWindow(hFocus))==wn_menuEditor then
	if getControlId(hFocus)==cId_MnuEdList then
		saySubMenuLevel()
	endIf
endIf
sayLine(HighlightTracking,bSayingLineAfterMovement)
EndFunction

Script saySelectedText ()
var
	int winNameLen,
	int selTextLen,
	string WinName,
	string selText
if isCodeWindow() then
	let winName=getWindowName(getRealWindow(getFocus()))
	let selText=getWindowText(getFocus(),read_highlighted)
	let selTextLen=stringLength(selText)
	if stringContains(selText,winName) then
; remove it
		let winNameLen=stringLength(winName)
		let selTextLen=selTextLen-winNameLen
		let selText=stringRight(selText,selTextLen)
	endIf
	SayFormattedMessage (ot_JAWS_message, cmsg39_L) ; selected text is
	say(selText,ot_text)
else
	performScript saySelectedText()
endIf
EndScript

Script ActivatePropertiesAndMethodsList ()
var
	handle hwnd
typeCurrentScriptKey()
pause()
let hwnd=getPropertiesAndMethodsListHandle()
if isCodeWindow() && hwnd then
	SayFormattedMessage (ot_JAWS_message, msgPropertiesAndMethodsList1_L)
	if GetWindowText (hwnd, true) ==cscNull then
		TypeKey (cksDownArrow) ; activate the list.
	endIf
	sayWindow(getPropertiesAndMethodsListHandle(),read_highlighted)
endIf
EndScript

Script activateConstantsList ()
var
	handle hwnd
typeCurrentScriptKey()
pause()
let hwnd=getPropertiesAndMethodsListHandle()
if isCodeWindow() && hwnd then
	SayFormattedMessage (ot_JAWS_message, msgConstantsList1_L)
	if GetWindowText (hwnd, true) ==cscNull then
		typeKey(cksDownArrow) ; activate the list.
	endIf
	sayWindow(getPropertiesAndMethodsListHandle(),read_highlighted)
endIf
EndScript

Script screenSensitiveHelp ()
var
	handle currentWindow,
	string realWindowName,
	string currentWindowName,
	string windowClass,
	int controlId,
	int topLine,
	int lineCount,
	int FormMenuItemCount,
	string sTemp_L,
	string sTemp_S
if (IsSameScript ()) then
	AppFileTopic(topic_Visual_Basic)
	return
endIf
let currentWindow=getCurrentWindow()
let currentWindowName=getWindowName(currentWindow)
let realWindowName=getWindowName(getRealWindow(CurrentWindow))
let windowClass=getWindowClass(currentWindow)
let controlId=getControlId(currentWindow)
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if stringContains(realWindowName,wn_wizard) && windowClass!=wc_thunderForm then
	SayFormattedMessage(OT_USER_BUFFER,formatString(msgWizHlp1_L, realWindowName),formatString(msgWizHlp1_S, realWindowName))
	AddHotKeyLinks ()
elif getWindowName(getParent(getRealWindow(getFocus())))==wn_newProject || realWindowName==wn_newProject then
	SayFormattedMessage(OT_USER_BUFFER,msgNewProjectHelp1_L , msgNewProjectHelp1_S)
	AddHotKeyLinks ()
elif windowClass==wc_toolsPalette then
	SayFormattedMessage (ot_USER_BUFFER, msgToolsPaletteHelp1_L, msgToolsPaletteHelp1_S)
	AddHotKeyLinks ()
elif (isMSFormDesigner() || isVBFormDesigner()) || (isAppObjectInvalid() && windowClass==wc_f3server) then
	let sTemp_L = formatString(msgDesignerWindowHelp1_L, getActiveFormType()) + cScBufferNewLine
	let sTemp_S = formatString(msgDesignerWindowHelp1_S, getActiveFormType()) + cScBufferNewLine
	if !isAppObjectInvalid() then
		let formMenuItemCount=getFormMenuItemCount()
		if FormMenuItemCount then
			let sTemp_L = AddToString(sTemp_L,formatString(msgDesignerWindowHelp6_L, intToString(FormMenuItemCount)) )
			let sTemp_S = AddToString(sTemp_S,formatString(msgDesignerWindowHelp6_S, intToString(FormMenuItemCount)))
		endIf
		let sTemp_L =AddToString(sTemp_L,formatString(msgDesignerWindowHelp2_L, intToString(getFormControlCount())))
		let sTemp_S = AddToString(sTemp_S,formatString(msgDesignerWindowHelp2_S, intToString(getFormControlCount())))
		if formContainsSelectedControls() then
			let sTemp_L = AddToString(sTemp_L,msgDesignerWindowHelp3_L)
			let sTemp_S = AddToString(sTemp_S,msgDesignerWindowHelp3_S)
			sayActiveControl()
		elif getFormControlCount() > 0 then
			let sTemp_L = AddToString(sTemp_L, msgNoControlSelected1_L)
		endIf
		if testActiveControlOverlap() && getVerbosity()==beginner then
			let sTemp_L = AddToString(Stemp_L,msgDesignerWindowHelp4_L)
			let sTemp_S = AddToString(sTemp_S,msgDesignerWindowHelp4_S)
		endIf
	endIf
	if isToolboxVisible() then
		let sTemp_L = AddToString(sTemp_L, msgToolboxVisible1_L)
	endIf
	if isPropertyWindowVisible() then
		let sTemp_L =AddToString(sTemp_L,msgPropertyWindowVisible1_L)
	endIf
	let sTemp_L = AddToString(sTemp_L,msgDesignerWindowHelp5_L)
	let sTemp_S = AddToString(sTemp_S, msgDesignerWindowHelp5_S)
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotKeyLinks ()
elif isInAccessibleDesigner() then
	SayFormattedMessage (ot_USER_BUFFER, msgInAccessibleDesignerHelp1_L, msgInAccessibleDesignerHelp1_S)
	AddHotKeyLinks ()
elif isActiveXDesigner() then
; Try and Determine the Type
	if isAddinDesigner() then
		SayFormattedMessage (ot_USER_BUFFER, msgAddinDesigner1_L, msgAddinDesigner1_S)
		AddHotKeyLinks ()
	elif isDataReportDesigner() then
		SayFormattedMessage (ot_USER_BUFFER, msgDataReportDesignerHelp1_L, msgDataReportDesignerHelp1_S)
		AddHotKeyLinks ()
		return
	else
		SayFormattedMessage (ot_USER_BUFFER, msgActiveXDesignerHelp1_L, msgActiveXDesignerHelp1_S)
		AddHotKeyLinks ()
	endIf
	performScript screenSensitiveHelp() ; default
elif realWindowName==wn_ObjectBrowser then
	if controlId==cId_ObjBrowserLibraries then
		SayFormattedMessage (ot_USER_BUFFER, msgObjBrowserHelp1_L, msgObjBrowserHelp1_S)
		AddHotKeyLinks ()
	elif controlId==cId_objBrowserSearch then
		SayFormattedMessage (ot_USER_BUFFER, msgObjBrowserHelp2_L, msgObjBrowserHelp2_S)
		AddHotKeyLinks ()
	elif controlId==cId_objBrowserClasses then
		SayFormattedMessage (ot_USER_BUFFER, msgObjBrowserHelp3_L, msgObjBrowserHelp3_S)
		AddHotKeyLinks ()
	elif controlId==cId_objBrowserMembers then
		SayFormattedMessage (ot_USER_BUFFER, msgObjBrowserHelp4_L, msgObjBrowserHelp4_S)
		AddHotKeyLinks ()
	elif controlId==cId_objBrowserDefinition then
		SayFormattedMessage (ot_USER_BUFFER, msgObjBrowserHelp5_L, msgObjBrowserHelp5_S)
		AddHotKeyLinks ()
	endIf
elif currentWindowName==wn_immediate && windowClass==wc_vbaWindow then
	SayFormattedMessage (ot_USER_BUFFER, msgImmediateWindowHelp1_L, msgImmediateWindowHelp1_S)
	AddHotKeyLinks ()
elif currentWindowName==wn_watch && windowClass==wc_vbaWindow then
	SayFormattedMessage (ot_USER_BUFFER, msgWatchWindowHelp1_L, msgWatchWindowHelp1_S)
	AddHotKeyLinks ()
elif currentWindowName==wn_locals && windowClass==wc_vbaWindow then
	SayFormattedMessage (ot_USER_BUFFER, msgLocalsWindowHelp1_L, msgLocalsWindowHelp1_S)
	AddHotKeyLinks ()
elif isPropertiesWindow() then
	if controlId==cId_PropertiesList then
		SayFormattedMessage (ot_USER_BUFFER, msgPropertiesWindowHelp1_L, msgPropertiesWindowHelp1_S)
		AddHotKeyLinks ()
	elif controlId==cId_propertiesValueEdit then
		SayFormattedMessage (ot_USER_BUFFER, msgPropertiesWindowHelp2_L, msgPropertiesWindowHelp2_S)
		AddHotKeyLinks ()
	elif controlId==cId_propertiesObjectCombo then
		SayFormattedMessage (ot_USER_BUFFER, msgPropertiesWindowHelp3_L, msgPropertiesWindowHelp3_S)
		AddHotKeyLinks ()
	elif controlId==cId_propertiesOrderTab then
		SayFormattedMessage (ot_USER_BUFFER, msgPropertiesWindowHelp4_L, msgPropertiesWindowHelp4_S)
		AddHotKeyLinks ()
	endIf
elif isCodeWindow() || (isAppObjectInvalid() && windowClass==wc_vbaWindow) then
	if windowClass==wc_vbaWindow then
		let lineCount=getVisibleCodeLineCount ()
		let topLine=getCodeTopLine()
		let sTemp_L = formatString(msgCodeWindowHelp1_L, getActiveCodeWindowView()) + cScBufferNewLine
		let sTemp_S = formatString(msgCodeWindowHelp1_S, getActiveCodeWindowView()) + cScBufferNewLine
		if lineCount > 0 then
			let sTemp_L = AddToString(sTemp_L,formatString(msgCodeWindowHelp2_L, intToString(topLine), intToString(topLine+lineCount-1)))
			let sTemp_S = AddToString(sTemp_S, 		formatString(msgCodeWindowHelp2_S, intToString(topLine), intToString(topLine+lineCount-1)))
			if isCursorInProcedure () then
				let sTemp_L = AddToString(sTemp_L,formatString(msgCodeWindowHelp3_L, getCurrentProcedureName(), intToString(getProcLineCount())))
				let sTemp_S = AddToString(sTemp_S,formatString(msgCodeWindowHelp3_S, getCurrentProcedureName(), intToString(getProcLineCount())))
			endIf
			sayModuleMemberCount()
			sayDeclarationLineCount()
			sayCodeLineCount()
		endIf
		let sTemp_L =AddToString(sTemp_L,msgCodeWindowHelp4_L)
		let sTemp_S = AddToString(sTemp_S,msgCodeWindowHelp4_S)
		SayFormattedMessage(OT_USER_BUFFER,sTemp_L, sTemp_S)
		AddHotKeyLinks ()
	elif controlId==cId_ObjectsCombo then
		SayFormattedMessage (ot_USER_BUFFER, msgCodeWindowHelp5_L, msgCodeWindowHelp5_S)
		AddHotKeyLinks ()
	elif controlId==cId_membersCombo then
		SayFormattedMessage (ot_USER_BUFFER, msgCodeWindowHelp6_L, msgCodeWindowHelp6_S)
		AddHotKeyLinks ()
	endIf
elif realWindowName==wn_menuEditor then
	let sTemp_L = msgMenuEditorHelp1_L + cScBufferNewLine
	performScript screenSensitiveHelp()
	if controlId==cId_MnuEdCaption then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp2_L)
	elif controlId==cId_MnuEdName then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp3_L)
	elif controlId==cId_MnuEdIndex then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp4_L)
	elif controlId==cId_MnuEdShortcut then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp5_L)
	elif controlId==cId_MnuEdHelpContextId then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp6_L)
	elif controlId==cId_MnuEdNegotiatePosition then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp7_L)
	elif controlId==cId_MnuEdEnable then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp8_L)
	elif controlId==cId_MnuEdVisible then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp9_L)
	elif controlId==cId_MnuEdWindowList then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp10_L)
	elif controlId==cId_MnuEdMoveLeft then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp11_L)
	elif controlId==cId_MnuEdMoveRight then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp12_L)
	elif controlId==cId_MnuEdMoveUp then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp13_L)
	elif controlId==cId_MnuEdMoveDown then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp14_L)
	elif controlId==cId_MnuEdNext then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp15_L)
	elif controlId==cId_MnuEdInsert then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp16_L)
	elif controlId==cId_MnuEdDelete then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp17_L)
	elif controlId==cId_MnuEdList then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp18_L)
	elif controlId==cId_MnuEdOk then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp19_L)
	elif controlId==cId_MnuEdCancel then
		let sTemp_L = AddToString(sTemp_L,msgMenuEditorHelp20_L)
	endIf
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L)
	AddHotKeyLinks ()
elif isProjectWindow() then
	SayFormattedMessage (ot_USER_BUFFER, msgProjectWindowHelp1_L, msgProjectWindowHelp1_S)
	AddHotKeyLinks ()
elif getObjectName()==wn_formLayout then
	SayFormattedMessage (ot_USER_BUFFER, msgFormLayoutHelp1_L, msgFormLayoutHelp1_S)
	AddHotKeyLinks ()
elif isMainWindow() then
	SayFormattedMessage (ot_USER_BUFFER, msgMainWindowHelp1_L, msgMainWindowHelp1_S)
	AddHotKeyLinks ()
elif isVbaModeRun() && not isProjectActive() then
	; The current Project is running
	SayFormattedMessage (ot_USER_BUFFER, msgAppRunning1_L)
	AddHotKeyLinks ()
	performScript screenSensitiveHelp() ; default
else
	performScript screenSensitiveHelp() ; default
	return
endIf
if isAppObjectInvalid() then
	SayFormattedMessage (ot_USER_BUFFER, msgWarning1_L, msgWarning1_S)
	AddHotKeyLinks ()
endIf
EndScript

Script hotkeyHelp ()
var
	handle currentWindow,
	string realWindowName,
	string currentWindowName,
	string windowClass,
	string sTemp_L,
	string sTemp_S
if TouchNavigationHotKeys() then
	return
endIf
if dialogActive() then
	performScript hotkeyHelp()
	return
endIf
let currentWindow=getCurrentWindow()
let currentWindowName=getWindowName(currentWindow)
let realWindowName=getWindowName(getRealWindow(CurrentWindow))
let windowClass=getWindowClass(currentWindow)
; Form Designer:
if isMSFormDesigner() || isVBFormDesigner() then
	let sTemp_L =msgHelp1_L + cScBufferNewLine
	let sTemp_S =msgHelp1_S + cScBufferNewLine
	if isVB6Ide then
		let sTemp_L = sTemp_L + msgHelp2_L +cScBufferNewLine
		let sTemp_s = sTemp_S +msgHelp2_S + cScBufferNewLine
	else
		let sTemp_L = sTemp_L +msgHelp3_L + cScBufferNewLine
		let sTemp_S = sTemp_S + msgHelp3_S + cScBufferNewLine
	endIf
	let sTemp_L = sTemp_L + msgHelp4_L + cScBufferNewLine
	let sTemp_S = sTemp_S + msgHelp4_S + cScBufferNewLine
elif isCodeWindow() then
; Code Window
	let sTemp_L =msgHelp5_L + cScBufferNewLine
	let sTemp_S = msgHelp5_S + cScBufferNewLine
elif currentWindowName==wn_immediate && windowClass==wc_vbaWindow then
; Immediate Window
	let sTemp_L = msgHelp6_L + cScBufferNewLine
	let sTemp_S = msgHelp6_S + cScBufferNewLine
elif currentWindowName==wn_watch && windowClass==wc_vbaWindow then
; Watch Window Keys
	let sTemp_L = msgHelp7_L + cScBufferNewLine
	let sTemp_S = msgHelp7_S + cScBufferNewLine
endIf
	let sTemp_L = AddToString(sTemp_L, msgHelp8_L)
	let sTemp_S = AddToString(sTemp_S, msgHelp8_S)
; VB General Keystrokes
if not isProjectWindow() then
	let sTemp_L = AddToString(sTemp_L, msgHelp9_L)
	let sTemp_S = AddToString(sTemp_s, msgHelp9_S)
endIf
if currentWindowName!=wn_immediate then
	let sTemp_L = AddToString(sTemp_L, msgHelp10_L)
	let sTemp_S = AddToString(sTemp_S, msgHelp10_S)
endIf
if not isPropertiesWindow() then
	let sTemp_L = AddToString(sTemp_L, msgHelp11_L)
	let sTemp_S = AddToString(sTemp_S, msgHelp11_S)
endIf
if not isCodeWindow() then
	let sTemp_L = AddToString(sTemp_L, msgHelp12_L)
	let sTemp_S = AddToString(sTemp_S, msgHelp12_S)
endIf
if not isMSFormDesigner() then
	let sTemp_L = AddToString(sTemp_L, msgHelp13_L)
	let sTemp_S = AddToString(sTemp_S, msgHelp13_S)
endIf
if realWindowName !=wn_objectBrowser then
	let sTemp_L = AddToString(sTemp_L, msgHelp14_L)
	let sTemp_S = AddToString(sTemp_S, msgHelp14_S)
endIf
	let sTemp_L = AddToString(sTemp_L, msgHelp15_L)
	let sTemp_S = AddToString(sTemp_S, msgHelp15_S)
	SayFormattedMessage (ot_USER_BUFFER, sTemp_L, sTemp_S)
EndScript

Script windowKeysHelp ()
if isVB6Ide then
	SayFormattedMessage (ot_USER_BUFFER, msgHelp16_L + cScBufferNewLine + msgHelp17_L + cScBufferNewLine + msgHelp18_L, msgHelp16_S + cScBufferNewLine + msgHelp17_S + cScBufferNewLine + msgHelp18_L)
	UserBufferAddText(cscBufferNEWline+cmsgBuffExit)
	return
Else
	SayFormattedMessage (ot_USER_BUFFER, msgHelp16_L + cScBufferNewLine + msgHelp18_L, msgHelp16_S + cScBufferNewLine + msgHelp18_L)
	UserBufferAddText(cscBufferNEWline+cmsgBuffExit)
endIf
EndScript

Script ScriptFileName ()
ScriptAndAppNames(msgVBE1_L)
EndScript

Script closeActiveWindow ()
closeActiveWindow()
EndScript

Script summarizeOpenProject ()
summarizeProject()
EndScript

Script setFocusOnWindow ()
if InHJDialog () then
	SayFormattedMessage (ot_error, cMSG337_L)
	return
endIf
setFocusOnSelectedWindow()
EndScript

script sayNextCharacter()
If UserBufferIsActive () then
	PerformScript sayNextCharacter()
	Return
EndIf
if isVBFormDesigner() then
	typeCurrentScriptKey()
	pause()
	sayActiveControl()
	testActiveControlOverlap()
else
	performScript sayNextCharacter() ;default
endIf
endScript

script sayPriorCharacter()
If UserBufferIsActive () then
	PerformScript sayPriorCharacter()
	Return
EndIf
if isVBFormDesigner() then
	typeCurrentScriptKey()
	pause()
	sayActiveControl()
	testActiveControlOverlap()
else
	performScript sayPriorCharacter() ;default
endIf
endScript

script sayPriorLine()
var
	int menuLevel,
	handle hFocus
If UserBufferIsActive () then
	PerformScript sayPriorLine()
	Return
EndIf
let hFocus=getFocus()
if isVBFormDesigner() then
	typeCurrentScriptKey()
	pause()
	sayActiveControl()
	testActiveControlOverlap()
elif getWindowName(getRealWindow(getFocus()))==wn_menuEditor then
	if getControlId(GetFocus())==cId_MnuEdList then
		priorLine()
		let menuLevel=getMenuEditorItemLevel ()
		if menuLevel!=globalPriorMenuLevel then
			let globalPriorMenuLevel=menuLevel
			saySubMenuLevel()
		endIf
		return
	endIf
elif getWindowTypeCode(hFocus)==wt_listbox
&& isPcCursor()
&& getWindowClass(getParent(hFocus))==wc_propertiesStatic then
	priorLine()
Elif isCodeWindow()
&& (getWindowTypeCode(hfocus)==wt_comboBox)
&& (GetControlId(hFocus)==cId_objectsCombo) then
	PriorLine ()
	SayWord ()
else
	performScript sayPriorLine() ;default
endIf
endScript

script sayNextLine()
var
	int menuLevel,
	handle hFocus
If UserBufferIsActive () then
	PerformScript sayNextLine()
	Return
EndIf
let hFocus=getFocus()
if isVBFormDesigner() then
	nextLine()
	pause()
	sayActiveControl()
	testActiveControlOverlap()
elif getWindowName(getRealWindow(getFocus()))==wn_menuEditor then
	if getControlId(GetFocus())==cId_MnuEdList then
		nextLine()
		let menuLevel=getMenuEditorItemLevel ()
		if menuLevel!=globalPriorMenuLevel then
			let globalPriorMenuLevel=menuLevel
			saySubMenuLevel()
		endIf
		return
	endIf
elif getWindowTypeCode(hFocus)==wt_listbox
&& isPcCursor()
&& getWindowClass(getParent(hFocus))==wc_propertiesStatic then
	nextLine()
Elif isCodeWindow()
&& (getWindowTypeCode(hfocus)==wt_comboBox)
&& (GetControlId(hFocus)==cId_objectsCombo) then
	NextLine ()
	SayWord ()
else
	performScript sayNextLine() ;default
endIf
endScript

script sayWord()
If UserBufferIsActive () then
	PerformScript sayWord()
	Return
EndIf
if isVBFormDesigner() then
	sayActiveControl()
	testActiveControlOverlap()
else
	performScript sayWord() ; default
endIf
endScript

script sayCharacter()
If UserBufferIsActive () then
	PerformScript sayCharacter()
	Return
EndIf
if isVBFormDesigner() then
	sayActiveControl()
	testActiveControlOverlap()
else
	performScript sayCharacter() ; default
endIf
endScript

Script setFocusOnMenuItemList ()
if getWindowName(getRealWindow(getFocus()))==wn_menuEditor then
	setFocus(FindDescendantWindow (getRealWindow(getFocus()), cId_mnuEdList))
else
	typeCurrentScriptKey()
endIf
EndScript


Script setFocusOnToolWindow ()
if isVB6Ide then
	setFocusOnToolWindow()
	RouteJAWSToPc()
	JAWSCursor()
	setRestriction(restrictWindow)
	nextLine()
	JAWSHome()
	nextWord()
	sayWord()
else ; VBA toolbox
	JAWSCursor()
	if isToolboxVisible() && FindString (getAppMainWindow(getFocus()), wn_VbaToolbox, s_top, s_unrestricted) then
		if getWindowClass(getCurrentWindow())==wc_vbaToolbox then
			leftMouseButton()
			setRestriction(restrictWindow)
			JAWSPageUp()
			nextLine()
			JAWSHome()
			nextWord()
			sayWord()
			return
		endIf
	endIf
	pcCursor()
	SayFormattedMessage (ot_error, msgToolboxNotVisible1_L)
endIf
EndScript

void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow,
	handle foregroundWindow
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let focusChangeTriggered=true
let RealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
let foregroundWindow=getForegroundWindow()
if (getWindowClass (focusWindow) == wc_vbaWindow)
	SetBrailleRestriction (RestrictWindow)
else
	SetBrailleRestriction (giDefaultBrlCursorRestriction)
endIf
if getWindowName(foregroundWindow)==globalPriorWizardScreenTitle then
	let GlobalFocusWindow = FocusWindow
	if getWindowClass(focusWindow)!=wc_thunderUserControl then
		if globalScreenStableEventScheduled then
			unscheduleFunction(globalScreenStableEventScheduled)
		endIf
		speakWizardTextAndFocus()
	endIf
	let GlobalPrevReal = RealWindow
	let GlobalPrevRealName = RealWindowName
	let GlobalPrevApp = AppWindow
	let GlobalPrevFocus = FocusWindow
	GlobalPrevDialogIdentifier = GetDialogIdentifier()
else
	focusChangedEvent(focusWindow,prevWindow)
endIf
endFunction

Void Function SayNonHighlightedText (handle hwnd, string buffer)
var
	string theClass,
	string realWindowName
let theClass=getWindowClass(hwnd)
if theClass==cwc_RichEdit20a then
	if getWindowClass(getParent(hwnd))==wc_popupTipWndClass then
		let globalQuickInfoHandle=hwnd
	endIf
elif theClass==wc_propertiesStatic && getWindowTypeCode(getFocus())==wt_listbox then
	SayFormattedMessage(ot_screen_message,buffer)
	return
endIf
sayNonHighlightedText(hwnd,buffer)
endFunction

void function sayHighlightedText(handle hwnd, string buffer)
	var
int theTypeCode
let theTypeCode=getWindowTypeCode(hwnd)
if isCodeWindow() &&
(theTypeCode==wt_comboBox) &&
(GetControlId(hWnd)==cId_objectsCombo) then
	return
EndIf
if not getPropertiesAndMethodsListHandle() && (theTypeCode==wt_listbox || theTypeCode==wt_combobox) && (hwnd!=globalFocusWindow) then
	return
endIf
sayHighlightedText(hwnd,buffer)
endFunction

Void Function NewTextEvent (handle hwnd, string buffer, int nAttributes, int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
; Handles all newly written text.	If the text is contained in a
; frame, then the frame name is passed as a parameter

if (ProcessSelectText(nAttributes,buffer)) then
	return
endIf
if UsingEnhancedEditSupport(hWnd) && sFrameName==cscNull then
	return ; handled by internal code which calls TextSelectedEvent
endIf
; The following lines implement screenStableEvent
; This is called when the screen stabilizes after a new screen is fully written
if globalScreenStableEventScheduled then
	unscheduleFunction (globalScreenStableEventScheduled)
endIf
let globalScreenStableEventScheduled = scheduleFunction (jfwScreenStableEvent,stabilizeTime)
if (nAttributes& ATTRIB_HIGHLIGHT) then
	SayHighlightedText(hwnd,buffer)
else
	SayNonHighlightedText(hwnd,buffer)
endIf
EndFunction

void function screenStableEvent()
var
	string wizardScreenTitle
let wizardScreenTitle=getWindowName(GetForegroundWindow ())
if wizardScreenTitle!=globalPriorWizardScreenTitle && stringContains(wizardScreenTitle,wn_wizard) then
	SayFormattedMessage(ot_document_name, wizardScreenTitle)
	speakWizardTextAndFocus()
	let globalPriorWizardScreenTitle=getWindowName(GetForegroundWindow ())
endIf
let globalScreenStableEventScheduled=0
endFunction

Script sayWindowTitle ()
var
	string nameOfParentOfReal
let nameOfParentOfReal=getWindowName(getParent(getRealWindow(getFocus())))
if nameOfParentOfReal==wn_newProject || getWindowName(getRealWindow(getFocus()))==wn_newProject then
	SayFormattedMessage (ot_window_name, formatString(cmsg30_L, nameOfParentOfReal, getDialogPageName())) ; title =
else
	performScript sayWindowTitle() ; default
endIf
EndScript

int function isMultiPageDialog()
var
	string nameOfParentOfReal
let nameOfParentOfReal=getWindowName(getParent(getRealWindow(getFocus())))
if nameOfParentOfReal==wn_newProject || getWindowName(getRealWindow(getFocus()))==wn_newProject then
	return true
else
	return isMultiPageDialog() ; default
endIf
endFunction

string function getDialogPageName()
if getWindowName(getRealWindow(getFocus()))==wn_newProject then
; we must be in the Existing page
	return wn_existing
else
	return getDialogPageName()
endIf
endFunction

Script AdjustJAWSVerbosity ()
var
	String list,
	int priorControlMovementUnit,
	int priorDetectOverlappingControls, ; flag to announce overlapping controls during form design
	int priorReadWholeCodeLine
if InHJDialog () then
	SayFormattedMessage (ot_error, cMSG337_L)
	return
endIf
if (IsSpeechOff ()) then
	PerformScript MuteSynthesizer()
	return
endIf
If (IsVirtualPCCursor ()) Then
	let list = cStrDefaultHTMLList()+cStrDefaultList()
Else
	let list = StrVB6VerbosityItems
	if not isVB6Ide then
		let list=list+StrNotVB6IdeVerbosityItems
	endIf
	let list=list+cStrDefaultList()
endIf
; store settings so we can determine what changes
let priorControlMovementUnit=globalControlMovementUnit
let priorDetectOverlappingControls=globalDetectOverlappingControls
let priorReadWholeCodeLine=globalReadWholeCodeLine
DlgSelectFunctionToRun (list, AdjustJAWSVerbosityDialogName, false)
; determine what changed and save settings if appropriate
if (priorControlMovementUnit!=globalControlMovementUnit) ||
(priorDetectOverlappingControls!=globalDetectOverlappingControls) ||
(priorReadWholeCodeLine!=globalReadWholeCodeLine) then
	if saveApplicationSettings() then

		SayFormattedMessage (ot_JAWS_message, msgAppSettingsSaved1_L, cmsgSilent)
	else
		SayFormattedMessage (ot_error, msgAppSettingsNotSaved1_L)
	endIf
endIf
EndScript

string function ToggleReadWholeCodeLine(int iRetCurVal)
if not iRetCurVal then
	;update the value
	let globalReadWholeCodeLine=!globalReadWholeCodeLine
EndIf
;now return the value
if globalReadWholeCodeLine then
	return msgReadWholeCodeLineOn1_S
else
	return msgReadWholeCodeLineOff1_S
endIf
endFunction

string function toggleOverlapAlert(int iRetCurVal)
if not iRetCurVal then
	;update the value
	let globalDetectOverlappingControls=!globalDetectOverlappingControls
EndIf
;now return the value
if globalDetectOverlappingControls then
	return msgAlertOverlapOn1_S
else
	return msgAlertOverlapOff1_S
endIf
endFunction

string function incrementMovementUnit(int iRetCurVal)
if not iRetCurVal then
	;update the value
	if globalControlMovementUnit < maxMovementUnit then
		let globalControlMovementUnit=globalControlMovementUnit+10
	EndIf
EndIf
return IntToString(globalControlMovementUnit)
endFunction

string function decrementMovementUnit(int iRetCurVal)
if not iRetCurVal then
	;update the value
	if globalControlMovementUnit > minMovementUnit then
		let globalControlMovementUnit=globalControlMovementUnit-10
	EndIf
EndIf
return IntToString(globalControlMovementUnit)
endFunction

Script completeCode ()
var
	handle hwnd,
	int cursorCol
if isCodeWindow() then
	let cursorCol=getCursorCol()
	typeCurrentScriptKey()
	delay(1)
	; initialize Braille code tracking variables which track suggestions when using autoComplete
	let globalSuggestionCol=0
	let globalSuggestionRow=0
	let globalCodeSuggestion=cscNull
	let hwnd=getPropertiesAndMethodsListHandle()
	if hwnd && isWindowVisible(hwnd) then
		let globalCodeSuggestion=getWindowText(hwnd,read_highlighted)
		saveCursor()
		invisibleCursor()
		if moveToWindow(hwnd) then
			if FindFirstAttribute (attrib_highlight) then
				if getParent(getCurrentWindow())==hwnd then
					; define the row and column to click if the suggestion is activated from the Braille display
					let globalSuggestionCol=getCursorCol()
					let globalSuggestionRow=getCursorRow()
				endIf
			endIf
		endIf
		; speak the suggestion
		sayUsingVoice(vctx_message, globalCodeSuggestion,ot_line)
	endIf
else
	performScript selectCurrentItem() ; default
endIf
EndScript

Script quickInfo ()
var
	int hasTip
if isCodeWindow() then
	if isSameScript() then
		messageBox(getWindowText(globalQuickInfoHandle,read_everything))
		return
	endIf
	typeCurrentScriptKey()
	pause()
	let hasTip=stringLength(getWindowText(globalQuickInfoHandle, read_everything)) > 0
	if globalQuickInfoHandle && hasTip then
		sayWindow(globalQuickInfoHandle,read_everything)
	else
		SayFormattedMessage (ot_error, msgNoHelpTip1_L)
	endIf
else
	sayCurrentScriptKeyLabel()
	typeCurrentScriptKey()
endIf
EndScript

Script ParameterInfo ()
var
	int hasTip
if isCodeWindow() then
	if isSameScript() then
		messageBox(getWindowText(globalQuickInfoHandle,read_everything))
		return
	endIf
	typeCurrentScriptKey()
	pause()
	let hasTip=stringLength(getWindowText(globalQuickInfoHandle, read_everything)) > 0
	if globalQuickInfoHandle && hasTip then
		sayWindow(globalQuickInfoHandle,read_everything)
	else
		SayFormattedMessage (ot_error, msgNoHelpTip1_L)
	endIf
else
	sayCurrentScriptKeyLabel()
	typeCurrentScriptKey()
endIf
EndScript

int Function saveApplicationSettings ()
var
	int iResult
let iResult=iniWriteInteger(Section_applicationVerbositySettings,hKey_ControlMovementUnit,globalControlMovementUnit,jsiFileName)
iniWriteInteger(Section_ApplicationVerbositySettings,hKey_DetectOverlappingControls,globalDetectOverlappingControls,jsiFileName)
iniWriteInteger(Section_ApplicationVerbositySettings,hKey_ReadWholeCodeLine,globalReadWholeCodeLine,jsiFileName)
return iResult
EndFunction

Function loadApplicationSettings ()
initializeApplicationSettings()
iniReadInteger(Section_applicationVerbositySettings,hKey_ControlMovementUnit,globalControlMovementUnit,jsiFileName)
iniReadInteger(Section_ApplicationVerbositySettings,hKey_DetectOverlappingControls,globalDetectOverlappingControls,jsiFileName)
iniReadInteger(Section_ApplicationVerbositySettings,hKey_ReadWholeCodeLine,globalReadWholeCodeLine,jsiFileName)
EndFunction


int Function getMenuEditorItemLevel ()
var
	int oldRestriction,
	int start,
	int indent
if getWindowName(getRealWindow(getFocus()))==wn_menuEditor then
	if getControlId(GetFocus())==cId_MnuEdList then
		let oldRestriction=getRestriction()
		setRestriction(restrictWindow)
		saveCursor()
		invisibleCursor()
		routeInvisibleToPc()
		let start=getCursorCol()
		if getCharacter()==cscSpace then
			nextWord()
			let indent=getCursorCol()-start
		else
			let indent=0
		endIf
		setRestriction(oldRestriction)
	endIf
endIf
return indent/indentUnit
EndFunction

Function saySubMenuLevel ()
var
	int level
let level=getMenuEditorItemLevel ()
if level < 0 || level > 5 then
	return
endIf
sayUsingVoice(vctx_message, formatString(msgMenuLevel1_L, intToString(level)), ot_position)
endFunction

Script sayActiveCursor ()
if isPcCursor()
&& !IsObjectNavigationActive()
&& (isMSFormDesigner() || isVBFormDesigner()) then
	sayActiveControlLeft()
	sayActiveControlTop()
else
	performScript sayActiveCursor() ;default
endIf
EndScript

Script selectNextCharacter ()
if isVBFormDesigner() then
	typeKey(cksSelectNextCharacter )
	pause()
	sayActiveControlWidth()
	testActiveControlOverlap()
else
	performScript selectNextCharacter() ; default
endIf
EndScript

Script selectPriorCharacter ()
if isVBFormDesigner() then
	typeKey(cksSelectPriorCharacter )
	pause()
	sayActiveControlWidth()
	testActiveControlOverlap()
else
	performScript selectPriorCharacter() ; default
endIf
EndScript

Script selectNextLine ()
if isVBFormDesigner() then
	typeKey(cksSelectNextLine)
	pause()
	sayActiveControlHeight()
	testActiveControlOverlap()
else
	performScript selectNextLine() ; default
endIf
EndScript

Script selectPriorLine ()
if isVBFormDesigner() then
	typeKey(cksSelectPriorLine)
	pause()
	sayActiveControlHeight()
	testActiveControlOverlap()
else
	performScript selectPriorLine() ; default
endIf
EndScript

string Function AddToString(String Base, String strNew)
let Base = Base + strNew + cScBufferNewLine
Return Base
EndFunction
/*
int Function brailleBuildLine ()
var
	int WindowSubtypeCode,
	string sClass,
	handle hWinSwitch
if IsInvisibleCursor () ||
IsJAWSCursor () then
	return FALSE ; structured line makes sense only when pc cursor is active
endIf
; for Task Switching
let hWinSwitch=findTopLevelWindow(cwc_Dlg32771,cscNull)
if hWinSwitch && isWindowVisible(hWinSwitch) then
	BrailleAddString(formatString(cMsgBrlTasks, getWindowText(hWinSwitch, read_everything)),0,0,0)
	return true
endIf
; For Command Prompt and Console windows
Let sClass = GetWindowClass (GetCurrentWindow())
If sClass == cwcTTY ||
sClass == cwcTTYGrab ||
sClass == cwcConsole then
	Return false
EndIf
if globalDesignerActive then
	if globalBrlControl!=cscNull then
		BrailleAddString (globalBrlControl, 0, 0, 0)
	endIf
	if globalBrlControlOverlapDesc !=cscNull then
		BrailleAddString (globalBrlControlOverlapDesc, 0, 0, 0)
	endIf
	return true
elif globalCodeWindowActive then
	if globalCodeSuggestion!=cscNull then
		BrailleAddString (globalCodeSuggestion, globalSuggestionCol, globalSuggestionRow, attrib_highlight)
		brailleAddString(brlSuggestionCodeDelimiter,0,0,0)
	endIf
	BrailleAddFocusLine ()
	return true
endIf
if IsVirtualPCCursor () then
	if !GlobalPixelsPerSpace then
		let GlobalPixelsPerSpace=GetJcfOption (OPT_PIXELS_PER_SPACE)
	endIf
	SetJcfOption (OPT_PIXELS_PER_SPACE, 1000)
	BrailleBuildVirtual()
	return true
endIf
if MenusActive () then
	if !GlobalPixelsPerSpace then
let GlobalPixelsPerSpace=GetJcfOption (OPT_PIXELS_PER_SPACE)
	endIf
	SetJcfOption (OPT_PIXELS_PER_SPACE, 1000)
	BrailleBuildMenu()
	Return TRUE
endIf
if DialogActive () then
	if !GlobalPixelsPerSpace then
		let GlobalPixelsPerSpace=GetJcfOption (OPT_PIXELS_PER_SPACE)
	endIf
	SetJcfOption (OPT_PIXELS_PER_SPACE, 1000)
	BrailleBuildDialog(GetRealWindow(GetFocus()))
	return TRUE
endIf
let WindowSubtypeCode = GetWindowSubtypeCode(globalFocusWindow)
if WindowSubtypeCode !=wt_unknown then
	if !GlobalPixelsPerSpace then
		let GlobalPixelsPerSpace=GetJcfOption (OPT_PIXELS_PER_SPACE)
	endIf
	SetJcfOption (OPT_PIXELS_PER_SPACE, 1000)
	return BrailleBuildOther(WindowSubtypeCode)
endIf
if GlobalPixelsPerSpace then
	SetJcfOption (OPT_PIXELS_PER_SPACE, GlobalPixelsPerSpace)
endIf
let GlobalPixelsPerSpace = 0
return FALSE
EndFunction
*/

int Function BrailleCallBackObjectIdentify ()
var
	string sClass
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
Let sClass = GetWindowClass (GetCurrentWindow())
If sClass == cwcTTY ||
sClass == cwcTTYGrab ||
sClass == cwcConsole then
	Return false
	Elif globalDesignerActive then
		return wt_custom_control_base+wt_designer
	elif globalCodeWindowActive then
		return wt_custom_control_base+wt_code_win
EndIf
return wt_unknown
EndFunction

int Function BrailleAddObjectDesignerControl (int nSubtypeCode)
	if globalBrlControl!=cscNull then
		BrailleAddString (globalBrlControl, 0, 0, 0)
		return true
	endIf
	return false
EndFunction

int Function BrailleAddObjectControlOverlap (int nSubtypeCode)
	if globalBrlControlOverlapDesc !=cscNull then
		BrailleAddString (globalBrlControlOverlapDesc, 0, 0, 0)
		return true
	endIf
	return false
EndFunction

int function BrailleAddObjectCodeWinSuggestion (int nSubtypeCode)
	if globalCodeSuggestion!=cscNull then
		BrailleAddString (globalCodeSuggestion, globalSuggestionCol, globalSuggestionRow, attrib_highlight)
		brailleAddString(brlSuggestionCodeDelimiter,0,0,0)
		return true
	endIf
	return false
EndFunction

int function BrailleAddObjectCodeWinLine (int nSubtypeCode)
	BrailleAddFocusLine ()
	return true
EndFunction

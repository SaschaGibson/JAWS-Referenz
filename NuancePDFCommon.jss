; Copyright 2019 - 2022, Freedom Scientific, Inc.
; JAWS Script Source file for code that is common to Nuance Gaaiho Doc, Power PDF,
; and Power PDF Reader.

include "HJGlobal.jsh"
include "HJConst.jsh"
include "NuancePDFCommon.jsh"

include "common.jsm"
include "NuancePDFCommon.jsm"

import "UIA.jsd"

GLOBALS
	Int GlobalOCRJobID,
	int globalDocumentOCR ; start PDF Recognition

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Utility Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

int function AskUserAndProceedWithOCR()
if (IgnoreOCRAlert)
	return 0
EndIf
var string MessageBoxTitle = cscNull
var handle focusWindow = GetFocus()
var object element = FSUIAGetElementFromHandle(focusWindow)
if (!element)
	return 0
endIf
MessageBoxTitle = element.name
var int ret = ExMessageBox(
	msgPromptToOCRDocument, MessageBoxTitle,
	MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON1)
return ret
EndFunction

int function IsNoSelectionForClipboard()
var string focusWindowClass = GetWindowClass(GetFocus())
if (focusWindowClass == NuancePDFDocumentWindowClass)
	return !GetSelectedText()
endIf
return IsNoSelectionForClipboard()
EndFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Settings Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

Void Function loadNonJCFOptions()
IgnoreOCRAlert = GetNonJCFOption(Key_IgnoreOCRAlert)
loadNonJCFOptions()
EndFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Event Helper Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; This function is part of the "Document and Web Pages automatically read when loaded" feature.
Int Function IsBrowserClassWindowOrDocument()
var string sClass = GetWindowClass(GetFocus())
if (sClass == NuancePDFDocumentWindowClass)
	return true
endIf
return IsBrowserClassWindowOrDocument()
EndFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Event Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

Void Function DocumentLoadedEvent()
var handle currentWindow = GetFocus()
if (
	IsEmptyVirtualDocument()
	&& getWindowName(globalPrevReal) != cwn8
	)
	if (AskUserAndProceedWithOCR() == IDYes)
		PerformScript OCRDocument(currentWindow)
		return
	EndIf
EndIf
if (
	IsFormsModeActive()
	&& GetObjectSubtypeCode() == wt_ComboBox
	)
	; do not exit forms mode
	; and do not allow documentLoadedEvent to process
	return
EndIf
DocumentLoadedEvent()
EndFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Scripts
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

Script OCRDocument(handle documentHwnd)
var
	int PrimaryLanguage = ReadSettingInteger(
		section_OCR, hKey_PrimaryRecognitionLanguage,
		1033, FT_DEFAULT_JCF),
	int SecondaryLanguage = ReadSettingInteger(
		section_OCR, hKey_SecondaryRecognitionLanguage,
		1033, FT_DEFAULT_JCF)
if (!documentHwnd)
	documentHwnd = GetFocus()
EndIf
if (!(GetRunningFSProducts() & product_JAWS))
	return
endIf
if (CanRecognize() != OCR_SUCCESS)
	SayFormattedMessage(
		OT_ERROR, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
	Return
endIf
If (GlobalOCRJobID)
	SayMessage(
		OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
if (
	GetObjectSubtypeCode(TRUE) != WT_DOCUMENT
	&& getWindowClass(documentHwnd) != NuancePDFDocumentWindowClass
	)
	SayMessage(OT_ERROR, msgNoDocumentOpen)
	return
endIf
GlobalOCRJobID = OCRPdf(documentHwnd, PrimaryLanguage, SecondaryLanguage)
if (GlobalOCRJobID)
	SayMessage(
		OT_JAWS_MESSAGE, msg_OCRDocumentStarted_L, MSG_OCRStarted_S)
	globalDocumentOCR = TRUE
Else
	SayFormattedMessage(
		OT_ERROR, MSG_OCR_PDF_FAILED_TO_Start)
endIf
endScript

Script SayNextParagraph()
; for web applications who "borrow" quick navigation keys
if (ProcessKeystrokeAsReserved(GetCurrentScriptKeyName()))
	return
endIf
if (IsFormsModeActive() && isPcCursor())
	if (getObjectSubtypeCode(TRUE) == WT_EDIT)
		TurnOffFormsMode()
	EndIf
endIf
NextParagraph()
If (SayAllInProgress())
	Return
EndIf
indicateInconsistenciesInRange(CheckParagraph)
if (!SayParagraph())
	SayMessage(OT_error, cMSG276_L)
	SayMessage(OT_error, cMSG277_L, cmsgSilent)
endIf
EndScript

Script SayPriorParagraph()
; for web applications who "borrow" quick navigation keys
if (ProcessKeystrokeAsReserved(GetCurrentScriptKeyName()))
	return
endIf
if (IsFormsModeActive() && isPcCursor())
	if (getObjectSubtypeCode(TRUE) == WT_EDIT)
		TurnOffFormsMode()
	EndIf
endIf
PriorParagraph()
If (SayAllInProgress())
	Return
EndIf
indicateInconsistenciesInRange(CheckParagraph)
if (!SayParagraph())
	SayMessage(OT_error, cMSG276_L)
	SayMessage(OT_error, cMSG277_L, cmsgSilent)
endIf
EndScript

; Results Viewer support for JAWS
; Copyright by Freedom Scientific (c) 2011-2015.

Include "HJConst.jsh"
include "HJGlobal.jsh"
include "Common.jsm"
include "IECustomSettings.jsh"
import "FSXMLDomFunctions.jsd"

const
;values for giResultsViewerEventType:
	ResultsViewerNormal = 0,
	ResultsViewerNewInstanceFocus = 1,
	ResultsViewerRefocused = 2,
	ResultsViewerDocumentLoaded = 3,
	ResultsViewerDocumentUpdated = 4
Globals
	int GlobalOCRJobID, ; fo; Default:
	int globalDocumentOCR, ; :: Adobe Acrobat.jss, OCR Document feature.
	int giResultsViewerEventType,
	int giScheduledProcessDocumentLoadOrUpdate

;************************
; From IECustomSettings: Stubs so the functions do absolutely nothing in Results Viewer.
int function FocusIsExpectingAutocompleteSearchSuggestions ()
; JAWS Search / Search JAWS Commands must use computer Braille to facilitate search suggestions.
return TRUE
endFunction

Void Function Unknown (string TheName, int IsScript, optional int IsDueToRecursion)
if stringIsBlank (theName) || IsDueToRecursion return endIf
TheName = StringLower (TheName)
if stringContains (theName, "shouldsayallondocumentload") return endIf
Unknown (TheName, IsScript, IsDueToRecursion)
endFunction

void Function SetUpStuffForNewPage(optional int iForcePageChange)
EndFunction

void function InitializeGlobalsWithSettingsFromJCF()
EndFunction

void Function SetJCFOptionsWithGlobals()
EndFunction

void Function LoadSettingsFromRelevantFile()
EndFunction

void Function WriteCustomOption (int iOption, int iSetting)
endFunction
;********End of IECustomSettings Stubs *************

Void Function AutoStartEvent ()
;determine if this is a new instance of Results Viewer:
if !ghWndResultsViewer
	let ghWndResultsViewer = GetAppMainWindow(GetFocus())
	let giResultsViewerEventType = ResultsViewerNewInstanceFocus
else
	let giResultsViewerEventType = ResultsViewerRefocused
EndIf
loadNonJCFOptions ()
if global_EmptyResultsViewerDocument then
	;No DocumentLoadedEvent fires if an empty document is loaded,
	;so manually fire it and then clear the global:
	let global_EmptyResultsViewerDocument = false
	DocumentLoadedEvent()
EndIf
EndFunction

void function AutoFinishEvent()
if giScheduledProcessDocumentLoadOrUpdate
	UnscheduleFunction(giScheduledProcessDocumentLoadOrUpdate)
	let giScheduledProcessDocumentLoadOrUpdate = 0
endif
StopSayAll()
EndFunction

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow, optional handle PrevFocusWindow)
; In applications like Outlook, items like Basic Layer Help would otherwise start reading "message, message, message".
return FALSE
endFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
let giResultsViewerEventType = ResultsViewerNormal
return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
endFunction

void Function SayAllStoppedEvent ()
let giResultsViewerEventType = ResultsViewerNormal
SayAllStoppedEvent ()
endFunction

int Function HandleCustomAppWindows (handle hWnd)
;Only speak app title, no type information,
;and only speak that when returning to an existing instance of Results Viewer.
;Note that there is a specific exception for speech history.
if giResultsViewerEventType == ResultsViewerRefocused
|| GetAppTitle() == cmsgSpeechHistoryTitle
	Say(GetWindowName(hWnd),ot_app_name)
endIf
Return true
EndFunction

Int Function HandleCustomWindows (Handle hWnd)
var
	int iSubtype
if giResultsViewerEventType == ResultsViewerRefocused then
	let giResultsViewerEventType = ResultsViewerNormal
	return true
elif giResultsViewerEventType == ResultsViewerNewInstanceFocus
|| giResultsViewerEventType == ResultsViewerDocumentLoaded
|| giResultsViewerEventType == ResultsViewerDocumentUpdated then
	;ProcessDocumentLoadOrUpdate clears giResultsViewerEventType
	return true
endIf
if GetWindowClass(hWnd) == cwcChromeBrowserClass then
	let iSubtype = GetObjectSubtypeCode()
	if iSubtype == wt_unknown
	|| iSubtype == wt_static then
		;just say the current line if alt+tabbing back into the document
		;and if on plain text
		SayLine()
		return true
	else
		;Normal processing for focusing on links or any other controls in this window:
		Return false
	endIf
EndIf
return HandleCustomWindows(hWnd)
EndFunction

int function ShouldSayAllOnDocumentLoadResultsViewer()
if !IsBrowserClassWindowOrDocument() 
	return false 
endIf
return gbDefaultSayAllOnDocumentLoad
EndFunction

void function ProcessDocumentLoadOrUpdate()
let giScheduledProcessDocumentLoadOrUpdate = 0
if GetAppTitle() == cmsgSpeechHistoryTitle then
	;Move to start of most recent speech history entry:
	GotoLineNumber(GetLineCount())
	SayLine()
else
	JAWSTopOfFile()
	;make sure braile also repositions at the top:
	BrailleRefresh()
	if !ShouldSayAllOnDocumentLoadResultsViewer()
		SayLine()
	else
		StopSayAll()
		StopSpeech()
		SayAll()
	endIf
EndIf
let giResultsViewerEventType = ResultsViewerNormal
EndFunction

Void Function DocumentLoadedEvent ()
;delay to make sure that focus change happens before the document load processing:
let giResultsViewerEventType = ResultsViewerDocumentLoaded
let giScheduledProcessDocumentLoadOrUpdate =
	ScheduleFunction("ProcessDocumentLoadOrUpdate",5)
EndFunction

void function DocumentUpdated(int nLineNumberOfChange, int bUserInvoked)
;delay to make sure that focus change happens before the document update processing:
delay (5, TRUE)
let giResultsViewerEventType = ResultsViewerDocumentUpdated
;let giScheduledProcessDocumentLoadOrUpdate =
	;ScheduleFunction("ProcessDocumentLoadOrUpdate",5)
Delay (5, TRUE)
if !ShouldSayAllOnDocumentLoadResultsViewer()
	SayLine()
else
	StopSayAll()
	StopSpeech()
	SayAll()
endIf
EndFunction

void function SetQuickKeyNavigationState (int iState)
;This is for Word or another app that does custom Quick Navigation keys:
;If someone sets the key in Word to On, we want it to stay on while they use Research It or Skim Reading.
endFunction

script Tab ()
let giResultsViewerEventType = ResultsViewerNormal
PerformScript Tab ()
EndScript

script ShiftTab ()
let giResultsViewerEventType = ResultsViewerNormal
PerformScript ShiftTab ()
EndScript

void function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
; Specifically for canceling PDF Document OCR 
if stringContains (strKeyName, cksCloseApp) then
	if globalDocumentOCR then
		if GlobalOCRJobID then
			PerformScript CancelRecognition ()
			GlobalOCRJobID = 0;
		endIf
		globalDocumentOCR = OFF
	endIf
endIf
ProcessKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

int function CloseFSCompanionWarning ()
return DoDefaultActionForXMLDomDocItem("//*[@id='warning-modal']//*[@type='button']")
EndFunction

Script UpALevel ()
if CloseFSCompanionWarning() then
	return
endIf
PerformScript UpALevel ()
if globalDocumentOCR then
	If GlobalOCRJobID then 
		PerformScript CancelRecognition ()
		GlobalOCRJobID = 0
	endIf
	globalDocumentOCR = OFF
endIf
endScript


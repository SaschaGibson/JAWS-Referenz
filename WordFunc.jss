; Copyright 1995-2024 Freedom Scientific, Inc.
;  object and event functions for Microsoft Word versions 2016 and O365.

include "hjConst.jsh"
include "hjGlobal.jsh"
include "MSAAConst.jsh"
include "uia.jsh"
include "common.jsm"
include "office.jsh"
include "msOffice.jsm"
include "wordFunc.jsh"
include "word.jsh"
include "word.jsm"

import "Office.jsd"
import "wordSettings.jsd"
import "say.jsd"
import "touch.jsd"
import "UIA.jsd"
import "Virtual.jsd" ; for string function GetURLForFocusedLink

const
	vbTrue = 0xffffffff,
	wdUIAEventPrefix = "wdUIA",
	ProofingPaneSplitButtonsTickCounterThreshold = 250,
;types of parameters:
	TableColumnHeaderType = 1,
	TableRowHeaderType = 2,
;For selecting text:
	MaxLengthSelectedTextToBeSpoken = 1000, ;The maximum length of text to be spoken when selecting text in the document.
	MaxLengthSelectedTextStartEndSegment = 50, ;The maximum length of text in the start and end text of the selection when selection exceeds the length at which the entire text is spoken.
	cLastLinkNavTimeWaitThreshold = 3000 ;1000 is 1 second
		; Used in conjunction with collection cLastLinkNav.
		; the cLastLinkNavTimeWaitThreshold specifies the length of time in ticks
		; that we will consider valid for a recent link navigation.
		; this specifies the time between the settings of the link information in the script
		; and the event that needs to know about it.
		; for moving backward, the event is SelectionContextChangedEvent.

globals
	object oWordGlobal, ;The Word DOM object.
	object oWDUIASpellCheckEvents,
	object oWDUIAFindEvents
	
Globals
collection cWDOptions,
	; Members are:
	; int checkSpelling
	; int checkGrammar
collection cWDActiveDocument,
	; Members are:
	; int readOnly
	; int protectionType
	; int trackRevisions
	; int NavigatedForward
collection cWDCurrentTable,
	; Members are:
	; int index
	; int nestingLevel
	; int uniform
	; int rowCount
	; int rowColumnCount
	; collection cell
	; int cell.row
	; int cell.column
	; int rowColumnCount
collection cwdDeferredCellChange,
	; Storage for deferred cellChangedEvent calls.
	;
	; Members are:
	; int delaying
	;		Delaying tells this event to run when called from a schedule,
	;		and also tells the selectionChangedEvent to fire this event.
	; int nNewCol
	; int nNewRow
	; int nNewNesting
	; int nNewRowColCount
	; string ColHeader
	; string RowHeader
	; int nPrevCol
	; int nPrevRow
	; int nPrevNesting
	; int nPrevRowColCount
collection cWDSelectionContext,
	; Members are:
	; collection field
	; int field.type
	; collection revision
	; int revision.type
	; string revision.author
	; string revision.date
collection cWDPrevSelectionContext,
	; Copy of cWDSelectionContext, for determining previous selection.
collection cwdExtendedSelection,
	; Members are:
	; int charCount
	; int status
	; int ScriptSelectionByUnitModeKeyPressed
	; int ScheduleID -- The ID returned when the watchExtendedSelectionMode function is scheduled.
collection cLastTracked,
	; The cLastTracked collection is used to keep track of
	; the most recent tracked event and caret movement type.
	;
	; Members are:
	; int event
	; int prevEvent
	; int caretMovementUsedBySelectionContext
	; int forcedRecognition
	; int caretMovementUsedByWordDocumentTables
	; int caretMovementUsedByEditableMessageTables
	; int tableNavInWordDocument
	; int tableNavInEditableMessage
	;In Word, CellChangedEvent fires before CaretMovedEvent.
	;In Outlook, CaretMovedEvent fires before CellChangedEvent.
	;We deal with this by using two sets of variables for tracking table events and caret moved events.
collection c_MultilevelListObjects,
	; Supporting the names of multilevel list objects in the multilevel list pane:
	; In Word 2007 and later, these names are quite verbose.
	; To make these objects easier to use, we substitute the names for the object as they are in Word 2003.
	; The collection c_MultilevelListObjects is used to hold the names of these objects.
collection cLastLinkNav,
	; Members are:
	; int time
	; int direction
collection c_Language,
	; For language and locale variables.
	;
	; Members are:
	; int RTLReadingStatus
	; int RTLReadingStateLastValue
collection c_WordFuncTester
	; For variables which are set or cleared under certain conditions and tested elsewhere when something happens.
	;
	; Members are:
	; int UpdatingApplicationData
	; int UpdatingDocumentData
	; int SuppressSelectionChangeDetection
	; int CaretMovedIgnoreSayAll -- Used to prevent Stop SayAll from double-speaking.
	; int ViewTick -- used to minimize resets of view type.
	; int RunSelectionContextEvents -- 
	;		when the application gains focus,
	;		the DocumentChanged event may run after other events,
	;		so we use a variable to test for this and run them if necessary.
	; int TabbingInReadOnlyMessage --
	;		Selection change event is the event used to detect movement
	;		when tabbing/shift tabbing in Outlook read-only messages.
	;		Because we want to handle speaking of this type of movement differently
	;		than the typical selection change,
	;		we use a variable to determine if this is the case.
	; int StoryType -- The story type from the Word DOM.
	; int MostRecentTableIndex -- Keeps track of the most recently visited table.
	; int CurrentTableWasEdited -- For determining if row/columns/cells were inserted or deleted from a menu or dialog.
	; string FormFieldNameFromSelectionChange -- Used to prevent duplicate typeAndText info speaking while typing in form fields.
	; int MouseButtonEventInDocument
	; int NavigationSayValueHook -- for character and word navigation hooks.
	; int PhoneticSpellHookSet -- Tests if a phonetic spell hook is set.
	; int ScheduledClearSilentSelectionToMarkedPlace -- 
	;		Selecting to marked place should not speak the selection.
	;		We must first set the variable to suppress speech during selection,
	;		then select the text,
	;		and allow the selection to happen before clearing the variables to suppress speech.
	;		because we cannot control when the selection change event will happen,
	;		we use a scheduled function to ensure a delay
	;		from the time of the command to select the text
	;		before clearing the speech suppression variable.
	; int ProofingPaneSplitButtonsTickCounter -- for TextTextChange from Proofing Pane with SplitButtons.
	; int wordCountThreshold -- for spelling and grammar errors issues.


object function InitOWord()
var object oWord = GetNativeOMFromMSAA().aplication
If !oWord
	oWord = GetNativeOMFromMSAA().application
EndIf
return oWord
EndFunction

object function GetOWord()
; As part the fix to bug 92223 for ONCE: ONCE's issue was that, in Windows 7 x64, upon exiting Word 2007
; and with focus returning to a Windows Explorer window, Windows Explorer would often hang. The following
; block of code can be used in place of the body of this function to prevent this issue.
;
; return InitOWord()
;
if !oWordGlobal
	oWordGlobal = InitOWord()
endIf
return oWordGlobal
EndFunction

void function autoStartEvent()
; Do not add code to this function.
; Instead, add to WordFuncInit()
; as it will be called from the Word main AutoStartEvent.
endFunction

void function AutoFinishEvent()
BrailleClearPendingFlashMessages()
ClearTimersAndCollections()
ComRelease(oWordGlobal, true)
oWDUIASpellCheckEvents = Null()
oWDUIAFindEvents = Null()
endFunction

void function InitNewWordFuncCollections()
if !cWDOptions cWDOptions = new collection endIf
if !cWDActiveDocument cWDActiveDocument = new collection endIf
if !cWDCurrentTable cWDCurrentTable = new collection endIf
if !cwdDeferredCellChange cwdDeferredCellChange = new collection endIf
if !cWDSelectionContext cWDSelectionContext = new collection endIf
if !cWDPrevSelectionContext cWDPrevSelectionContext = new collection endIf
if !cwdExtendedSelection cwdExtendedSelection = new collection endIf
if !cLastTracked cLastTracked = new collection endIf
if !cLastLinkNav cLastLinkNav = new collection endIf
if !c_MultilevelListObjects c_MultilevelListObjects = new collection endIf
if !c_Language c_Language = new collection endIf
if !c_WordFuncTester c_WordFuncTester = new collection endIf
EndFunction

void function ClearTimersAndCollections()
CollectionRemoveAll(cWDOptions)
CollectionRemoveAll(cWDActiveDocument)
CollectionRemoveAll(cWDCurrentTable)
CollectionRemoveAll(cwdDeferredCellChange)
CollectionRemoveAll(cWDSelectionContext)
CollectionRemoveAll(cWDPrevSelectionContext)
ClearExtendedSelectionModeWatchTimer() ;Must preceed clearing cwdExtendedSelection.
CollectionRemoveAll(cwdExtendedSelection)
CollectionRemoveAll(cLastTracked)
CollectionRemoveAll(c_MultilevelListObjects)
CollectionRemoveAll(cLastLinkNav)
CollectionRemoveAll(c_Language)
CollectionRemoveAll(c_WordFuncTester)
EndFunction

int function IsRtlReading(handle hwnd)
; Function is called by JAWS when retrieving a line of text from the OSM to
; determine if that text has right to left reading order.
var	int result
if !c_Language.RTLReadingStatus
	; Delegate to internal version to check standard windows
	return IsRtlReading(hwnd)
EndIf
if IsKeyboardLayoutChanging()
	return c_Language.RTLReadingStateLastValue == wdReadingOrderRtl
EndIf
if WindowCategoryIsWordDocument()
	If !GetOWord()
		Return FALSE
	EndIf
	result = (GetSelectionContext() & selCtxRightToLeftReadingOrder)
	c_Language.RTLReadingStateLastValue=result
	return result == wdReadingOrderRtl
Else
	return IsRtlReading(hwnd)
EndIf
EndFunction

void function WordFuncInit()
;Initialize collection before anything else:
InitNewWordFuncCollections()
;Ensure document pointers get properly updated:
wdApp_DocumentChange()
c_Language.RTLReadingStatus = IsRTLLanguageProcessorLoaded()
TrackEvent(event_autoStart)
UpdateCWDOptions()
if isSelectionModeActive()
	InitExtendedSelectionModeWatch()
else
	StopExtendedSelectionModeWatch()
endIf
c_WordFuncTester.wordCountThreshold = GetNonJCFOption ("WordCountThresholdForSpellingErrors")
endFunction

Void Function initializeAppObj()
Pause()
WDApp_DocumentChange()
EndFunction

void function UpdateCWDActiveDocument()
var
	object oDoc
CollectionRemoveAll(cWDActiveDocument)
var object oWord = GetOWord()
oDoc = oWord.activeDocument
if oWord.IsObjectValid(oDoc) !=  VBTrue
	return
EndIf
cWDActiveDocument.name = oDoc.name
cWDActiveDocument.readOnly = (oDoc.ReadOnly == vbTrue)
cWDActiveDocument.protectionType = oDoc.protectionType
setViewType()
cWDActiveDocument.paneCount = oDoc.activeWindow.panes.count
cWDActiveDocument.paneIndex = oDoc.activeWindow.activePane.index
cWDActiveDocument.frameSet = oDoc.activePane.frameSet
cWDActiveDocument.tableCount = oDoc.tables.count
cWDActiveDocument.lineSpacing = 0
if oDoc.attachedTemplate
	cWDActiveDocument.language = oDoc.attachedTemplate.languageId
else
	cWDActiveDocument.language = wdEnglishUS
endIf
cWDActiveDocument.ObjectCount = 0
EndFunction

void function UpdateCWDOptions()
var
	object o
if isAppObjInvalid() return endIf
c_WordFuncTester.UpdatingApplicationData = true
CollectionRemoveAll(cWDOptions)
var object oWord = GetOWord()
o = oWord.options
cWDOptions.measurementUnit = o.measurementUnit
cWDOptions.smmConvertedMeasurementUnit  = ConvertMeasurementUnitToSmmUnit(cWDOptions.measurementUnit)
cWDOptions.sound = o.enableSound*-1
cWDOptions.checkSpelling = o.checkSpellingAsYouType*-1
cWDOptions.checkGrammar = o.checkGrammarAsYouType*-1
cWDOptions.overType = o.overType*-1
c_WordFuncTester.UpdatingApplicationData = false
EndFunction

void function WDApp_DocumentChange()
;Fires when document opens, closes, or changed to a different document.
;may fire multiple times, depending on what's happening.
;fires in addition to the DocumentOpen, NewDocument, WindowActive and WindowDeactivate events.
var
	object oDoc,
	string sDocName
UpdateCWDOptions() ; Office 2013 especially, where Word opens to no document.
c_WordFuncTester.UpdatingDocumentData = true
c_WordFuncTester.FormFieldNameFromSelectionChange = cscNull
var object oWord = GetOWord()
oDoc = oWord.ActiveDocument
if !oDoc
	CollectionRemoveAll(CWDActiveDocument)
	updateDocumentPointer()
	; Avoid turning off QuickNav if it was not turned on by the script,
	; so that the setting from QuickSettings or Settings Center gets preserved:
	if giQuickNavStateFromScript
		EnsureQuickNavIsOff()
	endIf
else
	sDocName = oDoc.name
	if sDocName
	&& (StringCompare(sDocName,CWDActiveDocument.name) != 0 || c_WordFuncTester.MouseButtonEventInDocument)
		TrackEvent(event_DocumentChanged)
		updateCWDActiveDocument()
		updateDocumentPointer()
		if c_WordFuncTester.RunSelectionContextEvents
			c_WordFuncTester.RunSelectionContextEvents = false
		EndIf
		RunSelectionContextEvents()
		if !IsReadOnlyMessage()	then
			; Avoid turning off QuickNav if it was not turned on by the script,
			; so that the setting from QuickSettings or Settings Center gets preserved:
			if giQuickNavStateFromScript
				EnsureQuickNavIsOff()
			endIf
		endIf
	EndIf
EndIf
c_WordFuncTester.UpdatingDocumentData = false
EndFunction

void function WDApp_Quit()
;Fires when the application is closed.
CollectionRemoveAll(cWDOptions)
c_WordFuncTester.FormFieldNameFromSelectionChange = cscNull
EndFunction

void function ToggleScreenUpdating(int nFlag)
Var
	Int cLeft,
	int cTop,
	int cRight,
	int cBottom,
	int wLeft,
	int wTop,
	int wRight,
	int wBottom,
	int bIRect,
	int bWRect,
	handle hDocWnd,
	handle hStatWnd,
	int iStat
;toggling screen updating appears to take an aweful long time
;and doesn't appear to give us much benefit since we still see flicker.
;with toggling screen updating off and back on,
;the time it took takes to obtain the line range is over 125 ticks
;without updating turned off it took around 32 ticks
; old method:
;var object oWord = GetOWord()
;let oWord.ScreenUpdating=nFlag
; new solution:
; we turn off screen updating of both caret and status bar to prevent visible trails.
; we use SendMessage function with last parm not used to turn off redraw.
; once we process the selection, we turn redraw back on.
; then we invalidate both the caret and status bar rects.
; to invalidate the rects, we use GetItemRect and GetWindowRect for caret and status bar respectively.
; these functions provide rect coordinates by reference.
;So we can pass them to InvalidateRect without assigning each one.
; since the GetItemRect and GetWindowRect functions also returns true/false
;depending on whether it was successful, we use a boolean int to test this.
hDocWnd = GetFocus()
;Let hStatWnd = GetPriorWindow(GetParent(GetParent(hDocWnd)))
If !nFlag
	SendMessage(hDocWnd,wm_setRedraw,nFlag,off)
	;SendMessage(hStatWnd,wm_setRedraw,nFlag,off)
EndIf
If nFlag
	; the first two parms are 0 since we want the current item's rect.
	bIRect = GetItemRect(0,0,cLeft,cRight,cTop,cBottom,it_caret)
	;let bWRect = GetWindowRect(hStatWnd,wLeft,wRight,wTop,wBottom)
	;SendMessage(hStatWnd,wm_setRedraw,nFlag,off)
	;InvalidateRect(hStatWnd,wLeft,wTop,wRight,wBottom)
	; if InvalidateRect is placed before SendMessage,
	; we get a space on what should be the first character of the line.
	; due to a problem with GetItemRect providing the caret rect
	; off by 1 pixel, we need to subtract it from each of the coordinates of rect.
	;InvalidateRect(hDocWnd,cLeft-1,cTop-1,cRight-1,cBottom-1)
	SendMessage(hDocWnd,wm_setRedraw,nFlag,Off)
EndIf
; old method
;var object oWord = GetOWord()
;If nFlag
	;let oWord.screenUpdating=-1
;ElIf ! nFlag
	;let oWord.screenUpdating=false
;EndIf
endFunction

object Function getRangeAtCursor()
;getCursorCol and row return one pixel different
;from what rangeFromPoint sees as the correct point
var object oWord = GetOWord()
var object oRange = oWord.activeWindow.rangeFromPoint(GetCursorCol()-1, getCursorRow()-1)
if oRange
	return oRange
endIf
return Null()
EndFunction

int function convertWdUnitOfMeasureToSmmUnitOfMeasure()
; Because this may get called before all collections get initialized:
if !cwdOptions
|| ! CollectionItemCount (cwdOptions)
	InitNewWordFuncCollections()
	; get measurements and other relevant info for SMM:
	; Default is 0, but inches is also 0.
	; This posed a problem where if collections and data weren't up-to-date in time,
	; we would be setting to Inches, when 0 had actually meant no data present.
	; Occurred where Centimeters was the default setting for some languages, but we showed as inches,
	; and then when user alt tabbed away and back, the initialization was correct.
	UpdateCWDOptions()
endIf
var int iUnit = cWDOptions.measurementUnit
;do the conversion to support schemes.
if iUnit == wdInches
	return smmInches
elIf iUnit == wdCentimeters
	return smmCM
elIf iUnit == wdMillimeters
	return smmMM
elIf iUnit == wdPoints
	return smmPoints
elIf iUnit == wdPicas
	return smmPixels
endIf
return iUnit
endFunction

string Function GetAppUnitOfMeasure()
var	int iUnit = cWDOptions.measurementUnit
if iUnit == wdPoints
	return msgPoints1_L
elif iUnit == wdInches
	return msgInches1_L
elif iUnit == wdCentimeters
	return msgCentimeters1_L
elif iUnit == wdMillimeters
	return msgMillimeters1_L
elif iUnit == wdPicas
	return msgSpaces
endIf
EndFunction

int Function GetDesiredUnitTypeOfMeasure(int UnitType)
; We pass in the default type and compare against the user's desired type.
; we only convert for inches, centimeters, millimeters, and points.
var	int iDesiredUnit = getDesiredUnitsOfMeasure()
if unitType == wdInches
&& iDesiredUnit !=  smmInches
	if iDesiredUnit == smmCM
		unitType = wdCentimeters
	elIf iDesiredUnit == sMMMM
		UnitType = wdMillimeters
	elIf iDesiredUnit == sMMPoints
		unitType = wdPoints
	EndIf
Elif unitType == wdCentimeters
&& iDesiredUnit !=  smmCM
	if iDesiredUnit == smmInches
		unitType = wdInches
	elIf iDesiredUnit == sMMMM
		UnitType = wdMillimeters
	elIf iDesiredUnit == sMMPoints
	 	unitType = wdPoints
	EndIf
Elif unitType == wdMillimeters
&& iDesiredUnit !=  smmMM
	if iDesiredUnit == smmInches
		unitType = wdInches
	elIf iDesiredUnit == sMMCM
		UnitType = wdCentimeters
	elIf iDesiredUnit == sMMPoints
	 	unitType = wdPoints
	EndIf
Elif unitType == wdPoints
&& iDesiredUnit !=  smmPoints
	if iDesiredUnit == smmInches
		unitType = wdInches
	elIf iDesiredUnit == sMMCM
		UnitType = wdCentimeters
	elIf iDesiredUnit == sMMMM
		UnitType = wdMillimeters
	EndIf
EndIf
return UnitType
EndFunction

string Function pointsToDefaultUnits(int points)
var
	int unitType,
	string sConverted,
	string unitDesc,
	int iEindex, ; position of E in string if in scientific notation
	int iDecPlaces, ; number of decplaces in mantissa
	int iDecIndex, ; current decimal point index in string
	int iNewDecIndex, ; new index of decimal place
	int iZerosToPrepend, ; number of zeros to prepend
	string sTemp,
	int iTruncateBy
var object oWord = GetOWord()
UnitType = GetDesiredUnitTypeOfMeasure(oWord.options.measurementUnit)
if unitType == wdPoints
	unitDesc = msgPoints1_L ; no conversion
	sConverted = intToString(points)
elif unitType == wdInches
	unitDesc = msgInches1_L
	sConverted = oWord.pointsToInches(points)
elif unitType == wdCentimeters
	unitDesc = msgCentimeters1_L
	sConverted = oWord.pointsToCentimeters(points)
elif unitType == wdMillimeters
	unitDesc = msgMillimeters1_L
	sConverted = oWord.pointsToMillimeters(points)
elif unitType == wdPicas
	unitDesc = msgPicas1_L
	sConverted = oWord.pointsToPicas(points)
endIf
; handle case when string returned from O.M. is null
;keep sConverted from equalingNUll, orwe won't get proper units of measure:
;bug in == operator makes commented condition fail.
;if sConverted == cscNull
If StringCompare (sConverted, cscNull) == 0 then;0 = exact match:
	sConverted = sc_2
endIf
; handle case when string returned from O.M. contains Scientific notation.
; we assume that we only ever have to move the decimal point to the left.
iEindex = stringContains(sConverted,scEScientific)
if iEindex
	iDecPlaces = stringToInt(SubString (sConverted, (iEindex+1), (stringLength(sConverted)-iEindex)))
	iDecIndex = stringContains(sConverted,scDecimalPoint)
	; remove current decimal point and e notation
	sTemp = stringLeft(sConverted,iDecIndex-1)+subString(sConverted,(iDecIndex+1),(iEindex-iDecIndex))
	sTemp = stringLeft(sTemp,stringLength(sTemp)-1)
	; now move the decimal point
	iNewDecIndex = (iDecIndex-1)+iDecPlaces
	if iNewDecIndex < 0
		; need to prepend zeros and decimal point
		iZerosToPrepend = iNewDecIndex*(-1)
		sTemp = cscSpace+scZeroPoint+stringLeft(scZeros,iZerosToPrepend)+sTemp ; require space to force concatenation rather than addition
		sConverted = stringRight(sTemp,stringLength(sTemp)-1) ; remove the prepended space required to force concatenation
	endIf
endIf
; now truncate to three decimal places if indentation announcement is on and moving by line.
iDecIndex = stringContains(sConverted,scDecimalPoint)
if iDecIndex
	iDecPlaces = stringLength(sConverted)-iDecIndex
	if iDecPlaces > 2
		iTruncateBy = stringLength(sConverted)-iDecPlaces+3
		sConverted = stringLeft(sConverted, iTruncateBy)
	endIf
endIf
return formatString(msgPToDURetVal1, sConverted, unitDesc)
EndFunction

string function GetDesiredUnitOfMeasureString()
Var	int iUnit = getDesiredUnitsOfMeasure()
if iUnit == smmPixels
	return msgPixels
ElIf iUnit == smmSpaces
	return msgSpaces
ElIf iUnit == smmPoints
	return msgPoints1_L
elif iUnit == smmCm
	return msgCentimeters1_L
elif iUnit == smmMM
	return msgMillimeters1_L
elif iUnit == smmInches
	return msgInches1_L
EndIf
EndFunction

void function InitExtendedSelectionModeWatch()
;This function should be called when extended selection mode is activated,
;or when the Word application gains focus and the document has extended selection mode on.
cWDExtendedSelection.status = on
;cWDExtendedSelection.ScriptSelectionByUnitModeKeyPressed should only be true
;immediately after selection by unit mode has caused a selection change
;in word, sentence, paragraph or entire document,
;and cleared immediately after the selection change was spoken by the SelectionByUnitMode script.
cWDExtendedSelection.ScriptSelectionByUnitModeKeyPressed = false
cWDExtendedSelection.charCount = GetSelectedCharCount()
cwdExtendedSelection.ScheduleID = scheduleFunction("watchExtendedSelectionMode", 10)
EndFunction

void function ClearExtendedSelectionModeWatchTimer()
if cwdExtendedSelection.ScheduleID
	unscheduleFunction(cwdExtendedSelection.ScheduleID)
	cwdExtendedSelection.ScheduleID = 0
endIf
EndFunction

void function StopExtendedSelectionModeWatch()
cWDExtendedSelection.status = off
cWDExtendedSelection.charCount = 0
ClearExtendedSelectionModeWatchTimer()
EndFunction

void function watchExtendedSelectionMode()
if isSelectionModeActive()
	cwdExtendedSelection.ScheduleID = scheduleFunction("watchExtendedSelectionMode", 10)
else
	StopExtendedSelectionModeWatch()
endIf
endFunction

void function cwdUpdateTitleColumnsAndRows()
;QuickSettings must call this after updating Table Pointer.
; UpdateTablePointer runs twice because the first time it comes from TableEnteredEvent, but not all the document data is in place,
;so this update of the word row and columns collections is a safety net so we don't lose those settings in practice, when the user navigates.
;The settings collections still had the data, but wordFunc didn't get a clean copy:
;No need to worry about the instances when Override is off.
; A null table pointer has already then been created, and these values are filled or emptied..
If OverrideDocNamedTitles()
	cWDCurrentTable.headerColumn = RowTitlesColumn()
	cWDCurrentTable.headerRow = ColumnTitlesRow()
EndIf
endFunction

void function updateTableManually()
var
	int iTableCount
;barebones table construction
;Mainly to support insert v f you just open or alt tab to a document, have not changed any navigation,
;and then want to push insert v; will give you table basics before you try to set or check any setting.
var object oWord = GetOWord()
iTableCount = oWord.activeDocument.tables.count
cWDActiveDocument.tableCount = iTableCount
if !collectionItemsCount (cWDCurrentTable)
	cWDCurrentTable = new collection
endIf
cWDCurrentTable.name = GetTableName()
cWDCurrentTable.index = GetTableIndex()
cWDCurrentTable.nestingLevel = getTableNestingLevel()
cWDCurrentTable.caption = GetTableCaption()
cWDCurrentTable.summary = GetTableSummary()
endFunction

void function UpdateCWDCurrentTableOnCellChange(int nNewCol, int nNewRow,
	int nNewNesting, int nNewRowColCount,
	string ColHeader, string RowHeader,
	int nPrevCol, int nPrevRow,
	int nPrevNesting, int nPrevRowColCount)
var
	collection c,
	string sPrevRowHeaderText,
	string sPrevColumnHeaderText
;because character or word navigation over and end of cell marker
;will cause the prev variables recieved by the event to be 0,
;store the prev values in the table collection by using the values from the previous event:
cWDCurrentTable.PrevRowColumnCount = cWDCurrentTable.rowColumnCount
cWDCurrentTable.rowColumnCount = nNewRowColCount
if nNewRow > cWDCurrentTable.rowCount
	;user may have pressed Tab on the last cell,
	;or may have added more rows to the table:
	cWDCurrentTable.PrevRowCount = cWDCurrentTable.rowCount
	cWDCurrentTable.rowCount = GetTableRowCount()
	cWDCurrentTable.rowCount = nNewRow
EndIf
c = new collection
c.column = nNewCol
c.row = nNewRow
c.prevColumn = cWDCurrentTable.cell.column
c.prevRow = cWDCurrentTable.cell.row
if GetSelectionContextFlags() & selCtxShading
	c.priorCellPatternAndShading = cwdCurrentTable.cell.cellPatternAndShading
	c.cellPatternAndShading = GetCellPatternAndShadingDescription(GetCurrentCell())
EndIf
sPrevRowHeaderText = cWDCurrentTable.cell.rowHeaderText
sPrevColumnHeaderText = cWDCurrentTable.cell.columnHeaderText
cWDCurrentTable.cell = c
if !OverrideDocNamedTitles() 
&& !cWDCurrentTable.HasBookmarkedHeaders  ; Only use automated headers if titles are off and bookmarked headers are absent.
	; when old-style bookmark headers fail,
	; always assume marked headers, since we can now get them internally.
	; The exception is protected forms where automatic headers make no sense:
	if ! IsActiveDocumentProtectedForm()
		if stringIsBlank (stringReplaceSubstrings (colHeader, scCellMarker, cscNull))
			colHeader = getColumnHeader (TRUE)
		endIf
		; update the coordinates if we got a header text from the bookmark or the builtin functions:
		if ! stringIsBlank (colHeader)
			cWDCurrentTable.headerRow = 1 ; From the builtin headers.
		endIf
		; when old-style bookmark headers fail,
		; always assume marked headers, since we can now get them internally.
		if stringIsBlank (stringReplaceSubstrings (rowHeader, scCellMarker, cscNull))
			rowHeader = getRowHeader (TRUE)
		endIf
		; update the coordinates if we got a header text from the bookmark or the builtin functions:
		if ! stringIsBlank (RowHeader)
			cWDCurrentTable.headerColumn = 1 ; From the builtin headers.
		endIf
		if cWDCurrentTable.headerRow
		&& cWDCurrentTable.Cell.row > cWDCurrentTable.headerRow
			c.columnHeaderText = GetCellHeaderText(
				ColHeader, TableColumnHeaderType ,nNewCol)
		EndIf
		if cWDCurrentTable.headerColumn
		&& cWDCurrentTable.Cell.column > cWDCurrentTable.headerColumn
			c.rowHeaderText = GetCellHeaderText(
				RowHeader, TableRowHeaderType ,nNewRow)
		EndIf
	endIf ; end of form field check.
else
	if nPrevCol != nNewCol
		;Update the column header when switching column:
		if cWDCurrentTable.headerRow
		&& cWDCurrentTable.Cell.row > cWDCurrentTable.headerRow
			c.columnHeaderText  = getColumnTitleFromDOM()
		EndIf
		;Now make sure the cached row header is added or removed as needed:
		if cWDCurrentTable.headerColumn
		&& cWDCurrentTable.Cell.Column > cWDCurrentTable.headerColumn
			if c.prevColumn <= cWDCurrentTable.headerColumn
				c.rowHeaderText  = getRowTitleFromDOM()
			else
				c.rowHeaderText  = sPrevRowHeaderText
			EndIf
		else
			c.rowHeaderText  = cscNull
		EndIf
	EndIf
	if nPrevRow != nNewRow
		;Update the row header when switching rows:
		if cWDCurrentTable.headerColumn
		&& cWDCurrentTable.Cell.column > cWDCurrentTable.headerColumn
			c.rowHeaderText = getRowTitleFromDOM()
		EndIf
		;Now make sure the cached column header is added or removed as needed:
		if cWDCurrentTable.headerRow
		&& cWDCurrentTable.Cell.row > cWDCurrentTable.headerRow
			if c.prevRow <= cWDCurrentTable.headerRow
				c.columnHeaderText  = getColumnTitleFromDOM()
			else
				c.columnHeaderText  = sPrevColumnHeaderText
			EndIf
		else
			c.columnHeaderText  = cscNull
		EndIf
	EndIf
EndIf
EndFunction

void function UpdateCWDSelectionContext(int nSelectionContextFlags, int nCurrentContextFlags,
	int nData1, int nData2,
	string sDesc1, string sDesc2, string sDesc3, string sDesc4, string sDesc5)
var
	collection c,
	object o
cWDPrevSelectionContext = CollectionCopy(cWDSelectionContext)
CollectionRemoveAll(cWDSelectionContext)
if !nCurrentContextFlags
	return
EndIf
if !nData1
&& !nData2
&& !sDesc1
&& !sDesc2
&& !sDesc3
&& !sDesc4
&& !sDesc5
	return
EndIf
if nSelectionContextFlags & selCtxFormFields
	c = new collection
	c.prompt = sDesc1
	c.value = sDesc2
	c.type = nData1
	c.state = nData2
	c.position = sDesc3
	c.help = sDesc4
	cWDSelectionContext.formField = c
EndIf
if nSelectionContextFlags&selCtxFields
	c = new collection
	c.prompt = sDesc1
	c.value = sDesc2
	c.type = nData1
	if !c.type
		c.type = GetObjectSubtypeCode()
		if !c.type
			if StringContains(sDesc1,scHyperlink)
				c.type = WT_LINK
			elif stringContains(sDesc1,SC_EMBED)
			|| stringContains(sDesc1,stringUpper(scLink))
				c.type = WT_EMBEDDEDOBJECT
			EndIf
		EndIf
	EndIf
	c.brlType = GetFieldTypeBrlString(nData1)
	c.state = nData2
	c.position = sDesc3
	c.help = sDesc4
	var object oWord = GetOWord()
	o = oWord.selection.characters.first.inlineShapes(1)
	if o
		c.height = o.height
		c.width = o.width
		c.alternativeText = o.alternativeText
		c.oleType = DetermineInlineShapeOleType(o)
	EndIf
	cWDSelectionContext.field = c
EndIf
if nSelectionContextFlags & selCtxComments
	c = new collection
	c.author = sDesc1
	c.initials = sDesc2
	c.text = sDesc3
	c.date = sDesc4
	c.documentText = sDesc5
	cWDSelectionContext.comment = c
EndIf
if nSelectionContextFlags & selCtxFootnotes
	c = new collection
	c.reference = sDesc1
	c.text = sDesc2
	cWDSelectionContext.footnote = c
EndIf
if nSelectionContextFlags & selCtxEndnotes
	c = new collection
	c.reference = sDesc1
	c.text = sDesc2
	cWDSelectionContext.endnote = c
EndIf
if nSelectionContextFlags & selCtxBookmarks
	c = new collection
	c.name = sDesc1
	cWDSelectionContext.bookmark = c
EndIf
if nSelectionContextFlags & selCtxRevisions
	c = new collection
	c.type = nData1
	c.author = sDesc1
	c.initials = sDesc2
	c.text = sDesc3
	c.date = sDesc4
	cWDSelectionContext.revision = c
EndIf
if nSelectionContextFlags & selCtxShapes
	c = new collection
	c.type = nData1
	c.builtinType = nData2
	c.name = sDesc1
	c.text = sDesc2
	c.dimentions = sDesc3
	o = oWord.selection.characters.first.inlineShapes(1)
	if o
		c.height = o.height
		c.width = o.width
		c.alternativeText = o.alternativeText
		c.oleType = DetermineInlineShapeOleType(o)
	EndIf
	cWDSelectionContext.shape = c
EndIf
if nSelectionContextFlags & selCtxEmbeddedObjects
	c = new collection
	c.type = nData1
	c.builtinType = nData2
	c.name = sDesc1
	c.text = sDesc2
	c.dimentions = sDesc3
	cWDSelectionContext.object = c
EndIf
EndFunction

void function SayOrBufferFormattedMessage(int iOutPutType,
	string sTextLong, string sTextShort)
var
	int iSpeak
iSpeak = ShouldItemSpeak(iOutputType)
if UserBufferIsActive()
|| iOutputType == OT_USER_BUFFER
	if iSpeak == message_long
		UserBufferAddText(sTextLong)
	else
		UserBufferAddText(sTextShort)
	EndIf
else
	SayFormattedMessage(iOutputType, sTextLong, sTextShort)
endIf
EndFunction

void function toggleSelCTXFlag(int iFlagSet, int iFlag)
var
	int bMAGicOnly = (getRunningFSProducts() == product_MAGic)
if iFlagSet & IFlag
	iFlagSet = iFlagSet&~iFlag
else
	iFlagSet = iFlagSet|iFlag
endIf
if bMAGicOnly
	SetSelectionContextFlags(iFlagSet,Word_SelCtx_BeforeCaretMoveMask_MAGic)
else
	SetSelectionContextFlags(iFlagSet,Word_SelCtx_BeforeCaretMoveMask)
endIf
endFunction

void function SelectionContextChangedEvent(
	int nSelectionContextFlags, int nPrevSelectionContextFlags,
	int nData1, int nData2,
	string sDesc1, string sDesc2, string sDesc3, string sDesc4, string sDesc5)
if IsReadOnlyVirtualMessage()
	return
endIf
var
	int nCurrentcontextFlags,
	int ActiveFormIsProtected = IsActiveDocumentProtectedForm(),
	int bSayAll,
	int iOutputType
BrailleClearPendingFlashMessages()
nCurrentContextFlags = GetSelectionContext()
UpdateCWDSelectionContext(nSelectionContextFlags, nCurrentContextFlags,
	nData1, nData2, sDesc1, sDesc2, sDesc3, sDesc4, sDesc5)
if DocumentUpdateNotificationMode() == off
	return
endIf
bSayAll = SayAllInProgress()
if bSayAll
	iOutputType=ot_line
else
	iOutputType=ot_help
endIf
If nSelectionContextFlags & selCtxRevisions
	SaySelectionContextRevisionChange(bSayAll,iOutputType,
		nSelectionContextFlags,nCurrentContextFlags)
elif nSelectionContextFlags & selCtxBookmarks
	;use ot_line as output type,
	;since structured braille already shows the bookmark name.
	SaySelectionContextBookmarkChange(bSayAll,ot_line,
		nSelectionContextFlags,nCurrentContextFlags )
elif nSelectionContextFlags&selCtxFields
	if NavigatingBackFromDocumentLink()
		ClearLinkNavTracking()
		return
	EndIf
	SaySelectionContextFieldChange(bSayAll,iOutputType,
		nSelectionContextFlags,nCurrentContextFlags)
elif nSelectionContextFlags&selCtxFormFields
	if IsNewFormFieldByName (sDesc1) 
	; Prevents unprotected forms from being constantly silent.
	|| !ActiveFormIsProtected
		SaySelectionContextFormfieldChange(bSayAll,iOutputType,
			nSelectionContextFlags,nCurrentContextFlags)
	endIf
	c_WordFuncTester.FormFieldNameFromSelectionChange = sDesc1
endIf
; if form field is not active, clear the cache in case user returns to same field same place:
if  (nSelectionContextFlags & ~ selCtxFormFields )
	c_WordFuncTester.FormFieldNameFromSelectionChange = cscNull
EndIf
EndFunction

void function SaySelectionContextCommentChange(int bSayAll,
	int iOutputType, int nSelectionContextFlags, int nCurrentContextFlags)
if !(nCurrentContextFlags & selCtxComments)
	if !BrailleIsInputSource()
		sayFormattedMessageWithVoice(vctx_message,iOutputtype,
			msgOutOfCommentedText1_L,msgOutOfCommentedText1_S)
	else
		BrailleMessageUsingOutputType(iOutputtype,
			msgOutOfCommentedText1_L,msgOutOfCommentedText1_S)
	endIf
	return
endIf
if BrailleIsInputSource()
	;Structured braille manages the rest.
	return
endIf
if !(QuickNavKeyTrapping()
&& (GetCurrentScriptKeyName()==ksNextComment
|| GetCurrentScriptKeyName()==ksPriorComment))
	if cWDSelectionContext.comment.author
		SayFormattedMessageWithVoice(vctx_message,ot_line,
			formatString(msgComment1_l,
				cWDSelectionContext.comment.text,
				cWDSelectionContext.comment.author),
			formatString(msgComment1_S,
				cWDSelectionContext.comment.text,
				cWDSelectionContext.comment.author))
	elIf cWDSelectionContext.comment.initials
		SayFormattedMessageWithVoice(vctx_message,ot_line,
			formatString(msgComment1_l,
				cWDSelectionContext.comment.text,
				cWDSelectionContext.comment.initials),
			formatString(msgComment1_S,
				cWDSelectionContext.comment.text,
				cWDSelectionContext.comment.initials))
	EndIf
EndIf
EndFunction

void function SaySelectionContextRevisionChange(int bSayAll,
	int iOutputType, int nSelectionContextFlags, int nCurrentContextFlags)
var
	int iRevisionDetection,
	string revisionText,
	string smsg_l,
	string smsg_s
if BrailleInUse()
	ChangeBrailleCursorDots(cWDSelectionContext.revision.type)
EndIf
if BrailleIsInputSource()
	;Structured braille manages the rest.
	return
endIf
if cWDSelectionContext.revision.type == 0
	;now out of revision
	return
endIf
iRevisionDetection = RevisionDetection() & (~SpeakRevCount)
sMsg_l = GetRevisionTypeString(cWDSelectionContext.revision.type)
if cWDSelectionContext.revision.type == wdRevisionDelete then 
; for deleted revisions, we must propend the type string with the revision text.
; This is because while the text is on screen, it's not part of the document anymore.
	revisionText = cWDSelectionContext.revision.text
	smsg_l = revisionText + cscSpace + smsg_l
endIf
smsg_s = smsg_l
if iRevisionDetection == SpeakRevTypeAuthor
	sMsg_l = smsg_l+cscSpace+
		formatString(msgRevAuthor_L, cWDSelectionContext.revision.author)
	smsg_s = smsg_s+cscSpace+
		formatString(msgRevAuthor_s,cWDSelectionContext.revision.author)
elIf iRevisionDetection == SpeakRevTypeAuthorDate
	sMsg_l = smsg_l+cscSpace+
		formatString(msgRevAuthor_L,cWDSelectionContext.revision.author)
		+cscSpace
		+formatString(msgRevDate_L,cWDSelectionContext.revision.date)
	sMsg_s = smsg_s+cscSpace+
		formatString(msgRevAuthor_s,cWDSelectionContext.revision.author)
		+cscSpace
		+formatString(msgRevDate_s,cWDSelectionContext.revision.date)
EndIf
SayFormattedMessageWithVoice(vctx_message,ot_line,sMsg_l,sMsg_s)
if cWDSelectionContext.revision.text == cscSpace
	Say(cmsgSpace1,ot_word,true)
EndIf
EndFunction

void function SaySelectionContextBookmarkChange(int bSayAll,
	int iOutputType, int nSelectionContextFlags, int nCurrentContextFlags )
if BrailleIsInputSource()
	;structured braille shows the bookmark.
	return
endIf
if BookmarkDetection() == wdVerbosityHigh
&& cWDSelectionContext.bookmark.name
	sayUsingVoice(vctx_message,cWDSelectionContext.bookmark.name,iOutputType)
EndIf
EndFunction

void function UpdateExtendedSelectionModeWatch()
;This function should be called after the selection has occurred,
;and before the text of the selection is to be announced by the script.
cWDExtendedSelection.ScriptSelectionByUnitModeKeyPressed = false
cWDExtendedSelection.charCount = GetSelectedCharCount()
EndFunction

void function ExtendedSelectionByUnitScriptRunEvent()
;Calling this function from the extended selection by unit script
;allows the selection changed event to not speak the selection,
;and the script to speak the selection on demand by making a function call.
;This function should be called immediately before the key is passed through to the application.
;The UpdateExtendedSelectionModeWatch function should be run after the selection change,
;and it clears the variable initialized here.
cWDExtendedSelection.ScriptSelectionByUnitModeKeyPressed = true
EndFunction

void function setViewType()
var object oWord = GetOWord()
cWDActiveDocument.viewType = oWord.ActiveDocument.activeWindow.view.type
c_WordFuncTester.ViewTick = getTickCount()
endFunction

int function getViewType()
; Refresh no more often than once in a second.
if !(c_WordFuncTester.ViewTick && getTickCount() -c_WordFuncTester.ViewTick < 1000)
	setViewType()
endIf
return cWDActiveDocument.viewType
endFunction

int function IsReadingViewActive()
return getViewType() == wdReadingView
EndFunction

int Function IsOutlineViewActive()
return getViewType() == wdOutlineView
	|| getViewType() == wdMasterView
EndFunction

string Function GetOutlineViewStatusMessage(int iOutputType)
var
	string sMsg,
	object oCommandBar,
	int HeadingLevel,
	string sLevel
var object oWord = GetOWord()
oCommandBar = oWord.activeDocument.commandBars(cbOutlining)
sLevel = oCommandBar.controls(lbxShowLevel).text
if sLevel == scShowAllLevels_2007
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgAllHeadingsAreVisible1_L,msgAllHeadingsAreVisible1_s)
	if oCommandBar.controls(btnFirstLineOnly).state == VBTrue
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgTheFirstLine1_L,msgTheFirstLine1_s)
	else
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgAllTextIsVisible1_L,msgAllTextIsVisible1_s)
	endIf
elif sLevel == scShowLevel1_2007
	headingLevel = 1
elif sLevel == scShowLevel2_2007
	let	headingLevel = 2
elif sLevel == scShowLevel3_2007
	headingLevel = 3
elif sLevel == scShowLevel4_2007
	headingLevel = 4
elif sLevel == scShowLevel5_2007
	let	headingLevel = 5
elif sLevel == scShowLevel6_2007
	let	headingLevel = 6
elif sLevel == scShowLevel7_2007
	headingLevel = 7
elIf sLevel == scShowLevel8_2007
	headingLevel = 8
ElIf sLevel == scShowLevel9_2007
	HeadingLevel = 9
endIf
if HeadingLevel
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgLevel1_L, msgLevel1_S,
		intToString(headingLevel))
endIf
return sMsg
EndFunction

string function GetActiveDocumentViewName()
var
	int iView
var object oWord = GetOWord()
iView = oWord.activeDocument.activeWindow.view.type
if iView == wdDraftView
	return msgDraft
ElIf iView == wdOutlineView
	return msgOutline
ElIf iView == wdPrintView
	return msgPrint
ElIf iView == wdPrintPreview
	return msgPrintPreview
ElIf iView == wdMasterView
	return msgMaster
ElIf iView == wdWebView
	return msgWeb
ElIf iView == wdReadingView
	return msgReading
Else
	return cScNull
EndIf
EndFunction

void function TrackEvent(int EventType)
var	int iLastTime = cLastTracked.eventTime
cLastTracked.eventTime = GetTickCount()
if cLastTracked.event == Event_CellChanged
&& EventType == event_FocusChanged
&& cLastTracked.eventTime-iLastTime <= 300
	;Typically, when inserting a new table from a ribbon dialog,
	;the menu mode event will most likely fire first,
	;then the table entered event and the cell changed event fires when returning to the document,
	;and then the focus changed event fires last.
	;Also, focus change event may fire after cell changed event
	;when returning to a table in the document from a Quick Setting dialog.
	;We want to ignore retarded focus changed events that fire after cell changed events
	;because tracking it will cause silence when navigating to the next cell.
	;Typically we want to not speak a cell change when it happens after a focus change,
	;but when the focus change event fires retardedly after the cell change
	;this messes up the logic.
	;This is why the focus change event firing after a cell changed event is ignored.
	return
EndIf
cLastTracked.prevEvent = cLastTracked.event
cLastTracked.event = eventType
endFunction

void function TrackLinkNavigation(int direction)
cLastLinkNav.direction = direction
cLastLinkNav.time = getTickCount()
if direction == MOVE_FORWARD
	;Keep track of the fact that a forward navigation was performed in this document
	;so that we know move backward is a legitimate move:
	cWDActiveDocument.NavigatedForward = true
EndIf
EndFunction

void function ClearLinkNavTracking()
;note that move_forward is 0,
;so we test for time instead of direction
;when determine if there was a recent link navigation action
if cLastLinkNav.time
	CollectionRemoveAll(cLastLinkNav)
EndIf
EndFunction

void function NavigatingBackFromDocumentLink()
return GetTickCount()-cLastLinkNav.time <= cLastLinkNavTimeWaitThreshold
	&& cLastLinkNav.direction == move_back
EndFunction

Void Function GotoHyperlink()
var object oWord = GetOWord()
oWord.selection.hyperlinks(1).follow
EndFunction

void function ClearAnyScheduledDocumentTopAndBottomEdgeAlert()
if giScheduledDocumentTopAndBottomEdgeAlert
	UnScheduleFunction(giScheduledDocumentTopAndBottomEdgeAlert)
	giScheduledDocumentTopAndBottomEdgeAlert = 0
endIf
EndFunction

int Function GetWordVersion()
return GetProgramVersion(GetAppFilePath())
EndFunction

int Function isAppObjInvalid()
var object oWord = GetOWord()
if !oWord
	return true
else
	return false
EndIf
EndFunction

int function InDocument()
var object oWord = GetOWord()
return WindowCategoryIsWordDocument()
	&& (oWord.ActiveDocument || IsWordDocumentActive())
EndFunction

string Function GetDocumentProtectionStatusMessage()
var
	int type
type = cWDActiveDocument.protectionType
if type == wdAllowOnlyComments
	return FormatString(msgProtectionStatus,msgAllowOnlyComments)
elif type == wdAllowOnlyFormFields
	return FormatString(msgProtectionStatus,msgAllowOnlyFormFields)
elif type == wdAllowOnlyRevisions
	return FormatString(msgProtectionStatus,msgAllowOnlyRevisions)
elif type == wdNoProtection
	return FormatString(msgProtectionStatus,msgNoProtection)
ElIf type == wdAllowOnlyReading
	return FormatString(msgProtectionStatus,msgReadOnly)
endIf
EndFunction

int function IsActiveDocumentProtected()
if CollectionItemExists(cWDActiveDocument,"name")
	return cWDActiveDocument.protectionType != wdNoProtection
else
	if IsAppObjInvalid()
		;the app obj may be invalid if
		;the first message opened after Outlook starts is a new message.
		InitializeAppObj()
	EndIf
	var object oWord = GetOWord()
	return oWord.ActiveDocument.protectionType != wdNoProtection
EndIf
EndFunction

string Function GetActiveDocumentProtectionStatus()
var	int type = cWDActiveDocument.protectionType
if type == wdAllowOnlyComments
	return FormatString(msgProtectionStatus,msgAllowOnlyComments)
elif type == wdAllowOnlyFormFields
	return FormatString(msgProtectionStatus,msgAllowOnlyFormFields)
elif type == wdAllowOnlyRevisions
	return FormatString(msgProtectionStatus,msgAllowOnlyRevisions)
elif type < 0 then ; == wdNoProtection
	return FormatString(msgProtectionStatus,msgNoProtection)
ElIf type == wdAllowOnlyReading
	return FormatString(msgProtectionStatus,msgReadOnly)
endIf
EndFunction

string function GetActiveDocumentName()
return cWDActiveDocument.name
EndFunction

int function InDocumentMainText()
var object oWord = GetOWord()
return WindowCategoryIsWordDocument()
	&& oWord.selection.storytype == wdMainTextStory
EndFunction

void function initMultilevelListNamesWithWord2003ObjectNames()
if c_MultilevelListObjects
&& CollectionItemCount(c_MultilevelListObjects)
	return
endIf
if !InMultilevelListPane() return EndIf
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return endIf
var object treeWalker = oUIA.CreateTreeWalker(oUIA.CreateRawViewCondition())
SetCurrentElementToDeepestFocusElement(oUIA,treeWalker)
var int i
for i = 1 to 3 if !treeWalker.GoToParent() return EndIf endFor
if treeWalker.currentElement.controlType != UIA_PaneControlTypeId
|| treeWalker.currentElement.name != UIAName_pane_MultilevelList
	return
endIf
var object typeCondition = oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_GroupControlTypeId)
var object nameCondition = oUIA.CreateStringPropertyCondition(UIA_NamePropertyId,UIAName_Group_ListLibrary)
var object libraryParentCondition = oUIA.CreateAndCondition(typeCondition,nameCondition)
if !libraryParentCondition return endIf
var object libraryParent = treeWalker.currentElement.FindFirst(TreeScope_Subtree,libraryParentCondition)
if !libraryParent then return endIf
typeCondition = oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_ListItemControlTypeId)
var object  libraryList = libraryParent.FindAll(TreeScope_Subtree,typeCondition)
if !libraryList
|| !libraryList.count
	return
endIf
var int count = (libraryList.count)-1
var string s
c_MultilevelListObjects = new collection
;the first object is always named "(None)", so its name does not need translation into a shorter form.
for i = 1 to count
	s = libraryList(i).name
	c_MultilevelListObjects[s] = StringSegment(msgMultilevelListNamesFromWord2003,cscBufferNewLine,i)
endFor
EndFunction

string function GetWord2003MultiLevelListObjectNameOfFocusObject()
if !InMultilevelListPane() return cscNull endIf
initMultilevelListNamesWithWord2003ObjectNames()
var string objName = GetObjectName()
var string shortName = c_MultilevelListObjects[objName]
if shortName
	return shortName
else
	return objName
endIf
EndFunction

int function InMultilevelListPane()
return !UserBufferIsActive()
	&& GetObjectSubtypeCode() == WT_GRID
	&& GetObjectName(0,3) == UIAName_pane_MultilevelList
EndFunction

int function UsingShortNameOfMultiLevelListObject()
return InMultilevelListPane()
	&& CollectionItemExists(c_MultilevelListObjects,GetObjectName())
EndFunction

string function CleanUpDocumentTextList(string sList)
var	string s = sList
s = StringReplaceChars(s,vbcr,cscSpace)
s = StringReplaceChars(s,scTab,cscSpace)
return s
EndFunction

void Function RelocateCursorInDocument(int iOldPos,int iNewPos)
if iOldPos == iNewPos return endIf
var	int iReposition
if iNewPos > iOldPos
	iReposition = (iNewPos-(iOldPos+1))*-1
else
	iReposition = iOldPos-iNewPos
endIf
var object oWord = GetOWord()
if oWord.selection.move(wdCharacter,iReposition)
	RunSelectionContextEvents()
endIf
EndFunction

int function getDocumentwordCountThreshold ()
if !c_WordFuncTester.wordCountThreshold
	c_WordFuncTester.wordCountThreshold = GetNonJCFOption ("WordCountThresholdForSpellingErrors")
endIf
return c_WordFuncTester.wordCountThreshold
endFunction

int function getActiveDocumentWordCount()
var
	int wordCount,
	object oWord,
	object ActiveDocument
oWord = GetOWord()
ActiveDocument = oWord.ActiveDocument
if !activeDocument return 0 endIf
wordCount = ActiveDocument.Words.Count
return wordCount
endFunction

int function ShouldAbortFromLargeDocumentForProofingErrors()
var int wordCount = getActiveDocumentWordCount()
if wordCount < GetDocumentwordCountThreshold() return FALSE endIf
var
	string dialogText,
	int dialogFlags = mb_YesNoCancel|MB_ICONWARNING|MB_SYSTEMMODAL
dialogText = formatString (msgShouldAbortFromLargeDocumentDialogText, IntToString(wordCount), IntToString(c_WordFuncTester.wordCountThreshold))
var int choice = exMessageBox (dialogText, msgShouldAbortFromLargeDocumentDialogTitle, dialogFlags)
; yes means go ahead, e.g. will return FALSE from this function
return choice != IDYes
endFunction

int function isActiveDocumentReadOnly()
return cWDActiveDocument.readOnly
endFunction

Int Function IsScreenUpdateEnabled()
var object oWord = GetOWord()
return oWord.screenUpdating == VBTrue
endFunction

int Function GetDocPageCount()
return oWord.selection.information(wdNumberOfPagesInDocument)
EndFunction

int function GetDocSectionCount()
var object oWord = GetOWord()
return oWord.activeDocument.Sections.count
EndFunction

int  Function IsEndOfDocument(object range)
var object oWord = GetOWord()
return range.end == oWord.activeDocument.content.end-1
EndFunction

Int Function atStartOfDocument()
var object oWord = GetOWord()
return oWord.selection.range.start==oWord.activeDocument.content.start
EndFunction

Int Function atEndOfDocument()
var object oWord = GetOWord()
return oWord.selection.end==oWord.activeDocument.content.end-1
endFunction

int Function TotalDocumentCharCount()
var object oWord = GetOWord()
return oWord.activeDocument.content.end-1
EndFunction

int Function GetCurCharPos()
var object oWord = GetOWord()
var	object oSelection = oWord.selection
if oSelection.start != oSelection.end
	return 0 ;text is selected.
endIf
return oWord.selection.start
EndFunction

int Function isTextSelected()
var object oWord = GetOWord()
var object oSelection = oWord.selection
return oSelection.start != oSelection.end
EndFunction

int function GetSelectedCharCount()
;count returns 1 when no text is selected as well as when one character is selected,
;so we compare start to end to determine if text is actually selected
var object oWord = GetOWord()
Var	object oSelection = oWord.selection
if oSelection.start != oSelection.end
	return oSelection.range.characters.count
else
	return 0
EndIf
EndFunction

int function IsEntireDocumentSelected()
var object oWord = GetOWord()
var	object oSelection = oWord.selection
return oSelection.range.start == oWord.activeDocument.range.start
	&& oSelection.range.end == oWord.activeDocument.range.end
EndFunction

int function GetDocumentSelectedTextLength()
var object oWord = GetOWord()
return StringLength(oWord.selection.range.text)
EndFunction

int Function isSelectionModeActive()
var object oWord = GetOWord()
return oWord.selection.information(wdSelectionMode)
EndFunction

int function GetExtendedSelectionSelectedCharCount()
return cWDExtendedSelection.charCount
EndFunction

int function IsExtendedSelectionModeWatchActive()
return cWDExtendedSelection.status == on
EndFunction

object Function GetCurrentTable()
var object oWord = GetOWord()
var object o = oWord.selection.range
o.Collapse
o.Expand(wdTable)
return o.Tables(1)
EndFunction

object Function GetCurrentCell()
var
	object oRange,
	object oCell
var object oWord = GetOWord()
oRange = oWord.Selection.Range
oRange.Collapse
oRange.expand(wdCell)
oCell = oRange.Cells(1)
If oCell.row.cells.count == 0 
	oRange = oWord.selection.range
	oRange.Collapse
	oRange.expand(wdCell)
	oCell = oRange.Cells(1)
EndIf
return oCell
EndFunction

int Function getDocTableCount()
;strip off last delimiter as it gives wrong count by 1.
return StringSegmentCount(GetListOfTables(list_item_separator),list_item_separator)-1
EndFunction

int function getDocumentTableIndex()
return cWDCurrentTable.index
endFunction

int function getActiveTableCellColumn()
return cWDCurrentTable.cell.column
endFunction

int function getActiveTableCellRow()
return cWDCurrentTable.cell.row
endFunction

int function AtFirstCellInDocumentTable()
return cWDCurrentTable.cell.column == 1
	&& cWDCurrentTable.cell.row == 1
EndFunction

int function AtLastCellInDocumentTable()
return cWDCurrentTable.cell.column == cWDCurrentTable.rowColumnCount
	&& cWDCurrentTable.cell.row == cWDCurrentTable.rowCount
EndFunction

int function OnEndOfCellOrRowMarker()
return InTable()
	&& cWDCurrentTable.index
	&& !cWDCurrentTable.cell.row
	&& !cWDCurrentTable.cell.column
EndFunction

int function GetDocumentTableCellCoordinates(int byRef column, int byRef row)
if cWDCurrentTable.cell.column && cWDCurrentTable.cell.row
	column = cWDCurrentTable.cell.column
	row = cWDCurrentTable.cell.row
	return true
EndIf
return false
EndFunction

int function GetTableNestingLevel()
if WindowCategoryIsWordDocument()
&& InTable()
	return cWDCurrentTable.nestingLevel
else
	return GetTableNestingLevel()
EndIf
EndFunction

int function IsTableUniform()
return cWDCurrentTable.uniform
EndFunction

Int Function IsCaretInTable()
; InTable function does not work when selecting text.
var object oWord = GetOWord()
if oWord.selection.information(wdWithinTable)
	return true
endIf
return false
EndFunction

int function IsDocumentTableActive()
return cWDCurrentTable.index != 0
EndFunction

int function DocumentSelectionIsInTable()
;this can be used to test if the document selection is in a table
;while focus is in a menu or dialog:
var object oWord = GetOWord()
return oWord.selection.information(wdWithinTable) == VBTrue
EndFunction

int function IsTableChangingSize()
return inTable()
	&& !IsCaretInTable()
EndFunction

int function IsCellTextBlank(string sCellText)
return !sCellText
	|| StringIsBlank(sCellText)
	|| (StringLength(sCellText) <=  3 && StringLeft(sCellText,1) == Vbcr)
	|| StringCompare(sCellText,scTblCellMarker) == 0
EndFunction

string Function GetCellNestingLevel(int iOutputType)
if !cWDCurrentTable.nestingLevel
	return cscNull
EndIf
if cWDCurrentTable.nestingLevel > 1
	return FormatOutputMessage(iOutputType,true,
		msgNestingLevel1_L, msgNestingLevel1_S,
		intToString(cWDCurrentTable.nestingLevel))
else
	return FormatOutputMessage(iOutputType,true,
		msgTopLevel1_L, msgTopLevel1_S)
EndIf
EndFunction

string function GetCurrentCellHeadingStyle()
var
	object oRange,
	string sStyle
if !inTable()
	return CscNull
EndIf
oRange = getCurrentCell()
sStyle = oRange.range.style.NameLocal
if !StringContains(sStyle,scHeading)
	return cscNull
EndIf
return sStyle
EndFunction

Void Function ScrollTableIntoView(int bStart)
var object oWord = GetOWord()
oWord.activeDocument.activeWindow.scrollIntoView(GetCurrentTable().range,bStart)
EndFunction

int function GoToNextCellInTable()
;moves to next cell in table without regard to whether or not it is in the same row.
var object oWord = GetOWord()
return oWord.selection.move(wdCell,1) != 0
EndFunction

int function GoToPriorCellInTable()
;moves to prior cell in table without regard to whether or not it is in the same row.
var object oWord = GetOWord()
return oWord.selection.move(wdCell,-1) != 0
EndFunction

void function SetDocumentTableNavType(int tableNav)
cLastTracked.tableNavInWordDocument = tableNav
cLastTracked.tableNavInEditableMessage = tableNav
EndFunction

void function SayCellHeaders(Optional Int OT)
if TestForEndOfCellOrRowMarker(true)
	return
EndIf
var
	int iSpeakTitles
iSpeakTitles = TableTitlesAnnounce()
if (iSpeakTitles & readColumnTitles)
|| OT == OT_USER_REQUESTED_INFORMATION
	SayColumnHeader()
EndIf
if (iSpeakTitles & readRowTitles)
|| OT == OT_USER_REQUESTED_INFORMATION
	SayRowHeader()
endIf
EndFunction

string function GetTableLastCellWarningMessage()
var	string sMsg
if cWDCurrentTable.cell.column == cWDCurrentTable.rowColumnCount
&& cWDCurrentTable.cell.row == cWDCurrentTable.rowCount
	sMsg = msgLastCell1_L
	if !IsActiveDocumentProtected()
	&& !SayAllInProgress()
	&& !QuickKeyNavigationModeActive()
		sMsg = sMsg+cscBufferNewLine+msgWarningCreateCells1_L
	endIf
endIf
return sMsg
EndFunction

string Function GetCellCoordinatesMessage(int iOutputType)
var
	int iSpeak,
	int iColumn,
	int iColumnCount,
	int iRow,
	int iRowCount
iSpeak = ShouldItemSpeak(iOutputType)
if IsReadOnlyVirtualMessage()
	GetCellCoordinates(iColumn,iRow)
	iColumnCount = GetCurrentRowColumnCount()
	iRowCount = GetTableRowCount()
else
	iColumn = cWDCurrentTable.cell.column
	iRow = cWDCurrentTable.cell.row
	iColumnCount = cWDCurrentTable.rowColumnCount
	iRowCount = cWDCurrentTable.rowCount
EndIf
if iSpeak == message_long
	return
		formatString(msgTableColumn1_L,
			intToString(iColumn),
			intToString(iColumnCount))
		+cscBufferNewLine
		+formatString(msgTableRow1_L,
			intToString(iRow),
			intToString(iRowCount))
		+cscBufferNewLine
else
	return
		formatString(msgTableColumn1_S,
			intToString(iColumn),
			intToString(iColumnCount))
		+cscBufferNewLine
		+formatString(msgTableRow1_S,
			intToString(iRow),
			intToString(iRowCount))
		+cscBufferNewLine
EndIf
EndFunction

void function SayCellCoordinatesInfo(optional int iOutputType)
if !iOutputType
	iOutputType = ot_position
EndIf
sayUsingVoice(vctx_message,
	GetCellCoordinatesMessage(ot_user_buffer),
	iOutputType)
if !IsReadOnlyVirtualMessage()
	var	string sLastCellWarning = GetTableLastCellWarningMessage()
	if sLastCellWarning
		sayUsingVoice(vctx_message,sLastCellWarning,ot_help)
		scheduleBrailleFlashMessageWithSpeechOutput(OT_Help, sLastCellWarning)
	EndIf
EndIf
EndFunction

void Function sayCellPromptAndText()
var
	string sCellText,
	string SHeaderText,
	int bSpeakTableDescription
sCellText = GetCell()
sCellText = StringReplaceSubstrings(sCellText,scTblCellMarker,cscNull)
; check for blank cell:
If stringLength(sCellText) == 0
	; blank cell
	;TRUE for JAWS always, but conditional in MAGic:
	if shouldReadBlankCells()
		sCellText = msgBlankCell1_l
	else
		sCellText = cscSpace
	endIf
EndIf
bSpeakTableDescription = TableDescription()
BeginFlashMessage()
if cWDCurrentTable.nestingLevel > 1
	SayUsingVoice(vctx_message,GetCellNestingLevel(ot_position),ot_position)
endIf
if isFormField()
	default::SayObjectTypeAndText()
	SayF1Help()
else
	if bSpeakTableDescription
		sHeaderText = getCurrentTableCellTitle(TableColumnHeaderType)
		if sHeaderText
			SayMessageWithMarkup(ot_user_requested_information,
				FormatString(msgHeaderTemplate,sHeaderText))
		endIf
		sHeaderText = getCurrentTableCellTitle(tableRowHeaderType)
		if sHeaderText
			sayMessageWithMarkup(ot_user_requested_information,
				FormatString(msgHeaderTemplate,sHeaderText))
		endIf
	EndIf
	Say(sCellText,ot_user_requested_information)
endIf
SayCellCoordinatesInfo(ot_user_requested_information)
sayUsingVoice(vctx_message,
	formatString(msgTableNumber,intToString(cWDCurrentTable.index)),
	ot_user_requested_information)
if bSpeakTableDescription
	say(GetCellPatternAndShadingDescription(GetCurrentCell()),ot_user_requested_information)
EndIf
EndFlashMessage()
EndFunction

string function GetCellHeaderText(string sTitle, int HeaderType, int index)
var
	string sText,
	string sEnd
sEnd = stringRight(sTitle,2)
if sEnd == scCellMarker
	sText = stringChopRight(sTitle,2)
else
	sText = sTitle
EndIf
if !sText
|| StringIsBlank(sText)
	;Historically, we have been replacing a blank title
	;with a message telling the user the title is blank:
	if headerType == TableColumnHeaderType
		return formatString(msgColumnNoTitle, IntToString(index))
	elif headerType == TableRowHeaderType
		return formatString(msgRowNoTitle, IntToString(index))
	EndIf
else
	return sText
endIf
EndFunction

string function GetCachedColumnHeaderText()
return cWDCurrentTable.cell.columnHeaderText
EndFunction

string function GetCachedRowHeaderText()
return cWDCurrentTable.cell.rowHeaderText
EndFunction

int function TestForEndOfCellOrRowMarker(optional int bSpeakIfAtEndOfCellOrRowMarker)
if IsVirtualPcCursor() then ; returning from QuickSettings but in an Outlook message:
	return FALSE
endIf
if cwdCurrentTable.index
&& (!cWDCurrentTable.cell.row || !cWDCurrentTable.cell.column)
	if bSpeakIfAtEndOfCellOrRowMarker
		SayFormattedMessage(ot_smart_help,msgEndOfCellOrRowMarker_l,msgEndOfCellOrRowMarker_s)
	endIf
	return true
EndIf
return false
EndFunction

void function WarnOnLastcell(int bNotifyLastCellPosition)
if !SayAllInProgress()
	if !isFormfield()
		;SayFormattedMessageWithVoice(vctx_message, ot_help,msgLastCell1_L,msgLastCell1_S)
		if !quickNavKeyTrapping()
			if bNotifyLastCellPosition
				SayUsingVoice(VCTX_message, cmsgEndOfTable, OT_JAWS_message)
			EndIf
			if TableDescription()
			&& !IsActiveDocumentProtectedForm()
				SayFormattedMessageWithVoice(vctx_message, ot_smart_help, msgWarningCreateCells1_L,msgWarningCreateCells1_S)
				if shouldItemSpeak(OT_Error) == 1
					scheduleBrailleFlashMessageWithSpeechOutput(ot_smart_help, msgWarningCreateCells1_L)
				else
					scheduleBrailleFlashMessageWithSpeechOutput(ot_smart_help, msgWarningCreateCells1_S)
				endIf
			EndIf
		endIf
	endIf
endIf
EndFunction

string Function getColumnTitleFromDOM()
var
	object oCell,
	string sTitle,
	object oTable
if cWDCurrentTable.headerRow >= cWDCurrentTable.cell.row
	return cscNull
EndIf
oCell = GetCurrentCell()
if cWDCurrentTable.uniform
	sTitle = oCell.column.cells(cWDCurrentTable.headerRow).range.text
else
	oTable = getCurrentTable()
	if oTable.rows(cWDCurrentTable.headerRow).cells.count == cWDCurrentTable.rowColumnCount
		sTitle = oTable.rows(cWDCurrentTable.headerRow).cells(cWDCurrentTable.Cell.column).range.text
	else
		sTitle = formatString(msgTableColumn1_L, intToString(cWDCurrentTable.Cell.column), intToString(cWDCurrentTable.rowColumnCount))
	endIf
endIf
return GetCellHeaderText(sTitle, TableColumnHeaderType ,oCell.columnIndex)
EndFunction

string Function getRowTitleFromDom()
var
	object oCell,
	string sTitle,
	int RowCount, ; number of columns in this row
	object oTable
if cWDCurrentTable.headerColumn >= cWDCurrentTable.cell.column
	return cscNull
EndIf
oCell = GetCurrentCell()
if cWDCurrentTable.uniform
	sTitle = oCell.row.cells(cWDCurrentTable.headerColumn).range.text
else
	oTable = getCurrentTable()
	if oTable.columns(cWDCurrentTable.headerColumn).cells.count == cWDCurrentTable.rowCount
		sTitle = oTable.columns(cWDCurrentTable.headerColumn).cells(cWDCurrentTable.cell.row).range.text
	else
		sTitle = formatString(msgTableRow1_L,intToString(cWDCurrentTable.cell.row),intToString(cWDCurrentTable.rowCount))
	endIf
endIf
sTitle = oCell.row.cells(cWDCurrentTable.headerColumn).range.text
return GetCellHeaderText(sTitle, TableRowHeaderType ,oCell.rowIndex)
EndFunction

String Function getCurrentTableCellTitle(int iHeaderType)
if !cWDCurrentTable.cell.column
|| !cWDCurrentTable.cell.row
|| cWDCurrentTable.cell.column < cWDCurrentTable.headerColumn
|| cWDCurrentTable.cell.row < cWDCurrentTable.headerRow
	return cscNull
EndIf
if iHeaderType == TableColumnHeaderType
	return cWDCurrentTable.cell.columnHeaderText
elif iHeaderType == TableRowHeaderType
	return cWDCurrentTable.cell.RowHeaderText
else
	return cscNull
EndIf
EndFunction

String Function getCurrentTableCellColumnTitle()
return getCurrentTableCellTitle(TableColumnHeaderType)
EndFunction

String Function getCurrentTableCellRowTitle()
return getCurrentTableCellTitle(TableRowHeaderType)
EndFunction

void Function sayColumnTitle()
var
	string sTitle
sTitle = getCurrentTableCellColumnTitle()
if sTitle
	ProcessMessage (FormatString(msgHeaderTemplate,sTitle), null(), ot_screen_message, msgColumnTitle, MB_OK|MB_ICONASTERISK)
Elif cWDCurrentTable.headerRow
&& cWDCurrentTable.cell.row == cWDCurrentTable.headerRow
	processMessage(msgTitleRow_l,msgTitleRow_s, ot_error, msgError, MB_OK|MB_ICONERROR)
elif cWDCurrentTable.cell.row < cWDCurrentTable.headerRow
	processMessage(msgColumnPrecedesTitleCol_l,msgColumnPrecedesTitleCol_s, ot_error, msgError, MB_OK|MB_ICONERROR)
EndIf
EndFunction

void Function sayRowTitle()
Var
	string sTitle
sTitle = getCurrentTableCellRowTitle()
if sTitle
	ProcessMessage(FormatString(msgHeaderTemplate,sTitle), cscNull, ot_screen_message, msgRowTitle, MB_OK|MB_ICONASTERISK)
Elif cWDCurrentTable.headerColumn
&& cWDCurrentTable.cell.column == cWDCurrentTable.headerColumn
	ProcessMessage(msgTitleCol_l,msgTitleCol_s, ot_error, msgError, MB_OK|MB_ICONERROR)
elif cWDCurrentTable.cell.column < cWDCurrentTable.headerColumn
	ProcessMessage(msgRowPrecedesTitleCol_l,msgRowPrecedesTitleCol_s, ot_error, msgError, MB_OK|MB_ICONERROR)
EndIf
EndFunction

string Function GetCellPatternAndShadingDescription(optional object oCell)
Var
	object oShading,
	int iBackground,
	int iBackgroundIndex,
	string sBackground,
	int iForeground,
	int iForegroundIndex,
	string sForeground,
	int iPattern,
	string sPattern,
	int iPatternPercentage
if !oCell
	oCell = GetCurrentCell()
EndIf
oShading = oCell.shading
if !oShading
	return cscNull
EndIf
iBackground = oShading.backgroundPatternColor
iBackgroundIndex = oShading.backgroundPatternColorIndex
sBackground = GetColorDescription(iBackground,iBackgroundIndex)
iForeground = oShading.foregroundPatternColor
iForegroundIndex = oShading.foregroundPatternColorIndex
sForeground = GetColorDescription(iForeground,iForegroundIndex)
iPattern = oShading.texture
sPattern = GetPatternDescription(iPattern)
if !iPattern
&& !sBackground
&& !sForeground
	return cscNull
EndIf
iPatternPercentage = GetPatternPercentage(iPattern)
if !IPatternPercentage
&& sBackground
	return FormatString(msgClearShading,sBackground,sPattern)
elif iPatternPercentage < 100
&& sPattern
	return FormatString(msgShadingDesc,sBackground,sPattern)
elif iPattern == wdTextureSolid
	return FormatString(msgSolidShading,sBackground)
elif sPattern
	return FormatString(msgPatternAndShadingDesc,sForeground,sPattern,sBackground)
else
	return cscNull
EndIf
EndFunction

string function GetTableScreenSensitiveHelpInfo()
var
	string sHelp,
	object oTable,
	object oCell,
	int iTableIndex,
	int iColumn,
	int iRow,
	int iColumnCount,
	int iRowCount,
	int iHeightRule,
	int iVerticalAlignment,
	int iTableSpacing,
	int iTableTopPadding,
	int iTableBottomPadding,
	int iTableLeftPadding,
	int iTableRightPadding,
	string sCellBorderInfo,
	string sTableBorderInfo
if !(WindowCategoryIsWordDocument() && InTable())
	return cscNull
EndIf
oTable = GetCurrentTable()
oCell = GetCurrentCell()
iTableIndex = cWDCurrentTable.index
iColumn = cWDCurrentTable.cell.column
iRow = cWDCurrentTable.cell.row
iColumnCount = cWDCurrentTable.rowColumnCount
iRowCount = oTable.Rows.count
iTableIndex = cWDCurrentTable.index
if cWDCurrentTable.uniform
	sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
		msgCellHelp1_L, msgCellHelp1_S,
		intToString(iColumn), intToString(iRow), intToString(iTableIndex),
		intToString(iRowCount), intToString(iColumnCount))
else
	sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
		msgCellHelp2_L, msgCellHelp2_S,
		intToString(iColumn), intToString(iRow), intToString(iTableIndex),
		intToString(iRowCount), intToString(iColumnCount))
/* !!!!!!! ToDo: Can we really figure out the row/column span?
	if iRowSpan
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			msgRowSpan,msgRowSpan)
	Else
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			msgColumnSpan,msgColumnSpan)
	EndIf
*/
endIf
if cWDCurrentTable.nestingLevel > 1
	sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
		msgThisTableIsNested1_L,msgThisTableIsNested1_l)
	sHelp = sHelp + GetCellNestingLevel(ot_user_buffer)
	if getVerbosity() == beginner
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			msgNestingExplanation1_L,msgNestingExplanation1_L)
	endIf
endIf
sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
	formatString(msgReadCellLine1_L), FormatString(msgReadCellLine1_S))
if !isFormField()
&& !isActiveDocumentProtected()
	if oTable.AllowAutoFit == VBTrue
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			msgTableAutoFitHelpOn,msgTableAutoFitHelpOn)
	else
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			msgTableAutoFitHelpOff,msgTableAutoFitHelpOff)
	EndIf
	sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
		formatString(msgCellWidth1_L, pointsToDefaultUnits(oCell.width)),
		formatString(msgCellWidth1_S, pointsToDefaultUnits(oCell.width)))
	iHeightRule = oCell.heightRule
	if iHeightRule  == wdRowHeightAuto
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			msgCellHeightAuto1_L,msgCellHeightAuto1_S)
	elif iHeightRule  == wdRowHeightAtLeast
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			formatString(msgCellHeightAtLeast1_L, pointsToDefaultUnits(oCell.height)),
			formatString(msgCellHeightAtLeast1_S, pointsToDefaultUnits(oCell.height)))
	elif iHeightRule == wdRowHeightExactly
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			formatString(msgCellHeightExactly1_L, pointsToDefaultUnits(oCell.height)),
			formatString(msgCellHeightExactly1_S, pointsToDefaultUnits(oCell.height)))
	endIf
	if oCell.FitText == VBTrue
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			msgCellFitTextHelp_L,msgCellFitTextHelp_S)
	EndIf
	iVerticalAlignment = oCell.VerticalAlignment
	if iVerticalAlignment == wdCellAlignVerticalTop
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			formatString(msgCellVerticalAlignment_L,msgCellVerticalAlignmentTop),
			formatString(msgCellVerticalAlignment_S,msgCellVerticalAlignmentTop))
	ElIf iVerticalAlignment == wdCellAlignVerticalCenter
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			formatString(msgCellVerticalAlignment_L,msgCellVerticalAlignmentCenter),
			formatString(msgCellVerticalAlignment_S,msgCellVerticalAlignmentCenter))
	ElIf iVerticalAlignment == wdCellAlignVerticalBottom
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			formatString(msgCellVerticalAlignment_L,msgCellVerticalAlignmentBottom),
			formatString(msgCellVerticalAlignment_S,msgCellVerticalAlignmentBottom))
	EndIf
	iTableSpacing = oTable.spacing
	if iTableSpacing
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			FormatString(msgTableSpacingHelp_L,IntToString(iTableSpacing)),
			FormatString(msgTableSpacingHelp_S,IntToString(iTableSpacing)))
	EndIf
	iTableTopPadding = oTable.TopPadding
	if iTableTopPadding
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			FormatString(msgTableTopPaddingHelp_L,IntToString(iTableTopPadding)),
			FormatString(msgTableTopPaddingHelp_S,IntToString(iTableTopPadding)))
	EndIf
	iTableBottomPadding = oTable.BottomPadding
	if iTableBottomPadding
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			FormatString(msgTableBottomPaddingHelp_L,IntToString(iTableBottomPadding)),
			FormatString(msgTableBottomPaddingHelp_S,IntToString(iTableBottomPadding)))
	EndIf
	iTableLeftPadding = oTable.LeftPadding
	if iTableLeftPadding
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			FormatString(msgTableLeftPaddingHelp_L,IntToString(iTableLeftPadding)),
			FormatString(msgTableLeftPaddingHelp_S,IntToString(iTableLeftPadding)))
	EndIf
	iTableRightPadding = oTable.RightPadding
	if iTableRightPadding
		sHelp = sHelp + FormatOutputMessage(OT_user_buffer,true,
			FormatString(msgTableRightPaddingHelp_L,IntToString(iTableRightPadding)),
			FormatString(msgTableRightPaddingHelp_S,IntToString(iTableRightPadding)))
	EndIf
endIf
sCellBorderInfo = GetBorderDescription(oCell,msgCellBorder)
if sCellBorderInfo
	sHelp = sHelp + sCellBorderInfo+cscBufferNewLine
EndIf
sTableBorderInfo = GetBorderDescription(oTable,msgTableBorder)
if sTableBorderInfo
	sHelp = sHelp + sTableBorderInfo+cscBufferNewLine
EndIf
return sHelp
EndFunction

void Function sayCell()
Var
	string sCellText,
	int iCellLength
if SayAllInProgress()
	;let internals handle it
	return
endIf
if IsFormfield()
	;SelectionContextChangedEvent speaks it
	return
endIf
if TestForEndOfCellOrRowMarker(true)
	return
EndIf
sCellText = GetCell()
if shouldReadBlankCells() ; either JAWS is running or MAGic's blank cell setting is on.
&& IsCellTextBlank(sCellText)
	SayUsingVoice(vctx_message,cmsgBlank1,ot_screen_message)
Else
	SayCell()
	if !(GetRunningFSProducts() == product_MAGic)
	&& IsTextSelected()
	&& GetVerbosity() == Beginner
		SayFormattedMessageWithVoice(vctx_message,ot_selected,cmsgSelected,cmsgSilent)
	EndIf
EndIf
EndFunction

Void function TableEnteredEvent(int nTblCols, int nTblRows, int nTblNesting,
	int nCurCol, int nCurRow, int bUniform,
	int bHasMarkedHeaders, int nHeadersColumn, int nHeadersRow)
;formattedSayString ("nHeadersColumn %1, nHeadersRow %2, nCurCol %3, nCurRow %4",nHeadersColumn, nHeadersRow, nCurCol, nCurRow); debug
var
	int lastTrackedEvent,
	int iTitlesOverride,
	int iTableIndex,
	int iTableCount,
	int bTableAdded
if IsReadOnlyVirtualMessage()
	return
endIf
if ShouldWaitForDocumentChangeToRunEvent()
|| IsTableChangingSize()
	return
EndIf
lastTrackedEvent = GetLastTrackedEvent()
var object oWord = GetOWord()
iTableCount = oWord.activeDocument.tables.count
iTableIndex = GetTableIndex()
if cWDActiveDocument.tableCount < iTableCount
	bTableAdded = true
EndIf
if (LastTrackedEvent == event_FocusChanged
|| LastTrackedEvent == event_MenuMode)
&& bTableAdded
	;do not speak table enterd and cell change information when focus changes or leaving menu,
	;except when a new table has been added.
	TrackEvent(event_TableEntered)
endIf
if !cWDCurrentTable
	cWDCurrentTable = new collection
else
	; When returning from a menu where rows or columns are deleted or added, this event fires because the table is being re-entered.
	; determine if the table dimensions have changed before deleting the old table data, and announce if so.
	if !bTableAdded && iTableIndex == cWDCurrentTable.index
	&& (cWDCurrentTable.columnCount != nTblCols || cWDCurrentTable.rowCount != nTblRows)
		if bUniform
			sayFormattedMessage(ot_help, msgTableDimensionsChanged_UniformTable_L, msgTableDimensionsChanged_UniformTable_S, nTblCols, nTblRows)
		else
			sayFormattedMessage(ot_help, msgTableDimensionsChanged_NonUniformTable_L, msgTableDimensionsChanged_NonUniformTable_S)
		endIf
	endIf
	CollectionRemoveAll(cWDCurrentTable)
endIf
cWDActiveDocument.tableCount = iTableCount
cWDCurrentTable.name = GetTableName()
cWDCurrentTable.index = GetTableIndex()
cWDCurrentTable.nestingLevel = nTblNesting
cWDCurrentTable.caption = GetTableCaption()
cWDCurrentTable.summary = GetTableSummary()
cWDCurrentTable.columnCount = nTblCols
cWDCurrentTable.rowCount = nTblRows
cWDCurrentTable.markedHeaders = bHasMarkedHeaders
cWDCurrentTable.uniform = bUniform
updateTablePointer()
iTitlesOverride = OverrideDocNamedTitles()
if bHasMarkedHeaders
&& !iTitlesOverride
	cWDCurrentTable.headerColumn = nHeadersColumn
	cWDCurrentTable.headerRow = nHeadersRow
	cWDCurrentTable.HasBookmarkedHeaders = bHasMarkedHeaders ; from the document bookmarks.
elIf iTitlesOverride
	cWDCurrentTable.headerColumn = RowTitlesColumn()
	cWDCurrentTable.headerRow = ColumnTitlesRow()
EndIf
if (!bTableAdded && (lastTrackedEvent == event_MenuMode || lastTrackedEvent == event_FocusChanged))
|| DocumentUpdateNotificationMode() == off
|| (cWDCurrentTable.columnCount == 1 && IsActiveDocumentProtected())
|| (cWDCurrentTable.index == c_WordFuncTester.MostRecentTableIndex && isFormfield())
	return
EndIf
c_WordFuncTester.MostRecentTableIndex = cWDCurrentTable.index
if BrailleIsInputSource() return endIf
ProcessSpeechForTableEnteredEvent()
EndFunction

void function ProcessSpeechForTableEnteredEvent()
if IsMovingByFirstOrLastLine(cLastTracked.caretMovementUsedByWordDocumentTables)
	SayFirstOrLastLineNavTypeFromCaretMovedEvent(cLastTracked.caretMovementUsedByWordDocumentTables == Unit_Line_First)
	cLastTracked.caretMovementUsedByWordDocumentTables = 0
EndIf
if !TableDetection()
	return
EndIf
	
if TableDescription()
	if cWDCurrentTable.caption !=CSCNull then
		sayUsingVoice(vctx_message,cWDCurrentTable.caption, ot_control_Name)
	else
		SayFormattedMessageWithVoice(vctx_message,ot_position,
			formatString(msgTableNumber,intToString(cWDCurrentTable.index)),
			formatString(msgTableNumber,intToString(cWDCurrentTable.index)))
	endIf
	if cWDCurrentTable.uniform
		SayFormattedMessageWithVoice(vctx_message,ot_item_state,msgUniformTable,msgUniformTable)
	else
		SayFormattedMessageWithVoice(vctx_message,ot_item_state,msgNonuniformTable,msgNonUniformTable)
	EndIf
Else
	SayFormattedMessageWithVoice(vctx_message,ot_control_type,msgTable,msgTable)
	if !cWDCurrentTable.uniform
		SayFormattedMessageWithVoice(vctx_message,ot_item_state,msgNonuniformTable,msgNonUniformTable)
	EndIf
EndIf
if (cWDCurrentTable.summary !=CscNull)
	sayUsingVoice(VCTX_MESSAGE, cWDCurrentTable.summary, OT_HELP)
endIf
EndFunction

void function TableExitedEvent()
if IsReadOnlyVirtualMessage()
	return
endIf
if IsTableChangingSize()
	;ignore this event if table is changing in size
	return
EndIf
CollectionRemoveAll(cWDCurrentTable)
updateTablePointer()
;braille may continue to show the last table information when table is exited:
if !TableDetection()
|| DocumentUpdateNotificationMode() == off
	return
EndIf
if !SayAllInProgress()
&& quickNavKeyTrapping()
&& !cLastTracked.caretMovementUsedByWordDocumentTables
	return
EndIf
if SayAllInProgress()
	if getTickCount()-GetLastKeyPressTime()<1000
		return
	endIf
endIf
if BrailleIsInputSource() return endIf
ProcessSpeechForTableExitedEvent()
EndFunction

void function ProcessSpeechForTableExitedEvent()
if !IsCaretInTable()
	;A table cross boundary event should be firing,
	;but that function does not work,
	;so we test to see if we are still in a table when exiting a table.
	SayFormattedMessageWithVoice(vctx_message,ot_control_type,msgOutOfTable1_L,msgOutOfTable1_S)
EndIf
EndFunction

void function CrossedTableBoundaryEvent(int iPrevTableIndex, int iPrevTableLevel, int
	iCurTableIndex, int iCurTableLevel)
updateTablePointer()
if !TableDetection()
|| DocumentUpdateNotificationMode() == off
|| BrailleIsInputSource()
	return
EndIf
CrossedTableBoundaryEvent(iPrevTableIndex, iPrevTableLevel, iCurTableIndex, iCurTableLevel)
EndFunction

Void function CellChangedEvent(int nNewCol, int nNewRow,
	int nNewNesting, int nNewRowColCount,
	string ColHeader, string RowHeader,
	int nPrevCol, int nPrevRow,
	int nPrevNesting, int nPrevRowColCount)
var
	int LastTrackedEvent,
	int lastTrackedWordDocumentCaretMovement,
	int lastTrackedEditableMessageCaretMovement,
	int lastTrackedTableNavInWordDocument,
	int lastTrackedTableNavInEditableMessage,
	int nPrevRowCount = cWDCurrentTable.rowCount,
	int bTableWasEdited
if IsReadOnlyVirtualMessage()
	return
endIf
if ShouldWaitForDocumentChangeToRunEvent()
	return
EndIf
if isFormField() && !cwdDeferredCellChange.delaying
	; Make table position info announcement occur after form field info announcement.
	cwdDeferredCellChange = new collection
	cwdDeferredCellChange.nNewCol = nNewCol
	cwdDeferredCellChange.nNewRow = nNewRow
	cwdDeferredCellChange.nNewNesting = nNewNesting
	cwdDeferredCellChange.nNewRowColCount = nNewRowColCount
	cwdDeferredCellChange.ColHeader = ColHeader
	cwdDeferredCellChange.RowHeader = RowHeader
	cwdDeferredCellChange.nPrevCol = nPrevCol
	cwdDeferredCellChange.nPrevRow = nPrevRow
	cwdDeferredCellChange.nPrevNesting = nPrevNesting
	cwdDeferredCellChange.nPrevRowColCount = nPrevRowColCount
	; Delaying tells this event to run when called from a schedule,
	; and also tells the selectionChangedEvent to fire this event.
	cwdDeferredCellChange.delaying = True
	; Make sure this runs even if the selectionChangedEvent doesn't.
	; The selectionChangedEvent will preempt this if it runs (which is the usual case).
	scheduleFunction("deferredCellChangedEvent", 5)
	return
elif cwdDeferredCellChange
	; In case the deferred event doesn't happen before the next direct firing of this one.
	collectionRemoveAll(cwdDeferredCellChange)
endIf
LastTrackedEvent = GetLastTrackedEvent()
lastTrackedWordDocumentCaretMovement = cLastTracked.caretMovementUsedByWordDocumentTables
lastTrackedEditableMessageCaretMovement = cLastTracked.caretMovementUsedByEditableMessageTables
lastTrackedTableNavInWordDocument = cLastTracked.tableNavInWordDocument
lastTrackedTableNavInEditableMessage = cLastTracked.tableNavInEditableMessage
TrackEvent(event_CellChanged)
UpdateCWDCurrentTableOnCellChange(nNewCol, nNewRow, nNewNesting, nNewRowColCount,
	ColHeader, RowHeader, nPrevCol, nPrevRow, nPrevNesting, nPrevRowColCount)
if IsKeyWaiting()
|| LastTrackedEvent == event_autoStart
|| lastTrackedEvent == event_MenuMode
|| lastTrackedEvent == event_FocusChanged
|| DocumentUpdateNotificationMode() == off
|| BrailleIsInputSource()
	return
EndIf
ProcessSpeechForCellChangedEvent(nNewCol, nNewRow, nPrevCol, nPrevRow,
	nNewRowColCount, nNewNesting, nPrevNesting, 
	lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage,
	lastTrackedWordDocumentCaretMovement, lastTrackedEditableMessageCaretMovement)
;We can now clear the caret in table tracking for editable messages.
;In Word, CellChangedEvent fires before CaretMovedEvent.
;In Outlook, CaretMovedEvent fires before CellChangedEvent.
;The caret and table nav tracking for tables in Word documents are cleared in CaretMovedEvent, do not clear them here.
cLastTracked.caretMovementUsedByEditableMessageTables = 0
cLastTracked.tableNavInEditableMessage = 0
EndFunction

int function IsNavigatingTableByCharacterWordOrLine(int lastTrackedTableNavInWordDocument, int lastTrackedTableNavInEditableMessage,
	int lastTrackedWordDocumentCaretMovement, int lastTrackedEditableMessageCaretMovement)
if !inTable() return false endIf
;Because the order of table events and caret moved events is different in Word and in Outlook editable messages,
;we use two sets of variables, one for each app.
if lastTrackedTableNavInWordDocument || lastTrackedTableNavInEditableMessage
	return false
endIf
return (lastTrackedWordDocumentCaretMovement >= Unit_Char_Next && lastTrackedWordDocumentCaretMovement <= Unit_Line_Prior)
	|| (lastTrackedEditableMessageCaretMovement >= Unit_Char_Next && lastTrackedEditableMessageCaretMovement <= Unit_Line_Prior)
	;include navigating by cursor up or down into a new cel:
	|| lastTrackedWordDocumentCaretMovement == Unit_Cell_Down
	|| lastTrackedWordDocumentCaretMovement == Unit_Cell_Up
	|| lastTrackedEditableMessageCaretMovement == Unit_Cell_Down
	|| lastTrackedEditableMessageCaretMovement == Unit_Cell_Up
EndFunction

int function IsSayingColumnOrRow(int lastTrackedTableNavInWordDocument, int lastTrackedTableNavInEditableMessage)
return lastTrackedTableNavInWordDocument == TABLE_NAV_SAY_ROW
	|| lastTrackedTableNavInWordDocument == TABLE_NAV_SAY_COLUMN
	|| lastTrackedTableNavInEditableMessage == TABLE_NAV_SAY_ROW
	|| lastTrackedTableNavInEditableMessage == TABLE_NAV_SAY_COLUMN
EndFunction

int function IsSayingRow(int lastTrackedTableNavInWordDocument, int lastTrackedTableNavInEditableMessage)
return lastTrackedTableNavInWordDocument == TABLE_NAV_SAY_ROW
	|| lastTrackedTableNavInEditableMessage == TABLE_NAV_SAY_ROW
EndFunction

int function IsSayingColumn(int lastTrackedTableNavInWordDocument, int lastTrackedTableNavInEditableMessage)
return lastTrackedTableNavInWordDocument == TABLE_NAV_SAY_COLUMN
	|| lastTrackedTableNavInEditableMessage == TABLE_NAV_SAY_COLUMN
EndFunction

void function CellChangedEventSayChangedHeadersandContent(int lastTrackedTableNavInWordDocument, int lastTrackedTableNavInEditableMessage, int bSayAll)
var	int speakHeaderBeforeContent = ShouldSpeakTableHeadersBeforeCellContent()
if speakHeaderBeforeContent
&& !bSayAll
&& !IsSayingColumnOrRow(lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage)
	CellChangedEventSayChangedHeaders()
endIf
SayCell()
if !speakHeaderBeforeContent
&& !bSayAll
&& !IsSayingColumnOrRow(lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage)
	CellChangedEventSayChangedHeaders()
endIf
EndFunction

void function ProcessSpeechForCellChangedEvent(int nNewCol, int nNewRow,
	int nPrevCol, int nPrevRow,
	int nNewRowColCount,
	int nNewNesting, int nPrevNesting,
	int lastTrackedTableNavInWordDocument, int lastTrackedTableNavInEditableMessage,
	int lastTrackedWordDocumentCaretMovement, int lastTrackedEditableMessageCaretMovement)
var
	int bSayAll,
	int bTableDetection
if TestForEndOfCellOrRowMarker(true)
	return
EndIf
bSayAll = SayAllInProgress()
bTableDetection = TableDetection()
if bTableDetection 
	if !bSayAll
		if TableDescription()
			if nNewNesting != nPrevNesting
			&& nPrevNesting > 0
				SayUsingVoice(vctx_message,
					FormatString(msgNestingLevel1_L,IntToString(nNewNesting)),
					ot_help)
			EndIf
		EndIf
	else ;In SayAll, say row number as it changes:
		if nNewRow != nPrevRow
		&& nPrevRow >= 1
		&& !IsSayingColumnOrRow(lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage)
			Say(FormatString(msgRowIndex_L,IntToString(nNewRow)),ot_position)
		EndIf
	EndIf
EndIf
if IsSayingRow(lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage)
	readTableRow()
	Say(FormatString(msgRowIndex_L,IntToString(nNewRow)),ot_position)
elif IsSayingColumn(lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage)
	readTableColumn()
	Say(FormatString(msgColumnIndex_L,IntToString(nNewCol)),ot_position)
elif !lastTrackedTableNavInWordDocument && !lastTrackedTableNavInEditableMessage
	if !lastTrackedWordDocumentCaretMovement && !lastTrackedEditableMessageCaretMovement
		;Tabbing and shift tabbing are not tracked as caret movements:
		CellChangedEventSayChangedHeadersandContent(lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage, bSayAll)
	elif !IsNavigatingTableByCharacterWordOrLine(lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage, lastTrackedWordDocumentCaretMovement, lastTrackedEditableMessageCaretMovement)
		;CaretMovedEvent speaks the character, word or line.
		;Speak other caret movements which are not table nav:
		ProcessSpeechOnCaretMovedEvent(lastTrackedWordDocumentCaretMovement)
	endIf
else
	CellChangedEventSayChangedHeadersandContent(lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage, bSayAll)
EndIf
if bTableDetection
	if !bSayAll
	&& !IsSayingColumnOrRow(lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage)
		CellChangedEventSayNewPosition(lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage, lastTrackedWordDocumentCaretMovement, lastTrackedEditableMessageCaretMovement, (nNewCol != nPrevCol), (nNewRow != nPrevRow))
	EndIf
	;use the prev var values from UpdateCWDCurrentTableOnCellChange,
	;because the end of cell marker causes the prev var values to be 0:
	CellChangedEventSayChangedRowOrColumnCount(nNewRow, cwdCurrentTable.cell.PrevRow,
		cWDCurrentTable.rowCount, cWDCurrentTable.PrevRowCount ,
		nNewCol, cwdCurrentTable.cell.PrevColumn,
		nNewRowColCount, cwdCurrentTable.PrevRowColumnCount)
	cWDCurrentTable.PrevRowCount = cWDCurrentTable.rowCount
	cwdCurrentTable.PrevRowColumnCount = cwdCurrentTable.RowColumnCount
	if !bSayAll
		if nNewCol == nNewRowColCount
		&& nNewRow == cWDCurrentTable.rowCount
			WarnOnLastCell(
				!((lastTrackedTableNavInWordDocument == TABLE_NAV_TABLE_EXTENTS || lastTrackedTableNavInEditableMessage == TABLE_NAV_TABLE_EXTENTS)
				&& nNewCol == nNewRowColCount && nNewRow == cWDCurrentTable.rowCount))
		EndIf
		if GetSelectionContextFlags() & selCtxShading
			if (nNewcol != nPrevcol && nNewcol > cWDCurrentTable.headerColumn)
			|| (nNewRow != nPrevRow && nNewRow > cWDCurrentTable.headerRow)
				if cwdCurrentTable.cell.cellPatternAndShading != cwdCurrentTable.cell.priorCellPatternAndShading
					if cwdCurrentTable.cell.cellPatternAndShading
						say(cwdCurrentTable.cell.cellPatternAndShading,ot_help)
					else
						Say(msgOutOfShadedRegion,ot_help)
					EndIf
				EndIf
			EndIf
		EndIf
	EndIf
EndIf
EndFunction

Void function deferredCellChangedEvent()
; Called from ScheduleFunction in order to run the cellChangedEvent after a delay.
if !cwdDeferredCellChange.delaying
	; This would mean a cellChangedEvent ran between the scheduling of this one and now.
	return
endIf
CellChangedEvent(cwdDeferredCellChange.nNewCol, cwdDeferredCellChange.nNewRow,
	cwdDeferredCellChange.nNewNesting, cwdDeferredCellChange.nNewRowColCount,
	cwdDeferredCellChange.ColHeader, cwdDeferredCellChange.RowHeader,
	cwdDeferredCellChange.nPrevCol, cwdDeferredCellChange.nPrevRow,
	cwdDeferredCellChange.nPrevNesting, cwdDeferredCellChange.nPrevRowColCount)
collectionRemoveAll(cwdDeferredCellChange)
endFunction

void function CellChangedEventSayChangedAutomaticHeaders()
var int automaticHeaders = getNonJCFOption ("TblHeaders")
if cWDCurrentTable.cell.row != cWDCurrentTable.cell.prevRow
	if automaticHeaders & ReadRowTitles
	|| (automaticHeaders & readMarkedTitles && GetRowHeader(1))
		if CollectionItemExists(cWDCurrentTable.cell,"rowHeaderText")
			SayMessageWithMarkup(ot_screen_message,FormatString(msgHeaderTemplate,cWDCurrentTable.cell.rowHeaderText))
		EndIf
	endIf
EndIf
if cWDCurrentTable.cell.column != cWDCurrentTable.cell.prevColumn
	if automaticHeaders & ReadColumnTitles
	|| (automaticHeaders & readMarkedTitles && GetColumnHeader(1))
		if CollectionItemExists(cWDCurrentTable.cell,"columnHeaderText")
			SayMessageWithMarkup(ot_screen_message,FormatString(msgHeaderTemplate,cWDCurrentTable.cell.columnHeaderText))
		EndIf
	endIf
EndIf
endFunction

void function CellChangedEventSayChangedHeaders()
if ! OverrideDocNamedTitles()
	return CellChangedEventSayChangedAutomaticHeaders()
endIf
if cWDCurrentTable.cell.row != cWDCurrentTable.cell.prevRow
	if CollectionItemExists(cWDCurrentTable.cell,"rowHeaderText")
		SayMessageWithMarkup(ot_screen_message,FormatString(msgHeaderTemplate,cWDCurrentTable.cell.rowHeaderText))
	EndIf
EndIf
if cWDCurrentTable.cell.column != cWDCurrentTable.cell.prevColumn
	if CollectionItemExists(cWDCurrentTable.cell,"columnHeaderText")
		SayMessageWithMarkup(ot_screen_message,FormatString(msgHeaderTemplate,cWDCurrentTable.cell.columnHeaderText))
	EndIf
EndIf
EndFunction

void function CellChangedEventSayNewPosition(int lastTrackedTableNavInWordDocument, int lastTrackedTableNavInEditableMessage,
	int lastTrackedWordDocumentCaretMovement, int lastTrackedEditableMessageCaretMovement,
	int isColumnChanging, int isRowChanging)
if !CellCoordinatesDetection()
	if lastTrackedWordDocumentCaretMovement
	|| lastTrackedEditableMessageCaretMovement
		Say(msgNewCell,ot_position)
	EndIf
	return
elif IsNavigatingTableByCharacterWordOrLine(lastTrackedTableNavInWordDocument, lastTrackedTableNavInEditableMessage, lastTrackedWordDocumentCaretMovement, lastTrackedEditableMessageCaretMovement)
	var int headerDetection = getNonJCFOption ("TblHeaders")
	if !headerDetection
		Say(msgNewCell,ot_position)
	elif (headerDetection & readRowTitles) && isRowChanging && !cWDCurrentTable.cell.rowHeaderText 
	|| (headerDetection & readColumnTitles) && isColumnChanging && !cWDCurrentTable.cell.columnHeaderText 
		Say(msgNewCell,ot_position)
	elif headerDetection & readMarkedTitles
		if isRowChanging && (!cWDCurrentTable.cell.rowHeaderText || !GetRowHeader(1))
		|| isColumnChanging && (!cWDCurrentTable.cell.columnHeaderText || !GetColumnHeader(1))
			Say(msgNewCell,ot_position)
		endIf
	endIf
	return
EndIf
if lastTrackedTableNavInWordDocument == TABLE_NAV_TABLE_EXTENTS
|| lastTrackedTableNavInEditableMessage == TABLE_NAV_TABLE_EXTENTS
	;speak extended column and row position information,
	;unconditionally if moving to first cell,
	;or if moving to last cell and it has no row or column title:
	if (cWDCurrentTable.Cell.column == 1 && cWDCurrentTable.Cell.row == 1)
	|| (cWDCurrentTable.Cell.column == cWDCurrentTable.rowColumnCount
			&& cWDCurrentTable.Cell.row == cWDCurrentTable.rowCount
			&& !cWDCurrentTable.Cell.columnHeaderText
			&& !cWDCurrentTable.Cell.rowHeaderText)
		SayMessage (ot_position, FormatString(msgTableRow1_L,
				IntToString(cWDCurrentTable.Cell.row),
				IntToString(cWDCurrentTable.rowCount)))
		SayMessage (ot_position, FormatString(msgTableColumn1_L,
				IntToString(cWDCurrentTable.Cell.column),
				IntToString(cWDCurrentTable.rowColumnCount)))
	EndIf
elif lastTrackedTableNavInWordDocument == TABLE_NAV_HORIZONTAL
|| lastTrackedTableNavInWordDocument == TABLE_NAV_ROW_EXTENTS
|| lastTrackedTableNavInEditableMessage == TABLE_NAV_HORIZONTAL
|| lastTrackedTableNavInEditableMessage == TABLE_NAV_ROW_EXTENTS
	;speak extended column position only if no column title exists
	if !cWDCurrentTable.Cell.columnHeaderText
		SayMessage (ot_position, FormatString(msgTableColumn1_L,
				IntToString(cWDCurrentTable.Cell.column),
				IntToString(cWDCurrentTable.rowColumnCount)))
	EndIf
elif lastTrackedTableNavInWordDocument == TABLE_NAV_VERTICAL
|| lastTrackedTableNavInWordDocument == TABLE_NAV_COLUMN_EXTENTS
|| lastTrackedTableNavInEditableMessage == TABLE_NAV_VERTICAL
|| lastTrackedTableNavInEditableMessage == TABLE_NAV_COLUMN_EXTENTS
	;speak extended row position only if no row title exists
	if !cWDCurrentTable.Cell.rowHeaderText
		SayMessage (ot_position, FormatString(msgTableRow1_L,
				IntToString(cWDCurrentTable.Cell.row),
				IntToString(cWDCurrentTable.rowCount)))
	endIf
else
	;Every other navigation type will result in
	;the extended position navigation being announced only where
	;the column or row changes and there is no title for the column or row.
	if cWDCurrentTable.Cell.row != cWDCurrentTable.Cell.prevRow
	&& !cWDCurrentTable.Cell.rowHeaderText
		SayMessage (ot_position, FormatString(msgTableRow1_L,
				IntToString(cWDCurrentTable.Cell.row),
				IntToString(cWDCurrentTable.rowCount)))
	EndIf
	if cWDCurrentTable.Cell.column != cWDCurrentTable.Cell.prevColumn
	&& !cWDCurrentTable.Cell.columnHeaderText
		SayMessage (ot_position, FormatString(msgTableColumn1_L,
				IntToString(cWDCurrentTable.Cell.column),
				IntToString(cWDCurrentTable.rowColumnCount)))
	EndIf
EndIf
EndFunction

void function CellChangedEventSayChangedRowOrColumnCount(int nCurRow, int nPrevRow,
	int nCurRowCount, int nPrevRowCount, int nCurCol, int nPrevCol,
	int nCurRowColCount, int nPrevRowColCount)
if nPrevRowCount != 0
&& nCurRow>=1
&& nPrevRow >= 1
&& nCurRowCount!=nPrevRowCount
	SayMessage(ot_help,
		FormatString(msgWarningRowCountChange_L,intToString(nCurRowcount),
			intToString(nPrevRowCount)),
		FormatString(msgWarningRowCountChange_s,IntToString(nCurRowCount)))
endIf
if nPrevRowColCount != 0
&& nPrevRow >= 1
&& nCurRow >= 1
&& nCurRow != nPrevRow
&& nCurRowColCount != nPrevRowColCount
	SayMessage(ot_help,
		FormatString(msgWarningColumnCountChange_L,intToString(nCurRowColCount),
			intToString(nPrevRowColCount)),
		FormatString(msgWarningColumnCountChange_s,IntToString(nCurRowColCount)))
endIf
EndFunction

int Function isEvenNumber(int num)
return num == 0 || num%2 == 0
EndFunction

int Function isMultipleColumnText()
var object oWord = GetOWord()
var object oTextColumns = oWord.selection.pageSetup.textColumns
var object oView = oWord.activeWindow.view
return oTextColumns.count > 1
	&& oTextColumns.count !=wdUndefined
	&& oView.type == wdPrintView
EndFunction

int Function getRangeTextColumnNumber(object oRange)
var
	object oTextColumns,
	object oTextColumn,
	int columnIndex,
	int columnCount,
	int columnWidth,
	int horizDistFromLeftMargin
if inTable()
	return 0
endIf
var object oWord = GetOWord()
if oWord.activeWindow.view.type !=  wdPrintView
|| oRange.storyType !=  WDMainTextStory
	return 0
endIf
oTextColumns = oRange.pageSetup.textColumns
columnCount = oTextColumns.count
if columnCount == 1
	return 0
endIf
horizDistFromLeftMargin  =
	oRange.information(wdHorizontalPositionRelativeToPage)
	- oRange.pageSetup.leftMargin
if oTextColumns.evenlySpaced == VBTrue
	columnWidth = oTextColumns.width + oTextColumns.spacing
	; calculate which column we are in based on the known width and
	;distance of cursor from left margin
	return (horizDistFromLeftMargin/(columnWidth))+1
else
	columnWidth = 0
	columnIndex = 1
	while columnIndex <=  columnCount
		oTextColumn = oTextColumns(columnIndex)
		columnWidth = columnWidth
			+ oTextColumn.width + oTextColumn.spaceAfter
		; calculate current column width, add to prior widths
		; compare distance of cursor from left margin to column widths so far
		if horizDistFromLeftMargin < columnWidth
			return columnIndex
		endIf
		columnIndex = columnIndex+1
	endWhile
endIf
return columnCount
EndFunction

void Function SayLineAndColumn()
var
	int line,
	int column
if !WindowCategoryIsWordDocument()
	return
endIf
var object oWord = GetOWord()
line = oWord.selection.information(wdFirstCharacterLineNumber)
column = oWord.selection.information(wdFirstCharacterColumnNumber)
SayMessage (ot_user_requested_information,
	FormatOutputMessage(ot_user_requested_information, false,
		msgLineAndColumn,msgLineAndColumn,
		IntToString(line), intToString(column)))
EndFunction

string Function GetNewspaperColumnHelpMessage(int iOutputType)
var
	string sMsg,
	object oldSelRange,
	object oTextColumns,
	int index,
	int count,
	int iCurrentColumn,
	int iColumnCount,
	string sColWidth,
	string sGap
var object oWord = GetOWord()
oldSelRange = oWord.selection.range
oTextColumns = oWord.selection.pageSetup.textColumns
iColumnCount = oTextColumns.count
if iColumnCount > 1
&& iColumnCount !=  wdUndefined
	if isMultipleColumnText()
		iCurrentColumn = GetRangeTextColumnNumber(oWord.selection)
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgCursorInTextCol1_L, msgCursorInTextCol1_S,
			intToString(iCurrentColumn))
	endIf
	if oTextColumns.evenlySpaced == VBTrue
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgSectionColumnDescEven1_L, msgSectionColumnDescEven1_S,
			intToString(iColumnCount),
			pointsToDefaultUnits(oTextColumns.width),
			pointsToDefaultUnits(oTextColumns.spacing))
	else
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgSectionColumnDescVary1_L, msgSectionColumnDescVary1_S,
			intToString(iColumnCount))
		index = 1
		count = iColumnCount
		while index <=  count
			sColWidth = pointsToDefaultUnits(oTextColumns(index).width)
			sGap = pointsToDefaultUnits(oTextColumns(index).spaceAfter)
			sMsg = sMsg+FormatOutputMessage(iOutputType,true,
				msgColumnDesc1_L, msgColumnDesc1_S,
				intToString(index), sColWidth, sGap)
			index = index+1
		endWhile
	endIf
	if oTextColumns.lineBetween == VBTrue
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgLineBetween1_L,msgLineBetween1_L)
	endIf
endIf
OldSelRange.select
return sMsg
EndFunction

int Function ActiveDocumentProtectionType()
return cWDActiveDocument.protectionType
EndFunction

int Function IsActiveDocumentProtectedForm()
return cWDActiveDocument.protectionType == wdAllowOnlyFormFields
EndFunction

int function IsActiveDocumentTrackChangesEnabled()
var object oWord = GetOWord()
return oWord.activeDocument.trackRevisions == VBTrue
EndFunction

int function IsActiveWindowProtected()
var object oWord = GetOWord()
return oWord.activeDocument.protectionType != wdNoProtection
EndFunction

int function IsReadOnlyMessage()
;See IsReadOnlyVirtualMessage for virtual read-only messages
return IsEmailMessage()
	&& (isActiveDocumentReadOnly() || IsActiveWindowProtected())
EndFunction

int function IsReadOnlyVirtualMessage()
;see IsReadOnlyMessage for read-only messages
return IsVirtualPCCursor()
	&& IsEmailMessage()
	&& (isActiveDocumentReadOnly() || IsActiveWindowProtected())
EndFunction

int Function isFormField()
return (GetSelectionContext() & SelCTXFormFields) !=  false
EndFunction

int function IsNewFormFieldByName (string FormFieldName)
return StringCompare (c_WordFuncTester.FormFieldNameFromSelectionChange, FormFieldName) != 0
endFunction

void Function clickFormField()
var
	int topLeftX,
	int topLeftY,
	int width,
	int height,
	int savedRestriction
var object oWord = GetOWord()
oWord.activeWindow.getPoint(intRef(topLeftX),intRef(topLeftY),intRef(width),intRef(height),oWord.selection.formFields(1).range)
saveCursor()
InvisibleCursor()
saveCursor()
savedRestriction = GetRestriction()
SetRestriction(RestrictNone)
moveTo(topLeftX+1,topLeftY+(height/2))
RoutePCToInvisible()
InvisibleCursor()
restoreCursor()
SetRestriction(savedRestriction)
restoreCursor()
EndFunction

int function ShouldSpeakSelectedTextInFormfield(string text, int type)
if text==cscNull || stringIsBlank(text)
	return false
endIf
if type==wt_edit ||type==wt_document || type==wt_unknown
	return true
endIf
return false
endFunction

void Function routeJAWSToHighlightedText()
JAWSCursor()
moveToWindow(WinWordContextHandle)
FindNextAttribute (attrib_highlight)
pcCursor()
EndFunction

void Function RouteJAWSCursorToField()
; if on a protected form,
; JAWS doesn't track the focus so we need to tell JAWS where to send the cursor
var
	int topLeftX,
	int topLeftY,
	int width,
	int height
var object oWord = GetOWord()
oWord.activeWindow.getPoint(intRef(topLeftX),intRef(topLeftY),intRef(width),intRef(height),oWord.selection.characters.First)
topLeftX=topLeftX+1 ; JAWS is 1 based, O.M. is 0 based
topLeftY=topLeftY+1
if isInvisibleCursor()
	SayFormattedMessage (ot_help, cmsg146_L, cmsg146_S) ;"Route invisible to p c"
	invisibleCursor()
else
	SayFormattedMessage (ot_help, cmsg147_L, cmsg147_S) ;"Route JAWS to p c"
	JAWSCursor()
endIf
moveTo(topLeftX,topLeftY+(height/2))
endFunction

string function getActiveFieldName()
return cWDSelectionContext.field.prompt
EndFunction

string function getActiveFieldBrlTypeString()
return cWDSelectionContext.field .brlType
endFunction

string Function GetFieldTypeBrlString(int iType)
if iType == wdFieldOCX
	return msgFieldOCX
elIf iType == wdFieldToc
	return msgFieldToc
elIf iType == wdFieldPageRef
	return msgFieldPageRef
elIf iType == wdFieldRef
	return msgFieldRef
Elif iType == wdFieldHyperlink
|| GetObjectSubtypeCode() == wt_link
	return cscNull ; highlight takes care of it.
ElIf iType == wdFieldDate
	return msgFieldDate
ElIf iType == wdFieldTime
	return msgFieldTime
ElIf iType == wdFieldSymbol
	return msgFieldSymbol
ElIf iType == wdFieldFormula
	return msgFieldFormula
ElIf iType == wdFieldIndex
	return msgFieldIndex
elIf iType == wdFieldExpression
	return msgFieldExpression
else
	return cscNull
endIf
endFunction

void Function FocusToFirstFormField()
if StringSegmentCount(GetListOfFormFields(),list_item_separator)>0
	MoveToFormFieldByIndex(1)
	SayObjectTypeAndText()
	SayF1Help()
else
	SayFormattedMessage (ot_error, msgNoFormFields1_L)
EndIf
EndFunction

string Function GetFormFieldHelpMessage(int iOutputType)
var
	string sMsg,
	int type,
	int bProtectedForm
bProtectedForm = IsActiveDocumentProtectedForm()
type = GetObjectSubtypeCode()
if type == wt_checkbox
	If !bProtectedForm
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgScreenSensitiveHelpCheckBoxFormField_l,
			msgScreenSensitiveHelpCheckboxFormField_s)
	Else
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgFormfieldHelp1_L, msgFormfieldHelp1_S)
	EndIf
elif type == wt_comboBox
	if !bProtectedForm
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgScreenSensitiveHelpDropdownFormField_l,
			msgScreenSensitiveHelpDropdownFormField_s)
	Else
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgFormfieldHelp2_L, msgFormfieldHelp2_S)
	EndIf
elif type == wt_menu
	if !bProtectedForm
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgScreenSensitiveHelpDropdownFormField_l,
			msgScreenSensitiveHelpDropdownFormField_s)
	Else
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgFormfieldHelp2_L, msgFormfieldHelp2_S)
	EndIf
elif type == wt_edit
	if !bProtectedForm
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgScreenSensitiveHelpEditFormField_l,
			msgScreenSensitiveHelpEditFormField_s)
	Else
		sMsg = sMsg+FormatOutputMessage(iOutputType,true,
			msgFormfieldHelp3_L, msgFormfieldHelp3_S)
	EndIf
endIf
if cWDActiveDocument.protectionType >=  wdAllowOnlyRevisions
	;can tab from field to field otherwise cannot
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgFormfieldHelp4_L, msgFormfieldHelp4_S)
endIf
return sMsg
EndFunction

void Function SayF1Help()
var	int iSpeakHelp
if cWDSelectionContext.formField.help
	iSpeakHelp = ExtraHelpIndication()
	beginFlashMessage(-1)
	if iSpeakHelp == wdVerbosityHigh
		SayUsingVoice(vctx_message,cWDSelectionContext.formField.help,ot_help)
	ElIf iSpeakHelp == wdVerbosityLow
		SayUsingVoice(vctx_message,msgF1Help,ot_help)
	endIf
	endFlashMessage()
EndIf
EndFunction

string function getFormfieldF1Help()
cWDSelectionContext.formField.help
EndFunction

int function GetCurrentZoomLevel()
var object oWord = GetOWord()
return oWord.ActiveWindow.View.zoom.percentage
endFunction

int function IPAtEndOfLine()
var object oWord = GetOWord()
return oWord.selection.IPAtEndOfLine()
endFunction

int function GetLastTrackedEvent()
return cLastTracked.event
EndFunction

int function HasNavigatedForwardInCurrentDocument()
return cWDActiveDocument.NavigatedForward == true
EndFunction

int Function IsHyperlinkField()
var object oWord = GetOWord()
if oWord.selection.hyperlinks(1)
	return true
Else
	return false
EndIf
EndFunction

int function IsUpdatingApplicationData()
Return c_WordFuncTester.UpdatingApplicationData
EndFunction

int function IsUpdatingDocumentData()
return c_WordFuncTester.UpdatingDocumentData
EndFunction

int function FailedToInitDocumentCollection()
var object oWord = GetOWord()
return oWord.activeDocument && !cWDActiveDocument.name
EndFunction

int function IsCheckSpellingAsYouTypeEnabled()
;We are unable to determine the status of check spelling as you type when Outlook is active,
;so assume that it is true:
if OutlookIsActive()
	return true
endIf
return cWDOptions.checkSpelling
EndFunction

int function IsCheckGrammarAsYouTypeEnabled()
return cWDOptions.checkGrammar
EndFunction

int Function ConvertMeasurementUnitToSmmUnit(int iUnit)
if iUnit == wdPoints
	return smmPoints
elif iUnit == wdInches
	return smmInches
elif iUnit == wdCentimeters
	return smmCM
elif iUnit == wdMillimeters
	return smmMM
elif iUnit == wdPicas
	return smmSpaces
endIf
EndFunction

int function InDocumentList()
return WindowCategoryIsWordDocument()
	&& InList()
EndFunction

int function InList()
var object oWord = GetOWord()
return oWord.selection.range.listFormat.list
EndFunction

int function DetermineInlineShapeOleType(object oInlineShape)
var
	string sOleClass
if oInlineShape.type == wdISOLEControlObject
	sOleClass = oInlineShape.oleFormat.classType
	if stringLeft(sOleClass,5) == scMSForms
		sOleClass = StringSegment (sOleClass, sc_3, 2) ; of the form class.type.index, eg forms.textbox.1
		if sOleClass == scChkBox
			return WD_WT_OLE_CHECKBOX
		elif sOleClass == scOptionButton
			return WD_WT_OLE_RADIOBUTTON
		elif sOleClass == scLstBox
			return WD_WT_OLE_LISTBOX
		else
			return WD_WT_OLE_GENERIC
		endIf
	else ; unknown ole class
		return WD_WT_OLE_UNKNOWN
	endIf
else
	return WD_WT_SHAPE
endIf
EndFunction
int function GetSelectionContextRevisionType()
return cWDSelectionContext.revision.type
EndFunction

string function GetSelectionContextRevisionAuthor()
return cWDSelectionContext.revision.author
EndFunction

string function GetSelectionContextRevisionDate()
return cWDSelectionContext.revision.date
EndFunction

Int Function ShowRevisionsView()
var object oWord = GetOWord()
return oWord.ActiveWindow.View.showRevisionsAndComments == VBTrue
EndFunction

int function GetPatternPercentage(int iPattern)
if iPattern == wdTextureNone
	return 0
elif iPattern < wdTextureNone
	return 100
else
	return iPattern/10
EndIf
EndFunction

int Function isAllButtonPressed()
var object oWord = GetOWord()
var object oCommandBar = oWord.activeDocument.commandBars(cbOutlining)
var string sLevelText = oCommandBar.controls(lbxShowLevel).text
return sLevelText == scShowAllLevels_2007
EndFunction

string Function GetVisibleHeadingLevelString()
var object oWord = GetOWord()
var object oCommandBar = oWord.activeDocument.commandBars(cbOutlining)
var string sLevelText = oCommandBar.controls(lbxShowLevel).text
return oCommandBar.controls(lbxOutlineLevel).text
EndFunction

int Function ParagraphIsLeftAligned()
var object oWord = GetOWord()
return oWord.selection.paragraphs.format.alignment == wdAlignParagraphLeft
EndFunction

int Function ParagraphIsCentered()
var object oWord = GetOWord()
return oWord.selection.paragraphs.format.alignment == wdAlignParagraphCenter
EndFunction

int Function ParagraphIsRightAligned()
var object oWord = GetOWord()
return oWord.selection.paragraphs.format.alignment == wdAlignParagraphRight
EndFunction

int Function ParagraphIsJustified()
var object oWord = GetOWord()
return oWord.selection.paragraphs.format.alignment == wdAlignParagraphJustify
EndFunction

int Function fontIsBold()
var object oWord = GetOWord()
return oWord.selection.font.bold == VBTrue
EndFunction

int Function fontIsItalic()
var object oWord = GetOWord()
return oWord.selection.font.italic == VBTrue
EndFunction

int Function fontIsUnderlined()
var object oWord = GetOWord()
return oWord.selection.font.underline != wdUnderlineNone
EndFunction

int function IsShowParagraphs()
var object oWord = GetOWord()
return oWord.activeDocument.activeWindow.view.showParagraphs == VBTrue
EndFunction

int function IsShowAll()
var object oWord = GetOWord()
return oWord.activeDocument.activeWindow.view.showAll == VBTrue
EndFunction

int function BrowserTargetIsPage()
var object oWord = GetOWord()
return oWord.browser.target == wdBrowsePage
EndFunction

int function IsPrintLayoutView()
var object oWord = GetOWord()
return oWord.activeWindow.view.type == wdPrintView
EndFunction

int function IsNormalOrDraftView()
var object oWord = GetOWord()
var	object oView = oWord.activeWindow.view
return !oView
	|| oView.type == wdNormalView
EndFunction

int function SetNormalOrDraftView()
var object oWord = GetOWord()
var object oView = oWord.view
if !oView
	return false
else
	oView.type = wdNormalView
	return IsNormalOrDraftView()
endIf
endFunction

string Function getLanguageName(int languageId)
var object oWord = GetOWord()
return oWord.languages(languageId).nameLocal
EndFunction

string function getCurrentLanguageName()
var object oWord = GetOWord()
return getLanguageName(oWord.selection.languageId)
EndFunction

int function BrailleIsInputSource()
return GetLastInputSource() == InputSource_Braille
EndFunction

int function IsSelectingOrDeselectingTextWithBrailleKeyboard() 
var
	string currentKey = getCurrentScriptKeyName(),
	string lastScript = getScriptAssignedTo (CurrentKey)
if stringContains (currentKey, "Routing") return TRUE endIf
if !stringStartsWith (stringLower (CurrentKey), "braille dot") return FALSE endIf
return stringStartsWith(stringLower (lastScript), "select") > 0
endFunction

int function ScriptWillSpeakExtendedSelection()
return cWDExtendedSelection.ScriptSelectionByUnitModeKeyPressed == true
EndFunction

int Function WasDocumentEverSaved()
var
	int index,
	int iSafety
index=1
iSafety=10
var object oWord = GetOWord()
while index<=iSafety
	if oWord.activeDocument.name==scDocument+intToString(index)
	&& !oWord.activeDocument.NormalTemplate.saved
		return false ; document has not been previously saved.
	endIf
	index=index+1
endWhile
return true
endFunction

string Function GetNearestProofreadingElementText(int iPEType)
Var
	string sText,
	string sAuthor,
	string sInitials,
	string sDesc,
	string sDate,
	int iSelCtxType
;To prevent Windows 7 Word crash, must use Dom method instead of newer method to collect items in this way.
SetDocumentUpdateNotification(false)
iSelCtxType = ProofreadingElementToContextFlag(iPEType)
if GetSelectionContext() & iSelCtxType
; or we get at least one annotation at all
|| GetAnnotationCountAtCaret()
|| MoveToProofreadingElement(iPEType,s_next,sText)
|| MoveToProofreadingElement(iPEType,s_prior,sText)
	GetProofreadingElementInfoAtCursor (iPEType,sText,sAuthor,sInitials,sDesc,sDate)
else
	sText = cscNull
endIf
SetDocumentUpdateNotification(true)
pause()
return sText
EndFunction

int function GetProofreadingElementInfoAtCursor  (int PEType, string byRef Text, string byRef Author,string byRef targetText,string byRef description,string byRef dateTime)
;certain types require old functionality,
; because they aren't annotations.
if PEType == PESpellingError
|| PEType == PEGrammaticalError
|| PEType == PERevision
	return GetProofreadingElementInfo (PEType, text, author, targetText, DateTime, description)
endIf
var
	int index,
	int elementsCount = GetAnnotationCountAtCaret()
if elementsCount <= 0 return FALSE endIf
return GetAnnotationAtCaret (index, text, author, targetText, DateTime, description)
endFunction

string function GetFootnoteOrEndNote()
var
	string sRefText,
	string sText,
	string sAuthor,
	string sInitials,
	string sDesc,
	string sDate,
	string sMsg
; First try with new annotation function. It has no limit on length of text.
if GetAnnotationAtCaret (0, sRefText, sAuthor, sText, sDate, sDesc)
	; SRefText and sDesc are already localized from UIA.
	sMsg = sDesc+ cscSpace + sRefText + ": " + sText
	return sMsg
endIf
if GetProofreadingElementInfo(peFootnote,sText,sAuthor,sInitials,sDesc,sDate)
	sMsg = formatString(msgFootnoteReference,sDesc,sText)
Elif GetProofreadingElementInfo(peEndNote,sText,sAuthor,sInitials,sDesc,sDate)
	sMsg = formatString(msgEndNoteReference,sDesc,SText)
endIf
return sMsg
EndFunction

int function DescribeTextAnnotationOrAttributes(int alsoSpeakIt, optional int IgnoreFontInfo)
var 
	int textAttributes,
	int outputType
textAttributes = getCharacterAttributes()
if alsoSpeakIt
	outputType=OT_USER_REQUESTED_INFORMATION
else
	outputType=OT_BRAILLE_MESSAGE
endIf
if textAttributes&attrib_superscript
	; May not be a footnote or endnote reference, need to check.
	; If not, we can fall back to describing the font.
	var string note=GetFootnoteOrEndNote()
	if note!=cscNull
		SayMessage(outputType, note)
		return true
	endIf
endIf
if textAttributes&attrib_has_comment
	announceComment(outputType)
	return true
endIf
if textAttributes& (attrib_REVISED | ATTRIB_INSERTION | ATTRIB_DELETION | ATTRIB_EDITING_LOCKED)
	var
		string revInfo,
		string revText
	if GetRevisionInfo(outputType,revInfo,revText)
		SayFormattedMessage(outputType, revInfo+cscSpace+revText)
		return true
	endIf
endIf
if textAttributes&attrib_hypertext
	return false; let Internal code activate the link.
endIf
if textAttributes&ATTRIB_MISSPELL 
	sayMessage(outputType, msgMisspelled1_s + cscSpace + getWord())
	if alsoSpeakIt
		spellString(getWord())
	endIf
	return true
endIf
if textAttributes&(ATTRIB_GRAMMAR | ATTRIB_ADVANCED_PROOFING)
	sayMessage(outputType, msgGrammaticalError1_S + cscSpace + getSentence())
	return true
endIf
if !IgnoreFontInfo
	; IgnoreFontInfo is used by insert tab and related functions where we just want the extended attributes info spoken but not fonts.
	SayFormattedMessage(outputType, GetFont())
endIf
return true
endFunction

void function SetDocumentUpdateNotification(int bVisibilityMode)
var object oWord = GetOWord()
if bVisibilityMode
	;restore screen updates and selection context change detection to normal states
	c_WordFuncTester.SuppressSelectionChangeDetection = false
	oWord.ScreenUpdating=VBTrue
else
	;turn off screen updates,
	;and don't speak selection context changes
	c_WordFuncTester.SuppressSelectionChangeDetection = true
	; To avoid problems, use the following method for turning off screen redraw
	oWord.ScreenUpdating=false
EndIf
EndFunction

int function DocumentUpdateNotificationMode()
;DocumentUpdateNotificationMode is true when the selection change detection is not suppressed.
;note that Word screen updating will be off when document update notification mode is off.
return !c_WordFuncTester.SuppressSelectionChangeDetection
EndFunction

int function ShouldWaitForDocumentChangeToRunEvent()
c_WordFuncTester.RunSelectionContextEvents =
	!CollectionItemExists(cWDActiveDocument,"name")
	&& !OutlookIsActive()
return c_WordFuncTester.RunSelectionContextEvents
EndFunction

string Function GetSectionInfoMessage(int iOutputType)
var
	string sMsg,
	string s,
	object oSelection,
	int sectionCount,
	object oSection,
	object oPageNumbers,
	int currentPageNumber, ; active end adjusted page number see wdInformation
	object oPageSetup,
	string sLeftMargin,
	string sRightMargin,
	string sTopMargin,
	string sBottomMargin
var object oWord = GetOWord()
oSelection = oWord.selection
sectionCount = oWord.activeDocument.sections.count
oSection = oSelection.sections(1)
oPageSetup = oSection.pageSetup
currentPageNumber = oSelection.information(wdActiveEndAdjustedPageNumber)
sMsg = sMsg+FormatOutputMessage(iOutputType,true,
	msgSectionDesc1_L, msgSectionDesc1_S,
	intToString(sectionCount), intToString(oSection.index))
s = GetSectionHeadersFootersMessage(oSection, currentPageNumber, true, iOutputType)
if s
	sMsg = sMsg+s+cscBufferNewLine
endIf
if isActiveDocumentProtected()
	;can't get margin info because PointsToDefaultUnits fails.
	;it fails upon using the function oWord.pointsToInches
	;and presumably any of the conversion functions.page setup feature is unavailable.
	return sMsg
endIf
sLeftMargin = PointsToDefaultUnits(oPageSetup.LeftMargin)
sRightMargin = PointsToDefaultUnits(oPageSetup.rightMargin)
sTopMargin = PointsToDefaultUnits(oPageSetup.topMargin)
sBottomMargin = PointsToDefaultUnits(oPageSetup.bottomMargin)
if oPageSetup.mirrorMargins == VBTrue
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgMirrorMargins1_L,msgMirrorMargins1_s,
		sLeftMargin,sRightMargin,sTopMargin,sBottomMargin)
Else
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgMargins1_L,msgMargins1_s,
		sLeftMargin,sRightMargin,sTopMargin,sBottomMargin)
endIf
return sMsg
EndFunction

string Function GetDocItemsMessage(int iOutputType)
var
	string sMsg,
	object oDoc,
	int inlineShapeCount,
	int shapeCount,
	int tableCount,
	int linkCount,
	int formfieldCount,
	int fieldCount,
	int commentCount,
	int footnoteCount,
	int endnoteCount
if !InDocument()
	return cscNull
endIf
tableCount = GetDocTableCount()
if tableCount > 0
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgDocTables1_L, msgDocTables1_S, intToString(tableCount))
endIf
linkCount = GetLinkCount()
if linkCount > 0
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgDocLinks_L, msgDocLinks_S, intToString(linkCount))
endIf
formfieldCount = StringSegmentCount(GetListOfFormFields(),cscNull)
if formfieldCount > 0
 	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgDocFields1_L, msgDocFields1_S, intToString(formfieldCount))
endIf
fieldCount = GetProofreadingElementCount(peField)
if fieldCount > 0
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgDocFields1_L, msgDocFields1_S, intToString(fieldCount))
endIf
shapeCount = GetProofreadingElementCount(peObject)
if shapeCount > 0
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgDocDrawingLayerObjects1_L, msgDocDrawingLayerObjects1_S,
		intToString(shapeCount))
endIf
InlineShapeCount = GetProofreadingElementCount(peInlineShape)
if inlineShapeCount > 0
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgDocTextLayerObjects1_L, msgDocTextLayerObjects1_S,
		intToString(inlineShapeCount))
endIf
CommentCount = GetProofreadingElementCount(peComment)
if CommentCount > 0
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgCommentCount_l,msgCommentCount_s, intToString(CommentCount))
endIf
FootnoteCount = StringSegmentCount(GetListOfProofreadingElements(peFootnote),list_item_separator)
if footnoteCount > 0
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgFootnoteCount_l, msgFootnoteCount_s, intToString(FootnoteCount))
endIf
EndnoteCount = StringSegmentCount(GetListOfProofreadingElements(peEndnote),list_item_separator)
if EndnoteCount > 0
	sMsg = sMsg+FormatOutputMessage(iOutputType,true,
		msgEndnoteCount_l,msgEndnoteCount_s, intToString(EndnoteCount))
endIf
return sMsg
EndFunction

void Function sayDocumentWindowHelp()
var
	object oSelection,
	object oInformation,
	int bOutlookIsActive,
	int bIsDocProtected,
	int bIsVirtualPCCursorActive
If UserBufferIsActive()
	UserBufferDeactivate()
EndIf
UserBufferClear()
bIsVirtualPCCursorActive = IsVirtualPCCursor()
If IsReadingViewActive()
	UserBufferAddText(msgMainDocWindow1_L)
	UserBufferAddText(FormatString(msgScreenSensitiveHelp_ReadingLayout))
	userBufferAddText(cscBufferNewLine)
	UserBufferAddText(cmsgBuffExit)
	UserBufferActivate()
	JAWSTopOfFile()
	sayAll(FALSE)
	return
EndIf
if GetCurrentZoomLevel() == ZOOM_MANY_PAGES 
	UserBufferAddFormattedMessage(
		msgScreenSensitiveHelp_ZoomLevel_l, msgScreenSensitiveHelp_ZoomLevel_s)
endIf
bOutlookIsActive = OutlookIsActive()
bIsDocProtected = IsActiveDocumentProtected()
if bOutlookIsActive
&& bIsDocProtected
	if getObjectTypeCode() == WT_LINK
	|| IsLinkOrHeadingUnderVirtualCursor() then ; generalized to all link types when in virtual Outlook messages
		var string URL = GetURLForFocusedLink()
		if ! stringIsBlank (URL) userBufferAddText (URL+cscBufferNewLine)endIf
	endIf
	UserBufferAddText(msgScreenSensitiveHelpReadOnlyEmailMessage+cscBuffernewLine)
	if !bIsVirtualPCCursorActive
		UserBufferAddText(msgScreenSensitiveHelpUseVPCForReadOnlyMessages_Off+cscBuffernewLine)
	endIf
	UserBufferAddText(msgScreenSensitiveHelpOutlookReadOnlyMessage+cscBufferNewLine)
elif quickNavKeyTrapping()
	userBufferAddText(msgScreenSensitiveHelpQuickNav)
EndIf
if !bOutlookIsActive
	UserBufferAddText(msgMainDocWindow1_L)
EndIf
if isSelectionModeActive()
 	; Extend Selection Mode is on ...
	UserBufferAddFormattedMessage(msgExtSelModeHelp1_L, msgExtSelModeHelp1_S)
	UserBufferActivate()
	JAWSTopOfFile()
	sayAll(FALSE)
	return
endIf
var object oWord = GetOWord()
oSelection = oWord.selection
If !bOutlookIsActive
	if isFormField()
		UserBufferAddText(GetFormFieldHelpMessage(ot_user_buffer))
	Else
		If IsActiveDocumentProtected()
			UserBufferAddText(FormatString(cmsgScreenSensitiveHelp16_L))
		EndIf
	EndIf
else
	If !bIsDocProtected
		UserBufferAddText(msgScreenSensitiveHelpOutlookMessage)
	EndIf
EndIf
;Outlook virtual pc cursor messages cannot access the document objects the way the standard selection object can:
if bIsVirtualPCCursorActive && bOutlookIsActive
	UserBufferAddText (msgScreenSensitiveHelpUseVPCForReadOnlyMessages_On)
	UserBufferAddText (cscBufferNewLine)
	UserBufferAddText(cmsgBuffExit)
	UserBufferActivate()
	JAWSTopOfFile()
	sayAll(FALSE)
	return ; additional information from the object's selection not available in virtualized outlook message.
endIf
if InTable()
	UserBufferAddText(GetTableScreenSensitiveHelpInfo())
	UserBufferAddText(GetCellPatternAndShadingDescription())
else
	if !bOutlookIsActive
		if oWord.activeDocument.activeWindow.panes.count > 1
			if oWord.activeWindow.activePane.frameSet == VBTrue
				UserBufferAddFormattedMessage(msgWindowSplit1_L, msgWindowSplit1_S,
					intToString(oWord.activeDocument.activeWindow.panes.count),
					intToString(oWord.activeWindow.activePane.index))
			else ; not in a frame
				UserBufferAddFormattedMessage(msgWindowSplit2_L, msgWindowSplit2_S,
					intToString(oWord.activeDocument.activeWindow.panes.count),
					intToString(oWord.activeWindow.activePane.index))
			endIf
		endIf
		oInformation = oSelection.information
		if oInformation(wdInHeaderFooter) == VBTrue
			UserBufferAddFormattedMessage(msgHeaderFooter1_L, msgHeaderFooter1_S)
		elif oInformation(wdInFootnoteEndnotePane) == VBTrue
		|| c_WordFuncTester.StoryType == wdFootnotesStory || c_WordFuncTester.StoryType == wdEndnotesStory
			if oInformation(wdInFootnote) == VBTrue || c_WordFuncTester.StoryType == wdFootnotesStory
				UserBufferAddText (msgFootnoteAreaFootnoteEndnotePane2_L)
			elif oInformation(wdInEndnote) == VBTrue || c_WordFuncTester.StoryType == wdEndnotesStory
				UserBufferAddText (msgEndnoteAreaFootnoteEndnotePane2_L)
			endIf
		elif oInformation(wdInCommentPane) == VBTrue || c_WordFuncTester.StoryType == wdCommentsStory
			UserBufferAddText (msgCommentPane2_L)
		else
			UserBufferAddFormattedMessage(
				MsgTextAreaOfOpenDocument1_L,
				msgTextAreaOfOpenDocument1_S)
		endIf
		if IsOutlineViewActive()
			UserBufferAddText(msgOutlineView1_L)
			UserBufferAddText(GetOutlineViewStatusMessage(ot_user_buffer))
		endIf
		UserBufferAddText(GetNewspaperColumnHelpMessage(ot_user_buffer))
	EndIf
endIf
UserBufferAddText(GetDocItemsMessage(ot_user_buffer))
if !bOutlookIsActive
	UserBufferAddText(GetSectionInfoMessage(ot_user_buffer))
EndIf
UserBufferAddText(GetDocumentProtectionStatusMessage())
if bIsDocProtected
	UserBufferAddText(msgProtectionStatusExplained)
endIf
if !(bOutlookIsActive && bIsDocProtected)
&& oWord.options.checkSpellingAsYouType == VBTrue
	UserBufferAddText(msgSpellingIsCheckedAsYouType1_L)
endIf
if oWord.options.checkGrammarAsYouType == VBTrue
	UserBufferAddText(msgGrammarIsCheckedAsYouType1_L)
endIf
if !bOutlookIsActive
&& oSelection.Document.trackRevisions == VBTrue
	UserBufferAddText(msgTrackChangesIsEnabled1_L)
endIf
UserBufferAddText(cScBufferNewLine+FormatString(msgOffice12ScriptKeyHelp))
AddHotKeyLinks()
UserBufferActivate()
JawsTopOfFile()
SayAll(FALSE)
EndFunction

string Function GetLineSpacingDescription(int nLineSpacing,int nLineSpacingRule)
var	string sLines
if nLineSpacingRule == wdLineSpaceSingle
	return formatString(msgLineSpacing,msg325_L)
ElIf nLineSpacingRule == wdLineSpace1PT5 then ; 1.5 inches
	nLineSpacing = nLineSpacing/12
	sLines = intToString(nLineSpacing/10)+cscPeriod+intToString(nLineSpacing-10	)
	return formatString(msgNumberOfLines,sLines)
elIf nLineSpacingRule == wdLineSpaceDouble
	return FormatString(msgLineSpacing,msg327_L)
elif nLineSpacingRule == wdLineSpaceAtLeast
	return formatString(msg328_L, intToString(nLineSpacing/10))
elif nLineSpacingRule == wdLineSpaceExactly
	return formatString(msg329_L, intToString(nLineSpacing/10))
elif nLineSpacingRule == wdLineSpaceMultiple
	sLines = intToString(nLineSpacing/120)
	return formatString(msgMultipleNumberOfLines, sLines)
endIf
EndFunction

void function LineSpacingChangedEvent(int nLineSpacing, int nLineSpacingRule)
;Currently this function is only called in MSWord when the line spacing changes.
;It is fired as part of the SelectionContext event mechanism.
;
;nLineSpacing is in tenths of a point, thus a value of 120 is 12 points, 125 12.5 points, etc.
;Typically 12 points is single, 24 double, 180 1.5, etc.
;Other values are possible depending on the line spacing rule,
;eg a value of 36 points would be returned if the rule was multiple and the value 3.
;with a rule of exact and a value of 10 points, the value would be 10.
;divide by 10 to get the points, subtract this from original to get decimal points
;since script language doesn't have floats.
;
;nLinespacingRule is a value specifying the line spacing rule,
;taken from the MSWord object model.
;    wdLineSpaceSingle = 0,
;    wdLineSpace1pt5 = 1,
;    wdLineSpaceDouble = 2,
;    wdLineSpaceAtLeast = 3,
;    wdLineSpaceExactly = 4,
;    wdLineSpaceMultiple = 5
if ShouldWaitForDocumentChangeToRunEvent()
	c_WordFuncTester.RunSelectionContextEvents = true
	return
EndIf
if !LineSpacingDetection()
|| SayAllINProgress()
	return
EndIf
if nLineSpacing ==  cWDActiveDocument.lineSpacing
	return
endIf
var	string sMsg
cWDActiveDocument.lineSpacing = nLineSpacing
sMsg = GetLineSpacingDescription(nLineSpacing,nLineSpacingRule)
if !BrailleIsInputSource()
	SayUsingVoice(vctx_message,sMsg,ot_help)
endIf
if BrailleInUse()
	ScheduleBrailleFlashMessage(sMsg)
EndIf
endFunction

void function ClearSayAllGlobal()
c_WordFuncTester.CaretMovedIgnoreSayAll = false
endFunction

int function SayAll (int UseSayAllSynth)
c_WordFuncTester.CaretMovedIgnoreSayAll = WindowCategoryIsWordDocument()
SayAll(UseSayAllSynth)
endFunction

void function SetDocumentCaretMovementType(int movementUnit, optional int forcedRecognition)
if ! SayAllInProgress()
	ClearSayAllGlobal()
endIf
;Because Word and Outlook have a different firing order for CaretMovedEvent and table events,
;we are using two separate variables to track the caret movement.
;This ensure that we can get the most recent caret movement in both apps.
cLastTracked.caretMovementUsedByWordDocumentTables = movementUnit
cLastTracked.caretMovementUsedByEditableMessageTables = movementUnit
cLastTracked.caretMovementUsedBySelectionContext = movementUnit
cLastTracked.forcedRecognition = forcedRecognition
EndFunction

void function BrailleMessageUsingOutputType(int OT, string sLong, optional string sShort)
var int iBrl = ShouldItemBraille(OT)
if !iBrl return endIf
if iBrl == message_long
|| !sShort
	BrailleMessage(sLong)
else
	BrailleMessage(sShort)
endIf
EndFunction

string Function GetSectionHeadersFootersMessage(object oSection, int currentPageNumber,
	optional int bIncludeText, int iOutputType)
var
	string sMsg,
	string sTemp,
	object oPageSetup,
	object oHeaders,
	object oFooters,
	object oDoc,
	int vbSaved
var object oWord = GetOWord()
if !oSection return cscNull endIf
oDoc = oWord.activeDocument
vbSaved = oDoc.saved
oPageSetup = oSection.pageSetup
oHeaders = oSection.headers
oFooters = oSection.footers
if oPageSetup.differentFirstPageHeaderFooter == VBTrue
&& currentPageNumber == 1
	if oHeaders(wdHeaderFooterFirstPage).exists == VBTrue
		 if oHeaders(wdHeaderFooterFirstPage).range.characters.count > 1
			if bIncludeText
				sTemp = oHeaders(wdHeaderFooterFirstPage).range.text
				if stringStripAllBlanks (sTemp) == "/"
				; contains graphics with alt text we can't get to from the object model directly.
					sTemp = msgHeaderFooterContainsGraphics+cscBufferNewLine+msgEditHeaderInstructions
				endIf
				sMsg = sMsg+FormatOutputMessage(iOutputType,true,
					msgHeaderFirstPage1, msgHeaderFirstPage1,
					sTemp, getPageNumberInfo(oHeaders(wdHeaderFooterFirstPage)))
			else
				sMsg = sMsg+msgHasHeaderFirstPage+cscBufferNewLine
			endIf
		endIf
	endIf
	if oFooters(wdHeaderFooterFirstPage).exists == VBTrue
	 	if oFooters(wdHeaderFooterFirstPage).range.characters.count > 1
			if bIncludeText
				sTemp = oFooters(wdHeaderFooterFirstPage).range.text
				if stringStripAllBlanks (sTemp) == "/"
				; contains graphics with alt text we can't get to from the object model directly.
					sTemp = msgHeaderFooterContainsGraphics+cscBufferNewLine+msgEditFooterInstructions
				endIf
				sMsg = sMsg+FormatOutputMessage(iOutputType,true,
					msgFooterFirstPage1, msgFooterFirstPage1,
					sTemp, getPageNumberInfo(oFooters(wdHeaderFooterFirstPage)))
			else
				sMsg = sMsg+msgHasFooterFirstPage+cscBufferNewLine
			endIf
		endIf
	endIf
else
	if oPageSetup.oddAndEvenPagesHeaderFooter  == VBTrue
	&& isEvenNumber(currentPageNumber)
		if oHeaders(wdHeaderFooterEvenPages).exists == VBTrue
			if oHeaders(wdHeaderFooterEvenPages).range.characters.count > 1
				if bIncludeText
					sTemp = oHeaders(wdHeaderFooterEvenPages).range.text
					if stringStripAllBlanks (sTemp) == "/"
					; contains graphics with alt text we can't get to from the object model directly.
						sTemp = msgHeaderFooterContainsGraphics+cscBufferNewLine+msgEditHeaderInstructions
					endIf
					sMsg = sMsg+FormatOutputMessage(iOutputType,true,
						msgHeaderEvenPages1, msgHeaderEvenPages1,
						sTemp, getPageNumberInfo(oHeaders(wdHeaderFooterEvenPages)))
				else
					sMsg = sMsg+msgHasHeaderEvenPages+cscBufferNewLine
				endIf
			endIf
		endIf
		if oFooters(wdHeaderFooterEvenPages).exists == VBTrue
			if oFooters(wdHeaderFooterEvenPages).range.characters.count > 1
				if bIncludeText
					if stringStripAllBlanks (sTemp) == "/"
					; contains graphics with alt text we can't get to from the object model directly.
						sTemp = msgHeaderFooterContainsGraphics+cscBufferNewLine+msgEditFooterInstructions
					endIf
					sTemp = oFooters(wdHeaderFooterEvenPages).range.text
					sMsg = sMsg+FormatOutputMessage(iOutputType,true,
						msgFooterEvenPages1, msgFooterEvenPages1,
						sTemp, getPageNumberInfo(oFooters(wdHeaderFooterEvenPages)))
				else
					sMsg = sMsg+msgHasFooterEvenPages+cscBufferNewLine
				endIf
			endIf
		endIf
	else
		if oHeaders(wdHeaderFooterPrimary).range.characters.count > 1
			if bIncludeText
				sTemp = oHeaders(wdHeaderFooterPrimary).range.text
				if stringStripAllBlanks (sTemp) == "/"
				; contains graphics with alt text we can't get to from the object model directly.
					sTemp = msgHeaderFooterContainsGraphics+cscBufferNewLine+msgEditHeaderInstructions
				endIf
				sMsg = sMsg+FormatOutputMessage(iOutputType,true,
					msgPrimaryHeader1, msgPrimaryHeader1,
					sTemp, getPageNumberInfo(oHeaders(wdHeaderFooterPrimary)))
			else
				sMsg = sMsg+msgHasPrimaryHeader+cscBufferNewLine
			endIf
		endIf
		if oFooters(wdHeaderFooterPrimary).range.characters.count > 1
			if bIncludeText
				sTemp = oFooters(wdHeaderFooterPrimary).range.text
				if stringStripAllBlanks (sTemp) == "/"
				; contains graphics with alt text we can't get to from the object model directly.
					sTemp = msgHeaderFooterContainsGraphics+cscBufferNewLine+msgEditFooterInstructions
				endIf
				sMsg = sMsg+FormatOutputMessage(iOutputType,true,
					msgPrimaryFooter1, msgPrimaryFooter1,
					sTemp, getPageNumberInfo(oFooters(wdHeaderFooterPrimary)))
			else
				sMsg = sMsg+msgHasPrimaryFooter+cscBufferNewLine
			endIf
		endIf
	endIf
endIf
oDoc.saved = vbSaved
return sMsg
EndFunction

void function DetectDocumentHeadersFooters(optional int SectionNumber)
var object oWord = GetOWord()
if !sectionNumber sectionNumber = 1 endIf
if OutlookIsActive()
|| !HeadersFootersDetection()
|| oWord.selection.sections(1).index != sectionNumber
	return
endIf
var
	string s,
	string msg
s = GetSectionHeadersFootersMessage(oWord.activeDocument.sections(sectionNumber),
	oWord.selection.information(wdActiveEndAdjustedPageNumber))
if s
	msg = FormatString(msgSectionHasHeadersFooters,IntToString(sectionNumber),s)
	SayFormattedMessageWithVoice(vctx_message,ot_message,msg,msg)
	BrailleMessage (msg)
endIf
EndFunction

string Function GetPageNumberInfo(object oHeaderFooter)
var
	object oPageNumbers,
	int alignment
oPageNumbers = oHeaderFooter.pageNumbers
if oPageNumbers.count == 0
	return cscNull
endIf
; we will only return the first page number
; and report its alignment
alignment = oPageNumbers(1).alignment
if alignment == wdAlignPageNumberCenter
	return msg54_L
elif alignment == wdAlignPageNumberInside
	return msg55_L
elif alignment == wdAlignPageNumberLeft
	return msg56_L
elif alignment == wdAlignPageNumberOutside
	return msg57_L
elif alignment == wdAlignPageNumberRight
	return msg58_L
else
	return cscNull
endIf
EndFunction

void function PageSectionColumnChangedEvent(int nPageNumber, int nPrevPageNumber,
	int nSectionNumber, int nPrevSectionNumber,
	int nTextColumnNumber, int nPrevTextColumnNumber,
	int nTextColumnCount, int nPrevTextColumnCount)
Var
	int iOutputType,
	string smsg,
	string s,
	int iLastTrackedEvent
if ShouldWaitForDocumentChangeToRunEvent()
	return
EndIf
if nPageNumber && !nPrevPageNumber
&& nSectionNumber && !nPrevSectionNumber
&& nTextColumnNumber && !nPrevTextColumnNumber
&& nTextColumnCount && !nPrevTextColumnCount
	; This is not a page/section/column change;
	; this is probably a list level change.
	return
endIf
iLastTrackedEvent = GetLastTrackedEvent()
var object oWord = GetOWord()
if (DocumentUpdateNotificationMode() == off && cWDActiveDocument.returningToMarkedPlace != true)
|| ((iLastTrackedEvent == event_menuMode || iLastTrackedEvent == event_focusChanged)
	&& !(cLastTracked.prevEvent == event_documentChanged || cLastTracked.prevEvent == event_autoStart))
|| OutlookIsActive()
|| IsActiveDocumentProtectedForm()
|| oWord.activeDocument.activeWindow.view.type == wdWebView
	return
EndIf
if SayAllInProgress()
	iOutputType=ot_line
else
	iOutputType=ot_help
endIf
if nPageNumber != nPrevPageNumber
;Do not announce page 1 when returning to or when opening a document.
&& (nPageNumber != 1 || nPrevPageNumber != -1)
	smsg = smsg+formatString(MsgPageNo,IntToString(nPageNumber))+cscBufferNewLine
endIf
if nSectionNumber != nPrevSectionNumber
	smsg = sMsg+FormatString(msgSectionNo,IntToString(nSectionNumber))+cscBufferNewLine
	;at times, the page number may be the same as that in a previous section.
	;but since this is a new section, it must be re-announced here.
	if nPageNumber==nPrevPageNumber
		smsg = sMsg+formatString(MsgPageNo,IntToString(nPageNumber))+cscBuffernewLine
	EndIf
	if HeadersFootersDetection()
		s = GetSectionHeadersFootersMessage(oWord.activeDocument.sections(nSectionNumber), nPageNumber)
		if s
			smsg = smsg+s
		endIf
	endIf
EndIf
if nTextColumnNumber != nPrevTextColumnNumber
	smsg = sMsg+FormatString(msgTextColumnNo,IntToString(nTextColumnNumber))+cscBufferNewLine
EndIf
if nTextColumnCount != nPrevTextColumnCount
	smsg = sMsg+formatString(msgTextColumnCount,IntToString(nTextColumnCount))+cscBufferNewLine
EndIf
if cWDActiveDocument.returningToMarkedPlace == true
	;the following message is used by SayWordATMarkedPlace when returning to marked place
	;and is then deleted after being spoken.
	cWDActiveDocument.messageWaitingToSpeak = sMsg
	return
EndIf
if !sMsg return endIf
if BrailleInUse()
	ScheduleBrailleFlashMessage(sMsg)
EndIf
if !BrailleIsInputSource()
	SayUsingVoice(vctx_message,sMsg,iOutputType)
	if cLastTracked.caretMovementUsedBySelectionContext == Unit_Page_Next
	|| cLastTracked.caretMovementUsedBySelectionContext == Unit_Page_Prior
		SayLine()
	endIf
endIf
EndFunction
void function StoryChangedEvent(int nStoryType)
var
	string sMsg
ClearAnyScheduledDocumentTopAndBottomEdgeAlert()
;nStoryType is one of the wdStoryType constants
If c_WordFuncTester.StoryType == nStoryType
	return
Else
	c_WordFuncTester.StoryType = nStoryType
EndIf
; for header and footer types while in header and footer pane,
; for comments pane, and for footnote/endnote panes.:
If nStoryType == wdEvenPagesFooterStory
	sMsg = msgEvenPagesFooter
ElIf nStoryType == wdEvenPagesHeaderStory
	sMsg = msgEvenPagesHeader
elIf nStoryType == wdPrimaryFooterStory
	sMsg = msgFooter
ElIf nStoryType == wdPrimaryHeaderStory
	sMsg = msgHeader
ElIf nStoryType == wdFirstPageFooterStory
	sMsg = msgFirstPageFooter
ElIf nStoryType == wdFirstPageHeaderStory
	sMsg = msgFirstPageHeader
ElIf nStoryType == wdFootnotesStory
	sMsg = msgFootnotePane1
ElIf nStoryType == wdEndnotesStory
	sMsg = msgEndNotePane1
ElIf nStoryType == wdCommentsStory
	sMsg = msgCommentPane2
EndIf
if !BrailleIsInputSource()
	SayUsingVoice(vctx_message,sMsg,ot_help)
elif ! IsSelectingOrDeselectingTextWithBrailleKeyboard()
	BrailleMessageUsingOutputType(ot_help,sMsg)
endIf
endFunction

string Function getPaneName(int nStoryType)
if nStoryType == wdMainTextStory
	return msgMainDocPane
elif nStoryType == wdFootnotesStory
	return msgFootNotePane
elif nStoryType == wdEndnotesStory
	return msgEndNotePane
elif nStoryType == wdCommentsStory
	return msgCommentPane
elif nStoryType == wdTextFrameStory
	return msgTextFramePane
elif nStoryType == wdEvenPagesHeaderStory
	return msgEvenPagesHeaderPane
elif nStoryType == wdPrimaryHeaderStory
	return msgPrimaryHeaderPane
elif nStoryType == wdEvenPagesFooterStory
	return msgEvenPagesFooterPane
elif nStoryType == wdPrimaryFooterStory
	return msgPrimaryFooterPane
elif nStoryType == wdFirstPageHeaderStory
	return msgFirstPageHeaderPane
elif nStoryType == wdFirstPageFooterStory
	return msgFirstPageFooterPane
endIf
endFunction

void Function sayActivePane()
if isStatusBarToolBar()
|| InTaskPaneDialog()
|| inRibbons()
|| IsVirtualRibbonActive()
|| DialogActive()
	return
endIf
var
	object oPane,
	int nStoryType,
	string sPaneName
var object oWord = GetOWord()
nStoryType = oWord.selection.storytype
sPaneName = GetPaneName(nStoryType)
if nStoryType
	oPane = oWord.activeWindow.activePane
	if oPane.frameSet
		SayFormattedMessage(ot_help,
			formatString(msgDocFramePane1, oPane.frameSet.frameName, intToString(oPane.index)))
	elif !stringIsBlank(sPaneName)
		SayFormattedMessage(ot_help,sPaneName)
	EndIf
endIf
EndFunction

void function SaySelectionContextFieldChange(int bSayAll, int iOutputType,
	int nSelectionContextFlags, ;flags for the user settings
	int nCurrentContextFlags) ;flags for the current document context
if bSayAll
|| BrailleIsInputSource()
	return
EndIf
var
	int bNavByChar,
	int bNavByWord,
	int bNavByLine,
	int bNavByHomeEnd
bNavByChar = IsMovingByCharacter(cLastTracked.caretMovementUsedBySelectionContext)
bNavByWord = IsMovingByWord(cLastTracked.caretMovementUsedBySelectionContext)
bNavByLine = IsMovingByLine(cLastTracked.caretMovementUsedBySelectionContext)
bNavByHomeEnd = IsMovingByHomeOrEnd(cLastTracked.caretMovementUsedBySelectionContext)
if !cWDSelectionContext.field.type
&& cWDPrevSelectionContext.field.type == wt_link
	if bNavByChar
		sayUsingVoice(vctx_message,msgOutOfLink,iOutputType)
		return
	EndIf
elif cWDSelectionContext.field.type == wt_link
	if bNavByChar
		SayUsingVoice(vctx_message,scLink,ot_line)
	elif !bNavByLine
	&& !bNavByWord
	&& !QuickNavKeyTrapping()
		SayField()
		return
	EndIf
elif cWDSelectionContext.field.type == wt_embeddedObject
	SayUsingVoice(vctx_message,
		formatString(msgField1,cWDSelectionContext.field.prompt),
		iOutputType)
	return
endIf
if OutlookIsActive()
	;All field code management which includes Outlook must preceed this block
	return
endIf
if (nSelectionContextFlags & nCurrentContextFlags)
	;Internal code speaks when moving into the field by word navigation if the version of Word is 2013,
	;and internal code always speaks if moving into a field by line navigation:
	if bNavByChar
	|| bNavByHomeEnd
		SayUsingVoice(vctx_message,
			formatString(msgField1,cWDSelectionContext.field.prompt),
				iOutputType)
		endIf
else
	if bNavByChar
	|| bNavByWord
	|| bNavByLine
	|| bNavByHomeEnd
		SayUsingVoice(vctx_message,
			msgOutOfField1_L,
			iOutputType)
	endIf
endIf
EndFunction

void function SaySelectionContextFormfieldChange(int bSayAll,
	int iOutputType, int nSelectionContextFlags, int nCurrentContextFlags)
;Braille may be updated before the selection context change event fires,
;in which case the braille is out of sync with the current formfield:
BrailleRefresh()
if BrailleIsInputSource()
	;Structured braille shows the form field
	return
endIf
if !(nCurrentContextFlags & selCtxFormFields)
	sayFormattedMessageWithVoice(vctx_message,iOutputtype,
		msgOutOfFormField1_L,msgOutOfFormField1_S)
else
	if getSelectedText()!=cscNull then
		; SayObjectTypeAndText will speak the value but selectionChangedEvent will also reread the selected text causing doublespeaking.
		;Just indicate the prompt and type and let the selected text be spoken by the selection changed event if it comes from tab.
		indicateControlType(GetObjectSubtypeCode(), GetObjectName())
		if  FocusChangeTriggeredByUserNavigation()
			SayFormattedMessageWithVoice(vctx_message,ot_selected,cmsgSelected,cmsgSilent)
            sayField()
		EndIf
	else
		self::sayObjectTypeAndText()
	endIf
	if ExtraHelpIndication()
	&& stringLength(cWDSelectionContext.formField.help)>0
		SayF1Help()
	EndIf
EndIf
endFunction

string function GetSelectionCommentText()
return cWDSelectionContext.comment.text
EndFunction

string function GetSelectionCommentAuthor()
return cWDSelectionContext.comment.author
EndFunction

string function GetSelectionCommentDate()
return cWDSelectionContext.comment.date
EndFunction

string function GetSelectionCommentDocumentText()
return cWDSelectionContext.comment.documentText
EndFunction

string function GetSelectionFootnoteText()
return cWDSelectionContext.footnote.text
EndFunction

string function GetSelectionFootnoteAuthor()
var
	string sResult
sResult = cWDSelectionContext.footnote.author
if stringIsBlank (sResult)
	sResult = cWDSelectionContext.footnote.reference
endIf
return sResult
EndFunction

string function GetSelectionEndnoteText()
return cWDSelectionContext.endnote.text
EndFunction

string function GetSelectionEndnoteAuthor()
var
	string sResult
sResult = cWDSelectionContext.endnote.author
if stringIsBlank (sResult)
	sResult = cWDSelectionContext.endnote.reference
endIf
return sResult
EndFunction

int function SaySelectedTextCountWithStartAndEndSegments(string sText, int iTextLength)
var
	string sStartSegment,
	string sEndSegment,
	int iChop
sStartSegment = StringLeft(sText,MaxLengthSelectedTextStartEndSegment )
iChop = StringLength(StringSegment(sStartSegment,sc_selectionWordDelimiters,-1))
if iChop < MaxLengthSelectedTextStartEndSegment
	sStartSegment = StringChopRight(sStartSegment,iChop)
EndIf
sEndSegment = StringRight(sText,MaxLengthSelectedTextStartEndSegment)
iChop = StringLength(StringSegment(sEndSegment,sc_selectionWordDelimiters,1))
if iChop < MaxLengthSelectedTextStartEndSegment
	sEndSegment = StringChopLeft(sEndSegment,iChop)
EndIf
Say(FormatString(msgLargeRangeOfSelectedDocumentText,
	iTextLength, sStartSegment, sEndSegment),
	ot_line,true)
EndFunction

int function ShouldProcessSelectionChangedEvent( optional int source, optional string text)
If IsReadOnlyVirtualMessage()
	Return FALSE ;we do not need it here...
elif !(source != INP_BrailleDisplay
	&& (GetLastTrackedEvent() != event_CellChanged
	|| StringRight (GetCurrentScriptKeyName(), 3) != cksTab)
	&& ScriptWillSpeakExtendedSelection() != true
	&& DocumentUpdateNotificationMode() == on
	&& !c_WordFuncTester.SuppressSelectionChangeDetection)
	return False
elif isFormField()
	return  ShouldSpeakSelectedTextInFormfield(text, GetObjectTypeCode())
else
	return WindowCategoryIsWordDocument()
EndIf
EndFunction

void Function saySelectedUnit()
var
	object selection,
	int iSelectionStart,
	int iSelectionEnd
var object oWord = GetOWord()
selection = oWord.selection
iSelectionStart = selection.range.start
iSelectionEnd = selection.range.end
; Note these tests are in a specific order!
; We test for the whole doc first just in case the whole doc is only a few words,
; less than a paragraph etc.
; We then test for just one word as there are always at least one paragraphs selected
; We then must distinguish between a paragraph being selected or just one sentence
; a single sentence paragraph is considered a paragraph.
if iSelectionStart == iSelectionEnd
	SayUsingVoice(vctx_message,cmsgNothingSelected,ot_help)
elif iSelectionStart == oWord.activeDocument.range.start
&& iSelectionEnd == oWord.activeDocument.range.end
	SayUsingVoice(vctx_message,cmsg215_L,ot_help)
	SayUsingVoice(vctx_message,msgSelectEntireDocument1,ot_help)
elif selection.words.count == 1
	SayUsingVoice(vctx_message,cmsg215_L, ot_help)
	SayUsingVoice(vctx_message,msgSelectWord1,ot_help)
elif selection.sentences.count == selection.paragraphs(1).range.sentences.count
&& selection.paragraphs.count == 1
	SayUsingVoice(vctx_message,cmsg215_L,ot_help)
	SayUsingVoice(vctx_message,msgSelectParagraph1,ot_help)
elif selection.sentences.count == 1
	SayUsingVoice(vctx_message,cmsg215_L,ot_help)
	SayUsingVoice(vctx_message,msgSelectSentence1,ot_help)
endIf
EndFunction

void function SaySelectedDocumentText(string sText, int bWasTextSelected)
var
	string sSelectionStateMsg,
	int iTextLength,
	int bUseOTChar,
	int OT
iTextLength = StringLength(sText)
if iTextLength > MaxLengthSelectedTextToBeSpoken
	SaySelectedTextCountWithStartAndEndSegments(sText,iTextLength)
	return
EndIf
if GetRunningFSProducts() & product_JAWS
	if bWasTextSelected
		sSelectionStateMsg = cmsg215_l
	else
		sSelectionStateMsg = cmsg214_l
	endIf
EndIf
;OT should be Word unless selecting by char so that each unit selected has case indicated properly.
;Make sure that we check not only for single char selected,
;but that single char preceeded or followed by newline or other whitespace is check for as well:
bUseOTChar =
	(iTextLength==1
	|| StringLength(StringTrimLeadingBlanks(StringTrimTrailingBlanks(sText))) == 1)
if bUseOTChar
	OT = OT_CHAR
else
	OT = OT_WORD
endIf
If nSaySelectAfter
	if sText == cscSpace
	|| smmStripMarkup(sText) == cscSpace
		say(sText,ot_char,true)
	else
		Say(sText,OT,!bUseOTChar)
	endIf
	SayMessage(OT_SELECT, sSelectionStateMsg)
Else
	SayMessage(OT_SELECT, sSelectionStateMsg)
	if sText == cscSpace
	|| smmStripMarkup(sText) == cscSpace
		say(sText,ot_char,true)
	else
		Say(sText,OT,!bUseOTChar)
	endIf
EndIf
EndFunction

void function SelectionChangedEvent( string text, int bWasTextSelected, optional int source )
if cwdDeferredCellChange.delaying
	; Run the cellChangedEvent right after this event.
	; This makes form field info speak before table position info.
	scheduleFunction("deferredCellChangedEvent", 0)
endIf
if !ShouldProcessSelectionChangedEvent(source, text)then
	nSaySelectAfter = false
	return
EndIf
if c_WordFuncTester.TabbingInReadOnlyMessage
	c_WordFuncTester.TabbingInReadOnlyMessage = false
	;note that the application places the cursor just past the link,
	;so use SayLine rather than SayObjectTypeAndText or SayField:
	SayLine(TRUE)
	return
endIf
if IsActiveDocumentProtectedForm()
&& !InTable()
&& !(GetSelectionContext() & selCtxFormFields)
	;this may be a form where the fields have instructional text between them,
	;and tab or shift tab takes the user out of the form fields:
	if !BrailleIsInputSource()
		SayLine(TRUE)
	endIf
	return
EndIf
if BrailleIsInputSource() && ! IsSelectingOrDeselectingTextWithBrailleKeyboard()
	; don't speak from Braille display unless selecting text:
	nSaySelectAfter = false
	return
endIf
SaySelectedDocumentText(text, bWasTextSelected)
nSaySelectAfter = false
EndFunction

Int Function ProcessSelectText (Int nAttributes, String buffer)
If IsReadOnlyMessage()
	Return (TRUE)
EndIf
Return ProcessSelectText (nAttributes, buffer)
EndFunction

int Function isFieldTypeKnown(string sType)
return StringContains(sType,scFieldFillin)
	|| stringContains(sType,SCFieldOCX)
	|| stringContains(sType,scFieldToc)
	|| stringContains(sType,scFieldPageRef)
	|| stringContains(sType,scFieldRef)
	|| stringContains(sType,scHyperlink)
	|| stringContains(sType,scFieldDate)
	|| stringContains(sType,scFieldTime)
	|| stringContains(sType,scFieldSymbol)
	|| stringContains(sType,scFieldFormula)
	|| stringContains(sType,scFieldIndex)
	|| stringContains(sType,scFieldExpression)
EndFunction

string FUNCTION getOleObjectTypeAndState(object oShape)
var
	object oleObj,
	string enabled,
	string descr,
	string classType,
	string content,
	string state,
	string controlInfo
oleObj = oShape.oleFormat.object
if oleObj.caption
	descr = oleObj.caption
elif oleObj.controlTipText
	descr = oleObj.controlTipText
else
	descr = oleObj.name
endIf
classtype = oShape.oleFormat.classType
if stringLeft(classType,5) == scMSForms
	classType = StringSegment (classType, sc_3, 2) ; of the form class.type.index, eg forms.textbox.1
	if classType == scChkBox
		if oleObj.value
			state = cmsg_Checked
		else
			state = msgNotChecked1
		endIf
	elif classType == scOptionButton
		if oleObj.value
			state = msgSelected1
		else
			state = msgNotSelected1
		endIf
	elif classType == scLstBox
		if oleObj.multiSelect
			classType = formatString(msgMultiSelect1,classType)
		endIf
		if oleObj.listCount > 0
			if oleObj.listIndex >=  0
				; listIndex starts at 0, we'll adjust it.
				state = state+formatString(msgXOfY1, intToString(oleObj.listIndex+1), intToString(oleObj.listCount))
				content = oleObj.value
			else
				content = msgNoSelection1
			endIf
		else
			state = state+msgZeroItems1
		endIf
	else
		content = oleObj.value
	endIf
	if !oleObj.enabled
		state = state+cscSpace+msgDisabled1
	endIf
endIf
controlInfo = cscNull
if shouldItemSpeak(ot_control_name)
	controlInfo = descr
endIf
if controlInfo
	controlInfo = ControlInfo+cscSpace+content
else
	controlInfo = content
endIf
if shouldItemSpeak(ot_control_type)
	controlInfo = controlInfo+cscSpace+classType
endIf
if classType == scLstBox
	if shouldItemSpeak(ot_item_number)
		controlInfo = controlInfo+cscSpace+state
	endIf
elif shouldItemSpeak(ot_item_state)
	controlInfo = controlInfo+cscSpace+state
endIf
return controlInfo
EndFunction

string function GetInlineShapeAlternativeText()
var string altText = cWDSelectionContext.shape.alternativeText
if StringIsBlank (altText)
	altText = GetOWord().selection.characters.first.inlineShapes(1).alternativeText
endIf
return altText
EndFunction

int function GetInlineShapeHeight()
var	int Ctx = GetSelectionContext()
if ctx & selCtxFields
	return cWDSelectionContext.field.height
elif ctx & SelCtxShapes
	return cWDSelectionContext.shape.height
else
	return GetOWord().selection.characters.first.inlineShapes(1).height
EndIf
EndFunction

int function GetInlineShapeWidth()
var	int Ctx = GetSelectionContext()
if ctx & selCtxFields
	return cWDSelectionContext.field.width
elif ctx & SelCtxShapes
	return cWDSelectionContext.shape.width
else
	return GetOWord().selection.characters.first.inlineShapes(1).width
EndIf
EndFunction

string function GetInlineShapeHeightInUnitsOfMeasure()
return pointsToDefaultUnits(GetInlineShapeHeight())
EndFunction

string function GetInlineShapeWidthInUnitsOfMeasure()
return pointsToDefaultUnits(GetInlineShapeWidth())
EndFunction

string Function GetInlineShapeTypeString(object InlineShape)
var	int type = InlineShape.type
if type == wdISEmbeddedOLEObject
	return msg31_L
elif type == wdISHorizontalLine
	return msg32_L
elif type == wdISLinkedOLEObject
	return msg33_L
;All pictures in outlook messages are reported as linkedpictures even if they do not have hyperlinks.
;elif type == wdISLinkedPicture
;	return msg34_L
elif type == wdISLinkedPictureHorizontalLine
	return msg35_L
elif type == wdISOLEControlObject
	return getOleObjectTypeAndState(inlineShape) ; msg1306_L
elif type == wdISOWSAnchor
	return msg36_L
;Pictures and Linkedpictures will now just report as pictures.
elif type == wdISPicture || wdISLinkedPicture
	return msg37_L
elif type == wdISPictureBullet
	return msg38_L
elif type == wdISPictureHorizontalLine
	return msg39_L
elif type == wdISScriptAnchor
	return msg40_L
endIf
return cscNull
EndFunction

string Function GetBrlInlineShapeTypeString()
var object o = GetOWord().selection.characters.first.inlineShapes(1)
if !o
	return cscNull
EndIf
var int type = o.type
if type == wdISEmbeddedOLEObject
	return msg31_L
elif type == wdISHorizontalLine
	return msg32_L
elif type == wdISLinkedOLEObject
	return msg33_L
;All pictures in outlook messages are reported as linkedpictures even if they do not have hyperlinks.
;elif type == wdISLinkedPicture
;	return msg34_L
elif type == wdISLinkedPictureHorizontalLine
	return msg35_L
elif type == wdISOWSAnchor
	return msg36_L
;Pictures and Linkedpictures will now just report as pictures.
elif type == wdISPicture || wdISLinkedPicture
	return msg37_L
elif type == wdISPictureBullet
	return msg38_L
elif type == wdISPictureHorizontalLine
	return msg39_L
elif type == wdISScriptAnchor
	return msg40_L
endIf
return cscNull
EndFunction

int function GetActiveInlineShapeOleType()
var	int Ctx = GetSelectionContext()
if ctx & selCtxFields
	return cWDSelectionContext.field.oleType
elif ctx & SelCtxShapes
	return cWDSelectionContext.shape.oleType
else
	return 0
EndIf
EndFunction

void Function convertShapesToInline()
var
	object oDoc,
	object oShapes,
	int count
var object oWord = GetOWord()
oDoc = oWord.activeDocument
oShapes = oDoc.shapes
count = oShapes.count
if count == 0
	SayFormattedMessage (ot_error, msgNoObjectsInDrawingLayer1_L)
	return
endIf
var
	int i,
	string tmpStr,
	int inLineShapeCount,
	int shapesConverted
SayFormattedMessage(ot_help,formatString(msgMovingDrawingLayerObjects1_L, intToString(oShapes.count)), formatString(msgMovingDrawingLayerObjects1_S, intToString(oShapes.count)))
inlineShapeCount = oDoc.inlineShapes.count
i = 1
while i <=  count
	oShapes(i).convertToInlineShape()
	i = i+1
endWhile
shapesConverted = oDoc.inlineShapes.count - inlineShapeCount
if shapesConverted > 0
	SayFormattedMessage(ot_help,formatString(msgObjectsMoved1_L, intToString(shapesConverted)), formatString(msgObjectsMoved1_S, intToString(shapesConverted)))
endIf
if oShapes.count > 0
	SayFormattedMessage (ot_help,
		formatString(msgObjectsNotMoved1_L, intToString(oShapes.count)),
		formatString(msgObjectsNotMoved1_L, intToString(oShapes.count)))
endIf
EndFunction

void Function SaySelectedShape(string sVoice, int iOutputType, object oShape)
Var
	string 	sText,
	string sWidth,
	string sHeight,
	string smsg
sText = oShape.alternativeText
if !sText
	sText = msgPicture
EndIf
sWidth = PointsToDefaultUnits(oShape.width)
sHeight = pointsToDefaultUnits(oShape.height)
smsg = formatString(msgSelectedPictureDesc,sText,sWidth,sHeight)
SayUsingVoice(sVoice,smsg,iOutputType)
SayUsingVoice(sVoice,msgShapeTypeSelected,iOutputType)
EndFunction

int function GetObjectCount()
var
	int iInlineShapeCount,
	int iEmbeddedObjectCount
;only test for inline shapes if in Word:
if !OutlookIsActive()
	iInlineShapeCount = GetProofreadingElementCount(peInlineShape)
endIf
iEmbeddedObjectCount = GetproofreadingElementCount(peObject)
return iInlineShapeCount+iEmbeddedObjectCount
endFunction

void Function DetectObjectsInDocumentCountChange()
; *****
; Calling this from very large documents can cause them to crash.
;When there's a problem it's during the object calls in getObjectCount()
;This function is no longer called from ProcessMainDocumentWindow in Word.jss.
var
	int iObjectCount,
	string smsg_l,
	string smsg_s
;check for Outlook 2007 message:
if OutlookIsActive()
|| !ObjectCountDetection()
	return
endIf
iObjectCount = GetObjectCount()
if iObjectCount !=  cWDActiveDocument.ObjectCount
	cWDActiveDocument.objectCount = iObjectCount
	if iObjectCount > 0
		smsg_l = formatString(msgObjectCount_l,intToString(iObjectCount))
		smsg_s = formatString(msgObjectCount_s,intToString(iObjectCount))
		SayFormattedMessageWithVoice(vctx_message,ot_message,smsg_l,smsg_s)
		BrailleMessage (sMsg_L, TRUE) ; append in case header footer message was showing.
	endIf
EndIf
EndFunction

void function SayInlineShape()
var
	object oInlineShape,
	string typeString,
	string altText,
	string width,
	string height
var object oWord = GetOWord()
oInlineShape = oWord.selection.characters.first.inlineShapes(1)
typeString = getInlineShapeTypeString(oInlineShape)
altText = oInlineShape.alternativeText
width = pointsToDefaultUnits(oInlineShape.width)
height = pointsToDefaultUnits(oInlineShape.height)
SayMessage(ot_help,
	formatString(msgPictureDesc1, typeString, altText))
EndFunction

void Function SayInlineShapeHelp()
var object oWord = GetOWord()
var	object oInlineShape = oWord.selection.characters.first.inlineShapes(1)
SayFormattedMessage (ot_help,
	getInlineShapeTypeString(oInlineShape))
EndFunction

string Function GetGraphicTypeString(int type)
if type == wdISEmbeddedOLEObject
	return msg31_L
elif type == wdISHorizontalLine
	return msg32_L
elif type == wdISLinkedOLEObject
	return msg33_L
elif type == wdISLinkedPicture
	return msg34_L
elif type == wdISLinkedPictureHorizontalLine
	return msg35_L
elif type == wdISOLEControlObject
	return GetObjectName()+cscSpace+GetObjectState() ;getOleObjectTypeAndState(inlineShape) ; msg1306_L
elif type == wdISOWSAnchor
	return msg36_L
elif type == wdISPicture
	return msg37_L
elif type == wdISPictureBullet
	return msg38_L
elif type == wdISPictureHorizontalLine
	return msg39_L
elif type == wdISScriptAnchor
	return msg40_L
endIf
EndFunction

int function ProofreadingElementToContextFlag(int iPeType)
if iPEType == peComment
	return selCtxComments
elIf iPEType == peFootnote
	return selCtxFootnotes
ElIf iPEType == peEndnote
	return selCtxEndnotes
elIf iPEType == peRevision
	return selCtxRevisions
elIf iPEType == peBookmark
	return selCtxBookmarks
elIf iPEType == peInlineShape
	return selCtxShapes
elif iPEType == peObject
	return selCtxEmbeddedObjects
elIf iPEType == peSpellingError
	return selCtxSpellingErrors
elIf iPEType == peGrammaticalError
	return selCtxGrammaticalErrors
elIf iPEType == peField
	if IsActiveDocumentProtectedForm()
		return selCtxFormFields
	else
		return selCtxFields
	endIf
endIf
EndFunction

string function GetSelectionContextRevisionText()
return cWDSelectionContext.revision.text
EndFunction

string Function getRevisionTypeString(int Type)
if type == wdNoRevision
	return cscNull
elif type == wdRevisionConflict
	return msgRevisionConflict
elif type == wdRevisionDelete
	return msgRevisionDeletedText
elif type == wdRevisionDisplayField
	return msgRevisionDisplayField
elif type == wdRevisionInsert
	return msgRevisionInsertedText
elif type == wdRevisionParagraphNumber
	return msgRevisionParagraphNumber
elif type == wdRevisionProperty
	return msgRevisionProperty
elif type == wdRevisionReconcile
	return msgRevisionReconcile
elif type == wdRevisionReplace
	return msgRevisionReplace
elif type == wdRevisionStyle
	return msgRevisionStyle
elif type == wdRevisionParagraphProperty
	return msgRevisionParagraphProperty
elif type == wdRevisionSectionProperty
	return msgRevisionSectionProperty
elif type == wdRevisionStyleDefinition
	return msgRevisionStyleDefinition
elif type == wdRevisionTableProperty
	return msgRevisionTableProperty
else ;Safety return
	return cscNull
endIf
EndFunction

string Function getColorDescription(int color, optional int ColorIndex)
if color == wdColorAqua
	return msg266_L
elif color == wdColorBlack
	return msg267_L
elif color == wdColorBlue
	return msg268_L
elif color == wdColorBlueGray
	return msg269_L
elif color == wdColorBrightGreen
	return msg270_L
elif color == wdColorBrown
	return msg271_L
elif color == wdColorDarkBlue
	return msg272_L
elif color == wdColorDarkGreen
	return msg273_L
elif color == wdColorDarkRed
	return msg274_L
elif color == wdColorDarkTeal
	return msg275_L
elif color == wdColorDarkYellow
	return msg276_L
elif color == wdColorGold
	return msg277_L
elif color == wdColorGray05
	return msg278_L
elif color == wdColorGray10
	return msg279_L
elif color == wdColorGray125
	return msg280_L
elif color == wdColorGray15
	return msg281_L
elif color == wdColorGray20
	return msg282_L
elif color == wdColorGray25
	return msg283_L
elif color == wdColorGray30
	return msg284_L
elif color == wdColorGray35
	return msg285_L
elif color == wdColorGray375
	return msg286_L
elif color == wdColorGray40
	return msg287_L
elif color == wdColorGray45
	return msg288_L
elif color == wdColorGray50
	return msg289_L
elif color == wdColorGray55
	return msg290_L
elif color == wdColorGray60
	return msg291_L
elif color == wdColorGray625
	return msg292_L
elif color == wdColorGray65
	return msg293_L
elif color == wdColorGray70
	return msg294_L
elif color == wdColorGray75
	return msg295_L
elif color == wdColorGray80
	return msg296_L
elif color == wdColorGray85
	return msg297_L
elif color == wdColorGray875
	return msg298_L
elif color == wdColorGray90
	return msg299_L
elif color == wdColorGray95
	return msg300_L
elif color == wdColorGreen
	return msg301_L
elif color == wdColorIndigo
	return msg302_L
elif color == wdColorLavender
	return msg303_L
elif color == wdColorLightBlue
	return msg304_L
elif color == wdColorLightGreen
	return msg305_L
elif color == wdColorLightOrange
	return msg306_L
elif color == wdColorLightTurquoise
	return msg307_L
elif color == wdColorLightYellow
	return msg308_L
elif color == wdColorLime
	return msg309_L
elif color == wdColorOliveGreen
	return msg310_L
elif color == wdColorOrange
	return msg311_L
elif color == wdColorPaleBlue
	return msg312_L
elif color == wdColorPink
	return msg313_L
elif color == wdColorPlum
	return msg314_L
elif color == wdColorRed
	return msg315_L
elif color == wdColorRose
	return msg316_L
elif color == wdColorSeaGreen
	return msg317_L
elif color == wdColorSkyBlue
	return msg318_L
elif color == wdColorTan
	return msg319_L
elif color == wdColorTeal
	return msg320_L
elif color == wdColorTurquoise
	return msg321_L
elif color == wdColorViolet
	return msg322_L
elif color == wdColorWhite
	return msg323_L
elif color == wdColorYellow
	return msg324_L
endIf
;now, try using ColorIndex:
if ColorIndex == wdColorIndexBlack
	return msg267_L
elif ColorIndex == wdColorIndexBlue
	return msg268_L
elif ColorIndex == wdColorIndexBrightGreen
	return msg270_L
elif ColorIndex == wdColorIndexDarkBlue
	return msg272_L
elif ColorIndex == wdColorIndexDarkRed
	return msg274_L
elif ColorIndex == wdColorIndexDarkYellow
	return msg276_L
elif ColorIndex == wdColorIndexGray25
	return msg283_L
elif ColorIndex == wdColorIndexGray50
	return msg289_L
elif ColorIndex == wdColorIndexGreen
	return msg301_L
elif ColorIndex == wdColorIndexPink
	return msg313_L
elif ColorIndex == wdColorIndexRed
	return msg315_L
elif ColorIndex == wdColorIndexTeal
	return msg320_L
elif ColorIndex == wdColorIndexTurQuoise
	return msg321_L
elif ColorIndex == wdColorIndexViolet
	return msg322_L
elif ColorIndex == wdColorIndexWhite
	return msg323_L
elif ColorIndex == wdColorIndexYellow
	return msg324_L
endIf
; note we ignore automatic color
;as it doesn't sound good saying surrounding automatic dotted line.
EndFunction

string Function GetPatternDescription(int iPattern)
if iPattern == wdTexture10Percent
	return Texture10Percent
Elif iPattern == wdTexture12Pt5Percent
	return Texture12Pt5Percent
Elif iPattern == wdTexture15Percent
	return Texture15Percent
Elif iPattern == wdTexture17Pt5Percent
	return Texture17Pt5Percent
Elif iPattern == wdTexture20Percent
	return Texture20Percent
Elif iPattern == wdTexture22Pt5Percent
	return Texture22Pt5Percent
Elif iPattern == wdTexture25Percent
	return Texture25Percent
Elif iPattern == wdTexture27Pt5Percent
	return Texture27Pt5Percent
Elif iPattern == wdTexture2Pt5Percent
	return Texture2Pt5Percent
Elif iPattern == wdTexture30Percent
	return Texture30Percent
Elif iPattern == wdTexture32Pt5Percent
	return Texture32Pt5Percent
Elif iPattern == wdTexture35Percent
	return Texture32Pt5Percent
Elif iPattern == wdTexture37Pt5Percent
	return Texture37Pt5Percent
Elif iPattern == wdTexture40Percent
	return Texture40Percent
Elif iPattern == wdTexture42Pt5Percent
	return Texture42Pt5Percent
Elif iPattern == wdTexture45Percent
	return Texture45Percent
Elif iPattern == wdTexture47Pt5Percent
	return Texture47Pt5Percent
Elif iPattern == wdTexture50Percent
	return Texture50Percent
Elif iPattern == wdTexture52Pt5Percent
	return Texture52Pt5Percent
Elif iPattern == wdTexture55Percent
	return Texture55Percent
elif iPattern == wdTexture57Pt5Percent
	return Texture57Pt5Percent
elif iPattern == wdTexture5Percent
	return Texture5Percent
Elif iPattern == wdTexture60Percent
	return Texture60Percent
Elif iPattern == wdTexture62Pt5Percent
	return Texture62Pt5Percent
Elif iPattern == wdTexture65Percent
	return Texture65Percent
Elif iPattern == wdTexture67Pt5Percent
	return Texture67Pt5Percent
Elif iPattern == wdTexture70Percent
	return Texture70Percent
Elif iPattern == wdTexture72Pt5Percent
	return Texture72Pt5Percent
Elif iPattern == wdTexture75Percent
	return Texture75Percent
Elif iPattern == wdTexture77Pt5Percent
	return Texture77Pt5Percent
Elif iPattern == wdTexture7Pt5Percent
	return Texture7Pt5Percent
Elif iPattern == wdTexture80Percent
	return Texture80Percent
Elif iPattern == wdTexture82Pt5Percent
	return Texture82Pt5Percent
Elif iPattern == wdTexture85Percent
	return Texture85Percent
Elif iPattern == wdTexture87Pt5Percent
	return Texture87Pt5Percent
Elif iPattern == wdTexture90Percent
	return Texture90Percent
Elif iPattern == wdTexture92Pt5Percent
	return  Texture92Pt5Percent
Elif iPattern == wdTexture95Percent
	return Texture95Percent
Elif iPattern == wdTexture97Pt5Percent
	return Texture97Pt5Percent
Elif iPattern == wdTextureCross
	return TextureCross
Elif iPattern == wdTextureDarkCross
	return TextureDarkCross
Elif iPattern == wdTextureDarkDiagonalCross
	return TextureDarkDiagonalCross
Elif iPattern == wdTextureDarkDiagonalDown
	return TextureDarkDiagonalDown
Elif iPattern == wdTextureDarkDiagonalUp
	return TextureDarkDiagonalUp
Elif iPattern == wdTextureDarkHorizontal
	return TextureDarkHorizontal
Elif iPattern == wdTextureDarkVertical
	return TextureDarkVertical
ElIf iPattern == wdTextureDiagonalCross
	return TextureDiagonalCross
Elif iPattern == wdTextureDiagonalDown
	return TextureDiagonalDown
Elif iPattern == wdTextureDiagonalUp
	return TextureDiagonalUp
Elif iPattern == wdTextureHorizontal
	return TextureHorizontal
Elif iPattern == wdTextureVertical
	return TextureVertical
Elif iPattern == wdTextureNone
	return textureNone
Elif iPattern == wdTextureSolid
	return TextureSolid
EndIf
EndFunction

object Function GetBorderedRange()
var
	object oRange,
	object oSelection,
	object oDoc,
	object oPara,
	object oSection,
	int start,
	int end,
	int length,
	int tmp
var object oWord = GetOWord()
if isPcCursor()
	oSelection = oWord.selection
else
	oSelection = GetRangeAtCursor()
endIf
if !oSelection
	return null
endIf
oDoc = oWord.activeDocument
length = oSelection.storyLength
start = oSelection.start
end = start+1
oRange = oDoc.range(start,end)
oPara = oSelection.paragraphs(1)
oSection = oSelection.sections(1)
if !oRange.borders.enable == VBTrue
	if oPara.borders.enable == VBTrue
		return oPara.range
	elif oSection.borders.enable == VBTrue
		return oSection
	else
		; not in a bordered region
		return null
	endIf
endIf
; we need to find the start and end
; look for end
tmp = end
while tmp <=  length
	if !oDoc.range(tmp,tmp+1).borders.enable == VBTrue
		end = tmp
		tmp = length
	endIf
	tmp = tmp+1
endWhile
; now locate beginning
tmp = start
while tmp >=  0
	if !oDoc.range(tmp,tmp+1).borders.enable == VBTrue
		start = tmp+1
		tmp = 0
	endIf
	tmp = tmp-1
endWhile
oRange = oDoc.range(start,end)
return oRange
EndFunction

string Function getBorderLineStyle(object oBorder)
var
	string descr,
	int lineStyle
lineStyle = oBorder.lineStyle
if lineStyle == wdLineStyleDashDot 
	descr = msg67_L
elif LineStyle == wdLineStyleDashDotDot 
	descr = msg68_L
elif LineStyle == wdLineStyleDashDotStroked 
	descr = msg69_L
elif LineStyle == wdLineStyleDashLargeGap 
	descr = msg70_L
elif LineStyle == wdLineStyleDashSmallGap 
	descr = msg71_L
elif LineStyle == wdLineStyleDot 
	descr = msg72_L
elif LineStyle == wdLineStyleDouble 
	descr = msg73_L
elif LineStyle == wdLineStyleDoubleWavy 
	descr = msg74_L
elif LineStyle == wdLineStyleEmboss3D 
	descr = msg75_L
elif LineStyle == wdLineStyleEngrave3D 
	descr = msg76_L
elif LineStyle == wdLineStyleInset 
	descr = msg77_L
elif LineStyle == wdLineStyleNone 
	descr = msg78_L
elif LineStyle == wdLineStyleOutset 
	descr = msg79_L
elif LineStyle == wdLineStyleSingle 
	descr = msg80_L
elif LineStyle == wdLineStyleSingleWavy 
	descr = msg81_L
elif LineStyle == wdLineStyleThickThinLargeGap 
	descr = msg82_L
elif LineStyle == wdLineStyleThickThinMedGap 
	descr = msg83_L
elif LineStyle == wdLineStyleThickThinSmallGap 
	descr = msg84_L
elif LineStyle == wdLineStyleThinThickLargeGap 
	descr = msg85_L
elif LineStyle == wdLineStyleThinThickMedGap 
	descr = msg86_L
elif LineStyle == wdLineStyleThinThickSmallGap 
	descr = msg87_L
elif LineStyle == wdLineStyleThinThickThinLargeGap 
	descr = msg88_L
elif LineStyle == wdLineStyleThinThickThinMedGap 
	descr = msg89_L
elif LineStyle == wdLineStyleThinThickThinSmallGap 
	descr = msg90_L
elif LineStyle == wdLineStyleTriple 
	descr = msg91_L
else
	descr = msg92_L
endIf
return FormatString(msgBorderLine1,descr)
EndFunction

string Function getBorderLineWidth(object oBorder)
var	int lineWidth = oBorder.lineWidth
if LineWidth == wdLineWidth025pt 
	return msg257_L
elif LineWidth == wdLineWidth050pt 
	return msg258_L
elif LineWidth == wdLineWidth075pt 
	return msg259_L
elif LineWidth == wdLineWidth100pt 
	return msg260_L
elif LineWidth == wdLineWidth150pt 
	return msg261_L
elif LineWidth == wdLineWidth225pt 
	return msg262_L
elif LineWidth == wdLineWidth300pt 
	return msg263_L
elif LineWidth == wdLineWidth450pt 
	return msg264_L
elif LineWidth == wdLineWidth600pt 
	return msg265_L
Elif LineWidth == -1 then ; custom width, unable to determine
	return msgCustomWidth
endIf
EndFunction

string Function getBorderArtStyle(object oBorder)
var	int type = oBorder.artStyle
if type == 0
	return cscNull
elif type == wdArtApples 
	return msg93_L
elif type == wdArtArchedScallops 
	return msg94_L
elif type == wdArtBabyPacifier 
	return msg95_L
elif type == wdArtBabyRattle 
	return msg96_L
elif type == wdArtBalloons3Colors 
	return msg97_L
elif type == wdArtBalloonsHotAir 
	return msg98_L
elif type == wdArtBasicBlackDashes 
	return msg99_L
elif type == wdArtBasicBlackDots 
	return msg100_L
elif type == wdArtBasicBlackSquares 
	return msg101_L
elif type == wdArtBasicThinLines 
	return msg102_L
elif type == wdArtBasicWhiteDashes 
	return msg103_L
elif type == wdArtBasicWhiteDots 
	return msg104_L
elif type == wdArtBasicWhiteSquares 
	return msg105_L
elif type == wdArtBasicWideInline 
	return msg106_L
elif type == wdArtBasicWideMidline 
	return msg107_L
elif type == wdArtBasicWideOutline 
	return msg108_L
elif type == wdArtBats 
	return msg109_L
elif type == wdArtBirds 
	return msg110_L
elif type == wdArtBirdsFlight 
	return msg111_L
elif type == wdArtCabins 
	return msg112_L
elif type == wdArtCakeSlice 
	return msg113_L
elif type == wdArtCandyCorn 
	return msg114_L
elif type == wdArtCelticKnotwork 
	return msg115_L
elif type == wdArtCertificateBanner 
	return msg116_L
elif type == wdArtChainLink 
	return msg117_L
elif type == wdArtChampagneBottle 
	return msg118_L
elif type == wdArtCheckedBarBlack 
	return msg119_L
elif type == wdArtCheckedBarColor 
	return msg120_L
elif type == wdArtCheckered 
	return msg121_L
elif type == wdArtChristmasTree 
	return msg122_L
elif type == wdArtCirclesLines 
	return msg123_L
elif type == wdArtCirclesRectangles 
	return msg124_L
elif type == wdArtClassicalWave 
	return msg125_L
elif type == wdArtClocks 
	return msg126_L
elif type == wdArtCompass 
	return msg127_L
elif type == wdArtConfetti 
	return msg128_L
elif type == wdArtConfettiGrays 
	return msg129_L
elif type == wdArtConfettiOutline 
	return msg130_L
elif type == wdArtConfettiStreamers 
	return msg131_L
elif type == wdArtConfettiWhite 
	return msg132_L
elif type == wdArtCornerTriangles 
	return msg133_L
elif type == wdArtCouponCutoutDashes 
	return msg134_L
elif type == wdArtCouponCutoutDots 
	return msg135_L
elif type == wdArtCrazyMaze 
	return msg136_L
elif type == wdArtCreaturesButterfly 
	return msg137_L
elif type == wdArtCreaturesFish 
	return msg138_L
elif type == wdArtCreaturesInsects 
	return msg139_L
elif type == wdArtCreaturesLadyBug 
	return msg140_L
elif type == wdArtCrossStitch 
	return msg141_L
elif type == wdArtCup 
	return msg142_L
elif type == wdArtDecoArch 
	return msg143_L
elif type == wdArtDecoArchColor 
	return msg144_L
elif type == wdArtDecoBlocks 
	return msg145_L
elif type == wdArtDiamondsGray 
	return msg146_L
elif type == wdArtDoubleD 
	return msg147_L
elif type == wdArtDoubleDiamonds 
	return msg148_L
elif type == wdArtEarth1 
	return msg149_L
elif type == wdArtEarth2 
	return msg150_L
elif type == wdArtEclipsingSquares1 
	return msg151_L
elif type == wdArtEclipsingSquares2 
	return msg152_L
elif type == wdArtEggsBlack 
	return msg153_L
elif type == wdArtFans 
	return msg154_L
elif type == wdArtFilm 
	return msg155_L
elif type == wdArtFirecrackers 
	return msg156_L
elif type == wdArtFlowersBlockPrint 
	return msg157_L
elif type == wdArtFlowersDaisies 
	return msg158_L
elif type == wdArtFlowersModern1 
	return msg159_L
elif type == wdArtFlowersModern2 
	return msg160_L
elif type == wdArtFlowersPansy 
	return msg161_L
elif type == wdArtFlowersRedRose 
	return msg162_L
elif type == wdArtFlowersRoses 
	return msg163_L
elif type == wdArtFlowersTeacup 
	return msg164_L
elif type == wdArtFlowersTiny 
	return msg165_L
elif type == wdArtGems 
	return msg166_L
elif type == wdArtGingerbreadMan 
	return msg167_L
elif type == wdArtGradient 
	return msg168_L
elif type == wdArtHandmade1 
	return msg169_L
elif type == wdArtHandmade2 
	return msg170_L
elif type == wdArtHeartBalloon 
	return msg171_L
elif type == wdArtHeartGray 
	return msg172_L
elif type == wdArtHearts 
	return msg173_L
elif type == wdArtHeebieJeebies 
	return msg174_L
elif type == wdArtHolly 
	return msg175_L
elif type == wdArtHouseFunky 
	return msg176_L
elif type == wdArtHypnotic 
	return msg177_L
elif type == wdArtIceCreamCones 
	return msg178_L
elif type == wdArtLightBulb 
	return msg179_L
elif type == wdArtLightning1 
	return msg180_L
elif type == wdArtLightning2 
	return msg181_L
elif type == wdArtMapleLeaf 
	return msg182_L
elif type == wdArtMapleMuffins 
	return msg183_L
elif type == wdArtMapPins 
	return msg184_L
elif type == wdArtMarquee 
	return msg185_L
elif type == wdArtMarqueeToothed 
	return msg186_L
elif type == wdArtMoons 
	return msg187_L
elif type == wdArtMosaic 
	return msg188_L
elif type == wdArtMusicNotes 
	return msg189_L
elif type == wdArtNorthwest 
	return msg190_L
elif type == wdArtOvals 
	return msg191_L
elif type == wdArtPackages 
	return msg192_L
elif type == wdArtPalmsBlack 
	return msg193_L
elif type == wdArtPalmsColor 
	return msg194_L
elif type == wdArtPaperClips 
	return msg195_L
elif type == wdArtPapyrus 
	return msg196_L
elif type == wdArtPartyFavor 
	return msg197_L
elif type == wdArtPartyGlass 
	return msg198_L
elif type == wdArtPencils 
	return msg199_L
elif type == wdArtPeople 
	return msg200_L
elif type == wdArtPeopleHats 
	return msg201_L
elif type == wdArtPeopleWaving 
	return msg202_L
elif type == wdArtPoinsettias 
	return msg203_L
elif type == wdArtPostageStamp 
	return msg204_L
elif type == wdArtPumpkin1 
	return msg205_L
elif type == wdArtPushPinNote1 
	return msg206_L
elif type == wdArtPushPinNote2 
	return msg207_L
elif type == wdArtPyramids 
	return msg208_L
elif type == wdArtPyramidsAbove 
	return msg209_L
elif type == wdArtQuadrants 
	return msg210_L
elif type == wdArtRings 
	return msg211_L
elif type == wdArtSafari 
	return msg212_L
elif type == wdArtSawtooth 
	return msg213_L
elif type == wdArtSawtoothGray 
	return msg214_L
elif type == wdArtScaredCat 
	return msg215_L
elif type == wdArtSeattle 
	return msg216_L
elif type == wdArtShadowedSquares 
	return msg217_L
elif type == wdArtSharksTeeth 
	return msg218_L
elif type == wdArtShorebirdTracks 
	return msg219_L
elif type == wdArtSkyrocket 
	return msg220_L
elif type == wdArtSnowflakeFancy 
	return msg221_L
elif type == wdArtSnowflakes 
	return msg222_L
elif type == wdArtSombrero 
	return msg223_L
elif type == wdArtSouthwest 
	return msg224_L
elif type == wdArtStars 
	return msg225_L
elif type == wdArtStars3D 
	return msg226_L
elif type == wdArtStarsBlack 
	return msg227_L
elif type == wdArtStarsShadowed 
	return msg228_L
elif type == wdArtStarsTop 
	return msg229_L
elif type == wdArtSun 
	return msg230_L
elif type == wdArtSwirligig 
	return msg231_L
elif type == wdArtTornPaper 
	return msg232_L
elif type == wdArtTornPaperBlack 
	return msg233_L
elif type == wdArtTrees 
	return msg234_L
elif type == wdArtTriangleParty 
	return msg235_L
elif type == wdArtTriangles 
	return msg236_L
elif type == wdArtTribal1 
	return msg237_L
elif type == wdArtTribal2 
	return msg238_L
elif type == wdArtTribal3 
	return msg239_L
elif type == wdArtTribal4 
	return msg240_L
elif type == wdArtTribal5 
	return msg241_L
elif type == wdArtTribal6 
	return msg242_L
elif type == wdArtTwistedLines1 
	return msg243_L
elif type == wdArtTwistedLines2 
	return msg244_L
elif type == wdArtVine 
	return msg245_L
elif type == wdArtWaveline 
	return msg246_L
elif type == wdArtWeavingAngles 
	return msg247_L
elif type == wdArtWeavingBraid 
	return msg248_L
elif type == wdArtWeavingRibbon 
	return msg249_L
elif type == wdArtWeavingStrips 
	return msg250_L
elif type == wdArtWhiteFlowers 
	return msg251_L
elif type == wdArtWoodwork 
	return msg252_L
elif type == wdArtXIllusions 
	return msg253_L
elif type == wdArtZanyTriangles 
	return msg254_L
elif type == wdArtZigZag 
	return msg255_L
elif type == wdArtZigZagStitch 
	return msg256_L
endIf
EndFunction

string Function GetBorderName(int type)
if type == wdBorderBottom 
	return msg59_L
elif type == wdBorderDiagonalDown 
	return msg60_L
elif type == wdBorderDiagonalUp 
	return msg61_L
elif type == wdBorderHorizontal 
	return msg62_L
elif type == wdBorderLeft 
	return msg63_L
elif type == wdBorderRight 
	return msg64_L
elif type == wdBorderTop 
	return msg65_L
elif type == wdBorderVertical 
	return msg66_L
endIf
EndFunction

string Function GetBorderDescription(object obj,string sEnclosedObject)
var	object oBorders = obj.borders
var int count = oBorders.count
if !count
	return cscNull
endIf
var
	object oBorder,
	object oBorderLeft,
	object oBorderRight,
	object oBorderTop,
	object oBorderBottom,
	int index,
	int FoundVisibleBorder,
	int lineStyle,
	int lineWidth,
	string sDescription
oBorderLeft = oBorders(wdBorderLeft)
oBorderTop = oBorders(wdBorderTop)
oBorderRight = oBorders(wdBorderRight)
oBorderBottom = oBorders(wdBorderBottom)
; see if four surrounding borders are the same
lineStyle = oBorderLeft.lineStyle
lineWidth = oBorderLeft.lineWidth
if oBorderLeft.visible == VBTrue
&&	oBorderTop.visible == VBTrue
&& oBorderRight.visible == VBTrue
&& oBorderBottom.visible == VBTrue
&& oBorderLeft.lineStyle == lineStyle
&& oBorderTop.lineStyle == lineStyle
&& oBorderRight.lineStyle == lineStyle
&& oBorderBottom.lineStyle == lineStyle
&& oBorderLeft.lineWidth == lineWidth
&& oBorderTop.lineWidth == lineWidth
&& oBorderRight.lineWidth == lineWidth
&& oBorderBottom.lineWidth == lineWidth
	; check if border has art style
	if oBorderTop.artStyle == VBTrue
		return FormatString(msgBorderDetailedDesc1, sEnclosedObject,
			GetColorDescription(oBorderTop.color),
			GetBorderLineStyle(oBorderTop),
			GetBorderLineWidth(oBorderTop),
			GetBorderArtStyle(oBorderTop))
	else
		return formatString(msgBorderDetailedDesc2, sEnclosedObject,
			GetColorDescription(oBorderTop.color),
			GetBorderLineStyle(oBorderTop),
			GetBorderLineWidth(oBorderTop))
	endIf
EndIf
; the borders are not uniform:
index = wdBorderTop
while index <=  count
	if oBorders(index).visible == VBTrue
		if !FoundVisibleBorder
			FoundVisibleBorder = true
			; first visible border, say text unit.
			sDescription  =
				formatString(msgBorderTextUnit1, sEnclosedObject)+cscBufferNewLine
		endIf
		oBorder = oBorders(index)
		if oBorder.artStyle == VBTrue
			sDescription = sDescription+
				formatString(msgBorderDetailedDesc3,
					GetBorderName(index),
					GetColorDescription(oBorder.color),
					GetBorderLineStyle(oBorder),
					GetBorderLineWidth(oBorder),
					GetBorderArtStyle(oBorder))
				+cscBufferNewLine
		else
			sDescription = sDescription+
				FormatString(msgBorderDetailedDesc4,
					GetBorderName(index),
					GetColorDescription(oBorder.color),
					GetBorderLineStyle(oBorder),
					GetBorderLineWidth(oBorder))
				+cscBufferNewLine
		endIf
	endIf
	index = index+1
endWhile
return sDescription
EndFunction

void function DescribeBorder(object obj, string sVoice, string sEnclosedObject)
var string desc = GetBorderDescription(obj,sEnclosedObject)
if desc
	SayUsingVoice(sVoice,desc,ot_user_requested_information)
endIf
EndFunction

void Function describeBorderOfTextUnit()
if  cWDActiveDocument.protectionType > 0
	SayFormattedMessage(ot_error, msgFunctionUnavailableWhenDocProtected1_L)
	return
endIf
var
	object oSelection,
	object oTable,
	object oRange,
	object oCell,
	object oPara,
	object oSection,
	int bEnclosingBorder,
	int start
if isPcCursor()
	var object oWord = GetOWord()
	oSelection = oWord.selection
else
	oSelection = GetRangeAtCursor()
endIf
; Note: The enable property of the borders collection is not a boolean,
; although false does mean that there are no borders.
if inTable()
	oCell = oSelection.characters.First.cells(1)
	if oCell.borders.enable
		describeBorder(oCell,vctx_pcCursor,msgCellBorder)
		bEnclosingBorder = true
	endIf
	oTable = GetCurrentTable()
	if oTable.borders.enable
		describeBorder(oTable,vctx_pcCursor,msgTableBorder)
		bEnclosingBorder = true
	endIf
else
	start = oSelection.start
	oRange = oWord.activeDocument.range(start,start+1)
	; need to have the second part of the condition in the following test
	; to avoid a text border being erroneously reported when on a paragraph marker.
	if oRange.borders.enable
	&& oRange.start != oSelection.paragraphs(1).range.end-1
 		describeBorder(oRange,vctx_pcCursor,msgTextBorder)
		bEnclosingBorder = true
	endIf
	oPara = oSelection.paragraphs(1)
	if oPara.borders.enable
		describeBorder(oPara,vctx_pcCursor,msgParagraphBorder)
		bEnclosingBorder = true
	endIf
endIf
oSection = oSelection.sections(1)
if oSection.borders.enable
	describeBorder(oSection,vctx_pcCursor,msgSectionBorder)
	bEnclosingBorder = true
endIf
if !bEnclosingBorder
	SayFormattedMessage(ot_error, msgCursorNotWithinBorderedRegion1_L)
endIf
EndFunction

void Function sayTextInBorderedRegion()
var	object oRange = GetBorderedRange()
if oRange
	DescribeBorder(oRange,vctx_pcCursor,msgBorderedText)
	SayFormattedMessage(ot_line, oRange.text)
endIf
EndFunction

string function GetUnderlineStyleString(int iType)
if iType == wdUnderlineDash
	return msg338_L
elif iType == wdUnderlineDashHeavy
	return msg339_L
elif iType == wdUnderlineDashLong
	return msg340_L
elif iType == wdUnderlineDashLongHeavy
	return msg341_L
elif iType == wdUnderlineDotDash
	return msg342_L
elif iType == wdUnderlineDotDashHeavy
	return msg343_L
elif iType == wdUnderlineDotDotDash
	return msg344_L
elif iType == wdUnderlineDotDotDashHeavy
	return msg345_L
elif iType == wdUnderlineDotted
	return msg346_L
elif iType == wdUnderlineDottedHeavy
	return msg347_L
elif iType == wdUnderlineDouble
	return msg348_L
elif iType == wdUnderlineSingle
	return msg349_L
elif iType == wdUnderlineThick
	return msg350_L
elif iType == wdUnderlineWavy
	return msg351_L
elif iType == wdUnderlineWavyDouble
	return msg352_L
elif iType == wdUnderlineWavyHeavy
	return msg353_L
elif iType == wdUnderlineWords
	return msg354_L
else
	return cscNull
endIf
EndFunction

string Function GetLineSpacing()
var
	int lineSpacing,
	int lines,
	int rule,
	string sText
var object oWord = GetOWord()
rule = oWord.selection.paragraphs(1).lineSpacingRule
lineSpacing = oWord.selection.paragraphs(1).lineSpacing
sText = msg330_L+cscSpace
if rule == wdLineSpaceSingle
	sText = sText+msg325_L+cscBufferNewLine ; single
elif rule == wdLineSpace1pt5
	sText = sText+formatString (msg331_L, msg326_L)+cscBufferNewLine ; 1.5
elif rule == wdLineSpaceDouble
	sText = sText+msg327_L+cscBufferNewLine
elif rule == wdLineSpaceAtLeast
	sText = sText+formatString(msg328_L, intToString(lineSpacing))+cscBufferNewLine
elif rule == wdLineSpaceExactly
	sText = sText+formatString(msg329_L, intToString(lineSpacing))+cscBufferNewLine
elif rule == wdLineSpaceMultiple
	lines = lineSpacing/oWord.selection.font.size
	sText = sText+formatString(msg331_L, IntToString(lineS))+cscBufferNewLine
endIf
return sText
EndFunction

void Function sayStyleAtCursor()
var
	object oListFormat,
	string styleName,
	int iLevel
if inList()
	var object oWord = GetOWord()
	oListFormat = oWord.selection.range.listFormat
	styleName = oListFormat.listString
	iLevel = oListFormat.listLevelNumber
	StyleName = formatString(msgListLevelNum,styleName,IntToString(iLevel))
else
	StyleName = GetCurrentHeading()
	iLevel = GetCurrentHeadingLevel()
	if iLevel > 0
		let	styleName = formatString(msgHeadingLevelNum,styleName,IntToString(iLevel))
	EndIf
endIf
SayFormattedMessageWithVoice(vctx_message,ot_help,styleName,styleName)
EndFunction

void function StyleChangedEvent(string sStyle)
var
	string sLong,
	string sShort
if ShouldWaitForDocumentChangeToRunEvent()
	return
EndIf
if DocumentUpdateNotificationMode() == off
	return
endIf
sLong = formatString(msgStyle1_L,sStyle)
sShort = formatString(msgStyle1_S,sStyle)
if inTable()
	if !BrailleIsInputSource()
		if stringContains(sStyle,scHeading)
			SayFormattedMessageWithVoice(vctx_message,ot_help,sLong,sShort)
		endIf
		if quickNavKeyTrapping()
			SayCell()
		endIf
	endIf
	return
endIf
if !BrailleIsInputSource()
	SayFormattedMessageWithVoice(vctx_message,ot_help,sLong,sShort)
else
	BrailleMessageUsingOutputType(ot_help,sLong,sShort)
endIf
EndFunction

string Function GetListTypeAndItemIdentifier()
var
	object listFormat,
	int listType,
	string listString
if !InList()
	return cscNull
EndIf
var object oWord = GetOWord()
ListFormat = oWord.selection.range.listFormat
listType = listFormat.listType
listString = listFormat.listString
if listType == wdListNoNumbering
	return msg332_L
elif listType == wdListListNumOnly
	return msg333_L
elif listType == wdListBullet
	return msg334_L
elif listType == wdListSimpleNumbering
	return formatString(msg335_L, listString)
elif listType == wdListOutlineNumbering
	return formatString(msg336_L, listString)
elif listType == wdListMixedNumbering
	return formatString(msg337_L, listString)
else
	return cscNull
endIf
EndFunction

string Function GetFontSizeString()
Var
	object oSelection,
	object oFont,
	string sBuffer,
	string sText,
	int bOutlookIsActive
var object oWord = GetOWord()
bOutlookIsActive = OutlookIsActive()
; Outlook 2010 message does not work properly here with new method for turning off screen redraw.
if bOutlookIsActive
	oWord.screenUpdating = false
else
	ToggleScreenUpdating(false)
endIf
oSelection = oWord.selection.range
oFont = oSelection.font
sText = oFont.size
if sText !=  icMixedSize
	sBuffer = formatString(msgPoint1_L,sText)
else
	sBuffer = msgMixedSize1_L
EndIf
if bOutlookIsActive
	oWord.screenUpdating = VBTrue
else
	ToggleScreenUpdating(true)
endIf
return sBuffer
EndFunction

void Function SayFont()
var
	object oSelection,
	object oFont,
	int iFont,
	string sText,
	string sColor,
	string sBuffer,
	object oControls,
	object oParagraphFormat,
	int iparagraphFormat,
	int bIsDocumentWindow
bIsDocumentWindow = WindowCategoryIsWordDocument()
if !IsPCCursor()
|| !bIsDocumentWindow
	PerformScript SayFont()
	if bIsDocumentWindow
		SayFormattedMessage(ot_smart_help, msgForAccurate1_L)
	EndIf
	return
EndIf
var object oWord = GetOWord()
if IsSameScript()
	sBuffer = sBuffer+msgInsertionPointFormatting1_L+cScBufferNewLine
	oSelection = oWord.Selection
else
	oSelection = oWord.Selection.Range
EndIf
oFont = oSelection.Font
iFont = oFont.Bold
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgBolded+cScBufferNewLine
EndIf
iFont = oFont.Italic
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgItalicized+cscBufferNewLine
EndIf
iFont = oFont.underline
if iFont !=  wdUndefined
&& iFont !=  wdUnderlineNone
	sText = GetUnderlineStyleString(iFont)
		+cscSpace+getColorDescription(oFont.underlineColor)
		+cscSpace+msg355_L
	sBuffer = sBuffer+sText+cscBufferNewLine
endIf
iFont = oFont.doubleUnderline
if cWDSelectionContext.revision.type == wdRevisionInsert
	iFont = true
EndIf
If iFont
&& iFont !=  wdUndefined
	sText = GetUnderlineStyleString(oFont.underline)
		+cscSpace+getColorDescription(oFont.underlineColor)
		+cscSpace+msg355_L ;"underlined"
	sBuffer = sBuffer+sText+cscBufferNewLine
EndIf
iFont = oFont.DoubleStrikeThrough
if cWDSelectionContext.revision.type == wdRevisionDelete
	iFont = true
EndIf
If iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgDoubleStrikeThrough1_L+cscBufferNewLine
EndIf
iFont = oFont.StrikeThrough
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgStrikeThrough1_L+cscBufferNewLine
EndIf
iFont = oFont.Shadow
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgShadowed1_L+cscBufferNewLine
EndIf
iFont = oFont.Subscript
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgSubscript1_L+cscBufferNewLine
EndIf
iFont = oFont.Superscript
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgSuperscript1_L+cscBufferNewLine
EndIf
iFont = oFont.Outline
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgOutlined1_L+cscBufferNewLine
EndIf
iFont = oFont.Emboss
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgEmbossed1_L+cscBufferNewLine
EndIf
iFont = oFont.Engrave
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgEngraved1_L+cscBufferNewLine
EndIf
iFont = oFont.SmallCaps
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgSmallCaps1_L+cscBufferNewLine
EndIf
iFont = oFont.AllCaps
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+cmsg247_L+cscBufferNewLine
EndIf
iFont = oFont.Hidden
if iFont
&& iFont !=  wdUndefined
	sBuffer = sBuffer+msgHidden1_L+cscBufferNewLine
EndIf
sText = oFont.size
if sText !=  icMixedSize
	sBuffer = sBuffer+formatString(msgPoint1_L,sText)+cscBufferNewLine
else
	sBuffer = sBuffer+msgMixedSize1_L+cscBufferNewLine
EndIf
; say color if different from auto
; no need to use DOM for color.
; It is unreliable in vista.
sText = GetColorName(GetColorText())
if sText
	sColor = GetColorName(GetColorBackground())
	if sColor
		sText = FormatString(cmsgColorInfo,sText,sColor)
	endIf
	sBuffer = sBuffer+sText+cscBufferNewLine
EndIf
sText = oFont.Name
if sText !=  cscNull
	sBuffer = sBuffer+sText+cscBufferNewLine
else
	sBuffer = sBuffer+msgMixedFont1_L+cscBufferNewLine
EndIf
if !IsSameScript()
	if oSelection.End - oSelection.start > 0
		; the selection range is not collapsed, then there is something highlighted
		sBuffer = sBuffer+msgHighlighted1_L+cscBufferNewLine
	EndIf
EndIf
sText = oSelection.Style.NameLocal
if sText
	sBuffer = sBuffer+formatString(msgStyle1_L,sText)+cscBufferNewLine
else
	sBuffer = sBuffer+msgMixedStyle+cscBufferNewLine
EndIf
sBuffer = sBuffer+cscBufferNewLine
sBuffer = sBuffer+GetLineSpacing()
sBuffer = sBuffer+cscBufferNewLine
sBuffer = sBuffer+msgParagraphFormatting+cscSpace
sText = GetListTypeAndItemIdentifier()
if sText
	sBuffer = sBuffer+sText+cscBufferNewLine
EndIf
oParagraphFormat = oSelection.Paragraphs.Format
iParagraphFormat = oParagraphFormat.firstLineIndent
if iParagraphFormat > 0
	sBuffer = sBuffer+formatString(msgFirstLineIndented1_L,pointsToDefaultUnits (iParagraphFormat))+cscBufferNewLine
elif iParagraphFormat < 0
	sBuffer = sBuffer+formatString(msgParaHangingIndent1_L, pointsToDefaultUnits ((iParagraphFormat*(-1))))+cscBufferNewLine
endIf
iParagraphFormat = oParagraphFormat.leftIndent
if iParagraphFormat
	sBuffer = sBuffer+formatString(msgLeftIndent1_L,pointsToDefaultUnits(iParagraphFormat))+cscBufferNewLine
endIf
iParagraphFormat = oParagraphFormat.RightIndent
if iParagraphFormat
	sBuffer = sBuffer+formatString(msgRightIndent1_L, pointsToDefaultUnits(iParagraphFormat))+cScBufferNewLine
endIf
iParagraphFormat = oParagraphFormat.Alignment
if iParagraphFormat == wdAlignParagraphLeft
	sBuffer = sBuffer+msgAlignedLeft+cscBufferNewLine
elif iParagraphFormat == wdAlignParagraphCenter
	sBuffer = sBuffer+msgCentered+cscBufferNewLine
elif iParagraphFormat == wdAlignParagraphRight
	sBuffer = sBuffer+msgAlignedRight+cscBufferNewLine
elif iParagraphFormat == wdAlignParagraphJustify
	sBuffer = sBuffer+msgJustified+cscBufferNewLine
elif iParagraphFormat == wdUndefined
	sBuffer = sBuffer+msgMixedAlignment+cscBufferNewLine
EndIf
sBuffer = sBuffer+cscBufferNewLine
iParagraphFormat = oParagraphFormat.OutlineLevel
if iParagraphFormat == wdOutlineLevelBodyText
	sBuffer = sBuffer+formatString(msgOutlineLevel1_l,msgBodyText)+cscBufferNewLine
elif iParagraphFormat > 0
	sBuffer = sBuffer+formatString(msgOutlineLevel1_L, IntToString (iParagraphFormat))+cscBufferNewLine
EndIf
if IsSameScript()
	UserBufferClear()
	UserBufferAddText(sBuffer)
	UserBufferAddText(cmsgBuffExit)
	if !UserBufferIsActive()
		UserBufferActivate()
	EndIf
	JAWSTopOfFile()
	SayAll(FALSE)
else ; Speak the message
	SayMessage(ot_user_requested_information,sBuffer)
EndIf
EndFunction

int function SayParagraphAlignment(string sVoice, int iOutputType)
var
	object oFormat,
	int Alignment
var object oWord = GetOWord()
oFormat = oWord.selection.paragraphs.format
if !oFormat
	;error, object is not available
	return -1
endIf
alignment = oFormat.alignment
if alignment == wdAlignParagraphLeft
	SayUsingVoice(sVoice,msgAlignedLeft,iOutputType)
elif alignment == wdAlignParagraphCenter
	SayUsingVoice(sVoice,msgCentered,iOutputType)
elif alignment == wdAlignParagraphRight
	SayUsingVoice(sVoice,msgAlignedRight,iOutputType)
elif alignment == wdAlignParagraphJustify
	SayUsingVoice(sVoice,msgJustified,iOutputType)
elif alignment == wdAlignParagraphDistribute
	SayUsingVoice(sVoice,msgDistributed,iOutputType)
elif alignment == wdAlignParagraphJustifyMed
	SayUsingVoice(sVoice,msgJustifiedMedium,iOutputType)
elif alignment == wdAlignParagraphJustifyHigh
	SayUsingVoice(sVoice,msgJustifiedHigh,iOutputType)
elif alignment == wdAlignParagraphJustifyLow
	SayUsingVoice(sVoice,msgJustifiedLow,iOutputType)
endIf
return 0
EndFunction

void Function toggleOverTypeMode()
var object oWord = GetOWord()
var	object oOptions = oWord.options
oOptions.overType = !oOptions.overType
if oOptions.overType
	SayMessage(ot_help,msg13_L, msg13_S)
else
	SayMessage(ot_help,msg14_L, msg14_S)
endIf
EndFunction

int function StepOutOfTable(int bForward)
var
	object oTable,
	int iFrom,
	int iTo
var object oWord = GetOWord()
oTable = oWord.selection.tables(1)
if bForward
	iFrom = oWord.selection.range.start
	iTo = oTable.range.end
	if oWord.selection.move(wdCharacter,iTo-iFrom)
		return true
	EndIf
else ;stepping backward
	iFrom = oWord.selection.range.start
	iTo = oTable.range.start-1
	if oWord.selection.move(wdCharacter,-1*(iFrom-iTo))
		return true
	EndIf
EndIf
return false
EndFunction

int function StepOutOfList(int bForward)
var
	object oRange,
	int iStart,
	int iGoTo
var object oWord = GetOWord()
iStart = oWord.selection.start
oRange = oWord.selection.range
if bForward
	While oRange.listFormat.list
		oRange = oRange.next(wdParagraph,1)
	EndWhile
	iGoTo = oRange.paragraphs(1).range.start
	if oWord.selection.move(wdCharacter,iGoTo-iStart)
		return true
	EndIf
else ;stepping backward
	While oRange.listFormat.list
		oRange = oRange.Previous(wdParagraph,1)
	EndWhile
	iGoTo = oRange.paragraphs(1).range.start
	if oWord.selection.move(wdCharacter,-1*(iStart-iGoTo))
		return true
	EndIf
EndIf
return false
EndFunction

int function MoveToPage(int iNav)
var
	int iStart,
	int iFlagStatus
;check for pagebreak, section, column break position flag.
; if set, no need to say the current line because it is caught by SelectioncontextChangedEvent.
if GetSelectionContextFlags() & selCtxPageSectionColumnBreaks
	iFlagStatus=true
EndIf
var object oWord = GetOWord()
iStart = oWord.selection.start
if iNav == s_top
	oWord.selection.goto(wdGoToPage,wdGoToFirst)
	if !iFlagStatus
		SayLine(TRUE)
	EndIf
ElIf iNav == s_next
	oWord.Selection.GoToNext(wdGoToPage)
	if !iFlagStatus
		SayLine(TRUE)
	endIf
ElIf iNav == s_prior
	oWord.Selection.GoToPrevious(wdGoToPage)
	if !iFlagStatus
		SayLine(TRUE)
	EndIf
ElIf iNav == s_bottom
	oWord.selection.goto(wdGoToPage,wdGoToLast)
	if !iFlagStatus
		SayLine(TRUE)
	EndIf
EndIf
return iStart != oWord.selection.start
EndFunction

int function MoveToSection(int iNav)
Var
	int iStart,
	int iFlagStatus
var object oWord = GetOWord()
iStart = oWord.selection.start
if iNav == s_top
	oWord.selection.goto(wdGoToSection,wdGoToFirst)
ElIf iNav == s_next
	oWord.Selection.GoToNext(wdGoToSection)
ElIf iNav == s_prior
	oWord.Selection.GoToPrevious(wdGoToSection)
ElIf iNav == s_bottom
	oWord.selection.goto(wdGoToSection,wdGoToLast)
EndIf
return iStart != oWord.selection.start
EndFunction

void Function GetTextToDisplay(int iType,int index,string byRef sLink,string byRef sText)
var
	string sDesc,
	string sAuthor,
	string sInitials,
	string sDate
if MoveToProofreadingElementByIndex(iType,index,sText)
	if GetProofreadingElementInfo(iType,sText,sAuthor,sInitials,sDesc,sDate)
		sLink = sAuthor+cscSpace+sDate
		if !sAuthor
			sLink = sInitials+cscSpace+sDate
		endIf
		if iType == peRevision
			sText = sDesc+cscBufferNewLine+sText
		endIf
	endIf
endIf
EndFunction

void Function MoveToLinkItem(string sType,string sIndex)
Var
	int iType,
	int index,
	string sRef
iType = StringToInt(sType)
index = StringToInt(sIndex)
If UserBufferIsActive()
	UserBufferDeactivate()
endIf
UserBufferClear()
MoveToProofreadingElementByIndex(iType,index,sRef)
EndFunction

void Function ShowListInVirtualViewer(int iType,string sItem, string sList, int iCount)
Var
	int index,
	int AuthorPosition, int DatePosition, int LinkTextLength, ; for updating the viewer to look like it used to
	string sIndex,
	string sLink,
	string sLinkText,
	string sText,
	object oView,
	int iViewType,
	int nViewFlg ;flag for whether to change view back from Normal to prior view state.
if iCount == 1
	sText = FormatString(
		msgOnlyOneItemToDisplayInVirtualViewer,sItem)
else
	sText = FormatString(
		msgNumberOfItemsToDisplayInVirtualViewer,intToString(iCount),sItem)
endIf
if UserBufferIsActive()
	UserBufferDeactivate()
endIf
UserBufferClear()
SetDocumentUpdateNotification(false)
if iType == peRevision
	if !IsNormalOrDraftView()
		var object oWord = GetOWord()
		oView=oWord.activeWindow.view
		iViewType=oView.type
		nViewFlg=true ;change to normal view
		oView.type=wdNormalView
		pause()
	endIf
endIf
userBufferAddText(sText+cscBufferNewLine)
index = 1
while index <= iCount
	sText = StringSegment(sList,list_item_separator,index)
	sText = StringTrimTrailingBlanks (sText)
	;delay(1)
	;GetTextToDisplay(iType,index,sLinkText,sText)
	sIndex = intToString(index)
	sLink = FormatString(fn_MoveToLinkItem,intToString(iType),sIndex)
	if iType == PEComment || iType == PERevision
	; For comments and Revisions, the link must contain the author and date.
		DatePosition = StringSegmentCount (sText, cscBufferNewLine)
		AuthorPosition = DatePosition-1
		sLinkText = StringSegment (sText, cscBufferNewLine, AuthorPosition)
			+cscSpace+StringSegment (sText, cscBufferNewLine, DatePosition)
		LinkTextLength = stringLength (sLinkText) ; for cutting off from the main text:
		sLinkText = sIndex+cscSpace+sLinkText
		sText = StringChopRight (sText, LinkTextLength)
	else
		sLinkText = sIndex
endIf
	UserBufferAddText (sLinkText,sLink,sLinkText+cscSpace+sText,
		cFont_Aerial, 12, ATTRIB_UNDERLINE, rgbStringToColor(cColor_BLUE), rgbStringToColor(cColor_White),
		true,wt_link)
	if ! stringIsBlank (sText)
		UserBufferAddText(sText+cscBufferNewLine)
	endIf
	index = index+1
EndWhile
UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
if nViewFlg
	oView.type = iViewType ;change view back to prior state.
endIf
SetDocumentUpdateNotification(true)
pause()
UserBufferActivate()
JAWSTopOfFile()
SayLine(TRUE)
EndFunction

void function doDelete()
If supportsEditCallbacks() && IsTextSelected() &&  WindowCategoryIsWordDocument()
	TypeKey(cksDelete)
	SayCharacter(WantMarkupForJAWSDelete ())
		SayFormattedMessage(OT_MESSAGE, cMsgSelectionDeleted, cmsgSilent)
else
	doDelete()
endIf
endFunction

void Function SayAccentedCharacter()
var
	string sChar,
	int iStart,
	int iEcho
iEcho = GetJcfOption(opt_typing_Echo)
If iEcho == 0  ; silent keyboard
|| iEcho == 2 then ; words only
	return
EndIf
var object oWord = GetOWord()
iStart = oWord.Selection.Range.Start
sChar = oWord.ActiveDocument.Characters(iStart).text
if sChar
	Say(sChar,ot_char)
EndIf
EndFunction

void function SayHomeOrEndFromCaretMovedEvent()
if getCharacter()==vbcr || IPAtEndOfLine()
	say(cmsgBlank1,ot_char)
	return
endIf
SayCharacter()
EndFunction

void function SayFirstOrLastLineNavTypeFromCaretMovedEvent(int isFirstLine)
if isFirstLine
	SayMessage(ot_JAWS_message, cmsg36_L, cmsg36_S) ;"top of file"
else
	SayMessage(ot_JAWS_message, cmsg37_L, cmsg37_S) ;"bottom of file"
EndIf
EndFunction

void function SayFirstOrLastLineFromCaretMovedEvent( int isFirstLine )
SayFirstOrLastLineNavTypeFromCaretMovedEvent(isFirstLine)
delay(1)
indicateInconsistenciesInRange(CheckLine)
delay(1)
SayLine (TRUE)
EndFunction

void function SayPageFromCaretMovedEvent(optional int movementUnit)
delay(1)
indicateInconsistenciesInRange(CheckLine)
SayLine (TRUE, movementUnit)
EndFunction

void function SayLineFromCaretMovedEvent()
var
	int iTemp,
	int iOptHeadingIndication,
	int bRestoreOptHeadingIndication,
	int iAppNewLineMode,
	int iCurCol,
	int iCurRow,
	Int iFlags = GetSelectionContextFlags()
indicateInconsistenciesInRange(CheckLine)
if isFormfield()
	;formfields are spoken by SelectionContextChangedEvent
	return
endIf
if inTable()
	if WordDocumentPresentation()
		say(GetRowText(ScreenLayoutVerticalBar),ot_line,true)
	else
		self::SayLine(TRUE)
	endIf
	return
EndIf
;test for whether new line and paragraph mark indication is on.
; if so, we need to suppress new line indication when moving by line and not on a hard return.
iAppNewLineMode=getJcfOption(OPT_INDICATE_NEWLINES)
if iAppNewLineMode == indicateParagraphMarks
	iTemp = true
	if GetCharacterValue(GetCharacter()) != icNewLine
		;suppress.
		SetJcfOption(OPT_INDICATE_NEWLINES,0)
	EndIf
endIf
if iFlags & selCtxStyle
&& GetSelectionContext() & selCtxStyle
	iOptHeadingIndication = GetJCFOption(optHeadingIndication)
	if iOptHeadingIndication
		SetJCFOption(optHeadingIndication,0)
		bRestoreOptHeadingIndication = true
	EndIf
EndIf
SetSelectionContextFlags (iFlags & (~ selCtxStyle), FlagSetSpokenBeforeText())
SayLine (TRUE, TRUE)
SetSelectionContextFlags (iFlags, FlagSetSpokenBeforeText() | selCtxStyle)
if bRestoreOptHeadingIndication
	SetJCFOption(optHeadingIndication,ioptHeadingIndication)
endIf
if iTemp
&& iAppNewLineMode == IndicateParagraphMarks
	;reset
	SetJcfOption(OPT_INDICATE_NEWLINES,indicateParagraphMarks)
endIf
EndFunction

void function SaySentenceFromCaretMovedEvent()
indicateInconsistenciesInRange(CheckSentence)
SaySentence()
EndFunction

void function SayParagraphFromCaretMovedEvent()
if !SayAllInProgress()
	indicateInconsistenciesInRange(CheckParagraph)
	SayParagraph()
EndIf
EndFunction

int function ShouldProcessCaretMovedEvent( optional int movementUnit, int source)
return (WindowCategoryIsWordDocument() ||
ISChromeWindow(GetFocus())) ; WebView2 inside Outlook Message
	&& (movementUnit != 0)
	&& !IsKeyWaiting()
	&& !IsReadOnlyVirtualMessage()
EndFunction

void function ProcessSpeechOnCaretMovedEvent(int movementUnit, optional int source)
var string LastScriptName = GetScriptAssignedTo (GetCurrentScriptKeyName())
LastScriptName = stringLower (LastScriptName)
if source == InputSource_Braille
	if BrailleAutoadvanceModeActive()
		return false
	endIf
	;Keep Braille panning keys from causing speech, where Active Follows Braille option is turned on. 
	if StringContains (LastScriptName, "braillepan")
	|| StringContains (LastScriptName, "braillenextline") 
	|| StringContains (LastScriptName, "braillepriorline") 
	|| StringContains (LastScriptName, "wheel") then 
		return FALSE
	endIf
endIf
if !SupportsEditCallbacks()
&& (lastScriptName == "saypriorline" || lastScriptName == "saynextline")
	return
endIf
if c_WordFuncTester.NavigationSayValueHook
	;prevent wrong character from speaking
	;by applying the hook code after the navigation occurs.
	if IsMovingByCharacter(MovementUnit)
		if c_WordFuncTester.NavigationSayValueHook == 1
			SayCharacterPhonetic()
		else
			SayCharacterValue()
		EndIf
	EndIf
	if IsMovingByWord(movementUnit)
		SpellWord()
	EndIf
	return
endIf
if IsMovingByCharacter(MovementUnit) 
	SayCharacterFromCaretMovedEvent()
elif IsMovingByWord(movementUnit)
	SayWordFromCaretMovedEvent()
elif IsMovingByLine(movementUnit)
	SayLineFromCaretMovedEvent()
elif IsMovingBySentence(movementUnit)
	SaySentenceFromCaretMovedEvent()
elif IsMovingByParagraph(movementUnit)
	SayParagraphFromCaretMovedEvent()
elif IsMovingByHomeOrEnd(movementUnit)
	SayHomeOrEndFromCaretMovedEvent()
elif IsMovingByFirstOrLastLine(movementUnit)
	SayFirstOrLastLineFromCaretMovedEvent(movementUnit == Unit_Line_First)
elif IsMovingByPage(movementUnit)
	SayPageFromCaretMovedEvent(movementUnit)
endIf
endFunction

void function CaretMovedEvent( int movementUnit, optional int source)
if c_WordFuncTester.CaretMovedIgnoreSayAll
	; keep end of SayAll from speaking twice.
	;Timer is necessary because when pages turn around the time SayAll stops, this event fires twice.
	scheduleFunction ("ClearSayAllGlobal", 5)
	return
endIf
ClearAnyScheduledDocumentTopAndBottomEdgeAlert()
var int isNavigatingTableByCell = cLastTracked.tableNavInWordDocument || cLastTracked.tableNavInEditableMessage
;In Word, CellChangedEvent fires before CaretMovedEvent.
;In Outlook, CaretMovedEvent fires before CellChangedEvent.
;Clear the movement tracking used for tables in Word documents,
;but not those used in editable message documents,
;since doing so would clear the editable message caret and table tracking before they can be used in the table events.
cLastTracked.caretMovementUsedByWordDocumentTables = 0
cLastTracked.tableNavInWordDocument = 0
TrackEvent(event_CaretMoved)
if source != INP_BrailleDisplay
&& BrailleIsInputSource()
	source = INP_BrailleDisplay
endIf
if !movementUnit
&& cLastTracked.forcedRecognition
	movementUnit = cLastTracked.forcedRecognition
	cLastTracked.forcedRecognition = 0
endIf
if !ShouldProcessCaretMovedEvent(MovementUnit,Source)
|| isNavigatingTableByCell
	return
EndIf
ProcessSpeechOnCaretMovedEvent(movementUnit, source)
endFunction

void function SkimReadStoppedEvent(int nSkimReadingMode, int nMatches, int bSummarize)
SkimReadStoppedEvent(nSkimReadingMode, nMatches, bSummarize)
if nSkimReadingMode
&& !bSummarize
	UpdateWordFocus(GetFocus ())
endIf
endFunction

void function AddHook (int hookType, string FnName)
; Don't even think about removing the IsVirtualPCCursor condition below until you fully
; understand the change list  for  Bug 117777.
if hookType != hk_script || IsVirtualPCCursor()
	return AddHook (hookType, FnName)
endIf
if fnName == "PhoneticSpellHook"
	c_WordFuncTester.PhoneticSpellHookSet = TRUE
	c_WordFuncTester.NavigationSayValueHook = IsSameScript()
elIf FNName == "CharacterValueHook"
	c_WordFuncTester.NavigationSayValueHook = IsSameScript()
elIf FnName == "SpellWordHook"
	c_WordFuncTester.NavigationSayValueHook = 1
endIf
AddHook (hookType, FnName)
endFunction

void function RemoveHook (int hookType, string FnName)
if hookType != hk_script
	return RemoveHook (hookType, FnName)
endIf
if fnName == "PhoneticSpellHook" 
|| fnName == "CharacterValueHook"
|| fnName == "SpellWordHook"
	c_WordFuncTester.PhoneticSpellHookSet = FALSE
	c_WordFuncTester.NavigationSayValueHook = 0
endIf
RemoveHook (hookType, FnName)
endFunction

int Function CharacterValueHook (string ScriptName)
;Virtual Outlook messages:
if IsVirtualPcCursor()
	return Default::CharacterValueHook (ScriptName)
endIf
if ScriptName == sn_SayNextCharacter
	NextCharacter()
	if IsPCCursor()
	&& WindowCategoryIsWordDocument()
		c_WordFuncTester.NavigationSayValueHook = 2
	else
		SayCharacterValue()
	endIf
	return False
endIf
if ScriptName == sn_SayPriorCharacter
	PriorCharacter()
	if IsPCCursor()
	&& WindowCategoryIsWordDocument()
		c_WordFuncTester.NavigationSayValueHook = 2
	else
		SayCharacterValue()
	endIf
	return False
endIf
RemoveHook(HK_SCRIPT, "CharacterValueHook")
c_WordFuncTester.NavigationSayValueHook = 0
return True
EndFunction

int Function PhoneticSpellHook (string ScriptName)
;Virtual Outlook messages:
if IsVirtualPcCursor()
	return Default::PhoneticSpellHook (ScriptName)
endIf
if ScriptName == sn_SayNextCharacter
	NextCharacter()
	if IsPCCursor()
	&& WindowCategoryIsWordDocument()
		c_WordFuncTester.NavigationSayValueHook = 1
	else
		SayCharacterPhonetic()
	endIf
	return False
endIf
if ScriptName == sn_SayPriorCharacter
	PriorCharacter()
	if IsPCCursor()
	&& WindowCategoryIsWordDocument()
		c_WordFuncTester.NavigationSayValueHook = 1
	else
		SayCharacterPhonetic()
	endIf
	return False
endIf
RemoveHook(HK_SCRIPT, fn_PhoneticSpellHook)
c_WordFuncTester.NavigationSayValueHook = 0
return True
EndFunction

int Function SpellWordHook (string ScriptName)
;Virtual Outlook messages:
if IsVirtualPcCursor()
	return Default::SpellWordHook (ScriptName)
endIf
if ScriptName == sn_SayNextWord
	NextWord()
	if IsPCCursor()
	&& WindowCategoryIsWordDocument()
		c_WordFuncTester.NavigationSayValueHook = 1
	else
		SpellWord()
	endIf
	return false
endIf
if ScriptName == sn_SayPriorWord
	PriorWord()
	if IsPCCursor()
	&& WindowCategoryIsWordDocument()
		c_WordFuncTester.NavigationSayValueHook = 1
	else
		SpellWord()
	endIf
	return false
endIf
RemoveHook(HK_SCRIPT, "SpellWordHook")
c_WordFuncTester.NavigationSayValueHook = 0
return true
EndFunction

int function ShouldSayAllOnDocumentLoad()
if !IsBrowserClassWindowOrDocument() return false endIf
; Ensure dialogs in the virtual buffer read using sayAll
if IsVirtualPCCursor()
&& dialogActive()
&& GetWindowName(GetRealWindow (GetFocus())) != wn_AppStore
&& !(GetRunningFSProducts() & product_Fusion)
	return true
endIf
return gbDefaultSayAllOnDocumentLoad
EndFunction

void function DoDefaultDocumentLoadActions()
setJCFOption (OPT_QUICK_KEY_NAVIGATION_MODE, GetNavigationQuickKeysSettingFromFile())
DoDefaultDocumentLoadActions()
EndFunction

int function DlgListOfHeadings()
; Save and restore Word browser target so that
; Control Page Up/Down actions are not changed by calling DlgListOfHeadings:
var
	object oBrowser,
	int SavedTargetType,
	int retVal
if !WindowCategoryIsWordDocument()
	return DlgListOfHeadings()
endIf
var object oWord = GetOWord()
oBrowser = oWord.browser
SavedTargetType = oBrowser.target
retVal = DlgListOfHeadings()
oBrowser.target = SavedTargetType
return retVal
EndFunction

void Function ListFields()
var
	string sText,
	string sList,
	int iChoice,
	int index,
	int iCount,
	int iOldPos,
	int iNewPos,
	int bIsProtectedForm
if !OutlookIsActive()
	bIsProtectedForm = IsActiveDocumentProtectedForm()
	if bIsProtectedForm
		sList = GetListOfFormFields(list_item_separator)
		iCount = StringSegmentCount(sList,list_item_separator	)
	else
		sList = GetListOfProofreadingElements(peField)
		iCount = GetProofreadingElementCount(pefield)
	EndIf
else
	sList = GetListOfProofreadingElements(peField)
	iCount = GetProofreadingElementCount(pefield)
EndIf
if iCount == 0
	SayMessage(ot_error, msgNoFields1_L)
	return
endIf
var object oWord = GetOWord()
iOldPos = oWord.selection.start
sList = CleanUpDocumentTextList(sList)
index = stringSegmentIndex(sList,list_item_separator,GetNearestProofreadingElementText(peField),false)
iChoice = DlgSelectItemInList (sList, msgSelectAFieldDialogName1_L, false,index)
iNewPos = oWord.selection.start
if iChoice
	if bIsProtectedForm
		MoveToFormfieldByIndex(iChoice)
	Else
		MoveToProofreadingElementByIndex(peField,iChoice,sText)
		Say(sText,ot_line,true)
	EndIf
else
	RelocateCursorInDocument(iOldPos,iNewPos)
endIf
EndFunction

void Function listSpellingErrors()
; this call inspires a dialog where user selects,
; if the document contains 20000 words or longer.
if ShouldAbortFromLargeDocumentForProofingErrors() then return endIf
Var
	int iCount,
	string sList,
	int iChoice,
	int index,
	string sText,
	int iOldPos,
	int iNewPos
sList = GetListOfProofreadingElements(peSpellingError)
iCount = StringSegmentCount(sList,list_item_separator)
if iCount == 0
	SayFormattedMessage(ot_error,msgNoSpellingErrors)
	return
EndIf
var object oWord = GetOWord()
iOldPos = oWord.selection.start
SayFormattedMessage(ot_smart_help, formatString(msgPleaseWait1_L,intToString(icount)), formatString(msgPleaseWait1_S,intToString(iCount)))
sList = CleanUpDocumentTextList(sList)
index = stringSegmentIndex(sList,list_item_separator,GetNearestProofreadingElementText(peSpellingError),false)
iChoice = DlgSelectItemInList (sList, msgSpellingErrors, false,index)
iNewPos = oWord.selection.start
if iChoice
	sText = StringSegment(sList,list_item_separator,iChoice)
	if MoveToProofReadingElementByIndex(peSpellingError,iChoice,sText)
		say(sText,ot_line,true)
		SpellString(sText)
	endIf
else
	RelocateCursorInDocument(iOldPos,iNewPos)
EndIf
EndFunction

void Function listGrammaticalErrors()
; this call inspires a dialog where user selects,
; if the document contains 20000 words or longer.
if ShouldAbortFromLargeDocumentForProofingErrors() then return endIf
Var
	int iCount,
	string sList,
	int iChoice,
	int index,
	string sText,
	int iTicks,
	int iOldPos,
	int iNewPos
; prevent long documents from getting processed if list takes longer than 10 seconds to gather.
;let iTicks = GetTickCount()
;SayMessage(ot_smart_help,msgWaitForList)
sList = GetListOfProofreadingElements(peGrammaticalError,list_item_separator)
;if GetTickCount()-iTicks> = 10000
;	SayMessage(ot_error,msgTooManyGrammaticalErrors_l,msgTooManyGrammaticalErrors_s)
;	return
;EndIf
iCount = stringSegmentCount(sList,list_item_separator)
if iCount == 0
	sayFormattedMessage(ot_error, msgNoGrammaticalErrors) ; no grammatical errors
	return
EndIf
var object oWord = GetOWord()
iOldPos = oWord.selection.start
SayFormattedMessage(ot_smart_help, formatString(msgPleaseWait1_L,intToString(icount)), formatString(msgPleaseWait1_S,intToString(iCount)))
sList = CleanUpDocumentTextList(sList)
index = stringSegmentIndex(sList,list_item_separator,GetNearestProofreadingElementText(peGrammaticalError),false)
iChoice = DlgSelectItemInList (sList, msgGrammaticalErrors, false,index)
inewPos = oWord.selection.start
if iChoice
	sText = StringSegment(sList,list_item_separator,iChoice)
	if MoveToProofReadingElementByIndex(peGrammaticalError,iChoice,sText)
		say(sText,ot_line,true)
	endIf
else
	RelocateCursorInDocument(iOldPos,iNewPos)
EndIf
EndFunction

string function GetActiveBookmarkName()
return cWDSelectionContext.bookmark.name
EndFunction

void Function ListBookmarks()
Var
	int iCount,
	string sList,
	int index,
	int iChoice,
	string sText,
	int iOldPos,
	int iNewPos
sList = GetListOfProofreadingElements(peBookmark)
iCount = GetProofreadingElementCount(peBookmark)
if iCount == 0
	SayFormattedMessage(ot_error, msgNoBookmarks_L,msgNobookmarks_s)
	return
EndIf
var object oWord = GetOWord()
iOldPos = oWord.selection.start
SayFormattedMessage(ot_smart_help, formatString(msgPleaseWait1_L,intToString(icount)), formatString(msgPleaseWait1_S,intToString(iCount)))
sList = CleanUpDocumentTextList(sList)
var string textSearch
GetAnnotationAtCaret (0, cscNull, cscNull, textSearch, cscNull, cscNull)
index = stringSegmentIndex(sList,list_item_separator,textSearch,false)
iChoice = DlgSelectItemInList (sList,msgBookmarkList,false,index)
iNewPos = oWord.selection.start
if iChoice
	MoveToProofReadingElementByIndex(peBookmark,iChoice,sText)
	Say(sText,ot_line,true)
else
	RelocateCursorInDocument(iOldPos,iNewPos)
EndIf
EndFunction

void Function GetCommentInfo(int byRef index,string byRef sAuthor,string byRef sInitials)
;GetProofreadingElementInfo function does not work in comment pane.
Var
	object oComment
var object oWord = GetOWord()
oComment = oWord.selection.range.comments(1)
index = oComment.index
sAuthor = oComment.author
sInitials = oComment.initial
EndFunction

void Function listComments()
Var
	int iCount,
	string sList,
	int iChoice,
	int index,
	string sText,
	int iOldPos,
	int INewPos
sList = GetListOfProofreadingElements(peComment)
iCount = StringSegmentCount(sList,list_item_separator)
if iCount == 0
	SayFormattedMessage (ot_error, msgNoComments1_L)
	return
EndIf
var object oWord = GetOWord()
iOldPos = oWord.selection.start
SayFormattedMessage(ot_smart_help, formatString(msgPleaseWait1_L,intToString(icount)), formatString(msgPleaseWait1_S,intToString(iCount)))
sList = CleanUpDocumentTextList(sList)
var string textSearch
GetAnnotationAtCaret (0, cscNull, cscNull, textSearch, cscNull, cscNull)
index = stringSegmentIndex(sList,list_item_separator,textSearch,false)
iChoice = DlgSelectItemInList (sList,msgReviewersComments1_l,false,index)
iNewPos = oWord.selection.start
if iChoice
	if MoveToProofReadingElementByIndex(peComment,iChoice,sText)
		Say(sText,ot_line,true)
	EndIf
else
	RelocateCursorInDocument(iOldPos,iNewPos)
EndIf
EndFunction

void Function listFootnotes()
Var
	int iCount,
	string sList,
	int iChoice,
	int index,
	string sText,
	int iOldPos,
	int iNewPos
sList = GetListOfProofreadingElements(peFootnote)
iCount = StringSegmentCount(sList,list_item_separator)
if iCount == 0
	SayFormattedMessage(ot_error, msgNoFootnotes_l,msgNoFootnotes_s)
	return
EndIf
var object oWord = GetOWord()
iOldPos = oWord.selection.start
SayFormattedMessage(ot_smart_help, formatString(msgPleaseWait1_L,intToString(icount)), formatString(msgPleaseWait1_S,intToString(iCount)))
sList = CleanUpDocumentTextList(sList)
var string textSearch
GetAnnotationAtCaret (0, cscNull, cscNull, textSearch, cscNull, cscNull)
index = stringSegmentIndex(sList,list_item_separator,textSearch,false)
iChoice = DlgSelectItemInList (sList,msgFootnotes,false,index)
iNewPos = oWord.selection.start
if iChoice
	if MoveToProofReadingElementByIndex(peFootnote,iChoice,sText)
		AnnounceFootnoteOrEndNote(ot_user_requested_information)
	endIf
else
	RelocateCursorInDocument(iOldPos,iNewPos)
EndIf
EndFunction

void Function listEndnotes()
Var
	int iCount,
	string sList,
	int iChoice,
	int index,
	string sText,
	int iOldPos,
	int iNewPos
sList = GetListOfProofreadingElements(peEndnote)
iCount = StringSegmentCount(sList,list_item_separator)
if iCount == 0
	SayFormattedMessage (ot_error, msgNoEndnotes_l,msgNoEndnotes_s)
	return
EndIf
var object oWord = GetOWord()
iOldPos = oWord.selection.start
SayFormattedMessage (ot_smart_help, formatString(msgPleaseWait1_L,intToString(icount)), formatString(msgPleaseWait1_S,intToString(iCount)))
sList = CleanUpDocumentTextList(sList)
var string textSearch
GetAnnotationAtCaret (0, cscNull, cscNull, textSearch, cscNull, cscNull)
index = stringSegmentIndex(sList,list_item_separator,textSearch,false)
iChoice = DlgSelectItemInList (sList,msgEndnotes,false,index)
iNewPos = oWord.selection.start
if iChoice
	if MoveToProofReadingElementByIndex(peEndnote,iChoice,sText)
		AnnounceFootnoteOrEndNote(ot_user_requested_information)
	endIf
else
	RelocateCursorInDocument(iOldPos,iNewPos)
EndIf
EndFunction

void Function listRevisions()
Var
	string sList,
	int iCount,
	int index,
	int iChoice,
	string sText,
	int iOldPos,
	int iNewPos
;a table in the revisions may cause revised text to include list_item_separator,
;so temporarily use some other character as the revision delimiter and then clean up the list:
sList = GetListOfProofreadingElements(peRevision,"\001")
sList = StringReplaceChars(sList,list_item_separator,cscSpace)
sList = StringReplaceChars(sList,"\001",list_item_separator)
;now it's cleaned up, list_item_separator is safe to use as the revision delimiter.
iCount = stringSegmentCount(sList,list_item_separator)
if iCount == 0
	SayFormattedMessage(ot_error, msgNoRevisions_l,msgNoRevisions_s)
	return
endIf
var object oWord = GetOWord()
iOldPos = oWord.selection.start
SayFormattedMessage (ot_smart_help, formatString(msgPleaseWait1_L,intToString(icount)), formatString(msgPleaseWait1_S,intToString(iCount)))
sList = CleanUpDocumentTextList(sList)
index = stringSegmentIndex(sList,list_item_separator,GetNearestProofreadingElementText(peRevision),false)
iChoice = DlgSelectItemInList (sList, msgRevisions, false,index)
iNewPos = oWord.selection.start
if iChoice
	sText = StringSegment(sList,list_item_separator,iChoice)
	if MoveToProofReadingElementByIndex(peRevision,iChoice,sText)then
		say(sText,ot_line,true)
	endIf
else
	RelocateCursorInDocument(iOldPos,iNewPos)
EndIf
EndFunction

void Function listObjects()
Var
	object oSelectedShape,
	int iCount,
	int iInlineShapeCount,
	int iEmbeddedObjectCount,
	string sList,
	string sInlineShapesList,
	string sEmbeddedObjectsList,
	int index,
	int iChoice,
	string sText,
	int iOldPos,
	int iNewPos
sInlineShapesList = GetListOfProofreadingElements(peInlineShape)
iInlineShapeCount = StringSegmentCount(sInlineShapesList,list_item_separator)
sEmbeddedObjectsList = GetListOfProofreadingElements(peObject)
iEmbeddedObjectCount = StringSegmentCount(sEmbeddedObjectsList,list_item_separator)
iCount = iInlineShapeCount+iEmbeddedObjectCount
if iCount == 0
	SayFormattedMessage(ot_error, msgNoObjectsInTextLayer1_L)
	return
EndIf
var object oWord = GetOWord()
iOldPos = oWord.selection.start
if !iEmbeddedObjectCount
	sList = sInlineShapesList
	index = stringSegmentIndex(sList,list_item_separator,
		GetNearestProofreadingElementText(peInlineShape),false)
elif !iInlineShapeCount
	sList = sEmbeddedObjectsList
	index = stringSegmentIndex(sList,list_item_separator,
		GetNearestProofreadingElementText(peObject),false)
else
	sList = sInlineShapesList+list_item_separator+sEmbeddedObjectsList
	index = stringSegmentIndex(sList,list_item_separator,
		GetNearestProofreadingElementText(peInlineShape),false)
	if !index
		index = stringSegmentIndex(sList,list_item_separator,
			GetNearestProofreadingElementText(peObject),false)
	endIf
endIf
SayFormattedMessage (ot_smart_help, formatString(msgPleaseWait1_L,intToString(icount)), formatString(msgPleaseWait1_S,intToString(iCount)))
sList = CleanUpDocumentTextList(sList)
iChoice = DlgSelectItemInList (sList,msgInlineObjects1_L,false,index)
iNewPos = oWord.selection.start
if iChoice
	sText = StringSegment(sList,list_item_separator,iChoice)
	if iChoice > iInlineShapeCount
		iChoice = iChoice-iInlineShapeCount
		if MoveToProofReadingElementByIndex(peObject,iChoice,sText)
			oSelectedShape = oWord.activeDocument.Shapes(iChoice)
			oSelectedShape.select
			if oSelectedShape.type == msoTextBox
				sayUsingVoice(vctx_message,
					formatString(msgShapeTypeSelected,msgTextbox),ot_help)
				;brings to top of selected shape if a text box got activated.
				; This tends to occur with .doc files where the .select method activates the text box in edit mode.
				; oWord.selection.characters.count always returns character count,  
				var string SelectedText = GetSelectedText()
				if ! StringIsBlank (SelectedText)
				&& stringCompare (SelectedText, oSelectedShape.TextFrame.TextRange.Text) > 0
					oWord.selection.collapse 
				endIf
				sayLine(TRUE)
				return
			endIf
		endIf
	else
		if MoveToProofReadingElementByIndex(peInlineShape,iChoice,sText)
			oSelectedShape = oWord.activeDocument.inlineShapes(iChoice)
			oSelectedShape.select
			if oSelectedShape.type == msoTextBox
				sayUsingVoice(vctx_message,
					formatString(msgShapeTypeSelected,msgTextbox),ot_help)
				oWord.selection.collapse ; brings to top of selected shape.
				sayLine(TRUE)
				return
			endIf
		endIf
	endIf
	SaySelectedShape(vctx_message,ot_help,oSelectedShape)
else
	RelocateCursorInDocument(iOldPos,iNewPos)
EndIf
EndFunction

void Function sayColor()
var
	string colorName
if WindowCategoryIsWordDocument()
&& isPcCursor()
	var object oWord = GetOWord()
	colorName = getColorDescription(oWord.selection.font.color)
	if colorName
		SayFormattedMessage(ot_help,
			formatString(msgColorDesc1, colorName, GetColorName (getColorBackground())))
		return
	endIf
endIf
sayColor()
EndFunction

void function SetNewLineIndicationMode()
Var
	int iMode,
	int iSavedMode
iMode = NewLinesAndParagraphsIndication()
iSavedMode = iMode
setJcfOption(OPT_INDICATE_NEWLINES,iMode)
if getViewType() == wdWebView
	if iMode
		SetNewLinesAndParagraphsIndication(Off)
		setJcfOption(OPT_INDICATE_NEWLINES,Off)
		sayMessage(ot_smart_help,msgWebViewNewLineIndicationWarning)
	endIf
	return
endIf
if isShowParagraphs()
|| isShowAll()
	If iMode == Off
		iMode = IndicateWhenReading
	endIf
elif !isShowParagraphs()
|| !isShowAll()
	iMode = Off
EndIf
if iMode != iSavedMode
&& !GlobalWasHjDialog
&& getAppMainWindow (getFocus()) == globalPrevApp
&& getRealWindow (getFocus()) == globalPrevReal
	setJcfOption(OPT_INDICATE_NEWLINES,iMode)
endIf
EndFunction

void Function SetFindItemToPage()
Var
	object oBrowser
var object oWord = GetOWord()
oBrowser = oWord.browser
oBrowser.target = wdBrowsePage
EndFunction

string Function GetFindItemTypeString()
Var
	int iTarget,
	string sType
var object oWord = GetOWord()
iTarget = oWord.browser.target
If iTarget == wdBrowseComment
	sType = msgComment
ElIf iTarget == wdBrowseEdit
	sType = msgEdit
ElIf iTarget == wdBrowseEndnote
	sType = msgEndnote
elIf iTarget == wdBrowseField
	sType = msgField
elIf iTarget == wdBrowseFind
	sType = msgFind ; occurrence
elIf iTarget == wdBrowseFootnote
	sType = msgFootnote
ElIf iTarget == wdBrowseGoto
;!!!!!!! ToDo: Find a better way to detect the following variations:
;temporarily commented out the global-dependent code:
;	If gbBookmarkItem
;		sType = msgGotoBookmark
;	Elif gbObjectItem
;		sType = msgGoToObject
;	else
		sType = msgGotoLine
;		gbBookmarkItem = false
;		gbObjectItem = false
;	EndIf
ElIf iTarget == wdBrowseGraphic
	sType = msgGraphic
elIf iTarget == wdBrowseHeading
	sType = msgHeading
elIf iTarget == wdBrowsePage
	sType = msgPage
ElIf iTarget == wdBrowseSection
	sType = msgSection
ElIf iTarget == wdBrowseTable
	sType = msgTable
EndIf
return sType
EndFunction

void Function sayLanguageInUse()
var
	string sLangName
if IsActiveDocumentProtectedForm()
	SayFormattedMessage(ot_error,msgFunctionUnavailableWhenDocProtected1_L)
	return
EndIf
var object oWord = GetOWord()
sLangName = getLanguageName(oWord.selection.languageId)
SayFormattedMessage(ot_user_requested_information, formatString(msgLanguageInUse1_L, sLangName), formatString(msgLanguageInUse1_L, sLangName))
EndFunction

void Function readRevisionInContext(object textRange, object revision)
var
	object leftContextRange,
	object rightContextRange,
	object revisionRange,
	object DocRange,
	string sLeft,
	string sRight,
	string sRevision,
	string sType,
	string sAuthor,
	string sDate,
	int iRevisionVerbosity
if !revision
	return
endIf
var object oWord = GetOWord()
revisionRange = oWord.selection.range
DocRange = oWord.ActiveDocument.range
leftContextRange = DocRange(textRange.start,revisionRange.start)
rightContextRange = DocRange(revisionRange.end,textRange.end)
sLeft = leftContextRange.text
sRight = rightContextRange.text
sRevision = revisionRange.text
sType = getRevisionTypeString(revision.type)
sAuthor = revision.author
sDate = revision.date
say(sLeft,ot_line,true)
iRevisionVerbosity = RevisionDetection()
if iRevisionVerbosity >= SpeakRevType
	sayUsingVoice(vctx_message, sType,ot_status)
endIf
sayUsingVoice(vctx_message, sRevision,ot_status)
say(sRight,ot_line,true)
if iRevisionVerbosity >= SpeakRevTypeAuthor
	sayFormattedMessageWithVoice(vctx_message,ot_status,
		formatString(msgRevAuthor_L, sAuthor),
		formatString(msgRevAuthor_S, sAuthor))
endIf
if iRevisionVerbosity >= SpeakRevTypeAuthorDate
	sayFormattedMessageWithVoice(vctx_message,ot_status,
		formatString(msgRevDate_L, sDate),
		formatString(msgRevDate_S, sDate))
endIf
EndFunction

void Function ReadWordInContext(optional int bIgnoreNotFoundMessage, int UseSearchStringNotFoundMessageInstead)
var
	handle hwnd,
	handle hCurWnd,
	Handle hReal,
	string sWindowName,
	String sRealName,
	string sObjName,
	object oSelection,
	object oRevision
if (! getRunningFSProducts() & product_JAWS)
	return
endIf
var object oWord = GetOWord()
oSelection = oWord.selection
hwnd = GetParent (GetFocus())
hReal = GetRealWindow (GetFocus())
sWindowName = GetWindowName (hwnd)
sRealName = GetWindowName (hReal)
sObjName = GetObjectName()
if stringContains(sWindowName,wn_SpellingAndGrammar)
|| stringContains(sWindowName,wn_spelling)
|| StringContains (sRealName, wn_SpellingAndGrammar)
|| StringContains (sRealName, wn_spelling)
	If GetAppFileName() == "wwlib.dll"	; we are in Outlook message
		if OutlookIsActive()
			SayMessage (OT_ERROR, msgReadWordInContextNotAvailableInOutlook2013)
		else
			SayMessage (OT_ERROR, msgWordInContextError2013andLater)
		endIf
	EndIf
	Return
elif IsSearchDocumentDialogType()
; or the new Office 2013 spellcheck pane:
|| InProofingPaneSpellCheck()
;All context menus should read Word in Context, since you can apply spell check corrections via a context menu,
; such as alt+f7 or even right click a word and select a spelling suggestion:
|| menusActive()
	if !oSelection
		if !bIgnoreNotFoundMessage
			performScript readWordInContext()
		EndIf
		return
	EndIf
	if oSelection.start != oSelection.end
		; not collapsed, must be something highlighted
		if oSelection.sentences.count > 0
			SayFormattedMessage(ot_line, oSelection.sentences(1).text)
			BrailleMessage (oSelection.sentences(1).text)
		else
			SayFormattedMessage(ot_line, oSelection.paragraphs(1).range.text)
			BrailleMessage (oSelection.paragraphs(1).range.text)
		endIf
		routeJAWSToHighlightedText() ; would clear the Braille flash message, but this is of no consequecne,
		;since the JAWSCursor would at that point be on the selection anyway.
	else
		if ! bIgnoreNotFoundMessage
			if UseSearchStringNotFoundMessageInstead
			; for search or search and replace panes:
				SayMessage(ot_error, cmsg64_L) ; "search string not found "
			else
				SayMessage(ot_error, cmsg216_L) ; "Word in context not found "
			endIf
		endIf
	endIf
elif getWindowName(GetRealWindow(getFocus())) == wn_AcceptOrReject
	if oSelection.range.revisions.count > 0
		; Accept or Reject Changes (Track Changes) dialog.
		oRevision = oSelection.range.revisions(1)
		if oSelection.range.sentences.count > 0
			readRevisionInContext(oSelection.range.sentences(1),oRevision)
		else
			readRevisionInContext(oSelection.range.paragraphs(1).range,oRevision)
		endIf
		routeJAWSToHighlightedText()
	else
		SayMessage(ot_error, msgNoSelectedRevision1_L)
	endIf
elif InTable()
	; we are in a table, read the coordinates of the current cell relative to the entire table.
	SayCellCoordinatesInfo(ot_user_requested_information)
else
	SayMessage (OT_ERROR, msgWordInContextError2013andLater)
	Return
endIf
EndFunction

void function TabInReadOnlyMessage(int direction)
c_WordFuncTester.TabbingInReadOnlyMessage = true
if direction == MOVE_FORWARD
	TabKey()
elIf direction == MOVE_BACK
	ShiftTabKey()
endIf
EndFunction

void function CancelFocusItemMonitors()
ClearAnyScheduledDocumentTopAndBottomEdgeAlert()
c_WordFuncTester.TabbingInReadOnlyMessage = false
BrailleClearPendingFlashMessages()
endFunction

int function ReturnToMarkedPlace (int iMarkedPos)
if iMarkedPos == GetCurCharPos()
	;nowhere to move, already there:
	return true
endIf
var object oWord = GetOWord()
if iMarkedPos > oWord.activeDocument.range.end
 	;can't move there, the requested marked place is greater than the file length:
	return false
endIf
;the function ToggleScreenUpdating does not work well in Word 2007 and above.
;so using the old method instead.
cWDActiveDocument.returningToMarkedPlace = true
SetDocumentUpdateNotification(OFF)
oWord.selection.SetRange(iMarkedPos,iMarkedPos)
;To ensure we actually go to the marked place and stay there,
;we need to select one character and then collapse the selection.
;Otherwise, when the marked place is within a table, we lose the place when we next attempt to move the caret.
oWord.selection.characters(1).select
oWord.selection.collapse
SetDocumentUpdateNotification(ON)
return true
EndFunction

Void Function SayWordATMarkedPlace()
var
	string sWord
var object oWord = GetOWord()
sWord = oWord.selection.words(1).text
Say (sWord, ot_word)
CollectionRemoveItem(cWDActiveDocument,"returningToMarkedPlace")
if CollectionItemExists(cWDActiveDocument,"messageWaitingToSpeak")
	SayUsingVoice(vctx_message,cWDActiveDocument.messageWaitingToSpeak ,ot_status)
	CollectionRemoveItem(cWDActiveDocument,"messageWaitingToSpeak")
EndIf
EndFunction

void function PrepareForSilentSelectionToMarkedPlace()
c_WordFuncTester.SuppressSelectionChangeDetection = true
c_WordFuncTester.ScheduledClearSilentSelectionToMarkedPlace =
	ScheduleFunction("ClearSilentSelectionToMarkedPlace",5)
EndFunction

void function ClearSilentSelectionToMarkedPlace()
c_WordFuncTester.ScheduledClearSilentSelectionToMarkedPlace = 0
c_WordFuncTester.SuppressSelectionChangeDetection = false
EndFunction

Int Function SelectTextBetweenMarkedPlaceAndPos (int iMarkedPlace, int iCharPos)
var
	object oSelection,
	int iStart,
	int iEnd
if iCharPos == iMarkedPlace
	return false
endIf
var object oWord = GetOWord()
oSelection=oWord.selection
if iCharPos < iMarkedPlace
	iStart = iCharPos
	iEnd = iMarkedPlace
else
	iStart = iMarkedPlace
	iEnd = iCharPos
endIf
PrepareForSilentSelectionToMarkedPlace()
oSelection.SetRange(iStart,iEnd)
if isTextSelected() 
	;let gbTextSelectedBetweenMarkedPlaceAndCurPos  =true
	return true
endIf
return false
EndFunction

void Function MouseButtonEvent(int eventID, int x, int y)
MouseButtonEvent(eventID,x,y)
if eventID == WM_LBUTTONUP
&& GetWindowCategory(GetWindowAtPoint(x,y)) == wCat_document
	c_WordFuncTester.MouseButtonEventInDocument = true
	WDApp_DocumentChange()
	c_WordFuncTester.MouseButtonEventInDocument = false
endIf
EndFunction

void function ProcessBoundaryStrike(handle hWnd, int edge)
if !GetJcfOption(OPT_TOP_AND_BOTTOM_EDGE_ALERT )
	return
EndIf
if CaretVisible()
&& WindowCategoryIsWordDocument()
	Var
		Int iSound,
		object oSelection,
		object oWord
	oWord = GetOWord()
	iSound = (oWord.options.enableSound == VBTrue)
	if iSound
		oSelection = oWord.selection
		if IsEndOfDocument(oSelection)
		|| oSelection.characters.count == 1
			if cLastTracked.caretMovementUsedBySelectionContext == Unit_Paragraph_Next
			|| cLastTracked.caretMovementUsedBySelectionContext == Unit_Paragraph_Prior
			|| cLastTracked.caretMovementUsedBySelectionContext == Unit_Sentence_Next
			|| cLastTracked.caretMovementUsedBySelectionContext == Unit_Sentence_Prior
				beep()
			EndIf
			return
		EndIf
	Else
		beep()
	endIf
Else
	ProcessBoundaryStrike(hWnd,edge)
EndIf
EndFunction

void function TabStopEvent(string sNewPos)
if IsReadOnlyMessage()
	return
endIf
if !WindowCategoryIsWordDocument()
	;Don't allow this event to speak if if tabbing in a read-only Outlook message with links
	;and the focus moves into the header fields:
	return
endIf
if TabMeasurementIndicationSetting()
	if !BrailleIsInputSource()
		SayMessage(OT_CURSOR, sNewPos)
	endIf
	BrailleMessage(sNewPos)
EndIf
EndFunction

string function GetBrlObjectOleNameString()
return cWDSelectionContext.field.prompt
EndFunction

string function GetBrlObjectOleValueString()
return cWDSelectionContext.field.value
EndFunction

string function GetBrlObjectOleTypeString()
return cWDSelectionContext.field.brlType
EndFunction

string function GetBrlObjectOleStateString()
return cWDSelectionContext.field.state
EndFunction

string function GetBrlObjectOlePositionString()
return cWDSelectionContext.field.position
EndFunction

int function MainProcessShouldSkipUIAElementWhenNavigating(object element)
if element.controlType == UIA_PaneControlTypeId
&& !element.name
	if element.className == wc_wwC
	|| element.className == wc_wwF
	||element.className == wc_NetUIHwndElement
		return true
	endIf
EndIf
return MainProcessShouldSkipUIAElementWhenNavigating(element)
EndFunction

void Function Unknown (string TheName, int IsScript, optional int IsDueToRecursion)
if IsDueToRecursion
	;recursive calls may happen if a function is running,
	;and the Word event fires and calls the function that is already running.
	;Note, however, that any test of a function which fails to run will evaluate as false.
	return
endIf
TheName = StringLower (TheName)
;Because of the need to refresh braille in SelectionContextChangedEvent,
;and because of the JSB linkage,
;unknown function calls to the following must be manually suppressed:
if theName == "readoutlookmessage"
|| theName == "isactivedocumentprotected"
	return
EndIf
Unknown (TheName, IsScript, IsDueToRecursion)
EndFunction

int function ListenForProofingPaneSpellCheckEvent()
if oWDUIASpellCheckEvents return true endIf
oWDUIASpellCheckEvents = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !ComAttachEvents(oWDUIASpellCheckEvents,wdUIAEventPrefix)
	oWDUIASpellCheckEvents = Null()
	return false
endIf
var
	object condition,
	object treeWalker,
	object element
condition = oWDUIASpellCheckEvents.CreateRawViewCondition()
treeWalker = oWDUIASpellCheckEvents.CreateTreeWalker(condition)
if !treeWalker
	oWDUIASpellCheckEvents = Null()
	return false
endIf
;Searching down from the app main window element will allow us to find the editor pane
;both when the focus is in the editor pane and when it is in the document:
treeWalker.currentElement = oWDUIASpellCheckEvents.GetElementFromHandle(GetAppMainWindow(GetFocus()))
condition = oWDUIASpellCheckEvents.CreateAndCondition(
	oWDUIASpellCheckEvents.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_CustomControlTypeId),
	oWDUIASpellCheckEvents.CreateStringPropertyCondition(UIA_NamePropertyId,wn_Editor))
element = treeWalker.currentElement.FindFirst(TreeScope_Descendants,condition)
if !oWDUIASpellCheckEvents.AddPropertyChangedEventHandler(UIA_NamePropertyId,element,treeScope_subTree)
	oWDUIASpellCheckEvents = Null()
	return false
endIf
return true
EndFunction

int function ListenForProofingPaneWithSplitButtonsSpellCheckEvent()
; this assumes we're in the proofing pane with split buttons.
; also the only control where this should be set is when focus is in the current sentence read-only edit box.
if getObjectTypeCode() != WT_EDIT
	oWDUIASpellCheckEvents = Null()
	return false
endIf
var object element = FSUIAGetFocusedElement()
if !element
|| !element.getValuePattern().isReadOnly
	oWDUIASpellCheckEvents = Null()
	return false
endIf
if oWDUIASpellCheckEvents return true endIf
oWDUIASpellCheckEvents = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !ComAttachEvents(oWDUIASpellCheckEvents,wdUIAEventPrefix)
	oWDUIASpellCheckEvents = Null()
	return false
endIf
if !oWDUIASpellCheckEvents.AddAutomationEventHandler( UIA_Text_TextChangedEventId, Element, TreeScope_Element)
	oWDUIASpellCheckEvents = Null()
	return false
endIf
return TRUE
endFunction

int function ListenForNavigationPaneFindEvent()
;This uses the name property of a net UI label text element,
;which shows the current find as text giving the number of the current match and the total number of matches.
if oWDUIAFindEvents return true endIf
oWDUIAFindEvents = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !ComAttachEvents(oWDUIAFindEvents,wdUIAEventPrefix)
	oWDUIAFindEvents = Null()
	return false
endIf
var
	object condition,
	object treeWalker,
	object element
condition = oWDUIAFindEvents.CreateRawViewCondition()
treeWalker = oWDUIAFindEvents.CreateTreeWalker(condition)
if !treeWalker
	oWDUIAFindEvents = Null()
	return false
endIf
treeWalker.currentElement = oWDUIAFindEvents.GetElementFromHandle(GetAppMainWindow(GetFocus()))
;First, find the Search split button:
var object nameCondition = oWDUIAFindEvents.CreateOrCondition(
	oWDUIAFindEvents.CreateStringPropertyCondition(UIA_NamePropertyId,objn_Search_SplitButton),
	oWDUIAFindEvents.CreateStringPropertyCondition(UIA_NamePropertyId,objn_Clear_SplitButton))
condition = oWDUIAFindEvents.CreateAndCondition(
	oWDUIAFindEvents.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_SplitButtonControlTypeId),
	nameCondition)
element = treeWalker.currentElement.FindFirst(TreeScope_Descendants,condition)
treeWalker.currentElement = element
;Now look for the text object showing the number of results:
treeWalker.gotoNextSibling()
if treeWalker.currentElement.controlType != UIA_TextControlTypeId
|| treeWalker.currentElement.className != "NetUILabel"
	oWDUIAFindEvents = Null()
	return false
endIf
;Now listen for the name change of the text element:
element = treeWalker.currentElement
if !oWDUIAFindEvents.AddPropertyChangedEventHandler(UIA_NamePropertyId,element,treeScope_subTree)
	oWDUIAFindEvents= Null()
	return false
endIf
return true
EndFunction

void function wdUIAPropertyChangedEvent(object element, int propertyID, variant newValue)
if GetObjectSubtypeCode(SOURCE_CACHED_DATA) == WT_COMBOBOX
	; avoid spelling the items in the language combo when it drops down to  list.
	return
endIf
if oWDUIASpellCheckEvents
	ReadSpellCheckInfoUIA(true)
elif oWDUIAFindEvents
&& newValue;filters out spurious announcements when exiting find
	readWordInContext(TRUE)
endIf
EndFunction

void function wdUIAAutomationEvent (object element, int eventID)
if isSameScript() || IsKeyWaiting()
	; This can run really often
	; The KeyWaiting portion will keep it so users can press alt+i and hold it donw, for instance, and then hear the change.
	; possibly something someone who can see would be able to do while it flies by.
	return
endIf
if eventID != UIA_Text_TextChangedEventId then return endIf
var int now = getTickCount()
if now - c_WordFuncTester.ProofingPaneSplitButtonsTickCounter <= ProofingPaneSplitButtonsTickCounterThreshold
	c_WordFuncTester.ProofingPaneSplitButtonsTickCounter = now
	return
endIf
; only fires when an accelerator was pressed in the text field and the text changed,
; because the spellCheck moved.
NullSuggestionSplitButton() ;reacquired in ReadProofingPaneWithSplitButtons
ReadProofingPaneWithSplitButtons()
c_WordFuncTester.ProofingPaneSplitButtonsTickCounter = now
endFunction

void function ManageUIAEvents()
if InbosaSDMMso96Dialog()
	oWDUIASpellCheckEvents = Null()
	oWDUIAFindEvents = Null()
	return
endIf
if InMicrosoftEditorProofingPaneIssueChecker()
	oWDUIASpellCheckEvents = Null()
elIf InProofingPaneSpellCheckWithSplitButtons()
	ListenForProofingPaneWithSplitButtonsSpellCheckEvent()
elIf InProofingPaneSpellCheck()
	ListenForProofingPaneSpellCheckEvent()
else
	oWDUIASpellCheckEvents = Null()
endIf
if IsSearchDocumentDialogType()
	ListenForNavigationPaneFindEvent()
else
	oWDUIAFindEvents = Null()
endIf
EndFunction

string Function GetTextfromStatusBarChildren(object element)
var object child = FSUIAGetFirstChildOfElement(element)
if !child return cscNull endIf
var
	string itemText,
	string statusBarText,
	object pattern
;In Word, we must include the text child which has the word count as well as the buttons.
;For buttons, only add text from button text of items that are not toggleable
;or that are both toggleable and are toggled on:
while child
	itemText = cscNull
	if child.name
		if child.controlType == UIA_ButtonControlTypeId
			pattern = child.GetTogglePattern()
			if !pattern
			|| pattern.toggleState == 1
				itemText = child.name
			endIf
		elif child.controlType == UIA_TextControlTypeId
			itemText = child.name
		endIf
	endIf
	if itemText
		statusBarText = statusBarText+cscBufferNewLine+itemText
	endIf
	child = FSUIAGetNextSiblingOfElement(child)
endWhile
return statusBarText
EndFunction

void function ListEnteredEvent(int itemCount, int nestingLevel)
;The itemCount provided by Word is the total number of list items in the document, rather than in the current list.
;Overriding this function to remove announcement of item count until the count provided by Word is fixed.
SayMessage( OT_ANNOUNCE_POSITION_AND_COUNT, cmsgEnteringListNoItemCount);
EndFunction

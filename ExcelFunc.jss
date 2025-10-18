; Copyright 1995-2023 Freedom Scientific, Inc.
;  object and event functions for Microsoft Excel versions later 2016 and O365.

include "HJConst.jsh"
include "HJGlobal.jsh"
include "MagCodes.jsh"
include "MSAAConst.jsh"
include "UIA.jsh"
include "Office.jsh"
include "common.jsm"
include "MSOffice.jsm"
include "excel.jsh"
include "excel.jsm"
include "ExcelBraille.jsh"
include "XLFunc.jsh"

import "touch.jsd"
import "ExcelSettings.jsd"
import "office.jsd"
import "UIA.jsd"

; From say.jsd, importing which causes other problems here.
prototype void function BeginFlashMessage(optional int tiMS)
prototype function xlSheetChangedEvent(optional object oSheet, int isNewWorkbook)

const
	VBTrue = 0xffffffff

;first time variables:
Globals
	handle hWndWorkbook,  ;Each woorkbook will have a different app level window
	int gbExcelFuncRunningFirstTime,
	int GbSaySmartTagActionsTutorHelpFirstTime

;Excel objects and data collections, and saved previous values:
globals
	collection cXLActiveWorkbook,
	object oXLActiveWorkbook,
	string gsPriorActiveWorkbookName,
	collection cXLWorkbookNamedTitles,
	collection cXLActiveSheet,
	object oXLActiveSheet,
	collection cXLCurrentRegion,
	collection cXLRealCurrentRegion,
	collection cXLPriorRegion,
	object oXLCurrentRegion,
	collection cXLCurrentColumn,
	collection cXLCurrentRow,
	collection cXLActiveCell,
	collection cXLPriorActiveCell,
	string gsPriorActiveCellShading,
	string gsPrevFormulaBarRange,
	string gsPrevFormulaBarCellReference,
	object oXLActiveCell,
	collection cXLSelection,
	collection cXLPriorSelection,
	object oXLSelection,
	collection cXLStoredCellAddresses

const
;types of indexes for list processing functions:
	NoIndexType = 0,
	ObjectCollectionIndexType = 1,
	ItemListIndexType = 2,
;types of objects for helper functions:
	RowType = 1,
	ColumnType = 2,
	NoteCommentType = 3,
	VisibleCelltype = 4,
	HyperlinkType = 5,
	ShapeType = 6,
	CellsWithFormulaType = 7,
	CellsAtHPagebreakType = 8,
	CellsAtVPagebreakType = 9,
	WorksheetType = 10,
	SmartTagType = 11,
	ThreadedCommentType = 12,
;for custom summary view:
	CustomSummaryWorkbookNameType = 1,
	CustomSummarySheetNameType = 2,
	CustomSummaryLabelNameType = 3,
	CustomSummaryTextType = 4,
	CustomSummaryAddressType = 5,
;for retrieving messages from functions that handle braille and speech messages:
	SpeechMsgType = 0,
	BrlMsgType = 1

;user buffer windows:
const
	vwn_CustomSummary = "UserBuffer_CustomSummary"

;for protected view mode:
Const
;values for CloseReason parameter in function XLAppEventProtectedViewWindowBeforeClose:
	wdProtectedViewWindowCloseNormal = 0,
	wdProtectedViewWindowCloseEdit = 1,
	wdProtectedViewWindowCloseCrash = 2
globals
	int gbProtectedViewModeActive

;constants for excel border group
;use the following bit values for grouping cell borders:
const
	CellBorder_top = 1,
	CellBorder_Bottom = 2,
	CellBorder_Left = 4,
	CellBorder_Right = 8

;For UIA:
const
	fsUIAStatusBarListenerEventNamePrefix = "UIAStatusBar",
	Activity_ID_Notification_FormulaValue = "Microsoft.Office.Excel.FormulaValueTooltip"
globals
	object XLfsUIA,  ;should exist for the lifetime of Excel, not for specific events
	object fsUIAStatusBarListener,  ;used for events on the status bar
	handle hWndStatusBarAppWindow,  ;used to determine if the app window has changed and thus the status bar listener should change
	int gbListeningToStatusBarPropertyChange,  ;true if listening for the property change of a status bar element which shows the current Excel input mode
	object UIAFocusElement,
	int giFormulaValueNotificationProcessed


;To avoid repeated calls to the DOM, we use the following constants and globals
;to cache information about the focus cell address and the type of item in focus on the spreadsheet:
const
	ExcelItemTypeUnknown = 0,
	ExcelItemTypeCell = 1,
	ExcelItemTypeChart = 2,
	ExcelItemTypeTextBox = 3
globals
	string gsCurrentCellAddress,
	int CurrentExcelSheetItemType


; Excel's defined named titles are ignored on navigation if allow performance impacting features is off.
; We use a global variable to allow retrieving Excel defined named titles on demand when navigation with allow performance impacting features off would not allow their detection.
globals
	int gbSayTitleOnDemand

;For Excel events:
const
;event prefix strings:
	xlAppPrefixString = "XLAppEvent",
;Guids:
	xlAppGuid = "{00024413-0000-0000-C000-000000000046}",
	xlChartGud = "{0002440F-0000-0000-C000-000000000046}",
	xlGuidTypeLib = "{00020813-0000-0000-C000-000000000046}"
globals
	int gbUsingExcelEvents,
	int globalExcelEventsAttached,
	int gbUpdatingWorkbookData

; For handling instances where selection changes fire more than once in the formula bar for a single selection event:
const
	FormulaBarSelectionChangeDuplicateThreshold = 50  ;milliseconds
globals
	int TicksSinceLastSelectionChangeInFormulaBar


void function SetEventUsageType()
gbUsingExcelEvents = GetNonJCFOption("UseExcelEvents")
EndFunction

int function IsUsingExcelEvents()
return gbUsingExcelEvents
EndFunction

int function AreExcelEventsAttached()
return globalExcelEventsAttached
EndFunction

int function AttachXLEvents()
if !IsUsingExcelEvents() return endIf
if globalExcelEventsAttached return true endIf
if onSlicer() then return FALSE endIf
globalExcelEventsAttached = ComAttachEvents(oExcel,xlAppPrefixString,xlAppGuid,xlGuidTypeLib,1,5)
return globalExcelEventsAttached
EndFunction

int function ReAttachXLEvents()
if !IsUsingExcelEvents() return endIf
ComDetachEvents(oExcel)
globalExcelEventsAttached = false
return AttachXLEvents()
EndFunction

void function XLAppEventProtectedViewWindowActivate(object ProtectedViewWindow)
gbProtectedViewModeActive = true
EndFunction

void function XLAppEventProtectedViewWindowDeactivate(object ProtectedViewWindow)
gbProtectedViewModeActive = false
EndFunction

void function XLAppEventProtectedViewWindowBeforeClose(
	object ProtectedViewWindow, int CloseReason, int bCancel)
gbProtectedViewModeActive = false
EndFunction

void function XLAppEventWorkbookActivate()
;fired when a workbook becomes active
if !IsUsingExcelEvents() return endIf
gbUpdatingWorkbookData = true
XLWorkbookActivatedEvent()
gbUpdatingWorkbookData = false
if gbReadSelectedCellsAfterWorkbookDataIsUpdated
	ReadSelectedCells()
EndIf
if !globalExcelEventsAttached 
	;If the events were attached when the startup screen was in focus,
	;not all of the events were actually attached.
	;ComAttachEvents returned false, even though this event did get attached.
	;We need to reattach events when the workbook is in focus to get them all.
	ReAttachXLEvents()
endIf
EndFunction

void function XLAppEventWorkbookDeactivate()
;fired when a workbook becomes inactive
if !IsUsingExcelEvents() return endIf
UIAFocusElement = null ()
gbProtectedViewModeActive = false
NullWorkbookObjectsAndCollections()
EndFunction

void function XLAppEventSheetActivate(object oSheet)
;fires when a worksheet becomes active, except when the workbook becomes active
if !IsUsingExcelEvents() return endIf
xlSheetChangedEvent(oSheet)
XLCellChangedEvent()
EndFunction

void function XLAppEventSheetSelectionChange(object oCell)
;fires when selection changes on a worksheet, but not when selection changes to a different worksheet
if !IsUsingExcelEvents() return endIf
if IsKeyWaiting() return endIf
LastExcelSelectionChangeTime = GetTickCount()
UpdateUIAFocusElementCache ()
if RangesAreIdentical(oXLSelection,oExcel.Selection)
&& RangesAreIdentical(oXLActiveCell,oExcel.activeCell) then
	;Searching forward with find next in the spreadsheet may cause this event to double fire,
	;and selecting range may cause this event to double fire,
	;so we attempt to filter out the second firing:
	return
EndIf
XLCellChangedEvent()
EndFunction

void function XLAppEventSheetChange(object oCell)
;fires when cell content changes
if !IsUsingExcelEvents() return endIf
XLCellChangedEvent()
EndFunction

void function ProtectedViewSheetActivate()
if !IsUsingExcelEvents() return endIf
var
	object oSheet
oSheet = GetActiveSheet()
if oSheet.index == oXLActiveSheet.index
	Delay(5,true)
	oSheet = GetActiveSheet()
EndIf
if oSheet.index != oXLActiveSheet.index
	XLAppEventSheetActivate(oSheet)
EndIf
EndFunction

void function ProtectedViewSheetChange()
if IsKeyWaiting() return endIf
if !IsUsingExcelEvents() return endIf
var
	object oCell
oCell = GetActiveCell()
if RangesAreIdentical(oCell,oXLActiveCell)
	Delay(5,true)
	oCell = GetActiveCell()
EndIf
if !RangesAreIdentical(oCell,oXLActiveCell)
	XLAppEventSheetChange(oCell)
EndIf
EndFunction

void function ProtectedViewSheetSelectionChange()
if !IsUsingExcelEvents() return endIf
var
	object oSelection
UpdateUIAFocusElementCache()
oSelection = GetSelection()
if RangesAreIdentical(oSelection,oXLSelection )
	Delay(5,true)
	oSelection = GetSelection()
EndIf
if !RangesAreIdentical(oSelection,oXLSelection )
	XLAppEventSheetSelectionChange(oSelection)
EndIf
EndFunction

int function ShouldFireProtectedSheetEvent()
return IsUsingExcelEvents()
	&& IsNoSheetEvent()
	&& OnSpreadSheet()
EndFunction

int function IsUpdatingWorkbookData()
return gbUpdatingWorkbookData
EndFunction

void Function Unknown (string TheName, int IsScript, optional int IsDueToRecursion)
if IsDueToRecursion then
	;recursive calls may happen if a function is running,
	;and the excel event fires and calls the function that is already running.
	return
endIf
TheName = StringLower (TheName)
if TheName == "xlappeventworkbookactivate"
	;this typically happens due to timing when opening a new workbook from within Excel,
	;when the function to speak the focus after focus change calls the event function
	;before Excel has actually loaded the new workbook.
	;The Workbook active event should be fired by Excel
	;when the workbook actually does activate.
	 return
EndIf
if theName == "rangesareidentical" then return endIf
If StringContains (theName, scSpellcheck)
	Return
EndIf
; handle case where virtual viewer may still be active but JAWS dialog has focus.
If inHJDialog ()
	EnsureNoUserBufferActive ()
	Return
EndIf
Unknown (TheName, IsScript, IsDueToRecursion)
EndFunction

void function InitializeObjectsForWordEmbeddedWorksheet()
if isAppObjInvalid()
	InitializeOExcel()
	if IsUsingExcelEvents()
		AttachXLEvents()
	endIf
endIf
InitNewCollections()
if IsUsingExcelEvents()
	XLAppEventWorkbookActivate ()
	var object sheet = getActiveSheet ()
	if sheet then
		XLAppEventSheetActivate (sheet)
	endIf
else
	XLWorkbookActivatedEvent()
endIf
endFunction

void function InitializeObjectsWhenReturningToWorksheet()
if !isAppObjInvalid() return endIf
InitializeOExcel()
InitNewCollections()
if IsUsingExcelEvents()
	AttachXLEvents()
	XLAppEventWorkbookActivate ()
else
	XLWorkbookActivatedEvent()
endIf
endFunction

void function ScheduleBrailleRefresh()
if !BrailleInUse() return endIf
if gExcelBrlRefreshID
	unscheduleFunction(gExcelBrlRefreshID)
	gExcelBrlRefreshID=0
endIf
HandleMultilineTableZoomOptions(onSpreadSheet())
gExcelBrlRefreshID=scheduleFunction("BrailleRefresh",3)
EndFunction

void function UpdateUIAFocusElementCache()
UIAFocusElement = null ()
UIAFocusElement = GetUIAFocusElement(XLfsUIA).BuildUpdatedCache()
endFunction

object function getCachedUIAFocusElement()
if ! UIAFocusElement then UIAFocusElement = FSUIAGetFocusedElement () endIf
return UIAFocusElement
endFunction

int function IsActiveWorkBookInitialized()
return !!oXLActiveWorkbook
EndFunction

int function onFormulaBarUIAEditItem ()
; typically after pressing F2 to edit the cell,
; or typing on the spreadsheet and causing focus to move to the cell edit,
; when using alt+equals for autoSum,
; or after typing equals, press arrow keys to select cells as formula.
return getWindowClass (getFocus ()) == wcExcel7 ; spreadsheet
	&& GetObjectAutomationID() == AutomationID_CellEdit
	&& !UserBufferIsActive()
endFunction

int function onSheetTabBar()
; First press of F6 from the work sheet.
return getWindowClass (getFocus ()) == wcExcel7 ; spreadsheet
	&& GetObjectSubtypeCode() == wt_TabControl
	&& !UserBufferIsActive()
endFunction

string function getFocusUIAElementText ()
UpdateUIAFocusElementCache ()
return GetTextFromDocumentRange (UIAFocusElement)
endFunction

int function OnSlicer()
return GetObjectItemType() == msgSlicerPane
|| GetObjectItemType(1) == msgSlicerPane
|| GetObjectItemType(2) == msgSlicerPane
endFunction

void function NullWorkbookObjectsAndCollections()
CollectionRemoveAll(cXLActiveWorkbook)
CollectionRemoveAll(cXLActiveSheet)
CollectionRemoveAll(cXLActiveCell)
CollectionRemoveAll(cXLPriorActiveCell)
CollectionRemoveAll(cXLSelection)
CollectionRemoveAll(cXLPriorSelection)
ComRelease(oXLActiveWorkbook,true)
ComRelease(oXLActiveSheet,true)
ComRelease(oXLCurrentRegion,true)
ComRelease(oXLActiveCell,true)
ComRelease(oXLSelection,true)
EndFunction

void function NullAllObjectsAndReturnToWord ()
NullWorkbookObjectsAndCollections()
ComRelease(oExcel,true)
oExcel = null ()
SwitchToConfiguration ("word")
ScheduleFunction ("ReturnToDocumentFromEmbeddedSpreadsheet", 3)
endFunction

void function enterKey (optional int Cmd)
enterKey (Cmd)
; don't run during Backstage view / startup:
if !isBackStageView (GetFocus ())
	InitializeObjectsWhenReturningToWorksheet()
endIf
endFunction

void function escapeKey ()
escapeKey ()
; don't run during Backstage view / startup:
if !isBackStageView (GetFocus ())
	InitializeObjectsWhenReturningToWorksheet()
endIf
endFunction

int function IsRtlReading(handle hwnd)
; RTL functions are called by JAWS when retrieving a line of text from the OSM to
;determine if that text has right to left reading order.
var
	int result,
	string textCell,
	string strChar
if onFormulaBarUIAEditItem() then
	if giCachedRTLReadingState == xlRTL then
		return TRUE
	endif
else
	let result = oExcel.ActiveCell.ReadOrder
	if result == xlRTL then
		let giCachedRTLReadingState = xlRTL
	elif result == xlLTR then
		let giCachedRTLReadingState = xlLTR
	else ; we are xlContext so now we use the contents of the cell to determine what kind of read order it is.
		; any cell that starts off with an RTL text is by default RTL
		let strChar = SubString(oXLActiveCell.Text,1,1)
		if !IsRtlChar(strChar) then
			let giCachedRTLReadingState = xlLTR
		else
			let giCachedRTLReadingState = xlRTL
		endif
	endif
	return FALSE
EndIf
return result
EndFunction

int  function CheckRTLReadingStatus()
; this function should be called just before a cell is edited and Excel goes into formula mode.
; Once in formula mode it is not possible to get cell information so in this function we determine
; the reading order of the cell and save it in case we need it during the formula mode.
var
	string strChar,
	int xlDirection,
	int charTest
if IsRTLLanguageProcessorLoaded() then
	let xlDirection	= oXLActiveCell.ReadingOrder
	if xlDirection == xlRTL then
		let giCachedRTLReadingState = xlRTL
	elif xlDirection == xlLTR then
		let giCachedRTLReadingState = xlLTR
	else ; we are xlContext so now we use the contents of the cell to determine what kind of read order it is.
		; any cell that starts off with an RTL text is by default RTL
		let strChar = SubString(oXLActiveCell.Text,1,1)
		if !IsRtlChar(strChar) then
			let giCachedRTLReadingState = xlLTR
		else
			let giCachedRTLReadingState = xlRTL
		endif
	endif
endif
endFunction

int function WaitForLoad()
var
	int iTimes
if GetWindowCategory () != WCAT_SPREADSHEET  || onSlicer () then
	return
endIf
let iTimes = 50
while iTimes
&& GetActiveConfiguration()!=GetAppFileName()
  let iTimes = iTimes-1
  if iTimes == 40
  && !giExcelHasRunOnce then
	SayUsingVoice(vctx_message, msgPleaseWait,ot_SMART_HELP)
	EndIf
EndWhile
return GetActiveConfiguration()==GetAppFileName()
EndFunction

object Function InitializeOExcel()
if onSlicer () then return null () endIf
if !oExcel then
	let oExcel = MSOGetMenuBarObject()
	let oExcel = oExcel.Application
	let oExcelCommandBars = oExcel.commandbars(CBFormatting)
endIf
if !oExcel then
	let oExcel = MSOGetMenuBarObject()
	let oExcel = oExcel.Application
EndIf
If !oExcel then
	let oExcel=GetNativeOMFromMSAA().application
endIf
return oExcel
EndFunction

int Function isAppObjInvalid()
if !oExcel then
	return true
else
	return false
EndIf
EndFunction

string function GetExcelVersionString()
return oExcel.version+"."+oExcel.Build
endFunction

string function GetExcelAppName()
return oExcel.name
endFunction

void Function RequestAppCloseEvent()
; A WM_CLOSE message has been sent to Excel. Release the
; application object, on the assumption that the close request
; will succeed. If the user chooses to keep running Excel, the
; next call to GetExcelObject will re-acquire the application
; object.
let oExcel = Null()
globalExcelEventsAttached = false
EndFunction

Void function CloseOfficeAssistant()
var
	object assistant
let assistant = oExcel.assistant
if !assistant.visible then
	SayMessage(ot_error,msgOfficeAssistantNotVisible_l,msgOfficeAssistantNotVisible_S)
	return
endIf
let assistant.visible = false
if !assistant.visible then
	SayMessage(ot_smart_help,msgOfficeAssistantClosed_l,cmsgClosed)
else ; couldn't be cloased
	SayMessage(ot_error,msgOfficeAssistantCannotClose_l,msgOfficeAssistantCannotClose_s)
endIf
EndFunction

void Function AutoStartEvent()
SetEventUsageType()
var
	handle AppSisterWindow
if gbExcelFuncRunningFirstTime then
	GbSaySmartTagActionsTutorHelpFirstTime = true
	hWndWorkBook = GetAppMainWindow(GetFocus())
EndIf
;If SDM dialog is present, we must make sure that we have focus on that window instead of the worksheet:
AppSisterWindow = GetPriorWindow(GetAppMainWindow(GetFocus()))
if StringContains(GetWindowClass(AppSisterWindow),wc_sdm)
&& GetFocus() != AppSisterWindow then
	SetFocus(AppSisterWindow)
EndIf
if !oExcel 
; don't run during Backstage view / startup:
&& ! isBackStageView (GetFocus ()) then
	WaitForLoad()
	InitializeOExcel()
EndIf
InitNewCollections()
if IsUsingExcelEvents()
	AttachXLEvents()
else
	XLAppEventWorkbookActivate()
endIf
XLfsUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
EndFunction

void function UnloadAllExcelObjectsData ()
CollectionRemoveAll(cXLActiveWorkbook)
CollectionRemoveAll(cXLActiveSheet)
CollectionRemoveAll(cXLActiveCell)
CollectionRemoveAll(cXLPriorActiveCell)
CollectionRemoveAll(cXLSelection)
CollectionRemoveAll(cXLPriorSelection)
ComRelease(oXLActiveWorkbook,true)
ComRelease(oXLActiveSheet,true)
ComRelease(oXLCurrentRegion,true)
ComRelease(oXLActiveCell,true)
ComRelease(oXLSelection,true)
ComRelease(oExcel,true)
endFunction

void function AutoFinishEvent()
globalExcelEventsAttached = FALSE
gsCurrentCellAddress = cscNull
CurrentExcelSheetItemType = ExcelItemTypeUnknown
UnloadAllExcelObjectsData ()
UIAFocusElement = null ()
fsUIAStatusBarListener = Null()
XLfsUIA = null ()
gbListeningToStatusBarPropertyChange = false
hWndWorkBook  = Null()
EndFunction

object function GetCurrentRegionOfCell(object oCell)
;The DOM call to get a cell's currentRegion causes a focus change, so ignore it:
IgnoreNextFocusChange()
var object o = oCell.currentRegion
StopIgnoringNextFocusChange()
return o
EndFunction

object function GetActiveCellCurrentRegion()
;The DOM call to activeCell.currentRegion causes a focus change, so ignore it:
return GetCurrentRegionOfCell(oXLActiveCell)
EndFunction

void function UpdateRealCurrentRegionData()
var	object oRegion = GetActiveCellCurrentRegion()
let cXLRealCurrentRegion.topLeft = oRegion.cells(1).addressLocal(false,false)
let cXLRealCurrentRegion.bottomRight = oRegion.cells(oRegion.cells.count).addressLocal(false,false)
endFunction

void function QuickSettingsPreProcess ()
;make sure that Quick Setting has access to the current region data,
;so that multiple region support has current information:
UpdateRealCurrentRegionData()
if IsUsingExcelEvents()
	ComDetachEvents(oExcel)
endIf
QuickSettingsPreProcess ()
endFunction

void function QuickSettingsPostprocess ()
ComRelease (oExcel)
oExcel = null()
globalExcelEventsAttached = false
InitializeOExcel()
if IsUsingExcelEvents()
	AttachXLEvents()
endIf
QuickSettingsPostprocess()
endFunction

void function InitNewCollections()
if !cXLActiveWorkbook then
	let cXLActiveWorkbook = new collection
EndIf
if !cXLWorkbookNamedTitles then
	let cXLWorkbookNamedTitles = new collection
EndIf
if !cXLActiveSheet then
	let cXLActiveSheet = new collection
EndIf
if !cXLCurrentRegion then
	let cXLCurrentRegion = new collection
EndIf
if !cXLRealCurrentRegion then
	let cXLRealCurrentRegion = new collection
EndIf
if !cXLPriorRegion then
	let cXLPriorRegion = new collection
EndIf
if !cXLCurrentColumn then
	let cXLCurrentColumn = new collection
EndIf
if !cXLCurrentRow then
	let cXLCurrentRow = new collection
EndIf
if !cXLActiveCell then
	let cXLActiveCell = new collection
EndIf
if !cXLPriorActiveCell then
	let cXLPriorActiveCell = new collection
EndIf
if !cXLSelection then
	let cXLSelection = new collection
EndIf
if !cXLPriorSelection then
	let cXLPriorSelection = new collection
EndIf
if !cXLStoredCellAddresses then
	let cXLStoredCellAddresses = new collection
EndIf
EndFunction

int function IsNoSheetEvent()
return gbProtectedViewModeActive || IsSheetTypeMacro()
EndFunction

int function IsSheetTypeMacro()
var int type = oExcel.activeSheet.Type
return type == xlExcel4MacroSheet
	|| type == xlExcel4IntlMacroSheet
EndFunction

int function IsWorkbookInProtectedViewMode()
return oExcel.ActiveProtectedViewWindow.workbook.Application.IsSandboxed == VBTrue
EndFunction

object function GetActiveWorkbook()
var	object oWorkbook
if !gbProtectedViewModeActive
	oWorkbook = oExcel.ActiveWorkbook
else
	oWorkbook = oExcel.ActiveProtectedViewWindow.workbook
EndIf
return oWorkbook
EndFunction

object function GetActiveSheet()
var	object oSheet
if !gbProtectedViewModeActive
	oSheet = oExcel.ActiveSheet
else
	oSheet = oExcel.ActiveProtectedViewWindow.workbook.activeSheet
EndIf
return oSheet
EndFunction

object function GetActiveCell()
var object oCell
if !gbProtectedViewModeActive
	oCell = oExcel.ActiveCell
else
	oCell = oExcel.ActiveProtectedViewWindow.workbook.application.activeCell
EndIf
/*;debug:
if !oCell
&& oExcel
	;On some complicated sheets, part of the DOM path is temporarily null.
	;Try a few times to see if it becomes available:
	var int i
	for i = 1 to 10
		PauseFor(100)
		if !gbProtectedViewModeActive
			oCell = oExcel.ActiveCell
		else
			oCell = oExcel.ActiveProtectedViewWindow.workbook.application.activeCell
		EndIf
		if oCell return oCell endIf
	endFor
endIf
*/
return oCell
EndFunction

object function getCurrentSelection()
return oXLSelection
EndFunction

object function GetSelection()
var	object oSelection
if !gbProtectedViewModeActive
	oSelection = oExcel.selection
else
	oSelection = oExcel.ActiveProtectedViewWindow.workbook.application.selection
EndIf
return oSelection
EndFunction

object function FindStatusBarModeElement()
var object element = FSUIAGetElementFromHandle(GetAppMainWindow(GetFocus()))
if !element return Null() endIf
var object condition = XLfsUIA.createIntPropertyCondition(UIA_ControlTypePropertyId,UIA_StatusBarControlTypeId)
element = element.FindFirst(TreeScope_Descendants,condition)
if !element return Null() endIf
condition = XLfsUIA.createStringPropertyCondition(UIA_ClassNamePropertyId,UIAClass_NetUISimpleButton)
return element.FindFirst(TreeScope_Children,condition)
EndFunction

object function findStatusBarButtons ()
var object element = FSUIAGetElementFromHandle(GetAppMainWindow(GetFocus()))
if !element return Null() endIf
var object condition = XLfsUIA.createIntPropertyCondition(UIA_ControlTypePropertyId,UIA_StatusBarControlTypeId)
if ! condition return null () endIf
element = element.FindFirst(TreeScope_Descendants,condition)
if !element return Null() endIf
var object SimpleButtonCondition = XLfsUIA.createStringPropertyCondition(UIA_ClassNamePropertyId,UIAClass_NetUISimpleButton)
if ! SimpleButtonCondition return null () endIf
; Many of the buttons will show up as keyboard not focusable, using FindAll,
; even if the Touch Cursor Advanced mode inspection shows them as visible.
; since this function is only used by the SayBottomLineOfWindow script, it's important to speak them all.
; var object KeyboardNotVisibleCondition = 	XLfsUIA.createBoolPropertyCondition(UIA_IsKeyboardFocusablePropertyId,0)
; if ! KeyboardNotVisibleCondition return null () endIf
; condition = XLfsUIA.CreateAndCondition (SimpleButtonCondition, KeyboardNotVisibleCondition)
condition = SimpleButtonCondition
if ! condition return null () endIf
return element.FindAll(TreeScope_Children,condition)
endFunction

object function FindFormulaBarElement()
var handle hWnd = GetAppMainWindow(GetFocus())
hWnd = FindWindow(hWnd,wcExcelLess)
if !hWnd return Null() endIf
var object element = FSUIAGetElementFromHandle(hWnd)
if !element return Null() endIf
var object condition = XLfsUIA.createStringPropertyCondition(UIA_AutomationIdPropertyId,AutomationID_FormulaBar)
return element.FindFirst(TreeScope_Subtree,condition)
EndFunction

void function CaretMovedEvent( int movementUnit,optional int source)
if (Excel_StatusBar_Mode == Excel_status_point)
	return;eliminate spurious speech when constructing formulas
endIf
CaretMovedEvent( movementUnit,source)
endFunction

void function SelectionChangedEvent( string text, int wasTextSelected, optional int source )
if GetWindowClass (GetFocus()) != wcExcel7
	return SelectionChangedEvent( text, wasTextSelected, source )
endIf
if Excel_StatusBar_Mode == Excel_status_point
	SayCoordinatesAndContentForEditingCellFormula(text)
	return
elif Excel_StatusBar_Mode == Excel_status_ready
&& GetObjectAutomationID() == AutomationID_CellEdit
	; This happens when the status bar mode changes to Enter just before focus moves to the formula bar.
	; the status bar mode is changing from ready to enter, but this event runs before the status bar mode is updated.
	; Using the automationID prevents short-circuiting selection for other types of items such as legacy notes.
	return
elif Excel_StatusBar_Mode == Excel_status_enter
	; The autocomplete occurs because the user backspaced to remove the original autocomplete which happened when switching from ready to enter mode,
	; and another auto complete occurs because more characters were typedin.
	; We get two selection events in rapid succession, so we attempt to determine if this one is a duplication of a previous one.
	var
		int currentTickCount = GetTickCount(),
		int elapsedTicks =  currentTickCount - TicksSinceLastSelectionChangeInFormulaBar 
	TicksSinceLastSelectionChangeInFormulaBar = currentTickCount
	if elapsedTicks< FormulaBarSelectionChangeDuplicateThreshold
		return
	endIf
endIf
SelectionChangedEvent( text, wasTextSelected, source )
endFunction

void function EnsureListeningForModeChangeOnStatusBar()
var handle appWindow = GetAppMainWindow(GetFocus())
if gbListeningToStatusBarPropertyChange
&& hWndStatusBarAppWindow == appWindow
	return
endIf
Excel_StatusBar_Mode = Excel_status_unknown  ;we will not know the mode until we get the element on the status bar showing it.
hWndStatusBarAppWindow = appWindow
fsUIAStatusBarListener = Null()
fsUIAStatusBarListener = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !fsUIAStatusBarListener 
|| !ComAttachEvents (fsUIAStatusBarListener,fsUIAStatusBarListenerEventNamePrefix)
	return
endIf
var object element = FindStatusBarModeElement()
if !element return endIf
if !fsUIAStatusBarListener.AddPropertyChangedEventHandler(UIA_NamePropertyId, 		element, Treescope_element) return endIf
gbListeningToStatusBarPropertyChange = true
UpdateStatusBarMode(element.name)
EndFunction

void function UIAStatusBarPropertyChangedEvent(object element, int propertyID, variant newValue)
UpdateStatusBarMode(element.name)
EndFunction

void function UIANotificationEvent(int notificationKind, int notificationProcessing, string displayString, string activityId, string appName)
if activityId == "Microsoft.Office.Excel.UISurfaced.OnObjectUI"
	Say(displayString,OT_TOOL_TIP)
	return
EndIf
if notificationKind == NotificationKind_Other
&& activityId == Activity_ID_Notification_FormulaValue
&& !IsTouchCursor ()
&& !UserBufferIsActive ()
&& !giFormulaValueNotificationProcessed
	var
		int iIndex = StringContains (displayString, cscColon),
		int iPointModeVerbosity = GetNonJCFOption("PointModeVerbosity")
	gsFormulaValueForFormulaBar = stringChopLeft (displayString, iIndex)
	BrailleRefresh ()
	if iPointModeVerbosity == PointModeVerbosity_FormulaValue
	|| iPointModeVerbosity == PointModeVerbosity_CellContentAndFormulaValue
		Say(displayString, OT_SCREEN_MESSAGE)
	endIf
	giFormulaValueNotificationProcessed = true
	return
endIf
UIANotificationEvent(notificationKind, notificationProcessing, displayString, activityId, appName)
endFunction

int Function Pow(int base, int exponent)
if exponent < 0
	;Negative exponents not supported in scripts
	return Null()
elIf exponent == 0
	return 1
elIf exponent == 1
	return base
else
	var
		int iResult = 1,
		int i
	for i = 1 to exponent
		iResult = iResult * base
	endFor
	return iResult
endIf
EndFunction

int Function hexavigesimalToDec(string s)
if !StringIsAlpha (s) return cscNull endIf
var
	int iCharValue,
	int i,
	int iResult
s = StringUpper (s)
s = StringReverse (s)
for i = 1 to StringLength(s)
	iCharValue = GetCharacterValue (SubString (s, i, 1))-64
	iResult = iResult + (iCharValue*Pow(26, i-1))
endFor
return iResult
EndFunction

string Function ConvertA1ToR1C1(string sA1)
sA1 = StringRemoveNonAlphanumericChars(sA1)
var
	string sColumn = StringRemoveNumericChars(sA1),
	string sRow = stringChopLeft (sA1, StringLength (sColumn))
sColumn = IntToString (hexavigesimalToDec(sColumn))
sColumn = scR1C1_C + sColumn
sRow = scR1C1_R + sRow
return sRow + sColumn
EndFunction

string Function ConvertRelativeR1C1ToAbsolute(string sReference, string sRelativeTo)
var
	string sRowReference = StringSegment (sReference, scR1C1_C, 1),
	string sColumnReference = stringChopLeft (sReference, StringLength(sRowReference)),
	int iRowReference = StringToInt (StringRemoveNonNumericChars(sRowReference)),
	int iColumnReference = StringToInt (StringRemoveNonNumericChars(sColumnReference)),
	string sRelativeToRowReference = StringSegment (sRelativeTo, scR1C1_C, 1),
	string sColumnRelativeToReference = stringChopLeft (sRelativeTo, StringLength(sRelativeToRowReference)),
	int iRelativeToRowReference = StringToInt (StringRemoveNonNumericChars(sRelativeToRowReference)),
	int iColumnRelativeToReference = StringToInt (StringRemoveNonNumericChars(sColumnRelativeToReference))
if StringContains (sRowReference, scNegative)
	iRowReference = iRelativeToRowReference - iRowReference
else
	iRowReference = iRelativeToRowReference + iRowReference
endIf
if StringContains (sColumnReference, scNegative)
	iColumnReference = iColumnRelativeToReference - iColumnReference
else
	iColumnReference = iColumnRelativeToReference + iColumnReference
endIf
if iRowReference < 1
	iRowReference = iRowReference + xlMaxRows
endIf
if iColumnReference < 1
	iColumnReference = iColumnReference + xlMaxColumns
endIf
return FormatString (msgR1C1, IntToString (iRowReference), IntToString (iColumnReference))
EndFunction

String Function GetCellTextFromReference (string sReference)
if cXLActiveWorkbook.ReferenceStyle != xlA1
	var string sRelativeTo = ConvertA1ToR1C1(cXLActiveCell.address)
	sReference = ConvertRelativeR1C1ToAbsolute(sReference, sRelativeTo)
endIf
var
	object oAutomationCondition = FSUIACreateStringPropertyCondition (UIA_AutomationIDPropertyID, sReference),
	object oRoot = FSUIAGetNextSiblingOfElement (FSUIAGetFocusedElement ()),
	object oCell = oRoot.findFirst(TreeScope_Descendants, oAutomationCondition)
return GetTextFromDocumentRange (oCell)
EndFunction

int Function IsValidR1C1Reference(string sReference)
if cXLActiveWorkbook.ReferenceStyle == xlA1
	return false
endIf
if StringIsBlank (sReference)
|| !StringStartsWith (sReference, scR1C1_R, true);must start with row reference
|| !StringContains (sReference, scR1C1_C);must contain a column reference
	return false
endIf
var
	string sRowReference = StringSegment (sReference, scR1C1_C, 1),
	string sColumnReference = stringChopLeft (sReference, StringLength(sRowReference)),
	int iRowReference = StringToInt (StringRemoveNonNumericChars(sRowReference)),
	int iColumnReference = StringToInt (StringRemoveNonNumericChars(sColumnReference))
sRowReference = stringChopLeft (sRowReference, StringLength (scR1C1_R));Remove "R"
sColumnReference = stringChopLeft (sColumnReference, StringLength (scR1C1_C));Remove "C"
sRowReference = StringRemoveNumericChars(sRowReference)
sColumnReference = StringRemoveNumericChars(sColumnReference)
if (!StringIsPunctuation (sRowReference) && sRowReference)
|| (!StringIsPunctuation (sColumnReference) && sColumnReference)
	;after removing "R" and "C" and any numbers,
	;there should only be punctuation or a null string remaining.
	;If any alpha chars remain, it is not a valid reference.
	return false
endIf
if iRowReference > xlMaxRows
|| iColumnReference > xlMaxColumns
	return false
endIf
return true
EndFunction

String Function ExtractA1ReferenceFromEndOfString (string s)
if cXLActiveWorkbook.ReferenceStyle != xlA1
	return cscNull
endIf
var
	int iLength = StringLength (s),
	int iNumericLength = 1
if !StringIsNumeric(StringRight (s, iNumericLength));not a valid reference
	return cscNull
endIf
While StringIsNumeric (StringRight (s, iNumericLength + 1))
	iNumericLength = iNumericLength + 1
EndWhile
if iNumericLength > 7 return cscNull endIf
var
	int iIndex = iLength - iNumericLength,
	int iAlphaLength = 1
if !StringIsAlpha (SubString (s, iIndex, iAlphaLength)) return cscNull endIf
While StringIsAlpha (SubString (s, iIndex - 1, iAlphaLength + 1))
	iAlphaLength = iAlphaLength + 1
	iIndex = iIndex - 1
EndWhile
if iAlphaLength > 3 return cscNull endIf
return StringRight (s, iAlphaLength + iNumericLength)
EndFunction

String Function ExtractR1C1ReferenceFromEndOfString (string s)
if cXLActiveWorkbook.ReferenceStyle == xlA1
	return cscNull
endIf
var
	int iLength = StringLength (s),
	string sReference
sReference = StringSegment (s, scR1C1_R, -1)
sReference =  scR1C1_R + sReference
if !IsValidR1C1Reference(sReference)
	return cscNull
endIf
return sReference
EndFunction

String Function ExtractCellReferenceFromEndOfString (string s)
if cXLActiveWorkbook.ReferenceStyle == xlA1
	return ExtractA1ReferenceFromEndOfString (s)
else
	return ExtractR1C1ReferenceFromEndOfString (s)
endIf
EndFunction

int Function ShouldUseBeginningOfRange(string sText)
if StringSegmentCount (sText, cScColon) != 2
	;Not a range
	gsPrevFormulaBarRange = sText
	return false
endIf
var
	string sLastScript = GetScriptAssignedTo (GetCurrentScriptKeyName ()),
	string sRangeBeginning = StringSegment (sText, cScColon, 1),
	string sPrevRangeBeginning
if StringSegmentCount (gsPrevFormulaBarRange, cScColon) == 2
	sPrevRangeBeginning = StringSegment (gsPrevFormulaBarRange, cScColon, 1)
else
	;This is the first time the selection is being extended into a range.
	;Although there was technically no previous range,
	;Go ahead and set sPrevRangeBeginning to what was the previous cell
	;so it can be used in comparisons below to determine if cells are being selected or unselected
	sPrevRangeBeginning = gsPrevFormulaBarRange
endIf
gsPrevFormulaBarRange = sText
if (StringStartsWith (sLastScript, "SelectPrior")
|| StringStartsWith (sLastScript, "SelectToBeginning"))
&& sRangeBeginning < sPrevRangeBeginning
	return true
endIf
if (StringStartsWith (sLastScript, "SelectNext")
|| StringStartsWith (sLastScript, "SelectToEnd"))
&& sRangeBeginning > sPrevRangeBeginning
	return true
endIf
return false
EndFunction

void Function SayEditingCellFormula(optional object element)
Var	Int iPunctLevel = GetJCFOption (OPT_PUNCTUATION)
if (!element) element = FindFormulaBarElement() endIf
if !element return endIf
if element.controlType != UIA_EditControlTypeID return endIf
var string text = GetTextFromDocumentRange(element)
if !text text = cmsgBlank1 endIf
SetJCFOption (OPT_PUNCTUATION, 3) ; all
Say(text,ot_line)
SetJCFOption (OPT_PUNCTUATION, iPunctLevel)	; user setting
EndFunction

void Function SayCoordinatesAndContentForEditingCellFormula(string text)
text = smmStripMarkup (text)
if !text text = cmsgBlank1 endIf
gsCellContentForFormulaBar = cscNull
gsFormulaValueForFormulaBar = cscNull
giFormulaValueNotificationProcessed = false
if (Excel_StatusBar_Mode == Excel_status_point)
&& FocusChangeTriggeredByUserNavigation()
	Var
		Int iPunctLevel = GetJCFOption (OPT_PUNCTUATION),
		int iPointModeVerbosity = GetNonJCFOption("PointModeVerbosity"),
		string sSelectedText = GetSelectedText(),
		string sCellReference
	if ShouldUseBeginningOfRange(sSelectedText)
		sCellReference = StringSegment (sSelectedText, cScColon, 1)
	else
		sCellReference = ExtractCellReferenceFromEndOfString (text)
	endIf
	if sCellReference == gsPrevFormulaBarCellReference
		return
	endIf
	SetJCFOption (OPT_PUNCTUATION, 3) ; all
	Say(sCellReference,ot_line)
	gsPrevFormulaBarCellReference = sCellReference
	gsCellContentForFormulaBar = GetCellTextFromReference (sCellReference)
	if iPointModeVerbosity == PointModeVerbosity_CellContent
	|| iPointModeVerbosity == PointModeVerbosity_CellContentAndFormulaValue
		Say(gsCellContentForFormulaBar, OT_LINE)
	endIf
	SetJCFOption (OPT_PUNCTUATION, iPunctLevel)	; user setting
endIf
EndFunction

Void Function SecondaryFocusDeactivatedEvent()
SecondaryFocusDeactivatedEvent()
EndFunction

int function ShouldIgnoreSaySecondaryFocusSelectedItem()
return GetObjectValue() == scEquals
|| ShouldIgnoreSaySecondaryFocusSelectedItem()
endFunction

void function XLWorkbookActivatedEvent()
InitializeSettings()
gbProtectedViewModeActive = IsWorkbookInProtectedViewMode()
oXLActiveWorkbook = GetActiveWorkbook()
if !oXLActiveWorkbook
	return
endIf
PrepCommandBarsForUseInWindows10 () ; for speaking of formatting state changes.
EnsureListeningForModeChangeOnStatusBar()
UpdateCXLActiveWorkbook()
var
	handle hAppWnd,
	int bNewWorkbook
hAppWnd = GetAppMainWindow(GetFocus())
bNewWorkbook =	hAppWnd != hWndWorkBook
	|| StringCompare(cXLActiveWorkbook.name,gsPriorActiveWorkbookName) != 0
hWndWorkBook = hAppWnd
gsPriorActiveWorkbookName = cXLActiveWorkbook.name
;Unconditionally fire the xlSheetChangedEvent so that the sheet is announced regardless of which events are used:
xlSheetChangedEvent(Null(),bNewWorkbook)
EndFunction

globals
	string prevLiveRegionMessage
void function OfficeLiveRegionChangedEvent(object element)
; This is a very infrequent event in Microsoft Office.
; It handles toasts from within Office applications,
; notifications that appear above the document but below the ribbons.
; Although they are not technically system toasts, Microsoft treats them as such, and so should we.
; Notably when doing real-time co-authoring and collaboration in documents.
if stringIsBlank (element.name) then return endIf
var string message = stringTrimLeadingBlanks (stringTrimTrailingBlanks (element.name))
if message != prevLiveRegionMessage
	if element.automationId == "SheetTab"
		;The new sheet notification should not be treated as a toast:
		SayMessage(ot_line, element.name)
		if ObjectCountDetection()
			SayNumberOfEmbeddedWorksheetObjects()
		EndIf
	else ;not a new sheet notification:
		SayMessage(ot_toasts, element.name)
	endIf
endIf
prevLiveRegionMessage = message
endFunction

void function xlSheetChangedEvent(optional object oSheet, int isNewWorkbook)
if !oSheet
	oXLActiveSheet = GetActiveSheet()
else
	oXLActiveSheet = oSheet
endIf
UpdateCXLActiveSheet()
gCurrentSheetID = getActiveSheetName()
;If OfficeLiveRegionChangedEvent is firing because the sheet changed,
;the itemStatus has already been spoken.
if isNewWorkbook
	Say(cXLActiveSheet.name,ot_dialog_name)
	if ObjectCountDetection()
		SayNumberOfEmbeddedWorksheetObjects()
	EndIf
endIf
SaySheetData()
SaySelectedRangeIfMultipleCellsAreSelected()
EndFunction

void function SaySelectedRangeIfMultipleCellsAreSelected()
;To say 'selected range' if the sheet has multiple cells selected:
var string sStart, string sEnd
GetSelectionAddressRange (sStart, sEnd)
if (stringCompare (sStart, sEnd) != 0)
	sayMessage (OT_SELECT,msgSelectedRange)
endIf
EndFunction

void function XLSelectionChangedEvent()
if IsKeyWaiting() return endIf
var object oSelection = GetSelection()
if RangesAreIdentical(oSelection,oXLSelection )
	Delay(5,true)
	oSelection = GetSelection()
EndIf
if RangesAreIdentical(oSelection,oXLSelection ) return endIf
oXLActiveCell = GetActiveCell()
UpdateCXLActiveCell()
oXLSelection = oSelection
UpdateCXLSelection()
DetectAndUpdateRegionChange()
UpdateCXLActiveCellTitles()
ScheduleBrailleRefresh()
if (cXLSelection.cellCount > 1 && !cXLActiveCell.mergeCells)
|| cXLSelection.areaCount > 1
	readModifiedSelection(GetSelectionDirection())
	return
EndIf
ReadSelectedCells()
EndFunction

void function XLCellChangedEvent()
if IsKeyWaiting() return endIf
oXLActiveCell = GetActiveCell()
UpdateCXLActiveCell()
oXLSelection = GetSelection()
UpdateCXLSelection()
DetectAndUpdateRegionChange()
UpdateCXLActiveCellTitles()
ScheduleBrailleRefresh()
if (cXLSelection.cellCount > 1 && !cXLActiveCell.mergeCells)
|| cXLSelection.areaCount > 1 then
	readModifiedSelection(GetSelectionDirection())
	return
EndIf
ReadSelectedCells()
EndFunction

void Function PrepCommandBarsForUseInWindows10 ()
var
	int state
; Windows 10 will get the button state backwards the first time if the commandBars object doesn't get initialized for the workbook.
;in case it missed initialization:
if !IsWindows10 () then return endIf
if !oExcelCommandBars then
	oExcelCommandBars = oExcel.commandbars(CBFormatting)
endIf
state = oExcelCommandBars.controls(btnBold).state
EndFunction

void function UpdateCXLActiveWorkbook()
var
	collection c,
	int bWorkbookNameUpdated,
	string sExtraInfo ; for read-only or other state info
if oXLActiveWorkbook.name != CXLActiveWorkbook.name then
	cXLActiveWorkbook.name = oXLActiveWorkbook.name
	bWorkbookNameUpdated = true
EndIf
if StringCompare(cXLStoredCellAddresses.Workbook,cXLActiveWorkbook.name) != 0 then
	CollectionRemoveItem(cXLStoredCellAddresses,"sheets")
	cXLStoredCellAddresses.Workbook = cXLActiveWorkbook.name
	c = new collection
	cXLStoredCellAddresses.sheets = c
EndIf
if bWorkbookNameUpdated
&& !GlobalWasHJDialog then
	Say(cXLActiveWorkbook.name,OT_DOCUMENT_NAME)
	; Now get any extra info from the title bar, such as read-only:
	sExtraInfo = StringReplaceSubStrings (GetWindowName (GetAppMainWindow (GetFocus ())), cXLActiveWorkbook.name, LIST_ITEM_SEPARATOR)
	sExtraInfo = StringSegment (sExtraInfo, LIST_ITEM_SEPARATOR, 2)
	sayMessage (OT_DOCUMENT_NAME, sExtraInfo)
EndIf
cXLActiveWorkbook.sheetCount = oXLActiveWorkbook.workSheets.count
UpdateWorkbookPointer()
UpdateCXLWorkbookNamedTitles()
cXLActiveWorkbook.ReferenceStyle = oExcel.ReferenceStyle
EndFunction

void function UpdateCXLWorkbookNamedTitles()
CollectionRemoveAll(cXLWorkbookNamedTitles)
if !AllowPerformanceImpactingFeatures() && !gbSayTitleOnDemand return endIf
var
	object oNames,
	string sName,
	int iTypeOfTitle,
	string sTitleReading,
	int count,
	int i,
	int n,
	collection cName,
	variantArray names,
	variant nameVariant,
	collection nameProperties,
	int bulkFetchSucceeded, int propertiesFetchSucceeded ; whether to operate using fetched data or round trip.
oNames = oXLActiveWorkbook.names
count = oNames.count
if count == 0 return EndIf
; The names count ceiling is configurable manually in Excel.jcf,
; nonJCFOptions > ExcelNamesCeiling.
; Increasing the threshold means some spreadsheets won't load as quickly.
; decreasing the threshold may mean titles will not read automatically if provided by the names manager.
; In cases where number of names approaches or exceeds the ceiling,
; the names were usually implemented automatically and are not used for JAWS title reading support.
if count >= getExcelNamesCeiling () return endIf
n = 1
bulkFetchSucceeded = FetchCollectionProperty(oNames, "Item", 1, count, "Name", names)
for i = 1 to count
	if bulkFetchSucceeded
		nameVariant = names[i]
		if GetVariantType(nameVariant) == VT_STRING
			sName = nameVariant
		endIf
	else
		sName = oNames(i).name
	endIf
	if IsNamedRegionTitleString(sName,iTypeOfTitle)
		propertiesFetchSucceeded = FetchObjectProperties(oNames(i), nameProperties)
		cName = new collection
		cName.name = sName
		sTitleReading = StringLower(StringSegment(sName,".1234567890",1))
		cName.titleReading = iTypeOfTitle
		if propertiesFetchSucceeded
			cName.sheetName = nameProperties.refersToRange.parent.name
		else
			cName.sheetName = oNames(i).refersToRange.parent.name
		endIf
		; correct where there is extra white space at end or start of this name, causing subsequent checks to fail:
		cName.sheetName = StringTrimLeadingBlanks (StringTrimTrailingBlanks (cName.sheetName))
		if propertiesFetchSucceeded
			cName.rangeStart = nameProperties.refersToRange.addressLocal(false,false)
			cName.rangeRowStart = nameProperties.refersToRange.row
			cName.rangeColumnStart = nameProperties.refersToRange.column
		else
			cName.rangeStart = oNames(i).refersToRange.addressLocal(false,false)
			cName.rangeRowStart = oNames(i).refersToRange.row
			cName.rangeColumnStart = oNames(i).refersToRange.column
		endIf
		cName.rangeEnd = StringSegment(cName.name,".",3)
		if cName.rangeEnd
			cName.rangeRowEnd = GetRowNumberFromAddress(cName.rangeEnd)
			cName.rangeColumnEnd = GetColumnNumberFromAddress(cName.rangeEnd)
		else
			cName.rangeRowEnd = 0
			cName.rangeColumnEnd = 0
		EndIf
		if cName.titleReading & ReadColumnTitles
			cName.titleRowStart = cName.rangeRowStart
			if propertiesFetchSucceeded
				cName.titleRowEnd = cName.titleRowStart
					+ nameProperties.refersToRange.rows.count - 1
			else
				cName.titleRowEnd = cName.titleRowStart
					+ oNames(i).refersToRange.rows.count - 1
			endIf	
		EndIf
		if cName.titleReading & ReadRowTitles
			cName.titleColumnStart = cName.rangeColumnStart
			if propertiesFetchSucceeded
				cName.titleColumnEnd = cName.titleColumnStart
					+ nameProperties.refersToRange.columns.count - 1
			else
				cName.titleColumnEnd = cName.titleColumnStart
					+ oNames(i).refersToRange.columns.count - 1
			endIf	
		EndIf
		cXLWorkbookNamedTitles[IntToString(n)] = cName
		n = n+1
	EndIf
EndFor
EndFunction

int function CountNumOfNamedTitleRegionsOnActiveSheet()
if !AllowPerformanceImpactingFeatures() return 0 endIf
var
	string key,
	int n
ForEach key in cXLWorkbookNamedTitles
	if StringCompare(cXLWorkbookNamedTitles[key].sheetName,cXLActiveSheet.name) == 0 then
		let n = n+1
	EndIf
EndForEach
return n
EndFunction

int function NumOfNamedTitleRegionsOnCXLActiveSheet()
if !AllowPerformanceImpactingFeatures() return 0 endIf
return cXLActiveSheet.namedTitleRegionCount
EndFunction

void function UpdateCXLActiveSheet()
cXLActiveSheet.name = StringTrimLeadingBlanks (StringTrimTrailingBlanks(oXLActiveSheet.name))
cXLActiveSheet.codeName = oXLActiveSheet.codeName
cXLActiveSheet.index = oXLActiveSheet.index
cXLActiveSheet.autoFilterMode = (oXLActiveSheet.AutoFilterMode)*-1
cXLActiveSheet.commentCount = oXLActiveSheet.comments.count + oXLActiveSheet.CommentsThreaded.count
cXLActiveSheet.shapeCound = oXLActiveSheet.shapes.count
cXLActiveSheet.hyperlinkCount = oXLActiveSheet.hyperlinks.count
cXLActiveSheet.smartTagCount = oXLActiveSheet.SmartTags.Count
cXLActiveSheet.namedTitleRegionCount = CountNumOfNamedTitleRegionsOnActiveSheet()
UpdateWorksheetPointer()
oXLActiveCell = GetActiveCell()
UpdateCXLActiveCell()
UpdateCXLCurrentRegion()
UpdateCXLActiveCellTitles()
oXLSelection = GetSelection()
UpdateCXLSelection()
EndFunction

string function GetActiveNamedTitlesRegionUsedRangeEndAddress(int iNamedRegion)
var
	object o,
	int count
o = GetCurrentRegionOfCell(oXLActiveSheet.range(cXLWorkbookNamedTitles[IntToString(iNamedRegion)].rangeStart))
let count = o.cells.count
return o.cells(count).addressLocal(false,false)
EndFunction

void function GetRowUsedStartAndEndPoints(string sRow, int iCellColumn,
	int byRef iStart, int byRef iEnd)
var
	object oRange
let oRange = oXLActiveSheet.range("a"+sRow)
if oRange.text then
	let iStart = 1
else
	let iStart = oRange.End(xlToRight).column
EndIf
let iEnd = oXLActiveSheet.range("IV"+sRow).End(xlToLeft).column
;start will be greater than end if the row is blank:
if iStart > iEnd
|| iCellColumn < iStart then
	let iStart = iCellColumn
	let iEnd = iCellColumn
EndIf
;Do we need to extend the range
;so that titles can be detected when we are beyond the last cells:
if iEnd < iCellColumn
&& (!multipleRegionSupport() || !AllowPerformanceImpactingFeatures())
	let iEnd = iCellColumn
endIf
endFunction

void function GetColumnUsedStartAndEndPoints(string sColumn, int iCellRow,
	int byRef iStart, int byRef iEnd)
var
	object oRange
let oRange = oXLActiveSheet.Range(sColumn+IntToString(1))
if oRange.text then
	let iStart = 1
else
	let iStart = oRange.End(xlDown).row
endIf
let iEnd = oXLActiveSheet.Range(sColumn+IntToString(65536)).End(xlUp).row
;start will be greater than end if the column is blank:
if iStart > iEnd
|| iCellRow < iStart then
	let iStart = iCellRow
	let iEnd = iCellRow
EndIf
;Do we need to extend the range
;so that titles can be detected when we are beyond the last cells:
if iEnd < iCellRow
&& (!multipleRegionSupport() || !AllowPerformanceImpactingFeatures())
	let iEnd = iCellRow
endIf
endFunction

object function oXLSheetUsedRange()
;Calling the UsedRange on a range has the side effect of killing the undo stack.
;Using the Excel4Macro method to get the start and end points kills the clipboard.
;We use the following method to find what we are calling the used the range.
;Note that the found range depends on the current cell,
;so the returned range may not extend to the used range end point as defined by Excel.
;As the cell changes, the column and/or row start and end points are updated in the collection.
var
	object oCell,
	int iCellColumn,
	int iCellRow,
	object oRange,
	string sColumn,
	string sRow,
	int iRowStart,
	int iRowEnd,
	int iColumnStart,
	int iColumnEnd,
	object oStart,
	object oEnd
let oCell = oExcel.activeCell
let iCellColumn = oCell.column
let iCellRow = oCell.row
let sColumn = ColumnNumberToLetter(iCellColumn)
let sRow = IntToString(iCellRow)
GetRowUsedStartAndEndPoints(sRow, iCellColumn, iRowStart, iRowEnd)
GetColumnUsedStartAndEndPoints(sColumn, iCellRow, iColumnStart, iColumnEnd)
let oStart = oXLActiveSheet.cells(iColumnStart,iRowStart)
let oEnd = oXLActiveSheet.cells(iColumnEnd,iRowEnd)
return oXLActiveSheet.range(oStart,oEnd)
endFunction

void function UpdateCXLCurrentRegion()
var
	int count,
	int i
let cXLPriorRegion = CollectionCopy(cXLCurrentRegion)
if !OverrideDocNamedTitles() then
	if DocNamedMultipleRegionSupport()
	&& AllowPerformanceImpactingFeatures()
		if IsCellInNamedTitlesRegion(cXLActiveCell.sheetName,cXLActiveCell.row,cXLActiveCell.column,i) then
			if !cXLWorkbookNamedTitles[IntToString(i)].rangeEnd then
				let oXLCurrentRegion = oXLActiveSheet.range(
					cXLWorkbookNamedTitles[IntToString(i)].rangeStart,
					GetActiveNamedTitlesRegionUsedRangeEndAddress(i))
			else
				let oXLCurrentRegion = oXLActiveSheet.range(
					cXLWorkbookNamedTitles[IntToString(i)].rangeStart,
					cXLWorkbookNamedTitles[IntToString(i)].rangeEnd)
			EndIf
		else
			let oXLCurrentRegion = GetActiveCellCurrentRegion()
		EndIf
	else
		let oXLCurrentRegion = oXLSheetUsedRange()
		CollectionRemoveItem(cXLCurrentRegion,"name")
	EndIf
else
	if !MultipleRegionSupport()
	|| !AllowPerformanceImpactingFeatures()
		let oXLCurrentRegion = oXLSheetUsedRange()
		CollectionRemoveItem(cXLCurrentRegion,"name")
	else
		let oXLCurrentRegion = GetActiveCellCurrentRegion()
	EndIf
EndIf
let count = oXLCurrentRegion.cells.count
let cXLCurrentRegion.cellCount = count
let cXLCurrentRegion.topLeft = oXLCurrentRegion.cells(1).addressLocal(false,false)
let cXLCurrentRegion.topLeftAbsolute = oXLCurrentRegion.cells(1).addressLocal
let cXLCurrentRegion.bottomRight = oXLCurrentRegion.Cells(count).addressLocal(false,false)
let cXLCurrentRegion.bottomRightAbsolute = oXLCurrentRegion.Cells(count).addressLocal
let cXLCurrentRegion.left = oXLCurrentRegion.cells(1).column
let cXLCurrentRegion.right = cXLCurrentRegion.left + oXLCurrentRegion.columns.count - 1
let cXLCurrentRegion.top = oXLCurrentRegion.cells(1).row
let cXLCurrentRegion.bottom = cXLCurrentRegion.top + oXLCurrentRegion.rows.count - 1
let cXLCurrentRegion.sheetName = cXLActiveSheet.name
let cXLCurrentRegion.sheetCodeName = cXLActiveSheet.codeName
updateRegionPointer()
UpdateCXLCurrentColumn(oXLCurrentRegion)
UpdateCXLCurrentRow(oXLCurrentRegion)
EndFunction

void function UpdateColumnTotalText(int iLocation)
if iLocation
	cXLCurrentColumn.totalCellText
		= oXLActiveSheet.columns(cXLCurrentColumn.number).cells(iLocation).text
else
	cXLCurrentColumn.totalCellText = cscNull
EndIf
EndFunction

void function UpdateCXLColumn(collection ByRef cColumn, object oCell, object oRegion)
var
	int iStart,
	int iEnd
cColumn.number = oCell.column
if !MultipleRegionSupport()
|| !AllowPerformanceImpactingFeatures()
	GetColumnUsedStartAndEndPoints(
		ColumnNumberToLetter(cColumn.number), oCell.row, iStart, iEnd)
	cColumn.start = iStart
	cColumn.end = iEnd
	cColumn.rowCount = iEnd-iStart+1
else
	cColumn.rowCount = oRegion.rows.count
	cColumn.start = oRegion.row
	cColumn.end = cColumn.start + cColumn.rowCount-1
EndIf
cXLCurrentRegion.top = cColumn.start
cXLCurrentRegion.bottom = cColumn.end
EndFunction

void function UpdateCXLCurrentColumn(object oRegion)
UpdateCXLColumn(cXLCurrentColumn, oXLActiveCell, oRegion)
UpdateColumnTotalText(getTotalsRowSetting())
EndFunction

void function UpdateRowTotalText(int iLocation)
if iLocation
	cXLCurrentRow.totalCellText
		= oXLActiveSheet.rows(cXLCurrentRow.number).cells(iLocation).text
else
	cXLCurrentRow.totalCellText = cscNull
EndIf
EndFunction

void function UpdateCXLRow(collection ByRef cRow, object oCell, object oRegion)
var
	int iStart,
	int iEnd
cRow.number = oCell.row
if !MultipleRegionSupport()
|| !AllowPerformanceImpactingFeatures()
	GetRowUsedStartAndEndPoints(
		IntToString(oCell.row), oCell.column, iStart, iEnd)
	cRow.start = iStart
	cRow.end = iEnd
	cRow.columnCount = iEnd-iStart+1
else
	cRow.columnCount = oRegion.columns.count
	cRow.start = oRegion.column
	cRow.end = cRow.start + cRow.columnCount-1
EndIf
cXLCurrentRegion.left = cRow.start
cXLCurrentRegion.right = cRow.end
EndFunction

void function UpdateCXLCurrentRow(object oRegion)
UpdateCXLRow(cXLCurrentRow, oXLActiveCell, oRegion)
UpdateRowTotalText(getTotalsColumnSetting())
EndFunction

void function UpdateCXLRange(collection ByRef cRange, object oRange)
let cRange.address = oRange.addressLocal(false,false)
let cRange.addressAbsolute = oRange.addressLocal
let cRange.sheetName = StringTrimLeadingBlanks(StringTrimTrailingBlanks(oRange.parent.name))
let cRange.sheetCodeName = oRange.parent.codeName
let cRange.bookName = oRange.parent.parent.name
let cRange.column = oRange.column
let cRange.Formula = oRange.Formula
let cRange.FormulaLocal = oRange.FormulaLocal
let cRange.hidden = (oRange.hidden)*-1
let cRange.mergeCells = (oRange.mergeCells)*-1
let cRange.readingOrder = oRange.readingOrder
let cRange.row = oRange.row
let cRange.HasSmartTags = oRange.SmartTags.Count > 0
let cRange.text = oRange.text
let cRange.hyperlinks = oRange.hyperlinks
EndFunction

void function UpdateCxlErrors ()
; some high-number errors don't produce a context menu, so setting the max to 1 for most common error
; 1 = empty references which cause context menu to be available.
var
	object item, object errors = oXLActiveCell.errors,
	int i, int maxErrors = 1
for i=1 to maxErrors
	item = errors(i)
	if item.value == vbTrue
		cXLActiveCell.ContainsErrors = TRUE
		i = maxErrors+1 ; break; we just need one
	endIf
endFor
endFunction

void function updateCxlSubtypeInfo ()
; known subtypes: cell, column header or row header.
var int type = getObjectSubtypeCode(SOURCE_CACHED_DATA, 0)
cXLActiveCell.subtype = type
endFunction

void function UpdateCXLRangeVisibilityData(collection ByRef cRange, object oRange, optional int bAllData)
;These updates are separated out from the ones in UpdateCXLRange,
;because the information is needed only conditionally or on demand.
cRange.Height = oRange.height
cRange.width = oRange.width
cRange.VerticalAlignment = oRange.VerticalAlignment
cRange.HorizontalAlignment =oRange.HorizontalAlignment
cRange.wrapText = (oRange.wrapText)*-1
cRange.ShrinkToFit = (oRange.ShrinkToFit)*-1
cRange.indentLevel = oRange.indentLevel
cRange.rowHeight = oRange.rowHeight
cRange.columnWidth = oRange.columnWidth
if bAllData
	UpdateCXLRangeConditionallyAvailableData(cRange,oRange,true)
endIf
EndFunction

void function UpdateCXLRangeOrientation(collection ByRef cRange, object oRange)
cRange.orientation = oRange.orientation
EndFunction

void function UpdateCXLRangeConditionallyAvailableData(collection ByRef cRange, object oRange, optional int bRequired)
;When updating all data, bRequired must be true.
;otherwise, we only update according to the user's option setting.
if bRequired
|| NumberFormatVerbosity ()
	cRange.numberFormatLocal = oRange.numberFormatLocal
endIf
if bRequired
|| OrientationIndication()
	UpdateCXLRangeOrientation(cRange,oRange)
endIf
EndFunction

void function UpdateCXLActiveCell()
cXLPriorActiveCell = CollectionCopy(cXLActiveCell)
CollectionRemoveAll(cXLActiveCell)
UpdateCXLRange(cXLActiveCell,oXLActiveCell)
UpdateCXLRangeConditionallyAvailableData(cXLActiveCell,oXLActiveCell)
UpdateCXLActiveCellValidation()
UpdateCXLActiveCellHyperLinks()
UpdateCXLActiveCellComment(true)
;We must get the interior before the font,
;since retrieving the font background color depends on the data for the interior:
UpdateCXLActiveCellInterior(CellShadingChangesAnnounce()||FontChangesAnnounce())
UpdateCXLActiveCellFont(FontChangesAnnounce()||AnnounceTextVisible())
UpdateCXLActiveCellStyle(NumberFormatVerbosity())
UpdateCXLActiveCellFormatConditions(DetectFormatConditions())
UpdateCXLActiveCellBorders(CellBorderVerbosity())
UpdateCxlErrors ()
updateCxlSubtypeInfo ()
if stringContains (cxlActiveCell.Text, scNumberSigns) then
	; the object model cell text is actually wrong where new data types exist, 
	var string valueText = GetObjectValue()
	if !stringIsBlank (valueText)
		cxlActiveCell.text = valueText
	endIf
endIf
EndFunction

void function RefreshCXLActiveCell()
let oXLActiveCell = GetActiveCell()
UpdateCXLActiveCell()
UpdateCXLActiveCellTitles()
EndFunction

void function UpdateCXLRangeAllData(collection ByRef cRange, object oRange)
UpdateCXLRange(cRange,oRange)
UpdateCXLRangeVisibilityData(cRange,oRange,true)
;We must get the interior before the font,
;since retrieving the font background color depends on the data for the interior:
UpdateCXLRangeInterior(cRange,oRange,true)
UpdateCXLRangeFont(cRange,oRange,true)
UpdateCXLRangeFormatConditions(cRange,oRange,true)
UpdateCXLRangeStyle(cRange,oRange,true)
UpdateCXLRangeValidation(cRange,oRange)
EndFunction

int function getCellSubtype ()
return cXLActiveCell.subtype
endFunction

int function GetTitlesFromUIATablePattern (string byRef ColTitle, string byRef RowTitle)
var
	int i, int titleReading,
	string contentFromUIA, string contentFromExcel,
	object pattern,
	object RowHeaders, object ColHeaders,
	object element
element = FSUIAGetFocusedElement ().BuildUpdatedCache()
if ! element then return readNoTitles endIf
pattern = element.GetTableItemPattern()
if ! pattern then return readNoTitles endIf
colHeaders = pattern.GetColumnHeaderItems()
for i = 0 to colHeaders.count
	contentFromUIA = colHeaders(i).getValuePattern().value
	contentFromUIA = stringTrimLeadingBlanks (stringTrimTrailingBlanks (contentFromUIA))
	if getObjectSubtypeCode () != WT_COLUMNHEADER ; prevent header cells from speaking header and content redundantly
	&& ! stringIsBlank (contentFromUIA) then
		colTitle = contentFromUIA 
		titleReading = ReadColumnTitles
	endIf
	if stringIsBlank (colTitle) ; got it from UIA's value pattern string
	&& ! stringIsBlank (colHeaders(i).name) 
	; cells outside of tables use the position info as headers, so exclude this:
	; headers info can contain extra spaces.
	&& stringCompare (colHeaders(i).name, StringTrimTrailingBlanks (StringTrimLeadingBlanks (ColumnNumberToLetter (cXLActiveCell.column)))) != 0
	&& stringCompare (contentFromUIA, StringTrimTrailingBlanks (StringTrimLeadingBlanks (ColumnNumberToLetter (cXLPriorActiveCell.column)))) != 0
	; avoid double speaking cell header when is active cell:
	&& colHeaders(i).name != cxlActiveCell.address
	&& colHeaders(i).name != cxlPriorActiveCell.address then
		contentFromUIA = colHeaders(i).name
		; because the UIA content is often the header cell address and not the traditional header content.
		contentFromExcel = oXlActiveSheet.range(contentFromUIA).text
		if ! stringIsBlank (contentFromExcel) then
			colTitle = contentFromExcel
		else
			colTitle = contentFromUIA ; header item was not a cell address.
		endIf
		titleReading = ReadColumnTitles
	endIf
endFor
rowHeaders = pattern.GetRowHeaderItems()
for i = 0 to rowHeaders.count
	contentFromUIA = rowHeaders(i).getValuePattern().value
	contentFromUIA = stringTrimLeadingBlanks (stringTrimTrailingBlanks (contentFromUIA))
	if getObjectSubtypeCode () != WT_COLUMNHEADER ; prevent header cells from speaking header and content redundantly
	&& ! stringIsBlank (contentFromUIA) then
		rowTitle = contentFromUIA ; header item was not a cell address.
		titleReading = titleReading+ReadRowTitles
	endIf
	if stringIsBlank (rowTitle) ; got content from value pattern string in UIA
	&& ! stringIsBlank (rowHeaders(i).name)
	; cells outside of tables use the position info as headers, so exclude this:
	&& RowHeaders(i).name!= cXLActiveCell.row
	&& RowHeaders(i).name!= cXLPriorActiveCell.row
	; avoid double speaking cell header when is active cell:
	&& rowHeaders(i).name != cxlActiveCell.address
	&& rowHeaders(i).name != cxlPriorActiveCell.address  then
	contentFromUIA = rowHeaders(i).name
		; because the UIA content is often the header cell address and not the traditional header content.
		contentFromExcel = oXlActiveSheet.range(contentFromUIA).text
		if ! stringIsBlank (contentFromExcel) then
			rowTitle = contentFromExcel
		else
			rowTitle = contentFromUIA ; header item was not a cell address.
		endIf
		titleReading = titleReading+ReadRowTitles
	endIf
endFor
return titleReading
endFunction

void function UpdateCXLActiveCellTitles()
var
	int bTitleVerbosity,
	collection c
CollectionRemoveItem(cXLActiveCell,"titles")
bTitleVerbosity = ShouldReadTitles()
if bTitleVerbosity then
	c = new collection
	if bTitleVerbosity & ReadRowTitles
		c.row = GetCellTitleText(
			cXLActiveSheet.name, cXLActiveCell.row, cXLActiveCell.column, RowType)
	EndIf
	if bTitleVerbosity & ReadColumnTitles
		c.column = GetCellTitleText(
			cXLActiveSheet.name, cXLActiveCell.row, cXLActiveCell.column, ColumnType)
	EndIf
	cXLActiveCell.titles = c
else ; Later versions of Excel where user has inserted a table with headers
	var string ColTitle, string RowTitle
	if !GetTitlesFromUIATablePattern (ColTitle, RowTitle) then return endIf
	c = new collection
	if !stringIsBlank (RowTitle)
		c.row = RowTitle
		c.titlesFromUIA = c.titlesFromUIA + ReadRowTitles
	EndIf
	if !stringIsBlank (ColTitle)
		c.column = ColTitle
		c.titlesFromUIA = c.titlesFromUIA + ReadColumnTitles
	EndIf
	cXLActiveCell.titles = c
EndIf
EndFunction

int function GetSelectionDirection()
if cXLSelection.FirstCell.row < cXLPriorSelection.FirstCell.row
|| cXLSelection.FirstCell.column < cXLPriorSelection.FirstCell.column
|| cXLSelection.LastCell.row < cXLPriorSelection.LastCell.row
|| cXLSelection.LastCell.Column < cXLPriorSelection.LastCell.Column then
	return SelectionDirection_Backward
elif cXLSelection.FirstCell.row > cXLPriorSelection.FirstCell.row
|| cXLSelection.FirstCell.column > cXLPriorSelection.FirstCell.column
|| cXLSelection.LastCell.row > cXLPriorSelection.LastCell.row
|| cXLSelection.LastCell.Column > cXLPriorSelection.LastCell.Column then
	return SelectionDirection_Forward
EndIf
EndFunction

void function UpdateCXLSelection()
var
	object o,
	collection c,
	int i,
	object oArea
let cXLPriorSelection = CollectionCopy(cXLSelection)
if CollectionItemExists(cXLSelection,"areas") then
	CollectionRemoveItem(cXLSelection,"areas")
EndIf
let o = oXLSelection.cells
let cXLSelection.address = o.addressLocal(false,false)
let cXLSelection.row = o.row
let cXLSelection.column = o.column
let cXLSelection.cellCount = o.Count
let c = new collection
let c.address = o(1).addressLocal(false,false)
let c.row = o(1).row
let c.column = o(1).column
let c.text = o(1).text
let c.sheetName = o(1).parent.name
let cXLSelection.FirstCell = c
if cXLSelection.cellCount > 1 then
	let c = new collection
	let c.address = o(cXLSelection.cellCount).addressLocal(false,false)
	let c.row = o(cXLSelection.cellCount).row
	let c.column = o(cXLSelection.cellCount).column
	let c.sheetName = o(cXLSelection.cellCount).parent.name
	let c.text = o(cXLSelection.cellCount).text
EndIf
let cXLSelection.lastCell = c
if cXLSelection.cellCount == 1 then
	let cXLSelection.mergeCells = false
	let cXLSelection.columnCount = 1
	let cXLSelection.rowCount = 1
	let cXLSelection.areaCount = 1
else
	let cXLSelection.mergeCells = (o.mergeCells)*-1
	let cXLSelection.columnCount = oXLSelection.columns.Count
	let cXLSelection.rowCount = oXLSelection.rows.Count
	let cXLSelection.areaCount = oXLSelection.areas.count
EndIf
if cXLSelection.areaCount > 1 then
	let c = new collection
	let i = 1
	while i <= cXLSelection.areaCount
		let oArea = oXLSelection.areas(i)
		if oArea.cells.count == 1 then
			let c[IntToString(i)] = oArea.cells(1).addressLocal(false,false)
		else
			let c[IntToString(i)] = formatString(msgSpans1,
				oArea.cells(1).addressLocal(false,false),
				oArea.cells(oArea.cells.count).addressLocal(false,false))
		EndIf
		let i = i+1
	EndWhile
	let cXLSelection.areas = c
EndIf
EndFunction

void function UpdateCXLBorder(collection ByRef cBorder, object oBorder)
let cBorder.color = oBorder.color
let cBorder.colorIndex = oBorder.colorIndex
let cBorder.lineStyle = oBorder.lineStyle
let cBorder.weight = oBorder.weight
EndFunction

void function UpdateCXLRangeBorders(collection ByRef cRange, object oRange, int bGetNewData)
var
	collection cBorders,
	collection cEdge
if CollectionItemExists(cRange,"borders") then
	CollectionRemoveItem(cRange,"borders")
EndIf
if bGetNewData then
	let cBorders = new collection
	let cEdge = new collection
	UpdateCXLBorder(cEdge,oXLActiveCell.displayFormat.Borders(xlEdgeLeft))
	let cBorders.left = cEdge
	let cEdge = new collection
	UpdateCXLBorder(cEdge,oXLActiveCell.displayFormat.Borders(xlEdgeTop))
	let cBorders.top = cEdge
	let cEdge = new collection
	UpdateCXLBorder(cEdge,oXLActiveCell.displayFormat.Borders(xlEdgeRight))
	let cBorders.right = cEdge
	let cEdge = new collection
	UpdateCXLBorder(cEdge,oXLActiveCell.displayFormat.Borders(xlEdgeBottom))
	let cBorders.bottom = cEdge
	let cRange.borders = cBorders
EndIf
EndFunction

void function UpdateCXLActiveCellBorders(int bGetNewData)
UpdateCXLRangeBorders(cXLActiveCell, oXLActiveCell, bGetNewData)
EndFunction

int function TypeOfCachedComment()
;used by braille to determine whether it is showing a note or threaded comment.
if !cXLActiveCell.comment return 0 endIf
return cXLActiveCell.comment.type
EndFunction

void function UpdateCXLComment(collection ByRef cComment, object oComment, int type)
if type == NoteCommentType
	cComment.type = NoteCommentType
	cComment.author = oComment.author
	cComment.text = oComment.text
	cComment.visible = (oComment.visible)*-1
elif type == ThreadedCommentType
	cComment.type = ThreadedCommentType
	cComment.author = oComment.author.name
	cComment.text = oComment.text
	cComment.date = oComment.date
	cComment.replyCount = oComment.replies.count
	cComment.resolved = oComment.resolved
endIf
EndFunction

void function UpdateCXLRangeComment(collection ByRef cRange, object oRange, int bGetNewData)
var
	collection cComment
if CollectionItemExists(cRange,"comment") then
	CollectionRemoveItem(cRange,"comment")
EndIf
if !bGetNewData return endIf
if oRange.comment 
	cComment = new collection
	UpdateCXLComment(cComment, oRange.comment, NoteCommentType)
	cRange.comment = cComment
elif oRange.CommentThreaded
	cComment = new collection
	UpdateCXLComment(cComment, oRange.CommentThreaded, ThreadedCommentType)
	cRange.comment = cComment
endIf
EndFunction

void function UpdateCXLActiveCellComment(int bGetNewData)
UpdateCXLRangeComment(cXLActiveCell, oXLActiveCell, bGetNewData)
EndFunction

void function UpdateCXLFont(collection ByRef cFont, object oFont)
; Background color needs its own update from shading:
if oFont.background then
	let cFont.backgroundColor = oFont.background
else
	var int BackgroundColor
	GetCXLRangeTextAndBackgroundColors(cXLActiveCell,0, BackgroundColor)
	cFont.backgroundColor = BackgroundColor
endIf
let cFont.foregroundColor = oFont.color
let cFont.colorIndex = oFont.colorIndex
let cFont.fontStyle = oFont.fontStyle
let cFont.name = oFont.name
let cFont.size = oFont.size
let cFont.bold = (oFont.bold)*-1
let cFont.italic = (oFont.italic)*-1
let cFont.underline = oFont.underline
let cFont.strikeThrough = (oFont.strikeThrough)*-1
let cFont.subScript = (oFont.subScript)*-1
let cFont.superScript = (oFont.superScript)*-1
EndFunction

void function UpdateCXLRangeFont(collection ByRef cRange, object oRange, int bGetNewData)
var
	collection cFont
if CollectionItemExists(cRange,"font") then
	CollectionRemoveItem(cRange,"font")
EndIf
if bGetNewData then
	let cFont = new collection
	UpdateCXLFont(cFont, oRange.displayFormat.Font)
	let cRange.font = cFont
EndIf
EndFunction

void function UpdateCXLActiveCellFont(int bGetNewData)
UpdateCXLRangeFont(cXLActiveCell, oXLActiveCell, bGetNewData)
EndFunction

void function UpdateCXLRangeFormatConditions(collection ByRef cRange, object oRange, int bGetNewData)
if CollectionItemExists(cRange,"formatConditions") then
	CollectionRemoveItem(cRange,"formatConditions")
EndIf
if !bGetNewData return endIf
var int i = oRange.formatConditions.count
if i == 0 return EndIf
var collection cFormatConditions
cFormatConditions = new collection
cFormatConditions.count = i
cRange.formatConditions = cFormatConditions
EndFunction

void function UpdateCXLActiveCellFormatConditions(int bGetNewData)
UpdateCXLRangeFormatConditions(cXLActiveCell, oXLActiveCell, bGetNewData)
EndFunction

void function UpdateCXLHyperLink(collection ByRef cLink, object oLink)
let cLink.address = oLink.address
let cLink.subAddress = oLink.subAddress
let cLink.screenTip = oLink.screenTip
EndFunction

void function UpdateCXLRangeHyperLinks(collection ByRef cRange, object oRange)
var
	collection cHyperLinks,
	collection cLink,
	int i
if CollectionItemExists(cRange,"hyperLinks") then
	CollectionRemoveItem(cRange,"hyperLinks")
EndIf
let i = oRange.HyperLinks.count
if i == 0 then
	return
EndIf
let cHyperLinks = new collection
let cHyperLinks.count = i
while i >= 1
	let cLink = new collection
	UpdateCXLHyperLink(cLink, oRange.HyperLinks(i))
	let cHyperLinks[IntToString(i)] = cLink
	let i = i-1
EndWhile
let cRange.HyperLinks = cHyperLinks
EndFunction

void function UpdateCXLActiveCellHyperLinks()
UpdateCXLRangeHyperLinks(cXLActiveCell, oXLActiveCell)
EndFunction

void function UpdateCXLInterior(collection ByRef cInterior, object oInterior)
let cInterior.backgroundColor = oInterior.color
let cInterior.backgroundColorIndex = oInterior.colorIndex
let cInterior.invertIfNegative = (oInterior.invertIfNegative)*-1
let cInterior.pattern = oInterior.pattern
let cInterior.foregroundColorIndex = oInterior.patternColorIndex
if (cInterior.foregroundColorIndex)*-1 != xlPatternAutomatic then
	let cInterior.foregroundColor = oInterior.patternColor
Else
	let cInterior.foregroundColor = xlColorBlack
endIf
EndFunction

void function UpdateCXLRangeInterior(collection ByRef cRange, object oRange, int bGetNewData)
var
	collection cInterior
if CollectionItemExists(cRange,"interior") then
	CollectionRemoveItem(cRange,"interior")
EndIf
if bGetNewData then
	let cInterior = new collection
	UpdateCXLInterior(cInterior, oRange.DisplayFormat.interior)
	let cRange.interior = cInterior
EndIf
EndFunction

void function UpdateCXLActiveCellInterior(int bGetNewData)
UpdateCXLRangeInterior(cXLActiveCell, oXLActiveCell, bGetNewData)
EndFunction

void function UpdateCXLListObject(collection ByRef cListObject, object oListObject)
let cListObject.displayRightToLeft = (oListObject.displayRightToLeft)*-1
let cListObject.name = oListObject.name
let cListObject.sharePointURL = oListObject.sharePointURL
let cListObject.showAutoFilter = (oListObject.showAutoFilter)*-1
let cListObject.showTotals = (oListObject.showTotals)*-1
let cListObject.sourceType = oListObject.sourceType
EndFunction

void function UpdateCXLShape(collection ByRef cShape, object oShape)
let cShape.name = oShape.name
let cShape.type = oShape.type
let cShape.autoShapeType = oShape.autoShapeType
let cShape.formControlType = oShape.formControlType
let cShape.object = oShape.oleFormat.object
let cShape.topLeft = oShape.topLeftCell.addressLocal(false,false)
let cShape.bottomRight = oShape.bottomRightCell.addressLocal(false,false)
EndFunction

void function UpdateCXLRangeShapes(collection ByRef cRange, object oRange, int bGetNewData)
var
	collection cShapes,
	collection cShape,
	int i
if CollectionItemExists(cRange,"shapes") then
	CollectionRemoveItem(cRange,"shapes")
EndIf
if bGetNewData then
	let i = oRange.Shapes.count
	if i == 0 then
		return
	EndIf
	let cShapes = new collection
	let cShapes.count = i
	while i >= 1
		let cShape = new collection
		UpdateCXLShape(cShape, oRange.Shapes(i))
		let cShapes[i] = cShape
		let i = i-1
	EndWhile
	let cRange.Shapes = cShapes
EndIf
EndFunction

void function UpdateCXLStyle(collection ByRef cStyle, object oStyle)
let cStyle.name = oStyle.name
EndFunction

void function UpdateCXLRangeStyle(collection ByRef cRange, object oRange, int bGetNewData)
var
	collection cStyle
if CollectionItemExists(cRange,"style") then
	CollectionRemoveItem(cRange,"style")
EndIf
if bGetNewData then
	let cStyle = new collection
	UpdateCXLStyle(cStyle, oRange.style)
	; add the Sparkline functionality, based on the range, not the selection.
	var int sparklines = oRange.SparklineGroups.count
	cStyle.sparklines = sparklines
	let cRange.style = cStyle
EndIf
EndFunction

void function UpdateCXLActiveCellStyle(int bGetNewData)
UpdateCXLRangeStyle(cXLActiveCell, oXLActiveCell, bGetNewData)
EndFunction

void function UpdateCXLValidation(collection ByRef cValidation, object oValidation)
let cValidation.inCellDropDown = (oValidation.inCellDropDown)*-1
let cValidation.inputMessage = oValidation.inputMessage
let cValidation.inputTitle = oValidation.inputTitle
let cValidation.formula1= oValidation.formula1
let cValidation.formula2 = oValidation.formula2
let cValidation.operator = oValidation.operator
let cValidation.ShowInput = (oValidation.ShowInput)*-1
let cValidation.type = oValidation.type
EndFunction

void function UpdateCXLRangeValidation(collection ByRef cRange, object oRange)
var
	object oValidation,
	collection cValidation
if CollectionItemExists(cRange,"Validation") then
	CollectionRemoveItem(cRange,"Validation")
EndIf
let oValidation = oRange.validation
if oValidation then
	let cValidation = new collection
	UpdateCXLValidation(cValidation, oValidation)
	let cRange.validation = cValidation
EndIf
EndFunction

void function UpdateCXLActiveCellValidation()
UpdateCXLRangeValidation(cXLActiveCell,oXLActiveCell)
EndFunction

int Function IsSelectedRangeTooLarge()
;This is an arbitrary limitation to prevent possible crashing from too many object model calls.
return cXLSelection.cellCount >= 500
	|| getVisibleSelection().cells.count>=500
endFunction

int Function CellSelectionStatus()
Var
	object oCells
let oCells = oXLSelection.cells
if oCells.mergeCells then
	;Although cell count is greater than 1, we do not want to say the cells are selected because they are merged.
	return 1
EndIf
return oCells.count
EndFunction

object Function getVisibleSelection()
return oExcel.intersect(oXLSelection,oExcel.activeWindow.visibleRange)
EndFunction

string Function GetSelectedText(optional int bWantMarkup,int bWantAllListViewItemText)
Var
	handle hwnd,
	string sClass,
	string sText,
	string sSelectedText,
	object oSelection,
	int  iCount,
	int i
if isVirtualPCCursor()
|| !isPCCursor()
|| UserBufferIsActive()
|| IsEditingComment() then
	return GetSelectedText(bWantMarkup,bWantAllListViewItemText)
EndIf
let hwnd = GetFocus()
let sClass = GetWindowClass(hwnd)
if sClass == cwc_RichEdit20w
&& !onFormulaBarUIAEditItem() then
	return GetTextInRect(GetWindowLeft(hwnd),GetLineTop(),GetWindowRight(hwnd),GetLineBottom(),0,ignoreColor)
EndIf
If worksheetHasFocus()
	let oSelection = getVisibleSelection()
	let iCount = oSelection.count
	let i = 1
	while i <= iCount
		let sText = oSelection(i).Text
		if (! stringIsBlank (sText)
		&& ! stringIsBlank (sSelectedText)) ; don't add empty spaces for blank cells or cells containing just white space:
			let sSelectedText = sSelectedText+cscSpace
		endIf
		let sSelectedText = sSelectedText+sText
		let i = i+1
	EndWhile
	return sSelectedText
Else
	return GetSelectedText(bWantMarkup,bWantAllListViewItemText)
EndIf
EndFunction

int function IsNamedRegionTitleString(string sName, optional int ByRef TypeOfTitle)
var
	string s
let s = StringLower(sName)
if NameColumnTitle == StringLeft(s,StringLength(NameColumnTitle))
|| NameLocalColumnTitle == StringLeft(s,StringLength(NameLocalColumnTitle)) then
	let TypeOfTitle = ReadColumnTitles
	return true
elIf NameRowTitle == StringLeft(s,StringLength(NameRowTitle))
|| NameLocalRowTitle == StringLeft(s,StringLength(NameLocalRowTitle))
	let TypeOfTitle = ReadRowTitles
	return true
elif NameTitle == StringLeft(s,StringLength(NameTitle))
|| NameLocalTitle == StringLeft(s,StringLength(NameLocalTitle)) then
	let TypeOfTitle = ReadBothTitles
	return true
else
	let TypeOfTitle = ReadNoTitles
	return false
endIf
EndFunction

int function IsCellInNamedTitlesRegion(string sSheetName, int iRow, int iColumn,
	optional int byRef iNamedTitlesIndex)
if !AllowPerformanceImpactingFeatures() && !gbSayTitleOnDemand return false endIf
if !CollectionItemCount(cXLWorkbookNamedTitles)
&& gbSayTitleOnDemand 
	UpdateCXLWorkbookNamedTitles()
endIf
var string key
ForEach key in cXLWorkbookNamedTitles
	if sSheetName == cXLWorkbookNamedTitles[key].sheetName
	&& cXLWorkbookNamedTitles[key].rangeRowStart <= iRow
	&& (cXLWorkbookNamedTitles[key].rangeRowEnd == 0 || cXLWorkbookNamedTitles[key].rangeRowEnd >= iRow)
	&& cXLWorkbookNamedTitles[key].rangeColumnStart <= iColumn
	&& (cXLWorkbookNamedTitles[key].rangeColumnEnd == 0 || cXLWorkbookNamedTitles[key].rangeColumnEnd >= iColumn) then
		iNamedTitlesIndex = StringToInt(key)
		return true
	EndIf
EndForEach
return false
EndFunction

int function ActiveCellIsInUsedRangeOfNamedTitlesRegion()
if !AllowPerformanceImpactingFeatures() return false endIf
var
	collection c,
	int iNamedRegion
if !IsCellInNamedTitlesRegion(cXLActiveSheet.name, cXLActiveCell.row, cXLActiveCell.column, iNamedRegion) then
	return 0
EndIf
;now check to see if the active cell
;is beyond the boundaries of a named titles region with no defined end point:
let c = new collection
let c = cXLWorkbookNamedTitles[IntToString(iNamedRegion)]
if (c.rangeRowEnd == 0 && cXLActiveCell.row > cXLCurrentRegion.bottom)
|| (c.rangeColumnEnd == 0 && cXLActiveCell.column > cXLCurrentRegion.right) then
	return 0
else
	return iNamedRegion
EndIf
EndFunction

int function IsNamedTitlesRegionActive()
if !AllowPerformanceImpactingFeatures() return false endIf
return ActiveCellIsInUsedRangeOfNamedTitlesRegion()
EndFunction

int function RangesAreIdentical(object oRange1, object oRange2)
var
	string s1,
	string s2
let s1 = oRange1.addressLocal(true,true,1,true)
let s2 = oRange2.addressLocal(true,true,1,true)
return s1==s2
	&& oRange1.cells.count == oRange2.cells.count
EndFunction

int Function hasWorkbookOrWorksheetChanged()
return cXLPriorActiveCell.sheetCodeName && cXLPriorActiveCell.bookName
	&& ((cXLActiveCell.sheetCodeName != cXLPriorActiveCell.sheetCodeName
	&& cXLActiveCell.sheetName != cXLPriorActiveCell.sheetName)
	|| cXLActiveCell.bookName != cXLPriorActiveCell.bookName)
EndFunction

void function DetectAndUpdateRegionChange()
if HasRegionChanged() then
	UpdateCXLCurrentRegion()
	if RegionChangeIsSignificant() then
		sayFormattedMessageWithVoice(vctx_message,ot_help,
			formatString(msgNewRegion1_L, cscNull),
			formatString(msgNewRegion1_L, cscNull))
	EndIf
else
	if cXLActiveCell.column != cXLCurrentColumn.number
	|| cXLActiveCell.row < cXLCurrentColumn.start
	|| cXLActiveCell.row > cXLCurrentColumn.end then
		UpdateCXLCurrentColumn(oXLCurrentRegion)
	EndIf
	if cXLActiveCell.row != cXLCurrentRow.number
	|| cXLActiveCell.column < cXLCurrentRow.start
	|| cXLActiveCell.column > cXLCurrentRow.end then
		UpdateCXLCurrentRow(oXLCurrentRegion)
	EndIf
EndIf
EndFunction

int function HasRegionChanged()
if hasWorkbookOrWorksheetChanged()
	return true
endIf
if !AllowPerformanceImpactingFeatures() return false endIf
var
	int bPreviouslyInNamedTitlesRegion,
	int iCurrentNamedTitlesRegion,
	int iPriorNamedTitlesRegion
if !OverrideDocNamedTitles()
	if DocNamedMultipleRegionSupport()
		iCurrentNamedTitlesRegion = ActiveCellIsInUsedRangeOfNamedTitlesRegion()
		let bPreviouslyInNamedTitlesRegion =
			IsCellInNamedTitlesRegion(cXLPriorActiveCell.sheetName,cXLPriorActiveCell.row,cXLPriorActiveCell.column,iPriorNamedTitlesRegion)
		if bPreviouslyInNamedTitlesRegion
		&& !cXLWorkbookNamedTitles[IntToString(iPriorNamedTitlesRegion)].rangeEnd then
			if cXLPriorActiveCell.row > cXLCurrentRegion.bottom
			|| cXLPriorActiveCell.column > cXLCurrentRegion.right then
				let iPriorNamedTitlesRegion = 0
			EndIf
		EndIf
		return iCurrentNamedTitlesRegion != iPriorNamedTitlesRegion
			|| iCurrentNamedTitlesRegion != iPriorNamedTitlesRegion
	else
		return false
	EndIf
else
	if MultipleRegionSupport() then
		var object oCurrentRegion = GetActiveCellCurrentRegion()
		return cXLCurrentRegion.topLeft
			!= oCurrentRegion.cells(1).AddressLocal(false,false)
	else
		return false
	EndIf
EndIf
EndFunction

int function RegionChangeIsSignificant()
var
	int iCurrentRegionNamedTitleIndex,
	int iPriorRegionNamedTitleIndex
if !MultipleRegionSupport()
|| !AllowPerformanceImpactingFeatures()
	return false
EndIf
if !OverrideDocNamedTitles() then
	IsCellInNamedTitlesRegion(cXLPriorActiveCell.sheetName,
		cXLPriorActiveCell.row, cXLPriorActiveCell.column, iPriorRegionNamedTitleIndex)
	if !cXLWorkbookNamedTitles[IntToString(iPriorRegionNamedTitleIndex)].rangeEnd then
		if cXLPriorActiveCell.row > cXLCurrentRegion.bottom
		|| cXLPriorActiveCell.column > cXLCurrentRegion.right then
			let iPriorRegionNamedTitleIndex = 0
		EndIf
	let iCurrentRegionNamedTitleIndex =
		ActiveCellIsInUsedRangeOfNamedTitlesRegion()
	EndIf
EndIf
return iPriorRegionNamedTitleIndex != iCurrentRegionNamedTitleIndex
	|| (cXLPriorRegion.topLeft != cXLCurrentRegion.topLeft
	&& (cXLPriorRegion.cellCount > 1 || cXLCurrentRegion.cellCount > 1))
EndFunction

object Function getNamedRegionRangeObject(object oRange)
if !AllowPerformanceImpactingFeatures() return Null() endIf
var
	object oNull,
	int i,
	int count,
	object oNames,
	object oName,
	string sNameAddress,
	object oReferedRange
let oNames = oXLActiveWorkbook.names
let count = oNames.count
if !count then
	return oNull
endIf
let i = 1
while i <= count
	let oName = oNames(i)
	let sNameAddress = oName.refersTo
	if stringContains(sNameAddress,cXLActiveSheet.name) then
		let oReferedRange = oName.refersToRange
		if oReferedRange then
			if oExcel.intersect(oRange,oReferedRange) then
				return oReferedRange
			endIf
		endIf
	endIf
	let i = i+1
endWhile
return oNull
EndFunction

string function getActiveWorkbookName()
return oXLActiveWorkbook.name
EndFunction

string function getActiveWorkbookNameFromCollection ()
;QuickSettings can better retrieve this from cached setting.
return cXLActiveWorkbook.name
endFunction

string function getActiveSheetName()
return cXLActiveSheet.name
EndFunction

int Function GetActiveSheetNumber()
return cXLActiveSheet.index
EndFunction

void function GetArrayOfSheetNames(StringArray Sheets, int Count)
var
	int i
for i = 1 to count
	let Sheets[i] = oXLActiveWorkbook.sheets(i).name
EndFor
EndFunction

int function FindSheetNameInArray(StringArray Sheets, int count, string sSheetName)
var
	int i
let i = 1
while i <= count
	if StringCompare(Sheets[i],sSheetName) == 0 then
		return i
	EndIf
	let i = i+1
EndWhile
return 0
EndFunction

int Function GetSheetNumber(string sSheetName)
var
	object oSheets,
	int iCount,
	int i
let oSheets = oXLActiveWorkbook.worksheets
let iCount = oSheets.count
let i = 1
while i <= iCount
	if StringCompare(oSheets(i).name,sSheetName)==0 then
		return i
	EndIf
	let i = i+1
Endwhile
EndFunction

string Function getWorkbookAndWorksheetName()
return cXLActiveWorkbook.name+cscColon+cXLActiveSheet.name
EndFunction

int function IsFirstSheet()
return oXLActiveSheet == oXLActiveWorkbook.sheets(1)
EndFunction

int function IsLastSheet()
return oXLActiveSheet == oXLActiveWorkbook.sheets(oXLActiveWorkbook.sheets.count)
EndFunction

int Function SheetsAreGrouped()
return oExcel.ActiveWindow.SelectedSheets.count > 1
endFunction

string Function GetGroupedSheetNames()
var
	object oSelectedSheets,
	int index,
	int iCount,
	string sSheetsSelected,
	string sSheetName
let oSelectedSheets = oExcel.ActiveWindow.SelectedSheets
let iCount = oSelectedSheets.count
if iCount == 0 then
	return cscNull
endIf
let sSheetsSelected = cscNull
let index = 1
While index <= iCount
	let sSheetName = oSelectedSheets(index).name
	let sSheetsSelected = sSheetsSelected+sSheetName+cscSpace
	let index = index+1
EndWhile
return sSheetsSelected
EndFunction

string function getRealCurrentRegionTopLeft()
return cXLRealCurrentRegion.topLeft
EndFunction

string function getRealCurrentRegionBottomRight()
return cXLRealCurrentRegion.bottomRight
EndFunction

string function getCurrentRegionTopLeft()
return cXLCurrentRegion.topLeft
EndFunction

string function getCurrentRegionBottomRight()
return cXLCurrentRegion.bottomRight
EndFunction

int function getCurrentRegionTop()
return cXLCurrentRegion.top
EndFunction

int function getCurrentRegionLeft()
return cXLCurrentRegion.left
EndFunction

int function getCurrentRegionBottom()
return cXLCurrentRegion.Bottom
EndFunction

int function getCurrentRegionRight()
return cXLCurrentRegion.Right
EndFunction

int function IsMergedCells()
return cXLSelection.mergeCells
EndFunction

Int function CellHasEmbeddedObject(object oCell)
;!!!!!!! Is this accurate?
var
	object sheet,
	object Shapes,
	int iCount,
	int iCommentCount
let sheet=oExcel.activeSheet
let shapes=sheet.shapes
let iCount=shapes.count
let iCommentCount=Sheet.comments.count + sheet.CommentsThreaded.count
if iCount-iCommentCount!=0 then
; need to compare against active cell.
	return true
else
	return false
EndIf
EndFunction

void function FindItemStatusOfCurrentSheet(string byRef itemStatus, int byRef level)
var int count = GetAncestorCount()
for level = 1 to count
	if GetObjectRole(level) == ROLE_SYSTEM_PANE
		itemStatus = GetObjectItemStatus(level)
		if !itemStatus
			;Occasionally, the ItemStatus for a sheet is empty:
			delay(10)
			UIARefresh()
			itemStatus = GetObjectItemStatus(level)
		endIf
		return
	endIf
endFor
return
EndFunction

void Function SayNumberOfEmbeddedWorksheetObjects()
;the DOM method of counting objects is extremely expensive.
;UIA itemStatus gives us information about the last used cell, used cell count, and number of objects on the sheet.
;We are switching to reporting the UIA information, rather than simply reporting the count of DOM objects.
if UserBufferIsActive()
|| getWindowClass(getFocus()) != wcExcel7
	return
endIf
var int type = GetObjectSubtypeCode()
if type != wt_TableCell
&& type != wt_bitMap
	return
endIf
var int i, string itemStatus
FindItemStatusOfCurrentSheet(itemStatus,i)
if itemStatus == scItemStatusBlankSheet
	;Rather than reporting end of cell A1, 0 cells, 0 objects,
	;we will report the sheet as blank.
	itemStatus = msgSheetItemStatus_EmptySheet
endIf
SayFormattedMessage (OT_screen_message, itemStatus)
EndFunction

Int Function CellHasSmartTag(collection cCell)
return cCell.HasSmartTags
EndFunction

int Function countCellsWithDataInVisibleRange()
var
	object visibleRange,
	int CellsWithData
let visibleRange = oExcel.activeWindow.activePane.visibleRange
let cellsWithData = oExcel.evaluate(formatString(XLCountFunction, visibleRange.addressLocal))
return cellsWithData
EndFunction

string Function GetContentOfCells(string sAddress, string sSheetName)
Var
	string sTemp,
	String sText,
	object oRange,
	int iCount,
	int iVisibleRangeCount,
	int i
oRange = oExcel.worksheets(sSheetName).range(sAddress)
iCount = oRange.count
;for a single cell range:
If iCount == 1 then
	return oRange.text
EndIf
;check for range containing too many cells for running through loop to gather text,
;otherwise it may appear that JAWS has crashed when in fact it is processing a large number of cells.
iVisibleRangeCount = countCellsWithDataInVisibleRange()
if iCount > 1000
&& iCount > iVisibleRangeCount then
	iCount = iVisibleRangeCount
endIf
for i = 1 to iCount
	sTemp = oRange(i).text
	sText = sText+cscSpace+sTemp
EndFor
return StringTrimLeadingBlanks(sText)
EndFunction

string function getRangeText(string sRangeAddress)
var
	object oRange,
	int iCount,
	string sRangeText,
	string sText,
	int i
let oRange = oXLActiveSheet.range(sRangeAddress)
let iCount = oRange.cells.count
if iCount > 100 then
	let iCount = 100
EndIf
let i = 1
while i <= iCount
	let sText = oRange.cells(i).text
	if sText then
		let sRangeText = sRangeText+sText+cscSpace
	EndIf
	let i = i+1
endWhile
return StringTrimTrailingBlanks(sRangeText)
endFunction

string function GetMergedCellTextAtCoordinates(int iRow, int iColumn)
var
	object oRange
let oRange = oExcel.ActiveSheet.cells(iRow,iColumn)
if (oRange.MergeCells)*-1 then
	return oRange.mergeArea(1).cells(1).text
else
	return oRange.text
EndIf
EndFunction

string function GetActiveCellText()
return cxlActiveCell.text
EndFunction

string function GetObjectCellAddress(object oCell)
return oCell.addressLocal(false,false)
EndFunction

void Function GetActiveCellCoordinates(int ByRef row, int ByRef column)
let row = cXLActiveCell.row
let column = cXLActiveCell.column
EndFunction

string Function GetActiveCellAddress()
return cXLActiveCell.address
EndFunction

int function IsSelectionContiguous()
return cXLSelection.areaCount <=  1
EndFunction

int function GetSelectionCellCount()
return cXLSelection.cellCount
EndFunction

int function GetSelectionAreaCount()
return cXLSelection.areaCount
EndFunction

string function getSelectionAddress()
return cXLSelection.address
EndFunction

void function GetSelectionAddressRange(string byRef sStart, string byRef sEnd)
let sStart = cXLSelection.firstCell.address
let sEnd = cXLSelection.lastCell.address
EndFunction

string function GetSelectionAreaRanges()
var
	string key,
	collection c,
	string sRange,
	string sList
if cXLSelection.areaCount == 1 then
	if cXLSelection.CellCount == 1 then
		return cXLSelection.address
	else
		return FormatString(msgSpans1,
			cXLSelection.firstCell.address,
			cXLSelection.lastCell.address)
	EndIf
else
	let c = new collection
	let c = cXLSelection.areas
	ForEach key in c
		let sRange = c[key]
		let sList = sList+sRange+cscSpace
	EndForEach
	return StringTrimTrailingBlanks(sList)
EndIf
EndFunction

void function GetSelectionFirstAndLastCellText(string byRef sStart, string ByRef sEnd)
let sStart = cXLSelection.firstCell.text
let sEnd = cXLSelection.lastCell.text
EndFunction

int function DocNamedMultipleRegionSupport()
if !AllowPerformanceImpactingFeatures() return false endIf
var
	string key,
	int n
let n = NumOfNamedTitleRegionsOnCXLActiveSheet()
if !n then
	return false
elif n > 1 then
	return true
EndIf
;only if the single region starts at A1 and has no end to the range is this a single region:
ForEach key in cXLWorkbookNamedTitles
	if cXLActiveSheet.name == cXLWorkbookNamedTitles[key].sheetName
		if cXLWorkbookNamedTitles[key].rangeRowStart == 1
		&& cXLWorkbookNamedTitles[key].rangeRowEnd == 0
		&& cXLWorkbookNamedTitles[key].rangeColumnStart == 1
		&& cXLWorkbookNamedTitles[key].rangeColumnEnd == 0
			return false
		else
			return true
		EndIf
	EndIf
EndForEach
endFunction

int function DocNamedTitleReadingVerbosity()
var
	int i,
	int TitleReadingVerbosityFromUIA = cXLActiveCell.titles.titlesFromUIA
;the test for a UIA title must preceed the lite mode test, since we want the UIA title if lite mode is active.
if TitleReadingVerbosityFromUIA then return TitleReadingVerbosityFromUIA endIf
if !AllowPerformanceImpactingFeatures() return false endIf
let i = ActiveCellIsInUsedRangeOfNamedTitlesRegion()
if i then
	return cXLWorkbookNamedTitles[IntToString(i)].titleReading
else
	return 0
EndIf
EndFunction

int function ShouldReadTitles()
if !OverrideDocNamedTitles()
&& AllowPerformanceImpactingFeatures()
	return DocNamedTitleReadingVerbosity()
else
	;Allow UIA titles if lite mode is on and no titles have been manually set:
	var int verbosity = TitleReadingVerbosity()
	if !verbosity
	&& !AllowPerformanceImpactingFeatures()
	&& cXLActiveCell.titles.titlesFromUIA
		verbosity = true
	endIf
	return verbosity
EndIf
EndFunction

void function GetTitleLocation(string sSheetName, int iCellRow, int iCellColumn,
	int iTitleType, int ByRef iStart, int ByRef iEnd)
var
	collection c,
	int i
if iTitleType == RowType then
	if !OverrideDocNamedTitles()
	&& IsCellInNamedTitlesRegion(sSheetName,iCellRow,iCellColumn,i) then
		c = new collection
		c = cXLWorkbookNamedTitles[IntToString(i)]
		if c.titleReading & ReadRowTitles
			iStart = c.titleColumnStart
			iEnd = c.titleColumnEnd
		EndIf
	else
		GetRowTitleSettings(iStart,iEnd)
	EndIf
elif iTitleType == columnType then
	if !OverrideDocNamedTitles()
	&& IsCellInNamedTitlesRegion(sSheetName,iCellRow,iCellColumn,i) then
		c = new collection
		c = cXLWorkbookNamedTitles[IntToString(i)]
		if c.titleReading & ReadColumnTitles
			iStart = c.titleRowStart
			iEnd = c.titleRowEnd
		EndIf
	else
		getColTitleSettings(iStart,iEnd)
	EndIf
EndIf
EndFunction

void function GetActiveRowTitleLocation(int byRef iStart, int byRef iEnd)
GetTitleLocation(cXLActiveCell.sheetName,
	cXLActiveCell.row, cXLActiveCell.column,
	RowType, iStart, iEnd)
EndFunction

void function GetActiveColumnTitleLocation(int byRef iStart, int byRef iEnd)
GetTitleLocation(cXLActiveCell.sheetName,
	cXLActiveCell.row, cXLActiveCell.column,
	ColumnType, iStart, iEnd)
EndFunction

object Function GetTitleObject(string sSheetName, int iCellRow, int iCellColumn, int iTitleType)
var
	int iTitleStart,
	int iTitleEnd,
	object oStart,
	object oEnd,
	object oNull
if iTitleType == RowType then
	GetTitleLocation(sSheetName,iCellRow,iCellColumn,RowType,iTitleStart,iTitleEnd)
	if TitleSpeaksForCells() == TitleForCellsRightAndBelow then
		if iCellColumn <= iTitleEnd then
			;cell is not to right of title
			return oNull
		EndIf
	EndIf
elif iTitleType == ColumnType then
	GetTitleLocation(sSheetName,iCellRow,iCellColumn,ColumnType,iTitleStart,iTitleEnd)
	if TitleSpeaksForCells() == TitleForCellsRightAndBelow then
		if iCellRow <= iTitleEnd then
			;Cell is not below title
			return oNull
		EndIf
	EndIf
else
	return oNull
EndIf
if !iTitleStart
|| !iTitleEnd then
	;there is no title row or column specified
	return oNull
elif iTitleStart == iTitleEnd then
	if iTitleType == RowType then
		return oXLActiveSheet.rows(iCellRow).cells(iTitleStart)
	elif iTitleType == ColumnType then
		return oXLActiveSheet.columns(iCellColumn).cells(iTitleStart)
	EndIf
else
	if iTitleType == RowType then
		let oStart = oXLActiveSheet.rows(iCellRow).cells(iTitleStart)
		let oEnd = oExcel.ActiveSheet.rows(iCellRow).cells(iTitleEnd)
	elif iTitleType == ColumnType then
		let oStart = oXLActiveSheet.columns(iCellColumn).cells(iTitleStart)
		let oEnd = oExcel.ActiveSheet.columns(iCellColumn).cells(iTitleEnd)
	EndIf
	return oXLActiveSheet.range(oStart,oEnd)
EndIf
EndFunction

string function GetCellTitleText(string sSheetName, int iCellRow, int iCellColumn,
	int iTitleType, optional int bSpeakForAllCells)
var
	int i,
	int iTitleStart,
	int iTitleEnd,
	string sTitle,
	string sText
if iTitleType == RowType then
	GetTitleLocation(sSheetName,iCellRow,iCellColumn,RowType,iTitleStart,iTitleEnd)
	if TitleSpeaksForCells() == TitleForCellsRightAndBelow
	&& !bSpeakForAllCells then
		if iCellColumn <= iTitleEnd then
			;cell is not to right of title
			return cscNull
		EndIf
	EndIf
elif iTitleType == ColumnType then
	GetTitleLocation(sSheetName,iCellRow,iCellColumn,ColumnType,iTitleStart,iTitleEnd)
	if TitleSpeaksForCells() == TitleForCellsRightAndBelow
	&& !bSpeakForAllCells then
		if iCellRow <= iTitleEnd then
			;Cell is not below title
			return cscNull
		EndIf
	EndIf
else
	return cscNull
EndIf
if !iTitleStart
|| !iTitleEnd then
	;there is no title row or column specified
	return cscNull
EndIf
for i = iTitleStart to iTitleEnd
	if iTitleType == RowType then
		if i >= cXLCurrentRow.start
		&& i <= cXLCurrentRow.end then
			let sText = oXLActiveSheet.rows(iCellRow).cells(i).text
			if sText then
				let sTitle = sTitle+cscSpace+sText
			EndIf
		EndIf
	elif iTitleType == ColumnType then
		if i >= cXLCurrentColumn.start
		&& i <= cXLCurrentColumn.end then
			let sText = oXLActiveSheet.columns(iCellColumn).cells(i).text
			if sText then
				let sTitle = sTitle+cscSpace+sText
			EndIf
		EndIf
	EndIf
EndFor
return StringTrimLeadingBlanks(sTitle)
EndFunction

string function GetActiveCellRowTitleText()
return cXLActiveCell.titles.row
EndFunction

string function GetActiveCellColumnTitleText()
return cXLActiveCell.titles.column
EndFunction

void function GetValueToSetTitleRow(int byRef start, int byRef end)
let start = cXLSelection.row
let end = start + cXLSelection.rowCount-1
EndFunction

void function GetValueToSetTitleColumn(int byRef start, int byRef end)
let start = cXLSelection.column
let end = start + cXLSelection.columnCount-1
EndFunction

void function GetDefaultValueToSetTitleRow(int byRef start, int byRef end)
var
	object oCell
if !MultipleRegionSupport ()
|| !AllowPerformanceImpactingFeatures()
	let start = 1
	let oCell = oXLActiveSheet.cells(1)
	if oCell.mergeCells != VBTrue then
		let end = 1
	else
		let end = start + oCell.MergeArea.rows.count -1
	EndIf
else
	let start = getCurrentRegionTop()
	let oCell = oXLActiveSheet.cells(start,getCurrentRegionLeft())
	if oCell.mergeCells != VBTrue then
		let end = start
	else
		let end = start + oCell.MergeArea.rows.Count -1
	EndIf
EndIf
EndFunction

void function GetDefaultValueToSetTitleColumn(int byRef start, int byRef end)
var
	object oCell
if !MultipleRegionSupport ()
|| !AllowPerformanceImpactingFeatures()
	let start = 1
	let oCell = oXLActiveSheet.cells(1)
	if oCell.mergeCells != VBTrue then
		let end = 1
	else
		let end = start + oCell.MergeArea.columns.count -1
	EndIf
else
	let start = getCurrentRegionLeft ()
	let oCell = oXLActiveSheet.columns.cells(getCurrentRegionTop(),start)
	if oCell.mergeCells != VBTrue then
		let end = start
	else
		let end = start + oCell.MergeArea.columns.Count -1
	EndIf
EndIf
EndFunction

string function GetRowText(optional string sSeparator, string sCurrentCoordinateTemplate, string sBlankCellText,
	int nStartCol, int nEndCol)
var
	string sSeparatorLocal,
	string sCoordinateTemplateLocal,
	object oUsedRange,
	object RowCells,
	int nFirstUsedCol,
	int nLastUsedCol,
	int nFirstUsedRow,
	int nLastUsedRow,
	int index,
	string sTemp,
	string sText
if !worksheetHasFocus()
	return GetRowText(sSeparator,sCurrentCoordinateTemplate,sBlankCellText,nStartCol,nEndCol)
EndIf
if !sSeparator then
	let sSeparatorLocal=cscSpace
else
	let sSeparatorLocal=sSeparator
EndIf
if sCurrentCoordinateTemplate then
	let sCoordinateTemplateLocal = FormatString(sCurrentCoordinateTemplate,
		IntToString(cXLActiveCell.column),IntToString(cXLActiveCell.row))
EndIf
let oUsedRange = oXLSheetUsedRange()
let RowCells = oXLActiveCell.entireRow
let nFirstUsedCol = oUsedRange.Column
let nLastUsedCol = oUsedRange.Columns.Count+nFirstUsedCol-1
let nFirstUsedRow = oUsedRange.Row
let nLastUsedRow = oUsedRange.Rows.Count+nFirstUsedRow-1
if !nFirstUsedCol
|| !nLastUsedCol
|| !nFirstUsedRow
|| !nLastUsedRow then
	;object model failed
	return cscNull
EndIf
if sCoordinateTemplateLocal then
	let sText = sCoordinateTemplateLocal+cscSpace
EndIf
;if we are outside of the used range of cells, only report one blank cell
if cXLActiveCell.row < nFirstUsedRow
|| cXLActiveCell.row >nLastUsedRow
|| cXLActiveCell.column < nFirstUsedCol
|| cXLActiveCell.column > nLastUsedCol then
	return sText+sBlankCellText
EndIf
;calculate starting position before ending position,
;since a change in the starting column may effect the ending column
if !nStartCol then
	;start at the beginning of the used data column
	let nStartCol = nFirstUsedCol
ElIf nStartCol>nLastUsedCol then
	;the requested starting column is to the right of the used data columns,
	;so only report one column
	let nLastUsedCol = nStartCol
EndIf
if !nEndCol
|| nEndCol > nLastUsedCol then
	;only report on the actual number of columns in use
	let nEndCol = nLastUsedCol
ElIf nStartCol > nEndCol then
	;Invalid range, so only report on one column
	let nEndCol = nStartCol
EndIf
let index = nStartCol
while index <= nEndCol
	let sTemp = RowCells.cells(index).text
	if sTemp then
		let sText = sText+sSeparatorLocal+sTemp
	else
		let sText = sText+cscSpace+sBlankCellText
	EndIf
	let index = index+1
EndWhile
return sText
EndFunction

string function GetColumnText(optional string sSeparator, string sCurrentCoordinateTemplate, string sBlankCellText,
	int nStartRow, int nEndRow)
var
	string sSeparatorLocal,
	string sCoordinateTemplateLocal,
	object oUsedRange,
	object ColumnCells,
	int nFirstUsedCol,
	int nLastUsedCol,
	int nFirstUsedRow,
	int nLastUsedRow,
	int index,
	string sTemp,
	string sText
if IsVirtualPCCursor()
|| GetWindowCategory() != wCat_SpreadSheet then
	return GetColumnText(sSeparator,sCurrentCoordinateTemplate,sBlankCellText,nStartRow,nEndRow)
EndIf
if !sSeparator then
	let sSeparatorLocal=cscSpace
else
	let sSeparatorLocal=sSeparator
EndIf
if sCurrentCoordinateTemplate then
	let sCoordinateTemplateLocal = FormatString(sCurrentCoordinateTemplate,
		IntToString(cXLActiveCell.column),IntToString(cXLActiveCell.Row))
EndIf
let oUsedRange = oXLSheetUsedRange()
let ColumnCells = oXLActiveCell.entireColumn
let nFirstUsedCol = oUsedRange.Column
let nLastUsedCol = oUsedRange.Columns.Count+nFirstUsedCol-1
let nFirstUsedRow = oUsedRange.Row
let nLastUsedRow = oUsedRange.Rows.Count+nFirstUsedRow-1
if !nFirstUsedCol
|| !nLastUsedCol
|| !nFirstUsedRow
|| !nLastUsedRow then
	;object model failed
	return cscNull
EndIf
if sCoordinateTemplateLocal then
	let sText = sCoordinateTemplateLocal+cscSpace
EndIf
;if we are outside of the used range of cells, only report one blank cell
if cXLActiveCell.row < nFirstUsedRow
|| cXLActiveCell.row > nLastUsedRow
|| cXLActiveCell.column < nFirstUsedCol
|| cXLActiveCell.column > nLastUsedCol then
	return sText+sBlankCellText
EndIf
;calculate starting position before ending position,
;since a change in the starting column may effect the ending column
if !nStartRow then
	;start at the beginning of the used data row
	let nStartRow = nFirstUsedRow
ElIf nStartRow > nLastUsedRow then
	;the requested starting row is below the used data rows,
	;so only report one row
	let nLastUsedRow = nStartRow
EndIf
if !nEndRow
|| nEndRow > nLastUsedRow then
	;only report on the actual number of rows in use
	let nEndRow = nLastUsedRow
ElIf nStartRow > nEndRow then
	;Invalid range, so only report on one row
	let nEndRow = nStartRow
EndIf
let index = nStartRow
while index <= nEndRow
	let sTemp = ColumnCells.cells(index).text
	if sTemp then
		let sText = sText+sSeparatorLocal+sTemp
	else
		let sText = sText+cscSpace+sBlankCellText
	EndIf
	let index = index+1
EndWhile
return sText
EndFunction


string function GetBrlRowContextDataHelper(int ByRef iActiveCellPosition, int iRow, int iColumn)
var
	string sRowContextText,
	string sCellText,
	int iCellsShown = 10,	;SSB-SM: The number of cells we want on the display
	int iMaxColumn,
	int iStart,
	int iEnd,
	int i
let iMaxColumn = oXLActiveSheet.rows(iRow).cells(iColumn).EntireRow.Columns.count
if iColumn <= (iCellsShown-1) then
	let iStart = 1
else
	let iStart = (iColumn-(iCellsShown-1))
EndIf
if iColumn >= (iMaxColumn-(iCellsShown-1)) then
	let iEnd = iMaxColumn
else
	let iEnd = iColumn+(iCellsShown-1)
EndIf
let iActiveCellPosition = iColumn-iStart+1
let i = iStart
while i <= iEnd
	if oXLActiveSheet.columns(i).hidden != vbTrue then
		let sCellText = oXLActiveSheet.rows(iRow).cells(i).text
		let sRowContextText = sRowContextText+sCellText+cscSpace+LIST_ITEM_SEPARATOR+cscSpace
	else ; is hidden
		; Update the active cell position or position will be off by the number of cells that are hidden:
		if ! StringIsBlank (oXLActiveSheet.rows(iRow).cells(i).text)
		&& iActiveCellPosition > iStart then
			iActiveCellPosition = (iActiveCellPosition-1)
		endIf
	EndIf
	let i = i+1
endWhile
return StringChopRight(sRowContextText,1)
EndFunction

string function GetBrlRowContextData(int ByRef iActiveCellPosition)
return GetBrlRowContextDataHelper(iActiveCellPosition, cXLActiveCell.row, cXLActiveCell.column)
endFunction

string function GetBrlColumnContextData(int ByRef iActiveCellPosition)
var
	string sColumnContextText,
	string sCellText,
	int iCellsShown = 10,	;SSB-SM: The number of cells we want on the display
	int iMaxRow,
	int iColumn,
	int iRow,
	int iStart,
	int iEnd,
	int i
let iColumn = oXLActiveCell.column
let iRow = cXLActiveCell.row
let iMaxRow = oXLActiveCell.EntireColumn.Rows.count
if iRow <= (iCellsShown-1) then
	let iStart = 1
else
	let iStart = (iRow-(iCellsShown-1))
EndIf
if iRow >=  (iMaxRow-(iCellsShown-1)) then
	let iEnd = iMaxRow
else
	let iEnd = iRow+(iCellsShown-1)
EndIf
let iActiveCellPosition = iRow-iStart+1
let i = iStart
while i <= iEnd
	if oXLActiveSheet.rows(i).hidden != vbTrue then
		let sCellText = oXLActiveSheet.columns(iColumn).cells(i).text
		let sColumnContextText = sColumnContextText+sCellText+cscSpace+LIST_ITEM_SEPARATOR+cscSpace
	else ; is hidden
		; Update the active cell position or position will be off by the number of cells that are hidden:
		if ! StringIsBlank (oXLActiveSheet.columns(iColumn).cells(i).text)
		&& iActiveCellPosition > iStart then
			iActiveCellPosition = (iActiveCellPosition-1)
		endIf
	EndIf
	let i = i+1
endWhile
return StringChopRight(sColumnContextText,1)
EndFunction
string Function ColumnNumberToLetter(int i)
var
	int quotient,
	int remainder1,
	int remainder2
let i= i-1
let quotient = (i)/26
let remainder1 = quotient%27
let remainder2 = i%26
return SubString(alphabet,remainder1+1,1)
	+SubString(alphabet,remainder2+2,1)
EndFunction

int Function GetColumnNumberFromAddress(string sAddress)
var
	string sChar1,
	string sChar2,
	int iChar1,
	int iChar2,
	int iChar,
	int iLength
let sAddress = StringUpper(sAddress)
let iLength = stringLength(sAddress)
; Determine chars from the difference between ASCII value of char and 64, which is between 65 and 90.
let sChar1 = SubString(sAddress,1,iLength)
let iChar1 = GetCharacterValue(sChar1)
let iChar1 = iChar1-64 ;the ASCII value
;test length of string being checked.
;either the string is a cell address that needs parsing, or the column number is past the first 26 columns on the worksheet.
if iLength > 1 then
	let sChar2 = substring(sAddress,2,iLength)
	; if sChar2 successfully converts to an integer, it is a digit.
	; Therefore, sChar1 is the column, and it is between 1 and 26.
	let iChar2 = GetCharacterValue(sChar2)
	if iChar2 >= 48
	&& iChar2 <= 57 then ; second char is a digit.
		let iChar2 = 0   ; it is a digit.
	Else
		let iChar2 = iChar2-64 ;ASCII value
	endIf
endIf
If iChar2 == 0 then
	let iChar = iChar1
Else
	let iChar = iChar1*26+iChar2 ;column number past first 26 columns on worksheet
EndIf
return iChar
EndFunction

int Function GetRowNumberFromAddress(string sAddress)
var
	string sChar2,
	int iChar2,
	int iChar,
	int iLength
let iLength = stringLength(sAddress)
; Determine chars from the difference between ASCII value of char and 64, which is between 65 and 90.
let sChar2 = substring(sAddress,2,iLength)
let iChar2 = GetCharacterValue(sChar2)
; if sChar2 successfully converts to an integer, it is a digit.
; therefore the rest of the string is digits.
; in this case, we eliminate  char1 from the sAddress string.
If iChar2 >= 48
&& iChar2 <= 57 then ; second char is a digit.
	let sAddress = substring(sAddress,2,iLength)
	let iChar = stringToInt(sAddress)
Else
	let sAddress = substring(sAddress,3,iLength)
	let iChar = StringToInt(sAddress)
endIf
return iChar
EndFunction

string function GetAddressSpellString(string sAddress)
return GetSpellString(StringReplaceSubStrings(
	GetSpellString(sAddress),cscSpace,cscNull))
EndFunction

string function ConvertAInAddressToUpperCase(string sAddress)
if stringContains(sAddress,"a") == 1
&& StringLength(sAddress) <= 2 then
	let sAddress=StringReplaceSubStrings(GetSpellString(sAddress),scColumnA,scUpperColumnA)
endIf
return sAddress
EndFunction

string Function GetNonRegionTitleRangeName(object oRange)
var
	int i,
	int count,
	object oNames,
	object oName,
	object oReferedRange,
	string sName,
	string sLowerName,
	string sNameAddress
let oNames = oXLActiveWorkbook.names
let count = oNames.count
if count == 0 then
	return cscNull
endIf
let i = 1
while i <= count
	let oName = oNames(i)
	let sName = oName.name
	let sNameAddress = oName.refersTo
	if StringContains(sNameAddress,cXLActiveSheet.name) then
		let oReferedRange = oName.refersToRange
		if oReferedRange then
			if oExcel.intersect(oRange,oReferedRange) then
				if IsNamedRegionTitleString(sName) then
					return cscNull
				else
					return sName
				endIf
			EndIf
		endIf
	endIf
	let i = i+1
endWhile
return cscNull
EndFunction

string function GetCurrentRegionName()
if !AllowPerformanceImpactingFeatures()
	return formatString(msgRegionSpans2_L,
		cXLCurrentRegion.topLeft,cXLCurrentRegion.bottomRight )
endIf
var
	int iLast,
	object oRange,
	string sName
let oRange = GetNamedRegionRangeObject(oXLActiveCell)
if oRange then
	let sName = getNonRegionTitleRangeName(oXLActiveCell)
	If sName then
		return sName
	EndIf
EndIf
return formatString(msgRegionSpans2_L,
	cXLCurrentRegion.topLeft,cXLCurrentRegion.bottomRight )
EndFunction

string Function GetRegionSectionName()
var
	string sWorksheetName,
	string sRangeName,
	string sRegionTopLeft
; if multiple region support is enabled then
; either the named range of cells will be used or
; if the cell is not in a named range then the current region will be used.
; otherwise the sheet name alone will be used.
let sWorksheetName = cXLActiveSheet.name
if !MultipleRegionSupport()
|| !AllowPerformanceImpactingFeatures()
	return sWorksheetName
endIf
let sRangeName = getNonRegionTitleRangeName(oXLActiveCell)
let sRegionTopLeft = cXLCurrentRegion.TopLeft
if sRangeName then
	if !OverrideDocNamedTitles()
	&& stringContains(stringLower(sRangeName),scTitleRegionRangeName) then
		;don't want to use range name as it may conflict with document named region titles
		return sWorksheetName+cscSpace+sRegionTopLeft
	else
		return sWorksheetName+cscSpace+sRangeName
	endIf
else
	return sWorksheetName+cscSpace+sRegionTopLeft
endIf
EndFunction

int function worksheetHasFocus()
if getWindowClass(getFocus()) != wcExcel7 return false endIf
var int type = GetObjectSubtypeCode()
if (type == wt_edit || type == wt_TabControl) return false endIf
return isPcCursor()
	&& !UserBufferIsActive()
	&& (oExcel.activeCell || oExcel.ActiveSheet)
endFunction

int Function isCXLAutoFilterMode()
return cXLActiveSheet.AutoFilterMode
EndFunction

string Function GetDescriptionOfAutofilterSort()
var
	object oSort,
	int iOn,
	int iOrientation,
	string sAddress,
	string smsgOn,
	string sMsgOrientation,
	string sDesc
let oSort = oXLActiveSheet.autoFilter.sort
if !oSort then
	return cscNull
endIf
let sAddress = oSort.range.addressLocal(false,false)
let iOn = oSort.sortOn
let iOrientation = oSort.orientation
if iOn == xlSortOnCellColor then
	let smsgOn = msgSortOnCellColor
elIf iOn == xlSortOnFontColor then
	let smsgOn = msgSortOnFontColor
elIf iOn == xlSortOnIcon then
	let smsgOn = msgSortOnIcon
ElIf iOn == xlSortOnValues then
	let smsgOn = msgSortOnValues
endIf
if iOrientation == xlSortColumns then
	let sMsgOrientation = msgSortByColumns
elif iOrientation == xlSortrows then
	let sMsgOrientation = msgSortByRows
endIf
let sDesc = formatString(msgSortDescription,sMsgOn,sMsgOrientation,sAddress)
return sDesc
EndFunction

string Function GetWorksheetWindowView()
var
	object oWindow,
	string sView
let oWindow=oExcel.activeWindow
let sView=cscNull
if oWindow.split then
	let sView = msgSplitWindow
endIf
If oWindow.freezePanes then
	if !sView then
		let sView = msgFreezePanesWindow
	else
		let sView = sView+scAnd+msgFreezePanesWindow
	endIf
endIf
return sView
EndFunction

int function getCXLFontAttributes(collection cFont)
var
	int iAttributes
;we only support bold, italic, underline and strikethrough
if cFont.bold then
	let iAttributes = iAttributes & attrib_bold
endIf
if cFont.italic then
	let iAttributes = iAttributes & attrib_italic
endIf
if cFont.underline then
	let iAttributes = iAttributes & attrib_underline
endIf
if cFont.strikethrough then
	let iAttributes = iAttributes & attrib_Strikeout
endIf
return iAttributes
endFunction

void Function GetFontColors(int ByRef iTextColor, int byRef iBackgroundColor)
Var
	object oRange,
	object oFont,
	string sAddress
let sAddress = oXLSelection.cells.addressLocal(false,false)
let oRange = oXLActiveSheet.range(sAddress)
let oFont = oRange.font
let iTextColor = oFont.color
let iBackgroundColor = oFont.background
EndFunction

string Function GetColorDescription(int color)
if color==xlColorAqua then
	return msg338_L
elif color==xlColorBlack then
	return msg339_L
elif color==xlColorBlue then
	return msg340_L
elif color==xlColorBlueGray then
	return msg341_L
elif color==xlColorBrightGreen then
	return msg342_L
elif color==xlColorBrown then
	return msg343_L
elif color==xlColorDarkBlue then
	return msg344_L
elif color==xlColorDarkGreen then
	return msg345_L
elif color==xlColorDarkRed then
	return msg346_L
elif color==xlColorDarkTeal then
	return msg347_L
elif color==xlColorDarkYellow then
	return msg348_L
elif color==xlColorGold then
	return msg349_L
elif color==xlColorGray05 then
	return msg350_L
elif color==xlColorGray10 then
	return msg351_L
elif color==xlColorGray125 then
	return msg352_L
elif color==xlColorGray15 then
	return msg353_L
elif color==xlColorGray20 then
	return msg354_L
elif color==xlColorGray25 then
	return msg355_L
elif color==xlColorGray30 then
	return msg356_L
elif color==xlColorGray35 then
	return msg357_L
elif color==xlColorGray375 then
	return msg358_L
elif color==xlColorGray40 then
	return msg359_L
elif color==xlColorGray45 then
	return msg360_L
elif color==xlColorGray50 then
	return msg361_L
elif color==xlColorGray55 then
	return msg362_L
elif color==xlColorGray60 then
	return msg363_L
elif color==xlColorGray625 then
	return msg364_L
elif color==xlColorGray65 then
	return msg365_L
elif color==xlColorGray70 then
	return msg366_L
elif color==xlColorGray75 then
	return msg367_L
elif color==xlColorGray80 then
	return msg368_L
elif color==xlColorGray85 then
	return msg369_L
elif color==xlColorGray875 then
	return msg370_L
elif color==xlColorGray90 then
	return msg371_L
elif color==xlColorGray95 then
	return msg372_L
elif color==xlColorGreen then
	return msg373_L
elif color==xlColorIndigo then
	return msg374_L
elif color==xlColorLavender then
	return msg375_L
elif color==xlColorLightBlue then
	return msg376_L
elif color==xlColorLightGreen then
	return msg377_L
elif color==xlColorLightOrange then
	return msg378_L
elif color==xlColorLightTurquoise then
	return msg379_L
elif color==xlColorLightYellow then
	return msg380_L
elif color==xlColorLime then
	return msg381_L
elif color==xlColorOliveGreen then
	return msg382_L
elif color==xlColorOrange then
	return msg383_L
elif color==xlColorPaleBlue then
	return msg384_L
elif color==xlColorPink then
	return msg385_L
elif color==xlColorPlum then
	return msg386_L
elif color==xlColorRed then
	return msg387_L
elif color==xlColorRose then
	return msg388_L
elif color==xlColorSeaGreen then
	return msg389_L
elif color==xlColorSkyBlue then
	return msg390_L
elif color==xlColorTan then
	return msg391_L
elif color==xlColorTeal then
	return msg392_L
elif color==xlColorTurquoise then
	return msg393_L
elif color==xlColorViolet then
	return msg394_L
elif color==xlColorWhite then
	return msg395_L
elif color==xlColorYellow then
	return msg396_L
ElIf color==xlColorPeriwinkle then
	return msg397_l
ElIf color==xl2010ColorPurple then
	return msgxl2010ColorPurple
ElIf color==xl2010ColorDarkBlue then
	return msgxl2010ColorDarkBlue
ElIf color==xl2010ColorBlue then
	return msgxl2010ColorBlue
elif color==xl2010ColorLiteBlue then
	return msgxl2010ColorLiteBlue
ElIf color==xl2010ColorGreen then
	return msgxl2010ColorGreen
ElIf color==xl2010ColorLiteGreen then
	return msgxl2010ColorLiteGreen
elif color==xl2010ColorOrange then
	return msgxl2010ColorOrange
ElIf color==xl2010ColorDarkRed then
	return msgxl2010ColorDarkRed
else
	;not standard color
	return stringMixedCaseToMultiWord(GetColorName(color))
endIf
; note we ignore automatic color as it doesn't sound good saying surrounding automatic dotted line.
EndFunction

string Function GetCXLRangeShadingInfo(collection cRange)
Var
	string sForeground,
	int iPattern,
	string sBackground,
	string sMsg
let sBackground = GetColorDescription(cRange.interior.backgroundColor)
let sForeground = GetColorDescription(cRange.interior.foregroundColor)
let iPattern = cRange.interior.Pattern
If iPattern == xlPatternNone then
	return msgPatternNone
ElIf iPattern == xlPatternSolid then
	return FormatString(msgPatternSolid,sBackground)
Elif iPattern == xlPatternAutomatic*-1 then
	return msgPatternAutomatic
ElIf iPattern == xlPatternChecker then
	return FormatString(msgPatternChecker,sForeground,sBackground)
ElIf iPattern == xlPatternCrissCross then
	return formatString(msgPatternCrissCross,sForeground,sBackground)
ElIf iPattern == xlPatternDown*-1 then
	return formatString(msgPatternDown,sForeground,sBackground)
ElIf iPattern == xlPatternGray16 then
	return formatString(msgPatternGray16,sForeground,sBackground)
ElIf iPattern == xlPatternGray25*-1 then
	return formatString(msgPatternGray25,sBackground)
ElIf iPattern == xlPatternGray50*-1 then
	return formatString(msgPatternGray50,sBackground)
ElIf iPattern == xlPatternGray75*-1 then
	return formatString(msgPatternGray75,sBackground)
ElIf iPattern == xlPatternGray8 then
	return formatString(msgPatternGray8,sBackground)
elIf iPattern == xlPatternGrid then
	return formatString(msgPatternGrid,sForeground,sBackground)
ElIf iPattern == xlPatternHorizontal*-1 then
	return formatString(msgPatternHorizontal ,sForeground,sBackground)
ElIf iPattern == xlPatternLightDown then
	return formatString(msgPatternLightDown,sForeground,sBackground)
ElIf iPattern == xlPatternLightHorizontal then
	return formatString(msgPatternLightHorizontal,sForeground,sBackground)
ElIf iPattern == xlPatternLightUp then
	return formatString(msgPatternLightUp,sForeground,sBackground)
ElIf iPattern == xlPatternLightVertical then
	return formatString(msgPatternLightVertical,sForeground,sBackground)
ElIf iPattern == xlPatternSemiGray75 then
	return formatString(msgPatternSemiGray75,sForeground,sBackground)
ElIf iPattern == xlPatternUp*-1 then
	return formatString(msgPatternUp,sForeground,sBackground)
ElIf iPattern == xlPatternVertical*-1 then
	return formatString(msgPatternVertical,sForeground,sBackground)
EndIf
EndFunction

void function GetCXLRangeTextAndBackgroundColors(collection cRange, int ByRef iTextColor, int ByRef iBackgroundColor)
var
	string sShading
let iTextColor = cRange.font.foregroundColor
let iBackgroundColor = cRange.font.backgroundColor
let sShading = GetCXLRangeShadingInfo(cRange)
if iBackgroundColor == xlColorBlack then
	if !sShading then
		let iBackgroundColor = xlColorWhite
	Else
		let iBackgroundColor = cRange.interior.backgroundColor
	EndIf
EndIf
EndFunction

string  Function GetCXLRangeNumberFormatDescription(collection cRange)
var
	string format,
	int decimalPlaces,
	int iTmp
let format = cRange.numberFormatLocal
let decimalPlaces = 0
;get decimal places
let iTmp = stringContains(format,scDecimalPoint)
if iTmp then
	let iTmp = iTmp+1 ; move onto first char after decimal point
	while subString(format,iTmp,1) != cscSpace
	&& subString(format,iTmp,1) != scFormatDelimiter
	&& subString(format,iTmp,1) != scFormatSectionDelimiter
	&& iTmp <= stringLength(format)
		let decimalPlaces = decimalPlaces+1
		let iTmp = iTmp+1
	endWhile
endIf
; must test in a specific order
if stringContains(format,scFormatAccounting) then
	return formatString(msgFormatAccounting1_L, intToString(decimalPlaces))
elif stringContains(format,scFormatCurrency)
&& !StringContains(Format,scFormatTime) then
	return formatString(msgFormatCurrency1_L, intToString(decimalPlaces))
elif stringContains(format,scFormatPercent) then
	return msgFormatPercent1_L
elif stringContains(format, scFormatFraction) then
	return msgFormatFraction1_L
elif stringContains(format,scFormatTime) then
	return formatString(msgFormatTime1_L, format)
elif stringContains(format,scFormatDate) then
	return formatString(msgFormatDate1_L, format)
elif format == scFormatGeneral then
	return msgFormatGeneral1_L
elif format == scFormatText then
	return msgFormatText1_L
elif stringContains(format,scFormatScientific) then
	return formatString(msgFormatScientific1_L, intToString(decimalPlaces))
elif stringContains(format,scFormatNumber) then
	return formatString(msgFormatNumber1_L, intToString(decimalPlaces))
else
	return formatString(msgFormatCustom1_L, format)
endIf
EndFunction

string Function GetCXLActiveCellHorizontalAlignmentInfo()
var
	int alignment
let alignment = cXLActiveCell.horizontalAlignment
if alignment == xlHAlignGeneral then
	return msg37_L
elif alignment == xlHAlignFill then
	return msg36_L
elif alignment == xlHAlignCenterAcrossSelection then
	return msg35_L
endIf
if alignment < 0 then
	; rest are negative but are stored as positive constants due to script language limitations
	let alignment = (alignment)*-1
endIf
if alignment == xlHAlignCenter then
	return msgCentered
elif alignment == xlHAlignDistributed then
	return msg33_L
elif alignment == xlHAlignJustify then
	return msgJustified
elif alignment == xlHAlignLeft then
	return msgAlignedLeft
elif alignment == xlHAlignRight then
	return msgAlignedRight
endIf
EndFunction

string Function GetCXLActiveCellVerticalAlignmentInfo()
var
	int alignment
let alignment = cXLActiveCell.verticalAlignment
if alignment < 0 then
	; consts are negative but stored as positive due to limitations of the script language
	let alignment = (alignment)*-1
endIf
if alignment == xlVAlignBottom then
	return msg38_L
elif alignment == xlVAlignCenter then
	return msgCentered
elif alignment == xlVAlignDistributed then
	return msg33_L
elif alignment == xlVAlignJustify then
	return msgJustified
elif alignment == xlVAlignTop then
	return msg39_L
endIf
EndFunction

int function ConvertOrientationToDegrees(int iOrientation)
; Excel orientation calculates between -90 and 90 degrees,
; except for the following conditions which must be changed manually:
If iOrientation  == (xlOrient270)*-1 then
	return -90
ElIf iOrientation  ==  (xlOrient90)*-1 then
	return 90
ElIf iOrientation  == (xlOrient360)*-1
|| iOrientation  == (xlOrientNormal)*-1 then
	return 0
else
	return iOrientation
EndIf
EndFunction

string function GetCXLRangeFontUnderlineAndEffectInfo(collection cRange, string sDelim)
var
	string sMsg
let sMsg = sDelim
if cRange.font.underline == xlUnderlineStyleSingle then
	let sMsg = sMsg+msg23_l+sDelim
elif cRange.font.underline==xlUnderlineStyleSingleAccounting then
	let sMsg = smsg+msg24_l+sDelim
elif (cRange.font.underline)*-1 ==xlUnderlineStyleDouble then
	let sMsg = smsg+msg25_l+sDelim
elif cRange.font.underline == xlUnderlineStyleDoubleAccounting then
	let sMsg = smsg+msg26_l+sDelim
endIf
if cRange.font.strikeThrough then
	let sMsg = smsg+msg27_l+sDelim
endIf
if cRange.font.subscript then
	let sMsg = smsg+msg28_l+sDelim
endIf
if cRange.font.superscript then
	let sMsg = smsg+msg29_l+sDelim
endIf
return StringChopLeft(StringChopRight(sMsg,1),1)
EndFunction

string function GetCXLRangeFontInfo(collection cRange, int bIsActiveCell, int bIsTitle, string sDelim, int iMessageLength)
var
	string sMsg,
	int iTextColor,
	int iBackgroundColor,
	int iOrientation,
	string s
let sMsg = sDelim
let s = GetCXLRangeFontUnderlineAndEffectInfo(cRange,sDelim)
if s then
	let sMsg = sMsg+s+sDelim
EndIf
GetCXLRangeTextAndBackgroundColors(cRange,iTextColor,iBackgroundColor)
if bIsTitle then
	let sMsg = smsg+formatString(msgTitleCellTextColor,getColorDescription(iTextColor))+sDelim
	let sMsg = smsg+FormatString(msgTitleCellBackgroundColor,getColorDescription(iBackgroundColor))+sDelim
else
	let sMsg = smsg+formatString(msgCellTextColor,getColorDescription(iTextColor))+sDelim
	let sMsg = smsg+FormatString(msgCellBackgroundColor,getColorDescription(iBackgroundColor))+sDelim
EndIf
let s = cRange.font.name
let sMsg = sMsg+s+sDelim
let s = cRange.font.fontStyle
let sMsg = sMsg+s+sDelim
let s = formatString(msgPoint1_L,intToString(cRange.font.size))
let sMsg = sMsg+s+sDelim
if !bIsTitle then
	if bIsActiveCell then
		let sMsg = sMsg+msgHighlighted+sDelim
	EndIf
	if iMessageLength == message_long then
		let s = formatString(msgCellHAlignment1_L,GetCXLActiveCellHorizontalAlignmentInfo())
	else
		let s = formatString(msgCellHAlignment1_S,GetCXLActiveCellHorizontalAlignmentInfo())
	EndIf
	let sMsg = sMsg+s+sDelim
EndIf
if cRange.indentLevel > 0 then
	if !bIsTitle then
		let s = formatString(msgCellIndentLevel1_L,IntToString(cRange.indentLevel))
	else
		let s = formatString(msgTitleCellIndentLevel1_L,IntToString(cRange.indentLevel))
	EndIf
	let sMsg = sMsg+s+sDelim
EndIf
if !bIsTitle then
	if iMessageLength == message_long then
		let sMsg = sMsg+formatString(msgCellVAlignment1_L,GetCXLActiveCellVerticalAlignmentInfo())+sDelim
	else
		let sMsg = sMsg+formatString(msgCellVAlignment1_S,GetCXLActiveCellVerticalAlignmentInfo())+sDelim
	EndIf
EndIf
let iOrientation = ConvertOrientationToDegrees(cRange.orientation)
if iOrientation != 0 then
	if bIsTitle then
		let sMsg = sMsg+FormatString(msgTitleCellOrientation,IntToString(iOrientation))+sDelim
	else
		let sMsg = sMsg+FormatString(msgOrientation,IntToString(iOrientation))+sDelim
	EndIf
EndIf
if bIsTitle then
	let sMsg = sMsg+formatString(msgTitleCellNumberFormat1_L,getCXLRangeNumberFormatDescription(cRange))+sDelim
else
	if iMessageLength == message_long then
		let sMsg = sMsg+formatString(msgTitleCellNumberFormat1_L,GetCXLRangeNumberFormatDescription(cRange))+sDelim
	else
		let sMsg = sMsg+formatString(msgTitleCellNumberFormat1_S,GetCXLRangeNumberFormatDescription(cRange))+sDelim
	EndIf
EndIf
let s = cRange.style.name
if bIsTitle then
	let sMsg = sMsg+formatString(msgTitleCellStyle,s)+sDelim
else
	let sMsg = sMsg+s+sDelim
EndIf
if bIsTitle then
	let sMsg = sMsg+formatString(msgTitleCellDimensions1_L,intToString(cRange.width),intToString(cRange.height))+sDelim
else
	if iMessageLength == message_long then
		let sMsg = sMsg+formatString(msgCellDimensions1_L,intToString(cRange.width),intToString(cRange.height))+sDelim
	else
		let sMsg = sMsg+formatString(msgCellDimensions1_S,intToString(cRange.width),intToString(cRange.height))+sDelim
	EndIf
endIf
return StringChopLeft(StringChopRight(sMsg,1),1)
EndFunction

string Function GetTitleCellFontAndFormattingInfo(object oCell, int bUserBuffer)
Var
	collection cRange,
	int iCellColumn,
	int iCellRow,
	string sCellSheetName,
	object oColumnTitleCells,
	object oRowTitleCells,
	string sMsgCol,
	string sMsgRow,
	string sDelim,
	string smsg
let iCellColumn = oCell.column
let iCellRow = oCell.row
let sCellSheetName = oCell.parent.name
let oColumnTitleCells = GetTitleObject(sCellSheetName,iCellRow,iCellColumn,ColumnType)
let oRowTitleCells = GetTitleObject(sCellSheetName,iCellRow,iCellColumn,RowType)
if !oColumnTitleCells
&& !oRowTitleCells then
	return cscNull
endIf
if bUserBuffer then
	let sDelim = cscBufferNewLine
else
	let sDelim = cscSpace
EndIf
let cRange = new collection
UpdateCXLRangeAllData(cRange,oColumnTitleCells)
let smsgCol = GetCXLRangeFontInfo(cRange,false,true,sDelim,message_short)
if smsgCol then
	let smsg = formatString(msgTitleColumnCellInfo,msgTitleCellFont1_L)+sDelim+smsgCol
endIf
UpdateCXLRangeAllData(cRange,oRowTitleCells)
let smsgRow = GetCXLRangeFontInfo(cRange,false,true,sDelim,message_short)
if smsgRow then
	if smsg then
		let smsg = smsg+cscBufferNewLine+formatString(msgTitleRowCellInfo,msgTitleCellFont1_L)+sDelim+smsgRow
	else
		let smsg = msgTitleRowCellInfo+sDelim+smsgRow
	endIf
endIf
return smsg
EndFunction

int function ActiveCellHasValidationInputMessage()
return cXLActiveCell.validation.inCellDropDown || cXLActiveCell.validation.inputMessage
EndFunction

int function ActiveCellValidationShowInput()
return cXLActiveCell.validation.ShowInput
EndFunction

string Function GetValidationMessage(int iType, optional int iMsgType)
If iType == xlValidateCustom then
	if iMsgType == BrlMsgType then
		return msgBrlValidateCustom
	else
		return msgValidateCustom
	EndIf
ElIf iType == xlValidateDate then
	if iMsgType == BrlMsgType then
		return msgBrlValidateDate
	else
		return msgValidateDate
	EndIf
ElIf iType == xlValidateTime then
	if iMsgType == BrlMsgType then
		return msgBrlValidateTime
	else
		return msgValidateTime
	EndIf
ElIf iType == xlValidateDecimal then
	if iMsgType == BrlMsgType then
		return msgBrlValidateDecimal
	else
		return msgValidateDecimal
	EndIf
ElIf iType == xlValidateInputOnly then
	if iMsgType == BrlMsgType then
		return msgBrlInputMessage
	else
		return msgInputMessage
	EndIf
ElIf iType == xlValidateList then
	if iMsgType == BrlMsgType then
		return msgBrlValidateDropDown
	else
		;Speech will announce the UIA ItemStatus text "Contains Data Validation dropdown menu."
		return cscNull
	EndIf
ElIf iType == xlValidateTextLength then
	if iMsgType == BrlMsgType then
		return msgBrlValidateTextLength
	else
		return msgValidateTextLength
	EndIf
ElIf iType == xlValidateWholeNumber then
	if iMsgType == BrlMsgType then
		return msgBrlValidateNumber
	else
		return msgValidateWholeNumber
	EndIf
Else
	return cscNull
EndIf
EndFunction

string function GetValidationOperatorMessage(int iOp)
If iOp == xlBetween then
	return msgBetween
ElIf iOp == xlNotBetween then
	return msgNotBetween
ElIf iOp == xlEqual then
	return msgEqual
ElIf iOp == xlLess then
	return msgLess
ElIf iOp == xlLessEqual then
	return msgLessEqual
ElIf iOp == xlGreater then
	return msgGreater
ElIf iOp == xlGreaterEqual then
	return msgGreaterEqual
EndIf
EndFunction

void function GetFormatConditionTypeAndOperator(collection cCondition,
	string ByRef sType, string ByRef sOperator)
Var
	int iType,
	int iOperator
let iType = cCondition.type
if iType == xlCellValue then
	let sType = msgCellValue
ElIf iType == xlExpression then
	let sType = msgExpression
EndIf
let iOperator = cCondition.operator
if iOperator == xlEqual then
	let sOperator = formatString(msgEqual,cCondition.Formula1               )
elIf iOperator == xlNotEqual then
	let sOperator = formatString(msgNotEqual,cCondition.Formula1)
elIf iOperator == xlGreater then
	let sOperator = formatString(msgGreater,cCondition.Formula1)
elIf iOperator == xlGreaterEqual then
	let sOperator = formatString(msgGreaterEqual,cCondition.Formula1)
elIf iOperator == xlLess then
	let sOperator = formatString(msgLess,cCondition.Formula1)
elIf iOperator == xlLessEqual then
	let sOperator = formatString(msgLessEqual,cCondition.Formula1)
elIf iOperator == xlBetween then
  let sOperator = formatString(msgBetween,cCondition.Formula1,cCondition.Formula2)
elIf iOperator == xlNotBetween then
	let sOperator = formatString(msgNotBetween,cCondition.Formula1,cCondition.Formula2)
endIf
EndFunction

void function UpdateCurrentCellAddress()
if GetObjectSubtypeCode() == wt_tablecell
	gsCurrentCellAddress = GetObjectAutomationID()
else
	gsCurrentCellAddress = cscNull
endIf
EndFunction

int function IsCachedFocusCellAddressValid()
return gsCurrentCellAddress
	&& getWindowClass(getFocus()) == wcExcel7
	&& !UserBufferIsActive()
	&& oExcel.ActiveSheet
	&& GetObjectSubtypeCode() == wt_TableCell
	&& gsCurrentCellAddress == GetObjectAutomationID()
EndFunction

int function GetCurrentExcelSheetItemType()
var int role = GetObjectRole()
if role == -10
	;When multiple cells are selected, focus may be on the pane rather than any cells:
	if oExcel.activeChart.chartType != 0
		CurrentExcelSheetItemType = ExcelItemTypeChart
	else
		CurrentExcelSheetItemType = ExcelItemTypeCell 
	endIf
	return CurrentExcelSheetItemType
endIf
if IsCachedFocusCellAddressValid()
	return CurrentExcelSheetItemType
endIf
UpdateCurrentCellAddress()
if oExcel.activeChart.chartType != 0
	CurrentExcelSheetItemType = ExcelItemTypeChart
	return CurrentExcelSheetItemType
endIf
if StatusBarMode() == Excel_status_comment
	CurrentExcelSheetItemType = ExcelItemTypeUnknown
	return CurrentExcelSheetItemType
endIf
var	object selection = getCurrentSelection()
if !selection.cells  && selection.shapeRange.type == msoTextBox
	CurrentExcelSheetItemType = ExcelItemTypeTextBox
	return CurrentExcelSheetItemType
endIf
if role  == ROLE_SYSTEM_GRAPHIC
	if FSUIAGetFocusedElement(true).GetTextPattern()
		CurrentExcelSheetItemType = ExcelItemTypeTextBox
		return CurrentExcelSheetItemType
	endIf
elif role  == ROLE_SYSTEM_CELL
	CurrentExcelSheetItemType = ExcelItemTypeCell
	return CurrentExcelSheetItemType
endIf
CurrentExcelSheetItemType = ExcelItemTypeUnknown
return CurrentExcelSheetItemType
EndFunction

int function isChartActive()
if menusActive()
|| dialogActive()
|| inRibbons()
|| isStatusBarToolbar(getFocus())
	return false
endIf
return GetCurrentExcelSheetItemType() == ExcelItemTypeChart
endFunction

int Function IsFormulaObjectCell(object oRange)
return StringContains(oRange.Formula,scEquals) == 1
EndFunction

int Function IsFormulaCXLCell(collection cCell)
return StringContains(cCell.Formula,scEquals) == 1
EndFunction

int function ActiveCellIsFormulaCell()
return IsFormulaCXLCell(cXLActiveCell)
EndFunction

string function getActiveCellFormula()
return cXLActiveCell.formula
EndFunction

int Function ActiveCellHasHyperlinkFormula()
return StringContains(cXLActiveCell.formula,scHyperlinkInFormula)
EndFunction

string Function GetHyperlinkObjectAddress(object hyperlink)
if hyperlink.address then
	return hyperlink.address
elif hyperlink.subAddress then
	return hyperlink.subAddress
else
	return cscNull
endIf
EndFunction

string Function GetHyperlinkAddress(collection cHyperlink)
if cHyperlink.address then
	return cHyperlink.address
elif cHyperlink.subAddress then
	return cHyperlink.subAddress
else
	return cscNull
EndIf
EndFunction

string function GetActiveCellHyperlinkAddress()
var
	collection c
let c = new collection
let c = cXLActiveCell.hyperlinks
return getHyperlinkAddress(c[1])
EndFunction

int function ActiveCellHasHyperlinks()
return cXLActiveCell.hyperlinks.count >= 1
EndFunction

string Function	TrimSheetNameFromHyperlinkAddress(string address)
;strip out current sheetname from address:
let address = stringReplaceSubstrings(address,cXLActiveSheet.name,cscNull)
;strip out unwanted characters:
if StringContains(address,scSheetNameRemnant) then
	let address=stringReplaceSubstrings(address,scSheetNameRemnant,cscNull)
elIf stringContains(address,scExclaim) then
	let address=stringReplaceSubstrings(address,scExclaim,cscNull)
endIf
return address
EndFunction

string Function GetShapeObjectTopLeftAndBottomRight(object shape)
var
	string topLeft,
	string bottomRight
let topLeft = shape.topLeftCell.addressLocal(false,false)
let bottomRight = shape.bottomRightCell.addressLocal(false,false)
return formatString(msgSpans1, topLeft, bottomRight)
EndFunction

string Function GetShapeRangeInfo(collection cShape)
return formatString(msgSpans1, cShape.topLeft, cShape.bottomRight)
EndFunction

string Function getObjectFormControlDescription(object oShape)
var
	int type
let type = oShape.formControlType
if type == xlButtonControl then
	return msgShapeType1_L ; "Button Control", ; =0,
elif type == xlCheckbox then
	return msgShapeType2_L ; "CheckBox", ; =1,
elif type == xlDropdown then
	return msgShapeType3_L ; "Dropdown", ; =2,
elif type == xlEditBox then
	return msgShapeType4_L ; "Edit Box", ; =3,
elif type == xlGroupBox then
	return msgShapeType5_L ; "Group Box", ; =4,
elif type == xlLabel then
	return msgShapeType6_L ; "Label", ; =5,
elif type == xlListBox then
	return msgShapeType7_L ; "List Box", ; =6,
elif type == xlOptionButton then
	return msgShapeType8_L ; "Option Button", ; =7,
elif type == xlScrollBar then
	return msgShapeType9_L ; "Scroll Bar", ; =8,
elif type == xlSpinner then
	return msgShapeType10_L ; "Spinner", ; =9
endIf
EndFunction

string Function GetObjectOleObjDescription(object oShape)
var
	string description,
	object OleObj,
	string progId
let OleObj = oShape.OleFormat.object.application
let ProgId = oShape.OleFormat.ProgId
if ProgId == Excel97sheet then
	return GetExcel97WorksheetCell(OleObj) ; excel worksheet cell info
elif progId == Excel97Chart then
	return msg241_L ; Excel 97 Chart
elif progId == MsGraphChart8 then
	return msg242_L ; Ms Graph 97 chart
elif progId == PaintPicture then
	return msg243_L ; bitmap picture
elif ProgId == MsClipartGallery2 then
	return msg244_L ; Ms Clipart
elif progId == word97doc then
	return msg245_L ; word 97 document
elif progId == Ppt97Show then
	return msg246_L ; Ppt 97 presentation
elif progId == Ppt97Slide then
	return msg247_L ; Ppt 97 slide
endIf
let description = getObjectFormControlDescription(oShape.object)
if description == cscNull then
	let description = msg232_L
endIf
return description
EndFunction

string Function GetObjectAutoShapeDescription(object oShape)
var
	int type
let type = oShape.autoShapeType
if type == MsoShape16pointStar then
	return msg92_L
elif type == MsoShape24pointStar then
	return msg93_L
elif type == MsoShape32pointStar then
	return msg94_L
elif type == MsoShape4pointStar then
	return msg95_L
elif type == MsoShape5pointStar then
	return msg96_L
elif type == MsoShape8pointStar then
	return msg97_L
elif type == MsoShapeActionBtnBackorPrev then
	return msg98_L
elif type == MsoShapeActionButtonBeginning then
	return msg99_L
elif type == MsoShapeActionButtonCustom then
	return msg100_L
elif type == MsoShapeActionButtonDocument then
	return msg101_L
elif type == MsoShapeActionButtonEnd then
	return msg102_L
elif type == MsoShapeActionBtnForwardorNxt then
	return msg103_L
elif type == MsoShapeActionButtonHelp then
	return msg104_L
elif type == MsoShapeActionButtonHome then
	return msg105_L
elif type == MsoShapeActionBtnInfo then
	return msg106_L
elif type == MsoShapeActionButtonMovie then
	return msg107_L
elif type == MsoShapeActionButtonReturn then
	return msg108_L
elif type == MsoShapeActionButtonSound then
	return msg109_L
elif type == MsoShapeArc then
	return msg110_L
elif type == MsoShapeBalloon then
	return msg111_L
elif type == MsoShapeBentArrow then
	return msg112_L
elif type == MsoShapeBentUpArrow then
	return msg113_L
elif type == MsoShapeBevel then
	return msg114_L
elif type == MsoShapeBlockArc then
	return msg115_L
elif type == MsoShapeCan then
	return msg116_L
elif type == MsoShapeChevron then
	return msg117_L
elif type == MsoShapeCircularArrow then
	return msg118_L
elif type == MsoShapeCloudCallout then
	return msg119_L
elif type == MsoShapeCross then
	return msg120_L
elif type == MsoShapeCube then
	return msg121_L
elif type == MsoShapeCurvedDownArrow then
	return msg122_L
elif type == MsoShapeCurvedDownRibbon then
	return msg123_L
elif type == MsoShapeCurvedLeftArrow then
	return msg124_L
elif type == MsoShapeCurvedRightArrow then
	return msg125_L
elif type == MsoShapeCurvedUpArrow then
	return msg126_L
elif type == MsoShapeCurvedUpRibbon then
	return msg127_L
elif type == MsoShapeDiamond then
	return msg128_L
elif type == MsoShapeDonut then
	return msg129_L
elif type == MsoShapeDoubleBrace then
	return msg130_L
elif type == MsoShapeDoubleBracket then
	return msg131_L
elif type == MsoShapeDoubleWave then
	return msg132_L
elif type == MsoShapeDownArrow then
	return msg133_L
elif type == MsoShapeDownArrowCallout then
	return msg134_L
elif type == MsoShapeDownRibbon then
	return msg135_L
elif type == MsoShapeExplosion1 then
	return msg136_L
elif type == MsoShapeExplosion2 then
	return msg137_L
elif type == MsoShapeFlowchartAltProcess then
	return msg138_L
elif type == MsoShapeFlowchartCard then
	return msg139_L
elif type == MsoShapeFlowchartCollate then
	return msg140_L
elif type == MsoShapeFlowchartConnector then
	return msg141_L
elif type == MsoShapeFlowchartData then
	return msg142_L
elif type == MsoShapeFlowchartDecision then
	return msg143_L
elif type == MsoShapeFlowchartDelay then
	return msg144_L
elif type == MsoShapeFlowchartDirAccStorage then
	return msg145_L
elif type == MsoShapeFlowchartDisplay then
	return msg146_L
elif type == MsoShapeFlowchartDocument then
	return msg147_L
elif type == MsoShapeFlowchartExtract then
	return msg148_L
elif type == MsoShapeFlowchartIntStorage then
	return msg149_L
elif type == MsoShapeFlowchartMagneticDisk then
	return msg150_L
elif type == MsoShapeFlowchartManualInput then
	return msg151_L
elif type == MsoShapeFlowchartManualOp then
	return msg152_L
elif type == MsoShapeFlowchartMerge then
	return msg153_L
elif type == MsoShapeFlowchartMultidocument then
	return msg154_L
elif type == MsoShapeFlowchartOffpageCon then
	return msg155_L
elif type == MsoShapeFlowchartOr then
	return msg156_L
elif type == MsoShapeFlowchartPredefProc then
	return msg157_L
elif type == MsoShapeFlowchartPreparation then
	return msg158_L
elif type == MsoShapeFlowchartProcess then
	return msg159_L
elif type == MsoShapeFlowchartPunchedTape then
	return msg160_L
elif type == MsoShapeFlowchartSeqAccStorage then
	return msg161_L
elif type == MsoShapeFlowchartSort then
	return msg162_L
elif type == MsoShapeFlowchartStoredData then
	return msg163_L
elif type == MsoShapeFlowchartSummingJunct then
	return msg164_L
elif type == MsoShapeFlowchartTerminator then
	return msg165_L
elif type == MsoShapeFoldedCorner then
	return msg166_L
elif type == MsoShapeHeart then
	return msg167_L
elif type == MsoShapeHexagon then
	return msg168_L
elif type == MsoShapeHorizontalScroll then
	return msg169_L
elif type == MsoShapeIsoscelesTriangle then
	return msg170_L
elif type == MsoShapeLeftArrow then
	return msg171_L
elif type == MsoShapeLeftArrowCallout then
	return msg172_L
elif type == MsoShapeLeftBrace then
	return msg173_L
elif type == MsoShapeLeftBracket then
	return msg174_L
elif type == MsoShapeLeftRightArrow then
	return msg175_L
elif type == MsoShapeLeftRightArrowCallout then
	return msg176_L
elif type == MsoShapeLeftRightUpArrow then
	return msg177_L
elif type == MsoShapeLeftUpArrow then
	return msg178_L
elif type == MsoShapeLightningBolt then
	return msg179_L
elif type == MsoShapeLineCallout1 then
	return msg180_L
elif type == MsoShapeLineCallout1AccentBar then
	return msg181_L
elif type == MsoShapeLnCallout1BordAccBar then
	return msg182_L
elif type == MsoShapeLineCallout1NoBorder then
	return msg183_L
elif type == MsoShapeLineCallout2 then
	return msg184_L
elif type == MsoShapeLineCallout2AccentBar then
	return msg185_L
elif type == MsoShapeLnCallout2BordAccBar then
	return msg186_L
elif type == MsoShapeLineCallout2NoBorder then
	return msg187_L
elif type == MsoShapeLineCallout3 then
	return msg188_L
elif type == MsoShapeLineCallout3AccentBar then
	return msg189_L
elif type == MsoShapeLnCallout3BordAccBar then
	return msg190_L
elif type == MsoShapeLineCallout3NoBorder then
	return msg191_L
elif type == MsoShapeLineCallout4 then
	return msg192_L
elif type == MsoShapeLineCallout4AccentBar then
	return msg193_L
elif type == MsoShapeLnCallout4BordAccBar then
	return msg194_L
elif type == MsoShapeLineCallout4NoBorder then
	return msg195_L
elif type == MsoShapeMoon then
	return msg196_L
elif type == MsoShapeNoSymbol then
	return msg197_L
elif type == MsoShapeNotchedRightArrow then
	return msg198_L
elif type == MsoShapeNotPrimitive then
	return msg199_L
elif type == MsoShapeOctagon then
	return msg200_L
elif type == MsoShapeOval then
	return msg201_L
elif type == MsoShapeOvalCallout then
	return msg202_L
elif type == MsoShapeParallelogram then
	return msg203_L
elif type == MsoShapePentagon then
	return msg204_L
elif type == MsoShapePlaque then
	return msg205_L
elif type == MsoShapeQuadArrow then
	return msg206_L
elif type == MsoShapeQuadArrowCallout then
	return msg207_L
elif type == MsoShapeRectangle then
	return msg208_L
elif type == MsoShapeRectangularCallout then
	return msg209_L
elif type == MsoShapeRegularPentagon then
	return msg210_L
elif type == MsoShapeRightArrow then
	return msg211_L
elif type == MsoShapeRightArrowCallout then
	return msg212_L
elif type == MsoShapeRightBrace then
	return msg213_L
elif type == MsoShapeRightBracket then
	return msg214_L
elif type == MsoShapeRightTriangle then
	return msg215_L
elif type == MsoShapeRoundedRectangle then
	return msg216_L
elif type == MsoShapeRoundedRectCallout then
	return msg217_L
elif type == MsoShapeSmileyFace then
	return msg218_L
elif type == MsoShapeStripedRightArrow then
	return msg219_L
elif type == MsoShapeSun then
	return msg220_L
elif type == MsoShapeTrapezoid then
	return msg221_L
elif type == MsoShapeUpArrow then
	return msg222_L
elif type == MsoShapeUpArrowCallout then
	return msg223_L
elif type == MsoShapeUpDownArrow then
	return msg224_L
elif type == MsoShapeUpDownArrowCallout then
	return msg225_L
elif type == MsoShapeUpRibbon then
	return msg226_L
elif type == MsoShapeUTurnArrow then
	return msg227_L
elif type == MsoShapeVerticalScroll then
	return msg228_L
 elif type == MsoShapeWave then
	return msg229_L
else
	return oShape.name
endIf
EndFunction

string Function GetShapeObjectDescription(object oShape)
var
	int iType
let iType = oShape.type
if iType == MsoAutoShape then
	return GetObjectAutoShapeDescription(oShape)
elif iType == msoEmbeddedOLEObject then
	return GetObjectOleObjDescription(oShape)
elif iType == msoCallout then
	return msg230_L ;"callout", ; 2,
elif iType == msoChart then
	; must assign value to tmp or strange results
	; must query chart	collection as shape does not inherit all properties even though its type is msoChart.
	if oExcel.ActiveSheet.chartObjects(oShape.name).chart.chartTitle.caption!=cscNull then
		return formatString(msgChart1, oExcel.ActiveSheet.chartObjects(oShape.name).chart.chartTitle.caption)
	else
		return formatString(msgChart1, oShape.name)
	endIf
elif iType == msoComment then
	return msgComment
elif iType == msoFormControl then
	return getObjectFormControlDescription(oShape) ; msg648_L ;"form control", ; 8,
elif iType == msoFreeform then
	return msg233_L ;"freeform", ; 5,
elif iType == msoGroup then
	return msg234_L ;"group", ; 6,
elif iType == msoLine then
	return msg235_L ;"line", ; 9,
elif iType == msoLinkedOLEObject then
	return msg236_L ;"linked OLE object", ; 10,
elif iType == msoLinkedPicture then
	return msg237_L ;"linked picture", ; 11,
elif iType == msoOLEControlObject then
	return msg238_L ;"OLE control object", ; 12,
elif iType == msoPicture then
	return msg239_L ;"picture", ; 13,
elif iType == msoTextBox then
	return msg240_L ;"text box" ; 17,
else
	return oShape.name
endIf
EndFunction

void function SayUsingVoiceOrBuffer(string sVoice, string sText, int iOutputType)
if UserBufferIsActive()
|| iOutputType == OT_USER_BUFFER then
	UserBufferAddText(sText)
else
	SayUsingVoice(sVoice, sText, iOutputType)
endIf
endFunction

void function sayWorkbookName()
SayMessage(ot_document_name,GetActiveWorkbookName())
endFunction

void function SayActiveSheet(optional int bNewSheet)
gCurrentSheetID = getActiveSheetName()
Say(gCurrentSheetID,OT_DOCUMENT_NAME)
if bNewSheet
	SaySheetData()
EndIf
EndFunction

void function SaySheetData()
If HasCustomLabels(cXLActiveSheet.name)
	SayFormattedMessageWithVoice(vctx_message,ot_help,msgHasCustomSummary_l,msgHasCustomSummary_s)
	ScheduleBrailleFlashMessageWithSpeechOutput(ot_help,msgHasCustomSummary_l)
EndIf
SayFilterModeStatus()
EndFunction

void function SayCellText(string sCellText)
if sCellText then
	if StringContains(sCellText,scNumberSigns) then
		SayFormattedMessageWithVoice(vctx_message,ot_help,msgCellObscured_l,msgCellObscured_s)
	EndIf
	say(sCellText,ot_line)
else
	if shouldReadBlankCells () then
		SayUsingVoice(vctx_message,cmsgBlank1,ot_word)
	endIf
endIf
EndFunction

void function BrailleCellText(string sCellText)
;For the read cell scripts alt 1 through 4 and control 1 through 4.
var
	int bAppend = FALSE
if sCellText then
	if StringContains(sCellText,scNumberSigns) then
		BrailleMessage (msgCellObscured_s)
		bAppend = TRUE
	EndIf
	BrailleMessage (sCellText,bAppend)
else
	if shouldReadBlankCells () then
		BrailleMessage (cmsgBlank1, bAppend)
	endIf
endIf
EndFunction

string function GetSpellStringCoordinatesFromAddress(string address)
return GetSpellString(StringReplaceSubStrings(GetSpellString(address),cscSpace,cscNull))
EndFunction

void function SayCellCoordinates(collection Cell, int iOutputType)
var
	string sCoordinates
let sCoordinates = cell.address
if IsExtendedSelectionMode() then
	;RemoveDuplicateAddressInfo is used on the address because
	;extended selection mode will show the range of a single cell as spanning cell:cell
	let sCoordinates = RemoveDuplicateAddressInfo(sCoordinates)
EndIf
Say(GetSpellStringCoordinatesFromAddress(sCoordinates),iOutputType)
EndFunction

void function sayActiveCellCoordinates()
SayCellCoordinates(cXLActiveCell,ot_SCREEN_MESSAGE)
EndFunction

void function spellActiveCellCoordinates()
SayCellCoordinates(cXLActiveCell, OT_SPELL)
endFunction

Void Function SpellActiveCellCoordinatesPhonetic()
SayCellCoordinates(cXLActiveCell,ot_phonetic_char)
EndFunction

void Function SayActiveCellCoordinatesInfo()
if isChartActive() then
	SayMessage(ot_user_requested_information,oExcel.activeChart.chartTitle.caption)
elIf onFormulaBarUIAEditItem() then
	SayMessage(ot_user_requested_information,
		FormatString(msgEditedCellCoord_l,
			StringLower(GetSpellString(cXLActiveCell.address)),
			getWorkbookAndWorksheetName()),
		FormatString(msgEditedCellCoord_s,
			StringLower(GetSpellString(cXLActiveCell.address)),
			getWorkbookAndWorksheetName()))
else
	sayActiveCellCoordinates()
endIf
EndFunction

void function SpellActiveCellText()
spellString(GetActiveCellText())
EndFunction

void Function SpellActiveCellTextPhonetic()
Say(GetActiveCellText(),ot_phonetic_char)
EndFunction

void function SayCurrentRowTitle()
Say(smmMarkupString(GetActiveCellRowTitleText()),ot_screen_message)
EndFunction

void Function SayRowHeader()
if ShouldReadTitles() & readRowTitles  then
	SayMessageWithMarkup(ot_screen_message,
		formatStringForMarkup(msgHeaderTemplate,GetActiveCellRowTitleText()))
endIf
EndFunction

void function SayCurrentColumnTitle()
Say(smmMarkupString(GetActiveCellColumnTitleText()),ot_screen_message)
EndFunction

void Function SayColumnHeader()
if ShouldReadTitles() & readColumnTitles  then
	SayMessageWithMarkup(ot_screen_message,
		formatStringForMarkup(msgHeaderTemplate,GetActiveCellColumnTitleText()))
endIf
EndFunction

void function sayRowTitleOnDemand()
gbSayTitleOnDemand = true
var
	int nStart, int nEnd,
	string sTitle,
	string sText
sText = GetCellTitleText(cXLActiveSheet.name,
	cXLActiveCell.row, cXLActiveCell.column, RowType, true)
sText = smmReplaceSymbolsWithMarkup  (sText)
GetValueToSetTitleRow (nStart, 0)
if sText then
	sTitle = formatString (msgRowTitle, intToString(nStart))
	sText = FormatString(msgHeaderTemplate,sText)
	ProcessMessage	(sText, sText, ot_user_requested_information, sTitle, MB_OK|MB_ICONINFORMATION)
else
	ProcessMessage	(msgNoRowTitle, msgNoRowTitle, OT_ERROR, msgError, MB_OK|MB_ICONERROR)
EndIf
gbSayTitleOnDemand = false
EndFunction

void function sayColumnTitleOnDemand()
gbSayTitleOnDemand = true
var
	int nStart,
	string sTitle,
	string sText
sText = GetCellTitleText(cXLActiveSheet.name,
	cXLActiveCell.row, cXLActiveCell.column, ColumnType, true)
;Excel tables may have column titles.
;The only reliable way to determine whether there is a table column title is to check the cache to see if one was stored there.
;The reason we resort to the cached data is due to a bug in some Excel DOM calls which causes the UIA focus to move to the first cell in the region,
;which means that the cell with keyboard focus may not be the cell with UIA focus.
if !sText
&& cXLActiveCell.titles.titlesFromUIA | readColumnTitles
	sText = cXLActiveCell.titles.column
endIf
sText = smmReplaceSymbolsWithMarkup (sText)
GetValueToSetTitleColumn (nStart, 0)
if sText then
	sTitle = formatString (msgColumnTitle, ColumnNumberToLetter (nStart))
	sText = FormatString(msgHeaderTemplate,sText)
	ProcessMessage	(sText, sText, ot_user_requested_information, sTitle, MB_OK|MB_ICONINFORMATION)
else
	ProcessMessage	(msgNoColumnTitle, msgNoColumnTitle, OT_ERROR, msgError, MB_OK|MB_ICONERROR)
EndIf
gbSayTitleOnDemand = false
EndFunction

void function sayActiveCellTitles()
SayRowHeader()
SayColumnHeader()
endFunction

void function SaySelectionRangeTitles(int bIsExtendedSelectionMode)
var
	string sSheetName,
	string StartTitle,
	string EndTitle,
	int iStartTitle,
	int iEndTitle,
	string sRangeTitle
if ShouldReadTitles() & readColumnTitles
&& cXLSelection.firstCell.column != cXLSelection.lastCell.column then
	let startTitle = GetCellTitleText(cXLSelection.firstCell.sheetName,
		cXLSelection.firstCell.row,cXLSelection.firstCell.column,ColumnType)
	if startTitle == cscSpace
	|| !startTitle then
		if bIsExtendedSelectionMode then
			let iStartTitle = true
		Else
			let startTitle = msgNoColumnTitle
		EndIf
	endIf
	let endTitle = GetCellTitleText(cXLSelection.lastCell.sheetName,
		cXLSelection.lastCell.row,cXLSelection.lastCell.column,ColumnType)
	if endTitle == cscSpace
	|| !endTitle then
		if bIsExtendedSelectionMode then
			let iEndTitle = true
		Else
			let endTitle = msgNOColumnTitle
		EndIf
	endIf
	if !iStartTitle
	&& !iEndTitle then
		let sRangeTitle = formatString(msgXThroughY1,ConvertAInAddressToUpperCase(startTitle),ConvertAInAddressToUpperCase(endTitle))
	ElIf iStartTitle
	&& iEndTitle then
		let sRangeTitle = cscNull
	ElIf iStartTitle
	&& !iEndTitle then
		let sRangeTitle = ConvertAInAddressToUpperCase(EndTitle)
	ElIf !iStartTitle
	&& iEndTitle then
		let sRangeTitle = ConvertAInAddressToUpperCase(StartTitle)
	EndIf
	If IsSaySelectedTextScript()
	|| bIsExtendedSelectionMode then
		sayMessageWithMarkup(ot_screen_message,formatStringForMarkup(msgHeaderTemplate, sRangeTitle) )
	EndIf
endIf
if ShouldReadTitles() & readRowTitles
&& cXLSelection.firstCell.row != cXLSelection.lastCell.row then
	let startTitle = GetCellTitleText(cXLSelection.firstCell.sheetName,
		cXLSelection.firstCell.row,cXLSelection.firstCell.column,RowType)
	if startTitle == cscSpace
	|| !startTitle then
		if bIsExtendedSelectionMode then
			let iStartTitle = true
		Else
			let startTitle = msgNoRowTitle
		EndIf
	endIf
	let endTitle = GetCellTitleText(cXLSelection.lastCell.sheetName,
		cXLSelection.lastCell.row,cXLSelection.lastCell.column,RowType)
	if endTitle == cscSpace
	|| !endTitle then
		if bIsExtendedSelectionMode then
			let iEndTitle = true
		Else
			let endTitle = msgNoRowTitle
		EndIf
	endIf
	if !iStartTitle
	&& !iEndTitle then
		let sRangeTitle = formatString(msgXThroughY1,ConvertAInAddressToUpperCase(startTitle),ConvertAInAddressToUpperCase(endTitle))
	ElIf iStartTitle
	&& iEndTitle then
		let sRangeTitle = cscNull
	ElIf iStartTitle
	&& !iEndTitle then
		let sRangeTitle = ConvertAInAddressToUpperCase(EndTitle)
	ElIf !iStartTitle
	&& iEndTitle then
		let sRangeTitle = ConvertAInAddressToUpperCase(StartTitle)
	EndIf
	If IsSaySelectedTextScript()
	|| bIsExtendedSelectionMode then
		sayMessageWithMarkup(ot_screen_message,formatStringForMarkup(msgHeaderTemplate,smmReplaceSymbolsWithMarkup (sRangeTitle)))
	EndIf
endIf
EndFunction

int function IsSaySelectedTextScript()
return GetScriptAssignedTo(GetCurrentScriptKeyName()) == "sayselectedtext"
EndFunction

void Function SaySelectedRange(optional int bForceReadCoordinates)
var
	string sAddressRange,
	string sAddressFirst,
	string sAddressLast,
	string sFirstCellText,
	string sLastCellText,
	string sCellText,
	int bIsExtendedSelectionMode,
	int i,
	object oSelection,
	object oRealSelection,
	int nCellCount
let bIsExtendedSelectionMode = StatusBarMode() == Excel_Status_ExtendedSelection
SaySelectionRangeTitles(bIsExtendedSelectionMode)
let sFirstCellText = cXLSelection.firstCell.text
if !sFirstCellText then
	let sFirstCellText = cmsgBlank1
EndIf
let sLastCellText = cXLSelection.lastCell.text
if !sLastCellText then
	let sLastCellText = cmsgBlank1
EndIf
let sAddressFirst = cXLSelection.firstCell.address
let sAddressLast = cXLSelection.lastCell.address
;RemoveDuplicateAddressInfo is used on the address because
;extended selection mode will show the range of a single cell as spanning cell:cell
let sAddressFirst = RemoveDuplicateAddressInfo(sAddressFirst)
let sAddressLast = RemoveDuplicateAddressInfo(sAddressLast)
let sAddressFirst = GetAddressSpellString(sAddressFirst)
let sAddressLast = GetAddressSpellString(sAddressLast)
if cXLSelection.mergeCells then
	if CellReadingVerbosity() == readCellContentsAndCoordinates || bForceReadCoordinates then
		SayFormattedMessageWithVoice(VCTx_message,ot_selected,
			FormatString(msgxThroughY1,sAddressFirst,sAddressLast),
			FormatString(msgxThroughY1,sAddressFirst,sAddressLast))
	Endif
else
	if SelectionReadingVerbosity() == readSelectedRange then
		if CellReadingVerbosity() == readCellContentsAndCoordinates || bForceReadCoordinates then
			SayFormattedMessageWithVoice(VCTx_message,ot_selected,
				FormatString(msgxThroughY1,sAddressFirst,sAddressLast),
				FormatString(msgxThroughY1,sAddressFirst,sAddressLast))
		Endif
		; Only read the visible selected cells, or may cause JAWS to crash if too many cells are selected.
		; SSB-SM Only revert to visible selection for a large number of cells.
		let oRealSelection = getSelection()
		let nCellCount = oRealSelection.count
		If nCellCount > 1000 then
			let oSelection = getVisibleSelection ()
		else
			let oSelection = oRealSelection
		EndIf
		let i = 1
		while i <= nCellCount
			Say(oSelection(i).Text,ot_line)
			let i = i+1
		EndWhile
		SayObjectCellInfo(oSelection)
	else
		if CellReadingVerbosity() == readCellContentsAndCoordinates || bForceReadCoordinates then
			SayFormattedMessageWithVoice(VCTx_message,ot_selected,sAddressFirst)
		Endif
		SayFormattedMessage(ot_selected,sFirstCellText)
		if CellReadingVerbosity() == readCellContentsAndCoordinates || bForceReadCoordinates then
			SayFormattedMessageWithVoice(VCTx_message,ot_selected,sAddressLast)
		Endif
		SayFormattedMessage(ot_selected,sLastCellText)
	Endif
EndIf
EndFunction
void function SayGroupedSheetNames()
var
	int count
let count = oExcel.ActiveWindow.SelectedSheets.count
if count > 1 then
	SayMessage(ot_status,
		FormatString(msgSheetsSelected,intToString(count))
		+cscSpace+GetGroupedSheetNames())
EndIf
EndFunction



void Function ManageWorksheets()
;If this returns from hotKeyHelp, occasionally fails.
;script does run ensureNoUserBufferActive but we need to be sure, as occasionally users get an IE-type context menu.
if userBufferIsActive () then EnsureNoUserBufferActive() endIf
if InHJDialog() then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
; Calling ShowPopup below will cause the COM call to block until the context menu is dismissed
; To keep JAWS  from hanging, we set the ComMessageFilterTimeout to 0, call ShowPopup and then reset the timeout
;to the previous value.  Failure to set the timeout back will lead to JAWS failing all sorts of COM calls,
; most notably those to the DOM server.

; It's intentional that SetComMessageFilterTimeout is not in builtin.jsd.
; The function should not be used except under extenuating circumstances.
; If you're thinking of using it, please confer with Glen before doing so.

var int oldTimeoutt = SetComMessageFilterTimeout(0)
; The ply CommandBar is the one for Workbook/sheets.
oExcel.CommandBars("Ply").ShowPopup()
SetComMessageFilterTimeout(oldTimeoutt)
EndFunction

void Function SayCurrentRegion(int iOutputtype)
var
	int last,
	object oRange,
	string sName
if !AllowPerformanceImpactingFeatures()
	oRange = GetActiveCellCurrentRegion()
else
	oRange = GetNamedRegionRangeObject(oXLActiveCell)
	if oRange
		sName = GetNonRegionTitleRangeName(oXLActiveCell)
	else
		oRange = GetActiveCellCurrentRegion()
	endIf
endIf
last = oRange.cells.count
SayMessage(iOutputType,
	formatString(msgRegionSpans1_L, sName,
		GetObjectCellAddress(oRange.Cells(1)),
		GetObjectCellAddress(oRange.Cells(last))),
	formatString(msgRegionSpans1_S, sName,
		GetObjectCellAddress(oRange.Cells(1)),
		GetObjectCellAddress(oRange.Cells(last))))
EndFunction

void function SayVisibleRangeCoordinates()
var
	object visibleRange,
	string sStartCoordinates,
	string sEndCoordinates,
	int iVisibleCellCount,
	int iVisibleCellsWithData
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
let visibleRange = oExcel.activeWindow.ActivePane.visibleRange
let iVisibleCellCount = visibleRange.cells.count
if iVisibleCellCount > 0 then
	let iVisibleCellsWithData = countCellsWithDataInVisibleRange()
	let sStartCoordinates = visibleRange.cells(1).addressLocal(false,false)
	let sEndCoordinates = visibleRange.cells(iVisibleCellCount).addressLocal(false,false)
	if UserBufferIsActive() then
		SayMessage (OT_USER_BUFFER,
			formatString(msgVisibleRange1_L, sStartCoordinates, sEndCoordinates,
				intToString(iVisibleCellsWithData), intToString(iVisibleCellCount)),
			formatString(msgVisibleRange1_S, sStartCoordinates, sEndCoordinates,
				intToString(iVisibleCellsWithData), intToString(iVisibleCellCount)))
	else
		SayFormattedMessage(ot_help,
			formatString(msgVisibleRange1_L, sStartCoordinates, sEndCoordinates,
				intToString(iVisibleCellsWithData), intToString(iVisibleCellCount)),
			formatString(msgVisibleRange1_S, sStartCoordinates, sEndCoordinates,
				intToString(iVisibleCellsWithData), intToString(iVisibleCellCount)))
	EndIf
else
	if UserBufferIsActive() then
		SayMessage(OT_USER_BUFFER, msg77_L) ; no visible range in active window
	else
		SayMessage(OT_error, msg77_L) ; no visible range in active window
	EndIf
endIf
EndFunction

int Function sayColor(optional int bSpeakRGB)
Var
	int iTextColor,
	int iBackgroundColor
if !worksheetHasFocus()
	return sayColor(bSpeakRGB)
EndIf
;We must get the interior before the font,
;since retrieving the font background color depends on the data for the interior:
UpdateCXLRangeInterior(cXLActiveCell, oXLActiveCell,true)
UpdateCXLRangeFont(cXLActiveCell, oXLActiveCell,true)
GetCXLRangeTextAndBackgroundColors(cXLActiveCell,iTextColor,iBackgroundColor)
SayUsingVoiceOrBuffer(vctx_message,
	formatString(msgColorFGOnBG1,getColorDescription(iTextColor),getColorDescription(iBackgroundColor)),ot_help)
return true
EndFunction

void function DescribeActiveCellFont()
var
	int iOutputType,
	string smsg_l,
	string smsg_s,
	string sCellInfo,
	string sTitleInfo
UpdateCXLRangeAllData(cXLActiveCell, oXLActiveCell)
if isSameScript() then
	If UserBufferIsActive() then
		userBufferDeactivate()
		UserBufferClear()
	EndIf
	let sMsg_L = msgCellFont1_L+cscBufferNewLine+cscBufferNewLine
		+GetCXLRangeFontInfo(cXLActiveCell, true, false, cscBufferNewLine, message_long)
	if TitleCellFontAndFormattingIndication () then
		let sTitleInfo = GetTitleCellFontAndFormattingInfo(oXLActiveCell,true)
		if sTitleInfo then
			let smsg_l = sMsg_l+cscBufferNewLine+cscBufferNewLine+sTitleInfo
		EndIf
	EndIf
	let sMsg_l = sMsg_l+cscBufferNewLine+cscBufferNewLine+cmsgBuffExit
	sayFormattedMessage(ot_user_buffer,smsg_l)
else
	let iOutputType = ShouldItemSpeak(ot_user_requested_information)
	if iOutputType == message_long then
		let sCellInfo = GetCXLRangeFontInfo(cXLActiveCell, true, false, cscBufferNewLine, message_long)
	else
		let sCellInfo = GetCXLRangeFontInfo(cXLActiveCell, true, false, cscBufferNewLine, message_short)
	EndIf
	let sMsg_L = msgCellFont1_L+cscBufferNewLine+cscBufferNewLine+sCellInfo
	let sMsg_s = msgCellFont1_S+cscBufferNewLine+cscBufferNewLine+sCellInfo
	BeginFlashMessage()
	SayMessage(ot_user_requested_information,sMsg_l,sMsg_s)
	EndFlashMessage()
endIf
EndFunction

void Function ReportFontStatus(string strButton)
var
	int state
delay(3)
;Strikethrough button does not appear on toolbar:
if ! getRunningFSProducts () & product_JAWS then
	return sayCurrentScriptKeyLabel ()
endIf
if strButton == btnStrikethrough then
	if oXLActiveCell.font.strikethrough then
		let state = true
	endIf
else
	;in case it missed initialization:
	if ! oExcelCommandBars then
		let oExcelCommandBars = oExcel.commandbars(CBFormatting)
	endIf
	let state = oExcelCommandBars.controls(strButton).state
endIf
if state then
	pause()
	SayFormattedMessage(ot_status,formatString(cmsg240_L, strButton), cmsgOn)
else
	SayFormattedMessage(ot_status,formatString(cmsg241_L, strButton), cmsgOff)
endIf
EndFunction

void Function SayCXLValidationFormulaInfo(collection cValidation, int iType)
var
	string sCell1,
	string sCell2,
	string sSheetName,
	int iOperator,
	string sText1,
	string sText2,
	string sText,
	string smsg,
	int iPunctLevel
sSheetName = GetActiveSheetName()
sCell1 = cValidation.formula1
if StringContains(sCell1,scEquals) == 1
&& iType != xlValidateCustom then
	sCell1 = StringChopLeft(sCell1,1)
	sText1 = GetContentOfCells(sCell1,sSheetName)
Else
	sText1 = sCell1
EndIf
sCell2 = cValidation.formula2
if StringContains(sCell2,scEquals) == 1 then
	sCell2 = StringChopLeft(sCell2,1)
	sText2 = GetContentOfCells(sCell2,sSheetName)
else
	sText2 = sCell2
EndIf
iOperator = cValidation.operator
if iType == xlValidateCustom then
	sText = sCell1
	iPunctLevel = GetJCFOption(opt_punctuation)
	SetJcfOption(opt_punctuation,3)
	SayUsingVoice(vctx_message,sText,ot_line)
	SetJcfOption(opt_punctuation,iPunctLevel)
Else
	smsg = GetValidationOperatorMessage(iOperator)
	sText = FormatString(smsg,sText1,sText2)
	SayUsingVoice(vctx_message,sText,ot_line)
EndIf
ScheduleBrailleFlashMessage(sText,7	)
EndFunction

void function SayCXLValidationInfo(collection cValidation)
Var
	int iValidationType,
	string sInputTitle,
	string sInputMessage,
	string sValidationMessage,
	String sValidationText
let iValidationType = cValidation.type
if cValidation.inCellDropDown
|| cValidation.inputMessage then
	If iValidationType >= 0 then
		sValidationMessage = GetValidationMessage(iValidationType)
		if sValidationMessage 
			SayUsingVoice(vctx_message,sValidationMessage,ot_line)
			ScheduleBrailleFlashMessage(sValidationMessage)
		endIf
	EndIf
	if cValidation.ShowInput then
		let sInputTitle = cValidation.inputTitle
		let sInputMessage = cValidation.inputMessage
		let sValidationText = sInputTitle+cscSpace+sInputMessage
		if !StringIsBlank(sValidationText)
			Say(sValidationText,ot_line)
			ScheduleBrailleFlashMessage(sValidationText)
		endIf
		if iValidationType == xlValidateDecimal
		|| iValidationType == xlValidateDate
		|| iValidationType == xlValidateTime
		|| iValidationType == xlValidateWholeNumber
		|| iValidationType == xlValidateTextLength
		|| iValidationType == xlValidateCustom then
			SayCXLValidationFormulaInfo(cValidation,iValidationType)
		EndIf
	EndIf
EndIf
EndFunction

string Function GetActiveCellValidationBrlMessage()
var
	string sType,
	string sInputTitle,
	string sInputMsg
if !cXLActiveCell.validation.showInput then
	return msgBrlInputMessageNotShown
EndIf
let sType = GetValidationMessage(cXLActiveCell.validation.Type, BrlMsgType)
let sInputTitle = cXLActiveCell.validation.inputTitle
let sInputMsg = cXLActiveCell.validation.inputMessage
return sType+cscSpace+sInputTitle+cscSpace+sInputMsg
EndFunction

void function SayCXLValidationInputMessage(collection cValidation)
var
	string smsg,
	string sTitle
if !cValidation then
	return
EndIf
let smsg = cValidation.InputMessage
if !smsg then
	sayMessage(ot_error,msgInputMessageError_l,msgInputMessageError_s)
	return true
endIf
let sTitle = cValidation.InputTitle
if sTitle then
	let smsg = sTitle+cscSpace+smsg
	SayUsingVoice(vctx_message,smsg,ot_user_requested_information)
else
	Say(sMsg,ot_line)
endIf
return true
EndFunction

void function SayActiveCellValidationInputMessage()
SayCXLValidationInputMessage(cXLActiveCell.validation)
EndFunction

string Function GetInputMessageTutorHelp()
Var
	int iType
let iType = oXLActiveCell.validation.type
If iType == xlValidateList then
	return msgDropdownTutorHelp
ElIf iType == xlValidateInputOnly then
	return msgInputOnlyTutorHelp
ElIf iType == xlValidateDate
|| iType == XlValidateTime
|| iType == xlValidateWholeNumber
|| iType == xlValidateDecimal
|| iType == xlValidateTextLength then
	return msgInputValidValueTutorHelp
ElIf iType == xlValidateCustom then
	return msgInputCustomTutorHelp
EndIf
EndFunction

string Function GetScreenSensitiveHelpInputMessage()
Var
	int iType
let iType = oExcel.activeCell.validation.type
If iType == xlValidateList then
	return msgScreenSensitiveHelpDropdown
ElIf iType == xlValidateInputOnly then
	return msgScreenSensitiveHelpInputOnly
ElIf iType == xlValidateDate
|| iType == XlValidateTime
|| iType == xlValidateWholeNumber
|| iType == xlValidateDecimal
|| iType == xlValidateTextLength then
	return msgScreenSensitiveHelpInputValidValue
ElIf iType == xlValidateCustom then
	return msgScreenSensitiveHelpInputCustom
EndIf
EndFunction

string function BorderWeightToString(int BorderWeight)
var
	int weight
if BorderWeight < 0 then
	let weight = (BorderWeight)*-1
else
	weight = BorderWeight
endIf
if weight == xlHairline then
	return msg53_L ;"Hairline"
elif weight == xlMedium then
	return msg54_L ;"Medium"
elif weight == xlThick then
	return msg55_L ;"Thick"
elif weight == xlThin then
	return msg56_L ;"Thin"
else
	return cscNull
endIf
endFunction

string function BorderLineStyleToString(int BorderLineStyle)
var
	int LineStyle
if BorderLineStyle < 0 then
	let lineStyle = (BorderLineStyle)*-1
else
	let lineStyle = BorderLineStyle
endIf
if LineStyle == xlContinuous then
	return msg45_L ;"Continuous"
elif LineStyle == xlDash then
	return msg46_L ;"Dash"
elif LineStyle == xlDashDot then
	return msg47_L ;"Dash Dot"
elif LineStyle == xlDashDotDot then
	return msg48_L ;"Dash Dot Dot"
elif LineStyle == xlDot then
	return cscSpace+msg49_L ;"Dot"
elif LineStyle == xlDouble then
	return msg50_L ;"Double"
elif LineStyle == xlLineStyleNone then
	return msg51_L ;"Grid Line"
elif LineStyle == xlSlantDashDot then
	return msg52_L ;"Slant Dash Dot"
else
	return cscNull
endIf
EndFunction

string Function GetCXLBorderInfo(collection cBorder, int iType,
	optional int Group)
var
	string sWeight,
	string sLine,
	string sColor
if cBorder.LineStyle == 11 then
	return cscNull
endIf
let sWeight = BorderWeightToString(cBorder.weight)
let sLine = BorderLineStyleToString(cBorder.lineStyle)
let sColor = GetColorDescription(cBorder.color)
if iType == 0 then
	;border group treats some borders as the same:
	if !Group ;the default is to treat all borders the same
	|| Group == (CellBorder_Top + CellBorder_Bottom + CellBorder_Left + CellBorder_Right) then
		return FormatString(msgCellBordersGroupAll,sColor,sWeight,sLine)
	elif (Group & CellBorder_Top)
	&& (Group & CellBorder_Bottom) then
		if Group & CellBorder_Left then
			return FormatString(msgCellBorderGroupTopBottomLeft,sColor,sWeight,sLine)
		elif Group & CellBorder_Right then
			return FormatString(msgCellBorderGroupTopBottomRight,sColor,sWeight,sLine)
		else
			return FormatString(msgCellBorderGroupTopBottom,sColor,sWeight,sLine)
		endIf
	elif (Group & CellBorder_Left )
	&& (group & CellBorder_Right) then
		if Group & CellBorder_Top then
			return FormatString(msgCellBorderGroupLeftRightTop,sColor,sWeight,sLine)
		elif Group & CellBorder_Bottom then
			return FormatString(msgCellBorderGroupLeftRightBottom,sColor,sWeight,sLine)
		else
			return FormatString(msgCellBorderGroupLeftRight,sColor,sWeight,sLine)
		endIf
	elif Group & CellBorder_Top then
		if Group & CellBorder_left then
			return FormatString(msgCellBorderGroupTopLeft,sColor,sWeight,sLine)
		else
			return FormatString(msgCellBorderGroupTopRight,sColor,sWeight,sLine)
		endIf
	elif Group & CellBorder_Bottom then
		if Group & CellBorder_left then
			return FormatString(msgCellBorderGroupBottomLeft,sColor,sWeight,sLine)
		else
			return FormatString(msgCellBorderGroupBottomRight,sColor,sWeight,sLine)
		endIf
	endIf
elif iType == xlDiagonalDown then
	return FormatString(msg57_L,sColor,sWeight,sLine) ;"Diagonal Down"
elif iType == xlDiagonalUp then
	return FormatString(msg58_L,sColor,sWeight,sLine) ;"Diagonal Up"
elif iType == xlEdgeBottom then
	return FormatString(msg59_L,sColor,sWeight,sLine) ;"Bottom Edge"
elif iType == xlEdgeLeft then
	return FormatString(msg60_L,sColor,sWeight,sLine) ;"Left Edge"
elif iType == xlEdgeRight then
	return FormatString(msg61_L,sColor,sWeight,sLine) ;"Right Edge"
elif iType == xlEdgeTop then
	return FormatString(msg62_L,sColor,sWeight,sLine) ;"Top Edge"
elif iType == xlInsideHorizontal then
	return FormatString(msg63_L,sColor,sWeight,sLine) ;"Inside Horizontal"
elif iType == xlInsideVertical then
	return formatString(msg64_L,sColor,sWeight,sLine) ;"Inside Vertical"
else ; unknown border
	return cscNull
endIf
EndFunction

string function GetActiveCellBordersDescription()
var
	collection c,
	collection cBorders,
	int BorderSet,
	int GroupSet,
	int bTopAndBottomIdentical,
	int bLeftAndRightIdentical,
	string sInfo
let cBorders = new collection
if CollectionItemExists(cXLActiveCell,"borders") then
	let cBorders = cXLActiveCell.borders
else
	let c = new collection
	UpdateCXLRangeBorders(c, oXLActiveCell, true)
	let cBorders = c.borders
endIf
;BorderSet contains a flag for each existing border:
let BorderSet =
	(CollectionItemExists(cBorders,"top")
	+(CollectionItemExists(cBorders,"bottom") << 1)
	+(CollectionItemExists(cBorders,"left") << 2)
	+(CollectionItemExists(cBorders,"right") << 3))
if !BorderSet then
	return msgCellBordersGroupNone
endIf
let bTopAndBottomIdentical =
	(BorderSet & (CellBorder_Top+CellBorder_Bottom)
	&& CollectionCompare(cBorders.top,cBorders.bottom))
let bLeftAndRightIdentical =
	(BorderSet & (CellBorder_Left+CellBorder_Right)
	&& CollectionCompare(cBorders.left,cBorders.right))
if bTopAndBottomIdentical then
	if BorderSet & CellBorder_Left
	&& CollectionCompare(cBorders.top,cBorders.left) then
		if bLeftAndRightIdentical
			;get border as a whole
			return GetCXLBorderInfo(cBorders.top,0)
		endIf
		let GroupSet = CellBorder_Top|CellBorder_Bottom|CellBorder_Left
		let sInfo = GetCXLBorderInfo(cBorders.top,0,GroupSet)
	elif BorderSet & CellBorder_Right
	&& CollectionCompare(cBorders.top,cBorders.right) then
		let GroupSet = CellBorder_Top|CellBorder_Bottom|CellBorder_Right
		let sInfo = GetCXLBorderInfo(cBorders.top,0,GroupSet)
	else
		let GroupSet = CellBorder_Top|CellBorder_Bottom
		let sInfo = GetCXLBorderInfo(cBorders.top,0,GroupSet)
	endIf
endIf
if bLeftAndRightIdentical then
	if BorderSet & CellBorder_Top
	&& CollectionCompare(cBorders.left,cBorders.top) then
		let GroupSet = CellBorder_Left|CellBorder_Right|CellBorder_Top
		let sInfo = sInfo+cscSpace+GetCXLBorderInfo(cBorders.Left,0,GroupSet)
	elif BorderSet & CellBorder_Bottom
	&& CollectionCompare(cBorders.left,cBorders.bottom) then
		let GroupSet = CellBorder_Left|CellBorder_Right|CellBorder_Bottom
		let sInfo = sInfo+cscSpace+GetCXLBorderInfo(cBorders.Left,0,GroupSet)
	else
		;At this point, top and bottom may be identical,
		;but not identical to left and right,
		;so only add left and right flags to group set after getting the info
		let sInfo = sInfo+cscSpace+GetCXLBorderInfo(cBorders.Left,0,CellBorder_Left|CellBorder_Right)
		let GroupSet = GroupSet|CellBorder_Left|CellBorder_Right
	endIf
endIf
if BorderSet & (CellBorder_Top|CellBorder_Left)
&& !(GroupSet & (CellBorder_Top|CellBorder_Left))
&& CollectionCompare(cBorders.top,cBorders.left) then
	let GroupSet = CellBorder_Top|CellBorder_Left
	let sInfo = GetCXLBorderInfo(cBorders.top,0,GroupSet)
elif BorderSet & (CellBorder_Top|CellBorder_Right)
&& !(GroupSet & (CellBorder_Top|CellBorder_Right))
&& CollectionCompare(cBorders.top,cBorders.right) then
	let GroupSet = CellBorder_Top|CellBorder_Right
	let sInfo = GetCXLBorderInfo(cBorders.top,0,GroupSet)
endIf
if BorderSet & (CellBorder_Bottom|CellBorder_Left)
&& !(GroupSet & (CellBorder_Bottom|CellBorder_Left))
&& CollectionCompare(cBorders.bottom,cBorders.left) then
	;At this point we know that not all borders are identical,
	;so don't add this corner to the flag set until after getting the info
	let sInfo = sInfo+cscSpace+GetCXLBorderInfo(cBorders.bottom,0,CellBorder_Bottom|CellBorder_Left)
	let GroupSet = GroupSet|CellBorder_Bottom|CellBorder_Left
elif BorderSet & (CellBorder_Bottom|CellBorder_Right)
&& !(GroupSet & (CellBorder_Bottom|CellBorder_Right))
&& CollectionCompare(cBorders.bottom,cBorders.right) then
	;At this point we know that not all borders are identical,
	;so don't add this corner to the flag set until after getting the info
	let sInfo = sInfo+cscSpace+GetCXLBorderInfo(cBorders.bottom,0,CellBorder_Bottom|CellBorder_Right)
	let GroupSet = GroupSet|CellBorder_Bottom|CellBorder_Right
endIf
if BorderSet & CellBorder_Top
&& !(GroupSet & CellBorder_Top) then
	let sInfo = GetCXLBorderInfo(cBorders.top, XLEdgeTop)
	+","+cscSpace+sInfo
endIf
if BorderSet & CellBorder_Bottom
&& !(GroupSet & CellBorder_Bottom) then
	let sInfo = GetCXLBorderInfo(cBorders.bottom, XLEdgeBottom)
		+","+cscSpace+sInfo
endIf
if BorderSet & CellBorder_Left
&& !(GroupSet & CellBorder_Left) then
	let sInfo = GetCXLBorderInfo(cBorders.left, XLEdgeLeft)
		+","+cscSpace+sInfo
endIf
if BorderSet & CellBorder_Right
&& !(GroupSet & CellBorder_Right) then
	let sInfo = GetCXLBorderInfo(cBorders.right, XLEdgeRight)
		+","+cscSpace+sInfo
endIf
let sInfo = StringTrimTrailingBlanks(sInfo)
if StringRight(sInfo,1) == "," then
	sInfo = StringChopRight(sInfo,1)
endIf
return StringTrimLeadingBlanks(sInfo)
endFunction

void function DescribeActiveCellBorders()
var
	string sBorderInfo
let sBorderInfo = GetActiveCellBordersDescription()
If UserBufferIsActive() then
	SayUsingVoiceOrBuffer(vctx_message,sBorderInfo,ot_user_buffer)
else
	BeginFlashMessage()
	SayUsingVoiceOrBuffer(vctx_message,sBorderInfo,ot_user_requested_information)
	EndFlashMessage()
EndIf
EndFunction

void Function detectActiveCellBorderChange()
if !CollectionCompare(cXLActiveCell.borders.top,cXLPriorActiveCell.borders.top) then
	SayUsingVoiceOrBuffer(vctx_message,
		GetCXLBorderInfo(cXLActiveCell.borders.top,XLEdgeTop),
		ot_status)
endIf
if !CollectionCompare(cXLActiveCell.borders.right,cXLPriorActiveCell.borders.right) then
	SayUsingVoiceOrBuffer(vctx_message,
		GetCXLBorderInfo(cXLActiveCell.borders.right,XLEdgeRight),
		ot_status)
endIf
if !CollectionCompare(cXLActiveCell.borders.bottom,cXLPriorActiveCell.borders.bottom) then
	SayUsingVoiceOrBuffer(vctx_message,
		GetCXLBorderInfo(cXLActiveCell.borders.bottom,XLEdgeBottom),
		ot_status)
endIf
if !CollectionCompare(cXLActiveCell.borders.left,cXLPriorActiveCell.borders.left) then
	SayUsingVoiceOrBuffer(vctx_message,
		GetCXLBorderInfo(cXLActiveCell.borders.left,XLEdgeLeft),
		ot_status)
endIf
EndFunction

void function saySparklinesChange (int sparklines, int priorSparklines)
var string message
if sparklines == 0 then
	message = msgNoSparklines
elIf sparklines == 1 then
	message = msgSparkLineSingular
else
	message = formatString (msgSparkLines, sparklines)
endIf
sayUsingVoice(vctx_message,message,ot_help)
endFunction

void function DetectActiveCellFormatChange()
var
	string cellNumberFormat,
	string sCellStyleFormat
if cXLActiveCell.numberFormatLocal != cXLPriorActiveCell.numberFormatLocal then
	sayUsingVoice(vctx_message,GetCXLRangeNumberFormatDescription(cXLActiveCell),ot_help)
endIf
if cXLActiveCell.style.name != cXLPriorActiveCell.style.name then
	sayUsingVoice(vctx_message,cXLActiveCell.style.name,ot_help)
endIf
if cXLActiveCell.style.sparklines != cXLPriorActiveCell.style.sparklines then
	saySparklinesChange (cXLActiveCell.style.sparklines, cXLPriorActiveCell.style.sparklines)
endIf
EndFunction

string function getActiveCellCommentText()
return cXLActiveCell.comment.text
EndFunction

void function ReadActiveCellNoteOrComment()
Var
	String sComment
If UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
let sComment = cXLActiveCell.comment.text
if !sComment then
	UpdateCXLActiveCellComment(true)
	let sComment = cXLActiveCell.comment.text
EndIf
if sComment then
	if isSameScript() then
		UserBufferAddText(sComment)
		UserBufferAddText(CscBufferNewLine+cmsgBuffExit)
		UserBufferActivate()
		JAWSTopOfFile()
		SayAll()
		return
	else
		Say(sComment,ot_line)
		BrailleMessage (sComment)
	EndIf
else
	SayMessage (OT_error, msg40_O365_L, cmsgSilent);"No note or comment visible for this cell."
endIf
EndFunction

void function SayActiveCellHyperlinkAddress()
var
	object oCell,
	string linkAddress
if cXLActiveCell.hyperlinks.count > 0 then
	SayMessage(ot_help,GetActiveCellHyperlinkAddress())
elIf ActiveCellHasHyperlinkFormula() then
	let linkAddress = cXLActiveCell.formulaLocal
	;remove starting and ending parentheses.
	let linkAddress = stringChopRight(stringChopLeft(linkAddress,stringLength(scHyperlinkInFormula)+1),1)
	SayMessage(ot_help,LinkAddress)
else
	SayMessage(OT_error, msg43_L) ; no hyperlink associated with this cell
endIf
EndFunction

void function GotoHyperlink()
Var
	object oLink
Let oLink = oXLActiveCell.hyperlinks(1)
if !oLink then
	if ActiveCellHasHyperlinkFormula() then
		RouteJAWSToPC()
		pause()
		LeftMouseButton()
	endIf
endIf
oLink.follow(true)
EndFunction

void Function DetectCXLRangeHyperLink(collection cHyperLinks)
Var
	collection cLinks,
	string sAddress,
	string sScreenTip
if !cHyperlinks.count then
	return
EndIf
let cLinks = new collection
let cLinks = cXLActiveCell.hyperlinks
if HyperlinkAddressAnnouncement() then
	let sAddress = getHyperlinkAddress(cLinks[1])
	if stringContains(sAddress,scExclaim) then
		SayUsingVoice(vctx_message,formatString(msgHASHyperlinkAtAddress,sAddress),ot_help)
	else
		SayUsingVoice(vctx_message, msg42_L,ot_help)
	endIf
else
	SayUsingVoice(vctx_message, msg42_L,ot_help)
endIf
let sScreenTip = cLinks[1].screenTip
if sScreenTip!=cscNull then
	SayUsingVoice(vctx_message,FormatString(msgHyperlinkScreenTip,sScreenTip),ot_help)
EndIf
return true
EndFunction

void Function DetectActiveCellHyperLink()
if !cXLActiveCell.hyperLinks.count then
	UpdateCXLActiveCellHyperLinks()
EndIf
DetectCXLRangeHyperLink(cXLActiveCell.hyperLinks)
EndFunction

int function FindAutoTotalLocation(object oCells, int iStart, int iTotalType)
var
	int i,
	int iEnd,
	int MaxDistance
;cannot use cell count of the used range
; since this number can be large enough to cause sluggishness or freeze JAWS.
; So, the maximum allowable search distance is set in the MaxDistance variable.
let MaxDistance = 100
if MultipleRegionSupport() then
	if iTotalType == RowType then
		let iEnd = getCurrentRegionRight()
	elif iTotalType == ColumnType then
		let iEnd = getCurrentRegionBottom()
	EndIf
	if iEnd >= iStart then
		if iEnd-iStart > MaxDistance then
			let iEnd = iStart+MaxDistance
		EndIf
	else
		let iEnd = iStart
	EndIf
else
	let iEnd = iStart+MaxDistance
EndIf
let i = iStart
While i <= iEnd
	if stringContains(oCells(i).formula, scTotalFormulaStr) then
		return i
	EndIf
	let i = i+1
endWhile
return 0
EndFunction

string function GetAutoRowTotalText()
var
	object oCells,
	object oCurrentRegion,
	int iTotalLocation
oCells = oExcel.ActiveSheet.rows(cXLActiveCell.row).cells
oCurrentRegion = GetActiveCellCurrentRegion()
var int regionStart = oCurrentRegion.cells(1).Column
iTotalLocation = FindAutoTotalLocation(oCells,regionStart,ColumnType)
if !iTotalLocation then
	return cscNull
else
	SetTotalsColumnSetting(iTotalLocation,true)
	return oCells(iTotalLocation).text
endIf
EndFunction

string function GetAutoColumnTotalText()
var
	object oCells,
	object oCurrentRegion,
	int iTotalLocation
oCells = oExcel.ActiveSheet.columns(cXLActiveCell.column).cells
oCurrentRegion = GetActiveCellCurrentRegion()
var int regionStart = oCurrentRegion.cells(1).Row
let iTotalLocation = FindAutoTotalLocation(oCells,regionStart,RowType)
if !iTotalLocation then
	return cscNull
else
	SetTotalsRowSetting(iTotalLocation,true)
	return oCells(iTotalLocation).text
endIf
EndFunction

string function GetRowTotalText()
return cXLCurrentRow.totalCellText
endFunction

string function GetColumnTotalText()
return cXLCurrentColumn.totalCellText
EndFunction

void function ReadRowTotal()
var
	int iTotalLocation,
	string sTitle,
	string sText
let iTotalLocation = getTotalsColumnSetting()
if !iTotalLocation then
	let sText = GetAutoRowTotalText()
	if !sText then
		ProcessMessage (msg256_L, cmsgSilent, OT_error, msgError, MB_ICONERROR|MB_OK)
		; "no totals column defined and I cannot find a sum formula in the current row."
		return
	EndIf
	let cXLCurrentRow.totalCellText = sText
else
	let sText = cXLCurrentRow.totalCellText
endIf
if !sText then
	let sText = cmsgBlank1
endIf
sTitle = formatString (msgRowTotalDlgTitle, cXLCurrentRow.number)
ProcessMessage (formatString (msgRowTotal1_L, sText),
	formatString (msgRowTotal1_S, sText),
	ot_user_requested_information, sTitle, MB_ICONASTERISK|MB_OK)
EndFunction

void function ReadColumnTotal()
var
	int iTotalLocation,
	string sTitle,
	string sText
let iTotalLocation = getTotalsRowSetting()
if !iTotalLocation then
	let sText = GetAutoColumnTotalText()
	if !sText then
		ProcessMessage (msg257_L,cmsgSilent, OT_error, msgError, MB_ICONERROR | MB_OK)
		; "no totals row defined and I can't find a sum formula ..."
		return
	endIf
	let cXLCurrentColumn.totalCellText = sText
else
	let sText = cXLCurrentColumn.totalCellText
endIf
if !sText then
	let sText = cmsgBlank1
endIf
sTitle = formatString (msgColumnTotalDlgTitle, columnNumberToLetter (cXLCurrentColumn.number))
ProcessMessage (formatString (msgColTotal1_L, sText),
	formatString (msgColTotal1_S, sText),
	ot_user_requested_information, sTitle, MB_ICONASTERISK | MB_OK)
EndFunction

void function ReportGridlineStatus()
if InHJDialog() then
	SayFormattedMessage(OT_error, cMSG337_L, cMSG337_S)
	return
endIf
if oExcel.activeWindow.DisplayGridLines then
	if UserBufferIsActive() then
		SayMessage(OT_USER_BUFFER, msg76_L) ; "grid lines on"
	else
		SayMessage(ot_help, msg76_L) ; "grid lines on"
	EndIf
else
	if UserBufferIsActive() then
		SayMessage(OT_USER_BUFFER, msg75_L) ; "Grid lines off."
	else
		SayMessage (ot_help, msg75_L) ; "Grid lines off."
	EndIf
endIf
EndFunction

void function SayRangeInfo(object oRange)
var
	object oCell
BeginFlashMessage()
if oRange.mergeCells then
	let oCell = oXLSelection.cells(1)
else
	let oCell = oRange(1)
EndIf
SayObjectCellInfo(oCell)
EndFlashMessage()
EndFunction

int Function IsCellTextCroppedRight(object oCell, collection cCell, int iTextLength, string ByRef sCroppedCellAddress)
Var
	int iVCols,
	int iTextSegmentLength,
	int iNextCellWidth,
	int i,
	object oNextCol,
	string sNextCellText
If cCell.wrapText
|| cCell.ShrinkToFit
|| cCell.MergeCells  then
	return false
EndIf
let iVCols = oExcel.activeWindow.visibleRange.columns.count
If iTextLength >= cCell.Width  then
	let i = 1
	let oNextCol = oCell.columns(i+1)
	let iNextCellWidth = cCell.Width
	let iTextSegmentLength = iTextLength
	while i <= iVCols
		let sNextCellText = oNextCol.text
		If sNextCellText
		|| oNextCol.mergeCells then
			let sCroppedCellAddress = oNextCol.addressLocal(false,false)
			return true
		EndIf
		let oNextCol = oCell.columns(i+1)
		let iNextCellWidth = oNextCol.width
		let iTextSegmentLength = iTextSegmentLength-iNextCellWidth
		If iTextSegmentLength <= iNextCellWidth then
			return false
		EndIf
		let i = i+1
	EndWhile
EndIf
return false
EndFunction

int Function IsCellTextCroppedLeft(object oCell, collection cCell, int iTextLength, string ByRef sCroppedCellAddress)
Var
	int iVCols,
	int iTextSegmentLength,
	int iPriorCellWidth,
	int iHAlign,
	int iCol,
	int i,
	object oPriorCol,
	string sPriorCellText
let iHAlign = cCell.horizontalAlignment
; if horizontal alignment is general, left, or filled, no need to test cells to the left of active cell.
If iHAlign == xlhAlignGeneral
|| iHAlign*-1 == xlhAlignLeft
|| iHAlign == xlhAlignFill
|| cCell.wrapText
|| cCell.ShrinkToFit
|| cCell.MergeCells  then
	return false
EndIf
If iTextLength > cCell.width  then
	if cCell.column == 1
	&& (iHAlign*-1 == xlhAlignRight
	|| iHAlign*-1 == xlhAlignCenter
	|| iHAlign*-1 == xlhAlignDistributed
	|| iHAlign*-1 == xlHAlignJustify) then ; We are a tfirst column of row and text is cropped off the screen.
		let sCroppedCellAddress = cCell.address
		return true
	EndIf
	let iVCols = oExcel.activeWindow.visibleRange.columns.count
	let i = 1
	let oPriorCol = oCell.columns(i-1)
	let iCol = oPriorCol.column
	if iCol == 1
	|| iCol-iVCols == 1 then
		; we are at the beginning of the row.
		return false
	EndIf
	let iPriorCellWidth = cCell.width
	let iTextSegmentLength = iTextLength
	while iCol > 1
	&& i <= iVCols
		let sPriorCellText = oPriorCol.text
		If sPriorCellText
		|| oPriorCol.mergeCells then
			let sCroppedCellAddress = oPriorCol.addressLocal(false,false)
			return true
		EndIf
		let i = i-1
		let oPriorCol=oCell.columns(i-1)
		let iCol=oPriorCol.column
		let iPriorCellWidth=oPriorCol.width
		let iTextSegmentLength=iTextSegmentLength-iPriorCellWidth
		if iTextSegmentLength<=iPriorCellWidth then
			return false
		EndIf
	EndWhile
EndIf
return false
EndFunction

int Function IsCellTextOverlappingRight(object oCell, collection cCell, int iTextLength, string ByRef sOverlappingCellAddress)
var
	int iVCols,
	int iTextSegmentLength,
	int iNextCellWidth,
	int i,
	int iOrientation,
	int iHeight,
	object oNextCol,
	string sNextCellText
if cCell.MergeCells
|| cCell.wrapText
|| cCell.ShrinkToFit  then
	return false
EndIf
let iOrientation = cCell.orientation
If iOrientation == xlOrientNormal*-1
|| iOrientation == xlOrient360*-1 then
	let iOrientation = 0
EndIf
let iHeight = cCell.height
; if horizontal alignment is general, left,  or filled,
;or orientation is not 0, 90, or -90 degrees and the row height is equal to 13, the default height for one row
; there is no need to test cells to the right of active cell.
If cCell.horizontalAlignment == xlHAlignRight*-1
|| ((iOrientation == xlOrient270*-1
|| iOrientation == xlOrient90*-1)
&& iHeight >= 13)
|| (iOrientation != 0
&& iHeight == 13) then
	return false
EndIf
let iVCols = oExcel.activeWindow.visibleRange.columns.count
let iVCols = iVCols*2 ; in case overlaps off screen.
If iTextLength > cCell.width  then
	let i = 1
	let iNextCellWidth = cCell.width
	let iTextSegmentLength = iTextLength
	let oNextCol = oCell.columns(i+1)
	while i <= iVCols
		let sNextCellText = oNextCol.text
		If sNextCellText
		|| oNextCol.mergeCells then
			return false
		EndIf
		let i = i+1
		let oNextCol = oCell.columns(i)
		let iNextCellWidth = oNextCol.width
		let iTextSegmentLength = iTextSegmentLength-iNextCellWidth
		If iTextSegmentLength <= iNextCellWidth-8 then
			let sOverlappingCellAddress = oNextCol.addressLocal(false,false)
			return true
		EndIf
	EndWhile
EndIf
return false
EndFunction

int Function IsCellTextOverlappingLeft(object oCell, collection cCell, int iTextLength, string ByRef sOverlappingCellAddress)
var
	int iVCols,
	int iTextSegmentLength,
	int iPriorCellWidth,
	int iHAlign,
	int iOrientation,
	int iHeight,
	int iCol,
	int i,
	object oPriorCol,
	string sPriorCellText
if cCell.MergeCells
|| cCell.wrapText
|| cCell.ShrinkToFit then
	return false
EndIf
let iOrientation = cCell.orientation
If iOrientation == xlOrientNormal*-1
|| iOrientation == xlOrient360*-1 then
	let iOrientation=0
EndIf
let iHeight = cCell.height
let iHAlign = cCell.horizontalAlignment
; if horizontal alignment is general, left,  or filled,
;or orientation is not 0, 90, or -90 degrees and the row height is equal to 1
; there is no need to test cells to the left of active cell.
If iHAlign == xlhAlignGeneral
|| iHAlign == xlhAlignLeft*-1
|| iHAlign == xlhAlignFill
|| ((iOrientation == xlOrient270*-1
|| iOrientation == xlOrient90*-1)
& iHeight >= 13)
|| (iOrientation!=0
&& iHeight == 13) then
	return false
EndIf
If iTextLength > cCell.width
&& !(cCell.wrapText
|| cCell.ShrinkToFit) then
	let iVCols = oExcel.activeWindow.visibleRange.columns.count
	let i = 1
	let oPriorCol = oCell.columns(i-1)
	let iCol = oPriorCol.column
	if iCol == 1
	|| iCol-iVCols == 1 then
		; we are at the beginning of the row.
		return false
	EndIf
	let iPriorCellWidth = cCell.width ; first time through, it is the width of the starting cell.
	let iTextSegmentLength = iTextLength
	while iCol > 1
	&& i <= iVCols
		let sPriorCellText = oPriorCol.text
		If sPriorCellText
		|| oPriorCol.mergeCells then
			return false
		EndIf
		let i = i-1
		let oPriorCol = oCell.columns(i-1)
		let iCol = oPriorCol.column
		let iPriorCellWidth = oPriorCol.width
		let iTextSegmentLength=iTextSegmentLength-iPriorCellWidth
		If iTextSegmentLength <= iPriorCellWidth then
			let sOverlappingCellAddress=oPriorCol.addressLocal(false,false)
			return true
		EndIf
	EndWhile
EndIf
return false
EndFunction

string function GetCellTextVisibilityInfo(object oCell, collection cCell, int iTextLength)
var
	string sMsg,
	string sAddress
let sAddress = cCell.address
;cropping occurs when there is a cell with text following or preceding the active cell.
If	IsCellTextCroppedRight(oCell,cCell,iTextLength,sAddress) then
	let sMsg = sMsg+cscSpace+FormatString(msgTextCroppedRight,sAddress)
EndIf
If isCellTextCroppedLeft(oCell,cCell,iTextLength,sAddress) then
	let sMsg = sMsg+cscSpace+FormatString(msgTextCroppedLeft,sAddress)
EndIf
;overlapping occurs when there are no cells with text following or preceding  the active cell.
if IsCellTextOverlappingRight(oCell,cCell,iTextLength,sAddress) then
	let sMsg = sMsg+cscSpace+FormatString(msgTextOverlapRight,sAddress)
EndIf
if IsCellTextOverlappingLeft(oCell,cCell,iTextLength,sAddress) then
	let sMsg = sMsg+cscSpace+FormatString(msgTextOverlapLeft,sAddress)
endIf
;multiline cell is announced when the text length is larger than 146, which appears to be the line length of the edit window.
;needs further testing.
;JAWS gets the entire cell content, but the text is not visible beyond the few characters that comprise the cell width.
if iTextLength > 146 then
	; cell is multiline cell, regardless of cropped or overlapping status.
	let sMsg = sMsg+cscSpace+msgMultilineCell
endIf
return StringTrimLeadingBlanks(sMsg)
EndFunction

void function SayDetectedFontChanges(collection cCell)
Var
	int iTextColor,
	int iBackgroundColor,
	string sTextColor,
	string sBackgroundColor,
	string sFontSize,
	string sShading,
	string smsg
if cXLPriorActiveCell.font.foregroundColor != cXLActiveCell.font.foregroundColor
|| cXLPriorActiveCell.font.backgroundColor != cXLActiveCell.font.backgroundColor then
	if cCell.formatConditions.count > 0 then
		let oExcel.screenUpdating=0
		refreshWindow(GetFocus())
		let iTextColor = GetColorText()
		let iBackgroundColor = GetColorBackground()
		let oExcel.screenUpdating=-1
	Else
		iTextColor = cXLActiveCell.font.foregroundColor
		iBackgroundColor = cXLActiveCell.font.backgroundColor 
	EndIf
	let sShading = GetCXLRangeShadingInfo(cCell)
	if iBackgroundColor == xlColorBlack then
		if !sShading then
			let iBackgroundColor = xlColorWhite
		Else
			let iBackgroundColor = cCell.interior.color
		EndIf
	EndIf
EndIf
if stringCompare(cXLPriorActiveCell.font.name,cXLActiveCell.font.name)!=0 then
	let smsg = cXLActiveCell.font.name
EndIf
if cXLPriorActiveCell.font.size != cXLActiveCell.font.size then
	let sFontSize = formatString(msgFontSize,IntToString(cXLActiveCell.font.size))
	let smsg = smsg+cscSpace+sFontSize
EndIf
if cXLPriorActiveCell.font.bold != cXLActiveCell.font.bold then
	if cXLActiveCell.font.bold then
		let smsg = smsg+cscSpace+msgBold
	else
		let smsg = smsg+cscSpace+msgNotBold
	EndIf
EndIf
if cXLPriorActiveCell.font.italic != cXLActiveCell.font.italic then
	if cXLActiveCell.font.italic then
		let smsg = smsg+cscSpace+msgItalic
	else
		let smsg = smsg+cscSpace+msgNotItalic
	EndIf
EndIf
if cXLPriorActiveCell.font.underline != cXLActiveCell.font.underline then
	if cXLActiveCell.font.underline then
		let smsg = smsg+cscSpace+msgUnderline
	else
		let smsg = smsg+cscSpace+msgNotUnderline
	EndIF
EndIf
if cXLPriorActiveCell.font.strikethrough != cXLActiveCell.font.strikethrough then
	if cXLActiveCell.font.strikethrough then
		let smsg = smsg+cscSpace+msgStrikethrough
	else
		let smsg = smsg+cscSpace+msgNotStrikethrough
	EndIf
EndIf
if cXLPriorActiveCell.font.foregroundColor != cXLActiveCell.font.foregroundColor then
	let sTextColor = FormatString(msgTextColor,GetColorDescription(iTextColor))
	let smsg = smsg+cscSpace+sTextColor
EndIf
if cXLPriorActiveCell.font.backgroundColor != cXLActiveCell.font.backgroundColor then
	let sBackgroundColor = FormatString(msgBackgroundColor,GetColorDescription(iBackgroundColor))
	let smsg = smsg+cscSpace+sBackgroundColor
EndIf
SayUsingVoice(vctx_message,smsg,ot_help)
EndFunction

void Function SayFormControl(string sCellAddress)
var
	object shapes,
	object shape,
	int i,
	int count,
	string sLinkedCell,
	string sLinkedCellTopLeft,
	string sLinkedCellBottomRight,
	string sShapeAddress,
	string sDesc
let shapes = oXLActiveSheet.shapes
if !shapes then
	return
EndIf
let count = shapes.count
if count == 0 then
	return
endIf
let i = 1
while i <= count
	let shape = shapes(i)
	let sLinkedCell = shape.controlFormat.linkedCell
	if sLinkedCell then
		let sShapeAddress = stringReplaceSubstrings(sLinkedCell,scDollar,cscNull)
		if StringCompare(sShapeAddress,sCellAddress) == 0 then
			let sDesc = GetShapeObjectDescription(shape)
			SayFormattedMessageWithVoice(vctx_message,ot_help,
				formatString(msgFormControl,sDesc),
				formatString(msgFormControl,sDesc))
			return
		EndIf
	EndIf
	;check range:
	let sLinkedCellTopLeft = shape.topLeftCell.addressLocal(false,false)
	let sLinkedCellBottomRight = shape.bottomRightCell.addressLocal(false,false)
	if StringCompare(sLinkedCellTopLeft,sCellAddress) == 0
	|| StringCompare(sLinkedCellBottomRight,sCellAddress) == 0 then
		let sDesc = GetShapeObjectDescription(shape)
		SayFormattedMessageWithVoice(vctx_message,ot_help,
			formatString(msgFormControlRange,sDesc,sLinkedCellTopLeft,sLinkedCellBottomRight),
			formatString(msgFormControlRange,sDesc,sLinkedCellTopLeft,sLinkedCellBottomRight))
		return
	endIf
	let i = i+1
EndWhile
EndFunction

int Function GetPagebreakType(collection cCell, string byRef sType)
Var
	int iColType,
	int iRowType
let iColType = oXLActiveSheet.columns(cCell.column).pagebreak*-1
let iRowType = oXLActiveSheet.rows(cCell.row).pagebreak*-1
if iColtype == xlPagebreakNone
&& iRowType == xlPagebreakNone then
	let sType = cscNull
	return false
elif iColtype == xlPagebreakManual
&& iRowType == xlPageBreakManual then
	let sType = msgBothManualPagebreak
	return true
elif IColType == xlPagebreakManual
&& iRowType != xlPageBreakManual then
	let sType = msgColManualPagebreak
	return true
elif IColType != xlPagebreakManual
&& iRowType == xlPageBreakManual then
	let sType = msgRowManualPagebreak
	return true
elIf iColtype == xlPagebreakAutomatic
&& iRowType == xlPageBreakAutomatic then
	let sType = msgBothAutomaticPagebreak
	return true
elif IColType == xlPagebreakAutomatic
&& iRowType != xlPageBreakAutomatic then
	let sType = msgColAutomaticPagebreak
	return true
elif IColType != xlPagebreakAutomatic
&& iRowType == xlPageBreakAutomatic then
	let sType = msgRowAutomaticPagebreak
	return true
endIf
EndFunction

int Function HasPagebreak(collection cCell,string byRef sType)
if oXLActiveSheet.hPagebreaks.count == 0
&& oXLActiveSheet.vPagebreaks.count == 0 then
	return false
EndIf
;check manual or automatic:
return GetPagebreakType(cCell,sType)
EndFunction

string Function GetPagebreakAtActiveCell()
Var
	object oHPagebreaks,
	object oVPagebreaks,
	int hCount,
	int vCount,
	int i,
	object oRange,
	string sType,
	string sHAddress,
	string sVAddress
let sType = cscNull
let oHPagebreaks = oXLActiveSheet.hPagebreaks
let hCount = oHPagebreaks.count
let oVPagebreaks = oXLActiveSheet.vPagebreaks
let vCount = oVPagebreaks.count
if hCount+vCount == 0 then
	return cscNull
EndIf
let i = 1
while i <= hCount
	let oRange = oHPagebreaks(i).location
	let sHAddress = oRange.addressLocal(false,false)
	if sHAddress == cXLActiveCell.address then
		let i = hCount
		;check manual or automatic:
		GetPagebreakType(cXLActiveCell,sType)
		if sType!=cscNull then
			return formatString(msgPagebreakAtCurrentCell,cXLActiveCell.address,sType)
		EndIf
	EndIf
	let i = i+1
endWhile
while i <= vCount
	let oRange = oVPagebreaks(i).location
	let sVAddress = oRange.addressLocal(false,false)
	if sVAddress == cXLActiveCell.address then
		let i = VCount
		;check manual or automatic:
		GetPagebreakType(cXLActiveCell,sType)
		if sType!=cscNull then
			return formatString(msgPagebreakAtCurrentCell,cXLActiveCell.address,sType)
		EndIf
	endIf
	let i = i+1
endWhile
EndFunction

string Function GetPrintPageInfoForActiveSheet()
var
	object hBreakList,
	object vBreakList,
	object oHBreak,
	object oVBreak,
	int i,
	int iHFull,
	int iHPartial,
	int iVFull,
	int iVPartial,
	int hCount,
	int vCount,
	string sHPages,
	string sVPages,
	int iOrientation,
	string sOrientation,
	string smsg
let hBreakList = oXLActiveSheet.hPageBreaks
let hCount = hBreakList.count
let vBreakList = oXLActiveSheet.vPageBreaks
let vCount = vBreakList.count
if hCount+vCount == 0 then
	let smsg = msgNoHorizontalOrVerticalPagebreaks
else
	if hCount > 0 then
		For i = 1 to hCount
			let oHBreak = hBreakList(i)
			if oHBreak.extent == xlPageBreakFull then
				let iHFull = iHFull+1
			else
				let iHPartial = iHPartial+1
			EndIf
		endFor
		if iHFull > 0
		|| iHPartial > 0 then
			let shPages = formatString(msghPageBreaks,
				intToString(iHFull),intToString(iHPartial))
		endIf
	EndIf
	if vCount > 0 then
		For i = 1 to vCount
			let oVBreak = vBreakList(i)
			if oVBreak.extent == xlPageBreakFull then
				let iVFull = iVFull+1
			else
				let iVPartial = iVPartial+1
			EndIf
		endFor
		if iVFull > 0
		|| iVPartial > 0 then
			let sVPages = formatString(msgVPageBreaks,
				intToString(iVFull),intToString(iVPartial))
		endIf
	endIf
	if shPages then
		let smsg = sHPages
	endIf
	if sVPages then
		let smsg = smsg+cscBufferNewLine+sVPages
	EndIf
endIf
let iOrientation = oXLActiveSheet.PageSetup.orientation
if iOrientation == xlPagePortrait then
	let sOrientation = msgPortrait
elIf iOrientation == xlPageLandscape then
	let sOrientation = msgLandscape
endIf
; to get the printable number of pages, the hCount +1 and vCount +1 must be multiplied.
let smsg = smsg+cscBufferNewLine+
	formatString(msgTotalNumberOfPages,intToString((hCount+1)*(vCount+1)),sOrientation)
return smsg
EndFunction

string Function GetPageSetupFormatCodes(string sItem)
var
	int i,
	int count,
	string sText,
	string sFormatSegment,
	string sCode,
	string sFormat
let count = stringSegmentCount(sItem,scAmpersand)
if !count then
	return cscNull
endIf
let sText = stringSegment(sItem,scAmpersand,1)
let sFormatSegment = stringChopLeft(sItem,stringLength(sText))
let i = 1
while i <= count
	let sCode = stringSegment(sFormatSegment,scAmpersand,i)
	if sCode == scD then
		let sFormat = msgDate
	elif sCode == scT then
		let sFormat = sFormat+scSemi+msgTime
	elif sCode == scF then
		let sFormat = sFormat+scSemi+msgFile
	elif sCode == scA then
		let sFormat = sFormat+scSemi+msgWorkbook
	elif sCode == scP then
		let sFormat = sFormat+scSemi+msgPage
	elif sCode == scN then
		let sFormat = sFormat+scSemi+msgNumberOfPages
	endIf
	let i = i+1
EndWhile
return sFormat
EndFunction

string function GetHeaderFooterInfoForActiveSheet()
var
	object oPageSetup,
	string sLeftItem,
	string sCenterItem,
	string sRightItem,
	string sFormat,
	string sHeader,
	string sFooter,
	string smsg
let oPageSetup = oXLActiveSheet.pageSetup
let sLeftItem = oPageSetup.leftHeader
let sCenterItem = oPageSetup.CenterHeader
let sRightItem = oPageSetup.RightHeader
if sLeftItem then
	let sFormat = GetPageSetupFormatCodes(sLeftItem)
	if sFormat then
		let sLeftItem = stringSegment(sLeftItem,scAmpersand,1)+cscSpace+sFormat
	endIf
	let sHeader = formatString(msgLeftHeader,sLeftItem)
endIf
if sCenterItem then
	let sFormat = GetPageSetupFormatCodes(sCenterItem)
	if sFormat then
		let sCenterItem = stringSegment(sCenterItem,scAmpersand,1)+cscSpace+sFormat
	endIf
	let sHeader = sHeader+cscBufferNewLine+formatString(msgCenterHeader,sCenterItem)
endIf
if sRightItem then
	let sFormat = GetPageSetupFormatCodes(sRightItem)
	if sFormat then
		let sRightItem = stringSegment(sRightItem,scAmpersand,1)+cscSpace+sFormat
	endIf
	let sHeader = sHeader+cscBufferNewLine+formatString(msgRightHeader,sRightItem)
endIf
let sLeftItem = oPageSetup.leftFooter
let sCenterItem = oPageSetup.CenterFooter
let sRightItem = oPageSetup.RightFooter
if sLeftItem then
	let sFormat = GetPageSetupFormatCodes(sLeftItem)
	if sFormat then
		let sLeftItem = stringSegment(sLeftItem,scAmpersand,1)+cscSpace+sFormat
	endIf
	let sFooter = formatString(msgLeftFooter,sLeftItem)
endIf
if sCenterItem then
	let sFormat = GetPageSetupFormatCodes(sCenterItem)
	if sFormat then
		let sCenterItem = stringSegment(sCenterItem,scAmpersand,1)+cscSpace+sFormat
	endIf
	let sFooter = sFooter+cscBufferNewLine+formatString(msgCenterFooter,sCenterItem)
endIf
if sRightItem then
	let sFormat = GetPageSetupFormatCodes(sRightItem)
	if sFormat then
		let sRightItem = stringSegment(sRightItem,scAmpersand,1)+cscSpace+sFormat
	endIf
	let sFooter = sFooter+cscBufferNewLine+formatString(msgRightFooter,sRightItem)
endIf
if sHeader then
	let smsg = sHeader
endIf
if sFooter then
	if smsg then
		let smsg = smsg+cscBufferNewLine+sFooter
	else
		let smsg = sFooter
	endIf
endIf
if !smsg then
	return msgNoHeadersOrFooters
EndIf
return smsg
EndFunction

int Function IsFilteredRangeConsecutive(string sList, int iListType)
Var
	int i,
	int iCount,
	string sListItem,
	string sCol, ; the alphabetic column number to convert to an integer
	int iListNum,
	int iPriorListNum
let iCount = stringSegmentCount(sList,cscSpace)
let i = 1
while i <= iCount
	let sListItem = stringSegment(sList,cscSpace,i)
	if iListType == ColumnType then
		let iListNum = GetColumnNumberFromAddress(sListItem)
	else
		let iListNum = stringToInt(sListItem)
	endIf
	if i > 1
	&& iListNum != iPriorListNum+1 then
		return false
	EndIf
	let iPriorListNum = iListNum
	let i = i+1
endWhile
return true
EndFunction

void Function SayFilterTypeControl()
var
	object oFilterRange,
	int iFilterRangeCount,
	object oFirstRangeCell,
	object oLastRangeCell,
	int iFirstFilterCol,
	int iLastFilterCol,
	int iFirstFilterRow,
	int iLastFilterRow,
	object oAutofilterSort
let oFilterRange = oXLActiveSheet.autofilter.range
if oFilterRange then
	let iFilterRangeCount = oFilterRange.count
	let oFirstRangeCell = oFilterRange.cells(1)
	let iFirstFilterCol = oFirstRangeCell.column
	let oLastRangeCell = oFilterRange.cells(iFilterRangeCount)
	let iLastFilterCol = oLastRangeCell.column
	let iFirstFilterRow = oFirstRangeCell.row
	let iLastFilterRow = oLastRangeCell.row
	if cXLActiveCell.column >= iFirstFilterCol
	&& cXLActiveCell.column <= iLastFilterCol
	&& cXLActiveCell.row == iFirstFilterRow then
		let oAutofilterSort = oXLActiveSheet.autofilter.sort
		if oAutofilterSort then
			sayUsingVoice(vctx_message,msgAutoFilterDropDown,ot_status)
		endIf
	endIf
EndIf
EndFunction

string Function GetFilterOperator(object oFilterItem)
Var
	int iType
let iType = oFilterItem.operator
if !iType then
	return cscNull
elif iType == xlAnd then
	return msgAnd
elIf iType == xlBottom10Items then
	return msgBottom10Items
elIf iType == xlBottom10Percent then
	return msgBottom10Percent
ElIf iType == xlOr then
	return msgOr
elIf iType == xlTop10Items then
	return msgTop10Items
elIf iType == xlTop10Percent then
	return msgTop10Percent
else
	return cscNull
endIf
EndFunction

void Function SayFilterModeStatus()
if IsCXLAutoFilterMode() then
	if UserBufferIsActive() then
		UserBufferAddText(msgAutofilterModeOn_l)
		return
	EndIf
	SayMessage(ot_status,msgAutoFilterModeOn_l,msgAutoFilterModeOn_s)
	return
endIf
if oXLActiveSheet.FilterMode*-1 then
	;custom filter is on.
	if UserBufferIsActive() then
		UserBufferAddText(msgCustomFilterModeOn_l)
		return
	EndIf
	SayMessage(ot_status,msgCustomFilterModeOn_l,msgCustomFilterModeOn_s)
EndIf
EndFunction

void Function SayFilterScreenSensitiveHelp()
var
	object oFilterRange,
	object oFilters,
	int i,
	int count,
	Object oFilterItem,
	string sFilterItem,
	string sFilterOperator,
	string sCriteria1,
	string sCriteria2,
	string smsg
let oFilterRange = oXLActiveSheet.autofilter.range
let count = oFilterRange.count
let smsg = formatString(msgAutoFilterRangeScreenSensitiveHelp,
	oFilterRange.cells(1).addressLocal(false,false),
	oFilterRange.cells(count).addressLocal(false,false))
sayFormattedMessage(Ot_user_buffer,smsg)
let oFilters = oXLActiveSheet.Autofilter.Filters
let count = oFilters.count
if count == 0 then
	return
EndIf
let i = 1
while i <= count
	let oFilterItem=oFilters(i)
	if oFilterItem.on then
		let sFilterItem = intToString(i)
		let sCriteria1 = oFilterItem.criteria1
		let sCriteria2 = oFilterItem.criteria2
		let sFilterOperator = GetFilterOperator(oFilterItem)
		sayFormattedMessage(ot_user_buffer,formatString(msgFilterItemOn,sFilterItem))
		if sFilterOperator then
			SayFormattedMessage(ot_user_buffer,FormatString(msgFilterDescription,
				sFilterItem,intToString(count),sFilterOperator))
		elif sCriteria1
		&& sCriteria2 then
			sayFormattedMessage(ot_user_buffer,formatString(msgCriteria,sFilterItem,sCriteria1,sFilterOperator,sCriteria2))
		elIf sCriteria1
		&& !sCriteria2 then
			SayFormattedMessage(ot_user_buffer,formatString(msgCriteria1,sFilterItem,sCriteria1))
		elIf !sCriteria1
		&& sCriteria2 then
			SayFormattedMessage(ot_user_buffer,formatString(msgCriteria2,sFilterItem,sCriteria2))
		endIf
	EndIf
	let i = i+1
EndWhile
SayFormattedMessage(ot_user_buffer,GetDescriptionOfAutofilterSort())
EndFunction

void Function SayCXLCellOrientation(collection cCell)
var
	int iOrientation,
	string sMsg
let iOrientation = ConvertOrientationToDegrees(cCell.orientation)
if iOrientation == 0 then
	let smsg = MSGNormalOrientation
else
	let sMsg = FormatString(msgOrientation,IntToString(iOrientation))
endIf
SayUsingVoice(vctx_message,smsg,ot_help)
EndFunction

int function GetCellTextLengthInPoints(collection cCell)
; we must multiply the length computed by GetStringWidth by 72/100,
; which is 1/100th of an inch and yields the most accurate results.
return GetStringWidth(cCell.Text,cCell.font.name,
	cCell.font.size,cCell.font.bold,cCell.font.italic,
	(cCell.font.underline==2),cCell.font.strikethrough)*72/100
EndFunction

void function DescribeCellTextAppearance(object oCell, collection cRange, int iTextLength)
var
	string sCellDescription,
	collection cCell,
	int iTextColor,
	int iBackgroundColor,
	int iTemp,
	string sTemp
let cCell = new collection
UpdateCXLRangeAllData(cCell, oCell)
If cCell.wrapText then
	let sCellDescription = sCellDescription+cscBufferNewLine+msgWrapText
EndIf
if cCell.ShrinkToFit then
	let sCellDescription = sCellDescription+cscBufferNewLine+msgShrinkToFit
EndIf
If iTextLength > cCell.width then
	let sCellDescription = sCellDescription+cscBufferNewLine+FormatString(msgCellWidth,IntToString(cCell.columnWidth))
EndIf
let iTemp = (cCell.rowHeight)/(cCell.font.size)
If iTemp > 1 then
	let sCellDescription = sCellDescription+cscBufferNewLine+FormatString(msgCellHeight,IntToString(iTemp))
EndIf
let sTemp = GetCellTextVisibilityInfo(oCell,cCell, iTextLength)
if sTemp then
	let sCellDescription = sCellDescription+cscBufferNewLine+sTemp
EndIf
let iTemp = ConvertOrientationToDegrees(cCell.orientation)
if iTemp !=0 then
	let sCellDescription = sCellDescription+cscBufferNewLine+FormatString(msgOrientation,IntToString(iTemp))
EndIf
If cCell.interior.InvertIfNegative then
	let sCellDescription = sCellDescription+cscBufferNewLine+msgInvertedNegative
EndIf
if StringContains(cCell.numberFormatLocal,scRedNumber) then
	let sTemp = FormatString(msgInvertedNegative,scRed,GetColorName(GetColorBackground()))
	let sCellDescription = sCellDescription+cscBufferNewLine+sTemp
EndIf
let sCellDescription = sCellDescription+cscBufferNewLine+msgCellFont1_l
let sTemp = GetCXLRangeFontUnderlineAndEffectInfo(cCell,cscBufferNewLine)
if sTemp then
	let sCellDescription = sCellDescription+cscBufferNewLine+sTemp
EndIf
let sTemp = cCell.font.name
let sCellDescription = sCellDescription+cscBufferNewLine+sTemp
let sTemp = cCell.font.fontStyle
let sCellDescription = sCellDescription+cscBufferNewLine+sTemp
let sCellDescription = sCellDescription+cscBufferNewLine+formatString(msgPoint1_L,intToString(cCell.font.Size))
if GetCharacterAttributes () & attrib_highlight then
	let sCellDescription = sCellDescription+cscBufferNewLine+msgHighlighted
endIf
GetCXLRangeTextAndBackgroundColors(cCell,iTextColor,iBackgroundColor)
let sCellDescription = sCellDescription+cscBufferNewLine+FormatString(msgCellFontColor,GetColorDescription(iTextColor),getColorDescription(iBackgroundColor))
let sCellDescription = sCellDescription+cscBufferNewLine+GetCXLRangeShadingInfo(cCell)
let sCellDescription = sCellDescription+cscBufferNewLine+FormatString(msgCellVAlignment1_s,GetCXLActiveCellVerticalAlignmentInfo())
let sCellDescription = sCellDescription+cscBufferNewLine+FormatString(msgCellHAlignment1_s,GetCXLActiveCellHorizontalAlignmentInfo())
let ITemp = cCell.indentLevel
if iTemp >0 then
	let sCellDescription = sCellDescription+cscBufferNewLine+formatString(msgCellIndentLevel1_L,intToString(iTemp))
endIf
let sCellDescription = sCellDescription+cscBufferNewLine+formatString(msgCellNumberFormat1_s,GetCXLRangeNumberFormatDescription(cCell))
let sCellDescription = sCellDescription+cscBufferNewLine+formatString(msgStyle,cCell.style.name)
if cXLActiveSheet.AutoFilterMode then
	let sCellDescription = sCellDescription+cscBufferNewLine+GetDescriptionOfAutoFilterSort()
endIf
if TitleCellFontAndFormattingIndication () then
	let sCellDescription = sCellDescription+cscBufferNewLine+cscBufferNewLine+GetTitleCellFontAndFormattingInfo(oCell,true)
endIf
If UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
SetJcfOption(opt_virt_viewer,1)
UserBufferAddText(msgCellAppearance+cscBufferNewLine
	+sCellDescription+cscBufferNewLine+cscBufferNewLine+cmsgBuffExit)
UserBufferActivate(false)
JAWSTopOfFile()
SayAll()
SetJcfOption(opt_virt_viewer,0)
endFunction

void function DescribeActiveCellTextAppearance()
var
	int iTextLength
if cXLActiveCell.Text then
	let iTextLength = GetCellTextLengthInPoints(cXLActiveCell)
	DescribeCellTextAppearance(oXLActiveCell,cXLActiveCell,iTextLength)
else
	SayUsingVoice(vctx_message,cmsgBlank1,ot_word)
EndIf
EndFunction

void function SayObjectCellInfo(object oCell)
Var
	collection cCell,
	string sAddress,
	int iTextLength,
	string sTextVisibilityInfo,
	string sShading,
	string sPagebreakType
let cCell = new collection
if RangesAreIdentical(oCell,oXLActiveCell) then
	let cCell = cXLActiveCell
else
	UpdateCXLRange(cCell, oCell)
EndIf
DetectCXLRangeHyperLink(cCell.hyperLinks)
SayCXLValidationInfo(cCell.Validation)
if AnnounceTextVisible()
&& cCell.Text then
	UpdateCXLRangeVisibilityData(cCell,oCell)
	let iTextLength = GetCellTextLengthInPoints(cCell)
	let sTextVisibilityInfo = GetCellTextVisibilityInfo(oCell,cCell, iTextLength)
	if sTextVisibilityInfo then
		SayUsingVoice(vctx_message,sTextVisibilityInfo,ot_help)
	EndIf
EndIf
If CellShadingChangesAnnounce() then
	let sShading = GetCXLRangeShadingInfo(cCell)
	if StringCompare(sShading,gsPriorActiveCellShading) != 0 then
		let gsPriorActiveCellShading = sShading
		if !sShading then
			SayUsingVoice(vctx_message,msgDetectedShadingChangeNone,ot_help)
			ScheduleBrailleFlashMessage(msgDetectedShadingChangeNone)
		else
			SayUsingVoice(vctx_message,sShading,ot_help)
			ScheduleBrailleFlashMessage(sShading)
		endIf
	EndIf
EndIf
if FontChangesAnnounce() then
	SayDetectedFontChanges(cCell)
EndIf
if FormControlsDetection() then
	SayFormControl(cCell.Address)
endIf
if PagebreaksDetection() then
	If HasPageBreak(cCell,sPagebreakType) then
		SayUsingVoice(vctx_message,formatString(msgHasPagebreak,sPagebreakType),ot_user_requested_information)
	endIf
endIf
if OrientationIndication() then
	UpdateCXLRangeOrientation(cCell,oCell)
	if cXLActiveCell.orientation != cXLPriorActiveCell.orientation then
		SayCXLCellOrientation(cCell)
	EndIf
EndIf
EndFunction

int  function ReadSelectedMultipleAreas(optional int bForceReadCoordinates)
var
	collection c,
	string key,
	string sText
if cXLSelection.areaCount <= 1 then
	return false
EndIf
SayFormattedMessage(ot_selected,
	formatString(msgAreas1_L, intToString(cXLSelection.areaCount)),
	formatString(msgAreas1_S, intToString(cXLSelection.areaCount)))
let c = new collection
let c = cXLSelection.areas

if CellReadingVerbosity() == readCellContentsAndCoordinates || bForceReadCoordinates then
	forEach key in c
		Say(GetSpellStringCoordinatesFromAddress(c[key]),ot_selected)
	EndForEach
Endif
;say cell content moved to while navigating with more than one area selected.
let sText = oXLActiveCell.text
if sText then
	if StringContains(sText,scNumberSigns) then
		SayFormattedMessageWithVoice(vctx_message,ot_help,msgCellObscured_l,msgCellObscured_s)
	EndIf
	say(sText,ot_line)
else
	SayUsingVoice(vctx_message,cmsgBlank1,ot_word)
endIf
return true
EndFunction

int function ReadSelectedMultipleCellsInSingleArea(optional int bDescribeCellDetails, int bForceReadCoordinates)
var
	int i
If cXLSelection.cellCount <=  1
|| cXLSelection.mergeCells then
	return false
EndIf
SaySelectedRange(bForceReadCoordinates)
SayCxlValidationInfo (cXLActiveCell.Validation)
return true
EndFunction

void function SayCellTitles()
var int titleVerbosity = ShouldReadTitles()
if titleVerbosity & readRowTitles
	sayMessageWithMarkup(ot_screen_message,
		formatStringForMarkup(msgHeaderTemplate,GetActiveCellRowTitleText()))
EndIf
if titleVerbosity & readColumnTitles
	SayMessageWithMarkup(ot_screen_message,
		formatStringForMarkup(msgHeaderTemplate,GetActiveCellColumnTitleText()))
endIf
EndFunction

void function DetectTitleChangeDuringNavigation(int TitleVerbosity)
var string sTitle
if titleVerbosity & readRowTitles
&& cXLActiveCell.row != cXLPriorActiveCell.row then
	sTitle = GetActiveCellRowTitleText()
	if sTitle
		sayMessageWithMarkup(ot_screen_message,
			formatStringForMarkup(msgHeaderTemplate,sTitle))
	endIf
EndIf
if titleVerbosity & readColumnTitles
&& cXLActiveCell.column != cXLPriorActiveCell.column then
	sTitle = GetActiveCellColumnTitleText()
	if sTitle
		SayMessageWithMarkup(ot_screen_message,
			formatStringForMarkup(msgHeaderTemplate,sTitle))
	endIf
endIf
EndFunction

void function ReadActiveCellContextualInfo()
; if embedded table and on header, indicate type:
if cXLActiveCell.subtype == WT_COLUMNHEADER
|| cXLActiveCell.subtype == WT_ROWHEADER then
	indicateControlType (cXLActiveCell.subtype , cscNull)
endIf
if NumberFormatVerbosity () then
	DetectActiveCellFormatChange()
EndIf
if CellBorderVerbosity() then
	detectActiveCellBorderChange()
EndIf
if cXLActiveCell.ContainsErrors then
	sayMessage (OT_ERROR, msgCellContainsErrors)
endIf
var string itemStatusText = GetObjectItemStatus()
if !stringIsBlank (itemStatusText)
	SayFormattedMessageWithVoice(vctx_message,ot_help,itemStatusText)
endIf
EndFunction

void function ReadActiveCellAndDetectTitleChangeDuringNavigation(optional int bForceReadCoordinates)
;	DetectTitleChangeDuringNavigation(ShouldReadTitles())
var int SpeakHeadersBeforeContent = ShouldSpeakTableHeadersBeforeCellContent()
if SpeakHeadersBeforeContent
	DetectTitleChangeDuringNavigation(ShouldReadTitles())
endIf
If isChartActive() then
	ReadActiveChart()
	return
endIf
SayCellText(cXLActiveCell.text)
if cXLActiveCell.mergeCells
&& MergedCellsAnnounce() then
	SayFormattedMessageWithVoice(vctx_message,ot_JAWS_message,msgMergedCells,cmsgSilent)
EndIf
SayObjectCellInfo(oXLActiveCell)
if !SpeakHeadersBeforeContent
	DetectTitleChangeDuringNavigation(ShouldReadTitles())
endIf
if CellReadingVerbosity() == readCellContentsAndCoordinates || bForceReadCoordinates then
	if cXLActiveCell.mergeCells then
		SaySelectedRange(true)
	else
		SayCellCoordinates(cXLActiveCell,ot_position)
	endIf
endIf
ReadActiveCellContextualInfo()
EndFunction

void function ReadActiveCell(optional int bForceReadCoordinates)
;This function is depricated and is no longer called. It will be removed in future.
;Instead, ReadActiveCellAndDetectTitleChangeDuringNavigation is now called to support the option to configure whether titles are spoken before cell content or cell content before titles.
If isChartActive() then
	ReadActiveChart()
	return
endIf
SayCellText(cXLActiveCell.text)
if cXLActiveCell.mergeCells
&& MergedCellsAnnounce() then
	SayFormattedMessageWithVoice(vctx_message,ot_JAWS_message,msgMergedCells,cmsgSilent)
EndIf
SayObjectCellInfo(oXLActiveCell)
if CellReadingVerbosity() == readCellContentsAndCoordinates || bForceReadCoordinates then
	if cXLActiveCell.mergeCells then
		SaySelectedRange(true)
	else
		SayCellCoordinates(cXLActiveCell,ot_position)
	endIf
endIf
ReadActiveCellContextualInfo()
EndFunction

void Function ReadSelectedCells(optional int bDescribeCellDetails, int bForceReadCoordinates)
if IsEditingComment() then
	sayCharacter()
	return
EndIf
if ReadSelectedMultipleAreas(bForceReadCoordinates) then
	return
elif ReadSelectedMultipleCellsInSingleArea(bDescribeCellDetails, bForceReadCoordinates) then
	return
elif bDescribeCellDetails then
	DescribeActiveCellTextAppearance()
else
	ReadActiveCellAndDetectTitleChangeDuringNavigation(bForceReadCoordinates)
EndIf
EndFunction

int Function SayCell()
;Overwritten builtin function, called when table navigation keys are used.
if !worksheetHasFocus()
	return SayCell()
endIf
if cXLActiveCell.text then
	Say(cXLActiveCell.text,ot_line)
else
	SayUsingVoice(vctx_message,cmsgBlank1,ot_word)
endIf
SayObjectCellInfo(oXLActiveCell)
if NumberFormatVerbosity () then
	DetectActiveCellFormatChange()
EndIf
if CellBorderVerbosity() then
	detectActiveCellBorderChange()
EndIf
if cXLActiveCell.ContainsErrors then
	sayMessage (OT_ERROR, msgCellContainsErrors)
endIf
EndFunction

string function RemoveDuplicateAddressInfo (string sRange)
if (! stringSegmentCount (sRange, ":"))
	return sRange
endIf
if (stringCompare (stringSegment(sRange, ":", 1), stringSegment (sRange, ":", 2)) == 0)
	;same cell, just return the first:
	return stringSegment(sRange, ":", 1)
endIf
return sRange
endFunction

void Function readModifiedSelection(int direction, optional int bForceReadCoordinates)
var
	string sCellCoordinates,
	string sCellTitle,
	int iCellCount,
	int iPriorCellCount,
	int iCellCountDifference,
	collection cCurrentCell,
	collection cPriorCell,
	collection cChangedCell,
	int bExtendedSelectionMode
If IsEditingComment() then
	SayLine()
	return
EndIf
if cXLSelection.areaCount > 1 then
	SayMessage(ot_selected,msgSelecting1)
	ReadSelectedMultipleAreas(bForceReadCoordinates)
	return
EndIf
let bExtendedSelectionMode = IsExtendedSelectionMode()
let iCellCount = cXLSelection.cellCount
let iPriorCellCount = cxlPriorSelection.cellCount
let iCellCountDifference = iCellCount-iPriorCellcount
if !bExtendedSelectionMode
&& !(iCellCountDifference == 1 || iCellCountDifference == -1) then
	SayMessage(ot_selected,msgSelecting1)
	ReadSelectedCells(False, True)
	return
EndIf
if !bExtendedSelectionMode then
	if iCellCount > iPriorCellCount then
		SayMessage(ot_selected,msgSelecting1)
	elif iCellCount < iPriorCellCount then
		SayMessage(ot_selected,msgUnselecting1)
	EndIf
EndIf
let cCurrentCell = new collection
let cPriorCell = new collection
; test if we are moving down or left and whether we are unselecting or selecting
; this will determine which cell we read
if (direction == SelectionDirection_Forward && iCellCount > iPriorCellCount)
|| (direction == SelectionDirection_Backward && iCellCount < iPriorCellCount) then
	let cCurrentCell = cXLSelection.lastCell
	let cPriorCell = cXLPriorSelection.lastCell
else
	let cCurrentCell = cXLSelection.firstCell
	let cPriorCell = cXLPriorSelection.firstCell
EndIf
let cChangedCell = new collection
if iCellCount > iPriorCellCount
|| bExtendedSelectionMode then
	let cChangedCell = cCurrentCell
else
	let cChangedCell = cPriorCell
EndIf
Say(cChangedCell.text,ot_line)
if ShouldReadTitles() & readColumnTitles
&& cCurrentCell.column != cPriorCell.column then
	let sCellTitle = GetCellTitleText(cChangedCell.sheetName,cChangedCell.row,cChangedCell.column,ColumnType)
	if sCellTitle then
		sayUsingVoice(vctx_message,sCellTitle,ot_screen_message)
	EndIf
endIf
if ShouldReadTitles() & readRowTitles
&& cCurrentCell.row != cPriorCell.row then
	let sCellTitle = GetCellTitleText(cChangedCell.sheetName,cChangedCell.row,cChangedCell.column,RowType)
	if sCellTitle then
		sayUsingVoice(vctx_message,sCellTitle,ot_screen_message)
	EndIf
EndIf
let sCellCoordinates = StringReplaceSubStrings(GetSpellString(RemoveDuplicateAddressInfo (cChangedCell.address)),scColumnA,scUpperColumnA)
;If CellReadingVerbosity() == readCellContentsAndCoordinates || bForceReadCoordinates then
	sayUsingVoice(vctx_message,sCellCoordinates,ot_position)
;Endif
if bExtendedSelectionMode then
	SayMessage(ot_selected,msgSelecting1)
EndIf
EndFunction

string function GetCell()
;overwritten builtin function used during table navigation.
if !worksheetHasFocus() return GetCell() endIf
var
	object cell
if !oXLActiveCell then
	return GetCell()
endIf
return cXLActiveCell.text
EndFunction

int Function UpCell()
if worksheetHasFocus()
&& cXLActiveCell
&& oXLActiveCell then
	if cXLActiveCell.row > 1 then
		oXLActiveSheet.cells(cXLActiveCell.row-1,cXLActiveCell.column).select
		return true
	else
		return false
	endIf
else
	return upCell()
endIf
EndFunction

int Function DownCell ()
if worksheetHasFocus()
&& cXLActiveCell
&& oXLActiveCell then
	if cXLActiveCell.row < oXLActiveCell.entireColumn.cells.count then
		oXLActiveSheet.cells(cXLActiveCell.row+1,cXLActiveCell.column).select
		return true
	else
		return false
	endIf
else
	return DownCell()
endIf
EndFunction

int Function PriorCell()
if worksheetHasFocus()
&& cXLActiveCell
&& oXLActiveCell then
	if cXLActiveCell.column > 1 then
		oXLActiveSheet.cells(cXLActiveCell.row,cXLActiveCell.column-1).select
		return true
	else
		return false
	EndIf
else
	return priorCell()
endIf
EndFunction

int Function NextCell()
if worksheetHasFocus()
&& cXLActiveCell
&& oXLActiveCell then
	if cXLActiveCell.column < oXLActiveCell.entireRow.cells.count then
		oXLActiveSheet.cells(cXLActiveCell.row,cXLActiveCell.column+1).select
		return true
	else
		return false
	EndIf
else
	return nextCell()
endIf
EndFunction

int Function FirstCell()
if worksheetHasFocus()
&& oXLActiveCell
	oXLActiveSheet.cells(1).select
	return true
else
	return firstCell()
endIf
EndFunction

int Function LastCell()
var
	object oUsedRange,
	int count
if worksheetHasFocus()
&& oXLActiveCell
&& oXLActiveSheet then
	let oUsedRange = oXLSheetUsedRange()
	let count = oUsedRange.cells.count
	oUsedRange.cells(count).select
	return true
else
	return lastCell()
endIf
EndFunction

void function ReadColumn(optional int iFromRow, int iToRow)
var
	object oVisibleRange,
	object oColumn,
	object oRows,
	string sText,
	int iActiveCellColumn,
	int iActiveCellRow,
	int iStartRow,
	int iEndRow,
	int iCount,
	int bColumnHasText,
	int bShouldSayTitle,
	int iTitleStartColumn,
	int iTitleEndColumn,
	int iTitleStartRow,
	int iTitleEndRow,
	int i
let oVisibleRange = oExcel.activeWindow.visibleRange
let iActiveCellColumn = cXLActiveCell.column
let iActiveCellRow = cXLActiveCell.row
let oColumn = oXLActiveSheet.columns(iActiveCellColumn)
if iFromRow then
	let iStartRow = iFromRow
else
	let iStartRow = oVisibleRange.cells(1).row
endIf
let iCount = oVisibleRange.cells.count
if iToRow then
	let iEndRow = iToRow
else
	let iEndRow = oVisibleRange.cells(iCount).row
endIf
let oRows = oExcel.rows
let bShouldSayTitle = (ShouldReadTitles() & readRowTitles)
if bShouldSayTitle then
	GetTitleLocation(cXLActiveCell.sheetName,iActiveCellRow,iActiveCellColumn,ColumnType,iTitleStartColumn,iTitleEndColumn)
	GetTitleLocation(cXLActiveCell.sheetName,iActiveCellRow,iActiveCellColumn,RowType,iTitleStartRow,iTitleEndRow)
	if iActiveCellColumn <= iTitleStartColumn then
		let bShouldSayTitle = false
	EndIf
EndIf
let i = iStartRow
while i <= iEndRow
&& !isKeyWaiting()
	if !(oRows(i).hidden == VBTrue) then
		if bShouldSayTitle
		&& i > iTitleStartRow then
			SayMessageWithMarkup(ot_screen_message,
				formatStringForMarkup(msgHeaderTemplate,GetCellTitleText(cXLActiveCell.sheetName,i,iActiveCellColumn,RowType)))
		endIf
		let sText = oColumn.cells(i).text
		if sText then
			say(sText,ot_line)
			let bColumnHasText = true
		endIf
	EndIf
	let i = i+1
endWhile
if !bColumnHasText then
	SayUsingVoice(vctx_message,cmsgBlank1,ot_word) ; "Blank"
endIf
endFunction

void function ReadRow(optional int iFromCol, int iToCol)
var
	object oVisibleRange,
	object oRow,
	object oColumns,
	string sText,
	int iActiveCellRow,
	int iActiveCellColumn,
	int iStartColumn,
	int iEndColumn,
	int iCount,
	int bRowHasText,
	int bShouldSayTitle,
	int iTitleStartColumn,
	int iTitleEndColumn,
	int iTitleStartRow,
	int iTitleEndRow,
	int i
let oVisibleRange=oExcel.activeWindow.visibleRange
let iActiveCellRow = cXLActiveCell.row
let iActiveCellColumn = cXLActiveCell.column
let oRow = GetActiveSheet().rows(iActiveCellRow)
if !oRow then
	if iFromCol then
		sayFromCursor()
	elif iToCol then
		sayToCursor()
	else
		sayLine()
	endIf
	return
endIf
if iFromCol then
	let iStartColumn = iFromCol
else
	let iStartColumn = oVisibleRange.cells(1).column
endIf
let iCount = oVisibleRange.cells.count
if iToCol then
	let iEndColumn = iToCol
else
	let iEndColumn = oVisibleRange.cells(iCount).column
endIf
let oColumns = oExcel.columns
let bShouldSayTitle = (ShouldReadTitles() & readColumnTitles)
if bShouldSayTitle then
	GetTitleLocation(cXLActiveCell.sheetName,iActiveCellRow,iActiveCellColumn,ColumnType,iTitleStartColumn,iTitleEndColumn)
	GetTitleLocation(cXLActiveCell.sheetName,iActiveCellRow,iActiveCellColumn,RowType,iTitleStartRow,iTitleEndRow)
	if iActiveCellRow <= iTitleStartRow then
		let bShouldSayTitle = false
	EndIf
EndIf
let i = iStartColumn
while i <= iEndColumn
&& !isKeyWaiting()
	if !(oColumns(i).hidden == VBTrue) then
		if bShouldSayTitle
		&& i > iTitleStartColumn then
			SayMessageWithMarkup(ot_screen_message,
				formatStringForMarkup(msgHeaderTemplate,GetCellTitleText(cXLActiveCell.sheetName,iActiveCellRow,i,ColumnType)))
		endIf
		let sText = oRow.cells(i).text
		if sText then
			say(sText,ot_line)
			let bRowHasText = true
		endIf
	EndIf
	let i = i+1
endWhile
if !bRowHasText then
	SayUsingVoice(vctx_message,cmsgBlank1,ot_word) ; "Blank"
endIf
endFunction

void Function ReadToBottomOfColumn()
readColumn(cXLActiveCell.row,0)
endFunction

void function readFromTopOfColumn()
readColumn(0,cXLActiveCell.row)
endFunction

void Function readToEndOfRow()
var
	string sText
If CaretVisible()
&& !onFormulaBarUIAEditItem() then
	If !GetCharacter() then
		SaveCursor()
		InvisibleCursor()
		RouteInvisibleToPC()
		NextCharacter()
		let sText = GetTextInRect(GetCursorCol(),GetLineTop(),
			GetWindowRight(GetFocus()),GetLineBottom(),0,
			GetColorText(),GetColorBackground())
		PriorCharacter()
		RestoreCursor()
	Else
		let sText = GetTextInRect(GetCursorCol(),GetLineTop(),
			GetWindowRight(GetFocus()),GetLineBottom(),0,
			GetColorText(),GetColorBackground())
	EndIf
	if !sText then
		SayUsingVoice(vctx_message,cmsgBlank1,ot_word) ; "Blank"
	else
		Say(sText,ot_line)
	EndIf
	return
EndIf
readRow(CXLActiveCell.column,0)
endFunction

void function readFromStartOfRow()
var
	string sText
If CaretVisible()
&& !onFormulaBarUIAEditItem() then
	If !GetCharacter() then
		SaveCursor()
		InvisibleCursor()
		RouteInvisibleToPC()
		PriorCharacter()
		let sText = GetTextInRect(GetWindowLeft(GetCurrentWindow()),GetLineTop(),
			GetCursorCol(),GetLineBottom(),0,
			GetColorText(),GetColorBackground())
		NextCharacter()
		RestoreCursor()
	Else
		let sText = GetTextInRect(GetWindowLeft(getCurrentWindow()),GetLineTop(),
			GetCursorCol(),GetLineBottom(),0,
			GetColorText(),GetColorBackground())
	EndIf
	If !sText then
		SayUsingVoice(vctx_message,cmsgBlank1,ot_word) ; "Blank"
	else
		say(sText,ot_line)
	EndIf
	return
EndIf
readRow(0,CXLActiveCell.column)
endFunction

void function SayColumnFirstCellFromTop()
SayCellText(oExcel.Cells(1,cXLActiveCell.Column).text)
BrailleCellText (oExcel.Cells(1,cXLActiveCell.Column).text)
EndFunction

void function SayColumnSecondCellFromTop()
SayCellText(oExcel.Cells(2,cXLActiveCell.Column).text)
BrailleCellText (oExcel.Cells(2,cXLActiveCell.Column).text)
EndFunction

void Function SayColumnThirdCellFromTop()
SayCellText(oExcel.Cells(3,cXLActiveCell.Column).text)
BrailleCellText (oExcel.Cells(3,cXLActiveCell.Column).text)
EndFunction

void function SayColumnFourthCellFromTop()
SayCellText(oExcel.Cells(4,cXLActiveCell.Column).text)
BrailleCellText (oExcel.Cells(4,cXLActiveCell.Column).text)
EndFunction

void function SayRowFirstCellFromLeft()
SayCellText(oExcel.Cells(cXLActiveCell.row,1).text)
BrailleCellText (oExcel.Cells(cXLActiveCell.row,1).text)
EndFunction

void function SayRowSecondCellFromLeft()
SayCellText(oExcel.Cells(cXLActiveCell.row,2).text)
BrailleCellText (oExcel.Cells(cXLActiveCell.row,2).text)
EndFunction

void function SayRowThirdCellFromLeft()
SayCellText(oExcel.Cells(cXLActiveCell.row,3).text)
BrailleCellText (oExcel.Cells(cXLActiveCell.row,3).text)
EndFunction

void function SayRowFourthCellFromLeft()
SayCellText(oExcel.Cells(cXLActiveCell.row,4).text)
BrailleCellText (oExcel.Cells(cXLActiveCell.row,4).text)
EndFunction

string Function GetChosenAddressFromList(string ItemList, int index)
var
	string sItem,
	string sAddress
if !index then
	return cscNull
endIf
let sItem = stringSegment(itemList,list_item_separator,index)
let sAddress = stringSegment(sItem,cscColon+cscSpace,1)
return sAddress
EndFunction

string Function GetChosenAddressFromReversedList(string ItemList, int index)
var
	string sItem,
	string sAddress
if !index then
	return cscNull
endIf
let sItem = stringSegment(itemList,list_item_separator,index)
let sAddress = stringSegment(sItem,cscColon+cscSpace,-1)
return sAddress
EndFunction
void function ListRow()
var
	object oUsedRange,
	object rowCells,
	object oStart,
	object oEnd,
	string sText,
	string sAddress,
	int TitleReading,
	string dlgTitle,
	int choice,
	string RowData,
	string sChosenAddress,
	int i,
	int nListIndex,
	int ccount,
	int count
if InHJDialog() then
	SayFormattedMessage(OT_error, cMSG337_L, cMSG337_S)
	return
endIf
; SSB-SM: We only need the current row/column. This gives us a range with just the cells we need
let oUsedRange =oXLActiveCell.entireRow
let ccount = oUsedRange.columns.count
if !oUsedRange.cells(1).text then
	let oStart = oUsedRange.cells(1).end(xlToRight)
	if oStart.column == ccount
	&& !oStart.text
	then
		SayMessage (OT_error, msg68_L,msg68_S) ; no cells with data in current row.
		return
	endIf
Else
	let oStart = oUsedRange.cells(1)
EndIf
If !oUsedRange.cells(ccount).text then
	let oEnd = oUsedRange.cells(ccount).end(xlToLeft)
Else
	let oEnd = oUsedRange.cells(ccount)
EndIf
let rowCells = oXLActiveSheet.range(oStart, oEnd)
let count = rowCells.columns.count

let TitleReading = ShouldReadTitles()
let i = 1
while i <= count
	If RowCells.Columns(i).Hidden != VBTrue then
	 	let sText = rowCells.cells(i).text
 		if sText then
			let sAddress = rowCells.cells(i).addressLocal(false,false)
			if TitleReading & readColumnTitles then
				var string ttl = GetCellTitleText(
					cXLActiveCell.sheetName,
					rowCells.cells(i).row,
					rowCells.cells(i).column,
					ColumnType
				)
				let rowData = rowData+list_item_separator
					+formatString(msgListItem1Reverse, sAddress,
						ttl,
						sText)
			else
				let rowData = rowData+list_item_separator+
					formatString(msgListItem2Reverse, sAddress, sText)
			endIf
		EndIf
	endIf
	let i = i+1
endWhile
if !RowData then
	SayMessage (OT_error, msg68_L,msg68_S) ; no cells with data in current row.
	return
endIf
; chop leading delimiter to avoid empty item
let rowData = stringChopLeft(rowData,1)
if TitleReading & readRowTitles then
	let dlgTitle = GetActiveCellRowTitleText()+cscSpace
endIf
let dlgTitle = dlgTitle+formatString(msg66_L, intToString(cXLActiveCell.row))
let nListIndex = stringSegmentIndex(RowData,list_item_separator,formatString("%1:", cXLActiveCell.address))
if !nListIndex then
	let nListIndex = 1
endIf
let choice = DlgSelectItemInList (rowData,dlgTitle,false,nListIndex)
if !choice then
	return
endIf
let sChosenAddress = GetChosenAddressFromReversedList(rowData,choice)
oExcel.ActiveSheet.range(sChosenAddress).activate
EndFunction

void function ListColumn()
var
	object oUsedRange,
	object ColumnCells,
	object oStart,
	object oEnd,
	string sText,
	string sAddress,
	int TitleReading,
	string dlgTitle,
	int choice,
	string ColumnData,
	string sChosenAddress,
	int i,
	int nListIndex,
	int rcount,
	int count
if InHJDialog() then
	SayFormattedMessage(OT_error, cMSG337_L, cMSG337_S)
	return
endIf
; SSB-SM: We only need the current row/column. This gives us a range with just the cells we need
let oUsedRange =oXLActiveCell.entireColumn
let rcount = oUsedRange.rows.count
if !oUsedRange.cells(1).text then
	let oStart = oUsedRange.cells(1).end(xlDown)
	if oStart.row == rcount
	&& !oStart.text
	then
		SayMessage(OT_error, msg69_L) ; no cells with data in current column
		return
	endIf
else
	let oStart = oUsedRange.cells(1)
EndIf
if !oUsedRange.cells(rcount).text then
	let oEnd = oUsedRange.cells(rcount).end(xlUp)
else
	let oEnd = oUsedRange.cells(rcount)
EndIf
let ColumnCells = oXLActiveSheet.range(oStart, oEnd)
let count = ColumnCells.rows.count
if !count then
	return
endIf
let TitleReading = ShouldReadTitles()
let i = 1
while i <= count
	If ColumnCells.Rows(i).hidden != VBTrue then
 		let sText = columnCells.cells(i).text
		if sText then
			let sAddress = columnCells.cells(i).addressLocal(false,false)
			if TitleReading & readRowTitles then
				var string ttl = GetCellTitleText(
					cXLActiveCell.sheetName,
					columnCells.cells(i).row,
					columnCells.cells(i).column,
					RowType
				)
				let columnData = columnData+list_item_separator+
					formatString(msgListItem1Reverse, sAddress,
						ttl,
						sText)
			else
				let columnData = columnData+list_item_separator+
					formatString(msgListItem2Reverse, sAddress, sText)
			endIf
		EndIf
	EndIf
	let i = i+1
endWhile
if !ColumnData then
	SayMessage(OT_error, msg69_L) ; no cells with data in current column
	oUsedRange.Select ()
	return
endIf
; remove leading delimiter to avoid empty item
let columnData = stringChopLeft(columnData,1)
if TitleReading & readColumnTitles then
	let dlgTitle = GetActiveCellColumnTitleText()+cscSpace
endIf
let dlgTitle = dlgTitle+formatString(msg67_L, stringChopRight(cXLActiveCell.address, stringLength(intToString(cXLActiveCell.row))))
let nListIndex = stringSegmentIndex(ColumnData,list_item_separator,formatString("%1:", cXLActiveCell.address))
if !nListIndex then
	let nListIndex=1
endIf
let choice = DlgSelectItemInList (columnData,dlgTitle,false,nListIndex)
if !choice then
	return
endIf
let sChosenAddress = GetChosenAddressFromReversedList(columnData,choice)
oExcel.ActiveSheet.range(sChosenAddress).activate
EndFunction

VOID function FirstCellInRegion()
var object oCurrentRegion = GetActiveCellCurrentRegion()
oCurrentRegion.cells(1).select
EndFunction

void function LastCellInRegion()
var
	object oCurrentRegion,
	int iLast
oCurrentRegion = GetActiveCellCurrentRegion()
let iLast = oCurrentRegion.cells.count
oCurrentRegion.cells(iLast).select
EndFunction

void Function SayDataRegionDir(int xDir,int yDir)
var
	object oLastCell
let oLastCell = oXLActiveSheet.cells(oXLActiveCell.row-yDir,oXLActiveCell.column-xDir)
if !oLastCell.text then
	SayMessage(ot_smart_help,msgStartOfNewDataRegion,cmsgSilent)
else
	SayMessage(ot_smart_help,msgEdgeOfCurrentDataRegion,cmsgSilent)
endIf
EndFunction

void function EscapeToPriorSheet()
PerformScript PriorSheet()
PerformScript UpALevel()
EndFunction

void function EscapeToNextSheet()
PerformScript NextSheet()
PerformScript UpALevel()
EndFunction

void function AddSheetLinks()
if !IsFirstSheet() then
	UserBufferAddText(msgPriorSheetLink,
		cFuncEscapeToPriorSheet,msgPriorSheetLink,
		cFont_Aerial,12,ATTRIB_UNDERLINE,
		rgbStringToColor(cColor_BLUE),rgbStringToColor(cColor_White))
EndIf
If !IsLastSheet() then
	UserBufferAddText(msgNextSheetLink,
		cFuncEscapeToNextSheet,msgNextSheetLink,
		cFont_Aerial,12,ATTRIB_UNDERLINE,
		rgbStringToColor(cColor_BLUE),rgbStringToColor(cColor_White))
EndIf
EndFunction

int function getFontObjAttributes(object oFont)
var
	int iAttributes
let iAttributes=0
;we only support bold, italic, underline and strikethrough
if oFont.bold then
	let iAttributes=iAttributes & attrib_bold
endIf
if oFont.italic then
	let iAttributes=iAttributes & attrib_italic
endIf
if oFont.underline then
	let iAttributes=iAttributes & attrib_underline
endIf
if oFont.strikethrough then
	let iAttributes=iAttributes & attrib_Strikeout
endIf
return iAttributes
endFunction
string function GetActiveChartName()
Var
	object oChart
let oChart = oExcel.activeChart
if !oChart then
	return cscNull
endIf
if oChart.chartTitle.caption then
	return oChart.chartTitle.caption
else
	return oChart.name
endIf
endFunction

string Function getChartTypeDescription(object oChart)
var
	int type,
	string description
let type = oChart.chartType
if type < 0 then
	let type=type*(-1)
endIf
if type == xl3DArea then
	let description = msg259_L
elif type == xl3DAreaStacked then
	let description = msg260_L
elif type == xl3DAreaStacked100 then
	let description = msg261_L
elif type == xl3DBarClustered then
	let description = msg262_L
elif type == xl3DBarStacked then
	let description = msg263_L
elif type == xl3DBarStacked100 then
	let description = msg264_L
elif type == xl3DColumn then
	let description = msg265_L
elif type == xl3DColumnClustered then
	let description = msg266_L
elif type == xl3DColumnStacked then
	let description = msg267_L
elif type == xl3DColumnStacked100 then
	let description = msg268_L
elif type == xl3DLine then
	let description = msg269_L
elif type == xl3DPie then
	let description = msg270_L
elif type == xl3DPieExploded then
	let description = msg271_L
elif type == xlArea then
	let description = msg272_L
elif type == xlAreaStacked then
	let description = msg273_L
elif type == xlAreaStacked100 then
	let description = msg274_L
elif type == xlBarClustered then
	let description = msg275_L
elif type == xlBarOfPie then
	let description = msg276_L
elif type == xlBarStacked then
	let description = msg277_L
elif type == xlBarStacked100 then
	let description = msg278_L
elif type == xlBubble then
	let description = msg279_L
elif type == xlBubble3DEffect then
	let description = msg280_L
elif type == xlColumnClustered then
	let description = msg281_L
elif type == xlColumnStacked then
	let description = msg282_L
elif type == xlColumnStacked100 then
	let description = msg283_L
elif type == xlConeBarClustered then
	let description = msg284_L
elif type == xlConeBarStacked then
	let description = msg285_L
elif type == xlConeBarStacked100 then
	let description = msg286_L
elif type == xlConeCol then
	let description = msg287_L
elif type == xlConeColClustered then
	let description = msg288_L
elif type == xlConeColStacked then
	let description = msg289_L
elif type == xlConeColStacked100 then
	let description = msg290_L
elif type == xlCylinderBarClustered then
	let description = msg291_L
elif type == xlCylinderBarStacked then
	let description = msg292_L
elif type == xlCylinderBarStacked100 then
	let description = msg293_L
elif type == xlCylinderCol then
	let description = msg294_L
elif type == xlCylinderColClustered then
	let description = msg295_L
elif type == xlCylinderColStacked then
	let description = msg296_L
elif type == xlCylinderColStacked100 then
	let description = msg297_L
elif type == xlDoughnut then
	let description = msg298_L
elif type == xlDoughnutExploded then
	let description = msg299_L
elif type == xlLine then
	let description = msg300_L
elif type == xlLineMarkers then
	let description = msg301_L
elif type == xlLineMarkersStacked then
	let description = msg302_L
elif type == xlLineMarkersStacked100 then
	let description = msg303_L
elif type == xlLineStacked then
	let description = msg304_L
elif type == xlLineStacked100 then
	let description = msg305_L
elif type == xlPie then
	let description = msg306_L
elif type == xlPieExploded then
	let description = msg307_L
elif type == xlPieOfPie then
	let description = msg308_L
elif type == xlPyramidBarClustered then
	let description = msg309_L
elif type == xlPyramidBarStacked then
	let description = msg310_L
elif type == xlPyramidBarStacked100 then
	let description = msg311_L
elif type == xlPyramidCol then
	let description = msg312_L
elif type == xlPyramidColClustered then
	let description = msg313_L
elif type == xlPyramidColStacked then
	let description = msg314_L
elif type == xlPyramidColStacked100 then
	let description = msg315_L
elif type == xlRadar then
	let description = msg316_L
elif type == xlRadarFilled then
	let description = msg317_L
elif type == xlRadarMarkers then
	let description = msg318_L
elif type == xlStockHLC then
	let description = msg319_L
elif type == xlStockOHLC then
	let description = msg320_L
elif type == xlStockVHLC then
	let description = msg321_L
elif type == xlStockVOHLC then
	let description = msg322_L
elif type == xlSurface then
	let description = msg323_L
elif type == xlSurfaceTopView then
	let description = msg324_L
elif type == xlSurfaceTopViewWireframe then
	let description = msg325_L
elif type == xlSurfaceWireframe then
	let description = msg326_L
elif type == xlXYScatter then
	let description = msg327_L
elif type == xlXYScatterLines then
	let description = msg328_L
elif type == xlXYScatterLinesNoMarkers then
	let description = msg329_L
elif type == xlXYScatterSmooth then
	let description = msg330_L
elif type == xlXYScatterSmoothNoMarkers then
	let description = msg331_L
endIf
return description
EndFunction

void Function describeChart (object oChart, string seriesDescription, string seriesUnit,
	string pointDescription, string pointDescriptionPlural, int sayPercentageContribution)
var
	string sCategoryAxisTitle,
	string sValueAxisTitle,
	string sseriesLegend,
	string sdataLabel,
	object oSeries,
	int iSeriesIndex,
	int iSeriesCount,
	int iPointIndex,
	int iPointCount,
	string sCategoryReading,
	string sValueReading,
	string sPercentCalc,
	string sTmpPointCoordinates,
	int iRoundedPercent, ; rounded value
	string sValueRangeSourceSheet,
	string sNextValueReading, ; collect contiguous points with same valueReading
	int bNewSet, ; new set of contiguous points with same valueReading
	string sCategoryRange,
	string sValueRange,
	string sCategoryTitle,
	string sValueTitle,
	string sChartTitle,
	string sFontName,
	int iPointSize,
	int iAttributes,
	string sTempDesc, ; used for formatting parts of descriptions
	collection chartProperties,
variantArray seriesCollectionFormulaArray,
variantArray seriesCollectionNameArray,
variantArray seriesPointsArray,
int maxLegendLen,
int maxDataPoints

let maxDataPoints=IniReadInteger (SECTION_NonJCF_Options, hKey_MaxChartDataPoints, 200, excel_jcf)
let maxLegendLen=IniReadInteger (SECTION_NonJCF_Options, hKey_MaxChartLegendLen, 25, excel_jcf)

FetchObjectProperties (oChart, chartProperties)
FetchCollectionProperty(oExcel.activeChart.seriesCollection, "Item", 1, oExcel.activeChart.seriesCollection.count, "formula", seriesCollectionFormulaArray)
FetchCollectionProperty(oExcel.activeChart.seriesCollection, "Item", 1, oExcel.activeChart.seriesCollection.count, "name", seriesCollectionNameArray)

UserBufferClear()
UserBufferActivate(false)
let sChartTitle = chartProperties.chartTitle.caption
if !sChartTitle then
	let sChartTitle = chartProperties.name
endIf
let sFontName = chartProperties.chartTitle.font.name
let iPointSize = chartProperties.chartTitle.font.size
let iAttributes = GetFontObjAttributes(chartProperties.chartTitle.font)
UserBufferAddText(sChartTitle, fnSelectChartTitle, fnDisplaySelectChartTitle, sFontName, iPointSize, iAttributes)
UserBufferAddText(cscBufferNewLine+FormatString(msgChartDescription1_L, getChartTypeDescription(oChart)))
let iSeriesCount = oChart.seriesCollection.count
let iSeriesIndex = 1
if SeriesDescription then
	UserBufferAddText(formatString(msgChartContainsSeriesDesc1_L,
		intToString(iSeriesCount), SeriesDescription)+cscBufferNewLine) ; chart contains x lines, sets of bars etc.
else ; must be a pie chart
	let iSeriesCount = 1
endIf
if oChart.hasAxis(xlCategory) then
	let sCategoryAxisTitle = oChart.axes(xlCategory).axisTitle.caption
	let sFontName = oChart.axes(xlCategory).axisTitle.font.name
	let iPointSize = oChart.axes(xlCategory).axisTitle.font.size
	let iAttributes = GetFontObjAttributes(oChart.axes(xlCategory).axisTitle.font)
  	if sCategoryAxisTitle then
		UserBufferAddText(formatString(msgCategoryAxisTitle1_L, sCategoryAxisTitle),
			fnSelectCategoryAxisTitle, fnDisplaySelectCategoryAxisTitle, sFontName, iPointSize, iAttributes)
	else
		let sCategoryAxisTitle = msgCategory1
		UserBufferAddText(msgCategoryAxisTitle2_L)
	endIf
else
	let sCategoryAxisTitle = msgCategory1
endIf
if oChart.hasAxis(xlValue) then
	let sValueAxisTitle = oChart.axes(xlValue).axisTitle.caption
	let sFontName = oChart.axes(xlValue).axisTitle.font.name
	let iPointSize = oChart.axes(xlValue).axisTitle.font.size
	let iAttributes = GetFontObjAttributes(oChart.axes(xlValue).axisTitle.font)
	if sValueAxisTitle then
		UserBufferAddText(formatString(msgValueAxisTitle1_L, sValueAxisTitle),
			fnSelectValueAxisTitle, fnDisplaySelectValueAxisTitle, sFontName, iPointSize, iAttributes)
	else
		let sValueAxisTitle = msgValue1
		UserBufferAddText(msgValueAxisTitle2_L)
	endIf
else
	let sValueAxisTitle = msgValue1
endIf

while iSeriesIndex <=iSeriesCount
	FetchCollectionProperty(oExcel.activeChart.seriesCollection(iSeriesIndex).points, "Item", 1, oExcel.activeChart.seriesCollection(iSeriesIndex).points.count, "dataLabel", seriesPointsArray)
			
	let iPointCount = arraylength(seriesPointsArray)
	if iSeriesCount * iPointCount > maxDataPoints then
		userBufferAddText(msgChartTooLargeToProcess_L)	
		if oExcel.ActiveSheet.cells.count == 0 then
			;this sheet only consists of the chart:
			UserBufferAddText(cscBufferNewLine+msgSheetIsChartOnly)
			AddSheetLinks()
		EndIf
		return
	endIf
	
; note to translators, we are obtaining the parts of the formula which
	;specify the ranges of cells from which the chart is derived.
	let sCategoryRange = StringSegment (seriesCollectionFormulaArray[iSeriesIndex], scFormulaRangeDelimiter, 2)
	let sValueRange = StringSegment (seriesCollectionFormulaArray[iSeriesIndex], scFormulaRangeDelimiter, 3)
	let sValueRangeSourceSheet = stringSegment(sValueRange, scFormulaSheetDelimiter, 1)
	if sValueRangeSourceSheet then
		let sValueRangeSourceSheet = sValueRangeSourceSheet+scFormulaSheetDelimiter ; sheetX!
	endIf
	let sSeriesLegend = seriesCollectionNameArray[iSeriesIndex]
		if (stringLength(sSeriesLegend) > maxLegendLen)
			sSeriesLegend=stringLeft(sSeriesLegend, maxLegendLen)+"..."
	endIf

	if seriesUnit then
		let sTempDesc = cscBufferNewLine+formatString(seriesUnit,intToString(iSeriesIndex)) ; line, set of bars (etc) x
	endIf
	if sSeriesLegend then
		if sTempDesc then
		let sTempDesc = sTempDesc+cscSpace
		endIf
		let sTempDesc = sTempDesc+formatString(msgSeriesLegend1, sSeriesLegend)
	endIf
	
	if iPointCount > 0 then
		if sTempDesc then
			let sTempDesc = sTempDesc+cscSpace
		endIf
		let sTempDesc = sTempDesc+formatString(msgSeriesPointCount1_L,
			intToString(iPointCount), pointDescriptionPlural) ; has x points, bars etc
	endIf
	if sTempDesc then
		UserBufferAddText(sTempDesc)
	endIf
	let bNewSet = true
	let iPointIndex = 1
	while iPointIndex <= iPointCount
		let sCategoryReading = oExcel.evaluate(sCategoryRange).cells(iPointIndex).text
		let sValueReading = oExcel.evaluate(sValueRange).cells(iPointIndex).text
		if sayPercentageContribution then
			let sTmpPointCoordinates = oExcel.evaluate(sValueRange).cells(iPointIndex).address
			let sPercentCalc = formatString(XLRoundPercentCalcFunction,
				sValueRangeSourceSheet, sTmpPointCoordinates, sValueRange)
			let iRoundedPercent = oExcel.evaluate(sPercentCalc)
		endIf
		if iPointIndex < iPointCount
		&& !sayPercentageContribution then
			let sNextValueReading = oExcel.evaluate(sValueRange).cells(iPointIndex+1).text
	else
		let bNewSet = true ; force last point to be announced.
	endIf
	let sDataLabel = seriesPointsArray[iPointIndex].caption
	if bNewSet
	|| sValueReading != sNextValueReading then
		; ie first or last in set
		UserBufferAddText(
			formatString(msgPointCategoryDesc1, formatString(pointDescription, intToString(iPointIndex)),
			sDataLabel, sCategoryAxisTitle, sCategoryReading)+cscSpace,cscNull, cscNull, cscNull, 0, 0, false) ;
		endIf
		; only want to read value axis title and value if next point is different
		; otherwise suppress until found end of same value readings
		if sNextValueReading != sValueReading
		|| iPointIndex == iPointCount then
			if SayPercentageContribution
			&& !stringContains(seriesPointsArray[iPointIndex].caption, scPercent) then
				UserBufferAddText(formatString(msgPointValueDesc1, sValueAxisTitle, sValueReading)+cscSpace,cscNull, cscNull, cscNull, 0, 0, false)
				UserBufferAddText(formatString(msgContributesPercentage1, intToString(iRoundedPercent)))
			else
				UserBufferAddText(formatString(msgPointValueDesc1, sValueAxisTitle, sValueReading))
			endIf
		let bNewSet = true
		else ; same, ignore until found end of same values
			if bNewSet then ; announce "through" unless last point
				UserBufferAddText(msgThrough1+cscSpace) ; through
				let bNewSet=false ; not a new set, continuing old set.
			endIf
		endIf
		let iPointIndex = iPointIndex+1
	endWhile
	let iSeriesIndex = iSeriesIndex+1
endWhile
if oExcel.ActiveSheet.cells.count == 0 then
	;this sheet only consists of the chart:
	UserBufferAddText(cscBufferNewLine+msgSheetIsChartOnly)
	AddSheetLinks()
EndIf
;JAWSTopOfFile()
;sayAll()
EndFunction

void Function ReadChart(object oChart)
var
	string sChartTitle,
	string sSeriesDescription, ; lines, sets of bars, etc
	string sSeriesUnit, ; line, set of bars, etc
	string sPointDescription, ; point, bar, etc
	string sPointDescriptionPlural, ; points, bars etc
	int bSayPercentageContribution, ; used for Pie charts and those for which the value contributes to a total.
	int iType
let iType =oChart.chartType
if iType < 0 then
	let iType = (iType*-1)
endIf
if iType == xlLine
|| iType == xlLineMarkers
|| iType == xlLineMarkersStacked
|| iType == xlLineMarkersStacked100
|| iType == xlLineStacked
|| iType == xlLineStacked100 then
	let sSeriesDescription = msgLinePlural1 ; lines
	let sSeriesUnit = msgLineSingular1 ; line
	let sPointDescription = msgPointSingular1 ; point
	let sPointDescriptionPlural = msgPointPlural1 ; points
	let bSayPercentageContribution = false
	describeChart(oChart, sSeriesDescription, sSeriesUnit, sPointDescription, sPointDescriptionPlural, bSayPercentageContribution)
elif iType == xlBarClustered
|| iType == xlBarStacked
|| iType == xlBarStacked100
|| iType == xlConeBarClustered
|| iType == xlConeBarStacked
|| iType == xlConeBarStacked100
|| iType == xlCylinderBarClustered
|| iType == xlCylinderBarStacked
|| iType == xlCylinderBarStacked100
|| iType == xlPyramidBarClustered
|| iType == xlPyramidBarStacked
|| iType == xlPyramidBarStacked100 then
	let sSeriesDescription = msgSetOfHorizBars1 ; distinct sets of horizontal bars
	let sSeriesUnit = msgSetSingular1 ; set (of bars)
	let sPointDescription = msgBarSingular1 ; bar
	let sPointDescriptionPlural = msgBarPlural1 ; bars
	let bSayPercentageContribution = false
	describeChart(oChart, sSeriesDescription, sSeriesUnit, sPointDescription, sPointDescriptionPlural, bSayPercentageContribution)
elif iType == xlColumnClustered
|| iType == xlColumnStacked
|| iType == xlColumnStacked100
|| iType == xlConeCol
|| iType == xlConeColClustered
|| iType == xlConeColStacked
|| iType == xlConeColStacked100
|| iType == xlCylinderCol
|| iType == xlCylinderColClustered
|| iType == xlCylinderColStacked
|| iType == xlCylinderColStacked100
|| iType == xlPyramidCol
|| iType == xlPyramidColStacked
|| iType == xlPyramidColStacked100 			then
	let sSeriesDescription = msgSetOfVertColumns1 ; distinct sets of vertical columns
	let sSeriesUnit = msgSetSingular1 ; set (of columns)
	let sPointDescription = msgColumnSingular1 ; column
	let sPointDescriptionPlural = msgColumnPlural1 ; columns
	let bSayPercentageContribution = false
	describeChart(oChart, sSeriesDescription, sSeriesUnit, sPointDescription, sPointDescriptionPlural, bSayPercentageContribution)
elif iType == xlPie
|| iType == xlPieExploded then
	let sSeriesDescription = cscNull ; only one series for a pie chart
	let sSeriesUnit = cscNull ; not applicable
	let sPointDescription = msgSliceSingular1 ; slice
	let sPointDescriptionPlural = msgSlicePlural1 ; slices
	let bSayPercentageContribution = true
	describeChart(oChart, sSeriesDescription, sSeriesUnit, sPointDescription, sPointDescriptionPlural, bSayPercentageContribution)
elif iType == xlDoughnut
|| iType == xlDoughnutExploded then
	let sSeriesDescription = msgSetOfSlices1 ; distinct sets of slices
	let sSeriesUnit = msgSetSingular1 ; set (of slices)
	let sPointDescription = msgSliceSingular1 ; segment
	let sPointDescriptionPlural = msgSlicePlural1 ; segments
	let bSayPercentageContribution = true
	describeChart(oChart, sSeriesDescription, sSeriesUnit, sPointDescription, sPointDescriptionPlural, bSayPercentageContribution)
elif iType > 0 then
	let sSeriesDescription = msgSeriesPlural1 ; series
	let sSeriesUnit = msgSeriesSingular1 ; series
	let sPointDescription = msgPointSingular1 ; point
	let sPointDescriptionPlural = msgPointPlural1 ; points
	let bSayPercentageContribution = false
	describeChart(oChart, sSeriesDescription, sSeriesUnit, sPointDescription, sPointDescriptionPlural, bSayPercentageContribution)
else
	SayMessage(ot_error, msg332_L) ; no chart active
endIf
EndFunction

void Function ReadActiveChart()
ReadChart(oExcel.activeChart)
EndFunction

void Function ReadActiveChartSummary()
var
object chart,
string title,
string desc

let chart=oExcel.activeChart
if !chart then
	return
endIf
let title= chart.chartTitle.caption
if !title then
	let title = chart.name
endIf
sayMessage(OT_CONTROL_NAME, title)
let desc=getChartTypeDescription(chart)
sayMessage(OT_CONTROL_TYPE, desc)
EndFunction

void function selectChartTitle(object oChart)
sayMessage(ot_selected_item, msgSelectingChartTitle)
oChart.chartTitle.select
endFunction

void function selectCategoryAxisTitle(object oChart)
sayMessage(ot_selected_item, msgSelectingCategoryAxisTitle)
oChart.axes(xlCategory).axisTitle.select
endFunction

void function selectValueAxisTitle(object oChart)
sayMessage(ot_selected_item, msgSelectingValueAxisTitle)
oChart.axes(xlValue).axisTitle.select
endFunction

void Function SelectActiveChart()
var
	object oCharts,
	; for counting multiple charts on a sheet:
	object Shapes, int Type, int Count, int i, int ChartCount, int AutoShapeCount,
	object oChart
if !worksheetHasFocus()
	sayMessage(ot_error,msgNotInWorksheetArea_l,msgNotInWorksheetArea_s)
	return
endIf
let oCharts = oExcel.activeSheet.chartObjects
if oCharts == null () then
	let Shapes = oXLActiveSheet.shapes
	let Count = Shapes.count
	for i=1 to Count
		Type = Shapes(i).type
		if Type == msoChart then
			ChartCount = ChartCount+1 
		ElIf Type == msoAutoShape then
			AutoShapeCount = AutoShapeCount+1
		endIf
	endFor
	if AutoShapeCount+ChartCount > 0 then
		SayMessage (OT_ERROR, FormatString (msgScrnSensitiveHlp4_L, IntToString (AutoShapeCount+ChartCount)))
		return
	endIf
endIf
if !oCharts.count then
	SayMessage(ot_error,msgNoCharts_l,msgNoCharts_s)
	return
endIf
let oChart = oCharts(1)
if oChart then
	oChart.activate
	oExcel.activeChart.select
	SayMessage(ot_select,msgActiveChartSelected_l,msgActiveChartSelected_s)
	ScheduleBrailleFlashMessage(msgActiveChartSelected_l)
endIf
EndFunction

void function PostMonitorCell(string address)
var
	string sTmp,
	string sText,
	object oRange,
	int i,
	int count,
	int iCol,
	int iRow
if inHjDialog () then
	return
endIf
let oRange = oXLActiveSheet.range(address)
let iCol = oRange.column
let iRow = oRange.row
If MonitorCellTitles() then
	sTmp = GetCellTitleText(oXLActiveSheet.name,iRow,iCol,ColumnType)
	if sTmp && ! stringIsBlank (sTmp) then
		sText = sTmp+ cscBufferNewLine
	endIf
	sTmp = GetCellTitleText(oXLActiveSheet.name,iRow,iCol,RowType)
	if sTmp && ! stringIsBlank (sTmp) then
		sText = sText + sTmp
	endIf
EndIf
let count = oRange.cells.count
for i=1 to count
	let stmp = oRange.cells(i).text
	if ! stringIsBlank (sTmp) then
		let sText = sText+cscBufferNewLine+sTmp
	endIf
endFor
ProcessMessage (sText, sText, OT_USER_REQUESTED_INFORMATION, address, MB_OK|MB_ICONINFORMATION)
endFunction

void function ReadMonitorCell(string address)
var
	string sText,
	object oRange,
	int i,
	int count,
	int iCol,
	int iRow,
	string str,
	string str2
let oRange = oXLActiveSheet.range(address)
let iCol = oRange.column
let iRow = oRange.row
If MonitorCellTitles() then
	let str = GetCellTitleText(oXLActiveSheet.name,iRow,iCol,ColumnType)
	let str2 = GetCellTitleText(oXLActiveSheet.name,iRow,iCol,RowType)
	BeginFlashMessage()
	; having an empty str will cause the Flash message to not appear
	if str then
		sayMessage(ot_user_requested_information,str)
	endif
	if str2 then
		sayMessage(ot_user_requested_information,str2)
	endif
EndIf
let count = oRange.cells.count
let i = 1
while i <= count
	let sText = oRange.cells(i).text
	if !stringIsBlank(sText) then
		Say(sText,ot_user_requested_information)
	endIf
	let i = i+1
endWhile
If CellReadingVerbosity() == readCellContentsAndCoordinates then
	SayFormattedMessageWithVoice(vctx_message,ot_user_requested_information,address,address)
EndIf
EndFlashMessage()
endFunction

string function GetAddressOfNextOrPriorCellType(object oCell,object oItem,int iCount)
var
	int iRow,
	int i,
	string sResult,
	int bUseParent
let iRow = oCell.row
if oItem == oExcel.comments then
	let bUseParent = true
endIf
let i = 1
while i < iCount
&& !sResult
	if bUseParent then
		if oItem(i).parent.row >= iRow then
			let sResult = oItem(i).parent.addressLocal(false,false)
		EndIf
	else
		if oItem(i).row >= iRow then
			let sResult = oItem(i).addressLocal(false,false)
		EndIf
	endIf
	let i = i+1
endWhile
if sResult then
	return sResult
EndIf
let i = iCount
while i > 0
&& !sResult
	if bUseParent then
		if oItem(i).parent.row <= iRow then
			let sResult = oItem(i).parent.addressLocal(false,false)
		EndIf
	else
		if oItem(i).row <= iRow then
			let sResult = oItem(i).addressLocal(false,false)
		EndIf
	endIf
	let i = i-1
EndWhile
return sResult
EndFunction

string function GetObjectDataFromItem(object oItem, int iType)
var
	object o,
	string s1,
	string s2,
	string s3
let o = oItem
if iType == NoteCommentType then
	let s1 = o.text
	if s1 then
		let s2 = o.parent.addressLocal(false,false)
		return formatString(msgListItem2,s2,s1)
	EndIf
elif iType == VisibleCelltype then
	let s1 = o.text
	if s1 then
		let s2 = o.addressLocal(false,false)
		return formatString(msgListItem2,s2,s1)
	EndIf
elif iType == HyperlinkType then
	let s1 = GetHyperlinkObjectAddress(o)
	let s2 = o.textToDisplay
	if isCellAddress(s1)
	&& s2
	&& !StringContains(s1,s2) then
		if StringContains(s1,oXLActiveSheet.name) then
			let s1 = TrimSheetNameFromHyperlinkAddress(s1)
		endIf
		return s2+cscSpace+s1
	else
		if !s2 then
			let s2 = TrimSheetNameFromHyperlinkAddress(s1)
		endIf
		return s2
	EndIf
elif iType == ShapeType then
	if o.type != msoComment then
		let s1 = GetShapeObjectDescription(o)
		;shapes that are dropdown form controls cannot be selected from a list
		;because they are not tied to a particular cell.
		if s1 != msgShapetype3_l then
			; To get the title and alternative text,
			; but avoid compilation errors where the compiler won't let you concatenate a string with a string member of an object
			var string title = o.title
			var string alternativeText = o.AlternativeText
			let s2 = title+cscSpace+AlternativeText
			if StringIsBlank (s2) then
				s2 = o.textFrame.characters.text
			endIf
			return formatString(msgListItemShape1,
				s1, GetShapeObjectTopLeftAndBottomRight(oItem), s2)
		endIf
	EndIf
elif iType == CellsWithFormulaType then
	let s1 = o.formula
	if StringLeft(s1,1) == scEquals then
		let s2 = o.addressLocal(false,false)
		return formatString(msgListItem2, s2,s1)
	EndIf
elif iType == CellsAtHPagebreakType then
	let o = o.location
	let s1 = o.addressLocal(false,false)
	;if s1 then
		let s2 = o.text
		return formatString(msgListItemHPageBrk1, s1, s2)
	;EndIf
elif iType == CellsAtVPagebreakType then
	let o = o.location
	let s1 = o.addressLocal(false,false)
	;if s1 then
		let s2 = o.text
		return formatString(msgListItemVPageBrk1, s1, s2)
	;EndIf
elif iType == WorksheetType then
	let s1 = o.name
	if o.visible != VBTrue then
		let s1 = FormatString(msgHiddenSheet,s1)
	endIf
	return s1
EndIf
return cscNull
EndFunction

int function isCellAddress(string s)
var int pos = stringContainsFromRight(s, "!")
if pos then
	; Allow anything for a sheet name left of this.
	s = stringChopLeft(s, pos)
endIf
var int digitsFound = False
while s && stringContains("0123456789", stringRight(s, 1))
	digitsFound = True
	s = stringChopRight(s, 1)
endWhile
if !digitsFound then
	return False
elif stringLength(s) > 3 then
	return False
endIf
while s && stringContains("abcdefghijklmnopqrstuvwxyz", stringLower(stringLeft(s, 1)))
	s = stringChopLeft(s, 1)
endWhile
if stringLength(s) > 0 then
	; Non-alphabetical character that's not part of the column number.
	return False
endIf
return True
endFunction

string function GetObjectDataFromList(object oList, int count, int iType,
	optional int iIndexType, optional string ByRef sObjIndexList)
var
	int i,
	int n,
	string sListData,
	string sItem
for i = 1 to count
	let sItem = GetObjectDataFromItem(oList(i),iType)
	if sItem then
		if iIndexType == ObjectCollectionIndexType then
			let sItem = IntToString(i)+cScSpace+sItem
		elif iIndexType == ItemListIndexType then
			let n = n+1
			let sItem = IntToString(n)+cScSpace+sItem
		EndIf
		let sListData = sListData+list_Item_separator+sItem
		let sObjIndexList = sObjIndexList+list_Item_separator+IntToString(i)
	EndIf
endFor
if sListData then
	; remove leading delimiter to avoid empty item
	let sListData = stringChopLeft(sListData,1)
	let sObjIndexList = stringChopLeft(sObjIndexList,1)
EndIf
return sListData
EndFunction

void function ListCellsWithNotes()
var
	string sWindowView,
	object oComments,
	int iCount,
	string sListData,
	int iCurIndex,
	int iChoice,
	string sChosenAddress
if InHJDialog () then
	SayFormattedMessage(OT_error, cMSG337_L, cMSG337_S)
	return
endIf
; need to test for split or freeze panes view,
;Otherwise may get no comments or wrong number of comments in list.
let sWindowView = GetWorksheetWindowView()
if sWindowView then
	SayMessage(ot_error,
		formatString(msgFreezePanesOrSplitWindowError_O365_L,sWindowView),
		formatString(msgFreezePanesOrSplitWindowError_O365_s,sWindowView))
	return
endIf
let oComments = oXLActiveSheet.comments
let iCount = oComments.count
if !iCount then
	SayMessage(OT_error, msgNoNotes) ; no cells with notes visible in active window
	return
endIf
let sListData = GetObjectDataFromList(oComments,iCount,NoteCommentType)
if !sListData then
	SayMessage (OT_error, msgNoComments) ; no cells with comments visible in active window
	return
endIf
let sListData = StringReplaceChars(sListData,vbcr+scLineFeed,cscSpace)
let sListData = StringReplaceChars(sListData,scTab,cscSpace)
let iCurIndex = stringSegmentIndex(sListData,list_item_separator,cXLActiveCell.address)
if !iCurIndex then
	let iCurIndex = stringSegmentIndex(sListData,list_item_separator,GetAddressOfNextOrPriorCellType(oXLActiveCell,oComments,iCount))
endIf
let iChoice = DlgSelectItemInList (sListData, msgCellsWithNotes, false,iCurIndex)
if !iChoice then
	return
endIf
let sChosenAddress = GetChosenAddressFromList(sListData,iChoice)
oXLActiveSheet.range(sChosenAddress).activate
EndFunction

void  function ListVisibleCellsWithData()
var
	object oVisibleCells,
	string sListData,
	int iCount,
	int iCurIndex,
	int iChoice,
	string sChosenAddress
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
let oVisibleCells = oExcel.activeWindow.visibleRange.cells
let iCount = oVisibleCells.count
if !iCount then
	return
endIf
let sListData = GetObjectDataFromList(oVisibleCells,iCount,VisibleCelltype)
if !sListData then
	SayMessage (OT_error, msg73_L) ; no cells with data visible in active window
	return
endIf
let iCurIndex = stringSegmentIndex(sListData,list_item_separator,cXLActiveCell.address)
if !iCurIndex then
	let iCurIndex = stringSegmentIndex(sListData,list_item_separator,GetAddressOfNextOrPriorCellType(oXLActiveCell,oVisibleCells,iCount))
endIf
let iChoice = DlgSelectItemInList(sListData, msg74_L, false,iCurIndex)
if !iChoice then
	return
endIf
let sChosenAddress = GetChosenAddressFromList(sListData,iChoice)
oXLActiveSheet.range(sChosenAddress).activate
EndFunction

void function ListHyperlinks()
var
	object oLinks,
	int iCount,
	string sListData,
	int iCurIndex,
	int iButtonId,
	int nLinkSelected,
	string sAddress,
	string sSubAddress
if InHJDialog() then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
let oLinks = oXLActiveSheet.hyperlinks
let iCount = oLinks.count
if !iCount then
	SayMessage (OT_error, msgNoLinks_l,msgNoLinks_s)
	return
endIf
let sListData = GetObjectDataFromList(oLinks,iCount,HyperlinkType)
let iCurIndex = stringSegmentIndex(sListData,list_item_separator,cXLActiveCell.address)
if !iCurIndex then
	let iCurIndex = stringSegmentIndex(sListData,list_item_separator,GetAddressOfNextOrPriorCellType(oXLActiveCell,oLinks,iCount))
endIf
let iButtonId = DlgSelectControls(sListData,nLinkSelected,msgSelectLinks, bt_leftSingleClick|bt_moveTo, bt_leftSingleClick,iCurIndex)
if nLinkSelected > 0 then
	let sAddress = oXLActiveSheet.hyperlinks(nLinkSelected).address
	let sSubAddress = oXLActiveSheet.hyperlinks(nLinkSelected).SubAddress
	if iButtonId == id_leftSingleClick then
		SayMessage (OT_help, msgLinkSelected,msgLinkSelected)
		oXLActiveSheet.hyperlinks(nLinkSelected).follow(true)
	elif iButtonId == id_moveTo then
		oXLActiveSheet.hyperlinks(nLinkSelected).range.select
	endIf
endIf
EndFunction

void function ListWorksheetObjects()
var
	object oShapes,
	int iCount,
	string sListData,
	string sIndexList,
	int iChoice,
	int iCurIndex,
	int iSelectedIndex,
	object oSelectedShape,
	string sText
if InHJDialog() then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
let oShapes = oXLActiveSheet.shapes
let iCount = oShapes.count
if iCount - oXLActiveSheet.comments.count == 0 then
	SayMessage (OT_error, msg84_L,msg84_S) ; "Worksheet contains no shapes."
	return
endIf
let sListData = GetObjectDataFromList(oShapes,iCount,ShapeType,NoIndexType,sIndexList)
if !sListData then
	SayMessage (OT_error, msg84_L,msg84_S) ; "Worksheet contains no shapes."
	return
endIf
let iCurIndex = stringSegmentIndex(sListData,list_item_separator,cXLActiveCell.address)
if !iCurIndex then
	let iCurIndex = stringSegmentIndex(sListData,list_item_separator,GetAddressOfNextOrPriorCellType(oXLActiveCell,oShapes, iCount))
endIf
let iChoice = DlgSelectItemInList(sListData, msg82_L,false,iCurIndex)
if !iChoice then
	return
endIf
let iSelectedIndex = stringToInt(stringSegment(sIndexList, list_item_separator, iChoice))
let oSelectedShape = oShapes(iSelectedIndex)
BeginFlashMessage(5)
SayMessage(ot_smart_help,getShapeObjectDescription(oSelectedShape))
oSelectedShape.select
if oSelectedShape.type==msoTextBox then
	let sText = oSelectedShape.textFrame2.textRange.text
	sayFormattedMessage(ot_user_buffer,FormatString(msgSelectedTextboxContent,intToString(iSelectedIndex),sText))
	sayMessage(ot_user_buffer,cscBufferNewLine+msgSelectedTextboxBuffExit)
	EndFlashMessage()
	return
endIf
if isChartActive() then
	ReadActiveChart()
endIf
if oSelectedShape.onAction then
	oExcel.run(oSelectedShape.onAction)
endIf
EndFlashMessage()
EndFunction

void function ListCellsWithFormulas()
var
	object oUsedRange,
	object oCells,
	string sListData,
	int iCount,
	int MaxCellsLimit,
	int iCurIndex,
	int iChoice,
	int nCellsWithFormulas,
	string sChosenAddress,
	Int iMaxColumn = 30,
	Int iMaxRow = 30,
	Int iStartColumn = 1,
	Int iEndColumn = iMaxColumn,
	Int iStartRow = 1,
	Int iEndRow = iMaxRow,
	Object oCell,
	Int iCellColumn,
	Int iCellRow,
	Object oStart,
	Object oEnd

if InHJDialog() then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
oCell = oExcel.activeCell
iCellColumn = oCell.column
iCellRow = oCell.row
If iCellColumn > iEndColumn
	iEndColumn = iCellColumn
	iStartColumn = iEndColumn - iMaxColumn
EndIf
If iCellRow > iEndRow
	iEndRow = iCellRow
	iStartRow = iEndRow - iMaxRow
EndIf
oStart = oXLActiveSheet.cells(iStartColumn, iStartRow)
let oEnd = oXLActiveSheet.cells(iEndColumn, iEndRow)
oCells = oXLActiveSheet.range (oStart, oEnd)
let iCount = oCells.count
if !iCount then
	return
endIf
let MaxCellsLimit = 1000
if iCount > maxCellsLimit then
	;impose a max limit to avoid crashing or extreme sluggishness
	let iCount = MaxCellsLimit
endIf
let sListData = GetObjectDataFromList(oCells,iCount,CellsWithFormulaType)
if !sListData then
	SayMessage (OT_error, msgNoFormulas)
	return
endIf
if iCount == MaxCellsLimit then
	let nCellsWithFormulas = StringSegmentCount(sListData,list_Item_separator)
	sayFormattedMessage(ot_help,
		formatString(msgPleaseWaitForListOfFormulas_l,intToString(nCellsWithFormulas)),
		FormatString(msgPleaseWaitForListOfFormulas_s,intToString(nCellsWithFormulas)))
endIf
let sListData = StringReplaceChars(sListData,vbcr+scLineFeed,cscSpace)
let sListData = StringReplaceChars(sListData,scTab,cscSpace)
let iCurIndex = stringSegmentIndex(sListData,list_item_separator,cXLActiveCell.address)
if !iCurIndex then
	let iCurIndex = stringSegmentIndex(sListData,list_item_separator,GetAddressOfNextOrPriorCellType(oXLActiveCell,oCells(1).formula,iCount))
endIf
let iChoice = DlgSelectItemInList (sListData, msgCellsWithFormulas, false,iCurIndex)
if !iChoice then
	return
endIf
let sChosenAddress = GetChosenAddressFromList(sListData,iChoice)
oExcel.activeSheet.range(sChosenAddress).activate
EndFunction

void function ListCellsAtPageBreaks()
var
	object oHPagebreaks,
	object oVPagebreaks,
	int hCount,
	int vCount,
	string sHListData,
	string sVListData,
	string sListData,
	int iCurIndex,
	int iChoice,
	string sChosenAddress
if InHJDialog() then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
let oHPagebreaks = oXLActiveSheet.hPageBreaks
let hCount = oHPagebreaks.count
let oVPagebreaks = oXLActiveSheet.vPageBreaks
let vCount = oVPagebreaks.count
if hCount+vCount==0 then
	SayMessage (OT_error, msgNoHorizontalOrVerticalPagebreaks)
	return
endIf
if hCount > 0 then
	let sHListData = GetObjectDataFromList(oHPagebreaks,hCount,CellsAtHPagebreakType)
endIf
if vCount > 0 then
	let sVListData = GetObjectDataFromList(oVPagebreaks,vCount,CellsAtVPagebreakType)
endIf
if !sHListData
&& !sVListData then
	return
elif sHListData
&& sVListData then
	let sListData = sHListData+list_item_separator+sVListData
elif sHListData then
	let sListData = sHListData
else
	let sListData = sVListData
endIf
let iCurIndex = (stringSegmentIndex(sListData,list_item_separator+cScColon,cXLActiveCell.address)+1)/2
if !iCurIndex then
	if hCount then
		let iCurIndex = stringSegmentIndex(sListData,list_item_separator,
			GetAddressOfNextOrPriorCellType(oXLActiveCell,oHPageBreaks,hCount))
	else
		let iCurIndex=stringSegmentIndex(sListData,list_item_separator,
			GetAddressOfNextOrPriorCellType(oXLActiveCell,oVPagebreaks,vCount))
	EndIf
endIf
let iChoice = DlgSelectItemInList (sListData, msg80_L, false,iCurIndex)
if !iChoice then
	return
endIf
let sChosenAddress = GetChosenAddressFromList(sListData,iChoice)
oExcel.activeSheet.range(sChosenAddress).activate
EndFunction

void function ListWorksheets()
var
	object oSheets,
	int iCount,
	string sListData,
	String sSheet,
	int iChoice
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
let oSheets = oXLActiveWorkbook.worksheets
let iCount = oSheets.count
if !iCount then
	SayMessage(ot_error,msgNoWorksheets)
	return
endIf
let sListData = GetObjectDataFromList(oSheets,iCount,WorksheetType)
let sSheet = GetActiveSheetName ()
let iChoice = DlgSelectItemInList (sListData, msgMoveToWorksheet, false, StringSegmentIndex (sListData, LIST_ITEM_SEPARATOR, sSheet, FALSE))
if !iChoice then
	return
EndIf
if oSheets(iChoice).visible != VBTrue then
	SayFormattedMessage(OT_ERROR,FormatString(msgHiddenSheet,oSheets(iChoice).name))
else
	oSheets(iChoice).select
EndIf
EndFunction

void function ListSmartTags()
; object Data will not be obtained if an object is assigned to oExcel.activeSheet.smartTags,
; so the helper function cannot be used to build the list of smart tags.
var
	int iCount,
	int i,
	string sItem,
	string sText,
	string sAddress,
	string sListData,
	int iChoice,
	string sChosenAddress
if InHJDialog() then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
let iCount = oxlActiveSheet.smartTags.Count
if !iCount then
	SayFormattedMessageWithVoice(vctx_message,ot_JAWS_message,msgNoSmartTags_L,msgNoSmartTags_S)
	return
EndIf
for i = 1 to iCount
	let sText = smmStripMarkup(oXLActiveSheet.smartTags(i).xml)
	let sAddress = oXLActiveSheet.smartTags(i).range.addressLocal(false,false)
	let sItem = sAddress+cscColon+cscSpace+sText
	let sListData = sListData+list_Item_separator+sItem
endFor
if sListData then
	; remove leading delimiter to avoid empty item
	let sListData = stringChopLeft(sListData,1)
EndIf
if !sListData then
	SayMessage(ot_error,msgNoClickableSmartTags_L,msgNoClickableSmartTags_S)
	return
EndIf
let iChoice = DlgSelectItemInList(sListData,sSmartTagListTitle,false)
if !iChoice then
	return
EndIf
let sChosenAddress = StringSegment(StringSegment(sListData,list_item_separator,iChoice),cscColon,1)
oExcel.activeSheet.range(sChosenAddress).activate
oExcel.selection.collapse
if GbSaySmartTagActionsTutorHelpFirstTime then
	let GbSaySmartTagActionsTutorHelpFirstTime = false
	SayFormattedMessage(ot_smart_help, msgSmartTagActionsTutorHelp1_L, msgSmartTagActionsTutorHelp1_S)
EndIf
EndFunction

void Function ShowTextBoxContent()
Var
	object oShapes,
	int iCount,
	int nTextboxes,
	int i,
	int n,
	string sText
if InHJDialog()
|| !worksheetHasFocus()
	sayMessage(ot_error,msgNotInWorksheetArea_l,msgNotInWorksheetArea_s)
	return
endIf
let oShapes = oXLActiveSheet.shapes
let iCount = oShapes.count
if iCount - oXLActiveSheet.comments.count==0 then
	SayMessage (OT_error, msg84_L,msg84_S) ; "Worksheet contains no shapes."
	return
endIf
for i = 1 to iCount
	if oShapes(i).type == msoTextbox then
		let nTextBoxes = nTextboxes+1
		let n = i
	endIf
EndFor
if !nTextboxes then
	SayMessage(ot_error,msgNoTextboxes_l,msgNoTextboxes_s)
	return
elif nTextBoxes == 1 then
	let sText = oShapes(n).textFrame2.textRange.text
	sayFormattedMessage(ot_user_buffer,
		FormatString(msgTextboxContent,sText)
		+cscBufferNewLine+cscBufferNewLine+msgTextboxBuffExit)
else
	sayMessage(ot_smart_help,formatString(msgTextboxNum,intToString(nTextboxes)))
	;performScript SelectWorksheetObjects() ; in some instances causes unknown function calls:
	SayMessage (OT_smart_help, msg83_L, msg83_S) ; please wait, collecting shapes
	ListWorksheetObjects()
endIf
EndFunction

void function returnFromMonitorCell()
var
	string sAddress,
	collection c
let c = new collection
let c = cXLStoredCellAddresses.sheets
let sAddress = c[cXLActiveSheet.name]
if sAddress then
	oExcel.activeSheet.range(sAddress).select
endIf
endFunction

void function ListMonitorCells()
var
	string sMonitorCellList,
	int iCount,
	int i,
	string sAddress,
	string sText,
	string sListData,
	int iChoice,
	int iButton,
	collection c
if InHJDialog() then
	SayFormattedMessage(OT_error, cMSG337_L, cMSG337_S)
	return
endIf
let sMonitorCellList = getListOfMonitorCells()
if !sMonitorCellList then
	SayMessage(ot_error,
		FormatString(msgNoMonitorCellsDefined1_L,cXLActiveSheet.name),
		msgNoMonitorCellsDefined1_S)
	return
endIf
let iCount = StringSegmentCount(sMonitorCellList,list_item_separator)
for i = 1 to iCount
	let sAddress = stringSegment(sMonitorCellList,list_item_separator,i)
	let sText = oXLActiveSheet.range(sAddress).text
	let sListData = sListData+list_item_separator+
		formatString(msgListItem2, sAddress, sText)
endFor
let sListData = stringChopLeft(sListData,1)
let iButton = DlgSelectControls (sListData, iChoice, msgMoveToMonitorCell1_L, bt_MoveTo, bt_MoveTo)
if iButton == idCancel then
	return
EndIf
if !iChoice then
	return
EndIf
let sAddress = GetChosenAddressFromList(sListData,iChoice)
; store last non-monitor cell
let c = new collection
let c = cXLStoredCellAddresses.sheets
let c[cXLActiveSheet.name] = cXLActiveCell.address
oXLActiveSheet.range(sAddress).select
EndFunction

void Function ListCellMarkers()
var
	string sListData,
	int iChoice,
	int iCurIndex,
	string sChoice,
	string sChosenAddress,
	string sSheet,
	int iSheetNum
if InHJDialog() then
	SayFormattedMessage(OT_error, cMSG337_L, cMSG337_S)
	return
endIf
let sListData = getListOfCellMarkers()
if !sListData then
	SayMessage(OT_error,msgNoCellMarkersDefined_l,msgNoCellMarkersDefined_s)
	return
endIf
let sListData = StringReplaceChars(sListData,vbcr+scLineFeed,cscSpace)
let sListData = StringReplaceChars(sListData,scTab,cscSpace)
let iCurIndex = stringSegmentIndex(sListData,list_item_separator,cXLActiveSheet.name)
if !iCurIndex then
	let iCurIndex=1
endIf
let iChoice = DlgSelectItemInList (sListData, msgCellMarkers, false,iCurIndex)
if !iChoice then
	return
endIf
let sChoice = stringSegment(sListData,list_item_separator,iChoice)
let sSheet = stringLeft(sChoice,stringContains(sChoice,cscSpace)-1)
let iSheetNum = GetSheetNumber(sSheet)
let sChosenAddress = stringSegment(sChoice,cscSpace,-1)
oXLActiveWorkbook.worksheets(iSheetNum).select
oXLActiveSheet.range(sChosenAddress).activate
EndFunction

String Function GetNameOfSheetWithNextOrPriorCellMarker(int iDirection)
Var
	object oSheets,
	int iSheetCount,
	string sName,
	int i
if !GetNumberOfCellMarkers() then
	return cscNull
endIf
let oSheets = oXLActiveWorkbook.sheets
if iDirection == UnitMove_Next then
	let iSheetCount = oSheets.count
	let i = cXLActiveSheet.index+1
	while i <= iSheetCount
		let sName = oSheets(i).name
		if getCellMarker(sName) then
			return sName
		EndIf
		let i = i+1
	EndWhile
elif iDirection == UnitMove_Prior then
	let i = cXLActiveSheet.index-1
	while i > 0
		let sName = oSheets(i).name
		if getCellMarker(sName) then
			return sName
		EndIf
		let i = i-1
	EndWhile
EndIf
return cscNull
EndFunction

int function MoveToCellMarker(int Movement)
var
	string sSheetName,
	string sCellAddress
if movement == UnitMove_Current then
	let sCellAddress = getCellMarker(cXLActiveSheet.name)
	if !sCellAddress then
		return false
	EndIf
	oXLActiveSheet.range(sCellAddress).select
	return true
EndIf
let sSheetName = GetNameOfSheetWithNextOrPriorCellMarker(movement)
if !sSheetName then
	return false
EndIf
let sCellAddress = getCellMarker(sSheetName)
oXLActiveWorkbook.worksheets(sSheetName).activate
oExcel.range(sCellAddress).select
return true
EndFunction

void function MoveToCellMarkerOnCurrentSheet()
if !MoveToCellMarker(UnitMove_Current) then
	sayMessage(ot_error,msgCellMarkerNotFound_l,msgCellMarkerNotFound_s)
EndIf
EndFunction

void function MoveToCellMarkerOnNextSheet()
if !MoveToCellMarker(UnitMove_Next) then
	SayMessage(ot_error,msgNoMoreCellMarkersDefined_l,msgNoMoreCellMarkersDefined_s)
EndIf
EndFunction

void function MoveToCellMarkerOnPriorSheet()
if !MoveToCellMarker(UnitMove_Prior) then
	SayMessage(ot_error,msgNoPriorCellMarkersDefined_l,msgNoPriorCellMarkersDefined_s)
EndIf
EndFunction

Void Function MoveToCell(string sAddress, string sSheet)
If UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
if stringContains(sAddress,cscColon) then ; we have a cell range.
	; only want to move to the first cell in the range.
	; so we obtain the first segment of the address.
	let sAddress=StringSegment(sAddress,cscColon,1)
EndIf
oXLActiveWorkbook.worksheets(sSheet).activate
oExcel.range(sAddress).select
EndFunction

string Function GetDefaultCustomSummaryLabel()
var
	string sText,
	string sText1,
	string sText2
if cXLSelection.cellCount ==1 then
	let sText = cXLSelection.FirstCell.text
	if !sText then
		let sText = msgDash
	endIf
Else
	let sText1 = cXLSelection.FirstCell.text
	if !sText1 then
		let sText1 = msgDash
	endIf
	let sText2 = cXLSelection.lastCell.text
	if !sText2 then
		let sText2 = msgDash
	endIf
	let sText = sText1+cs_elipsis+sText2
EndIf
return sText
EndFunction

void Function GetAllCustomLabelsInWorkbook(collection ByRef cCustomLabels)
Var
	stringArray Sheets,
	int iSheetCount,
	string sName,
	collection c,
	string item,
	int i
CollectionRemoveAll(cCustomLabels)
let Sheets = oXLActiveWorkbook.sheets
let iSheetCount = Sheets.count
let Sheets = new stringArray[iSheetCount]
GetArrayOfSheetNames(Sheets,iSheetCount)
for i = 1 to iSheetcount
	let sName = Sheets[i]
	if HasCustomLabels(sName) then
		let c = new collection
		GetCustomLabelCollection(sName,c)
		let cCustomLabels[sName] = c
	EndIf
EndFor
EndFunction

void function AddCustomSummaryInfoToUserBuffer(int IType, string sText,
	optional string sFunctionCall, optional string sFunctionDisplay)
if iType == CustomSummaryWorkbookNameType
|| iType == CustomSummarySheetNameType then
	UserBufferAddText(sText+cscBufferNewLine,cscNull,cscNull,cFont_aerial,12,attrib_bold,
		rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White),true)
elif iType == CustomSummaryLabelNameType then
	UserBufferAddText(sText,cscNull,cscNull,cFont_aerial,12,attrib_bold,
		rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White),false)
elif iType == CustomSummaryTextType then
	UserBufferAddText(cscSpace+sText,cscNull,cscNull,cFont_aerial,12,attrib_text,
		rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White),true)
elif iType == CustomSummaryAddressType then
	UserBufferAddText(sText+cscBufferNewLine,sFunctionCall,sFunctionDisplay,
		cFont_aerial	,12,attrib_underline,
		rgbStringToColor(cColor_blue),rgbStringToColor(cColor_White),
		true,wt_link)
EndIf
EndFunction

void Function ViewCustomSummary()
Var
	collection cCustomLabels,
	collection c,
	string sSheet,
	string sLabel
If IsChartActive()
&& UserBufferIsActive() then
	SayMessage(ot_error,msgCustomSummaryNotAvailable_l,msgCustomSummaryNotavailable_s)
	Return
EndIf
let cCustomLabels = new collection
GetAllCustomLabelsInWorkbook(cCustomLabels)
if !cCustomLabels
;or there is more than just an empty collection:
|| ! collectionItemsCount (cCustomLabels) then
	SayFormattedMessageWithVoice(vctx_message,ot_error,
		FormatString(msgNoSummary_l,cXLActiveSheet.name,cXLActiveWorkbook.name),
		FormatString(msgNOSummary_s,cXLActiveSheet.name,cXLActiveWorkbook.name))
	return
EndIf
If UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
SetJCFOption(OPT_VIRT_VIEWER,1)
AddCustomSummaryInfoToUserBuffer(CustomSummaryWorkbookNameType,
	FormatString(msgCustomSummaryTitle,cXLActiveWorkbook.name))
let c = new collection
ForEach sSheet in cCustomLabels
	AddCustomSummaryInfoToUserBuffer(CustomSummarySheetNameType,
		FormatString(msgCustomSummary,sSheet))
	let c = cCustomLabels[sSheet]
	var string orderedKeys = c["_orderedKeys"]
	var string sep = stringLeft(orderedKeys, 1)
	orderedKeys = stringChopLeft(orderedKeys, 1)
	var int nLabels = stringSegmentCount(orderedKeys, sep)
	var int idx
	for idx = 1 to nLabels
		sLabel = stringSegment(orderedKeys, sep, idx)
		AddCustomSummaryInfoToUserBuffer(CustomSummaryLabelNameType,
			c[sLabel])
		AddCustomSummaryInfoToUserBuffer(CustomSummaryTextType,
			GetContentOfCells(sLabel,sSheet))
		AddCustomSummaryInfoToUserBuffer(CustomSummaryAddressType,sLabel,
			FormatString(fn_MoveToCell,sLabel,sSheet),
			FormatString(msgCustomLabel,c.sLabel,sSheet,sLabel))
	EndFor
EndForEach
UserBufferAddText(msgCustomSummaryBuffExit)
UserBufferActivateEx(vwn_CustomSummary,cscNull,0,0)
JAWSTopOfFile()
SayLine()
SetJCFOption(OPT_VIRT_VIEWER,0)
EndFunction

void function CustomSummary (string sApp);default override
;just call local version:
pause()
return ViewCustomSummary()
endFunction

int function IsCustomSummaryActive()
return UserBufferIsActive()
	&& UserBufferWindowName() == vwn_CustomSummary
EndFunction

Void Function ScreenSensitiveHelpCustomSummary(string sWindow,int iType)
Var
	string sMsg
If iType == wt_listBox then
	let sMsg = msgScreenSensitiveHelpCustomSummaryListBox
ElIf iType == wt_button then
	If sWindow == wn_Add then
		let sMsg = msgScreenSensitiveHelpCustomSummaryAddButton
	ElIf sWindow == wn_Change then
		let sMsg = msgScreenSensitiveHelpCustomSummaryChangeButton
	ElIf StringContains(sWindow,wn_RemoveAll) then
		let sMsg = msgScreenSensitiveHelpCustomSummaryRemoveAllButton
	ElIf sWindow == wn_Remove then
		let sMsg = msgScreenSensitiveHelpCustomSummaryRemoveButton
	ElIf sWindow == wn_OK then
		let sMsg = msgScreenSensitiveHelpCustomSummaryOKButton
	elIf sWindow == wn_Cancel then
		let sMsg = msgScreenSensitiveHelpCustomSummaryCancelButton
	ElIf sWindow == wn_MoveUP then
		let sMsg = msgScreenSensitiveHelpCustomSummaryMoveUPButton
	ElIf sWindow == wn_MoveDown then
		let sMsg = msgScreenSensitiveHelpCustomSummaryMoveDownButton
	EndIf
EndIf
SayMessage(ot_user_buffer,sMsg)
UserBufferAddText(cscBufferNewLine)
sayMessage(ot_user_buffer,cmsgBuffExit)
EndFunction

void function ExcelScreenSensitiveHelp ()
var
	string sWindowView,
	string sPagebreakType,
	int iShapeCount,
	int iCommentCount,
	int iLinkCount,
	int iSheetCount,
	string msgScreenSensitiveHelpInputMessage,
	string sJSIName
SetJcfOption(opt_virt_viewer,1)
if isChartActive()
&& userBufferIsActive() then
	SayFormattedMessage (OT_USER_BUFFER, msgScrnSensitiveHlp2_L, msgScrnSensitiveHlp2_S)
	SetJcfOption(opt_virt_viewer,0)
	return
elif oExcel.activeCell
|| oExcel.activeSheet then
	SayFormattedMessage(OT_USER_BUFFER,
		formatString(msgScrnSensitiveHlp3_L, cXLActiveSheet.name,IntToString(cXLActiveSheet.index)),
		formatString(msgScrnSensitiveHlp3_S, cXLActiveSheet.name,IntToString(cXLActiveSheet.index)))
	If HasCustomLabels(cXLActiveSheet.name) then
		SayFormattedMessage(ot_user_buffer,
			FormatString(msgScrnSensitiveHlp3a_l,GetScriptKeyName(csnRunJAWSManagerScript)),
			FormatString(msgScrnSensitiveHlp3a_s,GetScriptKeyName(csnRunJAWSManagerScript)))
	EndIf
	let sWindowView=GetWorksheetWindowView()
	if sWindowView then
		SayFormattedMessage(ot_user_buffer,FormatString(msgFreezePanesOrSplitWindowView,sWindowView))
	endIf
	SayFilterModeStatus()
	if cXLActiveSheet.autoFilterMode then
		SayFilterScreenSensitiveHelp()
	endIf
	sayMessage(ot_user_buffer,msgPrintPageInfo+cscBufferNewLine+GetPrintPageInfoForActiveSheet())
	let sPagebreakType = GetPagebreakAtActiveCell()
	if sPagebreakType then
		sayMessage(ot_user_buffer,sPagebreakType)
	endIf
	sayMessage(ot_user_buffer,msgHeadersAndFooters+cscBufferNewLine+GetHeaderFooterInfoForActiveSheet())
	sayCurrentRegion(OT_USER_BUFFER)
	sayVisibleRangeCoordinates()
	let iCommentCount = oXLActiveSheet.comments.count + oXLActiveSheet.CommentsThreaded.count
	let iShapeCount = oXLActiveSheet.shapes.count - iCommentCount
	if iShapeCount > 0 then
		SayFormattedMessage (OT_USER_BUFFER,
			formatString(msgScrnSensitiveHlp4_L, intToString(iShapeCount)),
			formatString(msgScrnSensitiveHlp4_S, intToString(iShapeCount)))
	endIf
	if iCommentCount > 0 then
		SayFormattedMessage (OT_USER_BUFFER,
			formatString(msgScrnSensitiveHlp4a_O365_L, intToString(iCommentCount)),
			formatString(msgScrnSensitiveHlp4a_O365_S, intToString(iCommentCount)))
	endIf
	let iLinkCount = oXLActiveSheet.hyperlinks.count
	if iLinkCount > 0 then
		SayFormattedMessage (OT_USER_BUFFER,
			formatString(msgScrnSensitiveHlp5_L, intToString(iLinkCount)),
			formatString(msgScrnSensitiveHlp5_S, intToString(iLinkCount)))
	endIf
	let iSheetCount = oXLActiveWorkbook.workSheets.count
	if iSheetCount> 1 then
		SayFormattedMessage (OT_USER_BUFFER,
			formatString(msgScrnSensitiveHlp6_L, intToString(iSheetCount), cXLActiveWorkbook.name),
			formatString(msgScrnSensitiveHlp6_S, intToString(iSheetCount), cXLActiveWorkbook.name))
	endIf
endIf ; Main Grid
reportGridlineStatus()
UpdateCXLActiveCellBorders(true)
DescribeActiveCellBorders()
If ActiveCellHasValidationInputMessage() then
	let msgScreenSensitiveHelpInputMessage = GetScreenSensitiveHelpInputMessage()
	SayFormattedMessage(ot_user_buffer,msgScreenSensitiveHelpInputMessage)
EndIf
let sJSIName = getWorkbookJSIName()
if (fileExists (FindJAWSPersonalizedSettingsFile (sJSIName, TRUE)))
	SayFormattedMessage(ot_user_buffer,FormatString(msgActiveJsiFileName_l,sJsiName),FormatString(msgActiveJsiFileName_s,sJsiName))
else
	SayFormattedMessage(ot_user_buffer, msgNoWorkbookSettings)
endIf
AddHotKeyLinks()
SetJcfOption(opt_virt_viewer,0)
EndFunction

int function GetCellCoordinates(int byRef col,int byRef row)
;the builtin function is inaccurate on the spreadsheet
if GetWindowCategory () == WCAT_SPREADSHEET then
	let col = cXLActiveCell.column
	let row = cXLActiveCell.row
	return CollectionItemExists(cXLActiveCell,"column")
		&& CollectionItemExists(cXLActiveCell,"row")
else
	return GetCellCoordinates(col,row)
EndIf
EndFunction

int function inTextBox()
return GetCurrentExcelSheetItemType() == ExcelItemTypeTextBox
EndFunction

string function formatStringForMarkup(string sTemplate, string sText)
return formatString(sTemplate, smmReplaceSymbolsWithMarkup(sText))
endFunction

string function getStatusBarTextFromAllButtons ()
var
	int i, string text, string tmp,
	object buttons = findStatusBarButtons ()
if ! buttons || ! buttons.count then return cscNull endIf
for i = 0 to buttons.count-1
	tmp = buttons(i).name
	if ! stringIsBlank (tmp) then
		if ! stringIsBlank (text) text = text+cscBufferNewLine endIf
		text = formatString ("%1%2", text, tmp)
	endIf
endFor
return text
endFunction

string function GetStatusBarText(optional int IncludeAllButtons)
if IncludeAllButtons then return getStatusBarTextFromAllButtons () endIf
var object element = FindStatusBarModeElement()
return element.name
EndFunction

void function UpdateStatusBarMode(optional String sStatusBarText)
if !sStatusBarText 
	sStatusBarText = GetStatusBarText()
endIf
if !sStatusBarText then
	Excel_StatusBar_Mode = Excel_status_unknown
;test for status bar contains StatusBar_Point_Extend_Selection must preceed test for status bar contains StatusBar2007_ext:
elif StringContains(sStatusBarText,StatusBar_Point)
|| StringContains(sStatusBarText,StatusBar_Point_Extend_Selection)
	Excel_StatusBar_Mode = Excel_status_point
elif StringContains(sStatusBarText,StatusBar2007_ext)
	Excel_StatusBar_Mode = Excel_Status_ExtendedSelection
elif StringContains(sStatusBarText,StatusBar2007_add)
|| StringContains (sStatusBarText, StatusBar_AddOrRemoveSelection)
	Excel_StatusBar_Mode = Excel_status_AddSelectedRange
;test for status ready must come after other tests
;where the status bar may contain both ready and the other status.
elif StringContains(sStatusBarText,StatusBar_Ready) then
	Excel_StatusBar_Mode = Excel_status_ready
elif StringContains(sStatusBarText,StatusBar_Edit) then
	Excel_StatusBar_Mode = Excel_status_edit
elif StringContains(sStatusBarText,StatusBar_Enter) then
	Excel_StatusBar_Mode = Excel_status_enter
elif StringContains(sStatusBarText,StatusBar_comment)
;check caret visibility because that status will pop up if the mouse moves over the cell,
;causing JAWS to inaccurately read via line with sayLine.
;Comment is useful when you are in fact editing a comment:
&& caretVisible () then
	Excel_StatusBar_Mode = Excel_status_comment
EndIf
EndFunction

int function StatusBarMode()
return Excel_StatusBar_Mode
EndFunction

script SayBottomLineOfWindow()
var int IncludeAllButtons = TRUE
var string sText = GetStatusBarText(IncludeAllButtons)
if !stringIsBlank (sText) then
	SayMessage (OT_USER_REQUESTED_INFORMATION, sText)
	Return
endIf
PerformScript SayBottomLineOfWindow()
endScript

int function GetCellSpan (int byRef Rows, int byRef Columns)
If GetWindowCategory (GetFocus()) != WCAT_SPREADSHEET
	return GetCellSpan (Rows,Columns)
endIf
if !oXLActiveCell
	rows = 0
	columns = 0
	return false
endIf
rows = oXLActiveCell.MergeArea.rows.count
columns = oXLActiveCell.MergeArea.columns.count
return true
EndFunction

int Function EditCommentUsingJAWSDialog ()
if !worksheetHasFocus() return FALSE endIf
; The object model still uses the comment data member, Excel just calls it a note now.
; The only change is the string for the dialog box itself to say Note instead of Comment.
var
	int bAddedComment,
	object cell,
	object comment,
	string title,
	string text;
cell = oExcel.activeCell
if !cell then return endIf
comment = cell.comment
if !comment then
	bAddedComment = TRUE
	cell.AddComment
endIf
comment = cell.comment
text = Comment.text
if text then
; replace NewLines with the CR/LF character for the dialog:
	text = StringReplaceSubstrings (text, "\n", "\r\n")
endIf
globalInEditCommentJAWSDialog = ON
if !InputBox (EditNoteDlgTextPrompt, EditNoteDlgTitle, text) then
	if bAddedComment then
		cell.Comment.Delete()
	endIf
	globalInEditCommentJAWSDialog = OFF
	return TRUE ; prevent the keystroke from being passed through.
endIf
globalInEditCommentJAWSDialog = OFF
delay (2, TRUE) ; time for the spreadsheet to regain focus
if text then
; Put the lf characters back as they were before the dialog:
	text = StringReplaceSubstrings (text, "\r\n", "\n")
endIf
Comment.text(text)
return TRUE
endFunction

int Function SelectFromSavedLocationToCurrent ()
var string PlaceMarkerCellAddress = GetActiveCellMarker ()
if ! worksheetHasFocus() return SelectFromSavedLocationToCurrent () endIf
if stringIsBlank (PlaceMarkerCellAddress)
|| ! isCellAddress (PlaceMarkerCellAddress) then
; No location set or global data got corrupted
	return FALSE
endIf
var
	object range,
	string CurrentPlace = GetActiveCellAddress (),
	string rangeText = "%1:%2"
rangeText = formatString (rangeText, PlaceMarkerCellAddress, CurrentPlace)
Range = oXLActiveSheet.range(rangeText)
if range then
	range.select
	return TRUE
else
	return FALSE
endIf
endFunction

script SelectTextBetweenMarkedPlaceAndCurrentPosition()
var
	int bFormsModeActive,
	int bSuccess
if !IsVirtualPCCursor()
&& worksheetHasFocus() then
	if !SelectFromSavedLocationToCurrent () then
		sayFormattedMessage(OT_ERROR, msgSelectFromSavedLocationError_l, msgSelectFromSavedLocationError_s)
	endIf
	return
endIf
PerformScript SelectTextBetweenMarkedPlaceAndCurrentPosition()
endScript

string function GetSheetID()
var int i
;Often the sheet element is at level 2,
;but if cells are in a table it will be at level 3.
for i = 2 to 3
	if GetObjectSubtypeCode(SOURCE_CACHED_DATA,i) == WT_DIALOG_PAGE
		return GetObjectAutomationID(i)
	endIf
endFor
return cscNull
EndFunction

; Copyright 1995-2018 Freedom Scientific, Inc.
; JAWS script file for Microsoft Powerpoint O365

; This script file contains Object Model Interface code and helper functions
; note: Both Shape and
;Slide are collection objects.  Slide has a collection of shapes, Shape has a collection of elements (paragraphs, bullets, etc.)

include "hjglobal.jsh"
Include "hjconst.jsh" ; constants for attributes, window class
include "powerpntCommon.jsh"
include "ppfuncCommon.jsh"
include "PowerPntCommon.jsm"
include "common.jsm"

Globals
	int g_smartNavMax, ; private::SmartNav where level = max option from file
	int gbMagicExists,
	int giObjectOnly,
	int giSlideAreaActive,
	int giUserBufferWaitingForText,
	int giBrlShowCoords

string function getPptBuild ()
return oPPt.build
endFunction

void Function AutoStartEvent ()
; hardcode set Smart Nav to OFF to cause slides to read properly:
setJCFOption (optSmartNavigation, 0)
g_smartNavMax = 0
let gbMagicExists = getRunningFSProducts () & product_MAGic
endFunction

void Function PPT_WindowSelectionChange(object Sel)
;sayString ("Event: WindowSelectionChange")
endFunction

void Function PPT_SlideShowBegin(object Wn)
;sayString ("Event: SlideShowBegin")
ReadSlideShowSlide (FALSE, FALSE)
endFunction

void Function PPT_SlideShowNextSlide(object Wn)
;sayString ("event: SlideShowNextSlide")
ReadSlideShowSlide (FALSE, FALSE)
endFunction

void function PPT_SlideShowEnd(object Pres)
;sayString ("Event: SlideShowEnd")
ReadSlideShowSlide (FALSE, FALSE)
endFunction

void Function AutofinishEvent ()
if ! giSlideShowActive then ; Office 20136 and 2016 Object model reinitialize failures when alt tabbing back to PowerPoint slide show in progress:
	let oPpt = null()
endIf
let goFocusShape = null()
let goFocusSlide = null()
endFunction

int function getFontObjAttributes (object oFont)
var
	int iAttributes
let iAttributes = 0
;we only support bold, italic, underline and strikethrough
if oFont.bold then
	let iAttributes = (iAttributes & attrib_bold)
endIf
if oFont.italic then
	let iAttributes = (iAttributes & attrib_italic)
endIf
if oFont.underline then
	let iAttributes = (iAttributes & attrib_underline)
endIf
if oFont.strikethrough then
	let iAttributes = (iAttributes & attrib_strikeout)
endIf
return iAttributes
endFunction

void function getScreenLocation (object oTextRange, int byRef x, int byRef y)
let x = oTextRange.boundLeft+oTextRange.boundWidth+50
let y = oTextRange.boundTop+oTextRange.boundHeight+25
endFunction

void function movePointer (int x, int y)
var
	int pointer
let pointer = oPpt.activePresentation.SlideShowWindow.view.pointerType
if pointer == PointerAlwaysHidden
|| pointer == PointerNone then
	sayMessage (ot_error, msgNoPointer_L, msgNoPointer_S)
else
	invisibleCursor ()
	moveTo (x, y)
	pcCursor ()
	sayFormattedMessage (ot_status, formatString (msgPointerMovedTo,
	getSlideShowPointerType (), intToString (x), intToString (y)))
endIf
endFunction

Void function SayOrBufferFormattedMessage (int iOutPutType, string sTextLong, string sTextShort, object oTextRange)
var
	int iSpeak,
	int x,
	int y,
	object oFont
let iSpeak = ShouldItemSpeak (iOutputType)
if UserBufferIsActive ()
|| giUserBufferWaitingForText
|| iOutputType == OT_USER_BUFFER then
	let oFont = oTextRange.font
	if oFont then
		GetScreenLocation (oTextRange, x, y)
		if iSpeak == message_long then
			UserBufferAddText (sTextLong,
				formatString (fnMovePointer, intToString (x), intToString (y)), cscNull,
				oFont.name, oFont.size, getFontObjAttributes (oFont), oFont.color)
		else
			UserBufferAddText (sTextShort, formatString (fnMovePointer, intToString (x), intToString (y)), cscNull,
				oFont.name, oFont.size, GetFontObjAttributes (oFont), oFont.color)
		EndIf
	else
		if iSpeak == message_long then
			UserBufferAddText (sTextLong)
		else
			UserBufferAddText (sTextShort)
		EndIf
	endIf
else
	SayFormattedMessage (iOutputType, sTextlong, sTextShort)
endIf
EndFunction

void function SayUsingVoiceOrBuffer (string sVoice, string sText, int iOutputType, object oTextRange)
var
	int x,
	int y,
	object oFont,
	string smsg
if iOutputType == ot_user_buffer then
	let oFont = oTextRange.font
	if oFont then
		GetScreenLocation (oTextRange, x, y)
		userBufferAddText (sText,
		formatString (fnMovePointer, intToString (x), intToString (y)),
		cscNull,
		oFont.name, oFont.size, getFontObjAttributes (oFont), oFont.color)
	else
		UserBufferAddText (sText)
	endIf
else
	SayUsingVoice (sVoice, sText, iOutputType)
endIf
endFunction

int function PowerPointIsInitialized ()
if !oPPT then
	return false
else
	return true
EndIf
EndFunction

int Function isSlideShow ()
return (oPpt.activePresentation.slideShowWindow.view.state == ppSlideShowRunning)
EndFunction

int Function isSlideShowDone ()
return oPpt.activePresentation.slideShowWindow.view.state == ppSlideShowDone
EndFunction

int Function getShowElapsedTime ()
return oPpt.activePresentation.slideShowWindow.view.presentationElapsedTime
EndFunction

int Function detectSlideShowStart ()
; If a slide show has just started then we need to set up tracking of animated paragraphs.
; sometimes show takes a second or two to start up.
if isSlideShow ()
&& (getShowElapsedTime () <= 4) then
	; Get slide show window handle so that we can deactivate user buffer when the handle is destroyed:
	let ghSlideShowApp = GetAppMainWindow (GetFocus ())
	let globalParaIndexPointer = 1
	let globalShapeIndex = 1
	let lastParaSpokenIndex = 1
	let lastShapeSpokenIndex = 1
	let globalPriorSlideIndex = 0
	return true
else
	return false
endIf
EndFunction

int function isPPTEditMode ()
var
	int iSelectionType,
	int iViewType
let iSelectionType = oPpt.activeWindow.selection.type
let iViewType = oPpt.ActiveWindow.ActivePane.ViewType
return iSelectionType == ppSelectionText
|| (iSelectionType == none
&& (iViewType == ppViewNotesPage
|| iViewType == ppViewOutline))
endFunction

string Function getSlideShowPointerType ()
var
	int Pointer
let pointer = oPpt.activePresentation.SlideShowWindow.view.pointerType()
if pointer == PointerAlwaysHidden then
  return msg111_L
elif pointer == PointerArrow then
  return msg112_L
elif pointer == PointerNone then
  return msg113_L
elif pointer == PointerPen then
  return msg114_L
endIf
EndFunction

void Function SaySlideShowState ()
var
	int state
let state = oPpt.activePresentation.slideShowWindow.view.state()
if state == 0 then
	; no slide show active.
	SayOrBufferFormattedMessage (ot_help, msg115_L, msg115_S, null)
endIf
if state == ppSlideShowBlackScreen then
	SayOrBufferFormattedMessage (ot_help, msg116_L, msg116_S, null)
elif state == ppSlideShowDone then
	SayOrBufferFormattedMessage (ot_help, msg117_L, msg117_S, null)
elif state == ppSlideShowPaused then
	SayOrBufferFormattedMessage (ot_help, msg118_L, msg118_S, null)
elif state == ppSlideShowRunning then
	SayOrBufferFormattedMessage (ot_help, msg119_L, msg119_S, null)
elif state == ppSlideShowWhiteScreen then
	SayOrBufferFormattedMessage (ot_help, msg120_L, msg120_S, null)
endIf
EndFunction

void Function sayActivePaneView ()
var
	int activePaneView
let activePaneView = oPpt.activeWindow.activePane.viewType
if activePaneView == ppViewSlide then
	SayMessage (ot_help, msg329_L, msg329_S)
elIf activePaneView == ppViewSlideMaster then
	SayMessage (ot_help, msg330_L, msg330_S)
elif activePaneView == ppViewNotesPage then
	SayMessage (ot_help, msg332_L, msg332_S)
ElIf activePaneView == ppViewNotesMaster then
	SayMessage (ot_help,msg334_l)
elif ActivePaneView == ppViewOutline then
	SayMessage (ot_help, msg336_L, msg336_S)
ElIf activePaneView == ppViewThumbnails then
	SayMessage (ot_help,msgThumbnailsPane)
ElIf activePaneView == ppViewMasterThumbnails then
	SayMessage (ot_help, msgMasterThumbnailsPane)
endIf
EndFunction

void Function SayPptView ()
var
	int ViewType
let viewType=oPpt.activeWindow.viewType
if ViewType==ppViewSlide then
	SayMessage (ot_help, msg328_L, msg328_S)
elif ViewType==PPViewSlideMaster then
	SayMessage (ot_help, msg330_L, msg330_S)
elif ViewType==ppViewNotesPage then
	SayMessage (ot_help, msg331_L,msg331_S)
elif ViewType==ppViewHandoutMaster then
	SayMessage (ot_help, msg333_L,msg333_S)
elif ViewType==ppViewNotesMaster then
	SayMessage (ot_help,msg334_L,msg334_S)
elif viewType==ppViewOutline then
	SayMessage (ot_help, msg335_L,msg335_S)
elif ViewType==ppViewSlideSorter then
	SayMessage (ot_help, msg337_L,msg337_S)
elif viewType==ppViewTitleMaster then
	SayMessage (ot_help, msg338_L,msg338_S)
elif viewType==ppViewNormal then
	SayMessage (ot_help, msg340_L,msg340_S) ; PP 2000 only
	sayActivePaneView()
ElIf viewType==ppViewPrintPreview then
	sayMessage(ot_help,msgPrintPreviewPane)
elif ViewType==0 then
	if isSlideShow() then
	  SayMessage (ot_help, msg339_L, msg339_S) ; Slide Show view.
	endIf
endIf
EndFunction

string Function getPptView ()
var
	int ViewType
let viewType = oPpt.activeWindow.viewType()
if ViewType == ppViewSlide then
	return msg328_L
elif ViewType == PPViewSlideMaster then
	return msg330_L
elif ViewType == ppViewNotesPage then
	return msg331_L
elif ViewType == ppViewHandoutMaster then
	return msg333_L
elif ViewType == ppViewNotesMaster then
	return msg334_L
elif viewType == ppViewOutline then
	return msg335_L
elif ViewType == ppViewSlideSorter then
	return msg337_L
elif viewType == ppViewTitleMaster then
	return msg338_L
elif viewType == ppViewNormal then
	return msg340_L
elif ! ViewType then
	if isSlideShow () then
	  return msg339_L
	endIf
endIf
EndFunction

string Function GetExcel97WorksheetCell (object OleObj)
var
	string sText,
	string sCoordinates,
	string ObjName,
	string sCellInfo
let objName = OleObj.activeSheet.name()
if ObjName == cscNull then ; sheet not active
	; unable to get active cell details.
  let sCellInfo = msg98_L ; excel 97 worksheet
else
	let sText = OleObj.activeCell.text()
	let sCoordinates = OleObj.activeCell.addressLocal(false,false)
	let sCellInfo = formatString (msg99_L, sCoordinates, sText)
endIf
return sCellInfo
EndFunction

string Function getChartTypeDescription (object theChart)
var
	int type,
	string description
let type=theChart.chartType
if type < 0 then
	; convert to positive
	let type=type*(-1)
endIf
if type==xl3DArea then
	let description=msg428_L
elif type==xl3DAreaStacked then
	let description=msg429_L
elif type==xl3DAreaStacked100 then
	let description=msg430_L
elif type==xl3DBarClustered then
	let description=msg431_L
elif type==xl3DBarStacked then
	let description=msg432_L
elif type==xl3DBarStacked100 then
	let description=msg433_L
elif type==xl3DColumn then
	let description=msg434_L
elif type==xl3DColumnClustered then
	let description=msg435_L
elif type==xl3DColumnStacked then
	let description=msg436_L
elif type==xl3DColumnStacked100 then
	let description=msg437_L
elif type==xl3DLine then
	let description=msg438_L
elif type==xl3DPie then
	let description=msg439_L
elif type==xl3DPieExploded then
	let description=msg440_L
elif type==xlArea then
	let description=msg441_L
elif type==xlAreaStacked then
	let description=msg442_L
elif type==xlAreaStacked100 then
	let description=msg443_L
elif type==xlBarClustered then
	let description=msg444_L
elif type==xlBarOfPie then
	let description=msg445_L
elif type==xlBarStacked then
	let description=msg446_L
elif type==xlBarStacked100 then
	let description=msg447_L
elif type==xlBubble then
	let description=msg448_L
elif type==xlBubble3DEffect then
	let description=msg449_L
elif type==xlColumnClustered then
	let description=msg450_L
elif type==xlColumnStacked then
	let description=msg451_L
elif type==xlColumnStacked100 then
	let description=msg452_L
elif type==xlConeBarClustered then
	let description=msg453_L
elif type==xlConeBarStacked then
	let description=msg454_L
elif type==xlConeBarStacked100 then
	let description=msg455_L
elif type==xlConeCol then
	let description=msg456_L
elif type==xlConeColClustered then
	let description=msg457_L
elif type==xlConeColStacked then
	let description=msg458_L
elif type==xlConeColStacked100 then
	let description=msg459_L
elif type==xlCylinderBarClustered then
	let description=msg460_L
elif type==xlCylinderBarStacked then
	let description=msg461_L
elif type==xlCylinderBarStacked100 then
	let description=msg462_L
elif type==xlCylinderCol then
	let description=msg463_L
elif type==xlCylinderColClustered then
	let description=msg464_L
elif type==xlCylinderColStacked then
	let description=msg465_L
elif type==xlCylinderColStacked100 then
	let description=msg466_L
elif type==xlDoughnut then
	let description=msg467_L
elif type==xlDoughnutExploded then
	let description=msg468_L
elif type==xlLine then
	let description=msg469_L
elif type==xlLineMarkers then
	let description=msg470_L
elif type==xlLineMarkersStacked then
	let description=msg471_L
elif type==xlLineMarkersStacked100 then
	let description=msg472_L
elif type==xlLineStacked then
	let description=msg473_L
elif type==xlLineStacked100 then
	let description=msg474_L
elif type==xlPie then
	let description=msg475_L
elif type==xlPieExploded then
	let description=msg476_L
elif type==xlPieOfPie then
	let description=msg477_L
elif type==xlPyramidBarClustered then
	let description=msg478_L
elif type==xlPyramidBarStacked then
	let description=msg479_L
elif type==xlPyramidBarStacked100 then
	let description=msg480_L
elif type==xlPyramidCol then
	let description=msg481_L
elif type==xlPyramidColClustered then
	let description=msg482_L
elif type==xlPyramidColStacked then
	let description=msg483_L
elif type==xlPyramidColStacked100 then
	let description=msg484_L
elif type==xlRadar then
	let description=msg485_L
elif type==xlRadarFilled then
	let description=msg486_L
elif type==xlRadarMarkers then
	let description=msg487_L
elif type==xlStockHLC then
	let description=msg488_L
elif type==xlStockOHLC then
	let description=msg489_L
elif type==xlStockVHLC then
	let description=msg490_L
elif type==xlStockVOHLC then
	let description=msg491_L
elif type==xlSurface then
	let description=msg492_L
elif type==xlSurfaceTopView then
	let description=msg493_L
elif type==xlSurfaceTopViewWireframe then
	let description=msg494_L
elif type==xlSurfaceWireframe then
	let description=msg495_L
elif type==xlXYScatter then
	let description=msg496_L
elif type==xlXYScatterLines then
	let description=msg497_L
elif type==xlXYScatterLinesNoMarkers then
	let description=msg498_L
elif type==xlXYScatterSmooth then
	let description=msg499_L
elif type==xlXYScatterSmoothNoMarkers then
	let description=msg500_L
endIf
return description
EndFunction

void function SelectChartTitle (object oChart)
sayMessage(ot_help, msgSelectingChartTitle)
oChart.chartTitle.select
endFunction

void function selectCategoryAxisTitle (object oChart)
sayMessage(ot_help,msgSelectingCategoryAxisTitle)
oChart.axes(xlCategory).axisTitle.select
endFunction

void function selectValueAxisTitle (object oChart)
sayMessage (ot_help, msgSelectingValueAxisTitle)
oChart.axes(xlValue).axisTitle.select
endFunction

void Function describeExcelChart (object oChart, string seriesDescription, string seriesUnit, string pointDescription, string pointDescriptionPlural, int sayPercentageContribution)
var
	string CategoryAxisTitle,
	string ValueAxisTitle,
	string seriesLegend,
	string dataLabel,
	object CurrentSeries,
	int seriesIndex,
	int seriesCount,
	int pointIndex,
	int pointCount,
	string CategoryReading,
	string valueReading,
	string percentCalc,
	string tmpPointCoordinates,
	int roundedPercent, ; rounded value
	string ValueRangeSourceSheet,
	string NextValueReading, ; collect contiguous points with same valueReading
	int NewSet, ; new set of contiguous points with same valueReading
	string categoryRange,
	string valueRange,
	string categoryTitle,
	string valueTitle,
	string chartTitle,
	string sFontName,
	int iPointSize,
	int iAttributes,
	string sTempDesc ;used for formatting parts of descriptions
; test to see if user buffer active before activating it:
if ! UserBufferIsActive () then
	UserBufferClear ()
	UserBufferActivate ()
EndIf
let chartTitle = oChart.chartTitle.caption
if chartTitle == cscNull then
	let chartTitle = oChart.name
endIf
let sFontName = oChart.chartTitle.font.name
let iPointSize = oChart.chartTitle.font.size
let iAttributes = GetFontObjAttributes(oChart.chartTitle.font)
UserBufferAddText (chartTitle, fnSelectChartTitle, fnDisplaySelectChartTitle, sFontName, iPointSize, iAttributes)
UserBufferAddText (scNL+FormatString(msgChartDescription1_L, getChartTypeDescription(oChart)))
if oChart.hasAxis(xlCategory) then
	let CategoryAxisTitle = oChart.axes(xlCategory).axisTitle.caption
	let sFontName = oChart.axes(xlCategory).axisTitle.font.name
	let iPointSize = oChart.axes(xlCategory).axisTitle.font.size
	let iAttributes = GetFontObjAttributes(oChart.axes(xlCategory).axisTitle.font)
	if categoryAxisTitle != cscNull then
		UserBufferAddText (formatString(msgCategoryAxisTitle1_L, CategoryAxisTitle), fnSelectCategoryAxisTitle, fnDisplaySelectCategoryAxisTitle, sFontName, iPointSize, iAttributes)
	else
		let categoryAxisTitle = msgCategory1
		UserBufferAddText (msgCategoryAxisTitle2_L)
	endIf
else
	let CategoryAxisTitle = msgCategory1
endIf
if oChart.hasAxis(xlValue) then
	let ValueAxisTitle=oChart.axes(xlValue).axisTitle.caption
	let sFontName = oChart.axes(xlValue).axisTitle.font.name
	let iPointSize = oChart.axes(xlValue).axisTitle.font.size
	let iAttributes = GetFontObjAttributes(oChart.axes(xlValue).axisTitle.font)
	if valueAxisTitle != cscNull then
		UserBufferAddText (formatString (msgValueAxisTitle1_L, ValueAxisTitle), fnSelectValueAxisTitle, fnDisplaySelectValueAxisTitle, sFontName, iPointSize, iAttributes)
	else
		let valueAxisTitle = msgValue1
		UserBufferAddText (msgValueAxisTitle2_L, msgValueAxisTitle2_S)
	endIf
else
	let valueAxisTitle = msgValue1
endIf
let seriesCount=oChart.seriesCollection.count
let seriesIndex = 1
if seriesDescription != cscNull then
	UserBufferAddText (formatString (msgChartContainsSeriesDesc1_L, intToString (seriesCount), seriesDescription)+scNL) ; chart contains x lines, sets of bars etc.
else ; must be a pie chart
	let seriesCount = 1
endIf
while seriesIndex <= seriesCount
	let currentSeries = oChart.seriesCollection(seriesIndex)
	; note to translators, we are obtaining the parts of the formula which
	;specify the ranges of cells from which the chart is derived.
	let categoryRange = StringSegment (currentSeries.formula, scFormulaRangeDelimiter, 2)
	let valueRange = StringSegment (currentSeries.formula, scFormulaRangeDelimiter, 3)
	let valueRangeSourceSheet = stringSegment (valueRange, scFormulaSheetDelimiter, 1)
	if valueRangeSourceSheet != cscNull then
		let valueRangeSourceSheet = valueRangeSourceSheet+scFormulaSheetDelimiter ; sheetX!
	endIf
	let seriesLegend = currentSeries.name
	if seriesUnit != cscNull then
		let sTempDesc = scNL+formatString (seriesUnit, intToString (seriesIndex)) ; line, set of bars (etc) x
	endIf
	if seriesLegend != cscNull then
		if sTempDesc != cscNull then
			let sTempDesc = sTempDesc+cscSpace
		endIf
		let sTempDesc = sTempDesc+formatString (msgSeriesLegend1, seriesLegend)
	endIf
	let pointCount = currentSeries.points.count
	if pointCount > 0 then
		if sTempDesc != cscNull then
			let sTempDesc = sTempDesc+cscSpace
		endIf
		let sTempDesc = sTempDesc+formatString (msgSeriesPointCount1_L, intToString (pointCount), pointDescriptionPlural) ; has x points, bars etc
	endIf
	if sTempDesc != cscNull then
		UserBufferAddText (sTempDesc)
	endIf
	let newSet = true
	let pointIndex = 1
	while pointIndex <= pointCount
		let CategoryReading = oChart.application.evaluate(categoryRange).cells(pointIndex).text
		let valueReading = oChart.application.evaluate(valueRange).cells(pointIndex).text
		if sayPercentageContribution then
			let tmpPointCoordinates = oChart.application.evaluate(valueRange).cells(pointIndex).address
			let percentCalc = formatString (XLRoundPercentCalcFunction, valueRangeSourceSheet, tmpPointCoordinates, valueRange)
			let roundedPercent = oChart.application.evaluate(percentCalc)
		endIf
		if pointIndex < pointCount && not sayPercentageContribution then
			let NextValueReading = oChart.application.evaluate(valueRange).cells(pointIndex+1).text
	else
		let newSet = true ; force last point to be announced.
	endIf
	let DataLabel = currentSeries.points(pointIndex).dataLabel.caption
	if newSet || valueReading != nextValueReading then ; ie first or last in set
			UserBufferAddText (formatString (msgPointCategoryDesc1, formatString (pointDescription, intToString (pointIndex)),
			dataLabel, CategoryAxisTitle, CategoryReading)
			+cscSpace, cscNull, cscNull, cscNull, 0, 0, false) ; suppress line break)
		endIf
		; only want to read value axis title and value if next point is different
		; otherwise suppress until found end of same value readings
		if NextValueReading != valueReading || pointIndex==pointCount then
			if SayPercentageContribution && not stringContains (currentSeries.points(pointIndex).dataLabel.caption, scPercent) then
				UserBufferAddText (formatString (msgPointValueDesc1, ValueAxisTitle, valueReading)+cscSpace, cscNull, cscNull, cscNull, 0, 0, false)
				UserBufferAddText (formatString (msgContributesPercentage1, intToString (roundedPercent)))
			else
				UserBufferAddText (formatString (msgPointValueDesc1, ValueAxisTitle, valueReading))
			endIf
			let NewSet = true
		else ; same, ignore until found end of same values
			if newSet then ; announce "through" unless last point
				UserBufferAddText (msgThrough1) ; through
				let newSet = false ; not a new set, continuing old set.
			endIf
		endIf
		let pointIndex = pointIndex+1
	endWhile
	let seriesIndex = seriesIndex+1
endWhile
JAWSTopOfFile ()
let giReadingUserBufferChart = true
sayAll ();
EndFunction

void Function ReadExcelChart ()
var
	string seriesDescription, ; lines, sets of bars, etc
	string seriesUnit, ; line, set of bars, etc
	string pointDescription, ; point, bar, etc
	string pointDescriptionPlural, ; points, bars etc
	int sayPercentageContribution, ; used for Pie charts and those for which the value contributes to a total.
	int type,
	object oChart
let oChart = oPpt.activeWindow.selection.shapeRange(1).oleFormat.object.application.activeChart
if ! oChart then
	return
endIf
let type = oChart.chartType
if type < 0 then
	; negate
	let type = (type*-1)
endIf
if Type == xlLine
||	Type == xlLineMarkers
|| type == xlLineMarkersStacked
|| type == xlLineMarkersStacked100
|| type == xlLineStacked
|| type == xlLineStacked100 then
	let seriesDescription = msgLinePlural1 ; lines
	let seriesUnit = msgLineSingular1 ; line
	let pointDescription = msgPointSingular1 ; point
	let pointDescriptionPlural = msgPointPlural1 ; points
	let sayPercentageContribution = false
	describeExcelChart (oChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
elif Type == xlBarClustered
|| type == xlBarStacked
|| type == xlBarStacked100
|| type == xlConeBarClustered
|| type == xlConeBarStacked
|| type== xlConeBarStacked100
|| type == xlCylinderBarClustered
|| type == xlCylinderBarStacked
|| type == xlCylinderBarStacked100
|| type == xlPyramidBarClustered
|| type == xlPyramidBarStacked
|| type == xlPyramidBarStacked100 then
	let seriesDescription = msgSetOfHorizBars1 ; distinct sets of horizontal bars
	let seriesUnit = msgSetSingular1 ; set (of bars)
	let pointDescription = msgBarSingular1 ; bar
	let pointDescriptionPlural = msgBarPlural1 ; bars
	let sayPercentageContribution = false
	describeExcelChart (oChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
elif type == xlColumnClustered
|| type == xlColumnStacked
|| type == xlColumnStacked100
|| type == xlConeCol
|| type == xlConeColClustered
|| type == xlConeColStacked
|| type == xlConeColStacked100
|| type == xlCylinderCol
|| type == xlCylinderColClustered
|| type == xlCylinderColStacked
|| type == xlCylinderColStacked100
|| type == xlPyramidCol
|| type == xlPyramidColStacked
|| type == xlPyramidColStacked100 then
	let seriesDescription = msgSetOfVertColumns1 ; distinct sets of vertical columns
	let seriesUnit = msgSetSingular1 ; set (of columns)
	let pointDescription = msgColumnSingular1 ; column
	let pointDescriptionPlural = msgColumnPlural1 ; columns
	let sayPercentageContribution = false
	describeExcelChart (oChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
elif type == xlPie
|| type == xlPieExploded then
	let seriesDescription = cscNull ; only one series for a pie chart
	let seriesUnit = cscNull ; not applicable
	let pointDescription = msgSliceSingular1 ; slice
	let pointDescriptionPlural = msgSlicePlural1 ; slices
	let sayPercentageContribution = true
	describeExcelChart (oChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
elif type == xlDoughnut
|| type == xlDoughnutExploded then
	let seriesDescription = msgSetOfSlices1 ; distinct sets of slices
	let seriesUnit = msgSetSingular1 ; set (of slices)
	let pointDescription=msgSliceSingular1 ; segment
	let pointDescriptionPlural = msgSlicePlural1 ; segments
	let sayPercentageContribution = true
	describeExcelChart (oChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
elif type > 0 then
	let seriesDescription = msgSeriesPlural1 ; series
	let seriesUnit = msgSeriesSingular1 ; series
	let pointDescription = msgPointSingular1 ; point
	let pointDescriptionPlural = msgPointPlural1 ; points
	let sayPercentageContribution = false
	describeExcelChart (oChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
else
	SayMessage (ot_error, msg501_L) ; no chart active
endIf
EndFunction

void Function describeMSGraphChart (object theChart, string seriesDescription, string seriesUnit, string pointDescription, string pointDescriptionPlural, int sayPercentageContribution)
var
	string ChartTitle,
	string CategoryAxisTitle,
	string ValueAxisTitle,
	string seriesLegend,
	object CurrentSeries,
	int seriesIndex,
	int seriesCount,
	int pointIndex,
	int pointCount,
	string sCategoryReading,
	string sValueReading,
	string categoryTitle,
	string valueTitle,
	int plotBy,
	string sFontName,
	int iPointSize,
	int iAttributes,
	string sTempDesc, ;used for formatting parts of descriptions
	object datasheet
; test for buffer already active before activating it:
if !UserBufferIsActive() then
	UserBufferClear()
	UserBufferActivate()
EndIf
let datasheet=theChart.application.datasheet
let plotBy=theChart.application.plotBy
let chartTitle=theChart.chartTitle.caption
if chartTitle==cscNull then
	let chartTitle=theChart.name
endIf
let sFontName=theChart.chartTitle.font.name
let iPointSize=theChart.chartTitle.font.size
let iAttributes=GetFontObjAttributes(theChart.chartTitle.font)
UserBufferAddText(chartTitle, fnSelectChartTitle, fnDisplaySelectChartTitle, sFontName, iPointSize, iAttributes)
UserBufferAddText(scNL+FormatString(msgChartDescription1_L, getChartTypeDescription(theChart)))
if theChart.hasAxis(xlCategory) then
	let CategoryAxisTitle=theChart.axes(xlCategory).axisTitle.caption
	let sFontName=theChart.axes(xlCategory).axisTitle.font.name
	let iPointSize=theChart.axes(xlCategory).axisTitle.font.size
	let iAttributes=GetFontObjAttributes(theChart.axes(xlCategory).axisTitle.font)
	if categoryAxisTitle!=cscNull then
		UserBufferAddText(formatString(msgCategoryAxisTitle1_L, CategoryAxisTitle), fnSelectCategoryAxisTitle, fnDisplaySelectCategoryAxisTitle, sFontName, iPointSize, iAttributes)
	else
		let categoryAxisTitle=msgCategory1
		UserBufferAddText(msgCategoryAxisTitle2_L)
	endIf
else
	let CategoryAxisTitle=msgCategory1
endIf
if theChart.hasAxis(xlValue) then
	let ValueAxisTitle=theChart.axes(xlValue).axisTitle.caption
	let sFontName=theChart.axes(xlValue).axisTitle.font.name
	let iPointSize=theChart.axes(xlValue).axisTitle.font.size
	let iAttributes=GetFontObjAttributes(theChart.axes(xlValue).axisTitle.font)
	if valueAxisTitle !=cscNull then
		UserBufferAddText(formatString(msgValueAxisTitle1_L, ValueAxisTitle), fnSelectValueAxisTitle, fnDisplaySelectValueAxisTitle, sFontName, iPointSize, iAttributes)
	else
		let valueAxisTitle=msgValue1
		UserBufferAddText(msgValueAxisTitle2_L, msgValueAxisTitle2_S)
	endIf
else
	let valueAxisTitle=msgValue1
endIf
let seriesCount=theChart.seriesCollection.count
let seriesIndex=1
if seriesDescription!=cscNull then
	UserBufferAddText(formatString(msgChartContainsSeriesDesc1_L, intToString(seriesCount), seriesDescription)+scNL) ; chart contains x lines, sets of bars etc.
else ; must be a pie chart
	let seriesCount=1
endIf
while seriesIndex <=seriesCount
	let currentSeries=theChart.seriesCollection(seriesIndex)
	if plotBy==xlRows then
		let seriesLegend=datasheet.cells(seriesIndex+1,1).value ; series legends start in row 2 col 1
	else ; xlColumns
		let seriesLegend=datasheet.cells(1,seriesIndex+1) ; otherwise row 1 col 2
	endIf
	if seriesUnit !=cscNull then
		let sTempDesc=scNL+formatString(seriesUnit,intToString(seriesIndex)) ; line, set of bars (etc) x
	endIf
	if seriesLegend!=cscNull then
		if sTempDesc!=cscNull then
			let sTempDesc=sTempDesc+cscSpace
		endIf
		let sTempDesc=sTempDesc+formatString(msgSeriesLegend1, seriesLegend)
	endIf
	let pointCount=currentSeries.points.count
	if pointCount > 0 then
		if sTempDesc!=cscNull then
			let sTempDesc=sTempDesc+cscSpace
		endIf
		let sTempDesc=sTempDesc+formatString(msgSeriesPointCount1_L, intToString(pointCount), pointDescriptionPlural) ; has x points, bars etc
	endIf
	if sTempDesc !=cscNull then
		UserBufferAddText(sTempDesc)
	endIf
	let pointIndex=1
	while pointIndex <=pointCount
		if plotBy==xlRows then
			let sCategoryReading=datasheet.cells(1,pointIndex+1).value
			let sValueReading=datasheet.cells(seriesIndex+1,pointIndex+1).value
		else ; xlColumns
			let sCategoryReading=datasheet.cells(pointIndex+1,1).value
			let sValueReading=datasheet.cells(pointIndex+1,seriesIndex+1).value
		endIf
		UserBufferAddText(formatString(msgPointCategoryDesc1, pointDescription,
		intToString(pointIndex), currentSeries.points(pointIndex).dataLabel.caption,
		CategoryAxisTitle, sCategoryReading))
		UserBufferAddText(formatString(msgPointValueDesc1, ValueAxisTitle, sValueReading))
		let pointIndex=pointIndex+1
	endWhile
	let seriesIndex=seriesIndex+1
endWhile
JAWSTopOfFile()
let giReadingUserBufferChart=true
SayAll()
EndFunction

void Function readMSGraphChart ()
var
	string seriesDescription, ; lines, sets of bars, etc
	string seriesUnit, ; line, set of bars, etc
	string pointDescription, ; point, bar, etc
	string pointDescriptionPlural, ; points, bars etc
	int sayPercentageContribution, ; used for Pie charts and those for which the value contributes to a total.
	int type,
	object msGraphApp,
	object theChart
let msGraphApp=oPpt.activeWindow.selection.shapeRange(1).oleFormat.object.application
let theChart=msGraphApp.chart
if !theChart then
	return
endIf
let type=theChart.chartType
if type < 0 then
; negate
	let type=(type*-1)
endIf
if Type==xlLine ||
	Type==xlLineMarkers ||
	type==xlLineMarkersStacked ||
	type==xlLineMarkersStacked100 ||
	type==xlLineStacked ||
	type==xlLineStacked100 then
	let seriesDescription=msgLinePlural1 ; lines
	let seriesUnit=msgLineSingular1 ; line
	let pointDescription=msgPointSingular1 ; point
	let pointDescriptionPlural=msgPointPlural1 ; points
	let sayPercentageContribution=false
	describeMSGraphChart(theChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
elif Type==xlBarClustered ||
	type==xlBarStacked ||
	type==xlBarStacked100 ||
	type==xlConeBarClustered ||
	type==xlConeBarStacked ||
	type==xlConeBarStacked100 ||
	type==xlCylinderBarClustered ||
	type==xlCylinderBarStacked ||
	type==xlCylinderBarStacked100 ||
	type==xlPyramidBarClustered ||
	type==xlPyramidBarStacked ||
	type==xlPyramidBarStacked100 then
	let seriesDescription=msgSetOfHorizBars1 ; distinct sets of horizontal bars
	let seriesUnit=msgSetSingular1 ; set (of bars)
	let pointDescription=msgBarSingular1 ; bar
	let pointDescriptionPlural=msgBarPlural1 ; bars
	let sayPercentageContribution=false
	describeMSGraphChart(theChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
elif type==xlColumnClustered ||
	type==xlColumnStacked ||
	type==xlColumnStacked100 ||
	type==xlConeCol ||
	type==xlConeColClustered ||
	type==xlConeColStacked ||
	type==xlConeColStacked100 ||
	type==xlCylinderCol ||
	type==xlCylinderColClustered ||
	type==xlCylinderColStacked ||
	type==xlCylinderColStacked100 ||
	type==xlPyramidCol ||
	type==xlPyramidColStacked ||
	type==xlPyramidColStacked100 			then
	let seriesDescription=msgSetOfVertColumns1 ; distinct sets of vertical columns
	let seriesUnit=msgSetSingular1 ; set (of columns)
	let pointDescription=msgColumnSingular1 ; column
	let pointDescriptionPlural=msgColumnPlural1 ; columns
	let sayPercentageContribution=false
	describeMSGraphChart(theChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
elif type==xlPie ||
	type==xlPieExploded then
	let seriesDescription=cscNull ; only one series for a pie chart
	let seriesUnit=cscNull ; not applicable
	let pointDescription=msgSliceSingular1 ; slice
	let pointDescriptionPlural=msgSlicePlural1 ; slices
	let sayPercentageContribution=true
	describeMSGraphChart(theChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
elif type==xlDoughnut ||
	type==xlDoughnutExploded then
	let seriesDescription=msgSetOfSlices1 ; distinct sets of slices
	let seriesUnit=msgSetSingular1 ; set (of slices)
	let pointDescription=msgSliceSingular1 ; segment
	let pointDescriptionPlural=msgSlicePlural1 ; segments
	let sayPercentageContribution=true
	describeMSGraphChart(theChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
elif type > 0 then
	let seriesDescription=msgSeriesPlural1 ; series
	let seriesUnit=msgSeriesSingular1 ; series
	let pointDescription=msgPointSingular1 ; point
	let pointDescriptionPlural=msgPointPlural1 ; points
	let sayPercentageContribution=false
	describeMSGraphChart(theChart, seriesDescription, seriesUnit, pointDescription, pointDescriptionPlural, sayPercentageContribution)
else
	SayMessage (ot_error,msg501_L) ; no chart active
endIf
EndFunction

string Function GetOleObjDescription (object shape)
var
	string description,
	string ObjName,
	object OleObj,
	string progId
let OleObj = shape.OleFormat.object.application()
let ProgId = shape.OleFormat.ProgId()
if ProgId == Excel97sheet then
  return GetExcel97WorksheetCell (OleObj) ; excel worksheet cell info
elif progId == Excel97Chart then
	readExcelChart ()
  return msg100_L ; Excel 97 Chart
elif progId == MsGraphChart8 then
  return msg101_L ; Ms Graph 97 chart
elif progId == PaintPicture then
  return msg102_L ; bitmap picture
elif ProgId == MsClipartGallery2 then
  return msg103_L ; Ms Clipart
elif progId == word97doc then
  if isCaretInTable () then
    return msg104_L + cscSpace + msg133_L ; word 97 document table
  else
    return msg104_L ; word 97 document
  endIf
elif progId == Ppt97Show then
  return msg105_L ; Ppt 97 presentation
elif progId == Ppt97Slide then
  return msg106_L ; Ppt 97 slide
elif stringLeft (progId, 2) == stringLeft(wpDoc, 2)
&& stringRight (progId, 3) == stringRight (WPDoc, 3) then
	return msg107_L ; "Corel Wordperfect Document",
elif stringLeft (progId, stringLength (qpwChart)-1) == stringLeft (QPWChart, stringLength (QPWChart)-1) then
	return msg108_L ; "Corel Quattro Pro Chart",
elif stringLeft (progId, stringLength (qpwNotebook)-1) == stringLeft (qpwNotebook, stringLength (qpwNotebook)-1) then
	return msg109_L ; "Corel quattro Pro Notebook",
endIf
if getVerbosity() == beginner then
  let description = msg307_L + cscSpace ;"embedded OLE object", ; 7,
endIf
let objName = shape.OleFormat.object.name()
if ObjName == cscNull then
  let ObjName = formatString (msgPhotoEditorImage, progId)
endIf
let description = description + objName
return description
EndFunction

string Function GetShapePlaceHolderDescription (object shape)
; assumes shape.type==msoShapeHolder
var
	string description,
	int placeHolderFormat
let PlaceHolderFormat = shape.placeHolderFormat.type()
if PlaceHolderFormat == ppPlaceholderBitmap then
	let description = msg149_L ; 9,
elif PlaceHolderFormat == ppPlaceholderBody then
	let description = msg150_L ; 2,
elif PlaceHolderFormat == ppPlaceholderCenterTitle then
	let description = msg151_L ; 3,
elif PlaceHolderFormat == ppPlaceholderChart then
	let description = msg152_L ; 8,
elif PlaceHolderFormat == ppPlaceholderDate then
	let description = msg153_L ; 16,
elif PlaceHolderFormat == ppPlaceholderFooter then
	let description = msg154_L ; 15,
elif PlaceHolderFormat == ppPlaceholderHeader then
	let description = msg155_L ; 14,
elif PlaceHolderFormat == ppPlaceholderMediaClip then
	let description = msg156_L ; 10,
;elif PlaceHolderFormat == ppPlaceholderMixed then
;	let description = msg157_L ; -2,
elif PlaceHolderFormat == ppPlaceholderObject then
	let description = msg158_L ; 7,
elif PlaceHolderFormat == ppPlaceholderOrgChart then
	let description = msg159_L ; 11,
elif PlaceHolderFormat == ppPlaceholderSlideNumber then
	let description = msg160_L ; 13,
elif PlaceHolderFormat == ppPlaceholderSubtitle then
	let description = msg161_L ; 4,
elif PlaceHolderFormat == ppPlaceholderTable then
	let description = msg162_L ; 12,
elif PlaceHolderFormat == ppPlaceholderTitle then
	let description = msg163_L ; 1,
elif PlaceHolderFormat == ppPlaceholderVerticalBody then
	let description = msg164_L ; 6,
elif PlaceHolderFormat == ppPlaceholderVerticalTitle then
	let description = msg165_L ; 5,
elif PlaceHolderFormat < 0 then
  let description = msg157_L
endIf
return description
EndFunction

string Function GetAutoshapeDescription (object shape)
var
	int type
let type = shape.autoshapeType()
if type == MsoShape16pointStar then
	return msg166_L
elif type == MsoShape24pointStar then
	return msg167_L
elif type==MsoShape32pointStar then
	return msg168_L
elif type == MsoShape4pointStar then
	return msg169_L
elif type == MsoShape5pointStar then
	return msg170_L
elif type == MsoShape8pointStar then
	return msg171_L
elif type == MsoShapeActionBtnBackorPrev then
	return msg172_L
elif type == MsoShapeActionButtonBeginning then
	return msg173_L
elif type == MsoShapeActionButtonCustom then
	return msg174_L
elif type == MsoShapeActionButtonDocument then
	return msg175_L
elif type == MsoShapeActionButtonEnd then
	return msg176_L
elif type == MsoShapeActionBtnForwardorNxt then
	return msg177_L
elif type == MsoShapeActionButtonHelp then
	return msg178_L
elif type == MsoShapeActionButtonHome then
	return msg179_L
elif type == MsoShapeActionBtnInfo then
	return msg180_L
elif type == MsoShapeActionButtonMovie then
	return msg181_L
elif type == MsoShapeActionButtonReturn then
	return msg182_L
elif type==MsoShapeActionButtonSound then
	return msg183_L
elif type == MsoShapeArc then
	return msg184_L
elif type == MsoShapeBalloon then
	return msg185_L
elif type == MsoShapeBentArrow then
	return msg186_L
elif type == MsoShapeBentUpArrow then
	return msg187_L
elif type == MsoShapeBevel then
	return msg188_L
elif type == MsoShapeBlockArc then
	return msg189_L
elif type == MsoShapeCan then
	return msg190_L
elif type == MsoShapeChevron then
	return msg191_L
elif type == MsoShapeCircularArrow then
	return msg192_L
elif type == MsoShapeCloudCallout then
	return msg193_L
elif type == MsoShapeCross then
	return msg194_L
elif type == MsoShapeCube then
	return msg195_L
elif type == MsoShapeCurvedDownArrow then
	return msg196_L
elif type == MsoShapeCurvedDownRibbon then
	return msg197_L
elif type == MsoShapeCurvedLeftArrow then
	return msg198_L
elif type == MsoShapeCurvedRightArrow then
	return msg199_L
elif type == MsoShapeCurvedUpArrow then
	return msg200_L
elif type == MsoShapeCurvedUpRibbon then
	return msg201_L
elif type == MsoShapeDiamond then
	return msg202_L
elif type == MsoShapeDonut then
	return msg203_L
elif type == MsoShapeDoubleBrace then
	return msg204_L
elif type == MsoShapeDoubleBracket then
	return msg205_L
elif type == MsoShapeDoubleWave then
	return msg206_L
elif type == MsoShapeDownArrow then
	return msg207_L
elif type == MsoShapeDownArrowCallout then
	return msg208_L
elif type == MsoShapeDownRibbon then
	return msg209_L
elif type == MsoShapeExplosion1 then
	return msg210_L
elif type == MsoShapeExplosion2 then
	return msg211_L
elif type == MsoShapeFlowchartAltProcess then
	return msg212_L
elif type == MsoShapeFlowchartCard then
	return msg213_L
elif type == MsoShapeFlowchartCollate then
	return msg214_L
elif type == MsoShapeFlowchartConnector then
	return msg215_L
elif type == MsoShapeFlowchartData then
	return msg216_L
elif type == MsoShapeFlowchartDecision then
	return msg217_L
elif type == MsoShapeFlowchartDelay then
	return msg218_L
elif type == MsoShapeFlowchartDirAccStorage then
	return msg219_L
elif type == MsoShapeFlowchartDisplay then
	return msg220_L
elif type == MsoShapeFlowchartDocument then
	return msg221_L
elif type == MsoShapeFlowchartExtract then
	return msg222_L
elif type == MsoShapeFlowchartIntStorage then
	return msg223_L
elif type == MsoShapeFlowchartMagneticDisk then
	return msg224_L
elif type == MsoShapeFlowchartManualInput then
	return msg225_L
elif type == MsoShapeFlowchartManualOp then
	return msg226_L
elif type == MsoShapeFlowchartMerge then
	return msg227_L
elif type == MsoShapeFlowchartMultidocument then
	return msg228_L
elif type == MsoShapeFlowchartOffpageCon then
	return msg229_L
elif type == MsoShapeFlowchartOr then
	return msg230_L
elif type == MsoShapeFlowchartPredefProc then
	return msg231_L
elif type == MsoShapeFlowchartPreparation then
	return msg232_L
elif type == MsoShapeFlowchartProcess then
	return msg233_L
elif type == MsoShapeFlowchartPunchedTape then
	return msg234_L
elif type == MsoShapeFlowchartSeqAccStorage then
	return msg235_L
elif type == MsoShapeFlowchartSort then
	return msg236_L
elif type == MsoShapeFlowchartStoredData then
	return msg237_L
elif type == MsoShapeFlowchartSummingJunct then
	return msg238_L
elif type == MsoShapeFlowchartTerminator then
	return msg239_L
elif type == MsoShapeFoldedCorner then
	return msg240_L
elif type == MsoShapeHeart then
	return msg241_L
elif type == MsoShapeHexagon then
	return msg242_L
elif type == MsoShapeHorizontalScroll then
	return msg243_L
elif type==MsoShapeIsoscelesTriangle then
	return msg244_L
elif type == MsoShapeLeftArrow then
	return msg245_L
elif type == MsoShapeLeftArrowCallout then
	return msg246_L
elif type == MsoShapeLeftBrace then
	return msg247_L
elif type == MsoShapeLeftBracket then
	return msg248_L
elif type == MsoShapeLeftRightArrow then
	return msg249_L
elif type == MsoShapeLeftRightArrowCallout then
	return msg250_L
elif type == MsoShapeLeftRightUpArrow then
	return msg251_L
elif type == MsoShapeLeftUpArrow then
	return msg252_L
elif type == MsoShapeLightningBolt then
	return msg253_L
elif type == MsoShapeLineCallout1 then
	return msg254_L
elif type == MsoShapeLineCallout1AccentBar then
	return msg255_L
elif type == MsoShapeLnCallout1BordAccBar then
	return msg256_L
elif type == MsoShapeLineCallout1NoBorder then
	return msg257_L
elif type == MsoShapeLineCallout2 then
	return msg258_L
elif type == MsoShapeLineCallout2AccentBar then
	return msg259_L
elif type == MsoShapeLnCallout2BordAccBar then
	return msg260_L
elif type == MsoShapeLineCallout2NoBorder then
	return msg261_L
elif type == MsoShapeLineCallout3 then
	return msg262_L
elif type == MsoShapeLineCallout3AccentBar then
	return msg263_L
elif type == MsoShapeLnCallout3BordAccBar then
	return msg264_L
elif type == MsoShapeLineCallout3NoBorder then
	return msg265_L
elif type == MsoShapeLineCallout4 then
	return msg266_L
elif type == MsoShapeLineCallout4AccentBar then
	return msg267_L
elif type == MsoShapeLnCallout4BordAccBar then
	return msg268_L
elif type == MsoShapeLineCallout4NoBorder then
	return msg269_L
;elif type == MsoShapeMixed then
;	return msg102m_L
elif type == MsoShapeMoon then
	return msg270_L
elif type == MsoShapeNoSymbol then
	return msg271_L
elif type == MsoShapeNotchedRightArrow then
	return msg272_L
elif type == MsoShapeNotPrimitive then
	return msg273_L
elif type==MsoShapeOctagon then
	return msg274_L
elif type == MsoShapeOval then
	return msg275_L
elif type == MsoShapeOvalCallout then
	return msg276_L
elif type == MsoShapeParallelogram then
	return msg277_L
elif type == MsoShapePentagon then
	return msg278_L
elif type == MsoShapePlaque then
	return msg279_L
elif type == MsoShapeQuadArrow then
	return msg280_L
elif type == MsoShapeQuadArrowCallout then
	return msg281_L
elif type == MsoShapeRectangle then
	return msg282_L
elif type == MsoShapeRectangularCallout then
	return msg283_L
elif type == MsoShapeRegularPentagon then
	return msg284_L
elif type == MsoShapeRightArrow then
	return msg285_L
elif type == MsoShapeRightArrowCallout then
	return msg286_L
elif type == MsoShapeRightBrace then
	return msg287_L
elif type == MsoShapeRightBracket then
	return msg288_L
elif type == MsoShapeRightTriangle then
	return msg289_L
elif type == MsoShapeRoundedRectangle then
	return msg290_L
elif type == MsoShapeRoundedRectCallout then
	return msg291_L
elif type == MsoShapeSmileyFace then
	return msg292_L
elif type == MsoShapeStripedRightArrow then
	return msg293_L
elif type == MsoShapeSun then
	return msg294_L
elif type == MsoShapeTrapezoid then
	return msg295_L
elif type == MsoShapeUpArrow then
	return msg296_L
elif type == MsoShapeUpArrowCallout then
	return msg297_L
elif type == MsoShapeUpDownArrow then
	return msg298_L
elif type == MsoShapeUpDownArrowCallout then
	return msg299_L
elif type == MsoShapeUpRibbon then
	return msg300_L
elif type == MsoShapeUTurnArrow then
	return msg301_L
elif type == MsoShapeVerticalScroll then
	return msg302_L
 elif type == MsoShapeWave then
	return msg303_L
else
	return shape.name()
endIf
EndFunction

string Function getTableDimensions (object table)
return formatString (msgTableDimensions1, intToString (table.columns.count), intToString (table.rows.count))
EndFunction

void Function readTable (object table, int readingMethod, string voice, int iRedirectToUserBuffer)
var
	object cell,
	int row,
	int col,
;Next two variables added during Make Common project.
;Only set each at start of relative while loop in case of variable (non-standard) dimensions
	int rowCount,
	int colCount,
	int iOutputtype
if iRedirectToUserBuffer then
	let iOutputtype = ot_user_buffer
else
	let iOutputtype = ot_line ; ot_no_disable before 6.0
endIf
if readingMethod == tableRowByRow then
	; read row by row
	let row = 1
	let rowCount = table.rows.count
	while (row <= rowCount)
		SayUsingVoiceOrBuffer (voice, formatString(cmsgRowHeader,intToString(row)),iOutputType, null)
		let col = 1
		let colCount = table.columns.count
		while (col <= colCount)
			let cell = table.cell(row,col)
			SayUsingVoiceOrBuffer (voice, formatString (cmsgColumnHeader, intToString (col)), iOutputType, null) ; col
			if cell.shape.hasTextFrame() then
				if cell.shape.textFrame.hasText() then
					SayUsingVoiceOrBuffer (vctx_pcCursor, cell.shape.textFrame.textRange.text, iOutputType, cell.shape.textFrame.textRange)
				else
					SayUsingVoiceOrBuffer (vctx_pcCursor, cmsgBlank1, iOutputType, null)
				endIf
			else
				SayUsingVoiceOrBuffer (vctx_pcCursor, cmsgBlank1, iOutputType, null)
			endIf
			let col = col+1
		endWhile
		let row = row+1
	endWhile
elif readingMethod == tableColByCol then
; read column by column
	let col = 1
	let colCount = table.columns.count
	while (col <= colCount)
		SayUsingVoiceOrBuffer (voice, formatString (cmsgColumnHeader, intToString (col)), iOutputType, null) ; col
		let row = 1
		let rowCount = table.rows.count
		while (row <= rowCount)
			let cell = table.cell(row,col)
			SayUsingVoiceOrBuffer (voice, formatString (cmsgRowHeader, intToString (row)), iOutputType, null) ; row
			if cell.shape.hasTextFrame() then
				if cell.shape.textFrame.hasText() then
					SayUsingVoiceOrBuffer (vctx_pcCursor, cell.shape.textFrame.textRange.text, iOutputType, cell.shape.textFrame.textRange)
				else
						SayUsingVoiceOrBuffer (vctx_pcCursor, cmsgBlank1, iOutputType, null)
				endIf
			else
				SayUsingVoiceOrBuffer (vctx_pcCursor, cmsgBlank1, iOutputType, null)
			endIf
			let row = row+1
		endWhile
		let col = col+1
	 endWhile
elif readingMethod == tableDimensionsOnly then
	SayUsingVoiceOrBuffer (voice, getTableDimensions (table), iOutputType, null)
;else ; readingMethod == tableIgnore
; do nothing.
endIf
EndFunction

void function readTableRowByRow ()
var
	object table,
	object selectedShape
let selectedShape = oPpt.activeWindow.selection.shapeRange(1)
if not selectedShape.hasTable then
	SayMessage (ot_error, msg85_L) ; no table selected
	return
endIf
let table = selectedShape.table
readTable (table, tableRowByRow, vctx_pcCursor, false)
EndFunction

void function readTableColumnByColumn ()
var
	object table,
	object cell,
	object selectedShape,
	int row,
	int col
let selectedShape = oPpt.activeWindow.selection.shapeRange(1)
if not selectedShape.hasTable then
	SayMessage (ot_error, msg85_L) ; no table selected
	return
endIf
let table = selectedShape.table
readTable (table, tableColByCol, vctx_pcCursor, false)
EndFunction

string Function GetShapeDescription (object shape)
var
	int iType
let iType = shape.type
if iType == MsoAutoShape then
  return GetAutoshapeDescription (shape)
elif iType == msoEmbeddedOLEObject then
  return GetOleObjDescription (shape)
elif iType == msoPlaceholder then
	if !giObjectOnly then
	  return formatString (msg90_L, getShapePlaceHolderDescription (shape))
	EndIf
elif iType == msoCallout then
  return msg304_L ;"callout", ; 2,
elif iType == msoChart then
  return msg305_L ;"chart", ; 3,
elif iType == msoComment then
  return msg306_L ;"comment", ; 4,
elif iType == msoFormControl then
  return msg308_L ;"form control", ; 8,
elif iType == msoFreeform then
  return msg309_L ;"freeform", ; 5,
elif iType == msoGroup then
  return msg310_L ;"group", ; 6,
elif iType == msoLine then
  return msg311_L ;"line", ; 9,
elif iType == msoLinkedOLEObject then
  return msg312_L ;"linked OLE object", ; 10,
elif iType == msoLinkedPicture then
  return msg313_L ;"linked picture", ; 11,
elif iType == msoMedia then
  return msg314_L ;"media", ; 16,
elif iType == msoOLEControlObject then
  return msg315_L ;"OLE control object", ; 12,
elif iType == msoPicture then
  return msg316_L ;"picture", ; 13,
elif (iType*-1) == msoShapeTypeMixed then ; must do this since type yields negative 2.
  return msg252m_L ;"shape type mixed", ; -2,
elif iType == msoTextBox then
  return msg317_L ;"text box" ; 17,
elif iType == msoTable then ; 19
	return msg162_L ; table
ElIf iType == MsoHyperlinkShape then
	return msgHyperlink
else
	return shape.name
endIf
EndFunction

String Function GetHyperlinkAddress (object hyperlink)
var
	string address
if hyperlink.address != cscNull then
  let address = hyperlink.address
elif hyperlink.subAddress != cscNull then
  let address = hyperlink.subAddress
endIf
return address
EndFunction

String Function GetShapeSummaryText (object shape)
var
	string altText
if shape.actionSettings(ppMouseOver).action == ppActionHyperlink then
	if ! giObjectOnly then
 		let altText = getHyperlinkAddress (shape.actionSettings(ppMouseOver).hyperlink)
 	EndIf
elif shape.actionSettings(ppMouseClick).action == ppActionHyperlink then
	if ! giObjectOnly then
 		let altText = getHyperlinkAddress (shape.actionSettings(ppMouseClick).hyperlink)
 	EndIf
elif shape.alternativeText != cscNull then
	let altText = shape.alternativeText
else
  let altText = shape.name
endIf
let altText = altText + cscSpace
let altText = AltText + getShapeDescription (shape)
let altText = subString (altText, 1, DlgLstItemMaxLength)
if shape.hasTextFrame then
  if shape.textFrame.hasText then
   	If ! giObjectOnly then
    	return substring (shape.textFrame.TextRange.text, 1, DlgLstItemMaxLength)
    EndIf
  else
    return altText
  endIf
else
  return altText
endIf
EndFunction

string Function getParagraphAlignment (object para)
;optimized during Make Common: rid of unnecessarily repeated object calls.
var
	int nAlignment
let nAlignment = para.paragraphFormat.alignment
if nAlignment == ppAlignCenter then
	return msg71_L
elif nAlignment == ppAlignDistribute then
	return msg72_L
elif nAlignment == ppAlignJustify then
	return msg73_L
elif nAlignment == ppAlignLeft then
	return msg74_L
elif nAlignment < 0 then ; ppAlignmentMixed then
	return msg75_L
elif nAlignment == ppAlignRight then
	return msg76_L
endIf
EndFunction

Int Function getShapeAnimatedParagraphCount (object shape)
var
	int effect,
	int animationStatus,
	int hasTextFrame,
	int hasText
if ! shape then
	return 0
endIf
let effect = shape.animationSettings.textUnitEffect
let animationStatus = shape.animationSettings.animate
let hasTextFrame = shape.hasTextFrame
if hasTextFrame then
	let hasText = shape.textFrame.hasText
endIf
if hasText && animationStatus &&	(effect == ppAnimateByParagraph) then
	return shape.textFrame.textRange.paragraphs.count
else
	return 0
endIf
EndFunction

Int Function getShapeParagraphCount (object shape)
if shape.hasTextFrame then
	if shape.textFrame.hasText then
		return shape.textFrame.textRange.paragraphs.count
	endIf
endIf
return 0
EndFunction

void Function readParagraphs (object shape, int TextOnly, int iRedirectToUserBuffer)
var
	int paraCount,
	int priorLevel,
	int priorAlignment,
	int index,
	int number,;bulleted list with numerical items
	int iBullet,
	object textRange,
	object oParaFormat,
	int indentLevel,
	string sText,
	int iOutputType,
	object oAction,
	object oMouseOver,
	object oMouseClick,
	string Address,
	string subAddress
let giSelectedHyperlink = false
if iRedirectToUserBuffer then
	let iOutputtype = ot_user_buffer
else
	let iOutputtype = ot_line
endIf
let paraCount = shape.textFrame.textRange.paragraphs.count
let index = 1
while (index <= paraCount)
	let textRange = shape.textFrame.textRange.paragraphs(index)
	if textRange.characters.count > 1 then ; non blank para
		let sText = textRange.text
		let oParaFormat = TextRange.paragraphFormat
		if oParaFormat.bullet.visible then
			let iBullet = true
			if (oParaFormat.bullet.type == ppBulletNumbered) then
				let number = oParaFormat.bullet.number
			endIf
		EndIf
		if ! TextOnly then
			let IndentLevel = TextRange.indentLevel
			if priorLevel != indentLevel then
				SayUsingVoiceOrBuffer (VCTX_MESSAGE, formatString (msg69_L, intToString(indentLevel)), iOutputType, textRange)
				let priorLevel = indentLevel
			ElIf priorAlignment != oParaFormat.alignment then
				SayUsingVoiceOrBuffer (VCTX_MESSAGE, getParagraphAlignment(textRange), iOutputType, textRange)
				let priorAlignment = oParaFormat.alignment
			EndIf
		EndIf
		;let oAction=textRange.actionSettings
		;if oAction(ppMouseOver).action == ppActionHyperlink then
			;	let giSelectedHyperlink = true
			;	let oMouseOver = shape.actionSettings(ppMouseOver)
			;	let Address = getHyperlinkAddress (oMouseOver.hyperlink)
			;	let subAddress = oMouseOver.hyperlink.subAddress
			;	let gsAddress = address
			;	let gsSubAddress = subAddress
			;	UserBufferAddText (sText, FormatString (fnMoveToHyperlink,Address),cscNull,
			;		cFont_aerial	,12,attrib_underline,
			;		rgbStringToColor (cColor_blue),
			;		rgbStringToColor (cColor_White),
			;		true, wt_link)
			;elif oAction(ppMouseClick).action == ppActionHyperlink then
			;	let giSelectedHyperlink = true
			;	let oMouseClick = shape.actionSettings(ppMouseClick)
			;	let Address = getHyperlinkAddress (oMouseClick.hyperlink)
			;	let subAddress = oMouseClick.hyperlink.subAddress
			;	let gsAddress = address
			;	let gsSubAddress = subAddress
			;	UserBufferAddText (sText, formatString (fnMoveToHyperlink, Address), cscNull,
			;		cFont_aerial	,12,attrib_underline,
			;		rgbStringToColor (cColor_blue),
			;		rgbStringToColor (cColor_White),
			;		true, wt_link)
		;EndIf
		let LastParaSpokenIndex = index
		if iBullet then
			;Addition for numbered list:
			if number > 0 then
				SayUsingVoiceOrBuffer (vctx_pcCursor, formatString (cStr_MsgNumberedBullet, intToString (number))
				+cscSpace+sText, iOutputType, textRange)
			else
				SayUsingVoiceOrBuffer (vctx_pcCursor, cStr_Bullet+cscSpace+sText, iOutputType, textRange)
			endIf
		Else
			SayUsingVoiceOrBuffer (vctx_pcCursor, sText, iOutputType, textRange)
		EndIf
	EndIf
	let index = index+1
endWhile
EndFunction

Void Function SayShape (object shape, int textOnly, int iRedirectToUserBuffer)
var
	int iOutputType,
	object oAction,
	object s

if iRedirectToUserBuffer then
	let iOutputType = ot_user_buffer
else
	let iOutputType = ot_line ;ot_no_disable before 6.0
endIf
let oAction = oPPT.activeWindow.selection.textRange.actionSettings
;visible is true even if the animation has not appeared.
;visible would have been better described as exists.
if ! shape.visible  then
	return
endIf
if ! TextOnly
|| shape.hasTable
|| shape.type == msoEmbeddedOleObject then
	SayUsingVoiceOrBuffer (VCTX_MESSAGE, GetShapeDescription (shape), iOutputType, null)
	if oAction(ppMouseOver).action == ppActionHyperlink then
		SayUsingVoiceOrBuffer (VCTX_MESSAGE, formatString (msg79_L, getHyperlinkAddress (shape.actionSettings(ppMouseOver).hyperlink())), iOutputType, null)
	elif oAction(ppMouseClick).action == ppActionHyperlink then
		SayUsingVoiceOrBuffer (VCTX_MESSAGE, formatString (msg80_L, getHyperlinkAddress (shape.actionSettings(ppMouseClick).hyperlink)), iOutputType, null)
	endIf
endIf
if shape.HasTextFrame then
	if shape.textFrame.hasText then
		readParagraphs (shape, textOnly, iRedirectToUserBuffer)
	endIf
elif shape.alternativeText != cscNull then
	SayUsingVoiceOrBuffer (vctx_message, shape.alternativeText, iOutputType, null)
elif shape.hasTable then
	readTable (shape.table, globalTableReadingMethod, vctx_message, iRedirectToUserBuffer)
elif shape.type == msoGroup then
	foreach s in shape.groupItems
	if s.HasTextFrame &&  s.textFrame.hasText then
		readParagraphs (s, textOnly, iRedirectToUserBuffer)
	elif s.alternativeText != cscNull then
		SayUsingVoiceOrBuffer (vctx_message, s.alternativeText, iOutputType, null)
	Endif
	endforeach
endIf
EndFunction

string Function getCellCoordinateString ()
var
	int col,
	int row
if (GetCellCoordinates(col,row)) then
	return formatString(msgTableCoordinates1,
	intToString(col), intToString(row))
EndIf
EndFunction

string Function getCellContents ()
return getCell()
EndFunction

int function MagnifySelectedSlide ()
;uses globals already gotten
var
	handle hFocus,
	int nLeft, int nTop, int nRight, int nBottom,
	int nMagLeft, int nMagTop, int nMagRight, int nMagBottom,
	int nMagX,
	int nMagY,
	int bMagnified
let nLeft = gnSlideLeft
Let nTop = gnSlideTop
let nRight = gnSlideRight
let nBottom = gnSlideBottom
if ! gbMagicExists then
	let bMagnified = FALSE
	return bMagnified;
endIf
ConvertRectFromPointsToPixels (nLeft, nTop, nRight, nBottom)
let hFocus = getFocus ()
;make sure all coords 'make it' inside the window's boundaries
;top / left = min, right / bottom = max.
;todo: add fine-tuning later if necessary
let nLeft = min (nLeft, getWindowLeft (hFocus))
let nTop = min (nTop, getWindowTop (hFocus))
let nRight = max (nRight, getWindowRight (hFocus))
let nBottom = max (nBottom, getWindowBottom (hFocus))
MagSetFocusToRect (nLeft, nRight, nTop, nBottom)
;Expect that magnified rect include rect, but may exceed if internal MAG engine does so:
let bMagnified = (nMagLeft <= nLeft && nMagTop <= nTop
&& nMagRight >= nRight && nMagBottom >= nBottom)
return bMagnified
endFunction

int function MagnifySelectedShape ()
;uses globals already gotten
var
	object selection,
	object Shape,
	handle hFocus,
	int nLeft, int nTop, int nRight, int nBottom,
	int nMagLeft, int nMagTop, int nMagRight, int nMagBottom,
	int nMagX,
	int nMagY,
	int bMagnified
if ! gbMagicExists then
	let bMagnified = FALSE
	return bMagnified;
endIf
if isPPTEditMode () then
	;in this case, FS DOM will help the magnifier:
	let bMagnified = MagSetFocusToPoint (getCursorCol (), getCursorRow ())
	return bMagnified;
endIf
let selection = oPPT.ActiveWindow.Selection
let Shape = selection.TextRange;
if shape.characters.count && ! stringIsBlank (shape.text) then
	let nLeft = shape.BoundLeft
	let nTop = shape.BoundTop
	let nRight = nLeft + shape.BoundWidth
	let nBottom = nTop + shape.BoundHeight
else
	let shape = selection.shapeRange(1)
	Let nLeft = shape.left
	Let nTop = shape.top
	let nRight = nLeft + shape.width
	let nBottom = nTop + shape.height
endIf
ConvertRectFromPointsToPixels (nLeft, nTop, nRight, nBottom)
let hFocus = getFocus ()
;make sure all coords 'make it' inside the window's boundaries
;top / left = max, right / bottom = min.
;want rect to be inside window if at all possible
;todo: add fine-tuning later if necessary
let nLeft = max (nLeft, getWindowLeft (hFocus))
let nTop = max (nTop, getWindowTop (hFocus))
let nRight = min (nRight, getWindowRight (hFocus))
let nBottom = min (nBottom, getWindowBottom (hFocus))
MagSetFocusToRect (nLeft, nRight, nTop, nBottom)
let nMagX = (nLeft+nRight)/2 ; center
let nMagY = (nTop+nBottom)/2 ; center
let bMagnified = GetItemRect (nMagX, nMagY, nMagLeft, nMagRight, nMagTop, nMagBottom, IT_MAGNIFIED)
return bMagnified
endFunction

int Function SaySelectedShape ()
var
	object selection,
	object slide,
	int type,
	string smsg;validate we got anything:
dumpNavigationGlobals ()
let selection =oPpt.activeWindow.selection
let slide=oPpt.activeWindow.view.slide
;pause(); No longer need for "hard" pauses.
if !selection then
	updateNavigationGlobals (); get slide info for magnifier:
	return false ;did not say anything
endIf
let type=selection.type
if type==ppSelectionShapes then
	updateNavigationGlobals ()
	MagnifySelectedShape ()
	sayShape(selection.shapeRange(1),false, false)
	if globalDetectOverlappingShapes then
		testShapeOverlap(selection.shapeRange(1),slide.shapes,globalDetectOverlappingShapes,vctx_message)
	endIf
	if globalDetectTextOverflow then
		detectTooMuchInfo(false,true)
	endIf
	return true
elif type==ppSelectionText
&& selection.shapeRange(1).hasTable then
	; say the selected text.
	say(getCellContents(),ot_selected_item,true)
	SayUsingVoice(vctx_message, getCellCoordinateString(), ot_position)
	return true
elif oPpt.activeWindow.activePane.viewType==ppViewOutline then
	SayFormattedMessage(ot_position, formatString(msg69_L, intToString(selection.textRange.indentLevel)))
	return true
endIf
return false
endFunction

object Function GetSlideWithFocus ()
var
	object slide,
	int ViewType
let viewType = oPpt.activeWindow.viewType
if viewType == 0 then
	; try get slide from slide show window of active presentation
  let slide = oPpt.activePresentation.slideShowWindow.view.slide
else
	let slide = oPpt.ActiveWindow.view.slide
endIf
pause ()
if slide then
	return slide
else
	return null
endIf
EndFunction

object Function GetShapeWithFocus ()
Var
	int X,
	int Y,
	object oSlide,
	object oShape
let oSlide = GetSlideWithFocus  ()
If oSlide Then
	let x = GetCursorCol ()
	let y = GetCursorRow ()
	let oShape = oPPT.ActiveWindow.RangeFromPoint(x, y)
	return oShape
EndIf
return Null
EndFunction

void Function updateNavigationGlobals ()
var
	object oFocus,
	object oSlide
;let oFocus = GetShapeWithFocus ()
let oFocus = oPpt.activeWindow.selection.shapeRange(1)
;let oSlide = getSlideWithFocus ()
;use the document window (presentation) for dims%
let oSlide = oPPT.activeWindow.Presentation.PageSetup
let goFocusShape = oFocus
let goFocusSlide = oSlide
let gnLeft = oFocus.Left
let gnTop = oFocus.Top
let gnRight = gnLeft+oFocus.Width
let gnBottom = gnTop+oFocus.Height;
;let gnSlideLeft = oSlide.Left
;0 for points at top and left, that's the edge:
let gnSlideLeft = 0
;let gnSlideTop = oSlide.top
let gnSlideTop = 0
let gnSlideRight = goFocusSlide.SlideWidth
let gnSlideBottom = goFocusSlide.SlideHeight
endFunction

void Function dumpNavigationGlobals ()
let goFocusShape = null
let gnLeft = 0
let gnTop = 0
let gnRight = 0
let gnBottom = 0
let goFocusSlide = null
let gnSlideLeft = 0
let gnSlideTop = 0
let gnSlideRight = 0
let gnSlideBottom = 0
endFunction

int Function getShapeNavInfoBitsAndCoords (int byRef iNavLeft, int byRef iNavTop, int byRef iNavRight, int byRef iNavBottom,
int byRef nExceedslideBounds)
var
	int nBits,
	int nLeft,
	int nTop,
	int nRight,
	int nBottom,
	int nResult,
	string sText;
;update only the iNav* variables that have changed.
let nLeft = goFocusShape.left
let nTop = goFocusShape.top
let nRight = nLeft+goFocusShape.width
Let nBottom = nTop+goFocusShape.height;
;in the following code block, the evaluations are done mainly against the local rect coordinate variable.
;Thus, for x,y of left,top, result is min, while right,bottom result is max.
;Function user should evaluate the returned bits, then one only need check the related coordinates.
if nLeft != gnLeft then
	let nResult = min (nLeft, gnLeft)
	if nResult == nLeft then
		let nBits = (nBits | SHAPE_NAV_LEFT)
		let iNavLeft = (gnLeft-nLeft);
	elif nResult == gnLeft then;it's right
		let nBits = (nBits | SHAPE_NAV_RIGHT)
		let iNavLeft = (nLeft-gnLeft);
	endIf
endIf
if nTop != gnTop then
	let nResult = min (nTop, gnTop)
	if nResult == nTop then
		let nBits = (nBits | SHAPE_NAV_TOP)
		let iNavTop = (gnTop-nTop)
	elif nResult == gnTop then;moved down
		let nBits = (nBits | SHAPE_NAV_BOTTOM)
		let iNavTop = (nTop-gnTop)
	endIf
endIf
;for slide boundary attachment or exceed:
;for left and top, the values are 0 or negative numbers if approaching or exceeding bounds.
;these points are not pixels, see ConvertPointsToPixels for that.
if nLeft <= 0 then
	let nBits = (nBits | SHAPE_NAV_SLIDE_LEFT)
	if nLeft < 0 then
		let nBits = (nBits | SHAPE_NAV_OUT_OF_SLIDE)
		let nExceedslideBounds = (nLeft*-1);convert to positive
	endIf
endIf
if nTop <= 0 then
	let nBits = (nBits | SHAPE_NAV_SLIDE_TOP)
	if nTop < 0 then
		let nBits = (nBits | SHAPE_NAV_OUT_OF_SLIDE)
		let nExceedslideBounds = (nTop*-1); convert to positive.
	endIf
endIf
if nRight >= gnSlideRight then
	let nBits = (nBits | SHAPE_NAV_SLIDE_RIGHT)
	if nRight > gnSlideRight then
		let nBits = (nBits | SHAPE_NAV_OUT_OF_SLIDE)
		let nExceedslideBounds = (nRight-gnSlideRight)
	endIf
endIf
if nBottom >= gnSlideBottom then
	let nBits = (nBits | SHAPE_NAV_SLIDE_BOTTOM)
	if nBottom > gnSlideBottom then
		let nBits = (nBits | SHAPE_NAV_OUT_OF_SLIDE)
		let nExceedslideBounds = (nBottom-gnSlideBottom)
	endIf
endIf
MagnifySelectedShape () ; Make sure as shape moves, it stays under magnifier.
;edge that exceeds bounds will not hurt it as the magnifier sticks to the window.
return nBits;
endFunction

string function getShapeNavInfoString (int navBits, int nLeft, int nTop, int nRight, int nBottom, int nExceedslideBounds)
var
	string sInfo;
if navBits & SHAPE_NAV_LEFT then
	if ! StringIsBlank (sInfo) then
		let sInfo = sInfo + cscBufferNewLine;
	endIf
	let sInfo = sInfo + formatString (msgShapeNavInfo, msgLeft, intToString (nLeft))
endIf
if navBits & SHAPE_NAV_TOP then
	if ! StringIsBlank (sInfo) then
		let sInfo = sInfo + cscBufferNewLine;
	endIf
	let sInfo = sInfo + formatString (msgShapeNavInfo, msgUp, intToString (nTop))
endIf
if navBits & SHAPE_NAV_RIGHT then
	if ! StringIsBlank (sInfo) then
		let sInfo = sInfo + cscBufferNewLine;
	endIf
	let sInfo = sInfo + formatString (msgShapeNavInfo, msgRight, intToString (nLeft))
endIf
if navBits & SHAPE_NAV_BOTTOM then
	if ! StringIsBlank (sInfo) then
		let sInfo = sInfo + cscBufferNewLine;
	endIf
	let sInfo = sInfo + formatString (msgShapeNavInfo, msgDown, intToString (nTop))
endIf
;do slide boundary:
if navBits & SHAPE_NAV_SLIDE_LEFT then
	if ! StringIsBlank (sInfo) then
		let sInfo = sInfo + cscBufferNewLine;
	endIf
	if navBits & SHAPE_NAV_OUT_OF_SLIDE then
		let sInfo = sInfo + formatString (msgShapeOverlapSlide, msgLeft, intToString (nExceedSlideBounds))
	else
		let sInfo = sInfo + formatString (msgAtSlideBoundary, msgLeft)
	endIf
endIf
if navBits & SHAPE_NAV_SLIDE_TOP then
	if ! StringIsBlank (sInfo) then
		let sInfo = sInfo + cscBufferNewLine;
	endIf
	if navBits & SHAPE_NAV_OUT_OF_SLIDE then
		let sInfo = sInfo + formatString (msgShapeOverlapSlide, msgTop, intToString (nExceedSlideBounds))
	else
		let sInfo = sInfo + formatString (msgAtSlideBoundary, msgTop)
	endIf
endIf
if navBits & SHAPE_NAV_SLIDE_RIGHT then
	if ! StringIsBlank (sInfo) then
		let sInfo = sInfo + cscBufferNewLine;
	endIf
	if navBits & SHAPE_NAV_OUT_OF_SLIDE then
		let sInfo = sInfo + formatString (msgShapeOverlapSlide, msgRight, intToString (nExceedSlideBounds))
	else
		let sInfo = sInfo + formatString (msgAtSlideBoundary, msgRight)
	endIf
endIf
if navBits & SHAPE_NAV_SLIDE_BOTTOM then
	if ! StringIsBlank (sInfo) then
		let sInfo = sInfo + cscBufferNewLine;
	endIf
	if navBits & SHAPE_NAV_OUT_OF_SLIDE then
		let sInfo = sInfo + formatString (msgShapeOverlapSlide, msgBottom, intToString (nExceedSlideBounds))
	else
		let sInfo = formatString (msgAtSlideBoundary, msgBottom)
	endIf
endIf
return sInfo
endFunction

String Function GetSlideHeader (object slide)
if slide.HeadersFooters.header.visible() then
  return slide.headersFooters.header.text()
else
  return slide.name()
endIf
EndFunction

string function getSlideName ()
return getSlideWithFocus ().name
endFunction

String Function GetSlideTitleOrIndexNumber (object slide)
var
	object shape,
	string sTitle,
	String SIndex
let shape = slide.shapes.title
if getActivePaneView () == ppViewSlideMaster then
	let sTitle = slide.name
else
	let sTitle = shape.textFrame.textRange.text
endIf
let sIndex = IntToString (slide.slideIndex)
;if sTitle==cscNull then;`can be invalid:
if StringIsBlank (sTitle) then
  let sIndex = formatString (msg42_L, sIndex)
  Let sTitle = sIndex
Else ; don't do index, as that's doneby xOfY:
	;let sTitle = formatString(msg42_L, sIndex)+cscSpace+sTitle
	let sTitle = (formatString(msgSlideTitle, sTitle))
endIf
return sTitle
EndFunction

string Function GetCurrentSlideTitleOrNumber ()
var
	object slide,
	object shape,
	string tempStr
let slide = getSlideWithFocus ()
let shape = slide.shapes.title()
let TempStr = shape.textFrame.textRange.text()
if tempStr == cscNull then
  let TempStr = formatString (msg42_L, intToString (slide.slideIndex()))
endIf
return tempStr
EndFunction

string Function GetCurrentSlideNotesAndCommentsInfo ()
;Indicate there are one or more, e.g. 'Contains comments'
var
	object slide,
	int nComments,
	int nNotes,
	string sResult
let slide = getSlideWithFocus ()
Let nComments = slide.comments.count
let nNotes = slide.notesPage.count
if nNotes == 1 then
	;make sure there are actually notes (text) present:
	;The second shape on the notes page (a companion slide object) will contain text.
	let nNotes = slide.notesPage.item(nNotes).shapes.item(2).textFrame.textRange.paragraphs(1).characters.count
	;let nNotes = slide.notesPage.item(nNotes).shapes.count
endIf
if nNotes && nComments then
	let sResult = msgHasNotesAndComments
elIf nComments then
	let sResult = msgHasComments
elIf nNotes then
	let sResult = msgHasNotes
endIf
return sResult;
endFunction

string Function GetSlideFooter (object slide)
if slide.HeadersFooters.footer.visible then
	return slide.headersFooters.footer.text()
else
  return cscNull
endIf
EndFunction

String Function GetSlideDateAndTime (object slide)
if slide.HeadersFooters.dateAndTime.visible then
  return slide.headersFooters.DateAndTime.text()
else
  return cscNull
endIf
EndFunction

String Function GetSlideEntryEffect (object slide)
var
	int entryEffect
let entryEffect = slide.slideShowTransition.entryEffect
if EntryEffect == ppEffectAppear then
	return msg341_L
elif EntryEffect == ppEffectBlindsHorizontal then
	return msg342_L
elif EntryEffect == ppEffectBlindsVertical then
	return msg343_L
elif EntryEffect == ppEffectBoxIn then
	return msg344_L
elif EntryEffect == ppEffectBoxOut then
	return msg345_L
elif EntryEffect == ppEffectCheckerboardAcross then
	return msg346_L
elif EntryEffect == ppEffectCheckerboardDown then
	return msg347_L
elif EntryEffect == ppEffectCoverDown then
	return msg348_L
elif EntryEffect == ppEffectCoverLeft then
	return msg349_L
elif EntryEffect == ppEffectCoverLeftDown then
	return msg350_L
elif EntryEffect == ppEffectCoverLeftUp then
	return msg351_L
elif EntryEffect == ppEffectCoverRight then
	return msg352_L
elif EntryEffect == ppEffectCoverRightDown then
	return msg353_L
elif EntryEffect == ppEffectCoverRightUp then
	return msg354_L
elif EntryEffect == ppEffectCoverUp then
	return msg355_L
elif EntryEffect == ppEffectCrawlFromDown then
	return msg356_L
elif EntryEffect == ppEffectCrawlFromLeft then
	return msg357_L
elif EntryEffect == ppEffectCrawlFromRight then
	return msg358_L
elif EntryEffect == ppEffectCrawlFromUp then
	return msg359_L
elif EntryEffect == ppEffectCut then
	return msg360_L
elif EntryEffect == ppEffectCutThroughBlack then
	return msg361_L
elif EntryEffect == ppEffectDissolve then
	return msg362_L
elif EntryEffect == ppEffectFade then
	return msg363_L
elif EntryEffect == ppEffectFlashOnceFast then
	return msg364_L
elif EntryEffect == ppEffectFlashOnceMedium then
	return msg365_L
elif EntryEffect == ppEffectFlashOnceSlow then
	return msg366_L
elif EntryEffect == ppEffectFlyFromBottom then
	return msg367_L
elif EntryEffect == ppEffectFlyFromBottomLeft then
	return msg368_L
elif EntryEffect == ppEffectFlyFromBottomRight then
	return msg369_L
elif EntryEffect == ppEffectFlyFromLeft then
	return msg370_L
elif EntryEffect == ppEffectFlyFromRight then
	return msg371_L
elif EntryEffect == ppEffectFlyFromTop then
	return msg372_L
elif EntryEffect == ppEffectFlyFromTopLeft then
	return msg373_L
elif EntryEffect == ppEffectFlyFromTopRight then
	return msg374_L
;elif EntryEffect == ppEffectMixed
;	then return msg494_L
elif EntryEffect == ppEffectNone then
	return msg375_L
elif EntryEffect == ppEffectPeekFromDown then
	return msg376_L
elif EntryEffect == ppEffectPeekFromLeft then
	return msg377_L
elif EntryEffect == ppEffectPeekFromRight then
	return msg378_L
elif EntryEffect == ppEffectPeekFromUp then
	return msg379_L
elif EntryEffect == ppEffectRandom then
	return msg380_L
elif EntryEffect == ppEffectRandomBarsHorizontal then
	return msg381_L
elif EntryEffect == ppEffectRandomBarsVertical then
	return msg382_L
elif EntryEffect == ppEffectSpiral then
	return msg383_L
elif EntryEffect == ppEffectSplitHorizontalIn then
	return msg384_L
elif EntryEffect == ppEffectSplitHorizontalOut then
	return msg385_L
elif EntryEffect == ppEffectSplitVerticalIn then
	return msg386_L
elif EntryEffect == ppEffectSplitVerticalOut then
	return msg387_L
elif EntryEffect == ppEffectStretchAcross then
	return msg388_L
elif EntryEffect == ppEffectStretchDown then
	return msg389_L
elif EntryEffect == ppEffectStretchLeft then
	return msg390_L
elif EntryEffect == ppEffectStretchRight then
	return msg391_L
elif EntryEffect == ppEffectStretchUp then
	return msg392_L
elif EntryEffect == ppEffectStripsDownLeft then
	return msg393_L
elif EntryEffect == ppEffectStripsDownRight then
	return msg394_L
elif EntryEffect == ppEffectStripsLeftDown then
	return msg395_L
elif EntryEffect == ppEffectStripsLeftUp then
	return msg396_L
elif EntryEffect == ppEffectStripsRightDown then
	return msg397_L
elif EntryEffect == ppEffectStripsRightUp then
	return msg398_L
elif EntryEffect == ppEffectStripsUpLeft then
	return msg399_L
elif EntryEffect == ppEffectStripsUpRight then
	return msg400_L
elif EntryEffect == ppEffectSwivel then
	return msg401_L
elif EntryEffect == ppEffectUncoverDown then
	return msg402_L
elif EntryEffect == ppEffectUncoverLeft then
	return msg403_L
elif EntryEffect == ppEffectUncoverLeftDown then
	return msg404_L
elif EntryEffect == ppEffectUncoverLeftUp then
	return msg405_L
elif EntryEffect == ppEffectUncoverRight then
	return msg406_L
elif EntryEffect == ppEffectUncoverRightDown then
	return msg407_L
elif EntryEffect == ppEffectUncoverRightUp then
	return msg408_L
elif EntryEffect == ppEffectUncoverUp then
	return msg409_L
elif EntryEffect == ppEffectWipeDown then
	return msg410_L
elif EntryEffect == ppEffectWipeLeft then
	return msg411_L
elif EntryEffect == ppEffectWipeRight then
	return msg412_L
elif EntryEffect == ppEffectWipeUp then
	return msg413_L
elif EntryEffect == ppEffectZoomBottom then
	return msg414_L
elif EntryEffect == ppEffectZoomCenter then
	return msg415_L
elif EntryEffect == ppEffectZoomIn then
	return msg416_L
elif EntryEffect == ppEffectZoomInSlightly then
	return msg417_L
elif EntryEffect == ppEffectZoomOut then
	return msg418_L
elif EntryEffect == ppEffectZoomOutSlightly then
	return msg419_L
endIf
EndFunction

void Function SayCurrentSlideTransition ()
var
	object slide,
 object oTransition
let slide = getSlideWithFocus ()
BeginFlashMessage ()
SayFormattedMessageWithVoice (vctx_message, ot_help, formatString (msg47_L, GetSlideEntryEffect (slide)), formatString (msg47_S, GetSlideEntryEffect (slide)))
let oTransition = slide.slideshowTransition
if oTransition.advanceOnClick then
  SayUsingVoice (vctx_message, msg43_L, ot_help) ; advances on mouse click
elif oTransition.advanceOnTime then
  SayFormattedMessageWithVoice (vctx_message, ot_help, formatString (msg46_L, intToString (oTransition.advanceTime)), formatString (msg46_S, intToString (OTransition.advanceTime)))
endIf
if oTransition.hidden then
	SayFormattedMessageWithVoice (vctx_message, ot_help, msgSlideHidden_l, msgSlideHidden_s)
EndIf
EndFlashMessage ()
EndFunction

void function ReloadSlideShowScreen ()
var
	object oSlide
let oSlide = getSlideWithFocus ()
readSlideUpToShapeAndPara (oSlide, lastShapeSpokenIndex, lastParaSpokenIndex, true, true)
endFunction

Void Function readSlideUpToShapeAndPara (object slide, int lastShapeIndex, int lastParaIndex, int textOnly, int iRedirectToUserBuffer)
var
	string sText,
	int iOutputtype,
	object shape,
	object textRange,
	int shapeIndex,
	int paraIndex,
	int priorAlignment,
	int priorLevel,
	int lastParaToRead ; index of the last para to read for the current shape
if iRedirectToUserBuffer then
	let iOutputtype = ot_user_buffer
else
	let iOutputtype = ot_line ; ot_no_disable before 6.0
endIf
let shapeIndex = 1
while shapeIndex <= lastShapeIndex
	let shape = slide.shapes(shapeIndex)
	if ! TextOnly
	|| shape.hasTable
	|| shape.type == msoEmbeddedOleObject then
		SayUsingVoiceOrBuffer (vctx_message, getShapeDescription (shape), iOutputType, null)
	endIf
	if shape.hasTextFrame then
		if shape.TextFrame.hasText then
			let paraIndex = 1
			if shapeIndex == lastShapeIndex then
				let lastParaToRead = lastParaIndex
			else ; last para in shape
				let lastParaToRead = shape.textFrame.textRange.paragraphs.count
			endIf
			while (paraIndex <= lastParaToRead)
				let textRange = shape.textFrame.textRange.paragraphs(paraIndex)
				if textRange.characters.count > 1 then
					if textRange.paragraphFormat.bullet.visible then
						let sText = textRange.text
						SayUsingVoiceOrBuffer (vctx_pcCursor, cStr_Bullet+cscSpace+sText, iOutputtype, textRange)
					else
						SayUsingVoiceOrBuffer (vctx_pcCursor, textRange.text, iOutputtype, textRange)
					endIf
				endIf
				let paraIndex = paraIndex+1
			endWhile
		endIf
	endIf
	let shapeIndex = shapeIndex+1
endWhile
EndFunction

void Function ReadSlide (object slide, int TextOnly, int upToShapeIndex, int upToParaIndex)
var
	object shape,
	object titleShape,
	int ShapeCount,
	int Index,
	string sShapeName,
	string sTitleShapeName
let Index = 1
if upToShapeIndex > 0 then
	let shapeCount = upToShapeIndex
else
	let shapeCount = slide.shapes.count()
endIf
; Say the title first and mark the shape so it is not repeated
let titleShape = slide.shapes.title
Let sTitleShapeName = titleShape.name
SayShape (titleShape, textOnly, false)
while (Index <= ShapeCount)
	let shape = slide.shapes(Index)
	let sShapeName = shape.name
	; skip the title shape
	if sShapeName != sTitleShapeName then
		;sayShape (slide.shapes(Index), textOnly, false)
		sayShape (shape, textOnly, false)
	endIf
	;pause ()
	let Index = (Index+1)
EndWhile
EndFunction

void function ReadCurrentSlide ()
var
	object slide
let slide = getSlideWithFocus ()
if ! slide then
  SayMessage (ot_error, msg88_L) ; cannot use this function in this view.
  return
endIf
ReadSlide (slide, false, 0, 0)
EndFunction

string function GetFrameTutorMessage ()
var
	object selection,
	int type
if (getWindowClass (getCurrentWindow ()) != wcPaneClassDC)
	return GetFrameTutorMessage ()
endIf
if getActivePaneView () == ppViewMasterThumbnails then
	return GetFrameTutorMessage ()
endIf
selection = oPpt.activeWindow.selection
type = selection.type
if type == ppSelectionShapes
|| (! type && oPpt.activeWindow.selection) then
	if selection.shapeRange.count <= 0 then
		return msgTutorSelectAnObject
	endIf
endIf
return GetFrameTutorMessage ()
endFunction

void function SaySelectedObject (int bSpell)
var
	object selection,
	int type,
	int index,
	int count
let selection = oPpt.activeWindow.selection
if ! selection
&& getCharacterAttributes () == attrib_highlight then
	performScript saySelectedText () ; default
	return
endIf
if getActivePaneView () == ppViewMasterThumbnails then
	;Say (getSlideTitleOrIndexNumber (oPpt.activeWindow.Presentation.SlideMaster.shapes.title.name), ot_line);No object info from thumbnails.
	SayMessage (OT_ERROR, msgSlideMasterThumbnailsTab)
	Return
endIf
let type = selection.type
if type == ppSelectionSlides then
	; Slide Sorter or Thumbnails View
	let count = selection.slideRange.count
	if count > 1 then
		SayMessage (ot_selected_item, msgSelectedSlides1_L)
	endIf
	let index = 1
	while index <= count
		SayFormattedMessage (ot_item_number, intToString (selection.slideRange(index).slideIndex))
		if bSpell && isSameScript () then
			SpellString (getSlideTitleOrIndexNumber (selection.slideRange(index)))
		else
			Say (getSlideTitleOrIndexNumber (selection.slideRange(index)), ot_line)
		endIf
		let index = (index+1)
	endWhile
elif type == ppSelectionShapes then
	if selection.shapeRange.count > 0 then
		sayShape (selection.shapeRange(1),false, false)
	else
		SayMessage (ot_error, msg86_L) ; no selection
	endIf
elif type == ppSelectionText then
	if selection.textRange.characters.count > 0 then
		SayFormattedMessage (ot_selected_item, formatString (cmsg39_L, selection.textRange.text()))
	else
		SayMessage (ot_error, cmsgNothingSelected) ; no selection
	endIf
else
	SayMessage (ot_error, msg86_L) ; no selection
endIf
EndFunction

string Function GetSlideLayout (object slide)
var
	int layout
;property or method, based on version;
let layout = slide.layout || slide.layout()
if layout == Blank then
  return cmsgBlank1 ; "blank"
elif layout == Chart then
  return msg122_L ; "chart"
elif layout == ChartAndTxt then
  return msg123_L ; "chart and text"
elif layout == ClipartAndTxt then
  return msg124_L ; "clipart and text"
elif layout == ClipArtAndVerticalTxt then
  return msg125_L ; "clipart and vertical text"
elif layout == FourObjs then
  return msg126_L ; "four objects"
elif layout == LargeObj then
  return msg127_L ; "large object"
elif layout == MediaClipAndTxt then
  return msg128_L ; "media clip and text"
;elif layout == Mixed then ; negative constant
;  return msg135_L ; "mixed"
elif layout == Obj then
  return msg129_L ; "object"
elif layout == ObjAndTxt then
  return msg130_L ; "object and text"
elif layout == ObjOverTxt then
  return msg131_L ; "object over text"
elif layout == Orgchart then
  return msg132_L ; "Org Chart"
elif layout == TableSlide then
  return msg133_L ; "table"
elif layout == Txt then
  return msg134_L ; "text"
elif layout == TxtAndChart then
  return msg135_L ; "text and chart"
elif layout == TxtAndClipart then
  return msg136_L ; "text and clipart"
elif layout == TxtAndMediaClip then
  return msg137_L ; "text and media clip"
elif layout == TxtAndObj then
  return msg138_L ; "text and object"
elif layout == TxtAndTwoObjs then
  return msg139_L ; "text and two objects"
elif layout == TxtOverObj then
  return msg140_L ; "text over object"
elif layout == Title then
  return msg141_L ; "title"
elif layout == TitleOnly then
  return msg142_L ; "title only"
elif layout == TwoColumnTxt then
  return msg143_L ; "two column text"
elif layout == TwoObjsAndTxt then
  return msg144_L ; "two objects and text"
elif layout == TwoObjsOverTxt then
  return msg145_L ; "two objects over text"
elif layout == VerticalTxt then
  return msg146_L ; "vertical text"
elif layout == VerticalTitleAndTxt then
  return msg147_L ; "vertical title and text"
elif layout == VerticalTitleAndTxtOverChart then
  return msg148_L ; "vertical title and text over chart"
elif Layout == comparison then
  return msgLayoutComparison
ElIf layout == ContentWithCaption then
	return msgLayoutContentWithCaption
elIf layout == Custom then
	return msgLayoutCustom
elIf layout == PictureWithCaption then
	return msgLayoutPictureWithCaption
elIf layout == SectionHeader then
	return msgLayoutSectionHeader
elif layout == ObjAndTwoObjs then
	return msgLayoutObjAndTwoObjs
elIf layout == TwoObjs then
	return msgLayoutTwoObjs
elIf layout == TwoObjsAndObj then
	return msgLayoutTwoObjsAndObj
endIf
EndFunction

Void Function SayCurrentSlideLayout (Optional Int iOutputType)
var
	object slide
let slide = getSlideWithFocus ()
if (! slide) then
	SayMessage (ot_error, msg88_L) ; cannot use this function in this view.
	return
endIf
If Not iOutputType
	iOutputType = OT_SMART_HELP
EndIf
if slide.layout !=0 then
	SayOrBufferFormattedMessage (iOutputType,
	formatString (msg121_L, GetSlideLayout (slide)),
	formatString (msg121_S, GetSlideLayout (slide))
	,null)
endIf
EndFunction

void function selectShape ()
var
	object shape,
	int shapeIndex,
	string ShapeList,
	int shapeCount,
	int ShapeToSelect,
	object slide
if isSlideShow () then
	SayMessage (ot_error, msg88_L) ; cannot use this function in this view.
	return
endIf
let slide = getSlideWithFocus ()
if ! slide then
  SayMessage (ot_error, msg88_L) ; cannot use this function in this view.
  return
endIf
let shapeCount = slide.shapes.count
if ! shapeCount then
  SayMessage (ot_error, msg77_L) ; no shapes
  return
endIf
let shapeIndex = 1
while (shapeIndex <= ShapeCount)
  let shape = slide.shapes(shapeIndex)
  let shapeList = ShapeList + list_item_separator + GetShapeSummaryText (shape)
  let ShapeIndex = ShapeIndex + 1
EndWhile
; remove leading delimiter to avoid empty item
let shapeList = stringChopLeft (shapeList, 1)
let shapeToSelect =DlgSelectItemInList (ShapeList, msg78_L, false)
if shapeToSelect > 0 then
  slide.shapes(shapeToSelect).select
endIf
EndFunction

void function SelectHyperlink ()
var
	object hyperlink,
	string address,
	string SubAddress,
	string linkTitle,
	int Index,
	string LinkList,
	string AddressList,
	int Count,
	int LinkSelected,
	object slide
if isSlideShow () then
	SayMessage (ot_error, msg88_L) ; cannot use this function in this view.
	return
endIf
let slide = getSlideWithFocus ()
if ! slide then
  SayMessage (ot_error, msg88_L) ; cannot use this function in this view.
  return
endIf
let Count = slide.hyperlinks.count()
if Count < 1 then
  SayMessage (ot_error, msg81_L) ; no hyperlinks on slide
  return
endIf
let Index = 1
while (Index <= Count)
  let hyperlink = slide.hyperlinks(Index)
  let address = GetHyperlinkAddress (hyperlink)
  let linkTitle = hyperlink.TextToDisplay
  if stringIsBlank (linkTitle) then linkTitle = address endIf
  let AddressList = AddressList + list_item_separator + address
  let LinkList = LinkList+list_item_separator+linkTitle 
  let Index = Index + 1
EndWhile
; remove leading delimiter to avoid empty item
let LinkList = stringChopLeft (LinkList, 1)
let AddressList = stringChopLeft (AddressList, 1)
let LinkSelected = DlgSelectItemInList (LinkList, msg82_L, false)
if linkSelected > 0 then
	let address = slide.hyperlinks(linkSelected).address
	let subAddress = slide.hyperlinks(linkSelected).SubAddress
	oPpt.activePresentation.followHyperlink(address,subAddress)
endIf
EndFunction

void function FollowSelectedHyperlink ()
var
	string address,
	string subAddress,
	int HyperlinkCount,
	int index,
	object shape,
	object hyperlink,
	object slide
If OPpt.activeWindow.selection.type == ppSelectionShapes then
	Let slide = GetSlideWithFocus ()
	; check for number of hyperlinks on slide.
	let HyperlinkCount = slide.hyperlinks.count()
	If HyperlinkCount > 1 then
		; let user select from the list of hyperlinks on the slide.
		SelectHyperlink ()
		return
	Else
		let hyperlink = slide.hyperlinks(1)
	EndIf
	if shape.actionSettings(ppMouseOver).action == ppActionHyperlink then
		let address = shape.actionSettings(ppMouseOver).hyperlink.address
		let SubAddress = shape.actionSettings(ppMouseOver).hyperlink.SubAddress
		oPpt.activePresentation.followHyperlink(address,subAddress)
		pause ()
		Say (GetSlideTitleOrIndexNumber (slide), ot_line)
	elif shape.actionSettings(ppMouseClick).action == ppActionHyperlink then
		let address = shape.actionSettings(ppMouseClick).hyperlink.address
		let SubAddress = shape.actionSettings(ppMouseClick).hyperlink.SubAddress
		oPpt.activePresentation.followHyperlink(address,subAddress)
		pause ()
		Say (GetSlideTitleOrIndexNumber (slide),ot_line)
	ElIf GetHyperlinkAddress (hyperlink) then
		let address = hyperlink.address
		let subAddress = hyperlink.SubAddress
		oPpt.activePresentation.followHyperlink(address,subAddress)
		Pause ()
		Say (GetSlideTitleOrIndexNumber (slide), ot_line)
	else
		SayMessage (ot_error, msg83_L) ; this shape is not a hyperlink
	endIf
else
	SayMessage (ot_error, msg83_L) ; this shape is not a hyperlink
EndIf
EndFunction

void function saySlideTitleOrIndexNumber (optional int bSpellOnQuickChange)
var
	object slide

if GetActivePaneView () == ppViewThumbnails
|| GetActivePaneView () == ppViewMasterThumbnails then
	SaySelectedObject (bSpellOnQuickChange); ferry the data from here to there but TRUE in this case will result in not spelling the data.
	return
endIf
let slide = getSlideWithFocus ()
if slide.slideIndex > 0  || getActivePaneView () == ppViewSlideMaster then
	if bSpellOnQuickChange && isSameScript () then
		SpellString (GetSlideTitleOrIndexNumber (slide))
	Else
		Say (GetSlideTitleOrIndexNumber (slide), ot_LINE)
		say (GetCurrentSlideNotesAndCommentsInfo (), OT_JAWS_MESSAGE)
	EndIf
endIf
EndFunction

string function GetAdditionalFontInfo (object oTextRange)
var
	string sText
Let sText = oTextRange.font.Name
if ! sText then
	;todo: get another name, another means
endIf
return formatString (msgFontInfo, sText, oTextRange.font.size)
endFunction

int function ButtonIsPressed (object controls, string strButtonName)
var
	int nResult
let nResult = controls(strButtonName).state()
if (nResult < 0) then
	return TRUE
else
	return FALSE
endIf
EndFunction

void function PPTScreenSensitiveHelp ()
var
	object oActiveWindow,
	object oSelection,
	int iPaneType,
	int iType,
	int iViewtype,
	int iSpeak,
	string sText,
	handle focus,
	string focusClass,
	object slide,
	int shapeCount,
	int hyperlinkCount,
	int expandAllState, ; outline view
	int collapseAllState, ; outline view
	String sSlideNumber,
	string sShapeCount
; This may not be the first text to go into the user buffer,
; so see if the buffer is active first:
if ! (getRunningFSProducts () & product_JAWS) then
	Return
endIf
if UserBufferIsActive () then
	UserBufferClear ()
	let giUserBufferWaitingForText = TRUE
EndIf
let iSpeak = ShouldItemSpeak (OT_HELP)
let focus = getFocus ()
let focusClass = getWindowClass (focus)
if focusClass == wcPaneClassDC then
	; next if condition should not be necessary but app obj is not always obtained properly during autostart.
	if ! oPpt then
		;Speak error message, then initialize the object
		SayMessage (OT_ERROR, msg32_L) ; didn't get app obj etc	return
		let oPpt = null
		initPptAppObj()
	endIf
	let slide = GetSlideWithFocus ()
	let sSlideNumber = intToString (slide.slideIndex)
	let oActiveWindow = oPPT.ActiveWindow
	let oSelection = oActiveWindow.selection
	let iViewType = oActiveWindow.viewtype
	let iPaneType = oActiveWindow.activePane.viewType
	let iType = oActiveWindow.view.type
	if oSelection.type == ppSelectionText
	&& iPaneType != ppViewNotesPage then
		if isCaretInTable () then
			let sText = formatString (msg26_L, getCellCoordinateString (), getTableDimensions (oPpt.activeWindow.selection.shapeRange(1).table))
		else
			If iPaneType == ppViewOutline
				if iSpeak == message_long then
					let sText = formatString (msg25_L, msg335_L)
				else
					let sText = formatString (msg25_S, msg335_S)
				EndIf
			Else
				if iSpeak == message_long then
					let sText = formatString (msg25_L, getShapeDescription (oSelection.textrange.parent.parent))
				else
					let sText = formatString (msg25_S, getShapeDescription (oSelection.textrange.parent.parent))
				EndIf
			EndIf
		endIf
		detectTooMuchInfo (true, true)
		UserBufferAddText (sText)
		userBufferAddText (cscBufferNewLine + cmsgBuffexit)
		UserBufferActivate ()
		let giUserBufferWaitingForText = FALSE
		JAWSTopOfFile ()
		SayAll ()
		return
	endIf
	if isSlideShowDone () then
		UserBufferAddText (msg49_L)
		userBufferAddText (cscBufferNewLine + cmsgBuffexit)
		UserBufferActivate ()
		let giUserBufferWaitingForText = FALSE
		JAWSTopOfFile ()
		SayAll ()
		return
	endIf
	if iSpeak == message_long then
		UserBufferAddText (formatString (msg27_L, getPPTView ()))
	else
		UserBufferAddText (formatString (msg27_S, getPPTView ()))
	EndIf
	if iPaneType == ppViewNotesPage then
		userBufferClear ()
		userBufferDeactivate ()
		UserBufferAddText (formatString (msgScreenSensitiveHelpNotesPane, sSlideNumber)) ; notes page for
		userBufferAddText (cscBufferNewLine + cmsgBuffexit)
		UserBufferActivate ()
		let giUserBufferWaitingForText = FALSE
		JAWSTopOfFile ()
		SayAll ()
		return
	elif iPaneType == ppViewOutline then
		; say the state of the outline view
		let expandAllState = oPpt.commandBars(cbOutlining).controls(btnExpandAll).state
		let collapseAllState = oPpt.commandBars(cbOutlining).controls(btnCollapseAll).state
		if expandAllState
		&& ! collapseAllState then
			; Expand All
			if iSpeak == message_long then
				UserBufferAddText (msgOutlineViewStateExpanded1_L)
			else
				UserBufferAddText (msgOutlineViewStateExpanded1_S)
			EndIf
		elif collapseAllState
		&& ! expandAllState then
			; Collapse all
			if iSpeak == message_long then
				UserBufferAddText (msgOutlineViewStateCollapsed1_L)
			else
				UserBufferAddText (msgOutlineViewStateCollapsed1_S)
			EndIf
		endIf
		UserBufferAddText (FormatString (msgOutlineViewScreenSensitiveHelp, sSlideNumber))
		userBufferAddText (cscBufferNewLine + cmsgBuffexit)
		UserBufferActivate ()
		let giUserBufferWaitingForText = FALSE
		JAWSTopOfFile ()
		SayAll ()
		return
	elif iType == ppViewSlideSorter then
		if iSpeak == message_long then
			UserBufferAddText (msg22_L)
		else
			UserBufferAddText (msg22_S)
		EndIf
		userBufferAddText (cscBufferNewLine + cmsgBuffexit)
		UserBufferActivate ()
		let giUserBufferWaitingForText = FALSE
		JAWSTopOfFile ()
		SayAll ()
		return
	ElIf iPaneType ==	ppViewThumbnails || iPaneType == ppViewMasterThumbnails then
		UserBufferAddText (FormatString(msgScreenSensitiveHelpThumbnails))
		userBufferAddText (cscBufferNewLine+cmsgBuffexit)
		UserBufferActivate ()
		let giUserBufferWaitingForText = FALSE
		JAWSTopOfFile ()
		SayAll ()
		Return
	elif iType == 0 then
		if ! isSlideShow () then
			saySlideShowState ()
			UserBufferAddText (msg48_L) ; press any key to return to the prior view.
			userBufferAddText (cscBufferNewLine + cmsgBuffexit)
			UserBufferActivate ()
			let giUserBufferWaitingForText = FALSE
			JAWSTopOfFile ()
			SayAll ()
			return
		endIf
	endIf
;	**
	if iPaneType == ppViewSlide then
		UserBufferAddText (FormatString (msgScreenSensitiveHelpSlideArea, sSlideNumber))
		sayCurrentSlideLayout ()
		let ShapeCount = slide.shapes.count()
		if shapeCount > 0 then
			; Say the slide contains x shapes:
			let sShapeCount = intToString (shapeCount)
		EndIf
 		if OSelection.type == PPSelectionShapes then
			if iSpeak == message_long then
				UserBufferAddText (formatString (msg20_L, GetShapeDescription(OSelection.shapeRange(1))))
			else
				UserBufferAddText (formatString (msg20_S, GetShapeDescription (OSelection.shapeRange(1))))
			EndIf
			detectTooMuchInfo (true, true)
		elif iViewType != 0 then ; no shape selected
			; Say you are at the object level:
			if iSpeak == message_long then
				UserBufferAddText (FormatString (msg21_L, sShapeCount))
			else
				UserBufferAddText (FormatString (msg21_S, sShapeCount))
			EndIf
		endIf
		let hyperlinkCount = slide.hyperlinks.count
		if hyperlinkCount > 0 then
			; Say the slide contains x hyperlinks:
			if iSpeak == message_long then
				UserBufferAddText (formatString (msg41_L, intToString (hyperlinkCount)))
			else
				UserBufferAddText (formatString (msg41_S, intToString (hyperlinkCount)))
			EndIf
		endIf
		UserBufferAddText (msg29_l)
	EndIf
elif focusClass == wcExcel7 then
	if oSelection.shapeRange(1).oleFormat.object.application.activeChart then
		readExcelChart ()
	else
		; you are in an embedded:
		if iSpeak == message_long then
			UserBufferAddText (msg14_L)
		else
			UserBufferAddText (msg14_S)
		EndIf
	endIf
endIf
userBufferAddText (cscBufferNewLine + cmsgBuffexit)
UserBufferActivate ()
let giUserBufferWaitingForText = FALSE
JAWSTopOfFile ()
SayAll ()
EndFunction

int function isSlideActive ()
var
	object slide
let slide = getSlideWithFocus ()
if slide then
	return true
else
	return false
endIf
endFunction

int function isValidView ()
return oPpt.activeWindow.viewType > 0
endFunction

int function isSlideShowFullScreen ()
return oPpt.activePresentation.slideShowWindow.isFullScreen
endFunction

int Function getFirstAnimatedShapeIndex (object slide)
var
	object shapeAnimationSettings,
	int index,
	int count
let index = 1
let count = slide.shapes.count
while (index <= count)
	let shapeAnimationSettings = slide.shapes(index).animationSettings
	if shapeAnimationSettings.animate &&
	shapeAnimationSettings.textLevelEffect != ppAnimateLevelNone &&
	shapeAnimationSettings.animationOrder == 1 then
		return index
	endIf
	let index = (index+1)
endWhile
return 0
EndFunction

int Function getLastAnimatedShapeIndex (object slide)
var
	object shapeAnimationSettings,
	int index,
	int tmpIndex,
	int count
let index = 1
let tmpIndex = 0
let count = slide.shapes.count
let tmpIndex = getFirstAnimatedShapeIndex (slide)
if tmpIndex == 0 then
	return 0
endIf
while (index <= count)
	let shapeAnimationSettings = slide.shapes(index).animationSettings
	if shapeAnimationSettings.animate
	&& shapeAnimationSettings.textLevelEffect != ppAnimateLevelNone then
		if slide.shapes(tmpIndex).animationSettings.animationOrder <= shapeAnimationSettings.animationOrder then
			let tmpIndex = index
		endIf
	endIf
	let index = (index+1)
endWhile
return tmpIndex
EndFunction

int Function getAnimatedShapeCount (object slide)
var
	int index,
	int count,
	int animatedShapes,
	object shapeAnimationSettings
let index = 1
let count = slide.shapes.count
let animatedShapes = 0
while (index <= count)
	let shapeAnimationSettings = slide.shapes(index).animationSettings
	if shapeAnimationSettings.animate
	&& shapeAnimationSettings.textLevelEffect != ppAnimateLevelNone then
		let animatedShapes = animatedShapes + 1
	endIf
	let index = index + 1
endWhile
return animatedShapes
EndFunction


Int Function getNextAnimatedShapeIndex (object startingShape)
var
	object slide,
	int endIndex,
	int index,
	int startIndex,
	int tmpIndex, ; will hold the index of the next animated shape at the end
	string name,
	object shape,
	int order
let slide = startingShape.parent
let startIndex = 1
let index = startIndex
let endIndex = slide.shapes.count
let order = startingShape.animationSettings.animationOrder
let tmpIndex = 0
while (index <= endIndex)
	let shape = slide.shapes(index)
	if shape.AnimationSettings.animate
	&& shape.AnimationSettings.textLevelEffect != ppAnimateLevelNone
	&& shape.name != startingShape.name then
		if shape.animationSettings.animationOrder > order && (tmpIndex == 0 ||
      shape.animationSettings.animationOrder < slide.shapes(tmpIndex).animationSettings.animationOrder) then
			let tmpIndex = index
		endIf
		;if tmpIndex > 0 then
		;	if slide.shapes(tmpIndex).animationSettings.animationOrder >= order
		;	&& shape.animationSettings.animationOrder <= slide.shapes(tmpIndex).animationSettings.animationOrder then
		;		let tmpIndex = index
		;	endIf
		;endIf
	endIf
	let index = (index+1)
endWhile
; tmpIndex should now point to the next shape whose animation order is next highest
return tmpIndex
EndFunction

Int Function getPriorAnimatedShapeIndex (object startingShape)
var
	object slide,
	int endIndex,
	int index,
	int startIndex,
	int tmpIndex, ; will hold the index of the prior animated shape at the end
	string name,
	object shape,
	int order
let slide = startingShape.parent
let startIndex = 1
let endIndex = slide.shapes.count
let order = startingShape.animationSettings.animationOrder
let index = endIndex
let tmpIndex = 0
while index >= startIndex
	let shape = slide.shapes(index)
	if shape.AnimationSettings.animate
	&& shape.AnimationSettings.textLevelEffect != ppAnimateLevelNone
	&& shape.name != startingShape.name then
		if shape.animationSettings.animationOrder < order
      && (tmpIndex == 0 || shape.animationSettings.animationOrder > slide.shapes(tmpIndex).animationSettings.animationOrder) then
			let tmpIndex = index
		endIf
		;if tmpIndex > 0 then
		;	if slide.shapes(tmpIndex).animationSettings.animationOrder <= order
		;	&& shape.animationSettings.animationOrder >= slide.shapes(tmpIndex).animationSettings.animationOrder then
		;		let tmpIndex = index
		;	endIf
		;endIf
	endIf
	let index = (index-1)
endWhile
; tmpIndex should now point to the prior shape whose animation order is next highest
return tmpIndex
EndFunction

string Function GetShapeEntryEffect (object shape)
var
	int entryEffect
let entryEffect = shape.animationSettings.entryEffect()
if EntryEffect == ppEffectAppear then
	return msg341_L
elif EntryEffect == ppEffectBlindsHorizontal then
	return msg342_L
elif EntryEffect == ppEffectBlindsVertical then
	return msg343_L
elif EntryEffect == ppEffectBoxIn then
	return msg344_L
elif EntryEffect == ppEffectBoxOut then
	return msg345_L
elif EntryEffect == ppEffectCheckerboardAcross then
	return msg346_L
elif EntryEffect == ppEffectCheckerboardDown then
	return msg347_L
elif EntryEffect == ppEffectCoverDown then
	return msg348_L
elif EntryEffect == ppEffectCoverLeft then
	return msg349_L
elif EntryEffect==ppEffectCoverLeftDown then
	return msg350_L
elif EntryEffect == ppEffectCoverLeftUp then
	return msg351_L
elif EntryEffect == ppEffectCoverRight then
	return msg352_L
elif EntryEffect == ppEffectCoverRightDown then
	return msg353_L
elif EntryEffect == ppEffectCoverRightUp then
	return msg354_L
elif EntryEffect == ppEffectCoverUp then
	return msg355_L
elif EntryEffect == ppEffectCrawlFromDown then
	return msg356_L
elif EntryEffect == ppEffectCrawlFromLeft then
	return msg357_L
elif EntryEffect == ppEffectCrawlFromRight then
	return msg358_L
elif EntryEffect == ppEffectCrawlFromUp then
	return msg359_L
elif EntryEffect == ppEffectCut then
	return msg360_L
elif EntryEffect == ppEffectCutThroughBlack then
	return msg361_L
elif EntryEffect == ppEffectDissolve then
	return msg362_L
elif EntryEffect == ppEffectFade then
	return msg363_L
elif EntryEffect == ppEffectFlashOnceFast then
	return msg364_L
elif EntryEffect == ppEffectFlashOnceMedium then
	return msg365_L
elif EntryEffect == ppEffectFlashOnceSlow then
	return msg366_L
elif EntryEffect == ppEffectFlyFromBottom then
	return msg367_L
elif EntryEffect == ppEffectFlyFromBottomLeft then
	return msg368_L
elif EntryEffect == ppEffectFlyFromBottomRight then
	return msg369_L
elif EntryEffect == ppEffectFlyFromLeft then
	return msg370_L
elif EntryEffect == ppEffectFlyFromRight then
	return msg371_L
elif EntryEffect == ppEffectFlyFromTop then
	return msg372_L
elif EntryEffect == ppEffectFlyFromTopLeft then
	return msg373_L
elif EntryEffect == ppEffectFlyFromTopRight then
	return msg374_L
;elif EntryEffect == ppEffectMixed
;	then return msg494_L
elif EntryEffect == ppEffectNone then
	return msg375_L
elif EntryEffect == ppEffectPeekFromDown then
	return msg376_L
elif EntryEffect == ppEffectPeekFromLeft then
	return msg377_L
elif EntryEffect == ppEffectPeekFromRight then
	return msg378_L
elif EntryEffect == ppEffectPeekFromUp then
	return msg379_L
elif EntryEffect == ppEffectRandom then
	return msg380_L
elif EntryEffect == ppEffectRandomBarsHorizontal then
	return msg381_L
elif EntryEffect == ppEffectRandomBarsVertical then
	return msg382_L
elif EntryEffect == ppEffectSpiral then
	return msg383_L
elif EntryEffect == ppEffectSplitHorizontalIn then
	return msg384_L
elif EntryEffect == ppEffectSplitHorizontalOut then
	return msg385_L
elif EntryEffect == ppEffectSplitVerticalIn then
	return msg386_L
elif EntryEffect == ppEffectSplitVerticalOut then
	return msg387_L
elif EntryEffect == ppEffectStretchAcross then
	return msg388_L
elif EntryEffect == ppEffectStretchDown then
	return msg389_L
elif EntryEffect == ppEffectStretchLeft then
	return msg390_L
elif EntryEffect == ppEffectStretchRight then
	return msg391_L
elif EntryEffect == ppEffectStretchUp then
	return msg392_L
elif EntryEffect == ppEffectStripsDownLeft then
	return msg393_L
elif EntryEffect == ppEffectStripsDownRight then
	return msg394_L
elif EntryEffect == ppEffectStripsLeftDown then
	return msg395_L
elif EntryEffect == ppEffectStripsLeftUp then
	return msg396_L
elif EntryEffect == ppEffectStripsRightDown then
	return msg397_L
elif EntryEffect == ppEffectStripsRightUp then
	return msg398_L
elif EntryEffect == ppEffectStripsUpLeft then
	return msg399_L
elif EntryEffect == ppEffectStripsUpRight then
	return msg400_L
elif EntryEffect == ppEffectSwivel then
	return msg401_L
elif EntryEffect == ppEffectUncoverDown then
	return msg402_L
elif EntryEffect == ppEffectUncoverLeft then
	return msg403_L
elif EntryEffect == ppEffectUncoverLeftDown then
	return msg404_L
elif EntryEffect == ppEffectUncoverLeftUp then
	return msg405_L
elif EntryEffect == ppEffectUncoverRight then
	return msg406_L
elif EntryEffect == ppEffectUncoverRightDown then
	return msg407_L
elif EntryEffect == ppEffectUncoverRightUp then
	return msg408_L
elif EntryEffect == ppEffectUncoverUp then
	return msg409_L
elif EntryEffect == ppEffectWipeDown then
	return msg410_L
elif EntryEffect==ppEffectWipeLeft then
	return msg411_L
elif EntryEffect == ppEffectWipeRight then
	return msg412_L
elif EntryEffect == ppEffectWipeUp then
	return msg413_L
elif EntryEffect == ppEffectZoomBottom then
	return msg414_L
elif EntryEffect == ppEffectZoomCenter then
	return msg415_L
elif EntryEffect == ppEffectZoomIn then
	return msg416_L
elif EntryEffect == ppEffectZoomInSlightly then
	return msg417_L
elif EntryEffect == ppEffectZoomOut then
	return msg418_L
elif EntryEffect == ppEffectZoomOutSlightly then
	return msg419_L
endIf
EndFunction

Void Function readAnimatedText (object shape, int TextOnly, int ByRef ParaIndexPointer, int textLevelEffect, int reversed, int iRedirectToUserBuffer)
var
	int start,
	int end,
	int textLevel,
	int atLeastOneParaSpoken,
	int priorLevel,
	int priorAlignment,
	int index,
	object textRange,
	string sText,
	int finished,
	int iOutputtype
if iRedirectToUserBuffer then
	let iOutputtype = ot_user_buffer
else
	let iOutputtype = ot_line ;ot_no_disable before 6.0
endIf
let start = ParaIndexPointer
if ! reversed then
	let end = shape.textFrame.textRange.paragraphs.count
else
	let end = 1
endIf
let index = start
let finished = false
let atLeastOneParaSpoken = false
let priorLevel = 0
while ! finished
	let textRange = shape.textFrame.textRange.paragraphs(index)
	let textLevel = textRange.indentLevel
	; skip blank paragraphs
	if textRange.characters.count > 1 then
		; This is a non-blank paragraph
		; what we want to do is read from the first para at the specified text level to the next at
		;the same level, not including that one
		; i.e., if we had level 1, level 2, level 2, level 1,
		;then we'd read the first three if the textLevelEffect was set to 1.
		; if the textLevelEffect was set to 2 then first call would read para 1, next call would read
		;both paras at level 2, third call would read 4th para at level 1.
		; theoretically, the paragraph index stored in start should already be pointing to the
		;correct paragraph or at least the blank line before it.
		; if textLevelEffect is set to ppAnimateByAllLevels then only ever read one bullet point
		; now look at outline level
		; if animated by all levels, the next test will never be true but will be picked up in the later test
		if textLevel <= textLevelEffect
		&& atLeastOneParaSpoken then
			; we have already read a paragraph at the specified level so we should stop as we have
			;found the next one at the same level or at an outdented level
	 		let finished = true
			return
		elif (textLevel >= textLevelEffect) || (textLevelEffect ==ppAnimateByAllLevels) || not atLeastOneParaSpoken then ; >= to take care of first para on first time through loop
			; continue reading
			let sText = textRange.text
			;visible does not mean onscreen, but rather capable of being onscreen.
			if textRange.paragraphFormat.bullet.visible then
				; script lang doesn't like concatenating strings returned from object model
				SayUsingVoiceOrBuffer (vctx_pcCursor, cStr_Bullet + cscSpace + sText, iOutputType, textRange) ; bullet
			else
				SayUsingVoiceOrBuffer (vctx_pcCursor, sText, iOutputType, textRange)
			endIf
			; paragraph pointer is left pointing at last paragraph spoken. It is updated in readSlideShowSlide
			let ParaIndexPointer = index
			let lastParaSpokenIndex = index
			let lastShapeSpokenIndex = globalShapeIndex
		else ; textLevel is less than textLevelEffect parameter
			; will set finished flag but will wait until index is updated before returning
			let finished = true
		endIf ; end of textLevelEffect comparison
		if textLevelEffect == ppAnimateByAllLevels then
			; have spoken one paragraph, must return as all levels must be animated separately
			let finished = true
		endIf
		let atLeastOneParaSpoken = true ; flag to indicate that next time we find a paragraph at the initial text level, we should stop
	endIf
	if ! reversed then
		if index < end then
			let index = (index+1)
		else
			let finished = true
		endIf
	else ; reverse
		if index > end then
			let index = (index-1)
		else
			let finished = true
		endIf
	endIf
endWhile
EndFunction

string Function getShapeTextLevelEffect (object shape)
var
	int type
let type = shape.animationSettings.textLevelEffect
if type == ppAnimateByAllLevels then
	return msg420_L
elif type == ppAnimateByFifthLevel then
	return msg421_L
elif type == ppAnimateByFirstLevel then
	return msg422_L
elif type == ppAnimateByFourthLevel then
	return msg423_L
elif type == ppAnimateBySecondLevel then
	return msg424_L
elif type == ppAnimateByThirdLevel then
	return msg425_L
elif type == ppAnimateLevelNone then
	return msg427_L
elif type < 0 then ;==ppAnimateLevelMixed then
	return msg426_L
endIf
EndFunction

String Function getAnimationTextUnitEffect (object shape)
var
	int effect,
	int animationStatus
if ! shape then
	return msg87_L ; no shape
endIf
let effect = shape.animationSettings.textUnitEffect
let animationStatus = shape.animationSettings.animate
if animationStatus then
	if effect == ppAnimateByCharacter then ;= 2,
		return msg323_L ; character
	elif effect == ppAnimateByParagraph then ; = 0,
		return msg325_L ; paragraph
	elif effect == ppAnimateByWord then ;= 1,
		return msg324_L ; word
	elif effect < 0 then
		return msg326_L ; mixed
	endIf
else
	return msg327_L ; none
endIf
EndFunction

string Function getShapeAfterEffect (object shape)
var
	int effect
let effect = shape.animationSettings.afterEffect
if effect == ppAfterEffectDim then ;= 2,
	return msg318_L
elif effect == ppAfterEffectHide then ;= 1,
	return msg319_L
elif effect == ppAfterEffectHideOnClick then ;= 3,
	return msg320_L
elif effect < 0 then ;;ppAfterEffectMixed = -2, (&HFFFFFFFE)
	return msg321_L
elif effect == ppAfterEffectNothing then ;= 0
	return msg322_L
endIf
EndFunction

Void Function sayAnimationInfo (object shape, string voice, int iRedirectToUserBuffer)
var
	int iOutputtype
if iRedirectToUserBuffer then
	let iOutputType = ot_user_buffer
else
	let iOutputType = ot_help ;ot_no_disable before 6.0
endIf
if Shape.animationSettings.advanceMode == ppAdvanceOnClick then
	SayUsingVoiceOrBuffer (voice, msg43_L, iOutputType, null) ; "Advances on mouse click",
elif Shape.animationSettings.advanceMode == ppAdvanceOnTime then
	SayUsingVoiceOrBuffer (voice, formatString (msg46_L, intToString (Shape.animationSettings.advanceTime)), iOutputType, null)
endIf
SayUsingVoiceOrBuffer (voice, formatString (msg35_L, GetShapeEntryEffect (Shape)), iOutputType, null)
SayUsingVoiceOrBuffer (voice, formatString (msg36_L, getAnimationTextUnitEffect (Shape)),iOutputType, null)
SayUsingVoiceOrBuffer (voice, formatString (msg38_L, getShapeTextLevelEffect (Shape)), iOutputType, null)
if Shape.animationSettings.AnimateTextInReverse then
	SayUsingVoiceOrBuffer (voice, msg39_L, iOutputType, null) ; text will be animated in reverse.
endIf
SayUsingVoiceOrBuffer (voice, formatString (msg37_L, getShapeAfterEffect (Shape)), iOutputType, null)
EndFunction

Void Function SayAnimatedShape (object shape, int textOnly, int ByRef startingParaIndex, int textLevelEffect, int reversed, int iRedirecttoUserBuffer)
var
	int iOutputtype,
	object s

if iRedirectToUserBuffer then
	let iOutputtype = ot_user_buffer
else
	let iOutputtype = ot_line ;ot_no_disable before 6.0
endIf
;visible means it *can* show up on the screen, not that it is.
if ! shape.visible() then
  return
endIf
if startingParaIndex == 0 then
	; this condition should never be true
	return
endIf
if ! TextOnly
|| shape.hasTable
|| shape.type == msoEmbeddedOleObject then
	SayUsingVoiceOrBuffer (VCTX_MESSAGE, GetShapeDescription (shape), iOutputType, null)
	sayAnimationInfo (shape, vctx_message, iRedirectToUserBuffer)
	if shape.actionSettings(ppMouseOver).action() == ppActionHyperlink then
		SayUsingVoiceOrBuffer (VCTX_MESSAGE, formatString (msg79_L, getHyperlinkAddress (shape.actionSettings(ppMouseOver).hyperlink())), iOutputType, null)
	elif shape.actionSettings(ppMouseClick).action() == ppActionHyperlink then
		SayUsingVoiceOrBuffer (VCTX_MESSAGE, formatString (msg80_L, getHyperlinkAddress (shape.actionSettings(ppMouseClick).hyperlink())), iOutputType, null)
	endIf
endIf
if shape.HasTextFrame() then
	if shape.textFrame.hasText() then
		readAnimatedText (shape, textOnly, startingParaIndex, textLevelEffect, reversed, iRedirectToUserBuffer)
	endIf
elif shape.alternativeText != cscNull then
	; PP 2000 only
	SayUsingVoiceOrBuffer (vctx_message, shape.alternativeText, iOutputType, null)
elif shape.hasTable then
	readTable (shape.table, globalTableReadingMethod, vctx_message, iOutputType)
elif shape.type == msoGroup then
	foreach s in shape.groupItems
	if s.HasTextFrame() && s.textFrame.hasText then
		readParagraphs (s, textOnly, iRedirectToUserBuffer)
	elif s.alternativeText != cscNull then
		SayUsingVoiceOrBuffer (vctx_message, s.alternativeText, iOutputType, null)
	endIf
	endforeach
endIf
EndFunction

Void Function ReadSlideShowSlide (int textOnly, int waitForTrigger)
; Explanation of GlobalAnimationTriggered flag:
;This flag is reset after text has been spoken so that if a shape is animated by a mouse click or
;keyboard keystroke then the shape won't be spoken until after the event. It is reset after
;something is spoken but is only checked if the shape requires input to trigger. If the shape is
;animated by time then the time delay occurs before the shape is spoken.
var
	int index,
	int firstIndex,
	int lastIndex,
	object shapeAnimationSettings,
	object slide,
	object shape,
	object titleShape,
	int shapeParaCount,
	int advanceTime,
	int textLevelEffect,
	int reversed,
	int finished,
	string smsg
if ! isSlideShow () then
	let globalPriorSlideIndex = 0 ; reset so retreat performs correctly when retreating from the slide show done screen.
	if isSlideShowDone () then
		SayMessage (ot_status, msgLastSlide_l, msgLastSlide_s) ; "SlideShow done"
	endIf
	return
endIf
let slide = oPpt.activePresentation.slideShowWindow.view.slide
let globalAnimationTriggered = true ; must be to get here, ie a key was pressed or mouse clicked.
if globalPriorSlideIndex != slide.slideIndex then
	UserBufferClear ()
	UserBufferAddText (formatString (msg42_L, intToString (slide.slideIndex)))
	; Read the title first (if it is not animated, otherwise handle with animation), then all non animated shapes
	if ! slide.shapes.title.AnimationSettings.animate then
		let titleShape = slide.shapes.title
		sayShape (titleShape, textOnly, true)
		let lastShapeSpokenIndex = 1 ; usually but not always the first shape.
		let globalAnimationTriggered = false
		If giSlideTransitions then
			SayCurrentSlideTransition()
		endIf
	endIf
	; read all non-animated shapes first then handle animations
	let firstIndex = 1
	let LastIndex = slide.shapes.count
	let index = firstIndex
	while (index <= lastIndex)
		let shape = slide.shapes(index)
		if ! shape.AnimationSettings.animate
		&& shape.name != titleShape.name then
			; say the shape
			sayShape (shape, textOnly, true)
			let globalAnimationTriggered = false
			let lastShapeSpokenIndex = index ; always points to last shape spoken
		endIf
		let index = (index+1)
	endWhile
	if waitForTrigger then
		; show is advancing so need to reset variables
		; if show is retreating then we don't need to do this.
		; set up animation tracking globals
		let globalShapeIndex = getFirstAnimatedShapeIndex (slide)
		let globalParaIndexPointer = 1
		;If giSlideTransitions then
			;SayCurrentSlideTransition()
		;endIf
	endIf ; otherwise it is the same slide but triggering animation
endIf
; now handle animations
let globalPriorSlideIndex = slide.slideIndex
if globalShapeIndex > 0 then
	let finished = false
else
	let finished = true
endIf
let firstIndex = getFirstAnimatedShapeIndex (slide)
let lastIndex = getLastAnimatedShapeIndex (slide)
while (! finished)
	let shape = slide.shapes(globalShapeIndex)
	let shapeAnimationSettings = shape.animationSettings
	let reversed = shapeAnimationSettings.AnimateTextInReverse
	let textLevelEffect = shapeAnimationSettings.textLevelEffect
	if shapeAnimationSettings.advanceMode == ppAdvanceOnTime then
		let advanceTime = shapeAnimationSettings.advanceTime*10 ; delay uses 0.1 seconds
		delay (advanceTime)
		sayAnimatedShape (shape, true, globalParaIndexPointer, textLevelEffect, reversed, true)
		let globalAnimationTriggered = false ; reset
	elif shapeAnimationSettings.advanceMode == ppAdvanceOnClick then
		if globalAnimationTriggered
		|| ! waitForTrigger then
			sayAnimatedShape (shape, true, globalParaIndexPointer, textLevelEffect, reversed, true)
			let globalAnimationTriggered = false
		else
			return ; wait for next trigger
		endIf
		; need mouse click to animate next paragraph or group of paragraphs so set finished flag for this time round
		let finished = true
	endIf
	; advance animation tracking pointers
	; handle forward animation
	; globalParaIndex is always updated by readAnimatedText to point to last paragraph spoken
	; we update here to point to next one to speak
	if ! reversed then
		if shape.hasTextFrame && globalParaIndexPointer < shape.textFrame.textRange.paragraphs.count then
			let globalParaIndexPointer = (globalParaIndexPointer+1)
		else
			if globalShapeIndex < lastIndex then
				let globalShapeIndex = getNextAnimatedShapeIndex (shape)
				if ! globalShapeIndex then
					let finished = true
				endIf
				let globalParaIndexPointer = 1
			else ;flag finished
				let finished = true
			endIf
		endIf
	else ; reversed
		; shape is animated in reverse
		if globalParaIndexPointer > 1 then
			let globalParaIndexPointer = (globalParaIndexPointer -1)
		else
			if globalShapeIndex < lastIndex then
				let globalShapeIndex = getNextAnimatedShapeIndex (shape)
				if ! globalShapeIndex then
					let finished = true
				endIf
				let globalParaIndexPointer = 1
			else ; flag finished
				let finished = true
			endIf
		endIf
	endIf
endWhile
EndFunction

Void Function advanceSlideShow ()
var
	int priorSelectionType,
	int iPriorSlideIndex,
	int count

let priorSelectionType = oPpt.activeWindow.selection.type ; prior to hitting the spacebar
; are we in the slide document or show window?
if isSlideShow () then
	while globalPriorSlideIndex == oPpt.activePresentation.slideShowWindow.view.slide.slideindex && count < 3
		pause()
		let count = count + 1
	EndWhile
	let giSpeakersNotesActive = false ; reset
	let iPriorSlideIndex = globalPriorSlideIndex
	JAWSBottomOfFile () ; move to current end of slide
	readSlideShowSlide (true, true)
	if iPriorSlideIndex == globalPriorSlideIndex then
		; same slide
		NextLine () ; move onto start of new text
	endIf
	sayAll () ; read it
else ; we need to check if we are about to edit a text placeholder on a new slide (activated by spacebar)
	delay (1)
	; let's see if we have just switched to editing a place holder on a new slide
	if oPpt.activeWindow.selection.type == ppSelectionText
	&& oPpt.activeWindow.selection.type != priorSelectionType then
		; we've switched to editing
		IndicateControlType (wt_edit)
	endIf
endIf
EndFunction

Int Function firstNonblankParagraphIndex (object shape)
var
	int index,
	int count
let index = 1
let count = shape.textFrame.textRange.paragraphs.count
while (index <= count)
	if shape.textFrame.textRange.paragraphs(index).characters.count > 1 then
		return index
	endIf
	let index = (index+1)
endWhile
return 0
EndFunction

int Function findPriorParagraphAtLevel (int startIndex, int textLevelEffect, object shape)
var
	int index,
	int count,
	object para
let count = shape.textFrame.textRange.paragraphs.count
let index = startIndex
if index < 1 then
	return 0
endIf
while (index >= 1)
	let para = shape.textFrame.textRange.paragraphs(index)
	if para.characters.count > 1 && (para.indentLevel <= textLevelEffect || textLevelEffect == ppAnimateByAllLevels) then
		return index
	endIf
	let index = (index-1)
endWhile
return 0
EndFunction

void function processSlideShowRetreat ()
var
	int firstParaIndex,
	int textLevelEffect,
	int priorParaAtLevel,
	int tmpInt,
	object tmpShape,
	object slide,
	object lastShapeRead,
	int waitForTrigger ; set to false if retreating to a prior slide
let slide = getSlideWithFocus ()
let waitForTrigger = true ; set to false if we cross a slide boundary
if globalPriorSlideIndex != slide.slideIndex then
	; prior slide now has focus
	let globalShapeIndex = getLastAnimatedShapeIndex(slide)
	let tmpShape = slide.shapes(globalShapeIndex)
	let tmpInt = tmpShape.textFrame.textRange.paragraphs.count
	let textLevelEffect = tmpShape.animationSettings.textLevelEffect
	let globalParaIndexPointer = findPriorParagraphAtLevel (tmpInt, textLevelEffect,tmpShape)
	let waitForTrigger = false ; want to read last animation immediately
else ; same slide, different stage of animation
	let lastShapeRead = slide.shapes(lastShapeSpokenIndex)
	let firstParaIndex = firstNonblankParagraphIndex (lastShapeRead)
	if lastShapeRead.animationSettings.animate then
		let textLevelEffect = lastShapeRead.animationSettings.textLevelEffect
		let priorParaAtLevel = findPriorParagraphAtLevel (lastParaSpokenIndex, textLevelEffect, lastShapeRead)
		if lastParaSpokenIndex > firstParaIndex && firstParaIndex && priorParaAtLevel then
			let globalParaIndexPointer = priorParaAtLevel-1
			let globalShapeIndex = lastShapeSpokenIndex
		else
			if lastShapeSpokenIndex > 1 then
				if slide.shapes(lastShapeSpokenIndex-1).animationSettings.animate then
					let globalShapeIndex = lastShapeSpokenIndex-1
					let tmpShape = slide.shapes(globalShapeIndex)
					let tmpInt = tmpShape.textFrame.textRange.paragraphs.count
					let textLevelEffect = tmpShape.animationSettings.textLevelEffect
					let priorParaAtLevel = findPriorParagraphAtLevel (tmpInt, textLevelEffect, tmpShape)
					let globalParaIndexPointer = tmpInt
				else ; prior shape was not animated
					let globalPriorSlideIndex=0 ; reset so all non animated shapes get read.
				endIf
			else
				let globalPriorSlideIndex = 0 ; reset so all non animated shapes get read.
			endIf
		endIf
	endIf
endIf
readSlideShowSlide (true, waitForTrigger)
JAWSTopOfFile ()
sayAll () ; read it
EndFunction

void function PPTSayAll ()
var
	object slide
let slide = GetSlideWithFocus ()
if slide then
	if isSlideShow () then
		readSlideUpToShapeAndPara (slide, lastShapeSpokenIndex, lastParaSpokenIndex, false, false)
	else
		readSlide (slide, false, 0, 0)
	endIf
endIf
EndFunction

int function isObjectLevel ()
return oPPt.activeWindow.selection.type == ppSelectionShapes
endFunction

void function enterKey ()
;When calling function, ensure you go all the way down, or likely to get duplicate.
var
	string focusClass,
	int PriorSelectionType, ; before we hit enter
	int selectiontype ; after Enter
if DialogActive ()
|| GetMenuMode () > 0 then
	builtin::enterKey ()
	return
EndIf
let focusClass = getWindowClass (GetFocus ())
let priorSelectiontype = oPpt.activeWindow.selection.type
builtin::enterKey ()
let selectionType = oPPt.activeWindow.selection.type
if focusClass == wcPaneClassDC
|| focusClass == wcExcel7 then
	; check if in edit mode.
	if selectionType == ppSelectionText then
		if selectionType != priorSelectionType then
			; we've switched to editing
			indicateControlType (wt_edit)
		EndIf
	endIf
endIf
EndFunction

;The following two functions are for scope resolution purposes, keeping multiple calls from going through to enterKey
void function brailleEnterKey ()
self::enterKey ()
endFunction

Script BrailleEnter ()
self::EnterKey ()
endScript

int function getSelectedShapeTopLeftX ()
return oPpt.activeWindow.selection.shapeRange(1).left
endFunction
int function getSelectedShapeTopLeftY ()
return oPpt.activeWindow.selection.shapeRange(1).top
endFunction

int Function getSelectedSlideTopLeftX ()
;0 = left edge:
return 0
endFunction

int Function getSelectedSlideTopLeftY ()
;0 = top edge
return 0
endFunction

int Function getSelectedSlideBottomRightX ()
return oPpt.activeWindow.Presentation.PageSetup.SlideWidth
;+oPpt.activeWindow.Presentation.SlideShowWindow.width
endFunction

int function getSelectedSlideBottomRightY ()
return oPpt.activeWindow.Presentation.PageSetup.SlideHeight
;+oPpt.activeWindow.Presentation.SlideShowWindow.height
endFunction

int function noSelectedShape ()
if oPpt.activeWindow.selection.shapeRange(1) then
	return false
else
	return true
endIf
endFunction

string function getSelectedShapeDescription ()
var
	object shape
let shape = oPpt.activeWindow.selection.shapeRange(1)
if ! shape then
	return cscNull
else
	return getShapeDescription (shape)
endIf
endFunction

int function getSelectedShapeWidth ()
return oPpt.activeWindow.selection.shapeRange(1).width
endFunction

int function getSelectedShapeHeight ()
return oPpt.activeWindow.selection.shapeRange(1).height
endFunction

int function getPresentationRect (int byRef nLeft, int byRef nTop, int byRef nRight, int byRef nBottom)
var
	object Doc
let Doc = oPpt.activeWindow
let nLeft = doc.left
let nTop = doc.top
Let nRight = doc.width
let nBottom = doc.height
;validate:
if (nLeft > 0 && nTop > 0 && nRight > 0 && nBottom > 0)
&& (nLeft < nRight && nTop < nBottom) then
	return TRUE
else
	let nLeft = 0 let nTop = 0 let nRight = 0 let nBottom = 0;
	return FALSE
endIf
endFunction

int function getShapeRect (object shape, int byRef nLeft, int byRef nTop, int byRef nRight, int byRef nBottom)
let nLeft = shape.left
let nTop = shape.top
let nRight = (nLeft+shape.width)
let nBottom = (nTop+shape.height)
if (nLeft > 0 && nTop > 0 && nRight > 0 && nBottom > 0)
&& (nLeft < nRight && nTop < nBottom) then
	return TRUE
else
	let nLeft = 0 let nTop = 0 let nRight = 0 let nBottom = 0;
	return FALSE
endIf
endFunction

int function getFocusShapeRect (int byRef nLeft, int byRef nTop, int byRef nRight, int byRef nBottom)
return getShapeRect (GetShapeWithFocus (), nLeft, nTop, nRight, nBottom)
endFunction

void function ConvertRectFromPointsToPixels (int byRef nLeft, int byRef nTop, int byRef nRight, int byRef nBottom)
var
	object window
let window = oPpt.activeWindow
let nLeft = window.PointsToScreenPixelsX(nLeft)
let nTop = window.PointsToScreenPixelsY(nTop)
let nRight = window.PointsToScreenPixelsX(nRight)
let nBottom = window.PointsToScreenPixelsY(nBottom)
endFunction

int function isSelectedShapeAnimated ()
return oPpt.activeWindow.selection.shapeRange(1).animationSettings.animate
endFunction

int function isAnimationTriggeredOnMouseClick ()
return oPpt.activeWindow.selection.shapeRange(1).animationSettings.advanceMode==ppAdvanceOnClick
endFunction

int function isAnimationTriggeredOnTime ()
return oPpt.activeWindow.selection.shapeRange(1).animationSettings.advanceMode==ppAdvanceOnTime
endFunction

int function isShapeAnimatedInReverse ()
return oPpt.activeWindow.selection.shapeRange(1).animationSettings.AnimateTextInReverse
endFunction

int function getSelectedShapeAnimationTime ()
return oPpt.activeWindow.selection.shapeRange(1).animationSettings.advanceTime
endFunction

string function getSelectedShapeEntryEffect ()
return GetShapeEntryEffect (oPpt.activeWindow.selection.shapeRange(1))
endFunction

string function getSelectedShapeTextUnit ()
return getAnimationTextUnitEffect(oPpt.activeWindow.selection.shapeRange(1))
endFunction

string function getSelectedShapeTextLevelEffect()
return getShapeTextLevelEffect(oPpt.activeWindow.selection.shapeRange(1))
endFunction

string function getSelectedShapeAfterEffect ()
return getShapeAfterEffect (oPpt.activeWindow.selection.shapeRange(1))
endFunction

int function isNormalView ()
return oPpt.activeWindow.viewType == ppViewNormal
EndFunction

int function isSlideSorterView ()
return oPpt.activeWindow.viewType() == ppViewSlideSorter
endFunction

int function isOutlineView ()
return oPpt.activeWindow.activePane.viewType == ppViewOutline
EndFunction

int function getExpandAllState ()
return oPpt.commandBars(cbOutlining).controls(btnExpandAll).state
endFunction

int function getCollapseAllState ()
return oPpt.commandBars(cbOutlining).controls(btnCollapseAll).state
endFunction

int function getParagraphIndentLevel ()
return oPpt.activeWindow.selection.textRange.indentLevel
endFunction


string Function getCellCoordinates (int byref col, int byref row, optional int mode)
var
	object focusedShape,
	int iRowCount,
	int iColCount,
	object shape, ; shape attached to textRange
	object table,
	object cell
; get the shape being edited
let shape = oPpt.activeWindow.selection.textRange.parent.parent
; get the top level shape pointed to by the selection object
let focusedShape = oPpt.activeWindow.selection.shapeRange(1)
; look for embedded native Powerpoint table,
; embedded MSWord table or
; embedded Excel table
if focusedShape.hasTable then
	let table = focusedShape.table
	let iRowCount = Table.rows.count
	let iColCount = table.columns.count
	; now determine which cell the focused shape is attached to
	let row = 1
	while (row <= iRowCount)
		let col = 1
		while (col <= iColCount)
			let cell= table.cell(row,col)
			if cell.selected then
				; found the focused cell, announce coordinates
				if row == iRowcount
				&& col == iColCount && !mode then
					SayFormattedMessageWithVoice (vctx_message, ot_smart_help, msgWarningCreateCells1_L, msgWarningCreateCells1_S)
				EndIF
				if mode then
					cell.select()
				Endif
				return formatString (msgTableCoordinates1, intToString (col), intToString (row))
			endIf
			let col= (col+1)
		endWhile
		let row = (row+1)
	endWhile
elif focusedShape.oleFormat.object.application.selection.information(wdWithinTable) then
	; embedded MSWord table
	let cell = focusedShape.oleFormat.object.application.selection.cells(1)
	let col = cell.columnIndex
	let row = cell.rowIndex
	return formatString (msgTableCoordinates1, intToString (cell.columnIndex), intToString (cell.rowIndex))
elif focusedShape.oleFormat.object.application.activeCell then
	; Embedded Excel worksheet
	let cell = focusedShape.oleFormat.object.application.activeCell
	let col = cell.column
	let row = cell.row
	return cell.addressLocal(false,false)
endIf
EndFunction

int Function getCellRowIndex ()
var
	object focusedShape,
	int col,
	int row,
	object shape, ; shape attached to textRange
	object table,
	object cell
if oPpt.activeWindow.selection.type != ppSelectionText then
	; not at the editing level
	return 0
endIf
; get the shape being edited
let shape = oPpt.activeWindow.selection.textRange.parent.parent
; get shape pointed to by selection object
let focusedShape = oPpt.activeWindow.selection.shapeRange(1)
if not focusedShape.hasTable then
	return 0
endIf
let table = focusedShape.table
; now determine which cell the focused shape is attached to
let row = 1
while (row <= table.rows.count)
	let col = 1
	while (col <= table.columns.count)
		let cell = table.cell(row,col)
		if cell.shape.name == shape.name then
		; found the focused cell, return the row index
			return row
		endIf
		let col = (col+1)
	endWhile
	let row = (row+1)
endWhile
return 0
EndFunction

int Function getCellColumnIndex ()
var
	object focusedShape,
	int col,
	int row,
	object shape, ; shape attached to textRange
	object table,
object cell
if oPpt.activeWindow.selection.type != ppSelectionText then
	; not at the editing level
	return 0
endIf
; get shape being edited
let shape = oPpt.activeWindow.selection.textRange.parent.parent
; get shape pointed to by selection object
let focusedShape = oPpt.activeWindow.selection.shapeRange(1)
if not focusedShape.hasTable then
	return
endIf
let table = focusedShape.table
; now determine which cell the focused shape is attached to
let row = 1
while (row <= table.rows.count)
	let col = 1
	while (col <= table.columns.count)
		let cell= table.cell(row,col)
		if cell.shape.name == shape.name then
		; found the focused cell, return the row index
			return col
		endIf
		let col = (col+1)
	endWhile
	let row = (row+1)
endWhile
return 0
EndFunction

Int Function isCaretInTable ()
var
	object focusedShape
let focusedShape = oPpt.activeWindow.selection.shapeRange(1)
return (focusedShape.hasTable && oPpt.activeWindow.selection.type==PPSelectionText)
	|| focusedShape.oleFormat.object.application.selection.information(wdWithinTable)
	|| focusedShape.oleFormat.object.application.activeCell
EndFunction

Int Function detectTooMuchInfo (int announceRemainingLines, int announceOverflow)
var
	object shape,
	int textRangeBoundHeight,
	int shapeHeight,
	int LineCount,
	int fontSize,
	int approximateLines
; Attempt to get the selected shape
let shape = oPpt.activeWindow.selection.shapeRange(1)
if ! shape then
	; didn't get it, try getting it from the textRange with focus
	let shape = oPpt.activeWindow.selection.textRange.parent
endIf
if ! shape then
	return false
endIf
if ! shape.textFrame.hasText then
	return false
endIf
; We will compare the bound height of the textRange to the host shape's height
; engine that may lead to floating point numbers retrieved from an object
; model being treated as strings when doing numeric comparisons
let textRangeBoundHeight = StringToInt (shape.textFrame.textRange.boundHeight)
let shapeHeight = StringToInt(shape.height)
; We will get the font size of the last line so we can estimate the number of remaining lines or overflow
let lineCount = StringToInt (shape.textFrame.textRange.lines.count)
let fontSize = StringToInt (shape.textFrame.textRange.lines(lineCount,1).characters(1).font.size)
if announceRemainingLines then
	if textRangeBoundHeight < shapeHeight then
		; there is still some room but not necessarily enough for another line, it will depend on the font size
		let approximateLines = (shapeHeight-textRangeBoundHeight)/fontSize
		if approximateLines == 0 then
			SayOrBufferFormattedMessage (OT_HELP,
				formatString (msgPlaceholderFull1_L, getShapeDescription (shape), intToString (fontSize)),
				formatString (msgPlaceholderFull1_S, getShapeDescription (shape), intToString (fontSize))
				,null)
		else
			SayOrBufferFormattedMessage (OT_HELP,
				formatString (msgPlaceholderUnderfull1_L, intToString (approximateLines), getShapeDescription (shape), intToString (fontSize)),
				formatString (msgPlaceholderUnderfull1_S, intToString (approximateLines), getShapeDescription (shape), intToString (fontSize))
				,null)
		endIf
		return true
	endIf
endIf
if announceOverflow then
	if textRangeBoundHeight >= shapeHeight then
		let approximateLines = (textRangeBoundHeight-shapeHeight)/fontSize
		if approximateLines == 0
		&& textRangeBoundHeight-shapeHeight > 0 then
			let approximateLines = 1
		endIf
		SayOrBufferFormattedMessage (OT_HELP,
			formatString (msgPlaceholderOverfull1_L, intToString (approximateLines), getShapeDescription (shape), intToString (fontSize)),
			formatString (msgPlaceholderOverfull1_S, intToString (approximateLines), getShapeDescription (shape), intToString (fontSize))
			,null)
	endIf
endIf
return textRangeBoundHeight > shapeHeight
EndFunction

int Function isPointInRect (int pointX, int pointY, int topLeftX, int topLeftY, int bottomRightX, int bottomRightY)
return pointX >= topLeftX && pointX <= bottomRightX &&
	pointY >= topLeftY && pointY <= bottomRightY
EndFunction

Int Function testShapeOverlap (object shape, object oCollection, int DescribeOverlap, string voice)
var
	handle hwnd,
	int nLeft, int
	nTop,
	int nRight,
	int nBottom,
	int index,
	int count,
	string shapeName,
	string shapeDesc,
	string message,
	string testShapeDesc,
	int shapeTopLeftX,
	int shapeTopLeftY,
	int shapeBottomRightX,
	int shapeBottomRightY,
	int testTopLeftX,
	int testTopLeftY,
	int testBottomRightX,
	int testBottomRightY,
	int overlapFlag,
	int atLeastOneOverlap
Let hWnd = getFocus ()
let globalBrlShapeOverlapDesc = cscNull
GetWindowRect (hwnd, nLeft, nRight, nTop, nBottom)
if ! shape then
	return false
endIf
let atLeastOneOverlap = false
let index = 1
let count = oCollection.count
let shapeName = shape.name
let shapeTopLeftX = shape.left
let shapeTopLeftY = shape.top
let shapeBottomRightX = shapeTopLeftX+shape.width
let shapeBottomRightY = shapeTopLeftY+shape.height
let message = getShapeDescription(shape)
while (index <= count)
	if oCollection(index).name != shape.name then
		let testShapeDesc = getShapeDescription (oCollection(index))
		let testTopLeftX = oCollection(index).left
		let testTopLeftY = oCollection(index).top
		let testBottomRightX = testTopLeftX+oCollection(index).width
		let testBottomRightY = testTopLeftY+oCollection(index).height
 		; now do the overlap test
		; Clear the flag
		let overlapFlag = 0
		if isPointInRect (shapeTopLeftX, shapeTopLeftY, testTopLeftX, testTopLeftY, testBottomRightX, testBottomRightY)
		&& isPointInRect (shapeTopLeftX, shapeTopLeftY, nLeft, nTop, nRight, nBottom) then
			let overlapFlag = overlapFlag+ctlVertexTopLeft
		endIf
		if isPointInRect (shapeBottomRightX, shapeTopLeftY, testTopLeftX, testTopLeftY, testBottomRightX, testBottomRightY)
		&& isPointInRect (shapeBottomRightX, shapeTopLeftY, nLeft, nTop, nRight, nBottom) then
			let overlapFlag = overlapFlag + ctlVertexTopRight
		endIf
		if isPointInRect (shapeTopLeftX, shapeBottomRightY, testTopLeftX, testTopLeftY, testBottomRightX, testBottomRightY)
		&& isPointInRect (shapeTopLeftX, shapeBottomRightY, nLeft, nTop, nRight, nBottom) then
			let overlapFlag = overlapFlag + ctlVertexBottomLeft
		endIf
		if isPointInRect (shapeBottomRightX, shapeBottomRightY, testTopLeftX, testTopLeftY, testBottomRightX, testBottomRightY)
		&& isPointInRect (shapeBottomRightX, shapeBottomRightY, nLeft, nTop, nRight, nBottom) then
			let overlapFlag = overlapFlag + ctlVertexBottomRight
		endIf
 		if isPointInRect (testTopLeftX, testTopLeftY, shapeTopLeftX, shapeTopLeftY, shapeBottomRightX, shapeBottomRightY)
		&& isPointInRect (testBottomRightX, testTopLeftY, shapeTopLeftX, shapeTopLeftY, shapeBottomRightX, shapeBottomRightY)
		&& isPointInRect (testTopLeftX, testBottomRightY, shapeTopLeftX, shapeTopLeftY, shapeBottomRightX, shapeBottomRightY)
		&& isPointInRect (testBottomRightX, testBottomRightY, shapeTopLeftX, shapeTopLeftY, shapeBottomRightX, shapeBottomRightY) then
			let overlapFlag = ctlCovered
		endIf
		if atLeastOneOverlap then
			let message = msgMultipleOverlapConjunction1
		endIf
		If UserBufferIsActive () then
			if describeOverlap
			&& overlapFlag then
				if overlapFlag == ctlCovered then
					UserBufferAddText (formatString (msgIsCoveredBy1_L, message, testShapeDesc))
					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace + formatString (msgIsCoveredBy1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexTopLeft+ctlVertexTopRight+ctlVertexBottomRight + ctlVertexBottomLeft then
					; is on top of test shape
					UserBufferAddText(formatString (msgIsOntopOf1_L, message, testShapeDesc))
					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
					+ formatString (msgIsOntopOf1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexTopLeft+ctlVertexTopRight then
					UserBufferAddText (formatString (msgBottomEdge1_L, message, testShapeDesc))
					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
					+ formatString (msgBottomEdge1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexTopRight+ctlVertexBottomRight then
					UserBufferAddText (formatString (msgLeftEdge1_L, message, testShapeDesc))
					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc +cscSpace
					+ formatString (msgLeftEdge1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexBottomRight+ctlVertexBottomLeft then
					UserBufferAddText (formatString (msgTopEdge1_L, message, testShapeDesc))
					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
					+ formatString (msgTopEdge1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexBottomLeft+ctlVertexTopLeft then
					UserBufferAddText (formatString (msgRightEdge1_L, message, testShapeDesc))
	 				let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc +cscSpace
	 				+formatString (msgRightEdge1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexTopLeft then
					UserBufferAddText (formatString (msgBottomRightCorner1_L, message, testShapeDesc))
 					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
 					+ formatString (msgBottomRightCorner1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexTopRight then
					UserBufferAddText (formatString (msgBottomLeftCorner1_L, message, testShapeDesc))
 					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
 					+ formatString (msgBottomLeftCorner1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexBottomRight then
					UserBufferAddText (formatString (msgTopLeftCorner1_L, message, testShapeDesc))
 					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
 					+ formatString (msgTopLeftCorner1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexBottomLeft then
					UserBufferAddText (formatString (msgTopRightCorner1_L, message, testShapeDesc))
	 				let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
	 				+ formatString (msgTopRightCorner1_L, message, testShapeDesc)
				endIf
				let atLeastOneOverlap = true
			endIf
		Else
			if describeOverlap
			&& overlapFlag then
				if overlapFlag == ctlCovered then
					SayUsingVoice(voice, formatString (msgIsCoveredBy1_L, message, testShapeDesc), ot_help)
					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
					+ formatString (msgIsCoveredBy1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexTopLeft + ctlVertexTopRight + ctlVertexBottomRight + ctlVertexBottomLeft then
					; is on top of test shape
					SayUsingVoice (voice, formatString (msgIsOntopOf1_L, message, testShapeDesc), ot_help)
					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
					+ formatString(msgIsOntopOf1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexTopLeft+ctlVertexTopRight then
					SayUsingVoice (voice, formatString (msgBottomEdge1_L, message, testShapeDesc), ot_help)
					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
					+ formatString (msgBottomEdge1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexTopRight+ctlVertexBottomRight then
					SayUsingVoice (voice, formatString (msgLeftEdge1_L, message, testShapeDesc), ot_help)
					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
					+ formatString (msgLeftEdge1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexBottomRight+ctlVertexBottomLeft then
					SayUsingVoice (voice, formatString (msgTopEdge1_L, message, testShapeDesc), ot_help)
					let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
					+ formatString (msgTopEdge1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexBottomLeft+ctlVertexTopLeft then
					SayUsingVoice (voice, formatString (msgRightEdge1_L, message, testShapeDesc), ot_help)
	 				let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
	 				+ formatString (msgRightEdge1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexTopLeft then
					SayUsingVoice (voice, formatString (msgBottomRightCorner1_L, message, testShapeDesc), ot_help)
	 				let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
	 				+ formatString (msgBottomRightCorner1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexTopRight then
					SayUsingVoice (voice, formatString (msgBottomLeftCorner1_L, message, testShapeDesc), ot_help)
	 				let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
	 				+ formatString (msgBottomLeftCorner1_L, message, testShapeDesc)
				elif overlapFlag == ctlVertexBottomRight then
					SayUsingVoice (voice, formatString (msgTopLeftCorner1_L, message, testShapeDesc), ot_help)
	 				let globalBrlShapeOverlapDesc=globalBrlShapeOverlapDesc+cscSpace+formatString(msgTopLeftCorner1_L, message, testShapeDesc)
				elif overlapFlag==ctlVertexBottomLeft then
					SayUsingVoice(voice,formatString(msgTopRightCorner1_L, message, testShapeDesc),ot_help)
	 				let globalBrlShapeOverlapDesc = globalBrlShapeOverlapDesc + cscSpace
	 				+ formatString (msgTopRightCorner1_L, message, testShapeDesc)
				endIf
				let atLeastOneOverlap = true
			endIf
		endIf
	EndIf
	let index = (index+1)
endWhile
return atLeastOneOverlap
EndFunction

void function doShapeOverlapTest ()
var
	object slide,
	object shape
let slide = oPpt.activeWindow.view.slide
let shape = oPpt.activeWindow.selection.shapeRange(1)
testShapeOverlap (shape, slide.shapes, true, vctx_pcCursor)
endFunction

int function PostSlideToUserBuffer (object slide)
;if no ttext is found, return false so that an error message is announced.
var
	int iShapeIndex,
	int iShapeCount,
	object oShapes,
	object oShape,
	object oTextRange,
	object oFont,
	string sText,
	string sFontName,
	Int iFontSize,
	int iFontColor,
	int iTextFound ; true if text is found and added to the user buffer, false otherwise.
let iTextFound=false
let oShapes=slide.shapes
let iShapeCount = oShapes.count
let iShapeIndex = 1
while (iShapeIndex <= iShapeCount)
	let oShape=oShapes(iShapeIndex)
	if oShape.hasTextFrame  then
		if oShape.textFrame.hasText then
			let oTextRange = oShape.textFrame.textRange
			let sText=oTextRange.text
			if sText!=cscNull then
				let oFont=oTextRange.font
				let sFontName=oFont.name
				let iFontSize=oFont.size
				let iFontColor=oFont.color
				; For those rare incidents such as Notes:
				;Powerpoint uses char \r to represent newline, rather than a normal BufferNewLine \r\n
				let sText = stringReplaceSubstrings (sText, "\r", "\n")
				UserBufferAddText (sText, cscNull, cscNull,sFontName,iFontSize, getFontObjAttributes (oFont),iFontColor)
				let iShapeIndex = (iShapeIndex+1)
				let iTextFound=true
			endIf
		endIf
	endIf
	let iShapeIndex = (iShapeIndex+1)
endWhile
return iTextFound
endFunction

void function readSpeakersNotes ()
var
	object slide,
	object notesPages,
	int index,
	int count,
	int iRead ; whether to read notes or return an error that no notes exist for this slide.
let iRead=false
let slide= getSlideWithFocus ()
let notesPages = slide.notesPage
let count = notesPages.count
let index = 1
UserBufferClear ()
UserBufferActivate ()
while (index <= count)
	let iRead=postSlideToUserBuffer (notesPages(index))
	let index = (index+1)
endWhile
if iRead then
	JAWSTopOfFile ()
	sayAll ()
else
	sayMessage(ot_error,msgSpeakerNotesError)
	ReloadSlideShowScreen()
endIf
EndFunction

void function resetSlideShowPointers ()
let globalParaIndexPointer = 1 ; does not point anywhere yet
let globalShapeIndex = 1
let globalPriorSlideIndex = 0
endFunction

int Function BrailleAddObjectShapeDescription (int nType)
var
	string sDesc,
	object oShape
let oShape  =oPpt.activeWindow.selection.shapeRange(1)
let sDesc = GetShapeDescription (oShape)
if oShape.actionSettings(ppMouseOver).action() == ppActionHyperlink then
  let sDesc = sDesc+cscSpace + msg79_L ; link
  let sDesc = sDesc + cscSpace + getHyperlinkAddress (oShape.actionSettings(ppMouseOver).hyperlink())
elif oShape.actionSettings(ppMouseClick).action() == ppActionHyperlink then
	let sDesc = sDesc + cscSpace + msg79_L ; link
  let sDesc = sDesc + cscSpace + getHyperlinkAddress (oShape.actionSettings(ppMouseClick).hyperlink())
endIf
if sDesc != cscNull then
	BrailleAddString (sDesc, 0, 0, 0)
	return true
else
	BrailleAddString (msg86_L, 0, 0, 0)
	return true
endIf
endFunction

int Function BrailleAddObjectShapeText (int nType)
var
	string sText,
	object oShape
let oShape = oPpt.activeWindow.selection.shapeRange(1)
if oShape.textFrame.hasText() then
	let sText = oShape.textFrame.TextRange.text()
endIf
if sText != cscNull then
	BrailleAddString (sText, 0, 0, 0)
	return true
else
	return false
endIf
endFunction

int Function BrailleAddObjectOverlapDescription (int nType)
if globalDetectOverlappingShapes && globalBrlShapeOverlapDesc != cscNull then
	BrailleAddString (globalBrlShapeOverlapDesc, 0, 0, 0)
	return true
else
	return false
endIf
endFunction

int Function BrailleAddObjectPPTBLCoordinates (int nType)
var
	string sCoordinates,
	int iColCount,
	int iRowcount,
	object oFocusedShape,
	int iCol,
	int iRow,
	object oShape, ; shape attached to textRange
	object oTable,
	object oCell
If ! giBrlShowCoords then
	return false
EndIf
; get the shape being edited
let oShape = oPpt.activeWindow.selection.textRange.parent.parent
; get the top level shape pointed to by the selection object
let oFocusedShape = oPpt.activeWindow.selection.shapeRange(1)
; look for embedded native Powerpoint table,
if oFocusedShape.hasTable then
	let oTable = oFocusedShape.table
	let iColCount = oTable.columns.count
	let iRowCount = oTable.rows.count
; now determine which cell the focused shape is attached to
	let iRow = 1
	while (iRow <= iRowCount)
		let iCol = 1
		while (iCol <= iColCount)
			let oCell = oTable.cell(iRow,iCol)
			if oCell.shape.name == oShape.name then
	; found the focused cell, announce coordinates
				let sCoordinates = formatString (msgTableCoordinates2, intToString (iCol), intToString (iRow))
				let iCol = iColCount
				let iRow = iRowCount
			endIf
			let iCol = (iCol+1)
		endWhile
		let iRow = (iRow+1)
 endWhile
endIf
if sCoordinates != cscNull then
	BrailleAddString (sCoordinates, 0, 0, 0)
	return true
else
	return false
endIf
endFunction

int Function BrailleAddObjectPPTBLCellContent (int nType)
var
	string sContent
let sContent = getCellContents ()
if sContent != cscNull then
	BrailleAddString (sContent, 0, 0, 0)
	return true
else
	return false
endIf
endFunction

int function BrailleAddObjectPPTBLDimensions (int NType)
var
	string sDim
let sDim = GetTableDimensions (oPpt.activeWindow.selection.shapeRange(1).table)
if sDim != cscNull then
	BrailleAddString (sDim, 0, 0, 0)
	return true
else
	return false
endIf
endFunction

int Function BrailleAddObjectSlideTitle (int nType)
var
	string sTitleOrIndex
let sTitleOrIndex = GetSlideTitleOrIndexNumber (oPpt.activeWindow.selection.slideRange(1))
if sTitleOrIndex != cscNull then
	BrailleAddString (sTitleOrIndex, 0, 0, 0)
	brailleAddString (GetCurrentSlideNotesAndCommentsInfo (), 0, 0, 0)
	return true
else
	return false
endIf
endFunction

int function BrailleAddObjectSlideLayout (int nType)
var
	string sLayoutDescription
let sLayoutDescription = GetSlideLayout (oPpt.activeWindow.selection.slideRange(1))
if sLayoutDescription != cscNull then
	BrailleAddString (sLayoutDescription, 0, 0, 0)
	return true
else
	return false
endIf
endFunction

int function BrailleAddObjectXLWSCoordinates (int nType)
var
	string sCoordinates
let sCoordinates = OPpt.activeWindow.selection.shapeRange(1).OleFormat.object.application.activeCell.addressLocal(false,false)
if sCoordinates != cscNull then
	BrailleAddString (sCoordinates, 0, 0, 0)
else
	BrailleAddString (msg98_L, 0, 0, 0)
endIf
return true
endFunction

int function BrailleAddObjectXLWSCellContent (int nType)
var
	string sText
let sText = OPpt.activeWindow.selection.shapeRange(1).OleFormat.object.application.activeCell.text
if sText != cscNull then
	BrailleAddString (sText, 0, 0, 0)
	return true
else
	return false
endIf
endFunction

int function BrailleAddObjectPHDesc (int nType)
var
	string sPHDesc
let sPhDesc = GetShapePlaceHolderDescription (oPpt.activeWindow.selection.shapeRange(1))
if sPHDesc != cscNull then
	BrailleAddstring (sPHDesc, 0, 0, 0)
	return true
else
	BrailleAddString (msg86_L, 0, 0, 0)
	return true
endIf
endFunction

int Function BrailleAddObjectSelectedSlides (int nType)
var
	object oSel,
	int iCount,
	int iIndex
let oSel = oPpt.activeWindow.selection.slideRange
let iCount = oSel.count
let iIndex = 1
while (iIndex <= iCount)
	BrailleAddString (intToString (oSel(iIndex).slideIndex), 0, 0 ,0)
	BrailleAddString (getSlideTitleOrIndexNumber (oSel(iIndex)), 0, 0, 0)
	let iIndex= iIndex + 1
endWhile
return true
endFunction

int Function BrailleAddObjectSlideId (int nType)
var
	int iId
let iId = oPpt.activeWindow.selection.slideRange(1).slideIndex
if iId then
	BrailleAddString (intToString (iId), 0, 0, 0)
	return true
else
	BrailleAddString (msg86_L, 0, 0, 0)
	return true
endIf
endFunction

int function BrailleAddObjectSlidePosition (int nType)
var
	int iIndex,
	int iCount
let iIndex = oPpt.activeWindow.selection.slideRange(1).slideIndex
let iCount = oPpt.activePresentation.slides.count
if iIndex && iCount then
	BrailleAddString (formatString (msgXOfY, intToString (iIndex), intToString (iCount)), 0, 0, 0)
	return true
else
	return false
endIf
endFunction

int Function BrailleAddObjectSelectedShapes (int nType)
var
	object oSel,
	int iIndex,
	int iCount
let oSel = oPpt.activeWindow.selection.shapeRange
let iIndex = 1
let iCount = oSel.count
while (iIndex <= iCount)
	BrailleAddString (oSel(iIndex).name, 0, 0, 0)
	let iIndex = (iIndex+1)
endWhile
return true
endFunction

int function BrailleAddObjectUserControlType (int nType)
var
	int CId,
	string Name,
	string class,
	handle hFocus
let hFocus = getFocus ()
let class = GetWindowClass (hFocus)
let name = getWindowName (getParent (hFocus))
let CId = getControlId (hFocus)
if name == wn_BulletDlgTitle then
	if CId == BulletColorMenuId then
		BrailleAddString (BrailleGetSubtypeString (WT_MENU),0,0,0)
		return true
	endIf
elif name == wn_BackgroundDlgTitle then
	if CId == FillTypeMenuId then
		BrailleAddString (BrailleGetSubtypeString (WT_MENU),0,0,0)
		return true
	EndIf
elif name == wn_ColorSchemeDlgTitle then
	BrailleAddString (BrailleGetSubtypeString (GetObjectTypeCode ()), 0, 0, 0)
	return true
elif name == wn_SetupShowDlgTitle && cId == PenId then
	BrailleAddString (BrailleGetSubtypeString (WT_MENU), 0, 0, 0)
	return true
elif name == wn_customAnimationDlgTitle
&& cId == cId_animationAfterEffect then
	BrailleAddString (BrailleGetSubtypeString (WT_MENU), 0, 0, 0)
	return true
elif getDialogPageName () == wn_findPresentation then
	if cId == cId_slideMiniatureDisplay then
		BrailleAddString (BrailleGetSubtypeString (getObjectTypeCode ()), 0, 0, 0)
		return true
	endIf
else
	return false
endIf
endFunction

int function BrailleAddObjectUserControlText (int nType)
var
	int CId,
	string Name,
	string class,
	handle hFocus
let hFocus = getFocus ()
let class = GetWindowClass (hFocus)
let name = getWindowName (getParent (hFocus))
let CId = getControlId (hFocus)
if name == wn_NewSlideDlgTitle || name == wn_SlideLayoutDlgTitle then
	BrailleAddString (GetWindowText (FindDescendantWindow (getRealWindow (hFocus), NewSlideTypeId), read_everything), GetCursorCol (), GetcursorRow (), attrib_highlight)
	return true
elif name == wn_BulletDlgTitle then
	if CId == BulletColorMenuId then
		BrailleAddFocusLine ()
		return true
	elif CId == BulletTypeId then
		BrailleAddString (GetWord (), getCursorCol (), getCursorRow (),getCharacterAttributes ())
		return true
	endIf
elif name == wn_BackgroundDlgTitle then
	if CId == FillTypeMenuId then
		BrailleAddFocusLine ()
		return true
	EndIf
elif name == wn_SetupShowDlgTitle && cId == PenId then
	BrailleAddFocusLine ()
	return true
elif name == wn_customAnimationDlgTitle
&& cId == cId_animationAfterEffect then
	BrailleAddFocusLine ()
	return true
else
	return false
endIf
endFunction

int function GetSelectionType ()
return oPpt.activeWindow.selection.type
EndFunction

String Function GetInchesFromPoints (Int iPoints)
Var
	string sInches,
	string sRounded

; Since the scripting language does not provide floating point caculations, we convert using the following kludge:
sInches = IntToString ((iPoints * 100) / 72)	; 72 points=1 inch.
If StringLength (sInches) < 3	; only fraction is present because less then one inch...
	sRounded = cscPeriod + sInches
Else
	sRounded = stringChopRight (sInches, 2) + cscPeriod + StringRight (sInches, 2)
EndIf
return sRounded
EndFunction

String Function GetCentimetersFromPoints (int points)
;1 cm = approximately 28.346 postscript points.
;since we are not using floating points, we will calculate as 28 points to approximately 1 cm, while noting that 3/10 of a cm = a potential error in dimensions.
Var
	string sCM,
	string sRounded
; Since the scripting language does not provide floating point calculations,
;we convert using the following kludge:
If points < 28 then ; less than one inch
	Let points = points*100/28
	let sCM = IntToString(points)
	If StringToInt (SubString (sCM, 3, 1)) >= 6 then ; round up
		let points = (points+10)   ; round up
	EndIf
	let sCM = IntToString (points)
	let sRounded = cscPeriod + SubString (sCM, 1, 2)
Else
	Let points = points*100/28
	let sCM = IntToString (points)
	if StringToInt (SubString (sCM, 4,1)) >= 6 then ; round up
		let points = (points+10)/10 ; Truncate to three digits.
	Else
		let points = points/10 ; Truncate to three digits.
	EndIf
	let sCM = IntToString (points)
	let sRounded = SubString (sCM, 1, 1) + cscPeriod + SubString (sCM, 2, 2)
EndIf
return sRounded
EndFunction

int Function PointsToScreenPixelsX (int nPointsX)
return oPPT.ActiveWindow.PointsToScreenPixels.X(nPointsX)
endFunction

int Function PointsToScreenPixelsY (int nPointsY)
return oPPT.ActiveWindow.PointsToScreenPixelsY(nPointsY)
endFunction

Void Function MoveToHyperlink (string address, string subAddress)
if UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
UserBufferClear ()
oPpt.activePresentation.followHyperlink(address,subAddress)
EndFunction

String Function GetActivePaneView ()
return oPpt.activeWindow.activePane.viewType
EndFunction

Int Function IsSlideHidden ()
If GetSlideWithFocus ().slideshowTransition.hidden then
	return true
else
	return false
endIf
EndFunction

Void Function SayObjectDescription ()
var
	object shape,
	int shapeIndex,
	int shapeCount,
	object slide,
	string sDesc
let slide = getSlideWithFocus ()
let shapeCount = slide.shapes.count
if ! shapeCount then
  return
endIf
let giObjectOnly = true
let shapeIndex = 1
while (shapeIndex <= ShapeCount)
  let shape = slide.shapes(shapeIndex)
  let sDesc = GetShapeSummaryText (shape)
  if sDesc != cscNull then
	  SayUsingVoice (vctx_message, FormatString (msgObjectDescription, intToString (shapeIndex), sDesc), ot_help)
	EndIf
  let ShapeIndex = (ShapeIndex+1)
EndWhile
let giObjectOnly = false
EndFunction

Int Function BrailleAddObjectName (int nType)
var
	object shape,
	string sName
if nType == wt_SplitButton then
	BrailleAddString (GetObjectName (), 0, 0, 0)
	BrailleAddString (GetObjectValue(SOURCE_CACHED_DATA), 0, 0, 0)
	return true
EndIf
if isPPTEditMode () then
	;BrailleAddObjectShapeText (wt_edit)
	shape = oPpt.activeWindow.selection.shapeRange(1)
	sName = GetShapePlaceHolderDescription (shape)
	if stringIsBlank (sName) then
	;Not idea, since you're going to get the underlying name, e.g. 'Title1', 'Title2', 'Text1', etc.
	;This is when the item has not actually been named on the slide. Note that is different than the text itself.
	;It's like the failure to name a control in a UI, only invisible to users.
		sName = shape.name
	endIf
	brailleAddString (sName, 0,0,0)
	return TRUE
EndIf
return BrailleAddObjectName (nType)
EndFunction

Int Function BrailleAddObjectContainerName (int nType)
; must overwrite here to avoid group information to be double-Brailled when in structured mode for lower ribbons.
If inRibbons () then
	return true
Else
	return BrailleAddObjectContainerName(nType)
EndIf
EndFunction


Void function SelectComment ()
var
	object oComment,
	int index,
	string sList,
	string sCommentInfo,
	int iCount,
	int iChoice,
	object slide
if isSlideShow () then
	SayMessage (ot_error, msg88_L) ; cannot use this function in this view.
	return
endIf
let slide = getSlideWithFocus ()
if ! slide then
  SayMessage (ot_error, msg88_L) ; cannot use this function in this view.
  return
endIf
let iCount = slide.comments.count
if ! iCount then
  SayMessage (ot_error, msgNoComments)
  return
endIf
let index = 1
while index <= iCount
  let oComment = slide.comments(index)
  let sCommentInfo=formatString(msgCommentInfo,oComment.text,oComment.author)
  let sList = sList + list_item_separator + sCommentInfo
  let index = (index+1)
EndWhile
; remove leading delimiter to avoid empty item
let sList = stringChopLeft (sList, 1)
let iChoice = DlgSelectItemInList (sList, msgCommentsListTitle, false)
if iChoice > 0 then
  slide.comments(iChoice).select
endIf
EndFunction

String Function GetColorText ()
Var
	object oTextRange
let oTextRange=oPpt.activeWindow.selection.textRange
if oTextRange then
	return oTextRange.font.color.rgb
else
	return getColorText ()
EndIf
EndFunction

Void function SaySlidePosition ()
var
	int iIndex,
	int iCount
let iIndex = oPpt.activeWindow.selection.slideRange(1).slideIndex
let iCount = oPpt.activePresentation.slides.count
if iIndex && iCount then
	Say (formatString (msgXOfY, intToString (iIndex), intToString (iCount)), ot_position)
endIf
endFunction

int function TableErrorEncountered(optional int NavType)
var
	int bPost
let bPost = GetRunningFSProducts() == product_MAGic
if oPpt.activeWindow.selection.shapeRange(1).hasTable then
	if !isCaretInTable() then
		if bPost then
			exMessageBox(msgTableNavAvailableOnlyWhileEditing, cmsgTableNavErrorTitle, IDOK)
		else
			SayMessage (OT_error, msgTableNavAvailableOnlyWhileEditing)
		endIf
		Return true
	else ;table navigation is limited and does not include the following:
		if NavType == TABLE_NAV_ROW_EXTENTS
		|| NavType == TABLE_NAV_COLUMN_EXTENTS
		|| NavType == TABLE_NAV_SAY_COLUMN
		|| NavType == TABLE_NAV_SAY_ROW_PARTIAL
		|| NavType == TABLE_NAV_SAY_COLUMN_PARTIAL
		|| NavType == TABLE_NAV_JUMP then
			if bPost then
				exMessageBox(cmsgTableNavFeatureNotSupported, cmsgTableNavErrorTitle, IDOK)
			else
				SayMessage (OT_error, cmsgTableNavFeatureNotSupported)
			endIf
			Return true
		endIf
	endIf
else
	if bPost then
		exMessageBox(cMSGNotInTable_l, cmsgTableNavErrorTitle, IDOK)
	else
		SayMessage (OT_error, cMSGNotInTable_l, cMSGNotInTable_S)
	endIf
	Return true
endIf
return false
endFunction

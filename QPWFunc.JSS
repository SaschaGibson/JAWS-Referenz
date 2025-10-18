; QuatroPro 9.0/10.0  Script File 
; Copyright 2010-2015 by Freedom Scientific, Inc.
; This script file contains all object model interface and helper functions
include "hjconst.jsh"
include "hjglobal.jsh"
include "QpwFunc.jsh" ; Object Browser/PerfectScript constants
include "qpw.jsh" ; general constants for QuatroPro
include "common.jsm"
include "qpw.jsm"

void function autoStartEvent()
let oQP=CreateObject (QPObj)
endFunction

void function autoFinishEvent()
var
object null
let oQP=null
endFunction

int function stringsEqual(string str1, string str2)
return str1==str2 && stringLength(str1)==stringLength(str2)
endFunction

String Function stripDollarSigns (string coordinates)
var
int index
let index=stringContains(coordinates,dollarSign)
while index
	let coordinates=subString(coordinates,1,index-1)+subString(coordinates,index+1,stringLength(coordinates))
	let index=stringContains(coordinates,dollarSign)
endWhile
return coordinates
EndFunction

String Function ColumnNumberToLetter (int i)
var
	int quotient,
	int remainder1,
	int remainder2
let i = i-1
let quotient = (i)/26
let remainder1 = quotient%27
let remainder2 = i%26
return SubString (alphabet, remainder1 + 1, 1) + cscSpace+ SubString (alphabet, remainder2 + 2, 1)
EndFunction

string Function BrlColumnNumberToLetter (int i)
var
	int quotient,
	int remainder1,
	int remainder2
let i = i-1
let quotient = (i)/26
let remainder1 = quotient%27
let remainder2 = i%26
return SubString (alphabet, remainder1 + 1, 1) + SubString (alphabet, remainder2 + 2, 1)
EndFunction

string Function getCellFormat ()
var
string format,
string prefix,
string suffix

let format=oQP.eval(cellFormatFunction)
oQP.quit()
if format==cscNull then
	return cscNull
endIf
let prefix=stringLeft(format,1)
let suffix=stringRight(format,stringLength(format)-1)
if prefix==cellFormatFn then
	return msgFormatFn+suffix
elif prefix==cellFormatSn then
	return msgFormatSn+suffix
elif prefix==cellFormatCn then
	return msgFormatCn+suffix
elif prefix==cellFormatG then
	return msgFormatG
elif prefix==cellFormatPn then
	return msgFormatPn+suffix
elif prefix==cellFormatD then
	if suffix==nOne then
		return msgFormatD1
	elif suffix==nTwo then
		return msgFormatD2
	elif suffix==nThree then
		return msgFormatD3
	elif suffix==nFour then
		return msgFormatD4
	elif suffix==nFive then
		return msgFormatD5
	elif suffix==nSix then
		return msgFormatD6
	elif suffix==nSeven then
		return msgFormatD7
	elif suffix==nEight then
		return msgFormatD8
	elif suffix==nNine then
		return msgFormatD9
	endIf
elif prefix==cellFormatT then
	return msgFormatT
elif prefix==cellFormatH then
	return msgFormatH
elif prefix==ceLlFormatU then
	return msgFormatU
else
	return format
endIf
EndFunction

Void Function saySelectedText ()
var
string sStartingCellCoordinates,
string sEndingCellCoordinates,
string sStartCellValue,
string sEndCellValue,
string sSelectedRange,
string sStartCellColTitle,
string sEndCellColTitle,
string sStartCellRowTitle,
string sEndCellRowTitle,
int iStartCellRow,
int iEndCellRow,
int iStartCellCol,
int iEndCellCol,
int iStartCellIsBlank,
int iEndCellIsBlank,
int iStartColTitleIsBlank,
int iStartRowTitleIsBlank,
int iEndColTitleIsBlank,
int iEndRowTitleIsBlank,
int iLongNotationFlag

if inSpreadSheet() then
	; the following line  returns a string of the form "a:", "a:..b:", "a:a1..b1 or a:a1..a:b1"
	let sSelectedRange=oQP.eval(selectedCellsFunction)
	; Extracts the starting cell coordinate of the selected range.
	let sStartingCellCoordinates = StringSegment (sSelectedRange, PeriodDelimiters, 1)
Let iLongNotationFlag = StringContains (sStartingCellCoordinates, ColenDelimiter)
	let sStartingCellCoordinates= stringChopLeft (sStartingCellCoordinates, iLongNotationFlag)
	; extracts the ending cell coordinate of the selected range.
	Let sEndingCellCoordinates = stringChopLeft (sSelectedRange, StringContains (sSelectedRange, PeriodDelimiters)+1)
	Let iLongNotationFlag = StringContains (sEndingCellCoordinates, ColenDelimiter)
; Is the ending cell coordinate using the Long cell address notation?
	If iLongNotationFlag  Then
		Let sEndingCellCoordinates= stringChopLeft (sEndingCellCoordinates, iLongNotationFlag)
	EndIf
	; get the value contained in the cells.
	let sStartCellValue=oQP.getCellValue(sStartingCellCoordinates)
	let sEndCellValue=oQP.getCellValue(sEndingCellCoordinates)
	; need to test cell type
	; because cell value might contain garbage when type is blank
	let iStartCellIsBlank=oQP.eval(formatString(cellTypeGeneralFunction,sStartingCellCoordinates))==cellTypeBlank
	let iEndCellIsBlank=oQP.eval(formatString(cellTypeGeneralFunction,sEndingCellCoordinates))==cellTypeBlank
; We need the numeric col and row as well as the string in a1 style notation
	let iStartCellCol=oQP.eval(formatString(cellColumnGeneralFunction,sStartingCellCoordinates))
	let iEndCellCol=oQP.eval(formatString(cellColumnGeneralFunction,sEndingCellCoordinates))
	let iStartCellRow=oQP.eval(formatString(cellRowGeneralFunction,sStartingCellCoordinates))
	let iEndCellRow=oQP.eval(formatString(cellRowGeneralFunction,sEndingCellCoordinates))
; get the start and end cell's row and col titles as appropriate
; also need to check these for type being blank
; otherwise value may contain garbage
	if globalTitleReading & ReadColumnTitles then
		let iStartColTitleIsBlank=oQP.eval(formatString(cellTypeGeneralFunction,columnNumberToLetter(iStartCellCol)+intToString(globalTitleRow)))==cellTypeBlank
		let sStartCellColTitle=oQP.getCellValue(columnNumberToLetter(iStartCellCol)+intToString(globalTitleRow))
		let iEndColTitleIsBlank=oQP.eval(formatString(cellTypeGeneralFunction,columnNumberToLetter(iEndCellCol)+intToString(globalTitleRow)))==cellTypeBlank
		let sEndCellColTitle=oQP.getCellValue(columnNumberToLetter(iEndCellCol)+intToString(globalTitleRow))
	endIf
	if globalTitleReading & readRowTitles then
		let iStartRowTitleIsBlank=oQP.eval(formatString(cellTypeGeneralFunction,columnNumberToLetter(globalTitleCol)+intToString(iStartCellRow)))==cellTypeBlank
		let sStartCellRowTitle=oQP.getCellValue(columnNumberToLetter(globalTitleCol)+intToString(iStartCellRow))
		let iEndRowTitleIsBlank=oQP.eval(formatString(cellTypeGeneralFunction,columnNumberToLetter(globalTitleCol)+intToString(iEndCellRow)))==cellTypeBlank
		let sEndCellRowTitle=oQP.getCellValue(columnNumberToLetter(globalTitleCol)+intToString(iEndCellRow))
	endIf
; terminate the object model calls
	oQP.quit()
	 ;cell types were blank then ensure the value is blank and not garbage
	if iStartCellIsBlank then
		let sStartCellValue=cmsgBlank1
	endIf
	if iEndCellIsBlank then
		let sEndCellValue=cmsgBlank1
	endIf
	if iStartColTitleIsBlank then
		let sStartCellColTitle=msgNoTitle
	endIf
	if iStartRowTitleIsBlank then
		let sStartCellRowTitle=msgNoTitle
	endIf
	if iEndColTitleIsBlank then
		let sEndCellColTitle=msgNoTitle
	endIf
	if iEndRowTitleIsBlank then
		let sEndCellRowTitle=msgNoTitle
	endIf
	; Now say the selection
	SayFormattedMessage(ot_JAWS_message, msgSelectedCells)
		if sStartingCellCoordinates==sEndingCellCoordinates then
; only one cell selected
		say(sStartingCellCoordinates,ot_no_disable)
		say(sStartCellValue,ot_no_disable)
		let qpwBrlCurrentObj=wt_custom_cell
	else
; a block of cells selected
; clean up braille vars
BrailleCleanVars ()
let qpwBrlCurrentObj=wt_custom_cell_selected
		if not globalTitleReading then
; just say the range
;sayFormattedMessage (OT_USER_BUFFER, formatString(msgCellRange, startingCellCoordinates, startCellValue, endingCellCoordinates, endCellValue))
			say(formatString(msgCellRange, sStartingCellCoordinates, sStartCellValue, sEndingCellCoordinates, sEndCellValue),ot_no_disable)
; Braille tracking, only want to do it if more than one cell selected
			let brlCellInfoStartCo=sStartingCellCoordinates
			let brlCellInfoStartValue=sStartCellValue
			let brlCellInfoEndCo=sEndingCellCoordinates
			let brlCellInfoEndValue=sEndCellValue
		else ; title reading is on
; announce the cell titles as appropriate
			say(sStartingCellCoordinates,ot_no_disable)
			let BrlCellInfoStartCo=sStartingCellCoordinates ; Braille tracking
			if globalTitleReading & readColumnTitles && iStartCellCol !=iEndCellCol then
				sayUsingVoice(vctx_message,sStartCellColTitle,ot_no_disable)
				let brlCellInfoStartColTitle=sStartCellColTitle
			endIf
			if globalTitleReading & readRowTitles && iStartCellRow !=iEndCellRow then
				sayUsingVoice(vctx_message,sStartCellRowTitle,ot_no_disable)
				let brlCellInfoStartRowTitle=sStartCellRowTitle
			endIf
			say(sStartCellValue,ot_no_disable)
			let brlCellInfoStartValue=sStartCellValue
			say(msgThrough,ot_no_disable)
			say(sEndingCellCoordinates,ot_no_disable)
			let brlCellInfoEndCo=sEndingCellCoordinates
			if globalTitleReading & readColumnTitles && iStartCellCol !=iEndCellCol then
				sayUsingVoice(vctx_message,sEndCellColTitle,ot_no_disable)
				let brlCellInfoEndColTitle=sEndCellColTitle
			endIf
			if globalTitleReading & readRowTitles && iStartCellRow !=iEndCellRow then
				sayUsingVoice(vctx_message,sEndCellRowTitle,ot_no_disable)
				let brlCellInfoEndRowTitle=sEndCellRowTitle
			endIf
			say(sEndCellValue,ot_no_disable)
			let brlCellInfoEndValue=sEndCellValue
		endIf
	endIf
	BrailleRefresh()
else ; not in the spreadsheet, call default function
	performScript saySelectedText() ; default
endIf
EndFunction

Void Function sayFont ()
var
string fontDetails,
string alignmentDetails,
string columnWidth,
string rowHeight,
string constraints,
string horizontalAlignment,
string verticalAlignment,
string orientation, ; horizontal or vertical?
string textWraps, ; text wraps in block?
string fontTypeFace,
string pointSize,
string bold,
string underline,
string italic,
string strikeout,
string style,
string type,
string prefix, ; label prefix character determining alignment
string format ; cell format, eg currency etc.

if inSpreadsheet() then
	let fontDetails=oQP.eval(CellfontFunction)
	let alignmentDetails=oQP.eval(cellAlignmentFunction)
	let style=oQP.eval(cellStyleFunction)
	let type=oQP.eval(cellTypeFunction)
	let prefix =oQP.eval(cellLabelAlignmentFunction)
	let columnWidth=oQP.eval(columnWidthFunction)
	let rowHeight=oQP.eval(rowHeightFunction)
	let constraints=oQP.eval(cellConstraintsFunction)
	oQP.quit()
	let fontTypeFace=stringSegment(fontDetails,ArgDelimiter,1)
	let pointSize=stringSegment(fontDetails,argDelimiter,2)
	let bold=stringSegment(fontDetails,argDelimiter,3)
	let italic=stringSegment(fontDetails,argDelimiter,4)
	let underline=stringSegment(fontDetails,argDelimiter,5)
	let strikeout=stringSegment(fontDetails,argDelimiter,6)

	let horizontalAlignment=stringSegment(alignmentDetails, argDelimiter,1)
	let verticalAlignment=stringSegment(alignmentDetails,argDelimiter,2)
	let textWraps=stringSegment(alignmentDetails,argDelimiter,3)
	let orientation=stringSegment(alignmentDetails,argDelimiter,4)
	say(formatString(msgFontIs, fontTypeFace, pointsize), ot_No_disable)
	if bold==attribOn then
		say(msgBold,ot_no_disable)
	endIf
	if italic==attribOn then
		say(msgItalic,ot_no_disable)
	endIf
	if underline==attribOn then
		say(msgUnderline,ot_no_disable)
	endIf
	if strikeout==attribOn then
		say(msgStrikeout,ot_no_disable)
	endIf
	SayFormattedMessage(ot_No_disable, formatString(msgStyle, style))
	SayFormattedMessage(ot_JAWS_message,msgCellType)
	if type==cellTypeLabel then
		say(MsgLabel,ot_no_disable)
		if prefix==cellLeftAligned then
			say(msgLeftAligned,ot_no_disable)
		elif prefix==cellCentered then
			say(msgCentered,ot_no_disable)
		elif prefix==cellRightAligned then
			say(msgRightAligned,ot_no_disable)
		endIf
	elif type==cellTypeBlank then
		say(cmsgBlank1,ot_no_disable)
	elif type==cellTypeValue then
		say(msgValue,ot_no_disable)
	endIf
	let format=getCellFormat()
	SayFormattedMessage(ot_no_disable,formatString(msgCellFormat, format))
	SayFormattedMessage(ot_no_disable,formatString(msgCellAlignmentHoriz,horizontalAlignment))
	SayFormattedMessage(ot_no_disable, formatString(msgCellAlignmentVert,verticalAlignment))
	SayFormattedMessage(ot_no_disable,formatString(msgOrientation, orientation))
	SayFormattedMessage(ot_no_disable, formatString(msgTextWraps, textWraps))
	SayFormattedMessage(ot_no_disable, formatString(msgColumnWidth, stringSegment(columnWidth,argDelimiter,1), stringSegment(columnWidth,argDelimiter,2)))
	if rowHeight!=cscNull then
		SayFormattedMessage(ot_no_disable, formatString(msgRowHeight, rowHeight))
	endIf
	SayFormattedMessage(ot_no_disable, formatString(msgCellConstraints, constraints))
else
	sayFont()
endIf
EndFunction

Void Function describeCellBorder ()
var
string borderDetails,
string top,
string left,
string right,
string bottom,
string bordersVisible
let bordersVisible=oQP.eval(sheetDisplayBordersFunction)
let borderDetails=oQP.eval(cellLineDrawingFunction)
oQP.quit()
SayFormattedMessage(ot_JAWS_message,msgCellBorder)
if borderDetails !=cscNull then
;Left, Top, Right, Bottom,...
	let left=stringSegment(borderDetails,argDelimiter,1)
	let top=stringSegment(borderDetails,argDelimiter,2)
	let right=stringSegment(borderDetails,argDelimiter,3)
	let bottom=stringSegment(borderDetails,argDelimiter,4)
	if top==defaultBorderType then
		let top=msgDefault
	endIf
	if right==defaultBorderType then
		let right=msgDefault
	endIf
	if bottom==defaultBorderType then
		let bottom=msgDefault
	endIf
	if left==defaultBorderType then
		let left=msgDefault
	endIf
	if left==top && right==top && bottom==top then
; all borders the same
		say(formatString(msgSurroundingBorder, top),ot_no_disable)
	else
		say(formatString(msgBorders, top, left, right, bottom),ot_no_disable)
	endIf
else
	say(msgCellBorderNone,ot_no_disable)
endIf
; borders visible? row, col
if stringSegment(bordersVisible,argDelimiter,1)==attribOn then
	say(msgRowBorders,ot_no_disable)
else
	say(msgNoRowBorders,ot_no_disable)
endIf
if stringSegment(bordersVisible,argDelimiter,2) ==attribOn then
	say(msgColumnBorders,ot_no_disable)
else
	say(msgNoColumnBorders,ot_no_disable)
endIf
EndFunction


Function sayChangedBorderComponents ()
var
string borderDetails,
string top,
string left,
string right,
string bottom,
string bordersVisible
let bordersVisible=oQP.eval(sheetDisplayBordersFunction)
let borderDetails=oQP.eval(cellLineDrawingFunction)
oQP.quit()
if borderDetails !=cscNull then
;Left, Top, Right, Bottom,...
	let left=stringSegment(borderDetails,argDelimiter,1)
	let top=stringSegment(borderDetails,argDelimiter,2)
	let right=stringSegment(borderDetails,argDelimiter,3)
	let bottom=stringSegment(borderDetails,argDelimiter,4)
	if top!=globalPriorTopBorder then
		let globalPriorTopBorder=top
		if top==defaultBorderType then
			let top=msgDefault
		endIf
		sayUsingVoice(vctx_message,formatString(msgTop,top),ot_no_disable)
	endIf
	if right!=globalPriorRightBorder then
		let globalPriorRightBorder=right
		if right==defaultBorderType then
			let right=msgDefault
		endIf
		sayUsingVoice(vctx_message,formatString(msgRight,right),ot_no_disable)
	endIf
	if bottom!=globalPriorBottomBorder then
		let globalPriorBottomBorder=bottom
		if bottom==defaultBorderType then
			let bottom=msgDefault
		endIf
		sayUsingVoice(vctx_message, formatString(msgBottom,bottom),ot_no_disable)
	endIf
	if left!=globalPriorLeftBorder then
		let globalPriorLeftBorder=left
		if left==defaultBorderType then
			let left=msgDefault
		endIf
		sayUsingVoice(vctx_message, formatString(msgLeft,left),ot_no_disable)
	endIf
else
	sayUsingVoice(vctx_message,msgCellBorderNone,ot_no_disable)
endIf
EndFunction

string Function formatTimeOrDate (string valueStr, string format)
var
int hour,
int minute,
int second,
int day,
int dayOfWeek,
string dayName,
int month,
int year,
string HourWithLeadingZero,
string minuteWithLeadingZero,
string secondWithLeadingZero,
string yearSuffix,
string suffix

let year=oQP.eval(formatString(dateYearFunction,valueStr))
let month=oQP.eval(formatString(dateMonthFunction,valueStr))
let day=oQP.eval(formatString(dateDayFunction,valueStr))
let dayOfWeek=oQP.eval(formatString(dateDayOfWeekFunction,valueStr))
let dayName=stringSegment(dayNames,argDelimiter,dayOfWeek)
let hour=oQP.eval(formatString(timeHoursFunction,valueStr))
let minute=oQP.eval(formatString(timeMinutesFunction,valueStr))
let second=oQP.eval(formatString(timeSecondsFunction,valueStr))
oQP.quit
let year=year+dateZeroYear ; add 1900
let yearSuffix=stringRight(intToString(year),2)
if hour < 10 then
	let hourWithLeadingZero=nZero+intToString(hour)
else
	let hourWithLeadingZero=intToString(hour)
endIf
if minute < 10 then
	let minuteWithLeadingZero=nZero+intToString(minute)
else
	let MinuteWithLeadingZero=intToString(minute)
endIf
if second < 10 then
	let secondWithLeadingZero=nZero+intToString(second)
else
	let secondWithLeadingZero=intToString(second)
endIf
let suffix=stringRight(format,1) ; 1 to 9 corresponding to the format identifier
; DateD1 = DD-MMM-YY
if suffix==nOne then
	return formatString(msgD1, intToString(day), stringSegment(shortMonths,argDelimiter,month), yearSuffix)
;D2 = DD-MMM
elif suffix==nTwo then
	return formatString(msgD2, intToString(day), stringSegment(shortMonths,argDelimiter,month))
;D3 = MMM-YY
elif suffix==nThree then
	return formatString(msgD3, stringSegment(shortMonths,argDelimiter,month), yearSuffix)
;D4 = MM/DD/YY, DD/MM/YY, DD.MM.YY, YY-MM-DD
elif suffix==nFour then
	return formatString(msgD4, dayName, intToString(day), stringSegment(longMonths,argDelimiter,month), intToString(year))
;D5 = MM/DD, DD/MM, DD.MM, MM-DD
elif suffix==nFive then
	return formatString(msgD5, intToString(day), intToString(month))
;D6 = HH:MM:SS AM/PM
elif suffix==nSix then
	if hour > 12 then
; pm
		let hour=hour-12
		if hour < 10 then
			let hourWithLeadingZero=nZero+intToString(hour)
		else
			let hourWithLeadingZero=intToString(hour)
		endIf
		return formatString(msgD6, hourWithLeadingZero, minuteWithLeadingZero, secondWithLeadingZero, timePm)
	else ; am
		return formatString(msgD6, hourWithLeadingZero, minuteWithLeadingZero, secondWithLeadingZero, timeAm)
	endIf
;D7 = HH:MM AM/PM
elif suffix==nSeven then
	if hour > 12 then
; pm
		let hour=hour-12
		if hour < 10 then
			let hourWithLeadingZero=nZero+intToString(hour)
		else
			let hourWithLeadingZero=intToString(hour)
		endIf
		return formatString(msgD7, hourWithLeadingZero, minuteWithLeadingZero, timePm)
	else ; am
		return formatString(msgD7, hourWithLeadingZero, minuteWithLeadingZero, timeAm)
	endIf
;D8 = HH:MM:SS-24hr, HH.MM.SS-24hr, HH,MM,SS-24hr, HHhMMmSSs
elif suffix==nEight then
	return formatString(msgD8, hourWithLeadingZero, minuteWithLeadingZero, secondWithLeadingZero)
;D9 = HH:MM-24hr, HH.MM-24hr, HH,MM, HHhMMm.
elif suffix==nNine then
	return formatString(msgD9, intToString(hour), minuteWithLeadingZero)
endIf
EndFunction

string Function getColumnTitle ()
var
int col,
int row,
string title,
string type,
string format,
string coordinates
if globalTitleReading !=readColumnTitles && globalTitleReading !=readBothTitles then
; do nothing
	return cscNull
endIf

let col=oQP.eval(cellColumnFunction)
let Row=oQP.eval(cellRowFunction)
let coordinates=columnNumberToLetter(col)+intToString(globalTitleRow)
let format=oQP.eval(formatString(cellFormatGeneralFunction,coordinates))
let type=oQP.eval(formatString(cellTypeGeneralFunction,coordinates))
let title=oQP.getCellValue(coordinates)
oQP.quit()
if row > globalTitleRow then
	if type==cellTypeBlank then
		return formatString(msgColNoTitle, columnNumberToLetter(col))
	else
		if stringLeft(format,1)==cellFormatD then
			let title=formatTimeOrDate(title,format)
		endIf
		return title
	endIf
else ; in the row containing column titles itself
	return cscNull
endIf
EndFunction

string Function getRowTitle ()
var
int col,
int row,
string format,
string title,
string type,
string coordinates

if globalTitleReading !=readRowTitles && globalTitleReading!=readBothTitles then
; do nothing
	return cscNull
endIf

let row=oQP.eval(cellRowFunction)
let col=oQP.eval(cellColumnFunction)
let coordinates=columnNumberToLetter(globalTitleCol)+intToString(row)
let format=oQP.eval(formatString(cellFormatGeneralFunction,coordinates))
let type=oQP.eval(formatString(cellTypeGeneralFunction,coordinates))
let title=oQP.getCellValue(coordinates)
oQP.quit()
if col > globalTitleCol then
	if type ==cellTypeBlank then
		return formatString(msgRowNoTitle, intToString(row))
	else
		if stringLeft(format,1)==cellFormatD then
			let title=formatTimeOrDate(title,format)
		endIf
		return title
	endIf
else ; in the column containing row titles itself
	return cscNull
endIf
EndFunction

String Function getMonitorCellInfo (int index)
var
string format,
string coordinates,
string value
if stringLength(globalMonitorCells)==2*maxMonitorCells then
	return cscNull
endIf
let coordinates=stringSegment(globalMonitorCells,list_item_separator,index)
if coordinates==monitorCellUndefined then
	return cscNull
endIf
if oQP.eval(formatString(cellTypeGeneralFunction,coordinates))!=cellTypeBlank then
	let value=oQP.getCellValue(coordinates)
	let format=oQP.eval(formatString(cellFormatGeneralFunction,coordinates))
	if stringLeft(format,1)==cellFormatD then
; date or time field, need to format it
		let value=formatTimeOrDate(value,format)
	endIf
endIf
oQP.quit()
return formatString(msgMonitorCellInfo, stripDollarSigns(coordinates), value)
EndFunction

void function spellCell()
var
string coordinates,
string type,
string value,
string formattedTimeOrDate,
string format,
string formula

let coordinates=oQP.eval(CellCoordinatesFunction)
let value=oQP.getCellValue(coordinates)
let type=oQP.eval(cellTypeFunction)
let formula=oQP.getCellFormula(coordinates)
let format=oQP.eval(cellFormatFunction)
oQP.quit()
if type !=cellTypeBlank then
	if stringLeft(format,1)==cellFormatD then
		let formattedTimeOrDate=formatTimeOrDate(value,format)
		spellString(formattedTimeOrDate)
	else
		spellString(value)
	endIf
else
	SayFormattedMessage(ot_JAWS_message, cMsgBlank1,cMsgSilent)
endIf
endFunction

void Function sayCurrentCell ()
var
int currentRow,
int currentColumn,
string coordinates,
string type,
string value,
string formattedTimeOrDate,
string format,
string formula,
string rowTitle,
string colTitle

; clean up braille variables
BrailleCleanVars ()
let qpwBrlCurrentObj=wt_custom_cell

let coordinates=oQP.eval(CellCoordinatesFunction)
let currentRow=oQP.eval(cellRowFunction)
let currentColumn=oQP.eval(cellColumnFunction)
let value=oQP.getCellValue(coordinates)
let type=oQP.eval(cellTypeFunction)
let formula=oQP.getCellFormula(coordinates)
let format=oQP.eval(cellFormatFunction)
oQP.quit()
; remove the dollar signs
let coordinates=stripDollarSigns(coordinates)
let brlCellInfoCo=coordinates
if globalTitleReading & readColumnTitles then
	let colTitle=getColumnTitle()
	if currentColumn != globalPriorCol then
; moved columns, announce column title
		sayUsingVoice (vctx_message,colTitle, ot_no_disable)
	endIf
	let globalPriorCol=currentColumn
endIf
if globalTitleReading & readRowTitles then
	let RowTitle=getRowTitle()
	if currentRow !=globalPriorRow then
; moved rows, announce row title
		sayUsingVoice (vctx_message,rowTitle, ot_no_disable)
	endIf
	let globalPriorRow=currentRow
endIf
if rowTitle!=cscNull then
	let brlCellInfoRowTitle=RowTitle
endIf
if colTitle!=cscNull then
	let brlCellInfoColTitle=colTitle
endIf
; let brlCellInfo=brlCellInfo+cscSpace
if type !=cellTypeBlank then
	if stringLeft(format,1)==cellFormatD then
		let formattedTimeOrDate=formatTimeOrDate(value,format)
		say(formattedTimeOrDate,ot_no_disable)
		let brlCellInfoValue=formattedTimeOrDate
	else
		say(value,ot_no_disable)
		let brlCellInfoValue=value
	endIf
else
	SayFormattedMessage(ot_JAWS_message, cmsgBlank1,cmsgSilent)
endIf
if formula !=value && formula !=cscNull && type==cellTypeValue then
	let brlCellInfoFormula=formula
	sayUsingVoice(vctx_message,msgHasFormula,ot_no_disable)
endIf
if globalCellReadingVerbosity == 0 && shouldItemSpeak(ot_position) then
	spellString(stringLower(coordinates))
endIf
if globalDetectCellNumberFormatChange then
	if format !=globalPriorCellFormat then
		sayUsingVoice(vctx_message,getCellFormat(),ot_no_disable)
		let globalPriorCellFormat=format
	endIf
	if globalDetectCellBorderChange then
		sayChangedBorderComponents()
	endIf
endIf
brailleAddMonitorCells()
BrailleRefresh()
EndFunction


Void Function sayCellCoordinates ()
var
string coordinates
if not shouldItemSpeak(ot_position)  then
	return
endIf
let coordinates=oQP.eval(cellCoordinatesFunction)
oQP.quit
spellString(stringLower(stripDollarSigns(coordinates)))
EndFunction

string function getCellCoordinates()
var
string coordinates
let coordinates=oQP.eval(cellCoordinatesFunction)
oQP.quit
return stripDollarSigns(coordinates)
EndFunction
Void Function saySheetIdentifier ()
var
string pageId

let pageId=oQP.eval(selectedCellsFunction)
oQP.quit
let pageId=stringSegment(pageId,scAddressDelimiter,1)
say(formatString(msgPage, pageId),ot_no_disable)
EndFunction


string Function getSheetName ()
var
string pageId

let pageId=oQP.eval(selectedCellsFunction)
oQP.quit
let pageId=stringSegment(pageId,scAddressDelimiter,1)
return pageId
EndFunction

string function getNotebookName()
var
string SName
let SName=oQP.EVAL(NotebookNameFunction)
oQP.QUIT
return sName
                                endFunction


string Function getWorksheetName()
var
string pageId

let pageId=oQP.eval(selectedCellsFunction)
oQP.quit
let pageId=stringSegment(pageId,scAddressDelimiter,1)
return formatString(msgPage, pageId)
EndFunction

Function sayCell ()
var
string coordinates,
string type,
string value,
string formattedTimeOrDate,
string format

let coordinates=oQP.eval(CellCoordinatesFunction)
let value=oQP.getCellValue(coordinates)
let type=oQP.eval(cellTypeFunction)
let format=oQP.eval(cellFormatFunction)
oQP.quit()
if type !=cellTypeBlank then
	if stringLeft(format,1)==cellFormatD then
		let formattedTimeOrDate=formatTimeOrDate(value,format)
		say(formattedTimeOrDate,ot_no_disable)
	else
		say(value,ot_no_disable)
	endIf
else
	SayFormattedMessage(ot_JAWS_message,cmsgBlank1,cmsgSilent)
endIf
EndFunction

Int Function upCell ()
var
int row,
int column,
string coordinates
if inSpreadsheet() then
	let row=oQP.eval(cellRowFunction)
	let column=oQP.eval(cellColumnFunction)
	if row > 1 then
		let coordinates=columnNumberToLetter(column)+intToString(row-1)
	oQP.selectBlock(coordinates)
	oQP.quit
	return true
	else
		oQP.quit
		return false
	endIf
else
	return false
endIf
EndFunction

Int Function downCell ()
var
int row,
int column,
string coordinates

if inSpreadsheet() then
	let row=oQP.eval(cellRowFunction)
	let column=oQP.eval(cellColumnFunction)
	if row < maxRows then
		let coordinates=columnNumberToLetter(column)+intToString(row+1)
	oQP.selectBlock(coordinates)
	oQP.quit
	return true
	else
		oQP.quit
		return false
	endIf
else
	return false
endIf
EndFunction

Int Function nextCell ()
var
int row,
int column,
string coordinates

if inSpreadsheet() then
	let row=oQP.eval(cellRowFunction)
	let column=oQP.eval(cellColumnFunction)
	if column < maxColumns then
		let coordinates=columnNumberToLetter(column+1)+intToString(row)
	oQP.selectBlock(coordinates)
	oQP.quit
	return true
	else
		oQP.quit
		return false
	endIf
else
	return false
endIf
EndFunction

Int Function priorCell ()
var
int row,
int column,
string coordinates

if inSpreadsheet() then
	let row=oQP.eval(cellRowFunction)
	let column=oQP.eval(cellColumnFunction)
	if column > 1 then
		let coordinates=columnNumberToLetter(column-1)+intToString(row)
	oQP.selectBlock(coordinates)
	oQP.quit
	return true
	else
		oQP.quit
		return false
	endIf
else
	return false
endIf
EndFunction

Void Function sayFormula ()
var
string formula
let formula=oQP.getCellFormula(oQP.eval(cellCoordinatesFunction))
oQP.quit()
if isSameScript() then
	messageBox(formula)
else
	say(formula,ot_no_disable)
endIf
EndFunction

string Function SetColTitlesToRow (int iRetCurVal)
if not iRetCurVal then
	;update the value
	let globalTitleRow=oQP.eval(cellRowFunction)
	oQP.quit()
	let globalTitleReading=globalTitleReading | ReadColumnTitles
EndIf
return formatString(msgSettingColumnTitlesToRow_S, intToString(globalTitleRow)) ; setting column titles to row n
EndFunction

string Function SetRowTitlesToColumn (int iRetCurVal)
var
	string colLetter
if not iRetCurVal then
	;update the value
	let globalTitleCol=oQP.eval(cellColumnFunction)
	oQP.quit()
	let globalTitleReading=globalTitleReading | readRowTitles
EndIf
return formatString(msgSettingRowTitlesToColumn_S, columnNumberToLetter(globalTitleCol)) ; setting row titles to column
EndFunction

string Function GetRowTotal ()
var
int currentRow
let currentRow=oQP.eval(cellRowFunction)
if globalRowTotalAutoFind then
	let globalTotalColumn=FindSumFormulaInRow(currentRow)
	if globalTotalColumn ==0 then
; no sum formula, can't say the total
	return cscNull
	; oQP.quit is done in findSumFormula function
	endIf
endIf
return oQP.getCellValue(columnNumberToLetter(globalTotalColumn)+intToString(currentRow))
EndFunction

int Function findSumFormulaInColumn (int column)
var
int index,
int count,
int row
let index=1
let count=maxRowsToSearch
while index <=count
	if stringContains(oQP.getCellFormula(columnNumberToLetter(column)+intToString(index)),globalTotalFormulaStr) then
		let row=index
		oQP.quit()
		return row
	endIf
	let index=index+1
endWhile
oQP.quit()
return 0
EndFunction

int Function findSumFormulaInRow (int row)
var
int index,
int count,
int col
let index=1
let count=maxColumns
while index <=count
	if stringContains(oQP.getCellFormula(columnNumberToLetter(index)+intToString(row)),globalTotalFormulaStr) then
		let col=index
		oQP.quit()
		return col
	endIf
	let index=index+1
endWhile
oQP.quit()
return 0
EndFunction

string Function GetColTotal ()
var
int currentColumn
let currentColumn=oQP.eval(cellColumnFunction)
if globalColumnTotalAutoFind then
	let globalTotalRow=FindSumFormulaInColumn(currentColumn)
	if globalTotalRow ==0 then
; no sum formula, can't say the total
	return cscNull
	; oQP.quit is done in findSumFormula function
	endIf
endIf
return oQP.getCellValue(columnNumberToLetter(currentColumn)+intToString(globalTotalRow))
EndFunction

string Function setTotalColumnToCurrent (int iRetCurVal)
var
	int currentColumn
if not iRetCurVal then
	;update the value
	let currentColumn=oQP.eval(cellColumnFunction)
	oQP.quit()
	let globalTotalColumn=currentColumn
	let globalRowTotalAutoFind=false
EndIf
return formatString(msgSettingRowTotalsColumnTo_S, columnNumberToLetter(currentColumn))
EndFunction

string Function setTotalRowToCurrent (int iRetCurVal)
var
	int currentRow
if not iRetCurVal then
	;update the value
	let currentRow=oQP.eval(cellRowFunction)
	oQP.quit()
	let globalTotalRow=currentRow
	let globalColumnTotalAutoFind=false
EndIf
return formatString(msgSettingColumnTotalsRowTo_S+intToString(currentRow))
EndFunction

Void Function ReadMonitorCell (int index)
var
string type,
string format,
string value,
string coordinates

let coordinates=stringSegment(globalMonitorCells,list_item_separator,index)
if coordinates==monitorCellUndefined then
	SayFormattedMessage (OT_error, formatString(msgMonitorCellUndefined, intToString(index)))
	return
endIf
SayFormattedMessage (ot_JAWS_message, stripDollarSigns(coordinates))
	SayFormattedMessage (ot_JAWS_message, msgEquals)
let type=oQP.eval(formatString(cellTypeGeneralFunction,coordinates))
let format=oQP.eval(formatString(cellFormatGeneralFunction,coordinates))
let value=oQP.getCellValue(coordinates)
oQP.quit()
if type!=cellTypeBlank then
	if stringLeft(format,1)==cellFormatD then
		SayFormattedMessage(ot_no_disable,formatTimeOrDate(value,format))
	else
		SayFormattedMessage(ot_no_disable,value)
	endIf
else
	SayFormattedMessage(ot_no_disable,cmsgBlank1)
endIf
EndFunction

String Function getNotebookJSIName ()
return formatString(jsiDocFileName, getNotebookName())
EndFunction

string Function getMonitorCellsSection ()
var
string sSheet
let sSheet=getWorksheetName()

return formatString(Section_monitorCells, sSheet)
EndFunction

Void Function setNthMonitorCellToCurrent (int index)
var
string sJsiName,
string sSection,
string cellCoordinates
	let cellCoordinates=oQP.eval(cellCoordinatesFunction)
oQP.quit()
SayFormattedMessage (ot_status, formatString(msgSettingMonitorCellTo_L, intToString(index), stripDollarSigns(cellCoordinates)), formatString(msgSettingMonitorCellTo_S, intToString(index), stripDollarSigns(cellCoordinates)))
let sJsiName=getNotebookJsiName()
let sSection=getMonitorCellsSection()
if not iniWriteString(sSection,formatString(hKey_MonitorCell, intToString(index)), cellCoordinates,sJsiName) then
	SayFormattedMessage(ot_error, msgDocSettingsNotSaved)
endIf
loadMonitorCells()
EndFunction

Void Function ListColumn ()
var
string dlgTitle,
string coordinates,
string rowTitle,
int row,
int choice,
string columnLetters,
string ColumnData,
string cellCoordinateList,
string CellCoordinates,
string tmp,
int index,
int cellsWithData,
int count
let count=maxRowsToSearch
SayFormattedMessage (ot_smart_help,msgPleaseWait)
let index=1
let cellsWithData=0
let columnLetters=brlColumnNumberToLetter(oQP.eval(cellColumnFunction))
let row=oQP.eval(cellRowFunction) ; current row
while index <=count

	if oQP.eval(formatString(cellTypeGeneralFunction,columnLetters+intToString(index)))!=cellTypeBlank then
		let tmp=oQP.getCellValue(columnLetters+IntToString(index))
		let coordinates=columnLetters+intToString(index)
		if globalTitleReading==readRowTitles || globalTitleReading==readBothTitles then
			let rowTitle=oQP.getCellValue(brlColumnNumberToLetter(globalTitleCol)+intToString(index))
let columnData=columnData+list_item_separator+formatString(msgListItem1, coordinates, rowTitle, tmp)
		else
			let columnData=columnData+list_item_separator+formatString(msgListItem2, coordinates, tmp)
		endIf
		let cellCoordinateList=cellCoordinateList+list_item_separator+columnLetters+intToString(index)
		let cellsWithData=cellsWithData+1
	endIf
	let index=index+1
endWhile
if cellsWithData==0 then
	SayFormattedMessage (ot_error,msgNoCellsWithDataInColumn_L, msgNoCellsWithDataInColumn_S)
	return
endIf
; remove leading delimiters from lists
let columnData=stringChopLeft(columnData,1)
let cellCoordinateList=stringChopLeft(cellCoordinateList,1)
if globalTitleReading==readColumnTitles || globalTitleReading==readBothTitles then
	let dlgTitle=oQP.getCellValue(columnLetters+intToString(globalTitleRow))
endIf
let dlgTitle=dlgTitle+msgColumnCellsWithData
let choice=DlgSelectItemInList (columnData, dlgTitle, false)
if choice==0 then
	return
endIf
let cellCoordinates=stringSegment(cellCoordinateList,list_item_separator,choice)
oQP.selectBlock(cellCoordinates)
oQP.quit()
sayCurrentCell()
EndFunction

Void Function ListRow ()
var
string dlgTitle,
string coordinates,
string ColTitle,
int col,
string columnLetters,
int choice,
int row,
string rowData,
string cellCoordinateList,
string CellCoordinates,
string tmp,
int index,
int cellsWithData,
int count
let count=maxColumns
SayFormattedMessage (ot_smart_help,msgPleaseWait)
let index=1
let cellsWithData=0
let row=oQP.eval(cellRowFunction)
let col=oQP.eval(cellColumnFunction) ; current row
while index <=count
	let columnLetters=brlColumnNumberToLetter(index)
	if oQP.eval(formatString(cellTypeGeneralFunction,columnLetters+intToString(row)))!=cellTypeBlank then
		let tmp=oQP.getCellValue(columnLetters+intToString(row))
		let coordinates=columnLetters+intToString(row)
		if globalTitleReading==readColumnTitles || globalTitleReading==readBothTitles then
			let colTitle=oQP.getCellValue(columnLetters+intToString(globalTitleRow))
let rowData=rowData+list_item_separator+formatString(msgListItem1, coordinates, colTitle, tmp)
		else
			let rowData=rowData+list_item_separator+formatString(msgListItem2, coordinates, tmp)
		endIf
		let cellCoordinateList=cellCoordinateList+list_item_separator+columnLetters+intToString(row)
		let cellsWithData=cellsWithData+1
	endIf
	let index=index+1
endWhile
if cellsWithData==0 then
	SayFormattedMessage (ot_error,msgNoCellsWithDataInRow_L, msgNoCellsWithDataInRow_S)
	return
endIf
;remove leading delimiters from strings
let rowData=stringChopLeft(rowData,1)
let cellCoordinateList=stringChopLeft(cellCoordinateList,1)
if globalTitleReading==readRowTitles || globalTitleReading==readBothTitles then
	let dlgTitle=oQP.getCellValue(brlColumnNumberToLetter(globalTitleCol)+intToString(row))
endIf
let dlgTitle=dlgTitle+msgRowCellsWithData
let choice=DlgSelectItemInList (rowData, dlgTitle, false)
if choice==0 then
	return
endIf
let cellCoordinates=stringSegment(cellCoordinateList,list_item_separator,choice)
oQP.selectBlock(cellCoordinates)
oQP.quit()
sayCurrentCell()
EndFunction

Void Function readWordInContext ()
if inSpreadsheet() then
	spellString(stringLower(stripDollarSigns(oQP.eval(cellCoordinatesFunction))))
	oQP.quit()
	if globalTitleReading & readRowTitles then
		SayFormattedMessage (OT_no_disable, getRowTitle())
	endIf
	if globalTitleReading & readColumnTitles then
		SayFormattedMessage (OT_no_disable, getColumnTitle())
	endIf
else
	performScript readWordIncontext() ; default
endIf
EndFunction

Void Function sayGridlineStatus ()
var
string gridlineStatus

let gridlineStatus=oQP.eval(sheetDisplayGridlinesFunction)
oQP.quit()
SayFormattedMessage(ot_JAWS_message,msgGridlineStatus)
; horiz, vert
if stringSegment(gridlineStatus,argDelimiter,1)==attribOn then
	say(msgHorizontalGridlines,ot_no_disable)
else
	say(msgNoHorizontalGridlines,ot_no_disable)
endIf
if stringSegment(gridlineStatus,argDelimiter,2)==attribOn then
	say(msgVerticalGridlines,ot_no_disable)
else
	say(msgNoVerticalGridlines,ot_no_disable)
endIf
EndFunction

Void Function sayColumnTitle ()
Say (getColumnTitle(), ot_no_disable)
EndFunction

Function sayColumnHeader ()
Say (getColumnTitle(), ot_no_disable)
EndFunction

Void Function sayRowTitle ()
Say (getRowTitle(), ot_no_disable)
EndFunction

Function sayRowHeader ()
Say (getRowTitle(), ot_no_disable)
EndFunction

Void Function brailleAddMonitorCells ()
var
int index,
string coordinates,
string contents,
string text

let brlCellInfoMonitorText=cscNull
if stringLength(globalMonitorCells) > 2*maxMonitorCells then
; something is defined
	let index=1
	while index <=maxMonitorCells
		let coordinates=stringSegment(globalMonitorCells,list_item_separator,index)
		if coordinates !=monitorCellUndefined then
			let text=getMonitorCellInfo(index)
			let BrlCellInfoMonitorText=brlCellInfoMonitorText+cscSpace+text
		endIf
		let index=index+1
	endWhile
endIf
EndFunction

int Function worksheetChanged ()
if globalPriorSheetName!=getSheetName() then
	let globalPriorSheetName=getSheetName()
	return true
else
	return false
endIf
EndFunction


void Function moveToMonitorCell ()
var
int index,
string cellList,
string coordinates,
string content,
string sSheetName,
int iQuitRequired,
int iResult

let sSheetName=getSheetName()
let index=1
while index <=maxMonitorCells
	let coordinates=stringSegment(globalMonitorCells,list_item_separator,index)
	if coordinates !=monitorCellUndefined then
		let content=oQP.getCellValue(coordinates)
		let iQuitRequired=true
		let cellList=cellList+list_item_separator+formatString(msgListItem2, stripDollarSigns(coordinates), content)
	endIf
	let index=index+1
endWhile
;remove leading delimiter
let cellList=stringChopLeft(cellList,1)
DlgSelectControls (cellList, iResult, msgMoveToMonitorCell_L, bt_MoveTo, bt_MoveTo)
if iResult then
	let Coordinates=stringSegment(globalMonitorCells,list_item_separator,iResult)
	oQP.selectBlock(Coordinates)
	let iQuitRequired=true
endIf
if iQuitRequired then
	oQP.quit
endIf
EndFunction


int Function brailleBuildCustomDialog ()
var
string sPrompt,
string sType,
string sState,
string sValue,
string sControlInfo,
string sRealName,
string sPageName

;clean up braille vars
BrailleCleanVars ()
let iBrlDlgInfoCol=getCursorCol()
let iBrlDlgInfoRow=getCursorRow()
let iBrlDlgInfoAttrib=getCharacterAttributes()
let sRealName=getWindowName(getRealWindow(globalFocusWindow))
let sPageName=getDialogPageName()
if sRealName!=cscNull then
	let brlDlgInfoName= formatString(cmsg229_L,sRealName)
endIf
if sPageName!=cscNull then
 let brlDlgInfoPageName=formatString(cMsg230_L, sPageName)
endIf
let sControlInfo=getWindowName(getFirstChild(getRealWindow(globalFocusWindow)))
	let sPrompt=stringSegment(sControlInfo,argDelimiter,1)
	let sType=stringSegment(sControlInfo,argDelimiter,2)
	let sState=stringSegment(sControlInfo,argDelimiter,3)
	let sValue=stringSegment(sControlInfo,argDelimiter,4)
if sType==cscNull then
	let brlDlgInfoType=msgUnsupportedControl
	return true
endIf
if stringContains(sType,ctlCheckbox) then
	if sState==stateChecked then
		let brlDlgInfoState=cMsgBrailleChecked1_L
	else
		let brlDlgInfoState=cMsgBrailleUnchecked1_L
	endIf
elif stringContains(sType,ctlRadioButton) then
	if sState==StateSelected then
		let brlDlgInfoState=cMsgBrailleChecked1_L
	else
		let brlDlgInfoState=cMsgBrailleUnchecked1_L
	endIf
endIf
let brlDlgInfoPrompt=sPrompt
let brlDlgInfoType=sType
let brlDlgInfoValue=sValue
return true
EndFunction

int Function isOwnerDrawnCheckbox ()
var
string sType,
string sControlInfo
let sControlInfo=getWindowName(getFirstChild(getRealWindow(getFocus())))
if sControlInfo!=cscNull then
	let sType=stringSegment(sControlInfo,argDelimiter,2)
endIf
return stringContains(sType,ctlCheckbox)
EndFunction

int Function isOwnerDrawnButton()
var
string sType,
string sControlInfo
let sControlInfo=getWindowName(getFirstChild(getRealWindow(getFocus())))
if sControlInfo!=cscNull then
	let sType=stringSegment(sControlInfo,argDelimiter,2)
endIf
return stringContains(sType,ctlButton) && not stringContains(sType, ctlRadioButton)
EndFunction

void function sayOwnerDrawnCheckboxState()
var
string sType,
string sState,
string sControlInfo
; note the format returned in the hidden window:
;[prompt],[control name],[status],[inner selection],[order],[mnemonic]
typeKey(ksDummy) ;ensure that the window is updated by pressing a key
pause()
let sControlInfo=getWindowName(getFirstChild(getRealWindow(getFocus())))
let sType=stringSegment(sControlInfo,argDelimiter,2)
if not stringContains(sType,ctlCheckbox) then
	return
endIf
let sState=stringSegment(sControlInfo,argDelimiter,3)
SayFormattedMessage(ot_item_State, sState)
endFunction

void function sayOwnerDrawnControlValue()
var
string sPrompt,
string sType,
string sState,
string sValue,
string sItemCount,
string sMnemonic,
string sControlInfo
; note the format returned in the hidden window:
;[prompt],[control name],[status],[inner selection],[order],[mnemonic]
let sControlInfo=getWindowName(getFirstChild(getRealWindow(getFocus())))
if sControlInfo!=cscNull then
	let sPrompt=stringSegment(sControlInfo,argDelimiter,1)
	let sType=stringSegment(sControlInfo,argDelimiter,2)
   let sState=stringSegment(sControlInfo,argDelimiter,3)
let sValue=stringSegment(sControlInfo,argDelimiter,4)
	let sItemCount=stringSegment(sControlInfo,argDelimiter,5)
	let sMnemonic=stringRight(sControlInfo,1)
	if sType==cscNull then
		SayFormattedMessage(ot_error, msgUnsupportedControl)
		return true
	endIf
	say(sValue,ot_no_disable)
	if (stringContains(sState,stateSelected) || stringContains(sState,stateChecked)) then
; handles speaking of checked and not checked status
	say(sState,ot_item_state)
	endIf
	if stringContains(sItemCount,itemCountID) then
		say(sItemCount,ot_item_number)
	endIf
endIf
endFunction

int Function sayOwnerDrawnDialogFocus ()
var
string sPrompt,
string sType,
string sState,
string sValue,
string sItemCount,
string sMnemonic,
string sControlInfo
; note the format returned in the hidden window:
;[prompt],[control name],[status],[inner selection],[order],[mnemonic]
let sControlInfo=getWindowName(getFirstChild(getRealWindow(getFocus())))
if sControlInfo!=cscNull then
	let sPrompt=stringSegment(sControlInfo,argDelimiter,1)
	let sType=stringSegment(sControlInfo,argDelimiter,2)
   let sState=stringSegment(sControlInfo,argDelimiter,3)
let sValue=stringSegment(sControlInfo,argDelimiter,4)
	let sItemCount=stringSegment(sControlInfo,argDelimiter,5)
	let sMnemonic=stringRight(sControlInfo,1)
	if sType==cscNull then
		SayFormattedMessage(ot_error, msgUnsupportedControl)
		return true
	endIf
	say(sPrompt,ot_control_name)
	say(sType,ot_control_type)
	say(sValue,ot_no_disable)
	if (stringContains(sState,stateSelected) || stringContains(sState,stateChecked)) then
;handles speaking of checked and not checked status
	say(sState,ot_item_state)
	endIf
	if stringContains(sItemCount,itemCountID) then
		say(sItemCount,ot_item_number)
	endIf
	return true
else
	return false
endIf
EndFunction

void Function sayCustomControlHotkey ()
var
string sClass,
string sPrompt,
string sHotKey,
string sControlInfo,
string sMessageLong,
string sMessageShort

let sClass=getWindowClass(getCurrentWindow())
if isPcCursor() &&
	not menusActive() &&
	getCurrentControlId()==0 && (sClass==wc_QuattroPro9 || sClass==wc_Qp8Dialog) &&
	globalIsSP4 then
	let sControlInfo=getWindowName(getFirstChild(getRealWindow(getCurrentWindow())))
	let sPrompt=stringSegment(sControlInfo,argDelimiter,1)
	let sHotKey=stringRight(sControlInfo,1)
	if sHotKey !=argDelimiter then
		let sMessageLong = FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_L, sPrompt, sHotKey)
		let sMessageShort = FormatString (cmsgHotKeyDefaultHelpLoopPrompt1_S, sPrompt, sHotKey)
		SayFormattedMessage (ot_help, sMessageLong, sMessageShort)
		return
	endIf
endIf
SayFormattedMessage (ot_help, cmsg124_L) ;"no hot key"
EndFunction

Function screenSensitiveHelpCustomControls ()
var
string sControlInfo,
string sType,
string sClass

let sClass=getWindowClass(getCurrentWindow())
if isPcCursor() &&
	not menusActive() &&
	getCurrentControlId()==0 && (sClass==wc_QuattroPro9 || sClass==wc_Qp8Dialog) &&
	globalIsSP4 then

	let sControlInfo=getWindowName(getFirstChild(getRealWindow(getCurrentWindow())))
	let sType=stringLower(stringSegment(sControlInfo,argDelimiter,2))
	if stringContains(sType,ctlCheckbox) then
		screenSensitiveHelpForKnownClasses(wt_checkbox)
	elif stringContains(sType,ctlRadioButton) then
		screenSensitiveHelpForKnownClasses(wt_RadioButton)
	elif stringContains(sType,ctlButton) then
		screenSensitiveHelpForKnownClasses(wt_Button)
	elif stringContains(sType,ctlCombobox) then
		screenSensitiveHelpForKnownClasses(wt_combobox)
	elif stringContains(sType,ctlEdit) then
		screenSensitiveHelpForKnownClasses(wt_edit)
	elif stringContains(sType,ctlListbox) then
		screenSensitiveHelpForKnownClasses(wt_listbox)
	elif stringContains(sType,ctlTab) then
		screenSensitiveHelpForKnownClasses(wt_tabControl)
	elif stringContains(sType,ctlSpinControl) then
		screenSensitiveHelpForKnownClasses(wt_spinBox)
	else
		screenSensitiveHelpForUnknownClasses()
	endIf
else
	screenSensitiveHelp() ; default
endIf
EndFunction
/*
int function BrailleBuildLine()
if inSpreadSheet() && not caretVisible() then
	BrailleAddString(BrlCellInfo,0,0,0)
	return true
elif inCustomDialog() && globalIsSP4 then
	brailleBuildCustomDialog()
	return true
	;wt_custom_dialog+wt_custom_control_base
else
	return BrailleBuildLine() ; default
endIf
endFunction
*/

; braille code for JAWS4.0
int Function BrailleCallbackObjectIdentify()
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
if inSpreadSheet() && not caretVisible() then
	return qpwBrlCurrentObj+wt_custom_control_base
elif inCustomDialog() && globalIsSP4 then
	brailleBuildCustomDialog()
	return wt_custom_dialog+wt_custom_control_base
else
	return wt_unknown
endIf
endFunction

int function BrailleAddObjectCoordinates(int nType)
;Cell Coordinates
	if (brlCellInfoCo != cscNull) then
		BrailleAddString(brlCellInfoCo,0,0,0)
		return true
	EndIf
	return false
endFunction

int function BrailleAddObjectColHdr(int nType)
;Column Title
 	if (brlCellInfoColTitle != cscNull) then
		BrailleAddString(brlCellInfoColTitle,0,0,0)
		return true
	EndIf
	return false
endFunction

int function BrailleAddObjectRowHdr(int nType)
;Row Title
	if (brlCellInfoRowTitle != cscNull) then
		BrailleAddString(brlCellInfoRowTitle,0,0,0)
		return true
	EndIf
	return false
endFunction

int function BrailleAddObjectContent(int nType)
;Cell Content
	if (brlCellInfoValue != cscNull) then
		BrailleAddString(brlCellInfoValue,0,0,0)
		else
		BrailleAddString(msgBrlBlankCell,0,0,0)
	EndIf
	return true
endFunction

int function BrailleAddObjectFormula(int nType)
;Cell Formula
	if (brlCellInfoFormula != cscNull) then
		BrailleAddString(brlCellInfoFormula,0,0,0)
		return true
	EndIf
	return false
  endFunction

int function BrailleAddObjectRowTotal(int nType)
;Row Total
var
string sTotal
let sTotal = GetRowTotal ()
if sTotal == cscNull then
	return false
EndIf
BrailleAddString(formatString(msgRowTotal, sTotal),0,0,0)
return true
endFunction

int function BrailleAddObjectColTotal(int nType)
;Column total
var
string sTotal
let sTotal = GetColTotal ()
	if sTotal == cscNull then
; no sum formula, can't say the total
		return false
	endIf
BrailleAddString(formatString(msgColumnTotal, sTotal),0,0,0)
return true
endFunction

int function BrailleAddObjectStartCoordinates(int nType)
;Starting Cell Coordinates
	if (brlCellInfoStartCo != cscNull) then
		BrailleAddString(brlCellInfoStartCo,0,0,0)
		return true
	EndIf
	return false
endFunction

int function BrailleAddObjectStartContent(int nType)
;Starting Cell Content
	if (brlCellInfoStartValue != cscNull) then
		BrailleAddString(brlCellInfoStartValue,0,0,0)
		else
 	brailleAddString(msgBrlBlankCell,0,0,0)
 EndIf
return true
endFunction

int function BrailleAddObjectStartColTitle (int nType)
;Starting Cell Column title
	if (brlCellInfoStartColTitle != cscNull) then
		BrailleAddString(brlCellInfoStartColTitle,0,0,0)
		return true
	EndIf
	return false
endFunction

int function BrailleAddObjectStartRowTitle (int nType)
;Starting Cell Row title
	if (brlCellInfoStartRowTitle != cscNull) then
		BrailleAddString(brlCellInfoStartRowTitle,0,0,0)
		return true
	EndIf
	return false
endFunction

int function BrailleAddObjectDelim(int nType)
;Selection Delimiter
BrailleAddstring(msgBrlDelim,0,0,0)
return true
endFunction

int function BrailleAddObjectEndCoordinates(int nType)
;Ending Cell Coordinates
	if (brlCellInfoEndCo != cscNull) then
		BrailleAddString(brlCellInfoEndCo,0,0,0)
		return true
	EndIf
	return false
endFunction

int function BrailleAddObjectEndContent(int nType)
;Ending Cell Content
	if (brlCellInfoEndValue != cscNull) then
		BrailleAddString(brlCellInfoEndValue,0,0,0)
		else
	BrailleAddString(msgBrlBlankCell,0,0,0)
	endIf
return true
endFunction

int function BrailleAddObjectEndColTitle (int nType)
;Ending Cell column title
	if (brlCellInfoEndColTitle != cscNull) then
		BrailleAddString(brlCellInfoEndColTitle,0,0,0)
		return true
	EndIf
	return false
endFunction

int function BrailleAddObjectEndRowTitle (int nType)
;Ending Cell Row title
	if (brlCellInfoEndRowTitle != cscNull) then
		BrailleAddString(brlCellInfoEndRowTitle,0,0,0)
		return true
	EndIf
	return false
endFunction

int function brailleAddObjectMonitorCells ()
	if (brlCellInfoMonitorText != cscNull) then
		BrailleAddString(brlCellInfoMonitorText,0,0,0)
		return true
	EndIf
	return false
EndFunction

int function brailleAddObjectName (int nSubtypeCode)
if IsTouchCursor() then
	return brailleAddObjectName (nSubtypeCode)
endIf
if nSubtypeCode != wt_custom_dialog+wt_custom_control_base then
	return false
EndIf
	if (brlDlgInfoName != cscNull) then
		BrailleAddString(brlDlgInfoName,0,0,0)
		return true
	EndIf
	return false
EndFunction

int function brailleAddObjectDlgPageName (int nSubtypeCode)
if nSubtypeCode != wt_custom_dialog+wt_custom_control_base then
	return false
EndIf
	if (brlDlgInfoPageName != cscNull) then
		BrailleAddString(brlDlgInfoPageName,0,0,0)
		return true
	EndIf
	return false
EndFunction

int function brailleAddObjectState (int nSubtypeCode)
if IsTouchCursor() then
	return brailleAddObjectState (nSubtypeCode)
endIf
if nSubtypeCode != wt_custom_dialog+wt_custom_control_base then
	return false
EndIf
if (brlDlgInfoState != cscNull) then
	SuppressG2TranslationForNextStructuredModeSegment()
	BrailleAddString(brlDlgInfoState,iBrlDlgInfoCol,iBrlDlgInfoRow, iBrlDlgInfoAttrib)
	return true
EndIf
return false
EndFunction

int function brailleAddObjectPrompt (int nSubtypeCode)
if nSubtypeCode != wt_custom_dialog+wt_custom_control_base then
	return false
EndIf
	if (brlDlgInfoPrompt != cscNull) then
		BrailleAddString(brlDlgInfoPrompt,0,0,0)
		return true
	EndIf
	return false
EndFunction

int function brailleAddObjectType (int nSubtypeCode)
if IsTouchCursor() then
	return brailleAddObjectType (nSubtypeCode)
endIf
if nSubtypeCode != wt_custom_dialog+wt_custom_control_base then
	return false
EndIf
	if (brlDlgInfoType != cscNull) then
		BrailleAddString(brlDlgInfoType,0,0,0)
		return true
	EndIf
	return false
EndFunction

int function brailleAddObjectValue (int nSubtypeCode)
if IsTouchCursor() then
	return brailleAddObjectValue (nSubtypeCode)
endIf
if nSubtypeCode != wt_custom_dialog+wt_custom_control_base then
	return false
EndIf
	if (brlDlgInfoValue != cscNull) then
		BrailleAddString(brlDlgInfoValue,iBrlDlgInfoCol,iBrlDlgInfoRow, iBrlDlgInfoAttrib)
		return true
	EndIf
	return false
EndFunction

void function BrailleCleanVars ()
	let brlCellInfoCo=cscNull
	let brlCellInfoColTitle=cscNull
	let brlCellInfoRowTitle=cscNull
	let brlCellInfoValue=cscNull
	let brlCellInfoFormula=cscNull
	let brlCellInfoStartCo=cscNull
	let brlCellInfoStartValue=cscNull
	let brlCellInfoEndCo=cscNull
	let brlCellInfoEndValue=cscNull
	let brlCellInfoMonitorText=cscNull
	let iBrlDlgInfoCol=0
	let iBrlDlgInfoRow=0
	let iBrlDlgInfoAttrib=0
	let brlDlgInfoName=cscNull
	let brlDlgInfoPageName=cscNull
	let brlDlgInfoState=cscNull
	let brlDlgInfoPrompt=cscNull
	let brlDlgInfoType=cscNull
	let brlDlgInfoValue=cscNull
EndFunction


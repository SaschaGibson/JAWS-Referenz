;Copyright 2010-2015 by Freedom Scientific BLV Group, LLC

include "hjconst.jsh"
include "mviewer2.jsh"
include "mviewer2.jsm"

Script ScriptFileName ()
ScriptAndAppNames (msgFN1)
EndScript

Function GetWindowDims (int ByRef nLeft, int ByRef nTop, int ByRef nRight, int ByRef nBottom)
var 
	handle hWindow
let hWindow = GetRealWindow(GetFocus())
let nLeft = GetWindowLeft (hWindow)
let nTop = GetWindowTop (hWindow)
let nRight = GetWindowRight (hWindow)
let nBottom = GetWindowBottom (hWindow)
EndFunction

Void Function MoveToPercent (int nHPercent, int nVPercent, int nLeft, int nTop, int nRight, int nBottom)
var 
	int nWidth, int nHeight,
	int nRow, int nCol
let nWidth = nRight - nLeft
let nCol = nWidth * nHPercent
let nCol = nCol / 100
Let nCol = nCol + nLeft
let nHeight = nBottom - nTop
let nRow = nHeight * nVPercent
let nRow = nRow / 100
let nRow = nRow + nTop
JAWSCursor()
MoveTo (nCol, nRow)
Delay(10)
LeftMouseButton ()
PCCursor()
EndFunction

Script Menu ()
var 
	int nIndex,
	int nLeft, 
	int nTop, 
	int nRight, 
	int nBottom
if InHJDialog () then
	SayFormattedMessage (OT_ERROR, msgMenu_L, msgMenu_S)
	return
endif
GetWindowDims(nLeft, nTop, nRight, nBottom)
let nIndex = DlgSelectItemInList (strMenu, strMenuName, FALSE)
if (nIndex) then
	if (nIndex == ID_MAIN) then
		MoveToPercent (7,8, nLeft, nTop, nRight, nBottom)
	elif (nIndex == ID_WORD) then
		MoveToPercent (13,8, nLeft, nTop, nRight, nBottom)
	elif (nIndex == ID_INDEX) then
		MoveToPercent (20,8,nLeft, nTop, nRight, nBottom)
	elif (nIndex == ID_MARKS) then
		MoveToPercent (26,8, nLeft, nTop, nRight, nBottom)
	elif (nIndex == ID_BACK) then
		MoveToPercent (33,8,nLeft, nTop, nRight, nBottom)
	elif (nIndex == ID_Print) then
		MoveToPercent (39,8,nLeft, nTop, nRight, nBottom)
	elif (nIndex == ID_Help) then
		MoveToPercent (45,8, nLeft, nTop, nRight, nBottom)
	elif (nIndex == ID_Exit) then
		MoveToPercent (51,8,nLeft, nTop, nRight, nBottom)
	elif (nIndex == ID_ABOUT) then
		MoveToPercent (76,12,nLeft, nTop, nRight, nBottom)
	elif (nIndex == ID_SIGHTS) then
		MoveToPercent (18,61,nLeft, nTop, nRight, nBottom)
	elif (nIndex == ID_KING) then
		MoveToPercent (50,38, nLeft, nTop, nRight, nBottom)
	elif (nIndex == ID_TIMELINE) then
		MoveToPercent (82,60,nLeft, nTop, nRight, nBottom)
	endif
else
	SayString (msg1_L) ; "Main Menu canceled"
endif
EndScript

; Test Scripts
Script SayHorizontalPercent ()
var 
	int nLeft, 
	int nTop, 
	int nRight, 
	int nBottom,
	int nWidth, 
	int nPos, 
	int nPercent
GetWindowDims (nLeft, nTop, nRight, nBottom)
let nWidth = nRight - nLeft
let nPos = GetCursorCol () - nLeft
let nPos = nPos * 100 
let nPercent = nPos / nWidth
; msg2_L = " percent"
SayFormattedMessage (OT_STRING, IntToString (nPercent) + msg2_L)
EndScript

Script SayVerticalPercent ()
var 
	int nLeft, 
	int nTop, 
	int nRight, 
	int nBottom,
	int nHeight, 
	int nPos, 
	int nPercent
GetWindowDims (nLeft, nTop, nRight, nBottom)
let nHeight = nBottom - nTop
let nPos = GetCursorRow () - nTop
let nPos = nPos * 100 
let nPercent = nPos / nHeight
; msg2_L = " Percent"
SayFormattedMessage (OT_STRING, IntToString (nPercent) + msg2_L)
EndScript

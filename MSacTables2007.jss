; Copyright 1995-2015 Freedom Scientific, Inc. 
; JAWS 11.0.xx
; Script file for Microsoft Access 2007 Table Support.

include "common.jsm"
include "hjconst.jsh"
include "hjglobal.jsh"
include "msaccess2007.jsh" 
include "msaccess2007.jsm" 
use "msacfunc2007.jsb";supporting object functions:

GLOBALS
	string gstrPrevHeader

int function inTable ()
var
	int iCol, int iRow,
	int iType,
	string sClass
if ! isPcCursor ()
|| UserBufferIsActive() 
|| ! IsAccessControl () then
	Return false
endIf
DataSheetCoordinates (iCol, iRow)
let sClass = getWindowClass (getFocus ())
return (sClass == wc_OGrid 
	|| sClass == wc_OKttbx)
	|| (iCol > 0 
	&& iRow > 0)
endFunction

int Function BrailleAddObjectCoords (int iType)
var
	int nCol, int nRow,
	string sCoords;
if iType == WT_TABLECELL then
	;use the globals if this code gets slow.
	;However, BrailleCallbackObjectIdentify may get called after FocusChangedEventEx, so want to make accurate.
	DataSheetCoordinates (nCol, nRow)
	Let sCoords = FormatString (cmsgColumnRowCoordinates, intToString (nCol), intToString (nRow))
	BrailleAddString (sCoords,0,0,0)
	return TRUE
endIf
endFunction

int Function BrailleAddObjectRHdr (int iType)
if iType == WT_TABLECELL then
	;todo: if can get header for row [if relevant] add dext here 
	return TRUE
endIf
return FALSE
endFunction

int Function BrailleAddObjectCHdr (int iType)
var
	string sHeader
if iType == WT_TableCell then
	Let sHeader = getFieldName ()
	if ! sHeader then
		Let sHeader = getParentControlName ()
	endIf
	BrailleAddString (sHeader,0,0,0)
	return TRUE
endIf
return FALSE
endFunction

int Function BrailleAddObjectValue (int iType)
var
	string sText
if iType == WT_TABLECELL then
	Let sText = getObjectValue ()
	if sText then
		BrailleAddString (sText,0,0,0)
		return TRUE;
	endIf
endIf
return BrailleAddObjectValue (iType)
endFunction

Void Function SpeakCellCoordinatesChanges ()
var
	string sCol,
	string sRow
if giCurrentRow != giLastRow then
	Let sRow = formatString (cmsgRowHeader, intToString (giCurrentRow))
	sayMessage (OT_POSITION, sRow)
endIf
if giCurrentCol != giLastCol then
	Let sCol = formatString (cmsgColumnHeader, intToString (giCurrentCol))
	sayMessage (OT_POSITION, sCol)
endIf
endFunction

Void Function SpeakCellInfo ()
var
	string sHeader,
	string sText
SpeakCellCoordinatesChanges ()
Let sHeader = getFieldName ()
if ! sHeader then
	Let sHeader = getParentControlName ()
endIf
if ! sHeader then
	;Use OSM / scrape since window and MSAA info are hosed:
	SaveCursor ()
	InvisibleCursor ()
	RouteInvisibleToPC ()
	JAWSHome ()
	let sHeader = getChunk ()
	RestoreCursor ()
	restoreCursor ();
endIf
if sHeader 
&& sHeader != gstrPrevHeader then
	sayMessage (OT_CONTROL_GROUP_NAME, sHeader)
endIf
Let gstrPrevHeader = sHeader;Set up for next time:
Let sText = getObjectValue ()
if sText then
	Say(sText,OT_LINE,TRUE)
endIf
endFunction

Void function SpeakFieldHeader()
Var
	string sHeader
if !InTable() then
	return
endIf
Let sHeader = getFieldName ()
if ! sHeader then
	Let sHeader = getParentControlName ()
endIf
sayMessage (OT_CONTROL_GROUP_NAME,sHeader)
endFunction
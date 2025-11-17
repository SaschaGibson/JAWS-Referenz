; Auto Update Script Set
; Copyright 2006-2015 Freedom Scientific, Inc.

include "HjConst.jsh"
include "HjGlobal.jsh"
include "common.jsm"


Script ScriptFileName ()
ScriptAndAppNames ("Freedom Scientific Auto Update")
EndScript

Void Function SayFocusedObject ()
var
	int iControl,
	handle hWnd
let hWnd=GetFocus()
let iControl=GetControlID(hWnd)
If iControl==1000
|| iControl==1001 Then
	IndicateControlType(GetWindowSubTypeCode(hWnd),cscSpace,cscSpace)
	SayWindow(hWnd,Read_Everything)
	Return
EndIf
SayObjectTypeAndText()
EndFunction

int function BrailleAddObjectValue (int SubtypeCode)
var int bits = CTRL_CHECKED|CTRL_UNCHECKED|CTRL_PARTIALLY_CHECKED
if subtypeCode == WT_LISTVIEW || subtypeCode == WT_LISTVIEWITEM then
	; only fix alignment for checkable list items:
	if GetControlAttributes () & bits then
		BrailleAddString (GetObjectName(SOURCE_CACHED_DATA), 0,0,GetCharacterAttributes ()) ; can be unselected in this list.
		return TRUE
	endIf
endIf
return BrailleAddObjectValue (SubtypeCode)
endFunction

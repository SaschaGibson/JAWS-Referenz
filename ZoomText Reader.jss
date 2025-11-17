; Copyright 2017 by Freedom Scientific, Inc.

include "hjConst.jsh"
include "common.jsm"

script scriptFileName ()
scriptAndAppNames (getActiveConfiguration ())
endScript

script Enter ()
typeKey ("enter")
endScript

script ShiftTab ()
typeKey ("Shift+Tab")
endScript

script Tab ()
typeKey ("Tab")
endScript

void function SayCharacterUnit (int unitMovement)
if (unitMovement == UnitMove_Next || unitMovement == UnitMove_Prior)
&& ! SayCursorMovementException (UnitMovement)
; movement for char has already happened:
	return
endIf
return SayCharacterUnit (unitMovement)
endFunction

void function SayWordUnit(int UnitMovement)
if ! SayCursorMovementException (UnitMovement)
&& stringStartsWith (getCurrentScriptKeyName (), "Control") then
; movement for wordhas already happened:
	return
else
	SayWordUnit(UnitMovement)
endIf
endFunction

void function SayLineUnit(int unitMovement, optional int bMoved)
if ! SayCursorMovementException (UnitMovement)
&& (unitMovement == UnitMove_Next || unitMovement == UnitMove_Prior)
; leave laptop keys alone:
&& ! stringStartsWith (getCurrentScriptKeyName (), "JAWSKey") then
	if unitMovement == UnitMove_Next  then
		typeKey (cksDownArrow)
	elIf unitMovement == UnitMove_Prior then
		typeKey (cksUpArrow)
	endIf
	return
else
	SayLineUnit (UnitMovement)
endIf
endFunction

Script ControlDownArrow ()
if ! SayCursorMovementException (UnitMove_Next)
	typeCurrentScriptKey ()
else
	performScript ControlDownArrow ()
endIf
endScript

Script ControlUpArrow ()
if ! SayCursorMovementException (UnitMove_Prior)
	typeCurrentScriptKey ()
else
	performScript ControlDownArrow ()
endIf
endScript

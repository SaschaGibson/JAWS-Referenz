;Copyright 2010-2015 by Freedom Scientific BLV Group, LLC

;
; Updated by S. Dawes 98/05/04.
Include "hjglobal.jsh" ; default HJ global variables
Include "hjconst.jsh" ; default HJ constants
include "extra.jsm"


Script AutoStart()
; The next 2 lines ensure that the terminal screen is always maximized.
; This is necessary for the screen orientated frames to work properly. 
TypeKey (ks1)
TypeKey (ks2)	
EndScript 

Script  ScriptFileName()
ScriptAndAppNames(msgFN)
EndScript

Script SayNextWord()
If IsPCCursor () Then 
	RouteInvisibleToPc ()
	InvisibleCursor ()
	NextWord ()
	Pause()
	RoutePcToInvisible ()
	PcCursor ()
	SayWord()
Else
	PerformScript SayNextWord()	
Endif
EndScript

Script SayPriorWord() 
If IsPCCursor () Then 
	InvisibleCursor ()
	RouteInvisibleToPc ()
	InvisibleCursor ()
	PriorWord()
	Pause()
	RoutePcToInvisible ()
	PcCursor ()
;	Delay (1)
	SayWord()
Else
	PerformScript SayPriorWord()
Endif
EndScript

Script Tab ()
StopSpeech ()
TypeKey (ks3)
Pause()
	If IsPCCursor() Then
		SayLine()
	Endif
EndScript

Script BackTab () 
StopSpeech ()
	TypeKey (ks4)
Pause()
	If IsPCCursor() Then
		SayLine()
	Endif
EndScript

Script Home ()
TypeKey (ks5)
Pause()
	If IsPCCursor() Then
		SayLine()
Else
	PerformScript JAWSHome()
	Endif
EndScript

; Local Functions:

Function RoutePcToInvisible ()
Var 
	Int InvisibleRow, ; The Row Coordinate of the InvisibleCursor
Int InvisibleCol  ; The Col Coordinate of the InvisibleCursor
InvisibleCursor ()
Let InvisibleRow = GetCursorRow ()
Let InvisibleCol = GetCursorCol ()
PcCursor ()
MoveTo (InvisibleCol, InvisibleRow)
If ((GetCursorRow ()!= InvisibleRow) &&  (GetCursorCol () != InvisibleCol)) Then
	return False
Else
	return True
EndIf
EndFunction


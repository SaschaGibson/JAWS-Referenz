; Copyright 2022 Freedom Scientific, Inc.
; JAWS script file for Media Player

include "hjconst.jsh"
include "MediaPlayer.jsm"

Script ScriptFileName()
ScriptAndAppNames(msgMediaPlayerAppName) ;"Media Player
EndScript

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
var
	string sName = GetObjectName (TRUE),
	string sHelp = GetObjectHelp (TRUE)
SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
if nLevel == 0
&& stringCompare (sName, sHelp) != 0
	say(sHelp,ot_line)
endIf
EndFunction

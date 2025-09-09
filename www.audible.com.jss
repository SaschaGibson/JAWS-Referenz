; Copyright 2022 by Freedom Scientific, Inc.
; Script file for www.audible.com

include "hjconst.jsh"
include "common.jsm"
include "www.audible.com.jsm"

int function ShouldProcessLiveRegion(string text, string attribs)
if StringStartsWith (text, scPlaySample)
|| StringStartsWith (text, scPauseSample)
|| IsTimeString(text)
	return false
endIf
return TRUE
endFunction

Script ScriptFileName()
ScriptAndAppNames(msgAudibleAppName) ;"Audible.com"
EndScript

int Function IsTimeString (string sTime)
if StringSegmentCount (sTime, scTimeSeparator) == 2
	sTime = StringDiff (sTime, scTimeSeparator)
	sTime = StringReplaceChars (sTime, DigitChars, cScSpace)
	if StringIsBlank(sTime)
		return true
	endIf
endIf
return false
EndFunction

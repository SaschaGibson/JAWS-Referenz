; Copyright 2017 by Freedom Scientific, Inc.
; Freedom Scientific script file for ApplicationFrame

globals
	int EdgeShouldNotSpeakFocusChange ;accesses the global in MicrosoftEdge

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName,handle FocusWindow)
if EdgeShouldNotSpeakFocusChange
	;ApplicationFrame may briefly gain focus in some situation such as when an HJ dialog is dismissed and before the Edge browser gains focus.
	;We access the global for silencing Edge focus changes, and if true bail out without speaking the focus object.
	return
EndIf
ProcessSayFocusWindowOnFocusChange(RealWindowName,FocusWindow)
EndFunction

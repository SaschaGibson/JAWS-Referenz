; Copyright 1995-2016 by Freedom Scientific, Inc.
; generic setup file.
; Switch to your application's setup file from here:

include "common.jsm"


void function AutoStartEvent ()
var string DialogName = getWindowName (GetRealWindow (GetFocus ()))
if stringContains (DialogName, cwn_ZoomText)
&& !stringContains (DialogName, cwn_ZoomTextKeyboard)
	switchToConfiguration ("ZoomtextInstaller")
	return
;elIf stringContains (DialogName, yourInstallerWindowName) then
endIf
endFunction
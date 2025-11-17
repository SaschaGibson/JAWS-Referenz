; Copyright 2013-2015 by Freedom Scientific, Inc.
;Basic support for Error Reporting dialog minor issues.

include "HjConst.jsh"

int Function DoChildWindows (handle hWnd)
if hWnd == getLastWindow (getFocus ())
&& getWindowSubtypeCode (hWnd) == WT_GROUPBOX then
	return TRUE ; do nothing.
endIf
return DoChildWindows (hWnd)
endFunction


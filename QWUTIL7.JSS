; Quicken Deluxe 2003 Script File
; This script file is called when the QWUtil7.dll is invoked in certain situations such as when the Quicken Calc window is in use.
; Copyright (C) 2010-2015 by Freedom Scientific BLV Group, LLC

; Written by Joseph K Stephen
; Build QW372513 last modified on June 14 2000
; Major Modification by Jim snowbarger (The SnowMan) for Quicken 2003, November 2002.

include "hjconst.jsh"
include "qw.jsh"
include "qw.jsm"
include "hjHelp.jsh"
include "common.jsm"

void function autoStartEvent()
let giSwitchedFromDLL=true
SwitchToConfiguration (ksQWScriptFileCurrent)
endFunction


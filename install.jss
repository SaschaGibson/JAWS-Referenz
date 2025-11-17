; Copyright 2010-2015 by Freedom Scientific BLV Group, LLC

include "HJConst.jsh"
include "install.jsm"

void function FocusChangedEvent(handle FocusWindow, handle PrevWindow)
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
FocusChangedEvent(FocusWindow,PrevWindow)
EndFunction


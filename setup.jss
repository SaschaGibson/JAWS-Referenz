; Copyright 1995-2015 by Freedom Scientific, Inc.
; JAWS 9 default script file
;Setuf.jss file:

;This file switches to any relevant setup file, whose window owner is something other than Setup.
;We do not want to customize a configuration for Setup.
;However, if there is no match,
;we load Default, but if User launches Configuration Manager, it would load the relevant file to your installer.
;We do this for the flash installer 
;used by the Windows Mobile Startup Disk from Microsoft: WM2006.

include "HjConst.jsh"
include "Common.jsm";

CONST 
	wc_Omni_CD = "Getting Started With Windows Mobile",
	CONFIG_PM_OMNI	"PACMateOmniCD",
	CONFIG_SETUP "setup"


void Function AutoStartEvent ()
var
	handle hWnd,
	int iSegCount,
	string sConfigName;
Let hWnd = GetFocus ()
If GetWindowClass (GetAppMainWindow (hWnd)) == wc_Omni_CD then
	SwitchToConfiguration (CONFIG_PM_OMNI)
	Return;
EndIf
Let sConfigName = GetWindowOwner (hWnd)
Let iSegCount = StringSegmentCount (sConfigName, cscDoubleBackSlash)
If iSegCount then
	Let sConfigName = (StringSegment (sConfigName, cscDoubleBackSlash, iSegCount))
EndIf
Let iSegCount = StringSegmentCount (sConfigName, cscPeriod)
;Figure out how much of a segment tostrip:
Let iSegCount = (StringLength (StringSegment (sConfigName, cscPeriod, iSegCount))+1)
Let sConfigName = (StringChopRight (sConfigName, iSegCount))
;Say (sConfigName, OT_USER_REQUESTED_INFORMATION);
If ! StringIsBlank (sConfigName) && sConfigName != CONFIG_SETUP then
	; Don't switch configuration from setup to setup.
	SwitchToConfiguration (sConfigName)
Else
EndIf
EndFunction

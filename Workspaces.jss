; Copyright 2020 by Freedom Scientific, Inc.
; When focus moves to the Amazon Workspaces Terminal display window, the client 
; JAWS needs to go to sleep.  We originally set jcf options
; to perform sleep mode, but the login screens were then silent.
; The OPT_TERMINAL_SERVICES_DISPLAY_WINDOW option can be set
; to notify JAWS when a AWS Remote window is encountered.
; value of 1 indicates the display window is entered.  A value
; of 0 indicates the display window is exited.

include "hjconst.jsh"
include "RemoteAccess.jsm"
include "Common.jsm"

import "HomeRowUIAObject.jsd"

Void Function AutostartEvent ()
var int result
if (!IsJFWInstall() && (GetJAWSMode() != jawsMode_MagUtil) && !IsRemoteAccessClientEnabled())
	result = ExMessageBox(msgInstallRAS, msgTitleInstallRAS, MB_YESNOCANCEL|MB_ICONQUESTION|MB_DEFBUTTON1)
	if (result == IDYES)
		result = EnableRemoteAccessClient(TRUE)
		MessageBox(msgRestartRAS)
	endif
endif
EndFunction

void Function MenuModeEvent(handle Winhandle, int mode)
if mode != MENU_INACTIVE then
	SetJCFOption ( OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 0)
endif
MenuModeEvent(Winhandle, mode)
EndFunction

void Function AutoFinish()
SetJCFOption ( OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 0)
EndFunction

int Function IsAWSFocus(handle FocusWindow)
var string windowClass = GetWindowClass(FocusWindow)
var int windowStyles = GetWindowStyleBits(FocusWindow)
; AWS 3.04 and later uses WPF window
var int index = StringSegmentIndex (windowClass, ";", "HwndWrapper[workspaces")
if index > 0 then 
; thickframe 0x00040000 is the windowed host; maximize 0x01000000 is the fullscreen host  
	if windowStyles & 0x00040000 || windowStyles & 0x01000000
		return TRUE
 	endIf
endIf
return FALSE
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
; Focus moving to Workspaces Remote Display Window
if IsAWSFocus(FocusWindow) then
	SetJCFOption ( OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 1)
else
	SetJCFOption ( OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 0)
EndIf
FocusChangedEvent(FocusWindow, PrevWindow)
EndFunction


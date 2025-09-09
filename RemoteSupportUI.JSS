; Copyright 2020 by Freedom Scientific, Inc.
; Freedom Scientific Remote Support UI script file

include "hjConst.jsh"
include "jfw.jsh"
include "jfw.jsm"

int function InRemoteDesktopDialog()
return stringContains (getWindowOwner (GetFocus ()), "RemoteSupportUI.exe")
endFunction

int function ScreenSensitiveHelpRemoteDesktopDialog()
if ! InRemoteDesktopDialog() return FALSE endIf
var int ControlID = getControlID (getFocus ())
if controlID == 1001 then
	SayMessage (OT_USER_BUFFER, sshMsg_RemoteDesktopChannelsListBox)
	AddHotKeyLinks ()
	return TRUE
elIf ControlID == 1004 then
	SayMessage (OT_USER_BUFFER, sshMsg_RemoteDesktopConnectionStatusListBox)
	AddHotKeyLinks ()
	return TRUE
elIf controlID == 1002 then
	SayMessage (OT_USER_BUFFER, sshMsg_RemoteDesktopRepairButton)
	AddHotKeyLinks ()
	return TRUE
elIf ControlID == 1003 then
	SayMessage (OT_USER_BUFFER, sshMsg_RemoteDesktopTestConnectionButton)
	AddHotKeyLinks ()
	return TRUE
elIf controlID == 1006 then
	SayMessage (OT_USER_BUFFER, sshMsg_RemoteDesktopRefreshButton)
	AddHotKeyLinks ()
	return TRUE
else
	return FALSE
endIf
endFunction


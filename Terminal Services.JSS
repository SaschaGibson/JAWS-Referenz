; When focus moves to the Microft Terminal Services window,
; the client JAWS needs to go to sleep.  We originally set
; jcf options to perform sleep mode, but the login screens
; were then silent.
; The OPT_TERMINAL_SERVICES_DISPLAY_WINDOW option can be set
; to notify JAWS when a Terminal Services Display window is
; encountered.  A value of 1 indicates the display window is
; entered.  A value of 0 indicates the display window is
; exited.

include "hjconst.jsh"
include "RemoteAccess.jsm"

Void Function AutostartEvent ()
var 
int result

if (!IsJFWInstall() && (GetJAWSMode() != jawsMode_MagUtil) && !IsRemoteAccessClientEnabled())
	result = ExMessageBox(msgInstallRAS, msgTitleInstallRAS, MB_YESNOCANCEL|MB_ICONQUESTION|MB_DEFBUTTON1)
	if (result == IDYES)
		result = EnableRemoteAccessClient(TRUE)
		MessageBox(msgRestartRAS)
	endif
endif
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
; Focus moving to Terminal Services Display Window
var
	string WindowClass = GetWindowClass(FocusWindow),
	string prevWindowClass = GetWindowClass(PrevWindow)
if (windowClass == "IHWindowClass"
|| windowClass == "RAIL_WINDOW") then
	SetJCFOption (	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 1)
elif (prevWindowClass == "IHWindowClass"
|| prevWindowClass == "RAIL_WINDOW") then
		SetJCFOption (	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 0)
endif

	FocusChangedEvent(FocusWindow, PrevWindow)
EndFunction
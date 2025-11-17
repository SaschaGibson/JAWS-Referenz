; When focus moves to the Citrix Display window,the client JAWS 
; needs to go to sleep.  We originally set jcf options to perform 
; sleep mode, but the login screens were then silent.
; The OPT_TERMINAL_SERVICES_DISPLAY_WINDOW option can be set
; to notify JAWS when a Citrix Display window is encountered.  
; A value of 1 indicates the display window is entered.  A value 
; of 0 indicates the display window is exited.

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
	string windowClass = GetWindowClass(FocusWindow),
	string prevWindowClass = GetWindowClass(PrevWindow)
if (IsWinFormsWindow (focusWindow) 
||windowClass == "ctxICADisp" || windowClass == "Transparent Windows Client") then
	SetJCFOption (	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 1)
elif ((IsWinFormsWindow (prevWindow) && ! isWinformsWindow (focusWindow))
|| prevWindowClass == "ctxICADisp" || prevWindowClass == "Transparent Windows Client") then
		SetJCFOption (	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 0)
endif

	FocusChangedEvent(FocusWindow, PrevWindow)
EndFunction
; When focus moves to the VMWare Remote window, the client 
; JAWS needs to go to sleep.  We originally set jcf options
; to perform sleep mode, but the login screens were then silent.
; The OPT_TERMINAL_SERVICES_DISPLAY_WINDOW option can be set
; to notify JAWS when a VMWare Remote window is encountered.
; value of 1 indicates the display window is entered.  A value
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
	SetJCFOption (	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 1)
EndFunction
void Function AutoFinish()
	SetJCFOption (	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 0)
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
;   Swallow the focus changed event as published apps will speak the title remotely.  We do not want double speaking where the local JAWS will speak the title too
;	FocusChangedEvent(FocusWindow, PrevWindow)
EndFunction
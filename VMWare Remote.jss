; When focus moves to the VMWare Remote window, the client 
; JAWS needs to go to sleep.  We originally set jcf options
; to perform sleep mode, but the login screens were then silent.
; The OPT_TERMINAL_SERVICES_DISPLAY_WINDOW option can be set
; to notify JAWS when a VMWare Remote window is encountered.
; value of 1 indicates the display window is entered.  A value
; of 0 indicates the display window is exited.

include "hjconst.jsh"
include "RemoteAccess.jsm"
include "Common.jsm"
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

void Function MenuModeEvent(handle Winhandle, int mode)
if(mode != MENU_INACTIVE)
	SetJCFOption (	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 0)
endif
MenuModeEvent(Winhandle, mode)
EndFunction

void Function WindowCreatedEvent(handle Window, int nLeft, int nTop, int nRight, int nBottom)
   if(GetWindowClass(Window) == "MKSEmbedded")
		SetJCFOption (	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 1)
  EndIf
   WindowCreatedEvent(Window, nLeft, nTop, nRight, nBottom)
EndFunction

void Function AutoFinish()
	SetJCFOption (	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 0)
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
; Focus moving to VMWare Remote Display Window
if(FindWindow(FocusWindow, "MKSEmbedded", cScNull))
	SetJCFOption (	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 1)
elif
	SetJCFOption (	OPT_TERMINAL_SERVICES_DISPLAY_WINDOW, 0)
EndIf
	FocusChangedEvent(FocusWindow, PrevWindow)
EndFunction
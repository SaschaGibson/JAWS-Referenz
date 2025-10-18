; Copyright 2023 by Freedom Scientific, Inc.
; JAWS script source for Face in View application

include "HjConst.jsh"
include "common.jsm"
include "FaceInView.jsm"

script scriptFileName ()
scriptAndAppNames (msgFaceInViewConfigName)
endScript

 Script HotKeyHelp ()
	If UserBufferIsActive ()
		UserBufferDeactivate()
	EndIf
	UserBufferClear()
	SayFormattedMessage(OT_User_Buffer, MSGFaceInViewHotkeyHelp)
EndScript

Script ScreenSensitiveHelp()
If UserBufferIsActive()
	UserBufferDeactivate()
	SayFormattedMessage(OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
endIf
var
	int iType = GetObjectSubTypeCode()
if iType == WT_UNKNOWN
	SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelpFaceInViewWindow)
	AddHotKeyLinks()
	return
elIf iType == WT_BITMAP
	SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelpFaceInViewImage)
	AddHotKeyLinks()
	return
elIf iType == WT_STATIC
	if GetObjectAutomationId () == "NoImageText"
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelpFaceInViewNoImage)
		AddHotKeyLinks()
		return
	endIf
	var
		string sName = StringSegment (GetObjectName(), cscColon, 1),
		string sMessage = FormatString (msgScreenSensitiveHelpFaceInViewText, sName)
	SayFormattedMessage(OT_USER_BUFFER, sMessage)
	AddHotKeyLinks()
	return
endIf
PerformScript ScreenSensitiveHelp()
EndScript

void Function AutoStartEvent ()
InitFaceInViewGlobals()
UpdateConfidenceThreshold()
endfunction

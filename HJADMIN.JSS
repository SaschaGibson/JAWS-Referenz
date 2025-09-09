include "hjconst.jsh"
include "common.jsm"
include "hjadmin.jsh"
include "hjadmin.jsm"

Script ScriptFileName ()
ScriptAndAppNames(msgHjAdmin_L)
EndScript

Script ScreenSensitiveHelp()
var
	handle hWnd,
	int SubType,
	int id,
	string sRealWindow
Let hWnd = GetCurrentWindow()
Let SubType = GetWindowSubtypeCode (hWnd)
Let id = GetControlID (hWnd)
let sRealWindow = GetWindowName(GetRealWindow(hWnd))
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if StringContains(SrealWindow, wn_logon)  then
	if SubType == WT_COMBOBOX  then
		if id == id_user_name  then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp1_L)
			return
		ElIf id == id_password  then
			SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp2_L)
			return
		Else
			PerformScript ScreenSensitiveHelp()
			return
		EndIf
	ElIf SubType == WT_BUTTON then					
		if id == id_OK then
			SayFormattedMessage(OT_USER_BUFFER, cmsg365_L)
			return
		ElIf id == id_CANCEL then
			SayFormattedMessage(OT_USER_BUFFER, cmsg366_L)
			return
		ELSE
			PerformScript ScreenSensitiveHelp()
			return
		EndIf
	Else
		PerformScript ScreenSensitiveHelp()
		return
	EndIf
ElIf sRealWindow == wn_main_hjadminWindow  then
	if SubType == WT_LISTVIEW then
		if id == id_user_list  then
			SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp7_L)
			return
		Else
			PerformScript ScreenSensitiveHelp()
			return
		EndIf
	ElIf SubType == WT_TREEVIEW then
		if Id == id_StationTabTree  then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp8_L)
		Else
			PerformScript ScreenSensitiveHelp()
			return
		EndIf
	ElIf SubType == WT_BUTTON then
		if id == id_Add_user_btn then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp3_L)
			return
		ElIf id == id_del_user_btn then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp4_L)
		ElIf id == id_Modify_User_btn then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp5_L)
			return
		ElIf id == id_add_device_btn then
			SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp6_L)
			return
		Else
			PerformScript ScreenSensitiveHelp()
			return
		EndIf
	Else
		PerformScript ScreenSensitiveHelp()
		return
	EndIf
ElIf SrealWindow == wn_select_device then
	if SubType == WT_LISTVIEW then
		If id == id_device_list  then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp9_L)
			return
		Else
			PerformScript ScreenSensitiveHelp()
			return
		EndIf
	Else
		PerformScript ScreenSensitiveHelp()
		return
	EndIf
Else   ;sRealWindow
			PerformScript ScreenSensitiveHelp()
return
EndIf    ;sRealWindow
EndScript




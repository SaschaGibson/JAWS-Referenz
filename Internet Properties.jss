;Copyright 2010-2015 by Freedom Scientific, Inc.
; JAWS 8.00 default script file for Internet Options control panel applet

include "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "ie.jsh"
include "IE.jsm"

Script SayLine ()
Var
	handle hWnd,
	int iSubtype,
	string sName
If IsSameScript () then
	SpellLine ()
	Return
EndIf
if UserBufferIsActive()
|| !IsPCCursor()
|| GlobalMenuMode then
	PerformScript SayLine()
	return
EndIf
if GetObjectSubtypeCode() == wt_button then
	let sName = GetObjectName()
	if StringCompare(sName,objn_settings_button) == 0
	|| StringCompare(sName,objn_Delete_button) == 0 then
		SayObjectTypeAndText()
		return
	EndIf
EndIf
let hWnd = GetFocus()
let iSubtype = GetWindowSubtypeCode(hWnd)
if iSubtype == wt_multiline_edit then
	Say(GetLine(),ot_line)
	return
ElIf iSubtype == wt_UpDownSlider then
	if GetControlID(GlobalFocusWindow) == id_Privacy_Settings_slider then
		SayWindowTypeAndText(GlobalFocusWindow)
		return
	EndIf
EndIf
PerformScript SayLine ()
EndScript

Script SayNextLine ()
If !IsPcCursor ()
|| GlobalMenuMode then
	PerformScript SayNextLine ()
	Return
EndIf
if GetWindowSubtypeCode(GlobalFocusWindow) == wt_multiline_edit then
	NextLine()
	Say(GetLine(),ot_line)
	return
EndIf
PerformScript SayNextLine ()
EndScript

Script SayPriorLine ()
If !IsPcCursor ()
|| GlobalMenuMode then
	PerformScript SayPriorLine ()
	Return
EndIf
if GetWindowSubtypeCode(GlobalFocusWindow) == wt_multiline_edit then
	PriorLine()
	Say(GetLine(),ot_line)
	return
EndIf
PerformScript SayPriorLine ()
EndScript

Script JAWSPageUp ()
if GetWindowSubtypeCode(GlobalFocusWindow) == wt_multiline_edit then
	JAWSPageUp()
	Say(GetLine(),ot_line)
	return
EndIf
PerformScript JAWSPageUp ()
EndScript

Script JAWSPageDown ()
if GetWindowSubtypeCode(GlobalFocusWindow) == wt_multiline_edit then
	JAWSPageDown()
	Say(GetLine(),ot_line)
	return
EndIf
PerformScript JAWSPageDown ()
EndScript

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd,
	int iLVFocus,
	string sText,
	int iSubtype,
	int iCtrl
let iSubtype = GetObjectSubtypeCode()
if iSubtype == wt_button then
	let sText = GetObjectName()
	if StringCompare(sText,objn_settings_button) == 0 then
		;we must distinguish the IE7 Internet Options settings buttons apart:
		let iCtrl = GetControlID(GetFocus())
		if iCtrl == id_TemporaryInternetFilesAndHistorySettings_button then
			;call the button by the name of the dialog it opens:
			Say(wn_TemporaryInternetFilesAndHistorySettings,ot_control_name)
			IndicateControlType(wt_button,cscSpace,cscSpace)
			return
		ElIf iCtrl == id_SearchDefaultSettings_button then
			;call the button by a modification of the name of the dialog it opens:
			Say(scSearchDefaultSettings,ot_control_name)
			IndicateControlType(wt_button,cscSpace,cscSpace)
			return
		ElIf iCtrl == id_TabbedBrowsingSettings_button then
			;call the button by the name of the dialog it opens:
			Say(wn_TabbedBrowsingSettings,ot_control_name)
			IndicateControlType(wt_button,cscSpace,cscSpace)
			return
		ElIf iCtrl == id_PopUpBlockerSettings_button then
			;call the button by the name of the dialog it opens:
			Say(wn_PopUpBlockerSettings,ot_control_name)
			IndicateControlType(wt_button,cscSpace,cscSpace)
			return
		ElIf iCtrl == id_AutoCompleteSettings_button then
			;call the button by the name of the dialog it opens:
			Say(wn_AutoCompleteSettings,ot_control_name)
			IndicateControlType(wt_button,cscSpace,cscSpace)
			return
		ElIf iCtrl == id_FeedSettings_button then
			;call the button by the name of the dialog it opens:
			Say(wn_FeedSettings,ot_control_name)
			IndicateControlType(wt_button,cscSpace,cscSpace)
			return
		EndIf
	ElIf StringCompare(sText,objn_delete_button) == 0 then
		let iCtrl = GetControlID(GetFocus())
		if iCtrl == id_BrowsingHistoryDelete_button then
			;call the button by a modification of the name of the dialog it opens:
			Say(scBrowsingHistoryDelete,ot_control_name)
			IndicateControlType(wt_button,cscSpace,cscSpace)
			return
		EndIf
	EndIf
ElIf iSubtype == wt_UpDownSlider then
	let iCtrl = GetControlID(GlobalFocusWindow)
	if iCtrl == id_Privacy_Settings_slider then
		SayObjectTypeAndText(nLevel,includeContainerName)
		;speak the extra information about the current slider setting:
		let hWnd = GetNextWindow(hWnd)
		say(GetWindowTextEx(hWnd,0,0),ot_line)
		let hWnd = GetNextWindow(hWnd)
		say(GetWindowTextEx(hWnd,0,0),ot_line)
		return
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

int function BrailleAddObjectName(int iSubtype)
var
	handle hWnd,
	int iCtrl
if iSubtype == wt_button then
	let hWnd = GetFocus()
	let iCtrl = GetControlID(GetFocus())
	if iCtrl == id_TemporaryInternetFilesAndHistorySettings_button then
		BrailleAddString(wn_TemporaryInternetFilesAndHistorySettings,GetCursorCol(),GetCursorRow(),0)
		return true
	ElIf iCtrl == id_SearchDefaultSettings_button then
		BrailleAddString(scSearchDefaultSettings,GetCursorCol(),GetCursorRow(),0)
		return true
	ElIf iCtrl == id_TabbedBrowsingSettings_button then
		BrailleAddString(wn_TabbedBrowsingSettings,GetCursorCol(),GetCursorRow(),0)
		return true
	ElIf iCtrl == id_PopUpBlockerSettings_button then
		BrailleAddString(wn_PopUpBlockerSettings,GetCursorCol(),GetCursorRow(),0)
		return true
	ElIf iCtrl == id_AutoCompleteSettings_button then
		BrailleAddString(wn_AutoCompleteSettings,GetCursorCol(),GetCursorRow(),0)
		return true
	ElIf iCtrl == id_FeedSettings_button then
		BrailleAddString(wn_FeedSettings,GetCursorCol(),GetCursorRow(),0)
		return true
	ElIf iCtrl == id_BrowsingHistoryDelete_button then
		BrailleAddString(scBrowsingHistoryDelete,GetCursorCol(),GetCursorRow(),0)
		return true
	EndIf
EndIf
return BrailleAddObjectName(iSubtype)
EndFunction

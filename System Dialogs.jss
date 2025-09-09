; Call the script file of your choice using the SwitchToScriptFile function for each icon in Control Panel

include "HjConst.jsh"
include "hjglobal.jsh"
include "rundll32.jsm"
include "rundll32.jsh"
include "Common.jsm" ;FSI Common Strings
include "system dialogs.jsm"

GLOBALS
	int giVolumeKeys


;The following overwrite supports sliders via object value,
;as standard functionality no longer works:

void Function SayWord ()
var
	int nSubtype,
	int iOtType
If ! IsPcCursor () then
	Return SayWord ()
EndIf
Let nSubtype = GetObjectSubtypeCode ()
Let iOtType = OT_WORD
If (nSubtype == WT_UPDOWNSLIDER ||
nSubtype == WT_UPDOWNSLIDER) then
	Pause() ;if value is retrieved too soon, may get a false reading of 0
	Return Say (GetObjectValue(SOURCE_CACHED_DATA), iOtType)
EndIf
Return SayWord ()
EndFunction

Void Function AutoStartEvent ()
var
	handle hFocus,
	handle hReal,
	string sWinName
let hFocus = GetFocus()
let hReal = GetRealWindow(hFocus)
let sWinName = GetWindowName(hReal)
if GetWindowClass(GetFirstChild(hReal)) == cwc_DirectUIhWND then
 	if sWinName == wn_ConnectToANetwork
 	|| StringContains (sWinName,  wn_ConnectToANetwork_2)
 	|| stringContains (sWinName, wn_VPN) then
		SwitchToConfiguration(config_ConnectToANetwork)
		return
	EndIf
EndIf
if StringCompare(sWinName,wn_ConnectVPNConnection) == 0
|| StringContains (sWinName, wn_ConnectToANetwork_2)
|| stringContains (sWinName, wn_VPN) then
	SwitchToConfiguration(config_ConnectToANetwork)
ElIf FindDescendantWindow(hReal,Display)
|| StringContains(sWinName,wn_Display_Properties)
|| StringContains(sWinName,wn_Display_Settings) then
	SwitchToScriptFile(script_Display,FNMain)
ElIf StringCompare (sWinName, wn_InternetProperties) == 0 then
	SwitchToConfiguration (config_Internet_Properties)
elif StringCompare(GetWindowName(GetAppMainWindow(hFocus)),wn_BluetoothDevices) == 0 then
	SwitchToConfiguration(config_BluetoothDevices)
EndIf
EndFunction

;The following supports speaker / volume icons in properties for Windows Vista:

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
If StringContains (RealWindowName, WN_VOLUME_GENERAL) then
	Let giVolumeKeys = TRUE;
Else
	Let giVolumeKeys = FALSE;
EndIf
Return ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
EndFunction

String Function getAccName (int self)
var
	object o,
	int cid

let o = getFocusObject(cid)
if o then
	if self then
		return o.accName(0)
	else
		return o.accName(cid)
	Endif
Endif
return cscNull
EndFunction

string function specialName()
; Adds MSAA accDescription when present to the name of the current item.
var object o, int childID
var int tcode = getObjectSubtypeCode(FALSE, 1)
if tcode != WT_ListView && tcode != WT_ListBoxItem && tcode != WT_LISTBOX then
	return ""
endIf
let o = getFocusObject(childID)
if !o then
	return ""
endIf
var string desc let desc = o.accDescription(childID)
if stringIsBlank(desc) then
	return ""
endIf
var string name = formatString("%1, %2",
	o.accName(childID), desc
)
return name
endFunction

int Function HandleCustomWindows (handle hWnd)
var
	int nSubtypeCode
Let nSubtypeCode = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
If (nSubtypeCode == WT_UPDOWNSCROLLBAR ||
nSubtypeCode == WT_UPDOWNSLIDER ||
nSubtypeCode == WT_LEFTRIGHTSLIDER) then
	SayControlEXWithMarkup (hWnd, GetObjectName(SOURCE_CACHED_DATA), cscNull, cscNull,
	cscNull, cscNull, GetObjectValue(SOURCE_CACHED_DATA))
	Return TRUE
elif (nSubTypeCode == wt_listboxItem || nSubTypeCode == wt_listview) && getWindowName(GetRealWindow(getFocus())) == scWindowsFirewallSettings then
	SayControlEXWithMarkup (hWnd, getAccName(1))
	return true
EndIf
Return HandleCustomWindows (hWnd)
EndFunction

Script ScriptFileName ()
ScriptAndAppNames (msgConfigName)
EndScript

Script ShiftTab ()
If giVolumeKeys then
	ShiftTabKey ()
Else
	PerformScript ShiftTab ()
EndIf
EndScript

Script Tab ()
If giVolumeKeys then
	TabKey ()
Else
	PerformScript Tab ()
EndIf
EndScript

Script SayLine ()
var
	int nSubtypeCode
Let nSubtypeCode = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
If nSubtypeCode == WT_UPDOWNSCROLLBAR
|| nSubtypeCode == WT_UPDOWNSLIDER
|| nSubtypeCode == WT_LEFTRIGHTSLIDER then
	SayControlEXWithMarkup (GetFocus(), GetObjectName(SOURCE_CACHED_DATA), cscNull, cscNull,
		cscNull, cscNull, GetObjectValue(SOURCE_CACHED_DATA))
	Return
endIf
var string name let name = specialName()
if name then
	SayControlEXWithMarkup (GetFocus(), name, " ", " ",
		" ", " ", " ")
	return
EndIf
PerformScript SayLine()
EndScript

int function BrailleAddObjectValue(int nSubtypeCode)
If (nSubtypeCode == WT_UPDOWNSCROLLBAR ||
nSubtypeCode == WT_UPDOWNSLIDER ||
nSubtypeCode == WT_LEFTRIGHTSLIDER) then
	BrailleAddString (GetObjectValue(SOURCE_CACHED_DATA),GetCursorCol(),GetCursorRow(),FALSE)
	Return TRUE
elif nSubtypeCode == WT_ListView then
	var string name let name = specialName()
	if name then
		BrailleAddString (name,GetCursorCol(),GetCursorRow(),FALSE)
		Return TRUE
	endIf
EndIf
return BrailleAddObjectValue(nSubtypeCode)
endFunction

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	if getObjectSubTypeCode(SOURCE_CACHED_DATA) == wt_listboxitem
	|| getObjectSubTypeCode() == wt_listview then
		if getWindowName(GetRealWindow(getFocus())) == scWindowsFirewallSettings then
			ScheduleFunction("AnnounceState",2)
		Endif
	Endif
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Void Function AnnounceState ()
; called by keyPressed events on list views with checkboxes
MSAARefresh ()
IndicateControlState (wt_checkbox, GetControlAttributes (true)& ~ctrl_selected, cscNull)
EndFunction

void function ScreenStabilizedEvent(handle hwndLastScreenWrite)
var
	handle hForeground,
	handle hWnd
if !GetFocus() then
	let hForeground = GetForegroundWindow()
	if GetWindowName(hForeground) == wn_SafelyRemoveHardware then
		let hWnd = FindWindow(hForeground,cwc_SysTreeView32)
		if IsWindowVisible(hWnd)
		&& !IsWindowDisabled(hWnd) then
			SetFocus(hWnd)
			return
		EndIf
	EndIf
EndIf
EndFunction

void function ProcessSayAppWindowOnFocusChange(handle AppWindow, handle FocusWindow)
var
	handle hWnd
if GlobalPrevApp != AppWindow
&& AppWindow != FocusWindow
&& GlobalWasHjDialog
&& !InHjDialog() then
	let hWnd = GetRealWindow(GetFocus())
	if GetWindowName(hWnd) == wn_SafelyRemoveHardware then
		let hWnd = GetFirstChild(hWnd)
		while GetWindowSubtypeCode(hWnd) == wt_static
			if IsWindowVisible(hWnd) then
				Say(GetWindowTextEx(hWnd,0,0),ot_dialog_text)
			EndIf
			let hWnd = GetNextWindow(hWnd)
		EndWhile
		return
	EndIf
EndIf
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
EndFunction

void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
var
	int iWinType,
	int iObjType
if nSelectingText then
	return
EndIf
SaveCursor ()
PCCursor ()
Let iObjType = GetObjectSubtypeCode ()
if IsJavaWindow (curHwnd) then
	if g_JavaIgnoreNextActiveItemChange then
		let g_JavaIgnoreNextActiveItemChange = 0
		RestoreCursor ()
		return
	EndIf
	if WT_TABLE == iObjType
	|| WT_TABLECELL == iObjType then
		if !InTable() then
			let g_JavaPrevNumOfCells = 0
			let g_JavaTableNavDir = TABLE_NAV_NONE
		else
			SpeakTableCells (g_JavaTableNavDir, g_JavaPrevNumOfCells)
			let g_JavaPrevNumOfCells = 0
			let g_JavaTableNavDir = TABLE_NAV_NONE
			RestoreCursor ()
			return
		endif
	endIf
endIf
If (WT_TREEVIEW == iObjType
|| WT_TREEVIEWITEM == iObjType
|| GetWindowClass(curHwnd) == cwc_SysTreeview32)
&& !MenusActive() then
	SayTreeViewLevel (true)
	RestoreCursor ()
	return
elif iObjType == WT_TABLECELL
|| iObjType == WT_COLUMNHEADER
|| iObjType == WT_ROWHEADER then
	if globalSpeakHeaderOnCellChange == TABLE_NAV_HORIZONTAL then
		Say(GetColumnHeader(TRUE),OT_SCREEN_MESSAGE)
	elif globalSpeakHeaderOnCellChange == TABLE_NAV_VERTICAL then
		Say(GetRowHeader(TRUE),OT_SCREEN_MESSAGE)
	EndIf
	sayCell()
	RestoreCursor ()
	return
endIf
let iWinType = getWindowSubtypeCode (curHwnd)
if iWinType != WT_TASKBAR && iWinType != WT_SYSTRAY
&& (iObjType == wt_button
|| iObjType == wt_CheckBox
|| iObjType == wt_RadioButton) then
	SayObjectTypeAndText()
else
	var string name let name = specialName()
	if name then
		SayControlEXWithMarkup (GetFocus(), name, " ", " ",
			" ", " ", " ", " ")
	else
		sayObjectActiveItem(False)
	endIf
EndIf
RestoreCursor ()
EndFunction

void function sayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if nLevel != 0 then
	sayObjectTypeAndText(nLevel,includeContainerName)
	return
endIf
var string name let name = specialName()
if name then
	SayControlEXWithMarkup (GetFocus(), getObjectName(SOURCE_CACHED_DATA, 1), cscNull, cscNull,
		cscNull, cscNull, name)
	return
endIf
sayObjectTypeAndText(nLevel,includeContainerName)
endFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
var
	int result,
	string sClass,
	handle hParent
let result = NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes,
	nTextColor, nBackgroundColor, nEcho, sFrameName)
if result == false then
	if hWnd != hFocus
	&& GetWindowSubtypeCode(hFocus) == wt_edit_Spinbox then
		let sClass = GetWindowClass(hWnd)
		let hParent = GetParent(hWnd)
		if hParent == GetParent(GetFocus())
		&& GetWindowClass(hParent) == wc_DigitalClock
		&& sClass == wc_Static then
			;changing value in date time edit spinboxes:
			return true
		elif sClass == cwc_SysMonthCal32 then
			;focus moving to date time edit spinboxes:
			return true
		EndIf
	EndIf
EndIf
return result
EndFunction

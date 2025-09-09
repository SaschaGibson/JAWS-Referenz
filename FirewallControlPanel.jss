; Windows Vista firewall window
include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "FirewallControlPanel.jsm"

;********************************************************************************************************************
int Function HandleCustomWindows(handle hwnd)
var
	string GroupName,
	int controlID

	let controlID = getControlID(hwnd)
	if controlID == cid_change_settings then
		let GroupName = getWindowName(getPriorWindow(getPriorWindow(hwnd)))		
		SayControlEx (hwnd, getObjectName(),getObjectType(), "", GroupName)
		return true
	elif controlID == cid_network_location then
		let GroupName = getWindowName(getPriorWindow(getPriorWindow(hwnd))) + " " + getWindowName(getPriorWindow(hwnd))
		SayControlEx (hwnd, getObjectName(),getObjectType(), "", GroupName)
		return true
	elif controlID == cid_security_center then
		let GroupName = getWindowText(getPriorWindow(getPriorWindow(hwnd)),false) 
		SayControlEx (hwnd, getObjectName(),getObjectType(), "", GroupName)
		return true
	Endif
return false
EndFunction

;********************************************************************************************************************
int Function StaticDoChildWindows (handle hWnd)
If ! IsWindowVisible (hWnd) || getWindowTypeCode(hwnd) != wt_static then
	Return TRUE;
EndIf
SayWindowTypeAndText (hWnd)
Return TRUE
EndFunction

;********************************************************************************************************************
; announces the static text automatically when the window opens
;********************************************************************************************************************
int Function HandleCustomAppWindows(handle hwnd)
if getWindowClass(hwnd) == cwc_fwcplui then
;	say(getWindowName(hwnd),ot_line) ; while this should be announced, announcing it will cause "windows firewall" to be announced 3 times due to that text appearing on the screen 3 times
	EnumerateChildWindows (GetRealWindow (GlobalFocusWindow), "StaticDoChildWindows")
	return true
Endif
return false
EndFunction

;********************************************************************************************************************
; called by tab and shift+tab
;********************************************************************************************************************
int Function specialFocus (int forward)
var
	handle hwnd,
	handle hCurrent,
	int controlID,
	handle nullHwnd

	let hwnd = nullHwnd
	let hCurrent = getFocus()
	let controlID = getControlId(hCurrent)
	if controlID== cid_windows_firewall && forward then
		let hwnd = FindDescendantWindow (getRealWindow(getFocus()), cid_allow_a_program)
	elif controlID == cid_allow_a_program then
		if forward then
			let hwnd = FindDescendantWindow (getRealWindow(getFocus()), cid_security_center)
		Else
			let hwnd = FindDescendantWindow (getRealWindow(getFocus()), cid_windows_firewall)
		Endif
	elif controlID == cid_security_center then
		if forward then 
			let hwnd = FindDescendantWindow (getRealWindow(getFocus()), cid_network_center) 
		Else
			let hwnd = FindDescendantWindow (getRealWindow(getFocus()), cid_allow_a_program) 
		Endif
	elif controlID == cid_network_center && !forward then
		let hwnd = FindDescendantWindow (getRealWindow(getFocus()), cid_security_center)
	elif controlID == cid_help && !forward then
		let hwnd = FindDescendantWindow (getRealWindow(getFocus()), cid_network_center)
	Endif
	if hwnd then
			setFocus(hwnd)
			return true
	Endif
return false
EndFunction

;********************************************************************************************************************
; creates a new tab order
;********************************************************************************************************************
Script Tab()

if specialFocus(1) then
	return
Endif
performScript Tab()
EndScript

;********************************************************************************************************************
; creates a new tab order
;********************************************************************************************************************
Script ShiftTab()

if specialFocus(0) then
	return
Endif
performScript ShiftTab()

EndScript


;********************************************************************************************************************************
; JAWS Scripts for AOL Browser and JAWS 6.0
; Author: Victor Tsaran and Jon Avila of BART Group
; Last Updated: 7/27/05
;********************************************************************************************************************************

include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "ie.jsm"
include "ie.jsh"

CONST
;	wcOpen = "ATL:00D081E8",
	wcOpen = "ATL:010C81E8",	 ; class name of the open dialog
	wcSetAsDefault = "ATL:010CE1F8",
	wnOpen = "Open",
	wnSetAsDefaultBrowser = "Set As Default Browser",
	msgOpenURL = "Enter the web address(URL) or local file you would like to open.",
	msgAddressLabelID = "TxtAddress",
	tnLabel = "label",
	msgScriptName = "AOL Explorer",
	ctLink = "link"


;folloing 2 lines added by roy
Globals
int ContentBrowserFirstTime, 
int JAWSVersion

;Roy added AutoStartEvent
Void Function AutoStartEvent ()
if (ContentBrowserFirstTime ==0) then
Let JAWSVersion = GetJFWVersion()
Let ContentBrowserFirstTime=1
endif
EndFunction



;**************************************************************************
Script ScriptFileName()
	ScriptAndAppNames(msgScriptName)
EndScript

;****************************************************************************************************
Int Function GetAddressBox(Object byref o)
Var
	Object oDoc, Object oAll, Object element,
	String sID, Int iCounter, Int iSafety

; Need to make sure that JAWS gets the DOM hook
Let oDoc = IE4GetCurrentDocument ()
While (!oDoc && iSafety < 10)
	Delay(1)
	Let oDoc = IE4GetCurrentDocument ()
	Let iSafety = iSafety + 1
EndWhile
If (!oDoc) then
	Return FALSE
EndIf

Let oAll = oDoc.all
If (oAll.length <= 0) then
	Return FALSE
EndIf
let icounter = 1
While (iCounter <= oAll.length)
	Let element = oAll(iCounter)
	If (element.tagname == tnLabel && element.HTMLFor == msgAddressLabelID) then
		Let sID = element.HTMLFor
		Let element = oAll(sID)
		Let o = element
		Return TRUE
	EndIf
Let iCounter = iCounter + 1
EndWhile

Return FALSE
EndFunction

;***************************************************************************************************
int Function SetAsDefault(object byref o)
var
	object oDoc, int iSafety


Let oDoc = IEGetCurrentDocument ()
let iSafety = 0
While (!oDoc && iSafety < 10)
	Delay(1)
	Let oDoc = IEGetCurrentDocument ()
	Let iSafety = iSafety + 1
EndWhile
If (!oDoc) then
	Return FALSE
EndIf

let o = oDoc.getElementById("ChkAlwaysAsk")
if o then
	say(oDoc.getElementById("text1").InnerText,ot_jaws_message)
	say(oDoc.getElementById("text2").InnerText,ot_jaws_message)
	return true
endif

EndFunction

;***************************************************************************************************
Void Function FocusChangedEvent(Handle hCurWin, Handle hPrevWin)
Var
	Object o,
	Handle hwnd

if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (hCurWin, hPrevWin)
endIf
Let hwnd = GetRealWindow(hCurWin)
If (GetWindowName(hwnd) == wnOpen) then
	If GetAddressBox(o) then
		If IsVirtualPCCursor () then
			SetJCFOption(OPT_VIRTUAL_PC_CURSOR, 0)
			o.focus()
		EndIf
	EndIf
elif (getWindowName(hwnd) == wnSetAsDefaultBrowser) && getWindowClass(hcurWin) == wcSetAsDefault && hCurWin == hwnd then
		setFocus(getFirstChild(getFirstChild(getFocus())))
		return		; a new focus changed event will get fired because now the virtual window has focus, do anything after this line does not process because focus isn't yet set for some reason
EndIf

FocusChangedEvent(hCurWin, hPrevWin)
EndFunction

;***************************************************************************************
int Function HandleCustomRealWindows (handle hWnd)
var
	object o, handle rhwnd

Let rhwnd = GetRealWindow(hwnd)
if (getWindowName(rhwnd) == wnSetAsDefaultBrowser) then
	if SetAsDefault(o) then
		if isVirtualPCCursor() then
			SetJCFOption(OPT_VIRTUAL_PC_CURSOR, 0)
;			TurnOnFormsMode ()
			o.setActive()
			return true
		endif
	endif
	return false
endif
EndFunction

;****************************************************************************************************
; Should this do more checking to see that the open dialog was just close???
;****************************************************************************************************
Void Function WindowDestroyedEvent(Handle hWindow)
If IsPCCursor() then
	SetJCFOption(OPT_VIRTUAL_PC_CURSOR, 1)
EndIf

WindowDestroyedEvent(hWindow)
EndFunction

;****************************************************************************************************
; copied from internet explorer.jss
;********************************************************************************************************************************
; copied from internet explorer.jss
;********************************************************************************************************************************
Script  JawsBackspace()
var
	int TheTypeCode
SaveCursor ()
PCCursor ()
let TheTypeCode = GetWindowSubtypeCode (GetCurrentWindow())
if IsVirtualPCCursor () then
	let BackForward = 1
EndIf
;Roy added code to check for jfw version
If JAWSVersion > 610000 then
endif
if TheTypeCode == WT_TREEVIEW 
|| TheTypeCode == WT_LISTVIEW then
	TypeKey (ks5)
else
	RouteInvisibleToPc ()
	InvisibleCursor ()
	PriorCharacter ()
	SayCharacter ()
	TypeKey(ks5)		; backspace
EndIf
EndScript


Script test ()
var
	object oDoc, int iSafety

sayString(getWindowClass(getFocus()))

;setFocus(getFirstChild
/*
Let oDoc = IEGetCurrentDocument ()
let iSafety = 0

While (!oDoc && iSafety < 10)
	Delay(1)
	Let oDoc = IEGetCurrentDocument ()
	Let iSafety = iSafety + 1
EndWhile

If (!oDoc) then
	sayString("not found")
else
	sayString("found")
EndIf
*/
EndScript

Int Function BrailleAddObjectValue(Int nSubtypeCode)
If nSubTypeCode == WT_EDIT
&& isPCCursor() then
	BrailleAddString(GetObjectValue(), 0, 0, GetCharacterAttributes ())
	Return TRUE
EndIf
Return BrailleAddObjectValue(nSubTypeCode)
EndFunction

void Function SayHighlightedText (handle hwnd, string buffer)
var
	string theClass,
	handle hCurWnd
let theClass=GetWindowClass(hwnd)
if TheClass==ie5Class then
	if nSuppressEcho then
		return
	EndIf
EndIf
if GlobalMenuMode>0 then
	If GetScreenEcho () > 0 then
		Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
	EndIf
	Return
ElIf !IsVirtualPCCursor() then 
	If TheClass == wcComboBox then
		If GetScreenEcho () > 0 then
			Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
		EndIf
	Else
		If GetScreenEcho () > 0 then
			let hCurWnd = GetCurrentWindow()
			if hwnd == hCurWnd
			&& GetWindowSubtypeCode(hCurWnd) == WT_TREEVIEW Then
				return
			else
				Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
			EndIf
		EndIf
		Return
	EndIf
Else
	If theClass==ieComboBoxClass 
	|| theClass == ieListBoxClass
	|| TheClass == wcComboBox Then
		If not IsVirtualPcCursor () then
			; We do not want combo box text to chatter when the VPC is somewhere else.
			If GetScreenEcho () > 0 then
				Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
			EndIf
		EndIf
	Else
		return
	EndIf
EndIf
EndFunction
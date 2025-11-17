; Copyright 1995-2015 by Freedom Scientific, Inc.
;AuthUI: Windows Vista logon

include "HjConst.jsh"
include "hjGlobal.jsh"
include "magcodes.jsh"
include "Common.jsm"
include "AuthUI.jsm" ; a few localizable constants.

const
	wn_LogonDlg = "AUTHUI.DLL: LogonUI Logon Window",
	wn_CtrlNotifySink = "CtrlNotifySink"

globals
	int giPreviousSubtypeCode,
	int giPassRight,
	int giPassLeft,
	int giPassTop,
	int giPassBottom


void function ProcessSayAppWindowOnFocusChange (handle AppWindow, handle FocusWindow)
var
	string sText
if GlobalPrevApp != AppWindow
&& AppWindow != FocusWindow
&& !GlobalWasHjDialog then
	if GetWindowClass(AppWindow) == wn_LogonDlg then
		let sText = GetWindowName(AppWindow)
		if sText then
			IndicateControlType(wt_dialog,sText)
		EndIf
		return
	EndIf
EndIf
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
var
	string sText
if GetWindowClass(RealWindow) == wn_LogonDlg then
	if GetRealWindow (FocusWindow) == AppWindow
	&& !GetNextWindow(FocusWindow)
	&& !GetPriorWindow(FocusWindow)
	&& GetObjectSubtypeCode(TRUE) == WT_BUTTON
	&& GetWindowClass(FocusWindow) == cwc_DirectUIhWND then
		Let sText = GetDialogStaticText ()
		If StringIsBlank(sText) then
			Let sText = MSAAGetDialogStaticText ()
		EndIf
		;Ensure that static text exists, and contains complete sentence, e.g. message,
		;as otherwise, said text is the username and redundant.
		if StringContains(sText,  cscPeriod)
		&& StringIsBlank(StringSegment(sText,cscPeriod,2)) then
			Say(sText,ot_dialog_text)
		EndIf
		Return
	EndIf
EndIf
ProcessSayRealWindowOnFocusChange(AppWindow,RealWindow,RealWindowName,FocusWindow)
EndFunction

void function processMAGicCenteringOnFocusChange (string RealWindowName, handle FocusWindow)
if GetWindowClass(FocusWindow) == cwc_DirectUIhWND
&& GetWindowClass(GetParent(FocusWindow)) == wn_LogonDlg
&& !GetNextWindow(FocusWindow) && !GetPriorWindow(FocusWindow) Then
	If (!GetObjectSubtypeCode(FocusWindow)) then
		; Center for CTRL+ALT+DELETE prompt
		CenterOnWindow(FocusWindow, 1)	
	ElIf GetObjectSubtypeCode(FocusWindow) == WT_LISTBOXITEM
	&& giPreviousSubtypeCode != WT_LISTBOXITEM Then
		; Center for User List View
		CenterOnWindow(FocusWindow, 1)
	ElIf GetObjectSubtypeCode(FocusWindow) == WT_BUTTON
	&& GetObjectName() == wn_OkButton Then
		; Focus on the OK Button
		CenterOnWindow(FocusWindow, 2)
	EndIf
EndIf
Let giPreviousSubtypeCode = GetObjectSubtypeCode(FocusWindow)
if GetWindowClass(FocusWindow) == cwc_Edit
&& GetWindowClass(GetParent(FocusWindow)) == wn_CtrlNotifySink
&& GetWindowClass(GetParent(GetParent(FocusWindow))) == cwc_DirectUIhWND 
&& GetWindowClass(GetParent(GetParent(GetParent(FocusWindow)))) == wn_LogonDlg then
	; Focus to password edit
	CenterOnWindow(FocusWindow, 0)
	GetWindowRect(FocusWindow, giPassLeft, giPassRight, giPassTop, giPassBottom)
EndIf
endFunction

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName, handle FocusWindow)
if (getRunningFSProducts () & product_MAGic) then
	processMAGicCenteringOnFocusChange (RealWindowName, FocusWindow)
endIf
if GetWindowClass(GetParent(FocusWindow)) == wn_LogonDlg then
	SayObjectTypeAndText()
	return
EndIf
ProcessSayFocusWindowOnFocusChange(RealWindowName,FocusWindow)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd
let hWnd = GetCurrentWindow()
if GetWindowClass(hWnd) == cwc_DirectUIhWND
&& !GetNextWindow(hWnd)
&& !GetPriorWindow(hWnd) then
	if !GetObjectSubtypeCode(hWnd) then
		IndicateControlType(wt_unknown,GetWindowTextEx(hWnd,0,0))
		return
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void function CenterOnWindow(handle hWnd, int nAdjust)
;no need to check produts running here, as that is only checked before function is called.
var
	int nLeft,
	int nRight,
	int nTop,
	int nBottom,
	int xCenter,
	int yCenter,
	int magLevel
GetWindowRect(hWnd, nLeft, nRight, nTop, nBottom)
If nAdjust Then
	; The rect is too large.  Adjust to be at the center.
	let xCenter = (nLeft + nRight) / 2
	let yCenter = (nTop + nBottom) / 2
	If nAdjust == 2 Then
		;Adjust to be below the password field
		let yCenter = giPassBottom + (4 * (giPassBottom - giPassTop))
	EndIf
	let magLevel = MagGetOption(MID_LEVEL)
	let nLeft = xCenter * (magLevel-100) / magLevel
	let nRight = xCenter * (magLevel+100) / magLevel
	let nTop = yCenter * (magLevel-100) / magLevel
	let nBottom = yCenter * (magLevel+100) / magLevel
EndIf	
MagSetFocusToRect(nLeft, nRight, nTop, nBottom)
EndFunction

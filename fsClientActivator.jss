; Copyright 2013-2015 by Freedom Scientific, Inc.
; Freedom Scientific Client Activator script file

include "HjConst.jsh"
include "hjGlobal.jsh"
include "common.jsm"

GLOBALS
	int suppressTutorEvent,
	int suppressNextFocusSpeech ; for returning from 'please wait' static to prior control

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
if suppressTutorEvent then return endIf
tutorMessageEvent(hwndFocus, nMenuMode)
endFunction

void function SayObjectTypeAndText (optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var handle window = getCurrentWindow ()
if getControlID (window) == 1002 && getWindowSubtypeCode (window) == WT_EDIT then
	if stringIsBlank (getWindowName (window)) then
		SayControlEXWithMarkup (Window, GetWindowName (getNextWindow (Window)))
		return
	endIf
endIf
return SayObjectTypeAndText (nLevel,includeContainerName)
endFunction

void function SayHighlightedText (handle hwnd, string buffer)
;this overrides where authorization number in text box was speaking in the wrong place when highlighted, after the 'please wait' static box loses focus.
if suppressTutorEvent then return endIf
return sayHighlightedText (hwnd, buffer)
endFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
if getWindowSubtypeCode (FocusWindow) == WT_STATIC then
	SayWindowTypeAndText (FocusWindow)
	suppressNextFocusSpeech = ON
	Return
endIf
return FocusChangedEvent (FocusWindow, PrevWindow)
endFunction

void function ProcessSayAppWindowOnFocusChange(handle AppWindow, handle FocusWindow)
suppressTutorEvent = OFF 
;Defaults:
if ( IsMacToolTipWindow (FocusWindow) )
then
	return
endIf
if GlobalPrevApp == AppWindow
|| AppWindow == FocusWindow then
	;We will catch this change when we speak the focus window, so just return.
	return
EndIf
if GlobalWasHjDialog then
	;Do not speak the app name when exiting from an HJDialog back to the application.
	if !InHjDialog() then
		return
	else
		;due to timing issues with the JAWS Find dialog,
		;we cannot depend on the value returned by InHJDialog to tell if the dialog has cleared.
		;So, we test the previous hj dialog name:
		if GlobalPrevRealName == cwn_JAWS_Find then
			return
		EndIf
	EndIf
EndIf
;EndDefaults
;Prevent speaking of parent dialog if there is dialog within a dialog,
;the idea being that we are to reduce verbosity in output.
;This applies to the second to final screen. 
var handle RealWindow = GetRealWindow (FocusWindow)
if stringContains (getDialogStaticText (), "&") then
	return
EndIf
if RealWindow != AppWindow then
	if getWindowSubtypeCode (appWindow) == WT_DIALOG
	&& getWindowSubtypeCode (RealWindow) == WT_DIALOG then
		Return
	EndIf
EndIf
if getWindowSubtypeCode (AppWindow) == WT_DIALOG
&& getWindowSubtypeCode (getFirstChild (AppWindow)) == WT_DIALOG_PAGE then
; prevent duplicate window reading,
; example: returning to Finish dialog from external application,
; from the Registration web page or other locations.
	sayWindowTypeAndText (AppWindow)
	Return
endIf
ProcessSayAppWindowOnFocusChange(AppWindow, FocusWindow)
endFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
;Prevent speaking of parent dialog if there is dialog within a dialog,
;the idea being that we are to reduce verbosity in output (Bugzilla Bug 75855).
;This applies to the second to final screen. 
;if getWindowSubtypeCode (FocusWindow) == WT_STATIC 
;|| getWindowSubtypeCode (GlobalPrevFocus) == WT_STATIC 
if stringContains (getDialogStaticText (), "&") then
	return
EndIf
; we need to announce dialogue static text while travelling from one page to another.
If GlobalPrevReal != RealWindow
&& GlobalPrevApp == AppWindow
	if getWindowSubtypeCode (AppWindow) == WT_DIALOG
	&& getWindowSubtypeCode (getFirstChild (AppWindow)) == WT_DIALOG_PAGE then
		Say (GetDialogStaticText (), OT_DIALOG_TEXT)
		Return
	EndIf
EndIf
ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
endFunction

void function ProcessSayFocusWindowOnFocusChange(string RealWindowName, handle FocusWindow)
;Prevent speaking of parent dialog if there is dialog within a dialog,
;the idea being that we are to reduce verbosity in output (Bugzilla Bug 75855).
;prevent speaking the extra "Authorization code edit" when the license is being retrieved.
if suppressNextFocusSpeech then
	suppressNextFocusSpeech = OFF
	; trap tutor messages before they erroneously happen:
	suppressTutorEvent = ON
	return
endIf
ProcessSayFocusWindowOnFocusChange(RealWindowName, FocusWindow)
endFunction

int Function DoChildWindows (handle hWnd)
; overwrite here to cause duplicate static text windows to not re-read,
; for example, on the Finish dialog.
var handle CompareWindow = getFirstChild (GetFirstWindow (hwnd))
if getWindowSubtypeCode (hWnd) == WT_DIALOG_PAGE then
	return TRUE
endIf
if getWindowSubtypeCode (hwnd) == WT_STATIC && getWindowSubtypeCode (CompareWindow) == WT_STATIC
&& getWindowSubtypeCode (GetParent (CompareWindow)) == WT_DIALOG_PAGE then
	If StringContains (getWindowName (hwnd), getWindowName (CompareWindow)) then
		return TRUE
	endIf
endIf
var int Result = DoChildWindows (hwnd)
return Result
endFunction

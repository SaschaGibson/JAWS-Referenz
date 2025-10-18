;Installers, such as ActiveSync, which use newer install shield and are 
;stand-alone applications.

include"HjConst.jsh"
include"HjGlobal.jsh"
include"common.jsm"

string function GetDialogStaticText ()
;Customized for the dialogs.
;These dialogs are the app for the program.
var
	handle hWindow,
	handle hCompare,
	string strText
Let strText = GetDialogStaticText ()
If strText then
	Return strText
EndIf
If GlobalMenuMode then
	Return GetDialogStaticText ()
EndIf
Let hCompare = GetFocus ()
Let hWindow = GetAppMainWindow (hCompare)
If hWindow == hCompare then
	Return GetDialogStaticText ()
EndIf
If GetWindowSubtypeCode (hWindow) != WT_DIALOG then
	Return GetDialogStaticText ()
EndIf
;The dialog must be the real and the app window for our logic to work properly.
Let hCompare = GetRealWindow (hCompare)
If hWindow != hCompare then
	Return GetDialogStaticText ()
EndIf
Let hCompare = GetFirstChild (hWindow)
;For offending dialog boxes, 
;The first child of the dialog box is a button.  Anything else will hose.
If GetWindowSubtypeCode (hCompare) != WT_BUTTON then
	Return GetDialogStaticText ()
EndIf
;Now use hCompare to get the static text.
If ! hCompare then
	Return GetDialogStaticText ()
EndIf
While (GetNextWindow (hCompare))
	If (GetWindowSubtypeCode (hCompare) == WT_STATIC) then
		Let strText = strText + cScBufferNewLine + GetWindowText (hCompare, FALSE)
	EndIf
	Let hCompare = GetNextWindow (hCompare)
EndWhile
Return strText
EndFunction

void Function FocusOnButton (handle hFocus)
;Called from FocusChangedEvent and 
;Puts the focus on the actual button in the dialog instead of the main window.
var
	handle hWnd,
	int iFlag
Let hWnd = GetFirstChild (hWnd)
While GetNextWindow (hWnd) && ! iFlag
	Let hWnd = GetNextWindow (hWnd)
	If (IsWindowVisible (hWnd) &&
	GetWindowSubtypeCode (hWnd) == WT_DIALOG) then
		Let iFlag = 1
	EndIf
EndWhile
If iFlag then
	;Just to ensure that we get to the spot where User left off in the dialog:
	SaveCursor ()
	InvisibleCursor ()
	MoveToWindow (hWnd)
	RoutePcToInvisible ()
	RestoreCursor ()
EndIf
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let RealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
if (GlobalPrevApp != AppWindow && AppWindow != FocusWindow) then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
	If ! GlobalWasHjDialog then
		SayWindowTypeAndText (AppWindow)
	EndIf
ElIf AppWindow == FocusWindow then
	If ! GetWindowSubtypeCode (AppWindow) then
		FocusOnButton (FocusWindow)
	EndIf
endIf
If ((GlobalPrevRealName != RealWindowName) ; name has changed
|| (GlobalPrevReal != RealWindow)) then ; or handle has changed, then
	If (RealWindow == AppWindow) then
		Say (GetDialogStaticText (), OT_DIALOG_TEXT)
	ElIf ((RealWindow != AppWindow) && (RealWindow != FocusWindow)) then
		If ! GlobalWasHjDialog then
			;GlobalWasHjDialog prevents over chatter, especially when exiting a list box and returning to a client area.
			;Set to FALSE when one HjDialog follows another
			;Example:
			;AddBrailleColors function
			SayWindowTypeAndText (RealWindow)
		EndIf
	endIf
endIf
let GlobalFocusWindow = FocusWindow
SayFocusedWindow ()
;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
Let GlobalWasHjDialog = InHjDialog ()
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

int function BrailleAddObjectDlgText(int nSubtypeCode)
var
	string strText
Let strText = GetDialogStaticText ()
If strText then
	BrailleAddString (strText,0,0,0)
	Return TRUE
Else
	return false
EndIf
endFunction

; Copyright 2003-2015 by Freedom Scientific, Inc.
; JAWS Quicken Deluxe 2003-15 Script File version 1.2

include "hjHelp.jsh"
include "hjconst.jsh" ; JAWS default constants
include "hjglobal.jsh" ; JAWS default globals
include "common.jsm" ; default messages
include "Quicken.jsh" ; Quicken 2000 for Windows constants and globals
include "Quicken.jsm" ; Quicken 2000 for Windows messages

Use "window_navigator.jsb"  ; virtualize window functions, and stack.

Function AutoFinishEvent ()
Let QWInhibitYesNoPrompts = 0
EndFunction


Void Function FocusMonitor ()
var
	handle hNull,
	handle grip

if (GetFocus() == hNull) then
	if (QWLastKnownFocus) then
		Let grip = GetRealWindow (QWLastKnownFocus)
		if (grip) then

			SaveCursor()
			JAWSCursor()
			SaveCursor()
			MoveToWindow (grip)
			LeftMouseButton()
			Delay(1)
			LeftMouseButton()
			RestoreCursor()
			RestoreCursor()
		endif
	endif
endif
ScheduleFunction ("FocusMonitor", 10)
EndFunction


void function autoStartEvent()
InitializeStack ()
ScheduleFunction ("FocusMonitor", 10)
;  read user configured options from the JSI file
Let QWStaticPromptVerbosity = IniReadInteger ("Verbosity Options", "StaticPrompts", 1, "qw.jsi")
Let QWControlTypeVerbosity = IniReadInteger ("Verbosity Options", "ControlType", 1, "qw.jsi")
Let QWCheckedStatusVerbosity = IniReadInteger ("Verbosity Options", "CheckedStatus", 1, "qw.jsi")
Let QWRSpeakFieldLabels = IniReadInteger ("Verbosity Options", "SpeakFieldLabels", 1, "qw.jsi")
Let QWRRegistryName = "|"  ; cause a reload
; giSwitchedFromDLL is set to true when a dll is called which triggers a separate script file
; which switches back here.
if giSwitchedFromDLL then
	delay(2)
	Refresh ()
	let giSwitchedFromDLL=false
endIf
if giQWFirstTime==0 then
	;SayFormattedMessage (ot_app_start, msgAppStart1_L, msgAppStart1_S) ; "for screen sensitive help Press insert + f1",
	let giQWFirstTime=1
endIf
endFunction



Script AdjustJAWSVerbosity ()
var
	string OurList
; the format of this list is functionName:Message.
; the message appears in the verbosity list, and the function runs when they hit the space bar.
; then, the string returned by that function is appended to the message.
Let OurList = "|ToggleStaticPromptVerbosity:" + msgPromptVerbosity
Let OurList=OurList + "|ToggleControlTypeVerbosity:" + msgControlTypeVerbosity
Let OurList=OurList + "|ToggleCheckedStatusVerbosity:" +msgCheckedStatusVerbosity
Let OurList=OurList + "|ToggleRegistrySummarizeVerbosity:" + msgQWRSpeakFieldLabels
JAWSVerbosityCore (OurList)
EndScript


String Function ToggleCheckedStatusVerbosity (int iRetVal)
if (not iRetVal) then
	; update setting
	Let QWCheckedStatusVerbosity = QWCheckedStatusVerbosity+1
	if (QWCheckedStatusVerbosity > 1) then
		Let QWCheckedStatusVerbosity  = 0
	endif
	; save to the JSI file
	IniWriteInteger ("Verbosity Options", "CheckedStatus", QWCheckedStatusVerbosity, "qw.jsi")
endif
if (QWCheckedStatusVerbosity == 1) then
	Return (msgVerbosity1)
endif
return (msgVerbosity0)
EndFunction


String Function ToggleControlTypeVerbosity (int iRetVal)
if (not iRetVal) then
	; update setting
	Let QWControlTypeVerbosity = QWControlTypeVerbosity +1
	if (QWControlTypeVerbosity > 1) then
		Let QWControlTypeVerbosity  = 0
	endif
	; save to the JSI file
	IniWriteInteger ("Verbosity Options", "ControlType", QWControlTypeVerbosity, "qw.jsi")
endif
if (QWControlTypeVerbosity == 1) then
	Return (msgVerbosity1)
endif
return (msgVerbosity0)
EndFunction



String Function ToggleRegistrySummarizeVerbosity (int iRetVal)
if (iRetVal == 0) then
	; update it
	Let QWRSpeakFieldLabels = QWRSpeakFieldLabels+1
	if (QWRSpeakFieldLabels > 1) then
		Let QWRSpeakFieldLabels = 0
	endif
	; update the JSI file
	IniWriteInteger ("Verbosity Options", "SpeakFieldLabels", QWRSpeakFieldLabels, "QW.JSI")
endif
if (QWRSpeakFieldLabels == 1) then
	return (msgQWRSpeakFieldLabels_yes)
endif
return (msgQWRSpeakFieldLabels_no)
EndFunction

String Function ToggleStaticPromptVerbosity (int iRetVal)
if (not iRetVal) then
	; update setting
	Let QWStaticPromptVerbosity = QWStaticPromptVerbosity +1
	if (QWStaticPromptVerbosity > 1) then
		Let QWStaticPromptVerbosity  = 0
	endif
	; save to the JSI file
	IniWriteInteger ("Verbosity Options", "StaticPrompts", QWStaticPromptVerbosity, "qw.jsi")
endif
if (QWStaticPromptVerbosity == 1) then
	Return (msgVerbosity1)
endif
return (msgVerbosity0)
EndFunction



String Function DataSheetTitleGet (int announce)
var
	handle hFocus,
	handle h,
	handle hNull,
	int iRestriction,
	string s

Let hFocus = GetFocus()
if (IsEditInsideDataSheet (hFocus)) then
	Let h = GetParent (hFocus)
elif (isDataSheet ()) then
	Let h = hFocus
endif

if (h) then
	; we have the handle of a data sheet, the title is in the first line of the parent
	; announce only if requested by caller, or when we switch to this data sheet
	if (   (h != QWGlobalDataSheetHandle)
		|| (announce)) then
		; First time on this sheet
		; record this so we don't keep repeating this.
		Let QWGlobalDataSheetHandle = h
		Let h = GetParent (h)
		if (not IsWindowObscured (h)) then
			SaveCursor()
			InvisibleCursor()
			MoveToWindow (h)
			let iRestriction = GetRestriction ()
			SetRestriction (restrictWindow)
			JAWSPageUp()
			JAWSHome()
			Let s = GetLine()
			SetRestriction (iRestriction)
			RestoreCursor()
			return (s)
		endif ; not obscured
	endif
else ; not focused on a data sheet, or child of a datasheet
	Let QWGlobalDataSheetHandle = hNull
endif
return ("")
EndFunction

HANDLE Function IsEditInsideDataSheet (handle hFocus)
var
	handle h,
	handle hNull,
	string class

if (hFocus == hNull) then
	; no handle provided, so get the focus
	Let hFocus = GetFocus()
endif

Let class = GetWindowClass (hFocus)
if (   (class == "Edit")
		|| (class == "ComboBox")) then
	; see if we can find the window with the column titles
	Let h = GetParent (hFocus)
	if (GetWindowClass (h) == "ListBox") then
		Let h = GetParent (h)
		if (GetWindowClass (h) == "QWListViewer") then
			; this window contains the header titles
			return (h)
		endif
	endif
endif

;skurapati - start
if (class == "ListBox") then
	Let h = GetParent (hFocus)
	if (GetWindowClass (h) == "QWListViewer") then
		return(h)
	endif
endif

if (class == "QREdit") then
	Let h = GetParent (hFocus)
	if (GetWindowClass (h) == "QWClass_TransactionList") then
		return(h)
	endif
endif
;skurapati - end

return (hNull)
EndFunction

String Function EditDataSheetHeadersGet ()
var
	handle h,
	int iOldPixels,
	int TitleRow,
	int safety,
	string s
Let h = IsEditInsideDataSheet (GetFocus())
if (h) then
	SaveCursor()
	InvisibleCursor()
	; ensure pixels per space is set to a valid value
	let iOldPixels=getJCFOption(opt_pixels_per_space)
	setJCFOption(opt_pixels_per_space,8)
	MoveToWindow (h)
	Let TitleRow = GetCursorRow()  ; titles are always on this line
	Let safety = 0
	Let s = ""
	While (   (GetCursorRow() == TitleRow)
		&& (safety < 20))
		Let s = s + GetChunk() + ", "
		NextChunk ()
		Let safety = safety+1
	endWhile
	if (safety > 19) then
		SayString ("more than 20 titles")
	endif
	setJCFOption(opt_pixels_per_space, iOldPixels)
	RestoreCursor()
	return(s)
endif
return ("")
EndFunction



Int Function TitleBarBoundaryNext ()
var
	int safe,
	int x,
	int y,
	int r,
	int found,
	int color

; this is not presently used, because it is too slow.

Let x = GetCursorCol()
Let y = GetCursorRow()
Let safe = 0
Let found = 0
While (   (safe < 500)
	&& (found == 0))
	Let color = GetColorAtPoint (r, y)
	if (   (color != 10276814)
			&& (color != 9746118)) then
		Let r = r+1
	else
		Let found = 1
	endif
	Let safe = safe+1
EndWhile
if (found == 0) then
	; not found
	Let r = x
endif
return (r)
EndFunction



Int Function SummarizeDataSheetLine (handle h)
var
	handle hFocus,
	handle hField,
	handle hNull,
	int iOldPixels,
	int line,
	int x,
	int r,
	int col1,
	int col2,
	int PrevCol,
	int TitleRow,
	int safety,
	string class,
	string s,
	int t,
	int b
if (h == hNull) then
	; caller did not provide that handle
	Let h = IsEditInsideDataSheet (GetFocus())
endif
if (h) then
	Let hFocus = GetFocus()
	SaveCursor()
	InvisibleCursor()
	RouteInvisibleToPC()
	
	Let line = GetCursorRow()
	; ensure pixels per space is set to a valid value
	let iOldPixels=getJCFOption(opt_pixels_per_space)
	setJCFOption(opt_pixels_per_space,8)
	Let r = GetWindowRight (h)
	MoveToWindow (h)
	Let TitleRow = GetCursorRow()  ; titles are always on this line
; 	Let line = (GetWindowTop(hFocus) + GetWindowBottom(hFocus))/2
	Let safety = 0
	While (   (GetCursorRow() == TitleRow)
		&& (safety < 20))
;		SayChunk()
		Let s= GetChunk()
		SayUsingVoice (VCTX_MESSAGE, s, OT_STRING)
		; find the data field that corresponds to this title
		Let x = GetCursorCol()  ; title x
		MoveTo (x+10, line)
		Let s = GetChunk()
		if (StringLength (s) > 0) then
			Say (s, OT_STRING)
		; make sure we are correctly positioned at the chunk
			PriorChunk()
			NextChunk()
			Let PrevCol = GetCursorCol()
		else
			; didn't land on the chunk, need to find it
			PriorWord()
			Let col1 = GetCursorCol()
			NextWord()
			Let col2 = GetCursorCol()
			; decide which of these is closest
			if ((x-col1) < (col2-x)) then
				; col 1 was closer
				PriorWord()  ; back up
			endif
			; make sure we are positioned correctly on the chunk
			PriorChunk()
			NextChunk()
			if (   (GetCursorCol() <= r)
				&& (GetCursorCol() != PrevCol)) then
				; if we land in the same place we did last time, then there is no data.
			Let PrevCol = GetCursorCol()
				SayChunk()
			else
				Say ("blank", OT_STRING)
			endif
		endif  ; first chunk not blank
		MoveTo (x, TitleRow)
		NextChunk ()
		Let safety = safety+1
	endWhile
	if (safety > 19) then
		SayString ("more than 20 titles")
	endif
	setJCFOption(opt_pixels_per_space, iOldPixels)
	RestoreCursor()
	return(1)
endif
return (0)
EndFunction


Int Function SpeakDataSheetColumnTitle (handle FocusWindow)
var
	handle h,
	int iOldPixels,
	int x,
	string class
Let class = GetWindowClass (FocusWindow)
if (   (class == "Edit")
		|| (class == "ComboBox")) then
	let h = IsEditInsideDataSheet (GetFocus ())
	if (h) then
		if (giSuppressColumnTitles == false) then
			SaveCursor()
			InvisibleCursor()
			; ensure pixels per space is set to a valid value
			let iOldPixels=getJCFOption(opt_pixels_per_space)
			setJCFOption(opt_pixels_per_space,8)
			MoveToWindow (h)
			NextWord()
			Let x = GetWindowLeft (FocusWindow)
			MoveTo (x, GetCursorRow())
			NextWord()
			SayUsingVoice (VCTX_MESSAGE, GetChunk(), OT_STRING)
			setJCFOption(opt_pixels_per_space, iOldPixels)
			RestoreCursor()
		endif  ; not suppressing collumn titles
		return (1)
	endif ; an edit inside a data sheet
endif  ; correct class
return (0)
EndFunction


Int Function EditCurrentPaycheck  (handle hFocus, handle hPrevious)
var
	string RealName

Let RealName = GetWindowName (GetRealWindow (hFocus))
if (   (RealName == wn_EditCurrentPaycheck)
	|| (StringContains (RealName, wn_EditFuturePaychecks))) then
	If (GetWindowClass (hFocus) == "Edit") then
		let giFocusChangeTriggered = true
		SayUsingVoice (VCTX_MESSAGE, GetWindowName (hFocus), OT_STRING)
		SayWindow (hFocus, 1)
		return (1)
	endif
endif
return (0)
EndFunction


Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle hNull,
	handle hReal,
	string sRealName

if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
; save this in case we lose focus, we can recover here.
; one place this happens is in the budget setup screens when clicking apply.
Let hReal = GetRealWindow (FocusWindow)
Let sRealName = GetWindowName (hReal)
if (sRealName != QWGlobalRealWindowName) then
	Say (sRealName, 	OT_CONTROL_GROUP_NAME)
	Let QWGlobalRealWindowName = sRealName
endif
if (StringContains (sRealName, scBudget)) then
	; put focus back on the average amounts list box
	Let QWLastKnownFocus = FindDescendantWindow (hReal, 1)
else
	Let QWLastKnownFocus = hNull
endif

; Make the accounts list speak when user hits a key.
Let QWMonitorAccountList = 0  ; not speak
if (   (sRealName == wn_accountList)
	&& (GetWindowClass (FocusWindow) == "ListBox")) then
	; start monitoring for new text, so we can detect if the account changes when user hits a key.
	Let QWMonitorAccountList = 1
endif



if (QWTabKeyFID) then
	; in some cases, pressing the tab key does not cause a focus change, but should have.
	; this block is in case a focus change which was not expected due to a tab key, actually occurs.
	UnScheduleFunction (QWTabkeyFID)
	Let QWTabKeyFID = 0
	SpeechOn()
endif

Let giFocusChangeTriggered = true
if (EditCurrentPaycheck (FocusWindow, PrevWindow)) then
	return
endif
SayUsingVoice (VCTX_MESSAGE, DataSheetTitleGet (0), OT_STRING)
SpeakStaticPrompts (FocusWindow, PrevWindow, 0)
if (SpeakDataSheetColumnTitle (FocusWindow)) then
	return
endif
if (SayFocusedWindow ()) then
	return
endif
; invoke the default version
FocusChangedEvent (FocusWindow, PrevWindow)


EndFunction


Int Function APlaceWeGetStuck (handle h)
var
	string name,
	string RealName

Let RealName = GetWindowName (GetRealWindow (h))
Let name = GetWindowName (h)
if (RealName == wn_QuickenGuidedSetup) then
	if (   (name == wn_EndingBalance)
		|| (name == wn_FinancialInstitution)) then
		return (1)
	endif
elif (RealName == wn_QuickenHome) then
	if (   (Name == wn_Amount)
			|| (name == wn_Message)) then
		Return (1)
	endif
endif
return (0)
EndFunction


Function SchedTurnEchoBackOn ()
let giSuppressEcho=false
EndFunction


Function SchedFocusOnNextStep ()
var
	handle h,
	int n,
	int GoBack ; should we do a shift+tab when we get done

; Watch for places in the Quicken Guided setup where focus gets trapped.
if (isDataSheet ()) then
	Let h = GetFocus()
	Let GoBack = StringContains ( StringSegment (GetWindowText(h, 0), " ", 1), scSpending)
	if (APlaceWeGetStuck (h)) then
		; One of the places the tab key gets stuck

		; the quicken home alerts screen.
		if (   (GetWindowName (GetRealWindow (h)) == wn_QuickenHome)
				&& (GetWindowName (h) == wn_amount)) then
			; navigate back to the main list
			; the path is through our great grandfather.
			Let h = GetParent ( GetParent (GetParent (h)))
			Let h = GetPriorWindow (h)
			Let h = GetFirstChild (h)
			Let h = GetFirstChild (h)
			if (GetWindowName (h) == wn_Message) then
				SetFocus (h)
				return
			endif
		endif
		Let h = GetRealWindow (h)
		Let h = FindDescendantWindow (h, 32766)
		if (h) then
			SetFocus (h)
			; wait for focus to get there.
			Let n = 0
			while (   (GetFocus() != h)
				&& (n < 20))
				Delay(1)
				Let n = n+1
			EndWhile

			; the add accounts dialog has a data sheet for credit card accounts.
			; and a separate data sheet for other oaacounts.  It's the other accounts sheet
			; that traps the tab key, not the credit card sheet.  We need to shift+tab so we
			; don't skip the credit card accounts sheet.
			if (GoBack) then
				TypeKey ("shift+tab")  ; get back to the credit card data sheet
				Delay(2)
			endif
		endif
	endif
endif
SpeechOn()
EndFunction


Function SchedSayFocusedObject ()
SayFocusedObject()
EndFunction


; here is a pair of functions which work together
const
; returned as the case parameter of the ComputeDistance function
; where the description is relative to the control
	above = 1,
	below = 2,
	left = 3,
	right = 4



Int Function ComputeDistance (handle hDescription, handle hControl, int ByRef case)
var
	int dt, ; description top
	int db, ; description bottom
	int dl,
	int dr,
	int ct, ; control top
	int cb, ; control bottom
	int cl,
	int cr,
	int distance,
	string s


; get the coordinants of these two windows
GetWindowRect (hDescription, dl, dr, dt, db)
GetWindowRect (hControl, cl, cr, ct, cb)
Let distance = 1000 ; definitely not close enough
Let case = 0  ; invalid

; description to the right of the control
if (dl > cr) then
	Let case = right
	; the description can be straight to the right, or slightly above or below, but the
	; vertical edges must have common space between them.
	; remember row number increases as you go down, so > means lower than.
	if (   (dt <= ct)
			&& (db > ct)) then
		Let distance = dl - cr
	endif
endif

; description to the left of the control
if (dr < cl) then
	Let case = left
	; the description can be straight to the left, or slightly above or below, but the
	; vertical edges must have common space between them.
	; Remember row numbers increase as you go down.
	if (   (dt <= ct)
			&& (db > ct)) then
		Let distance = cl - dr
	endif
endif

; description above the control
if (db < ct) then
	Let case = above
	; The description right end must be to the right of the left side of the control.
	; and the description left end must be left of the right end of the control
	; in other words, their must be overlap, common area between the two horizontal edges.
	if (   (dl < cr)
		&& (dr > cl)) then
		Let distance = ct - db
	endif
endif

; description under the control
if (cb < dt) then
	Let case = below
	; The description right end must be to the right of the left side of the control.
	; and the description left end must be left of the right end of the control
	; in other words, their must be overlap, common area between the two horizontal edges.
	if (   (dl < cr)
		&& (dr > cl)) then
		Let distance = dt - cb
	endif
endif

; debug code
if (distance < 1000) then
Let s = "distance is " + IntToString (distance) + " case " + IntToString (case) + "\r\n"
Let s=s+"dl: " + IntToString (dl)
Let s=s+" dr: " + IntToString (dr)
Let s=s+" dt: " + IntToString (dt)
Let s=s+" db: " + IntToString (db) + "\r\n"
Let s=s+"cl: " + IntToString (cl)
Let s=s+" cr: " + IntToString (cr)
Let s=s+" ct: " + IntToString (ct)
Let s=s+" cb: " + IntToString (cb) + "\r\n"
Let s=s+GetWindowText (hDescription, 0)
CopyToClipboard (s)
endif


return (distance)
EndFunction

Int Function IsThisMyDescription (handle hDescription, handle hControl)
var
	handle hPrior,
	handle hNext,
	int case2,
	int Distance,  ; between nearest edges
	int d2,
	string s,
	string sRealName,
	int case, ; which case gets chosen below affects the criterion used
	int answer

; the caller qualifies the class of the description field
Let sRealName = GetWindowName (GetRealWindow (hControl))
if (sRealName == wn_EditCurrentTransaction) then
	return(0)
endif

Let distance = ComputeDistance (hDescription, hControl, case)

; check on the other neighbor to the description, to see if it is closer
Let d2 = 10000  ; in case there is no other neighbor
Let hPrior = GetPriorWindow (hDescription)
Let hNext = GetNextWindow (hDescription)
if (hPrior == hControl) then
	; check on the next window
	if (hNext) then
		if (IsAClassWeDescribe (hNext)) then
			Let d2 = ComputeDistance (hDescription, hNext, case2)
		endif
	endif
Elif (hNext == hControl) then
	; check on the prior window
	if (hPrior) then
		if (IsAClassWeDescribe (hPrior)) then
			Let d2 = ComputeDistance (hDescription, hPrior, case2)
		endif
	endif
endif
if (d2 < distance) then
	; no, the other control is closer to the description that ours is.
	return(0)
endif

; now apply nearness criterion, based on which case we found.
if (case == above) then
	if (distance < 34) then
		Let answer = 1
	endif
elif (case == below) then
	if (distance < 20) then
		Let answer = 1
	endif
elif (case == left) then
	if (distance < 34) then
		Let answer = 1
	endif
elif (case == right) then
	if (distance < 34) then
		Let answer = 1
	endif
endif



return (answer)
EndFunction





Void Function BudgetAnalyzeMonitor ()
if (QWWatchForNewText > 0) then
	Let QWWatchForNewText = 0
	if (IsJAWSCursor()) then
		MoveTo (QWSaveCursorCol, QWSaveCursorRow)
		Say (msgZero, OT_STRING)
	endif
endif
EndFunction

Void Function BudgetAnalyzeDetectBarGraphs (string sBuffer)
if (QWWatchForNewText > 0) then
	Say (sBuffer, OT_STRING)
	Let QWWatchForNewText = QWWatchForNewText-1
	if (QWWatchForNewText == 0) then
		; Spoke the last of it.
		if (IsJAWSCursor()) then
			MoveTo (QWSaveCursorCol, QWSaveCursorRow)
		endif
	endif ; spoke the last of it
endif  ; Watch for new text
EndFunction



void function sayNonhighlightedText(handle hWnd, string sBuffer)
var
	string sClass

; detect new text in the Budget Analyze window, decoding the bar graph.
BudgetAnalyzeDetectBarGraphs (sBuffer)

let sClass=getWindowClass(hWnd)
if giSuppressEcho then
	ScheduleFunction ("SchedTurnEchoBackOn", 2)
	return
endIf
if sClass==wc_static then
	if (isDescriptiveText(hWnd)) then
		say(sBuffer,ot_dialog_text)
		ScheduleFunction ("SchedSayFocusedObject", 2)
	endIf
elif sClass==wc_qwLabel && getScreenEcho() > echo_none then
; descriptive text in a dialog
	say(sBuffer,ot_dialog_text)
elif sClass==wc_report then
; a report window, automatically read it
	say(sBuffer,OT_NONHIGHLIGHTED_SCREEN_TEXT)
elif sClass==wc_QWHTMLView && getWindowClass(globalFocusWindow) ==wc_QWMDI then
	say(sBuffer,OT_NONHIGHLIGHTED_SCREEN_TEXT)
elif sClass==wc_QFrame then
	if dialogActive() then
		delay(1)
		refresh()
; cause the dialog to be refreshed and to speak correctly
; also suppress echo to avoid loop condition
		let giSuppressEcho=true
	endIf
endIf
sayNonhighlightedText(hWnd,sBuffer)
endFunction

Function sayHighlightedText (handle hWnd, string sBuffer)
var
	handle hNull
if getWindowClass(hwnd)==wc_QREdit then
	if not giSuppressHighlightInQREdit then
		let giSuppressHighlightInQREdit=true
		say(sBuffer,OT_HIGHLIGHTED_SCREEN_TEXT)
	endIf
	return
endIf
if isEditComboActive() then
; speaking of edit combo lists is done separately.
	return
endIf
if (EditCurrentPaycheck (GetFocus(), hNull)) then
	return
endif

sayHighlightedText(hWnd,sBuffer) ; call default

EndFunction


Int Function StringEqual (string title, string test)
var
	int l

let l = stringLength (test)  ; how many characters to compare
if (StringLength (title) < l) then
	return (0)  ; too short
endif

if (SubString (title, 1, l) == test) then
	return (1)
endif
return (0)
EndFunction


String Function MakeDelimitedList (string strIn, string delimiter, int BlanksAllowed)
var
	int i,
	int l,
	string c,
	string out

Let l = StringLength (strIn)
Let out = SubString (strIn, 1, 1)
Let i = 2
While (i <= l)
	Let c = SubString (strIn, i, 1)
	if (c != " ") then
		Let out = out + c
	else
		; found a blank
		; are there two or more blanks strIn a row?
		if (SubString (strIn, i+BlanksAllowed, 1) == " ") then
			; found a break, 2 spaces or more
			let out = out + delimiter
			; now find the next non-blank
			while ((i <= l) && (SubString (strIn, i, 1) == " "))
				Let i = i+1
			EndWhile
			Let i = i-1
		else ; no the next was not also a blank
			Let out = out + " "
		endif
	endif ; c was a blank
	Let i = i+1
EndWhile
return (out)
EndFunction





Int Function RealWindowIs (string name)
var
	string RealName

Let realName = GetWindowName (GetRealWindow (GetFocus ()))
return (StringEqual(RealName, name))
EndFunction

Int Function NormalAppCursor ()
if (   (IsPCCursor ())
		&& (InHJDialog () == 0)
		&& (MenusActive () == INACTIVE)) then
	return (1)
endif
return (0)
EndFunction

Void Function SummarizeWriteChecksStatus ()
var
	HANDLE parent,
	handle h,
	int i,
	int l,
	string s
if (isWriteChecksView ()) then
	; the Write Checks Dialog
	Let parent = GetParent (GetFocus())
	; total so far
	Let h = FindDescendantWindow (parent, cId_WCChecksSummaryList)
	if (h) then
		Let s = GetWindowText (h, READ_EVERYTHING)
		Let i = StringContains (s, scTotal)
		Let l = stringLength (s)
		if (   (i > 0)
			&& (l > (i+8))) then
			Let s = SubString (s, i+7, ((l-i)+8))
			Let s = msgWrittenSoFar + cscSpace + s
			Say (s, OT_NO_DISABLE)
		endif
	endif

	; ending balance
	Let h = FindDescendantWindow (parent, cId_WCEndingBalance)
	if (h) then
		Say (msgEndingBalance, OT_NO_DISABLE)
		SayWindow (h, 0)
	endif
	return (1)
endif
return (0)
EndFunction



Int Function HandleRadioButtons ()
var
	handle FocusWindow

Let QWSpeakRadioButtons = 0
Let FocusWindow = GetFocus()
if (GetWindowSubTypeCode (FocusWindow) == wt_RadioButton) then
 SayFocusedObject ()
	return (1)
endif  ; focusWindow was a radio button
return (0)
EndFunction


Void Function HandleSetupCheckboxes (handle FocusWindow, int SpeakFocusedControl)
var
	handle h,
	int found


; the caller verified this is the guided setup and a checkbox has focus.
if (SpeakFocusedControl) then
	SayFocusedObject()
	return
endif

if (QWStaticPromptVerbosity == 0) then
	return
endif

; scan forward looking for a static to speak
Let found = 0
let h = FocusWindow
while ( (h)  && (found == 0))
	if (GetWindowClass(h) == wc_static) then
		Let found = 1
	else
		Let h = GetNextWindow (h)
	endif
EndWhile
if (found) then
	SayWindow (h, 0)
endif
return
EndFunction



Int Function IsAClassWeDescribe (handle FocusWindow)
var
	string FocusClass
Let FocusClass = GetWindowClass (FocusWindow)
if (   (FocusClass == "QC_button")
	|| (FocusClass == "Edit")
	|| (GetWindowSubtypeCode (FocusWindow) == wt_RadioButton)) then
	return (1)
endif
return (0)
EndFunction

Int Function SpeakStaticPrompts (handle FocusWindow, handle PrevFocus, int SpeakFocusedControl)
var
	handle h,
	int found,
	int FocusID,
	string name,
	string class,
	string FocusClass,
	int TypeCode,
	int FocusTypeCode,
	string s,
	string RealName

Let FocusClass = GetWindowClass (FocusWindow)
Let FocusTypeCode = GetWindowSubTypeCode (FocusWindow)
Let name = GetWindowName (FocusWindow)
Let RealName = GetWindowName (GetRealWindow (FocusWindow))
if  (RealName == wn_QuickenGuidedSetup) then
	if (FocusTypeCode == WT_CHECKBOX) THEN
		HandleSetupCheckboxes (FocusWindow, SpeakFocusedControl)
		return (1)
	endif
	; handle the add account buttons
	Let FocusID = GetControlID (FocusWindow)
	if (  (FocusID == 2101)
		|| (focusID == 2201)
		|| (focusID == 2301)
		|| (focusID == 2401)) then
		; this is an ad account button
		SayWindow (GetPriorWindow (FocusWindow), 0)
		if (QWStaticPromptVerbosity > 0) then
			SayWindow (GetNextWindow (FocusWindow), 0)
		endif
	endif  ; add account buttons
endif

if (QWStaticPromptVerbosity == 0) then
	return (0)
endif

if (IsAClassWeDescribe (FocusWindow)) then
	; An edit, a button or a radio button
		; the prompt is a static class on the peer level
		; buzz backward looking for static, or anything else we deem descriptive
		; with nothing in between but FocusClass
		Let found = 0
		Let h = FocusWindow
		While ((h) && (Found == 0))
			Let class = GetWindowClass (h)
			Let TypeCode = GetWindowSubTypeCode (h)
			if (   (class == wc_static)
				|| (class == "QWLabel")) then
				Let found = 1
			elif (   (Class == "Button")
				&& (TypeCode == 21)) then
				Let found = 1
			elif (   (   (class != FocusClass)
					|| (GetWindowSubTypeCode (h) != FocusTypecode)
				)  ; either class or subtype is different from the focus
				&& (class != "QWHtmlView")) then
				Let found = 2 ; unexpected class
			Endif
			if (found == 0) then
				Let h = GetPriorWindow (h)
			endif
		EndWhile
		if (found == 1) then
			; got the handle of something descriptive
			if (IsThisMyDescription (h, FocusWindow) ) then
				if (TypeCode == 21) then
					Let s = GetWindowName (h)
				else
					Let s = GetWindowText (h, 0)
				endif
			endif  ; my description
		endif  ; found == 1
		; now buzz the other direction looking for the same thing, and add it to the collection.
		Let found = 0
		Let h = FocusWindow
		While ((h) && (Found == 0))
			Let class = GetWindowClass (h)
			Let TypeCode = GetWindowSubTypeCode (h)
			if (   (class == wc_static)
				|| (class == "QWLabel")) then
				Let found = 1
			elif (   (Class == "Button")
				&& (TypeCode == 21)) then
				Let found = 1
			elif (   (   (class != FocusClass)
					|| (GetWindowSubTypeCode (h) != FocusTypecode)
				)  ; either class or subtype is different from the focus
				&& (class != "QWHtmlView")) then
				Let found = 2 ; unexpected class
			Endif
			if (found == 0) then
				Let h = GetNextWindow (h)
			endif
		EndWhile
		if (found == 1) then
			; got the handle of something descriptive
			if (IsThisMyDescription (h, FocusWindow) ) then
				if (TypeCode == 21) then
					Let s = s + GetWindowName (h)
				else
					Let s = s + GetWindowText (h, 0)
				endif
			endif  ; my description
		endif ; description found
		; make sure we dont' repeat stuff
		if (   (s != QWLastStaticText) ; text has changed
		   || (FocusClass != GetWindowClass (PrevFocus))
				|| (FocusTypeCode != GetWindowSubTypeCode (PrevFocus))) then
			Say (s, OT_NO_DISABLE)
			Let QWLastStaticText = s
		endif  ; static text is different
		if (SpeakFocusedControl) then
			if	(FocusClass == "Edit") then
				SayWindow (FocusWindow, 0)
			else
				SayFocusedObject()
			endif
		endif
		return (1)
endif ; focused on an edit, a  button or radio button

return (0)
EndFunction

Script SayBottomLineOfWindow ()
var
	int saveMonth

if (SummarizeWriteChecksStatus ()) then
	return
elif (IsMonthlyBudgetSummary ()) then
	Let saveMonth = QWMonth
	Let QWMonth = 13
	MonthlyBudgetSummary (0)
	Let QWMonth = saveMonth
	return
else
	PerformScript SayBottomLineOfWindow()
endif
EndScript


Int Function isDescriptiveText (handle hWndStatic)
var
	string sRealName,
	int iControlId,
	int iWindowType,
	string sClass
let sClass=getWindowClass(hWndStatic)
let sRealName=getWindowName(getRealWindow(hWndStatic))
let iControlId=getControlId(hWndStatic)
if stringContains(sRealName,wn_reconcile) then
	return false
endIf
if iControlId==cId_descriptiveStatic then
	return true
endIf
if stringContains(sRealName,wn_newUserSetup) then
; all static in this dialog is descriptive if
;1. the next control is not a button or radio button
;2. the next control is not an edit
	let iWindowType=getWindowTypeCode(getNextWindow(hwndStatic))
	if iWindowtype==wt_radioButton || iWindowType==wt_button || iWindowtype==wt_edit then
		return false
	else
		return true
	endIf
elif stringContains(sRealName,wn_quicken2000ForWindows) || stringContains(sRealName,wn_quicken2001ForWindows) then
; all static in this dialog is descriptive
	return true
elif sRealName==wn_creatingNewFile then
; all static in this dialog is descriptive
	return true
elif sRealName==wn_createNewAccount then
; all static in this dialog is descriptive
	return true
elif sRealName==wn_newCategory then
; all static in this dialog is descriptive
	return true
elif sRealName==wn_loanSetup then
; all static in this dialog is descriptive
	return true
endIf
return false
EndFunction

int Function isDataSheet ()
var
handle hFocus
let hFocus=getFocus()
return (getWindowClass(hFocus)==wc_ListBox && getWindowClass(getParent(hFocus))==wc_QWListViewer)
EndFunction

handle Function getPriorStaticTextHandle ()
var
handle hCurrent,
handle hNull


let hCurrent=getCurrentWindow()
while hCurrent
	if getWindowTypeCode(hCurrent)==wt_static && IsWindowVisible (hCurrent) then
		return hCurrent
	endIf
	let hCurrent=getPriorWindow(hCurrent)
endWhile
return hNull
EndFunction

handle Function ieServerWindowGet (handle hWnd)
var
handle hCurrent
let hCurrent=hWnd
while hCurrent
	if getWindowClass(hCurrent)==wc_ie5Class then
		return hCurrent
	endIf
	let hCurrent=getFirstChild(hCurrent)
endWhile
; wasn't found, just return the original window handle
return hWnd
EndFunction

Void Function plannerWindowRead ()
var
handle hReal,
handle hCurrent,
int iFinished,
int iIsFirstScreen,
int iOldPixels

let iOldPixels=getJCFOption(opt_pixels_per_space)
setJCFOption(opt_pixels_per_space,8) ; set to something valid so chunsc are correctly obtained
let iFinished=false
let hReal=getRealWindow(getFocus())
let iIsFirstScreen=stringContains(getWindowText(hReal,read_everything),scWelcome)
saveCursor()
invisibleCursor()
moveToWindow(hReal)
while not (iFinished || isKeyWaiting())
	if getWindowClass(getCurrentWindow())==wc_QWHTMLView && not (getCharacterAttributes() & attrib_underline) || not iIsFirstScreen then
		sayChunk()
	endIf
	nextChunk()
	if getCursorRow() >=getWindowBottom(hReal) then
		let iFinished=true
	endIf
endWhile
; now read linnks
sayUsingVoice(vctx_message,QWMSGPlannerLinks1_L,ot_smart_help)
let iFinished=false
moveToWindow(hReal)
while not (iFinished || isKeyWaiting())
	if getWindowClass(getCurrentWindow())==wc_QWHTMLView && (getCharacterAttributes() & attrib_underline) then
		sayUsingVoice(vctx_message,getChunk(),ot_smart_help)
	endIf
	nextChunk()
	if getCursorRow() >=getWindowBottom(hReal) then
		let iFinished=true
	endIf
endWhile
restoreCursor()
setJCFOption(opt_pixels_per_space,iOldPixels)
EndFunction

string Function datasheetPromptGet ()
var
string sPrompt,
	string sName,
	string srealName,
handle hParent,
handle hFocus,
int iVertDistancePrior,
int iVertDistanceNext
; read the listbox's prompt (static text)
; need to determine which static text contains the listbox prompt
; can be the prior or next window to the parent of the focus
; we'll determine this using the distance from the bottom of the static to the top of the listbox
let hFocus=getFocus()
let hParent=getParent(hFocus)

if isDataSheet() then
	if (GetWindowName (GetRealWindow (hFocus)) == wn_QuickenGuidedSetup) then
		if (GetWindowName (hFocus) ==  wn_EndingBalance) then
			Return (wn_AccountList)
		endif
	endif
	; if in the reconcile listboxes then the prompt is part of the QWListViewer window above the listboxes
	if stringContains(getWindowName(getRealWindow(hFocus)),wn_reconcile) then
		saveCursor()
		invisibleCursor()
		if	moveToWindow(hParent) then
			let sPrompt=getTextBetween(getWindowLeft(hParent),getWindowRight(hParent))
		endIf
		restoreCursor()
		return sPrompt
	endIf

	Let sName = GetWindowName (hFocus)
	Let sRealName = GetWindowName (GetRealWindow (hFocus))
	if (StringLength (sName) > 1) then
		if (sRealName != wn_accountList) then
			Say (sName, OT_STRING)
			return
		endif
	endif

; otherwise it is the static text of the prior or next window to the focus's parent window
	if getWindowClass(getPriorWindow(hParent))==wc_static then
		let iVertDistancePrior=getWindowTop(hFocus)-getWindowBottom(getPriorWindow(hParent))
		if iVertDistancePrior < 0 then
			let iVertDistancePrior=iVertDistancePrior*(-1)
		endIf
	else
		let iVertDistancePrior=-1
	endIf
	if getWindowClass(getNextWindow(hParent))==wc_static then
		let iVertDistanceNext=getWindowTop(hFocus)-getWindowBottom(getNextWindow(hParent))
		if iVertDistanceNext < 0 then
			let iVertDistanceNext=iVertDistanceNext*(-1)
		endIf
	else
		let iVertDistanceNext=-1
	endIf
	if (iVertDistancePrior < iVertDistanceNext && iVertDistancePrior >=0) || (iVertDistanceNext < 0 && iVertDistancePrior >=0) then
; use prior static
		return getWindowText(getPriorWindow(hParent),read_everything)
	elif iVertDistanceNext >=0 then
; use next static
		return getWindowText(getNextWindow(hParent),read_everything)
	endIf
endIf
EndFunction

Void Function DataSheetPromptSay ()
if isDataSheet() then
	Say (DataSheetPromptGet(), OT_CONTROL_NAME)
endIf
EndFunction

int Function isFocusVisible ()
var
int iLeft,
int iRight,
int iTop,
int iBottom,
int iScreenHeight,
int iScreenWidth,
handle hFocus,
	int safety

; note, the following code may not perform properly on Quicken 2003.
; until proper operation can be determined, a safety counter is included to prevent an infinite loop
let hFocus=getFocus()
let iScreenHeight=screenGetHeight()
let iScreenWidth=screenGetWidth()
let iTop=getWindowTop(hFocus)
let iBottom=getWindowBottom(hFocus)
let iLeft=getWindowLeft(hFocus)
let iRight=getWindowRight(hFocus)
Let safety = 20
while not (iBottom >=iTop && iRight >=iLeft && iBottom <=iScreenHeight && iRight <=iScreenWidth && iTop >=1 && iLeft >=1)
; attempt to bring it into view
	if iTop  < 1 then
		TypeKey (ks3)
		pause()
	elif iBottom > iScreenHeight then
		TypeKey (ks4)
		pause()
	endIf
	let iTop=getWindowTop(hFocus)
	let iBottom=getWindowBottom(hFocus)
	let iLeft=getWindowLeft(hFocus)
	let iRight=getWindowRight(hFocus)
	Let safety = safety-1
	if (safety < 1) then
		; this does not appear to be working, bale out.
		return (0)
endif
endWhile
return iBottom >=iTop && iRight >=iLeft && iBottom <=iScreenHeight && iRight <=iScreenWidth && iTop >=1 && iLeft >=1
EndFunction

void Function dataSheetFocusSay ()
var
handle hFocus
dataSheetPromptSay()
let hFocus=getFocus()
SayFormattedMessage(ot_control_type,QWMsgDataSheet1_L, QWMsgDataSheet1_S)
if getWindowTop(hFocus)==getWindowBottom(hFocus) then
	SayFormattedMessage(ot_no_disable,QWMsgDataSheetEmpty1_L, QWMsgDataSheetEmpty1_S)
else
	sayLine()
endIf
EndFunction

int function isQHIActive()
return GetAppFileName ()==app_qhi
endFunction

int Function isQHIDetailView ()
return getWindowName(getFirstWindow(getFocus()))==btn_returnToListView
EndFunction

void function qhiFocusSay()
var
handle hFocus,
handle hPrompt,
handle hReal,
string sRealName,
int iControl,
int iWinType,
int iWinRight
let hFocus=getFocus()
let iControl=getControlId(hFocus)
let iWinType=getWindowTypeCode(hFocus)
let hReal=getRealWindow(hFocus)
let sRealName=getWindowName(hReal)

if sRealName==wn_welcomeToQHI then
; This dialog has text which is displayed as a graphic and hence can't be read with the JAWS or Invisible cursors
; The dialog text is hardcoded here:
	SayFormattedMessage(ot_dialog_text,QWMsgHomeInventory1)
elif iControl==cId_suggestedItemsList then
; the prompts for this listbox are the two prior static text windows
	say(getWindowName(getPriorWindow(getPriorWindow(hFocus))),ot_control_name)
	say(getWindowName(getPriorWindow(hFocus)),ot_control_name)
	say(getObjectType(),ot_control_type)
	sayLine() ; speak item count
elif (iWinType==wt_edit || iWinType==wt_comboBox) && getWindowTypeCode(getParent(hFocus))==wt_listbox then
; list view must be active
; find the appropriate prompt
	if iControl==cId_itemDesc then
			say(QWMsgHomeInventory2,ot_control_name)
		say(getObjectType(),ot_control_type)
		say(getObjectValue(),ot_no_disable)
	elif iControl==cId_itemCategory then
		say(QWMsgHomeInventory3,ot_control_name)
		say(getObjectType(),ot_control_type)
		say(getObjectValue(),ot_no_disable)
	else
		sayObjecttypeAndText()
	endIf
elif isQHIDetailView() then
	if iWinType==wt_edit then
		let hPrompt=getPriorWindow(getPriorWindow(getPriorWindow(getPriorWindow(hFocus))))
		if getWindowTypeCode(getNextWindow(hFocus))==wt_button && getWindowTypeCode(getPriorWindow(hFocus))==wt_static then
			say(getWindowName(getPriorWindow(hFocus)),ot_control_name)
		elif getWindowTypeCode(hPrompt)==wt_static && isWindowvisible(hPrompt) then
; attempt to find correct prompt
; there are two groups of four edits in a row with four statics preceeding these edits
; each static corresponds to an edit
			say(getWindowName(hPrompt),ot_control_name)
		endIf
		say(getObjectType(),ot_control_type)
		say(getObjectValue(),ot_no_disable)
	elif iWinType==wt_combobox then
		say(getWindowName(getPriorWindow(hFocus)),ot_control_name)
		say(getObjectType(),ot_control_type)
		say(getObjectValue(),ot_no_disable)
	else
		sayObjectTypeAndText()
	endIf
else
	sayObjecttypeAndText()
endIf
endFunction

handle Function listButtonHandleGet ()
var
handle list,
handle null

let list=getFirstWindow(getForegroundWindow())
while list
	if getWindowClass(list)==wc_1 && isWindowVisible(list) then
		let list=getFirstChild(list)
		if getWindowClass(list)==wc_editComboList && isWindowVisible(list) && not isWindowObscured(list) &&
	getWindowTypeCode(getNextWindow(list))==wt_button && isWindowVisible(getNextWindow(list)) then
			return getNextWindow(list)
		endIf
	endIf
	let list=getNextWindow(list)
endWhile
return null
EndFunction

string Function listButtonNamesGet ()
var
handle hStart,
string sNames
let hStart=listButtonHandleGet()
let sNames=getWindowName(hStart)
while hStart && getWindowTypeCode(hStart)==wt_button
	let hStart=getNextWindow(hStart)
	if hStart && isWindowVisible(hStart) && not isWindowDisabled(hStart) && getWindowTypeCode(hStart)==wt_button then
		let sNames=sNames+scComma+cscSpace+getWindowName(hStart)
	endIf
endWhile
return sNames
EndFunction


int Function listButtonCountGet ()
var
handle hStart,
int iCount
let hStart=listButtonHandleGet()
let iCount=0
while hStart && getWindowTypeCode(hStart)==wt_button
	if hStart && isWindowVisible(hStart) && not isWindowDisabled(hStart) && getWindowTypeCode(hStart)==wt_button then
		let iCount=iCount+1
	endIf
	let hStart=getNextWindow(hStart)
endWhile
return iCount
EndFunction

Int Function sayFocusedWindow ()
var
	int iControlId,
	handle hFocus,
	int iWindowType,
	string sClass,
	int RetStatus,
	string sRealName

;skurapati - start - want to handle account register screen separately

if (IsItAccountRegisterScreen())
    return(1)
endif

;skurapati - end

Let RetStatus = 0  ; set to 1 if we speak anything
let giFocusChangeTriggered=true ; used to notify that focus change has occured
if (IsMonthlyBudgetSummary ()) then
	Say (wn_MonthlyBudgetSummary, OT_NO_DISABLE)
	MonthlyBudgetSummary (0)
	return (1)
endif

let hFocus=getFocus()
let sClass=getWindowClass(hFocus)
let  iControlId=getControlId(hFocus)
let iWindowType=getWindowTypeCode(hFocus)
let sRealName=getWindowName(getRealWindow(hFocus))
if menusActive() && isPcCursor() then
	sayLine()
	return(1)
elif stringContains(sRealName,wn_accountSetup) then
	if iControlId==cId_yesRadioButton || iControlId==cId_noRadioButton then
		if shouldItemSpeak(ot_control_name) then
			sayWindow(getPriorStaticTextHandle(),read_everything)
			Let RetStatus = 1
		endIf
		let gsAlternativeBrailleRepresentation=getWindowText(getPriorStaticTextHandle(),read_everything)
	else
		let gsAlternativeBrailleRepresentation=cscNull
	endIf
	sayObjectTypeAndText()
	Let RetStatus = 1
	return(RetStatus) ; note if we don't return the Braille prompt won't be displayed
elif stringContains(sRealName,wn_newUserSetup) then
	if iWindowType==wt_radioButton then
; attempt to locate prompt
		if shouldItemSpeak(ot_control_name) then
			sayWindow(getPriorStaticTextHandle(),read_everything)
			Let RetStatus = 1
		endIf
		let gsAlternativeBrailleRepresentation=getWindowText(getPriorStaticTextHandle(),read_everything)
		if iControlId==cId_businessRadioButton1 || iControlId==cId_businessRadioButton2 then
; read the rest of the prompt
			if shouldItemSpeak(ot_control_name) then
				sayWindow(getNextWindow(hFocus),read_everything)
				Let RetStatus = 1
			endIf
			let gsAlternativeBrailleRepresentation=gsAlternativeBrailleRepresentation+cscSpace+getWindowText(getNextWindow(hFocus),read_everything)
		endIf
	else
		let gsAlternativeBrailleRepresentation=cscNull
	endIf
	sayObjectTypeAndText()
	Let RetStatus = 1
	return (RetStatus) ; note if we don't return the Braille prompt won't be displayed
elif isQHIActive() then
	qhiFocusSay()
	return(1)
elif isWriteChecksView() then
	WriteChecksFocusSay()
; only need to say line if in edit or edit combo as WriteChecksFocusSay handles buttons
	if sClass==wc_edit then
		sayLine()
	endIf
	return(1)
elif isSplitTransactionWindow() then
	splitTransactionWindowFocusSay()
	return(1)
; we test for Transaction Register screens last of the screen detections as its detection is very general
elif (isTransactionRegisterScreen()) then
	TransactionRegisterFieldLabel (1, 0, 0, 0)
	if (QWControlTypeVerbosity) then
		if giNotEditCombo then
			say(cVMsgEdit1_L,ot_control_type)
	 	else
			say(getWindowType(getFocus()),ot_control_type)
		endIf
	endif  ; control type should be spoken
	sayLine()
/*
	if doesListContainButton() then
		if listButtonCountGet() > 1 then
			SayFormattedMessage(ot_smart_help, formatString(QWMsgListHasMultipleButtons1_L, listButtonNamesGet()), formatString(QWMsgListHasMultipleButtons1_S, listButtonNamesGet()))
		else
			SayFormattedMessage(ot_smart_help, formatString(QWMsgListHasButton1_L, getWindowName(listButtonHandleGet())), formatString(QWMsgListHasButton1_S, getWindowName(listButtonHandleGet())))
		endIf
	endIf
*/
	return(1)
elif isInvestmentRegisterScreen() && sClass==wc_QREdit then
	investmentRegisterFieldName (1)
	if giNotEditCombo then
		say(cVMsgEdit1_L,ot_control_type)
 	else
		say(getWindowType(getFocus()),ot_control_type)
	endIf
	sayLine()
	if doesListContainButton() then
		if listButtonCountGet() > 1 then
			SayFormattedMessage(ot_smart_help, formatString(QWMsgListHasMultipleButtons1_L, listButtonNamesGet()), formatString(QWMsgListHasMultipleButtons1_S, listButtonNamesGet()))
		else
			SayFormattedMessage(ot_smart_help, formatString(QWMsgListHasButton1_L, getWindowName(listButtonHandleGet())), formatString(QWMsgListHasButton1_S, getWindowName(listButtonHandleGet())))
		endIf
	endIf
	return(1)
elif isAssetLiabilityRegisterScreen() && sClass==wc_QREdit then
	assetLiabilityRegisterFieldName (1)
	if giNotEditCombo then
		say(cVMsgEdit1_L,ot_control_type)
 	else
		say(getWindowType(getFocus()),ot_control_type)
	endIf
	sayLine()
	if doesListContainButton() then
		if listButtonCountGet() > 1 then
			SayFormattedMessage(ot_smart_help, formatString(QWMsgListHasMultipleButtons1_L, listButtonNamesGet()), formatString(QWMsgListHasMultipleButtons1_S, listButtonNamesGet()))
		else
			SayFormattedMessage(ot_smart_help, formatString(QWMsgListHasButton1_L, getWindowName(listButtonHandleGet())), formatString(QWMsgListHasButton1_S, getWindowName(listButtonHandleGet())))
		endIf
	endIf
	return(1)
elif stringContains(sRealName,wn_reconcile) then
	if dialogActive() then
		if (iControlId==cId_recOpenBal && getControlId(globalPrevFocus)==cId_recHelpBtn) || (iControlId==cId_recServiceEdit && hFocus !=globalPrevFocus) then
; say the static above this group of controls
			sayWindow(getPriorWindow(getPriorWindow(getPriorWindow(hFocus))),read_everything)
			sayWindow(getPriorWindow(getPriorWindow(hFocus)),read_everything)
			Let RetStatus = 1
		endIf
	endIf
	if isDataSheet() then
; in this case, DataSheetHeadersSay speaks the prompts for these listboxes.
; while JAWS considers this control a listbox it doesn't look like one.
; we will call it a data sheet
		DataSheetPromptSay()
		if getWindowSubtypeCode(hFocus)==wt_multiselect_ListBox then
			SayFormattedMessage(ot_control_type, QWMsgMultiselectDataSheet1_L, QWMsgMultiselectDataSheet1_S)
		else
			SayFormattedMessage(ot_control_type, QWMsgDataSheet1_L, QWMsgDataSheet1_S)
		endIf
		sayLine()
		return(1)
	endIf
Elif (StringContains (sRealName, scStatementSummary)) then
	; this is the new reconcile
	if (   (GetWindowName (hFocus) == wn_Amount)
		&& (sClass == "ListBox")) then
		Let iControlID = GetControlID (GetParent (hFocus))
		if (iControlID == 100) then
			Say (msgPaymentsAndChecks, OT_STRING)
		elif (iControlID == 101) then
			Say (msgDeposits, OT_STRING)
		endif
	endif
elif sClass==wc_QWMDI && stringContains(sRealName,WN_OnlineSetup) then
; attempt to place focus on the ie5class
	setFocus(ieServerWindowGet(hFocus))
elif sClass==wc_shellDocObjectView || sClass==wc_shellEmbedding then
; attempt to place focus on the ie5class
	setFocus(ieServerWindowGet(hFocus))
elif sClass==wc_ie5class then
	sayLine()
	Let RetStatus = 1
elif sClass==wc_report then
	sayWindow(hFocus,read_everything)
	Let RetStatus = 1
elif isJAWSCursor() && getWindowClass(getCurrentWindow())==wc_QWHTMLView then
	sayCurrentLink()
	Let RetStatus = 1
elif stringContains(sRealName,wn_planning) then
	plannerWindowRead()
	return(1)
; final test is a general test for datasheets which appear in screens like My Finances
elif isDataSheet() then
	if not isFocusVisible() then
		SayFormattedMessage(ot_smart_help,QWMsgWarningScrollScreen1_L)
	endIf
	DataSheetFocusSay()
	return(1)
endIf
; if we get here then there is no alternative Braille representation so we should ensure that the string is cleared
let gsAlternativeBrailleRepresentation=cscNull
if (SpeakDataSheetColumnTitle (hFocus)) then
	SayWindow (hFocus, 0)
	return(1)
endif
sayObjectTypeAndText()
if (sClass == "Edit") then
	SayWindow (hFocus, 0)
endif

Return (1)
EndFunction


Script sayPriorLine ()
var
	int iPriorTrans,
	int iCurrentTrans,
	handle h,
	string RealName


; suspend monitoring of the accounts list if it is active.
; keeps the account from being spoken twice when arrowing up and down
if (QWMonitorAccountList == 2) then
	; speech was requested, but we are taking care of it here
	Let QWMonitorAccountList = 1
endif

let giSuppressHighlightInQREdit=true
Let h = GetFocus()
Let RealName = GetWindowName (GetRealWindow (h))

if (   (NormalAppCursor () == 0)
	|| (IsVirtualPCCursor ())) then
	performScript sayPriorLine() ; default
	return
endif

if (MonthlyBudgetSummary (3)) then
	return
endif

if (IsEditInsideDataSheet (h)) then
	let giSuppressColumnTitles=true
	PriorLine()
	return
endif

if (   (isEditComboActive())
	|| (RealName == wn_CreateScheduledTransaction)) then
	let giSuppressEcho=true
	priorLine()
	sayLine()
	return
elif isSplitTransactionWindow() && isPcCursor() then
	let giSuppressEcho=true
	let giSuppressColumnTitles=true
	let giSuppressRowNumbers=false
	priorLine()
	delay(1)
	splitTransactionWindowFocusSay()
	return
elif isInvestmentRegisterScreen() && isPcCursor() then
	let giSuppressEcho=true
;	let iPriorTrans=transactionCountFromTopGet()
	priorLine()
	delay(1)
;	let iCurrentTrans=transactionCountFromTopGet()
;	if getWindowClass(getCurrentWindow())==wc_qrEdit
;  && iPriorTrans!=iCurrentTrans then
;		sayUsingVoice(vctx_message,formatString(QWMsgTransaction1_L, intToString(transactionCountFromTopGet())),ot_JAWS_message)
;	endIf
	SayWindow (GetFocus(), 0)
	return
elif isTransactionRegisterScreen() && isPcCursor() then
	let giSuppressEcho=true
	let iPriorTrans=transactionCountFromTopGet()
	priorLine()
	delay(1)
	let iCurrentTrans=transactionCountFromTopGet()
	if getWindowClass(getCurrentWindow())==wc_qrEdit then
;	&& iPriorTrans!=iCurrentTrans then
;		sayUsingVoice(vctx_message,formatString(QWMsgTransaction1_L, intToString(iCurrentTrans)),ot_JAWS_message)
		SayWindow (GetFocus(), 0)
	endIf
	return
elif isAssetLiabilityRegisterScreen() && isPcCursor() then
	let giSuppressEcho=true
	let iPriorTrans=transactionCountFromTopGet()
	priorLine()
	delay(1)
	let iCurrentTrans=transactionCountFromTopGet()
	if getWindowClass(getCurrentWindow())==wc_qrEdit && iPriorTrans!=iCurrentTrans then
		sayUsingVoice(vctx_message,formatString(QWMsgTransaction1_L, intToString(transactionCountFromTopGet())),ot_JAWS_message)
	endIf
	return
elif isDataSheet() && isPcCursor() then
	PRIORLine()
	sayLine()
elif isQHIActive() && isPcCursor() && getCurrentControlId()!=cId_suggestedItemsList && not dialogActive() then
	priorLine()
	QHIFocusSay()
else
	performScript sayPriorLine()
endIf
EndScript


Int Function ListButtonsHelper (int level)
var
	handle hNext,
	handle hChild,
	handle h,
	handle hFocus,
	int iRestrictionMode,
	string name,
	string class,
	string sNames,
	string sHandles,
	string XCoordinants,
	string yCoordinants,
	int x,
	int y,
	int i

Let sNames = "|"
Let sHandles = "|"
Let XCoordinants = "|"
Let YCoordinants = "|"
Let h = GetFocus()
Let hFocus = h

; look for tools identified by color inside a data sheet
Let i = 99  ; just use as a temporary flag
if (isDataSheet () == 0) then
	; this isn't a data sheet, but are we a child of a data sheet?
	let h = GetParent(h)
	if (   (getWindowClass (h) != wc_ListBox)
		|| (getWindowClass(getParent(h)) != wc_QWListViewer)) then
		Let i = 0  ; not in a data sheet
	endif  ; parent isn't a data sheet either
endif
if (i == 99) then
	; we are a data sheet, or a child of a data sheet
	; if a child of a data sheet, then we must position the cursor just to the right of the edit with focus.
	; This way, we catch the tool buttons relevant to the field with focus.
	SaveCursor()
	InvisibleCursor()
	if (getWindowClass (hFocus) != wc_ListBox) then
		; then we are a child of a data sheet.
		MoveToWindow (hFocus)
		Let x = GetWindowRight (hFocus)+8
		; now, scan right until we know we are back in the ListBox.
		; needed, because JAWS cursor restriction traps the cursor in child windows.
		Let y = GetCursorRow()
		Let i = 0
		while (   (GetWindowAtPoint (x, y) != h)
			&& (i < 100))  ; just for safety
			Let x = x+8
			Let i = i+1
		EndWhile
		MoveTo (x, y)  ; now we should be in the ListBox
	else  ; a list with no children
		MoveToWindow (h)  ; to the ListView part of the data sheet
	endif
	; loop until the cursor stops moving
	NextCharacter ()  ; needed to get restriction to apply to window containing cursor
	SetRestriction (RestrictWindow)
	Let x = 0
	Let y = 0
	while (   (x != GetCursorCol())
		|| (y != GetCursorRow()))
		Let x = GetCursorCol()
		Let y = GetCursorRow()
		if (   (GetColorAtPoint (x, y) == 0)
			&& (GetColorAtPoint (x-2, y) == 15199215)) then
			; this is a control identified by it's color.
			Let sNames = sNames + GetWord() + "|"
			Let XCoordinants = XCoordinants + IntToString (GetCursorCol()) + "|"
			Let YCoordinants = YCoordinants + IntToString (GetCursorRow()) + "|"
			Let sHandles = sHandles + "000|" ; not a window
		endif
		NextWord()
	EndWhile
	SetRestriction (RestrictAppWindow)
	restoreCursor()
endif  ; living inside a data sheet

; now return to focus, and search for QC_buttons
; find the starting point, and search it's peer level, and it's subordinants for QCButtons
Let h = hFocus
if (Level > 0) then
	; requesting a particular level,
	while (Level > 0)
		Let h = GetParent (h)
		Let level = level-1
	EndWhile
else
	; otherwise, just start with the real window.
	Let h = GetFirstChild (GetRealWindow (h))
endif

Let h = GetFirstWindow (h)
; now we have the handle of the starting point

; now, buzz across this peer level looking for buttons or QC_buttons.
; if it's not a button, and it has children, investigate it's chilren and there descendants.
InitializeStack ()  ; a place to save handles as we dive down
Let i = 0
while ((h)  && (i < 100))
	Let class = GetWindowClass (h)
	if (   (Class == "QC_button")
		|| (class == "Button")) then
		if (   (not IsWindowDisabled (h))
				&& (not IsWindowObscured (h))
;				&& (GetControlID (h) != -1)  ; these are just labels
				&& (IsWindowVisible (h))) then
			if (StringLength (GetWindowText (h, 0)) < 2) then
				; there is no text for this button
				; Store the coordinants of the center of the button
				Let sNames = sNames + GetWindowName (h) + "|"
				Let sHandles = sHandles + IntToString (h) + "|"
				Let x = (GetWindowLeft(h) + GetWindowRight(h))/2
				Let y = (GetWindowTop(h) + GetWindowBottom(h))/2
				Let XCoordinants = XCoordinants + IntToString (x) + "|"
				Let YCoordinants = YCoordinants + IntToString (y) + "|"
			else ; this has text, and can contain more than one clickable area
				SaveCursor()
				InvisibleCursor()
				MoveToWindow (h)
				let iRestrictionMode=GetRestriction ()
				SetRestriction (restrictWindow)
				Let x = 0
				Let y = 0
				While (   (GetCursorCol() != x)
					|| (GetCursorRow() != y))
					; loop until the cursor stops moving
					Let sNames = sNames + GetChunk() + "|"
					Let sHandles = sHandles + IntToString (h) + "|"
					Let x = GetCursorCol()
					Let y = GetCursorRow()
					Let XCoordinants = XCoordinants + IntToString (x) + "|"
					Let YCoordinants = YCoordinants + IntToString (y) + "|"
					NextWord()
				EndWhile
				SetRestriction (iRestrictionMode)
			endif  ; window has text
		endif
		Let hNext = GetNextWindow (h)
	else
		Let hChild = GetFirstChild (h)
		if (hChild) then
			; this static has children.
			; save the next handle, and dive down under this static
			; we'll return to this handle once we have explored this static's children
			Let hNext = GetNextWindow (h)
			if (hNext) then
				PushAhandle (hNext)
			endif
			Let hNext = hChild
		else
			; a static with no children
			Let hNext = GetNextWindow(h)
		endif
	endif
	if (not hNext) then
		; done with this level.  pop back up to the next higher level again
		; if the stack is empty, we receive a null handle
		Let hNext = PopAhandle ()
	endif
	let h = hNext
	Let i = i+1
EndWhile

; we are done exploring the levels
if (StringLength (sNames) > 1) then
	; we found some
	let sNames = stringChopLeft (sNames,1)
	Let sNames = sNames + "|" + msgEndOfList
	let sHandles = stringChopLeft (sHandles,1)
	Let XCoordinants = StringChopLeft (XCoordinants, 1)
	Let YCoordinants = StringChopLeft (YCoordinants, 1)
	Let h = GetFocus()  ; so we can get back here if the select dialog is canceled
	let i = DlgSelectItemInList (sNames, QWMsgSelectListButton1, false)
	if (i == 0) then
		Delay(2)
		Refresh()
		SetFocus (hFocus)
		return(1)
	endIf
	Let x = StringToInt (StringSegment (XCoordinants, "|", i))
	Let y = StringToInt (StringSegment (YCoordinants, "|", i))
	Let name = StringSegment (sNames, "|", i)
	SaveCursor()
	JAWSCursor()
	SaveCursor()
	MoveTo (x, y)
	; make sure that the expected word appears here.
	Let x = 0
	While (   (GetWord() != name)
		&& (x < 20))
		; wait up to 2 seconds for that to reappear after the HJ dialog
		Delay(1)
		Let x = x+1
	EndWhile
	if (x < 20) then
		LeftMouseButton()
	else
		Say (msgControlNameFailedToReappear, OT_NO_DISABLE)
	endif
	RestoreCursor()
	RestoreCursor()
	return (1)
else
	SayUsingVoice (VCTX_MESSAGE, "no buttons found", OT_STRING)
	return (0)
endif
EndFunction



Script listButtonActivate ()
var
handle hButton,
handle hTemp,
int iIndex,
string sButtonList,
int iButtonCount,
int iChoice

if (ListButtonsHelper (0)) then
	return
endif
if doesListContainButton() then
	let hTemp=listButtonHandleGet()
	let iButtonCount=0
	while hTemp && getWindowTypeCode(hTemp)==wt_button
		let sButtonList=sButtonList+list_item_separator+getWindowName(hTemp)
		let iButtonCount=iButtonCount+1
		let hTemp=getNextWindow(hTemp)
	endWhile
;remove leading delimiter
	let sButtonList=stringChopLeft(sButtonList,1)
	if iButtonCount > 1 then
		let iChoice=DlgSelectItemInList (sButtonList, QWMsgSelectListButton1, false)
		if not iChoice then
			return
		endIf
		speechOff()
		if not isEditComboActive() then
			TypeKey (ks1)
			delay(1)
		endIf
		let hButton=listButtonHandleGet()
; button handles change so must get the first button and count forward to find the correct handle
		let iIndex=1
		while iIndex < iChoice
			let hButton=getNextWindow(hButton)
			let iIndex=iIndex+1
		endwhile
		speechOn()
	else
		let hButton=listButtonHandleGet()
	endIf
	setFocus(hButton)
	pause()
	if getFocus()==hButton then
		enterKey()
		return
	endIf
endIf
SayFormattedMessage(ot_error, QWMsgListButtonCantActivate1_L, QWMsgListButtonCantActivate1_S)
EndScript

handle Function editComboListHandleGet ()
var
handle list,
handle null

let list=getFirstWindow(getForegroundWindow())
while list
	if getWindowClass(list)==wc_1 && isWindowVisible(list) then
		let list=getFirstChild(list)
		if getWindowClass(list)==wc_editComboList && isWindowVisible(list) && not isWindowObscured(list) then
			return list
		endIf
	endIf
	let list=getNextWindow(list)
endWhile
return null
EndFunction

Script sayNextLine ()
var
int iPriorTrans,
int iCurrentTrans,
	handle h,
	string RealName

; suspend monitoring of the accounts list if it is active.
; keeps the account from being spoken twice when arrowing up and down
if (QWMonitorAccountList == 2) then
	; speech was requested, but we are taking care of it here
	Let QWMonitorAccountList = 1
endif


Let h = GetFocus()
Let RealName = GetWindowName (GetRealWindow (h))
let giSuppressHighlightInQREdit=true
if (   (NormalAppCursor () == 0)
	|| (IsVirtualPCCursor ())) then
	performScript sayNextLine() ; default
	return
endif

if (MonthlyBudgetSummary (4)) then
	return
endif


if (IsEditInsideDataSheet (h)) then
	let giSuppressColumnTitles=true
	NextLine()
	return
endif
if (   (isEditComboActive())
	|| (RealName == wn_CreateScheduledTransaction)) then
	let giSuppressEcho=true
	nextLine()
	sayLine()
	return
elif isSplitTransactionWindow() && isPcCursor() then
	let giSuppressEcho=true
	let giSuppressColumnTitles=true
	let giSuppressRowNumbers=false
	nextLine()
	delay(1)
	splitTransactionWindowFocusSay()
	return
elif isTransactionRegisterScreen() && isPcCursor() then
	let giSuppressEcho=true
;	let iPriorTrans=transactionCountFromTopGet()
	SaveCursor()
	JAWSCursor()
	SaveCursor()
	RouteJAWSToPC()
	PCCursor()
	nextLine()
	delay(1)
;	let iCurrentTrans=transactionCountFromTopGet()
	if getWindowClass(getCurrentWindow())==wc_qrEdit  then
;		&& iPriorTrans!=iCurrentTrans then
;		sayUsingVoice(vctx_message,formatString(QWMsgTransaction1_L, intToString(transactionCountFromTopGet())),ot_JAWS_message)
		if (isEditComboActive ()) then
			SayUsingVoice (VCTX_MESSAGE, msgEndOfList, OT_NO_DISABLE)
			JAWSCursor()
			LeftMouseButton()  ; put us back where we were
			LeftMouseButton()
		endif
		RestoreCursor()
		RestoreCursor()
		SayWindow (GetFocus(), 0)
	endIf
	return
elif isInvestmentRegisterScreen() && isPcCursor() then
	let giSuppressEcho=true
	let iPriorTrans=transactionCountFromTopGet()
	nextLine()
	delay(1)
	let iCurrentTrans=transactionCountFromTopGet()
	if getWindowClass(getCurrentWindow())==wc_qrEdit && iPriorTrans!=iCurrentTrans then
		sayUsingVoice(vctx_message,formatString(QWMsgTransaction1_L, intToString(transactionCountFromTopGet())),ot_JAWS_message)
	endIf
	return
elif isAssetLiabilityRegisterScreen() && isPcCursor() then
	let giSuppressEcho=true
	let iPriorTrans=transactionCountFromTopGet()
	nextLine()
	delay(1)
	let iCurrentTrans=transactionCountFromTopGet()
	if getWindowClass(getCurrentWindow())==wc_qrEdit && iPriorTrans!=iCurrentTrans then
		sayUsingVoice(vctx_message,formatString(QWMsgTransaction1_L, intToString(transactionCountFromTopGet())),ot_JAWS_message)
	endIf
	return
elif isDataSheet() && isPcCursor() then
	nextLine()
	sayLine()
elif isQHIActive() && isPcCursor() && getCurrentControlId()!=cId_suggestedItemsList && not dialogActive() then
	nextLine()
	QHIFocusSay()

else
	performScript sayNextLine() ; default
endIf
EndScript


Script SummarizeDataSheetFields ()
var
	handle h

if (isTransactionRegisterScreen ()) then
	RegistryLineSummarize (0)
	return
endif

Let h = GetFocus()
if (GetWindowClass (h) != "ListBox") then
	Let h = GetParent (h)
endif
if (GetWindowClass (h) == "ListBox") then
	Let h = GetParent (h)
	if (GetWindowClass (h) == "QWListViewer") then
		SummarizeDataSheetLine (h)
	endif
endif
Say ("not in a data sheet", OT_STRING)


EndScript

Script ScriptFileName ()
ScriptAndAppNames (QWMsgQuicken1_L)
EndScript

Void Function buttonActivate (string sButtonList, int iChoice, handle hWnd)
var
string sName

let sName=StringSegment (sButtonList, list_item_separator, iChoice)
saveCursor()
if FindString (hWnd, sName, s_top, s_restricted) then
	delay(1)
	leftMouseButton()
	stopSpeech()
else
	sayUsingVoice(vctx_PCCursor, formatString(QWMsgNotFound1_L, sName),ot_error)
endIf
restoreCursor()
EndFunction

Script ToolbarButtonsList ()
var
int iOldPixels, ; pixels per space currently affect how chunks are determined
int iChoice,
string sButtonList,
string sButtonName,
handle hToolbarWindow,
handle hCurrent,
	handle h,
	int safety
if InHJDialog () then
	SayFormattedMessage (OT_error, cMsg337_L, cMsg337_S)
	return
endIf
; locate the toolbar window
if (isWriteChecksView ()) then
	; the Write Checks view
	Let hCurrent = GetFirstChild (GetParent (GetFocus ()))
elif (isDataSheet ()) then
	Let h = GetParent (GetFocus ())
	Let hCurrent = GetFirstWindow (h)
	if getWindowClass(hCurrent)!=wc_QWMDIToolbar then
		Let hCurrent = GetPriorWindow (h)
		if (GetWindowClass (hCurrent) != "QW_MDI_TOOLBAR") then
			Let h = GetParent (h)  ; grand parent of focus.
			Let hCurrent = GetFirstWindow (h)
			if (GetWindowClass (hCurrent) != "QW_MDI_TOOLBAR") then
				; search upward for the tool bar
				Let Safety = 0
				While (   (GetWindowClass (h) != "QWMDI")
					&& (Safety < 10))
					Let h = GetParent (h)
					Let safety = safety+1
				EndWhile
				if (Safety < 10) then
					Let hCurrent = GetFirstChild (h)
				endif
			endif
		endif
	endif
else ;not a recognized focus
	let hCurrent=getFirstChild(getAppMainWindow(getFocus()))
	while hCurrent && getWindowClass(hCurrent)!=wc_MDIClient
		let hCurrent=getNextWindow(hCurrent)
	endWhile
	let hCurrent=getFirstChild(hCurrent)
	let hCurrent=getFirstChild(hCurrent)
	while hCurrent && getWindowClass(hCurrent) !=wc_QWMDIToolbar
		let hCurrent=getNextWindow(hcurrent)
	endWhile
endif  ; end of deciding what view this is

if getWindowClass(hCurrent)!=wc_QWMDIToolbar then
	SayFormattedMessage (ot_error, QWMsgToolbarNotVisible1_L, QWMsgToolbarNotVisible1_S)
	return
else
;	SayMessage (OT_JAWS_MESSAGE, msgFindingToolBarItems_l, cmsgSilent)
endIf
saveCursor()
invisibleCursor()
moveToWindow(hCurrent)
let hToolbarWindow=hCurrent
; ensure pixels per space is set to a valid value
; note if we don't do this, currently, the toolbar list will only show one button containing the text of all the buttons
let iOldPixels=getJCFOption(opt_pixels_per_space)
setJCFOption(opt_pixels_per_space,8)
while getWindowClass(hCurrent)==wc_QWMDIToolbar && not isKeyWaiting() && getChunk() !=cscNull
	let sButtonName=getChunk()
	let sButtonList=sButtonList+list_item_separator+sButtonName
	nextChunk()
;	delay(1)
	let hCurrent=getCurrentWindow()
endWhile
let sButtonList=stringChopLeft(sButtonList,1)
setJCFOption(opt_pixels_per_space, iOldPixels)
restoreCursor()
let iChoice=DlgSelectItemInList (sButtonList, QWMsgToolbarButtons1_L, false)
stopSpeech()
if iChoice then
	buttonActivate(sButtonList,iChoice,hToolbarWindow)
else
	; no choice was made
	Delay (2)
	Refresh()
endIf
EndScript


const
	QWGrey1 = 12632256,
	QWGrey2 = 11850974

Int Function MDITitleRowCount (handle hwnd, int ByRef FirstRow, int ByRef SecondRow)
var
	int rows,
	int ColorBackground,
	int safe,
	int l,
	int t,
	int b,
	int r

Let rows = 0
GetWindowRect (hwnd, l, r, t, b)
SaveCursor()
InvisibleCursor()
MoveTo (l, t)
NextLine()
NextWord()
; this gets us positioned at the first line of text.
Let safe = 0
Let FirstRow = 0
Let SecondRow = 0  ; defaults
while (   (GetCursorRow() < b)
	&& (safe < 50))
	if (GetWindowAtPoint (GetCursorCol(), GetCursorRow()) == hwnd) then
		; inside the window we want
		Let ColorBackground = GetColorBackground()
		if (   (ColorBackground == QWGrey1)
				|| (ColorBackground == QWGrey2))  then
			if (FirstRow == 0) then
				; not asigned yet
				Let FirstRow = GetCursorRow()
			else
				Let SecondRow = GetCursorRow()
			endif
			Let rows = rows+1
		else  ; not the right color
			if (Rows > 0) then
				; title rows must be contiguous.
				RestoreCursor()
				return (rows)
			endif
		endif ; not the right color
	endif ; correct window
	NextLine()
	MoveTo (l, GetCursorRow ())
	NextWord()
	Let safe = safe+1
endWhile
RestoreCursor()
return (rows)
EndFunction


Int Function IsSecondLineOfTransaction ()
var
	handle hFocus,
	int iWinTop,
	int iRow,
	int iCol,
	int x,
	int y,
	int found
Let hFocus = GetFocus()
let iWinTop = getWindowTop (GetRealWindow (hFocus))

Let iRow = GetWindowTop (hFocus)
Let iCol = (GetWindowLeft(hFocus) + GetWindowRight(hFocus)) / 2

; move upward, looking for a blakc line
Let y = iRow  ;  it is about 3  pixels above the top of the QREdit, if this is a first row field
Let found = 0
While (   (y > iWinTop)  ; until we reach the top of the real window
	&& (found == 0))
	if (GetColorAtPoint (iCol, y) == 0) then
		; a black spot,  is this a line?
		; check left and right and see if it is a line
		Let found = 1
		Let x = 2
		; do the right search
		While (x < 6)
			if (GetColorAtPoint (iCol+x, y) != 0) then
				; not a horizontal black line
				Let found = 0
			endif
			Let x = x+2
		EndWhile
		; if that worked, check left
		if (found) then
			Let x = 2
			; do the left search
			While (x < 6)
				if (GetColorAtPoint (iCol-x, y) != 0) then
					; not a horizontal black line
					Let found = 0
				endif
				Let x = x+2
			EndWhile
		endif  ; the right search thinks it is a horizontal line
	endif  ; found a black spot
	if (found == 0) then
		; not found it yet, move up one pixel and try again
		Let y = y-1
	endif
EndWhile  ; main vertical scanning loop

if (found) then
	Let y = iRow - y ; distance from cursor to black line above it
	if (   (y > 9)
		&& (y < 30)) then
		;definitely a second row field
		return(1)
	endif
else
	SayString ("not found")
endif
return (0)
EndFunction



Int Function CountOccurrences (string s1, string s2)
var
	int i,
	int l,
	int count

Let count = 0
Let l = StringLength (s1)
Let i = 1
While (i <= l)
	if (SubString (s1, i, 1) == s2) then
		Let count = count+1
	endif
	Let i = i+1
EndWhile
Return (count)
EndFunction






String Function TransactionRegisterFieldLabel (int speak, int InputLeft, int InputRight, int InputRow)
var
	handle hFocus,
	handle hParent,
	int iFieldLeft,
	int iFieldRight,
	int iFieldCenter,
	int iFirstTitle,
	int iSecondTitle,
	int iTitleRow,
	int iLabel1Left,
	int iLabel2Left,
	int iSecondLine,
	int iSlashes,
	int safety,
	string sChunk,
	string ch,
	string s ; s will eventually hold the desired field label

; the strategy here is to find the title bar, and project the left and right sides of the field with focus
; up onto the title bar, and figure out which title bar text indicates the name of this field.
; Generally, text most directly above the field is considered it's label.
; if a second title line is available, it corresponds to second row fields.
; But if not, second row fields are indicated by slashes in the title bar.
; For some second row fields, there is no title bar text directly above the field. In these cases,
; the label text follows a slash that is in title text that is above the second row field to the left of the field of interest.

; this function gets called in two situations from a registry.
; in one case, such as when the tab key causes speech, this function tracks
; the QREdit with focus, and determines the edges itself.
; in the other, such as the registry summarize functions, to improve responsiveness, we are not moving the QREdit.
; But, we provide the coordinants externally, and thus want to ignore the QREdit.
; but, even in that case, a QREdit has focus. It's just not moving around.

Let hFocus = GetFocus()
Let hParent = GetParent (hFocus)
; First, make sure we are not in an open combo box.
if ( ((GetWindowClass (hFocus) == "QREdit")
		&& (GetWindowClass (hParent) == "QWMDI")
		) ; a QREdit inside a QWMDI
	|| (inputRight != 0)) then ; or the caller provided the edges
	let giNotEditCombo=false
	MDITitleRowCount (hParent, iFirstTitle, iSecondTitle)
	; Get the left and right bounds of the field
	; if the caller did not provide them, as the registry summary functions do, then we evaluate the QREdit
	if (InputRight == 0) then
		Let ifieldLeft = GetWindowLeft (hFocus)
		Let ifieldRight = GetWindowRight (hFocus)
	else
		Let iFieldLeft = InputLeft
		Let iFieldRight = InputRight  ; provided by caller
	endif
	Let iFieldCenter = (iFieldLeft + iFieldRight)/2
	if (inputRow == 0) then
		; the caller did not supply a row they were interested in
		Let iSecondLine = IsSecondLineOfTransaction ()
	 else
		; the InputRow is 1 for a first row field, and 2 for a second row field.
		Let iSecondLine = InputRow-1
	endif

	; Now, set iTitleRow to the vertical pixel position of the title row we will parse for the field label.
	if (iSecondLine) then
		; if we have a second title line, we want to extract from that line.
		; otherwise, we have to figure out something relevant from the first line.
		if (iSecondTitle > 0) then
			Let iTitleRow = iSecondTitle
		else;  a second row field, but only one row of title
			Let iTitleRow = iFirstTitle
		endif
	else ; a first line field
		Let iTitleRow = iFirstTitle
	endif ; a first line field
	; now get the text and decode if needed.
	SaveCursor()
	InvisibleCursor()
	MoveTo (iFieldCenter, iTitleRow)
	Let ch = GetWord()
	if (StringLength (ch) < 2) then
		PriorWord()
	endif
	Let s = GetWord()
	Let sChunk = GetChunk()
	; Now move cursor to beginning of this chunk to get its left most position.
	PriorChunk ()
	NextChunk ()
	let iLabel1Left = GetCursorCol ()
	let iLabel2Left = 0
	; deal with cases where one chunk contains multiple titles.
	if (StringContains (sChunk, "Clr") == 0) then
		Let s = sChunk
	endif
	; In most cases, at this point, s contains the label we want.
	; Most of the rest of this is special casing for
	; title row text that contain slashes or for a second line field.
	if (StringContains (s, "/")) then ; we want to reduce s to one / delimitted segment, we have to determine which one
		if (iSecondLine == 0) then
			; a first line field, so we want the first slash delimitted segment of s.
			Let s = StringSegment (s, "/", 1)
		else ; a second line field
			; If s contains only one slash, we want the second segment (the stuff after the slash) because
			; that is the label for the only second line field.
			; But, if there are two slashes, there are two second line fields.
			; In that case, we need to determine if the field of interest is the first (left most) or second (right most).
			; The left field should have a left boundary between the left edge of this chunk of the title bar and the first slash.
			; The right field will have a left edge to the right of the first slash of this chunk of the title bar.
			Let iSlashes = CountOccurrences (s, "/")
			if (iSlashes == 1) then ; there is only one second line field.
				Let s = StringSegment (s, "/", 2)
			ElIf iSlashes > 1 then
				; Find the pixel location of the first character after the first slash, that is ILabel2Left.
				MoveTo (iLabel1Left, iTitleRow)
				let ch = GetCharacter ()
				let safety = 0
				while ((ch != "/") && (safety < stringLength (sChunk)) )
					; This approach is more reliable then using find, besides, we are not searching far anyway.
					NextCharacter ()
					let ch = getCharacter()
					let safety = safety + 1
				endWhile
				NextCharacter ()
				let iLabel2Left = GetCursorCol ()
				if iFieldLeft >= iLabel1Left && iFieldLeft <= iLabel2Left then
					; we are seeking label for left most second row field
					Let s = StringSegment (s, "/", 2)
				elIf iFieldLeft > iLabel2Left then
					Let s = StringSegment (s, "/", 3)
				endIf ; iFieldLeft below first label in title text with slashes
			endif ; there was one slash
		endif ; is second line field
	endif ; s contains a slash
	RestoreCursor()
	if (speak) then
		; look up title substitutions, so they make sense
		Let ch = MakeDelimitedList (s, "", 0)
		Let sChunk = IniReadString ("Field Labels", ch, s, "qw.jsi")
		SayUsingVoice (VCTX_MESSAGE, SChunk, OT_CONTROL_NAME)
	endif
	return (s)
else ; not a QREdit inside a QWMDI
	return ("")
endif
EndFunction


int Function isOneLineTransactionDisplay ()
var
int iWinTop,
int iRow,
int iTransTopOffset,
	handle hReal,
	int dummy1,
	int dummy2



Let hReal = getRealWindow (getFocus ())

; if this has two rows of title information, it's a two line display for sure
if (MDITitleRowCount (hReal, dummy1, dummy2) > 1) then
	return (0)  ; not a one liner
endif

let iWinTop = getWindowTop (hReal)
let iRow=getCursorRow()

if getCharacter()==cscNull then
; accommodate one pixel difference when caret is on blank as opposed to being on a character
	let iRow=iRow+1
endIf

let iTransTopOffset=(iRow-iWinTop)%kiTRTransHeightOneLine
if iTransTopOffset >=kiTROneLineTopOffset then
	return false
else
	return true
endIf
EndFunction

Int Function transactionCountFromTopGet ()
var
int iRow,
int iWinTop

if getWindowClass(getFocus())==wc_QREdit then
	let iRow=getCursorRow()
	let iWinTop=getWindowTop(getRealWindow(getFocus()))

; determine if in one or two line mode:
if isInvestmentRegisterScreen() then
; determine which transaction has focus, ie count from top of current window
	return ((iRow-iWinTop)/kiTRTransHeight)-4
elif isOneLineTransactionDisplay() then
; determine which transaction has focus, ie count from top of current window
	return ((iRow-iWinTop)/kiTRTransHeightOneLine)-3
else ;two line mode
; determine which transaction has focus, ie count from top of current window
		return ((iRow-iWinTop)/kiTRTransHeight)-1
	endIf
endIf
EndFunction



String Function assetLiabilityRegisterFieldName (int speak)
; This is virtually the same as TransactionRegisterFieldName except for the field names
var
string sField,
int iCol,
int iRow,
int iWinLeft,
int iWinRight,
int iWinTop,
int iHorizDistLeft,
int iHorizDistRight,
int iSecondRowField, ; true if the field is a second row field
int iOneLineDisplayMode, ; true if a transaction is displayed on one line rather than two
int iMemoBeforeCategory, ; true if the memo field is before the category field (see Edit/Options/Register/Memo before Category checkbox)
int iDateInFirstColumn ; date can be in either the first or second column

if getWindowClass(getFocus())==wc_QREdit then
	let iCol=getCursorCol()
	let iWinLeft=getWindowLeft(getRealWindow(getFocus()))
	let iWinRight=getWindowRight(getRealWindow(getFocus()))
	let iHorizDistLeft=iCol-iWinLeft
let iHorizDistRight=iWinRight-iCol
	let iRow=getCursorRow()
	let iWinTop=getWindowTop(getRealWindow(getFocus()))
; reset global date or memo flag
	let giNotEditCombo=false

; determine if in one or two line mode:
	let iOneLineDisplayMode=isOneLineTransactionDisplay()
	if not iOneLineDisplayMode then
; Determine whether field with focus is a second row field
/* Explanation of calculation:
we set iSecondRowField=((iRow-(iWinTop+kiTRTransFirstLine))%kiTRTransHeight)-kiTRTwoLineTopOffset > 0
1. iWinTop+the constant kiTRTransHeight will always give the top line of the top transaction
2. we subtract this value from the iRow calculation which gives us the distance from the top of
	the first visible transactionn to the cursor
3. we use modulo division to divide by the transaction height (determined to be 34 pixels
	in two line display mode)
	This modulo division gives us a value consistent for each transacction
4. we subtract a known distance (from top of current transaction to cursor) which is represented
	by the constant kiTRTwoLineTopOffset and see if the resulting value is greater than 0.
	For a first line field, the value should always be less than or equal to 0.
	A value greater than 0 means the cursor is on the second line of the transaction.
5. If one Line display is on then the above calculation will be erroneous.
*/
let iSecondRowField=((irow-iwintop)%kiTRTransHeight)-kiTRTwoLineTopOffset
; Check if memo field is before the category field
		let iMemoBeforeCategory=isMemoBeforeCategory()
	endIf
let iDateInFirstColumn=isDateInFirstColumn()
; We'll now see if the horiz dists are within known ranges
	if iSecondRowField && not iOneLineDisplayMode then
		If iHorizDistLeft > kiTRMemoMin then
; check the order and swap if necessary
; normally category then memo
			if iMemoBeforeCategory then
				let sField=QWMSGTRCategory1_L
			else
				let sField=QWMsgTRMemo1_L
				let giNotEditCombo=true
			endIf
		else
; check the order and swap if necessary
			if iMemoBeforeCategory then
			let sField=QWMsgTRMemo1_L
				let giNotEditCombo=true
			else
			let sField=QWMSGTRCategory1_L
			endIf
		endIf
	elif iHorizDistLeft >=kiTRDateMin && iHorizDistLeft < kiTRRefMin then
		if iDateInFirstColumn then
		let sField=QWMsgTRDate1_L
		let giNotEditCombo=true
		else
		let sField=QWMsgTRRef1_L
		endIf
	elif iHorizDistLeft >=kiTRRefMin && iHorizDistLeft < kiTRPayeeMin then
		if iDateInFirstColumn then
		let sField=QWMsgTRRef1_L
		else
		let sField=QWMsgTRDate1_L
		let giNotEditCombo=true
		endIf
	elif iOneLineDisplayMode && iHorizDistLeft >=kiTRCategoryMinOneLine&& iHorizDistRight > kiTRPaymentMin then
		let sField=QWMSGTRCategory1_L
	elif iHorizDistLeft >=kiTRPayeeMin && iHorizDistRight > kiTRPaymentMin then
		let sField=QWMsgTRPayee1_L
	elif iHorizDistRight <=kiTRDecreaseMin && iHorizDistRight > kiTRCLRMin then
		let sField=QWMsgTRDecrease1_L
	elif iHorizDistRight <=kiTRCLRMin && iHorizDistRight > kiTRIncreaseMin then
		let sField=QWMsgTRCLR1_L
				let giNotEditCombo=true
	elif iHorizDistRight <=kiTRIncreaseMin then
		let sField=QWMsgTRIncrease1_L
	endIf
; note that we only say the field prompt and type here
; the contents are spoken elsewhere
; this is because screen sensitive help uses this function too
	if (speak) then  ; cause speech
		say(sField,ot_control_name)
		let gsAlternativeBrailleRepresentation=sField
	endif
else  ; not a QREdit
	if (speak) then
		let gsAlternativeBrailleRepresentation=cscNull
		sayObjectTypeAndText()
	endif
endIf
EndFunction



String Function investmentRegisterFieldName (int speak)
var
handle hFocus,
string sField,
int iCol,
int iRow,
int iFocusLeft,
int iFocusRight,
int iSecondRowField, ; true if the field is a second row field
int iHeaderRow1

if getWindowClass(getFocus())==wc_QREdit then
	let iCol=getCursorCol()
	let iRow=getCursorRow()
	 let hFocus=getFocus()
let iFocusLeft=getWindowLeft(hFocus)
let iFocusRight=getWindowRight(hFocus)
saveCursor()
invisibleCursor()
if findString(getRealWindow(hFocus),QWMsgTRDate1_L, s_top, s_unrestricted) then
	let iHeaderRow1=getCursorRow()
	let iSecondRowField=((iRow-iHeaderRow1)%kiTRTransHeight)-kiInvestmentFudge < 0
	if iSecondRowField then
			nextLine()
				endIf
				moveTo(iCol,getCursorRow())
endIf
	let sField=getTextBetween(iFocusLeft,iFocusRight)
	say(sField,ot_control_name)
	restoreCursor()
	let gsAlternativeBrailleRepresentation=sField
	if stringContains(sField,scAction) || stringContains(sField,scSecurity) then
		let giNotEditCombo=false
	else
		let giNotEditCombo=true
	endIf
else
	let gsAlternativeBrailleRepresentation=cscNull
	sayObjectTypeAndText()
endIf
EndFunction



Function WriteChecksFocusSay ()
var
string sField,
int iControlId
if getWindowClass(GetCurrentWindow())==wc_edit then
	let iControlId=getCurrentControlId()
	if iControlId==cId_WCDate then
		let sField=QWMsgWCDate1_L
	elif iControlId==cId_WCPayee then
		let sField=QWMsgWCPayee1_L
	elif iControlId==cId_WCAmount then
		let sField=QWMsgWCAmount1_L
	elif iControlId >=cId_WCAddressLine1 && iControlId <=cId_WCAddressLine5 then
		let sField=formatString(QWMsgWCAddressLine1_L, intToString(iControlId-cId_WCAddressLine1+1))
	elif iControlId==cId_WCMemo then
		let sField=QWMsgWCMemo1_L
	elif iControlId==cId_WCCategory then
		let sField=QWMsgWCCategory1_L
	elif iControlId==cId_WCMessage then
		let sField=QWMsgWCMessage1_L
	endIf
	let gsAlternativeBrailleRepresentation=sField
	say(sField,ot_control_name)
	if iControlId==cId_WCCategory || iControlId==cId_WCPayee then
		SayFormattedMessage(ot_control_type,cVMsgEditCombo1_L, cVMsgEditCombo1_L)
	else
		say(getObjectType(),ot_control_type)
	endIf
	else
	let gsAlternativeBrailleRepresentation=cscNull
	sayObjectTypeAndText()
endIf
EndFunction

 string Function WriteChecksFieldNameGet()
var
string sField,
int iControlId
if getWindowClass(GetCurrentWindow())==wc_edit then
	let iControlId=getCurrentControlId()
	if iControlId==cId_WCDate then
		let sField=QWMsgWCDate1_L
	elif iControlId==cId_WCPayee then
		let sField=QWMsgWCPayee1_L
	elif iControlId==cId_WCAmount then
		let sField=QWMsgWCAmount1_L
	elif iControlId >=cId_WCAddressLine1 && iControlId <=cId_WCAddressLine5 then
		let sField=formatString(QWMsgWCAddressLine1_L, intToString(iControlId-cId_WCAddressLine1+1))
	elif iControlId==cId_WCMemo then
		let sField=QWMsgWCMemo1_L
	elif iControlId==cId_WCCategory then
		let sField=QWMsgWCCategory1_L
	elif iControlId==cId_WCMessage then
		let sField=QWMsgWCMessage1_L
	endIf
endIf
return sField
EndFunction

Int Function isTransactionRegisterScreen ()
var
	handle hParent,
	string sRealName,
	handle hFocus

let hFocus=getFocus()
Let hParent = GetParent (hFocus)
let sRealName = getWindowName (getAppMainWindow (hFocus))
; if QuickEntry is active then we are in a register
if (  (stringContains (sRealName, wn_quickEntry2003))
	&& (not isAssetLiabilityRegisterScreen())) then
	return true
endIf

if (   (GetWindowClass (hParent) == "QWMDI")
	&& (getWindowClass(hFocus)==wc_qrEdit)) then
	return true
endif
return false
EndFunction

int Function isMemoBeforeCategory ()
var
handle hCurrent,
string sWindowText

; locate the QWMDI window
; This window contains the bank transaction header
let hCurrent=getFirstChild(getAppMainWindow(getFocus()))
while hCurrent && getWindowClass(hCurrent)!=wc_MDIClient
	let hCurrent=getNextWindow(hCurrent)
endWhile
let hCurrent=getFirstChild(hCurrent) ; this should be the window with class QWMDI
let sWindowText=getWindowText(hCurrent,read_everything)
if stringContains(sWindowText,scMemoBeforeCategory) then
	return true
else
	return false
endIf
EndFunction


int Function isDateInFirstColumn ()
var
handle hCurrent,
string sWindowText

; locate the QWMDI window
; This window contains the bank transaction header
let hCurrent=getFirstChild(getAppMainWindow(getFocus()))
while hCurrent && getWindowClass(hCurrent)!=wc_MDIClient
	let hCurrent=getNextWindow(hCurrent)
endWhile
let hCurrent=getFirstChild(hCurrent) ; this should be the window with class QWMDI
let sWindowText=getWindowText(hCurrent,read_everything)
if stringContains(sWindowText,scDateFirst1) || stringContains(sWindowText,scDateFirst2) then
	return true
else
	return false
endIf
EndFunction


Int Function IsMonthlyBudgetSummary ()
var
	handle hFocus

Let hFocus = GetCurrentWindow()
if (GetWindowName (hFocus) == wn_MonthlyBudgetSummary) then
	return (1)
endif
return (0)
EndFunction



Void Function SayMonth ()
SayUsingVoice (VCTX_MESSAGE, StringSegment (MonthNames, "|", QWMonth), OT_NO_DISABLE)
EndFunction


Function SayBudgetSummaryRowHeader ()
var
	string s,
	int i

Let s = GetLine()
; find the colon, and say everything to the left of it
Let i = StringContains (s, ":")
SayUsingVoice (VCTX_MESSAGE, Substring (s, 1, i-1), OT_STRING)
EndFunction

String Function MBSCellGet (int click)
var
	handle hCurrent,
	string s,
	int i,
	int x

/*
Since nothing really changes when we operate the left and right arros,
We let a global keep track of the month.  Up and down arrows move the PC cursor
to the row of interest.  To find the cell, we find the
right end of the label in the column headers, and drop straight down to the row of interest.  This
targets the word with the value we want.
*/
Let hCurrent = GetCurrentWindow()
SaveCursor()
if (click == 1) then
	JAWSCursor()
else
	InvisibleCursor()
endif
MoveToWindow (GetParent (hCurrent))
NextLine()
Let i = QWMonth
While (i > 0)
	NextWord()
	Let i = i-1
EndWhile

; now we found the month
if (click == 1) then
	LeftMouseButton()
	RestoreCursor()
	return ("")
endif

; now we found the month, we need to find the last character of the word.
; this lines up with the data in the cell below.

While (   (GetCharacter () != " ")
		&& (GetCharacter() != cscNull))
	NextCharacter()
EndWhile
PriorCharacter()  ; back on the last nonblank

Let x = GetCursorCol()
RouteInvisibleToPC()  ; back to the row with focus
; move to the cell of interest on this line.
MoveTo (x, GetCursorRow())
Let s = GetWord()
RestoreCursor()
return (s)
EndFunction


Int Function IsMonthlyBudgetDetails ()
var
	handle hFocus

Let hFocus = GetFocus()

if (   (GetWindowName (hFocus) == wn_MonthlyBudgetAmount)
		&& (StringContains (GetWindowName (GetRealWindow (hFocus)), wn_MonthlySummary))) then
			Return (1)
endif
return (0)
EndFunction


Function MonthlyBudgetDetails ()
var
	handle grip
; call this only from the monthly budget summary.
if (   (QWMonth > 0)
		&& (QWMonth < 13)) then
	MBSCellGet (1)
	SayMonth ()
	Let grip = GetRealWindow (GetCurrentWindow())
	Let grip = FindDescendantWindow (grip, 2011)
	if (grip) then
		Say (GetWindowName (grip), OT_NO_DISABLE)
		SaveCursor()
		JAWSCursor()
		SaveCursor()
		MoveToWindow (grip)
		LeftMousebutton()
		RestoreCursor()
		RestoreCursor()
	else
		SayString ("unable to find control 2011")
	endif
else
	Say (msgNotOnAMonth, OT_NO_DISABLE)
endif
EndFunction


Int Function MonthlyBudgetSummary (int action)
if (IsMonthlyBudgetSummary ()) then
	; Handle the left and right arrows.
	if (QWMonth == 0) then
		; not initialized yet.  1=January, 12=December, and 13= total
		Let QWMonth = 1   ; January
	endif
	if (action == 0) then
		; read the cell, including row and columnn headers
		SayMonth ()
		SayBudgetSummaryRowHeader ()
	Elif (action == 1) then
		; left arrow.
		if (QWMonth > 1) then
			Let QWMonth = QWMonth-1
		endif
		SayMonth()
	Elif (action == 2) then
		; Right arrow.
		if (QWMonth < 13) then
			Let QWMonth = QWMonth+1
		endif
		SayMonth()
	Elif (action == 3) then
		; up arrow
		TypeKey ("UpArrow")
		Pause()
		SayBudgetSummaryRowHeader ()
	 Elif (action == 4) then
		; down arrow
		TypeKey ("DownArrow")
		Pause()
		SayBudgetSummaryRowHeader ()
	endif
	Say (MBSCellGet (0), OT_NO_DISABLE)
	return (1)
endif
return (0)
EndFunction

int Function isAssetLiabilityRegisterScreen ()
var
string sRealName,
handle hFocus
let hFocus=getFocus()
let sRealName=getWindowName(getRealWindow(getFocus()))
if stringContains(sRealName,scAssetLiabilityIdentifier1) || stringContains(sRealName,scAssetLiabilityIdentifier2) && getWindowClass(hFocus)==wc_QREdit then
	return true
else
	return false
endIf
EndFunction


Int Function isInvestmentRegisterScreen ()
var
string sRealName,
handle hFocus
let hFocus=getFocus()
let sRealName=getWindowName(getRealWindow(getFocus()))
if stringContains(sRealName,scInvestmentIdentifier) && getWindowClass(hFocus)==wc_QREdit then
	return true
else
	return false
endIf
EndFunction

Int Function isLoanView ()
var
string sWindowText
let sWindowText=getWindowText(getRealWindow(getFocus()),read_everything)
if stringContains(sWindowText,scLoanViewIdentifier) then
	return true
else
	return false
endIf
EndFunction

int Function isMyFinancesView ()
return StringContains(getWindowName(getRealWindow(getFocus())),wn_myFinances) > 0
EndFunction

int Function isWriteChecksView ()
if RealWindowIs (scWriteChecksViewIdentifier) then
	return true
else
	return false
endIf
EndFunction


int Function isSplitTransactionWindow ()
if getWindowName(getRealWindow(getFocus()))==wn_splitTransactionWindow then
	return true
else
	return false
endIf
EndFunction


void Function splitTransactionWindowFocusSay ()
var
string sField,
int iControlId,
int iRestrictionMode,
int iRecordNumber

let iRestrictionMode=GetRestriction ()
SetRestriction (restrictRealWindow)
saveCursor()
invisibleCursor()
routeInvisibleToPc()
; we can't get the number of the current record.
; what we do is get the number of the prior line and add one
; This works because the first line converts a non-number to 0
; subsequent lines get the prior record number and add one.
priorLine()
JAWSHome()
let iRecordNumber=stringToInt(getWord())+1
restoreCursor()
setRestriction(iRestrictionMode)
if not giSuppressRowNumbers && not isEditComboActive() then
	say(intToString(iRecordNumber),ot_position)
endIf
let iControlId=getCurrentControlId()
if iControlId==cId_SWCategory then
	let sField=QWMsgSWCategory1_L
elif iControlId==cId_SWMemo then
	let sField=QWMsgSWMemo1_L
elif iControlId==cId_SWAmount then
	let sField=QWMsgSWAmount1_L
endIf
let gsAlternativeBrailleRepresentation=sField+cscSpace+intToString(iRecordNumber)+scColon
if not giSuppressColumnTitles then
	say(sField,ot_control_name)
endIf
if getWindowTypeCode(getParent(getFocus()))==wt_listbox then
	if isEditComboActive() then
		sayWindow(editComboListHandleGet(),read_highlighted)
		return
	endIf
	if iControlId==cId_SWCategory then
		SayFormattedMessage(ot_control_type,cVMsgEditCombo1_L, cVMsgEditCombo1_L)
	else
		SayFormattedMessage(ot_control_type,getWindowType(getFocus()))
	endIf
else
	sayWindowTypeAndText(getFocus())
endIf
EndFunction

Function splitTransactionWindowLocationSay ()
var
string sField,
int iControlId,
int iRestrictionMode,
int iRecordNumber

let iRestrictionMode=GetRestriction ()
SetRestriction (restrictRealWindow)
saveCursor()
invisibleCursor()
routeInvisibleToPc()
; we can't get the number of the current record.
; what we do is get the number of the prior line and add one
; This works because the first line converts a non-number to 0
; subsequent lines get the prior record number and add one.
priorLine()
JAWSHome()
let iRecordNumber=stringToInt(getWord())+1
restoreCursor()
setRestriction(iRestrictionMode)
let iControlId=getCurrentControlId()
if iControlId==cId_SWCategory then
	let sField=QWMsgSWCategory1_L
elif iControlId==cId_SWMemo then
	let sField=QWMsgSWMemo1_L
elif iControlId==cId_SWAmount then
	let sField=QWMsgSWAmount1_L
endIf
say(sField,ot_position)
say(intToString(iRecordNumber),ot_position)
EndFunction

Int Function dataSheetHasHeaders ()
var
int iLength
if isDataSheet() then
	saveCursor()
	invisibleCursor()
	if moveToWindow(getParent(getFocus())) then
		let iLength=stringLength(getLine())
	endIf
	restoreCursor()
	return iLength > 1
else
	return false
endIf
EndFunction

Void Function DataSheetHeadersSay ()
var
handle hParent,
handle hFocus

let hFocus=getFocus()
let hParent=getParent(hFocus)
if isDataSheet() then
	saveCursor()
	invisibleCursor()
	if	moveToWindow(hParent) then
		if stringContains(getWindowName(getRealWindow(hFocus)),wn_reconcile) then
; first line contains prompts, next line contains listbox headers
			nextLine()
		endIf
		sayTextBetween(getWindowLeft(hParent),getWindowRight(hParent))
	endIf
endIf
restoreCursor()
EndFunction

string Function DataSheetHeadersGet()
var
handle hParent,
handle hFocus,
string text,
	string RealName

let hFocus=getFocus()
let hParent=getParent(hFocus)
if isDataSheet() then
	saveCursor()
	invisibleCursor()
	if	moveToWindow(hParent) then
		Let RealName = getWindowName(getRealWindow(hFocus))
		if (   (stringContains (RealName, wn_reconcile))
			|| (StringContains (RealName, wn_AccountList))) then
; first line contains prompts, next line contains listbox headers
			nextLine()
		endIf
		let text=getTextBetween(getWindowLeft(hParent),getWindowRight(hParent))
	endIf
endIf
restoreCursor()
return text
EndFunction

void Function windowDescriptiveStaticTextSay ()
var
handle hReal,
handle hCurrent,
string sClass
if not shouldItemSpeak(ot_dialog_text) then
	return
endIf
let hReal=getRealWindow(getFocus())
let hCurrent=getFirstChild(hReal)
while hCurrent
	let sClass=getWindowClass(hCurrent)
	if sClass==wc_static && isDescriptiveText(hCurrent) then
		sayWindow(hCurrent,read_everything)
	elif sClass==wc_QWLabel then
		sayWindow(hCurrent,read_everything)
	endIf
	let hCurrent=getNextWindow(hCurrent)
endWhile
EndFunction

;rob
Script screenSensitiveHelp ()
var
string sClass,
string sRealName,
	string sName,
int iControlId,
handle hFocus,
string sTemp_L,
string sTemp_S
let hFocus=getFocus()
if isSameScript() then
	AppFileTopic(topic_Quicken_Q2K)
endIf
let sRealName=getWindowName(getRealWindow(hFocus))
let sClass=getWindowClass(hFocus)
let iControlId=getControlId(hFocus)
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
Let sTemp_S = ""
Let sTemp_L = ""

; Investing center, portfolios
if (sRealName == wn_InvestingCenter) then
	SayFormattedMessage (ot_USER_BUFFER, msgInvestingCenterHelp, msgInvestingCenterHelp)
	AddHotKeyLinks ()
	return
endif

; Budget Analyze screen
if (StringContains (sRealName, scAnalyze)) then
	Let sTemp_s = FormatString (msgBudgetAnalyzeHelp1, StringSegment (sRealName, " ", 2))
	SayFormattedMessage (ot_USER_BUFFER, sTemp_s, sTemp_S)
	AddHotKeyLinks ()
	return
endif


if (IsMonthlyBudgetSummary ()) then
	SayFormattedMessage (ot_USER_BUFFER, msgMBSHelp, msgMBSHelp)
	AddHotKeyLinks ()
	return
elif (IsMonthlyBudgetDetails ()) then
	SayFormattedMessage (ot_USER_BUFFER, msgMBDHelp, msgMBDHelp)
	AddHotKeyLinks ()
	return
endif

; budget setup.
if (StringContains (sRealName, scBudget)) then
	if (sClass == "button") then
		if (   (iControlId >= 32300)
			&& (iControlId <= 32304)) then
			SayFormattedMessage (ot_USER_BUFFER, msgMBSetupHelp1, msgMBSetupHelp1)
			AddHotKeyLinks ()
			return
		endif ; control id in range
	elif (sClass == "ListBox") then
		Let sName = GetWindowName (hFocus)
		if (   (sName == scMonthlyAverage)
			|| (sName == scQuarterlyAverage)
			|| (sName == scYearlyAverage)) then
			SayFormattedMessage (ot_USER_BUFFER, msgMBSetupHelp2, msgMBSetupHelp2)
			AddHotKeyLinks ()
			return
		endif
	endif ; end of class case
endif  ; the budget setup window

if (sRealName == wn_SetUpBills) then
	SayFormattedMessage (ot_USER_BUFFER, formatString(msgSetUpBillsHelp_L, EditDataSheetHeadersGet ()))
	AddHotKeyLinks ()
	return
endif
if (sRealName == wn_QuickenGuidedSetup) then
	Let sTemp_S = AddToString (sTemp_S, msgQuickenGuidedSetupHelp)
	Let sTemp_L = AddToString (sTemp_L, msgQuickenGuidedSetupHelp)
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotKeyLinks ()
	return
endif
if isPcCursor() && isEditComboActive() then
	let sTemp_L = AddToString (sTemp_l, QWMsgHelp1_L)
	let sTemp_S = AddToString (sTemp_S, QWMsgHelp1_S)
	if doesListContainButton() then
		if listButtonCountGet() > 1 then
			let sTemp_L = AddToString(sTemp_L,QWMsgHelp2_L)
			let sTemp_S = AddToString(sTemp_S,QWMsgHelp2_S)
		else
		let sTemp_L = AddToString(sTemp_L,QWMsgHelp3_L)
		let sTemp_S = AddToString(sTemp_S,QWMsgHelp3_S)
		endIf
	endIf
	let sTemp_L = AddToString(sTemp_L,QWMsgHelp4_L)
	let sTemp_S = AddToString(sTemp_S,QWMsgHelp4_S)
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotKeyLinks ()
	return
elif isWriteChecksView() then
	SayFormattedMessage (ot_USER_BUFFER, formatString(QWMsgHelp5_L, writeChecksFieldNameGet()), formatString(QWMsgHelp5_S, writeChecksFieldNameGet()))
	AddHotKeyLinks ()
elif isSplitTransactionWindow() then
	SayFormattedMessage (ot_USER_BUFFER, QWMsgHelp6_L, QWMsgHelp6_S)
	AddHotKeyLinks ()
; we test for Transaction Register screens last of all screens as its detection is more general
elif isTransactionRegisterScreen() && sClass==wc_qrEdit then
	let sTemp_L = formatString(QWMsgHelp7_L, transactionRegisterFieldLabel (0,0,0,0)) + cScBufferNewLine
	let sTemp_S = formatString(QWMsgHelp7_S, transactionRegisterFieldLabel (0,0,0,0)) + cScBufferNewLine
	if !giNotEditCombo then
	let sTemp_L = AddToString(sTemp_L,QWMsgHelp8_L)
	let sTemp_S = AddToString(sTemp_S,QWMsgHelp8_S)
	endIf
	if isOneLineTransactionDisplay() then
	let sTemp_L = AddToString(sTemp_L,QWMsgHelp9_L)
	let sTemp_S = AddToString(sTemp_S,QWMsgHelp9_S)
	else
	let sTemp_L = AddToString(sTemp_L,QWMsgHelp10_L)
	let sTemp_S = AddToString(sTemp_S,QWMsgHelp10_S)
	endIf
	let sTemp_L = AddToString(sTemp_L,formatString(QWMsgHelp11_L, intToString(transactionCountFromTopGet())) )
	let sTemp_S = AddToString(sTemp_S,formatString(QWMsgHelp11_S, intToString(transactionCountFromTopGet())))
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotKeyLinks ()
elif isAssetLiabilityRegisterScreen() && getWindowClass(getFocus())==wc_qrEdit then
		let sTemp_L = formatString(QWMsgHelp7_L, assetLiabilityRegisterFieldName (0)) + cScBufferNewLine
		let sTemp_S = formatString(QWMsgHelp7_S, assetLiabilityRegisterFieldName (0)) + cScBufferNewLine
	if !giNotEditCombo then
		let sTemp_L = AddToString(sTemp_L,QWMsgHelp8_L)
		let sTemp_S = AddToString(sTemp_S,QWMsgHelp8_S)
	endIf
	if isOneLineTransactionDisplay() then
		let sTemp_L = AddToString(sTemp_L,QWMsgHelp9_L)
		let sTemp_S = AddToString(sTemp_S,QWMsgHelp9_S)
	else
		let sTemp_L = AddToString(sTemp_L,QWMsgHelp10_L)
		let sTemp_S = AddToString(sTemp_S,QWMsgHelp10_S)
	endIf
	let sTemp_L = AddToString(sTemp_L, formatString(QWMsgHelp11_L, intToString(transactionCountFromTopGet())))
	let sTemp_S = AddToString(sTemp_S, formatString(QWMsgHelp11_S, intToString(transactionCountFromTopGet())))
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotKeyLinks ()
elif isInvestmentRegisterScreen() && getWindowClass(getFocus())==wc_qrEdit then
		let sTemp_L = formatString(QWMsgHelp7_L, investmentRegisterFieldName (0)) + cScBufferNewLine
		let sTemp_S = formatString(QWMsgHelp7_S, investmentRegisterFieldName (0)) + cScBufferNewLine
	if !giNotEditCombo then
		let sTemp_L = AddToString(sTemp_L,QWMsgHelp8_L)
		let sTemp_S = AddToString(sTemp_S,QWMsgHelp8_S)
	endIf
	let sTemp_L = AddToString(sTemp_L, formatString(QWMsgHelp11_L, intToString(transactionCountFromTopGet())))
	let sTemp_S = AddToString(sTemp_S,formatString(QWMsgHelp11_S, intToString(transactionCountFromTopGet())))
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotKeyLinks ()
elif isCalculator() then
	SayFormattedMessage (ot_USER_BUFFER, msgCalculatorHelp, msgCalculatorHelp)
	AddHotKeyLinks ()
elif isDataSheet() then
	; first check if we are in the reconcile window
	if stringContains(sRealName,wn_reconcile) then
		SayFormattedMessage (ot_USER_BUFFER, formatString(QWMsgHelp13_L, datasheetPromptGet (), datasheetHeadersGet()), formatString(QWMsgHelp13_S, datasheetPromptGet (), datasheetHeadersGet()))
		AddHotKeyLinks ()
		return
	endIf
	; is this the Accounts list?
	if stringContains(sRealName,wn_accountList) then
		Let sTemp_l = QWMsg_AccountListHelp + cscbufferNewLine
		Let sTemp_s = QWMsg_AccountListHelp + cscbufferNewLine
	endif
	let sTemp_L = AddToString (sTemp_l, QWMsgHelp14_L)
	let sTemp_S = AddToString (sTemp_s, QWMsgHelp14_s)
	if DataSheetHasHeaders() then
		let sTemp_L = AddToString(sTemp_L,formatString(QWMsgHelp15_L, datasheetHeadersGet()))
		let sTemp_S = AddToString(sTemp_S,formatString(QWMsgHelp15_S, datasheetHeadersGet()))
	endIf
	if getWindowTop(hFocus)==getWindowBottom(hFocus) then
		let sTemp_L = AddToString(sTemp_L,QWMsgHelp16_L)
		let sTemp_S = AddToString(sTemp_S,QWMsgHelp16_S)
	else
		let sTemp_L = AddToString(sTemp_L,QWMsgHelp17_L)
		let sTemp_S = AddToString(sTemp_S,QWMsgHelp17_S)
	endIf
	let sTemp_L = AddToString(sTemp_L, QWMsgHelp28_L)
	let sTemp_S = AddToString(sTemp_S, QWMsgHelp28_S)
	let sTemp_L = AddToString(sTemp_L, QWMsgHelp18_L)
	let sTemp_S = AddToString(sTemp_S, QWMsgHelp18_S)
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotKeyLinks ()
elif sClass==wc_report then
	SayFormattedMessage (ot_USER_BUFFER, QWMsgHelp19_L, QWMsgHelp19_S)
	AddHotKeyLinks ()
elif sClass==wc_ie5Class || sClass==wc_shellDocObjectView || sClass==wc_shellEmbedding then
	let sTemp_L = QWMsgHelp20_L + cScBufferNewLine + RetrNumOfObjects() + QWMsgHelp21_L
	let sTemp_S = QWMsgHelp20_S + cScBufferNewLine + RetrNumOfObjects() + QWMsgHelp21_S
	SayFormattedMessage (ot_USER_BUFFER, sTemp_L, sTemp_S)
	AddHotKeyLinks ()
	Return
elif stringContains(sRealName,wn_planning) then
	SayFormattedMessage (ot_USER_BUFFER, QWMsgHelp22_L, QWMsgHelp22_S)
	AddHotKeyLinks ()
	Delay (10)
	SetFocus (hFocus)
	Return
else
	performScript screenSensitiveHelp() ; default
endIf
EndScript

Script hotkeyHelp ()
var
	string sClass,
	string sRealName
if TouchNavigationHotKeys() then
	return
endIf
let sClass=getWindowClass(getFocus())
let sRealName=getWindowName(getRealWindow(getFocus()))
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if (sRealName == wn_InvestingCenter) then
	SayFormattedMessage (ot_USER_BUFFER, msgInvestingCenterHotKeyHelp1, msgInvestingCenterHotKeyHelp1)
elif (StringContains (sRealName, scAnalyze)) then
	SayFormattedMessage (ot_USER_BUFFER, msgBudgetAnalyzeHotKeyHelp1, msgBudgetAnalyzeHotKeyHelp1)
Elif sClass==wc_ie5Class || sClass==wc_shellDocObjectView || sClass==wc_shellEmbedding then
	virtualHotkeyHelp()
	return
elif (IsMonthlyBudgetSummary ()) then
	SayFormattedMessage (ot_USER_BUFFER, msgMBSHotKeyHelp, msgMBSHotKeyHelp)
elif (IsMonthlyBudgetDetails ()) then
	SayFormattedMessage (ot_USER_BUFFER, msgMBDHotKeyHelp, msgMBDHotKeyHelp)
elif (isCalculator ()) then
	SayFormattedMessage (ot_USER_BUFFER, msgCalculatorHotkeyHelp_L, msgCalculatorHotkeyHelp_S)
elif stringContains(sRealName,wn_planning) then
	SayFormattedMessage (ot_USER_BUFFER, QWMsgHelp23_L, QWMsgHelp23_S)
elif isSplitTransactionWindow() then
	SayFormattedMessage (ot_USER_BUFFER, QWMsgHelp24_L, QWMsgHelp24_S)
elif isTransactionRegisterScreen() || isAssetLiabilityRegisterScreen() || isInvestmentRegisterScreen() then
	SayFormattedMessage (ot_USER_BUFFER, QWMsgHelp25_L, QWMsgHelp25_S)
elif isQHIActive() && not dialogActive() then
	SayFormattedMessage (ot_USER_BUFFER, QWMsgHelp26_L, QWMsgHelp26_S)
elif not dialogActive() && not menusActive() then
	SayFormattedMessage (ot_USER_BUFFER, QWMsgHelp27_L, QWMsgHelp27_S)
else
	performScript hotkeyHelp() ; default
endIf
Delay(1)
Refresh()
EndScript

Script tabKey ()
var
	handle h,
	handle hNull


; adjust suppressions
let giSuppressColumnTitles=false ; ensure column titles get spoken when tabbing
let giSuppressRowNumbers=true ; don't want to repeat row numbers when tabbing
let giFocusChangeTriggered=false
let giSuppressHighlightInQREdit=true
; Watch for places in the Quicken Guided setup where focus gets trapped.
tabKey()
Pause()
if not giFocusChangeTriggered then
	if (isDataSheet ()) then
		Let h = GetFocus()
		if (APlaceWeGetStuck (h)) then
			; The tab key does not operate here, make it do so.
			; Schedule a function which will be canceled by focus changed event.
			; if it is allowed to execute, it will place focus in a good place.
			SpeechOff()  ; stop chatter
			Let QWTabkeyFID = ScheduleFunction ("SchedFocusOnNextStep", 2)
			return
		endif
	endif
	if (EditCurrentPaycheck (GetFocus(), hNull)) then
		return
	endif
	sayFocusedWindow()
endIf
EndScript

Script shiftTabKey ()
var
	handle h,
	handle hNull

; adjust suppressions
let giSuppressColumnTitles=false ; ensure column titles get spoken when tabbing
let giSuppressRowNumbers=true ; don't want to repeat row numbers when tabbing
let giFocusChangeTriggered=false
let giSuppressHighlightInQREdit=true
; Watch for places in the Quicken Guided setup where focus gets trapped.
Let h = GetFocus()
if (   (GetWindowName (GetRealWindow (h)) == wn_QuickenHome)
		&& (GetWindowName (h) == wn_Message)) then
	; shift tab from here lands on a calendar button from which there is no escape.
	; we don't need to be there, so just prevent it for now.
	SayUsingVoice (VCTX_MESSAGE, msgShiftTabStuck, OT_STRING)
	return
endif

shiftTabKey()
Delay(2)
if not giFocusChangeTriggered then
	if (isDataSheet ()) then
		Let h = GetFocus()
		if (APlaceWeGetStuck (h)) then
			; The shift+tab key does not operate here,
			SayUsingVoice (VCTX_MESSAGE, msgShiftTabStuck, OT_STRING)
		endif
	endif
;	if (EditCurrentPaycheck (GetFocus(), hNull)) then
;		return
;	endif
	sayFocusedWindow()
endIf
EndScript

Void Function hlBalancesSay ()
saveCursor()
invisibleCursor()
if findString(getRealWindow(getFocus()),scBalance,s_bottom,s_unrestricted) then
sayLine()
	nextLine()
	nextLine()
	sayLine()
	nextLine()
	sayLine()
endIf
restoreCursor()
EndFunction



Function SayToEdgeOfWindow ()
var
	int r

Let r = GetWindowRight (GetRealWindow (GetFocus()))
Say (GetTextBetween (GetCursorcol(), r), OT_STRING)
return
EndFunction

Void Function DefaultBalanceSay ()
saveCursor()
invisibleCursor()
if findString(getRealWindow(getFocus()),scTotal,s_bottom,s_unrestricted) then
	sayFromCursor()
elif findString(getRealWindow(getFocus()),scCurrentBalance,s_bottom,s_unrestricted) then
	sayFromCursor()
elif findString(getRealWindow(getFocus()),scEndingBalance,s_bottom,s_unrestricted) then
	sayToEdgeOfWindow()
elif findString(getRealWindow(getFocus()),scOpeningBalance,s_bottom,s_unrestricted) then
	sayFromCursor()
endIf
if (FindString (GetRealWindow (GetFocus ()), scOnlineBalance, S_BOTTOM, S_UNRESTRICTED)) then
	SayFromCursor()
endif
restoreCursor()
EndFunction


Function splitTransactionWindowBalancesSay ()
var
handle hCurrent,
int iControlId

let hCurrent=getRealWindow(getFocus())
let hCurrent=getFirstChild(hCurrent)
while  hCurrent
	let iControlId=getControlId(hCurrent)
	if iControlId==cId_splitTotalLabel || IControlId==cId_splitTotalAmount ||
		iControlId==cId_remainderLabel || iControlId==cId_remainderAmount ||
		iControlId==cId_transactionTotalLabel || iControlId==cId_transactionTotalAmount then
		sayWindow(hCurrent,read_everything)
	endIf
	let hCurrent=getNextWindow(hCurrent)
endWhile
EndFunction


Function reconcileBalanceSay ()
var
handle hCurrent,
int iControlId

let hCurrent=getRealWindow(getFocus())
let hCurrent=getFirstChild(hCurrent)
while  hCurrent
	let iControlId=getControlId(hCurrent)
	if iControlId >=cId_recBalancesStart && iControlId <=cId_recBalancesEnd then
		sayWindow(hCurrent,read_everything)
	endIf
	let hCurrent=getNextWindow(hCurrent)
endWhile
EndFunction

Function refinanceInfoSay ()
var
handle hReal,
handle hCurrent,
string sClass
let hReal=getRealWindow(getFocus())
if not stringContains(getWindowName(hReal),wn_refinanceCalculator) then
	return
endIf
sayWindow(findDescendantWindow(hReal,cId_reFinance1),read_everything)
sayWindow(findDescendantWindow(hReal,cId_reFinance2),read_everything)
sayWindow(findDescendantWindow(hReal,cId_reFinance3),read_everything)
sayWindow(findDescendantWindow(hReal,cId_reFinance4),read_everything)
sayWindow(findDescendantWindow(hReal,cId_reFinance5),read_everything)
sayWindow(findDescendantWindow(hReal,cId_reFinance6),read_everything)
sayWindow(findDescendantWindow(hReal,cId_reFinance7),read_everything)
sayWindow(findDescendantWindow(hReal,cId_reFinance8),read_everything)
EndFunction


Function loanCalculatorInfoSpeak ()
var
handle hReal,
handle hCalculatedAmount,
handle hLoanAmount

let hReal=getRealWindow(getFocus())
let hCalculatedAmount=FindDescendantWindow (hReal, cId_loanCalculatedAmount)
let hLoanAmount=findDescendantWindow(hReal,cId_loanAmount)

if hCalculatedAmount then
	if not isWindowVisible(hLoanAmount) then
		say(getWindowText(findDescendantWindow(hReal,cId_loanAmtPrompt),read_everything),ot_control_name)
	else
		say(getWindowText(findDescendantWindow(hReal,cId_loanPaymentPerPeriodPrompt),read_everything),ot_control_name)
	endIf
	say(getWindowText(hCalculatedAmount,read_everything),ot_no_disable)
endIf
EndFunction


Void Function savingsCalculatorInfoSpeak ()
var
handle hReal,
handle hCalculatedAmount,
handle hSavingsOpeningBalance,
handle hSavingsContribution

let hReal=getRealWindow(getFocus())
let hCalculatedAmount=FindDescendantWindow (hReal, cId_savingsCalculatedAmount)
let hSavingsOpeningBalance=findDescendantWindow(hReal,cId_savingsOpeningBalance)
let hSavingsContribution=findDescendantWindow(hReal,cId_savingsContribution)

if hCalculatedAmount then
	if not isWindowVisible(hSavingsOpeningBalance) then
		say(getWindowText(findDescendantWindow(hReal,cId_savingsOpeningBalancePrompt),read_everything),ot_control_name)
	elif not isWindowVisible(hSavingsContribution) then
		say(getWindowText(findDescendantWindow(hReal,cId_savingsContributionPrompt1),read_everything),ot_control_name)
		say(getWindowText(findDescendantWindow(hReal,cId_savingsContributionPrompt2),read_everything),ot_control_name)
	else
		say(getWindowText(findDescendantWindow(hReal,cId_savingsEndingBalancePrompt),read_everything),ot_control_name)
	endIf
	say(getWindowText(hCalculatedAmount,read_everything),ot_no_disable)
endIf
EndFunction


Function collegeCalculatorInfoSpeak ()
var
handle hReal,
handle hCalculatedAmount,
handle hCollegeAnnualCost,
handle hCollegeAnnualContribution

let hReal=getRealWindow(getFocus())
let hCalculatedAmount=FindDescendantWindow (hReal, cId_collegeCalculatedAmount)
let hCollegeAnnualCost=findDescendantWindow(hReal,cId_collegeAnnualCost)
let hCollegeAnnualContribution=findDescendantWindow(hReal,cId_collegeAnnualContribution)

if hCalculatedAmount then
	if not isWindowVisible(hCollegeAnnualCost) then
		say(getWindowText(findDescendantWindow(hReal,cId_collegeAnnualCostPrompt),read_everything),ot_control_name)
	elif not isWindowVisible(hCollegeAnnualContribution) then
		say(getWindowText(findDescendantWindow(hReal,cId_collegeAnnualContributionPrompt),read_everything),ot_control_name)
	else
		say(getWindowText(findDescendantWindow(hReal,cId_collegeCurrentSavingsPrompt),read_everything),ot_control_name)
	endIf
	say(getWindowText(hCalculatedAmount,read_everything),ot_no_disable)
endIf
EndFunction


Function retirementCalculatorInfoSpeak ()
var
handle hReal,
handle hCalculatedAmount,
handle hRetirementAnnualIncome,
handle hRetirementAnnualContribution

let hReal=getRealWindow(getFocus())
let hCalculatedAmount=FindDescendantWindow (hReal, cId_retirementCalculatedAmount)
let hRetirementAnnualIncome=findDescendantWindow(hReal,cId_retirementAnnualIncome)
let hRetirementAnnualContribution=findDescendantWindow(hReal,cId_retirementAnnualContribution)

if hCalculatedAmount then
	if not isWindowVisible(hRetirementAnnualIncome) then
		say(getWindowText(findDescendantWindow(hReal,cId_retirementAnnualIncomePrompt),read_everything),ot_control_name)
	elif not isWindowVisible(hRetirementAnnualContribution) then
		say(getWindowText(findDescendantWindow(hReal,cId_retirementAnnualContributionPrompt),read_everything),ot_control_name)
	else
		say(getWindowText(findDescendantWindow(hReal,cId_retirementCurrentSavingsPrompt),read_everything),ot_control_name)
	endIf
	say(getWindowText(hCalculatedAmount,read_everything),ot_no_disable)
endIf
EndFunction

script balancesSay ()
var
handle hReal,
string sRealName
let hReal=getRealWindow(getFocus())
let sRealName=getWindowName(hReal)
if isLoanView() then
	hlBalancesSay()
elif isSplitTransactionWindow() then
	SplitTransactionWindowBalancesSay()
elif isCalculator() then
	calculatorDisplayRead()
elif stringContains(sRealName,wn_reconcile) then
	reconcileBalanceSay()
elif stringContains(sRealName,wn_loanCalculator) then
	loanCalculatorInfoSpeak()
elif stringContains(sRealName,wn_refinanceCalculator) then
	RefinanceInfoSay()
elif stringContains(sRealName,wn_savingsCalculator) then
	savingsCalculatorInfoSpeak()
elif stringContains(sRealName,wn_collegeCalculator) then
	collegeCalculatorInfoSpeak()
elif stringContains(sRealName,wn_retirementCalculator) then
	retirementCalculatorInfoSpeak()
else ; use the default balance say function
	defaultBalanceSay()
endIf
EndScript


Function SayWord ()
var
	handle hFocus

if (MonthlyBudgetSummary (0)) then
	return
endif

Let hFocus = GetCurrentWindow()
if (GetWindowClass (hFocus) == "QREdit") then
	Say (GetWord (), OT_NO_DISABLE)
else
	SayWord()
endif
EndFunction

Script sayWindowPromptAndText ()
var
	handle hWnd,
	int iSubType,
	int iSpecialCase,
	handle hNull,
	int nMode
Let iSpecialCase = 0
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
; reset all suppressions to ensure column title and row numbers are spoken in grids such as split transaction window
let giSuppressColumnTitles=false
let giSuppressRowNumbers=false
if (EditCurrentPaycheck  (hwnd, hNull)) then
	Say (GetWindowName (GetRealWindow (hwnd)), OT_DIALOG_NAME)
	Let iSpecialCase = 1
endif
if (iSpecialCase == 0) then
	; speak it generically since it doesn't require special handling
	sayFocusedWindow()
endif
SayTutorialHelp (iSubType, TRUE)
SayTutorialHelpHotKey (hWnd, TRUE)
IndicateComputerBraille (hwnd)
smmToggleTrainingMode(nMode)

EndScript

Script windowKeysHelp ()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (ot_USER_BUFFER, msgWKeysHelp1_L, msgWKeysHelp1_S)
UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
EndScript

Script windowPrior ()
SayFormattedMessage (ot_JAWS_message, QWMsgPriorWindow1_L)
typeCurrentScriptKey()
EndScript


Script windowNext ()
SayFormattedMessage (ot_JAWS_message, QWMsgNextWindow1_L)
typeCurrentScriptKey()
EndScript


Script windowMyFinances ()
SayFormattedMessage (ot_JAWS_message, QWMsgMyFinances1_L)
typeCurrentScriptKey()
EndScript


int Function isAddressBook ()
if stringContains(getWindowName(getRealWindow(getFocus())),wn_addressBook) then
	return true
else
	return false
endIf
EndFunction

int Function isCalculator ()
var
	handle hReal

Let hReal = GetRealWindow (GetCurrentWindow ())
return (   (GetWindowName (hReal) == wn_calculator)
	&& (getWindowClass (hReal) == wc_calculator))
EndFunction

Void Function calculatorDisplayRead ()
if isCalculator() then
	saveCursor()
	invisibleCursor()
	routeInvisibleToPc()
	nextLine()
	sayLine()
	restoreCursor()
endIf
EndFunction


Int Function ClickCalculatorControl (int id, string HelpMessage)
var
	handle hReal,
	handle hwnd

Let hReal = GetRealWindow (GetCurrentWindow ())
if (GetWindowName (hReal) == wn_calculator) then
	Let hwnd = FindDescendantWindow (hReal, id)
	if (hwnd) then
		SaveCursor()
		JAWSCursor()
		SaveCursor()
		MoveToWindow (hwnd)
		LeftMouseButton()
		RestoreCursor()
		RestoreCursor()
		Say (HelpMessage, OT_NO_DISABLE)
		return (1)
	endif
endif
return (0)
EndFunction

Script CalcDisplayResult ()
if (IsCalculator ()) then
	calculatorDisplayRead ()
else
	TypeCurrentScriptKey ()
endif
EndScript


Script CalcStoreMemory ()
if (isCalculator ()) then
	ClickCalculatorControl (117, msgStoreMemory)
else
	TypeCurrentScriptKey ()
endif
EndScript


Script CalcRecallMemory ()
if (isCalculator ()) then
	ClickCalculatorControl (118, msgRecallMemory)
else
	TypeCurrentScriptKey ()
endif
EndScript


Script CalcClearMemory ()
if (isCalculator ()) then
	ClickCalculatorControl (119, msgClearMemory)
else
	TypeCurrentScriptKey ()
endif
EndScript


Script CalcClearDisplay ()
if (isCalculator ()) then
	ClickCalculatorControl (123, msgClearDisplay)
else
	TypeCurrentScriptKey ()
endif
EndScript


Script CalcClearEntry ()
if (isCalculator ()) then
	ClickCalculatorControl (124, msgClearEntry)
else
	TypeCurrentScriptKey ()
endif
EndScript


Script CopySelectedTextToClipboard ()
if !(GetRunningFSProducts() & product_JAWS) then
	SayCurrentScriptKeyLabel()
	return
endIf
if isCalculator() then
	if !WillOverwriteClipboard() then
		return
	EndIf
	ClickCalculatorControl (120, msgCalcCopyToClipboard)
else
	PerformScript CopySelectedTextToClipboard()
endif
EndScript

Script CalcPercent ()
if (isCalculator ()) then
	ClickCalculatorControl (116, msgCalcPercent)
	Pause()
	SayFrame ("CalculatorResult")
else
	TypeCurrentScriptKey ()
endif
EndScript



int Function SayNumOfObjects ()
var
	int iBool, ; return true or false
	object doc,
	object window,
	object forms,
	object frames,
	int nFrames,
	int nForms,
	int nLinks,
	string sFrameNum,
	string sLinkNum,
	string sFormNum,
	string szPageName,
	string strBuffer,
	string strTemp
let doc = ieGetCurrentDocument ()
let window = doc.parentWindow
if !doc then
	return
endIf
	let frames = window.frames
	let nFrames = frames.length
	let nLinks = GetLinkCount ()
	let forms = doc.forms
	let nForms = forms.length
if window then
	let strTemp = window.name
	if (strTemp == cscNull) then
		let strTemp = window.location.href
	endIf
endIf
sayFormattedMessage(ot_help, formatString(msgIEHTMLHelp1_L, intToString(nLinks), intToString(nFrames), intToString(nForms), strTemp), formatString(msgIEHTMLHelp1_S, intToString(nLinks), intToString(nFrames), intToString(nForms), strTemp))
EndFunction

Function selectALinkQWHTML ()
var
string sLinkName,
string sLinkList,
int iChoice,
int iOldPixels,
int iButtonChosen,
handle hWnd
if InHJDialog () then
	SayFormattedMessage (OT_error, cMsg337_L, cMsg337_S)
	return
endIf
let iOldPixels=getJCFOption(opt_pixels_per_space)
setJCFOption(opt_pixels_per_space,8) ; set to something valid so chunsc are correctly obtained
let hWnd=getRealWindow(getFocus())
saveCursor()
invisibleCursor()
moveToWindow(hWnd)
delay(1)
while findNextAttribute(attrib_underline) && stringLength(getChunk()) > 0
	if getWindowClass(getCurrentWindow())==wc_QWHTMLView then
		let sLinkName=getChunk()
		let sLinkList=sLinkList+list_item_separator+sLinkName
	endIf
endWhile
;remove leading delimiter
let sLinkList=stringChopLeft(sLinkList,1)
restoreCursor()
setJCFOption(opt_pixels_per_space, iOldPixels)
if stringLength(sLinkList) ==0 then
	SayFormattedMessage (ot_error, QWMsgNoLinks1_L)
	return
endIf
let iButtonChosen=DlgSelectControls (sLinkList, iChoice, QWMsgSelectALink1_L, bt_moveTo|bt_leftSingleClick, bt_leftSingleClick)
if iButtonChosen==idcancel then
	return
endIf
delay(2)
refreshWindow(hwnd)
JAWSCursor()
if findString(hWnd,stringSegment(sLinkList,list_item_separator,iChoice),s_top,s_unrestricted) then
	sayCurrentLink()
	if iButtonChosen==id_leftSingleClick then
	leftMouseButton()
	pcCursor()
	endIf
else
	pcCursor()
	SayFormattedMessage (ot_error, QWMsgNotFound1_L)
endIf
EndFunction

int function SelectALinkDialog()
Var
	int iActivatedVCursor
if InHJDialog () then
	SayFormattedMessage (OT_error, cMsg337_L, cMsg337_S)
	return true
endIf
If (IsHJTrackEngine ()) Then
	If (GetJCFOption (OPT_VIRTUAL_PC_CURSOR) == 0) Then
		SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 1)
		let iActivatedVCursor = 1
		Pause ()
		Delay (5)
	endIf
endIf
If (!IsVirtualPcCursor ()) then
	SelectALinkQWHTML ()
	if (iActivatedVCursor) Then
		SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
	endIf
	Return true
endIf
if (!DlgListOfLinks()) then
	SayFormattedMessage (ot_error, msgNoLinks1_L )
endIf
if (iActivatedVCursor) Then
	Delay (5)
	SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
endIf
return true
EndFunction

int Function ieFocusToFirstField ()
var
	object doc,
	object all,
	object forms,
	int nIdx,
	object element,
	string theType
let doc = ieGetCurrentDocument()
if (!doc) then
	return FALSE
endIf
let forms = doc.forms
if (forms.length <= 0 ) then
	return FALSE
endIf
let nIdx = forms(0).SourceIndex()
let all = doc.all
while (nIdx < all.length)
	let element = all(nIdx)
	let TheType = element.type
	if (TheType != cscNull &&
		TheType != scHidden) then
		element.focus
		return TRUE
	endIf
	let nIdx = nIdx+1
endWhile
return FALSE
EndFunction

Script FocusToFirstField ()
let giSuppressEcho = TRUE
if (ieFocusToFirstField()) then
	ProcessNewText()
else
	SayFormattedMessage (ot_error, msgFieldNotFound1_L)
endIf
let giSuppressEcho = FALSE
EndScript

Void Function VirtualHotKeyHelp ()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (OT_USER_BUFFER, msgVPCHelp1_L, msgVPCHelp1_S)
EndFunction

Script readWordInContext ()
if isSplitTransactionWindow() then
	splitTransactionWindowLocationSay()
elif isInvestmentRegisterScreen() then
	investmentRegisterFieldName (1)
	SayFormattedMessage (ot_help, formatString(QWMsgTransaction1_L, intToString(transactionCountFromTopGet())))
elif isTransactionRegisterScreen() then
	TransactionRegisterFieldLabel (1,0,0,0)
	SayFormattedMessage (ot_help, formatString(QWMsgTransaction1_L, intToString(transactionCountFromTopGet())))
elif isAssetLiabilityRegisterScreen() then
	assetLiabilityRegisterFieldName (1)
	SayFormattedMessage (ot_help, formatString(QWMsgTransaction1_L, intToString(transactionCountFromTopGet())))
else
	performScript readWordInContext()
endIf
EndScript


Function sayCurrentLink ()
if GetWindowClass(getCurrentWindow())==wc_QWHTMLView && getCharacterAttributes() & attrib_underline then
	sayField()
	sayUsingVoice(vctx_message, cVMsgLink1_L,ot_JAWS_message)
endIf
EndFunction

Void Function MouseMovedEvent (int x, int y)
; this is here to ensure that linnks get announced when the JAWS cursor
;is used to navigate an HTML window
if getWindowClass(getCurrentWindow())==wc_QWHTMLView then
	if getCharacterAttributes() & attrib_underline then
		if not giInLink then
			sayUsingVoice(vctx_message,cVMsgLink1_L,ot_JAWS_message)
		endIf
		let giInLink=true
	else
	if giInLink then
		sayUsingVoice(vctx_message,QWMsgOutOfLink1,ot_JAWS_message)
	endIf
		let giInLink=false
	endIf
endIf
MouseMovedEvent(x, y)
EndFunction


Script enter ()
if isJAWSCursor() && getWindowClass(getCurrentWindow())==wc_QWHTMLView then
	if getCharacterAttributes() & attrib_underline then
; located on a link
		leftMouseButton()
		pcCursor()
	else
; not located on a link
		SayFormattedMessage(ot_error,QWMSGNotOnALink1_L, QWMSGNotOnALink1_S)
	endIf
elif (isCalculator ()) then
	; Watch for enter key in the calculator, and speak result.
	EnterKey()
	Pause()
	calculatorDisplayRead ()
elif (IsMonthlyBudgetSummary ()) then
	MonthlyBudgetDetails()
else  ; not a special case
	performScript Enter() ; default
endIf
EndScript

Script selectTab ()
var
	int iChoice,
	int iOldPixels,
	int firstTabX,
	int firstTabY,
	string sTabList,
	string sTabName,
	int tabToClickFound,
	handle hCurrent
if InHJDialog () then
	SayFormattedMessage (OT_error, cMsg337_L, cMsg337_S)
	return
endIf
; locate the toolbar window
let hCurrent=getFirstChild(getAppMainWindow(getFocus()))
while hCurrent && getWindowClass(hCurrent)!=wc_QWNavigator
	let hCurrent=getNextWindow(hCurrent)
endWhile
if getWindowClass(hCurrent)!=wc_QWNavigator then
	SayFormattedMessage(ot_error,QWMsgTabToolbarNotFound1_L, QWMsgTabToolbarNotFound1_S)
	return
endIf
; Now, we Put the tabs into a list for a select menu.
; But, in Q2003, the main toolbar is embedded in the QWNavigator
; in front of the line with the tabs. So, we will search past the main toolbar (if it is there)
; until we get to text in the QWNavigator window.
; Then, each tab is a separate chunk of text in the QWNavigator window.
; We take all chunks except the first one.
let iOldPixels=getJCFOption(opt_pixels_per_space)
setJCFOption(opt_pixels_per_space,8) ; set to something valid so chunsc are correctly obtained
saveCursor()
invisibleCursor()
if moveToWindow(hCurrent) then
	; test to see if main toolbar is in the way
	nextCharacter()
	if getWindowClass( getCurrentWindow()) == wc_MainToolbar then
		while getWindowClass(getCurrentWindow())!=wc_QWNavigator && not isKeyWaiting()
			nextChunk()
		endWhile
		JAWSHome ()
		nextChunk()
	endIf ; main toolbar was in the way
	let firstTabX = GetCursorCol ()
	let firstTabY = getCursorRow()
	while getWindowClass(getCurrentWindow())==wc_QWNavigator && not isKeyWaiting()
		let sTabList=sTabList+list_item_separator+getChunk()
		nextChunk()
	endWhile
	;remove leading delimiter
	; MCK: sometimes there is more than one so loop until done
	while SubString (sTabList, 1, 1) == list_item_separator
		let sTabList=stringChopLeft(sTabList,1)
	endWhile ; sTabList needs to be chopped
endIf ; move to QWNavigator window was successful
restoreCursor()
setJCFOption(opt_pixels_per_space,iOldPixels)
if StringLength (sTabList) < 2 then
 	SayFormattedMessage(ot_error,QWMsgTabToolbarNotFound1_L, QWMsgTabToolbarNotFound1_S)
	return
endIf; leave if no tabs were found
let iChoice=DlgSelectItemInList (sTabList, QWMsgSelectATab1_L, false)
if iChoice then
	saveCursor()
	JAWSCursor()
	if moveTo(firstTabX, firstTabY) then
		let sTabName=stringSegment(sTabList,list_item_separator,iChoice)
		; MCK: The findString function in JAWS 4.51 is not working reliably.
		; So we will locate the correct tab the same way we found the tabs.
		let tabToClickFound = false;
		while not tabToClickFound && getWindowClass(getCurrentWindow())==wc_QWNavigator && not isKeyWaiting()
			if sTabName == getChunk() then
				let tabToClickFound = true
			else
				nextChunk()
			endIf ; sTabName = current chunk
		endWhile ; looking for chunk in QWNavigator that equals selected tab
		if tabToClickFound then
			leftMouseButton()
		else
			pcCursor()
			SayFormattedMessage(ot_error,sTabName+QWMsgTabNotFound1_L, sTabName+QWMsgTabNotFound1_S)
		endIf ; tab to clikc was found
	endIf ; JAWSCursor was able to move to QWNavigator window
	restoreCursor()
endIf ; User made a choice in select menu
EndScript

Script OpenListBox ()
var
int iControlId
let iControlId=getControlId(getFocus())
if isSplitTransactionWindow() && isPcCursor() then
		TypeKey (ks1)
		SayFormattedMessage (ot_JAWS_message, cmsg41_L, cMsgSilent) ;open list box
elif isWriteChecksView() && iControlId==cId_WCPayee || iControlId==cId_WCCategory then
		TypeKey (ks1)
		delay(1)
	if isEditComboActive() then
		SayFormattedMessage (ot_JAWS_message, cmsg42_L, cMsgSilent) ; open list box
	else
		SayFormattedMessage (ot_JAWS_message, cmsg41_L, cMsgSilent) ; close list box
	endIf
else
	performScript openListbox() ; default
endIf
endScript

script closeListbox()
var
int iControlId
let iControlId=getControlId(getFocus())
if isSplitTransactionWindow() && isPcCursor() then
		TypeKey (ks2)
		SayFormattedMessage (ot_JAWS_message, cmsg42_L, cMsgSilent) ;open list box
elif isWriteChecksView() && iControlId==cId_WCPayee || iControlId==cId_WCCategory then
; alt down opens and closes these listboxes
		TypeKey (ks1)
		delay(1)
	if isEditComboActive() then
		SayFormattedMessage (ot_JAWS_message, cmsg42_L, cMsgSilent) ; open list box
	else
		SayFormattedMessage (ot_JAWS_message, cmsg41_L, cMsgSilent) ; close list box
	endIf
else
	performScript closeListbox() ; default
endIf
endScript

; control+f4 override
Script CloseDocumentWindow ()
var
	handle hReal,
	handle hParent,
	string name


Let hReal = GetRealWindow (GetCurrentWindow ())
Let hParent = GetParent (hReal)
; this key should not close quicken itself.
let name = GetWindowName (hReal)
if (   (name != wn_QuickenHome)
		&& (hParent)) then
	SaveCursor()
	JAWSCursor()
	SaveCursor()
	if (FindGraphic (hReal, wn_CloseSymbol, S_TOP, S_UNRESTRICTED)) then
		; hard to believe we have to do  this, but JAWS is finding close symbols
		; outside the hReal window.
		if (GetWindowAtPoint (GetCursorCol(), GetCursorCol()) == hReal) then
			SayFormattedMessage (OT_NO_DISABLE, FormatString (msgClosing, name))
			LeftMouseButton()
			pause()
			Refresh ()
		endif
	else
		PerformScript CloseDocumentWindow()
	endif
	RestoreCursor()
	RestoreCursor()
else
	PerformScript CloseDocumentWindow()
endif
EndScript

int Function doesListContainButton ()
var
handle list
let list=getFirstWindow(getForegroundWindow())
while list
	if getWindowClass(list)==wc_1 && isWindowVisible(list) then
		let list=getFirstChild(list)
		if getWindowClass(list)==wc_editComboList && isWindowVisible(list) && not isWindowObscured(list) &&
	getWindowTypeCode(getNextWindow(list))==wt_button && isWindowVisible(getNextWindow(list)) then
			return true
		endIf
	endIf
	let list=getNextWindow(list)
endWhile
return false
EndFunction

int Function isEditComboActive ()
var
handle list
let list=getFirstWindow(getForegroundWindow())
while list
	if getWindowClass(list)==wc_1 && isWindowVisible(list) then
		let list=getFirstChild(list)
		if getWindowClass(list)==wc_editComboList && isWindowVisible(list) && not isWindowObscured(list) then
			return true
		endIf
	endIf
	let list=getNextWindow(list)
endWhile
return false
EndFunction


Int Function InvestingCenterExpandCollapse (string sGraphicName)
var
	handle hFocus,
	int iGraphicID


Let hFocus = GetFocus()
if (isDataSheet ()) then
	if (GetWindowName (GetRealWindow (hFocus)) == wn_InvestingCenter) then
		; Expanding an account in the portfolio
		SaveCursor()
		JAWSCursor()
		SaveCursor()
		RouteJAWSToPC()
		PriorWord()
		Let iGraphicID = GetGraphicID()
		if (iGraphicID != 0) then
			; we are on a graphic
			If (   (GetWord() == sGraphicName)
				|| (GetWord() == gn_Security)) then
				LeftMouseButton()
				; these refreshes take a while, let the user know we are working on it.
				if (iGraphicID == -1931256644) then
					PlaySound ( FindJAWSSoundFile ("qw_open1.wav") )
				elif (iGraphicID == 1684640047) then
					PlaySound ( FindJAWSSoundFile ("qw_close1.wav") )
				else
					PlaySound ( FindJAWSSoundFile ("qw_click1.wav") )
				endif
				Delay(2)
				RefreshWindow (hFocus)
				Delay(2)
				SayLine()
				return (1)
			endif
		endif
		RestoreCursor()
		RestoreCursor()
		return
	endif
endif ; is data sheet
return (0)
EndFunction


script sayNextCharacter()

if (   (NormalAppCursor () == 0)
	|| (IsVirtualPCCursor ())) then
	performScript sayNextCharacter() ; default
	return
endif

if (MonthlyBudgetSummary (2)) then
	return
endif

if (InvestingCenterExpandCollapse (gn_Collapsed)) then
	return
endif

if isPcCursor() && getWindowClass(getFocus())==wc_QREdit && giNotEditCombo && not menusActive() then
	nextCharacter()
	sayCharacter()
	sayWindow(getFocus(),read_highlighted)
else
	performScript sayNextCharacter() ; default
endIf
EndScript

script sayPriorCharacter()


if (   (NormalAppCursor () == 0)
	|| (IsVirtualPCCursor ())) then
	performScript sayPriorCharacter() ; default
	return
endif

if (MonthlyBudgetSummary (1)) then
	return
endif

if (InvestingCenterExpandCollapse (gn_Expanded)) then
	return
endif

if isPcCursor() && getWindowClass(getFocus())==wc_QREdit && giNotEditCombo && not menusActive() then
	priorCharacter()
	sayCharacter()
	sayWindow(getFocus(),read_highlighted)
else
	performScript sayPriorCharacter() ; default
endIf
endScript


Script TransactionBalanceSay ()
var
	int l,
	int iWinTop,
	int iRow,
	int iWinRight,
	handle h,
	string s

if (   (NormalAppCursor () == 0)
	|| (IsVirtualPCCursor ())) then
	PerformScript SayFromCursor()
	return
endif

Let h = GetFocus()

if (isTransactionRegisterScreen ()) then
	; this key means say balance as of this item
	SaveCursor()
	InvisibleCursor()
	RouteInvisibleToPC()
	if (IsSecondLineOfTransaction ()) then
		PriorLine()
	endif
	Let iWinRight = GetWindowRight (GetParent (h))
	Let s = GetTextBetween (iWinRight-120, iWinRight)
	Let l = StringLength (s)
	if (l > 4) then
		Let s = SubString (s, 1, l-3) + "." + SubString (s, l-1, 2)
		Say (s, OT_NO_DISABLE)
	else
		Say (msgBalanceNotfound, OT_ERROR)
	endif
	RestoreCursor()
else
	PerformScript SayFromCursor()
endif
EndScript

int Function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	int bStopProcessing
let bStopProcessing = PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
if !bStopProcessing then
	; This following line ensures that autocompletion is read in the register edit combos when alphanumeric keys are pressed
	; the tab/shift tab scripts, sayPrior/NextLine and the sayHighlightedText functions set this flag to true to avoid other
	;highlights being read in the QREdit controls which cause double speaking and other verbose chatter.
	let giSuppressHighlightInQREdit=false
	if (QWMonitorAccountList == 1) then
		Let QWMonitorAccountList = 2;  speak when focus point moves
	endif
EndIf
return bStopProcessing
EndFunction

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	string RealName
if KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	Let QWInhibitYesNoPrompts = 0
	if getObjectSubtypeCode()==wt_multiSelect_listbox then
		Let RealName = getWindowName (GetRealWindow (GetCurrentWindow ()))
		if stringContains (RealName, wn_reconcile)
		|| StringContains (RealName, scStatementSummary)
		|| stringContains (RealName, wn_ChooseCategories) then
			delay(3)
			; say the newly selected transaction and its state
			sayLine()
			return true
		endIf
	endIf
endIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if (nKey == KeyCode_enter) then
	Let QWInhibitYesNoPrompts = 0
endif
ProcessKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function ScreenStabilizedEvent(handle hwndLastScreenWrite)
if (QWMonitorAccountList == 2) then
	if (GetWindowClass (hwndLastScreenWrite) == "ListBox") then
		SayLine()
		Let QWMonitorAccountList = 1
	endif
endif
endFunction



Function loanScheduleEntrySpeak ()
var
string sHeaders,
string sData,
string sPrompt,
string sValue,
int iIndex,
int iCount

saveCursor()
invisibleCursor()
if moveToWindow(getParent(getFocus())) then
	let sHeaders=getTextBetween(getWindowLeft(getCurrentWindow()),getWindowRight(getCurrentWindow()))
endIf
pcCursor()
let sData=getLine()
if stringContains(sData,loanScheduleFirstEntryIndicator) then
	say(stringSegment(sHeaders,loanScheduleDelim,loanScheduleInterestColumn),ot_control_name)
	say(stringSegment(sData,loanScheduleDelim,1),ot_no_disable) ; this first entry  doesn't follow standard pattern
	say(stringSegment(sHeaders,loanScheduleDelim,loanScheduleBalanceColumn),ot_control_name)
	say(stringSegment(sData,loanScheduleDelim,2),ot_no_disable) ; this first entry  doesn't follow standard pattern
	return
endIf

let iIndex=1
let iCount=loanScheduleFieldCount ; four fields in each list entry
while iIndex <=iCount
	let sPrompt=stringSegment(sHeaders,loanScheduleDelim,iIndex)
	let sValue=stringSegment(sData,loanScheduleDelim,iIndex)
	say(sPrompt,ot_control_name)
	say(sValue,ot_no_disable)
	let iIndex=iIndex+1
endWhile
restoreCursor()
EndFunction

string Function retrNumOfObjects ()
var
	int iBool, ; return true or false
	object doc,
	object window,
	object forms,
	object frames,
	int nFrames,
	int nForms,
	int nLinks,
	string sFrameNum,
	string sLinkNum,
	string sFormNum,
	string szPageName,
	string strBuffer,
	string strTemp
let doc = ieGetCurrentDocument ()
let window = doc.parentWindow
if !doc then
	return
endIf
	let frames = window.frames
	let nFrames = frames.length
	let nLinks = GetLinkCount ()
	let forms = doc.forms
	let nForms = forms.length
if window then
	let strTemp = window.name
	if (strTemp == cscNull) then
		let strTemp = window.location.href
	endIf
endIf
 return formatString(msgIEHTMLHelp1_L, intToString(nLinks), intToString(nFrames), intToString(nForms), strTemp)

EndFunction

string Function AddToString(String Base, String strNew)
let Base = Base + strNew + cScBufferNewLine
Return Base
EndFunction

/*
int Function brailleBuildLine ()
var
	string buffer,
	string checkedUnchecked,
	int iWindowType,
	int iCol,
	int iRow,
	int iAttrib,
	handle hwnd,
	int iOldPixels

; note that gsAlternativeBrailleRepresentation will only ever be true in the folowing situations:
;1. when JAWS doesn't find prompts correctly
;2. in Register screens or custom datasheets
if gsAlternativeBrailleRepresentation !=cscNull then
	let hwnd=getCurrentWindow()
; this next test will only be true in certain dialogs where radiobutton or checkbox prompts are not found by JAWS
	let iWindowType=getWindowTypeCode(hwnd)
	if ControlCanBeChecked () && (iWindowType==wt_checkbox || iWindowType==wt_radioButton) then
; need to Braille the rest of the dlg verbage:
; note that dlgs for which this alternative route will be required are all simple dialogs
		let Buffer = GetWindowName (getRealWindow(hwnd)) ; title of the dialog box
		if GetJcfOption (OPT_BRL_Verbosity)==0  then
 			if (buffer != cscNull) then ; there is a title
 				BrailleAddString(buffer + cscSpace+cmsg229_L,0,0,0)
 			endIf
 			let buffer = GetDialogStaticText()
 			if (buffer != cscNull) then ; there is static text in dialog
 				BrailleAddString(buffer + cscSpace,0,0,0)
			endIf
		endIf
		brailleAddString(gsAlternativeBrailleRepresentation,getCursorCol(),getCursorRow(),getCharacterAttributes())
		if (ControlIsChecked ()) then
			let CheckedUnchecked = cMsgBrailleChecked1_L
		else
			let CheckedUnchecked = cMsgBrailleUnChecked1_L
		endIf
		let iCol=getCursorCol()
		let iRow=getCursorRow()
		let iAttrib=getCharacterAttributes()
		BrailleAddString(checkedUnchecked,iCol,iRow,iAttrib)
		brailleAddString(getControlName(),iCol,iRow,iAttrib)
		brailleAddString(getWindowType(hwnd),iCol,iRow,iAttrib)
		return true
	endIf
	brailleAddString(gsAlternativeBrailleRepresentation,getCursorCol(),getCursorRow(),getCharacterAttributes())
	brailleAddFocusItem()
	if giNotEditCombo then
		BrailleAddString(cVMsgEdit1_L,0,0,0)
	else
		BrailleAddString(getWindowType(getFocus()),0,0,0)
	endIf
	return true
elif isDataSheet() then
	brailleAddString(datasheetPromptGet(),0,0,0)
	brailleAddString(QWMsgDataSheet1_L,0,0,0)
	if getWindowTop(globalFocusWindow)==getWindowBottom(globalFocusWindow) then
		BrailleAddString(QWMsgDataSheetEmpty1_L,0,0,0)
	else
		; ensure line is compressed
		let iOldPixels=getJCFOption(opt_pixels_per_space)
		setJCFOption(opt_pixels_per_space,999) ;unlimited pixels per space
		BrailleAddFocusLine ()
		setJCFOption(opt_pixels_per_space,iOldPixels) ; restore original value
	endIf
	return true
else
	return BrailleBuildLine() ; default
endIf
EndFunction
*/

; JAWS 4.0 braille functions follow

int function BrailleCallbackObjectIdentify()
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
if isDataSheet() && IsPCCursor() then
	return 	WT_CUSTOM_CONTROL_BASE+Custom_WT_DataSheet
else
	return WT_UNKNOWN
EndIf
EndFunction

int function BrailleAddObjectDataSheetName(int nType)
brailleAddString(QWMsgDataSheet1_L,0,0,0)
return true
EndFunction

int function BrailleAddObjectDataSheetHdr(int nType)
brailleAddString(datasheetPromptGet(),0,0,0)
return true
EndFunction

int function BrailleAddObjectDataSheetInfo(int nType)
if getWindowTop(globalFocusWindow)==getWindowBottom(globalFocusWindow) then
	BrailleAddString(QWMsgDataSheetEmpty1_L,0,0,0)
else
	BrailleAddFocusLine ()
endIf
return true
EndFunction

int function BrailleAddObjectDataSheetPosition(int nSubtypeCode)
BrailleAddString(PositionInGroup(),0,0,0)
return true
EndFunction





String Function ListNameGet ()
var
	handle hList,
	handle hwnd,
	string s


Let hList = GetFocus()
if (GetWindowClass (hList) != "ListBox") then
	Let hList = GetParent (hList)
endif
if (GetWindowClass (hList) == "ListBox") then
	Let hList = GetParent (hList)
	let hwnd = GetNextWindow (hList)
	if (hwnd) then
		if (GetWindowClass (hwnd) == "QC_button") then
			Return (GetWindowName (hwnd))
		endif
	endif
	Let hList = GetParent (hList)
	Let hwnd = GetPriorWindow (hList)
	if (hwnd) then
		if (GetWindowClass (hwnd) == "Static") then
			SaveCursor()
			InvisibleCursor()
			MoveToWindow (hwnd)
			Let s = GetLine()
			RestoreCursor()
			return (s)
		endif
	endif
endif


return ("")
EndFunction

int function BrailleAddObjectName(int nSubtypeCode)
var
	handle hwnd,
	string buffer
if IsTouchCursor() then
	return BrailleAddObjectName(nSubtypeCode)
endIf
if gsAlternativeBrailleRepresentation ==cscNull then
	return false
	EndIf
	; this next test will only be true in certain dialogs where radiobutton or checkbox prompts are not found by JAWS
	if ControlCanBeChecked () && (nSubtypeCode==wt_checkbox || nSubtypeCode==wt_radioButton) then
		brailleAddString(gsAlternativeBrailleRepresentation,getCursorCol(),getCursorRow(),getCharacterAttributes())
		EndIf
	return false
EndFunction

Script VirtualizeRealWindow ()
; this is an enhanced version of the default script, and is thus assigned to a different hot key.
; its a different baby, so the default version is still available on the control+insert+w key.
; this comeds out of WindowNavigator.jss
VirtualizeRealWindow()  ; from the linked binary
EndScript




Script DataSheetListControls ()
var
	handle h,
	handle hFocus,
	string ToolNames,
	string XCoordinants,
	string yCoordinants,
	int x,
	int y,
	int selection

Let hFocus = GetFocus()
Let h = hFocus
if (isDataSheet () == 0) then
	; this isn't a data sheet, but are we a child of a data sheet?
	let h = GetParent(h)
	if (   (getWindowClass (h) != wc_ListBox)
		|| (getWindowClass(getParent(h)) != wc_QWListViewer)) then
		Say (msgNotInADataSheet, OT_NO_DISABLE)
		return
	endif  ; parent isn't a data sheet either
endif

SaveCursor()
InvisibleCursor()
MoveToWindow (h)
SetRestriction (RestrictWindow)
; loop until the cursor stops moving
Let x = 0
Let y = 0
while (   (x != GetCursorCol())
	|| (y != GetCursorRow()))
	Let x = GetCursorCol()
	Let y = GetCursorRow()
;	if (  (GetColorBackground() == RGBStringToColor ("243229215"))
;		&& (GetColorText() == RGBStringToColor ("000000000"))) then
	if (   (GetColorAtPoint (x, y) == 0)
		&& (GetColorAtPoint (x-2, y) == 15199215)) then
		; this is a control identified by it's color.
		Let ToolNames = ToolNames + GetWord() + "|"
		Let XCoordinants = XCoordinants + IntToString (GetCursorCol()) + "|"
		Let YCoordinants = YCoordinants + IntToString (GetCursorRow()) + "|"
	endif
	NextWord()
EndWhile
if (StringLength (ToolNames) >0) then
	Let ToolNames = ToolNames + msgToolsListAbandon
	Let XCoordinants = XCoordinants + "000"
	Let YCoordinants = YCoordinants + "000"
	Let selection = DlgSelectItemInList (ToolNames, "List Controls", false)
	if (selection > 0) then
		Let x = StringToInt (StringSegment (XCoordinants, "|", selection))
		Let y = StringToInt (StringSegment (YCoordinants, "|", selection))
		if (   (x != 0)
			&& (y != 0)) then
			; got good coordinants,  let's do it.
			JAWSCursor()
			MoveTo (x, y)
			; make sure that the expected word appears here.
			Let x = 0
			While (   (GetWord() != StringSegment (ToolNames, "|", selection))
				&& (x < 20))
				; wait up to 2 seconds for that to reappear after the HJ dialog
				Delay(1)
				Let x = x+1
			EndWhile
			if (x < 20) then
				LeftMouseButton()
			else
				Say (msgControlNameFailedToReappear, OT_NO_DISABLE)
			endif
			SetRestriction (RestrictAppWindow)
			RestoreCursor()
			return
		endif ; good coordinants
	endif ; selection > 0
	; nothing was chosen, but focus will probably have moved, so put it back where it was
	Delay(10)
	SetFocus (hFocus)
	SetRestriction (RestrictAppWindow)
	RestoreCursor()
	return
else
	Say (msgNoControlsFound, OT_NO_DISABLE)
endif
SetRestriction (RestrictAppWindow)
RestoreCursor()
EndScript

Script SaySentence ()

; for the Bar Graphs in the Budget Analyze screen.
if (IsJAWSCursor()) then
	if (StringContains (GetWindowName (GetRealWindow (GetCurrentWindow ())), scAnalyze)) then
		; this is the Analyze window, part of budget setup.
		; in this situation, this keystroke causes the bar graphs to speak their value.
		if (StringContains (scMonths, GetWord())) then
			; We are positioned on a month name
;			SaveCursor()
			Let QWSaveCursorRow = GetCursorRow()
			Let QWSaveCursorCol = GetCursorCol()
			Let QWWatchForNewText = 2 ; notify SayNonHighlightedText function
			; position the mouse relative to the current month name.
			; Putting the mouse here causes new text to appear.
			MoveTo (GetCursorCol()+3, GetCursorRow()-11)
			LeftMouseButton()
			; Schedule a monitor in case text does not appear.
			ScheduleFunction ("BudgetAnalyzeMonitor", 5)
			; SayNonHighlighted Text will restore the cursor.
			return
		endif  ; a month we recognize
	endif  ; the budget analyze window
endif ; the JAWS cursor

; default behavior
PerformScript SaySentence()
EndScript


Script ButtonsFind1 ()
ListButtonsHelper (0)
EndScript


Script Buttonsfind2 ()
ListButtonsHelper (1)
EndScript


Script ButtonsFind3 ()
ListButtonsHelper (2)
EndScript


Script ButtonsFind4 ()
ListButtonsHelper (3)
EndScript


; Following is a series of functions used to summarize entries in the transaction registry.
; The technique used, is to analyze the title bar, and to figure out the boundaries of the region containing the text for
; each item in the title bar.
; The first time these functions run on a registry, no data is known about the field boundaries.
; The scripts will tab through each field, looking at the title for the field with focus.
; if this is a title the user wants, as indicated from the JSI file, the field is spoken.
; since this technique is too slow for normal use, the boundaries of the window that moves when the tab key is pressed,
; are recorded in a data structure, along with the name of that field.
; Subsequent uses will simply get the text in that boundary based on the data structure.
; The data is cleared when the real window changes title.
Function QWRClearData ()
	Let QWRFieldRow = "|"
Let QWRFieldLeft = "|"
Let QWRFieldRight = "|"
; Field count is high by one because of the leading vertical bar delimiter
Let QWRFieldCount = 1 ; because everybody starts with a vertical bar
Let QWRFieldNames = "|"
Let QWRDesiredFields = "|"
EndFunction


Void Function RegistryRecordWindow (handle hwnd, string FieldName)
var
	int offset

; is this a new field to us?
if (StringContains (QWRFieldNames, FieldName) == 0) then
	; a field we have not learned yet
	if (FieldName == "Payment") then
		Let offset = 8
	else
		Let offset = 0
	endif

	if (IsSecondLineOfTransaction ()) then
		Let QWRFieldRow = QWRFieldRow + "2|"
	else
		Let QWRFieldRow = QWRFieldRow + "1|"
	endif
	Let QWRFieldLeft = QWRFieldLeft + IntToString(GetWindowLeft (hwnd)) + "|"
	Let QWRFieldRight = QWRFieldRight + IntToString(GetWindowRight (hwnd) + offset) + "|"
	Let QWRFieldNames = QWRFieldNames + FieldName + "|"
	Let QWRDesiredFields = QWRDesiredFields + FieldName + "|"
	Let QWRFieldCount = QWRFieldCount+1
endif  ; a new field
EndFunction


Function RegistrySpeakDesiredFields ()
var
	int y,
	int i,
	int j,
	int safe1,
	int l,
	int r,
	int t,
	int Row,
	int b,
	int lineHeight,
	int offset,
	string FieldName,
	string dListEntry,
	string s,
	string sTitle,
	string sDesired

; find out what fields are listed for the current transaction
Let sTitle = MDITitleTextGet ()
let lineHeight = GetLineBottom () - GetLineTop ()
Let b = GetCursorRow()+ (lineHeight/2)
Let t = GetCursorRow()-(lineHeight/2)

; scan through the desired list of fields.  For each entry, make sure it
; appears on the title bar.  If it does, then find it in the names list, and get it's coordinants.
Let i = 2
Let sDesired = StringSegment (QWRDesiredFields, "|", i)
Let safe1 = 0
; for each desired field
While (   (StringLength (sDesired) > 1)
	&& (safe1 < 20))
	; Does this desired field appear in the title bar?
	if (StringContains (sTitle, sDesired)) then
		; it is in the title bar, so find it in the field names list.
		Let j = 2
		while (j <= QWRFieldCount)
			if (StringSegment (QWRFieldNames, "|", j) == sDesired) then
				; we found it, get its coordinants and speak the name and value
				Let l = StringToInt (StringSegment (QWRFieldLeft, "|", j))
				Let r = StringToInt (StringSegment (QWRFieldRight, "|", j))
				Let row = StringToInt (StringSegment (QWRFieldRow, "|", j))
				Let FieldName = StringSegment (QWRFieldNames, "|", j)
				if (row == 2) then
					let offset = lineHeight + (lineHeight/4)
				else
					Let offset = 0
				endif
				;let s = GetTextInRect (l, t+offset, r, b+offset, 0, IgnoreColor, IgnoreColor, 0)
				let s = qwrGetFieldNearestBoundaries (l, t+offset, r, b+offset)
				if (s != FieldName) then
					if (StringLength (s) > 0) then
						if (QWRSpeakFieldLabels) then
							; look up title substitutions, so they make sense
							Let dListEntry = MakeDelimitedList (fieldName, "", 0)
							Let fieldName = IniReadString ("Field Labels", dListEntry, fieldName, "qw.jsi")
							SayUsingVoice (VCTX_MESSAGE, FieldName, OT_STRING)
						endif ; speak field labels is on
						Say (s, OT_STRING) ; say contents of field
					endif ; field contents has length > 0
				endif ; field contents does not equal field lable
				Let j = 100  ; forxt loop exit
			endif ; we found it in the names list
			Let j = j+1
		EndWhile
	endif ; desired label is in the title bar
	Let i = i+1
	Let sDesired = StringSegment (QWRDesiredFields, "|", i)
	Let safe1 = safe1 + 1
EndWhile
EndFunction


Function QWRRegistryLearnFields ()
var
	int safe,
	handle hFocus,
	string FieldName,
	string SoundPath

Let SoundPath = FindJAWSSoundFile ("qw_scanreg1.wav")


SayUsingVoice (VCTX_MESSAGE, msgLearningTheRegistry, OT_STRING)
; turn speech off so JAWS doesn't jabber while we do this
SpeechOff()
Let hFocus = GetFocus()
Let safe = 10

; make sure we start at the left most field.
While (   (GetWindowClass (hFocus) != "QC_button")
	&& (safe > 0))
	TypeKey ("Shift+tab")
	Pause()
	Let hFocus = GetFocus()
	Let safe = safe-1
EndWhile
if (safe == 0) then
	SpeechOn()
	Say ("QC button was not found", OT_STRING)
	return
endif
PlaySound (SoundPath)
; gotta build the field boundaries
TypeKey ("tab")
Pause()
Let hFocus = GetFocus()
Let FieldName = TransactionRegisterFieldLabel (0, 0, 0, 0)
RegistryRecordWindow (hFocus, FieldName)
TypeKey ("tab")
Pause()
Let hFocus = GetFocus()
Let safe = 10
; now tab through the fields forward, collecting field names and boundary information.
While (   (GetWindowClass (hFocus) == "QREdit")
	&& (safe > 0))
	Let FieldName = TransactionRegisterFieldLabel (0, 0, 0, 0)
	if (StringContains (QWRFieldNames, FieldName) == 0) then
		; A field not yet discovered
		RegistryRecordWindow (hFocus, FieldName)
	endif
	TypeKey ("tab")
	PlaySound (SoundPath)
	Pause()
	Let hFocus = GetFocus()
	Let safe = safe-1
EndWhile

; now, shift tab backward, because some fields do not appear when tabbing forward.
; pick up only fields which hav not already been detected.
TypeKey ("Shift+tab")
Let safe = 10
Pause()
Let hFocus = GetFocus()
While (   (GetWindowClass (hFocus) == "QREdit")
	&& (safe > 0))
	Let FieldName = TransactionRegisterFieldLabel (0, 0, 0, 0)
	if (StringContains (QWRFieldNames, FieldName) == 0) then
		; A field not yet discovered
		RegistryRecordWindow (hFocus, fieldName)
		SpeechOff()
	Endif
	TypeKey ("shift+tab")
	PlaySound (SoundPath)
	Pause()
	Let hFocus = GetFocus()
	Let safe = safe-1
EndWhile

; put focus back on the first field.
TypeKey ("tab")
Pause()

; now we need to write these results to the JSI file.

IniWriteString (QWRRegistryName, "FieldNames", QWRFieldNames, "qw.jsi")
IniWriteString (QWRRegistryName, "FieldRow", QWRFieldRow, "qw.jsi")
IniWriteString (QWRRegistryName, "FieldLeft", QWRFieldLeft, "qw.jsi")
IniWriteString (QWRRegistryName, "FieldRight", QWRFieldRight, "qw.jsi")
IniWriteInteger (QWRRegistryName, "FieldCount", QWRFieldCount, "qw.jsi")
IniWriteString (QWRRegistryName, "DesiredFields", QWRDesiredFields, "qw.jsi")
SpeechOn()
EndFunction

Int Function isQWRFieldDelimiter (string  ch)
var int answer
let answer = 0
if StringIsBlank (ch) then
	if ch != " " then
		let answer = 1
	endIf
endIf
return (answer)
EndFunction

String Function qwrGetField ()
var
	int speechWasOff,
	int currentRow,
	int currentCol,
	String ch,
	String s ; return value
let s = " " ; set equal to one space to work around bug in string concatination when strings are integers.
; We will chop that space later.
; Bug description: if var c1 has type string and var c2 has types string,
; and c1 == "1" and c2 == "1" then c1 + c2 yields "2" instead of "11".
let speechWasOff = IsSpeechOff ()
SpeechOff ()
let currentRow = GetCursorRow ()
let currentCol = GetCursorCol ()
SaveCursor ()
InvisibleCursor ()
MoveTo (currentCol, currentRow)
; Find the left edge of the field
let ch = getCharacter()
while (not isQWRFieldDelimiter (ch))
	PriorCharacter ()
	let ch = GetCharacter ()
endWhile
; if cursor was not already on a delimiter, it is now.
; now add characters to s until we land on a delimitter.
NextCharacter ()
let ch = GetCharacter ()
while (not isQWRFieldDelimiter (ch))
	let s = s + ch
	NextCharacter ()
	let ch = GetCharacter ()
endWhile
restoreCursor()
if speechWasOff then
	SpeechOn ()
endIf
return( stringChopLeft (s, 1))
EndFunction

String Function qwrGetFieldNearestBoundaries (int l, int t, int r, int b)
var
	int speechWasOff,
	int currentRow,
	int currentCol,
	String s
let s = ""
let speechWasOff = IsSpeechOff ()
SpeechOff ()
SaveCursor ()
InvisibleCursor ()
; Move to left of bounded area and see if we are in a field.
MoveTo (l, ((b+t)/2))
if isQWRFieldDelimiter (getCharacter()) then ; we are not in a field
	; So move cursor to next word and see if cursor stays in boundaries
	NextWord ()
	let currentRow = GetCursorRow ()
	let currentCol = GetCursorCol ()
	if currentRow < t || currentRow > b || currentCol < l || currentCol > r then ; we left boundaries
		let s = ""
	else ; we found a field that starts in the boundaries
		let s = qwrGetField ()
	endIf
else ; we started out in a field so grab it
	let s = qwrGetField ()
endIf
RestoreCursor ()
if not speechWasOff then
	SpeechOn ()
endIf
return( s)
EndFunction

Void Function RegistryLineSummarize (int init)
var
	string s,
	string sRealName

if (isTransactionRegisterScreen () == 0) then
	SpeechOn()
	Say (msgNotInARegistry, OT_STRING)
	return
endif

; make sure we got the goods on this particular registry
Let sRealName = GetWindowName (GetRealWindow (GetFocus ()))
if (   (sRealName == QWRRegistryName)
		&& (init == 0)) then
	; we already have the coordinants loaded.
	RegistrySpeakDesiredFields()
	return
else   ; this registry's data is not loaded, do we have it?
	Let QWRRegistryName = sRealName
	Let s = IniReadString (QWRRegistryName, "FieldNames", "$$$", "qw.jsi")
	; if the names returned dollar signs, this is an unknown registry, and must be learned from scratch
	if (s == "$$$") then
		; this registry is unknown
		; So, we need to learn the boundaries of the fields.
		QWRClearData ()
		QWRRegistryLearnFields ()
		RegistrySpeakDesiredFields()
	else
		; we have an entry for this, so load it.
		Let QWRFieldNames = s
		Let QWRFieldRow = IniReadString (QWRRegistryName, "FieldRow", "0|", "qw.jsi")
		Let QWRFieldLeft = IniReadString (QWRRegistryName, "FieldLeft", "0|", "qw.jsi")
		Let QWRFieldRight = IniReadString (QWRRegistryName, "FieldRight", "0|", "qw.jsi")
		Let QWRDesiredFields = IniReadString (QWRRegistryName, "DesiredFields", "|", "qw.jsi")
		Let QWRFieldCount = IniReadInteger (QWRRegistryName, "FieldCount", 0, "qw.jsi")

		if (init) then
			; need to add fields in this entry, to our list of fields
				QWRRegistryLearnFields ()
		endif
		RegistrySpeakDesiredFields()
	endif
endif
EndFunction


Script RegPageUpSummarize ()
SpeechOff()
TypeKey ("PageUp")
Pause()
SpeechOn()
RegistryLineSummarize (0)
EndScript


Script RegPageDownSummarize ()
SpeechOff()
TypeKey ("PageDown")
Pause()
SpeechOn()
RegistryLineSummarize (0)
EndScript

Script RegCurrentItemSummarize ()

; the following causes a relearn if this key is double clicked
; this addes fields in the current transaction to the data we have for this registry
RegistryLineSummarize (IsSameScript ())
EndScript

Script RegPriorEntrySummarize ()
SpeechOff()
TypeKey ("UpArrow")
Pause()
SpeechOn()
RegistryLineSummarize (0)
; the above function turns speech back on
EndScript


Script RegNextEntrySummarize ()
SpeechOff()
TypeKey ("DownArrow")
Pause()
SpeechOn()
RegistryLineSummarize (0)
; the above function turns speech back on
EndScript


String Function MDITitleTextGet ()
var
	int row1,
	int row2,
	int l,
	int r,
	handle grip,
	string s

Let grip = GetParent (GetFocus ())
MDITitleRowCount (grip, row1, row2)
Let l = GetWindowLeft (grip)
Let r = GetWindowRight (grip)
Let s = GetTextInRect (l, row1-8, r, row1+8, 0, IgnoreColor, IgnoreColor, 0)
if (row2 > 0) then
	Let s = s + GetTextInRect (l, row2-8, r, row2+8, 0, IgnoreColor, IgnoreColor, 0)
endif
RETURN (S)
EndFunction




; following is test code only
globals
	handle HRGrip,
	handle HRJAWSMarkerHandle
Script test2 ()
var
	string s
; RegistryLineSummarize()
; SayInteger (QWRFieldCount)
Let s = QWRDesiredFields + "\r\n"
Let s=s+QWRFieldNames + "\r\n"
Let s=s+QWRFieldRow + "\r\n"
Let s=s+QWRFieldLeft + "\r\n"
Let s=s+QWRFieldRight + "\r\n"
CopyToClipboard (s)
EndScript







; *** end of test code

void Function sayLine (optional int HighlightTracking, optional int bSayingLineAfterMovement)
var
	handle hCurrent,
	handle hNull,
	string sText,
	string sWindowType,
	string sWindowName,
	string sWindowHighlightedText,
	handle hList

; suspend monitoring of the accounts list if it is active.
; keeps the account from being spoken twice when arrowing up and down
if (QWMonitorAccountList == 2) then
	; speech was requested, but we are taking care of it here
	Let QWMonitorAccountList = 1
endif
if (   (NormalAppCursor () == 0)
|| (IsVirtualPCCursor ())) then
	SayLine (HighlightTracking,bSayingLineAfterMovement)
	return
endif
if (SummarizeDataSheetLine (hNull)) then
	return
endif
Let QWLastStaticText = ""  ; let description field be spoken
if (SpeakStaticPrompts (GetFocus(), hNull, 1)) then
	return
endif
if isPcCursor() && isEditComboActive() then
	let hList=editComboListHandleGet()
	let sWindowHighlightedText=getWindowText(hList,read_highlighted)
	if sWindowHighlightedText!=cscNull then
		say(sWindowHighlightedText,ot_no_disable)
		if sWindowHighlightedText!=scNextCheckNum then
			return ; otherwise want to read the next actual check number as well
		endIf
	endIf
endIf
let hCurrent=getCurrentWindow()
if getWindowClass(hCurrent)==wc_qrEdit ||
(isWriteChecksView() && getWindowClass(getCurrentWindow())==wc_edit) then
	let sWindowType=getWindowType(hCurrent)
	; needs special attention so extra graphics and other irrelevant information is not spoken outside the field.
	; also, for some reason the window type is returned as part of the string returned from getTextBetween
	; we need to strip this.
	let sText=getTextBetween(getWindowLeft(hCurrent),getWindowRight(hCurrent))
	if stringContains(sText,sWindowType) then
		let sText=stringLeft(sText,stringLength(sText)-stringLength(sWindowType))
	endIf
	if (sText==cscNull) || (sText==cscSpace && stringLength(sText)==1) then
		SayFormattedMessage (ot_no_disable, cmsgBlank1)
	else
		say(sText,ot_no_disable)
	endIf
elif getWindowTypeCode(hCurrent)==wt_listBox then
	let sWindowName=getWindowName(getRealWindow(hCurrent))
	if (sWindowName == wn_ScheduledTransactionList) then
		SayLine(HighlightTracking,bSayingLineAfterMovement)
		return
	endif
	if stringContains(sWindowName,wn_Schedule) then
		loanScheduleEntrySpeak()
		return
	elif (   (stringContains(sWindowName,wn_Reconcile))
	|| (StringContains (sWindowName, scStatementSummary))
	|| (stringContains(sWindowName,wn_ChooseCategories))) then
		; we need to do this so that JFW doesn't say not selected for each item in the list.
		if getObjectValue()!=cscNull then
			Let sText = getTextBetween(getWindowLeft(hCurrent),getWindowRight(hCurrent))
			if (StringContains (GetObjectValue(), "Not Selected")) then
				SayUsingVoice (VCTX_PCCURSOR, sText, OT_STRING)
			else
				; Dcide whether to say "checked" or not.
				if (QWCheckedStatusVerbosity) then
					Let sText = msgChecked + ", " + sText
				endif
				SayUsingVoice (VCTX_MESSAGE, sText, OT_STRING)
			endif
		else ; listbox doesn't contain any entries
			SayFormattedMessage(Ot_no_disable, QWMsgZeroItems1_L, QWMsgZeroItems1_S)
		endIf
		return
	endIf
	sayLine(HighlightTracking,bSayingLineAfterMovement)
else
	sayLine(HighlightTracking,bSayingLineAfterMovement)
endIf

EndFunction


;skurapati - start

Int Function SpeakFieldHeaderAndValue (handle hFocus, handle parentWindow)

var
   handle h,
	string fValue,
	string fHeader,
	int iOldPixels,
  int x,
  int line

		SaveCursor()
		InvisibleCursor()
		RouteInvisibleToPC()   
    Let line = GetCursorRow()
		; ensure pixels per space is set to a valid value
		let iOldPixels=getJCFOption(opt_pixels_per_space)
		setJCFOption(opt_pixels_per_space,8)
			
   if (giSuppressColumnTitles == false) then
		  MoveToWindow (parentWindow)				 
			Let x = GetWindowLeft (hFocus)
			MoveTo (x, GetCursorRow())
			NextWord()
	Let fHeader = GetChunk()
   endif  ; not suppressing collumn titles

   if (StringLength (fHeader) > 0) then
		SayString(fHeader)				 
   endif
		 
   Let x = GetCursorCol()  ; title x
   MoveTo (x+10, line)		 
   Let fValue = GetChunk()	 

   if (StringLength (fValue) > 0) then
   		SayString(fValue)
		RestoreCursor()
		PCCursor()   
   else
		RestoreCursor()
		PCCursor()   	
		Let fValue = GetChunk()
   		SayString(fValue)
   endif
		
   setJCFOption(opt_pixels_per_space, iOldPixels) 	   
return(0)
EndFunction

Function FocusPointMovedEvent(handle FocusWindow, handle PrevWindow)
var	 
   handle hFocus,
   handle h 
   
  if (IsItAccountRegisterScreen()) then
         Let hFocus = GetFocus()  
         Let h = GetParent (hFocus)	 
         SpeakFieldHeaderAndValue(hFocus,h)
  endif

EndFunction

Int Function IsItAccountRegisterScreen()

var	 
   handle hFocus,
   handle h,
   string class  
 
Let hFocus = GetFocus()
Let class = GetWindowClass (hFocus)
 
if (class == "QREdit") then
   Let h = GetParent (hFocus)
   if (GetWindowClass (h) == "QWClass_TransactionList") then
               return(1)
   endif
endif

return(0)
EndFunction

Script SpeakQuickenListRowData ()

var
Handle h

Let h = IsEditInsideDataSheet (GetFocus())
SummarizeDataSheetLine(h)

EndScript

;skurapati - end

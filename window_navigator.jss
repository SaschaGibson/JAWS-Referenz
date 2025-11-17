; functions to virtualize the real window in the virtual viewer.
; Written by: Jim Snowbarger, December 2002.
; To use this service, include a "use virtualize_real_window.jsb" statement in your script file.
; then call function VirtualizeRrealWindow from a script.

include "HJConst.jsh"
include "common.jsm"
include "window_navigator.jsm"


globals
	string QWStack

; This set of stack functions is used when recursively searching levels of the hierarchy for buttons.
; This is designed for saving handles, and converts them to strings before storing them.
; The stack is a vertical bar delimited series of strings.
Function InitializeStack ()
Let QWStack = "|"
EndFunction

Void Function PushAhandle (handle NewHandle)
var
	string strIn

Let strIn = IntToString (NewHandle) + "|"
Let QWStack = QWStack + strIn
EndFunction


HANDLE Function PopAhandle ()
var
	handle hNull,
	int i,
	int l,
	string s

Let l = StringLength (QWStack) 
if (l > 2) then
	; there is an item to return
	; find the previous vertical bar
	Let i = l-1
	while ((SubString (QWStack, i, 1) != "|") && (i > 0))
		Let i = i-1
	endWhile
	if (i > 0) then
		; now i points to the vertical bar prior to the last string
		Let s = substring (QWStack, i+1, (l-i)-1)
		Let QWStack = Substring (QWStack, 1, i)
		return (StringToHandle (s))
	else
		InitializeStack ()
		return (hNull)
	endif
else
	return (hNull)
endif
EndFunction


Function ClickLocation (int x, int y)
UserBufferDeactivate()
Pause()
SaveCursor()
JAWSCursor()
SaveCursor()
MoveTo (x, y)
LeftMouseButton()
RestoreCursor()
RestoreCursor()
EndFunction


Function FocusOnWindow (string sGrip)
var
	handle hGrip

Let hGrip = StringToHandle (sGrip)
if (hGrip) then
	UserBufferDeactivate()
	Pause()
	SetFocus (hGrip)
endif
EndFunction

String Function GetTopLineOfWindow (handle h)
var
	string s,
	int iRestriction,
	int i,
	int l


SaveCursor()
InvisibleCursor()
MoveToWindow (h)
let iRestriction = GetRestriction ()
SetRestriction (restrictWindow)
Let s = GetLine()
SetRestriction (iRestriction)
RestoreCursor()
Let s = StringTrimLeadingBlanks (s)
Let s = StringTrimTrailingBlanks (s)
if (StringLength (s) == 0) then
	Let s = "$UnNamed"
endif
; trim off some of the text JAWS adds
Let l = StringLength (s)
if (l > 16) then
	if (SubString (s, 1, 15) == "quarter circle ") then
		Let s = SubString (s, 16, l-16)
	endif
endif
if (l > 7) then
	if (SubString (s, 1, 7) == "bullet ") then
		Let s = SubString (s, 8, l-8)
	endif
endif
if (l > 18) then
	if (SubString (s, l-17, 18) == "Scroll Down symbol") then
		Let i = l-19
		; Scan backward looking for the end  of spaces, then remove the scroll down symbol
		while (   (i > 1)
				&& (SubString (s, i, 1) == " "))
			Let i = i-1
		EndWhile
		Let s = SubString (s, 1, i)
	endif
endif
Let s = s + "|"
return (s)
EndFunction

String Function GetALine (string sText, int ByRef start)
var
	string out,
	string ch,
	int l,
	int found

Let l = StringLength (sText)
Let out = ""
while (   (start <= l)
	&& (found == 0))
	Let ch = SubString (sText, start, 1)
	if (ch == "\n") then
		; found a real line break
		Let found = 1
	else
		Let out = out + ch
	endif
	Let start = start+1
EndWhile
return (out)
EndFunction


; call this function from a script.
VOID Function VirtualizeRealWindow ()
var
	handle hReal,
	handle h,
	handle hNext,
	handle hChild,
	handle hcurrent,
	int iOldPixels,
	string LinkName,
	string FuncName,
	string s,
	string sItem,
	string class,
	string name,
	string sTemp,
	int WindowCount,
	string sText,
	string sLocators,
	string sHandles, ; a list of handles in string format
	string sX, ; a series of x coordinants in string format
	string sY, ; y coordinants in string format 
	int t,
	int start,
	int b,
	int r,
	int l,
	int x,
	int y,
	int i

; The theory of operation of this script is to traverse the hierarchy of children of the real window,
; building a data base of windows which could be clicked, or which might be given focus.
; We capture the top line of text in each such window as a locator.  If it is a button or other clickable item, such as 
; any button or tool bar button,
; we save the cursor coordinants, but a null handle.
; if it is a window that might be given focus, like edit combo or listbox, we save the handle,  but 0 for the coordinants.
; then, we capture the full text of the real window, and analyze it line by line.
; for each line, we scan the locators to see of they turn up in that line.
; For each locator that appears in that line, we create a link in the user buffer 
; If the handle was saved, but no coordinants, then place focus on the item. 
; or, if no handle is saved, but coordinants are saved, the link will do a left mouse click on that item.
; the method for exploring the hierarchy is similar to that used in function ListButtonsHelper, and makes use
; of a stack to recursively search the levels.

If UserBufferIsActive () then
	Say ("not possible while the user buffer is active", OT_NO_DISABLE)
	return
EndIf
; SayString ("working")
Let sX = "|"
Let sY = "|"
Let sHandles = "|"
Let sLocators = "|"
Let WindowCount = 0

; Say ("Virtual Window", OT_NO_DISABLE)
UserBufferClear()
Let hReal = GetRealWindow (GetCurrentWindow ())
Let h = GetFirstChild (hReal)
if (h) then
	InitializeStack ()  ; a place to save handles as we dive down
	Let i = 0
	while ((h)  && (i < 100))
		Let name = GetWindowName (h)
		Let s = GetWindowTextEx (h, 0, 0)
		Let Class = StringUpper (GetWindowClass (h))
		if (StringContains (class, "BUTTON")) then
			; maybe a clickable item
			if (   (not IsWindowDisabled (h))
					&& (not IsWindowObscured (h))
					&& (GetControlID (h) != -1)  ; these are just labels
					&& (IsWindowVisible (h))) then
				Let x = (GetWindowLeft(h) + GetWindowRight(h))/2
				Let y = (GetWindowTop(h) + GetWindowBottom(h))/2
				Let sX = sX + IntToString (x) + "|"
				Let sY = sY + IntToString (Y) + "|"
				Let sHandles = sHandles + "000|"  ; no handle
				Let sLocators = sLocators + GetTopLineOfWindow (h)  
				Let WindowCount = WindowCount+1
			endif  ; control visible etc.
		elif (   (StringContains (class, "EDIT")) 
			|| (StringContains (class, "LISTBOX"))
			|| (StringContains (class, "COMBO"))) then 
			; a place where we might place focus
			if (   (not IsWindowDisabled (h))
					&& (not IsWindowObscured (h))
					&& (IsWindowVisible (h))) then
				Let sLocators = sLocators + GetTopLineOfWindow(h)
				Let sX = sX + "000|"
				Let sY = sY + "000|"
				Let sHandles = sHandles + IntToString (h) + "|"  
				Let WindowCount = WindowCount+1
			endif ; window visible
		elif (StringContains (class, "TOOLBAR")) then
			if (   (not IsWindowDisabled (h))
					&& (not IsWindowObscured (h))
					&& (IsWindowVisible (h))) then
				; here we treat each chunk in the tool bar like a separate window
				let iOldPixels = getJCFOption(opt_pixels_per_space)
				setJCFOption(opt_pixels_per_space,8)
				SaveCursor()
				InvisibleCursor()
				MoveToWindow (h)
				Let hCurrent = h ; so we can detect when we leave this window
				while (  (h == hCurrent)  
						&& (not isKeyWaiting()) 
						&& (getChunk() != cscNull))
					let sLocators = sLocators + getChunk() + "|"
					Let sX = sX + IntToString (GetCursorCol()) + "|"
					Let sY = sY + IntToString (GetCursorRow()) + "|"
					Let sHandles = sHandles + "000|"  ; no handle
					Let WindowCount = WindowCount+1
					nextChunk()
					let hCurrent=getCurrentWindow()
				endWhile
				setJCFOption(opt_pixels_per_space, iOldPixels)
				restoreCursor()
			endif ; toolbar window is visible and is enabled
		endif  ; elif case on class

		Let hChild = GetFirstChild (h)
		if (hChild) then
			; this window has children.
			; save the next handle, and dive down under this static
			; we'll return to this handle once we have explored this window's children
			Let hNext = GetNextWindow (h)
			if (hNext) then
				PushAhandle (hNext)
			endif
			Let hNext = hChild
		else	; a window with no children
			Let hNext = GetNextWindow(h)
		endif
		if (not hNext) then
			; done with this level.  pop back up to the next higher level again
			; if the stack is empty, we receive a null handle
			Let hNext = PopAhandle ()
		endif
		let h = hNext
		Let i = i+1
	EndWhile
endif  ; the real window has at least one child

; we are done exploring the levels
; get the text of the real window
GetWindowRect (hReal, l, r, t, b)
let sText = GetTextInRect (l, t, r, b, 0, IgnoreColor, IgnoreColor, 1)

Let s = msgVirtualizedWindow + " " + GetWindowName (hReal)
UserBufferAddText (s, cscNull, cscNull)
if (WindowCount > 0) then
	; we have children, and must merge the links
	; remove leading delimiters from the list strings
	Let sHandles = stringChopLeft (sHandles, 1)
	Let sLocators = stringChopLeft (sLocators, 1)
	Let sX = stringChopLeft (sX, 1)
	Let sY = stringChopLeft (sY, 1)
	Let start = 1
	let s = GetALine (sText, start)
	While (StringLength (s) > 0)
		UserBufferAddText (s, cscNull, cscNull)
		; scan through the locators
		Let i = 1
		While (i <= WindowCount)
			let LinkName = StringSegment (sLocators, "|", i)
			if (StringContains (s, LinkName)) then
				; This locator exists in this line of window text
				; is this a clickable button, or a window we can focus on.
				Let sTemp = StringSegment (sHandles, "|", i)
				if (sTemp == "000") then
					; no handle, so it must be a clickable item.
					Let FuncName = "ClickLocation(" + StringSegment (sX, "|", i) +", " + StringSegment (sY, "|", i) + ")"
					Let sItem = "Click: " + LinkName
					UserBufferAddText (sItem, FuncName, LinkName)
				else ; the string handle is not 000
					; this is a window we can place focus on
					Let FuncName = "FocusOnWindow(" + sTemp + ")"
					Let sItem = "Focus: " + LinkName
					UserBufferAddText (sItem, FuncName, LinkName)
				endif ; a window we can focus on
			endif  ; this locator exists in this line of window text
			Let i = i+1
		EndWhile  ; scanning through the locators
		let s = GetALine (sText, start)
	endWhile ; scanning through lines of text in the real window
else  ; there are not children, just virtualize the entire text.
	UserBufferAddText (sText, cscNull, cscNull)
endif
UserBufferAddText (msgBottomOfWindow, cscNull, cscNull)
UserBufferActivate()
SayLine()
;@@@test code
; SayInteger (WindowCount)
; Let sLocators = sLocators + "\r\n"
; Let sHandles = "handles: " + sHandles + "\r\n"
; Let sX = "s: " + sX + "\r\n"
; Let sY = "y: " + sY + "\r\n"
; CopyToClipboard (sLocators + sHandles + sX + sY)
EndFunction




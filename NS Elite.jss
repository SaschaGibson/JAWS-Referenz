;Copyright 1997-2015 by Freedom Scientific BLV Group, LLC
;NSTerm, for the NS Elite  3270 emulator,

;************************************************************************
;When the NS elite scripts change, increment the version here.
const NS_SCRIPT_VERSION = "98.01.30"  ;Year.Month.Day
;************************************************************************

Include "hjglobal.jsh" ; default HJ global variables
Include "hjconst.jsh" ; default HJ constants
include "common.jsm"
Include "default.jsm"
Include "NSterm.jsh" ; includes code for problematic fields
include "NsTerm.jsm" ; Messages for NsTerm
globals
string lastline,
string lastRed,
string LastTSS,
int nColumnReading,
int nAutoRouteJAWS,
int NSTermInJAWSFind,
int gnLastHPos, int gnLastVPos,
int nAutoJump,
Int nCursor,
int nParagraphMode,
int nCheck


const
	COLOR_RED = "255000000",
	COLOR_GREEN = "000255000",
	SIG_V_MOVE = 15,
	SIG_H_MOVE = 20,
	UP_ARROW = 72,
	DOWN_ARROW = 80,
	RIGHT_ARROW = 77,
	LEFT_ARROW = 75,
	RC_UP = 1,
	RC_DOWN = 0

Void Function AutoStartEvent ()
	if (!GetStatusLineWindow ()) then
		SayMessage (OT_HELP, msgt1_L) ; "your status line is disabled"
		SayMessage (OT_HELP, msgt2_L) ; "for optimal performance in NS Elite"
		SayString ("use the view menu to enable your status bar")
	endif
EndFunction

Script  ScriptFileName()
if (IsSameScript ()) then
	SayMessage (OT_STRING, msgt3_L + NS_SCRIPT_VERSION) ; "NS Elite script version "
else
	ScriptAndAppNames("NS Elite 3270")
endif

EndScript

String Function GetNormalField ()
var
Int RowNumber, ;cursor row number
string strField

let nCursor = GetActiveCursor ()
RouteInvisibleToPc ()
InvisibleCursor ()
let RowNumber =GetCursorRow ()
PriorWord ()
if ((RowNumber == GetCursorRow ()) ; still on same line
&& (StringContains (GetField(), ":"))) then ; it has a colon
	let strField = GetChunk() ;GetField()
	SetActiveCursor (nCursor)
	return strField ;Say the prompt
else
	;SayString ("prompt not on left") ; testing
	RouteInvisibleToPc () ;move back to start
	PriorLine () ; look at the line above
	if (StringContains (GetField (), ":")) then
		let strField =  GetChunk() ;GetField()
		SetActiveCursor (nCursor)
		return strField ; may say to much, needs work
;	else ;line above does not contain colon
;		RouteInvisibleToPc () ; return to start
;		let RowNumber = GetCursorRow () ; save the row number
;		NextWord () ; look for the next word
;		if ((RowNumber ==GetCursorRow ())
;		&& (StringContains (GetField (), ":"))) then
;			let strField = GetChunk() ;GetField()
;			SetActiveCursor (nCursor)
;			return strField ; say the field prompt on the right
;		endif ; word on right contains colon
	endif ; line above contains colon
endif ; prior word contains colon
PCCursor()
let strField = GetChunk()
SetActiveCursor (nCursor)
return strField ; should say entire word;Says the data in the input field
EndFunction

String Function GetTitleLine ()
var string strline,
int nCursor

let nCursor = GetActiveCursor ()
InvisibleCursor()
MoveToWindow(GetFocus())
let strline = GetLine()
SetActiveCursor(nCursor)
return strline
EndFunction

String Function GetDW0Prompt ()
var
string strTemp,
string strTitle,
int nTemp, int nTemp2,
int nSafety

let nSafety = 0
let nTemp = GetActiveCursor()
InvisibleCursor()
RouteInvisibleToPC()
let nTemp2 = GetCursorRow()
PriorLine()
while (GetCursorRow() < nTemp2 && nSafety < 50) ; we are moving up the screen
	if (GetColorName(GetColorText ()) == "white") then
		let strTemp = GetWord()
		SetActiveCursor(nTemp)
		if (strTemp == "" ||
		 	strTemp == "ISSUE:" ||
			strTemp == "SCREEN:" ||
			strTemp == "REQUEST:" ||
			strTemp == "F/UP:" ||
			strTemp == "TICKLE:" ||
			strTemp == "RECEIVED:" ||
			strTemp == "CATEGORY:" ||
			strTemp == "REMARKS:") then
				return strTemp
		else
			return ""
		endif
	endif
	let nTemp2 = GetCursorRow()
	let nSafety = nSafety + 1
	PriorLine()
endwhile
SetActiveCursor(nTemp)
EndFunction

String Function GetProblematicField (string strNormal)
var
	string strTemp,
	string strTitle,
	int nTemp, int nTemp2,
	int nSafety

let strTitle = GetTitleLine()
if (StringContains(strTitle, msgt4_L)) then
	if (StringContains (strNormal, msgt5_L)) then
		return PROMPT_1
	endif
endif
if (StringContains(strTitle, msgt6_L)) then
	if (StringContains (strNormal, msgt7_L)) then ; "AND/OR RESIDENCE SITUATION SINCE"
		let strTemp = GetLine()
		let nTemp = StringContains(strTemp, msgt8_L)	 ; ":"
		let strTemp = SubString (strTemp, 1, nTemp)
		let strTemp = PROMPT_2 + strTemp
		return strTemp
	endif
endif
if (StringContains(strTitle, msgt9_L)) then ; "RMEN"
	return GetLine()
endif
if (StringContains(strTitle, msgt10_L) || StringContains(strTitle, "MMDW")) then
	let strTemp = GetDW0Prompt ()
	if (strTemp != "") then
		return strTemp
	endif
endif
if (StringContains(strTitle, msgt11_L)) then ; "IDEN"
	if (strNormal == "    ") then
		let nTemp = GetActiveCursor()
		InvisibleCursor()
		RouteInvisibleToPC()
		PriorWord()
		let strTemp = GetWord()
		SetActiveCursor(nTemp)
		if (strTemp == msgt12_L || strTemp == msgt13_L) then
			return strTemp
		endif
	endif
endif
;if (StringContains(strTitle, SOME_OTHER_SCREEN)) then
;	if (StringContains (strNormal, "WITH ANY FOOD OR SHELTER ITEM")) then
;		return PROMPT_1
;	elif (StringContains (strNormal, "SOME_OTHER_FIELD")) then
;		return PROMPT_2
;	elif (StringContains (strNormal, "SOME_OTHER_FIELD")) then
;		return PROMPT_3
;	endif
;endif

return strNormal

EndFunction

String Function GetCurrentField ()
var
	string strField,
	string strNormal

let strNormal = GetNormalField()

if (strNormal == msgt14_L) then ; "(Y/N):"
	let strNormal = GetLine()
endif

let strField = GetProblematicField(strNormal)
if (strField != "") then
	return strField
else
	return strNormal
endif
EndFunction


Script ReadCurrentField ()
SayString (GetCurrentField ()) ;performs the function
EndScript


Int Function NSTermHotKeyHelp ()
var
	string RealWindow,
	string strPage

let RealWindow = GetWindowName(GetRealWindow(GetFocus()))
if (RealWindow == msgt15_L) then ; "Edit Options"
	let strPage = GetDialogPageName ()
	if (strPage == msgt16_L) then ; "Select"
		SayMessage (OT_HELP, msgt17_L) ; "Use line mode use alt l"
		SayMessage (OT_HELP, msgt18_L) ; "Use block mode use alt b"
	elif (strPage == msgt19_L) then ; "Copy"
		SayMessage (OT_HELP, msgt20_L) ; "Text use alt x"
		SayMessage (OT_HELP, msgt21_L)
		SayMessage (OT_HELP, msgt22_L)
		SayMessage (OT_HELP, msgt23_L) ; "use fields to delimit column boundaries use alt f"
		SayMessage (OT_HELP, msgt24_L) ; "use words to delimit column boundaries use alt w"
		SayMessage (OT_HELP, msgt25_L) ; "Replace data on the clip board use alt r"
		SayMessage (OT_HELP, msgt26_L) ; "append to existing data on the clip board use alt a"
		SayMessage (OT_HELP, msgt27_L)
	elif (strPage == msgt28_L) then ; "Paste"
		SayMessage (OT_HELP, msgt29_L) ; "Skip protected field use alt s"
		SayMessage (OT_HELP, msgt30_L) ; "replace end of each field with use alt r"
		SayMessage (OT_HELP, msgt31_L) ; "Expand tabs in source data use alt e"
		SayMessage (OT_HELP, msgt32_L) ; "past into current fields only use alt p"
		SayMessage (OT_HELP, msgt33_L) ; "do not skip protected fields use alt d"
		SayMessage (OT_HELP, msgt34_L) ; "maximum paste column use alt c"
		SayMessage (OT_HELP, msgt35_L) ; "maximum paste row use alt w"
		SayMessage (OT_HELP, msgt36_L) ; "no word wrap use alt n"
		SayMessage (OT_HELP, msgt37_L) ; "advanced use alt a"
	endif
	return TRUE
endif

return FALSE
EndFunction


Void Function HotKeyHelpDefaultLoop ()
var
	handle WinHandle,
	String RealClassName,
	String HelpPhrase,
	handle Hndl,
	int FoundHotKey,
	int SDMControlHandle,
	int WinTypeCode,
	string RealWindowName,
	int IsDialog

if (NSTermHotKeyhelp()) then return endif

Let FoundHotKey = 0
Let IsDialog = DialogActive ()
Let hndl = GetRealWindow (GetFocus())
Let RealClassName = GetWindowClass (hndl)
InvisibleCursor ()
;wn286="sdm"
if (StringContains (RealClassName, wn286)) then ; THIS IS AN SDM WINDOW
	Let IsDialog = ACTIVE
	Let WinHandle = GetRealWindow(GetFocus ())
	Let SDMControlHandle = SDMGetFirstControl (WinHandle)
	While (SDMControlHandle)
		MoveToControl (WinHandle, SDMControlHandle)
		;wn287=""
		if (GetHotKey (GetCurrentWindow()) != wn287) then
			if ((FoundHotKey == 0) && (GetVerbosity() == BEGINNER)) then
				SayMessage (OT_HELP, msg288_L) ;"Hot keys are as follows"
			EndIf
			;wn289=" use alt  "
			Let HelpPhrase = GetChunk () + wn289 + GetHotKey (GetCurrentWindow())
			Say (HelpPhrase, OT_HELP)
			let FoundHotKey = 1
		EndIf
		if (IsMultiPageDialog ()) then
			let WinHandle = GetCurrentWindow()
		EndIf
		let SDMControlHandle = SDMGetNextControl (WinHandle, SDMControlHandle)
	EndWhile
else ; Not SDM Window
	Let WinHandle = GetRealWindow (GetFocus ())
	let RealWindowName = GetWindowName (WinHandle)
	if ((RealWindowName == msgt38_L)  ; "Display Properties"
		|| (RealWindowName == msgt15_L)) then ; "edit options"
		Let WinHandle=GetFirstChild (WinHandle)
	EndIf
	Let WinHandle=GetFirstChild (WinHandle)
	While (WinHandle)
		let WinTypeCode = GetWindowTypeCode (WinHandle)
		If ((WinTypeCode == WT_BUTTON) ||
			(WinTypeCode == WT_STATIC) ||
			(WinTypeCode == WT_RADIOBUTTON) ||
			(WinTypeCode == WT_CHECKBOX) ||
			(WinTypeCode == WT_GROUPBOX) ||
			(WinTypeCode == WT_3STATE) ||
			(WinTypeCode == WT_TABCONTROL)) then
			MoveToWindow (WinHandle)
			If hndl != GetRealWindow (GetCurrentWindow ()) then
				PCCursor ()
				return
			EndIf
			;wn287=""
			if (GetHotKey(GetCurrentWindow()) != wn287) then
				if ((FoundHotKey == 0) && (GetVerbosity() == BEGINNER)) then
					SayMessage (OT_HELP, msg288_L) ;"Hot keys are as follows"
				EndIf
				;wn289=" use alt  "
				Let HelpPhrase = GetChunk () + wn289 + GetHotKey(GetCurrentWindow())
				Say (HelpPhrase, OT_HELP)
				let FoundHotKey = 1
			EndIf
		EndIf ; condition for static text or button
		Let WinHandle = GetNextWindow (WinHandle)
	EndWhile
EndIf
PcCursor ()
If (FoundHotKey == 0) then
	If (IsDialog) then ;only say this string if in a dialog
		;"unable to determine hot keys in this dialog"
		SayMessage (OT_HELP, msg450_L) ; "can not determine hot keys in this dialog"
	EndIf
	GeneralJAWSHotKeys ()
EndIf
EndFunction

Function SayHighlightedText (handle hwnd, string buffer)
var
int nCursor

	if (GetControlID(hwnd) == 1004 && GetFocus() == hwnd) then
		if (StringContains(GetWindowName(GetRealWindow(GetFocus())), "Keyboard Viewer")) then
			let nCursor = GetActiveCursor()
			InvisibleCursor()
			MoveToControl (GetParent(GetFocus()), 1008)
			SayMessage (OT_BUFFER, buffer + msgt39_L)
			SayWindow(GetCurrentWindow(), READ_EVERYTHING)
			SetActiveCursor(nCursor)
			return
		endif
	endif

	if (!InJAWSFind) then SayHighlightedText(hwnd, buffer) endif
EndFunction

Void Function EnableAutoJump (int nEnable)
let nAutoJump = nEnable
EndFunction

Void Function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if nKey == UP_ARROW
|| nKey == DOWN_ARROW
|| nKey == RIGHT_ARROW
|| nKey == LEFT_ARROW then
	EnableAutoJump(FALSE)
EndIf
ProcessKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Script test ()
MessageBox(GetLine())
EndScript

Int Function LookForAutoJump ()
var
int nVPos,
int nHPos,
int nHTemp,
int nVTemp,
int nReturn

let nVPos = GetCursorRow ()
let nHPos = GetCursorCol ()

let nReturn = FALSE

;The values can be positive or negative, so provide for both cases
let nHTemp = nHPos - gnLastHPos
if (nHTemp < 0) then
	let nHTemp = nHTemp - (2*nHTemp)
endif

let nVTemp = nVPos - gnLastVPos
if (nVTemp < 0) then
	let nVTemp = nVTemp - (2*nVTemp)
endif

;Check to see if there has been significant Vertical movement
if (nVTemp > SIG_V_MOVE) then
	let nReturn = TRUE
;Check to see if there has been significant Horizontal movement
elif (nHTemp > SIG_H_MOVE) then
	let nReturn = TRUE
endif

;Reset global variables for next time
let gnLastHPos = nHPos
let gnLastVPos = nVPos
return nReturn
EndFunction

Void Function SayNSNonHighlightedText (handle hwnd, string buffer, int nAttributes, int nTextColor, int nBackgroundColor)
	if (DialogActive () || GlobalMenuMode != MENU_INACTIVE) then
		SayNonHighlightedText(hwnd, buffer)
		return
	endif

	if (IsStatusLineWindow(hwnd)) then
		if (buffer == msgt40_L) then ; "INS"
			SayMessage (OT_STATUS, msgt41_L) ; "Insert key mode is on"
			SayMessage (OT_HELP, msgt42_L) ; "press reset key to continue"
		endif
		if (nAutoJump) then
			if(LookForAutoJump()) then
				if (ScreenChanged()) then
					let nColumnReading = FALSE
					if (!InJAWSFind) then
						Say (lastline, OT_STRING)
						if (IsTSS(buffer)) then
							let LastTSS = lastline
						endif
						let LastRed = ""
						PerformScript ReadCurrentField()
					endif
				else
					Say (GetCurrentField(), OT_FIELD)
					Say (GetChunk(), OT_CHUNK)
				endif
			endif
		else
			EnableAutoJump(TRUE)
		endif
		return
	endif
	if (InJAWSFind) then return endif
	if (GetWindowClass(hwnd) == "#32771") then
		Say (buffer, OT_BUFFER)
		return
	endif

	;Take care of bug where the letter p under cursor is continuously repeated if it is green
	if (IsJustOneChar(buffer) && buffer == "p") then
		return
	endif

	If (IsKeyPhrase(buffer)) then
		Say (buffer, OT_BUFFER)
		return
	endif

	if (ColorToRGBString (nTextColor)==COLOR_RED
		&& !StringContains(buffer, msgt43_L)) then   ; "SSSS"
			if (!IsJustOneChar(buffer)) then
			Say (buffer, OT_BUFFER)
			let LastRed = buffer
			;PerformScript ReadCurrentField()
		endif
	endif
EndFunction

Int Function ScreenChanged ()
var string strline,
int slash,
int nCursor

let nCursor = GetActiveCursor ()
InvisibleCursor()
MoveToWindow(GetFocus())
let strline = GetLine()

if (strline == "") then
	NextLine()
	let strline = GetLine()
endif

SetActiveCursor (nCursor)
if (strline == lastline) then
	return FALSE
else
	let lastline = strline
	return TRUE
endif
EndFunction

Void Function ProcessSpeechOnNewTextEvent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
if !(nAttributes& ATTRIB_HIGHLIGHT) then
	SayNSNonHighlightedText(hwnd,buffer, nAttributes, nTextColor, nBackgroundColor)
endif
ProcessSpeechOnNewTextEvent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

Script SayLastRed ()
if (LastRed == "") then
	SayMessage (OT_STATUS, msgt44_L)
else
	Say (LastRed, OT_STRING)
endif
EndScript

Script SayWindowTitle ()
SayMessage (OT_MESSAGE, msgt45_L) ; "title = "
if (DialogActive ()) then
	PerformScript SayWindowTitle()
else
	Say (GetWindowName (GetAppMainWindow (GetFocus ())), OT_APP_NAME)
	ScreenChanged()
	Say (lastline, OT_STRING)
	PerformScript ReadCurrentField()
endif
EndScript

Script SayScreenTitle ()
Say (lastline, OT_STRING)
EndScript


Int Function IsKeyPhrase (string buffer)
if (buffer == "PRESS ENTER TO CONTINUE") then
	return TRUE
elif (buffer == "PLEASE HIT ENTER TO CONTINUE") then
	return TRUE
elif (buffer == "COMMAND SUCCESSFUL") then
	return TRUE
;elif (buffer == "other key phrase") then
;	return TRUE
endif
return FALSE
EndFunction

Int Function IsTSS (string buffer)
var int safety
SaveCursor()
InvisibleCursor()
if (SubString(buffer, 1, 3)=="TSS") then
	return TRUE
else
	let safety = 0
	MoveToWindow(GetFocus())
	while (Safety < 5)
		NextLine()
		If (GetLine() != "") then
			return FALSE
		endif
		let safety = safety + 1
	endwhile
endif
return TRUE
EndFunction

Script SayTSS ()
Say (LastTSS, OT_STRING)
EndScript

Int Function IsJustOneChar (string phrase)
var
	 string temp
let temp = SubString (phrase, 1, 1)
;messagebox(temp + " " + phrase)

if StringContains (temp, phrase) then
	return true
else
	return false
EndIf
EndFunction

Int Function IsStatusLineWindow (handle hwnd)
return (GetWindowClass(hwnd) == "msctls_statusbar32")
EndFunction

HANDLE Function GetStatusLineWindow ()
var
handle hWnd

let hWnd = GetAppMainWindow(GetFocus())
let hWnd = GetFirstChild(hWnd)
while (hWnd && GetWindowClass (hWnd) != "msctls_statusbar32")
let hWnd = GetNextWindow(hWnd)
endwhile

if (IsStatusLineWindow(hWnd) && IsWindowVisible(hWnd)) then
	return hWnd
else
	return 0
endif
EndFunction

Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
if (InJAWSFind && !(GetWindowName(GetRealWindow(FocusWindow))=="JAWS Find")) then
	let NSTermInJAWSFind = TRUE
	return
endif
if (NSTermInJAWSFind == TRUE) then
	let NSTermInJAWSFind = FALSE
	return
endif
FocusChangedEvent (FocusWindow, PrevWindow)
EndFunction

Script ColumnModeToggle ()
let nColumnReading = !nColumnReading
if (nColumnReading) then
	SayMessage (OT_STATUS, msgt46_L) ; "Column Reading On"
	JAWSCursor()
else
	SayMessage (OT_STATUS, msgt47_L) ; "Column reading Off"
	PCCursor()
endif
EndScript

Script SayPriorLine ()
if (nColumnReading && IsJAWSCursor()) then
	SayColumnLine(RC_UP)
else
	PerformScript SayPriorLine()
endif
EndScript

Script SayNextLine ()
if (nColumnReading && IsJAWSCursor()) then
	SayColumnLine(RC_DOWN)
else
	PerformScript SayNextLine()
endif
EndScript

Void Function SayColumnLine (int nUp)
; Define the rule for different pages
var
string buffer,
int nColon

if (StringContains(LastLine, "APPT")) then
	if (nUp) then
		PriorLine()
	else
		NextLine()
	endif
	if (GetWord() != "--" ) then ; && GetWord() != " ") then
		SayWord()
		let buffer = GetLine()
		let nColon = StringContains(buffer, ":")
		if (nColon) then
			let nColon = nColon + 2
			let buffer = SubString (buffer, 1, nColon)
		endif
		Say (buffer, OT_BUFFER)
	endif
else
	if (nUp) then
		PerformScript SayPriorLine()
	else
		PerformScript SayNextLine()
	endif
endif
EndFunction

Script JAWSCursor ()
PerformScript JAWSCursor()
if (nAutoRouteJAWS) then RouteJAWSToPC() EndIf
EndScript

Script AutoRouteToggle ()
let nAutoRouteJAWS = !nAutoRouteJAWS
if (nAutoRouteJAWS) then
	SayMessage (OT_STATUS, msgt48_L) ; "Auto Routing on"
else
	SayMessage (OT_STATUS, msgt49_L)
endif
EndScript

Function SayWord ()
if (InJAWSFind && !StringContains(GetTitleLine(), "APPT")) then
	SayFromCursor ()
else
	SayWord()
EndIf
EndFunction

Script ReadChoices()
;800#
If (FREQ()) then return
elif (APPTS()) then return

;MFQ
elif (MFQM()) then return
elif (PIAE()) then return
elif (DEQY()) then return
elif (SSQM()) then return
elif (PHUS()) then return
elif (DEQM()) then return
elif (MISM()) then return
elif (CNQY()) then return
elif (RQSL()) then return
elif (PBRQ ()) then return
elif (HIQR()) then return
elif (MDBS()) then return
elif (MMQS()) then return
elif (ACLM()) then return
elif (MAIN()) then return
elif (PEMU()) then return
elif (PESL()) then return
elif (PETS()) then return
elif (PENC()) then return
elif (PEPR()) then return
elif (PEDT()) then return
elif (PEDD()) then return
elif (PEAN()) then return
elif (PEAR()) then return
elif (PEHS()) then return
elif (PEST()) then return
elif (MSSI()) then return
elif (ESMU()) then return
elif (DMMU()) then return
endif
EndScript

int function FREQ()
var string Temp
if (StringContains(LastLine, msgt50_L)) then; "FREQ"
	let Temp = GetCurrentField()
	if (Temp =="SELECT AGE CATEGORY:") then
		SayMessage (OT_MESSAGE, msgt51_L)		 ; "0=ALL"
		SayMessage (OT_HELP, msgt52_L) ; "1=Pending over 120 days"
		SayMessage (OT_MESSAGE, msgt53_L) ; "2=Pending 91 to 120 days"
		SayMessage (OT_MESSAGE, msgt54_L) ; "3=Pending 61 to 90 days"
		SayMessage (OT_MESSAGE, msgt55_L) ; "4=Pending 46 to 60 days"
		SayMessage (OT_MESSAGE, msgt56_L) ; "5=Pending 31 to 45 days"
		SayMessage (OT_HELP, msgt57_L); "6=Pending 16 to 30 days"
		SayMessage (OT_MESSAGE, msgt58_L) ; "7=Pending 0 to 15 days"
	return TRUE
	EndIf
endif
return FALSE
endfunction

int function APPTS() ;  800S screen
var string Temp
if (StringContains(LastLine, msgt59_L)) then ; "800S"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt60_L)) then; "MODE:"
		SayMessage (OT_MESSAGE, msgt61_L); "1=Establish"
		SayMessage (OT_MESSAGE, msgt62_L); "2=Update"
		SayMessage (OT_MESSAGE, msgt63_L)
	elif (StringContains(temp, msgt64_L)) then; "SELECT THE DESIRED FUNCTION"
		SayMessage (OT_MESSAGE, msgt65_L); "1=Administrative Message"
		SayMessage (OT_MESSAGE, msgt66_L) ; "2=Information Referral"
		SayMessage (OT_MESSAGE, msgt67_L)		 ; "3=Leads Protective Filing"
		SayMessage (OT_MESSAGE, msgt68_L)		 ; "4=Appointment Calendar Menu"
		SayMessage (OT_MESSAGE, msgt69_L); "5=Query"
		SayMessage (OT_MESSAGE, msgt70_L); "6=Leads Development"
		SayMessage (OT_MESSAGE, msgt71_L) ; "7=Field Office Listing Request"
		SayMessage (OT_MESSAGE, msgt72_L); "8=Leads Deletion"
		SayMessage (OT_MESSAGE, msgt73_L); "9=T S C Listing Request"
	endif
	return TRUE
endif
return FALSE
endfunction

int function MFQM()
var string Temp
if (StringContains(LastLine, msgt74_L)) then ; "MFQM"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt75_L)) then; "SELECT ONE OF THE FOLLOWING:"
		SayMessage (OT_MESSAGE, msgt76_L) ; "1=Abbreviated M B R"
		SayMessage (OT_MESSAGE, msgt77_L) ; "2=Full M B R"
		SayMessage (OT_MESSAGE, msgt78_L) ; "3=SSACCS Claims Control"
		SayMessage (OT_MESSAGE, msgt79_L) ; "4=Future use"
		SayMessage (OT_MESSAGE, msgt80_L) ; "5=newmident"
		SayMessage (OT_MESSAGE, msgt81_L) ; "6=Alphident"
		SayMessage (OT_MESSAGE, msgt82_L) ; "7=PIA Estimate"
		SayMessage (OT_MESSAGE, msgt83_L) ; "8=SEQY Summry Earnings Query"
		SayMessage (OT_MESSAGE, msgt84_L) ; "9=DEQY Detailed Earnings query"
		SayMessage (OT_MESSAGE, msgt85_L); "ten=S S Q M SSID S S I 2 S S I 3 S S I 4"
		SayMessage (OT_MESSAGE, msgt86_L); "eleven=PHUS fuss 1 fuss 2 and fuss 3"
		SayMessage (OT_MESSAGE, msgt87_L); "twelve=fuss 4 taxation inquiry"
		SayMessage (OT_MESSAGE, msgt88_L); "thirteen=ten ninety nine benefit statement"
		SayMessage (OT_MESSAGE, msgt89_L); "fourteen= T P Q Y third party query"
		SayMessage (OT_MESSAGE, msgt90_L); "fifteen=D E Q M delayed query menu"
		SayMessage (OT_MESSAGE, msgt91_L); "sixteen=MISM miscellaneous menu"
		SayMessage (OT_MESSAGE, msgt92_L) ; "seventeen=Q R S L inquiry response"
		SayMessage (OT_MESSAGE, msgt93_L); "eighteen=C N Q Y consolidated query"
		SayMessage (OT_MESSAGE, msgt94_L); "nineteen=R P Q Y representative payee"
		SayMessage (OT_MESSAGE, msgt95_L); "twenty=P C A C S case control query"
		SayMessage (OT_MESSAGE, msgt96_L); "twenty one=HCFA H I S M I"
		SayMessage (OT_MESSAGE, msgt97_L); "twenty two=P B R Q pebes online"
		SayMessage (OT_MESSAGE, msgt98_L); "twenty three=future use"
	elif (StringContains(temp, msgt99_L)) then; "ROUTE RESPONSE TO"
		SayMessage (OT_MESSAGE, msgt100_L); "1=screen"
		SayMessage (OT_MESSAGE, msgt101_L); "2=printer main"
		SayMessage (OT_MESSAGE, msgt102_L); "3=printer"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function PIAE()
var string Temp
if (StringContains(LastLine, msgt103_L)) then; "PIAE"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt104_L)) then; "CONTACT METHOD:"
		SayMessage (OT_MESSAGE, msgt105_L); "1=phone"
		SayMessage (OT_MESSAGE, msgt106_L); "2=visit"
		SayMessage (OT_MESSAGE, msgt107_L); "3=mail"
		SayMessage (OT_MESSAGE, msgt108_L); "4=system"
	elif (StringContains(temp, msgt99_L)) then; "ROUTE RESPONSE TO"
		SayMessage (OT_MESSAGE, msgt100_L); "1=screen"
		SayMessage (OT_MESSAGE, msgt101_L); "2=printer main"
		SayMessage (OT_MESSAGE, msgt102_L); "3=printer"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function DEQY()
var string Temp
if (StringContains(LastLine, msgt109_L)) then; "DEQY"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt99_L)) then; "ROUTE RESPONSE TO"
		SayMessage (OT_MESSAGE, msgt100_L); "1=Screen"
		SayMessage (OT_MESSAGE, msgt101_L); "2=Printer Main"
		SayMessage (OT_MESSAGE, msgt102_L); "3=Printer"
	elif (StringContains(temp, MSGT110_L)) then; "REQUESTED DETAILS"
		SayMessage (OT_MESSAGE, msgt111_L); "1=Covered details"
		SayMessage (OT_MESSAGE, msgt112_L); "2=self employment"
		SayMessage (OT_MESSAGE, msgt113_L); "3=m q g e and health insurance"
		SayMessage (OT_MESSAGE, msgt114_L); "4=all non covered details"
		SayMessage (OT_MESSAGE, msgt115_L); "5=pension"
		SayMessage (OT_MESSAGE, msgt116_L); "6=railroad"
		SayMessage (OT_MESSAGE, msgt117_L); "7=special wage payment"
		SayMessage (OT_MESSAGE, msgt118_L); "8=employer address"
		SayMessage (OT_MESSAGE, msgt119_L); "9=last employer address"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function SSQM()
var string Temp
if (StringContains(LastLine, msgt120_L)) then; "SSQM"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt99_L)) then; "ROUTE RESPONSE TO"
		SayMessage (OT_MESSAGE, msgt100_L); "1=Screen"
		SayMessage (OT_MESSAGE, msgt101_L); "2=Printer Main"
		SayMessage (OT_MESSAGE, msgt102_L); "3=Printer"
	elif (StringContains(temp, msgt121_L)) then; "SELECT ONE OF THE FOLLOWING"
		SayMessage (OT_MESSAGE, msgt122_L); "1=SSID Complete record request"
		SayMessage (OT_MESSAGE, msgt123_L); "2=S S I 2 selective request"
		SayMessage (OT_MESSAGE, msgt124_L); "3=S S I 3 general s s i query"
		SayMessage (OT_MESSAGE, msgt125_L); "4=s s i 4 overpayment redertimination query"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function PHUS()
var string Temp
if (StringContains(LastLine, msgt126_L)) then; "PHUS"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt99_L)) then; "ROUTE RESPONSE TO"
		SayMessage (OT_MESSAGE, msgt100_L); "1=Screen"
		SayMessage (OT_MESSAGE, msgt101_L); "2=Printer Main"
		SayMessage (OT_MESSAGE, msgt102_L); "3=Printer"
	elif (StringContains(temp, msgt121_L)) then; "SELECT ONE OF THE FOLLOWING"
		SayMessage (OT_MESSAGE, msgt127_L); "1=P H U 1 payment history by bic"
		SayMessage (OT_MESSAGE, msgt128_L); "2=p h u 2 payment history"
		SayMessage (OT_MESSAGE, msgt129_L); "3=p h u 3 payment history bic list"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function DEQM()
var string Temp
if (StringContains(LastLine, MSGT130_L)) then; "DEQM"
	let Temp = GetCurrentField()
	If (StringContains(temp, MSGT121_L)) then; "SELECT ONE OF THE FOLLOWING"
		SayMessage (OT_MESSAGE, msgt131_L); "1=h i q y offline health insurance query"
		SayMessage (OT_MESSAGE, msgt132_L); "2=h i r c offline health insurance replacement card"
		SayMessage (OT_MESSAGE, msgt133_L); "3=o f b e offline benefit estimate"
		SayMessage (OT_MESSAGE, msgt134_L); "4=o m p q offline mbr premium query"
		SayMessage (OT_MESSAGE, msgt135_L); "5=o f s q offline s s r"
		SayMessage (OT_MESSAGE, msgt136_L); "6=d eigh c t delayed eigh eigh c t query"
		SayMessage (OT_MESSAGE, msgt137_L); "7=d f c t delayed f eigh c t query"
		SayMessage (OT_MESSAGE, msgt138_L); "8=d s i d delayed sid query"
		SayMessage (OT_MESSAGE, msgt139_L); "9=d s i 2 delayed s s i 2 query"
		SayMessage (OT_MESSAGE, msgt140_L); "ten=d s i 3 delayed s s i 3 query"
		SayMessage (OT_MESSAGE, msgt141_L); "eleven=d s i 4 delayed s s i 4 query"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function MISM()
var string Temp
if (StringContains(LastLine, msgt142_L)) then; "MISM"
	let Temp = GetCurrentField()
	If (StringContains(temp, msgt121_L)) then; "SELECT ONE OF THE FOLLOWING"
		SayMessage (OT_MESSAGE, msgt143_L); "1=d r m q drams query"
		SayMessage (OT_MESSAGE, msgt144_L); "2=c r c 1 corc offline case query"
		SayMessage (OT_MESSAGE, msgt145_L); "3=c r c 2 corc online counts query"
		SayMessage (OT_MESSAGE, msgt146_L); "4=c r c 3 corc online s s n query"
		SayMessage (OT_MESSAGE, msgt147_L); "choices 5 through 8 are for future use"
		SayMessage (OT_MESSAGE, msgt148_L); "9=d t m eigh add death record"
		SayMessage (OT_MESSAGE, msgt149_L); "ten=d t m c correct death record"
		SayMessage (OT_MESSAGE, msgt150_L); "eleven=d t m d delete death record"
		SayMessage (OT_MESSAGE, msgt151_L); "twelve=r t n d routing transmit number"
		SayMessage (OT_MESSAGE, msgt152_L); "thirteen=a e q y alpha access to e i f"
		SayMessage (OT_MESSAGE, msgt153_L); "fourteen=e r q y employer report query"
		SayMessage (OT_MESSAGE, msgt154_L); "fifteen=s e i d s s a employee identification"
	elif (StringContains(temp, msgt99_L)) then; "ROUTE RESPONSE TO"
		SayMessage (OT_MESSAGE, msgt100_L); "1=Screen"
		SayMessage (OT_MESSAGE, msgt101_L); "2=Printer Main"
		SayMessage (OT_MESSAGE, msgt102_L); "3=Printer"
		return TRUE
	EndIf
endif
return FALSE
endfunction


int function CNQY()
var string Temp
if (StringContains(LastLine, msgt155_L)) then; "CNQY"
	let Temp = GetCurrentField()
	If (StringContains(temp, msgt156_L)) then; "SELECT ANY OF THE FOLLOWING"
		SayMessage (OT_MESSAGE, msgt157_L); "0=eigh eigh c t abbreviated m b r"
		SayMessage (OT_MESSAGE, msgt158_L); "1=s s i d complete record request"
		SayMessage (OT_MESSAGE, msgt159_L); "2=numi numident"
		SayMessage (OT_MESSAGE, msgt160_L); "3=s e q y summary earnings"
		SayMessage (OT_MESSAGE, msgt161_L); "4=all of above"
		SayMessage (OT_MESSAGE, msgt162_L); "5=p i a e p i a estimate"
		SayMessage (OT_MESSAGE, msgt163_L); "6=d e q y detail earnings"
		SayMessage (OT_MESSAGE, msgt164_L); "7=s s i 2 folder location"
		SayMessage (OT_MESSAGE, msgt165_L); "there is no choice 8"
		SayMessage (OT_MESSAGE, msgt166_L); "9=f a c t full m b r"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function RQSL()
var string Temp
if (StringContains(LastLine, msgt167_L)) then; "RQSL"
	let Temp = GetCurrentField()
	If (StringContains(temp, msgt168_L)) then; "QUERY RESPONSE(S)"
		SayMessage (OT_MESSAGE, msgt169_L); "1=rep payee screening query response"
		SayMessage (OT_MESSAGE, msgt170_L); "2=rep payee full query response"
		SayMessage (OT_MESSAGE, msgt171_L); "3=Individual beneficiary recipient query response"
		SayMessage (OT_MESSAGE, msgt172_L); "selections 1 2 and 3 will always be returned to the screen"
		SayMessage (OT_MESSAGE, msgt173_L); "4=individual rep payee beneficiary recipient list"
		SayMessage (OT_MESSAGE, msgt174_L); "5=organization or institution rep payee beneficiary recipient list"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function PBRQ()
var string Temp
if (StringContains(LastLine, msgt175_L)) then; "PBRQ"
	let Temp = GetCurrentField()
	If (StringContains(temp, msgt99_L)) then; "ROUTE RESPONSE TO"
		SayMessage (OT_MESSAGE, msgt100_L); "1=screen"
		SayMessage (OT_MESSAGE, msgt101_L); "2=printer main"
		SayMessage (OT_MESSAGE, msgt102_L); "3=printer"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function HIQR()
var string Temp
if (StringContains(LastLine, msgt176_L)) then; "HIQR"
	let Temp = GetCurrentField()
	If (StringContains(temp, msgt121_L)) then; "SELECT ONE OF THE FOLLOWING"
		SayMessage (OT_MESSAGE, msgt177_L); "1=m e q y medicare enrollment query"
		SayMessage (OT_MESSAGE, msgt178_L); "2=m d b q medicare direct billing "
		SayMessage (OT_MESSAGE, msgt179_L); "3=m d b s medicare direct billing submenu"
		SayMessage (OT_MESSAGE, msgt180_L); "4=m m q s medicare miscellaneous query submenu"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function MDBS()
var string Temp
if (StringContains(LastLine, msgt181_L)) then; "MDBS"
	let Temp = GetCurrentField()
	If (StringContains(temp, msgt121_L)) then; "SELECT ONE OF THE FOLLOWING"
		SayMessage (OT_MESSAGE, msgt182_L); "1=m p b q medicare premium due balance query"
		SayMessage (OT_MESSAGE, msgt183_L); "2=m b h q medicare billing history query"
		SayMessage (OT_MESSAGE, msgt184_L); "3=m p p q medicare premium payment query"
		SayMessage (OT_MESSAGE, msgt185_L); "4=m p a q medicare premium due adjustment query"
	elif (StringContains(temp, msgt99_L)) then; "ROUTE RESPONSE TO"
		SayMessage (OT_MESSAGE, msgt100_L); "1=Screen"
		SayMessage (OT_MESSAGE, msgt101_L); "2=Printer Main"
		SayMessage (OT_MESSAGE, msgt102_L); "3=Printer"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function MMQS()
var string Temp
if (StringContains(LastLine, msgt186_L)) then; "MMQS"
	let Temp = GetCurrentField()
	If (StringContains(temp, msgt121_L)) then; "SELECT ONE OF THE FOLLOWING"
		SayMessage (OT_MESSAGE, msgt187_L); "1=h t p q health insurance third party query"
		SayMessage (OT_MESSAGE, msgt188_L); "2=s t p q SMI third party query"
		SayMessage (OT_MESSAGE, msgt189_L); "3=m x r q medicare cross reference query"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function ACLM()
var string Temp
if (StringContains(LastLine, msgt190_L)) then; "ACLM"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt191_L)) then; "APPLICATION TYPE:"
		SayMessage (OT_MESSAGE, msgt192_L)		; "1=deferred"
		SayMessage (OT_MESSAGE, msgt193_L); "2=full"
		SayMessage (OT_MESSAGE, msgt194_L); "3=abbreviated"
	elif (StringContains(temp, msgt195_L)) then; "ABBREVIATED"
		SayMessage (OT_MESSAGE, msgt196_L); "1=access accountable income"
		SayMessage (OT_MESSAGE, msgt197_L); "2=ineligible resident of a public institution"
		SayMessage (OT_MESSAGE, msgt198_L); "3=absence from U.S."
		SayMessage (OT_MESSAGE, msgt199_L); "4=excess resources"
		SayMessage (OT_MESSAGE, msgt200_L);
		SayMessage (OT_MESSAGE, msgt201_L); "6=not age 65 blind or disabled"
		SayMessage (OT_MESSAGE, msgt202_L); "7=failure to pursue claim"
		SayMessage (OT_MESSAGE, msgt203_L); "8=inmate of a penal institution"
		SayMessage (OT_MESSAGE, msgt204_L); "9=not a resident of the united states"
	endif
	return TRUE
endif
return FALSE
endfunction

int function MAIN()
var string Temp
if (StringContains(LastLine, msgt205_L)) then; "MAIN"
	let Temp = GetCurrentField()
	if (Temp == msgt206_L) then; "SELECT THE DESIRED FUNCTION:"
		SayMessage (OT_MESSAGE, msgt207_L); "1=Title 2 initial claims"
		SayMessage (OT_MESSAGE, msgt208_L); "2=Title 2 post entitlement"
		SayMessage (ot_message, MSGT209_L); "3=Title 16 claims and post entitlement"
		SayMessage (OT_MESSAGE, msgt210_L); "4=Shared processes"
		SayMessage (OT_MESSAGE, msgt211_L); "5=Enumeration"
		SayMessage (OT_MESSAGE, msgt212_L); "6=Debt Management"
		SayMessage (OT_MESSAGE, msgt213_L); "7=Title 2 Interactive Comps"
		SayMessage (OT_MESSAGE, msgt214_L); "8=Title 16 Interactive Comps"
		SayMessage (OT_MESSAGE, msgt215_L); "9=Master File Query"
		SayMessage (OT_MESSAGE, msgt216_L); "10=Macade"
		SayMessage (OT_MESSAGE, msgt217_L); "11=Appointment Referral Leads"
		SayMessage (OT_MESSAGE, msgt218_L); "12=Earnings Modernization"
		SayMessage (OT_MESSAGE, msgt219_L); "13=Integrity Review"
		SayMessage (OT_MESSAGE, msgt220_L); "14=R S D H I Data Inputs"
		SayMessage (OT_MESSAGE, msgt221_L); "15=S S I Data Inputs"
		SayMessage (OT_MESSAGE, msgt222_L); "16=Administrative Applications"
		SayMessage (OT_MESSAGE, msgt223_L); "17=O H A Data Inputs and Queries"
		SayMessage (OT_MESSAGE, msgt224_L); "18=N D D S S Master File Menu"
		SayMessage (OT_MESSAGE, msgt225_L); "19=C P S Data Inputs and Queries"
		SayMessage (OT_MESSAGE, msgt226_L); "20=TRID Applications"
		SayMessage (OT_MESSAGE, msgt227_L); "21=Railroad Board Data Inputs"
		SayMessage (OT_MESSAGE, msgt228_L); "22=Alternate Mode Facility"
		SayMessage (OT_MESSAGE, msgt229_L); "23=Representative Payee"
		SayMessage (OT_MESSAGE, msgt230_L); "24=Modernized Development Worksheet"
		SayMessage (OT_MESSAGE, msgt231_L); "25=W M S Listings"
		SayMessage (OT_MESSAGE, msgt232_L); "26=P C Action Control System"
		SayMessage (OT_MESSAGE, msgt233_L); "27=Title 2 Modernized Data Inputs"
		SayMessage (OT_MESSAGE, msgt234_L); "28=Drug Addiction and Alcoholism"
		SayMessage (OT_MESSAGE, msgt235_L); "29=P C Notice Processing"
		SayMessage (OT_MESSAGE, msgt236_L); "30=Common Tickle"
		SayMessage (OT_MESSAGE, msgt237_L); "31=T N A Notice Retreival"
		SayMessage (OT_MESSAGE, msgt238_L); "32=Continuing Disability Review File"
		SayMessage (OT_MESSAGE, msgt239_L); "33=Prison System"
		SayMessage (OT_MESSAGE, msgt240_L); "34=Network Status"
		SayMessage (OT_MESSAGE, msgt241_L); "99=Return"
	return TRUE
	EndIf
endif
return FALSE
endfunction

int function PEMU()
var string Temp
if (StringContains(LastLine, msgt242_L)) then; "PEMU"
	let Temp = GetCurrentField()
	if (Temp ==msgt243_L) then; "SELECT:"
		SayMessage (OT_MESSAGE, msgt244_L); "1=Establish"
		SayMessage (OT_MESSAGE, msgt245_L); "2=Update"
		SayMessage (OT_MESSAGE, msgt246_L); "3=Query"
		SayMessage (OT_MESSAGE, msgt247_L); "4=W M S Query"
		SayMessage (OT_MESSAGE, msgt248_L); "5=Tickle Listing"
		SayMessage (OT_MESSAGE, msgt249_L); "6=Inline Quality Review"
		SayMessage (OT_MESSAGE, msgt250_L); "7=Online Recomp Retrieval"
		SayMessage (OT_MESSAGE, msgt251_L); "8=Overnight Recomp Archive Retrieval"
	return TRUE
	EndIf
endif
return FALSE
endfunction

int function PESL()
var string Temp
if (StringContains(LastLine, msgt252_L)) then; "PESL"
	let Temp = GetCurrentField()
	if (Temp =="") then
		SayMessage (OT_MESSAGE, msgt253_L)		; "enter 1 for change of address, 2 for name correction"
		SayMessage (OT_MESSAGE, msgt254_L); "3 for death 4 for direct deposit 5 for marriage 6 for divorce"
		SayMessage (OT_MESSAGE, msgt255_L); "7 for annulment 8 for nonreciept 9 for work reports ten for "
		SayMessage (OT_MESSAGE, msgt256_L); "health insurance eleven for disability cessation twelve for c d r suspension"
		SayMessage (OT_MESSAGE, msgt257_L); "thirteen for dev rep suspension fourteen for miscellaneous suspension termination"
		SayMessage (OT_MESSAGE, msgt258_L); "fifteen for p i a recomputation sixteen for telephone seventeen for pay "
		SayMessage (OT_MESSAGE, msgt259_L); "cycle eighteen for voluntary tax withholding"
	return TRUE
	EndIf
endif
return FALSE
endfunction

int function PETS()
var string Temp
if (StringContains(LastLine, msgt260_L)) then; "PETS"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt243_L)) then; "SELECT:"
		SayMessage (OT_MESSAGE, msgt261_L)		; "1=transaction movement"
		SayMessage (OT_MESSAGE, msgt262_L); "2=update"
		SayMessage (OT_MESSAGE, msgt263_L); "3=query"
		SayMessage (OT_MESSAGE, msgt264_L); "4=cancel"
		SayMessage (OT_MESSAGE, msgt265_L); "5=manual clearance"
	elif (StringContains(temp, msgt266_L)) then; "SELECT TRANSACTION"
		SayFrame ("PETSFrame")
	return TRUE
	EndIf
endif
return FALSE
endfunction

int function PENC()
var string Temp
if (StringContains(LastLine, msgt267_L)) then
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt268_L)) then
		SayMessage (OT_MESSAGE, msgt269_L); "1=beneficiary name only"
		SayMessage (OT_MESSAGE, msgt270_L); "2=beneficiary name and rep payee name"
		SayMessage (OT_MESSAGE, msgt271_L); "3=rep payee name"
	return TRUE
	EndIf
endif
return FALSE
endfunction

int function PEPR()
var string Temp
if (StringContains(LastLine, msgt272_L)) then; "PEPR"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt273_L)) then; "TYPE OF ACTION:"
		SayMessage (OT_MESSAGE, msgt274_L); "1=beneficiary initiated recomputation"
		SayMessage (OT_MESSAGE, msgt275_L); "2=rate adjustment"
	return TRUE
	EndIf
endif
return FALSE
endfunction

int function PEDT()
var string Temp
if (StringContains(LastLine, msgt276_L)) then; "PEDT"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt277_L)) then; "FURTHER ACTION NEEDED:"
		SayMessage (OT_MESSAGE, msgt278_L)		; "1=possible rep payee application required"
		SayMessage (OT_MESSAGE, msgt279_L); "2=lump sum death payment claim "
		SayMessage (OT_MESSAGE, msgt280_L); "3=survivor benefit not currently entitled"
		SayMessage (OT_MESSAGE, msgt281_L); "4=survivor benefit between sixty two and sixty five and dually entitled"
		SayMessage (OT_MESSAGE, msgt282_L); "5=child in care development"
	return TRUE
	EndIf
endif
return FALSE
endfunction

int function PEDD()
var string Temp
if (StringContains(LastLine, msgt283_L)) then; "PEDD"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt273_L)) then; "TYPE OF ACTION:"
		SayMessage (OT_MESSAGE, msgt284_L); "1=add or change"
		SayMessage (OT_MESSAGE, msgt285_L); "2=cancel"
		SayMessage (OT_MESSAGE, msgt286_L); "2=cancel"
		SayMessage (OT_MESSAGE, msgt287_L); "4=cancel future bank"
	elif (StringContains(temp, msgt288_L)) then; "ACCOUNT TYPE:"
		SayMessage (OT_MESSAGE, msgt289_L)		; "1=checking"
		SayMessage (OT_MESSAGE, msgt290_L); "2=savings"
		SayMessage (OT_MESSAGE, msgt291_L); "3=e b t"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function PEAN()
var string Temp
if (StringContains(LastLine, msgt292_L)) then; "PEAN"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt293_L)) then; "TYPE OF ANNULMENT:"
		SayMessage (OT_MESSAGE, msgt294_L); "1=void"
		SayMessage (OT_MESSAGE, msgt295_L); "2=voidable marriage"
		SayMessage (OT_MESSAGE, msgt296_L); "3=alimony involved"
		SayMessage (OT_MESSAGE, msgt297_L); "4=ab initio"
		SayMessage (OT_MESSAGE, msgt298_L); "5=prospective only"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function PEAR()
var string Temp
if (StringContains(LastLine, msgt299_L)) then; "PEAR"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt243_L)) then; "SELECT:"
		SayMessage (OT_MESSAGE, msgt300_L); "1=annual report penalty"
		SayMessage (OT_MESSAGE, msgt301_L); "2=work notice"
		SayMessage (OT_MESSAGE, msgt302_L); "3=questionable retirement"
		SayMessage (OT_MESSAGE, msgt303_L); "4=enforcement annual report"
		return TRUE
	EndIf
endif
return FALSE
endfunction


int function PEHS()
var string Temp
if (StringContains(LastLine, msgt304_L)) then; "PEHS"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt305_L)) then; "TYPE OF ACTION:"
		SayMessage (OT_MESSAGE, msgt306_L); "1=enroll"
		SayMessage (OT_MESSAGE, msgt307_L); "2=refuse"
		SayMessage (OT_MESSAGE, msgt308_L); "3=withdraw"
		SayMessage (OT_MESSAGE, msgt309_L); "4=cancel withdrawal"
		SayMessage (OT_MESSAGE, msgt310_L); "5=issue new medicare card"
	elif (StringContains(temp, msgt311_L)) then; "TYPE OF COVERAGE:"
		SayMessage (OT_MESSAGE, msgt312_L); "1=S M I"
		SayMessage (OT_MESSAGE, msgt313_L); "2=premium h i"
		SayMessage (OT_MESSAGE, msgt314_L); "3=premium h i and s m i"
		return TRUE
	EndIf
endif
return FALSE
endfunction


int function PEST()
var string Temp
if (StringContains(LastLine, msgt315_L)) then; "PEST"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt273_L)) then; "TYPE OF ACTION:"
		SayMessage (OT_MESSAGE, msgt316_L); "1=DEVELOPMENT OF VERIFICATION OF DEATH LAF-S9"
		SayMessage (OT_MESSAGE, msgt317_L); "2=BENEFITS SUSPENDED PENDING DISABILITY DETERMINATION LAF-S9"
		SayMessage (OT_MESSAGE, msgt318_L); "3=MISCELLANEOUS LAF-S9 MANUAL NOTICE NECESSARY"
		SayMessage (OT_MESSAGE, msgt319_L); "4=WHEREABOUTS UNKNOWN-RSI LAFS9"
		SayMessage (OT_MESSAGE, msgt320_L); "5=NEW LEGISLATIVE DECISIONS LAF S9 MANUAL NOTICE NECESSARY"
		SayMessage (OT_MESSAGE, msgt321_L); "6=WAIVER OF BENEFIT PAYMENTS LAF-S9"
		SayMessage (OT_MESSAGE, msgt322_L); "7=FAILURE TO RETURN SSA-7161/7162 LAF-S9"
		SayMessage (OT_MESSAGE, msgt323_L); "8=WITHDRAWAL OF CLAIM SUSPENSION LAF-S9"
		SayMessage (OT_MESSAGE, msgt324_L); "9=DEVELOPMENT OF ADDRESS LAF-S6"
		SayMessage (OT_MESSAGE, msgt325_L); "ten =REFUSED VR SERVICES LAF-S7"
		SayMessage (OT_MESSAGE, msgt326_L); "eleven=NO CHILD IN CARE LAF-S4"
		SayMessage (OT_MESSAGE, msgt327_L); "twelve=ERRONEOUS DEATH REPORT BY DEFENSE DEPARTMENT LAF-T9"
		SayMessage (OT_MESSAGE, msgt328_L); "thirteen=WITHDRAWAL OF CLAIM TERMINATION LAF-T&"
		return TRUE
	EndIf
endif
return FALSE
endfunction

int function MSSI()
;fix, select field does not work
var string Temp
if (StringContains(LastLine, msgt329_L)) then; "MSSI"
	let Temp = GetCurrentField()
	if (StringContains(temp, msgt243_L)) then; "SELECT:"
		SayMessage (OT_MESSAGE, msgt330_L); "1=establish"
		SayMessage (OT_MESSAGE, msgt331_L); "2=update"
		SayMessage (OT_MESSAGE, msgt332_L); "3=query"
	elif (StringContains(temp, msgt64_L)) then; "SELECT THE DESIRED FUNCTION"
		SayMessage (OT_MESSAGE, msgt333_L); "1=Archival Retrieval"
		SayMessage (OT_MESSAGE, msgt334_L); "2=Tickle List Request"
		SayMessage (OT_MESSAGE, msgt335_L); "3=New Claim"
		SayMessage (OT_MESSAGE, msgt336_L); "4=Claim Update or Inquiry"
		SayMessage (OT_MESSAGE, msgt337_L); "5=Claim Development"
		SayMessage (OT_MESSAGE, msgt338_L); "6=Claims Clearance"
		SayMessage (OT_MESSAGE, msgt339_L); "7=Case Movement"
		SayMessage (OT_MESSAGE, msgt340_L); "8=W M S Query Request"
		SayMessage (OT_MESSAGE, msgt341_L); "9=S S N Correction"
		SayMessage (OT_MESSAGE, msgt342_L); "There is no choice 10"
		SayMessage (OT_MESSAGE, msgt343_L); "11=Delete Ineligibles"
		SayMessage (OT_MESSAGE, msgt344_L); "12=Manual Processes"
		SayMessage (OT_MESSAGE, msgt345_L); "13=Integrity Review"
		SayMessage (OT_MESSAGE, msgt346_L); "14=Decision Input"
		SayMessage (OT_MESSAGE, msgt347_L); "15=Automated Computations"
		SayMessage (OT_MESSAGE, msgt348_L); "16=New Claim Abbreviated"
		SayMessage (OT_MESSAGE, msgt349_L); "17=Post eligibility"
		SayMessage (OT_MESSAGE, msgt350_L); "18=Denied Claim reopening"
	endif
	return TRUE
endif
return FALSE
endfunction

int function ESMU()
var string Temp
if (StringContains(LastLine, msgt351_L)) then; "ESMU"
	let Temp = GetCurrentField()
	if (Temp == msgt207_L) then; "SELECT THE DESIRED FUNCTION:"
		SayMessage (OT_MESSAGE, msgt352_L); "1=S S N Application Interview"
		SayMessage (OT_MESSAGE, msgt353_L); "2=S S N Batch Input"
		SayMessage (OT_MESSAGE, msgt354_L); "3=Print Application"
		SayMessage (OT_MESSAGE, msgt355_L); "4=Clear Application"
		SayMessage (OT_MESSAGE, msgt356_L); "5=Update Application"
		SayMessage (OT_MESSAGE, msgt357_L); "6=Delete Application"
		SayMessage (OT_MESSAGE, msgt358_L); "7=Application Status"
		SayMessage (OT_MESSAGE, msgt359_L); "8=Resolve Investigate"
		SayMessage (OT_MESSAGE, msgt360_L); "9=Special Indicators"
		SayMessage (OT_MESSAGE, msgt361_L); "10=Birth Record Review"
	return TRUE
	EndIf
endif
return FALSE
endfunction

int function DMMU()
var string Temp
if (StringContains(LastLine, msgt362_L)) then
	let Temp = GetCurrentField()
	if (Temp ==msgt206_L) then; "SELECT THE DESIRED FUNCTION:"
		SayMessage (OT_MESSAGE, msgt363_L); "1=Remittance Process"
		SayMessage (OT_MESSAGE, msgt364_L); "2=Debt Resolution"
		SayMessage (OT_MESSAGE, msgt365_L); "3=Debt Follow Up"
		SayMessage (OT_MESSAGE, msgt366_L); "4=Setup Modify Debt"
		SayMessage (OT_MESSAGE, msgt367_L); "5=Billing System"
		SayMessage (OT_MESSAGE, msgt368_L); "6=Remarks"
		SayMessage (OT_MESSAGE, msgt369_L); "7=Billing Issues Development"
		SayMessage (OT_MESSAGE, msgt370_L); "8=Pending File Summary"
		SayMessage (OT_MESSAGE, msgt371_L); "9=Master file Offline Queries"
		SayMessage (OT_MESSAGE, msgt372_L); "10=W M S D M Function selection"
		SayMessage (OT_MESSAGE, msgt373_L); "11=W M S D M Manual Clearance"
		SayMessage (OT_MESSAGE, msgt374_L); "12=Treasury Offset Program"
	return TRUE
	EndIf
endif
return FALSE
endfunction

Script MCALReadCALForCLMTypes ()
if (StringContains(LastLine, msgt375_L)) then; "MCAL"
	SayMessage (OT_MESSAGE, msgt376_L); "Claim types for appointment one calendar are"
	SayFrame ("MCALClaimTypeAPPT1")
	SayMessage (OT_MESSAGE, msgt377_L); "Claim types for appointment two calendar are"
	SayFrame ("MCALClaimTypeAPPT2")
	SayMessage (OT_MESSAGE, msgt378_L); "Claim types for appointment three calendar are"
	SayFrame ("MCALClaimTypeAPPT3")
	return TRUE
endif
return FALSE
EndScript

Script ReadRemarks ()
if (StringContains(LastLine, msgt375_L)) then; "MCAL"
	SayFrame ("MCALRemarks")
	return TRUE
Elif (StringContains(LastLine, msgt379_L)) then; "INFO"
	SayFrame ("INFORemarks")
	return TRUE
Endif
return FALSE
EndScript

Script ReadAddress ()
if (StringContains(LastLine, msgt375_L)) then; "MCAL"
	SayMessage (OT_MESSAGE, msgt380_L); "field office address is"
	SayFrame ("FOAddress")
	return TRUE
Elif (StringContains(LastLine, msgt379_L)) then; "INFO"
	SayMessage (OT_MESSAGE, msgt380_L); "field office address is"
	SayFrame ("INFOAddressOne")
	SayFrame ("INFOAddressTwo")
	return TRUE
Endif
return FALSE
EndScript

Script ReadOfficeHours ()
if (StringContains(LastLine, msgt375_L)) then; "MCAL"
	SayMessage (OT_MESSAGE, msgt381_L); "Office hours are"
	SayFrame ("OfficeHours")
	return TRUE
Elif (StringContains(LastLine, msgt379_L)) then; "INFO"
	SayMessage (OT_MESSAGE, msgt381_L); "Office hours are"
	SayFrame ("INFOOfficeHours")
	return TRUE
Endif
return FALSE
EndScript

Script ReadPhoneNumbers ()
if (StringContains(LastLine, msgt379_L)) then; "INFO"
	SayMessage (OT_MESSAGE, msgt382_L); "General Inquiry number is"
	SayFrame ("INFOPhoneOne")
	SayMessage (OT_MESSAGE, msgt383_L); "FAX number is"
	SayFrame ("INFOPhoneFax")
	SayMessage (OT_MESSAGE, msgt384_L); "administrative number is"
	SayFrame ("INFOPhoneAdmin")
	SayMessage (OT_MESSAGE, msgt385_L); "T T Y number is"
	SayFrame ("INFOPhoneTTY")
	return TRUE
Endif
return FALSE
EndScript

Script  HotKeyHelp()
If (MCALH()) then return
elif (INFOH()) then return
elif (FREQH()) then return
elif (APPTSH()) then return

;MFQ
elif (MFQMH()) then return
elif (PIAEH()) then return
elif (DEQYH()) then return
elif (SSQMH()) then return
elif (PHUSH()) then return
elif (DEQMH()) then return
elif (MISMH()) then return
elif (CNQYH()) then return
elif (RQSLH()) then return
elif (PBRQH()) then return
elif (HIQRH()) then return
elif (MDBSH()) then return
elif (MMQSH()) then return
elif (ACLMH()) then return
elif (MAINH()) then return
elif (PEMUH()) then return
elif (PESLH()) then return
elif (PETSH()) then return
elif (PENCH()) then return
elif (PEPRH()) then return
elif (PEDTH()) then return
elif (PEDDH()) then return
elif (PEANH()) then return
elif (PEARH()) then return
elif (PEHSH()) then return
elif (PESTH()) then return
elif (MSSIH()) then return
elif (ESMUH()) then return
elif (DMMUH()) then return
endif
EndScript

int function MCALH()
if (StringContains(LastLine, msgt375_L)) then; "MCAL"
	SayMessage (OT_HELP, msgt386_L); "Press Control plus Shift plus C to find out what calendar is to"
	SayMessage (OT_HELP, msgt387_L); "be used for which claim types"
	SayMessage (OT_HELP, msgt388_L); "Press Control plus shift plus R to reed remarks"
	SayMessage (OT_HELP, msgt389_L); "Press control plus Shift plus O for field office hours"
	SayMessage (OT_HELP, msgt390_L); "Press control plus Shift plus eigh for office address"
	return TRUE
else
	return FALSE
endif
endfunction

int function INFOH()
If (StringContains(LastLine, msgt379_L)) then; "INFO"
	SayMessage (OT_HELP, msgt391_L); "Press Control plus shift plus R to reed remarks"
	SayMessage (OT_HELP, msgt392_L); "Press control plus Shift plus O for field office hours"
	SayMessage (OT_HELP, msgt393_L); "Press control plus Shift plus eigh for office address"
	SayMessage (OT_HELP, msgt394_L); "Press control plus shift plus p for office phone numbers"
	return TRUE
else
	return FALSE
Endif
endfunction

int function FREQH()
If (StringContains(LastLine, msgt50_L)) then; "FREQ"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function APPTSH()
If (StringContains(LastLine, msgt59_L)) then; "800S"
	SayMessage (OT_HELP, msgt397_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt398_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function MFQMH()
If (StringContains(LastLine, msgt74_L)) then; "MFQM"
	SayMessage (OT_HELP, msgt399_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt400_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PIAEH()
If (StringContains(LastLine, msgt103_L)) then; "PIAE"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function DEQYH()
If (StringContains(LastLine, msgt109_L)) then; "DEQY"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function SSQMH()
If (StringContains(LastLine, msgt120_L)) then; "SSQM"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PHUSH()
If (StringContains(LastLine, msgt126_L)) then; "PHUS"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function DEQMH()
If (StringContains(LastLine, msgt130_L)) then; "DEQM"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function MISMH()
If (StringContains(LastLine, msgt142_L)) then; "MISM"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function CNQYH()
If (StringContains(LastLine, msgt125_L)) then; "CNQY"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function RQSLH()
If (StringContains(LastLine, msgt167_L)) then; "RQSL"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PBRQH()
If (StringContains(LastLine, msgt175_L)) then
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function HIQRH()
If (StringContains(LastLine, msgt176_L)) then
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function MDBSH()
If (StringContains(LastLine, msgt181_L)) then; "MDBS"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function MMQSH()
If (StringContains(LastLine, msgt186_L)) then; "MMQS"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function ACLMH()
If (StringContains(LastLine, msgt190_L)) then; "ACLM"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function MAINH()
If (StringContains(LastLine, msgt205_L)) then; "MAIN"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PEMUH()
If (StringContains(LastLine, msgt242_L)) then
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PESLH()
If (StringContains(LastLine, msgt252_L)) then; "PESL"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PETSH()
If (StringContains(LastLine, msgt260_L)) then; "PETS"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PENCH()
If (StringContains(LastLine, msgt267_L)) then; "PENC"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PEPRH()
If (StringContains(LastLine, msgt272_L)) then
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PEDTH()
If (StringContains(LastLine, msgt276_L)) then; "PEDT"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PEDDH()
If (StringContains(LastLine, msgt283_L)) then; "PEDD"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PEANH()
If (StringContains(LastLine, msgt292_L)) then; "PEAN"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PEARH()
If (StringContains(LastLine, msgt299_L)) then; "PEAR"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PEHSH()
If (StringContains(LastLine, msgt304_L)) then; "PEHS"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function PESTH()
If (StringContains(LastLine, msgt315_L)) then; "PEST"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function MSSIH()
If (StringContains(LastLine, msgt329_L)) then
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function ESMUH()
If (StringContains(LastLine, msgt351_L)) then
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction

int function DMMUH()
If (StringContains(LastLine, msgt362_L)) then; "DMMU"
	SayMessage (OT_HELP, msgt395_L); "Press Control plus shift plus M for any questions that have more than one choice"
	SayMessage (OT_HELP, msgt396_L); "JAWS will reed the choices to you"
	return TRUE
else
	return FALSE
Endif
endfunction


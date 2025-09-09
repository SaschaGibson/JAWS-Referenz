; Copyright 1995-2015 Freedom Scientific, Inc.
; Whiz Wheel Support for the Millennium 20 and Millennium 40
; Rocker support for The Type Lite series

Include "HjConst.jsh";Default Hj Constants
Include"HjGlobal.jsh";Default Hj Globals
include"Common.jsm"
Include "FSI_ML.jsh"
Include "FSI_ML.jsm"


int function ReadSettingFromFile (int iWheel, int ByRef iVal)
var
	string strKey
If iWheel == WHEEL_LEFT then
	Let strKey = hKEY_LEFT
ElIf iWheel == WHEEL_RIGHT then
	Let strKey = hKEY_RIGHT
ElIf iWheel == WHEEL_SINGLE then
	Let strKey = hKEY_SINGLE
Else;INVALID OPTION!
	Return
EndIf
Return (iniReadInteger (SECTION_WHIZ, strKey, iVal, FILE_FSI))
EndFunction

int Function WriteSettingToFile (int iWheel, int iVal)
var
	string strKey
If iWheel == WHEEL_LEFT then
	Let strKey = hKEY_LEFT
ElIf iWheel == WHEEL_RIGHT then
	Let strKey = hKEY_RIGHT
ElIf iWheel == WHEEL_SINGLE then
	Let strKey = hKEY_SINGLE
Else;INVALID OPTION!
	Return
EndIf
Return iniWriteInteger (SECTION_WHIZ, strKey, iVal, FILE_FSI)
EndFunction

void Function BrlFSIInit ()
If IsWheelProgrammable () then
	Let GIProgrammable = MODE_PROGRAMMABLE
Else
	Let GIProgrammable = MODE_SINGLE
EndIf
;Now, initialize all relevant globals from the files.
; These receive default values from the ini file.  If not, we'll just leave them at lines,
;which is system default.
;This will protect both network users and those users who do not have proper file permissions
Let GIWhizSetting = ReadSettingFromFile (WHEEL_SINGLE, GIWhizSetting)
If ! GIWhizSetting then
	Let GIWhizSetting = WHIZ_LINE
EndIf
Let GILeftSetting = ReadSettingFromFile (WHEEL_LEFT, GILeftSetting)
If ! GILeftSetting then
	Let GILeftSetting = WHIZ_LINE
EndIf
Let GIRightSetting = ReadSettingFromFile (WHEEL_RIGHT, GIRightSetting)
If ! GIRightSetting then
	Let GIRightSetting = WHIZ_LINE
EndIf
let gILeftWheelSpeechMode = iniReadInteger (SECTION_FOCUS, hKEY_LeftWheelSpeechMode, 0, FILE_FSI)
let gIRightWheelSpeechMode = iniReadInteger (SECTION_FOCUS, hKEY_RightWheelSpeechMode, 0, FILE_FSI)
EndFunction

int function inReadOnlyEmailMessageUsingVirtualCursor ()
; ;override and return TRUE from within a read-only message that uses the virtual cursor.
; This should not explicitly return TRUE from your script, only return TRUE if in the actual message,
; so that next and prior email commands can function.
return FALSE
endFunction

String Function GetWhizWheelSettingName (int iSetting)
If iSetting == WHIZ_LINE then
	Return WHIZ_LINE_NAME
ElIf iSetting == WHIZ_SENTENCE then
	Return WHIZ_SENTENCE_NAME
ElIf iSetting == WHIZ_PARAGRAPH then
	Return WHIZ_PARAGRAPH_NAME
ElIf iSetting == WHIZ_FOCUS_PAN then
	Return WHIZ_FOCUS_PAN_NAME
elIf iSetting == WHIZ_EMAIL then
	return WHIZ_EMAIL_NAME
Else; error
	Return ""
EndIf
EndFunction

int function FSIWheelActionIsValidForBrailleStructure()
return !BrailleIsStructuredLine()
EndFunction

int Function IsValidWindow (handle hWnd)
var
	int iType
If IsVirtualPcCursor () then
	Return TRUE
EndIf
;Fix Forms Mode and single-line edits:
if isFormsModeActive ()
&& getJcfOption (OPT_AUTO_FORMS_MODE) > 0
&& getObjectSubtypeCode () == WT_EDIT then
	return TRUE
endIf
;Structured Lines appear in virtual cursor, but they work then.
;Elsewhere, we want to default to lines as on the squeaks themselves
If !FSIWheelActionIsValidForBrailleStructure()
	Return FALSE
EndIf
If GlobalMenuMode then
	Return FALSE;Never valid
EndIf
If iType == WT_READONLYEDIT
|| iType == WT_MULTILINE_EDIT
|| ! iType then
	Return TRUE
Else
	Return FALSE
EndIf
EndFunction

int Function IsValidListWindowForFocus (handle hWnd)
var
	int iWinType
If IsValidWindow(hWnd) then
	Return FALSE
EndIf
Let iWinType = GetWindowSubTypeCode (hWnd)
if (! iWinType)
	iWinType = getObjectSubtypeCode(SOURCE_CACHED_DATA)
endIf
;For valid List Types
;This validates List Mode on the whiz wheels
If iWinType == WT_LISTVIEW || iWinType == WT_LISTVIEWITEM then
	Return TRUE
ElIf iWinType == WT_LISTBOX || iWinType == WT_LISTBOXITEM then
	Return TRUE
ElIf iWinType == WT_MULTISELECT_LISTBOX then
	Return TRUE
ElIf iWinType == WT_EXTENDEDSELECT_LISTBOX then
	Return TRUE
ElIf iWinType == WT_TREEVIEW || iWinType == WT_TREEVIEWITEM then
	Return TRUE
ElIf iWinType == WT_COMBOBOX then
	Return TRUE
ElIf iWinType == WT_EDITCOMBO then
	Return TRUE
;Not list, but needs List Mode to allow navigation between items in group
ElIf iWinType == WT_RADIOBUTTON then
	Return TRUE
ElIf iWinType == WT_TASKBAR then
	Return TRUE
ElIf iWinType == WT_SYSTRAY then
	Return TRUE
ElIf iWinType == WT_TABCONTROL then
	Return TRUE
ElIf GetGroupBoxName () then;Allow List Mode inside a group
	Return TRUE
EndIf
Return FALSE
EndFunction

int function ListModeToggle ()
var
	handle hWnd,
	int nSubType
Let hWnd = GetFocus ()
Let nSubType = GetWindowSubTypeCode (hWnd)
if (! nSubType)
	if (! isVirtualPcCursor ())
		nSubType = getObjectSubtypeCode(SOURCE_CACHED_DATA)
	endIf
endIf
If BrailleSimulateClick(nSubType) then
	Return TRUE
EndIf
If GiListMode then
	Let GIListMode = OFF
	SayFormattedMessage (OT_STATUS, cMsgListModeOff)
	Return TRUE;Toggled
EndIf
If ! IsValidListWindowForFocus(hWnd) then
	Return FALSE;No change
EndIf
If nSubType == WT_TASKBAR then
	Let GIListMode = LIST_LEFTRIGHT
ElIf nSubType == WT_SYSTRAY then
	Let GIListMode = LIST_LEFTRIGHT
ElIf nSubType == WT_TOOLBAR ||
GetWindowClass (hWnd) == cwcMsoCmd then
	Let GIListMode = LIST_LEFTRIGHT
ElIf nSubType == WT_TABCONTROL then
	Let GIListMode = LIST_LEFTRIGHT
Else
	Let GIListMode = LIST_UPDOWN
EndIf
SayFormattedMessage (OT_STATUS, cMsgListModeOn)
Return TRUE;Toggled
EndFunction

int Function DoListMode (int iDirection, handle hWnd)
If ! IsValidListWindowForFocus (hWnd) then
	Let GiListMode = OFF
	Return FALSE
EndIf
If ! GIListMode then
	Return FALSE
ElIf GiListMode == LIST_LEFTRIGHT then
	If iDirection == up then
		SaveCursor ()
		PCCursor ()
		PriorCharacter ()
		RestoreCursor ()
	Else
		SaveCursor ()
		PCCursor ()
		NextCharacter ()
		RestoreCursor ()
	EndIf
	Return TRUE
ElIf GIListMode == LIST_UPDOWN then
	If iDirection == up then
		SaveCursor ()
		PCCursor ()
		PriorLine ()
		RestoreCursor ()
	Else
		SaveCursor ()
		PCCursor ()
		NextLine ()
		RestoreCursor ()
	EndIf
	Return TRUE
Else
	Return FALSE
EndIf
EndFunction

;Focus Panning options:
;Move the system cursor up and down vertically,
;Instead of the panning option
void Function FocusPanLeft ()
If BraillePanLeft () then
	Return
EndIf
PriorLine ();Update cursor to be consistent with other Whiz Wheel functions
;Next two lines not valid because ExpandCurrentWord breaks.
;While BraillePanRight ()
;EndWhile
SaveCursor ()
BrailleCursor ()
JAWSEnd ()
EndFunction

void Function FocusPanRight ()
If BraillePanRight () then
	Return;
EndIf
NextLine ();Consistent with other Whiz functions.
;Next two lines not valid because ExpandCurrentWord breaks.
;While BraillePanLeft ()
;EndWhile
SaveCursor ()
BrailleCursor ()
JAWSHome ()
EndFunction

void function DoFSIWheelActionForSpeechBoxMode(int direction)
If direction == up then
	BraillePriorLine ()
Else
	BrailleNextLine ()
EndIf
EndFunction

void function DoFSIWheelActionMoveByLine(int direction)
If direction == Up
	PriorLine (INP_BrailleDisplay)
Else
	NextLine (INP_BrailleDisplay)
EndIf
EndFunction

void function DoFSIWheelActionForPanning(int direction)
If direction == up
	FocusPanLeft()
Else
	FocusPanRight()
EndIf
EndFunction

void function DoFSIWheelActionForLine(int direction)
If direction == up
	if GetJCFOption(optHTMLDocumentPresentationMode)
	&& InTable()
		UpCell()
	else
		PriorLine(INP_BrailleDisplay)
	EndIf
Else
	if GetJCFOption(optHTMLDocumentPresentationMode)
	&& InTable()
		DownCell()
	else
		NextLine(INP_BrailleDisplay)
	EndIf
EndIf
EndFunction

int function DoFSIWheelActionForSentence(int direction)
var int isValid = IsValidWindow(GetFocus())
If direction == up then
	If isValid
		return !PriorSentence(INP_BrailleDisplay)
	Else
		PriorLine(INP_BrailleDisplay)
		return false
	EndIf
Else
	If isValid
		return !NextSentence(INP_BrailleDisplay)
	Else
		NextLine(INP_BrailleDisplay)
		return false
	EndIf
EndIf
EndFunction

int function DoFSIWheelActionForParagraph(int direction)
var int isValid = IsValidWindow(GetFocus())
If direction == up
	If IsValid
		return !PriorParagraph(INP_BrailleDisplay)
	Else
		PriorLine(INP_BrailleDisplay)
		return false
	EndIf
Else
	If IsValid
		return !NextParagraph(INP_BrailleDisplay)
	Else
		NextLine(INP_BrailleDisplay)
		return false
	EndIf
EndIf
EndFunction

int function DoFSIWheelActionForEmailMessage (int direction)
if ! inReadOnlyEmailMessageUsingVirtualCursor () then
	return DoFSIWheelActionForLine(direction)
endIf
var int searchDirection ; for email using s_constants.
if direction == up then
	searchDirection = s_prior
else
	searchDirection = s_next
endIf
var string sentBy, string sentAt
if searchDirection == s_Next then
	PerformScript MoveToNextEmail ()
	return TRUE
elif SearchDirection == S_Prior then
	PerformScript MoveToPriorEmail ()
	return TRUE
endIf
return FALSE
endFunction

Void Function DoWhizWheelAction(int iDirection, int iWheel, int ByRef iWheelSetting,optional  int isSameScript)
var
	int iSetting
If GetJcfOption(OPT_BRL_MODE) == BRL_MODE_SPEECHBOX
	DoFSIWheelActionForSpeechBoxMode(iDirection)
	Return
EndIf
If GlobalMenuMode
&& GetWindowClass(GetFocus()) != cwcMSOCmd then;Office bars
	DoFSIWheelActionMoveByLine(iDirection)
	Return
EndIf
;GIIsSpecialMove is where JAWS keeps track of whether or not the previous move on the wheel was effective.
;GIIsSpecialMoveLeft and GIIsSpecialMoveRight keep trak for the individual whiz wheels.
;These are represented by iWheelSetting
If isSameScript
&& iWheelSetting
	DoFSIWheelActionMoveByLine(iDirection)
	return
EndIf
iWheelSetting = FALSE; Reset for the given wheel.  If the single programmable option is on, both are affected.
;Establish the wheel whose global line/sentence/paragr. to monitor
If iWheel == WHEEL_LEFT then
	iSetting = GILeftSetting
ElIf iWheel == WHEEL_RIGHT then
	iSetting = GIRightSetting
Else
	iSetting = GIWhizSetting
EndIf
iWheelSetting = iSetting
If iSetting == WHIZ_SENTENCE
	iWheelSetting = DoFSIWheelActionForSentence(iDirection)
ElIf iSetting == WHIZ_PARAGRAPH
	iWheelSetting = DoFSIWheelActionForParagraph(iDirection)
ElIf iSetting == WHIZ_FOCUS_PAN then
	DoFSIWheelActionForPanning(iDirection)
elIf iSetting == WHIZ_EMAIL then
	DoFSIWheelActionForEmailMessage (iDirection) ; defaults to line outside of email messages.
Else
	DoFSIWheelActionForLine(iDirection)
EndIf
EndFunction

void Function DoWheelsXY (int iDirection, int iWheel, int ByRef iWheelSetting, int iSameScript)
If iWheel == WHEEL_LEFT then
	;Lines:
	If iDirection == up then
		BraillePriorLine ()
	Else
		BrailleNextLine ()
	EndIf
ElIf iWheel == WHEEL_RIGHT then
	;Panning:
	If iDirection == up then
		If ! BraillePanLeft () then
			;Do something interesting
		EndIf
	Else
		If ! BraillePanRight () then
			;Do something interesting.
		EndIf
	EndIf
EndIf
EndFunction

void function handleWheelSpeech (int wheel)
if wheel == WHEEL_LEFT && ! gILeftWheelSpeechMode then return endIf
if wheel == WHEEL_Right && ! gIRightWheelSpeechMode then return endIf
if isKeyWaiting () then return endIf
var int wheelSetting
if wheel == wheel_left then
	wheelSetting = GILeftSetting
elIf wheel == WHEEL_RIGHT then
	wheelSetting = GIRightSetting
else
	wheelSetting = GIWhizSetting
endIf
if wheelSetting == Whiz_Line then
	sayLine ()
elIf wheelSetting == Whiz_Sentence then
	saySentence ()
elIf wheelSetting == Whiz_Paragraph then
	SayParagraph ()
endIf
endFunction

void function DoFocusWheelAction(int iDirection, int iWheel, int ByRef iWheelSetting,optional  int iSameScript)
var
	handle hFocus
If GetJcfOption (OPT_BRL_MODE) == BRL_MODE_SPEECHBOX then
	DoFSIWheelActionForSpeechBoxMode(iDirection)
	Return
EndIf
If giXYMode then
	DoWheelsXY(iDirection, iWheel, iWheelSetting, iSameScript)
	Return
EndIf
Let hFocus = GetFocus ()
If GlobalMenuMode
&& GetWindowClass (hFocus) != cwcMSOCmd then;Office bars
	DoFSIWheelActionMoveByLine(iDirection)
	Return
EndIf
If IsValidWindow(hFocus) then
	DoWhizWheelAction (iDirection, iWheel, iWheelSetting, iSameScript)
	handleWheelSpeech (iWheel)
	Return
EndIf
If DoListMode (iDirection, hFocus) then
	Return;
EndIf
If iDirection == up then
	ShiftTabKey ()
Else
	TabKey ()
EndIf
EndFunction

int Function IsWheelProgrammable ()
var
	int iPrgSetting
Let iPRGSetting = GIProgrammable
If ! iPrgSetting then
	Let iPrgSetting = iniReadInteger (SECTION_OPTIONS, hKey_DIFF, FALSE, FILE_FSI)
EndIf
;Now use iPrgSetting to simply return TRUE or FALSE
If GIProgrammable == MODE_SINGLE then
	Let iPrgSetting = FALSE
Else
	Let iPrgSetting = TRUE
EndIf
Return iPRGSetting
EndFunction

int Function ChangeModeSetting ()
var
	int iSetting
If IsWheelProgrammable () then
	Let iSetting = MODE_PROGRAMMABLE
Else
	Let iSetting = MODE_SINGLE
EndIf
Let GIProgrammable = iSetting
iniWriteInteger (SECTION_OPTIONS, hKey_DIFF, iSetting, FILE_FSI)
Return iSetting
EndFunction

int Function ChangeWheelSetting (int iWheel, int ByRef iWheelGlobal)
var int maxSetting
if inReadOnlyEmailMessageUsingVirtualCursor () then
	MaxSetting = WHIZ_EMAIL
else
	MaxSetting = WHIZ_FOCUS_PAN
endIf
If iWheelGlobal < maxSetting then
	Let iWheelGlobal = iWheelGlobal+1
Else
	Let iWheelGlobal = WHIZ_LINE
EndIf
;Now write to file and exit with setting
;Even if the File Write fails JAWS will remember the setting for this session.
WriteSettingToFile (iWheel, iWheelGlobal)
Return iWheelGlobal
EndFunction

void Function SetWheel (optional int iWheel)
var
	int iSetting,
	string NewSettingName
If iWheel == WHEEL_LEFT then
	Let iSetting = ChangeWheelSetting (iWheel, GILeftSetting)
ElIf iWheel == WHEEL_RIGHT then
	Let iSetting = ChangeWheelSetting (iWheel, GIRightSetting)
ElIf iWheel == WHEEL_SINGLE then
	Let iSetting = ChangeWheelSetting (iWheel, GIWhizSetting)
Else;Error
	Return
EndIf
Let NewSettingName = GetWhizWheelSettingName (iSetting)
Say (NewSettingName, ot_status)
EndFunction

int function WhizWheelsShutdown ()
Let GIDeadWheel=(! GIDeadWheel)
;Return the opposite, because
;0 = wheels on,
;1 = wheels off.
Return (! GIDeadWheel)
EndFunction

int function BrailleSimulateClick (int nSubType)
var
	string sGroupName
;testing for checkbox must preceed testing for groupbox:
if nSubType == WT_CHECKBOX then
	TypeKey(cksSpace, INP_BrailleDisplay)
	Return TRUE
EndIf
Let sGroupName = GetGroupBoxName()
If sGroupName then
	Return FALSE
EndIf
If GlobalMenuMode then
	EnterKey (INP_BrailleDisplay)
	Return TRUE
ElIf nSubType == WT_STARTBUTTON then
	TypeKey(cksSpace, INP_BrailleDisplay)
	Return TRUE
ElIf nSubType == WT_BUTTON then
	TypeKey(cksSpace, INP_BrailleDisplay)
	Return TRUE
Else
	Return FALSE
EndIf
EndFunction

string Function WhizWheelsOption (int iRetCurVal)
If ! iRetCurVal then
	;Update it.
	WhizWheelsShutdown ()
EndIf
;0 = On, 1 = off
If ! GIDeadWheel then
	Return cmsg_on
Else
	Return cmsg_off
EndIf
EndFunction

string Function WhizWheelsXYOption (int iRetCurVal)
var
	int nActiveCursor
If ! iRetCurVal then
	;Update it:
	Let giXYMode = !giXYMode;
EndIf
If giXYMode then
	Let nActiveCursor = GetActiveCursor ()
	;BrailleCursor ()
	;SetRestriction (Restrictnone)
	;SetActiveCursor (nActiveCursor)
	Return cmsgWheelsTrackBrlCursor
Else
	Let nActiveCursor = GetActiveCursor ()
	;BrailleCursor ()
	;SetRestriction (RestrictAppWindow)
	;SetActiveCursor (nActiveCursor)
	Return cmsgWheelsTrackFocus
EndIf
EndFunction

void function WheelsTracking ()
SayFormattedMessage (OT_USER_REQUESTED_INFORMATION,
WhizWheelsXYOption (0))
EndFunction

void function PressBothWheels ()
var
	int iNewSetting
If GIDeadWheel then
	Return;
EndIf
Let iNewSetting = ChangeModeSetting ()
If iNewSetting == MODE_SINGLE then
	Say (WHIZ_SINGLE_NAME, ot_status)
Else
	Say (WHIZ_PROGRAMMABLE_NAME, ot_status)
EndIf
EndFunction

void function PressLeftWhizWheel ()
If GIDeadWheel then
	Return;
EndIf
If GetJcfOption (OPT_BRL_MODE) == BRL_MODE_SPEECHBOX then
	Return
EndIf
If IsWheelProgrammable () then
	SetWheel (WHEEL_LEFT)
Else
	SetWheel (WHEEL_SINGLE)
EndIf
EndFunction

void function LeftWhizWheelUp ()
var
	int iSameScript
If GIDeadWheel then
	Return;
EndIf
Let iSameScript = IsSameScript ()
If IsWheelProgrammable () then
	DoWhizWheelAction (UP, WHEEL_LEFT, GILeftIsSpecialMove, iSameScript)
Else
	DoWhizWheelAction (UP, WHEEL_SINGLE, GIIsSpecialMove, iSameScript)
EndIf
EndFunction

void function LeftWhizWheelDown ()
var
	int iSameScript
If GIDeadWheel then
	Return;
EndIf
Let iSameScript = IsSameScript ()
If IsWheelProgrammable () then
	DoWhizWheelAction (DOWN, WHEEL_LEFT, GILeftIsSpecialMove, iSameScript)
Else
	DoWhizWheelAction (DOWN, WHEEL_SINGLE, GIIsSpecialMove, iSameScript)
EndIf
EndFunction

void function PressRightWhizWheel ()
If GIDeadWheel then
	Return;
EndIf
If GetJcfOption (OPT_BRL_MODE) == BRL_MODE_SPEECHBOX then
	Return
EndIf
If IsWheelProgrammable () then
	SetWheel (WHEEL_RIGHT)
Else
	SetWheel (WHEEL_SINGLE)
EndIf
EndFunction

void function RightWhizWheelUp ()
var
	int iSameScript
If GIDeadWheel then
	Return;
EndIf
Let iSameScript = IsSameScript ()
If IsWheelProgrammable () then
	DoWhizWheelAction (UP, WHEEL_RIGHT, GIRightIsSpecialMove, iSameScript)
Else
	DoWhizWheelAction (UP, WHEEL_SINGLE, GIIsSpecialMove, iSameScript)
EndIf
EndFunction

void function RightWhizWheelDown ()
var
	int iSameScript
If GIDeadWheel then
	Return;
EndIf
Let iSameScript = IsSameScript ()
If IsWheelProgrammable () then
	DoWhizWheelAction (DOWN, WHEEL_RIGHT, GIRightIsSpecialMove, iSameScript)
Else
	DoWhizWheelAction (DOWN, WHEEL_SINGLE, GIIsSpecialMove, iSameScript)
EndIf
EndFunction

void function RightFocusWhizWheelDown ()
var
	int iSameScript
If GIDeadWheel then
	Return;
EndIf
Let iSameScript = IsSameScript ()
If IsWheelProgrammable () then
	DoFocusWheelAction(DOWN, WHEEL_RIGHT, GIRightIsSpecialMove, iSameScript)
Else
	DoFocusWheelAction(DOWN, WHEEL_SINGLE, GIIsSpecialMove, iSameScript)
EndIf
EndFunction

void function RightFocusWhizWheelUp ()
var
	int iSameScript
If GIDeadWheel then
	Return;
EndIf
Let iSameScript = IsSameScript ()
If IsWheelProgrammable () then
	DoFocusWheelAction(UP, WHEEL_RIGHT, GIRightIsSpecialMove, iSameScript)
Else
	DoFocusWheelAction(UP, WHEEL_SINGLE, GIIsSpecialMove, iSameScript)
EndIf
EndFunction

void function LeftFocusWhizWheelUp ()
var
	int iSameScript
If GIDeadWheel then
	Return;
EndIf
Let iSameScript = IsSameScript ()
If IsWheelProgrammable () then
	DoFocusWheelAction(UP, WHEEL_LEFT, GILeftIsSpecialMove, iSameScript)
Else
	DoFocusWheelAction(UP, WHEEL_SINGLE, GIIsSpecialMove, iSameScript)
EndIf
EndFunction

void function LeftFocusWhizWheelDown ()
var
	int iSameScript
If GIDeadWheel then
	Return;
EndIf
Let iSameScript = IsSameScript ()
If IsWheelProgrammable () then
	DoFocusWheelAction(DOWN, WHEEL_LEFT, GILeftIsSpecialMove, iSameScript)
Else
	DoFocusWheelAction(DOWN, WHEEL_SINGLE, GIIsSpecialMove, iSameScript)
EndIf
EndFunction

void function PressRightFocusWheel ()
If GetJcfOption (OPT_BRL_MODE) == BRL_MODE_SPEECHBOX then
	Return
EndIf
If giXYMode then
	SayMessage (OT_USER_REQUESTED_INFORMATION, cmsgFullScreenRightWheel)
	Return
EndIf
If ! ListModeToggle() then
	PressRightWhizWheel ()
EndIf
EndFunction

void function PressLeftFocusWheel ()
If GetJcfOption (OPT_BRL_MODE) == BRL_MODE_SPEECHBOX then
	Return
EndIf
If giXYMode then
	SayMessage (OT_USER_REQUESTED_INFORMATION, cmsgFullScreenLeftWheel)
	Return
EndIf
If ! ListModeToggle() then
	PressLeftWhizWheel ()
EndIf
EndFunction

;Type Lite Keys handled here so document (JSD) can reference rockers
void function FSRightRockerUp ()
PriorLine ()
EndFunction

void function FSRightRockerDown ()
NextLine ()
EndFunction

;************
;Left Rockers for now simulate BraillePriorLine and BrailleNextLine
;We include entries here so that the documentation (jsd) information can reflect Type Lite.

void function FSLeftRockerUp ()
PerformScript BraillePriorLine ()
EndFunction

void function FSLeftRockerDown ()
PerformScript BrailleNextLine ()
EndFunction

int function DeviceHasWhizWheels()
var
	string sDev,
 	string sName,
	string sPort
BrailleGetDeviceInfo(sDev, sName, sPort)
return sName == csDevName_FSBRL
	|| sName == csDevName_ML20
	|| sName == csDevName_ML40
EndFunction

void function WhizWheelsOnOff ()
If WhizWheelsShutdown() then
	SayFormattedMessage (ot_status, cMsgWheelsOn)
Else
	SayFormattedMessage (ot_status, cMsgWheelsOff)
EndIf
EndFunction

void function LeftWheelSpeechModeToggle ()
gILeftWheelSpeechMode = ! gILeftWheelSpeechMode
if gILeftWheelSpeechMode then
	sayMessage (OT_STATUS, cmsgOn)
else
	sayMessage (OT_STATUS, cmsgOff)
endIf
iniWriteInteger (SECTION_FOCUS, hKEY_LeftWheelSpeechMode, gILeftWheelSpeechMode, FILE_FSI, TRUE)
endFunction

void function RightWheelSpeechModeToggle ()
gIRightWheelSpeechMode = ! gIRightWheelSpeechMode
if gIRightWheelSpeechMode then
	sayMessage (OT_STATUS, cmsgOn)
else
	sayMessage (OT_STATUS, cmsgOff)
endIf
iniWriteInteger (SECTION_FOCUS, hKEY_RightWheelSpeechMode, gIRightWheelSpeechMode, FILE_FSI, TRUE)
endFunction

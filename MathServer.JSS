; Copyright 2014 - 2025 by Freedom Scientific, Inc.

include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "MathServer.jsm"

globals
	int giFN_Tutor, ; for scheduling the TutorMessageEvent
	int gbScreenSensitiveHelpActive, ; to properly launch HotKeyHelp from the ScreenSensitiveHelp window.
object gMathContent,
object gMathEvents,
object gMathUIA,
int gMathNavigationMode,
int gMathStackReadingMode,
int gSavedAutoPanMode,
int gSavedBrailleMode,
string g_mathContent,
int g_brailleCursorOffset

const
MathEquationNavigation = 1,
MathStackNavigation = 2,
mathLongDivisionNavigation = 3,
MathTableNavigation = 4,
MathStackReadRow = 0,
MathStackReadColumn = 1

script ScriptFileName()
ScriptAndAppNames(msgMathServerAppFileName)
EndScript

Script SwitchBrailleMathCode()
	PerformScript SwitchBrailleMathCode()
	UpdateBrailleMath()
EndScript

Script ChangeContractedBrailleSetting(optional int index)
	PerformScript ChangeContractedBrailleSetting(index)
	UpdateBrailleMath()
EndScript

void function AutoStartEvent()
gMathUIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" );
if ( ! gMathUIA )
return
EndIf
gSavedBrailleMode = GetJCFOption(OPT_BRL_MODE)
gSavedAutoPanMode = GetJCFOption(OPT_BRL_AUTOPAN_MODE)
EnableBrailleMathSettings()
EndFunction

void function AutoFinishEvent()
var object nullObject;

ClearContent()
gMathUIA = nullObject;
gbScreenSensitiveHelpActive = OFF
DisableBrailleMathSettings()
EndFunction

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
if giFN_tutor then
	UnScheduleFunction (giFN_tutor)
	giFN_Tutor = 0
endIf
tutorMessageEvent(hwndFocus, nMenuMode)
endFunction

void Function InitContent()
var int threadID = GetWindowThreadID();
gMathContent = GetObject ("!MathServer.MathContent:" + IntToString( threadID ));
if ! gMathContent
return
EndIf

InitEvents()
EndFunction

void function ClearContent()
var object nullObject;

ClearEvents()
gMathContent = nullObject;
EndFunction

void function InitEvents()
ClearEvents();

gMathEvents = gMathContent.Events;
if ! gMathEvents
return
EndIf

if ( ! ComAttachEvents( gMathEvents, "MathEvent_" ) )
return
EndIf
EndFunction

void function ClearEvents()
var object nullObject;

ComDetachEvents( gMathEvents );
gMathEvents.Clear();

gMathEvents = nullObject;
EndFunction

int function IsPortal()
if ! gMathUIA
return false;
EndIf

if GlobalMenuMode
	return false
Endif

;exclude virtual viewer for ScreenSensitiveHelp:
if UserBufferIsActive () || ! IsPcCursor () then return Endif
var object o = gMathUIA.GetFocusedElement();
if ! o
return false;
EndIf

var String wndClass = GetWindowClass(GetFocus())

if o.AutomationID == "MathPortal"
|| o.AutomationID == "ExpressionRenderer"
|| o.FrameWorkId == "InternetExplorer"
|| wndClass == "Shell DocObject View"
|| wndClass == "Internet Explorer_Server"
|| o.ClassName == "Shell DocObject View"
	return true;
EndIf

return false
EndFunction

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)

FocusChangedEventEx (
	hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild,
	nChangeDepth)

if IsPortal()
	InitContent()
	MathEvent_OnNavigationModeChanged( gMathContent.Mode )
	EnableBrailleMathSettings()
else
	ClearContent()
	DisableBrailleMathSettings()
EndIf
EndFunction

void function BrailleRoutingButton(int nCell)
; nCell is 1-based, but we need a 0-based offset. So subtract 1.
var int displayOffset = nCell - 1

; The display offset is based on the translated string on the display.
; We need the offset into the original string sent to FSBraille.
var int dataOffset = BrailleGetDataOffsetFromDisplayOffset(displayOffset)

if (dataOffset >= 0)
	var int modePreRouting = gMathNavigationMode
	gMathContent.SetBrailleCursorPosition(dataOffset)

	if (modePreRouting == MathEquationNavigation)
		var string message = gMathContent.GetBraille()
		var string breakableOffsets = gMathContent.GetBrailleBreakableOffsets()
		PushBrailleMathString(message, dataOffset, breakableOffsets)
	endIf
endIf
EndFunction

void function UpdateBrailleMath()
	if !IsMathBrailleAvailable() then
		PushBrailleMathString(msgContractedBrailleMustBeEnabled, 0, "")
		return
	endIf
	var string message = gMathContent.GetBraille()
	var int caretPosition = gMathContent.GetBrailleCursorPosition()
	var string breakableOffsets = gMathContent.GetBrailleBreakableOffsets()
	PushBrailleMathString(message, caretPosition, breakableOffsets)
	g_mathContent=message
	g_brailleCursorOffset=caretPosition;
EndFunction

void function EnableBrailleMathSettings()
SetJCFOption(OPT_BRL_MODE, BRL_MODE_PUSH)
SetJCFOption(OPT_BRL_AUTOPAN_MODE, brlAutoPanMinimal)
EndFunction

void function DisableBrailleMathSettings()
SetJCFOption(OPT_BRL_MODE, gSavedBrailleMode)
SetJCFOption(OPT_BRL_AUTOPAN_MODE, gSavedAutoPanMode)
EndFunction

void Function SpellWordHook (string ScriptName)
if ! IsPortal() then
	return SpellWordHook (ScriptName)
endIf
var int ShouldSpeakInfo
if (ScriptName == "SayNextWord") then
	NextWord ()
	ShouldSpeakInfo = TRUE
ElIf (ScriptName == "SayPriorWord") then
	PriorWord ()
	ShouldSpeakInfo = TRUE
elIf (ScriptName == "SayNextCharacter") then
	NextCharacter ()
	ShouldSpeakInfo = TRUE
elIf (ScriptName == "SayPriorCharacter") then
	PriorCharacter ()
	ShouldSpeakInfo = TRUE
EndIf
if ShouldSpeakInfo then
	Say( gMathContent.GetDescriptionOfFocusedItemEx( 3 ), OT_SPELL);
	return FALSE
else
RemoveHook (HK_SCRIPT, "SpellWordHook")
return true
endIf
EndFunction

Script SayLine()
if ! IsPortal()
SayLine();
return;
EndIf
var int OutputType
if IsSameScript () then OutputType = OT_SPELL else OutputType = OT_LINE endIf
Say( gMathContent.GetDescriptionInContextEx( 3 ), OutputType);
gMathStackReadingMode = MathStackReadRow
EndScript

Script SayWord()
if ! IsPortal()
SayWord();
return;
EndIf
If (IsSameScript ()) Then
	Say( gMathContent.GetDescriptionOfFocusedItemEx( 3 ), OT_SPELL);
	AddHook (HK_SCRIPT, "SpellWordHook")
Else
	; Use output type Line to keep extra speech punctuation from speaking.
	Say( gMathContent.GetDescriptionOfFocusedItemEx( 3 ), OT_LINE);
endIf
gMathStackReadingMode = MathStackReadColumn
EndScript

Script SayCharacter()
if ! IsPortal()
SayCharacter();
return;
EndIf
If (IsSameScript ()) Then
; Use the SpellWordHook because this is the same for both sets of scripts.
;If character and word behavior become different, we can separte these out like default does.
;By default, the Character hook does a lot more than spell, and spell is what we need here.
	Say( gMathContent.GetDescriptionOfFocusedItemEx( 3 ), OT_SPELL);
	AddHook (HK_SCRIPT, "SpellWordHook")
Else
	; Use output type Line to keep extra speech punctuation from speaking.
	Say( gMathContent.GetDescriptionOfFocusedItemEx( 3 ), OT_LINE);
endIf
gMathStackReadingMode = MathStackReadColumn
EndScript

Script SayNextWord()
if ! IsPortal()
PerformScript SayNextWord();
return;
EndIf

gMathStackReadingMode = MathStackReadColumn
TypeCurrentScriptKey ()
EndScript

Script SayPriorWord()
if ! IsPortal()
PerformScript SayPriorWord();
return;
EndIf

gMathStackReadingMode = MathStackReadColumn
TypeCurrentScriptKey ()
EndScript

Script TopOfFile()
if ! IsPortal()
PerformScript TopOfFile();
return;
EndIf

gMathStackReadingMode = MathStackReadColumn
TypeCurrentScriptKey ()
EndScript

Script BottomOfFile()
if ! IsPortal()
PerformScript BottomOfFile();
return;
EndIf

gMathStackReadingMode = MathStackReadColumn
TypeCurrentScriptKey ()
EndScript

Script ControlUpArrow()
if ! IsPortal()
PerformScript ControlUpArrow();
return;
EndIf

gMathStackReadingMode = MathStackReadColumn
TypeCurrentScriptKey ()
EndScript

Script ControlDownArrow()
if ! IsPortal()
PerformScript ControlDownArrow();
return;
EndIf

gMathStackReadingMode = MathStackReadColumn
TypeCurrentScriptKey ()
EndScript

Script PriorCell()
if !IsPortal()
	PerformScript PriorCell()
	return;
EndIf
TypeCurrentScriptKey()
EndScript

Script NextCell()
if !IsPortal()
	PerformScript NextCell();
	return;
EndIf
TypeCurrentScriptKey()
EndScript

Script UpCell()
if !IsPortal()
	PerformScript UpCell();
	return;
EndIf
TypeCurrentScriptKey()
EndScript

Script DownCell()
if !IsPortal()
	PerformScript DownCell();
	return;
EndIf
TypeCurrentScriptKey()
EndScript

Script ReadWordInContext()
if IsMathCatEnabled() == 0 then
	PerformScript ReadWordInContext()
EndIf
var string tablePosition = gMathContent.GetDescriptionInContextEx( 7 )
if stringIsBlank(tablePosition)
	SayMessage (OT_ERROR, msgWordInContextErrorMathViewer)
else
	SayUsingVoice(VCTX_MESSAGE, tablePosition, OT_USER_REQUESTED_INFORMATION)
EndIf
EndScript

Script SayBottomLineOfWindow()
if ! IsPortal()
SayBottomLineOfWindow();
return;
EndIf

; we specifically do not call the function SaySummary here
; because that function has some extra code for tables that should be processed only when the navigation type changes
Say( gMathContent.GetSummary(), OT_LINE );
EndScript

void function SaySummary()
if ! IsPortal()
return;
EndIf

SayEvent( gMathContent.GetSummary() );

if ( gMathNavigationMode == MathTableNavigation )
SayEvent( gMathContent.GetDescriptionInContextEx( 3 ) );
EndIf
EndFunction

void function PerformSayLine()
PerformScript SayLine();
EndFunction

void function SayEvent( string message )
Say( message, OT_LINE);
EndFunction

string function GetNavigationModeName( int mode )
if ( mode == MathEquationNavigation )
return msgEquationNavigation
elif ( mode == MathStackNavigation )
return msgStackNavigation;
elif ( mode == MathLongDivisionNavigation )
return msgLongDivisionNavigation;
elif ( mode == MathTableNavigation )
return msgTableNavigation;
EndIf

return "";
EndFunction

void function MathEvent_OnNavigationModeChanged( int mode )
gMathNavigationMode = mode;

if ( mode == MathStackNavigation
|| mode == MathLongDivisionNavigation )
gMathStackReadingMode = MathStackReadRow
EndIf

var string modeName = GetNavigationModeName( mode );
Say( modeName, OT_CONTROL_NAME);

; the function is scheduled because jaws sometimes speaks the summary too quickly when the window opens
ScheduleFunction ("SaySummary", 1)
giFN_tutor = ScheduleFunction ("TutorMessageEvent", 4)
UpdateBrailleMath()
EndFunction

void function MathEvent_OnNavigationText( String text )
SayEvent( text );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnJumpedToElement()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnNextSubequation()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnPriorSubequation()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnParentSubequation()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnFirstChildSubequation()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_NoNextSubequation()
SayEvent( msgNoNextSubequation );
EndFunction

void function MathEvent_NoPriorSubequation()
SayEvent( msgNoPriorSubequation );
EndFunction

void function MathEvent_NoParentSubequation()
SayEvent( msgNoParentSubequation );
EndFunction

void function MathEvent_NoFirstChildSubequation()
SayEvent( msgNoChildSubequation );
EndFunction

void function MathEvent_OnStackNextRow()
if ( gMathNavigationMode == MathStackNavigation
|| gMathNavigationMode == MathLongDivisionNavigation )
&& gMathStackReadingMode == MathStackReadColumn
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 2 ) );
return
EndIf

SayEvent( gMathContent.GetDescriptionInContextEx( 2 ) );
EndFunction

void function MathEvent_OnStackPriorRow()
if ( gMathNavigationMode == MathStackNavigation
|| gMathNavigationMode == MathLongDivisionNavigation )
&& gMathStackReadingMode == MathStackReadColumn
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 2 ) );
return
EndIf

SayEvent( gMathContent.GetDescriptionInContextEx( 2 ) );
EndFunction

void function MathEvent_NoStackNextRow()
SayEvent( msgNoStackNextRow );
EndFunction

void function MathEvent_NoStackPriorRow()
SayEvent( msgNoStackPriorRow );
EndFunction

void function MathEvent_OnStackNextColumn()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 1 ) );
gMathStackReadingMode = MathStackReadColumn
EndFunction

void function MathEvent_OnStackPriorColumn()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 1 ) );
gMathStackReadingMode = MathStackReadColumn
EndFunction

void function MathEvent_NoStackNextColumn()
SayEvent( msgNoStackNextColumn );
EndFunction

void function MathEvent_NoStackPriorColumn()
SayEvent( msgNoStackPriorColumn );
EndFunction

void function MathEvent_OnStackJumpNextColumn()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 1 ) );
gMathStackReadingMode = MathStackReadColumn
EndFunction

        void function MathEvent_OnStackJumpPriorColumn()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 1 ) );
gMathStackReadingMode = MathStackReadColumn
        EndFunction

void function MathEvent_OnStackFirstColumn()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 1 ) );
gMathStackReadingMode = MathStackReadColumn
EndFunction

        void function MathEvent_OnStackLastColumn()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 1 ) );
gMathStackReadingMode = MathStackReadColumn
        EndFunction

void function MathEvent_OnStackFirst()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 3 ) );
gMathStackReadingMode = MathStackReadColumn
EndFunction

        void function MathEvent_OnStackLast()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 3 ) );
gMathStackReadingMode = MathStackReadColumn
        EndFunction

void function MathEvent_AlreadyOnStackFirstColumn()
SayEvent( msgAlreadyOnStackFirstColumn );
EndFunction

        void function MathEvent_AlreadyOnStackLastColumn()
        SayEvent( msgAlreadyOnStackLastColumn );
        EndFunction

void function MathEvent_AlreadyOnStackFirst()
SayEvent( msgAlreadyOnStackFirst );
EndFunction

        void function MathEvent_AlreadyOnStackLast()
        SayEvent( msgAlreadyOnStackLast );
        EndFunction

void function MathEvent_OnLongDivisionSectionChange()
SayEvent( gMathContent.GetDescriptionInContextEx( 3 ) );
EndFunction

void function MathEvent_OnTableNextRow()
SayEvent( gMathContent.GetDescriptionInContextEx( 2 ) );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnTablePriorRow()
SayEvent( gMathContent.GetDescriptionInContextEx( 2 ) );
UpdateBrailleMath()
EndFunction

void function MathEvent_NoTableNextRow()
SayEvent( msgNoTableNextRow );
EndFunction

void function MathEvent_NoTablePriorRow()
SayEvent( msgNoTablePriorRow );
EndFunction

void function MathEvent_OnTableNextColumn()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 1 ) );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnTablePriorColumn()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 1 ) );
UpdateBrailleMath()
EndFunction

void function MathEvent_NoTableNextColumn()
SayEvent( msgNoTableNextColumn );
EndFunction

void function MathEvent_NoTablePriorColumn()
SayEvent( msgNoTablePriorColumn );
EndFunction

void function MathEvent_OnTableFirstColumn()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 1 ) );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnTableLastColumn()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 1 ) );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnTableFirst()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 3 ) );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnTableLast()
SayEvent( gMathContent.GetDescriptionOfFocusedItemEx( 3 ) );
UpdateBrailleMath()
EndFunction

void function MathEvent_AlreadyOnTableFirstColumn()
SayEvent( msgAlreadyOnTableFirstColumn );
EndFunction

void function MathEvent_AlreadyOnTableLastColumn()
SayEvent( msgAlreadyOnTableLastColumn );
EndFunction

void function MathEvent_AlreadyOnTableFirst()
SayEvent( msgAlreadyOnTableFirst );
EndFunction

void function MathEvent_AlreadyOnTableLast()
SayEvent( msgAlreadyOnTableLast );
EndFunction

void function MathEvent_OnTableJumpUp()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnTableJumpDown()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnNextEquationLeafElement()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnPriorEquationLeafElement()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnFirstEquationElement()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnLastEquationElement()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnFirstEquationLeafElement()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_OnLastEquationLeafElement()
SayEvent( gMathContent.GetDescriptionOfFocusedItem() );
UpdateBrailleMath()
EndFunction

void function MathEvent_AlreadyOnFirstEquationElement()
SayEvent( msgAlreadyOnFirstEquationElement );
EndFunction

void function MathEvent_AlreadyOnLastEquationElement()
SayEvent( msgAlreadyOnLastEquationElement );
EndFunction

void function MathEvent_AlreadyOnFirstEquationLeafElement()
SayEvent( msgAlreadyOnFirstEquationLeafElement );
EndFunction

void function MathEvent_AlreadyOnLastEquationLeafElement()
SayEvent( msgAlreadyOnLastEquationLeafElement );
EndFunction

void function MathEvent_NoTableNavigationInEquationMode()
SayEvent( msgNoTableNavigationInEquationMode );
EndFunction

void function MathEvent_NotInTable()
SayEvent( msgNotInTable );
EndFunction

Script SayActiveCursor ()
var
	string message,
	string ActiveCursorName = GetActiveCursorName()
if ! IsPortal() || ! IsPcCursor () then
	PerformScript SayActiveCursor ()
	Return
endIf
Message = GetNavigationModeName( gMathNavigationMode );
if message == ""
	PerformScript SayActiveCursor ()
	Return
endIf

Message = ActiveCursorName + cscBufferNewLine + Message
SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, Message)
endScript

Script ScreenSensitiveHelp ()
DisableBrailleMathSettings()
if ! IsPortal() then
	PerformScript ScreenSensitiveHelp ()
	Return
EndIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
; for HotKeyHelp to load proper help from link in ScreenSensitiveHelp:
gbScreenSensitiveHelpActive = ON

if IsMathCatEnabled() == 1 then
	ShowScreenSensitiveHelp (msgScreenSensitiveHelpMathCATNavigation)
else
	If gMathNavigationMode == MathEquationNavigation then
		ShowScreenSensitiveHelp (msgScreenSensitiveHelpMathEquationNavigation)
	elIf gMathNavigationMode == MathStackNavigation then
		ShowScreenSensitiveHelp (msgScreenSensitiveHelpMathStackNavigation)
	elIf gMathNavigationMode == mathLongDivisionNavigation then
		ShowScreenSensitiveHelp (msgScreenSensitiveHelpmathLongDivisionNavigation)
	elIf gMathNavigationMode == MathTableNavigation then
		ShowScreenSensitiveHelp (msgScreenSensitiveHelpMathTableNavigation)
	else
		PerformScript ScreenSensitiveHelp ()
		Return
	endIf
endif
endScript

int Function JAWSHotKeys ()
DisableBrailleMathSettings()
if ! gbScreenSensitiveHelpActive &&! IsPortal() then
	JAWSHotKeys ()
	Return
EndIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if IsMathCatEnabled() == 1 then
	SayFormattedMessage (OT_USER_BUFFER, msgHotKeyHelpMathCATNavigation)
	if BrailleInUse () then
		UserBufferAddText (msgHotKeyHelpBraille)
	endIf
	UserBufferAddText (cMsgBuffExit)
	return TRUE
else
	If gMathNavigationMode == MathEquationNavigation then
		SayFormattedMessage (OT_USER_BUFFER, msgHotKeyHelpMathEquationNavigation)
		if BrailleInUse () then
			UserBufferAddText (msgHotKeyHelpBraille)
		endIf
		UserBufferAddText (cMsgBuffExit)
		return TRUE
	elIf gMathNavigationMode == MathStackNavigation then
		SayFormattedMessage (OT_USER_BUFFER, msgHotKeyHelpMathStackNavigation)
		if BrailleInUse () then
			UserBufferAddText (msgHotKeyHelpBraille)
		endIf
		UserBufferAddText (cMsgBuffExit)
		return TRUE
	elIf gMathNavigationMode == mathLongDivisionNavigation then
		SayFormattedMessage (OT_USER_BUFFER, msgHotKeyHelpmathLongDivisionNavigation)
		if BrailleInUse () then
			UserBufferAddText (msgHotKeyHelpBraille)
		endIf
		UserBufferAddText (cMsgBuffExit)
		return TRUE
	elIf gMathNavigationMode == MathTableNavigation then
		SayFormattedMessage (OT_USER_BUFFER, msgHotKeyHelpMathTableNavigation)
		if BrailleInUse () then
			UserBufferAddText (msgHotKeyHelpBraille)
		endIf
		UserBufferAddText (cMsgBuffExit)
		return TRUE
	else
		return JAWSHotKeys ()
	endIf
endIf
endFunction

string function GetCustomTutorMessage()
if IsMathCatEnabled() == 1 then
	If gMathNavigationMode == MathEquationNavigation then
		return msgTutorHelpMathCatEquationNavigation
	endif
endif

If gMathNavigationMode == MathEquationNavigation then
	return msgTutorHelpMathEquationNavigation
elIf gMathNavigationMode == MathStackNavigation then
	return msgTutorHelpMathStackNavigation
elIf gMathNavigationMode == mathLongDivisionNavigation then
	return  msgTutorHelpmathLongDivisionNavigation
elIf gMathNavigationMode == MathTableNavigation then
	return msgTutorHelpMathTableNavigation
else
	return msgMathViewerTutorHelp
endIf
EndFunction

int function UserBufferDeactivate ()
if !IsPortal()
	EnableBrailleMathSettings()
	UpdateBrailleMath()
endIf
gbScreenSensitiveHelpActive = OFF
return UserBufferDeactivate ()
endFunction

void function MenuModeEvent (handle winHandle, int mode)
MenuModeEvent(winHandle, mode)
if (mode == MENU_INACTIVE && IsPortal())
	EnableBrailleMathSettings()
	UpdateBrailleMath()
else
	DisableBrailleMathSettings()
endIf
EndFunction

string function BrailleGetTextForSplitMode()
return g_mathContent
endFunction

int function BrailleGetTextCursorOffsetForSplitMode()
return g_brailleCursorOffset
endFunction

; without modifiers
Script MoveToPrevious()
	if (UserBufferIsActive())
		PerformScript SayPriorCharacter()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script MoveToNext()
	if (UserBufferIsActive())
		PerformScript SayNextCharacter()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script ZoomOut()
	if (UserBufferIsActive())
		PerformScript SayPriorLine()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script ZoomIn()
	if (UserBufferIsActive())
		PerformScript SayNextLine()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script WhereAmI()
	if (UserBufferIsActive())
		PerformScript Enter()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script ReadCurrent()
	TypeCurrentScriptKey()
EndScript

Script MoveToLastPosition()
	TypeCurrentScriptKey()
EndScript

Script MoveToStart()
	if (UserBufferIsActive())
		PerformScript JAWSHome()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script MoveToEnd()
	if (UserBufferIsActive())
		PerformScript JAWSEnd()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script JumpToPlaceMarker1()
	TypeCurrentScriptKey()
EndScript

Script JumpToPlaceMarker2()
	TypeCurrentScriptKey()
EndScript

Script JumpToPlaceMarker3()
	TypeCurrentScriptKey()
EndScript

Script JumpToPlaceMarker4()
	TypeCurrentScriptKey()
EndScript

Script JumpToPlaceMarker5()
	TypeCurrentScriptKey()
EndScript

Script JumpToPlaceMarker6()
	TypeCurrentScriptKey()
EndScript

Script JumpToPlaceMarker7()
	TypeCurrentScriptKey()
EndScript

Script JumpToPlaceMarker8()
	TypeCurrentScriptKey()
EndScript

Script JumpToPlaceMarker9()
	TypeCurrentScriptKey()
EndScript

Script JumpToPlaceMarker10()
	TypeCurrentScriptKey()
EndScript

; with control modifier
Script MoveToPreviousCell()
	if (UserBufferIsActive())
		PerformScript SayPriorWord()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script MoveToNextCell()
	if (UserBufferIsActive())
		PerformScript SayNextWord()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script MoveToCellAbove()
	if (UserBufferIsActive())
		/* Using PerformScript ControlUpArrow() is not an option since it will
		not yield expected results. Instead of the prior paragraph being spoken
		JAWS will speak the message "no previous row" and then speak the current
		line of text. */
		PriorParagraph()
		SayParagraph()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script MoveToCellBelow()
	if (UserBufferIsActive())
		/* Using PerformScript ControlDownArrow() is not an option since it will
		not yield expected results. Instead of the prior paragraph being spoken
		JAWS will speak the message "no previous row" and then speak the current
		line of text. */
		NextParagraph()
		SayParagraph()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script GlobalWhereAmI()
	TypeCurrentScriptKey()
EndScript

Script ReadCurrentCell()
	TypeCurrentScriptKey()
EndScript

Script MoveToStartOfLine()
	if (UserBufferIsActive())
		PerformScript TopOfFile()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script MoveToEndOfLine()
	if (UserBufferIsActive())
		PerformScript BottomOfFile()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script SetPlaceMarker1()
	TypeCurrentScriptKey()
EndScript

Script SetPlaceMarker2()
	TypeCurrentScriptKey()
EndScript

Script SetPlaceMarker3()
	TypeCurrentScriptKey()
EndScript

Script SetPlaceMarker4()
	TypeCurrentScriptKey()
EndScript

Script SetPlaceMarker5()
	TypeCurrentScriptKey()
EndScript

Script SetPlaceMarker6()
	TypeCurrentScriptKey()
EndScript

Script SetPlaceMarker7()
	TypeCurrentScriptKey()
EndScript

Script SetPlaceMarker8()
	TypeCurrentScriptKey()
EndScript

Script SetPlaceMarker9()
	TypeCurrentScriptKey()
EndScript

Script SetPlaceMarker10()
	TypeCurrentScriptKey()
EndScript

; with shift modifier
Script ReadPrevious()
	if (UserBufferIsActive())
		PerformScript SelectPriorCharacter()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script ReadNext()
	if (UserBufferIsActive())
		PerformScript SelectNextCharacter()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script NavigationModeLarger()
	if (UserBufferIsActive())
		PerformScript SelectPriorLine()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script NavigationModeSmaller()
	if (UserBufferIsActive())
		PerformScript SelectNextLine()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script ToggleSpeechMode()
	TypeCurrentScriptKey()
EndScript

Script MoveToStartOfColumn()
	if (UserBufferIsActive())
		PerformScript SelectFromStartOfLine()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script MoveToEndOfColumn()
	if (UserBufferIsActive())
		PerformScript SelectToEndOfLine()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script ReadPlaceMarker1()
	TypeCurrentScriptKey()
EndScript

Script ReadPlaceMarker2()
	TypeCurrentScriptKey()
EndScript

Script ReadPlaceMarker3()
	TypeCurrentScriptKey()
EndScript

Script ReadPlaceMarker4()
	TypeCurrentScriptKey()
EndScript

Script ReadPlaceMarker5()
	TypeCurrentScriptKey()
EndScript

Script ReadPlaceMarker6()
	TypeCurrentScriptKey()
EndScript

Script ReadPlaceMarker7()
	TypeCurrentScriptKey()
EndScript

Script ReadPlaceMarker8()
	TypeCurrentScriptKey()
EndScript

Script ReadPlaceMarker9()
	TypeCurrentScriptKey()
EndScript

Script ReadPlaceMarker10()
	TypeCurrentScriptKey()
EndScript

; with control and shift modifiers
Script DescribePrevious()
	if (UserBufferIsActive())
		PerformScript SelectPriorWord()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script DescribeNext()
	if (UserBufferIsActive())
		PerformScript SelectNextWord()
		return
	endIf
	TypeCurrentScriptKey()
EndScript

Script ZoomOutAllTheWay()
	TypeCurrentScriptKey()
EndScript

Script ZoomInAllTheWay()
	TypeCurrentScriptKey()
EndScript

Script DescribeCurrent()
	TypeCurrentScriptKey()
EndScript

Script DescribePlaceMarker1()
	TypeCurrentScriptKey()
EndScript

Script DescribePlaceMarker2()
	TypeCurrentScriptKey()
EndScript

Script DescribePlaceMarker3()
	TypeCurrentScriptKey()
EndScript

Script DescribePlaceMarker4()
	TypeCurrentScriptKey()
EndScript

Script DescribePlaceMarker5()
	TypeCurrentScriptKey()
EndScript

Script DescribePlaceMarker6()
	TypeCurrentScriptKey()
EndScript

Script DescribePlaceMarker7()
	TypeCurrentScriptKey()
EndScript

Script DescribePlaceMarker8()
	TypeCurrentScriptKey()
EndScript

Script DescribePlaceMarker9()
	TypeCurrentScriptKey()
EndScript

Script DescribePlaceMarker10()
	TypeCurrentScriptKey()
EndScript

;Copyright 2019 - 2023 Freedom Scientific, Inc.
include "hjconst.jsh"

include "hjglobal.jsh"
include "common.jsm"

const
	SCINTILLA_CUSTOM_TYPE_AUTOCOMPLETE = 1

globals
	handle g_ScintillaAutocompleteWindow,
	handle g_ScintillaAutocompleteListbox,
	int g_ScintillaCurrentSuggestionTimer,
	string g_ScintillaLastSpokenCompletion

handle function FindScintillaSuggestionsWindow()
	if GetWindowclass(GetFocus())  != cwc_Scintilla
		return 0
	EndIf
	var
		handle hwndSuggestions = FindWindow(FindWindow(0,"ListBoxX"),"ListBox")
	if (!IsWindowVisible(hwndSuggestions))
		return 0
	EndIf
	return hwndSuggestions
EndFunction

function AutoFinishEvent()
	ClearScintillaCompletionGlobals()
EndFunction

Void Function WindowCreatedEvent (handle hWindow, int nLeft, int nTop, int nRight, int nBottom)
	if GetWindowClass(hWindow) == "ListboxX" &&
		GetWindowClass(GetFocus()) == cwc_Scintilla &&
		GetWindowThreadId(hWindow) == GetWindowThreadId(GetFocus())
		g_ScintillaAutocompleteWindow= hWindow
		g_ScintillaAutocompleteListbox = GetFirstChild(hWindow)
		g_ScintillaCurrentSuggestionTimer = ScheduleFunction("SayCurrentSuggestion",2)
	EndIf
	WindowCreatedEvent(hWindow,nLeft, nTop, nRight, nBottom)
EndFunction

Void Function WindowDestroyedEvent (handle hWindow, int nLeft, int nTop, int nRight, int nBottom)
	if hWindow == g_ScintillaAutocompleteWindow
		ClearScintillaCompletionGlobals()
		BrailleRefresh() ; to clear suggestion in Braille
	EndIf
	WindowDestroyedEvent(hWindow,nLeft, nTop, nRight, nBottom)
EndFunction

int function SayCurrentSuggestion()
	var string text = GetWindowText(g_ScintillaAutocompleteListbox,TRUE)
	if text && text != g_ScintillaLastSpokenCompletion
		say(TEXT,OT_LINE)
		BrailleRefresh()
		g_ScintillaLastSpokenCompletion = text
	EndIf
	if g_ScintillaAutocompleteListbox
		g_ScintillaCurrentSuggestionTimer =
		ScheduleFunction("SayCurrentSuggestion",2)
	EndIf
EndFunction

script SayLine()
	if IsInteractingWithAutoComplete()
		var int outputType
		if IsSameScript()
			outputType = OT_SPELL
		else
			outputType = OT_LINE
		EndIf
		Say(GetWindowText(g_ScintillaAutocompleteListbox,TRUE),outputType)
	Else
		PerformScript SayLine()
	EndIf
EndScript

Script BrailleRouting()
	if g_ScintillaAutocompleteWindow && !BrailleIsMessageBeingShown() && !gbBrailleStudyModeActive
		EnterKey()
		return
	endIf
	PerformScript BrailleRouting()
EndScript

void function SayLineUnit(int unitMovement, optional int bMoved)
	; New AutoComplete suggestion will speak through timer
	if !IsInteractingWithAutoComplete()
		SayLineUnit(unitMovement, bMoved)
	EndIf
EndFunction

int function BrailleCallbackObjectIdentify()
	if g_ScintillaAutocompleteWindow
		return WT_CUSTOM_CONTROL_BASE + SCINTILLA_CUSTOM_TYPE_AUTOCOMPLETE
	EndIf
	return BrailleCallBackObjectIdentify()
EndFunction

int Function BrailleAddObjectValue( int type)
	if type == WT_CUSTOM_CONTROL_BASE+SCINTILLA_CUSTOM_TYPE_AUTOCOMPLETE
		BrailleAddString(GetWindowText(g_ScintillaAutocompleteListbox,TRUE),0,0,ATTRIB_HIGHLIGHT)
		return true
	EndIf
	return BrailleAddObjectValue( type)
EndFunction

Function BraillePanRight(int moveToNextLine)
	if IsInteractingWithAutoComplete()
		NextLine()
		return FALSE
	EndIf
	BraillePanRight(moveToNextLine)
EndFunction

Function BraillePanLeft(int moveToPriorLine)
	if 	IsInteractingWithAutoComplete()
		PriorLine()
		return FALSE
	EndIf
	BraillePanLeft(moveToPriorLine)
EndFunction

function ProcessSayFocusWindowOnFocusChange(string realWindowName, handle focusWindow)
	; Scintilla windows return the entire text of the document as their name, so we need to suppress it
	if GetWindowClass(FocusWindow) != cwc_Scintilla
		ProcessSayFocusWindowOnFocusChange(realWindowName, focusWindow)
	EndIf
EndFunction

function ClearScintillaCompletionGlobals()
	var handle  null
	g_ScintillaAutocompleteWindow = null
	g_ScintillaAutocompleteListbox = null
	UnScheduleFunction(g_ScintillaCurrentSuggestionTimer)
	g_ScintillaLastSpokenCompletion = ""
EndFunction

void function UnitMoveControlNav(int UnitMovement)
if isPcCursor () && getWindowClass (getFocus ()) == cwc_Scintilla then
	if UnitMovement == UnitMove_Next then
		TypeKey(cksControlDownArrow) ; move without removing selection
	ElIf UnitMovement == UnitMove_Prior then
		TypeKey(cksControlUpArrow) ; move without removing selection
	EndIf
	SayLine ()
	return
endIf
UnitMoveControlNav(UnitMovement)
endFunction

int function IsInteractingWithAutoComplete()
	return g_ScintillaAutocompleteListbox && IsPCCursor() && !DialogActive()  &&
	!UserBufferIsActive()
EndFunction

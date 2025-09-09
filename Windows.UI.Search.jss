include "hjConst.jsh"
include "hjGlobal.jsh"
include "MSAAConst.jsh"
include "common.jsm"
include "Windows.UI.search.jsm"

const
;EventWaitTime is used to schedule the Win8SearchResultsChangedEvent
; when it may not fire due to editing in the search field:
	EventWaitTime = 4 ;tenths of a second
globals
	collection c_Win8SearchResults
		;Members are:
		; InSearchEdit -- True if the focus is in the search edit field, false otherwise.
		; SuggestionName -- If the search results list exists and is non-empty,
		;		the name of the selected item in the list if an item is selected,
		;		or the name of the first item in the list if nothing is selected.
		; IsSelected -- True if the search results list exists and has a selected item, false otherwise.
		; ForcedEvent -- True if the Win8SearchResultsChangedEvent is being forced, false otherwise.
		; Monitor -- The schedule id of the function to watch for changes when the search list has no highlight.

;because the test for object type is not always reliable immediately on starting the search app,
;we use a global var to test during focus change and to indicate that autostart has just run:
globals
	int gbAutoStart


void function AutoStartEvent()
gbAutoStart = true ;clear on first run of ProcessEventOnFocusChangedEvent
if !c_Win8SearchResults c_Win8SearchResults = new collection endIf
EndFunction

void function AutoFinishEvent()
if c_Win8SearchResults.Monitor
	UnscheduleFunction(c_Win8SearchResults.Monitor)
endIf
CollectionRemoveAll(c_Win8SearchResults)
EndFunction

void function ProcessEventOnFocusChangedEvent(handle AppWindow, handle RealWindow, string RealWindowName,
	handle FocusWindow, handle PrevWindow)
if GetWindowClass(FocusWindow) == "SearchPane"
&& (GetObjectSubtypeCode() == wt_edit || gbAutoStart)
	c_Win8SearchResults.InSearchEdit = true
else
	if c_Win8SearchResults.Monitor
		UnscheduleFunction(c_Win8SearchResults.Monitor)
	endIf
	CollectionRemoveAll(c_Win8SearchResults)
endIf
gbAutoStart = false
ProcessEventOnFocusChangedEvent(AppWindow, RealWindow, RealWindowName, FocusWindow, PrevWindow)
EndFunction

int function IsWindowsUISearchEditField()
return c_Win8SearchResults.InSearchEdit == true
	&& !UserBufferIsActive()
	&& !GetMenuMode()
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgWindowSearchAppName)
EndScript

void function SayLineUnit(int unitMovement,optional  int bMoved)
if IsWindowsUISearchEditField()
	; Spoken by Win8SearchResultsChangedEvent:
	return
endIf
SayLineUnit(unitMovement,bMoved)
EndFunction

int function BrailleAddObjectName(int type)
if type == wt_edit
&& IsWindowsUISearchEditField()
	; Use a short name for the field prompt:
	BrailleAddString(msgSearchPaneEditBoxName_Substitute,0,0,0)
	return true
endIf
return BrailleAddObjectName(type)
EndFunction

int function BrailleAddObjectValue(int type)
var	string suggestion
if type == wt_edit
&& IsWindowsUISearchEditField()
	if c_Win8SearchResults.SuggestionName
		suggestion = c_Win8SearchResults.SuggestionName
		if !c_Win8SearchResults.IsSelected
			BrailleAddFocusLine()
			BrailleAddString(cscSpace+suggestion,0,0,0)
		else
			BrailleAddString(suggestion,0,0,attrib_highlight)
		endIf
		return true
	endIf
endIf
return BrailleAddObjectValue(type)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
if IsWindowsUISearchEditField()
&& IsPCCursor()
	;Skip over levels higher than 0,
	;and substitute a shorter name than the one actually assigned to this object.
	;But, if called by SayWindowPromptAndText, skipt this and go to the default announcement,
	;so that Insert+Tab will speak the long object name which is a kind of help prompt.
	if nLevel == 0
		if GetScriptAssignedTo (GetCurrentScriptKeyName ()) == "SayWindowPromptAndText"
			SayObjectTypeAndText()
		else
			IndicateControlType(wt_edit,msgSearchPaneEditBoxName_Substitute,GetObjectValue(SOURCE_CACHED_DATA))
		endIf
	endIf
	return
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

Void Function ScreenSensitiveHelpForKnownClasses (int nSubTypeCode)
if c_Win8SearchResults.InSearchEdit
	If UserBufferIsActive () then
		UserBufferDeactivate ()
	EndIf
	ShowScreenSensitiveHelp(FormatString(msgScreenSensitiveHelp_SearchPaneEditBox,GetObjectName()))
	return
endIf
ScreenSensitiveHelpForKnownClasses (nSubTypeCode)
EndFunction

void function SayLine(optional int iDrawHighlights, int bDoNotUseObjInfo)
if IsWindowsUISearchEditField()
	;Customized to avoid announcement of the long object name:
	SayObjectTypeAndText()
	return
endIf
SayLine(iDrawHighlights,bDoNotUseObjInfo)
EndFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var int StopProcessing = PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
if !StopProcessing
	if IsWindowsUISearchEditField()
		; Win8SearchResultsChangedEvent will not fire if there is no selection in the list,
		; yet the first item may be changing as editing in the field continues.
		; Schedule a monitor to watch for changes in Win8 search results:
		if c_Win8SearchResults.Monitor
			UnscheduleFunction(c_Win8SearchResults.Monitor)
		endIf
		c_Win8SearchResults.Monitor = ScheduleFunction("MonitorChangeInNonHighlightedWin8SearchResults",EventWaitTime )
	endIf
endIf
return StopProcessing
EndFunction

void function MonitorChangeInNonHighlightedWin8SearchResults()
c_Win8SearchResults.Monitor = 0
if IsWindowsUISearchEditField()
	c_Win8SearchResults.ForcedEvent = true
	Win8SearchResultsChangedEvent(GetFocus())
	c_Win8SearchResults.ForcedEvent = false
endIf
EndFunction

void function Win8SearchResultsChangedEvent(HANDLE hwnd)
var
	object oTree,
	object oList,
	object oItem,
	string prevSuggestion,
	int prevSelected,
	string EditValue
;c_Win8SearchResults.Monitor and c_Win8SearchResults.ForcedEvent
;are set if this event was explicitly scheduled to run from function PreProcessKeyPressedEvent:
if c_Win8SearchResults.Monitor
	UnscheduleFunction(c_Win8SearchResults.Monitor)
	c_Win8SearchResults.Monitor = 0
endIf
if c_Win8SearchResults.ForcedEvent
	prevSuggestion = c_Win8SearchResults.SuggestionName
	PrevSelected = c_Win8SearchResults.IsSelected
endIf
c_Win8SearchResults.SuggestionName = cscNull
c_Win8SearchResults.IsSelected = false
oTree = GetUIAObjectTree(hWnd)
if !oTree
	BrailleRefresh()
	return
endIf
oList = oTree.FindByClassName("ListView")
if oList
	if oList.childCount
		oItem = oList.FindByState(STATE_SYSTEM_SELECTED)
		if oItem
			c_Win8SearchResults.IsSelected = true
		else
			oItem = oList.firstChild
		endIf
		c_Win8SearchResults.SuggestionName = oItem.name
	endIf
endIf
BrailleRefresh()
if !c_Win8SearchResults.SuggestionName
	SayUsingVoice(vctx_message,msgNoSearchResults,ot_screen_message)
	return
endIf
;speak the actual edit value if arrowing up/down returns to the input text:
EditValue = GetObjectValue(SOURCE_CACHED_DATA)
if c_Win8SearchResults.SuggestionName != EditValue
&& c_Win8SearchResults.IsSelected != true
&& prevSelected
	Say(editValue,ot_line)
	return
endIf
if c_Win8SearchResults.ForcedEvent
	; Selection did not change,
	; but the text of the deselected item may have changed:
	if c_Win8SearchResults.SuggestionName != PrevSuggestion
		SayUsingVoice(vctx_message,c_Win8SearchResults.SuggestionName,ot_screen_message)
		if c_Win8SearchResults.IsSelected != true
			SayUsingVoice(vctx_message,cMsgDeselected,ot_item_state)
		endIf
	endIf
else
	; the selection actually changed:
	SayUsingVoice(vctx_message,c_Win8SearchResults.SuggestionName,ot_screen_message)
	if c_Win8SearchResults.IsSelected != true
		SayUsingVoice(vctx_message,cMsgDeselected,ot_item_state)
	endIf
endIf
EndFunction

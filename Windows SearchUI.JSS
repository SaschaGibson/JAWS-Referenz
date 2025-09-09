;Copyright 2015-2019 Freedom Scientific, Inc.
;Freedom Scientific script file for Windows 10 start menu search results

include "hjConst.jsh"
include "UIA.jsh"
include "MSAAConst.jsh"
include "common.jsm"
include "Windows SearchUI.jsm"

import "touch.jsd"
import "UIA.jsd"

;UIA Search selection change support:
const
	SearchUI_EventPrefix = "SearchUI_UIA_"
globals
	object g_searchUI_UIA,
	object g_searchUI_UIATreeWalker
	
const
	AutomationID_SearchTextBox = "SearchTextBox",
	AutomationID_ScopeTilesList = "scopeTilesList"

;Windows 10 in later builds uses a different UIA structure, and may offer more information for the search results items.
const
	WindowsOlderBuilds = 0,
	WindowsNewerBuilds = 1
globals
	int WindowsBuildType

GLOBALS 
; keep LiveRegionEvent from firing multiple times.
	string prevLiveRegionText

int function ShouldSwitchToOlderStartMenuSupport()
var string sFullVersion = GetMetroAppVersion()
var string sMajorVersion = StringSegment(sFullVersion, ".", 1)
var string sMinorVersion = StringSegment(sFullVersion, ".", 2)
return sMajorVersion == 1
	&& sMinorVersion < 12
EndFunction

int function InitSearchUI_UIA()
if g_searchUI_UIA && g_searchUI_UIATreeWalker return true endIf
g_searchUI_UIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !g_searchUI_UIA return false endIf
g_searchUI_UIATreeWalker = g_searchUI_UIA.CreateTreeWalker(g_searchUI_UIA.CreateRawViewCondition())
if !g_searchUI_UIATreeWalker
	g_searchUI_UIA = Null()
	return false
endIf
if !ComAttachEvents( g_searchUI_UIA, SearchUI_EventPrefix )
	g_searchUI_UIA = Null()
	g_searchUI_UIATreeWalker = Null()
	return false
endIf
return true
EndFunction

object function FindElementForEventWatching()
;In later builds of Windows 10,
;return the object pointed to by the ControllerFor property of the search edit.
;In earlier versions of Windows 10, return the window element.
var	object root = g_searchUI_UIA.GetElementFromHandle( GetFocus() )
if !root return Null() endIf
var object condition = g_searchUI_UIA.CreateAndCondition(
	g_searchUI_UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_EditControlTypeId),
	g_searchUI_UIA.CreateIntPropertyCondition(UIA_ProcessIdPropertyId, g_searchUI_UIA.GetFocusedElement().ProcessID ))
var object element = root.findFirst(TreeScope_Subtree,condition)
if !element || element.controllerFor.count == 0
	WindowsBuildType = WindowsOlderBuilds
	return root
else
	WindowsBuildType = WindowsNewerBuilds
	return element.controllerFor(0)
endIf
EndFunction

void function InitSearchUI_Events()
if !InitSearchUI_UIA() return endIf
var object root = FindElementForEventWatching()
if !root return endIf
g_searchUI_UIA.AddAutomationEventHandler( UIA_SelectionItem_ElementSelectedEventId,
	root, TreeScope_Element| TreeScope_Descendants )
g_searchUI_UIA.AddAutomationEventHandler( UIA_Window_WindowClosedEventId,
	root, TreeScope_Element)
g_searchUI_UIA.AddAutomationEventHandler( UIA_LiveRegionChangedEventId,
	root, TreeScope_Subtree)
EndFunction

void function DumpSearchUI_Events()
g_searchUI_UIA = Null()
g_searchUI_UIATreeWalker = Null()
EndFunction

void function AutoStartEvent()
if ShouldSwitchToOlderStartMenuSupport()
	SwitchToConfiguration("Windows SearchUI Pre112")
	return
endIf
if IsWindows11() Then
	if GetObjectProcessName() == "TextInputHost.EXE" Then
		SwitchToConfiguration("Windows11TextInputApp")
	EndIf
EndIf
InitSearchUI_Events()
EndFunction

void function AutoFinishEvent()
DumpSearchUI_Events()
prevLiveRegionText = cscNull
EndFunction

int function IsFocusCheckException()
return UserBufferIsActive()
	|| !IsPCCursor()
	|| IsTouchCursor()
	|| GetMenuMode()
EndFunction

string function StringTrimExcessChars(string stringParam)
var
	int i,
	string s = stringParam
if !s return s endIf
s = StringRemoveCharsInRange(s,0xe000,0xf8ff)
s = StringRemoveCharsInRange(s,0x202a,0x202a)
s = StringRemoveCharsInRange(s,0x202c,0x202c)
return StringTrimLeadingBlanks(StringTrimTrailingBlanks(s))
EndFunction

string function GetTextInRange(object element, optional int MaxLength)
if !element return cscNull endIf
var object textChild = element.GetTextChildPattern()
if !textChild return cscNull endIf
var object textRange = textChild.TextRange()
if !textRange return cscNull endIf
if !maxLength MaxLength = 255 endIf
var string text = textRange.GetText(MaxLength)
return StringTrimExcessChars(text)
EndFunction

void function SearchUI_UIA_AutomationEvent( object element, int eventID )
if EventID == UIA_LiveRegionChangedEventId then
	var string LiveRegionText = GetTextInRange (element)
	if liveRegionText != PrevLiveRegionText then
		SayMessage (OT_CONTROL_NAME, LiveRegionText)
	endIf
	prevLiveRegionText = LiveRegionText
EndIf
EndFunction

int function IsFocusSearchTextBox()
if IsFocusCheckException() return false endIf
var object focus = g_SearchUI_UIA.GetFocusedElement().BuildUpdatedCache()
return focus.AutomationID == AutomationID_SearchTextBox
EndFunction

int function IsFocusScopeFiltersList()
if IsFocusCheckException() return false endIf
var object focus = g_SearchUI_UIA.GetFocusedElement().BuildUpdatedCache()
if focus.controlType != UIA_DataItemControlTypeId return false endIf
g_searchUI_UIATreeWalker.currentElement = focus
if !g_searchUI_UIATreeWalker.gotoParent() return false endIf
return g_searchUI_UIATreeWalker.currentElement.automationId == AutomationID_ScopeTilesList
EndFunction

void function CaretMovedEvent( int movementUnit,optional int source)
;using Up/DownArrow to change the selected item in the list while in the search edit field causes CaretMovedEvent to fire:
if IsMovingByLine(movementUnit)
	;Do not call function IsFocusSearchTextBox here,
	;since a collision with the function being called by another event may occur.
	;This in turn will cause an unknown function call to be generated,
	;along with most likely a failure to detect that this is the focus search textbox.
	if GetObjectSubtypeCode() == wt_edit
	&& GetObjectRole() == ROLE_SYSTEM_TEXT
		;We will get a richer set of data from the UIA automation event then by speaking with SayLine:
		return
	endIf
endIf
CaretMovedEvent( movementUnit,source)
EndFunction

int function SayByTypeForScriptSayLine()
if GetObjectRole(0) == ROLE_SYSTEM_PAGETAB
	;Speak the name, but don't speak the URL value:
	IndicateControlType(wt_TabControl, GetObjectName(),cmsgsilent)
	return true
endIf
return SayByTypeForScriptSayLine()
EndFunction

Script SayNextLine()
var	int bMoved = NextLine()
if IsFocusSearchTextBox() return endIf
SayLineUnit(UnitMove_Next,bMoved)
EndScript

Script SayPriorLine ()
var int bMoved = PriorLine()
if IsFocusSearchTextBox() return endIf
SayLineUnit(UnitMove_Prior,bMoved)
EndScript

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
var int objectRole = GetObjectRole()
if nLevel == 0 && IsWindows11() && ( objectRole == ROLE_SYSTEM_CLIENT || objectRole == ROLE_SYSTEM_WINDOW)
	&& IsMetroApp()
	; Happens the first time after logon that you press Windows key on Windows 11
	UIARefresh() ; causes JAWS to detect that focus is on the search box
	return
EndIf
var int subtypeCode = getObjectSubtypeCode(FALSE, nLevel)
if nLevel > 0
	if subtypeCode == wt_dialog_page
		if GetObjectClassName(nLevel) == cwcIEServer
			;The name of this pane is an URL which is verbal clutter:
			return
		endIf
	endIf
endIf ;debug
;GetObjectRole is more reliable here for detecting a tab control than is GetObjectSubtypeCode:
if subtypeCode == wt_TABCONTROL
|| GetObjectRole(nLevel) == ROLE_SYSTEM_PAGETAB
	var string name = GetObjectName(false,nLevel)
	if ! name then return sayObjectTypeAndText (nLevel, includeContainerName) endIf
	;SayObjectTypeAndText speaks both the name and value,
	;but we don't want to announce the URL value:
	if nLevel > 0 then
	; where tab control functions as group name:
		say (name, OT_CONTROL_NAME)
	else
		;SayObjectTypeAndText speaks both the name and value,
		;but we don't want to announce the URL value:
		IndicateControlType(wt_TabControl, name,cmsgSilent)
	endIf
		return
endIf
if nLevel == 0
&& subtypeCode == WT_ListBoxItem
&& FSUIAGetFocusedElement().name != GetObjectName()
	UIARefresh(false)
	return
endIf
SayObjectTypeAndText(nLevel, includeContainerName)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgSearchUIAppName)
EndScript

int function BrailleAddObjectDescription(int nSubtype)
if nSubtype == wt_edit
&& IsSecondaryFocusActive ()
	BrailleAddString(GetSecondaryFocusSelectionText (),0,0,0)
	return true
endIf
return BrailleAddObjectDescription(nSubtype)
EndFunction

Script UpALevel()
if IsWindows11() && GetObjectAutomationId() == "SearchTextBox" && !UserBufferIsActive()
	SayCurrentScriptKeyLabel ()
	; Pressing escape closes the Start Screen but doesn't properly
	; set focus back to where it was.  Pressing the Windows key
	; works right, so that's what we simulate.
	ActivateStartMenu() ; since it's open, this will close it
	return
EndIf
PerFormScript UpALevel()
EndScript

bool function IsForegroundProcessWindows11EmojiAndClipboardViewer(handle hwndFocus)
if GetActiveConfiguration(0) == "Windows11TextInputApp" Then
	; configuration has already been switched, no need to continue with focus change
	return true
endIf
return false
EndFunction

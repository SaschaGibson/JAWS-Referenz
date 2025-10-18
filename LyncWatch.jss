;Copyright 1995-2016 Freedom Scientific, Inc.
; Skype For Business default companion file

include "HjConst.jsh"
include "HjGlobal.jsh"
include "Common.jsm"
include "UIA.jsh"
include "LyncWatch.jsh"
include "LyncWatch.jsm"


void function AutoStartEvent ()
LyncConversationWindows = new collection
LyncConversationObjects = new collection;
endFunction

void function RemoveUIALyncConversationWindowData (handle window)
var string key = intToString (window)
if ! CollectionItemExists (LyncConversationWindows, key) then return endIf
AppendToScriptCallStackLogEX ("RemoveUIALyncConversationWindowData")
collectionRemoveItem (LyncConversationWindows, key)
if ! CollectionItemCount (LyncConversationWindows) then LyncConversationWindows = null () endIf
endFunction

void function RemoveMainUIALyncEventHandler (handle window)
; This is called from WindowDestroyedEvent when Skype for Business main window gets destroyed.
if window == LyncUIAMainWindow then
	LyncUIAMainWindowObject = null()
	LyncUIAMainWindow = null()
endIf
endFunction

void function LyncAddConversationToCollection (handle window)
; this must always get called from WindowCreatedEvent as each conversation is a new window.
if ! LyncUIAMainWindow then return endIf
var string windowClass = getWindowClass (window)
if ! stringStartsWith (windowClass, "Lync")
&& windowClass != UIA_EventsHookObjectClass then
	return 
endIf
; the UIA object for each collection item is the FSUIA object, not the element object.
; This allows LiveRegionChangedEvent to be hooked for separate from the main Lync windows.
;AppendToScriptCallStackLog ()
if ! LyncUIAMainWindowObject then
	LyncUIAMainWindowObject = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest")
	if ! ComAttachEvents (LyncUIAMainWindowObject, fn_prefix) then
	AppendToScriptCallStackLogEX ("ComAttachEvents failed!")
		LyncUIAMainWindowObject = null ()
		return
	endIf
endIf
if ! LyncUIAMainWindowObject then 
	AppendToScriptCallStackLogEX ("Couldn't create main listener object")
	return
endIf
var object element = LyncUIAMainWindowObject.GetElementFromHandle(window)
AppendToScriptCallStackLogEx (element.LocalizedControlType)
if ! element then return endIf
AppendToScriptCallStackLogEx ("ComAttachEvents succeeded.")
if ! LyncUIAMainWindowObject.AddAutomationEventHandler( UIA_LiveRegionChangedEventId, Element, TREESCOPE_SUBTREE)
|| ! LyncUIAMainWindowObject.AddAutomationEventHandler( UIA_SystemAlertEventId, Element, TREESCOPE_SUBTREE) then
AppendToScriptCallStackLogEx ("AddAutomationEvent failed!")
	return
endIf
AppendToScriptCallStackLogEx ("AddAutomationEvent succeeded.")
var string key = intToString(window)
if ! LyncConversationWindows then LyncConversationWindows = new collection endIf
if ! stringIsBlank (element.name) then
	LyncConversationWindows[key] = element.name
else
	LyncConversationWindows[key] = element.helpText
endIf
endFunction

void function AddMainUIALyncEventHandler (string AppName)
; This will be called from the new event which will run for each application that loads.
if LyncUIAMainWindowObject then return endIf
if AppName != "lync.exe" 
&& AppName != "LYNCHTMLCONV.EXE" then
	return
endIf
var
	string windowClass,
	object element, handle window;
;window = getTopLevelWindow (getFocus ())
if GetActiveConfiguration () == "lync" then
	window = getAppMainWindow (GetFocus ())
else
	window = FindTopLevelWindow (wcLyncMainWindow, null())
endIf
windowClass = getWindowClass (window)
if ! window 
|| ! StringStartsWith (WindowClass, "Lync") then
	AppendToScriptCallStackLogEX (FormatString ("%1 window not found", wcLyncMainWindow))
	return
endIf
AppendToScriptCallStackLogEx ("Window succeeded")
LyncUIAMainWindowObject = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest")
if ! LyncUIAMainWindowObject then
AppendToScriptCallStackLogEx ("LyncUIAMainWindowObject not found.")
	return
endIf
element = LyncUIAMainWindowObject.GetElementFromHandle(window)
if ! element then
AppendToScriptCallStackLogEX ("Element not found")
	LyncUIAMainWindowObject = null ()
	return
endIf
if ! ComAttachEvents (LyncUIAMainWindowObject, fn_prefix) then
AppendToScriptCallStackLogEX ("ComAttachEvents failed!")
	LyncUIAMainWindowObject = null ()
	return
endIf
AppendToScriptCallStackLogEX ("ComAttachEvents succeeded.")
if ! LyncUIAMainWindowObject.AddAutomationEventHandler( UIA_LiveRegionChangedEventId, element, TREESCOPE_SUBTREE)
|| ! LyncUIAMainWindowObject.AddAutomationEventHandler( UIA_SystemAlertEventId, element, TREESCOPE_SUBTREE) then
AppendToScriptCallStackLogEx ("AddAutomationEvent failed!")
	LyncUIAMainWindowObject = null ()
	return
endIf
AppendToScriptCallStackLogEx ("AddAutomationEvent succeeded.")
LyncUIAMainWindow = window
endFunction

void function LyncWatchUIA_AutomationEvent(object element, int eventID)
if eventID == UIA_LiveRegionChangedEventId then
; maintain the LyncWatchUIA_ prefix in case we ever get a default LiveRegionChangedEvent that would manage other areas.
	return LyncWatchUIA_LiveRegionChangedEvent (element)
elIf eventID == UIA_SystemAlertEventId then
; notifications about microphone muting and other things the party is doing:
	return LyncWatchUIA_SystemAlertEvent (element)
endIf
endFunction

void function LyncWatchUIA_LiveRegionChangedEvent (object element)
;HelpText is now the default location for notification text.
var string text = element.helpText
if StringIsBlank (text) then
	text = element.name
endIf
if stringIsBlank (text) then return endIf
SayMessage (OT_JAWS_MESSAGE, text)
endFunction

void function LyncWatchUIA_SystemAlertEvent (object element)
;HelpText is now the default location for notification text.
var string text = element.helpText
if stringIsBlank (text) then
	text = element.name
endIf
if stringIsBlank (text) then return endIf
SayMessage (OT_JAWS_MESSAGE, text)
endFunction


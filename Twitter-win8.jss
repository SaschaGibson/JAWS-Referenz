; JAWS script file for Windows 8 Twitter client

Include "HjConst.jsh"
Include "HjGlobal.jsh"
Include "Common.jsm"
include "MSAAConst.jsh"
include "UIA.jsh"
include "Touch.jsm"
include "TWITTER-WIN8.jsm"
import "touch.jsd"

GLOBALS
	; Private :: From Touch.jss 
	collection g_TouchNavigationSounds,
; for silencing incorrect speech on FocusChangedEventEX from invoke on radio buttons:	
	int gbIgnoreFocusChangedEventFromTouchCursorInvoke


script ScriptFileName()
ScriptAndAppNames(msgWin8TwitterAppName)
EndScript

int function MainProcessShouldSkipUIAElementWhenNavigating( object element )
var
	int type = element.controlType,
	object pattern
if !element.IsEnabled
	pattern = element.GetLegacyIAccessiblePattern()
	if pattern
	&& pattern.state & STATE_SYSTEM_UNAVAILABLE
		return true
	endIf
endIf
if type == UIA_ListItemControlTypeId then
	; These are useless parent container objects and provide no information,
	; only names like twitter.modal.tweet
	return TRUE
; The next two commented lines illustrate what sounds good, e.g. eliminating unlabeled buttons, but would cause us to miss some valuable controls.
; ElIf type == UIA_ButtonControlTypeId 
	;return StringIsBlank (element.Name) ; There's a lot of clutter of empty buttons in tweets.
ElIf type == UIA_TextControlTypeId 
|| type == UIA_ImageControlTypeId
|| type == UIA_HyperlinkControlTypeId
	var object parent = UIAGetParent( element )
	if parent.controlType == UIA_ListItemControlTypeId ; the group for the entire tweet
	; these items belong to the selected tweet,
	; and so for this app we need to let them be selected. Normally, list items' text children are redundant:
		return FALSE
	elIf parent.controlType == UIA_ButtonControlTypeId ; for objects like twitter names and real names
	|| parent.controlType == UIA_RadioButtonControlTypeId ; For the selectable items Home, Me, Discover and other things
		return TRUE
	EndIf
endIf
return MainProcessShouldSkipUIAElementWhenNavigating( element )
EndFunction

void function TouchTapCurrentElement(optional int tapX, int tapY)
; This causes the radio buttons which function as tabs to work properly.
; These are items like Home, Discover, etc.
CreateUIAObject();
if ! g_UIATreeWalker then
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return
endIf
var	object element = g_UIATreeWalker.currentElement
if  ( ! element )
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	if g_UIADebugging SayString(msgDebug_NoElement) endIf
	return
EndIf
if !element.isEnabled
	TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchNavigationErrorSound)
	return
endIf
if element.controlType == UIA_RadioButtonControlTypeId then
	;element.SetFocus()
	var int x, int y;
	GetTouchCursorClickablePoint(x, y)
	if GetTouchCursorClickablePoint(x, y)
		ClickAtPoint (x, y)
		var	object pattern = element.GetInvokePattern()
		pattern.Invoke()
		TouchNavNotifyByPlayOrSay(g_TouchNavigationSounds.TouchClickSound)
		gbIgnoreFocusChangedEventFromTouchCursorInvoke = ON
		;UIASayElement (element) ; need to allow for updating of TreeWalker:
		delay (2) ; enough time for UIA to update:
		TouchSayCurrentElement()
		return
	endIf
endIf
return TouchTapCurrentElement(tapX,tapY)
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if gbIgnoreFocusChangedEventFromTouchCursorInvoke then gbIgnoreFocusChangedEventFromTouchCursorInvoke = OFF return endIf
return ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, 
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
EndFunction

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
if IsTouchCursor() && getObjectSubtypeCode (TRUE) == WT_RADIOBUTTON then return EndIf
tutorMessageEvent(hwndFocus, nMenuMode)
endFunction


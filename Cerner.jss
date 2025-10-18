; Copyright 2018 - 2025, Freedom Scientific, Inc.
;
; JAWS Script File used by multiple applications used by Cerner Corporation.
;
; JAWS will be instructed to load the Cerner script and configuration files for
; these applications via entries in the [ConfigNames] section of ConfigNames.ini.
include "HJConst.jsh"
include "HJGlobal.jsh"

include "Cerner.jsh"
include "Cerner.jsm"

include "common.jsm"

import "Say.jsd"

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Utility Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

Int Function IsListViewWindow(optional handle window)
var string functionName = "IsListViewWindow"
if (!window)
	window = GetFocus()
endIf
if (!window)
	FormattedOutputDebugStringL("%1 error: window is null. Returning false.", LEVEL_DEBUG, functionName)
	return false
endIf
var string windowClass = GetWindowClass(window)
if (StringCompare(windowClass, cscListviewClass, false) == 0 || StringCompare(windowClass, cwcATLListView, false) == 0
	|| StringStartsWith(windowClass, WinFormsListView, false))
	FormattedOutputDebugStringL("%1 status: returning true for the window class '%2'.", LEVEL_DEBUG, functionName, windowClass)
	return true
endIf
FormattedOutputDebugStringL("%1 status: returning false for the window class '%2'.", LEVEL_DEBUG, functionName, windowClass)
return false
EndFunction

Int Function IsTreeViewWindow(optional handle window)
if (!window)
	window = GetFocus()
endIf
if (!window)
	return false
endIf
var string windowClass = GetWindowClass(window)
if (StringCompare(windowClass, cwc_SysTreeView32, false) == 0)
	return true
endIf
return false
EndFunction

int function GetLevelToSpeakForObjectDescriptionAndHelp(int nLevel, int outputType)
var string descriptionForInputLevel = GetObjectDescription(true, nLevel)
var string helpForInputLevel = GetObjectHelp(true, nLevel)
if (outputType == OT_CONTROL_DESCRIPTION && !StringIsBlank(descriptionForInputLevel))
	return nLevel
elif (outputType == OT_HELP && !StringIsBlank(helpForInputLevel))
	return nLevel
endIf
var int levelToSpeak = nLevel
var int objectType = GetObjectSubTypeCode(true, nLevel)
var int parentObjectType = GetObjectSubTypeCode(true, nLevel + 1)
if (
	objectType == WT_LISTBOXITEM || objectType == WT_LISTVIEWITEM
	|| objectType == WT_TREEVIEWITEM || objectType == WT_EDITCOMBO
	)
	if (
		parentObjectType == WT_LISTBOX || parentObjectType == WT_LISTVIEW
		|| parentObjectType == WT_TREEVIEW || parentObjectType == WT_COMBOBOX
		)
		levelToSpeak = nLevel + 1
	endIf
endIf
return levelToSpeak
EndFunction

void function MaybeSpeakObjectDescription(int nLevel)
if (!ShouldItemSpeak(OT_CONTROL_DESCRIPTION))
	return
endIf
var int levelToSpeak = GetLevelToSpeakForObjectDescriptionAndHelp(nLevel, OT_CONTROL_DESCRIPTION)
var string descriptionNoMSAA = GetObjectDescription(false, levelToSpeak)
if (levelToSpeak == nLevel && !StringIsBlank(descriptionNoMSAA))
   ;; Do not speak the description in this case to avoid double speaking.
   ;; The built-in SayObjectTypeAndText function includes the description.
   return
endIf
var string description = GetObjectDescription(true, levelToSpeak)
if (StringIsBlank(description))
	return
endIf
Say(description, OT_CONTROL_DESCRIPTION)
endFunction

void function MaybeSpeakObjectHelp(int nLevel)
if (!ShouldItemSpeak(OT_HELP))
	return
endIf
var int levelToSpeak = GetLevelToSpeakForObjectDescriptionAndHelp(nLevel, OT_HELP)
var string help = GetObjectHelp(true, levelToSpeak)
if (StringIsBlank(help))
	return
endIf
Say(help, OT_HELP)
endFunction

int function ShouldNotifyIfContextHelp()
return false
endFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Window Event Helpers
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

int function NewTextEventShouldBeSilent(
	handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
;overwrite this function to silence new text
var
	int iSubtype = GetWindowSubtypeCode(hFocus)
if (iSubtype == WT_EDITCOMBO)
	return true
endIf
return NewTextEventShouldBeSilent(
	hFocus, hwnd, buffer, nAttributes,
	nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Overrides to customize the behavior of built-in script functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

void function SayTreeViewItem()
SayTreeViewItem()
if (!TreeWithColumns())
	;; The SayTreeViewItem function in Default.jss includes the description if the TreeWithColumns function
	;; returns true. To avoid double speaking, only call MaybeSpeakObjectDescription if the TreeWithColumns
	;; function returns false.
	MaybeSpeakObjectDescription(0)
endIf
MaybeSpeakObjectHelp(0)
EndFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Tutorial Help
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

Int Function ShouldCustomizeTutorMessage(handle window, int objType)
;; First test to see if the object type is one that requires customization. Return false
;; if Cerner has not requested that we customize the tutor message for this object type.
if (objType != WT_TABCONTROL)
   return false
endIf
;; Now test for other scenarios that do not require customization of the tutor help message.
if (InRibbons() || IsFormsModeActive())
   return false
endIf
var string hotKey = FindHotKey()
if (StringContains(hotKey, "|"))
   return false
endIf
var string windowClass = GetWindowClass(window)
if (windowClass == cwcIEServer || windowClass == cwcFireFoxBrowserClass)
   return false
EndIf
return true
EndFunction

string function GetCustomTutorMessage()
var handle focusWindow = GetFocus()
var int objType = getWindowSubtypeCode(focusWindow)
If (!objType)
	objType = GetObjectSubTypeCode()
EndIf
if (!ShouldCustomizeTutorMessage(focusWindow, objType))
	return cscNull
endIf
If (objType == WT_TABCONTROL)
	return msgTabControlCerner
endIf
return cscNull
EndFunction

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Scripts
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

script ScriptFileName()
ScriptAndAppNames(GetActiveConfiguration())
endScript

Script SayLine()
var handle focusWindow = GetFocus()
if (!IsPCCursor() || !IsListViewWindow(focusWindow))
	PerformScript SayLine()
	if (IsTreeViewWindow(focusWindow))
		if (!TreeWithColumns())
			;; The SayTreeViewItem function in Default.jss includes the description if the TreeWithColumns function
			;; returns true. To avoid double speaking, only call MaybeSpeakObjectDescription if the TreeWithColumns
			;; function returns false.
			MaybeSpeakObjectDescription(0)
		endIf
		MaybeSpeakObjectHelp(0)
	endIf
	return
endIf
SayObjectActiveItem(0)
endScript

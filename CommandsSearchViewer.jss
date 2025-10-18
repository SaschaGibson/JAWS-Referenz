; Copyright 2015-2017 by Freedom Scientific, Inc.
; JAWS script source for the JAWS Commands Search Viewer

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "common.jsm"
include "CommandsSearchViewer.jsm"

globals
; Set by JAWS Search.
	int g_WasTouchCursorActiveBeforeJAWSSearch,
	int g_VirtualPCCursorSettingBeforeJAWSSearch 


void function AutoFinishEvent ()
if g_WasTouchCursorActiveBeforeJAWSSearch then
; Give time to return to the application:
	scheduleFunction ("ActivateTouchCursor", 3)
	g_WasTouchCursorActiveBeforeJAWSSearch = OFF
endIf
if GetJCFOption (OPT_VIRTUAL_PC_CURSOR) != g_VirtualPCCursorSettingBeforeJAWSSearch
	;No need to wait when restoring this setting:
	SetJCFOption (OPT_VIRTUAL_PC_CURSOR,g_VirtualPCCursorSettingBeforeJAWSSearch)
endIf
endFunction

int function MainProcessShouldSkipUIAElementWhenNavigating(object element)
if element.controlType == UIA_PaneControlTypeId
	return true
endIf
return MainProcessShouldSkipUIAElementWhenNavigating(element)
EndFunction

script ScriptFileName()
ScriptAndAppNames(msgCommandsSearchViewerAppFileName)
EndScript

void function FocusChangedEventEx (
               handle hwndFocus, int nObject, int nChild,
               handle hwndPrevFocus, int nPrevObject, int nPrevChild,
               int nChangeDepth)
var
               int nType
let nType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)

if (nType == wt_unknown)
               return
EndIf

FocusChangedEventEx (hwndFocus,nObject,nChild,hwndPrevFocus, nPrevObject, nPrevChild,nChangeDepth)

EndFunction

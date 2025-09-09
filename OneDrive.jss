;Copyright 2017 Freedom Scientific, Inc.
; file for OneDrive setup

include "HjConst.jsh"
include "UIA.jsh"
include "common.jsm"

import "UIA.jsd"

GLOBALS
	string prevStatusText,
	object oUIA

void function AutoStartEvent ()
prevStatusText = cscNull
oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
endFunction

void function AutoFinishEvent()
ComRelease(oUIA, true)
oUIA = null()
EndFunction

string function getDialogStatusText ()
; propend this text to beginning of getDialogStaticText to give user the progress of OneDrive setup.
if ! dialogActive () return cscNull endIf
var object element, object dialog 
if ! oUIA return cscNull endIf
dialog = oUIA.GetElementFromHandle(getRealWindow (getFocus ()))
if ! dialog return cscNull endIf
var object controlTypeCondition, object itemStatusCondition, object condition;
controlTypeCondition = oUIA.CreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_ImageControlTypeID)
if ! controlTypeCondition return cscNull endIf
; item status not empty: this is dynamic.
itemStatusCondition = oUIA.CreateNotCondition(oUIA.CreateStringPropertyCondition (UIA_ItemStatusPropertyId, ""))
if ! itemStatusCondition return endIf
condition = oUIA.CreateAndCondition(controlTypeCondition, itemStatusCondition)
if ! condition return cscNull endIf
element = dialog.findFirst(TREESCOPE_DESCENDANTS,condition).buildUpdatedCache()
if ! element return cscNull endIf
return element.itemStatus
endFunction

void function sayWindowTypeAndText (handle window)
if getWindowSubtypeCode (window) != WT_DIALOG return sayWindowTypeAndText (window) endIf
if window != getRealWindow (getFocus ()) return sayWindowTypeAndText (window) endIf
var string statusText = getDialogStatusText ()
; update global for benefit of focus item changing where status changes but dialog code doesn't run:
prevStatusText = statusText
if stringIsBlank (statusText) return sayWindowTypeAndText (window) endIf
return sayControlEX (window, 
	cscNull, ; name
	GetControlTypeName (WT_DIALOG),; type
	cscNull, ; state
	cscNull, cscNull, ; container name and type
	cscNull, ; value
	cscNull, ; position
	statusText+cscBufferNewLine+getDialogStaticText ())
endFunction

void function sayFocusedObject ()
; for places where dialog does not change but status text does.
var string statusText = getDialogStatusText ()
if ! stringIsBlank (statusText)
&& statusText != prevStatusText then
	say (statusText, OT_DIALOG_TEXT)
endIf
sayFocusedObject ()
prevStatusText = statusText
endFunction

int function BrailleAddObjectDlgText (int type)
if type != WT_DIALOG return BrailleAddDlgText (type) endIf
var string statusText = getDialogStatusText ()
if ! stringIsBlank (statusText) then
	BrailleAddString (statusText, 0,0,0)
	return FALSE ; internal build remaining dialog text
endIf
return BrailleAddObjectDlgText (type)
endFunction

script scriptFileName ()
scriptAndAppNames (GetActiveConfiguration ())
endScript

script sayWindowTitle ()
var string statusText = getDialogStatusText ()
if stringIsBlank (statusText) then
	performScript SayWindowTitle ()
	return
endIf
var string longMessage, string shortMessage, string dialogName = getWindowName (getRealWindow (getFocus ()))
longMessage = formatString (cmsg28_L, dialogName, statusText)
shortMessage = formatString (cmsg28_S, dialogName, statusText)
sayMessage (OT_USER_REQUESTED_INFORMATION, longMessage, shortMessage)
endScript

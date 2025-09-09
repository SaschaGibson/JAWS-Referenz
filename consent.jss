;Consent.exe,:: UAC dialog

include "HjConst.jsh"
include "HjGlobal.jsh";
include "UIA.jsh"
Include "common.jsm";
import "UIA.jsd"


const
;class names:
	wc_CredentialDialogXamlHost = "Credential Dialog Xaml Host",
	oC_ScrollViewer = "ScrollViewer",
	oC_Textblock = "TextBlock"

GLOBALS
	int giBrlDetailsButton

;For caching the UAC consent dialog title and text in Windows 10,
;to be used for braille dialog components:
const
	UIA_UAC_EventPrefix"UACConsent",
	UACEvent_ScheduleDelay = 1  ;delay used when scheduling the update function in the event handler
globals
	int ScheduledGetCurrentStaticText,
	object oUIA_UAC,  ;The FSUIA object
	object oUIA_UAC_Pane,  ;The pane which is the parent to the dialog static text
	object oUIA_UAC_StaticTextCondition,  ;The condition to use when finding the static text children of the pane
	collection UACDlgText  ;contains saved text from the UIA elements
		; Members are:
		; title -- string of text which is the dialog title
		; staticText -- StringArray containing the text elements in the pane of the dialog.


void function AutoStartEvent()
InitUACUIA()
EndFunction

void function AutoFinishEvent()
oUIA_UAC = Null()
oUIA_UAC_Pane = Null()
oUIA_UAC_StaticTextCondition = Null()
CollectionRemoveAll(UACDlgText)
EndFunction

void function InitUACUIA()
if !IsWindows10() return endIf
if oUIA_UAC return endIf
oUIA_UAC = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
var object treeWalker = oUIA_UAC.CreateTreeWalker(oUIA_UAC.CreateRawViewCondition())
if !treeWalker
	oUIA_UAC = Null()
	return
endIf
treeWalker.CurrentElement = GetUIAFocusElement(oUIA_UAC).BuildUpdatedCache()
;Get and save the dialog title to the collection:
treeWalker.gotoParent()
if treeWalker.currentElement.controlType != UIA_WindowControlTypeId
|| treeWalker.currentElement.className != wc_CredentialDialogXamlHost
	oUIA_UAC = Null()
	return
endIf
UACDlgText = new collection
UACDlgText.title = treeWalker.currentElement.name
;Because we now have the title,
;if we fail to get the dialog static text we will not consider the initialization a failure.
;Now, get the ancestor for the static text,
;start listening for any change to the text,
;and store the current static text in the collection:
var object condition = oUIA_UAC.CreateAndCondition(
		oUIA_UAC.CreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_PaneControlTypeId),
		oUIA_UAC.CreateStringPropertyCondition(UIA_ClassNamePropertyId,oC_ScrollViewer))
var object pane = treeWalker.currentElement.findFirst(TreeScope_Children,condition)
if !pane return endIf
oUIA_UAC_Pane = pane
;Not sure if this text ever changes, but in case it does:
ComAttachEvents(oUIA_UAC,UIA_UAC_EventPrefix)
oUIA_UAC.AddPropertyChangedEventHandler(UIA_NamePropertyId,pane,TreeScope_children)
;now save the condition for finding the current static text,
;and get the current static text:
condition = oUIA_UAC.CreateStringPropertyCondition(UIA_ClassNamePropertyId,oC_Textblock )
oUIA_UAC_StaticTextCondition = condition
GetCurrentStaticText()
EndFunction

void function GetCurrentStaticText()
ScheduledGetCurrentStaticText = 0
if (!oUIA_UAC_Pane || !oUIA_UAC_StaticTextCondition) return endIf
collectionRemoveItem(UACDlgText,"staticText")
var object  textElements = oUIA_UAC_Pane.FindAll(TreeScope_Children,oUIA_UAC_StaticTextCondition)
if !textElements return endIf
var int count = textElements.count
if !count return endIf
var stringArray a
a = new stringArray[count]
;Remember that JAWS indexes arrays as 1-based, UIA as 0-based.
var object o
var int i = 1
forEach o in textElements
	a[i] = o.name
	i = i+1
endForEach
UACDlgText.staticText = a
BrailleRefresh()
EndFunction

void function UACConsentPropertyChangedEvent( object element, int propertyID, variant newValue )
if element.className == oC_Textblock
	if ScheduledGetCurrentStaticText
		UnscheduleFunction(ScheduledGetCurrentStaticText)
	endIf
	ScheduledGetCurrentStaticText = ScheduleFunction("GetCurrentStaticText",UACEvent_ScheduleDelay)
endIf
EndFunction

int function SpeakLostFocusWindow ()
;Focus Loss code is invalid, as UAC doesn't lose focus.
;The original JAWS is in a "No man's land" waiting for the user to react to UAC.
endFunction

int function AnnounceWin10UIAConsentDialogTitleAndText()
;The UAC popup dialog is structured differently in Windows 10 than in Windows 7.
;This is specifically for Windows 10,
;for the dialog gaining focus but the title and text not being announced.
if !CollectionItemExists(UACDlgText,"title")
	InitUACUIA()
	if !CollectionItemExists(UACDlgText,"title") return false endIf
endIf
IndicateControlType(wt_dialog,UACDlgText.title)
var int i
var stringArray a = UACDlgText.staticText
var int count = ArrayLength(a)
for i = 1 to count
	Say(a[i],ot_dialog_text)
endFor
return true
EndFunction

int Function HandleCustomWindows (handle hWnd)
giBrlDetailsButton = FALSE
If (hWnd != GetFocus ()) Return HandleCustomWindows (hWnd) EndIf
If GetWindowSubtypeCode (hWnd) Return HandleCustomWindows (hWnd) EndIf
;now try for subtypecode with updated cache:
var int nSubtypeCode = GetObjectSubtypeCode(SOURCE_CACHED_DATA)
if !nSubtypeCode
&& GetWindowClass(hWnd) == wc_CredentialDialogXamlHost
	;The Windows 10 UAC dialog has appeared and a button has focus,
	;but JAWS did not see that the button has focus.
	if AnnounceWin10UIAConsentDialogTitleAndText()
		UIARefresh ()
		BrailleRefresh ()
		return true
	endIf
elIf !GetObjectName(SOURCE_CACHED_DATA)
&& nSubtypeCode == WT_DIALOG_PAGE
	;Details button 'fake'
	IndicateControlType (WT_BUTTON, cwnUAC_Details)
	giBrlDetailsButton = TRUE
	Return TRUE
EndIf
Return HandleCustomWindows (hWnd)
EndFunction

int Function BrailleCallbackObjectIdentify ()
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
If giBrlDetailsButton then
	Return WT_BUTTON
Else
	Return BrailleCallbackObjectIdentify ()
EndIf
EndFunction

int Function BrailleAddObjectName (int nSubtypeCode)
if IsTouchCursor() then
	Return BrailleAddObjectName (nSubtypeCode)
endIf
If (nSubtypeCode == WT_BUTTON && giBrlDetailsButton) then
	BrailleAddString (cwnUAC_Details,GetCursorCol (), GetCursorRow (), 0)
	Return TRUE;
EndIf
Return BrailleAddObjectName (nSubtypeCode)
EndFunction

Script SayLine ()
If IsPcCursor () &&
! IsVirtualPcCursor () &&
giBrlDetailsButton then
	If IsSameScript () then
		Say (cwnUAC_Details, OT_SPELL)
	Else
		IndicateControlType (WT_BUTTON, cwnUAC_Details)
	EndIf
	Return;
EndIf
PerformScript SayLine ()
EndScript

Script SayWord ()
If IsPcCursor () &&
! IsVirtualPcCursor () &&
giBrlDetailsButton then
	If IsSameScript () then
		Say (cwnUAC_Details, OT_SPELL)
	Else
		IndicateControlType (WT_BUTTON, cwnUAC_Details)
	EndIf
	Return;
EndIf
PerformScript SayWord ()
EndScript

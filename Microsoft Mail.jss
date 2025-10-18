; Copyright 1995-2016 by Freedom Scientific, Inc.
; Freedom Scientific script file for Microsoft Mail (Windows 10 app)

include "hjConst.jsh"
include "hjGlobal.jsh"
include "UIA.jsh"
include "common.jsm"
include "MsOffice2007.jsm" ; for state change scripts bold, italic and underlined.
include "Microsoft Mail.jsm"

import "UIA.jsd" ; core script UIA functions

CONST
	wcMsMailWindow = "Windows.UI.Core.CoreWindow",
	UIAEventPrefix = "MsMailUIA_",
	AutomationID_MessageHeader = "MessageHeader"

GLOBALS
	int prevObjectSubtypeCode,
	string g_BrlAutocompleteSuggestion,
	int globalReadHeadersOnMessageChange,
	int gbTabNavigation,
	object g_MsMailUIA,
	object g_MsMailMainWindowObject

; Overrides from WordSettings:
string function getSpellingBuzzerInfo (string settingID)
var
	int Disabled = TRUE,
	int state = readSettingInteger (SECTION_OPTIONS, "IndicateMistypedWord", 0, FT_CURRENT_JCF, rsStandardLayering)
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (state), Disabled)
endFunction

void function setSpellingBuzzerInfo (string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int state
parseXMLBooleanWriteRequest (sxmlWriteRequest, state)
writeSettingInteger (SECTION_OPTIONS, "IndicateMistypedWord", state, FT_CURRENT_JCF, wdUser)
endFunction
; End of Overrides from WordSettings

int function ContractedBrailleInputAllowedNow ()
if getObjectAutomationID () == "SearchBox" then return FALSE endIf
return ContractedBrailleInputAllowedNow ()
endFunction

int Function ShouldForceComputerBraille (handle hwndTrans)
if getObjectAutomationID () == "SearchBox" then return TRUE endIf
return ShouldForceComputerBraille (hwndTrans)
endFunction

void function HookTextSelectionChangeOnWindow (handle hwnd)
var object element
if ! hwnd || getWindowClass (hwnd) != wcMsMailWindow then return endIf
if ! g_MsMailUIA then
	g_MsMailUIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	if ! ComAttachEvents (g_MsMailUIA, UIAEventPrefix) then
		return
	endIf
endIf
element = g_MsMailUIA.GetElementFromHandle(hWnd)
if ! element then return endIf
g_MsMailUIA.AddAutomationEventHandler( UIA_Text_TextSelectionChangedEventId, Element, TREESCOPE_SUBTREE) 
g_MsMailMainWindowObject = element
endFunction

void function InitUIAAndHookEvents ()
if g_MsMailUIA then return endIf
var handle hwnd = getFocus ()
if ! hwnd || getWindowClass (hwnd) != wcMsMailWindow then return endIf
g_MsMailUIA = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if ! ComAttachEvents (g_MsMailUIA, UIAEventPrefix) then
	g_MsMailUIA = null ()
	return
endIf
var object element = g_MsMailUIA.GetElementFromHandle(hWnd)
if ! element then
	g_MsMailUIA = null()
	return
endIf
if ! g_MsMailUIA.AddAutomationEventHandler( UIA_LiveRegionChangedEventId, Element, TREESCOPE_SUBTREE) then
	g_MsMailUIA = null()
	return
endIf
g_MsMailUIA.AddAutomationEventHandler( UIA_Text_TextSelectionChangedEventId, Element, TREESCOPE_SUBTREE) 
g_MsMailMainWindowObject = element
endFunction

void function AutoStartEvent ()
if StringContains (GetWin8AppWindowTitle(), scCalendar) then
	SwitchToConfiguration ("Win8Calendar")
	Return
endIf
InitUIAAndHookEvents ()
endFunction

void function AutoFinishEvent ()
g_MsMailUIA = null ()
globalReadHeadersOnMessageChange = FALSE
endFunction

int function ShouldSpeakTableCellsOnScriptCall(int tableNavDir)
;Return false if an event is used to speak the table cells for table navigation
;to prevent double speaking due to the script calling SpeakTableCells in addition to the event announcing the cells.
return tableNavDir == UnitMove_Current
|| IsVirtualPcCursor ()
EndFunction

void function ReadMessageHeaders ()
if ! IsVirtualPcCursor ()
|| GetWindowClass (GetFocus ()) != wcMsMailWindow then
	return 
endIf
var object condition = g_MsMailUIA.CreateStringPropertyCondition(UIA_AutomationIdPropertyId,AutomationID_MessageHeader)
if ! condition then return endIf
var object element = g_MsMailMainWindowObject.FindFirst(TreeScope_Subtree,condition)
if ! element || element.automationID != AutomationID_MessageHeader then return endIf
var object ControlTypeCondition = g_MsMailUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_TextControlTypeId)
var object KeyboardFocusableCondition = g_MsMailUIA.CreateBoolPropertyCondition(UIA_IsKeyboardFocusablePropertyId, UIATrue)
condition = g_MsMailUIA.CreateAndCondition(ControlTypeCondition,KeyboardFocusableCondition)
var object HeaderElementsArray = element.FindAll(TREESCOPE_SUBTREE, condition)
if ! HeaderElementsArray then return endIf
var int i, int count = HeaderElementsArray.count
for i = 0 to count-1
	element = HeaderElementsArray(i)
	if element.controlType == UIA_TextControlTypeId then
		SayMessage (OT_SCREEN_MESSAGE, stringSegment (msgHeaders, cscBufferNewLine, i+1)) ; index in string is 1-based.
		sayMessage (OT_SCREEN_MESSAGE, element.Name)
	endIf
endFor
endFunction

void function UpdateControllerForPropertyChangedListener ()
;the ControllerFor object cannot be found from top down.
if getObjectSubtypeCode (TRUE) != WT_EDIT then return endIf
var object element = g_MsMailUIA.GetFocusedElement().BuildUpdatedCache()
if ! element then return endIf
; we actually want the parent element since the focus element immediately changes when you type:
var object treeWalker = g_MsMailUIA.CreateTreeWalker(g_MsMailUIA.CreateRawViewCondition())
TreeWalker.CurrentElement = element
if !treeWalker.GoToParent() return endIf
element = TreeWalker.currentElement
g_MsMailUIA.AddPropertyChangedEventHandler(UIA_ControllerForPropertyId, 		Element, TREESCOPE_SUBTREE)
endFunction

int function FocusRedirectedOnFocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
var int Subtype = GetObjectSubtypeCode ()
HookTextSelectionChangeOnWindow (hwndFocus)
if Subtype != WT_STATIC
&& prevObjectSubtypeCode != WT_EDIT then
; When typing an email address or contact name, the focus moves from an edit field into a static where the autocomplete is displayed.
; But the texst in the static is only the text you typed followed by position info.
	g_BrlAutocompleteSuggestion = cscNull
endIf
UpdateControllerForPropertyChangedListener ()
if globalReadHeadersOnMessageChange then
	if isVirtualPcCursor () then
		if Subtype == WT_DOCUMENT  || Subtype == WT_STATIC then
			ReadMessageHeaders ()
			globalReadHeadersOnMessageChange = FALSE
		endIf
		return TRUE; DocumentLoadedEvent will take care of the rest.
	elIf Subtype == WT_LISTBOXITEM
	|| Subtype == WT_MULTISELECT_LISTBOX 
	; new message
	|| subtype == WT_EDIT then
		globalReadHeadersOnMessageChange = FALSE
		return FALSE
	endIf
	return TRUE
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
endFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
prevObjectSubtypeCode = nType
endFunction

void function MsMailUIA_LiveRegionChangedEvent (object element)
if element.ControlType == UIA_PaneControlTypeId then
	;SayMessage (OT_SCREEN_MESSAGE, element.name) ; not sure we need to speak pane opened and closed.
	globalReadHeadersOnMessageChange = TRUE
endIf
endFunction

int function BrailleCallbackObjectIdentify()
var int TypeCode = getObjectSubtypeCode (TRUE)
if !IsTouchCursor()
&& (TypeCode == wt_multiline_edit || TypeCode == WT_DOCUMENT)
&& inTable () then
	return WT_TABLE ; coordinates get updated as part of value.
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectDescription (int type)
if type != WT_EDIT && type != WT_STATIC then
	g_BrlAutocompleteSuggestion = cscNull
	return
endIf
brailleAddString (g_BrlAutocompleteSuggestion, 0,0,ATTRIB_HIGHLIGHT)
endFunction

void function MsMailUIA_AutocompleteListItemIsSelectedEvent (object element)
if element.name != g_BrlAutocompleteSuggestion then
; the event fires multiple times per item.
	SayMessage (OT_SCREEN_MESSAGE, element.name)
	g_BrlAutocompleteSuggestion = element.name
endIf
BrailleRefresh ()
endFunction

void function MsMailUIA_AutomationEvent (object element, int eventID)
var string objectClassName = getObjectClassName ()
if eventID == UIA_LiveRegionChangedEventId then
	return MsMailUIA_LiveRegionChangedEvent (element)
elIf EventID == UIA_SelectionItem_ElementSelectedEventId then
	return MsMailUIA_AutocompleteListItemIsSelectedEvent (element)
elIf eventID == UIA_Selection_InvalidatedEventId then
	g_BrlAutocompleteSuggestion = cscNull
elIf eventID == UIA_Text_TextSelectionChangedEventId then
; SayObjectTypeAndText if tab or shift+tab was just pressed
	if gbTabNavigation && isVirtualPcCursor () then
		gbTabNavigation = OFF
		SayObjectTypeAndText ()
		return
	elIf gbTabNavigation && objectClassName == "RichEditBox" then
		gbTabNavigation = OFF
		say (getObjectValue (), OT_LINE)
		return
	elIf gbTabNavigation && objectClassName == "Resolved" then
	; entry was entered and static now in focus
		gbTabNavigation = OFF
		g_BrlAutocompleteSuggestion = cscNull
		say (getObjectValue (), OT_LINE)
		return
	endIf
endIf
endFunction

void function MsMailUIA_PropertyChangedEvent(object element, int propertyID, variant newValue)
var int subtypeCode = getObjectSubtypeCode ()
if subtypeCode != WT_EDIT 
&& subtypeCode != WT_STATIC then
	return
endIf
var object SuggestionsList = element.controllerFor(0).BuildUpdatedCache()
if ! SuggestionsList then return endIf
var object condition = g_MsMailUIA.CreateIntPropertyCondition( UIA_ControlTypePropertyId,UIA_ListItemControlTypeId)
var object suggestion = SuggestionsList.FindFirst(TreeScope_Descendants,condition)
if suggestion then
	MsMailUIA_AutocompleteListItemIsSelectedEvent (suggestion)
endIf
g_MsMailUIA.AddAutomationEventHandler(UIA_SelectionItem_ElementSelectedEventId, SuggestionsList, TREESCOPE_SUBTREE); as element gets selected
g_MsMailUIA.AddAutomationEventHandler(UIA_Selection_InvalidatedEventId, SuggestionsList, TREESCOPE_SUBTREE) ; empty Braille cache.
endFunction

void function SpeakAttributeStateChange (int AttributesToLookFor )
if ! AttributesToLookFor then return endIf
var int state, string Message
if getCharacterAttributes () & AttributesToLookFor then
	state = ON
else
	State  = OFF
endIf
if AttributesToLookFor == ATTRIB_BOLD then
	if state then
		Message = msgBoldOn1_L
	else
		Message = msgBoldOff1_L
	endIf
elIf AttributesToLookFor == ATTRIB_ITALIC then
	if state then
		Message = msgItalicOn1_L
	else
		Message = msgItalicOff1_L
	endIf
elIf AttributesToLookFor == ATTRIB_UNDERLINE then
	if state then
		Message = msgUnderlineOn1_L
	else
		Message = msgUnderlineOff1_L
	endIf
endIf
SayFormattedMessageWithVoice(vctx_message,ot_status,message)
AttributesToLookFor = CTRL_NONE
endFunction

void function SayObjectTypeAndText (optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var int subtypeCode = getObjectSubtypeCode (TRUE, nLevel)
if subtypeCode == WT_MULTISELECT_LISTBOX then
	IndicateControlType (subtypeCode, msgMessagesListName)
	return
endIf
; on first use, SayObjectTypeAndText is inspired by FocusChange.
; After that, it's only inspired by AutomationEvent where ID is TextSelectionChange.
; Prevent repeated speaking on first use
gbTabNavigation = FALSE
if nLevel == 0 && g_BrlAutocompleteSuggestion then
; The autocomplete has everything we need.
; Reading default info from here is somewhat confusing and redundant.
	say (g_BrlAutocompleteSuggestion, OT_CONTROL_NAME)
	return
endIf
SayObjectTypeAndText (nLevel,includeContainerName)
endFunction

Void Function DocumentLoadedEvent()
var
	int iLinkCount
if ! IsVirtualPcCursor ()
|| GetWindowClass (GetFocus ()) != wcMsMailWindow then
	DocumentLoadedEvent ()
	return
endIf
HookTextSelectionChangeOnWindow (getFocus ())
let iLinkCount=GetLinkCount()
if iLinkCount>0 then
	if shouldItemSpeak (OT_HELP) == MESSAGE_LONG then
		SayUsingVoice(vctx_message,FormatString(msgMessageLinkCount,IntToString(iLinkCount)),ot_help)
	else
		SayUsingVoice(vctx_message,FormatString(msgMessageLinkCount_S,IntToString(iLinkCount)),ot_help)
	endIf
EndIf
sayAll ()
EndFunction

function autocompleteHelper ()
; for tab and shift tab keys:
if ! IsKeyWaiting () && getObjectSubtypeCode () == WT_STATIC then
	if getObjectClassName () == "Unresolved" then delay (2, FALSE) endIf ; turns to "resolved" once a valid entry exists.
	MSAARefresh ()
endIf
endFunction

Script ScriptFileName ()
ScriptAndAppNames (GetActiveConfiguration ())
endScript

script BoldText ()
TypeCurrentScriptKey ()
if IsVirtualPcCursor ()
|| GetObjectSubtypeCode (TRUE, 1) != WT_DOCUMENT then
	SayCurrentScriptKeyLabel ()
	return
endIf
delay (1)
SpeakAttributeStateChange (ATTRIB_BOLD)
endScript

script ItalicText ()
TypeCurrentScriptKey ()
if IsVirtualPcCursor ()
|| GetObjectSubtypeCode (TRUE, 1) != WT_DOCUMENT then
	SayCurrentScriptKeyLabel ()
	return
endIf
delay (1)
SpeakAttributeStateChange (ATTRIB_ITALIC)
endScript

script UnderlineText ()
TypeCurrentScriptKey ()
if  IsVirtualPcCursor ()
|| GetObjectSubtypeCode (TRUE, 1) != WT_DOCUMENT then
	SayCurrentScriptKeyLabel ()
	return
endIf
delay (1)
SpeakAttributeStateChange (ATTRIB_UNDERLINE)
endScript

Script ShiftTab ()
var string objectClassName = getObjectClassName ()
if IsVirtualPcCursor () || objectClassName == "RichEditBox" || objectClassName == "Unresolved" then
	gbTabNavigation = TRUE
endIf
PerformScript ShiftTab ()
if getObjectSubtypeCode () == WT_STATIC && objectClassName == "Unresolved" then
	autocompleteHelper ()
endIf
endScript

Script Tab ()
var string objectClassName = getObjectClassName ()
if IsVirtualPcCursor () || objectClassName == "RichEditBox" || objectClassName == "Unresolved" then
	gbTabNavigation = TRUE
endIf
PerformScript Tab ()
if getObjectSubtypeCode () == WT_STATIC && objectClassName == "Unresolved" then
	autocompleteHelper ()
endIf
endScript

int function BrailleAddObjectValue (int SubtypeCode)
if subtypeCode == WT_COMBOBOX then
	var string value = getObjectValue ()
	if ! stringIsBlank (value) then
		BrailleAddString (value, 0,0,ATTRIB_HIGHLIGHT)
		return TRUE
	endIf
endIf
if ! stringIsBlank (g_BrlAutocompleteSuggestion) then
	BrailleAddString (g_BrlAutocompleteSuggestion, 0,0,0)
	return TRUE
endIf
var string objectName = getObjectName ()
if subtypeCode == WT_STATIC 
&& ! stringIsBlank (objectName)THEN
; You've entered an Autocomplete, then tabbed to accept it.
	BrailleAddString (objectName, 0,0,0)
	return TRUE
endIf
return BrailleAddObjectValue (SubtypeCode)
endFunction

void function SayHomeOrEndFromCaretMovedEvent()
if ! IsPcCursor () 
|| IsVirtualPcCursor () 
|| menusActive () then
	return SayHomeOrEndFromCaretMovedEvent()
endIf
; due to internal UIA issues where the text ranges don't expose the end of line properly,
; Windows Mail will now behave with home and end keys the same way that NotePad and WordPad do.
if getObjectSubtypeCode (TRUE) == WT_DOCUMENT then return endIf
return SayHomeOrEndFromCaretMovedEvent()
endFunction

void function SayTableCellOnCellChangedEvent()
;By default, the navigation which triggered the event will speak the new data at the caret as appropriate. 
;If we speak content here we'll get double speaking.
;Overwrite this function in applications where it is necessary to speak the table cell in the CellChangedEvent.
; in Windows Mail, this event callback is important, or we would never say the current line within the cell.
saveCursor ()
PcCursor ()
sayLine ()
restoreCursor ()
EndFunction

Script SayLine ()
if g_BrlAutocompleteSuggestion 
&& isPcCursor () && ! userBufferIsActive () then
	if isSameScript () then
		spellString (g_BrlAutocompleteSuggestion)
	else
		say (g_BrlAutocompleteSuggestion, OT_LINE)
	endIf
	return
endIf
PerformScript SayLine ()
endScript




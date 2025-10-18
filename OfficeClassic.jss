;Copyright 1995-2018 Freedom Scientific, Inc.
; JAWS Script file for Office dialog, task pane, ribbons and other common Office components,
; versions prior to later 2016 and O365.

include "hjConst.jsh"
include "MSAAConst.jsh"
include "hjGlobal.jsh"
include "winstyles.jsh"
include "uia.jsh"
include "common.jsm"
include "office.jsh"
include "msoffice2007.jsm"
Include "TutorialHelp.jsm"
include "outlook message.jsh"
include "outlook message.jsm"

import "UIA.jsd"

GLOBALS
	string LastOfficeApplicationConfigName, ; for dynamically switching into and out of Office Help 2007 scripts.
	int giForegroundCategory,
	int giPrevSDMControl, ; only to keep double firing in SDM Controls from happening.
	int giFNTutorSDMHelper, ; It runs too early and often
	int GlobalSmartTagActionsTutorHelp,
	int InSmartTagListDlg,
	int globalSuppressHighlightedText,
	int GlobalTemporaryContextMenuState,
	string gstrSDMControlName,
	string gstrBrlUIATabName,
	int officeVersion,
	int officeMinorVersion

;for braille flash messages that must be scheduled
;because the message would otherwise be obliterated by screen updates:
globals
	int giScheduledFlashBrlMessage,
	string msgScheduledBrlFlash

;for Office UIA event listeners:
const
	oUIA_Office_EventFunctionNamePrefix = "Office"
globals
	object oUIA_Office,
	object oUIA_OfficeToasts,
	string prevOfficeToastMessage,
	collection colOffice
		;members are:
		;Initialized -- True if UIA object and collection is properly initialized
		;Focus -- The element having focus at the time of the focus change.
		;TreeWalker -- A treewalker that can be used for traversing the Office application elements.

;For managing focus item announcement in backstage view:
globals
	collection c_BackstageFocusItemData
		;members are:
		; MainTab -- the current backstage tab
		; CategoryTab -- the current category tab of the current main backstage tab, if any
		; GroupName -- The current group name
		; GroupStaticText -- Static text applicable to the group

;Office global is needed to save a test for the previous focus being the Office splash screen.
;See note in office.jss FocusChangedEventEx:
globals
	string gsPrevSdmGroupName, ; keep group text from double-speaking in SDM dialogs
	int gbWasSplashScreenInOfficeFocusChangedEventEx

; Because function GetCurrentScriptKeyName returns the script name of the most recent key belonging to a script,
; and is not null if the most recent key was not a script key,
; we use collection col_KeyPressedInfo to determine if the most recent key pressed was a script and if so what it was.
; ScriptNames_ValueChangedWhenEditing contains segments with script names for comparison against the script name in col_KeyPressedInfo.
; See functions PreProcessKeyPressedEvent & ValueChangedEvent.
const
	ScriptNames_ValueChangedWhenEditing = "|JAWSDelete|JAWSBackspace|ControlBackSpace|",
	scriptNames_Segment = "|%1|"
globals
	collection col_KeyPressedInfo
		; members are:
		; scriptName -- the name of the script attached to the most recently pressed key.
		; isScriptKey -- true if the most recently pressed key is a script key, false otherwise.
		; ValueChanged -- True if the ValueChangedEvent fired and processed the key pressed info, false otherwise.

;For supporting prompt to use Office 2003 commands in menus:
globals
	object oUIA_CustomMenuPrompt  ;Is non-null only when a UIA custom control related to menus appears


int function isOffice365 ()
if OfficeVersion < 16 then return FALSE endIf
if OfficeVersion == 16 then
	if officeMinorVersion < 6700 then
		return FALSE
	else
		return TRUE
	endIf
elIf OfficeVersion == 17 then
	; if officeMinorVersion == retailVersion then
		; return formatString (msgRetail, appName)
	;else
		return TRUE
	;endIf
else ; unknown newer Office
	return TRUE
endIf
endFunction

string function GetOfficePurchaseInfo (string appName)
; for 16 and later, earlier returns the in string unchanged.
If OfficeVersion < 16 then return appName endIf
if OfficeVersion == 16 then
	if officeMinorVersion < 6700 then
		return formatString (msgRetail, appName)
	else
		return formatString (msgSubscription, appName)
	endIf
elIf OfficeVersion == 17 then
	; if officeMinorVersion == retailVersion then
		; return formatString (msgRetail, appName)
	;else
		return formatString (msgSubscription, appName)
	;endIf
else ; unknown newer Office
	return formatString (msgSubscription, appName)
endIf
endFunction

int function getFocusStylesGalleryItemInfo (string byRef name, int byRef isSelectable)
; alt h, l = styles gallery, grid of buttons who can be selected.
var object element = CreateUIAFocusElement (TRUE); button with focus inside group with focus
if ! element then return FALSE endIf
if element.className != GalleryButtonClassName then return FALSE endIf
if element.GetSelectionItemPattern().IsSelected isSelectable = TRUE endIf
name = element.name
if stringStartsWith (name, ParagraphMarker) then
; trim off leading erroneous text:
	name = stringChopLeft (name, 1)
	name = stringTrimLeadingBlanks (name)
endIf
return TRUE
endFunction

string function getHotKey (optional handle window)
var
	object element = CreateUIAFocusElement (TRUE),
	string hotKey = getHotKey (window)
if ! element then return hotKey endIf
if stringIsBlank (element.acceleratorKey) then return hotKey endIf
return element.acceleratorKey
endFunction

int function BrailleAddObjectHotKey (int subtypeCode)
if subtypeCode == WT_LOWERRibbon 
|| subTypeCode == WT_UPPERRIBBON 
|| subTypeCode == WT_BUTTON 
|| inRibbons () then
	var string hotkey = getHotKey (GetFocus ())
	if hotKey then
		BrailleAddString (hotKey, 0,0,0)
		return TRUE
	endIf
endIf
return 0
endFunction

void function InitUIAAndHookLiveRegionChangedEvent ()
if ! oUIA_OfficeToasts then
	oUIA_OfficeToasts = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
endIf
if ! oUIA_OfficeToasts then return endIf
if ! ComAttachEvents(oUIA_OfficeToasts,oUIA_Office_EventFunctionNamePrefix) then return endIf
var object element = oUIA_OfficeToasts.GetElementFromHandle(getAppMainWindow (getFocus ()))
if ! element then return endIf
oUIA_OfficeToasts.AddAutomationEventHandler( UIA_LiveRegionChangedEventId, Element, TREESCOPE_SUBTREE) 
endFunction

void function AutoStartEvent()
if !col_KeyPressedInfo col_KeyPressedInfo = new collection endIf
giContextualSpellingErrorColor = getOPTColor("ContextualSpellingWavyUnderlineColor", "000000255")
;Initialize oUIA_Office but not the collection, so we can hook the LiveRegionChangedEvent.
InitUIAAndHookLiveRegionChangedEvent ()
officeVersion = GetProgramVersion (GetAppFilePath ())
GetFixedProductVersion (GetAppFilePath (), 0, 0, officeMinorVersion, 0)
EndFunction

void function AutoFinishEvent()
;unset global because window is destroyed,
;or subsequent returns to window will not speak properly.
giPrevSDMControl = null()
if giScheduledFlashBrlMessage then
	unScheduleFunction(giScheduledFlashBrlMessage)
	giScheduledFlashBrlMessage = 0
	msgScheduledBrlFlash = cscNull
endIf
oUIA_Office = Null()
oUIA_OfficeToasts = null ()
CollectionRemoveAll(colOffice)
CollectionRemoveAll(col_KeyPressedInfo)
CollectionRemoveAll(c_BackstageFocusItemData)
oUIA_CustomMenuPrompt = Null()
PrevOfficeToastMessage = cscNull
EndFunction

void function OfficeAutomationEvent (object element, int eventID)
if eventID == UIA_LiveRegionChangedEventId then
	return OfficeLiveRegionChangedEvent (element)
endIf
endFunction

void function OfficeLiveRegionChangedEvent (object element)
; This is a very infrequent event in Microsoft Office.
; It handles toasts from within Office applications,
; notifications that appear above the document but below the ribbons.
; Although they are not technically system toasts, Microsoft treats them as such, and so should we.
; Notably when doing real-time co-authoring and collaboration in documents.
if stringIsBlank (element.name) then return endIf
var string message = stringTrimLeadingBlanks (stringTrimTrailingBlanks (element.name))
if message != prevOfficeToastMessage then
	SayMessage (OT_TOASTS, element.name)
endIf
prevOfficeToastMessage  = message
endFunction

int function ListenForUIAFocusChange()
if oUIA_Office
&& colOffice.initialized
	return true
endIf
if !colOffice colOffice = new collection endIf
colOffice.initialized = false
if ! oUIA_Office then ; events may already be being hooked for LiveRegionChangedEvent, don't want to destroy those.
	oUIA_Office = CreateObjectEx("FreedomSci.UIA",false, "UIAScriptAPI.x.manifest")
endIf
if !oUIA_Office return false endIf
if !ComAttachEvents(oUIA_Office,oUIA_Office_EventFunctionNamePrefix)
	oUIA_Office = Null()
	return false
endIf
if !oUIA_Office.AddFocusChangedEventHandler()
	oUIA_Office = Null()
	return false
endIf
var object focusElement = oUIA_Office.GetFocusedElement().BuildUpdatedCache()
if !focusElement
	oUIA_Office = Null()
	return false
endIf
var object processCondition = oUIA_Office.CreateIntPropertyCondition(UIA_ProcessIdPropertyId,focusElement.ProcessID)
if !processCondition
	oUIA_Office = Null()
	return false
endIf
var object treeWalker = oUIA_Office.CreateTreeWalker(processCondition)
if !treeWalker
	oUIA_Office = Null()
	return false
endIf
SetCurrentElementToDeepestFocusElement(oUIA_Office,treeWalker)
colOffice.treeWalker = treeWalker
colOffice.focus = treeWalker.currentElement
colOffice.initialized = true
return true
EndFunction

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
; Browse / Hide folders buttons in open / Save As dialogs:
If !KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then return endIf
var handle window = getFocus (), string ObjectName = GetObjectName (TRUE), int ObjectSubtypeCode = GetObjectSubtypeCode (TRUE)
if GetWindowSubtypeCode (window) == wt_toolbar 
&& ObjectSubtypeCode == WT_BUTTON then
	if StringCompare (objectName, OBJN_HIDE_FOLDERS_BTN) == 0
	|| StringCompare (ObjectName, OBJN_BROWSE_FOLDERS_BTN) == 0 then
	; This is one tool bar button whose name changes, but the events don't indicate as much.
		MSAARefresh ()
	endIf
endIf
endFunction

void function OfficeFocusChangedEvent(object element)
colOffice.focus = element
EndFunction

object function CreateUIAElementFromWindow(optional handle hWnd)
var object o = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if hWnd then
	return o.GetElementFromHandle(hWnd)
else
	return o.GetElementFromHandle(GetFocus())
EndIf
EndFunction

int function ShouldNotifyIfContextHelp ()
if getWindowClass (getFocus ()) == cwc_NetUIHwnd then
	; the false Insert F1 for Help message comes from GetObjectHelp returns new help phrases in Office 2013,
	;and this is not desirable for Speech and Braille to be outputting.
	return false
endIf
return ShouldNotifyIfContextHelp ()
endFunction

int function getOPTColor(string sKey, string sRGBDefault)
; This is in HKEY_CURRENT_USER, which is what the 1 means below.
var string baseKey = "Software\\Microsoft\\Shared Tools\\Proofing Tools"
var int val = getRegistryEntryDWord(1, baseKey, sKey)
; TODO: No difference between value of 0 (black) and failure (no such key).
; Key will not exist if user did not add it.
; Upshot: A custom color of black is not supported.
if !val
; Next condition checks for invalid color, which Office ignores also.
|| (val & 0xFF000000L)
then
	val = RGBStringToColor(sRGBDefault)
endIf
return val
endFunction

void function ScheduleBrailleFlashMessage(string msg, optional int DelayTime, int alsoFormat)
if StringIsBlank(msg) then
	return
endIf
if alsoFormat then
	msg = formatString(msg)
endIf
if giScheduledFlashBrlMessage then
	UnscheduleFunction(giScheduledFlashBrlMessage )
	let msgScheduledBrlFlash = msgScheduledBrlFlash+cscBufferNewLine+msg
else
	let msgScheduledBrlFlash = msg
EndIf
if !DelayTime then
	let giScheduledFlashBrlMessage = ScheduleFunction("FlashBrailleMessage",5)
else
	let giScheduledFlashBrlMessage =
		ScheduleFunction("FlashBrailleMessage",DelayTime)
endIf
EndFunction

void function ScheduleBrailleFlashMessageWithSpeechOutput(
	int UsingSpeechOutputType, string msg,
	optional int DelayTime, int alsoFormat)
if !ShouldItemSpeak(UsingSpeechOutputType) then
	;No message is scheduled because the speech will not speak for this output type
	return
endIf
ScheduleBrailleFlashMessage(msg,DelayTime, alsoFormat)
EndFunction

void function FlashBrailleMessage()
let giScheduledFlashBrlMessage = 0
BrailleMessage(msgScheduledBrlFlash)
let msgScheduledBrlFlash = cscNull
EndFunction

int function ScriptKeyClickSDMDlgToolbarFolderNavButton(string sButtonName)
var
	handle hReal,
	int iSaved_OPT_INCLUDE_GRAPHICS
let hReal = GetRealWindow(GetFocus())
if getWindowCategory(hReal) != WCAT_SDM then
	return false
EndIf
if SDMGetControlName(hReal,cId_FolderComboXP) != sdmCtrlName_LookIn
&& SDMGetControlSubtypeCode(hReal,cId_FolderComboXP) != wt_comboBox then
	return false
EndIf
TypeCurrentScriptKey()
sayCurrentScriptKeyLabel()
SayFormattedMessage(ot_control_name,sButtonName,cMsgSilent)
pause()
let iSaved_OPT_INCLUDE_GRAPHICS = GetJCFOption(OPT_INCLUDE_GRAPHICS)
SetJCFOption(OPT_INCLUDE_GRAPHICS,1)
Say(SDMGetControlActiveItem(GetRealWindow(GetFocus()),cId_FolderComboXP),ot_screen_message)
SetJCFOption(OPT_INCLUDE_GRAPHICS,iSaved_OPT_INCLUDE_GRAPHICS)
return true
EndFunction

String  Function GetObjectNameOrValue()
Var
	String sName
let sName=getObjectValue(true)
If ! sName then
	let sName=GetObjectName(true)
	If !sName then
		let sName=GetWord()
	EndIf
EndIf
return sName
EndFunction

string function GetFocusItemNameFromUIA(optional int bTryNameOnly)
var
	object oItem,
	string sItemName
let oItem = GetUIAObjectFocusItem()
;The item name may be the UIA name or value:
let sItemName = oItem.Name
if !sItemName
&& !bTryNameOnly then
	let sItemName = oItem.Value
EndIf
return sItemName
EndFunction

void function sdmSayWindowTypeAndText (handle hwnd, int iSDMControl)
var
	string sItemName,
	int iSubtype
let iSubtype = sdmGetControlSubtypeCode (hwnd, iSDMControl)
gstrBrlUIATabName = cscNull
if iSubtype == WT_LISTBOX then
	if (stringIsBlank (getSelectedText ())) ; we would otherwise say 'not selected'.
		;indicateControlType (WT_LISTBOX, SDMGetControlName (hwnd, iSDMControl), SDMGetControlActiveItem (hwnd, iSDMControl)); Control Active Item returns 'no selected item'.
		saveCursor ()
		PcCursor ()
		sItemName = getObjectName (TRUE)
		if (stringIsBlank (sItemName))
			MSAARefresh ()
			delay (1, TRUE)
			sItemName = getObjectName (TRUE)
		endIf
		if (stringIsBlank (sItemName))
			sItemName = getLine ()
		endIf
		indicateControlType (WT_LISTBOX, SDMGetControlName (hwnd, iSDMControl), sItemName)
		restoreCursor ()
		return
	endIf
endIf
if iSubtype == WT_EDIT
&& getObjectSubtypeCode (TRUE) == WT_MULTILINE_EDIT then
	sdmSayWindowTypeAndText (hwnd, iSDMControl)
	saveCursor ()
	pcCursor ()
	if ! stringIsBlank (getLine ()) then
		;Don't say 'blank' but read the text, this is the best method for these dialogs.
		;using getLine as text to read does cause extra text to be bled through.
		sayLine ()
	endIf
	restoreCursor ()
	return
elIf iSubtype == WT_EDITCOMBO then
	if stringLength (sdmGetControlActiveItem (hwnd, iSDMControl)) < 3 && stringLength (getObjectValue (TRUE)) > 3 then
		indicateControlType (WT_EDITCOMBO, sdmGetControlName (hwnd, iSDMControl), getObjectValue (TRUE))
		return
	endIf

elIf iSubtype == wt_tabControl then
	;if the SDM name cannot be retrieved and this is the focus item,
	;try using the UIA focus:
	if hWnd == GetFocus()
	&& iSDMControl == SDMGetFocus(hWnd)
	&& !SDMGetControlName(hwnd,iSDMControl) then
		let sItemName = GetFocusItemNameFromUIA()
		if sItemName then
			IndicateControlType(wt_tabControl,sItemName , cmsgSilent)
			gstrBrlUIATabName = sItemName
			return
		EndIf
	EndIf
endIf
sdmSayWindowTypeAndText (hwnd, iSDMControl)
endFunction

int function getWindowCategory (optional handle hwnd)
var
	int nCategory,
	string sClass,
	string sName,
	handle hFound,
	int iWindowType,
	string sOwner,
	handle hGreatGrandParent
if (inHjDialog()
|| menusActive()
|| globalMenuMode
|| userBufferIsActive())
	return WCAT_UNKNOWN
endIf
if (! hwnd)
	hwnd = getFocus ()
endIf
if getWindowClass (hwnd) == cwc_SysTreeView32 then
	return WCAT_UNKNOWN
endIf
if inRibbons ()
	return WCAT_UNKNOWN
endIf
if (getWindowClass (getRealWindow (hwnd)) == cWc_dlg32770
;hard check current window for alt+tab:
|| getWindowClass (getCurrentWindow ()) == cwc_dlg32771)
	return WCAT_UNKNOWN
endIf
sClass = getWindowClass (hwnd)
if (stringContains (stringLower (sClass), stringLower (cwc_RichEdit)))
	hwnd = getParent (hwnd)
	sClass = getWindowClass (hwnd)
endIf
;client area types:
if stringContains (sClass, wc_SDM)
	return WCAT_SDM
elIf (stringCompare (sClass, wc_Spreadsheet) == 0)
	return WCAT_SPREADSHEET
elif stringCompare (sClass, cwc_Word_Document2) == 0
|| stringCompare (sClass, cwc_Word_Document) == 0
	RETURN WCAT_DOCUMENT
elif stringCompare (sClass, wc_wwf) == 0
	return WCAT_DOCUMENT_WORKSPACE
elIf (stringCompare (sClass, wc_Presentation) == 0)
	return WCAT_PRESENTATION
elIf getWindowTypeCode(hwnd) == WT_Listview
	; Resolves Braille going into line mode in the Find dialog's listView control.
	return WCAT_UNKNOWN
endIf
iWindowType = GetWindowSubtypeCode (hWnd)
sOwner = GetOwningAppName (hWnd)
If StringContains (sOwner, an_MSWord)
|| StringContains (sOwner, an_envelope)
	If (iWindowType == WT_MULTILINE_EDIT	; RichEdit20W
	|| iWindowType == WT_EDIT	; RichEdit20WPt
	|| iWindowType == WT_BUTTON)
	&& stringContains (sOwner, an_envelope)
		Return (WCAT_MESSAGE)
	EndIf
EndIf
hGreatGrandParent = GetParent (GetParent (GetParent (hWnd)))
If (getWindowClass (hGreatGrandParent) == WC_OutlookMessage
&& StringContains (GetWindowName (hGreatGrandParent), WN_OutlookMessage)
&& GetWindowClass (hWnd) == cwc_RichEdit20W)
	Return (WCAT_MESSAGE)
EndIf
while (hwnd && ! nCategory)
	if stringContains (sClass, wc_SDM)
		nCategory = WCAT_SDM
	elif (stringContains (WC_TASK_PANE_WINDOWS, sClass))
		;these classes also apply to ribbons and status bar toolbars.
		;ribbons were tested for earlier in the function,
		;so test now whether it is a task pane or a status bar toolbar:
		let sName = GetWindowName(GetParent(hWnd))
		if sName == wn_StatusBar then
			nCategory = WCAT_STATUSBAR_TOOLBAR
		else
			;make sure this is not a customize ribbon button:
			if sName != wn_ribbon then
				nCategory = WCAT_TASK_PANE
			EndIf
		EndIf
	elIf (stringContains (sClass, wc_SINGLE_CLASS))
		nCategory = WCAT_SINGLE_CLASS
	endIf
	hwnd = getParent (hwnd)
	sClass = getWindowClass (hwnd)
endWhile
return nCategory
endFunction

int function FindCustomMenuPrompt()
if OfficeVersion < 16 then
	return FALSE
endIf
oUIA_CustomMenuPrompt = Null()
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
var object element = oUIA.GetFocusedElement().buildUpdatedCache()
var object treeCondition = oUIA.CreateIntPropertyCondition( UIA_ProcessIdPropertyId,element.processID)
var object treeWalker = oUIA.CreateTreeWalker(treeCondition)
treeWalker.currentElement = oUIA.GetRootElement()
if !treeWalker.gotoFirstChild() return false endIf
var object findCondition = oUIA.CreateAndCondition(
	oUIA.CreateAndCondition(
		oUIA.CreateIntPropertyCondition( UIA_ProcessIdPropertyId,element.processID),
		oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_CustomControlTypeId)),
	oUIA.CreateAndCondition(
		oUIA.CreateBoolPropertyCondition(UIA_HasKeyboardFocusPropertyId, UIATrue),
		oUIA.CreateStringPropertyCondition(UIA_ClassNamePropertyId,"NetUINetUIDialog")))
element = treeWalker.currentElement.findFirst(treeScope_descendants,findCondition)
if !element return false endIf
oUIA_CustomMenuPrompt = element
return true
EndFunction

int function MenuBarActiveProcessed(int mode)
if FindCustomMenuPrompt()
	Say(oUIA_CustomMenuPrompt.helpText,OT_CONTROL_NAME)
	BrailleMessage (oUIA_CustomMenuPrompt.helpText, 0, 60000)
	return true
endIf
if (getWindowCategory () == WCAT_SDM)
	return false
endIf
return MenuBarActiveProcessed(mode)
endFunction

int function MenuInactiveProcessed(int mode, int PrevMenuMode)
oUIA_CustomMenuPrompt = Null()
if (getWindowCategory () == WCAT_SDM)
	return 0;
endIf
return MenuInactiveProcessed (mode, PrevMenuMode)
endFunction

int function InTaskPaneDialog()
return getWindowCategory () == WCAT_TASK_PANE
EndFunction


int function SayTutorialHelp (int iObjType, optional int nIsScriptKey)
; for now, remove all tutor messages in ribbons:
if ribbonsActive () then return TRUE endIf
var int nType = iObjType;don't change the param value:
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if (nType == WT_LISTBOXITEM)
	nType = WT_LISTBOX
endIf
return SayTutorialHelp (nType, nIsScriptKey)
endFunction

string function GetUIAFocusObjectName()
var object o = CreateUIAFocusElement(true)
return o.name
EndFunction

void function sayObjectTypeAndText (optional int nDepth, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nDepth,includeContainerName) return endIf
var
	Handle hFocus = GetFocus (),
	int iSubtype = -1, ; -1 is an indication that we didn't call getObjectSubtypeCode yet. We want to minimize those.
	string sName = GetObjectName (TRUE), string sHelp = GetObjectHelp (),
	string sValue,
	string GalleryButtonName, int galleryButtonIsSelectable
if nDepth == 0 && getFocusStylesGalleryItemInfo (galleryButtonName, galleryButtonIsSelectable) then
	sayControlEXWithMarkup (0, galleryButtonName, GetControlTypeName (WT_BUTTON), getObjectState (TRUE))
	return
endIf
if dialogActive ()
&& getObjectSubtypeCode (TRUE) == WT_EDITCOMBO then
; a few cases in dialogs where combo box and edit combo both get read:
	iSubtype = getObjectSubtypeCode (TRUE, nDepth)
	if iSubtype == WT_COMBOBOX then
		return
	elIf iSubtype == WT_DIALOG_PAGE || iSubtype == WT_GROUPBOX then
	;sayObjectTypeAndText tries to speak the value as part of its speech, is is wrong because the value is also spoken by focused control.
	;dialog page type only needs to speak name:
		sayMessage (OT_CONTROL_NAME, getObjectName (TRUE, nDepth))
		return
	endIf
endIf
if iSubtype == -1 then
  iSubtype = getObjectSubtypeCode (TRUE,nDepth)
EndIf
if nDepth == 0
&& iSubtype == WT_MENU 
&& getWindowClass (hFocus) == cwc_NetUIHwnd then
	var string ParentName = GetObjectName (TRUE, 1)
	if ! GetObjectName (TRUE, nDepth) 
	&& ! StringIsBlank (ParentName) then
			indicateControlType (WT_BUTTONDROPDOWN, ParentName)
			return
	endIf
endIf
If IsVirtualRibbonActive () then
	if OnVirtualRibbonEditCombo()
		IndicateControlType(wt_editCombo,GetObjectName(),cscNull)
		Say(GetObjectValue(),ot_line)
		return
	endIf
	SayLine ()
	Return
endIf
if nDepth == 0
&& iSubtype == wt_ListBoxItem
&& FocusWindowSupportsUIA() then
	SayObjectTypeAndText (nDepth,includeContainerName)
	if stringCompare (sName, sHelp) != 0 then
		say(sHelp,ot_line)
	endIf
	if getObjectStateCode (TRUE) == STATE_SYSTEM_DEFAULT then
	; the only place where this applies is where you select list items that behave like grids,
	; but don't have the selection bits on.
	; In those instances, this bit is correct.
		Say (GetObjectState (TRUE), OT_ITEM_STATE)
	endIf
	return
endIf
if iSubtype == WT_LISTBOXITEM 
&& getWindowClass (getFocus ()) == wc_NetUIHWND
	if isWindowVisible (findWindow (getFocus (), wc_ReComboBox20W))
		sValue = getObjectName (TRUE,nDepth)
		if (getCharacterValue (stringLeft (sValue, 1)) == 9658)
			;This is an extra character used to format the field, but causes JAWS to read it as a question:
			sValue = stringRight (sValue, stringLength (sValue)-1)
		endIf
		indicateControlType (WT_LISTBOX, getWindowName (getFocus ()), stringTrimLeadingBlanks (stringTrimTrailingBlanks (sValue)))
		return
	else
		indicateControlType (WT_LISTBOX, getObjectName (TRUE, 1), getObjectName (TRUE))
		say (PositionInGroup (), OT_POSITION)
		return TRUE
	endIf
elif ((iSubtype == WT_EDIT || iSubtype == WT_READONLYEDIT || iSubtype == WT_MULTILINE_EDIT)
&& getWindowCategory () == WCAT_SPELL_CHECKER)
	return indicateControlType (iSubtype, sdmGetControlName (getFocus (), sdmGetFocus (getFocus ())), sdmGetControlActiveItem (getFocus (), sdmGetFocus (getFocus ())))
endIf
if OnRecentDocumentsPushPin() then
	SayObjectTypeAndText(0,includeContainerName)
	Say(GetObjectName(true,1),ot_control_name)
	return
EndIf
if GetMenuMode() > 0
	If !GetObjectSubtypeCode() then
		sayMessage(ot_control_type,cmsg6_l)
		; The object will be announced when one becomes selected in MenuActiveProcess.
		return
	endIf
EndIf
sayObjectTypeAndText (nDepth,includeContainerName)
endFunction

int function UpdateCustomStaticText (int iType, int nState, string sName, string sValue, string sDescription)
;The problem dialogs are those like Document Recovery,
;whose static text is in the middle someplace
if (iType == wt_static )
	gstrCustomDlgStaticText = sName
	if (StringIsBlank (gstrCustomDlgStaticText))
		gstrCustomDlgStaticText = sValue
	endIf
	if (! stringIsBlank (gstrCustomDlgStaticText))
		return ABORT
	endIf
elIf (! iType || iType == WT_DIALOG || iType == WT_DIALOG_PAGE
|| iType == WT_BUTTON || iType == WT_CHECKBOX || iType == WT_RADIOBUTTON
|| iType == WT_TABCONTROL || iType == WT_LISTBOX)
	return CONTINUE
else
	return ABORT
endIf
endFunction

int function DialogContainsCustomText  (handle hwnd)
var
	int nStaticFound

if (! stringIsBlank (getDialogStaticText ()))
	return FALSE
endIf
nStaticFound = EnumerateTypeAndTextStringsForWindow (hwnd, "UpdateCustomStaticText")

if (nStaticFound && ! stringIsBlank (gstrCustomDlgStaticText))
	return TRUE
endIf

;For custom SDM dialogs like Readability Statistics:
var int iSDMFocus, int iSDMStatic
iSDMFocus = sdmGetFocus (hwnd)
if iSDMFocus == sdmGetFirstControl (hwnd) then
	iSDMStatic = sdmGetNextControl (hwnd, iSDMFocus)
	if iSDMStatic == sdmGetLastControl (hwnd)
	&& sdmGetControlSubtypeCode (hwnd, iSDMStatic) == WT_GENERALPICTURE then
		gstrCustomDlgStaticText = sdmGetControlValue (hwnd, iSDMStatic)
		return ! stringIsBlank (gstrCustomDlgStaticText)
	endIf
endIf
endFunction

int function OnRecentDocumentsPushPin()
var
	handle hWnd
if GetMenuMode() != menu_active then
	return false
EndIf
let hWnd = GetFocus()
if GetWindowClass(hWnd) != wc_netUIHwnd then
	return false
EndIf
if GetObjectSubtypeCode() == wt_button then
	if GetObjectSubtypeCode(1,1) == wt_menu then
		if GetObjectSubtypeCode(1,2) == wt_GroupBox
		&& GetObjectName(1,2) == on_RecentDocuments then
			return true
		EndIf
	EndIf
EndIf
return false
EndFunction

Int Function IsResearchToolbar(handle hwnd)
var
	handle hTemp
if GetMenuMode()>0 then
	return false
endIf
If !(StringContains(GetWindowClass(Hwnd),wc_NetUiHwnd)
|| StringContains(GetWindowClass(GetParent(GetParent(hwnd))),wc_netUiHwnd)) then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if GetWindowName(hTemp) == wn_Research then
		return true
	EndIf
EndIf
return false
EndFunction

Int Function IsClipboardDialog(handle hwnd)
var
	handle hTemp
if GetMenuMode()>0 then
	return false
endIf
if !StringContains(GetWindowClass(hWnd),wc_sdm) then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOCommandbar
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if stringCompare(GetWindowName(hTemp),wn_OfficeClipboard)==0 then
		return true
	EndIf
EndIf
return false
EndFunction

string function FindHotKey(Optional string ByRef sPrompt)
var
	int nCategory = getWindowCategory  (),
	handle hFocus,
	handle hReal,
	int iType,
	int iRefData,
	object oFocus,
	int iObjID,
	int iObjChildID,
	string sHotkey
if oUIA_CustomMenuPrompt
	Return cscSpace+cscSpace+cscBufferNewLine
endIf
hFocus = getFocus ()
hReal = getRealWindow (hFocus)
if (nCategory == WCAT_SDM || nCategory == WCAT_SPELL_CHECKER)
	iType = getObjectSubtypeCode ()
	if (iType == wt_ComboBox
	|| iType == wt_button
	|| iType == wt_CheckBox
	|| iType == wt_radioButton
	|| iType == wt_edit_spinbox
	|| iType == wt_editCombo
	|| iType == wt_edit
	|| iType == wt_listboxItem)
		sPrompt = GetObjectName (TRUE)
		sHotKey = GetHotKey ()
		if (! sHotKey)
			oFocus = getObjectAtPoint (iRefData, getCursorCol(), getCursorRow()) ; note getFocusObject doesn't work as it gets the dlg rather than the child
			if (oFocus)
				sHotkey = oFocus.accKeyboardShortcut(iRefData)
				if (sHotkey != cscNull)
					return sHotkey
				endIf
			endIf
		EndIf
		return sHotkey
	endIf
endIf
if (stringContains (getWindowName (hReal), wn_autoCorrect)
&& stringContains (getWindowClass (getParent (hFocus)), cwc_dlg32770))
	;if GetObjectSubtypeCode()==wt_listbox then
	if (getWindowSubtypeCode (hFocus) == WT_LISTBOX)
		sPrompt = GetObjectName (TRUE)
		oFocus = getObjectAtPoint (iRefData, getCursorCol (), getCursorRow ()) ; note getFocusObject doesn't work as it gets the dlg rather than the child
		sHotkey = oFocus.accKeyboardShortcut (iRefData)
		return sHotkey
	endIf
endIf
iType = getObjectSubtypeCode (TRUE)
if stringCompare (GetWindowClass (hFocus), cwc_richEdit20w) == 0
&& (iType == wt_editCombo
|| iType == WT_EDIT) then
	oFocus = getObjectFromEvent (hFocus, iObjID, iObjChildID, iRefData)
	if (oFocus)
		sHotkey = oFocus.accKeyboardShortcut(iRefData)
		return sHotkey
	endIf
endIf
return FindHotKey (sPrompt)
endFunction

string function BrailleFindHotKey(Optional string ByRef sPrompt)
var
	handle hFocus,
	handle hReal,
	int iType,
	int iRefData,
	object oFocus,
	int iObjID,
	int iObjChildID,
	string sHotkey
If oUIA_CustomMenuPrompt
	Return cscSpace+cscSpace+cscBufferNewLine
endIf
hFocus = getFocus ()
hReal = getRealWindow (hFocus)
if (getWindowCategory () == WCAT_SDM)
	iType = GetObjectSubtypeCode()
	if (iType == wt_ComboBox
	|| iType == wt_button
	|| iType == wt_CheckBox
	|| iType==wt_radioButton
	|| iType==wt_edit_spinbox
	|| iType==wt_editCombo
	|| iType==wt_edit
	|| iType==wt_listboxItem)
		sPrompt = GetObjectName (TRUE)
		sHotKey = getHotKey ()
		if (! sHotKey)
			oFocus = getObjectAtPoint (iRefData, getCursorCol (), getCursorRow ()) ; note getFocusObject doesn't work as it gets the dlg rather than the child
			if (oFocus)
				sHotkey = oFocus.accKeyboardShortcut(iRefData)
				if (sHotkey != cscNull)
					return sHotkey
				endIf
			endIf
		endIf
		return sHotkey
	endIf
endIf
if (StringContains (getWindowName (hReal), wn_autoCorrect)
&& stringContains (getWindowClass (GetParent (hFocus)), cwc_dlg32770))
	;if GetObjectSubtypeCode()==wt_listbox then
	if (getWindowSubtypeCode (hFocus) == WT_LISTBOX)
		sPrompt = getObjectName (TRUE)
		oFocus = getObjectAtPoint (iRefData, getCursorCol (), getCursorRow ()) ; note getFocusObject doesn't work as it gets the dlg rather than the child
		let sHotkey = oFocus.accKeyboardShortcut(iRefData)
		return sHotkey
	endIf
endIf
iType = getObjectSubtypeCode (TRUE)
if stringCompare (GetWindowClass (hFocus), cwc_richEdit20w) == 0
&& (iType == WT_EDITCOMBO
|| iType == WT_EDIT) then
	oFocus = getObjectFromEvent (hFocus, iObjID, iObjChildID, iRefData)
	if  (oFocus)
		sHotkey = oFocus.accKeyboardShortcut(iRefData)
		return sHotkey
	endIf
endIf
return FindHotKey (sPrompt)
endFunction

int function SayTutorialHelpHotKey (handle hHotKeyWindow, int IsScriptKey)
var
	int iWinType,
	int iObjType,
	int iSpeak,
	string sHotKey,
	string sPrompt,
	string sMessage,
	int iPunctLevel
if (GlobalMenuMode)
	if (isVirtualRibbonActive())
		;Do nothing, hotkeys are irrelevant in virtual ribbons:
		return false
	endIf
endIf
iPunctLevel = getJcfOption (opt_punctuation)
SetJcfOption (opt_punctuation, 0)
if (isScriptKey)
	iSpeak = OT_line
else
	iSpeak = OT_access_key
endIf
if (getWindowCategory () == WCAT_SDM)
	sHotkey=self::findHotkey (sPrompt)
	if (! stringIsBlank (sHotkey))
		SayUsingVoice (vctx_message, sHotKey, iSpeak)
		SetJcfOption (opt_punctuation, iPunctLevel)
		return TRUE
	endIf
endIf
iWinType = GetWindowSubTypeCode (hHotKeyWindow)
if (! iWinType)
	iObjType = getObjectSubtypeCode (TRUE)
endIf
if (iWinType == WT_BUTTON
|| (!iWinType
&& (iObjType == WT_BUTTON
|| iObjType == WT_SPLITBUTTON)))
	sHotkey = getHotKey (getFocus ())
	if (! stringIsBlank (sHotKey))
		ExpandAltCommaInHotKey (sHotKey)
		if ! stringContains (sHotKey, cmsgHotKeyAltFollowedBy) then
		;This is an accelerator and should speak itself like Narrator, e.g control plus c
			setJCFOption (OPT_PUNCTUATION, 3)
		endIf
		SayUsingVoice (vctx_message, sHotKey,iSpeak)
		SetJcfOption (opt_punctuation, iPunctLevel)
		return true
	endIf
endIf
delay (1,true)
if (RibbonsActive ())
	sHotkey = getHotKey ()
	if (stringIsBlank (sHotKey))
		sHotKey = findHotKey (sPrompt)
	endIf
	if (! stringIsBlank (sHotKey)); one or more methods has now found it
		ExpandAltCommaInHotKey (sHotKey)
		if ! stringContains (sHotKey, cmsgHotKeyAltFollowedBy) then
		;This is an accelerator and should speak itself like Narrator, e.g control plus c
			setJCFOption (OPT_PUNCTUATION, 3)
		endIf
		SayUsingVoice(vctx_message, sHotKey, iSpeak)
		SetJcfOption (OPT_PUNCTUATION, iPunctLevel)
		return TRUE
	endIf
endIf
if (iObjType == WT_MENU
|| iObjtype == WT_SPLITBUTTON
|| getObjectSubtypecode (TRUE) == WT_EDITCOMBO)
	sHotkey = getHotKey ()
	if (! stringIsBlank (sHotKey))
		sHotKey = findHotKey (sPrompt)
	endIf
	if (! stringIsBlank (sHotKey)); one method found
		ExpandAltCommaInHotKey (sHotKey)
		if ! stringContains (sHotKey, cmsgHotKeyAltFollowedBy) then
		;This is an accelerator and should speak itself like Narrator, e.g control plus c
			setJCFOption (OPT_PUNCTUATION, 3)
		endIf
		SayUsingVoice (vctx_message, sHotKey, iSpeak)
		SetJcfOption (opt_punctuation, iPunctLevel)
		return TRUE
	else
		SayTutorialHelpHotKey (hHotKeyWindow, isScriptKey)
		setJcfOption (opt_punctuation, iPunctLevel)
		return TRUE
	endIf
endIf
if isBackStageView(hHotKeyWindow) then
	let sHotkey=GetHotKey()
	if StringContains(sHotKey,sc_AltComma) then
		let sHotKey=stringSegment(sHotkey,scComma,-1)
		SayUsingVoice(vctx_message,sHotKey,iSpeak)
		SetJcfOption(opt_punctuation,iPunctLevel)
		return true
	endIf
endIf
SayTutorialHelpHotKey (hHotKeyWindow, isScriptKey)
SetJcfOption(opt_punctuation,iPunctLevel)
EndFunction

string function GetCustomTutorMessage()
var
	handle hWnd,
	int iSubtype,
	int iState,
	string sValue,
	string sObjName
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
If oUIA_CustomMenuPrompt
	Return cscSpace+cscSpace+cscBufferNewLine;dud messsage
endIf
hWnd = GetFocus()
iSubtype = GetObjectSubtypeCode()
if iSubtype == WT_TABCONTROL then
	return msgTabControlOfficeTutorHelp
endIf
if InRibbons()
	If iSubtype==wt_button
	&& getObjectName(true)==wn_split
		return msgButton+cscSpace+getObjectDescription()
	EndIf
ElIf IsStatusBarToolBar(hWnd) then
	if iSubtype==wt_button then
		let sObjName=GetObjectName()
		If StringCompare(sObjName,wn_Zoom)==0 then
			GetObjectInfoByName (hwnd,wn_Zoom,1,iSubtype,iState,sValue)
			return sValue+cscSpace+msgStatusBarToolbarButtonHelp+cscSpace+msgStatusBarToolBarTutorialHelp
		endIf
		return msgStatusBarToolbarButtonHelp+cscSpace+msgStatusBarToolBarTutorialHelp
	else
		return msgStatusBarToolBarTutorialHelp
	endIf
ElIf OnRecentDocumentsPushPin() then
	return msgRecentDocumentsPushPinTutorialHelp
ElIf IsResearchToolbar(hwnd) then
	return msgResearchToolbarTutorialHelp
ElIf IsClipboardDialog(hwnd) then
	return msgClipboardDialogTutorialHelp
elIf iSubtype==wt_splitButton then
	if isOffice365 () then
		return msgSplitButtonOffice2016TutorHelp
	else
		return msgMenuSplitButtonTutorHelp
	endIf
elIf inOptionsDialog(hwnd) then
	if GetObjectName(true,1)==sc_OptionsDlgCategories then
		return msgOptionsDlgCategoriesTutorHelp
	elIf iSubType==wt_listboxItem then
		return msgListbox
	elIf iSubtype==wt_treeviewItem then
		return msgTreeview
	endIf
elIf isBackstageView(hwnd) then
	if iSubtype==wt_tabControl then
		return msgBackStageViewTabTutorHellp
	endIf
endIf
return GetCustomTutorMessage()
EndFunction

int function SayTutorialHelpForRibbons(int ISpeak)
if RibbonsActive() == LowerRibbon_Active
&& !IsVirtualPCCursor()
&& GetObjectSubtypeCode() == wt_splitButton
&& officeVersion >= 16
	SayUsingVoice (VCTX_MESSAGE,msgSplitButtonOffice2016TutorHelp, iSpeak)
	return true
endIf
return SayTutorialHelpForRibbons(ISpeak)
EndFunction

void function TutorSDMHelper ()
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
unScheduleFunction (giFNTutorSDMHelper)
giFNTutorSDMHelper = OFF
; pass -1 to indicate that this event is being called for the 2nd time
TutorMessageEvent (-1, getMenuMode ())
endFunction

; function may be called with -1 for the hwndFocus to indicate that it is being called a second time
void function tutorMessageEvent (handle hwndFocus, int nMenuMode)
unscheduleFunction (giFNTutorSDMHelper)
giFNTutorSDMHelper = OFF
if (getWindowCategory () == WCAT_SDM && hwndFocus != -1)
	;tutor goes off too early here:
	giFNTutorSDMHelper = scheduleFunction ("TutorSDMHelper", 3)
	return
; replace the -1 with the current handle from getFocus()
elif (hwndFocus == -1) then
	tutorMessageEvent (getFocus(), nMenuMode)
	return
endIf
tutorMessageEvent (hwndFocus, nMenuMode)
endFunction

void function sayHighlightedText (handle hwnd, string buffer)
if (globalSuppressHighlightedText)
	globalSuppressHighlightedText = FALSE
	return
endIf
if (getWindowCategory () == WCAT_SDM)
	return
endIf
return sayHighlightedText (hwnd, buffer)
endFunction

int function OnNetUIMenuButton()
return GetMenuMode() == menu_active
	&& GetWindowClass(GetFocus()) == wc_NetUIHWND
	&& GetObjectSubtypeCode() == WT_MENU
	&& GetObjectStateCode() & ctrl_subMenu
EndFunction

int function OnNetUITWBtnMenuItem ()
if GetMenuMode() != menu_active
|| GetWindowClass(GetFocus()) != wc_NetUIHWND
	return false
endIf
var object o = CreateUIAFocusElement(true)
return o.controlType == UIA_MenuItemControlTypeId
	&& o.className == "NetUITWBtnMenuItem"
EndFunction

int function MenuActiveProcessed(int mode, handle hWnd)
var
	handle hFocus,
	int iSubtype,
	string sName
If mode == MENU_ACTIVE
	if IsVirtualRibbonActive()
		return default::MenuActiveProcessed(mode,hWnd)
	EndIf
	hFocus = GetFocus()
	if hWnd != hFocus
	&& isBackStageView(hFocus)
		iSubtype = GetObjectSubtypeCode(true,1)
		if (iSubtype == wt_menuBar || iSubtype == wt_contextMenu)
			sName = GetObjectName(true,1)
			if sName
				IndicateControlType (WT_MENU,sName)
				return true
			endIf
		endIf
	endIf
	;The test for OnNetUIMenuButton mus preceed the test for InNonDroppedContextMenu,
	;because the menu associated with the button is not dropped,
	;but we do not want to automatically drop it:
	if OnNetUIMenuButton()
		IndicateControlType (WT_MENU,cscSpace,cscSpace) ;name is announced on focus change
		return true
	elif InNonDroppedContextMenu()
		;The context menu is actually object type menu,
		;and when the first item is not yet selected the object name consists of all items in the menu
		;so we need to select the first item.
		TypeKey (cksDownArrow); Select first item in menus
		return
	EndIf
EndIf
;if  getWindowClass (hwnd) == wc_NetUIHwnd
;&& getWindowClass (getParent (hwnd)) == wc_ParentClass_FULLPAGEUIHost then
;This is an invalid window:
if !hwnd
	;Keep from double dropping the user back onto those tabs and disallowing them from moving up to the menus,
	;from Info tab back to Save As item in menu:
	IndicateControlType (WT_MENU,cscSpace,cscSpace) ; child menu object reads via FocusChangedEventEX
	return TRUE
endIf
MenuActiveProcessed(mode,hWnd)
EndFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if nIsScriptKey
	col_KeyPressedInfo.ScriptName = GetScriptAssignedTo(strKeyName)
else
	col_KeyPressedInfo.ScriptName = cscNull
endIf
col_KeyPressedInfo.IsScriptKey = nIsScriptKey
col_KeyPressedInfo.ValueChanged = false
return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,optional int bIsFocusObject)
if !bIsFocusObject
	if nObjType == wt_listBoxItem
	; combo boxes in standard or virtual ribbons
	&& (RibbonsActive () || IsVirtualRibbonActive ())
	&& GetWindowClass(hWnd) == wcReListBox
	&& GetWindowClass(GetFocus()) == wc_ReComboBox20W
		Say(sObjName,ot_line)
		return
	elif nObjType == wt_edit
	&& GetWindowClass(hWnd) == cwc_Richedit60W
	&& GetWindowClass(GetFocus()) == cwc_Richedit60W
		;Reduce overly verbose speech by excluding deletion editing.
		;Editing through typing causes a value change when the edited text changes,
		;and a second value change if a new font is chosen from the list.
		;Because we cannot know whether one or two events will fire when editing,
		;we use col_KeyPressedInfo.ValueChanged to announce the second change if it occurs.
		if (col_KeyPressedInfo.IsScriptKey || col_KeyPressedInfo.ValueChanged)
		&& !StringContains(ScriptNames_ValueChangedWhenEditing,FormatString(scriptNames_Segment,col_KeyPressedInfo.ScriptName))
			Say(SMMStripMarkup(sObjValue),ot_line)
		endIf
		col_KeyPressedInfo.ValueChanged = true
		return
	endIf
endIf
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
if OnRecentDocumentsPushPin() then
	if nState then
		IndicateControlState(iObjType,nState)
	else
		IndicateControlState(iObjType,nState,msgStateNotPressed)
	EndIf
	return
EndIf
if iObjType == wt_ListBoxItem then
	if InOptionsDialog(hObj)
	|| MenusActive() then
		if !nState then
			;navigation in the Options list is so sluggish
			;that we get state change to not selected
			;before the active item changes.
			;we do not want to hear the "not selected".
			return
		EndIf
	EndIf
EndIf
if (iObjType == WT_LISTBOXITEM && getWindowClass (hObj) == wc_netUiHwnd
&& getWindowClass (getParent (hObj)) == wc_NetUIToolWindow)
	;spawned from ribbon | split button = drop down list,
	;example = tables off of insert:
	Return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

Int function BrailleAddObjectState(int nType)
Var
	handle hwnd,
	int DoNotTranslate = TRUE, ; const for states where no translation is sent.
	int nState
if IsTouchCursor() then
	return BrailleAddObjectState(	nType)
endIf
Let hwnd=GetFocus()
if nType==wt_treeviewItem
&& globalMenuMode>0
&& GetWindowClass(hwnd)==cwc_sysTreeview32 then ; we are on treview item with checked statet on a menu
	let nState=TVGetItemStateImageIndex(hwnd)
	if !nState then ; checked
		BrailleAddString(cmsgBrailleChecked1_l,0,0,0, DoNotTranslate)
	ElIf nState==3 then ; unchecked
		BrailleAddString(cmsgBrailleUnchecked1_l,0,0,0, DoNotTranslate)
	EndIf
	return true
elIf nType==wt_listboxItem then
	let nState=GetControlAttributes(true)
	if nState==1 then ; checked
		BrailleAddString(cmsgBrailleChecked1_l,0,0,0, DoNotTranslate)
	ElIf nState==2 then ; unchecked
		BrailleAddString(cmsgBrailleUnchecked1_l,0,0,0, DoNotTranslate)
	EndIf
	return true
EndIf
return BrailleAddObjectState(	nType)
EndFunction

int function IsFullpageUIHostVisible()
var
	handle hWnd
let hWnd = GetFirstChild(GetAppMainWindow(GetFocus()))
return IsWindowVisible(hWnd)
	&& GetWindowClass(hWnd) == wc_FullpageUIHost
EndFunction

int Function HandleCustomAppWindows (handle hAppWnd)
if !inHjDialog () then
	if IsFullpageUIHostVisible()
		SayWindowTypeAndText(hAppWnd)
		Say(sc_BackStageView,ot_dialog_name)
		return true
	EndIf
EndIf
return HandleCustomAppWindows (hAppWnd)
EndFunction

Void Function SayObjectActiveItemWithDescription (optional int AnnouncePosition)
if GetObjectSubtypeCode (TRUE) == WT_GRID then
	SayObjectActiveItem ()
	Say (GetObjectState (TRUE), OT_ITEM_STATE)
	return
endIf
SayObjectActiveItemWithDescription (AnnouncePosition)
endFunction

void function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
Var
	int iSubtype,
	int iObjtype,
	string sObjName = GetObjectName (TRUE),
	string sObjHelp = getObjectHelp (),
	int iState,
	int iPunctLevel
if inHJDialog () then
	ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
	return
endIf
let iSubType = GetWindowSubtypeCode (CurHwnd)
if (! iSubtype)
	let iSubtype = GetObjectSubtypeCode (true)
endIf
let iObjType = getObjectSubtypeCode (TRUE)
if iObjType == wt_ListBoxItem
&& FocusWindowSupportsUIA() then
	say(sObjName,ot_line)
	if StringCompare (sObjName, sObjHelp) !=0 then
		say(sObjHelp,ot_line)
	endIf
	return
endIf
let sObjName = GetObjectName (TRUE)
if (iSubtype == WT_LISTBOX)
	if (StringContains (GetWindowName (GetRealWindow (curHwnd)), wn_autoCorrect))
		iPunctLevel = getJCFOption (opt_punctuation)
		SetJCFOption (opt_punctuation, 3)
		SayFromCursor ()
		SetJcfOption (opt_punctuation, iPunctLevel)
		globalSuppressHighlightedText= true
		return
	endIf
	if iObjType == wt_ListBoxItem
	&& !sObjName then
		;this typically happens in the Clip Art dialog:
		MSAARefresh()
	endIf
endIf
ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
EndFunction

handle function FindAncestorWindowOfClass(string sClass, handle hWnd)
var
	handle hTemp
let hTemp = hWnd
while hTemp
&& StringCompare(sClass,GetWindowClass(hTemp)) != 0
	let hTemp = GetParent(hTemp)
EndWhile
return hTemp
EndFunction

int function WasOfficeSplashScreen ()
;See comment in FocusChangedEvent
return gbWasSplashScreenInOfficeFocusChangedEventEx
EndFunction

void function NotifyIfContextHelp()
; keep this function from constantly firing when focus changes on the AwesomeBar.
if getWindowClass (getFocus ()) == wcNavigationBar then return endIf
return NotifyIfContextHelp()
endFunction

int function FocusRedirectedOnFocusChangedEventEx (handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild, int nChangeDepth)
var string focusClass = getWindowClass (hwndFocus)
if focusClass == wcNavigationBar 
&& getObjectSubtypeCode (TRUE) == WT_GROUPBOX then
; first time AweSomeBar takes focus, UIA knows the focus as button in group, but JAWS still thinks focus is on the group
	UIARefresh ()
	return FALSE; First FocusChange will speak the title of the navigation bar.
endIf
;if focusClass == cWcIEServer && ! dialogActive () then
; This causes pane reading issues all over Office,
; because after the switch back code from Office Help happens, the objects aren't yet loading.
;	LastOfficeApplicationConfigName = GetActiveConfiguration ()
;	switchToConfiguration ("Office Help 2007")
;	return TRUE
;endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) 
endFunction

void function FocusChangedEventEx (handle hwndFocus,int nObject,int nChild,handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
;Sometimes, when loading a document for an Office application,
;the Office configuration will briefly load while focus is on the Office splash screen.
;The test for the splash screen is made here
;because the splash screen must be tested for as early as possible in the focus change process.
;When the configuration for an Office application loads,
;the scripts can test in an overwritten FocusChangedEventEx if the previous focus was the Office splash screen.
;Because the vareiable is updated at the start of this function,
;application scripts which test for the splash screen must test before the Office FocusChangedEventEx runs,
;and save the value if it is needed later.
gbWasSplashScreenInOfficeFocusChangedEventEx = GetWindowClass(hWndFocus) == wc_OfficeSplashScreen
GlobalCommandBarWindow = FindAncestorWindowOfClass(wc_MsoCommandBarDock,hwndFocus)
if RibbonsActive ()
&& !IsVirtualRibbonActive ()
&& !IsFormsModeActive()
	if !oUIA_CustomMenuPrompt
		SpeakRibbonItem(nChangeDepth)
	endIf
ElIf IsVirtualRibbonActive ()
|| (RibbonsActive () && IsFormsModeActive())
	Default::FocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
elif hwndFocus == hwndPrevFocus
&& GetWindowClass(hwndFocus) == wcReListBox
	return ActiveItemChangedEvent (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild)
else
	FocusChangedEventEx (hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild,nChangeDepth)
endIf
globalPrevCommandBarWindow = GlobalCommandBarWindow
endFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if (nType == wt_ListBoxItem || nType == wt_grid)
&& nChangeDepth > 0
&& sClass ==wc_netUIHwnd
	;Prevent comboboxes on the backstage pane from announcing a plethora of depth changes when the listbox or grid drops down:
	if GetObjectSubtypeCode(true,1) == wt_ListBox
	|| GetObjectSubtypeCode(true) == wt_grid
		if GetObjectSubtypeCode(true,2) == wt_comboBox
		|| GetObjectSubtypeCode(true,3) == wt_comboBox
		|| GetObjectSubtypeCode(true,4) == wt_comboBox
		|| GetObjectSubtypeCode(true,5) == wt_comboBox
			SayObjectTypeAndText()
			return
		endIf
	endIf
endIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
EndFunction

int function MenuProcessedOnFocusChangedEventEx(
	handle hwndFocus, handle hwndPrevFocus,
	int nType, optional int nChangeDepth)
if BackstageViewWindowWasProcessed(hwndFocus,hwndPrevFocus) then
	return true
EndIf
return MenuProcessedOnFocusChangedEventEx(hwndFocus, hwndPrevFocus, nType, nChangeDepth)
EndFunction

int function BackstageViewWindowWasProcessed(handle FocusWindow, handle PrevWindow)
if isBackStageView(FocusWindow) then
	ListenForUIAFocusChange()
	if !c_BackstageFocusItemData
		c_BackstageFocusItemData = new collection
	EndIf
	FocusChangedEventProcessBackStageView(FocusWindow, PrevWindow)
	return true
endIf
oUIA_Office = Null()
CollectionRemoveAll(colOffice)
CollectionRemoveAll(c_BackstageFocusItemData)
return false
EndFunction

int function IsDescendedFromMSOCommandBar(handle hWnd)
var
	handle h
let h = hWnd
while h
	if GetWindowClass(h) == wc_msoCommandBar then
		return true
	EndIf
	let h = GetParent(h)
EndWhile
return false
EndFunction

int function FocusChangedEventShouldProcessAncestors(handle FocusWindow, optional handle prevFocusWindow)
var int bResult = FocusChangedEventShouldProcessAncestors(FocusWindow)
if bResult
&& FocusWindowSupportsUIA()
	bResult = !IsDescendedFromMSOCommandBar(FocusWindow)
EndIf
return bResult
EndFunction

int function HandleCustomBackstageViewWindow()
if GetObjectSubtypeCode() == wt_button
&& GetObjectSubtypeCode(false,1) == wt_ListBoxItem then
	SayBackStageDocumentOrLocationButton()
	return true
EndIf
return false
EndFunction

script SayWord()
if IsPCCursor()
&& !UserBufferIsActive() then
	if isBackStageView(getFocus()) then
		if HandleCustomBackstageViewWindow()
			return
		EndIf
	elif OnNetUIMenuButton()
		IndicateControlType(wt_ButtonDropDown,GetUIAFocusObjectName(),cscSpace)
		return
	EndIf
EndIf
PerformScript SayWord()
EndScript

script SayLine()
var
	handle hWnd,
	int iSDMCtrl,
	string galleryButtonName, int galleryButtonIsSelectable
if IsPCCursor()
&& !UserBufferIsActive() then
	if getFocusStylesGalleryItemInfo (galleryButtonName, galleryButtonIsSelectable) then
		sayControlEXWithMarkup (0, galleryButtonName, GetControlTypeName (WT_BUTTON), getObjectState (TRUE))
		return
	endIf
	if isBackStageView(getFocus()) then
		if HandleCustomBackstageViewWindow()
			return
		EndIf
	elif OnNetUIMenuButton()
		IndicateControlType(wt_ButtonDropDown,GetUIAFocusObjectName(),cscSpace)
		return
	elif getWindowCategory () == WCAT_SDM then
		let hWnd = getFocus()
		let iSDMCtrl = SDMGetFocus(hWnd)
		If sdmGetControlSubtypeCode (hWnd,iSDMCtrl) == wt_tabControl
		&& !sdmGetControlName(hWnd,iSDMCtrl) then
			sdmSayWindowTypeAndText(hwnd, iSDMCtrl)
			return
		EndIf
	elif OnVirtualRibbonEditCombo()
		IndicateControlType(wt_editCombo,GetObjectName(),cscNull)
		Say(GetObjectValue(),ot_line)
		return
	EndIf
EndIf
PerformScript SayLine()
EndScript

void function SayParentGroupboxForWindowPromptAndText()
var
	int iSubtype
if IsBackStageView(GetFocus()) then
	if GetObjectSubTypeCode(FALSE,1) == wt_groupBox then
		;Skip announcement of these groupboxes,
		;they are announced as the level 0 item name
		let iSubtype = GetObjectSubTypeCode()
		if iSubtype == wt_listBoxItem then
			if GetObjectSubTypeCode(FALSE,2) == wt_listBox
			&& !GetObjectName(FALSE,2) then
				return
			endIf
		elif iSubtype == wt_comboBox
			if GetObjectName(false,1) == GetObjectName() then
				return
			EndIf
		EndIf
	EndIf
EndIf
SayParentGroupboxForWindowPromptAndText()
EndFunction

String Function GetControlDescriptionCached ()
Return c_BackstageFocusItemData.GroupStaticText
EndFunction

object function UIAGetGroupAncestorOfFocusWithGroupName(string 	Name)
var object treeWalker = colOffice.treeWalker
treeWalker.currentElement = colOffice.focus
while treeWalker.gotoParent
	if treeWalker.currentElement.ControlType == UIA_GroupControlTypeId
	&& treeWalker.currentElement.name == Name
		return treeWalker.currentElement
	endIf
endWhile
return Null()
EndFunction

object function GetConditionsForBackStageGroupStaticText(object Group)
var
	object ReadOnlyCondition,
	object NotKeyboardFocusableCondition,
	object NotGroupNameCondition,
	object GroupControlTypeCondition,
	object TextControlTypeCondition,
	object EditControlTypeCondition,
	object ImageControlTypeCondition,
	object NetUILabelClassCondition,
	object NetUIPropertyTextboxClassCondition,
	object NetUIImageClassCondition,
	object TextControlWithNetUILabelClassCondition,
	object ImageControlWithNetUIAImageClassCondition,
	object StaticTextLabelCondition,
	object StaticTextPropertyCondition,
	object DetailedInformationgroupCondition,
	Object MainCondition
readOnlyCondition = oUIA_Office.CreateBoolPropertyCondition(UIA_ValueIsReadOnlyPropertyId,UIATrue)
NotKeyboardFocusableCondition = oUIA_Office.CreateBoolPropertyCondition(UIA_IsKeyboardFocusablePropertyId,false)
NotGroupNameCondition = oUIA_Office.CreateNotCondition(oUIA_Office.CreateStringPropertyCondition (UIA_NamePropertyId, Group.name))
GroupControlTypeCondition = oUIA_Office.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_GroupControlTypeId)
TextControlTypeCondition = oUIA_Office.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_TextControlTypeId)
EditControlTypeCondition = oUIA_Office.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_EditControlTypeId)
ImageControlTypeCondition = oUIA_Office.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_ImageControlTypeId)
NetUILabelClassCondition = oUIA_Office.CreateStringPropertyCondition(UIA_ClassNamePropertyId,uiaClass_NetUILabel)
NetUIPropertyTextboxClassCondition = oUIA_Office.CreateStringPropertyCondition(UIA_ClassNamePropertyId, uiaClass_NetUIPropertyTextbox)
NetUIImageClassCondition = oUIA_Office.CreateStringPropertyCondition(UIA_ClassNamePropertyId, uiaClass_NetUIImage)
TextControlWithNetUILabelClassCondition =
	oUIA_Office.CreateAndCondition(
		NetUILabelClassCondition,
		TextControlTypeCondition)
ImageControlWithNetUIAImageClassCondition =
	oUIA_Office.CreateAndCondition(
		NetUIImageClassCondition,
		ImageControlTypeCondition)
StaticTextLabelCondition =
	oUIA_Office.CreateAndCondition(
		NotGroupNameCondition,
		TextControlWithNetUILabelClassCondition)
StaticTextPropertyCondition =
	oUIA_Office.CreateAndCondition(
		oUIA_Office.CreateAndCondition(readOnlyCondition,NotKeyboardFocusableCondition),
		oUIA_Office.CreateAndCondition(EditControlTypeCondition,NetUIPropertyTextboxClassCondition))
DetailedInformationgroupCondition =
	oUIA_Office.CreateAndCondition(
		GroupControlTypeCondition,
		oUIA_Office.CreateStringPropertyCondition(UIA_NamePropertyId,UIAName_DetailedInformation))
MainCondition =
	oUIA_Office.CreateOrCondition(
		oUIA_Office.CreateOrCondition(
			StaticTextLabelCondition,
			StaticTextPropertyCondition),
		oUIA_Office.CreateOrCondition(
			DetailedInformationgroupCondition,
			ImageControlWithNetUIAImageClassCondition))
return MainCondition
EndFunction

void Function SayBackStageGroupStaticText(string GroupName)
Var
	object treeWalker,
	object element,
	Object Group,
	object StaticCondition,
	Object oStatic,
	object oDetails,
	object Label,
	int IsLabel,
	String sText,
	Int i, int j, int n, int m
c_BackstageFocusItemData.GroupStaticText = cScNull
element = oUIA_Office.GetElementFromHandle(GetFocus())
if !element return false endIf
Group = UIAGetGroupAncestorOfFocusWithGroupName(GroupName)
if !Group return endIf
StaticCondition = GetConditionsForBackStageGroupStaticText(Group)
If !StaticCondition return false endIf
oStatic = Group.FindAll(treeScope_Children,StaticCondition)
treeWalker = colOffice.treeWalker
n = oStatic.Count-1
For i = 0 to n
	element = oStatic(i)
	sText = cscNull
	;Try to determine if element is a label for the next control,
	;does not apply to group information details or image:
	IsLabel = false
	if element.ControlType != UIA_GroupControlTypeId
	&& element.ControlType != UIA_ImageControlTypeId
		treeWalker.currentElement = element
		if treeWalker.gotoNextSibling()
			;Don't test move to first child,
			;since if the move fails the treeWalker remains at the current position:
			treeWalker.gotoFirstChild()
			label = treeWalker.currentElement.labeledBy
			if label
				IsLabel = (oUIA_Office.CompareElements(label,element) == UIATrue)
			endIf
		endIf
	endIf
	if element.className == uiaClass_NetUILabel
	&& !IsLabel
		sText = element.Name
		if sText
			Say(sText,ot_dialog_text)
			c_BackstageFocusItemData.GroupStaticText = c_BackstageFocusItemData.GroupStaticText+ cScSpace + sText
		endIf
	elif element.className == uiaClass_NetUIPropertyTextbox
		sText = element.Name
		if sText
			Say(sText,ot_dialog_text)
			c_BackstageFocusItemData.GroupStaticText = c_BackstageFocusItemData.GroupStaticText+ cScSpace + sText
		endIf
		sText = element.GetValuePattern().value
		if sText
			Say(sText,ot_dialog_text)
			c_BackstageFocusItemData.GroupStaticText = c_BackstageFocusItemData.GroupStaticText+ cScSpace + sText
		endIf
	elif element.ControlType == UIA_ImageControlTypeId
		sText = element.Name
		if sText
			Say(sText,ot_dialog_text)
			c_BackstageFocusItemData.GroupStaticText = c_BackstageFocusItemData.GroupStaticText+ cScSpace + sText
		endIf
	elif element.controlType == UIA_GroupControlTypeId
		oDetails = oStatic(i).FindAll(TreeScope_Children, oUIA_Office.CreateTrueCondition())
		m = oDetails.count-1
		for j = 0 to m
			sText = oDetails(j).Name
			Say(sText,ot_dialog_text)
			c_BackstageFocusItemData.GroupStaticText = c_BackstageFocusItemData.GroupStaticText+ cScSpace + sText
		endFor
	endIf
	;element may additionally have help text:
	if element.HelpText
	&& !IsLabel
	&& element.HelpText != sText
	&& element.isKeyboardFocusable != UIATrue
		sText = element.HelpText
		Say(sText,ot_dialog_text)
		c_BackstageFocusItemData.GroupStaticText = c_BackstageFocusItemData.GroupStaticText+ cScSpace + sText
	endIf
EndFor
Return TRUE
EndFunction

void function SayBackStageDocumentOrLocationButton()
;The list item parent causes irroneous position in group information to be spoken for the button children,
;so just say the button type and name:
var string sName = GetObjectName()
IndicateControlType(wt_button,sName,cMsgSilent)
;For Open, Recent Documents, Recent Places, etc,
;the help text gives the full path for files and locations:
var string sText = GetObjectHelp()
if sText
&& sText != sName
	SayUsingVoice(vctx_message,sText,ot_screen_message)
endIf
EndFunction

void function ProcessBackStageViewLoop(int byRef nLevel)
;This is the loop body used by FocusChangedEventProcessBackStageView.
;We use this function as a helper to work around the issue of not having a continue statement for while loops.
;By returning early in this function, we achieve the same affect as a continue statement in the while loop.
;This function is responsible for speaking at the various levels,
;and for decrementing the nLevel variable so that the loop can exit.
;Failure to decrement the nLevel variable will result in an infinite loop.
var
	int iType,
	string sName,
	string sText
iType = GetObjectSubtypecode(true,nLevel)
if iType == wt_tabControl
	if colOffice.focus.controlType == UIA_TabItemControlTypeId
		if colOffice.focus.className == "NetUIRibbonTab"
			c_BackstageFocusItemData.MainTab = colOffice.focus.name
		elif colOffice.focus.className == "NetUISimpleButton"
			c_BackstageFocusItemData.CategoryTab = colOffice.focus.name
		endIf
	endIf
endIf
if nLevel > 0
&& iType == wt_groupBox
	sName = GetObjectName(true,nLevel)
	c_BackstageFocusItemData.GroupName = sName
	if sName != c_BackstageFocusItemData.MainTab
	&& sName != c_BackstageFocusItemData.CategoryTab
		if GetObjectSubtypeCode(true,nLevel+1) != iType
		&& GetObjectName(true,nLevel+1) != sName
			IndicateControlType(wt_groupBox,sName)
		endIf
	endIf
	SayBackStageGroupStaticText(sName)
	nLevel = nLevel-1
	return
endIf
if nLevel == 1
	if iType == wt_ListBoxItem
		;For Open, Recent Documents, Recent Places, etc,
		;the list parent of the focusable button causes redundant speech:
		if GetObjectSubtypeCode(true,0) == wt_button
			nLevel = nLevel-1
			return
		endIf
	endIf
elif nLevel == 0
	if iType == wt_button
		if GetObjectSubtypeCode(true,1) == wt_ListBoxItem
			SayBackStageDocumentOrLocationButton()
			nLevel = nLevel-1
			return
		endIf
	endIf
endIf
sayObjectTypeAndText(nLevel)
nLevel= nLevel-1
EndFunction

Void Function FocusChangedEventProcessBackStageView(handle FocusWindow, handle PrevWindow)
var
	int nLevel,
	int nAncestors,
	int nLevelType
nLevel = GetFocusChangeDepth()
nAncestors = GetAncestorCount()
if nLevel >= nAncestors-1
	;Filter out depth changes deeper than the backstage view object:
	nLevelType = GetObjectSubtypeCode(true,nLevel)
	while nLevel
	&& (nLevelType == wt_unknown || (nLevelType == wt_dialog_page && GetObjectName(true,nLevel) != sc_BackStageView))
		nLevel = nLevel-1
		nLevelType = GetObjectSubtypeCode(true,nLevel)
	endWhile
endIf
while nLevel >= 0
	ProcessBackStageViewLoop(nLevel)
	;Do not decrement nLevel here, see the comments in ProcessBackStageViewLoop.
EndWhile
NotifyIfContextHelp()
EndFunction

Void Function FocusChangedEventProcessAncestors (handle FocusWindow, handle PrevWindow)
;Keep edit combos on ribbons from announcing themselves twice:
if (getWindowClass (FocusWindow) == cwc_RichEdit20W
&& RibbonsActive ())
	;sayObjectTypeAndText ()
	;there are cases where SayObjectTypeAndText truncates, so get value from MSAA:
	indicateControlType (getObjectSubtypeCode (TRUE), GetObjectName (TRUE), GetObjectValue (TRUE))
	return
endIf
FocusChangedEventProcessAncestors (FocusWindow, PrevWindow)
endFunction

String Function GetControlColorValue(string sColorName)
;speak color value for some ribbon controls such as split buttons when the value is an RGB string.
; we need to build the 9-digit string in cases where
;only 1 or two digits are present for each portion of the string provided by GetObjectValue.
; also we need to build the string where the RGB information is the only information provided by GetObjectName.
Var
	string sc1,
	string sc2,
	string sc3,
	string sColorNameTrimmed,
	int iLength,
	string sColor
if ! StringContains (sColorName, scRGB) then
	return cscNull
endIf
;Remove the parentheses.
sColorName = stringSegment (sColorName,scRGB,-1)
sColorName = stringChopLeft (sColorName,1)
sColorName = StringChopRight (sColorName, 1)
sColorNameTrimmed = stringReplaceChars (sColorName, cscSpace, cscNull)
; now get each portion of the string.
sc1 = stringSegment (sColorNameTrimmed, scRGBSeparator, 1)
sc2 = stringChopLeft (stringSegment (sColorNameTrimmed, scRGBSeparator, 2), 1)
sc3 = stringChopLeft (stringSegment (sColorNameTrimmed, scRGBSeparator, -1), 1)
;Ensure  each segment is three digits long.
;If the length is <3, we must pad with 0's.
; However, when attempting to concatenate, they are treated as integers.
;So we must apply the following kludge:
iLength = StringLength (sc1)
if (iLength == 2)
	sc1 = ("0"+sc1)
elif (iLength == 1)
	sc1 = ("00"+sc1)
EndIf
iLength = StringLength (sc2)
if (iLength == 2)
	sc2 = ("0"+sc2)
elif (iLength == 1)
	sc2 = ("00"+sc2)
EndIf
iLength = StringLength (sc3)
if (iLength == 2)
	sc3 = ("0"+sc3)
elif (iLength == 1)
	sc3 = ("00"+sc3)
EndIf
sColor = stringReplaceChars (sc1+sc2+sc3, cscSpace, cscNull)
sColorName = GetColorName (RGBStringToColor (sColor))
return sColorName
EndFunction

int Function InApplyStylesDialog (handle hwnd)
var
	int nCategory,
	handle hTemp
if GetMenuMode()>0 then
	return false
endIf
nCategory = getWindowCategory (hwnd)
if (nCategory != WCAT_SDM)
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if StringCompare(GetWindowName(hTemp),wn_ApplyStyles)==0 then
		return true
	EndIf
EndIf
return false
EndFunction

int  Function InStylesDialog (handle hwnd)
var
	int nCategory,
	handle hTemp
nCategory = getWindowCategory (hwnd)
if (nCategory != WCAT_SDM)
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if GetWindowName(hTemp) == wn_Styles then
		return true
	EndIf
EndIf
return false
EndFunction

int function InOptionsDialog(handle hWnd)
var
	int nCategory,
	handle hTemp
if GetMenuMode()>0 then
	return false
endIf
nCategory = getWindowCategory (hwnd)
if (nCategory != WCAT_SINGLE_CLASS)
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_NUIDialog
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if StringContains(GetWindowName(hTemp),wn_Options)
	|| StringContains(getWindowName(GetRealWindow(hTemp)),wn_options) then
		return true
	EndIf
EndIf
return false
EndFunction

int function IsStatusBarToolBar(handle hWnd)
var
	int nCategory,
	handle hTemp
if GetMenuMode()>0 then
	return false
endIf
nCategory = getWindowCategory (hwnd)
if (nCategory != WCAT_SINGLE_CLASS)
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if stringCompare(GetWindowName(hTemp),wn_StatusBar)==0 then
		return true
	EndIf
EndIf
return false
EndFunction

void function SpeakRibbonItem(optional int nLevel)
var
	int iLevelType,
	string sObjName,
	string sObjChildName,
	string sObjValue,
	int iPunctLevel,
	string sHotKey,
	int cId,
	object obj
If oUIA_CustomMenuPrompt
	;Message is spoken in MenuModeEvent
	Return
endIf
if nLevel == -1 then
	sayObjectTypeAndText()
	if ShouldItemSpeak (ot_tutor) == TUTOR_ALL then
		sayTutorialHelp(getobjectsubtypecode(true),false)
	endIf
	If ShouldItemSpeak (ot_access_key) == TUTOR_ALL then
		let iPunctLevel=GetJcfOption(opt_punctuation)
		SetJcfOption(Opt_punctuation,0)
		let sHotKey=GetHotkey()
		if !sHotKey then
			let obj = GetFocusObject (cId)
			let sHotKey=obj.accChild(cId).accKeyboardShortcut
		Endif
		ExpandAltCommaInHotKey(sHotKey)
		if ! stringContains (sHotKey, cmsgHotKeyAltFollowedBy) then
		;This is an accelerator and should speak itself like Narrator, e.g control plus c
			setJCFOption (OPT_PUNCTUATION, 3)
		endIf
		SayUsingVoice(vctx_message,sHotkey,ot_access_key)
		SetJcfOption(Opt_punctuation,iPunctLevel)
	EndIf
	return
EndIf
while (nLevel>=0)
	let iLevelType = GetObjectSubTypeCode(1,nLevel)
	;fix problem that occurs when tabbing onto ribbon tab control, where it was not speaking at all:
	if iLeveltype==wt_tabControl then
		indicateControlType(iLevelType,getObjectName(true),PositionInGroup())
		return
	; split buttons were not speaking their unavailable state if unavailable.
	elIf iLeveltype == WT_SPLITBUTTON then
		sayObjectTypeAndText (nLevel)
		return
	endIf
	let sObjName = GetObjectName(true,nLevel)
	if iLeveltype==wt_groupbox
	;dialog page and tool bar are both acting like group boxes:
	|| iLeveltype == WT_TOOLBAR
	|| (iLeveltype == WT_DIALOG_PAGE
	&& ! StringIsBlank (sObjName)
	; prevent the lower ribbon from speaking as a group box container:
	&& ! StringContains (sObjName, objn_Ribbon)) then
		;prevent double speaking of the name by only speaking the group object name
		;if the group name is not the same as the next level down object name:
		if nLevel > -1 then
			let sObjChildName = GetObjectName(true,nLevel-1)
		EndIf
		if sObjName != sObjChildName then
			indicateControlType(wt_groupbox,GetObjectName(true,nLevel))
		endIf
	elif iLevelType==wt_splitButton then
		let sObjName=GetObjectName()
		IndicateControlType(wt_splitButton,sObjName,cscSpace)
		let sObjValue=GetObjectValue(true)
		;Check for extraneous RGB information.
		if stringContains(sObjValue,scrgb) then
			let sObjValue=GetControlColorValue(sObjValue)
			Say(sObjValue,ot_line,true)
		else
			If sObjValue!=cscNull
			&& sObjValue!=sObjName then
				Say(sObjValue,ot_line,true)
			EndIf
		EndIf
	Elif iLevelType == wt_dialog_page
	|| iLevelType == wt_ToolBar
	|| nLevel == 0  then
		if iLevelType==wt_toolbar
		&& getObjectSubtypeCode()!=wt_tabControl
		&& nLevel<2 then
			indicateControlType(wt_groupbox,GetObjectName(true,nLevel))
			; test for cases where must also announce the control at level 1.
			if nLevel==1 then
				saveCursor ()
				PcCursor ()
				self::sayObjectTypeAndText ()
				restoreCursor ()
				return
			endIf
		EndIf
		; some submenu grid controls are level 0, others cycle between 1 and 0.
		; the following prevents double-speaking of submenu grid controls when they gain focus.
		if iLevelType==wt_toolbar
		&& GetObjectSubtypeCode()==wt_buttonDropDownGrid
		&& nLevel>=0 then
			self::SayObjectTypeAndText(nLevel)
			let nLevel=nLevel-1
		else
			; some controls are level 0, others cycle between 1 and 0.
			; the following prevents double-speaking of controls when they gain focus.
			if nLevel==1
			|| nLevel==0 then
				self::SayObjectTypeAndText(nLevel)
				return
			endIf
			;handle case where treeview level is announced in error:
			if iLevelType==wt_toolbar  then
				default::sayFocusedObject()
				return
			endIf
			if sObjName != objn_Ribbon then ; keep 'ribbon' from speaking multiple times in Office 2013
				sayObjectTypeAndText(nLevel)
			endIf
		EndIf
	EndIf
	let nLevel= nLevel-1
EndWhile
EndFunction

void function SpeakStatusBarToolBarItem (optional int nLevel)
var
	int iLevelType,
	handle hwnd,
	string sObjName,
	int iState,
	string sValue
while (nLevel >= 0)
	let iLevelType = GetObjectSubTypeCode(1,nLevel)
	if iLevelType == wt_ToolBar
	|| nLevel == 0 then
		sayobjectTypeAndText(nLevel)
	EndIf
	let nLevel= nLevel-1
EndWhile
; the following test is necessary for when tutor mode is off in Microsoft Word 2007.
if ShouldItemSpeak(ot_tutor)!=tutor_all then
	let hwnd=GetFocus()
	let sObjName=GetObjectName()
	if StringContains(stringLower(GetAppFileName()),sc_Word2007) then
		if sObjName==wn_PageNumber then
			GetObjectInfoByName (hWnd,sObjName,1,iLevelType,iState,sValue)
			SayMessage(ot_screen_message,sValue)
		elif sObjName==WN_WordCount then
			GetObjectInfoByName (hWnd,sObjName,1,iLevelType,iState,sValue)
			SayMessage(ot_screen_message,sValue)
		endIf
	endIf
	;Office 2007 in general:
	if sObjName==wn_zoom then
		GetObjectInfoByName (hWnd,sObjName,1,iLevelType,iState,sValue)
		SayMessage(ot_screen_message,sValue)
	endIf
EndIf
EndFunction

Void Function DescriptionChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldDescription, string sNewDescription)
Var
	handle hPrevHwnd,
	string sClass
nObjType = GetObjectSubtypeCode (true)
sClass = GetWindowClass (hwnd)
globalPrevFocus = hPrevHwnd
if (sClass == wc_netUIHwnd
&& nObjType == wt_listboxItem
&& stringContains (GetObjectName (true), StringSegment (sNewDescription, cscSpace, 1)))
	return ;too much chatter because the description and the object name contain much of the same information
endIf
if RibbonsActive ()
|| IsStatusBarToolBar (hWnd)
|| InOptionsDialog (hwnd)
|| MenusActive ()
; check for when listbox items from a NetUIHwnd class gain focus.
; the previous window handle stays the same
;while the current one changes as the list is navigated.
|| (sClass == wc_NetUIHwnd
&& (nObjType == wt_menu
;The following prevents drop-down lists from reading descriptions before the name.
;Excel | Insert | any (line, chart, ...)
;Keep description from speaking before the name is read out.
|| (nObjType == WT_ListBoxItem
&& StringContains (getObjectName (TRUE), sNewDescription)))
&& globalPrevFocus == hPrevHwnd) then
	;Too distracting to have descriptions speak.
	return
EndIf
default::DescriptionChangedEvent(hwnd,objId,childId,nObjType,sOldDescription,sNewDescription)
EndFunction

void function DialogPageChangedEvent(HANDLE hwndNewPage,HANDLE hwndOldPage)
if GlobalPrevRealName != GetWindowName(GetRealWindow(GetFocus())) then
	;This change is spoken by ProcessSayRealWindowOnFocusChange
	return
EndIf
DialogPageChangedEvent(hwndNewPage,hwndOldPage)
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
giForegroundCategory = getWindowCategory  ()
if (stringCompare (RealWindowName, GlobalPrevRealName) != 0)
	gstrCustomDlgStaticText = cscNull
	if (giForegroundCategory == WCAT_SDM)
		if (dialogActive ())
			SDMSayWindowTypeAndText (RealWindow, 0)
			if (DialogContainsCustomText (RealWindow))
				BrailleRefresh ()
				say (gstrCustomDlgStaticText, OT_DIALOG_TEXT)
			elif GetDialogStaticText () then
				say (getDialogStaticText(), OT_DIALOG_TEXT)
			endIf
		else
			RealWindowName = getWindowName (findWindow (RealWindow, cwcMsoCmd))
			if realWindowName == TaskPaneDockedWindowName then ;convert msoDockLeft to Task Pane
				realWindowName = GetPaneNameWithFocus ()
				;realWindowName = msgTaskPane
			endIf
			say (RealWindowName, OT_DIALOG_NAME)
			if (DialogContainsCustomText (RealWindow))
				BrailleRefresh ()
				say (gstrCustomDlgStaticText, OT_DIALOG_TEXT)
			endIf
		endIf
		return TRUE
	elif (giForegroundCategory == WCAT_TASK_PANE)
		RealWindowName = getWindowName (findWindow (RealWindow, cwcMsoCmd))
		say (RealWindowName, OT_DIALOG_NAME)
	endIf
endIf
if GetWindowSubtypecode(FocusWindow) == wt_radioButton
&& GetWindowClass(GetParent(FocusWindow)) == cWc_dlg32770
&& GetWindowHierarchyX(FocusWindow) == 1 then
	;Prevent SayWindowTypeAndText from speaking static text not related to the dialog
	IndicateControlType(wt_dialog,RealWindowName)
	return
EndIf
return ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
endFunction

void function ProcessSayFocusWindowOnFocusChange (string RealWindowName, handle FocusWindow)
var
	int iSDMFocus,
	int iSDMSubtypeCode,
	string sSdmControlName
gsPrevSdmGroupName = cscNull
; recall HandleCustomWindows here so SpellCheckers can run through it.
if FocusWindow == getAppMainWindow (FocusWindow) then
; The backstage view has come up, and HandleCustomWindows will get it.
; This is new with the better timing associated with the improved config / file loading in JAWS 17.0.
	if HandleCustomWindows (focusWindow) then return endIf
endIf
if getWindowClass (focusWindow) == cwc_NetUIHwnd then
	if getObjectSubtypeCode (TRUE) then
		sayFocusedObject ()
	else
		say (getObjectName (TRUE), ot_control_name)
	endIf
	return
endIf
if (giForegroundCategory == WCAT_SDM
&& getWindowSubtypeCode (focusWindow) != WT_LISTVIEW)
	delay (2) ; set a threshold to force JAWS to wait for the window to stop / settle.
	iSDMFocus = sdmGetFocus (focusWindow)
	iSDMSubtypeCode = SDMGetControlSubtypeCode (focusWindow, iSDMFocus)
	sSdmControlName = SDMGetControlName (focusWindow, iSDMFocus)
	if iSDMSubtypeCode == wt_tabControl
	&& !sSdmControlName then
		sSdmControlName = GetFocusItemNameFromUIA()
		gstrBrlUIATabName = sSdmControlName
	EndIf
	if (iSDMFocus != giPrevSDMControl
	|| stringCompare (gstrSDMControlName, sSdmControlName) != 0)
		if (! handleCustomWindows (FocusWindow))
			if (iSDMFocus != giPrevSDMControl)
				If iSDMSubtypeCode == WT_TABCONTROL then
					indicateControlType (WT_TABCONTROL, SDMGetControlName  (focusWindow, iSDMFocus))
				elif iSDMSubtypeCode == WT_CHECKBOX then
					indicateControlType (wt_checkbox, SDMGetControlName  (focusWindow, iSDMFocus),cScSpace)
					MSAARefresh (true, 1000)
					indicateControlState(wt_checkbox,GetControlAttributes())
				else
					;sayObjectTypeAndText ()
					sdmSayWindowTypeAndText (focusWindow, iSDMFocus)
				endIf
			else;old sdm functionality
				sayObjectTypeAndText ()
			endIf
		endIf
	endIf
	giPrevSDMControl = iSDMFocus
	gstrSDMControlName = sSdmControlName
	return
endIf
giPrevSDMControl = 0
return ProcessSayFocusWindowOnFocusChange (RealWindowName, FocusWindow)
endFunction

Void Function WindowCreatedEvent (handle hWindow, int nLeft, int nTop, int nRight, int nBottom)
; Because we must detect if text is obscured by the object,
; we have no alternative but to test for window class
; in order to set the variable when text may be obscured.
var
	object obj,
	string sName,
	int varChild
if GetWindowClass (hWindow) == wc_OOCWindow then
	globalObscuredText = true
	let hGlobalOoc = hWindow  ;used later in WindowDestroyedEvent
	let obj = GetObjectFromEvent(hWindow, 0, 0, varChild)
	let sName = obj.accName(varChild)
	if StringContains(sName,on_AutoActions) then
		if GlobalDetectAutoCorrect then
			say (sName, ot_control_name)
			scheduleBrailleFlashMessage(sName, 3)
		EndIf
	ElIf StringContains(sName,on_SmartTagActions) then
		if GlobalDetectSmartTags then
			say (sName, ot_control_name)
			scheduleBrailleFlashMessage(sName, 3)
		EndIf
	EndIf
	obj = Null()
EndIf
WindowCreatedEvent(hWindow,nLeft,nTop,nRight,nBottom)
EndFunction

void Function WindowDestroyedEvent (handle hWindow)
if getWindowCategory (hWindow) == WCAT_SDM then
	;unset global because window is destroyed,
	;or subsequent returns to window will not speak properly.
	giPrevSDMControl = null()
endIf
if hWindow == hGlobalOoc then
	GlobalObscuredText = false
	hGlobalOoc = null()
EndIf
WindowDestroyedEvent(hWindow)
EndFunction

string function GetCustomTextFromStandardDialog (handle hwnd)
var
	handle htmp
if getWindowSubtypeCode (hwnd) != WT_DIALOG
&& getWindowClass (hwnd) != cWc_dlg32770
&& getWindowSubtypeCode (getFirstChild (hwnd)) == WT_BUTTON
&&  stringIsBlank (getDialogStaticText ())
	return cscNull
endIf
htmp = findWindow (hwnd, wc_msoUniStat)
return getWindowText (htmp, READ_EVERYTHING)
endFunction

void function sayWindowTypeAndText (handle hwnd)
var
	string sCustomText = GetCustomTextFromStandardDialog (hwnd)
if (! stringIsBlank (sCustomText))
	return SayControlExWithMarkup (hwnd, getWindowName (hwnd), getWindowType (hwnd), cscNull, cscNull, cscNull, cscNull, cscNull, sCustomText)
elIf stringContains (getWindowClass (hwnd), cwcMsoCmd)
&& getWindowName (hwnd) == TaskPaneDockedWindowName
	return sayMessage (OT_HELP, msgTaskPane)
endIf
return sayWindowTypeAndText (hwnd)
endFunction

;Braille functions for common controls:
Int Function BrailleCallBackObjectIdentify()
Var
	int nCategory,
	int iSDMType,
	int subtypeCode = getObjectSubtypeCode (TRUE),
	handle hwnd
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
hwnd = GetFocus ()
nCategory = GetWindowCategory (hwnd)
If ribbonsActive ()
	if subtypeCode == wt_tabControl
		return wt_UpperRibbon
	Else
		return wt_lowerRibbon
	EndIf
EndIf
if nCategory == WCAT_DOCUMENT then
	return wt_MultiLine_edit
elIf (nCategory == WCAT_SDM || nCategory == WCAT_SPELL_CHECKER)
	iSDMType = sdmGetControlSubtypeCode (hwnd, sdmGetFocus (hwnd))
	; return multiline edit for SDM multiline edit controls that are being indicated as only single line edits
	if iSDMType == WT_EDIT && getObjectSubTypeCode(true,0) == WT_MULTILINE_EDIT then
		return getObjectSubTypeCode(true,0)
	Endif
	if iSDMType && iSDMType != wt_toolbar then return iSdmType endIf
EndIf
;Fix subtype problem on single-line edit, where the multiline style bit has been set
if getWindowSubtypeCode (hwnd) == WT_EDIT
&& getWindowStyleBits (hwnd) & ES_MULTILINE then
	return wt_MultiLine_edit
EndIf
; ensure grids return proper code.
;By default this function returns 0.
if subtypeCode == WT_GRID then return subtypeCode endIf
return BrailleCallbackObjectIdentify ()
EndFunction

int function BrailleAddObjectDlgText(int nSubtypeCode)
var
	string sGroupName = SDMGetGroupBoxName(),
	string sName
if sGroupName then
	BrailleAddString (sGroupName, 0,0,0)
	return True
endIf
var
	string sCustomcDlgText = GetCustomTextFromStandardDialog (getRealWindow (getFocus ()))
if (! stringIsBlank (gstrCustomDlgStaticText))
	BrailleAddString (gstrCustomDlgStaticText, 0,0,0)
	return TRUE
elIf (! stringIsBlank (sCustomcDlgText))
	brailleAddString (sCustomcDlgText, 0,0,0)
	return TRUE
endIf
return BrailleAddObjectDlgText (nSubtypeCode)
endFunction
int function BrailleBuildStatus ()
if !gbLockedKeyboard
&& !IsObjectNavigationActive()
	if GetJCFOption(OPT_USE_STATUSCELLS_FOR_CONTROLTYPE) == 1
	&& GetNonVirtualRibbonState() == LowerRibbon_Active
	&& GetObjectSubtypeCode() == WT_MENU
		;Substitute the type string of lower ribbon,
		;the type for the menu will be added as part of the object name:
		BrailleSetStatusCells(BrailleGetSubtypeString(WT_LOWERRibbon))
		return true
	endIf
endIf
Return BrailleBuildStatus ()
EndFunction

int function BrailleAddObjectType(int nSubtype)
if !IsTouchCursor() then
	;BrailleCallBackObjectIdentify does not fire for menu subtype,
	;which prevents us from using the code in BrailleCallBackObjectIdentify and BrailleAddObjectValue for other types.
	if nSubtype == WT_MENU
	&& GetNonVirtualRibbonState() == LowerRibbon_Active
		;Substitute the type string of lower ribbon,
		;the type for this subtype will be added as part of the object name:
		BrailleAddString(BrailleGetSubtypeString(WT_LOWERRibbon),0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectType(nSubtype)
EndFunction

Int Function BrailleAddObjectName (int nType)
Var
	int attributes,
	Handle hFocus,
	object o
if IsTouchCursor() then
	return BrailleAddObjectName (nType)
endIf
; grids in ribbons where state code as Default means the item is selected.
; These are never marking themselves up properly in Braille.
if nType == WT_GRID then
	if GetObjectStateCode (TRUE) & STATE_SYSTEM_DEFAULT then
		Attributes = ATTRIB_HIGHLIGHT
	endIf
	BrailleAddString (GetObjectName (TRUE), 0,0,Attributes)
	return TRUE
endIf
hFocus = GetFocus ()
if nType == wt_menu
	;BrailleCallBackObjectIdentify does not fire for menu subtype,
	;which prevents us from using the code in BrailleCallBackObjectIdentify and BrailleAddObjectValue for other types.
	;In BrailleAddObjectType, the type of lower ribbon was substituted
	;as the type to be shown when on a menu item in the lower ribbon,
	;and the type for the menu is prepended here as part of the name.
	if GetNonVirtualRibbonState() == LowerRibbon_Active
		BrailleAddString(BrailleGetSubtypeString(WT_MENU),0,0,0)
		;do not return here
	endIf
	if getObjectSubtypeCode () == wt_splitButton
		BrailleAddString (GetObjectName(), 0,0,0)
		BrailleAddString (BrailleGetSubtypeString (wt_splitButton), 0,0,0)
		return true
	elif OnNetUIMenuButton()
		BrailleAddString (GetUIAFocusObjectName(),GetCursorCol(),GetCursorRow(),0)
		return true
	EndIf
endIf
if (isStatusBarToolbar (GetFocus ())
&& GetObjectSubtypeCode () == wt_Button)
	BrailleAddString (GetObjectName(), 0,0,0)
	return true
endIf
if nType == WT_LISTBOXITEM
	if (getWindowClass (getFocus ()) == cwc_NetUIHwnd)
		BrailleAddString (getObjectName (TRUE, 1), 0,0,0)
		return TRUE
	endIf
endIf
if (nType == WT_TREEVIEW || nType == WT_TREEVIEWITEM)
&& dialogActive () then
	if GetWindowName (getFocus ()) == scTreeViewName then
		return TRUE ; no string
	endIf
endIf
if nType == wt_lowerRibbon
	;Both name and value are handled together in BrailleAddObjectValue
	return true
endIf
If getWindowClass (hFocus) == cwc_Richedit60W
	if StringIsBlank (GetObjectName (TRUE))
		o = CreateUIAFocusElement(true)
		If GetObjectSubtypeCode (TRUE) == WT_EDIT
		|| GetWindowSubtypeCode (hFocus) == WT_EDIT
		|| o.className == oc_NetUIPropertyTextbox
			If o
				BrailleAddString(o.Name, GetCursorCol (), GetCursorRow (), 0)
				Return TRUE
			endIf
		EndIf
	EndIf
EndIf
return BrailleAddObjectName (nType)
EndFunction

Int Function BrailleAddObjectDescription(int nType)
if c_BackstageFocusItemData.GroupStaticText
	BrailleAddString(c_BackstageFocusItemData.GroupStaticText, 0, 0, 0)
	Return TRUE
endIf
Return BrailleAddObjectDescription (nType)
EndFunction

int function BrailleAddValueStringForLowerRibbonItem(int nType)
if nType != wt_lowerRibbon return false endIf
var
	string sName,
	string sValue,
	int iType,
	int galleryButtonIsSelectable,
	int stateBits
if getFocusStylesGalleryItemInfo (sName, galleryButtonIsSelectable) then
	; underline the name if the item is selected.
	if galleryButtonIsSelectable then stateBits = ATTRIB_HIGHLIGHT endIf
	brailleAddString (sName, 0, 0, stateBits)
	brailleAddString(brailleGetSubtypeString(WT_BUTTON), 0,0,0)
endIf
iType = getObjectSubtypeCode (true)
sName = GetObjectName (true)
if iType == wt_edit
|| iType == wt_editCombo
|| iType == wt_edit_Spinbox
	brailleAddString (sName, 0,0,0)
	brailleAddString(brailleGetSubtypeString(iType), 0,0,0)
	BrailleAddFocusLine()
	return true
endIf
sValue = GetObjectValue (true)
if sName && sValue
&& sName != sValue
	brailleAddString (sName, 0,0,0)
	brailleAddString(brailleGetSubtypeString(iType), 0,0,0)
	if stringContains (sValue, scrgb)
		sValue = getControlColorValue (sValue)
	endIf
	brailleAddString (sValue, 0,0,0)
	return true
endIf
If !sValue
	if GetObjectSubtypeCode (TRUE) == WT_LISTBOXITEM 
	&& GetObjectStateCode (TRUE) & STATE_SYSTEM_DEFAULT then
	; lower items on ribbons that behave something like grids, we want to handle the Default case by highlighting it, 
	; since it never gains proper focus when first entering the group, you have to select it.
		BrailleAddString (sName, 0,0,ATTRIB_HIGHLIGHT)
		return TRUE
	endIf
	brailleAddString (sName, 0,0,0)
else
	brailleAddString (sValue, 0,0,0)
endIf
brailleAddString(brailleGetSubtypeString(iType), 0,0,0)
return true
EndFunction

int function brailleAddObjectValue (int nType)
Var
	handle hwnd,
	string sName
if IsTouchCursor() then
	return brailleAddObjectValue (nType)
endIf
if BrailleAddValueStringForLowerRibbonItem(nType)
	return true
endIf
; combo boxes outside of dialogs are in some cases getting the incorrect information:
if ! dialogActive () 
&& nType == WT_COMBOBOX then
	BrailleAddString (GetObjectValue (TRUE), 0,0,ATTRIB_HIGHLIGHT)
	return TRUE
endIf
hwnd = GetFocus ()
if (nType == WT_TREEVIEW || nType == WT_TREEVIEWITEM)
&& dialogActive() then
	if GetWindowName (hWnd) == scTreeViewName then
		BrailleAddString (getObjectName (TRUE), GetCursorCol (), GetCursorRow (), ATTRIB_HIGHLIGHT) ; Prevent truncated results.
		return TRUE
	endIf
endIf
if (nType == WT_TABCONTROL && getWindowCategory () == WCAT_SDM)
	sName = sdmGetControlName (hwnd, sdmGetFocus (hwnd))
	if StringIsBlank (sName) then
		sName = gstrBrlUIATabName
	endIf
	if stringIsBlank (sName) then
		sName = GetFocusItemNameFromUIA(TRUE)
	endIf
	BrailleAddString (sName, 0,0,0)
	;BrailleAddFocusLine () ; Fails to get relevant data from SDM dialogs. This item won't be clickable.
	return TRUE
endIf
if (nType == WT_MULTILINE_EDIT
&& getWindowSubtypeCode (hwnd) == WT_EDIT)
	brailleAddFocusLine ()
	return TRUE
endIf
if (getWindowClass (GetParent (GetParent (hwnd))) == wc_netUIHwnd)
	brailleAddString (getObjectValue (TRUE), 0,0,0)
	return TRUE
endIf
; trying to filter out language category...
If nType == WT_LISTBOXITEM
	If DialogActive ()
	&& GetWindowClass (hWnd) == cWC_NetUIHWND
		sName = GetObjectName (TRUE)
		var String sScreenText = GetWindowTextEx (hWnd, TRUE, FALSE)
		If (! StringIsBlank (sScreenText))
		&& (! StringContains (sScreenText, sName))
			BrailleAddString (sScreenText, GetCursorCol (), GetCursorRow (), 0)
			Return (TRUE)
		EndIf
	EndIf
	if FocusWindowSupportsUIA () then
		var int Attributes
		if GetObjectStateCode () & (STATE_SYSTEM_DEFAULT | STATE_SYSTEM_SELECTED) then 
			Attributes = ATTRIB_HIGHLIGHT 
		else
			Attributes = GetCharacterAttributes ()
		endIf
		BrailleAddString (GetObjectName (), GetCursorCol (), GetCursorRow (), Attributes)
		BrailleAddString (GetObjectHelp (), 0,0,0)
		return TRUE
	endIf
EndIf
return brailleAddObjectValue (nType)
endFunction

int function brailleAddObjectContainerName(int nType)
var
	string sGroupName
if c_BackstageFocusItemData.GroupName
	BrailleAddString(c_BackstageFocusItemData.GroupName,0,0,0)
	return true
endIf
if (getMenuMode() == menu_active
&& getObjectSubtypeCode() == wt_splitButton)
	return true
endIf
if (getWindowCategory() == WCAT_SDM)
	sGroupName = sdmGetGroupBoxName ()
	if !stringIsBlank(sGroupName)
		BrailleAddString (sGroupName, 0,0,0)
		return TRUE
	endIf
endIf
return brailleAddObjectContainerName (nType)
endFunction

int function ShouldAddVirtualRibbonsOption()
return officeVersion >= 12
EndFunction

Int Function isBackStageView(handle hwnd)
var
	string class,
	handle hTemp,
	int nLevel
class = GetWindowClass (hWnd)
if class != wc_NetUIHwnd
&& class != cwc_Richedit60W
	return false
EndIf
hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_ParentClass_FULLPAGEUIHost
	hTemp = GetParent(hTemp)
EndWhile
if !hTemp
	return false
EndIf
nLevel = GetAncestorCount()
while nLevel
	if StringContains(GetObjectName(true,nLevel),sc_BackStageView)
		return true
	EndIf
	nLevel=nLevel-1
endWhile
return false
EndFunction

string function ToggleAutoCorrectDetection(int iRetCurVal)
If ! iRetCurVal then
	;update the value
	let globalDetectAutoCorrect = !globalDetectAutoCorrect
EndIf
if globalDetectAutoCorrect then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string function ToggleSmartTagsDetection(int iRetCurVal)
if ! iRetCurVal then
	;update the value
	let globalDetectSmartTags = !globalDetectSmartTags
EndIf
if globalDetectSmartTags then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

void function DetectSmartTag(object oObj)
var
	int iCount
; detect words marked with smart tag
iCount = oObj.SmartTags.count
if iCount > 0 then
	SayFormattedMessageWithVoice (vctx_message, ot_help,msgSmartTag1_L,msgSmartTag1_S)
EndIf
EndFunction

int function SmartTagsCount(object oAppObj)
return oAppObj.SmartTags.count
EndFunction

int function FilterSmartTag(string sName)
var
	int i
let i = 1
While i<=iSmartTagFilterCount
&& !StrCmp(sName,StringSegment(scSmartTagFilterList,scFilterItemSeparator,i))
	let i = I+1
EndWhile
if i<=iSmartTagFilterCount then
	return true
else
	return false
EndIf
EndFunction

void Function ShowSmartTagListDialog(object oApp)
var
	object doc, ; The current document
	int iTag, ; The actual index of the smart tags in the document
	int count, ; The actual count of smart tags in the document
	object oSmartTag, ; the current smart tag to be included in the list
	int iShow, ; The number of smart tags to show in the dialog list
	string sName, ; Smart tag type
	string sText, ; Smart tag text
	string sEntry, ; item in the smart tag dialog list
	string sSmartTagList ;delimmited list of smart tags
let Doc=oApp.activeDocument
let count=Doc.SmartTags.Count
if !count then
	SayFormattedMessageWithVoice(vctx_message,ot_JAWS_message,msgNoSmartTags_L,msgNoSmartTags_S)
	return
EndIf
let iShow=0
let iTag=1
let oSmartTag=doc.smartTags(itag)
while iTag<=count
	let sName=oSmartTag.Name
	let sName=StringSegment(sName,sSmartTagNameDelimmiter,2)
	; If we filter out type of tag, we lose the number of the current smart tag.
	;if !FilterSmartTag(sName) then
		; Put the tag in the dialog list:
		let iShow=iShow+1
		let sText=oSmartTag.Range.Text
		let sEntry=IntToString(iTag)+cScSpace+sName+cScColon+cScSpace+sText
		let sSmartTagList=sSmartTagList+LIST_ITEM_SEPARATOR+sEntry
	;EndIf
	let iTag=iTag+1
	let oSmartTag=doc.smartTags(itag)
endWhile
if !iShow then
	SayMessage(ot_error,msgNoClickableSmartTags_L,msgNoClickableSmartTags_S)
	return
EndIf
InSmartTagListDlg = TRUE
let iTag=DlgSelectItemInList(sSmartTagList,sSmartTagListTitle,false)
InSmartTagListDlg = FALSE
if iTag then
	doc.smarttags(iTag).select
	oApp.selection.collapse()
	if GlobalSmartTagActionsTutorHelp then
		; Only announce this message the first time
		let GlobalSmartTagActionsTutorHelp = false
		SayFormattedMessage(ot_smart_help, msgSmartTagActionsTutorHelp1_L, msgSmartTagActionsTutorHelp1_S)
	EndIf
EndIf
EndFunction

void function ShowOfficeScreenSensitiveHelp(string sHelpMsg)
var
	string sText,
	string sName,
	string sType,
	int iSubtype,
	string sState,
	string sDescr,
	string sValue,
	string sAccess,
	int iState,
	string sTab, string sGroup
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if GetRibbonStatus(iState,sTab,sGroup,sDescr) then
	if iState==RibbonCollapsed then
		let sHelpMSG=msgRibbonToggleStateScreenSensitiveHelp+cscBufferNewLine
	endIf
endIf
let sName = GetObjectName(true)
let sType=GetObjectType()
let iSubtype=GetObjectSubtypeCode(true)
if iSubtype==wt_buttonDropdown then
	let sText = sName+cscSpace+msgSubmenu
ElIf iSubtype==wt_buttonDropdownGrid then
	let sText = sName+cscSpace+msgSubmenuGrid
elIf iSubtype==wt_editCombo then
	let sText = sName+cscSpace+msgRibbonEditCombo
elIf  iSubtype==wt_splitButton then
	let sText = sName+cscSpace+msgSplitButton
ElIf sType
&& sType != cmsgUnknown then
	let sText = sName+cscSpace+sType
else
	let sText = sName
EndIf
let sState = GetObjectState()
if sState then
	;we don't need to show the selected state:
	if StringCompare(StringTrimLeadingBlanks(sState),sc_SelectedState) != 0 then
		let sState = FormatString(msgStateScreenSensitiveHelp,sState)
		let sText = sText+cscSpace+sState
	EndIf
EndIf
let sValue = GetObjectValue(true)
let sDescr = GetObjectDescription(true)
if sValue
&& stringCompare(sValue,sDescr)!=0 then
	let sText = sText+cscBufferNewLine+sValue+cscBufferNewLine
else
	let sText = sText+cscBufferNewLine
EndIf
let sAccess = GetHotKey()
if sAccess then
	let sAccess = FormatString(msgAccessKeyScreenSensitiveHelp,sAccess)
	let sText = sText+cscBufferNewLine+sAccess+cscBufferNewLine
EndIf
if sDescr then
	let sText = sText+cscBufferNewLine+sDescr+cscBufferNewLine
EndIf
let sHelpMsg = sText+cscBufferNewLine+sHelpMsg
sayFormattedMessage(ot_user_buffer,sHelpMsg)
AddHotKeyLinks()
BrailleRefresh()
EndFunction

int function ScreenSensitiveHelpForOffice()
var
	int nSubtype = GetObjectSubtypeCode(true)
if InSmartTagListDlg then
	SayMessage(ot_user_buffer,msgSmartTagListHelp_L,msgSmartTagListHelp_S)
	return true
elif InTaskPaneDialog() then
	TaskPaneHelp()
	return true
elif GlobalTemporaryContextMenuState then
	TemporaryContextMenuHelp()
	return true
elif OnRecentDocumentsPushPin() then
	ShowOfficeScreenSensitiveHelp(msgRecentDocumentsPushPinScreenSensitiveHelp)
	return true
;elif IsStatusBarToolBar(GetFocus()) then
	;If nSubtype ==wt_button then
		;ShowScreenSensitiveHelp(msgStatusBarToolbarButtonHelp)
		;return true
	;endIf
elif IsStatusBarToolBar(GetFocus())
|| IsQuickAccessToolbarActive() then
	ShowOfficeScreenSensitiveHelp(msgStatusBarToolBarOrQuickAccessToolBarScreenSensitiveHelp)
	return true
elif inRibbons() then
	if IsVirtualRibbonActive() then
		If GlobalMenuMode == MENUBAR_ACTIVE then
		 	ShowScreenSensitiveHelpForVirtualRibbon(true)
		ElIf GlobalMenuMode == MENU_ACTIVE then
			ShowScreenSensitiveHelpForVirtualRibbon(false)
		EndIf
		Return true
	elif nSubType == wt_TabControl then
		ShowOfficeScreenSensitiveHelp(msgOfficeRibbonBarScreenSensitiveHelp)
		Return true
	elif nSubtype == wt_buttonDropdown then
		ShowOfficeScreenSensitiveHelp(msgSubmenuScreenSensitiveHelp)
		return true
	ElIf nSubtype == wt_buttonDropdownGrid then
		ShowOfficeScreenSensitiveHelp(msgSubmenuGridScreenSensitiveHelp)
		return true
	elIf nSubtype == wt_splitButton then
		ShowOfficeScreenSensitiveHelp(msgRibbonSplitButtonScreenSensitiveHelp)
		return true
	elif nSubType == WT_BUTTON then
		ShowOfficeScreenSensitiveHelp(cmsgScreenSensitiveHelp14_L)
		return true
	elif nSubtype == wt_editCombo  then
		ShowOfficeScreenSensitiveHelp(msgEditComboScreenSensitiveHelp)
		return true
	EndIf
else
	return false
EndIf
EndFunction

int function InNonDroppedContextMenu()
var
	int iObjtype,
	int iRbnState,
	string sRbnTab,
	string sRbnGroup,
	string sRbnDesc
iObjType=GetObjectSubtypeCode()
if GetMenuMode()!=0
&& !iObjType ;it is a context menu in Office 2010.
	GetRibbonStatus(iRbnState,sRbnTab,sRbnGroup,sRbnDesc)
	if iRbnState == 1
		;The upper ribbon is active,
		;possibly waiting for the rest of a ribbon shortcut key sequence:
		return false
	EndIf
	if !GetObjectName()
	&& !GetObjectValue()
		return true
	EndIf
	return false
endIf
if iObjType!= wt_menu
	return false
EndIf
If GetObjectSubtypeCode (1,1) == wt_dialog_page
	return true
EndIf
return false
EndFunction

; *** below are the stubs to avoid Unknown function calls
; ***if the appropriate functions are missing in exact office files...

Int Function HandleCustomDialogueWindows (Handle hWnd)
Var
	Int iWindowType = GetWindowSubtypeCode (hWnd, TRUE),
	Int iControlID = GetControlID (hWnd),
	Int iObjectType = GetObjectSubTypeCode (TRUE),
	String sApplication = GetOwningAppName (hWnd)

; Handling standard dialogues for office in general...
; for instance 'save as...' dialogues...
If sApplication == ComDLGName
|| sApplication == ComCtlName
	If iWindowType == WT_EDITCOMBO
	&& iObjectType == WT_EDITCOMBO
	&& (iControlID == CID_SaveAsEditCombo
	|| iControlID == CID_OpenEditCombo)
		SayControlEx (hWnd, GetObjectName (TRUE))
		Return (TRUE)
	EndIf
EndIf
Return (FALSE)
EndFunction

void function insertSDMGroupHeaderElement(collection headers, collection element)
; Insert element into headers preserving vertically-descending sort order.
; Note: Horizontal positioning of elements is ignored here.
; Helper for buildSDMGroupHeaderCollection().
headers.count = headers.count +1
var collection curElement, collection lastElement
; lastElement starts as null.
if !headers.first then
	headers.count = 1
	headers.first = element
	return
endIf
curElement = headers.first
while curElement
	if curElement.top > element.top then
		; The new one belongs just before curElement.
		if lastElement then
			; lastElement.next was curElement.
			lastElement.next = element
		else
			; This becomes the first element.
			headers.first = element
		endIf
		element.next = curElement
		return
	endIf
	lastElement = curElement
	curElement = curElement.next
endWhile
; Ran off end of sequence, so attach element to end.
lastElement.next = element
endFunction

collection function buildSDMGroupHeaderCollection()
; Build and return a sorted collection of group headers from the active dialog.
; Returns null on failure.
; Called by GetSDMGroupHeaderCollection().
;
; Structure of headers:
;	hwnd, o: Window and MSAA object in focus.
;	count: Count of header elements.
;	first: First (topmost) header.
; Headers starting at first proceed in vertically-descending order,
; ignoring horizontal position. This is a linked list.
; Structure of an element:
;	childID: Child ID of element with respect to o (see above).
;	left, right, top, bottom: Bounding rectangle of element.
;	text: Text of element (accName).
;	next: Next header or null for last.
var collection headers let headers = new collection
var object o, int childID
o = getFocusObject(childID)
if !o then
	return
endIf

; Top-level properties.
headers.hwnd = getFocus()
headers.o = o
headers.count = 0

; Build the linked list of header elements.
var collection element
childID = 1
var int n = o.accChildCount
var int left, int right, int top, int bottom
while childID <= n
	if o.accRole(childID) == Role_System_StaticText
	&& !(o.accState(childID) & State_System_Invisible)
	then
		o.accLocation(intRef(left), intRef(top), intRef(right), intRef(bottom), childID)
		if !left && !right && !top && !bottom then
			; Abort on MSAA failure.
			return
		endIf
		; Adjust MSAA location info into JAWS rectangle info.
		left = left +1
		top = top +1
		right = left +right
		bottom = top +bottom
		; Build element and patch into list.
		element = new collection
		element.childID = childID
		element.left = left
		element.right = right
		element.top = top
		element.bottom = bottom
		element.text = o.accName(childID)
		insertSDMGroupHeaderElement(headers, element)
	endIf
	childID = childID +1
endWhile
; debug code.
element = headers.first
while element
	element = element.next
endWhile
return headers
endFunction

collection function nextSDMGroupHeaderElementForObject(collection element, int left, int right)
; Return the next header element within range of the indicated object.
; Pass the left and right boundaries of the object.
; Element is part of a linked list of elements in vertically descending order.
; Returns null if there is no match.
; Helper for getSDMGroupHeaderText().
while element && (rangeOverlapPercent(left, right, element.left, element.right) <= 50)
	element = element.next
endWhile
return element
endFunction

globals
; Used by getSDMGroupHeaderCollection() below.
; Also cleared by ClearSDMGroupHeaderCache(), which could be called from FocusChangedEventEx().
	collection gcSDMGroupHeaderInfo,
	int giSDMGroupHeaderTick

collection function getSDMGroupHeaderCollection()
; Return a sorted collection of group headers from the active dialog.
; Returns null on failure.
; See BuildSDMGroupHeaderCollection() for structure details.
; This is a wrapper for that function that caches its results for speed.

; Cache for performance in case the Braille subsystem hammers this code.
var handle hwnd = getFocus()
if gcSDMGroupHeaderInfo.hwnd == hwnd
&& giSDMGroupHeaderTick && getTickCount() -giSDMGroupHeaderTick <= 500 then
	return gcSDMGroupHeaderInfo
endIf

gcSDMGroupHeaderInfo = buildSDMGroupHeaderCollection()
giSDMGroupHeaderTick = getTickCount()
return gcSDMGroupHeaderInfo
endFunction

string function getSDMGroupHeaderText()
; Get the group header text applying to the active cursor position.
; This text may come from multiple group headers.
; Example: "Row 4:" on the line above "Size" in Table Properties, Row tab.
; The lowest header on screen above the cursor is used.
; Headers just above it are prepended if within 10 vertical pixels of each other
; and their left edges are within 30 pixels of each other.
; Text items containing "_" are ignored as they are control labels.
; As a heuristic, buttons closer to the OK/Cancel bottom dialog line
; than to the previous line are not assigned group headers.
; Controls with no group header may return cscSpace here.
; This is the interface function for getting SDM group headers via this method.

; Determine the position of the object being labeled.
var int left, int right, int top, int bottom
if !getObjectRect(left, right, top, bottom) then
	; Allow any JAWS default behavior; we don't know what should happen here.
	return cscNull
endIf
var int y = getCursorRow()

; Exception for buttons near bottom of dialog.
if getObjectSubtypeCode() == WT_Button then
	; RefreshWindow can avoid leaks from other windows like consoles.
	refreshWindow(getFocus())
	var string name = getObjectName()
	saveCursor() invisibleCursor() saveCursor()
	routeInvisibleToPC()
	var int oldRestriction = getRestriction()
	setRestriction(RestrictWindow)
	saveCursor()
	priorLine()
	var int y1 = getCursorRow()
	restoreCursor()
	nextLine()
	JAWSHome()
	setRestriction(oldRestriction)
	if getObjectSubtypeCode() == WT_Button
	&& SDMGetCurrentControl() == IDOk
	&& (
		getCursorRow() -y < y -y1
		|| stringContains(name, sc_previous)
		|| stringContains(name, sc_next)
	) then
		; These should not have a group header, so explicitly say so.
		return cscSpace
	endIf
	restoreCursor() restoreCursor()
endIf

; First list headers that are above the cursor and not too far left/right of it.
var collection headers
var variantArray matches let matches = new variantArray[50]
var int n = 0
var string buf = ""
headers = getSDMGroupHeaderCollection()
var collection element
element = nextSDMGroupHeaderElementForObject(headers.first, left, right)
while element && element.top < y
	n = n +1
	matches[n] = element
	element = nextSDMGroupHeaderElementForObject(element.next, left, right)
endWhile

; Now go back through the possible headers collecting text.
var object o
o = headers.o
left = -999
while n
	element = matches[n]
	if buf then
		; Already found at least one applicable element going up.
		if element.bottom >= y -10
		&& abs(element.left -left) <= 30
		&& !stringContains(element.text, "_")
		then
			; This one also applies.
			buf = formatString("%1 %2", element.text, buf)
			y = element.top
		else
			; We're done scanning backward because this element is too
			; far above the previously examined one.
			return buf
		endIf
	else
		; First element going up.
		buf = element.text
		y = element.top
	endIf
	left = element.left
	n = n -1
endWhile
return buf
endFunction

void function clearSDMGroupHeaderCache()
gcSDMGroupHeaderInfo = null()
endFunction

string function sdmGetGroupBoxName ()
var
	handle hwnd = getFocus (),
	int id = sdmGetFocus (hwnd),
	int iType = SDMGetControlSubtypeCode (hwnd, ID),
	string sGroupName
if !(isMultiPageDialog ())
	;The problem areas are only in the multipage dialogs such as format / font etc.
	return cscNull
endIf
if (iType == WT_EDIT || iType == WT_EDITCOMBO || iType == WT_COMBOBOX || iType == WT_EDIT_SPINBOX)
	return cscNull
endIf
if (ID == IDOk || ID == IDCancel)
	return
endIf
sGroupName = getSDMGroupHeaderText()
if stringContains (sGroupName, "_") then
	;sGroupName = stringReplaceSubstrings (sGroupName, "_", "")
	sGroupName = cscNull
endIf
return sGroupName
endFunction

Int Function HandleCustomSDMDialogueWindows (Handle hWnd)
var
	string sGroupName = sdmGetGroupBoxName ()
if (menusActive () || userBufferIsActive ())
	return FALSE
endIf
if (getWindowSubtypeCode (hwnd) == WT_TABCONTROL)
	sdmSayWindowTypeAndText (hwnd, sdmGetFocus (hwnd))
	return TRUE
endIf
if (getWindowSubtypeCode (hwnd) == WT_COMBOBOX && isMultipageDialog ())
	;resolves bug reported by test where the application's default behavior was unacceptable.
	;We deliberately drop combo boxes in SDM dialogs so the user need not use an arrow key twice.
	; MAGic is another matter: this is awkward for a MAGic user who has to see the box pop open,
	; or worse, pop shut after they click the down arrow next to the box to pop it open and see its contents:
	if ! (getRunningFSProducts () & product_MAGic) then
		typeKey (cksAltDownArrow)
	endIf
endIf
if ! stringIsBlank (sGroupName)
&& sGroupName != gsPrevSdmGroupName then
	say (sGroupName, OT_CONTROL_GROUP_NAME)
endIf
gsPrevSdmGroupName = sGroupName 
Return (FALSE)
EndFunction

Int Function HandleCustomSpellCheckerWindows (Handle hWnd)
Return (FALSE)
EndFunction

; *** end of stubs...

Int Function HandleCustomWindows (Handle hWnd)
Var
	Int iCategory = getWindowCategory (hWnd)
; underlying code to distribute HandleCustomWindows call to smaller parts depending on some circumstances in the higher level...
If Not InHJDialog ()
	If iCategory == WCAT_SDM
		Return (HandleCustomSDMDialogueWindows (hWnd))
	ElIf iCategory  == WCAT_SPELL_CHECKER
		Return (HandleCustomSpellCheckerWindows (hWnd))
	elif isBackStageView(hWnd) then
		return HandleCustomBackstageViewWindow()
	ElIf DialogActive ()
		Return (HandleCustomDialogueWindows (hWnd))
	EndIf
	; code for handling windows inserted here...
EndIf
Return (HandleCustomWindows (hWnd))
EndFunction

int function SayByTypeForScriptSayLine()
var int subtype = GetObjectSubtypeCode (TRUE)
if Subtype == WT_GRID
|| (Subtype == WT_LISTBOXITEM && GetWindowClass (GetFocus ()) == cwc_NetUIHwnd) then
	if GetObjectStateCode (TRUE) == STATE_SYSTEM_DEFAULT then
		if IsSameScript () then
			SpellString (GetObjectName (TRUE)) 
			return
		endIf
		say (getObjectName (TRUE), OT_LINE)
		say (GetObjectState (TRUE), OT_ITEM_STATE)
		return TRUE
	endIf
endIf
return SayByTypeForScriptSayLine ()
endFunction

void Function SayLineUnit (int unitMovement, optional  int bMoved)
If SayCursorMovementException(unitMovement,bMoved)
	SayLineUnit(unitMovement,bMoved)
	return
endIf
if GetObjectSubtypeCode(true) == wt_editCombo
&& GetWindowClass(GetFocus()) == wc_ReComboBox20W
	;ValueChangedEvent handles this type of edit combo
	return
endIf
var
	int bSpellPossible
if (getWindowCategory () == WCAT_SDM)
	if (getWindowSubtypeCode (getFocus ()) == WT_TABCONTROL)
		if !unitMovement then
			bSpellPossible = TRUE
		endIf
		sdmSayWindowTypeAndText (getFocus (), sdmGetFocus (getFocus ()))
		return TRUE
	elIf sdmGetControlSubtypeCode (getFocus (), sdmGetFocus (getFocus ())) == WT_EDIT_SPINBOX
	|| getObjectSubtypeCode (TRUE) == WT_EDIT_SPINBOX then
		SayMessage (OT_LINE, getLine ())
		return TRUE
	endIf
endIf
return SayLineUnit (unitMovement, bMoved)
endFunction

void function SayPageUpDownUnit(int UnitMovement)
if (getWindowCategory () == WCAT_SDM && getObjectSubtypeCode (TRUE) == WT_EDIT)
	MSAARefresh ()
	sayCurrentScriptKeyLabel ()
	say (getObjectValue (), OT_LINE)
	return
endIf
SayPageUpDownUnit(UnitMovement)
endFunction

void function TaskPaneHelp()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
if InTaskPaneDialog() then
	SayFormattedMessage(OT_USER_BUFFER,msgTaskPaneHelp1_L,msgTaskPaneHelp1_s)
	UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
EndIf
EndFunction

void Function ScreenSensitiveHelpForKnownClasses (int nSubTypeCode)
var
	handle hWnd,
	string sReal
hWnd = GetFocus()
sReal=GetWindowName(GetRealWindow(hwnd))
if StringContains(sReal,wn_smartArtGraphic) then
	ShowScreenSensitiveHelp(msgScreenSensitiveHelpSmartArt)
	return
EndIf
if nSubtypeCode==wt_ListboxItem
&& inOptionsDialog(hwnd) then
	ShowScreenSensitiveHelp(msgScreenSensitiveHelpOptionsDlgListbox)
	return
EndIf
if GetWindowName(hwnd)==wn_applyStyles then
	ShowScreenSensitiveHelp(msgApplyStylesScreenSensitiveHelp)
	return
EndIf
If nSubtypeCode==wt_edit
&& GetObjectSubtypeCode()==wt_editCombo  then
	ShowScreenSensitiveHelp(msgEditComboScreenSensitiveHelp)
	return
EndIf
if GetMenuMode()>0
&& GetObjectSubtypeCode(true)==wt_splitButton then
	ShowScreenSensitiveHelp(msgMenuSplitButtonScreenSensitiveHelp)
	return
EndIf
If isClipboardDialog(hwnd) then
	ShowScreenSensitiveHelp(msgClipboardDialogScreenSensitiveHelp)
	return
EndIf
if isResearchToolbar(hwnd) then
	ShowScreenSensitiveHelp(msgResearchToolbarScreenSensitiveHelp)
	return
EndIf
if nSubtypeCode==wt_ListBoxItem
&& GetWindowClass(hwnd)==wc_netUiHwnd then
	ShowScreenSensitiveHelp (msgScreenSensitiveHelpNetUiLists)
	return
EndIf
if nSubtypeCode==wt_buttonMenu then
	ShowScreenSensitiveHelp(cmsgButtonMenuScreenSensitiveHelp)
	return
EndIf
If nSubtypeCode==wt_columnHeader then
	ShowScreenSensitiveHelp(msgColumnHeaderScreenSensitiveHelp)
	return
EndIf
If nSubtypeCode==wt_rowHeader then
	ShowScreenSensitiveHelp(msgRowHeaderScreenSensitiveHelp)
	return
EndIf
ScreenSensitiveHelpForKnownClasses(nSubTypeCode)
EndFunction

Int Function IsDocumentPropertiesPane(handle hwnd)
if IsVirtualRibbonActive() then
	return false
elIf ISVirtualPCCursor()
&& (StringContains(GetWindowOwner(hwnd),sc_mshtml)
|| GetWindowClass(hwnd)==cwcIEServer
|| GetWindowClass(hwnd)==wc_netUIHwnd) then
	setJcfOption(opt_virtual_pc_cursor,0)
	return true
elif GetWindowClass(hwnd)==cwcIEServer then
	return true
Else
	return false
EndIf
EndFunction

script SayCurrentAccessKey()
var
	int iObjType,
	int iPunctuationLevel,
	string sHotkey,
	handle hwnd,
	string sPrompt
let hwnd=GetCurrentWindow()
iObjType = getObjectSubtypeCode (TRUE)
if InRibbons()
|| inOptionsDialog(hwnd)then
	let iPunctuationLevel=GetJcfOption(OPT_PUNCTUATION) ; Saves current punctuation level...
	SetJcfOption(OPT_PUNCTUATION,0)
	let sHotkey=GetHotkey()
	ExpandAltCommaInHotKey(sHotKey)
	if ! stringContains (sHotKey, cmsgHotKeyAltFollowedBy) then
	;This is an accelerator and should speak itself like Narrator, e.g control plus c
		setJCFOption (OPT_PUNCTUATION, 3)
	endIf
	SayUsingVoice(VCTX_MESSAGE,sHotKey,OT_HELP)
	SetJcfOption(OPT_PUNCTUATION,iPunctuationLevel)
	return
elIf (iObjType == WT_CHECKBOX || iObjType == WT_RADIOBUTTON || iObjType == WT_COMBOBOX || iObjType == WT_BUTTON|| iObjType == WT_EDIT)
	sPrompt = getObjectName (TRUE)
	sHotKey = findHotKey ()
	if ! stringIsBlank (sHotKey)
		sayMessage (OT_HELP, formatString (cmsgHotKeyDefaultHelpLoopPrompt1_L, sPrompt, sHotKey))
		Return
	endIf
EndIf
PerformScript SayCurrentAccessKey()
EndScript

void Function SayRibbonState(int iState)
var
	string sMsg
if iState == Ribbons_Inactive then
	sMsg = msgRibbonInActive
elIf iState == RibbonTabs_Active then
	sMsg = msgUpperRibbonActive
elIf iState == LowerRibbon_Active then
	smsg = msgLowerRibbonActive
elIf iState == RibbonCollapsed then
	sMsg = msgRibbonCollapsed+cscSpace+formatString(msgRibbonToggleStateTutorHelp)
endIf
sayFormattedMessage(ot_status,sMsg)
EndFunction

/*
int Function doSDMIndividualChild (handle hWnd, int iControl)
var
	int iSubtype,
	int iTemp,
	string sName,
	string sCtrlLabel1,
	string sCtrlLabel2
If ! IsWindowVisible (hWnd) then
	Return TRUE
EndIf
let iSubtype = sdmGetControlSubtypeCode (hWnd, iControl)
let sName = sdmGetControlName (hWnd, iControl)
;attempt to determine if we should avoid double speaking of control names
;due to the static text name label preceding the control:
if iSubtype == wt_Edit
|| iSubtype == wt_ReadOnlyEdit
|| iSubtype == wt_PasswordEdit then
	let iTemp = SDMGetPrevControl (hWnd, iControl)
	if iTemp
	&& sdmGetControlSubtypeCode (hwnd, iTemp) == wt_static then
		let sCtrlLabel1 = sdmGetControlName (hwnd, iTemp)
	EndIf
ElIf iSubtype == wt_ComboBox then
	let iTemp = SDMGetPrevControl (hWnd, iControl)
	if iTemp
	&& sdmGetControlSubtypeCode (hwnd, iTemp) == wt_static then
		let sCtrlLabel1 = sdmGetControlName (hwnd, iTemp)
	EndIf
ElIf iSubtype == wt_LeftRightSlider
|| iSubtype == wt_UpDownSlider then
	;Sliders may have 1 or 2 static text label fields preceding the control
	let iTemp = SDMGetPrevControl (hWnd, iControl)
	if iTemp
	&& sdmGetControlSubtypeCode (hwnd, iTemp) == wt_static then
		let sCtrlLabel2 = sdmGetControlName (hwnd, iTemp)
		let iTemp = SDMGetPrevControl (hWnd, iControl)
		if iTemp
		&& sdmGetControlSubtypeCode(hwnd, iTemp) == wt_static then
			let sCtrlLabel1 = sdmGetControlName(hwnd, iTemp)
		else
			let sCtrlLabel1 = sCtrlLabel2
			let sCtrlLabel2 = cscNull
		EndIf
	EndIf
EndIf
;now speak the window:
if (sCtrlLabel1 && StringCompare(sCtrlLabel1,sName) == 0)
|| (sCtrlLabel2 && StringCompare(sCtrlLabel2,sName) == 0)
|| (sCtrlLabel2 && !stringStripAllBlanks(StringDiff(StringDiff(sName,sCtrlLabel1),sCtrlLabel2))) then
	;Substitute blank for the control name here,
	;since we spoke it earlier when we spoke the label preceding it
	;SayControlEx(hWnd,cscSpace)
ElIf iSubtype == wt_toolbar then
	;announce the toolbar, then list it's objects
	IndicateControlType(wt_toolbar,GetWindowName(hWnd),cscSpace)
	ReadToolbarObjects(hWnd)
else
	sdmSayWindowTypeAndText (hWnd, iControl)
EndIf
;for edits and multiline read-only edits which don't read their text via sayWindowTypeAndText:
;if (iSubtype == WT_EDIT || iSubtype == WT_READONLYEDIT || iSubtype == WT_MULTILINE_EDIT)
	;if (getWindowStyleBits (hWnd) & ES_MULTILINE)
		;it's the multiline windows who fail to announce the screen-visible text.
		;Only the text which is visible to the user on the screen will be announced.
		;sayWindow (hwnd, READ_EVERYTHING)
	;endIf
;endIf
Return TRUE
EndFunction

int function DoSDMChildObjects (handle hWnd)
var
	int bSpoken,
	int iChild = sdmGetFirstControl (hwnd)
if ! iChild then
	saveCursor ()
	invisibleCursor ()
	saveCursor ()
	MoveToWindow (hwnd)
	sayObjectTypeAndText ()
	restoreCursor ()
	restoreCursor ()
	return TRUE
endIf
while (iChild)
	bSpoken = doSDMIndividualChild (hWnd, iChild) || bSpoken
	iChild = sdmGetNextControl (hwnd, iChild)
	if ! iChild then
	endIf
endWhile
return TRUE
endFunction

int Function DoChildWindows (handle hWnd)
if getWindowCategory (hwnd) == WCAT_SDM || getWindowCategory (getParent (hwnd)) == WCAT_SDM then
	return DoSDMChildObjects (hWnd)
endIf
return DoChildWindows (hWnd)
endFunction
*/

Script ReadBoxInTabOrderWishfulThinking ()
;Reads thru Dialog Box in Tab order
var
	handle hCurrent,
	handle hWnd,
	handle hPos, ; for dialog inside a dialog
	handle hPosChild,
string class,
string childClass
let hCurrent = GetCurrentWindow ()
let hWnd = GetRealWindow (hCurrent)
let class = getWindowClass(hwnd)
let childClass = GetWindowClass( GetFirstChild ( hwnd ) )
if getWindowCategory () != WCAT_SDM && getWindowCategory (hWnd) != WCAT_SDM then
	performScript readBoxInTabOrder ()
	return
endIf
SayMessage (OT_ERROR, formatString(cMsg33_L,getWindowName(hwnd)), cMsgSilent) ;<DialogName> dialog
EnumerateChildWindows (hwnd, "DoChildWindows")
EndScript

Script ReadBoxInTabOrder ()
var
	HANDLE WinHandle,
	int SDMControl
; figure out if we're in a dialog box
let WinHandle = GetRealWindow(GetCurrentWindow())
if StringContains (GetWindowClass (WinHandle), wc_sdm) then
	; this is an sdm dialog
	BeginFlashMessage()
	SayFormattedMessageWithVoice(vctx_message,ot_user_requested_information,
		formatString(cmsg33_L,getWindowName(winHandle)),
		getWindowName(winHandle))
	; work our way through all child windows of the dialog
	SaveCursor ()
	InvisibleCursor ()
	let SDMControl   = SDMGetFirstControl (WinHandle)
	while (SDMControl)
		MoveToControl (WinHandle, SDMControl)
		if !StringContains(GetObjectName(),sc_ErrorsWereDetected) then
			SayObjectTypeAndText ()
		endIf
		let SDMControl = SDMGetNextControl (WinHandle, SDMControl)
	EndWhile
	RestoreCursor ()
	EndFlashMessage()
else
	PerformScript readBoxInTabOrder()
endIf
EndScript

int function IsQuickAccessToolbarActive()
var
	handle hWnd,
	handle hNull,
	int state,
	string tab,
	string group,
	string desc
if GetMenuMode() != 0 then
	return false
EndIf
GetRibbonStatus(state,tab,group,desc)
if state != Ribbons_Inactive then
	return false
EndIf
let hwnd = getFocus()
while hWnd
&& GetWindowClass(hWnd) != wc_MSOWorkPane
&& GetWindowName(hWnd) != wn_Ribbon
	let hWnd = getParent(hWnd)
EndWhile
return hWnd != hNull
EndFunction

;The following is for messages that may either be spoken or posted to message boxes.
;The behaviors are now as follows:
;MAGic with speech off: message box
;MAGIC with speech on: message box only on SameScript, one press = announce only.
;JAWS by itself: announce only.
int Function ProcessMessage (string sText, optional string sText_S, optional int iOutputType, optional string sTitle, optional int iMBFlags,
	optional string sVCTX)
Var
	int bMAGicNoSpeech,
	int bMAGicRunning = (getRunningFSProducts () & product_MAGic)
bMAGicNoSpeech = bMAGicRunning && isSpeechOff ()
if bMAGicNoSpeech then
	return exMessageBox (smmStripMarkup (sText), sTitle, iMBFlags)
elIf bMAGicRunning then
	If IsSameScript () then
		return exMessageBox (smmStripMarkup (sText),sTitle,iMBFlags)
	else
		if sVCTX then
			SayUsingVoice(sVCTX,sText,iOutputType)
		else
			;SayMessageWithMarkup(ot_screen_message,FormatString(msgHeaderTemplate,sText))
			sayMessageWithMarkup (iOutputType, sText, sText_S)
		EndIf
		return IDOK
	EndIf
Else
	if sVCTX then
		SayUsingVoice(sVCTX,sText,iOutputType)
	else
		;SayMessageWithMarkup(ot_screen_message,FormatString(msgHeaderTemplate,sText))
		sayMessageWithMarkup (iOutputType, sText, sText_S)
	EndIf
	return IDOK
endIf
EndFunction

string Function GetPaneNameWithFocus ()
var
	object oFocus,
	object oWorking,
	string sPanel,
	int childID
let oFocus = GetFocusObject (childID)
if !oFocus
	;GetFocusObject appears not to work on the Word 2013 proofing pane
	var int id, int v
	oFocus = GetObjectFromEvent(GetFocus(),id,childID,v)
endIf
let oWorking = oFocus.accParent
while (oWorking.accRole(0) != ROLE_SYSTEM_TOOLBAR && oWorking)
	if (oWorking != oWorking.accParent) then
		let oWorking = oWorking.accParent
	Else
		let oWorking = null()
	EndIf
EndWhile
let sPanel = oWorking.accName(0)
return FormatString(msgPaneNameWithFocus,sPanel, wtn_Pane)
EndFunction

string Function GetUIAStatusBarText()
var
	object o_UIA,
	object condition,
	object ProcessCondition,
	object treeCondition,
	object treeWalker,
	object element,
	object found,
	object pattern,
	string statusBarText,
	string itemText
o_UIA = CreateObjectEx("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
if !o_UIA return cscNull endIf
condition = o_UIA.CreateRawViewCondition()
if !condition return cscNull endIf
ProcessCondition = o_UIA.CreateIntPropertyCondition(UIA_ProcessIdPropertyId, o_UIA.GetFocusedElement().ProcessID)
if !ProcessCondition return cscNull endIf
treeCondition = o_UIA.CreateAndCondition(processCondition, condition)
if !treeCondition return cscNull endIf
treeWalker = o_UIA.CreateTreeWalker(treeCondition)
if !treeWalker return cscNull endIf
element = o_UIA.GetFocusedElement().BuildUpdatedCache()
if !element return cscNull endIf
treeWalker.currentElement = element
while treeWalker.GoToParent() element = treeWalker.currentElement EndWhile
if !element return cscNull endIf
condition = o_UIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_StatusBarControlTypeId)
if !condition return cscNull endIf
found = element.FindFirst(TreeScope_Subtree, condition)
if !found return cscNull endIf
treeWalker.currentElement = found
if treeWalker.GoToFirstChild()
	;It appears that all items showing on the status bar are text of buttons.
	;Only add text from button text of items that are not toggleable
	;or that are both toggleable and are toggled on:
	element = treeWalker.currentElement
	while element
		itemText = cscNull
		if element.name
			if element.controlType == UIA_ButtonControlTypeId
				pattern = element.GetTogglePattern()
				if !pattern
				|| pattern.toggleState == 1
					itemText = element.name
				endIf
			endIf
		endIf
		if itemText
			statusBarText = statusBarText+cscBufferNewLine+itemText
		endIf
		if treeWalker.GoToNextSibling()
			element = treeWalker.currentElement
		else
			element = Null()
		endIf
	endWhile
endIf
return StringTrimLeadingBlanks(statusBarText)
EndFunction

script SayBottomLineOfWindow()
var
	string sText,
	int category
;OSM will sometimes get irrelevant text for the status bar,
;so for the document and taskpane areas use UIA.
category = getWindowCategory()
if (category == WCAT_SPREADSHEET
|| category == WCAT_DOCUMENT
|| category == WCAT_PRESENTATION
|| category == WCAT_TASK_PANE)
&& GetProgramVersion (GetAppFilePath ()) > 13
	sText = GetUIAStatusBarText()
else
	sText = GetBottomLineOfWindow()
	if !sText
		sText = GetUIAStatusBarText()
	endIf
endIf
Say(sText,ot_user_requested_information)
EndScript

int function OnFileTabButton()
var object element = CreateUIAFocusElement(true)
return element.controlType == UIA_ButtonControlTypeId
	&& element.automationId == "FileTabButton"
	&& element.className == "NetUIRibbonTab"
EndFunction

int function OnRibbonButton()
var object element = CreateUIAFocusElement(true)
return element.controlType == UIA_ButtonControlTypeId
	&& element.className == "NetUIRibbonButton"
endFunction

int function InNUIDialogWindow()
var object treeWalker = CreateUIATreeWalkerForFocusProcessId(Null(), true)
while treeWalker.gotoParent()
	if treeWalker.currentElement.controlType == UIA_WindowControlTypeId
	&& treeWalker.currentElement.className == "NUIDialog"
		return true
	endIf
endWhile
return false
EndFunction

int function OnBackstageViewPane()
var object treeWalker = CreateUIATreeWalkerForFocusProcessId(Null(), true)
while treeWalker.gotoParent()
	if treeWalker.currentElement.controlType == UIA_PaneControlTypeId
	&& treeWalker.currentElement.automationID == "BackstageView"
		return true
	endIf
endWhile
return false
EndFunction

void function GetAppUIAWindowAndPaneTitles(string byRef AppWindowTitle, string byRef PaneTitle)
var
	object oUIA,
	object element,
	object processCondition,
	object criteriaCondition,
	object treeCondition,
	object treeWalker
oUIA = CreateObjectEx("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest")
if !oUIA return endIf
element = oUIA.GetFocusedElement().BuildUpdatedCache()
processCondition = oUIA.CreateIntPropertyCondition(UIA_ProcessIdPropertyId, element.ProcessID)
criteriaCondition = oUIA.CreateOrCondition(
	oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_WindowControlTypeId),
	oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_PaneControlTypeId))
criteriaCondition = oUIA.CreateOrCondition(criteriaCondition,
	oUIA.CreateBoolPropertyCondition( UIA_HasKeyboardFocusPropertyId,UIATrue))
treeCondition = oUIA.CreateAndCondition(processCondition,criteriaCondition)
treeWalker = oUIA.CreateTreeWalker(treeCondition)
if !treeWalker return endIf
treeWalker.currentElement = oUIA.getRootElement()
treeWalker.gotoFirstChild()
AppWindowTitle = treeWalker.currentElement.name
SetCurrentElementToDeepestFocusElement(oUIA, treeWalker)
while treeWalker.gotoParent()
	if treeWalker.currentElement.className == "MsoWorkPane"
	|| treeWalker.currentElement.className == "NUIDialog"
	|| treeWalker.currentElement.automationID == "BackstageView"
		if treeWalker.currentElement.name
			paneTitle = treeWalker.currentElement.name
			return
		endIf
	endIf
endWhile
EndFunction

int function OnVirtualRibbonEditCombo()
var
	int iState,
	string sTab,
	string sGroup,
	string sDesc
GetRibbonStatus(iState,sTab,sGroup,sDesc)
return iState
	&& ISVirtualPCCursor()
	&& GetObjectSubtypeCode() == wt_editCombo
EndFunction

int function moveInsideNavigationBar (string keystroke)
if getWindowClass (getFocus ()) == wcNavigationBar then
	TypeKey (keystroke)
	delay (1, TRUE)
	UIARefresh  ()
	return TRUE
endIf
return FALSE
endFunction

void function ShiftTabKey ()
; NavigationBar (AwesomeBar) does not automatically detect UIA focus change.
if moveInsideNavigationBar (cksShiftTab) then return endIf
ShiftTabKey ()
endFunction

void function tabKey ()
; NavigationBar (AwesomeBar) does not automatically detect UIA focus change.
if moveInsideNavigationBar (cksTab) then return endIf
tabKey ()
endFunction

void function nextCharacter ()
if SayCursorMovementException (UnitMove_Next) then return nextCharacter () endIf
; NavigationBar (AwesomeBar) does not automatically detect UIA focus change.
if moveInsideNavigationBar (cksRightArrow) then return endIf
nextCharacter ()
endFunction

void function priorCharacter ()
if SayCursorMovementException (UnitMove_Prior) then return priorCharacter () endIf
; NavigationBar (AwesomeBar) does not automatically detect UIA focus change.
if moveInsideNavigationBar (cksLeftArrow) then return endIf
priorCharacter ()
endFunction

Script CloseListBox ()
if inRibbons () then 
	SayCurrentScriptKeyLabel ()
	typeKey (cksAltUpArrow) 
	return
endIf
PerformScript CloseListBox ()
endScript

Script OpenListBox ()
if inRibbons () then
	SayCurrentScriptKeyLabel ()
	typeKey (cksAltDownArrow) 
	return
endIf
PerformScript OpenListBox ()
endScript

Script SayAppVersion ()
var
	string sProduct,
	string sVersion,
	string sMessage,
	string sNavModule
let sProduct = GetVersionInfoString (GetAppFilePath (), cmsg282_L)
; add retail or subscription info:
sProduct = GetOfficePurchaseInfo (sProduct)
let sVersion = GetVersionInfoString (GetAppFilePath (), cmsg283_L)
let sMessage = FormatString (cmsg239_L, sProduct, sVersion)
let sNavModule = GetNavModuleVersionInfo(GetCurrentWindow())
if (sNavModule != "") then
	let sMessage = sMessage + "\n"
	let sMessage = sMessage + GetNavModuleVersionInfo ((GetCurrentWindow()))
endif
if (IsSameScript()) then
	if (UserBufferIsActive()) then
		UserBufferDeactivate()
	endif
	SayFormattedMessage(OT_USER_BUFFER, sMessage)
else
	SayFormattedMessage(ot_help, sMessage)
endif
EndScript

int Function IsCommonAlertDlg ()
;Purpose:	Determines common dialogs with row of buttons, non-SDM, dialog, caption and choice(s)
var
	handle hWnd,
	int iType,
	int bResult
Let bResult = DialogActive ()
If ! bResult then
	Return bResult
EndIf
Let bResult = InHjDialog ()
If bResult then
	Return bResult;Same T'ypeAndTextInfo to speak
EndIf
Let bResult = IsMultiPageDialog ()
If bResult then
	Return FALSE;
EndIf
Let hWnd = GetFocus ()
;Focusable controls in alert dialogs = button,checkbox,radio,InlineToolbarButton,similar.
;All fall under typecode of Button
Let iType = GetWindowtypeCode (hWnd)
If ! iType then
	Let iType = GetObjectTypeCode (TRUE)
EndIf
Let bResult = (iType == WT_BUTTON)
If ! bResult then
	Return bResult;
EndIf
;These dialogs do not have richedit in them.
If FindWindow (GetParent (hWnd), cwc_RichEdit20WPT) then
	Return FALSE
EndIf
;Property of alert = parent is dialog standard, sibling first and last = static in between = whatever:
Let bResult = (GetWindowClass (GetParent (hWnd)) == cWc_dlg32770
;First window can be static or button
&& (GetWindowSubtypeCode (GetFirstWindow (hWnd)) == WT_STATIC
|| GetWindowSubtypeCode (GetFirstWindow (hWnd)) == WT_BUTTON)
;Last window in said dialogs is generally static.
&& GetWindowSubtypeCode (GetLastWindow (hWnd)) == WT_STATIC)
Return bResult
EndFunction

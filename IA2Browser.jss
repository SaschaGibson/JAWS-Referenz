; Copyright 2005-2023 by Freedom Scientific BLV Group, LLC
;Freedom Scientific script source file
;shared by Firefox and Google Chrome

use "IECustomSettings.jsb"
use "FlexibleWeb.jsb"

include "HJConst.jsh"
include "HJGlobal.jsh"
Include "WinStyles.jsh"
include "UIA.jsh"
include "IAccessible2.jsh"
include "common.jsm"
include "tutorialHelp.jsm"
include "IE.jsm"
include "MicrosoftEdge.jsm"
include "IECustomSettings.jsh"
include "IA2Browser.jsm"
include "MSAAConst.jsh"

import "UIA.jsd"
import "virtual.jsd"
import "firefox.jsd"
import "chrome.jsd"
import "FSXMLDomFunctions.jsd"

Globals
string priorTopLineOfNewContent, ; Used to determine where to read when a webpage updates.
	int NavigationSayValueHook,
	handle ghwndPrevFindWindow,
	string gsMostRecentRSSFeedPage,
	string gsPriorRSSFeedPage,
	string gstrPrevFindText,
	string gPrevStyle,
	string gPrevField,
	int gFFPrevSubtypeCode1,
	int gBrowserPrevTableRow,
	int gBrowserPrevTableCol,
	int gBrowserSuppressFocusSpeech,
	int SavedLevelInTreegrid,  ;Used to track when the level changes in a treegrid
	int GlobalOCRJobID,
	string gSamePageID

GLOBALS
	;Used for MSAA Mode,
	;To be "unset" for HJ Dialogs:
	int giMSAAMode,
	int inWebFeed

;for managing radio buttons where both a focus change and an obj state change occur after selecting a radio button:
const
	EventWaitTimeBeforeAnnounce = 7

globals
	int ScheduledSayObjectAfterWait,
	int shouldSpeakAfterDeletion

globals
;These are used for tracking when the current tab/document changes in Chrome and Firefox.
	int gsDocID,
	int gsPrevDocID

;Browser non-web dialogs present some challenges which must be specially handled:
const
	wt_CustomBrl_BrowserUIDialogButton = 1  ;The custom control for browser app dialog buttons, which must be the same custom control number in both Chrome.jbs and Firefox.jbs
globals
	int gbIsBrowserUIDialog ,
	string brlBrowserUIDialogName,
	string brlBrowserUIDialogText

void Function AutoStartEvent ()
;To store global MSAAMode setting,
;since in HJ Dialog, we must set to Default.
Let giMSAAMode = GetJCFOption (OPT_MSAA_MODE)
;initialize the custom settings code correctly otherwise virtual jcf options wil be initialized from empty global variables
;causing unpredictable and strange results.
CustomSettingsStart ()
let gBrowserPrevTableRow = 0;
let gBrowserPrevTableCol = 0;
let gPrevStyle = ""
let gPrevField = ""
var int selectionContextFlags = (GetSelectionContextFlags ()
	|selCtxTables 
	|selCtxStyle 
	|selCtxTableCell
	|selCtxFields
)
SetSelectionContextFlags (selectionContextFlags)
let inWebFeed=false
let shouldSpeakAfterDeletion = false
gSamePageID = cscNull 
EndFunction

void function AutoFinishEvent()
let bWereCustomSettingsLoaded=FALSE
ClearSayObjectAfterWait()
EndFunction

string function FindHotKey(string ByRef sPrompt)
var
	handle hWnd,
	int iType,
	string sHotKey
if !GlobalMenuMode then
	let hwnd = GetCurrentWindow ()
	let sPrompt = cscNull
	let iType = GetWindowSubTypeCode (hwnd)
	if ! iType then
		Let iType = GetObjectSubtypeCode(SOURCE_DEFAULT)
	endIf
	If iType == WT_BUTTON
	|| iType == WT_RADIOBUTTON
	|| iType == WT_CHECKBOX
	|| iType == WT_GROUPBOX
	|| iType == WT_3STATE
	|| iType == WT_TABCONTROL then
		let sHotKey = GetHotKey()
		let sPrompt = GetObjectName(SOURCE_DEFAULT);all controls in same window with Firefox
		If !sHotKey then
			if ! StringIsBlank (getGroupBoxName ()) then
				While (hwnd && getWindowSubtypeCode (hwnd) != WT_GROUPBOX)
					Let hwnd = getPriorWindow (hwnd)
	 			endWhile
				Let sHotKey = getHotKey (hwnd)
			else
				let hwnd = GetPriorWindow (hwnd)
				let iType = GetWindowSubTypeCode (hwnd)
			endIf
			if iType == WT_GROUPBOX then
				let sHotKey = GetHotKey (hwnd)
			endIf
		endIf
		if !sHotKey then
			let sPrompt = cscNull
		EndIf
		return sHotKey
	endIf
else
	;if we are in a menu on a web page, we only want to use GetHotKey as first letter for menu seems unreliable
	let hwnd = GetCurrentWindow ()
	if IsBrowserContentWindow(hwnd) then
		var
			object menuItem
		let menuitem = GetCurrentObject(0)
		let sHotKey = menuItem.accKeyboardShortcut(0)
		return sHotKey
	EndIf
EndIf
return FindHotKey(sPrompt)
endFunction

void function HandleHeadersForTableCellFocus(int row, int col)
; It is valid to be on a row header and desire to hear the column header above it.
; It is also valid to be on a column header and desire to hear its row header.
; There is already logic below to prevent doublespeaking if the header and the current cell are the same.
; Hence the below test is non-strict.
if !InTableCell(false) return endIf
var string focusName = stringStripAllBlanks (GetObjectName(SOURCE_DEFAULT,0))
if TBL_HEADER_MARKED == GITblHeaders
|| TBL_HEADER_BOTH == GITblHeaders
|| TBL_HEADER_ROW == GITblHeaders
	var
		string rowHeader = GetRowHeader(TBL_HEADER_MARKED == GITblHeaders),
		int focusNameAndRowHeaderAreSame = (StringCompare(focusName, stringStripAllBlanks (rowHeader), false) == 0)
	if !focusNameAndRowHeaderAreSame
	&& row != gBrowserPrevTableRow 
		SayUsingVoice (VCTX_MESSAGE, rowHeader, OT_screen_message)
	endIf
EndIf
if TBL_HEADER_MARKED == GITblHeaders
|| TBL_HEADER_BOTH == GITblHeaders
|| TBL_HEADER_COL == GITblHeaders
	var
		string colHeader = GetColumnHeader (TBL_HEADER_MARKED == GITblHeaders),
		int focusNameAndColHeaderAreSame = (StringCompare(focusName, stringStripAllBlanks (colHeader), false) == 0)
	if !focusNameAndColHeaderAreSame
	&& gBrowserPrevTableCol != col 
		SayUsingVoice (VCTX_MESSAGE, colHeader, OT_screen_message)
	endIf
EndIf
EndFunction

int function HandleTableCellFocus()
if !InTable() return false endIf
var
	int col,
	int row
GetCellCoordinates( col, row )
If ( !InTableCell (false)
	|| row > 9999 || col > 9999 || row <= 0 || col <= 0) then
	gBrowserPrevTableRow = 0;
	gBrowserPrevTableCol = 0;
	return 0;
EndIf
var int SpeakHeadersBeforeContent = ShouldSpeakTableHeadersBeforeCellContent()
if SpeakHeadersBeforeContent
	HandleHeadersForTableCellFocus(row,col)
endIf
var int iType = GetObjectTypeCode()
if IsFormsModeControl()
|| iType==wt_LINK
|| iType==wt_BUTTON
	sayObjectTypeAndText()
else
	SayCellEx()
endIf
if !SpeakHeadersBeforeContent
	HandleHeadersForTableCellFocus(row,col)
endIf
;announce coordinates
if gbDefaultVCursorCellCoordinatesAnnouncement
	if row != gBrowserPrevTableRow 
	&& gBrowserPrevTableCol != col 
		SayFormattedMessageWithVoice(vctx_message, ot_position,
			formatString(msgTableCoordinates1_L, intToString(col), intToString(row)),
			formatString(msgTableCoordinates1_S, intToString(col), intToString(row)))
	elif row != gBrowserPrevTableRow 
		SayFormattedMessageWithVoice(vctx_message, ot_position,
			FormatString(msg_row,intToString(row)))
	elif gBrowserPrevTableCol != col 
		SayFormattedMessageWithVoice(vctx_message, ot_position,
			FormatString(msg_column,intToString(col)))
	endIf
EndIf
gBrowserPrevTableRow = row;
gBrowserPrevTableCol = col;
return true
EndFunction

int Function HandleCustomWindows (HANDLE hWnd)
if (InTable() && HandleTableCellFocus() ) then
	return true
else
	gBrowserPrevTableRow = 0
	gBrowserPrevTableCol = 0
EndIf
var int type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0 )
if ( type == WT_TREEVIEWITEM
&& !IsFormsModeActive ()) then
	SayTreeviewLevel();
	return true
EndIf
;treegrid
if (InATreegrid ()) then
	SayTreeViewLevel (true)
	return true
EndIf
return FALSE
EndFunction

object function UIAFindAncestorElementWithRole(object element, int role)
if !element || !role return Null() endIf
var
	object o = element,
	object pattern
while o
	pattern = o.GetLegacyIAccessiblePattern()
	if pattern
	&& pattern.Role == role
		return o
	endIf
	o = FSUIAGetParentOfElement(o)
endWhile
return Null()
EndFunction

void function SayTutorialHelpForObjectAtLevel(int subtypeCode, int level)
var int iSpeak = GetTutorialHelpOutputType(GetScriptAssignedTo(GetCurrentScriptKeyName()) == "SayWindowPromptAndText")
if subtypeCode == wt_Toolbar
	var int state = GetObjectIA2State(level)
	if state & IA2_STATE_HORIZONTAL
		SayUsingVoice (VCTX_MESSAGE, msgHorizontalToolBar, iSpeak)
	elif state & IA2_STATE_VERTICAL
		SayUsingVoice (VCTX_MESSAGE, msgVerticalToolBar, iSpeak)
	endIf
endIf
EndFunction

void function SayAncestorAtLevel(int level, int type, int parentType, int focusRole, int focusType)
if type == wt_table
&& !IsVirtualPCCursor() 
	var string xmlRole = GetObjectIA2Attribute("xml-roles",level)
	if StringContains(StringLower(xmlRole), "grid")
		SayNameAndSizeOfGrid()
	endIf
else
	SayAncestorAtLevel(level, type, parentType, focusRole, focusType)
endIf
EndFunction

void function DoSayObjectTypeAndTextFromLevel(int level)
if (gBrowserSuppressFocusSpeech)
	return
EndIf
var
	int parentType,
	int focusType = GetObjectSubtypeCode(SOURCE_DEFAULT, 0),
	int focusRole = GetCurrentObject(0).accRole(0),
	int type = focusType,
	int ancestorCount = GetAncestorCount(),
	int pageIsChanging = (ancestorCount == level || ancestorCount -1 == level)
while level > 0
	parentType = type ; type will now be set to current type
	type = GetObjectSubtypeCode(SOURCE_DEFAULT, level)
	if ShouldSayAncestorAtLevel(level, type, parentType, focusRole, focusType)
		if type == 0
			HandleUnknownAncestor(level, focusType, pageIsChanging)
		else
			SayAncestorAtLevel(level, type, parentType, focusRole, focusType)
		endIf
	endIf
	if level == 1
		gFFPrevSubtypeCode1 = type
	EndIf
	level = level - 1
EndWhile
if IsVirtualPCCursor()
	if GlobalFocusWindow != GlobalPrevFocus
		SetUpStuffForNewPage(TRUE) ; Force an update to the page itself.
	EndIf
	if pageIsChanging
		if (focusType == WT_BUTTON || IsTypeOfSlider(type))
			SayObjectTypeAndText ()
		else
			SayLine()
		endIf
		return
	endIf
endIf
SayFocusAtLevel()
EndFunction

Void Function HandleUnknownAncestor (int level, int focusType, int pageIsChanging)
if (level < 1) then
	return
EndIf

if (GetObjectSubtypeCode(SOURCE_DEFAULT,level) != WT_UNKNOWN) then
	return
EndIf

var
	object focusObject,
	object parentObject

focusObject = GetCurrentObject (0)
parentObject = focusObject.accParent()
if ( pageIsChanging 
	&& focusObject.accRole(0) != ROLE_SYSTEM_APPLICATION
	&& parentObject.accRole(0) != ROLE_SYSTEM_WINDOW)
	SayControlEx (0, GetObjectName(SOURCE_DEFAULT, level ))
	return
EndIf

if ( GetObjectName(SOURCE_DEFAULT, level) == "" ) then
	return
EndIf

var
	string focusedElementName,
	string ancestorElementName

let focusedElementName = stringStripAllBlanks (GetObjectName(SOURCE_DEFAULT, 0))
let ancestorElementName = stringStripAllBlanks (GetObjectName(SOURCE_DEFAULT, level))
if (StringContains (ancestorElementName, focusedElementName)) then
	return
EndIf

if GetObjectSubTypeCode(SOURCE_DEFAULT, 0) == WT_UNKNOWN
	return ;focused object and ancestor object are both unknown types, just speak the focused object
EndIf

SayObjectTypeAndText (level)
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
If InHjDialog () then
	SetJCFOption (OPT_MSAA_MODE, GetDefaultJCFOption(OPT_MSAA_MODE))
Else
	SetJcfOption (OPT_MSAA_MODE, giMSAAMode)
EndIf
;SayString("ActiveItem")
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId,
	prevHwnd, prevObjectId, prevChildId)

; the following may be left from debugging
; At any rate, it causes ARIA tree view items to double speak
; so please don't re-add without taking this into consideration
;DoSayObjectTypeAndTextFromLevel( 0 );
EndFunction

int function ProcessSayRealWindowOnFocusChangeFromHJDialog(handle AppWindow, handle RealWindow,
	string RealWindowName, handle FocusWindow)
; Flexible Web: resolution to bug where real window was not properly spoken
; including its static text:
if RealWindowName == cwn_FlexibleWeb_dlg then
	SayWindowTypeAndText (RealWindow)
	return TRUE
endIf
if !GlobalWasHjDialog then
	return false
EndIf
;Do not speak the real name when exiting from an HJDialog back to the application.
if !InHjDialog() then
	;GlobalWasHjDialog prevents over chatter, especially when exiting a list box and returning to a client area.
	;Set GlobalWasHJDialog to FALSE when one HjDialog follows another,
	;For example, the AddBrailleColors function.
	return true
EndIf
return false
EndFunction

void function ProcessEventOnFocusChangedEvent(handle AppWindow, handle RealWindow, string RealWindowName,
	handle FocusWindow, handle PrevWindow)
if (globalWasHJDialog
&& !inHJDialog()) then
	ProcessZTTetheredViewFocusChange (FocusWindow, RealWindow, RealWindowName)
	return
EndIf
ProcessEventOnFocusChangedEvent(AppWindow, RealWindow, RealWindowName,FocusWindow, PrevWindow)
EndFunction

Void function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
ClearSayObjectAfterWait()
var
	int nLevel

if inHJDialog() then
	SetJCFOption (OPT_MSAA_MODE, GetDefaultJCFOption (OPT_MSAA_MODE))
	return Default::FocusChangedEvent(FocusWindow,PrevWindow)
elIf ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
elif (globalWasHJDialog) then
	return FocusChangedEvent (FocusWindow, PrevWindow)
elif ShouldUseDoSayObjectFromLevel( focusWindow, prevWindow )
	let GlobalFocusWindow = FocusWindow
	SetJcfOption (OPT_MSAA_MODE, giMSAAMode)
	; the following condition fixes a problem in tree views
	; where jaws will announce the parent along with the focus
	; when moving down a level in the tree
	if (FindAncestorOfType(WT_TREEVIEW) > 0
	&& GetRelationshipBetweenCurrentAndPreviousFocusObjects() == PreviousFocusIsParentOfCurrent
	&& (GetObjectSubTypeCode(SOURCE_DEFAULT, 0) != WT_LISTBOXITEM))
		nLevel = 0;
	else
		nLevel = GetFocusChangeDepth()
	EndIf
	;When selecting a radio button in a group, sometimes FocusChangedEvent fires before ObjStateChangedEvent,
	;and the radio button is announced along with the old state before ObjStateChangedEvent announces it with the new state.
	;However, we must allow for the fact that radio button groups do not require that any are initially checked.
	;To do this, we schedule announcement of any unchecked radio buttons on focus change,
	;and if the ObjStateChangedEvent doesn't fire an cancel the button will be announced by the scheduled function.
	if GetObjectSubtypeCode() == wt_radioButton
	&& GetObjectStateCode() & ctrl_unchecked
		ScheduledSayObjectAfterWait = ScheduleFunction("SayObjectAfterWait",ScheduledSayObjectAfterWait)
	else
		DoSayObjectTypeAndTextFromLevel( nLevel )
	endIf
	let GlobalPrevFocus = FocusWindow
	let GlobalPrevReal = GetRealWindow (GlobalPrevFocus)
	let GlobalPrevRealName = GetWindowName (GlobalPrevReal)
	let GlobalPrevApp = GetAppMainWindow (GlobalPrevFocus)
	Let GlobalWasHjDialog = false
	GlobalPrevDialogIdentifier = GetDialogIdentifier()
else
	if GetObjectSubtypeCode(SOURCE_DEFAULT,0)==wt_dialog then
		; Focus has landed on the actual dialog object. Read the dialog.
		Say(GetTypeAndTextStringsForWindow(getFocus()), OT_DIALOG_TEXT)
	elif !gBrowserSuppressFocusSpeech then
		SetJCFOption (OPT_MSAA_MODE, GetDefaultJCFOption(OPT_MSAA_MODE))
		FocusChangedEvent(FocusWindow,PrevWindow)
	EndIf
EndIf
EndFunction

void function PreProcessFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if IsBrowserUIDialog()
	gbIsBrowserUIDialog = true
else
	if gbIsBrowserUIDialog
		gbIsBrowserUIDialog = false	
		ClearBrlBrowserUIDialogStrings()
	endIf
endIf
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction
int function InEditableTable()
if !GetObjectIsEditable() || GetObjectSubtypeCode() == wt_editCombo then
	return false
endIf
 if !WasMostRecentScriptTableNav() && !FocusChangeTriggeredByUserNavigation() then
return false
endIf
; put inTable test last to avoid cross process call if not needed.
return inTable()
endFunction

void function FocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
PreProcessFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	

var
	int type
; avoid double speaking from focus changing as a result of table navigation.
if InEditableTable() then
	return; table nav will generate its own events.
endIf
if IsJavaWindow(hwndFocus) then
	SayFocusedObject ()
	Return
EndIf

let type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0 )
if ( hwndFocus == hwndPrevFocus
&& nObject == nPrevObject
&& nChild == nPrevChild
&& !InHJDialog ()
&& IsVirtualPCCursor()
&& !IsFormsModeActive() 
&& !InTableCell(false)
&& type != WT_TREEVIEWITEM) then
; sometimes we get focus change events from Jaws when object names change
; these events are supurfluous in Firefox
; unless in forms mode in a table
; or in an HJ dialog
	return
EndIf

if (type == WT_UNKNOWN
&& GetObjectRole (0) == 0
&& !InHJDialog ()) 
	return
EndIf
	
;keep FocusChanges from article to article from speaking in web feeds while navigating with the virtual cursor.
if (inWebFeed() 
&& type == WT_ARTICLE_REGION) then 
	SayObjectTypeAndText(0)
	return
EndIf

if !IsInsideARIAApplication () && !IsFormsModeControl() then
	if IsFormsModeActive () && getJCFOption(OPT_AUTO_FORMS_MODE) > 0 then
		TurnOffFormsMode ()
	endIf
EndIf

if (HandleFocusInTreeview(hwndFocus,nChangeDepth)) then
	return
EndIf

if (SayNewDocumentTab()) then
	return
EndIf
	
FocusChangedEventEx (
	hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void Function SayFocusedWindow ()
var
	handle hWinSwitch
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
If GlobalMenuMode  then
	return
endIf
;Keepp alt+tab from over-talking
let hWinSwitch=findTopLevelWindow(cwc_Dlg32771,cscNull)
if hWinSwitch
&& isWindowVisible(hWinSwitch) then
	Return
EndIf
if SayNewDocumentTab() then
	return
EndIf
if GetRunningFSProducts() & product_JAWS
&& IsVirtualPCCursor() then
	SetUpStuffForNewPage (TRUE);Force an update to the page itself.
EndIf
SayFocusedObject ()
EndFunction

Script AddressBar ()
var
	string sURL
let sURL = GetDocumentPath()
if sURL then
	if IsSameScript () then
		if UserBufferIsActive() then
			UserBufferDeactivate()
		EndIf
		UserBufferClear()
		UserBufferAddText(sURL)
		UserBufferAddText(cscBufferNewLine+cMsgBuffExit,
			cScNull, cScNull,
			cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
		UserBufferActivate()
		JAWSTopOfFile()
		SayAll()
	else
		SayMessage(ot_user_requested_information,FormatString (msgAddress1_L,sURL),sURL)
	EndIf
else
	SayMessage(ot_user_requested_information,msgAddressBarNotFound1_L)
EndIf
EndScript

Script GoBack ()
let BackForward = 1
priorTopLineOfNewContent=cscNull
TypeKey (ks1)
SayFormattedMessage (ot_STATUS, msgBack1_L, cmsgSilent)
;Forms Mode doesn't automatically turn off
;when going either back or forward on pages.
If IsFormsModeActive() then
	TurnOffFormsMode ()
EndIf
EndScript

Script GoForward ()
let BackForward = 1
priorTopLineOfNewContent=cscNull
TypeKey (ks2)
SayFormattedMessage (ot_STATUS, msgForward1_L, cmsgSilent)
;Forms Mode doesn't automatically turn off
;when going either back or forward on pages.
If IsFormsModeActive() then
	TurnOffFormsMode ()
EndIf
EndScript

int function IsTypeOfSlider( int type )
return type == WT_LEFTRIGHTSLIDER
	|| type == WT_SLIDER
	|| type == WT_UPDOWNSLIDER
EndFunction

script SayLine(optional int drawHighlights)
var
	string sLine
If IsPcCursor()
&& !IsVirtualPcCursor()
&& globalMenuMode==MENU_ACTIVE then
	If IsSameScript () then
		SpellString(GetObjectname())
	else
		sayObjectActiveItem()
	EndIf
	return
elIf isPcCursor ()
&& ! dialogActive () ; edit combos that fail are non-standard.
&& getObjectSubtypeCode(SOURCE_DEFAULT) == WT_EDITCOMBO then
	let sLine = getObjectValue(SOURCE_DEFAULT)
	if isSameScript () then
		spellString (sLine)
	else
		if stringIsBlank (sLine) then
			;make sure we do a proper blank line:
			let sLine = cmsgBlank1
		endIf
		say (sLine, OT_LINE);
	endIf
	Return
elif ( IsFormsModeActive()
|| ( IsPcCursor()
&& !IsVirtualPcCursor() ) ) then
; not virtual PC, some type of control level interaction
var int type
let type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0 );
if ( type == WT_TABLECELL
|| type == WT_TOGGLE_BUTTON
|| type == WT_BUTTONMENU) then
	SayObjectTypeAndText (0)
	return
elif type == WT_TREEVIEWITEM
	sayObjectActiveItem()
		return
EndIf
EndIf
;for buttons use sayobjecttypeandtext
var
	int subType
let subType = GetObjectSubTypeCode(SOURCE_DEFAULT, 0)
if IsVirtualPCCursor () 
&& (subType == WT_BUTTON || IsTypeOfSlider(subType)) then
	SayObjectTypeAndText (0)
	return
EndIf
if !IsVirtualPCCursor () && subType == WT_RADIOBUTTON then
	SayObjectTypeAndText (0)
	return
EndIf
if SupportsEditCallbacks () && subType == WT_EDIT then
	SayLine (drawHighlights)
	return
EndIf
PerformScript SayLine()
IndicateInconsistenciesInRange(CheckLine)
EndScript

Script TopOfFile()
if IsPCCursor()
&& !IsVirtualPCCursor()
&& !DialogActive()
&& GetObjectSubtypeCode() == wt_TabControl  then
	JAWSTopOfFile()
	delay (1)
	SayMessage(ot_help,msgMoveTabToBeginning_L,msgMoveTabToBeginning_S)
	SayObjectTypeAndText()
	return
EndIf
PerformScript TopOfFile()
EndScript

Script BottomOfFile()
if IsPCCursor()
&& !IsVirtualPCCursor()
&& !DialogActive()
&& GetObjectSubtypeCode() == wt_TabControl  then
	JAWSBottomOfFile()
	delay (1)
	SayMessage(ot_help,msgMoveTabToEnd_L,msgMoveTabToEnd_S)
	SayObjectTypeAndText()
	return
EndIf
PerformScript BottomOfFile()
EndScript

script ControlUpArrow()
if IsPCCursor()
&& !IsVirtualPCCursor()
&& !DialogActive()
&& GetObjectSubtypeCode() == wt_TabControl  then
	TypeKey(cksControlUpArrow)
	delay (1)
	SayMessage(ot_help,msgMoveTabLeft_L,msgMoveTabLeft_S)
	SayObjectTypeAndText()
	return
EndIf
PerformScript ControlUpArrow()
EndScript

script ControlDownArrow()
if IsPCCursor()
&& !IsVirtualPCCursor()
&& !DialogActive()
&& GetObjectSubtypeCode() == wt_TabControl  then
	TypeKey(cksControlDownArrow)
	delay (1)
	SayMessage(ot_help,msgMoveTabRight_L,msgMoveTabRight_S)
	SayObjectTypeAndText()
	return
EndIf
;handle extended selection listboxes
var
	int type
if IsFormsModeActive()
	let type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0)
	if (type == WT_LISTBOXITEM) then
		TypeKey(cksControlDownArrow)
		return
	EndIf
EndIf
PerformScript ControlDownArrow()
EndScript

script SayPriorWord()
PerformScript SayPriorWord()
inWebFeed = InWebFeed()
EndScript

script SayNextWord()
PerformScript SayNextWord()
inWebFeed = InWebFeed()
EndScript

int function OpeningFormsModeComboBox()
if !IsVirtualPCCursor() || IsJavaWindow(GetFocus()) then
	return false
EndIf
if GetObjectSubtypeCode() == wt_comboBox then
	LeftMouseButton()
	TurnOnFormsMode()
	SayMessage (ot_JAWS_message, cmsg41_L, cmsgSilent)  ;open list box
	gbShouldExitFormsModeOnComboBoxClose = true
	return true
EndIf
return false
EndFunction

int function ClosingFormsModeComboBox()
var
	handle hWnd,
	handle hParent
if !gbShouldExitFormsModeOnComboBoxClose then
	return false
EndIf
if IsFormsModeActive() then
	gbShouldExitFormsModeOnComboBoxClose = false
	DoCloseListBoxKeyStroke()
	SayMessage(ot_JAWS_message, cmsg42_L, cmsgSilent) ;close listbox
	TurnOffFormsMode()
 	return true
EndIf
return false
EndFunction

int function IsOpenListBoxApplicable(handle hWnd, int iSubtype)
return (iSubtype == WT_EDITCOMBO)
	|| (iSubtype == WT_EDIT && StringContains (GetObjectName (), ObjN_search))
	|| IsOpenListBoxApplicable(hWnd,iSubtype)
EndFunction

int function IsCloseListBoxApplicable(handle hWnd, int iSubtype)
RETURN (iSubtype == WT_EDITCOMBO)
	|| (iSubtype == WT_EDIT && StringContains (GetObjectName (), ObjN_search))
	|| IsCloseListBoxApplicable(hWnd,iSubtype)
EndFunction

Script OpenListBox ()
var
	handle hWnd,
	int TheTypeCode
if ShouldMoveBySentence(UnitMove_Next) then
	return
elif OpeningFormsModeComboBox() then
	return
EndIf
let TheTypecode = GetObjectSubtypeCode()
let hWnd = GetCurrentWindow()
if IsOpenListBoxApplicable(hWnd,TheTypecode) then
	if GetWindowClass(hWnd) == cwc_ComboLBox then
		let hWnd = GetParent(hWnd)
	EndIf
	ProcessOpenListBox(hWnd,TheTypecode,IsFormsModeActive())
	return
endIf
PerformScript OpenListBox ()
EndScript

Script CloseListBox()
var
	handle hWnd,
	int TheTypeCode
if ShouldMoveBySentence(UnitMove_Prior) then
	return
elif ClosingFormsModeComboBox() then
	return
EndIf
let TheTypeCode = GetObjectSubtypeCode()
let hWnd = GetCurrentWindow()
if IsCloseListBoxApplicable(hWnd,TheTypecode) then
	if GetWindowClass(hWnd) == cwc_ComboLBox then
		let hWnd = GetParent(hWnd)
	EndIf
	ProcessCloseListBox(hWnd,TheTypeCode,IsFormsModeActive())
	return
endIf
PerformScript CloseListBox()
EndScript

string function AddToString (string sFirstString, string sSecondString)
let sFirstString = sFirstString + cScBufferNewLine + sSecondString + cScBufferNewLine
return sFirstString
EndFunction

script ScriptFileName()
ScriptAndAppNames(GetBrowserName(true))
EndScript

Script HotKeyHelp ()
var
	string BrowserName,
	string sTemp_L,
	string sTemp_S
BrowserName = GetBrowserName()
if TouchNavigationHotKeys()
	return
endIf
If UserBufferIsActive ()
	UserBufferDeactivate ()
EndIf
sTemp_L = FormatString(msgBrowserHotKeyHelp1_L,browserName) + cScBufferNewLine
sTemp_S = FormatString(msgBrowserHotKeyHelp1_S,browserName) + cScBufferNewLine
if IsBrowserContentWindow(getFocus())
&& !DialogActive()
	if IsVirtualPcCursor()
		BrowserVirtualHotKeyHelp ()
		return
	EndIf
	sTemp_l = AddToString (sTemp_L,FormatString(msgBrowserFormsModeHotKeyHelp_L))
	sTemp_s = AddToString (sTemp_S,FormatString(msgBrowserFormsModeHotKeyHelp_S))
	SayFormattedMessage(ot_user_buffer, sTemp_L)
	AddAskFSCompanionHotKeyLink()
	UserBufferAddText (cscBufferNewLine+cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
	return
EndIf
GeneralJAWSHotKeys ()
EndScript

Script ScreenSensitiveHelp ()
var
	string sObjHelp
Let sObjHelp = GetObjectHelp ()
If sObjHelp then
   SayMessage (OT_USER_BUFFER, sObjHelp)
   AddHotKeyLinks ()
   Return
EndIf
PerformScript ScreenSensitiveHelp ()
EndScript

Int Function FindAncestorWithState(int state)
var
	int numAncestors,
	int currentAncestor,
	int ancestorState,
	int matchingAncestor
let numAncestors = GetAncestorCount ()
let matchingAncestor = -1
let currentAncestor = 0
while (currentAncestor <= numAncestors && matchingAncestor == -1)
	let ancestorState = GetObjectStateCode (true, currentAncestor)
	if (ancestorState&state) then
		let matchingAncestor = currentAncestor
	EndIf
	let currentAncestor = currentAncestor+1
EndWhile

return matchingAncestor
EndFunction

Script ReadBoxInTabOrder()
if inHjDialog () then
	performScript ReadBoxInTabOrder ()
	return
endIf

var
	int dialogAncestorLevel

let dialogAncestorLevel = FindAncestorOfType (WT_DIALOG)
if dialogAncestorLevel != -1 then
	say(MSAAGetDialogStaticText (),OT_USER_REQUESTED_INFORMATION)
	return
EndIf

var
	handle hWnd,
	handle hParent
let hWnd = GlobalFocusWindow
if IsBrowserContentWindow(hWnd)
&& DialogActive() then
	SayMessage(OT_ERROR,
		formatString(cMsg33_L,getWindowName(GetRealWindow(hwnd))),
		cMsgSilent)
	let hParent = GetParent(hWnd)
	while IsBrowserContentWindow(hParent)
		let hWnd = hParent
		let hParent = GetParent(hWnd)
	EndWhile
	Say(GetWindowTextEX(hWnd,FALSE,TRUE),ot_message)
	return
EndIf
PerformScript ReadBoxInTabOrder()
EndScript

void Function SayHighlightedText (handle hwnd, string buffer)
var
	int iSubtype
Let ghwndPrevFindWindow = null()
Let gstrPrevFindText = cscNull;
if isVirtualPcCursor () then;ensure apps like Facebook apps don't repeat extra text.
	return ; No speech when text is highlighted
endIf
if inHjDialog () then
	SayHighlightedText (hwnd, buffer)
	Let ghwndPrevFindWindow = hwnd;
	Let gstrPrevFindText = buffer;
	Return
endIf
Let iSubtype = GetObjectSubtypeCode()
if IsBrowserContentWindow(hwnd) then
	if iSubtype == WT_TREEVIEWITEM
	|| iSubtype == WT_COMBOBOX
	|| iSubtype == WT_EDITCOMBO
	|| iSubtype == WT_LISTBOXITEM
	|| iSubtype == WT_TABCONTROL
	|| iSubtype == WT_LISTITEM
	|| iSubType == WT_TOGGLE_BUTTON then
		Return
	endIf
EndIf
;Keep selected text from repeating.  When text is either selected or unselected, the window is refreshing.
if IsFormsModeActive () && (hWnd == getFocus () || SupportsEditCallbacks ())
&& (iSubtype == WT_EDIT || iSubtype == WT_MULTILINE_EDIT) then
	Return;
endIf
SayHighlightedText(hwnd,buffer)
EndFunction

Script VirtualFind()
if IsFormsModeActive() Then
	TurnOffFormsMode()
EndIf
if ! IsVirtualPCCursor () then
	TypeKey (ks6)
	return
EndIf
gBrowserSuppressFocusSpeech = true;
SayFormattedMessage (ot_ERROR, MsgVirtualFind, cmsgSilent)
DoJAWSFind(FALSE)
gBrowserSuppressFocusSpeech = false;
EndScript

script ControlEnter()
var
	handle hwnd,
	int nLinkIndex
let hwnd = GetFocus()
if IsBrowserContentWindow(hwnd) then
	SayCurrentScriptKeyLabel ()
	let nLinkIndex = GetCurrentLinkIndex()
	if nLinkIndex then
		FocusToLink(nLinkIndex)
		Pause ()
		TypeKey (ksOpenLinkInNewTab)
		;Copied from Internet Explorer code to announce when a new tab page is opened
		SayFormattedMessage(ot_screen_message, msgNewTabPage)
	EndIf
	return
EndIf
PerformScript ControlEnter()
EndScript

script ControlShiftEnter()
var
	handle hwnd,
	int nLinkIndex
let hwnd = GetFocus()
if IsBrowserContentWindow(hwnd) then
	SayCurrentScriptKeyLabel ()
	let nLinkIndex = GetCurrentLinkIndex()
	if nLinkIndex then
		FocusToLink(nLinkIndex)
		Pause ()
		ControlShiftEnterKey()
	EndIf
	return
EndIf
PerformScript ControlShiftEnter()
EndScript

Script Enter ()
Var
	int objType,
	int isOnSamePageLink 
SayCurrentScriptKeyLabel ()
objType = GetObjectSubTypeCode ()
isOnSamePageLink = (IsVirtualPCCursor () && objType == WT_THISPAGE_LINK)
if isOnSamePageLink == true Then
	gSamePageID = GetXMLDomNodeFSID (GetFSXMLElementNode ())
EndIf
enterKey()
if isOnSamePageLink == true Then
	Delay (1, true)
	ScheduleFunction ("SpeakSamePageLink", 5, true)
EndIf
EndScript

String Function GetNumOfPageElements ()
var
	string sHeadingNum,
	string sFrameNum,
	string sLinkNum,
	string sZPageName,
	string sFormNum,
	string sRegionNum,
	string strTemp,
	string sTemp_L,
	string sTemp_S,
	int nForms,
	int nFrames,
	int iLinkCount,
	int iHeadingCount,
	int iRegionCount,
	int nLevel,
	int glanceHighlightCount,
	string smartGlanceMsg
 
;For tables and lists.
;No matter what, we want to speak the correct items here:
If InTable () then
	Let sTemp_l = GetScreenSensitiveHelpForVirtualCursorTable() + cScBufferNewLine
EndIf
If InList () then
	Let sTemp_l = sTemp_l + GetScreenSensitiveHelpForVirtualCursorList() + cScBufferNewLine
EndIf
let iLinkCount=getLinkCount()
if iLinkCount > 1 then
	let sLinkNum = formatString(msgPageHasNLinks, intToString(iLinkCount))
elif iLinkCount==1 then
	let sLinkNum = msgPageHasOneLink
else ; no links
	let sLinkNum = msgPageHasNoLinks
endIf
let nFrames = GetHTMLFrameCount()
if (nFrames > 0) then
	if (nFrames == 1) then
		let sFrameNum = msgFramesOnPage1_l
	ElIf nFrames > 1 then
		let sFrameNum = FormatString (msgFramesOnPage_L, IntToString (nFrames))
	EndIf
else
	let sFrameNum = cScNull
EndIf
let iHeadingCount=GetHeadingCount(0)
if iHeadingCount then
	if (iHeadingCount==1) then
		let sHeadingNum =msgHeadingsDesc1
	else
		let sHeadingNum = FormatString (msgHeadingsDescMultiple, IntToString (iHeadingCount))
		let nLevel=1
		while nLevel <=6
			let iHeadingCount=GetHeadingCount(nLevel)
			if iHeadingCount then
				let sHeadingNum=sHeadingNum+cScBufferNewLine+formatString(msgHeadingsDescAtLevel, intToString(iHeadingCount), intToString(nLevel))
			EndIf
			let nLevel=nLevel+1
		endWhile
	EndIf
else
	let sHeadingNum=cscNull
endIf
If GetRunningFSProducts() & product_JAWS
let iRegionCount =GetRegionCount(WT_LandmarkRegion)
if (iRegionCount > 0) then
	if (iRegionCount == 1) then
		let sRegionNum = cmsgRegionsOnPage1_l
	else
		let sRegionNum = FormatString (cmsgRegionsOnPage_L, IntToString (iRegionCount))
	EndIf
else
	let sRegionNum = cScNull
EndIf
endIf
let glanceHighlightCount=GetCountOfGlanceHighlights()
if glanceHighlightCount > 0 then
			let smartGlanceMsg=formatString(cmsgSmartGlanceHighlightIndicate_L, IntToString(glanceHighlightCount))
endIf

let szPageName = GetDocumentPath()
If GetRunningFSProducts() & product_JAWS
let nForms = StringSegmentCount(GetListOfFormFields("|"), "|") - 1 ;count forms off by one
if (nForms > 0) then
	if (nForms == 1) then
		let sFormNum = FormatString (msgFormsOnPage1_L, IntToString (nForms))
	elIf (nForms > 1) then
		let sFormNum = FormatString (msgFormsOnPage_L, IntToString (nForms))
	EndIf
else
	let sFormNum = cScNull
EndIf
endIf
let sTemp_l = sTemp_l + sLinkNum
AddTextToString (sTemp_l, sRegionNum)
AddTextToString (sTemp_l, sHeadingNum)
AddTextToString (sTemp_l, sFormNum)
AddTextToString (sTemp_l, sFrameNum)
if smartGlanceMsg!=cscNull then
AddTextToString (sTemp_l, smartGlanceMsg)
endIf
AddTextToString (sTemp_l, sZPageName)
return sTemp_l
EndFunction

;Copied out of internet explorer.jss to add Page Elements to buffer
Void Function ScreenSensitiveHelpForKnownClasses (int nSubTypeCode)
var
	string sPageElements
If IsVirtualPCCursor () then
	If  ! IsJavaWindow (GetCurrentWindow ()) then
		If nSubTypeCode > 0 then
			ScreenSensitiveHelpVirtualCursor (nSubTypeCode)
			Return
		endIf
	endIf
endIf
if nSubTypeCode == WT_LISTBOXITEM
&& GetObjectSubTypeCode(SOURCE_DEFAULT, 1) == WT_EXTENDEDSELECT_LISTBOX
	ScreenSensitiveHelpForKnownClasses(WT_extendedsELECT_LISTBOX)
	return
EndIf
ScreenSensitiveHelpForKnownClasses(nSubTypeCode)
EndFunction

Script WindowKeysHelp()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if IsBrowserContentWindow(getFocus()) then
	SayFormattedMessage(OT_USER_BUFFER, msgBrowserWindowKeysHelp1_L, msgBrowserWindowKeysHelp1_S)
	UserBufferAddText(cscBufferNewLine)
	UserBufferAddText(cmsgWindowKeysHelp1_L)
	UserBufferAddText(cscBufferNewLine)
	UserBufferAddText(cmsgBuffExit)
	return
EndIf
PerformScript WindowKeysHelp()
EndScript

int function IsSayAllOnDocumentLoadSupported()
return true
EndFunction

int function IsTypeOfEdit( int type )
return type == WT_EDIT
	|| type == WT_EDITCOMBO
	|| type == WT_PASSWORDEDIT
	|| type == WT_READONLYEDIT
	|| type == WT_EDIT_SPINBOX
	|| type == WT_MULTILINE_EDIT
	|| type == WT_UPLOAD_EDIT
EndFunction

int function IsTypeOfSpin( )
var
	int objType = GetObjectSubTypeCode(2,0),
	int windowType = GetWindowSubtypeCode(GetFocus())
return objtype == WT_EDIT_SPINBOX
	|| windowType == WT_EDIT_SPINBOX
	|| objtype == WT_SPINBOX
	|| windowType == WT_SPINBOX
EndFunction

int function IsFormControl( int type )
return type == WT_SLIDER
	|| type == WT_LEFTRIGHTSLIDER
	|| type == WT_UPDOWNSLIDER
	|| type == WT_COMBOBOX
	|| type == WT_LISTBOX
	|| type == WT_LISTBOXITEM
	|| type == WT_Listview
	|| type == WT_TREEVIEWITEM
	|| type == WT_BUTTON
	|| type == WT_SCROLLBAR
	|| type == WT_SPINBOX
	|| type == 	WT_EDIT_SPINBOX
	|| type == WT_MENU
	|| type == WT_MENUBAR
	|| type == WT_RADIOBUTTON
	|| type == WT_CHECKBOX
	|| type == WT_TABCONTROL
	|| type == WT_MULTISELECT_LISTBOX
	|| type == WT_EXTENDEDSELECT_LISTBOX
	|| type == WT_EDITCOMBO
	|| type == WT_UPDOWNSCROLLBAR
	|| type == WT_LEFTRIGHTSCROLLBAR
	|| type == WT_TABLECELL
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int bIsFocusObject)
var
	int type
if inHjDialog () then
	If hwnd == ghwndPrevFindWindow
	&& StringCompare (gstrPrevFindText, sObjValue) == 0 then;repeat from highlighted Text
		Let ghwndPrevFindWindow = null()
		Let gstrPrevFindText = cscNull;
		Return
	endIf
	ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue, bIsFocusObject)
	Return
endIf
let type = GetObjectSubTypeCode(2, 0 )
if bIsFocusObject then
	;Prevent improper echoing of text when in an edit combo.
	if type == WT_EDITCOMBO
	|| type == wt_treeviewitem
	|| IsEditInsideCombo() then
		return;
	endIf

	if (IsFormsModeActive() || !IsVirtualPCCursor())
	&& IsFormControl(type) then
		IndicateControlType (0, "", sObjValue)
		return
	EndIf
	if ShouldUseIA2SpecificEditing()
	&& shouldSpeakAfterDeletion == true
		SayCharacterFromCaretMovedEvent();
		let shouldSpeakAfterDeletion = false
		return
	EndIf
EndIf
; for announcing the printer combo box in print dialogue.
If (! bIsFocusObject)
&& nObjType == WT_EDIT_SPINBOX
&& type == WT_COMBOBOX
&& GetObjectSubTypeCode(SOURCE_DEFAULT, 1) == WT_DIALOG
	MSAARefresh (TRUE)	; for the case when the page highly loads the processor. In this case MSAA does not reflect the state correctly.
	Say (GetObjectValue(SOURCE_DEFAULT), OT_SELECTED_ITEM)
EndIf
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

void function SayCharacterUnit(int UnitMovement)
var
	int type
if isJAWSCursor()
|| isInvisibleCursor()
|| inHjDialog()
|| UserBufferIsActive() then
	return SayCharacterUnit (UnitMovement)
endIf
let type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0 )
if IsFormsModeActive()
|| !IsVirtualPCCursor() then
	if IsTypeOfEdit(type) then
		if !SupportsEditCallbacks() then
		SayCharacter ()
		EndIf
		return;
	ElIf IsFormControl(type) then
		return
	EndIf
EndIf
SayCharacterUnit(UnitMovement)
EndFunction

void function SayWordUnit(int UnitMovement)
var
	int type
let type = GetObjectSubTypeCode(2, 0 )
if isJAWSCursor()
|| isInvisibleCursor()
|| inHjDialog()
|| UserBufferIsActive() then
	return SayWordUnit(UnitMovement)
endIf
if IsFormsModeActive() then
	if IsFormControl(type)
	|| IsTypeOfEdit(type) then
		if !SupportsEditCallbacks() && IsTypeOfEdit(type)
			; The only place where EditCallBacks aren't supported in the browser is in IE compatibility mode.
			SayWordUnit(UnitMovement)
			return
		EndIf
		if !(type == WT_EDIT_SPINBOX || type == WT_EDITCOMBO) then
			return;
		EndIf
	EndIf
EndIf
SayWordUnit(UnitMovement)
EndFunction

Int Function ShouldSayFunctionsSpeakSlider (int theTypeCode)
if IsSliderControl(theTypeCode)
&& (IsFormsModeActive ()
|| !IsVirtualPCCursor ())
	return false
EndIf

return ShouldSayFunctionsSpeakSlider (theTypeCode)
EndFunction

void function SayLineUnit(int unitMovement, optional int bMoved)
var
	int type
if SayCursorMovementException(UnitMovement, bMoved)
	SayLineUnit(unitMovement, bMoved)
	return
EndIf
type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0 )
if (IsExpandedEditComboBox(type) && bMoved == false) then
	Return
EndIf
if (IsFormsModeActive() || !IsVirtualPCCursor())
&& (IsFormControl(type) || IsTypeOfEdit(type)) then
	SayLineUnit(unitMovement, bMoved)
	return
Elif IsVirtualPCCursor ()
	if !IsFormsModeActive()
	&& IsTypeOfSpin()
		SayLine()
		return
	elIf (type == WT_BUTTON || IsTypeOfSlider(type))
		SayObjectTypeAndText ()
		return
	EndIf
EndIf
SayLineUnit(unitMovement, bMoved)
EndFunction

void function SayPageUpDownUnit(int UnitMovement)
var
	int type
let type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0 )
if IsFormsModeActive()
|| SupportsEditCallbacks ()
	if IsFormControl(type)
	|| IsTypeOfEdit(type) then
		if !(type == WT_EDIT_SPINBOX || type == WT_EDITCOMBO) then
			return;
		EndIf
	EndIf
EndIf
SayPageUpDownUnit(UnitMovement)
EndFunction

void function SayTopBottomUnit(int UnitMovement)
var
	int type
let type = GetObjectSubTypeCode(2, 0 )
if IsFormsModeActive() then
	if IsFormControl(type)
	|| IsTypeOfEdit(type) then
		if !(type == WT_EDIT_SPINBOX || type == WT_EDITCOMBO) then
			if UnitMovement == UnitMove_Top then
				JAWSTopOfFile()
			ElIf UnitMovement == UnitMove_Bottom then
				JAWSBottomOfFile()
			EndIf
			return;
		EndIf
	EndIf
EndIf
SayTopBottomUnit(UnitMovement)
EndFunction

void function HomeEndMovement(int UnitMovement)
var
	int type
	Let type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0 )
if IsFormsModeActive() then
	if IsFormControl(type)
	|| IsTypeOfEdit(type) then
		if !(type == WT_EDIT_SPINBOX || type == WT_EDITCOMBO) then
			if UnitMovement == UnitMove_First then
				JawsHome()
			ElIf UnitMovement == UnitMove_Last then
				JAWSEnd()
			EndIf
			return
		EndIf
	EndIf
EndIf
HomeEndMovement(UnitMovement)
EndFunction

Script SayActiveCursor()
var
	string sActiveCursorName,
	string title,
	string PageName,
	string PageNumber,
	string TotalPages,
	string LineNumber,
	string CharacterPosition,
	string ColumnNumber,
	string TotalColumns
if IsObjectNavigationActive()
|| IsSameScript() then
	PerformScript SayActiveCursor()
	return
EndIf
if GetActiveCursor() != CURSOR_PC
| ! IsFormsModeActive()
|| IsVirtualPCCursor() then
	PerformScript SayActiveCursor()
	return
EndIf
let sActiveCursorName = FormatString(cmsgFormsModeCursorInfo,cmsgPCCursorActive)
if GetDocumentProperties(title, PageName, PageNumber, TotalPages, LineNumber, CharacterPosition, ColumnNumber, TotalColumns ) then
if !lineNumber then
	let lineNumber = "1"
EndIf
say(formatString(cmsgActiveCursorInfo_L,
		sActiveCursorName, CharacterPosition, LineNumber,
		cscNull, cscNull),
	OT_USER_REQUESTED_INFORMATION)
else
	var
		string sMessageLong,
		string sMessageShort
	let sMessageLong = sMessageLong
		+formatString(cmsgActiveCursorInfo_L,
		sActiveCursorName,
		intToString(GetCursorCol()),
		intToString(GetCursorRow()),
		cscNull, cscNull )
	let sMessageShort = sMessageShort
		+formatString(cmsgActiveCursorInfo_S,
		sActiveCursorName,
		intToString(GetCursorCol()),
		intToString(GetCursorRow()),
		cscNull, cscNull )
	sayMessage(OT_USER_REQUESTED_INFORMATION,sMessageLong,sMessageShort )
EndIf
EndScript

void function SpeakContainingGroupBox(optional int iFocusType)
if !iFocusType
	iFocusType = GetObjectSubTypeCode ()
endIf
if iFocusType != WT_CHECKBOX
&& iFocusType != WT_RADIOBUTTON
	return
EndIf

var int groupBoxLevel = FindAncestorOfType (WT_GROUPBOX)
if (groupBoxLevel == -1) then
	return
EndIf

SayObjectTypeAndText(groupBoxLevel)
EndFunction

Script SayWindowPromptAndText()
if handleNoCurrentWindow() then
	return
endIf

if (MenusActive () == ACTIVE)
 var string menuName = GetMenuName ()
 IndicateControlType (WT_MENU, menuName)
	SayObjectTypeAndText (0)
	return
EndIf
	
SpeakContainingGroupBox()

If IsVirtualPCCursor () then
	PerformScript VirtualSayWindowPromptAndText ()
	return
EndIf

;Since treegrids say objects for the change depth, this block should come before the test for ! ShouldUseDoSayObjectFromLevel.
; And since SayObjecttypeAndText only speaks the treegrid level if it changes, We scope the call for that function to bypass the one in this file,
; and we use the optional param to SayTreeGridLevel so that the level is always spoken.
if FindTreeGridInFocusAncestors()
	default::SayObjectTypeAndText()
	SayTreeGridLevel(true)
	;Only the part of the treegrid containing grid cells will have a column and row index:
	var int nCol, int nRow
	if GetCellCoordinates(nCol, nRow)
		SayUsingVoice (VCTX_message,FormatString (cMSGColumnAndRow, IntToString (nRow), IntToString (nCol)), ot_position)
	endIf
	return
endIf

if ! ShouldUseDoSayObjectFromLevel( globalFocusWindow, globalPrevFocus )
	PerformScript SayWindowPromptAndText();
	return
EndIf

; the following causes table row and column headers to speak with insert + tab
let gBrowserPrevTableRow = 0;
let gBrowserPrevTableCol = 0;

var
	int type0,
	int type1,
	int type2,
	int nLevel
let nLevel = 0
if GetAncestorCount() > 0  then
	let type0 = GetObjectSubTypeCode(SOURCE_DEFAULT, 0 )
	let type1 = GetObjectSubTypeCode(SOURCE_DEFAULT, 1 )
	let type2 = GetObjectSubTypeCode(SOURCE_DEFAULT, 2 )
	if type0 == WT_TABLECELL then
		if type1 == WT_TABLE then
			let nLevel = 1
		elif type2 == WT_TABLE then
			let nLevel = 2
		EndIf
	EndIf ; table cell
	if type0 == WT_MULTILINE_EDIT then
		if type1 == WT_TABLECELL
		&& type2 == WT_TABLE then
			let nLevel = 2;
		EndIf
	EndIf ; multiline edit

if type0 == WT_LISTVIEWITEM
	|| type0 == WT_LISTBOXITEM then
	let nLevel = 1;
	let gsTVPrevPositionInGroup = ""
EndIf ; list

if type0 == WT_TREEVIEWITEM then
	let PreviousTreeviewLevel = -1
	let nLevel = FindAncestorOfType(WT_TREEVIEW)
	let gsTVPrevPositionInGroup = ""
EndIf ;tree

if ( nLevel == 0
&& type1 == WT_TOOLBAR ) then
let nLevel = 1;
EndIf
	;speak the tab container name
	if (nLevel == 0
	&& type1 == WT_TABCONTROL) then
		Say (GetObjectName(SOURCE_DEFAULT, 1), OT_CONTROL_NAME)
	EndIf
EndIf ; ancestors > 0
DoSayObjectTypeAndTextFromLevel( nLevel)
;don't speak tutorial help for paragraphs
if type0 == WT_MULTILINE_EDIT then
	return
EndIf

;do not speak tutor message if this object has describedby text
if (!StringIsBlank (GetDescribedByText ()))
	return
EndIf

; speak tutorial help
var
	int nMode
let nMode=smmTrainingModeActive()
;Any code in HandleCustomWindows should make both
;SayFocusedWindow and insert tab speak consistently.
smmToggleTrainingMode(TRUE)
	SayTutorialHelp (type0, TRUE)
	SayTutorialHelpHotKey (GetCurrentWindow(), TRUE)
	IndicateComputerBraille (getFocus ())
	SpeakProgressBarInfo(TRUE)
	smmToggleTrainingMode(nMode)
;performScript SayWindowPromptAndText()
EndScript

void function DocumentUpdated(int nLineNumberOfChange, int bUserInvoked)
SetUpStuffForNewPage ();Personalized Settings
DocumentUpdated(nLineNumberOfChange, bUserInvoked)
EndFunction

Void Function DocumentLoadedEvent ()
SetUpStuffForNewPage ();Personalized Settings
SpeakPersonalizeSettingsChange ()

var int documentLevel = GetDocumentLevel()
gsDocID = GetIDAtLevel(documentLevel)
DocumentLoadedEvent ()
EndFunction

int function IsMovingByCharacter( int movementUnit )
if ( movementUnit == Unit_Char_Next
|| movementUnit == Unit_Char_Prior )
return true;
EndIf
return false;
EndFunction

int function IsMovingByWord( int movementUnit )
if ( movementUnit == Unit_Word_Next
|| movementUnit == Unit_Word_Prior )
return true;
EndIf
return false;
EndFunction

int function IsMovingByLine( int movementUnit )
if WasMostRecentScriptTableNav()
	;movementUnit is Unit_Cell_UP/Down when up/down arrow goes into a new cell.
	return false
endIf
return movementUnit == Unit_Line_Next
	|| movementUnit == Unit_Line_Prior 
	|| movementUnit ==Unit_Cell_Down
	|| movementUnit ==Unit_Cell_UP
EndFunction

int function IsMovingBySentence( int movementUnit )
if ( movementUnit == Unit_Sentence_Next
|| movementUnit == Unit_Sentence_Prior )
return true;
EndIf
return false;
EndFunction

int function IsMovingByParagraph( int movementUnit )
if ( movementUnit == Unit_Paragraph_Next
|| movementUnit == Unit_Paragraph_Prior )
return true;
EndIf
return false;
EndFunction

int function IsMovingByHomeOrEnd( int movementUnit )
if ( movementUnit == Unit_Line_Start
|| movementUnit == Unit_Line_End )
return true;
EndIf
return false;
EndFunction

int function IsMovingByFirstOrLastLine( int movementUnit )
if ( movementUnit == Unit_Line_First
|| movementUnit == Unit_Line_Last )
return true;
EndIf
return false;
EndFunction

int function IsMovingByPage( int movementUnit )
if ( movementUnit == Unit_Page_Next
|| movementUnit == Unit_Page_Prior )
return true;
EndIf
return false;
EndFunction

int function IsMovingByCell( int movementUnit )
if ( movementUnit == Unit_Cell_Next
|| movementUnit == Unit_Cell_Prior
|| movementUnit == Unit_Cell_Up
|| movementUnit == Unit_Cell_Down)
return true;
EndIf
return false;
EndFunction

void function SayCharacterFromCaretMovedEvent()
let globalSayingCurrentItem = 1
	SayCharacter(1) ;need to say using markup
	let globalSayingCurrentItem = 0
EndFunction

void function SayLineFromCaretMovedEvent(int movementUnit)
var
	int type

let type = GetObjectSubTypeCode(2, 0)
if type == WT_SPINBOX || type == WT_EDIT_SPINBOX then
	return
EndIf

SayLine(0,movementUnit)
IndicateInconsistenciesInRange(CheckLine)
EndFunction

void function SaySentenceFromCaretMovedEvent()
	SaySentence()
EndFunction

void function SayParagraphFromCaretMovedEvent()
	SayParagraph()
	EndFunction

	void function SayHomeOrEndFromCaretMovedEvent()
	if getCharacter()=="\n" then
			say(cmsgBlank1,ot_char)
			return
		endIf
		SayCharacter()
	return
	EndFunction

void function SayTableCellOnCellChangedEvent()
SayCell()
EndFunction

void function TableEnteredEvent(int columns, int rows, int nesting, int col, int row, int uniform, int hasMarkedHeaders, int headersColumn, int headersRow )
var
	string message,
	string caption,
	string summary
let summary = GetTableSummary ()
let caption = GetTableCaption ()

if (!summary) then
	message = FormatString( msgEnteringTable, caption,IntToString ( columns ), IntToString ( rows ) )
else
	message = FormatString( msgEnteringTableWithSummary, caption,IntToString ( columns ), IntToString ( rows ) ,summary)
EndIf
SayMessage( ot_position, message );
endFunction

void function TableExitedEvent()
SayMessage( ot_position, msgLeavingTable);
endFunction

int function ShouldProcessSelectionChangedEvent( optional int source )
if source==INP_BrailleDisplay then
	;prevent speech.
	return false;
endIf
; Sometimes we get a caret event when leaving forms mode. 
;Avoid speaking from that event.
if isVirtualPCCursor() then
	return false
endIf
;don't process selection changed events for list items
var
	int subtype
let subtype = GetObjectSubTypeCode(SOURCE_DEFAULT, 0)
if (subtype == WT_LISTBOXITEM) then
	return false
EndIf
return true;
EndFunction

void function CaretMovedEvent( int movementUnit,optional int source)
if !ShouldProcessSelectionChangedEvent(source) then
	return
EndIf

if shouldSpeakAfterDeletion == true
	SayCharacterFromCaretMovedEvent();
	let shouldSpeakAfterDeletion = false
	return
EndIf

; typing  text
if movementUnit == 0 then
	return
endIf
if NavigationSayValueHook then
	;prevent wrong character from speaking
	;by applying the hook code after the navigation occurs.
	if IsMovingByCharacter(MovementUnit) then
		if NavigationSayValueHook == 1 then
			SayCharacterPhonetic()
		else
			SayCharacterValue()
		EndIf
	EndIf
	return
endIf

If GlobalActiveLayer == TableLayerActive 
	;Must catch table layer active before testing movement type:
	SayTableCellOnCellChangedEvent()
elif ( IsMovingByCharacter( movementUnit ) )
	SayCharacterFromCaretMovedEvent();
elif ( IsMovingByWord( movementUnit ) )
	SayWordFromCaretMovedEvent();
elif ( IsMovingByLine( movementUnit ) )
	SayLineFromCaretMovedEvent(movementUnit);
elif ( IsMovingBySentence( movementUnit ) )
	SaySentenceFromCaretMovedEvent();
elif ( IsMovingByParagraph( movementUnit ) )
	SayParagraphFromCaretMovedEvent();
elif ( IsMovingByHomeOrEnd( movementUnit ) )
	SayHomeOrEndFromCaretMovedEvent();
elif ( IsMovingByFirstOrLastLine( movementUnit ) )
	SayFirstOrLastLineFromCaretMovedEvent( movementUnit == Unit_Line_First );
elif ( IsMovingByPage( movementUnit ) )
	SayPageFromCaretMovedEvent(movementUnit)
elIf ( IsMovingByCell( movementUnit ) )
endIf
endFunction

void function SelectionChangedEvent( string text, int wasTextSelected, optional int source )
if !ShouldProcessSelectionChangedEvent(source) then
	return
EndIf
;return false for edit combos as this over speaks
var
	int subType,
	int parentSubType,
	string sSelectionStateMsg
let subtype = GetObjectSubTypeCode(SOURCE_DEFAULT, 0)
let parentSubType = GetObjectSubTypeCode(SOURCE_DEFAULT, 1)
if IsFormsModeActive()
&& subType == WT_EDIT
&& parentSubType == WT_COMBOBOX then
	let nSaySelectAfter = false
	return false
EndIf
if wasTextSelected then
	let sSelectionStateMsg = cmsg215_l
else
	let sSelectionStateMsg = cmsg214_l
EndIf
If nSaySelectAfter then
	say(text,ot_line,true)
	SayMessage(ot_select,sSelectionStateMsg)
else
	SayMessage(ot_select,sSelectionStateMsg)
	say(text,ot_line,true)
endIf
let nSaySelectAfter = false
EndFunction

void function TextSelectedEvent( string strText, int bUnSelecting, optional  int bContainsSpeechMarkup )
	default::TextSelectedEvent( strText, bUnSelecting, bContainsSpeechMarkup );
EndFunction

void function StyleChangedEvent(string sName)
if StringCompare (sName, gPrevStyle, false) != 0 then
	if StringLength (sName) > 0 && not StringIsBlank (sName) then
		SayMessage(OT_POSITION,sName)
	else
		SayMessage(OT_POSITION,cscNormal)
	EndIf
	let gPrevStyle = sName
	ScheduleFunction ("BrailleStyleChange", 2)
EndIf
EndFunction

Script SayDescribedByText ()
var
	string description
let description = GetDescribedByText ()
Say (description, OT_JAWS_MESSAGE)
EndScript

void function FormsModeEvent( int isEntering, optional int lastMovementUnit )
FormsModeEvent(isEntering)
EndFunction

Void Function BrailleStyleChange ()
if StringLength (gPrevStyle) > 0 && not StringIsBlank (gPrevStyle) then
	BrailleMessage (gPrevStyle, 0)
else
	BrailleMessage (cscNormal, 0)
EndIf
EndFunction

int function UnnamedRegion(int ancestorLevel)
var
	int hasNoName,
	int ancestorType

if (ancestorLevel <= 0) then
	return false
EndIf

let ancestorType = GetObjectSubTypeCode(SOURCE_DEFAULT, ancestorLevel)
if (ancestorType != WT_REGION) then
	return false
EndIf

let hasNoName = StringIsBlank (GetObjectName(SOURCE_DEFAULT, ancestorLevel))
return hasNoName
EndFunction

int function IsSharePointDocument()
var
	string documentPath = GetDocumentPath ()
if !StringContains (documentPath, "sharepoint") then
	return false
EndIf

if !StringContains (documentPath, ".docx") then
	return false
EndIf

return true
EndFunction

int function IsEmptyEditFormField (optional int whitespaceIsText)
var int type = GetObjectSubtypeCode ()
if (type == WT_MULTILINE_EDIT || type == WT_READONLYEDIT || type == WT_EDIT || type == WT_EDITCOMBO)
	if (IsVirtualPCCursor() && !IsFormsModeActive())
		var string text = GetObjectValue ()
		return !text || StringCompare (text, "\160") == 0
	endif
EndIf
	return IsEmptyEditFormField (whitespaceIsText)
endFunction

int function HandleSayObjectForEdit(int level,int subtypeCode, optional int includeContainerName, int drawHighLight)
if level != 0 return false EndIf
;Note that the passed parameter is the subtypeCode, which is more restrictive in how it defines types.
;However, we want to test both subtypeCode and typeCode, the latter of which is less restrictive:
var int typeCode = GetObjectTypeCode()
if typeCode != wt_edit return false endIf
if IsSharePointDocument()
	return true  ;ignore focus events to these edit fields as they cause extra speech
EndIf

var string description = getObjectDescription()
if description == getObjectName()
	description = cscNull
endIf

if subtypeCode == wt_edit
	; special case the Find native to FireFox:
	if (StringCompare(GetObjectName(), wnFind) == 0)
		SayControlEx(GetFocus(), WnFind, GetObjectType(), cscNull, cscNull, cscNull, GetObjectValue())
		if description
			SayUsingVoice(vctx_message, description, OT_CONTROL_DESCRIPTION)
		endIf
		return true
	EndIf
	if StringContains(GetObjectName(), "wyciwyg:")
	&& StringContains(GetObjectName(), "mail.google.com")
		SayControlEx(GetFocus(), cscNull, GetObjectType(), cscNull, cscNull, cscNull, GetObjectValue())
		if description
			SayUsingVoice(vctx_message, description, OT_CONTROL_DESCRIPTION)
		endIf
		return true
	EndIf
EndIf

	var string placeholder = GetObjectPlaceholder ()
var string typeDescription = GetObjectTypeDescription()

if IsEmptyEditFormField()
|| (placeholder && GetObjectValue()==placeholder)
	if typeDescription
		say(GetObjectName(),ot_control_name)
		say(typeDescription, ot_control_type)
	else
		IndicateControlType(subtypeCode, GetObjectName(), cmsgSilent)
	endIf
	IndicateControlState(subtypeCode, (GetObjectStateCode() & ~CTRL_READONLY)) ;subtypeCode for readonly edit will announce that it is read-only.
	SayUsingVoice (vctx_message, cmsgBlank1, ot_line)
	if placeholder
		SayUsingVoice (vctx_message, cmsgPlaceholder, ot_line)
		SayUsingVoice (vctx_message, placeholder, ot_line)
	endIf
	if description
		SayUsingVoice(vctx_message, description, OT_CONTROL_DESCRIPTION)
	endIf
	return true
endIf

if subtypeCode == wt_multiline_edit
	if typeDescription
		say(GetObjectName(),ot_control_name)
		say(typeDescription, ot_control_type)
	else
		IndicateControlType(subtypeCode, GetObjectName(), cmsgSilent)
	endIf
	IndicateControlState(subtypeCode, (GetObjectStateCode() & ~CTRL_READONLY))
	if !(GetRunningFSProducts() == product_MAGic) then
		SayUsingVoice(vctx_message,msgContainsText,ot_line)
	EndIf
	if description
		SayUsingVoice(vctx_message, description, OT_CONTROL_DESCRIPTION)
	endIf
	return true
endIf

SayObjectTypeAndText(0,includeContainerName, drawHighLight)
return true
EndFunction

int function IsDescendedFromExtendedSelectListBoxWithListNotFocused()
var int ancestors = GetAncestorCount()
var int i
for i = 1 to ancestors
	if GetObjectSubtypeCode(SOURCE_DEFAULT,i) == wt_ExtendedSelect_ListBox
		if !(GetObjectMSAAState(i) & STATE_SYSTEM_FOCUSABLE)
			return true
		else
			return false
		endIf
	endIf
endFor
return false
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	int type,
	string sDescribedByText,
	int ancestorType
type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0)
ancestorType = GetObjectSubTypeCode(SOURCE_DEFAULT,nLevel)
if nLevel > 0
&& IsTypeOfRegion(ancestorType)
	if UnnamedRegion(nLevel)
		return
	EndIf
	IndicateControlType (ancestorType, GetObjectName(SOURCE_DEFAULT,nLevel), "")
	return
EndIf
if nLevel == 0
	SpeakSamePageLink()
	if HandleSayObjectForEdit(nLevel,type)
		return
	EndIf
	if IsTypeOfRegion (type)
		var string groupName  = GetObjectName(SOURCE_DEFAULT,0)
		if StringLength (groupName) > 0
			IndicateControlType (type, groupName, "")
			return 
		EndIf
		SayLine ()
		return
	endIf
	;When in forms mode and on a combo box with a multi select list, detect the selected list items:
	if type == wt_ListBoxItem
	&& IsFormsModeActive()
	&& GetObjectMSAAState() & STATE_SYSTEM_SELECTED
	&& IsDescendedFromExtendedSelectListBoxWithListNotFocused()
		IndicateControlState(type,ctrl_selected)
		SayObjectTypeAndText()
		return
	endIf
	;in firefox 4, the changing of the sort attribute does not trigger an MSAA event
	;this means that changing the sort status of column headers in grids does not cause the cached msaa data to be updated
	;this code is a work-around until this is corrected by Mozilla
	if type == WT_COLUMNHEADER
		MSAARefresh ()
		SayObjectTypeAndText (nLevel, includeContainerName, drawHighLight)
		return
	EndIf
	if type == wt_tabControl
		;Do not include the container name if it is a pageTabList, since the groupChangedEvent has already spoken it if it changed:
		includeContainerName = false
	endIf
EndIf
SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
if nLevel == 0
	SayTreeGridLevel()
	if type == WT_TABCONTROL
		IndicateControlState (WT_TABCONTROL, GetControlAttributes ())
	endIf
	if !isVirtualPCCursor() && ShouldItemSpeak(OT_CONTROL_DESCRIPTION)
			sDescribedByText = GetDescribedByText()
		if sDescribedByText
			BrailleMessage(sDescribedByText)
		EndIf
	endIf
EndIf
EndFunction

int function ShouldCallSayFocusedObjectFromSayLine()
var
	int type = GetObjectSubTypeCode()

if (type == WT_PASSWORDEDIT
|| type == WT_EDIT
|| type == WT_BUTTON) then
	return true
EndIf
return false
EndFunction

void function SayLine(optional Int iDrawHighlights, optional int bSayingLineAfterMovement)
var
	string sDescribedByText
if IsJavaWindow(GetFocus ())
&& ShouldCallSayFocusedObjectFromSayLine() then
	SayFocusedObject()
	return
EndIf

SayLine(iDrawHighlights, bSayingLineAfterMovement)
EndFunction

int function IsSelectionChange(int nState, int nOldState)
if (nOldState&CTRL_SELECTED || nState&CTRL_SELECTED) 
&& !(nOldState&CTRL_SELECTED && nState&CTRL_SELECTED) then
	return true
EndIf

return false
EndFunction

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
ClearSayObjectAfterWait()
;handle overspeaking of open/closed in treegrids
if (InATreegrid ()
&& ((nChangedState== CTRL_CLOSED) || (nChangedState == CTRL_OPENED ))) then
	return
EndIf

if ((iObjType == WT_LISTBOXITEM)
&& (nChangedState&(CTRL_CHECKED|CTRL_UNCHECKED))) then
	IndicateControlState(iObjType,(nState & ~ctrl_selected))
	return
EndIf

if ((iObjType == WT_ROW || iObjType == WT_TABLECELL || iObjType == WT_LISTBOXITEM)
&& IsSelectionChange(nState, nOldState))
	if (nState&ctrl_selected)
		sayMessage(ot_item_state,cmsg215_l) ; selected
	else
		sayMessage(ot_item_state,cmsg214_l) ; unselected
	EndIf
	return
EndIf

if ((iObjType == WT_LISTBOXITEM) && (nOldState== CTRL_SELECTED || nState== CTRL_SELECTED) ) then
	return
EndIf

If iObjType == wt_Checkbox then
	IndicateControlState(iObjType,(nState & ~ctrl_selected))
	return
EndIf
If (iObjType == WT_TOGGLE_BUTTON) then
	IndicateControlType (WT_TOGGLE_BUTTON)
	If ( nOldState == CTRL_PRESSED ) then
		IndicateControlState(iObjType, 0, cmsgNotPressed_l )
	Else
		IndicateControlState(iObjType, nChangedState)
	EndIf
	var
		object focus,
		int childID,
		string buttonText

	let focus = GetFocusObject (childid)
	let buttonText = focus.accName(childid)
	Say (buttonText, OT_CONTROL_NAME, false)
	return
EndIf

If (iObjType == WT_RADIOBUTTON)
	SayObjectTypeAndText ()
	return
EndIf

/*
When navigating in some grids, as each cell is focused, it becomes selected. 
This results in speaking selected every time you navigate in such grids.
This block filters out selection of Grid cells in all cases.
I haven't yet seen a grid that allows for selection of cells, so this seems reasonable.
*/
if InARIAGrid ()
&& (iObjType == WT_TABLECELL
|| iObjType == WT_ROWHEADER
|| iObjType == WT_COLUMNHEADER)
&& nState != CTRL_EXPANDED
&& nState != CTRL_COLLAPSED
	return 
EndIf

if iObjType == wt_treeviewItem
	;The state may include both open and expanded, or close and collapsed.
	;Since we don't want to say the same thing two different ways, we remove one of these states if they are both present.
	;Since SayLine speaks open/closed, we remove expanded/collapsed to be consistent.
	if nChangedState & (CTRL_OPENED | CTRL_EXPANDED)
		nChangedState = nChangedState & ~CTRL_EXPANDED
	elif nChangedState & (CTRL_CLOSED | CTRL_COLLAPSED)
		nChangedState = (nChangedState & ~CTRL_COLLAPSED)
	endIf
	IndicatecontrolState(wt_TreeviewItem,nChangedState)
	return
endIf

ObjStateChangedEvent(hObj,iObjType, nChangedState, nState, nOldState)
EndFunction

Int Function InTableCell (int strict)
var
	int i,
	int ancestorCount,
	int type,
	int role

if (!InTable ()) then
	return false
EndIf

let ancestorCount = GetAncestorCount ()
for i = 0 to ancestorCount
	let type = GetObjectSubTypeCode(SOURCE_DEFAULT,i)
	let role=GetObjectRole(i)
if type == WT_TABLECELL
	|| role == ROLE_SYSTEM_CELL
		return true
	EndIf
	if !strict && (type == WT_COLUMNHEADER 
|| role == ROLE_SYSTEM_COLUMNHEADER) then
		return true
	EndIf

	if !strict && (type == WT_ROWHEADER 
|| role == ROLE_SYSTEM_ROWHEADER) then
		return true
	EndIf
EndFor
return false
EndFunction

string function GetWindowTitle()
var
	int numAncestors,
	int currentAncestor,
	int ancestorType,
	int dialogAncestor
numAncestors = GetAncestorCount ()
dialogAncestor = -1
for currentAncestor = 0 to numAncestors
	ancestorType = GetObjectSubTypeCode(SOURCE_DEFAULT, currentAncestor)
	if ancestorType == WT_DIALOG
		dialogAncestor = currentAncestor
	EndIf
EndFor
if dialogAncestor > -1
	return GetObjectName(SOURCE_DEFAULT,dialogAncestor)
else
	return cscNull
endIf
EndFunction

Script SayWindowTitle()
var string title = GetWindowTitle()
BeginFlashMessage()
if title
	Say (title, ot_user_requested_information)
	IndicateControlType (WT_DIALOG)
else
	PerformScript SayWindowTitle()
EndIf
EndFlashMessage()
EndScript

Int Function ShouldSayAncestorAtLevel (int level, int type, int parentType, int focusRole, int focusType)
if level == 1
&& type == WT_FOOTNOTE
&& gFFPrevSubtypeCode1 == type
	return false
endIf
return ShouldSayAncestorAtLevel(level, type, parentType, focusRole, focusType)
EndFunction

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
var
	int iObjType

;in application mode, JAWS basic tutorial help may not be appropriate as the page author is responsible for keyboard control
let iObjType= GetObjectSubTypeCode(SOURCE_DEFAULT, 0)
if (IsInsideARIAApplication() && iObjType == WT_TABCONTROL) then
	return
EndIf

if iObjType == WT_MULTILINE_EDIT 
&& IsSharePointDocument() then
return
EndIf

var
	int iTutorSpeak,
	int iAccessKeySpeak,
	string sCustomTutor
Let iTutorSpeak = ShouldItemSpeak (OT_TUTOR)
Let iAccessKeySpeak = ShouldItemSpeak (OT_ACCESS_KEY)
let iObjType=getWindowSubtypeCode(hwndFocus)
;Not done here, as the events may be out of sync.
;See ForegroundIconicEvent, WindowActivatedEvent, and HandleCustomWindows for usage:
If ! iObjType then
	Let iObjType = GetObjectSubTypeCode ()
EndIf
If nMenuMode > 0 ||
iObjType == WT_CONTEXTMENU ||
iObjType == WT_STARTMENU then
	If nMenuMode != GlobalPrevTutorMenuMode then
		If iTutorSpeak == TUTOR_ALL then
			SayTutorialHelp(iObjType,false)
		EndIf
		Let GlobalPrevTutorMenuMode = GlobalMenuMode; Accurately monitor the state of the menu
	EndIf
	If iAccessKeySpeak == ACCESS_KEY_ALL ||
	iAccessKeySpeak == ACCESS_KEY_MENUS then
		SayTutorialHelpHotKey(hwndFocus,false)
	EndIf
	Return
Else; Speak it, but not twice during the menus.
	Let sCustomTutor = GetFrameTutorMessage ()
	;If sCustomTutor > cScNull then
	If iTutorSpeak == TUTOR_CUSTOM_ONLY then
		SayMessage (OT_TUTOR, sCustomTutor)
	Else
		SayTutorialHelp(iObjType,false)
	EndIf
EndIf
If iAccessKeySpeak == ACCESS_KEY_ALL ||
iAccessKeySpeak == ACCESS_KEY_DIALOGS then
	SayTutorialHelpHotKey(hwndFocus,false)
EndIf
;alert user where contracted input doesn't work:
IndicateComputerBraille (hwndFocus)
Let GlobalPrevTutorMenuMode = GlobalMenuMode; Accurately monitor the state of the menu
EndFunction

void function CrossedTableBoundaryEvent(int iPrevTableIndex, int iPrevTableLevel, int iCurTableIndex, int iCurTableLevel)
if IsInsideARIAApplication ()
|| InAriaGrid()
|| GetGridOrTable() == msgGrid
	return
EndIf
default::CrossedTableBoundaryEvent(iPrevTableIndex, iPrevTableLevel, iCurTableIndex, iCurTableLevel)
EndFunction

Int Function DialogActive (optional int useTopWindowControlType)
if (DialogActive(useTopWindowControlType) == Active) then
	return Active
EndIf

var
	int dialogAncestorLevel

let dialogAncestorLevel = FindAncestorOfType (WT_DIALOG)
if (dialogAncestorLevel > -1)
	return Active
EndIf

return Inactive
EndFunction

Script SelectCurrentItem ()
var
	int parentTypeCode
SayCurrentScriptKeyLabel ()
TypeCurrentScriptKey ()
;get type of parent control
let parentTypeCode = GetObjectSubtypeCode(SOURCE_DEFAULT,1)
if (parentTypeCode==  WT_EXTENDEDSELECT_LISTBOX) then
	Delay (2, true)
	SayLine()
endIf
EndScript

Script RecognizeControl ()
var
	Handle hCurrent = GetCurrentWindow (),
	Int iLeft,
	Int iRight,
	Int iBottom,
	Int iTop,
	Int iPrimary = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int iSecondary = ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int useMicrosoftOcr = ReadSettingInteger (section_OCR, hKey_UseMicrosoftRecognitionLanguageForScreenArea, 0, FT_CURRENT_JCF),
	Int microsoftOcrLanguage = ReadSettingInteger (section_OCR, hKey_MicrosoftRecognitionLanguage, 1033, FT_CURRENT_JCF),
	Int iCanRecognize
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize == OCR_SUCCESS
	If GetWindowRect (hCurrent, iLeft, iRight, iTop, iBottom)
		GlobalOCRJobID = OCRScreenArea (iLeft, iTop, iRight, iBottom, iPrimary, iSecondary, useMicrosoftOcr, microsoftOcrLanguage)
		If (GlobalOCRJobID == 0)
			; Try the parent of the control when OCRScreenArea fails.
			If GetWindowRect (GetParent(hCurrent), iLeft, iRight, iTop, iBottom)
				GlobalOCRJobID = OCRScreenArea (iLeft, iTop, iRight, iBottom, iPrimary, iSecondary, useMicrosoftOcr, microsoftOcrLanguage)
			EndIf
		EndIf
		SayScreenOcrStarted(useMicrosoftOcr)
		Return
	EndIf
Else
	SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
EndIf
EndScript

Script SayNextLine()
PerformScript SayNextLine ()

inWebFeed = InWebFeed()
If IsVirtualPcCursor () then
	NotifyIfContextHelp()
EndIf
EndScript

Script SayPriorLine()
PerformScript SayPriorLine ()

inWebFeed = InWebFeed()
If IsVirtualPcCursor () then
	NotifyIfContextHelp()
EndIf
EndScript

Script SayNextCharacter()
PerformScript SayNextCharacter()

inWebFeed = InWebFeed()
EndScript

Script SayPriorCharacter()
PerformScript SayPriorCharacter()

inWebFeed = InWebFeed()
EndScript

void function ProgressBarChangedEvent(handle hProgress, string sName, string sValue)
var int type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0)

; the following fixes a problem in the downloads window where say line and Braille are not refreshed while downloads are in progress
if ( type == wt_listboxitem
&& IsPCCursor () )
MSAARefresh (false)
BrailleRefresh (0)
EndIf

var
	string domain
domain = GetDomainName ()
if (StringContains (domain, skipProgressUpdatesForDomain)) then
	return
EndIf

ProgressBarChangedEvent( hProgress, sName, sValue )
endFunction

Int Function InATreegrid ()
var
	int type
let type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0)
if (type == WT_TABLECELL) then
	var
		int treegridLevel
	let treegridLevel = FindAncestorOfType (WT_TREEGRID)
	if (treegridLevel >= 0) then
		return true
	EndIf
EndIf

return false
EndFunction

int function FindTreeGridInFocusAncestors()
var int found = FindAncestorOfType(WT_TreeGrid)
if (found == -1) found = 0 endIf
return found
EndFunction

void function SayTreeGridLevel(optional int alwaysAnnounce)
var int treegridAncestorLevel = FindTreeGridInFocusAncestors()
if !treegridAncestorLevel
	;Not in a treegrid:
	SavedLevelInTreegrid = -1
	return
endIf
;The level attribute is reported as 1-based, but JAWS reports the levels to the user as 0-based.
; So in the line for getting the level value, we subtract 1 to get the level int info we want to use.
; Also, the treegrid's child in the ancestory is the row element, and it will have the level attribute for the current row no matter where you are or which row you are on in the tree.
; The grid part of the treegrid contains grid cells, and these grid cells may themselves contain things which cause more nesting.
; Since we know the level of the treegrid at this point, and the level info is obtainable from its child, we use treegridAncestorLevel -1 to indicate which element to get the level info from.
var int Level = StringToInt(GetObjectIA2Attribute ("level", treegridAncestorLevel -1))-1
if AlwaysAnnounce || Level != SavedLevelInTreegrid
	Say(FormatString(cmsg233_L, level), ot_position)
	SavedLevelInTreegrid = Level 
endIf
EndFunction

void function SayAnyObjectState()
var string state = GetObjectState()
if state
	Say(state,ot_item_state)
endIf
EndFunction

void function SayTreeViewItem()
var int state
if InATreegrid ()
	var
		string name,
		string description, 
		int type
	name = GetObjectName(SOURCE_DEFAULT, 0)
	SayMessage (OT_TEXT, name)
	type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0)
	state = GetControlAttributes()& ~CTRL_SELECTED
	IndicateControlState (type, state)
	return
EndIf
if IsFormsModeActive() || (IsPcCursor() && !IsVirtualPcCursor())
	SayObjectActiveItem (!FocusChangeTriggeredByUserNavigation())
	state = GetObjectStateCode()
	if state & CTRL_SELECTED
		indicateControlState(type,CTRL_SELECTED)
	endIf
	description = GetObjectDescription ()
	if description
		Say (description, OT_CONTROL_DESCRIPTION)
	endIf
	return
EndIf
SayTreeViewItem ()
EndFunction

Script Tab ()
inWebFeed = false

if UserBufferIsActive() then
	SayCurrentScriptKeyLabel ()
	if (MoveToControlType (s_next, WT_LINK, true)) then
		SayLine ()
		return
	EndIf
	TabKey ()
	return
EndIf
PerformScript Tab()
EndScript

Script ShiftTab ()
inWebFeed = false

if UserBufferIsActive() then
	SayCurrentScriptKeyLabel ()
	if (MoveToControlType (s_prior, WT_LINK, true)) then
		SayLine ()
		return
	EndIf
	ShiftTabKey ()
	return
EndIf
PerformScript ShiftTab()
EndScript

int function ExitFormsModeHelper()
if ! getJcfOption (OPT_VIRTUAL_PC_CURSOR)
|| !IsFormsModeActive() || !IsPCCursor () then
	return FALSE
EndIf

;do not exit forms mode if we are on a list box item inside an expanded list box
if (GetObjectSubTypeCode(SOURCE_DEFAULT, 0) == WT_LISTBOXITEM) then
	var
		int expandedAncestorLevel

	let expandedAncestorLevel = FindAncestorWithState(CTRL_EXPANDED )
	if (expandedAncestorLevel != -1) then
		var
			int expandedAncestorType
		Let expandedAncestorType = GetObjectSubTypeCode(SOURCE_DEFAULT, expandedAncestorLevel)
		if (expandedAncestorType == WT_LISTBOX
		|| expandedAncestorType == WT_EDITCOMBO) then
			return false
		EndIf
	EndIf
EndIf

if (InARIAGrid ()) then
	var
		int editComboLevel = FindAncestorOfType (WT_EDITCOMBO)
	if (editComboLevel <= 0) then
		return false
	EndIf

	var
		int type
	let type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0)
;we want to return false if this is not a table cell
;or if this is a table cell which supports edit callbacks
	if (type!=WT_TABLECELL
		|| SupportsEditCallbacks ()) then
		return false
	EndIf
EndIf
return ExitFormsModeHelper()
endFunction

void function SelectionContextChangedEvent(int nSelectionContextFlags, int nPrevSelectionContextFlags, int nData1, int nData2,
string sDesc1, string sDesc2, string sDesc3, string sDesc4, string sDesc5)
if !ShouldItemSpeak(OT_CONTROL_DESCRIPTION) then
	return
EndIf

var
	string currentMessage

let currentMessage = sDesc1 + sDesc2

if StringCompare (currentMessage, gPrevField , false) != 0 then
	if StringLength (currentMessage) > 0 && not StringIsBlank (currentMessage) then
		Say(currentMessage,OT_CONTROL_DESCRIPTION)
	else
		say(cmsgLeaving,OT_CONTROL_DESCRIPTION)
		Say(gPrevField ,OT_CONTROL_DESCRIPTION)
	EndIf
	let gPrevField = currentMessage
	ScheduleFunction ("BrailleFieldChange", 2)
EndIf
endFunction

Void Function BrailleFieldChange ()
if StringLength (gPrevField) > 0 && not StringIsBlank (gPrevField) then
	BrailleMessage (gPrevField, 0)
EndIf
EndFunction

int Function HandleFocusInTreeview(handle currentWindow,int changeDepth)
if (changeDepth < 1) then
	return false
EndIf
if (!IsBrowserContentWindow(currentWindow)) then
	return false
EndIf
var
	int type
let type = GetObjectSubTypeCode(SOURCE_DEFAULT, 0)
if (type != WT_TREEVIEWITEM) then
	return false
EndIf
var
	int level,
	int role
let level = changeDepth
while (level > 0)
	let role=getObjectRole (level) 
	if role == ROLE_SYSTEM_GROUPING 
		|| role == ROLE_SYSTEM_OUTLINE 
		|| role == ROLE_SYSTEM_DIALOG then
			SayObjectTypeAndText (level)
	endIf
	let level = level-1
EndWhile
SayTreeViewLevel (true)
return true
EndFunction

int function BrailleAddObjectState(int type)
if (type != WT_RADIOBUTTON) then
	return BrailleAddObjectState(type)
EndIf
var
	int requiredAncestorLevel
requiredAncestorLevel = FindAncestorWithState(CTRL_REQUIRED)
if (requiredAncestorLevel == -1) then
	return BrailleAddObjectState(type)
EndIf
BrailleAddString(BrailleGetStateString (CTRL_REQUIRED),0,0,0)
return false
EndFunction

int function BrailleAddObjectName(int type)
if (type==WT_TREEVIEWITEM) then
	var
		string treeName,
		int treeAncestorLevel
	let treeAncestorLevel = FindAncestorOfType(WT_TREEVIEW)
	let treeName = GetObjectName(SOURCE_DEFAULT,treeAncestorLevel)
	BrailleAddString(treeName,0,0,0)
	return true
EndIf

return BrailleAddObjectName(type)
EndFunction

int Function RSSFeedAvailable()
return (StringContains(GetElementDescription(1,false),scRssFeedAvailable) != 0)
EndFunction

int function CheckForRSSFeedAvailability(int bSpeakOnlyIfChanged)
var
	string sAddress
if RSSFeedAvailable() then
	let sAddress = GetRelevantAddressBarInfo ()
	if bSpeakOnlyIfChanged then
		if sAddress == gsMostRecentRSSFeedPage then
			return false
		EndIf
	EndIf
	;update the page addresses for next time we check to see if the RSS Feed page has changed:
	let gsPriorRSSFeedPage = gsMostRecentRSSFeedPage
	let gsMostRecentRSSFeedPage = sAddress
	return true
EndIf
return false
EndFunction

int function ProcessDocumentLoadAppAlerts()
if CheckForRSSFeedAvailability(false) then
	SayUsingVoice(vctx_message,msgRssFeedavailabilityAnnouncement_S,ot_help)
EndIf
return false
EndFunction

int Function CharacterValueHook (string ScriptName)
if (!SupportsEditCallbacks ()) then
	let NavigationSayValueHook = 0
	return default::CharacterValueHook(ScriptName)
EndIf

if ((ScriptName == "SayNextCharacter")
|| (ScriptName == "SayPriorCharacter")) then
	let NavigationSayValueHook = 2
	return True
endIf

RemoveHook(HK_SCRIPT, "CharacterValueHook")
let NavigationSayValueHook = 0
return True
EndFunction

int Function PhoneticSpellHook (string ScriptName)
if (!SupportsEditCallbacks ()) then
	let NavigationSayValueHook = 0
	return default::PhoneticSpellHook (ScriptName)
EndIf

if ((ScriptName == "SayNextCharacter")
|| (ScriptName == "SayPriorCharacter")) then
	let NavigationSayValueHook = 1
	return true
endIf

RemoveHook(HK_SCRIPT, "PhoneticSpellHook")
let NavigationSayValueHook = 0
return True
EndFunction

int function IsExpandedEditComboBox(int type)
if (type != WT_EDITCOMBO) then
	return false
EndIf

if (!SupportsEditCallbacks ()) then
	return false
EndIf

if (!IsFormsModeActive ()) then
	return false
EndIf

if ((GetControlAttributes (false)& CTRL_EXPANDED) == 0) then
	return false
EndIf

Return true
EndFunction

void function SortOrderChangedEvent(int level,string value)
SayFormattedMessage (OT_NO_DISABLE, msg_sort_changed, value, value)
EndFunction

script SelectAFormField ()
PerformScript SelectAFormField ()
SayObjectTypeAndText (0)
EndScript

void function GetCharacterInfoForBackSpace(string byRef strChar, int byRef ContainsMarkup)
if !StringContains (GetActiveCursorName(), cscFSDomEditCursorName) then
	return GetCharacterInfoForBackSpace(strChar, ContainsMarkup)
EndIf

var
	int row,
	int col,
	string lineNumber,
	string characterPosition 

if GetDocumentProperties("", "","", "", lineNumber,characterPosition, "", "") then
	if !lineNumber then
		lineNumber = "1"
	EndIf
	row = StringToInt (lineNumber)
	col = StringToInt (characterPosition)
EndIf
if (col != 1
|| row != 1) then
	return GetCharacterInfoForBackSpace(strChar, ContainsMarkup)
EndIf

strChar = cMsgBlank1
ContainsMarkup = false
EndFunction

script SayPriorParagraph()
PerformScript SayPriorParagraph()

inWebFeed = InWebFeed()
EndScript

script SayNextParagraph()
PerformScript SayNextParagraph()

inWebFeed = InWebFeed()
EndScript

script SayPriorSentence()
PerformScript SayPriorSentence()

inWebFeed = InWebFeed()
EndScript

script SayNextSentence()
PerformScript SayNextSentence()

inWebFeed = InWebFeed()
EndScript

void function ClearSayObjectAfterWait()
if ScheduledSayObjectAfterWait
	UnscheduleFunction(ScheduledSayObjectAfterWait)
	ScheduledSayObjectAfterWait = 0
endIf
EndFunction

void function SayObjectAfterWait()
ScheduledSayObjectAfterWait = 0
DoSayObjectTypeAndTextFromLevel(GetFocusChangeDepth())
EndFunction

int function MenuProcessedOnFocusChangedEventEx(handle hwndFocus, handle hwndPrevFocus,
	int nType, optional int nChangeDepth)

; Bug 97083 - JAWS not reading correctly in www.anz.com
if GetMenuMode() && nType==wt_link
	say(GetObjectName(), OT_CONTROL_NAME)
	return true
endIf
return MenuProcessedOnFocusChangedEventEx(hwndFocus, hwndPrevFocus, nType, nChangeDepth)
endFunction

int function ShouldAddBasicLayerHelpTextBrowser()
var string class = GetWindowClass(GetFocus())
return class == cwcFireFox4BrowserClass
	|| class == cwcChromeBrowserClass
EndFunction

int function ShouldUseIA2SpecificEditing()
if !IsFormsModeActive ()
	return false
EndIf

var int subType = GetObjectSubTypeCode(SOURCE_DEFAULT, 0)
if subType != WT_EDIT
&& subType != WT_MULTILINE_EDIT
	return false
EndIf

return true
EndFunction

void function DoDelete()
if !ShouldUseIA2SpecificEditing()
	return DoDelete()
EndIf
 	
let shouldSpeakAfterDeletion = true
TypeKey(cksDelete)
EndFunction

Void Function GetTextInfoForControlBackSpace (string ByRef text)
if !ShouldUseIA2SpecificEditing()
	return GetTextInfoForControlBackSpace(text)
EndIf
 	
text = GetPriorWord (false)
EndFunction

Script ControlBackSpace ()
if !ShouldUseIA2SpecificEditing()
	PerformScript ControlBackSpace ()
	return 
EndIf
 	
var	string sText
GetTextInfoForControlBackSpace(sText)
if sText
	SayMessage(ot_line,sText)
endIf
TypeCurrentScriptKey ()
EndScript

Script DeleteWord ()
var
	string text
text = GetWord ()
if text
	SayMessage(ot_line,text)
endIf
TypeCurrentScriptKey ()
EndScript

int function InWebDialog()
var
	int dialogLevel = FindAncestorOfType (WT_DIALOG)
if (dialogLevel != -1) then
	return true
EndIf

return inWebDialog ()
EndFunction

int function IsEditInsideCombo()
if (GetObjectSubTypeCode(2, 0) != WT_EDIT)
	return false
EndIf

if (GetObjectSubTypeCode(2, 1) != WT_COMBOBOX)
	return false
EndIf

return true
EndFunction

void function AncestorStateChangedEvent(handle window, int ancestorLevel)
var
	int ancestorType = GetObjectSubTypeCode(SOURCE_DEFAULT, ancestorLevel)
if InARIAGrid()
&& ancestorType == WT_ROW then
	if GetObjectStateCode (true, ancestorLevel)&CTRL_SELECTED then
		IndicateControlType (WT_ROW, "", "")
		IndicateControlState (WT_ROW, CTRL_SELECTED)
		return
	EndIf
EndIf
EndFunction

void function SpeakAfterMoveToControl(int shouldSetFocus, int sayAllInProgress)
if (GetObjectSubTypeCode(2, 0) != WT_DIALOG) then
	SpeakAfterMoveToControl(shouldSetFocus, sayAllInProgress)
	return
EndIf

if shouldSetFocus
|| sayAllInProgress then
	return
EndIf

SayLine ()
NotifyIfContextHelp ()
EndFunction

void function SpeakAfterMoveToField()
if (GetObjectSubTypeCode(2, 0) != WT_DIALOG) then
	SpeakAfterMoveToField()
	return
EndIf

SayLine()
EndFunction

int function GetDocumentLevel()
var int documentLevel = FindDistantAncestorOfType(WT_DOCUMENT)
return documentLevel
EndFunction

int function GetIDAtLevel(int level)
var int uniqueID = GetObjectIA2UniqueID(level)
return uniqueID
EndFunction

int Function SayNewDocumentTab()
if !IsVirtualPCCursor() && !IsInsideARIAApplication () then
	return false
EndIf

if IsBrowserContentWindow(GlobalFocusWindow) then
	if StringContains(GetActiveCursorName(),cscFSDomCursorName) then
		var int documentLevel = GetDocumentLevel()
		if (documentLevel == -1)
			return false
		EndIf
			
		gsDocID = GetIDAtLevel(documentLevel)
		if gsDocID != gsPrevDocID then
			Say(GetDocumentTitle(),ot_document_name)
			if getObjectRole (1) == ROLE_SYSTEM_GROUPING then
			; current control belongs to a container, described by ARIA.
				say (getObjectName(FALSE, 1), OT_CONTROL_NAME)
			endIf
			SayLine ()
			gsPrevDocID = gsDocID
			return true
		EndIf
	EndIf
EndIf

return false
EndFunction
int function ShouldExitcellChangedEvent()
if SayAllInProgress ()
&& (IsFormsModeActive () || IsPCCursor ())
	return true
EndIf

return ShouldExitcellChangedEvent()
EndFunction

void function MoveToArticle(int which)
MoveToArticle(which)
inWebFeed = InWebFeed()
endFunction

string function getListNestingLevelAnnounceInfo(string settingID)
var int Setting = GetJCFOption (OPT_INDICATE_OUTLINE_LEVEL )
return qsxmlMakeBoolean (settingID, qsxmlMakeBooleanState (Setting))
endFunction

void function setListNestingLevelAnnounceInfo(string settingID, string sxmlWriteRequest, int nWriteDestination)
var
	int nState
parseXMLBooleanWriteRequest (sxmlWriteRequest, nState)
writeSettingInteger (Section_options, "IndicateOutlineLevel", nState, FT_CURRENT_JCF, nWriteDestination)
endFunction

int function SayAndCacheBrailleForBrowserUIDialogNameAndText()
ClearBrlBrowserUIDialogStrings()
if !DialogActive() return false endIf
var int i, int count = GetAncestorCount()
;In case focus lands on the actual dialog, start as level 0:
for i = 0 to count
	if GetObjectSubtypeCode(false,i)	== wt_dialog
	|| GetObjectRole(i) == role_system_dialog
		var string name, string text
		name = GetObjectName(false,i)
		if name
			IndicateControlType(wt_dialog,name)
			brlBrowserUIDialogName = name
		endIf
		text = MSAAGetDialogStaticText()
		if text
			Say(text,ot_dialog_text)
			brlBrowserUIDialogText = text
		endIf
		return true
	endIf
endFor
return false
EndFunction

int function TraverseBrowserUIDialogAndReadControls(object dialog)
if !dialog return false endIf
var object condition = FSUIAContentViewCondition()
var object dialogElements = dialog.findAll(TreeScope_Subtree,condition)
if !dialogElements || !dialogElements.count return false endIf
var string text
if dialog.name
	text = dialog.name
endIf
var
	object o,
	string s
forEach o in dialogElements
	if IsValidForTraverseBrowserUIDialogAndReadControls(dialog.name,o)
		s = o.name
		text = text+"\n"+s
		if o.controlType != UIA_TextControlTypeId
		&& o.controlType != UIA_PaneControlTypeId
		&& o.controlType != UIA_CustomControlTypeId
		&& o.localizedControlType
			s = o.localizedControlType
			text = text+cscSpace+s
		endIf
	endIf
endForEach
Say(text,ot_user_requested_information)
return true
EndFunction

int function ReadBrowserUIDialogBox()
var object element = FSUIAGetFocusedElement()
var object dialog = UIAFindAncestorElementWithRole(element,wt_dialog)
return TraverseBrowserUIDialogAndReadControls(dialog)
EndFunction

void function ClearBrlBrowserUIDialogStrings()
brlBrowserUIDialogName = cscNull
brlBrowserUIDialogText = cscNull
EndFunction

int function OnBrowserUIDialogButton()
;gbIsBrowserUIDialog is set when focus changes.
return gbIsBrowserUIDialog
	&& GetObjectSubtypeCode() == wt_button
EndFunction

int function BrailleCallbackObjectIdentify()
if OnBrowserUIDialogButton()
	return WT_CUSTOM_CONTROL_BASE + wt_CustomBrl_BrowserUIDialogButton
endIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectDlgName(int nSubtypeCode)
if nSubtypeCode == WT_CUSTOM_CONTROL_BASE + wt_CustomBrl_BrowserUIDialogButton
	var string dlgName = GetDialogIdentifier()
	if dlgName
		BrailleAddString(dlgName,0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectDlgName(nSubtypeCode)
EndFunction

int function BrailleAddObjectDlgText(int nSubtypeCode)
if nSubtypeCode == WT_CUSTOM_CONTROL_BASE + wt_CustomBrl_BrowserUIDialogButton
	var string dlgText = MSAAGetDialogStaticText ()
	if dlgText
		BrailleAddString(dlgText,0,0,0)
	return true	
	endIf
endIf
if IsFormsModeActive()
|| IsInsideARIAApplication()
	var string description = GetObjectDescription()
	if description
		brailleAddString(description,0,0,0)
		return true
	endIf
endIf
return BrailleAddObjectDlgText(nSubtypeCode)
EndFunction

Void function GroupChangedEvent(string name)
if GetWindowClass(getFocus()) == cwc_Win10_AltTabWindow
	;Do not announce the running applications group name of the alt-tab list:
	return
endIf
if name
	IndicateControlType(wt_groupBox,name,cmsgSilent)
endIf
EndFunction

Void Function DescriptionChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldDescription, string
	sNewDescription,optional int bFromFocusObject)
if bFromFocusObject
&& IsPCCursor ()
&& sNewDescription == GetObjectName ()
	return;prevent double speaking when text of described by tool tip is same as name
endIf
DescriptionChangedEvent (hwnd, objId, childId, nObjType, sOldDescription, sNewDescription,bFromFocusObject)
EndFunction

void function CellChangedEvent(int NewCol, int NewRow, int NewNesting, int NewRowColCount,
		string ColHeader, string RowHeader, int PrevCol, int PrevRow, int PrevNesting, int PrevRowColCount)
;This event function is triggered when the cursor moves from one cell in a table to a new cell in either the same table or
;a nested table or parent table.
;ShouldExitcellChangedEvent provides a means by which the default CellChangedEvent can be prevented from executing any code.
if ShouldExitcellChangedEvent() return endIf
UpdateTableCache(ColHeader,rowHeader,NewCol,NewRow)
var int SpeakHeadersBeforeContent = ShouldSpeakTableHeadersBeforeCellContent()
if SpeakHeadersBeforeContent
	SayHeaderChangeOnCellChangedEvent(NewCol, NewRow, PrevCol, PrevRow, ColHeader, RowHeader)
	SayTableCellOnCellChangedEvent()
else
	SayTableCellOnCellChangedEvent()
	SayHeaderChangeOnCellChangedEvent(NewCol, NewRow, PrevCol, PrevRow, ColHeader, RowHeader)
endIf
SayColumnAndRowChangeOnCellChangedEvent(NewCol, NewRow, PrevCol, PrevRow)
endFunction

void function GetTableColumnAndRowCounts(int byRef ColumnCount, int byRef RowCount, int byRef visibleColumnCount, int byRef visibleRowCount)
; With the virtual cursor active,
; The builtin functions to get row or column count, as well as get visible row or column count,
; return the values we need:
GetTableColumnAndRowCounts(ColumnCount, RowCount, visibleColumnCount, visibleRowCount)
if IsVirtualPCCursor() return EndIf
var int level = FindAncestorOfType(wt_grid)
if level <= 0
	; Use the values we retrieved earlier:
	return
endIf
; If there are ARIA attributes for row and column count, they tell us the actuall count.
; It looks like the builtin function to get the count are actually returning the visible count when the virtual cursor is off:
var int columnCountAttribute = StringToInt(GetObjectIA2Attribute("colcount",level))
if columnCountAttribute > columnCount
	visibleColumnCount = columnCount
	columnCount = columnCountAttribute
endIf
var int rowCountAttribute = StringToInt(GetObjectIA2Attribute("rowcount",level))
if rowCountAttribute > rowCount
	visibleRowCount = rowCount
	rowCount = rowCountAttribute
endIf
EndFunction

string function GetGridOrTable()
if IsVirtualPCCursor()
	return GetGridOrTable()
EndIf
; Check if it is a grid, or a grid inside a table:
var int gridLevel = FindAncestorOfType(wt_grid)
if gridLevel > 0
	var int tableLevel = FindAncestorOfType(wt_table)
	if tableLevel == -1
	|| (gridLevel < tableLevel)
		return msgGrid
	endIf
endIf
return GetGridOrTable()
EndFunction

int function IsHorizontalMenu()
var
	int level
If GlobalMenuMode == MENU_ACTIVE
	level = FindAncestorOfType (WT_MENUBAR)
	if level
	&& GetObjectIA2State(level) & IA2_STATE_HORIZONTAL
		return true
	endIf
endIf
return IsHorizontalMenu()
endFunction

void function MaxLengthExceededEvent()
beep()
endFunction

script PictureSmartAllInOne (optional int serviceOptions)
var
	string sItemSpec = "//*[@tag='video']",
	object node,
	int fsID, int top, int bottom, int left, int right,
	string url = GetDomainName()

if (StringCompare(url, "www.twitch.tv") == 0)
	node = GetXMLDomDocItem(sItemSpec)
	if node
		fsID = hexToDec(node.attributes.GetNamedItem("fsID").nodeValue)
		if PerformActionOnElementWithID(Action_makeVisible,fsID)
			Pause()
		endIf
		if GetElementRect(fsID, left, top, right, bottom)
			PictureSmartWithAreaShared(serviceOptions, left, top, right, bottom)
			return
		endIf
	endIf
endIf
PerformScript PictureSmartWithControl(serviceOptions)
endScript

void function HandleDetails(string regionType, int enteringRegion)
if (regionType != "details") then
	return
EndIf
	
if (enteringRegion) then
	SayMessage(ot_message, cmsgHasDetails)
EndIf
EndFunction

void function HandleDetailsFor(string regionType, int enteringRegion)
if (regionType != "detailsfor") then
	return
EndIf
	
if (enteringRegion) then
	SayMessage(ot_message, cmsgEnteringDetailsRegion)
EndIf
EndFunction

Void Function RegionBoundaryEvent(string regionType, int enteringRegion)
;if virtual cursor enters or leaves a region, this event is fired.
HandleDetails(regionType,enteringRegion)
HandleDetailsFor(regionType,enteringRegion)
EndFunction

void Function SpeakSamePageLink()
var string fsIDAfter
if IsVirtualPCCursor ()
	fsIDAfter = GetXMLDomNodeFSID (GetFSXMLElementNode ())
else
	fsIDAfter = DecToHex(GetObjectIA2UniqueID (0))
endIf
if (IsVirtualPCCursor ()
&& gSamePageId != cscNull) then
	if (gSamePageId != fsIDAfter) then
		SayFormattedMessage (OT_HELP, msg_MoveToSamePageLink_L, msg_MoveToSamePageLink_S, GetCursorRow ())
	else
		SayMessage(OT_ERROR,		msg_MoveToSamePageLinkFailed)
	EndIf
EndIf
gSamePageId = ""
EndFunction

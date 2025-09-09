;Copyright 2001-2015 by Freedom Scientific BLV Group, LLC
;JAWS script file for Microsoft Office Help 2007 and later

include "common.jsm"
include "HjHelp.jsh"
include "hjconst.jsh"
include "hjglobal.jsh"
include "hhctrl.jsm"
include "MSOffice2007.jsh"
include "CLView.jsh"
include "CLView.jsm"
use "helpSys.jsb"

GLOBALS
	string LastOfficeApplicationConfigName ; from Office.jss, where do we switch back to


int function FocusRedirectedOnFocusChangedEventEx (handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild, int nChangeDepth)
var string focusClass = getWindowClass (hwndFocus)
if ! stringIsBlank (LastOfficeApplicationConfigName) && focusClass != cWcIEServer then
	switchToConfiguration (LastOfficeApplicationConfigName)
	LastOfficeApplicationConfigName = stringLower (LastOfficeApplicationConfigName)
	if stringContains (LastOfficeApplicationConfigName, "word") then
		ScheduleFunction ("SayActivePaneName", 3)
	else
		ScheduleFunction ("SayFocusedObject", 3)
	endIf
	LastOfficeApplicationConfigName = GetActiveConfiguration ()
	return TRUE
endIf
return FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) 
endFunction

Script ScriptFileName ()
ScriptAndAppNames(msgOfficeHelpAppName)
EndScript

Script MoveToNextLink()
MoveToLink(1)
EndScript

Script MoveToPriorLink ()
MoveToLink(0)
EndScript

void Function MoveToLink (int nNext)
if (nNext > 0) then
	TabKey()
else
	ShiftTabKey()
endif
EndFunction

Script SaySelectedLink ()
var
	handle hWnd,
	int iSubType
if IsVirtualPcCursor () then
	giSpeakSmartNavLevel = IsSmartNavActive()
	speakSmartNavLevelSetting()
endIf
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If !iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
SayFocusedObject ()
SayTutorialHelp (iSubType, TRUE)
SayTutorialHelpHotKey (hWnd, TRUE)
EndScript

void Function ReportLinksNotAvailable(optional int reason)
If (product_MAGic == GetRunningFSProducts())
	ExMessageBox(cmsgMagNoLinks_L, SelectALinkDialogName, MB_OK)
	return
EndIf
SayFormattedMessage (ot_error, msg3_L, msg3_S) ;"No links found on page "
EndFunction

void Function NewSelectLink ()
if (!DlgListOfLinks()) then
	ReportLinksNotAvailable(NotAvailableReason_NotFound)
endif
EndFunction

int function SelectALinkDialog()
var
	object doc,
	object links,
	object all,
	int nLinks,
	string buffer,
	string strTemp,
	int nIdx
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return true
endif
if (IsVirtualPcCursor ()) then
	NewSelectLink ()
	return true
endif
let doc = ie4GetCurrentDocument ()
let links = doc.links
let all = doc.all
let nLinks = links.length
if (nLinks == 0) then
	SayMessage (ot_error, msgPageHasNoLinks, cMsgNoLinks)
	return true
endif
let nIdx = 0
while (nIdx < nLinks)
	let strTemp = links(nIdx).InnerText
	if (!strTemp) then
		let strTemp = all(links(nIdx).SourceIndex+1).alt
	endif
	if (!strTemp) then
		let strTemp = links(nIdx).href
	endif
	let buffer = buffer + scVerticleBar  + strTemp
	let nIdx = nIdx+1
EndWhile
let nIdx = DlgSelectItemInList (buffer, scSelectLink , true)
if (nIdx == 0) then
	return true
endif
doc.links(nIdx-1).click
return true
EndFunction

void Function ieFocusToFirstField ()
var
	object doc,
	object all,
	object forms,
	int nIdx,
	object element,
	string theType
let doc = ie4GetCurrentDocument()
if (!doc) then
	return FALSE
endif
let forms = doc.forms
if (forms.length <= 0 ) then
	return FALSE
endif
let nIdx = forms(0).SourceIndex()
let all = doc.all
while (nIdx < all.length)
	let element = all(nIdx)
	let TheType = element.type
	if (TheType != "" && TheType != scHidden ) then
		element.focus
		return TRUE
	endif
	let nIdx = nIdx+1
endwhile
return FALSE
EndFunction

Script FocusToFirstField ()
if (ieFocusToFirstField()) then
	Beep()
	ProcessNewText()
else
	SayMessage (ot_error, msg4_L, msg4_S) ;"Input field not found"
endif
EndScript

int function InTableOfContentsTree(handle hWnd)
var
	handle hTemp
if GetWindowClass(hWnd) == wc_NetUIhWnd then
	let hTemp = GetParent(GetParent(hWnd))
	if hTemp then
		if GetWindowClass(hTemp) == wc_MSOWorkPane then
			if StringCompare(GetWindowName(hTemp),wn_TableOfContents) == 0 then
				return true
			EndIf
		EndIf
	EndIf
EndIf
return false
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd,
	int iSubtype
let hWnd = GetCurrentWindow()
let iSubtype = GetObjectSubtypeCode()
If iSubType==wt_ListBox
&& GetObjectName()==wn_Search Then
	IndicateControlType(iSubType,GetObjectName(TRUE),cscSpace)
	Return
EndIf
if !iSubtype then
	if GetWindowClass(hWnd) == cwcIEServer then
		SayLine()
		return
	EndIf
ElIf iSubtype == wt_TreeViewItem then
	if InTableOfContentsTree(hWnd) then
		let gbInTableOfContentsTree = true
		IndicateControlType(wt_TreeView,wn_TableOfContents,cscSpace)
		BrailleRefresh()
		SayTreeViewLevel(false)
		return
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

int function FocusToSearchEditFromMenuBar (handle hFocus)
var handle hWnd
hWnd = getParent (hFocus)
while (getParent (hwnd))
	hwnd = getParent (hWnd)
endWhile
hwnd = findWindow (hWnd, "RichEdit20W")
if (hwnd)
	setFocus (hwnd)
	return TRUE
else
	return FALSE
endIf
endFunction

Void Function MenuModeEvent (handle WinHandle, int mode)
var
	handle hFocus
hFocus = getFocus ()
;only overwriting menuModeEvent rather than MenuBarActiveProcessed,
;because we don't want any globals set, and won't do any custom menu processing.
;There is an erroneous menu bar focus problem that JAWS shouldn't even think is a menu bar.
;winHandle can be, and often is, 0 in these instances, hence using call to getFocus
if (mode >= 1
&& getWindowClass (hFocus) == cwcIEServer)
	if (FocusToSearchEditFromMenuBar (hFocus))
		return TRUE
	endIf
endIf
return MenuModeEvent (WinHandle, mode)
endFunction

int function FocusRedirected(handle FocusWindow, handle PrevWindow)
var
	handle hTemp
if GetWindowClass(FocusWindow) == wc_CLViewServer12 then
	;this is the top level app window,
	;we want focus to go to the IEServer window:
	let hTemp = FindWindow(FocusWindow,cwcIEServer)
	if hTemp then
		SetFocus(hTemp)
		return true
 	EndIf
EndIf
return false
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
if FocusRedirected(FocusWindow,PrevWindow) then
	return
EndIf
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let gbInTableOfContentsTree = false
FocusChangedEvent(FocusWindow,PrevWindow)
;For when the application first gains focus and the menubar is activated in error on the search edit field:
if !GetMenuMode()
&& !UserBufferIsActive()
&& getWindowClass(focusWindow)==cwc_richEdit20w then
	setFocus(focusWindow)
endIf
EndFunction

int function OnToolBar()
var
	handle hWnd
let hWnd = GetFocus()
if GetWindowClass(hWnd) != cwcMsoCmd then
	return false
EndIf
if StringCompare(GetWindowName(hWnd),wn_Standard) == 0 then
	return true
EndIf
return false
EndFunction

int function BrailleAddObjectName(int iSubtype)
if iSubtype == wt_TreeViewItem then
	if gbInTableOfContentsTree then
		BrailleAddString(wn_TableOfContents,0,0,0)
		return true
	EndIf
ElIf iSubtype == wt_Button
|| iSubtype == wt_ButtonMenu then
	if OnToolBar() then
		BrailleAddString(GetObjectName(),GetCursorCol(),GetCursorRow(),0)
		return true
	EndIf
EndIf
return BrailleAddObjectName(iSubtype)
EndFunction

int function BrailleAddObjectState(int iSubtype)
If iSubType == WT_TREEVIEW
|| iSubType == WT_TREEVIEWITEM then
	;the value already contains the state, don't double show the Open state.
	return true
EndIf
return BrailleAddObjectState(iSubtype)
EndFunction

Void Function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
Var
	string sKeyName
if StringLength(strKeyName)>1 then
	let sKeyName=strKeyName
EndIf
if sKeyName==cksUpArrow
|| sKeyName==cksDownArrow then
	let gbUpDownNavigation=true
else
	let gbUpDownNavigation=false
EndIf
ProcessKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
EndFunction

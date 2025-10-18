;JAWS Help System feature Support
; Copyright 2001-2015 by Freedom Scientific, Inc.
; Used to speak/Braille treeviews of books and topics as well as the Index and Search
;pages of the HTML Help Systems correctly
; This module should be used by hhctrl.jss, msoHelp.jss and windows help.jss and
;any other script file which implements support for a similar help system.
;This module overrides any functions necessary to provide transparent support
;for the Help System, ie so minimal script changes need be made to the script
;files which use this module's binary.
;This module implements screen sensitive help for controls in the Help System.

include "hjconst.jsh"
include "hjglobal.jsh"
include "helpSys.jsm"
include "common.jsm"
include "ie.jsm"
globals
int iTrigger, ; avoid doublespeaking when treeview first gets focus
int giSuppressHighlightedTextHlp

const
ie5Class = "internet explorer_server",
systab_control = "SysTabControl32",
tab_control = 1007,
sc_IE_App = "browseui.dll"

handle Function GetTabControl ()
var
	string sApp, ; name of application executable file.
	handle WinHandle
	let sApp = GetAppFileName ()
; the following test fixes a problem with IE help not announcing the Topic or book.
; the FindDescendantWindow function was not finding the control and return a value of zero.
; By using the application executable name, we fix this problem.
if (sApp == sc_IE_App) Then
	let WinHandle = GetParent (GetFocus ())
	else
	let WinHandle = FindDescendantWindow (GetAppMainWindow (GetFocus ()), tab_control)
EndIf
if (winHandle && GetWindowClass (winHandle) == systab_control) then
	return winHandle
EndIf
return 0
EndFunction

string Function GetHelpTabName ()
var
	handle hWnd,
	string strName
If DialogActive () then
	Return cscNull
EndIf
let hWnd = GetTabControl ()
if ! hWnd then
	return cscNull
EndIf
/*
SaveCursor ()
InvisibleCursor ()
MoveToWindow (hWnd)
let strName = GetObjectName ()
RestoreCursor ()
*/
Let strName = GetWindowName (hWnd)
return strName
EndFunction

Int Function IsSearchOrIndexWindow (handle hWnd, int iShouldSpeak)
;The control iD constants here exist in the Help controls in all help systems checked,
; including Windows 98 help.
var
	int iControl

Let iControl = GetControlID (hWnd)
;Return the control iD so we know it needs special attention
If iControl == ID_INDEX_EDIT then
	If iShouldSpeak then
		SayControlExWithMarkup (hwnd, msgIndexEdit, getObjectType())
	EndIf
	Return iControl
ElIf iControl == ID_INDEX_LIST then
	If iShouldSpeak then
		SayControlExWithMarkup (hwnd, msgIndexList, getObjectType())
	EndIf
	Return iControl
ElIf iControl == ID_INDEX_BUTTON then
	If iShouldSpeak then
		SayWindowTypeAndText (hWnd)
	EndIf
	Return iControl
elif iControl==ID_indexTopicsFound then
	If iShouldSpeak then
		SayControlExWithMarkup (hwnd, msgTopicsFound, getObjectType())
	EndIf
	Return iControl
ElIf iControl == ID_SEARCH_EDIT then
	If iShouldSpeak then
		SayWindowTypeAndText (hWnd)
	EndIf
	Return iControl
ElIf iControl == ID_SEARCH_BUTTON then
	If iShouldSpeak then
		SayWindowTypeAndText (hWnd)
	EndIf
	Return iControl
ElIf iControl == ID_SEARCH_LISTVIEW then
	If iShouldSpeak then
		SayControlExWithMarkup (hwnd, msgSearchList, getObjectType())
	EndIf
	Return iControl
Else
	Return 0;
EndIf
EndFunction

string Function GetTreeObjectName (); Get the name at point for tree item
var
	int iChild,
	object OBJ,
	object NULL,
	string strName
let OBJ = GetObjectAtPoint (iChild, GetCursorCol (), GetCursorRow ())
Let strName = OBJ.accname(iChild)
let OBJ = NULL
If ! strName then
	Let strName = GetWindowText (GetFocus (), TRUE)
EndIf
Return strName
EndFunction

string Function ConvertAttribToState (int iAttrib)
var
	string sState
if iAttrib & ctrl_opened then
	Let sState = scOpen
ElIf iAttrib & CTRL_CLOSED then
	Let sState = scClosed
Else
	let sState = cscNull
EndIf
Return sState;
EndFunction

void function sayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	int iAttributes,
	int iChild,
	object oHelpTree,
	string sChildName,
	string sState,
	int iSubtype
if !InHJDialog() then
	let iSubtype = getObjectSubTypeCode()
	if iSubtype == wt_treeview
	|| iSubtype == WT_TREEVIEWITEM then
		;say(getObjectType(),ot_control_type)
		Say (GetWindowType (GetFocus ()), OT_CONTROL_TYPE)
		Let iAttributes = GetControlAttributes ()
		Let sState = ConvertAttribToState (iAttributes)
		Let sChildName = GetTreeObjectName ()
		if stringContains(sState,scOpen) || stringContains(sState,scClosed) then
			say(formatString(msgBook, sChildName, sState), ot_control_name)
		else
			say(formatString(msgTopic, sChildName), ot_control_name)
		endIf
		SayFormattedMessage(OT_POSITION, PositionInGroup())
		let iTrigger=true ; sayObjectTypeAndText() has been triggered
	elif !isSearchOrIndexWindow(getFocus(),true) then
		sayObjectTypeAndText(nLevel,includeContainerName)
	endIf
else
	sayObjectTypeAndText(nLevel,includeContainerName)
EndIf
endFunction

void Function SayTreeViewLevel(int IntelligentPositionAnnouncement)
var
	string sMessage,
	int iLevel,
	int bLevelChanged,
	int iAttributes,
	string sState,
	string sChildName,
	string sLevel
if InHJDialog() then
	SayTreeViewLevel(IntelligentPositionAnnouncement)
	return
EndIf
If (GetTreeViewLevel() != PreviousTreeviewLevel) then
	let bLevelChanged = true
	let iLevel = GetTreeviewLevel()
	let sLevel = IntToString (iLevel)
	let sMessage = FormatString (cmsg233_L, sLevel)
	SayMessage (OT_POSITION, sMessage, sLevel) ; "level "
	let PreviousTreeViewLevel= iLevel
endIf
If ! IsPcCursor () then
	SayLine ()
	Return
EndIf
;The Default behavior uses GetObjectValue.
; However, the item name is stored in GetObjectName in this case.
Let iAttributes = GetControlAttributes ()
Let sState = ConvertAttribToState (iAttributes)
;Let sChildName = GetTreeObjectName ()
Let sChildName = GetObjectName(true)
if stringContains(sState,scOpen) || stringContains(sState,scClosed) then
	say(formatString(msgBook, sChildName, sState), ot_control_name)
else
	say(formatString(msgTopic, sChildName), ot_control_name)
endIf
if IntelligentPositionAnnouncement
&& !bLevelChanged then
	;we don't want to announce the position.
	return
EndIf
SayMessage(OT_POSITION, PositionInGroup())
EndFunction

void function sayLine(optional int HighlightTracking, optional int bSayingLineAfterMovement)
var
	int iAttributes,
	int iChild,
	object oHelpTree,
	string sChildName,
	string sState
If ! IsPcCursor () || GlobalMenuMode then
	SayLine (HighlightTracking,bSayingLineAfterMovement)
	Return
EndIf
if getObjectSubTypeCode()==wt_treeview ||
GetObjectSubTypeCode () == WT_TREEVIEWITEM then
	if iTrigger then
		; The function sayObjectTypeAndText has been triggered immediately before
		;sayLine with no intervening action, ie would cause double speaking
		let iTrigger=false
		return
	endIf
	If GetHelpTabName () != scContents then
		SayLine (HighlightTracking,bSayingLineAfterMovement)
		Return
	EndIf
	Let iAttributes = GetControlAttributes ()
	Let sState = ConvertAttribToState (iAttributes)
	;Let sChildName = GetTreeObjectName ()
	Let sChildName = GetObjectName(true)
	if stringContains(sState,scOpen) || stringContains(sState,scClosed) then
		say(formatString(msgBook, sChildName, sState), ot_control_name)
	else
		say(formatString(msgTopic, sChildName), ot_control_name)
	endIf
	SayFormattedMessage(OT_POSITION, PositionInGroup())
else
	sayLine(HighlightTracking,bSayingLineAfterMovement)
endIf
endFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
; any key should reset the trigger
let iTrigger=false
if nIsScriptKey then
    let giSuppressHighlightedTextHlp=TRUE
else
    let giSuppressHighlightedTextHlp=FALSE
endIf
return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
endFunction

script screenSensitiveHelp()
; Screen Sensitive help override for Search and Index page of Help system
var
int iControl,
int iWinType,
int iLinkCount,
int iHeadingCount,
int nLevel,
string sHeadingNum,
string sClass,
handle hFocus,
string sTemp_L,
string sTemp_S
let hFocus=getFocus()
let iControl=isSearchOrIndexWindow(hFocus, false)
let sClass=getWindowClass(hFocus)
let iWinType = GetWindowSubTypeCode (hFocus)
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
if iControl then
	if iControl==ID_INDEX_EDIT then ;
		sayFormattedMessage(ot_USER_BUFFER,  msgIndexEditHelp)
		AddHotKeyLinks()
		return
	elif iControl==	ID_INDEX_LIST then
		sayFormattedMessage(ot_USER_BUFFER,  msgIndexListHelp)
		AddHotKeyLinks()
		return
	elif iControl==	ID_INDEX_BUTTON then
		sayFormattedMessage(ot_USER_BUFFER,  msgIndexDisplayHelp)
		AddHotKeyLinks()
		return
	elif iControl==ID_IndexTopicsFound then
		sayFormattedMessage(ot_USER_BUFFER,  msgTopicsFoundHelp)
		AddHotKeyLinks()
		return
	elif iControl==ID_SEARCH_EDIT then
		sayFormattedMessage(ot_USER_BUFFER,  msgSearchEditHelp)
		AddHotKeyLinks()
		return
	elif iControl==ID_SEARCH_BUTTON then
	sayFormattedMessage(ot_USER_BUFFER,  msgSearchListTopicsHelp)
	AddHotKeyLinks()
	return
	elif iControl==ID_SEARCH_LISTVIEW then
		sayFormattedMessage(ot_USER_BUFFER,  msgSearchResultsHelp)
		AddHotKeyLinks()
		return
	elif iControl==id_SearchDisplayButton then
		sayFormattedMessage(ot_USER_BUFFER,  msgSearchDisplayHelp)
		AddHotKeyLinks()
		return
	endIf
elif sClass == ie5Class then
	if iWinType==0 then
	; in the text of a help topic
		let iLinkCount=getLinkCount()
		;sayFormattedMessage(ot_help, msgHelpTopicText)
		let sTemp_L = msgHelpTopicText + cScBufferNewLine
		if iLinkCount > 1 then
			;sayFormattedMessage(ot_help, formatString(msgWithLinks, intToString(iLinkCount)))
			let sTemp_L = sTemp_L + formatString(msgWithLinks, intToString(iLinkCount))
		elif iLinkCount==1 then
			;sayFormattedMessage(ot_help, msgOneLink)
			let sTemp_L = sTemp_L + msgOneLink
		else ; no links
			;sayFormattedMessage(ot_help, msgNoLinks)
			let sTemp_L = sTemp_L + msgNoLinks
		endIf
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
		if sHeadingNum!=cscNull then
		let sTemp_L=sTemp_L+cScBufferNewLine+sHeadingNum+cScBufferNewLine+formatString(msgHelpTopicHeadingHelp)
		endIf
	elif iWinType==wt_link then
		;sayFormattedMessage(ot_help, msgHelpTopicLink)
		let sTemp_L = sTemp_L + msgHelpTopicLink
	elif iWinType==WT_THISPAGE_LINK then
		;sayFormattedMessage(ot_help, msgHelpTopicSamePageLink)
		let sTemp_L = sTemp_L + msgHelpTopicSamePageLink
	else
		ScreenSensitiveHelpVirtualCursor (iWinType)
		return
	EndIf
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L)
	AddHotKeyLinks()
	return
elif iWinType==wt_treeview then
	sayFormattedMessage(ot_USER_BUFFER, formatString(msgTreeviewHelp, intToString(getTreeviewLevel())))
	AddHotKeyLinks()
else
	performScript screenSensitiveHelp() ;default
endIf
	endScript

int function BrailleAddObjectValue(int nSubtypeCode)
var
	string sName,
	int iCol,
	int iRow,
	int iAttr,
	string sState
If nSubtypeCode == WT_TREEVIEW ||
nSubtypeCode == WT_TREEVIEWITEM then
	let sState=ConvertAttribToState (GetControlAttributes ())
	let iCol=getCursorCol()
	let iRow=getCursorRow()
	let iAttr=getCharacterAttributes()
	let sName = GetObjectName(true)
	if stringContains(sState,scOpen) || stringContains(sState,scClosed) then
		brailleAddString(formatString(msgBrlBook, sName, sState), iCol, iRow, iAttr)
	else
		brailleAddString(formatString(msgBrlTopic, sName), iCol, iRow, iAttr)
	endIf
	Return TRUE
EndIf
return BrailleAddObjectValue (nSubTypeCode)
endFunction

/*
LEGACY!

int function BrailleBuildTreeview()
var
string sState,
int iCol,
int iRow,
int iAttr
; assumes we're on a treeview so doesn't check control type again.
brailleAddString(getObjectType(),0,0,0)
brailleAddString(intToString(getTreeviewLevel()),0,0,0)
let sState=ConvertAttribToState (GetControlAttributes ())
let iCol=getCursorCol()
let iRow=getCursorRow()
let iAttr=getCharacterAttributes()
if stringContains(sState,scOpen) || stringContains(sState,scClosed) then
	brailleAddString(formatString(msgBrlBook, GetTreeObjectName (), sState), iCol, iRow, iAttr)
else
	brailleAddString(formatString(msgBrlTopic, GetTreeObjectName ()), iCol, iRow, iAttr)
endIf
return true
endFunction

int Function BrailleBuildOther (int WindowSubTypeCode)
var
handle hFocus,
handle hFirst,
int iControl,
int iCol,
int iRow,
	string strObjValue
Let iCol = GetCursorCol ()
Let iRow = GetCursorRow ()
let hFocus=getFocus()
if windowSubtypeCode==wt_treeview then
;Braille page name
	brailleAddString(formatString(cmsg230_L, getWindowName(getParent(hFocus))),0,0,0)
	return brailleBuildTreeview()
elif isSearchOrIndexWindow(hFocus, false) then
;two possible windows could contain the page name, need to check which one to
;Braille
	let hFirst=getFirstWindow(hFocus)
	if getWindowSubTypecode(hFirst)==wt_tabControl then
		brailleAddString(formatString(cmsg230_L, getWindowName(hFirst)),0,0,0)
	elif getWindowSubtypeCode(getNextWindow(hFirst))==wt_tabControl then
		brailleAddString(formatString(cmsg230_L, getWindowName(getNextWindow(hFirst))),0,0,0)
	endIf
	Let iControl = GetControlID (hFocus)
	If iControl == ID_INDEX_EDIT then
		brailleAddString(msgIndexEdit,0,0,0)
		brailleAddString(getObjectType(), 0,0,0)
		brailleAddFocusItem()
	ElIf iControl == ID_INDEX_LIST then
		brailleAddString(msgIndexList, 0,0,0)
		brailleAddString(getObjectType(), 0,0,0)
		brailleAddFocusItem()
	elif iControl==ID_indexTopicsFound then
		brailleAddString(msgTopicsFound, 0,0,0)
		brailleAddString(getObjectType(), 0,0,0)
			brailleAddFocusItem()
	ElIf iControl == ID_SEARCH_LISTVIEW then

		brailleAddString(msgSearchList,0,0,0)
		brailleAddString(getObjectType(), 0,0,0)
			brailleAddFocusItem()
	elif windowSubtypeCode==wt_button then
		brailleAddString(getObjectName(),0,0,0)
		brailleAddString(getObjectType(),0,0,0)
		return true
	else
		brailleAddString(getObjectName(),0,0,0)
		brailleAddString(getObjectType(),0,0,0)
		brailleAddFocusItem()
	endIf
	return true
else
return BrailleBuildOther(WindowSubtypeCode) ; default
endIf
endFunction
*/
/*void function sayCurrentHeading()
SayFormattedMessage(ot_line, GetCurrentHeading())
if GetJCFOption(optHeadingIndication)==2 then
	SayFormattedMessage(ot_line, formatString(cmsg233_L,IntToString(GetCurrentHeadingLevel())))
endIf
endFunction*/

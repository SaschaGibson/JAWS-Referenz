;JAWS script file for Microsoft Windows 98 Help
;Copyright 1998-2021 by Freedom Scientific BLV Group, LLC
;version 6.00
;
;****************************************
;*	        Written By		*
;*	Freedom Scientific Scripting	*
;*		Team Gold		*
;****************************************
; build 600165 last modified on October 27, 2004 by Olga Espinola


include "Windows Help.jsh"
include "common.jsm"
include "HjHelp.jsh"
include "hjconst.jsh"
include "hjglobal.jsh"
include "hhctrl.jsm"
use "helpSys.jsb" ; added by JKS to support new Help System features

globals
	string GlobalPrevPageName

handle Function GetTabControl ()
var
	handle WinHandle
let WinHandle = FindDescendantWindow (GetAppMainWindow (GetFocus ()), tab_control)
if (winHandle && GetWindowClass (winHandle) == scSysTabControl32) then
	return winHandle
endif
return 0
EndFunction

String Function GetHelpPageName ()
var
	handle hWnd,
	string strName
let hWnd = GetTabControl ()
if ! hWnd then
	return scNull
endif
SaveCursor ()
InvisibleCursor ()
MoveToWindow (hWnd)
Let strName = GetObjectName ()
RestoreCursor ()
Return strName
EndFunction

Function AutoStartEvent ()
let ieVersion = GetIEVersion ()
if (Win98HlpFirstTime == 0) then
	let Win98HlpFirstTime = 1
	if (GetFileDate (GetAppFilePath ()) >= scHelpFileDate)
	&& (getRunningFSProducts () & product_JAWS) then
		SayFormattedMessage (ot_app_start, msg9_L, msg9_S)
	else
		SayFormattedMessage (ot_app_start, msg10_L, msg10_S)
	endif
endif
EndFunction

void Function AutoFinishEvent ()
let GlobalPrevPageName = ScNull
EndFunction

void function SayHighlightedText (handle hWnd, string buffer)
If IsVirtualPcCursor () then
	Return;Do not over-speak.
EndIf
SayHighlightedText (hWnd, buffer)
EndFunction

int function BrailleAddObjectName(int nSubtypeCode)
If nSubTypeCode == WT_TREEVIEW ||
nSubTypeCode == WT_TREEVIEWITEM then
	If ! IsSearchOrIndexWindow (GetFocus (), FALSE) then
		BrailleAddString (GetHelpPageName (),0,0,0)
		Return TRUE
	EndIf
EndIf
return BrailleAddObjectName (nSubTypeCode)
EndFunction

	Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
		handle prevHwnd, int prevObjectId, int prevChildId)
	; Customized to avoid double speaking when using Up/Down arrow in treeview of Contents pane.
	; Double speaking will occur if the default SayPriorLine and SayNextLine call SayTreeViewLevel
	; and ActiveItemChangedEvent calls SayObjectActiveItem.
	;if GetWindowSubtypeCode(CurHWnd)!=wt_TreeView then
	;Object Child = WT_TREEVIEWITEM but we don't need to check it's id, just subtype
	If GetObjectSubTypeCode ()!=WT_TREEVIEWITEM then
		SaveCursor ()
		PCCursor ()
		SayObjectActiveItem()
		RestoreCursor ()
	EndIf
	EndFunction

int Function GetIEVersion ()
var
	string versionInfo,
	int period,
	string substring
let versionInfo = GetVersionInfoString (GetAppFilePath (), scProductversion)
let period = StringContains (versionInfo, scPeriod)
if ! period then
	if StringToInt (versionInfo) > 3 then
		return ie4
	else
		return ie3
	endif
endif
let substring = SubString (versionInfo, 1, period-1)
if StringToInt (substring) <= 3 then
	return ie3
elif StringToInt (substring)  == 4 then
	let substring = SubString (versionInfo, period+1, 2)
	if (StringToInt (substring) > 70) then
		return ie4
	else
		return ie3
	endif
else
	return ie4
endif
EndFunction

Script ScriptFileName ()
ScriptAndAppNames (msgScriptKeyHelp2)
EndScript

Script MoveToNextLink()
MoveToLink(1)
EndScript

Script MoveToPriorLink ()
MoveToLink(0)
EndScript

Script ReadCurrentScreen ()
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if IsVirtualPcCursor () then
	Performscript StartSkimRead()
	;SayFormattedMessage (OT_error, cmsgHTML5_L, cmsgHTML5_s); "not available in virtual PC cursor mode"
	return
endif
MoveToWindow (GetFocus())
RestrictCursor (on)
SayAll ()
EndScript

Script ReadNextScreen ()
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
let nSuppressEcho = TRUE
PCCursor ()
JAWSPageDown ()
Delay (2)
let nSuppressEcho = FALSE
PerformScript ReadCurrentScreen()
EndScript

Script ReadPriorScreen ()
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
let nSuppressEcho = TRUE
PCCursor ()
JAWSPageUp ()
Delay (2)
let nSuppressEcho = FALSE
PerformScript ReadCurrentScreen()
EndScript

Script ReadDownColumn ()
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if IsJAWSCursor () then
	NextLine ()
	SayChunk ()
else
	PerformScript ControlDownArrow()
endif
EndScript

Script ReadUpColumn ()
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if IsJAWSCursor () then
	PriorLine ()
	SayChunk ()
else
	PerformScript ControlUpArrow()
endif
EndScript

Script ReadColumnLeft ()
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if IsJAWSCursor () then
	PriorChunk ()
	;scRightBracket ="]"
	while (GetCharacter() == scNULL) || (GetCharacter() ==scRightBracket)
		PriorChunk ()
	endwhile
	SayChunk ()
else
	PerformScript SayPriorWord()
endif
EndScript

Script ReadColumnRight ()
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if IsJAWSCursor () then
	NextChunk ()
	;scRightBracket ="]"
	while (GetCharacter() == scNULL) || (GetCharacter() ==scRightBracket)
		NextChunk ()
	endwhile
	SayChunk()
else
	PerformScript SayNextWord()
endif
EndScript

void Function SayNonHighlightedText (handle hwnd, string buffer)
var
	string TheClass
if (nSuppressEcho) then
	return
endif
let TheClass = GetWindowClass(hwnd)
if (TheClass == ie4Class) then
	if (GetWindowClass (GetFocus ()) == ie4Class) then
		if (globalMenuMode == menu_inactive) then
			if (! IsVirtualPcCursor ()) then
				Say(buffer, ot_buffer)
			endif
			return
		endif
	endif
endif
if ((GetScreenEcho() > 1) || (TheClass == wc32771)) then
	Say(buffer, ot_buffer)
endif
EndFunction

void Function MoveToLink (int nNext)
; 1 = next, 0 = previous
if (nNext > 0) then
	TypeKey(ks1)
else
	TypeKey(ks2)
endif
let nSuppressEcho = true ; to avoid chattering caused by SayNonHighlightedText
pause ()
let nSuppressEcho = false
EndFunction

Script SaySelectedLink ()
var
	handle hWnd,
	int iSubType
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
if IsVirtualPcCursor () then
	giSpeakSmartNavLevel = IsSmartNavActive()
	speakSmartNavLevelSetting()
endIf
SayFocusedObject ()
SayTutorialHelp (iSubType, TRUE)
SayTutorialHelpHotKey (hWnd, TRUE)
EndScript

Script HotKeyHelp ()
var
	handle WinHandle,
	string TheClass,
	string strBuffer_L,
	string strBuffer_S,
	string sTemp1_L,
	string sTemp1_S,
	string sTemp2_L,
	string sTemp2_S,
	string sTemp3_L,
	string sTemp3_S,
	string sTemp4_L,
	string sTemp4_S
if TouchNavigationHotKeys() then
	return
endIf
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
let WinHandle = GetFocus ()
let TheClass = GetWindowClass(WinHandle)
if ((TheClass == ie4Class) || (GetWindowClass (GetParent (WinHandle)) == ie4Class)) then
	if (! IsVirtualPcCursor ()) then
		;SayFormattedMessage (ot_help, msgHotKeyHelp3_L, msgHotKeyHelp3_S)
		let sTemp1_L = msgHotKeyHelp3_L
		let sTemp1_S = msgHotKeyHelp3_S
	else
		let sTemp1_L = ""
		let sTemp1_S = ""
	endif
	let sTemp2_L = msgHotKeyHelp4_L
	let sTemp2_S = msgHotKeyHelp4_S
	if (!IsVirtualPcCursor ()) then
		let sTemp3_L = msgHotKeyHelp5_L
		let sTemp3_S= msgHotKeyHelp5_S
	else
		let sTemp3_L = ""
		let sTemp3_S = ""
	endif
	let sTemp4_L =msgHotKeyHelp6_L
	let sTemp4_S =msgHotKeyHelp6_S
/* The following has been wrong since at least JAWS 50:
	;build the strings for message for IE4 class
	let strBuffer_L = FormatString(msgHotKeyHelp1_L, cScBufferNewLine, msgHotKeyHelp2_L, cScBufferNewLine, sTemp1_L, cScBufferNewLine, sTemp2_L, cScBufferNewLine, sTemp3_L, cScBufferNewLine);, sTemp4_L)
	let strBuffer_S = FormatString(msgHotKeyHelp1_S, cScBufferNewLine, msgHotKeyHelp2_S, cScBufferNewLine, sTemp1_S, cScBufferNewLine, sTemp2_S, cScBufferNewLine, sTemp3_S, cScBufferNewLine, sTemp4_S)
*/
SayFormattedMessage (ot_USER_BUFFER, strBuffer_L, strBuffer_S)
else
;Message for case where there is no IE4Class
SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp1_L, msgHotKeyHelp1_S)
endif
EndScript

Script ScreenSensitiveHelp ()
var
	int iWinType,
	int iControl,
	handle hwnd,
	string TheClass,
	string sObjName
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if (IsSameScript ()) then
	AppFileTopic (topic_Windows_Help)
	return
endif
let hwnd = GetCurrentWindow ()
let TheClass = GetWindowClass (hwnd)
if theClass==ie4class then
; let screen sensitive help in helpsys.jsb handle it
	performScript screenSensitiveHelp()
	return
endIf
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
;For the list of links list
if (GetWindowName (GetRealWindow (GetCurrentWindow())) == wnLinks_List) then
	let iWinType = GetWindowSubTypeCode (GetCurrentWindow ())
	if (iWinType == WT_LISTVIEW) then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp5_L)
		AddHotKeyLinks ()
		return
	elif iWinType == WT_BUTTON then
		let iControl = GetControlID (GetCurrentWindow ())
		if iControl == iD_MoveToLink then
			SayMessage (OT_USER_BUFFER, msgMoveToLinkButton)
			AddHotKeyLinks ()
			return
		elif iControl == ID_ActivateLink then
			SayMessage (OT_USER_BUFFER, msgActivateLinkButton)
			AddHotKeyLinks ()
			return
		elif iControl == ID_Cancel then
			SayMessage (OT_USER_BUFFER, msgCancelButton)
			AddHotKeyLinks ()
			return
		else; Default
			ScreenSensitiveHelpForKnownClasses (WT_BUTTON)
			return
		endif
	elif iWinType == WT_RADIOBUTTON then
		let sObjName = GetGroupBoxName ()
		if sObjName == scSortLinks then
			SayMessage (OT_USER_BUFFER, msgSortLinks)
			AddHotKeyLinks ()
			return
		elif sObjName == scDisplayLinks then
			SayMessage (OT_USER_BUFFER, msgDisplayLinks)
			AddHotKeyLinks ()
			return
		else;default
			ScreenSensitiveHelpForKnownClasses (WT_RADIOBUTTON)
			return
		endif
	else;default
		ScreenSensitiveHelpForKnownClasses (iWinType)
		return
	endif
endif
if IsToolbarList (hwnd) then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp3_L, msgScreenSensitiveHelp3_S)
	AddHotKeyLinks ()
	return
endif
if IsTabList (hwnd) then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp4_L, msgScreenSensitiveHelp4_S)
	AddHotKeyLinks ()
	return
endif
PerformScript ScreenSensitiveHelp()
EndScript

void Function IsLinksList (handle hwnd)
if (GetWindowSubtypeCode (hwnd) == wt_listbox) then
	if (GetWindowClass (GetAppMainWindow (hwnd)) == wc_JAWS) then
		if (GetWindowName (GetRealWindow (hwnd)) == SelectALinkDialogName) then
			return 1
		endIf
	endif
endif
return 0
EndFunction

void Function IsToolbarList (handle hwnd)
if (GetWindowSubtypeCode (hwnd) == wt_listbox) then
	if (GetWindowClass (GetAppMainWindow (hwnd)) == wc_JAWS) then
		if (GetWindowName (GetRealWindow (hwnd)) == ToolbarDialogName) then
			return 1
		endIf
	endif
endif
return 0
EndFunction

void Function IsTabList (handle hwnd)
if (GetWindowSubtypeCode (hwnd) == wt_listbox) then
	if (GetWindowClass (GetAppMainWindow (hwnd)) == wc_JAWS) then
		if (GetWindowName (GetRealWindow (hwnd)) == SelectTabDialogName) then
			return 1
		endIf
	endif
endif
return 0
EndFunction

Function FocusChangedEvent (handle focusWindow, handle prevWindow)
; The default FocusChangedEvent function has been modified to smooth going back and forth from the app
; to the JAWS Select Item in List dialog
var
	handle RealWindow,
	string RealWindowName,
	string sPageName,
	string sMessage,
	handle AppWindow
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let RealWindow = GetRealWindow(FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow(FocusWindow)
if (GlobalPrevApp != AppWindow && AppWindow != FocusWindow) then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
	; but first check that you are not moving between the app and the JAWS Select Item dialog
	if (GetWindowClass (GlobalPrevApp) == wc_JAWS) then
		let GlobalFocusWindow = FocusWindow
		let GlobalPrevReal = RealWindow
		let GlobalPrevRealName = RealWindowName
		let GlobalPrevApp = AppWindow
		let GlobalPrevFocus = FocusWindow
		GlobalPrevDialogIdentifier = GetDialogIdentifier()
		SayFocusedObject()
		return
	endif
	if (GetWindowClass (appWindow) != wc_JAWS) then
		SayWindowTypeAndText(AppWindow)
	endif
endif
if ((GlobalPrevRealName != RealWindowName) ; name has changed
   || (GlobalPrevReal != RealWindow)) then ; or handle has changed, then
	if ((RealWindow != AppWindow) && (RealWindow != FocusWindow)) then
		SayWindowTypeAndText(RealWindow)
	endif
endif
let GlobalFocusWindow = FocusWindow
;For help pages
let sPageName = GetHelpPageName ()
if sPageName != GlobalPrevPageName
; we exclude when in menus so that we don't get the main window chattering
; after choosing the Options button from the toolbar
&& !GlobalMenuMode then
	let GlobalPrevPageName = sPageName
	let sMessage = FormatString (msgPageName, sPageName)
	SayMessage (OT_DIALOG_NAME, sMessage)
endif
if (GlobalPrevFocus != focusWindow)
; we exclude when in menus so that we don't get the main window chattering
; after choosing the Options button from the toolbar
&& !GlobalMenuMode then
	SayFocusedWindow () ; will use global variable GlobalFocusWindow
else
	SayFocusedObject ()
endif
;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
EndFunction

Function SayFocusedWindow ()
var
	handle hwnd
if (globalFocusWindow == GetNavigationTreeView ()) then
	let hwnd = GetParent (GetParent (GlobalFocusWindow))
	SaveCursor ()
	InvisibleCursor ()
	MoveToWindow (hwnd)
	SayWord ()
	RestoreCursor ()
endif
if (GetFileDate (GetAppFilePath ()) >= scHelpFileDate) then
	if (GetWindowClass (GlobalFocusWindow) == iE4Class) then
		if (! IsVirtualPcCursor ()) then
			SayWindow (GlobalFocusWindow, read_everything)
		else
			SayLine ()
		endif
		return
	endif
endif
SayFocusedObject ()
EndFunction

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
	SayFormattedMessage (ot_error, msg3_L, msg3_S) ;"No links found on page "
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
endwhile
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
	if (TheType != "" && TheType != scHidden) then
		element.focus
		return TRUE
	endif
	let nIdx = nIdx+1
endwhile
return FALSE
EndFunction

Script FocusToFirstField ()
let nSuppressEcho = TRUE
if (ieFocusToFirstField()) then
	Beep()
	ProcessNewText()
else
	SayFormattedMessage (ot_error, msg4_L, msg4_S) ;"Input field not found"
endif
let nSuppressEcho = FALSE
EndScript

handle Function GetNavigationTreeView ()
var
	handle hwnd
let hwnd = FindDescendantWindow (GetAppMainWindow (GetFocus ()), navigation_treeview)
if (hwnd && (GetWindowClass (hwnd) == wc_treeview) && (GetWindowClass (GetParent (hwnd)) == wc_syspager)) then
	return hwnd
else
	return 0
endif
EndFunction

handle Function GetToolbar ()
var
	handle WinHandle
let WinHandle = FindDescendantWindow (GetAppMainWindow (GetFocus ()), tool_bar)
if (winHandle && GetWindowClass (winHandle) == wc_toolbar) then
	return winHandle
endif
return 0
EndFunction

void function GetToolBarButtons(handle hWnd, string ByRef sToolBar, string ByRef sButtonColList, int ByRef iButtonRow)
var
	int i,
	string sWinText,
	string sSegment
let sWinText = GetWindowText(hWnd,0)
SaveCursor ()
InvisibleCursor ()
MoveToWindow (hWnd)
let iButtonRow = GetCursorRow()
let i = 1
let sSegment = StringSegment(sWinText,cscSpace,i)
while sSegment
	; unavailable buttons will have a white background
	if GetColorBackground() != icWhiteBackground then
		let sButtonColList = sButtonColList+IntToString(GetCursorCol())+list_item_separator
		let sToolBar =sToolBar+sSegment+list_item_separator
	EndIf
	let i = i+1
	let sSegment = StringSegment(sWinText,cscSpace,i)
	NextWord()
EndWhile
RestoreCursor ()
let sToolBar = StringChopRight(sToolBar,1)
let sButtonColList = StringChopRight(sButtonColList,1)
EndFunction

void function ClickToolBarButtonByPosition(string sButtonColList, int iPos, int iRow)
SaveCursor()
InvisibleCursor()
MoveTo(StringToInt(StringSegment(sButtonColList,list_item_separator,iPos)),iRow)
RoutePCToInvisible()
RestoreCursor()
EndFunction

Script ToolBar ()
var
	handle winHandle,
	int item,
	string sToolBar,
	string sButtonColList,
	int iButtonRow
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endif
let winHandle = GetToolbar ()
if (!winHandle || !IsWindowVisible (winHandle)) then
	SayFormattedMessage (ot_error, msg5_L) ;"Tool bar not found"
	return
endif
; GetToolBarButtons takes WinHandle and fills in the
; sToolBar, used as the text list of buttons by DlgSelectItem,
; sButtonColList, which is a list of the on-screen X coordinates of the buttons,
; and iButtonRow, which is the on-screen Y coordinate of the row of buttons.
GetToolBarButtons(WinHandle,sToolBar,sButtonColList,iButtonRow)
let item = dlgSelectItemInList(sToolBar, LegacyToolbarDialogName, true)
if item then
	ClickToolBarButtonByPosition(sButtonColList,item,iButtonRow)
EndIf
EndScript

void Function ClickToolBarButton (handle winHandle, string buttonLabel)
var
	string sMessage
SaveCursor ()
JAWSCursor ()
if FindString (winHandle, buttonLabel, s_top, s_restricted) then
	pause ()
	LeftMouseButton ()
else
	let sMessage = FormatString (msg6_L, ButtonLabel)
	SayFormattedMessage (ot_error, sMessage)
endif
EndFunction

String Function GetTabLabels(handle hTabControl)
var
	string strTabControl
SaveCursor()
InvisibleCursor()
MoveToWindow (hTabControl)
let strTabControl= GetWord()
NextWord()
while (GetCurrentWindow() == hTabControl)
	let   strTabControl   = (strTabControl   + LIST_ITEM_SEPARATOR + GetWord())
	NextWord ()
endwhile
RestoreCursor()
return strTabControl
EndFunction

Script SelectTab ()
var
	handle winHandle,
	string strTabLabels,
	string sTabToClick,
	int iIndex,
	int item
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endif
let winHandle = GetTabControl ()
if (!winHandle || !IsWindowVisible (winHandle)) then
	SayFormattedMessage (ot_error, msg7_L) ;"Tab control not found"
	return
endif
let strTabLabels = GetTabLabels (WinHandle)
let item = dlgSelectItemInList (strTabLabels, SelectTabDialogName, true)
let nSuppressEcho = true
delay (2)
if (item == 0) then
	let nSuppressEcho = FALSE
	return
else
	let sTabToClick = StringSegment (strTabLabels, LIST_ITEM_SEPARATOR, item)
	if sTabToClick == cScNull then
		let iIndex = Item - 1
		let iIndex = (StringLength (strTabLabels) - Index)
		let sTabToClick = StringRight (strTabLabels, Index)
	endif
	ClickTab (winHandle, sTabToClick)
endif
let nSuppressEcho = false
EndScript

void Function ClickTab (handle winHandle, string tab)
var
	string sMessage
SaveCursor ()
JAWSCursor ()
if FindString (winHandle, tab, s_top, s_restricted) then
	pause ()
	LeftMouseButton ()
else
	let sMessage = FormatString (msg8_L, Tab)
	SayFormattedMessage (ot_error, sMessage)
endif
EndFunction

void Function GetFrameInHierarchy (int nIndex, object StartWindow)
var
	object frames,
	int nFrames,
	int i,
	int j,
	object windows,
	int nWindows,
	object oNull
let frames = startWindow.frames
let nFrames = frames.length
if (nIndex <= nFrames) then
	let i = 0
	while (i < nFrames)
		if (i == nIndex - 1) then
			return frames(i)
		endif
		let i = i + 1
	endwhile
else
	let nIndex = index - nFrames
endif
let windows = startWindow.frames
let nWindows = windows.length
let j = 0
while (j < nWindows)
	let frames = windows(j).frames
	let nFrames = frames.length
	if (nIndex <= nFrames) then
		let i = 0
		while (i < nFrames)
			if (i == nIndex - 1) then
				return frames(i)
			endif
			let i = i + 1
		endwhile
	else
		let nIndex = nIndex - nFrames
	endif
	let j = j + 1
endwhile
return oNull
EndFunction

void Function AddFramesInWindow (object window, string ByRef strBuf)
var
	object frames,
	int nFrames,
	int i,
	string strTemp
let frames = window.frames
let nFrames = frames.length
let i = 0
while (i < nFrames && i < 10)
	let strTemp = frames(i).name
	if (strTemp == "") then
		let strTemp = frames(i).location.href
	endif
	let strBuf = strBuf + scVerticleBar  + strTemp
	let i = i + 1
endwhile
EndFunction

void Function SpeakDocument (object doc)
var
	object textRange
if ! doc then
	let doc = IE4GetCurrentDocument ()
endif
let textRange = doc.body.createTextRange()
Say(textRange.text, ot_NO_DISABLE)
EndFunction

Script NextDocumentWindow ()
var
	object null
TypeKey(ks3)
delay (1)
if GetWindowClass (GetFocus ()) == IE4Class then
	SpeakDocument (null)
;	read the entire content of the new frame with focus
	return
else
	if (IsMultiPageDialog ()) then
		Say(GetDialogPageName (), ot_control_name)
		endif
endif
EndScript

Script PreviousDocumentWindow ()
var
	object null
TypeKey(ks4)
delay (1)
if GetWindowClass (GetFocus ()) == IE4Class then
	SpeakDocument (null)
;	read the entire content of the new frame with focus
else
	if (IsMultiPageDialog ()) then
		Say(GetDialogPageName (), ot_control_name)
	endif
endif
EndScript

Script SayWindowTitle ()
var
	string sPageName,
	string sMessageLong,
	string sMessageShort
PerformScript SayWindowTitle ()
if GlobalMenuMode > 0 then
	return
endif
if DialogActive () then
	return
endif
let sPageName = GetHelpPageName ()
if sPageName == "" then
	return
endif
let sMessageLong = FormatString (msgPageTitle_L, sPageName)
let sMessageShort = FormatString (msgPageTitle_S, sPageName)
SayMessage (OT_NO_DISABLE, sMessageLong, sMessageShort)
EndScript

;JAWS script file for Microsoft Windows 98 Help
;Copyright 2001-2021 by Freedom Scientific BLV Group, LLC

include "Windows Help.jsh"
include "common.jsm"
include "HjHelp.jsh"
include "hjconst.jsh"
include "hjglobal.jsh"
include "hhctrl.jsm"
use "helpSys.jsb" ; added by JKS to support new Help System features

globals
	string GlobalPrevPageName,
	handle hGlobalHelpFocus

handle Function GetTabControl ()
var
	handle WinHandle
let WinHandle = FindDescendantWindow (GetAppMainWindow (GetFocus ()), tab_control)
if (winHandle && GetWindowClass (winHandle) == scSysTabControl32) then
	return winHandle
endif
return 0
EndFunction

string Function GetHelpPageName ()
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
let strName = GetObjectName ()
RestoreCursor ()
return strName
EndFunction

Function AutoStartEvent ()
let ieVersion = GetIEVersion ()
if Win98HlpFirstTime == 0 then
	let Win98HlpFirstTime = 1
	if GetFileDate(GetAppFilePath()) >= scHelpFileDate then
		SayFormattedMessage (ot_app_start, msg9_L, msg9_S)
	else
		SayFormattedMessage (ot_app_start, msg10_L, msg10_S)
	endif
endif
; reset lost focus  when Alt+tabbing away and back to help system.
If GetWindowClass(GetFocus())==wc_help2000
|| GetWindowClass(GetFocus())==wc_HelpXP then
	SetFocus(hGlobalHelpFocus)
EndIf
EndFunction

Void Function AutoFinishEvent ()
let GlobalPrevPageName = ScNull
EndFunction

void Function GetIEVersion ()
var
	string versionInfo,
	int period,
	string substring
let versionInfo = GetVersionInfoString (GetAppFilePath (), scProductversion)
let period = StringContains (versionInfo, scPeriod )
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

void function SayHighlightedText (handle hWnd, string buffer)
If IsVirtualPcCursor () then
	Return;Do not over-speak.
EndIf
SayHighlightedText (hWnd, buffer)
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
if IsVirtualPcCursor () then
	PerformScript StartSkimRead()
	;SayFormattedMessage (OT_error, cmsgHTML5_L, cmsgHTML5_s); "not available in virtual PC cursor mode"
	return
endif
MoveToWindow (GetFocus())
RestrictCursor (on)
SayAll ()
EndScript

Script ReadNextScreen ()
If DialogActive() then
	PerformScript NextDocumentWindowByPage ()
	Return;
EndIf
let nSuppressEcho = TRUE
PCCursor ()
JAWSPageDown ()
Delay (2)
let nSuppressEcho = FALSE
PerformScript ReadCurrentScreen()
EndScript

Script ReadPriorScreen ()
If DialogActive() then
	PerformScript PreviousDocumentWindowByPage ()
	Return;
EndIf
let nSuppressEcho = TRUE
PCCursor ()
JAWSPageUp ()
Delay (2)
let nSuppressEcho = FALSE
PerformScript ReadCurrentScreen()
EndScript

Script ReadDownColumn ()
if IsJAWSCursor () then
	NextLine ()
	SayChunk ()
else
	PerformScript ControlDownArrow()
endif
EndScript

Script ReadUpColumn ()
if IsJAWSCursor () then
	PriorLine ()
	SayChunk ()
else
	PerformScript ControlUpArrow()
endif
EndScript

Script ReadColumnLeft ()
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
let TheClass = GetWindowClass(hwnd)
if (nSuppressEcho) then
	return
endif
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
if ((GetScreenEcho() > 1) || (TheClass == wc32771 )) then
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
	string sTemp_L,
	string sTemp_S
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
let sTemp_L = msgHotKeyHelp1_L + cScBufferNewLine
let sTemp_S = msgHotKeyHelp1_S + cScBufferNewLine
let WinHandle = GetFocus ()
let TheClass = GetWindowClass(WinHandle)
if ((TheClass == ie4Class) || (GetWindowClass (GetParent (WinHandle)) == ie4Class)) then
	let sTemp_L = AddToString(sTemp_L, msgHotKeyHelp2_L)
	let sTemp_S = AddToString(sTemp_S, msgHotKeyHelp2_S)
	if (! IsVirtualPcCursor ()) then
		let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp3_L)
		let sTemp_S = AddToString(sTemp_S,msgHotKeyHelp3_S)
	endif
	let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp4_L)
	let sTemp_S = AddToString(sTemp_S,msgHotKeyHelp4_S)
	if (!IsVirtualPcCursor ()) then
		let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp5_L)
		let sTemp_S = AddToString(sTemp_S,msgHotKeyHelp5_S)
	endif
	let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp6_L)
	let sTemp_S = AddToString(sTemp_S,msgHotKeyHelp6_S)
	SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
	return
endif
SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
EndScript

Script ScreenSensitiveHelp ()
var
	int iWinType,
	handle hwnd,
	String TheClass
if (IsSameScript ()) then
	AppFileTopic (topic_Windows_Help)
	return
endif
let hwnd = GetCurrentWindow ()
let TheClass = GetWindowClass (hwnd)
If UserBufferIsActive () then
	 UserBufferDeactivate ()
 	SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	 Return
EndIf
if theClass == ie4class then
; let screen sensitive help in helpsys.jsb handle it
	performScript screenSensitiveHelp()
	return
endIf
if IsLinksList (hwnd) then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp2_L, msgScreenSensitiveHelp2_S)
	AddHotKeyLinks ()
	return
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

int function BrailleAddObjectState(int iSubtype)
If iSubType == WT_TREEVIEW
|| iSubType == WT_TREEVIEWITEM then
	;the value already contains the state, don't double show the Open state.
	return true
EndIf
return BrailleAddObjectState(iSubtype)
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
	return
EndIf
ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
EndFunction

int function FocusRedirected(handle FocusWindow, handle PrevWindow)
var
	handle hTemp
if GetWindowClass(FocusWindow) == wc_HelpXP then
	;the focus has gone to the app window, try to put it somewhere useful.
	;It is most likely that the focus was previously located in the displayed topic text.
	let hTemp = FindWindow(FocusWindow,cwcIEServer)
	if hTemp
	&& IsWindowVisible(hTemp) then
		SetFocus(hTemp)
		return true
	EndIf
EndIf
return false
EndFunction

void Function FocusChangedEvent (handle focusWindow, handle prevWindow)
; The default FocusChangedEvent function has been modified to smooth going back and forth from the app
; to the JAWS Select Item in List dialog
var
	handle RealWindow,
	string RealWindowName,
	string sPageName,
	string sMessage,
	handle AppWindow
if FocusRedirected(FocusWindow,PrevWindow) then
	return
EndIf
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let RealWindow = GetRealWindow(FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow(FocusWindow)
if GlobalPrevApp != AppWindow
&& AppWindow != FocusWindow then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
	; but first check that you are not moving between the app and the JAWS Select Item dialog
	if GetWindowClass (GlobalPrevApp) == wc_JAWS then
		let GlobalFocusWindow = FocusWindow
		let GlobalPrevReal = RealWindow
		let GlobalPrevRealName = RealWindowName
		let GlobalPrevApp = AppWindow
		let GlobalPrevFocus = FocusWindow
		GlobalPrevDialogIdentifier = GetDialogIdentifier()
		SayFocusedObject()
		return
	endif
	if GetWindowClass (appWindow) != wc_JAWS then
		SayWindowTypeAndText(AppWindow)
	endif
endif
if GlobalPrevRealName != RealWindowName ; name has changed
|| GlobalPrevReal != RealWindow then ; or handle has changed, then
	if RealWindow != AppWindow
	&& RealWindow != FocusWindow then
		SayWindowTypeAndText(RealWindow)
	endif
endif
let GlobalFocusWindow = FocusWindow
;For help pages
Let sPageName = GetHelpPageName ()
If sPageName != GlobalPrevPageName then
	Let GlobalPrevPageName = sPageName
	Let sMessage = FormatString (msgPageName, sPageName)
	SayMessage (OT_DIALOG_NAME, sMessage)
EndIf
if GlobalPrevFocus != focusWindow then
	SayFocusedWindow () ; will use global variable GlobalFocusWindow
else
	SayFocusedObject ()
EndIf
;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

Void Function SayFocusedWindow ()
var
	handle hwnd
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
If hGlobalHelpFocus==GetFocus() then
	 ; focus was set by AutoStart
	Delay(3,true)
	return
EndIf
let hGlobalHelpFocus=GetFocus()

if globalFocusWindow == GetNavigationTreeView () then
	let hwnd=GetParent (GetParent (GlobalFocusWindow))
	SaveCursor ()
	InvisibleCursor ()
	MoveToWindow (hwnd)
	SayWord ()
	RestoreCursor ()
endif
if GetFileDate (GetAppFilePath()) >= scHelpFileDate then
	if GetWindowClass (GlobalFocusWindow) == iE4Class then
		If IsVirtualPcCursor () then
			SayLine ()
		Else
			SayWindow (GlobalFocusWindow, read_everything)
		EndIf
		return
	endif
endIf
; In Office 2000, the object subtype code of 55, listBoxItem, is not recognized, but listbox is.
If GetWindowClass(globalFocusWindow)==wc_Relistbox20W
&& GetObjectSubtypeCode()==wt_listbox then
	SayFocusedObject()
	SayLine()
	Return
EndIf
SayFocusedObject ()
EndFunction

void Function NewSelectLink ()
if (!DlgListOfLinks()) then
	SayFormattedMessage (ot_error, msg3_L, msg3_S) ;"No links found on page "
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
	if (TheType != "" && TheType != scHidden ) then
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
if (hwnd &&
	(GetWindowClass (hwnd) == wc_treeview) &&
	(GetWindowClass (GetParent (hwnd)) == wc_syspager)) then
	return hwnd
else
	return 0
endif
EndFunction

handle Function GetToolbar ()
var
	handle WinHandle
let WinHandle = FindDescendantWindow (GetAppMainWindow (GetFocus ()), tool_bar)
if winHandle
	&& GetWindowClass (winHandle) == wc_toolbar then
	return winHandle
endif
return false
EndFunction

Script ToolBar ()
var
	handle hWnd,
	int item
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endif
let hWnd = GetToolbar ()
if !hWnd
|| !IsWindowVisible(hWnd) then
	SayMessage (ot_error, msg5_L) ;"Tool bar not found"
	return
endif
ClickToolBarItemByIndex(hWnd,6)
EndScript

void Function ClickToolBarButton (handle hWnd, string buttonLabel)
SaveCursor ()
JAWSCursor ()
MoveToWindow(hWnd)
if FindGraphic(hWnd, buttonLabel, s_top, s_restricted) then
	pause ()
	LeftMouseButton ()
else
	SayMessage (ot_error, FormatString (msg6_L, ButtonLabel))
endif
EndFunction

string Function GetTabLabels(handle hTabControl)
var
	string strTabControl
SaveCursor()
InvisibleCursor()
MoveToWindow (hTabControl)
let strTabControl= GetWord()
NextWord()
while (GetCurrentWindow() == hTabControl)
	let   strTabControl = (strTabControl + LIST_ITEM_SEPARATOR + GetWord())
	NextWord ()
endwhile
RestoreCursor()
Return strTabControl
EndFunction

Script SelectTab ()
var
	handle winHandle,
	string strTabLabels,
	string sTabToClick,
	int iIndex,
	int item
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

Int Function GetTabCountAndInfo (handle hWnd, int iControl, string ByRef strBuff)
var
	int iCheckControl,
	int iCount
let iCheckControl = iControl
SaveCursor ()
InvisibleCursor ()
MoveToWindow (hWnd)
let strBuff = GetWord ()
while (iCheckControl == tab_control)
	let strBuff = strBuff + LIST_ITEM_SEPARATOR + GetWord ()
	NextWord ()
	let iCount = iCount + 1
	let iCheckControl = GetControlID (GetCurrentWindow ())
endwhile
RestoreCursor ()
return iCount
EndFunction

void Function ClickTab (handle hWnd, string tab)
SaveCursor ()
JAWSCursor ()
MoveToWindow(hWnd)
if FindString (hWnd, tab, s_top, s_restricted) then
	pause ()
	LeftMouseButton ()
else
	SayMessage (ot_error, FormatString (msg8_L, Tab))
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
	if (nIndex<=nFrames) then
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
Say(textRange.text,ot_line,true)
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


string Function AddToString(String Base, String strNew)
let Base = Base + strNew + cScBufferNewLine
Return Base
EndFunction

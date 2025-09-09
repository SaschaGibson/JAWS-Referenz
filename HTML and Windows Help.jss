;Copyright 2001-2021 by Freedom Scientific BLV Group, LLC
;JAWS script file for Microsoft Internet Explorer Help

include "hhctrl.jsh"
include"HjHelp.jsh"
include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include "hhctrl.jsm"
use "helpSys.jsb" ; added by JKS to support new Help System features

globals
	int gbAnnouncePositionAfterNavigation,
	int GIDocumentLoaded,
	int GIFirstHelpTopic,
	string GlobalPrevPageName

;FocusChangedEventEx may or may not fire when the app starts,
;and when it does fire the depth change is not consistently reliable.
;so, a listener is scheduled on AutoStart,
;and if FocusChangedEventEx does not happen FocusChangedEvent is forced.
;If FocusChangedEventEx is fired,
;the listener is canceled and FocusChangedEvent is fired.
const
	WaitTime_ListenForFocusChangedEventEx = 5
globals
	int iTimer_ListenForFocusChangedEventEx

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

String Function GetHelpPageName ()
var
	handle hWnd,
	string strName
let hWnd = GetTabControl ()
if ! hWnd then
	return scNull
EndIf
Let strName = GetWindowName (hWnd)
;Dialog is active for the Glossary page, but not for other pages:
If DialogActive ()
&& StringCompare(StrName,scGlossaryTab) != 0 then
	Return cScNull
EndIf
return strName
EndFunction

int function BrailleAddObjectName(int nSubtypeCode)
If nSubTypeCode == WT_TREEVIEW
|| nSubTypeCode == WT_TREEVIEWITEM then
	If ! IsSearchOrIndexWindow (GetFocus (), FALSE) &&
	GetHelpPageName () != scGlossaryTab then
		BrailleAddString (GetHelpPageName (),0,0,0)
		Return TRUE
	EndIf
EndIf
return BrailleAddObjectName (nSubTypeCode)
EndFunction

int function BrailleAddObjectValue(int nSubtype)
var string objectName = GetObjectName(SOURCE_CACHED_DATA)
If nSubtype == WT_ListBox then
	If GetHelpPageName () == scIndexTab 
	&& ! StringIsBlank (objectName) then
		BrailleAddString(objectName,GetCursorCol(),GetCursorRow(),ATTRIB_HIGHLIGHT )
		return true
	EndIf
EndIf
return BrailleAddObjectValue(nSubtype)
EndFunction

int function BrailleAddObjectState(int iSubtype)
If iSubType == WT_TREEVIEW
|| iSubType == WT_TREEVIEWITEM then
	;the value already contains the state, don't double show the Open state.
	return true
EndIf
return BrailleAddObjectState(iSubtype)
EndFunction

int function BrailleAddObjectPosition (int subtypeCode)
If SubtypeCode == WT_ListBox
&& GetHelpPageName () == scIndexTab 
;Although there is no valid position info, JAWS shows "0 items on the display."
	return TRUE
endIf
return BrailleAddObjectPosition (SubtypeCode)
endFunction

Void Function AutoStartEvent ()
var
	string SAppName
let SAppName = GetWindowName (GetAppMainWindow (GetCurrentWindow ()))
if (SAppName == scWindowsHelpTitle) then
	SwitchToScriptFile  (msgFN1, msgFN2)
	return
EndIf
if HHCtrlFirstTime == 0 && (getRunningFSProducts () & product_JAWS) then
	let HHCtrlFirstTime = 1
	if (GetFileDate (GetAppFilePath ()) >= scHelpFileDate)
	&& (getRunningFSProducts () & product_JAWS) then
		SayFormattedMessage (ot_app_start, msg9_L, msg9_S) ;"Once you pick a topic and press enter on it"
	else
		SayFormattedMessage (ot_app_start, msg10_L, msg10_S) ;"Or if you have the older style of HTML help"
	EndIf
EndIf
let iTimer_ListenForFocusChangedEventEx = ScheduleFunction("ListenForFocusChangedEventEx",WaitTime_ListenForFocusChangedEventEx)
EndFunction

Void Function AutoFinishEvent ()
let GlobalPrevPageName = ScNull
EndFunction


int Function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
; any key should reset the trigger
let nSuppressEcho=false
return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
endFunction

void function AnnounceDocumentElements()
var
	int iElementCount,
	int nFrames,
	int nHeadings,
	int nLinks,
	string sFrames,
	string sHeadings,
	string sLinks,
	string sMessageLong,
	string sMessageShort
let nFrames = GetHTMLFrameCount()
;Get all headings in document
let nHeadings = GetHeadingCount (0)
let nLinks = GetLinkCount()
;The following section provides the messages to be formatted into the string for each element type:
;Frames, headings and links.
If nFrames == 0 then
	let sFrames = cScNull
ElIf nFrames == 1 then
	let sFrames = IntToString (nFrames) + cMsgFrame
	let iElementCount = iElementCount+1
Else
	let sFrames = IntToString (nFrames) + cMsgFrames
	let iElementCount = iElementCount+1
EndIf
If nHeadings == 0 then
	let sHeadings = cScNull
ElIf nHeadings == 1 then
	let sHeadings = IntToString (nHeadings)+cMsgHeading
	let iElementCount = iElementCount+1
Else
	let sHeadings = IntToString (nHeadings)+cMsgHeadings
	let iElementCount = iElementCount+1
EndIf
If nLinks == 0 then
	;Use specific no link message.
	let sLinks = cMsgNoLinks
	let iElementCount = iElementCount+1
ElIf nLinks == 1 then
	let sLinks = IntToString (nLinks)+cMsgLink
	let iElementCount = iElementCount+1
Else
	let sLinks = IntToString (nLinks)+cMsgLinks
	let iElementCount = iElementCount+1
EndIf
;The order is:
;Frames, headings, links
;Links will always speak, but everything else is conditional if there are any.
If iElementCount == 3 then
	let sMessageLong = FormatString (msgDocumentLoaded1_L, sFrames, sHeadings, sLinks)
	let sMessageShort = FormatString (msgDocumentLoaded1_S, sFrames, sHeadings, sLinks)
ElIf iElementCount == 2 then
	;Either frames or headings will be missing.
	; In either case, links come last.
	If nFrames then
		let sMessageLong = FormatString (msgDocumentLoaded2_L, sFrames, sLinks)
		let sMessageShort = FormatString (msgDocumentLoaded2_S, sFrames, sLinks)
	ElIf nHeadings then
		let sMessageLong = FormatString (msgDocumentLoaded2_L, sHeadings, sLinks)
		let sMessageShort = FormatString (msgDocumentLoaded2_S, sHeadings, sLinks)
	EndIf
ElIf iElementCount == 1 then
	let sMessageLong = FormatString (msgDocumentLoaded3_L, sLinks)
	let sMessageShort = FormatString (msgDocumentLoaded3_S, sLinks)
EndIf
SayFormattedMessage (OT_SCREEN_MESSAGE, sMessageLong, sMessageShort) ; page has x frames, y headings and z links
EndFunction

void function DoDefaultDocumentLoadActions()
if GetWindowClass (GetFocus ()) == cwcIEServer then
	PCCursor()
	if  (IsVirtualPCCursor()) then
		Let GIFirstHelpTopic = 1
		;If we were in another window,
		;But the document still loaded:
		;For example, select a topic in the tree view.
		;Push from SayFocusedWindow
		If GIDocumentLoaded then
			Let GIDocumentLoaded = FALSE;
		EndIf
		if !(GetRunningFSProducts() & product_Fusion)
			AnnounceDocumentElements()
		endIf
		if ShouldSayAllOnDocumentLoad()
			QueueFunction("SayAll()")
		endIf
	endIf
Else
	;The document loaded, but we don't have focus.
	Let GIDocumentLoaded = TRUE;
endIf
EndFunction

Void Function DocumentLoadedEvent ()
TurnOffFormsMode()
if BackForward == 1 then
	SayLine()
	let BackForward=0
	return
endIf
DoDefaultDocumentLoadActions()
EndFunction

Script ScriptFileName ()
ScriptAndAppNames (msgScriptKeyHelp1)
EndScript

Script SayWindowPromptAndText()
var
	handle hCurrent,
	string sWord,
	int iTheCode,
	int iControlID,
	handle hwnd,
	string sObjectName,
	int nMode
if handleNoCurrentWindow() then
	return
endIf
Let hCurrent = GetCurrentWindow ()
let iTheCode = GetWindowSubTypeCode (hCurrent)
let nMode=smmTrainingModeActive()
if IsVirtualPcCursor () then
	speakSmartNavLevelSetting()
endIf
smmToggleTrainingMode(TRUE)
if iTheCode == WT_TREEVIEW || iTheCode == WT_TREEVIEWITEM then
	if GetHelpPageName () == scGlossaryTab then
		let sObjectName = GetObjectName ()
		IndicateControlType (WT_LISTBOX, msgTerm, sObjectName)
		Say(PositionInGroup (), OT_POSITION)
		SayTutorialHelp (wt_ListBox)
		IndicateComputerBraille (hCurrent)
		smmToggleTrainingMode(nMode)
		return
	else
		SayObjectTypeAndText ()
		SayTutorialHelp (iTheCode)
		SayTutorialHelpHotKey (hCurrent)
		IndicateComputerBraille (hCurrent)
		smmToggleTrainingMode(nMode)
		return
	EndIf
else	;default behavior
	If GlobalMenuMode == 1 then
		Let sWord = GetWord ()
		SayFormattedMessage (OT_SCREEN_MESSAGE, sWord)
		SayTutorialHelp (WT_MenuBar)
		SayTutorialHelpHotKey (hCurrent)
		smmToggleTrainingMode(nMode)
		return
	Else
		If (GetWindowClass(GetCurrentWindow())) == wc_Checkable_Listbox  then
			SayFormattedMessage(OT_CONTROL_TYPE, msgCheckableListBox)
		Else
			SayObjectTypeAndText()
		EndIf
	EndIf
EndIf
SayTutorialHelp (iTheCode)
SayTutorialHelpHotKey (hCurrent)
IndicateComputerBraille (hCurrent)
smmToggleTrainingMode(nMode)
EndScript

Script ReadCurrentScreen ()
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if IsVirtualPcCursor () then
	PerformScript StartSkimRead()
;SayFormattedMessage (OT_error, cmsgHTML5_L, cmsgHTML5_s); "not available in virtual PC cursor mode"
	return
EndIf
MoveToWindow (GetFocus())
RestrictCursor (on)
SayAll ()
EndScript

Script ReadNextScreen ()
If DialogActive() then
	PerformScript NextDocumentWindowByPage ()
	Return;
EndIf
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
If DialogActive() then
	PerformScript PreviousDocumentWindowByPage ()
	Return;
EndIf
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
if IsJAWSCursor () then
	NextLine ()
	SayChunk ()
else
	PerformScript ControlDownArrow()
EndIf
EndScript

Script ReadUpColumn ()
if IsJAWSCursor () then
	PriorLine ()
	SayChunk ()
else
	PerformScript ControlUpArrow()
EndIf
EndScript

Script ReadColumnLeft ()
if IsJAWSCursor () then
	PriorChunk ()
	;scRightBracket ="]"
	while (GetCharacter() == scNULL) || (GetCharacter() == scRightBracket)
		PriorChunk ()
	endwhile
	SayChunk ()
else
	PerformScript SayPriorWord()
EndIf
EndScript

Script ReadColumnRight ()
if IsJAWSCursor () then
	NextChunk ()
	;scRightBracket ="]"
	while (GetCharacter() == scNULL) || (GetCharacter() == scRightBracket)
		NextChunk ()
	endwhile
	SayChunk()
else
	PerformScript SayNextWord()
EndIf
EndScript

void Function SayNonHighlightedText (handle hwnd, string buffer)
var
	string TheClass
let TheClass = GetWindowClass(hwnd)
if (nSuppressEcho) then
	return
EndIf
if (TheClass == ie4Class) then
	if (GetWindowClass (GetFocus ()) == ie4Class) then
		if (globalMenuMode == menu_inactive) then
			if (! IsVirtualPcCursor ()) then
				Say (buffer, ot_buffer)
			EndIf
			return
		EndIf
	EndIf
EndIf
if ((GetScreenEcho() > 1) || (TheClass == DialogClass)) then
	Say(buffer, ot_buffer)
EndIf
EndFunction
void function SayHighlightedText (handle hwnd, string buffer)
if GetWindowClass(hWnd) == wc_IndexKeyWordList then
	;SayHighlight in Index page list causes double speaking, so suppress for normal usage:
	if GetScreenEcho() != ECHO_ALL then
		return
	EndIf
EndIf
;Only to cut off double-speaking in Glossary
If nSuppressEcho then
	Return;
EndIf
If IsVirtualPcCursor ()
|| getWindowClass(hwnd) == cwcIEServer then
	Return;Do not over-speak.
EndIf
SayHighlightedText (hWnd, buffer)
EndFunction

void Function MoveToLink (int nNext)
var
	string sClass
let sClass = GetWindowClass (GetCurrentWindow())
; 1 = next, 0 = previous
if (nNext > 0) then
	TypeKey (ks1)
else
	TypeKey (ks2)
EndIf
if InHJDialog () || (sClass !=	ie4Class ) then
	return
else
let nSuppressEcho = true ; to avoid chattering caused by SayNonHighlightedText
pause ()
let nSuppressEcho = false
EndIf
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
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
If iSubType == WT_TREEVIEW then
	PerformScript SayWindowPromptAndText ()
	Return
EndIf
SayFocusedObject ()
SayTutorialHelp (iSubType)
SayTutorialHelpHotKey (hWnd)
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
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
Pause ()
let sTemp_L = msgHotKeyHelp1_L + cScBufferNewLine
let sTemp_S = msgHotKeyHelp1_S + cScBufferNewLine
let WinHandle = GetFocus ()
let TheClass = GetWindowClass(WinHandle)
if ((TheClass == ie4Class) || (GetWindowClass (GetParent (WinHandle)) == ie4Class)) then
	let sTemp_L = AddToString(sTemp_L, formatString(msgHotKeyHelp2_L))
	let sTemp_S = AddToString(sTemp_S,formatString(msgHotKeyHelp2_S))
	if (!IsVirtualPcCursor ()) then
		let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp3_L)
		let sTemp_s = AddToString(sTemp_S,msgHotKeyHelp3_S)
	EndIf
	let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp4_L)
	let sTemp_S = AddToString(sTemp_S,msgHotKeyHelp4_S)
	if (!IsVirtualPcCursor ()) then
		let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp5_L)
		let sTemp_s = AddToString(sTemp_S,msgHotKeyHelp5_S)
	EndIf
	If ! IsVirtualPcCursor () then;The following message doesn't make sense with VPC on.
		let sTemp_L = AddToString(sTemp_L,msgHotKeyHelp6_L)
		let sTemp_S = AddToString(sTemp_S,msgHotKeyHelp6_S)
	EndIf
EndIf
SayFormattedMessage(OT_USER_BUFFER, sTemp_L, sTemp_S)
UserBufferAddText (cscBufferNewLine+cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
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
EndIf
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
		EndIf
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
		EndIf
	else;default
		ScreenSensitiveHelpForKnownClasses (iWinType)
		return
	EndIf
EndIf
let hwnd = GetCurrentWindow ()
let TheClass = GetWindowClass (hwnd)
if theClass==ie4class then
; let screen sensitive help in helpsys.jsb handle it
	performScript screenSensitiveHelp()
	return
EndIf
if IsLinksList (hwnd) then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp2_L)
	AddHotKeyLinks ()
	return
EndIf
if IsToolbarList (hwnd) then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp3_L)
	AddHotKeyLinks ()
	return
EndIf
if IsTabList (hwnd) then
	SayFormattedMessage (ot_USER_BUFFER, msgScreenSensitiveHelp4_L)
	AddHotKeyLinks ()
	return
EndIf
if GetHelpPageName () == scGlossaryTab then
	Let hWnd = GetCurrentWindow ()
	Let iWinType = GetWindowSubTypeCode (hWnd)
	If iWinType == WT_TREEVIEW then
		SayMessage (OT_USER_BUFFER, msgScreenSensitiveHelp6_L)
		AddHotKeyLinks ()
		Return
	ElIf iWinType == WT_READONLYEDIT then
		SayMessage (OT_USER_BUFFER, msgScreenSensitiveHelp7_L)
		AddHotKeyLinks ()
		Return
	EndIf
EndIf
PerformScript ScreenSensitiveHelp()
EndScript

void Function IsLinksList (handle hwnd)
if (GetWindowSubtypeCode (hwnd) == wt_listbox) then
	if (GetWindowClass (GetAppMainWindow (hwnd)) == wc_JAWS) then
		if (GetWindowName (GetRealWindow (hwnd)) == SelectALinkDialogName) then
			return 1
		EndIf
	EndIf
EndIf
return 0
EndFunction

void Function IsToolbarList (handle hwnd)
if (GetWindowSubtypeCode (hwnd) == wt_listbox) then
	if (GetWindowClass (GetAppMainWindow (hwnd)) == wc_JAWS) then
		if (GetWindowName (GetRealWindow (hwnd)) == ToolbarDialogName) then
			return 1
		EndIf
	EndIf
EndIf
return 0
EndFunction

void Function IsTabList (handle hwnd)
if (GetWindowSubtypeCode (hwnd) == wt_listbox) then
	if (GetWindowClass (GetAppMainWindow (hwnd)) == wc_JAWS) then
		if (GetWindowName (GetRealWindow (hwnd)) == SelectTabDialogName) then
			return 1
		EndIf
	EndIf
EndIf
return 0
EndFunction

int Function FocusRedirected(handle FocusWindow, handle PrevWindow)
var
	int x,
	int y
If StringCompare(GetHelpPageName(),scIndexTab) == 0 then
	if !GetMenuMode()
	&& !UserBufferIsActive()
	&& GetObjectSubtypecode(SOURCE_CACHED_DATA) == wt_ListBox then
		;The type should be listbox item when the list item gains focus.
		;click on the list item to force the focus.
		SaveCursor()
		let y = GetCursorRow()
		let x = (GetWindowLeft(GetFocus())+GetWindowRight(GetFocus()))/2
		InvisibleCursor()
		MoveTo(x,y)
		RoutePCToInvisible()
		RestoreCursor()
		return true
	EndIf
EndIf
return false
EndFunction

void Function FocusChangedEvent(handle focusWindow, handle prevWindow)
; The default FocusChangedEvent function has been modified to smooth going back and forth from the app
; to the JAWS Select Item in List dialog
var
	handle RealWindow,
	string RealWindowName,
	string sPageName,
	string sMessage,
	handle AppWindow,
	int Left,
	int Right,
	int Top,
	int Bottom
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
if FocusRedirected(FocusWindow,PrevWindow) then
	return
EndIf
let RealWindow = GetRealWindow(FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow(FocusWindow)
if GlobalPrevApp != AppWindow
&& AppWindow != FocusWindow then
	If !GlobalWasHjDialog then
		SayWindowTypeAndText (AppWindow)
	EndIf
EndIf
if GlobalPrevRealName != RealWindowName
|| GlobalPrevReal != RealWindow then
	if RealWindow != AppWindow
	&& RealWindow != FocusWindow then
		if inHJDialog() then
			SayWindowTypeAndText(RealWindow)
		ElIf !GlobalWasHJDialog then
			SayWindowTypeAndText(RealWindow)
		else
			SayWindowTypeAndText(RealWindow)
		EndIf
	EndIf
EndIf
let GlobalFocusWindow = FocusWindow
;For help pages
let sPageName = GetHelpPageName ()
if sPageName
&& sPageName != GlobalPrevPageName
; we exclude when in menus so that we don't get the main window chattering
; after choosing the Options button from the toolbar
&& !GlobalMenuMode then
	let GlobalPrevPageName = sPageName
	If sPageName > cScNull then
		let sMessage = FormatString (msgPageName, sPageName)
		SayMessage (OT_DIALOG_NAME, sMessage)
	EndIf
EndIf
if GlobalPrevFocus != focusWindow
; we exclude when in menus so that we don't get the main window chattering
; after choosing the Options button from the toolbar
&& !GlobalMenuMode then
	SayFocusedWindow () ; will use global variable GlobalFocusWindow
else
	SayFocusedObject ()
EndIf
If ((product_MAGic & GetRunningFSProducts()) && cwcIEServer == GetWindowClass(GetFocus()))
	/* Specifying 0 for the nX and nY parameters causes the GetItemRect function to obtain
	the rectangle for the line at the current location. */
	If (GetItemRect(0, 0, Left, Right, Top, Bottom, IT_LINE))
		MagSetFocusToRect(Left, Right, Top, Bottom)
	EndIf
EndIf
;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
let GlobalWasHJDialog = InHJDialog ()
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

void Function SayFocusedWindow ()
var
	int iTheCode,
	int iControlID,
	handle hwnd,
	string sObjectName
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
if nSuppressEcho then
	return
EndIf
;Glossary logic is handled here
If GetHelpPageName () == scGlossaryTab then
	let iControlID = GetControlID (GlobalFocusWindow)
	Let iTheCode = GetWindowSubTypeCode (GlobalFocusWindow)
	if iTheCode == WT_READONLYEDIT then
		SayWindowTypeAndText (GetPriorWindow (GlobalFocusWindow))
		SayWindowTypeAndText (GlobalFocusWindow)
		Return
	ElIf iTheCode == WT_TREEVIEW then
		Let nSuppressEcho = TRUE;
		Let sObjectName = GetObjectName ()
		IndicateControlType (WT_LISTBOX, msgTerm, sObjectName)
		Say (PositionInGroup (), OT_POSITION)
		Return
	EndIf
EndIf
if (globalFocusWindow == GetNavigationTreeView ()) then
	let hwnd = GetParent (GetParent (GlobalFocusWindow))
	SaveCursor ()
	InvisibleCursor ()
	MoveToWindow (hwnd)
	SayWord ()
	RestoreCursor ()
EndIf
if (GetFileDate (GetAppFilePath ()) >= scHelpFileDate) then
	If GetWindowClass (GlobalFocusWindow) == cWcShellObject then
		;Suppress extra title verbiage.
		Return
	EndIf
	if (GetWindowClass (GlobalFocusWindow) == IE4Class) then
		if (! IsVirtualPcCursor ()) then
			SayWindow (GlobalFocusWindow, read_everything)
		else
			If ! GIFirstHelpTopic then
				;DocumentLoadedEvent by default will handle this properly.
				Return
			EndIf
			If GIDocumentLoaded then
				;Push the DocumentLoadedEvent,
				;Because it got called but not run when an item was selected.
				DocumentLoadedEvent ()
				Let GIDocumentLoaded = FALSE;
			Else
				SayLine ()
			EndIf
			Return
		EndIf
		return
	EndIf
EndIf
Let iTheCode = GetWindowSubTypeCode (GlobalFocusWindow)
If (GetControlId (GetParent (GlobalFocusWindow)) == tab_control) &&
(iTheCode == WT_TREEVIEW) then
	Let nSuppressEcho = TRUE;
EndIf
/*
;removing, causes Windows 7 64 bit to not speak the focus item.
;I am unable to reproduce the original problem from a year ago that this solves.
;Leaving this code in until we know that the original problem will not resurface.
if !(GetCharacterAttributes() & Attrib_Highlight) then
	if iTheCode == wt_TreeView
	&& GetWindowName(GetParent(GlobalFocusWindow)) == scContentsTab then
		;Sometimes, the topic is not yet selected.
		;In that case, just say the name of the control.
		;ActiveItemChangedEvent will move the selection to the a topic and will say it then.	EndIf
		Say(GetWindowType(GlobalFocusWindow),OT_CONTROL_TYPE)
		;now set the global to announce the position in group after the item has been navigated to
		let gbAnnouncePositionAfterNavigation = true
		return
	EndIf
EndIf
*/
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
EndIf
EndFunction

int function SelectALinkDialog()
var
	int iActivatedVCursor,
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
EndIf
if (IsVirtualPcCursor ()) then
	NewSelectLink ()
	if (iActivatedVCursor) then
		Delay (5)
		SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
	EndIf
	return true
EndIf
if (iActivatedVCursor) then
	SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
EndIf
let doc = ie4GetCurrentDocument ()
let links = doc.links
let all = doc.all
let nLinks = links.length
if (nLinks == 0) then
	SayFormattedMessage (ot_error, msg3_L, msg3_S) ;"No links found on page "
	return true
EndIf
let nIdx = 0
while (nIdx < nLinks)
	let strTemp = links(nIdx).InnerText
	if (!strTemp) then
		let strTemp = all(links(nIdx).SourceIndex+1).alt
	EndIf
	if (!strTemp) then
		let strTemp = links(nIdx).href
	EndIf
	let buffer = buffer + scVerticleBar  + strTemp
	let nIdx = nIdx+1
endwhile
let nIdx = DlgSelectItemInList (buffer, msgSelectLink, true)
if (nIdx == 0) then
	return true
EndIf
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
EndIf
let forms = doc.forms
if (forms.length <= 0 ) then
	return FALSE
EndIf
let nIdx = forms(0).SourceIndex()
let all = doc.all
while (nIdx < all.length)
	let element = all(nIdx)
	let TheType = element.type
	if (TheType != "" &&
		TheType != scHidden) then
		element.focus
		return TRUE
	EndIf
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
EndIf
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
EndIf
EndFunction

handle Function GetToolbar ()
var
	handle WinHandle
let WinHandle = FindDescendantWindow (GetAppMainWindow (GetFocus ()), tool_bar)
if (winHandle && GetWindowClass (winHandle) == wc_toolbar) then
	return winHandle
EndIf
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
	let sButtonColList = sButtonColList+IntToString(GetCursorCol())+list_item_separator
	let sToolBar =sToolBar+sSegment+list_item_separator
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
	handle hWnd,
	int item,
	string sToolBar,
	string sButtonColList,
	int iButtonRow
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
EndIf
let hWnd = GetToolbar ()
if !hWnd
|| !IsWindowVisible(hWnd) then
	SayMessage (ot_error, msg5_L) ;"Tool bar not found"
	return
EndIf
ClickToolBarItemByIndex(hWnd,5)
EndScript

void Function ClickToolBarButton (handle hWnd, string buttonLabel)
SaveCursor ()
JAWSCursor ()
MoveToWindow(hWnd)
if FindString (hWnd, buttonLabel, s_top, s_restricted) then
	pause ()
	LeftMouseButton ()
else
	SayMessage (ot_error, FormatString (msg6_L, ButtonLabel))
EndIf
EndFunction

String Function GetTabLabels(handle hTabControl)
Var
	string strTabControl
SaveCursor()
InvisibleCursor()
MoveToWindow (hTabControl)
Let strTabControl= GetWord()
NextWord()
While (GetCurrentWindow() == hTabControl)
	Let strTabControl = (strTabControl + LIST_ITEM_SEPARATOR + GetWord())
	NextWord ()
EndWhile
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
EndIf
let winHandle = GetTabControl ()
if !winHandle
|| !IsWindowVisible(winHandle) then
	SayFormattedMessage (ot_error, msg7_L) ;"Tab control not found"
	return
EndIf
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
	EndIf
	ClickTab (winHandle, sTabToClick)
EndIf
let nSuppressEcho = false
EndScript

void Function ClickTab (handle hWnd, string tab)
SaveCursor ()
JAWSCursor ()
MoveToWindow(hWnd)
if FindString (hWnd, tab, s_top, s_restricted) then
	pause ()
	LeftMouseButton ()
else
	SayMessage (ot_error, FormatString (msg8_L, Tab))
EndIf
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
if (nIndex<=nFrames) then
	let i = 0
	while (i<nFrames)
		if (i==nIndex-1) then
			return frames(i)
		EndIf
		let i = i+1
	endwhile
else
	let nIndex = index-nFrames
EndIf
let windows = startWindow.frames
let nWindows = windows.length
let j = 0
while (j<nWindows)
	let frames = windows(j).frames
	let nFrames = frames.length
	if (nIndex <= nFrames) then
		let i = 0
		while (i < nFrames)
			if (i == nIndex - 1) then
				return frames(i)
			EndIf
			let i = i + 1
		endwhile
	else
		let nIndex = nIndex - nFrames
	EndIf
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
	EndIf
	let strBuf = strBuf + scVerticleBar  + strTemp
	let i = i + 1
endwhile
EndFunction

void Function SpeakDocument (object doc)
var
	object textRange
if ! doc then
	let doc = IE4GetCurrentDocument ()
EndIf
let textRange = doc.body.createTextRange()
Say(textRange.text, ot_NO_DISABLE)
EndFunction

Script NextDocumentWindow ()
var
	object null
TypeKey (ks3)
delay (1)
if GetWindowClass (GetFocus ()) == IE4Class then
;	{Control + Tab}
	SpeakDocument (null)
;	read the entire content of the new frame with focus
	return
else
	if (IsMultiPageDialog ()) then
;		{Control + Tab}
		Say(GetDialogPageName (), ot_dialog_name)
	EndIf
EndIf
EndScript

Script PreviousDocumentWindow ()
var
	object null
TypeKey (ks4)
delay (1)
if GetWindowClass (GetFocus ()) == IE4Class then
	SpeakDocument (null)
;	read the entire content of the new frame with focus
else
	if (IsMultiPageDialog ()) then
		Say(GetDialogPageName (), ot_dialog_name)
	EndIf
EndIf
EndScript

Script SayWindowTitle ()
var
	string sPageName,
	string sMessageLong,
	string sMessageShort
PerformScript SayWindowTitle ()
if GlobalMenuMode > 0 then
	Return
EndIf
if DialogActive () then
	return
EndIf
let sPageName = GetHelpPageName ()
if sPageName == "" then
	return
EndIf
let sMessageLong = FormatString (msgPageTitle_L, sPageName)
let sMessageShort = FormatString (msgPageTitle_S, sPageName)
SayMessage (ot_user_requested_information, sMessageLong, sMessageShort)
EndScript

string Function AddToString(String Base, String strNew)
let Base = Base + formatString(strNew) + cScBufferNewLine
Return Base
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
var
	string sHelpPageName
let sHelpPageName = GetHelpPageName ()
If StringCompare(sHelpPageName,scGlossaryTab) == 0
|| StringCompare(sHelpPageName,scIndexTab) == 0 then
	Say(GetObjectName(SOURCE_CACHED_DATA),ot_line)
	Return
EndIf
if GetWindowSubtypeCode(curHwnd) == wt_TreeView
&& gbAnnouncePositionAfterNavigation then
	let gbAnnouncePositionAfterNavigation = false
	SayTreeViewLevel (false)
	return
EndIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

Script SayNextLine ()
var
	int iTheCode,
	string sObjectName
If ! IsPcCursor () || UserBufferIsActive () || GlobalMenuMode then
	PerformScript SayNextLine ()
	Return
EndIf
let iTheCode = GetWindowSubTypeCode (GetFocus ())
If ! iTheCode then
	Let iTheCode = GetObjectSubTypeCode ()
EndIf
if iTheCode == WT_TREEVIEW || iTheCode == WT_TREEVIEWITEM then
	if GetHelpPageName () == scGlossaryTab then
		NextLine ()
		let sObjectName = GetObjectValue ()
		SayMessage (ot_line, sObjectName)
		return
	EndIf
	NextLine ()
	return; let ActiveItemChangedEvent speak the item change
EndIf
PerformScript SayNextLine ()
EndScript

Script SayPriorLine ()
var
	int iTheCode,
	string sObjectName
If ! IsPcCursor () || UserBufferIsActive () || GlobalMenuMode then
	PerformScript SayPriorLine ()
	Return
EndIf
let iTheCode = GetWindowSubTypeCode (GetFocus ())
If ! iTheCode then
	Let iTheCode = GetObjectSubTypeCode ()
EndIf
if iTheCode == WT_TREEVIEW || iTheCode == WT_TREEVIEWITEM then
	if GetHelpPageName () == scGlossaryTab then
		PriorLine ()
		let sObjectName = GetObjectValue ()
		SayMessage (ot_line, sObjectName)
		return
	EndIf
	PriorLine ()
	return; let ActiveItemChangedEvent speak the item change
EndIf
PerformScript SayPriorLine ()
EndScript

Script GoBack ()
let BackForward = 1
TypeKey (ks5)
SayFormattedMessage (ot_STATUS, msgBack1_L, cmsgSilent)
EndScript

Script GoForward ()
let BackForward = 1
TypeKey (ks6)
SayFormattedMessage (ot_STATUS, msgForward1_L, cmsgSilent)
EndScript

int function HasVirtualEnhancedClipboard()
return true
EndFunction

void function SayLine (optional int HighlightTracking, optional int bSayingLineAfterMovement)
If ! IsPcCursor () || UserBufferIsActive () || GlobalMenuMode then
	SayLine(HighlightTracking,bSayingLineAfterMovement)
	Return
EndIf
If GetHelpPageName () == scGlossaryTab then
	If GetWindowSubTypeCode (GetFocus ()) == WT_TREEVIEW then
		Say(GetObjectName (), OT_LINE)
		say(PositionInGroup(),ot_position)
		Return
	EndIf
EndIf
SayLine(HighlightTracking,bSayingLineAfterMovement)
EndFunction

Script SayLine()
If IsPcCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	If GetHelpPageName () == scIndexTab then
		If GetObjectSubtypecode() == WT_ListBoxItem then
			Say(GetObjectName(SOURCE_CACHED_DATA), OT_LINE)
			say(PositionInGroup(),ot_position)
			Return
		EndIf
	EndIf
EndIf
PerformScript SayLine()
EndScript


void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	int iSubtype
if InHJDialog() then
	SayObjectTypeAndText (nLevel,includeContainerName)
	Return
EndIf
if StringCompare(GetHelpPageName(),scIndexTab) == 0 then
	let iSubtype = GetObjectSubtypecode(SOURCE_CACHED_DATA)
	if iSubtype == wt_ListBox
	|| iSubtype == wt_ListboxItem then
		IndicateControlType(wt_listbox,msg_CtrlName_IndexList,GetObjectName(SOURCE_CACHED_DATA))
		return
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void function ListenForFocusChangedEventEx()
let iTimer_ListenForFocusChangedEventEx = 0
FocusChangedEvent(GetFocus(),GlobalPrevFocus)
EndFunction

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if iTimer_ListenForFocusChangedEventEx then
	UnScheduleFunction(iTimer_ListenForFocusChangedEventEx)
	let iTimer_ListenForFocusChangedEventEx = 0
	FocusChangedEvent(GetFocus(),GlobalPrevFocus)
	return
EndIf
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
if getWindowClass (hwndFocus) == wc_IndexKeyWordList
&& getWindowClass (hwndPrevFocus) == wc_IndexKeyWordList then
; object depth is wrong, and the items in the list repeat the list name and type, when they should be only reading the list item as it changes:
;SayObjectActiveItem gets this text correctly.
	return SayObjectActiveItem ()
endIf
FocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void Function DoAndSayCurrentKeystroke ()
SayCurrentScriptKeyLabel ()
TypeCurrentScriptKey ()
EndFunction

script enter ()
if isVirtualPcCursor () || userBufferIsActive () then
	performScript enter ()
	return
endIf
DoAndSayCurrentKeystroke ()
endScript

script F6 ()
DoAndSayCurrentKeystroke ()
endScript

;Script files for Vista's Windows Mail
;Copyright 2007-2021 by Freedom Scientific Inc.

include "hjconst.jsh"
include "hjglobal.jsh"
include "Windows Mail.jsm"
include "Windows Mail.jsh"
include "OutlookCustomSettings.jsm"
include "OutlookCustomSettings.jsh"
include "HjHelp.jsh"
include "common.jsm"
use "OutlookCustomSettings.jsb"
include "oluo.jsm"
use "olUserOptions.jsb"

GLOBALS
	string gs_PrevBuffer

Script ScriptFileName ()
Var
	string sWindowsMailVersion
let GlobalWindowOwner=StringSegment(GetWindowOwner (GetFocus()),"\\",-1)
let sWindowsMailVersion = IntToString (GetProgramVersion (GetAppFilePath ()))
let sWindowsMailVersion = (FormatString (msgWindowsMail, sWindowsMailVersion))
ScriptAndAppNames(sWindowsMailVersion)
;Say("Window Owner="+GlobalWindowOwner,ot_line)
EndScript



string Function RetrieveNumberOfUnReadMessages ()
Var
	handle hWnd,
	string sUnRedMsgs
let hWnd=FindWindowWithClassAndID(GlobalRealWindow,cwc_StatusBar32,ID_StatusBar)
If GetWindowSubTypeCode (hWnd) != WT_StatusBar Then
	return cscNull
EndIf
let sUnRedMsgs = GetWindowTextEx (hWnd, FALSE, FALSE)
let sUnRedMsgs = StringSegment (sUnRedMsgs, scComma, 2)
If  StringToInt (StringChopLeft (sUnRedMsgs, 1))  Then
	let sUnredMsgs = StringSegment (sUnRedMsgs, cscSpace, 2)
	return FormatString (MsgUnReadMessages, sUnRedMsgs)
	EndIf
	return cscNull
EndFunction

int function IsUnReadMessage ()
If ! IsMessagesList (GetFocus ()) then
	Return FALSE
EndIf
If GetCharacterAttributes () & ATTRIB_BOLD then
	Return TRUE
Else
	Return FALSE
EndIf
EndFunction

int function HandleCustomWindows (handle hwnd)
var
	string sSpellWord,
	string sListText,
	string sState,
	String sFocusedClass,
	String sRealClass,
	int iTypeCode,
	int iObjTypeCode,
	String sObjName,
	Handle hWndToFocus

let gbByPassSayObjectTypeAndText=TRUE
let gbLineHasSpoken=FALSE
let gbFocusHasChanged=TRUE
If InHjDialog () then
	SayWindowTypeAndText (hWnd)
	Return TRUE
EndIf
if gbSuppressEcho == on then
	return TRUE
EndIf
let iTypeCode=GetWindowSubTypeCode(hWnd)
let iObjTypeCode=GetObjectSubTypeCode()
let sObjName=GlobalObjectName
let sFocusedClass = GetWindowClass (hWnd)
let sRealClass = GetWindowClass (GetRealWindow (hWnd))If StringContains(GlobalRealWindowName,scOptions)
&& StringContains(GetWindowName(hWnd),scHighlightWatchedMessages)
&& GlobalCurrentControl==ciGetMessageCountEditField Then
	IndicateControlType(iTypeCode,scMessages)
	Return TRUE
EndIf
; Get handle of Column dialog's Show button.
If GlobalRealWindowName==wn_ColumnsDialog
&& GlobalCurrentControl==ciColumnsDialogList Then
	let ghShowButton=FindDescendantWindow(GlobalRealWindow,ciColumnsShowButton)
EndIf

If hWnd == GetFocus () then
	If IsMessageRules(hWnd)
	&& iTypeCode==wt_ListView Then
		IndicateControlType(iTypeCode,cscSpace,cscSpace)
		SayObjectActiveItem ()
	 Return TRUE
	EndIf

	If iTypeCode == WT_TOOLBAR then
		SayLine (TRUE)
		Return TRUE
	EndIf
EndIf

;To speak the Unread status of a message properly
If IsMessagesList (hWnd) then
	If gbNotAListViewYet  Then
		; When empty, focus gets lost, so need to force focus to the list view...
		SetFocus(FindWindowWithClassAndId(GlobalRealWindow,cwcListView,FALSE))
		Return TRUE
	EndIf
	let GlobalWindowName=wn_WindowsMailMessageList
	IndicateControlType(wt_ListView,GlobalWindowName,cscSpace)
	If !LVGetItemCount (hWnd) Then
		Say(PositionInGroup(),ot_line)
	Else
		SayLine()
	EndIf
	Return TRUE
EndIf ; End of Message list.

; Bail when alt tabbing from a link
If IsWindowVisible (FindTopLevelWindow(cwc_Dlg32771,cscNull)) then
	return FALSE
EndIf
If GetWindowName (GetRealWindow (GetParent (GetFocus ()))) + scStar == wn_help + scStar then
	SwitchToConfiguration (fn_HTMLHelp)
	return true
EndIf

If DialogActive () then
	If GlobalRealWindowName == wnCheckSpelling then
		If iTypeCode  == WT_LISTBOX then
			SayWindowTypeAndText (hWnd)
			Let sSpellWord = GetWindowText (hWnd, READ_HIGHLIGHTED)
			If sSpellWord then
				SpellString (sSpellWord)
			EndIf
			Return TRUE
		EndIf
		If iTypeCode  == WT_EDIT
		|| iTypeCode  == WT_ReadOnlyEdit then
			If GlobalCurrentControl == NotInDictionary_field
			|| GlobalCurrentControl == changeTo_field
			|| GlobalCurrentControl == ChangeTo_Field2 then
					If ! gbReadMisspelledAndSuggestion then
;					Let gbReadMisspelledAndSuggestion = TRUE
						MisspelledAndSuggestion (FALSE, TRUE)
						return true
					EndIf
	let gbReadMisspelledAndSuggestion=FALSE
			EndIf
			; let SayFocusedWindow handle it.
		EndIf
	ElIf GlobalRealWindowName == wnFindMessage then
		If GlobalCurrentControl==id_ReceivedAfter
		|| GlobalCurrentControl==id_ReceivedBefore then
			SayMessage(OT_CONTROL_NAME,GetObjectName())
			; This is a complex control, of class SysDateTimePick32
			SayMessage(OT_CONTROL_TYPE,scDateTimePickerControl)
			SayWindowTypeAndText(hWnd)
			; attempt to determine and announce the check status:
			let sState = cscNull  ;ensure null in case state cannot be determined
			SaveCursor()
			RouteInvisibleToPC()
			If FindGraphic(hWnd,scCorner,s_top,s_restricted) then
					let sState = msgNotChecked
			ElIf FindGraphic(hWnd,scCheckMark,s_top,s_restricted) then
					let sState = MSGChecked
			EndIf
			RestoreCursor()
			SayMessage(OT_ITEM_STATE,sState)
			return true
		EndIf
	EndIf
EndIf
If GlobalWindowClass  == cwcListView
	&& ! IsWindowObscured (hwnd)
	&& GlobalCurrentControl == attachments_list then
	SaveCursor ()
	RouteInvisibleToPC ()
	InvisibleCursor ()
	RoutePCToInvisible ()
	RestoreCursor ()
	Say(wnAttachmentList,ot_control_name)
EndIf;	This is meant to set focus when tabbing to an attachments list in an open message

If ! iObjTypeCode  then
	If GlobalWindowClass  == cwcIEServer
	|| (GlobalWindowClass == cwc_RichEdit50W
	&& !GlobalCurrentControl) then
		If globalMessageWindow==GetFocus()
		|| gbReplying Then
			let gbByPassSayObjectTypeAndText=FALSE
		EndIf
		;Make read-only messages act like web pages and not say edit.
		If ! IsVirtualPcCursor () then
			;Just in case the user is running with the VPC option off:
			Pause (); allow time for caret to become visible.
			If CaretVisible ()
			|| gbReplying Then
				let gbReplying=FALSE
				IndicateControlType (WT_MULTILINE_EDIT)
			EndIf ; end of caret visible.
		EndIf ; end of vpc check.
		return TRUE
	EndIf ; end of cwcIEServer check.
EndIf ; end of objSubTypeCheck.
If GlobalCurrentControl==ciSearchResultsList
&& StringContains(GetWindowName(hWnd),scSearchResultsList) Then
	IndicateControlType(iTypeCode,wn_SearchResults)
	Return TRUE
EndIf

let gbByPassSayObjectTypeAndText=FALSE
; The To: field looses MSAA value at times...
If (sObjName==scToField
&& GlobalCurrentControl==To_Field) Then
	IndicateControlType(iTypeCode,scToField,cscSpace)
	Say( GetWindowTextEx (hWnd, FALSE, FALSE),ot_line)
	Return TRUE
EndIf
If sRealClass == wc_Ath_Note then
	If sFocusedClass == wc_Ath_Note
	|| GetWindowSubTypeCode (hWnd) == wt_ListView Then
		; Put focus in the message body...
		let hWndToFocus = FindWindowWithClassAndId (hWnd, CWC_RichEdit50W, 0)
		If hWndToFocus then
			SetFocus (hWndToFocus)
			Return (TRUE)
		EndIf
	EndIf
	If sFocusedClass == CWC_RichEdit50W
	&& sRealClass == wc_Ath_Note
	&& (! GetControlID (hWnd)) Then
		; We are indeed in the message body...
		;	WasAttachmentsStripped () ; Check to see if notification is there...
		If gbWMMessageHeaderVerbosity Then
			; The user has message header announcement toggled to Yes...
			ReadHeaderField2 (from_Field2, msg_from1_L)
			ReadHeaderField2 (subject_field, msg_subject1_L)
		EndIf
		Delay (4, TRUE)
		If gbWMMessageSayAllVerbosity Then
			; Make sure JAWS starts at the beginning of the message...
			NextCharacter() ; Necessary to keep next function from sounding system bell
			Pause()
			JAWSTopOfFile()
			SayAll()
		EndIf
		Return (TRUE)
	EndIf
EndIf
Return false
EndFunction

int function HandleCustomRealWindows (handle hwnd)
If DialogActive () then
	If GlobalRealWindowName==wnCheckSpelling then
		SayWindowTypeAndText(GlobalRealWindow)
		If GetWindowSubtypeCode(GetFocus())!=wt_button then
			Let gbReadMisspelledAndSuggestion=true
			MisspelledAndSuggestion (FALSE, TRUE)
			Return true
		EndIf
		Return true
	EndIf
EndIf
	Return false
EndFunction

Void Function TopEdgeEvent (handle WindowHandle)
var
	int iWinType
Let iWinType = GetWindowSubTypeCode (WindowHandle)
If BrailleFHPTopEdge () then
	Return
EndIf
if GetWindowClass(WindowHandle)==cwcIEServer
&& IsVirtualPCCursor()  Then
;	Beep()
	return
EndIf


If IsMessagesList (GetFocus()) then
	; Can't seem to get timing issue worked out, so gets ding in middle of list...
	Return
EndIf

If iWinType == WT_MULTISELECT_LISTBOX ||
iWinType == WT_EXTENDEDSELECT_LISTBOX ||
iWinType == WT_LISTBOX||
iWinType == WT_LISTVIEW ||
iWinType == WT_BUTTONLISTBOX then
	 SayLine(TRUE)
	ProcessBoundaryStrike (GlobalFocusWindow, TopEdge)
	Return
endIf
TopEdgeEvent(WindowHandle)
EndFunction

Void Function BottomEdgeEvent (handle WinHandle)
var
	int iWinType
Let iWinType = GetWindowSubTypeCode (WinHandle)
If BrailleFhpBottomEdge () then
	Return
EndIf
if GetWindowClass(WinHandle)==cwcIEServer
&& IsVirtualPCCursor()  Then
;	Beep()
	return
EndIf
If IsMessagesList (GetFocus()) then
	; Can't seem to get timing issue worked out, so gets ding in middle of list...
	Return
EndIf
If iWinType == WT_MULTISELECT_LISTBOX ||
iWinType == WT_EXTENDEDSELECT_LISTBOX ||
iWinType == WT_LISTBOX||
iWinType == WT_LISTVIEW ||
iWinType == WT_BUTTONLISTBOX then
	 SayLine(TRUE)
	ProcessBoundaryStrike (GlobalFocusWindow, BottomEdge)
	Return
endIf
BottomEdgeEvent(WinHandle)
EndFunction

void function SayNonHighlightedText (handle hwnd, string buffer)
var
	int iWinType,
	int iFocusWinType,
	int iControl,
	string strStatusBarText,
	string TheClass
let TheClass = GetWindowClass (hwnd)
let iControl = GetControlID (hwnd)
;Handle alt tabbing here
If GetWindowClass (hWnd) == cwc_Dlg32771 then
	Say (Buffer, OT_NONHIGHLIGHTED_SCREEN_TEXT)
	return
EndIf
If ! DialogActive () && ! GlobalMenuMode then
	let iWinType = GetWindowSubTypeCode (hWnd)
	If iWinType == WT_STATUSBAR then
		let iFocusWinType = GetWindowSubTypeCode (GetFocus ())
		If iFocusWinType == WT_TREEVIEW then
			If StringContains (buffer, scComma) then
				;let strStatusBarText = buffer
				let strStatusBarText = (StringSegment (buffer, scComma, 2))
				If (StringToInt (StringChopLeft (strStatusBarText , 1))) > 0 then
					Say (strStatusBarText , OT_NONHIGHLIGHTED_SCREEN_TEXT)
				EndIf
			EndIf
		EndIf
	EndIf
EndIf
SayNonHighlightedText (hwnd, buffer)
EndFunction

Void Function SayFocusedWindow ()
Var
	Handle hWnd,
	Int iControl,
	string sClass,
	int iObjType,
	int iWinType
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
; If plain text messages are being read with ReadPlainTextMessage function,
; return to keep "Read only edit" from being announced with each message.
If gbIsPlainTextMode Then
	let gbIsPlainTextMode=FALSE
	Return
EndIf
Let hWnd=GetFocus()
Let iControl=GetControlId(hWnd)
;Only handle the special composition windows here.
; spellchecker handling when real whindow has changed.
; this can occur when entering spellchecker,
; when message about having finished spellchecking selected text gains focus,
; or when message about the spellchecker being completed gains focus.
If globalPrevReal!=GetRealWindow(hWnd)
&& GetWindowName(GetRealWindow(hWnd))==wnCheckSpelling
&& iControl==ChangeTo_field then
	Return
ElIf GetWindowName(GetRealWindow(hWnd))==wnCheckSpelling then
	; focus is on a button.
	If iControl!=ChangeTo_field
	|| iControl!=NotInDictionary_field
	|| iControl!=ChangeTo_field2
	|| iControl!=OKButton
	&& !gbReadMisspelledAndSuggestion then
		SayObjectTypeAndText()
		return
	EndIf
	return
ElIf GetObjectTypeCode()==wt_Dialog
&& GetWindowClass(hWnd)==cwcIEServer
&& !GetWindowSubTypeCode(hwnd) Then
	IndicateControlType(wt_Edit)
EndIf
SayObjectTypeAndText ()
EndFunction

Int Function IsMessagesList (handle hwnd)
if GlobalWindowClass == wc_OutlookExpressMessageView
|| (GlobalWindowClass == wc_OutlookExpressBrowserClass
&& StringContains(GlobalRealWindowName,an_WindowsMail)) Then
	let gbNotAListViewYet=TRUE
	Return TRUE
EndIf
let gbNotAListViewYet=FALSE


If (GlobalWindowClass == cwcListView
&& (GetWindowClass (GetParent (hwnd)) == wc_OutlookExpressMessageList)) then
	return true;
endif
return false;
EndFunction

Void Function AutoStartEvent ()
let OutlookVersion = WM7
let gbMessageListHasFocus=FALSE
let gbDeleteKeyPressed=FALSE
If !gbOutlookExpressHasRunBefore Then
	let gbOutlookExpressHasRunBefore=TRUE
 LoadApplicationSettings ()
EndIf

EndFunction

void Function AutoFinishEvent ()
EndFunction

Void Function TurgbSuppressCheckforBoldOff ()
let iScheduledFunctionId = 0
let gbSuppressCheckForBold = false
EndFunction

void function SayHighlightedText (handle hwnd, string buffer, int nAttributes)
var
	int iObjType,
	int iControl,
	int iCount,
	string sClass,
	int iFocusWinType,
	int iRestLevel,
	int iTheCode,
	handle hTemp,
	string sGraphicCharacter
let iTheCode = GetWindowSubTypeCode (hWnd)
let iObjType=GetObjectSubTypeCode()
If (iObjType==wt_ListBoxItem && !InHJDialog())
|| iTheCode==wt_TreeView
|| iTheCode==wt_ListView
;The following keeps text Selection from speaking twice, once from text selection,
;and once from here.  Message body return TRUE for Forms Mode Active.
|| (IsFormsModeActive () && ! DialogActive ()
&& (iObjType == WT_MULTILINE_EDIT || iObjType == WT_DIALOG_PAGE))
&& !IsMessagesList (hWnd) Then
Return
EndIf
if GlobalMenuMode > 0 then
	SayHighlightedText (hWnd, buffer, nAttributes)
	return
EndIf
Let sClass = GetWindowClass (hWnd)
if dialogActive () ;&& hwnd != getFocus ()
&& sClass == cwcIEServer then
	if StringCompare (buffer, gs_PrevBuffer) != 0 then;Ensure we always speak a change, but only once.
		Say (buffer, OT_HIGHLIGHTED_SCREEN_TEXT)
	endIf
	Let gs_PrevBuffer = buffer
	Return;Let SayObjectActiveItem do this.
endIf
Let gs_PrevBuffer = buffer
;Kill From and Subject information from being spoken in Preview Pane:
If sClass == wc_MimeEditServer then
	Return
EndIf
let iControl = GetControlID (hwnd)
if DialogActive () then
	if GetWindowName (GetRealWindow (hWnd)) == wnCheckSpelling then
		if iTheCode == WT_EDIT
		|| iTheCode == WT_ReadOnlyEdit then
			Return
		EndIf
	EndIf ; End of Spell check
	let hTemp = GetFocus ()
	if hWnd != hTemp
	&& GetWindowSubTypeCode (hTemp) !=  WT_COMBOBOX then
		return
	EndIf
EndIf
if IsMessagesList (hwnd)  then	;this block is to say "Unread message" but not "read message" based on bolded text in message list view
	Return
EndIf
SayHighlightedText (hwnd, buffer, nAttributes)
EndFunction

Void Function ProcessSpeechOnNewTextEvent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
if nAttributes& ATTRIB_HIGHLIGHT
&& !gbSuppressReadMessage
&& !gbSuppressHighlightedMessage
&& IsMessagesList(GetFocus ()) then
	SayHighlightedText(hwnd, buffer, nAttributes)
	return
endIf
ProcessSpeechOnNewTextEvent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction



Script HotKeyHelp ()
var
	handle hwnd,
	string sClass,
	int iWinType,
	int iControl
if TouchNavigationHotKeys() then
	return
endIf
let hwnd = GetFocus ()
let sClass = GetWindowClass(hwnd)
let iWinType=GetWindowSubTypeCode(hWnd)
let iControl=GetControlId(hWnd)
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
; Message body
if (sClass == cwcIEServer || sClass == cwc_RichEdit20W )
&& iControl==FALSE Then
	; Is it read or edit?
	If IsVirtualPCCursor ()
	|| iWinType==WT_READONLYEDIT Then
		SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp1a_L)
	ElIf sClass==cwcIEServer
	&& !IsVirtualPCCursor () Then
		; Whether in plain text or HTML, when editing, the class is cwcIEServer
		; and the Virtual cursor is not enabled.
		SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp1b_L)
	EndIf
	return
endIf
let hwnd = GetAppMainWindow (hwnd)
let sClass = GetWindowClass (hwnd)
if (sClass == wc_MainAppWindow) then
	SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp2_L)
	Return
endif
PerformScript HotKeyHelp ()
EndScript

String Function GetCustomTutorMessage ()
var
	string sTutorMessage,
	string sWinName,
	string sRealName,
	handle hWnd,
	int iControl
let hWnd=GetFocus()
let sRealName=GetWindowName(GetRealWindow(hWnd))
let sWinName=GetWindowName(hWnd)
let iControl=GetControlId(hWnd)
If StringContains(sRealName,WnMessageRules) Then
	If (iControl==id_MessageRulesTabBar && GetWindowSubTypeCode(hWnd)==wt_TabControl) Then
		let sTutorMessage=FormatString (MsgMessageRulesTabControl, GetScriptKeyName(cscSayPriorCharacterScript), GetScriptKeyName(cscSayNextCharacterScript))
		Return sTutorMessage
	ElIf (StringContains(sWinName,wnBlockedSendersList) && iControl==id_BlockedSendersList) Then
		Return MsgBlockSendersModifyMessage
	EndIf
EndIf
Return cscNull
EndFunction

Script SayWindowPromptAndText ()
var
	handle hwnd,
	int iSubType,
	string sWord,
	int nMode
Let hWnd = GetCurrentWindow ()
Let iSubType = GetWindowSubTypeCode (hWnd)
If ! iSubType then
	Let iSubType = GetObjectSubTypeCode ()
EndIf
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
if IsPcCursor () then
	if GlobalMenuMode==TRUE  then
		let sWord = GetWord ()
		SayFormattedMessage (OT_SCREEN_MESSAGE, sWord)
		SayTutorialHelp (iSubType, TRUE)
		SayTutorialHelpHotKey (hWnd, TRUE)
		SpeakProgressBarInfo(TRUE)
		smmToggleTrainingMode(nMode)
		return
	endif
	if GlobalMenuMode > 1 then
		SayLine (TRUE)
		SayTutorialHelp (iSubType, TRUE)
		SayTutorialHelpHotKey (hWnd, TRUE)
		SpeakProgressBarInfo(TRUE)
		smmToggleTrainingMode(nMode)
		return
	endif
endif
if !HandleCustomWindows (hwnd)  then
	smmToggleTrainingMode(nMode)
	PerformScript SayWindowPromptAndText ()
Else
	SayTutorialHelp (iSubType, TRUE)
	SayTutorialHelpHotKey (hWnd, TRUE)
	IndicateComputerBraille (hwnd)
	SpeakProgressBarInfo(TRUE)
	smmToggleTrainingMode(nMode)
endif
EndScript

handle Function GetToolbar ()
var
	handle WinHandle
let WinHandle = FindDescendantWindow (GetAppMainWindow (GetFocus ()), tool_bar)
if (winHandle && GetWindowClass (winHandle) == wc_ToolBar) then
	return winHandle
endif
return FALSE
EndFunction

Script ToolbarList ()
var
	int iLoopCount,
	int iStopFlag,
	int iColToClick,
	int iRowToClick,
	int iIndex,
	int iRestriction,
	handle hWnd
if (DialogActive ()) then
	SayFormattedMessage (ot_error, msgToolbarListError1_L) ; "You must exit the current dialog in order to access the toolbar"
	return
EndIf
; Get toolbar handle
let hWnd=GetToolBar()
If !hWnd Then
	SayFormattedMessage(OT_ERROR,MsgToolBarListError2_L)
	Return
endif
; Use the same globals as the graphics tool bar routines.
let g_strGraphicsList = cscNull
let g_strGraphicsListX = cscNull
let g_strGraphicsListY = cscNull
; Get the names and x/y coordinatess of each button on  the toolbar...
SaveCursor()
InvisibleCursor()
let iRestriction=GetRestriction()
MoveToWindow(hWnd)
SetRestriction(RestrictWindow)
If GetObjectName()==msgMessageListTitle_L Then
	let iLoopCount=21
EndIf
While(iLoopCount<20)
	let iStopFlag=GetCursorCol() ; Used to test end of movement in window.
	If !(GetControlAttributes () & CTRL_GRAYED)
	&& StringLength(GetObjectName()) Then
		; Start assigning etext to strings...
		let g_strGraphicsList =g_strGraphicsList+GetObjectName()+scSeparator
		let g_strGraphicsListX =g_strGraphicsListX+IntToString(GetCursorCol()+5)+scSeparator
		let g_strGraphicsListY =g_strGraphicsListY+IntToString(GetCursorRow())+scSeparator
	EndIf
	NextChunk() ; Move to the next object.
	If iStopFlag==GetCursorCol() Then ; Can't move any further.
		let iLoopCount=21
	Else
		let iLoopCount=iLoopCount+1
	EndIf
EndWhile
SetRestriction(iRestriction)
RestoreCursor()

if	!(g_strGraphicsList)
||	StringContains(g_strGraphicsList,scThereAre) then
	SayFormattedMessage (ot_error, msgToolbarListError2_L) ; "Toolbar not found"
	return
endif

; Remove the final separator character
If StringRight (g_strGraphicsList, 1)==scSeparator Then
	let g_strGraphicsList = StringChopRight (g_strGraphicsList, 1)
EndIf
; Display menu.
let iIndex = DlgSelectItemInList (g_strGraphicsList,msgListName1, FALSE, TRUE)
if iIndex  then
	let gbSuppressEcho = on
	let iColToClick =
	StringToInt(StringSegment(g_strGraphicsListX,scSeparator, iIndex))
	let iRowToClick =
	StringToInt(StringSegment(g_strGraphicsListY,scSeparator, iIndex))
	SaveCursor()
	JAWSCursor()
	MoveTo(iColToClick,iRowToClick)
	LeftMouseButton()
	RestoreCursor ()
	let gbSuppressEcho = off
endif
EndScript

Void Function DocumentLoadedEvent ()
var
	handle hwnd
let gbByPassSayObjectTypeAndText=FALSE
let gbMessageWasRead=TRUE ; Sets flag to disable plain text mode reading function.
if DialogActive () then
	SayFocusedObject ()
	return
Endif
if GetWindowClass (GetAppMainWindow (GetFocus ())) != wc_Ath_Note then
	DocumentLoadedEvent ()
	return
endif
TurnOffFormsMode()
if BackForward == 1 then
	SayLine(TRUE)
	let BackForward=0
	return
endif
if GetWindowClass (GetFocus ()) == cwcIEServer then
	Let globalMessageWindow=GetFocus()
	PCCursor()
	if IsVirtualPCCursor() then
		let hwnd= FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), subject_field)
		if hwnd
		&& IsWindowVisible (hwnd) then
			; Check for stripped attachment notification
			WasAttachmentsStripped ()
			If gbWMMessageHeaderVerbosity Then
				ReadHeaderField2 (from_Field2, msg_from1_L)
				ReadHeaderField2 (subject_field, msg_subject1_L)
			EndIf
		endif
		;Speak Element count *after* from and sugject were announced:
		If gbWMMessageElementsVerbosity Then
			AnnounceDocumentElements()
		EndIf
		If gbWMMessageSayAllVerbosity Then
			SayAll()
		EndIf
	Endif
endif
EndFunction

int Function ReadHeaderField (int iControlID, string sFieldName)
var
	handle hwnd,
	string sName,
	string sText,
	int iTypeCode

let hwnd = FindDescendantWindow (GetRealWindow (GetFocus ()), iControlID)
if !(IsWindowVisible (hwnd)) then
	SayFormattedMessage (ot_error, sFieldName + msg_FieldNotFound1_L, sFieldName + msg_FieldNotFound1_S)
	return false
endif
if IsSameScript () then
	if hwnd == GetFocus () then
		SayWindowTypeAndText (hwnd)
		return true
	endif
	if hwnd then
;		SetFocus (hwnd)
; This code used as a workaround to the SetFocus bug.
		MoveToWindow(hWnd)
		Delay(1,TRUE)
		LeftMouseButton()
		PcCursor()
		return true
	else
		return false
	endif
else
	let iTypeCode=GetWindowSubTypeCode(hWnd)
	let sName = GetWindowName (hwnd)
	let sText = GetWindowTextEx(hWnd, READ_EVERYTHING,FALSE)
	BrailleMessage(sName+cscSpace+sText)
	SayMessage(ot_control_name,sName)
	Say(sText,ot_line)
	If IniReadInteger ("OutputModes", "Tutor", 1, "Default.jcf") > 0 then
		SayMessage (OT_SMART_HELP, msgHeaderTutor)
	EndIf
	Return true
endif
EndFunction

int Function ReadHeaderField2 (int iControlID, string sFieldName)
;The purpose of this function is so focus is not moved to a header field
;when document loaded event is called more than once.
var
	handle hwnd

let hwnd = FindDescendantWindow (GetRealWindow (GetFocus ()), iControlID)
if !(IsWindowVisible (hwnd)) then
	SayFormattedMessage (ot_error, sFieldName + msg_FieldNotFound1_L, sFieldName + msg_FieldNotFound1_S)
	return false
endif
	if hwnd == GetFocus () then
		SayWindowTypeAndText (hwnd)
		return true
	else
	SayMessage(ot_control_name,GetWindowName (hwnd))
	SayWindow (hWnd, READ_EVERYTHING)
	Return true
endif
EndFunction

Script ReadBccField ()
var
	int iVPC
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR,0)
ReadHeaderField (Bcc_Field, msg_bcc1_L)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR,iVPC)
EndScript

Script ReadCcField ()
var
	int iVPC
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR, 0)
ReadHeaderField (Cc_Field, msg_cc1_L)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR,iVPC)
EndScript

Script ReadDateField ()
var
	int iVPC
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR, 0)
ReadHeaderField (Date_Field, msg_date1_L)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR, iVPC)
EndScript

Script ReadFromField ()
var
	int iVPC
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR, 0)
If !(FindDescendantWindow (GetRealWindow (GetFocus ()), From_Field2)) then
	ReadHeaderField (From_Field, msg_from1_L)
Else
	ReadHeaderField (From_Field2, msg_from1_L)
EndIf
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR, iVPC)
EndScript

Script ReadSubjectField ()
var
	int iVPC
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR, 0)
ReadHeaderField (Subject_Field, msg_subject1_L)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR,iVPC)
EndScript

Script ReadToField ()
var
	int iVPC
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR, 0)
ReadHeaderField (To_Field, msg_to1_L)
;SetJcfOption(OPT_VIRTUAL_PC_CURSOR,iVPC)

EndScript

Script ReadFromAndSubjectFields ()
var
	int iVPC
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
SetJcfOption (OPT_VIRTUAL_PC_CURSOR, 0)
ReadHeaderField (From_Field2, msg_from1_L)
ReadHeaderField (Subject_Field, msg_subject1_L)
SetJcfOption(OPT_VIRTUAL_PC_CURSOR,iVPC)
EndScript


Int Function GetMessageWindowHandle ()
var
	string sClass

If FindWindow(GlobalRealWindow,wc_MimeEditServer,cscNull) Then
	let sClass=cwcIEServer
ElIf FindWindow(GlobalRealWindow,wcRichEdDocClass,cscNull) Then
	let sClass=cwc_RichEdit20W
Else
	let GlobalMessageWindow=ghNull
	Return FALSE
EndIf
let GlobalMessageWindow=FindWindowWithClassAndID(GlobalRealWindow,sClass,0)
Return TRUE
EndFunction

Script GoToMessageField ()
If !GetMessageWindowHandle() Then
	SayFormattedMessage (ot_ERROR, msg_NoOpenMessage1_L, msg_NoOpenMessage1_S);
	Return
ElIf GetFocus()==globalMessageWindow Then
	SayFormattedMessage (ot_error, msgAlreadyInMessageBody_L, msgAlreadyInMessageBody_S); "Already in Message Body Window"
	Return
EndIf
;SetFocus(globalMessageWindow)
; This code used as workaround to SetFocus bug.
MoveToWindow(globalMessageWindow)
Delay(1,TRUE)
LeftMouseButton()
PcCursor()
If IsVirtualPCCursor () Then
;	JAWSTopOfFile ()
EndIf
Delay(2,TRUE)
SayWindowTypeAndText(globalMessageWindow)
SayLine(TRUE)
Return
EndScript

void Function MisspelledAndSuggestion (int iShouldSayIncorrectSpell, int iBrlFlash)
Var
	handle hwnd,
	handle hTemp,
	Int iControl,
	string sBrlMsg,
	string sText,
	string sWinText,
	string sWinName
; sometimes the word in context is obscured by the spelling dialog.
; In such cases, the default script ReadWordInContext attempts to drag the dialog out of the way.
; this next flag is only set in the overridden DragDialogWindow function if the default script calls it.
; the flag is cleared before leaving that function to prepare for next time DragDialogWindow is needed.
If gbWordInContextFound then
	Return
EndIf
Delay(1,TRUE)
let iControl=GetCurrentControlId()
let hWnd=GetFocus()
let sWinName=GetWindowName(hWnd)
If sWinName==scYesButton
|| sWinName==scOkButton
&& GetWindowSubTypeCode(hWnd)==wt_Button then
; we are in the dialog to finish spelchecking the document after selected text is spellchecked
; So let HandleCustomRealWindows deal with it.
	Return
EndIf
let sWinText=cscNull
If GlobalRealWindowName  == wn_Spelling then
	; First, what is the object name--Capitilization, Not in Dictionary, or Repeated word?
	let sWinName=GetWindowName(FindDescendantWindow(GlobalRealWindow,ciSpellingPrompt))
	let sWinText=GetWindowTextEx(FindDescendantWindow(GlobalRealWindow,NotInDictionary_field),FALSE,TRUE)
	If sWinName Then
		Say (sWinName, OT_CONTROL_NAME)
		Say(sWinText,ot_line)
		SpellString(sWinText)
		If iBrlFlash Then
			let sBrlMsg =sWinName+cscSpace+sWinText+cscSpace
		EndIf
			;now see if there are any suggestions
		Let hTemp = FindDescendantWindow (GlobalRealWindow, 112)
		If hTemp then
			If ! GetWindowText (hTemp, FALSE) then
				SayFormattedMessage (OT_ERROR, msgNoSuggestions); "No suggestions"
				If iBrlFlash Then
					let sBrlMsg = sBrlMsg + msgNoSuggestions + cscSpace
				EndIf
			else
		let sWinName=GetWindowTextEx(FindDescendantWindow(GlobalRealWindow,ChangeTo_Prompt),FALSE,TRUE)
		let sWinText=GetWindowTextEx(FindDescendantWindow(GlobalRealWindow,ChangeTo_field),FALSE,TRUE)
				Say (sWinName, OT_CONTROL_NAME)
				Say (sWinText , OT_LINE)
				SpellString (sWinText)
				If iBrlFlash Then
					;let sBrlMsg =sWinName+cscSpace+sWinText+cscSpace
				EndIf
	;		let gbReadMisspelledAndSuggestion=FALSE
			EndIf ; no suggestions
			;If iBrlFlash Then
				;Per Track entry,
				;BrailleMessage is not used anymore.
				;Problem was that when doing multiple errors,
				;flash was unreliable.
				;However, Braille is fine without it.
				;BrailleMessage (sBrlMsg)
			;EndIf
		EndIf
	EndIf
Else
	If iShouldSayIncorrectSpell then
		Delay (4,TRUE)
		SayFormattedMessage (OT_ERROR, msgNotInSpellChecker); "Not in spell checker"
	EndIf
EndIf

EndFunction

Script ReadMisspelledAndSuggestion ()
If GetWindowName(GetRealWindow(GetFocus()))!= wn_Spelling Then
	PerformScript SelectALink()
	Return
EndIf
MisspelledAndSuggestion (TRUE, TRUE)
EndScript

Script NextMessage ()
If IsMessagesList (GetFocus ())
|| GetWindowClass(GetParent(GetFocus()))==cWcShellObject then
	; Not the message list or Outlook help...
	TypeCurrentScriptKey ()
Else
	TypeCurrentScriptKey ()
	SayFormattedMessage (ot_status, msg_NextMessage1_L, msg_NextMessage1_S)
	If !gbMessageWasRead Then
		let gbIsPlainTextMode=TRUE
		ScheduleFunction(sf_ReadPlainTextMessage,4)
	EndIf
EndIf
EndScript

Script PreviousMessage ()
If IsMessagesList (GetFocus ())
|| GetWindowClass(GetParent(GetFocus()))==cWcShellObject then
	; Not the message list or Outlook help...
	TypeCurrentScriptKey ()
Else
	TypeCurrentScriptKey ()
	SayFormattedMessage (ot_status, msg_PreviousMessage1_L, msg_PreviousMessage1_S)
	If !gbMessageWasRead Then
		let gbIsPlainTextMode=TRUE
		ScheduleFunction(sf_ReadPlainTextMessage,4)
	EndIf
EndIf
EndScript

Script DeleteMessage ()
var
	handle hWnd
let hWnd=GetFocus()
StopSpeech()
let gbDeleteKeyPressed=TRUE
TypeKey(ksDeleteMessage)
If IsMessagesList (hWnd) then
	If !lvGetItemCount (hWnd)Then
		SayCurrentScriptKeyLabel ()
	Else
		SayFormattedMessageWithVoice (VCTX_MESSAGE,OT_JAWS_MESSAGE, msg_DeleteMessage_L, msg_DeleteMessage_S)
	EndIf
	Return
EndIf
SayFormattedMessage (OT_JAWS_MESSAGE, msg_DeleteMessage_L, msg_DeleteMessage_S)
If !IsMessagesList(hWnd) Then
	If !gbMessageWasRead Then
		let gbIsPlainTextMode=TRUE
		ScheduleFunction(sf_ReadPlainTextMessage,2)
		let gbDeleteKeyPressed=FALSE
	EndIf
EndIf
EndScript

void Function ReportLinksNotAvailable(optional int reason)
If (product_MAGic == GetRunningFSProducts())
	ExMessageBox(cmsgMagNoLinks_L, SelectALinkDialogName, MB_OK)
	return
EndIf
SayFormattedMessage(ot_error, msgNoLinks_l)
EndFunction

Void Function NewSelectLink ()
if (!DlgListOfLinks()) then
	ReportLinksNotAvailable(NotAvailableReason_NotFound)
endif
EndFunction

/*
int function SelectALinkDialog()
var
	object doc,
	object links,
	object all,
	int nLinks,
	string buffer,
	string strTemp,
	int nIdx,
	int iActivatedVCursor
if InHJDialog () then
	SayFormattedMessage (OT_ERROR, msgAlreadyInHJDialog_L, msgAlreadyInHJDialog_S)
	return true
endif
if (IsHJTrackEngine ()) then
	if (GetJCFOption (OPT_VIRTUAL_PC_CURSOR) == 0) then
		SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 1)
		let iActivatedVCursor = 1
		Pause ()
		Delay (5,TRUE)
	EndIF
endif
if (IsVirtualPcCursor ()) then
	NewSelectLink ()
	if (iActivatedVCursor == 1) then
		SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
	endif
	return true
endif
if (iActivatedVCursor == 1) then
	SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
endif
let doc = ie4GetCurrentDocument ()
let links = doc.links
let all = doc.all
let nLinks = links.length
if (nLinks == 0) then
	SayFormattedMessage (ot_ERROR, msgNoLinks_L, msgNoLinks_S ); "No links found on page "
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
let nIdx = DlgSelectItemInList (buffer, scSelectALink, true)
if (nIdx == 0) then
	return true
endif
doc.links(nIdx-1).click
return true
EndFunction
*/

Script Enter ()
var
	handle hWnd
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	TypeCurrentScriptKey ()
	Let gbReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
	Return
EndIf

If IsMessagesList(GetFocus()) Then
	let gbWasMesssagesList=TRUE
Else
	let gbWasMesssagesList=FALSE
EndIf

if ! DialogActive ()
|| GlobalMenuMode then
	PerformScript Enter ()
	return
endif
PerformScript Enter () ; default
EndScript

Script GotoAttachmentsList ()
var
	int iCount,
	handle hwnd
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
let iCount = 0;
if GetWindowClass (GetCurrentWindow ())==cwcListView then
	SayWindowTypeAndText (GetFocus ())
	return
endif
let hwnd= GetAppMainWindow (GetFocus ())
if GetWindowClass (hwnd) != wc_Ath_Note  then
	; not in an open message
	SayFormattedMessage (ot_error, msg_NoOpenMessage1_L, msg_NoOpenMessage1_S);
	return
endif
; See if attachments have been stripped...
StopSpeech() ; Keeps SayAll from thinking Hkim dialog is invoked.
WasAttachmentsStripped()
Delay(2,TRUE)
SaveCursor ()
let hwnd = FindDescendantWindow (hwnd, subject_field)
InvisibleCursor ()
MoveToWindow (hwnd)
let hwnd = GetCurrentWindow ()
while (GetWindowClass (hwnd)!=cwcListView
&& iCount<=6)
	let hwnd= GetPriorWindow (hwnd)
	let iCount = iCount + 1
endwhile
RestoreCursor ()
if GetWindowClass (hwnd) == cwcListView
&& ! IsWindowObscured (hwnd) then
	Say(wnAttachmentList,ot_control_name)
	SetFocus (hwnd)
else
	SayFormattedMessage (ot_ERROR, msg_NoAttachments1_L, msg_NoAttachments1_S);
endif
EndScript

Script ScreenSensitiveHelp ()
var
	int iWinType,
	int iControl,
	handle hwnd,
	String sClass,
	string sObjName,
	string sHelp_L,
	string sHelp_s
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
if (IsSameScript ()) then
	AppFileTopic (topic_Outlook_Express_5)
	return
endif
let hwnd = GetFocus()
let iControl = GetControlId (hWnd)
let sClass = GetWindowClass (hwnd)
let iWinType = GetWindowSubTypeCode (hWnd)
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
; Date selection list in Advance Find.
If sClass==wc_DateTimePicker
&& (iControl==id_ReceivedBefore || iControl==id_ReceivedAfter) Then
	let sHelp_L=FormatString(msgDateTimePicker_L,GetScriptKeyName(csnSayPriorCharacterScript), 	GetScriptKeyName(csnSayNextCharacterScript),
	GetScriptKeyName(csnSayPriorLineScript), 	GetScriptKeyName(csnSayNextLineScript))
	let sHelp_S=FormatString(msgDateTimePicker_S,GetScriptKeyName(csnSayPriorCharacterScript), 	GetScriptKeyName(csnSayNextCharacterScript),
	GetScriptKeyName(csnSayPriorLineScript), 	GetScriptKeyName(csnSayNextLineScript))
	SayMessage (OT_USER_BUFFER, sHelp_L,sHelp_S)
	AddHotKeyLinks ()
	Return
EndIf
; for message and address book list
if (sClass ==cwcListView) then
	let sHelp_L=FormatString(msgScreenSensitiveHelpMesssageList_L, GetScriptKeyName(csnSayPriorLineScript),
	GetScriptKeyName(csnSayNextLineScript),GetScriptKeyName(csnEnterScript))
	let sHelp_S=FormatString(msgScreenSensitiveHelpMesssageList_S, GetScriptKeyName(csnSayPriorLineScript),
	GetScriptKeyName(csnSayNextLineScript),GetScriptKeyName(csnEnterScript))
	SayMessage (OT_USER_BUFFER, sHelp_L,sHelp_S)
	AddHotKeyLinks ()
	return
endIf
; Message body
if (sClass == cwcIEServer || sClass == cwc_RichEdit20W )
&& iControl==FALSE Then
	; Is it read or edit?
	If IsVirtualPCCursor ()
	|| iWinType==WT_READONLYEDIT Then
		SayMessage (ot_USER_BUFFER, msgScreenSensitiveHelp1a_L); "This is the message body window . ..."
	ElIf sClass==cwcIEServer
	&& !IsVirtualPCCursor () Then
		; Whether in plain text or HTML, when editing, the class is cwcIEServer
		; and the Virtual cursor is not enabled.
		SayMessage (ot_USER_BUFFER, msgScreenSensitiveHelp1b_L); "This is the message body window . ..."
	EndIf
	AddHotKeyLinks ()
	return
endIf
;For the list of links list
if (GetWindowName (GetRealWindow (GetCurrentWindow())) == wnLinks_List) then
	if (iWinType == WT_LISTVIEW) then
	let sHelp_L=FormatString(msgScreenSensitiveHelp7_L, GetScriptKeyName(csnSayPriorLineScript),
	GetScriptKeyName(csnSayNextLineScript),GetScriptKeyName(csnEnterScript), GetScriptKeyName(csnTabKeyScript))
		SayFormattedMessage(OT_USER_BUFFER,sHelp_L)
		AddHotKeyLinks ()
		return
	elIf iWinType == WT_BUTTON then
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
		else
			ScreenSensitiveHelpForKnownClasses (WT_BUTTON)
			return
		endIf
	elif iWinType == WT_RADIOBUTTON then
		let sObjName = GetGroupBoxName ()
		if sObjName == scSortLinks then
			SayMessage (OT_USER_BUFFER, msgSortLinks)
			AddHotKeyLinks ()
			return
		elIf sObjName == scDisplayLinks then
			SayMessage (OT_USER_BUFFER, msgDisplayLinks)
			AddHotKeyLinks ()
			return
		else
			ScreenSensitiveHelpForKnownClasses (WT_RADIOBUTTON)
			return
		endif
	else
		ScreenSensitiveHelpForKnownClasses (iWinType)
		return
	endif
endif
if	 (GetWindowSubtypeCode (GetCurrentWindow()) == WT_LISTBox ) &&
(GetWindowName (GetRealWindow (hWnd)) == wnToolBarList ) then
	SayMessage (ot_USER_BUFFER, msgScreenSensitiveHelp3_L); "this is a list of the buttons in the Outlook Express toolbar... "
	AddHotKeyLinks ()
	return
endif
If GetWindowName(hWnd)==wnBlockedSendersList
&& iControl==id_BlockedSendersList Then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp8_L)
		AddHotKeyLinks ()
		return
EndIf
PerformScript ScreenSensitiveHelp ()
EndScript


Script JAWSEnd ()
var
	handle hWnd,
	int iItemCount
let hWnd=GetFocus()
let iItemCount=lvGetItemCount (hWnd)
If IsMessagesList(hWnd) Then
	SayCurrentScriptKeyLabel ()
	JAWSEnd ()
	lvSelectItem (hWnd, iItemCount, 1)
	Return
EndIf
PerformScript JAWSEnd ()


EndScript

script End ()
performScript JAWSEnd ()
endScript

Script JAWSHome ()
var
	handle hWnd
let hWnd=GetFocus()
If IsMessagesList(hWnd) Then
	SayCurrentScriptKeyLabel ()
	JAWSHome ()
	lvSelectItem (hWnd, 1, 1)
	Return
EndIf
PerformScript JAWSHome()
EndScript

script Home ()
performScript JAWSHome ()
endScript

void function DoDelete ()
var
	handle hwnd,
	string theClass
let hwnd = GetFocus ()
let TheClass = GetWindowClass (hwnd)
let gbDeleteKeyPressed=TRUE

if IsMessagesList(hWnd) then
	If !lvGetItemCount (hWnd)Then
		SayCurrentScriptKeyLabel ()
	Else
		SayFormattedMessageWithVoice (VCTX_MESSAGE,OT_JAWS_MESSAGE, msg_DeleteMessage_L, msg_DeleteMessage_S)
	EndIf
	let gbLineHasSpoken=TRUE
	TypeKey(cksDelete ); delete
	Delay(1,TRUE)
	MSAARefresh()
	Delay(1,TRUE)
;	SayLVItemCheckStatus (hWnd)
	If IsUnReadMessage() then
		SayFormattedMessage (OT_SCREEN_MESSAGE, msg_UnreadMessage_S)
	EndIf
	SayObjectActiveItem(FALSE)
	Return
EndIf
; Are we in a message body)
if (TheClass == cwcIEServer && IsVirtualPcCursor ())
|| (TheClass == cwc_RichEdit20W && GetWindowSubTypeCode(GetFocus()) == WT_READONLYEDIT) Then
	PerformScript DeleteMessage()
	return
EndIf
DoDelete()
EndFunction

void function FocusChangedEventEx (handle hwndFocus,int nObject,int nChild,handle hwndPrevFocus, int nPrevObject, int nPrevChild,	int nChangeDepth)
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
SetGlobalVariables(hWndFocus,TRUE) ; Initialize globals with currently focused item values.
let GlobalWindowOwner=StringSegment(GetWindowOwner (GetFocus()),scDoubleBackslash,-1)
; Check for Digital Security and mis-focus on plain text messages.
If GlobalWindowClass==wc_MEDocHost
&& GlobalCurrentControl==1000 Then
;If	 StringContains(GlobalWindowClass,wc_ATH_Note) Then
	Pause()
	TypeKey(cksTab)
	Return
EndIf
If GlobalWindowClass==cwcListView Then
	let gbMessageListHasFocus=IsMessagesList(hWndFocus)
Else
	let gbMessageListHasFocus=FALSE
EndIf
FocusChangedEventEx (hwndFocus, nObject,nChild,hwndPrevFocus,nPrevObject, nPrevChild,nChangeDepth)
EndFunction


void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle hwnd,
	handle hSubject,
	int iTitleSpoken,
	string sWinName

if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
SetGlobalVariables(FocusWindow,TRUE)
let hSubject = FindDescendantWindow (GlobalRealWindow, Subject_Field)
let hwnd = FindWindow (GetFirstChild (GetFocus ()), cwcIEServer, cscNull)
let iTitleSpoken = FALSE
let sWinName=GetWindowName(GlobalAppWindow)
if GlobalPrevApp != GlobalAppWindow
&& GlobalAppWindow != FocusWindow then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
	if GlobalRealWindowName == wnCheckSpelling  then
		;Let HandleCustomRealWindows deal with saying this realWindow name so that it is not double spoken.
	Else
		; set the iTitle Spoken flag to true to keep real window logic from repeating the title of the window.
		let iTitleSpoken = TRUE
		If InHjDialog () then
			; make sure HJ dialogs speak the control type
			IndicateControlType (WT_DIALOG, GlobalRealWindowName, cscSpace)
		ElIf gbSayTitle Then
		; Announce the title if it is a new message, forward, or reply...
			Say (sWinName, OT_LINE)
			let gbSayTitle=FALSE
		Else
			Say (sWinName, OT_DOCUMENT_NAME)
		EndIf
	EndIf
EndIf
If GlobalPrevRealName != GlobalRealWindowName ; name has changed
|| GlobalPrevReal != GlobalRealWindow then ; or handle has changed, then
	If GlobalRealWindow != GlobalAppWindow
	&& GlobalRealWindow != FocusWindow then
		If ! HandleCustomRealWindows (GlobalRealWindow)  then
			SayWindowTypeAndText (GlobalRealWindow)
		EndIf
	; even though the real window handle or name may have changed,  a check must be performed
	; to determine if the real window and the app window are the same
	; and theprevious window is not that of the subject edit field.
	; By making sure the prev window is not the same as the subject, JAWS does not speak the subject text
	; when focus moves to the message body when a new message is being created.
	; Otherwise, this code block causes JAWS to speak the subject text when replying to a new a message in OE.
	ElIf GlobalAppWindow == GlobalRealWindow
	&& PrevWindow !=hSubject  Then
		If !iTitleSpoken Then; only speak the real window if it was not spoken as a part of the app  change
			If !GlobalMenuMode then
				If !FindWindow (GlobalAppWindow, cwcIEServer, cscNull)
				&& GlobalWindowClass==wc_Ath_Note
				&& gbWasMesssagesList Then
					; No ie_server class found, must be plain text mode.
					let gbIsPlainTextMode=TRUE
					let gbMessageWasRead=FALSE
					;Say (GlobalRealWindowName, OT_WINDOW_NAME)
					;ReadPlainTextMessage()
				Else
					SayWindowTypeAndText (GlobalRealWindow)
				EndIf
			EndIf
		EndIf
	EndIf
EndIf
let GlobalFocusWindow = FocusWindow
if globalPrevFocus != focusWindow then
	if ! HandleCustomWindows (FocusWindow) then
		SayFocusedWindow ()
		; will use global variable GlobalFocusWindow
	EndIf
Else
	if ! IsWindowVisible ((FindTopLevelWindow(cwc_Dlg32771,cscNull))) then
		;Otherwise, we speak links when we're alt tabbing.
		SayFocusedObject ()
	EndIf
EndIf
;now set all the global variables for next time.

SetGlobalVariables(GlobalFocusWindow,FALSE)
EndFunction

Void Function SetGlobalVariables (handle FocusWindow, int iInitializeCurrent)
If iInitializeCurrent Then
	; Initialize variables with currently focused items...
	let GlobalRealWindow = GetRealWindow (FocusWindow)
	let GlobalRealWindowName = GetWindowName (GlobalRealWindow)
	let GlobalAppWindow = GetAppMainWindow (FocusWindow)
	let GlobalWindowName=GetWindowName(FocusWindow)
	let GlobalCurrentControl=GetControlID(FocusWindow)
	let giObjType=GetObjectSubTypeCode()
	let GlobalWindowClass=GetWindowClass(FocusWindow)
	let GlobalObjectName=GetObjectName(TRUE)
	let gsPrevObjValue=cscNull
Else ; Initialize variables as previously focused items...
	let gbFocusHasChanged=FALSE
	let globalPrevControl=GlobalCurrentControl
	let GlobalPrevReal = GlobalRealWindow
	let GlobalPrevRealName = GlobalRealWindowName
	let GlobalPrevApp = GlobalAppWindow
	let GlobalPrevFocus = FocusWindow
	let GlobalPrevObjectName=GlobalObjectName
	GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndIf
EndFunction

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	handle hWnd,
	int iControl,
	string sState,
	int iTypeCode
if KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	let hWnd = GetFocus()
	let iControl = GetControlID(hWnd)
	let iTypeCode=GetWindowSubTypeCode(hWnd)
	; Rules wizard...
	If IsMessageRules(hWnd)
	&& iTypeCode==wt_ListView Then
		Delay(2,TRUE)
		SayObjectActiveItem()
		 Return true
	EndIf
	; If we are in the Columns Dialog list...
	If IsWindowVisible (ghShowButton) Then
		SpeechOff()
		SaveCursor()
		RouteJAWSToPc()
		JAWSCursor()
		SetRestriction(RestrictWindow)
		JAWSHome()
		LeftMouseButton()
		Delay(1,TRUE)
		SpeechOn()
		PcCursor()
		SayLine(TRUE)
		Return true
	EndIf
	; Find message area...
	if iControl==id_ReceivedBefore
	|| iControl==id_ReceivedAfter then
		if GetWindowName(GetRealWindow(hWnd))==wnFindMessage then
			Delay(3,TRUE)
			let sState = cscNull  ;ensure null in case state canot be determined
			SaveCursor()
			RouteInvisibleToPC()
			if FindGraphic(hWnd,scCorner,s_top,s_restricted) then
				let sState = msgNotChecked
			ElIf FindGraphic(hWnd,scCheckMark,s_top,s_restricted) then
				let sState = MSGChecked
			EndIf
			RestoreCursor()
			SayMessage(ot_item_state,sState)
			return true
		else
			return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
		EndIf
	EndIf
	If IsMessagesList (GetFocus())
	&& iTypeCode==wt_ListView Then
		Pause()
		If GetCharacterAttributes() & ATTRIB_HIGHLIGHT Then
			Say(cmsgSelected,ot_select)
			Return true
		EndIf
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Script SayLine ()
var
	handle hWnd
If IsSameScript () Then
	SpellLine ()
	Return
EndIf
let hWnd=GetFocus()
If IsPcCursor () &&
! GlobalMenuMode then
	If GetWindowClass(hWnd)==cwc_ComboLBox  Then
		Say(GetWindowTextEx (hWnd, TRUE, FALSE),ot_line)
		Return
	EndIf

	; Message rules wizard...
	If IsMessageRules(GetFocus())
	&& GetWindowSubTypeCode(GetFocus())==wt_ListView Then
;  Say(GetFromStartOfLine(),OT_ITEM_STATE,TRUE)
		SayObjectActiveItem ()
		Return
	EndIf

	If IsMessagesList (GetFocus ()) then
		SayLine (TRUE)
		Return
	EndIf
	; If we are in the Columns Dialog list...
	If IsWindowVisible (ghShowButton) Then
;  Say(GetFromStartOfLine(),OT_ITEM_STATE,TRUE)
		SayLine(TRUE)
		Return
	EndIf
EndIf ; End of Pc cursor.
PerformScript SayLine ()
EndScript

Script SayNextCharacter ()
var
	handle hWnd
If UserBufferIsActive ()
|| IsInvisibleCursor ()
|| IsJAWSCursor () Then
	PerformScript SayNextCharacter()
	Return
EndIf
let hWnd=GetFocus()
If IsMessagesList (hWnd) Then
	NextCharacter()
	Delay(1,TRUE)
	SayLine(TRUE)
	Return
EndIf
PerformScript SayNextCharacter()
EndScript

Script SayPriorCharacter ()
var
	handle hWnd
If UserBufferIsActive ()
|| IsInvisibleCursor ()
|| IsJAWSCursor () Then
	PerformScript SayPriorCharacter()
	Return
EndIf
let hWnd=GetFocus()
If IsMessagesList (hWnd) Then
	PriorCharacter()
	Delay(1,TRUE)
	SayLine(TRUE)
	Return
EndIf
PerformScript SayPriorCharacter()
EndScript

Script SayNextLine ()
var
	handle hWnd,
	string sObjName,
	int iControl
If UserBufferIsActive ()    Then
	PerformScript SayNextLine ()
	Return
EndIf

If IsPcCursor () then
	let iControl=GetCurrentControlID()
	let hWnd=GetFocus()
	let sObjName=GetObjectName()
	;Keep Font dialog edits from speaking twice when arrowing ur ordown.
	;Thic code prevents the word "Edit" from speaking:
	if dialogActive ()
	&& ! getWindowSubtypeCode (hwnd) && getObjectSubtypeCode (TRUE) == WT_EDIT
	&& getWindowClass (hwnd) == cwcIEServer then
		NextLine ()
		Return
	endIf
	; Date picker in Find Message dialog...
	If (iControl==id_ReceivedBefore
	|| iControl==id_ReceivedAfter
	&& GetWindowName(GetRealWindow(hWnd))==wnFindMessage) then
		NextLine()
		Say( GetWindowTextEx (hWnd, TRUE, FALSE),ot_line)
		Return
	EndIf
	If GlobalRealWindowName==wn_FontDialog
	&& (sObjName==wn_FontList
	|| sObjName==wn_SizeList
	|| sObjName==wn_StyleList) Then
		NextLine()
		Say(GetObjectValue(),ot_line)
		Return
	EndIf

	If IsMessagesList (hWnd)
	&& gbDeleteKeyPressed Then
		let gbDeleteKeyPressed=FALSE
		NextLine()
		Delay(1,TRUE)
		MSAARefresh()
;		SayLVItemCheckStatus (hWnd)
		If IsUnReadMessage() then
			SayFormattedMessage (OT_SCREEN_MESSAGE, msg_UnreadMessage_S)
		EndIf
		SayObjectActiveItem(FALSE)
		let gbLineHasSpoken=FALSE
		Return
	EndIf
	If !GlobalMenuMode  then
		If GetWindowSubTypeCode (hWnd) == WT_TREEVIEW then
			NextLine ()
			Return
		EndIf
	EndIf
endif
PerformScript SayNextLine ()
EndScript

Script SayPriorLine ()
var
	handle hWnd,
	string sObjName,
	int iControl
If UserBufferIsActive ()  Then
	PerformScript SayPriorLine ()
	Return
EndIf
If IsPcCursor () then
	let iControl=GetCurrentControlID()
	let hWnd=GetFocus()
	let sObjName=GetObjectName()
	;Keep Font dialog edits from speaking twice when arrowing ur ordown.
	;Thic code prevents the word "Edit" from speaking:
	if dialogActive ()
	&& ! getWindowSubtypeCode (hwnd) && getObjectSubtypeCode (TRUE) == WT_EDIT
	&& getWindowClass (hwnd) == cwcIEServer then
		PriorLine ()
		Return
	endIf
	; Date picker in Find Message dialog...
	If (iControl==id_ReceivedBefore
	|| iControl==id_ReceivedAfter
	&& GlobalRealWindowName==wnFindMessage) then
		PriorLine()
		Say( GetWindowTextEx (hWnd, TRUE, FALSE),ot_line)
		Return
	EndIf

	If GlobalRealWindowName==wn_FontDialog
	&& (sObjName==wn_FontList
	|| sObjName==wn_SizeList
	|| sObjName==wn_StyleList) Then
		PriorLine()
		Say(GetObjectValue(),ot_line)
		Return
	EndIf

	If IsMessagesList (hWnd)
	&& gbDeleteKeyPressed Then
		let gbDeleteKeyPressed=FALSE
		PriorLine()
		let gbLineHasSpoken=TRUE
		Delay(1,TRUE)
		MSAARefresh()
;		SayLVItemCheckStatus (hWnd)
		If IsUnReadMessage() then
			SayFormattedMessage (OT_SCREEN_MESSAGE, msg_UnreadMessage_S)
		EndIf
		SayObjectActiveItem(FALSE)
		Return
	EndIf

	If !GlobalMenuMode  then
		If GetWindowSubTypeCode (GetFocus ()) == WT_TREEVIEW then
			PriorLine ()
			Return
		EndIf
	EndIf
EndIf
PerformScript SayPriorLine ()
EndScript

script DeleteWord ()
; Deletes a word in email message
TypeCurrentScriptKey() ;pass it through, even if user applies keystroke in wrong situation
Pause()
if CaretVisible() then
	SayWord()
EndIf
EndScript

Script IgnoreButton ()
var
	handle hWnd
TypeKey(ksSpellCheckIgnore)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let gbReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script IgnoreAllButton ()
var
	handle hWnd
TypeKey(ksSpellCheckIgnoreAll)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let gbReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script DeleteButton ()
var
	handle hWnd
TypeKey(ksSpellCheckDelete)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let gbReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script ChangeButton ()
var
	handle hWnd
TypeKey(ksSpellCheckChange)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let gbReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script ChangeAllButton ()
var
	handle hWnd
TypeKey(ksSpellCheckChangeAll)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let gbReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script AddToDictionaryButton ()
var
	handle hWnd
TypeKey(ksSpellCheckAddToDictionary)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let gbReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script UndoButton ()
var
	handle hWnd
TypeKey(ksSpellCheckUndo)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let gbReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Void function ScreenStabilizedEvent(handle hwndLastScreenWrite)
; Test if focus has been lost, and tries to redirect it to previous focus.
If !GetFocus() && !gbWasMesssagesList Then
	SetFocus(GlobalPrevFocus)
	Return
EndIf
;If !GetFocus()  Then
;LeftMouseButton()
;	Delay(1,TRUE)
;Return
;EndIf

; the following tests whether flag has been set in DragDialogWinodw function.
; This only happens in spellchecker when word in context script is called and dialog must be dragged out of the way.
if GetWindowName(GetRealWindow(GetFocus()))==wnCheckSpelling
	&& gbDlgDragged then
	let gbDlgDragged=false
	Return
EndIf
endFunction

function DragDialogWindow ()
var
	int DragFromX,
	int DragFromY,
	int iJAWSCol,
	int iJAWSRow,
	string DragObject,
	int x,
	int y,
	String strObject
If GetWindowName(GetRealWindow(globalFocusWindow))==wnCheckSpelling then
	Let gbWordInContextFound=true
EndIf
JAWSCursor ()
Let iJAWSCol = GetCursorCol ();For JAWSCursor
Let iJAWSRow = GetCursorRow ()
MoveToWindow (GetRealWindow (GetFocus ()))
let DragFromX = getCursorCol ()
let DragFromY = getCursorRow () ;save position of spell dialog
let DragObject = GetWord ()
;now move to the top of the app
MoveToWindow (GetAppMainWindow (GetFocus ()))
let x = getCursorCol ()
let y = getCursorRow () ;save position to move to
; make sure that the left mouse button is unlocked
If IsLeftButtonDown () then
	LeftMouseButtonLock ()
	pause ()
endIf
MoveTo (DragFromX, DragFromY) ;go back to spell dialog
Pause ()
let strObject = GetWord()
LeftMouseButtonLock () ; lock it down
pause ()
MoveTo (x,y) ;drag it
Let gbDlgDragged=true ; cleared in Screen StabilizedEvent.
LeftMouseButtonLock () ;unlock
MoveTo (iJAWSCol, iJAWSRow);Put the JAWSCursor back where it was,
;so the mouse isn't visually unpleasant
; reset gbWordInContextFound for next time.
If gbWordInContextFound then
	Let gbWordInContextFound=false
EndIf
PCCursor ()
EndFunction

 Void Function TurgbSuppressHighlightOff ()
let iScheduledHighlightFunctionId = 0
let gbSuppressHighlightedMessage = FALSE
EndFunction

Void Function SayLVItemCheckStatus (handle hWnd)
var
	int iState
If IsMessagesList (hWnd) Then
	let iState = lvGetItemState(hWnd,lvGetFocusItem(hWnd))
	if iState & lv_ItemChecked then
		sayUsingVoice(VCTX_MESSAGE,cMsgExpanded,OT_ITEM_STATE)
	ElIf iState & lv_ItemNotChecked then
		sayUsingVoice(VCTX_MESSAGE,cMsgCollapsed,OT_ITEM_STATE)
	EndIf
 return
EndIf

; If in Message Rules, let SayNext/PriorLine handle it.
If IsMessageRules(hWnd)
|| GetControlId(hWnd)==ciColumnsDialogList Then
;  Say(GetFromStartOfLine(),OT_ITEM_STATE,TRUE)
  Return TRUE
EndIf
SayLVItemCheckStatus (hWnd)
EndFunction

; Is Message Rules area...
int Function IsMessageRules(handle hWnd)
var
	string sMainAppName,
	string sTopLevelName,
	int iControlID
let sMainAppName=GetWindowName(GetAppMainWindow(hWnd))
let sTopLevelName=GetWindowName(GetTopLevelWindow(hWnd))
let iControlID=GetCurrentControlId()
If  StringContains(sMainAppName,wnMessageRules)
|| StringContains(sMainAppName,wnNewMailRule)
|| StringContains(sMainAppName,wnNewNewsRule)
|| StringContains(sTopLevelName,wnMessageRules)
|| iControlID==id_RulesList
|| iControlID==id_CriteriaList
|| iControlID==id_ActionsList
|| iControlID==id_BlockedSendersList Then
	Return TRUE; Is in Message Rules area
Else
	Return FALSE ; not in Message Rules area.
EndIf
EndFunction


Void Function WasAttachmentsStripped()
var
handle hWnd
; If attachments have been stripped, then the one-line notification will be
; just above the From: field, within the message header.
; Check to see if the message header is present,
let hWnd=FindDescendantWindow(GetAppMainWindow(GetFocus()),message_header)
If hWnd Then
; then check to see if the notification is there.
	SaveCursor()
	InvisibleCursor()
	MoveToWindow(hWnd) ; move to that window.
	Delay(2)
	If StringContains(GetLine(),cscAttachmentsRemoved) Then
		; If it is there, announce that message...
		SayFormattedMessage(OT_SCREEN_MESSAGE,GetLine())
	EndIf ; End ofa nnounce message.
	RestoreCursor()
EndIf ; End of window exists.
EndFunction

Void Function ReadPlainTextMessage()
; Plain text messages do not get processed by DocumentLoadedEvent,
; so process them here.
If GetWindowClass(GetFocus())==wc_Ath_Note
|| GetWindowSubTypeCode(GetFocus())==cwcListView Then
	; Put focus in the message body...
	TabKey()
	Delay(3,TRUE)
EndIf
If GetWindowClass(GetFocus())==cwc_RichEdit50W
&& !GetControlId(GetFocus()) Then
	; We are indeed in the message body...
;	WasAttachmentsStripped () ; Check to see if notification is there...
Delay(3,TRUE)
	If gbWMMessageHeaderVerbosity Then
	; The user has message header announcement toggled to Yes...
		ReadHeaderField2 (from_Field2, msg_from1_L)
		ReadHeaderField2 (subject_field, msg_subject1_L)
	EndIf
	Delay(4,TRUE)
	If gbWMMessageSayAllVerbosity Then
		; The user has Read messages automatically set to Yes...
		; Make sure JAWS starts at the beginning of the message...
;		NextCharacter() ; Necessary to keep next function from sounding system bell
;		Pause()
;		JAWSTopOfFile()
		SayAll(TRUE)
	EndIf
EndIf
let globalMessageWindow=GetFocus()
Return
EndFunction

; Braille functions
  Int Function BrailleAddObjectUnRedStatus (int nSubTypeCode)
If ! (IsMessagesList (GetFocus ())) then
	Return FALSE
EndIf
If IsUnReadMessage () then
	BrailleAddString (msgBrlUnread,0,0,0)
	Return TRUE
EndIf
Return FALSE
EndFunction

Int Function BrailleAddObjectUnRedMsgs (int nSubTypeCode)
Var
	handle hWnd,
	string sUnRedMsgs
let hWnd = GetFocus ()
If GetWindowName (GetRealWindow (hWnd)) != wnGoToFolder  Then
	If GetWindowName (hWnd) == wnFolderList  Then
		let sUnRedMsgs = RetrieveNumberOfUnReadMessages  ()
		If !StringIsBlank (sUnRedMsgs) Then
			BrailleAddString (sUnRedMsgs,0,0,0)
			return TRUE
		EndIf
	EndIf
EndIf

return FALSE
EndFunction

Function SayWindowTypeAndText (handle hWnd)
If DialogActive () Then
	If GetWindowName(hWnd)==wnFindMessage Then
	; This dialog announces MSAA static text in addition to the window title, so this fixes that.
			IndicateControlType (WT_DIALOG, wnFindMessage, cscSpace)
		Return
	EndIf
EndIf
SayWindowTypeAndText(hWnd)
Return
EndFunction

Script AdjustJAWSVerbosity ()
Var
	int iPrevMessageSayAllVerbosity,
	int iPrevMessageHeaderVerbosity,
	int iPrevMessageElementsVerbosity,
	string sList
;	save the current values
let  iPrevMessageSayAllVerbosity = gbWMMessageSayAllVerbosity
let  iPrevMessageHeaderVerbosity = gbWMMessageHeaderVerbosity
let  iPrevMessageElementsVerbosity = gbWMMessageElementsVerbosity

	let sList = jvToggleMessageHeaderVerbosity
	+ jvToggleMessageSayAllVerbosity
	+ jvToggleMessageElementsVerbosity

JAWSVerbosityCore (sList)

If iPrevMessageSayAllVerbosity != gbWMMessageSayAllVerbosity
|| iPrevMessageHeaderVerbosity != gbWMMessageHeaderVerbosity
|| iPrevMessageElementsVerbosity != gbWMMessageElementsVerbosity Then
	If saveApplicationSettings() then
		SayUsingVoice(VCTX_MESSAGE, msgAppSettingsSaved1_L,OT_STATUS)
	Else
		SayFormattedMessage(ot_error, msgAppSettingsNotSaved1_L)
	EndIf
EndIf
EndScript

Script AdjustJAWSOptions()
Var
	int iPrevMessageSayAllVerbosity,
	int iPrevMessageHeaderVerbosity,
	int iPrevMessageElementsVerbosity,
	string sList
;	save the current values
let  iPrevMessageSayAllVerbosity = gbWMMessageSayAllVerbosity
let  iPrevMessageHeaderVerbosity = gbWMMessageHeaderVerbosity
let  iPrevMessageElementsVerbosity = gbWMMessageElementsVerbosity
OptionsTreeCore(GetWindowsLiveMailOptionsBranch(GetActiveConfiguration ()+NODE_PATH_DELIMITER),true)
If iPrevMessageSayAllVerbosity != gbWMMessageSayAllVerbosity
|| iPrevMessageHeaderVerbosity != gbWMMessageHeaderVerbosity
|| iPrevMessageElementsVerbosity != gbWMMessageElementsVerbosity Then
	If saveApplicationSettings() then
		SayUsingVoice(VCTX_MESSAGE, msgAppSettingsSaved1_L,OT_STATUS)
	Else
		SayFormattedMessage(ot_error, msgAppSettingsNotSaved1_L)
	EndIf
EndIf
EndScript

Int Function SaveApplicationSettings ()
; save personal preferences
Var
	int iResult
let iResult=IniWriteInteger (snOptions, HKey_MessageHeader, gbWMMessageHeaderVerbosity , fn_WindowsMailJsi)
IniWriteInteger (snOptions, HKey_MessageElements, gbWMMessageElementsVerbosity , fn_WindowsMailJsi)
IniWriteInteger (snOptions, HKey_MessageSayAll, gbWMMessageSayAllVerbosity , fn_WindowsMailJsi )
return iResult
EndFunction

Void Function LoadApplicationSettingsLegacy ()
; Load personal preferences
Let gbWMMessageSayAllVerbosity = IniReadInteger (snOptions, HKey_MessageSayAll, TRUE, fn_WindowsMailJsi )
Let gbWMMessageHeaderVerbosity = IniReadInteger (snOptions, HKey_MessageHeader, TRUE, fn_WindowsMailJsi )
Let gbWMMessageElementsVerbosity = IniReadInteger (snOptions, HKey_MessageElements, TRUE, fn_WindowsMailJsi )
EndFunction

void function loadNonJCFOptions ()
gbWMMessageSayAllVerbosity = GetNonJCFOption (hKey_MessageSayAllVerbosity)
gbWMMessageHeaderVerbosity = GetNonJCFOption (HKey_MessageHeader)
gbWMMessageElementsVerbosity = GetNonJCFOption (HKey_MessageElements)
loadNonJCFOptions ()
EndFunction

Void Function LoadApplicationSettings ()
loadNonJCFOptions ()
endFunction

Void Function SayWord ()
var
	Int iControlID

if SayAllInProgress()
&& gbDeleteKeyPressed then
	let gbDeleteKeyPressed=FALSE
	return
endif
let iControlID = GetControlID (GetFocus ())
If CaretVisible ()
&& (iControlID == From_Field2
|| iControlID == To_Field
|| iControlID == CC_Field
|| iControlID == BCC_Field) then
	PriorCharacter ()
	SayCharacter ()
	NextCharacter ()
	Return
EndIf
sayWord()
EndFunction

Void Function SayAllStoppedEvent ()
If gbDeleteKeyPressed Then
	;Return
EndIf
SayAllStoppedEvent()
EndFunction

Script ReplyDirectlyToSender ()
var
	handle hFrom,
	handle hTo
let hFrom=FindDescendantWindow (GetRealWindow(GetFocus()), From_Field2)
If hFrom Then ; Are in an open message.
	SayUsingVoice(VCTX_MESSAGE,msgReplyingDirectlyToSender,OT_SCREEN_MESSAGE)
	SpeechOff() ; Don't need to hear this.
	If 	MoveToWindow(hFrom) Then ; Were we successful in moving to that window?
		Pause()
		LeftMouseButton() ; Make it the active window.
		Delay(1,TRUE)
		PerformScript SelectAll() ; Select the text.
		Pause()
		PerformScript CopySelectedTextToClipboard()
		Delay(1,TRUE)
		TypeKey(ksReply) ; Reply to current message.
		Delay(3) ; Give screen time to settle.
		let hTo=FindDescendantWindow (GetRealWindow(GetFocus()), To_Field)
		If hTo Then	; Is the To: field present?
			If MoveToWindow(hTo) Then ; Were we successful in moving to this window?
		Pause()
				LeftMouseButton() ; Make it the active window.
		Pause()
				PerformScript SelectAll() ; Select its contents.
			Pause()
				TypeKey(cksDelete) ; Delete the text.
				Delay(1,TRUE)
				PerformScript PasteFromClipboard() ; Paste address.
			EndIf ; End of MoveTo To field.
		EndIf ; End of Is to field present?
	EndIf ; End of move to from field successful.
	Delay(3,TRUE)
	SpeechOn()
	PerformScript GoToMessageField()
	Delay(2,TRUE)
	EnterKey()
	JAWSTopOfFile()
	PerformScript ReadToField()
Else
	SayMessage (OT_ERROR, msg_NoOpenMessage1_L, msg_NoOpenMessage1_S)
EndIf
EndScript

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,	handle prevHwnd, int prevObjectId, int prevChildId)
var
	string sObjName
;SayInteger(100)
If gbMessageListHasFocus Then
	If gbLineHasSpoken Then
		let gbLineHasSpoken=FALSE
		Return
	EndIf
;	SayLVItemCheckStatus (curHwnd)
	If GetCharacterAttributes () & ATTRIB_BOLD Then
			SayFormattedMessage (ot_screen_message, msg_UnreadMessage_S)
	EndIf
;	Return
EndIf
If GlobalCurrentControl==suggestions_Listbox
&& GetWindowName(curHwnd)==wn_SuggestionsList Then
	let sObjName=GetObjectName(TRUE)
	Say(sObjName,ot_screen_message)
	Pause()
	SpellString(sObjName)
;	SayObjectActiveItem(FALSE)
	Return
EndIf
If GetWindowClass(curHwnd)==cwc_ComboLBox  Then
	Say(GetWindowTextEx (curHwnd, TRUE, FALSE),ot_line)
	Return
EndIf
ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
EndFunction

void function ObjStateChangedEvent(handle hObj, int iObjType, int nChangedState, int nState, int nOldState)
If IsMessagesList (hObj)
&& gbDeleteKeyPressed Then
	Return
EndIf
ObjStateChangedEvent(hObj,iObjType,nChangedState, nState,nOldState)
EndFunction


Void Function SayObjectTypeAndText (optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	int iType,
	string sObjName
let iType=GetWindowSubTypeCode(GetFocus())
let sObjName=GetObjectName(TRUE)
; This doesn't allow the function to process message bodies.
If (!UserBufferIsActive ()
&& gbByPassSayObjectTypeAndText
&& GetWindowClass(GetFocus())==cwcIEServer
&& IsVirtualPCCursor ()) Then
	let gbByPassSayObjectTypeAndText=FALSE
	Return
EndIf
; Object name is hotkey only...
If (GlobalWindowClass  == cwcIEServer
&& GetObjectTypeCode()==wt_Checkbox
&& StringContains(sObjName,scAltI)) then
	PerformScript SayLine()
	Return
EndIf
If sObjName==wn_ChangeTo
&& iType==wt_MultiLine_Edit Then
	; Spell check change to field...
	Return
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int bIsFocusObject)
If !gbFocusHasChanged
&& ((GlobalCurrentControl==To_Field
|| GlobalCurrentControl==CC_Field
|| GlobalCurrentControl==BCC_Field)
&& GetWindowSubTypeCode(hWnd)==wt_Multiline_Edit) Then
	AddressAutoComplete(sObjValue)
Else
	let gsPrevObjValue=cscNull
EndIf
;If GlobalWindowOwner==an_PlainTextOwner Then
;	ReadPlainTextMessage ()
;	Return
;EndIf
if (GlobalCurrentControl==From_Field && StringContains(GetWindowName(hWnd),scFrom))
&& nObjType == WT_COMBOBOX then
	Say(sObjValue,ot_line)
	Return
EndIf
ValueChangedEvent (hwnd,objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

Script SayBottomLineOfWindow ()
var
	handle hWnd,
	handle hAppWindow,
	string sWinName
let hWnd=GetFocus()
let hAppWindow=GetAppMainWindow(hWnd)
let sWinName=GetWindowName(hAppWindow)
If  IsMessagesList(hWnd)
&& StringContains(sWinName,wnFindMessage) Then
	SayWindow( FindWindow (hAppWindow, wc_MSCtlsStatusBar32, cscNull),FALSE)
	Return
EndIf
PerformScript SayBottomLineOfWindow()
EndScript


Script BottomOfFile ()
var
	handle hWnd,
	int iItemCount
let hWnd=GetFocus()
let iItemCount=lvGetItemCount (hWnd)
If IsPcCursor()
&& IsMessagesList(hWnd) Then
	JAWSEnd ()
	lvSelectItem (hWnd, iItemCount, 1)
	Return
EndIf
PerformScript BottomOfFile()
EndScript

Script TopOfFile ()
var
	handle hWnd
let hWnd=GetFocus()
If IsPcCursor()
&& IsMessagesList(hWnd) Then
	JAWSHome()
	lvSelectItem (hWnd,1, 1)
	Return
EndIf
PerformScript TopOfFile()
EndScript
Function WindowMinMaxEvent (handle hWindow, int nMinMaxRest, int nShow)
If StringContains(GlobalWindowOwner,an_PlainTextOwner) Then
SayInteger(nShow)
	Return
EndIf
WindowMinMaxEvent (hWindow,nMinMaxRest,nShow)
EndFunction


Script ForwardMessage ()
let gbSayTitle=TRUE
SayCurrentScriptKeyLabel ()
TypeKey(ksForwardMessage)
EndScript

Script ReplyToMessage ()
let gbSayTitle=TRUE
SayCurrentScriptKeyLabel ()
TypeKey(ksReply)
let gbReplying=TRUE
EndScript

Script NewMessage ()
let gbSayTitle=TRUE
SayCurrentScriptKeyLabel ()
TypeKey(ksNewMessage)
EndScript

Script ReplyAll ()
let gbSayTitle=TRUE
SayCurrentScriptKeyLabel ()
TypeKey(ksReplyToAll)
let gbReplying=TRUE
EndScript




String Function AddressAutoComplete (string sObjValue)
var
	int bSingleAddress,
	int bHasComma,
	int bHasSemiColon,
	int iLength,
	string sNewAddress,
	string sOldAddress
let bSingleAddress=FALSE
let bHasComma=StringContains(sObjValue,scComma)
let bHasSemiColon=StringContains(sObjValue,scSemiColon)
If bHasComma Then
	let sOldAddress=StringSegment (gsPrevObjValue, scComma, -1)
	let sNewAddress=StringSegment (sObjValue, scComma, -1)
ElIf bHasSemiColon Then
	let sOldAddress=StringSegment (gsPrevObjValue, scSemiColon, -1)
	let sNewAddress=StringSegment (sObjValue, scSemiColon, -1)
Else
	let bSingleAddress=TRUE
	let sOldAddress=gsPrevObjValue
	let sNewAddress=sObjValue
EndIf

;If  gbFocusHasChanged Then
;	Say(sObjValue,ot_line)
;	let gbFocusHasChanged=FALSE
;	let gsPrevObjValue=sObjValue
;	Return
;EndIf

let gsPrevObjValue=sObjValue
let iLength=StringLength(sNewAddress)
If iLength<=2 Then
	let sNewAddress=stringStripAllBlanks (sNewAddress)
EndIf

If sOldAddress!=sNewAddress
&& iLength>1 Then
		If (iLength > (StringLength(sOldAddress)+1)) Then
	Say(sNewAddress,ot_line)
		EndIf
EndIf
EndFunction


void Function SayLine (optional int HighlightTracking, optional int bSayingLineAfterMovement)
var
	handle hWnd,
	string sObjName
let hWnd=GetFocus()
If IsMessagesList (hWnd) then
	MSAARefresh()
	Delay(1,TRUE)
;	SayLVItemCheckStatus (hWnd)
	If IsUnReadMessage() then
		SayFormattedMessage (OT_SCREEN_MESSAGE, msg_UnreadMessage_S)
	EndIf
	SayLine(HighlightTracking,bSayingLineAfterMovement)
	Return
EndIf
let sObjName=GetObjectName()
If GlobalRealWindowName==wn_FontDialog
&& (sObjName==wn_FontList
|| sObjName==wn_SizeList
|| sObjName==wn_StyleList) Then
	Say(GetObjectValue(),ot_line)
	Return
EndIf
SayLine(HighlightTracking,bSayingLineAfterMovement)
EndFunction

int function HasVirtualEnhancedClipboard()
return true
EndFunction

Void Function SayCharacter (optional Int IncludeMarkup)
var
	String sAddressEnd,
	String sAddressStart,
	Int iControlID

If IsPCCursor () then
	let iControlID = GetControlID (GetFocus ())
	If CaretVisible ()
	&& (iControlID == From_Field2
	|| iControlID == To_Field
	|| iControlID == CC_Field
	|| iControlID == BCC_Field)
	&& GetCharacter () == cScNull then
		InvisibleCursor ()
		SaveCursor ()
		RouteInvisibleToPc ()
		let sAddressEnd = GetToEndOfLine ()
		let sAddressEnd = StringSegment (sAddressEnd, SCSemicolon, 1)
		let sAddressStart = GetFromStartOfLine ()
		let sAddressStart = StringSegment (sAddressStart, cScColon + scSemiColon, -1)
		let sAddressStart = sAddressStart + sAddressEnd
		RestoreCursor ()
		PCCursor ()
		Say (sAddressStart, OT_WORD)
		Return
	EndIf
EndIf
SayCharacter (IncludeMarkup)
EndFunction

int function ExitFormsModeHelper()
var
	int iSubtype
let iSubtype = GetObjectSubtypeCode()
if GetWindowClass(GetFocus()) == cwcIEServer
&& !IsVirtualPCCursor()
&& (iSubtype == wt_dialog_page || iSubType == WT_MULTILINE_EDIT) Then
	;Allow Escape to exit an editable message:
	return false
EndIf
return ExitFormsModeHelper()
EndFunction


; ** Start of Selecting Text

Int Function IsHTMLMessageBody (handle hWnd)
If GetWindowClass (hWnd) == cWcIEServer
&& (IsVirtualPCCursor ()
|| IsPCCursor ()) then
	Return TRUE
EndIf
Return FALSE
EndFunction

Script SelectToEndOfLine()
Let nSaySelectAfter = FALSE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectToEndOfLine ()
	SelectingText(FALSE)
	Return
EndIf
PerformScript SelectToEndOfLine()
EndScript

Script SelectFromStartOfLine()
Let nSaySelectAfter = FALSE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectFromStartOfLine ()
	SelectingText(FALSE)
	Return
EndIf
PerformScript SelectFromStartOfLine()
EndScript

Script SelectNextCharacter()
Let nSaySelectAfter = TRUE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectNextCharacter ()
	SelectingText(FALSE)
	Return
EndIf
Let nSaySelectAfter = FALSE
PerformScript SelectNextCharacter()
EndScript

Script SelectPriorCharacter()
Let nSaySelectAfter = TRUE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectPriorCharacter ()
	SelectingText(FALSE)
	Return
EndIf
Let nSaySelectAfter = FALSE
PerformScript SelectPriorCharacter()
EndScript

Script SelectNextWord()
Let nSaySelectAfter = TRUE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectNextWord ()
	SelectingText(FALSE)
	Return
EndIf
Let nSaySelectAfter = FALSE
PerformScript SelectNextWord()
EndScript

Script SelectPriorWord()
Let nSaySelectAfter = TRUE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectPriorWord ()
	SelectingText(FALSE)
	Return
EndIf
Let nSaySelectAfter = FALSE
PerformScript SelectPriorWord()
EndScript

Script SelectNextLine()
Let nSaySelectAfter = FALSE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectNextLine()
	SelectingText(FALSE)
	Return
EndIf
PerformScript SelectNextLine()
EndScript

Script SelectPriorLine()
Let nSaySelectAfter = FALSE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectPriorLine()
	SelectingText(FALSE)
	Return
EndIf
PerformScript SelectPriorLine()
EndScript

Script SelectNextScreen()
Let nSaySelectAfter = FALSE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectNextScreen ()
	SelectingText(FALSE)
	Return
EndIf
PerformScript SelectNextScreen()
EndScript

script SelectPriorScreen()
Let nSaySelectAfter = FALSE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectPriorScreen ()
	SelectingText(FALSE)
	Return
EndIf
PerformScript SelectPriorScreen()
EndScript

script SelectToBottom()
Let nSaySelectAfter = FALSE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectToBottom ()
	SelectingText(FALSE)
	Return
EndIf
PerformScript SelectToBottom()
EndScript

script SelectFromTop()
Let nSaySelectAfter = FALSE
if IsHTMLMessageBody (GetFocus ()) then
	SelectingText(TRUE)
	SelectFromTop ()
	SelectingText(FALSE)
	Return
EndIf
PerformScript SelectFromTop()
EndScript
; ** End of Selecting Text Scripts

int function ContractedBrailleInputAllowedNow ()
var
	int ID
ID = getControlID (getCurrentWindow ())
if (ID == from_field || ID == from_Field2 || ID == to_field
|| ID == cc_field || ID == Bcc_field)
	return FALSE
endIf
return ContractedBrailleInputAllowedNow ()
endFunction


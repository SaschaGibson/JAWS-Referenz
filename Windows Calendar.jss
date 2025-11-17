;Script files for Windows Mail
;Copyright 2007-2021 by Freedom Scientific Inc.

include "hjconst.jsh"
include "hjglobal.jsh"
include "Windows Calendar.jsm"
include "Windows Calendar.jsh"
include "OutlookCustomSettings.jsm"
include "OutlookCustomSettings.jsh"
include "HjHelp.jsh"
include "common.jsm"
use "OutlookCustomSettings.jsb" ; Shared Verbosity settings.

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
	int iTypeCode,
	int iObjTypeCode,
	string sObjName
let gbByPassSayObjectTypeAndText=TRUE
let gbLineHasSpoken=FALSE
If InHjDialog () then
	SayWindowTypeAndText (hWnd)
	Return TRUE
EndIf
if nSuppressEcho == on then
	return TRUE
EndIf
let iTypeCode=GetWindowSubTypeCode(hWnd)
let iObjTypeCode=GetObjectSubTypeCode()
let sObjName=GetObjectName()
If StringContains(GlobalRealWindowName,scOptions)
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

; keep message list view from being spoken twice
If GlobalFocusWindow == GlobalAppWindow  Then
	return TRUE
EndIf
If hWnd == GetFocus () then
	If IsMessageRules(hWnd)
	&& iTypeCode==wt_ListView Then
		IndicateControlType(iTypeCode,cscSpace,cscSpace)
;  Say(GetFromStartOfLine(),OT_ITEM_STATE,TRUE)
		SayObjectActiveItem ()
	 Return TRUE
	EndIf

	If iTypeCode == WT_TOOLBAR then
		SayLine ()
		Return TRUE
	EndIf
EndIf

;To speak the Unread status of a message properly
If IsMessagesList (hWnd) then
	IndicateControlType(wt_ListView,cscSpace,cscSpace)
	Say(GetWindowName(hWnd),OT_CONTROL_NAME)
If !LVGetItemCount (hWnd) Then
		Say(PositionInGroup(),ot_line)
	Else
		SayLine()
	EndIf
	Return TRUE
EndIf ; End of Message list.

; Bail when alt tabbing from a link
If IsWindowVisible (FindTopLevelWindow(cwc_Dlg32771,scNull)) then
	return FALSE
EndIf
If GetWindowName (GetRealWindow (GetParent (GetFocus ()))) + sc_1 == wn_help + sc_1 then
	SwitchToConfiguration (msgFN4)
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
					If ! iReadMisspelledAndSuggestion then
;					Let iReadMisspelledAndSuggestion = TRUE
						MisspelledAndSuggestion (FALSE, TRUE)
						return true
					EndIf
	let iReadMisspelledAndSuggestion=FALSE
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
	|| (GlobalWindowClass == cwc_RichEdit20W
	&& !GlobalCurrentControl) then
		If globalMessageWindow==GetFocus() Then
			let gbByPassSayObjectTypeAndText=FALSE
		EndIf
		;Make read-only messages act like web pages and not say edit.
		If ! IsVirtualPcCursor () then
			;Just in case the user is running with the VPC option off:
			Pause (); allow time for caret to become visible.
			If CaretVisible () then
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
Return false
EndFunction

int function HandleCustomRealWindows (handle hwnd)
If DialogActive () then
	If GlobalRealWindowName==wnCheckSpelling then
		SayWindowTypeAndText(GlobalRealWindow)
		If GetWindowSubtypeCode(GetFocus())!=wt_button then
			Let iReadMisspelledAndSuggestion=true
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
	 SayLine()
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
	 SayLine()
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
; If plain text messages are being read with ReadPlainTextMessage function,
; return to keep "Read only edit" from being announced with each message.
If giIsPlainTextMode Then
	let giIsPlainTextMode=FALSE
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
	&& !iReadMisspelledAndSuggestion then
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
if (GetWindowClass (hWnd) == wc_List) then
	if (GetWindowClass (GetParent (hwnd)) == wc_OutlookExpressMessageList) then
		return true;
	endif
endif
return false;
EndFunction

Void Function AutoStartEvent ()
let OutlookVersion = GetProgramVersion (GetAppFilePath ())
let gbDeleteKeyPressed=FALSE
let iSuppressHighlightedMessage = TRUE
let iScheduledHighlightFunctionId = ScheduleFunction (sf_TurnSuppressHighlightOff, 10)
If !giOutlookExpressHasRunBefore Then
  LoadApplicationSettings ()
	let giOutlookExpressHasRunBefore=TRUE
EndIf

EndFunction

void Function AutoFinishEvent ()
TurnSuppressCheckForBoldOff ()
EndFunction

Void Function TurnSuppressCheckforBoldOff ()
let iScheduledFunctionId = 0
let iSuppressCheckForBold = false
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
&& !IsMessagesList (hWnd) Then
Return
EndIf
if GlobalMenuMode > 0 then
	SayHighlightedText (hWnd, buffer, nAttributes)
	return
EndIf
;Kill From and Subject information from being spoken in Preview Pane:
Let sClass = GetWindowClass (hWnd)
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
&& !iSuppressReadMessage
&& !iSuppressHighlightedMessage
&& IsMessagesList (GetFocus()) then
	SayHighlightedText(hwnd, buffer, nAttributes)
	return
endIf
ProcessSpeechOnNewTextEvent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

Script ScriptFileName ()
Var
	string strOEVersion
let strOEVersion = IntToString (GetProgramVersion (GetAppFilePath ()))
let strOeVersion = (FormatString (msgOEVer_l, strOEVersion))
ScriptAndAppNames(strOEVersion)
EndScript


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
		IndicateComputerBraille (hwnd)
		SpeakProgressBarInfo(TRUE)
		smmToggleTrainingMode(nMode)
		return
	endif
	if GlobalMenuMode > 1 then
		SayLine ()
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
	let nSuppressEcho = on
	let iColToClick =
	StringToInt(StringSegment(g_strGraphicsListX,scSeparator, iIndex))
	let iRowToClick =
	StringToInt(StringSegment(g_strGraphicsListY,scSeparator, iIndex))
	SaveCursor()
	JAWSCursor()
	MoveTo(iColToClick,iRowToClick)
	LeftMouseButton()
	RestoreCursor ()
	let nSuppressEcho = off
endif
EndScript

Void Function DocumentLoadedEvent ()
var
	int nFrames,	;default
	int nLinks, ;default
	string Buffer,	;default
	handle hwnd ;custom
let gbByPassSayObjectTypeAndText=FALSE
let giMessageWasRead=TRUE ; Sets flag to disable plain text mode reading function.
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
	SayLine()
	let BackForward=0
	return
endif
if GetWindowClass (GetFocus ()) == cwcIEServer then
	Let globalMessageWindow=GetFocus()
	PCCursor()
	if IsVirtualPCCursor() then
		let nFrames = GetHTMLFrameCount()
;		Pause ()
		refresh()
		let buffer = msgPageHas1_L
		if nFrames > 0
		&& ShouldItemSpeak (ot_JAWS_message) != message_long then
			let buffer = buffer + IntToString(nFrames)+ msgFramesAnd1_L
		endif
		let nLinks = GetLinkCount()
		if NLinks==1 then
			let buffer = buffer+IntToString(nLinks)+ msgLink1_L
		else
			let buffer = buffer+IntToString(nLinks)+ msgLinks1_L
		endif

		let hwnd= FindDescendantWindow (GetAppMainWindow (GlobalFocusWindow), subject_field)
		if hwnd
		&& IsWindowVisible (hwnd) then
			; Check for stripped attachment notification
			WasAttachmentsStripped ()
			If giOE6MessageHeaderVerbosity Then
				ReadHeaderField2 (from_Field2, msg_from1_L)
				ReadHeaderField2 (subject_field, msg_subject1_L)
			EndIf
		endif
		Say(Buffer,OT_SCREEN_MESSAGE)
;		JAWSTopOfFile ()
		If giOE6MessageSayAllVerbosity Then
			SayAll()
		EndIf
	Endif
endif
EndFunction

int Function ReadHeaderField (int iControlID, string sFieldName)
var
	handle hwnd,
	string sName,
	string sText

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
		Delay(1)
		LeftMouseButton()
		PcCursor()
		return true
	else
		return false
	endif
else
	let sName = GetWindowName (hwnd)
	let sText = GetWindowTextEx(hWnd, READ_EVERYTHING,FALSE)
	BrailleMessage(sName+cscSpace+sText)
	SayMessage(ot_control_name,sName)
	Say(sText,ot_line)
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
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR,0)
ReadHeaderField (Bcc_Field, msg_bcc1_L)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR,iVPC)
EndScript

Script ReadCcField ()
var
	int iVPC
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR, 0)
ReadHeaderField (Cc_Field, msg_cc1_L)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR,iVPC)
EndScript

Script ReadDateField ()
var
	int iVPC
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR, 0)
ReadHeaderField (Date_Field, msg_date1_L)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR, iVPC)
EndScript

Script ReadFromField ()
var
	int iVPC

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
Let iVPC = GetJcfOption (OPT_VIRTUAL_PC_CURSOR)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR, 0)
ReadHeaderField (Subject_Field, msg_subject1_L)
;SetJcfOption (OPT_VIRTUAL_PC_CURSOR,iVPC)
EndScript

Script ReadToField ()
var
	int iVPC
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
Delay(1)
LeftMouseButton()
PcCursor()
If IsVirtualPCCursor () Then
;	JAWSTopOfFile ()
EndIf
Delay(2)
SayWindowTypeAndText(globalMessageWindow)
SayLine()
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
If globalWordInContextFound then
	Return
EndIf
Delay(1)
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
	Say (sWinName, OT_CONTROL_NAME)
	Say(sWinText,ot_line)
	SpellString(sWinText)
	If iBrlFlash Then
		let sBrlMsg =sWinName+cscSpace+sWinText+cscSpace
	EndIf
		;now see if there are any suggestions
	Let hTemp = FindDescendantWindow (GlobalRealWindow, suggestions_listbox)
	If hTemp then
		If ! GetWindowText (hTemp, TRUE) then
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
;		let iReadMisspelledAndSuggestion=FALSE
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
Else
	If iShouldSayIncorrectSpell then
		Delay (4)
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
	If !giMessageWasRead Then
		let giIsPlainTextMode=TRUE
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
	If !giMessageWasRead Then
		let giIsPlainTextMode=TRUE
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
	If !giMessageWasRead Then
		let giIsPlainTextMode=TRUE
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
		Delay (5)
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
let nIdx = DlgSelectItemInList (buffer, sc_3, true)
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
	Let iReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
	Return
EndIf

If IsMessagesList(GetFocus()) Then
	let giWasMessagesList=TRUE
Else
	let giWasMessagesList=FALSE
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
Delay(2)
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
if (sClass == wc_List) then
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


Script JAWSDelete ()
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
	Delay(1)
	MSAARefresh()
	Delay(1)
	SayLVItemCheckStatus (hWnd)
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
PerformScript JAWSDelete ()
EndScript

void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow,
	string WinClass,
	string sWinName,
	handle hwnd,
	handle hSubject,
	int iTitleSpoken
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
;SayInteger(99)
let WinClass = GetWindowClass (FocusWindow)
let RealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
let GlobalRealWindowName=RealWindowName
let GlobalRealWindow=RealWindow
let GlobalAppWindow=AppWindow
let GlobalCurrentControl=GetControlId(FocusWindow)
let GlobalWindowClass=WinClass
let hSubject = FindDescendantWindow (RealWindow, Subject_Field)
let hwnd = FindWindow (GetFirstChild (GetFocus ()), cwcIEServer, cscNull)
let iTitleSpoken = FALSE
let sWinName=GetWindowName(AppWindow)
if GlobalPrevApp != AppWindow
&& AppWindow != FocusWindow then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
	if RealWindowName == wnCheckSpelling  then
		;Let HandleCustomRealWindows deal with saying this realWindow name so that it is not double spoken.
	Else
		; set the iTitle Spoken flag to true to keep real window logic from repeating the title of the window.
		let iTitleSpoken = TRUE
		If InHjDialog () then
			; make sure HJ dialogs speak the control type
			IndicateControlType (WT_DIALOG, RealWindowName, cscSpace)
		ElIf StringContains(sWinName,wnNewMessage) Then
		; Announce the title if it is a new message...
			Say (sWinName, OT_LINE)
		Else
			Say (sWinName, OT_DOCUMENT_NAME)
		EndIf
	EndIf
EndIf
If GlobalPrevRealName != RealWindowName ; name has changed
|| GlobalPrevReal != RealWindow then ; or handle has changed, then
	If RealWindow != AppWindow
	&& RealWindow != FocusWindow then
		If ! HandleCustomRealWindows (RealWindow)  then
			SayWindowTypeAndText (RealWindow)
		EndIf
	; even though the real window handle or name may have changed,  a check must be performed
	; to determine if the real window and the app window are the same
	; and theprevious window is not that of the subject edit field.
	; By making sure the prev window is not the same as the subject, JAWS does not speak the subject text
	; when focus moves to the message body when a new message is being created.
	; Otherwise, this code block causes JAWS to speak the subject text when replying to a new a message in OE.
	ElIf AppWindow == RealWindow
	&& PrevWindow !=hSubject  Then
		If !iTitleSpoken Then; only speak the real window if it was not spoken as a part of the app  change
			If !GlobalMenuMode then
				If !FindWindow (GetAppMainWindow(GetFocus ()), cwcIEServer, cscNull)
				&& GetWindowClass(GetFocus())==wc_Ath_Note
				&& giWasMessagesList Then

					; No ie_server class found, must be plain text mode.
					let giIsPlainTextMode=TRUE
					let giMessageWasRead=FALSE
					ReadPlainTextMessage()
				Else
					SayWindowTypeAndText (RealWindow)
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
	if ! IsWindowVisible ((FindTopLevelWindow(cwc_Dlg32771,scNull))) then
		;Otherwise, we speak links when we're alt tabbing.
		SayFocusedObject ()
	EndIf
EndIf
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
;The following lines set the global variable iSuppressReadMessage to false so NewTextEvent
;will be called in the message list
If isMessagesList (GetFocus ()) then
	If iSuppressReadMessage == true then
		let iSuppressReadMessage = false
	EndIf
EndIf
return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
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
		Delay(2)
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
		Delay(1)
		SpeechOn()
		PcCursor()
		 SayLine()
		Return true
	EndIf
	; Find message area...
	if iControl==id_ReceivedBefore
	|| iControl==id_ReceivedAfter then
		if GetWindowName(GetRealWindow(hWnd))==wnFindMessage then
			Delay(3)
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
		SayLine ()
		Return
	EndIf
	; If we are in the Columns Dialog list...
	If IsWindowVisible (ghShowButton) Then
;  Say(GetFromStartOfLine(),OT_ITEM_STATE,TRUE)
		SayLine()
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
	Delay(1)
	SayLine()
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
	Delay(1)
	SayLine()
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
		Delay(1)
		MSAARefresh()
		SayLVItemCheckStatus (hWnd)
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
		Delay(1)
		MSAARefresh()
		SayLVItemCheckStatus (hWnd)
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
	Let iReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script IgnoreAllButton ()
var
	handle hWnd
TypeKey(ksSpellCheckIgnoreAll)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let iReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script DeleteButton ()
var
	handle hWnd
TypeKey(ksSpellCheckDelete)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let iReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script ChangeButton ()
var
	handle hWnd
TypeKey(ksSpellCheckChange)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let iReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script ChangeAllButton ()
var
	handle hWnd
TypeKey(ksSpellCheckChangeAll)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let iReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script AddToDictionaryButton ()
var
	handle hWnd
TypeKey(ksSpellCheckAddToDictionary)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let iReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Script UndoButton ()
var
	handle hWnd
TypeKey(ksSpellCheckUndo)
Let hWnd = GetRealWindow (GetFocus ())
If GetWindowName (hWnd) == wn_Spelling then
	Let iReadMisspelledAndSuggestion = TRUE
	MisspelledAndSuggestion (FALSE, TRUE)
EndIf
EndScript

Void function ScreenStabilizedEvent(handle hwndLastScreenWrite)
; Test if focus has been lost, and tries to redirect it to previous focus.
If !GetFocus() && !giWasMessagesList Then
	SetFocus(GlobalPrevFocus)
	Return
EndIf
; the following tests whether flag has been set in DragDialogWinodw function.
; This only happens in spellchecker when word in context script is called and dialog must be dragged out of the way.
if GetWindowName(GetRealWindow(GetFocus()))==wnCheckSpelling
	&& globalDlgDragged then
	let globalDlgDragged=false
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
	Let globalWordInContextFound=true
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
Let globalDlgDragged=true ; cleared in Screen StabilizedEvent.
LeftMouseButtonLock () ;unlock
MoveTo (iJAWSCol, iJAWSRow);Put the JAWSCursor back where it was,
;so the mouse isn't visually unpleasant
; reset globalWordInContextFound for next time.
If globalWordInContextFound then
	Let globalWordInContextFound=false
EndIf
PCCursor ()
EndFunction

 Void Function TurnSuppressHighlightOff ()
let iScheduledHighlightFunctionId = 0
let iSuppressHighlightedMessage = FALSE
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
|| GetWindowSubTypeCode(GetFocus())==wt_ListView Then
	; Put focus in the message body...
	TabKey()
	Delay(1)
EndIf
If GetWindowClass(GetFocus())==cwc_RichEdit20W
&& !GetControlId(GetFocus()) Then
	; We are indeed in the message body...
;	WasAttachmentsStripped () ; Check to see if notification is there...
	If giOE6MessageHeaderVerbosity Then
	; The user has message header announcement toggled to Yes...
		ReadHeaderField2 (from_Field2, msg_from1_L)
		ReadHeaderField2 (subject_field, msg_subject1_L)
	EndIf
	Delay(4)
	If giOE6MessageSayAllVerbosity Then
		; The user has Read messages automatically set to Yes...
		; Make sure JAWS starts at the beginning of the message...
		NextCharacter() ; Necessary to keep next function from sounding system bell
		Pause()
		JAWSTopOfFile()
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
	string sList
;	save the current values
let  iPrevMessageSayAllVerbosity = giOE6MessageSayAllVerbosity
let  iPrevMessageHeaderVerbosity = giOE6MessageHeaderVerbosity
;let giOE6BlockQuoteIndication=GetJcfOption(optBlockQuoteIndication)
;let giOE6FrameIndication=GetJcfOption(optFrameIndication)
;let giOE6Headingindication=GetJcfOption(optHeadingindication)
;let giOE6ListIndication=GetJcfOption(optListIndication)
;let giOE6TableIndication=GetJcfOption(optTableIndication)
	let sList = jvToggleMessageHeaderVerbosity
	+ jvToggleMessageSayAllVerbosity
;/	+ jvToggleIndicateBlockQuotes
;/	+ jvToggleIndicateFrames
;	+ jvToggleIndicateHeadings
;	+ jvToggleIndicateLists
;	+ jvToggleIndicateTables

JAWSVerbosityCore (sList)
If iPrevMessageSayAllVerbosity != giOE6MessageSayAllVerbosity
|| iPrevMessageHeaderVerbosity != giOE6MessageHeaderVerbosity Then
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
let iResult=IniWriteInteger (snOptions, HKey_MessageHeader, giOE6MessageHeaderVerbosity , FN_OutlookExpressJsi)
IniWriteInteger (snOptions, HKey_MessageSayAll, giOE6MessageSayAllVerbosity , FN_OutlookExpressJsi )
return iResult
EndFunction

Void Function LoadApplicationSettings ()
; Load personal preferences
Let giOE6MessageSayAllVerbosity = IniReadInteger (snOptions, HKey_MessageSayAll, TRUE, FN_OutlookExpressJsi )
Let giOE6MessageHeaderVerbosity = IniReadInteger (snOptions, HKey_MessageHeader, TRUE, FN_OutlookExpressJsi )
EndFunction






Void Function SayWord ()
if SayAllInProgress()
&& gbDeleteKeyPressed then
	let gbDeleteKeyPressed=FALSE
	return
endif
sayWord()
EndFunction

Void Function SayAllStoppedEvent ()
If gbDeleteKeyPressed Then
	Return
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
		Delay(1)
		PerformScript SelectAll() ; Select the text.
		Pause()
		PerformScript CopySelectedTextToClipboard()
		Delay(1)
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
				Delay(1)
				PerformScript PasteFromClipboard() ; Paste address.
			EndIf ; End of MoveTo To field.
		EndIf ; End of Is to field present?
	EndIf ; End of move to from field successful.
	Delay(3)
	SpeechOn()
	PerformScript GoToMessageField()
	Delay(2)
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
If IsMessagesList (curHwnd) Then
	If gbLineHasSpoken Then
		let gbLineHasSpoken=FALSE
		Return
	EndIf
	SayLVItemCheckStatus (curHwnd)
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
	SayObjectActiveItem()
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
	string sObjName
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
&& GetWindowSubTypeCode(GetFocus())==wt_MultiLine_Edit Then
	; Spell check change to field...
	Return
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int bIsFocusObject)
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

void Function SayLine (optional int HighlightTracking, optional int bSayingLineAfterMovement)
var
	handle hWnd,
	string sObjName
let hWnd=GetFocus()
If IsMessagesList (hWnd) then
	MSAARefresh()
	Delay(1)
	SayLVItemCheckStatus (hWnd)
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

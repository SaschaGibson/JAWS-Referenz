; JAWS script file for Windows Media Player
; Copyright 2006-2015 by Freedom Scientific Inc.

include "HjConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "Windows Media Player.jsh"
include "Windows Media Player.jsm"

Script ScriptFileName ()
ScriptAndAppNames (WMPProgramName+cscSpace+IntToString(WMPProgramVersion))
EndScript

Void Function AutoStartEvent ()
Let WMPProgramName = GetVersionInfoString (GetAppFilePath(),scProductName)
Let WMPProgramVersion = GetProgramVersion (GetAppFilePath())
EndFunction

Void Function AutoFinishEvent ()
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle hReal,
	handle hAppWindow,
	string RealName,
	int iSubType
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let GlobalFocusWindow=FocusWindow
let hReal=GetRealWindow(FocusWindow)
Let RealName = GetWindowName (hReal)
let hAppWindow=GetAppMainWindow(FocusWindow)
let GlobalRealWindow=hReal
let GlobalRealWindowName=RealName
let GlobalAppWindow=hAppWindow
let GlobalCurrentControl=GetControlId(FocusWindow)
let GlobalFocusWindow = FocusWindow
let GlobalObjectName=GetObjectName(TRUE)
let giFocusHasChanged=TRUE
if (GlobalPrevApp != hAppWindow && hAppWindow != FocusWindow) then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
	If (! GlobalWasHjDialog) || InHjDialog () then
	;Instead of having to overwrite the default app-specific logic
		If ! HandleCustomAppWindows (hAppWindow) then
			SayWindowTypeAndText (hAppWindow)
		EndIf
	EndIf
endIf

If ((GlobalPrevRealName != RealName) ; name has changed
|| (GlobalPrevReal != hReal)) then ; or handle has changed, then
	If ((hReal != hAppWindow) && (hReal != FocusWindow)) then
		If ! HandleCustomRealWindows (hReal) then
			SayWindowTypeAndText (hReal)
		EndIf ; End of HandleCustomReal check
	EndIf ; End of Real window isn't appWindow or Focus Window. check
endIf ; End of Real window check.
;The HandleCustomWindows function can be used instead of overwriting the default SayFocusedWindow behavior.
If ! HandleCustomWindows (FocusWindow) then
	SayFocusedWindow ()
EndIf ; End of HandleCustomWindow check.
let GlobalPrevApp=hAppWindow
let GlobalPrevReal=hReal
let GlobalPrevRealName=RealName
let GlobalPrevFocus=FocusWindow
let GlobalPrevControl=GlobalCurrentControl
let giFocusHasChanged=FALSE
EndFunction

Int Function HandleCustomAppWindows (handle hAppMain)
let GlobalRealWindowClass=GetWindowClass(GlobalRealWindow)
;SayInteger(11)
If !DialogActive () Then
;	RoutePcToJaws()
;	PcCursor()
EndIf
Return FALSE
EndFunction

Int Function HandleCustomRealWindows (handle hReal)
let GlobalRealWindowClass=GetWindowClass(hReal)
;SayInteger(12)
Return FALSE
EndFunction

Int Function HandleCustomWindows (handle hWnd)
var
	int iSubType
let giPrevObjSubType=giObjSubType
let GlobalWindowClass=GetWindowClass(hWnd)
let giObjSubType=GetObjectSubTypeCode(TRUE)
let iSubType=GetWindowSubTypeCode(hWnd)
If iSubType==wt_ListView Then
	IndicateControlType(wt_ListView,GetWindowName(hWnd))
	PerformScript SayLine()
	Return TRUE
EndIf
Return FALSE
EndFunction

Script SayPriorLine ()
var
	handle hWnd,
	string sWinName
if !IsPcCursor ()
|| IsVirtualPcCursor () Then
	PerformScript SayPriorLine ()
	return
EndIf
let sWinName=GetWindowName(GlobalFocusWindow)
If StringContains(sWinName,wn_CurrentPlayList) Then
	PriorLine()
	Pause()
	PerformScript SayListItem()
	Return
EndIf

PerformScript SayPriorLine()
EndScript

Script SayNextLine ()
var
	handle hWnd,
	string sWinName
if !IsPcCursor ()
|| IsVirtualPcCursor () Then
	PerformScript SayNextLine ()
	return
EndIf
let sWinName=GetWindowName(GlobalFocusWindow)
If StringContains(sWinName,wn_CurrentPlayList) Then
	NextLine()
	Pause()
	PerformScript SayListItem()
	Return
EndIf
PerformScript SayNextLine()
EndScript

Script ScreenSensitiveHelp ()
var
	int iSubType,
	int iObjSubType,
	string SWinName,
	string SWinClass,
	string sHelp_L,
	string sHelp_S,
	string sObjName
let SWinClass = GetWindowClass (GlobalFocusWindow)
let iSubType=GetWindowSubTypeCode(GlobalFocusWindow)
let sWinName=GetWindowName(GlobalFocusWindow)
let iObjSubType=GetObjectSubTypeCode(TRUE)
let sObjName=GetObjectName(TRUE)
If !iSubType Then
	let iSubType=iObjSubType
EndIf

if GlobalMenuMode  then
	if GlobalMenuMode == 2 then
		ScreenSensitiveHelpForKnownClasses (WT_MENU)
	else
		ScreenSensitiveHelpForKnownClasses (WT_MENUBAR)
	EndIf
	return
EndIf ; End of menus.
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
SayMessage(OT_USER_BUFFER,msgScreenSensitiveHelp1_L,msgScreenSensitiveHelp1_S)
AddHotKeyLinks ()
;PerformScript ScreenSensitiveHelp ()
EndScript

Script HotKeyHelp ()
var
	int iSubType,
	int iObjSubType,
	string SWinName,
	string SWinClass,
	string sHelp_L,
	string sHelp_S,
	string sObjName
if TouchNavigationHotKeys() then
	return
endIf
let SWinClass = GetWindowClass (GlobalFocusWindow)
let iSubType=GetWindowSubTypeCode(GlobalFocusWindow)
let sWinName=GetWindowName(GlobalFocusWindow)
let iObjSubType=GetObjectSubTypeCode(TRUE)
let sObjName=GetObjectName(TRUE)
If !iSubType Then
	let iSubType=iObjSubType
EndIf

If UserBufferIsActive () then
	UserBufferDeactivate ()
;	Return
EndIf

let sHelp_L=msgHotkeyHelp1_L
let sHelp_S=msgHotkeyHelp1_S
SayFormattedMessage(OT_USER_BUFFER,sHelp_L,sHelp_S)
EndScript

int function BrailleCallbackObjectIdentify()
return BrailleCallbackObjectIdentify()
EndFunction

Script SayListItem ()
var
	int iColumnCount,
	int iCurrentColumnIndex,
	int iTimeLength,
	Handle hwnd,
	string sListHeader,
	string sAppendedListHeader,
	string sListItem,
	int iState
;SayInteger(3)
let hWnd=GetFocus()
let gsBrlObjName=cscNull
let gsBrlObjValue=cscNull
let gsBrlObjState=cscNull
let iState=FALSE
If !lvGetItemCount (hWnd) Then
	; List is empty...
	Return
EndIf
SayLVItemCheckStatus (hWnd)
/*
let iState=GetControlAttributes(TRUE)
If iState Then
	If iState==1 Then
		let gsBrlObjValue=cMsgBrailleChecked1_L
	ElIf iState==2 Then
		let gsBrlObjValue=cMsgBrailleUnChecked1_L
	Else
		let gsBrlObjValue=cscNull
	EndIf
EndIf ; End of checked/unchecked braille status
*/

let iColumnCount = lvGetNumOfColumns (hWnd )
let iCurrentColumnIndex = 1
while (iCurrentColumnIndex <= iColumnCount)
	let sListHeader = lvGetColumnHeader (hWnd ,iCurrentColumnIndex   )
	let sListItem = lvGetItemText (hWnd, GetCurrentItem (hWnd) ,iCurrentColumnIndex  )
	if !StringLength (sListItem) then
		If giAnnounceHeaders Then
			let sListItem = scColumnEmptyNotification
		Else
			let sListItem=cscNull
		EndIf
	EndIf
	let gsBrlObjValue=gsBrlObjValue+cscSpace+sListItem
	if StringLength (sListHeader) != 1 then
		let sAppendedListHeader = sListHeader + scColumnSolute
	Else
		let sAppendedListHeader = sListHeader
		if StringContains(sListItem,scColumnEmptyNotification) Then
			let sListItem = cscNull
		EndIf
	EndIf
	if StringContains(sListHeader,scColumnNameIsLength) then
		If giAnnounceHeaders Then
			SayFormattedMessage (OT_SCREEN_MESSAGE, sAppendedListHeader )
		EndIf
		SayFormattedMessage (OT_SCREEN_MESSAGE, GetFormattedTime (sListItem ))
	ElIf StringContains(sListHeader,scColumnNameIsType) then
		If giAnnounceHeaders Then
			SayFormattedMessage (OT_SCREEN_MESSAGE, sAppendedListHeader )
		EndIf
		SayFormattedMessage (OT_SPELL, sListItem)
	Else
		If giAnnounceHeaders Then
			SayFormattedMessage (OT_SCREEN_MESSAGE, sAppendedListHeader )
		EndIf
		SayFormattedMessage (OT_SCREEN_MESSAGE, sListItem)
	EndIf
	let iCurrentColumnIndex = iCurrentColumnIndex + 1
EndWhile
let giAnnounceHeaders=FALSE
EndScript

String Function GetFormattedHour (int iHour)
If iHour then
	If iHour== 1 then
		return FormatString (MsgSingleHour, IntToString (iHour))
	Else
		return FormatString (MsgMultipleHours, IntToString (iHour))
	EndIf
Else
	Return cscNull
EndIF
EndFunction

String Function GetFormattedMinute (int iMinute)
If iMinute then
	If iMinute == 1 then
		return FormatString (MsgSingleMinute, IntToString (iMinute))
	Else
		return FormatString (MsgMultipleMinutes, IntToString (iMinute))
	EndIf
Else
	Return cscNull
EndIF
EndFunction

String Function GetFormattedSecond (int iSecond)
If iSecond  then
	If iSecond== 1 then
		return FormatString (MsgSingleSecond, IntToString (iSecond))
	Else
		return FormatString (MsgMultipleSeconds, IntToString (iSecond))
	EndIf
Else
	Return cscNull
EndIF
EndFunction

String Function GetFormattedTime (string sTime)
Var
	int iTimeLength,
	String sTempTime,
	String  sFormattedTime,
	string sHour,
	string sMinute,
	string sSecond
Let sTempTime = stringStripAllBlanks (sTime)
; store time values
let iTimeLength = StringLength (StringSegment (sTempTime ,scTimeSeparator  ,3 ))
if !iTimeLength  then
	let iTimeLength = StringLength (StringSegment (sTempTime ,scTimeSeparator  ,2 ))
	if !iTimeLength  then
		let iTimeLength = StringLength (StringSegment (sTempTime ,scTimeSeparator,1 ))
		if !iTimeLength  then
			; no value
			Return cscNull
		Else
			; only second is available
			let sSecond = StringSegment (sTempTime ,scTimeSeparator  ,1 )
			Let sFormattedTime=  GetFormattedSecond(StringToInt (sSecond))
			Return sFormattedTime
		EndIf
	Else
		; Minute and seconds are available
		let sMinute = StringSegment (sTempTime ,scTimeSeparator  ,1 )
		let sSecond = StringSegment (sTempTime ,scTimeSeparator  ,2 )
		Let sFormattedTime=  GetFormattedMinute (StringToInt (sMinute ))
		Let sFormattedTime= sFormattedTime+ GetFormattedSecond(StringToInt (sSecond))
		Return sFormattedTime
	EndIf
Else
	; hours, Minutes, and seconds  exists
	let sHour = StringSegment (sTempTime ,scTimeSeparator ,1 )
	let sMinute = StringSegment (sTempTime ,scTimeSeparator,2 )
	let sSecond = StringSegment (sTempTime ,scTimeSeparator,3 )
	Let sFormattedTime= GetFormattedHour (StringToInt (sHour))
	Let sFormattedTime= sFormattedTime+ GetFormattedMinute (StringToInt (sMinute ))
	Let sFormattedTime= sFormattedTime+ GetFormattedSecond(StringToInt (sSecond))
	Return sFormattedTime
endIf
EndFunction

Void Function SayObjectActiveItem()
if (GetWindowName(GetFocus()) == WN_CurrentPlayList) then
;	PerformScript SayListItem()
	Return
EndIf
SayObjectActiveItem()
EndFunction

Script SayLine ()
var
	int iSubType,
	int iObjSubType,
	int iState,
	string sName,
	string sDesc,
	string sHotKey,
	string sContainerName,
	string sValue
If IsSameScript () Then
	SpellLine ()
	Return
EndIf
let iSubType=GetWindowSubTypeCode(GlobalFocusWindow)
If giObjSubType==wt_Button Then
	SayObjectTypeAndText()
	Return
	EndIf
if IsPCCursor () Then
	if (GetWindowName(GetFocus()) == WN_CurrentPlayList) then
		let giAnnounceHeaders=TRUE
		PerformScript SayListItem()
		Say(PositionInGroup (),OT_POSITION)
		Return
	EndIf
EndIf ; End of PC cursor
PerformScript SayLine()
EndScript

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	int iType
if KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	let iType=GetWindowSubTypeCode(GetFocus())
	If giObjSubType==wt_Button Then
		Pause()
		SayObjectTypeAndText()
		Return true
	ElIf iType==wt_ListView Then
		Pause()
		PerformScript SayListItem()
		Return true
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
EndFunction

Script MoveToCurrentPlayList ()
var
	handle hWnd
let hWnd=FindWindowWithClassAndID(GlobalRealWindow,wc_AtlSysListView32,ciCurrentPlayList)
If hWnd Then
	MoveToWindow(hWnd)
	LeftMouseButton()
	PcCursor()
Else
	Say(msgCurrentPlayListNotFound,OT_ERROR)
EndIf
EndScript

Script MoveToMainTree ()
var
	handle hWnd
let hWnd=FindWindowWithClassAndID(GlobalRealWindow,cwc_SysTreeView32,ciTreeView1007)
If hWnd Then
	MoveToWindow(hWnd)
	LeftMouseButton()
	PcCursor()
Else
	Say(msgMainTreeNotFound,OT_ERROR)
EndIf
EndScript

Void Function ProcessSpeechOnNewTextEvent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
if nAttributes& ATTRIB_HIGHLIGHT
&& lvIsCustomized(hwnd) then
	return
endIf
ProcessSpeechOnNewTextEvent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

Void Function SayHighlightedText (handle hWnd, string sBuffer, int nAttributes)
var
	int iType,
	int iControl,
	string sClass
let iControl=GetControlId(hWnd)
let sClass=GetWindowClass(hWnd)
let iType=GetWindowSubTypeCode(hWnd)
 SayHighlightedText (hWnd,sBuffer,nAttributes)
Return
EndFunction

Void Function SayNonHighlightedText (handle hWnd, string sBuffer)
var
	int iType,
	int iControl,
	string sClass
let iControl=GetControlId(hWnd)
let sClass=GetWindowClass(hWnd)
let iType=GetWindowSubTypeCode(hWnd)
If iType==wt_Dialog_Page  Then
	Say(GetWindowTextEx (hWnd, FALSE, FALSE),OT_SCREEN_MESSAGE)
	Return
EndIf

If iControl==ciStaticPrompt Then
	SayWindowTypeAndText(hWnd)
	Return
EndIf
SayNonHighlightedText (hWnd,sBuffer)
Return
EndFunction

void function ObjStateChangedEvent (handle hObj,int iObjType,int nChangedState,int nState, int nOldState)
;stop double speaking for list box items which are also checkboxes
If iObjType == WT_LISTBOXITEM Then
	return
EndIf

;Legacy code
;If iObjType == WT_TREEVIEW
;|| iObjType == WT_TREEVIEWITEM then
;	SayTreeViewLevel ()
;endIf

ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

void function ProcessBoundaryStrike(handle hWnd, int edge)
If StringContains(GetWindowName(hWnd) ,wn_CurrentPlayList)  Then
	Return
EndIf
ProcessBoundaryStrike(hWnd,Edge)
EndFunction

Script MutePlayer ()
{F7}
EndScript

Int Function BrailleAddObjectContainerName (int iSubTypeCode)
If !GlobalMenuMode Then
	Return TRUE
EndIf
Return FALSE
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,	handle prevHwnd, int prevObjectId, int prevChildId)
var
	int iType
let iType=GetWindowSubTypeCode(curHwnd)
If GetWindowName(curHwnd)==wn_CurrentPlayList Then
	Return
EndIf
If iType==wt_TreeView Then
	SayTreeViewLevel(TRUE)
	Return
EndIf
ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
EndFunction

void function SayObjectTypeAndText (optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	string sObjName,
	int iSubType
let iSubType=GetWindowSubTypeCode(GlobalFocusWindow)
let sObjName=GetObjectName(TRUE)
If StringContains(sObjName,scUnnamedView0) Then
	Say(wn_DefaultView,OT_SCREEN_MESSAGE)
	Return
ElIf StringContains(sObjName,onWmpAppHost) Then
	Return
EndIf
if (GetWindowName(GlobalFocusWindow) == WN_CurrentPlayList) then
;	PerformScript SayListItem()
	Return
EndIf
If iSubType==wt_Dialog_Page Then
	Return
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

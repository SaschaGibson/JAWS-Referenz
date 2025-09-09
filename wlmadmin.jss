; JAWS 6.10.xx Script file for WLM Admin network tools
; Copyright 1999-2015  by Freedom Scientific BLV Group, LLC
include "common.jsm"
include "hjconst.jsh"
include "hjglobal.jsh"
include "wlmadmin.jsh"
include "wlmadmin.jsm"

string Function FormatServerInformation ()
Var
	handle hParent,
	handle hWnd,
	string sTxt1,
	string sTxt2
let hParent = GetParent (GetFocus ())
let hWnd = FindDescendantWindow (hParent, id_ServerName )
let sTxt1 = GetWindowText (hWnd, FALSE)
let hWnd = FindDescendantWindow (hParent, id_IPAddress)
let sTxt2 = GetWindowText (hWnd, FALSE)
return FormatString (MsgServerInformation, sTxt1, sTxt2)
EndFunction

string Function FormatFeatureInformation ()
Var
	handle hParent,
	handle hWnd,
	string sTxt1,
	string sTxt2
let hParent = GetParent (GetFocus ())
let hWnd = FindDescendantWindow (hParent, id_FeatureName)
let sTxt1 = GetWindowText (hWnd, FALSE)
let hWnd = FindDescendantWindow (hParent, id_Version)
let sTxt2 = GetWindowText (hWnd, False)
return FormatString (MsgFeatureInformation, sTxt1, sTxt2)
EndFunction

string Function FormatServerStatistics ()
	Var
		handle hParent,
		handle hWnd,
		string sTxt1,
		string sTxt2,
		string sTxt3,
		string sTxt4,
		string sTxt5,
		string sTxt6,
		string sTxt7
	let hParent = GetParent (GetFocus ())
let hWnd= FindDescendantWindow (hParent, id_TotalUsersInUse )
let sTxt1 = GetWindowText (hWnd, FALSE)
let hWnd= FindDescendantWindow (hParent, id_TotalUsersTotal )
let sTxt2 = GetWindowText (hWnd, FALSE)
let hWnd = FindDescendantWindow (hParent, id_TotalUsersQueued )
let sTxt3 = GetWindowText (hWnd, FALSE)
let hWnd = FindDescendantWindow (hParent, Id_ReservedInUse )
let sTxt4 = GetWindowText (hWnd, FALSE)
let hWnd = FindDescendantWindow (hParent, id_ReservedTotal )
let sTxt5 = GetWindowText (hWnd, FALSE)
let hWnd = FindDescendantWindow (hParent, id_CommuterInUse )
let sTxt6 = GetWindowText (hWnd, FALSE)
let hWnd = FindDescendantWindow (hParent, id_CommuterTotal )
let sTxt7 = GetWindowText (hWnd, FALSE)
return  FormatString (MsgServerStatistics, sTxt1, sTxt2, sTxt3, sTxt4, sTxt5, sTxt6, sTxt7)
EndFunction

string Function FormatOtherFeatureInformation ()
Var
	handle hParent,
	handle hWnd,
	string sTxt1,
	string sTxt2
let hParent = GetParent (GetFocus ())
let hWnd = FindDescendantWindow (hParent, id_Redundant)
let sTxt1 = GetWindowText (hWnd, FALSE)
let hWnd = FindDescendantWindow (hParent, id_NumOfServers)
let sTxt2 = GetWindowText (hWnd, FALSE)
return FormatString (MsgOtherFeatureInformation, stxt1, sTxt2)
EndFunction

Void Function DisplayServerInformation ()
	If UserBufferIsActive () Then
	UserBufferDeactivate ()
EndIf
UserBufferClear ()
		UserBufferAddText (FormatServerInformation ())
UserBufferAddText (cscBufferNewLine)
UserBufferAddText (FormatFeatureInformation ())
UserBufferAddText (cscBufferNewLine)
userBufferAddText (FormatServerStatistics ())
UserBufferAddText (FormatOtherFeatureInformation  ())
UserBufferAddText (cscBuffernewLine)
UserBufferAddText (MsgReturnToTv)
UserBufferActivate ()
JAWSTopOfFile ()
SayAll ()
let giServerInfoActive = TRUE
EndFunction

Void Function SayFocusedWindow ()
Var
	handle hParent,
	int iControl,
	int iRestriction ,
	int iSubType,
	string sText
let hParent = GetParent (GlobalFocusWindow)
let iControl = GetControlID (GlobalFocusWindow)
If iControl == id_LicenseInfoLb
|| iControl == id_ClientInfoLB  Then
	If hParent != ghParent
	|| GetControlID (GlobalPrevFocus ) == id_ServerTV  Then
		SayMessage (OT_DIALOG_NAME, GetWindowName (hParent))
		let ghParent = hParent
	EndIf
EndIf
let iSubType = GetWindowSubTypeCode (GlobalFocusWindow)
If iSubType == WT_GROUPBOX  Then
	DisplayServerInformation ()
	return
EndIf
SayFocusedWindow ()
EndFunction

string Function GetLvItem (handle hWnd)
Var
	int iIndex,
	string sItem
let iIndex = lvGetFocusItem (hWnd)
let sItem = FormatString (MsgLvItem,lvGetItemText (hWnd, iIndex, 1), lvGetItemText (hWnd, iIndex, 2))
return sItem
EndFunction

Void Function SayHighLightedText (handle hwnd, string buffer)
Var
	handle hFocus,
	int iControl,
	int iSubType
let hFocus = GetFocus ()
let iSubType = GetWindowSubTypeCode (hFocus)
If iSubType == WT_LISTVIEW Then
	let iControl = GetControlID (hFocus)
	If iControl ==id_LicenseInfoLb
	|| iControl == id_ClientInfoLB  Then
		SayMessage (OT_HIGHLIGHTED_SCREEN_TEXT, GetLvItem (hFocus))
		return
	EndIf
EndIf
SayHighLightedText (hwnd, buffer)
EndFunction

Void Function AutostartEvent ()
let giServerInfoActive = FALSE
let giHelpScreenActive = FALSE
EndFunction

Void Function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if nKey == key_F6 Then ;switching between server info and server tree view
	If giServerInfoActive Then
		UserBufferDeactivate ()
		let giServerInfoActive  = FALSE
		TypeKey (ksF6); type the F6 key as it was previously eaten and we need to move back to the server tree view
	EndIf
EndIf
ProcessKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
 EndFunction


Void Function SayLine (optional int HighlightTracking, optional int bSayingLineAfterMovement)
Var
	handle hWnd,
	int iControl,
	int iIndex,
	string sItem
let hWnd = GetFocus ()
let iControl = GetControlID (hWnd)
If iControl ==id_LicenseInfoLb
|| iControl == id_ClientInfoLB  Then
	SayMessage (OT_LINE, GetLvItem  (hWnd))
	return
EndIf
SayLine (HighlightTracking,bSayingLineAfterMovement)
EndFunction

Void Function SayWord ()
Var
	handle hWnd,
	int iSubType
let hWnd = GetFocus ()
let iSubType = GetWindowSubTypeCode (hWnd)
If iSubType == WT_TABCONTROL Then
	IndicateControlType (WT_TABCONTROL, GetWindowName (hWnd), cscSpace)
	return
EndIf
SayWord ()
EndFunction

Script ScriptFileName ()
ScriptAndAppNames (Msg1_l)
EndScript

Script SpeakStaticClientInfo ()
Var
	handle hWnd,
	handle hTemp,
	string sDlgPageName
let hWnd = GetFocus ()
let sDlgPageName = GetWindowName (GetParent (hWnd))
If StringContains (sDlgPageName, scClientInfo) Then
	let hTemp = GetFirstWindow (hWnd)
	While hTemp && GetWindowTypeCode (hTemp) == WT_STATIC
		SayWindow (hTemp, READ_EVERYTHING)
		let hTemp = GetNextWindow (hTemp)
	EndWhile
Else
	SayMessage (OT_ERROR, MsgNotInClientInfo_L, MsgNotInClientInfo_S)
EndIf
EndScript

	Script SpeakStaticLicenseInfo ()
	Var
		handle hWnd,
		handle hTemp,
		string sDlgPageName,
		string sLicenseInfo
		let hWnd = GetFocus ()
	Let sDlgPageName = GetWindowName (GetParent (hWnd))
If StringContains (sDlgPageName, scLicenseInfo) Then
	let hTemp = GetFirstWindow (hWnd)
	While hTemp && GetWindowTypeCode (hTemp) == WT_STATIC
		SayWindow (hTemp, READ_EVERYTHING)
		let hTemp = GetNextWindow (hTemp)
	EndWhile
	Else
	SayMessage (OT_ERROR, MsgNotInLicenseInfo_L, MsgNotInLicenseInfo_S)
	return
EndIf
EndScript

Script MoveToServerTreeView ()
Var
	handle hWnd
let hWnd = GetFocus ()
If GetControlID (hWnd) ==id_ServerTV  Then
	SayObjectTypeAndText ()
	return
EndIf
let hWnd = GetFirstChild (GetFirstChild (GetAppMainWindow (GetFocus ())))
If hWnd Then
	SetFocus (hWnd)
	return
EndIf
SayFormattedMessage (OT_ERROR, msgTVNotFound_l, MsgTVNotFound_S)
EndScript

Script UpALevel ()
If giHelpScreenActive Then
	PerformScript UpALevel ()
	let giHelpScreenActive = FALSE
	If giServerInfoActive Then
		DisplayServerInformation ()
		return
	EndIf
EndIf
If giServerInfoActive  Then
; don't allow Esc to do it's job when server information is being displayed
	return
EndIf
PerformScript UpALevel ()
EndScript

Script WLMHotKeyHelp()
if (! JAWSHotKeys()) then
	If UserBufferIsActive () Then
		UserBufferDeactivate ()
	EndIf
	SayFormattedMessage (OT_USER_BUFFER,msgHotKeyHelp1_L)
	AddHotKeyLinks ()
	let giHelpScreenActive = TRUE
endIf
EndScript
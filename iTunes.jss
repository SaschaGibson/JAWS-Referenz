; Copyright 1995-2023 by Freedom Scientific, Inc.
; Script file for ITunes 8.xxx

Include "HjGlobal.jsh"
Include "hjconst.jsh"
Include "HjHelp.jsh"
Include "common.jsm"
Include "iTunes.jsh"
Include "iTunes.jsm"


void function FocusChangedEventEx (handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,int nChangeDepth)
var
	string sClass
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
;for when the Track list or grid view of the library should gain focus when the application does
if GetAppMainWindow(hwndFocus)!=GetAppMainWindow(hwndPrevFocus) then
	let sClass=GetWindowClass(hwndFocus)
	if sClass==wc_iTunesTrackList
	|| sClass==wc_iTunesThumbnailView then
		SetFocus(hwndFocus)
	endIf
endIf
if (hwndFocus != hwndPrevFocus &&
GetWindowClass(hwndFocus) == WC_iTunesWebViewControl) then
	; To work around an iTunes 9.0 bug where the store window
	; doesn't automatically inform JAWS that it must be refreshed,
	; we force a refresh whenever focus moves to this window from
	; another one.  There is internal code in JAWS to handle
	; refreshing when clicking links inside this window.
	Refresh()
EndIf
FocusChangedEventEx (hwndFocus, nObject, nChild,hwndPrevFocus, nPrevObject, nPrevChild,nChangeDepth)
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
if nChangeDepth == -1
&& (hwndFocus != hwndPrevFocus)
&& GetWindowClass(hWndFocus) ==wc_iTunesGridView then
	;the class restriction may not be necessary, remove it if later testing proves it unnecessary.
	FocusChangedEvent(hwndFocus,hwndPrevFocus)
	return
EndIf
if nType == wt_document
	TurnOffFormsMode()
EndIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
EndFunction

Script ScriptFileName()  ;JAWSKey+Q
ScriptAndAppNames (FormatString(msgAppName,intToString(GetProgramVersion(GetAppFilePath()))))
EndScript

Script iTunesFind()
if GetWindowClass(GetFocus()) == WC_iTunesWebViewControl
&& !UserBufferIsActive() then
	PerformScript IEFind ()
else
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
EndIf
EndScript

void function EnterStoreComboBox()
LeftMouseButton ()
TurnOnFormsMode ()
EndFunction

int function ShouldEnterStoreComboBox()
var int type= GetObjectSubTypeCode( true );
return ( IsVirtualPCCursor()
&& type == wt_combobox )
EndFunction

Script Enter()
	If ShouldEnterStoreComboBox()
		EnterStoreComboBox()
		return
	EndIf

PerformScript Enter()
EndScript

Script OpenListBox()
If ShouldEnterStoreComboBox()
	SayMessage (ot_JAWS_message, cmsg41_L, cmsgSilent)  ;open list box
	EnterStoreComboBox()
return
EndIf

PerformScript OpenListBox()
EndScript

Script CloseListBox()
If IsFormsModeActive()
&& GetObjectSubTypeCode( 2, 0 ) == wt_combobox
	SayMessage (ot_JAWS_message, cmsg42_L, cmsgSilent)  ;open list box
TypeKey (cksEnter)
	TurnOffFormsMode ()
	return
EndIf

PerformScript CloseListBox()
EndScript

int function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
If KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
If ShouldEnterStoreComboBox()
	EnterStoreComboBox()
	return true
EndIf
	If controlCanBeChecked()
	&& GetWindowSubtypeCode(getFocus()) == WT_TREEVIEW
	&& !getObjectState (TRUE) then
		;The MSAA refresh will force announcement of the new state
		MSAARefresh()
		return true
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd
let hWnd = GetCurrentWindow()
if !GlobalMenuMode
&& GetWindowClass(hWnd) == wc_iTunesPopupButton then
	IndicateControlType(WT_BUTTONDROPDOWN,GetObjectValue())
	return
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void function ValueChangedEvent (handle hWnd, int iObjId, int iChildID, int nObjType, string sObjName, string sObjValue, optional int bIsFocusObject)
if bIsFocusObject
&& !GlobalMenuMode
&& GetWindowClass(hWnd) == wc_iTunesPopupButton then
	IndicateControlType(WT_BUTTONDROPDOWN,sObjValue)
	return
EndIf
ValueChangedEvent (hWnd, iObjId, iChildID, nObjType, sObjName, sObjValue, bIsFocusObject)
EndFunction

void function BrailleAddObjectValue()
If IsFormsModeActive()
&& GetObjectSubTypeCode( 2, 0 ) == wt_combobox
	BrailleAddString (GetObjectValue( false ), 0, 0, 0, false)
	return
EndIf

BrailleAddObjectValue()
EndFunction

Script NextCell ()
if !InTable ()
&& !inTableCell ()
&& GetCurrentScriptKeyName () == ksAltCtrlRightArrow
	TypeCurrentScriptKey ()
	return
endIf
PerformScript NextCell()
EndScript

Script PriorCell ()
if !InTable ()
&& !inTableCell ()
&& GetCurrentScriptKeyName () == ksAltCtrlLeftArrow
	TypeCurrentScriptKey ()
	return
endIf
PerformScript PriorCell()
EndScript

Script DownCell ()
if !InTable ()
&& !inTableCell ()
&& GetCurrentScriptKeyName () == ksAltCtrlDownArrow
	TypeCurrentScriptKey ()
	return
endIf
PerformScript DownCell()
EndScript

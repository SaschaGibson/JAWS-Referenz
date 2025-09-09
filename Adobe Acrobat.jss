; Copyright 1995-2017 Freedom Scientific, Inc.
;JAWS Script set for The Adobe Acrobat and Adobe Acrobat Reader software


include "hjconst.jsh"
Include "HjGlobal.jsh"
include "MSAAConst.jsh"
include "HjHelp.jsh"
include "Acrobat.jsh"
include "acrobat.jsm"
Include "IE.jsh"
Include "ie.jsm"
Include "Common.jsm"
include "braille.jsh"
include "UIA.jsh"
;Use "Virtual.jsb"; Virtual is already used by default, so don't re-stack it
import "virtual.jsd" ; expose function declarations for the Virtual Cursor
import "UIA.jsd"

GLOBALS
int AcrobatVersion,
	int IgnoreOCRAlert, ; for checkbox in QuickSettings for alert in empty documents
	int globalDocumentOCR ; start PDF Recognition


;When spacebar is used in the virtual buffer to select a radio button, 
;we don't know whether the FocusChange or the ObjStateChange will fire first.
;we use a global to insure that the correct state is spoken when the spacebar is pressed.
const
	VerifyCheckStateBeforeAnnouncementDelay = 5  ;Time to wait for a function to occur after space is pressed
globals
	int gbVerifyCheckStateOnSpacePressed,  ;the global which tells us that the space was pressed
	int ScheduledClearCheckStateVerificationOnSpacePressed  ;The schedule id of the function which clears the global


Void Function AutoStartEvent()
AcrobatVersion = GetProgramVersion (GetAppFilePath ())
If AcrobatVersion < 5 then
;debug removed:	SwitchToConfiguration ("default")
	Return
EndIf
if gbSwitchingConfiguration then
	let gbSwitchingConfiguration = false
	FocusChangedEvent(GetFocus(),GlobalPrevFocus)
EndIf
SetJCFOption (OPT_MSAA_MODE, 1	)
let gbDocumentUpdatedFromPageChange=FALSE
;Defect 46231
;initialize the custom settings code correctly otherwise virtual jcf options wil be initialized from empty global variables
;causing unpredictable and strange results.
CustomSettingsStart ()
EndFunction

void function AutoFinishEvent ()
;globalDocumentOCR = FALSE; We can't do this or Results Viewer won't cancel the job in progress properly.
endFunction

int function IgnoreLegacyCalls ()
return AcrobatVersion >= 15
endFunction

void function loadNonJCFOptions ()
IgnoreOCRAlert = GetNonJCFOption ("IgnoreOCRAlert")
loadNonJCFOptions ()
endFunction

int function LoadingNewConfiguration(handle FocusWindow)
var
	string sOwner
if GetWindowClass(FocusWindow)== IE5CLASS then
	let sOwner = GetWindowOwner(FocusWindow)
	if sOwner then
		let sOwner = StringSegment(sOwner,cScDoubleBackSlash,StringSegmentCount(sOwner,cScDoubleBackSlash))
		if sOwner == cscOwnerApp_MSHTML then
			let gbSwitchingConfiguration = true
			SwitchToConfiguration(config_IE)
			Return true
		EndIf
	EndIf
EndIf
return false
EndFunction
/*****************************Unfinished:
This function is not called and needs repairs.
The loops are still incomplete.
void Function DoAcrobatChildWindows (Handle hWnd)
var
	handle hTemp,
	handle hPlaceHolder,
	handle hDrop,
	handle hDropTemp
Let hPlaceHolder = GetFirstChild (hWnd)
Let hTemp = hPlaceHolder
If (GetWindowSubtypeCode (hTemp) != WT_GROUPBOX) then
	SpeakWindowInformation (hTemp)
EndIf
While (hTemp)
	Let hTemp = GetNextWindow (hTemp)
	If GetWindowSubtypeCode (hTemp) != WT_GROUPBOX then
		SpeakWindowInformation (hTemp)
		Let hDrop = Null ()
	Else
		;Start secondary loop down and through group boxes:
		Let hPlaceHolder = hTemp
		Let hDrop = GetFirstChild (hTemp)
		Let hDropTemp = GetFirstChild (hDrop)
	EndIf
	While (hDrop&&
	GetWindowSubtypeCode (hDrop) == WT_GROUPBOX)
		If (GetWindowSubtypeCode (hDropTemp) == WT_GROUPBOX) then
		Else
			Let hDropTemp = GetNextWindow (hTemp)
		EndIf
		While (hDropTemp)
			Let hDropTemp = GetNextWindow (hDropTemp)
			If (GetWindowSubtypeCode (hDropTemp) != WT_GROUPBOX) then
				SayWindowTypeAndText (hDropTemp)
			Else
				Let hDrop = hDropTemp
				Let hDropTemp = GetFirstChild (hDrop)
			EndIf
		EndWhile
		If (GetWindowSubtypeCode (hTemp) != WT_GROUPBOX) then
			SpeakWindowInformation (hTemp)
		EndIf
	EndWhile
EndWhile
EndFunction

Void Function DoChildWindows (handle hWnd)
var
	int nSubtypeCode,
	handle hPlaceHolder,
	handle hTemp
If ! InAcrobatDialog () then
	DoChildWindows (hWnd)
	Return
EndIf
Let nSubtypeCode = GetWindowSubtypeCode (hWnd)
;Because control containers in this app can be many layers deep:
;The default DoChildWindows  helper does lateral children.
Let hPlaceHolder = hWnd
If GetWindowSubtypeCode (hPlaceHolder) != WT_GROUPBOX then
	SpeakWindowInformation (hPlaceHolder)
EndIf
Let hTemp = hPlaceHolder
While (hTemp)
	Let hTemp = GetNextWindow (hTemp)
	If (GetWindowSubtypeCode (hTemp) == WT_GROUPBOX) then
		DoAcrobatChildWindows (hTemp)
	Else
		;SayInteger (GetWindowSubtypeCode (hTemp))
		SpeakWindowInformation (hTemp)
	EndIf
EndWhile
EndFunction
EndComment*******************************/

Void function DialogPageChangedEvent(HANDLE hwndNewPage,HANDLE hwndOldPage)
;This function is not called / fired from internal event handlers for Adobe.
DialogPageChangedEvent(hwndNewPage,hwndOldPage)
EndFunction

void function FocusChangedEvent(handle FocusWindow, handle PrevWindow)
if LoadingNewConfiguration(FocusWindow) then
	return
EndIf
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
FocusChangedEvent(FocusWindow,PrevWindow)
EndFunction

void function FocusChangedEventEx (handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
If (GetWindowSubtypeCode (hwndFocus) == WT_TREEVIEW && hwndFocus == hwndPrevFocus)
|| (GetObjectSubtypeCode(SOURCE_CACHED_DATA) == wt_ListBoxItem && GetObjectSubtypeCode(SOURCE_CACHED_DATA,2) == wt_ComboBox) then
	Return (ActiveItemChangedEvent(hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild))
EndIf
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
FocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

void function SayHighlightedText (handle hwnd, string buffer)
var
	string strLine,
	int iControl,
	int iWinType,
	handle hwndParent,
	handle hwndGParent
let iControl = GetControlID (hwnd)
let iWinType = GetWindowSubTypeCode(hwnd)
If DialogActive ()
&& !InHJDialog() then
	if iWinType == WT_LISTBOX
	|| iWinType == WT_LISTBOXITEM Then
		; Preference list.
  		If	!ShouldItemSpeak (OT_DIALOG_TEXT)
       && iControl==iDPreferencesList*-1
	   	&& buffer == scUpdate Then
			return
		EndIf ; End preference list.
 	EndIf ; End list boxes.
	if GetScreenEcho() != ECHO_ALL
	&& hWnd != GlobalFocusWindow
	&& iWinType == wt_ReadOnlyEdit
	&& GetWindowSubtypecode(GlobalFocusWindow) == wt_TreeView then
		;Suppress the description windows while navigating in the About Plug In treeview
		return
	EndIf
EndIf ; End Dialog active.
;check to see if we are in an edit from a combobox or a listbox in a document window
if (IsFormsModeActive() && iWinType==WT_COMBOBOX) then
	return
EndIf
SayHighlightedText (hwnd, buffer)
EndFunction

void function SayNonHighlightedText (handle hwnd, string buffer)
var
	int iFocus,
	string sText,
	int iWinType,
	int iNextWinType,
	String TheClass
let TheClass = GetWindowClass (hWnd)
let iFocus = GetControlID (GetFocus())
let sText = GetWindowText(GetFocus(), read_highlighted)
let iWinType = GetWindowSubTypeCode(hwnd)
let iNextWinType = GetWindowSubTypeCode(GetNextWindow(hwnd))
If DialogActive() Then
	If GetWindowName(GetRealWindow(GetFocus()))==wnAvailableUpdatesDialog
	&& (iFocus==ID_AvailableUpdatesList
	|| iFocus==ID_SelectedUpdatesList) Then
		Return
	ElIf 	iFocus == iDPreferencesList*-1
	&& sText == scUpdate Then
		if (iWinType == WT_STATIC
		&& iNextWinType == WT_STATIC) then
			SayMessage (OT_DIALOG_TEXT, buffer)
			return
		EndIf ; end of static check
	EndIf ; End of iFocus check
EndIf ; End of dialog active
SayNonHighlightedText (hwnd, buffer)
EndFunction

int Function GetWindowSubTypeCode (handle hWndToType)
var
	string sWindowName,
	int nSubTypeCode
Let nSubTypeCode = GetWindowSubTypeCode (hWndToType)
if InHomeRowMode() then
	return nSubtypeCode
EndIf
let sWindowName = GetWindowName (hWndToType)
If DialogActive () then
	If nSubTypeCode == WT_3STATE then
		Return WT_CHECKBOX
	EndIf
EndIf
if (sWindowName==wNAcrobatTree) then
	let nSubTypeCode=WT_TREEVIEW
EndIf
if (nSubTypeCode==0) then
	let nSubTypeCode = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
EndIf
Return nSubTypeCode
EndFunction

void Function DoAndSayCurrentKeystroke ()
SayCurrentScriptKeyLabel ()
TypeCurrentScriptKey ()
EndFunction

int Function SayWindowTypeAndText (handle hWnd)
;Int is just to return true for EnumerateChildWindows
var
	int nSubTypeCode,
	string strComposedName
Let nSubTypeCode = GetWindowSubTypeCode (hWnd)
If ! DialogActive ()
|| GlobalMenuMode > 0 then
	SayWindowTypeAndText (hWnd)
	Return TRUE
EndIf
If nSubTypeCode == WT_LISTBOX then
	SayWindowTypeAndText (hWnd)
	;SayControlExWithMarkup (hWnd, GetWindowName (hWnd), GetWindowType (hWnd), cScNull, GetGroupBoxName (), cScNull, GetWindowText (hWnd, TRUE), PositionInGroup ())
	Return TRUE
ElIf nSubTypeCode == WT_DIALOG then
	If StringContains (GetWindowName (hWnd), wnGoToPage) then
		SayControlExWithMarkup (hWnd, wnGoToPage)
		Return TRUE
	EndIf
ElIf nSubTypeCode == WT_EDIT then
	If GetWindowName (GetRealWindow (hWnd)) == wnGoToPage then
		Let strComposedName = GetWindowText (GetPriorWindow (hWnd), FALSE)
		Let strComposedName = strComposedName+
			cScSpace+
			GetWindowText (hWnd,FALSE)+
			GetWindowText(GetNextWindow (hWnd),FALSE)
		SayControlExWithMarkup (hWnd, strComposedName)
		RETURN TRUE
	EndIf
ElIf nSubTypeCode == WT_CHECKBOX
|| nSubTypeCode == WT_3STATE then
	SayControlExWithMarkup (hWnd, GetWindowName (hWnd), GetWindowType (hWnd), GetObjectState ())
	Return TRUE
EndIf
SayWindowTypeAndText (hWnd)
Return TRUE
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
if inHjDialog () then
	return default::ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
endIf
If RealWindow == AppWindow
&& RealWindow != GlobalPrevReal then
	if GetWindowSubtypeCode(RealWindow) == wt_Dialog then
		if RealWindowName == wn_ReadingUntaggedDocument then
			SayWindowTypeAndText(RealWindow)
			return
		EndIf
	EndIf
EndIf
if InHjDialog() && getWindowClass(getTopLevelWindow(focusWindow)) == cWc_dlg32770 && ProcessSayRealWindowOnFocusChangeFromHJDialog(AppWindow, RealWindow, RealWindowName, FocusWindow) then
	SayWindowTypeAndText(RealWindow)
	return
Endif
ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
EndFunction

int Function HandleCustomRealWindows (handle RealWindow)
var
	handle hTemp,
	int iFirstType,
	int iNumOfStatics,
	string strTemp,
	handle FocusWindow,
	int iControl,
	int iWinType,
	string sWinName,
	handle child,
	handle sibling
If InHjDialog () then
	Return HandleCustomRealWindows (RealWindow)
EndIf
let gbInFindDialog=InFindDialog()
let gbInAcrobatDialog = InAcrobatDialog()
/*
Let FocusWindow = GetFocus()
let iWinType = GetSubTypeCode(FocusWindow)
let sWinName=GetWindowName(RealWindow)
If ! DialogActive ()
|| GlobalMenuMode then
	if IsFormsModeActive() &&
	((iWinType==WT_LISTBOXITEM) || (iWinType==WT_EDIT)) then
		return true;
	EndIf
	return WAS_NOT_SUCCESSFUL
EndIf
If DialogActive () then
	if iWinType == WT_LISTBOX then
		If sWinName==wnAvailableUpdatesDialog
		|| sWinName==wnPreferences Then
			Say(sWinName,OT_LINE,TRUE)
			If GetSelectedText()==cscNull Then
				NextLine()
			EndIf
			return WAS_SUCCESSFUL
		endif ; End of Preference&Available updates  dialog
	EndIf ; End of list boxes
	SayWindowTypeAndText(RealWindow)
	return true
endif ; End of dialog active.
If GetWindowSubTypeCode (FocusWindow) != WT_BUTTON then
	; These dialogs always place you on a button, generally the OK button
	Return WAS_NOT_SUCCESSFUL
EndIf
Let hTemp = FocusWindow
While GetPriorWindow (hTemp)
	Let hTemp = GetPriorWindow (hTemp)
	If GetWindowSubTypeCode (hTemp) == WT_STATIC then
		Let iNumOfStatics = iNumOfStatics+1
	EndIf
EndWhile
Let iFirstType = GetWindowSubTypeCode (FocusWindow)
While GetNextWindow (hTemp) &&
GetWindowSubTypeCode (hTemp) != iFirstType
	Let strTemp = (strTemp+cScSpace+GetWindowText (hTemp, FALSE))
	Let hTemp = GetNextWindow (hTemp)
EndWhile
SayControlExWithMarkup (RealWindow, GetWindowName (RealWindow), GetWindowType (RealWindow), cScNull, cScNull, cScNull, cScNull, cScNull, strTemp)
SayFormattedMessage (OT_CONTROL_TYPE, GetWindowType (RealWindow))
Return WAS_SUCCESSFUL
*/
EndFunction

Void Function SayFocusedWindow ()
var
	string strParent,
	string strClass,
	int iWinSubType,
	int iMSAA,
	int iControlId
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
let iControlId=GetCurrentControlId()
If GetWindowName(GetRealWindow(GetFocus()))==wnAvailableUpdatesDialog Then
	SayFocusedWindow()
	If GetWindowName(GetFocus())==wnDescription Then
		SayFormattedMessage(ot_user_buffer,GetWindowText(GetFocus(),READ_EVERYTHING))
	EndIf ; End of window name check
	Return
EndIf ; End of Available Updates dialog
if MenusActive () then
	SayFocusedWindow ()
	return
endIf
If GetWindowClass (GlobalFocusWindow) == cwc_Dlg32771 then
	;We are in the switch box from MSAA so ignore
	Return
EndIf
Let iMSAA = GetJcfOption (OPT_MSAA_MODE)
If DialogActive () then
	SetJcfOption (OPT_MSAA_MODE, 0)
EndIf
;check for listbox in forms mode
let iWinSubType = GetWindowSubtypeCode (GetFocus())
if IsFormsModeActive() then
	if ((iWinSubType==WT_EDIT) ||
	(iWinSubType==WT_EDITCOMBO)) then
		SetJcfOption (OPT_MSAA_MODE, iMSAA)
		return
	EndIf
	if (iWinSubType==WT_LISTBOX) then
		SetJcfOption (OPT_MSAA_MODE, iMSAA)
		sayObjectActiveItem()
		return
	EndIf
	if (iWinSubType==WT_COMBOBOX) then
		SetJcfOption (OPT_MSAA_MODE, iMSAA)
		return
	EndIf
EndIf
SayFocusedObject()
SetJcfOption (OPT_MSAA_MODE, iMSAA)
EndFunction

Script ScriptFileName ()
var
	string strAppName
let strAppName =GetAppFileName ()
if (StringContains (strAppName, "32")) then
	ScriptAndAppNames (msgAppNameReader)
else
	ScriptAndAppNames (msgAppNamePro)
EndIf
EndScript

void Function ScreenSensitiveHelpForKnownClasses (int iTypeCode)
If iTypeCode == WT_TREEVIEWITEM then
	SayFormattedMessage (OT_USER_BUFFER, (FormatString (msgScreenSensitiveHelp2, (IntToString (GetTreeViewLevel ())))))
	AddHotKeyLinks ()
Else
	ScreenSensitiveHelpForKnownClasses (iTypeCode)
EndIf
EndFunction

Script ScreenSensitiveHelp ()
var
	int iTypeCode,
	string strWinClass
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
If IsSameScript () then
	AppFileTopic (topic_Adobe_Acrobat_adb)
	Return
EndIf
If !UserBufferIsActive() Then
	If ! DialogActive () then
		If ! GlobalMenuMode then
			Let strWinClass = GetWindowClass (GetCurrentWindow ())
			Let iTypeCode = GetWindowSubTypeCode (GetCurrentWindow ())
			If ! iTypeCode then
				Let iTypeCode = GetObjectSubTypeCode ()
			EndIf
			If iTypeCode then
				ScreenSensitiveHelpForKnownClasses (iTypeCode)
				Return
			ElIf strWinClass == wcAcrobatTree then
				ScreenSensitiveHelpForKnownClasses (WT_TREEVIEW)
				Return
			ElIf StringContains (strWinClass, wcAcrobatMDI) then
				ScreenSensitiveHelpForKnownClasses (WT_MDICLIENT)
				Return
			EndIf
		EndIf
	EndIf
EndIf
PerformScript ScreenSensitiveHelp ()
EndScript

Script HotKeyHelp ()
var
	int iWinType
if TouchNavigationHotKeys() then
	return
endIf
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
Let iWinType = GetWindowSubTypeCode (GetCurrentWindow ())
If ! iWinType then
	Let iWinType = GetObjectSubTypeCode ()
EndIf
If iWinType == WT_GROUPBOX && (IsVirtualPcCursor ()) then
	;Adobe document type
	If UserBufferIsActive () then
		UserBufferDeactivate ()
	EndIf
	SayFormattedMessage (OT_USER_BUFFER, (msgHotKeyHelp1))
Else
	PerformScript HotKeyHelp ()
EndIf
EndScript



script SayNextCharacter()
var
	int iWinType,
	int iCursorRow
let iWinType = GetWindowSubtypeCode (GetFocus())
if IsPCCursor()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	if GetControlID(GetFocus())==IDPreferencesMainListbox then
		if GetWindowName(GetRealWindow(GetFocus()))==wnPreferences then
			return
		EndIf
	EndIf
	if (GetObjectSubTypeCode ()==WT_TABCONTROL) then
		NextCharacter ()
		return
	EndIf
EndIf
If IsFormsModeActive() then
	If ! GlobalMenuMode then
		NextCharacter()
		SayCharacter()
		Return
	EndIf
EndIf
if (GetObjectSubTypeCode ()==WT_TREEVIEWITEM) then
	;we want to announce the state change if we merely opened but did not navigate in the tree.
	let iCursorRow = GetCursorRow()
	NextCharacter()
	if GetCursorRow() == iCursorRow then
		MSAARefresh()
		Delay(3)
		SayObjectActiveItem()
	EndIf
	return
EndIf
PerformScript SayNextCharacter ()
EndScript

script SayPriorCharacter()
var
	int iCursorCol
if IsPCCursor()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	if GetControlID(GetFocus())==IDPreferencesMainListbox then
		if GetWindowName(GetRealWindow(GetFocus()))==wnPreferences then
			return
		EndIf
	EndIf
	if (GetObjectSubTypeCode ()==WT_TABCONTROL) then
		PriorCharacter ()
		return
	EndIf
EndIf
If IsFormsModeActive() then
	If ! GlobalMenuMode then
		PriorCharacter()
		SayCharacter()
		Return
	EndIf
EndIf
if (GetObjectSubTypeCode ()==WT_TREEVIEWITEM) then
	;we want to announce the state change if we merely closed but did not navigate in the tree.
	let iCursorCol = GetCursorCol()
	PriorCharacter ()
	if GetCursorCol() == iCursorCol then
		MSAARefresh()
		Delay(3)
		SayObjectActiveItem()
	EndIf
	return
EndIf
PerformScript SayPriorCharacter ()
EndScript

script SayNextWord ()
if IsPCCursor()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	if GetControlID(GetFocus())==IDPreferencesMainListbox then
		if GetWindowName(GetRealWindow(GetFocus()))==wnPreferences then
			return
		EndIf
	EndIf
EndIf
If IsFormsModeActive() then
	If ! GlobalMenuMode then
		NextWord ()
		SayWord ()
		Return
	EndIf
EndIf
PerformScript SayNextWord ()
EndScript

script SayPriorWord ()
if IsPCCursor()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	if GetControlID(GetFocus())==IDPreferencesMainListbox then
		if GetWindowName(GetRealWindow(GetFocus()))==wnPreferences then
			return
		EndIf
	EndIf
EndIf
If IsFormsModeActive() then
	If ! GlobalMenuMode then
		PriorWord ()
		SayWord ()
		Return
	EndIf
EndIf
PerformScript SayPriorWord ()
EndScript

Script JAWSPageUp()
if IsPCCursor()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	if GetControlID(GetFocus())==IDPreferencesMainListbox then
		if GetWindowName(GetRealWindow(GetFocus()))==wnPreferences then
			return
		EndIf
	EndIf
EndIf
PerformScript JAWSPageUp()
EndScript

script PageUp ()
performScript JAWSPageUp()
endScript

Script JAWSPageDown()
if IsPCCursor()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	if GetControlID(GetFocus())==IDPreferencesMainListbox then
		if GetWindowName(GetRealWindow(GetFocus()))==wnPreferences then
			return
		EndIf
	EndIf
EndIf
PerformScript JAWSPageDown()
EndScript

script PageDown ()
performScript JAWSPageDown()
endScript

Script Tab ()
SayCurrentScriptKeyLabel ()
TabKey ()
EndScript

Script ShiftTab ()
SayCurrentScriptKeyLabel ()
ShiftTabKey ()
EndScript

int function AskUserAndProceedWithOCR()
if IgnoreOCRAlert return 0 endIf ; check box was checked in QuickSettings
var
	string dlgTitle,
	;string dlgText,
	object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" ),
	object element = oUIA.GetElementFromHandle(GetFocus())
if element
	dlgTitle = element.name
	;dlgText = element.GetValuePattern().value
endIf
return ExMessageBox(msgPromptToOCRDocument,
	dlgTitle,
	MB_YESNO | MB_ICONQUESTION|MB_DEFBUTTON1)
EndFunction

Void Function DocumentLoadedEvent ()
var
handle currentWindow
;remember the focus because confirmation dialog may steal it
let currentWindow = GetFocus()
if IsEmptyVirtualDocument() 
&& getWindowName (globalPrevReal) != cwn8 then
	if AskUserAndProceedWithOCR() == IDYes
		PerformScript OCRDocument(currentWindow)
		return
	EndIf
EndIf
if (IsSecureDocument()) then
	Say (msgSecureDocument, OT_JAWS_MESSAGE, FALSE)
	return
EndIf
if IsFormsModeActive()
&& GetObjectSubtypeCode() == wt_ComboBox then
	;do not exit forms mode
	;and do not allow documentLoadedEvent to process
	return
EndIf
DocumentLoadedEvent()
EndFunction

Script VirtualPCCursorToggle ()
if IsSameScript () then
	SetDefaultJCFOption (OPT_VIRTUAL_PC_CURSOR, GetJCFOption (OPT_VIRTUAL_PC_CURSOR))
	if GetJCFOption (OPT_VIRTUAL_PC_CURSOR)==0 then
		SayFormattedMessage (OT_status, cMSG338_L, cMSG338_S) ;"The virtual cursor will be turned off for all applications"
		return
	else
		SayFormattedMessage (OT_status, cMSG339_L, cMSG339_S) ;"The virtual cursor will be turned on for all applications"
		Return
	endIf
endIf
if GetJCFOption (OPT_VIRTUAL_PC_CURSOR)==0 then
	SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 1)
	SayFormattedMessage (ot_status, cMSG291_L, cMSG_on)
else
	SetJCFOption (OPT_VIRTUAL_PC_CURSOR, 0)
	SayFormattedMessage (ot_status, cmsg292_l, cmsg_off)
endIf
EndScript



int function ExitFormsModeHelper()
var
	int iObjType
if IsFormsModeActive() then
	let iObjType = GetObjectSubtypecode()
	if iObjType == wt_EditCombo
	|| iObjType == wt_ComboBox
	|| iObjType == wt_ListBox then
		;first escape the combo box then exit forms mode:
		TypeKey(cksEscape) ;escape
		TurnOffFormsMode()
		SayMessage (ot_status, cMSG288_L, cMSG288_S) ; virtual pc cursor
		if BrailleInUse () then
			RouteBrailleToPC ()
			BrailleRefresh ()
		endIf
		return TRUE
	EndIf
EndIf
return ExitFormsModeHelper()
EndFunction


Script UpALevel ()
var
	int iWinType
let iWinType = GetWindowSubtypeCode (GetCurrentWindow())
if ((iWinType==WT_Menu) || (iWinType==WT_CONTEXTMENU)) then
	SayCurrentScriptKeyLabel ()
	TypeKey (cksEscape) ;escape
	delay(2)
	Say (GetChunk (), OT_JAWS_MESSAGE, FALSE)
	return
EndIf
PerformScript UpALevel()
EndScript

Script NextPage()
If DialogActive() then
	PerformScript NextDocumentWindowByPage ()
	Return;
EndIf
DoAndSayCurrentKeystroke ()
let gbDocumentUpdatedFromPageChange=TRUE
EndScript

Script PreviousPage ()
If DialogActive() then
	PerformScript PreviousDocumentWindowByPage ()
	Return;
EndIf
DoAndSayCurrentKeystroke ()
let gbDocumentUpdatedFromPageChange=TRUE
EndScript

Script GoToPage ()
DoAndSayCurrentKeystroke ()
let gbDocumentUpdatedFromPageChange=TRUE
EndScript

Script SelectPageUp()
DoAndSayCurrentKeystroke ()
let gbDocumentUpdatedFromPageChange=TRUE
EndScript

script SelectPageDown()
DoAndSayCurrentKeystroke ()
let gbDocumentUpdatedFromPageChange=TRUE
EndScript

Script PcCursor ()
PerformScript PcCursor ()
If UserBufferIsActive () then
	Return;
EndIf
;Push the FormsModeEvent if the TurnOffFormsMode function doesn't work
If IsFormsModeActive() then
	FormsModeEvent (FALSE)
EndIf
EndScript

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
If gISkipTutor then
	Return
EndIf
tutorMessageEvent(hwndFocus, nMenuMode)
EndFunction

Void Function SayTutorialHelp (int iObjType, int IsScriptKey)
if IgnoreLegacyCalls () then
	return SayTutorialHelp (iObjType, IsScriptKey) 
endIf
var
	int iRole,
	int iSpeak,
	int iWinSubType,
	int iState,
	string sCustomTutor
let iWinSubType = GetWindowSubtypeCode (GetFocus())
If ! iWinSubtype then
	Let iWinSubtype = GetSubTypeCode (GetFocus())
EndIf
let iRole = GetCurrentObject (0).accRole(0)
let iState = GetCurrentObject (0).accState(0)
;filter out the speaking of tutor messages for readonly controls
;if ((iState & STATE_SYSTEM_READONLY) ||
		;(iState & STATE_SYSTEM_UNAVAILABLE)) then
	;return
;EndIf
	; Tutorial Help can be called whether or not the iSpeak flag is set to automatic
	If IsScriptKey then
		Let iSpeak = OT_HELP
	Else
		Let iSpeak = OT_tutor
	EndIf
;Check to see if we have a custom frame message
;Generally created by Prompt Manager
Let sCustomTutor = GetFrameTutorMessage ()
If sCustomTutor > cScNull then
	SayUsingVoice (VCTX_MESSAGE, sCustomTutor, iSpeak)
	Return
EndIf
If (iRole==ROLE_SYSTEM_RADIOBUTTON) then
	SayTutorialHelp(WT_RADIOBUTTON,IsScriptKey)
	return
EndIf
If iWinSubtype then
	If iWinSubtype == WT_ButtonMenu THEN
		SayTutorialHelp (WT_BUTTON, IsScriptKey)
	Else
		SayTutorialHelp (iWinSubtype, IsScriptKey)
	EndIf
Else
	SayTutorialHelp(RoleToType (iRole),TRUE)
EndIf
return
EndFunction

int Function HandleCustomAppWindows (handle FocusWindow)
var
	handle hTemp,
	int iFirstType,
	int iNumOfStatics,
	string strTemp,
	handle RealWindow,
	int iControl,
	int iWinType
If InHjDialog () then
	Return HandleCustomAppWindows (FocusWindow)
EndIf
Let RealWindow = GetRealWindow(FocusWindow)
let iWinType = GetSubTypeCode(FocusWindow)
If (! DialogActive ())
|| GlobalMenuMode then
	if IsFormsModeActive() &&
	((iWinType==WT_LISTBOXITEM) || (iWinType==WT_EDIT)) then
		return TRUE
	EndIf
	if (GlobalMenuMode) then
		return TRUE
	EndIf
 	return WAS_NOT_SUCCESSFUL
EndIf
If DialogActive () then
	Return TRUE
endif
return WAS_NOT_SUCCESSFUL
EndFunction

int Function HandleCustomWindows(handle FocusWindow)
var
	int iWinType,
	int iControlId,
	int objectType,
	string sWinName,
	string sWinClass,
	string sWinText,
	string scriptName
	let scriptName = GetScriptAssignedTo(GetCurrentScriptKeyName())
	let objectType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
	if objectType == WT_MULTILINE_EDIT && !IsEmptyEditFormField() then
		IndicateControlType(wt_multiline_edit,GetObjectName(),cscSpace)
		SayUsingVoice(vctx_message,msgContainsText,ot_line)
		return true
	EndIf
	if (scriptName == "VirtualSpacebar" || scriptName == "BrailleRouting")
	&& (objectType == WT_RADIOBUTTON || objectType == WT_CHECKBOX)
		return true
	EndIf	
	if objectType == WT_DOCUMENT
		return false
	endIf
	if IgnoreLegacyCalls () then
		default::SayFocusedObject ()
		return TRUE
	endIf
Let gISkipTutor = FALSE
let iControlId=GetCurrentControlId()
let sWinClass=GetWindowClass(FocusWindow)
let sWinText=GetWindowText(GetFocus(),FALSE)
let iWinType = GetSubTypeCode(FocusWindow)
If DialogActive () then
	if iWinType == WT_LISTBOX then
		; Available updates dialog list boxes...
		If GetWindowName(GetRealWindow(FocusWindow))==wnAvailableUpdatesDialog Then
			; Nothing is highlighted/selected, so force it...
			SayFromCursor()
			Return
		EndIf ; End of Available updates list check.
		If GetWindowName(GetRealWindow(FocusWindow))==wnPreferences Then
			SayFormattedMessage(OT_SELECTED_ITEM,GetSelectedText())
		   	return TRUE
		endif ; End of Preference list.
	EndIf ; End of list box.
	SayObjectTypeAndText ()
	return TRUE
EndIf ; End of Dialog active.
if (IsVirtualPCCursor () || IsFormsModeActive()) then
	SayObjectTypeAndText ()
	; in forms mode, focus change will trigger the speaking of tutor message
	;in virtual mode it will not thus we need to call it from here
	if (!IsFormsModeActive())  then
		SayTutorialHelp (iWinType, TRUE)
		SayTutorialHelpHotKey (FocusWindow, TRUE)
	endIf
	return TRUE
EndIf
Let sWinName = GetWindowName (FocusWindow)
If (sWinName == wnAcrobatButtons ||
sWinName == wnAcrobatAttachmentsButtons) then
	;For buttons, the more granular approach.
	;For tab controls, use SayObjectTypeAndText to avoid the output "Read-only":
	If (iWinType == WT_BUTTON ||
	iWinType == WT_ButtonMenu) then
		SayObjectActiveItem ()
	ElIf iWinType == WT_TABCONTROL then
		SayObjectTypeAndText()
	Else
		SayObjectTypeAndText ()
	EndIf
	return TRUE
EndIf
If (sWinName == wnAcrobatTree) then
	If sWinName == GetWindowName (GlobalPrevFocus) then
		If gITreeSpeakWholeObject then
		;Likely we won't have two tree views back to back,
		;But right now we're speaking whole information when tree item changes, rather than item,
		;And the handle on the window changes each time a new item is highlighted.
		;For SayWindowPromptAndText only:
			SayObjectTypeAndText ()
			Let gITreeSpeakWholeObject = FALSE
		Else
			SayTreeViewLevel ()
			Let gITreeSpeakWholeObject = FALSE
			Let gISkipTutor = TRUE
		EndIf
	Else
		SayObjectTypeAndText ()
	EndIf
	Return TRUE
elif GetWindowClass(focusWindow) == cwc_SysMonthCal32 && getObjectName(SOURCE_CACHED_DATA,0) == wn_CalendarControl then
	var
		object oFocus,
		int cId
	let oFocus = getFocusObject(cId)
	let oFocus = oFocus.accChild(4)
	if oFocus then
		;say(oFocus.accName(childId_self),ot_selected_item)
		SayControlExWithMarkup (focusWindow, "", "", "", "", "", oFocus.accName(childId_self), "", "")
		return true
	Endif
elif GetWindowClass(focusWindow) == cwc_SysMonthCal32 && getObjectName(SOURCE_CACHED_DATA,0) == cScNull then
		SayControlExWithMarkup (focusWindow, "", "", "", "", "", getWord(), "", "")
		return true
EndIf
return FALSE
EndFunction

string function GetCustomTutorMessage()
if IgnoreLegacyCalls () then return GetCustomTutorMessage() endIf
var
	int iRole,
	int iState
let iRole = GetCurrentObject (0).accRole(0)
let iState = GetCurrentObject (0).accState(0)
if (IsFormsModeActive()) then
	if (iRole==ROLE_SYSTEM_PUSHBUTTON) then
		return msgButton
	EndIf
EndIf
if GetControlID(GetFocus())==IDPreferencesMainListbox then
	if GetWindowName(GetRealWindow(GetFocus()))==wnPreferences then
		return msgListBoxCustomTutorHelp
	EndIf
EndIf
return cscNull
EndFunction


Script OpenPreferencesDialog ()
DoAndSayCurrentKeystroke ()
EndScript

Script ChangeReadingOptions ()
DoAndSayCurrentKeystroke ()
EndScript

Script AccessibilityQuickCheck ()
DoAndSayCurrentKeystroke ()
EndScript

Int Function RoleToType (int pRole)
var
	int iType
let iType = 	WT_UNKNOWN
if (pRole==ROLE_SYSTEM_MENUBAR) then
	let iType = WT_MENUBAR
EndIf
if (pRole==ROLE_SYSTEM_SCROLLBAR) then
	let iType = WT_SCROLLBAR
EndIf
if (pRole==ROLE_SYSTEM_MENUPOPUP) then
	let iType = WT_CONTEXTMENU
EndIf
if (pRole==ROLE_SYSTEM_MENUITEM) then
	let iType = WT_MENU
EndIf
if (pRole==	ROLE_SYSTEM_TOOLTIP) then
	let iType = WT_TOOLTIP
EndIf
if (pRole==ROLE_SYSTEM_DOCUMENT) then
	let iType = WT_DOCUMENT
EndIf
if (pRole==ROLE_SYSTEM_DIALOG) then
	let iType = WT_DIALOG
EndIf
if (pRole==ROLE_SYSTEM_GROUPING) then
	let iType = WT_GROUPBOX
EndIf
if (pRole==ROLE_SYSTEM_TOOLBAR) then
	let iType = WT_TOOLBAR
EndIf
if (pRole==ROLE_SYSTEM_STATUSBAR) then
	let iType = WT_STATUSBAR
EndIf
if (pRole==ROLE_SYSTEM_TABLE) then
	let iType = WT_TABLE
EndIf
if (pRole==ROLE_SYSTEM_COLUMNHEADER) then
	let iType = WT_COLUMNHEADER
EndIf
if (pRole==ROLE_SYSTEM_ROWHEADER) then
	let iType = WT_ROWHEADER
EndIf
if (pRole==ROLE_SYSTEM_COLUMN) then
	let iType = WT_COLUMN
EndIf
if (pRole==ROLE_SYSTEM_ROW) then
	let iType = WT_ROW
EndIf
if (pRole==ROLE_SYSTEM_CELL) then
	let iType = WT_TABLECELL
EndIf
if (pRole==ROLE_SYSTEM_LINK) then
	let iType = WT_LINK
EndIf
if (pRole==ROLE_SYSTEM_HELPBALLOON) then
	let iType = WT_TOOLTIP
EndIf
if (pRole==ROLE_SYSTEM_LIST) then
	let iType = WT_LISTBOX
EndIf
if (pRole==ROLE_SYSTEM_LISTITEM) then
	let iType = WT_LISTVIEWITEM
EndIf
if (pRole==ROLE_SYSTEM_GRAPHIC) then
	let iType = WT_GENERALPICTURE
EndIf
if (pRole==	ROLE_SYSTEM_STATICTEXT) then
	let iType = WT_STATIC
EndIf
if (pRole==ROLE_SYSTEM_TEXT) then
	let iType = 	WT_EDIT
EndIf
if (pRole==ROLE_SYSTEM_PUSHBUTTON) then
	let iType = WT_BUTTON
EndIf
if (pRole==ROLE_SYSTEM_CHECKBUTTON) then
	let iType = WT_CHECKBOX
EndIf
if (pRole==ROLE_SYSTEM_RADIOBUTTON) then
	let iType = WT_RADIOBUTTON
EndIf
if (pRole==ROLE_SYSTEM_COMBOBOX) then
	let iType = WT_COMBOBOX
EndIf
if (pRole==ROLE_SYSTEM_PROGRESSBAR) then
	let iType = WT_PROGRESSBAR
EndIf
if (pRole==ROLE_SYSTEM_SLIDER) then
	let iType = WT_SLIDER
EndIf
if (pRole==ROLE_SYSTEM_BUTTONDROPDOWN) then
let iType = WT_BUTTONDROPDOWN
EndIf
if (pRole==ROLE_SYSTEM_BUTTONMENU) then
	let iType = WT_ButtonMenu
EndIf
if (pRole==ROLE_SYSTEM_BUTTONDROPDOWNGRID) then
	let iType = WT_BUTTONDROPDOWNGRID
EndIf
if (pRole==ROLE_SYSTEM_CLOCK) then
	let iType = WT_CLOCK
EndIf
if (pRole==ROLE_SYSTEM_SPLITBUTTON) then
	let iType = WT_SPLITBUTTON
EndIf
if (pRole==ROLE_SYSTEM_IPADDRESS) then
	let iType = WT_IPADDRESS
EndIf
if (pRole==ROLE_SYSTEM_OUTLINEBUTTON) then
	let iType = WT_OUTLINEBUTTON
EndIf
Return iType
EndFunction

globals
	object goComboObj,
	int giComboID,
	string gsComboVal,
	int giComboSched

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if giComboSched then
	unscheduleFunction(giComboSched)
	let giComboSched = 0
endIf
ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
endFunction

void function SetCheckStateVerificationOnSpacePressed()
gbVerifyCheckStateOnSpacePressed = true
ScheduledClearCheckStateVerificationOnSpacePressed = ScheduleFunction("ClearCheckStateVerificationOnSpacePressed",VerifyCheckStateBeforeAnnouncementDelay)
EndFunction

void function ClearCheckStateVerificationOnSpacePressed()
ScheduledClearCheckStateVerificationOnSpacePressed = 0
gbVerifyCheckStateOnSpacePressed = false
EndFunction

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if IgnoreLegacyCalls () then
	return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey) 
endIf
var
	int iRole,
	int iState
If KeyIsSpacebar(nKey,strKeyName,nIsBrailleKey) then
	let iRole = GetCurrentObject (0).accRole(0)
	if (iRole==ROLE_SYSTEM_RADIOBUTTON) then
		;The focus change or the obj state change will announce that the radio button is checked.
		;Functions SetCheckStateVerificationOnSpacePressed and ClearCheckStateVerificationOnSpacePressed ensure that the correct event announces the check state.
		SetCheckStateVerificationOnSpacePressed()
		return true
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Int Function OmitWhenDialogActive (int pTypeCode)
if ((pTypeCode==WT_RADIOBUTTON) ||
(pTypeCode==WT_Button) ||
(pTypeCode==WT_EDIT_SPINBOX) ||
(pTypeCode==WT_TREEVIEW) ||
(pTypeCode==WT_CHECKBOX)) then
	Return TRUE
EndIf
Return FALSE
EndFunction


Int function BrailleAppropriateCellData (int nSubType, int iCol, int iRow)
If GIBrlTBLZoom == ZOOM_TO_CURRENT_CELL then
	If (nSubType && not (nSubType== WT_STATIC)) then
		Return FALSE
	EndIf
	BrailleAddBrlCursorLine();So as one arrows up and down in a multi-line cell, it still responds
ElIf GIBrlTBLZoom == ZOOM_TO_CURRENT_ROW then
	BrailleRow(iCol,iRow)
ElIf GIBrlTBLZoom == ZOOM_TO_CURRENT_COL then
	BrailleColumn(iCol,iRow)
EndIf
Return TRUE;No further processing.
EndFunction

Void Function SayFocusedObject ()
If DialogActive () then
	If GetWindowName(GetRealWindow(GetFocus ()))==wnPreferences Then
	   	return
	endif ; End of Preference list.
endif ; End of Dialog active.
SayFocusedObject ()
EndFunction



Int Function SayComboAndListItems ()
var
	string strLine,
	int TheTypeCode,
	int bHandled
let bHandled=FALSE
let TheTypeCode = GetWindowSubTypeCode (GetCurrentWindow())
if IsFormsModeActive() &&
;((TheTypeCode==WT_COMBOBOX) ||
(TheTypeCode==WT_EDITCOMBO)
;(TheTypeCode==WT_LISTBOX) ||
;(TheTypeCode==WT_LISTBOXITEM) ||
;(TheTypeCode==WT_EDIT))
then
	let bHandled=TRUE
	let strLine = GetWindowText(GetFocus(),TRUE)
	if (!strLine) then
		let strLine = GetObjectValue()
	EndIf
	Say (strLine, OT_LINE, FALSE)
	Say (PositionInGroup (), OT_position, FALSE)
	return bHandled;we said something
endIf
return FALSE
EndFunction

void Function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
var
	int iObjType = GetObjectSubTypeCode(SOURCE_CACHED_DATA)
if iObjType == WT_DOCUMENT
	SayLine ()
	return
endIf
if IgnoreLegacyCalls () then
	return SayObjectTypeAndText(nLevel, includeContainerName)
endIf
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	string sSignatureState,
	int iState,
	int iRole
let iRole = GetCurrentObject (0).accRole(0)
let iState = GetCurrentObject (0).accState(0)
if iObjType == wt_tabControl then
	Say(GetObjectName(),ot_control_name)
	IndicateControlType(wt_tabControl,cscSpace,cscSpace)
	return
EndIf
if iObjType == WT_PDFSIGNATURE then
	let sSignatureState = SignatureState(iState)
	Say (sSignatureState, OT_ITEM_STATE, FALSE)
EndIf
if gbVerifyCheckStateOnSpacePressed
	;When space is pressed on a radio button,
	;the focus change may fire before the obj state change.
	;If so, the control will not yet be checked,
	;and announcement of the focus change should be deferred in favor of announcement by the obj state change.
	UnscheduleFunction(ScheduledClearCheckStateVerificationOnSpacePressed)
	ClearCheckStateVerificationOnSpacePressed()
	if !(GetObjectStateCode() & CTRL_CHECKED) return endIf
endIf
SayObjectTypeAndText (nLevel,includeContainerName)
EndFunction

String Function SignatureState (int iState)
var
	string sState
if ((iState & STATE_SYSTEM_CHECKED) &&
		not (iState & STATE_SYSTEM_TRAVERSED)) then
		return msgUnverified
		EndIf
	if (not (iState & STATE_SYSTEM_CHECKED) &&
		(iState & STATE_SYSTEM_TRAVERSED)) then
	return msgInvalid
	EndIf
	if ((iState & STATE_SYSTEM_CHECKED) &&
		(iState & STATE_SYSTEM_TRAVERSED)) then
	return msgValid
EndIf
EndFunction

Int Function InFindDialog ()
var
	handle hFocusWindow,
	handle hTemp,
	string strTemp
	Let hFocusWindow = GetFocus()
let hTemp = hFocusWindow
let strTemp = GetWindowClass(hTemp)
while (hTemp && not (strTemp=="AVL_AVView"))
let hTemp=GetParent (hTemp)
let strTemp = GetWindowClass(hTemp)
EndWhile
if (GetWindowClass (hTemp)=="AVL_AVView") then
let strTemp= GetWindowName (hTemp)
EndIf
if (strTemp==wNAcrobatFind) then
return TRUE
EndIf
return FALSE
EndFunction

Int Function InAcrobatDialog ()
var
	handle hFocusWindow,
	handle hTemp,
	string strTemp
	Let hFocusWindow = GetFocus()
let hTemp = hFocusWindow
let strTemp = GetWindowClass(hTemp)
while (hTemp && not (strTemp=="#32770"))
let hTemp=GetParent (hTemp)
let strTemp = GetWindowClass(hTemp)
EndWhile
if (strTemp=="#32770") then
return TRUE
EndIf
return FALSE
EndFunction

Script SayWord ()
var
	string strVal,
	int iSubTypeCode
if !GlobalMenuMode && !UserBufferIsActive() then
	Let iSubTypeCode = GetWindowSubTypeCode (GetFocus ())
	If (iSubTypeCode == WT_TREEVIEWITEM
	|| iSubTypecode == wt_TreeView) then
		Let strVal = GetObjectValue ()
		If ! strVal then
			Let strVal = GetObjectName ()
		EndIf ; End of object has no value check.
		if ! strVal then
			let strVal = GetChunk ()
		EndIf
		DoStateForGraphics ();Handle custom check boxes.
		let strVal = StringSegment (strval, " ", 1)
		SayMessage (OT_WORD, strVal)
		Return
EndIf ; End of tree view
EndIf
PerformScript SayWord()
EndScript

Void Function SayLineUnit (int iMoveUnit, int bMoved)
var
	string strLine,
	int TheTypeCode,
	object objAcc
;return if in a menu
if GlobalMenuMode then
	return
EndIf
if IsJAWSCursor()
|| IsInvisibleCursor() then
	SayLine (TRUE)
	return
EndIf
if IsLeftButtonDown() then
	SelectingText(TRUE)
	pause ()
	SelectingText(false)
	return
endIf
let TheTypeCode = GetWindowSubTypeCode (GetFocus())
;code to speak combobox and list values in forms mode:
if SayComboAndListItems() == TRUE then
	return
EndIf
if IsVirtualPCCursor() then
	SayLine (2)
	return
endIf
If TheTypeCode == WT_COMBOBOX then
	Return
endif
if TheTypeCode == WT_LISTBOXITEM
|| TheTypeCode == WT_LISTBOX then
	If IsPcCursor()
	&& GetWindowName(GetRealWindow(GetFocus()))==wnAvailableUpdatesDialog Then
		If GetCurrentControlId()==ID_AvailableUpdatesList
		|| GetCurrentControlId()==ID_SelectedUpdatesList Then
			PcCursor()
		EndIf ; End of check for lists.
	EndIf ; End of Check for PcCursor and Updates window.
	Return
endif
if TheTypeCode == wt_ListView
|| TheTypeCode == wt_ExtendedSelect_ListBox
|| TheTypeCode == wt_MultiSelect_ListBox then
	return
EndIf
if TheTypeCode == WT_SPINBOX
|| TheTypeCode == WT_EDIT_SPINBOX then
	Say(GetLine(),OT_LINE)
	return
EndIf
if DialogActive()
&& OmitWhenDialogActive(TheTypeCode) then
	Return
EndIf
if TheTypeCode==WT_TREEVIEWITEM
|| TheTypeCode==WT_TREEVIEW then
	return
EndIf
if TheTypeCode==WT_RADIOBUTTON then
	return
EndIf
if TheTypeCode == wt_button then
	return
EndIf
if TheTypeCode == wt_ComboBox
|| TheTypeCode == wt_EditCombo then
	return
EndIf
If StringCompare(GetWindowName(GlobalFocusWindow),wn_HowToContentsView) == 0 then
	;Focus will move from link to link,
	;so bail here to avoid double-speaking.
	return
EndIf
if GetWindowClass(GlobalFocusWindow) == cwc_SysMonthCal32 then
	;an event will speak the date change
	return
EndIf
SayLine(2)
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int bIsFocusObject)
if nObjType==wt_editCombo then
	return; avoid doublespeaking of edit combos
endIf
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
endFunction

int function BrailleAddObjectValue(int iSubtype)
if iSubtype == wt_ListBox then
	if IsFormsModeActive() then
		BrailleAddString(GetObjectName(),0,0,0)
		return true
	EndIf
elif iSubtype == wt_ComboBox then
	if IsFormsModeActive() then
		BrailleAddString(GetObjectValue(),0,0,0)
		return true
	EndIf
EndIf
return BrailleAddObjectValue(iSubtype)
EndFunction

string function GetCurrentListViewItemName()
if IsFormsModeActive() then
	return GetObjectName()
EndIf
return GetCurrentListViewItemName()
EndFunction

void function DocumentUpdated(int nLineNumberOfChange, int bUserInvoked)
if (gbDocumentUpdatedFromPageChange) then
	let gbDocumentUpdatedFromPageChange=FALSE
	SayLine()
	return
endIf
DocumentUpdated(nLineNumberOfChange, bUserInvoked)
endFunction

Script SayColor ()
var
	int bSpeakRGB,
	int iTextColor,
	string sTextColorName
If (! IsVirtualPcCursor () ||
GetWindowClass (GetCurrentWindow ()) != wcAcrobatTree) then
	PerformScript SayColor ()
	Return
EndIf
;Background color is misleading,
;Always registered as white
let iTextColor=GetColorText()
if IsSameScript() then
	let bSpeakRGB=TRUE
else
	let bSpeakRGB=FALSE
endIf
if bSpeakRGB then
	let sTextColorName=ColorToRGBString(iTextColor)
else
	let sTextColorName=StringMixedCaseToMultiword(GetColorName(iTextColor))
	Let sTextColorName = (FormatString (msgColorText, sTextColorName))
endIf
SayFormattedMessage (OT_USER_REQUESTED_INFORMATION, sTextColorName)
EndScript

Script SayWindowPromptAndText ()
If IsPcCursor () &&
GetSubtypeCode (GetCurrentWindow ()) == WT_TREEVIEWITEM then
	Let gITreeSpeakWholeObject = TRUE
Else
	Let gITreeSpeakWholeObject = FALSE
EndIf
if IsVirtualPcCursor () then
	SpeakSmartNavLevelSetting ()
endIf
PerformScript SayWindowPromptAndText ()
EndScript

Script NextDocumentWindow ()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
If ! IsMultipageDialog () then
	TypeKey(cksControlTab)
	Return
EndIf
PerformScript NextDocumentWindow ()
EndScript

Script PreviousDocumentWindow ()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
If ! IsMultipageDialog () then
	TypeKey(cksControlShiftTab)
	Return
EndIf
PerformScript PreviousDocumentWindow ()
EndScript

string function ToggleBlankLineBetweenParagraphs(int iRetCurVal)
var
	int iSetting,
	string JCFFileName
Let iSetting = GetJcfOption(OPT_ADD_BLANK_LINES_FOR_PARAGRAPHS)
If !iRetCurVal then
	Let iSetting = !iSetting
	SetJcfOption(OPT_ADD_BLANK_LINES_FOR_PARAGRAPHS,iSetting)
	let jcfFileName = StringChopRight(GetScriptFilename(true),3)+jcfFileExt
	IniWriteInteger(SECTION_OPTIONS,hKey_AddBlankLineForParagraphs,iSetting,jcfFileName,true)
EndIf
If iSetting then
	return msgUO_On
else
	return msgUO_Off
EndIf
EndFunction

string function ToggleBlankLineBetweenParagraphsHlp()
return msgBlankLineBetweenParagraphsHlp
EndFunction

Script AdjustJAWSOptions()
var
	string sList
let sList =
	uoToggleBlankLineBetweenParagraphs
ConvertListToNodeList(sList,GetActiveConfiguration ())
OptionsTreeCore(sList)
EndScript

int function HasVirtualEnhancedClipboard()
return true
EndFunction

Void Function Unknown(string TheName,int isScript)
TheName = StringLower (TheName)
if dialogActive() then
	if TheName==sn_SayNextLine then
		NextLine()
		return
	elIf TheName==sn_SayPriorLine then
		PriorLine()
		return
	endIf
endIf
Unknown(TheName,isScript)
EndFunction

int Function vCursorAutoFormsMode(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption(OPT_AUTO_FORMS_MODE)
If !iRetCurVal then
	Let iSetting = !iSetting
	SetJCFOption(OPT_AUTO_FORMS_MODE, iSetting)
	IniWriteInteger(SECTION_FormsMode,hKey_AutoFormsMode,iSetting,file_adobe_acrobat_jcf,true)
EndIf
return vCursorAutoFormsModeTextOutput(iSetting)
EndFunction

int Function vCursorIndicateFormsModeWithSounds(int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption(OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE)
If !iRetCurVal then
	Let iSetting = !iSetting
	SetJCFOption(OPT_USE_SOUNDS_TO_INDICATE_FORMSMODE,iSetting)
	IniWriteInteger(SECTION_FormsMode,hKey_IndicateFormsModeWithSounds,iSetting,file_adobe_acrobat_jcf,true)
EndIf
return vCursorIndicateFormsModeWithSoundsTextOutput(iSetting)
EndFunction

Script CloseListBox()
if GetWindowClass(GetFocus()) == cwc_SysMonthCal32 then
	SayCurrentScriptKeyLabel()
	return
EndIf
PerformScript CloseListBox()
EndScript

Script VirtualFind ()
PerformScript JAWSFind ()
EndScript

handle Function FindWindowForOCR()
var
	object oMain = FSUIAGetElementFromHandle(GetAppMainWindow (GetFocus())),
	object oCondition = FSUIACreateIntPropertyCondition(UIA_ControlTypePropertyID, UIA_ScrollBarControlTypeId),
	object oElement = oMain.findFirst(TreeScope_Descendants, oCondition)
oElement = FSUIAGetPriorSiblingOfElement (oElement)
return oElement.nativeWindowHandle
EndFunction

GLOBALS ; // Private::Copied from Default
	Int GlobalOCRJobID

Script OCRDocument (handle documentHwnd)
var
	int PrimaryLanguage = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	int SecondaryLanguage = ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF)
if !documentHwnd then
	documentHwnd = GetFocus()
EndIf
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if CanRecognize () != OCR_SUCCESS then
	SayFormattedMessage (OT_ERROR, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
	Return
endIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
if GetObjectSubtypeCode(SOURCE_CACHED_DATA) != WT_DOCUMENT 
&& getWindowClass (documentHwnd) != wcAcrobatTree then
	SayMessage (OT_ERROR, msgNoDocumentOpen)
	return
endIf
GlobalOCRJobID = OCRPdf (documentHwnd, PrimaryLanguage, SecondaryLanguage)
if !GlobalOCRJobID
	documentHwnd = FindWindowForOCR()
	GlobalOCRJobID = OCRPdf (documentHwnd, PrimaryLanguage, SecondaryLanguage)
endIf
if GlobalOCRJobID then
	SayMessage (OT_JAWS_MESSAGE, msg_OCRDocumentStarted_L, MSG_OCRStarted_S)
	globalDocumentOCR = TRUE
Else
	if !FSUIAGetFirstChildOfElement (FSUIAGetElementFromHandle (documentHwnd))
		;Cannot determine location of PDF document
		SayMessage (OT_ERROR, msgPDFLocationError)
	else
		;generic error
		SayFormattedMessage (OT_ERROR,  MSG_OCR_PDF_FAILED_TO_Start)
	endIf
endIf
endScript

script OCRAllInOne ()
if !DialogActive ()
	PerformScript OCRDocument ()
	return
endIf
PerformScript OCRAllInOne ()
EndScript

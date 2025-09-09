; Copyright 1995-2023 by Freedom Scientific, Inc.
; Freedom Scientific script file for some areas of Windows OS

include "HJConst.jsh"
include "MSAAConst.jsh"
include "UIA.jsh"
include "common.jsm"
include "Windows OS.jsm"
include "ie.jsm"
import "UIA.jsd"

const
	cwc_OperationStatusWindow = "OperationStatusWindow"

globals
;for the parent object name in DirectUIhWND class windows when we must keep track of it:
	string sDirectUIhWND_GroupName,
collection c_WindowsOSFocus
	;
	; Members are:
	; int IsPropertiesDialog -- Result of IsPropertiesDialog function call.
	; string ControlDescription -- Description text from UpdateDescriptionAndGroupFromPriorSiblings.
	; string GroupName -- Group name from UpdateDescriptionAndGroupFromPriorSiblings.

void function AutoStartEvent()
if !c_WindowsOSFocus c_WindowsOSFocus = new collection endIf
endFunction

void function AutoFinishEvent()
collectionRemoveAll(c_WindowsOSFocus)
endFunction

Void Function UpdateWindowsOSFocus (optional int iType)
collectionRemoveAll(c_WindowsOSFocus)
c_WindowsOSFocus.IsPropertiesDialog = IsPropertiesDialog ()
if c_WindowsOSFocus.IsPropertiesDialog
&& iType == WT_BUTTON
	UpdateDescriptionAndGroupFromPriorSiblings ()
	endIf
EndFunction

Function UpdateDescriptionAndGroupFromPriorSiblings ()
var
	string sName,
	string sText,
	string sDescription,
	int continue = true,
	object oValuePattern,
	object treewalker = CreateUIARawViewTreeWalker(TRUE)
treewalker.currentElement = FSUIAGetFocusedElement ()
while continue
&&treewalker.goToPriorSibling()
&& (treewalker.currentElement.controlType == UIA_TextControlTypeID
|| treewalker.currentElement.controlType == UIA_EditControlTypeID
|| treewalker.currentElement.controlType == UIA_DocumentControlTypeId
|| treewalker.currentElement.controlType == UIA_ImageControlTypeID)
	if treewalker.currentElement.controlType != UIA_ImageControlTypeID
		;text is collected from all control types found in the while conditions, except for images
		if treewalker.currentElement.controlType != UIA_TextControlTypeID
			;need to get the value from edit and document types, but not text types
			oValuePattern = treewalker.currentElement.GetValuePattern()
			if oValuePattern.isReadOnly == UIATrue
				sText = oValuePattern.Value
				sDescription = sText + cscSpace + sDescription
			elIf !treewalker.currentElement.Name
			&& !oValuePattern.value
				;dummy element, allow to continue
			else
				;an unrelated control has been found, stop collecting text
				continue = false
			endIf
		else
			;collect name from text types
			sText = treewalker.currentElement.name
			sDescription = sText + cscSpace + sDescription
		endIf
	endIf
endWhile
if treewalker.currentElement.controlType == UIA_GroupControlTypeID
&& !FSUIAGetFirstChildOfElement (treewalker.currentElement)
	;group with zero children, would not otherwise be spoken
	sText = treewalker.currentElement.Name
	c_WindowsOSFocus.GroupName = sText
endIf
if !StringIsBlank (sDescription)
	c_WindowsOSFocus.ControlDescription = StringTrimTrailingBlanks (sDescription)
endIf
EndFunction

Int Function IsPropertiesDialog ()
var
	handle hFocus = GetFocus (),
	handle hAppMainWindow = GetAppMainWindow (hFocus),
	string sRealWindowName = GetWindowName (GetRealWindow (hFocus)),
	string sAppMainWindowName = GetWindowName (hAppMainWindow)
return StringContains (sRealWindowName, scProperties)
|| StringContains (sAppMainWindowName, scProperties)
EndFunction

string function GetFocusGroupName()
var
	int iLevel,
	int iTopLevel,
	string sName
SaveCursor()
PCCursor()
let iLevel = 1
let iTopLevel = GetAncestorCount()
while iLevel <= iTopLevel
	if GetObjectSubtypecode(SOURCE_CACHED_DATA,iLevel) == wt_GroupBox then
		let sName = GetObjectName(SOURCE_CACHED_DATA,1)
		;enable breaking out of the loop early by setting iLevel to iTopLevel:
		let iLevel = iTopLevel
	endIf
	let iLevel = iLevel+1
EndWhile
RestoreCursor()
return sName
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
var
	string sGroupName,
	string sPrevGroupName
	UpdateWindowsOSFocus (nType)
if sClass == cwc_DirectUIhWND then
	if GetWindowClass(GetTopLevelWindow(hwndFocus)) == cwc_OperationStatusWindow
	&& nChangeDepth > 1
	&& nType == wt_Button then
		UIARefresh(true)
	EndIf
	let sPrevGroupName = sDirectUIhWND_GroupName
	let sGroupName = GetFocusGroupName()
	let sDirectUIhWND_GroupName = sGroupName
else
	let sDirectUIhWND_GroupName = cscNull
EndIf
if sGroupName
&& sGroupName == sPrevgroupName then
	SayObjectActiveItem()
	return
EndIf
if nChangeDepth == -1 then
	if GetAppMainWindow(hWndFocus) != GetAppMainWindow(hwndPrevFocus) then
		FocusChangedEvent(hwndFocus,hwndPrevFocus)
		return
	endIf
endIf
ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth, sClass, nType)
EndFunction

void Function FocusChangedEventProcessAncestors(handle FocusWindow, handle PrevWindow)
var
	int nLevel,
	string sName
if GetWindowClass(FocusWindow) == cwc_DirectUIhWND
&& GetWindowClass(GetTopLevelWindow(FocusWindow)) == cwc_OperationStatusWindow then
	let nLevel = GetFocusChangeDepth()
	while nLevel >= 0
		if nLevel > 1
		&& !GetObjectSubtypecode(SOURCE_CACHED_DATA,nLevel) then
			let sName = GetObjectName(SOURCE_CACHED_DATA,nLevel)
			if sName
			&& StringRight(GetObjectName(SOURCE_CACHED_DATA,nLevel-1),StringLength(sName)) == sName then
				;skip over announcing this redundant information:
				let nLevel= nLevel-1
			EndIf
		EndIf
		sayObjectTypeAndText(nLevel)
		let nLevel= nLevel-1
	EndWhile
	return
EndIf
FocusChangedEventProcessAncestors(FocusWindow,PrevWindow)
EndFunction

Int Function HandleCustomAppWindows(handle hWnd)
var
 	string sWndName,
	handle hFocus,
 	handle hAppWnd
if GetWindowClass(hWnd) == cWc_dlg32770
&& IsWinVista() then
 	let sWndName = GetWindowName(hWnd)
 	if StringCompare(sWndName,wn_DeleteFile) == 0
 	|| StringCompare(sWndName,wn_DeleteFolder) == 0
 	|| StringCompare(sWndName,wn_DeleteShortcut) == 0 then
 		SayWindowTypeAndTextForNonstandardDialogs (hWnd, sWndName)
 		return true
 	EndIf
EndIf
;shlwapi.dll as desktop does not have a window title,
;but we say that it is the desktop anyway:
if GetAppFileName () == sApp_shlwapi then
	let hFocus = GetFocus()
	let hAppWnd = GetAppMainWindow(hFocus)
	if !GetWindowName(hAppWnd)
	&& GetWindowClass(hAppWnd) == cwc_WorkerW
	&& GetWindowClass(GetParent(hFocus)) == cwc_ShellDll_DefView
	&& !GetWindowName(GetRealWindow(hFocus))
	&& GetWindowSubtypeCode(hFocus) == wt_ListView then
		Say(cmsgAppName_shlwapi,OT_APP_START)
		return true
	endIf
endIf
if c_WindowsOSFocus.IsPropertiesDialog
	IndicateControlType (WT_DIALOG, sWndName)
	var string sPageName = GetDialogPageName ()
	if !StringIsBlank (sPageName)
		IndicateControlType (WT_DIALOG_PAGE, sPageName)
	endIf
	return true
endIf
Return HandleCustomAppWindows(hWnd)
EndFunction

void Function SayWindowTypeAndTextForNonstandardDialogs (handle hwnd, string name)
var
	string sMessage
let sMessage = FormatString (msgDialog1_L, name)
Say(sMessage,ot_dialog_name)
let hwnd = GetFirstChild (hwnd)
while hwnd
	if GetWindowSubTypeCode (hwnd) == wt_static
	|| GetWindowClass(hWnd) == cwc_SysLink then
		SayWindow (hwnd, read_everything)
	EndIf
	let hwnd = GetNextWindow (hwnd)
EndWhile
EndFunction

void function SayWindowTitleForApplication(handle hAppWnd, handle hRealWnd,
	handle hCurWnd, int iTypeCode)
;shlwapi.dll as desktop does not have a window title,
;but we say that it is the desktop anyway:
if GetAppFileName () == sApp_shlwapi then
	if !GetWindowName(hAppWnd)
	&& GetWindowClass(hAppWnd) == cwc_WorkerW
	&& GetWindowClass(GetParent(GetFocus())) == cwc_ShellDll_DefView
	&& !GetWindowName(hRealWnd)
	&& iTypeCode == wt_ListView then
		SayMessage(ot_USER_REQUESTED_INFORMATION,
			FormatString (cmsg29_L, cmsgAppName_shlwapi, cscNull),
			FormatString (cMsg29_S, cmsgAppName_shlwapi, cscNull))
		return
	endIf
endIf
SayWindowTitleForApplication(hAppWnd, hRealWnd, hCurWnd, iTypeCode)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	object oTree,
	object oItem,
	handle hWnd,
	int nType
let hWnd = GetFocus()
let nType = GetObjectSubtypecode(SOURCE_CACHED_DATA,nLevel)
if GetWindowClass(hWnd) == cwc_DirectUIhWND
&& GetWindowClass(GetTopLevelWindow(hWNd)) == cwc_OperationStatusWindow then
	;By checking the type first,
	;we ensure that the accessible tree is only built when these types are to be announced:
	if nType == wt_button
	|| nType == wt_Link then
		let oTree = GetUIAObjectTree(hWnd)
		if oTree then
			;speak the static text that goes with these controls:
			if nType == wt_Button then
				let oItem = oTree.FindByAutomationId("eltConflictInterruptDescription")
			elif nType == wt_Link then
				let oItem = oTree.FindByKeyboardFocus(1).PriorSibling
				if oItem.Role != ROLE_SYSTEM_STATICTEXT then
					let oItem = Null()
				EndIf
			EndIf
			if oItem then
				Say(oItem.Name,ot_dialog_text)
				SayObjectActiveItem()
				return
			EndIf
		EndIf
	EndIf
EndIf
if nLevel == 0
&& GetObjectSubtypeCode() == wt_multiline_edit
&& GetObjectSubtypeCode(SOURCE_CACHED_DATA,2) == wt_dialog
	;When the properties page is brought up for a shortcut,
	;sometimes the timing causes the OK button to appear as the prompt to the field.
	;Force a refresh and wait for it to synchronize before getting the field name:
	MSAARefresh(true)
endIf
if c_WindowsOSFocus.IsPropertiesDialog
if !StringIsBlank (c_WindowsOSFocus.GroupName)
Say (c_WindowsOSFocus.GroupName, OT_CONTROL_GROUP_NAME)
endIf
if !StringIsBlank (c_WindowsOSFocus.ControlDescription)
Say (c_WindowsOSFocus.ControlDescription, OT_CONTROL_DESCRIPTION)
IndicateControlType (WT_BUTTON, GetObjectName ())
return	
endIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

string function GetFocusedApplicationVersionInfo ()
return GetOSVersionInfo()
endFunction

int function BrailleAddObjectDlgText(int nSubtypeCode)
if c_WindowsOSFocus.IsPropertiesDialog
	;This text is often wrong in properties dialogs
	;Remove it and allow BrailleAddObjectDescription to add text when necessary
	Return true
endIf
return BrailleAddObjectDlgText(nSubtypeCode)
endFunction

int function BrailleAddObjectDescription(int nSubtypeCode)
if c_WindowsOSFocus.IsPropertiesDialog
&& !StringIsBlank (c_WindowsOSFocus.ControlDescription)
	BrailleAddString (c_WindowsOSFocus.ControlDescription,0,0,0)
	return true
endIf
return BrailleAddObjectDescription(nSubtypeCode)
EndFunction

Void function DialogPageChangedEvent(HANDLE hwndNewPage,HANDLE hwndOldPage)
var int iType = GetObjectSubTypeCode()
UpdateWindowsOSFocus (iType)
if !c_WindowsOSFocus.IsPropertiesDialog
|| StringIsBlank (c_WindowsOSFocus.ControlDescription)
	DialogPageChangedEvent(hwndNewPage,hwndOldPage)
	return
endIf
if iType == wt_tabcontrol then
   return
EndIf
;Do not call SayWindowTypeAndText here, as it will duplicate what will be spoken by SayObjectTypeAndText
IndicateControlType (WT_DIALOG_PAGE, GetDialogPageName ())
If BrailleInUse () then
	RefreshBraille ()
endIf
EndFunction

Int Function OnDesktop()
if GetObjectClassName (2) == UIAClass_ShellDLL_DefView
|| GetObjectClassName (3) == UIAClass_ShellDLL_DefView
	return true
endIf
return false
EndFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
	if OnDesktop()
	return true
endIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

void function PictureSmartWithSelectedFileDesktop (int serviceOptions, int allInOne)
var
	int result = OCRResult_Success,
	string question = cscNULL
if !IsPictureSmartEnabled() then
	Return
endif

if(serviceOptions & PSServiceOptions_AskPrelim) then 
	if !PictureSmartPromptPreliminaryQuestion(question) then
		return
	EndIf
EndIf

result = IsTelemetryEnabled(TRUE);
If result == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif result != PSResult_Success then
	; no message needed since the function prompts
	return
EndIf

result = DescribeDesktopFile (allInOne, serviceOptions, question)
If result == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)	
ElIf result == PSResult_NoFileSelected then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_nofileselected)
ElIf result == PSResult_MultipleFilesSelected then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_multiplefileselected)
elif result != PSResult_Success then
	SayFormattedMessage (OT_ERROR,  msg_picturesmart_failedtostart)
endIf
endFunction

Script PictureSmartWithSelectedFile (optional int serviceOptions)
if OnDesktop()
	PictureSmartWithSelectedFileDesktop (PSServiceOptions_Single | serviceOptions, 0)
	return
endIf
PerformScript PictureSmartWithSelectedFile(serviceOptions)
endScript

Script PictureSmartWithSelectedFileMultiService (optional int serviceOptions)
if OnDesktop()
	PictureSmartWithSelectedFileDesktop (PSServiceOptions_Multi | serviceOptions, 0)
	return
endIf
PerformScript PictureSmartWithSelectedFileMultiService(serviceOptions)
endScript

script PictureSmartAllInOne (optional int serviceOptions)
if OnDesktop()
	PictureSmartWithSelectedFileDesktop (PSServiceOptions_Single | serviceOptions, 1)
	return
endIf
PerformScript PictureSmartWithControl(serviceOptions)
endScript

script PictureSmartAllInOneMultiService (optional int serviceOptions)
if OnDesktop()
	PictureSmartWithSelectedFileDesktop (PSServiceOptions_Multi | serviceOptions, 1)
	return
endIf
PerformScript PictureSmartWithControlMultiService(serviceOptions)
endScript
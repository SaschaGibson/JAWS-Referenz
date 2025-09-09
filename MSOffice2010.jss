; Copyright 1995-2015 Freedom Scientific, Inc.
;JAWS script file for Office 2010 only

include "hjglobal.jsh"
Include "hjconst.jsh" ; constants for attributes, window classes
include "MSOffice2010.jsh"
include "MSOffice2007.jsm"
include "common.jsm"
Include "TutorialHelp.jsm"
include "winstyles.jsh" ; Support type code inconsistency on some edits.
include "outlookCustomSettings2010.jsh"
include "outlook2010.jsh"
include "outlook2007.jsm"

GLOBALS
	;Private: table data to remember and restore row / column title reading info:
	int giDefaultTableInfo,
	;Private: Remember the Office 2003 Command Key window
	handle gHwnd2003Command

;/******** Legacy functions from msOffice, prevent unknown calls *********/
int function InTaskPaneDialog()
	return FALSE
endFunction

;/****** End legacy functions from msOffice **********/

void function AutoStartEvent ()
if !giDefaultTableInfo then
	Let giDefaultTableInfo = GITblHeaders;Save to be restored on app exit.
endIf
endFunction

void Function AutofinishEvent ()
Let GITblHeaders = giDefaultTableInfo
Let giDefaultTableInfo = 0;
endFunction

int Function IsCommonAlertDlg ()
;Purpose:	Determines common dialogs with row of buttons, non-SDM, dialog, caption and choice(s)
var
	handle hWnd,
	int iType,
	int bResult
Let bResult = DialogActive ()
If ! bResult then
	Return bResult
EndIf
Let bResult = InHjDialog ()
If bResult then
	Return bResult;Same T'ypeAndTextInfo to speak
EndIf
Let bResult = IsMultiPageDialog ()
If bResult then
	Return FALSE;
EndIf
Let hWnd = GetFocus ()
;Focusable controls in alert dialogs = button,checkbox,radio,InlineToolbarButton,similar.
;All fall under typecode of Button
Let iType = GetWindowtypeCode (hWnd)
If ! iType then
	Let iType = GetObjectTypeCode (TRUE)
EndIf
Let bResult = (iType == WT_BUTTON)
If ! bResult then
	Return bResult;
EndIf
;These dialogs do not have richedit in them.
If FindWindow (GetParent (hWnd), cwc_RichEdit20WPT) then
	Return FALSE
EndIf
;Property of alert = parent is dialog standard, sibling first and last = static in between = whatever:
Let bResult = (GetWindowClass (GetParent (hWnd)) == cWc_dlg32770
;First window can be static or button
&& (GetWindowSubtypeCode (GetFirstWindow (hWnd)) == WT_STATIC
|| GetWindowSubtypeCode (GetFirstWindow (hWnd)) == WT_BUTTON)
;Last window in said dialogs is generally static.
&& GetWindowSubtypeCode (GetLastWindow (hWnd)) == WT_STATIC)
Return bResult
EndFunction

Int Function isSDMDlg ()
var
	int bSDM
;Legacy: does nothing except prevents unknown function calls
let bSDM = FALSE
let bSDM=
 StringContains(GetWindowClass(GetParent(getFocus())),wc_bosa_sdmGeneral )
return bSDM
EndFunction

;In case code exists that asks for these in the scope chain.
;Also placeholder if common Office code exists that requires help on the tab / shift tab keys
function TabKey ()
TabKey ()
endFunction

function ShiftTabKey ()
ShiftTabKey ()
endFunction

Void Function WindowCreatedEvent (handle hWindow, int nLeft, int nTop, int nRight, int nBottom)
; Because we must detect if text is obscured by the object,
; we have no alternative but to test for window class
; in order to set the variable when text may be obscured.
var
	object obj,
	string sName,
	int varChild
if GetWindowClass(hWindow)==wc_OOCWindow then
	let globalObscuredText = true
	let hGlobalOoc = hWindow  ;used later in WindowDestroyedEvent
	let obj=GetObjectFromEvent(hWindow, 0, 0, varChild)
	let sName = obj.accName(varChild)
	if StringContains(sName,on_AutoActions) then
		if GlobalDetectAutoCorrect then
			say(sName, ot_control_name)
		EndIf
	ElIf StringContains(sName,on_SmartTagActions) then
		if GlobalDetectSmartTags then
			say(sName, ot_control_name)
		EndIf
	EndIf
	let obj=oNull
elIf GetWindowClass(hWindow) == wc_NetUIHWND then
	let obj=GetObjectFromEvent(hWindow, 0, 0, varChild)
	let sName = obj.accName(varChild)
	if StringContains (sName,sc2010Office2003) then
		Let gHwnd2003Command = hWindow
		SayMessage (OT_CONTROL_NAME, msgOffice2003Command)
		Delay (3);Allow time for window to change, so Braille Message will stick:
		BrailleMessage (msgOffice2003Command, 0, 60000)
	endIf
else
	Let gHwnd2003Command = ghNull
EndIf
WindowCreatedEvent(hWindow,nLeft,nTop,nRight,nBottom)
EndFunction

void Function WindowDestroyedEvent (handle hWindow)
If hWindow==ghMessageBodyWindow Then
	let ghMessageBodyWindow=ghNull
	let gbMessageHasBeenRead=FALSE
EndIf
;if hWindow == gHwnd2003Command then
;This doesn't appear to ever run, simply because although WindowCreatedEvent is called when this comes up, the DestroyedEvent is never called.
;The window continues to exist, although it probably briefly disappears and redraws again.
	;Let gHwnd2003Command = ghNull
;endIf
if hWindow == hGlobalOoc then
	let GlobalObscuredText = false
	let hGlobalOoc = hNull
EndIf
WindowDestroyedEvent(hWindow)
EndFunction

Void Function SayHighlightedText (handle hwnd, string buffer)
; Highlighted item will be spoken multiple times and out of order when TaskPane is switched to
; unless echo is supressed with nSupressTaskPaneEcho.
; nSupressTaskPaneEcho is set to true in FocusChangedEvent
; and will be set to false in function AnnounceSwitchToTaskPane.
var
	int iWinType,
	int iObjTypeCode,
	string sClass
if GlobalMenuMode
&& !IsVirtualRibbonActive() then
	return
EndIf
Let iWinType = GetWindowSubTypeCode (hWnd)
if nSuppressEcho then
	let nSuppressEcho = false
	return
EndIf
SayHighlightedText(hwnd,buffer)
EndFunction

string function ToggleAutoCorrectDetection(int iRetCurVal)
If ! iRetCurVal then
	;update the value
	let globalDetectAutoCorrect = !globalDetectAutoCorrect
EndIf
if globalDetectAutoCorrect then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string function ToggleSmartTagsDetection(int iRetCurVal)
if ! iRetCurVal then
	;update the value
	let globalDetectSmartTags = !globalDetectSmartTags
EndIf
if globalDetectSmartTags then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

void function DetectSmartTag(object oObj)
var
	int iCount
; detect words marked with smart tag
let iCount = oObj.SmartTags.count
if iCount == 0 then
	let globalSmartTagFlag=false
elif iCount > 0 then
	if !GlobalSmartTagFlag then
		SayFormattedMessageWithVoice(vctx_message, ot_help,msgSmartTag1_L,msgSmartTag1_S)
		let GlobalSmartTagFlag = true
	EndIf
else
	if GlobalSmartTagFlag then
		let GlobalSmartTagFlag = false
	EndIf
EndIf
EndFunction

int function SmartTagsCount(object oAppObj)
return oAppObj.SmartTags.count
EndFunction

int function StrCmp(string sFirst, string sSecond)
if (sFirst+scStar == sSecond+scStar) then
	return 1
else
	return 0
endif
EndFunction

int function FilterSmartTag(string sName)
var
	int i
let i = 1
While i<=iSmartTagFilterCount
&& !strcmp(sName,StringSegment(scSmartTagFilterList,scFilterItemSeparator,i))
	let i = I+1
EndWhile
if i<=iSmartTagFilterCount then
	return true
else
	return false
EndIf
EndFunction

void Function ShowSmartTagListDialog(object oApp)
var
	object doc, ; The current document
	int iTag, ; The actual index of the smart tags in the document
	int count, ; The actual count of smart tags in the document
	object oSmartTag, ; the current smart tag to be included in the list
	int iShow, ; The number of smart tags to show in the dialog list
	string sName, ; Smart tag type
	string sText, ; Smart tag text
	string sEntry, ; item in the smart tag dialog list
	string sSmartTagList ;delimmited list of smart tags
let Doc=oApp.activeDocument
let count=Doc.SmartTags.Count
if !count then
	SayFormattedMessageWithVoice(vctx_message,ot_JAWS_message,msgNoSmartTags_L,msgNoSmartTags_S)
	return
EndIf
let iShow=0
let iTag=1
let oSmartTag=doc.smartTags(itag)
while iTag<=count
	let sName=oSmartTag.Name
	let sName=StringSegment(sName,sSmartTagNameDelimmiter,2)
	; If we filter out type of tag, we lose the number of the current smart tag.
	;if !FilterSmartTag(sName) then
		; Put the tag in the dialog list:
		let iShow=iShow+1
		let sText=oSmartTag.Range.Text
		let sEntry=IntToString(iTag)+cScSpace+sName+cScColon+cScSpace+sText
		let sSmartTagList=sSmartTagList+LIST_ITEM_SEPARATOR+sEntry
	;EndIf
	let iTag=iTag+1
	let oSmartTag=doc.smartTags(itag)
endWhile
if !iShow then
	SayMessage(ot_error,msgNoClickableSmartTags_L,msgNoClickableSmartTags_S)
	return
EndIf
let InSmartTagListDlg = true
let iTag=DlgSelectItemInList(sSmartTagList,sSmartTagListTitle,false)
let InSmartTagListDlg = false
if iTag then
	doc.smarttags(iTag).select
	oApp.selection.collapse()
	let GlobalSmartTagFlag = true
	if GlobalSmartTagActionsTutorHelp then
		; Only announce this message the first time
		let GlobalSmartTagActionsTutorHelp = false
		if getRunningFSProducts () & product_JAWS then
			SayFormattedMessage(ot_smart_help, msgSmartTagActionsTutorHelp1_L, msgSmartTagActionsTutorHelp1_S)
		endIf
	EndIf
EndIf
EndFunction

void function SayTreeViewItem()
var
	int iMsaaMode
let iMsaaMode=GetJcfOption(opt_msaa_mode)
SetJcfOption(opt_msaa_mode,0)
SayMessage(ot_line,GetObjectValue())
SetJcfOption(opt_msaa_mode,iMsaaMode)
EndFunction

void Function SayTreeViewLevel (optional int IntelligentPositionAnnouncement)
var
	int iMsaaMode,
	string sMessage,
	int iLevel,
	int bLevelChanged,
	string sLevel
if getWindowName (getRealWindow (getFocus ())) == cWnQuickSettings then
	Return QuickSettings::SayTreeViewLevel (IntelligentPositionAnnouncement)
endIf
if InHJDialog() then
	SayTreeViewLevel (IntelligentPositionAnnouncement)
	return
EndIf
If GetTreeViewLevel() != GlobalPrevTreeviewLevel then
	let bLevelChanged = true
	let iLevel = GetTreeviewLevel()
	let sLevel = IntToString (iLevel)
	let sMessage = FormatString (cmsg233_L, sLevel)
	SayFormattedMessage (OT_position, sMessage, sLevel)
	let GlobalPrevTreeViewLevel= iLevel
endIf
If !IsPcCursor () then
	SayLine ()
	Return
EndIf
SayTreeViewItem()
if IntelligentPositionAnnouncement
&& !bLevelChanged then
	;we don't want to announce the position.
	return
EndIf
SayMessage (OT_POSITION, PositionInGroup ())
EndFunction

int function ScreenSensitiveHelpForOffice()
if InSmartTagListDlg then
	SayMessage(ot_user_buffer,msgSmartTagListHelp_L,msgSmartTagListHelp_S)
	return true
ElIf GlobalTemporaryContextMenuState then
	TemporaryContextMenuHelp()
	return true
else
	return false
EndIf
EndFunction

Int Function SayTutorialHelpHotKey (handle hHotKeyWindow, int IsScriptKey)
var
	int iWinType,
	int iObjType,
	int iSpeak,
	string sHotKey,
	string sPrompt,
	string sMessage,
	int iPunctLevel
If GlobalMenuMode
	if IsVirtualRibbonActive() then
		;Do nothing, hotkeys are irrelevant in virtual ribbons:
		return false
	EndIf
EndIf
let iPunctLevel=GetJcfOption(opt_punctuation)
SetJcfOption(opt_punctuation,0)
If IsScriptKey then
	Let iSpeak = OT_line
Else
	Let iSpeak = OT_access_key
EndIf

Let iWinType = GetWindowSubTypeCode (hHotKeyWindow)
if !iWinType then
	let iObjType=GetObjectSubtypeCode(true)
EndIf
if iWinType==wt_button
|| (!iWinType
&& (iObjType==wt_button
|| iObjType==wt_splitButton)) then
	let sHotkey=GetHotKey(GetFocus())
	if sHotKey!=cscNull  then
		ExpandAltCommaInHotKey(sHotKey)
		SayUsingVoice(vctx_message,sHotKey,iSpeak)
		SetJcfOption(opt_punctuation,iPunctLevel)
		return true
	EndIf
EndIf
delay(1,true)
if inribbons(GetFocus()) then
	let sHotkey=GetHotKey()
	if sHotKey==cscNull then
		let sHotKey=FindHotKey(sPrompt)
	endIf
	if sHotKey!=cscNull  then
		ExpandAltCommaInHotKey(sHotKey)
		SayUsingVoice(vctx_message,sHotKey,iSpeak)
		SetJcfOption(opt_punctuation,iPunctLevel)
		return true
	EndIf
EndIf
;Prevent extra chatter from menus and backstage view for access keys.
if iObjType==wt_menubar
|| iObjType==wt_tabControl then
	let sHotkey=GetHotkey()
	if StringContains(sHotKey,sc_AltComma) then
		let sHotKey=stringSegment(sHotkey,cscSpace,-1)
	EndIf
	SayUsingVoice(vctx_message,sHotKey,iSpeak)
	return true
endIf
if iObjType==wt_menu
|| iObjtype==wt_splitButton
|| GetObjectSubtypecode(true)==wt_editCombo then
	let sHotkey=GetHotKey()
	if sHotKey==cscNull then
		let sHotKey=FindHotKey(sPrompt)
	endIf
	if sHotKey!=cscNull  then
		ExpandAltCommaInHotKey(sHotKey)
		SayUsingVoice(vctx_message,sHotKey,iSpeak)
		SetJcfOption(opt_punctuation,iPunctLevel)
		return true
	else
		SayTutorialHelpHotKey (hHotKeyWindow, IsScriptKey)
		SetJcfOption(opt_punctuation,iPunctLevel)
		return true
	endIf
endIf
if isBackStageView(hHotKeyWindow) then
	let sHotkey=GetHotKey()
	if StringContains(sHotKey,sc_AltComma) then
		let sHotKey=stringSegment(sHotkey,scComma,-1)
		SayUsingVoice(vctx_message,sHotKey,iSpeak)
		SetJcfOption(opt_punctuation,iPunctLevel)
		return true
	endIf
endIf
SayTutorialHelpHotKey (hHotKeyWindow,IsScriptKey)
SetJcfOption(opt_punctuation,iPunctLevel)
EndFunction

Int Function SaySDMStaticHelp(String windowName)
if (StringContains(WindowName,wn_About)
&& !StringContains(GetWindowName(GlobalPrevFocus),wn_About))
|| WindowName==wn_Help  then
	SayFormattedMessage(ot_user_requested_information,GetWindowTextEx(GetFocus(),false,true))
	return true
EndIf
Return false
EndFunction

String  Function GetObjectNameOrValue()
Var
	String sName
let sName=getObjectValue(true)
If ! sName then
	let sName=GetObjectName(true)
	If !sName then
		let sName=GetWord()
	EndIf
EndIf
return sName
EndFunction

void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
Var
	int iSubtype,
	int iObjtype,
	string sObjName,
	int iState,
	int iPunctLevel
if InHJDialog() then
	ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
	return
EndIf
let iSubType = GetWindowSubtypeCode(CurHwnd)
if !iSubtype then
	let iSubtype=GetObjectSubtypeCode(true)
EndIf
let iObjType=GetObjectSubtypeCode(true)
let sObjName=GetObjectName(true)
If iSubtype==wt_listbox then
	if StringContains(GetWindowName(GetRealWindow(curHwnd)),wn_autoCorrect) then
		let iPunctLevel=GetJCFOption(opt_punctuation)
		SetJCFOption(opt_punctuation,3)
		SayFromCursor()
		SetJcfOption(opt_punctuation,iPunctLevel)
		let globalSuppressHighlightedText=true
		return
	EndIf
EndIf
if getWindowName (getRealWindow (getFocus ())) != cwnQuickSettings then
default::ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
else
	ActiveItemChangedEvent (curHwnd,curObjectId,curChildId,prevHwnd,prevObjectId,prevChildId)
endIf
EndFunction

int function InRibbons(handle hWnd)
var
	handle hTemp
if GetMenuMode()>0 then
	return false
endIf
if GetWindowClass(hWnd) != wc_NetUIHwnd then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if GetWindowName(hTemp) == wn_Ribbon then
		return true
	EndIf
EndIf
return false
EndFunction

int function IsStatusBarToolBar(handle hWnd)
var
	handle hTemp
if GetMenuMode()>0 then
	return false
endIf

if GetWindowClass(hWnd) != wc_NetUIHwnd then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if stringCompare(GetWindowName(hTemp),wn_StatusBar)==0 then
		return true
	EndIf
EndIf
return false
EndFunction

int function InOptionsDialog(handle hWnd)
var
	handle hTemp
if GetMenuMode()>0 then
	return false
endIf

if GetWindowClass(hwnd) != wc_NetUIHwnd then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_NUIDialog
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if StringContains(GetWindowName(hTemp),wn_Options)
	|| StringContains(getWindowName(GetRealWindow(hTemp)),wn_options) then
		return true
	EndIf
EndIf
return false
EndFunction

Void Function SpeakOptionsDlgControl(handle hwnd,int nLevel)
Var
	handle hReal,
	string sReal,
	int iObjType,
	string sObjName
let hReal=GetRealWindow(hwnd)
let sReal=GetWindowName(hReal)
If hReal!=GetRealWindow(globalPrevFocus) then
	if globalPrevFocus!=0 then ; if the handle of previous window with focus is not 0:
		SayMessage(ot_dialog_name,sReal)
	endIf
endIf
let iObjType=GetObjectSubtypeCode(true)
If iObjType==wt_treeviewItem
&& nLevel==1 then
	indicateControlType(iObjType,GetObjectName(),cscSpace)
	return
endIf
;for when listbox is always announced as items are being navigated in a listbox control:
If nLevel==-1 then
	if iObjType==wt_listboxItem then
		SayObjectActiveItem	(true)
	else
		default::SayFocusedWindow()
	endIf
elIf iObjType==wt_listboxItem then
	if InOptionsDialog(hwnd) then
		let sObjName=GetObjectName(true,1)
		if  sObjName==sc_OptionsDlgCategories then
			sayMessage(ot_control_name,sObjName)
		endIf
		If iObjtype==wt_listboxItem  then
			indicateControlType(GetObjectSubtypeCode(true,1))
		endIf
	endIf
	SayObjectTypeAndText()
else
	SayObjectTypeAndText()
EndIf
EndFunction

Int Function IsResearchToolbar(handle hwnd)
var
	handle hTemp

if GetMenuMode()>0 then
	return false
endIf

If !(StringContains(GetWindowClass(Hwnd),wc_NetUiHwnd)
|| StringContains(GetWindowClass(GetParent(GetParent(hwnd))),wc_netUiHwnd)) then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if GetWindowName(hTemp) == wn_Research then
		return true
	EndIf
EndIf
return false
EndFunction

Int Function IsClipboardDialog(handle hwnd)
var
	handle hTemp

if GetMenuMode()>0 then
	return false
endIf

if !StringContains(GetWindowClass(hWnd),wc_sdm) then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOCommandbar
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if stringCompare(GetWindowName(hTemp),wn_OfficeClipboard)==0 then
		return true
	EndIf
EndIf
return false
EndFunction

void function SpeakRibbonItem(optional int nLevel)
var
	int nProductsList = getRunningFSProducts (),
	int iLevelType,
	string sObjName,
	string sObjValue,
	int iPunctLevel,
	string sHotKey

If isWindowVisible (gHwnd2003Command) then
	SayMessage (OT_CONTROL_NAME, msgOffice2003Command)
	BrailleMessage (msgOffice2003Command, 0, 60000)
	Return
endIf
if nLevel == -1 then
	sayobjectTypeAndText()
	if ShouldItemSpeak (ot_tutor) == TUTOR_ALL && nProductsList & product_JAWS then
		sayTutorialHelp(getobjectsubtypecode(true),false)
	endIf
	If ShouldItemSpeak (ot_access_key) == TUTOR_ALL && nProductsList & product_JAWS then
		let iPunctLevel=GetJcfOption(opt_punctuation)
		SetJcfOption(Opt_punctuation,0)
		let sHotKey=GetHotkey()
		ExpandAltCommaInHotKey(sHotKey)
		SayUsingVoice(vctx_message,sHotkey,ot_access_key)
		SetJcfOption(Opt_punctuation,iPunctLevel)
	EndIf
	return
EndIf
while (nLevel>=0)
	let iLevelType = GetObjectSubTypeCode(1,nLevel)
	;fix problem that occurs when tabbing onto ribbon tab control, where it was not speaking at all:
	if iLeveltype==wt_tabControl then
		indicateControlType(iLevelType,getObjectName(true),PositionInGroup())
		return
	endIf
	if iLeveltype==wt_groupbox  then
		indicateControlType(wt_groupbox,GetObjectName(true,nLevel))
	elif iLevelType==wt_splitButton then
		let sObjName=GetObjectName()
		IndicateControlType(wt_splitButton,sObjName,cscSpace)
		let sObjValue=GetObjectValue(true)
		;Check for extraneous RGB information.
		if stringContains(sObjValue,scrgb) then
			let sObjValue=GetControlColorValue(sObjValue)
			Say(sObjValue,ot_line,true)
		else
			If sObjValue!=cscNull
			&& sObjValue!=sObjName then
				Say(sObjValue,ot_line,true)
			EndIf
		EndIf
		sayMessage(ot_item_state,GetObjectState(true))
	Elif iLevelType == wt_dialog_page
	|| iLevelType == wt_ToolBar
	|| nLevel == 0  then
		if iLevelType==wt_toolbar
		&& getObjectSubtypeCode()!=wt_tabControl
		&& nLevel<2 then
			indicateControlType(wt_groupbox,GetObjectName(true,nLevel))
			; test for cases where must also announce the control at level 1.
			if nLevel==1 then
				SayFocusedObject()
				return
			endIf
		EndIf
		; some submenu grid controls are level 0, others cycle between 1 and 0.
		; the following prevents double-speaking of submenu grid controls when they gain focus.
		if iLevelType==wt_toolbar
		&& GetObjectSubtypeCode()==wt_buttonDropDownGrid
		&& nLevel>=0 then
			SayObjectTypeAndText(nLevel)
			let nLevel=nLevel-1
		else
			; some controls are level 0, others cycle between 1 and 0.
			; the following prevents double-speaking of controls when they gain focus.
			if nLevel==1
			|| nLevel==0 then
				default::SayObjectTypeAndText(nLevel)
				return
			endIf
			;handle case where treeview level is announced in error:
			if iLevelType==wt_toolbar  then
				default::sayFocusedObject()
				return
			endIf
			sayObjectTypeAndText(nLevel)
		EndIf
	EndIf
	let nLevel= nLevel-1
EndWhile
EndFunction

void function SpeakStatusBarToolBarItem(optional int nLevel)
var
	int iLevelType,
	handle hwnd,
	string sObjName,
	int iState,
	string sValue

while (nLevel >= 0)
	let iLevelType = GetObjectSubTypeCode(1,nLevel)
	if iLevelType == wt_ToolBar
	|| nLevel == 0 then
		sayobjectTypeAndText(nLevel)
	EndIf
	let nLevel= nLevel-1
EndWhile
; the following test is necessary for when tutor mode is off in Microsoft Word 2010.
if ShouldItemSpeak(ot_tutor)!=tutor_all && getRunningFSProducts () & product_JAWS then
	let hwnd=GetFocus()
	let sObjName=GetObjectName()
	if StringContains(stringLower(GetAppFileName()),sc_Word2010) then
		if sObjName==wn_PageNumber then
			GetObjectInfoByName (hWnd,sObjName,1,iLevelType,iState,sValue)
			SayMessage(ot_screen_message,sValue)
		elif sObjName==WN_WordCount then
			GetObjectInfoByName (hWnd,sObjName,1,iLevelType,iState,sValue)
			SayMessage(ot_screen_message,sValue)
		endIf
	endIf
	;Office 2010 in general:
	if sObjName==wn_zoom then
		GetObjectInfoByName (hWnd,sObjName,1,iLevelType,iState,sValue)
		SayMessage(ot_screen_message,sValue)
	endIf
EndIf
EndFunction

Void Function SpeakResearchToolbarControl(int nLevel)
var
	int iLevelType,
string sObjName

while (nLevel >= 0)
	let iLevelType = GetObjectSubTypeCode(true,nLevel)
	let sObjName=GetObjectName(true,nLevel)
	if iLevelType == wt_ToolBar
	|| nLevel == 0 then
		If StringContains(sObjName,sc_Button) then
			let sObjName=stringReplaceSubstrings(sObjName,sc_button,cscNull)
			IndicateControlType(iLevelType,sObjName)
			let nLevel=-1
		else
			sayObjectTypeAndText(nLevel)
		EndIf
	EndIf
	let nLevel= nLevel-1
EndWhile
EndFunction

Void Function SpeakNetUIHwndWindowControl(int nObjType,Int nLevel)
var
	int nProductsList = getRunningFSProducts (),
	string sObjName,
	string sColorName,
	int iPunctLevel,
	string sHotKey,
	handle hwnd,
	handle hReal,
	handle hPrevReal,
	int iAttrib,
	string sRealName

MSAARefresh()
if nObjType==wt_groupbox then
	let nObjType=GetObjectSubtypeCode(true)
endIf
let sObjName=GetObjectName()
; Some split buttons have extraneous RGB information that must be stripped.
let sColorName=stringSegment(sObjName,scRGB,-1)
if sColorName then
	let sObjName=stringReplaceSubStrings(sObjName,scRGB+sColorName,cscNull)
EndIf
if nObjType==wt_DIALOG_PAGE
&& GetObjectSubtypeCode(true)==wt_listboxItem then
	IndicateControlType(wt_listbox,sObjName)
	if StringContains(sObjName,StringSegment(GetObjectDescription(),cscSpace,1)) then
		return
	endIf
EndIf
let hwnd=GetFocus()
let hReal=GetRealWindow(hwnd)
let hPrevReal=GetRealWindow(globalPrevFocus)
let sRealName=getWindowName(hReal)
;check for NUIDialog where the dialog's real name contains "New":
if (nLevel==-1
|| nLevel==4)
&& (stringContains(sRealName,wn_NewDocumentDlg)
|| stringContains(sRealName,wn_NewDlg)) then ; dialog has just gained focus.
	if hPrevReal!=hReal then ; only when dialog gains focus.
		SayWindowTypeAndText(GetParent(hwnd))
		indicateControlType(wt_listbox,sObjName)
		return
	EndIf
endIf

let iAttrib=GetControlAttributes(true) ; for listboxItem controls that include checkbox controls
if nObjType == wt_ListBoxItem then
	if (nLevel == 1)
		sayObjectTypeAndText (1);control group name from within list box
	endIf
	if stringContains(sRealName,wn_NewDocumentDlg)
	|| stringContains(sRealName,wn_NewDlg) then
		if nLevel==2 then ;list just gained focus
			sayObjectTypeAndText(1) ;to capture groupname
			indicateControlType(nObjType,sObjName)
		else
			sayLine() ; sObjName not reliable here.
		endIf
		return
	endIf
	if nLevel==-1
	|| nLevel==2 then ; in list
		; for Microsoft Excel 2010 Data Sort dialog:
		if StringContains(stringLower(GetAppFileName()),sc_excel2010)
		&& sRealName==wn_Excel2010Sort then
			indicateControlType(nObjType,sObjName)
			sayHighlightedText(hwnd,getWindowText(hwnd,true))
		else
			sayMessage(ot_highlighted_screen_text,GetObjectName(true))
		EndIf
		sayLBItemObjectState(iAttrib)
		return
	ElIf nLevel then ; control just gained focus
		sayObjectTypeAndText(nLevel)
		sayLBItemObjectState(iAttrib)
		If ShouldItemSpeak (ot_access_key) == TUTOR_ALL && nProductsList & product_JAWS then
			let iPunctLevel=GetJcfOption(opt_punctuation)
			SetJcfOption(opt_punctuation,0)
			let sHotkey=getHotkey()
			ExpandAltCommaInHotKey(sHotKey)
			SayUsingVoice(vctx_message,sHotKey,ot_access_key)
			SetJcfOption(opt_punctuation,iPunctLevel)
		EndIf
		return
	EndIf
else
	if nObjType==wt_buttonDropdown then
		indicateControlType(nObjType,sObjName,msgSubmenu)
		If ShouldItemSpeak (ot_access_key) == TUTOR_ALL && nProductsList & product_JAWS then
			let iPunctLevel=GetJcfOption(opt_punctuation)
			SetJcfOption(opt_punctuation,0)
			let sHotkey=GetHotkey()
			ExpandAltCommaInHotKey(sHotKey)
			SayUsingVoice(vctx_message,sHotKey,ot_access_key)
			SetJcfOption(opt_punctuation,iPunctLevel)
		EndIf
		return
	elif nObjType==wt_buttonDropdownGrid then
		indicateControlType(nObjType,sObjName,msgSubmenuGrid)
		If ShouldItemSpeak (ot_access_key) == TUTOR_ALL && nProductsList & product_JAWS then
			let iPunctLevel=GetJcfOption(opt_punctuation)
			SetJcfOption(opt_punctuation,0)
			let sHotkey=GetHotkey()
			ExpandAltCommaInHotKey(sHotKey)
			SayUsingVoice(vctx_message,sHotKey,ot_access_key)
			SetJcfOption(opt_punctuation,iPunctLevel)
		EndIf
		return
	EndIf
	;for Office 2010, the question for Save/Don't Save which used to be a #32770  dialog is no longer that class.
	if hReal!=hPrevReal then
		if StringCompare(sObjName,wn_Office2010SaveQuestionDlg)==0
		&& nObjType==wt_button
			sayMessage(ot_screen_message,MSAAGetDialogStaticText())
		endIf
	endIf
	SayObjectTypeAndText()
EndIf
if !nObjType then
	let nObjType=GetObjectSubtypeCode(true)
endIf
; for cases where nObjType is dialog:
if GetObjectSubtypeCode(true)==wt_listboxItem then
	sayLBItemObjectState(iAttrib)
endIf
;test for announcing descriptions on page break items off the ribbon not caught by DescriptionChangedEvent.
if stringContains((getWindowTextEx(hwnd,false,true)),sc_PageBreaks) then
	sayMessage(ot_screen_message,getObjectDescription(true))
endIf
EndFunction

Void Function SpeakClipboardDialogControl(Int nLevel)
var
	handle hFocus = getFocus (),
	int bSpeakAsWindow,
	int iFocusType,
	int iLevelType
;Ensure that the window is read as window when focus comes to the list box
; and that when list items change they are read properly.
let bSpeakAsWindow = (nLevel > 0)
let iFocusType = getWindowSubtypeCode (hFocus)
if (! iFocusType)
	iFocusType = getObjectSubtypeCode (TRUE)
endIf
;first get any group info:
while (nLevel >= 0)
	let nLevel= nLevel-1
	let iLevelType = GetObjectSubTypeCode(1,nLevel)
	if (iLevelType == wt_ToolBar)
	;|| nLevel == 0 then ; causes double speaking on focus change, since now we ghandle focus separately.
		sayobjectTypeAndText(nLevel)
	EndIf
EndWhile
if (iFocusType == wt_listbox || iFocusType == WT_LISTBOXITEM || iFocusType == WT_BUTTON)
	if (iFocusType == WT_BUTTON)
		sayObjectActiveItem ()
	elIf (bSpeakAsWindow)
		indicateControlType (WT_LISTBOX, cscBufferNewLine, getObjectName (TRUE))
	else
		sayObjectActiveItem ()
	endIf
EndIf
EndFunction

int Function InApplyStylesDialog(handle hwnd)
var
	handle hTemp

if GetMenuMode()>0 then
	return false
endIf

if !StringContains(GetWindowClass(hWnd),wc_sdm) then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if stringCompare(GetWindowName(hTemp),wn_ApplyStyles)==0 then
		return true
	EndIf
EndIf
return false
EndFunction

Void Function SpeakApplyStylesDialogControl(int nLevel)
var
	int iLevelType

while (nLevel >= 0)
	let iLevelType = GetObjectSubTypeCode(1,nLevel)
	if iLevelType == wt_ToolBar
	|| nLevel == 0 then
		sayObjectTypeAndText(nLevel)
	EndIf
	let nLevel= nLevel-1
EndWhile
if iLevelType==wt_listbox then
	SayLine()
EndIf
EndFunction

int  Function InStylesDialog(handle hwnd)
var
	handle hTemp

if GetMenuMode()>0 then
	return false
endIf

if !StringContains(GetWindowClass(hWnd),wc_sdm) then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_MSOWorkPane
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	if GetWindowName(hTemp) == wn_Styles then
		return true
	EndIf
EndIf
return false
EndFunction

Void Function SayObjectActiveItem(optional int AnnouncePosition)
var
	string sObjName,
	string sColorName

let sObjName=	GetObjectName(true)
if StringContains(sObjName,scRGB)==1 then
	let sColorName=GetControlColorValue(sObjName)
	Say(sColorName,ot_line,true)
	return
endIf
SayObjectActiveItem()
EndFunction

void function FocusChangedEventEx (handle hwndFocus,int nObject,int nChild,handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
var
	string sClass,
	int nState,
	int nType,
	string sObjName,
	int nCurMenuMode,
	string sRealName
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
let gbRibbonHadFocus=false
let gbApplyStylesDlgHadFocus=false
let gbStylesDlgHadFocus=false
let sClass = GetWindowClass(hwndFocus)
let nType = getObjectSubtypeCode (TRUE)
if ! InRibbons (hwndFocus) then
	Let gHwnd2003Command = ghNull
endIf
if InRibbons(hwndFocus)  then
	;First check for the Office 2003 Command Key sequence window.
	If gHwnd2003Command then
		;Don't say '%1 tab' as the user is entering an Office 2003 command key:
		;This window is never visible, in the IsWindowVisible (gHwnd2003Command) sense.
		Return
	endIf
	let GlobalFocusWindow = hwndFocus
	if StringContains(stringLower(GetAppFileName()),sc_excel2010)
	&& giEnterKey then
		let gbRibbonHadFocus=true
		;returning from ribbon, no need to repeat.
		microsoft_excel_2010::SayFocusedWindow()
		return
	EndIf
	SpeakRibbonItem(nChangeDepth)
	return
elIf (nType == WT_LISTBOXITEM && getWindowClass (hwndFocus) == wc_netUiHwnd
&& getWindowClass (getParent (hwndFocus)) == wc_NetUIToolWindow)
	;spawned from ribbon | split button = drop down list,
	;example = tables off of insert:
	say (getObjectName (TRUE), OT_CONTROL_NAME);causes parent object never to speak when shouldn't.
	;Also keeps erroneous position info from speaking x of 80.
	Return
;no status bar toolbar in Outlook 2010:
ElIf !gbOutlookIsActive
&& IsStatusBarToolBar(hwndFocus) then
	let GlobalFocusWindow = hwndFocus
	SpeakStatusBarToolBarItem(nChangeDepth)
	return
ElIf isClipboardDialog(hwndFocus) then
	let GlobalFocusWindow = hwndFocus
	SpeakClipboardDialogControl(nChangeDepth)
	return
ElIf IsResearchToolbar(hwndFocus) then
	let GlobalFocusWindow = hwndFocus
	SpeakResearchToolbarControl(nChangeDepth)
	return
ElIf inApplyStylesDialog(hwndFocus) then
	let GlobalFocusWindow = hwndFocus
	let gbApplyStylesDlgHadFocus=true
	SpeakApplyStylesDialogControl(nChangeDepth)
	return
elif inStylesDialog(hwndFocus) then
	let GlobalFocusWindow = hwndFocus
	let gbStylesDlgHadFocus=true
	SayObjectTypeAndText()
	return
elIf InOptionsDialog(hwndFocus) then
	let GlobalFocusWindow = hwndFocus
	let GlobalPrevFocus = hwndPrevFocus
	SpeakOptionsDlgControl(hwndFocus,nChangeDepth)
	return
elIf IsDocumentPropertiesPane(hwndFocus) then
	let GlobalFocusWindow = hwndFocus
	let giDocumentPropertiesPane=true
	let gbSwitchingConfiguration=true
	SwitchToConfiguration(sc_MSHTML)
	return
EndIf
if isSDMDlg()
&& sClass==wc_richEdit60w then
	sayFocusedObject()
	return
endIf

;for NUIDialogs:
if sClass == wc_NetUIHWND
&& getWindowClass (getParent (hwndFocus)) == wc_NUIDialog then
	let nType=GetObjectSubtypeCode()
	if nType == WT_BUTTON && nChangeDepth > 0 then
		return focusChangedEvent (hwndFocus, hwndPrevFocus)
	endIf
	return SpeakNetUIHwndWindowControl(ntype,nchangedepth)
endIf
let nCurMenuMode=GetMenuMode()
if nCurMenuMode!=menu_inactive then
	let GlobalFocusWindow = hwndPrevFocus
	let nType = GetObjectSubtypeCode (hwndFocus)
	if nType==wt_listboxItem then
		return ActiveItemChangedEvent (HwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild)
	endIf
EndIf
if nCurMenuMode>0 then
	if IsVirtualRibbonActive() then
		SayVirtualRibbonItem()
		return
	EndIf
	if sClass==cwc_sysTreeview32 then
		sayObjectTypeAndText()
		let nState=TVGetItemStateImageIndex(hwndFocus)
		if !nState
		|| nState==3 then ; not checked
			sayMessage(ot_item_state,cmsg_Notchecked)
		ElIf nState==1 then ; checked
			sayMessage(ot_item_state,cmsg_checked)
		ElIf nState==2 then ; partially checked
			sayMessage(ot_item_state,cmsg_PartiallyChecked)
		EndIf
		return
	ElIf !gbOutlookIsActive
	&& sClass == wc_NetUIhWnd then
		let nType=getObjectSubtypeCode()
		if nType == wt_ListBoxItem then
			if nChangeDepth == -1 then
				SayObjectActiveItem()
			EndIf
			return
		ElIf nType==wt_radioButton then
			if nChangeDepth==1 then
				IndicateControlType(wt_radioButton,GetObjectName())
			EndIf
			return
		EndIf
	EndIf
	if nType==wt_splitButton then
		SayObjectTypeAndText(1)
		return
	endIf
	sayObjectTypeAndText(nchangeDepth) ; prevent extra call to FocusChangedEventEx when menu is not actually selected yet
	return
EndIf
if isBackStageView(hwndFocus) then
	msoffice2010::SayObjecttypeAndText()
	return
endIf
let sClass = GetWindowClass(hwndFocus)
If !gbOutlookIsActive
&& (sClass == wc_NetUIhWnd
|| GetWindowClass(GetFocus())==wc_NetUIhWnd) then ;at times, sClass returns _sdm class.
	if GetRealWindow(hwndFocus)!=GetRealWindow(hwndPrevFocus) then
		; prevent whole menu from being announced when it first gains focus.
		if nType==wt_menu then
			SayObjectActiveItem()
			return
		EndIf
		Say(GetWindowName(GetRealWindow(hwndFocus)),ot_dialog_name)
	EndIf
	let nType=GetObjectSubtypeCode(true,nChangeDepth)
	;for new document dialog off the file menu when it first gains focus:
	If nType==wt_dialog then
		indicateControltype(wt_dialog)
		if GetObjectSubtypeCode(true)==wt_listboxItem then
			IndicateControlType(wt_listbox,getObjectName(true),cscSpace)
		endIf
	endIf
	; for cases where enhanced edit is on while the netUIHwnd class window has focus:
	if !getJcfOption(OPT_EDIT_USE_OSM) then
		setJcfOption(OPT_EDIT_USE_OSM,1) ; Turn it off.
	endIf
	SpeakNetUIHwndWindowControl(nType,nChangeDepth)
	return
EndIf
if sClass==wc_wwn then
	; There is no object name. So we must get the control name some other way.
	let sObjName=GetWindowName(hwndFocus)
	if !sObjName then
		let sObjName=GetObjectDescription(true)
	EndIf
	let gsBrlWindowName=sObjName
	indicateControlType(wt_edit,sObjName,GetWindowText(hwndFocus,false))
	return
EndIf
; for Toolbar controls in SDM dialogs:
If !gbOutlookIsActive
&& GetWindowSubtypeCode(hwndFocus)==wt_toolbar
&& GetObjectSubtypeCode(true)!=wt_buttonMenu then
	; a brief delay eliminates the "generic control container message that can occur when moving forward by tab into a toolbar control.
	Delay(1)
	SayObjectActiveItem()
	return
EndIf
;prevent extra chatter when returning from message body window to subject field in Outlook 2010:
if gbOutlookIsActive
&& GetWindowClass(hwndPrevFocus)==wc_WwG then
	return microsoft_outlook_2010::SayFocusedWindow()
EndIf
FocusChangedEventEx (hwndFocus,nObject,nChild,hwndPrevFocus,nPrevObject,nPrevChild,nChangeDepth)
EndFunction

Void Function DescriptionChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldDescription, string sNewDescription)
Var
	handle hPrevHwnd,
	string sClass
if hwnd != GetFocus() then
	return
EndIf
let nObjType=GetObjectSubtypeCode(true)
let sClass=GetWindowClass(hwnd)
let globalPrevFocus=hPrevHwnd
if sClass==wc_netUIHwnd
&& nObjType==wt_listboxItem
&& stringContains(GetObjectName(true),StringSegment(sNewDescription,cscSpace,1)) then
	return ;too much chatter because the description and the object name contain much of the same information
endIf
if InRibbons(hWnd)
|| IsStatusBarToolBar(hWnd)
|| InOptionsDialog(hwnd)
|| MenusActive()
; check for when listbox items from a NetUIHwnd class gain focus.
; the previous window handle stays the same
;while the current one changes as the list is navigated.
|| (sClass==wc_NetUIHwnd
&& (nObjType==wt_menu
;The following prevents drop-down lists from reading descriptions before the name.
;Excel | Insert | any (line, chart, ...)
;Keep description from speaking before the name is read out.
|| (nObjType == WT_ListBoxItem
&& StringContains (getObjectName (TRUE), sNewDescription)))
;menu mode claims to be inactive when the parent class of a NETUiHwnd class window is FULLPAGEUIHost
;and descriptions here are too distracting.
|| (GetWindowClass(GetParent(hwnd))==wc_ParentClass_FULLPAGEUIHost
&& GetMenuMode()==0)
&& globalPrevFocus==hPrevHwnd) then
	;Too distracting to have descriptions speak.
	return
EndIf
default::DescriptionChangedEvent(hwnd,objId,childId,nObjType,sOldDescription,sNewDescription)
EndFunction

script SayCurrentAccessKey()
var
	int iPunctuationLevel,
	string sHotkey,
	handle hwnd
let hwnd=GetCurrentWindow()
if InRibbons(hwnd)
|| inOptionsDialog(hwnd)then
	let iPunctuationLevel=GetJcfOption(OPT_PUNCTUATION) ; Saves current punctuation level...
	SetJcfOption(OPT_PUNCTUATION,0)
	let sHotkey=GetHotkey()
	ExpandAltCommaInHotKey(sHotKey)
	SayUsingVoice(VCTX_MESSAGE,sHotKey,OT_HELP)
	SetJcfOption(OPT_PUNCTUATION,iPunctuationLevel)
	return
EndIf
PerformScript SayCurrentAccessKey()
EndScript

int function OnRecentDocumentsPushPin()
var
	handle hWnd
if GetMenuMode() != menu_active then
	return false
EndIf
let hWnd = GetFocus()
if GetWindowClass(hWnd) != wc_netUIHwnd then
	return false
EndIf
if GetObjectSubtypeCode() == wt_button then
	if GetObjectSubtypeCode(1,1) == wt_menu then
		if GetObjectSubtypeCode(1,2) == wt_GroupBox
		&& GetObjectName(1,2) == on_RecentDocuments then
			return true
		EndIf
	EndIf
EndIf
return false
EndFunction

void function ObjStateChangedEvent(handle hObj,optional  int iObjType, int nChangedState, int nState, int nOldState)
if OnRecentDocumentsPushPin() then
	if nState then
		IndicateControlState(iObjType,nState)
	else
		IndicateControlState(iObjType,nState,msgStateNotPressed)
	EndIf
	return
EndIf
if iObjType == wt_ListBoxItem then
	if InOptionsDialog(hObj)
	|| MenusActive() then
		if !nState then
			;navigation in the Options list is so sluggish
			;that we get state change to not selected
			;before the active item changes.
			;we do not want to hear the "not selected".
			return
		EndIf
	EndIf
EndIf
if (iObjType == WT_LISTBOXITEM && getWindowClass (hObj) == wc_netUiHwnd
&& getWindowClass (getParent (hObj)) == wc_NetUIToolWindow)
	;spawned from ribbon | split button = drop down list,
	;example = tables off of insert:
	Return
endIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

Int function BrailleAddObjectState(int nType)
Var
	handle hwnd,
	int nState
if IsTouchCursor() then
	return BrailleAddObjectState(	nType)
endIf
Let hwnd=GetFocus()
if nType==wt_treeviewItem
&& globalMenuMode>0
&& GetWindowClass(hwnd)==cwc_sysTreeview32 then ; we are on treview item with checked statet on a menu
	SuppressG2TranslationForNextStructuredModeSegment()
	let nState=TVGetItemStateImageIndex(hwnd)
	if !nState then ; checked
		BrailleAddString(cmsgBrailleChecked1_l,0,0,0)
	ElIf nState==3 then ; unchecked
		BrailleAddString(cmsgBrailleUnchecked1_l,0,0,0)
	EndIf
	return true
elIf nType==wt_listboxItem then
	SuppressG2TranslationForNextStructuredModeSegment()
	let nState=GetControlAttributes(true)
	if nState==1 then ; checked
		BrailleAddString(cmsgBrailleChecked1_l,0,0,0)
	ElIf nState==2 then ; unchecked
		BrailleAddString(cmsgBrailleUnchecked1_l,0,0,0)
	EndIf
	return true
EndIf
return BrailleAddObjectState(	nType)
EndFunction

void function ShowScreenSensitiveHelp(string sHelpMsg)
var
	string sText,
	string sName,
	string sType,
	int iSubtype,
	string sState,
	string sDescr,
	string sValue,
	string sAccess,
	int iState,
	string sTab, string sGroup

If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
if GetRibbonStatus(iState,sTab,sGroup,sDescr) then
	if iState==RibbonCollapsed then
		let sHelpMSG=msgRibbonToggleStateScreenSensitiveHelp+cscBufferNewLine
	endIf
endIf
let sName = GetObjectName(true)
let sType=GetObjectType()
let iSubtype=GetObjectSubtypeCode(true)
if iSubtype==wt_buttonDropdown then
	let sText = sName+cscSpace+msgSubmenu
ElIf iSubtype==wt_buttonDropdownGrid then
	let sText = sName+cscSpace+msgSubmenuGrid
elIf iSubtype==wt_editCombo then
	let sText = sName+cscSpace+msgRibbonEditCombo
elIf  iSubtype==wt_splitButton then
	let sText = sName+cscSpace+msgSplitButton
ElIf sType
&& sType != cmsgUnknown then
	let sText = sName+cscSpace+sType
else
	let sText = sName
EndIf
let sState = GetObjectState()
if sState then
	;we don't need to show the selected state:
	if StringCompare(StringTrimLeadingBlanks(sState),sc_SelectedState) != 0 then
		let sState = FormatString(msgStateScreenSensitiveHelp,sState)
		let sText = sText+cscSpace+sState
	EndIf
EndIf
let sValue = GetObjectValue(true)
let sDescr = GetObjectDescription(true)
if sValue
&& stringCompare(sValue,sDescr)!=0 then
	let sText = sText+cscBufferNewLine+sValue+cscBufferNewLine
else
	let sText = sText+cscBufferNewLine
EndIf
let sAccess = GetHotKey()
if sAccess then
	let sAccess = FormatString(msgAccessKeyScreenSensitiveHelp,sAccess)
	let sText = sText+cscBufferNewLine+sAccess+cscBufferNewLine
EndIf
if sDescr then
	let sText = sText+cscBufferNewLine+sDescr+cscBufferNewLine
EndIf
let sHelpMsg = sText+cscBufferNewLine+sHelpMsg
sayFormattedMessage(ot_user_buffer,sHelpMsg)
AddHotKeyLinks()
BrailleRefresh()
EndFunction

void function ProcessEventOnFocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth, string sClass, int nType)
;Manages where depth is like item, but user has focused on a control like a list box
;from another control we want to read the window type and text as SDM not as ItemChange
if (nChangeDepth < 0 &&isSDMDlg () && nType != giPrevTypeFromProcessEventOnFocusChange
;also ensure standard behavior so when dialog comes alive or app gains focus:
&& hwndFocus == hwndPrevFocus)
	focusChangedEvent (hwndFocus, hwndPrevFocus)
else
	ProcessEventOnFocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus,
		nPrevObject, nPrevChild,
		nChangeDepth, sClass, nType)
endIf
let giPrevTypeFromProcessEventOnFocusChange = nType
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd,
	handle hFocus,
	int iSubtype,
	int iWinType,
	string sObjName,
	int iMSAAMode
If gHwnd2003Command then
	SayMessage (OT_CONTROL_NAME, msgOffice2003Command)
	BrailleMessage (msgOffice2003Command, 0, 60000)
	Return
endIf
let hWnd = GetCurrentWindow()
let iWinType = getWindowSubtypeCode (hwnd)
let iSubtype = GetObjectSubtypeCode(true)
if (isSDMDlg() || stringContains (getWindowClass (hwnd), wc_bosa_sdmGeneral)) ; in 2010 sdmDLG can fail
&& (iWinType == WT_SDM || iWinType == WT_TABCONTROL) then
	if getWindowClass (getFocus ()) == cscListviewClass then
		sayWindowTypeAndText (getFocus ())
	elIf (iWinType == WT_TABCONTROL)
		if (stringIsBlank (getObjectName (TRUE))) then
			indicateControlType (WT_TABCONTROL, getDialogPageName(), LIST_ITEM_SEPARATOR)
		else
			sayObjectTypeAndText ()
		endIf
	elif (iWinType == WT_SDM)
		SDMSayWindowTypeAndText (hwnd, sdmGetCurrentControl ())
	else
		sayObjectTypeAndText (nLevel,includeContainerName)
	endIf
	return
endIf
if nLevel < 2 then
	if InRibbons(hWnd) then
		let iSubtype = GetObjectSubtypeCode(true)
		let sObjName=GetObjectName()
		if iSubtype == wt_Button
		|| iSubtype == WT_BUTTONDROPDOWN
		|| iSubtype == WT_BUTTONDROPDOWNGRID
		|| iSubtype == wt_SplitButton then
			;SayObjectTypeAndText will speak any existing object value,
			;but we don't want that spoken here:
			if GetObjectValue() then
				IndicateControlType(iSubtype,sObjName,cscSpace)
				Say(GetObjectState(),ot_item_state)
			else
				if iSubtype==wt_buttonDropdown then
					IndicateControlType(wt_buttonDropdown,sObjName,msgSubmenu)
				ElIf iSubtype==wt_buttonDropDownGrid then
					IndicateControlType(wt_buttonDropdownGrid,sObjName,msgSubmenuGrid)
				else
					SayObjectTypeAndText(0,includeContainerName)
				EndIf
			EndIf
		EndIf
		return
	EndIf
EndIf
if OnRecentDocumentsPushPin() then
	SayObjectTypeAndText(0,includeContainerName)
	Say(GetObjectName(true,1),ot_control_name)
	return
EndIf
; prevent extra chatter when in context menus.
if iSubtype==wt_menu then
	SayObjectTypeAndText(0,includeContainerName)
	return
EndIf
if GetMenuMode()>0 then
	if iSubtype==wt_splitbutton then
		indicateControlType(wt_splitButton,GetObjectName(true),cscSpace)
		return
	elIf !iSubtype then
		sayMessage(ot_control_type,cmsg6_l)
		return ; InNonDroppedContextMenu handles it by selecting the first item in the context menu.
	endIf
EndIf
if iSubtype==wt_columnHeader
|| iSubtype==wt_rowHeader then
	; level is 1 when control gains focus, 0 otherwise.
	if nLevel==1 then
		SayObjectTypeAndText(0,includeContainerName)
	else
		SayObjectActiveItem()
	endIf
	return
endIf
if InOptionsDialog(hwnd) then
	let iMSAAMode=GetJcfOption(Opt_msaa_mode)
	if iMSAAMode<2
	&& iSubtype!=wt_listboxItem then
		; anything less than 3 speaks too much verbiage about the dialog name which is part of the object name.
		SetJcfOption(opt_msaa_mode,3)
		sayObjectTypeAndText(nLevel,includeContainerName)
		SetJcfOption(opt_msaa_mode,iMSAAMode)
		return
	EndIf
endIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void Function ScreenSensitiveHelpForKnownClasses (int nSubTypeCode)
var
	handle hWnd,
	string sReal
hWnd = GetFocus()
sReal=GetWindowName(GetRealWindow(hwnd))
if OnRecentDocumentsPushPin() then
	ShowScreenSensitiveHelp(msgRecentDocumentsPushPinScreenSensitiveHelp)
	return
EndIf
if StringContains(sReal,wn_smartArtGraphic) then
	ShowScreenSensitiveHelp(msgScreenSensitiveHelpSmartArt)
	return
EndIf
if nSubtypeCode==wt_ListboxItem
&& inOptionsDialog(hwnd) then
	ShowScreenSensitiveHelp(msgScreenSensitiveHelpOptionsDlgListbox)
	return
EndIf
If inRibbons(hwnd) then
	if nSubtypeCode==wt_buttonDropdown then
		ShowScreenSensitiveHelp(msgSubmenuScreenSensitiveHelp)
		return
	ElIf nSubtypeCode==wt_buttonDropdownGrid then
		ShowScreenSensitiveHelp(msgSubmenuGridScreenSensitiveHelp)
		return
	elIf nSubtypeCode==wt_splitButton then
		ShowScreenSensitiveHelp(msgRibbonSplitButtonScreenSensitiveHelp)
		return
	EndIf
EndIf
if GetWindowName(hwnd)==wn_applyStyles then
	ShowScreenSensitiveHelp(msgApplyStylesScreenSensitiveHelp)
	return
EndIf

If nSubtypeCode==wt_edit
&& GetObjectSubtypeCode()==wt_editCombo  then
	ShowScreenSensitiveHelp(msgEditComboScreenSensitiveHelp)
	return
EndIf
if GetMenuMode()>0
&& GetObjectSubtypeCode(true)==wt_splitButton then
 ShowScreenSensitiveHelp(msgMenuSplitButtonScreenSensitiveHelp)
	return
EndIf
If isClipboardDialog(hwnd) then
	ShowScreenSensitiveHelp(msgClipboardDialogScreenSensitiveHelp)
	return
EndIf

if isResearchToolbar(hwnd) then
	ShowScreenSensitiveHelp(msgResearchToolbarScreenSensitiveHelp)
	return
EndIf
if nSubtypeCode==wt_ListBoxItem
&& GetWindowClass(hwnd)==wc_netUiHwnd then
	;ShowScreenSensitiveHelp(cmsgScreenSensitiveHelp40_L);some misleading info in the default help.
	ShowScreenSensitiveHelp (msgScreenSensitiveHelpNetUiLists)
	return
EndIf
if nSubtypeCode==wt_buttonMenu then
	ShowScreenSensitiveHelp(cmsgButtonMenuScreenSensitiveHelp)
	return
EndIf
If nSubtypeCode==wt_columnHeader then
	ShowScreenSensitiveHelp(msgColumnHeaderScreenSensitiveHelp)
	return
EndIf
If nSubtypeCode==wt_rowHeader then
	ShowScreenSensitiveHelp(msgRowHeaderScreenSensitiveHelp)
	return
EndIf
If IsStatusBarToolBar(hwnd) then
	If nSubtypeCode==wt_button then
		ShowScreenSensitiveHelp(msgStatusBarToolbarButtonHelp)
		return
	endIf
endIf
ScreenSensitiveHelpForKnownClasses(nSubTypeCode)
EndFunction

Int Function IsDocumentPropertiesPane(handle hwnd)
if IsVirtualRibbonActive() then
	return false
elIf ISVirtualPCCursor()
&& (StringContains(GetWindowOwner(hwnd),sc_mshtml)
|| GetWindowClass(hwnd)==cwcIEServer
|| GetWindowClass(hwnd)==wc_netUIHwnd) then
	setJcfOption(opt_virtual_pc_cursor,0)
	return true
elif GetWindowClass(hwnd)==cwcIEServer then
	return true
Else
	return false
EndIf
EndFunction

Script SayWindowTitle()
Var
	handle hwnd,
	string sAppWindowName
let hwnd=GetFocus()
BeginFlashMessage()
if inRibbons(hwnd)
|| isStatusBarToolbar(hwnd)  then
	SayObjectActiveItem(false)
elif GetWindowClass(hwnd)==wc_netUiHwnd then
	SayMessage(ot_user_requested_information,GetWindowName(GetRealWindow(hwnd)))
	SayObjectTypeAndText(0)
Else
	PerformScript SayWindowTitle()
EndIf
EndFlashMessage()
EndScript

int function InNonDroppedContextMenu()
var
	int iObjtype
let iObjType=GetObjectSubtypeCode()
if GetMenuMode()!=0
&& !iObjType then ;it is a context menu in Office 2010.
	return true
endIf
if iObjType!= wt_menu  then
	return false
EndIf
If GetObjectSubtypeCode(true,1) == wt_dialog_page then
	return true
EndIf
return false
EndFunction

int function MenuActiveProcessed(int mode, handle hWnd)
If mode == MENU_ACTIVE then
	if IsVirtualRibbonActive() then
		return default::MenuActiveProcessed(mode,hWnd)
	EndIf
	;The context menu is actually object type menu,
	;and when the first item is not yet selected the object name consists of all items in the menu
	;so we need to select the first item.
	if InNonDroppedContextMenu()  then
		TypeKey (cksDownArrow); Select first item in menus
		return
	EndIf
EndIf
MenuActiveProcessed(mode,hWnd)
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int nIsFocusObject)
Var
	string sValue
if isStatusBarToolBar(hwnd) then
	;Prevent extra chatter from status bar if focus is actually in document window.
	if GetWindowClass(GetFocus())!=wc_netUiHwnd then
		return
	endIf
	if sObjName==sc_zoomslider then
		let sValue=stringSegment(getWindowText(hwnd,false),cscSpace,-1)
		sayMessage(ot_status,sValue)
	endIf
endIf
if nObjType==wt_comboBox
&& GetObjectSubtypeCode()==wt_editCombo
&& GetWindowClass(GetFocus())==wc_RichEdit60w then
	Say(sObjValue,ot_line)
	return
endIf

If nObjtype == wt_EditCombo then
	if GetWindowClass(hWnd) == cwc_RichEdit20w then
		Say(sObjValue,ot_line)
		return
	EndIf
EndIf
ValueChangedEvent(hwnd, objId, childId, nObjType, sObjName, sObjValue,nIsFocusObject)
EndFunction

Int Function BrailleCallBackObjectIdentify()
Var
	handle hwnd
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
let hwnd=GetFocus()
If inRibbons(hwnd) then
	if GetObjectSubtypeCode(true)==wt_tabControl then
		return wt_UpperRibbon
	Else
		return wt_lowerRibbon
	EndIf
EndIf
if GetWindowClass(hwnd)==wc_wwn then
	return wt_MultiLine_edit
EndIf
;Fix subtype problem on single-line edit, where the multiline style bit has been set
if getWindowSubtypeCode (hwnd) == WT_EDIT
&& getWindowStyleBits (hwnd) & ES_MULTILINE then
	return wt_MultiLine_edit
EndIf
return BrailleCallbackObjectIdentify()
EndFunction

int Function BrailleAddObjectValue(int nType)
Var
	handle hwnd,
	string sValue,
	string sName,
	string sHotkey,
	int iObjType,
	String sType
if IsTouchCursor() then
	return BrailleAddObjectValue(nType)
endIf
if (nType == WT_TREEVIEW || nType == WT_TREEVIEWITEM)
&& dialogActive () then
	if GetWindowName (getFocus ()) == scTreeViewName then
		BrailleAddString (getObjectName (TRUE), GetCursorCol (), GetCursorRow (), ATTRIB_HIGHLIGHT) ; Prevent truncated results.
		return TRUE
	endIf
endIf
let hwnd=GetFocus()
if InRibbons(hwnd)
&& nType==wt_lowerRibbon then
	let sName=GetObjectName(true)
	let sValue=GetObjectValue()
	;handle case where the hotkey is part of the value.
	if StringContains(sValue,sHotkey) then
		let sHotkey=getHotkey()
		let sValue=sValue-sHotKey ;strip out the hotkey portion
	endIf
	if !sName then
		BrailleAddString(sValue,0,0,0)
	ElIf !sValue then
		BrailleAddString(sName,0,0,0)
	Elif sName!=sValue then
		BrailleAddString(sName,0,0,0)
		if stringContains(sValue,scrgb) then
			let sValue=GetControlColorValue(sValue)
		EndIf
		BrailleAddString(sValue,0,0,0)
	else
		BrailleAddString(sValue,0,0,0)
	EndIf
	let iObjType=GetObjectSubtypeCode(true)
	let sType=BrailleGetSubtypeString(iObjType)
	BrailleAddString(sType,0,0,0)
	return true
EndIf
if nType == WT_MULTILINE_EDIT
&& getWindowSubtypeCode (hwnd) == WT_EDIT then
	BrailleAddFocusLine ()
	return TRUE
endIf
if nType==wt_editCombo
&& GetWindowClass(hwnd)==wc_richEdit60w then
	return BrailleAddObjectValue(nType)
endIf
if GetWindowClass(GetParent(GetParent(hwnd)))==wc_netUIHwnd then
	BrailleAddString(GetObjectValue(true),0,0,0)
	return true
endIf
return BrailleAddObjectValue(nType)
EndFunction

Int Function BrailleAddObjectName(int nType)
if IsTouchCursor() then
	return BrailleAddObjectName(nType)
endIf
If nType==wt_menu
&& GetObjectSubtypeCode()==wt_splitButton then
	BrailleAddString(GetObjectName(),0,0,0)
	BrailleAddString(BrailleGetSubtypeString(wt_splitButton),0,0,0)
	return true
EndIf
if (nType == WT_TREEVIEW || nType == WT_TREEVIEWITEM)
&& dialogActive () then
	if GetWindowName (getFocus ()) == scTreeViewName then
		return TRUE ; no string
	endIf
endIf
if isStatusBarToolbar(GetFocus())
&& GetObjectSubtypeCode()==wt_Button then
	BrailleAddString(GetObjectName(),0,0,0)
	return true
endIf
if nType == wt_lowerRibbon
	;Both name and value are handled together in BrailleAddObjectValue
	return true
endIf
return BrailleAddObjectName(nType)
EndFunction

Int Function BrailleAddObjectContainerName(int nType)
If GetMenuMode()==menu_active
&& GetObjectSubtypeCode()==wt_splitButton then
	return true
EndIf
return BrailleAddObjectContainerName(nType)
EndFunction

String Function GetNonhighlightedWindowText(handle hwnd)
Var
	int iLeft,
	int iRight,
	int iTop,
	int iBottom,
	string sText

If GetFocusRect(hwnd,iLeft,iRight,iTop,iBottom) then
	let sText=GetTextInRect(iLeft,iTop,iRight,iBottom)
else
	let sText=GetTextInRect(GetWindowLeft(hwnd),GetLineTop(),GetWindowRight(hwnd),GetLineBottom(),			attrib_text|attrib_strikeout|attrib_highlight|attrib_unselected|0				)
	if !sText
	&& (gbTabShiftTabNavigation
	|| gbCurrentLine) then
		let sText=GetTextBetween(GetWindowLeft(hwnd),GetWindowRight(hwnd))
	EndIf
EndIf
if !sText then
	return cmsgBlank1
EndIf
return sText
EndFunction

string function GetCustomTutorMessage()
var
	handle hWnd,
	int iSubtype,
	int iState,
	string sValue,
	string sObjName
if ! (getRunningFSProducts () & product_JAWS) then
	return
endIf
If gHwnd2003Command then
	Return cscSpace+cscSpace+cscBufferNewLine;dud messsage
endIf
hWnd = GetFocus()
iSubtype = GetObjectSubtypeCode()
if InRibbons(hWnd)
	If  iSubtype==wt_button
	&& getObjectName(true)==wn_split
		return msgButton+cscSpace+getObjectDescription()
	EndIf
ElIf IsStatusBarToolBar(hWnd) then
	if iSubtype==wt_button then
		let sObjName=GetObjectName()
		If StringCompare(sObjName,wn_Zoom)==0 then
			GetObjectInfoByName (hwnd,wn_Zoom,1,iSubtype,iState,sValue)
			return sValue+cscSpace+msgStatusBarToolbarButtonHelp+cscSpace+msgStatusBarToolBarTutorialHelp
		endIf
		return msgStatusBarToolbarButtonHelp+cscSpace+msgStatusBarToolBarTutorialHelp
	else
		return msgStatusBarToolBarTutorialHelp
	endIf
ElIf OnRecentDocumentsPushPin() then
	return msgRecentDocumentsPushPinTutorialHelp
ElIf IsResearchToolbar(hwnd) then
	return msgResearchToolbarTutorialHelp
ElIf IsClipboardDialog(hwnd) then
	return msgClipboardDialogTutorialHelp
elIf iSubtype==wt_splitButton then
	return msgMenuSplitButtonTutorHelp
elIf inOptionsDialog(hwnd) then
	if GetObjectName(true,1)==sc_OptionsDlgCategories then
		return msgOptionsDlgCategoriesTutorHelp
	elIf iSubType==wt_listboxItem then
		return msgListbox
	elIf iSubtype==wt_treeviewItem then
		return msgTreeview
	endIf
elIf isBackstageView(hwnd) then
	if iSubtype==wt_tabControl then
		return msgBackStageViewTabTutorHellp
	endIf
endIf
return GetCustomTutorMessage()
EndFunction

void function tutorMessageEvent(handle hwndFocus, int nMenuMode)
Var
	int iObjectType,
	Int iSpeakTutorMessage,
	Int iSpeakAccessKeys,
	int iPunctLevel,
	String sFocusClassName,
	string sHotkey,
string sPrompt
let iObjectType=GetObjectSubtypeCode(true)
let iSpeakTutorMessage = ShouldItemSpeak (ot_TUTOR)
let iSpeakAccessKeys = ShouldItemSpeak (ot_access_key)
if hwndFocus==globalPrevFocus
&& iObjectType==wt_listBoxItem  then
	if !StringContains(getWindowName(GetRealWindow(hwndFocus)),wn_options) then
		return
	endIf
EndIf

if iObjectType==wt_menu  then
	; when a menu gains focus, it does not always have the same class.
	; to prevent double-speaking of hot keys in most cases, we need to just return.
	If gbOutlookIsActive
	&& !gbWordIsWindowOwner
	&& GetWindowName(GetRealWindow(hwndFocus))==cmsgContextMenu1 then
		return
	EndIf

	if GetWindowClass(hwndFocus)!=wc_netUiHwnd
	&& iSpeakAccessKeys == TUTOR_ALL then
		let iPunctLevel=GetJcfOption(opt_punctuation)
		SetJcfOption(opt_punctuation,0)
		let sHotkey=GetHotkey()
		ExpandAltCommaInHotKey(sHotKey)
		SayUsingVoice(vctx_message,sHotKey,ot_access_key)
		SetJcfOption(opt_punctuation,iPunctLevel)
	EndIf
	if StringIsBlank(sHotKey)
	&& iSpeakAccessKeys == TUTOR_ALL then
		let sHotKey=findHotKey(sPrompt)
		SayUsingVoice(vctx_message,sHotKey,ot_access_key)
	endIf
	return
endIf

; To handle the split buttons in Alt+F menu in Office 2010...
let sFocusClassName = GetWindowClass (hwndFocus)
If nMenuMode > 0
&& sFocusClassName == wc_NetUIHWND
&& iObjectType == WT_SPLITBUTTON then
	If iSpeakTutorMessage == TUTOR_ALL then
		SayTutorialHelp(iObjectType,false)
	EndIf
	If iSpeakAccessKeys == ACCESS_KEY_ALL
	|| iSpeakAccessKeys == ACCESS_KEY_MENUS then
		SayTutorialHelpHotKey(hwndFocus,false)
	EndIf
	Return
EndIf
if nMenuMode>0
&& !iObjecttype then
	return ;prevent tutor message from firing early.
endIf

let iPunctLevel=GetJcfOption(opt_punctuation)
SetJcfOption(opt_punctuation,0)
tutorMessageEvent(hwndFocus,nMenuMode)
SetJcfOption(opt_punctuation,iPunctLevel)
EndFunction

String Function GetControlColorValue(string sColorName)
;speak color value for some ribbon controls such as split buttons when the value is an RGB string.
; we need to build the 9-digit string in cases where
;only 1 or two digits are present for each portion of the string provided by GetObjectValue.
; also we need to build the string where the RGB information is the only information provided by GetObjectName.
Var
	string sc1,
	string sc2,
	string sc3,
	string sColorNameTrimmed,
	int iLength,
	string sColor
if !StringContains(sColorName,scRGB) then
	return cscNull
endIf
;Remove the parentheses.
let sColorName=stringSegment(sColorName,scRGB,-1)
let sColorName=stringChopLeft(sColorName,1)
let sColorName=StringChopRight(sColorName,1)
let sColorNameTrimmed=stringReplaceChars(sColorName,cscSpace,cscNull)
; now get each portion of the string.
let sc1=stringSegment(sColorNameTrimmed,scComma,1)
let sc2=stringChopLeft(stringSegment(sColorNameTrimmed,scComma,2),1)
let sc3=stringChopLeft(stringSegment(sColorNameTrimmed,scComma,-1),1)
;Ensure  each segment is three digits long.
;If the length is <3, we must pad with 0's.
; However, when attempting to concatenate, they are treated as integers.
;So we must apply the following kludge:
; Check sc1.
let iLength=StringLength(sc1)
if iLength==2 then
	let sc1=stringTrimLeadingBlanks(" 0"+sc1)
elif iLength==1 then
	let sc1=StringTrimLeadingBlanks(" 00"+sc1)
EndIf

; Check sc2.
let iLength=StringLength(sc2)
if iLength==2 then
	let sc2=stringTrimLeadingBlanks(" 0"+sc2)
elif iLength==1 then
	let sc2=stringTrimLeadingBlanks(" 00"+sc2)
EndIf

; Check sc3.
let iLength=StringLength(sc3)
if iLength==2 then
	let sc3=stringTrimLeadingBlanks(" 0"+sc3)
elif iLength==1 then
	let sc3=stringTrimLeadingBlanks(" 00"+sc3)
EndIf
let sColor=stringReplaceChars(cscSpace+sc1+cscSpace+sc2+cscSpace+sc3,cscSpace,cscNull)
let sColorName=GetColorName(RGBStringToColor(sColor))
return sColorName
EndFunction

Int function BrailleAddObjectType(int ntype)
Var
	int iObjType,
	int nLevel,
	string sObjName
if IsTouchCursor() then
	return BrailleAddObjecttype(nType)
endIf
let iObjType=GetObjectSubtypeCode(true,1)
If (iObjType==wt_toolbar
|| iObjtype==wt_groupbox) then
	let nLevel=6
	while nLevel>0
		let sObjName=GetObjectName(true,nLevel)
		if sObjName!=sc_QuickAccessToolbar then
			let nLevel=nLevel-1
		else
			BrailleAddString(brl_quickAccessToolbar,0,0,0)
			return true
		endIf
	EndWhile
endIf
/*
if nType==wt_UpperRibbon then
	BrailleAddString("urbn",0,0,0)
endIf
*/
return BrailleAddObjecttype(nType)
EndFunction

void function SayLine(optional int HighlightTracking, optional int bSayingLineAfterMovement)
var
	handle hWnd,
	string sClass,
	int iWinSubtype
if !isPCCursor()
|| isVirtualPCCursor() then
	SayLine(HighlightTracking,bSayingLineAfterMovement)
	return
EndIf
If gHwnd2003Command then
	If isSameScript () then
		SpellString (msgOffice2003Command)
	Else
		SayMessage (OT_CONTROL_NAME, msgOffice2003Command)
	EndIf
	BrailleMessage (msgOffice2003Command, 0, 60000)
	Return
endIf
let hWnd = GetCurrentWindow()
if IsPCCursor()
&& !UserBufferIsActive() then
	let iWinSubtype=GetWindowSubtypeCode(hwnd)
	;Handle where edit is mis-typed as single-line, while it contains a multiline style bit:
	if dialogActive () && iWinSubtype == WT_EDIT
	&& (getWindowStyleBits (hwnd) & ES_MULTILINE) THEN
		say (getLine (), OT_LINE)
		return
	ENDIF
	if OnRecentDocumentsPushPin() then
		SayObjectTypeAndText(0)
		return
	EndIf
	if isClipboardDialog(hwnd)
	&& iWinSubtype==wt_listbox then
		SayLine(HighlightTracking,bSayingLineAfterMovement)
		return
	EndIf
	let sClass=GetWindowClass(hwnd)
	if GlobalMenuMode
	&& sClass==cwc_RichEdit20W
	&& GetWindowSubTypeCode(hWnd)!=wt_Edit_Spinbox then
		SayMessage(ot_line,getObjectValue())
		return
	EndIf
	if inRibbons(hwnd)
	|| isStatusBarToolbar(hwnd)
	|| sClass==wc_netuiHwnd then
		if isSameScript() then
			SpellLine()
		Else
			SayObjectTypeAndText(0)
		EndIf
		return
	EndIf
EndIf
If GetWindowClass(hwnd)==wc_wwn then
	Say(GetTextInRect(GetWindowLeft(hwnd),GetLineTop(),GetWindowRight(hwnd),GetLIneBottom(),0),ot_line,true)
	return
EndIf
SayLine(HighlightTracking,bSayingLineAfterMovement)
EndFunction

Script ReadBoxInTabOrder()
Var
	handle hwnd
let hwnd=GetFocus()
if GetWindowClass(hwnd)==wc_netUIHwnd
&& !UserBufferIsActive() then
	Say(GetTypeAndTextStringsForWindow(hwnd),ot_user_requested_information)
	return
EndIf
performScript ReadBoxInTabOrder()
EndScript

string function FindHotKey(string ByRef sPrompt)
var
	handle hwnd,
	handle hReal,
	int iType,
	int iRefData,
	object oFocus,
	int iObjID,
	int iObjChildID,
	string sHotkey

If isWindowVisible (gHwnd2003Command) then
	Return cscSpace+cscSpace+cscBufferNewLine
endIf
let hwnd=GetFocus()
let hReal=getRealWindow(hwnd)
if isSDMDlg() then
	let iType = GetObjectSubtypeCode()
	if iType == wt_ComboBox
	|| iType == wt_button
	|| iType == wt_CheckBox
	|| iType==wt_radioButton
	|| iType==wt_edit_spinbox
	|| iType==wt_editCombo
	|| iType==wt_edit
	|| iType==wt_listboxItem then
		let sPrompt = GetObjectName(1)
		let sHotKey = GetHotKey()
		if !sHotKey then
			let oFocus = getObjectAtPoint(iRefData,getCursorCol(),getCursorRow()) ; note getFocusObject doesn't work as it gets the dlg rather than the child
			let sHotkey = oFocus.accKeyboardShortcut(iRefData)
		EndIf
		return sHotKey
	EndIf
EndIf
if StringContains(GetWindowName(hReal),wn_autoCorrect)
&& stringContains(getWindowClass(GetParent(hwnd)),cwc_dlg32770) then
	if getWindowSubtypeCode (hwnd) == WT_LISTBOX then
		let sPrompt = GetObjectName(1)
		let oFocus = getObjectAtPoint(iRefData,getCursorCol(),getCursorRow()) ; note getFocusObject doesn't work as it gets the dlg rather than the child
		let sHotkey = oFocus.accKeyboardShortcut(iRefData)
		return sHotKey
	EndIf
endIf
if stringCompare(GetWindowClass(hwnd),wc_richEdit60w)==0
&& GetObjectSubtypeCode(true)==wt_editCombo then
	let oFocus=getObjectFromEvent(hwnd,iObjID,iObjChildID,iRefData)
	if oFocus then
		let sHotkey = oFocus.accKeyboardShortcut(iRefData)
		return sHotkey
	endIf
endIf
let sHotKey=GetHotKey()
if sHotKey!=cscNull then
	return sHotKey
elif sHotKey==cscNull then
	let sHotKey=GetHotKey(hwnd)
	if sHotkey!=cscNull then
		return sHotkey
	else
		let sHotKey=GetHotkey(GetParent(hwnd))
		if sHotkey!=cscNull then
			return sHotkey
		endIf
	endIf
endIf
return FindHotKey(sPrompt)
EndFunction

string function BrailleFindHotKey(string ByRef sPrompt)
var
	handle hReal,
	int iType,
	int iRefData,
	object oFocus,
	int iObjID,
	int iObjChildID,
	string sHotkey
If isWindowVisible (gHwnd2003Command) then
	Return cscSpace+cscSpace+cscBufferNewLine
endIf
let hReal=getRealWindow(getFocus())
if stringContains(getWindowClass(hReal),wc_SDM) then
	let iType = GetObjectSubtypeCode()
	if iType == wt_ComboBox
	|| iType == wt_button
	|| iType == wt_CheckBox
	|| iType==wt_radioButton
	|| iType==wt_edit_spinbox
	|| iType==wt_editCombo
	|| iType==wt_edit
	|| iType==wt_listboxItem then
		let sPrompt = GetObjectName(1)
		let sHotKey = GetHotKey()
		if !sHotKey then
			let oFocus = getObjectAtPoint(iRefData,getCursorCol(),getCursorRow()) ; note getFocusObject doesn't work as it gets the dlg rather than the child
			let sHotkey = oFocus.accKeyboardShortcut(iRefData)
		EndIf
		return sHotKey
	EndIf
EndIf
if StringContains(GetWindowName(hReal),wn_autoCorrect)
&& stringContains(getWindowClass(GetParent(GetFocus())),cwc_dlg32770) then
	;if GetObjectSubtypeCode()==wt_listbox then
	if getWindowSubtypeCode (getFocus ()) == WT_LISTBOX then
		let sPrompt = GetObjectName(1)
		let oFocus = getObjectAtPoint(iRefData,getCursorCol(),getCursorRow()) ; note getFocusObject doesn't work as it gets the dlg rather than the child
		let sHotkey = oFocus.accKeyboardShortcut(iRefData)
		return sHotKey
	EndIf
endIf
if stringCompare(GetWindowClass(GetFocus()),wc_richEdit60w)==0
&& GetObjectSubtypeCode(true)==wt_editCombo then
	let oFocus=getObjectFromEvent(getFocus(),iObjID,iObjChildID,iRefData)
	if oFocus then
		let sHotkey = oFocus.accKeyboardShortcut(iRefData)
		return sHotkey
	endIf
endIf
return FindHotKey(sPrompt)
EndFunction

Void Function SayLBItemObjectState(int iAttrib)
if iAttrib==ctrl_checked then
	SayMessage(ot_item_state,cmsg_checked)
elIf iAttrib==ctrl_unchecked then
	SayMessage(ot_item_state,cmsg_NotChecked)
endIf
EndFunction

int Function SayVistaPathProcessed (handle hWnd)
var
	Handle hPathToolBar

If IsWinVista ()	; Only apply to Vista...
&& GetWindowOwner (GetAppMainWindow (hWnd)) != GetWindowOwner (hWnd) then	; and if the owner of the main window and the current differ - common dialogues is the case...
	let hPathToolBar = FindWindowWithClassAndId (GetRealWindow (hWnd), cWc_Toolbar, ID_PathToolBar)	; Find the control with the desired name to announce...
	If hPathToolBar then
		Say (GetWindowName (hPathToolBar), OT_CONTROL_NAME)
		Return (TRUE)
	EndIf
EndIf
Return (FALSE)
EndFunction

Int function BrailleAddObjectHotkey(int nType)
var
	handle hFocus,
	string sHotkey,
	string sPrompt,
 string sScriptKeyName
if nType==wt_UpperRibbon then
	BrailleAddString(GetHotkey(),0,0,0)
	return true
endIf
If nType==wt_lowerRibbon then
	let sHotKey=GetHotkey()
	if sHotKey==cscNull then
		let sHotKey=msOffice2007::FindHotkey(sPrompt)
	endIf
	if sHotkey!=cscNull then
		BrailleAddString(sHotkey,0,0,0)
		return true
 	endIf
endIf
;added so that the font edit combos off the ribbons generate a hotkey in Braille correctly.
let hFocus=GetFocus()
;if navigating through edit combo, do not display hotkey.
let sScriptKeyName=StringLower(GetCurrentScriptKeyName())
if sScriptKeyName!=cksDownArrow
&& sScriptKeyName!=cksUpArrow then
	if nType==wt_editCombo
	&& stringCompare(GetWindowClass(hFocus),wc_richEdit60W)==0
	&& !IsSdmDlg()  then
		let sHotKey=GetHotKey()
		if sHotKey==cscNull then
			;force call to BrailleFindHotkey function explicitly. Otherwise, if hotkeys are disabled, a call to
			;findHotkey never processes the Braille hotkey.
			let sHotKey=BrailleFindHotkey(sPrompt)
		endIf
		if sHotkey!=cscNull then
			BrailleAddString(sHotkey,0,0,0)
			return true
		endIf
	endIf
EndIf
return true
EndFunction

int function ShouldAddVirtualRibbonsOption()
return true
EndFunction

Int Function isBackStageView(handle hwnd)
var
	handle hTemp,
	int nLevel
if GetWindowClass(hWnd) != wc_NetUIHwnd then
	return false
EndIf
let hTemp = hWnd
while hTemp
&& GetWindowClass(hTemp) != wc_ParentClass_FULLPAGEUIHost
	let hTemp = GetParent(hTemp)
EndWhile
if hTemp then
	let nLevel=5
	while nLevel<=5
	&& nLevel>1 ; safety
		if StringContains(GetObjectName(true,nLevel),sc_BackStageView) then
			return true
		EndIf
		let nLevel=nLevel-1
	endWhile
endIf
return false
EndFunction

Void Function SayRibbonState(int iState)
var
	string sMsg
if iState==Ribbons_Inactive then
	sMsg=msgRibbonInActive
elIf iState==RibbonTabs_Active then
	sMsg=msgUpperRibbonActive
elIf	iState==LowerRibbon_Active then
	smsg=msgLowerRibbonActive
elIf iState==RibbonCollapsed then
	sMsg=msgRibbonCollapsed+cscSpace+formatString(msgRibbonToggleStateTutorHelp)
endIf
sayFormattedMessage(ot_status,sMsg)
EndFunction

script ToggleRibbonState()
var
 int iState,
 string sTab,
 string sGroup,
 string sDesc
sayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
GetRibbonStatus(iState,sTab,sGroup,sDesc)
BeginFlashMessage()
SayRibbonState(iState)
if sTab!=cscNull then
	sayFormattedMessage(ot_status,FormatString(msgRibbonTab,sTab))
endIf
if sGroup!=cscNull then
	sayFormattedMessage(ot_status,formatString(msgRibbonGroup,sGroup))
endIf
if sDesc!=cscNull then
	sayMessage(ot_status,sDesc)
endIf
EndFlashMessage()
EndScript

void function SayWordUnit(int UnitMovement)
;overwritten here to prevent extra chatter from the group just left when navigating by group.
if !IsVirtualRibbonActive() then
	if inRibbons(GetFocus()) then
		if UnitMovement == UnitMove_Next then
			NextWord()
		ElIf UnitMovement == UnitMove_Prior then
			PriorWord()
		endIf
		return
	endIf
endIf
SayWordUnit(UnitMovement)
EndFunction

Void Function ProcessAccessibilityCheckerDialogStaticText(handle hwnd)
var
	int iObjType
if StringCompare(GetWindowName(GetParent(GetParent(hwnd))),wn_2010AccessibilityChecker)==0 then
	let iObjType=GetObjectSubtypeCode()
	if iObjType!=wt_button
	|| (iObjType==wt_button
	&& GetObjectState()!=cmsgPressedGraphic1_L) then
		sayMessage(ot_help,GetWindowTextEx(hwnd,false,true))
	endIf
endIf
EndFunction
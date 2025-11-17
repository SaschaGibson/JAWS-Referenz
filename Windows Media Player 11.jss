; JAWS script file for Windows Media Player 11
; Copyright 2008-2015 by Freedom Scientific Inc.


use "WMPFunc.jsb"

include "HjConst.jsh"
include "HJGlobal.jsh"
include "WinStyles.jsh"
include "common.jsm"
Include "TutorialHelp.jsm"
include"HjHelp.jsh"
include "Windows Media Player 11.jsh"
include "Windows Media Player 11.jsm"

const
	unit_Current_Character = 1,
	unit_Current_Word = 2,
	unit_current_line = 3
globals
;the current playlist name:
	string gsCurrentPlayListName,
;for dragging media when creating a playlist:
	int DragFromListX,
	int DragFromListY


GLOBALS
	int giOCRActiveCursor,
	int GlobalOCRJobID,
	collection Rect_OCR

void function ProcessEventOnFocusChangedEvent(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow, handle PrevWindow)
;Because MSAA mode is 2, the default will process the wrong event.
LoadNonJCFOptions ()
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
ProcessSayRealWindowOnFocusChange(AppWindow,RealWindow,RealWindowName,FocusWindow)
ProcessSayFocusWindowOnFocusChange(RealWindowName,FocusWindow)
EndFunction

void function ObjStateChangedEvent(handle hObj,int iObjType,int nChangedState,int nState, int nOldState)
if iObjType == wt_button
&& hObj == GlobalFocusWindow then
	if GetWindowClass(hObj) == wc_WMPAppHost then
		if nChangedState == CTRL_PRESSED then
			SayObjectTypeAndText()
			return
		EndIf
	EndIf
EndIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

Void Function ValueChangedEvent(handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int bIsFocusObject)
;Current Enhancement is being cycled with next/prior buttons:
if !bIsFocusObject
&& nObjType == wt_ReadOnlyEdit then
	if StringCompare(sObjName,objn_CurrentEnhancement) == 0 then
		Say(sObjValue,ot_highlighted_screen_text)
		return
	EndIf
EndIf
ValueChangedEvent(hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

int Function ProcessSpaceBarKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if KeyIsSpacebar(nKey,StrKeyName,nIsBrailleKey) then
	if IsWMPMainScreenToggleControl() then
		;Space will only toggle the button if the mouse is on it:
		SaveCursor()
		JAWSCursor()
		RouteJAWSToPC()
		Pause() ;let the toggle happen
		RestoreCursor()
		;Allow time for value to change.
		;note that ValueChangedEvent cannot be used since it may not fire due to
		;successive events firing too rapidly.
		ScheduleFunction("SayObjectTypeAndText",2)
		return true
	EndIf
EndIf
return ProcessSpaceBarKeyPressed(nKey,strKeyName,nIsBrailleKey,nIsScriptKey)
EndFunction

int function GetFocusWMPListType()
var
	handle hWnd,
	handle hReal,
	int lvs,
	handle hLibraryTree,
	handle hBasket
let hWnd = GetFocus()
if GetWindowClass(hWnd) != cWcListView
|| StringCompare(GlobalObjectContainerGroupName,objn_LibraryContainerGroup) != 0 then
	return WMPListType_Invalid
EndIf
let hReal = GetRealWindow(hWnd)
let hBasket = FindWindow(hReal,cwcListView,wn_BasketListView)
if !hBasket then
	return WMPListType_Invalid
EndIf
let hLibraryTree = FindWindowWithClassAndID(hReal,cwc_SysTreeView32,id_LibraryTreeView)
if hLibraryTree  && IsWindowVisible(hLibraryTree) Then
	let lvs = GetWindowStyleBits(hWnd)
	if lvs & LVS_AUTOARRANGE then
		if lvs & 0x00100000 then
			return WMPListType_LibraryTreeItemDragContent
		else
			return WMPListType_LibraryTreeItemNoDragContent
		EndIf
	elif LVS_NOCOLUMNHEADER then
		return WMPListType_LibraryBasket
	EndIf
else
	return WMPListType_NowPlaying
EndIf
return WMPListType_Invalid
EndFunction

void function SetGlobalContainerNameAndHierarchyLevel(handle hFocus)
;for managing container groups on the main WMP screen
var
	string sFocusClass,
	int iSubtype
if GlobalMenuMode then
	let GlobalContainerHierarchyLevel = 0
	let GlobalObjectContainerGroupName = cscNull
EndIf
let sFocusClass = GetWindowClass(hFocus)
if sFocusClass == cWcListView
|| sFocusClass == cwc_SysTreeView32 then
	if GetWindowClass(GetParent(GetParent(GetParent(hFocus)))) == wc_WMPAppHost then
		let GlobalContainerHierarchyLevel = 3
		let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
	EndIf
ElIf sFocusClass == cWc_Toolbar then
	if GetWindowClass(GetParent(GetParent(GetParent(hFocus)))) == wc_WMPAppHost then
		let GlobalContainerHierarchyLevel = 2
		let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
		if !GlobalObjectContainerGroupName then
			let GlobalContainerHierarchyLevel = 3
			let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
		EndIf
	EndIf
ElIf sFocusClass == wc_edit then
	if GetWindowClass(GetParent(GetParent(GetParent(hFocus)))) == wc_WMPAppHost then
		let GlobalContainerHierarchyLevel = 1
		let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
	EndIf
ElIf sFocusClass == wc_WMPAppHost then
	let iSubtype = GetObjectSubtypeCode()
	if iSubtype == wt_LeftRightSlider
	|| iSubtype == wt_ReadOnlyEdit then
		let GlobalContainerHierarchyLevel = 1
		let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
	else
		let GlobalContainerHierarchyLevel = 2
		let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
		if StringCompare(StringRight(GlobalObjectContainerGroupName,StringLength(objn_GroupBackgroundSuffix)),objn_GroupBackgroundSuffix) == 0 then
			let GlobalContainerHierarchyLevel = 1
			let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
		EndIf
	EndIf
ElIf sFocusClass == wc_CWmpControlCntr then
	if GetObjectSubtypeCode() == wt_ReadOnlyEdit then
		let GlobalContainerHierarchyLevel = 1
		let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
		;following compare makes use of the fact that == stops at the end of the shortest string:
		if GlobalObjectContainerGroupName == objn_UnnamedPrefix then
			let GlobalContainerHierarchyLevel = 2
			let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
			if !GlobalObjectContainerGroupName then
				let GlobalContainerHierarchyLevel = 1
				let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
			EndIf
		EndIf
	else
		let GlobalContainerHierarchyLevel = 2
		let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
		if GlobalObjectContainerGroupName != objn_StarRatingGroup
		&& GlobalObjectContainerGroupName != objn_MainGroup then
			let GlobalContainerHierarchyLevel = 4
			let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
			if !GlobalObjectContainerGroupName then
				let GlobalContainerHierarchyLevel = 1
				let GlobalObjectContainerGroupName = GetObjectName(false,GlobalContainerHierarchyLevel)
			EndIf
		EndIf
	EndIf
else
	let GlobalContainerHierarchyLevel = 0
	let GlobalObjectContainerGroupName = cscNull
EndIf
EndFunction

void function SetUserFriendlyGroupName()
;Note that it is not intended that all groups have a user-friendly name to speak.
if StringCompare(GlobalObjectContainerGroupName,objn_TransportsInnerGroup) == 0 then
	let GlobalObjectUserFriendlyGroupName = msgTransportsInnerGroupUserFriendlyName
ElIf StringCompare(GlobalObjectContainerGroupName,objn_StarRatingGroup) == 0 then
	let GlobalObjectUserFriendlyGroupName = msgStarRatingGroupUserFriendlyName
ElIf StringCompare(GlobalObjectContainerGroupName,objn_LibraryContainerGroup) == 0 then
	let GlobalObjectUserFriendlyGroupName = msgLibraryGroupUserFriendlyName
ElIf StringCompare(GlobalObjectContainerGroupName,objn_EqualizerSliderGroup) == 0 then
	let GlobalObjectUserFriendlyGroupName = msgEqualizerSliderGroupUserFriendlyName
ElIf StringCompare(GlobalObjectContainerGroupName,objn_Unnamed2) == 0 then
	let GlobalObjectUserFriendlyGroupName = msgVideoGroupUserFriendlyName
else
	let GlobalObjectUserFriendlyGroupName = cscNull
EndIf
EndFunction

int function FocusExRedirected(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if (inHjDialog () || userBufferIsActive ())
	return FALSE;
endIf
if GetWindowClass(hWndFocus) == cwc_ComboLBox then
	if GetObjectSubtypeCode() == wt_ListBox then
		if !GetObjectName() then
			TypeKey(cksDownArrow)
			return true
		EndIf
	EndIf
EndIf
return false
EndFunction

void function FocusChangedEventEx(
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
if FocusExRedirected(hwndFocus,nObject, nChild,hwndPrevFocus,nPrevObject,nPrevChild,nChangeDepth) then
	return
EndIf
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
if (inHjDialog () || userBufferIsActive ())
	if userBufferIsActive () then
		;This keeps the Virtual viewer from repeating and repeating,
		;especially this happened when returning from an HJ dialog, aka Research It.
		;This was possibly interference with MSAA?
		sayLine (TRUE)
	else
		default::FocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
	endIf
	return
endIf
SetGlobalContainerNameAndHierarchyLevel(hWndFocus)
FocusChangedEventEx(hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
let GlobalPrevObjectContainerGroupName = GlobalObjectContainerGroupName
EndFunction

int function FocusLostOnMainWMPScreen(handle hWnd)
var
	string sClass
if (inHjDialog () || userBufferIsActive ())
	return FALSE
endIf
let sClass = GetWindowClass(hWnd)
if sClass == wc_WMPAppHost
|| sClass == wc_CWmpControlCntr then
	if !GetObjectSubtypeCode() then
		if GetObjectName() != objn_VideoAndVisualizationDisplayArea then
			return true
		EndIf
	EndIf
EndIf
return false
EndFunction

int Function FocusRedirected(handle FocusWindow, handle PrevWindow)
if FocusLostOnMainWMPScreen(FocusWindow) then
	Delay(3)
	ShiftTabKey()
	TabKey()
	return true
EndIf
return false
EndFunction

Void Function FocusChangedEvent(handle FocusWindow, handle PrevWindow)
if FocusRedirected(FocusWindow,PrevWindow) then
	return
EndIf
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
if DialogActive() then
	;speak group names
	SetJCFOption(opt_msaa_mode,1)
else
	;suppress group names
	SetJCFOption(opt_msaa_mode,3)
EndIf
FocusChangedEvent(FocusWindow,PrevWindow)
EndFunction
void function ScreenStabilizedEvent(handle hwndLastScreenWrite)
if FocusLostOnMainWMPScreen(GetFocus()) then
	Delay(3)
	ShiftTabKey()
	TabKey()
	return true
EndIf
ScreenStabilizedEvent(hwndLastScreenWrite)
EndFunction

Void Function CursorShapeChangedEvent(string CursorType)
if FocusLostOnMainWMPScreen(GetFocus()) then
	Delay(3)
	ShiftTabKey()
	TabKey()
	return true
EndIf
CursorShapeChangedEvent(CursorType)
EndFunction

void Function ActiveItemChangedEvent(handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
var
	string sName
if GetWindowClass(curHwnd) == cwcListView then
	if StringCompare(GlobalObjectContainerGroupName,objn_LibraryContainerGroup) == 0 then
		if ! giOCRActiveCursor then
			PCCursor()
		endIf
		let sName = GetObjectName()
		if sName
		&& !ControlCanBechecked() then
			;try to avoid spewing a long line of text by just saying the name:
			Say(sName,ot_line)
		else
			SayObjectActiveItem(false)
		EndIf
		if IsListItemCurrentlyPlayingMedia() then
			SayUsingVoice(VCTX_MESSAGE,msgCurrentlyPlaying,ot_line)
		EndIf
		RestoreCursor()
		return
	EndIf
EndIf
ActiveItemChangedEvent(curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

Void Function SayFocusedObject ()
if ! giOCRActiveCursor then
	SaveCursor ()
	PCCursor ()
endIf
SayObjectTypeAndText ()
if ! giOCRActiveCursor then
	RestoreCursor ()
endIf
NotifyIfContextHelp()
EndFunction


string function GetAboutDialogStaticText()
var
	handle hWnd,
	string sText
let hWnd = GetRealWindow(GetFocus())
if StringCompare(GetWindowName(hWnd),wn_AboutWindowsMediaPlayer) == 0 then
	let hWnd = GetFirstChild(hWnd)
	while hWnd
		if GetWindowSubtypeCode(hWnd) == wt_static
		&& IsWindowVisible(hWnd) then
			let sText = sText+cscBufferNewLIne+GetWindowTextEx(hWnd,0,0)
		EndIf
		let hWnd = GetNextWindow(hWnd)
	EndWhile
	if sText then
		;strip leading newline:
		let sText = StringChopLeft(sText,1)
	EndIf
EndIf
return sText
EndFunction

string function GetCurrentSliderValue()
;value returned after slider movement may be incorrect unless we use the following method to obtain it:
var
	object o
let o = GetCurrentObject(0)
return o.accValue
EndFunction

string function GetVolumeSliderValue()
return FormatString(msgVolumePercentage,GetCurrentSliderValue())
EndFunction

string function GetSeekSliderValue()
;This trackbar shows the number of seconds elapsed.
;We must therefore strip off the "percent" from the value since it is not a percentage.
return StringSegment(GetCurrentSliderValue(),cScPeriod,1)
EndFunction

string function GetCrossFadeSliderValue()
;Convert percentage in value to milliseconds
return FormatString(msgCrossFadeSliderValue,StringSegment(GetCurrentSliderValue(),cscSpace,1))
EndFunction

string function GetEqualizerSliderName()
;strips off redundant text from name
return StringChopRight(GetObjectName(),StringLength(objn_EqualizerSliderNameSuffix))
EndFunction

string function GetEqualizerSliderValue()
;convert percentage in value to DB
return FormatString(msgEqualizerSliderValue,GetCurrentSliderValue())
EndFunction

string function GetSpeedSliderValue()
return GetCurrentSliderValue()
EndFunction

string function GetVideoSliderName()
var
	string sName
let sName = GetObjectName()
if sName == objn_vidHue then
	return msgVidHueUserFriendlyName
ElIf sName == objn_vidBright then
	return msgVidBrightUserFriendlyName
ElIf sName == objn_vidSat then
	return msgVidSatUserFriendlyName
ElIf sName == objn_vidContrast then
	return msgVidContrastUserFriendlyName
else
	return cscNull
EndIf
EndFunction

string function GetVideoSliderValue()
return GetCurrentSliderValue()
EndFunction

void function SayWindowTypeAndText(handle hWnd)
if (inHjDialog () || UserBufferIsActive ())
	return builtin::SayWindowTypeAndText(hWnd)
endIf
if GetWindowClass(hWnd) == cWc_dlg32770 then
	if StringCompare(GetWindowName(hWnd),wn_AboutWindowsMediaPlayer) == 0 then
		IndicateControlType(wt_dialog,wn_AboutWindowsMediaPlayer,GetAboutDialogStaticText())
		return
	EndIf
EndIf
SayWindowTypeAndText(hWnd)
EndFunction

void function SayFocusedWindow()
if GlobalObjectContainerGroupName != GlobalPrevObjectContainerGroupName then
	SetUserFriendlyGroupName()
	if GlobalObjectUserFriendlyGroupName then
		Say(GlobalObjectUserFriendlyGroupName,ot_control_group_name)
	EndIf
EndIf
SayFocusedWindow()
EndFunction

int function IsWMPMainScreenUngroupedButton()
if !IsPcCursor()
|| GlobalMenuMode
|| UserBufferIsActive()
|| DialogActive() then
	return false
EndIf
if GetWindowClass(GetFocus()) != wc_CWmpControlCntr then
	return false
EndIf
if GetObjectSubtypeCode() == wt_ReadOnlyEdit then
	if GetObjectSubtypeCode(false,1) == wt_unknown then
		return true
	EndIf
EndIf
return false
EndFunction

int function IsToggleControl()
var
	string sName
let sName = GetObjectName()
return StringCompare(sName,objn_ToggleControl) == 0
	|| StringCompare(sName,objn_QuietMode) == 0
	|| StringCompare(sName,objn_GraphicEqualizer) == 0
EndFunction

int function IsWMPMainScreenToggleControl()
if !IsPcCursor()
|| GlobalMenuMode
|| UserBufferIsActive()
|| DialogActive() then
	return false
EndIf
if GetObjectSubtypeCode() != wt_ReadOnlyEdit then
	return false
EndIf
if IsToggleControl() then
	return true
EndIf
return false
EndFunction

int function IsWMPMainScreenSlider()
var
	int iSubtype
if !IsPcCursor()
|| GlobalMenuMode
|| UserBufferIsActive()
|| DialogActive() then
	return false
EndIf
let iSubtype = GetObjectSubtypeCode()
if iSubtype != wt_LeftRightSlider
&& iSubtype != wt_UpDownSlider then
	return false
EndIf
return true
EndFunction

string function GetWMPSliderValue()
var
	string sName
let sName = GetObjectName()
if StringCompare(sName,objn_Seek) == 0 then
	return GetSeekSliderValue()
ElIf StringCompare(sName,objn_Volume) == 0 then
	return GetVolumeSliderValue()
ElIf StringCompare(sName,objn_CrossFadeSlider) == 0 then
	return GetCrossFadeSliderValue()
ElIf StringRight(sName,StringLength(objn_EqualizerSliderNameSuffix)) == objn_EqualizerSliderNameSuffix then
	return GetEqualizerSliderValue()
ElIf StringCompare(GlobalObjectContainerGroupName,objn_SpeedSliderGroup) == 0 then
	return GetSpeedSliderValue()
ElIf StringCompare(GlobalObjectContainerGroupName,objn_Unnamed2)
|| StringCompare(GlobalObjectContainerGroupName,objn_BackHueSlider) == 0
|| StringCompare(GlobalObjectContainerGroupName,objn_BackSatSlider) == 0 then
	return GetVideoSliderValue()
else
	return cscNull
EndIf
EndFunction

int function TouchTapSlider(object element, int direction, optional int speakValue)
var int retVal = TouchTapSlider(element, direction, false)
if !retVal
|| (StringCompare(GetObjectName(),objn_Volume) == 0 && IsMediaPlaying())
	return retVal
endIf
Say(GetWMPSliderValue(),ot_word)
return retVal 
EndFunction

void function SayCharacterUnit(int UnitMovement)
var
	handle hWnd,
	string sClass,
	string sName,
	int nState,
	int count,
	int i
if (inHjDialog () || userBufferIsActive ())
	return SayCharacterUnit(UnitMovement)
endIf
if IsPCCursor()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	let hWnd = GetFocus()
	let sClass = GetWindowClass(hWnd)
	if sClass == cWcListView then
		;move liniarly through lists, including those showing as grid:
		let count = lvGetItemCount(hWnd)
		let i = lvGetFocusItem(hWnd)
		if UnitMovement == UnitMove_Prior
		&& i > 1 then
			lvSetFocusItem(hWnd,i-1)
		ElIf UnitMovement == UnitMove_Next
		&& i < count then
			lvSetFocusItem(hWnd,i+1)
		EndIf
		return
	ElIf sClass == cwc_SysTreeView32 then
		;the library tree requires a double click to open/collapse
		if StringCompare(GlobalObjectContainerGroupName,objn_LibraryContainerGroup) == 0 then
			let nState = GetControlAttributes()
			if(UnitMovement == UnitMove_Next && nState & CTRL_CLOSED)
			||(UnitMovement == UnitMove_Prior && nState & CTRL_OPENED) then
				SaveCursor()
				RouteJAWSToPC()
				LeftMouseButton()
				LeftMouseButton()
				RestoreCursor()
				return
			EndIf
		EndIf
	elif IsWMPMainScreenSlider() then
		if UnitMovement == UnitMove_Next then
			NextCharacter()
		ElIf UnitMovement == UnitMove_Prior then
			PriorCharacter()
		EndIf
		if StringCompare(GetObjectName(),objn_Volume) == 0
		&& IsMediaPlaying() then
			return
		EndIf
		Say(GetWMPSliderValue(),ot_word)
		return
	EndIf
EndIf
SayCharacterUnit(UnitMovement)
EndFunction

void function SayWordUnit(int UnitMovement)
var
	string sName
if (inHjDialog () || userBufferIsActive ())
	return SayWordUnit(UnitMovement)
endIf
if IsWMPMainScreenSlider() then
	if StringCompare(GetObjectName(),objn_Volume) == 0
	&& IsMediaPlaying() then
		return
	EndIf
	Say(GetWMPSliderValue(),ot_word)
	return
EndIf
SayWordUnit(UnitMovement)
EndFunction

script SayPriorLine()
var
	handle hWnd,
	string sName,
	int i
if (inHjDialog () || userBufferIsActive ())
	performScript SayPriorLine()
	return
endIf
if IsPCCursor()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	let hWnd = GetFocus()
	if GetWindowClass(hWnd) == cWcListView then
		;move liniarly through lists, including those showing as grid:
		let i = lvGetFocusItem(hWnd)
		if i > 1 then
			lvSetFocusItem(hWnd,i-1)
		EndIf
		return
	elif IsWMPMainScreenSlider() then
		PriorLine()
		if StringCompare(GetObjectName(),objn_Volume) == 0
		&& IsMediaPlaying() then
			return
		EndIf
		Say(GetWMPSliderValue(),ot_word)
		return
	EndIf
EndIf
PerformScript SayPriorLine()
EndScript

script SayNextLine()
var
	handle hWnd,
	string sName,
	int count,
	int i
if (inHjDialog () || userBufferIsActive ())
	performScript SayNextLine()
	return
endIf
if IsPCCursor()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	let hWnd = GetFocus()
	if GetWindowClass(hWnd) == cWcListView then
		;move liniarly through lists, including those showing as grid:
		let count = lvGetItemCount(hWnd)
		let i = lvGetFocusItem(hWnd)
		if i < count then
			lvSetFocusItem(hWnd,i+1)
		EndIf
		return
	elif IsWMPMainScreenSlider() then
		NextLine()
		if StringCompare(GetObjectName(),objn_Volume) == 0
		&& IsMediaPlaying() then
			return
		EndIf
		Say(GetWMPSliderValue(),ot_word)
		return
	EndIf
EndIf
PerformScript SayNextLine()
EndScript

void function HomeEndMovement(int UnitMovement)
var
	handle hWnd,
	string sName,
	int count,
	int i
if (inHjDialog () || userBufferIsActive ())
	return HomeEndMovement(UnitMovement)
endIf
if IsPCCursor()
&& !GlobalMenuMode
&& !UserBufferIsActive() then
	let hWnd = GetFocus()
	if GetWindowClass(hWnd) == cWcListView then
		let count = lvGetItemCount(hWnd)
		let i = lvGetFocusItem(hWnd)
		if UnitMovement == UnitMove_First
		&& i > 1 then
			lvSetFocusItem(hWnd,1)
		ElIf UnitMovement == UnitMove_Last
		&& i < count then
			lvSetFocusItem(hWnd,count)
		EndIf
		return
	EndIf
EndIf
HomeEndMovement(UnitMovement)
EndFunction

int function WMPMainScreenSliderValueSpoken()
if !IsWMPMainScreenSlider() then
	return false
EndIf
Say(GetWMPSliderValue(),ot_word)
return true
EndFunction

int function SayWMPMainScreenCustomElement(int UnitType)
var
	string sClass,
	string sLVItemName,
	string sName,
	string sDesc,
	int iLength
;These if blocks must fall in a certain order to get the sliders spoken correctly.
;this if block must precede the one following it:
if(IsWMPMainScreenSlider() && UnitType == unit_current_line)
|| IsWMPMainScreenToggleControl()
|| IsWMPMainScreenUngroupedButton() then
	SayObjectTypeAndText()
	return true
EndIf
;and this if block must precede the one following it:
if WMPMainScreenSliderValueSpoken() then
	;note that here only the value was spoken, not the entire control.
	return true
EndIf
;It is now safe to make more general tests.
let sClass = GetWindowClass(GetFocus())
if sClass == wc_WMPAppHost
|| sClass == wc_CWmpControlCntr then
	SayObjectTypeAndText()
	return true
ElIf sClass == cWc_Toolbar
|| sClass == wc_edit then
	if GetWindowClass(GetParent(GetParent(GetParent(GetFocus())))) == wc_WMPAppHost then
		SayObjectTypeAndText()
		return true
	EndIf
elif sClass == cwcListView then
	if StringCompare(GlobalObjectContainerGroupName,objn_LibraryContainerGroup) == 0 then
		if UnitType	 == Unit_Current_Line then
			let sLVItemName = GetObjectDescription (TRUE)
			if ! StringIsBlank (sLVItemName) then
				say (sLVItemName, OT_LINE)
				if controlCanBeChecked () then
					if ControlIsChecked () then
						indicateControlState (WT_CHECKBOX, CTRL_CHECKED)
					else
						indicateControlState (WT_CHECKBOX, CTRL_UNCHECKED)
					endIf
				endIf
			else
				SayObjectActiveItem(true)
			endIf
			if IsListItemCurrentlyPlayingMedia() then
				SayUsingVoice(VCTX_MESSAGE,msgCurrentlyPlaying,ot_line)
			EndIf
			return true
		elif UnitType	 == Unit_Current_Word then
			let sName = GetObjectName()
			if sName then
				let sDesc = GetObjectDescription()
				if StringContains(sName,sDesc) then
					;Just say the name, don't include the description information:
					let iLength = StringLength(sc_MediaItem_ObjNameDescSeparator)
					let sName = StringDiff(sName,sDesc)
					if StringRight(sName,iLength) == sc_MediaItem_ObjNameDescSeparator then
						let sName = StringChopRight(sName,iLength)
					EndIf
				EndIf
				Say(sName,ot_line)
				return true
			EndIf
		EndIf
	EndIf
EndIf
return false
EndFunction

script SayCharacter()
if (inHjDialog () || userBufferIsActive ())
	performScript SayCharacter()
	return
endIf
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	if SayWMPMainScreenCustomElement(unit_current_character) then
		return
	EndIf
	if DialogActive() then
		if !GetObjectSubtypeCode() then
			;these are either buttons or links:
			IndicateControlType(wt_button,GetObjectName())
			return
		EndIf
	EndIf
EndIf
PerformScript SayCharacter()
EndScript


script SayWord()
var
	string sName
if (inHjDialog () || userBufferIsActive ())
	performScript SayWord()
	return
endIf
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	if SayWMPMainScreenCustomElement(unit_current_word) then
		return
	EndIf
	if DialogActive() then
		if !GetObjectSubtypeCode() then
			;these are either buttons or links:
			IndicateControlType(wt_button,GetObjectName())
			return
		EndIf
	EndIf
EndIf
PerformScript SayWord()
EndScript

script SayLine ()
if (inHjDialog () || userBufferIsActive ())
	performScript SayLine ()
	return
endIf
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	if SayWMPMainScreenCustomElement(unit_current_line) then
		return
	EndIf
	if DialogActive() then
		if !GetObjectSubtypeCode() then
			;these are either buttons or links:
			IndicateControlType(wt_button,GetObjectName())
			return
		EndIf
	EndIf
EndIf
PerformScript SayLine()
EndScript

script SayWindowPromptAndText()
if GlobalObjectUserFriendlyGroupName then
	Say(GlobalObjectUserFriendlyGroupName,OT_CONTROL_GROUP_NAME)
EndIf
PerformScript SayWindowPromptAndText()
EndScript

Script MoveToCurrentPlayList()
var
	handle hWnd
if GlobalMenuMode
|| UserBufferIsActive()
|| DialogActive() then
	return
EndIf
let hWnd = FindWindowWithClassAndID(GetRealWindow(GetFocus()),cscListviewClass,id_BasketListView)
If hWnd
&& IsWindowVisible(hWnd) Then
	SetFocus(hWnd)
Else
	Say(msgCurrentPlayListNotFound,OT_ERROR)
EndIf
EndScript

Script MoveToMainTree()
var
	handle hWnd
if GlobalMenuMode
|| UserBufferIsActive()
|| DialogActive() then
	return
EndIf
let hWnd = FindWindowWithClassAndID(GetRealWindow(GetFocus()),cwc_SysTreeView32,id_LibraryTreeView)
If hWnd
&& IsWindowVisible(hWnd) Then
	SetFocus(hWnd)
Else
	Say(msgMainTreeNotFound,OT_ERROR)
EndIf
EndScript

Script MutePlayer()
TypeKey(ks_Mute)
EndScript

script VolumeDown()
TypeKey(ks_VolumeDown)
EndScript

script VolumeUp()
TypeKey(ks_VolumeUp)
EndScript

Script ScriptFileName()
ScriptAndAppNames(FormatString(msgWMPAppName,IntToString(GetProgramVersion(GetAppFilePath()))))
EndScript

Script HotKeyHelp()
var
	int iSubType,
	int iObjSubType,
	string SWinName,
	string SWinClass,
	string sObjName,
	string sKey_MoveToMainTree,
	string sKey_MoveToCurrentPlayList
if TouchNavigationHotKeys() then
	return
endIf
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
let SWinClass = GetWindowClass(GlobalFocusWindow)
let iSubType=GetWindowSubTypeCode(GlobalFocusWindow)
let sWinName=GetWindowName(GlobalFocusWindow)
let iObjSubType=GetObjectSubTypeCode(TRUE)
let sObjName=GetObjectName(TRUE)
If !iSubType Then
	let iSubType=iObjSubType
EndIf
If UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
let sKey_MoveToMainTree = GetScriptKeyName("MoveToMainTree")
let sKey_MoveToCurrentPlayList = GetScriptKeyName("MoveToCurrentPlayList")
SayMessage(OT_USER_BUFFER,
	FormatString(msgHotkeyHelp_L,sKey_MoveToMainTree,sKey_MoveToCurrentPlayList),
	FormatString(msgHotkeyHelp_S,sKey_MoveToMainTree,sKey_MoveToCurrentPlayList))
EndScript

int function BrailleCallbackObjectIdentify()
var
	int iSubtype
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
if StringCompare(GlobalObjectContainerGroupName,objn_LibraryContainerGroup) == 0 then
	let iSubtype = GetObjectSubtypeCode()
	if iSubtype == wt_button
	|| iSubtype == wt_menu then
		return iSubtype
	EndIf
EndIf
let iSubtype = GetObjectSubtypeCode()
if iSubType == wt_ReadOnlyEdit then
	if IsToggleControl() then
		return wt_button
	EndIf
	if GetWindowClass(GetFocus()) == wc_CWmpControlCntr then
		if GetObjectSubtypeCode(false,1) == wt_unknown then
			return wt_button
		EndIf
	EndIf
EndIf
return BrailleCallbackObjectIdentify()
EndFunction

int Function BrailleAddObjectContainerName(int iSubTypeCode)
If !GlobalMenuMode
|| !DialogActive() then
	if GlobalObjectUserFriendlyGroupName then
		BrailleAddString(GlobalObjectUserFriendlyGroupName,0,0,0)
	EndIf
	Return TRUE
EndIf
Return BrailleAddObjectContainerName(iSubTypeCode)
EndFunction

int function BrailleAddObjectName(int iSubtype)
var
	string sName
if IsTouchCursor() then
	return BrailleAddObjectName(iSubtype)
endIf
if iSubtype == wt_ListView then
	if GetFocusWMPListType() != WMPListType_Invalid then
		BrailleAddString(gsCurrentPlayListName,0,0,0)
		return true
	EndIf
ElIf iSubtype == wt_button then
	if StringCompare(GlobalObjectContainerGroupName,objn_CustomButtonsGroup) == 0 then
		let sName = GetObjectName()
		if !sName then
			BrailleAddString(msgWindowsMediaPlayerWebsiteBtnName,GetCursorCol(),GetCursorRow(),0)
			return true
		EndIf
	EndIf
	let sName = GetObjectName()
	if StringCompare(sName,objn_ToggleControl) == 0 then
		BrailleAddString(GetObjectValue(),GetCursorCol(),GetCursorRow(),0)
		return true
	ElIf StringCompare(sName,objn_QuietMode) == 0
	|| StringCompare(sName,objn_GraphicEqualizer) == 0 then
		BrailleAddString(GetObjectName()+cscSpace+GetObjectValue(),GetCursorCol(),GetCursorRow(),0)
		return true
	ElIf StringCompare(sName,objn_HideBasketBtn) == 0 then
		BrailleAddString(msgHideBasketBtnUserFriendlyName,GetCursorCol(),GetCursorRow(),0)
		return true
	EndIf
EndIf
return BrailleAddObjectName(iSubtype)
EndFunction

int Function BrailleAddObjectValue(int iSubTypeCode)
if IsTouchCursor() then
	return BrailleAddObjectValue(iSubTypeCode)
endIf
if iSubtypeCode == wt_LeftRightSlider
|| iSubtypeCode == wt_UpDownSlider then
	if IsWMPMainScreenSlider() then
		BrailleAddString(GetWMPSliderValue(),0,0,0)
		return true
	EndIf
ElIf iSubtypeCode == wt_ReadOnlyEdit then
	if StringCompare(GlobalObjectContainerGroupName,objn_MarqueeGroup) == 0 then
		BrailleAddString(GetObjectValue(),0,0,0)
		return true
	ElIf StringCompare(GlobalObjectContainerGroupName,objn_SettingsGroup) == 0 then
		BrailleAddString(GetObjectValue(),0,0,0)
		return true
	EndIf
ElIf iSubtypeCode == wt_ListView then
	if StringCompare(GlobalObjectContainerGroupName,objn_LibraryContainerGroup) == 0 then
		if IsListItemCurrentlyPlayingMedia() then
			BrailleAddString(cmsgBrailleChecked1_L,0,0,0)
		EndIf
		BrailleAddString(GetObjectName(),GetCursorCol(),GetCursorRow(),GetCharacterAttributes())
		return true
	EndIf
EndIf
return BrailleAddObjectValue(iSubTypeCode)
EndFunction

script CopySelectedTextToClipboard()
var
	int iWmplType
if !(GetRunningFSProducts() & product_JAWS) then
	SayCurrentScriptKeyLabel()
	return
endIf
let DragFromListX = 0
let DragFromListY = 0
let iWmplType = GetFocusWMPListType()
;Copy in the library list will set the point from which a selection may be dragged:
if iWmplType == WMPListType_LibraryTreeItemDragContent then
	let DragFromListX = GetCursorCol()
	let DragFromListY = GetCursorRow()
	SayMessage(ot_JAWS_message,msgPreparedToDragFromList_L,msgPreparedToDragFromList_S)
	return
ElIf iWmplType == WMPListType_LibraryTreeItemNoDragContent then
	Say(msgErr_ItemCannotBeDragged,ot_error)
	return
EndIf
PerformScript CopySelectedTextToClipboard()
EndScript

script PasteFromClipboard()
if !(GetRunningFSProducts() & product_JAWS) then
	SayCurrentScriptKeyLabel()
	return
endIf
;Paste in the library basket list will attempt to drag the previously selected item and drop it:
if GetFocusWMPListType() == WMPListType_LibraryBasket then
	if !DragFromListX || !DragFromListY then
		Say(msgErr_NothingToDragAndDrop,ot_error)
		return
	EndIf
	DragItemWithMouse(DragFromListX,DragFromListY,GetCursorCol(),GetCursorRow())
	SayMessage(ot_JAWS_message,msgDroppingInList_L,msgDroppingInList_S)
	;Now set the focus item in the list
	Delay(3)
	SaveCursor()
	JAWSCursor()
	LeftMouseButton()
	RestoreCursor()
	return
EndIf
PerformScript PasteFromClipboard()
EndScript

int function InCreateAutoPlayListCriteriaList()
return DialogActive()
	&& StringCompare(GetWindowName(GetRealWindow(GlobalFocusWindow)),wn_NewAutoPlaylist) == 0
	&& GetControlID(GlobalFocusWindow) == id_AutoPlaylistCriteriaListview
EndFunction

Script Enter()
var
	handle hWnd,
	int left,
	int right,
	int top,
	int bottom
if (inHjDialog () || userBufferIsActive ())
	performScript Enter()
	return
endIf
let hWnd = GetFocus()
if StringCompare(GetWindowName(GetRealWindow(hWnd)),wn_NewAutoPlaylist) == 0 then
	if GetWindowClass(hWnd) == cwcListView
	&& GetControlID(hWnd) == id_AutoPlaylistCriteriaListview then
		;User must click here to add or edit criteria:
		lvGetItemRect(hWnd,lvGetFocusItem(hWnd),left,right,top,bottom)
		SaveCursor()
		JAWSCursor()
		MoveTo((left+right)/2,(top+bottom)/2)
		LeftMouseButton()
		RestoreCursor()
		return
	EndIf
EndIf
SayCurrentScriptKeyLabel()
enterKey()
EndScript

script SayCurrentlyPlayingTrack()
Say(GetCurrentlyPlayingTrackName(),ot_user_requested_information)
EndScript

script ApplicationMenu()
var
	int MenuMode
let MenuMode = GetMenuMode()
if !MenuMode then
	TypeCurrentScriptKey()
ElIf MenuMode == 1 then
	TypeKey("Escape")
else
	Delay(3)
	TypeKey("Escape")
	TypeKey("Escape")
EndIf
EndScript

string function GetCustomTutorMessage()
var
	int iWMPListType,
	string sMessage
let iWMPListType = GetFocusWMPListType()
if iWMPListType == WMPListType_LibraryTreeItemDragContent then
	return FormatString(msgTutorialHelp_LibraryDragFromList,msgListView,GetScriptKeyName("CopySelectedTextToClipboard"))
ElIf iWMPListType == WMPListType_LibraryBasket then
	return FormatString(msgTutorialHelp_LibraryDropInList,msgListView,GetScriptKeyName("PasteFromClipboard"))
EndIf
return cscNull
EndFunction

Script ScreenSensitiveHelp ()
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if IsSameScript () then
	AppFileTopic(topic_Windows_Media_Player)
	return
endIf
PerformScript ScreenSensitiveHelp ()
EndScript

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd,
	handle hPrior,
	string sRealName,
	string sName,
	string sValue,
	int iSubType,
	int iWMPListType
let hWnd = GetCurrentWindow()
let iSubType = GetObjectSubtypeCode()
if StringCompare(GlobalObjectContainerGroupName,objn_RewindSeekFFwdGroup) == 0 then
	if iSubType == WT_LEFTRIGHTSLIDER then
		SayControlEx(hWnd,GetObjectName(),msgType_LeftRightSlider,cscSpace,cscSpace,cscSpace,GetSeekSliderValue())
		return
	EndIf
ElIf StringCompare(GlobalObjectContainerGroupName,objn_MarqueeGroup) == 0 then
	if iSubtype == wt_ReadOnlyEdit then
		SayControlEx(hWnd,GetObjectName(),GetObjectSubtype(),cscSpace,cscSpace,cscSpace,GetObjectValue())
		return
	EndIf
ElIf StringCompare(GlobalObjectContainerGroupName,objn_TransportsInnerGroup) == 0 then
	if iSubtype == wt_LeftRightSlider then
		SayControlEx(hWnd,GetObjectName(),msgType_LeftRightSlider,cscSpace,cscSpace,cscSpace,GetObjectValue())
		return
	EndIf
ElIf StringCompare(GlobalObjectContainerGroupName,objn_CustomButtonsGroup) == 0 then
	if iSubtype == wt_button then
		let sName = GetObjectName()
		if !sName then
			IndicateControlType(wt_button,msgWindowsMediaPlayerWebsiteBtnName)
			return
		EndIf
	EndIf
ElIf StringCompare(GlobalObjectContainerGroupName,objn_MainGroup) == 0 then
	if !iSubtype then
		Say(GetObjectName(),ot_control_name)
	else
		let sName = GetObjectName()
		if sName == objn_HideBasketBtn then
			let sName = msgHideBasketBtnUserFriendlyName
		EndIf
		IndicateControlType(iSubtype,sName)
	EndIf
	return
ElIf StringCompare(GlobalObjectContainerGroupName,objn_LibraryContainerGroup) == 0 then
	if iSubtype == wt_menu then
		IndicateControlType(wt_button,FormatString(msgNowPlayingMenuButtonName,GetObjectName()))
		return
	ElIf iSubtype == Wt_ListView
	|| GetWindowClass(hWnd) == cWcListView then
		let iWmpListType = GetFocusWMPListType()
		if iWmpListType == WMPListType_LibraryBasket then
			let sName = GetWindowTextEx(GetPriorWindow(GetPriorWindow(hWnd)),0,0)
			if !sName then
				let sName = msgBasketListViewUserFriendlyName
			EndIf
		ElIf iWmpListType == WMPListType_NowPlaying then
			let sName = GetCurrentPlaylistName()
		elif iWMPListType == WMPListType_LibraryTreeItemDragContent
		|| iWMPListType == WMPListType_LibraryTreeItemNoDragContent then
			let sName = tvGetFocusItemText(GetNextWindow(hWnd))
			if !sName then
				let sName = GetWindowName(hWnd)
			EndIf
		EndIf
		let gsCurrentPlayListName = sName
		BrailleRefresh()
		SayControlEx(hWnd,gsCurrentPlayListName)
		if IsListItemCurrentlyPlayingMedia() then
			SayUsingVoice(VCTX_MESSAGE,msgCurrentlyPlaying,ot_line)
		EndIf
		return
	ElIf iSubtype == wt_TreeViewItem then
		SayControlEx(hWnd,GetWindowName(hWnd))
		return
	EndIf
ElIf StringCompare(GlobalObjectContainerGroupName,objn_SettingsGroup) == 0 then
	SayControlEx(hWnd,GetObjectName(),GetObjectSubtype(),cscSpace,cscSpace,cscSpace,GetObjectValue())
	return
ElIf StringCompare(GlobalObjectContainerGroupName,objn_CrossFadeSlidersGroup) == 0 then
	SayControlEx(hWnd,GetObjectName(),msgType_LeftRightSlider,cscSpace,cscSpace,cscSpace,GetCrossFadeSliderValue())
	return
ElIf StringCompare(GlobalObjectContainerGroupName,objn_EqualizerGroup) == 0 then
	let sName = GetObjectName()
	let sValue = GetObjectValue()
	if StringCompare(sName,sValue) != 0 then
		IndicateControlType(wt_button,getObjectName(),GetObjectValue())
	else
		IndicateControlType(wt_button,getObjectName(),cscSpace)
	EndIf
	return
ElIf StringCompare(GlobalObjectContainerGroupName,objn_EqualizerSliderGroup) == 0 then
	if iSubtype == wt_UpDownSlider then
		SayControlEx(hWnd,GetEqualizerSliderName(),msgType_UpDownSlider,cscSpace,cscSpace,cscSpace,GetEqualizerSliderValue())
		return
	EndIf
ElIf StringCompare(GlobalObjectContainerGroupName,objn_SpeedSliderGroup) == 0 then
	if iSubtype == wt_LeftRightSlider then
		SayControlEx(hWnd,GetObjectName(),msgType_LeftRightSlider,cscSpace,cscSpace,cscSpace,GetSpeedSliderValue())
		return
	EndIf
ElIf StringLeft(GlobalObjectContainerGroupName,StringLength(objn_UnnamedPrefix)) == objn_UnnamedPrefix then
	if StringCompare(GlobalObjectContainerGroupName,objn_Unnamed2) == 0 then
		if iSubtype == wt_LeftRightSlider then
			SayControlEx(hWnd,GetVideoSliderName(),msgType_LeftRightSlider,cscSpace,cscSpace,cscSpace,GetVideoSliderValue())
			return
		EndIf
	EndIf
ElIf StringCompare(GlobalObjectContainerGroupName,objn_BackHueSlider) == 0
|| StringCompare(GlobalObjectContainerGroupName,objn_BackSatSlider) == 0 then
	SayControlEx(hWnd,GetObjectName(),msgType_LeftRightSlider,cscSpace,cscSpace,cscSpace,GetVideoSliderValue())
	return
EndIf
if IsWMPMainScreenToggleControl() then
	let sName = GetObjectName()
	if StringCompare(sName,objn_QuietMode) == 0
	|| StringCompare(sName,objn_GraphicEqualizer) == 0 then
		IndicateControlType(wt_button,sName+cscSpace+GetObjectValue(),cscSpace)
	else
		IndicateControlType(wt_button,GetObjectValue(),cscSpace)
	EndIf
	return
ElIf IsWMPMainScreenUngroupedButton() then
	IndicateControlType(wt_button,GetObjectValue(),cscSpace)
	return
EndIf
if DialogActive() then
	if !iSubtype then
		;these are either buttons or links:
		IndicateControlType(wt_button,GetObjectName())
		return
	EndIf
	let sRealName = GetWindowName(GetRealWindow(hWnd))
	if StringCompare(sRealName,wn_Properties) == 0 then
		let sName = GetWindowName(hWnd)
		if StringCompare(sName,wn_Properties_Location) == 0
		|| StringCompare(sName,wn_Properties_Description) == 0 then
			;these are multi-line edits, we must force them to read:
			IndicateControlType(iSubtype,sName,GetWindowTextEx(hWnd,0,0))
			return
		EndIf
	ElIf StringCompare(sRealName,wn_Options) == 0 then
		if iSubtype == wt_ListView then
			let hPrior = GetPriorWindow(hWnd)
			if GetWindowSubtypeCode(hPrior) == wt_static then
				SayControlEx(hWnd,GetWindowName(hPrior))
				return
			EndIf
		EndIf
	EndIf
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

Int Function ShouldInvalidateOCRDataOnFocusChange ()
	return (FALSE) ; No OCR components run at Runtime.
EndFunction

void Function OCRCompletedEvent (Int iJobID, Int iResult)
If iJobID == GlobalOCRJobID
	GlobalOCRJobID = 0
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRFinished_L, MSG_OCRFinished_S)
		Pause ()
		If Not iResult
			SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRGotNoText_L, MSG_OCRGotNoText_S)
			CancelLayeredKeySequence ()
			collectionRemoveAll (Rect_OCR)
			Return
		EndIf
		InvalidateCachedCursor()
		PerformScript JAWSCursor()
		SetRestrictionToRect (Rect_OCR.left, Rect_OCR.top, Rect_OCR.right, Rect_OCR.bottom)
		collectionRemoveAll (Rect_OCR)
EndIf
CancelLayeredKeySequence ()
EndFunction

Script RecognizeRealWindow ()
var
	Handle hCurrent = GetCurrentWindow (),
	Handle hReal = GetRealWindow (hCurrent),
	int bRectRecognized,
	int iAppLeft, int iAppTop, int iAppRight, int iAppBottom,
	int iRealLeft, int iRealTop, int iRealRight, int iRealBottom,
	Int iLeft,
	Int iRight,
	Int iBottom,
	Int iTop,
	Int iPrimary = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int iSecondary = ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int useMicrosoftOcr = ReadSettingInteger (section_OCR, hKey_UseMicrosoftRecognitionLanguageForScreenArea, 0, FT_CURRENT_JCF),
	Int microsoftOcrLanguage = ReadSettingInteger (section_OCR, hKey_MicrosoftRecognitionLanguage, 1033, FT_CURRENT_JCF),
	Int iCanRecognize
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize == OCR_SUCCESS
	bRectRecognized = GetWindowRect (getAppMainWindow (getFocus ()), iAppLeft, iAppRight, iAppTop, iAppBottom) > 0
		&& GetWindowRect (hReal, iRealLeft, iRealRight, iRealTop, iRealBottom)
	If bRectRecognized then
		;set to biggest rectangle in width and height:
		iLeft = min (iRealLeft, iAppLeft)
		iTop = min (iRealTop, iAppTop)
		iRight = max (iRealRight, iAppRight)
		iBottom = max (iRealBottom, iAppBottom)
		Rect_OCR = new collection
		Rect_OCR.left = iLeft
		Rect_OCR.top = iTop
		Rect_OCR.right = iRight
		Rect_OCR.bottom = iBottom
		giOCRActiveCursor = ON
		GlobalOCRJobID = OCRScreenArea (iLeft, iTop, iRight, iBottom, iPrimary, iSecondary, useMicrosoftOcr, microsoftOcrLanguage)
		SayScreenOcrStarted(useMicrosoftOcr)
		Return
	EndIf
Else
	SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
EndIf
EndScript

Script RecognizeControl ()
var
	Handle hCurrent = GetCurrentWindow (),
	Handle hReal = GetRealWindow (hCurrent),
	Int iLeft,
	Int iRight,
	Int iBottom,
	Int iTop,
	Int iPrimary = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int iSecondary = ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int useMicrosoftOcr = ReadSettingInteger (section_OCR, hKey_UseMicrosoftRecognitionLanguageForScreenArea, 0, FT_CURRENT_JCF),
	Int microsoftOcrLanguage = ReadSettingInteger (section_OCR, hKey_MicrosoftRecognitionLanguage, 1033, FT_CURRENT_JCF),
	Int iCanRecognize
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
Rect_OCR = new collection
Rect_OCR.left = getWindowLeft (hReal)
Rect_OCR.top = getWindowTop (hReal)
Rect_OCR.right = getWindowRight (hReal)
Rect_OCR.bottom = getWindowBottom (hReal)
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize == OCR_SUCCESS

	If GetWindowRect (hCurrent, iLeft, iRight, iTop, iBottom)
		giOCRActiveCursor = ON
		GlobalOCRJobID = OCRScreenArea (iLeft, iTop, iRight, iBottom, iPrimary, iSecondary, useMicrosoftOcr, microsoftOcrLanguage)
		SayScreenOcrStarted(useMicrosoftOcr)
		Return
	EndIf
Else
	SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
EndIf
EndScript

Script RecognizeScreen ()
var
	Int iRight = ScreenGetWidth (),
	Int iBottom = ScreenGetHeight (),
	Int iPrimary = ReadSettingInteger (section_OCR, hKey_PrimaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int iSecondary = ReadSettingInteger (section_OCR, hKey_SecondaryRecognitionLanguage, 1033, FT_DEFAULT_JCF),
	Int useMicrosoftOcr = ReadSettingInteger (section_OCR, hKey_UseMicrosoftRecognitionLanguageForScreenArea, 0, FT_CURRENT_JCF),
	Int microsoftOcrLanguage = ReadSettingInteger (section_OCR, hKey_MicrosoftRecognitionLanguage, 1033, FT_CURRENT_JCF),
	Int iCanRecognize
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
Rect_OCR = new collection
Rect_OCR.left = 0
Rect_OCR.top = 0
Rect_OCR.right = iRight
Rect_OCR.bottom = iBottom;
If GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRAlreadyInProgress_L, MSG_OCRAlreadyInProgress_S)
	Return
EndIf
Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize == OCR_SUCCESS
	giOCRActiveCursor = ON
	GlobalOCRJobID = OCRScreenArea (0, 0, iRight, iBottom, iPrimary, iSecondary, useMicrosoftOcr, microsoftOcrLanguage)
	SayScreenOcrStarted(useMicrosoftOcr)
	Return
Else
	SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
EndIf
EndScript

Script CancelRecognition ()
var
	Int iCanRecognize
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
giOCRActiveCursor = OFF
collectionRemoveAll (Rect_OCR)
If Not GlobalOCRJobID
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRCanNotCancel_L, MSG_OCRCanNotCancel_S)
	Return
EndIf
Let iCanRecognize = CanRecognize ()
If iCanRecognize == OCR_NOT_SUPPORTED
	Return
EndIf
If iCanRecognize == OCR_SUCCESS
CancelOCR (GlobalOCRJobID)
	SayMessage (OT_JAWS_MESSAGE, MSG_OCRCancelled_L, MSG_OCRCancelled_S)
Else
	SayFormattedMessage (OT_JAWS_MESSAGE, MSG_OCRNotInstalled_L, MSG_OCRNotInstalled_S)
EndIf
GlobalOCRJobID = 0
CancelLayeredKeySequence ()
EndScript

script PcCursor ()
giOCRActiveCursor = OFF
PerformScript PcCursor ()
endScript




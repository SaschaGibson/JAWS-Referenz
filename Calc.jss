;Copyright 2010-2017 Freedom Scientific, Inc.
; JAWS script file for Windows 7 and 8 Calculator


include "HJConst.jsh"
include "HJGlobal.jsh"
include "HJHelp.jsh"
include "Common.jsm"
include "Calc.jsh"
;These scripts were renamed from "windows Calculator.*".
;Windows Calculator.jsm is used as the message file here,
;to avoid the need for retranslation of the messages after renaming the script files.
include "Windows Calculator.jsm"


void function AutoFinishEvent()
DeactivateAnyActiveVirtualDisplay()
EndFunction

void function DeactivateAnyActiveVirtualDisplay()
if gbActivateBitsDisplay then
	DeactivateBitsDisplay()
EndIf
EndFunction

void function ActivateAnyRelevantVirtualDisplay()
if GetControlID(GlobalFocusWindow) == cid_BitsDisplayStatic then
	ActivateBitsDisplay()
	return
EndIf
EndFunction

int Function RedisplayPrevField(String sPrevVWN)
If sPrevVWN == vwn_BitsDisplay Then
	ActivateBitsDisplay()
	return true
EndIf
return RedisplayPrevField(sPrevVWN)
EndFunction

void function DeactivateBitsDisplay()
UserBufferDeactivate()
UserBufferClear()
let gbActivateBitsDisplay = false
EndFunction

string function PadPositionIndicators(string sText)
var
	string sLine,
	int i
let i = StringSegmentCount(sText,cscBufferNewLine)
let sText = sText+cscBufferNewLine
while i > 0
	let sLine = StringSegment(sText,cscBufferNewLine,i)
	if sLine == scBitPositions_63_47_32 then
		let sText = StringReplaceSubstrings(sText,scBitPositions_63_47_32,scBitPositions_Padded_63_47_32)
	elif sLine == scBitPositions_31_15_0 then
		let sText = StringReplaceSubstrings(sText,scBitPositions_31_15_0,scBitPositions_Padded_31_15_0)
	elif sLine == scBitPositions_15_0 then
		let sText = StringReplaceSubstrings(sText,scBitPositions_15_0,scBitPositions_Padded_15_0)
	elif sLine == scBitPositions_0 then
		let sText = StringReplaceSubstrings(sText,cscBufferNewLine+scBitPositions_0+cscBufferNewLine,cscBufferNewLine+scBitPositions_Padded_0+cscBufferNewLine)
	EndIf
	let i = i-2
EndWhile
return StringChopRight(sText,1)
EndFunction

void Function ActivateBitsDisplay()
var
	handle hWnd,
	int iLeft,
	int iRight,
	int iTop,
	int iBottom,
	string sText
let hWnd = GetFocus()
if GetControlID(hWnd) != cid_BitsDisplayStatic then
	return
EndIf
EnsureNoUserBufferActive()
GetWindowRect(hWnd,iLeft,iRight,iTop,iBottom)
let sText = GetTextInRect(iLeft,iTop,iRight,iBottom,0,IgnoreColor,IgnoreColor,true)
if !sText then
	return
EndIf
let sText = PadPositionIndicators(sText)
let gbActivateBitsDisplay = true
UserBufferAddText(sText)
UserBufferActivateEx(vwn_BitsDisplay, cScNull, 0, 0)
JawsTopOfFile ()
Say(msgBitsDisplayName,ot_control_name)
endFunction

int Function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
if giScheduledSayCalculatorModeName then
	UnscheduleFunction(giScheduledSayCalculatorModeName )
	let giScheduledSayCalculatorModeName = 0
EndIf
return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function ScreenStabilizedEvent(handle hwndLastScreenWrite)
var
	string sMsg
if gbSayStatisticsListBoxStatusWhenStabilized then
	let gbSayStatisticsListBoxStatusWhenStabilized = false
	let sMsg = GetStatisticsListBoxCountStatus()
	if sMsg then
		Say(sMsg,ot_screen_message)
	EndIf
EndIf
ScreenStabilizedEvent(hwndLastScreenWrite)
EndFunction

Void Function WindowCreatedEvent (handle hWnd, int nLeft, int nTop, int nRight, int nBottom)
if GetWindowClass(hWnd) == cWc_dlg32770 then
	Pause() ;the following test may fail if pause is not used
	let gbWatchForDialogStaticText = (GetWindowHierarchyX(hWnd) >= 5) ;cleared in ProcessSayRealWindowOnFocusChange
EndIf
WindowCreatedEvent (hWnd, nLeft, nTop, nRight, nBottom)
EndFunction

void function ResetFocusToSelectedControl(handle hWnd)
var
	int iSubtype,
	int iCtrl
let iSubtype = getWindowSubtypeCode(hWnd)
if iSubtype == wt_CheckBox
|| iSubtype == wt_ListBox then
	SetFocus(hWnd)
elif iSubtype == wt_RadioButton then
	;These groups of radio buttons cause the result display to change, and therefore the focus to jump to the Result display.
	;Due to timing, FocusChangedEvent may or may not have fired when the radio button gained focus,
	;so we must make sure to find the selected radio button instead of relying on the previous focus to be the selected button.
	let iCtrl = GetControlID(hWnd)
	if iCtrl >= cid_HexRadioButton
	&& iCtrl <= cid_BinRadioButton then
		SetFocus(GetSelectedRadioButton(cid_HexRadioButton))
	elif iCtrl >= cid_QWordRadioButton
	&& iCtrl <= cid_ByteRadioButton then
		SetFocus(GetSelectedRadioButton(cid_QWordRadioButton))
	EndIf
EndIf
EndFunction

void function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	string sClass
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
;periodically, focus will briefly jump to the CalcFrame window then back to the display,
;which will cause extra announcement of the results display if this focus change is not ignored.
let sClass = GetWindowClass(FocusWindow)
if sClass == wc_CalcFrame then
	return
elif sClass == wc_ResultsDisplay
&& GetWindowClass(PrevWindow) == wc_CalcFrame then
	return
endIf
if gbShouldSuppressFocusJumpToResultDisplay then
	;The following test is nested rather than compounded with the outer test
	;because FocusChangedEvent may fire once when the focus briefly lands on a radio button
	;and before it fires again to move focus to the Result display.
	if GetControlID(FocusWindow) == cid_ResultStatic then
		let gbShouldSuppressFocusJumpToResultDisplay = false
		ResetFocusToSelectedControl(PrevWindow)
	EndIf
	return
EndIf
FocusChangedEvent(FocusWindow,PrevWindow)
;following globals are used to keep track of when the mode changes on focus change:
let GlobalPrevFocusParentHierarchyX = GetWindowHierarchyX(GetParent(FocusWindow))
let GlobalResultsParentPrevHierarchyX = GetWindowHierarchyX(GetParent(GetHandle(cid_ResultStatic)))
;Set global used and updated by ValueChangedEvent to speak only the value changed when navigating in a date time picker:
if GetWindowClass(FocusWindow) == CWC_DATETIME_PICKER then
	let gsCurrentSysDateTimePick32Value = GetObjectValue(true)
EndIf
EndFunction

void function SayFocusedWindow()
DeactivateAnyActiveVirtualDisplay()
ActivateAnyRelevantVirtualDisplay()
SayFocusedObject()
EndFunction

void function SayWindowTypeAndText(handle hWnd)
var
	string sViewName
if !InHomeRowMode() then
	if hWnd == GetAppMainWindow(GetFocus()) then
		SayWindowTypeAndText(hWnd)
		SayCalculatorModeName(ot_dialog_name)
		return
	EndIf
EndIf
SayWindowTypeAndText(hWnd)
EndFunction

void function SayCurrentRadioButtonUsingMSAAName()
IndicateControlType(wt_RadioButton,GetObjectName(true))
IndicateControlState(wt_RadioButton,GetControlAttributes())
if !gbShouldSuppressRadioButtonPositionAnnouncement then
	SayUsingVoice(vctx_message,PositionIngroup(),ot_position)
EndIf
let gbShouldSuppressRadioButtonPositionAnnouncement = false
EndFunction

void function SayHistoryListBoxItem()
if gbShouldSuppressListBoxFullAnnouncement then
	;we have forced focus bacdk to the History listbox after navigating,
	;so merely say the value, which is the MSAA name:
	let gbShouldSuppressListBoxFullAnnouncement = false
	;Only speak the current item if navigation actually happened:
	if StringCompare(gsHistoryListPositionBeforeNavigate,PositionInGroup()) != 0 then
		Say(GetObjectName(true),ot_line)
	EndIf
	let gsHistoryListPositionBeforeNavigate = cscNull
else
	;the user has moved focus to the listbox,
	;so give this listbox a name, and speak it:
	Say(msgHistoryListBoxName,ot_control_name)
	SayObjectTypeAndText()
EndIf
EndFunction

int function IsNonBasicDialogActive()
var
	handle hWnd,
	handle hNull
let hWnd = GetFirstChild(GetLastWindow(GetFirstChild(GetFirstChild(GetAppMainWindow(GetFocus())))))
return hWnd != hNull
EndFunction

void function MonitorCalculatorModeChangedOnFocusChange(handle AppWindow, handle RealWindow, handle FocusWindow)
var
	int CalculatorMode
let CalculatorMode = getCalculatorMode()
if CalculatorMode != giCurrentCalculatorMode
&& !IsNonBasicDialogActive() then
	SayCalculatorModeName(ot_dialog_name)
EndIf
let giCurrentCalculatorMode = getCalculatorMode()
EndFunction

void function ProcessSayRealWindowOnFocusChange(handle AppWindow, handle RealWindow, string RealWindowName, handle FocusWindow)
var
	handle hWnd
;Speak the calculator mode if exiting back to the basic controls from one of the dialogs,
;or if both the focus and the mode change:
MonitorCalculatorModeChangedOnFocusChange(AppWindow, RealWindow, FocusWindow)
;WindowCreatedEvent monitors for a non basic dialog to be created, and if so sets the global for the following test:
if gbWatchForDialogStaticText then
	let gbWatchForDialogStaticText = false
	;If one of the ansilary dialogs has opened, speak the static text:
	if IsNonBasicDialogActive() then
		let hWnd = GetNextWindow(GetFirstChild(GetParent(getFocus())))
		if GetWindowSubtypeCode(hWnd) == wt_static then
			IndicateControlType(wt_dialog,GetWindowName(hWnd))
		EndIf
	EndIf
	return
EndIf
ProcessSayRealWindowOnFocusChange(AppWindow, RealWindow, RealWindowName, FocusWindow)
EndFunction

string function GetDateValueChange(string SOriginalDate, string sNewDate)
;assumes that:
;both parameters are valid date strings,
;that the string has three segments separated by the scDateSeparator,
;and that only one segment in the new date is different from the original date.
var
	int i,
	string s
let i = 1
while i <= 3
	let s = StringSegment(sNewDate,scDateSeparator,i)
	if StringCompare(s,StringSegment(sOriginalDate,scDateSeparator,i)) != 0 then
	return s
	EndIf
	let i = i+1
EndWhile
return cscNull
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int bIsFocusObject)
if bIsFocusObject then
	if GetWindowClass(hWnd) == CWC_DATETIME_PICKER then
		Say(GetDateValueChange(gsCurrentSysDateTimePick32Value,sObjValue),ot_line)
		let gsCurrentSysDateTimePick32Value = sObjValue
		return
	EndIf
else
	if nObjType == wt_edit_SpinBox
	&& hWnd == GetNextWindow(GetFocus()) then
;!!!!!!! Bug: This is off by 1 the first time navigation after gaining focus.
		Say(GetObjectValue(true),ot_line)
		return
	EndIf
EndIf
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue,bIsFocusObject)
EndFunction

void function SayCalculatorModeName(int OutputType)
var
	string sModeName
let sModeName = getCalculatorModeName(true)
If sModeName then
	Say( FormatString(msgViewName,sModeName), OutputType)
EndIf
EndFunction

void function SayScheduledCalculatorModeName()
let giScheduledSayCalculatorModeName = 0
SayCalculatorModeName(ot_dialog_name)
EndFunction

handle Function GetHandle(int iControlId)
var
	handle hwnd
let hwnd = FindDescendantWindow (GetAppMainWindow (GetFocus ()), iControlID)
If !hWnd then
	Let hWnd = FindDescendantWindow (GetRealWindow (GetFocus ()), iControlID)
EndIf
If !hWnd then
	Let hWnd = FindDescendantWindow (GetFocus (), iControlID)
EndIf
return hwnd
EndFunction

int function getCalculatorMode()
if IsNonBasicDialogActive()
	return 0
elif GetWindowHierarchyX(GetHandle(cid_DisplayStatic)) > 1 then
	return Mode_Statistics
endIf
var
	handle hWnd = GetLastWindow (GetHandle (cid_MC)),
	;use the count of siblings to determine the mode:
	int LocX = GetWindowHierarchyX (hWnd)
if LocX == 28 then
	return Mode_Standard
elif LocX == 57 then
	return Mode_Scientific
elif LocX == 127 then
	return Mode_Programmer
EndIf
return 0
EndFunction

string function getCalculatorModeName(int bRefresh)
if bRefresh
|| !giCurrentCalculatorMode then
	let giCurrentCalculatorMode = getCalculatorMode()
EndIf
return StringSegment(CalculatorModeList, CalculatorModeListSeparator, giCurrentCalculatorMode)
EndFunction

int function InStatisticsBox()
if giCurrentCalculatorMode != mode_statistics then
	return false
EndIf
return GetControlID(GetFocus()) == cid_StatisticsBoxListBox
EndFunction

string function GetStatisticsListBoxCountStatus()
var
	int iSubtype,
	int nState,
	string sValue
if !IsWindowVisible(GetHandle(cid_StatisticsBoxListBox ))
	return cscNull
EndIf
GetObjectInfoByName(getParent(GetFocus()),"Value",1,iSubtype,nState,sValue)
if !sValue then
	return cscNull
EndIf
return FormatString(msgStatisticsListBoxStatusCountEquals,sValue)
EndFunction

int function IsHistoryActive()
return GetControlID(GetFirstChild(GetNextWindow(GetFirstChild(GetFirstChild(GetAppMainWindow(GetFocus())))))) == cid_HistoryListBox
EndFunction

string function GetNameFromObject(handle hWnd)
var
	object Obj,
	int iObjChild
let obj = GetObjectFromEvent(hWnd, 0, 0, iObjChild)
if !obj then
	return cscNull
EndIf
return obj.accName(iObjChild)
EndFunction

int function GetCalculatorControlInfo(int CtrlId, handle ByRef hWnd, string ByRef sName, int ByRef iType)
var
	object Obj,
	int iObjChild
let hWnd = GetHandle(ctrlID)
let obj = GetObjectFromEvent(hWnd, 0, 0, iObjChild)
if !obj then
	return false
EndIf
let sName = obj.accName(iObjChild)
let iType = GetWindowSubtypeCode(hWnd)
return true
EndFunction

int function IsClickFunctionButtonApplicable()
if UserBufferIsActive()
|| GlobalMenuMode
|| InHJDialog ()  then
	return false
endIf
var int isOnResultsDisplay = (GetControlID(GetFocus()) == cid_ResultStatic)
return giCurrentCalculatorMode || isOnResultsDisplay
EndFunction

int function ClickFunctionButton(int iControlID, int bReadDisplay)
If UserBufferIsActive () then
	;Allows non-virtual key binding to report that the viewer is active,
	;instead of performing the function associated with the key.
	PerformScript SayWindowTitle ()
	Return false
EndIf
var
	int bIgnoreReadDisplayRequest,
	handle hControlWnd,
	string sControlName,
	int iControlType,
	string sDisplay,
	int iDisplayControlID
if !IsClickFunctionButtonApplicable()
	;prevent calculator button scripts being activated
	Say(GetCurrentScriptKeyName (), OT_line)
	TypeCurrentScriptKey ()
	return false
endif
let sDisplay = GetWindowText (GetHandle (cid_DisplayStatic), FALSE)
if iControlID != cid_ClearEntry
&& (StringContains(sDisplay, scError)
|| StringContains (sDisplay, scInvalid)
|| StringContains (sDisplay, scResult)
|| StringContains (sDisplay, scOperation)
|| StringContains (sDisplay, scCannot)) then
	SayMessage(ot_error, sDisplay)
	return false
endif
GetCalculatorControlInfo(iControlId, hControlWnd, sControlName, iControlType)
if IsWindowVisible(hControlWnd) Then
	if IsWindowDisabled(hControlWnd) Then
		SayMessage(ot_error,
			FormatString (msgControlUnavailable_L, sControlName),
			FormatString (msgControlUnavailable_S, sControlName))
		return false
	endif
else
	SayMessage (ot_error,
		FormatString(msgControlNotVisible, sControlName))
	return false
endif
;if the focus is not on the result display and you click a button which causes the result display to update, focus will be moved to the result display.
;In that case, ignore any request to read the display since the focus change will read it anyway.
let bIgnoreReadDisplayRequest = (GetControlID(GetFocus()) != cid_ResultStatic)
TypeCurrentScriptKey ()
SayMessage (ot_control_name, sControlName)
if bReadDisplay
&& !bIgnoreReadDisplayRequest then
	scheduleFunction("ReadCalculatorDisplay", ReadCalculatorDisplayWaitTime)
endIf
refresh()
brailleRefresh()
return true
EndFunction

int Function MagFocusToDisplay ()
var
	handle hWnd,
	int iLeft,
	int iTop,
	int iRight,
	int iBottom,
	int iDisplayLeft,
	int iDisplayTop,
	int iDisplayRight,
	int iDisplayBottom,
	int iMagnified,
	int iDisplayMagnified
If MenusActive () then
	Return FALSE;
EndIf
let hwnd = GetHandle (cid_ResultStatic)
If ! hWnd ||
! IsWindowVisible (hWnd) then
	Return FALSE;
EndIf
Let iMagnified = MagGetMagnifiedRect (iLeft,iTop,iRight,iBottom)
;Let iDisplayLeft = GetWindowLeft (hWnd)
;Get left position at first character of display:
SaveCursor ()
InvisibleCursor ()
MoveToWindow (hWnd);At first real character in display.
Let iDisplayLeft = GetCursorCol ()
RestoreCursor ();Put InvisibleCursor back where it was.
RestoreCursor ();PC Cursor reactivated.
Let iDisplayTop = GetWindowTop (hWnd)
Let iDisplayRight = GetWindowRight(hWnd)
Let iDisplayBottom = GetWindowBottom(hWnd)
If ! iMagnified then
	let iDisplayMagnified = FALSE;
Else
	;Make sure the rect we need is actually inside the magnified rectangle.
	let iDisplayMagnified = (iDisplayLeft >= iLeft &&
	iDisplayTop >= iTop);&&
	;iDisplayRight <= iRight &&
	;iDisplayBottom <= iBottom)
EndIf
If ! iDisplayMagnified then
	GetWindowRect (hWnd, iLeft, iRight, iTop, iBottom)
	;Let iLeft = GetCursorCol ();Should pan things into the center
	;MagSetFocusToPoint (iDisplayLeft, iDisplayTop);Bring down the whole display window, and hopefully center it, eliminating some of the white space involved.
	MagSetFocusToRect (iDisplayLeft, iDisplayRight, iDisplayTop, iDisplayBottom, 0)
EndIf
EndFunction

void Function ReadCalculatorDisplay ()
var
	handle hwnd,
	string sText
let hwnd = GetHandle (cid_ResultStatic)
if hwnd then
	Say(msgResultStaticName,ot_control_name)
	Say(GetWindowName(hWnd),ot_line)
else
	SayMessage (ot_error, msgDisplayWindowNotFound_L, msgDisplayWindowNotFound_S)
endif
EndFunction

void function UpdateCalculatorMode(int NewMode, int PrevMode,optional  handle hWnd)
var
	int iCtrl
;When switching modes and the focus does not change,
;schedule a function to update and announce the new mode.
;Otherwise, the mode will be updated and announced on focus change.
if newMode == PrevMode then
	;announce the mode, even though it is not changing:
	SayCalculatorModeName(ot_dialog_name)
elif (NewMode == mode_standard || NewMode == mode_Scientific || NewMode == mode_programmer)
&& (PrevMode == mode_standard || PrevMode == mode_Scientific || PrevMode == mode_programmer) then
	let iCtrl = GetControlID(hWnd)
	if iCtrl == cid_ResultStatic
	|| (iCtrl == cid_HistoryListBox && NewMode != mode_programmer) then
		let giScheduledSayCalculatorModeName = ScheduleFunction("SayScheduledCalculatorModeName",SwitchCalculatorModeWaitTime)
	EndIf
EndIf
EndFunction

handle function GetSelectedRadioButton(int iFirstCtrl)
var
	handle hWnd,
	handle hNull
let hWnd = GetHandle(iFirstCtrl)
if !hWnd then
	return hNull
EndIf
while GetWindowSubtypeCode(hWnd) == wt_RadioButton
&& !(GetWindowStyleBits(hWnd) & 0x00010000)
	let hWnd = getNextWindow(hWnd)
EndWhile
if GetWindowSubtypeCode(hWnd) == wt_RadioButton then
	return hWnd
else
	return hNull
EndIf
EndFunction

int function BrailleCallbackObjectIdentify()
var
	handle hWnd,
	int iCtrl
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
if UserBufferIsActive() then
	return BrailleCallbackObjectIdentify()
EndIf
let hWnd = GetFocus()
let iCtrl = GetControlID(hWnd)
if iCtrl == cid_ResultStatic then
	return WT_CUSTOM_CONTROL_BASE+1
EndIf
if GetWindowClass(GetFocus()) == CWC_DATETIME_PICKER then
	return wt_DateTime
EndIf
return BrailleCallbackObjectIdentify()
EndFunction

int function BrailleAddObjectName(int iSubtype)
var
	handle hWnd,
	int iCtrl
if IsTouchCursor() then
	return BrailleAddObjectName(iSubtype)
endIf
let hWnd = GetFocus()
let iCtrl = GetControlID(hWnd)
if iSubtype == WT_CUSTOM_CONTROL_BASE+1 then
	if iCtrl == cid_ResultStatic then
		BrailleAddString(msgResultStaticName,0,0,0)
		return true
	EndIf
elif iSubtype == wt_checkbox then
	if iCtrl == cid_InverseFunctionsCheckBox
	|| iCtrl ==cid_ExponentialNotationCheckBox then
		BrailleAddString(GetObjectName(true),GetCursorCol(),GetCursorRow(),attrib_highlight)
		return true
	EndIf
elif iSubtype == wt_RadioButton then
	BrailleAddString(GetObjectName(true),getCursorCol(),GetCursorRow(),GetCharacterAttributes())
	return true
elif iSubtype == wt_ListBox then
	if iCtrl == cid_HistoryListBox then
		BrailleAddString(msgHistoryListBoxName,0,0,0)
		return true
	EndIf
elif iSubtype == wt_ComboBox then
	BrailleAddString(GetObjectName(true),0,0,0)
	return true
elif iSubtype == wt_ReadOnlyEdit
|| iSubtype == wt_edit
|| iSubtype == wt_edit_SpinBox then
	BrailleAddString(GetObjectName(true),0,0,0)
	return true
EndIf
return BrailleAddObjectName(iSubtype)
EndFunction

int function BrailleAddObjectValue(int iSubtype)
if IsTouchCursor() then
	return BrailleAddObjectValue(iSubtype)
endIf
if iSubtype == WT_CUSTOM_CONTROL_BASE+1 then
	BrailleAddString(GetObjectValue(true),0,0,0)
	return true
EndIf
return BrailleAddObjectValue(iSubtype)
EndFunction

script StandardMode()
var
	handle hWnd
let hWnd = GetFocus()
	SayCurrentScriptKeyLabel()
TypecurrentScriptKey()
UpdateCalculatorMode(mode_standard,giCurrentCalculatorMode,hWnd)
EndScript

script ScientificMode()
var
	handle hWnd
let hWnd = GetFocus()
	SayCurrentScriptKeyLabel()
TypecurrentScriptKey()
UpdateCalculatorMode(mode_scientific,giCurrentCalculatorMode,hWnd)
EndScript

script ProgrammerMode()
var
	handle hWnd
let hWnd = GetFocus()
	SayCurrentScriptKeyLabel()
TypecurrentScriptKey()
UpdateCalculatorMode(mode_programmer,giCurrentCalculatorMode,hWnd)
EndScript

script StatisticsMode()
	SayCurrentScriptKeyLabel()
TypecurrentScriptKey()
UpdateCalculatorMode(mode_statistics,giCurrentCalculatorMode)
EndScript

script BasicCalculatorDisplay()
var
	int bShouldSayChange
SayCurrentScriptKeyLabel()
let bShouldSayChange = (IsNonBasicDialogActive() && GetControlID(GetFocus()) == cid_ResultStatic)
TypeKey(cksControlF4)
if bShouldSayChange then
	let giScheduledSayCalculatorModeName = ScheduleFunction("SayScheduledCalculatorModeName",SwitchCalculatorModeWaitTime)
EndIf
EndScript

script SpaceBar()
;although the spacebar is not normally scripted,
;it is scripted here because it is unlikely to cause sluggishness in the Calculator app,
;and because we must make sure to test the focus before the system processes the spacebar.
var
	handle hWnd
let hWnd = GetFocus()
if GetControlID(hWnd) == cid_ExponentialNotationCheckBox then
	let gbShouldSuppressFocusJumpToResultDisplay = true
	let gbShouldSayCheckBoxStateOnly = true
EndIf
TypeCurrentScriptKey()
SayCurrentScriptKeyLabel()
EndScript

Script OneButton()
ClickFunctionButton(cid_One, FALSE)
EndScript

Script TwoButton()
ClickFunctionButton(cid_Two, FALSE)
EndScript

Script ThreeButton()
ClickFunctionButton(cid_Three, FALSE)
EndScript

Script FourButton()
ClickFunctionButton(cid_Four, FALSE)
EndScript

Script FiveButton()
ClickFunctionButton(cid_Five, FALSE)
EndScript

Script SixButton()
ClickFunctionButton(cid_Six, FALSE)
EndScript

Script SevenButton()
ClickFunctionButton(cid_Seven, FALSE)
EndScript

Script EightButton()
ClickFunctionButton(cid_Eight, FALSE)
EndScript

Script NineButton()
ClickFunctionButton(cid_Nine, FALSE)
EndScript

Script ZeroButton()
ClickFunctionButton(cid_Zero, FALSE)
EndScript

Script HexAOrAverageButton()
if giCurrentCalculatorMode == mode_statistics then
	ClickFunctionButton(cid_Average, FALSE)
else
	ClickFunctionButton(cid_A, FALSE)
EndIf
EndScript

Script HexBButton ()
ClickFunctionButton(cid_B, FALSE)
EndScript

Script HexCButton ()
ClickFunctionButton(cid_C, FALSE)
EndScript

Script HexDOrModButton()
if GiCurrentCalculatorMode == mode_scientific then
	ClickFunctionButton(cid_Modulo, FALSE)
elif GiCurrentCalculatorMode == mode_statistics then
	ClickFunctionButton(cid_CAD,true)
else
	ClickFunctionButton(cid_D, FALSE)
EndIf
EndScript

Script HexEButton ()
ClickFunctionButton(cid_E, FALSE)
EndScript

Script HexFButton ()
ClickFunctionButton(cid_F, FALSE)
EndScript

script DecimalSeparatorButton()
ClickFunctionButton(cid_DecimalSeparator, FALSE)
EndScript

Script LeftParenButton()
ClickFunctionButton(cid_LeftParen, FALSE)
EndScript

Script RightParenButton()
ClickFunctionButton(cid_RightParen, FALSE)
EndScript

Script EqualsButton ()
ClickFunctionButton(cid_Equals, TRUE)
MagFocusToDisplay ()
refresh()
EndScript

Script Enter()
if GlobalMenuMode
|| InHJDialog() then
	EnterKey()
elif UserBufferIsActive() Then
	PerformScript Enter()
endIf
if giCurrentCalculatorMode == mode_statistics
;Display static is not visible when statistics mode is active but calculator is not in basic dialog:
|| (!IsWindowVisible(GetHandle(cid_DisplayStatic)) && GetHandle(cid_ResultStatic) == GetFocus())
	let gbSayStatisticsListBoxStatusWhenStabilized = true
	EnterKey()
elif giCurrentCalculatorMode == mode_standard
|| giCurrentCalculatorMode == mode_scientific
|| giCurrentCalculatorMode == mode_programmer
|| GetControlID(GetFocus()) == cid_ResultStatic
	PerformScript EqualsButton ()
else
	EnterKey()
endIf
EndScript

Script BackspaceButton ()
if IsClickFunctionButtonApplicable()
	ClickFunctionButton(cid_Backspace, TRUE)
	refresh()
else
	PerformScript JAWSBackSpace()
EndIf
EndScript

Script ClearButton ()
if IsClickFunctionButtonApplicable()
	if GetControlID(GetFocus()) == cid_ResultStatic
	&& GetObjectValue(true) == sc_CannotDivideByZero then
		TypeKey(cksEscape)
		Pause()
		Refresh ()
		BrailleRefresh()
		scheduleFunction("ReadCalculatorDisplay", ReadCalculatorDisplayWaitTime)
		return
	elif GetWindowSubtypeCode(GetFocus()) != wt_multiline_edit
		ClickFunctionButton(cid_Clear, TRUE)
		Pause()
		refresh()
		BrailleRefresh()
		return
	EndIf
EndIf
PerformScript UpALevel ()
EndScript

Script ClearEntryButton ()
if GetControlID(GetFocus()) == cid_StatisticsBoxListBox 
	;Delete can be used to remove entries from this list,
	;although the Clear Entry function button is not available:
	PerformScript JAWSDelete()
elif IsClickFunctionButtonApplicable()
	ClickFunctionButton(cid_ClearEntry, TRUE)
else
	PerformScript JAWSDelete()
EndIf
refresh()
EndScript

Script MemoryClearButton ()
ClickFunctionButton(cid_MC, FALSE)
EndScript

Script MemoryAddButton ()
ClickFunctionButton(cid_MPlus, FALSE)
EndScript

script MemorySubtractButton()
ClickFunctionButton(cid_MMinus, FALSE)
EndScript

Script MemoryStoreButton ()
ClickFunctionButton(cid_MS, FALSE)
EndScript

Script MemoryRecallButton ()
ClickFunctionButton(cid_MR, TRUE)
EndScript

Script AddButton()
ClickFunctionButton(cid_Add, FALSE)
EndScript

Script SubtractButton()
ClickFunctionButton(cid_Subtract, FALSE)
EndScript

Script MultiplyButton()
ClickFunctionButton(cid_Multiply, FALSE)
EndScript

Script DivideButton()
ClickFunctionButton(cid_Divide, FALSE)
EndScript

Script NegateButton ()
ClickFunctionButton(cid_Negate, TRUE)
EndScript

Script ReciprocalButton ()
ClickFunctionButton(cid_Reciprocal, TRUE)
EndScript

Script IntegerPartButton ()
ClickFunctionButton(cid_Int, TRUE)
EndScript

Script PercentOrModuloButton()
if giCurrentCalculatorMode == mode_programmer then
	ClickFunctionButton(cid_Modulo, FALSE)
else
	ClickFunctionButton(cid_Percent, TRUE)
endif
EndScript

Script AndButton ()
ClickFunctionButton(cid_And, FALSE)
EndScript

Script OrButton ()
ClickFunctionButton(cid_Or, FALSE)
EndScript

Script XOrButton ()
ClickFunctionButton(cid_XOr, FALSE)
EndScript

Script NotButton ()
ClickFunctionButton(cid_Not, TRUE)
EndScript

Script LeftShiftButton()
ClickFunctionButton(cid_Lsh, FALSE)
EndScript

Script RightShiftButton()
ClickFunctionButton(cid_Rsh, FALSE)
EndScript

Script RotateLeftButton()
ClickFunctionButton(cid_RoL, FALSE)
EndScript

Script RotateRightButton()
ClickFunctionButton(cid_RoR, FALSE)
EndScript

Script AverageOfSquareButton ()
if UserBufferIsActive () then
	PerformScript SelectAll ()
	Return
endIf
ClickFunctionButton(cid_AverageOfSquare, TRUE)
EndScript

Script SumButton ()
ClickFunctionButton(cid_Sum, TRUE)
EndScript

Script PiButton ()
ClickFunctionButton(cid_Pi, FALSE)
EndScript

Script DMSButton ()
ClickFunctionButton(cid_DMS, FALSE)
EndScript

Script SineOrSumButton()
if giCurrentCalculatorMode == mode_scientific then
	ClickFunctionButton(cid_Sine, TRUE)
else
	ClickFunctionButton(cid_Sum, TRUE)
EndIf
EndScript

Script HyperbolicSineButton()
if giCurrentCalculatorMode == mode_statistics then
	ClickFunctionButton(cid_SumOfSquare, true)
else
	ClickFunctionButton(cid_SinH, TRUE)
endIf
EndScript

Script CosineButton ()
ClickFunctionButton(cid_Cosine, TRUE)
EndScript

Script HyperbolicCosineButton ()
ClickFunctionButton(cid_CosH, TRUE)
EndScript

Script TangentOrStandardDeviationButton()
if giCurrentcalculatorMode == mode_scientific then
	ClickFunctionButton(cid_Tangent, TRUE)
else
	ClickFunctionButton(cid_StandardDeviation, TRUE)
EndIf
EndScript

Script HyperbolicTangentOrStandardDeviationPopulationButton()
if giCurrentcalculatorMode == mode_scientific then
	ClickFunctionButton(cid_TanH, TRUE)
else
	ClickFunctionButton(cid_StandardDeviationPopulation, TRUE)
EndIf
EndScript

Script CommonLogButton ()
ClickFunctionButton(cid_CommonLog, TRUE)
EndScript

Script AntiLogButton ()
ClickFunctionButton(cid_AntiLog, TRUE)
EndScript

Script naturalLogButton ()
ClickFunctionButton(cid_NaturalLog, TRUE)
EndScript

Script FactorialButton ()
ClickFunctionButton(cid_Factorial, TRUE)
EndScript

Script SquareRootButton ()
ClickFunctionButton(cid_SquareRoot, TRUE)
EndScript

Script SquareButton ()
ClickFunctionButton(cid_Squared, TRUE)
EndScript

Script CubeRootButton ()
ClickFunctionButton(cid_CubeRoot, TRUE)
EndScript

Script CubeButton ()
ClickFunctionButton(cid_Cubed, TRUE)
EndScript

Script ExponentialButton ()
ClickFunctionButton(cid_Exponential, FALSE)
EndScript

Script RaisedToTheYPowerButton ()
ClickFunctionButton(cid_RaisedToTheYPower, FALSE)
EndScript

script OrderOfYRootButton()
ClickFunctionButton(cid_OrderOfYRoot, FALSE)
EndScript

Script CADButton ()
if giCurrentCalculatorMode != mode_statistics then
	PerformScript SayFunctionModifiers ()
	return
endif
ClickFunctionButton(cid_CAD, FALSE)
EndScript

script DegreesOrWordRadioButton()
if giCurrentCalculatorMode == mode_Programmer then
	ClickFunctionButton(cid_WordRadioButton, TRUE)
else
	ClickFunctionButton(cid_DegreesRadioButton, TRUE)
EndIf
EndScript

script RadiansOrByteRadioButton()
if giCurrentCalculatorMode == mode_programmer then
	ClickFunctionButton(cid_ByteRadioButton, TRUE)
else
	ClickFunctionButton(cid_RadiansRadioButton, TRUE)
EndIf
EndScript

Script HexidecimalOrGradsRadioButton()
if giCurrentCalculatorMode == mode_scientific then
	ClickFunctionButton(cid_GradsRadioButton, TRUE)
else
	ClickFunctionButton(cid_HexRadioButton, TRUE)
EndIf
EndScript

Script DecimalRadioButton ()
ClickFunctionButton(cid_DecRadioButton, TRUE)
EndScript

Script OctalRadioButton ()
ClickFunctionButton(cid_OctRadioButton, TRUE)
EndScript

Script BinaryRadioButton ()
ClickFunctionButton(cid_BinRadioButton, TRUE)
EndScript

Script QWortdRadioButton()
ClickFunctionButton(cid_QWordRadioButton, FALSE)
EndScript

script DWordRadioButtonOrEdit()
if giCurrentCalculatorMode == mode_programmer then
	ClickFunctionButton(cid_DWordRadioButton, FALSE)
else
	SayCurrentScriptKeyLabel()
	TypeCurrentScriptKey()
EndIf
EndScript

Script InverseFunctionsCheckBox ()
if ClickFunctionButton(cid_InverseFunctionsCheckBox, FALSE) then
	;only say the state if the checkbox is not in focus,
	;since if it is in focus ObjStateChangedEvent will speak the change:
	if GetControlID(GetFocus()) != cid_InverseFunctionsCheckBox then
		pause()
		;SayWindowTypeAndText will say the type and state of the checkbox:
		SayWindowTypeAndText(GetHandle(cid_InverseFunctionsCheckBox))
	EndIf
endif
EndScript

Script ExponentialNotationCheckbox()
if ClickFunctionButton(cid_FDashECheckBox, TRUE) then
	;only say the state if the checkbox is not in focus,
	;since if it is in focus ObjStateChangedEvent will speak the change:
	if GetControlID(GetFocus()) != cid_FDashECheckBox then
		pause()
		;SayWindowTypeAndText will say the type and state of the checkbox:
		SayWindowTypeAndText(GetHandle(cid_FDashECheckBox))
	EndIf
EndIf
EndScript

Script SayFunctionModifiers()
var
	handle hWnd,
	string sName,
	int iState,
	int iRestriction
If UserBufferIsActive () then
	UserBufferDeactivate()
	Delay(UserBufferDeactivateWaitTime)
EndIf
if giCurrentCalculatorMode != mode_scientific then
	Say(MsgInverseCheckBoxNotAvailable,ot_error)
	return
EndIf
;we must visit the object to accurately determine its state:
let hWnd = GetHandle(cid_InverseFunctionsCheckBox)
if !hWnd
|| IsWindowDisabled(hWnd) then
	return
EndIf
SaveCursor()
InvisibleCursor()
let iRestriction = getRestriction()
SetRestriction(RestrictAppWindow )
MoveToWindow(hWnd)
let sName = GetObjectName(true)
let iState = GetControlAttributes()
SetRestriction(iRestriction)
RestoreCursor()
if iState & CTRL_CHECKED then
	SayMessage(ot_screen_message,FormatString(msgFunctionStateOn,sName))
ElIf iState & CTRL_UNCHECKED then
	SayMessage(ot_screen_message,FormatString(msgFunctionStateOff,sName))
EndIf
ActivateAnyRelevantVirtualDisplay()
EndScript

script ToggleHistory()
EnsureNoUserBufferActive(false)
if giCurrentCalculatorMode == mode_programmer
|| giCurrentCalculatorMode == mode_statistics then
	Say(msgHistoryUnavailable,ot_error)
	return
EndIf
TypeCurrentScriptKey()
Delay(5)
if IsHistoryActive() then
	Say(msgHistoryOn,ot_screen_message)
else
	Say(msgHistoryOff,ot_screen_message)
EndIf
EndScript

script ClearHistory()
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
Say(msgClearHistory,ot_help)
EndScript

Script ReportCalculatorView()
If UserBufferIsActive () then
	UserBufferDeactivate()
	Pause()
EndIf
SayCalculatorModeName(ot_user_requested_information)
ActivateAnyRelevantVirtualDisplay()
EndScript

Script SayWindowTitle  ()
var
	string sModeName
If !GlobalMenuMode
&& !InHJDialog()
&& !UserBufferIsActive() Then
	let sModeName = getCalculatorModeName(true)
	If sModeName then
		Say(FormatString(msgCalculatorTitleAndMode,
			GetWindowName(GetAppMainWindow (GetCurrentWindow())),
			FormatString(msgViewName,sModeName)),
			ot_user_requested_information)
		return
	EndIf
EndIf
PerformScript SayWindowTitle ()
EndScript

script Tab()
var
	int iCtrl = GetControlID (GetFocus ())

If Not IsNonBasicDialogActive ()
	if giCurrentCalculatorMode == mode_standard then
		if IsHistoryActive() then
			if iCtrl == cid_ResultStatic then
				SetFocus(GetHandle(cid_HistoryListBox))
			elif iCtrl == cid_HistoryListBox then
				SetFocus(GetHandle(cid_ResultStatic))
			EndIf
		EndIf
	elif giCurrentcalculatorMode == mode_scientific then
		if iCtrl == cid_ResultStatic then
			SetFocus(GetSelectedRadioButton(cid_DegreesRadioButton))
		ElIf iCtrl == cid_DegreesRadioButton
		|| iCtrl == cid_RadiansRadioButton
		|| iCtrl == cid_GradsRadioButton then
			SetFocus(GetHandle(cid_ExponentialNotationCheckBox))
		elif iCtrl == cid_ExponentialNotationCheckBox then
			SetFocus(GetHandle(cid_InverseFunctionsCheckBox))
		elif iCtrl == cid_InverseFunctionsCheckBox then
			if IsHistoryActive() then
				SetFocus(GetHandle(cid_HistoryListBox))
			else
				SetFocus(GetHandle(cid_ResultStatic))
			EndIf
		elif iCtrl == cid_HistoryListBox then
			SetFocus(GetHandle(cid_ResultStatic))
		EndIf
		return
	elif giCurrentcalculatorMode == mode_programmer then
		DeactivateAnyActiveVirtualDisplay()
		if iCtrl == cid_ResultStatic then
			SetFocus(GetSelectedRadioButton(cid_HexRadioButton))
		elif iCtrl == cid_HexRadioButton
		|| iCtrl == cid_DecRadioButton
		|| iCtrl == cid_OctRadioButton
		|| iCtrl == cid_BinRadioButton then
			SetFocus(GetSelectedRadioButton(cid_QWordRadioButton))
		elif iCtrl == cid_QWordRadioButton
		|| iCtrl == cid_DWordRadioButton
		|| iCtrl == cid_WordRadioButton
		|| iCtrl == cid_ByteRadioButton then
			SetFocus(GetHandle(cid_BitsDisplayStatic))
		elif iCtrl == cid_BitsDisplayStatic then
			SetFocus(GetHandle(cid_ResultStatic))
		EndIf
		return
	elif giCurrentCalculatorMode == mode_statistics then
	if iCtrl == cid_ResultStatic then
			SetFocus(GetHandle(cid_StatisticsBoxListBox))
		elif iCtrl == cid_StatisticsBoxListBox then
			SetFocus(GetHandle(cid_ExponentialNotationCheckBox))
		elif iCtrl == cid_ExponentialNotationCheckBox then
			SetFocus(GetHandle(cid_ResultStatic))
		EndIf
		return
	EndIf
EndIf
TabKey()
EndScript

script ShiftTab()
var
	int iCtrl = GetControlID (GetFocus ())

If Not IsNonBasicDialogActive ()
	if giCurrentCalculatorMode == mode_standard then
		if IsHistoryActive() then
			if iCtrl == cid_ResultStatic then
				SetFocus(GetHandle(cid_HistoryListBox))
			elif iCtrl == cid_HistoryListBox then
				SetFocus(GetHandle(cid_ResultStatic))
			EndIf
		EndIf
	elif giCurrentcalculatorMode == mode_scientific then
		if iCtrl == cid_ResultStatic then
			if IsHistoryActive() then
				SetFocus(GetHandle(cid_HistoryListBox))
			else
				SetFocus(GetHandle(cid_InverseFunctionsCheckBox))
			EndIf
		ElIf iCtrl == cid_DegreesRadioButton
		|| iCtrl == cid_RadiansRadioButton
		|| iCtrl == cid_GradsRadioButton then
			SetFocus(GetHandle(cid_ResultStatic))
		elif iCtrl == cid_ExponentialNotationCheckBox then
			SetFocus(GetSelectedRadioButton(cid_DegreesRadioButton))
		elif iCtrl == cid_InverseFunctionsCheckBox then
			SetFocus(GetHandle(cid_ExponentialNotationCheckBox))
		elif iCtrl == cid_HistoryListBox then
			SetFocus(GetHandle(cid_InverseFunctionsCheckBox))
		EndIf
		return
	elif giCurrentcalculatorMode == mode_programmer then
		DeactivateAnyActiveVirtualDisplay()
		if iCtrl == cid_ResultStatic then
			SetFocus(GetHandle(cid_BitsDisplayStatic))
		elif iCtrl == cid_HexRadioButton
		|| iCtrl == cid_DecRadioButton
		|| iCtrl == cid_OctRadioButton
		|| iCtrl == cid_BinRadioButton then
			SetFocus(GetHandle(cid_ResultStatic))
		elif iCtrl == cid_QWordRadioButton
		|| iCtrl == cid_DWordRadioButton
		|| iCtrl == cid_WordRadioButton
		|| iCtrl == cid_ByteRadioButton then
			SetFocus(GetSelectedRadioButton(cid_HexRadioButton))
		elif iCtrl == cid_BitsDisplayStatic then
			SetFocus(GetSelectedRadioButton(cid_QWordRadioButton))
		EndIf
		return
	elif giCurrentCalculatorMode == mode_statistics then
		if iCtrl == cid_ResultStatic then
			SetFocus(GetHandle(cid_ExponentialNotationCheckBox))
		elif iCtrl == cid_StatisticsBoxListBox then
			SetFocus(GetHandle(cid_ResultStatic))
		elif iCtrl == cid_ExponentialNotationCheckBox then
			SetFocus(GetHandle(cid_StatisticsBoxListBox))
		EndIf
		return
	EndIf
EndIf
ShiftTabKey()
EndScript

script SayCharacter()
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	if GetWindowClass(GlobalFocusWindow) == CWC_DATETIME_PICKER then
		;say the selected portion of the date time picker
		Say(GetSelectedText(),ot_word)
		return
	EndIf
EndIf
PerformScript SayCharacter()
EndScript

script SayWord()
var
	int iCtrl,
	int iSubtype
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	let iCtrl = GetControlID(GlobalFocusWindow)
	if iCtrl == cid_ExponentialNotationCheckBox
	|| iCtrl == cid_InverseFunctionsCheckBox then
		SayObjectTypeAndText()
		return
	EndIf
	let iSubtype = GetWindowSubtypeCode(GlobalFocusWindow)
	if iSubtype == wt_RadioButton then
		SayObjectTypeAndText()
		return
	EndIf
	if GetWindowClass(GlobalFocusWindow) == CWC_DATETIME_PICKER then
		;say the selected portion of the date time picker
		Say(GetSelectedText(),ot_word)
		return
	EndIf
EndIf
PerformScript SayWord()
EndScript

script SayNextWord()
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	if GetWindowClass(GlobalFocusWindow) == CWC_DATETIME_PICKER then
		;just navigate, SayHighlightedText will speak the item after navigation
		NextWord()
		return
	EndIf
EndIf
PerformScript SayNextWord()
EndScript

script SayPriorWord()
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	if GetWindowClass(GlobalFocusWindow) == CWC_DATETIME_PICKER then
		;just navigate, SayHighlightedText will speak the item after navigation
		PriorWord()
		return
	EndIf
EndIf
PerformScript SayPriorWord()
EndScript

script SayLine()
var
	int iCtrl,
	int iSubtype,
	string sLine
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	let iCtrl = GetControlID(GlobalFocusWindow)
	if iCtrl == cid_ResultStatic then
		Say(GetWindowName(GlobalFocusWindow),ot_line)
		return
	elif iCtrl == cid_ExponentialNotationCheckBox
	|| iCtrl == cid_InverseFunctionsCheckBox then
		SayObjectTypeAndText()
		return
	EndIf
	let iSubtype = GetWindowSubtypeCode(GlobalFocusWindow)
	if iSubtype == wt_RadioButton then
		SayObjectTypeAndText()
		return
	elif iSubtype == wt_ReadOnlyEdit
	|| iSubtype == wt_edit
	|| iSubtype == wt_multiline_edit then
		let sLine = GetObjectValue(true)
		if sLine then
			Say(sLine,ot_line)
		else
			SayUsingVoice(vctx_message,cmsgBlank1,ot_line)
		EndIf
		return
	EndIf
EndIf
PerformScript SayLine()
EndScript

script SayNextLine()
var
	int iCtrl,
	int iSubtype
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	let iCtrl = GetControlID(GlobalFocusWindow)
	let iSubtype = GetWindowSubtypeCode(GlobalFocusWindow)
	if !iSubtype then
		let iSubtype = getObjectSubtypeCode()
	EndIf
	if iCtrl == cid_HistoryListBox then
		let gbShouldSuppressFocusJumpToResultDisplay = true
		let gbShouldSuppressListBoxFullAnnouncement = true
		let gsHistoryListPositionBeforeNavigate = PositionInGroup()
		NextLine()
		return
	EndIf
	if iSubtype == wt_RadioButton then
		let gbShouldSuppressRadioButtonPositionAnnouncement = true
	EndIf
	if giCurrentcalculatorMode == mode_scientific then
		if iCtrl == cid_DegreesRadioButton then
			SetFocus(GetHandle(cid_RadiansRadioButton))
			return
		elif iCtrl == cid_RadiansRadioButton then
			SetFocus(GetHandle(cid_GradsRadioButton))
			return
		elif iCtrl == cid_GradsRadioButton then
			SetFocus(GetHandle(cid_DegreesRadioButton))
			return
		EndIf
	elif giCurrentcalculatorMode == mode_programmer then
		;these radio buttons change the Result display.
		;However, we want to suppress the focus jump when the next radio button becomes selected:
		let gbShouldSuppressFocusJumpToResultDisplay = true
		if iCtrl == cid_HexRadioButton then
			SetFocus(GetHandle(cid_DecRadioButton))
			return
		elif iCtrl == cid_DecRadioButton then
			SetFocus(GetHandle(cid_OctRadioButton))
			return
		elif iCtrl == cid_OctRadioButton then
			SetFocus(GetHandle(cid_BinRadioButton))
			return
		elif iCtrl == cid_BinRadioButton then
			SetFocus(GetHandle(cid_HexRadioButton))
			return
		elif iCtrl == cid_QWordRadioButton then
			SetFocus(GetHandle(cid_DWordRadioButton))
			return
		elif iCtrl == cid_DWordRadioButton then
			SetFocus(GetHandle(cid_WordRadioButton))
			return
		elif iCtrl == cid_WordRadioButton then
			SetFocus(GetHandle(cid_ByteRadioButton))
			return
		elif iCtrl == cid_ByteRadioButton then
			SetFocus(GetHandle(cid_QWordRadioButton))
			return
		EndIf
	EndIf
	if GetWindowSubtypeCode(GlobalFocusWindow) == wt_edit_SpinBox then
		NextLine()
		;ValueChangedEvent will speak the change
		return
	EndIf
EndIf
PerformScript SayNextLine()
EndScript

script SayPriorLine()
var
	int iCtrl,
	int iSubtype
if IsPCCursor()
&& !UserBufferIsActive()
&& !GlobalMenuMode then
	let iCtrl = GetControlID(GlobalFocusWindow)
	let iSubtype = GetWindowSubtypeCode(GlobalFocusWindow)
	if !iSubtype then
		let iSubtype = getObjectSubtypeCode()
	EndIf
	if iCtrl == cid_HistoryListBox then
		let gbShouldSuppressFocusJumpToResultDisplay = true
		let gbShouldSuppressListBoxFullAnnouncement = true
		let gsHistoryListPositionBeforeNavigate = PositionInGroup()
		PriorLine()
		return
	EndIf
	if iSubtype == wt_RadioButton then
		let gbShouldSuppressRadioButtonPositionAnnouncement = true
	EndIf
	if giCurrentcalculatorMode == mode_scientific then
		if iCtrl == cid_DegreesRadioButton then
			SetFocus(GetHandle(cid_GradsRadioButton))
			return
		elif iCtrl == cid_RadiansRadioButton then
			SetFocus(GetHandle(cid_DegreesRadioButton))
			return
		elif iCtrl == cid_GradsRadioButton then
			SetFocus(GetHandle(cid_RadiansRadioButton))
			return
		EndIf
	elif giCurrentcalculatorMode == mode_programmer then
		;these radio buttons change the Result display.
		;However, we want to suppress the focus jump when the next radio button becomes selected:
		let gbShouldSuppressFocusJumpToResultDisplay = true
		if iCtrl == cid_HexRadioButton then
			SetFocus(GetHandle(cid_BinRadioButton))
			return
		elif iCtrl == cid_DecRadioButton then
			SetFocus(GetHandle(cid_HexRadioButton))
			return
		elif iCtrl == cid_OctRadioButton then
			SetFocus(GetHandle(cid_DecRadioButton))
			return
		elif iCtrl == cid_BinRadioButton then
			SetFocus(GetHandle(cid_OctRadioButton))
			return
		elif iCtrl == cid_QWordRadioButton then
			SetFocus(GetHandle(cid_ByteRadioButton))
			return
		elif iCtrl == cid_DWordRadioButton then
			SetFocus(GetHandle(cid_QWordRadioButton))
			return
		elif iCtrl == cid_WordRadioButton then
			SetFocus(GetHandle(cid_DWordRadioButton))
			return
		elif iCtrl == cid_ByteRadioButton then
			SetFocus(GetHandle(cid_WordRadioButton))
			return
		EndIf
	EndIf
	if GetWindowSubtypeCode(GlobalFocusWindow) == wt_edit_SpinBox then
		PriorLine()
		;ValueChangedEvent will speak the change
		return
	EndIf
EndIf
PerformScript SayPriorLine()
EndScript

int function ExemptFromFunctionsList(handle hWnd)
var
	int iCtrl
let iCtrl = GetControlID(hWnd)
return GetWindowSubtypeCode(hWnd) != wt_button
	|| IsWindowDisabled(hWnd)
	|| (iCtrl >= cid_Zero && iCtrl <= cid_F)
	|| iCtrl == cid_LeftParen
	|| iCtrl == cid_RightParen
	|| iCtrl == cid_equals
	|| iCtrl == cid_DecimalSeparator
	|| iCtrl == cid_backspace
	;|| (iCtrl >= cid_Divide && iCtrl <= cid_subtract)
EndFunction

Script ListCalculatorFunctions()
var
	int iRestriction,
	handle hWnd,
	string sFunctionsList,
	string sHWndList,
	int iSelectedItem
EnsureNoUserBufferActive(false)
if InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
if !giCurrentCalculatorMode
|| GlobalMenuMode then
	Say(msgFunctionListUnavailable,ot_error)
	return
EndIf
;position hWnd at the appropriate starting point:
let hWnd = GetFirstChild(GetFirstChild(GetAppMainWindow(GetFocus())))
if giCurrentCalculatorMode == mode_standard
|| giCurrentCalculatorMode == mode_scientific
|| giCurrentCalculatorMode == mode_programmer then
	if !IsHistoryActive() then
		let hWnd = GetFirstChild(GetNextWindow(GetNextWindow(hWnd)))
	else
		let hWnd = GetFirstChild(GetNextWindow(GetNextWindow(GetNextWindow(hWnd))))
	EndIf
elif giCurrentCalculatorMode == mode_statistics then
	let hWnd = GetFirstChild(hWnd)
EndIf
;now build the functions list and its corresponding handles list:
while hWnd
	if !ExemptFromFunctionsList(hWnd) then
		let sHWndList = sHWndList+IntToString(hWnd)+cscListSeparator
		let sFunctionsList = sFunctionsList+GetNameFromObject(hWnd)+cscListSeparator
	EndIf
	let hWnd = getNextWindow(hWnd)
EndWhile
if sFunctionsList then
	StringChopRight(sFunctionsList,1)
	StringChopRight(sHWndList,1)
EndIf
let iSelectedItem = DlgSelectItemInList (sFunctionsList, msgFunctionsListName, TRUE)
if !iSelectedItem then
	return
EndIf
;now click the button:
let iRestriction = GetRestriction()
SaveCursor()
SetRestriction(RestrictAppWindow )
InvisibleCursor()
MoveToWindow(StringToHandle(StringSegment(sHWndList,cscListSeparator,iSelectedItem)))
RoutePCToInvisible()
SetRestriction(iRestriction)
RestoreCursor()
EndScript

Script ReportMemoryIndicator ()
var
	handle hWnd,
	int iSubtype,
	int iState,
	string sValue
EnsureNoUserBufferActive(false)
let hWnd = GetHandle(cid_MemoryStatic)
if !hWnd then
	return
EndIf
GetObjectInfoByName(hWnd,objn_Memory,1,iSubtype,iState,sValue)
if !sValue then
	Say(msgMemoryWindowIsEmpty,ot_screen_message)
else
	Say(msgMemoryWindowHasValue,ot_screen_message)
EndIf
EndScript

script ReportParenNestingLevel()
var
	handle hWnd,
	object obj,
	string sName
EnsureNoUserBufferActive(false)
let hWnd = GetHandle(cid_ParenNestingLevelStatic)
if !hWnd then
	Say(msgNotFound,ot_error)
	return
EndIf
let obj = GetObjectFromEvent(hWnd,0,0,0)
let sName = obj.accName(0)
if !sName then
	Say(msgNoParenNestingLevel,ot_screen_message)
else
	Say(FormatString(msgParenNestingLevel,sName),ot_screen_message)
EndIf
EndScript

Script ReportCalculatorDisplay ()
If UserBufferIsActive () then
	UserBufferDeactivate()
	Delay(UserBufferDeactivateWaitTime)
EndIf
if giCurrentCalculatorMode then
	ReadCalculatorDisplay ()
else
	SaycurrentScriptKeyLabel()
	TypeCurrentScriptKey()
EndIf
ActivateAnyRelevantVirtualDisplay()
EndScript

Script SayNumberBase()
var
	string sBase
If UserBufferIsActive () then
	UserBufferDeactivate()
	Delay(UserBufferDeactivateWaitTime)
EndIf
if giCurrentCalculatorMode != mode_programmer then
	Say(MsgActiveNumberBaseNotAvailable,ot_error)
	return
EndIf
let sBase = GetNameFromObject(GetSelectedRadioButton(cid_HexRadioButton))
if !sBase then
	Say(MsgCannotDetermineActiveNumberBase,ot_error)
else
	Say(FormatString(msgActiveNumberBase,sBase),ot_screen_message)
EndIf
ActivateAnyRelevantVirtualDisplay()
EndScript

Script SayBaseModifier()
var
	string sModifier
If UserBufferIsActive () then
	UserBufferDeactivate()
	Delay(UserBufferDeactivateWaitTime)
EndIf
if giCurrentcalculatorMode == mode_scientific then
	let sModifier = GetNameFromObject(GetSelectedRadioButton(cid_DegreesRadioButton))
elif giCurrentCalculatorMode == mode_programmer then
	let sModifier = GetNameFromObject(GetSelectedRadioButton(cid_QWordRadioButton))
else
	Say(msgNoActiveNumberModifier	,ot_error)
	return
EndIf
if !sModifier then
	Say(msgCannotDetermineActiveNumberModifier,ot_error)
else
	Say(FormatString(msgActiveNumberModifier,sModifier),ot_screen_message)
EndIf
ActivateAnyRelevantVirtualDisplay()
EndScript

script ScriptFileName()
ScriptAndAppNames(msgWindowsCalculatorAppName)
EndScript

Script ScreenSensitiveHelp ()
If IsSameScript() then
	AppFileTopic(topic_Windows7_Calculator)
	return
EndIf
PerformScript ScreenSensitiveHelp ()
EndScript

Script HotKeyHelp ()
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage(ot_user_buffer, msgHotKeyHelp1_L+cscBufferNewLine+cscBufferNewLine+cMsgBuffExit)
EndScript

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName)
if WasSayObjectTypeAndTextExceptionProcessed(nLevel,includeContainerName) return endIf
var
	handle hWnd,
	int iSubtype,
	int iCtrl
let hWnd = GetCurrentWindow()
let iSubtype = GetObjectSubtypeCode()
let iCtrl = GetControlID(hWnd)
if iSubtype == wt_static then
	if iCtrl == cid_ResultStatic then
		;Give this field a name, and speak it:
		Say(msgResultStaticName,ot_control_name)
		SayObjectTypeAndText(nLevel,includeContainerName)
		return
	EndIf
elif iSubtype == wt_CheckBox then
	if iCtrl == cid_InverseFunctionsCheckBox then
		;SayObjectTypeAndText does not speak the name, so speak it:
		Say(GetObjectName(true),ot_control_name)
		SayObjectTypeAndText(nLevel,includeContainerName)
		return
	elif iCtrl ==cid_ExponentialNotationCheckBox then
		if gbShouldSayCheckBoxStateOnly then
			;The state change caused focus to jump to the Result display,
			let gbShouldSayCheckBoxStateOnly = false
			IndicateControlState(wt_CheckBox,GetControlAttributes())
			;and the focus is now being set back to the checkbox after a jump to the Result display:
		else
			;SayObjectTypeAndText does not speak the name, so speak it:
			Say(GetObjectName(true),ot_control_name)
			SayObjectTypeAndText(nLevel,includeContainerName)
		EndIf
		return
	EndIf
elif iSubtype == wt_RadioButton then
	SayCurrentRadioButtonUsingMSAAName()
	return
elif iSubtype == wt_ListBox then
	if iCtrl == cid_HistoryListbox then
		SayHistoryListBoxItem()
		return
	EndIf
elif iSubtype == wt_ReadOnlyEdit
|| iSubtype == wt_edit
|| iSubtype == wt_edit_SpinBox then
	IndicateControlType(iSubtype,GetObjectName(true),GetObjectValue(true))
	return
elif iSubtype == wt_ComboBox then
	IndicateControlType(wt_comboBox,GetObjectName(true))
	SayLine()
	return
EndIf
SayObjectTypeAndText(nLevel,includeContainerName)
EndFunction

void function updateClipboard(int nMethod)
if nMethod == CLIPBOARD_COPIED
&& GetControlID(GetFocus()) == cid_ResultStatic
&& WillOverwriteClipboard() then
	let ClipboardTextChanged = Clipboard_Copied
	TypeKey(cksCopy)
	return
EndIf
updateClipboard(nMethod)
EndFunction

string function GetSelectedText()
if GetControlID(GetFocus()) == cid_ResultStatic then
	return GetObjectValue(true)
EndIf
return GetSelectedText()
EndFunction

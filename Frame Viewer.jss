;JAWS 4.0 Script files for Frame Viewer
;Copyright (C) 2010-2024 by Freedom Scientific BLV Group 
;
;****************************************
;*	        Written By		*	
;*	Freedom Scientific Scripting	*
;*		Team Gold		*
;****************************************
;
include "HjConst.jsh"
include "HjGlobal.jsh"
include "hjHelp.jsh"
include"FrameView.jsh"
include"FrameView.jsm"
include "common.jsm"

GLOBALS
	int GIFunctionID,
	int GIPrevLeft,
	int GIPrevTop,
	int GIPrevBottom,
	int GIPrevRight,
	int GICurrLeft,
	int GICurrTop,
	int GICurrBottom,
	int GICurrRight
	


Void Function AddHotKeyLinks ()
UserBufferAddText (cScBufferNewLine); Put a blank line in to ensure accurate spacing in the buffer
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndFunction

int function HandleCustomWindows (handle hwnd)
var
	int iWinTypeCode, ; window type code as defined in hjconst.jsh
	int iWinSubtypeCode, ; window subtype code as defined in hjconst.jsh
	string sClass, ; window class of custom window
	int iControlID, ; unique control ID
	string sControlName, ; window or object name
	string sControlType, ; control type (localised string)
	string SControlState, ; returned by getObjectState() or equivalent
	string sControlValue, ; value of control or object
	string sItemPosition, ; x of y items as for custom listboxes or groups of radio buttons etc
	string sControlContainerName, ;container name if applicable 
	string sControlContainerType, ; container type (localized string)
	string sDialogText
If GlobalMenuMode then ; Safety so we don't break menus or menu bars
	Return false
EndIf
Let iControlID = GetControlID (hwnd)
let sClass = getWindowClass(hwnd)
;initializing globals here should work, except that after WindowResizedEvent() there tends to
;be a one pixel discrepency, which royally screws things up.
;without this initialization block, speaking fails on the first instance of moving or resizing
;a window, then it works fine.
;if sClass == wcFrameClass then
;	let GIPrevLeft = GetWindowLeft (hwnd)
;	let GIPrevTop = GetWindowTop (hwnd)
;	let GIPrevBottom = GetWindowBottom (hwnd)
;	let GIPrevRight = GetWindowRight (hwnd)
;endif
return false
EndFunction

int function HandleCustomRealWindows (handle hwnd)
var
	string sRealName
Let sRealName = GetWindowName (GetRealWindow (hwnd))
if sRealName==cscNull then
	return true
EndIf
EndFunction

void function AutoStartEvent ()
let giSuppressEcho = false
If ! giFrameViewFirstTime then
	Let giFrameViewFirstTime = 1
	;SayFormattedMessage(OT_APP_START, msgAppStart_L, msgAppStart_S); Removed as we don't need for the Frame Viewer.
EndIf
EndFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	handle RealWindow,
	string RealWindowName,
	handle AppWindow
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let RealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (RealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
if (GlobalPrevApp != AppWindow && AppWindow != FocusWindow) then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
		If (! HandleCustomRealWindows (AppWindow)) then
		SayWindowTypeAndText (AppWindow)
	EndIf
EndIf
If ((GlobalPrevRealName != RealWindowName) || ; name has changed
(GlobalPrevReal != RealWindow)) then ; or handle has changed, then
	If ((RealWindow != AppWindow) && (RealWindow != FocusWindow)) then
		If (! HandleCustomRealWindows (RealWindow)) then
			SayWindowTypeAndText (RealWindow)
		EndIf
	EndIf
EndIf
let GlobalFocusWindow = FocusWindow
if (GlobalPrevFocus != focusWindow) then
	If (! HandleCustomWindows (FocusWindow)) then
		SayFocusedWindow () ; will use global variable GlobalFocusWindow
	EndIf
Else
	SayFocusedObject ()
EndIf
;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

Void Function SayFocusedWindow ()
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
If (! HandleCustomWindows (GlobalFocusWindow)) then
	SayFocusedObject()
EndIf
EndFunction

void function SayNonHighlightedText (handle hwnd, string buffer)
var
	int iHwndType,
	int iFocusType,
	string TheClass
If giSuppressEcho == on then
	return
EndIf
If GlobalMenuMode > 0 then
	SayNonHighlightedText (hWnd, buffer)
	Return
EndIf
If GetWindowHierarchyX(hWnd) < GetWindowHierarchyX(GetFocus ()) then
;Not valid for speaking descriptive info
	SayNonhighlightedText (hWnd, buffer)
	Return
EndIf
Let iHwndType = GetWindowSubTypeCode (hWnd)
If ! (iHwndType == WT_STATIC) then
	SayNonHighlightedText (hWnd, buffer)
	Return
EndIf
Let iFocusType = GetWindowSubTypeCode (GetFocus ())
If ! (iFocusType == WT_COMBOBOX) then
	Return
EndIf
;Keep combo boxes from too much chatter:
Say (buffer, OT_DIALOG_TEXT); speak descriptive info on combo boxes
EndFunction

void function SayHighlightedText (handle hwnd, string buffer)
var
	int iControlId
Let iControlId = GetControlID (hwnd)
; put custom highlighted text code here
If giSuppressEcho then
	Return
EndIf
SayHighlightedText (hwnd, buffer)
EndFunction
      
Int Function ScreenSensitiveHelpBackAndNext (string sButtonName)
If sButtonName == msgNext_BTN_Text Then
  	 SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp3_l)
   	AddHotKeyLinks ()
  	Return true 
ElIf sButtonName == msgBack_BTN_Text  then
   	SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp5_l)
  	AddHotKeyLinks ()
   	Return true 
Else
	Return false 
EndIf
EndFunction

Int Function ScreenSensitiveHelpForPromptWizard (int subtype, int id, handle hwnd)
if SubType == WT_EDIT  then
	if id == id_FramePrompt  then
		If StringContains (GetWindowText (GetPriorWindow (hwnd), false), sc1) then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp2_L)
			AddHotKeyLinks ()
			return true
		ElIf StringContains (GetWindowText (GetPriorWindow (hwnd), false), sc3) then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp8_L)
			AddHotKeyLinks ()
			return true
		Else
			return false
		EndIf	
	ElIf id == id_braille_prompt  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp7_L)
		AddHotKeyLinks ()
		return true
	Else
		return false 
	EndIf
ElIf SubType == WT_BUTTON then
	If id == id_FinishBtn  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp6_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_CancelBtn  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp4_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
Else
	return false
EndIf  
EndFunction

Int Function ScreenSensitiveHelpForCreateFrameWizard (int subtype, int id, handle hwnd)
if SubType == WT_EDIT then
	if id == id_FrameName_edit then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp69_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_MULTILINE_EDIT then
	if id == id_synops  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp70_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_description_edit then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp71_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_RADIOBUTTON then
	if id == id_silent_rdb ||
	id == id_highlighted_rdb ||
	id== id_all_rdb ||
	id == id_jfwEcho_rdb then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp72_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_BUTTON then
	If id == id_FinishBtn  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp73_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_CancelBtn  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp4_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
Else
	return false
EndIf
EndFunction

Int Function ScreenSensitiveHelpForFramesList (int subtype, int id, handle hwnd)
If SubType == 	WT_LISTVIEW then
	if id == id_FramesList  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp13_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_RADIOBUTTON then
	if id == id_ActiveFrame_rdb ||
	id == id_ApplicationFrame_rdb ||
	id == id_DefaultFrames_rdb then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp14_L)
		AddHotKeyLinks ()
		return true
	Else
		Return false
	EndIf
ElIf SubType == WT_BUTTON then
	If Id == id_MoveToFrameBtn  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp15_L)
		AddHotKeyLinks ()
		Return true
	ElIf id == id_DeleteFrameBtn  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp16_L)
		AddHotKeyLinks ()
		Return true
	ElIf id == id_NewFrameBtn  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp17_L)
		AddHotKeyLinks ()
		Return true		
	ElIf id == id_FramePropertiesBtn  then 
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp18_L)
		AddHotKeyLinks ()
		Return true
	ElIf id == id_EnableFrameBtn  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp19_L)
		AddHotKeyLinks ()
		Return true
	ElIf id == id_CloseBtn_fl  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp78_L)
		AddHotKeyLinks ()
		return true
	Else
		Return false
	EndIf
Else
	Return false
EndIf
                                            EndFunction

Int Function ScreenSensitiveHelpForGeneralPage (int subtype, int id, handle hwnd)
if SubType == WT_EDIT  then
	if id == id_frame_name then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp21_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_synopsys then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp22_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_prompt_spoken then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp23_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_prompt_brl then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp24_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_prompt_tutor then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp68_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_keystroke then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp25_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_MULTILINE_EDIT then
	if id == id_description  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp26_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_EDIT_SPINBOX  then
	if id == id_priority  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp27_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
Elif SubType == WT_BUTTON then
	if id == id_OK then
		SayFormattedMessage(OT_USER_BUFFER, cmsg365_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_CANCEL then
		SayFormattedMessage(OT_USER_BUFFER, cmsg366_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_help then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp20_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf  
Else
	Return false
EndIf
EndFunction

Int Function ScreenSensitiveHelpForRulesPage (int subtype, int id, handle hwnd)
if SubType == WT_LISTVIEW then
	if id == id_list_Rules then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp28_L)
		AddHotKeyLinks ()
		Return true
	Else
		return false
	EndIf
Elif SubType == WT_BUTTON then
	if id == id_RuleUp_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp29_L)
		AddHotKeyLinks ()
		Return true
	ElIf id == id_RuleDwn_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp30_L)
		AddHotKeyLinks ()
		Return true
	ElIf id == id_delete_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp31_L)
		AddHotKeyLinks ()
		Return true
	ElIf Id ==id_add_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp32_L)
		AddHotKeyLinks ()
		Return true
	ElIf id == id_modify_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp33_L)
		AddHotKeyLinks ()
		Return true
	Elif id == id_OK then
		SayFormattedMessage(OT_USER_BUFFER, cmsg365_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_CANCEL then
		SayFormattedMessage(OT_USER_BUFFER, cmsg366_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_help then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp20_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf  
Else
	Return false
EndIf
EndFunction
        
Int Function ScreenSensitiveHelpForEventsPage (int subtype, int id, handle hwnd)
if SubType == WT_LISTVIEW then
	if id == id_list_events  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp34_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_BUTTON then
	if id == id_EventUp_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp35_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_EventDwn_btn then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp36_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_delete_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelpDeleteEvent_L)
		AddHotKeyLinks ()
		Return true
	ElIf Id ==id_add_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelpAddEvent_L)
		AddHotKeyLinks ()
		Return true
	ElIf id == id_modify_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelpModifyEvent_L)
		AddHotKeyLinks ()
		Return true
	Elif id == id_OK then
		SayFormattedMessage(OT_USER_BUFFER, cmsg365_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_CANCEL then
		SayFormattedMessage(OT_USER_BUFFER, cmsg366_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_help then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp20_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf  
Else
	Return false
EndIf
EndFunction

Int Function ScreenSensitiveHelpForPositionPage (int subtype, int id, handle hwnd)
if SubType == WT_EDIT then
	if id == id_distance_left then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp37_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_width then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp38_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_distance_right then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp39_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_distance_top then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp40_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_highth then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp41_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_distance_bottom then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp42_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_RADIOBUTTON  then
	if (id == id_right_rdb || id == id_left_rdb) then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp43_L)
		AddHotKeyLinks ()
		Return true
	ElIf (id ==id_top_rdb || id == id_bottom_rdb) then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp44_L)
		AddHotKeyLinks ()
		return true
	ElIf (id == id_rWindow_rdb || id == id_rScreen_rdb) then 
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp45_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_CHECKBOX  then
	if id == id_lock_to_96_chk  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp46_L)
		AddHotKeyLinks ()
		return true
	Else
		PerformScript ScreenSensitiveHelp()
		return true
	EndIf
Elif SubType == WT_BUTTON then
	if id == id_OK then
		SayFormattedMessage(OT_USER_BUFFER, cmsg365_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_CANCEL then
		SayFormattedMessage(OT_USER_BUFFER, cmsg366_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_help then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp20_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf  
Else
	Return false
EndIf
EndFunction

Int Function ScreenSensitiveHelpForRulesWizard (int subtype, int id, handle hwnd)
if SubType == WT_RADIOBUTTON then
	If id == id_WinTitle_rdb  ||
	id == id_WinClass_rdb  ||
	id == id_WinText_rdb  ||
	id == id_FrameText_rdb  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp47_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_is_rdb ||
	id == id_is_notrdb ||
	id == id_contains_rdb ||
	id == id_does_not_contain_rdb then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp48_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_EDIT then
	if id == id_add_edit  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp50_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_ValidationText_ed then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp75_L)
		AddHotKeyLinks ()
		return true
	else
		return false
	EndIf
ElIf SubType == WT_LISTBOX  then
	if id == id_add_list  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp51_L)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_BUTTON then
	If id == id_FinishBtn  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelpFinishRule_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_add_btn  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp32_L)
		AddHotKeyLinks ()
		Return true
	ElIf id == id_remove_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp49_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_Modify_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp74_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_CANCEL then
		SayFormattedMessage(OT_USER_BUFFER, cmsg366_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_help then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp20_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_OK then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp76_l)
		AddHotKeyLinks ()
		Return true
	ElIf id == id_Cancel then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp77_l)
		AddHotKeyLinks ()
		Return true
	Else
		return false
	EndIf
Else
	return false
EndIf
EndFunction

Int Function ScreenSensitiveHelpForEventsWizard (int subtype, int id, int id_parent, handle hwnd, string sWindowText)
if SubType == WT_COMBOBOX then		
	if id == id_select_event_combo then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp52_L)
		AddHotKeyLinks ()
					return true
	ElIf id == id_select_action_combo then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp53_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_FrameDisplayedOnBrailleDevice  then  
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp57_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_voice_context_combo then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp54_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_OutputFromscript then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp60_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_SelectConfiguration_edit_combo  then
		if StringContains(sWindowText, sc_1)  then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp64_L)
			AddHotKeyLinks ()
			return true
		Elif StringContains(sWindowText, sc_2)  then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp67_L)
			AddHotKeyLinks ()
			return true
		Else
			return false
		EndIf   
	Else
		return false
	EndIf
ElIf SubType == WT_CHECKBOX then
	if id == id_ShowFocusControl_chk  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp58_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_bold_chkbx||
	id == id_italic_chkbx||
	id == id_underline_chkbx||
	id == id_strikethrough_chkbx||
	id == id_highlight_chkbx then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp79_l)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_RADIOBUTTON then
	if id == id_standard_beep_rdb  ||  ;select beep type radio buttons
	id == id_asterisk_rdb  ||
	id == id_exclamation_rdb  ||
	id == id_hand_rdb  ||
	id == id_question_rdb ||
	id == id_default_rdb  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp56_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_AllTheTime_rbtn||
	id_WhenTextIsInThisFrame_rbtn||
	id_WhenTextIsNotInThisFrame_rbtn then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp84_l)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_EDIT then
	if id == id_spoken_string_edit  then
		If StringContains (sWindowText, sc_3) then
			SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelp55_L)
			AddHotKeyLinks ()
			return true
		ElIf StringContains (sWindowText, sc_4) then
			SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp90_l)
			AddHotKeyLinks ()
			return true
		Else
			return false
		EndIf
	ElIf id == id_StringDisplayedOnBraille_edit  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp59_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_wave_file_edit   then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp65_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_TutorMessage_edit  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp68_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_ScriptEvent_edit then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp89_l)
		AddHotKeyLinks ()
		return true
	ElIf id == id_TextMatch_edit then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp85_l)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_EDITCOMBO then
	if id_parent == id_ParentOfWindowTitle_edit_combo  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp62_L)
		AddHotKeyLinks ()
		return true
	ElIf id_parent == id_ParentOfControlId_edit_combo then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp63_L)
		AddHotKeyLinks ()
		return true
	ElIf id_parent == id_foreground_parent then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp86_l)
		AddHotKeyLinks ()
		return true
	ElIf id_parent == id_background_parent then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp87_l)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf
ElIf SubType == WT_BUTTON then
	If id == id_insert_btn  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp61_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_Browse  then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp66_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_FinishBtn  then
		SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelpFinishEvent_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_CANCEL then
		SayFormattedMessage(OT_USER_BUFFER, cmsg366_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_help then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp20_L)
		AddHotKeyLinks ()
		return true
	ElIf id == id_GetColorFromMouseLocation_btn then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp88_l)
		AddHotKeyLinks ()
		return true
	Elif id == idAddAnotherRule_button then
		SayFormattedMessage (ot_user_buffer, msgScreenSensitiveHelp91_l)
		AddHotKeyLinks ()
		return true
	Else
		return false
	EndIf  
Else
	return false
EndIf  
EndFunction

Script ScreenSensitiveHelp ()
var
	handle hWnd,
	int id,
	int SubType,
	int id_parent,
	string sClass,
	string sRealWindow,
	string sButtonName,
	string sWindowText,
	string strSegment1,
	string strSegment2,
	string strSegment3
let hWnd = GetCurrentWindow()
let id = GetControlId(hWnd)
let id_parent = GetControlId (GetParent (hwnd))
let SubType = GetWindowSubtypeCode (hWnd)
let sRealWindow = GetWindowName(GetRealWindow(hWnd))
let sClass = GetWindowClass(hWnd)
let sButtonName = GetWindowText (hwnd, false)
let sWindowText = GetWindowText (GetParent (hwnd), false)
let strSegment1 = StringSegment (sRealWindow, cscSpace, 1)
let strSegment2 = StringSegment (sRealWindow, cscSpace, 2)
let strSegment3 = StringSegment (sRealWindow, cscSpace, 3)
;If (IsSameScript ()) then
;Use the constant definition in HjHelp.jsh for your application
;AppFileTopic ()
;return
;EndIf
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
If Subtype == wt_Button then
	If ScreenSensitiveHelpBackAndNext (sButtonName) then
		Return
	EndIf
EndIf
;for maine frame viewer dialog
If (sRealWindow == cscNull) then
	let sClass = GetWindowClass (hwnd)
	if (sClass == wcFrameClass) then
		let sRealWindow = GetWindowName (hwnd)
		PerformScript ScreenSensitiveHelp()
		return
	else
	if SubType == WT_BUTTON then
		if id == id_OptionsBtn  then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp9_L)
			AddHotKeyLinks ()
         		return
		ElIf id == id_FramesListBtn  then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp10_L)
			AddHotKeyLinks ()
			return
		ElIf id == id_HelpBtn  then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp11_L)
			AddHotKeyLinks ()
			return
		ElIf id == id_CloseBtn  then
			SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp12_L)
			AddHotKeyLinks ()
			return
		Else
			PerformScript ScreenSensitiveHelp()
			return
		EndIf
	Else
		PerformScript ScreenSensitiveHelp()
		return
	EndIf
		return
	EndIf
;in a frame
ElIf 	(sClass == wcFrameClass) then
	SayFormattedMessage(OT_USER_BUFFER, msgScreenSensitiveHelpFrame_L)
	AddHotKeyLinks ()
	Return
ElIf strSegment3 == wn_Prompt then
	If ScreenSensitiveHelpForPromptWizard (subtype, id, hwnd) then
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf sRealWindow == wn_create_new_frame  then
	If ScreenSensitiveHelpForCreateFrameWizard (subtype, id, hwnd) then
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf sRealWindow  == wn_FramesList  then
	If ScreenSensitiveHelpForFramesList (subtype, id, hwnd) then
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
;for properties dialog
ElIf StringContains(sRealWindow,wn_Properties) then
	if GetDialogPageName() == sc_general  then
		If ScreenSensitiveHelpForGeneralPage (subtype, id, hwnd) then
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	Elif GetDialogPageName() == sc_rules  then
		If ScreenSensitiveHelpForRulesPage (subtype, id, hwnd) then
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	Elif GetDialogPageName()  == sc_events  then
		If ScreenSensitiveHelpForEventsPage (subtype, id, hwnd) then
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	Elif GetDialogPageName()  == sc_position  then
		If ScreenSensitiveHelpForPositionPage (subtype, id, hwnd) then
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	Else
		PerformScript ScreenSensitiveHelp()
		return
	EndIf
;for create foundation rule wizard
ElIf strSegment2 == wn_Validation then
	If ScreenSensitiveHelpForRulesWizard (subtype, id, hwnd) then
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
;	for Create event dialog
ElIf strSegment2 == wn_Event then
	If ScreenSensitiveHelpForEventsWizard (subtype, id, id_parent, hwnd, sWindowText) then
		return
	Else
		PerformScript ScreenSensitiveHelp ()
	EndIf
Else
	PerformScript ScreenSensitiveHelp ()
	return
EndIf  
EndScript

Script SayWindowPromptAndText ()
var
	handle hwnd,
	int nMode
if handleNoCurrentWindow() then
	return
endIf
Let hwnd = GetCurrentWindow ()
let nMode=smmTrainingModeActive()
smmToggleTrainingMode(TRUE)
If (! HandleCustomWindows (hwnd)) then
	SayFocusedObject()
EndIf
smmToggleTrainingMode(nMode)
EndScript

Void Function WindowResizedEvent (handle hWindow, int iLeft, int iTop, int iRight, int iBottom)
If GetWindowClass (hWindow) == wcFrameClass then
	let GICurrLeft = iLeft
	let GICurrTop = iTop
	let GICurrRight = iRight
	let GICurrBottom = iBottom
	Let GiFunctionID = ScheduleFunction (sfFrames, 1);
;ScheduleFunction will not allow the passing of parameters, so globals are used instead
EndIf
if GiFunctionID then	
;	UnScheduleFunction (GiFunctionID); not necessary
endif
EndFunction

int Function BorderCalc (int iVal1, int iVal2)
If iVal1 > iVal2 then
	Return (iVal1 - iVal2)
ElIf iVal2 > iVal1 then
	Return (iVal2 - iVal1)
else; no diff
	Return 0;
EndIf
EndFunction

void Function CompareWindowDiffs (handle hWindow, int iLeft, int iTop, int iRight, int iBottom)
var
	int iCoordsChanged,
	int iMovedLeft,
	int iMovedUp,
	int iMovedRight,
	int iMovedDown
;Any or all differences may exist
;We compare for non-0 values because a window's coords is not 0
Let iCoordsChanged = 0
If GICurrLeft != GIPrevLeft && GIPrevLeft > 0 then
	Let iMovedLeft = BorderCalc (GICurrLeft, GIPrevLeft)
	Let iCoordsChanged = iCoordsChanged + 1
EndIf
If GICurrTop != GIPrevTop && GIPrevTop > 0 then
	let iMovedUp = BorderCalc (GICurrTop, GIPrevTop)
	Let iCoordsChanged = iCoordsChanged + 1
EndIf
If GICurrRight != GIPrevRight && GIPrevRight > 0 then
	Let iMovedRight = BorderCalc (GICurrRight, GIPrevRight)
	Let iCoordsChanged = iCoordsChanged + 1
EndIf
If GICurrBottom != GIPrevBottom && GIPrevBottom > 0 then
	Let iMovedDown = BorderCalc (GICurrBottom, GIPrevBottom)
	Let iCoordsChanged = iCoordsChanged + 1
EndIf
;If iCoordsChanged is greatere than 3, we know the following:
; Two parallel sides and one other side will be moving.
;actually, the above statement is untrue.
If iCoordsChanged == 0 then ; Nothing happened
	Let GIPrevLeft = GICurrLeft
	Let GIPrevTop = GICurrTop
	Let GIPrevRight = GICurrRight
	Let GIPrevBottom = GICurrBottom
	Return
EndIf
;If iCoordsChanged >= 3 then
	MoveWindowSpeak (iMovedLeft, iMovedUp, iMovedRight, iMovedDown)
;Else
;	ResizeWindowSpeak (iMovedLeft, iMovedUp, iMovedRight, iMovedDown)
;EndIf
;Now initialize globs. 
Let GIPrevLeft = GICurrLeft
Let GIPrevTop = GICurrTop
Let GIPrevRight = GICurrRight
Let GIPrevBottom = GICurrBottom
EndFunction

void function TopAndBottomHelper (int iMovedUp, int iMovedDown);helper function for MoveWindowSpeak
var
	string sMessageLong
if giPrevTop < giCurrTop then ;top edge has moved down
	let sMessageLong = FormatString (msgTopEdgeDown, IntToString (iMovedUp))
	SayMessage (ot_position, sMessageLong)
	return
elif giPrevTop > giCurrTop then ; top edge has moved up
	let sMessageLong = FormatString (msgTopEdgeUp, IntToString (iMovedUp))
	SayMessage (ot_position, sMessageLong)
	return
elif giPrevBottom < giCurrBottom then ;bottom edge has moved down
	let sMessageLong = FormatString (msgBottomEdgeDown, IntToString (iMovedDown))
	SayMessage (ot_position, sMessageLong)
	return
elif giPrevBottom > giCurrBottom then ;bottom edge has moved up
	let sMessageLong = FormatString (msgBottomEdgeUp, IntToString (iMovedDown))
	SayMessage (ot_position, sMessageLong)
	return
endif
return
EndFunction

void Function MoveWindowSpeak (int iMovedLeft, int iMovedUp, int iMovedRight, int iMovedDown)
var
	string sMessageLong,
	string sMessageShort
;Compare sides to see which way we're moving
;Parallel sides have moved equal distance.
if giPrevLeft > giCurrLeft then
	if giPrevRight > giCurrRight then ;Window has moved to the left
		let sMessageLong = FormatString (msgWindowLeft_L, IntToString (iMovedLeft))
		let sMessageShort = FormatString (msgWindowLeft_S, IntToString (iMovedLeft))
		SayMessage (ot_position, sMessageLong, sMessageShort)
		if giPrevTop < giCurrTop then ;Window has also moved down
			let sMessageLong = FormatString (msgWindowDown_L, IntToString (iMovedDown))
			let sMessageShort = FormatString (msgWindowDown_S, IntToString (iMovedDown))
			SayMessage (ot_position, sMessageLong, sMessageShort)
		elif giPrevTop > giCurrTop then ;Window has also moved up
			let sMessageLong = FormatString (msgWindowUp_L, IntToString (iMovedUp))
			let sMessageShort = FormatString (msgWindowUp_S, IntToString (iMovedUp))
			SayMessage (ot_position, sMessageLong, sMessageShort)
		endif
		return
	else	;Window has been resized; left edge has moved left
		let sMessageLong = FormatString (msgLeftEdgeLeft, IntToString (iMovedLeft))
		SayMessage (ot_position, sMessageLong)
		TopAndBottomHelper (iMovedUp, iMovedDown) ;in case window has been resized in two directions
		return
	endif
endif
if giPrevLeft < giCurrLeft then
	if giPrevRight < giCurrRight then;Window has moved to the right
		let sMessageLong = FormatString (msgWindowRight_L, IntToString (iMovedRight))
		let sMessageShort = FormatString (msgWindowRight_S, IntToString (iMovedRight))
		SayMessage (ot_position, sMessageLong, sMessageShort)
		if giPrevTop < giCurrTop then ;window has also moved down
			let sMessageLong = FormatString (msgWindowDown_L, IntToString (iMovedDown))
			let sMessageShort = FormatString (msgWindowDown_S, IntToString (iMovedDown))
			SayMessage (ot_position, sMessageLong, sMessageShort)
		elif giPrevTop > giCurrTop then ;window has also moved up
			let sMessageLong = FormatString (msgWindowUp_L, IntToString (iMovedUp))
			let sMessageShort = FormatString (msgWindowUp_S, IntToString (iMovedUp))
			SayMessage (ot_position, sMessageLong, sMessageShort)
		endif
		return
	else	;Window has been resized; left edge has moved right
		let sMessageLong = FormatString (msgLeftEdgeRight, IntToString (iMovedLeft))
		SayMessage (ot_position, sMessageLong)
		TopAndBottomHelper (iMovedUp, iMovedDown) ;in case window has been resized in two directions
		return
	endif
endif
if giPrevRight < giCurrRight then ; window has been resized; right edge has moved right
	let sMessageLong = FormatString (msgRightEdgeRight, IntToString (iMovedRight))
	SayMessage (ot_position, sMessageLong)
	TopAndBottomHelper (iMovedUp, iMovedDown) ;in case window has been resized in two directions
	return
endif
if giPrevRight > giCurrRight then ;window has been resized; right side has moved left
	let sMessageLong = FormatString (msgRightEdgeLeft, IntToString (iMovedRight))
	SayMessage (ot_position, sMessageLong)
	TopAndBottomHelper (iMovedUp, iMovedDown)
	return
endif
if giPrevTop < giCurrTop then
	if giPrevBottom < giCurrBottom then ;Window has moved down
		let sMessageLong = FormatString (msgWindowDown_L, IntToString (iMovedDown))
		let sMessageShort = FormatString (msgWindowDown_S, IntToString (iMovedDown))
		SayMessage (ot_position, sMessageLong, sMessageShort)
		return
	else	;window has been resized; top edge has moved down
		let sMessageLong = FormatString (msgTopEdgeDown, IntToString (iMovedUp))
		SayMessage (ot_position, sMessageLong)
		return
	endif
endif
if giPrevTop > giCurrTop then
	if giPrevBottom > giCurrBottom then ;window has moved up
		let sMessageLong = FormatString (msgWindowUp_L, IntToString (iMovedUp))
		let sMessageShort = FormatString (msgWindowUp_S, IntToString (iMovedUp))
		SayMessage (ot_position, sMessageLong, sMessageShort)
		return
	else	;window has been resized; top edge has moved up
		let sMessageLong = FormatString (msgTopEdgeUp, IntToString (iMovedUp))
		SayMessage (ot_position, sMessageLong)
		return
	endif
endif
if giPrevBottom < giCurrBottom then ;window has been resized; bottom edge has moved down
	let sMessageLong = FormatString (msgBottomEdgeDown, IntToString (iMovedDown))
	SayMessage (ot_position, sMessageLong)
	return
endif
if giPrevBottom > giCurrBottom then ; window has been resized; bottom edge has moved up
	let sMessageLong = FormatString (msgBottomEdgeUp, IntToString (iMovedDown))
	SayMessage (ot_position, sMessageLong)
	return
endif
EndFunction

script ScriptFileName ()
ScriptAndAppNames (msgFrameViewer)
EndScript

script SayAll ()
;Only modified here for one purpose:
;To automatically speak the frame window (not using SayAll functionality)
If IsPcCursor () then
	If GetWindowClass (GetFocus ()) == wcFrameClass then;custom
		SayWindow (GetFocus (), READ_EVERYTHING);No output type as should always speak when key is pressed.
		Return
	Else
		PerformScript SayAll ()
		Return
	EndIf
EndIf
PerFormScript SayAll ()
EndScript

Script SayWindowTitle()
if IsSameScript ()
	SayWindowVisualState()
	return
endIf
var
	handle hwnd,
	handle hApp,
	string sRealName,
	string sClass,
	string sMessageShort,
	string sMessageLong
if handleNoCurrentWindow() then
	return
endIf
let hwnd = GetCurrentWindow()
let hApp = GetAppMainWindow (hwnd)
let sRealName = GetWindowName(hApp)
if (sRealName == cscNull) then
	let sClass = GetWindowClass (hwnd)
if (sClass == wcFrameClass) then
	let sRealName = GetWindowName (hwnd)
	Let sMessageShort = FormatString (msgFrameTitle_s, sRealName)
	Let sMessageLong = FormatString (msgFrameTitle_l, sRealName)
	SayMessage (ot_user_requested_information, sMessageLong, sMessageShort)
	else
	SayMessage (ot_user_requested_information, msgFrameViewer_l, msgFrameViewer)
	EndIf
	return
EndIf
PerformScript SayWindowTitle ()
EndScript

Script StartJAWSTaskList ()
SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

script GraphicsLabeler()
SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script JAWSFind ()
SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script JAWSFindNext ()                                                                            						 SayFormattedMessage (ot_error, msgNotAvailable_l)
SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script BrailleToggleMarking()
SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script WindowClassReassign ()
 SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script CustomHighlightAssign ()
 SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script BrailleColorMarkingAssign ()
SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript
                                                 
                                                 Script ConfigManager ()
 SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script DictionaryManager ()
 SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script ScriptManager ()
 SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script KeyboardManager ()
SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script RunJAWSManager ()
 SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script SetBrailleVerbosity ()
SayMessage (ot_error, msgNotAvailable_l)
EndScript

Script AdjustBrailleOptions()
SayMessage (ot_error, msgNotAvailable_l)
EndScript

Script AdjustJAWSVerbosity ()
 SayMessage (ot_error, msgNotAvailable_l)
EndScript

Script AdjustJAWSOptions()
SayMessage (ot_error, msgNotAvailable_l)
EndScript

Script ListTaskTrayIcons ()
 SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script GraphicsList ()
 SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script AdjustHTMLSettings ()
 SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

Script SelectASynthesizer ()
SayFormattedMessage (ot_error, msgNotAvailable_l)
EndScript

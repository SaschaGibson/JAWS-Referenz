; Copyright 1995-2015 Freedom Scientific, Inc.
; OpenBook Script File
; For OpenBook 5.0 or later
; Braille only,
; since JAWS is asleep while OpenBook has focus.

Include "HjConst.jsh"
Include "HjGlobal.jsh"
include "winstyles.jsh"
include "FSI_ML.jsh";for overwritten whiz wheel codes with Tree View
include "jfw.jsh";ScreenSensitiveHelp:
include "jfw.jsm";ScreenSensitiveHelp
include "MSAAConst.jsh"
include"common.jsm"
Include "obu.jsm"

;use "sara_braille.jsb" ;DO NOT REMOVE THIS LINE - it is used for the SARA build of OBUtil

CONST
	CUSTOM_WT_EXACT_VIEW=1

GLOBALS
	int giTimedRefresh,
	int giOBVersion,
	int gbLockedKeyboard,
	handle gHwndCustomCheckBox

int function isOBUtil ()
;**********
;This is not the same as getRunningFSProducts () & product_OpenBook
;This ensures Obutil is active.
;Use this to know if OpenBook is running without JAWS.
return FindTopLevelWindow ("OB_JFWUI2", "") != null()
endFunction

/*Debug:while checking values when OBUtil is on
void function BrailleRoutingButton (int nCell)
BrailleMessage (IntToString (GetControlID (GetFocus ())))
;BrailleMessage (GetWindowName (GetAppMainWindow (GetFocus ())))
endFunction
*/

void Function AutoStartEvent ()
let giOBVersion = GetProgramVersion (GetAppFilePath ())
endFunction

void function DoFocusWheelAction (int iDirection, int iWheel, int ByRef iWheelSetting, int iSameScript)
var
	handle hFocus
If GetJcfOption (OPT_BRL_MODE) == BRL_MODE_SPEECHBOX then
	If iDirection == up then
		BraillePriorLine ()
	Else
		BrailleNextLine ()
	EndIf
	Return
EndIf
If giXYMode then
	DoWheelsXY (iDirection, iWheel, iWheelSetting, iSameScript)
	Return
EndIf
Let hFocus = GetFocus ()
if GlobalMenuMode
&& GetWindowClass (hFocus) != cwcMSOCmd then;Office bars
	If iDirection == Up then
		PriorLine (INP_BrailleDisplay)
	Else
		NextLine (INP_BrailleDisplay)
	EndIf
	Return
EndIf
if (! DialogActive () && GetWindowSubtypeCode (hFocus) == WT_TREEVIEW) then
	;Must use keyboard as type for line navigation, so item actually changes in the application, allows SayAll to begin reading at the position of the new item.
	;INP_BrailleDisplay better serves for display stand-alone movement, but this requires the application track.
	if iDirection == Up then
		PriorLine (INP_Keyboard)
	Else
		NextLine (INP_Keyboard)
	endIf
	Return
endIf
If IsValidWindow(hFocus) then
	DoWhizWheelAction (iDirection, iWheel, iWheelSetting, iSameScript)
	Return
EndIf
If DoListMode (iDirection, hFocus) then
	Return;
EndIf
If iDirection == up then
	ShiftTabKey ()
Else
	TabKey ()
EndIf
EndFunction

int Function DialogNeedsBrailleText ()
return (giOBVersion <= 8 || DialogActive () && ! IsMultipageDialog ()
&& (GetWindowSubtypeCode (GetFocus ()) == WT_STATIC || GetWindowSubtypeCode (GetFocus ()) == WT_READONLYEDIT))
endFunction

void function ObjStateChangedEvent(handle hObj, int iObjType, int nChangedState, int nState, int nOldState)
;SayInteger (iObjType);debug
if iObjType == WT_CHECKBOX || getWindowSubtypeCode (hObj) == WT_CHECKBOX then
	if (nState & CTRL_CHECKED || nState & STATE_SYSTEM_CHECKED) then
		Let gHwndCustomCheckBox = hObj;
	endIf
endIf
if hObj != GetFocus() then
	return
EndIf
if nSelectingText then
	return
EndIf
if HJDialogObjStateChangeSpoken(hObj,iObjType,nChangedState,nState,nOldState) then
	return
EndIf
;Announce the list item when it changes state:
if iObjType == wt_ListBoxItem
|| iObjType == wt_ExtendedSelect_ListBox
|| iObjType == wt_MultiSelect_ListBox then
	if (!nState || nChangedState == CTRL_SELECTED)
	&& !InHJDialog() then
		;When the item becomes selected, we only announce the name, not the state.
		;When the item becomes deselected, "Not Selected" is part of the name, so we don't need to explicitly announce it.
		Say(GetCurrentListViewItemName(),ot_line)
		return
	EndIf
EndIf
;For the rest of the object types, do not announce change to unavailable state:
if nState == CTRL_GRAYED then
	return
EndIf
if iObjType == wt_RadioButton then
	;if the radio buttons are items in a treeview,
	;then speak them as we would speak a treeview item:
	if GetObjectSubtypeCode(GetFocus()) == wt_TreeView then
		SayTreeViewItem()
		return
	EndIf
	;FocusChangedEvent should announce when radio buttons gain focus,
	;and they should need no further announcement:
	; The only exception is radio buttons in Java applications.  They do not
	; become checked when they gain focus.  Instead you must actually press
	; the space bar in order for a Java radio button to become checked.
	if ( FALSE == IsJavaWindow (hObj) )
	then
		return
	endIf
EndIf
if iObjType == WT_TREEVIEW
|| iObjType == WT_TREEVIEWITEM then
	;SayTreeViewLevel(false)
	;Fix where request was made to have all tree view items speak position in new JAWS Options dialog.
	SayTreeViewLevel (InHjDialog ())
ElIf iObjType == wt_button
|| iObjType == wt_StartButton
|| iObjType == wt_Checkbox then
	;for buttons, we do not want announcement of the pressed state.
	if !(nState & ctrl_pressed) then
		if nState & CTRL_Indeterminate then
			;announce only partially checked, not the checked which is also set
			IndicateControlState(iObjType,CTRL_Indeterminate)
		else
			IndicateControlState(iObjType,(nState & ~ctrl_selected))
		EndIf
	EndIf
else
	IndicateControlState(iObjType, nChangedState)
endIf
EndFunction

int function HandleCustomWindows (handle hWnd)
var
	int iType,
	string sWinName,
	int nProductsList = getRunningFSProducts ()
If ! (nProductsList & product_OpenBook)
|| GlobalMenuMode
|| UserBufferIsActive ()
|| IsVirtualPcCursor () then
	Return HandleCustomWindows (hWnd)
EndIf
Let iType = GetWindowSubtypeCode (hWnd)
If (! InHjDialog ()
&& iType == WT_READONLYEDIT) then
	;This ensures that name doesn't speak twice.
	;Actually, it ensures that Group box name does not speak as window name.
	Let sWinName = GetWindowName (hWnd)
	If GetWindowSubtypeCode (GetPriorWindow (hWnd)) == WT_GROUPBOX then
		IndicateControlType (iType, sWinName)
		Return TRUE
	EndIf
EndIf
Return HandleCustomWindows (hWnd)
endFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
var
	string sClass
let sClass = GetWindowClass(hWnd)
if sClass == "msctls_statusbar32" then
	return true
endif
if hWnd == hFocus then
	;The following conditions have been "pruned" from the default, to ensure that list boxes and list views will work.
	if sClass == cwcListView
	|| sClass == cwc_ListBox
		return false
	EndIf
EndIf
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction

void function SayHighlightedText (handle hWnd, string buffer)
var
	int iWinType,
	handle hWndTemp
If hWnd == GetFocus () then
	If DialogActive ()
	&& ! InHjDialog () then
		Let iWinType = GetWindowSubTypeCode (hWnd)
		If iWinType == WT_LISTBOX
		|| iWinType == WT_LISTVIEW then
			SaveCursor ()
			PcCursor ()
			SayLine ()
			Return;
		EndIf
	EndIf
EndIf
if ( hwnd != getFocus () &&DialogActive () )
	if ( getWindowSubtypeCode (hWnd) == WT_LISTBOX )
		Return;There are places where Windows 7 causes list box to refresh even though it is not in focus,
		;particularly in Braille > Cursor Settings
	endIf
endIf
SayHighlightedText (hWnd, buffer)
EndFunction

string Function GetOBCustomText ()
var
	handle hWnd,
	string sText;
if ! DialogNeedsBRailleText () then
	return cscNull;
endIf
;if gHwndCustomCheckBox && isWindowVisible (gHwndCustomCheckBox) then
	;let sText = GetWindowName (gHwndCustomCheckBox)
	;if StringIsBlank (sText) then
		;let sText = GetWindowText  (gHwndCustomCheckBox, READ_EVERYTHING)
	;endIf
	;return sText
;endIf
let hWnd = GetFocus ()
let sText = cscNull
While (hWnd)
	If GetWindowSubtypeCode (hWnd) == WT_CHECKBOX then
		SaveCursor ()
		InvisibleCursor ()
		SaveCursor ()
		MoveToWindow (hWnd)
		if hWnd != GetCurrentWindow () then
			MoveToControl (GetRealWindow (hWnd), GetControlID (hWnd))
		endIf
		if ControlIsChecked () then
		;|| GetControlAttributes () & CTRL_CHECKED then
			Let sText = getWindowName (hWnd)
			if StringIsBlank (sText) then
				Let sText = GetWindowText (hWnd, READ_EVERYTHING)
			endIf
		endIf
		RestoreCursor ()
		RestoreCursor ()
	endIf
	Let hWnd = GetNextWindow (hWnd)
endWhile
return sText
endFunction

void Function FocusPointMovedEvent (int nX, int nY, int nOldX, int nOldY, int nUnit, int nDir, int nTimeElapsed)
;we must make sure that braille refreshes when arrowing through menus:
if GlobalMenuMode && giOBVersion <= 8 then
	if BrailleInUse() then
		BrailleRefresh()
	EndIf
EndIf
EndFunction

void Function SayNonhighlightedText (handle hWnd, string buffer)
var
	string  sStatus
if GetWindowSubtypeCode (hWnd) == WT_STATUSBAR then
	Let sStatus = StringSegment (buffer, cscPeriod, 1)
	if ! StringIsBlank (sStatus)
	&& ! StringContains (sStatus, wn_HELP_TEXT)
	&& ! StringContains (sStatus, wn_LINE)then
	;"Say" for JAWS users, and Braille for all users:
		SayMessage (OT_USER_REQUESTED_INFORMATION, sStatus)
		;In case SayMessage won't "go through" in obUtil:
		BrailleMessage (StringSegment (buffer, cscPeriod, 1))
	endIf
endIf
endFunction

int Function HandleCustomRealWindows (handle hWnd)
if giOBVersion <= 8 &&DialogNeedsBrailleText () then
	let giTimedRefresh = ScheduleFunction ("TimedRefresh", 5)
endIf
Return HandleCustomRealWindows (hWnd)
endFunction

void Function TimedRefresh ()
unScheduleFunction (giTimedRefresh)
if DialogNeedsBrailleText () && giOBVersion <= 8 then
	BrailleRefresh ()
	let giTimedRefresh = ScheduleFunction ("TimedRefresh", 2)
endIf
endFunction


Int Function IsExactView (handle hWnd)
var
	string sClass
If (! IsPcCursor ()) then
	Return FALSE; Allow navigation with the JAWS cursor
EndIf
If DialogActive () then
	Return FALSE
EndIf
if MenusActive () then
	;For either menus or menu bars
	Return FALSE
EndIf
If ! (GetNextWindow (hWnd)) then
	Let sClass = GetWindowClass (hWnd)
	If sClass == wcOBUClass then
		Return TRUE
	EndIf
EndIf
EndFunction

int Function BrailleCallbackObjectIdentify ()
;SayString ("callback");debug:
if IsTouchCursor() then
	return GetTouchNavElementBrlSubtype()
EndIf
if IsExactView (GetFocus ()) then
	Return WT_CUSTOM_CONTROL_BASE+CUSTOM_WT_EXACT_VIEW
endIf
return BrailleCallbackObjectIdentify ()
endFunction

int Function BrailleAddObjectExactViewName (int nSubType)
If nSubType == WT_CUSTOM_CONTROL_BASE+CUSTOM_WT_EXACT_VIEW then
	BrailleAddString (msgExactViewLine,0,0,0)
	Return TRUE
EndIf
EndFunction

int Function BrailleAddObjectExactViewType (int nSubType)
BrailleAddString (msgGraphic,0,0,0)
Return TRUE
EndFunction

int Function BrailleAddObjectObMessages (int nSubtype)
var
	string sText
if (giOBVersion >= 9)
	return FALSE; no custom text in OB9 improved handling.
endIf
if nSubtype != WT_STATIC && nSubtype != WT_READONLYEDIT then
	return FALSE
endIf
if nSubtype == wt_static
&& getWindowSubtypeCode (getNextWindow (getFocus ())) == WT_READONLYEDIT then
	let sText = GetWindowName (GetFocus ())
	if ! StringIsBlank (sText) then
		let sText = sText + cscSpace
	endIf
	let sText = sText + GetWindowText (GetNextWindow (GetFocus ()), READ_EVERYTHING)
endIf
BrailleAddString (sText,0,0,0)
BrailleAddString (GetOBCustomText(),0,0,0)
return TRUE
endFunction

int Function BrailleAddObjectValue (int nType)
if IsTouchCursor() then
	return BrailleAddObjectValue (nType)
endIf
if (nType == WT_STATIC && giOBVersion >= 9)
	return TRUE
endIf
if nType != WT_COMBOBOX then
	return BrailleAddObjectValue (nType)
endIf
;BrailleAddString (formatString ("Type: %1. Value: %2", intToString (nType), getObjectValue (TRUE)), 0,0,0)
if dialogActive () then
	BrailleAddString (getObjectValue (TRUE),0,0,getCharacterAttributes ())
	return TRUE
endIf
return BrailleAddObjectValue (nType)
endFunction

int function BrailleBuildStatus ()
if gbLockedKeyboard then
	return jaws_braille::BrailleBuildStatus ()
elif IsExactView (GetFocus ()) then
	BrailleSetStatusCells (msgExactViewStatus)
	Return TRUE
EndIf
Return BrailleBuildStatus ()
EndFunction

Script BrailleRouting ()
var
	int nCell
if BrailleIsMessageBeingShown() then
	brailleClearMessage()
	return
endIf
let nCell = GetLastBrailleRoutingKey ()
if gbBrailleStudyModeActive then
	SALModeButton(nCell,sal_SayCharacter)
	return
EndIf
If (IsExactView (GetCurrentWindow ())
|| getWindowSubtypeCode (getFocus ()) == WT_STATIC) then
	Return
Else
	PerformScript BrailleRouting ()
EndIf
EndScript

int function ScreenSensitiveHelpBrailleManager ()
var
	handle hWnd,
	int iType,
	int ID
let hWnd = GetFocus ()
if GetWindowName (GetAppMainWindow (hWnd)) != wn_BRL_MAN ;then
&& GetWindowName (GetRealWindow (hWnd)) != wn_BRL_MAN then
	return FALSE
endIf
let ID = GetControlID (hWnd)
let iType = GetWindowSubtypeCode (hWnd)
if iType == WT_TREEVIEW then
	PopToolTipAtFocus (msgSsh_Obutil_TREEVIEW)
	return TRUE
elif iType == WT_LISTVIEW then
	PopToolTipAtFocus (msgSsh_Obutil_LISTVIEW)
	return TRUE
elif ID == 1001 then;Properties, or port:
	if iType == WT_EDITCOMBO then
		PopToolTipAtFocus (msgSsh_Obutil_PortEdcbo)
		return TRUE
	endIf
	PopToolTipAtFocus (msgSsh_Obutil_PROPERTIES)
	return TRUE
elif ID == 1002 then;ManageDevices
	PopToolTipAtFocus (msgSsh_Obutil_ManageDevices)
	return TRUE
elIf ID == 1007 then;Description
	PopToolTipAtFocus (msgSsh_Obutil_Description)
	return TRUE
elIf ID ==  12323 then;BackBtn
	PopToolTipAtFocus (msgSsh_Obutil_BackBtn)
	return TRUE
elIf ID ==  12324 then;NextBtn
	PopToolTipAtFocus (msgSsh_Obutil_NextBtn)
	return TRUE
elIf ID == 12325 then;FinishBtn
	PopToolTipAtFocus (msgScreenSensitiveHelp8_L)
	return TRUE
elIf ID == 1009 then;PrimaryDevice
	PopToolTipAtFocus (msgSsh_Obutil_PrimaryDevice)
	return TRUE
endIf
endFunction

script ScreenSensitiveHelp ()
var
	handle hWnd,
	int ID,
	int iType,
	string sdlgName,
	int nProductsList = getRunningFSProducts ();
if ! isObutil ()
&& (nProductsList & product_JAWS) then
	performscript ScreenSensitiveHelp ()
	return
endIf
let hWnd = GetFocus ()
let ID = GetControlID (hWnd)
let iType = GetWindowSubtypeCode (hWnd)
let sdlgName = getWindowName (GetRealWindow (hWnd))
if ScreenSensitiveHelpBrailleManager () then
	return
endIf
if GetWindowSubtypeCode (hWnd) == WT_BUTTON && ID < 3 then;OK and Cancel
	if ID == 1 then;OK
		PopToolTipAtFocus (msgScreenSensitiveHelp8_L)
	elif ID == 2 then;Cancel
		PopToolTipAtFocus (msgScreenSensitiveHelp9_L)
	endIf
endIf
if sdlgName == wn_Brl_Basic_Settings then
	if ID == id_default_brl_dsply then
		PopToolTipAtFocus (msgSsh_Obutil_default_brl_disply_combo)
	elif ID == id_modify_settings_btn then
		PopToolTipAtFocus (msgSsh_Obutil_modify_settings_btn)
	elif ID == id_translation_table then
		PopToolTipAtFocus (msgSsh_Obutil_translation_table_combo)
	elif ID == 1177 then;Braille Load Error checkbox:
		PopToolTipAtFocus (msgSsh_Obutil_Brl_load_error_chkbox)
	elif ID == id_add_display_btn then
		PopToolTipAtFocus (msgSsh_Obutil_add_display_btn)
	elif ID == id_advanced_btn then
		PopToolTipAtFocus (msgSsh_Obutil_advanced_btn)
	;elif ID == then
	endIf
elif sdlgName == wn2 then
	if ID == 1341 then;Advanced Braille Display Options btn
		PopToolTipAtFocus (msgSsh_Obutil_advanced_brl_dsply_settings_btn)
	elif ID == 1199 then
		PopToolTipAtFocus (msgSsh_Obutil_G2_Trans_chkbox)
	elif ID == 1200 then;Translate Current Word
		PopToolTipAtFocus (msgSsh_Obutil_G2_expand_word_chkbox)
	elif ID == 1624 then
		PopToolTipAtFocus (msgSsh_Obutil_suppress_capital_signs)
	elif ID == 1298 then;Attribute Rotation
		PopToolTipAtFocus (msgSsh_Obutil_attribute_rotation_combo)
	elif ID == 1621 then;flash messages btn
		PopToolTipAtFocus (msgSsh_Obutil_flash_msgs_btn)
	elif ID == 1164 then;user pan mode combo
		PopToolTipAtFocus (msgSsh_Obutil_user_pan_mode_combo)
	elif ID == 1054  then;fixed pan"ning increment edit
		PopToolTipAtFocus (msgSsh_Obutil_fixed_panning_increment_edit)
	elif ID == 1622 then;auto advance interval combo
		PopToolTipAtFocus (msgSsh_Obutil_autoadvance_increment_combo)
	elif ID == 1323 then;auto pan mode combo
		PopToolTipAtFocus (msgSsh_Obutil_autopan_mode_combo)
	elif ID == 1168 then;active follows Braille
		PopToolTipAtFocus (msgSsh_Obutil_active_follows_brl_chkbox)
	elif ID == 1169 then;Braille follows active
		PopToolTipAtFocus (msgSsh_Obutil_brl_follows_active_chk)
	elif ID == 1170 then;enable Braille auto detection check box
		PopToolTipAtFocus (msgSsh_Obutil_enable_brl_autodetect_chkbox)
	elif ID == 1066 then;8 dot brl chkbox
		PopToolTipAtFocus (msgSsh_Obutil_8dot_brl_chkbox)
	elif ID == 1090 then;Braille Sleep Mode
		PopToolTipAtFocus (msgSsh_Obutil_brl_sleep_chkbox)
	elif ID == 1646 then;word wrap chkbox
		PopToolTipAtFocus (msgSsh_Obutil_word_wrap_chkbox)
	elif ID == 1171 then;cursor settings
		PopToolTipAtFocus (msgSsh_Obutil_cursor_settings_btn)
	elif ID == 1166 then;dot patterns
		PopToolTipAtFocus (msgSsh_Obutil_cursor_settings_btn)
	elif ID == 1342 then; Braille Marking Options btn
		PopToolTipAtFocus (msgSsh_Obutil_brl_marking_options_btn)
	elif ID == 1686 then; Enable Translator check box
		PopToolTipAtFocus (msgSsh_Obutil_enable_translator_chkbox)
	elif ID == 1690 then; Contracted English Braille radio button
		PopToolTipAtFocus (msgSsh_Obutil_contracted_english_braille_rdb)
	elif ID == 1685 then; Unified English Braille radio button
		PopToolTipAtFocus (msgSsh_Obutil_unified_english_braille_rdb)
	elif ID == 1908 then; Braille presentation and panning combo box
		PopToolTipAtFocus (msgSsh_Obutil_braille_presentation_and_panning_combobox)
	;elif ID == then
	endIf
elif sdlgName == wnFocusOptions then
	if iType == WT_RADIOBUTTON then;status cell position
		PopToolTipAtFocus (msgSsh_Obutil_status_cell_position_rdb)
	elif ID == 1346 then;reading start position
		PopToolTipAtFocus (msgSsh_Obutil_reading_start_position)
	elif ID == 1347 then;reading end position
		PopToolTipAtFocus (msgSsh_Obutil_reading_end_position)
	elif ID  == 1350 then;rapid reading chkbox
		PopToolTipAtFocus (msgSsh_Obutil_dotfirmness)
	elif ID == 1351 then
		PopToolTipAtFocus (msgSsh_Obutil_rapidreading_chkbox)
	endif
elif sdlgName == wn_FlashMessages then
	if iType == WT_COMBOBOX then;time out
		PopToolTipAtFocus (msgSsh_Obutil_flashmessage_timeout_combo)
	elif ID == 1628 then;enable flash messages
		PopToolTipAtFocus (msgSsh_Obutil_flashmessages_enable_chkbox)
	elif ID == 1629 then;message prefixes
		PopToolTipAtFocus (msgSsh_Obutil_message_prefix_chkbox)
	elif iType == WT_RADIOBUTTON then; flash message verbosity
		PopToolTipAtFocus (msgSsh_Obutil_flashmessage_verbosity_rdbtns)
	elif  ID then
		PopToolTipAtFocus (FormatString  (msgSsh_Obutil_verbosity_preferences,
		StringSegment (GetWindowName (hWnd), cscSpace, MessageSegment)))
	endif
elif StringSegment (sdlgName,cscSpace,2) == wn_Preferences then
	if ID == 1641 then;Preferences dialog, items to check listbox:
		PopToolTipAtFocus (msgSsh_Obutil_items_to_check_lbx)
	elif iType == WT_RADIOBUTTON then;JAWSMessageLength:
		PopToolTipAtFocus (msgSsh_Obutil_flashmessage_length_rbtn_grp)
	elif ID == 1626 then;Modify Braille Text button
		PopToolTipAtFocus (msgSsh_Obutil_modify_brl_text_btn)
	endIf
elif sdlgName == wn_dotpatterns then
	if iType == WT_LISTBOX then;attribute names
		PopToolTipAtFocus (msgSsh_Obutil_dotpatterns_listbox)
	elif iType == WT_EDIT then;pattern in dot configuration
		PopToolTipAtFocus (msgSsh_Obutil_dotpattern_edit)
	endif
elif sdlgName == wn22 then
	if iType == WT_LISTBOX then;cursor type listbox
		PopToolTipAtFocus (msgSsh_Obutil_cursorTypes_listbox)
	elif ID == 1168 then;dot pattern edit
		PopToolTipAtFocus (msgSsh_Obutil_cursor_dotPattern_edit)
	elif iType == WT_RADIOBUTTON then; Braille cursor (up/down/blinking) radio button grp
		PopToolTipAtFocus (msgSsh_Obutil_Braille_Cursor_UpDownBlinking_rbtn_grp)
	elif ID == 1065 then;rate of blinks
		PopToolTipAtFocus (msgSsh_Obutil_cursor_blink_rate_edit)
	endif
elif sdlgName == wnBM then
	if ID == 1278 then;highlight
		PopToolTipAtFocus (msgSsh_Obutil_marking_options_highlight)
	elif ID == 1279 then;bold
		PopToolTipAtFocus (msgSsh_Obutil_marking_options_bold)
	elif ID == 1280 then;underline
		PopToolTipAtFocus (msgSsh_Obutil_marking_options_underline)
	elif ID == 1281 then;italic
		PopToolTipAtFocus (msgSsh_Obutil_marking_options_italic)
	elif ID == 1282 then;strikeout
		PopToolTipAtFocus (msgSsh_Obutil_marking_options_strikeout)
	endIf
;elif sdlgName == then
endIf
endScript

;The following two undocumented scripts are there to support OBUtil,
;and just call the legal name, TopOfFile and BottomOfFile
script JAWSTopOfFile ()
PerformScript TopOfFile ()
endScript

script JAWSBottomOfFile ()
PerformScript BottomOfFile ()
endScript

Script MinimizeAllApps ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript MinimizeAllApps()
Endif
EndScript

Script StartMenu ()
if !isOBUtil() then
	PerformScript StartMenu()
Endif
EndScript

Script BrailleColorMarkingAssign(int index)
if !isOBUtil() then
	PerformScript BrailleColorMarkingAssign()
Endif
EndScript

Script SetBrailleVerbosity(int index)
if !isOBUtil() then
	PerformScript SetBrailleVerbosity()
Endif
EndScript

void Function BrailleAltTab (int index)
if !isOBUtil() then
	PerformScript BrailleAltTab()
Endif
EndFunction

void function BrailleToggleTableReading ()
if !isOBUtil() then
	PerformScript BrailleToggleTableReading()
Endif
EndFunction

void function BrailleToggleTableHeaders ()
if !isOBUtil() then
	PerformScript BrailleToggleTableHeaders()
Endif
EndFunction

Script MoveToNextNonLinkText ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript MoveToNextNonLinkText()
Endif
EndScript

Script MoveToPriorNonLinkText ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript MoveToPriorNonLinkText()
Endif
EndScript

Script JAWSWindow ()
if !isOBUtil() then
	PerformScript JAWSWindow()
Endif
EndScript

Script GraphicsLabeler ()
If !isOBUtil() then
	 PerformScript GraphicsLabeler ()
Endif
EndScript

Script AdjustJAWSOptions ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript AdjustJAWSOptions ()
Endif
EndScript

Script SayFont ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript SayFont ()
Endif
EndScript

Script SelectAVoiceProfile ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript SelectAVoiceProfile ()
Endif
EndScript

script DisplayVoiceProfilesContextMenu ()
if !isOBUtil()
&& getRunningFSProducts () & product_MAGic then
	PerformScript DisplayVoiceProfilesContextMenu ()
Endif
EndScript

Script WindowKeysHelp ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript WindowKeysHelp ()
Endif
EndScript

Script RefreshScreen ()
if !isOBUtil() then
	PerformScript RefreshScreen ()
Endif
EndScript

Script FrameGetTopLeft ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript FrameGetTopLeft ()
Endif
EndScript

Script FrameGetBottomRight ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript FrameGetBottomRight ()
Endif
EndScript

Script JAWSFind ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	doJAWSFind (FALSE)
Endif
EndScript

Script MAGicFind ()
if !isOBUtil()
&& getRunningFSProducts () & product_MAGic then
	doMAGicFind (FALSE)
Endif
EndScript

Script RunJAWSManager ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript RunJAWSManager ()
Endif
EndScript

Script JAWSFindNext ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	DoJAWSFindNext()
Endif
EndScript

Script MAGicFindNext ()
if !isOBUtil()
&& getRunningFSProducts () & product_MAGic then
	DoJAWSFindNext()
Endif
EndScript

Script ShutDownJAWS ()
if !isOBUtil() then
	PerformScript  ShutDownJAWS ()
Endif
EndScript

Script SelectAHeading ()
if !isOBUtil() then
	PerformScript  SelectAHeading ()
Endif
EndScript

Script SelectALink ()
if !isOBUtil() then
	PerformScript SelectALink ()
Endif
EndScript

Script SelectAFrame ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript  SelectAFrame ()
Endif
EndScript

Script StartJAWSTaskList ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript  StartJAWSTaskList ()
Endif
EndScript

Script ListTaskTrayIcons ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript  ListTaskTrayIcons ()
Endif
EndScript

Script RouteJAWSCursorToPc ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript  RouteJAWSCursorToPc ()
Endif
EndScript

Script RoutePCCursorToJAWS ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript  RoutePCCursorToJAWS ()
Endif
EndScript

Script SpeakBrailleStudyCharacterInfo ()
if getRunningFSProducts () & product_JAWS then
	PerformScript  SpeakBrailleStudyCharacterInfo ()
Endif
EndScript

Script SpeakBrailleStudyWordInfo (int index)
if getRunningFSProducts () & product_JAWS then
	PerformScript  SpeakBrailleStudyCharacterInfo ()
Endif
EndScript

Script JAWSCursor ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript  JAWSCursor ()
Endif
EndScript

Script AdjustBrailleOptions ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript AdjustBrailleOptions ()
Endif
EndScript

Script PCCursor ()
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript  PCCursor ()
Endif
EndScript

Script RouteBrailleToPC (optional int index)
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript RouteBrailleToPC(index)
Endif
EndScript

Script RouteBrailleToActiveCursor (optional int index)
if !isOBUtil()
&& getRunningFSProducts () & product_JAWS then
	PerformScript RouteBrailleToActiveCursor(index)
Endif
EndScript

int function BrailleAddObjectState(int nType)
if IsTouchCursor() then
	return BrailleAddObjectState(nType)
endIf
if nType == wt_ListBox then
	SuppressG2TranslationForNextStructuredModeSegment()
	BrailleAddString(BrailleGetStateString(GetObjectStateCode(true)),
		GetCursorCol(), GetCursorRow(), 0)
	return true
EndIf
return BrailleAddObjectState(nType)
EndFunction

;Although these were initially parts of MAGic, they have merit in the context of both JAWS and OBUtil.
;SpeechOff is a property of any product, and consequently these will work as expected.
Script SayLine ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayLine ()
endIf
endScript

Script SayNextLine ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayNextLine ()
endIf
endScript

Script SelectNextLine ()
if IsSpeechOff () then
	TypeKey(cksSelectNextLine)
else
	PerformScript SelectNextLine ()
endIf
endScript

Script SayPriorLine ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayPriorLine ()
endIf
endScript

Script SelectPriorLine ()
if IsSpeechOff () then
	TypeKey(cksSelectPriorLine)
else
	PerformScript SelectPriorLine ()
endIf
endScript

Script SayWord ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayWord ()
endIf
endScript

Script SayNextWord ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayNextWord ()
endIf
endScript

Script SelectNextWord ()
if IsSpeechOff () then
	TypeKey(cksSelectNextWord)
else
	PerformScript SelectNextWord ()
endIf
endScript

Script SayPriorWord ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayPriorWord ()
endIf
endScript

Script SelectPriorWord ()
if IsSpeechOff () then
	TypeKey(cksSelectPriorWord)
else
	PerformScript SelectPriorWord ()
endIf
endScript

Script SayCharacter ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayCharacter ()
endIf
endScript

Script SayNextCharacter ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayNextCharacter ()
endIf
endScript

Script SelectNextCharacter ()
if IsSpeechOff () then
	TypeKey(cksSelectNextCharacter)
else
	PerformScript SelectNextCharacter ()
endIf
endScript

Script SayPriorCharacter ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayPriorCharacter ()
endIf
endScript

Script SelectPriorCharacter ()
if IsSpeechOff () then
	TypeKey(cksSelectPriorCharacter)
else
	PerformScript SelectPriorCharacter ()
endIf
endScript

Script SaySentence ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SaySentence ()
endIf
endScript

Script SayPriorSentence ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayPriorSentence ()
endIf
endScript

Script SayNextSentence ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayNextSentence ()
endIf
endScript

Script SayParagraph ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayParagraph ()
endIf
endScript

Script SayNextParagraph ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayNextParagraph ()
endIf
endScript

Script SayPriorParagraph ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayPriorParagraph ()
endIf
endScript

Script SayToCursor ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayToCursor ()
endIf
endScript

Script SelectFromStartOfLine ()
if IsSpeechOff () then
	TypeKey(cksSelectToStartOfLine)
else
	PerformScript SelectFromStartOfLine ()
endIf
endScript

Script SelectToEndOfLine ()
if IsSpeechOff () then
	TypeKey(cksSelectToEndOfLine)
else
	PerformScript SelectToEndOfLine ()
endIf
endScript

Script SayFromCursor ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayFromCursor ()
endIf
endScript

Script SayAllFromLocation ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayAllFromLocation ()
endIf
endScript

Script SayTopLineOfWindow ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayTopLineOfWindow ()
endIf
endScript

Script SayBottomLineOfWindow ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript SayBottomLineOfWindow ()
endIf
endScript

Script TopOfFile ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript TopOfFile ()
endIf
endScript

Script SelectFromTop ()
if IsSpeechOff () then
	TypeKey(cksSelectToTop)
else
	PerformScript SelectFromTop ()
endIf
endScript

Script BottomOfFile ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript BottomOfFile ()
endIf
endScript

Script SelectToBottom ()
if IsSpeechOff () then
	TypeKey(cksSelectToBottom)
else
	PerformScript SelectToBottom ()
endIf
endScript

script Home ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript Home ()
endIf
endScript

script End ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript End ()
endIf
endScript
Script SelectPriorScreen ()
if IsSpeechOff () then
	TypeKey(cksSelectPriorScreen)
else
	PerformScript SelectPriorScreen ()
endIf
endScript

script PageUp ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript PageUp ()
endIf
endScript

Script SelectNextScreen ()
if IsSpeechOff () then
	TypeKey(cksSelectNextScreen)
else
	PerformScript SelectNextScreen ()
endIf
endScript

Script PageDown ()
if IsSpeechOff () then
	TypeCurrentScriptKey ()
else
	PerformScript PageDown ()
endIf
endScript

; Sending 2 toggle keys for OpenBook as OpenBook will
; handle the toggle keys toggle when it has focus
Script MagicKey()
if (IsSameScript()) then
    TypeCurrentScriptKey()
    TypeCurrentScriptKey()
endif
EndScript

Script SaySelectedText ()
if isOBUtil ()
;avoid scenario where JAWS is running and Sleep Mode was turned off:
;IsSpeechOff literally means Is MAGic Speech Off in this instance, not OpenBook internal self-voicing speech off.
|| IsSpeechOff() && ! ( GetRunningFSProducts () & product_JAWS)
	TypeCurrentScriptKey ()
	return
endIf
PerformScript SaySelectedText ()
endScript

Script SayWindowTitle ()
if isOBUtil ()
;avoid scenario where JAWS is running and Sleep Mode was turned off:
;IsSpeechOff literally means Is MAGic Speech Off in this instance, not OpenBook internal self-voicing speech off.
|| IsSpeechOff() && ! ( GetRunningFSProducts () & product_JAWS)
	TypeCurrentScriptKey ()
	return
endIf
PerformScript SayWindowTitle ()
EndScript

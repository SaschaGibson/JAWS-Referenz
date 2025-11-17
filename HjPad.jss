;Scripts for HjPad
;Copyright 1999-2021 by Freedom Scientific BLV Group, LLC
;version 4.00.00
;
;****************************************
;*	        Written By		*
;*	Freedom Scientific Scripting	*
;*		Team Gold		*
;****************************************
;
include "HjHelp.jsh"
include "HjConst.jsh"
include "hjglobal.jsh"
include "HjPad.jsh"
include "HjPad.jsm"
include "common.jsm"

void Function AutoStartEvent ()
;We use the MaximizeWindow function so we can make sure that the ReadWordInContext function works right.
MaximizeWindow ()
EndFunction

void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
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
if ((GetWindowClass (focusWindow) == wcDialog)
|| (GetWindowClass (focusWindow) == wcStatic)
&& (GetWindowName (focusWindow) == wn1)) then
	return
endif
if (GlobalPrevApp != AppWindow && AppWindow != FocusWindow) then
	; we've switched to a different app main window,
	; and it does not have the focus, so announce it
	SayWindowTypeAndText (AppWindow)
endif
if ((GlobalPrevRealName != RealWindowName) ; name has changed
|| (GlobalPrevReal != RealWindow)) then ; or handle has changed, then
	if ((RealWindow != AppWindow) && (RealWindow != FocusWindow)) then
		if (RealWindowName != wn1) then
			SayWindowTypeAndText (RealWindow)
		endif
	endif
endif
;wn1 = "Check Spelling"
if ((RealWindowName == wn1) && (GetControlId (GetFocus ()) == iD_Spelling_Edit)) then
	;Too verbose, just speak the window type and text
	;DoReadMisSpelledAndSuggestion ()
	SayWindowTypeAndText(GetFocus())
	return
endif
let GlobalFocusWindow = FocusWindow
if (GlobalPrevFocus != focusWindow) then
	SayFocusedWindow () ; will use global variable GlobalFocusWindow
else
	SayFocusedObject ()
endif
;above perform will return here to finish this routine
;now set all the global variables for next time.
let GlobalPrevReal = RealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

void Function SayHighlightedText (handle hWnd, string buffer)
var
	int iHwndControl,
	int iFocusControl,
	int iObjType,
	string sWinName
let iHwndControl = GetControlId (hWnd)
let iFocusControl = GetControlId (GetFocus ())
let sWinName = GetWindowName (GetRealWindow (GetFocus ()))
;wn1 = "Check Spelling"
if (sWinName == wn1) then
	if(GetWindowClass (GetFocus ()) == wcListBox) then
		Say (buffer, OT_BUFFER)
		SpellString (buffer)
		return
	endif ; End of control check keep it from chattering ;and add to spell item after spoken.
	if (iFocusControl == iD_Spelling_Edit) ||
	(GetWindowClass (hWnd) == wcDialog) ||
	(GetWindowClass (hWnd) == wcStatic) ||
	(iHwndControl == iD_Spelling_Edit) then
		return
	endif
	return
endif
;This block is to prevent the excessive speaking of text in combo boxes
if DialogActive ()  then
	let iObjType = GetObjectSubTypeCode()
	if hwnd == getCurrentWindow()
	|| GetObjectSubTypeCode() == WT_COMBOBOX
	|| (iObjType == wt_EditCombo && GetWindowClass(GetParent(hWnd)) == cwc_AutoSuggestDropdown) then
		SayHighlightedText (hWnd, buffer)
	endif
	return
endif
SayHighlightedText (hWnd, buffer)
EndFunction

void Function SayNonHighlightedText (handle hWnd, string buffer)
var
	int iHwndControl,
	int iFocusControl,
	string sWinName,
	string sClass
let sClass = GetWindowClass (hWnd)
let iHwndControl = GetControlId (hWnd)
let iFocusControl = GetControlId (GetFocus ())
let sWinName = GetWindowName (GetRealWindow (GetFocus ()))
;wn1 = "Check Spelling"
if (sWinName == wn1) then
	;wn5="#32771"
	if sClass == wn5 then
		SayFormattedMessage (OT_NONHIGHLIGHTED_SCREEN_TEXT, buffer)
		return
	endif
	if (iHwndControl != iFocusControl) then
		if iHwndControl  == iD_Spelling_Edit  &&iFocusControl == 	id_ignore_btn  ||
		iHwndControl  == iD_Spelling_Edit  && iFocusControl == id_ignoreAll_btn  ||
		iHwndControl  == iD_Spelling_Edit  && iFocusControl ==  id_Change_btn ||
		iHwndControl  == iD_Spelling_Edit  && iFocusControl == id_ChangeAll_btn  then
			DoReadMisSpelledAndSuggestion ()
			Return
		 Else
				return
		EndIf
	endif ; End of control check keep it from chattering
	if (iFocusControl != iD_Spelling_Edit) then
		return; no chatter in list or combo boxes
	endif
	;Too Verbose, only spell automatically the first time the window is opened.
	;DoReadMisSpelledAndSuggestion ()
	Return
EndIf
SayNonHighlightedText (hWnd, buffer)
EndFunction

void Function SayFocusedWindow ()
var
	int iControl,
	string sWinName,
	string sSpellWord, ;For suggest list
	handle hFont,
	handle hSize
If SayFocusedHJDialogWindow(GlobalFocusWindow) then
	return
EndIf
let iControl = GetControlId (GetFocus ())
let sWinName = GetWindowName (GetRealWindow (GetFocus ()))
;wn1 = "Check Spelling"
if (sWinName == wn1) then
	If (iControl == ID_Spelling_Edit) then
		return
	ElIf iControl == iD_Suggestions_List then
		SayWindowTypeAndText (GlobalFocusWindow)
		;Too Verbose, just say window type and text
		;Let sSpellWord = GetWindowText (GlobalFocusWindow, TRUE)
		;If sSpellWord then
		;	SpellString (sSpellWord)
		;EndIf
		Return
	EndIf
elif (GetControlID (GetFocus ()) == 1042) &&
(GetWindowSubtypeCode(GetFocus ()) != WT_CHECKBOX) then
	SayFocusedWindow ()
	TypeKey (ks1)
	PerformScript SayAll()
	return
endif
;in the Font Dialog
if (GetWindowSubtypeCode (GetRealWindow(GetCurrentWindow())) == wt_dialog) &&
(GetWindowName(GetRealWindow(GetCurrentWindow())) == wn3) then
;Get the handle of the Font combo and the size combo because they are not spoken and there is no other way to distinguish these controls from other controls
	let hFont = GetNextWindow(GetFirstChild(GetNextWindow(GetFirstChild (GetRealWindow(GetCurrentWindow())))))
	let hSize = GetNextWindow(GetFirstChild(GetNextWindow(GetNextWindow(GetNextWindow(GetNextWindow(GetNextWindow(GetFirstChild (GetRealWindow(GetCurrentWindow())))))))))
	if GetCurrentWindow() == hFont then
		SayFormattedMessage(OT_CONTROL_NAME, msg4_L)
	endif
	if GetCurrentWindow() == hSize then
		SayFormattedMessage(OT_CONTROL_NAME, msg5_L)
	endif
endif
;Tabs dialog
if (GetWindowSubtypeCode (GetRealWindow(GetCurrentWindow())) == wt_dialog) &&
(GetWindowName(GetRealWindow(GetCurrentWindow())) == wn4) then
	if GetControlId(GetCurrentWindow()) == ID_TABS_COMBO  then
		SayFormattedMessage(OT_CONTROL_NAME, msg6_L)
	endif
endif
SayFocusedWindow ()
EndFunction

Script ScriptFileName ()
ScriptAndAppNames (msgScriptKeyHelp1)
EndScript

void Function DoReadMisSpelledAndSuggestion (int iNotInSpellChecker)
var
	handle hWnd,
	handle hReal,
	int iControl,
	string sWinName,
	string sClass
let hwnd = GetFocus ()
let hReal = GetRealWindow (hwnd)
let iControl = GetControlId (hwnd)
let sWinName = GetWindowName (hReal)
;wn1 = "Check Spelling"
if (sWinName == wn1) then ; we are in the Spelling dialog
	let hwnd = FindDescendantWindow (hReal, iD_Spelling_Edit)
	SayWindowTypeAndText (hwnd)
	SpellString (GetWindowText (hwnd, false))
	let hwnd = FindDescendantWindow (hReal, iD_Suggestions_List)
	if (StringLength (GetWindowText (hwnd, true)) == 0) then
		SayFormattedMessage (ot_JAWS_message, msg2_L); "No Suggestions"
		return
	endif
		SayFormattedMessage (ot_JAWS_message, msg1_L); "Suggestions:"
	SayWindow (hwnd, true)
	SpellString (GetWindowText (hwnd, true))
else
	if iNotInSpellChecker then
		SayFormattedMessage (ot_error, msg3_L); "Not in SpellChecker"
	EndIf
EndIf
EndFunction

Script ReadMisSpelledAndSuggestion ()
DoReadMisSpelledAndSuggestion (TRUE);Announce "Not in SpellChecker" if appropriate.
EndScript

Script HotKeyHelp ()
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
;wn2 = "List View Tracking My Progress"
if GetWindowName (GetRealWindow (GetCurrentWindow ())) == wn2 then
	SayFormattedMessage (ot_USER_BUFFER, msgHotKeyHelp1_L, msgHotKeyHelp1_S) ; "To mark an item as completed, press C",
	return
endif
PerformScript HotKeyHelp ()
EndScript

Script ScreenSensitiveHelp ()
var
	handle hWnd,
	int id,
	int SubType,
	string sRealWindow
let hWnd = GetCurrentWindow()
let id = GetControlId(hWnd)
let SubType = GetWindowSubtypeCode (hWnd)
let sRealWindow = GetWindowName(GetRealWindow(hWnd))
if (IsSameScript ()) then
	AppFileTopic (topic_HJPad)
	return
endif
If UserBufferIsActive () then
	;Call Default to handle
	PerformScript ScreenSensitiveHelp()
	;UserBufferDeactivate ()
	;SayFormattedMessage (OT_USER_BUFFER, cMsgScreenSensitiveHelpBuf)
	Return
EndIf
;file new dialog
if sRealWindow == wn6 then
	if SubType == WT_LISTBOX  then
		SayFormattedMessage(OT_USER_BUFFER,msgDocType)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
;file open dialog
ElIf sRealWindow == wn7 then
	if id == id_File_Name then
		SayFormattedMessage(OT_USER_BUFFER,msgFileName)
		AddHotKeyLinks()
		return
	ElIf id == id_Files_of_type  then
		SayFormattedMessage(OT_USER_BUFFER,msgFilesOfType)
		AddHotKeyLinks()
		Return
	ElIf id == id_look_in  then
		SayFormattedMessage(OT_USER_BUFFER,msgLookIn)
		AddHotKeyLinks()
		return
	ElIf (id == id_list_view ) && (SubType == WT_LISTVIEW) then
		SayFormattedMessage(OT_USER_BUFFER, msgLookIn)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
;for the file print dialog
ElIf sRealWindow == wn8 then
	if SubType == 	WT_COMBOBOX  then
		if id ==  id_Print_to_name then
			SayFormattedMessage(OT_USER_BUFFER, msgName)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf ;id
	ElIf SubType == WT_BUTTON then
		if id == id_Printer_properties then
			SayFormattedMessage(OT_USER_BUFFER,msgProperties)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf ;id
	ElIf SubType == WT_CHECKBOX then
		if id == id_Print_To_File then
			SayFormattedMessage(OT_USER_BUFFER, msgPrintToFile)
			AddHotKeyLinks()
			return
		ElIf id == id_colate  then
			SayFormattedMessage(OT_USER_BUFFER,msgCollate)
			AddHotKeyLinks()
			Return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;id
	ElIf SubType == 	WT_RADIOBUTTON then
		if (id == id_print_all) || (id == id_print_range_pages) then
			SayFormattedMessage(OT_USER_BUFFER,msgPrintRangeRadioButtons)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;id
	ElIf SubType == 	WT_EDIT_SPINBOX  then
		if id == id_num_of_copies  then
			SayFormattedMessage(OT_USER_BUFFER,NumberOfCopies)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf ;subtype
;for the file page setup dialog
ElIf sRealWindow == wn9 then
	if SubType == WT_COMBOBOX  then
		if id == id_paper_size  then
			SayFormattedMessage(OT_USER_BUFFER,msgPaperSize)
			AddHotKeyLinks()
			return
		ElIf id == id_Paper_source  then
			SayFormattedMessage(OT_USER_BUFFER,msgPaperSource)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;id
	ElIf SubType == 	WT_RADIOBUTTON  then
		if (id == id_portrait) || (id == id_landscape) then
			SayFormattedMessage(OT_USER_BUFFER,msgOrientation)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;id
	ElIf SubType == WT_EDIT  then
		if (id == id_margin_left ) ||
		(id == id_margin_right) ||
		(id == id_margin_top) ||
		(id == id_margin_bottom)  then
			SayFormattedMessage(OT_USER_BUFFER,msgMargins)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	ElIf SubType == WT_BUTTON then
		if id == id_printer_button  then
			SayFormattedMessage(OT_USER_BUFFER, msgPrinterButton)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf  ;SubType
;for the edit find dialog and replace dialog
ElIf (sRealWindow == wn10) ||
(sRealWindow == wn11) then
	if SubType == WT_EDIT  then
		if id == id_find_what  then
			SayFormattedMessage(OT_USER_BUFFER,msgFindWhat)
			AddHotKeyLinks()
			return
		ElIf id == id_Replace_with  then
			SayFormattedMessage(OT_USER_BUFFER,msgReplaceWith)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;id
	ElIf SubType == WT_CHECKBOX then
		if id == id_match_whole_words  then
			SayFormattedMessage(OT_USER_BUFFER, msgMatchWholeWordOnly)
			AddHotKeyLinks()
			return
		ElIf id == id_match_case  then
			SayFormattedMessage(OT_USER_BUFFER,msgMatchCase)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;id
	ElIf SubType == WT_BUTTON then
		if id == id_find_next_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgFindNext)
			AddHotKeyLinks()
			return
		ElIf id == id_replace_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgReplaceButton)
			AddHotKeyLinks()
			return
		ElIf id == id_replace_all_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgReplaceAllButton)
			AddHotKeyLinks()
			return
		ElIf id == id_cancel_btn  then
			SayFormattedMessage(OT_USER_BUFFER, msgCancelButton)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf  ;SubType
;for the view options dialog
ElIf sRealWindow == wn12 then
	if GetDialogPageName() == wn20 then  ;options page
		if SubType == WT_RADIOBUTTON then
			if id == id_inches_rdb  then
				SayFormattedMessage(OT_USER_BUFFER,msgInches)
				AddHotKeyLinks()
				return
			ElIf id == id_centimeters_rdb  then
				SayFormattedMessage(OT_USER_BUFFER,msgCentimeters)
				AddHotKeyLinks()
				return
			ElIf id == id_points_rdb  then
				SayFormattedMessage(OT_USER_BUFFER,msgPoints)
				AddHotKeyLinks()
				return
			ElIf id == id_picas_rdb  then
				SayFormattedMessage(OT_USER_BUFFER,msgPicas)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf  ;id
		ElIf SubType == WT_CHECKBOX then
			if id == id_auto_word_selection_chk then
				SayFormattedMessage(OT_USER_BUFFER,msgAutomaticWordSelection)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf
		ElIf SubType == WT_BUTTON then
			if id == id_ok_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
				AddHotKeyLinks()
				return
			ElIf id == id_cancel_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
				AddHotKeyLinks()
				return
			ElIf id == id_help_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgHelpButton)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;SubType
	Elif GetDialogPageName() == wn21 then  ;display page
		if SubType == WT_RADIOBUTTON then
			if id == id_no_wrap_rdb  then
				SayFormattedMessage(OT_USER_BUFFER, msgNoWrap)
				AddHotKeyLinks()
				return
			ElIf id == id_wrap_to_window  then
				SayFormattedMessage(OT_USER_BUFFER,msgWrapToWindow)
				AddHotKeyLinks()
				return
			ElIf id == id_wrap_to_ruler  then
				SayFormattedMessage(OT_USER_BUFFER,msgWrapToRuler)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf
		ElIf SubType == WT_CHECKBOX then
			if id == id_toolbar_chk  then
				SayFormattedMessage(OT_USER_BUFFER,msgToolbarCheckBox)
				AddHotKeyLinks()
				return
			Elif id == id_formatbar_chk  then
				SayFormattedMessage(OT_USER_BUFFER,msgFormatBarCheckBox)
				AddHotKeyLinks()
				return
			Elif id == id_ruler_chk  then
				SayFormattedMessage(OT_USER_BUFFER,msgRulerCheckBox)
				AddHotKeyLinks()
				return
			Elif id == id_statusbar_chk  then
				SayFormattedMessage(OT_USER_BUFFER,msgStatusBarCheckBox)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf
		ElIf SubType == WT_BUTTON then
			if id == id_ok_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
				AddHotKeyLinks()
				return
			ElIf id == id_cancel_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
				AddHotKeyLinks()
				return
			ElIf id == id_help_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgHelpButton)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf  ;id
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;SubType
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf  ;page name
;for the insert date and time dialog
ElIf sRealWindow == wn13 then
	if SubType == 	WT_LISTBOX  then
		if id == id_formats_listbox  then
			SayFormattedMessage(OT_USER_BUFFER, msgAvailbleFormats)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	ElIf SubType == WT_BUTTON then
		if id == id_ok_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
			AddHotKeyLinks()
			return
		ElIf id == id_cancel_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;id
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
;for the format font dialog
ElIf sRealWindow == wn3 then
	if SubType == WT_EDITCOMBO then
	;get control id of parent to distinguish the controls from each other
	;this is because the ids of all edit combos in this dialog are identical
		if GetControlId(GetParent(hWnd)) == id_parent_font  then
			SayFormattedMessage(OT_USER_BUFFER, msgFont)
			AddHotKeyLinks()
			return
		ElIf GetControlId(GetParent(hWnd)) == id_parent_style  then
			SayFormattedMessage(OT_USER_BUFFER,msgFontStyle)
			AddHotKeyLinks()
			return
		ElIf GetControlId(GetParent(hWnd)) == id_parent_size  then
			SayFormattedMessage(OT_USER_BUFFER,msgSize)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	ElIf SubType == WT_CHECKBOX then
		if (id == id_strikeout_chk) ||(id == id_underline_chk) then
			SayFormattedMessage(OT_USER_BUFFER,msgEffects)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	ElIf SubType == WT_COMBOBOX  then
		if id == id_color_combo  then
			SayFormattedMessage(OT_USER_BUFFER,msgColor)
			AddHotKeyLinks()
			return
		ElIf id == id_script_combo  then
			SayFormattedMessage(OT_USER_BUFFER,msgScript)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	ElIf SubType == WT_BUTTON then
		if id == id_ok_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
			AddHotKeyLinks()
			return
		ElIf id == id_cancel_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;id
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf  ;SubType
;for the format paragraph dialog
ElIf sRealWindow == wn14 then
	if SubType == 	WT_EDIT_SPINBOX  then
		if id == id_indent_left  then
			SayFormattedMessage(OT_USER_BUFFER,msgIndentationLeft)
			AddHotKeyLinks()
			return
		ElIf id == id_indent_right  then
			SayFormattedMessage(OT_USER_BUFFER,msgIndentationRight)
			AddHotKeyLinks()
			return
		ElIf id == id_indent_first_line  then
			SayFormattedMessage(OT_USER_BUFFER,msgIndentationFirstLine)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	ElIf SubType == 	WT_COMBOBOX  then
		if id ==id_alignment_combo then
			SayFormattedMessage(OT_USER_BUFFER,msgAlignment)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	ElIf SubType == WT_BUTTON then
		if id == id_ok_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
			AddHotKeyLinks()
			return
		ElIf id == id_cancel_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;id
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf  ;SubType
;for the format tabs dialog
ElIf sRealWindow == wn4 then
	if SubType == WT_EDITCOMBO then
		if id == id_Tab_stop_position  then
			SayFormattedMessage(OT_USER_BUFFER,msgTabStopPosition)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf
	ElIf SubType == WT_BUTTON then
		if id == id_set_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgSetButton)
			AddHotKeyLinks()
			return
		ElIf id == id_clear_btn then
			SayFormattedMessage(OT_USER_BUFFER,msgClearButton)
			AddHotKeyLinks()
			return
		Elif id == id_ok_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
			AddHotKeyLinks()
			return
		ElIf id == id_cancel_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;id
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf ;SubType
;for the tools spell checker dialog
ElIf sRealWindow == wn1 then
	PerformScript ScreenSensitiveHelp ()
	return
;for the tools sample dialogs single page one dialog
ElIf sRealWindow == wn15 then
	ScreenSensitiveHelpSinglePageDlg()
	return
;for the tools sample dialogs single page two dialog
ElIf sRealWindow == wn16 then
	ScreenSensitiveHelpSinglePageDlg2()
	return
;for the full name dialog
ElIf sRealWindow == wn17 then
	if SubType == WT_EDIT then
		if id == id_FirstName then
			SayFormattedMessage(OT_USER_BUFFER,msgFirstName)
			AddHotKeyLinks()
			return
		ElIf id == id_MiddleName then
			SayFormattedMessage(OT_USER_BUFFER, msgMiddleName)
			AddHotKeyLinks()
			return
		ElIf id == id_LastName then
			SayFormattedMessage(OT_USER_BUFFER, msgLastName)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp()
			return
		EndIf
	ElIf SubType == WT_BUTTON then
		if id == id_ok_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
			AddHotKeyLinks()
			return
		ElIf id == id_cancel_btn  then
			SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
			AddHotKeyLinks()
			return
		Else
			PerformScript ScreenSensitiveHelp ()
			return
		EndIf  ;id
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf   ;SubType
;for the tools sample dialogs multi page dialog
ElIf sRealWindow == wn18 then
	ScreenSensitiveHelpMultiPageDlg()
	return
;for the tools sample dialogs tree view dialog
ElIf sRealWindow == wn19 then
	ScreenSensitiveHelpTreeViewSampleDlg()
	return
;for the tools sample dialogs list view dialog
ElIf sRealWindow == wn22  then
	ScreenSensitiveHelpListViewSampleDlg()
	return
Else
	if id == id_document_ToolBar then
		SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelpHJPadToolbar)
		AddHotKeyLinks()
		return
	EndIf
	PerformScript ScreenSensitiveHelp ()
EndIf
EndScript

Void Function ScreenSensitiveHelpMultiPageDlg()
var
	handle hWnd,
	int id,
	int SubType,
	string sRealWindow
let hWnd = GetCurrentWindow()
let id = GetControlId(hWnd)
let SubType = GetWindowSubtypeCode (hWnd)
if GetDialogPageName () == sc1 then  ;general page
		If SubType == WT_BUTTON then
			if id == id_ok_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
				AddHotKeyLinks()
				return
			ElIf id == id_cancel_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
				AddHotKeyLinks()
				return
			ElIf id == id_help_btn then
				SayFormattedMessage(OT_USER_BUFFER,msgHelpButton)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf  ;id
		Else
			PerFormScript ScreenSensitiveHelp()
			return
		EndIf  ;SubType
	ElIf GetDialogPageName ()  == sc2 then  ;system page
		if SubType == WT_CHECKBOX then
			if id == id_GetHelp then
				SayFormattedMessage(OT_USER_BUFFER, msgGetHelp)
				AddHotKeyLinks()
				return
			Elif id == id_OpenStartMenu then
				SayFormattedMessage(OT_USER_BUFFER, 			msgOpenTheStartMenu)
				AddHotKeyLinks()
				return
			Elif id == id_SwitchBetweenApps then
				SayFormattedMessage(OT_USER_BUFFER, msgSwitchBetweenApplications)
				AddHotKeyLinks()
				return
			Elif id == id_QuitActiveApp then
				SayFormattedMessage(OT_USER_BUFFER, msgQuitTheActiveApplication)
				AddHotKeyLinks()
			return
			Elif id == id_closeChildWindow then
				SayFormattedMessage(OT_USER_BUFFER, msgCloseAChildWindow)
				AddHotKeyLinks()
				return
			Elif id == id_OpenControlMenu then
				SayFormattedMessage(OT_USER_BUFFER, msgOpenAControlMenu )
				AddHotKeyLinks()
				return
			Elif id == id_MinimizeAllWindows then
				SayFormattedMessage(OT_USER_BUFFER, msgMinimizeAllWindows)
				AddHotKeyLinks()
				return
			Elif id == id_OpenContextMenu then
				SayFormattedMessage(OT_USER_BUFFER, msgOpenTheContextMenu)
				AddHotKeyLinks()
				return
			Elif id == id_MoveToMenuBar then
				SayFormattedMessage(OT_USER_BUFFER, msgMoveToTheMenuBar)
				AddHotKeyLinks()
				return
			Elif id == id_ChooseMenuItem then
				SayFormattedMessage(OT_USER_BUFFER, msgChooseAMenuItem)
				AddHotKeyLinks()
				return
			Elif id == id_CancelCloseMenu then
				SayFormattedMessage(OT_USER_BUFFER, msgCancelOrCloseAMenu)
				AddHotKeyLinks()
				return
			Elif id == id_CancelCloseSubMenu then
				SayFormattedMessage(OT_USER_BUFFER, msgCancelOrCloseASubmenu)
				AddHotKeyLinks()
				return
			Elif id == id_OpenRecentDoc then
				SayFormattedMessage(OT_USER_BUFFER, msgOpenRecentlyUsedDocument)
				AddHotKeyLinks()
				return
			Elif id == id_OpenPropertiesDialog then
				SayFormattedMessage(OT_USER_BUFFER, msgOpenThePropertiesDialog)
				AddHotKeyLinks()
				return
			Elif id == id_openFindDialog then
				SayFormattedMessage(OT_USER_BUFFER, msgOpenTheFindDialog)
				AddHotKeyLinks()
				return
			Elif id == id_OpenRunDialog then
				SayFormattedMessage(OT_USER_BUFFER, msgOpenTheRunDialog)
				AddHotKeyLinks()
				return
			Elif id == id_MoveToFirstItemOnTaskBar then
				SayFormattedMessage(OT_USER_BUFFER, msgMoveToTheFirstItemOnTheTaskBar)
				AddHotKeyLinks()
				return
			Elif id == id_OpnWindowsExplorer then
				SayFormattedMessage(OT_USER_BUFFER, msgOpenWindowsExplorer)
				AddHotKeyLinks()
				return
			Elif id == id_ShutDownWindows then
				SayFormattedMessage(OT_USER_BUFFER, msgShutDownWindows)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp()
				return
			EndIf
		ElIf SubType == WT_BUTTON then
			if id == id_ok_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
				AddHotKeyLinks()
				return
			ElIf id == id_cancel_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
				AddHotKeyLinks()
				return
			ElIf id == id_help_btn then
				SayFormattedMessage(OT_USER_BUFFER,msgHelpButton)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf  ;id
		Else
			PerFormScript ScreenSensitiveHelp()
			return
		EndIf  ;SubType
	ElIf GetDialogPageName ()  == sc3 then   ;navigation/editing page
		if SubType == WT_CHECKBOX then
			if id ==id_MoveToAnotherPage then
				SayFormattedMessage(OT_USER_BUFFER,msgMoveToAnotherPage)
				AddHotKeyLinks()
				return
			ElIf id == id_MoveToFirstItem then
				SayFormattedMessage(OT_USER_BUFFER,msgMoveToFirstItem)
				AddHotKeyLinks()
				return
			ElIf id == id_MoveToLast then
				SayFormattedMessage(OT_USER_BUFFER,msgMoveToLastItem)
				AddHotKeyLinks()
				return
			ElIf id == id_MoveUpDownOneScreen then
				SayFormattedMessage(OT_USER_BUFFER,msgMoveUpOrDownOneScreen)
				AddHotKeyLinks()
				return
			ElIf id == id_move1Character then
				SayFormattedMessage(OT_USER_BUFFER,msgMoveOneCharacter)
				AddHotKeyLinks()
				return
			ElIf id == id_Move1Word then
				SayFormattedMessage(OT_USER_BUFFER,msgMoveOneWord)
				AddHotKeyLinks()
				return
			ElIf id == id_Move1Parag then
				SayFormattedMessage(OT_USER_BUFFER,msgMoveOneParagraph)
				AddHotKeyLinks()
				return
			ElIf id == id_MoveToBeg  then
				SayFormattedMessage(OT_USER_BUFFER,msgMoveToBeginning)
				AddHotKeyLinks()
				return
			ElIf id == id_MoveToEnd then
				SayFormattedMessage(OT_USER_BUFFER,msgMoveToEnd)
				AddHotKeyLinks()
				return
			ElIf id == id_Select1Character then
				SayFormattedMessage(OT_USER_BUFFER,msgSelectOneCharacter)
				AddHotKeyLinks()
				return
			ElIf id == id_Select1Word then
				SayFormattedMessage(OT_USER_BUFFER,msgSelectOneWord)
				AddHotKeyLinks()
				return
			ElIf id == id_Select2BegOfLine  then
				SayFormattedMessage(OT_USER_BUFFER,msgSelectToBeginningOfLine)
				AddHotKeyLinks()
				return
			ElIf id == id_select2EndOfLine then
				SayFormattedMessage(OT_USER_BUFFER,msgSelectToEndOfLine)
				AddHotKeyLinks()
				return
			ElIf id == id_Select1Screen then
				SayFormattedMessage(OT_USER_BUFFER,msgSelectOneScreen)
				AddHotKeyLinks()
				return
			ElIf id == id_Select2Beg  then
				SayFormattedMessage(OT_USER_BUFFER,msgSelectToBeginning)
				AddHotKeyLinks()
				return
			ElIf id == id_Select2End  then
				SayFormattedMessage(OT_USER_BUFFER,msgSelectToEnd)
				AddHotKeyLinks()
				return
			ElIf id == id_Copy2ClipBoard then
				SayFormattedMessage(OT_USER_BUFFER,msgCopyToClipboard)
				AddHotKeyLinks()
				return
			ElIf id == id_Cut2ClipBoard then
				SayFormattedMessage(OT_USER_BUFFER,msgCutToClipboard)
				AddHotKeyLinks()
				return
			ElIf id == id_PasteFromClipBoard then
				SayFormattedMessage(OT_USER_BUFFER,msgPasteFromClipboard)
				AddHotKeyLinks()
				return
			ElIf id == id_UndoLastAction then
				SayFormattedMessage(OT_USER_BUFFER,msgUndoLastAction)
				AddHotKeyLinks()
				return
			ElIf id == id_DelCurCharacter then
				SayFormattedMessage(OT_USER_BUFFER,msgDeleteCurrentCharacter)
				AddHotKeyLinks()
				return
			ElIf id == id_DelPriorCharacter then
				SayFormattedMessage(OT_USER_BUFFER,msgDeletePriorCharacter)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp()
				return
			EndIf
		ElIf SubType == WT_BUTTON then
			if id == id_ok_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
				AddHotKeyLinks()
				return
			ElIf id == id_cancel_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
				AddHotKeyLinks()
				return
			ElIf id == id_help_btn then
				SayFormattedMessage(OT_USER_BUFFER,msgHelpButton)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf  ;id
		Else
			PerFormScript ScreenSensitiveHelp()
			return
		EndIf  ;SubType
	ElIf GetDialogPageName ()  == sc4 then  ;Windows/Misc page
		if SubType == WT_CHECKBOX then
			If id == id_MoveThroughControls then
				SayFormattedMessage(OT_USER_BUFFER,msgMoveThroughControls)
				AddHotKeyLinks()
				return
			ElIf id == id_MoveBetweenPages then
				SayFormattedMessage(OT_USER_BUFFER,msgMoveBetweenPages)
				AddHotKeyLinks()
				return
			ElIf id == id_ExitDlgBoxWithoutChanges then
				SayFormattedMessage(OT_USER_BUFFER,msgExitDialogBoxWithoutMakingChanges)
				AddHotKeyLinks()
				return
			ElIf id == id_ApplyChanges then
				SayFormattedMessage(OT_USER_BUFFER,msgApplyingChangesYouMake)
				AddHotKeyLinks()
				return
			ElIf id == id_DeleteFiles then
				SayFormattedMessage(OT_USER_BUFFER,msgDeleteFiles)
				AddHotKeyLinks()
				return
			ElIf id == id_ExpandCollapsTreeViewFolders then
				SayFormattedMessage(OT_USER_BUFFER,msgExpandAndCollapseTreeViewFolders)
				AddHotKeyLinks()
				return
			ElIf id == id_RenameFileOrFolder then
				SayFormattedMessage(OT_USER_BUFFER,msgRenameAFileOrFolder)
				AddHotKeyLinks()
				return
			ElIf id == id_FindFileOrFolder then
				SayFormattedMessage(OT_USER_BUFFER,msgFindAFileOrFolder)
				AddHotKeyLinks()
				return
			ElIf id == id_RefreshWindow then
				SayFormattedMessage(OT_USER_BUFFER,msgRefreshAWindow)
				AddHotKeyLinks()
				return
			ElIf id == id_SwitchBetweenWindows then
				SayFormattedMessage(OT_USER_BUFFER,msgSwitchBetweenWindows)
				AddHotKeyLinks()
				return
			ElIf id == id_GoUp1Level then
				SayFormattedMessage(OT_USER_BUFFER,msgGoUpOneLevel)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp()
				return
			EndIf
		ElIf SubType == WT_BUTTON then
			if id == id_ok_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
				AddHotKeyLinks()
				return
			ElIf id == id_cancel_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
				AddHotKeyLinks()
				return
			ElIf id == id_help_btn then
				SayFormattedMessage(OT_USER_BUFFER,msgHelpButton)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf  ;id
		Else
			PerFormScript ScreenSensitiveHelp()
			return
		EndIf  ;SubType
	ElIf GetDialogPageName ()  == sc5 then ;JAWS Screen Review Page
		if SubType == WT_CHECKBOX then
			if id == id_SayCharacter then
				SayFormattedMessage(OT_USER_BUFFER,msgSayCharacter)
				AddHotKeyLinks()
				return
			ElIf id == id_SayWord then
				SayFormattedMessage(OT_USER_BUFFER,msgSayWord)
				AddHotKeyLinks()
				return
			ElIf id == id_SpellWord then
				SayFormattedMessage(OT_USER_BUFFER,msgSpellWord)
				AddHotKeyLinks()
				return
			ElIf id == id_SayNextWord then
				SayFormattedMessage(OT_USER_BUFFER,msgSayNextWord)
				AddHotKeyLinks()
				return
			ElIf id == id_SayPriorWord then
				SayFormattedMessage(OT_USER_BUFFER,msgSayPriorWord)
				AddHotKeyLinks()
				return
			ElIf id == id_SayLine then
				SayFormattedMessage(OT_USER_BUFFER,msgSayLine)
				AddHotKeyLinks()
				return
			ElIf id == id_SayNextLine then
				SayFormattedMessage(OT_USER_BUFFER,msgSayNextLine)
				AddHotKeyLinks()
				return
			ElIf id == id_SayPriorLine then
				SayFormattedMessage(OT_USER_BUFFER,msgSayPriorLine)
				AddHotKeyLinks()
				return
			ElIf id == id_SayAll then
				SayFormattedMessage(OT_USER_BUFFER,msgSayAll)
				AddHotKeyLinks()
				return
			ElIf id == id_SayWindowTitle then
				SayFormattedMessage(OT_USER_BUFFER,msgSayWindowTitle)
				AddHotKeyLinks()
				return
			ElIf id == id_SayTopLineOfWindow then
				SayFormattedMessage(OT_USER_BUFFER,msgSayTopLineOfWindow)
				AddHotKeyLinks()
				return
			ElIf id == id_SayBottomLineOfWindow then
				SayFormattedMessage(OT_USER_BUFFER,msgSayBottomLineOfWindow)
				AddHotKeyLinks()
				return
			ElIf id == id_SayToCursor then
				SayFormattedMessage(OT_USER_BUFFER,msgSayToCursor)
				AddHotKeyLinks()
				return
			ElIf id == id_SayFromCursor then
				SayFormattedMessage(OT_USER_BUFFER,msgSayFromCursor)
				AddHotKeyLinks()
				return
			ElIf id == id_SayTaskBar then
				SayFormattedMessage(OT_USER_BUFFER,msgSayTaskbar)
				AddHotKeyLinks()
				return
			ElIf id == id_SaySystemTime then
				SayFormattedMessage(OT_USER_BUFFER,msgSaySystemTime)
				AddHotKeyLinks()
				return
			ElIf id == id_SayColor then
				SayFormattedMessage(OT_USER_BUFFER,msgSayColor)
				AddHotKeyLinks()
				return
			ElIf id == id_SayFont then
				SayFormattedMessage(OT_USER_BUFFER,msgSayFont)
				AddHotKeyLinks()
				return
			ElIf id == id_SayActiveCursorAndCoordinates then
				SayFormattedMessage(OT_USER_BUFFER,msgSayActiveCursorAndCoordinates)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp()
				return
			EndIf
		ElIf SubType == WT_BUTTON then
			if id == id_ok_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
				AddHotKeyLinks()
				return
			ElIf id == id_cancel_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
				AddHotKeyLinks()
				return
			ElIf id == id_help_btn then
				SayFormattedMessage(OT_USER_BUFFER,msgHelpButton)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf  ;id
		Else
			PerFormScript ScreenSensitiveHelp()
			return
		EndIf  ;SubType
	ElIf GetDialogPageName ()  == sc6 then  ;HELP/CUSTOMIZATION PAGE
		if SubType == WT_CHECKBOX then
			If id == id_ssh then
				SayFormattedMessage(OT_USER_BUFFER,msgScreenSensitiveHelp)
				AddHotKeyLinks()
				return
			ElIf id == id_KeyboardHelp then
				SayFormattedMessage(OT_USER_BUFFER,msgKeyboardHelp)
				AddHotKeyLinks()
				return
			ElIf id == id_JAWSHelpForApplications then
				SayFormattedMessage(OT_USER_BUFFER,msgJAWSHelpForApplications)
				AddHotKeyLinks()
				return
			ElIf id == id_HotKeyHelp then
				SayFormattedMessage(OT_USER_BUFFER,msgHotKeyHelp)
				AddHotKeyLinks()
				return
			ElIf id == id_WindowsKeysHelp then
				SayFormattedMessage(OT_USER_BUFFER,msgWindowKeysHelp)
				AddHotKeyLinks()
				return
			ElIf id == id_SayHelpWindow then
				SayFormattedMessage(OT_USER_BUFFER,msgSayHelpWindow)
				AddHotKeyLinks()
				return
			ElIf id == id_RefreshScrn then
				SayFormattedMessage(OT_USER_BUFFER,msgRefreshScreen)
				AddHotKeyLinks()
				return
			ElIf id == id_ScriptFileName then
				SayFormattedMessage(OT_USER_BUFFER,msgScriptFileName)
				AddHotKeyLinks()
				return
			ElIf id == id_JAWSFind then
				SayFormattedMessage(OT_USER_BUFFER,msgJAWSFind)
				AddHotKeyLinks()
				return
			ElIf id == id_JAWSFindNext then
				SayFormattedMessage(OT_USER_BUFFER,msgJAWSFindNext)
				AddHotKeyLinks()
				return
			ElIf id == id_SayAppVersion then
				SayFormattedMessage(OT_USER_BUFFER,msgSayApplicationVersion)
				AddHotKeyLinks()
				return
			ElIf id == id_AdjustJAWSVerbosity then
				SayFormattedMessage(OT_USER_BUFFER,msgAdjustJAWSVerbosity)
				AddHotKeyLinks()
				return
			ElIf id == id_PassKeyThrough then
				SayFormattedMessage(OT_USER_BUFFER,msgPassKeyThrough)
				AddHotKeyLinks()
				return
			ElIf id == id_GraphicsLabeler then
				SayFormattedMessage(OT_USER_BUFFER,msgGraphicsLabeler)
				AddHotKeyLinks()
				return
			ElIf id == id_RunJAWSManager then
				SayFormattedMessage(OT_USER_BUFFER,msgRunJAWSManager)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp()
				return
			EndIf
		ElIf SubType == WT_BUTTON then
			if id == id_ok_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
				AddHotKeyLinks()
				return
			ElIf id == id_cancel_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
				AddHotKeyLinks()
				return
			ElIf id == id_help_btn then
				SayFormattedMessage(OT_USER_BUFFER,msgHelpButton)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf  ;id
		Else
			PerFormScript ScreenSensitiveHelp()
			return
		EndIf  ;SubType
	ElIf GetDialogPageName ()  == sc7 then  ;JAWS Misc Page
		if SubType == WT_CHECKBOX then
			If id == id_InterruptSpeach then
				SayFormattedMessage(OT_USER_BUFFER,msgInterruptSpeech)
				AddHotKeyLinks()
				return
			ElIf id == id_PcCursor then
				SayFormattedMessage(OT_USER_BUFFER,msgPCCursor)
				AddHotKeyLinks()
				return
			ElIf id == id_JAWSCursor then
				SayFormattedMessage(OT_USER_BUFFER,msgJAWSCursor)
				AddHotKeyLinks()
				return
			ElIf id == id_RoutePc2JAWS then
				SayFormattedMessage(OT_USER_BUFFER,msgRoutePCCursorToJAWS)
				AddHotKeyLinks()
				return
			ElIf id == id_RtJ2Pc then
				SayFormattedMessage(OT_USER_BUFFER,msgRouteJAWSCursorToPC)
				AddHotKeyLinks()
				return
			ElIf id == id_RestrictJAWSCursor then
				SayFormattedMessage(OT_USER_BUFFER,msgRestrictJAWSCursor)
				AddHotKeyLinks()
				return
			ElIf id == id_SelNextWrd then
				SayFormattedMessage(OT_USER_BUFFER,msgSelectNextWord)
				AddHotKeyLinks()
				return
			ElIf id == id_SelPriWrd then
				SayFormattedMessage(OT_USER_BUFFER,msgSelectPriorWord)
				AddHotKeyLinks()
				return
			ElIf id == id_SaySellectedText then
				SayFormattedMessage(OT_USER_BUFFER,msgSaySelectedText)
				AddHotKeyLinks()
				return
			ElIf id == id_LeftMouseButton then
				SayFormattedMessage(OT_USER_BUFFER,msgLeftMouseButton)
				AddHotKeyLinks()
				return
			ElIf id == id_LeftMouseBtnLocked then
				SayFormattedMessage(OT_USER_BUFFER,msgLeftMouseButtonLock)
				AddHotKeyLinks()
				return
			ElIf id == id_RightMouseButton then
				SayFormattedMessage(OT_USER_BUFFER,msgRightMouseButton)
				AddHotKeyLinks()
				return
			ElIf id == id_DragAndDrop then
				SayFormattedMessage(OT_USER_BUFFER,msgDragAndDrop)
				AddHotKeyLinks()
				return
			ElIf id == id_SayWindowPromptAndText then
				SayFormattedMessage(OT_USER_BUFFER,msgSayWindowPromptAndText)
				AddHotKeyLinks()
				return
			ElIf id == id_SayDefaultBtn then
				SayFormattedMessage(OT_USER_BUFFER,msgSayDefaultButtonOfDialogBox)
				AddHotKeyLinks()
				return
			ElIf id == id_ReadInTabOrder then
				SayFormattedMessage(OT_USER_BUFFER,msgReadBoxInTabOrder)
				AddHotKeyLinks()
				return
			ElIf id == id_ReadWordInContext then
				SayFormattedMessage(OT_USER_BUFFER,msgReadWordInContext)
				AddHotKeyLinks()
				return
			ElIf id == id_SayCurrentControl then
				SayFormattedMessage(OT_USER_BUFFER,msgSayCurrentControlsHotKey)
				AddHotKeyLinks()
				return
			ElIf id == id_GetTopLeft then
				SayFormattedMessage(OT_USER_BUFFER,msgFrameGetTopLeft)
				AddHotKeyLinks()
				return
			ElIf id == id_GetBottomRight then
				SayFormattedMessage(OT_USER_BUFFER,msgFrameGetBottomRight)
				AddHotKeyLinks()
				return
			ElIf id == id_SetToWindow then
				SayFormattedMessage(OT_USER_BUFFER,msgFrameSetToWindow)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp()
				return
			EndIf
		ElIf SubType == WT_BUTTON then
			if id == id_ok_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
				AddHotKeyLinks()
				return
			ElIf id == id_cancel_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
				AddHotKeyLinks()
				return
			ElIf id == id_help_btn then
				SayFormattedMessage(OT_USER_BUFFER,msgHelpButton)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf  ;id
		Else
			PerFormScript ScreenSensitiveHelp()
			return
		EndIf  ;SubType
	Else
		PerformScript ScreenSensitiveHelp()
		return
	EndIf   ;dialogPageName
EndFunction


Void Function ScreenSensitiveHelpListViewSampleDlg()
var
	handle hWnd,
	int id,
	int SubType
let hWnd = GetCurrentWindow()
let id = GetControlId(hWnd)
let SubType = GetWindowSubtypeCode (hWnd)
if SubType == WT_LISTVIEW then
			SayFormattedMessage(OT_USER_BUFFER,msgListViewSamples)
			AddHotKeyLinks()
			return
ElIf SubType == WT_BUTTON then
			if id == id_ok_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
				AddHotKeyLinks()
				return
			ElIf id == id_cancel_btn  then
				SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
				AddHotKeyLinks()
				return
			Else
				PerformScript ScreenSensitiveHelp ()
				return
			EndIf  ;id
Else
			PerformScript ScreenSensitiveHelp()
			return
EndIf  ;SubType
EndFunction

Void Function ScreenSensitiveHelpTreeViewSampleDlg()
var
	handle hWnd,
	int id,
	int SubType
let hWnd = GetCurrentWindow()
let id = GetControlId(hWnd)
let SubType = GetWindowSubtypeCode (hWnd)
if SubType == WT_TREEVIEW then
	SayFormattedMessage(OT_USER_BUFFER, msgTreeView)
	AddHotKeyLinks()
	return
ElIf SubType == WT_READONLYEDIT then
	SayFormattedMessage(OT_USER_BUFFER,msgDescription)
	AddHotKeyLinks()
	return
ElIf SubType == WT_BUTTON then
	if id == id_ok_btn  then
		SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
		AddHotKeyLinks()
		return
	ElIf id == id_cancel_btn  then
		SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf  ;id
EndIf  ;SubType
EndFunction

Void Function ScreenSensitiveHelpSinglePageDlg()
var
	handle hWnd,
	int id,
	int SubType
let hWnd = GetCurrentWindow()
let id = GetControlId(hWnd)
let SubType = GetWindowSubtypeCode (hWnd)
if SubType == WT_RADIOBUTTON then
	if (id == id_mr_rdb) ||
	(id == id_mrs_rdb) ||
	(id == id_ms_rdb) ||
	(id == id_miss_rdb) then
		SayFormattedMessage(OT_USER_BUFFER,msgTitle)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf SubType == WT_EDIT  then
	if id == id_first_name then
		SayFormattedMessage(OT_USER_BUFFER, msgFirstName)
		AddHotKeyLinks()
		return
	ElIf id == id_last_name then
		SayFormattedMessage(OT_USER_BUFFER,msgLastName)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf SubType == WT_MULTILINE_EDIT then
	if Id == id_street_edit  then
		SayFormattedMessage(OT_USER_BUFFER, msgStreet)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf SubType == 	WT_EDITCOMBO then
;since edit combos have the same control id, get the id of the parent
	if GetControlId(GetParent(hWnd)) == id_parent_city  then
		SayFormattedMessage(OT_USER_BUFFER,msgCity)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf SubType == WT_COMBOBOX then
	if id == id_state_combo  then
		SayFormattedMessage(OT_USER_BUFFER,msgState)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf SubType == WT_EDIT_SPINBOX  then
	if id == id_years_exp then
		SayFormattedMessage(OT_USER_BUFFER, msgYearsOfComputerExperience)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf SubType == 	WT_LEFTRIGHTSLIDER then
	if id == id_rank_comp_knowlege then
		SayFormattedMessage(OT_USER_BUFFER, msgRankYourComputerKnowledge)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf SubType == WT_CHECKBOX then
	if id == id_WordProcessor_chk then
		SayFormattedMessage(OT_USER_BUFFER, msgWordProcessor)
		AddHotKeyLinks()
		return
	ElIf id == id_SpreadSheet_chk then
		SayFormattedMessage(OT_USER_BUFFER, msgSpreadsheet)
		AddHotKeyLinks()
		return
	ElIf id == id_Accounting_chk then
		SayFormattedMessage(OT_USER_BUFFER, msgAccounting)
		AddHotKeyLinks()
		return
	ElIf id == id_Database_chk then
		SayFormattedMessage(OT_USER_BUFFER, msgDatabase)
		AddHotKeyLinks()
		return
	ElIf id == id_Games_chk then
		SayFormattedMessage(OT_USER_BUFFER, msgGames)
		AddHotKeyLinks()
		return
	ElIf id == id_Email_chk then
		SayFormattedMessage(OT_USER_BUFFER, msgEmail)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
Elif SubType == WT_BUTTON then
	if id == id_clear_form_btn  then
		SayFormattedMessage(OT_USER_BUFFER,msgClearFormButton)
		AddHotKeyLinks()
		return
	Elif id == id_ok_btn  then
		SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
		AddHotKeyLinks()
		return
	ElIf id == id_cancel_btn  then
		SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf  ;id
Else
	PerformScript ScreenSensitiveHelp ()
	return
EndIf  ;SubType
EndFunction

Void Function ScreenSensitiveHelpSinglePageDlg2()
var
	handle hWnd,
	int id,
	int SubType
let hWnd = GetCurrentWindow()
let id = GetControlId(hWnd)
let SubType = GetWindowSubtypeCode (hWnd)
if SubType == WT_EDIT then
	if id == id_FullName_edit then
		SayFormattedMessage(OT_USER_BUFFER, msgFullNameEdit)
		AddHotKeyLinks()
		return
	ElIf id == id_PostalCode_edit then
		SayFormattedMessage(OT_USER_BUFFER, msgPostalCode)
		AddHotKeyLinks()
		return
	ElIf id == id_phone_edit then
		SayFormattedMessage(OT_USER_BUFFER, msgPhoneNumber)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf SubType == WT_MULTILINE_EDIT then
	if id == id_street  then
		SayFormattedMessage(OT_USER_BUFFER, msgStreet)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf SubType == WT_EDITCOMBO then
	if GetControlId(GetParent(hWnd)) == id_parent_city2  then
		SayFormattedMessage(OT_USER_BUFFER, msgCity2)
		AddHotKeyLinks()
		return
	Else
		PerformScript ScreenSensitiveHelp ()
		return
	EndIf
ElIf SubType == WT_LISTBOX then
	PerformScript ScreenSensitiveHelp ()
	return
Elif SubType == WT_BUTTON then
	if id == id_full_name_btn  then
		SayFormattedMessage(OT_USER_BUFFER, msgFullNameButton)
		AddHotKeyLinks()
		return
	Elif id == id_ClearForm_btn then
		SayFormattedMessage(OT_USER_BUFFER,msgClearFormButton)
		AddHotKeyLinks()
		return
	Elif id == id_ok_btn  then
		SayFormattedMessage(OT_USER_BUFFER,msgOKButton)
		AddHotKeyLinks()
		return
	ElIf id == id_cancel_btn  then
		SayFormattedMessage(OT_USER_BUFFER,msgCancelButton)
		AddHotKeyLinks()
		return
	Else
	PerformScript ScreenSensitiveHelp ()
		return
	EndIf  ;id
Else
	PerformScript ScreenSensitiveHelp ()
	return
EndIf  ;SubType
EndFunction
 /*
 void Function DragDialogWindow ()
var
	int DragFromX,
	int DragFromY,
	int iJAWSCol,
	int iJAWSRow,
	string DragObject,
	int x,
	int y,
	String strObject
;JAWSCursor ()
;Let iJAWSCol = GetCursorCol ();For JAWSCursor
;Let iJAWSRow = GetCursorRow ()
;MoveToWindow (GetRealWindow (GetFocus ()))
;SayWord () ;testing
;let DragFromX = getCursorCol ()
;let DragFromY = getCursorRow () ;save position of spell dialog
GetWindowRect (GetRealWindow (GetFocus ()),DragFromX,0,DragFromY,0)
;let DragObject = GetWord ()
;now move to the top of the app
;MoveToWindow (GetAppMainWindow (GetFocus ()))
;SayString ("top of app = ") ;testing
;SayLine () ;testing
;let x = getCursorCol ()
;let y = getCursorRow () ;save position to move to
GetWindowRect (GetAppMainWindow (GetFocus ()),X,0,Y,0)
; make sure that the left mouse button is unlocked
If IsLeftButtonDown () then
	LeftMouseButtonLock ()
	pause ()
endIf
SaveCursor ()
JAWSCursor ()
SaveCursor ()
MoveTo (DragFromX, DragFromY) ;go back to spell dialog
Pause ()
;SayString ("back to dialog = ") ;testing
;SayLine () ;testing
let strObject = GetWord()
LeftMouseButtonLock () ; lock it down
pause ()
MoveTo (x,y) ;drag it
Pause ()
pause ()
pause ()
;cmsg172_L = "dragging "
;let sMessage = FormatString (cmsg172_L, strObject, GetWord ())
;SayFormattedMessage (ot_JAWS_message, sMessage); dragging x to y
;SayString ("top of app = ") ;testing
;SayLine ()
LeftMouseButtonLock () ;unlock
;RestoreCursor ()
;MoveTo (iJAWSCol, iJAWSRow);Put the JAWSCursor back where it was,
;so the mouse isn't visually unpleasant
RestoreCursor ()
RestoreCursor ()
PCCursor ()
EndFunction
*/

  void Function MaximizeWindow ()
  var
	handle hWnd
If DialogActive () then
	Return
EndIf
Let hWnd = GetAppMainWindow (GetFocus ())
SaveCursor ();Before using a cursor
InvisibleCursor ()
SaveCursor ();Keep the position the InvisibleCursor was before.
If FindGraphic (hWnd, "Maximize symbol", S_TOP, S_RESTRICTED) then
	;SayString ("Yes")
	;LeftMouseButton ()
	RoutePCToInvisible ()
;Else
	;SayString ("No")
EndIf
  RestoreCursor ();Put the InvisibleCursor back where it was.
  RestoreCursor ();Turn on the PC Cursor again.
  EndFunction


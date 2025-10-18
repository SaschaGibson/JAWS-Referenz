; Copyright 1995-2024 Freedom Scientific, Inc.
; FHP Braille support
; 2024-07: Changes for handling JAWS dialogs with Braille device
; 2024-01: Changes for speech output in combined mode
; 		   fix for saving settings when exiting attribute settings dialog
;		   saving braille settings only when leaving dialog with braille key
;          using variable for string in braille settings dialog
; 2023-09
; Changes for selecting German Braille GradeTwo
; Changes in FHPRoutingAux
; Changes for Braille splitmode


Include "HjGlobal.jsh" ; default HJ global variables
Include "hjconst.jsh" ; default HJ constants
Include "common.jsm" ; message file
Include "Braille.jsm" ; message file
Include "fhp_brai.jsh"
Include "fhp_brai.jsm"


Void Function FHPBrailleUnhideBrailleCursor ()
	if (g_bBrailleCursorHidden == 1) then
		PerformScript FHPBrailleToggleCursorShape()
	endIf
EndFunction



;  Announcement for Switches and Toggles


Void Function FHPBraille2DTogglePCMode ()
	FHPBrailleUnhideBrailleCursor()
	let g_b2DReadingMode = 0
	if (g_b2DPCMode == 0) then
		let g_b2DPCMode = 1
		Say (fhpmsg01, OT_STRING)  ; PC mode
	else
 		let g_b2DPCMode = 0
		Say (fhpmsg02, OT_STRING)  ; navigation mode
	endIf
EndFunction


Void Function FHPBraille2DToggleReadingMode ()
	FHPBrailleUnhideBrailleCursor()
	let g_b2DPCMode = 0	
	if (g_b2DReadingMode == 0) then
		let g_b2DReadingMode = 1
		Say (fhpmsg03, OT_STRING)  ; combined mode
	else
		let g_b2DReadingMode = 0
		Say (fhpmsg02, OT_STRING)  ; navigation mode
	endIf
EndFunction


Void Function FHPBrailleKeyPCMode ()
	FHPBrailleUnhideBrailleCursor()
	Say (fhpmsg01, OT_STRING)  ; PC mode
EndFunction


Void Function FHPBrailleKeyNavigationMode ()
	FHPBrailleUnhideBrailleCursor()
	Say (fhpmsg02, OT_STRING)  ; navigation mode
EndFunction


Void Function FHPBrailleKeyReadingMode ()
	FHPBrailleUnhideBrailleCursor()
	Say (fhpmsg03, OT_STRING)  ; combined mode
EndFunction


Void Function FHPBrailleKeySpeechMode ()
	FHPBrailleUnhideBrailleCursor()
	Say (fhpmsg04, OT_STRING)  ; speech mode
EndFunction


Void Function FHPBrailleKeyBrailleMode ()
	FHPBrailleUnhideBrailleCursor()
	Say (fhpmsg05, OT_STRING)  ; braille mode
EndFunction


Void Function FHPBrailleKeyBrailleSpeechMode ()
	FHPBrailleUnhideBrailleCursor()
	Say (fhpmsg06, OT_STRING)  ; switch has no function
EndFunction


; PC key simulation
; Braillex EL right switch in rear position = PC Mode

Void Function FHPcursorup ()
	If (IsVirtualPCCursor () || IsJAWSCursor () )then
	FHPBrailleUnhideBrailleCursor()
	PerformScript SayPriorLine()
	else
		TypeKey(cksUpArrow)
	EndIf
EndFunction


Void Function FHPcursordown ()
	If (IsVirtualPCCursor () || IsJAWSCursor () )then
	FHPBrailleUnhideBrailleCursor()
	PerformScript SayNextLine()
	else
		TypeKey(cksDownArrow)
	endif
EndFunction


Void Function FHPcursorright ()
	If (IsVirtualPCCursor () || IsJAWSCursor () )then
	FHPBrailleUnhideBrailleCursor()
	PerformScript SayNextCharacter()
	else
		TypeKey(cksRightArrow)
	EndIf
EndFunction


Int Function FHPcursorleft ()
	If (IsVirtualPCCursor () || IsJAWSCursor () )then
	FHPBrailleUnhideBrailleCursor()
	PerformScript SayPriorCharacter()
	else
		TypeKey(cksLeftArrow)
	endif
EndFunction


Void Function FHPBrailleTab ()
	If (IsVirtualPCCursor () || IsJAWSCursor () )then
	FHPBrailleUnhideBrailleCursor()
	PerformScript BrailleTab()
	else
		TypeKey(cksTab)
	EndIf
EndFunction


Void Function FHPBrailleShiftTab ()
	If (IsVirtualPCCursor () || IsJAWSCursor () )then
	FHPBrailleUnhideBrailleCursor()
	PerformScript BrailleShiftTab()
	else
		TypeKey(cksShiftTab)
	EndIf
EndFunction


Void Function FHPBrailleEscape ()
	if( profiModeActive () == TRUE ) then
		TypeKey(cksEscape)
		return
	endIf
	if not menusActive() Then
		if  DialogActive() Then
			TypeKey(cksEscape)
			Pause()
			Refresh()
			Return
		else
			TypeKey(cksF10)
		endIf
		Return
	Else
		TypeKey(cksEscape)
		Return
	endIf
EndFunction


Void Function FHPBrailleEnter ()
	FHPBrailleUnhideBrailleCursor()
	PerformScript BrailleEnter()
EndFunction


;
; Navigation Mode
; Braillex EL right switch in central position
;
Void Function FHPBraillePriorLine ()
	FHPBrailleUnhideBrailleCursor()
	If g_b2DPCMode Then
		If (IsVirtualPCCursor () || IsJAWSCursor () )then
			PerformScript SayPriorLine()
		Else
			TypeKey(cksUpArrow)
		EndIf
		Return
	EndIf
	if (g_b2DReadingMode) then
		PerformScript  FHPBrailleSpeechPriorLine()
		return
	endIf
	PerformScript BraillePriorLine()
EndFunction


Void Function FHPBrailleNextLine ()
	FHPBrailleUnhideBrailleCursor()
	If g_b2DPCMode Then
		If (IsVirtualPCCursor () || IsJAWSCursor () )then
			PerformScript SayNextLine()
		Else
			TypeKey(cksDownArrow)
		EndIf
		Return
	EndIf
	if (g_b2DReadingMode) then
		PerformScript  FHPBrailleSpeechNextLine()
		return
	endIf
	PerformScript BrailleNextLine()
EndFunction


Void Function FHPBraillePanLeft ()
	FHPBrailleUnhideBrailleCursor()
 	if (g_b2DPCMode) then
		PerformScript  FHPcursorleft()
		return
	endIf
	if (g_b2DReadingMode) then
		PerformScript  FHPBrailleSpeechPanLeft()
		return
	endIf
	PerformScript BraillePanLeft()
EndFunction


Void Function FHPBraillePanRight ()
	FHPBrailleUnhideBrailleCursor()
	if (g_b2DPCMode) then
		PerformScript  FHPcursorright()
		return
	endIf
	if (g_b2DReadingMode) then
		PerformScript  FHPBrailleSpeechPanRight()
		return
	endIf
	PerformScript BraillePanRight()
EndFunction


;
; Combined Mode
; Braillex EL right key in front position
;

Void Function FHPBrailleSpeechPriorLine ()
	FHPBrailleUnhideBrailleCursor()
	PerformScript SayPriorLine()
EndFunction


Void Function FHPBrailleSpeechNextLine ()
	FHPBrailleUnhideBrailleCursor()
	PerformScript SayNextLine()
EndFunction


Void Function FHPBrailleSpeechPanLeft ()
	FHPBrailleUnhideBrailleCursor()
	if (not BraillePanLeft()) then
		BraillePanLeft()
		PerformScript SayPriorLine()
; 10-09-09 Hn 
		if (GetObjectSubTypeCode() == WT_LISTBOX) || (GetObjectSubTypeCode() == WT_TREEVIEW)  
			|| (GetObjectSubTypeCode() == WT_LISTBOXITEM) || (GetObjectSubTypeCode() == WT_TREEVIEWITEM)  
			|| (GetObjectSubTypeCode() == WT_LISTVIEW) || (GetObjectSubTypeCode() == WT_LISTVIEWITEM )		then 
			RouteBrailleToPC()
			return
		endif
; 10-09-09 Hn 
		If StringLength (GetLine()) >1 Then
;2024-01-11
;			TypeKey(cksHome)
;			TypeKey(cksEnd)
			BrailleRefresh()
			Return
;2024-01-11
		else
; 10-08-11 Hn
		if (GetJcfOption(OPT_BRL_USE_OSM) != 3) ;wenn DOM benutzt wird
			if (GetCharacter() == " ") then
				TypeKey(cksLeftArrow)
				TypeKey(cksLeftArrow)
				TypeKey(cksRightArrow)
			endif
		endif
; 10-08-11 Hn Ende
		endif
		FHPBrailleMoveRight()
	endIf
EndFunction


Void Function FHPBrailleSpeechPanRight ()
	FHPBrailleUnhideBrailleCursor()
	if (not BraillePanRight()) then
;		BraillePanLeft()
		PerformScript SayNextLine()
		Pause()
; 10-09-09 Hn 
		if (GetObjectSubTypeCode() == WT_LISTBOX) || (GetObjectSubTypeCode() == WT_TREEVIEW)  
			|| (GetObjectSubTypeCode() == WT_LISTBOXITEM) || (GetObjectSubTypeCode() == WT_TREEVIEWITEM)  
			|| (GetObjectSubTypeCode() == WT_LISTVIEW)		then 
			RouteBrailleToPC()
			return
		endif
; 10-09-09 Hn 
		If StringLength (GetLine()) >1 Then
;2024-01-11
;			TypeKey(cksEnd)
;			TypeKey(cksHome)
;2024-01-11
		else
; 10-08-11 Hn
		if (GetJcfOption(OPT_BRL_USE_OSM) != 3) ;wenn DOM benutzt wird
			if (GetCharacter() == " ") then
				TypeKey(cksLeftArrow)
				TypeKey(cksLeftArrow)
				TypeKey(cksRightArrow)
				let g_oldCursorPos = GetCursorCol()
			endif
		endif
; 10-08-11 Hn Ende
		endif			
		RouteBrailleToPC()
	endIf
EndFunction


;
; routing 
;
Void Function FHPRouting ()
var
	int nX,
	int nY,
	int nCell,
	string name,
	handle hwnd

	FHPBrailleUnhideBrailleCursor()
	if BrailleIsMessageBeingShown() then
		brailleClearMessage()
		return
	endIf
	let nCell = GetLastBrailleRoutingKey ()
	let nX = GetBrailleCellColumn (nCell)
	let nY = GetBrailleCellRow (nCell)

	if (GetFocus() == 0 && GetCursorCol() == 1 && GetCursorRow() == 1) then  ;if no Focus can be found
		TypeKey(cksWindowsM)		; Instead of MinimzeAllApps in default
		Pause()
		return
	endif

	if (nx >=0 && ny >= 0) then
		PerformScript BrailleRouting()
		BrailleRefresh()
	endif
EndFunction

Void Function FHPLineRouting ()
	FHPBrailleUnhideBrailleCursor()
	FHPLineRouting()
EndFunction





; Attribute handling
;

Void Function FHPBrailleTurnMarkingOff ()
	var int CurrentAttribute
	FHPBrailleUnhideBrailleCursor()
	let CurrentAttribute = GetJcfOption(OPTBRL_MARKING)
	if (CurrentAttribute != BRL_MARKING_NONE) then
		SetJcfOption(OPTBRL_MARKING, BRL_MARKING_NONE)
		Say (cmsg158_L, OT_STRING)  ; braille marking off
	else 	
		SetJcfOption(OPTBRL_MARKING, BRL_MARKING_ALL_ATTRIBUTE)
		Say (cmsg164_L, OT_STRING)  ; braille marking all
	endIf
EndFunction


Void Function FHPBrailleShowBoldMarking ()
	FHPBrailleUnhideBrailleCursor()
	SetJcfOption(OPTBRL_MARKING, BRL_MARKING_BOLD)
	Say (cmsg160_L, OT_STRING)  ; braille marking bold
EndFunction


Void Function FHPBrailleShowHighlightMarking ()
	FHPBrailleUnhideBrailleCursor()
	SetJcfOption(OPTBRL_MARKING, BRL_MARKING_HIGHLIGHT)
	Say (cmsg159_L, OT_STRING)  ; braille marking highlight
EndFunction


Void Function FHPBrailleShowItalicMarking ()
	FHPBrailleUnhideBrailleCursor()
	SetJcfOption(OPTBRL_MARKING, BRL_MARKING_ITALIC)
	Say (cmsg162_L, OT_STRING)  ; braille marking italic
EndFunction


Void Function FHPBrailleShowUnderlineMarking ()
	FHPBrailleUnhideBrailleCursor()
	SetJcfOption(OPTBRL_MARKING, BRL_MARKING_UNDERLINE)
	Say (cmsg161_L, OT_STRING)  ; braille marking underline
EndFunction


Void Function FHPBrailleShowAllMarking ()
	FHPBrailleUnhideBrailleCursor()
	SetJcfOption(OPTBRL_MARKING, BRL_MARKING_ALL_ATTRIBUTE)
	Say (cmsg164_L, OT_STRING)  ; braille marking all
EndFunction


Void Function FHPBrailleToggleCharactersAndAttributes ()
	FHPBrailleUnhideBrailleCursor()
	PerformScript BrailleToggleCharactersAndAttributes()
EndFunction


Int Function FHPBTA (int direction)
	var int CurrentAttribute

	let CurrentAttribute = GetJcfOption(OPTBRL_MARKING)

	if (direction == 0) then
		; cycle forward
		if (CurrentAttribute >= BRL_MARKING_ALL_ATTRIBUTE) then
			let CurrentAttribute = BRL_MARKING_NONE
		elif (CurrentAttribute == BRL_MARKING_NONE) then
			let CurrentAttribute = BRL_MARKING_HIGHLIGHT
		elif (CurrentAttribute == BRL_MARKING_HIGHLIGHT) then
			let CurrentAttribute = BRL_MARKING_BOLD
		elif (CurrentAttribute == BRL_MARKING_BOLD) then
			let CurrentAttribute = BRL_MARKING_UNDERLINE
		elif (CurrentAttribute == BRL_MARKING_UNDERLINE) then
			let CurrentAttribute = BRL_MARKING_ITALIC
		elif (CurrentAttribute == BRL_MARKING_ITALIC) then
			let CurrentAttribute = BRL_MARKING_STRIKEOUT
		elif (CurrentAttribute == BRL_MARKING_STRIKEOUT) then
			let CurrentAttribute = BRL_MARKING_COLOR
		elif (CurrentAttribute == BRL_MARKING_COLOR) then
			let CurrentAttribute = BRL_MARKING_ALL_ATTRIBUTE
		endif
	else
		;  cycle backward
		if (CurrentAttribute == BRL_MARKING_NONE) then
			let CurrentAttribute = BRL_MARKING_ALL_ATTRIBUTE
		elif (CurrentAttribute == BRL_MARKING_ALL_ATTRIBUTE) then
			let CurrentAttribute = BRL_MARKING_COLOR
		elif (CurrentAttribute == BRL_MARKING_COLOR) then
			let CurrentAttribute = BRL_MARKING_STRIKEOUT
		elif (CurrentAttribute == BRL_MARKING_STRIKEOUT) then
			let CurrentAttribute = BRL_MARKING_ITALIC
		elif (CurrentAttribute == BRL_MARKING_ITALIC) then
			let CurrentAttribute = BRL_MARKING_UNDERLINE
		elif (CurrentAttribute == BRL_MARKING_UNDERLINE) then
			let CurrentAttribute = BRL_MARKING_BOLD
		elif (CurrentAttribute == BRL_MARKING_BOLD) then
			let CurrentAttribute = BRL_MARKING_HIGHLIGHT
		elif (CurrentAttribute == BRL_MARKING_HIGHLIGHT) then
			let CurrentAttribute = BRL_MARKING_NONE
		endif
	endIf

	SetJcfOption(OPTBRL_MARKING, CurrentAttribute)
	return CurrentAttribute
EndFunction


Void Function FHPBNA (int Attribute)
	if (attribute == BRL_MARKING_NONE) then
		Say (cmsg158_L, OT_STRING) ;"Braille marking off"
		return
	endIf
	if (attribute == BRL_MARKING_HIGHLIGHT) then
		Say (cmsg159_L, OT_STRING) ;"Braille marking  highlight"
		return
	endIf
	if (attribute == BRL_MARKING_BOLD) then
		Say (cmsg160_L, OT_STRING)  ;"Braille marking  bold"
		return
	endIf
	if (attribute == BRL_MARKING_UNDERLINE) then
		Say (cmsg161_L, OT_STRING) ; "Braille marking  underline"
		return
	endIf
	if (attribute == BRL_MARKING_ITALIC) then
		Say (cmsg162_L, OT_STRING) ; "Braille marking  italic"
		return
	endIf
	if (attribute == BRL_MARKING_STRIKEOUT) then
		Say (cmsg163_L, OT_STRING) ; "Braille marking  strike out"
		return
	endIf
	if (attribute == BRL_MARKING_COLOR) then
		Say (cmsgBrlColor_L, OT_STRING) ; "Braille marking  color"
		return
	endIf
	if (attribute == BRL_MARKING_EXTENDED) then
		Say (cmsg163_L, OT_STRING) ; "Braille marking  extended"
		return
	endIf
	if (attribute == BRL_MARKING_ALL_ATTRIBUTE) then 
		Say (cmsg164_L, OT_STRING) ; "Braille marking all "
		return
	endIf
EndFunction


Void Function FHPBrailleToggleAttributeUp ()
	FHPBrailleUnhideBrailleCursor()
	FHPBNA(FHPBTA(0))
EndFunction


Void Function FHPBrailleToggleAttributeDown ()
	FHPBrailleUnhideBrailleCursor()
	FHPBNA(FHPBTA(1))
EndFunction


Void Function FHPBrailleCheckTopLeft ()
;Var
;
;Desktop 
		If GetCursorRow() == bRow && GetWindowClass(GetTopLevelWindow(GetCurrentWindow())) == "Shell_TrayWnd" then
			TypeKey (cksWindowsM)
			RouteBrailleToPc ()		
			Return
		EndIf	
;Braille viewer
		If StringContains(GetWindowName(GetCurrentWindow()),"JAWS") == 1 && GetWindowClass(GetCurrentWindow()) == "#32770" Then
			If !UserBufferIsActive () Then
				MoveTo(GetWindowLeft(GetCurrentWindow()),GetWindowBottom(GetCurrentWindow()))
				NextLine()
			EndIf
		EndIf

EndFunction


Void Function FHPBrailleShowWindowsTop ()

	FHPBrailleUnhideBrailleCursor()

	if (g_b2DPCMode) then
		PerformScript  FHPBrailleEscape()
		return
	endIf

	if (GetJCFOption (OPT_BRL_MOVE_ACTIVE_CURSOR)==1)  then
     		if  (IsPCCursor()) then
        			Beep()
     		else
         			JAWSPageUp ()
     		endIf
	else
		SAveCursor()
		BrailleCursor()
		JAWSPageUp()
		JAWSHome()
		FHPBrailleCheckTopLeft ()

		SayLine()
		BrailleRefresh()
		RestoreCursor()
	endIf

EndFunction


Void Function FHPBrailleShowWindowsBottom ()

	FHPBrailleUnhideBrailleCursor()

	if (g_b2DPCMode) then
		PerformScript BrailleEnter()
		return
	endIf

	if (GetJcfOption (OPT_BRL_MOVE_ACTIVE_CURSOR)==1)  then
		if  (IsPCCursor()) then
      	Beep()
		else
      	JAWSPageDown ()
     	endIf
	else
		SaveCursor()
		BrailleCursor()
		JAWSPageDown()
		JAWSHome()
		SayLine()
		BrailleRefresh()
		RestoreCursor()
	endIf


EndFunction


Void Function FHPBrailleToggle68Dots ()
	FHPBrailleUnhideBrailleCursor()
	PerformScript  BrailleToggle8Dots()
EndFunction


Void Function FHPToggleCursorMode ()
	FHPBrailleUnhideBrailleCursor()

	if (IsPCCursor()) then
		PerformScript JAWSCursor()
	else
		PerformScript PCCursor()
	endIf
EndFunction


Void Function FHPBrailleToggleCursorShape ()
Var String CursorDots

	if (g_b2DPCMode) then
		PerformScript BrailleTab()
		return
	endIf

	Let CursorDots = BrailleGetCursorDots()
	
	if (CursorDots == cscNull) then
		BrailleSetCursorDots (OldCursorDots)
		Let g_bBrailleCursorHidden = 0
	else
		Let OldCursorDots = CursorDots
		Let g_bBrailleCursorHidden = 1
		BrailleSetCursorDots (cscNull)
	endIf
EndFunction


Void Function FHPBrailleActiveCursorTracking ()
var int ActiveCursor,
	int B_Zeile,
	int AC_Zeile,
	Int BrailleMode,
	int cSetting 

	Let BrailleMode =  GetBrailleMode ()
	if (BrailleMode == BRL_MODE_STRUCTURED) ||( IsVirtualPCCursor () ) Then
		Let cSetting = GetJcfOption (OPT_BRL_AUTO_ROUTE_TO_CURSOR)
		Let cSetting =!cSetting
		SetJcfOption (OPT_BRL_AUTO_ROUTE_TO_CURSOR, cSetting)
		If cSetting == 1 Then
			SayString(	fhpmsg20)
		Else
			SayString(	fhpmsg19)
		EndIf
		Return
	else

	if (g_b2DPCMode) then
		PerformScript BrailleShiftTab()
		return
	EndIf

	FHPBrailleUnhideBrailleCursor()
	Let AC_Zeile = GetCursorRow()
	Let B_Zeile = GetBrailleCellRow(1)
 
	If AC_Zeile - B_Zeile < 4 && AC_Zeile - B_Zeile >= 0 Then
		SetDefaultJcfOption (OPT_BRL_AUTO_ROUTE_TO_CURSOR, 0)
		SayString(	fhpmsg19)	; "The active cursor will not move the Braille cursor"
	Else
		SetDefaultJcfOption (OPT_BRL_AUTO_ROUTE_TO_CURSOR, 1)
		SayString(	fhpmsg20) ; "The active cursor will move the Braille cursor"
		PerformScript RouteBrailleToActiveCursor()
		EndIf
	EndIf
EndFunction


Void Function FHPBrailleSelectText ()
	FHPBrailleUnhideBrailleCursor()
	PerformScript BrailleSelectText()
EndFunction


Void Function FHPBrailleToggleVertical ()
		FHPBDASToggleVertical()
EndFunction


Void Function FHPBrailleLineMode ()
	SetBrailleMode(BRL_MODE_LINE)
	Say (cmsg187_L, ot_message) ; "Line Mode"
	Refresh()
EndFunction


Void Function FHPBrailleStructuredMode ()
	SetBrailleMode(BRL_MODE_STRUCTURED)
	Say (cmsg186_L, ot_message) ; "Structured Mode"
	Refresh()
EndFunction


Void Function FHPActivateTaskList ()
	ScheduleFunction("StartJAWSTaskList", 2)
EndFunction


Void Function FHPBrailleManager ()
var
	string TheApp,
	string Runit
let TheApp = GetScriptFileName(TRUE)
if (!TheApp) then
	Let TheApp = GetAppFileName ()
endIf
Let TheApp = PathRenameExtension (TheApp, ".jbd")
Let Runit = "\"" + FindJAWSUtilityProgram (MGR_BDAS) + "\" " + 
            "\"" + FindJAWSSettingsFile (TheApp) + "\""
Run (Runit)
EndFunction


; 13-08-23 Hn
Void Function FHP_RunJAWSManager ()
var
	string sClass,
	string strForeground,
	string strBackground,
	string strBrlForeground,
	string strBrlBackground,
	string sApp,
	string RunIt,
	string sQuery,
	string managersList,
	int bModifyFrame,
	int nMenuMode,
	int index,
	int bUseCustomLabeler,
	int bViewCustomSummary
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
/*
If BrailleRunManagerHelper () then
	Return
EndIf
*/
Let nMenuMode = GlobalMenuMode
If InHJDialog () then
	SayFormattedMessage (OT_error, cMSG337_L, cMSG337_S)
	return
endIf
let bUseCustomLabeler=ShouldUseCustomLabler(GetCurrentWindow())
let bViewCustomSummary=ShouldShowCustomSummary(GetCurrentWindow())
if GetFrameNameAtCursor()
&& !bUseCustomLabeler then
	let bModifyFrame = TRUE;
else
	let bModifyFrame = FALSE;
endif
;get the command line for the dictionary manager so it retains currently selected word
let RunIt = CreateDictionaryCommandLine (false)
if GetSelectedText ()
&& (! isJAWSCursor () && ! isInvisibleCursor ()) then
	let sQuery = getSelectedText ()
else
	let sQuery = getWord ()
endIf

let managersList =
	SettingsCenterItem
	+WindowClassItem
	+DictionManItem
	+FrameManItem
	+KeyManItem
	+ScriptManItem
	+GraphicsLabelerItem
	+CustomHighlightAssignItem
	+BrailleAddColorsItem
	+CustomizeListViewItem
	+SkimReadingToolItem
	+AdjustJAWSOptionsItem
	+ QuickNavigationKeysItem
	+ FlexibleWebItem
;We place the Prompt item here since it may or may not appear in the list,
;and if not added, the list index must not then be off by 1.
If PromptValidator()==TRUE
|| CustomSummaryValidator()==true then
	if bViewCustomSummary then
		let managersList=ManagersList+CustomSummaryDialog
	Elif bUseCustomLabeler then
		Let ManagersList = ManagersList +CreateCustomLabelItem
		Let ManagersList = ManagersList + DeleteCustomLabelItem
		Let ManagersList = ManagersList + DeleteAllCustomLabelsItem
	else
		if bModifyFrame then
			Let ManagersList = ManagersList + ModifyPromptItem
		else
			Let ManagersList = ManagersList + CreatePromptItem
		EndIf
	endIf
EndIf
; for Excel only at this time:
If CustomSummaryValidator() then
	if bViewCustomSummary then
		let ManagersList=ManagersList+ViewCustomSummaryItem
	EndIf
EndIf
let ManagersList = ManagersList+ResearchItItem
let sClass = GetWindowClass (GetCurrentWindow ())
Let sApp = GetActiveConfiguration ()
let strForeground = ColorToRGBString(GetColorText())
let strBackground = ColorToRGBString(GetColorBackground())
;No matter what, Get it at Braille Cursor
;As the Braille cursor can be anywhere.
SaveCursor ()
BrailleCursor ()
Let strBrlForeground = ColorToRGBString(GetColorText())
Let strBrlBackground = ColorToRGBString(GetColorBackground())
RestoreCursor ()
let index = DlgSelectItemInList (ManagersList, RunManagerDialogTitle, TRUE)
If Index == 0 then
	Return
endIf
If index == 1
	PerformScript SettingsCenter ()
elif index == 2
	PerformScript WindowClassReassign ()
elif index == 3
	PerformScript DictionaryManager (RunIt)
elif index == 4
	PerformScript FrameManager ()
elif index == 5
	PerformScript KeyboardManager ()
elif index == 6
	PerformScript ScriptManager ()
elif index == 7
	PerformScript GraphicsLabeler ()
ElIf Index == 8
	Delay (2)
	DoCustomHighlightColors (strForeground, strBackground, sApp)
ElIf Index == 9	;Braille
	Delay (2)
	AddBrailleColors (strBrlForeground, strBrlBackground, sApp)
elif index == 10
	PerformScript CustomizeListView()
elif index == 11
	PerformScript SkimReadDialog()
ElIf index == 12
	PerformScript QuickSettings ()
elif index==13
	PerformScript SettingsPackager()
elif index == 14
	RunNavQuickKeysManager()
elif index == 15
	PerformScript DoFlexibleWebDialog();
elif index == 16
	; There was a problem with calling the CreatePrompt under this circumstance.  For some reason
	; CreatePrompt fails to identify the existing frame after the selection dialog is used.  Since
	; we already tested for an existing frame, just call the Frame Manager run with the modify frame
	; flag.
	; there was also a problem with ViewCustomSummary.
	if bModifyFrame then
		FrameSetOnWindow (GetCurrentWindow())
		SetParentDims()
		FrameManagerRun(FRAMEVIEW_ModifyPrompt,nMenuMode,0,cScNull)
		; reset GlobalVariables
		FrameClearValues()
	else
		PerformScript CreatePrompt ()
	endIf
elif index==17
	If bViewCustomSummary then
		Pause() ; allow time for dialog to be dismissed.
		CustomSummary(sApp)
	Elif bUseCustomLabeler then
		pause();give dialog time to be dismissed
		DeleteCustomLabel()
	else
		RunLookupModuleQueryUsingLRL_Dialog (sQuery)
	EndIf
elif index == 18
	pause() ; give dialog time to be dismissed
	DeleteAllCustomLabels()
elIf index == 19
	RunLookupModuleQueryUsingLRL_Dialog (sQuery)
EndIf
EndFunction
; 23-08-23 Hn Ende

; EL braille devices
; Attribute settings

Void Function FHPAttributSettings ()
	Var 
		String Liste,
		String Eintrag,
		String DlgName,
		String FileName

	if( IsSecureDesktop() == TRUE ) then
		return
	endIf

	FHPLoadSavedBrailleSettings ()

	If InHjDialog() then
		PerformScript RunJAWSManager();Let defaults speak message
		Return
	EndIf

	Let g_new_attr = 0
	Let g_Marking_Change = 0

	If MenusActive () Then
		TypeKey(cksEscape)
		Pause()
		TypeKey(cksEscape)
		Pause()
	EndIf

	Let g_IRetCurVal = 0 ; f r die Anzeige des aktuellen Attributes

	let g_iOld_BRLMode = GetBrailleMode()
	if (g_iOld_BRLMode  != BRL_MODE_LINE) then
		SetBrailleMode(BRL_MODE_LINE)
	endif

	Let g_OldAttributSettings = GetJcfOption(OPTBRL_MARKING)
	Let g_new_attr = g_OldAttributSettings 
	setJcfOption (OPTBRL_MARKING,BRL_MARKING_NONE)
	
	Let g_activeAttribut = GetCharacterAttributes()
	
	Let Eintrag = fhpmsg08 
	Let Liste = "|FHPIdentifyAttr:"+ Eintrag 
	Let Eintrag = fhpmsg10 
	Let Liste = Liste + "|FHPBrailleShowAllOrNothing:"+ Eintrag
	Let Eintrag =cmsg142_L
	Let Liste = Liste + "|FHPMarkHighlight:"+ Eintrag
	Let Eintrag =cmsg139_L
	Let Liste = Liste + "|FHPMarkBold:"+ Eintrag
	Let Eintrag =cmsg141_L
	Let Liste = Liste + "|FHPMarkUnderline:"+ Eintrag
	Let Eintrag =cmsg140_L
	Let Liste = Liste + "|FHPMarkItalic:"+ Eintrag
	Let Eintrag =cmsg143_L
	Let Liste = Liste + "|FHPMarkStrikeOut:"+ Eintrag
	Let Eintrag =fhpmsg21
	Let Liste = Liste + "|fhpMarkColor:" + Eintrag
	Let Eintrag =fhpmsg22
	Let Liste = Liste +"|FHPMarkScript:"+ Eintrag
	
	Let DlgName = Fhpmsg11 + " : " + cstrBrailleMarkingDlgName
	;Let g_SaveSetting = False
	Let g_iIsFHPDialog = TRUE
	dlgSelectFunctionToRun(Liste, DlgName, FALSE)
	Let g_iIsFHPDialog = FALSE
	SetBrailleMode(g_iOld_BRLMode)

	If g_Marking_Change > 0  Then
		setJcfOption (OPTBRL_MARKING,g_new_Attr) ;new settings for braille marking
	Else
		setJcfOption (OPTBRL_MARKING, g_OldAttributSettings )
		Let g_new_attr = g_OldAttributSettings 
	EndIf
	
	If( g_iLastNaviMove == BraillexEL2D ) Then 					;/ save settings when leaving dialog with braille key\;
		Let FileName =GetActiveConfiguration() + ".jcf"
		If StringContains(g_DlgName,cstrBrailleMarkingDlgName) Then
			iniWriteInteger(Section_Braille, "BrailleShowMarking",g_new_attr,FileName)
			Saystring(cmsgSettingSaved1_S)
		EndIf
		SwitchToConfiguration ("default")
		filename = StringSegment (filename,".",1)
		SwitchToConfiguration (Filename)
	EndIf

EndFunction

String Function FHPBrailleShowAllOrNothing (int iRetCurVal) 
Var 
	int iSetting,
	int iMode,
	Int oldMode,
	string strListText

let iMode = g_new_attr

if ! iRetCurVal  then
	if (iMode == BRL_MARKING_NONE) then
		Let iSetting =  BRL_MARKING_ALL_ATTRIBUTE
	EndIf
	
	If (iMode == BRL_MARKING_ALL_ATTRIBUTE) then
		Let iSetting = g_OldAttributSettings
	EndIf

	If (iMode == g_OldAttributSettings) then
		if g_OldAttributSettings !=0 then
		Let iSetting = BRL_MARKING_NONE
	EndIf
	EndIf
	Let g_Marking_Change = 1
	Let g_new_Attr = iSetting
Else
	Let iSetting= iMode
	
EndIf

	if iSetting == BRL_MARKING_ALL_ATTRIBUTE Then
		Return cmsg164_L
	ElIf iSetting == BRL_MARKING_NONE Then
		Return cmsg158_L
	ElIf iSetting == g_OldAttributSettings Then
		Return fhpmsg09 
	Else
		Return fhpmsg18 
	EndIf

EndFunction



String Function FHPIdentifyAttr (int iRetCurVal)
Var
int Attr,
string Name

	ScheduleFunction ("FHPExpandDlg",1)
	let attr = g_activeAttribut
If ! g_iRetCurVal then
	if (attr & ATTRIB_BOLD) then
		Let Name =Name + cmsg139_L  ; bold
	EndIf
	if (attr & ATTRIB_ITALIC) then
		Let Name = Name +" " + cmsg140_L	; italic
	EndIf	
	if (attr & ATTRIB_UNDERLINE) then
		Let Name = Name +" " + cmsg141_L  ; underline
	EndIf	
	if (attr & ATTRIB_HIGHLIGHT) then
		Let Name = Name +" " + cmsg142_L  ; highlight
	EndIf
	if (attr & ATTRIB_STRIKEOUT ) then
		Let Name = Name +" " + cmsg143_L  ; STRIKEOUT 
	EndIf
	If Attr == 0 Then
		Let Name = cmsg244_L
	EndIf
	Let g_IRetCurVal = 1
	Let g_Attr = Name
EndIf
	Return g_Attr

EndFunction

; End attribute settings



; Braille settings

Void Function FHPBrailleSettings ()
var
	String Eintrag,
	String Liste,
	String DlgName,
	String FileName,
	int PixelPerSpace


	if( IsSecureDesktop() == TRUE ) then
		return
	endIf

	FHPLoadSavedBrailleSettings()

	If InHjDialog() then
		PerformScript RunJAWSManager();Let defaults speak message
		Return
	EndIf

	If MenusActive () Then
		TypeKey(cksEscape)
		Pause()
		TypeKey(cksEscape)
		Pause()
	EndIf
	Let g_bBRLModeChanged = FALSE
	Let g_oldMode= GetBrailleMode()
	let g_iOld_BRLMode = GetBrailleMode()
	if (g_iOld_BRLMode  != BRL_MODE_LINE) then
		SetBrailleMode(BRL_MODE_LINE)
	endif
	
	Let g_OldAttributSettings = GetJcfOption(OPTBRL_MARKING)
	setJcfOption (OPTBRL_MARKING,BRL_MARKING_NONE)
	
	Let Eintrag = fhpmsg05 
	Let Liste = "|FHPActiveModeOption:"+ Eintrag

	Eintrag = StringSegment(jvGradeTwoModeOption,":",2)
	Let Liste = Liste + "|FHPGradeTwoModeOption:" + Eintrag

	if (GetPrimaryBrailleProfile () == "deu")							; only display if German is the Primary Braille Profile
		Let Liste = Liste + "|FHPContractedBrailleType:" + fhpmsg_DegreeOfReduction
	endif

	Eintrag = StringSegment(jvToggleG2CapSuppression,":",2)
	Let Liste = Liste + "|FHPToggleG2CapSuppression:" + Eintrag
	
	liste = liste +
	jvExpandCurrentWordOption
	
	;FC 05.08.10
	Let Eintrag = fhpmsg15 
	Let Liste = Liste + "|FHPBrailleKompLine:"+ Eintrag
	Let Liste = Liste +jvSixOrEightDotOption
	Let Eintrag = fhpmsg23 
	Let Liste = Liste + "|ToggleFlashMessages:"+ Eintrag

	Let DlgName = fhpmsg11+ " : " +cStrBrailleDlgName
	Let g_iIsFHPDialog = TRUE
	DlgSelectFunctionToRun (Liste, DlgName, false)

	Let g_iIsFHPDialog = FALSE

; save the settings

	If( g_iLastNaviMove == BraillexEL2D ) Then 					;/ save settings when leaving dialog with braille key\;
		FileName =GetActiveConfiguration() + ".jcf"
		iniWriteInteger(Section_Braille, "BrailleMode",  g_BrailleMode,FileName )
		iniWriteInteger(Section_Braille, "Grade2ExpandCurrentWord", GetJCFOption (OPT_BRL_G2EXPAND_CURRENT_WORD),FileName)
		iniWriteInteger(Section_Braille, "EightDotBraille",  GetJcfOption (OPTBRL_EIGHT_DOT),FileName)
		iniWriteInteger(Section_Braille, "BrailleMessages",  GetJcfOption(OPT_BRL_MESSAGES),FileName)
		let PixelPerSpace = GetJcfOption(OPT_PIXELS_PER_SPACE)
		if PixelPerSpace <= 0 then
			let PixelPerSpace = 8
		endif
		iniWriteInteger("OSM", "PixelsPerSpace",  PixelPerSpace,FileName)
		Saystring(cmsgSettingSaved1_S)
	EndIf

	if (g_bBRLModeChanged == FALSE) then
			SetBrailleMode(g_iOld_BRLMode)
	else
		if (g_iOld_BRLMode == BRL_MODE_LINE) then
			SetBrailleMode(BRL_MODE_STRUCTURED)
		else
			SetBrailleMode(BRL_MODE_LINE)
		endif
	endif

	setJcfOption (OPTBRL_MARKING,g_OldAttributSettings )

; found no other way to update Braille output
	ScheduleFunction("PressEsc",5,FALSE)
	PerformScript FHPAttributSettings()
EndFunction


Void Function PressEsc ()
	if (InHJDialog ())
		delay(1,TRUE)
		TypeKey(cksEscape)
		return
	endif
	ScheduleFunction("PressEsc",1,FALSE)
EndFunction


String Function FHPBrailleKompLine (int iRetCurVal)

Var 
	int iSetting,
	int iMode,
	string strListText


If (g_oldMode == BRL_MODE_STRUCTURED || g_oldMode  == BRL_MODE_SpeechBox) Then
	Return cMsgNotAvailable
EndIf
Let iMode = GetJcfOption(Opt_Pixels_Per_Space)

if ! iRetCurVal  then

	If iMode == 999 Then
		Let iSetting = 8
	ElIf iMode == 8 Then
		Let iSetting = 999
	EndIf

Else; Default

		Let iSetting = iMode

EndIf

	SetJcfOption(OPT_PIXELS_PER_SPACE,iSetting)

	If iSetting == 999 Then
		Return cmsgBrlFormat_S
	Else
		Return cmsgScreenFormat_S
	EndIf	


EndFunction


Void Function FHPWorkingMode ()
	Var 
		String Liste,
		String Eintrag,
		String DlgName,
		String sAppName
	
	if( IsSecureDesktop() == TRUE ) then
		return
	endIf
	
	If InHjDialog() then
		PerformScript RunJAWSManager();Let defaults speak message
		Return
	EndIf

	let g_oldCursorPos = 0

	FHPLoadSavedBrailleSettings ()

	If( MenusActive() ) Then
		TypeKey(cksEscape)
		Pause()
		TypeKey(cksEscape)
		Pause()
	EndIf

	let g_iOld_BRLMode = GetBrailleMode()
	if( g_iOld_BRLMode  != BRL_MODE_LINE ) then
		SetBrailleMode( BRL_MODE_LINE )
	endif

	Let g_OldAttributSettings = GetJcfOption( OPTBRL_MARKING )
	setJcfOption ( OPTBRL_MARKING, BRL_MARKING_NONE )


	Let Eintrag = fhpmsg17 
	Let Liste = "|FHPToggleWorkingMode:"+ Eintrag
	if( IniReadInteger ( "extendedMode", "All", 0, BrailleModeIniFile ) == 1 ) then ;/ der extended mode ist normalerweise aus und muss expliziet eingeschaltet werden \;
		Let Eintrag = fhpmsg24
		Let Liste = Liste + "|FHPSwitchReadingNaviMode:"+ Eintrag
		Let Eintrag = fhpmsg25
		Let Liste = Liste + "|FHPSwitchProfiMode:"+ Eintrag
	endIf
;	Let Eintrag = fhpmsg26
;	Let Liste = Liste + "|FHPSwitchWordStatusCell:" + Eintrag 
	Let DlgName = Fhpmsg11 + " : " + fhpmsg17 + " " + GetActiveConfiguration()
	
	;Let	g_SaveSetting = FALSE ;/ cleaning \;
	Let g_iIsFHPDialog = TRUE
	dlgSelectFunctionToRun( Liste, DlgName, FALSE )
	Let g_iIsFHPDialog = FALSE

	SetBrailleMode( g_iOld_BRLMode )
	setJcfOption( OPTBRL_MARKING,g_OldAttributSettings )
	
	If( g_iLastNaviMove == BraillexEL2D ) Then 					;/ Dialog mit 2D verlassen, settings speichern \;
		Let sAppName =GetActiveConfiguration()
		IniWriteInteger( "BrailleMode", sAppName, g_iELXBrailleMode, BrailleModeIniFile, FALSE )
		IniWriteInteger( "SpeakingNaviMode", fhpmsg24, g_iSpeakingNaviMode, BrailleModeIniFile, FALSE )
		IniWriteInteger( "ProfiMode", fhpmsg25, g_iProfiMode, BrailleModeIniFile, FALSE )
		IniFlush (BrailleModeIniFile)	
		Saystring(cmsgSettingSaved1_S)
	EndIf
EndFunction



String Function FHPToggleWorkingMode (int iRetCurVal)
	Var 
		int iSetting,
		int iMode,
		string strListText
	ScheduleFunction ("FHPExpandDlg",1)
	if( iRetCurVal == 0 )
		if( g_iELXBrailleMode == FHPNaviMode) Then
			Let g_iELXBrailleMode = FHPPcMode
		elIf( g_iELXBrailleMode == FHPPcMode) Then
			Let g_iELXBrailleMode = FHPKombiMode
		elIf( g_iELXBrailleMode == FHPKombiMode) Then
			Let g_iELXBrailleMode = FHPNaviMode
		else
			Let g_iELXBrailleMode = FHPNaviMode
		endIf		
		
	endIf
	if( g_iELXBrailleMode == FHPNaviMode ) Then
		return fhpmsg02
	elIf( g_iELXBrailleMode == FHPPcMode ) Then
		return fhpmsg01
	elIf( g_iELXBrailleMode == FHPKombiMode ) Then
		return fhpmsg03
	endIf 

EndFunction


String Function FHPSwitchReadingNaviMode (int iRetCurVal)
	
	if( iRetCurVal == 0 ) Then ;/ ich wurde aufgerufen und soll was aendern\;
		if( g_iOld_BRLMode == BRL_MODE_STRUCTURED )
			SayString(fhpmsg28)
		elIf( g_iOld_BRLMode == BRL_MODE_LINE ) then 						;/ speaking navigation mode only available in line mode  \;
			Let g_iSpeakingNaviMode = !g_iSpeakingNaviMode 					;/ toggle settings \;
			Let g_iLastBrailleLineNr = 0								    ;/ initialize last braille position\;
		endIf
	endIf

	if( g_iOld_BRLMode == BRL_MODE_STRUCTURED ) then 
		return fhpmsg27 ;/ nicht verfuegbar \;
	else
		if( g_iSpeakingNaviMode == FALSE ) then
			return msgBrlOptionOff
		elIf( g_iSpeakingNaviMode == TRUE ) then
			return msgBrlOptionOn
		endIf
	endIf

EndFunction


String Function FHPSwitchProfiMode (int iRetCurVal)

	if( iRetCurVal == 0 ) Then ;/ state should be changed\;
		if( g_iProfiMode == TRUE ) Then 
			Let g_iProfiMode = FALSE
		elIf( g_iProfiMode == FALSE ) Then 
			Let g_iProfiMode = TRUE
		endIf
	endIf ;/ ende ( iRetCurVal == 0 ) \;
	
	if( g_iProfiMode == FALSE ) then
		return msgBrlOptionOff
	elIf( g_iProfiMode == TRUE ) then
		return msgBrlOptionOn
	endIf

EndFunction


String Function FHPSwitchWordStatusCell (int iRetCurVal)

	if( iRetCurVal == 0 ) Then 
		if( g_iWordStatusCell == FALSE ) then
			Let g_iWordStatusCell = TRUE
		elIf( g_iWordStatusCell == TRUE ) then
			Let g_iWordStatusCell = FALSE
		endIf
	endIf ;/ ende ( iRetCurVal == 0 ) \;
	
	if( g_iWordStatusCell == FALSE ) then
		return msgBrlOptionOff
	elIf( g_iWordStatusCell == TRUE ) then
		return msgBrlOptionOn
	endIf

EndFunction

String Function FHPActiveModeOption (int iRetCurVal)

var
	int iSetting,
	int iMode,
	string strListText

	ScheduleFunction ("FHPExpandDlg",1)
Let iMode = g_oldMode
if ! iRetCurVal then
	;Update it
	If iMode == BRL_MODE_LINE then
		Let iSetting = BRL_MODE_STRUCTURED
	ElIf iMode == BRL_MODE_attrib then
		Let iSetting = BRL_MODE_LINE;Don't toggle Attributes and characters here
	ElIf iMode == BRL_MODE_STRUCTURED then
		Let iSetting = BRL_MODE_LINE
	ElIf iMode == BRL_MODE_speechbox then
		Let iSetting = BRL_MODE_LINE
	Else; Default
		Let iSetting = iMode
	EndIf
;	SetBrailleMode (iSetting)
	Let g_oldMode =iSetting 
	
	If g_bBRLModeChanged == FALSE Then
		let g_bBRLModeChanged = TRUE
	Else
		let g_bBRLModeChanged = FALSE
	EndIf
;	SetBrailleMode (iSetting)
	Let g_BrailleMode = iSetting
Else; Not updating
	Let iSetting = iMode
	Let g_BrailleMode = iSetting
EndIf
;Get the corresponding string:
If iSetting == BRL_MODE_LINE then
	Return cmsg187_S
ElIf iSetting == BRL_MODE_STRUCTURED then
	Return cmsg186_S
ElIf iSetting == BRL_MODE_SPEECHBOX then
	Return cmsg219_S
ElIf iSetting == BRL_MODE_ATTRIB then
	;This option is disabled while displaying in Attributes
	Return cmsg188_S
EndIf


EndFunction


/*
String Function FHPGradeTwoModeOption (int iRetCurVal)
var
	int iGradeTwoMode
Let iGradeTwoMode = GetJcfOption (OPT_BRL_G2TRANSLATION)
if ! iRetCurVal then
	;Update it
	Let iGradeTwoMode = (! iGradeTwoMode)
	SetJCFOption (OPT_BRL_G2TRANSLATION, iGradeTwoMode)
EndIf

If iGradeTwoMode == 1 then
	Return cmsg_on
Else
	Return cmsg_off
EndIf


EndFunction
*/

String Function FHPExpandCurrentWordOption (int iRetCurVal)
var
	int iNewSetting
Let iNewSetting = GetJCFOption (OPT_BRL_G2EXPAND_CURRENT_WORD)
if ! iRetCurVal then
	;Update it
	Let iNewSetting = (! iNewSetting)
	SetJcfOption (OPT_BRL_G2EXPAND_CURRENT_WORD, iNewSetting)
	
EndIf

if iNewSetting == 1 then
	Return cmsg_on
else
	Return cmsg_off
endIf


EndFunction


String Function FHPSixOrEightDotOption (int iRetCurVal)
var
	int EightDot
let EightDot = GetJcfOption (OPTBRL_EIGHT_DOT)
If ! iRetCurVal then
	;Update it
	Let EightDot = (! EightDot)
	SetJcfOption (OPTBRL_EIGHT_DOT, EightDot)
EndIf
if ! (EightDot) then
	Return cmsg165_L
else
	Return cmsg166_L
EndIf

EndFunction


Void Function FHPBraillexEL2R ()
var
	int iSub,
	int nMSAAState = 0

	Let g_iLastNaviMove	 = BraillexEL2R
	If( InHjDialog() == TRUE ) Then
		Let iSub = GetObjectSubTypeCode()
		If ( iSub == WT_TREEVIEW || iSub == WT_TREEVIEWITEM )  Then 
			nMSAAState = GetControlAttributes()& ~CTRL_SELECTED
			if ( nMSAAState && ! (nMSAAState & CTRL_OPENED))
				TypeKey(cksRightArrow)
				Return
			else
				TypeKey(cksSpace)
			 	Return	
			endIf
		Elif ( iSub == WT_LISTBOX) || ( iSub == WT_LISTBOXITEM ) || ( iSub == WT_LISTVIEW) || iSub == WT_LISTVIEWITEM Then 
			TypeKey(cksSpace)
		 	Return	
		endIf
	endIf
	
	FHPLoadSavedBrailleSettings()

	If( g_iELXBrailleMode == FHPPcMode || profiModeActive() == TRUE ) Then ;/ ausgelagert in eine Funktion da die abfrage zu unuebersichtlich wurde \;
		TypeKey(cksTab)
	endIf

	If( g_iELXBrailleMode == FHPKombiMode ) Then
		FHPBrailleMoveRight ()
		return
	EndIf

	If( g_iELXBrailleMode == FHPNaviMode ) Then
		FHPBrailleMoveRight ()
		FHPBraillexELSpeakBrailleLine()
	endIf 
	
EndFunction ;/ FHPBraillexEL2R() \;


Void Function FHPBraillexEL2L ()
var
	int iSub,
	int nMSAAState = 0

	Let g_iLastNaviMove	 = BraillexEL2L
	If( InHjDialog() == TRUE ) Then
		Let iSub = GetObjectSubTypeCode()
		If ( iSub == WT_TREEVIEW || iSub == WT_TREEVIEWITEM )  Then 
			nMSAAState = GetControlAttributes()& ~CTRL_SELECTED
			if ( nMSAAState &&  (nMSAAState & CTRL_OPENED))
				TypeKey(cksLeftArrow)
				Return
			else
				TypeKey(cksSpace)	
			 	Return	
			endif
		Elif( iSub == WT_LISTBOX || iSub == WT_LISTBOXITEM ||  iSub == WT_LISTVIEW || iSub == WT_LISTVIEWITEM) Then 
			TypeKey(cksSpace)
		 	Return	
		EndIf
	EndIf

	FHPLoadSavedBrailleSettings()

	If( g_iELXBrailleMode == FHPPcMode || profiModeActive() == TRUE ) Then ;/ ausgelagert in eine Funktion da die abfrage zu unuebersichtlich wurde \;
		TypeKey(cksShiftTab)
	EndIf

	If( g_iELXBrailleMode == FHPKombiMode ) Then
		FHPBrailleMoveLeft ()
		return
	EndIf

	If( g_iELXBrailleMode == FHPNaviMode )
		FHPBrailleMoveLeft ()
		FHPBraillexELSpeakBrailleLine()
	EndIf 
EndFunction ;/ FHPBraillexEL2L() \; 


Void Function FHPBraillexEL2U ()
var
	string sClass
	Let g_iLastNaviMove	 = BraillexEL2U

	If( IsFormsModeActive() == TRUE ) Then
		Let sClass = GetWindowClass( getTopLevelWindow( getFocus() ) )
		If( StringContains( sClass, "IEFrame" ) ) Then
			TurnOffFormsMode()
			PerformScript TopOfFile()
			Return
		EndIf
	EndIf

	If( UserBufferIsActive() == TRUE || IsVirtualPCCursor() == TRUE ) Then
		PerformScript TopOfFile()
		Return
	EndIf
	
	If( InHjDialog() == TRUE ) Then
		TypeKey(cksEscape)
		Return
	EndIf

	FHPLoadSavedBrailleSettings()
		
	If( g_iELXBrailleMode == FHPPcMode || profiModeActive() == TRUE ) Then ;/ ausgelagert in eine Funktion da die abfrage zu unuebersichtlich wurde \;
		FHPBrailleEscape()
		Return
	EndIf

	If( g_iELXBrailleMode == FHPKombiMode ) Then
		FHPBrailleShowWindowsTop()
		Return
	EndIf

	If( g_iELXBrailleMode == FHPNaviMode ) Then
		FHPBrailleShowWindowsTop()
		FHPBraillexELSpeakBrailleLine()
		Return
	EndIf
EndFunction ;/ FHPBraillexEL2U() \;


Void Function FHPBraillexEL2D ()
	Var
		String sClass
	Let g_iLastNaviMove	 = BraillexEL2D

	If( IsFormsModeActive() == TRUE ) Then		
		Let sClass = GetWindowClass( getTopLevelWindow( getFocus() ) )
		If( StringContains( sClass, "IEFrame" ) ) Then
			TurnOffFormsMode()
			PerformScript BottomOfFile()
			Return
		EndIf
	EndIf

	If( UserBufferIsActive() == TRUE || IsVirtualPCCursor() == TRUE ) Then
		PerformScript BottomOfFile()
		Return
	EndIf

	If ( InHjDialog() == TRUE ) Then
		Let g_DlgName = GetWindowName(GetTopLevelWindow(GetFocus()))
		;Let g_SaveSetting = True
		TypeKey(cksEnter)
		Return
	EndIf

	FHPLoadSavedBrailleSettings()

	If( g_iELXBrailleMode == FHPPcMode || profiModeActive() == TRUE ) Then ;/ ausgelagert in eine Funktion da die abfrage zu unuebersichtlich wurde \;
		TypeKey(cksEnter)
		return
	EndIf 

	If( g_iELXBrailleMode == FHPKombiMode ) Then
		FHPBrailleShowWindowsBottom()
	EndIf 

	If( g_iELXBrailleMode == FHPNaviMode ) Then
		FHPBrailleShowWindowsBottom()
		FHPBraillexELSpeakBrailleLine()
	EndIf 
EndFunction ;/ FHPBraillexEL2D() \;


Void Function FHPBraillexEL1R ()
	var
		int iSub
	Let g_iLastNaviMove	 = BraillexEL1R

	If( InHjDialog() == TRUE ) Then
		Let iSub = GetObjectSubTypeCode()
		If( iSub == WT_LISTBOX || iSub == WT_TREEVIEW || iSub == WT_LISTBOXITEM || iSub == WT_TREEVIEWITEM || iSub == WT_LISTVIEW || iSub == WT_LISTVIEWITEM ) Then
			BraillePanRight()								; nur innerhalb der Bildschirmseite lesen
			Return
		EndIf
			FHPBraillePanRight()
		return
	else
		FHPLoadSavedBrailleSettings()
	EndIf	


	If( g_iELXBrailleMode == FHPPcMode || profiModeActive() == TRUE ) Then ;/ ausgelagert in eine Funktion da die abfrage zu unuebersichtlich wurde \;
		If( StringContains( GetScriptAssignedTo( "rightArrow" ), "SayNextCharacter"  ) == 1 ) Then
			PerformScript SayNextCharacter()
		Else
			TypeKey(cksRightArrow)
		EndIf
		return
	EndIf

	If( g_iELXBrailleMode == FHPKombiMode ) Then
		PerformScript  FHPBrailleSpeechPanRight()
		return
	EndIf

	If( g_iELXBrailleMode == FHPNaviMode ) Then
		PerformScript BraillePanRight()
		FHPBraillexELSpeakBrailleLine()		
	EndIf
EndFunction ;/ FHPBraillexEL1R() \;


Void Function FHPBraillexEL1L ()
	var
		int iSub
	Let g_iLastNaviMove	 = BraillexEL1L

	If( IsVirtualPcCursor() == TRUE ) Then
		If( g_iELXBrailleMode == FHPKombiMode ) Then
			PerformScript  FHPBrailleSpeechPanLeft()
		Else
			PerformScript BraillePanLeft()
		EndIf
		Return
	EndIf

	If( InHjDialog() == TRUE ) Then
		Let iSub = GetObjectSubTypeCode()
		If( iSub == WT_LISTBOX || iSub == WT_TREEVIEW || iSub == WT_LISTBOXITEM || iSub == WT_TREEVIEWITEM || iSub == WT_LISTVIEW || iSub == WT_LISTVIEWITEM) Then
			BraillePanLeft()								; nur innerhalb der Bildschirmseite lesen
			Return
		EndIf
			FHPBraillePanLeft()
		return
	else
		FHPLoadSavedBrailleSettings()
	EndIf	

	If( g_iELXBrailleMode == FHPPcMode || profiModeActive() == TRUE ) Then ;/ ausgelagert in eine Funktion da die abfrage zu unuebersichtlich wurde \;
		If( StringContains( GetScriptAssignedTo( "leftArrow" ), "SayPriorCharacter"  ) == 1 ) Then
			PerformScript SayPriorCharacter()
		Else
			TypeKey(cksLeftArrow)
		EndIf
		Return
	EndIf

	If( g_iELXBrailleMode == FHPKombiMode ) Then
		PerformScript  FHPBrailleSpeechPanLeft()
		return
	EndIf
	
	If( g_iELXBrailleMode == FHPNaviMode ) Then
		PerformScript BraillePanLeft()
		SaveCursor()
		BrailleCursor()

		FHPBrailleCheckTopLeft ()

		RestoreCursor()	
		FHPBraillexELSpeakBrailleLine()
	endIf 

EndFunction ;/ FHPBraillexEL1L() \;


Void Function FHPBraillexEL1U ()
	Var
		String sClass,
		int iSub
	Let g_iLastNaviMove	 = BraillexEL1U

	If( UserBufferIsActive() == TRUE || IsVirtualPCCursor() == TRUE ) Then
		PerformScript SayPriorLine()
		Return
	EndIf

	If( InHjDialog() == TRUE ) Then
		Let iSub = GetObjectSubTypeCode()
		If( iSub == WT_LISTBOX || iSub == WT_TREEVIEW || iSub == WT_LISTBOXITEM || iSub == WT_TREEVIEWITEM || iSub == WT_LISTVIEW || iSub == WT_LISTVIEWITEM) Then
			TypeKey(cksUpArrow)
			Return
		EndIf
	EndIf

	FHPLoadSavedBrailleSettings()

	If( g_iELXBrailleMode == FHPPcMode || profiModeActive() == TRUE ) Then 
		If( StringContains( GetScriptAssignedTo( "upArrow" ), "SayPriorLine" ) == 1 ) then
			PerformScript SayPriorLine()
		Else
			TypeKey(cksUpArrow)
		Endif
		Return
	EndIf

	If( g_iELXBrailleMode == FHPKombiMode ) Then
		PerformScript  FHPBrailleSpeechPriorLine()
		return
	endIf

	If( g_iELXBrailleMode == FHPNaviMode ) Then
		SaveCursor()
		BrailleCursor()
		Let sClass = GetWindowClass(GetCurrentWindow())
		Let bRow = GetCursorRow()
		RestoreCursor()
		If( StringContains( GetWindowClass(GetFocus()), "SysListView32" ) == 1 && StringContains( sClass, "Button" ) == 1 ) Then
			RouteBrailleToPc ()
			Return
		EndIf
		PerformScript BraillePriorLine()
		SaveCursor()
		BrailleCursor()
		FHPBrailleCheckTopLeft ()
		RestoreCursor()
		FHPBraillexELSpeakBrailleLine()
	EndIf 
EndFunction ;/ FHPBraillexEL1U() \;

Void Function FHPBraillexEL1D ()
	var
		int iSub
	Let g_iLastNaviMove	 = BraillexEL1D

	If( UserBufferIsActive() == TRUE || IsVirtualPCCursor() == TRUE ) Then
		PerformScript SayNextLine()
		Return
	EndIf
	
	If( InHjDialog() == TRUE ) Then
		Let iSub = GetObjectSubTypeCode()
		If( iSub == WT_LISTBOX || iSub == WT_TREEVIEW || iSub == WT_LISTBOXITEM || iSub == WT_TREEVIEWITEM || iSub == WT_LISTVIEW || iSub == WT_LISTVIEWITEM) Then
			TypeKey(cksDownArrow)
			Return
		EndIf
	EndIf

	FHPLoadSavedBrailleSettings()
	
	If( g_iELXBrailleMode == FHPPcMode || profiModeActive() == TRUE ) Then 
		If( StringContains( GetScriptAssignedTo( "downArrow" ), "SayNextLine" ) ) Then
			PerformScript SayNextLine()
		else
			TypeKey(cksDownArrow)
		endif
		Return
	EndIf

	If( g_iELXBrailleMode == FHPKombiMode  ) Then 
		PerformScript  FHPBrailleSpeechNextLine()
		return
	endIf
	
	If( g_iELXBrailleMode == FHPNaviMode   ) Then 
		PerformScript BrailleNextLine()
		FHPBraillexELSpeakBrailleLine()
	endIf
EndFunction ;/ FHPBraillexEL1D() \;


Void Function FHPBraillexELSpeakBrailleLine ()
	if( g_iSpeakingNaviMode == TRUE && GetBrailleMode() == BRL_MODE_LINE )
			pause()
			SaveCursor()
			BrailleCursor()

			if( getCursorRow() != g_iLastBrailleLineNr )		
				SayString( getLine() )
				Let g_iLastBrailleLineNr = getCursorRow()
			endIf
			RestoreCursor()
		endIf
EndFunction



Void Function FHPBrailleMoveLeft ()
	SaveCursor()
	InvisibleCursor()
	RouteInvisibleToBraille()
	JawsEnd()
	JawsHome()
	RouteBrailleToInvisible()
	BrailleCursor()
	BrailleRefresh()
	RestoreCursor()
EndFunction


Void Function FHPBrailleMoveRight ()
	SaveCursor()
	InvisibleCursor()
	RouteInvisibleToBraille()
	JawsHome()
	JawsEnd()
	RouteBrailleToInvisible()
	BrailleCursor()
	BrailleRefresh()
	RestoreCursor()
EndFunction


Void Function RouteInvisibleToBraille ()
Var
	Int x,
	Int y

	BrailleCursor()
	Let x = GetCursorCol()
	Let y = GetCursorRow()
	InvisibleCursor()
	MoveTo(x,y)
EndFunction

Void Function RouteBrailleToInvisible ()
Var
	Int x,
	Int y
	
	InvisibleCursor()
	Let x = GetCursorCol()
	Let y = GetCursorRow()
	BrailleCursor()
	MoveTo(x,y)
EndFunction



String Function FHPMarkScript (int iRetCurVal)
Return FHPMarkOption (iRetCurVal, BRL_MARKING_EXTENDED)
EndFunction

String Function FHPMarkColor (int iRetCurVal)
Return FHPMarkOption (iRetCurVal, BRL_MARKING_COLOR)
EndFunction

String Function FHPMarkStrikeOut (int iRetCurVal)
Return FHPMarkOption (iRetCurVal, BRL_MARKING_STRIKEOUT)
EndFunction

String Function FHPMarkItalic (int iRetCurVal)
Return FHPMarkOption (iRetCurVal, BRL_MARKING_ITALIC)
EndFunction

String Function FHPMarkUnderline (int iRetCurVal)
Return FHPMarkOption (iRetCurVal, BRL_MARKING_UNDERLINE)
EndFunction

String Function FHPMarkBold (int iRetCurVal)
Return FHPMarkOption (iRetCurVal, BRL_MARKING_BOLD)
EndFunction

String Function FHPMarkHighlight (int iRetCurVal)
Return FHPMarkOption (iRetCurVal, BRL_MARKING_HIGHLIGHT)
EndFunction

String Function FHPMarkOption (int iRetCurVal, int iOption)
var
	int iMark

If !iRetCurVal then
	;Update it
	Let g_Marking_Change = 1
	Let g_new_attr = MarkingBit(iOption)
Else

	If g_Marking_Change == 0 then
		Let iMark = GetJcfOption (OPTBRL_MARKING)
	endIf

EndIf

If g_Marking_Change > 0 then
	Let iMark = g_new_attr
Else
	Let iMark = g_OldAttributSettings
	Let g_new_attr = iMark
EndIf

if iMark & iOption then
	Return msgBrlOptionOn 	
Else
	Return msgBrlOptionOff	
EndIf
EndFunction



Int Function MarkingBit (int mark)
Var
String sMark,
Int iTmp

If g_new_attr == 0 && g_Marking_Change == 0Then
;	Let iTmp = GetJcfOption (OPTBRL_MARKING)
	Let iTmp = g_OldAttributSettings
else
	Let iTmp = g_new_attr
EndIf

If mark & iTmp  then
	Let iTmp = itmp - mark
Else
	Let iTmp = itmp + mark
EndIf
return iTmp
EndFunction


;/  Functions for direct change of modes on EL braille devices\;

Void Function FHPBraillexELActivateNaviMode ()
	Let g_iELXBrailleMode = FHPNaviMode
	 FHPSayAndBrailleMessage( fhpmsg02 + " " + fhpmsg29) 
EndFunction

Void Function FHPBraillexELActivateCombiMode ()
	Let g_iELXBrailleMode = FHPKombiMode
	 FHPSayAndBrailleMessage( fhpmsg03 + " " + fhpmsg29)
EndFunction

Void Function FHPBraillexELActivatePcMode ()
	Let g_iELXBrailleMode = FHPPcMode
	 FHPSayAndBrailleMessage( fhpmsg01 + " " + fhpmsg29)
EndFunction

Void Function FHPBraillexELActivateLineMode ()
	SetBrailleMode(BRL_MODE_LINE)
	FHPSayAndBrailleMessageEx ( msgBrlLineMode_L, msgBrlLineMode_S)
	Refresh()
EndFunction

Void Function FHPBraillexELActivateStrukturedMode ()
	SetBrailleMode( BRL_MODE_STRUCTURED )
	FHPSayAndBrailleMessageEx ( msgBrlStructuredMode_L, msgBrlStructuredMode_S)
	Refresh()
EndFunction

Void Function FHPBraillexELToggelProfiMode ()
	Let g_iProfiMode = !g_iProfiMode
	if(  g_iProfiMode == TRUE ) then
		 FHPSayAndBrailleMessage( fhpmsg25 + " " + msgBrlOptionOn)
	else
		 FHPSayAndBrailleMessage( fhpmsg25 + " " + msgBrlOptionOff)
	endIf
EndFunction

Void Function FHPBraillexELToggelSpeakingNaviMode ()
	Let g_iSpeakingNaviMode = !g_iSpeakingNaviMode		
	if(  g_iSpeakingNaviMode == TRUE ) then
		 FHPSayAndBrailleMessage( fhpmsg24 + " " + msgBrlOptionOn)
	else
		 FHPSayAndBrailleMessage( fhpmsg24 + " " + msgBrlOptionOff)
	endIf
EndFunction

Void Function FHPLoadSavedBrailleSettings ()
	var
		String sAppName

	Let sAppName =GetActiveConfiguration()
	
	if( sAppName != g_sAppName ) then 							
		Let g_sAppName = sAppName
		Let g_iELXBrailleMode = IniReadInteger ( "BrailleMode", sAppName, g_iELXBrailleMode, BrailleModeIniFile )
		Let g_iSpeakingNaviMode = IniReadInteger ( "SpeakingNaviMode", fhpmsg24, g_iSpeakingNaviMode, BrailleModeIniFile )
		Let g_iProfiMode = IniReadInteger ( "ProfiMode", fhpmsg25, g_iProfiMode, BrailleModeIniFile )
		if( g_iELXBrailleMode < FHPNaviMode  ) then
			Let g_iELXBrailleMode = FHPNaviMode
		endIf
	endIf
EndFunction

Void Function FHPToggelExtendedMode ()
	var
		int iStatus

	Let iStatus = IniReadInteger ( "extendedMode", "All", 0, BrailleModeIniFile )
	Let iStatus = !iStatus
	IniWriteInteger ("extendedMode", "All", iStatus, BrailleModeIniFile, TRUE )
	if(  iStatus == TRUE ) then
		 FHPSayAndBrailleMessage( fhpmsg30 + " " + msgBrlOptionOn  )
	else
		 FHPSayAndBrailleMessage( fhpmsg30 + " " + msgBrlOptionOff )
	endIf
	

EndFunction

Void Function ProfiModeActive ()
	If( g_iProfiMode == TRUE ) then
		if( MenusActive() == ACTIVE || DialogActive () == ACTIVE ) then
			return TRUE
		elIf( getWindowClass( getFocus() ) == "NetUIHWND" || getWindowClass( getParent(getParent(getFocus())) ) == "NetUIHWND" )
			return TRUE
		endIf
	endIf
	return FALSE
EndFunction

Void Function FHPExpandDlg ()
	TypeKey(cksCtrlNumpadPlus)
EndFunction


Void Function FHPSayAndBrailleMessage (string psMessage_L)
	SayFormattedMessage (ot_status,psMessage_L)
	BrailleMessage (psMessage_L, 0)
EndFunction

Void Function FHPSayAndBrailleMessageEx (string psMessage_L, string psMessage_S)
	SayFormattedMessage (ot_status,psMessage_L, psMessage_S)
	BrailleMessage (psMessage_L, 0)
EndFunction


Void Function FHPRoutingAux ()
	PerformScript ScreenSensitiveHelp()
/*
var
	int attr,
	int nX,
	int nY,
	int nCell

	FHPBrailleUnhideBrailleCursor()
	let nCell = GetLastBrailleRoutingKey ()
	let nX = GetBrailleCellColumn (nCell)
	let nY = GetBrailleCellRow (nCell)
	SaveCursor ()
	InvisibleCursor()
;JawsCursor()
SayInteger(ncell)
SayInteger(nx)
SayInteger(ny)
	MoveTo (nX,nY)
	let attr = GetCharacterAttributes()
	SayString(GetCharacter())
	if (attr & ATTRIB_BOLD) then
		Say (cmsg139_L, OT_STRING)  
	endif
	if (attr & ATTRIB_ITALIC) then
		Say (cmsg140_L, OT_STRING)  
	endif
	if (attr & ATTRIB_UNDERLINE) then
		Say (cmsg141_L, OT_STRING) 
	endif
	if (attr & ATTRIB_HIGHLIGHT) then
		Say (cmsg142_L, OT_STRING) 
	endif
	if (attr & ATTRIB_STRIKEOUT) then
		Say (cmsg143_L, OT_STRING) 
	endif
	if (attr & ATTRIB_GRAPHIC) then
		Say (cmsg144_L, OT_STRING) 
	endif
	if (attr & ATTRIB_LRM_ARABIC) then
		Say (cmsgFont_LRM_Arabic, OT_STRING) 
	endif
	if (attr & ATTRIB_RTL_TEXT) then
		Say (cmsgFont_RTL_Text, OT_STRING) 
	endif
	if (attr & ATTRIB_DOUBLE_STRIKEOUT) then
		Say (cmsgFont_Double_Strikeout, OT_STRING) 
	endif
	if (attr & ATTRIB_SUPERSCRIPT) then
		Say (cmsgFont_Superscript, OT_STRING) 
	endif
	if (attr & ATTRIB_SUBSCRIPT) then
		Say (cmsgFont_Subscript, OT_STRING) 
	endif
	if (attr & ATTRIB_SHADOW) then
		Say (cmsgFont_Shadow, OT_STRING) 
	endif
	if (attr & ATTRIB_OUTLINE) then
		Say (cmsgFont_Outline, OT_STRING) 
	endif
	if (attr & ATTRIB_EXTENDED) then
		Say (cmsgFont_Extended, OT_STRING) 
	endif
	if (attr & ATTRIB_EMBOSS) then
		Say (cmsgFont_Emboss, OT_STRING) 
	endif
	if (attr & ATTRIB_ENGRAVE) then
		Say (cmsgFont_Engrave, OT_STRING) 
	endif
	if (attr & ATTRIB_SMALLCAPS) then
		Say (cmsgFont_Smallcaps, OT_STRING) 
	endIf

	RestoreCursor()
*/
EndFunction



Void Function FHPNewState  ()
; do nothing
EndFunction


Void Function FHPToggleCursorShape ()
Var
	String CursorDots
	Let CursorDots = BrailleGetCursorDots()
	if (CursorDots == EightDots) then
		BrailleSetCursorDots (Dots78)
	else
		BrailleSetCursorDots (EightDots)
	endIf
EndFunction



; Functions for EL-C


Void Function FHPBraillexELCDirectStart (int prognumber)
var
	string scommand
	let scommand = "StartFromIni.exe " + IntToString(prognumber)
	Run (scommand)
EndFunction


Void Function FHPBraillexELCDirectStartInit ()
	Run ("SetProgParameters.exe ")
EndFunction

; Functions for BrailleSplitMode


Void Function FHPBrailleActiveMovesBraille ()
	PerformScript ActiveMovesBraille()
EndFunction


Void Function FHPBrailleFuncLURU ()
;dummy for further extension
EndFunction


Void Function FHPBrailleFuncLURD ()
;dummy for further extension
EndFunction


Void Function FHPBrailleFuncLDRU ()
;dummy for further extension
EndFunction


Void Function FHPBrailleFuncLDRD ()
;dummy for further extension
EndFunction


Function FHPBrailleSplitMode ()
	PerformScript SetBrailleView()
EndFunction


Void Function FHPBrailleSplitToggleSide ()
	SwapSplitData ()
EndFunction


Void Function FHPBrailleSplitPriorLine ()
	if BrailleCanPanLinesIndependently() then
		performScript BrailleSplitPriorLine()
		return
	else
		FHPBraillePriorLine()
	endIf
EndFunction


Void Function FHPBrailleSplitNextLine ()
	if BrailleCanPanLinesIndependently() then
		performScript BrailleSplitNextLine()
		return
	else
		FHPBrailleNextLine()
	endIf

EndFunction


Void Function FHPBrailleSplitPanLeft ()
	if BrailleCanPanLinesIndependently() then
		performScript BrailleSplitPanLeft()
		return
	else
		FHPBraillePanLeft()
	endIf
EndFunction


Void Function FHPBrailleSplitPanRight ()
	if BrailleCanPanLinesIndependently() then
		performScript BrailleSplitPanRight()
		return
	else
		FHPBraillePanRight()
	endIf
EndFunction


String Function FHPGradeTwoModeOption (int iRetCurVal)
var
	int state,
	int iCaps,
	int i,
	int count,
	string file,
	string sBrailleProfile,
	string stmp
	GetPrimaryBrailleProfile()
	state=BrailleGetProfileState()

	if !iRetCurVal then
		if state == brlComputerInComputerOut then
			state=brlComputerInContractedOut
		else
			state=brlComputerInComputerOut
		endIf
	EndIf
	BrailleSetProfileState(state, -1)				
	file = GetActiveConfiguration() + ".jcf"
	sBrailleProfile = IniReadString ("Braille Profiles", g_sProfileName, "", file, rsStandardLayering)
	if (sBrailleProfile == "")
		sBrailleProfile = IniReadString ("Braille Profiles", g_sProfileName , "", "default.jcf", rsStandardLayering)
	endif
	
	count = StringSegmentCount (sBrailleProfile, "|")
	stmp = IntToString(state) 
	for i = 2 to count
		stmp = stmp + "|" + StringSegment (sBrailleProfile, "|", i) 
	endfor
	sBrailleProfile = stmp
	file = GetActiveConfiguration() + ".jcf"
	IniWriteString ("Braille Profiles", g_sProfileName, sBrailleProfile, file, TRUE)

	If state then
		Return msgBrlOptionOn
	Else
		Return msgBrlOptionOff
	EndIf
	
EndFunction



String Function FHPToggleG2CapSuppression (int iRetCurVal)
var
	int iG2Caps,
	string file,
	string stmp,
	int i,
	int count,
	int state,
	string sBrailleProfile

	GetPrimaryBrailleProfile()
	file = GetActiveConfiguration() + ".jcf"
	sBrailleProfile = IniReadString ("Braille Profiles", g_sProfileName, "", file, rsStandardLayering)
	if (sBrailleProfile == "")
		sBrailleProfile = IniReadString ("Braille Profiles", g_sProfileName , "", "default.jcf", rsStandardLayering)
	endif

	count = StringSegmentCount (sBrailleProfile, "|")
	iG2Caps = StringToInt(StringSegment (sBrailleProfile, "|", 5) + "|")

	if !iRetCurVal then
		Let iG2Caps = !iG2Caps
	EndIf

	for i = 1 to 4
		stmp = stmp + StringSegment (sBrailleProfile, "|", i) + "|"
	endfor
	stmp = stmp + IntToString(iG2Caps)
	
	for i = 6 to count
		stmp = stmp  + "|" + StringSegment (sBrailleProfile, "|", i)
	endfor

	sBrailleProfile = stmp

	file = GetActiveConfiguration() + ".jcf"
	IniWriteString ("Braille Profiles", g_sProfileName, sBrailleProfile, file, TRUE)

	if iG2Caps then
		Return cmsg_on ;BrlG2CapsOn
	Else
		Return cmsg_off ;BrlG2CapsOff
	EndIf

EndFunction


String Function GetPrimaryBrailleProfile ()
var
	string file

	file = GetActiveConfiguration() + ".jcf"
	g_sProfileName = IniReadString ("Braille", "PrimaryBrailleProfile", "", file, rsStandardLayering)
	if (g_sProfileName == "")
		file = "default.jcf"
		g_sProfileName = IniReadString ("Braille", "PrimaryBrailleProfile", "", file, rsStandardLayering)
	endif
	return g_sProfileName
EndFunction


String Function FHPContractedBrailleType (int iRetCurVal)
var
	string sCBT,
	string sCBTLeft,
	int iCBTRight,
	string file,
	string stmp,
	int state,
	int i,
	int count,
	string sBrailleProfile

	GetPrimaryBrailleProfile()
	file = GetActiveConfiguration() + ".jcf"
	sBrailleProfile = IniReadString ("Braille Profiles", g_sProfileName, "", file, rsStandardLayering)
	if (sBrailleProfile == "")
		sBrailleProfile = IniReadString ("Braille Profiles", g_sProfileName , "", "default.jcf", rsStandardLayering)
	endif

	count = StringSegmentCount (sBrailleProfile, "|")
	
	sCBT = StringSegment (sBrailleProfile, "|", 2)
	sCBTLeft = StringLeft (sCBT, 1)
	iCBTRight = StringToInt(StringRight (sCBT, 1))

	if !iRetCurVal then
		if iCBTRight == 0 || iCBTRight == 1
			iCBTRight = iCBTRight+1
		else
			iCBTRight = 0
		endif
	EndIf

	sCBT = sCBTLeft +  " " + IntToString(iCBTRight)
	sCBT = StringReplaceSubStrings(sCBT," ","")
	stmp = StringSegment (sBrailleProfile, "|", 1) + "|" + (sCBT)	
	for i = 3 to count
		stmp = stmp + "|" + StringSegment (sBrailleProfile, "|", i) 
	endfor
	sBrailleProfile = stmp

	IniWriteString ("Braille Profiles", g_sProfileName, sBrailleProfile, file, TRUE)

	sBrailleProfile = IniReadString ("Braille Profiles", g_sProfileName, "", file, rsStandardLayering)

	if iCBTRight == 0
		Return fhpmsg_Grade0		; Basisschrift
	elif iCBTRight == 1
		Return fhpmsg_Grade1		; Vollschrift
	elif iCBTRight == 2
		Return fhpmsg_Grade2		; Kurzschrift
	EndIf

EndFunction

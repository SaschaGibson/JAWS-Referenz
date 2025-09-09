; ----------------------------------------------------------------------------------
; $Id: //FusionSuite/Jaws/J26/26.5.0/Jaws/main/Settings/enu/Common/htlib.jss#1 $
; ----------------------------------------------------------------------------------

Include "hjconst.jsh" 	; default HJ constants
Include "htlib.jsm" 	; Message file for Handy Tech

globals
	string g_lastCharacterAttributes,
	int g_isReadAloudActive,
	int g_lastAttributes,
	string g_lastFont,
	string g_lastFontSize
	

; ##################################################################################
; ##################################################################################	
; # constants
; ##################################################################################
	
const 
	; Constants that specify actions that can be performed at the current cursor 
  ; position
	ACTION_SAY_WORD = 0,
	ACTION_SAY_CHAR = 1,

	; Constants for atc actions. This constants must correspond to the constants 
  ; defined within the driver source code
	ATC_JAWS_ACTION_DO_NOTHING = 0,
	ATC_JAWS_ACTION_SAY_CHARACTER = 1,
	ATC_JAWS_ACTION_SAY_WORD  = 2,
	ATC_JAWS_ACTION_SAY_LINE  = 3,
	ATC_JAWS_ACTION_LOW_SIGNAL  = 4,
	ATC_JAWS_ACTION_HIGH_SIGNAL  = 5,
	ATC_JAWS_ACTION_SAY_LINE_GO_NEXT_LINE  = 6,
	ATC_JAWS_ACTION_READ_ALOUD  = 7,
	ATC_JAWS_ACTION_SAY_ATTRIBUTE  = 8,
	ATC_JAWS_ACTION_SAY_ATTRIBUTE_CHANGED  = 9,
	ATC_JAWS_ACTION_ROUTE_CURSOR  = 10,
	ATC_JAWS_ACTION_SHOW_NEXT_LINE = 11,
	ATC_JAWS_ACTION_SHOW_PREV_LINE = 12,
	ATC_JAWS_ACTION_LINEEND_SIGNAL = 13,

	; Window class types
	WT_WORD_EDIT = "_WwG"  



Script htResetAttributChanges()
	let g_lastAttributes = 0
	let g_lastFont = ""
	let g_lastFontSize = ""
endScript
	

	
; ##################################################################################
; ##################################################################################
; # driver scripts
; ##################################################################################

;===============================================================
Script HTToggleStatusCellsOnOff()

	Var	Handle hwnd,
		Int statusShown

	; try to find handy tech driver server window
	Let hwnd = FindWindow (0, "Handy_Tech_Server", "")
	If (hwnd != 0) Then
		; check if status area is shown
		Let statusShown = SendMessage (hwnd,1074, 102, 2)
		If (statusShown == 2) Then 
			; braille device has dedicated status modules
			SayFormattedMessage (OT_JAWS_MESSAGE, msgHasRealStatusCells_L, msgHasRealStatusCells_S)
		Elif (statusShown == 1) Then
			; hide status area
			SayFormattedMessage (OT_JAWS_MESSAGE, msgStatusCellsOff_L, msgStatusCellsOff_S)
			SendMessage (hwnd, 1074, 102, 0)
		Else
			; display status area
			SayFormattedMessage (OT_JAWS_MESSAGE, msgStatusCellsOn_L, msgStatusCellsOn_S)
			SendMessage (hwnd, 1074, 102, 1)
		EndIf
	EndIf
EndScript


;===============================================================
Script HTToggleBrailleInputOnOff ()

	Var	Handle hwnd,
		Int brailleInputMode

	; try to find handy tech driver server window
	Let hwnd = FindWindow (0, "Handy_Tech_Server", "")
	If (hwnd != 0) Then
		; check current state of braille input
		Let brailleInputMode = SendMessage (hwnd,1074, 101, 2)
		If (brailleInputMode != 0) Then
			; disable braille input
			SendMessage (hwnd, 1074, 101, 0)
			SayFormattedMessage (OT_JAWS_MESSAGE, msgBrailleInputOff_L, msgBrailleInputOff_S)
		Else
			;enable braille input
			If (SendMessage (hwnd, 1074, 101, 1)) Then
				SayFormattedMessage (OT_JAWS_MESSAGE, msgBrailleInputOn_L, msgBrailleInputOn_S)
			Else
				SayFormattedMessage (OT_JAWS_MESSAGE, msgNoBrailleInputSupported_L, msgNoBrailleInputSupported_S)
			EndIf
		EndIf
	EndIf
EndScript


;===============================================================
Script HTTurnOnMenuMode ()

	Var	Handle hwnd
	
	; try to find handy tech driver server window
	Let hwnd = FindWindow (0, "Handy_Tech_Server", "")
	If (hwnd != 0) Then
		; switch into menu mode of braille system
		If (SendMessage (hwnd, 1074, 103, 0)) Then
			SayFormattedMessage (OT_MESSAGE, msgMenuMode_L, msgMenuMode_S)
		EndIf
	EndIf
EndScript


;===============================================================
Script HTBrailleStarPanLeft ()
	Var int orgBrlMoveActiveState
	
	let orgBrlMoveActiveState = GetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR)	
	SetJCFOption (OPT_BRL_MOVE_ACTIVE_CURSOR, 1)
	BrailleNavPanLeft ()
	SetJCFOption (OPT_BRL_MOVE_ACTIVE_CURSOR, orgBrlMoveActiveState)
EndScript


;===============================================================
Script HTBrailleStarPanRight ()
	Var int orgBrlMoveActiveState
	
	let orgBrlMoveActiveState = GetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR)	
	SetJCFOption (OPT_BRL_MOVE_ACTIVE_CURSOR, 1)
	BrailleNavPanRight ()
	SetJCFOption (OPT_BRL_MOVE_ACTIVE_CURSOR, orgBrlMoveActiveState)
EndScript


;===============================================================
Script HTNumPad0 ()
	TypeKey("0") 
EndScript

Script HTNumPad1 ()
	TypeKey("2") 
EndScript

Script HTNumPad2 ()
	TypeKey("3") 
EndScript

Script HTNumPad3 ()
	TypeKey("4") 
EndScript

Script HTNumPad4 ()
	TypeKey("5") 
EndScript

Script HTNumPad5 ()
	TypeKey("6") 
EndScript

Script HTNumPad6 ()
	TypeKey("7") 
EndScript

Script HTNumPad7 ()
	TypeKey("8") 
EndScript

Script HTNumPad8 ()
	TypeKey("9") 
EndScript

Script HTNumPad9 ()
	TypeKey("10") 
EndScript


;===============================================================
Script HTControlTab () 
	TypeKey("Control+Tab")
EndScript


;===============================================================
Script HTControlShiftTab ()
	TypeKey("Control+Shift+Tab") 
EndScript


;===============================================================
Script HTStartConfigDialog()

	Var	Handle hwnd
	
	; try to find handy tech driver server window
	Let hwnd = FindWindow (0, "Handy_Tech_Server", "")
	If (hwnd != 0) Then
		; start configuration dialog
		If (SendMessage(hwnd, 1074, 104, 0)) Then
			SayFormattedMessage (OT_MESSAGE, msgStartConfigDialog_L, msgStartConfigDialog_S)
		EndIf
	EndIf
EndScript


;===============================================================
Script HTToggleAtc()

	Var	Handle hwnd,
		Int atcMode

	; try to find handy tech driver server window
	Let hwnd = FindWindow (0, "Handy_Tech_Server", "")
	If (hwnd != 0) Then
		; check current state of ATC
		Let atcMode = SendMessage (hwnd,1074, 105, 2)
		If (atcMode == 2) Then
			; ATC not supported from Braille device
			SayFormattedMessage (OT_JAWS_MESSAGE, msgNoAtcSupported_L, msgNoAtcSupported_S)
		Elif (atcMode == 1) Then
			; disable braille input
			SendMessage (hwnd, 1074, 105, 0)
			SayFormattedMessage (OT_JAWS_MESSAGE, msgSetAtcOff_L, msgSetAtcOff_S)
		Else
			;enable braille input
			If (SendMessage (hwnd, 1074, 105, 1)) Then
				SayFormattedMessage (OT_JAWS_MESSAGE, msgSetAtcOn_L, msgSetAtcOn_S)
			EndIf
		EndIf
	EndIf
EndScript


;===============================================================
Script HTToggleAtcProtocol()

	Var	Handle hwnd,
		Int atcProtocolMode

	; try to find handy tech driver server window
	Let hwnd = FindWindow (0, "Handy_Tech_Server", "")
	If (hwnd != 0) Then
		; check current state of ATC
		Let atcProtocolMode= SendMessage (hwnd,1074, 106, 2)
		If (atcProtocolMode== 2) Then
			; ATC not supported from Braille device
			SayFormattedMessage (OT_JAWS_MESSAGE, msgNoAtcSupported_L, msgNoAtcSupported_S)
		Elif (atcProtocolMode== 1) Then
			; disable ATC protocol
			SendMessage (hwnd, 1074, 106, 0)
			SayFormattedMessage (OT_JAWS_MESSAGE, msgSetAtcProtocolOff_L, msgSetAtcProtocolOff_S)
		Else
			;enable ATC protocol
			If (SendMessage (hwnd, 1074, 106, 1)) Then
				SayFormattedMessage (OT_JAWS_MESSAGE, msgSetAtcProtocolOn_L, msgSetAtcProtocolOn_S)
			EndIf
		EndIf
	EndIf
EndScript


;===============================================================
Script HTToggleLockedKeys ()

	Var	Handle hwnd,
			Int lockedKeysState

	; try to find handy tech driver server window
	Let hwnd = FindWindow (0, "Handy_Tech_Server", "")
	If (hwnd != 0) Then

		; check current state of locked keys
		Let lockedKeysState= SendMessage (hwnd,1074, 107, 2)
		If (lockedKeysState== 1) Then
			; unlock Braille keys
			SendMessage (hwnd, 1074, 107, 0)
			SayFormattedMessage (OT_JAWS_MESSAGE, msgSetLockedKeysOff_L, msgSetLockedKeysOff_S)
		Else
			;lock Braille keys
			If (SendMessage (hwnd, 1074, 107, 1)) Then
				SayFormattedMessage (OT_JAWS_MESSAGE, msgSetLockedKeysOn_L, msgSetLockedKeysOn_S)
			EndIf
		EndIf
	EndIf
EndScript


;===============================================================
Script onHtLayoutChangeEvent (int statusStart, int statusLength, int textStart, int textLength)

	; set status area
	if (statusLength > 0) Then
		SetDefaultJCFOption(OPT_BRL_STATUS_CELLS_START, statusStart);
		SetJCFOption(OPT_BRL_STATUS_CELLS_START, statusStart);
	Else
		SetDefaultJCFOption(OPT_BRL_STATUS_CELLS_START, 0);
		SetJCFOption(OPT_BRL_STATUS_CELLS_START, 0);
	endif;
	SetDefaultJCFOption(OPT_BRL_STATUS_CELLS, statusLength);
	SetJCFOption(OPT_BRL_STATUS_CELLS, statusLength);

	; set text area
	SetDefaultJCFOption(OPT_BRL_TEXT_CELLS_START, textStart);
	SetJCFOption(OPT_BRL_TEXT_CELLS_START, textStart);
	SetDefaultJCFOption(OPT_BRL_TEXT_CELLS, textLength);
	SetJCFOption(OPT_BRL_TEXT_CELLS, textLength);
	SetDefaultJCFOption(OPT_BRL_PAN_INCREMENT, textLength);
	SetJCFOption(OPT_BRL_PAN_INCREMENT, textLength);
EndScript


;===============================================================
Script HTGetCurrentCursorShape()

	Var	Handle hwnd,
	    string dotsAsString,
	    int dots
	    
	Let dotsAsString = BrailleGetCursorDots()
	Let dots = StringToInt(dotsAsString)
	
	; try to find handy tech driver server window
	Let hwnd = FindWindow (0, "Handy_Tech_Server", "")
	If (hwnd != 0) Then
		SendMessage(hwnd, 1074, 400, dots)
	EndIf
EndScript


;===============================================================
Script HTEchoTypedCharacter(string chr)
	
	Var Int echoCharMode;

	Let echoCharMode = GetJCFOption(OPT_TYPING_ECHO)
	If ((echoCharMode == 1) || (echoCharMode == 3)) Then
		SayString(chr)  
	EndIf
EndScript





; ##################################################################################
; ##################################################################################
; # ATC scripts
; ##################################################################################

;===============================================================
Void Function HTPerformActionAtCurrentPos (int actionToPerform)
var string attributes, int characterAttributes, string characterFont

	if (actionToPerform == ACTION_SAY_WORD) then
		SayFormattedMessage (OT_NONHIGHLIGHTED_SCREEN_TEXT, GetWord())
	elif (actionToPerform == ACTION_SAY_CHAR ) then
		SayFormattedMessage (OT_NONHIGHLIGHTED_SCREEN_TEXT, GetCharacter())
	endif
EndFunction


;===============================================================
Function HTMoveVirtualTo (int x, int y)
	GotoLineNumber (y)
		; Move to the desired character's x position
		let x = x-1
		while (x>0) 
			NextCharacter()
			let x = x-1
		endWhile
EndFunction


;===============================================================
Void Function HTPerformActionAtCellPos (int cell, int actionToPerform)
	Var
		int x, int y, int routeBrailleToCursor, int orgBrlMoveActiveState

	let orgBrlMoveActiveState = GetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR)

	; distinct active cursor
	if (IsVirtualPCCursor ()) then
		SetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR,0)
		SaveCursor()
		InvisibleCursor ()
		let x = GetBrailleCellColumn(cell)
		let y = GetBrailleCellRow(cell)
		HTMoveVirtualTo(x, y);
		HTPerformActionAtCurrentPos(actionToPerform)
		RestoreCursor()
		SetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR, orgBrlMoveActiveState )
	else
		SetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR,0)
		SaveCursor()
		InvisibleCursor ()
		let x = GetBrailleCellColumn(cell)
		let y = GetBrailleCellRow(cell)
		MoveTo(x, y);
		HTPerformActionAtCurrentPos(actionToPerform)
		RestoreCursor()
		SetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR, orgBrlMoveActiveState )
	endif

EndFunction


;===============================================================
Void Function HTRouteCursor (int cell, int isScreenText, int param1, int param2)
var 
	int x, int y

	if (!isScreenText) then
		return
	endif

	; We have to distinct between the cursors
	if (IsVirtualPCCursor ())  then
		SaveCursor()
		HTMoveVirtualTo(GetBrailleCellColumn(cell), GetBrailleCellRow(cell));
		RouteJAWSToPc ()
		RestoreCursor()
		return

	elif (IsJAWSCursor ()) then
		MoveTo(GetBrailleCellColumn(cell), GetBrailleCellRow(cell) )

	elif (IsPCCursor ()) then
		JawsCursor()
		MoveTo(GetBrailleCellColumn(cell), GetBrailleCellRow(cell) )
		PCCursor()
	endif
	
EndFunction


;===============================================================
int function htGetAttrChanges(int oldAttr, int newAttr)
	; not changes should be determined...
	return newAttr
endFunction


;===============================================================
String Function htGetAttributes(int onlyChanges)
var
	int attr, int attrMask, string retVal
	
	; get current attributes of interest
	let attr = GetCharacterAttributes()
	let attrMask = ATTRIB_BOLD | ATTRIB_ITALIC | ATTRIB_UNDERLINE | ATTRIB_STRIKEOUT
	let attr = attr & attrMask

	; if only changed should be found, determine changes
	if (onlyChanges) then
		if (g_lastAttributes == attr) then
			return ""
		elif (attr == 0) then
			let g_lastAttributes = 0
			return attrNormal
		endif

		let attr = htGetAttrChanges(g_lastAttributes, attr)
	endif 

	; compose string of attributes
	if (attr & ATTRIB_BOLD) then
		let retval = retval + " " + attrBold
	endif
	if (attr & ATTRIB_ITALIC) then
		let retval = retval + " " + attrItalic
	endif
	if (attr & ATTRIB_UNDERLINE) then
		let retval = retval + " " + attrUnderline
	endif
  	if (attr & ATTRIB_STRIKEOUT) then
		let retval = retval + " " + attrStrikeout
	endif
  
  ;	ATTRIB_GRAPHIC)
  ;	ATTRIB_HIGHLIGHT
  ;	ATTRIB_SUPERSCRIPT
  ;	ATTRIB_SUBSCRIPT
  ;	ATTRIB_SHADOW
  ;	ATTRIB_OUTLINE
  ;	ATTRIB_EXTENDED
  ;	ATTRIB_EMBOSS
  ;	ATTRIB_ENGRAVE
  ;	ATTRIB_SMALLCAPS

	if (attr == 0) && (!onlyChanges) then
		let retVal = attrNormal
	endif
	
	let g_lastAttributes = attr
	return retVal
EndFunction


;===============================================================
String Function htGetFont(int onlyChanges)
var 
	string currentFont

	let currentFont = GetCharacterFont()
	
	if (onlyChanges) then
		if (!StringCompare(g_lastFont, currentFont)) then
			return ""
		endif
	endif

	let g_lastFont = currentFont
	return currentFont
EndFunction


;===============================================================
String Function htGetFontSize(int onlyChanges)
;var 
;	string currentFontSize

	;let currentFontSize = GetFontSize();
	;let currentFontSize = inttostring(GetCharacterPoints())

	;if (onlyChanges) then
	;	if (!StringCompare(g_lastFontSize, currentFontSize)) then
	;		return ""
	;	endif
	;endif

	;let g_lastFontSize = currentFontSize
	;return currentFontSize

	return ""
EndFunction


;===============================================================
String Function getFontAttributeStringAtCell (int cell, int onlyChanges)
var 
	int x, int y, int activeCursor, string retVal, string fontSize,
	int orgBrlMoveActiveState
	
	let orgBrlMoveActiveState = GetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR)
	SetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR,0)

	; save cursor
	SaveCursor()
;	RouteInvisibleToPc()
	InvisibleCursor()
	
	let x = GetBrailleCellColumn(cell)
	let y = GetBrailleCellRow(cell)

	if (MoveTo(x, y)) then
		let retVal = htGetAttributes(onlyChanges)
		let retVal = retVal + " " + htGetFont(onlyChanges)
		let retVal = retVal + " " + htGetFontSize(onlyChanges)
	endif

	; restore cursor
	RestoreCursor()

	SetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR, orgBrlMoveActiveState)

	return retVal
EndFunction


;===============================================================
Void Function HTSayAttributeChanged (int cell, int isScreenText, int param1, int param2)
var 
	string characterAttributes

	if (!isScreenText) then
		return
	endif
	
	; Say character attributes is they have changed since the last call
	let characterAttributes = getFontAttributeStringAtCell (cell, true)
	if (characterAttributes  != g_lastCharacterAttributes) then
		let g_lastCharacterAttributes = characterAttributes
		SayFormattedMessage (OT_MESSAGE, characterAttributes, characterAttributes)
	endif
EndFunction


;===============================================================
; This script is only implemented within the microsoft office scripts. To be able to 
; use it everywhere, we define it globally
String Function GetFontSize ()
	return inttostring(GetCharacterPoints())
EndFunction


;===============================================================
Void Function HTSayAttribute (int cell, int isScreenText, int param1, int param2)
var
	string fontAttributeString 

	if (!isScreenText) then
		return
	endif

	let fontAttributeString = getFontAttributeStringAtCell (cell, false)
	if (fontAttributeString ) then
		SayFormattedMessage (OT_MESSAGE, fontAttributeString, fontAttributeString )
	endif
EndFunction


;===============================================================
Void Function HTReadAloud (int cell, int isScreenText, int param1, int param2)
	if (!g_isReadAloudActive) then
		let g_isReadAloudActive = true
		SayAll ()
		; {DownArrow}
	endif
EndFunction

;===============================================================
Void Function HTSayChar (int cell, int isScreenText, int param1, int param2)
	if (isScreenText) then
		HTPerformActionAtCellPos (cell, ACTION_SAY_CHAR )
	endif
EndFunction


;===============================================================
Void Function HTSayTextBetween (int unused, int isScreenText, int startCell, int endCell)
	Var
		int startX , int startY , int endX , int oldX, int oldY, String textToSay, int routeBrailleToCursor,
		int orgBrlMoveActiveState 

	if (!isScreenText) then
		return
	endif

	; distinct active cursor
	if (IsVirtualPCCursor ()) then
		SaveCursor()

		let startX = GetBrailleCellColumn(startCell)
		let startY = GetBrailleCellRow(startCell)
		let endX = GetBrailleCellColumn(endCell)

		; We have to read the whole line and cut of the characters that are out of the display's range
		HTMoveVirtualTo(startX , startY);
		let textToSay = GetToEndOfLine ()
		SayString(SubString(textToSay, 0, endCell-startCell+1) );

		RestoreCursor()

	else

		let orgBrlMoveActiveState = GetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR)
		SetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR,0)
		SaveCursor()
		InvisibleCursor ()

		let startX = GetBrailleCellColumn(startCell)
		let startY = GetBrailleCellRow(startCell)
		let endX = GetBrailleCellColumn(endCell)
		MoveTo(startX , startY)  
		let textToSay = GetTextBetween(startX, endX)

		; The last character is not included in the string we get from GetTextBetween. We have to read it ourselves
		MoveTo(endX , startY);
		let textToSay = " " + textToSay+GetCharacter()
		SayString(textToSay)
		RestoreCursor()
		SetJCFOption(OPT_BRL_MOVE_ACTIVE_CURSOR,orgBrlMoveActiveState)
	endif

EndFunction


;===============================================================
Void Function HTSayWord (int cell, int isScreenText, int param1, int param2)
	if (isScreenText) then
		; Param1 and param2 contain the word's start and end position
		;StopSpeech()
		HTSayTextBetween(cell, isScreenText, param1, param2)
	endif
EndFunction

;===============================================================
; This script gets called whenever the atc reading position changes.
;
; @param action Specifies the action assigned to the reading behaviour
; @param readingPos Specifies the current reading position
; @param isScreenText True if the text displayed at the passed position is actually displayed 
;               on the PC's screen. False, if the text was added by the driver itself (e.g. as marker for empty lines) 
; @param param1 Specified additional action specific information
; @param param2 Specified additional action specific information
;
Script onAtcActionEvent (int action, int readingPos, int isScreenText, int param1, int param2)

	; Check if ATC actions are currently allowed
	if (!isAtcActionAllowed(action)) then
		return
	endif

	; If reading aloud is active, it gets stopped by any other action 
	if (g_isReadAloudActive) then
		if  (action == ATC_JAWS_ACTION_READ_ALOUD) then
			return
		endif

		StopSpeech()
		let g_isReadAloudActive = false
		return
	endif 

	if  (action == ATC_JAWS_ACTION_SAY_CHARACTER) then
		HTSayChar (readingPos, isScreenText, param1, param2)
		return
	endif

	if  (action == ATC_JAWS_ACTION_SAY_WORD) then
		HTSayWord (readingPos, isScreenText, param1, param2)
		return
	endif

	if  (action == ATC_JAWS_ACTION_SAY_LINE) then
		HTSayTextBetween (readingPos, isScreenText, param1, param2)
		return
	endif

	if  (action == ATC_JAWS_ACTION_LOW_SIGNAL) then
		; Beep is done by the driver
		return
	endif

	if  (action == ATC_JAWS_ACTION_HIGH_SIGNAL) then
		; Beep is done by the driver
		return
	endif

	if  (action == ATC_JAWS_ACTION_SAY_LINE_GO_NEXT_LINE) then
		StopSpeech ()
		HTSayTextBetween (readingPos, isScreenText, param1, param2)
		performScript BraillePanRight ()
		return
	endif

	if  (action == ATC_JAWS_ACTION_READ_ALOUD) then
		HTReadAloud (readingPos, isScreenText, param1, param2) 
		return
	endif

	if  (action == ATC_JAWS_ACTION_SAY_ATTRIBUTE) then
		HTSayAttribute (readingPos, isScreenText, param1, param2) 
		return
	endif

	if  (action == ATC_JAWS_ACTION_SAY_ATTRIBUTE_CHANGED) then
		HTSayAttributeChanged (readingPos, isScreenText, param1, param2) 
		return
	endif

	if  (action == ATC_JAWS_ACTION_ROUTE_CURSOR) then
		HTRouteCursor (readingPos, isScreenText, param1, param2) 
		return
	endif

	if  (action == ATC_JAWS_ACTION_SHOW_NEXT_LINE) then
		PerformScript braillepanright()
		return
	endif

	if  (action == ATC_JAWS_ACTION_SHOW_PREV_LINE) then
		PerformScript braillepanleft()
		return
	endif

EndScript


;===============================================================
Int Function isAtcActionAllowed (int action)
	if (action == ATC_JAWS_ACTION_DO_NOTHING) then
		return true

	elif (action == ATC_JAWS_ACTION_ROUTE_CURSOR) then
		return true	; Routing the mouse is always possible

	elif (action == ATC_JAWS_ACTION_SAY_CHARACTER) then
		return isEditFieldFocused()

	elif (action == ATC_JAWS_ACTION_SAY_WORD) then
		return isEditFieldFocused()

	elif (action == ATC_JAWS_ACTION_SAY_LINE) then
		return isEditFieldFocused()

	elif (action == ATC_JAWS_ACTION_SAY_LINE_GO_NEXT_LINE) then
		return isEditFieldFocused()

	elif (action == ATC_JAWS_ACTION_READ_ALOUD) then
		return isEditFieldFocused()

	elif (action == ATC_JAWS_ACTION_SAY_ATTRIBUTE) then
		return isEditFieldFocused()

	elif (action == ATC_JAWS_ACTION_SAY_ATTRIBUTE_CHANGED) then
		return isEditFieldFocused()

	elif (action == ATC_JAWS_ACTION_SAY_ATTRIBUTE) then
		return isEditFieldFocused()

	elif (action == ATC_JAWS_ACTION_ROUTE_CURSOR) then
		return isEditFieldFocused()

	elif (action == ATC_JAWS_ACTION_SHOW_NEXT_LINE) then
		return isEditFieldFocused()

	elif (action == ATC_JAWS_ACTION_SHOW_PREV_LINE) then
		return isEditFieldFocused()

	elif (action == ATC_JAWS_ACTION_LINEEND_SIGNAL) then
		return isEditFieldFocused()

	endif

	return false
endFunction

;===============================================================
int function isEditFieldFocused()
var
	int windowType, string windowClass, handle currentWindow
	let currentWindow = GetCurrentWindow ()
	let windowType = GetWindowTypeCode (currentWindow)
	let windowClass = GetWindowClass (currentWindow)

	if (windowType ==  WT_EDIT) then
		return true

	elif (windowClass == WT_WORD_EDIT) then
		return true

;	elif (windowClass == "Internet Explorer_Server") then 		; Html help and internet explorer control
;		return true

;	elif (windowClass == "MozillaWindowClass") then 				; Firefox html window
;		return true

	else
		PerformScript htResetAttributChanges()

	endif	

	return false
EndFunction





; ##################################################################################
; ##################################################################################
; # map script names to old names (downwardly compatible)
; ##################################################################################

Script togglestatuscellsonoff ()
	PerformScript HTToggleStatusCellsOnOff ()
EndScript

Script togglebrailleinputonoff ()
	PerformScript HTToggleBrailleInputOnOff ()
EndScript

Script turnOnMenuMode ()
	PerformScript HTTurnOnMenuMode ()
EndScript

Script braillestarpanleft ()
	PerformScript HTBrailleStarPanLeft ()
EndScript

Script braillestarpanright ()
	PerformScript HTBrailleStarPanRight ()
EndScript

Script HT_SetBrailleText(String brailleText)
EndScript


Script MyAttribTest ()
var int orgX, int orgY

	; save cursor
	SaveCursor()
	RouteInvisibleToPc()
	InvisibleCursor()
	let orgX = GetCursorCol()
	let orgY = GetCursorRow()

	RoutePcToJaws()
	PcCursor()
	delay(1)

;	if (!IsInvisibleCursor()) then	
;		RouteInvisibleToPc()
;		InvisibleCursor()		
;	endif

;	SayString(GetFont())

;	SayString(htGetFont())
;	SayString(htGetAttributes())
;	SayInteger(htGetFontSize())


	; restore cursor
	PCCursor()
	MoveTo(orgX, orgY)
	RestorCursor()
EndScript



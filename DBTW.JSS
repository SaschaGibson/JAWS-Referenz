; script file for DBT for Windows
; cln, Jan. 7, 2019
; Copyright Duxbury Systems, Inc.
; All rights reserved.

Include "hjglobal.jsh"
Include "hjconst.jsh"
Include "default.jsm"
Include "dbtw.jsh"
Include "dbtw.jsm"
Include "common.jsm"


globals
	string sWindowName,
	string sOldWindowName,
	int nFocusChange,
	int MotionFlag,
	int SaySkipFlag,
int nMotionDone,
	int LineNum,
	int OldLineNum,
	string PageNum,
	string OldPageNum,
	int InTable,
	string sRowWord,
	string sRowNum,
	string sOldRowNum,
	string sColWord,
	string sColNum,
	string sOldColNum,
	int BrailleModeSave,
	int BrailleAutoRouteSave,
	int LeftMarginSave,
	int BrailleAutopanSave,
	int nTypingEchoSaved,
	int nFlashMessagesSaved,
	int nG2TranslationSaved,
	int nG2ExpandCurrentWordSaved,
	int nContractedInputSaved,
	int nEightDotSaved,
	int nBrailleDoc,
	int nBrailleEdit,
	int nBrailleStart,
	int nBrailleCharSpokenCol,
	int nInBrailleWindow,
	int nStartCol,
	int nStartRow,
	string StyleName,
	string OldStyleName,
	int DBTWHasRunBefore,
	int nCustomWindow,
	int DoNotForceTransLine,
	int StyleChangeVerbosity,
	int SkipVerbosity,
	int DoNotEchoBrailleChars,
	int nJFWVersion,
	int nBrailleTime,
	int iSuppressSameSpot,
	int nWindowTime,
	int nSelectCharacter,
	int nSelectWord,
int nSelectLine,
int nHighlight,
	int nOldHighlight,
	int nHighlightCheck,
	int nNewDoc,
int nProfileIndex,	int iSuppressMulti,

	int nCatchingUp,
	int nYMoved,
	handle SpellCheckWindow,

; globals below for backward compatibility
	int OT_USER_REQUESTED_INFO_X,
	int OPT_BRL_ACTIVE_X,
	int OPT_BRL_MESSAGES_X,
	int OPT_BRL_AUTOADVANCE_INTERVAL_X


int function IsSpeechOnDemandActive ()
return (IsSpeechOff() && getJCFOption(OPT_LESS_SPEECH) == 0)
endFunction

void function dbtSpeechOff ()
if IsSpeechOnDemandActive () return endIf
SpeechOff ()
endFunction

void function DBTSpeechOn ()
if IsSpeechOnDemandActive () return endIf
SpeechOn ()
endFunction

Void Function PauseForMovement ()

	Delay(1)

EndFunction


Void Function AutoStartEvent ()

	let nJFWVersion = GetJFWVersion ()
	if nJFWVersion >= 1700000 then
		let nProfileIndex = GetActiveProfileIndex ()
	endIf
	let MotionFlag = 0
	let SaySkipFlag = 0
	let iSuppressSameSpot = 0
	SendMessage (GetAppMainWindow (GetCurrentWindow ()), 0X0112, /*WM_SYSCOMMAND,*/ 0XF030, 0) /* maximize the window*/
	SendMessage (GetFirstChild (GetFirstChild (GetAppMainWindow (GetCurrentWindow ()))), 0X0112, /*WM_SYSCOMMAND,*/ 0XF030, 0) /* maximize the window*/
	if nBrailleEdit then
		let nBrailleStart = 1
	else
		let nCustomWindow = 0
	endIf
	if nJFWVersion < 600000 then
		let OT_USER_REQUESTED_INFO_X = OT_SCREEN_MESSAGE
	else
		let OT_USER_REQUESTED_INFO_X = 23
	endIf
	let OPT_BRL_ACTIVE_X = 87
	let OPT_BRL_MESSAGES_X = 104
	let OPT_BRL_AUTOADVANCE_INTERVAL_X = 38
	if DBTWHasRunBefore == FALSE then
		let StyleChangeVerbosity = 0
		let SkipVerbosity = 0
		let DBTWHasRunBefore = TRUE
		SayFormattedMessage (OT_APP_START, msgAppStart, msgAppStart)
	endIf
	SaveCursor ()
	RouteInvisibleToPc ()
	InvisibleCursor ()
	SetRestriction (RestrictRealWindow)
	JawsPageDown ()
	if GetControlID (GetCurrentWindow ()) != DBT_Window_Control then
		PriorLine ()
	EndIf
	RestoreCursor ()
	if nJFWVersion >= 451000 then
		SetBrailleRestriction (RestrictWindow)
	endIf
	let nInBrailleWindow=0
	if GetWindowClass (GetCurrentWindow ()) != wcMDIClient then
;		let nFocusChange = 3
		HandleCustomWindows (GetCurrentWindow ())
		let nFocusChange = 1
	endIf

EndFunction



Void Function AutoFinishEvent ()

	if nJFWVersion >= 1700000 then
		SetActiveVoiceProfileByIndex (nProfileIndex, False)
	endIf

	EndFunction


Script ScriptFileName ()

	ScriptAndAppNames (msgAppName)

EndScript


Script HotKeyHelp ()

	if UserBufferIsActive() then
		UserBufferDeactivate()
	EndIf
	SayFormattedMessage (OT_USER_BUFFER, msgJHotKeyHelp_L,msgJHotKeyHelp_S)

EndScript


Void Function SayBrailleChar (string VCTX, string CurrentChar)

var
	int iVal

	let iVal = GetCharacterValue (CurrentChar)
	if iVal < 48 then
		SayUsingVoice (VCTX, StringSegment (csBrailleChars32, ";", iVal-31),OT_STRING)
		return
	elif iVal <= 64 then
		SayUsingVoice (VCTX, StringSegment (csBrailleChars48, ";", iVal-47), OT_STRING)
		return
	elif iVal < 107 then
		SayUsingVoice (VCTX, StringSegment (csBrailleChars91, ";", iVal-90), OT_STRING)
		return
	elif iVal < 123 then
		SayUsingVoice (VCTX, StringSegment (csBrailleChars107, ";", iVal-106), OT_STRING)
		return
	elif iVal < 128 then
		SayUsingVoice (VCTX, StringSegment (csBrailleChars123, ";", iVal-122), OT_STRING)
		return
	elif iVal < 1088 then
		SayUsingVoice (VCTX, StringSegment (csBrailleChars1072, ";", iVal-1071), OT_STRING)
		return
	elif iVal < 1106 then
		SayUsingVoice (VCTX, StringSegment (csBrailleChars1088, ";", iVal-1087), OT_STRING)
		return
	elif iVal < 10256 then
		SayUsingVoice (VCTX, StringSegment (csBrailleChars10240, ";", iVal-10239), OT_STRING)
		return
	elif iVal < 10272 then
		SayUsingVoice (VCTX, StringSegment (csBrailleChars10256, ";", iVal-10255), OT_STRING)
		return
	elif iVal < 10288 then
		SayUsingVoice (VCTX, StringSegment (csBrailleChars10272, ";", iVal-10271), OT_STRING)
		return
	elif iVal < 10304 then
		SayUsingVoice (VCTX, StringSegment (csBrailleChars10288, ";", iVal-10287), OT_STRING)
		return
	endIf

EndFunction


Void Function FocusPointMovedEvent (int nX, int nY, int nOldX, int nOldY, int nUnit, int nDir, int nTimeElapsed)

var
	int x
;	string sWindowName

	let sWindowName = GetWindowName (GetRealWindow (GetCurrentWindow ()))
;if nSelectingText || nSaySelectAfter then
;	return
;endIf
	if not IsDocumentWindow (GetCurrentWindow ())
	&& not StringContains (sWindowName, wnFind)
	&& not StringContains (sWindowName, wnReplace)
	|| not IsPCCursor ()
	|| MotionFlag then
		return
	endif
	if nFocusChange then
		PauseForMovement ()
;		return
	endIf
	if not MotionFlag then
		SaveOldValues ()
		let MotionFlag = 0
	endIf
	if nBrailleEdit
	&& not DoNotEchoBrailleChars then
; in braille doc window, speak last character as braille cell,
		if not MotionFlag
		&& nTimeElapsed < 90
		&& nY-nOldY < 50
		&& nOldY-nY < 50
		&& nUnit == 0 then
			SayBrailleChar (VCTX_KEYBOARD, GetPriorCharacter ())
			PauseForMovement ()
			if GetWindowClass (GetCurrentWindow ()) == wcDBTWindow then
				let nFocusChange = 0
			endIf
		; below avoid saying "new line" or "space" when starting a Find or Replace command
			if nY != nOldY
			|| nx < nOldX
			&& not nFocusChange then
				if LineNum != -1 then
					SayMessage (OT_KEYBOARD, msgNewLine, msgNewLine)
				endIf
				let nFocusChange = 0
			endIf
			if GetCharacterValue (GetPriorCharacter ()) == 0 then
				SayMessage (OT_KEYBOARD, msgSpace, msgSpace)
			endIf
		endIf
	endIf
	if !MotionFlag then
		PauseForMovement ()
		GetNewValues ()
	endIf		

EndFunction


Void Function SayCharacterValue ()

var
	int iUnicode,
	string sUnicodeMod

	if not StringIsBlank (GetUnicodeValue ()) then
		SayString (GetUnicodeValue ())
	else
		SayCharacterValue ()
	endIf

endFunction


String Function GetUnicodeValue ()

var
	int iUnicode,
	string sUnicodeMod,
	string sUnicodeValue

	if not IsDocumentWindow (GetCurrentWindow ())
	|| nBrailleEdit then
		return ""
	endIf
	SaveCursor ()
	InvisibleCursor ()
	RouteInvisibleToPc ()
	JawsPageDown ()
	JawsHome ()
	if GetControlID (GetCurrentWindow ()) != DBT_Window_Control then
		PriorLine ()
	EndIf	
	let iUnicode = StringContains (GetLine (), scUnicode)
	if iUnicode == 0 then
		RestoreCursor ()
		return ""
	else
		let sUnicodeValue = SubString(GetLine(), iUnicode+StringLength (scUnicode), 4)
		RestoreCursor ()
		return sUnicodeValue
	EndIf

EndFunction

string Function GetColumnNum ()

var
	int iCol,
	string sColMod

	SaveCursor ()
	InvisibleCursor ()
	RouteInvisibleToPc ()
	JawsPageDown ()
	JawsHome ()
	if GetControlID (GetCurrentWindow ()) != DBT_Window_Control then
		PriorLine ()
	EndIf	
	let iCol = StringContains (GetLine (), scCol)
	if iCol == 0 then
		RestoreCursor ()
		return -1
	else
		let sColMod = SubString (GetLine (), iCol + StringLength (scCol), 3)
		RestoreCursor () ;SayInteger (iColMod)
		return sColMod
	EndIf

EndFunction


Int Function GetLineNum ()

var
	int iLine,
	int iLineMod,
	int iScLineLength = StringLength (scLine),
	int iCol

	SaveCursor ()
	InvisibleCursor ()
	RouteInvisibleToPc ()
	JawsPageDown ()
	JawsHome ()
	if GetControlID (GetCurrentWindow ()) != DBT_Window_Control then
		PriorLine ()
	EndIf	
	let iLine = StringContains (GetLine (), scLine)
	if iLine == 0 then
		RestoreCursor ()
		return -1
	else
		let iCol = StringContains(GetLine (), scCol)
		let iLineMod = StringToInt (SubString (GetLine (), iLine + iScLineLength, iCol-iLine-iScLineLength))
		RestoreCursor ()
		return iLineMod
	EndIf

EndFunction


String Function GetPageNum ()

var
	int iPage,
	int iScPageLength = StringLength (scPage),
	int iLine,
	string sPageMod

	if not IsDocumentWindow (GetCurrentWindow ()) then
		return ""
	endIf
	SaveCursor ()
	InvisibleCursor ()
	RouteInvisibleToPc ()
	SetRestriction (RestrictRealWindow)
	JawsPageDown ()
	if GetControlID (GetCurrentWindow ()) != DBT_Window_Control then
		PriorLine ()
	EndIf
	JawsHome ()
	let iPage = StringContains (GetLine (), scPage)
	if iPage == 0 then
		RestoreCursor ()
		return -1
	else
		let iLine = StringContains (GetLine (), scLine)
		let sPageMod = SubString (GetLine (), iPage+iScPageLength, iLine-iPage-iScPageLength)
		RestoreCursor ()
		return sPageMod
	EndIf

EndFunction


String Function GetStyleName ()

var
	int iLabel,
	string sStyle,
	int i

	if not IsDocumentWindow (GetCurrentWindow ()) then
		return
	endIf
	SaveCursor ()
	RouteInvisibleToPc ()
	InvisibleCursor ()
	SetRestriction (RestrictRealWindow)
	JawsPageDown ()
	if GetControlID (GetCurrentWindow ()) != DBT_Window_Control then
		PriorLine ()
	EndIf	
;while GetWindowClass(GetCurrentWindow ()) != wcDBTWindow
;	PriorLine ()
;EndWhile	
	JawsHome ()
	let iLabel = StringContains (GetLine (), scCurrentStyle)
	if iLabel == 0 then
		let iLabel = StringContains (GetLine (), scRow)
	endIf
	if iLabel == 0 then
		RestoreCursor ()
		return msgSilent
	else
		if iLabel == 1 then
			let InTable = 0
			let sStyle = StringChopLeft (GetChunk (), stringLength (scCurrentStyle))
		else
			let InTable = 1
			let sStyle = StringLeft (GetLine (), iLabel-1)
			let i = 0
			JAWSHome ()
			while i < iLabel
				NextCharacter ()
				let i = i+1
			endWhile
			NextWord ()
			let sRowWord = GetWord ()
			NextWord ()
			NextWord()
			let sColWord = GetWord ()
			let sRowNum = StringSegment (sRowWord, "/", 1)
			let sColNum = StringSegment (sColWord, "/", 1)
		endIf
;	RestoreCursor ()
		return sStyle
	endIf

EndFunction


Script AltF3Press ()

	if not StringContains (GetWindowName (GetRealWindow (GetCurrentWindow ())), scDocument) then
		SayUsingVoice (VCTX_MESSAGE, msgNotInDocument, OT_USER_REQUESTED_INFO_X)
		return
	endIf
; to avoid giving incorrect message because of a timing lag,
; look at status line before sending Alt+F3 to the application
;SayInteger (GetLineNum ()) ;5/21/2013
	if GetLineNum() != -1 then
		SayMessage (OT_STATUS, msgCodesOn_l, msgCodesOn_s)
	else
		SayMessage (OT_STATUS, msgCodesOff_l, msgCodesOff_s)
	endIf
	TypeCurrentScriptKey ()

EndScript


Script F2Press ()

var
	string sLine,
	int nKeysPos

	if not IsDocumentWindow (GetCurrentWindow ()) then
; previously just said "not in document window" with no change of setting,
; but now we change setting even though script can't announce it properly
		TypeCurrentScriptKey ()
		return
	endIf
	TypeCurrentScriptKey ()
	PauseForMovement ()
	SaveCursor ()
	InvisibleCursor ()
	RouteInvisibleToPc ()
	JawsPageDown ()
	if GetControlID (GetCurrentWindow ()) != DBT_Window_Control then
		PriorLine ()
	EndIf	
	let sLine = GetLine ()
	let nKeysPos = StringContains (sLine, scKeys)
	if SubString (sLine, nKeysPos+5, 1) == "6" then
		SayMessage (OT_STATUS, msgPerkinsOn, msgPerkinsOn) 
	else
		SayMessage (OT_STATUS, msgPerkinsOff, msgPerkinsOff)
	endIf
	RestoreCursor ()

EndScript


Script ControlF8Press ()

var
	handle hndTransLine,
	int nTransLineCheck,
	int NoBackTrans

	if not StringContains (GetWindowName (GetRealWindow (GetCurrentWindow ())), scDocument) then
		SayUsingVoice (VCTX_MESSAGE, msgNotInDocument, OT_USER_REQUESTED_INFO_X)
		return
	endIf
	let NoBackTrans = 0
	TypeCurrentScriptKey ()
	PauseForMovement ()
	let nTransLineCheck = CheckTransLine ()
	if nTransLineCheck == 1 then
		SayMessage (OT_STATUS, msgTransLineOn, msgTransLineOn)
	elif nTransLineCheck == 0 then
		SayMessage (OT_STATUS, msgTransLineOff, msgTransLineOff)
	elif nTransLineCheck == -1 then
		SayMessage (OT_SCREEN_MESSAGE, msgTransTableError, msgTransTableError)
		endIf

endScript


Void Function SayHighlightedText (handle hwnd, string buffer)

;var
;	string sWindowName

	let sWindowName = GetWindowName (GetRealWindow (GetCurrentWindow ()))
	if sWindowName == wnSpellCheck then
	SayMessage (OT_USER_REQUESTED_INFO_X, buffer)
	SayMessage (OT_STATUS, msgSpelled, msgSilent)
	SpellString (buffer)
	if GetObjectTypeCode () == WT_BUTTON then
;		RouteInvisibleToPC ()
		ReadContextLine ()
;		PCCursor ()
	endIf
elIf sWindowName == wnConfirmReplacement then
	if GetObjectTypeCode () == WT_BUTTON then
;		RouteInvisibleToPC ()
		ReadContextLine ()
;		PCCursor ()
	endIf
Else SayHighlightedText (hwnd, buffer)
endIf

EndFunction


Script SayLine ()

var
	int nTimesPressed

	let nTimesPressed = IsSameScript ()
	if nTimesPressed > 0 then
;		let MotionFlag=1
		PerformScript SayLine()
		return
	endIf
	if MenusActive ()
	|| GetWindowClass (GetCurrentWindow ()) != wcDBTWindow
	|| Not IsPcCursor () then
		PerformScript SayLine ()
		return
	endIf
	GetNewValues ()
	SpeakLineOfText ()

EndScript


Void Function SayLineUnit (int UnitMovement)

	if IsDocumentWindow(GetCurrentWindow ())
	&& IsPCCursor () then
		let iSuppressMulti = 1
		SpeakLineOfText ()
		let MotionFlag = 1
		let SaySkipFlag = 1
;let nStartCol = GetCursorCol ()
;let nStartRow = GetCursorRow ()
		let iSuppressMulti = 0
	else SayLineUnit (UnitMovement)
	endIf

EndFunction


Script SayNextLine ()

	if not IsDocumentWindow (GetCurrentWindow ()) then
;	|| not IsPCCursor () then
		PerformScript SayNextLine ()
		return
	endIf
	if nHighlight then
		PerformScript SelectNextLine()
		return
	endIf
	SaveOldValues ()
	let SaySkipFlag = 1
	NextLine ()
	PauseForMovement ()
	GetNewValues ()
	SpeakLineOfText ()

EndScript


Script BrailleNextLine ()

	if GetJCFOption (OPT_BRL_MOVE_ACTIVE_CURSOR) == 1 then
		SaveOldValues ()
		let SaySkipFlag = 1
		NextLine ()
		PauseForMovement ()
		GetNewValues ()
	else PerformScript BrailleNextLine()
	endIf

EndScript

Script SayPriorLine ()	

	if MenusActive () then
		PriorLine ()
		return
	endIf
	if not IsDocumentWindow (GetCurrentWindow ()) then
;	|| Not IsPcCursor () then
		PauseForMovement ()
		PerformScript SayPriorLine ()
		return
	endIf
	if nHighlight then
		PerformScript SelectPriorLine()
		return
	endIf
	SaveOldValues ()
	let SaySkipFlag = 1
	PriorLine ()
	PauseForMovement ()
	GetNewValues ()
	SpeakLineOfText ()

EndScript


Script BraillePriorLine ()

	if GetJCFOption (OPT_BRL_MOVE_ACTIVE_CURSOR) == 1 then
		SaveOldValues ()
		let SaySkipFlag = 1
		PriorLine ()
		PauseForMovement ()
		GetNewValues ()
	else PerformScript BraillePriorLine ()
	endIf

EndScript


Script BottomOfFile ()

	if MenusActive ()
	|| GetWindowClass (GetCurrentWindow ()) != wcDBTWindow
	|| Not IsPcCursor () then
		PerformScript BottomOfFile ()
		return
	endIf
	PerformScript ChangeLine()

EndScript


Script TopOfFile ()

	if MenusActive ()
	|| GetWindowClass (GetCurrentWindow ()) != wcDBTWindow
	|| Not IsPcCursor () then
		PerformScript TopOfFile ()
		return
	endIf
	PerformScript ChangeLine()

EndScript


Script JAWSPageDown ()

	if MenusActive ()
	|| GetWindowClass (GetCurrentWindow ()) != wcDBTWindow
	|| Not IsPcCursor () then
		PerformScript JAWSPageDown ()
		return
	endIf
	PerformScript ChangeLine()

EndScript


Script JAWSPageUp ()

	if MenusActive ()
	|| GetWindowClass (GetCurrentWindow ()) != wcDBTWindow
	|| Not IsPcCursor () then
		PerformScript JawsPageUp ()
		return
	endIf
	PerformScript ChangeLine()

EndScript


Script ChangeLine ()

	if MenusActive ()
	|| GetWindowClass (GetCurrentWindow ()) != wcDBTWindow
	|| Not IsPcCursor () then
		TypeCurrentScriptKey ()
		PauseForMovement ()
		SayLine ()
		return
	endIf
	SaveOldValues ()
	TypeCurrentScriptKey ()
	PauseForMovement ()
	GetNewValues ()
	SpeakLineOfText ()

EndScript


Void Function SpeakLineOfText ()

	if StringIsBlank (GetLine ())
	&& IsDocumentWindow (GetCurrentWindow ()) then
		SayUsingVoice (VCTX_MESSAGE, msgBlank, OT_TEXT)
		return
	endIf
	if not nBrailleDoc /*|| DoNotForceTransLine*/ then
		SayLine ()
	elif DoNotForceTransLine==1 then
		if BrailleInUse () then
			BrailleLine ()
		endIf
	SpeakLineAsBrailleCells (GetLine ())
	elif DoNotForceTransLine==0 then
		let nCatchingUp = 1
		PerformScript SpeakTransLine ()
		while nCatchingUp
		&& not IsKeyWaiting ()
		let nCatchingUp = nCatchingUp-1
			PerformScript SpeakTransLine()
		endWhile
	endIf

EndFunction

Int Function DecipherItemOfText ()

var
	string CharacterCheck,
	String StringCheck,
	string FontCheck,
	string sStyleName,
	string nVersion

	if GetCursorCol () == nStartCol
	&& GetCursorRow () == nStartRow
;	&& not iSuppressSameSpot
	&& GetPageNum () != -1
		PlaySound (FindJAWSSoundFile ("tonguethump.wav"))
		return 1
	endIf
	if GetPageNum () != -1 then
		return 1
	endIf
	if GetCharacter () == "[" then
		NextCharacterSelectIfOn ()
		Pause ()
		let CharacterCheck = GetPriorCharacter ()
			PriorCharacterSelectIfOn ()
			Pause ()
			if CharacterCheck != "[" then
				SayMessage (OT_TEXT, msgCode, msgCode)
				SpellString (StringChopLeft (StringSegment (GetToEndOfLine (), "]", 1), 1))
				return 0
			endIf
	elIf StringIsBlank (GetFont ())
		&& StringContains (GetToEndOfLine (), "[") == 1 then
		SayMessage (OT_TEXT, msgCode, msgCode)
		SpellString (StringChopLeft (StringSegment (GetToEndOfLine (), "]", 1), 1))
		return 0
	elif GetCharacter () == "<" then
		NextCharacterSelectIfOn ()
		Pause ()
		let CharacterCheck = GetPriorCharacter ()
		PriorCharacterSelectIfOn ()
		Pause ()
		if CharacterCheck != "<" then
			let sStyleName = (StringChopLeft (StringSegment (GetToEndOfLine (), ">", 1), 1))
			if StringLeft (sStyleName, 1) == "/" then
				SayUsingVoice (VCTX_PCCURSOR, msgEndStyle+" "+(StringChopLeft (sStyleName, 1)), OT_TEXT)
			else
				SayUsingVoice (VCTX_PCCURSOR, msgBeginStyle+" "+sStyleName, OT_TEXT)
			endIf
			return 0
		else return 1 
		endIf
	/* section below is for a code or style code at the start of a line
	following a code or style code at the end of the previous line */
	elif GetColorBackground () == 0
	&& StringIsBlank (GetFont ())
	&& not nHighlight
	&& GetLineNum () == -1 then
		if StringLength (GetToEndOfLine ()) == 0 then
			SaveCursor ()
			RouteInvisibleToPc ()
			NextLine ()
			JawsHome ()
			let CharacterCheck = GetCharacter ()
			let StringCheck = GetToEndOfLine ()
			PcCursor ()
			RestoreCursor ()
		Pause ()
		else let StringCheck = GetToEndOfLine ()
			let CharacterCheck = SubString (StringCheck, 1, 1)
		endIf
		if CharacterCheck == "<" then
			SayMessage (OT_TEXT, msgStyle, msgStyle)
			SayString (StringChopLeft (StringSegment (StringCheck, ">", 1), 1))
		elif CharacterCheck == "[" then
			SayMessage (OT_TEXT, msgCode, msgCode)
			SpellString (StringChopLeft (StringSegment (StringCheck, "]", 1), 1))
		else SayMessage (OT_TEXT, msgSpace, msgSpace)
		endIf
		return 0
	endIf
;Below speak verbose labels for DBT versions before 11.2.
	if GetCharacter () == "{" then
		let nVersion = GetVersionInfoString (GetAppFilePath (), "ProductVersion")
		if StringStartsWith (nVersion, "11.1")
		|| StringStartsWith (nVersion, "10") then
			NextCharacterSelectIfOn ()
			Pause ()
			let CharacterCheck = GetPriorCharacter ()
			PriorCharacterSelectIfOn ()
			Pause ()
			if CharacterCheck != "{" then
				SayString (StringChopLeft (StringSegment (GetToEndOfLine (), "}", 1), 1))
				return 0
			else return 1
			endIf
		else SayTheCharacter ()
		endIf
		return 0
	endIf
	return 1

endFunction


Void Function NextCharacterSelectIfOn ()

	if nSelectingText
	&& !nHighlight then
		/*DBT*/SpeechOff ()
		SelectNextCharacter ()
		/*DBT*/SpeechOn ()
	else NextCharacter ()
	endIf

EndFunction


Void Function PriorCharacterSelectIfOn ()

	if nSelectingText
	&& !nHighlight then
		/*DBT*/SpeechOff ()
		SelectPriorCharacter ()
		/*DBT*/SpeechOn ()
	else PriorCharacter ()
	endIf

EndFunction


Void Function NextWordSelectIfOn ()

	if nSelectingText
	&& !nHighlight then
		/*DBT*/SpeechOff ()
		SelectNextWord ()
		/*DBT*/SpeechOn ()
	else NextWord ()
	endIf

EndFunction


Void Function PriorWordSelectIfOn ()

	if nSelectingText
	&& !nHighlight then
		/*DBT*/SpeechOff ()
		SelectPriorWord ()
		/*DBT*/SpeechOn ()
	else PriorWord ()
	endIf

EndFunction

Script SayWord ()

var
	int nTimesPressed,
	int nL,
	string sString1,
	string sString2

	let nTimesPressed = IsSameScript ()
	if nTimesPressed > 0
	&& not iSuppressMulti then
		PerformScript SayWord()
		return
	endIf
	let iSuppressMulti = 0
	if not IsDocumentWindow (GetCurrentWindow ())
	|| Not IsPcCursor () then
		PerformScript SayWord()
		return
	endIf
	if DecipherItemOfText () == 0 then
		return
	endIf
	if nBrailleDoc then
		SpeakWordAsBrailleCells (GetToEndOfLine ())
	else
		let sString1 = GetToEndOfLine ()
		NextWordSelectIfOn ()
		let sString2 = GetToEndOfLine ()
		PriorWordSelectIfOn ()
		let nL = StringContains (sString1, sString2)
		if nL > 0 then
			SayUsingVoice (VCTX_PCCURSOR, Substring (GetToEndOfLine (), 1, nL-1), OT_WORD)
		else SayUsingVoice (VCTX_PCCURSOR, sString1, OT_WORD)
		endIf
	endIf

EndScript


Void Function SayWordUnit (int UnitMovement)

	if IsDocumentWindow(GetCurrentWindow ())
	&& IsPCCursor () then
		let iSuppressMulti = 1
		PerformScript SayWord ()
		let MotionFlag = 1
		let SaySkipFlag = 1
;let nStartCol = GetCursorCol ()
;let nStartRow = GetCursorRow ()
		let iSuppressMulti = 0
	else SayWordUnit (UnitMovement)
	endIf


EndFunction


Script SayNextWord ()

	if MenusActive () then
		NextWord ()
		return
	endIf
	if not IsDocumentWindow (GetCurrentWindow ())
	|| Not IsPcCursor () then
		PauseForMovement ()
		PerformScript SayNextWord ()
		return
	endIf
	if nHighlight then
		PerformScript SelectNextWord ()
		return
	endIf
	let nStartCol = GetCursorCol ()
	let nStartRow = GetCursorRow ()
	SaveOldValues ()
	let SaySkipFlag = 1
	NextWord ()
		PauseForMovement ()
	GetNewValues ()
	if DecipherItemOfText () == 0 then
		return
	endIf
	let iSuppressMulti = 1
	PerformScript SayWord()

EndScript


Script SayPriorWord ()

	if MenusActive () then
		PriorWord ()
		return
	endIf
	if not IsDocumentWindow (GetCurrentWindow ())
	|| Not IsPcCursor () then
		PauseForMovement ()
		PerformScript SayPriorWord ()
		return
	endIf
	if nHighlight then
		PerformScript SelectPriorWord()
		return
	endIf
	let nStartCol = GetCursorCol ()
	let nStartRow = GetCursorRow ()
	SaveOldValues ()
	let SaySkipFlag = 1
	PriorWord ()
	PauseForMovement ()
	GetNewValues ()
	if DecipherItemOfText () == 0 then
		return
	endIf
	let iSuppressMulti = 1
	PerformScript SayWord()

EndScript


Script SayCharacter ()

var
	int nTimesPressed

	let nTimesPressed = IsSameScript ()
	if nTimesPressed > 0
	&& not iSuppressMulti then
		let MotionFlag=1
		PerformScript SayCharacter()
		return
	endIf
	if MenusActive () then
		SayCharacter ()
		return/*PerformScript AcceptLocator ()*/
	endIf
	If IsJawsCursor ()
	&& GetWindowClass (GetCurrentWindow ()) == wcDBTWindow then
		if Not IsPointInWindow (GetFirstWindow (GetCurrentWindow ()), GetCursorCol (), GetCursorRow ()) then
			SayBrailleChar (VCTX_PCCURSOR, GetCharacter ())
			return
		EndIf
	EndIf
	if GetWindowClass (GetCurrentWindow ()) != wcDBTWindow
	|| Not IsPcCursor () then
		PerformScript SayCharacter ()
		return
	endIf
	if DecipherItemOfText () == 0 then
		return
	endIf
	SayTheCharacter ()

EndScript


Void Function SayCharacterUnit (int UnitMovement)

	if IsDocumentWindow(GetCurrentWindow ()) then
		let iSuppressMulti = 1
		PerformScript SayCharacter ()
		let MotionFlag = 1
		let nStartCol = GetCursorCol ()
		let nStartRow = GetCursorRow ()
		let iSuppressMulti = 0
	else SayCharacterUnit (UnitMovement)
	endIf



EndFunction


Void Function SayTheCharacter ()

var
	int i1,
	int i2

	if (GetCharacter () == " ")
	&& StringLength (GetToEndOfLine ()) == 0 then
; distinguish between space within group of trailing spaces vs. a space really at the end of the line
		SaveCursor ()
		RouteInvisibleToPC ()
		InvisibleCursor ()
		let i1 = GetCursorCol ()
			JAWSEnd ()
		let i2 = GetCursorCol ()
		if i1 == i2 /*&& GetLineNum () != -1*/ then
			SayMessage (OT_TEXT, msgSpaceAtEndOfLine, msgSpaceAtEndOfLine)
		else SayMessage (OT_TEXT, msgSpace, msgSpace)
		endIf
		PCCursor ()
		RestoreCursor ()
		return
	endIf
	if (GetCharacter () == " "
	|| GetUnicodeValue () == "0020") then
		SayMessage (OT_TEXT, msgSpace, msgSpace)
		return
	endIf
	if not StringIsBlank (GetUnicodeValue ()) then
		SpellString (MakeCharacterFromValue (HexToDec (GetUnicodeValue ())))
		return
	endIf
	if not nBrailleEdit then
		SayCharacter ()
	elif StringIsBlank (GetFont ()) then
		SayMessage (OT_TEXT, msgBlank, msgBlank)
	else SayBrailleChar (VCTX_PCCURSOR, GetCharacter ())
	endIf
		RouteInvisibleToPC ()
		InvisibleCursor ()
		let i1 = GetCursorCol ()
			JAWSEnd ()
		let i2 = GetCursorCol ()
; disabled lines below to avoid hearing message when backspacing
;		if i1 == i2 && GetLineNum () != -1 then
;			SayMessage (OT_TEXT, msgEndOfLine, msgEndOfLine)
;		endIf
		PCCursor ()
		RestoreCursor ()

EndFunction


Script SayNextCharacter ()

	if MenusActive () then
		PerformScript SayNextCharacter ()
		return
	endIf
	If IsJawsCursor ()
	&& GetCurrentWindow () == GetNextWindow (GetNextWindow (GetFocus ())) then
		SayNextCharacterTranslatedLine ()
		return
	endIf
	if not IsDocumentWindow (GetCurrentWindow ())
	&& not (GetWindowClass (GetCurrentWindow ()) == wcDBTCodesEdit)
	|| Not IsPcCursor () then
		PauseForMovement ()
		PerformScript SayNextCharacter ()
		return
	endIf
	if nHighlight then
		PerformScript SelectNextCharacter()
		return
	endIf
	let nStartCol = GetCursorCol ()
	let nStartRow = GetCursorRow ()
	SaveOldValues ()
	let SaySkipFlag = 1
	NextCharacter ()
	GetNewValues ()
	if DecipherItemOfText () == 0 then
		return
	endIf
	SayTheCharacter ()

EndScript


Script SayPriorCharacter ()

	if MenusActive () then
		PerformScript SayPriorCharacter ()
		return
	endIf
	If IsJawsCursor ()
	&& GetCurrentWindow () == GetNextWindow (GetNextWindow (GetFocus ())) then
		SayPriorCharacterTranslatedLine ()
		return
	endIf
	if not IsDocumentWindow (GetCurrentWindow ())
	&& not (GetWindowClass (GetCurrentWindow ()) == wcDBTCodesEdit)
	|| Not IsPcCursor () then
		PauseForMovement ()
		PerformScript SayPriorCharacter ()
		return
	endIf
	if nHighlight then
		PerformScript SelectPriorCharacter()
		return
	endIf
	let nStartCol = GetCursorCol ()
	let nStartRow = GetCursorRow ()
	SaveOldValues ()
	let SaySkipFlag = 1
	if nSelectingText == TRUE then
		return
	endIf
	PriorCharacter ()
	GetNewValues ()
	if DecipherItemOfText () == 0 then
		return
	endIf
	SayTheCharacter ()

EndScript


Void Function SayNextCharacterTranslatedLine ()

	NextCharacter ()
	if IsBrailleDocumentWindow (GetCurrentWindow ()) then
		SayCharacter ()
	else
SayBrailleChar (VCTX_JAWSCURSOR, GetCharacter ())
	EndIf
	if StringLength (GetToEndOfLine ()) == 1 then
		SayMessage (OT_STATUS, msgEndLine, msgEndLine)
	endIf

EndFunction 	


Void Function SayPriorCharacterTranslatedLine ()

		PriorCharacter ()
	if IsBrailleDocumentWindow (GetCurrentWindow ()) then
		SayCharacter ()
	else
SayBrailleChar (VCTX_JAWSCURSOR, GetCharacter ())
	EndIf
	if StringLength (GetFromStartOfLine ()) == 0 then
		SayMessage (OT_STATUS, msgStartLine, msgStartLine)
	endIf

EndFunction


Script SayDocName ()

;HandleCustomWindows (GetCurrentWindow ())
	if not StringContains (GetWindowName (GetRealWindow (GetCurrentWindow())), scDocument) then
		SayUsingVoice (VCTX_MESSAGE, msgNotInDocument, OT_USER_REQUESTED_INFO_X)
	else
		Say (GetWindowName (GetRealWindow (GetCurrentWindow ())), OT_USER_REQUESTED_INFO_X)
	endIf

EndScript


Int Function CheckTransLine ()

var
	handle hndDocument,
	handle hndTransLine,
	int nTransLineShowing

	let nTransLineShowing = 0
	let hndDocument = GetCurrentWindow ()
	SaveCursor ()
	InvisibleCursor ()
	let hndTransLine = GetNextWindow (GetNextWindow (hndDocument))
	MoveToWindow (hndTransLine)
	if StringLength(GetWindowText (GetCurrentWindow (), 0)) <= StringLength(GetLine ()) +4 then
		if GetLine () == scErrorMessage0 then
			let nTransLineShowing = -1
			else let nTranslineShowing = 1
	endIf
	else let nTransLineShowing = 0
;		Say ("window: "+IntToString(StringLength(GetWindowText (GetCurrentWindow (), 0)))+"; line: "+IntToString(StringLength (GetLine ())), OT_POSITION, FALSE) 
	endIf
	return nTransLineShowing

EndFunction


Script SpeakTransLine ()

var
	handle hndTransLine,
	string CurLine,
	int NOBackTrans,
	int VoiceRate,
	int xPos,
	int DelayCounter,
	int BrailleModeSave,
	int nTransLineCheck,
	int nPanTime,
	string sTransLine,
	string buffer

	if GetCurrentScriptKeyName () == ksSpeakTransLine then
		if not StringContains (GetWindowName (GetRealWindow (GetCurrentWindow ())), scDocument) then
			SayUsingVoice (VCTX_MESSAGE, msgNotInDocument, OT_USER_REQUESTED_INFO_X)
			return
	endIf
;	let NoBackTrans = 0
	endIf
	if not CheckTransLine () then
		PauseForMovement ()
		if not CheckTransLine () then
			TypeKey ("Control+F8")
			SayMessage (OT_STATUS, msgTransLineOn, msgTransLineOn)
			PauseForMovement () 
		endIf
	endIf
	let hndTransLine = GetNextWindow (GetNextWindow (GetCurrentWindow ()))
	let sTransLine = GetWindowText (hndTransLine, 0)
	if nBrailleEdit then
		if not IsDocumentWindow (GetCurrentWindow ())
		&& not IsKeyWaiting () then
;			SayUsingVoice (VCTX_MESSAGE, msgCatchingUp, OT_STATUS)
			let nCatchingUp = 2
			return
		elif nCatchingUp == 1 then
			return
		endIf
/*		If StringContains (sTransLine, scErrorMessage0) then
			let NOBackTrans = 1
			let DoNotForceTransLine = 1
			SayMessage (OT_SCREEN_MESSAGE, msgTransTableError, msgTransTableError)
			SayMessage (OT_JAWS_MESSSAGE, msgReadBrailleLinesAsBrailleChars, msgReadBrailleLinesAsBrailleChars)
			return
		endIf*/
		if not nCatchingUp then
		SayString (sTransline)
		endIf
		return
	endIf
	SaveCursor ()
	InvisibleCursor ()
	MoveToWindow (hndTransLine)
	SpeakStringAsBrailleCells (VCTX_JAWSCURSOR, sTransLine)
	RestoreCursor ()
	PcCursor ()
	return

EndScript

Void Function SpeakWordAsBrailleCells (string sBrailleText)

var
	int i,
	string sNextWord

	let i = 1
	NextWordSelectIfOn ()
	let sNextWord = GetToEndOfLine ()
	PriorWordSelectIfOn ()
	while (i <= StringLength (sBrailleText))
		if SubString (sBrailleText, i, 1) == " " || StringChopLeft (sBrailleText, i-1) == sNextWord then
			return
		endIf
		SayBrailleChar (VCTX_PCCURSOR, SubString (sBrailleText, i, 1))
		let i = i+1
		Delay (3)
	endWhile

EndFunction


Void Function SpeakLineAsBrailleCells (string  sBrailleLine)

var
	int i

	if StringIsBlank (GetLine ()) then
		SayMessage (OT_TEXT, msgBlank)
		return
	endIf
	if GetLineNum () != -1 then
		SpeakStringAsBrailleCells (VCTX_PCCURSOR, GetLine ())
;		SpeakStringAsBrailleCells (VCTX_PCCURSOR, StringTrimLeadingBlanks (GetLine ())
		return
	endIf
	JAWSHome ()
	PerformScript SayWord ()
	NextWord ()
	while StringLength (StringTrimLeadingBlanks (GetFromStartOfLine ())) > 0 && not IsKeyWaiting ()
		PerformScript SayWord ()
		NextWord ()
		Delay (2)
	endWhile
	PriorCharacter ()
	PriorCharacter ()
	JAWSHome ()

EndFunction


Void Function SpeakStringAsBrailleCells (string VCTX, string sBrailleText)

var
	int i,
	int j,
	int iStringLength

	let i = 1
	let iStringLength = StringLength (sBrailleText)
	while i <= iStringLength
	&& not IsKeyWaiting ()
		if Substring (sBrailleText, i, 1) == " "
		&& Substring (sBrailleText, i+1, 1) == " " then
			let j = StringLength (StringChopLeft (sBrailleText, i)) - StringLength (StringTrimLeadingBlanks (StringChopLeft (sBrailleText, i)))+1
			Say (IntToString (j)+"spaces", FALSE)
			let i = i+j
		else
			SayBrailleChar (VCTX, Substring(sBrailleText, i, 1))
			Delay (3)
			let i = i+1
		endIf
	endWhile

EndFunction

Script TransLineCursorToggle ()

var
	int nTransLineCheck

	if not IsDocumentWindow (GetCurrentWindow ())
	&& not IsDocumentWindowJAWSCursor (GetCurrentWindow ()) then
		SayUsingVoice (VCTX_MESSAGE, msgNotInDocument, OT_USER_REQUESTED_INFO_X)
		return
	endIf
	if IsJawsCursor () then
		PcCursor ()
		SayMessage (OT_STATUS, cmsg9_l, cmsg9_s)
		return
	endIf
	if not CheckTransLine () then
		TypeKey (ksControlF8Press)
		PauseForMovement ()
		if CheckTransLine () then
			SayMessage (OT_STATUS, msgTurningOnTransLine, msgSilent)
		else SayMessage (OT_ERROR, msgTransLineNotFound, msgTransLineNotFound)
			return
		endIf
	endIf
	RouteInvisibleToPc ()
	InvisibleCursor ()
	MoveToWindow (GetNextWindow (GetNextWindow (GetCurrentWindow ())))
	JawsHome ()
	SayMessage (OT_STATUS, msgJawsCursorOnTransLine, msgJawsCursorOnTransLine)

EndScript


Script ReadLineInBrailleDocToggle ()

	if DoNotForceTransLine == 1 then
		SayMessage (OT_STATUS, msgReadBackTrans, msgReadBackTrans)
		let DoNotForceTransLine = 0
	elif DoNotForceTransLine == 2 then
		SayMessage (OT_STATUS, msgReadBrailleLinesAsBrailleChars, msgReadBrailleLinesAsBrailleChars)
		let DoNotForceTransLine = 1
	elif DoNotForceTransLine == 0 then
		SayMessage (OT_STATUS, msgSilentBrailleLines, msgSilentBrailleLines)
		let DoNotForceTransLine = 2
	endIf

EndScript


Script ReadStyleChangeToggle ()

var
	int nTimesPressed

; if not in a document window, just pass keystroke through to the application
; there was a conflict for Alt+I in the help system
;	toggles through settings for reading style change and skipped lines
	if not IsDocumentWindow (GetCurrentWindow ()) then
		TypeCurrentScriptKey ()
		return
	endIf
	if not SkipVerbosity 
	&& not StyleChangeVerbosity then
		SayMessage (OT_STATUS, msgSpeakStyleChange, msgSpeakStyleChange)
		SayMessage (OT_STATUS, msgSkipsOff, msgSkipsOff)
		let StyleChangeVerbosity = 1
	elif StyleChangeVerbosity
	&& not SkipVerbosity then
		SayMessage (OT_STATUS, msgSpeakStyleChange, msgSpeakStyleChange)
		SayMessage (OT_STATUS, msgSpeakSkips, msgSpeakSkips)
		let SkipVerbosity = 1
	elif StyleChangeVerbosity
	&& SkipVerbosity then
		SayMessage (OT_STATUS, msgStyleChangeOff, msgStyleChangeOff)
		SayMessage (OT_STATUS, msgSpeakSkips, msgSpeakSkips)
		let StyleChangeVerbosity = 0
elif not StyleChangeVerbosity
	&& SkipVerbosity then
		SayMessage (OT_STATUS, msgStyleChangeOff, msgStyleChangeOff)
		SayMessage (OT_STATUS, msgSkipsOff, msgSkipsOff)
		let SkipVerbosity = 0
	endIf

EndScript


Script EchoBrailleCharsToggle ()

; if not in a document window, just pass keystroke through to the application
; there was a conflict for Alt+P for Printer Properties
	if not IsDocumentWindow (GetCurrentWindow ()) then
		TypeCurrentScriptKey ()
	elif DoNotEchoBrailleChars==1 then
		Say (msgEchoBrailleCharsOn, OT_STATUS)
		let DoNotEchoBrailleChars= 0
		if nBrailleDoc then
			let nTypingEchoSaved = GetJCFOption(OPT_TYPING_ECHO)
			SetJcfOption(OPT_TYPING_ECHO,0) ; echo off
		endIf
	else
		Say (msgEchoBrailleCharsOff, OT_STATUS)
		let DoNotEchoBrailleChars = 1
		if nBrailleDoc then
			SetJcfOption(OPT_TYPING_ECHO,nTypingEchoSaved) ; restoring saved echo setting
		endIf
	endIf

EndScript


Script SayStyleName ()

var
	string sStyleName,
	int nTimesPressed

	let nTimesPressed = IsSameScript ()
	if nTimesPressed > 0
	&& InTable then
		SayUsingVoice (VCTX_MESSAGE, msgRow+sRowNum+" "+msgCol+sColNum, OT_USER_REQUESTED_INFO_X)
		return
	endIf
	let sStyleName = GetStyleName ()
	if sStyleName == "" then
		SayUsingVoice (VCTX_MESSAGE, msgNotInDocument, OT_USER_REQUESTED_INFO_X)
	else
		SayUsingVoice (VCTX_MESSAGE, sStyleName, OT_USER_REQUESTED_INFO_X)
		if BrailleInUse ()
		&& nJFWVersion < 600000 then
			let BrailleModeSave = GetBrailleMode ()
			SetBrailleMode (BRL_MODE_SPEECHBOX)
			let nBrailleTime=0
			while Not (IsKeyWaiting ())
			&& nBrailleTime <= cBrailleMessageTime
				Delay (1)
				let nBrailleTime = nBrailleTime+1
			endWhile
			SetBrailleMode (BrailleModeSave)
		endIf
		RestoreCursor ()
	endIf

EndScript


Script SayLocation ()

var
;	string sWindowName,
	string sLocation,
	string sPage,
	string sLine,
	string sColumn,
	int iPagePos

	let sWindowName = GetWindowName (GetRealWindow (GetCurrentWindow ())) 
	if not IsDocumentWindow (GetCurrentWindow ()) then
		SayUsingVoice (VCTX_MESSAGE, msgNotInDocument, OT_USER_REQUESTED_INFO_X)
		return
	endIf
	if GetPageNum () == -1 then
		SayMessage (OT_STATUS, msgNoLocation_l, msgNoLocation_s)
		return
	endIf
	let sLine = IntToString (GetLineNum ())
	let sPage = GetPageNum ()
	let sColumn = GetColumnNum ()
	let sLocation = msgPageId+StringTrimTrailingBlanks(sPage)+" "+msgLineId+sLine+" "+msgColId+sColumn
	Say (sLocation, OT_USER_REQUESTED_INFO_X)
		if BrailleInUse () && nJFWVersion < 600000 then
		let BrailleModeSave = GetBrailleMode ()
		SetBrailleMode (BRL_MODE_SPEECHBOX)
		let nBrailleTime=0
		while Not (IsKeyWaiting ())
		&& nBrailleTime <= cBrailleMessageTime
			Delay (1)
			let nBrailleTime = nBrailleTime+1
		endWhile
		SetBrailleMode (BrailleModeSave)
	endIf
	RestoreCursor ()

EndScript
	

Int Function HandleCustomWindows (handle hWnd)

var
;	string sWindowName,
	string buffer,
	int nOldBrailleEdit

	SendMessage (GetAppMainWindow (GetCurrentWindow ()), 0X0112, /*WM_SYSCOMMAND,*/ 0XF030, 0) /* maximize the window*/
	SendMessage (GetFirstChild (GetFirstChild (GetAppMainWindow (GetCurrentWindow ()))), 0X0112, /*WM_SYSCOMMAND,*/ 0XF030, 0) /* maximize the window*/

;	let nHighlightCheck = 1
;	let nHighlight = 0
	if GetWindowClass (hWnd) == wcMDIClient then
		SayMessage (OT_CONTROL_NAME, msgMdiClient)
	endIf
	
	if GetWindowName (GetRealWindow (GetCurrentWindow ())) == wnFileNew then
		let nNewDoc = 1
	endIf
	if nCustomWindow ==0 then
		let nCustomWindow = 1
	endIf
	let nFocusChange = 1
	let MotionFlag = 1
	let sOldWindowName = sWindowName
	let sWindowName = GetWindowName (GetRealWindow (hwnd))
;	for the Spell checker
	if GetWindowTypeCode (hWnd) == WT_BUTTON
	&& GetWindowName (hWnd) == wnOK
	&& sWindowName == wnSpellCheck then
		let SpellCheckWindow = GetParent (GetCurrentWindow ())
		SpeakSpellCheck ()
		if getScriptAssignedTo (GetCurrentScriptKeyName ()) != "SayWindowPromptAndText"
		;if GetCurrentScriptKeyName () != "Insert+Tab"
		; && GetCurrentScriptKeyName () != "JAWSKey+Tab"
		&& nFocusChange != 3 then
			let nFocusChange = 2
		elif nFocusChange == 3 then
			nFocusChange = 1
		endIf
	;for window that terminates replace dialog
	elif GetWindowTypeCode (hWnd) == WT_BUTTON
	&& GetWindowName (GetCurrentWindow ()) == wnOK
	&& GetWindowName (GetParent (hWnd)) == wnDBT 
	&& GetWindowType (GetParent (hWnd)) == "dialog" then
		SaveCursor ()
		RouteInvisibleToPC ()
		MoveToWindow (GetParent (hWnd))
; modified code below to avoid possible infinite loop
		While NextChunk ()
			if GetChunk () != scOK then
				SayChunk ()
			endIf
		endWhile
		RestoreCursor ()
		PCCursor ()
	endIf
	if sWindowName == msgShortcutPreferences then
		StopSpeech ()
	endIf
	if GetWindowClass (GetCurrentWindow ()) == wcDBTWindow
	&& not StringIsBlank (GetStyleName ()) then
		if not nNewDoc then
;			PauseForMovement ()
			let nOldHighlight = nHighlight
			let nHighlightCheck = 1
		else let nHighlight = 0
			let nHighlightCheck = 0
			let nNewDoc = 0
		endIf
	endIf
	let nOldBrailleEdit = nBrailleEdit
	let nBrailleDoc =IsBrailleDocumentWindow (GetCurrentWindow ()) 
	let nBrailleEdit = nBrailleDoc
	|| nOldBrailleEdit
	&& (StringContains (sWindowName, wnFind)
	|| StringContains (sWindowName, wnReplace))
	if nBrailleEdit
	&& (not nOldBrailleEdit
	|| nBrailleStart) then
		let nBrailleStart = 0
		if nJFWVersion >= 1700000 then
			let nContractedInputSaved = GetJCFOption(OPT_BRL_CONTRACTED_INPUT)
			SetJCFOption (OPT_BRL_CONTRACTED_INPUT, 0)
		endIf
		let nG2TranslationSaved = GetJCFOption(OPT_BRL_G2TRANSLATION)
		SetJCFOption (OPT_BRL_G2TRANSLATION, 0)
		let nEightDotSaved = GetJCFOption(OPTBRL_Eight_Dot)
		SetJCFOption (OPTBRL_Eight_Dot, 0)
		if not DoNotEchoBrailleChars then
			let nTypingEchoSaved = GetJCFOption (OPT_TYPING_ECHO)
			SetJCFOption (OPT_TYPING_ECHO, 0)
		endIf
		let MotionFlag = 1
		let nInBrailleWindow = 0
	endIf
	if (nOldBrailleEdit
	|| nBrailleStart)
	&& not nBrailleEdit then
		SetJCFOption (OPT_BRL_G2TRANSLATION, nG2TranslationSaved)
		SetJCFOption (OPT_BRL_G2EXPAND_CURRENT_WORD, nG2ExpandCurrentWordSaved)
		if nJFWVersion >= 1700000 then
			SetJCFOption (OPT_BRL_CONTRACTED_INPUT, nContractedInputSaved)
		endIf
			SetJCFOption (OPTBRL_Eight_Dot, nEightDotSaved)
		if not DoNotEchoBrailleChars then
			SetJcfOption(OPT_TYPING_ECHO,nTypingEchoSaved) ; restoring  saved echo setting
		endIf
		let nBrailleEdit=0
		let nInBrailleWindow = 0
	endIf
	if nOldBrailleEdit
	&& GetAppFileName () != "dbtw.exe" then
		let nBrailleEdit = 1
		let nInBrailleWindow = 1
	endIf
	;return HandleCustomWindows (hWnd)
	RouteBrailleToPc ()
	;HjDialogs should always use older WindowTypeAndText code,
	;So that on Windows 9X PositionInGroup info never misreports items
	If InHjDialog () then
		SayWindowTypeAndText (hWnd)
		;For input edit boxes:
		If GetWindowSubtypeCode (hWnd) == WT_MULTILINE_EDIT then
			SayWindow (hWnd, TRUE)
		EndIf
		Return TRUE
	EndIf
	Return FALSE

EndFunction


Script JAWSBackspace ()

var
	int iIsTop

	if not IsDocumentWindow (GetCurrentWindow ())
 && not (GetWindowClass (GetCurrentWindow ()) == wcDBTCodesEdit)
	|| IsLastKeyRepeating ()then
		DoBackSpace ()
		return
	endIf
	if not PriorCharacter () then
		let iIsTop = 1
	endIf
	if DecipherItemOfText () == 0 then
		if not IIsTop then
			TypeKey(cksDelete)
		endIf
		return
	endIf
	SayTheCharacter ()
	PauseForMovement ()
	if iIsTop then
		return
	else TypeKey(cksDelete)
	endIf

endScript


Script JAWSDelete ()

	if not IsDocumentWindow (GetCurrentWindow ())
	&& not (GetWindowClass (GetCurrentWindow ()) == wcDBTCodesEdit) then
		PerformScript JAWSDelete ()
		return
	endIf
	let iSuppressSameSpot = 1
	TypeKey (cks4)
	PauseForMovement ()
	if nHighlight then
		PerformScript Highlighting()
	endIf
	if DecipherItemOfText () == 0 then
		return
	endIf
	SayTheCharacter ()
	let iSuppressSameSpot = 0

EndScript



Script CutToClipboard ()

	if not IsDocumentWindow (GetCurrentWindow ())
	&& not (GetWindowClass (GetCurrentWindow ()) == wcDBTCodesEdit) then
		PerformScript CutToClipboard()
		return
	endIf
	PerformScript CutToClipboard ()
	if nHighlight then
		PerformScript Highlighting()
	endIf

EndScript


Script BrailleRouting ()

;	if GetJcfOption (OPT_BRL_MODE) == 2 then
;		SetJcfOption (OPT_BRL_MODE, BrailleModeSave)
;	endIf
	SaveOldValues ()
	PerformScript BrailleRouting()
	if IsDocumentWindow (GetCurrentWindow ()) then
		PauseForMovement ()
		GetNewValues ()
		PerformScript SayCharacter()
	endIf

EndScript


Int Function IsDocumentWindow (handle hwnd)

;var
;	string sWindowName

	let sWindowName = GetWindowName (GetRealWindow (hwnd))
	if StringContains (sWindowName, scPrintDocument)
		|| StringContains (sWindowName, scBrailleDocument)
		&& IsPCCursor ()
	&& GetWindowClass (GetCurrentWindow ()) == wcDBTWindow
		&& not DialogActive () 
	&& not MenusActive () then
		return 1
	else
		return 0
	endIf

EndFunction


Int Function IsDocumentWindowJAWSCursor (handle hwnd)

;var
;	string sWindowName

	let sWindowName = GetWindowName (GetRealWindow (hwnd))
	if StringContains (sWindowName, scDocument)
		&& IsJAWSCursor () then
		return 1
	else
		return 0
	endIf

EndFunction



int Function IsBrailleDocumentWindow (handle hwnd)

;var
;	string sWindowName

	let sWindowName = GetWindowName (GetRealWindow (hwnd))
	if StringContains (sWindowName, scBrailleDocument) then
;		&& IsPCCursor () 	then
		return 1
	else
		return 0
	endIf

EndFunction


Script ChangeCase ()

var
	string buffer

	TypeCurrentScriptKey ()
	PauseForMovement ()
	PauseForMovement ()
	let buffer = GetSelectedText ()
	StopSpeech ()
	if not StringIsBlank (buffer) then
;OT_CHAR is marked for FS internal use, but we want caps indication
		SayFormattedMessage (OT_CHAR, buffer, buffer)
	else
		SpellWord ()
	endIf

EndScript


Void Function SelectNextCharacter ()

	if not IsDocumentWindow (GetCurrentWindow ()) then
		SelectNextCharacter()
		return
	endIf
	let nSelectCharacter = 1
	if GetJFWVersion () >= 1400000 then
		SayCharacterUnit (2)
	endIf
	if nHighlight then
		NextCharacter ()
	else SelectNextCharacter ()
	endIf

EndFunction


Void Function SelectPriorCharacter ()

	if not IsDocumentWindow (GetCurrentWindow ()) then
		SelectPriorCharacter()
		return
	endIf
	let nSelectCharacter = 1
	if nHighlight then
		PriorCharacter ()
	else SelectPriorCharacter ()
	endIf
	if GetJFWVersion () >= 1400000 then
		SayCharacterUnit (3)
	endIf

EndFunction


Void Function SelectNextWord ()

	if not IsDocumentWindow (GetCurrentWindow ()) then
		SelectNextWord()
		return
	endIf
	let nSelectWord = 1
	if GetJFWVersion () >= 1400000 then
		SayWordUnit (32)
	endIf
	SaveOldValues ()
	if nHighlight then
		NextWord ()
	else SelectNextWord ()
	endIf
	PauseForMovement ()
	GetNewValues ()

EndFunction


Void Function SelectPriorWord ()

	if not IsDocumentWindow (GetCurrentWindow ()) then
		SelectPriorWord()
		return
	endIf
	SaveOldValues ()
	let SaySkipFlag = 1
	let nSelectWord = 1
	if nHighlight then
		PriorWord ()
	else SelectPriorWord ()
	endIf
	if GetJFWVersion () >= 1400000 then
		SayWordUnit (33)
	endIf

EndFunction


Void Function SelectNextLine ()

	if not IsDocumentWindow (GetCurrentWindow ()) then
		SelectNextLine()
		return
	endIf
	if GetJFWVersion () >= 1400000 then
		BrailleLine ()
		SayLineUnit (34)
	endIf
	let nSelectLine = 1
	if nHighlight then
		NextLine ()
	else SelectNextLine ()
	endIf

endFunction


Void Function SelectPriorLine ()

	if not IsDocumentWindow (GetCurrentWindow ()) then
		SelectPriorLine()
		return
	endIf
		let nSelectLine = 1
	if nHighlight then
		PriorLine ()
	else SelectPriorLine ()
	endIf
	if GetJFWVersion () >= 1400000 then
		BrailleLine ()
		SayLineUnit (35)
	endIf

EndFunction


Void Function SayTextSelection (string Select, string sText, int bUseOTChar)

	if nSelectCharacter then
		Say(Select, OT_SELECT)
	elif nSelectWord then
		Say(Select, OT_SELECT)
	elif nSelectLine then
		Say(Select, OT_SELECT)
		let nSelectCharacter = 0
		let nSelectWord = 0
		let nSelectLine = 0
	else SayTextSelection (Select, sText, bUseOTChar)
	endIf

EndFunction


Script Highlighting ()

var
	int nCount

if IsSpeechOnDemandActive () then return endIf
	let nCount = 0
	if GetCurrentScriptKeyName () == ksHighlighting
	|| GetCurrentScriptKeyName () == cksDelete ; from Common.jsm
	|| GetCurrentScriptKeyName () == cksCut then ; from common.jsm
		let nOldHighlight = nHighlight
/*	else
		if sWindowName == sOldWindowName then
			return
		else nOldHighlight = 0
		endIf
		nOldHighlight = 0*/
	endIf
	if GetCurrentScriptKeyName () == ksHighlighting then
		TypeKey (ksHighlighting)
	endIf
	if nNewDoc then
		nHighlight = 0
		nNewDoc = 0
	endIf
		RouteInvisibleToPc ()
	SaveCursor ()
	PCCursor ()
	let nStartRow = GetCursorRow ()
	let nStartCol = GetCursorCol ()
	/*DBT*/SpeechOff ()
	while nCount < 4
; 10-25-2016: fixed grouping below
	&& ((GetFromStartOfLine () == ""
	|| GetCursorCol () == nStartCol)
	&& GetCursorRow () == nStartRow)
		NextCharacter ()
		let nCount = nCount+1
	endWhile
	if nCount < 2 then
		if GetSelectedText () then
			let nHighlight = 1
		else let nHighlight = 0
		endIf
		PriorCharacter ()
	else let nCount = 0
		while nCount < 4
; 10-25-2016: fixed grouping below
		&& ((GetToEndOfLine () == ""
		|| GetCursorCol () == nStartCol)
		&& GetCursorRow () == nStartRow)
			PriorCharacter ()
			let nCount = nCount+1
		endWhile
		if GetSelectedText () then
			let nHighlight = 1
		else let nHighlight = 0
		endIf
		NextCharacter ()
	endIf
	InvisibleCursor ()
	RestoreCursor ()
	RoutePCToInvisible ()
	PCCursor ()
	/*DBT*/SpeechOn ()
;	endIf
	if nHighlight /*&& not nOldHighlight*/ then
		SayMessage (OT_SCREEN_MESSAGE, msgHighlightingOn)
	elif not nHighlight && nOldHighlight then
		SayMessage (OT_SCREEN_MESSAGE, msgHighlightingOff)
	endIf

EndScript


Void Function ScreenStabilizedEvent (handle LastScreenWrite)

	if (GetWindowName (LastScreenWrite) == wnSuggestedReplacements
	|| GetWindowName (GetParent (GetCurrentWindow ())) == wnSpellCheck)
	&& GetWindowName (GetCurrentWindow ()) == wnOK then
		if nFocusChange == 2 then
			let nFocusChange = 1
		else SpeakSpellCheck ()
			SayWindowTypeAndText (GetCurrentWindow ())
			let nFocusChange = 1 
			return
		endIf 
	endIf
	if (IsDocumentWindow (GetPriorWindow (GetPriorWindow (LastScreenWrite)))) then
;		Pause ()
		return
	endIf
	let MotionFlag = 0
	if nHighlightCheck == 0 then
		return
	endIf
	if GetWindowClass (GetCurrentWindow ()) == wcDBTWindow
	&& IsDocumentWindow (GetCurrentWindow ()) then
;		if not nNewDoc then
			let nOldHighlight = nHighlight
		if nNewDoc then
			nHighlight = 0
		endIf
		PerformScript Highlighting ()
;		endIf
		let nNewDoc = 0
	endIf
	let nHighlightCheck = 0

EndFunction


Void Function IndicateComputerBraille ()

; Overrides the default function, to avoid having JAWS
	; say "computer braille" wen focus changes.

EndFunction


Script SayLinePosition ()

Var
	int nAgain,
	int nFullLength,
	int nPosition,
	int nToEnd

	Let nAgain = IsSameScript ()
	let nFullLength = StringLength (GetLine ())
	Let nToEnd = StringLength (GetToEndOfLine ())
	Let nPosition = nFullLength - nToEnd+1
	If nAgain == 0 Then
		PauseForMovement ()
		PauseForMovement ()
		if nToEnd == 0 then
			Say (msgLinePosition+IntToString (nPosition)+" "+msgEndOfLine, FALSE)
		else
			Say (msgLinePosition+" "+IntToString (nPosition), FALSE)
		endIf
	ElIf nAgain == 1 Then
		Say (IntToString (nToEnd-1)+" "+msgToEndOfLine, FALSE)
	endIf

endScript


Script SayTotalAndLeftOffset ()

var
	int nAgain,
	int nFullLength,
	int nTextLength

	if not StringContains (GetWindowName (GetRealWindow (GetCurrentWindow ())), scDocument) then
		SayUsingVoice (VCTX_MESSAGE, msgNotInDocument, OT_USER_REQUESTED_INFO_X)
		return
	elif GetLineNum() == -1 then
		SayMessage (OT_STATUS, msgCodesOn_l, msgCodesOn_s)
		return
	endIf
	Let nAgain = IsSameScript ()
	let nFullLength = StringLength (GetLine ())
	let nTextLength = StringLength (StringTrimLeadingBlanks (GetLine ()))
	if nAgain == 0 then
		PauseForMovement ()
		PauseForMovement ()
		Say (IntToString (nFullLength)+" "+msgTotalCharacters, FALSE)
	elif nAgain == 1 then
		Say (IntToString (nFullLength - nTextLength)+" "+msgLeftSpaces, FALSE)
	endIf

EndScript


Script SpeakLastWord ()			

	if not IsDocumentWindow (GetCurrentWindow ()) then
		SayUsingVoice (VCTX_MESSAGE, msgNotInDocument, OT_USER_REQUESTED_INFO_X)
		return
	endIf
	if GetPageNum () == -1 then
		SayMessage (OT_STATUS, msgNoLocation_l, msgNoLocation_s)
		return
	endIf
	if nBrailleEdit then
		SpeakStringAsBrailleCells (VCTX_JAWSCURSOR, StringSegment (GetLine (), " -", -1))
	else
		Say (StringSegment (GetLine (), " -", -1), OT_USER_REQUESTED_INFO_X)
	endIf

EndScript


Void Function SaveOldValues ()

	let MotionFlag = 1
	let SaySkipFlag = 0
	let OldStyleName = StyleName
	let OldPageNum = PageNum
	let OldLineNum = LineNum
	let sOldRowNum = sRowNum
	let sOldColNum = sColNum

EndFunction


Void Function GetNewValues ()

var
	int x

	let PageNum = GetPageNum ()
	let LineNum = GetLineNum ()
	let StyleName = GetStyleName ()
	if PageNum != OldPageNum
	&& PageNum != -1
; below, don't say word "page" when entering a code or DUSCI number
	&& not DialogActive () then
		SayUsingVoice (VCTX_MESSAGE, msgPage+PageNum, OT_STATUS)
	endIf
	let LineNum = GetLineNum ()
	let x = Max ((LineNum-OldLineNum), (OldLineNum-LineNum))
	if x > 1
	&& SaySkipFlag
	&& PageNum == OldPageNum
	&& SkipVerbosity then
		SayUsingVoice (VCTX_MESSAGE, msgLineSkip, OT_STATUS)
	endIf
	if StyleChangeVerbosity
	;&& MotionFlag
	&& StyleName != OldStyleName
	&& StyleName != "-1" then
		SayUsingVoice (VCTX_MESSAGE, GetStyleName (), OT_STATUS)
	endIf
		if sRowNum != sOldRowNum then
	/*&& sRowNum != "-1" then*/
			SayUsingVoice (VCTX_MESSAGE, msgRow+sRowNum, OT_STATUS)
		elif sColNum != sOldColNum then
	/*&& sColNum != "-1" then*/
			SayUsingVoice (VCTX_MESSAGE, msgCol+sColNum, OT_STATUS)
	endIf
	let MotionFlag = 0

EndFunction



Void Function SpeakSpellCheck ()

	SaveCursor ()
	InvisibleCursor ()
	MoveToWindow (SpellCheckWindow)
	NextLine ()
	NextLine ()
	SayLine ()
	JAWSEnd ()
	SayWord ()
	SayMessage (OT_JAWS_MESSAGE, msgSpelled, msgSilent)
		SpellString (GetWord ())
	BrailleMessage (GetWord (), 0, 5000)
PCCursor ()
	RestoreCursor ()

EndFunction


Script ReadWordInContext ()

	PerformScript ReadWordInContext ()
	if BrailleInUse () then
		RouteBrailleToJAWS ()
		if IsKeyWaiting () then
			RouteBrailleToPC ()
		endIf
	endIf		

EndScript



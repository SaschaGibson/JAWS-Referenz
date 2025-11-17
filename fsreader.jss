; Copyright 2004-2021 by Freedom Scientific BLV Group, LLC


Include "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "FSReader.jsh"
include "FSReader.jsm"

GLOBALS
; For keeping speech rate silent from the event when a new book loads:
	int gbIgnoreSpeechRatePercentage,
;For supression of Highlight speak:
	int gbFoundHighlight,
; for when FocusChange gets called as the cursor lands on a new element.	
;Updated in navigation functions, such as Next / prior character, word, sentence and paragraph.
;Checked in FocusChange and cleared in ProcessKeyPressed and FocusChange
	int gbFocusChangeIgnoreNavigationElement,
; Timer for dialog whose text changes from downloading to Installing 
; without any kind of FocusChange.
;Gets destroyed every time Focus Changes.
	int giFN_AnnounceBookInstallProgress

void function AutoStartEvent()
LoadNonJCFOptions ()
let giCurrentAudioState = SendMessage(GetAppMainWindow(GlobalFocusWindow),wm_QueryStatus,wParam_AudioStatus)
let giSilenceFocusChange = false
EndFunction

void function AutoFinishEvent ()
UnscheduleFunction (giFN_AnnounceBookInstallProgress)
endFunction

void function ProcessMoveToHeading(int MoveDirection, optional int nLevel)
gbFocusChangeIgnoreNavigationElement = TRUE
ProcessMoveToHeading(MoveDirection, nLevel)
endFunction

void function ProcessMoveToElement(int MoveDirection, int bSameType, optional string ErrorMsg)
gbFocusChangeIgnoreNavigationElement = TRUE
ProcessMoveToElement(MoveDirection, bSameType, ErrorMsg)
endFunction

void function ProcessMoveToTag(int MoveDirection,
	string sTag, string sTagAttrib, string sElementtype,
	int bSayItemAsObject, int bCheckForContextHelp,
	optional int bMoveUseAttrib, optional int bAllowNesting)
gbFocusChangeIgnoreNavigationElement = TRUE
return ProcessMoveToTag(MoveDirection, sTag, sTagAttrib, sElementtype, bSayItemAsObject, bCheckForContextHelp, bMoveUseAttrib, bAllowNesting)
endFunction

VOID function TrackElementChangeForVirtualCursor (int UnitType, optional int OptionalInputValue)
var
	string sOldObjectName = getObjectName(SOURCE_CACHED_DATA)
if UnitType == UNIT_CHAR_Next then
	NextCharacter ()
elIf UnitType == UNIT_CHAR_Prior then
	PriorCharacter ()
elIf UnitType == UNIT_WORD_Next then
	NextWord ()
elIf UnitType == UNIT_WORD_Prior then
	PriorWord ()
elIf UnitType == UNIT_LINE_Next then
	nextLine (OptionalInputValue)
elIf UnitType == UNIT_LINE_prior then
	PriorLine (OptionalInputValue)
elIf UnitType == UNIT_SENTENCE_Next then
	NextSentence (OptionalInputValue)
elIf UnitType == UNIT_SENTENCE_prior then
	PriorSentence (OptionalInputValue)
elIf UnitType == UNIT_PARAGRAPH_Next then
	NextParagraph (OptionalInputValue)
elIf UnitType == UNIT_PARAGRAPH_prior then
	PriorParagraph (OptionalInputValue)
elIf UnitType == Unit_Page_next then
	JAWSPageDown ()
elIf UnitType == Unit_Page_prior then
	JAWSPageUp ()
elIf UnitType == Unit_Line_Last then
	JAWSBottomOfFile ()
elIf UnitType == Unit_Line_First then
	JAWSTopOfFile ()
endIf
gbFocusChangeIgnoreNavigationElement = (stringCompare (sOldObjectName, getObjectName(SOURCE_CACHED_DATA)) != 0)
endFunction

void function PriorCharacter ()
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (UNIT_CHAR_Prior)
endIf
return PriorCharacter ()
endFunction

void function NextCharacter ()
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (UNIT_CHAR_Next)
endIf
return nextCharacter ()
endFunction

void function PriorWord ()
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (UNIT_WORD_Prior)
endIf
return PriorWord ()
endFunction

void function NextWord ()
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (UNIT_WORD_Next)
endIf
return nextWord ()
endFunction

int function PriorLine (optional int OptionalInputValue)
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (UNIT_LINE_Prior, OptionalInputValue)
endIf
return PriorLine (OptionalInputValue)
endFunction

int function NextLine (optional int OptionalInputValue)
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (UNIT_LINE_Next, OptionalInputValue)
endIf
return NextLine (OptionalInputValue)
endFunction

int function PriorSentence (optional int OptionalInputValue)
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (UNIT_SENTENCE_Prior, OptionalInputValue)
endIf
return PriorSentence (OptionalInputValue)
endFunction

int function NextSentence (optional int OptionalInputValue)
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (UNIT_SENTENCE_Next, OptionalInputValue)
endIf
return NextSentence (OptionalInputValue)
endFunction

int function PriorParagraph (optional int OptionalInputValue)
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (UNIT_PARAGRAPH_Prior, OptionalInputValue)
endIf
return PriorParagraph (OptionalInputValue)
endFunction

int function NextParagraph (optional int OptionalInputValue)
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (UNIT_PARAGRAPH_Next, OptionalInputValue)
endIf
return NextParagraph (OptionalInputValue)
endFunction

void function JAWSPageUp ()
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (Unit_Page_Prior)
endIf
return JAWSPageUp ()
endFunction

void function JAWSPageDown ()
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (Unit_Page_next)
endIf
return JAWSPageDown ()
endFunction

void Function JAWSTopOfFile ()
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (Unit_Line_First)
endIf
return JAWSTopOfFile ()
endFunction

void Function JAWSBottomOfFile ()
if isVirtualPcCursor () && ! UserBufferIsActive () then
	return TrackElementChangeForVirtualCursor (Unit_Line_Last)
endIf
return JAWSBottomOfFile ()
endFunction

int function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
;Make sure to free up FocusChange to behave as it ought to for any reason:
gbFocusChangeIgnoreNavigationElement = FALSE
return PreProcessKeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
endFunction

void function ObjStateChangedEvent(handle hObj, int iObjType, int nChangedState, int nState, int nOldState)
if ! isVirtualPcCursor () then
; This is a problem in the Virtual Cursor, the return is always 0 in that event.
	let giCurrentAudioState = SendMessage(GetAppMainWindow(hObj),wm_QueryStatus,wParam_AudioStatus)
endIf
let giSilenceFocusChange = (giCurrentAudioState == AudioPlay)
if giCurrentAudioState == AudioPlay then
	If iObjType == WT_TREEVIEW
	|| iObjType == WT_TREEVIEWITEM then
		return
	EndIf
EndIf
ObjStateChangedEvent(hObj, iObjType, nChangedState, nState, nOldState)
EndFunction

void function FocusChangedEventEx (
	handle hwndFocus, int nObject, int nChild,
	handle hwndPrevFocus, int nPrevObject, int nPrevChild,
	int nChangeDepth)
;Kill install book progress timer:
UnscheduleFunction ( giFN_AnnounceBookInstallProgress )
if ! IsVirtualPcCursor () then
;Always returns 0 when virtual cursor is active:
	let giCurrentAudioState = SendMessage(GetAppMainWindow(hWndFocus),wm_QueryStatus,wParam_AudioStatus)
endIf
let giSilenceFocusChange = (giCurrentAudioState == AudioPlay)
;when elements are navigated to with virtual cursor movement keys, FocusChange should not speak.
;Tab and shift tab will still be fine.
if gbFocusChangeIgnoreNavigationElement then
	gbFocusChangeIgnoreNavigationElement = FALSE
	return
endIf
if FocusRedirectedOnFocusChangedEventEx (hwndFocus, nObject, nChild,
	hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth) then
	return
endIf	
FocusChangedEventEx (hwndFocus, nObject, nChild, hwndPrevFocus, nPrevObject, nPrevChild, nChangeDepth)
EndFunction

int function MenuInactiveProcessed(int mode, int PrevMenuMode)
;ensure that if exiting the menus, the new rate can be spoken, since the rate options are also in the menus.
gbIgnoreSpeechRatePercentage = OFF
return MenuInactiveProcessed(mode, PrevMenuMode)
endFunction

Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
var
	string RealWindowName,
	handle AppWindow
if ReturningFromResearchItDialog () then
	return default::FocusChangedEvent (FocusWindow, PrevWindow)
endIf
let GlobalRealWindow = GetRealWindow (FocusWindow)
let RealWindowName = GetWindowName (GlobalRealWindow)
let AppWindow = GetAppMainWindow (FocusWindow)
let GlobalFocusWindow = FocusWindow
; ensure that when focus enters document area that the normalized rate percentage will not get spoken.
gbIgnoreSpeechRatePercentage = (getWindowClass (FocusWindow) == cwcIEServer) 
ProcessSayAppWindowOnFocusChange(AppWindow,FocusWindow)
ProcessSayRealWindowOnFocusChange(AppWindow,GlobalRealWindow,RealWindowName,FocusWindow)
ProcessSayFocusWindowOnFocusChange(RealWindowName,FocusWindow)
let GlobalPrevReal = GlobalRealWindow
let GlobalPrevRealName = RealWindowName
let GlobalPrevApp = AppWindow
let GlobalPrevFocus = FocusWindow
Let GlobalWasHjDialog = InHjDialog ()
GlobalPrevDialogIdentifier = GetDialogIdentifier()
EndFunction

void function SayFocusedObject()
var
	int iCtrlID
;we add giSilenceFocusChange to the test because events may not happen in a timely fashion:
if giCurrentAudioState == AudioPlay
|| giSilenceFocusChange then
	;don't announce the main screen focus windows if the audio is playing:
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit 
	|| getWindowClass (getFocus ()) == cwcIEServer then
		return
	EndIf
EndIf
;FocusChange is behind DocumentLoaded, and so if the new book opens, we will allow DocumentLoadedEvent to speak the new book title.
; This is so the user will get the new book title read, and not some extraneous text.
;Also preserving the functionality of tab and shift+tab which are triggering FocusChange because of movement between elements.
if isVirtualPcCursor () then
	;if getFocus () != GlobalPrevFocus then
	if  getWindowSubtypeCode (getFocus ()) == WT_STATIC then
		Return
	endIf
endIf
SayFocusedObject()
if GlobalRealWindow != GlobalPrevReal then
	if StringCompare(GlobalPrevRealName,wn_FindDialog) == 0 then
		SayLine()
	EndIf
EndIf
EndFunction

void function SayHighlightedText(handle hWnd, string sBuffer)
if gbLabelingGraphics then
	return
EndIf
If (GetWindowSubtypeCode (hWnd) == WT_READONLYEDIT) then
	If gbFoundHighlight then
		Let gbFoundHighlight = FALSE
		Return;
	EndIf
EndIf
if giCurrentAudioState == AudioPlay then
	if hWnd == GlobalFocusWindow
	&& GetControlID(hWnd) == id_TableOfContentsTreeView then
		;do not speak the highlight change in the table of contents while audio is in progress
		return
	EndIf
EndIf
SayHighlightedText(hWnd,sBuffer)
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
if giCurrentAudioState == AudioPlay then
	if CurHWnd == GlobalFocusWindow
	&& GetControlID(CurHWnd) == id_TableOfContentsTreeView then
		;do not speak the item change change in the table of contents while audio is in progress
		return
	EndIf
EndIf
ActiveItemChangedEvent(curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

void function AnnounceBookInstallProgress ()
;Handle remains the same, but name changes, 
; which is why FocusChangedEvent fails to update.
var string Name = getWindowName (GlobalRealWindow)
if Name != GlobalPrevRealName then
	sayWindowTypeAndText (GlobalRealWindow)
	;Update cache for FocusChangedEvent:
	GlobalPrevRealName = Name
endIf
giFN_AnnounceBookInstallProgress = ScheduleFunction ("AnnounceBookInstallProgress", 2)
endFunction

void function ProgressBarChangedEvent(handle hProgress, string sName, string sValue)
ProgressBarChangedEvent(hProgress, sName, sValue)
if sValue == wn_MaxProgress then
	giFN_AnnounceBookInstallProgress = ScheduleFunction ("AnnounceBookInstallProgress", 2)
endIf
endFunction

int function ProcessDocumentLoadAppAlerts()
var
	string sBookName,
	string sName = getWindowName (getAppMainWindow (GetFocus ())),
	int NameLength = stringLength (stringSegment (sName, scAppNameDelimiter, 1))
;Overwrite this function in applications where special alerts are processed during DocumentLoadedEvent.
;Return true if an alert is displayed in the user buffer,
;false if no alerts are displayed in the user buffer or if no alerts are processed.
;DocumentLoadedEvent will use the return value to determine
;if the following default actions should be processed immediately or postponed until the user buffer is dismissed.
; Overwritten here to cause the title of the FSReder document to read.
let sBookName = stringChopLeft (sName, NameLength+1)
let sBookName = stringTrimLeadingBlanks (stringTrimTrailingBlanks (sBookName))
sayMessage (OT_CONTROL_NAME, sBookName)
;Prevent the user-specific rate event from speaking 100% or some other normalized rate value,
; which gets called as a new book loads.
gbIgnoreSpeechRatePercentage = ON
return false
EndFunction

void Function Unknown (string TheName, int IsScript)
If ! IsScript then
	Unknown (TheName, IsScript)
	Return
EndIf
TheName = StringLower (TheName)
If TheName == "find" then
	Beep ()
	SayCurrentScriptKeyLabel ()
	Return
EndIf
SayCurrentScriptKeyLabel ()
Unknown (TheName, IsScript)
EndFunction

Script AutoLabelGraphics ()
;set flag for suppressing highlight when labeling graphics:
let gbLabelingGraphics = true
PerformScript AutoLabelGraphics ()
let gbLabelingGraphics = false
EndScript

void function ClickAtPoint(int nCol, int nRow, int bUseJAWSCursor)
;to avoid speaking when moving to graphic, we must insure that we use the invisible not the JAWS cursor:
ClickAtPoint(nCol,nRow,FALSE)
EndFunction

void function FSReaderRateChangedEvent(int rate)
;Rate is a percentage of the normal rate (e.g. 100%, 80%, 150%).
;This event is called when the application sets the reducing of pauses. This occurs each time a document is opened.
EndFunction

void function FSReaderUserChangedRateEvent(int rate)
;Rate is a percentage of the normal rate (e.g. 100%, 80%, 150%).
;This event is called when the user uses the key, toolbar, or menu commands to change the rate.
; To prevent new books that are opened from announcing 100% as they load:
if gbIgnoreSpeechRatePercentage then
	gbIgnoreSpeechRatePercentage = OFF
	return FALSE
endIf
if giCurrentAudioState != AudioPlay then
	Say(FormatString(msgRatePercentage,IntToString(rate)),ot_status)
EndIf
EndFunction

void function FSReaderReducedPausesEvent(int ReducingPauses)
;ReducingPauses indicates the state of the Reduce Pauses option. 1 = reducing pauses, 0 indicates no pause reduction.
;This event is called when the application changes the reduce pauses option. This occurs each time a document is opened.
EndFunction

void function FSReaderUserReducedPausesEvent(int ReducingPauses)
;ReducingPauses indicates the state of the Reduce Pauses option. 1 = reducing pauses, 0 indicates no pause reduction.
;This event is called when the user uses the key, toolbar, or menu command to change the option.
if giCurrentAudioState != AudioPlay then
	if ReducingPauses then
		SayMessage(ot_status,msgReducePausesOn_L,msgReducePausesOn_S)
	else
		SayMessage(ot_status,msgReducePausesOff_L,msgReducePausesOff_S)
	EndIf
EndIf
EndFunction

void function FSReaderAudioEvent(int state)
;State represents the current state of the audio. 0 = stopped, 1 = playing, 2 = paused.
let giCurrentAudioState = state
let giSilenceFocusChange = (state == AudioPlay)
if state == AudioPlay then
	let giUserTypingEcho = GetJCFOption(opt_typing_echo)
	;SetJCFOption(opt_typing_echo,0)
else
	;SetJCFOption(opt_typing_echo,giUserTypingEcho)
EndIf
EndFunction

Script ScriptFileName ()
ScriptAndAppNames(msgFSReaderAppName)
EndScript

script OpenDialog()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script PlayPause()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
TypeCurrentScriptKey()
EndScript

script Stop()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
;SayCurrentScriptKeyLabel();No speech from FSReader keys.
TypeCurrentScriptKey()
EndScript

script Rewind()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
;SayCurrentScriptKeyLabel();No speech from FSReader keys.
TypeKey(ksRewind)
EndScript

script FastForward()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
;SayCurrentScriptKeyLabel();No speech from FSReader keys.
TypeKey(ksFastForward)
EndScript

script NormalRate()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
;SayCurrentScriptKeyLabel();No speech from FSReader keys.
TypeCurrentScriptKey()
EndScript

script IncreaseRate()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
;SayCurrentScriptKeyLabel();No speech from FSReader keys.
gbIgnoreSpeechRatePercentage = OFF ; so it always speaks when it should.
TypeCurrentScriptKey()
EndScript

script DecreaseRate()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
;SayCurrentScriptKeyLabel();No speech from FSReader keys.
gbIgnoreSpeechRatePercentage = OFF ; so it always speaks when it should.
TypeCurrentScriptKey()
EndScript

script TogglePauseReduction()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
;SayCurrentScriptKeyLabel();No speech from FSReader keys.
TypeCurrentScriptKey()
EndScript

script SetBookmark()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script ViewBookmarks()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script GoToPage()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
SayCurrentScriptKeyLabel()
TypeCurrentScriptKey()
EndScript

script Find ()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
SayCurrentScriptKeyLabel()
If DialogActive () then
	Beep ()
	Return;
EndIf
TypeCurrentScriptKey()
If (GetWindowtypeCode (GetCurrentWindow ()) != WT_EDIT &&
! IsVirtualPcCursor ()) then
	ExMessageBox (msgDlgFindErrorText, msgDlgFindErrorTitle, MB_OK|MB_ICONERROR)
EndIf
EndScript

script FindNext()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
SayCurrentScriptKeyLabel()
If DialogActive () then
	Beep ()
	Return;
EndIf
TypeCurrentScriptKey()
If (GetWindowtypeCode (GetCurrentWindow ()) != WT_EDIT &&
! IsVirtualPcCursor ()) then
	ExMessageBox (msgDlgFindErrorText, msgDlgFindErrorTitle, MB_OK|MB_ICONERROR)
EndIf
If (GetCharacterAttributes ()& ATTRIB_HIGHLIGHT) then
	Let gbFoundHighlight = TRUE
	SayLine ()
EndIf
EndScript

script FindPrevious()
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
SayCurrentScriptKeyLabel()
If DialogActive () then
	Beep ()
	Return;
EndIf
TypeCurrentScriptKey()
If (GetWindowtypeCode (GetCurrentWindow ()) != WT_EDIT &&
! IsVirtualPcCursor ()) then
	ExMessageBox (msgDlgFindErrorText, msgDlgFindErrorTitle, MB_OK|MB_ICONERROR)
EndIf
If (GetCharacterAttributes ()& ATTRIB_HIGHLIGHT) then
	Let gbFoundHighlight = TRUE
	SayLine ()
EndIf
EndScript

script SayNextLine()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		NextLine()
		return
	EndIf
EndIf
PerformScript SayNextLine()
EndScript

script SayPriorLine()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		PriorLine()
		return
	EndIf
EndIf
PerformScript SayPriorLine()
EndScript

script SayNextWord()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		NextWord()
		return
	EndIf
EndIf
PerformScript SayNextWord()
EndScript

script SayPriorWord()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		PriorWord()
		return
EndIf
EndIf
PerformScript SayPriorWord()
EndScript

script SayNextCharacter()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		NextCharacter()
		return
	EndIf
EndIf
PerformScript SayNextCharacter()
EndScript

script SayPriorCharacter()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		PriorCharacter()
		return
	EndIf
EndIf
PerformScript SayPriorCharacter()
EndScript

script JAWSHome()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		JAWSHome()
		return
	EndIf
EndIf
PerformScript JAWSHome()
EndScript

script home ()
performScript JAWSHome ()
endScript

script JAWSEnd()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		JAWSEnd()
		return
EndIf
EndIf
PerformScript JAWSEnd()
EndScript

script end ()
performScript JAWSEnd ()
endScript

script JAWSPageUp()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		JAWSPageUp()
		return
	EndIf
EndIf
PerformScript JAWSPageUp()
EndScript

script PageUp ()
performScript JAWSPageUp ()
endScript

script JAWSPageDown()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		JAWSPageDown()
		return
	EndIf
EndIf
PerformScript JAWSPageDown()
EndScript

script PageDown ()
performScript JAWSPageDown ()
endScript

script TopOfFile()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		JAWSTopOfFile()
		return
	EndIf
EndIf
PerformScript TopOfFile()
EndScript

script BottomOfFile()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		JAWSBottomOfFile()
		return
	EndIf
EndIf
PerformScript BottomOfFile()
EndScript

script SayNextParagraph()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		NextParagraph()
		return
	EndIf
EndIf
PerformScript SayNextParagraph()
EndScript

script SayPriorParagraph()
var
	int iCtrlID
if giCurrentAudioState == AudioPlay
&& IsPCCursor()
&& !UserBufferIsActive() then
	let iCtrlID = GetControlID(GlobalFocusWindow)
	if iCtrlID == id_TableOfContentsTreeView
	|| iCtrlID == id_BookContentEdit then
		;just move and don't speak when audio is playing:
		PriorParagraph()
		return
	EndIf
EndIf
PerformScript SayPriorParagraph()
EndScript

script WindowKeysHelp()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayMessage(ot_user_buffer,msgWindowKeysHelp)
UserBufferAddText(cscBufferNewLine+cmsgBuffExit)
EndScript

script StartSkimRead()
var
	int iCtrl
let iCtrl = GetControlID(GlobalFocusWindow)
if iCtrl == id_TableOfContentsTreeView then
	Say(msgErrSkimReadNotAvailableInTableOfContentsTreeview,ot_help)
	return
EndIf
PerformScript StartSkimRead()
endScript

script SkimReadDialog()
var
	int iCtrl
let iCtrl = GetControlID(GlobalFocusWindow)
if iCtrl == id_TableOfContentsTreeView then
	Say(msgErrSkimReadNotAvailableInTableOfContentsTreeview,ot_help)
	return
EndIf
PerformScript SkimReadDialog()
EndScript

script SayAll()
var
	int iCtrl
let iCtrl = GetControlID(GlobalFocusWindow)
if iCtrl == id_TableOfContentsTreeView then
	Say(msgErrSayAllNotAvailableInTableOfContentsTreeview,ot_help)
	return
EndIf
PerformScript SayAll()
EndScript

Script ScreenSensitiveHelp ()
;In prior versions of FSReader, contained CheckForUpdates code for older versions of FSReader.
PerformScript ScreenSensitiveHelp()
EndScript

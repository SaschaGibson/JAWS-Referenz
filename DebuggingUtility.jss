include "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "DebuggingUtility.jsm"

;for showing debugging unknown function calls:
globals
	string HomeRowLastUnknownFunctionName,
	int gbShouldShowUnknownFunctionCallStack,
;for suppressing unknown function call notification, use when chopping out code for debugging:
	int gbSupressUnknownFunctionCallNotification

;debug logging states:
const
	DebugLogging_Off = 0,
	DebugLogging_On = 1,
	DebugLogging_Paused = 2

;for script call stack logging:
globals
	int gnScriptCallStackLogInstance,
	string gsScriptCallStackLog,
	int gnScriptCallStackLogging

;for say logging:
const
	vwn_SayDebuggingLogOutput = "SayDebuggingLogOutput"
globals
	int gbNewSayDebugLog,
	string gsSayDebugLog,
	int gnSayDebugging,
	int gbSayDebuggingReviewActive
;Following is the list of functions which the say debugger may process.
;To prevent search failure, it is imperitive that the SayFunctionSortedList:
;contain all function names in alphabetical order,
;and that no extraneous characters including whitespace appear on each line.
;SayFunctionSortedList will be treated as a sorted list and searched using a binary search.
;For ease of reference, an 1-based index constant will be assigned to each say function.
;It is imperative that the constant match the string segment position of each line in the SayFunctionSortedList message,
;where SayFunctionSortedList is a segmented string delimited by the newline.
;Also, MaxSayFuncIndex must be set to the index number of the last say function.
;If you modify the list of say functions, be sure to adhere to the rules stated above.
Const
	Say_FuncIndex = 1,
	SayActiveCursor_FuncIndex = 2,
	SayAll_FuncIndex = 3,
	SayAllSpeakUnit_FuncIndex = 4,
	SayCachedMSAAFocusInfo_FuncIndex = 5,
	SayCell_FuncIndex = 6,
	SayCharacter_FuncIndex = 7,
	SayCharacterByExample_FuncIndex = 8,
	SayCharacterPhonetic_FuncIndex = 9,
	SayChunk_FuncIndex = 10,
	SayColor_FuncIndex = 11,
	SayColumnHeader_FuncIndex = 12,
	SayControl_FuncIndex = 13,
	SayControlEx_FuncIndex = 14,
	SayControlExWithMarkup_FuncIndex = 15,
	SayControlInformation_FuncIndex = 16,
	SayCurrentScriptKeyLabel_FuncIndex = 17,
	SayCursorPos_FuncIndex = 18,
	SayField_FuncIndex = 19,
	SayFocusRect_FuncIndex = 20,
	SayFocusRects_FuncIndex = 21,
	SayFont_FuncIndex = 22,
	SayFrame_FuncIndex = 23,
	SayFrameAtCursor_FuncIndex = 24,
	SayFromCursor_FuncIndex = 25,
	SayInteger_FuncIndex = 26,
	Sayline_FuncIndex = 27,
	SayObjectActiveItem_FuncIndex = 28,
	SayObjectTypeAndText_FuncIndex = 29,
	SayParagraph_FuncIndex = 30,
	SayPhraseByExample_FuncIndex = 31,
	SayPromptTypeAndText_FuncIndex = 32,
	SayRowHeader_FuncIndex = 33,
	SaySentence_FuncIndex = 34,
	SayString_FuncIndex = 35,
	SayTextBetween_FuncIndex = 36,
	SayToBottom_FuncIndex = 37,
	SayToCursor_FuncIndex = 38,
	SayToPunctuation_FuncIndex = 39,
	SayUsingVoice_FuncIndex = 40,
	SayWindow_FuncIndex = 41,
	SayWindowTypeAndText_FuncIndex = 42,
	SayWord_FuncIndex = 43,
	MaxSayFuncIndex = 43
messages
@SayFunctionSortedList
Say
SayActiveCursor
SayAll
SayAllSpeakUnit
SayCachedMSAAFocusInfo
SayCell
SayCharacter
SayCharacterByExample
SayCharacterPhonetic
SayChunk
SayColor
SayColumnHeader
SayControl
SayControlEx
SayControlExWithMarkup
SayControlInformation
SayCurrentScriptKeyLabel
SayCursorPos
SayField
SayFocusRect
SayFocusRects
SayFont
SayFrame
SayFrameAtCursor
SayFromCursor
SayInteger
Sayline
SayObjectActiveItem
SayObjectTypeAndText
SayParagraph
SayPhraseByExample
SayPromptTypeAndText
SayRowHeader
SaySentence
SayString
SayTextBetween
SayToBottom
SayToCursor
SayToPunctuation
SayUsingVoice
SayWindow
SayWindowTypeAndText
SayWord
@@
EndMessages

;msgOutputTypesList contains the possible text strings used in the script code to match each numeric value for output types.
;See HJConst.jsh for the numeric values mapped to the output types.
;because the output types constants are 0-based,
;The value of the index used by StringSegment when accessing msgOutputTypesList
;must be the output type incremented by 1 to get the matching code strings.
Messages
@msgOutputTypesList
(OT_BUFFER, OT_NO_DISABLE, OT_WINDOW_INFORMATION, OT_DIALOG_INFORMATION, OT_APP_INFORMATION)
(OT_HELP)
(OT_APP_START)
(OT_JAWS_MESSAGE)
(OT_SCREEN_MESSAGE, OT_MESSAGE)
(OT_CONTROL_NAME, OT_WINDOW_NAME)
(OT_CONTROL_TYPE)
(OT_DIALOG_NAME)
(OT_DIALOG_TEXT, OT_STATIC)
(OT_DOCUMENT_NAME, OT_APP_NAME)
(OT_SELECTED_ITEM, OT_SELECTED)
(OT_ITEM_STATE)
(OT_POSITION)
(OT_ERROR)
(OT_ITEM_NUMBER)
(OT_TOOL_TIP)
(OT_STATUS)
(OT_CONTROL_GROUP_NAME)
(OT_SMART_HELP, OT_HELP_BEGINNER)
(OT_SELECT)
(OT_TUTOR)
(OT_ACCESS_KEY)
(OT_HELP_BALLOON)
(OT_USER_REQUESTED_INFORMATION)
(OT_CONTROL_DESCRIPTION)
(OT_DEBUG)
(OT_STRING)
(OT_GRAPHIC)
(OT_CHAR)
(OT_WORD)
(OT_FIELD)
(OT_CHUNK)
(OT_LINE)
(OT_SPELL)
(OT_SAYALL)
(OT_TEXT)
(OT_FONT)
(OT_KEYBOARD)
(OT_CURSOR)
()
(OT_USER_BUFFER)
(OT_PHONETIC_CHAR)
(OT_BRAILLE_MESSAGE)
(OT_HIGHLIGHTED_SCREEN_TEXT)
(OT_NONHIGHLIGHTED_SCREEN_TEXT)
(OT_MOUSE_SPEECH)
(OT_TOASTS)
(OT_MOUSE_SPEECH_CONTROL_TYPE)
(OT_MOUSE_SPEECH_ITEM_STATE)
@@
EndMessages

;The DelayedUserBufferActivateDelayTime is used to ensure that the hjDialog has lost focus before we try to activate the user buffer.
const
	DelayedUserBufferActivateWaitTime = 10

;for switch logging:
const
	vwn_SwitchDebuggingLogOutput = "SwitchDebuggingLogOutput"
globals
	int gbNewSwitchDebugLog,
	string gsSwitchDebugLog,
	int gnSwitchDebugLogging

;for ToggleDiagnosticTestKeyState:
globals
int gbDiagnosticTestKeysState,
int gbSavedTestKeysVirtViewer,
int gbTestKeysSavedTypingEcho,
int giSavedTestKeysPunctuation,
int gbSavedTestKeysBrlMessages,
int gbSavedTestKeysBrlMessageTime,
int gbUseCompactScriptCallStackFormat


string function GetFormattedScriptCallStack()
var
	string sStack,
	int i,
	string sItem,
	string sJsb,
	string sFunc,
	string sFormattedStack
let sStack = GetScriptCallStack()
;chop off most recent two entries, since they is this function and is not useful information:
let sStack = StringChopLeft(sStack,StringLength(StringSegment(sStack,"\n",1))+1)
let sStack = StringChopLeft(sStack,StringLength(StringSegment(sStack,"\n",1))+1)
if gbUseCompactScriptCallStackFormat then
	let i = 1
	let sItem = StringSegment(sStack,"\n",i)
	while sItem
		let sJsb = StringSegment(StringSegment(sItem,"\t",1),"\\",-1)
		if StringCompare(StringRight(sJsb,4),".jsb") == 0 then
			let sJsb = StringChopRight(sJsb,4)
		EndIf
		let sFunc = StringSegment(sItem,"\t",-1)
		let sFormattedStack = sFormattedStack+sJsb+cscSpace+cscSpace+sFunc+cscBufferNewLine
		let i = i+1
		let sItem = StringSegment(sStack,"\n",i)
	EndWhile
else
	let sFormattedStack = StringReplaceChars(sStack,"\t","\n")
EndIf
return sFormattedStack
EndFunction

string function ToggleUseCompactScriptCallStackFormat(int iRetCurVal)
if !iRetCurVal then

	let gbUseCompactScriptCallStackFormat = !gbUseCompactScriptCallStackFormat
EndIf
if gbUseCompactScriptCallStackFormat then
	return cmsgOn
else
	return cmsgOff
EndIf
EndFunction

void function SaveLastUnknownFunctionName(string FunctionName, int bIsScript)
if bIsScript then
	let HomeRowLastUnknownFunctionName = FormatString(msgUnknownScript,FunctionName)
else
	let HomeRowLastUnknownFunctionName = FunctionName
EndIf
EndFunction

void function ShowLastUnknownFunctionName()
if !HomeRowLastUnknownFunctionName then
	SayUsingVoice(vctx_message,FormatString(msgNoUnknownFunction),ot_user_requested_Information)
	return
EndIf
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
UserBufferAddText(FormatString(msgShowLastUnknownFunctionName,HomeRowLastUnknownFunctionName))
UserBufferActivate()
UserBufferAddText(msgBufferCloseLink,"UserBufferDeactivate()",msgBufferCloseLink)
JAWSTopOfFile()
SayLine()
EndFunction

int function ShouldShowUnknownFunctionCallStack()
return gbShouldShowUnknownFunctionCallStack
EndFunction

void function ToggleShowUnknownFunctionCallStack()
let gbShouldShowUnknownFunctionCallStack = !gbShouldShowUnknownFunctionCallStack
if gbShouldShowUnknownFunctionCallStack then
	Say(msgShowUnknownFunctionCallStack_On,ot_status)
else
	Say(msgShowUnknownFunctionCallStack_Off,ot_status)
EndIf
EndFunction

void function ToggleSuppressUnknownFunctionCallNotification()
let gbSupressUnknownFunctionCallNotification = !gbSupressUnknownFunctionCallNotification
if gbSupressUnknownFunctionCallNotification then
	Say(msgSuppressUnknownFunctionCallNotification_On,ot_status)
else
	Say(msgSuppressUnknownFunctionCallNotification_Off,ot_status)
EndIf
EndFunction

int function IsSuppressingUnknownFunctionCallNotification()
return gbSupressUnknownFunctionCallNotification
endFunction

void function AppendToScriptCallStackLog()
var
	string sCallStack
if !IsScriptCallStackLogging() then
	return
EndIf
let sCallStack = GetFormattedScriptCallStack()
;chop off most recent entry, since it is this function and is not useful information:
let sCallStack = StringChopLeft(sCallStack,StringLength(StringSegment(sCallStack,"\n",1))+1)
let gnScriptCallStackLogInstance = gnScriptCallStackLogInstance+1
if gnScriptCallStackLogInstance == 1 then
	;add title, but remember that gsScriptCallStackLog may not be empty due to calls to AppendToScriptCallStackLogEx
	let gsScriptCallStackLog = msgScriptCallStackLogTitle+cscBufferNewLine+gsScriptCallStackLog
EndIf
let gsScriptCallStackLog = gsScriptCallStackLog+cscBufferNewLine
	+FormatString(msgScriptCallStackLogEntry, IntToString(gnScriptCallStackLogInstance),
	StringReplaceChars(sCallStack,"\t","\n"))
EndFunction

void function AppendToScriptCallStackLogEx(string sText)
if !IsScriptCallStackLogging() then
	return
EndIf
let gsScriptCallStackLog = gsScriptCallStackLog+cscBufferNewLine+sText
EndFunction

void function ClearScriptCallStackLog()
let gnScriptCallStackLogInstance = 0
let gsScriptCallStackLog = cscNull
EndFunction

void function EnableScriptCallStackLogging()
ClearScriptCallStackLog()
Say(msgCallStackLogging_On,ot_status)
let gnScriptCallStackLogging = DebugLogging_On
EndFunction

void function ResetScriptCallStackLogging()
ClearScriptCallStackLog()
Say(msgCallStackLogging_Reset,ot_status)
let gnScriptCallStackLogging = DebugLogging_On
EndFunction

void function StopScriptCallStackLogging()
ClearScriptCallStackLog()
let gnScriptCallStackLogging = DebugLogging_Off
Say(msgCallStackLogging_Stop,ot_status)
EndFunction

void function PauseScriptCallStackLogging()
let gnScriptCallStackLogging = DebugLogging_Paused
Say(msgCallStackLogging_Pause,ot_status)
EndFunction

void function ResumeScriptCallStackLogging()
Say(msgCallStackLogging_Resume,ot_status)
let gnScriptCallStackLogging = DebugLogging_On
EndFunction

int function IsScriptCallStackLogging()
return gnScriptCallStackLogging == DebugLogging_On
EndFunction

void function DoDelayedShowScriptCallStackLog()
UserBufferActivate()
JAWSTopOfFile()
SayLine()
EndFunction

void function ShowScriptCallStackLog()
if !gsScriptCallStackLog then
	Say(msgErr_CallStackLogEmpty,ot_error)
	return
EndIf
UserBufferDeactivate()
UserBufferClear()
UserBufferAddText(gsScriptCallStackLog)
UserBufferAddText (cScBufferNewLine)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
ScheduleFunction("DoDelayedShowScriptCallStackLog",DelayedUserBufferActivateWaitTime)
EndFunction

void function ManageScriptCallStackLogging()
var
	string loggingMenu,
	int choice
if gnScriptCallStackLogging == DebugLogging_Off then
	EnableScriptCallStackLogging()
	return
EndIf
HomeRowToggle()
if gnScriptCallStackLogging == DebugLogging_On then
	let loggingMenu = msgLoggingMenu_Pause
else
	let loggingMenu = msgLoggingMenu_Resume
EndIf
let loggingMenu = loggingMenu+LIST_ITEM_SEPARATOR
	+msgLoggingMenu_Stop+LIST_ITEM_SEPARATOR
	+msgLoggingMenu_Reset
if gsScriptCallStackLog then
	let loggingMenu = loggingMenu+LIST_ITEM_SEPARATOR+msgLoggingMenu_Show
EndIf
let choice = DlgSelectItemInList(loggingMenu,msgScriptCallstackLoggingMenuTitle,0)
if !choice then
	return
EndIf
if choice == 1 then
	if gnScriptCallStackLogging == DebugLogging_On then
		PauseScriptCallStackLogging()
	else
		ResumeScriptCallStackLogging()
	EndIf
ElIf choice == 2 then
	StopScriptCallStackLogging()
ElIf choice == 3 then
	ResetScriptCallStackLogging()
ElIf choice == 4 then
	ShowScriptCallStackLog()
EndIf
EndFunction

void function ClearSayLog()
let gbNewSayDebugLog = true
let gsSayDebugLog = cscNull
EndFunction

void function EnableSayLogging()
ClearSayLog()
Say(msgSayLogging_On,ot_status)
let gnSayDebugging = DebugLogging_On
EndFunction

void function ResetSayLogging()
ClearSayLog()
let gnSayDebugging = DebugLogging_Off
Say(msgSayLogging_Reset,ot_status)
let gnSayDebugging = DebugLogging_On
EndFunction

void function StopSayLogging()
ClearSayLog()
let gnSayDebugging = DebugLogging_Off
Say(msgSayLogging_Stop,ot_status)
EndFunction

void function PauseSayLogging()
let gnSayDebugging = DebugLogging_Paused
Say(msgSayLogging_Pause,ot_status)
EndFunction

void function ResumeSayLogging()
Say(msgSayLogging_Resume,ot_status)
let gnSayDebugging = DebugLogging_On
EndFunction

int function IsSayDebugging()
return gnSayDebugging == DebugLogging_On
	&& !gbSayDebuggingReviewActive
	&& !(UserBufferIsActive() && UserBufferWindowName() == vwn_SayDebuggingLogOutput)
EndFunction

void function DoDelayedShowSayLog()
UserBufferActivateEx(vwn_SayDebuggingLogOutput,cscNull,0,0)
JAWSTopOfFile()
SayLine()
EndFunction

void function ShowSayLog()
if !gsSayDebugLog then
	Say(msgErr_SayLogEmpty,ot_error)
	let gbSayDebuggingReviewActive = false
	return
EndIf
UserBufferDeactivate()
UserBufferClear()
UserBufferAddText(gsSayDebugLog)
UserBufferAddText (cScBufferNewLine)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
ScheduleFunction("DoDelayedShowSayLog",DelayedUserBufferActivateWaitTime)
EndFunction

void function ManageSayLogging()
var
	string loggingMenu,
	int choice
if gnSayDebugging == DebugLogging_Off then
	EnableSayLogging()
	return
EndIf
let gbSayDebuggingReviewActive = true
HomeRowToggle()
if gnSayDebugging == DebugLogging_On then
	let loggingMenu = msgLoggingMenu_Pause
else
	let loggingMenu = msgLoggingMenu_Resume
EndIf
let loggingMenu = loggingMenu+LIST_ITEM_SEPARATOR
	+msgLoggingMenu_Stop+LIST_ITEM_SEPARATOR
	+msgLoggingMenu_Reset
if gsSayDebugLog then
	let loggingMenu = loggingMenu+LIST_ITEM_SEPARATOR+msgLoggingMenu_Show
EndIf
let choice = DlgSelectItemInList(loggingMenu,msgSayLoggingMenuTitle,0)
let gbSayDebuggingReviewActive = false
if !choice then
	return
EndIf
if choice == 1 then
	if gnSayDebugging == DebugLogging_On then
		PauseSayLogging()
	else
		ResumeSayLogging()
	EndIf
ElIf choice == 2 then
	StopSayLogging()
ElIf choice == 3 then
	ResetSayLogging()
ElIf choice == 4 then
	ShowSayLog()
EndIf
EndFunction

int function LookupSayFunction(string SayFunctionName)
var
	int iFirst,
	int iLast,
	int iMiddle,
	int iCompare
let iFirst = 1
let iLast = MaxSayFuncIndex
While iLast >= iFirst
	let iMiddle = (iFirst+iLast)/2
	let iCompare = StringCompare(SayFunctionName,StringSegment(SayFunctionSortedList,"\n",iMiddle),0)
	if iCompare == 0 then
		return iMiddle
	ElIf iCompare > 0 then
		let iFirst = iMiddle+1
	Else
		let iLast = iMiddle-1
	EndIf
EndWhile
return 0 ;function was not found in the list
EndFunction

void function SayDebugger(string sCallingFunction,optional  variant param1, variant param2, variant param3, variant param4, variant param5, variant param6, variant param7, variant param8, variant param9)
var
	int iFunc,
	string sMessage,
	int iOutputType,
	int bContainsSpeechMarkup,
	string sCallStack,
	string sFuncInfo,
	handle hWnd,
	string sApp
if !IsSayDebugging() then
	return
EndIf
let iFunc = LookupSayFunction(sCallingFunction)
if !iFunc then
	return
EndIf
let sCallStack = GetFormattedScriptCallStack()
if gbNewSayDebugLog then
	let gbNewSayDebugLog = false
	let gsSayDebugLog = msgSayLogTitle
EndIf
if iFunc == Say_FuncIndex then
	let sMessage = param1
	let iOutputType = param2
	let bContainsSpeechMarkup = param3
	if bContainsSpeechMarkup then
		let sMessage = smmStripMarkup(sMessage)+cscBufferNewLine+"\t"+sMessage
	EndIf
	let sFuncInfo = FormatString(msgSayFunctionInfo,
		sMessage,
		IntToString(iOutputType)
			+cscSpace
			+StringSegment(msgOutputTypesList,"\n",iOutputType+1))
elif iFunc == SayUsingVoice_FuncIndex then
	let sMessage = Param2
	let iOutputType = param3
	let bContainsSpeechMarkup = param4
	if bContainsSpeechMarkup then
		let sMessage = smmStripMarkup(sMessage)+cscBufferNewLine+"\t"+sMessage
	EndIf
	let sFuncInfo = FormatString(msgSayUsingVoiceFunctionInfo,
		sMessage,
		IntToString(iOutputType)
			+cscSpace
			+StringSegment(msgOutputTypesList,"\n",iOutputType+1),
		param1)
else
	let sFuncInfo = sCallingFunction
EndIf
let hWnd = getcurrentWindow()
let sApp = GetWindowOwner(hWnd)
if sApp then
	let sApp = StringSegment(sApp,cScDoubleBackSlash,StringSegmentCount(sApp,cScDoubleBackSlash))
EndIf
let gsSayDebugLog = gsSayDebugLog+cscBufferNewLine+cscBufferNewLine
	+FormatString(msgSayLogEntry,
		sFuncInfo,
		sApp,
		GetActiveConfiguration(),
		FormatString(msgHandleInfo, IntToString(hWnd), DecToHex(hWnd)),
		GetWindowClass(hWnd),
		IntToString(GetWindowSubtypeCode(hWnd)),
		sCallStack)
EndFunction

void function LogSwitchAttempt(string sSwitchToSet)
var
	string sCallStack,
	string sFrom
PlaySound(FindJAWSSoundFile("DoDoop10.wav"))
let sFrom = GetActiveConfiguration()
let sCallStack = GetFormattedScriptCallStack()
if gbNewSwitchDebugLog then
	let gbNewSwitchDebugLog = false
	let gsSwitchDebugLog = msgSwitchLogTitle
EndIf
let gsSwitchDebugLog = gsSwitchDebugLog+cscBufferNewLine+cscBufferNewLine
	+FormatString(msgSwitchLogEntry,
	sFrom, sSwitchToSet, sCallStack)
EndFunction

int function SwitchToConfiguration(string sConfiguration)
if IsSwitchDebugging() then
	LogSwitchAttempt(sConfiguration)
EndIf
return SwitchToConfiguration(sConfiguration)
EndFunction

void function SwitchToScriptFile(string sSwitchToScript, string sFallBackScript)
if IsSwitchDebugging() then
	LogSwitchAttempt(sSwitchToScript)
EndIf
SwitchToScriptFile(sSwitchToScript,sFallBackScript)
EndFunction

void function ClearSwitchLog()
let gbNewSwitchDebugLog = true
let gsSwitchDebugLog = cscNull
EndFunction

void function EnableSwitchLogging()
ClearSwitchLog()
Say(msgSwitchLogging_On,ot_status)
let gnSwitchDebugLogging = DebugLogging_On
EndFunction

void function ResetSwitchCallStackLogging()
ClearSwitchCallStackLog()
Say(msgCallStackLogging_Reset,ot_status)
let gnSwitchDebugLogging = DebugLogging_On
EndFunction

void function StopSwitchLogging()
ClearSwitchLog()
let gnSwitchDebugLogging = DebugLogging_Off
Say(msgSwitchLogging_Stop,ot_status)
EndFunction

void function PauseSwitchLogging()
let gnSwitchDebugLogging = DebugLogging_Paused
Say(msgSwitchLogging_Pause,ot_status)
EndFunction

void function ResumeSwitchLogging()
Say(msgSwitchLogging_Resume,ot_status)
let gnSwitchDebugLogging = DebugLogging_On
EndFunction

int function IsSwitchDebugging()
return gnSwitchDebugLogging == DebugLogging_On
EndFunction

void function DoDelayedShowSwitchLog()
UserBufferActivateEx(vwn_SwitchDebuggingLogOutput,cscNull,0,0)
JAWSTopOfFile()
SayLine()
EndFunction

void function ShowSwitchLog()
if !gsSwitchDebugLog then
	Say(msgErr_SwitchLogEmpty,ot_error)
	return
EndIf
UserBufferDeactivate()
UserBufferClear()
UserBufferAddText(gsSwitchDebugLog)
UserBufferAddText (cScBufferNewLine)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
ScheduleFunction("DoDelayedShowSwitchLog",DelayedUserBufferActivateWaitTime)
EndFunction

void function ManageSwitchLogging()
var
	string loggingMenu,
	int choice
if gnSwitchDebugLogging == DebugLogging_Off then
	EnableSwitchLogging()
	return
EndIf
HomeRowToggle()
if gnSwitchDebugLogging == DebugLogging_On then
	let loggingMenu = msgLoggingMenu_Pause
else
	let loggingMenu = msgLoggingMenu_Resume
EndIf
let loggingMenu = loggingMenu+LIST_ITEM_SEPARATOR
	+msgLoggingMenu_Stop+LIST_ITEM_SEPARATOR
	+msgLoggingMenu_Reset
if gsSwitchDebugLog then
	let loggingMenu = loggingMenu+LIST_ITEM_SEPARATOR+msgLoggingMenu_Show
EndIf
let choice = DlgSelectItemInList(loggingMenu,msgSwitchLoggingMenuTitle,0)
if !choice then
	return
EndIf
if choice == 1 then
	if gnSwitchDebugLogging == DebugLogging_On then
		PauseSwitchLogging()
	else
		ResumeSwitchLogging()
	EndIf
ElIf choice == 2 then
	StopSwitchLogging()
ElIf choice == 3 then
	ResetSwitchLogging()
ElIf choice == 4 then
	ShowSwitchLog()
EndIf
EndFunction

int function InDiagnosticTestKeyState()
return gbDiagnosticTestKeysState
EndFunction

void function ToggleDiagnosticTestKeyState()
let gbDiagnosticTestKeysState = !gbDiagnosticTestKeysState
if gbDiagnosticTestKeysState then
	SayUsingVoice(vctx_message,msgTestKeysOn,ot_status)
	if InHomeRowMode() then
		HomeRowToggle()
	endIf
	let gbSavedTestKeysVirtViewer = GetJCFOption(opt_virt_viewer)
	SetJCFOption(opt_virt_viewer,1)
	let gbTestKeysSavedTypingEcho= GetJCFOption(opt_typing_echo)
	SetJCFOption(opt_typing_echo,0)
	let giSavedTestKeysPunctuation = GetJCFOption(opt_punctuation)
	SetJCFOption(opt_punctuation,3)
	let gbSavedTestKeysBrlMessages = GetJCFOption(opt_brl_messages)
	SetJCFOption(opt_brl_messages,1)
	let gbSavedTestKeysBrlMessageTime = GetJCFOption(opt_brl_message_time)
	SetJCFOption(opt_brl_message_time,0)
	AddHook(hk_script,"TestKeysHook")
	TrapKeys(true)
	SayFormattedMessage(ot_user_requested_information,msgTestKeysHelp)
else
	SetJCFOption(opt_brl_message_time,gbSavedTestKeysBrlMessageTime)
	SayUsingVoice(vctx_message,msgTestKeysOff,ot_status)
	SetJCFOption(opt_virt_viewer,gbSavedTestKeysVirtViewer)
	SetJCFOption(opt_typing_echo,gbTestKeysSavedTypingEcho)
	SetJCFOption(opt_punctuation,giSavedTestKeysPunctuation)
	SetJCFOption(opt_brl_messages,gbSavedTestKeysBrlMessages)
	BrailleRefresh()
	RemoveHook(hk_script,"TestKeysHook")
	TrapKeys(false)
EndIf
EndFunction

int function DiagnosticTestingKeys(int nKey, string strKeyName)
if gbDiagnosticTestKeysState then
	SayMessage(ot_user_requested_information,FormatString(msgTestKeysOutput,strKeyName,DecToHex(nKey)))
	return true
else
	return false
endIf
EndFunction

void function TestKeysHook(string ScriptName, string FrameName)
if ScriptName == "HomeRowToggle" then
	ScheduleFunction("ToggleDiagnosticTestKeyState",30)
endIf
return false
EndFunction

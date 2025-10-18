;homerow mode window utility functions
;note this does not include the homerow MSAA utility mode functions

INCLUDE "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "HomeRow.jsh"
include "HomeRow.jsm"
use "DebuggingUtility.jsb"

const
	MaxTreeCaptureBufferSize = 100000

int function InHomeRowMode()
return gbHomeRowActive
EndFunction

void function HomeRowToggle()
let gbHomeRowActive = ToggleHomeRow()
If  !gbHomeRowActive then
	SayMessage(ot_status,msgHomeRowOff_L,msgHomeRowOff_S)
Else
	let hHomeRowPos = GetCurrentWindow()
	let iHomeRowAppMainWindowAlert = 0
	if !ut_OutputMode then
		let ut_OutputMode = UT_SAYTYPEANDTEXT
	EndIf
	SayMessage(ot_status,msgHomeRowOn_L,msgHomeRowOn_S)
endIf
EndFunction

void function ShowInViewer(string sText)
if !sText then
	Say(msgNotAvailable,ot_status)
	return
EndIf
if UserBufferIsActive() then
	UserBufferDeactivate()
EndIf
UserBufferClear()
UserBufferAddText(sText+cscBufferNewLine)
UserBufferAddText(msgBufferCloseLink,"UserBufferDeactivate()",msgBufferCloseLink)
UserBufferActivate()
JAWSTopOfFile()
SayAll()
EndFunction

void function UtilityInitializeHomeRowPosition()
let hHomeRowPos = GetCurrentWindow()
let iHomeRowAppMainWindowAlert = 0
SayFormattedMessage(ot_status,msgHomeRowToCurrent_L,msgHomeRowToCurrent_S)
EndFunction

void function UtilityToggleSpeakWindowVisibility()
let iHomeRowSpeakWindowVisibility = !iHomeRowSpeakWindowVisibility
If !iHomeRowSpeakWindowVisibility then
	SayMessage(ot_status,msgVisibilityOff)
else
	SayMessage(ot_status,msgVisibilityOn)
endIf
EndFunction

void function UtilitySpeakWindowVisibility()
If IsWindowVisible(hHomeRowPos)
|| !IsWindowObscured(hHomeRowPos) then
	SayMessage(ot_help,msgVisible)
else
	SayMessage(ot_help,msgNotVisible)
endIf
if IsWindowDisabled(hHomeRowPos) then
	SayMessage(ot_help,msgDisabled)
EndIf
EndFunction

void function UtilityToggleNotifyIfWinFormsClass()
let iHomeRowNotifyIfWinFormsClass = !iHomeRowNotifyIfWinFormsClass
If !iHomeRowNotifyIfWinFormsClass then
	SayMessage(ot_status,msgNotifyIfWinFormsClassOff)
else
	SayMessage(ot_status,msgNotifyIfWinFormsClassOn)
endIf
EndFunction

void function UtilityNextAttribute()
If !UT_FontMode then
	let UT_FontMode = ATTRIB_BOLD
endIf
If FindNextAttribute(UT_FontMode) then
	SayField()
	return
endIf
if FindFirstAttribute(UT_FontMode) then
	beep()
	SayField()
	return
endIf
SayFormattedMessage(ot_JAWS_message,msgNextAttributeNotFound,msgNotFound)
EndFunction

void function UtilityPriorAttribute()
If !UT_FontMode then
	let UT_FontMode = ATTRIB_BOLD
endIf
If FindPriorAttribute(UT_FontMode) then
	SayField()
	return
endIf
If FindLastAttribute(UT_FontMode) then
	beep()
	SayField()
	return
endIf
SayFormattedMessage(ot_JAWS_message,msgPriorAttributeNotFound,msgNotFound)
EndFunction

void function UtilityFindFirstAttribute()
If !UT_FontMode then
	let UT_FontMode = ATTRIB_BOLD
endIf
If FindFirstAttribute(UT_FontMode) then
	SayWord()
Else
	SayFormattedMessage(ot_JAWS_message,MsgFirstAttributeNotFound,msgNotFound)
endIf
EndFunction

void function UtilityFindLastAttribute()
If !UT_FontMode then
	let UT_FontMode = ATTRIB_BOLD
endIf
If FindLastAttribute(UT_FontMode) then
	SayWord()
Else
	SayFormattedMessage(ot_error,msgLastAttributeNotFound,msgNotFound)
endIf
EndFunction

string function ConvertIntToHexDisplayString(int i)
if i then
	return "0x"+DecToHex(i)
else
	return IntToString(i)
EndIf
EndFunction

void Function UtilitySayInfo(int bSpellMode)
var
	string s
If UT_OutputMode == UT_SAYTYPEANDTEXT then
	SayWindowTypeAndText(hHomeRowPos)
ElIf UT_OutputMode == UT_HANDLE then
	if bSpellMode then
		SpellString(DecToHex(hHomeRowPos))
	else
		SayInteger(hHomeRowPos)
	EndIf
ElIf UT_OutputMode == UT_CONTROLID then
	SayInteger(GetControlID(hHomeRowPos))
ElIf UT_OutputMode == UT_CLASS then
	If bSpellMode then
		SpellString(GetWindowClass(hHomeRowPos))
	Else
		Say(GetWindowClass(hHomeRowPos), ot_help)
	endIf
ElIf UT_OutputMode == UT_TYPE then
	if bSpellMode then
		SpellString(GetWindowType(hHomeRowPos))
	Else
		Say(GetWindowType(hHomeRowPos), ot_help)
	endIf
ElIf UT_OutputMode == UT_SUBTYPE then
	SayInteger(GetWindowSubTypeCode(hHomeRowPos))
ElIf UT_OutputMode == UT_StyleBits then
	SpellString("0x"+DecToHex(GetWindowStyleBits(hHomeRowPos)))
elif UT_OutputMode == UT_ExStyleBits then
	SpellString(ConvertIntToHexDisplayString(GetWindowExStyleBits(hHomeRowPos)))
ElIf UT_OutputMode == UT_Owner then
	let s = GetWindowOwner(hHomeRowPos)
	if s then
		let s = StringSegment(s,cScDoubleBackSlash,StringSegmentCount(s,cScDoubleBackSlash))
	EndIf
	if bSpellMode then
		SpellString(s)
	else
		Say(s,ot_help)
	EndIf
ElIf UT_OutputMode == UT_REALNAME then
	If bSpellMode then
		SpellString(GetWindowName(GetRealWindow(hHomeRowPos)))
	Else
		Say(GetWindowName(GetRealWindow(hHomeRowPos)), ot_help)
	endIf
ElIf UT_OutputMode == UT_WINDOWNAME then
	If bSpellMode then
		SpellString(GetWindowName(hHomeRowPos))
	Else
		Say(GetWindowName(hHomeRowPos), ot_help)
	endIf
ElIf UT_OutputMode == UT_WINDOWTEXTRESTRICTED then
	Say(GetWindowTextEx(hHomeRowPos,0,0),ot_help)
ElIf UT_OutputMode == UT_WINDOWTEXTINCLUSIVE then
	Say(GetWindowTextEx(hHomeRowPos,0,1),ot_help)
ElIf UT_OutputMode == UT_HotKey then
	Say(GetHotKey(hHomeRowPos),ot_help)
ElIf UT_OutputMode == UT_HIGHLIGHTEDTEXT then
	If bSpellMode then
		SpellString(GetWindowTextEx(hHomeRowPos,1,0))
	Else
		Say(GetWindowTextEx(hHomeRowPos,1,0),ot_help)
	EndIf
endIf
EndFunction

void function UtilitySayInfoAccess()
var
	Int bSpellMode
If IsSameScript() then
	let bSpellMode = ON
Else
	let bSpellMode = OFF
endIf
UtilitySayInfo(bSpellMode)
EndFunction

void function UtilityPutInfoInBox()
var
	string s
If UT_OutputMode == UT_HANDLE then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgHandle,
		FormatString(msgHandleInfo,
			IntToString(hHomeRowPos),
			DecToHex(hHomeRowPos))))
ElIf UT_OutputMode == UT_CONTROLID then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgControlID_L,
		IntToString(GetControlID(hHomeRowPos))))
ElIf UT_OutputMode == UT_CLASS then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgClass,
		GetWindowClass(hHomeRowPos)))
ElIf UT_OutputMode == UT_TYPE then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgType,
		GetWindowType(hHomeRowPos)))
ElIf UT_OutputMode == UT_SUBTYPE	 then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgSubtype_L,
		IntToString(GetWindowSubtypeCode(hHomeRowPos))))
ElIf UT_OutputMode == UT_StyleBits then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgStyleBits_L,
		"0x"+DecToHex(GetWindowStyleBits(hHomeRowPos))))
ElIf UT_OutputMode == UT_ExStyleBits then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgExStyleBits_L,
		ConvertIntToHexDisplayString(GetWindowExStyleBits(hHomeRowPos))))
ElIf UT_OutputMode == UT_Owner then
	let s = GetWindowOwner(hHomeRowPos)
	if s then
		let s = StringSegment(s,cScDoubleBackSlash,StringSegmentCount(s,cScDoubleBackSlash))
	EndIf
	ShowInViewer(FormatString(msgInfoInViewer,msgOwner_L,s))
ElIf UT_OutputMode == UT_REALNAME then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgRealName,
		GetWindowName(GetRealWindow(hHomeRowPos))))
ElIf UT_OutputMode == UT_WINDOWNAME then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgWindowName_L,
		GetWindowName(hHomeRowPos)))
ElIf UT_OutputMode == UT_WINDOWTEXTRESTRICTED then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgTextRestricted,
		GetWindowTextEx(hHomeRowPos,0,0)))
ElIf UT_OutputMode == UT_WINDOWTEXTINCLUSIVE then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgTextInclusive,
		GetWindowTextEx(hHomeRowPos,0,1)))
ElIf UT_OutputMode == UT_HotKey then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgHotKey,GetHotKey(hHomeRowPos)))
ElIf UT_OutputMode == UT_HIGHLIGHTEDTEXT then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgHighlightedText,
		GetWindowTextEx(hHomeRowPos,1,0)))
ElIf(UT_OutputMode == UT_SAYTYPEANDTEXT) then
	ShowInViewer(FormatString(msgInfoInViewer,
		msgTypeAndText_S,
		GetWindowType(hHomeRowPos)+cscSpace+GetWindowText(hHomeRowPos,0)))
EndIf
EndFunction

void function speakWindowVisibilityIfRequested()
If iHomeRowSpeakWindowVisibility == on then
	UtilitySpeakWindowVisibility()
endIf
EndFunction

void function NotifyIfWinFormsClass()
if iHomeRowNotifyIfWinFormsClass == on then
	If IsWinFormsWindow(hHomeRowPos) then
		SayMessage(ot_help,msgIsWinFormsWindow)
	endIf
EndIf
EndFunction

void function SpeakApplicationAlertOnChange()
If GetAppMainWindow(hHomeRowPos) != GetAppMainWindow(GlobalFocusWindow) then
	If !iHomeRowAppMainWindowAlert then
		let iHomeRowAppMainWindowAlert = 1
		SayFormattedMessage(ot_JAWS_message,msgExitingTreeForCurrentApp_L,msgExitingTreeForCurrentApp_S)
	endIf
else
	If iHomeRowAppMainWindowAlert then
		let iHomeRowAppMainWindowAlert = 0
		SayFormattedMessage(ot_JAWS_message,msgEnteringTreeForCurrentApp_L,msgEnteringTreeForCurrentApp_S)
	endIf
endIf
EndFunction

void function UtilityMoveToSiblingWindow(int sibling, string ErrorMessage)
var
	handle hTemp,
	string sMsgErr
let hTemp = hHomeRowPos
if sibling == sibling_Next then
	let hHomeRowPos = GetNextWindow(hHomeRowPos)
elif sibling == sibling_Prior then
	let hHomeRowPos = GetPriorWindow(hHomeRowPos)
elif Sibling == Sibling_First then
	let hHomeRowPos = GetFirstWindow(hHomeRowPos)
elif Sibling == Sibling_Last then
	let hHomeRowPos = GetLastWindow(hHomeRowPos)
else
	return
EndIf
if hHomeRowPos then
	UtilitySayInfo(FALSE)
	speakWindowVisibilityIfRequested()
	NotifyIfWinFormsClass()
	SpeakApplicationAlertOnChange()
else
	let hHomeRowPos = hTemp
	SayMessage(ot_JAWS_message,ErrorMessage)
EndIf
EndFunction

void function UtilityMoveToNextWindow()
UtilityMoveToSiblingWindow(Sibling_Next,msgNoNextWindow)
EndFunction

void function UtilityMoveToPriorWindow()
UtilityMoveToSiblingWindow(Sibling_Prior,msgNoPriorWindow)
EndFunction

void function UtilityMoveToLastWindow()
UtilityMoveToSiblingWindow(Sibling_Last,msgNoLastWindow)
EndFunction

void function UtilityMoveToFirstWindow()
UtilityMoveToSiblingWindow(Sibling_First,msgNoFirstWindow)
EndFunction

void function UtilityMoveToChild()
var
	handle hTemp
let hTemp = hHomeRowPos
let hHomeRowPos = GetFirstChild(hHomeRowPos)
if (hHomeRowPos) then
	UtilitySayInfo(FALSE)
	speakWindowVisibilityIfRequested()
	NotifyIfWinFormsClass()
	SpeakApplicationAlertOnChange()
else
	let hHomeRowPos = hTemp
	SayFormattedMessage(ot_JAWS_message,msgChildWindowNotFound)
endIf
EndFunction

void function UtilityMoveToParent()
var
	handle hTemp
let hTemp = hHomeRowPos
let hHomeRowPos = GetParent(hHomeRowPos)
if  hHomeRowPos then
	UtilitySayInfo(FALSE)
	speakWindowVisibilityIfRequested()
	NotifyIfWinFormsClass()
	SpeakApplicationAlertOnChange()
else
	let hHomeRowPos = hTemp
	SayFormattedMessage(ot_JAWS_message,msgParentWindowNotFound)
endIf
EndFunction

void function UtilitySetOutputMode()
If UT_OutputMode == UT_SAYTYPEANDTEXT then
	let UT_OutputMode = UT_HANDLE
Else
	let UT_OutputMode = UT_OutputMode + 1
endIf
UtilitySayOutputMode()
EndFunction

void function UtilitySetOutputModeReverseOrder()
If UT_OutputMode == UT_HANDLE then
	let UT_OutputMode = UT_SAYTYPEANDTEXT
Else
	let UT_OutputMode = UT_OutputMode - 1
endIf
UtilitySayOutputMode()
EndFunction

void function UtilityJumpToOutputMode()
If UT_OutputMode < UT_TYPE then
	let UT_OutputMode = UT_TYPE
ElIf UT_OutputMode < UT_REALNAME then
	let UT_OutputMode = UT_REALNAME
else
	let UT_OutputMode = UT_HANDLE
endIf
UtilitySayOutputMode()
EndFunction

void function UtilityJumpToOutputModeReverseOrder()
If UT_OutputMode == UT_HANDLE
|| UT_OutputMode > UT_REALNAME then
	let UT_OutputMode = UT_REALNAME
ElIf UT_OutputMode > UT_TYPE then
	let UT_OutputMode = UT_TYPE
else
	let UT_OutputMode = UT_HANDLE
endIf
UtilitySayOutputMode()
EndFunction


void function UtilitySayOutputMode()
If UT_OutputMode == UT_SAYTYPEANDTEXT then
	SayMessage(ot_status,msgTypeAndText_L,msgTypeAndText_S)
ElIf UT_OutputMode == UT_HANDLE then
	SayMessage(ot_status,msgHandle)
ElIf UT_OutputMode == UT_CONTROLID then
	SayMessage(ot_status,msgControlID_L,msgControlID_S)
ElIf UT_OutputMode == UT_CLASS then
	SayMessage(ot_status,msgClass)
ElIf UT_OutputMode == UT_TYPE then
	SayMessage(ot_status,msgType)
ElIf UT_OutputMode == UT_SUBTYPE then
	SayMessage(ot_status,msgSubtype_L,msgSubtype_S)
ElIf UT_OutputMode == UT_StyleBits then
	SayMessage(ot_status,msgStyleBits_L,msgStyleBits_S)
ElIf UT_OutputMode == UT_ExStyleBits then
	SayMessage(ot_status,msgExStyleBits_L,msgExStyleBits_S)
ElIf UT_OutputMode == UT_Owner then
	SayMessage(ot_status,msgOwner_l,msgOwner_s)
ElIf UT_OutputMode == UT_REALNAME then
	SayMessage(ot_status,msgRealName)
ElIf UT_OutputMode == UT_WINDOWNAME then
	SayMessage(ot_status,msgWindowName_L,msgWindowName_S)
ElIf UT_OutputMode == UT_WINDOWTEXTRESTRICTED then
	SayMessage(ot_status,msgTextRestricted)
ElIf UT_OutputMode == UT_WINDOWTEXTINCLUSIVE then
	SayMessage(ot_status,msgTextInclusive)
ElIf UT_OutputMode == ut_HotKey then
	SayMessage(ot_status,msgHotKey)
ElIf UT_OutputMode == UT_HIGHLIGHTEDTEXT then
	SayMessage(ot_status,msgHighlightedText)
endIf
EndFunction

void function UtilitySetFontMode()
If !UT_FontMode then
	let UT_FontMode = ATTRIB_HIGHLIGHT
endIf
If UT_FontMode == ATTRIB_HIGHLIGHT then
	let UT_FontMode = ATTRIB_BOLD
Else
	If UT_FontMode == ATTRIB_STRIKEOUT then
		let UT_FontMode = UT_FontMode * 4
	Else
		let UT_FontMode = UT_FontMode * 2
	endIf
endIf
If UT_FontMode == ATTRIB_BOLD then
	SayFormattedMessage(ot_status,msgBold)
ElIf UT_FontMode == ATTRIB_ITALIC then
	SayFormattedMessage(ot_status,msgItalic)
ElIf UT_FontMode == ATTRIB_UNDERLINE then
	SayFormattedMessage(ot_status,msgUnderLine)
ElIf UT_FontMode == ATTRIB_HIGHLIGHT then
	SayFormattedMessage(ot_status,msgHighlight)
ElIf UT_FontMode == ATTRIB_STRIKEOUT then
	SayFormattedMessage(ot_status,msgStrikeOut)
endIf
EndFunction

void function UtilityCopyInfo()
var
	int iTemp,
	string sTemp
If UT_OutputMode == UT_SAYTYPEANDTEXT then
	let ClipboardTextChanged = true
	CopyToClipboard(GetWindowType(hHomeRowPos)+cscSpace+GetWindowText(hHomeRowPos, false))
	SayWindowTypeAndText(hHomeRowPos)
ElIf UT_OutputMode == UT_HANDLE then
	let ClipboardTextChanged = true
	if IsSameScript() then
		CopyToClipboard(DecToHex(hHomeRowPos))
		SpellString(DecToHex(hHomeRowPos))
	else
		CopyToClipboard(IntToString(hHomeRowPos))
		SayInteger(hHomeRowPos)
	EndIf
ElIf UT_OutputMode == UT_CONTROLID then
	let iTemp = GetControlID(hHomeRowPos)
	let ClipboardTextChanged = true
	CopyToClipboard(IntToString(iTemp))
	SayInteger(iTemp)
ElIf UT_OutputMode == UT_CLASS then
	let sTemp = GetWindowClass(hHomeRowPos)
	let ClipboardTextChanged = true
	CopyToClipboard(sTemp)
	Say(sTemp, ot_help)
ElIf UT_OutputMode == UT_TYPE then
	let sTemp = GetWindowType(hHomeRowPos)
	let ClipboardTextChanged = true
	CopyToClipboard(sTemp)
	Say(sTemp, ot_help)
ElIf UT_OutputMode == UT_SUBTYPE then
	let iTemp = GetWindowSubTypeCode(hHomeRowPos)
	let ClipboardTextChanged = true
	CopyToClipboard(IntToString(iTemp))
	SayInteger(iTemp)
ElIf UT_OutputMode == UT_StyleBits then
	let iTemp = GetWindowStyleBits(hHomeRowPos)
	let sTemp = "0x"+DecToHex(iTemp)
	let ClipboardTextChanged = true
	CopyToClipboard(sTemp)
	SpellString(sTemp)
ElIf UT_OutputMode == UT_ExStyleBits then
	let sTemp = ConvertIntToHexDisplayString(GetWindowExStyleBits(hHomeRowPos))
	let ClipboardTextChanged = true
	CopyToClipboard(sTemp)
	SpellString(sTemp)
ElIf UT_OutputMode == UT_Owner then
	let sTemp = GetWindowOwner(hHomeRowPos)
	if sTemp then
		let sTemp = StringSegment(sTemp,cScDoubleBackSlash,StringSegmentCount(sTemp,cScDoubleBackSlash))
	EndIf
	let ClipboardTextChanged = true
	CopyToClipboard(sTemp)
	Say(sTemp, ot_help)
ElIf UT_OutputMode == UT_REALNAME then
	let sTemp = GetWindowName(GetRealWindow(hHomeRowPos))
	let ClipboardTextChanged = true
	CopyToClipboard(sTemp)
	Say(sTemp, ot_help)
ElIf UT_OutputMode == UT_WINDOWNAME then
	let sTemp = GetWindowName(hHomeRowPos)
	let ClipboardTextChanged = true
	CopyToClipboard(sTemp)
	Say(sTemp, ot_help)
ElIf UT_OutputMode == UT_WINDOWTEXTRESTRICTED then
	let sTemp = GetWindowTextEx(hHomeRowPos,0,0)
	let ClipboardTextChanged = true
	CopyToClipboard(sTemp)
	Say(sTemp, ot_help)
ElIf UT_OutputMode == UT_WINDOWTEXTINCLUSIVE then
	let sTemp = GetWindowTextEx(hHomeRowPos,0,1)
	let ClipboardTextChanged = true
	CopyToClipboard(sTemp)
	Say(sTemp, ot_help)
ElIf UT_OutputMode == ut_HotKey then
	let sTemp = GetHotKey(hHomeRowPos)
	let ClipboardTextChanged = true
	CopyToClipboard(sTemp)
	Say(sTemp, ot_help)
ElIf UT_OutputMode == UT_HIGHLIGHTEDTEXT then
	let sTemp = GetWindowTextEx(hHomeRowPos,1,0)
	let ClipboardTextChanged = true
	CopyToClipboard(sTemp)
	Say(sTemp, ot_help)
endIf
EndFunction

void function UtilitySayWindow()
SayWindow(hHomeRowPos, read_everything)
EndFunction

void function UtilityResetOutputMode()
SayFormattedMessage(ot_JAWS_message,msgOutputModeIs,cmsgSilent)
let UT_OutputMode = UT_SAYTYPEANDTEXT
SayFormattedMessage(ot_status,msgTypeAndText_L,msgTypeAndText_S)
EndFunction

void function UtilitySayWindowPromptAndText()
SayWindowTypeAndText(hHomeRowPos)
EndFunction

void function UtilityRouteJAWSCursorToPc()
var
	int bUtilityModeOff
If UserBufferIsActive() then
	SayFormattedMessage(OT_NO_DISABLE, cmsgVirtualViewer)
	Return
EndIf
if GetWindowName(GetRealWindow(GlobalFocusWindow))==wn_JAWSForWindowsMessageBox then
	let bUtilityModeOff = true
EndIf
If IsInvisibleCursor() then
	if bUtilityModeOff then
		RouteInvisibleToPC()
		BrailleRefresh()
		SayFormattedMessage(OT_STATUS,cmsg146_L, cmsg146_S) ;"Route invisible to p c"
	else
		MoveToWindow(hHomeRowPos)
		SayFormattedMessage(ot_status,msgInvisibleToHomeRow_L,msgInvisibleToHomeRow_S)
	EndIf
else
	JAWSCursor()
	if bUtilityModeOff then
		RouteJAWSToPc()
		JAWSCursor()
		BrailleRefresh()
		SayFormattedMessage(OT_STATUS, cmsg147_L, cmsg147_S) ;"Route JAWS to p c"
	else
		MoveToWindow(hHomeRowPos)
		SayFormattedMessage(ot_status,msgJAWSToHomeRow_L,msgJAWSToHomeRow_S)
	EndIf
endIf
EndFunction

void function UtilityWindowClassReassign()
var
	string TheApp,
	string TheClass,
	string RunIt
let TheApp = GetActiveConfiguration()
let TheClass = GetWindowClass(hHomeRowPos)
ToggleHomeRow()
;cwn2="Invalid Window Handle"
If(TheClass == cwn2) then
	;cwn3="Invalid"
	let TheClass = cwn3
endIf
;RunIt = JConfig.exe -a[Application] + -c[Class Name] + d[Dialog mode]
let RunIt = "\""
	+ GetJAWSDirectory()
	+ "\\"
	+ Utility_SettingsCenter
	+ "\""
	+ cscSpace
	+ FLAG_APP
	+ "\""
	+ TheApp
	+ "\" "
	+ FLAG_CLASS
	+ "\""
	+ TheClass
	+ "\""
	+ cscSpace
	+ FLAG_CLASS_MODE
Run(RunIt)
EndFunction

void function MouseMovementDefault()
var
	string sMessageLong,
	string sMessageShort,
	string sPixel
if UserBufferIsActive() then
	SayCurrentScriptKeyLabel()
	JAWSHome()
	return
EndIf
let GlobalMousePixel = 3
let sPixel = IntToString(GlobalMousePixel)
let sMessageShort = FormatString(msgMousePixelSettingIs_S, sPixel)
let sMessageLong = FormatString(msgMousePixelSettingIs_L, sPixel)
SayFormattedMessage(ot_status, sMessageLong, sMessageShort)
EndFunction

void function MouseMovementDecrement()
if UserBufferIsActive()
|| GetWindowName(GetRealWindow(GlobalFocusWindow))==wn_JAWSForWindowsMessageBox then
	PriorCharacter()
	SayCharacter()
	return
EndIf
If GlobalMousePixel == 1 then
	let GlobalMousePixel = 50
Else
	Let GlobalMousePixel = GlobalMousePixel - 1
endIf
SayInteger(GlobalMousePixel)
EndFunction

void function MouseMovementIncrement()
if UserBufferIsActive()
|| GetWindowName(GetRealWindow(GlobalFocusWindow))==wn_JAWSForWindowsMessageBox then
	NextCharacter()
	SayCharacter()
	return
EndIf
If GlobalMousePixel == 50 then
	let GlobalMousePixel = 1
Else
	Let GlobalMousePIxel = GlobalMousePixel + 1
endIf
SayInteger(GlobalMousePixel)
EndFunction

void function SayMouseAndAnsiSettings()
var
	int nTimesPressed,
	int SpeakAnsi,
	string sMessageShort,
	string sMessageLong,
	string sPixel
if UserBufferIsActive()
|| GetWindowName(GetRealWindow(GlobalFocusWindow))==wn_JAWSForWindowsMessageBox then
	let nTimesPressed=IsSameScript ()
	if (nTimesPressed>=2) then
		SayCharacterValue()
	elif nTimesPressed == 1 then
		SayCharacterPhonetic ()
	else
		SayCharacter()
	EndIf
	return
EndIf
let sPixel = IntToString(GlobalMousePixel)
let sMessageShort = FormatString(msgGlobalMousePixelIs_S,sPixel)
let sMessageLong = FormatString(msgGlobalMousePixelIs_L, sPixel)
SayFormattedMessage(ot_user_requested_information, sMessageLong, sMessageShort)
let SpeakAnsi = GetJcfOption(OPT_SPEAK_ANSI_CHARS)
If SpeakAnsi == 0 then
	let sMessageShort = FormatString(msgANSICharSetting_S,msgNoANSI_S)
	let sMessageLong = FormatString(msgANSICharSetting_L,msgNoANSI_L)
ElIf SpeakAnsi == 1 then
	let sMessageShort = FormatString(msgANSICharSetting_S,msgSomeANSI_S)
	let sMessageLong = FormatString(msgANSICharSetting_L,msgSomeANSI_L)
ElIf SpeakAnsi == 2 then
	let sMessageShort = FormatString(msgANSICharSetting_S,msgMoreANSI_S)
	let sMessageLong = FormatString(msgANSICharSetting_L,msgMoreANSI_L)
ElIf SpeakAnsi == 3 then
	let sMessageShort = FormatString(msgANSICharSetting_S,msgMostANSI_S)
	let sMessageLong = FormatString(msgANSICharSetting_L,msgMostANSI_L)
ElIf SpeakAnsi == 4 then
	let sMessageShort = FormatString(msgANSICharSetting_S,msgAllANSI_S)
	let sMessageLong = FormatString(msgANSICharSetting_L,msgAllANSI_L)
endIf
SayFormattedMessage(ot_user_requested_information, sMessageLong, sMessageShort)
EndFunction

string function AnsiCharsIncrement(int iRetCurVal)
var
	int iSpeakAnsiChars
let iSpeakAnsiChars = GetJcfOption(OPT_SPEAK_ANSI_CHARS)
if not iRetCurVal then
;update it
	If iSpeakAnsiChars == 4 then
		let iSpeakANSIChars=0
	else
		let iSpeakANSIChars=iSpeakANSIChars+1
	endIf
	SetJcfOption(OPT_SPEAK_ANSI_CHARS, iSpeakAnsiChars)
endIf
;now return the value
If iSpeakAnsiChars == 0 then
	return msgNoANSI_L
elIf iSpeakAnsiChars== 1 then
	return msgSomeANSI_L
elIf iSpeakAnsiChars==2 then
	return msgMoreANSI_L
elIf iSpeakAnsiChars == 3 then
	return msgMostANSI_L
elIf iSpeakAnsiChars == 4 then
	return msgAllANSI_L
endIf
EndFunction

void function UtilityAnsiCharsDecrement()
var
	int SpeakAnsiChars
if UserBufferIsActive()
|| GetWindowName(GetRealWindow(GlobalFocusWindow))==wn_JAWSForWindowsMessageBox then
	NextLine()
	SayLine()
	return
EndIf
let SpeakAnsiChars = GetJcfOption(OPT_SPEAK_ANSI_CHARS)
If SpeakAnsiChars == 0 then
	If SetJcfOption(OPT_SPEAK_ANSI_CHARS, 4 ) == WAS_SUCCESSFUL then
		SayFormattedMessage(ot_status,msgAllANSI_L,msgAllANSI_S)
	Else
		SayFormattedMessage(ot_status,msgUnableToChangeJCFOption)
	endIf
Else
	If SetJcfOption(OPT_SPEAK_ANSI_CHARS, SpeakAnsiChars - 1 ) == WAS_SUCCESSFUL then
		If(SpeakAnsiChars-1) == 0 then
			SayFormattedMessage(ot_status,msgNoANSI_L,msgNoANSI_S)
		endIf
		If(SpeakAnsiChars-1) == 1 then
			SayFormattedMessage(ot_status,msgSomeANSI_L,msgSomeANSI_S)
		endIf
		If(SpeakAnsiChars-1) == 2 then
			SayFormattedMessage(ot_status,msgMoreANSI_L,msgMoreANSI_S)
		endIf
		If(SpeakAnsiChars-1) == 3 then
			SayFormattedMessage(ot_status,msgMostANSI_L,msgMostANSI_S)
		endIf
	Else
		SayFormattedMessage(ot_status,msgUnableToChangeJCFOption)
	endIf
endIf
EndFunction

void function UtilityAnsiCharsIncrement()
if UserBufferIsActive()
|| GetWindowName(GetRealWindow(GlobalFocusWindow))==wn_JAWSForWindowsMessageBox then
	PriorLine()
	SayLine()
	return
EndIf
SayFormattedMessage(OT_STATUS, AnsiCharsIncrement(FALSE))
EndFunction

String Function CollectWindowInfo(handle hWnd)
var
	string sWindowBasicInfo,
	string sWindowNameInfo,
	string sWindowHierarchyInfo,
	string sWindowRectInfo,
	string sWindowAttribInfo,
	string sWindowContentInfo,
	handle hParent,
	handle hChild,
	handle hNext,
	handle hPrior
let sWindowBasicInfo = FormatString(msgNodeWindowBasicInfo,
	FormatString(msgHandleInfo,IntToString(hWnd),DecToHex(hWnd)),
	GetWindowClass(hWnd),
	GetWindowType(hWnd),
	IntToString(GetWindowTypeCode(hWnd)),
	IntToString(GetWindowSubtypeCode(hWnd)),
	IntToString(GetConTrolID(hWnd)),
	"0x"+DecToHex(GetWindowStyleBits(hWnd)),
	ConvertIntToHexDisplayString(GetWindowExStyleBits(hWnd)))
let sWindowNameInfo = FormatString(msgNodeWindowNameInfo,
	GetWindowName(hWnd),
	GetHotKey(hWnd))
let hParent = GetParent(hWnd)
let hChild = GetFirstChild(hWnd)
let hNext = GetNextWindow(hWnd)
let hPrior = GetPriorWindow(hWnd)
let sWindowHierarchyInfo = FormatString(msgNodeWindowHierarchyInfo,
	FormatString(msgHandleInfo,IntToString(hParent),DecToHex(hParent)),
	FormatString(msgHandleInfo,IntToString(hChild),DecToHex(hChild)),
	FormatString(msgHandleInfo,IntToString(hPrior),DecToHex(hPrior)),
	FormatString(msgHandleInfo,IntToString(hNext),DecToHex(hNext)),
	IntToString(GetWindowHierarchyX(hWnd)),
	IntToString(GetWindowHierarchyY(hWnd)))
let sWindowRectInfo = FormatString(msgNodeWindowRectInfo,
	IntToString(GetWindowLeft(hWnd)),
	IntToString(GetWindowTop(hWnd)),
	IntToString(GetWindowRight(hWnd)),
	IntToString(GetWindowBottom(hWnd)))
let sWindowAttribInfo = FormatString(msgNodeWindowAttribInfo,
	IntToString(GetControlAttributes()),
	IntToString(HasTitleBar(hWnd)),
	IntToString(IsWindowDisabled(hWnd)),
	IntToString(IsWindowObscured(hWnd)),
	IntToString(IsWindowVisible(hWnd)))
let sWindowContentInfo = FormatString(msgNodeWindowContentInfo,
	GetWindowTextEx(hWnd,1,0),
	GetWindowTextEx(hWnd,0,0),
	GetWindowTextEx(hWnd,0,1))
return
	sWindowBasicInfo+cscBufferNewLine
	+sWindowHierarchyInfo+cscBufferNewline
	+sWindowRectInfo+cscBufferNewLine
	+sWindowAttribInfo+cscBufferNewLine
	+msgDashedLine+cscBufferNewLine
	+sWindowContentInfo+cscBufferNewLine
	+msgAsteriskLine+cscBufferNewLine
EndFunction

handle Function GetRightLeaf(handle root, string ByRef stem, int ByRef leaf, int ByRef level)
;Traverses the tree to find the rightmost leaf
while GetFirstChild(root)
	if !stem
	then ;Begin by setting the path value in the stem:
		let stem = "0"
	else ;Add the next path value to the stem:
		let stem = stem+scTreePathLevelSeparator+IntToString(leaf)
	EndIf
	let level = level+1
	let leaf = 1
	let root = GetFirstChild(root)
	while GetNextWindow(root)
		let leaf = leaf+1
		let root = GetNextWindow(root)
	EndWhile ;Go right to next leaf
EndWhile ;Go down to next level
return root
EndFunction

int function TreeCaptureBufferOverflowWarning(string buffer)
if StringLength(buffer) > MaxTreeCaptureBufferSize then
	Say(msgBufferOverFlowDanger,ot_error)
	return 1
EndIf
return 0
EndFunction

string Function GetTreeInfo(handle hRoot)
var
	int i,
	int iLevel,
	string sPath,
	handle hCurrent,
	string sBuffer
let hCurrent = GetRightLeaf(hRoot,sPath,i,iLevel)
if hCurrent == hRoot then ;root has no children
	let sBuffer = FormatString(msgTreeCapturePathString,"0")+cscBufferNewLine+CollectWindowInfo(hCurrent)
else ;Traverse the tree
	let sBuffer = FormatString(msgTreeCapturePathString,sPath+scTreePathLevelSeparator+IntToString(i))+cscBufferNewLine+CollectWindowInfo(hCurrent)
	while iLevel && hCurrent != hRoot
		if GetPriorWindow(hCurrent) then ;Moving left
			let i = i-1
			let hCurrent = GetRightLeaf(GetPriorWindow(hCurrent),sPath,i,iLevel)
			let sBuffer = FormatString(msgTreeCapturePathString,sPath+scTreePathLevelSeparator+IntToString(i))+cscBufferNewLine+CollectWindowInfo(hCurrent)+sBuffer
		ElIf GetParent(hCurrent) then ;move up one level
			let i = StringToInt(StringSegment(sPath,scTreePathLevelSeparator,iLevel))
			let hCurrent = GetParent(hCurrent)
			let sBuffer = FormatString(msgTreeCapturePathString,sPath)+cscBufferNewLine+CollectWindowInfo(hCurrent)+sBuffer
			let sPath = StringLeft(sPath,StringLength(sPath)-StringLength(StringSegment(sPath,scTreePathLevelSeparator,iLevel))-1)
			let iLevel = iLevel-1
		else ;break out of loop
			let iLevel = 0
			SayString("Non-Euclidian node encountered at "+IntToString(hCurrent)+"\r\n")
		EndIf
		if TreeCaptureBufferOverflowWarning(sBuffer) then
			return cscNull
		EndIf
	EndWhile ;Tree traverse
EndIf ;write tree info to buffer
return sBuffer
EndFunction

void function UtilityTreeCapture()
var
	string sBuffer,
	handle hFocus,
	handle hReal,
	handle hApp,
	handle hTop,
	handle hForeground
let sBuffer = GetTreeInfo(hHomeRowPos)
if !sBuffer then
	return
EndIf
UserBufferDeactivate()
UserBufferClear()
UserBufferAddText(msgTreeCaptureTitle+cscBufferNewLine)
let hFocus = GetFocus()
let hReal = GetRealWindow(hFocus)
let hApp = GetAppMainWindow(hFocus)
let hTop = GetTopLevelWindow(hFocus)
let hForeground = GetForegroundWindow()
UserBufferAddText(FormatString(msgTreeCaptureHeaderText,
	FormatString(msgHandleInfo,IntToString(hFocus),DecToHex(hFocus)),
	FormatString(msgHandleInfo,IntToString(hReal),DecToHex(hReal)),
	FormatString(msgHandleInfo,IntToString(hApp),DecToHex(hApp)),
	FormatString(msgHandleInfo,IntToString(hTop),DecToHex(hTop)),
	FormatString(msgHandleInfo,IntToString(hForeground),DecToHex(hForeground)))
	+cscBufferNewLine)
UserBufferAddText(sBuffer)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferActivate()
JAWSTopOFFile()
SayLine()
EndFunction

void function UtilityNodeCapture()
var
	string sBuffer
SaveCursor()
InvisibleCursor()
let sBuffer = CollectWindowInfo(hHomeRowPos)
UserBufferDeactivate()
UserBufferClear()
UserBufferAddText(msgNodeCaptureTitle+cscBufferNewLine)
UserBufferAddText(sBuffer)
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferActivate()
JAWSTopOFFile()
SayLine()
EndFunction

void function SetFocusToHomeRow()
SetFocus(hHomeRowPos)
EndFunction


void function UtilityShowSDMControls()
var
	int iCtrl,
	int iFocus,
	int iCurrent
let iCtrl = SDMGetFirstControl(hHomeRowPos)
if !iCtrl then
	Say(msgNoSDMControlsFound,ot_error)
	return
EndIf
UserBufferDeactivate()
UserBufferClear()
UserBufferAddText(msgSDMControlsTitle+cscBufferNewLine)
let iFocus = SDMGetFocus(hHomeRowPos)
if iFocus then
	UserBufferAddText(FormatString(msgSDMFocusControlText,IntToString(iFocus)))
EndIf
let iCurrent = SDMGetCurrentControl()
if iCurrent then
	UserBufferAddText(FormatString(msgSDMCurrentControlText,IntToString(iCurrent)))
EndIf
while iCtrl
	UserBufferAddText(cscBufferNewLine+FormatString(msgSDMControlInfoText,
		IntToString(iCtrl),
		IntToString(SDMGetControlSubtypeCode(hHomeRowPos,iCtrl)),
		SDMGetControlName(hHomeRowPos,iCtrl),
		SDMGetControlActiveItem(hHomeRowPos,iCtrl)))
	let iCtrl = SDMGetNextControl(hHomeRowPos,iCtrl)
EndWhile
UserBufferAddText(cscBufferNewLine+msgAsteriskLine+cscBufferNewLine)
UserBufferAddText(msgBufferCloseLink,"UserBufferDeactivate()",msgBufferCloseLink)
UserBufferActivate()
JAWSTopOfFile()
SayAll()
EndFunction

void function SayMenuMode()
var int iMode = GetMenuMode()
if iMode == MenuBar_Active then
	Say(msgMenuBarActive,ot_status)
elif iMode == Menu_Active then
	Say(msgMenuActive,ot_status)
else
	Say(msgNoMenuIsActive,ot_status)
endIf
EndFunction

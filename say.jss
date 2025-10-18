; Copyright 1995 - 2024 by Freedom Scientific, Inc.

Include "HJConst.jsh"
Include "HJGlobal.jsh"
include "MAGCodes.jsh"
include "common.jsm"

const
; JFW.exe constants:
	id_JFWStartUp_voice_rate_slider = 1002,
	id_JFWStartUp_voice_pitch_slider = 1003
globals
	int giCalledFromSayMessageOrSayFormattedMessage,; set to true whenever you call say from either sayMessage or sayFormattedMessage
	int giAppendFlashMessages,
	int giFirstFlashMessage,
; Info for begin/endFlashMessage() text blocks:
;	sStatusMsg: The status message to show with the flash message.
;	sLastStatusMsg: The previous status message (used in handling message backlogs).
;	sMessage: The message to show.
;	ql, qh: Low and high water marks for any message backlogging (ints):
;		qh 0 when no backlogged messages, > 0 otherwise.
;		ql 0 before all deliveries, otherwise index of last delivered message.
;	iSch: The handle for the scheduling of deliverPendingFlashMessage().
;	tiMS: The tenths of a second given to beginFlashMessage().
	collection gcPendingBrailleInfo

;c_FocusableProgressBar is a global defined and created in default.jss:
globals
	collection c_FocusableProgressBar,
	int g_DebugLevel

void function autoStartEvent()
g_DebugLevel = LEVEL_ERROR
let giCalledFromSayMessageOrSayFormattedMessage=0;
let giAppendFlashMessages=FALSE
let giFirstFlashMessage=TRUE
if !gcPendingBrailleInfo then
	let gcPendingBrailleInfo = new collection
endIf
BrailleClearPendingFlashMessages()
endFunction

void function BrailleClearPendingFlashMessages()
if gcPendingBrailleInfo.iSch then
	unscheduleFunction(gcPendingBrailleInfo.iSch)
endIf
collectionRemoveAll(gcPendingBrailleInfo)
let gcPendingBrailleInfo.tiMS = 0
let gcPendingBrailleInfo.sStatusMsg = ""
let gcPendingBrailleInfo.sLastStatusMsg = ""
let gcPendingBrailleInfo.sMessage = ""
let gcPendingBrailleInfo.ql = 0
let gcPendingBrailleInfo.qh = 0
endFunction

void function handleSetBrailleMessageStatusText(string sStatusMsg)
if !gcPendingBrailleInfo.tiMS then
	SetBrailleMessageStatusText(sStatusMsg)
	return
endIf
if gcPendingBrailleInfo.sStatusMsg then
	let gcPendingBrailleInfo.sLastStatusMsg = gcPendingBrailleInfo.sStatusMsg
endIf
let gcPendingBrailleInfo.sStatusMsg = sStatusMsg
endFunction

void function handleBrailleMessage(string sMessage, int iAppend)
; keep from ghosting blank messages:
if stringIsBlank (sMessage) then return endIf
sMessage = FormatString (sMessage)
if !gcPendingBrailleInfo.tiMS then
	BrailleMessage(sMessage, iAppend)
	return
endIf
if iAppend then
	if gcPendingBrailleInfo.sMessage then
		let gcPendingBrailleInfo.sMessage = gcPendingBrailleInfo.sMessage +cscBufferNewline
	endIf
	let gcPendingBrailleInfo.sMessage = gcPendingBrailleInfo.sMessage +sMessage
else
	let gcPendingBrailleInfo.qh = gcPendingBrailleInfo.qh +1
	var int i = gcPendingBrailleInfo.qh
	let gcPendingBrailleInfo["sStatusMsg"+intToString(i)] = gcPendingBrailleInfo.sLastStatusMsg
	let gcPendingBrailleInfo["sMessage"+intToString(i)] = gcPendingBrailleInfo.sMessage
	let gcPendingBrailleInfo.sMessage = sMessage
endIf
endFunction

;Markup API functions
;There's a lot of flexibility by using the builtins,
;But this should be easier.
;Whenever possible, use the SayControlEX function instead.
;But if you're making older scripts compatible with the new Speech Markup features,
;You probably want to use this stuff for ease of use at least.

void Function IndicateControlState (int iType, int nState,optional  string sOptionalText)
var
	int nBehavior,
	string sText
If sOptionalText then
	Let sText = sOptionalText
	Let sText = (smmReplaceSymbolsWithMarkup (sOptionalText))
Else
	Let sText = smmGetStartMarkupForControlState (iType, nState)
EndIf
Say (sText, OT_ITEM_STATE, TRUE)
EndFunction

void Function IndicateControlType (int iType,optional  string sControlName, string sControlText)
var
	int shouldSpeakControlType = ShouldItemSpeak(OT_CONTROL_TYPE),
	int iSpeak,
	string sName,
	string sType,
	string sValue = cscNull,
	string sText = cscNull,;initialize with null to prevent 0 when concatenating two uninitialized strings
	string debugMessage
if iType == WT_DIALOG
&& ! shouldItemSpeak (OT_DIALOG_NAME) then
	let sName = cscNull
elif shouldItemSpeak (OT_CONTROL_NAME) then
	let sName = sControlName
endIf
If sName then
	Let sText = sName
EndIf
if (shouldSpeakControlType)
	sText =	sText + smmGetStartMarkupForControlType(iType)
endIf
;Now we insert the value, say for a list or edit control.
If sControlText then
	sValue = cScSpace + sControlText
Else
	If GlobalMenuMode != 1 then
		sValue = GetWindowText (GetCurrentWindow (), TRUE);That which is highlighted
	EndIf
EndIf
if (shouldSpeakControlType)
	sValue = sValue + smmGetEndMarkupForControlType(iType)
endIf
Let iSpeak = OT_CONTROL_TYPE
If (!shouldSpeakControlType)
	If ! ShouldItemSpeak (OT_CONTROL_NAME) then
		Let iSpeak = OT_TEXT
	Else
		Let iSpeak = OT_CONTROL_NAME
	EndIf
EndIf
Say (sText, iSpeak, TRUE)
Say (sValue, iSpeak, TRUE)
EndFunction

void function BrailleMessageIfNotEmpty (string longMessage, string ShortMessage, int OutputType)
var int shouldBraille = ShouldItemBraille(OutputType)
; Keep Braille from flashing empty messages:
; compensate where short message doesn't exist, should use long message.
; don't check for blank string in case someone sent an empty space instead:
if ! shortMessage then shortMessage = longMessage endIf
if (shouldBraille == message_long && StringIsBlank (longMessage))
|| (shouldBraille == message_short && StringIsBlank (shortMessage)) then
	shouldBraille = OFF
endIf
if ! shouldBraille then return endIf
var string BrailleMessageText
if (shouldBraille == message_long
|| shortMessage == cscNULL) then
	BrailleMessageText = longMessage
elif shouldBraille == message_short then
	BrailleMessageText = shortMessage
endIf
if ! stringIsBlank (BrailleMessageText) then
; Clears up "ghosting" of empty Braille messages:
	var string statusMessage = GetOutputModeName(OutputType,OutputToBrailleDevice)
	handleSetBrailleMessageStatusText(statusMessage)
	handleBrailleMessage(BrailleMessageText,ShouldAppendFlashMessage())
endIf
endFunction

Void Function SayMessage (int iOutputType, string sLong,optional  string sShort, optional int doNotBraille)
var
	int RunningProducts,
	int iMessageVoice,
	int iSpeak,
	string sStatusMsg
let RunningProducts = GetRunningFSProducts()
if RunningProducts & product_JAWS
&& iOutputType==OT_USER_BUFFER then
	if IsObjectNavigationActive()
		SuspendObjectNavigation()
	EndIf
	redirectToUserBuffer(sLong)
	return
endIf
let iMessageVoice =
	iOutputType == OT_POSITION
	|| iOutputType == OT_ITEM_NUMBER
	|| iOutputType == OT_TUTOR
	|| iOutputType == OT_ERROR
	|| iOutputType == OT_TOOL_TIP
Let iSpeak = ShouldItemSpeak (iOutputType)
if RunningProducts & product_JAWS
&& !SayAllInProgress()
&& !doNotBraille then
	BrailleMessageIfNotEmpty (sLong, sShort, iOutputType)
EndIf
If iSpeak == message_off then
	return
EndIf
If iSpeak == message_long
|| sShort == cscNull then
	If iMessageVoice then
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		SayUsingVoice (VCTX_MESSAGE, sLong, iOutputType)
		let giCalledFromSayMessageOrSayFormattedMessage=FALSE
	Else;
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		Say (sLong, iOutputType)
		let giCalledFromSayMessageOrSayFormattedMessage=FALSE
	EndIf
	return
ElIf iSpeak == message_short
&& StringCompare(sShort,cmsgSilent) != 0 then
	If iMessageVoice then
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		SayUsingVoice (VCTX_MESSAGE, sShort, iOutputType)
		let giCalledFromSayMessageOrSayFormattedMessage=FALSE
	Else
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		Say (sShort, iOutputType)
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
	EndIf
	return
EndIf
EndFunction

Void Function SayFormattedMessage (int iOutputType, string sLong,optional  string sShort,
	optional variant p1,optional variant p2,optional variant p3,
	optional variant p4,optional variant p5,optional variant p6,
	optional variant p7,optional variant p8,optional variant p9)
var
	int RunningProducts,
	int iMessageVoice,
	int iSpeak,
	int iBraille,
	string sMessage_long,
	string sMessage_short,
	string sStatusMsg
let RunningProducts = GetRunningFSProducts()
if RunningProducts & product_JAWS
&& iOutputType==OT_USER_BUFFER then
	if IsObjectNavigationActive()
		SuspendObjectNavigation()
	EndIf
	redirectToUserBuffer(sLong)
	return
endIf
sMessage_long = FormatString (sLong,p1,p2,p3,p4,p5,p6,p7,p8,p9)
sMessage_short = FormatString (sShort,p1,p2,p3,p4,p5,p6,p7,p8,p9)
let iMessageVoice =
	iOutputType == OT_POSITION
	|| iOutputType == OT_ITEM_NUMBER
	|| iOutputType == OT_ERROR
	|| iOutputType == OT_TOOL_TIP
Let iSpeak = ShouldItemSpeak (iOutputType)
if RunningProducts & product_JAWS
&& !SayAllInProgress() then
	BrailleMessageIfNotEmpty (sMessage_long, sMessage_short, iOutputType)
EndIf
If iSpeak == message_off then
	return
EndIf
If iSpeak == message_long
|| sShort == cscNull then
	If iMessageVoice then
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		SayUsingVoice (VCTX_MESSAGE, sMessage_long, iOutputType)
		let giCalledFromSayMessageOrSayFormattedMessage=FALSE
	Else
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		Say (sMessage_long, iOutputType)
		let giCalledFromSayMessageOrSayFormattedMessage=FALSE
	EndIf
	return
ElIf iSpeak == message_short
&& StringCompare(sShort,cmsgSilent) != 0 then
	If iMessageVoice then
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		SayUsingVoice (VCTX_MESSAGE, sMessage_short, iOutputType)
		let giCalledFromSayMessageOrSayFormattedMessage=FALSE
	Else
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		Say (sMessage_short, iOutputType)
		let giCalledFromSayMessageOrSayFormattedMessage=FALSE
	EndIf
	return
EndIf
EndFunction

void  Function SayFormattedMessageWithVoice (string voice, int iOutputType, string sLong, optional string sShort,
	optional variant p1,optional variant p2,optional variant p3,
	optional variant p4,optional variant p5,optional variant p6,
	optional variant p7,optional variant p8,optional variant p9)
var
	int iSpeak,
	int iBraille,
	string sStatusMsg
Let iSpeak = ShouldItemSpeak (iOutputType)
if GetRunningFSProducts() & Product_JAWS
&& !SayAllInProgress() then
	BrailleMessageIfNotEmpty (sLong, sShort, iOutputType)
EndIf
If iSpeak == message_off then
	return
EndIf
If iSpeak == message_long
|| sShort == cscNull then
	let giCalledFromSayMessageOrSayFormattedMessage = true
	SayUsingVoice (voice,FormatString(sLong,p1,p2,p3,p4,p5,p6,p7,p8,p9), iOutputType)
	let giCalledFromSayMessageOrSayFormattedMessage = false
	return
ElIf iSpeak == message_short
&& StringCompare(sShort,cmsgSilent) != 0 then
	let giCalledFromSayMessageOrSayFormattedMessage = true
	SayUsingVoice (voice,FormatString(sShort,p1,p2,p3,p4,p5,p6,p7,p8,p9), iOutputType)
	let giCalledFromSayMessageOrSayFormattedMessage = false
	return
EndIf
EndFunction

void function FormattedSayString (string str, variant v1, variant v2, variant v3, variant v4, variant v5, variant v6, variant v7, variant v8, variant v9)
sayString (FormatString (str, v1, v2, v3, v4, v5, v6, v7, v8, v9))
endFunction

void function sayDebugString (string buffer)
sayMessage (OT_DEBUG, buffer)
endFunction

void function FormattedSayDebugString (string buffer, variant p1, variant p2, variant p3, variant p4, variant p5, variant p6, variant p7, variant p8, variant p9)
buffer = formatString (buffer, p1, p2, p3, p4, p5, p6, p7, p8, p9)
sayMessage (OT_DEBUG, buffer)
endFunction

;The following functions are to validate whether the Prompt Manager
; or list item should appear in the Run JAWS Manager, i.e is a prompt valid
;We look for menus, objects, etc.
;The MSAA Window flags are also looked for.
;All helpers will return true if the window is valid, so the main function will return false when they return true.

int Function InMenus (handle hWnd)
;Menus, tool bars, MSOCommandBar Popups, ...
var
	int iSubType
If (GlobalMenuMode > 0) then
	Return TRUE
EndIf
Let iSubType = GetWindowSubTypeCode (hWnd)
If iSubType == WT_CONTEXTMENU ||
iSubType == WT_STARTMENU ||
iSubType == WT_TOOLBAR then
	Return FALSE
EndIf
If StringContains (GetWindowClass (hWnd), cwcMsoCmd) then
	Return TRUE
EndIf
Return FALSE
EndFunction

int Function InOfficeClientArea ()
;Client areas in MS Office
;But let dialogs handle prompts
var
	object oNULL,
	object oObjCheck
If DialogActive () then
	Return FALSE
EndIf
Let oObjCheck = MSOGetMenuBarObject ()
Let oObjCheck = oObjCheck.Application
If oObjCheck then
If ! StringContains (oObjCheck.Application.Name, "Outlook") then
		Let oObjCheck = oNULL
		Return TRUE; In client area
	EndIf
EndIf
Let oObjCheck = oNULL
Return FALSE;
EndFunction

int Function HTMLValidator ()
var
	object oObjCheck,
	object oNULL
If DialogActive () then
	Return FALSE
EndIf
If GetWindowClass (GetCurrentWindow ()) == cwcIEServer then
	Return TRUE;
EndIf
Let oObjCheck = IE4GetCurrentDocument ()
If oObjCheck > oNULL then
	Let oObjCheck = oNULL
	Return TRUE
EndIf
Return FALSE
EndFunction

CONST
	VALID=1,
	INVALID=0


int Function PromptValidator ()
var
	handle hWnd
Let hWnd = GetCurrentWindow ()
If InMenus (hWnd) then
	Return INVALID
EndIf
if ShouldUseCustomLabler(hWnd) then
	return TRUE
endIf
If InOfficeClientArea () then
	Return INVALID
EndIf
If HTMLValidator() then
	Return INVALID
EndIf
Return VALID
EndFunction

Int Function CustomSummaryValidator ()
var
	handle hWnd
Let hWnd = GetCurrentWindow ()
If InMenus (hWnd) then
	Return INVALID
EndIf
if ShouldShowCustomSummary(hWnd) then
	return valid
endIf
return INVALID
EndFunction

void function say(string sMessage, int iOutputType,optional  int iContainsSpeechMarkup)
var
	string sStatusMsg
SayDebugger("Say",sMessage,iOutputType,iContainsSpeechMarkup)
if not giCalledFromSayMessageOrSayFormattedMessage then
	if (ShouldItemBraille(iOutputType)) then
		let sStatusMsg=GetOutputModeName(iOutputType,OutputToBrailleDevice)
		handleSetBrailleMessageStatusText(sStatusMsg)
		handleBrailleMessage(sMessage,ShouldAppendFlashMessage())
	endIf
endIf
builtin::say(sMessage,iOutputType,iContainsSpeechMarkup)
endFunction

void function sayUsingVoice(string sVoice, string sMessage, int iOutputType,optional  int iContainsSpeechMarkup)
var
	string sStatusMsg
SayDebugger("SayUsingVoice",sVoice,sMessage,iOutputType,iContainsSpeechMarkup)
if not giCalledFromSayMessageOrSayFormattedMessage then
	if (ShouldItemBraille(iOutputType)) then
		let sStatusMsg=GetOutputModeName(iOutputType,OutputToBrailleDevice)
		handleSetBrailleMessageStatusText(sStatusMsg)
		handleBrailleMessage(sMessage,ShouldAppendFlashMessage())
	endIf
endIf
builtin::sayUsingVoice(sVoice,sMessage,iOutputType,iContainsSpeechMarkup)
endFunction

Void Function SayMessageWithMarkup (int iOutputType, string sLong, string sShort, optional int doNotBraille)
var
	int RunningProducts,
	int iMessageVoice,
	int iSpeak,
	int iBraille,
	string sStatusMsg
let RunningProducts = GetRunningFSProducts()
if RunningProducts & product_JAWS
&& iOutputType==OT_USER_BUFFER then
	if IsObjectNavigationActive()
		SuspendObjectNavigation()
	EndIf
	; we will add the text to the User Buffer rather than speaking it.
	redirectToUserBuffer(smmStripMarkup(sLong))
	return
endIf
let iMessageVoice =
	iOutputType == OT_POSITION
	|| iOutputType == OT_ITEM_NUMBER
	|| iOutputType == OT_TUTOR
	|| iOutputType == OT_ERROR
	|| iOutputType == OT_TOOL_TIP
Let iSpeak = ShouldItemSpeak (iOutputType)
if RunningProducts & product_JAWS
&& !SayAllInProgress()
&& !doNotBraille then
	let iBraille=ShouldItemBraille(iOutputType)
	if (iBraille) then
		let sStatusMsg=GetOutputModeName(iOutputType,OutputToBrailleDevice)
		handleSetBrailleMessageStatusText(sStatusMsg)
		if iBraille == message_long
		|| sShort == cscNULL then
			handleBrailleMessage(smmStripMarkup(sLong),ShouldAppendFlashMessage())
		elif iBraille == message_short
		&& StringCompare(sShort,cmsgSilent) != 0 then
			handleBrailleMessage(smmStripMarkup(sShort),ShouldAppendFlashMessage())
		endIf
	endIf
EndIf
If iSpeak == message_off then
	return
EndIf
If iSpeak == message_long
|| sShort == cscNull then
	If iMessageVoice then
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		SayUsingVoice (VCTX_MESSAGE, sLong, iOutputType,TRUE)
		let giCalledFromSayMessageOrSayFormattedMessage=FALSE
	Else
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		Say (sLong, iOutputType,TRUE)
		let giCalledFromSayMessageOrSayFormattedMessage=FALSE
	EndIf
	return
ElIf iSpeak == message_short
&& StringCompare(sShort,cmsgSilent) != 0 then
	If iMessageVoice then
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		SayUsingVoice (VCTX_MESSAGE, sShort, iOutputType,TRUE)
		let giCalledFromSayMessageOrSayFormattedMessage=FALSE
	Else
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
		Say (sShort, iOutputType,TRUE)
		let giCalledFromSayMessageOrSayFormattedMessage=TRUE
	EndIf
	return
EndIf
EndFunction

void function BeginFlashMessage(optional int tiMS)
let giFirstFlashMessage=TRUE
let giAppendFlashMessages=TRUE
if tiMS then
	if tiMS < 0 then
		tiMS = 5
	endIf
	gcPendingBrailleInfo.tiMS = tiMS
	if gcPendingBrailleInfo.iSch then
		unscheduleFunction(gcPendingBrailleInfo.iSch)
	endIf
	let gcPendingBrailleInfo.iSch = scheduleFunction("deliverPendingFlashMessage", tiMS)
else
	BrailleClearPendingFlashMessages()
endIf
endFunction

void function EndFlashMessage()
let giFirstFlashMessage=TRUE
let giAppendFlashMessages=FALSE
endFunction

void function deliverPendingFlashMessage()
var
	string sStatusMsg,
	string sMessage,
	int backlogged = (gcPendingBrailleInfo.qh > gcPendingBrailleInfo.ql),
	int delayBetweenDeliveries = 2,
	int i

; Sequence scheduled Flash messages so they don't erase each other.
if BrailleIsMessageBeingShown() then
	let gcPendingBrailleInfo.iSch = scheduleFunction("deliverPendingFlashMessage", delayBetweenDeliveries)
	return
endIf

; Handle any message backlog one message at a time.
if backlogged then
	let gcPendingBrailleInfo.ql = gcPendingBrailleInfo.ql +1
	let i = gcPendingBrailleInfo.ql
	let sStatusMsg = gcPendingBrailleInfo["sStatusMsg"+intToString(i)]
	let sMessage = gcPendingBrailleInfo["sMessage"+intToString(i)]
	collectionRemoveItem(gcPendingBrailleInfo, "sStatusMsg"+intToString(i))
	collectionRemoveItem(gcPendingBrailleInfo, "sMessage"+intToString(i))
else
	let sStatusMsg = gcPendingBrailleInfo.sStatusMsg
	let sMessage = gcPendingBrailleInfo.sMessage
endIf

; Skip blank flash messages.
if stringIsBlank(sMessage) then
	if backlogged then
		let gcPendingBrailleInfo.iSch = scheduleFunction("deliverPendingFlashMessage", delayBetweenDeliveries)
	else
		BrailleClearPendingFlashMessages()
	endIf
	return
endIf

; Send the status text if any, then the message.
if !stringIsBlank(sStatusMsg) then
	setBrailleMessageStatusText(sStatusMsg)
endIf
BrailleMessage(sMessage, False)

if backlogged then
	let gcPendingBrailleInfo.iSch = scheduleFunction("deliverPendingFlashMessage", delayBetweenDeliveries)
else
	BrailleClearPendingFlashMessages()
endIf
endFunction

int function ShouldAppendFlashMessage()
if giAppendFlashMessages==FALSE then
	return FALSE
endIf
if giFirstFlashMessage then
	let giFirstFlashMessage=FALSE
	return FALSE
endIf
return giAppendFlashMessages
endFunction

int function TypeFormattedString(string sString,optional  string sOpt1, string sOpt2, string sOpt3, string sOpt4,
	string sOpt5, string sOpt6, string sOpt7, string sOpt8, string sOpt9)
var
	string s
let s = FormatString(sString,sOpt1,sOpt2,sOpt3,sOpt4,sOpt5,sOpt6,sOpt7,sOpt8,sOpt9)
TypeString(s)
return StringLength(s)
EndFunction

void function SayAll(optional int bUseSayAllSynthesizer)
SayDebugger("SayAll")
if IsZoomTextRunning()
|| (IsMAGicRunning() && GetDefaultJCFOption(OPT_HIGHLIGHT_STYLE)) then
	SetDocumentReadingStartLocation()
EndIf
builtin::SayAll(bUseSayAllSynthesizer)
EndFunction

const
	__HTML_HYPERLINK = "run(%1)",
	_HREF = "<a href="

int Function UserBufferAddTextWithHTML  (string strText,optional  int iAddLineBreak, string sFontName, int iPointSize, int iAttributes, int iTextColor, int iBackgroundColor)
var
	int iLinkAttributes,
	int iLinkTextColor,
	int bAddedToBuffer,
	int bTempAdd,
	int iPTR,
	int iLen,
	int iSubPTR,
	int iSubLen,
	int iLineEnd,
	int bCheckName,
	string sLink,
	string sLinkName,
	string buffer, string result;
let buffer = strText;
;Load parameters if they exist ensure we don't end up with 0 point fonts.
if (stringIsBlank (sFontName)) sFontName = cFont_Aerial endIf
if (! iPointSize) iPointSize = 12 endIf
if (! iBackgroundColor) iBackgroundColor = rgbStringToColor (cColor_White) endIf
iLinkAttributes = ATTRIB_UNDERLINE
iLinkTextColor = rgbStringToColor (cColor_Blue)
		Let iPTR = StringContains (buffer, _HREF)
while (iPTR)
	;first, everything before buffer goes in as is:
	Let result = StringLeft (buffer, iPTR-1)
	;carve off and add nonlink text:
	if result then
		let bTempAdd = UserBufferAddText (result, "", "", sFontName, iPointSize, iAttributes, iTextColor, iBackgroundColor, FALSE)
		if ! bAddedToBuffer then
			let bAddedToBuffer = bTempAdd;
		endIf
		Let buffer = StringChopLeft (buffer, iPTR-1)
		;pointer at starting char:
		let iPTR = 1;
	endIf
	let iLineEnd = stringContains (buffer, "\n")
	;or EOF: string end with no newline, not likely to happen at least with @msg
	;but may on buildup
	if ! iLineEnd then
		let iLineEnd = stringLength (buffer)
	endIf
	;First check to see if this is explicitly a link with no title:
	Let iLen = stringContains (buffer, "/>")
	if iLen then ; move pointer accomodate:
		let iLen = (iLen+2)
	endIf
	if ! (iLen && iLen < iLineEnd) then
	;this link is probably named: <a ... </a>
		let iLen = stringContains (buffer, "</a>")
		if iLen then ; move pointer accomodate:
			Let iLen = iLen+4
		endIf
		if ! (iLen && iLen <= iLineEnd) then
		;someone forgot to close the tag:
			let iLen = iLineEnd
			let bCheckName = FALSE
		else
			let bCheckName = TRUE
		endIf
	endIf
	;userBufferAddText ("bCheckName: "+intToString (bCheckName))
	Let Result = substring (buffer, iPTR, (iLen-iPTR))
	Let iSubPTR = StringContains (result, "=\"");href attribute
	Let iSubLen = StringContains (result, "\">")
	let iSubPTR = (iSubPTR+2)
	;Let iSubLen = (iSubLen-2)
	Let sLink = subString (result, iSubPTR, (iSubLen-iSubPTR))
	if bCheckName then
		Let iSubPTR = iSubLen+2
		Let iSubLen = StringContains (Result, "</a>")
		let sLinkName = subString (result, iSubPTR, (iSubLen-iSubPTR))
	else
		let sLinkName = sLink;
	endIf
	;UserBufferAddText ("and name is: "+sLinkName)
	if sLink then
		Let sLink = formatString (__HTML_HYPERLINK, sLink);make callback:
		let bTempAdd = UserBufferAddText (sLinkName, sLink, sLinkName, sFontName, iPointSize, iLinkAttributes, iLinkTextColor, iBackgroundColor, TRUE)
		if ! bAddedToBuffer then
			let bAddedToBuffer = bTempAdd;
		endIf
	endIf
	;Chop buffer at closing tag or newline:
	if iLen > iLineEnd then
		Let iLen = iLineEnd
	;else;move pointer beyond "</a>" or "/>"
		;if bCheckName then
			;Let iLen = iLen+4
		;else
			;Let iLen = iLen+2
		;endIf
	endIf ; end pointer adjust
	let bTempAdd = FALSE
	Let buffer = StringChopLeft (buffer, iLen)
	;Continue:
	Let iPTR = StringContains (buffer, _HREF)
endWhile
if buffer then
	let bTempAdd = UserBufferAddText (buffer, "", "", sFontName, iPointSize, iAttributes, iTextColor, iBackgroundColor, iAddLineBreak)
	if ! bAddedToBuffer then
		let bAddedToBuffer = bTempAdd;
	endIf
endIf
endFunction

int function sayCell()
SayDebugger("SayCell")
return builtin::sayCell()
EndFunction

void function SayCharacter(optional  int bIncludeMarkup)
SayDebugger("SayCharacter",bIncludeMarkup)
builtin::SayCharacter(bIncludeMarkup)
EndFunction

void function SayCharacterByExample(optional   string sChar)
SayDebugger("SayCharacterByExample",sChar)
builtin::SayCharacterByExample(sChar)
EndFunction

void function SayCharacterPhonetic()
SayDebugger("SayCharacterPhonetic")
builtin::SayCharacterPhonetic()
EndFunction

void function SayChunk()
SayDebugger("SayChunk")
builtin::SayChunk()
EndFunction

int function SayColor(Optional int bSpeakRGB)
SayDebugger("SayColor",bSpeakRGB)
return builtin::SayColor(bSpeakRGB)
EndFunction

int function SayColumnHeader()
SayDebugger("SayColumnHeader")
return builtin::SayColumnHeader()
EndFunction

void function SayControl(handle hWnd)
SayDebugger("SayControl",hWnd)
builtin::SayControl(hWnd)
EndFunction

int function SayControlEx(handle hWnd, optional String strControlName,
	optional String strControlType, optional String strControlState,
	optional String strContainerName, optional String strContainerType,
	optional string strValue, optional String strPosition,
	optional String strDialogText)
SayDebugger("SayControlEx",hWnd,strControlName,strControlType,strControlState,
	strContainerName,strContainerType,strValue,strPosition,strDialogText)
return builtin::SayControlEx(hWnd,strControlName,strControlType,strControlState,
	strContainerName,strContainerType,strValue,strPosition,strDialogText)
EndFunction

int function SayControlExWithMarkup(handle hWnd, optional String strControlName,
	optional String strControlType, optional String strControlState,
	optional String strContainerName, optional String strContainerType,
	optional string strValue, optional String strPosition,
	optional String strDialogText)
SayDebugger("SayControlExWithMarkup",hWnd,strControlName,strControlType,strControlState,
	strContainerName,strContainerType,strValue,strPosition,strDialogText)
return builtin::SayControlExWithMarkup(hWnd,strControlName,strControlType,strControlState,
	strContainerName,strContainerType,strValue,strPosition,strDialogText)
EndFunction

int function SayControlInformation(optional String strControlName,
	optional String strControlType, optional String strControlState,
	optional String strContainerName, optional String strContainerType)
SayDebugger("SayControlInformation",strControlName,
	strControlType,strControlState,strContainerName,strContainerType)
return builtin::SayControlInformation(strControlName,
	strControlType,strControlState,strContainerName,strContainerType)
EndFunction

void function SayField()
SayDebugger("SayField")
builtin::SayField()
EndFunction

int function SayFocusRect(handle hWnd)
SayDebugger("SayFocusRect",hWnd)
return builtin::SayFocusRect(hWnd)
EndFunction

int function SayFocusRects(handle hWnd)
SayDebugger("SayFocusRects",hWnd)
return builtin::SayFocusRects(hWnd)
EndFunction

void function SayFont()
SayDebugger("SayFont")
builtin::SayFont()
EndFunction

int function SayFrame(string sFrameName)
SayDebugger("SayFrame",sFrameName)
return builtin::SayFrame(sFrameName)
EndFunction

int function SayFrameAtCursor()
SayDebugger("SayFrameAtCursor")
return builtin::SayFrameAtCursor()
EndFunction

void function SayFromCursor()
SayDebugger("SayFromCursor")
builtin::SayFromCursor()
EndFunction

/*;this function overwrite causes JAWS to crash when called with a handle:
void function SayInteger(int iNumber, optional int iBase)
SayDebugger("SayInteger",iNumber,iBase)
builtin::SayInteger(iNumber,iBase)
EndFunction
*/

void function SayLine(optional Int iDrawHighlights, optional int bSayingLineAfterMovement)
SayDebugger("SayLine",iDrawHighlights,bSayingLineAfterMovement)
builtin::SayLine(iDrawHighlights,bSayingLineAfterMovement)
EndFunction

void function SayObjectActiveItem(optional int AnnouncePosition)
SayDebugger("SayObjectActiveItem",AnnouncePosition)
builtin::SayObjectActiveItem(AnnouncePosition)
EndFunction

void function SayVirtualRibbonItem()
var
	int iType
let iType = GetObjectSubtypeCode()
if iType == wt_menuBar then
	indicateControlType(wt_TabControl,GetObjectName(SOURCE_CACHED_DATA),cmsgSilent)
elif iType == wt_ComboBox
|| iType == wt_EditCombo
|| iType == wt_edit
|| iType == wt_ReadOnlyEdit
|| iType == wt_MultiLine_edit
|| iType == wt_static
|| iType==WT_SPINBOX then
	builtin::SayObjectTypeAndText()
else
	SayLine()
EndIf
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
var
	string sOwner,
	handle hWnd,
	int iCtrl
SayDebugger("SayObjectTypeAndText",nLevel, includeContainerName)
If InHomeRowMode()
|| !IsPcCursor()
|| UserBufferIsActive() then
	builtin::SayObjectTypeAndText (nLevel, includeContainerName, drawHighLight)
	Return
EndIf
if IsVirtualRibbonActive() then
	SayVirtualRibbonItem()
	return
EndIf
var int subtype = GetObjectSubtypeCode()
if subType == wt_LeftRightSlider then
	let hWnd = GetFocus()
	let sOwner = GetWindowOwner(hWnd)
	if sOwner then
		let sOwner = StringSegment(sOwner,cScDoubleBackSlash,StringSegmentCount(sOwner,cScDoubleBackSlash))
		let sOwner = StringSegment(sOwner,".",1)
		if sOwner == "JFW" then
			let iCtrl = GetControlID(hWnd)
			if iCtrl == id_JFWStartUp_voice_rate_slider
			|| iCtrl == id_JFWStartUp_voice_pitch_slider then
				SayControlEx(hWnd,GetWindowName(GetPriorWindow(GetPriorWindow(hWnd)))+cscSpace+GetWindowName(GetPriorWindow(hWnd)))
				return
			EndIf
		EndIf
	EndIf
elif subtype == wt_ProgressBar
&& nLevel == 0
&& c_FocusableProgressBar
&& CollectionItemExists(c_FocusableProgressBar,"value")
	var string progressBarName = cscNull
	if (CollectionItemExists(c_FocusableProgressBar, "name"))
		progressBarName = c_FocusableProgressBar.name
	endIf
	IndicateControlType(wt_ProgressBar, progressBarName,
		FormatString(cmsgPercentage, c_FocusableProgressBar.value))
	return
EndIf
if nLevel == 1
&& subtype == WT_STATIC
&& GetObjectName(false, 3) == cwn_ShellFolderView
	;do not speak column name when navigating up or down within a column
	Say (GetObjectValue (), OT_LINE)
	return
endIf
if nLevel == 0
&& subtype == WT_UNKNOWN
	sOwner = GetWindowOwner (GetTopLevelWindow (GetFocus()))
	if StringSegment (sOwner, cscDoubleBackslash, -1) == "ResultsViewer.EXE"
		return
	endIf
endIf
builtin::SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
EndFunction

int function SayParagraph(optional int bOnlyUseEditInterfaces)
SayDebugger("SayParagraph",bOnlyUseEditInterfaces)
return builtin::SayParagraph(bOnlyUseEditInterfaces)
EndFunction

void function SayPhraseByExample(optional String phrase)
SayDebugger("SayPhraseByExample",phrase)
builtin::SayPhraseByExample(phrase)
EndFunction

void function SayPromptTypeAndText()
SayDebugger("SayPromptTypeAndText")
SayPromptTypeAndText()
EndFunction

int function SayRowHeader()
SayDebugger("SayRowHeader")
return builtin::SayRowHeader()
EndFunction

int function SaySentence()
SayDebugger("SaySentence")
return builtin::SaySentence()
EndFunction

void function SayString(string sString)
SayDebugger("SayString",sString)
builtin::SayString(sString)
EndFunction

int function SayTextBetween(int left, int right, optional Int CoordinateSystem)
SayDebugger("SayTextBetween",left,right,CoordinateSystem)
return builtin::SayTextBetween(left,right,CoordinateSystem)
EndFunction

void function SayToBottom()
SayDebugger("SayToBottom")
builtin::SayToBottom()
EndFunction

void function SayToCursor()
SayDebugger("SayToCursor")
builtin::SayToCursor()
EndFunction

void function SayToPunctuation()
SayDebugger("SayToPunctuation")
builtin::SayToPunctuation()
EndFunction

void function SayWindow(handle hWnd, int information)
SayDebugger("SayWindow",hWnd,information)
builtin::SayWindow(hWnd,information)
EndFunction

void function SayWindowTypeAndText(handle hWnd)
if !InHomeRowMode() then
	SayDebugger("SayWindowTypeAndText",hWnd)
EndIf
builtin::SayWindowTypeAndText(hWnd)
EndFunction

void function SayWord()
SayDebugger("SayWord")
builtin::SayWord()
EndFunction

void function SDMSayWindowTypeAndText (handle hwnd, int iControl)
if !InHomeRowMode() then
	SayDebugger("SayWindowTypeAndText",hWnd)
EndIf
builtIn::SDMSayWindowTypeAndText (hwnd, iControl)
endFunction

string function FormatOutputMessage(int iOutPutType, int bAddNewLine,
	string sLongMsg, string sShortMsg,
	optional string s1, optional string s2, optional string s3,
	optional string s4, optional string s5, optional string s6,
	optional string s7, optional string s8, optional string s9)
var
	int iSpeak = ShouldItemSpeak(iOutputType),
	string sNewLine
if bAddNewLine then
	let sNewLine = cscBufferNewLine
EndIf
if iSpeak == message_long then
	return FormatString(sLongMsg,s1,s2,s3,s4,s5,s6,s7,s8,s9)+sNewLine
elif iSpeak == message_short then
	return FormatString(sShortMsg,s1,s2,s3,s4,s5,s6,s7,s8,s9)+sNewLine
else
	return cscNull
EndIf
EndFunction

void function UserBufferAddFormattedMessage(string sLongMsg, string sShortMsg,
	optional string s1, optional string s2, optional string s3,
	optional string s4, optional string s5, optional string s6,
	optional string s7, optional string s8, optional string s9)
var
	int iSpeak = ShouldItemSpeak(ot_user_buffer)
if iSpeak == message_long then
	UserBufferAddText(FormatString(sLongMsg,s1,s2,s3,s4,s5,s6,s7,s8,s9))
elif iSpeak == message_short then
	UserBufferAddText(FormatString(sShortMsg,s1,s2,s3,s4,s5,s6,s7,s8,s9))
EndIf
EndFunction

String Function GetDebugLevelName(int level)
var int segmentCount = StringSegmentCount(msgDebugLevelNames, LIST_ITEM_SEPARATOR)
if (level < 0 || level >= segmentCount)
	return FormatString(msgUnknownDebugLevelFormat, level)
elif (level == LEVEL_ALWAYS)
	return msgAlwaysDebugLevel
endIf
var string ret = StringSegment(msgDebugLevelNames, LIST_ITEM_SEPARATOR, level + 1)
if (StringIsBlank(ret))
	ret = FormatString(msgUnknownDebugLevelFormat, level)
endIf
return ret
EndFunction

Void Function ToggleSpeakingOfDebugMessages()
var int currentMode = ShouldItemSpeak(OT_DEBUG)
var string newSetting = ""
var string stateString = ""
if (currentMode)
	newSetting = "0|0|0|Debug Message"
	stateString = cmsgDisabled
else
	newSetting = "1|1|1|Debug Message"
	stateString = cmsgEnabled
endIf
WriteSettingString("OutputModes", "DEBUG", newSetting, FT_CURRENT_JCF, wdSession)
SayFormattedMessage(
	OT_STATUS, msgSpeakingOfDebugMessagesFormat, msgSpeakingOfDebugMessagesFormat,
	stateString)
EndFunction

Void Function SetDebugLevel(int level)
if (level < LEVEL_ALWAYS)
	level = LEVEL_ALWAYS
elif (level > LEVEL_MAX)
	level = LEVEL_SEVERE
endIf
g_DebugLevel = level
SayFormattedMessage(
	OT_STATUS, msgChangeDebugLevelFormat, msgChangeDebugLevelFormat,
	GetDebugLevelName(g_DebugLevel))
EndFunction

Void Function ChangeDebugLevel()
SetDebugLevel(g_DebugLevel + 1)
EndFunction

Int Function ShouldOutputDebugString(int level)
return (level == LEVEL_ALWAYS || level <= g_DebugLevel)
EndFunction

Void Function OutputDebugStringL(string message, int level)
if (!ShouldOutputDebugString(level))
	return
endIf
OutputDebugString(message)
EndFunction

Void Function FormattedOutputDebugString(
	string message,
	optional variant v1, variant v2, variant v3,
	variant v4, variant v5, variant v6,
	variant v7, variant v8, variant v9)
message = FormatString(message, v1, v2, v3, v4, v5, v6, v7, v8, v9)
OutputDebugString(message)
EndFunction

Void Function FormattedOutputDebugStringL(
	string message, int level,
	optional variant v1, variant v2, variant v3,
	variant v4, variant v5, variant v6,
	variant v7, variant v8, variant v9)
if (!ShouldOutputDebugString(level))
	return
endIf
FormattedOutputDebugString(message, v1, v2, v3, v4, v5, v6, v7, v8, v9)
EndFunction

void function SayNotification(collection notificationRuleActions, int outputType, optional int containsSpeechMarkup)
if outputType == ot_tool_tip then
; OT_TOOL_TIP notifications are not stored, so we can just say the message
	SayFormattedMessage(outputType, notificationRuleActions.SpeechActionParameter)
	return
endIf

var int brailleFlashMessageEnabled = FALSE

if StringCompare(notificationRuleActions.BrailleActionType, NotificationProcessing_GlobalActionNoAction) == 0
|| StringCompare(notificationRuleActions.BrailleActionType, NotificationProcessing_BrailleActionShortenFlashMessage) == 0 then
	brailleFlashMessageEnabled = TRUE
	BeginFlashMessage()
endIf

if StringCompare(notificationRuleActions.SpeechActionType, NotificationProcessing_GlobalActionNoAction) == 0
 	|| StringCompare(notificationRuleActions.SpeechActionType, NotificationProcessing_SpeechActionShortenSpeechMessage) == 0 then
 		if !containsSpeechMarkup then
 			SayMessage(outputType, notificationRuleActions.SpeechActionParameter, notificationRuleActions.SpeechActionParameter, TRUE)
 		else
 			SayMessageWithMarkup(outputType, notificationRuleActions.SpeechActionParameter, notificationRuleActions.SpeechActionParameter, TRUE)
 		endIf
elIf StringCompare(notificationRuleActions.SpeechActionType, NotificationProcessing_SpeechActionPlaySound) == 0 then
	PlaySound(notificationRuleActions.SpeechActionParameter)
endIf

if brailleFlashMessageEnabled then
if outputType == OT_SCREEN_MESSAGE then
	; Update Braille display as a help balloon, because screenMessage doesn't show in Braille.
	outputType = OT_HELP_BALLOON
endIf
	BrailleMessageIfNotEmpty(notificationRuleActions.BrailleActionParameter, notificationRuleActions.BrailleActionParameter, outputType)
	EndFlashMessage()
	brailleFlashMessageEnabled = FALSE
endIf
EndFunction

prototype int function OptionalTaskDialog(string windowTitle, string mainInstruction, string content, int commonButtons,
	int iconId, string checkboxText, string option, int defaultValue, optional int fileType, string fileName)

void function DisplayOrSpeakMessage(string title, string message, int outputType, string option,
	optional int doNotBraille, int fileType, string fileName)
var int taskDialogResult = OptionalTaskDialog(title, message, cscNull, TDCBF_OK_BUTTON, TD_INFORMATION_ICON, DoNotShowAgain,
	option, ID_TASK_DIALOG_NOT_DISPLAYED, fileType, fileName)
if (taskDialogResult == ID_TASK_DIALOG_NOT_DISPLAYED)
	SayMessage(outputType, message, message, doNotBraille)
endIf
EndFunction

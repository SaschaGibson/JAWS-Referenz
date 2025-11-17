; Copyright 1995-2024 Freedom Scientific, Inc.
; Freedom Scientific Virtual Cursor support

;This file is divided into three areas:
;HTML Virtual PC support,
;MSAA Virtual PC support
;and the Virtual support that corresponds with the active user buffer.
;The support in these three areas, although similar, has some stark differences.


include "HjConst.jsh"
include "HjGlobal.jsh"
include "common.jsm"
include "ie.jsh"
include "ie.jsm"
use "IECustomSettings.jsb" ;Personalize Web Settings feature.
;The following imports help Script Manager compile properly, even though scompile works:
import "say.jsd" ; for function FormatOutputMessage
import "default.jsd" ; for TurnOffFormsMode and TurnOnFormsMode
import "FSXMLDomFunctions.jsb"

const
	NoItemForNavigation = 0xffff ;pass to NotifyNavigationFailed when there are no items to move to

GLOBALS
; SmartNav max level as read from file:
	int g_smartNavMax,
	int GiPrevHTMLRefresh,
	int GIPrevActiveContentRefresh,;Both these for Refresh Options in the Verbosity List Box
	int GICycleSettingOptions,
	int GIPrevSetting,
	int GIVirtualHook,
	int GIOption,
	collection reservedWebAppKeys, ; for Web App Reserved Keys feature
;for storing current position before jumping to line or table cell:
	int giJumpReturnLine,
	int giPrevJumpReturnLine,
	int giJumpReturnTableCol,
	int giPrevJumpReturnTableCol,
	int giJumpReturnTableRow,
	int giPrevJumpReturnTableRow

;For the Vispero Connected feature:
globals
	string VisperoConnectedLink

; InTable is true if the virtual cursor is on the table start/end string, caption, or in a table cell.
; We Use the following constants for distinguishing when the cursor is in these various locations of a table:
const
	InHTMLTable_Unknown = 0xffff,  ;we hit an unexpected scenario, we can't find a table tag in the hierarchy.
	InHTMLTable_False = 0,  ;Not in a table.
	InHTMLTable_Normal = 1,  ;On a cell in the table.
	InHTMLTable_StartOrEnd = 2,  ;On a table start or end string where we can get the table index.
	InHTMLTable_End = 3,  ;On a table end string, where we cannot get the table index.
	InHTMLTable_Caption = 4  ;On the table caption.


void function VirtualStart ();Autostart
Let GiPrevHTMLRefresh = -2
Let GIPrevActiveContentRefresh = -2
Let GICycleSettingOptions = -2
Let GIPrevSetting = -2
Let GIVirtualHook = 0
Let GIOption = -2
let giLastDocumentLoadTime=0
let giLastFormsModeState=-1 ; invalid state
EndFunction

void function UpdateVirtualGlobals ()
If GiPrevHTMLRefresh == -2 then
	Let GiPrevHTMLRefresh = GetJcfOption (optPageRefreshFilter)
EndIf
If GIPrevActiveContentRefresh == -2 then
	Let GIPrevActiveContentRefresh = GetJcfOption (OPT_VIRTUAL_MSAA_REFRESH_RATE)
EndIf
EndFunction

void function VirtualSayAllStops ()
;Add code for when the Virtual PC cursor stops a SayAll,
;Processed by the SayAllStoppedEvent function
;For insert b
If gIVirtualDialogInsertB then
	Let gIVirtualDialogInsertB = FALSE
	RouteVirtualToPC ()
EndIf
EndFunction

void function UpdateReservedWebAppKeysCollection ()
var
	string reservedKeysString = GetReservedKeystrokes (),
	string item, int i, int segmentCount = StringSegmentCount (reservedKeysString, "\n");
;if ! ReadSettingInteger (SECTION_OPTIONS, hKey_AllowWebAppReservedKeystrokes, 0, FT_CURRENT_JCF, rsStandardLayering) then
if ! GetJCFOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES) then
	CollectionRemoveAll (reservedWebAppKeys)
	reservedWebAppKeys = null ()
	return FALSE 
endIf 
if (reservedWebAppKeys != null ()
|| CollectionItemCount (reservedWebAppKeys)) then
	CollectionRemoveAll (reservedWebAppKeys)
else
	reservedWebAppKeys = new collection
endIf
for i=1 to SegmentCount
	item = stringSegment (reservedKeysString, "\n", i)
	var string s1 = stringSegment (item, ":", 1)
	var string s2 = stringSegment (item, ":", 2)
	s1 = StringTrimLeadingBlanks (StringTrimTrailingBlanks (s1))
	s2 = StringTrimLeadingBlanks (StringTrimTrailingBlanks (s2))
	if stringLength (s1) && stringLength (s2) then
		reservedWebAppKeys[s1] = s2
	endIf
EndFor
endFunction

int function IsKeystrokeReserved (string Keystroke)
;if ! ReadSettingInteger (SECTION_OPTIONS, hKey_AllowWebAppReservedKeystrokes, 0, FT_CURRENT_JCF, rsStandardLayering) then return FALSE endIf
if ! GetJCFOption (OPT_ALLOW_WEB_APP_RESERVED_KEYSTROKES) then return EndIf
if IsKeystrokeReservedByApp (Keystroke) then
	return TRUE
else
	Return FALSE
endIf
endFunction

int function ProcessKeystrokeAsReserved (string Keystroke)
if IsKeystrokeReserved (Keystroke) then
	TypeKey (Keystroke)
	return TRUE
else
	return FALSE
endIf
endFunction

string function GetKeyboardHelpForReservedKey (string Keystroke)
if IsKeystrokeReserved (Keystroke) then
	if CollectionItemExists (reservedWebAppKeys, keystroke) then
		return reservedWebAppKeys[keystroke]
	endIf
else
	return cscNull
endIf
endFunction

;---------------------------------------------------------------------------
;Virtual code that corresponds to the IE DOM

void function SayQuickKeynavigationNotAvailable()
SayMessage(OT_ERROR,cmsgFeatureRequiresVirtualCursor_L,cmsgFeatureRequiresVirtualCursor_S)
EndFunction

void function RestoreFormsMode(int formsMode)
;if it was temporarily toggled off,
;silently turns it back on.
if FormsMode
	TurnOnFormsMode (FormsModeEventSpeechSilent)
endIf
endFunction

int function VirtualViewerFeatureAvailable(int bJAWSRequired,
	int bQuickNavFeature,
	optional int bShowInHJDialog)
; This function is now obfuscated, and use of it should be retired.
; We now use the function QuickNavFeatureUnavailable to test default conditions for determining if a feature is unavailable.
;
;All Quick Navigation Keys are now included in both JAWS and MAGic, except for PlaceMarkers:
if bJAWSRequired
&& !(GetRunningFSProducts() & product_JAWS|product_MAGic) then
	return false
EndIf
if bShowInHJDialog
&& InHJDialogError()
	return false
endIf
if bQuickNavFeature
	if !IsVirtualPCCursor() && !IsFormsModeActive ()
		SayQuickKeynavigationNotAvailable()
		return false
	EndIf
endIf
return true
endFunction

int function QuickNavFeatureUnavailable()
if InHJDialogError() return true endIf
; for web applications who "borrow" quick navigation keys:
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) return true endIf
var int FormsMode = IsFormsModeActive ()
if FormsMode
	TurnOffFormsMode (FormsModeEventSpeechSilent)
EndIf
var int VirtualCursor = IsVirtualPCCursor()
if !VirtualCursor
	SayQuickKeynavigationNotAvailable()
	RestoreFormsMode(FormsMode)
	return true
EndIf
return false
endFunction

string function GetScreenSensitiveHelpVirtualDocumentGeneral()
return FormatString(cmsgScreenSensitiveHelpVirtualDocumentGeneral)
EndFunction

Void Function AddIENavigationKeystrokes ()
;For adding IE navigation keystrokes and other information to screen sensitive help.
UserBufferAddText (cscBufferNewLine+GetScreenSensitiveHelpVirtualDocumentGeneral(),
	cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
if GetActiveConfiguration() == config_IE then
	UserBufferAddText(cscBufferNewLine+FormatString(cmsgScreenSensitiveHelpIERSSFeed),
		cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndIf
UserBufferAddText(cscBufferNewLine+FormatString(cmsgScreenSensitiveHelpVirtualDocumentForMoreHelp),
	cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
UserBufferAddText (cScBufferNewLine); Put a blank line in to ensure accurate spacing in the buffer
UserBufferAddText (FormatString(cMsgHotKeysLink), cFuncHotKey, FormatString(cMsgHotKeysFunc),
	cFont_Aerial, 12, ATTRIB_UNDERLINE, rgbStringToColor(cColor_BLUE), rgbStringToColor(cColor_White))
UserBufferAddText (cMsgBuffExit, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndFunction

Void Function AddTextToString(string ByRef str1, string str2)
If str2 != cScNull then
	let str1 = str1 + cScBufferNewLine + str2
EndIf
EndFunction

void Function SayNumOfObjects ()
var
	object doc,
	object window,
	object forms,
	object frames,
	int nFrames,
	int nForms,
	int nLinks,
	int nHeadings,
	int nLevel,
	string sFrameNum,
	string sLinkNum,
	string sHeadingNum,
	string sFormNum,
	string szPageName,
	string strBuffer,
	string strBufferShort,
	string strTemp
let doc = ie4GetCurrentDocument ()
let window = doc.parentWindow
if doc then
	let frames = window.frames
	let nFrames = GetHTMLFrameCount()
	if IsVirtualPcCursor() then
		let nLinks = GetLinkCount ()
	else
		let nLinks = doc.links.length
	EndIf
	let forms = doc.forms
	let nForms = forms.length
	if nFrames > 0 then
		if nFrames == 1 then
			let sFrameNum = FormatString (msgFrame1_L, IntToString (nFrames))
		else
			let sFrameNum = FormatString (msgFrames1_L, IntToString (nFrames))
		EndIf
	else
		let sFrameNum = cscNull
	EndIf
	if nLinks == 0 then
		let sLinkNum = msg1_L
	EndIf
	if nLinks > 0 then
		if nLinks == 1 then
			let sLinkNum = FormatString (msgNumLink1_L, IntToString (nLinks))
		else
			let sLinkNum = FormatString (msgNumLinks1_L, IntToString (nLinks))
		EndIf
	EndIf
	if nForms > 0 then
		if nForms == 1 then
			let sFormNum = FormatString (msgForm1_L, IntToString (nForms))
		else
			let sFormNum = FormatString (msgForms1_L, IntToString (nForms))
		EndIf
	else
		let sFormNum = cscNull
	EndIf
EndIf
if window then
	let strTemp = window.name
	if !strTemp then
		let strTemp = window.location.href
	EndIf
EndIf
if StringLength (StrTemp) > 0
&& ShouldItemSpeak(ot_help) > 0 then
	let szPageName = FormatString (msgAddress1_L, strTemp)
else
	let szPageName = cscNull
EndIf
let nHeadings = GetHeadingCount(0)
if nHeadings then
	if nHeadings == 1 then
		let sHeadingNum =msgHeadingsDesc1
	else
		let sHeadingNum = FormatString (msgHeadingsDescMultiple, IntToString (nHeadings))
		let nLevel=1
		while nLevel <= 6
			let nHeadings = GetHeadingCount(nLevel)
			if nHeadings then
				let sHeadingNum=sHeadingNum+cScBufferNewLine
					+formatString(msgHeadingsDescAtLevel, intToString(nHeadings), intToString(nLevel))
			EndIf
			let nLevel = nLevel+1
		endWhile
	EndIf
else
	let sHeadingNum = cscNull
EndIf
let strBuffer = FormatString (msgCurContains1_L, sFrameNum, sLinkNum, sFormNum, sHeadingNum, szPageName)
let strBufferShort = FormatString (msgCurContains1_S, sFrameNum, sLinkNum, sFormNum, sHeadingNum, szPageName)
SayMessage(ot_no_disable, strBuffer, strBufferShort)
EndFunction

string function GetWebAppReservedKeysAndActions ()
var
	string key,
	string buffer
ForEach key in reservedWebAppKeys
; output should be "action: keystroke",
; each item on a new line, so as to conform with HotKeyHelp.
	buffer = buffer + formatString (cmsgReservedWebAppKeyAndAction, reservedWebAppKeys[key], key)+cscBuffernewLine
EndForEach
return Buffer
EndFunction

String Function GetNumOfPageElements ()
var
	object doc,
	object window,
	object forms,
	object frames,
	string sHeadingNum,
	string sFrameNum,
	string sFormNum,
	string sLinkNum,
	string sZPageName,
	string strTemp,
	string sTemp_L,
	string sTemp_S,
	int nFrames,
	int nForms,
	int iLinkCount,
	int iHeadingCount,
	int nLevel,
	int glanceHighlightCount,
	string SmartGlanceMsg
 
;For tables and lists.
;No matter what, we want to speak the correct items here:
If InTable () then
	Let sTemp_l = sTemp_l+GetScreenSensitiveHelpForVirtualCursorTable() + cScBufferNewLine
EndIf
If InList () then
	Let sTemp_l = sTemp_l + GetScreenSensitiveHelpForVirtualCursorList() + cScBufferNewLine
EndIf
let doc = ie4GetCurrentDocument ()
let window = doc.parentWindow
If doc then
	If isVirtualPCCursor () then
		let iLinkCount=getLinkCount()
	Else
		let iLinkCount = doc.links.count
	EndIf
	if iLinkCount > 1 then
		let sLinkNum = formatString(msgPageHasNLinks, intToString(iLinkCount))
	elif iLinkCount==1 then
		let sLinkNum = msgPageHasOneLink
	else ; no links
		let sLinkNum = msgPageHasNoLinks
	endIf
	let forms = doc.forms
	let nForms = forms.length
	if nForms > 0 then
		if nForms == 1 then
			let sFormNum = FormatString (msgFormsOnPage1_L, IntToString (nForms))
		else
			let sFormNum = FormatString (msgFormsOnPage_L, IntToString (nForms))
		EndIf
	else
		let sFormNum = cScNull
	EndIf
	let nFrames = GetHTMLFrameCount()
	if nFrames > 0 then
		if nFrames == 1 then
			let sFrameNum = msgFramesOnPage1_l
		Else
			let sFrameNum = FormatString (msgFramesOnPage_L, IntToString (nFrames))
		EndIf
	else
		let sFrameNum = cScNull
	EndIf
EndIf
let iHeadingCount = GetHeadingCount(0)
if iHeadingCount then
	if iHeadingCount == 1 then
		let sHeadingNum = msgHeadingsDesc1
	else
		let sHeadingNum = FormatString (msgHeadingsDescMultiple, IntToString (iHeadingCount))
		let nLevel=1
		while nLevel <= 6
			let iHeadingCount = GetHeadingCount(nLevel)
			if iHeadingCount then
				let sHeadingNum=sHeadingNum+cScBufferNewLine+formatString(msgHeadingsDescAtLevel, intToString(iHeadingCount), intToString(nLevel))
			EndIf
			let nLevel=nLevel+1
		endWhile
	EndIf
else
	let sHeadingNum = cscNull
endIf
let glanceHighlightCount=GetCountOfGlanceHighlights()
if glanceHighlightCount > 0 then
			let SmartGlanceMsg=formatString(cmsgSmartGlanceHighlightIndicate_L, IntToString(glanceHighlightCount))
endIf


if window then
	;removed window.name since it tends to return useless information
	let strTemp = window.location.href
EndIf
if StringLength (StrTemp) > 0 then
	let sZPageName = FormatString (msgPageAddress_L, strTemp)
else
	let szPageName = cScNull
EndIf
if sLinkNum then
	let sTemp_l = sTemp_l + sLinkNum
endIf
AddTextToString (sTemp_l, sHeadingNum)
AddTextToString (sTemp_l, sFormNum)
AddTextToString (sTemp_l, sFrameNum)
if SmartGlanceMsg!=cscNull then
AddTextToString (sTemp_l, SmartGlanceMsg)
endIf

AddTextToString (sTemp_l, sZPageName)
return sTemp_l
EndFunction

Void Function AddNumOfPageElements (string sPageElements)
;This function is currently not used anywhere.
UserBufferAddText (cScBufferNewLine); Put a blank line in to ensure accurate spacing in the buffer
UserBufferAddText (sPageElements, cScNull, cScNull, cFont_Aerial, 12, 0, rgbStringToColor(cColor_BLACK), rgbStringToColor(cColor_White))
EndFunction

void function runVisperoConnectedLink()
run(VisperoConnectedLink)
EndFunction

void function AnnounceVisperoConnectedLinkForPageLoad ()
if stringIsBlank (GetVisperoConnectedLink()) return endIf
SayUsingVoice (vctx_message, 
formatString (VisperoConnectDocLoadMsg), OT_SCREEN_MESSAGE)
endFunction

void function AddVisperoConnectedLink()
VisperoConnectedLink = GetVisperoConnectedLink()
if !VisperoConnectedLink
	return
endIf
UserBufferAddText (VisperoConnectMsg, "runVisperoConnectedLink()", VisperoConnectMsg,
	"Britannic Bold", 12, ATTRIB_UNDERLINE, rgbStringToColor(cColor_BLUE), rgbStringToColor(cColor_White))
EndFunction

Void Function SayNumOfPageElements ()
UserBufferClear ()
if collectionItemCount (reservedWebAppKeys) then
	; This is just a message without number of items, to alert user to use HotKeyHelp to get the actions for web application keys.
	UserBufferAddText (FormatString (cmsgReservedWebAppKeyAndActionScreenSensitiveHelp)+cscBufferNewLine)
endIf
UserBufferAddText (GetNumOfPageElements ())
AddVisperoConnectedLink()
AddIENavigationKeystrokes ()
UserBufferActivate ()
JAWSTopOfFile ()
SayAll ()
return
EndFunction

void function SayInLineObject()
; In some virtual apps such as Lotus Notes, the object is the document.
if GetJcfOption(optHTMLDocumentPresentationMode) 
|| g_smartNavMax > 0 then
	SayObjectTypeAndText()
else
	SayLine()
EndIf
EndFunction

void function SpeakAfterMoveToField()
SayObjectTypeAndText (0)
EndFunction

int function FormControlExists()
if StringLength (GetListOfFormFields()) > 0
	return true
elif IsVirtualUIAPCCursor() 
	return FormControlAvailableForVirtualUIA()
endIf
return false
EndFunction

void function ProcessMoveToField(int MoveDirection)
var
	int bJAWSRequired
let bJAWSRequired = !(MoveDirection == s_Next || MoveDirection == s_Prior)
if !VirtualViewerFeatureAvailable(bJAWSRequired,true) then
	return
EndIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if !FormControlExists()
	NotifyNavigationFailed(NoItemForNavigation, CVMSGFormField)
	Return
EndIf
if MoveToFormField(MoveDirection) then
	SpeakAfterMoveToField()
else
	NotifyNavigationFailed(MoveDirection,CVMSGFormField)
EndIf
EndFunction

void function FocusToFirstField ()
ProcessMoveToField(s_Top)
EndFunction

void function FocusToNextField ()
ProcessMoveToField(s_Next)
EndFunction

void function FocusToPriorField ()
ProcessMoveToField(s_Prior)
EndFunction

void function FocusToLastField ()
ProcessMoveToField(s_Bottom)
EndFunction

void Function ReportLinksNotAvailable(optional int reason)
If product_MAGic == GetRunningFSProducts()
; Now we are causing MAGic to post dialogs only if speech is disabled:
&& isSpeechOff () then
	/* Do not present the MAGic user who just clicked on the Links List button in the MAGic UI with
	the details about no links versus not a virtual document.  If the running product is
	MAGic use a message box instead of speech and simply report that links are not available. Note
	that if JAWS and MAGic are running together this function will report the error in the same
	manner that JAWS always has, whether or not the user used the script or pressed the Links
	button in the MAGic UI.  This function makes no attempt to determine how the SelectALinkDialog
	function got called and respond differently depending on how the function was called.  This is
	because there is historical precedence for using the JAWS response when MAGic and JAWS are
	running together and the JAWS response differs from the MAGic response. */
	ExMessageBox(cmsgMagNoLinks_L, SelectALinkDialogName, MB_OK|MB_ICONINFORMATION)
	return
EndIf
If (NotAvailableReason_NotVirtualDocument == reason)
	SayQuickKeynavigationNotAvailable()
ElIf (NotAvailableReason_NotFound == reason)
	sayFormattedMessage(ot_error, cmsgNoLinks)
EndIf
EndFunction

Int Function SelectALinkInUserBuffer ()
if !UserBufferIsActive() return false endIf
if !dlgListOfLinks() then
	ReportLinksNotAvailable(NotAvailableReason_NotFound)
	Return TRUE; True that we were in a user buffer.
EndIf
Pause ()
UserBufferActivate() ; handle reactivation after loss of focus
If UserBufferIsActive () then
	sayLine() ; speak the line containing the cursor
EndIf
Return TRUE
EndFunction

int function SelectALinkDialog()
if InHJDialogError() return true EndIf
EnsureManagedVirtualHelpIsInactive()
var
	int originalUseVirtualPCCursorState,
	int newUseVirtualPCCursorState
ManageVirtualPCCursorToggle(originalUseVirtualPCCursorState, newUseVirtualPCCursorState)
var int bFormsModeActive = IsFormsModeActive()
if !IsVirtualPCCursor()
&& !bFormsModeActive then
	ReportLinksNotAvailable(NotAvailableReason_NotVirtualDocument)
	if originalUseVirtualPCCursorState != newUseVirtualPCCursorState
		SetJcfOption (OPT_VIRTUAL_PC_CURSOR, originalUseVirtualPCCursorState)
	endIf
	return true
endIf
If SelectALinkInUserBuffer () then
	if originalUseVirtualPCCursorState != newUseVirtualPCCursorState
		SetJcfOption (OPT_VIRTUAL_PC_CURSOR, originalUseVirtualPCCursorState)
	endIf
	Return true
EndIf
if bFormsModeActive then
	TurnOffFormsMode()
EndIf
If !dlgListOfLinks() then
	ReportLinksNotAvailable(NotAvailableReason_NotFound)
EndIf
if originalUseVirtualPCCursorState != newUseVirtualPCCursorState
	Delay (5)
	SetJcfOption (OPT_VIRTUAL_PC_CURSOR, originalUseVirtualPCCursorState)
EndIf
return true
EndFunction

;The following scripts contain no synopses or description, and are named
;To sound natural as keystrokes
;Because we are trying to get the most natural response, i.e. kill the buffer
;but the user should experience them like standard Windows keys,
;which is what they are.

Script F1 ()
SayCurrentScriptKeyLabel ()
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
TypeCurrentScriptKey ()
EndScript

int function SayAllSpeakUnit(int iSayAllMode, int iSpeakNext)
var
	int nSayAll
Return saSayAllUnsupported
EndFunction

int function HeadingExists()
If GetHeadingCount(0)
	return true
elif IsVirtualUIAPCCursor() 
	return HeadingAvailableForVirtualUIA()
endIf
return false
EndFunction

void function ProcessMoveToHeading(int MoveDirection, optional int nLevel)
if QuickNavFeatureUnavailable() return EndIf
if (nLevel > 6) return endIf
If !HeadingExists()
	NotifyNavigationFailed(NoItemForNavigation,CVMSGHeading)
	Return
EndIf
if MoveToHeading(MoveDirection,nLevel)
	If !SayAllInProgress ()
	|| MoveDirection == s_Top
	|| MoveDirection == s_Bottom
		SayCurrentHeading()
	EndIf
else
	NotifyNavigationFailed(MoveDirection,CVMSGHeading, nLevel)
endIf
EndFunction

void function MoveToNextHeading()
ProcessMoveToHeading(s_Next)
endFunction

void function MoveToPriorHeading()
ProcessMoveToHeading(s_Prior)
endFunction

void function MoveToFirstHeading()
ProcessMoveToHeading(s_Top)
EndFunction

void function MoveToLastHeading()
ProcessMoveToHeading(s_Bottom)
endFunction

void function MoveToNextHeadingLevelN(int nLevel)
ProcessMoveToHeading(s_Next, nLevel)
endFunction

void function MoveToPriorHeadingLevelN(int nLevel)
ProcessMoveToHeading(s_Prior, nLevel)
endFunction

void function MoveToFirstHeadingLevelN(int nLevel)
ProcessMoveToHeading(s_Top, nLevel)
endFunction

void function moveToLastHeadingLevelN(int nLevel)
ProcessMoveToHeading(s_Bottom, nLevel)
EndFunction

void Function ReportHeadingsNotAvailable(optional int reason)
If (product_MAGic == GetRunningFSProducts()
; Now we are causing message boxes only when speech is turned off in MAGic:
&& isSpeechOff ())
	/* Do not confuse the MAGic user who just clicked on the Headings List button in the MAGic UI with
	the boring details about no headings versus not a virtual document.  If the running product is
	MAGic use a message box instead of speech and simply report that headings are not available. Note
	that if JAWS and MAGic are running together this function will report the error in the same
	manner that JAWS always has, whether or not the user used the script or pressed the Headings
	button in the MAGic UI.  This function makes no attempt to determine how the SelectAHeadingDialog
	function got called and respond differently depending on how the function was called.  This is
	because there is historical precedence for using the JAWS response when MAGic and JAWS are
	running together and the JAWS response differs from the MAGic response. */
	ExMessageBox(msgMagNoHeadings_L, SelectAHeadingDialogName, MB_OK|MB_ICONASTERISK)
	return
EndIf
If (NotAvailableReason_NotVirtualDocument == reason)
	SayQuickKeynavigationNotAvailable()
ElIf (NotAvailableReason_NotFound == reason)
	SayMessage(OT_ERROR, msgNoHeadings1_L, msgNoHeadings1_S)
EndIf
EndFunction

Int Function SelectAHeadingInUserBuffer ()
if UserBufferIsActive() then
	if !dlgListOfHeadings() then
		ReportHeadingsNotAvailable(NotAvailableReason_NotFound)
		Return TRUE; True that we were in a user buffer.
	EndIf
	Pause ()
	UserBufferActivate() ; handle reactivation after loss of focus
	If UserBufferIsActive () then
		sayLine() ; speak the line containing the cursor
	EndIf
	Return TRUE
else
	Return FALSE
EndIf
EndFunction

int function SelectAHeadingDialog()
if InHJDialogError() return true EndIf
EnsureManagedVirtualHelpIsInactive()
var
	int originalUseVirtualPCCursorState,
	int newUseVirtualPCCursorState
ManageVirtualPCCursorToggle(originalUseVirtualPCCursorState, newUseVirtualPCCursorState)
var int bFormsModeActive = IsFormsModeActive()
if !IsVirtualPCCursor()
&& !bFormsModeActive then
	ReportHeadingsNotAvailable(NotAvailableReason_NotVirtualDocument)
	if originalUseVirtualPCCursorState != newUseVirtualPCCursorState
		SetJcfOption (OPT_VIRTUAL_PC_CURSOR, originalUseVirtualPCCursorState)
	endIf
	return true
endIf
If SelectAHeadingInUserBuffer () then
  if originalUseVirtualPCCursorState != newUseVirtualPCCursorState
		SetJcfOption (OPT_VIRTUAL_PC_CURSOR, originalUseVirtualPCCursorState)
	endIf
	Return true
EndIf
if bFormsModeActive
	TurnOffFormsMode()
EndIf
if !DlgListOfHeadings() then
	ReportHeadingsNotAvailable(NotAvailableReason_NotFound)
EndIf
if originalUseVirtualPCCursorState != newUseVirtualPCCursorState
	Delay (5)
	SetJcfOption (OPT_VIRTUAL_PC_CURSOR, originalUseVirtualPCCursorState)
EndIf
return true
endFunction

script OnMouseOver ()
SayCurrentScriptKeyLabel ()
ActivateOnMouseOver()
EndScript

Script ControlEnter  ()
SayCurrentScriptKeyLabel ()
TypeCurrentScriptkey ()
EndScript

string function GetGridOrTable()
var
 string s
let s=getElementDescription(10,false);
if stringContains(s, "role=grid") > 0 then
 	return msgGrid
else
 	return msgTable
endIf
endFunction

void function GetTableColumnAndRowCounts(int byRef ColumnCount, int byRef RowCount, int byRef visibleColumnCount, int byRef visibleRowCount)
ColumnCount = GetTableColumnCount()
RowCount = GetTableRowCount()
visibleColumnCount = GetTableVisibleColumnCount()
visibleRowCount = GetTableVisibleRowCount()
EndFunction

void function SayTableOrGridColumnAndRowCountInfo()
var int ColumnCount, int RowCount, int visibleColumnCount, int visibleRowCount
GetTableColumnAndRowCounts(ColumnCount, RowCount, visibleColumnCount, visibleRowCount)
if (ColumnCount <= 0 && RowCount <= 0)
	; Don't announce the table has -1 or 0 columns and rows:
elif (visibleColumnCount <= 0 && visibleRowcount <= 0)
|| (visibleColumnCount == ColumnCount && visibleRowCount == RowCount)
	SayMessage(ot_position,
		FormatString(msgTableDimensions_L,GetGridOrTable(), IntToString(ColumnCount), IntToString(RowCount)),
		FormatString(msgTableDimensions_S, IntToString(ColumnCount), IntToString(RowCount)))
elif visibleColumnCount <= 0
|| visibleColumnCount == ColumnCount
	SayMessage(ot_position,
		FormatString(msgTableDimensionsWithInvisibleRows_L,GetGridOrTable(), IntToString(ColumnCount), IntToString(visibleRowCount), IntToString(RowCount)),
		FormatString(msgTableDimensionsWithInvisibleRows_S, IntToString(ColumnCount), IntToString(visibleRowCount), IntToString(RowCount)))
elif visibleRowcount <= 0
|| visibleRowCount == RowCount
	SayMessage(ot_position,
		FormatString(msgTableDimensionsWithInvisibleColumns_L,GetGridOrTable(), IntToString(visibleColumnCount), IntToString(ColumnCount), IntToString(RowCount)),
		FormatString(msgTableDimensionsWithInvisibleColumns_S,IntToString(visibleColumnCount), IntToString(ColumnCount), IntToString(RowCount)))
else
	SayMessage(ot_position,
		FormatString(msgVisibleTableDimensions_L, GetGridOrTable(), IntToString(visibleColumnCount), IntToString(ColumnCount), IntToString(visibleRowCount), IntToString(RowCount)),
		FormatString(msgVisibleTableDimensions_S, IntToString(visibleColumnCount), IntToString(ColumnCount), IntToString(visibleRowCount), IntToString(RowCount)))
endIf
EndFunction

void function SayTableCaptionAndSummary()
var
	string sCaption,
	string sSummary
BeginFlashMessage()
sCaption = GetTableCaption()
if sCaption
	SayMessage(OT_NO_DISABLE,sCaption)
EndIf
sSummary = GetTableSummary ()
if sSummary
	SayMessage(OT_NO_DISABLE,sSummary)
EndIf
EndFlashMessage()
EndFunction

int function TableExists()
If StringLength (GetListOfTables ()) > 0
	return true
elif IsVirtualUIAPCCursor() 
	return ControlTypeAvailableForVirtualUIA(WT_Table )
endIf
return false
EndFunction

void function ProcessMoveToTable(int MoveDirection)
if QuickNavFeatureUnavailable() return EndIf
If !TableExists()
	NotifyNavigationFailed(NoItemForNavigation,CVMSGTable)
	Return
EndIf
if MoveToTable(MoveDirection)
	if !SayAllInProgress()
		SayTableOrGridColumnAndRowCountInfo()
		SayTableCaptionAndSummary()
		PerformScript SayCell ()
	endIf
else
	NotifyNavigationFailed(MoveDirection,CVMSGTable)
EndIf
EndFunction

void function MoveToFirstTable ()
ProcessMoveToTable(s_Top)
EndFunction

void function MoveToNextTable ()
ProcessMoveToTable(s_Next)
EndFunction

void function MoveToPriorTable ()
ProcessMoveToTable(s_Prior)
EndFunction

void function MoveToLastTable ()
ProcessMoveToTable(s_Bottom)
EndFunction

void Function SayNothingFound (int nDirection)
var
	string sMessage,
	string sDescription,
	int iHLevel
If nDirection == S_NEXT then
	Let sMessage = cmsgNoMoreElements
Else
	Let sMessage = cMsgNoPriorElements
EndIf
let iHLevel = GetCurrentHeadingLevel()
if iHLevel then
	Let sDescription = FormatString(msgHeadingsAtLevelN,IntToString(iHLevel))
else
	Let sDescription = cmsgSameElement
EndIf
Let sMessage = (FormatString (sMessage, sDescription))
SayMessage (OT_ERROR, sMessage)
EndFunction

void function SayElement()
var
	int iObjType
let iObjType = GetObjectSubtypeCode()
if !iObjtype
|| iObjType == wt_Static then
	SayLine()
else
	SayObjectTypeAndText()
EndIf
EndFunction

void function ProcessMoveToElement(int MoveDirection, int bSameType, optional string ErrorMsg)
if QuickNavFeatureUnavailable() return endIf
if StringLength(GetLine()) == 1
&& GetCharacter() == "\n"
	SayMessage(ot_error,msgNotOnAnElement_L,msgNotOnAnElement_S)
	return
EndIf
if bSameType
&& (MoveDirection == s_Top || MoveDirection == s_Bottom)
	MoveToElementOfSameType(MoveDirection)
	SayElement()
	return
endIf
if bSameType
	If !MoveToElementOfSameType(MoveDirection)
		SayNothingFound (MoveDirection)
		return
	endIf
else ;element of different type
	;for MoveToElementOfDifferentType, a true param is used for backwards navigation
	If !MoveToElementOfDifferentType(MoveDirection==s_Prior)then
		SayUsingVoice(vctx_message, ErrorMsg, ot_error)
		return
	EndIf
EndIf
if !SayAllInProgress()
	SayElement()
endIf
EndFunction

void function MoveToFirstSameElement()
ProcessMoveToElement(s_Top, true)
EndFunction

void function MoveToNextSameElement ()
ProcessMoveToElement(s_Next, true)
EndFunction

void function MoveToPriorSameElement ()
ProcessMoveToElement(s_Prior, true)
EndFunction

void function MoveToLastSameElement()
ProcessMoveToElement(s_Bottom, true)
EndFunction

void function MoveToNextDifferentElement ()
ProcessMoveToElement(s_Next, false, cMsgNoMoreDifferences)
EndFunction

void function MoveToPriorDifferentElement ()
ProcessMoveToElement(s_Prior, false, cMsgNoPriorDifferences)
EndFunction

Script DisplayBasicElementInfo ()
Var
	string sText,
	int iValue
if !VirtualViewerFeatureAvailable(true,true) then
	return
EndIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
Let iValue = 1;
Let sText= GetElementDescription (iValue, False)
Let sText = (FormatString (cMsgBasicElementInfo,sText))
SayMessage (OT_USER_BUFFER, sText)
EndScript

Script DisplayAdvancedElementInfo ()
Var
	string sText,
	int iValue
if !VirtualViewerFeatureAvailable(true,true) then
	return
EndIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
Let iValue = 500
Let sText= GetElementDescription (iValue, False)
Let sText = (FormatString (cMsgAdvancedElementInfo,sText))
SayMessage (OT_USER_BUFFER, sText)
EndScript

Script IEFind ()
if !GlobalMenuMode then
	if IsFormsModeActive() then
		TurnOffFormsMode()
	EndIf
	if IsVirtualPCCursor() then
		SayFormattedMessage (ot_ERROR, MSG2_L, cmsgSilent)
		if JAWSFind()
		&& IsVirtualPCCursor () then
			SayLine (2)
		EndIf
		return
	EndIf
EndIf
TypeCurrentScriptKey ()
EndScript

Script IEFindNext ()
if !IsVirtualPCCursor() then
	return
endIf
if IsVirtualPCCursor () then
	;SayFormattedMessage (ot_ERROR, MSG2_L, cmsgSilent)
	if JAWSFindNext () && IsVirtualPCCursor () then
		SayLine ()
	EndIf
	return
else
	;TypeKey (ks6)
	TypeCurrentScriptKey ()
EndIf
EndScript

Script IEFindPrior ()
if !IsVirtualPCCursor() then
	return
endIf
if IsVirtualPCCursor () then
	;SayFormattedMessage (ot_ERROR, MSG2_L, cmsgSilent)
	if JAWSFind(TRUE) && IsVirtualPCCursor () then
		SayLine ()
	EndIf
	return
else
	;TypeKey (ks6)
	TypeCurrentScriptKey ()
EndIf
EndScript

string function HandleRefresh (int iRetCurVal, int iJCFOption)
var
	int iSetting,
	string strSettingName
Let iSetting = GetJcfOption (IJCFOption)
If ! iRetCurVal then
	;Update it
	If iJCFOption == optPageRefreshFilter then
		If GiPrevHTMLRefresh == -1 && iSetting == 0 then;Previously set to automatic
			Let iSetting = -1 ; Set to off
		ElIf GiPrevHTMLRefresh == 0 && iSetting == -1 then;Previously set to off
			Let iSetting = 0 ; Set to automatic
		ElIf iSetting >= 0 then;Turn it off
			Let iSetting = -1
		ElIf iSetting == -1 && !(GiPrevHTMLRefresh > 0) then;Set to Automatic
			Let iSetting = 0
		Else
			Let iSetting = GiPrevHTMLRefresh
		EndIf
	ElIf iJCFOption == OPT_VIRTUAL_MSAA_REFRESH_RATE then
		If GiPrevActiveContentRefresh == -1 && iSetting == 0 then;Previously set to automatic
			Let iSetting = -1 ; Set to off
		ElIf GiPrevActiveContentRefresh == 0 && iSetting == -1 then;Previously set to off
			Let iSetting = 0 ; Set to automatic
		ElIf iSetting >= 0 then;Turn it off
			Let iSetting = -1
		ElIf iSetting == -1 && !(GiPrevActiveContentRefresh > 0) then;Set to Automatic
			Let iSetting = 0
		Else
			Let iSetting = GiPrevActiveContentRefresh
		EndIf
	EndIf
EndIf
;Divide by 1000 to make for easy reading in list box.
If iSetting != -1 then
	Let iSetting = (iSetting/1000)
EndIf
If iSetting == -1 then
	Let strSettingName = cMsg_off ;RefreshOff
ElIf iSetting == 0 then
	Let strSettingName = cMsgRefreshAuto
Else
	Let strSettingName = (FormatString (cMsgXSeconds, IntToString (iSetting)))
EndIf
;Multiply by 1000 to set it back to proper setting before imputting to file.
If iSetting != -1 then
	Let iSetting = (iSetting*1000)
EndIf
SetJcfOption (iJCFOption, iSetting)
Return strSettingName
EndFunction

string Function RefreshHTML (int iRetCurVal)
Return HandleRefresh (iRetCurVal, optPageRefreshFilter)
EndFunction

string function RefreshActiveContent (int iRetCurVal)
Return HandleRefresh (iRetCurVal, OPT_VIRTUAL_MSAA_REFRESH_RATE)
EndFunction

string Function NavigationQuickKeysMode (int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (opt_quick_key_navigation_mode)
If ! iRetCurVal then
	;Update it
	If iOption == 1 then
		Let iOption = 0
	ElIf iOption == 0 then;Special case
		Let iOption = 2
	ElIf iOption == 2 then
		Let iOption = 1
	EndIf
EndIf
SetJcfOption (opt_quick_key_navigation_mode,iOption)
If iOption == 0 then
	Return cmsg_off
ElIf iOption == 1 then
	Return cmsg_on
ElIf iOption == 2 then
	Return cMsgSayAllOnly
EndIf
EndFunction

string Function DocumentPresentationModeToggle(int iRetCurVal)
var
	int iSetting
if IsMAGicRunning() then
	return cMsgNotAvailable
EndIf
Let iSetting = GetJcfOption(optHTMLDocumentPresentationMode)
If ! iRetCurVal then
	;Update it
	Let iSetting = ! iSetting
	SetJcfOption(optHTMLDocumentPresentationMode, iSetting)
EndIf
If iSetting then
	return cmsgDocumentPresentationModeOn_l
else
	return cmsgDocumentPresentationModeOff_l
endIf
EndFunction

string function HTMLFormFieldPromptsRenderingToggle (int iRetCurVal)
;0 favor label tag, 1 favor title attribute, 2 favor alt attribute, 3 favor longest,
;4 use both label and title (if different), 5 use both label and alt (if different)
var
	int iOption
Let iOption = GetJcfOption (optFormFieldPrompts)
If ! iRetCurVal then
	;Update it.
	If iOption == 5 then
		Let iOption = 0
	Else
		Let iOption = iOption + 1
	EndIf
	SetJcfOption (optFormFieldPrompts, iOption)
EndIf
If iOption == 0 then
	Return cMsgLabelTag
ElIf iOption == 1 then
	Return cmsg328_S
ElIf iOption == 2 then
	Return cMsgAltAttribute
ElIf iOption == 3 then
	Return cmsg330_S
ElIf iOption == 4 then
	Return cmsgTitleLabel
ElIf iOption == 5 then
	Return cMsgAltLabel
EndIf
EndFunction

string Function htmlElementAttributeAnnounce (int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption (optIndicateElementAttributes)
If ! iRetCurVal then
	;Update it
	Let iSetting = ! iSetting
	SetJcfOption (optIndicateElementAttributes, iSetting)
EndIf
If iSetting then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

string Function htmlFlashOnWebPagesToggle (int iRetCurVal)
var
	int iSetting
Let iSetting = GetJcfOption (optEmbeddedActiveXSupport)
If ! iRetCurVal then
	;Update it
	Let iSetting = ! iSetting
	SetJcfOption (optEmbeddedActiveXSupport, iSetting)
EndIf
If iSetting then
	return cmsg_on
else
	return cmsg_off
endIf
EndFunction

Script NavigationModeToggle ()
var
	string sMessage
if !VirtualViewerFeatureAvailable(true,true) then
	return
EndIf
Let sMessage = FormatString (cMsgNavigationMode, NavigationQuickKeysMode (FALSE))
SayFormattedMessage (OT_NO_DISABLE, sMessage)
EndScript

void function ProcessMoveToList(int MoveDirection)
if QuickNavFeatureUnavailable() return endIf
if MoveToList(MoveDirection)
	if !SayAllInProgress ()
	|| (MoveDirection == s_Top || MoveDirection == s_Bottom)
		SayLine ()
	EndIf
else
	NotifyNavigationFailed(MoveDirection,CVMSGList)
EndIf
EndFunction

void function MoveToFirstList ()
ProcessMoveToList(s_Top)
EndFunction

void function MoveToNextList ()
ProcessMoveToList(s_Next)
EndFunction

void function MoveToPriorList ()
ProcessMoveToList(s_Prior)
EndFunction

void function MoveToLastList ()
ProcessMoveToList(s_Bottom)
EndFunction

void function ProcessMoveToLink(int MoveDirection, int linkType)
if QuickNavFeatureUnavailable() return endIf
if linkType == VisitedLink
	if !MoveToVisitedLink(MoveDirection)
		NotifyNavigationFailed(MoveDirection,cVMsgVisitedLinks1_L)
		return
	endIf
elif linkType == UnvisitedLink
	if !MoveToUnvisitedLink(MoveDirection)
		NotifyNavigationFailed(MoveDirection,cVMsgUnvisitedLinks1_L)
		return
	endIf
else ;linkType == AnyLink
	if !MoveToAnyLink(MoveDirection)
		NotifyNavigationFailed(MoveDirection,cVMsgLinks1_L)
		return
	endIf
endIf
if !SayAllInProgress()
|| MoveDirection == s_Top
|| MoveDirection == s_Bottom
	SayInLineObject()
endIf
EndFunction

void function MoveToFirstVisitedLink()
ProcessMoveToLink(s_Top, VisitedLink)
endFunction

void function MoveToLastVisitedLink()
ProcessMoveToLink(s_Bottom, VisitedLink)
endFunction

void function MoveToNextVisitedLink()
ProcessMoveToLink(s_Next, VisitedLink)
endFunction

void function MoveToPriorVisitedLink()
ProcessMoveToLink(s_Prior, VisitedLink)
endFunction

void function MoveToFirstUnvisitedLink()
ProcessMoveToLink(s_Top, UnvisitedLink)
endFunction

void function MoveToLastUnvisitedLink()
ProcessMoveToLink(s_Bottom, UnvisitedLink)
endFunction

void function MoveToNextUnvisitedLink()
ProcessMoveToLink(s_Next, UnvisitedLink)
endFunction

void function MoveToPriorUnvisitedLink()
ProcessMoveToLink(s_Prior, UnvisitedLink)
endFunction

void function MoveToAnyFirstLink()
ProcessMoveToLink(s_Top, AnyLink)
endFunction

void function MoveToAnyLastLink()
ProcessMoveToLink(s_Bottom, AnyLink)
endFunction

void function MoveToAnyNextLink()
ProcessMoveToLink(s_Next, AnyLink)
endFunction

void function MoveToAnyPriorLink()
ProcessMoveToLink(s_Prior, AnyLink)
endFunction

void function ProcessMoveToFrame(int MoveDirection, optional int nFrameIndex)
if QuickNavFeatureUnavailable() return endIf
var	int nFrameCount = GetHTMLFrameCount()
If !nFrameCount
	NotifyNavigationFailed(NoItemForNavigation, cvmsgFrames1_L)
	Return
EndIf
if nFrameIndex > nFrameCount
	SayUsingVoice(vctx_message,
		FormatOutputMessage(ot_error, true, msgFrameIndexOutOfRange_L, msgFrameIndexOutOfRange_S,
			IntToString(nFrameIndex),IntToString(nFrameCount)),
		OT_ERROR)
	return
endIf
var int bMoved
if nFrameIndex
	bMoved = MoveToHTMLFrameByIndex(nFrameIndex)
else
	bMoved = MoveToHTMLFrame(MoveDirection)
endIf
if bMoved
	SayLine()
else
	if nFrameIndex
		SayUsingVoice(vctx_message, FormatString(msgMoveToFrameNumberFailed, IntToString(nFrameIndex)), ot_error)
	else
		NotifyNavigationFailed(MoveDirection, cvmsgFrames1_L)
	endIf
endIf
EndFunction

void function MoveToNextFrame()
ProcessMoveToFrame(s_Next)
EndFunction

void function MoveToPriorFrame()
ProcessMoveToFrame(s_Prior)
EndFunction

void function MoveToFirstFrame()
ProcessMoveToFrame(s_Top)
EndFunction

void function MoveToLastFrame()
ProcessMoveToFrame(s_Bottom)
EndFunction

void function MoveToFrameByNumber(int number)
if number == 0 then
	let number = 10
endIf
ProcessMoveToFrame(0, number)
EndFunction

script VirtualSpacebar()
SayCurrentScriptKeyLabel()
if IsVirtualRibbonActive() then
	EnterKey()
else
	LeftMouseButton()
EndIf
endScript

script RouteVirtualToPc()
var
	int bIsVirtualPCCursor
let bIsVirtualPCCursor = IsVirtualPCCursor()
if GetRunningFSProducts() & product_JAWS then
	if !bIsVirtualPCCursor then
		SayQuickKeynavigationNotAvailable()
	else
		SayFormattedMessage(OT_STATUS,cmsgRouteVirtualToPc1_L,cmsgRouteVirtualToPc1_S)
	endIf
endIf
if bIsVirtualPCCursor then
	RouteVirtualToPc()
	SayInLineObject()
endIf
endScript

script RouteVirtualToMouse ()
if IsVirtualPCCursor() then
	RouteVirtualToMouse ()
	SayInLineObject()
endIf
endScript

void function SpeakAfterMoveToControl(int shouldSetFocus, int sayAllInProgress)
if shouldSetFocus
|| sayAllInProgress then
	return
EndIf
SayObjectTypeAndText()
NotifyIfContextHelp ()
EndFunction

int function getSeparatorCount()
var object separatorNodes = GetXMLDomDocNodeList("//Separator")
var object pageBreakNodes = GetXMLDomDocNodeList("//PageBreak")
var int totalNodes = separatorNodes.length + pageBreakNodes.length 
return totalNodes;
EndFunction

int function ControlTypeExists(int iControlType, int bIsFormField)
if bIsFormField && GetListOfFormFields(LIST_ITEM_SEPARATOR,iControlType)
	return true
elif iControlType == wt_separator && getSeparatorCount()
	return true
elif iControlType == WT_MailTo_link && getMailToLinksCount()
	return true
elif IsVirtualUIAPCCursor()
	return ControlTypeAvailableForVirtualUIA(iControlType)
endIf
return false
EndFunction

void function ProcessMoveToControlType(int iControlType, string sElementType,
	int bIsFormField, int bShouldSetFocus, int MoveDirection)
if QuickNavFeatureUnavailable() return endIf
if !ControlTypeExists(iControlType, bIsFormField)
	NotifyNavigationFailed(NoItemForNavigation,sElementType)
	return
endIf
if !MoveToControlType(MoveDirection, iControlType, bShouldSetFocus)
	NotifyNavigationFailed(MoveDirection,sElementType)
	return
endIf
SpeakAfterMoveToControl(bShouldSetFocus, SayAllInProgress())
EndFunction

void function MoveToFirstButton()
ProcessMoveToControlType(wt_button, CVMSGButton1_L, true, false, s_Top)
EndFunction

void function MoveToLastButton()
ProcessMoveToControlType(wt_button, CVMSGButton1_L, true, false, s_Bottom)
EndFunction

void function MoveToNextButton()
ProcessMoveToControlType(wt_button, CVMSGButton1_L, true, false, s_Next)
EndFunction

void function MoveToPriorButton()
ProcessMoveToControlType(wt_button, CVMSGButton1_L, true, false, s_Prior)
EndFunction

void function MoveToNextCheckbox()
ProcessMoveToControlType(wt_checkbox, CVMSGCheckbox1_L, true, UsesFocusChangeDepth(), s_Next)
EndFunction

void function MoveToPriorCheckbox()
ProcessMoveToControlType(wt_checkbox, CVMSGCheckbox1_L, true, UsesFocusChangeDepth(), s_Prior)
EndFunction

void function MoveToNextRadioButton()
ProcessMoveToControlType(wt_radiobutton, CVMSGRadiobutton1_L, true, UsesFocusChangeDepth(), s_Next)
EndFunction

void function MoveToPriorRadioButton()
ProcessMoveToControlType(wt_radiobutton, CVMSGRadiobutton1_L, true, UsesFocusChangeDepth(), s_Prior)
EndFunction

void function MoveToNextEdit()
ProcessMoveToControlType(wt_edit, CVMSGEdit1_L, true, false, s_Next)
EndFunction

void function MoveToPriorEdit()
ProcessMoveToControlType(wt_edit, CVMSGEdit1_L, true, false, s_Prior)
EndFunction

void function MoveToNextMailToLink()
ProcessMoveToControlType(WT_MailTo_link, cVMsgMailToLinks1_L, true, true, s_Next)
EndFunction

void function MoveToPriorMailToLink()
ProcessMoveToControlType(WT_MailTo_link, cVMsgMailToLinks1_L, true, true, s_Prior)
EndFunction

void function ProcessMoveToTag(int MoveDirection,
	string sTag, string sTagAttrib, string sElementtype,
	int bSayItemAsObject, int bCheckForContextHelp,
	optional int bMoveUseAttrib, optional int bAllowNesting)
if QuickNavFeatureUnavailable() return endIf
var	int bItemExists
if bMoveUseAttrib
	bItemExists = (GetListOfTagsWithAttribute(sTag, sTagAttrib,
		bAllowNesting, LIST_ITEM_SEPARATOR,0,FALSE) != cscNull)
else
	bItemExists = (GetListOfTags (sTag,sTagAttrib) != cscNull)
endIf
if !bItemExists
	NotifyNavigationFailed(NoItemForNavigation,sElementtype)
	Return
EndIf
var int bMoved
if bMoveUseAttrib
	bMoved = MoveToTagWithAttribute(MoveDirection, sTag, sTagAttrib, bAllowNesting)
else
	bMoved = MoveToTag(MoveDirection, sTag)
endIf
if !bMoved
	NotifyNavigationFailed(MoveDirection,sElementtype)
	return
endIf
if !SayAllInProgress()
	if bSayItemAsObject
		SayObjectTypeAndText()
	else
		SayLine()
	EndIf
	if bCheckForContextHelp
		NotifyIfContextHelp()
	endIf
endIf
EndFunction

void function MoveToNextObject()
ProcessMoveToTag(s_Next, cscObject, cscObjectAttribs, CVMSGObject,	false, false)
EndFunction

void function MoveToPriorObject()
ProcessMoveToTag(s_Prior, cscObject, cscObjectAttribs, CVMSGObject, false, false)
EndFunction

void function MoveToFirstObject()
ProcessMoveToTag(s_Top, cscObject, cscObjectAttribs, CVMSGObject, false, false)
EndFunction

void function MoveToLastObject()
ProcessMoveToTag(s_Bottom, cscObject, cscObjectAttribs, CVMSGObject, false, false)
EndFunction

void function MoveToNextBlockquote()
ProcessMoveToTag(s_Next, cscBlockQuote, cscBlockQuoteAttribs, CVMSGBlockquote, false, false)
EndFunction

void function MoveToPriorBlockquote()
ProcessMoveToTag(s_Prior, cscBlockQuote, cscBlockQuoteAttribs, CVMSGBlockquote, false, false)
EndFunction

void function MoveToFirstBlockquote()
ProcessMoveToTag(s_Top, cscBlockQuote, cscBlockQuoteAttribs, CVMSGBlockquote, false, false)
EndFunction

void function MoveToLastBlockquote()
ProcessMoveToTag(s_Bottom, cscBlockQuote, cscBlockQuoteAttribs, CVMSGBlockquote, false, false)
EndFunction

void function MoveToNextGraphic()
ProcessMoveToTag (s_Next, cscGraphic, cscGraphicAttribs, CVMSGGraphic, TRUE, false)
EndFunction

void function MoveToPriorGraphic()
ProcessMoveToTag(s_Prior, cscGraphic, cscGraphicAttribs, CVMSGGraphic, TRUE, false)
EndFunction

void function MoveToFirstGraphic()
ProcessMoveToTag(s_Top, cscGraphic, cscGraphicAttribs, CVMSGGraphic, false, false)
EndFunction

void function MoveToLastGraphic()
ProcessMoveToTag(s_Bottom, cscGraphic, cscGraphicAttribs, CVMSGGraphic, false, false)
EndFunction

void function MoveToNextForm ()
ProcessMoveToTag(s_Next, TAG_FORM, cscNull, CVMSGForm, false, false)
EndFunction

void function MoveToPriorForm ()
ProcessMoveToTag(s_Prior, TAG_FORM, cscNull, CVMSGForm, false, false)
EndFunction

void function MoveToFirstForm ()
ProcessMoveToTag(s_Top, TAG_FORM, cscNull, CVMSGForm, false, false)
EndFunction

void function MoveToLastForm ()
ProcessMoveToTag(s_Bottom, TAG_FORM, cscNull, CVMSGForm, false, false)
EndFunction

void function MoveToFirstTab()
ProcessMoveToControlType(WT_TABCONTROL, CVMSGTab1_l, true, false, s_Top)
EndFunction

void function MoveToLastTab()
ProcessMoveToControlType(WT_TABCONTROL, CVMSGTab1_l, true, false, s_Bottom)
EndFunction

void function MoveToNextTab()
ProcessMoveToControlType(WT_TABCONTROL, CVMSGTab1_l, true, false, s_Next)
EndFunction

void function MoveToPriorTab()
ProcessMoveToControlType(WT_TABCONTROL, CVMSGTab1_l, true, false, s_Prior)
EndFunction

void function SayRegionInfoOnNavigation()
sayLine(2)
if !IsVirtualCursorOnAnnotationString() then
	var string temp=formatString(cmsgRegionNameAndType, GetCurrentRegionName (), GetCurrentRegionType())
	SayFormattedMessageWithVoice (VCTX_MESSAGE, OT_JAWS_MESSAGE, temp)
endIf
endFunction

void function MoveToArticle(int which)
if !VirtualViewerFeatureAvailable(false,true) then
	return
EndIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
If GetRegionCount(WT_ARTICLE_Region) == 0 then
	NotifyNavigationFailed(NoItemForNavigation,CVMSGArticle1_l)
	Return
EndIf

if MoveToRegion(which, WT_ARTICLE_Region) then
	If ! SayAllInProgress() then
		SayRegionInfoOnNavigation()
	EndIf
else
	NotifyNavigationFailed(which, CVMSGArticle1_l)
EndIf
EndFunction

script SelectAnArticle()
if !VirtualViewerFeatureAvailable(false,true) then
	return
EndIf
SelectATagHelper(cscArticle, scPrompt, cMsgSelectAnArticle)
endScript

string function ConvertFormFieldTypeToControlNamePlural(int nType)
if nType == wt_edit then
	return CVMSGEdit1_L
elif nType == wt_button then
	return CVMSGButton1_L
elif nType == wt_combobox then
	return CVMSGCombobox1_L
elif nType == wt_checkbox then
	return CVMSGCheckbox1_L
elif nType == wt_radiobutton then
	return CVMSGRadiobutton1_L
elif nType == wt_TabControl
	return CVMSGTab1_l
endIf
return cscNull
EndFunction

void function SelectAFormFieldHelper(int nType, string sTitle)
var
	int RunningProducts,
	string sFields,
	int iIndex,
	int iCurrentIndex,
	string sFieldType,
	int iObjType
RunningProducts = GetRunningFSProducts()
if RunningProducts & product_JAWS then
	sFieldtype = ConvertFormFieldTypeToControlNamePlural(nType)
endIf
sFields = GetListOfFormFields(LIST_ITEM_SEPARATOR,nType)
iCurrentIndex = GetFormFieldIndex(nType)
if !sFields then
	If !sFieldType Then
		; no specific form field was passed to this function, therefore, display a generic message.
		sFieldType = CVMSGFormFields_L; no form fields were found
	EndIf
	SayFormattedMessage(OT_ERROR,formatString(CMSGNoTagsFound_L,sFieldType),FormatString(CMSGNoTagsFound_S,sFieldType))
	return
endIf
var int FormsMode = IsFormsModeActive()
if FormsMode
	TurnOffFormsMode(FormsModeEventSpeechSilent)
endIf
iIndex = DlgSelectItemInList(sFields, sTitle, FALSE,iCurrentIndex)
Delay(2)
if iIndex then
	MoveToFormFieldByIndex(iIndex,nType)
	Delay(2)
	iObjType = GetObjectSubtypeCode()
	if iObjType == wt_edit
	|| iObjType == wt_multiline_edit
	|| RunningProducts == product_MAGic then
		TurnOnFormsMode()
	EndIf
else
	RestoreFormsMode(FormsMode)
endIf
endFunction

void function SelectAFormFieldHelperForVirtualUIA(int nType, string sTitle)
var int FormsMode = IsFormsModeActive()
if FormsMode
	TurnOffFormsMode(FormsModeEventSpeechSilent)
endIf
var string sFieldtype = ConvertFormFieldTypeToControlNamePlural(nType)
if !DlgListOfFormFieldsEx(LIST_ITEM_SEPARATOR,nType)
	If !sFieldType
		; no specific form field was passed to this function, therefore, display a generic message.
		sFieldType = CVMSGFormFields_L; no form fields were found
	EndIf
	SayFormattedMessage(OT_ERROR,formatString(CMSGNoTagsFound_L,sFieldType),FormatString(CMSGNoTagsFound_S,sFieldType))
	RestoreFormsMode(FormsMode)
	return
endIf
if FormsMode
	Delay(2)
	var int iObjType = GetObjectSubtypeCode()
	if iObjType == wt_edit
	|| iObjType == wt_multiline_edit
		TurnOnFormsMode()
	EndIf
endIf
EndFunction

int function SelectAFormFieldDialog(int type, string title)
if InHJDialogError() return true EndIf
EnsureManagedVirtualHelpIsInactive()
var
	int originalUseVirtualPCCursorState,
	int newUseVirtualPCCursorState
ManageVirtualPCCursorToggle(originalUseVirtualPCCursorState, newUseVirtualPCCursorState)
if IsVirtualUIAPCCursor() 
	SelectAFormFieldHelperForVirtualUIA(type,title)
else
	SelectAFormFieldHelper(type,title)
endIf
if originalUseVirtualPCCursorState != newUseVirtualPCCursorState
	Delay (1)
	SetJcfOption (OPT_VIRTUAL_PC_CURSOR, originalUseVirtualPCCursorState)
EndIf
EndFunction

script SelectAFormField()
SelectAFormFieldDialog(0,msgSelectAFormFieldTitle)
endScript

script SelectAButtonFormField()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectAFormFieldDialog(wt_button,cMsgSelectAButton)
endScript

script SelectAComboFormField()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectATagHelper(TAG_SELECTABLE_ITEMS_CONTROL, cscSelectableItemCibtrolAttribs, CVMSGComboboxListBoxTreeView1_L)
; cMsgSelectAComboBox)
endScript

script SelectAnEditFormField()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectAFormFieldDialog(wt_edit,cMsgSelectAnEditBox)
endScript

script SelectARadioButtonFormField()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectAFormFieldDialog(wt_radiobutton,cMsgSelectARadioButton)
endScript

script SelectACheckboxFormField()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectAFormFieldDialog(wt_checkbox,cMsgSelectACheckBox)
endScript

script SelectATabFormField()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectAFormFieldDialog(WT_TABCONTROL, cMsgSelectATab)
endScript
;Change Config option and
;Speak graphic, link or button with new setting.

void Function ResetVirtualHook ()
If GIVirtualHook != TRUE then
	Return;
EndIf
Let GIVirtualHook = FALSE
If GIOption > 0
&& GIPrevSetting >= 0 then
	SetJCFOption (GIOption, GIPrevSetting)
EndIf
Let GIPrevSetting = -2
Let GIOption = -2
RemoveHook (HK_SCRIPT, "VirtualPromptAndTextHelper")
EndFunction

int Function VirtualPromptAndTextHelper (String ScriptName)
var
	int iType,
	int iPrevCol,
	int iPrevRow,
	string sElementInfo,
	string sNewSetting
If ScriptName != "VirtualSayWindowPromptAndText"
&& ScriptName != "SayWindowPromptAndText" then
	If GIOption >= 0
	&& GIPrevSetting >= 0 then
		SetJcfOption (GIOption, GIPrevSetting)
	EndIf
	ResetVirtualHook ()
	Return TRUE
EndIf
If !IsVirtualPCCursor () then
	ResetVirtualHook ()
	Return TRUE;Die! without acting.
EndIf
smmToggleTrainingMode(TRUE)
Let iType = GetObjectSubtypeCode ()
Let iPrevCol = GetCursorCol ()
Let iPrevRow = GetCursorRow ()
Let sElementInfo = GetElementDescription (1, TRUE)
Let sElementInfo = (StringLower (sElementInfo))
If iType == WT_BITMAP then
	Let sNewSetting = HTMLGraphicReadingVerbosityToggle (FALSE)
	If GIPrevSetting == -2 then
		Let GIPrevSetting = GetJCFOption (optGraphicRendering)
	EndIf
	Let GIOption = optGraphicRendering
	;If iPrevCol != GetCursorCol () ||
	If iPrevRow != GetCursorRow () then
		Let sNewSetting = (FormatString (cMsgVirtualHasChanged, sNewSetting))
	EndIf
	Let GICycleSettingOptions = GetJCFOption (optGraphicRendering)
	If ! iType then
		SayUsingVoice (VCTX_MESSAGE, sNewSetting, OT_SMART_HELP);Tutor/message voice.
		SayLine ()
		ResetVirtualHook ()
		smmToggleTrainingMode(FALSE)
		Return FALSE
	Else
		IndicateControlType (iType, GetLine ())
	EndIf
	SayUsingVoice (VCTX_MESSAGE, sNewSetting, OT_SMART_HELP);Tutor/message voice.
	smmToggleTrainingMode(FALSE)
	Return FALSE;to keep cycling.
ElIf iType == WT_BUTTON then
	Let sNewSetting = HTMLButtonTextVerbosityToggle (FALSE)
	;If iPrevCol != GetCursorCol () ||
	If iPrevRow != GetCursorRow () then
		Let sNewSetting = (FormatString (cMsgVirtualHasChanged, sNewSetting))
	EndIf
	Let GICycleSettingOptions = GetJCFOption (optButtonText)
	If GIPrevSetting >= 0 then
		Let GIPrevSetting = GICycleSettingOptions
	EndIf
	Let GIOption = optButtonText
	If ! iType then
		SayUsingVoice (VCTX_MESSAGE, sNewSetting, OT_SMART_HELP);Tutor/message voice.
		SayLine ()
		ResetVirtualHook ()
		smmToggleTrainingMode(FALSE)
		Return FALSE
	Else
		IndicateControlType (iType, GetLine ())
	EndIf
	SayUsingVoice (VCTX_MESSAGE, sNewSetting, OT_SMART_HELP);Tutor/message voice.
	smmToggleTrainingMode(FALSE)
	Return FALSE;to keep cycling.
ElIf iType == WT_LINK then
	If GIPrevSetting >= 0 then
		Let GIPrevSetting = GICycleSettingOptions
	EndIf
	Let GIOption = optLinkText
	Let sNewSetting = HTMLTextLinkVerbosityToggle (FALSE)
	;If iPrevCol != GetCursorCol () ||
	If iPrevRow != GetCursorRow () then
		Let sNewSetting = (FormatString (cMsgVirtualHasChanged, sNewSetting))
	EndIf
	Let GICycleSettingOptions = GetJCFOption (optLinkText)
	If ! iType then
		SayUsingVoice (VCTX_MESSAGE, sNewSetting, OT_SMART_HELP);Tutor/message voice.
		SayLine ()
		ResetVirtualHook ()
		smmToggleTrainingMode(FALSE)
		Return FALSE
	Else
		IndicateControlType (iType, GetLine ())
	EndIf
	SayUsingVoice (VCTX_MESSAGE, sNewSetting, OT_SMART_HELP);Tutor/message voice.
	smmToggleTrainingMode(FALSE)
	Return FALSE;to keep cycling.
;ElIf StringContains (sElementInfo, TAG_FORM) then
ElIf iType == WT_EDIT
|| iType == WT_MULTILINE_EDIT
|| iType == WT_READONLYEDIT
|| iType == WT_COMBOBOX
|| iType == WT_LISTBOX
|| iType == WT_CHECKBOX
|| iType == WT_RADIOBUTTON then
	If GIPrevSetting >= 0 then
		Let GIPrevSetting = GICycleSettingOptions
	EndIf
	Let GIOption = optFormFieldPrompts
	Let sNewSetting = HTMLFormFieldPromptsRenderingToggle (FALSE)
	;If iPrevCol != GetCursorCol () ||
	If iPrevRow != GetCursorRow () then
		Let sNewSetting = (FormatString (cMsgVirtualHasChanged, sNewSetting))
	EndIf
	Let GICycleSettingOptions = GetJCFOption (optLinkText)
	If ! iType then
		SayUsingVoice (VCTX_MESSAGE, sNewSetting, OT_SMART_HELP);Tutor/message voice.
		SayLine ()
		ResetVirtualHook ()
		smmToggleTrainingMode(FALSE)
		Return FALSE
	Else
		SpeakContainingGroupBox(iType)
		SayObjectTypeAndText ()
	EndIf
	SayUsingVoice (VCTX_MESSAGE, sNewSetting, OT_SMART_HELP);Tutor/message voice.
	smmToggleTrainingMode(FALSE)
	Return FALSE;to keep cycling.
Else
	ResetVirtualHook ()
	smmToggleTrainingMode(FALSE)
	Return TRUE
EndIf
EndFunction

script VirtualSayWindowPromptAndText ()
var
	int iLinkTextOption,
	string sLinkAttribs,
	int index,
	string sLinkTitle
; speak the smart navigation level if appropriate:
smmToggleTrainingMode(TRUE)
if giSpeakSmartNavLevel then
	SpeakSmartNavLevelSetting ()
endIf
If GetObjectSubtypeCode () then
	SayObjectTypeAndText ()
Else
	SayLine ()
EndIf
smmToggleTrainingMode(FALSE)
if !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
NotifyIfContextHelp()
if !IsFormsModeActive()
&& getObjectSubtypeCode() == wt_link then
	;If the text link verbosity is not set to title,
	;then speak the title here:
	let iLinkTextOption=GetJcfOption(OptLinkText)
	if iLinkTextOption>0 then
		setJcfOption(OptLinkText,0)
		let sLinkAttribs=GetElementDescription(1,false)
		let index=stringSegmentIndex(sLinkAttribs,scEqualsDelim,msgLinkTitle,false)
		let sLinkTitle=StringSegment(sLinkAttribs,scEqualsDelim,index+1)
		let sLinkTitle=StringSegment(sLinkTitle,cscBufferNewLine,1)
		if GetLine()==sLinkTitle then
			sayUsingVoice (VCTX_MESSAGE,msgLinkTitle+sLinkTitle,OT_HELP);Tutor/message voice.
		endIf
		setJcfOption(OptLinkText,iLinkTextOption)
	EndIf
EndIf
Let GIVirtualHook = TRUE
AddHook (HK_SCRIPT, "VirtualPromptAndTextHelper")
EndScript

void function SayCurrentPlaceMarker()
var
	string sTemp,
int nType
Let sTemp = GetLine ()
If sTemp then
	Let sTemp = (smmReplaceSymbolsWithMarkup (sTemp))
Else
	Let sTemp = cmsgBlank1
EndIf
Let nType=GetObjectSubtypeCode()
If ShouldItemSpeak(OT_CONTROL_TYPE)
&& nType && (nType!=WT_STATIC) then
	SayObjectTypeAndText()
Else
	SayLine()
EndIf
endFunction

void function ProcessMoveToPlaceMarker(int MoveDirection)
if QuickNavFeatureUnavailable() return endIf
;no placemarkers found:
If !GetPlaceMarkerCount()
	NotifyNavigationFailed(NoItemForNavigation,cVMsgPlacemarkers1_L)
	Return
EndIf
var	int nReturn
if MoveDirection == s_next
	nReturn = MoveToNextPlaceMarker()
elif MoveDirection == s_Prior
	nReturn = MoveToPriorPlaceMarker()
EndIf
If nReturn > 0
	If !SayAllInProgress()
		SayCurrentPlaceMarker()
		NotifyIfContextHelp ()
	EndIf
else
	NotifyNavigationFailed(MoveDirection,cVMsgPlacemarkers1_L)
EndIf
EndFunction

void function MoveToNextPlaceMarker()
ProcessMoveToPlaceMarker(s_next)
EndFunction

void function MoveToPriorPlaceMarker()
ProcessMoveToPlaceMarker(s_prior)
EndFunction

Script DefineATempPlaceMarker()
if !isVirtualPCCursor() then
	SayMessage(OT_JAWS_MESSAGE, cmsgSaveCurrentLocation_L, cmsgSaveCurrentLocation_s)
	SaveCurrentLocation()
	return
endIf
if !VirtualViewerFeatureAvailable(true,true) then
	return
EndIf
if (DefineATempPlaceMarker()) then
	SayUsingVoice (VCTX_MESSAGE, cMsgTempPlaceMarkerDropped, OT_NO_DISABLE)
	SayLine ()
else
	SayUsingVoice (VCTX_MESSAGE, cMsgErrorDefiningPlaceMarker, OT_ERROR)
endif
EndScript

void function SpeakPlaceMarkerN(int nPlaceMarker)
var
	int nCount
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if SayAllInProgress() then
	return
EndIf
if !IsVirtualPCCursor() then
	SayQuickKeynavigationNotAvailable()
	return
endIf
let nCount = GetPlaceMarkerCount()
if !nCount then
	SayMessage(ot_error,msgNoPlaceMarkersOnPage_L,msgNoPlaceMarkersOnPage_S)
	return
elif nCount < nPlaceMarker then
	SayMessage(ot_error,formatString(msgNoPlacemarkerN,intToString(nPlaceMarker)))
	return
EndIf
if !SpeakPlaceMarkerByIndex(nPlaceMarker,false) then
	SayMessage(ot_error,msgPlaceMarkerError)
EndIf
endFunction

void function MoveToPlaceMarkerN(int nPlaceMarker)
var
	int nCount
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if SayAllInProgress() then
	return
EndIf
if !IsVirtualPCCursor() then
	SayQuickKeynavigationNotAvailable()
	return
endIf
let nCount = GetPlaceMarkerCount()
if !nCount then
	SayMessage(ot_error,msgNoPlaceMarkersOnPage_L,msgNoPlaceMarkersOnPage_S)
	return
elif nCount < nPlaceMarker then
	SayMessage(ot_error,formatString(msgNoPlacemarkerN,intToString(nPlaceMarker)))
	return
EndIf
if !SpeakPlaceMarkerByIndex(nPlaceMarker,true) then
	SayMessage(ot_error,msgPlaceMarkerError)
EndIf
endFunction

Script SelectATable()
var
	string strBuf,
	int index,
	int nCurrent,
	int formsMode
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
FormsMode = IsFormsModeActive ()
if FormsMode
	TurnOffFormsMode (FormsModeEventSpeechSilent)
EndIf
let strBuf=GetListOfTables(LIST_ITEM_SEPARATOR)
if !strBuf then
	RestoreFormsMode(FormsMode)
	SayFormattedMessage(ot_error, msgNoTables1_L, msgNoTables1_S)
	return; no tables found
endIf
let nCurrent=GetTableIndex()
let index = DlgSelectItemInList (strBuf, CMSGSelectATable, false,nCurrent)
if index == 0 then
	RestoreFormsMode(FormsMode)
	return; user cancelled operation
endIf
if MoveToTableByIndex(index) then
	SayTableOrGridColumnAndRowCountInfo()
	SayTableCaptionAndSummary()
	PerformScript SayCell()
	NotifyIfContextHelp ()
else
	RestoreFormsMode(FormsMode)
endIf
endScript

void function MoveToNextCombo()
if IsVirtualUIAPCCursor()
	ProcessMoveToControlType(wt_ComboBox, cVMsgComboBox1_L, true, false, s_Next)
else
	ProcessMoveToTag(s_Next,
		TAG_SELECTABLE_ITEMS_CONTROL, cscSelectableItemCibtrolAttribs,
		CVMSGComboboxListBoxTreeView1_L, true, true)
endIf
EndFunction

void function MoveToPriorCombo()
if IsVirtualUIAPCCursor()
	ProcessMoveToControlType(wt_ComboBox, cVMsgComboBox1_L, true, false, s_Prior)
else
	ProcessMoveToTag(s_Prior,
		TAG_SELECTABLE_ITEMS_CONTROL, cscSelectableItemCibtrolAttribs,
		CVMSGComboboxListBoxTreeView1_L, true, true)
endIf
EndFunction

string Function ReturnTagTypeLiteral (string sTag)
if sTag == cscArticle then
	return CVMSGArticle1_l
elIf sTag == cscAnchor Then
	return cMsgAnchors
ElIf sTag == cscBlockQuote Then
	return cMsgBlockQuotes
ElIf sTag == cscDivision Then
	return cMsgDivisions
ElIf sTag == cscGraphic Then
	return cMsgGraphics
ElIf sTag == cscList Then
	return cMsgLists
ElIf sTag == TAG_LIST_ITEM Then
	return cMsgListItems
ElIf sTag == cscObject Then
	return cMsgObjects
ElIf sTag == cscParagraph Then
	return cMsgParagraphs
elif sTag == cscSpan then
	return cvmsgSpan
elif sTag == cscHRSeparator
	return cvmsgSeparator
elif sTag == TAG_SELECTABLE_ITEMS_CONTROL
	Return cmsgOtherControls
Else
	return cscNull
EndIf
EndFunction

void function SelectATagHelper(string sTag, string sAttrList,string sTitle)
if QuickNavFeatureUnavailable() return EndIf
var
	string strBuf,
	string uCaseTag,
	string lCaseAttrs,
	int index,
	int nCurrent,
	int FormsMode = IsFormsModeActive()
uCaseTag=StringUpper(sTag)
lCaseAttrs=stringLower(sAttrList)
strBuf=GetListOfTags(uCaseTag,lCaseAttrs,LIST_ITEM_SEPARATOR)
if !strBuf
	RestoreFormsMode(FormsMode)
	SayFormattedMessage(OT_ERROR,formatString(CMSGNoTagsFound_L,ReturnTagTypeLiteral(sTag)),formatString(CMSGNoTagsFound_S,ReturnTagTypeLiteral(sTag)))
	return
endIf
nCurrent=GetTagIndex(uCaseTag)
index = DlgSelectItemInList (strBuf, sTitle, false,nCurrent)
if index == 0
	RestoreFormsMode(FormsMode)
	return; user cancelled operation
endIf
if MoveToTagByIndex(index,uCaseTag)
	sayLine()
endIf
endFunction

script SelectAnAnchor()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectATagHelper(cscANCHOR,cscAnchorAttribs ,cMsgSelectAnAnchor)
endScript

script SelectAGraphic()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectATagHelper(cscGraphic,cscGraphicAttribs ,cMsgSelectAGraphic)
endScript

script SelectAListItem()
SelectATagHelper(TAG_LIST_ITEM,cscNull, cMsgSelectAListItem)
endScript

script SelectAList()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectATagHelper(cscList, cscNull,cMsgSelectAList)
endScript

script SelectAParagraph()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectATagHelper(cscParagraph,cscNull,cMsgSelectAParagraph)
endScript

script SelectAnObject()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectATagHelper(cscObject,cscObjectAttribs,cMsgSelectAnObject)
endScript

script SelectABlockQuote()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectATagHelper(cscBlockQuote,cscBlockQuoteAttribs ,cMsgSelectABlockQuote)
endScript

script SelectADivision()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectATagHelper(cscDivision, cscDivisionAttribs ,cMsgSelectADivision)
endScript

script SelectASpan()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectATagHelper(cscSpan, cscSpanAttribs ,cMsgSelectASpan)
endScript

void function MoveToNextAnchor()
ProcessMoveToTag(s_Next, cscANCHOR, cscAnchorAttribs, CVMSGAnchor, false, true)
EndFunction

void function MoveToPriorAnchor()
ProcessMoveToTag(s_Prior, cscANCHOR, cscAnchorAttribs, CVMSGAnchor, false, true)
EndFunction

void function MoveToNextListItem()
if IsVirtualUIAPCCursor()
	ProcessMoveToControlType(wt_listItem, cVMsgListItem, false, false, s_Next)
else
	ProcessMoveToTag(s_Next, TAG_LIST_ITEM, cscNull, cVMsgListItem, false, true)
endIf
EndFunction

void function MoveToPriorListItem()
if IsVirtualUIAPCCursor()
	ProcessMoveToControlType(wt_listItem, cVMsgListItem, false, false, s_Prior)
else
	ProcessMoveToTag(s_Prior, TAG_LIST_ITEM, cscNull, cVMsgListItem, false, true)
endIf
EndFunction

void function MoveToNextDivision()
ProcessMoveToTag(s_Next, cscDivision, cscDivisionAttribs, cVMsgDivision, false, true)
EndFunction

void function MoveToPriorDivision()
ProcessMoveToTag(s_Prior, cscDivision, cscDivisionAttribs, cVMsgDivision, false, true)
EndFunction

void function MoveToNextSpan()
ProcessMoveToTag(s_Next, cscSpan, cscSpanAttribs, cvmsgSpan, false, true)
EndFunction

void function MoveToPriorSpan()
ProcessMoveToTag(s_Prior, cscSpan, cscSpanAttribs, cvmsgSpan, false, true)
EndFunction

Void Function SayElementNotFound (string sElementType)
if GetRunningFSProducts() == product_magic
; Now we are causing MAGic to post dialogs only if speech is disabled:
&& isSpeechOff () then
	ExMessageBox(FormatString(CVmsgNoElements_L,sElementType) ,
		msgFocusToFormFieldDialog, MB_OK|MB_ICONASTERISK)
else
	SayFormattedMessage(OT_ERROR,
		FormatString(CVmsgNoElements_L,sElementType) ,
		FormatString(CVmsgNoElements_S,sElementType))
endIf
EndFunction

string function HTMLStyleSheetProcessing(int iRetCurVal)
var
	int iOption
Let iOption = GetJcfOption (optStyleSheetProcessing)
If ! iRetCurVal then
	;Update it
	if iOption < StyleSheetsProcessImported then
		let iOption=iOption+1
	else
		let iOption=StyleSheetsIgnore
	endIf
	SetJcfOption (optStyleSheetProcessing,iOption)
EndIf
If iOption==StyleSheetsIgnore then
	Return cmsgStyleSheetsIgnore
elif iOption==StyleSheetsProcessTopLevel then
	return cmsgStyleSheetsTopLevel
else
	Return cmsgStyleSheetsProcessImported
EndIf
EndFunction

void function virtualSelectAFrame ()
var
	string strBuf,
	int index
if InHJDialogError() return EndIf
EnsureManagedVirtualHelpIsInactive()
if IsVirtualPCCursor() then
	let strBuf=GetHTMLFrameNames(LIST_ITEM_SEPARATOR)
	if strBuf then
		let index = DlgSelectItemInList (strBuf, SelectAFrameDialogName, false)
		if index > 0 then
			if MoveToHTMLFrameByIndex(index) then
    		return
    	endIf
		endIf
		return
	else
		SayFormattedMessage (ot_ERROR, msgNoFrames1_L, msgNoFrames1_S)
		return
	endIf
endIf
endFunction

void function MoveToNextOnClickElement()
ProcessMoveToTag(s_Next, cscNull, cscAttribOnClick, cvmsgClickableElements, false, false, true)
EndFunction

void function MoveToPriorOnClickElement()
ProcessMoveToTag(s_Prior, cscNull, cscAttribOnClick, cvmsgClickableElements, false, false, true)
EndFunction

void function MoveToNextOnMouseOverElement()
ProcessMoveToTag(s_Next, cscNull, cscAttribOnMouseOver, cvmsgOnMouseOverElements, false, false, true)
EndFunction

void function MoveToPriorOnMouseOverElement()
ProcessMoveToTag(s_Prior, cscNull, cscAttribOnMouseOver, cvmsgOnMouseOverElements, false, false, true)
EndFunction

void function SelectATagWithAttributeHelper(string sTag, string sAttr,int nAllowNesting,string sTitle, string sItemType)
var
	string strBuf,
	string uCaseTag,
	string lCaseAttr,
	int index,
	int nCurrent,
	int formsMode
if InHJDialogError() return EndIf
FormsMode = IsFormsModeActive ()
if FormsMode
	TurnOffFormsMode (FormsModeEventSpeechSilent)
EndIf
if !IsVirtualPCCursor() then
	RestoreFormsMode(FormsMode)
	SayQuickKeynavigationNotAvailable()
	return
endIf
let uCaseTag=StringUpper(sTag)
let lCaseAttr=stringLower(sAttr)
let strBuf=GetListOfTagsWithAttribute(uCaseTag,lCaseAttr,nAllowNesting,LIST_ITEM_SEPARATOR,0,FALSE)
if !strBuf then
	RestoreFormsMode(FormsMode)
	SayFormattedMessage(OT_ERROR,formatString(CMSGNoTagsFound_L,sItemType),formatString(CMSGNoTagsFound_S,sItemType))
	return; no tags found
endIf
let nCurrent=GetTagWithAttributeIndex(uCaseTag,lCaseAttr,nAllowNesting)
let index = DlgSelectItemInList (strBuf, sTitle, false,nCurrent)
if index == 0 then
	RestoreFormsMode(FormsMode)
	return; user cancelled operation
endIf
if MoveToTagWithAttributeByIndex(index,uCaseTag,lCaseAttr,nAllowNesting) then
	sayLine()
else
	RestoreFormsMode(FormsMode)
endIf
endFunction

script SelectAnOnClickElement()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectATagWithAttributeHelper(cscNull, cscAttribOnClick, TRUE,cvmsgClickableElements, cvmsgClickableElements)
endScript

script SelectAnOnMouseOverElement()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
SelectATagWithAttributeHelper(cscNull, cscAttribOnMouseOver, TRUE,cvmsgOnMouseOverElements, cvmsgOnMouseOverElements)
endScript

int function RegionExists(optional int type)
if IsVirtualUIAPCCursor() 
	return RegionAvailableForVirtualUIA()
elif (type == WT_LandmarkRegion || type == WT_MAIN_REGION)
&& GetRegionCount(type)
	return true
endIf
return false
EndFunction

Script MoveToMainRegion ()
;No longer specific to JAWS
if !VirtualViewerFeatureAvailable(FALSE,true) then
	return
EndIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
If !RegionExists(WT_MAIN_REGION)
   	SayFormattedMessage(ot_error, msgNoMainRegion_L, msgNoMainRegion_S)
	Return
EndIf
if MoveToRegion(s_next, WT_MAIN_REGION) then
	If ! SayAllInProgress() then
		SayRegionInfoOnNavigation()
	EndIf
else
	SayFormattedMessage(ot_error, msgNoNextRegion_L, msgNoNextRegion_S)
EndIf
EndScript

Script MoveToNextRegion ()
;No longer specific to JAWS
if !VirtualViewerFeatureAvailable(FALSE,true) then
	return
EndIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
If !RegionExists(WT_LandmarkRegion)
   	SayFormattedMessage(ot_error, msgNoRegions_L, msgNoRegions_S)
	Return
EndIf
if MoveToRegion(s_next,WT_LandmarkRegion) then
	If ! SayAllInProgress() then
		SayRegionInfoOnNavigation()
	EndIf
else
	SayFormattedMessage(ot_error, msgNoNextRegion_L, msgNoNextRegion_S)
EndIf
EndScript

Script MoveToPriorRegion ()
;No longer specific to JAWS
if !VirtualViewerFeatureAvailable(FALSE,true) then
	return
EndIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
If !RegionExists(WT_LandmarkRegion)
   	SayFormattedMessage(ot_error, msgNoRegions_L, msgNoRegions_S)
	Return
EndIf
if MoveToRegion(s_prior,WT_LandmarkRegion) then
	If ! SayAllInProgress() then
		SayRegionInfoOnNavigation()
	EndIf
else
	SayFormattedMessage(ot_error, msgNoPriorRegion_L, msgNoPriorRegion_S)
EndIf
EndScript

Script SelectaRegion ()
var
	int succeeded,
	int originalUseVirtualPCCursorState,
	int newUseVirtualPCCursorState

; Will not work if in application mode and the virtual cursor is turned off for application mode, i.e. 3.
;E.g. in Google Docs.
if QuickNavFeatureUnavailable() then
	return
EndIf
if InHJDialogError() return true EndIf
EnsureManagedVirtualHelpIsInactive()
ManageVirtualPCCursorToggle(originalUseVirtualPCCursorState, newUseVirtualPCCursorState)

let succeeded = DlgListOfRegions();
if ( succeeded == 0 ) then
	SayFormattedMessage (OT_error, cmsgNoRegionsOnPage )
EndIf
; leave virtual cursor on since regions can only be navigated in virtual mode.
EndScript

int function getMailToLinksCount ()
return stringContains (GetListOfTagsWithAttribute (cscATag, cscHRef), cscMailTo)
endFunction

Script SelectAMailToLink()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
If !dlgListOfLinks(FSMailLink) then
	sayMessage(ot_error, msgNoMailToLink_L)
EndIf
EndScript

Script SelectaDropTarget()
var
	int succeeded
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf

TurnOffFormsMode ()
let succeeded = DlgListOfDropTargets()
if ( succeeded == 0 ) then
	SayFormattedMessage (OT_error, cmsgNoDropTargetsOnPage )
EndIf
EndScript

Script FilterLiveRegionAnnouncements()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf
DlgAriaLiveRegionFilterText()
EndScript

int function IsManagedVirtualHelpActive()
return UserBufferWindowName() == cwubn_ManagedVirtualHelp
EndFunction

void Function ShowManagedVirtualHelp(string HelpMsg)
;Cannot use UserBufferActivate without text, or Virtual Viewer will always be invisible.
UserBufferDeactivate()
UserBufferClear()
UserBufferAddText(FormatString(HelpMsg))
UserBufferActivateEx(cwubn_ManagedVirtualHelp,cscNull,0,0)
AddAskFSCompanionHotKeyLink()
SayMessage (OT_USER_BUFFER, cscBufferNewLine+cMsgBuffExit)
EndFunction

script MoveToNextWordFromList()
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if !VirtualViewerFeatureAvailable(true,true) then
	return
EndIf
if !GlobalCurrentWordFromList then
	SayFormattedMessage(ot_error,cmsgNoWordList)
	return
EndIf
if FindString(GetFocus(),GlobalCurrentWordFromList,s_next,S_RESTRICTED,UsesUnderlyingDom()) then
	if not SayAllInProgress() then
		sayLine()
		NotifyIfContextHelp ()
	endIf
else
	SayMessage(ot_error,cmsgNoNextWord_L,cmsgNoNextWord_S)
EndIf
EndScript

script MoveToPriorWordFromList()
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if !VirtualViewerFeatureAvailable(true,true) then
	return
EndIf
if !GlobalCurrentWordFromList then
	SayFormattedMessage(ot_error,cmsgNoWordList)
	return
EndIf
if FindString(GetFocus(),GlobalCurrentWordFromList,s_prior,S_RESTRICTED,UsesUnderlyingDom()) then
	if not SayAllInProgress() then
		sayLine()
		NotifyIfContextHelp ()
	endIf
else
	SayMessage(ot_error,cmsgNoPriorWord_L,cmsgNoPriorWord_S)
EndIf
EndScript

Script MoveToFlowTo ()
if !VirtualViewerFeatureAvailable(true,true) then
	return
EndIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if NavToFlowRelations (true) then
	if not SayAllInProgress() then
		sayLine()
		NotifyIfContextHelp ()
	endIf
else
	SayNothingFoundEx(s_next,CVMSGFlow)
endIf
EndScript

Script MoveToFlowFrom ()
if !VirtualViewerFeatureAvailable(true,true) then
	return
EndIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if NavToFlowRelations (false) then
	if not SayAllInProgress() then
		sayLine()
		NotifyIfContextHelp ()
	endIf
else
	SayNothingFoundEx(s_next,CVMSGFlow)
endIf
EndScript

void function MoveToNextSeparator()
ProcessMoveToControlType(wt_separator, cvmsgSeparator, false, false, s_Next)
EndFunction

void function MoveToPriorSeparator()
ProcessMoveToControlType(wt_separator, cvmsgSeparator, false, false, s_Prior)
EndFunction

void function MoveToNextSlider()
ProcessMoveToControlType(wt_slider, cvmsgSlider, true, false, s_Next)
EndFunction

void function MoveToPriorSlider()
ProcessMoveToControlType(wt_slider, cvmsgSlider, true, false, s_Prior)
EndFunction

void function ProcessMoveToNonLinkText(int MoveDirection)
if QuickNavFeatureUnavailable() return endIf
if MoveDirection == s_Next
	NextNonLink ()
elif MoveDirection == s_Prior
	PriorNonLink ()
EndIf
if !SayAllInProgress()
	delay(1)
	sayline()
endIf
EndFunction

void function MoveToNextNonLinkText()
ProcessMoveToNonLinkText(s_next)
EndFunction

void function MoveToPriorNonLinkText ()
ProcessMoveToNonLinkText(s_prior)
EndFunction

void function JumpToLine()
var
	string sText,
	int nLine,
	int nMaxLines,
	string sPrompt
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
let nMaxLines = GetLineCount()
if nMaxLines <= 0 then
	return
endIf
let sPrompt = FormatString(cmsgMoveToLinePrompt,intToString(nMaxLines))
;So we have a default value as current line, Row in VCursor is actual line:
let giJumpReturnLine = GetCursorRow ()
Let sText = IntToString (giJumpReturnLine)
if not InputBox (sPrompt, cmsgMoveToLineTitle, sText) then
	if giPrevJumpReturnLine then
		let giJumpReturnLine = giPrevJumpReturnLine
	else
		let giJumpReturnLine = 0
	EndIf
	return ; cancel was pressed
endIf
Delay (4)
PCCursor() ;ensure virtual cursor is the active cursor before jumping
let nLine = StringToInt(sText)
If nLine == 0 then
	Return
EndIf
if GotoLineNumber(nLine) then
	let giPrevJumpReturnLine = giJumpReturnLine
	;sayLine();No longer needed as we are doing it via FocusChanged.
else
	SayFormattedMessage (OT_ERROR,
		FormatString (cMsgNotGoToLine, sText))
endIf
EndFunction

void function JumpReturnFromLine()
If !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
PCCursor()
if giJumpReturnLine then
	if GotoLineNumber(giJumpReturnLine) then
		SayLine()
		let giJumpReturnLine = 0
	else
		Say(cmsgJumpFailed,ot_error)
	EndIf
else
	Say(cmsgNoPreviousJump,ot_error)
EndIf
EndFunction

void function JumpToTableCell()
var
	int nCol,
	int nRow,
	string sTemp,
	string sShort,
	string sLong,
	int nResult,
	int nPriorCol,
	int nPriorRow,
	int formsMode
FormsMode = IsFormsModeActive ()
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if FormsMode
	TurnOffFormsMode (FormsModeEventSpeechSilent)
endIf
if TableErrorEncountered(TABLE_NAV_JUMP) then
	RestoreFormsMode(formsMode)
	return
endIf
GetCellCoordinates (nPriorCol, nPriorRow)
let giJumpReturnTableCol = nPriorCol
let giJumpReturnTableRow = nPriorRow
let sTemp=intToString(nPriorCol)+", "+intToString(nPriorRow)
let nResult=InputBox(cmsgMoveToTableCellPrompt,cmsgMoveToTableCellTitle,sTemp)
if nResult==0 then
	RestoreFormsMode(formsMode)
	if giPrevJumpReturnTableCol && giPrevJumpReturnTableRow then
		let giJumpReturnTableCol = giPrevJumpReturnTableCol
		let giJumpReturnTableRow = giPrevJumpReturnTableRow
	else
		let giJumpReturnTableCol = 0
		let giJumpReturnTableRow = 0
	EndIf
	return
endIf
Delay (4)
let nCol=StringToInt(StringSegment(sTemp,",",1))
let nRow=stringToInt(stringSegment(sTemp,",",2))
if !MoveToTableCell(nCol,nRow) then
	RestoreFormsMode(formsMode)
	let sLong=FormatString(cmsgMoveToTableCellError_L,intToString(nCol),intToString(nRow))
	let sShort=cmsgMoveToTableCellError_S
	SayMessage(OT_ERROR,sLong,sShort)
endIf
let giPrevJumpReturnTableCol = giJumpReturnTableCol
let giPrevJumpReturnTableRow = giJumpReturnTableRow
PerformScript SayCell (); rather than speaking nothing, just speak cell contents/coordinates
endFunction

void function JumpReturnFromTableCell()
var int FormsMode = IsFormsModeActive ()
; for web applications who "borrow" quick navigation keys
if ProcessKeystrokeAsReserved (GetCurrentScriptKeyName ()) then return endIf
if FormsMode
	TurnOffFormsMode (FormsModeEventSpeechSilent)
endIf
if TableErrorEncountered(TABLE_NAV_JUMP) then
	RestoreFormsMode(formsMode)
	return
endIf
if giJumpReturnTableCol && giJumpReturnTableRow then
	if MoveToTableCell(giJumpReturnTableCol,giJumpReturnTableRow) then
		PerformScript SayCell()
		let giJumpReturnTableCol = 0
		let giJumpReturnTableRow = 0
	else
		RestoreFormsMode(formsMode)
		SayMessage(OT_ERROR, cmsgJumpFailed)
	EndIf
else
	RestoreFormsMode(formsMode)
	PerformScript SayCell (); rather than speaking nothing, just speak cell contents/coordinates
EndIf
EndFunction

Int Function UsesFocusChangeDepth ()
;this is currently only true for windows beginning with mozilla
var
	string currentWindowClass
let currentWindowClass = StringLower (GetWindowClass (GetCurrentWindow ()))
return StringContains (currentWindowClass, "mozilla")
EndFunction

void function EstablishQuickNavState ()
;Stub for applications who must establish a custom quick navigation key state:
;Example: Microsoft Word.
endFunction

script SelectTextBetweenMarkedPlaceAndCurrentPosition()
var
	int bFormsModeActive,
	int bSuccess
if !IsVirtualPCCursor()
|| UserBufferIsActive() then
	if !SelectFromSavedLocationToCurrent () then
		sayFormattedMessage(OT_ERROR, cmsgSelectFromSavedLocationError_l, cmsgSelectFromSavedLocationError_s)
	endIf
	return
endIf
let bFormsModeActive = IsFormsModeActive ()
;Forms mode must be off to get the placemarker count,
;and to select to the temporary placemarker.
;If forms mode is on,
;turn it off silently, and report the toggle later if selection did occur,
;or silently restore it if selection did not occur:
if bFormsModeActive then
	TurnOffFormsMode(FormsModeEventSpeechSilent)
EndIf
if GetPlaceMarkerCount() then
	;gbSelectingTextBetweenMarkedPlaceAndCurrentPosition is used to
	;stop TextSelectedEvent from speaking the selected text:
	let gbSelectingTextBetweenMarkedPlaceAndCurrentPosition = true
	let bSuccess = SelectBetweenTempPlaceMarkerAndCursor()
	let gbSelectingTextBetweenMarkedPlaceAndCurrentPosition = false
EndIf
if !bSuccess then
	sayMessage(ot_error,FormatString (cmsgMarkedPlaceSelectingTextError_l), FormatString (cmsgMarkedPlaceSelectingTextError_s))
	RestoreFormsMode(bFormsModeActive)
else
	SayMessage(ot_status,cmsgMarkedPlaceSelectingText)
	if bFormsModeActive then
		;Notify the user that forms mode was turned off:
		SayFormattedMessage (OT_status, cmsg287_L)
	endIf
endIf
endScript

void function SayNothingFoundEx(int nDirection, string sTag)
var
	string sMessage
If nDirection == S_NEXT then
	Let sMessage = cmsgNoMoreElements
Else
	Let sMessage = cMsgNoPriorElements
EndIf
Let sMessage = FormatString (sMessage, sTag)
SayMessage(OT_ERROR, sMessage)
EndFunction

string function GetNavigationFailedMessageForMoveToNext(int bPostNotification, string sElement, optional int nLevel)
if nLevel == 0
&& (getJCFOption (optWrapNavigation) == ON && !IsVirtualUIAPCCursor())
	return cscNull
endIf
if bPostNotification
	if nLevel == 1
		return FormatString(CVmsgNoNextElementsAtLevel_L, sElement, IntToString(nLevel))
	elif nLevel > 1
		return FormatString(CVmsgNoNextElementsAtLevelInSection_L, sElement, IntToString(nLevel))
	else
		return FormatString(cvmsgNoMoreElements_L, sElement)
	endIf
endIf
if nLevel == 1
	return FormatOutputMessage(ot_error, false,
		CVmsgNoNextElementsAtLevel_L, CVmsgNoNextElementsAtLevel_S,
		sElement, IntToString(nLevel))
elif nLevel > 1
	return FormatOutputMessage(ot_error, false,
		CVmsgNoNextElementsAtLevelInSection_L, CVmsgNoNextElementsAtLevelInSection_S,
		sElement, IntToString(nLevel))
else
	return FormatOutputMessage(ot_error, false,
		cvmsgNoMoreElements_L, cvmsgNoMoreElements_S, sElement)
endIf
EndFunction

string function GetNavigationFailedMessageForMoveToPrior(int bPostNotification, string sElement, optional int nLevel)
if nLevel == 0
&& (getJCFOption (optWrapNavigation) == ON && !IsVirtualUIAPCCursor())
	return cscNull
endIf
if bPostNotification
	if nLevel == 1
		return FormatOutputMessage(ot_error, false,
			CVmsgNoPriorElementsAtLevel_L, CVmsgNoPriorElementsAtLevel_S,
			sElement, IntToString(nLevel))
	elif nLevel > 1
		return FormatString(CVmsgNoPriorElementsAtLevelInSection_L, sElement, IntToString(nLevel))
	else
		return FormatString(cvmsgNoPriorElements_L, sElement)
	endIf
endIf
if nLevel == 1
	return FormatOutputMessage(ot_error, false,
		CVmsgNoPriorElementsAtLevel_L, CVmsgNoPriorElementsAtLevel_S,
		sElement, IntToString(nLevel))
elif nLevel > 1
	return FormatOutputMessage(ot_error, false,
		CVmsgNoPriorElementsAtLevelInSection_L, CVmsgNoPriorElementsAtLevelInSection_S,
		sElement, IntToString(nLevel))
else
	return FormatOutputMessage(ot_error, false,
		cvmsgNoPriorElements_L, cvmsgNoPriorElements_S, sElement)
endIf
EndFunction

void function NotifyNavigationFailed(int MoveDirection, string sElement, optional int nLevel)
var
	string sMsg,
	int bPostNotification
bPostNotification = (GetRunningFSProducts() == product_magic
	; Now we are causing MAGic to post dialogs only if speech is disabled:
	&& isSpeechOff ())
If MoveDirection == s_Next
	sMsg = GetNavigationFailedMessageForMoveToNext(bPostNotification, sElement, nLevel)
Elif MoveDirection == S_Prior
	sMsg = GetNavigationFailedMessageForMoveToPrior(bPostNotification, sElement, nLevel)
endIf
if !sMsg
	if bPostNotification
		sMsg = FormatString(cvmsgNoElements_L, sElement)
	else
	; When we move between emails in outlook, the message needs to be slightly different,
	; as not being able to find any email means that there is only one email.
	; We can therefore not say that there is no email, but that there are no emails to move to.
	var string longMessage, string shortMessage
	if stringCompare(sElement, "Emails") == 0 then
	longMessage = cVmsgNoMoreEmails_L
	shortMessage = cVmsgNoMoreElements_S
	else
	longMessage = cvmsgNoElements_L
	shortMessage = cvmsgNoElements_S
 EndIf
		sMsg = FormatOutputMessage(ot_error, false,
			longMessage, shortMessage, sElement)
	EndIf
EndIf
if bPostNotification
	ExMessageBox(sMsg, msgFocusToFormFieldDialog, MB_OK|MB_ICONASTERISK)
else
	SayMessage(OT_ERROR, sMsg)
endIf
endFunction

Int Function IsTypeOfRegion (int type)
if (type == WT_REGION)
	|| (type == WT_ARTICLE_REGION)
	|| (type == WT_BANNER_REGION)
	|| (type == WT_COMPLEMENTARY_REGION)
	|| (type == WT_CONTENTINFO_REGION)
	|| (type == WT_FORM_REGION)
	|| (type == WT_MAIN_REGION)
	|| (type == WT_NAVIGATION_REGION)
	|| (type == WT_SEARCH_REGION)
	|| (type == WT_DOCUMENT)
	|| (type == 	WT_APPLICATION ) then
	return true
EndIf
return false
EndFunction

string function getSelectedTextForMagic(optional int bWantMarkUp, int bWantAllListViewItemText)
var
	string sDefaultSelection
sDefaultSelection = builtIn::getSelectedText(bWantMarkUp, bWantAllListViewItemText)
if ! isVirtualPcCursor () && ! IsFormsModeActive()  then
	return sDefaultSelection
;Preserve actual selections from virtual buffers,
; where keyboard-heavy users may use the Virtual buffers selection commands,
; and don't get their clipboard overwritten because they verified selection with shift+insert+downArrow.
elif !stringIsBlank (sDefaultSelection) then
	return sDefaultSelection
endIf
TypeKey(cksCopy) ; hard copy to clipboard, outside of virtual buffers, will properly get us the data.
delay (2, TRUE)
return getClipboardText ()
endFunction

string function getSelectedText(optional int bWantMarkUp, int bWantAllListViewItemText)
if getRunningFSProducts () == product_MAGic then
	return getSelectedTextForMagic(bWantMarkUp, bWantAllListViewItemText)
else
	return builtIn::getSelectedText(bWantMarkUp, bWantAllListViewItemText)
endIf
endFunction

string function GetScreenSensitiveHelpForVirtualCursorTable()
return FormatString(cMsgScreenSensitiveHelpTable,
	GetScriptKeyName("JumpToTableCell"),
	GetScriptKeyName("ReadCurrentRow"),
	GetScriptKeyName("ReadCurrentColumn"),
	GetScriptKeyName("StepToEndOfElement"))
EndFunction

string function GetScreenSensitiveHelpForVirtualCursorList()
return FormatString(cMsgScreenSensitiveHelpList,
	GetScriptKeyName("StepToEndOfElement"))
endFunction

string function GetBrowserName(optional int includeMaker)
;Each browser should have a version which will return the application name.
;The optional parameter, if true, specifies that the company name which produces the browser will be included in the return string.
return cscNull
EndFunction

Void Function BrowserVirtualHotKeyHelp()
var
	string ReservedKeysAndActions = GetWebAppReservedKeysAndActions (),
	string message
if ! StringIsBlank (ReservedKeysAndActions) then
	ReservedKeysAndActions = StringTrimLeadingBlanks (StringTrimTrailingBlanks (ReservedKeysAndActions))
	message = formatString (cmsgReservedWebAppKeyAndActionHotKeyHelp, ReservedKeysAndActions)
	;Message must have 2 blanks at the end to accommodate message formatting 
	; where trailing blank lines get lost from a @message variable.
	message = message+cscBufferNewLine+cscBufferNewLine
endIf
message = message+msgBrowserVirtualHotKeyHelp1_L
ShowManagedVirtualHelp(message
	+cscBufferNewLine+cscBufferNewLine
	+FormatString(msgForMoreProductHelp,GetBrowserName()))
EndFunction

Script MoveToControlledTarget ()
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
if IsFormsModeActive () then ;deactivate and then move
	TurnOffFormsMode ()
EndIf
If !MoveToControlledTarget() then
	SayMessage(ot_JAWS_message, MSG_MoveToControlledTargetFailed)
Else
	SayMessage(ot_JAWS_message, MSG_MoveToControlledTargetSucceeded)
	; SayObjectTypeAndText (); doesn't catch all scenarios, 
	; example: Static Texts and decorative elements.
	; SayLine will read the location, if not always the entire context.
	SayLine ()
EndIf
EndScript

Script FollowErrorRelation()
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
if IsFormsModeActive () then ;deactivate and then move
	TurnOffFormsMode ()
EndIf
If !FollowRelation(relation_aria_error_message) then
	SayMessage(ot_JAWS_message, MSG_FollowErrorRelationFailed)
Else
	SayObjectTypeAndText ()
EndIf
EndScript

void function FollowDetailsRelation()
If !(GetRunningFSProducts() & product_JAWS) then
	return
EndIf
if IsFormsModeActive () then ;deactivate and then move
	TurnOffFormsMode ()
EndIf
If !FollowRelation(relation_aria_details) then
	SayMessage(ot_JAWS_message, MSG_FollowDetailsRelationFailed)
Else
	SayObjectTypeAndText ()
EndIf
EndFunction

int function SayExpandedAcronymOrAbbreviation(optional int ignoreJCFSetting)
if !IsVirtualPCCursor() return false endIf
var
	int isOnExpandableAbbrev = GetTagWithAttributeIndex("abbr","title"),
	int isOnExpandableAcronym = GetTagWithAttributeIndex("acronym","title")
if !isOnExpandableAbbrev && !isOnExpandableAcronym return false endIf
if isOnExpandableAbbrev
	if !(ignoreJCFSetting || !GetJCFOption(optExpandAbbreviations)) return false endIf
else
	if !(ignoreJCFSetting || !GetJCFOption(optExpandAcronyms)) return false endIf
endIf
var object node = GetFSXMLElementNode()
if !node return false endIf
var string title = node.attributes.GetNamedItem("title").nodeValue 
if !title return false endIf
Say(title,ot_JAWS_message)
return true
EndFunction

int function IsLinkOrHeadingUnderVirtualCursor ()
; headings can contain links, and their type / subtype info will show as the heading instead.
if ! IsVirtualPcCursor () return FALSE endIf
; use generalized getObjectTypeCode because GetObjectSubtypeCode can be less performant in some places like Outlook.
var int type = getObjectTypeCode ()
return (
	type == WT_LINK
	|| type == WT_MailTo_link
	|| type == wt_ftp
	|| type == wt_ImageMap_link
	; or heading:
	|| (type >= WT_HTML_HEADING1 && type <= WT_HTML_HEADING6)
)
endFunction

string function GetURLForFocusedLink ()
var object XMLDomElement = CreateXMLDomDoc()
if ! XMLDomElement return cscNull endIf
var string xml = GetElementXML (-1)
if stringIsBlank (xml) return cscNull endIf
if ! LoadAndParseXML (XMLDomElement, XML) return cscNull endIf
var object link = XMLDomElement.selectSingleNode("//Link")
if ! link return cscNull endIf
var string URL = link.attributes.GetNamedItem("href").nodeValue 
return URL
endFunction

script virtualContextMenu()
sayCurrentScriptKeyLabel()
;ensure that the focus is at the virtual cursor location before bringing up the context menu:
PCCursor()
RoutePCToVirtual()
rightMouseButton()
endScript

int function ShouldAllowJAWSInspectFunctionToRun()
var string sClass = GetWindowClass(GetFocus())
return (sClass == cwcChromeBrowserClass
		|| sClass==cwcIEServer
		|| sClass==cwcFireFoxBrowserClass
		|| sClass == cwcFireFox4BrowserClass)
	&& !UserBufferIsActive()
EndFunction

script InspectShowFullPageReport()
if !ShouldAllowJAWSInspectFunctionToRun() return endIf
InspectShowFullPageReport()
EndScript

script InspectShowElementInfo()
if !ShouldAllowJAWSInspectFunctionToRun() return endIf
InspectShowElementInfo()
EndScript

script InspectShowElementReport()
if !ShouldAllowJAWSInspectFunctionToRun() return endIf
InspectShowElementReport()
EndScript

script InspectShowSayAllReport()
if !ShouldAllowJAWSInspectFunctionToRun() return endIf
InspectShowSayAllReport()
EndScript

script InspectShowSpeechViewer()
if !ShouldAllowJAWSInspectFunctionToRun() return endIf
InspectShowSpeechViewer()
EndScript

script InspectShowARIALive()
if !ShouldAllowJAWSInspectFunctionToRun() return endIf
if InspectShowARIALive()
	Say(cmsgJAWSInspectShowAriaLiveNotification,ot_JAWS_message)
endIf
EndScript

int function PictureSmartWithControlShared (int serviceOptions)
var 
	string question = cscNULL
if !(GetRunningFSProducts() & product_JAWS) then
	return
endIf
if !IsPictureSmartEnabled() then
	Return
endif
if IsScreenShadeOn () then
	sayMessage (OT_ERROR, msg_picturesmart_UnavailableScreenShade)
	return
endIf

if(serviceOptions & PSServiceOptions_AskPrelim) then 
	if !PictureSmartPromptPreliminaryQuestion(question) then
		return
	EndIf
EndIf

var int result = IsTelemetryEnabled(TRUE);
If result == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)
elif result != PSResult_Success then
	; no message needed since the function prompts
	return
EndIf

result = DescribeCursorEx(serviceOptions, question)
if result == PSResult_DemoMode then
	sayMessage (OT_ERROR,  msg_picturesmart_demomode)	
elif result == PSResult_CursorModeIncorrect then
	sayMessage (OT_ERROR, msg_picturesmart_controlnotgraphic)
elif result == PSResult_NoArea then
	sayMessage (OT_ERROR, msg_picturesmart_noarea)	
elif result != PSResult_Success then
	sayMessage (OT_ERROR, msg_picturesmart_failedtostart)
EndIf
EndFunction

void function EnsureManagedVirtualHelpIsInactive()
if !IsManagedVirtualHelpActive() return endIf
EnsureNoUserBufferActive(false)
EndFunction

void function ManageVirtualPCCursorToggle(int byRef originalState, int byRef newState)
originalState = GetJCFOption (OPT_VIRTUAL_PC_CURSOR)
newState = originalState
if IsVirtualUIAPCCursor() return endIf
if originalState != 1
	newState = 1
	SetJCFOption (OPT_VIRTUAL_PC_CURSOR, newState)
	Pause ()
	Delay (5)
EndIf
EndFunction


void function SayGlanceHighlightAtCursor()
if getObjectStateCode() != 0 then
	sayObjectTypeAndText()
else
	sayChunk()
endIf
endFunction

void function MoveToGlanceHighlight(int dir, int timeBased)
if QuickNavFeatureUnavailable() return EndIf
If !GetCountOfGlanceHighlights()
	NotifyNavigationFailed(NoItemForNavigation,cvmsgGlanceHighlights)
	Return
EndIf

if MoveToGlanceHighlight(dir, timeBased) then
	SayGlanceHighlightAtCursor()
else
	NotifyNavigationFailed(dir,cvmsgGlanceHighlights, -1)
endIf
endFunction

Int Function SelectAGlanceHighlightDialog ()
if !VirtualViewerFeatureAvailable(true,true,true) then
	return
EndIf

var
	int RunningProducts,
	string sGlanceHighlights,
	int iIndex,
	int iCurrentIndex
	
sGlanceHighlights= GetListOfGlanceHighlights()
iCurrentIndex=GetNearestGlanceHighlightIndex()
if iCurrentIndex==0 then
	NotifyNavigationFailed(NoItemForNavigation,cvmsgGlanceHighlights)
	return
endIf
if IsFormsModeActive()
	TurnOffFormsMode(FormsModeEventSpeechSilent)
endIf
let iIndex = DlgSelectItemInList(sGlanceHighlights, cmsgSelectAGlanceHighlight, FALSE,iCurrentIndex)
Delay(2)
if iIndex then
	MoveToGlanceHighlightByIndex(iIndex)
	SayGlanceHighlightAtCursor()
endIf
EndFunction

int function InHTMLTableCursorLocation()
if !IsVirtualPCCursor()
|| !InTable()
	return InHTMLTable_False
endIf
var int x, int y
GetCellCoordinates(x,y)
if x != 0 || y != 0
	;We don't yet know of any instance where the row/column coordinates can have only one of them 0,
	;but for the current scenario we assume that they must both be either 0 or non-zero:
	return InHTMLTable_Normal
endIf
var string tags = GetElementDescription(GetAncestorCount(),true)
if !tags
	;This is not expected, but added as a safety check.
	return InHTMLTable_Unknown
endIf
var
	string delim,
	int count,
	int i,
	string s
delim = MakeCharacterFromValue(10) ;This is the delimiter used in the list of tags
count = StringSegmentCount(tags,delim)
for i = 1 to count
	s = StringSegment(tags,delim,i)
	if s == "CAPTION"
		return InHTMLTable_Caption
	elif s == "TABLE"
		;We are not in a cell, and we didn't find a caption, so we are on the table start or end string.
		;We can get the table index if on the start string, and most of the time if on the end string.
		;So far, it appears that the failure to get the table index happens for the last table on the page.
		if GetTableIndex()
			return InHTMLTable_StartOrEnd
		else
			return InHTMLTable_End
		endIf
	endIf
endFor
return InHTMLTable_Unknown
EndFunction

int function IsOnHTMLTableBorderOrCaption()
var int location = InHTMLTableCursorLocation()
return location == InHTMLTable_StartOrEnd
	|| location == InHTMLTable_End
	|| location == InHTMLTable_Caption
EndFunction

int function MoveFromHTMLTableStartOrCaptionToFirstTableCell()
var int location = InHTMLTableCursorLocation()
if location != InHTMLTable_StartOrEnd
&& location != InHTMLTable_Caption
	return false
endIf
;The move to table will move to the first cell in the table:
return MoveToTableByIndex(GetTableIndex())
EndFunction

int function SpeakHTMLTableBorderOrCaptionCursorNavigationError()
var int location = InHTMLTableCursorLocation()
if location == InHTMLTable_StartOrEnd
	Say(cmsgNavigateTableFailedHlp,ot_help)
	return true
elif location == InHTMLTable_End
	Say(cmsgNavigateFromTableEndFailedHlp,ot_help)
	return true
elif location == InHTMLTable_Caption
	Say(cmsgNavigateFromTableCaptionFailedHlp,ot_help)
	return true
endIf
return false
EndFunction

int function SayCellWhenOnTableBorderOrcaption()
;Saycell would just say blank,
;but here we will instead speak either the table start/end string,
;or the table caption or summary along with the information that it is a table caption.
var int location = InHTMLTableCursorLocation()
var int subtypeCode = GetObjectSubtypeCode()
var string text
if location == InHTMLTable_StartOrEnd
	;If on the start string, the subtypeCode is table.
	; If on the table end string, the subtypeCode will sometimes fail to return as table.
	;if on the summary text, the subtypeCode is unknown.
	if subtypeCode == wt_unknown
		;see if the table has a summary:
		text = GetTableSummary()
		if text
			Say(text,ot_line)
			SayUsingVoice(vctx_message,cmsgTableSummaryTypeTextforSayCell,ot_line)
		endIf
	elif subtypecode == wt_table
		SayLine()  ;table with x columns and y rows, etc.
	else
		SayObjectTypeAndText()
	endIf
	return true
elif location == InHTMLTable_End
	SayLine()  ;table end
	return true
elif location == InHTMLTable_Caption
	if subtypeCode != wt_unknown
	&& subtypeCode != wt_static
		;captions can be marked up as heading levels:
		SayObjectTypeAndText()
	else
		text = GetTableCaption()
		if text
			Say(text,ot_line)
		endIf
	endIf
	SayUsingVoice(vctx_message,cmsgTableCaptionTypeTextforSayCell,ot_line)
	return true
endIf
return false
EndFunction

void function ProcessMoveToEmail(int MoveDirection)
if QuickNavFeatureUnavailable() return EndIf
var
	string sentBy,
	string sentAt
if MoveToEmail(MoveDirection, sentBy, sentAt)
	if (!StringIsBlank(sentBy) || StringLength(sentBy) != 0) && (!StringIsBlank(sentAt) || StringLength(sentAt) != 0)
		SayFormattedMessage(OT_Message, FormatString(CMSGSentByAndAt, sentBy, sentAt))
	else
		SayMessage(OT_Message, CMSGReachedTopOfEmailChain)
	endIf
	if !SayAllInProgress() || MoveDirection == s_Top || MoveDirection == s_Bottom
		SayLine()
	EndIf
else
	NotifyNavigationFailed(MoveDirection, CVMSGEmail)
EndIf
EndFunction

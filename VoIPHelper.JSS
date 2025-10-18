; Copyright 2010-2015 by Freedom Scientific, Inc.
;	Script file for Skype default functionality.

Include "HJConst.jsh"
Include "HJGlobal.jsh"
Include "Common.jsm"
Include "VoIPHelper.jsm"
Include "VoIPHelper.jsh"
include "UIA.jsh"

import "UIA.jsd"

Messages
@MSG_ConcatenateStrings
%1%2
@@
@MSG_SelectFunctionToRunItemTemplate
%1:%2
@@
@MSG_SelectFunctionToRunItemsTemplate
%1|%2
@@
EndMessages

Const
	ComEventsPrefix = "SkypeEvent",
	FN_AttachToSkypeComAPI = "AttachToSkypeComAPI",
	FN_SaveApplicationSettings = "SaveApplicationSettings",
	SkypeCOMObjectName = "Skype4COM.Skype"

Globals
	int SkypeDesktopApplicationHasFocus,
	Object goSkype,
	String gsLastChatMessageBody,
	String gsLastCallInfo,
	Int giAnnounceContacts,
	Int giAnnounceChatMessages

Int Function AttachToSkypeComAPI ()
var
	Int iSkype

let iSkype = AllowedToUseSkypeAPI ()
If Not iSkype then
	let goSkype = CreateObject (SkypeCOMObjectName)
	If goSkype then
		If GetCurrentSkypeMajorVersion () > 3 then
			ComRelease (goSkype, TRUE)
			Return (FALSE)
		EndIf
		If ComAttachEvents (goSkype, ComEventsPrefix) then
			goSkype.Attach (5)
			Delay (3, TRUE)
			If Not goSkype.AttachmentStatus then	; success
				If goSkype.Client.IsRunning then
					LoadApplicationSettings ()
				EndIf
				Return (TRUE)
			EndIf
		EndIf
	EndIf
ElIf iSkype == 1 then
	If Not DefaultFirstTime then
		SayFormattedMessage (OT_JAWS_MESSAGE, MSG_AllowJAWSToUseSkype_L, MSG_AllowJAWSToUseSkype_S)
	EndIf
	ScheduleFunction (FN_AttachToSkypeComAPI, 10)
	Return (FALSE)
ElIf iSkype == 2 then
	Return (FALSE)
EndIf
Return (FALSE)
EndFunction

Int Function SkypeStart ()
;If Not goSkype then
	;Return (AttachToSkypeComAPI ())
;EndIf
;Return (TRUE)
EndFunction

Int Function SkypeEventCallStatus (object ByRef oCall, string sStatus)
var
String sDisplayName,
	String sCallStatus

let sDisplayName = oCall.PartnerDisplayName
let sCallStatus = goSkype.Convert.CallStatusToText (sStatus)
If Not (StringIsBlank (sDisplayName)
|| StringIsBlank (sCallStatus)) then
	let gsLastCallInfo = FormatString (MSG_StatusAnnouncement_L, sDisplayName, sCallStatus)
	SayMessage (OT_STATUS, FormatString (MSG_StatusAnnouncement_L, sDisplayName, gsLastCallInfo))
EndIf
EndFunction

Int Function SkypeEventOnlineStatus (object ByRef oUser)
var
	String sUserName,
	String sUserStatus

let sUserName = oUser.DisplayName
If StringIsBlank (sUserName) then
let sUserName = oUser.FullName
EndIf
let sUserStatus = goSkype.Convert.OnlineStatusToText (oUser.OnlineStatus)
If Not (StringIsBlank (sUserName)
|| StringIsBlank (sUserStatus)) then
	If (! giAnnounceContacts)
	|| (giAnnounceContacts == 1
	&& oUser.OnlineStatus != 1) then
		Return
	EndIf
	SayMessage (OT_STATUS, FormatString (MSG_StatusAnnouncement_L, sUserName, sUserStatus))
EndIf
EndFunction

Int Function SkypeEventAttachmentStatus (String sStatus)
If sStatus == 4 then
	goSkype.Attach(5)
EndIf
EndFunction

Int Function SkypeEventMessageStatus (object ByRef oChatMessage, string sStatus)
var
	String sDisplayName,
	String sTimeStamp,
	String sMessageBody

let sTimeStamp = oChatMessage.Timestamp
let sDisplayName = oChatMessage.FromDisplayName
let sMessageBody = oChatMessage.Body
If gsLastChatMessageBody != sMessageBody
&& giAnnounceChatMessages
&& (! (StringIsBlank (sDisplayName)
|| StringIsBlank (sMessageBody))) then
	SayMessage (OT_STATUS, FormatString (MSG_MessageTemplate, sTimeStamp, sDisplayName, sMessageBody))
EndIf
let gsLastChatMessageBody = sMessageBody
EndFunction

Int Function IsSkypeActive ()
	If goSkype
	&& goSkype.Client.IsRunning then
	Return (TRUE)
EndIf
Return (FALSE)
EndFunction


Int Function GetCurrentSkypeMajorVersion ()
var
	Handle hSkypeMainWindow,
	String sOwnerApplication,
	Int iVersion

If IsSkypeActive () then
	let hSkypeMainWindow = FindTopLevelWindow (WC_MainSkypeWindow, cScNull)
	If hSkypeMainWindow then
		let sOwnerApplication = GetWindowOwner (hSkypeMainWindow)
		If StringContains (sOwnerApplication, SkypeApplicationName) then
			Return (GetProgramVersion (sOwnerApplication))
		EndIf
	EndIf
EndIf
Return (FALSE)
EndFunction

Int Function LoadApplicationSettings ()
let giAnnounceContacts = IniReadInteger (SkypeSettingsSectionName, SkypeStatusAnnouncementToggleKey, 1, SkypeSettingsFileName)
let giAnnounceChatMessages = IniReadInteger (SkypeSettingsSectionName, SkypeChatAnnouncementToggleKey, 0, SkypeSettingsFileName)
Return (TRUE)
EndFunction

Int Function SaveApplicationSettings ()
var
	Int iResult

If InHJDialog () then
	ScheduleFunction (FN_SaveApplicationSettings, 5)
	Return (-1)
EndIf
If giAnnounceContacts != IniReadInteger (SkypeSettingsSectionName, SkypeStatusAnnouncementToggleKey, 1, SkypeSettingsFileName) then
	let iResult = IniWriteInteger (SkypeSettingsSectionName, SkypeStatusAnnouncementToggleKey, giAnnounceContacts, SkypeSettingsFileName)
EndIf
If giAnnounceChatMessages != IniReadInteger (SkypeSettingsSectionName, SkypeChatAnnouncementToggleKey, 1, SkypeSettingsFileName) then
	let iResult = IniWriteInteger (SkypeSettingsSectionName, SkypeChatAnnouncementToggleKey, giAnnounceChatMessages, SkypeSettingsFileName)
EndIf
Delay (1, TRUE)
If iResult then
	SayMessage (OT_STATUS, MSG_ApplicationSettingsSaved)
EndIf
Return (iResult)
EndFunction

string Function NodeHlp (string sNodeName)
if StringContains(sNodeName,SkypeNodeName) then
	Return MSG_SkypeNodeHelp
else
	return NodeHlp(sNodeName)
endIf
EndFunction

String Function StatusAnnouncementToggleHlp (int iRetCurVal)
Return (MSG_SkypeStatusAnnouncementItemHelp)
EndFunction

String Function ChatAnnouncementToggleHlp (int iRetCurVal)
Return (MSG_SkypeChatAnnouncementItemHelp)
EndFunction

String Function StatusAnnouncementToggle (int iRetCurVal)
If Not iRetCurVal then
	let giAnnounceContacts = giAnnounceContacts + 1
	If giAnnounceContacts > 2 then
		let giAnnounceContacts = 0
	EndIf
	ScheduleFunction (FN_SaveApplicationSettings, 10)
EndIf
If Not giAnnounceContacts then
	Return (MSG_SuppressAnnouncement)
ElIf giAnnounceContacts == 1 then
	Return (MSG_AnnounceOnline)
ElIf giAnnounceContacts == 2 then
	Return (MSG_AnnounceAll)
EndIf
EndFunction

String Function ChatAnnouncementToggle (int iRetCurVal)
If Not iRetCurVal then
	let giAnnounceChatMessages = Not giAnnounceChatMessages
	ScheduleFunction (FN_SaveApplicationSettings, 10)
EndIf
If Not giAnnounceChatMessages then
	Return (MSG_SuppressAnnouncement)
ElIf giAnnounceChatMessages then
	Return (MSG_Announce)
EndIf
EndFunction

String Function TreeCoreGetDefaultSkypeOptions ()
Var
	String sBranch

Let sBranch  = FormatString (MSG_SelectFunctionToRunItemTemplate, SkypeStatusAnnouncementFunctionName, SkypeStatusAnnouncementItemName)
let sBranch = FormatString (MSG_SelectFunctionToRunItemsTemplate, sBranch, FormatString (MSG_SelectFunctionToRunItemTemplate, SkypeChatAnnouncementFunctionName, SkypeChatAnnouncementItemName))
ConvertListToNodeList (sBranch, SkypeNodeName)
Return (sBranch)
EndFunction

Void Function SayLastCallInfo ()
SayMessage (OT_USER_REQUESTED_INFORMATION, gsLastCallInfo)
EndFunction

void function SkypeDesktopSpeakNotFound (string name)
sayMessage (OT_ERROR, formatString (msgSkypeDesktopButtonNameNotFound, Name))
endFunction

object function SkypeDesktopFindButtonInWindowWithName (handle window, string sName)
var object oUIA = CreateObjectEx ("FreedomSci.UIA", 0, "UIAScriptAPI.x.manifest" )
if !oUIA return null() endIf
var object element = oUIA.GetElementFromHandle(window).buildUpdatedCache()
if !element return null() endIf
var object condition = oUIA.CreateIntPropertyCondition(UIA_ControlTypePropertyId,UIA_ButtonControlTypeId)
if !condition return null() endIf
var object buttons = element.findAll(treeScope_descendants,condition)
var int i, int buttonsCount = buttons.count
if !buttonsCount return null() endIf
for i = 0 to buttonsCount-1
	if  stringContains (buttons(i).Name,sName) 
	&& ! stringContains (buttons(i).name, scSkypeIsUsingMicrophone) then
		return buttons(i)
	endIf
endFor
return null()
EndFunction

int function PressCorrespondingKeystrokeWhenSkypeDesktopHasFocus (string name)
if ! SkypeDesktopApplicationHasFocus then return FALSE endIf
if name == sc_SkypeDesktop_Answer then
	typeKey (ksSkypeDesktopAnswer)
	return TRUE
elIf name == sc_SkypeDesktop_Disconnect then
	typeKey (ksSkypeDesktopDisconnect)
	return TRUE
endIf
return FALSE
endFunction

int function SkypeDesktopActivateButtonByInvokePattern (object button)
var object invokePattern = button.GetInvokePattern()
if ! invokePattern then return FALSE endIf
if invokePattern.Invoke() then
; value is -1 or UIATrue
return TRUE
else
	return FALSE
endIf
endFunction

int function SkypeDesktopClickButtonInWindow(handle hWnd, string name)
if ! hWnd then
	SkypeDesktopSpeakNotFound (name)
return false
endIf
var object button = SkypeDesktopFindButtonInWindowWithName(hWnd,Name)
if !button return false endIf
var int x, int y
if SkypeDesktopActivateButtonByInvokePattern (button) then return TRUE endIf
button.GetClickablePoint( intRef(x), intRef(y))
if (!x || !y) return false endIf
ClickAtPoint(x,y)
return true
EndFunction

handle function getSkypeDesktopMainWindow ()
var handle window = getTopLevelWindow (getFocus ())
window = getFirstWindow (window)
while (getNextWindow (window))
	if isWindowVisible (window)
	&& getWindowClass (window) == wcSkypeChromiumMainWindowClass
	&& stringContains (GetWindowName (window), sc_SkypeDesktop_Window1)
		return window
	endIf
	window = getNextWindow (window)
endWhile
return null ()
endFunction

void function SkypeFocus ()
var handle window = FindTopLevelWindow(ShellTrayClass,cscNull)
if ! window then return endIf
window = FindWindow(window,cwc_TrayNotifyWnd) 
if ! window then return endIf
if ! SkypeDesktopClickButtonInWindow(window, sc_SkypeDesktop_Window3)
&& ! SkypeDesktopClickButtonInWindow(window,sc_SkypeDesktop_Window2) then
	SkypeDesktopClickButtonInWindow(window,sc_SkypeDesktop_Window1)
endIf
EndFunction

function SkypeDesktopEndCall ()
;if PressCorrespondingKeystrokeWhenSkypeDesktopHasFocus (sc_SkypeDesktop_Disconnect) then return endIf
var handle skypeWindow = getSkypeDesktopMainWindow ()
if ! skypeWindow then return endIf
if ! SkypeDesktopApplicationHasFocus then
SkypeDesktopClickButtonInWindow(SkypeWindow,sc_SkypeDesktop_Window2)
endIf
delay (2)
if ! SkypeDesktopClickButtonInWindow (skypeWindow, sc_SkypeDesktop_Disconnect) then
	SayMessage (OT_ERROR, msgSkypeDesktopNoOngoingCall)
	return
endIf
EndFunction

function SkypeDesktopAnswerCall ()
if ! SkypeDesktopClickButtonInWindow (getSkypeDesktopMainWindow (), sc_SkypeDesktop_Answer) then
	SayMessage (OT_ERROR, msgSkypeDesktopNoIncomingCall)
endIf
EndFunction


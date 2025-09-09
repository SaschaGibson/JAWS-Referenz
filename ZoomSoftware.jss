; Basic Scripts for the Zoom Conferencing Client.
; Prepared and updated by Brian Hartgen, Hartgen Consultancy, 27 January 2022. 
; Tested against Zoom Meetings Version 5,9,3,3169
; JAWS version 2022.2201.54 
; New comments preceeded by a double at sign.
include "hjconst.jsh" ; default constants, also includes HjIni.jsh for default section and key names
include "hjglobal.jsh"
include "common.jsm"
include "ZoomSoftware.jsm"

import "Say.jsd"

CONST
	ZoomNotificationWindowClass = "zoom_acc_notify_wnd",
	ZoomSchedulerComboBoxClass = "ZPWndSchedulerClass",
	ZoomSettingsComboBoxClass = "ZPSettingWndClass",
	ZoomChatClass = "ZPPTMainFrmWndClassEx"

globals
	Int ZoomFirstTime, ; because we're not storing settings any longer.
	collection customBrailleComboBoxData,
	int zUseTypeKey,
	string zRepeat,
	int ZAlert,
	string zNotificationOutput,
	int zChat,
	string SSpeakerName,
int HasSpokenCategory,
int Participants,
string ObjectName,
string PrevListOutput,
int Line,
string ListOutput,
String zSText,
int focusInChatEdit

; @@ For Notification Manager exclusions.


void function AutoStartEvent ()
focusInChatEdit = false
var string JAWSLanguage = stringLower (GetJFWLang ())
; preserve {} functionality for English users who potentially use Dragon.
zUseTypeKey = (JAWSLanguage != "enu")
ShowSoundMixerDiscoveryDialog()
endFunction

void Function LoadNonJCFOptions ()
; Load preferences.
; @@ Older code commented out in the event there is a strategy change later down the road. But for now, we're not retaining preferences.

; @@ When we restart JAWS, we must enable all alerts. Otherwise, keep the user's preference even when switching out of Zoom and back.
if ZoomFirstTime == 0 then 
	Let ZoomFirstTime = 1
	ZAlert = 1 ; @@ We only want to set it to a value of 1 if JAWS is restarted.

	; For now, we don't want this as it stores a preference.
	; ZAlert = getNonJCFOption ("ZAlert")
	let zChat = 0
	; For now, we don't want this as it stores a preference.
	; zChat = getNonJCFOption ("Chat")
EndIf ; End of Zoom first time run.
LoadNonJCFOptions () ; defaults
EndFunction

;  To accompany script to remind users as to what they've got.

Function SettingsReminder ()
if ZAlert== 0 then 
	SayUsingVoice (VCTX_Message, MSGAlertsDisabled, ot_user_requested_information)
else
	SayUsingVoice (VCTX_Message, MSGAlertsEnabled, ot_user_requested_information)
endIf
if zChat == 1 then 
	SayUsingVoice (VCTX_Message, MSGExtendedChat, ot_user_requested_information)
else
	SayUsingVoice (VCTX_Message, MSGExtendedAlerts, ot_user_requested_information)
endIf
EndFunction
;  The next three functions have been rewritten.

void function MSAAAlertEvent(handle hwnd, int nTime, string SText, int nAlertLevel, string appName)
if getWindowClass (hwnd) != ZoomNotificationWindowClass then; Not a Zoom Alert.
	return MSAAAlertEvent (hwnd, nTime, SText, nAlertLevel, appName)
endIf ; End of default Alert.
var
	string sMsgLong,
	string sMsgShort;
Let sMsgLong = SText
; Process the alerts and chats.
let ZRepeat = SText ; Store the Alert for processing and output.
if StringContains (SText, MSGBandwidth) then ; For when Zoom erroneously reports bandwidth is low
	return
endif
; Are we recording or is recording paused? 
; Because synthetic speech announcing the recording status is now automatically transmitted to audience participants, we only need to say this if all alerts are enabled; if the user has specifically requested it, otherwise it is overbaring.
if ZAlert == 1 then ; Alerts are enabled
	if StringContains (SText, MSGRecord) 
		|| StringContains (SText, MSGPause) then
 ;  Change speech messages. There is Braille output with this type.
 ; @@ For Notifications Manager.
 var collection NotificationRuleActions = ProcessNotification(sText, appName)
SayNotification (notificationRuleActions, ot_help)
if !notificationRuleActions.ExcludeFromNotificationHistory then
	storeSpokenNotificationForRepeat (SText, appName) ; for new insert+Space&N keystroke.
endIf
; @@ End of Notifications Manager
return
EndIf ; Whether the user wants to hear this.
endIf ; End of anything related to recording.

; Talking requires special handling.
if StringContains (SText, MSGTalking) then ; Is the placeholder vacant or is someone actually talking.
	let SSpeakerName = SText
	ProcessNameOfSpeaker () ; separate function to ensure this is less cluttered.
return
endIf ; end of someone talking.
; User preference for incoming messages.
if ZChat == 1   then ; Chat messages only are required.
	SpeakMessagesOnly ()
return
endif ; end of user preference for chat messages.

if StringIsBlank (zNotificationOutput) then ; we have nothing.
	let zNotificationOutput = ZRepeat
else ; add it to what we've got.
	let zNotificationOutput = zNotificationOutput+"|"+ZRepeat
EndIf ; end of notification capture.
; If we've got this far and the user wants to hear Alerts then send them to output.
if ZAlert == 1 then 
		;  Change speech messages. There is Braille output with this type.
		; @@ For Notifications Manager
		notificationRuleActions = ProcessNotification(zRepeat, appName)
SayNotification (notificationRuleActions, ot_help)
; We don't want to save chat messages, or alerts excluded from history by the user
if !NotificationRuleActions.ExcludeFromNotificationHistory && (!StringStartsWith(zRepeat, scChatMessageIndicator) && !StringStartsWith(zRepeat, scPersonalChatMessageIndicator)) then
	StoreSpokenNotificationForRepeat(zRepeat, appName)
endIf
; @@ End of Notifications Manager
EndIf ; end of Alert notifications if the user has selected them.

endFunction

; special handling for speaker names.

Function ProcessNameOfSpeaker ()
let SSpeakerName = StringTrimTrailingBlanks (SSpeakerName); avoid trailing space.
;  StringsEqual is no longer necessary.
if SSpeakerName == MSGTalking then  ; Zoom has not detected a speaker.
	SayUsingVoice (VCTX_Message, MSGSpeakerNotDetected, ot_user_requested_information)
else ; we have a speaker but the word Talking is unnecessary.
	let SSpeakerName = StringReplaceSubstrings (SSpeakerName , MSGTalking, "")
	let SSpeakerName = StringTrimLeadingBlanks (SSpeakerName) ; clean output.
;  Change speech messages. There is Braille output with this type.
SayFormattedMessage (ot_help, SSpeakerName, SSpeakerName) 
EndIf ; end of whether we have legitimate name.

EndFunction

void Function SpeakMessagesOnly ()
if StringStartsWith(zRepeat, scChatMessageIndicator) then ; we want it if the user has selected chat only.
	if StringIsBlank (zNotificationOutput) then ; we've got nothing so far.
		let zNotificationOutput = zRepeat
	else ; add it to what we've got.
		let zNotificationOutput = zNotificationOutput+"|"+zRepeat
	endIf ; end of whether we have a chat message.
;  Change speech messages. There is Braille output with this type.
SayFormattedMessage (ot_help, ZRepeat, ZRepeat) 
endIf ; whether the Alert contains a chat.
EndFunction

;  older code for the time being.

Script SayAlert ()
if StringIsBlank (zRepeat) then 
	sayMessage (OT_ERROR, MSGNoAlertsAvailable)
else
	SayMessage (OT_USER_REQUESTED_INFORMATION, zRepeat)
endIf
EndScript


Script ToggleAlerts ()
; @@ New for January 2022.
if ZAlert== 0 then 
	let ZAlert= 1
	SayUsingVoice (VCTX_Message, MSGAlertsEnabled, OT_STATUS)
else
	let ZAlert= 0
	SayUsingVoice (VCTX_Message, MSGAlertsDisabled, OT_STATUS)
endIf
; @@ We're not retaining this for now.
; WriteSettingInteger (Section_NonJCFOptions, "ZAlert", ZAlert, FT_CURRENT_JCF)
EndScript

Script ToggleChatMessages ()
if zChat == 0 then 
	let zChat = 1
	SayUsingVoice (VCTX_Message, MSGExtendedChat, ot_user_requested_information)
else
	let zChat = 0
	SayUsingVoice (VCTX_Message, MSGExtendedAlerts, ot_user_requested_information)
endIf
; @@ We're not retaining this for now.
; WriteSettingInteger (Section_NonJCFOptions, "Chat", zChat, FT_CURRENT_JCF)
EndScript

 

void Function SayAlertInfo ()
; A regular alert is produced here so if the user has disabled these we should ignore the request.
if ZAlert== 0 then 
	Say (zRepeat, OT_USER_REQUESTED_INFORMATION)
endIf
EndFunction

Script ScriptFileName()
ScriptAndAppNames (msgAppName)
EndScript

Script HotkeyHelp ()
if UserBufferIsActive () then 
	UserBufferDeactivate ()
EndIf
UserBufferClear ()
SayFormattedMessage (Ot_User_Buffer, MSGHotkeyHelp+cscBufferNewLine+cscBufferNewLine)
SayFormattedMessage (Ot_User_Buffer, MSGPressEscape)
EndScript

void function sayZoomNotification (int notificationNumber)
; we're doing stringSegments from the right, so subtract from 0 to make it a negative number
notificationNumber = (0-notificationNumber)
var
	string output
let output = StringSegment (zNotificationOutput, "|", notificationNumber)
if StringIsBlank (output) then 
	sayMessage (OT_ERROR, MSGNoAlertsAvailable)
	return
endIf
if IsSameScript () then 
	SayFormattedMessage (Ot_User_Buffer, output)
	SayFormattedMessage (Ot_User_Buffer, MSGPressEscape)
else
	Say (output, OT_USER_REQUESTED_INFORMATION)
EndIf
endFunction

Script SayNotification1 ()
sayZoomNotification (1)
EndScript

Script SayNotification2 ()
sayZoomNotification (2)
EndScript

Script SayNotification3 ()
sayZoomNotification (3)
EndScript

Script SayNotification4 ()
sayZoomNotification (4)
EndScript

Script SayNotification5 ()
sayZoomNotification (5)
EndScript

Script SayNotification6 ()
sayZoomNotification (6)
EndScript

Script SayNotification7 ()
sayZoomNotification (7)
EndScript

Script SayNotification8 ()
sayZoomNotification (8)
EndScript

Script SayNotification9 ()
sayZoomNotification (9)
EndScript

Script SayNotification10 ()
sayZoomNotification (10)
EndScript

;  Detect Participants List.

Function IsParticipantsList ()
var
handle grip,
string SParticipants
let grip = GetFocus ()
let SParticipants = GetWindowName (grip)
if StringContains (SParticipants, MSGParticipant) 
	|| StringContains (SParticipants, MSGAttendee)  then ; this is the correct area but is it the List Box?
		if GetObjectType ()== "list box item" then ; this is the Participants List.
return true
else
	return false
endif
endif

EndFunction



Function IsChatList ()
var
handle grip,
string SChats
let grip = GetFocus ()
let SChats= GetWindowName (grip)
if StringContains (SChats, MSGChat) 
	&& GetObjectType ()== "list box item" then ; this is the Chat List.
	return true
else
	return false
endif

EndFunction

 void function focusChangedEvent(handle hwnd, handle hwndPrev)
;  Suppress unwanted speech, temporary measure.  
if (hwnd == hwndPrev 
&& focusInChatEdit && IsFocusInChatEdit())
	return
EndIf
focusInChatEdit = IsFocusInChatEdit()

if IsParticipantsList ()  
|| IsChatList () then 
	return
EndIf

; Default.
focusChangedEvent(hwnd, hwndPrev)

endFunction
int Function handleCustomWindows (handle FocusWindow)
var
	handle realWindow,
	int type,
	string realWindowName,
	string SObjectName,
	string output,
	int WindowHierarchyX,
	; for SayControlEX function:
	string controlName,
	string controlType = getObjectType (),
	string controlValue
customBrailleComboBoxData = new collection ; clear previously cached combo items
type = getObjectSubtypeCode ()
; identify the various controls
realWindow = GetRealWindow (focusWindow)
realWindowName = GetWindowName (realWindow)
WindowHierarchyX = GetWindowHierarchyX (focusWindow)
;  Is this the Settings dialog?
if type == WT_LISTBOXITEM 
&& RealWindowName == MSGSettings then ; it is the Settings List Box.
	if HasSpokenCategory == 0 then ; speak the prompt to let the user know the location.
		SayUsingVoice (VCTX_Message, MSGCategoryList, Ot_User_Requested_Information)
	EndIf ; End of whether we should say the prompt.
	let HasSpokenCategory = 1 ; Set the flag so we don't say it again.
else
	let HasSpokenCategory = 0 ; We can say the prompt now.
endif ; End of Settings List Box.
if GetObjectName(SOURCE_CACHED_DATA, 0)== MSGScreenShare then ; Screen share is active but there is no focus.
	PerformScript Tab ()
return
EndIf ; end of screen share.

if type != WT_COMBOBOX
; outside of meeting scheduler or not on troublesome combo boxes.
	return handleCustomWindows (focusWindow)
endIf
var string objectClassName = getObjectClassName ()
if WindowHierarchyX == 1 then 
	controlName = MSGDate
	controlValue = GetObjectValue(SOURCE_CACHED_DATA)
elif WindowHierarchyX == 2 then 
	controlName = MSGTime
	controlValue = GetObjectValue(SOURCE_CACHED_DATA)
elif WindowHierarchyX == 3 then 
	controlName = MSGHours
	controlValue = GetObjectValue(SOURCE_CACHED_DATA)
elif WindowHierarchyX == 4 then 
	controlName = MSGMinutes
	controlValue = GetObjectValue(SOURCE_CACHED_DATA)
elIf objectClassName  == ZoomSchedulerComboBoxClass 
|| objectClassName == ZoomSettingsComboBoxClass then
	getDataFromCustomComboBoxes (controlName, controlValue)
endif ; end of timezone
if stringIsBlank (controlName) then
return handleCustomWindows (focusWindow)
endIf
; just for code readability, the following variables are empty:
var string controlState, string containerName, string containerType;
sayControlEX (focusWindow, controlName, controlType, controlState, containerName, containerType, controlValue)
return TRUE
EndFunction

void function getDataFromCustomComboBoxes (string byRef name, string byRef value)
var string text = getObjectName ()
if ! stringContains (text, "(") && ! stringContains (text, ")") then
	name = text
	value = getObjectValue (SOURCE_CACHED_DATA)
	return
endIf
name = stringSegment (text, "(", 1)
text = stringChopLeft (text, stringLength (name))
value = stringSegment (text, ")", 1)+")"
name = stringTrimTrailingBlanks (name)
value = stringTrimLeadingBlanks (value)
; Now remove extra content from Name component by substituting:
if stringContains (name, wnTimeZone) then
	name = msgTimeZone
elIf StringContains (name, wnMicrophone) then
	name = msgMicrophone
elIf stringContains (name, wnSpeakers) then
	name = msgSpeakers
endIf
endFunction

int function BrailleCallbackObjectIdentify ()
var
	int typeCode = getObjectTypeCode (),
	string objectClassName = getObjectClassName (),
		string controlName, string controlValue
if typeCode == WT_DIALOG then
; could be dialog or dialog page:
	return WT_STATIC
elIf ! typeCode && getObjectClassName () == "ZPFTEWndClass" then
; a static whose name is relevant:
	return WT_STATIC
endIf
If objectClassName  == ZoomSchedulerComboBoxClass 
|| objectClassName == ZoomSettingsComboBoxClass then
; can't automatically pass collection items into a param, so use the local variables first:
	getDataFromCustomComboBoxes (controlName, controlValue)
	customBrailleComboBoxData.controlName = controlName
	customBrailleComboBoxData.ControlValue = controlValue
endIf
if (focusInChatEdit)
	return WT_EDIT
EndIf

return BrailleCallbackObjectIdentify ()
endFunction

int function BrailleAddObjectName (int subtypeCode)
if (focusInChatEdit)
	return TRUE
EndIf
	
if subtypeCode != WT_COMBOBOX 
|| ! CollectionItemCount (customBrailleComboBoxData) then
	return BrailleAddObjectName (subtypeCode)
endIf
BrailleAddString (customBrailleComboBoxData.ControlName,0,0,0)
return TRUE
endFunction

int function BrailleAddObjectValue (int subtypeCode)
if subtypeCode == WT_COMBOBOX 
&& CollectionItemCount (customBrailleComboBoxData) then
	BrailleAddString (customBrailleComboBoxData.ControlValue,0,0,0)
	return TRUE
endIf
; Handle edits.
; The Zoom Cloud Meeting app uses a single window containing all controls. 
;It does not appear to support the UIA text pattern. 
;Text in the window is rendered in the OSM and JAWS can track the caret. 
;We thus add the focused line if the subtype code is WT_EDIT and the window class is ZPFTEWndClass etc.
if subtypeCode==WT_EDIT then
	var string class = GetWindowClass(GetFocus())
	if class=="ZPFTEWndClass"  ; main window
		|| class=="zWaitHostWndClass" ; Meeting ID or name field.
		|| class=="ZPConfChatWndClass" ; meeting chat area.
		|| class=="ConfMeetingInfoWndClass" then
		BrailleAddFocusLine();
		return true
	endIf
endIf

if (focusInChatEdit)
	BrailleAddFocusLine();
	return TRUE
EndIf

if subtypeCode != WT_STATIC then
	return BrailleAddObjectValue (subtypeCode)
endIf
; where we have a dialog or dialog page with focus, and Braille would otherwise be empty:
var string text = GetObjectName(SOURCE_CACHED_DATA)
if ! stringIsBlank (text) then
	BrailleAddString (text, 0,0,0)
	return TRUE
endIf
return BrailleAddObjectValue (subtypeCode)
endFunction

 

script WindowKeysHelp ()
var string help = msgWindowKeysHelp+cscBufferNewLine+cscBufferNewLine+cMsgBuffExit
if UserBufferIsActive () then 
	UserBufferDeactivate ()
EndIf
UserBufferClear ()
sayMessage (OT_USER_BUFFER, help)
endScript

script ZoomNotifyCurrentSpeaker ()
; The Zoom keystroke is control+2, which conflicts with our notifications.
; We're not doing anything but send the key, Zoom is responsible to push the notification back to us / any accessibility software when the keystroke is sent.
TypeKey (ksNotifyCurrentSpeaker)
;  That's all we're doing now because the alert is dealt with elsewhere.
EndScript

script AnnounceJAWSSettingsForZoom ()
;  Now assigned to Control+F9. Included in Hotkey Help.
SettingsReminder()
endScript

;  Added for Settings Dialog.
 
 Script ScreenSensitiveHelp ()
if HasSpokenCategory == 1 then ;; We are in the appropriate category list in the Settings dialog.
		if UserBufferIsActive () then 
	UserBufferDeactivate ()
EndIf
UserBufferClear ()
SayFormattedMessage(ot_user_buffer,MSGZoomCategoryList+cscBufferNewLine+cscBufferNewLine)
	SayFormattedMessage(ot_user_buffer,MSGPressEscape)
else ; Default
	performScript ScreenSensitiveHelp()
EndIf	

endScript
;  The following scripts are required to facilitate access to Participant and Chat Lists. Temporary measure.

Script Tab ()
performscript tab ()
pause ()
if IsParticipantsList () then 
	SayUsingVoice (VCTX_Message, MSGParticipantsList, ot_user_requested_information)
	sayline ()
EndIf
if IsChatList () then 
	SayUsingVoice (VCTX_Message, MSGChatList, ot_user_requested_information)
	sayline ()
endif

EndScript

Script ShiftTab()
performscript ShiftTab()
pause ()
if IsParticipantsList () then 
	SayUsingVoice (VCTX_Message, MSGParticipantsList, ot_user_requested_information)
	sayline ()
EndIf
if IsChatList () then 
	SayUsingVoice (VCTX_Message, MSGChatList, ot_user_requested_information)
	sayline ()
EndIf

EndScript

Script SayNextLine ()
if IsParticipantsList () 
|| IsChatList () then 
	if IsPCCursor () then 
		PerformScript SayNextLine ()
		pause ()
		SayLine ()
	else
		PerformScript SayNextLine ()
	EndIf
else
	PerformScript SayNextLine ()
EndIf
EndScript

Script SayPriorLine()
if IsParticipantsList () 
|| IsChatList () then 
	if IsPCCursor () then 
		PerformScript SayPriorLine ()
		pause ()
		SayLine ()
	else
		PerformScript SayPriorLine ()
	EndIf
else
	PerformScript SayPriorLine ()
endif
EndScript

Script JAWSHome ()
if IsParticipantsList () 
|| IsChatList () then 
	if IsPCCursor () then 
		PerformScript JAWSHome ()
		pause ()
		SayLine ()
	else
		PerformScript JAWSHome ()
	EndIf
else
	PerformScript JAWSHome ()
endif


EndScript
Script JAWSEnd ()
if IsParticipantsList () 
|| IsChatList () then 
		if IsPCCursor () then 
		PerformScript JAWSEnd ()
		pause ()
		SayLine ()
	else
		PerformScript JAWSEnd ()
	EndIf
else
	PerformScript JAWSHome()
endif


EndScript

int Function IsFocusInChatEdit()
if (!GetObjectIsEditable ())
	return FALSE
EndIf

var string currentClass = GetWindowClass (GetFocus ())
if (currentClass != ZoomChatClass) 
	return FALSE
EndIf

return TRUE
EndFunction

Void Function NameChangedEvent (handle hwnd, int objId, int childId, int nObjType,
	string sOldName, string sNewName)

if (focusInChatEdit)
	return ; do nothing here to prevent default from running
EndIf

NameChangedEvent (hwnd, objId, childId, nObjType,sOldName, sNewName)
EndFunction

void function SayObjectTypeAndText(optional int nLevel, int includeContainerName, int drawHighLight)
if (focusInChatEdit)
	return IndicateControlType (WT_EDIT, cscNull, GetLine())
EndIf

SayObjectTypeAndText(nLevel, includeContainerName, drawHighLight)
EndFunction

int function GetMeetingShareRect(int byref left, int byref top, int byref right, int byref bottom)
var handle hApp = GetAppMainWindow(GetFocus())
var handle hShare = FindWindow(hApp, cscNull, wnMeetingShare)
if !hShare || !GetWindowRect (hShare, left, right, top, bottom) then
	return false
endIf
if !IsValidRect(left, top, right, bottom)
	return false
endIf
var handle hTools = FindWindow(hApp, cscNull, wnMeetingTools)
if hTools && IsWindowVisible(hTools) then
	var int mtLeft, int mtTop, int mtRight, int mtBottom
	if GetWindowRect (hTools, mtLeft, mtRight, mtTop, mtBottom) then
		bottom = min(bottom, mtTop)
	endIf
endIf
return true
endFunction

void function PictureSmartAllInOneZoom (int serviceOptions)
var
	int left, int top, int right, int bottom
if GetMeetingShareRect(left, top, right, bottom)
	PictureSmartWithAreaShared(serviceOptions, left, top, right, bottom)
	return
endIf
PerformScript PictureSmartWithControl(serviceOptions)
EndFunction

script PictureSmartAllInOne (optional int serviceOptions)
PictureSmartAllInOneZoom (PSServiceOptions_Single | serviceOptions)
endScript

script PictureSmartAllInOneMultiService (optional int serviceOptions)
PictureSmartAllInOneZoom (PSServiceOptions_Multi | serviceOptions)
endScript

int function SetCustomBackgroundOCRRect()
var
	int iLeft, int iRight, int iTop, int iBottom
if !GetMeetingShareRect(iLeft, iTop, iRight, iBottom)
	return false
endIf
return UpdateBackgroundOCRRectCollection(iLeft, iTop, iRight, iBottom)
endFunction

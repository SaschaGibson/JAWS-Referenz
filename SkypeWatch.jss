; Copyright 2013-2015 by Freedom Scientific, Inc.
; Freedom Scientific default script file

include "hjConst.jsh"
include "MSAAConst.jsh"
include "common.jsm"
include "Skype.jsh"
include "Skype.jsm"
;Using AccessibleTreeBuilder instead of UIA Object Treewalker,
; to support XP systems who don't have 
;the UIA stand-alone support installed (Microsoft kb971513)


GLOBALS
	collection g_SkypeNotifications,
	string LastBackgroundNotificationText


void function AddNotificationWindowToCollection (handle hwnd, int NotifierType, optional string AlertText)
var
	int bAlreadyGotText = ! StringIsBlank (AlertText), ; for when AlertText is not empty
	int i, int max,
	object o, int role, int childID,
	collection notification,
	string sText,
	string miscAlert ; extra notifications
if ! hwnd return endIf
; Where text came in by itself,
; the object would now be invalid.
;Text for AlertText is initiated from MSAAAlertEvent:
if ! bAlreadyGotText then
	o = GetUIAObjectTree (hwnd)
	if ! o return endIf
endIf
if ! g_SkypeNotifications g_SkypeNotifications = new collection endIf
notification = new collection
if collectionItemExists (g_SkypeNotifications, intToString (hwnd)) then
	notification = g_SkypeNotifications[intToString (hwnd)]
else
	g_SkypeNotifications[intToString (hwnd)] = notification
endIf
notification.type = NotifierType
if NotifierType == NOTIFIER_CALL then
	; Where alert came from MSAAAlertEvent:
	if bAlreadyGotText then
		notification.text = AlertText
	; Don't bother with the object if we got the text:
	else
		o = o.FindByRole(ROLE_SYSTEM_STATICTEXT)
		if ! o return endIf
		notification.text = o.name
	endIf
else; chat, either from TConversation or TTrayAlert:
	if getWindowClass (hwnd) == wc_notification_tray_alert then
		max = o.ChildCount
		o = o.FirstChild
		sText = o.Name ; Author of chat message.
		for i=1 to max+1
			if o.NextSibling.name == "\""
			&& stringIsBlank (o.NextSibling.NextSibling.Name) then
				;This is the closing quote of the conversation text, the rest are all empties.
				;This is not a history view like Compact does.
				notification.ChildCount = i
				;Often, the last child with text is just a single quote. 
				; to get the text of the user plus the text spoken.
				sText = formatString ("%1: %2",sText, o.Name)
				;Child count may not have increased, so check last name to ensure that we're not repeating:
				notification.PriorText = notification.text
				notification.text = sText
			else; sign in / out or other notification which is not a part of a conversation
				notification.type = NOTIFIER_NOTIFICATION; These disappear before the SpeakNotification can properly process.
				notification.ChildCount = i
				sText = o.Name
				if ! stringIsBlank (sText) then
					if stringIsBlank (miscAlert) then
						miscAlert = sText
					else
						miscAlert = formatString ("%1 %2", miscAlert, sText)
					endIf
				endIf
			endIf
			o = o.NextSibling
		endFor
		if ! stringIsBlank (miscAlert) then
			notification.PriorText = notification.text
			notification.text = miscAlert
			;SayUsingVoice (VCTX_MESSAGE, notification.text, OT_SCREEN_MESSAGE)
			;BrailleMessage (notification.Text)
			; for RepeatLastSkypeNotification.
			;LastBackgroundNotificationText = notification.text
		endIf
	else; TConversation
		o = o.FirstChild
		if o.ChildCount<= notification.ChildCount then
			notification.ChildCount = o.ChildCount ; in the event it was less for some reason.
			return ; prevents timer from re-reading the last chat entry.
		endIf
		o = o.FirstChild ; on first entry in list
		notification.ChildCount = o.ChildCount
		for i = 1 to notification.ChildCount-1
			o = o.NextSibling
		endFor
		notification.text = StringTrimLeadingBlanks  (o.name)
		;Now strip off time stamp, which is written as
		;[timestamp]
		if stringStartsWith (notification.text , "[") && stringContains (notification.text , "]") then
			notification.text = stringChopLeft (notification.text,
				stringLength (stringSegment (notification.text, "]", 1))+1)
		endIf
		notification.text = StringTrimLeadingBlanks (notification.text)	
	endIf
endIf
endFunction

void function RemoveNotificationWindowFromCollection (handle hwnd)
var
	collection notification
notification = new collection
if ! hwnd return endIf
notification = g_SkypeNotifications[intToString(hwnd)]
if hWnd == ghwndLastNotify then ; caller notification window
	unScheduleFunction (giFN_RepeatLastCall)
	ghwndLastNotify = null ()
endIf
CollectionRemoveAll (notification)
notification = null ()
CollectionRemoveItem (g_SkypeNotifications, intToString(hwnd))
if ! CollectionItemCount (g_SkypeNotifications) then
	unScheduleFunction (giFN_UpdateChats)
endIf
endFunction

string function RemoveTimeStampFromSkypeChatMessage (string strMessage)
var
	string strMessageCleaned = strMessage
if stringStartsWith (strMessageCleaned, "[") && stringContains (strMessageCleaned, "]") then
	strMessageCleaned = stringChopLeft (strMessageCleaned,
		stringLength (stringSegment (strMessageCleaned, "]", 1))+1)
endIf
return strMessageCleaned
endFunction

void function IndicateNotification (handle hwnd)
var
	int i, int max,
	string sText, string message,
	string sClass = getWindowClass (hwnd),
	object o, int role, int childID,
	collection notification
if ! hwnd return endIf
if ! g_SkypeNotifications return endIf
notification = new collection
notification = g_SkypeNotifications[intToString (hwnd)]
if ! notification return endIf
if notification.type == NOTIFIER_CALL
|| notification.type == NOTIFIER_NOTIFICATION then
	if ! stringIsBlank (notification.text) then
		SayUsingVoice (VCTX_MESSAGE, notification.text, OT_SCREEN_MESSAGE)
		BrailleMessage (notification.text)
		LastBackgroundNotificationText = notification.text ; for RepeatLastSkypeNotification.
		ghwndLastNotify = hwnd
		if ! IsWindowVisible (ghwndLastNotify) then
		;came from MSAAAlertEvent
			gbLastCallCameFromAlert = TRUE
		endIf
	endIf
	; only repeat calls, not misc notifications:
	if notification.type == NOTIFIER_CALL then
		giFN_RepeatLastCall = scheduleFunction ("NotificationRepeatCaller", 20) ; merely repeats the last incoming caller's name until answered,
	endIf
	;since conceivably the user didn't hear it the first or second time.
elIf notification.type == NOTIFIER_CHAT then
	;Prevents speaking chats that are in focus, that comes from different code:
	if getAppMainWindow (getFocus ()) == getAppMainWindow (hwnd) then
		;bail out, but do not destroy, as user may put this window in background and new chat message may come into it.
		return
	endIf
	o = GetUIAObjectTree (hwnd)
	if ! o && sClass != wc_notification_tray_alert then ; only applies to standard chats, not TTrayAlerts as objects come and go with those:
	;makes timer more efficient and performance-friendly.
	;If this is the last chat being removed, Timer will at most run one more time and then die.
		collectionRemoveAll (notification)
		notification = null ()
		CollectionRemoveItem (g_SkypeNotifications, intToString(hwnd))
		if ! CollectionItemCount (g_SkypeNotifications) then
			unscheduleFunction (giFN_UpdateChats) ; gets rescheduled when new one gets created.
		endIf
		return 
	endIf
	;First, process TTray Alerts for Normal View with chats:
	if sClass == wc_notification_tray_alert then
		max = o.ChildCount
		o = o.FirstChild
		sText = o.Name ; name of converser, only one person in these windows.
		for i=1 to max+1
			if stringStripAllBlanks (o.NextSibling.name) == "\""
			&& stringIsBlank (o.NextSibling.NextSibling.Name) then
				;This is the closing quote of the conversation text, the rest are all empties.
				;This is not a history view like Compact does.
				notification.ChildCount = i
				;Often, the last child with text is just a single quote. 
				; to get the text of the user plus the text spoken.
				sText = formatString ("%1: %2",sText, o.Name)
				;Child count may not have increased, so check last name to ensure that we're not repeating:
				if notification.PriorText != sText then
					notification.PriorText = notification.text
					gStrLastChatNotify = notification.PriorText
					notification.text = sText
					g_SkypeNotifications.LastNotifyText = sText
					if gStrLastChatNotify == sText then
						SayUsingVoice (VCTX_MESSAGE, notification.text, OT_SCREEN_MESSAGE)
						BrailleMessage (notification.Text)
						if ! stringIsBlank (notification.text) then LastBackgroundNotificationText = notification.text endIf ; for RepeatLastSkypeNotification.
					endIf
					gStrLastChatNotify = sText ;Prevent repeats.
				endIf
			endIf
			o = o.NextSibling
		endFor
	endIf
	o = o.FirstChild
	while (o.NextSibling)
		o = o.NextSibling
	endWhile
	if o.ChildCount<= notification.ChildCount then
		;return ; prevents timer from re-reading the last chat entry, but leaves the collection item in case a new message comes in on that conversation.
	endIf
	notification.ChildCount = 	o.ChildCount
	o = o.FirstChild 
	for i = 1 to notification.ChildCount
		if o.NextSibling then
			o = o.NextSibling
		endIf
	endFor
	; for multi-user messages, but any where the final item is off screen, a fake 'person is typing' notification.
	if o.IsOffScreen then
		o = o.PriorSibling 
	endIf
	; newer versions of Skype have blank entries at the end of each list.
	; This will not have adverse effects on older Skype versions.
	; Must check for prior sibling.
	;With Skype Chat messages, the first entry always has a value, that being the text "Last 7 days, last 30 days, last 3 months ..."
	; But not so when one of your contacts is signing in / out,
	; and you have the notifications turned on for sign in / out.
	while (o.PriorSibling 
	&& stringIsBlank (o.name)) 
		o = o.PriorSibling 
	endWhile
	; for the conversation you were just in when focus moved from chat window to another application:
	if o.name == gstrLastConversationItem then return endIf
	;Continue processing:
	if o.role == ROLE_SYSTEM_LISTITEM then
	;First check to see if this is a 'person is typing' message,
	;so we only read that one once.
		notification.text = StringTrimLeadingBlanks  (o.name)
	endIf
	; for newer versions of Skype: 
	if StringIsBlank (message) then
		message = notification.text
	endIf
	message = StringTrimLeadingBlanks (message)	
	if ! stringIsBlank (message) then LastBackgroundNotificationText = message endIf ; for RepeatLastSkypeNotification.
	if Notification.PriorText != Notification.Text
	&& ! stringIsBlank (message) then
		sayUsingVoice (VCTX_MESSAGE, message, OT_SCREEN_MESSAGE)
		BrailleMessage (message)
	endIf
	;Using text comparison rather than typing state and child count,
	;but only update prior text cache if the current one is *not* empty, or it will repeat.
	;The cached values retain their time and date information so that duplicate messages don't get lost,
	; say you typed the same exact thing twice for whatever reason.
	if ! StringIsBlank (Notification.Text) then
		Notification.PriorText = Notification.Text
	endIf
endIf
endFunction

void function NotificationRepeatCaller ()
if ! g_SkypeNotifications return endIf
if ! ghwndLastNotify || ! isWindowVisible (ghwndLastNotify) then
	if ! gbLastCallCameFromAlert then
		return
	endIf
endIf
IndicateNotification (ghwndLastNotify)
endFunction

void function ProcessEachNotification (collection notification, handle hwnd)
if notification.type != NOTIFIER_CHAT then return endIf
if getRealWindow (hwnd) == getRealWindow (getFocus ()) then
	;Ensure the chat message being updated is not a part of the foreground, as that is managed by the Skype Scripts themselves:
	return
endIf
IndicateNotification (hwnd)
;Don't unschedule the chats timer here, because you could be processing the last entry in the collection,
;and someone could write a new message to it and you'd never know except by the Skype alert sound.
endFunction

void function NotificationsCollectionUpdateChats ()
var
	handle hwnd, ; to validate the window as still visible if tray alert.
	int i,
	object o, int role, int childID,
	collection notification, string key,
	string sFocusClass = getWindowClass (getFocus ())
if ! g_SkypeNotifications return endIf
forEach key in g_SkypeNotifications
	notification = new collection
	notification = g_SkypeNotifications[key]
	hwnd = stringToHandle (key)
	if getWindowClass (hwnd) == cwn2 ; Invalid Window Handle
	|| ! hwnd  then
		CollectionRemoveItem (g_SkypeNotifications, key)
	else
		;Since collection contains both calls and chats, ProcessEachNotification will filter out chats only and manage those.
		ProcessEachNotification (notification, stringToInt (key))
	endIf
	if notification.type == NOTIFIER_CHAT then
		;reset the schedule timer to 2 seconds after the final chat got processed:
		UnscheduleFunction  (giFN_UpdateChats )
		giFN_UpdateChats = ScheduleFunction ("NotificationsCollectionUpdateChats", 20)
	endIf
endForEach
endFunction

Void Function CheckForSkypeAlerts (handle hWindow, optional string AlertText)
var
	int notificationType,
	string sClass = getWindowClass (hWindow)
If sClass == wc_Notification_IncomingCaller	
|| (sClass == wc_Notification_MSAA_Alert && !StringIsBlank (AlertText)) then
	notificationType = NOTIFIER_CALL
elIf sClass == wc_notification_incoming_chat 
|| sClass == wc_notification_tray_alert then
	notificationType = NOTIFIER_CHAT
endIf
if notificationType then
	if sClass == wc_notification_tray_alert then
		;These need time for the window and its objects to instantiate,
		; Otherwise UIA or accessible tree builder will fail.
		delay (10, TRUE)
	endIf
	if ! CollectionItemExists (g_SkypeNotifications, intToString (hWindow))
		AddNotificationWindowToCollection (hWindow, notificationType, AlertText)
		IndicateNotification (hWindow)
	endIf
	if notificationType == NOTIFIER_CHAT then
		unScheduleFunction (giFN_UpdateChats)
		giFN_UpdateChats = ScheduleFunction ("NotificationsCollectionUpdateChats", 20)
	else
		ghwndLastNotify = hWindow ; for repeating incoming call, and to destroy when Skype gains focus / it gets answered.
	endIf
endIf
endFunction

void Function DestroyOldSkypeAlerts (handle hWindow)
;Helper to WindowDestroyedEvent
if CollectionItemExists (g_SkypeNotifications, intToString (hWindow)) then RemoveNotificationWindowFromCollection (hWindow) endIf
if ghwndLastNotify == hWindow then
	unScheduleFunction (giFN_RepeatLastCall)
	ghwndLastNotify = null ()
endIf
endFunction


void function RepeatLastSkypeNotification ()
if stringIsBlank (LastBackgroundNotificationText) then
	sayMessage (OT_ERROR, msgNoPreviousNotification)
else
	sayMessage (OT_USER_REQUESTED_INFORMATION, LastBackgroundNotificationText)
endIf
endFunction

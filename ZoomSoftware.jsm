const
; Change of keystroke for reporting the name of the current speaker.
ksNotifyCurrentSpeaker = "Control+2",
; for scChatMessageIndicator	, Using the Zoom software, begin a chat message with participants in a meeting. 
; The incoming text will say "From" as part of the chat incoming message alert.
	scChatMessageIndicator = "From",
	scPersonalChatMessageIndicator = "Me to",
; for wnTimeZone, schedule a meeting, move to the Time Zone combo box and get its object name (Script Utility Mode -> F9.)
		wnTimeZone = "Time Zone",
	;for wnSpeakers, go to Settings -> Audio, move to the Speakers combo box and get its object name (Script Utility Mode -> F9.)
		wnSpeakers = "Speakers",
			;for wnMicrophone, go to Settings -> Audio, move to the Microphone combo box and get its object name (Script Utility Mode -> F9.)
wnMicrophone = "Microphone",
; for wnMeetingShare and wnMeetingTools, activate the touch cursor in advanced mode. Start from the top level element and arrow down to "ContentLeftPanel".
; Arrow down again for "Meeting Tools", and then right to get "Zoom Share Container".
; You may need to explore with the touch cursor if your layout is not standard.
wnMeetingShare = "Zoom Share Container",
wnMeetingTools = "Meeting tools"
	

Messages
@MSGHotkeyHelp
To enable or disable alerts, press %KeyFor(ToggleAlerts). This is temporary and will revert to full alerts when JAWS is restarted.
To hear the most recent alert, press %KeyFor(SayAlert).
To be reminded of whether alert announcements are enabled or disabled, press %KeyFor(AnnounceJAWSSettingsForZoom).
To review the last 10 alerts or messages, press Control+1 through to Control+0. Press twice quickly to virtualise.
To only receive notification of chat messages within a meeting, and when pressing Control+1 through to Control+0, press %KeyFor(ToggleChatMessages). This is temporary and will revert to full alerts when JAWS is restarted.
To have Zoom announce who's currently talking, press %KeyFor(ZoomNotifyCurrentSpeaker).
The following Alert types are always spoken and sent to Braille unless they have been disabled in the Zoom Settings Dialog Box within the Accessibility category:
Recording.
Video.
Mute audio.
Name of speaker.

@@
@MSGAlertsEnabled
Alerts Enabled.
@@
@MSGAlertsDisabled
AlertsDisabled.
@@
@MSGChatOnly
Chat Messages captured only.
@@
@MSGAllMessages
All messages captured.
@@
@MSGExtendedChat
Chat Messages will be automatically spoken and when you press Control+1 through to Control+0.
@@
@MSGExtendedAlerts
All Alerts will be automatically spoken and when you press Control+1 through to Control+0.
@@
@MSGNoAlertsAvailable
No Alerts available.
@@
@MSGPressEscape
Press Escape to close this message.
@@
@MSGScheduleANewMeeting
Schedule a new meeting
@@
@MSGCombo
Combo box
@@
@MSGDate
Date
@@
@MSGTime
Time
@@
@MSGHours
Hours
@@
@MSGMinutes
Minutes
@@
@MSGTimeZone
Time Zone:
@@
@msgSpeakers
Speakers:
@@
@msgMicrophone
Microphone:
@@
@MSGRecurring
Recurring
@@
@MSGSpeakerNotDetected
Speaker name not detected.
@@
@MSGRecord
record
@@
@MSGPause
Pause
@@
@MSGMute
Mute
@@
@MSGVideo
Video
@@
@MSGTalking
Talking: 
@@
@MSGBandwidth
bandwidth
@@
@MSGParticipant
Participant
@@
@MSGAttendee
attendee
@@
@MSGParticipantsList
Participants list
@@
@MSGChatList
Chat List
@@
@MSGChat
Chat
@@
@MSGSettings
Settings
@@
@MSGCategoryList
Category list
@@
@MSGEdit
Edit
@@
@MSGScreenShare
Select a window or an application that you want to share
@@
@MSGChecked
checked
@@
@MSGUnchecked
unchecked
@@
@msgAppName
Zoom Software
@@
@msgWindowKeysHelp
The builtin Zoom keystroke to notify current speaker conflicts with the JAWS notifications keystrokes. Instead, press control+shift+T to have Zoom notify who's talking.
General keystrokes:
Mute or unmute audio: Alt+A
Raise or lower your hand: Alt+Y
Open the Invite window: Alt+I
Show the In-Meeting Chat panel: Alt+H
Show the Participants panel: Alt+U
Move between Zoom popup windows: F6

Recording Keystrokes:
Start local recording: Alt+R
Start cloud recording: Alt+C
Pause or resume recording: Alt+P

Video Meeting Keystrokes:
Switch to active speaker view:  Alt+F1
Switch to gallery video view: Alt+F2
Start or stop Video: Alt+V

Meeting Organizer Keystrokes:
Mute or unmute audio for everyone except the host: Alt+M
Switch camera: Alt+N
Enter or exit full screen: Alt+F
Gain remote control: Alt+Shift+R
Stop remote control: Alt+Shift+G

The following keystrokes are available when the meeting control toolbar has focus.
Launch share screen window and stop screen share: Alt+S
Start or stop new screen share: Alt+Shift+S
Pause or resume screen share: Alt+T
@@
; Screen Sensitive.
@MSGZoomCategoryList
You are focused within the list of categories for managing settings within the Zoom desktop client.
Use the UP and DOWN ARROW keys to select an item in this list box.
First letter navigation is not possible.
Press ENTER to move into a category.
Press TAB and SHIFT+TAB to move through the options in the category.

@@
EndMessages

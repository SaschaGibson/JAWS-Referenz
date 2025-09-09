;Copyright 2022 - 2023 by Freedom Scientific, Inc.
;What'sApp message file

const
	scTimeSeparator = ":", ; Time separator.
	scCommaSpaceSeparator = ", ", ;separates parts of a message, time, status, etc.
	scTyping = "typing…",;status shown when a contact is typing a response
	;scMostRecent is for the name of a button used to make the most recent chat message visible in the message list.
	;To find this button, open a chat and activate the touch cursor with advanced navigation on.
	;Arrow up to custom, arrow down once, and arrow right until the "Go to most recent message" button is found.
	;Press ALT+ENTER to inspect the UIA properties. The desired text is listed after "Name:".
	;Note, the button may be disabled if the most recent message is already visible, but the name of the button will still be the same.
	scMostRecent = "Go to most recent message",
	ksDeleteWord = "Control+delete",
	ksControlBackSpace="Control+Backspace"

Messages
@msgConfigName
What'sApp
@@
@MsgInitFailed
Initialization failed
@@
@MsgNoStatus
Status not found. Please maximize the window.
@@
@msgNotInChat_L
Not in an open chat
@@
@msgNotInChat_S
Not in chat
@@
@msgNothingToDiscard_L
There is nothing to discard
@@
@msgNothingToDiscard_S
Nothing to discard
@@
@msgRecordingUnavailable_L
Recording is unavailable while the chat edit field contains text.
@@
@msgRecordingUnavailable_S
Recording unavailable
@@
@msgNoRecording_L
There is no recording.
@@
@msgNoRecording_S
No recording
@@
@sStatusL
%1, status: %2
@@
@sStatusS
%1, %2.
@@
@MsgIntroL
Welcome to WhatsApp! To learn about JAWS specific hot keys, press %KeyFor(HotKeyHelp).
@@
@MsgNoPlayVoiceMessage
No voice message playing, press ENTER to open chat.
@@
@msgWhatsAppWindowKeysHelp
What'sApp Keystrokes 

New Chat, CTRL+N
Close Chat, CTRL+W or CTRL+F4
Next Chat, CTRL+Tab
Previous Chat, CTRL+Shift+Tab
New Group, CTRL+Shift+N
Toggle Read, CTRL+Shift+U
Toggle Mute, CTRL+Shift+M
Search, CTRL+F
Search in Chat, CTRL+Shift+F
Settings, CTRL+P
Emoji panel, CTRL+Shift+E
GIF panel, CTRL+Shift+G
Open Chat, CTRL One through nine

Press Escape to close this message.
@@
@MSGWhatsAppHotkeyHelp
JAWS specific WhatsApp keys:
To read the name and status of the selected contact if visible, press %KeyFor(SpeakNameAndStatus).
To go to the chat edit field, press %KeyFor(MoveToEditField).
To go to the chat list, press %KeyFor(MoveToChatList).
To go to the selected chat's history, press %KeyFor(MoveToHistory).
To start, pause, or resume recording a voice message, press %KeyFor(RecordVoiceMessage).
To send the recorded voice message, press %KeyFor(SendVoiceMessage).
To play or pause a voice message before sending, press %KeyFor(PlayPauseRecording).
To discard an unsent voice message, press %KeyFor(DiscardVoiceMessage).
To add an attachment to a message, press %KeyFor(Attach).
To read the last nine messages, you can use Alt+ the numbers from 1 to 9, where 1 is the first message and 9 is the ninth. Add Shift to these commands to virtualize.
To adjust quick settings, press %KeyFor(QuickSettings).
To make an audio call, press %KeyFor(AudioCall).
To make a video call, press %KeyFor(VideoCall).

Press Escape to close this message.
@@
EndMessages
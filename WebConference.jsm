; Copyright 2008-2015 by Freedom Scientific, Inc.
; JAWS Message File for the Web Conference PlugIn

Const
	ksMoveToAddressBar = "Alt+A",
	ksBack = "Alt+Left Arrow",
	ksForward = "Alt+Right Arrow",
	ksToggleGlobalSetting = "Alt+G",
	ksDisableTalkKey = "Alt+d",
	ksMuteSound = "Alt+q",
	scComma = ",",
	scAudioMuted = "Audio Muted",
	scTalkKeyLocked = "Talk Key Locke",
	scTalkKeyOff = "Talk Key Off",
	wn_ConfigureTalkKeyDlg = "Configure Talk Key",
	wn_FontDlg = "Font",
	wn_LogInDialogNamePrefix =  "Log on to ",
	wn_TalkSoundOff = "Talk sound off:",
	wn_TalkSoundOn  = "Talk sound on:",



;UNUSED_VARIABLES

	ksLockTalkKey = "Alt+l"

;END_OF_UNUSED_VARIABLES

Messages
@MsgAppName
Web Conference Plug In
@@
@msgWinKeysHelp1_L
The following shortcut keys may be helpful when using the Web Conference Plug In:
Toggle announcement of who is speaking ALT+E
Move to the browser address bar ALT+A
Move to the browser windowF6
Move to the user list F7
Move to the text chat entry window F8
Move to the text chat messages window F9
Speaking and Talk Key Commands:
To talk, press and hold the CTRL key. Release the CTRL key when you are finished. This is the default talk key. The CTRL key is also set to "global" meaning that you can press it from anywhere on your system to talk.

You can also press ALT+L to lock the talk key and begin talking. When you are finished talking, press ALT+L a second time to unlock the talk key.

To temporarily toggle the setting of the talk key from "global" to "application only", press ALT+G. When you toggle this setting from "global" to "application only",then the talk key can only be used while you are in the conference room. When you toggle this setting to "global", then you  can use the talk key to talk from any application on your system. The default setting is  "global."

To temporarily disable the talk key, press  ALT+D. This keystroke is a toggle. To re-enable the talk key, press ALT+D a second time.

To mute the sound in the conference room, press  ALT+Q. This only mutes the sound in the conference room but allows other sounds to function normally.

Recording Commands:
To start/stop Recording, press  ALT+R
To pause recording, press  ALT+P
@@
;for msgAddress, %1 = the address in the address bar
@msgAddressBar_L
address bar:
@@
@MsgUsersTreeView_L
Users :
@@
@MsgBrowserWindow_L
Browser Window
@@
@MsgTextChat_L
Chat Text Entry:
@@
@msgChatHistoryWindow_L
Chat History
@@
@MsgSpeakerVolume_L
speaker volume:
@@
@MsgMicrophoneVolume_L
microphone volume:
@@
@MsgUserName_L
UserName:
@@
@MsgPassword_L
Password:
@@
;msgAddToFavorites is a button on the log on screen
@msgAddToFavorites
Add To Favorites
@@
;msgConfiguration is a button on the log on screen
@msgConfiguration
Configuration
@@
@msgBack_L
back
@@
@msgForward_L
forward
@@
@MsgAdjustGlobalSetting_L
Toggle global setting
@@
@MsgScreenSensitiveHelpUsersTV_L
Use the UP and DOWN ARROW keys to move through and select items in this tree view.
To expand or collapse the selected item, press the SPACEBAR.
@@
@MsgAudioMuted_L
Audio Muted
@@
@MsgAudioMuted_S
Muted
@@
@MsgAudioNotMuted_L
Audio Not Muted
@@
@MsgAudioNotMuted_S
Not Muted
@@
@MsgTalkKeyDisabled_L
Talk Key Disabled
@@
@MsgTalkKeyDisabled_S
Disabled
@@
@MsgTalkKeyEnabled_L
Talk Key Enabled
@@
@MsgTalkKeyEnabled_S
Enabled
@@
@MsgStatusBarNotVisible_L
The status bar is not visible.  Use the View menu to display the status bar.
@@
@MsgStatusBarNotVisible_S
Status bar not visible.
@@
@MsgTalkKeyLocked_L
Talk Key Locked
@@
@MsgTalkKeyLocked_S
Locked
@@
@MsgTalkKeyUnlocked_L
Talk Key Unlocked
@@
@MsgTalkKeyUnlocked_S
Unlocked
@@
@msgWebConferenceHotKeyHelp1_L
Here are some %product% Hot Keys for use in the Conference Room:
Activate the Custom Colors dialog, %KeyFor(ActivateCustomColorDlg ),
Activate the Font dialog, %KeyFor(ActivateFontDialog )
Say the status of the Audio Mute, Talk Key enable/disable and lock talk key keystrokes, %KeyFor(AnnounceActionKeysStatus )
@@


;UNUSED_VARIABLES

@MsgDisableTalkKey_L
disable talk key
@@
@MsgMuteSound_L
mute sound
@@

;END_OF_UNUSED_VARIABLES

EndMessages

; Copyright 2010-2015 by Freedom Scientific, Inc.
;	Skype default message file.

Const
; for constants sc_SkypeDesktop_, the string is the name of the control.
; These are for the Skype Desktop application Version 8.xx or later.
; find the control, and get its object name: Script Utility Mode -> F10 to Object name -> Control+f9 to copy
	sc_SkypeDesktop_Disconnect = "End Call",
	sc_SkypeDesktop_Answer = "Answer",
	sc_SkypeDesktop_Cancel = "Cancel",
; for sc_SkypeDesktop_Window1,	sc_SkypeDesktop_Window2 and sc_SkypeDesktop_Window3, the string is the name of the window 
; insert+t on main Window, or Script Utility Mode | Real Window Name
; Likely sc_SkypeDesktop_Window1 need not be localized, but sc_SkypeDesktop_Window2 might need this.
	sc_SkypeDesktop_Window1 = "Skype",
	sc_SkypeDesktop_Window2 = "Skype Preview",
	sc_SkypeDesktop_Window3 = "Skype −",
; for scSkypeIsUsingMicrophone,	 start a Skype call
; Then on the system tray, you will see a button called "Skype is using your microphone". Just get the text for Microphone.
	scSkypeIsUsingMicrophone = "microphone",
; for ksSkypeDesktop constants,
;the value is the Microsoft keystroke you would type when in the application window itself.
; You probably translated these in Skype.jsm -> msgWindowKeysHelp
	ksSkypeDesktopAnswer = "Control+Shift+P",
	ksSkypeDesktopDisconnect = "Control+E",
	SkypeNodeName = "Skype Options",
	SkypeStatusAnnouncementItemName = "Announce Contact Status",
	SkypeChatAnnouncementItemName = "Announce Chat Message"

Messages
@MSG_StatusAnnouncement_L
%1 is: %2
@@
@MSG_MessageTemplate
%1 %2 says: %3
@@
@MSG_AnnounceAll
Announce All
@@
@MSG_AnnounceOnline
Announce Online
@@
@MSG_SuppressAnnouncement
Suppress
@@
@MSG_Announce
Announce
@@
@MSG_ApplicationSettingsSaved
Application Settings Saved.
@@
; Help messages for Skype default COM functionality...
@MSG_AllowJAWSToUseSkype_S
To enable all the built-in Skype functionality, allow %product% to use Skype.
@@
@MSG_AllowJAWSToUseSkype_L
To enable all the built-in Skype functionality, allow %product% to use Skype. To do this, go to the main Skype window and click on the link with the number of new events following the 'your Skype name' link in the Tab order. Then Tab to the link called 'jfw.exe - Plugin authorization'. Click this link to bring up the authorisation dialogue.
@@
; Help messages for the JAWS Options dialogue...
@MSG_SkypeStatusAnnouncementItemHelp
This option allows you to select whether Skype announces any online status of the people in your contact list, announces only if the person is online, or suppresses any announcements of the status changes. The default value is to announce the status change to online.
@@
@MSG_SkypeChatAnnouncementItemHelp
This option allows you to select whether Skype announces the incoming messages. The default value is to announce the incoming chat messages.
@@
@MSG_SkypeNodeHelp
This group of options allows you to make changes to the active Skype configuration. It is only present if you have Skype installed, and if Skype is up and running.
@@
; for msgSkypeDesktopButtonNameNotFound, %1 = name of button pressed by Skype desktop Keystroke.
@msgSkypeDesktopButtonNameNotFound
%1 not found.
@@
@msgSkypeDesktopNoOngoingCall
No ongoing call found.
@@
@msgSkypeDesktopNoIncomingCall
No incoming call found.
@@
EndMessages

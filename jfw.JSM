; Copyright 1998-2018  by Freedom Scientific BLV Group, LLC
; Script message file for the JAWS user interface

const
; Dialog Names
	scLongName = "No Speech",
	scSysTabControl32 = "SysTabControl32",
	SC_NoBrailleDriver = "NoDisplay",
	;Next name = Startup Wizard dlg nake, as found in resources for your language of JAWS.
	;This string compare is used to make the wizard automatically announce as it starts.
	WN_STARTUP_WIZARD = "JAWS Startup Wizard",
	wn_maine_JAWS_ui = "JAWS",
	wn_AboutJAWS = "About JAWS",
	wn_WelcomeDialog = "Welcome to JAWS",
	wn_EnterAnAccessCode = "Enter an Access Code",
	wn_VOICE_OPTIONS = "Voice Adjustment",
	wn_Individual_Voices_dialog = "Voice Adjustment",
	wn_VOICE_SETTINGS = "Voice Settings",
	WN_SELECT_PROFILE = "Select a Voice Profile",
	wn_Global_Voice_Profiles_dialog = "Global Voices",
	; for wn_RemoveAVoice_Dialog, this is the dialog name for removing installed or compact voices.
	; JAWS Window -> Options -> Voices -> Add/Remove Voices...
	; name of dialog can use script utility mode -> f3 to real window name -> control+f1 to copy
	wn_RemoveAVoice_Dialog = "Remove A Voice",
	wn_NameComboBox = "Name:",
	wn_Basic_Settings = "Basic Settings",
	wn_Windows_System_Parameters = "Windows System Parameters",
	wn_Advanced_Options = "Advanced Options",
	wn_Brl_Basic_Settings = "Braille Basic Settings",
	wn_Cursor_and_Message_Voice = "Cursor and Message Voices",
	wn_modify_braille_settings = "Set options for",
	wn_Graphics_labeler = "Graphics Labeler",
	WN_VIDEO_INTERCEPT="Freedom Scientific Video Intercept",
	wn_Activation = "Activation",
	wn_ManageApplicationSettings = "Manage Application Settings",
	wn_NavigationQuickKeyManager = "Navigation Quick Key Manager",
	wn_EditNavigationQuickKeyAssignment = "Edit Navigation Quick Key Assignment",
; wn_Voice_Assistant_settings is the name of the dialog from JAWS Window -> Utilities -> Voice Assistant -> Settings dialog.	
	wn_Voice_Assistant_settings = "Voice Assistant Settings",
;Windows Vista::StartOptions
	wn_Vista_Autostart = "Start JAWS Options",
;window names:
	wn_CancelSearchButton = "Cancel Search",  ;Activation search for authorization CD
;Keystroke for Options Menu
;Note to translators:
;Correspond this keystroke with that in the JAWS resource for bringing up the
;Options menu
;For example:
;The English equivalent is alt+o for Options
;Then change the key map entries to match what used to be the File and Voices menu keystrokes
;For ease of use for existing users
	ksOptions="Alt+o",



;UNUSED_VARIABLES

	;Static text of Startup Wizard, which contains Speech Settings:
	wn_StartupWizardSpeechSettings = "Speech Settings"

;END_OF_UNUSED_VARIABLES

Messages
@msg0_L
JAWS for Windows
@@
@msgScreenSensitiveHelp1_l
The JAWS application window provides access to basic settings, Voice Settings, and Help.
Press ALT+O to choose settings to adjust.
Press F1 to open the JAWS help system.
@@
@msgScreenSensitiveHelp1_s
The JAWS application window provides access to basic settings, Voice Settings, and Help.
Press ALT+O to choose settings to adjust.
Press F1 to open the JAWS help system.
@@
@msgScreenSensitiveHelp2_l
The system volume control is under the Start menu, Programs, Accessories, in either Entertainment or Multimedia.
It may also be in the System Tray, which is opened with %KeyFor(ListTaskTrayIcons).
@@
@msgScreenSensitiveHelp2_S
The system volume control is under the Start menu, Programs, Accessories, in either Entertainment or Multimedia.
It may also be in the System Tray, which is opened with %KeyFor(ListTaskTrayIcons).
@@
;**messages for Basic options dialog
@msgScreenSensitiveHelp3_L
Tutor messages provide additional information to help you navigate menus and dialog controls.
Use this group of radio buttons to specify whether you want menu and control messages spoken, no menu and control messages spoken, or only messages spoken that you have created in the Create a Prompt dialog.
For more information on how to create a message using this feature, please type the keywords,  Create a Prompt, in the Index of JAWS Help.
@@
@msgScreenSensitiveHelp3_S
Tutor messages provide navigation tips in Windows and applications.
Use this group of radio buttons to specify that all Tutor messages are spoken, that no Tutor messages are spoken, or that only Tutor messages added through Prompt Manager are spoken.
@@
@msgScreenSensitiveHelp4_L
Use these radio buttons to specify which access keys you want JAWS to announce.
Access keys move you directly to a control in a dialog box or to a menu item. By default, JAWS will speak access keys in both menus and dialog boxes.
@@
@msgScreenSensitiveHelp4_S
Access keys are the keys you press to move directly to a control or an item in a menu.
Use this group of radio buttons to specify that all access keys are announced, that only access keys for menu items are announced, that only access keys for controls in dialogs are announced, or that no access keys are announced.
@@
@msgScreenSensitiveHelp5_L
Check this check box if you want JAWS to start automatically when Windows starts.
Clear this check box if you prefer to manually start JAWS, which is useful when several people share the same computer.
@@
@msgScreenSensitiveHelp5_S
Check this check box if you want JAWS to start automatically when Windows starts. If you leave this check box cleared, you must manually start JAWS.
@@
@msgScreenSensitiveHelp_PromptToConfirmWhenExitingJAWS
Select this check box to have JAWS prompt you on exit giving you an opportunity to cancel that action. When unchecked, choosing to shut down JAWS using any of windows commands or pressing JAWSKey + F4 anytime, will exit JAWS immediately. This check box is selected by default.
@@
@msgScreenSensitiveHelp6_L
If this check box is checked, JAWS will be run from the system tray rather than the task bar. This means that JAWS will not be found when you use ALT+TAB to cycle between running programs. You can use INSERT+J to get to the JAWS menu from the system tray.
@@
@msgScreenSensitiveHelp6_S
Check this check box to configure JAWS to run from the system tray.
This removes JAWS from the ALT+TAB cycle, making it easier to switch between applications.
Press %KeyFor(JAWSWindow) to access the JAWS application menus.
@@
@msgScreenSensitiveHelp7_L
A keyboard layout is an entire set of JAWS keyboard commands. Each layout is optimized for ease of use under different circumstances.

If you are using JAWS in a remote terminal session, the active keyboard layout is determined by the layout in use by the client computer and cannot be changed.
@@
@msgScreenSensitiveHelp7_S
Use this combo box to specify the keyboard layout.
Select Desktop if your keyboard has a number pad.
Select Laptop if your keyboard does not have a number pad.
Select MAGic 6.2 only if you run JAWS together with MAGic 6.2.
@@
;msgScreenSensitiveHelp8 and msgScreenSensitiveHelp9 are for the OK button and Cancel button throughout the JAWS ui
@msgScreenSensitiveHelp8_L
Select this button to accept changes and close the dialog.
@@
@msgScreenSensitiveHelp8_S
Select this button to accept changes and close the dialog.
@@
@msgScreenSensitiveHelp9_L
Select this button to discard changes and close the dialog.
@@
@msgScreenSensitiveHelp9_S
Select this button to discard changes and close the dialog.
@@
@msgScreenSensitiveHelpModifySystemParametersButton_l
The Windows features checked in the Windows System Parameters dialog are disabled when JAWS starts, and are enabled again when JAWS closes. Features that were disabled before JAWS started are not enabled when JAWS is closed. Disabling these items improves JAWS functionality, so we recommend you leave all items checked. For more information on these features, refer to Windows Help.
@@
;messages for the Modify System Parameters dialog
@msgScreenSensitiveHelp_Modify_System_Parameters
The check boxes in this dialog allow you to disable certain Windows features when JAWS starts.
Features that you disable are enabled again after you quit JAWS. Disabling these Windows features can improve JAWS functionality.
For more information on the purpose of each feature, refer to Windows Help.
@@
@msgScreenSensitiveHelp_MSP_OK_Button
Select this button with SPACEBAR to accept changes and close this dialog.
@@
@msgScreenSensitiveHelp_MSP_Cancel_Button
Select this button with SPACEBAR to discard changes and close this dialog.
@@
@MsgScreenSensitiveHelpAdvancedOptionsButton_L
Select this button to open the Advanced options dialog box containing additional JAWS options.
@@
; **Messages for Basic Voices dialog (also include msgScreenSensitiveHelp2_L and msgScreenSensitiveHelp2_S
@msgScreenSensitiveHelp10_L
Use these radio buttons to specify how you want to apply the changes made to global voice settings.
You can apply changes to all applications, or only to the application that last had focus.
@@
@msgScreenSensitiveHelp10_S
Use this group of radio buttons to specify which applications are affected by any changes you make.
Select Default for changes to apply to all applications.
Select Application for changes to apply only to the application whose name is specified. This is the application that last had focus.
@@
@msgScreenSensitiveHelp11_L
Select the rate of speech you find comfortable. PAGE DOWN and PAGE UP change the rate of speech by larger increments, while UP and DOWN ARROW keys make more gradual changes.
@@
@msgScreenSensitiveHelp11_S
Select the rate of speech you find comfortable.
PAGE DOWN and PAGE UP increase and decrease the rate of speech by larger increments.
@@
@msgScreenSensitiveHelp12_L
Select the level of punctuation you want to hear.
A higher level of punctuation can be helpful while proofreading or editing, while some users find a lower level causes less distraction for more casual reading.
@@
@msgScreenSensitiveHelp12_S
Select the level of punctuation you whish to hear.
@@
@msgScreenSensitiveHelp13_L
Capital letters, when encountered while reading by character, are spoken in a higher pitch voice.
This setting determines the extent to which the pitch increases when this happens.
@@
@msgScreenSensitiveHelp13_S
Capital letters, when encountered while reading by character, are spoken in a higher pitch voice.
This setting determines the extent to which the pitch increases when this happens.
@@
@msgScreenSensitiveHelp14_L
Use this combo box to specify which voice is affected by any changes you make.
Setting different cursor voices to speak differently provides immediate auditory feedback on which cursor is active.
@@
@msgScreenSensitiveHelp14_S
Use this combo box to specify which voice is affected by any changes you make.
Setting different cursor voices to speak differently provides immediate auditory feedback on which cursor is active.
@@
@msgScreenSensitiveHelp15_L
Select the level of punctuation you want to hear. A higher level of punctuation can be helpful while proofreading or editing, while some users find a lower level causes less distraction for more casual reading.
@@
@msgScreenSensitiveHelp15_S
Select the level of punctuation you whish to hear.
@@
@msgScreenSensitiveHelp16_L
Use this combo box to select which person profile is used for the voice setting specified in the Adjust combo box.
The profiles that are available depend on which speech synthesizer is selected. It is helpful to have differences for the PC Cursor, JAWS Cursor, and the Message Voice because you immediately know the source of spoken information.
@@
@msgScreenSensitiveHelp16_S
Use this combo box to select which voice is used for the cursor specified in the Adjust combo box.
The voices that are available depend on which speech synthesizer is selected.
It is helpful to have different voices selected for the PC Cursor, JAWS Cursor, and the Keyboard. You then immediately know the source of spoken information.
@@
@msgScreenSensitiveHelp17_L
Select the rate of speech you find comfortable. PAGE DOWN and PAGE UP change the rate of speech by larger increments. UP and DOWN ARROWS allow you to make more gradual changes.
@@
@msgScreenSensitiveHelp17_S
Select the rate of speech you find comfortable.
PAGE DOWN and PAGE UP increase and decrease the rate of speech by larger increments.
@@
@msgScreenSensitiveHelp18_L
Use the UP and DOWN ARROWS to select the level of pitch you find comfortable. PAGE DOWN and PAGE UP adjust the level of pitch by larger increments.
@@
@msgScreenSensitiveHelp18_S
Select the level of pitch you find comfortable.
PAGE DOWN and PAGE UP increase and decrease the level of pitch by larger increments.
@@
;for the braille basic settings dialog
@msgScreenSensitiveHelp19_L
Press ENTER or SPACEBAR on this button to modify the connection settings used by the Braille display currently shown in the Default Braille Display combo box.
@@
@msgScreenSensitiveHelp19_S
Select this button to open a dialog to modify connection settings for the current Braille display.
@@
@msgScreenSensitiveHelp20_L
Select this button to add a Braille display for use with JAWS.
@@
@msgScreenSensitiveHelp20_S
Select this button to add a Braille display for use with JAWS.
@@
@msgScreenSensitiveHelp21_L
Select this button to open a dialog containing more advanced Braille settings. This is the dialog available under Braille in the Settings Center.
@@
@msgScreenSensitiveHelp21_S
Select this button to open a dialog containing more advanced Braille settings. This same dialog is available from Settings Center, under the Set Options menu.
@@
@msgScreenSensitiveHelp22_L
Use this combo box to select the Braille Display you want active when you start JAWS. If no Braille Display is installed, the combo box defaults to No Display. To install or add a Braille Display, press the TAB key to move to the Add Braille Display button or press ALT+B.
@@
@msgScreenSensitiveHelp22_S
Use this combo box to select the installed Braille Display you wish to have active whenever you start JAWS.
@@
@msgScreenSensitiveHelp23_L
Braille Translation Tables provide Braille translations for print characters of a particular language. Use this combo box to select the Braille translation table that corresponds to the language you speak.
For instance, the United States typically uses the Table US_Unicode, which is the default.
@@
@msgScreenSensitiveHelp23_S
Use this combo box to select the Braille translation table you wish to use.
The translation table determines how Braille characters are displayed on your Braille display.
@@
@msgScreenSensitiveHelp24_L
If this check box is checked, JAWS notifies you if the default Braille Display Driver is not loading when you start JAWS. This error results when your Braille Display is not working properly, when your Braille Display is turned off, or when your Braille Display is not connected to your computer properly.
@@
@msgScreenSensitiveHelp24_S
 If this check box is checked, when JAWS starts, a message is displayed when the default Braille display driver cannot be loaded.
@@
;modify braille settings dialog
@msgScreenSensitiveHelp25_L
Use this edit combo box to select the port through which your Braille display is attached to your computer.
@@
@msgScreenSensitiveHelp25_S
Use this edit combo box to select the port through which your Braille display is attached to your computer.
@@
@msgScreenSensitiveHelp26_L
Use this edit combo box to specify the port settings you wish to use when using a Com port to attach your Braille display. The comma separated values represent BAUD Rate, Parity, Data Bits, and Stop Bits.
@@
@msgScreenSensitiveHelp26_S
Use this edit combo box to specify the port settings you wish to use when using a Com port to attach your Braille display.
The comma separated values are for:
BAUD Rate, Parity, Data Bits, Stop Bits.
@@
@msgScreenSensitiveHelp27_L
After changing settings for one voice, select this button to save those changes before selecting another voice and making more changes. This allows you to adjust settings for multiple voices without closing and reopening the dialog.
@@
@msgScreenSensitiveHelp27_S
After changing settings for one voice, select this button to save those changes before selecting another voice and making more changes.
This allows you to adjust settings for multiple voices without closing and reopening the dialog.
@@
@msgScreenSensitiveHelp28_L
The JAWS application window provides access to basic settings, Voice Settings, and Help. Press ALT+O to choose settings to adjust.
Press F1 to open the JAWS help system.
@@
@msgScreenSensitiveHelp29_L
Select this button for help with Graphics Labeler.
@@
@msgScreenSensitiveHelp30_L
Select to have the label for this graphic saved in the application JGF file, the default JGF file, or both files. The JGF file is a JAWS Graphics file. If you save your label to the application JGF, it is only available in that application. If you save it to the default JGF file, it is available in all applications.
@@
@msgScreenSensitiveHelp31_L
Type in the label you wish to have spoken for this graphic.
@@
@msgScreenSensitiveHelp32_L
Type in the lable you wish to display in Braille for this graphic.
@@
@msgScreenSensitiveHelp33_L
Use this check box to specify if the Virtual Viewer is visually displayed on the screen when INSERT+F1 and other helpful messages are accessed.
It may be helpful in training environments to show the Virtual Viewer.
However, in a presentation application like PowerPoint, it might disrupt your presentation to display the Virtual Viewer. JAWS functions the same in these messages whether or not the Virtual Viewer is displayed.

Note: You must close and restart JAWS for changes to this option to take effect.
@@
@msgScreenSensitiveHelp34_L
Use this combo box to select which voice profile is used for all cursors and voices. The profiles that are available depend on which speech synthesizer is selected. It is usually better to adjust this setting for individual cursors and voices, as it is helpful to have different voices selected for the PC Cursor, JAWS Cursor, and the Keyboard. You then immediately know the source of spoken information.
@@
@msgScreenSensitiveHelp35_L
Use the UP and DOWN ARROWS to select the level of pitch you find comfortable. PAGE DOWN and PAGE UP allow you to adjust the level of pitch by larger increments.
@@
@msgScreenSensitiveHelp36_L
Use these radio buttons to specify how you want to apply the changes made to individual voice settings. You can apply changes to all applications, or only to the application that last had focus.
@@
@msgScreenSensitiveHelp37_l
 If you clear this check box, JAWS uses the host's speech synthesizer and sound card to provide speech feedback during remote JAWS sessions and when using PAC Mate Desktop. For example, if you clear this check box and use PAC Mate Desktop, JAWS speaks through your computer's speakers rather than your PAC Mate's speakers.
@@
@msgScreenSensitiveHelp38_l
If you clear this check box, JAWS uses the host's default braille display during remote JAWS sessions and when using PAC Mate Desktop. For example, if you clear this check box and use PAC Mate Desktop, JAWS displays information on the braille display connected to your computer rather than your PAC Mate's braille display.
@@
@msgScreenSensitiveHelp39_l
If you select this check box, PAC Mate Desktop automatically starts when you start JAWS.
PAC Mate Desktop allows you to issue commands to your computer from your PAC Mate's keyboard via an ActiveSync connection.

NOTE: Firmware version 3.0 or later must be installed on your PAC Mate, and Microsoft ActiveSync must be installed on your computer, to use this feature.
If ActiveSync is not installed, selecting this check box will cause an error to occur when JAWS starts.

After PAC Mate Desktop starts, establish a Standard or Guest partnership in ActiveSync between your computer and PAC Mate.
Then, press INSERT+SHIFT+F4 or DOTS 1-5-7-8 CHORD, DOTS 1-4-5 on your PAC Mate.
You can press this keystroke again to temporarily suspend remote mode.
To end the remote session, press INSERT+F4 to quit Remote JAWS.
@@
@msgRestoreToDefaults
Select this button to restore application specific voice settings to the current default voice settings.
@@
@msgSetAsPrimary
This button sets the currently selected Synthesizer Language as the primary language for this profile.
@@
@msgSpeakSample
This button speaks a sample of the currently selected voice using the current voice settings.
@@
@msgRegInfo
Activating this button causes a dialog to appear where you can enter your contact information.
This information will be sent to Freedom Scientific, so that your records can be kept up to date.
@@
@msgVideoInterceptRadio
This series of radio buttons is used to display Video Intercept information, or to install or uninstall JAWS Video Intercept.
After selecting an option, TAB to the Execute button and press SPACEBAR.
If JAWS is currently running properly on your system, we recommend you do not attempt to install or uninstall JAWS Video Intercept.
@@
@msgVideoInterceptEdit
This read only edit field displays information useful to Freedom Scientific Technical Support when troubleshooting possible causes of JAWS Video Intercept issues.
@@
@msgVideoInterceptExecute
After using the radio buttons in this dialog to choose whether you wish to display Video Intercept information, install, or uninstall JAWS Video Intercept, use this button to perform the selected action.
@@
@msgVideoInterceptHelp
Select this button with SPACEBAR to display help for the JAWS Video Intercept dialog.
@@
@msgVideoInterceptClose
Select this button with SPACEBAR to close this dialog.
@@
@msgSpellRate
When you hold down INSERT and press NUM PAD 5 twice quickly to spell a word, the word is spelled at a rate of speech slower than the normal speech rate.
This setting determines the extent to which the speech rate decreases from normal.
@@
@msgJAWSVersionInfo
JAWS for Windows information:
JAWS Version %1
@@
;for msgLockingCodeInfo, %1 is the locking code
@msgLockingCodeInfo
Locking code: %1
@@
;for msgAuthCodeInfo, %1 is the authorization code
@msgAuthCodeInfo
Authorization number (The first 7 characters): %1
@@
@msgAuthCodeUnavailable
Auth code: Unavailable
@@
@msgSerialInfo
Serial number:  %1
Upgrades remaining:  %2
@@
@msgSerialInfoSmaExpiration
Serial number:  %1
Upgrades remaining:  %2
Maintenance Agreement Expiration:  %3
@@
;For msgSynth, %1 = Number of Synthesizers.
;%2 = Default Synthesizer name.
@msgSynth
Synthesizer Information:
Number of synthesizers installed:  %1
Default synthesizer is %2
@@
@msgSynthXInfo
%1: %2.
@@
@msgBrailleDisplayXInfo
%1: %2.
@@
@msgDisplay
Braille display Information:
Number of Braille displays installed:  %1
Default Braille display is %2
@@
@msgNoDisplay
Braille Display Information:
No braille displays installed.
@@
@msgDefaultNoBraille
No Braille Display
@@
@msgBrlNoPort
No port assigned
@@
@MsgScreenSensitiveHelpUseAuthorizationFromPM
Clear this check box if you want to make use of third-party scripts that are locked to your JAWS serial number while using PAC Mate Desktop.
Remote JAWS will use the computer's authorization information (including the serial number) instead of the PAC Mate's information.
This check box is selected by default.
@@
@MsgScreenSensitiveHelpAutomaticUpdatesAvailableCheckbox
The Automatic Updates Available check box is selected by default.
Clear this check box if you do not want users to be able to download JAWS updates by opening the Help menu and choosing Check for Updates.
This can prevent users from overwriting your custom scripts for supported third-party applications when they update JAWS.
Organizations that use special JAWS versions or otherwise want more centralized control over updates may also want to clear this check box.
@@
@msgScreenSensitiveHelpAccessCodeButton
Choose this button if you want to search for updates to special or private beta versions of JAWS.
You must have an access code provided by Freedom Scientific to check for these updates.
@@
@msgScreenSensitiveHelpAccessCodeEdit
Enter the access code provided to you by Freedom Scientific.
This code allows you to download updates to special or private beta versions of JAWS.
@@
@MsgScreenSensitiveHelpEnableRemoteAccessClient_L
Select this check box if you want to use JAWS during terminal sessions. You can clear this check box if you will not be using JAWS when you connect remotely to another computer. You must purchase the remote access option for your software license to use JAWS during terminal sessions.
@@
@MsgScreenSensitiveHelpEnableRemoteAccessServer_L
Select this check box if users that connect remotely to your computer will be using JAWS during their terminal sessions. If you clear this check box, remote JAWS users will not have speech and braille access to terminal sessions.
@@
@msgssh_RunJAWSwithoutspeech
Select this check box if you want JAWS to run without speech. The setting will take effect right away.
If you want to temporarily run JAWS without speech but have it come back the next time you start JAWS, you can choose the No Speech item from the JAWS Language menu.
@@
@MsgScreenSensitiveHelpApplicationSettingsListBox_L

This list box shows all applications that have been modified through the Settings Center or with a script.
If a check box is checked, JAWS uses the customized settings. If you no longer want JAWS to use a program's defined settings, clear the check box next to the program's name.
@@
@MsgScreenSensitiveHelpEnableAllBtn_L
To quickly select all check boxes, choose the Enable All button. Any application that appears in the list box will use its own custom settings.
@@
@MsgScreenSensitiveHelpDisableAllBtn_L
To quickly clear all check boxes, choose the Disable All button.
@@
@MsgScreenSensitiveHelpRemoveSelectedBtn_L
To delete an application-specific settings file, select it in the list and then choose the Remove Selected button.
@@
@MsgScreenSensitiveHelpOkBtn_L
When you select this button, any changes you have made are saved, and you are returned to the JAWS application window.
@@
@MsgScreenSensitiveHelpCancelBtn_L
When you select this button, any changes you have made are discarded, and you are returned to the JAWS application window.
@@
;For Windows Vista Startup wizard and Run JAWS First ... button:
@msgScreenSensitiveHelpAutomaticallyStartJAWS
Select this button and its controls to determine if JAWS starts before or after you log on and start Windows. Applies to Windows Vista and later.
Press SPACEBAR to activate this button.
@@
@msgScreenSensitiveHelpStartJAWSLogonScreen
When this check box is selected, JAWS will load and start when the Windows log on screen appears. Applies to Windows Vista and later.
The check box is checked by default.
Press SPACEBAR to check or uncheck this check box.
@@
@msgScreenSensitiveHelpStartJAWSAllUsers
When this check box is selected, JAWS will load and start after you log on to Windows. Applies to Windows Vista and later.
It is unchecked by default. The check box value applies to all users who log on to this computer using this version of JAWS.
Press SPACEBAR to check or uncheck this check box.
@@
@msgScreenSensitiveHelpStartJAWSThisUser
This combo box allows an individual user to control if JAWS starts after he or she logs on to Windows. Applies to Windows Vista and later.
It has three values: Always, Never, and Using the All User Setting. The default value is Always.

If Always is selected, JAWS will start after you log on to Windows.
If Never is selected, JAWS will not start after you log on to Windows.
If you select the value labeled Using the All User Setting, JAWS will start after you log on to Windows if the check box labeled Automatically start JAWS after log on for all users is checked.
This is useful if the computer is used by multiple users.

To select an item in a combo box, press the first letter of the item, or use UP or DOWN ARROW to move through the list. In some combo boxes, you make need to first press ALT+DOWN ARROW to open the list of items.
@@
@msgRemoteSynth
PAC Mate
@@
;for msgRemoteBraille, %1 = Braille cell count.
@msgRemoteBraille
PAC Mate %1
@@
@msgScreenSensitiveHelpStartupRate
Determines how fast or slow JAWS speaks. Select the rate of speech you find comfortable.
The PAGE DOWN and PAGE UP keys change the rate of speech by larger increments.
The UP ARROW and DOWN ARROW keys make more gradual changes.
@@
@msgScreenSensitiveHelpPunctuationStartup
Select the level of punctuation you want to hear.
A higher level of punctuation can be helpful while proofreading or editing.
Some users find a lower level causes less distraction for more casual reading.
@@
@msgScreenSensitiveHelpVolumeDuckingStartup
When checked, the volume for all programs will be reduced while JAWS is running.
@@
@msgScreenSensitiveHelpVoiceAssistantStartup
When checked, the Voice Assistant will be available via the wake word, or the keystroke %KeyFor(TalkToJAWS). Feature only available in Windows 10 and above.
@@
@msgScreenSensitiveHelpTypingEchoStartup
JAWS provides feedback when you press keys and type in documents.
Experienced computer users may prefer to have keyboard echo turned off or set to words only, while new users may find it helpful to have JAWS speak characters as they are typed.

Select Off if you do not wish to hear your typing echoed.
Select Characters if you want to hear each character echoed as you type. This is the default setting.
Select Words if you want to hear each word echoed after you press SPACEBAR or ENTER.
Select Characters and Words if you want to hear each character echoed as you type, and each word echoed after you press SPACEBAR or ENTER.
Press INSERT+2 at any time to temporarily toggle this setting, or use the ARROW keys to select one of the radio buttons in this group.
@@
@msgScreenSensitiveHelpSapiDuringSayAllStartup
The SAPI 5 Say All feature lets JAWS switch between its default Eloquence synthesized voice to a RealSpeak Solo SAPI 5 voice when the Say All command is issued.
Select this check box to enable or disable the SAPI 5 Say All feature.
Use the SPACEBAR to toggle between turning the feature on and off.
@@
@msgScreenSensitiveHelpJAWSOnStartup
Select this check box if you want JAWS to start automatically when Windows starts.
Clear this check box if you prefer to manually start JAWS. This may be useful when several people share the same computer.

Press the SPACEBAR to check or uncheck this check box.
@@
@msgScreenSensitiveHelpStartJAWSLogonScreenStartupWizard
Select this check box if you want JAWS to load and start when the Windows log on screen appears. Applies to Windows Vista and later. The check box is selected by default. Uncheck the check box if you want JAWS to be off when the log on screen appears.

You must have Administrator rights to change this setting. If you have Standard user rights, you cannot change the value of this check box. Also, JAWS will not speak the name of this check box.

Press the SPACEBAR to check or uncheck this check box.
@@
@msgScreenSensitiveHelpStartJAWSAllUsersWizard
When this check box is selected, JAWS will load and start after you log on to Windows. Applies to Windows Vista and later.
It is unchecked by default.

Note: You must have Administrator rights to change this setting. The only time you would change it is if you want to control how JAWS starts for all subsequent users who log on to this computer. If you have Standard user rights, you cannot change the value of this check box. Also, JAWS will not speak the name of this check box.

Press the SPACEBAR to check or uncheck this check box.
@@
@msgScreenSensitiveHelpStartJAWSThisUserWizard
This combo box allows an individual user to control if JAWS starts after he or she logs on to Windows. Applies to Windows Vista and later. It has three values: Always, Never, and Using the All Users Setting. The default value is Always.

Note: This combo box is available to all users. The value selected overrides the setting of the Automatically Start JAWS after Log On for All Users check box.

If Always is selected, JAWS will start every time the current user logs on to Windows.
If Never is selected, JAWS will never start after the current user logs on to Windows.
If the value labeled Using the All Users Settings is selected, the following can happen.
JAWS starts after the current user logs on. This is true if the Administrator selected the Automatically Start JAWS after Log On for All Users check box.
JAWS does not start after the current user logs on. This is true if the Administrator selected the Automatically Start JAWS after Log On for All Users check box.
@@
@msgScreenSensitiveHelpRunFromSystemTrayWizard
Select this check box if you want to run JAWS from the system tray instead of the task bar.
This means that JAWS does not appear when you use ALT+TAB to cycle between running programs. You can press INSERT+J to access the JAWS menus from the system tray.

Press the SPACEBAR to check or uncheck this check box.
@@
@msgScreenSensitiveHelpVirtualRibbons
Select this check box to turn on the Virtual Ribbon Menu.

The Virtual Ribbon Menu provides predictable navigation, lets you see everything in the Ribbon, and offers consistency when navigating with ARROW Keys. When it is on, the Ribbon is navigated using a traditional menu and submenu format familiar to most JAWS users.

To move between tabs on the Upper Ribbon, press LEFT or RIGHT ARROW.
To move to the Lower Ribbon of the current tab, press DOWN ARROW.
To leave the Upper Ribbon and return to the document, press ESC or ALT.

If a keystroke sequence that uses ALT combined with a letter to invoke a command is available for an application, JAWS uses that keystroke; and the Virtual Ribbon Menu does not appear.
@@
@msgScreenSensitiveHelpKeyboardLayoutWizard
Select a value that matches the type of computer keyboard you use. JAWS commands vary slightly depending on the keyboard layout. For example, JAWS keystrokes frequently use keys on the numeric keypad, which is usually on the right side of the keyboard for desktop computers. Most laptop computers do not have a numeric keypad, so JAWS provides alternate keystrokes.

Select Desktop layout if your keyboard has a numeric keypad.
Select Laptop layout if your keyboard does not have a numeric keypad.
Select Kinesis layout if you use an ergonomic keyboard.

Use the ARROW keys to change the selection that appears in the combo box.

Note: If you are using JAWS in a remote terminal session, the active keyboard layout is determined by the layout in use by the client computer and cannot be changed.
@@
@msgScreenSensitiveHelpNumlockStateWizard
Select a value to control whether or not the NUM LOCK key is turned on when JAWS starts. This option is only available in the Default.JCF file.

Select Turn Off at Startup to make sure that the NUM LOCK key is off when JAWS starts. This is the default setting.
Select Turn On at Startup to make sure that the NUM LOCK key is on when JAWS starts.
Select Do Not Modify to use the current NUM LOCK key setting.

Use the ARROW keys to select one of the radio buttons in this group.
@@
@msgScreenSensitiveHelpTutorMessagesWizard
When you select an item in a menu bar or dialog box control, you can have JAWS announce how you can navigate through these items. This additional information is called a tutor message. For example, if you press the ALT key while in the JAWS application window, you will hear instructions that say, "To navigate, press LEFT or RIGHT ARROW".

Select Turn Off Menu and Control Help to disable tutor messages.
Select Announce Menu and Control Help to enable tutor messages. This is the default setting.
Select Announce Custom Messages Only to hear customized tutor messages that you add using the Prompt Creator utility. To learn more about creating custom Tutor messages and control prompts, refer to Creating a Prompt in the JAWS help.

Use the ARROW keys to select one of the radio buttons in this group.
@@
@msgScreenSensitiveHelpAccessKeyMessagesWizard
Access keys are the keys you press to move directly to a control or an item in a menu. Use these radio buttons to specify which access keys you want JAWS to announce.

Select Speak All to have JAWS speak all access keys available in menu and dialog boxes. This is the default setting.
Select Speak Menus Only to have JAWS only speak access keys for menu items.
Select Speak Dialogs Only to have JAWS only speak access keys for controls in dialog boxes.
Select Off to prevent JAWS from speaking any access keys.

Use the ARROW keys to select one of the radio buttons in this group.
@@
@msgScreenSensitiveHelpUserVerbosityLevelWizard
Verbosity determines the amount of information spoken by JAWS. There are three verbosity levels: Beginner, Intermediate, and Advanced. The beginner level provides the maximum amount of information spoken, while intermediate and advanced levels provide fewer details. Beginner is the default setting.

Use the ARROW keys to select one of the radio buttons in this group.
@@
@msgScreenSensitiveHelpGraphicsVerbosityLevelWizard
Graphic Verbosity determines if JAWS announces graphics when they are encountered, and which graphics are announced.

Select No Graphics if you do not want JAWS to announce graphics.
Select Labeled Graphics if you only want JAWS to announce graphics that have been labeled using the Graphics Labeler utility. For more information, please see Graphics Labeler in the JAWS help.
Select All Graphics to have JAWS announce all graphics as they are encountered. This is the default setting. JAWS reads the labels for the graphics, if they are assigned. If no labels are assigned for a graphic, JAWS assigns a unique number.

Use the ARROW keys to select one of the radio buttons in this group.
@@
@msgScreenSensitiveHelpBrailleLanguageStartup
Select a Braille language from the list. Changing the language will have an effect on available options in Output and Input combo boxes if they are set to a value other than Computer Braille. By default, the language is set to English-United States.

Use the up and down arrow keys to select an option.
@@
@msgScreenSensitiveHelpBrailleOutputStartup
Select a Braille output from the list. The first option is always "Computer Braille". The other available options depend on the currently selected language. By default, the output is "Computer Braille". When "Computer Braille" is selected as the output, the Computer Braille Table becomes available in the Settings Center.

Use the UP and DOWN ARROW keys to select an option.
@@
@msgScreenSensitiveHelpBrailleInputStartup
Select a Braille input from the list. The first option is always "Computer Braille". The other available option depends on the currently selected value of Output. 

Use the UP and DOWN ARROW keys to select an option.
@@
@msgScreenSensitiveHelpGrade2ExpandWordStartup
If Translation has been set to Output Only, and this check box is checked, the word at the position of the braille cursor appears in computer braille. This makes it easier to edit the word at the cursor.

Use the SPACEBAR to toggle between turning the feature on and off.
@@
@msgScreenSensitiveHelpFlashMessages
Select this check box if you want JAWS to announce information by using Braille Flash Messages. Clear this check box to turn off Braille Flash Messages.

Use the SPACEBAR to toggle between turning the feature on and off.
@@
@msgScreenSensitiveHelpWordWrap
If you select this check box, JAWS does not split a word that is too large to be shown on the braille display. When you pan to the next increment, you can read the word in its entirety. If you clear this check box, JAWS displays as much of the word as possible, but a portion may be cut off. JAWS shows the remainder of the word when you pan to the next increment. This check box is selected by default.

Use the SPACEBAR to toggle between turning the feature on and off.
@@
@msgScreenSensitiveHelpReversePanningKeys
Select this check box to switch the direction of left and right panning buttons on a braille display. This means that when you press a left Navrow or panning button, panning advances to the right. Likewise, when you press a right Navrow or panning button, panning advances to the left. Clear this check box to restore normal panning operation. This check box is cleared by default.

Use the SPACEBAR to toggle between turning the feature on and off.
@@
@msgScreenSensitiveHelpBrailleMode
Use this option to control the format of the information sent to the braille display. When Line mode is selected, JAWS sends the line of text at the current cursor position to the braille display. When Structured mode is selected, JAWS sends information to the display that is relevant to the current cursor position. The information sent includes things such as control type, dialog name, or number of items in a list. When Speech Output mode is selected, JAWS sends the same text to the display that it sends to the synthesizer. The default setting for this option is Structured.

Use the UP and DOWN ARROW keys to select an option.
@@
@msgScreenSensitiveHelpPositionOfStatusCells
Use this option to determine if the informational Status Cells are located on the left or right end of the display, or choose to not display them at all. Left is the default setting.

Use the UP and DOWN ARROW keys to select an option.
@@
@msgScreenSensitiveHelpDotFirmness
Use this slider to specify the firmness of braille dots on the Focus or PAC Mate Portable Braille display. There are five levels of firmness.

Use the LEFT and RIGHT ARROW keys to move this slider to the desired value.
@@
@msgScreenSensitiveHelpPrimaryBrailleTable
Use this option to make the currently selected table the primary Braille table.

Use the UP and DOWN ARROW keys to select an option.
@@
@msgssh_global_voice_profiles_modify_default_RadioButton
Select the voice profile to be used by default from this combo box.
The Default profile will be used in all applications except those where an application-specific profile was selected.
@@
@msgssh_voice_profiles_modify_application_RadioButton
Select a profile from this combo box to apply to the last application that had focus.
For example, if you were using Microsoft Word, these settings will now apply when you run Word.
@@
@msgssh_voice_profiles_SayAll_rate_slider
This slider lets you adjust the speech rate for the SAPI 5 synthesizer when using the Say All or Alternate Say All commands.
@@
@msgssh_voice_profiles_SayAll_pitch_slider
This slider allows you to adjust the pitch for the selected SAPI 5 voice.
@@
@msgssh_voice_profiles_SayAll_volume_slider
Drag the slider to increase or decrease the Say All speech volume.
@@
@msgssh_global_voice_profiles_profile_name_combo
Select the voice profile that you want to use.  You can then modify the profile by using the other options in this dialog box.
@@
@msgssh_individual_voice_profiles_profile_name_combo
Select the voice profile that you want to use.  You can then modify the profile by using the other options in this dialog box.
@@
@msgssh_voice_profiles_synthesizer_name_combo
Select the speech synthesizer that you want the selected profile to use.
@@
@msgssh_voice_profiles_synthesizer_language_combo
Select the synthesizer language that you want the selected profile to use. The available languages are determined by the speech synthesizer you are using.
@@
@msgssh_EnableAdditionalVoiceProfilesForInstalledVocalizerExpressive2Voices
When selected, this option enables additional voice profiles that are specific to Vocalizer Expressive voices that you have installed.  These Voice Profiles will show up in addition to the normal factory and user profiles.
@@
@msgssh_voice_profiles_SayAll_synthesizer_combo
Select a speech synthesizer that you want to use when performing a Say All or Alternate Say All.
@@
@msgssh_voice_profiles_SayAll_punctuation_combo
This combo box specifies how much punctuation JAWS speaks. Available options are None, Some, Most, and All.
@@
@msgssh_voice_profiles_SayAll_person_combo
Select which synthesizer voice you want to use for a Say All.
@@
@msgssh_voice_profiles_delete_button
Choose this button to delete the currently selected voice profile.
@@
@msgssh_voice_profiles_detect_SAPI_4_synthesizers_button
Choose this button to find other compatible synthesizers installed on your computer.
After all compatible synthesizers are located, the Update Synthesizer List dialog box appears.
@@
@msgssh_global_voice_profiles_set_as_default_button
Choose this button to make the profile that is selected in the Name combo box as the default Global Voices profile.
@@
@msgssh_individual_voice_profiles_set_as_default_button
Choose this button to make the profile that is selected in the Name combo box as the default Individual Voice profile.
@@
@msgssh_voice_profiles_rate_slider
This slider allows you to adjust the rate of speech for the currently selected synthesizer. As you use JAWS, you may want to hear different types of activities at different rates. For instance, while you are typing, you may want JAWS to read faster, so that you can ensure the accuracy of your typing. Alternatively, if you are reading a document, you might want JAWS to speak slower, so you can concentrate on content.
@@
@msgssh_voice_Punctuation_combo
Specify how much punctuation is spoken. Available options are None, Some, Most, and All.
@@
@msgssh_voice_Person_combo
Select which synthesizer voice you want to use. The voices that are available are determined by the selected speech synthesizer.
@@
@msgssh_voice_profiles_pitch_slider
This slider lets you adjust the pitch for the currently selected voice.
@@
@msgssh_voice_profiles_volume_slider
If you are using a hardware speech synthesizer, use this slider to increase or decrease the speech volume.
@@
@msgssh_voice_spell_rate_change_edit
When you hold down INSERT and press NUM PAD 5 twice quickly to spell a word, the word is spelled at a rate of speech slower than the normal speech rate.
The value in this edit box determines the extent to which the speech rate decreases.
@@
@msgssh_voice_UPPERCASE_EDIT
JAWS indicates that a letter is capitalized by reading it with higher-pitched speech.
The value in this edit box determines the extent to which the pitch increases beyond the normal level.
The values and ranges for this setting vary depending which synthesizer is selected.
@@
@msgssh_Voice_profiles_context_voice_combo
Select the voice context you want to modify.  Contexts are different parts of JAWS speech.
Available choices are: All Contexts, PC Cursor voice, JAWS Cursor voice, Keyboard voice, Tutor and Message voice, or Menu and Dialog Voice.
@@
@msgssh_voice_profiles_OK_button
Saves any changes made and closes the dialog box.
@@
@msgssh_voice_profiles_cancel_button
This button closes the dialog box without saving any changes made.
@@
@msgssh_global_voice_profiles_save_as_button
Choose this button to save your current global voice settings as part of a voice profile.
Type a name for your voice profile or select an existing profile from the list.
If you select an existing profile, that profile's global voice settings will be overwritten by the new settings when you choose OK.
@@
@msgssh_individual_voice_profiles_save_as_button
Choose this button to save your current individual voice settings as part of a voice profile.
Type a name for your voice profile or select an existing profile from the list.
If you select an existing profile, that profile's individual voice settings will be overwritten by the new settings when you choose OK.
@@
@msgssh_voice_restore_to_default_button
Choose this button to return to the default voice settings. These are the settings that were in use when you first installed JAWS.
@@
@sshmsg_AssignedNavQuickKeysList
This list view shows the current Navigation Quick Key assignments for the actions associated with this application.
Use the UP and DOWN ARROW keys to move through and select an item in the list, or use first letter navigation to move quickly to an item.
@@
@sshmsg_EditNavQuickKeyAssignmentButton
Select this button to open the Key Assignment combo box. Use the combo box to assign a new letter or number to the action highlighted in the Navigation Quick Key list view.

Press the SPACEBAR to activate this button.
@@
@sshmsg_DeleteNavQuickKeyAssignmentButton
Use this button to remove the current letter or number that is assigned to the item currently highlighted in the Navigation Quick Key list view. When pressed, the word Unassigned appears next to the action in the list view, and the Navigation Quick Key will no longer work for that action.

Press the SPACEBAR to activate this button, and then press OK to save the change.
@@
@sshmsg_AssignNewNavQuickKeyEditCombo
Use this combo box to view a list of all available letters and numbers that can be assigned to the current action. Press the UP and DOWN ARROW keys to move to an item, and then press ENTER to select it.  Next, press OK in the Navigation Quick Key Assignment dialog box to save the change.
@@
@sshmsg_AutomaticNotificationOfUpdatesCheckBox
Select this check box to have JAWS indicate when an update is available.  You then have the option to install it now or later. When this check box is cleared, you will not be alerted when software updates are available.  In this case, you must manually check for updates using the update feature in the JAWS Help menu.  This check box is selected by default.
@@
@sshmsg_SmartNavigationRadioButtons 
Smart Navigation offers a more efficient way to navigate in web-based applications and PDF files.
When set to "Controls," most controls are treated as single units when navigating by character or word.
When set to "Controls and Tables," controls are treated as single units when navigating by character or word, while inside a table, the ARROW keys move between cells.
Pressing the Say Character, Say Word, or Say Line commands twice quickly changes to the traditional navigation by character, word, line, sentence, and paragraph so you can review the text of the control.
Smart Navigation resumes when focus moves to a different control.
This option is Off by default.
@@
@sshmsg_FormsMode
Select Auto to automatically enter Forms Mode when you press TAB, SHIFT+TAB, or the ARROW Keys to move to a control.
Auto Forms Mode means that you can freely type in the edit field without having to first press ENTER.
When you exit the control, Forms Mode turns off. This is the default setting.

Select Manual to manually control Forms Mode operation. Manual Forms Mode is
used by default when using Navigation Quick Keys to jump to a form control, such as F or E for the next form field or edit box. 
This means that when you move into an edit field or combo box control, you must press ENTER first before you can type text or select a value.
To manually exit Forms Mode, press NUM PAD PLUS or ESC.

Select Semi-auto to have JAWS automatically enter Forms mode only when TAB or SHIFT+TAB is pressed to move to a form control.
Moving to a form control using Navigation Quick Keys and ARROW keys will not activate Forms Mode.
You must manually exit Forms Mode when Semi-auto is active. 

When Smart Navigation is on, it is recommended you use Semi-auto or Manual to prevent JAWS from randomly activating Forms Mode as you navigate around a web-based application.

Use the ARROW keys to select one of the radio buttons in this group.
@@
@sshMsg_SelectALanguage
Select a language that you want to download voices for.
@@
@sshMsg_PremiumVoices
Use the UP and DOWN ARROW keys to navigate the list of voices.
Press SPACEBAR to select a voice you want to install.
Press ALT + P to play a sample of the selected voice.
@@
@sshMsg_PremiumVoicesRemove
Use the UP and DOWN ARROW keys to navigate the list of voices.
Press SPACEBAR to select a voice you want to remove.
@@
@sshMsg_PlaySample
Choose this button to play a sample of the currently focused voice.
@@
@sshMsg_InstallSelectedVoices
Choose this button to install all of the selected voices from the list.
@@
@sshMsg_RemoveAVoice
Choose this button if you want to uninstall a voice.
@@
@sshMsg_RemoveAllCompactVoices
Choose this button if you want to uninstall all Vocalizer Expressive Compact quality voices.
@@
@sshMsg_RemoveAllVoices
Choose this button if you want to uninstall all Vocalizer Expressive voices.
@@
@sshMsg_RemoveSelectedVoices
Choose this button to remove all of the selected voices from the list.
@@
@sshMsg_Close
Choose this button to close this dialog.
@@
@SSHMsgVoiceAssistantEnableCheckBox
Clear this checkbox to turn off the Voice Assistant. This check box is selected by default.
@@
@SSHMsgVoiceAssistantWakeWordRadioButtonGroup
Use the radio buttons in this group to choose what you say to alert the Voice Assistant you are ready to speak a voice command. You can choose to speak the phrase "hey sharky" or the single word "sharky."
Note that the wake word is not available if you are using a Bluetooth microphone. You will need to activate the Voice Assistant using the ALT+INSERT+SPACEBAR keystroke.
The default is to say "Hey Sharky" before speaking a voice command.
@@
@SSHMsgVoiceAssistantDoNotListenForWakeWord
Select this check box to have the Voice Assistant no longer listen for a wake word. If the wake word is disabled, ALT+INSERT+SPACEBAR remains available to begin listening for a command. This check box is cleared by default.
@@
@SSHMsgVoiceAssistantEnableSounds
Clear this check box if you do not want to hear the sounds which indicate when the Voice Assistant is listening and has finished processing the command. This check box is selected by default.
@@
@SSHMsgVoiceAssistantMicrophoneInputDevice
Use this combo box to choose which microphone the Voice Assistant uses when listening for commands. By designating a different microphone for this feature than what is being used for other applications such as Teams or Zoom, it allows you to mute those applications during meetings and still use the Voice Assistant with JAWS, ZoomText, or Fusion.
@@
@SSHMsgVoiceAssistantPrivacyPolicy
This link opens the Privacy Policy page on the Freedom Scientific website.
@@
@sshMsg_RemoteDesktopChannelsListBox
This List contains the installation status for each supported remote channel. 
If running on a client machine, these are all channels supported on your machine.
If running on a server machine, this is the remote channel used by the server.
@@
@sshMsg_RemoteDesktopConnectionStatusListBox
This list box indicates the status and the result of the remote connection status test.
The connection status is displayed for each virtual channel used.
@@
@sshMsg_RemoteDesktopRepairButton
Activate this button to attempt to repair any channel that is reported to be not working.
@@
@sshMsg_RemoteDesktopTestConnectionButton
Activate this button to open the Remote Connection Status dialog box.
This dialog box tests the connection between the client and the server machine.
This test might take a minute.
@@
@sshMsg_RemoteDesktopRefreshButton
Activate this button to re-test the connection between the client and the server machine.
This test might take a minute.
@@
; for QuickAccessBar, messages contain QAB.
;This product only runs when Fusion or ZoomText is running.
@msgShortcutsListTutor
Use space bar to select an item and move it up and down with arrow keys
@@
@sshQABMsg_ShortcutsView
Use this button to expand the view of the Quick Access Bar to display more information.
@@
; sshQABMsg_ZoomButton is actually for all the shortcut buttons and sliders.
@sshQABMsg_ZoomButton
This shortcut has two actions. 
Activate the shortcut by selecting it with ENTER, then adjust the value with the UP and DOWN ARROW keys.
To deactivate the shortcut, press ESC.
@@
@sshQABMsg_ZoomSlider
Slide to adjust the zoom level.
@@
@sshQABMsg_ZoomOutButton
Press to zoom out.
@@
@sshQABMsg_ZoomInButton
Press to zoom in.
@@
@sshQABMsg_SpeechButton
Press to toggle speech on and off.
@@
@sshQABMsg_SpeechRateButton
Press to adjust speech rate.
@@
@sshQABMsg_SpeechRateSlider
Slide to adjust speech rate.
@@
@sshQABMsg_DecreaseSpeechRateButton
Press to decrease speech rate.
@@
@sshQABMsg_IncreaseSpeechRateButton
Press to increase speech rate.
@@
@sshQABMsg_ColorButton
Press to toggle color settings.
@@
@sshQABMsg_SpeechHistoryButton
Press to show speech history.
@@
@sshQABMsg_MouseEchoButton
Press to toggle mouse echo.
@@
@sshQABMsg_JAWSManagerButton
Press to get a list of JAWS managers.
@@
@sshQABMsg_SelectVoiceProfileButton
Press to select voice profiles.
@@
@sshQABMsg_ShowShortcutNamesButton
Press to show or hide shortcut names.
@@
@sshQABMsg_ShortcutNamesCustomizeButton
Press to bring up Customize shortcuts list.
@@
@sshQABMsg_PinButton
Press to secure the Quick Access Bar at this location on the screen.
@@
@sshQABMsg_UnpinButton
Press to release the Quick Access Bar in order to move it to a location you would like to pin it.
@@

;UNUSED_VARIABLES

; Items within the Advance options dialog.
@MsgScreenSensitiveHelpUseDongleAuthorization_L
When checked, JAWS will look for its authorization via a Dongle first before looking for the Internet License Manager (ILM) key.  This is useful for consultants and dealers who might be working on this computer in the future.  It should not hinder your use at all.
The Default for this is Checked.
@@
@MsgScreenSensitiveHelpLaunchPACMateAtStartUp_L
If you select this check box, PAC Mate Desktop automatically starts when you start JAWS.
PAC Mate Desktop allows you to connect to your computer remotely through your PAC Mate.
For more information on using PAC Mate Desktop, refer to the JAWS online help.
@@
@msgIEInfo
Internet Explorer version %1
@@
@msgNoPort
Internal
@@
@msgScreenSensitiveHelpVerbosityWizard
Verbosity determines the amount of information spoken by JAWS. There are three verbosity levels: Beginner, Intermediate, and Advanced. The beginner level provides the maximum amount of information spoken, while intermediate and advanced levels provide fewer details. Beginner is the default setting.

Use the ARROW keys to select one of the radio buttons in this group.
@@
@msgssh_individual_voice_profiles_modify_default_RadioButton
Select this radio button to apply the current settings as the default Individual Voice values used by JAWS for all applications when using a specific voice.
@@
; %1 is either msgKeyboardProcessingMethod_Unified or msgKeyboardProcessingMethod_Legacy
@msgKeyboardProcessingMethod_Label
Keyboard Processing method: %1
@@
@msgKeyboardProcessingMethod_Unified
Unified
@@
@msgKeyboardProcessingMethod_Legacy
Legacy
@@

;END_OF_UNUSED_VARIABLES

EndMessages

;JAWS 10.X 

const
	;file names
msgFN1 = "Audible Manager",

;string compares
sc1_L = "To open the playlist editor dialog press Ctrl + 1",
;for closing detail view, added by kag
scHideWindow = "Hide Window",
;For opening Detail View, added by kag
scDetail = "Detail",
;for pausing and resuming downloads, added by kag
	scPause = "Pause",
	scResume = "Resume",
;for aborting reading of status while transferring files to mobile device
scAudioFileTransfer = "Audio file transfer",
;for reading transfer dialog, added by kag
scOK = "OK",
scSlideTheBar = "Slide the bar",
scNotSelected = "Not selected",
scSelectedFormat1 = "Selected Format Format 1",
scSelectedFormat2 = "Selected Format Format 2",
scSelectedFormat3 = "Selected Format Format 3",
scSelectedFormat4 = "Selected Format Format 4",
;for verifying Device Pane is open when in CD Burn mode
scFree = "Free",
scStorageCard = "storage card",
scMainMemory = "main Memory",

;keystrokes
ks1 = "spacebar",
ks2 = "control+r", ;rewind
ks3 = "control+f", ;Fast Forward
ks4 = "control+shift+r", ;previous section 
ks5 = "control+shift+f", ;next section
ks6 = "control+p",;PlayAndStop 
ks7 = "control+d", ;volume down
ks8 = "control+u", ;in Script ControlU ()
;for autostartEvent, added by kag
ks9 = "Escape",


;UNUSED_VARIABLES

;for speaking selected/not selected status of files in New Subscriptions and New Individual Programs folders, when toggling with spacebar
scElected = "elected"

;END_OF_UNUSED_VARIABLES

	 messages
@msgAutoStart1_L
To hear the %product% help topic for AudibleManager , hold down the Insert key and press f1 twice quickly.
@@
@msgAutoStart1_S
%product% help topic for AudibleManager  , insert+f1 twice quickly.
@@
@msgFocusChangedEvent1_L
After adding all the desired programs to your play list
To open the playlist editor dialog press Ctrl + 1
@@
@msgFocusChangedEvent1_S
After adding programs to play list
To open playlist editor dialog press Ctrl + 1
@@
@msgScreenSensitiveHelp1_L
This is the Play List Schedule Window.
To open the playlist editor dialog press Ctrl + 1.
Press the tab key to move to the next control.
@@
@msgScreenSensitiveHelp1_S
Play List Schedule Window.
To open playlist editor dialog press Ctrl + 1.
Press tab key for next control.
@@
@msgHotKeyHelp1_L
To hear the %product% help topic for AudibleManager , hold down the Insert key and press f1 twice quickly.
@@
@msgHotKeyHelp2_L
To pause or play the current audio file press %KeyFor(Enter).
To increase volume press %KeyFor(ControlU).
To decrease volume press %KeyFor(VolumeDown).
For Fast Forward press %KeyFor(FastForward).
For ReWind Press %KeyFor(ReWind).
		To skip to the next section press %KeyFor(NextSection).
To skip to the previous section press %KeyFor(PreviousSection).
Press Escape to close this window.
@@
	@msgHotKeyHelp3_L
The following %product% shortcut keys can be useful:
To hear the percentage of an audio file downloaded, press %KeyFor(DownloadProgress ).
To read the contents of the Device Pane, press %KeyFor(ReadDevicePane).
To activate the Storage Card radio button in the Device Pane (for Audible Otis users), press %KeyFor(ClickStorageCard).
To activate the Main Memory radio button in the Device Pane (for Audible Otis users), press %KeyFor(ClickMainMemory).
To place focus in the mobile device or Transfer	program list, pres %KeyFor(ActivateOtisOrTransferProgramList).
To place focus in the Library program list, press %KeyFor(ActivateInBoxProgramList).
To go to MyLibrary online at the Audible website, press %KeyFor(GoToMyLibrary).
Press Escape to close this window.
@@
@msgHotKeyHelp4_L
The following %product% shortcut keys can be useful:
To hide the Detail View, press %KeyFor(HideDetailView ).
Press Escape to close this window.
@@
@msgHotKeyHelp5_L
The following tip can be useful:
To hide the Detail View, press ESCAPE or ALT+F4.
Press Escape to close this window.
@@
@msgHotKeyHelp6_L
The following tip can be useful:
To return to the Library, press %KeyFor(ActivateInBoxProgramList).
Press Escape to close this window.
@@
@msgHotKeyHelp7_L
The following %product% shortcut keys can be useful:
To read the contents of the Device Pane, press %KeyFor(ReadDevicePane).
To activate the Storage Card radio button in the Device Pane (for Audible otis users), press %KeyFor(ClickStorageCard).
To activate the Main Memory radio button in the Device Pane (for Audible Otis users), press %KeyFor(ClickMainMemory).
To place focus in the mobile device or Transfer	program list, pres %KeyFor(ActivateOtisOrTransferProgramList).
To place focus in the Library program list, press %KeyFor(ActivateInBoxProgramList).
To place focus in the Detail Pane for the selected program, press %KeyFor(FocusToDetailPane).
To go to MyLibrary online at the Audible website, press %KeyFor(GoToMyLibrary).
Press Escape to close this window.
@@
@msgWindowKeysHelp1_L
The following AudibleManager shortcut keys can be useful:
To view details about the selected file, press Enter.
To create a new folder, press CONTROL+SHIFT+F.
To move the selected item to a new folder, press CONTROL+SHIFT+V.
To copy the selected item to a new folder, press CONTROL+SHIFT+C.
To turn the Shortcut view on or off, press CONTROL+S.
To show or hide the content overview, press CONTROL+O.
To open or close the Device Pane, press CONTROL+SHIFT+E.
To go to the subscriptions folder press CONTROL+U.
To synchronize subscriptions press CONTROL+SHIFT+U.
To choose a mobile device, press CONTROL+SHIFT+D.
To activate or deactivate a device, press CONTROL+A.
To search for audio files, press CONTROL+I.
To add audio files, press CONTROL+SHIFT+I.
To bring up the Audio Configuration Wizard press CONTROL+W.
To empty the trash, press CONTROL+SHIFT+T.
Press Escape to close this window.
@@
@msgWindowKeysHelp2_L
The following AudibleManager shortcut keys can be useful:
To cycle from the folder Tree View to the programs List View to the Device Pane (when open), press TAB.
To play the selected file, press SHIFT+P.
To view details about the selected file, press Enter or CONTROL+D.
To exit the Detail View, press ESCAPE or ALT+F4.
To print details about the selected file, press CONTROL+P.
To create a new folder, press CONTROL+SHIFT+F.
To move the selected item to a new folder, press CONTROL+SHIFT+V.
To copy the selected item to a new folder, press CONTROL+SHIFT+C.
To turn the Shortcut view on or off, press CONTROL+S.
To show or hide the Audible Folders overview, press CONTROL+O.
To open or close the Device Pane, press CONTROL+SHIFT+E.
To go to the subscriptions folder press CONTROL+U.
To synchronize subscriptions press CONTROL+SHIFT+U.
To choose a mobile device, press CONTROL+SHIFT+D.
To activate or deactivate a device, press CONTROL+A.
To toggle between Device Mode and CD burn mode, press CONTROL+B.
To refresh the CD burner, press SHIFT+F5.
To add the selected file to the mobile device, press CONTROL+T.
To show the transfer list, press SHIFT+T.
To search for audio files, press CONTROL+I.
To add audio files, press CONTROL+SHIFT+I.
To bring up the Audio Configuration Wizard press CONTROL+W.
To empty the trash, press CONTROL+SHIFT+T.
Press Escape to close this window.
@@
@msgWindowKeysHelp3_L
The following AudibleManager shortcut keys can be useful:
To cycle from the folder Tree View to the programs List View to the Device Pane to the Mobile Device List View, press TAB.
To play the selected file, press CONTROL+P or ENTER.
To stop playing the current file, press CONTROL+P.
To rewind within the current file, press CONTROL+R.
To move to the previous section of the current file, press CONTROL+SHIFT+R.
To fast forward within the current file, press CONTROL+F.
To move to the next section of the current file, press CONTROL+SHIFT+F.
To increase playback volume, press CONTROL+U.
     (Note that this will also increase the volume of your software synthesizer.)
To decrease playback volume, press CONTROL+D.
     (Note that this will also decrease the volume of your software synthesizer.)
To set a bookmark at the current position of the active audio file, press CONTROL+B.
To go to a bookmark within the active audio file, press CONTROL+G.  Then select the desired bookmark from the popup context menu.
To view details about the selected file, press F2+TAB.  (AudibleManager 5.05 or greater only)
To create a new subfolder, press CONTROL+SHIFT+S.
To move the selected item to a new folder, press CONTROL+SHIFT+V.
To copy the selected item to a new folder, press CONTROL+SHIFT+C.
To choose a mobile device, press CONTROL+SHIFT+D.
To activate or deactivate a device, press CONTROL+A.
To toggle between Device Mode and CD burn mode, press CONTROL+B.
To refresh the mobile device or CD burner, press SHIFT+F5.
To add the selected file to the mobile device, press CONTROL+T.
To add audio files, press CONTROL+SHIFT+I.
To empty the trash, press CONTROL+SHIFT+T.
Press Escape to close this window.
@@
@msgNotDetailView
Not in detail view
@@
@msgHideDetailView_L
Hide detail view 
@@
@msgHideDetailView_S
Hide 
@@
@msgDetailView
program details
@@
@msgOtisList_L
Mobile device or Transfer Program list
@@
@msgOtisList_S
Mobile device  or Transfer List
@@
@msgOtisNotFound
Mobile device or Transfer program list not found
@@
@msgAlreadyInOtis_L
Already in mobile device or Transfer program list
@@
@msgAlreadyInOtis_S
Already in mobile device or Transfer List
@@
@msgAlreadyInInBox_L
Already in Library program list
@@
@msgAlreadyInInBox_S
Already in Library
@@
@msgInBoxList_L
Library programs
@@
@msgInBoxList_S
Library
@@
@msgInBoxNotFound
Library not found
@@
@msgNoOtisPrograms_L
No mobile device or transfer list programs found. Your Device Pane may not be open, your mobile device may not be connected, or your transfer list may be empty.
@@
@msgNoOtisPrograms_S
No mobile device or transfer list programs.
@@
@msgDevicePaneOpen_L
Device Pane Open
@@
@msgDevicePaneOpen_S
open
@@
@msgDevicePaneClosed_L
Device pane closed
@@
@msgDevicePaneClosed_S
closed
@@
@msgStorageCard_L
storage card data
@@
@msgStorageCard_S
storage
@@
@msgNoStorageCard_L
storage card button not found
@@
@msgNoStorageCard_S
not found
@@
@msgMainMemory_L
Main Memory data
@@
@msgMainMemory_S
Main Memory
@@
@msgNoMainMemory_L
Main Memory button not found
@@
@msgNoMainMemory_S
not found
@@
@msgTransferReview_l
Ready to transfer file.  To review or edit the starting and ending times, use the Tab key. Otherwise press Enter to start the transfer.
@@
@msgTransferReview_S
Use Tab to edit times or Enter to start.
@@
@msgHours
Hours
@@
@msgMinutes
Minutes
@@
@msgEdit
Edit
@@
@msgPaneNotFound_L
Device pane not found
@@
@msgPaneNotFound_S
Not found
@@
@msgNoHideDetailView_L
Sorry, couldn't hide detail view
@@
@msgNoHideDetailView_S
failed
@@
@msgFormat1_l
As Format 1
@@
@msgFormat1_S
Format 1
@@
@msgFormat2_l
As Format 2
@@
@msgFormat2_S
Format 2
@@
@msgFormat3_l
As Format 3
@@
@msgFormat3_S
Format 3
@@
@msgFormat4_l
As Format 4
@@
@msgFormat4_S
Format 4
@@
@msgMyLibrary
MyLibrary
@@
@msgMyLibraryNotFound_L
MyLibrary graphic not found
@@
@msgMyLibraryNotFound_S
@not found
@@


;UNUSED_VARIABLES

@msgNoPercentVisible_L
no download percentage found
@@
@msgNotSelected_L
Not selected for download
@@
@msgNotSelected_S
Not selected
@@
@msgSelected_L
Selected for download
@@
@msgSelected_S
Selected
@@
@msgNotAvailable_L
Not available in AudibleManager 5
@@
@msgNotAvailable_S
Not available
@@

;END_OF_UNUSED_VARIABLES

EndMessages
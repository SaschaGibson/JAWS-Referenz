; JAWS 7.x Message Header file for Windows Media Player
; Copyright 2005-2015, Freedom Scientific, Inc.
; 12/02/05 dbrown


const
; Keystroke assignments by their purpose...
;Window names, (or partial names)
	wn_CurrentPlayList="Current Playlist",
	wn_DefaultView="Default view",
; Object names used in GetObjectInfoByName function...
	onWmpAppHost="WMPAppHost",
;String compares...
	scTimeSeparator = ":", ; Time separator.
	scColumnSolute = " is: ",
	scColumnEmptyNotification = "Not available",
	scColumnNameIsLength = "Length",
	scColumnNameIsType = "Type",
	scUnnamedView0="Unnamed_view_0",



;UNUSED_VARIABLES

;Window names, (or partial names)
	wn_WindowsMediaPlayer="Windows Media Player",
	wn_TaskGroupBox="Task Group box",
	wn_PlayControlGroupBox="Play controls",
	wn_SelectionAndActionTree="Selection and Action tree",
	wn_ServiceGroupBox="Service group box",
	wn_LibraryWindow="Library",
	wn_BurnCDWindow="Burn",
	wn_RipCDWindow="Rip",
	wn_PlayWindow="Play",
	wn_NowPlayingWindow="Now Playing",
	wn_GuideWindow="Guide",
	wn_EditPlayList="Edit Playlist",
; Object names used in GetObjectInfoByName function...
	onLibrary="LiBrary",
	onBurn="Burn",
	onSync="Sync",
	onRip="Rip",
	onNowPlaying="Now Playing",
;String compares...
	scMaximizeSymbol = "maximize symbol",
	scSV="SV", ; Service task button garbage.
	scTaskBtn="taskBtn", ; Task group button garbage.
	scPlyBtn="PlyBtn"

;END_OF_UNUSED_VARIABLES

Messages
; ScreenSensitiveHelp section
; Main help screen
@MsgScreenSensitiveHelp1_L
You are in the Windows Media Player Task Center main application tree.
Here you use the Up and Down arrow keys to select an item from the tree, then use the Left and Right arrow keys to open or close the selected branch.
Once the branch is open, use Tab and Shift+Tab to switch between the tree and the list containing the data relevant to that selection.
You can continue using the Tab keys to move through the toolbars and button groups within this screen.

The top toolbar contains the Service group buttons, and the bottom toolbars contain the Task group buttons and the player controls relevant to the item selected within the main application tree.

@@
@MsgScreenSensitiveHelp1_S
Windows Media Player Task Center main application tree.
Use Up and Down arrow keys to select an item, Left and Right arrow keys to open or close the selected branch.
Once open, use Tab and Shift+Tab to switch between the tree and the data list.
Use the Tab keys to move to other toolbars and button groups within this screen.
Top toolbar are Service group buttons, and the bottom toolbars contain Task group buttons and player controls.


@@
; Hotkey Help messages
@msgHotKeyHelp1_L
The following hotkeys are available in Windows Media Player:

In all areas:
Use Tab and Shift+Tab to navigate through the buttons and controls on the screen.

In the Play Control Group:
Pressing Enter will play current track.
Use Control+P for playing and pausing.
Use Control+S to stop playing.
Use F7 to Mute the track.
Use F8 to decrease the volume.
Use F9 to increase the volume.
Use Control+Shift+B for rewinding.
Use Control+Shift+F for fast forwarding.
Use Control+B to move to the previous track.
Use Control+F to move to the next track.

In the Library area:

To jump to the Task Center main selection tree, use %KeyFor(MoveToMainTree).
To jump to the Current Play/results List, use %KeyFor(MoveToCurrentPlayList).

When burning a CD/DVD:
Use Alt+b to start the burn process.
Use Alt+s to stop the burn process.
Use Alt+A to edit the Play list.
Use Alt+C to set Sync settings.

When ripping a CD:
Use Alt+C to start the ripping process.
Use Alt+S to stop the ripping process.
Use Alt+A to find the album information.
Use Alt+I to view the album information.

When synchronizing:
Use Alt+S to start and stop the sync process.
Use Alt+C to set sync settings.

Press Escape to close this window
@@
@msgHotKeyHelp1_S
Hotkeys available in Windows Media Player:

In all areas:
Tab and Shift+Tab navigates through the buttons and controls.
Alt+V drops down View menu, then press G to open Go to... sub menu.
Select one of Media Player's different areas from this menu.

Play Control Group:
Enter plays current track.
Control+P plays and pauses.
Control+S stops playing.
F8 mutes the track.
F9 decreases volume.
F10 increases volume.
Control+Shift+B rewinds.
Control+Shift+F fast forwards.
Control+B moves to previous track.
Control+F moves to next track.

Library area:
Move to Task Center main selection tree %KeyFor(MoveToMainTree)
Move to Current Play/results List, %KeyFor(MoveToCurrentPlayList)

burning a CD/DVD:
Alt+b starts burn.
Alt+s stops burn.
Alt+A edits Play list.
Alt+C sets Sync settings.

Ripping a CD:
Alt+C starts ripping.
Alt+S stops ripping.
Alt+A finds album info.
Alt+I views album info.

Synchronizing tracks:
Alt+S starts and stops sync.
Alt+C set sync settings.

Press Escape to close this window
@@
; Miscellaneous messages
@MsgSingleHour
%1 Hour
@@
@MsgMultipleHours
%1 hours
@@
@MsgSingleMinute
%1 Minute
@@
@MsgMultipleMinutes
%1 Minutes
@@
@MsgSingleSecond
%1 Second
@@
@MsgMultipleSeconds
%1 Seconds
@@
; Error messages
@msgCurrentPlayListNotFound
Current Play List not found
@@
@msgMainTreeNotFound
Task Center Main tree not found
@@


;UNUSED_VARIABLES

@msgWindowsMediaPlayerScripts
WindowsMediaPlayerScript set
@@

;END_OF_UNUSED_VARIABLES

EndMessages
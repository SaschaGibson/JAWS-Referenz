; Copyright 1995-2015 Freedom Scientific, Inc.
;JAWS message file for Winamp

Const
WinampImportExportListMessage = "Export time markers for the current track|Import time markers for the current track|Import all time markers from a time marker set file",
;Function names to be displayed in the user buffer
FuncIncreaseBands = "IncreaseEQBands",
FuncDecreaseBands = "DecreaseEQBands",
FuncIncreasePreAmp = "SayEqualiserBand(11, 1)",
FuncDecreasePreAmp = "SayEqualiserBand(11, -1)",
; function names used for scheduling etc.
fn_CheckStoppingPoint = "CheckStoppingPoint",
fn_CheckStopAfterCurrentTrack = "CheckStopAfterCurrentTrack",
fn_SetTimeMarkerHelper = "SetTimeMarkerHelper",
fn_FindPlayingItem = "FindPlayingItem",

; keystrokes
	ksEQIncreaseBands = "1234567890",
	ksEQDecreaseBands = "QWERTYUIOP",
	ksEQPreampIncrease = "`",
	ksEQPreampDecrease = "tab",
	ksToggleRepeat = "r",
	ksAddBookMark = "alt+i",
	ksEditBookMark = "alt+Control+i",
	ksAddBookMarkLaterVersion = "Alt+Control+B",
;for ksOptionsInMenu	, this is the access key to Options submenu off of main Winamp menu (alt+f in English Winamp brings up main menu).
	ksOptionsInMenu = "o",
	ksGeneratePlayListToHtml  = "Alt+Control+g",
	ksToggleShuffleMode = "s",
	ksToggleMainWindow = "alt+w",
	ksToggleEqualiser = "Alt+G",
	ksToggleEqualiserState = "n",
	ksToggleEqualiserAutoload = "a",
	ksTogglePlaylistEditor = "Alt+E",
	ksToggleLibrary = "Alt+L",
	ksToggleWinampVideo = "Alt+V",
	ksToggleStationInfo = "Alt+B",
	ksDisableMiniBrowser = "Alt+T",
	ksReviewEndOfTrack = "Alt+R",
	ksSetTimeMarker = "M",
	ksNextTrack = "b",
	ksPauseTrack = "c",
	ksPlayTrack = "x",
	ksPriorTrack = "z",
;for ks_WINAMP_SINGLE_KEYS_*
;not translatable except possibly with far eastern languages,
;these are a combination of single letter keys (not accented or layered) pressed in Winamp individually.
;If you must translate (far east languages perhaps), make your string lowest to highest unicode char,
;from left to right.
	ks_WINAMP_SINGLE_KEYS = "ABCMNVSXZ",
	ks_WINAMP_SINGLE_KEYS_2 = "BCMVZ",
;for ks_SHIFTED_KEY_BASE, this is not translatable unless strKeyName never begins with string 'shift'.
;If it does, you would translate the string before '+' to that string.
	ks_SHIFTED_KEY_BASE = "Shift+",
	ksStopAndFadeOut = "shift+v",
	ksToggleTimeDisplayMode  = "Control+T",
	ksPlaylistSelectAllOrToggleWinampAlwaysOnTop = "control+A",
	ksMinimiseWinamp = "Alt+M",
	ksCloseWinamp = "Alt+F4",
	ksGotoWinampPreferences = "Control+P",
	ksO = "o",

; window names
;for wn_title_base, this string is the final characters of the window's name, often when a track is playing.
wn_title_base = " - Winamp",
wn_Equalizer = "Winamp Equalizer",
wn_Library = "Winamp Library",
wn_PlayListEditor = "Winamp Playlist Editor",
wn_StationInfo = "Station Info",
wn_Video = "Winamp Video",
  WN_JumpToTime = "Jump to time",



;UNUSED_VARIABLES

	ksElapsedTime = "Alt+Shift+T",
	ksJumpTimeMarker = "Alt+Shift+M",
	ksJumpRelativeTime = "Alt+Shift+J",
	ksLastRelativeTime = "Alt+J",
	ksShuffleRepeatModeStatus = "Alt+Shift+S",
	ksWindowStatuses = "Shift+JAWSKey+W",
	ksRemoveTimeMarker = "Control+Shift+M",
	ksImportExportTimeMarker = "Control+Alt+Shift+M",
	ksCurrentTrackLength = "Control+JAWSKey+T",
	ksTimeRemaining = "Control+Shift+T",
	ksSelectReviewTime = "Control+JAWSKey+R",
	ksCurrentTrackTitle = "Alt+Control+T",
	ksCurrentTrackInfo = "JAWSKey+Shift+T",
	ksJumpToTimeMarker  = "control+j",
	ksStopTrack = "v",
; Window classes
wc_HTMLControlClass = "HTMLControl" ,
wc_ShellEmbeddingClass = "Shell Embedding"

;END_OF_UNUSED_VARIABLES

Messages
@MsgCurrentTrack
current track
@@
@MsgWinAmp
WinAmp
@@
@MsgWinAmpLibrary
WinAmp Library
@@
@WinampVolumeUp_L
Increase Volume
@@
@WinampVolumeDown_L
Decrease Volume
@@
@MsgPanLeft_L
Pan left
@@
@MsgPanRight_L
Pan right
@@
@WinampClosingWinampMinibrowser_l
Closing the Winamp Minibrowser
@@
@WinampClosingWinampMinibrowser_s
Closing Minibrowser
@@
@MsgMainWindow
Winamp Main Window
@@
@MsgEqualizerStatus_L
equalizer %1
@@
@MsgMainWindowOpen_L
main window open
@@
@MsgMainWindowClosed_l
main window closed
@@
@MsgPlayListEditorStatus_L
play list editor %1
@@
@MsgVideoStatus_L
video window %1.
@@
@MsgPlaylistEditor
Playlist Editor
@@
@MsgEqualiser
Equalizer
@@
@MsgMinibrowser
Minibrowser
@@
@MsgLibrary
Library
@@
@MsgStationInfo
station info window
@@
@MsgVideo
Video window
@@
@WinampYouAreInThe
You are in the
@@
@WinampThe
the
@@
@WinampAnd
and
@@
@WinampAre
are
@@
@WinampIs
is
@@
@WinampAlsoOpen
also open
@@
@WinampNoOtherWindows
No other Winamp Windows are open
@@
@MsgWinampNoWindowsOpen_L
No Winamp Windows are open
@@
@WinampWinampMenus
Winamp menus
@@
@WinampWhichIsObscured
which is obscured
@@
@WinampTopOfPlayList
Top of play list
@@
@WinampTop
top
@@
@WinampBottomOfPlayList
Bottom of play list
@@
@WinampBottom
bottom
@@
@WinampNotInPlayList
Not in the play list window
@@
@WinampTimeMarker
Time marker
@@
@WinampTimeMarkerNameTitle
Time Marker Name
@@
@WinampTimeMarkerNamePrompt
Input a time marker name.  Press Enter or Escape for none.
@@
@MsgTimeMarkerSet_L
time marker %1 set at %2, %3.
@@
@MsgTimeMarkerRemoved_L
Time marker %1 removed.
@@
@MsgNoTimeMarkers_L
There are no time markers set for the current track
@@
@MsgTimeMarkerError_L
An error has occurred while trying to write to the time marker file.
@@
@MsgNoTrackPlaying_L
There is no track playing.
@@
@MsgSkipToTimeMarker_L
Select a time marker to skip to
@@
@MsgRemoveTimeMarker_L
Select a time marker to remove
@@
@WinampTimeMarkerSelection
Time Marker Selection
@@
@MsgNoTrackReady_L
There is no track ready to be played
@@
@WinampRemoveAllTimeMarkers
Remove all time markers set for the current track
@@
@WinampRemoved
removed
@@
@MsgAllTimeMarkersRemoved_L
All time markers set for the current track have been removed
@@
@MsgAllTimeMarkersRemoved_S
all time markers removed.
@@
@WinampMinute
minute
@@
@WinampMinutes
minutes
@@
@WinampSecond
second
@@
@WinampSeconds
seconds
@@
@MsgTimeRemaining_S
%1 remaining
@@
@MsgElapsedTime_L
%1 elapsed
@@
@MsgTimeLength_L
the track length is %1.
@@
@MsgWinAmpFunctionNotAvailable_l
this function is only available inside the Winamp Main Window, Equaliser and Playlist Editor
@@
@WinampRelativeTimeTitle
Jump to Relative Time
@@
@WinampRelativeTimePrompt
Enter the time you would like to jump to using the format mm:ss and press Enter.  To jump backwards in time, place a minus or dash in front of the time.
@@
@WinampImportExportListPrompt
Time Marker Import/Export Operations
@@
@WinampImportExportInputTitle
Import/Export File
@@
@WinampImportExportInputPromt
Type in the name of the time marker set file you wish to use and press enter.  Otherwise, press Escape or leave the field blank to cancel the operation.
@@
@MsgCurrentTrackExportComplete_L
Time markers for the current Track have been exported to %1.
@@
@MsgCurrentTrackExportError_L
Unable to export time markers for the current track.
@@
@MsgCurrentTrackImportComplete_L
Time markers for the current Track have been imported from %1.
@@
@MsgCurrentTrackImportError_L
Unable to import time markers for the current track.
@@
@MsgImportAllTimeMarkersComplete_L
Time markers for %1 tracks were successfully imported from %2.
@@
@MsgImportAllTimeMarkersError_L
An error has occurred while importing time markers for%1 tracks from %2.
@@
@MsgImportAllTracksVoid_L
%1 has no track list therefore No time markers have been imported.
@@
@MsgOpen
open
@@
@MsgClosed
closed
@@
@WinampOnlyOpenWindow_l
You are trying to close the only open Winamp window.  To clos this window, you should either first open one of the others or type this command twice quickly
@@
@WinampOnlyOpenWindow_s
You are trying to close the only open Winamp window.
@@
@HelpSelectBand
Arrow up or down to the desired band and press enter.
@@
@EqIncrease1
Increase 1
@@
@EqIncrease2
Increase 2
@@
@EqIncrease3
Increase 3
@@
@EqIncrease4
Increase 4
@@
@EqIncrease5
Increase 5
@@
@EqIncrease6
Increase 6
@@
@EqIncrease7
Increase 7
@@
@EqIncrease8
Increase 8
@@
@EqIncrease9
Increase 9
@@
@EqIncrease10
Increase 10
@@
@EqDecrease1
Decrease 1
@@
@EqDecrease2
Decrease 2
@@
@EqDecrease3
Decrease 3
@@
@EqDecrease4
Decrease 4
@@
@EqDecrease5
Decrease 5
@@
@EqDecrease6
Decrease 6
@@
@EqDecrease7
Decrease 7
@@
@EqDecrease8
Decrease 8
@@
@EqDecrease9
Decrease 9
@@
@EqDecrease10
Decrease 10
@@
@MsgTimeDisplayModeStatus_L
Time display mode set to %1.
@@
@MsgWinampAlwaysOnTop_L
Always on top mode is %1
@@
@MsgOn
on
@@
@MsgOff
off
@@
@MsgShuffleModeOff_L
Shuffle mode is off.
@@
@MsgShuffleModeOn_L
Shuffle mode is on.
@@
@MsgShuffleModeStatus_L
Shuffle mode is %1.
@@
@MsgRepeatModeOff_L
repeat mode is off.
@@
@MsgRepeatModeOn_L
repeat mode is on.
@@

@MsgRepeatModeStatus_L
repeat mode is %1.
@@
@WinampShuffleModeDisabled
Shuffle mode is disabled while a stop marker is set
@@
@MsgMiniBrowserClosed_L
The WinAmp mini browser is closed.
@@
@MsgMiniBrowserClosed_S
mini browser closed
@@
@MsgMiniBrowserOpened_L
The WinAmp mini browser is opened.
@@
@MsgMiniBrowserOpened_S
mini browser opened
@@
@MsgLibraryStatus_L
library %1
@@
@MsgStationInfoStatus_L
station info window %1
@@
@MsgWinampEqualiserAutoloadStatus_L
Winamp Equaliser autoload %1.
@@
@MsgPreAmpValue
The PreAmp value is %1.
@@
@MsgEqualizerBandValue
Band %1 is %2.
@@
@MsgEqualizerSummary_Part1
Equalizer Summary:
%1
%2
%3
%4
%5
%6
@@
@MsgEqualizerSummary_Part2
%1
%2
%3
%4
%5
%6
%7
@@
@MsgEnabled
enabled
@@
@MsgDisabled
disabled
@@
@WinampDebugMode
The Winamp scripts debugging mode
@@
@WinampDebugAlert
Debug alert
@@
@MsgTrackInfo
Track Information:
Track title: %1
track length: %2
Sample rate: %3 kHz
Bit rate: %4 kilobits per second
Number of channels: %5
@@
@MsgCurrentTrackTitle_L
The current track is %1.
@@
@WinampNotAvailableTrackMustBePlaying
Not available (track must be playing)
@@
@MsgWinampVolumeSetTo
Volume set to %1 %
@@
@MsgWinampPanningSetTo
Panning set to %1 %
@@
@WinampMonoWarning_l
The currently playinng track is in a single channel format so panning will probably have no effect on the output
@@
@WinampMonoWarning_s
The current track is only single channel
@@
@MsgBookMarkAdded_L
Bookmark Added.
@@
@MsgBookMarkAdded_S
added.
@@
@WinampBkEditErr
this feature is only available in the Winamp Main Window.
@@
@WinampOnlyAvailable3
this function is only available inside the Winamp Main Window and the Playlist Editor
@@
@MsgGenerateHTMLPageError_L
This feature is only available in the playlist editor.
@@
@MsgGenerateHTMLPage_L
Creating html page.
@@
@WinampNotAvailableInThisVersion
This command is not available in this version of Winamp
@@
@WinampCancelled
cancelled
@@
@MsgStopAfterCurrentTrackActive_L
Stop after current track is Activated.
@@
@MsgStopAfterCurrentTrackActive_S
activated.
@@
@MsgStopAfterCurrentTrackInActive_L
Stop after current track is not Activated.
@@
@MsgStopAfterCurrentTrackInActive_S
not activated.
@@
@msgStopMarker
stop marker
@@
@msgStopMarkerReached_s
stop marker reached
@@
@msgStopMarkerReached_l
The stop marker has been reached and playback will cease when the current track has finished playing
@@
@MsgStopMarkerCleared_L
stop marker is  cleared.
@@
@MsgStopMarkerCleared_S
cleared.
@@
@MsgStopMarkerSet_L
Stop marker set to track %1.
@@
@MsgNoStopMarkerSet_L
No stop marker is set.
@@
@MsgNoStopMarkerSet_S
not set.
@@
@WinampStoppingPointNotInCoreWindow_l =
The track indicated by the stop marker has just started playing but you are not in the Main Window, Equaliser or Playlist Editor.  Consequently stop after current track mode cannot be activated.  If you wish Winamp to stop playing after the current track, go to either the Main Window, the Equaliser or the Playlist Editor and press Control+v
@@
@WinampStoppingPointNotInCoreWindow_s
The track indicated by the stop marker has just started playing but you are not in the Main Window, Equaliser or Playlist Editor
@@
@WinampNoTrackSelected
No Track selected
@@
@MsgWinAmpColors_L
The foreground text colour is %1,
The background text colour is %2,
and The play list highlight colour is  %3.
@@
@MsgReviewTimeSet_l
End of track review time set to %1.
@@
@WinampVirtualiseTitle_l
Virtualising Winamp window title
@@
@WinampVirtualiseTitle_s
Virtualising title
@@
@MsgHotKeyHelpEqualizerIntro_l
Use the following hot keys in the WinAmp Equalizer:
To open/close the equalizer, press %KeyFor(ToggleWinampEqualiser).
To enable/disable the equalizer after it is opened, press N.
To toggle equalizer auto-loading, press A.
To open the presets menu, press S.
@@
@MsgEqualizerDecreaseBandsLink
To decrease the equalizer bands, press Q through P.
@@
@MsgEqualizerDecreaseBandsFunc
To decrease the equalizer bands, press Q through P.
@@
@MsgEqualizerIncreaseBandsLink
To increase the equalizer bands, press 1 through 0 on Numeric Row.
@@
@MsgEqualizerIncreaseBandsFunc
To increase the equalizer bands, press 1 through 0 on Numeric Row.
@@
@MsgEqualizerDecreasePreAmpLink
To decrease the equalizer PreAmp, press TAB.
@@
@MsgEqualizerDecreasePreAmpFunc
To decrease the equalizer PreAmp, press TAB.
@@
@MsgEqualizerIncreasePreAmpLink
To increase the equalizer  PreAmp, press GRAVE ACCENT.
@@
@MsgEqualizerIncreasePreAmpFunc
To increase the equalizer  PreAmp, press GRAVE ACCENT.
@@
@MsgHotKeyHelpWinAmpMainWindow_L
Use the following hot keys in the WinAmp main window:
To toggle the status of the WinAmpmain window,  press %KeyFor(ToggleWinampMainWindow).
To open/close the equalizer, press %KeyFor(ToggleWinampEqualiser).
To open/close the library, press %KeyFor (ToggleWinampLibrary ).
To open/close the play list editor, press %KeyFor(ToggleWinampPlaylistEditor).
To open/close the video window, press %KeyFor (ToggleWinampVideo ).
To disable the mini browser, press %KeyFor(CloseMinibrowser).
To move between open windows within Winamp, press %KeyFor(NextDocumentWindow).
To jump to the relative time, press %KeyFor(JumpToRelativeTime).
To repeat the move to the last relative time, press %KeyFor(RepeatLastJumpToRelativeTime).
To speak the status of the shuffle and repeat modes, press %KeyFor(RepeatStatusInfo).
To speak the statuses of all WinAmp windows, press %KeyFor(SayWindowStatuses).
Time marker commands:
To set a time marker, press M.
To jump to a specific time marker, press %KeyFor(JumpToTimeMarker).
To remove a time marker, press %KeyFor(RemoveTimeMarker).
To import/export time markers, press %KeyFor(ImportExportTimeMarkers).
Current Track commands:
To toggle the time display, press %KeyFor(ToggleTimeDisplayMode).
To speak the length of the current track, press %KeyFor(SayTimeLength).
To speak the elapsed time, press %KeyFor(SayElapsedTime).
To speak the time remaining, press %KeyFor(SayRemainingTime).
To review the end of the current track, press %KeyFor(ReviewEndOfTrack).
To select the review time, press %KeyFor(SelectReviewTime).
To speak the current track title, press %KeyFor(SayCurrentTrackTitle).
To show current track info in the virtual viewer, press %KeyFor(ShowCurrentTrackInfo).
@@
@MsgWindowsHelp1_l
The following keystrokes are available in WinAmp:
Playback commands:
To play/Restart, press X,
To pause/Resume the current track, press C,
To rewind by  5 seconds, press LEFT ARROW,
To fast forward by 5 seconds, press RIGHT ARROW,
To stop the current track, press V,
To stop the current track with Fade-out, press SHIFT+V,
To stop after the current track, press CTRL+V,
To play the next Track, press B,
To play the previous Track, press Z,
To move to the first track in the list, press CTRL+Z,
To move to the last track in the list, press CTRL+B,
To move Ten Songs Back, turn on NUMLOCK and press NUMPAD 1,
To move Ten Songs Forward, turn on NUMLOCK and pres NUMPAD 3,
To move to a time in the current track, press CTRL+J,
To move to a file, press J,

To increase the volume, press UP ARROW,
To decrease the volume, press DOWN ARROW,
To set the volume to 0%, press ALT+CTRL+M,
To set the volume to 33%, press ALT+CTRL+COMMA,
To set the volume to  66%, press ALT+CTRL+PERIOD,
To set the volume to 100%, press ALT+CTRL+SLASH,

To pan 100% left, press ALT+CTRL+H,
To pan 50% left, press ALT+CTRL+J,
To center sound, press ALT+CTRL+K,
To pan 50% right, press ALT+CTRL+L,
To pan 100% right, press ALT+CTRL+SEMI COLON,

To toggle Repeat mode, press R,
To toggle Shuffle mode, press S,

Play commands:
To open and play a File, press L,
To open and play a location, press CTRL+L,
To open and play a directory, press SHIFT+L,

Bookmark commands:
To add a bookmark, press ALT+I,
To edit bookmarks (Go to Bookmark preferences), press ALT+CTRL+i,

Visualization commands:
To go to built-in visualization options, press ALT+O,
To configure the current visualization plug-in, press ALT+K,
To start/stop the current visualization plug-in, press CTRL+SHIFT+K,
To open the Visualization page of the Preferences dialog, press CTRL+K,

Other commands:
View/Edit Track Info, Alt+3

To open WinAmp help, press F1,
To open the skin selection dialogue, press ALT+S,
To open to Main Menu, press ALT+F,
To go to WinAmp preferences, press CTRL+P,

To toggle Always-On-Top (all but Playlist Editor), press CTRL+A,
To toggle the Windowshade mode, press CTRL+W,
To toggle Double size Mode, press  CTRL+D,
To toggle Easy move, press CTRL+E,
To start a new instance of WinAmp, press ALT+CTRL+N,
@@
@MsgWindowsHelpPlayListEditor
The following keystrokes may be useful in the play list editor:
To open an existing play list, press CTRL+O,
To clear the currently loaded play list and load a New empty playlist, press CTRL+N,
To save the play list, press CTRL+S,

To add aFile to the play list, press L,
To add aLocation to the play list, CTRL+L,
To add a directory to the play list, press SHIFT+L,

To remove a File from the play list, press DELETE,
To crop the play list,  press CTRL+DELETE,
To Clear the play list, press CTRL+SHIFT+DELETE,
To remove any non-existent tracks, press ALT+DELETE,

To invert the Selection, press CTRL+I,
To move the selection to the current track, press ALT+CTRL+DOWN ARROW,
To move the selected track down, press ALT+DOWN ARROW,
To move the selected track up, press ALT+UP ARROW,
To edit the track file name, press CTRL+E,

To set stop marker on current track, press CTRL+SHIFT+V,
To announce location of stop marker(any window), press ALT+CTRL+V,
To clear stop marker(any window), press ALT+CTRL+SHIFT+V,
To announce status of stop after current track Mode (any window), press ALT+CTRL+S,
To resume playing after stop marker (any window), press F12,

To play the selected track, press ENTER,

To sort by title, press CTRL+SHIFT+1,
To sort by file name, press CTRL+SHIFT+2,
To sort by file path and name, press CTRL+SHIFT+3,
To reverse the play list, press CTRL+R,
To randomize the play list, press CTRL+SHIFT+R,

To create an HTML page from the play list, press  ALT+CTRL+G,
To toggle Always-On-Top (Playlist Editor), press ALT+CTRL+A
	@@
	@MsgScreenSensitiveHelpWinAmpMainWindow_L
	This is the WinAmp main window.
	@@
	@MsgScreenSensitiveHelpEqualizer_L
	This is the WinAmp equalizer.
	Use this window to tailor the way in which your music is played. You can manually adjust any of the 10 equalizer bands or choose from a variety of preset equalizer settings.
	@@
	@MsgScreenSensitiveHelpLibrary_L
	This is the library window.
	Use this window to manage local media, stream a variety of sources, catch pod casts and more.
	@@
	@MsgScreenSensitiveHelpPlayListEditor_L
	This is the play list editor window.
	Use this window to create, manage or remove play lists.
	@@
	@MsgScreenSensitiveHelpStationInfo_L
	This is the station information window.
	This window displays information for the currently streamed station or other media.
	@@
	@MsgScreenSensitiveHelpVideoWindow_L
	This is the WinAmp video window.
	WinAmp uses this window to play varius types of video files and streams.
	@@


;UNUSED_VARIABLES

@MsgCurrentTrack_L
Track %1 %2
@@
@Help3
To get a listing of shortcut keys that are available in all winamp windows, press JAWSKey+w or Insert+w
@@
@help4
To open the %product% Winamp help topic, Press JAWSKey+F1 or Insert+F1 twice quickly
@@
@SelectHelp
Use the up and down arrow keys to select the desired help and then press enter
@@
@WinampVolumeUp_S
Increase
@@
@WinampVolumeDown_S
Decrease
@@
@WinampToSkipTo
to skip to
@@
@WinampToRemove
to remove
@@
@WinampTheTrackLengthIs
The track length is
@@
@WinampHaveElapsed
have elapsed
@@
@WinampThereIs
There is
@@
@MsgWinAmpFunctionNotAvailable2_l
this function is only available inside the Winamp Main Window, Equaliser, Playlist Editor and the Minibrowser
@@
@MsgElapsedTime
elapsed time
@@
@MsgRemainingTime
remaining time
@@
@WinampObjectError
An error has occurred while trying to access the Winamp4JFW Bridge.  Subsequent Winamp commands will continue to operate as per normal, but JFW may not be able to give you spoken feedback on the results of those commands for which JFW requires the Winamp4JFW Bridge.
@@
@WinampEqualiserStatus
Equaliser Status
@@
@WinampNonDllMethod
Using the non Dll method
@@
@WinampTheScriptWasTriggeredBy
The script was triggered by
@@
@WinampWinampTrackInfo
Winamp Track Information
@@
@WinampBitRate
Bit rate
@@
@WinampNumberOfChannels
Number of channels
@@
@WinampKHz
kHz
@@
@WinampKBPS
kilobits per second
@@
@WinampTrackLength
Track length
@@
@WinampPercent
percent
@@
@WinampFrom
from
@@
@WinampTo
to
@@
@WinampActOn
Activated
@@
@WinampActOff
Not Activated
@@
@WinampCleared
cleared
@@
@WinampStoppingPointIs
stop marker is
@@
@WinampStoppingPointSetTo
Stop marker set to track
@@
@MsgNoStoppingPointSet_l
No stop marker is set
@@
@MsgNoStoppingPointSet_s
not set
@@
@WinampForegroundTextColour
The foreground text colour is
@@
@WinampBackgroundTextColour
The background text colour is
@@
@WinampPlaylistHighlightColour
The Playlist highlight colour is
@@
@WinampWinampScriptsVerInfo
Winamp Scripts Version Information
@@
@WinampWinampScriptsInfo
Winamp Scripts Information
@@
@WinampVersion
Version
@@
@WinampAuthors
Authors
@@
@WinampOtherContributionsBy
Other contributions by
@@
@WinampLastUpdated
Last updated
@@
@WinampWinampAppInfo
Winamp Application Information
@@
@WinampAppExec
Application executable
@@
@WinampAppDir
Application directory
@@
@WinampAppVer
Application version
@@
@WinampActiveXInfo
Winamp Scripts ActiveX Component Information
@@
@WinampCompFileName
Component file name
@@
@WinampCompClass
Component class
@@
@WinampCompInstalled
Component installed
@@
@WinampYes
Yes
@@
@WinampNo
No
@@
@WinampCompName
Component name
@@
@WinampCompVer
Component version
@@
@WinampCompStatus
Component status
@@
@WinampAvailable
Available
@@
@WinampNotAvailable
Not available
@@
@WinampFeatureNotAvailable
This feature of the Winamp Scripts is not available in the version of %product% that is currently running
@@
@WinampVirtualizeTitleEscapeMessage
Press Escape to return to Winamp.
@@
@MsgHotKeyHelpEqualizerPreSets_L
To load a preset, press CTRL+S.
@@
@MsgHotKeyWinampPlayListEditor_L
Use the following hot keys in the WinAmp play list editor:
%KeyFor(SwapTrackWithPrevious)
%KeyFor(SwapTrackWithNext)
 @@
@MSG_PreviousTrack_L
Previous track
@@
@MSG_PreviousTrack_S
Previous
@@
@MSG_NextTrack_L
Next track
@@
@MSG_NextTrack_S
Next
@@
@MSG_StopTrack_L
Stop track
@@
@MSG_StopTrack_S
Stop
@@
@MSG_PlayTrack_L
Play track
@@
@MSG_PlayTrack_S
Play
@@
@MSG_PauseTrack_L
Pause track
@@
@MSG_PauseTrack_S
Pause
@@

;END_OF_UNUSED_VARIABLES

EndMessages


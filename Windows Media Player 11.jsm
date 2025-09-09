; JAWS Message Header file for Windows Media Player 11
; Copyright 2009-2015 by Freedom Scientific, Inc.

const
;Application keystroke:
	ks_Mute = "f7",
	ks_VolumeDown = "f8",
	ks_VolumeUp = "f9",
; Object names:
	objn_VideoAndVisualizationDisplayArea = "Video and Visualization display area",
	objn_RewindSeekFFwdGroup = "svRewindSeekFFWD",
	objn_Seek = "Seek",
	objn_MarqueeGroup = "svMarquee",
	objn_TransportsInnerGroup = "svTransportsInner",
	objn_Volume = "Volume",
	objn_CustomButtonsGroup = "svCustomButtons",
	objn_MainGroup = "svMain",
	objn_HideBasketBtn = "HideBasketBtn",
	Objn_StarRatingGroup = "svStarRating",
	objn_LibraryContainerGroup = "LibraryContainer",
	objn_GroupBackgroundSuffix = "_background",
	objn_SettingsGroup = "svSettings",
	objn_CurrentEnhancement = "Current enhancement",
	objn_ToggleControl = "Toggle control",
	objn_CrossFadeSlidersGroup = "svCrossFadeSliders",
	objn_CrossFadeSlider = "Select number of seconds to crossfade items",
	objn_UnnamedPrefix = "Unnamed__",
	objn_Unnamed2 = "Unnamed__2",
	Objn_EqualizerGroup = "svEQView",
	objn_EqualizerSliderGroup = "EqualizerSliderSubview",
	objn_EqualizerSliderNameSuffix = ", Equalizer Slider",
	objn_SpeedSliderGroup = "SpeedSubView",
	objn_QuietMode = "Quiet Mode",
	objn_GraphicEqualizer = "Graphic Equalizer",
	objn_vidHue = "vidHue",
	objn_vidBright = "vidBright",
	objn_vidSat = "vidSat",
	objn_vidContrast = "vidContrast",
	objn_BackHueSlider = "backhueslider_subview",
	objn_BacksatSlider = "backsatslider_subview",
;Window names:
	wn_BasketListView = "BasketListView",
	wn_Properties = "Properties",
	wn_Properties_Location = "Location:",
	wn_Properties_Description = "Description:",
	wn_Options = "Options",
	wn_AboutWindowsMediaPlayer = "About Windows Media Player",
	wn_NewAutoPlaylist = "New Auto Playlist",
;string compares:
	sc_MediaItem_ObjNameDescSeparator = ", ",



;UNUSED_VARIABLES

	objn_NavigationGroup = "svNavigation",
	objn_TasksBtnInternalGroup = "TaskBtnInternalGroup",
	objn_TaskBtnMediaLibraryGroup = "TaskBtnMediaLibraryGroup",
	objn_TaskBtnCDAudioGroup = "TaskBtnCDAudioGroup",
	objn_TaskBtnBurnGroup = "TaskBtnBurnGroup",
	objn_TaskBtnSyncGroup = "TaskBtnSyncGroup",
	objn_TaskBtnServiceTask1Group = "TaskBtnServiceTask1Group",
	objn_Unnamed0 = "Unnamed__0",
	wn_WindowsMediaPlayer_App = "Windows Media Player"

;END_OF_UNUSED_VARIABLES

Messages
;for msgWMPAppName
;%1 is the version number
@msgWMPAppName
Windows Media Player %1
@@
;For hotkey help,
;%1 is the key name for the MoveToMainTree script
;%2 is the key name for the MoveToCurrentPlayList script
@msgHotKeyHelp_S
The following hotkeys are available in Windows Media Player:

In all areas:
Tab and Shift+Tab navigates through the buttons and controls on the screen.

In the Play Control Group:
Play and pause, Control+P.
Stop, Control+S.
Rewind, Control+Shift+B.
Fast forward, Control+Shift+F.
Move to previous, Control+B.
Move to next, Control+F.
Mute sound, F7.
Decrease volume, F8.
Increase volume, F9.
Jump to the Now Playing List, %2.

In the Now Playing list:
Play/pause, Space.
Menu of choices for the current item, Context Menu or Applications key.

In the Library area:
Jump to the Task Center main selection tree, %1.
Jump to the playlist where media can be added, %2.
Set a point from which to drag media from the library tree list, Control+C.
Drop media into the playlist, Control+V.


When burning a CD/DVD:
Start burning, Alt+b.
Stop burning, Alt+s.
Edit Play list, Alt+A.
Sync settings, Alt+C.

When ripping a CD:
Start ripping, Alt+C.
Stop ripping, Alt+S.
Find album information, Alt+A.
View album information, Alt+I.

When synchronizing:
Start and stop sync, Alt+S.
Sync settings, Alt+C.

Press Escape to close this window
@@
@msgHotKeyHelp_L
The following hotkeys are available in Windows Media Player:

In all areas:
Use Tab and Shift+Tab to navigate through the buttons and controls on the screen.

In the Play Control Group:
To play and pause the currently playing media, use Control+P.
To stop the currently playing media, use Control+S.
To rewind the currently playing media, use Control+Shift+B.
To fast forward the currently playing media, use Control+Shift+F.
To move to the previous media, Use Control+B.
To move to the next media, use Control+F.
To mute sound, use F7.
To decrease volume, use F8.
To increase volume, use F9.
To jump to the Now Playing List, use %2.

In the Now Playing list:
To toggle Play/pause, use Space.
To get a menu of choices for the current item in the list, use the Context Menu or Applications key.

In the Library area:
To jump to the Task Center main selection tree, use %1.
To jump to the playlist where media can be added, use %2.
To set a point from which to drag media from the library tree list, use Control+C.
To drop media into the playlist, use Control+V.


When burning a CD/DVD:
To start the burn process, use Alt+b.
To stop the burn process, use Alt+s.
To edit the Play list, use Alt+A.
To set Sync settings, use Alt+C.

When ripping a CD:
To start the ripping process, use Alt+C.
To stop the ripping process, use Alt+S.
To find the album information, use Alt+A.
To view the album information, use Alt+I.

When synchronizing:
To start and stop the sync process, use Alt+S.
To set sync settings, use Alt+C.

Press Escape to close this window
@@
; Error messages
@msgCurrentPlayListNotFound
Current Play List not found
@@
@msgMainTreeNotFound
Task Center Main tree not found
@@
;for msgVolumePercentage
;%1 is the percentage
@msgVolumePercentage
%1 percent
@@
@msgTransportsInnerGroupUserFriendlyName
Play Controls:
@@
@msgStarRatingGroupUserFriendlyName
Star Rating:
@@
@msgLibraryGroupUserFriendlyName
Library:
@@
@msgEqualizerSliderGroupUserFriendlyName
Equalizer Sliders:
@@
@msgBasketListViewUserFriendlyName
Basket
@@
@msgHideBasketBtnUserFriendlyName
Hide List Pane
@@
;for msgNowPlayingMenuButtonName
;%1 is the name of the menu button
@msgNowPlayingMenuButtonName
%1 menu
@@
@msgType_LeftRightSlider
Left Right Slider
@@
@msgType_UpDownSlider
Up Down Slider
@@
@msgWindowsMediaPlayerWebsiteBtnName
Windows Media Player Website
@@
;for msgCrossFadeSliderValue
;%1 is the number of milliseconds
@msgCrossFadeSliderValue
%1 milliseconds
@@
;for msgEqualizerSliderValue
;%1 is the number of db's
@msgEqualizerSliderValue
%1 db
@@
@msgVideoGroupUserFriendlyName
Video:
@@
@msgVidHueUserFriendlyName
Hue
@@
@msgVidBrightUserFriendlyName
Brightness
@@
@msgVidSatUserFriendlyName
Saturation
@@
@msgVidContrastUserFriendlyName
Contrast
@@
@msgCurrentlyPlaying
Currently playing
@@
@msgPreparedToDragFromList_L
Prepared to drag from list
@@
@msgPreparedToDragFromList_S
Prepared to drag
@@
@msgDroppingInList_L
Dropping in list
@@
@msgDroppingInList_S
Dropping
@@
@msgErr_ItemCannotBeDragged
Error: Item cannot be dragged
@@
@msgErr_NothingToDragAndDrop
Nothing to drag and drop
@@
;for msgTutorialHelp_LibraryDragFromList and msgTutorialHelp_LibraryDropInList
;%1 is msgListView from TutorialHelp.jsm
;%2 is the Windows keystroke for copy (for drag) or paste (for drop).
@msgTutorialHelp_LibraryDragFromList
%1
Use %2 to mark a media to be copied or dragged into the play list.
@@
@msgTutorialHelp_LibraryDropInList
%1
Use %2 to drop media which you have previously marked for dragging into this list.
@@
EndMessages

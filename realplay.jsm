; Script message file for RealPlayerG2

const
;Window Names
;Find this window in menu Tools->Preferences->Content->Media Types->Select...
;When translating, replace with the Title of the window after pressing the "Select..." button
	wn_MediaTypes = "Media Types",
	wn_ScanDiskForMedia = "Scan Disk For Media",
	wn_FindFileTypes = "Find file types:",
;string compares
	sc_2 = "#32770",
	sc_3 = "PNGUIClass",
;from the list item name of the Find File Types listbox in the Scan Disk For Media dialog:
	sc_FindFileTypes_ListItemState_PrefixChar = "-",
	sc_FindFileTypes_ListItemState_On = "ON",
	sc_FindFileTypes_ListItemState_Off = "OFF",


;UNUSED_VARIABLES

	sc_1 = "Setup of Realplayer G2"

;END_OF_UNUSED_VARIABLES

Messages
@msgScriptKeyHelp1_L
Real Player
@@
#Region  echo messages
@MSGVolumeUp_L
volume up
@@
@MSGVolumeUp_S
up
@@
@MSGVolumeDown_L
volume down
@@
@MSGVolumeDown_S
down
@@
@MSGRewind_L
rewind
@@
@MSGRewind_S
rewind
@@
@MSGSuperRewind_L
10 times rewind
@@
@MSGSuperRewind_S
10 x rewind
@@
@MSGFastForward_L
fast forward
@@
@MSGFastForward_S
fast forward
@@
@MSGSuperFastForward_L
10 times fast forward
@@
@MSGSuperFastForward_S
10 x fast forward
@@
@msgPreviousClip_L
Previous Clip
@@
@msgPreviousClip_S
Previous
@@
@msgNextClip_L
Next Clip
@@
@msgNextClip_S
Next
@@
@msgNormalMode_L
normal mode
@@
@msgNormalMode_S
normal
@@
@msgToolBarMode_L
Tool bar mode
@@
@msgToolBarMode_S
Tool bar
@@
@msgTheaterMode_L
Theater mode
@@
@msgTheaterMode_S
Theater
@@
@msgOriginalSize_L
Original Size
@@
@msgOriginalSize_S
Original
@@
@msgDoubleSize_L
Double Size
@@
@msgDoubleSize_S
Double
@@
@msgFullScreenTheaterMode_L
Full Screen Theater Mode
@@
@msgFullScreenTheaterMode_S
Full Screen
@@
@msgGoToBurnOrTransferPage_L
Go To Burn Or Transfer Page
@@
@msgGoToBurnOrTransferPage_S
Burn Or Transfer
@@
@msgGoToSearchPage_L
Go To Search Page
@@
@msgGoToSearchPage_S
Search
@@
@msgGoToRealGuidePage_L
Go To Real Guide Page
@@
@msgGoToRealGuidePage_S
Real Guide
@@
@msgGoToMyLibraryPage_L
Go To My Library Page
@@
@msgGoToMyLibraryPage_S
My Library
@@
@msgGoToCDOrDVDPage_L
Go To CD Or DVD Page
@@
@msgGoToCDOrDVDPage_S
CD Or DVD
@@
@msgSendEMail_L
Send EMail
@@
@msgSendEMail_S
EMail
@@
@msgOpenOrHideBrowser_L
Open Or Hide Browser
@@
@msgOpenOrHideBrowser_S
Open Or Hide Browser
@@
@msgAttachOrDetachBrowser_L
Attach Or Detach Browser
@@
@msgAttachOrDetachBrowser_S
Attach Or Detach Browser
@@
@msgToggleNowPlaying_L
Toggle Now Playing
@@
@msgToggleNowPlaying_S
ToggleNowPlaying
@@
@msgMessageCenter_L
Message Center
@@
@msgMessageCenter_S
Message Center
@@
@msgCompactView_L
compact view
@@
@msgCompactView_S
compact
@@
#EndRegion

#Region Help messages
@msgHotKeyHelp1_L
List Toolbar buttons = %keyFor(ToolBar)
List other graphical buttons = %keyFor(GraphicsList)
Play/Pause = Control + P
Stop = Control + S
Previous Clip = %KeyFor(PreviousClip)
Next Clip = %KeyFor(NextClip)
Rewind = %KeyFor(rewind)
Super Rewind =%KeyFor(SuperRewind)
Fast Forward = %KeyFor(FastForward)
Super Fast Forward =%KeyFor(SuperFastForward)

Volume up  =  %KeyFor(VolumeUp)
Volume down =  %KeyFor(VolumeDown)

Open Location  =Control + L
Open Local File = Control + O

Normal mode =  %KeyFor(NormalMode)
Tool Bar Mode =  %KeyFor(ToolBarMode)
Theater Mode =  %KeyFor(TheaterMode)

Original Size =  %KeyFor(OriginalSize)
Double Size =  %KeyFor(DoubleSize)
Full Screen Theater Mode =  %KeyFor(FullScreenTheaterMode)

Go To Burn Or Transfer Page =  %KeyFor(GoToBurnOrTransferPage)
Go To Search Page =  %KeyFor(GoToSearchPage)
Go To Real Guide Page =  %KeyFor(GoToRealGuidePage)
Go To My Library Page =  %KeyFor(GoToMyLibraryPage)
Go To CD Or DVD Page =  %KeyFor(GoToCDOrDVDPage)


Send EMail = %KeyFor(SendEMail)
Message Center = %KeyFor(MessageCenter)

Toggle Now Playing = %KeyFor(ToggleNowPlaying)
Open Or Hide Browser = %KeyFor(OpenOrHideBrowser)
Attach Or Detach Browser = %KeyFor(AttachOrDetachBrowser)

Mute Synthesizer =  %KeyFor(MuteSynthesizer)

Save Current Place (PlayerPlus only) = Control + Shift + A
Record (PlayerPlus only) = Control + R
Help Contents = F1
@@
; Hotkey Help Virtual
@msgHotKeyHelp1_S
List Toolbar buttons = %keyFor(ToolBar)
List other graphical buttons = %keyFor(GraphicsList)
Play/Pause = Control + P
Stop = Control + S
Previous Clip = %KeyFor(PreviousClip)
Next Clip = %KeyFor(NextClip)
Rewind = %KeyFor(rewind)
Super Rewind =%KeyFor(SuperRewind)
Fast Forward = %KeyFor(FastForward)
Super Fast Forward =%KeyFor(SuperFastForward)

Volume up  =  %KeyFor(VolumeUp)
Volume down =  %KeyFor(VolumeDown)

Open Location  =Control + L
Open Local File = Control + O

Normal mode =  %KeyFor(NormalMode)
Tool Bar Mode =  %KeyFor(ToolBarMode)
Theater Mode =  %KeyFor(TheaterMode)

Original Size =  %KeyFor(OriginalSize)
Double Size =  %KeyFor(DoubleSize)
Full Screen Theater Mode =  %KeyFor(FullScreenTheaterMode)

Go To Burn Or Transfer Page =  %KeyFor(GoToBurnOrTransferPage)
Go To Search Page =  %KeyFor(GoToSearchPage)
Go To Real Guide Page =  %KeyFor(GoToRealGuidePage)
Go To My Library Page =  %KeyFor(GoToMyLibraryPage)
Go To CD Or DVD Page =  %KeyFor(GoToCDOrDVDPage)

Send EMail =  %KeyFor(SendEMail)
Message Center = %KeyFor(MessageCenter)

Toggle Now Playing = %KeyFor(ToggleNowPlaying)
Open Or Hide Browser = %KeyFor(OpenOrHideBrowser)
Attach Or Detach Browser = %KeyFor(AttachOrDetachBrowser)

Mute Synthesizer =  %KeyFor(MuteSynthesizer)

Save Current Place (PlayerPlus only) = Control + Shift + A
Record (PlayerPlus only) = Control + R
Help Contents = F1
@@
@msgHKVirtualHelp1_L
List Links=%KeyFor(SelectALink).
List Frames=%KeyFor(SelectAFrame).
Move forward in the page past links to a body of text=%KeyFor(MoveToNextNonLinkText).
Update the screen view to the location of the Virtual Cursor=%KeyFor(RefreshScreen).
Jump to the first control on a form=%KeyFor(FocusToFirstField).
Jump to the next control on a form=%KeyFor(FocusToNextField).
Jump to the previous control on a form=%KeyFor(FocusToPriorField).
Jump to the last control on a form=%KeyFor(FocusToLastField).
Toggle Virtual Cursor mode on or off=%KeyFor(VirtualPcCursorToggle).
When you land on a control, and wish to turn on forms mode to input information, press  %KeyFor(Enter).
To turn Virtual Cursor back on, press %KeyFor(PcCursor).
@@
@msgHKVirtualHelp1_S

List Links=%KeyFor(SelectALink).
List Frames=%KeyFor(SelectAFrame).
Skip past links to text=%KeyFor(MoveToNextNonLinkText).
Update screen to location of Virtual Cursor=%KeyFor(RefreshScreen).
Jump to first form control=%KeyFor(FocusToFirstField).
Jump to next form control=%KeyFor(FocusToNextField).
Jump to previous form control=%KeyFor(FocusToPriorField).
Jump to last form control=%KeyFor(FocusToLastField).
Toggle Virtual Cursor mode=%KeyFor(VirtualPcCursorToggle).
Turn on Forms Mode=%KeyFor(Enter).
Turn Forms Mode Off=%keyFor(pcCursor)
@@
@msgWKeysHelp1_L
Play/Pause = Control + P
Stop = Control + S
Previous Clip = %KeyFor(PreviousClip)
Next Clip = %KeyFor(NextClip)
Rewind = %KeyFor(rewind)
Super Rewind =%KeyFor(SuperRewind)
Fast Forward = %KeyFor(FastForward)
Super Fast Forward =%KeyFor(SuperFastForward)

Volume up  =  %KeyFor(VolumeUp)
Volume down =  %KeyFor(VolumeDown)

Open Location  =Control + L
Open Local File = Control + O

Normal mode =  %KeyFor(NormalMode)
Tool Bar Mode =  %KeyFor(ToolBarMode)
Theater Mode =  %KeyFor(TheaterMode)

Original Size =  %KeyFor(OriginalSize)
Double Size =  %KeyFor(DoubleSize)
Full Screen Theater Mode =  %KeyFor(FullScreenTheaterMode)

Go To Burn Or Transfer Page =  %KeyFor(GoToBurnOrTransferPage)
Go To Search Page =  %KeyFor(GoToSearchPage)
Go To Real Guide Page =  %KeyFor(GoToRealGuidePage)
Go To My Library Page =  %KeyFor(GoToMyLibraryPage)
Go To CD Or DVD Page =  %KeyFor(GoToCDOrDVDPage)


Send EMail =  %KeyFor(SendEMail)
Message Center = %KeyFor(MessageCenter)

Toggle Now Playing = %KeyFor(ToggleNowPlaying)
Open Or Hide Browser = %KeyFor(OpenOrHideBrowser)
Attach Or Detach Browser = %KeyFor(AttachOrDetachBrowser)

Mute Synthesizer =  %KeyFor(MuteSynthesizer)

Save Current Place (PlayerPlus only) = Control + Shift + A
Record (PlayerPlus only) = Control + R
Help Contents = F1
@@
@msgWKeysHelp1_S
Play/Pause = Control + P
Stop = Control + S
Previous Clip = %KeyFor(PreviousClip)
Next Clip = %KeyFor(NextClip)
Rewind = %KeyFor(rewind)
Super Rewind =%KeyFor(SuperRewind)
Fast Forward = %KeyFor(FastForward)
Super Fast Forward =%KeyFor(SuperFastForward)

Volume up  =  %KeyFor(VolumeUp)
Volume down =  %KeyFor(VolumeDown)

Open Location  =Control + L
Open Local File = Control + O

Normal mode =  %KeyFor(NormalMode)
Tool Bar Mode =  %KeyFor(ToolBarMode)
Theater Mode =  %KeyFor(TheaterMode)

Original Size =  %KeyFor(OriginalSize)
Double Size =  %KeyFor(DoubleSize)
Full Screen Theater Mode =  %KeyFor(FullScreenTheaterMode)

Go To Burn Or Transfer Page =  %KeyFor(GoToBurnOrTransferPage)
Go To Search Page =  %KeyFor(GoToSearchPage)
Go To Real Guide Page =  %KeyFor(GoToRealGuidePage)
Go To My Library Page =  %KeyFor(GoToMyLibraryPage)
Go To CD Or DVD Page =  %KeyFor(GoToCDOrDVDPage)

Send EMail =  %KeyFor(SendEMail)
Message Center = %KeyFor(MessageCenter)

Toggle Now Playing = %KeyFor(ToggleNowPlaying)
Open Or Hide Browser = %KeyFor(OpenOrHideBrowser)
Attach Or Detach Browser = %KeyFor(AttachOrDetachBrowser)

Mute Synthesizer =  %KeyFor(MuteSynthesizer)

Save Current Place (PlayerPlus only) = Control + Shift + A
Record (PlayerPlus only) = Control + R
Help Contents = F1
@@
@msgScreenSensitiveHelp1_L
This is the main application window for RealPlayer. Press %KeyFor(HotKeyHelp) to hear a list of available hot keys.
@@
@msgScreenSensitiveHelp1_S
Main RealPlayer application window . Press %KeyFor(HotKeyHelp) to hear a list of available hot keys.
@@
@msgScreenSensitiveHelp2_L
This is the scan presets dialog. If no items appear in the list, press enter on the greater button.
@@
@msgScreenSensitiveHelp2_S
Scan presets dialog. If no items appear in the list, press enter on the greater button.
@@


;UNUSED_VARIABLES

@msg1_L
For a list of %product% hot keys, press %KeyFor(HotKeyHelp).
@@
@msg1_S
For %product% hot keys, press %KeyFor(HotKeyHelp).
@@

;END_OF_UNUSED_VARIABLES

EndMessages
; Copyright 1995-2015 Freedom Scientific, Inc. 
;JAWS script header file for Winam


Const
FILE_EXT_TIME_MARKER = ".tms",
;configuration names for SwitchToConfiguration
Config_WinAmpLibrary = "winamp library",
Config_WinAmp = "winamp",
; Constants for identifying different versions of JFW
cJFWVer37 = 370000, ; JFW 3.7
cJFWVer40 = 400000, ; JFW 4.0
cJFWVer45 = 450000, ; JFW 4.5
cJFWVer451 = 451000, ; JFW 4.51
cJFWVer50 = 500000, ; JFW 5.0
cJFWVer510 = 510000, ; JFW 5.10
cJFWVer60 = 600000, ; JFW 6.0
; Some character constants for internal use
cscVert = "|",
cscBackSlash = "\\",
cscDollar = "$",
cscComma = ",",
cscLsb = "[",
cscRsb = "]",
cscPlus = "+",
cscMinus = "-",
cscOldDash = " - ",
cscB = "b",
cscL = "l",
cscP = "p",
cscQ = "q",
cscS = "s",
cscU = "u",
cscV = "V",
cscW = "w",
; We use the msgSilent constant from default.jsm since the cmsgSilent constant in common.jsm doesn't work correctly.
msgSilent = "\n",
; Used in lists to separate the item name from its value
csLvs = ":  ",
; Some constants for use with GetVersionInfoString
csProductName = "ProductName", ; same is cMSG282_L in common.jsm
csProductVersion = "ProductVersion", ; same is cMSG283_L in common.jsm
; Used with GetChunk to tell if a menu item is checked or not
csChecked = "checked", ; same is cMSG293_L in common.jsm
; Winamp window classes
WinampWindowClassPrefix = "Winamp",
WinampMW = "Winamp v1.x",
WinampMb = "Winamp MB",
WinampEQ = "Winamp EQ",
WinAmpGen = "Winamp Gen",
WinampPE = "Winamp PE",
WinampLI = "Winamp Gen",
WinampVi = "Winamp Video",
BaseWindowRoot = "BaseWindow_RootWnd",
; The following is a pseudo window class used internally by SayWindowStatuses; Winamp makes use of no such class.
WinampIU = "IsUnknown",
; Winamp window titles
WinampPreferences = "Winamp Preferences",
; Loop trap constant for Winamp window traversing functions and scripts
LoopTrap = 100, 
; Loop trap constant for Playlist-traversing functions
PlaylistSearchRange = 50, 
; colour constants
; Default highlight colour in the Playlist Editor
WinampDefaultHighlightColour = 0x00c60000, ; for JFW V3.x
WinampDefaultHighlightColourForJFW4 = 0x00c00000, ; for JFW V4.x and later
; Play highlight colour
WinampMaxHighlightColour = 0xff,
WinampPlayHighlightColour = 0x00ffffff,
WinampMinHighlightColour = 0xC0, ;0x80,
RGBBlueFieldOffset = 0x10000,
; Constants for ReviewEndOfTrack
ReviewIncrement = 5, 
MaxReviewOffset = 25, ; maximum review offset (in seconds)
; Time marker constants
TimeMarkerFile = "winamp.tmf", 
TimeMarkerCountPrefix = "n", ; .ini key for time marker count
TimeMarkerPrefix = "t", ; .ini key prefix for time marker time offsets
TimeMarkerNamePrefix = "m", ; .ini key prefix for time marker names
LSBReplacement = "(`", ; Replacement for [ in track names
RSBReplacement = "')", ; Replacement for ] in track names
TimeMarkerSetFileName = "winamp", ; name of time marker set file to use in versions of JAWS that lack the InputBox function
TrackListSection = "List of Tracks", ; .ini section for holding the list of tracks in time marker set files
TrackCountPrefix = "n", ; .ini key for track count
TrackNamePrefix = "t", ; .ini key prefix for track names
SettingsSection = "Settings",
DefaultRelativeTimeKey = "DefaultRelativeTime",
; Miscellaneous internal constants
WinampWinamp = "Winamp",
; Constants for the Winamp for JFW Interface System ActiveX Component by Andrew Hart
ComponentFileName = "wa4jfw.dll", ; file name
ComponentClassName = "Winamp4JFW.Bridge", ; class name used by CreateObject
ComponentClassName1 = "Winamp4JFW.Bridge.1" ; class name used by CreateObject

; Global Variables
Globals
	int giWinAmpSwitchConfiguration,
	Int WinampHighlightColour, ; The current colour being used to identify the highlighted track in the Playlist
	Int WinampAlternativeHighlightColour, ; The first alternative colour to try if no highlighted track can be found in the Playlist
	Int winampCurrentItem, ; The number of the currently playing  track
	Int WinampStopItem, ; The number of the track to stop after
	Int WinampStoppingPointSchedule, ; Handle used to unschedule CheckStoppingPoint when a stopping point is reached
	Int WinampMagneticTracking, ; Status of magnetic tracking
	Int WinampStopped, ; Indicates the status of stop-after-current-track mode
	Int FirstWinampObjectError, ; Indicates if an error to access the Winamp for JFW Interface System is the first since the last successful access
	Int ScheduledHelp, 
	Handle WinampAppWindowHandle, 
	Int WinampReviewTime, ; Amount of time played at the end of a track by the end-of-track review feature
	Int WinampScriptsDebugMode, ; Status of the Winamp scripts debugging mode
	handle GlobalWinAmpPrevTopLevelWindow

; Constant declarations for the WinampAPI script set
; This file is basically a conversion of a modified version of frontend.h from the Winamp SDK to the JAWS Scripting Language.
; It excludes the explanatory comments contained in the original frontend.h file.

Const
	DefaultWinampAppWindowClass = "Winamp v1.x",
	WindowSearchLoopTrap = 100, ; iteration limit to prevent infinite looping while searching for a non-existing window
	FAILURE = 0xFFFFFFFF, ; value returned when any of the WinampAPI functions fail
	WM_WA_IPC = 0x400, ; this is the same as the Win32 WM_USER constant
WM_COMMAND = 0x0111,
	IPC_GETVERSION = 0,
	IPC_DELETE = 101,
	IPC_STARTPLAY = 102,
	IPC_ISPLAYING = 104,
	IPC_GETOUTPUTTIME = 105,
	IPC_JUMPTOTIME = 106,
	IPC_WRITEPLAYLIST = 120,
	IPC_SETPLAYLISTPOS = 121,
	IPC_SETVOLUME = 122,
	IPC_SETPANNING = 123,
	IPC_GETLISTLENGTH = 124,
	IPC_SETSKIN = 200,
	IPC_GETSKIN = 201,
	IPC_EXECPLUG = 202,
	IPC_GETPLAYLISTFILE = 211,
	IPC_GETPLAYLISTTITLE = 212,
	IPC_GETLISTPOS = 125,
	IPC_GETINFO = 126,
	IPC_GETEQDATA = 127,
	IPC_SETEQDATA = 128,
	IPC_ADDBOOKMARK = 129,
	IPC_RESTARTWINAMP = 135,
	IPC_MBOPEN = 241,
	IPC_INETAVAILABLE = 242,
	IPC_UPDTITLE = 243,
	IPC_CHANGECURRENTFILE = 245,
	IPC_GETMBURL = 246,
	IPC_REFRESHPLCACHE = 247,
	IPC_MBBLOCK = 248,
IPC_MBOPENREAL = 249,
	IPC_GET_SHUFFLE = 250,
	IPC_GET_REPEAT = 251,
	IPC_SET_SHUFFLE = 252,
	IPC_SET_REPEAT = 253,

; WM_COPYDATA commands
	IPC_PLAYFILE = 100,
	IPC_CHDIR = 103,

; Miscellaneous commands sendable using WM_COMMAND
	WINAMP_OPTIONS_EQ = 40036, ; toggles the EQ window
	WINAMP_OPTIONS_PLEDIT = 40040, ; toggles the playlist window
	WINAMP_VOLUMEUP = 40058, ; turns the volume up a little
	WINAMP_VOLUMEDOWN = 40059, ; turns the volume down a little
	WINAMP_FFWD5S = 40060, ; fast forwards 5 seconds
	WINAMP_REW5S = 40061, ; rewinds 5 seconds

; Winamp controls
	WINAMP_BUTTON1 = 40044,
	WINAMP_BUTTON2 = 40045,
	WINAMP_BUTTON3 = 40046,
	WINAMP_BUTTON4 = 40047,
	WINAMP_BUTTON5 = 40048,
	WINAMP_BUTTON1_SHIFT = 40144,
	WINAMP_BUTTON2_SHIFT = 40145,
	WINAMP_BUTTON3_SHIFT = 40146,
	WINAMP_BUTTON4_SHIFT = 40147,
	WINAMP_BUTTON5_SHIFT = 40148,
	WINAMP_BUTTON1_CTRL = 40154,
	WINAMP_BUTTON2_CTRL = 40155,
	WINAMP_BUTTON3_CTRL = 40156,
	WINAMP_BUTTON4_CTRL = 40157,
	WINAMP_BUTTON5_CTRL = 40158,

; Following added by AGH (14/7/2002), as they weren't in the frontend.h on www.winamp.com.
	WINAMP_FILE_PLAY = 40029, ; pops up the load file(s) box
	WINAMP_OPTIONS_PREFS = 40012, ; pops up the preferences
	WINAMP_OPTIONS_AOT = 40019, ; toggles always on top
	WINAMP_HELP_ABOUT = 40041, ; pops up the about box :)

	WINAMP_SETTIMEDISPLAYMODEELAPSED = 40037, ; set time display mode to elapsed
	WINAMP_SETTIMEDISPLAYMODEREMAINING = 40037, ; set time display mode to remaining
	WINAMP_TOGGLEREPEAT = 40022, ; Toggle repeat
	WINAMP_TOGGLESHUFFLE = 40023 ; Toggle shuffle
	
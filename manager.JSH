; Version 4.51

globals
	int WasButtonPressed,
	int PlayList,
	int AudioManagerFirstTime,
Int GlobalDoSayAll, ;added by kag
Handle GlobalPrevWindow, ;added by kag
Int ManagerVersion, ;added by kag
String wcDevicePane ;added by kag

const

	; Window Class Constant Definitions
	wcAudio = "AudiblePlayerControlClass",
	wcPlayList = "AudiblePlaylistClass",
	wcListView = "SysListView32",
wcIEServer = "Internet Explorer_Server", ;added by kag
wcDetailView = "AFX:400000:8:14a6:0:0",
wcDevicePane1 = "ATL:103DE868",
wcDevicePane2 = "AudibleManager DeviceView",
wcDevicePane3 = "ATL:101333B0",
wcMenuControlClass = "Menu Control Class",
wcMSOCommandBar = "MsoCommandBar",

	; Control iD Constants
	iDStatusBar = 59393,
	iDList = 10,
	iDPlayList = 100,
	iDOtisList = 101, ;added by kag
	iDStorageCard = 1004,
	iDMainMemory = 1005,
	iDStartHours = 1123,
	iDStartMinutes = 1124,
	iDEndHours = 1125,
	iDEndMinutes = 1126,
 iDPauseResume=34200,

;color constants, added by kag
MenuBarBackgroundHighlight = 16777215,

;windown names, added by kag
wnDetailView = "Detail View"

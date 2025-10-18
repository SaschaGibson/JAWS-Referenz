; JAWS 7.x header file for Windows Media Player
; Copyright 2010-2015 by Freedom Scientific Inc.
;02/21/06 dbrown

Globals
	int giFirstTimeFocus,
	int giAnnounceHeaders,
	int WMPProgramVersion,
	int giFocusHasChanged,
 int giObjSubType,
 int giPrevObjSubType,
 int giSubType,
 int giState,
	int GlobalCurrentControl,
	int GlobalPrevControl,
	handle GlobalAppWindow,
	handle GlobalRealWindow,
	string GlobalRealWindowName,
 string GlobalRealWindowClass,
 string GlobalWindowClass,
	string GlobalObjectName,
 string WMPProgramName,
 string gsObjName,
	string gsPrevGroupName,
	string gsBrlObjName,
	string gsBrlObjValue,
	string gsBrlObjState,
	string gsTmp


const
; Control IDs...
	ciToolBar1004=1004,
	ciToolBar1005=1005,
	ciToolBar1008=1008,
	ciTreeView1007=1007,
	ciColumnHeader1031=1031,
	ciStaticPrompt=203,
	ciCurrentPlayList=1,
; Window classes
	wc_LibraryClass="ATL:0754F282",
	wc_cWmpControlCntr="CWmpControlCntr",
	wc_AtlSysListView32="ATL:SysListView32",
	wc_WMPAppHost="WMPAPPHost",
	wc_WmpPlayList="WMPPlaylist",
	wc_WmpSkimHost="WMP Skim Host",
; Script names for ScreenSensativeHelp msgs.
; End script names
	scProductName="ProductName", ; Do not translate.
	scCarriageReturn="\r",
; Following constants are used by GetFormattedTime Function
	cIFullTimeLength = 8,
	cIPartialTimeLength = 5,
	cIHourTimeLength = 2,
	cIMinuteTimeReachLength = 3,
	cISecondTimeLength = 2

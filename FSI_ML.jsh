; Copyright 1995-2015 Freedom Scientific, Inc.
; Header file for for FSI_ML.jss

GLOBALS
;For Shut Down
	int GIDeadWheel,
;For the wheels when they are not separately programmable
	int GIWhizSetting,
;For individual programmability
	int GILeftSetting,
	int GIRightSetting,
; For sentence and paragraph navigation
	int GIIsSpecialMove,
	int GILeftIsSpecialMove,
	int GIRightIsSpecialMove,
;Store whether or not Programmable (wheel-specific) is on
	int GIProgrammable,
;Store the type of window,
;For the List Mode for Focus displays
	int GIListTypeCode,
	int GIListMode,
;Fo6 View Screen, or Track Focus mode
	int giXYMode,
	int gILeftWheelSpeechMode,
	int gIRightWheelSpeechMode

CONST
	Down = 0,
	Up = 1,
;For list controls
	LIST_UPDOWN=1,
	LIST_LEFTRIGHT=2,
;Establish programmability
;Non-0 values so if 0, set globals to 1.  This way, if a problem occurs we can still check.
	MODE_PROGRAMMABLE = 2,
	MODE_SINGLE =1,
;Separate the two wheels
	WHEEL_LEFT =1,
	WHEEL_RIGHT =2,
	WHEEL_SINGLE=3,
;For wheel navigation
	WHIZ_DOWN = 0,
	WHIZ_UP = 1,
;For modes
	WHIZ_LINE= 1,;Default setting
	WHIZ_SENTENCE = 2,
	WHIZ_PARAGRAPH = 3,
	WHIZ_FOCUS_PAN = 4,
	WHIZ_EMAIL = 5, ; for email messages.
;INI consts
	FILE_FSI="FSI_ML.jsi",
	SECTION_WHIZ="WhizWheels",
	SECTION_FOCUS="Focus Settings",
	hKey_DIFF="Programmable",
	hKey_LEFT="Left",
	hKey_RIGHT="Right",
	hKEY_SINGLE="Single",
	hKEY_LeftWheelSpeechMode = "LeftWheelSpeechMode",
	hKEY_RightWheelSpeechMode = "RightWheelSpeechMode",
;device name returned by BrailleGetDeviceInfo:
	csDevName_FSBRL = "fsbrl",
	csDevName_ML40 = "ML40",
	csDevName_ML20 = "ML20"

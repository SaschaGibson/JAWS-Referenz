CONST
;Constants for Braille Zoom (Table Display)
	Default_Braille_TableZoom = 0,
	ZOOM_TO_CURRENT_CELL=0,
	ZOOM_TO_CURRENT_ROW=1,
	ZOOM_TO_CURRENT_COL=2,
	ZOOM_TO_CUR_ROW_AND_COLTITLES=3,
	ZOOM_TO_CUR_AND_PRIOR_ROW=4,
		Default_Braille_TableShowCoords = 1,
	Default_Braille_TableHeaders = 0, ;= off
	HEADER_ROW=1, ;= TBL_HEADER_ROW (hjConst.jsh)
	HEADER_COLUMN=2, ;= TBL_HEADER_COL (hjConst.jsh)
	HEADER_BOTH=3, ;= TBL_HEADER_BOTH (hjConst.jsh)
	HEADER_MARKED=4, ;= TBL_HEADER_MARKED (hjConst.jsh)
;The following is name of PAC Mate displays do not translate, internal name:
	PM_DISPLAY_NAME	"pm display"

GLOBALS
	int BrailleFirstTime,
	int SelectSet,
	int SelectFromX,
	int SelectFromY,
	Int Previous_Braille_Mode,
	int GIPrevBrlMarking,
	String OldPcCursorDots,
	String OldJAWSCursorDots,
	String OldInvisibleCursorDots,
	Int BrailleOldBlinkRate,
	Int BrailleOldBlinkRate2,
	Int BrailleCursorShape,
	Int BrailleStatusMode,
	Int BrailleGlobalPixelsPerSpace,
;For Braille Display Options in Tables
	int GIBrlShowCoords,
	int GIBrlTblHeader,
	int GIBrlTBLZoom

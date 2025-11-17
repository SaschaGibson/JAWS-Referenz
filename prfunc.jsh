;Script files for Corel Presentations 9 (Service Pack 4)
; Copyright 2010-2015 by Freedom Scientific, Inc.
;Accompanying executables to this application are:
; prwin9.exe, prlmen.dll 
; This file contains Object Model interface header constants and globals

const
presentationsPerfectScriptObject="presentations.perfectScript",
; current mode values
DRAWING_MODE=1,
SLIDE_EDIT_MODE=2,
SLIDE_OUTL_MODE=8,
SLIDE_SORT_MODE=16,
BCKGND_EDIT_MODE=32,
LAYOUT_EDIT_MODE=64,
DATA_CHART_MODE=128,
ORG_CHART_MODE=256,
TEXT_EDIT_MODE=512,
PAINT_MODE=1024,
OLE_DRAWING_MODE=2048,
OLE_DATA_CHART_MODE=4096,
; Return values of EnvCurrentTool()
INVALID_TOOL=0,
SELECT_OBJECTS=1,
CREATE_CHART=2,
CREATE_ORG_CHART=3,
CREATE_BULLET_CHART=4,
CREATE_FIGURE=5,
CREATE_TEXT_LINE=6,
DRAW_POLYLINE=7,
DRAW_CURVE=8,
DRAW_CLOSED_CURVE=9,
DRAW_POLYGON=10,
DRAW_REGULAR_POLYGON=11,
DRAW_RECTANGLE=12,
DRAW_ROUNDED_RECTANGLE=13,
DRAW_ELLIPSE=14,
DRAW_ELLIPTICAL_ARC=15,
DRAW_CIRCLE=16,
DRAW_CIRCULAR_ARC=17,
DRAW_ARROW=18,
DRAW_BEZIER=19,
DRAW_FREEHAND=20,
CREATE_BITMAP=21,
BTMP_PAINTBRUSH=22,
BTMP_AIRBRUSH=23,
BTMP_FLOOD_FILL=24,
BTMP_DROPPER=25,
BTMP_PIXEL_REPLACE=26,
BTMP_ERASER=27,
BTMP_SELECT_AREA=28,
BTMP_EDIT_FATBITS=29,
BTMP_ACQUIRE_IMAGE=30,
CREATE_TEXT_BOX=31,
DRAW_LINE=32,
SELECT_POINT=33,
SELECT_ZOOM_AREA=34,
DRAW_SMARTSHAPE=35,
; Braille constants
brlMaxNoteLength=50 ; how many chars of the slide's notes to show in slide sorter view. 

globals
object oPres,
object oNull,
string gsBRLObjectName, ; used for Braille support in navigation views
string gsBRLObjectText, ; used for Braille support in navigation views 
string gsBRLSlideInfo, ; used for Braille support in Slide Sorter View
string gsBRLCurrentMode, ; used for Braille support in all views
int giCurrentMode, ; used to store the current UI mode so continual querying of O.M. doesn't slow things down
int giBrlVerbosity,
int giPriorTool ; used to determine if the drawing tool has changed

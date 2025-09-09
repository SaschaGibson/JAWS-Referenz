;Script Message file for Corel Presentations X5
; Copyright 2010-2020 by Freedom Scientific, Inc.
; Version 4.0
;by Joseph Stephen
;17 July 2000
; Build 4.0.130
; last modify by: Sean Murphy on 22nd Oct 2001
;Accompanying executables to this application are:
; prwin15.exe, prlmen.dll

const
;keystrokes:
ksDelete="{delete}",
; because the menubar is written directly to the Open/Save As dialogs
;we need to suppress its reading when the dialog is spoken.
scMenuBar="File Edit View Tools Favorites Help",
; window names and dialog pages
wn_perfectExpert="PerfectExpert",
wn_writingTools="Writing Tools",
wn_paused="paused:", ; when spellchecker is paused
wn_ready="Ready:", ; when Spellchecker is wating to begin
wn_createNewPage="Create New",



;UNUSED_VARIABLES

;comparisons/symbols
scDecimal=".",
scCommaSpace = ", ",
scColon=":"

;END_OF_UNUSED_VARIABLES

messages
@msgAppStart1_L
For JAWS Hotkey Help with Corel Presentations use %KeyFor(hotkeyHelp).
For a list of Presentations short cut keys use  %KeyFor(WindowKeysHelp).
To hear the JAWS help topic for Corel Presentations press %KeyFor(screenSensitiveHelp) twice quickly.
@@
@msgAppStart1_S
hotkey help use %KeyFor(hotkeyHelp).
Presentations shortcut keys use  %KeyFor(WindowKeysHelp).
JAWS help topic for Presentations %KeyFor(screenSensitiveHelp) twice quickly.
@@
@msgToolbarListError1_l
You must exit the current dialog in order to access the toolbar
@@
@msgToolbarListError2_l
Toolbar not found
@@
@msgListName
Select a Toolbar Button
@@
@msgExtendedHelp_L
To hear the JAWS help topic for Corel Presentations X5 press %KeyFor(screenSensitiveHelp) twice quickly
@@
@msgExtendedHelp_S
JAWS help topic for Corel Presentations X5 %KeyFor(screenSensitiveHelp) twice quickly
@@
@msgAppName
Corel Presentations X5
@@
@PRMsgCharGrid
character grid
@@
@PRMsgGLB
image array
@@
@PRMsgPRArray
image array
@@
@PRMsgBitmapButton
BitMap button
@@
@PRMsgPressed
pressed
@@
@PRMsgSlideShowRunning_L
Slideshow running
@@
@PRMsgSlideShowRunning_S
show running
@@
;for PRMsgSlideIndex, %1=slide number, %2=slide count, eg slide 2 of 5
@PRMsgSlideIndex
slide %1 of %2
@@
;for pRMsgSlide, %1=slide number
@pRMsgSlide
slide %1
@@
;for PRMsgSpeakerNotesFor_L/S, %1=slide title
@PRMsgSpeakerNotesFor_L
speaker's notes for %1:
@@
@PRMsgSpeakerNotesFor_S
notes for %1:
@@
@PRMsgObjectDeleted
object deleted
@@
@PRMsgDeleted
deleted
@@
@PRMsgObjInserted_L
object inserted
@@
@PRMsgObjInserted_S
inserted
@@
@PRMsgHasNotes_L
The slide has speaker's notes
@@
@PRMsgHasNotes_S
has notes
@@
;Screen Sensitive Help messages
@PRMsgSlideShowRunning1_L
A slideshow is running.
To stop the show press Escape.
JAWS does not support this view.
@@
@PRMsgSlideShowRunning1_S
slideshow running
stop show press Escape
unsupported view
@@
@PRMsgBitmapBtnHelp1_L
This is a bitmap button.
Use space to activate it or press tab to move to the next control.
@@
@PRMsgBitmapBtnHelp1_S
bitmap button
activate with spacebar
@@
@PRMsgGLBHelp1_L
This is an Image Array.
Use the arrow keys to select an image and press tab to move to the next control.
@@
@PRMsgGLBHelp1_S
Image Array
Use arrow keys to select image
@@
;for PRMsgScreenSensitiveHelp1_L/S, %1=view description, %2=drawing tool description,
;%3=number of objects on slide
@PRMsgScreenSensitiveHelp1_L
The current view is %1.
The %2 tool is active.
To move between objects use tab and shift tab.
To edit the selected object press Enter.
There are %3 objects on this slide.
@@
@PRMsgScreenSensitiveHelp1_S
View is %1
%2 tool
move between objects tab and shift tab
edit object Enter
%3 objects
@@
;for PRMsgScreenSensitiveHelp2_L/S, %1=view description, %2=number of slides
@PRMsgScreenSensitiveHelp2_L
The current view is %1.
to move between slides use the arrow keys.
To cut, copy, paste or delete slides use standard Windows keystrokes.
There are %2 slides in the document.
@@
@PRMsgScreenSensitiveHelp2_S
view is %1
move between slides with arrow keys
cut, copy, paste or delete slides with standard Windows keystrokes
%2 slides
@@
;for PRMsgScreenSensitiveHelp3_L/S, %1=view description
@PRMsgScreenSensitiveHelp3_L
The current view is %1.
To edit text, use standard editing keystrokes and menu options.
@@
@PRMsgScreenSensitiveHelp3_S
view is %1
edit text with standard editing keystrokes and menu options
@@
;for PRMsgScreenSensitiveHelp4_L/S, %1=view description, %2=drawing tool description
@PRMsgScreenSensitiveHelp4_L
The current view is %1.
The %2 tool is active.
To position the object, move the tool using the arrow keys.
To insert the object at its default size pres the spacebar.
To extend the dimentions of the object hold the spacebar down while using the arrow keys.
To insert the object on the slide after you've extended it to the correct size release the spacebar.
Not all objects can be inserted without sizing. Line objects for example need to be sized.
@@
@PRMsgScreenSensitiveHelp4_S
view is %1
%2 tool
position object move tool using arrows
insert object at default size pres space
extend dimentions of object hold space down while using arrows
insert object on slide after extending release space
Not all objects can be inserted without sizing. Line objects for example need to be sized.
@@
;for PRMsgScreenSensitiveHelp5_L/S, %1=view description
@PRMsgScreenSensitiveHelp5_L
The current view is %1.
@@
@PRMsgScreenSensitiveHelp5_S
view is %1
@@
@PRMsgExitEdit_L
To exit text edit mode press Escape.
@@
@PRMsgExitEdit_S
Exit Edit Mode pres Escape
@@
@PRMsgEditWithButton_L
This edit control has an associated button.
To activate it use f4.
@@
@PRMsgEditWithButton_S
This edit control has an associated button.
activate with f4
@@
@PRMsgHotkeyHelp1_L
To list toolbar buttons use %KeyFor(ToolbarList).
To announce the current tool use %KeyFor(SayCurrentTool).
To announce the selected object's dimensions and location use %KeyFor(SayObjectDimensionsAndLocation).
To read the speaker's notes use %KeyFor(ReadSpeakerNotes).
To announce slide information such as Layout title, Background title, number of objects ettc use %KeyFor(SaySlideInfo).
To read the misspelled word and first suggestion in the Spellchecker dialog use %KeyFor(ReadMisspelledAndSuggestion).
To refocus on the Writing Tools dialog from the document area press  %KeyFor(ReadMisspelledAndSuggestion) twice quickly.
To hear a list of shortcut keys specific to Corel Presentations use %KeyFor(windowKeysHelp).
@@
@PRMsgHotkeyHelp1_S
list toolbar buttons %KeyFor(ToolbarList)
announce the current tool %KeyFor(SayCurrentTool)
announce selected object's dimensions and location %KeyFor(SayObjectDimensionsAndLocation)
read speaker's notes %KeyFor(ReadSpeakerNotes)
announce slide information %KeyFor(SaySlideInfo)
read misspelled word and first suggestion in Spellchecker %KeyFor(ReadMisspelledAndSuggestion)
refocus on Writing Tools dialog from document area %KeyFor(ReadMisspelledAndSuggestion) twice quickly
hear a list of Presentation shortcut keys %KeyFor(windowKeysHelp)
@@
; edit controls with button smart help
@PRMsgToActivateTheButton_L
To activate the selector button associated with this edit control press F4.
@@
@PRMsgToActivateTheButton_S
Press F4 to activate selector button
@@
; window keys help
@msgWKeysHelp1_l
Here is a list of Presentations Keystrokes:
New Project Ctrl + N
New From Project Ctrl + Shift + N
Open Project Ctrl + O
Close Project Ctrl + F4
Save Project Ctrl + S
Page Setup Ctrl + F8
Print Project Ctrl + P
Exit Presentations Alt + F4
Undo Ctrl + Z
Redo Ctrl + Shift + R
Cut Ctrl + X
Copy Ctrl + C
Paste Ctrl + V
Clear Ctrl + Shift + F4
Select All Ctrl + A
Back One Shift + F6
Find and Replace Ctrl + F
Go To List Ctrl + G
Ruler Alt + Shift + F3
Display Grid Alt + Shift + F8
Snap to Grid Alt + F8
Reveal Codes Alt + F3
Insert Symbol Ctrl + W
Center Shift + F7
Flush Right Alt + F7
Hanging Indent Ctrl + F7
Double Indent Ctrl + Shift + F7
Back Tab Shift + Tab
Left Justify Ctrl + L
Right Justify Ctrl + R
Center Ctrl + E
Get Attributes Ctrl + Shift + G
Apply Attributes Ctrl + Shift + A
Spell Checker Ctrl + F1
Grammatik Alt + Shift + F1
Thesaurus Alt + F1
QuickCorrect Ctrl + Shift + F1
Play Macro Alt + F10
Record Macro Ctrl + F10
Stop Macro Ctrl + Shift + F10
Pause Macro Shift + F10
Redraw the document Ctrl+F3
Turn on/off What's This Help? Shift+F1
Increase Volume Plus Key
Viewing options in drop-down list boxes Alt+Down Arrow or Down Arrow
@@
@msgWKeysHelp1_s
Presentations Keystrokes:
New Ctrl + N
New From Project Ctrl + Shift + N
Open Ctrl + O
Close Ctrl + F4
Save Ctrl + S
Page Setup Ctrl + F8
Print Ctrl + P
Exit Alt + F4
Undo Ctrl + Z
Redo Ctrl + Shift + R
Cut Ctrl + X
Copy Ctrl + C
Paste Ctrl + V
Clear Ctrl + Shift + F4
Select All Ctrl + A
Back One Shift + F6
Find and Replace Ctrl + F
Go To List Ctrl + G
Ruler Alt + Shift + F3
Display Grid Alt + Shift + F8
Snap to Grid Alt + F8
Reveal Codes Alt + F3
Insert Symbol Ctrl + W
Center Shift + F7
Flush Right Alt + F7
Hanging Indent Ctrl + F7
Double Indent Ctrl + Shift + F7
Back Tab Shift + Tab
Left Justify Ctrl + L
Right Justify Ctrl + R
Center Ctrl + E
Get Attributes Ctrl + Shift + G
Apply Attributes Ctrl + Shift + A
Spell Checker Ctrl + F1
Grammatik Alt + Shift + F1
Thesaurus Alt + F1
QuickCorrect Ctrl + Shift + F1
Play Macro Alt + F10
Record Macro Ctrl + F10
Stop Macro Ctrl + Shift + F10
Pause Macro Shift + F10
Redraw the document Ctrl+F3
Turn on/off What's This Help? Shift+F1
Increase Volume Plus Key
Viewing options in drop-down list boxes Alt+Down Arrow or Down Arrow
@@
@PRMsgUnitPoints_S
Points
@@
@PRMsgUnitWPUnits_S
WP Units
@@
@PRMsgAppSettingsSaved_L
Application settings saved.
@@
@PRMsgAppSettingsSaved_S
settings saved
@@
@PRMsgAppSettingsNotSaved_L
Application settings could not be saved.
@@
@PRMsgAppSettingsNotSaved_S
Settings not saved
@@
@PRMsgWritingToolsNotVisible_L
The Writing Tools dialog is not visible.
@@
@PRMsgWritingToolsNotVisible_S
Writing Tools dialog not visible
@@
@msgVirtualError_l
%1 is not supported in the Virtual window.
@@
@msgWritingToolsError_l
The Writing Tools dialogue is present on the screen.
Press %KeyFor(SetFocusWritingTools) to move focus to the dialogue.
@@


;UNUSED_VARIABLES

; UI modes
@PRMsgDRAWING_MODE
drawing mode
@@
@PRMsgSLIDE_EDIT_MODE
slide edit view
@@
@PRMsgSLIDE_OUTL_MODE
slide outliner view
@@
@PRMsgSLIDE_SORT_MODE
slide sorter view
@@
@PRMsgBCKGND_EDIT_MODE
slide background edit view
@@
@PRMsgLAYOUT_EDIT_MODE
slide layout edit view
@@
@PRMsgDATA_CHART_MODE
data chart edit mode
@@
@PRMsgORG_CHART_MODE
org chart edit mode
@@
@PRMsgTEXT_EDIT_MODE
text edit mode
@@
@PRMsgPAINT_MODE
paint mode
@@
@PRMsgOLE_DRAWING_MODE
OLE drawing mode
@@
@PRMsgOLE_DATA_CHART_MODE
OLE data chart edit mode
@@
@PRMsgChartDatasheet
Chart Datasheet window
@@
; in the next section, %1=measure, %2=units
@PRMsgObjectWidth
%1 %2 wide
@@
@PRMsgObjectHeight
%1 %2 high
@@
@PRMsgObjectTopLeftX
%1 %2 from left
@@
@PRMsgObjectTopLeftY
%1 %2 from bottom
@@
@PRMsgPointerX
%1 %2 from left
@@
@PRMsgPointerY
%1 %2 from bottom
@@
; end of section
@PRMsgNoNotes_L
no speaker's notes
@@
@PRMsgNoNotes_S
no notes
@@
;for PRMsgSlideContains_L/S, %1=number of objects on slide
@PRMsgSlideContains_L
The slide contains %1 objects.
@@
@PRMsgSlideContains_S
%1 objects
@@
;for PRMsgDecimalNumber1, %1=whole part of number, %2=decimal part of number
@PRMsgDecimalNumber1
%1.%2
@@
@PRMsgSELECT_OBJECTS
SELECT OBJECTS
@@
@PRMsgCREATE_CHART
CREATE CHART
@@
@PRMsgCREATE_ORG_CHART
CREATE ORG CHART
@@
@PRMsgCREATE_BULLET_CHART
CREATE BULLET CHART
@@
@PRMsgCREATE_FIGURE
CREATE FIGURE
@@
@PRMsgCREATE_TEXT_LINE
CREATE TEXT LINE
@@
@PRMsgDRAW_POLYLINE
DRAW POLYLINE
@@
@PRMsgDRAW_CURVE
DRAW CURVE
@@
@PRMsgDRAW_CLOSED_CURVE
DRAW CLOSED CURVE
@@
@PRMsgDRAW_POLYGON
DRAW POLYGON
@@
@PRMsgDRAW_REGULAR_POLYGON
DRAW REGULAR POLYGON
@@
@PRMsgDRAW_RECTANGLE
DRAW RECTANGLE
@@
@PRMsgDRAW_ROUNDED_RECTANGLE
DRAW ROUNDED RECTANGLE
@@
@PRMsgDRAW_ELLIPSE
DRAW ELLIPSE
@@
@PRMsgDRAW_ELLIPTICAL_ARC
DRAW ELLIPTICAL ARC
@@
@PRMsgDRAW_CIRCLE
DRAW CIRCLE
@@
@PRMsgDRAW_CIRCULAR_ARC
DRAW CIRCULAR ARC
@@
@PRMsgDRAW_ARROW
DRAW ARROW
@@
@PRMsgDRAW_BEZIER
DRAW BEZIER
@@
@PRMsgDRAW_FREEHAND
DRAW FREEHAND
@@
@PRMsgCREATE_BITMAP
CREATE BITMAP
@@
@PRMsgBTMP_PAINTBRUSH
BITMAP_PAINTBRUSH
@@
@PRMsgBTMP_AIRBRUSH
BITMAP AIRBRUSH
@@
@PRMsgBTMP_FLOOD_FILL
BITMAP FLOOD FILL
@@
@PRMsgBTMP_DROPPER
BITMAP DROPPER
@@
@PRMsgBTMP_PIXEL_REPLACE
BITMAP PIXEL REPLACE
@@
@PRMsgBTMP_ERASER
BITMAP ERASER
@@
@PRMsgBTMP_SELECT_AREA
BITMAP SELECT AREA
@@
@PRMsgBTMP_EDIT_FATBITS
BITMAP EDIT FAT BITS
@@
@PRMsgBTMP_ACQUIRE_IMAGE
BITMAP ACQUIRE IMAGE
@@
@PRMsgCREATE_TEXT_BOX
CREATE TEXT BOX
@@
@PRMsgDRAW_LINE
DRAW LINE
@@
@PRMsgSELECT_POINT
SELECT POINT
@@
@PRMsgSELECT_ZOOM_AREA
SELECT ZOOM AREA
@@
@PRMsgDRAW_SMARTSHAPE
DRAW SMART SHAPE
@@
;for PRMsgToolIs_L/S, %1=drawing tool description
@PRMsgToolIs_L
%1 tool
@@
@PRMsgToolIs_S
%1 tool
@@
; Toggle units of measure
@PRMsgUnitPoints_L
Units of Measure set to Points.
@@
@PRMsgUnitWPUnits_L
Units of Measure set to WP Units. There are 1200 WP Units per inch.
@@

;END_OF_UNUSED_VARIABLES

endMessages

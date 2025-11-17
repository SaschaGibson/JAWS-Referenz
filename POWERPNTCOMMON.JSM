; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 11.00.xx
;common message file for Microsoft Powerpoint

CONST
;function called from User Buffer
	fnMovePointer="MovePointer(%1, %2)",
;keystrokes
	ksNewSlide="CONTROL+m",
	ksToggleExpandCollapse="Alt+Shift+A",
	ksCopy="Control+c",
	ksVirtualContextKey="Shift+F10",

;string compares
	sc_DesignTemplate = "Design Template",
	sc_SpellWordHook = "SpellWordHook",
	scTemplateInstallationStr = "Click OK to install additional templates and create a new file.",
	scPercent= "%",
	scFormulaSheetDelimiter="!", ; used for extracting the sheet name from a formula's range
	scFormulaRangeDelimiter=",", ; used for formula delimiter when distinguishing the parts of a formula specifying a range of cells
	scNL="\n",
	scNoSuggestions="no suggestions",

; functions called from User Buffer when chart is active
	fnSelectChartTitle="SelectChartTitle(oChart)", ; actual function string
	fnDisplaySelectChartTitle="Select Chart Title", ; what is displayed in dlgListOfLinks dialog
	fnSelectCategoryAxisTitle="SelectCategoryAxisTitle(oChart)", ; actual function string
	fnDisplaySelectCategoryAxisTitle="Select Category Axis Title", ; what is displayed in dlgListOfLinks dialog
	fnSelectValueAxisTitle="SelectValueAxisTitle(oChart)", ; actual function string
	fnDisplaySelectValueAxisTitle="Select Value Axis Title", ; what is displayed in dlgListOfLinks dialog

;Note to  translators, this should only be translated if the Excel Worksheet Round Function is different in your VBA installation.
;for XLRoundPercentCalcFunction,
;%1=valueRangeSourceSheet
;%2=point address
;%3=valueRange
;note the double %%. This is required in order to pass the % to the formula
XLRoundPercentCalcFunction="=round(%1%2/SUM(%3)%%,0)",
;command bars
	CBFormatting="formatting",
	cbOutlining="Outlining",
;button names
	BtnBold="bold",
	btnItalic="italic",
	btnUnderline="underline",
	btnExpandAll="Expand All",
	btnCollapseAll="Collapse All",
;window titles
	wn_Symbol="Symbol", ; Symbols dialog off Bullets and Numbering dialog
	wn_NewSlideDlgTitle="New Slide",
	wn_SlideLayoutDlgTitle="Slide Layout",
	wn_BulletDlgTitle="Bullet",
	wn_BackgroundDlgTitle="Background",
	wn_ColorSchemeDlgTitle="Color Scheme",
	wn_SpellingDlgTitle="Spelling:",
	wn_spelling="Spelling",
	wn_SetupShowDlgTitle="Set Up Show",
	wn_AutoContentWizDlgTitle="AutoContent Wizard",
	wn_DesignTemplateDlgTitle="Design Template", ; Design Template page of New Presentation Dialog.
	wn_PackAndGoDlgTitle="Pack and Go Wizard",
	wn_CustomAnimationDlgTitle="Custom Animation",
	wn_OrderAndTimingPageTitle="Order & Timing", ; Powerpoint 2000 Custom Animation dialog
	wn_EffectsPageTitle="Effects",
	wn_FindPresentation="Find Presentation",
	wn_InsertMovie="Insert Movie",



;UNUSED_VARIABLES

; Verbosity Dialog Extra Items
; Note to localizers:
;The following constants should only be translated starting with the character after the colon.
; for StrPowerpntVerbosityItems:
	jvToggleOverlapAlert="|ToggleOverlapAlert:Alert When Objects Overlap",
	jvToggleOverflowAlert="|ToggleOverflowAlert:Alert when Text Placeholder Overflow occurs",
	jvToggleTableReadingMethod="|ToggleTableReadingMethod:Table Reading Method",
	jvToggleSlideTransitions="|ToggleSlideTransitions:Announce slide transitions",
	jvToggleDescribeObjects="|ToggleDescribeObjects:Describe objects",
;Functions start (do not localize)
;function called from User Buffer
	fnMoveToHyperlink="MoveToHyperlink(%1)",
	scSaySelectedShape="sayselectedshape",
	scinitpptappobj="initpptappobj",
	sc_PhoneticSpellWordHook = "PhoneticSpellHook",
	scHandleCustomSpellCheckWindows = "handlecustomspellcheckwindows",
; Functions end	
	scNotSelected="not selected", ; Used to compare with result of getObjectValue in open/save as listview
	wn_TimingPageTitle="Timing", ; Powerpoint Custom Animation dialog
	wn_insert_movy = "Insert Movie",
	wn_insert_sound = "Insert Sound",
	wn_apply_design_template = "Apply Design Template",
	wn_format_object = "Format Object"

;END_OF_UNUSED_VARIABLES

Messages
@msgHotkeyHelp6_L
Choose an auto layout using the arrow keys and press Enter to continue.
@@
@msgHotkeyHelp6_S
Choose an auto layout using the arrow keys and press Enter to continue.
@@
@msgHotkeyHelp8_L
To return to the Object Level, press Escape.
@@
@msgHotkeyHelp8_S
Return to Object Level Escape
@@
; for msgOutlineViewScreenSensitiveHelp, %1 is the slide number.
@msgOutlineViewScreenSensitiveHelp
You are on slide %1 in the Outline tab pane, which displays the text of each slide in outline form.
Use the UP and DOWN arrow keys to move through the outline and from slide to slide.
Use normal text editing to enter text or cut, copy, and paste.
Press %KeyFor(NextObject)  to demote a bulleted item, a numbered item, a title, or a subtitle.
Press %KeyFor(PriorObject) to promote a bulleted item, a numbered item, or a subtitle.
Press %KeyFor(PreviousDocumentWindow) to change to the Slide Thumbnail Tab.
Use %KeyFor(SwitchPanes) to switch to the other available panes.
@@
@msgPhotoEditorImage
Photo Editor Image
@@
@msgExitSlideshow_L
exiting slideshow
@@
@msgExitSlideshow_s
exiting show
@@
@msgLastSlide_l
end of show
press Space to exit
@@
@msgLastSlide_s
End
Space to exit
@@
@msgScreenSensitiveHelp_SymbolPrompt
To move through this edit box, use the arrow keys.
@@
@msgDiagramGalleryListbox
Select a diagram type.
@@
@MsgComboBoxTutorHelp
Alt+DownArrow to open, up and down to a choice, Alt+UpArrow to close.
@@
@msgWarningCreateCells1_L
Warning! Pressing tab or Alt+Control Arrows here will add an extra row to this table.
@@
@msgWarningCreateCells1_S
Pressing tab or Alt+Control+Arrows here will add an extra row
@@
@msg252m_l
mixed shape
@@
@msgThumbnailsPane
slide thumbnails tab
@@
@msgMasterThumbnailsPane
master thumnails tab
@@
@msgPrintPreviewPane
print preview
@@
@msgSwitchToSpeakerNotes_l
Press %keyFor(SwitchPanes) or %KeyFor(SwitchPanesReverse) to find the speaker's notes.
@@
@msgSwitchToSpeakerNotes_s
Press %keyFor(SwitchPanes) or %KeyFor(SwitchPanesReverse).
@@
; For msgScreenSensitiveHelpSlideArea, %1 is the slide number.
@msgScreenSensitiveHelpSlideArea
This is the Slide Area.
You are on Slide %1.
@@
@msgScreenSensitiveHelpThumbnails
You are on the Slide Thumbnails Tab.
Press UP or DOWN ARROW to move from slide to slide.
Use the APPLICATION Key to get a menu of available actions or choices.
Use cut and paste commands to change slide order.
Press %KeyFor(PreviousDocumentWindow) to change to the Outline View Tab.
Use %KeyFor(SwitchPanes) to switch to the other available panes.
@@
; for msgObjectDescription,%1 is the number of the shape/object, and %2 is its description.
@msgObjectDescription
Object %1 has a %2.
@@
@msgNoComments
no comments to select
@@
@msgCommentsListTitle
Select a comment
@@
; for msgCommentInfo, %1 is the comment text, %2 the author.
@msgCommentInfo
%1 by %2
@@
@msg1_L
This is the Open button. Press Enter to open the selected file or
Press down arrow to access the context menu containing alternative options for opening the file.
Press tab to move to the next control.
@@
@msg1_S
This is the Open button. Press Enter to open the selected file or
Press down arrow to access the context menu containing alternative options for opening the file.
Press tab to move to the next control.
@@
@msg2_L
This is the AutoLayout selector.
Choose an auto layout using the arrow keys and press Enter to continue.
@@
@msg2_S
autoLayout selector
Choose auto layout using arrow keys
@@
@msg3_L
This is the Spell Checker dialog.
To repeat the spelling correction use %KeyFor(spellCheck).
To move between the dialog options use Tab and Shift Tab.
@@
@msg3_S
To repeat spelling correction %KeyFor(spellCheck)
@@
@msg4_L
This is the bullet dialog.
@@
@msg4_S
This is the bullet dialog.
@@
@msg5_L
This is a special kind of list. Choose a bullet type using the arrows. Use tab to move to the next control.
@@
@msg5_S
This is a special kind of list. Choose a bullet type using the arrows. Use tab to move to the next control.
@@
@msg6_L
This is a popup menu which has been automatically activated, use the up and down arrows to select an option. Use tab to move to the next control.
@@
@msg6_S
This is a popup menu which has been automatically activated, use the up and down arrows to select an option. Use tab to move to the next control.
@@
@msg7_L
This is the background dialog.
@@
@msg7_S
This is the background dialog.
@@
@msg8_L
This is a popup menu which has been automatically activated, use the up and down arrows to select an option. Use tab to move to the next control.
@@
@msg8_S
This is a popup menu which has been automatically activated, use the up and down arrows to select an option. Use tab to move to the next control.
@@
@msg9_L
This is the Color Scheme multi page dialog.
@@
@msg9_S
This is the Color Scheme multi page dialog.
@@
@msg10_L
This is the Color Scheme Selection control
Use the arrows to select a color scheme. Use tab to move to the next control.
@@
@msg10_S
This is the Color Scheme Selection control
Use the arrows to select a color scheme. Use tab to move to the next control.
@@
@msg11_L
This is the Set Up Show dialog.
@@
@msg11_S
This is the Set Up Show dialog.
@@
@msg12_L
Pen selection pop up
This is a popup menu which has been automatically activated, use the up and down arrows to select an option. Use tab to move to the next control.
@@
@msg12_S
Pen selection pop up
This is a popup menu which has been automatically activated, use the up and down arrows to select an option. Use tab to move to the next control.
@@
@msg13_L
You are in an embedded MS Word Document
You can navigate and edit as if you were in Microsoft Word.
@@
@msg13_S
You are in an embedded MS Word Document
You can navigate and edit as if you were in Microsoft Word.
@@
@msg14_L
You are in an embedded Excel Worksheet.
To move around the worksheet and hear cell data use standard navigation keystrokes.
@@
@msg14_S
You are in an embedded Excel Worksheet
move around worksheet and hear cell data with standard navigation keystrokes
@@
@msg15_L
You are in
@@
@msg15_S
You are in
@@
@msg16_L
of a table. Use the standard %product% table reading keys to navigate.
@@
@msg16_S
of a table. Use the standard %product% table reading keys to navigate.
@@
@msg17_L
Press Escape to return to the object level when you are finished.
@@
@msg18_L
This is a popup menu which has been automatically activated, use the up and down arrows to select an option. Use tab to move to the next control.
@@
@msg18_S
This is a popup menu which has been automatically activated, use the up and down arrows to select an option. Use tab to move to the next control.
@@
@msg19_L
This control shows all the slides in the selected presentation in miniature form.
Use the JAWS cursor to click on a slide.
Alternatively, shift tab once and press the Slide Titles button and then tab to select from a list of slide titles.
@@
@msg19_S
This control shows all the slides in the selected presentation in miniature form.
Use the JAWS cursor to click on a slide.
Alternatively, shift tab once and press the Slide Titles button and then tab to select from a list of slide titles.
@@
;for msg20_L/S, %1=selected object's description.
@msg20_L
You are at the Object Level.
The selected object is a %1.
To move the selection from object to object use tab and shift tab.
To edit or modify the properties for the %1 press Enter.
Once you've finished editing, press Escape to return to the Object Level.
@@
@msg20_S
object level.
selected object %1
move selection from object to object tab and shift tab
Edit or change Object properties for %1 Enter
return to object level Escape
@@
;for msg21-L/S, %1 IS THE NUMBER OF OBJECTS.
@msg21_L
You are at the Object Level.
This slide contains %1 objects.
There is currently no object selected.
To move the selection from object to object, press %KeyFor(NextObject) or %KeyFor(PriorObject).
Press %KeyFor(ENTER) to edit an object when it is selected.
When editing is finished, press %KeyFor(UpALevel) to go back to the Object Level.
@@
@msg21_S
object level.
slide has %1 objects
no object selected
%KeyFor(NextObject) or %KeyFor(PriorObject) to move selection from object to object
%KeyFor(Enter) to start editing an object
%KeyFor(UpALevel) when finished editing an object
@@
@msg22_L
To navigate and manipulate slides use standard navigation and selection keystrokes.
@@
@msg22_S
To navigate and manipulate slides use standard navigation and selection keystrokes.
@@
@msg24_L
Object level
@@
;for msg25_L/S, %1=shape description
@msg25_L
You are editing the text of the %1.
To return to the Object Level press Escape.
@@
@msg25_S
editing %1.
to return to Object Level Escape
@@
;for msg26_L/S, %1=cell coordinates and %2=table dimensions as returned by getTableDimensions()
@msg26_L
You are editing text in %1 of a table which has %2.
@@
;for msg27_L/S, %1=name of view (including the word view)
@msg27_L
This is the %1.
@@
@msg27_S
%1
@@
;for msgScreenSensitiveHelpNotesPane, %1=slide number
@msgScreenSensitiveHelpNotesPane
This is the Notes Pane for slide %1.
You can enter or edit the speaker's notes here.
Later you can press %KeyFor(ReadSpeakersNotes) to read the notes during the slide show.
Use %KeyFor(SwitchPanes) to switch panes.
@@
@msg29_L
Use F6 to switch panes.
@@
@msg30_L
The slideshow is running in full screen mode.
@@
@msg30_S
full screen mode
@@
@msg31_L
The slide show is not running in full screen mode.
@@
@msg31_S
not in full screen mode
@@
@msg32_L
Did not get the Application object, wait a few seconds and try this keystroke again.
If you still get this message, try alt tabbing away from and back to Powerpoint before pressing this keystroke again.
@@
; for msg33_L/S, %1=animated object's description
@msg33_L
This %1 will be animated during a slide show.
@@
@msg34_L
This object will not be animated during a slide show.
@@
; for msg35_L/S, %1=entry effect description
@msg35_L
The entry effect is %1
@@
@msg35_S
Entry effect %1
@@
; for msg36_L/S, %1=animation text unit
@msg36_L
The Animation Text Unit is %1
@@
@msg36_S
Text Unit %1
@@
; for msg37_L/S, %1=after effect description
@msg37_L
The After Effect is %1
@@
@msg37_S
After Effect %1
@@
; for msg38_L/S, %1=text level effect description
@msg38_L
the Text Level Effect is %1
@@
@msg38_S
Text Level Effect %1
@@
@msg39_L
Text will animate in reverse Order.
@@
@msg39_S
Text will animate in reverse Order.
@@
; for msg41_L/S, %1=number of hyperlinks on slide
@msg41_L
The slide contains %1 hyperlinks.
@@
@msg41_S
%1 hyperlinks
@@
;for msg42_L, %1=slide number
@msg42_L
slide %1
@@
@msg43_L
The slide advances on a mouse click
@@
@msg44_L
The animation is triggered by a mouse click.
@@
@msg44_S
animation triggered by  mouse click.
@@
; for msg45_L/S, %1=animation advance time in seconds
@msg45_L
The Animation advances after %1 seconds
@@
@msg45_S
animation Advances after %1 seconds
@@
; for msg46_L/S, %1=slide advance time in seconds
@msg46_L
The slide advances after %1 seconds
@@
@msg46_S
slide Advances after %1 seconds
@@
;for msg47_L/S, %1=entry effect description
@msg47_L
The Entry effect is %1
@@
@msg47_S
Entry effect %1
@@
@msg48_L
The slide show is paused.
@@
@msg49_L
The slide show is complete. Press any key to continue.
@@
@msgSlideHidden_l
The slide is hidden.
@@
@msgSlideHidden_s
slide hidden
@@
; Verbosity item messages
@msgAlertOverlapOff1_S
Off
@@
@msgAlertOverlapOn1_S
On
@@
@msgOverflowAlertOff1_S
Off
@@
@msgOverflowAlertOn1_S
On
@@
@msg54_S
dimensions
@@
@msg55_S
row by row
@@
@msg56_S
column by column
@@
@msg57_S
ignore
@@
@msgAppSettingsSaved1_L
Application Settings saved
@@
@msgAppSettingsNotSaved1_L
Application Settings could not be saved
@@
@msg58_L
Mixed font
@@
;for msg59_L/S, %1=font size
@msg59_L
%1 point
@@
@msg60_L
Mixed point size
@@
@msgExpandAll1_L
Expand All
@@
@msgCollapseAll1_L
Collapse All
@@
@msgOutlineViewStateExpanded1_L
The view is expanded.
@@
@msgOutlineViewStateExpanded1_S
view expanded.
@@
@msgOutlineViewStateCollapsed1_L
The view is collapsed.
@@
@msgOutlineViewStateCollapsed1_S
view collapsed.
@@
@msgParagraphLevel1_L
Paragraph level %1
@@
;for msg69_L/S, %1=paragraph level
@msg69_L
level %1
@@
; paragraph alignment
@msg71_L
Align Center
@@
@msg72_L
Align Distribute
@@
@msg73_L
Align Justify
@@
@msg74_L
Align Left
@@
@msg75_L
Alignment Mixed
@@
@msg76_L
Align Right
@@

;for msgShapeDims, %1 = shape description,
;%2 through %5 are dims.  %2 and 3 are points, while %4 and %5 are their values in units.
;%6 is unit used (inches or centimeters) figured out by the code using User Locale info
@msgShapeDims
%1 is %2 points wide and %3 points high.
in %6, this is %4 by %5.
@@
@msgShapeDimsInSlide
Shape dimensions relative to slide:
@@
;Note to localizers: Just localize the strings for these units, inches and centimeters.
;The code figures out which one to use in your language.
;Actually it does this by getting the unit of measure used on the machine.
; It is called UserLocale info and is set by the installation of Windows,
;or by the user in Regional and Language options in Control Panel.
@msgInches
inches
@@
;centimeters is approximate because we cannot use floating point numbers in the JAWS Scripting language.
@msgCentimeters
centimeters
@@
;for msgShapeDimInfo and msgShapeDimOutOfBounds, %1 = direction (left, top, etc.),
;%2 = points, %3 = units (inches or centimeters,
;%4 = unit used (msgInches or msgCentimeters.
@msgShapeDimInfo
%1 edge is %2 points, or %3 %4, from slide boundary.
@@
@msgShapeDimOutOfBounds
%1 edge overlaps slide boundary by  %2 points, or %3 %4.
@@
;for msgShapeDimAtSlideBoundary %1 = dimension
@msgShapeDimAtSlideBoundary
%1 edge is at slide boundary.
@@
@msgSelectedSlides1_L
selected slides:
@@
@msg77_L
no objects to select
@@
@msg78_L
Select an object
@@
;for msg79_L/S, %1=link address
@msg79_L
link: %1
activated on mouse over
@@
;for msg80_L/S, %1=link address
@msg80_L
link: %1
activated on mouse click
@@
@msg81_L
No hyperlinks on slide.
@@
@msg82_L
Select a Hyperlink
@@
@msg83_L
This object has no hyperlink
@@
@MSG84_L
NOT INSTALLED
@@
;for msgTableRow1Col, %1=table row or column number
;for msgTableDimensions_L, %1=number of columns, %2=number of rows
@msgTableDimensions1
%1 columns and %2 rows
@@
; for msgTableCoordinates1, %1=column number, %2=row number
@msgTableCoordinates1
column %1 row %2
@@
;msgTableCoordinates2, %1=col, %2=row, used for Braille
@msgTableCoordinates2
c%1r%2
@@
@msg85_L
no table selected
@@
@msg86_L
no selection
@@
@msg87_L
No shape selected.
@@
@msg88_L
cannot use this function in this view.
@@
; for msg89_L/S, %1=presentation elapsed time
@msg89_L
Presentation elapsed time =%1 seconds
@@
@msg89_S
Presentation elapsed time=%1 seconds
@@
; for msgDestination/SourceFolder1_L/S, %1=folder name
@msgDestinationFolder1_L
The selected destination folder is %1
@@
@msgDestinationFolder1_S
destination folder %1
@@
@msgSourceFolder1_L
The selected source folder is %1
@@
@msgSourceFolder1_S
source folder %1
@@
@msgBack1_L
Back
@@
@msgUpOneLevel1_L
Up one level
@@
;for msg90_L, %1=type of placeholder, eg title, subtitle etc
@msg90_L
%1 place holder
@@
; for msgPlaceHolderFull_L/S,
;%1=object description, %2=font size of last line in object's text frame
@msgPlaceholderFull1_L
The %1 contains its maximum number of lines based on the current font size of %2 points.
 @@
@msgPlaceholderFull1_S
%1 full based on current font size of %2 points.
 @@
; for msgPlaceHolderUnderFull_L/S,
;%1=approximate number of lines remaining in text frame, %2=object description,
;%3=font size of last line in object's text frame
@msgPlaceholderUnderfull1_L
There is room for approximately %1 more lines in this %2 based on the current font size of %3 points.
@@
@msgPlaceholderUnderfull1_S
approximately %1 more lines in %2 based on current font size of %3 points
@@
; for msgPlaceHolderOverFull_L/S,
;%1=approximate number of lines by which the text frame is over filled,
;%2=object description,
;%3=font size of last line in object's text frame
@msgPlaceholderOverfull1_L
There are approximately %1 too many lines in this %2 based on the current font size of %3 points.
@@
@msgPlaceholderOverfull1_S
approximately %1 too many lines in %2 based on current font size of %3 points
@@
; object overlap descriptions
; in all of these, %1=name of object which overlaps a test object or a conjunction word such as "and"
; %2=name of object being overlapped
@msgTopLeftCorner1_L
%1 overlaps top left corner of %2
@@
@msgTopRightCorner1_L
%1 overlaps top right corner of %2
@@
@msgBottomLeftCorner1_L
%1 overlaps bottom left corner of %2
@@
@msgBottomRightCorner1_L
%1 overlaps bottom right corner of %2
@@
@msgIsOntopOf1_L
%1 is on top of %2
@@
@msgIsCoveredBy1_L
%1 is covered by %2
@@
@msgLeftEdge1_L
%1 overlaps left edge of %2
@@
@msgRightEdge1_L
%1 overlaps right edge of %2
@@
@msgTopEdge1_L
%1 overlaps top edge of %2
@@
@msgBottomEdge1_L
%1 overlaps bottom edge of %2
@@
@msgMultipleOverlapConjunction1
and
@@
; end of overlap description messages
; controls for which sayObjectTypeAndText fails to correctly report
; for msgHelp1_l, %1 = "button"
@msgHelp1_L
help %1
@@
@msgChooseDestination1_L
Choose destination
@@
@msgMoveAhead1_L
move selection ahead in animation order
@@
@msgMoveBack1_L
move selection back in animation order
@@
@msgCustomEntryEffect1_L
Entry Effect:
@@
@msgCustomAnimationEffect1_L
Animation Effect:
@@
@msgCustomSoundEffect1_L
Sound Effect:
@@
@msgCustomAnimationAfterEffect1_L
Animation After Effect:
@@
@msgCustomAnimationParaLevel1_L
Paragraph Level:
@@
@msgSlideMiniatures1_L
Show Slide Miniatures
@@
@msgSlideTitles1_L
Show Slide Titles
@@
@msgSlideMiniatureDisplay1_L
Miniture Slide View
@@
@msgPresentationType1_L
Presentation Type:
@@
@msg91_L
Pen selection pop up
@@
@msg92_L
Bullet Color
@@
@msg93_L
Background Fill
@@
@msg94_L
Bullet type
@@
@msg96_L
color selector
@@
@msg98_L
Excel Worksheet
@@
;for msg99_L, %1=cell coordinates, %2=cell content
@msg99_L
%1: %2
@@
@msg100_L
Excel Chart
@@
@msgSelectingChartTitle
Selecting chart title
@@
@msgSelectingCategoryAxisTitle
Selecting category axis chart title
@@
@msgSelectingValueAxisTitle
Selecting value axis chart title
@@
@msg101_L
Ms Graph Chart
@@
@msg102_L
Bitmap Picture
@@
@msg103_L
Ms Clipart
@@
@msg104_L
MS Word Document
@@
@msg105_L
Powerpoint Presentation
@@
@msg106_L
Powerpoint Slide
@@
@msg107_L
Corel Wordperfect Document
@@
@msg108_L
Corel Quattro Pro Chart
@@
@msg109_L
Corel quattro Pro Notebook
@@
;for msg110_L/S, %1=slide show pointer type description
@msg110_L
The slide show Pointer type is %1.
@@
@msg110_S
pointer type %1
@@
; slide show pointer types
@msg111_L
always hidden
@@
@msg112_L
arrow
@@
@msg113_L
none
@@
@msg114_L
pen
@@
; slide show states
@msg115_L
No slide show active.
@@
@msg115_S
No show active.
@@
@msg116_L
Black screen
@@
@msg116_S
Black
@@
@msg117_L
SlideShow done
@@
@msg117_S
show done
@@
@msg118_L
SlideShow paused
@@
@msg118_S
Show paused
@@
@msg119_L
SlideShow running
@@
@msg119_S
Show running
@@
@msg120_L
White screen
@@
@msg120_S
White
@@
;for msg121_L/S, %1=slide layout type description
@msg121_L
Slide layout type is %1.
@@
@msg121_S
layout type %1
@@
; slide layout types
@msg122_L
chart
@@
@msg123_L
chart and text
@@
@msg124_L
clipart and text
@@
@msg125_L
clipart and vertical text
@@
@msg126_L
four objects
@@
@msg127_L
large object
@@
@msg128_L
media clip and text
@@
@msg129_L
object
@@
@msg130_L
object and text
@@
@msg131_L
object over text
@@
@msg132_L
org chart
@@
@msg133_L
table
@@
@msg134_L
text
@@
@msg135_L
text and chart
@@
@msg136_L
text and clipart
@@
@msg137_L
text and media clip
@@
@msg138_L
text and object
@@
@msg139_L
text and two objects
@@
@msg140_L
text over object
@@
@msg141_L
title
@@
@msg142_L
title ohnly
@@
@msg143_L
two column text
@@
@msg144_L
two objects and text
@@
@msg145_L
two objects over text
@@
@msg146_L
vertical text
@@
@msg147_L
vertical title and text
@@
@msg148_L
vertical title and text over chart
@@
@msgHyperlink
link
@@
; place holder type descriptions
@msg149_L
bitmap
@@
@msg150_L
body
@@
@msg151_L
center title
@@
@msg152_L
chart
@@
@msg153_L
date
@@
@msg154_L
footer
@@
@msg155_L
header
@@
@msg156_L
media clip
@@
@msg157_L
mixed
@@
@msg158_L
object
@@
@msg159_L
org chart
@@
@msg160_L
slide number
@@
@msg161_L
subtitle
@@
@msg162_L
table
@@
@msg163_L
title
@@
@msg164_L
vertical body
@@
@msg165_L
vertical title
@@
; end of place holder type descriptions
; autoshape descriptions
@msg166_L
16 point star
@@
@msg167_L
24 point star
@@
@msg168_L
32 point star
@@
@msg169_L
4 point star
@@
@msg170_L
5 point star
@@
@msg171_L
8 point star
@@
@msg172_L
action Button back or previous
@@
@msg173_L
action button beginning
@@
@msg174_L
action button custom
@@
@msg175_L
action button document
@@
@msg176_L
action button end
@@
@msg177_L
action button forward or next
@@
@msg178_L
action button help
@@
@msg179_L
action button home
@@
@msg180_L
action button information
@@
@msg181_L
action button movie
@@
@msg182_L
action button return
@@
@msg183_L
action button sound
@@
@msg184_L
arc
@@
@msg185_L
balloon
@@
@msg186_L
bent arrow
@@
@msg187_L
bent up arrow
@@
@msg188_L
bevel
@@
@msg189_L
block arc
@@
@msg190_L
can
@@
@msg191_L
chevron
@@
@msg192_L
circular arrow
@@
@msg193_L
cloud callout
@@
@msg194_L
cross
@@
@msg195_L
cube
@@
@msg196_L
curved down arrow
@@
@msg197_L
curved down ribbon
@@
@msg198_L
curved left arrow
@@
@msg199_L
curved right arrow
@@
@msg200_L
curved up arrow
@@
@msg201_L
curved up ribbon
@@
@msg202_L
diamond
@@
@msg203_L
donut
@@
@msg204_L
double brace
@@
@msg205_L
double bracket
@@
@msg206_L
double wave
@@
@msg207_L
down arrow
@@
@msg208_L
down arrow callout
@@
@msg209_L
down ribbon
@@
@msg210_L
explosion 1
@@
@msg211_L
explosion 2
@@
@msg212_L
flowchart alternate process
@@
@msg213_L
flowchart card
@@
@msg214_L
flowchart collate
@@
@msg215_L
flowchart connector
@@
@msg216_L
flowchart data
@@
@msg217_L
flowchart decision
@@
@msg218_L
flowchart delay
@@
@msg219_L
flowchart direct access storage
@@
@msg220_L
flowchart display
@@
@msg221_L
flowchart document
@@
@msg222_L
flowchart extract
@@
@msg223_L
flowchart internal storage
@@
@msg224_L
flowchart magnetic disk
@@
@msg225_L
flowchart manual input
@@
@msg226_L
flowchart manual operation
@@
@msg227_L
flowchart merge
@@
@msg228_L
flowchart multi document
@@
@msg229_L
flowchart off page connector
@@
@msg230_L
flowchart or
@@
@msg231_L
flowchart predefined process
@@
@msg232_L
flowchart preparation
@@
@msg233_L
flowchart process
@@
@msg234_L
flowchart punched tape
@@
@msg235_L
flowchart sequential access storage
@@
@msg236_L
flowchart sort
@@
@msg237_L
flowchart stored data
@@
@msg238_L
flowchart summing junction
@@
@msg239_L
flowchart terminator
@@
@msg240_L
folded corner
@@
@msg241_L
heart
@@
@msg242_L
hexagon
@@
@msg243_L
horizontal scroll
@@
@msg244_L
isosceles triangle
@@
@msg245_L
left arrow
@@
@msg246_L
left arrow callout
@@
@msg247_L
left brace
@@
@msg248_L
left bracket
@@
@msg249_L
left right arrow
@@
@msg250_L
left right arrow callout
@@
@msg251_L
left right up arrow
@@
@msg252_L
left up arrow
@@
@msg253_L
lightning bolt
@@
@msg254_L
line callout 1
@@
@msg255_L
line callout 1 accent bar
@@
@msg256_L
line callout 1 border and accent bar
@@
@msg257_L
line callout 1 no border
@@
@msg258_L
line callout 2
@@
@msg259_L
line callout 2 accent bar
@@
@msg260_L
line callout 2 border and accent bar
@@
@msg261_L
line callout 2 no border
@@
@msg262_L
line callout 3
@@
@msg263_L
line callout 3 accent bar
@@
@msg264_L
line callout 3 border and accent bar
@@
@msg265_L
line callout 3 no border
@@
@msg266_L
line callout 4
@@
@msg267_L
line callout 4 accent bar
@@
@msg268_L
line callout4 border and accent bar
@@
@msg269_L
line callout 4 no border
@@
@msg270_L
moon
@@
@msg271_L
no symbol
@@
@msg272_L
notched right arrow
@@
@msg273_L
not primitive
@@
@msg274_L
octagon
@@
@msg275_L
oval
@@
@msg276_L
oval callout
@@
@msg277_L
parallelogram
@@
@msg278_L
pentagon
@@
@msg279_L
plaque
@@
@msg280_L
quad arrow
@@
@msg281_L
quad arrow callout
@@
@msg282_L
rectangle
@@
@msg283_L
rectangular callout
@@
@msg284_L
regular pentagon
@@
@msg285_L
right arrow
@@
@msg286_L
right arrow callout
@@
@msg287_L
right brace
@@
@msg288_L
right bracket
@@
@msg289_L
right triangle
@@
@msg290_L
rounded rectangle
@@
@msg291_L
rounded rectangular callout
@@
@msg292_L
smiley face
@@
@msg293_L
striped right arrow
@@
@msg294_L
sun
@@
@msg295_L
trapezoid
@@
@msg296_L
up arrow
@@
@msg297_L
up arrow callout
@@
@msg298_L
up down arrow
@@
@msg299_L
up down arrow callout
@@
@msg300_L
up ribbon
@@
@msg301_L
uTurn arrow
@@
@msg302_L
vertical scroll
@@
@msg303_L
wave
@@
@msgFunnel
funnel
@@
; end of autoshape descriptions
; shape descriptions
@msg304_L
callout
@@
@msg305_L
chart
@@
@msg306_L
comment
@@
@msg307_L
embedded OLE object
@@
@msg308_L
form control
@@
@msg309_L
freeform
@@
@msg310_L
group
@@
@msg311_L
line
@@
@msg312_L
linked OLE object
@@
@msg313_L
linked picture
@@
@msg314_L
media
@@
; Media types Audio and Video:
@msgMediaTypeAudio
Audio
@@
@msgMediaTypeVideo
Video
@@
@msg315_L
OLE control object
@@
@msg316_L
picture
@@
@msg317_L
text box
@@
; end of shape type descriptions
; object animation after effects
@msg318_L
Dim
@@
@msg319_L
Hide
@@
@msg320_L
Hide On Click
@@
@msg321_L
Mixed
@@
@msg322_L
Nothing
@@
; animation text units
@msg323_L
animate by character
@@
@msg324_L
animate by word
@@
@msg325_L
animate by paragraph
@@
@msg326_L
animation mixed
@@
@msg327_L
no animation
@@
; UI views
@msg328_L
Slide View
@@
@msg328_S
Slide View
@@
@msg329_L
Slide area
@@
@msg329_S
Slide area
@@
@msg330_L
Slide Master View
@@
@msg330_S
Slide Master View
@@
@msg331_L
Notes Page View
@@
@msg331_S
Notes Page View
@@
@msg332_L
Slide Notes
@@
@msg332_S
Notes pane
@@
@msg333_L
Handout Master View
@@
@msg333_S
Handout Master View
@@
@msg334_l
Notes Master View
@@
@msg334_s
Notes Master View
@@
@msg335_L
Outline View
@@
@msg335_S
Outline View
@@
@msg336_L
Outline tab
@@
@msg336_S
Outline tab
@@
@msg337_L
Slide Sorter View
@@
@msg337_S
Slide Sorter View
@@
@msg338_L
Title Master View
@@
@msg338_S
Title Master View
@@
@msg339_L
Slide Show View
@@
@msg339_S
Slide Show View
@@
@msg340_L
Normal View
@@
@msg340_S
Normal View
@@
; entry effect descriptions
@msg341_L
Appear
@@
@msg342_L
Blinds Horizontal
@@
@msg343_L
Blinds Vertical
@@
@msg344_L
Box In
@@
@msg345_L
Box Out
@@
@msg346_L
Checkerboard Across
@@
@msg347_L
Checkerboard Down
@@
@msg348_L
Cover Down
@@
@msg349_L
Cover Left
@@
@msg350_L
Cover Left Down
@@
@msg351_L
Cover Left Up
@@
@msg352_L
Cover Right
@@
@msg353_L
Cover Right Down
@@
@msg354_L
Cover Right Up
@@
@msg355_L
Cover Up
@@
@msg356_L
Crawl From Down
@@
@msg357_L
Crawl From Left
@@
@msg358_L
Crawl From Right
@@
@msg359_L
Crawl From Up
@@
@msg360_L
Cut
@@
@msg361_L
Cut Through Black
@@
@msg362_L
Dissolve
@@
@msg363_L
Fade
@@
@msg364_L
Flash Once Fast
@@
@msg365_L
Flash Once Medium
@@
@msg366_L
Flash Once Slow
@@
@msg367_L
Fly From Bottom
@@
@msg368_L
Fly From Bottom Left
@@
@msg369_L
Fly From Bottom Right
@@
@msg370_L
Fly From Left
@@
@msg371_L
Fly From Right
@@
@msg372_L
Fly From Top
@@
@msg373_L
Fly From Top Left
@@
@msg374_L
Fly From Top Right
@@
@msg375_L
None
@@
@msg376_L
Peek From Down
@@
@msg377_L
Peek From Left
@@
@msg378_L
Peek From Right
@@
@msg379_L
Peek From Up
@@
@msg380_L
Random
@@
@msg381_L
Random Bars Horizontal
@@
@msg382_L
Random Bars Vertical
@@
@msg383_L
Spiral
@@
@msg384_L
Split Horizontal In
@@
@msg385_L
Split Horizontal Out
@@
@msg386_L
Split Vertical In
@@
@msg387_L
Split Vertical Out
@@
@msg388_L
Stretch Across
@@
@msg389_L
Stretch Down
@@
@msg390_L
Stretch Left
@@
@msg391_L
Stretch Right
@@
@msg392_L
Stretch Up
@@
@msg393_L
Strips Down Left
@@
@msg394_L
Strips Down Right
@@
@msg395_L
Strips Left Down
@@
@msg396_L
Strips Left Up
@@
@msg397_L
Strips Right Down
@@
@msg398_L
Strips Right Up
@@
@msg399_L
Strips Up Left
@@
@msg400_L
Strips Up Right
@@
@msg401_L
Swivel
@@
@msg402_L
Uncover Down
@@
@msg403_L
Uncover Left
@@
@msg404_L
Uncover Left Down
@@
@msg405_L
Uncover Left Up
@@
@msg406_L
Uncover Right
@@
@msg407_L
Uncover Right Down
@@
@msg408_L
Uncover Right Up
@@
@msg409_L
Uncover Up
@@
@msg410_L
Wipe Down
@@
@msg411_L
Wipe Left
@@
@msg412_L
Wipe Right
@@
@msg413_L
Wipe Up
@@
@msg414_L
Zoom Bottom
@@
@msg415_L
Zoom Center
@@
@msg416_L
Zoom In
@@
@msg417_L
Zoom In Slightly
@@
@msg418_L
Zoom Out
@@
@msg419_L
Zoom Out Slightly
@@
; text level animation descriptions
@msg420_L
AnimateByAllLevels
@@
@msg421_L
AnimateByFifthLevel
@@
@msg422_L
AnimateByFirstLevel
@@
@msg423_L
AnimateByFourthLevel
@@
@msg424_L
AnimateBySecondLevel
@@
@msg425_L
AnimateByThirdLevel
@@
@msg426_L
AnimateLevelMixed
@@
@msg427_L
AnimateLevelNone
@@
; chart description messages
; for msgCategoryAxisTitle1_L/S, %1=category axis title
@msgCategoryAxisTitle1_L
The Category axis title is %1
@@
@msgCategoryAxisTitle2_L
 The Category Axis Title is unlabeled
@@
@msgCategory1
CATEGORY
@@
; for msgValueAxisTitle1_L/S, %1=value axis title.
@msgValueAxisTitle1_L
The Value axis title is %1
@@
@msgValueAxisTitle2_L
 The Value Axis title is unlabeled
@@
@msgValueAxisTitle2_S
 Value Axis is unlabeled
@@
@msgValue1
value
@@
;for msgChartContainsSeriesDesc_L/S, %1=number of series and
;%2=series description, eg 5 lines
@msgChartContainsSeriesDesc1_L
the chart contains %1 %2
@@
;for msgSeriesLegend, %1=text of legend of series.
@msgSeriesLegend1
 legend: %1
@@
;for msgSeriesPointCount_L/S, %1=number of points in series
;%2=description of point, eg points, bars, etc.
@msgSeriesPointCount1_L
has %1 %2
@@
;for msgPointCategoryDesc, %1=point description, eg bar, point, etc
;%2=number, eg bar 1, point 3, etc
;%3=data label,
;%4=category axis title
;%5=category axis reading
@msgPointCategoryDesc1
%1 %2 %3
%4=%5
@@
;for msgPointValueDesc, %1=value axis title, %2=value axis reading
@msgPointValueDesc1
%1=%2
@@
;for msgContributesPercentage, %1=percentage contributed to chart unit,
;eg in a pie chart segment, value may contribute 30%
@msgContributesPercentage1
contributes %1 percent
@@
;when grouping a set of points with the same value axis reading,
;;we say point x through y has value z
;ie we read the first category axis title and reading, the first value axis
;title and reading, followed by through, followed by the last point's category
;axis title and reading and value axis title and reading.
@msgThrough1
through
@@
;for msgChartDescription_L/S, %1=chart description, %2=chart title or name
@msgChartDescription1_L
Chart Description: %1
@@
;singular and plural descriptions for series of points
@msgLineSingular1
line
@@
@msgLinePlural1
lines
@@
@msgPointSingular1
point
@@
@msgPointPlural1
points
@@
@msgSetOfHorizBars1
distinct sets of horizontal bars
@@
@msgSetSingular1
set
@@
@msgBarSingular1
bar
@@
@msgBarPlural1
bars
@@
@msgSetOfVertColumns1
distinct sets of vertical columns
@@
@msgColumnSingular1
column
@@
@msgColumnPlural1
columns
@@
@msgSeriesSingular1
series
@@
@msgSeriesPlural1
series
@@
@msgSliceSingular1
slice
@@
@msgSlicePlural1
slices
@@
@msgSetOfSlices1
distinct sets of slices
@@
; chart descriptions
@msg428_L
Area with a 3-D visual effect.
@@
@msg429_L
Stacked area with a 3-D visual effect.
@@
@msg430_L
100% stacked area with a 3-D visual effect.
@@
@msg431_L
Clustered bar with a 3-D visual effect.
@@
@msg432_L
Stacked bar with a 3-D visual effect.
@@
@msg433_L
100% stacked bar with a 3-D visual effect.
@@
@msg434_L
3-D Column. Compares values across categories and across series.
@@
@msg435_L
Clustered column with a 3-D visual effect.
@@
@msg436_L
Stacked column with a 3-D visual effect.
@@
@msg437_L
100% stacked column with a 3-D visual effect.
@@
@msg438_L
3-D Line. Line with a 3-D visual effect.
@@
@msg439_L
Pie with a 3-D visual effect.
@@
@msg440_L
Exploded pie with a 3-D visual effect.
@@
@msg441_L
Area. Displays the trend of values over time or categories.
@@
@msg442_L
Stacked Area. Displays the trend of the contribution of each value over time or categories.
@@
@msg443_L
100% Stacked Area. Displays the trend of the percentage each value contributes over time or categories.
@@
@msg444_L
Clustered Bar. Compares values across categories.
@@
@msg445_L
Bar of Pie. Pie with user-defined values extracted and combined into a stacked bar.
@@
@msg446_L
Stacked Bar. Compares the contribution of each value to a total across categories.
@@
@msg447_L
100% Stacked Bar. Compares the percentage each value contributes to a total across categories.
@@
@msg448_L
Bubble. Compares sets of 3 values. Like a scatter chart with the third value displayed as the size of the bubble marker.
@@
@msg449_L
Bubble with a 3-D visual effect.
@@
@msg450_L
Clustered Column. Compares values across categories.
@@
@msg451_L
Stacked Column. Compares the contribution of each value to a total across categories.
@@
@msg452_L
100% Stacked Column. Compares the percentage each value contributes to a total across categories.
@@
@msg453_L
Bar with a conical shape.
@@
@msg454_L
Stacked bar with a conical shape.
@@
@msg455_L
100% Stacked bar with a conical shape.
@@
@msg456_L
3-D Column with a conical shape.
@@
@msg457_L
Column with a conical shape.
@@
@msg458_L
Stacked column with a conical shape.
@@
@msg459_L
100% Stacked column with a conical shape.
@@
@msg460_L
Bar with a cylindrical shape.
@@
@msg461_L
Stacked bar with a cylindrical shape.
@@
@msg462_L
100% Stacked bar with a cylindrical shape.
@@
@msg463_L
Column with a cylindrical shape.
@@
@msg464_L
3-D Column with a cylindrical shape.
@@
@msg465_L
Stacked column with a cylindrical shape.
@@
@msg466_L
100% Stacked column with a cylindrical shape.
@@
@msg467_L
Doughnut. Like a pie chart, but can contain multiple series.
@@
@msg468_L
Exploded Doughnut. Like an exploded pie chart, but can contain multiple series.
@@
@msg469_L
Line. Displays trend over time or categories.
@@
@msg470_L
Line with markers displayed at each data value.
@@
@msg471_L
Stacked line with markers displayed at each data value.
@@
@msg472_L
100% Stacked Line with markers displayed at each data value.
@@
@msg473_L
Stacked Line. Displays the trend of the contribution of each value over time or categories.
@@
@msg474_L
100% Stacked Line. Displays the trend of the percentage each value contributes over time or categories.
@@
@msg475_L
Pie. Displays the contribution of each value to a total.
@@
@msg476_L
Exploded Pie. Displays the contribution of each value to a total while emphasizes individual values.
@@
@msg477_L
Pie of Pie. Pie with user-defined values extracted and combined into a second pie.
@@
@msg478_L
Bar with a pyramid shape.
@@
@msg479_L
Stacked bar with a pyramid shape.
@@
@msg480_L
100% Stacked bar with a pyramid shape.
@@
@msg481_L
3-D Column with a pyramid shape	.
@@
@msg482_L
Column with a pyramid shape.
@@
@msg483_L
Stacked column with a pyramid shape.
@@
@msg484_L
100% Stacked column with a pyramid shape.
@@
@msg485_L
Radar. Displays changes in values relative to a center point.
@@
@msg486_L
Filled Radar. Radar with the area covered by a data series filled with a color.
@@
@msg487_L
Radar with markers at each data point.
@@
@msg488_L
Stock High-Low-Close. Requires three series of values in this order.
@@
@msg489_L
Stock Open-High-Low-Close. Requires four series of values in this order.
@@
@msg490_L
Stock Volume-High-Low-Close. Requires four series of values in this order.
@@
@msg491_L
Stock Volume-Open-High-Low-Close. Requires five series of values in this order.
@@
@msg492_L
3-D Surface. Shows trends in values across two dimensions in a continuous curve.
@@
@msg493_L
Contour. Surface chart viewed from above. Colors represent ranges of values.
@@
@msg494_L
Wireframe Contour. Contour chart without color.
@@
@msg495_L
Wireframe 3-D Surface. 3-D surface chart without color.
@@
@msg496_L
Scatter. Compares pairs of values.
@@
@msg497_L
Scatter with data points connected by lines.
@@
@msg498_L
Scatter with data points connected by lines without markers.
@@
@msg499_L
Scatter with data points connected by smoothed Lines.
@@
@msg500_L
Scatter with data points connected by smoothed Lines without markers.
@@
@msg501_L
No chart active.
@@
@msgLayoutSelector1
layoutSelector
@@
@msgUserBufferSpeakersNotes
Speaker's Notes
@@
@msgUserBufferSlideShow
Slide Show
@@
@msgUserBufferHelpScreen
Screen Sensitive or Hotkey Help
@@
@msgUserBufferChart
Chart
@@
@msgNoPointer_L
there is no pointer on the slide.
Use the Context Menu to select a pointer.
@@
@msgNoPointer_S
no pointer on slide
@@
; for msgPointerMovedTo, %1=pointer type, %2=x, %3=y
@msgPointerMovedTo
%1 moved to %2 %3
@@
;msgXOfY, %1=index, %2=count
@msgXOfY
%1 of %2
@@
@msgInitMessageBoxTitle
Initialization
@@
@msgInitMessageBoxText
gathering required information
@@
;For msgSlideTitle, %1 = the title of slide.
@msgSlideTitle
%1 slide
@@
@msgLayoutComparison
comparison
@@
@msgLayoutContentWithCaption
content with caption
@@
@msgLayoutCustom
custom
@@
@msgLayoutPictureWithCaption
picture with caption
@@
@msgLayoutSectionHeader
section header
@@
@msgLayoutObjAndTwoObjs
object and two objects
@@
@msgLayoutTwoObjs
two objects
@@
@msgLayoutTwoObjsAndObj
two objects and object
@@
;for msgFontInfo, %1 = font name, %2 = point size as int, to match default behavior: e.g Arial 12 point
@msgFontInfo
%1 %2 point
@@
@msgHasComments
Has comments
@@
@msgHasNotes
Has notes
@@
@msgHasNotesAndComments
Has notes and comments
@@
;The following messages are used when the selected shape is moved on the slide.
;This is accomplished by selecting a shape with the tab key, and then using the directional arrows to move it.
;for msgShapeNavInfo %1 = direction, %2 = number of points moved.
;This may be called / recalled multiple times in the same printable string
@msgShapeNavInfo
%1 %2 points
@@
;Direction strings:
@msgLeft
left
@@
@msgUp
up
@@
@msgRight
right
@@
@msgDown
down
@@
@msgTop
top
@@
@msgBottom
bottom
@@
;for msgAtSlideBoundary, %1 = edge, e.g msgLeft, msgTop, etc. of slide
@msgAtSlideBoundary
slide %1 edge
@@
;for msgShapeOverlapSlide, %1 = direction of overlap, %2 = number of points beyond slide boundary.
@msgShapeOverlapSlide
overlaps slide %1 edge by %2 points.
@@
@msgHotKeyHelpEditMode
To increase the paragraph level by one, press %KeyFor(PromoteParagraph).
To decrease the paragraph level by one, press %KeyFor(demoteParagraph).
@@
@msgSpeakerNotesError
There are no notes for this slide.
@@
@msgSlideMasterThumbnailsTab
Press f6 to move to Slide Master view.
@@
@msgTutorSelectAnObject
To select an object, press tab.
@@
; msgTableNavAvailableOnlyWhileEditing is the error message for when table navigation is attempted
;while on a table object but not editing the table
@msgTableNavAvailableOnlyWhileEditing
Table navigation and cell reading is only available when editing a table object.
@@

;UNUSED_VARIABLES

@msgAppStart1_L
For %product% Hotkey Help with Microsoft Powerpoint use %keyFor(hotkeyHelp).
For a list of Powerpoint short cut keys use use %KeyFor(WindowKeysHelp).
To hear the %product% help topic for Microsoft Powerpoint press %keyFor(screenSensitiveHelp) twice quickly.
@@
@msgAppStart1_S
hotkey help use %KeyFor(hotkeyHelp).
Powerpoint shortcut keys use use %KeyFor(WindowKeysHelp).
%product% help topic for Powerpoint %keyFor(screenSensitiveHelp) twice quickly.
@@
@msgMoveToHyperlink
Address: %1
@@
@msg17_S
Press Escape to return to the object level when you are finished.
@@
@msg23_L
edit
@@
; for msg40_L/S, %1=number of objects on slide
@msg40_L
The slide contains %1 objects.
@@
@msg40_S
%1 objects
@@
; Verbosity item messages
@msgAlertOverlapOff1_L
Do not alert when shapes overlap
@@
@msgAlertOverlapOn1_L
Alert when shapes overlap
@@
@msgOverflowAlertOff1_L
Do not detect when text place holders become full
@@
@msgOverflowAlertOn1_L
Detect and announce when text place holders become full
@@
@msg54_L
Say table dimensions only
@@
@msg55_L
Read table row by row
@@
@msg56_L
Read table column by column
@@
@msg57_L
Ignore tables altogether
@@
; for msgButtonPressed1_L/S, %1=button name
@msgButtonPressed1_L
%1 button pressed
@@

; For following messages, %1 is coordinates in units, %2 is unit used (inchehs or centimeters)
;See comments above msgInches below to explain how this works.
; Which one to use is figured out by the program via User Locale settings of machine in use at runtime.
@msgTopLeftXInches_l
or %1 %2 from left edge.

@@
@msgTopLeftXInches_s
or %1 %2 from left.

@@
@msgTopLeftYInches_L
or %1 %2 from top edge.

@@
@msgTopLeftYInches_S
or %1 %2 from top.

@@
@msgWidthInches
or %1 %2.

@@
@msgHeightInches
or %1 %2.
@@

;for msgTopLeftX1_L/msgTopLeftY1_L/S, %1=coordinates in points
@msgTopLeftX1_L
Top left X is %1 points from left edge
@@
@msgTopLeftX1_S
X is %1 points from left
@@
@msgTopLeftY1_L
Top left Y is %1 points from top edge
@@
@msgTopLeftY1_S
Y is %1 points from top
@@
;for msgWidth1, %1=width of object in points
@msgWidth1
Width is %1 points
@@
;for msgWidth2, %1=width of object in points, %2 = width in units, and %3 = units used (msgInches or msgCentimeters.
@msgWidth2
Width is %1 points, or %2 %3.
@@
;for msgHeight1, %1=height of object in points
@msgHeight1
Height is %1 points
@@
;for msgHeight2, %1=height of object in points, %2 is height in units , and %3 = unit used.
@msgHeight2
Height is %1 points, or %2 %3.
@@
@msg95_L
menu
@@
@msg95_S
menu
@@
; supported or recognised embedded objects
; for msg97_L, %1=application ProgID.
@msg97_L
created by application with ProgID of %1
@@
@msgCategoryAxisTitle1_S
Category axis is %1
@@
@msgCategoryAxisTitle2_S
Category Axis is unlabeled
@@
; for msgValueAxisTitle1_L/S, %1=value axis title.
@msgValueAxisTitle1_S
Value axis is %1
@@
;for msgChartContainsSeriesDesc_L/S, %1=number of series and
;%2=series description, eg 5 lines
@msgChartContainsSeriesDesc1_S
%1 %2
@@
;for msgChartDescription_L/S, %1=chart description, %2=chart title or name
@msgChartDescription1_S
chart: %1
title: %2
@@
;for msgBrailleDlg1_L, %1=dialog title
@msgBrailleDlg1_L
%1 dlg
@@
;for msgBrailleDlgPage1_L, %1=dialog page name
@msgBrailleDlgPage1_L
%1 page
@@
;for msgBrailleGroupbox1_L, %1=groupbox name
@msgBrailleGroupbox1_L
%1 gb
@@
@msgBrailleSlide1_L
Slide:
@@

;END_OF_UNUSED_VARIABLES

endMessages
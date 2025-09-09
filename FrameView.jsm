const
; String Comparisons (constants with prefix sc)
;for create prompt dialog
sc1 = "Spoken Prompt",
sc3 = "Tutor",

;Keystrokes (constants with prefix ks)

; Window Names (constants with prefix wn)
wn_Prompt = "Prompt",
wn_FramesList = "Frames List",
wn_create_new_frame = "Create New Frame",
wn_Properties = "Properties",
wn_Validation = "Validation",
wn_Event = "Event",
;names of pages in properties dialog
sc_general = "General",
sc_rules = "Validation Rules",
sc_events = "Events",
sc_position = "Position",


;string compares
sc_1 = "configuration",
sc_2 = "script",
sc_3 = "spoken",
sc_4 = "displayed",


;UNUSED_VARIABLES

; Filenames (constants with prefix fn) 
fnJava="java", ; used in focusChangedEvent when a Java window is detected
fnAppScriptSet="FrameView", ; used in focus changed if a switchToScriptFile call fails

sc2 = "Braille",
sc_text = "text",
sc_Rule = "Rule",
wn_CreatePrompt = "Create Control Prompt",
wn_ModifyPrompt = "Modify Control Prompt",
wn_Create_Foundation_Rule = "Create Validation Rule",
wn_create_event_dialog = "Create Event",
wn_ModifyValidationRule = "Modify Balidation Rule",
						wn_ModifyEvent = "Modify Event",
wn_Modify_Validation_Text = "Modify Validation Text"

;END_OF_UNUSED_VARIABLES

              messages
@msgFrameViewer
Frame Viewer
@@
@msgFrameViewer_l
Title = Frame Viewer
@@
; for msgFrameTitle, %1 = the name of the active frame
@msgFrameTitle_l
FrameViewer %1 frame
@@
@msgFrameTitle_s
%1 frame
@@
;for msgWindowUp, %1 = the number of pixels the window has moved
@msgWindowUp_L
Window up %1 pixels
@@
@msgWindowUp_S
Up %1
@@
;for msgWindowDown, %1 = the number of pixels the window has moved
@msgWindowDown_L
Window down %1 pixels
@@
@msgWindowDown_S
Down %1
@@
;for msgWindowRight, %1 = the number of pixels the window has moved
@msgWindowRight_L
Window Right %1 pixels
@@
@msgWindowRight_S
Right %1
@@
;for msgWindowLeft, %1 = the number of pixels the window has moved
@msgWindowLeft_L
Window Left %1 pixels
@@
@msgWindowLeft_S
Left %1
@@
;for msgLeftEdgeLeft, %1 = the number of pixels the edge has moved
@msgLeftEdgeLeft
Left edge left %1 pixels
@@
;for msgLeftEdgeRight, %1 = the number of pixels the edge has moved
@msgLeftEdgeRight
Left edge right %1  pixels
@@
;for msgRightEdgeLeft, %1 = the number of pixels the edge has moved
@msgRightEdgeLeft
Right edge left %1  pixels
@@
;for msgRightEdgeRight, %1 = the number of pixels the edge has moved
@msgRightEdgeRight
Right edge right %1 pixels
@@
;for msgTopEdgeTUp, %1 = the number of pixels the edge has moved
@msgTopEdgeUp
Top edge up %1 pixels
@@
;for msgTopEdgeDown, %1 = the number of pixels the edge has moved
@msgTopEdgeDown
Top edge down %1 pixels
@@
;for msgBottomEdgeUp, %1 = the number of pixels the edge has moved
@msgBottomEdgeUp
Bottom edge up %1 pixels
@@
;for msgBottomEdgeDown, %1 = the number of pixels the edge has moved
@msgBottomEdgeDown
Bottom edge down %1 pixels
@@
@msgScreenSensitiveHelp2_L
Type in the label for the control as you would like it to be spoken.
@@
@msgScreenSensitiveHelp3_L
Select this button with SPACEBAR to continue.
@@
@msgScreenSensitiveHelp4_L
Select this button to discard changes and close this dialog. 
@@
@msgScreenSensitiveHelp5_L
Select this button with SPACEBAR to return to the previous page.
@@
@msgScreenSensitiveHelp6_L
Select this button with SPACEBAR to create the prompt using the labels you typed.
@@
@msgScreenSensitiveHelp7_L
Type in the label for the control as you would like it to display in Braille.
@@
@msgScreenSensitiveHelp8_L
Type in a helpful tip on using this control.
@@

@msgScreenSensitiveHelp9_L
Select this button with SPACEBAR to open a context menu
containing useful options such as Create New Frame, View Frames
List, Exit Frame Viewer, Save Changes, and Hide Titles.
Hiding frame titles is a temporary setting in effect only until
you close Frame Viewer.
The next time you open Frame Viewer, frame titles are displayed.
@@
@msgScreenSensitiveHelp10_L
Select this button with SPACEBAR to open the Frames List dialog.
Use the Frames List dialog to access inactive frames.
@@
@msgScreenSensitiveHelp11_L
Select this button with SPACEBAR for help.
@@
@msgScreenSensitiveHelp12_L
Select this button with SPACEBAR to exit Frame Viewer.
@@
;in Frames list dialog
@msgScreenSensitiveHelp13_L
This list box shows the frames in your application.
Press SPACEBAR to toggle the selected frame between
enabled and disabled.
Press ALT+P to open the selected frame's properties.
Press ALT+D to delete the selected frame.
@@
@msgScreenSensitiveHelp14_L
Use these radio buttons to determine if only active frames,
all application frames, or default frames are
displayed in the frames list.
All frames are now application frames. The default setting
is only for backward compatibility with frames created
in earlier versions of %product%.
@@
@msgScreenSensitiveHelp15_L
Select this button with SPACEBAR to move to the frame
selected in the frames list. You can only move to active frames.
@@
@msgScreenSensitiveHelp16_L
Select this button with SPACEBAR to delete the frame
currently selected in the frames list.
@@
@msgScreenSensitiveHelp17_L
Select this button with SPACEBAR to create a new frame.
@@
@msgScreenSensitiveHelp18_L
Select this button with SPACEBAR to open the properties for
the frame currently selected in the frames list.
@@
@msgScreenSensitiveHelp19_L
Select this button with SPACEBAR to enable or disable the
frame currently selected in the frames list.
@@
@msgScreenSensitiveHelp78_l
Select this button with SPACEBAR to exit the Frames list.
@@
;for help button in Frame viewer
@msgScreenSensitiveHelp20_L
Select this button to open help for Frame Viewer.
@@
;for properties general page
@msgScreenSensitiveHelp21_L
Use this edit field to change the name of the frame.
Frame names cannot contain spaces or symbols.
@@
@msgScreenSensitiveHelp22_L
The Synopsis field should contain a brief description
of the frame's purpose.
If a keystroke is assigned to a frame, the synopsis
information is accessible through Keyboard Help.
@@
@msgScreenSensitiveHelp23_L
This edit field contains the spoken prompt for frames
used to provide prompts for controls.
@@
@msgScreenSensitiveHelp24_L
This edit field contains the Braill prompt for frames
used to provide prompts for controls.
@@
@msgScreenSensitiveHelp25_L
Use this edit field to assign or modify a keyboard
command for reading a frame.
@@
@msgScreenSensitiveHelp26_L
The Description field should contain a detailed description
of the frame's purpose.
If a keystroke is assigned to a frame, the Description
information is accessible through Keyboard Help.
@@
@msgScreenSensitiveHelp27_L
Use this spin box to set the processing priority of your frames.
This is helpful when you have multiple frames working together
as you can set relative priorities for how they are processed.
@@
;for rules page in properties dialog
@msgScreenSensitiveHelp28_L
This list box lists the rules used to determine when the frame is active.
The rules compare information from your application with
information specified when the frame was created.
The order in which rules are listed is the
order in which they are processed.
To toggle the selected rule on or off, press SPACEBAR.
To modify the selected rule, press ALT+ENTER.
To move the selected rule up in the list, press ALT+UP ARROW.
To move the selected rule down in the list, press ALT+DOWN ARROW.
@@
@msgScreenSensitiveHelp29_L
Select this button with SPACEBAR to move the
selected rule up in the list.
@@
@msgScreenSensitiveHelp30_L
Select this button with SPACEBAR to move the
selected rule down in the list.
@@
@msgScreenSensitiveHelp31_L
Select this button with SPACEBAR to delete the rule currently selected in 
the list.
@@
@msgScreenSensitiveHelp32_L
Select this button with SPACEBAR to add a new Validation Rule.
@@
@msgScreenSensitiveHelp33_L
Select this button with SPACEBAR to modify the rule currently selected in 
the list.
@@

@msgScreenSensitiveHelp34_L
This list specifies what your frame will do, and what system activity causes it to do it.
Events are things that happen in the application.
Actions are assigned to them in this dialog so they will take place whenever the event occurs.
The order in which events are listed is the order in which they will take place.
To create an event, press F2.
To modify the selected event, press ALT+ENTER.
To toggle the selected event on or off, press SPACEBAR.
To move the selected event up in the list, press ALT+UP ARROW.
To move the selected event down in the list, press ALT+DOWN ARROW.
@@
@msgScreenSensitiveHelp35_L
Select this button with SPACEBAR to move the selected event up in the list.
@@
@msgScreenSensitiveHelp36_L
Select this button with SPACEBAR to move the selected event down in the list.
@@
@msgScreenSensitiveHelp37_L
This edit field specifies the frame's distance from the left side of the window or screen.
@@
@msgScreenSensitiveHelp38_L
This edit field specifies the width of the frame.
@@
@msgScreenSensitiveHelp39_L
This edit field specifies the frame's distance from the right side of the window or screen.
@@
@msgScreenSensitiveHelp40_L
This edit field specifies the frame's distance from the top of the window or screen.
@@
@msgScreenSensitiveHelp41_L
This edit field specifies the height of the frame.
@@
@msgScreenSensitiveHelp42_L
This edit field specifies the frame's distance from the bottom of the window or screen.
@@
@msgScreenSensitiveHelp43_L
These radio buttons determine if the frame's position is measured from the left or from the right side of the window or screen.
@@
@msgScreenSensitiveHelp44_L
These radio buttons determine if the frame's position is measured from the top or from the bottom of the window or screen.
@@
@msgScreenSensitiveHelp45_L
These radio buttons determine if the frame's position is measured relative to the window or to the screen.
When the position is measured relative to the window, this is more specific to the location of the frame, and usually makes the frame more reliable.
If set to screen, if a window containing a frame is repositioned, maximized, or restored, this can cause the frame to become invalid.
@@
@msgScreenSensitiveHelp46_L
If you check this check box and then change your DPI (dots per inch) 
setting by changing from small to large fonts, the frame will become inactive.
If you need a frame to work under multiple DPI settings, create the frame multiple times, 
under each DPI setting, and check this check box in each instance of the frame. 
The DPI value to which the frame is locked is based on the DPI at the time the frame is created, 
not the DPI value at the time the check box is checked.
@@
;for add Validation Rule Dialogs
@msgScreenSensitiveHelp47_L
Select the type of information (found in your application) that is to be used by this Validation Rule. This information is used to determine when your frame is active, so information that does not change generally makes your frame more reliable.
@@
@msgScreenSensitiveHelp48_L
Select the type of comparison to make between the information from your application and the value or values you specify.
The type of comparison you select depends on how you intend to use your frame. For example, you might wish to select Is if you only want your frame available in one or two areas of your application, but you might wish to select Is Not if you want your frame active in all areas of your application except one or two.
@@
@msgScreenSensitiveHelp49_L
Select this button to remove the selected item from the listed values.
That value will no longer be compared to the information within your application.
@@
@msgScreenSensitiveHelp50_L
Type the value to be compared to the type of information you selected.
You can add multiple values and they are each compared to the information from your application.
@@
@msgScreenSensitiveHelp51_L
This list box lists the values that have been added for comparison.
Each value listed is compared with the information from your application.
@@
@msgScreenSensitiveHelp74_l
Select this button to edit the comparison value selected in the list.
This changes the information that is compared to your application when you use your frame.
@@
@msgScreenSensitiveHelpFinishRule_L
Select this button when you have finished setting up your Validation Rule.
@@
;for Modify Validation Text dialog
@msgScreenSensitiveHelp75_l
Edit the comparison value or type in a new value.
@@
@msgScreenSensitiveHelp76_l
Select this button to accept changes you have made to the comparison value.
@@
@msgScreenSensitiveHelp77_l
Select this button to discard changes you have made to the comparison value.
@@
                           ;for add event dialog in the Frames list properties dialog
@msgScreenSensitiveHelp52_L
Select the event that will initiate the associated action.
The event is something that happens in your application,
and each time it happens, the associated action takes place.
@@
@msgScreenSensitiveHelp53_L
Select the action that will take place each time the event occurs.
@@
@msgScreenSensitiveHelp54_L
Select the voice that will be used to speak this information.
@@
@msgScreenSensitiveHelp55_L
Type in the text that is to be spoken.
@@
@msgScreenSensitiveHelp56_L
Use this series of radio buttons to specify what type of sound is to be played.
@@
@msgScreenSensitiveHelp57_L
Specify the frame that is to be used with the event action you have selected.
@@
@msgScreenSensitiveHelp58_L
If this check box is checked, the information for the control with focus
is sent to your Braille display with the other information you specify.
@@
@msgScreenSensitiveHelp59_L
Type the text to be displayed on your Braille display.
@@
@msgScreenSensitiveHelp60_L
Select the script functions that will provide information for your formatted message that is to be Brailled or spoken.
@@
@msgScreenSensitiveHelp61_L
Select this button to insert the selected script function into your string.
@@
@msgScreenSensitiveHelp62_L
Select the title of the window you wish to use with your event action.
@@
@msgScreenSensitiveHelp63_L
Specify the control ID of the window you wish to use with your event action.
@@
@msgScreenSensitiveHelp64_L
Select the application configuration files you wish to load.
@@
@msgScreenSensitiveHelp65_L
Type in the full path and file name for the sound file you wish to use.
@@
@msgScreenSensitiveHelp66_L
Select this button to browse for the sound file you wish to use.
@@
@msgScreenSensitiveHelp67_L
Select the script that will run each time this event occurs.
@@
@msgScreenSensitiveHelp68_L
Type the tutor message you wish to have spoken.
@@
@msgScreenSensitiveHelpFinishEvent_L
Select this button to finish creation of your event.
@@
@msgScreenSensitiveHelpDeleteEvent_L
Select this button with SPACEBAR to delete the event currently selected in 
the list.
@@
@msgScreenSensitiveHelpAddEvent_L
Select this button with SPACEBAR to add a new event.
@@
@msgScreenSensitiveHelpModifyEvent_L
Select this button with SPACEBAR to modify the event currently selected in 
the list.
@@
@msgScreenSensitiveHelpFrame_L
to read the text within this frame, use Say All.
To open frame properties, press ALT+ENTER.
To open a context menu with options for working with this frame, press the APPLICATIONS key.
To move between frames, press TAB.
To save changes to all frames, press CTRL+S.
To delete this frame, press DELETE. 
To exit Frame Viewer, press ESC. 
@@
;for create new frame dialog 
@msgScreenSensitiveHelp69_L
Type in a name for your frame.
You cannot use spaces or symbols.
@@
@msgScreenSensitiveHelp70_L
Type a brief description of your frame's purpose.
If you assign a keystroke to your frame, this information is available in Keyboard Help
and can be very useful to someone using your frame.
@@
@msgScreenSensitiveHelp71_L
Type a detailed description of your frame's purpose.
If you assign a keystroke to your frame, this information
is available in Keyboard Help and can be very useful to someone using your frame.
@@
@msgScreenSensitiveHelp72_L
Use this series of radio buttons to specify how information in your frame is echoed.
Set your frame to echo all newly displayed text, only highlighted text, or no text.
@@
@msgScreenSensitiveHelp73_L
Select this button to create your frame.
@@
@msgNotAvailable_l
Not Available in Frame Viewer.
@@
@msgNext_BTN_Text
Next >
@@
@msgBack_BTN_Text
< Back
@@
@msgScreenSensitiveHelp79_l
The check boxes in this dialog allow you to select attributes for text  which activates this 
event. Only text with the specified attributes is  considered to be a match.
@@
@msgScreenSensitiveHelp84_l
Use this group of radio buttons to specify whether this event occurs  when the frame has focus, 
when it does not have focus, or always.
@@
@msgScreenSensitiveHelp85_l
This field allows you to specify specific text to search for, and only  text matching the search 
string activates the event.
@@
@msgScreenSensitiveHelp86_l
Select a foreground color for text that activates this event. Use Up or  DOWN ARROW to select a 
color, or type one or more letters then press  DOWN ARROW to jump to a specific color in the 
list.
           @@
@msgScreenSensitiveHelp87_l
Select a background color for text that activates this event. Use Up or  DOWN ARROW to select a 
color, or type one or more letters then press  DOWN ARROW to jump to a specific color in the 
list.
@@
@msgScreenSensitiveHelp88_l
Select this button to specify that only new text which has the same  color as the text at the 
mouse location activates this event. The JAWS  Cursor should be placed on the text whose colors 
you want to use before  starting Frame Viewer.
@@
@msgScreenSensitiveHelp89_l
Type the name of the script event to run. This script event must be in  the application script 
file, and must accept the same number of  parameters as the default script for this event. For 
example, if the  frame event is On Focus, then the script event must accept the same  parameters 
as FocusChangedEvent. If the frame event is On Text, the  script event must accept the same 
parameters as NewTextEvent.
@@
@msgScreenSensitiveHelp90_l
   Type in the text that is to be displayed.
@@
@msgScreenSensitiveHelp91_l
	   Select this button with SPACEBAR to add another action to this same event.
@@


;UNUSED_VARIABLES

@msgAppStart_L
For screen sensitive help with Frame Viewer press %KeyFor(ScreenSensitiveHelp).
@@
@msgAppStart_s
screen sensitive help for Frame Viewer %KeyFor(ScreenSensitiveHelp).
@@
@msgExtendedHelp_L
To hear the Help Topic for Frame Viewer Press %keyFor(screenSensitiveHelp) twice quickly. 
@@
@msgExtendedHelp_S
Help Topic for Frame Viewer %keyFor(screenSensitiveHelp) twice quickly
@@
@msgToolbarListError1_l
You must exit the current dialog in order to access the toolbar.
@@
@msgToolbarListError1_S
exit current dialog to access toolbar
@@
@msgToolbarListError2_l
Toolbar not found
@@
@msgToolbarListError2_S
not found
@@
@msgToolbarListDialogTitle
Select a Toolbar Button
@@

;END_OF_UNUSED_VARIABLES

EndMessages
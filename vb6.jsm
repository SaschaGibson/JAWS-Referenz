; Build 3.71.05.001
; JAWS 3.7 Script Messages for Microsoft Visual Basic 6.0
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Written by Joseph K Stephen
; Build vb3710533 Last modified on 6 October 2000
const
;string compares
scComma=",",
scZero="0",
scTab = "\t",
scToolboxHelper ="toolboxHelper",
scToolUnlabeled="Graphic",
;Window Names
wn_vbaToolbox="Toolbox",
wn_newProject="New Project",
wn_ObjectBrowser="Object Browser",
wn_watch="Watch",
wn_immediate="Immediate",
wn_locals="Locals",
wn_properties="Properties",
wn_menuEditor="Menu Editor",
wn_formLayout="Form Layout",
wn_wizardManager="Wizard Manager",
wn_wizard="Wizard",
wn_AppWizIntro="Introduction",
wn_AppWizInterfaceType="Interface Type",
wn_appWizMenus="Menus",
wn_appWizToolbarCustomize="Customize Toolbar",
wn_appWizResources="Resources",
wn_appWizInet="Internet Connectivity",
wn_appWizStandardForms="Standard Forms",
wn_appWizDataAccess="Data Access Forms",
wn_appWizFinished="Finished!",
wn_existing="Existing" ; Existing page of New Project Multipage Dialog not detected automatically

messages
;for msgVBE1_L, %1=name of host application whose VBA Environment is active
@msgVBE1_L
%1 Visual Basic Environment
@@
@msgVB1_L
Visual Basic 6 Integrated Development Environment
@@
@msgNoControlSelected1_L
no control selected.
@@
@msgNoControlsOnForm1_L
no controls on form
@@
@msgSelectControl1_L
Select Control
@@
@msgAppRunning1_L
The application is running in the IDE. Use Alt+f4 to close it and return to the IDE.
@@
@msgPropertiesAndMethodsList1_L
Properties and Methods
@@
@msgConstantsList1_L
Constants
@@
@msgNoHelpTip1_L
No Help Tip
@@
@msgObjectsCombo1
Objects
@@
@msgMembersCombo1
Members
@@
;for msgMembers1_L/S, %1=number of members defined, %2=module name
@msgMembers1_L
There are %1 Members defined in %2.
@@
@msgMembers1_S
%1 Members in %2
@@
;for msgLinesOfCodeInTotal1_L/S, %1=number of code lines in module
@msgLinesOfCodeInTotal1_L
 There are %1 lines of code in total.
@@
@msgLinesOfCodeInTotal1_S
 %1 lines of code
@@
@msgToolboxVisible1_L
The ToolBox is visible.
@@
@msgToolboxNotVisible1_L
The Toolbox is not visible.
@@
@msgPropertyWindowVisible1_L
The Property Window is visible.
@@
@msgWindowClosed1_L
Window closed.
@@
;for msgWindowNotClosed1_L, %1=window name
@msgWindowNotClosed1_L
%1 did not close.
@@
;for msgHasBeenModified1_L/S, %1=project or component name
@msgHasBeenModified1_L
%1 has been modified since it was last saved.
@@
@msgHasBeenModified1_S
%1 modified
@@
;for msgProjSummaryWindows1_L/S, %1=number of visible windows
@msgProjSummaryWindows1_L
There are %1 windows visible:
@@
@msgProjSummaryWindows1_S
%1 windows:
@@
;for msgProjSummaryComponents1_L/S, %1=number of components in project
@msgProjSummaryComponents1_L
There are %1 components:
@@
@msgProjSummaryComponents1_S
%1 components:
@@
;for msgProjSummaryRefs1_L/S, %1=number of referenced libraries in project
@msgProjSummaryRefs1_L
There are %1 referenced libraries:
@@
@msgProjSummaryRefs1_S
%1 referenced libraries:
@@
;for msgProjSummaryAddins1_L/S, %1=number of addins in project
@msgProjSummaryAddins1_L
There are %1 AddIns:
@@
@msgProjSummaryAddins1_S
%1 AddIns:
@@
@msgNoComponentProperties1_L
no component properties
@@
@msgNoComponentProperties1_S
no properties
@@
;for msgComponentDescription1_L/S, %1=component name, %2=component description,
;%3=designer class ID
@msgComponentDescription1_L
%1 %2 has an open designer with class %3.
@@
@msgComponentDescription1_S
%1 %2 has designer class %3
@@
;for msgComponentProperties1_L/S, %1=number of properties
@msgComponentProperties1_L
There are %1 properties:
@@
@msgComponentProperties1_S
%1 properties:
@@
;for msgProperty1_L, %1=property name, %2=property value
@msgProperty1_L
%1=%2
@@
;for msgIndexedItem1_L, %1=index number, %2=item name
@msgIndexedItem1_L
%1: %2
@@
;for msgIndexedItem2_L, %1=index number, %2=item name, %3=item description
@msgIndexedItem2_L
%1: %2, %3
@@
@msgForm1_L
form
@@
;for msgAddedToForm1_L, %1=name of control being added
@msgAddedToForm1_L
%1 control added to form.
@@
@msgMSFormsControls1_L
MSForms Controls
@@
@msgVBControls1_L
VB Controls
@@
@msgReadWholeCodeLineOff1_S
Visible Line
@@
@msgReadWholeCodeLineOn1_S
Whole Line
@@
@msgAlertOverlapOff1_S
Off
@@
@msgAlertOverlapOn1_S
On
@@
@msgOpenProfile1_L
Open Profile
@@
@msgSaveProfile1_L
Save Profile
@@
@msgTopLevelMenuAdd1_L
Add Top Level Menu
@@
@msgTopLevelMenuDel1_L
Delete Top Level Menu
@@
@msgTopLevelMenuUp1_L
Move Top Level Menu Up
@@
@msgTopLevelMenuDown1_L
Move Top Level Menu Down
@@
@msgSubmenuAdd1_L
Add SubMenu
@@
@msgSubMenuDel1_L
Delete SubMenu
@@
@msgSubmenuUp1_L
Move SubMenu Up
@@
@msgSubmenuDown1_L
Move SubMenu Down
@@
;for msgMenuLevel1_L/S, %1=menu level (used in menu editor to speak menu hierarchy)
@msgMenuLevel1_L
level %1
@@
; control dimensions and location
;for msgControlDimensions1_L, %1=control name, %2=width, %3=height
@msgControlDimensions1
%1: %2 wide by %3 high
@@
;for msgWide1_L, %1=control width
@msgWide1_L
%1 wide
@@
;for msgHigh1_L, %1=control height
@msgHigh1_L
%1 high.
@@
;for msgLineColumn1_L/S, %1=line number, %2=column number
@msgLineColumn1_L
line %1 column %2
@@
@msgLineColumn1_S
line %1 col %2
@@
;for msgIsContainedWithin1_L/S, %1=control name, %2=control container name
@msgIsContainedWithin1_L
 %1 is contained within %2
@@
@msgIsContainedWithin1_S
%1 is contained in %2
@@
;for next section, %1=control name, %2=name of control which is overlapped
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
;end of section
@msgAnd1_L
and
@@
@msgFirstControl1_L
First control
@@
@msgLastControl1_L
last control
@@
;for msgDeclarationLines1_L/S, %1=number of declaration lines in module
@msgDeclarationLines1_L
 There are %1 declaration lines.
@@
@msgDeclarationLines1_S
 %1 declaration lines
@@
                                                                       @msgCompleted1_L
completed
@@
@msgSelectWindow1_L
Select Window
@@
; Screen Sensitive Help
@msgNewProjectHelp1_L
This is the New Project MultiPage Dialog.
Use Control+Tab to switch between the pages.
Select the type of project and press Enter.
@@
@msgNewProjectHelp1_S
New Project MultiPage Dialog
Use Control Tab to switch between pages
Select type of project and press Enter
@@
@msgWarning1_L
Warning, The application object is currently unavailable.
This may be because the Environment is not in Design mode.
Ensure that you are in Design Mode and try switching away from and back to the Environment.
While the application object is unavailable, many object model related functions and help will be unavailable.
@@
@msgWarning1_S
Warning! application object unavailable
@@
@msgToolsPaletteHelp1_L
This is the Toolbox.
Ensure the JAWS cursor is activated when navigating this window.
Use the arrows to select a tool and press Enter to place it on the form.
@@
@msgToolsPaletteHelp1_S
Toolbox
Ensure JAWS cursor is active
Use arrows to select tool and press Enter to place it on form
@@
@msgProjectWindowHelp1_L
This is the Project Window.
It contains a Tree View which gives you access to components in the project such as forms, designers etc.
For instructions on how to open or switch to these windows use %keyFor(hotkeyHelp).
@@
@msgProjectWindowHelp1_S
Project Window Treeview
@@
@msgMainWindowHelp1_L
This is the main window.
It contains other windows such as the Form Designer, Code Window, Property Window, etc.
For instructions on how to open or switch to these windows use %keyFor(hotkeyHelp).
@@
@msgMainWindowHelp1_S
main window
@@
;for msgCodeWindowHelp1_L/S, %1=view description
;eg Module View or Procedure View
@msgCodeWindowHelp1_L
This is the code window.
Program code is entered and edited here.
The window is in %1.
@@
@msgCodeWindowHelp1_S
code window
%1
@@
;for msgCodeWindowHelp2_L/S, %1=start line number, %2=end line number
;of visible portion of code
@msgCodeWindowHelp2_L
Lines %1 through %2 are visible.
@@
@msgCodeWindowHelp2_S
Lines %1 through %2 visible.
@@
;for msgCodeWindowHelp3_L/S, %1=procedure name, %2=number of lines in procedure
@msgCodeWindowHelp3_L
The cursor is in procedure %1
There are %2 lines in %1.
@@
@msgCodeWindowHelp3_S
%1
%2 lines in %1
@@
@msgCodeWindowHelp4_L
For Code Window hotkey help use %KeyFor(hotKeyHelp).
@@
@msgCodeWindowHelp4_S
hotkey help %KeyFor(hotKeyHelp)
@@
@msgCodeWindowHelp5_L
This is the Objects comboBox.
select the object for which you want a code skeleton generated using up and down arrows.
To move to the Members comboBox, press Tab.
To return to the Code Window, press Escape.
@@
@msgCodeWindowHelp5_S
Objects comboBox
@@
@msgCodeWindowHelp6_L
This is the Members ComboBox.
Select the member designating which event or method skeleton to generate for the selected object using up and down arrows.
To insert the member skeleton, press Enter.
The code will be inserted after the current procedure and the cursor will be placed on the first line.
To return to the Object ComboBox, press Shift Tab.
To return to the Code Window without creating a code skeleton, press Escape.
@@
@msgCodeWindowHelp6_S
Members ComboBox
@@
;for msgDesignerWindowHelp1_L/S, %1=designer type eg MSForm, VBForm etc
@msgDesignerWindowHelp1_L
This is the designer window.
It contains a %1 on which you place controls that define the interface.
You can move and size controls or use the Properties Window to set properties.
@@
@msgDesignerWindowHelp1_S
designer window
%1
@@
;for msgDesignerWindowHelp2_L/S, %1=number of controls on designer form
@msgDesignerWindowHelp2_L
There are %1 controls on the form.
@@
@msgDesignerWindowHelp2_S
%1 controls on form
@@
; note not parametarized as may be many controls selected.
@msgDesignerWindowHelp3_L
The selected controls are:
@@
@msgDesignerWindowHelp3_S
selected controls:
@@
@msgDesignerWindowHelp4_L
This means that the control visually overlaps other objects and you must move it if this is not desired.
@@
@msgDesignerWindowHelp4_S
This means that the control visually overlaps other objects and you must move it if this is not desired.
@@
@msgDesignerWindowHelp5_L
For Designer Window hotkey help use %KeyFor(hotkeyHelp).
@@
@msgDesignerWindowHelp5_S
hotkey help %KeyFor(hotkeyHelp)
@@
;for msgDesignerWindowHelp6_L/S, %1=number of menu items
@msgDesignerWindowHelp6_L
The form contains a menu with %1 menu items.
@@
@msgDesignerWindowHelp6_S
form contains menu with %1 items
@@
@msgInAccessibleDesignerHelp1_L
This is an inaccessible Designer
%product% cannot track objects in this window.
Use the properties window to set properties for this designer.
@@
@msgInAccessibleDesignerHelp1_S
inaccessible Designer
%product% cannot track objects in this window
Use properties window to set properties
@@
@msgActiveXDesignerHelp1_L
This is an Active X Designer.
@@
@msgActiveXDesignerHelp1_S
Active X Designer
@@
@msgAddinDesigner1_L
This is the Addin Designer
Use control tab to move between the two property sheets.
@@
@msgAddinDesigner1_S
Addin Designer
control tab to move between property sheets
@@
@msgDataReportDesignerHelp1_L
This is the Data Report Designer.
%product% cannot track objects in this window.
Use the properties window to set properties for this designer.
@@
@msgDataReportDesignerHelp1_S
Data Report Designer
%product% cannot track objects in this window
Use properties window to set properties
@@
@msgObjBrowserHelp1_L
This is the libraries comboBox of the Object Browser.
Select the library you wish to browse using the up and down arrows and press Enter.
Press Tab and Shift+Tab to move between the various controls.
@@
@msgObjBrowserHelp1_S
libraries comboBox
@@
@msgObjBrowserHelp2_L
This is the search editCombo of the Object Browser.
Type in the prefix of the desired clas or member and press Enter.
Press Tab and Shift+Tab to move between the various controls.
@@
@msgObjBrowserHelp2_S
search editCombo
@@
@msgObjBrowserHelp3_L
This is the Classes Listbox of the Object Browser.
It contains the list of classes in the selected library.
Select the class you want to browse using the up and down arrows.
Press Tab and Shift+Tab to move between the various controls.
@@
@msgObjBrowserHelp3_S
Classes Listbox
@@
@msgObjBrowserHelp4_L
This is the Members Listbox of the Object Browser.
It contains the members of the selected class.
Select the Member whose definition you want to review using the up and down arrows.
Press Tab and Shift+Tab to move between the various controls.
@@
@msgObjBrowserHelp4_S
Members Listbox
@@
@msgObjBrowserHelp5_L
This is the definition window of the Object Browser.
It contains the definition of the selected member.
You can copy and paste this definition using the standard Windows keys for Copy and Paste.
@@
@msgObjBrowserHelp5_S
definition readOnlyEdit window
@@
@msgImmediateWindowHelp1_L
This is the Immediate Window
You can query variables and execute statements to get immediate results.
@@
@msgImmediateWindowHelp1_S
Immediate Window
You can query variables and execute statements to get immediate results.
@@
@msgWatchWindowHelp1_L
This is the Watch Window
@@
@msgWatchWindowHelp1_S
Watch Window
@@
@msgLocalsWindowHelp1_L
This is the Locals Window
@@
; Properties Window Help
@msgLocalsWindowHelp1_S
Locals Window
@@
@msgPropertiesWindowHelp1_L
This is the listbox of properties for the selected object.
Select the property you wish to change using up and down arrows and tab to the next control to set its value.
Press Tab and Shift Tab to move between the controls.
@@
@msgPropertiesWindowHelp1_S
properties listbox
@@
@msgPropertiesWindowHelp2_L
This is the Property Value edit control.
Enter the value for the selected property.
Press Tab and Shift Tab to move between the controls.
@@
@msgPropertiesWindowHelp2_S
Property Value edit control
@@
@msgPropertiesWindowHelp3_L
This is the Object ComboBox.
Choose the object you wish to set properties for using up and down arrows.
Press Tab and Shift Tab to move between the controls.
@@
@msgPropertiesWindowHelp3_S
Object comboBox
@@
@msgPropertiesWindowHelp4_L
This is the Property Order TabControl.
Select the tab which defines the order in which you want the properties sorted.
Press Tab and Shift Tab to move between the controls.
@@
@msgPropertiesWindowHelp4_S
Property Order TabControl
@@
@msgMenuEditorHelp1_L
This is the Menu Editor.
@@
@msgMenuEditorHelp2_L
Enter the text to appear on the Menu Item. Use an & sign to designate an Accelerator Key.
@@
@msgMenuEditorHelp3_L
Enter the name to be used to reference this item from program code.
@@
@msgMenuEditorHelp4_L
The Index value determines the position of the item in the Menu Array.
@@
@msgMenuEditorHelp5_L
Choose a Shortcut Key from this Combo to activate this item from your Application.
@@
@msgMenuEditorHelp6_L
The Help Context ID determines which help topic to load when Help is invoked for this Menu Item from your Application.
@@
@msgMenuEditorHelp7_L
Choose a Negotiation Method for determining what happens when trying to display menu items when the screen is cluttered.
@@
@msgMenuEditorHelp8_L
This Checkbox determines if the menu item is enabled (ie accessable) by default.
@@
@msgMenuEditorHelp9_L
This Checkbox determines if this menu item is visible by default.
@@
@msgMenuEditorHelp10_L
This Checkbox determines if this menu item is to be replaced by a Window List, for example in a Multiple Document Interface.
@@
@msgMenuEditorHelp11_L
This button moves the menu item one level higher in a menu hierarchy.
@@
@msgMenuEditorHelp12_L
This button moves the menu item one level lower in a menu hierarchy.
@@
@msgMenuEditorHelp13_L
This button moves the menu item up a position in the menu.
@@
@msgMenuEditorHelp14_L
This button moves the menu item down a position in the menu.
@@
@msgMenuEditorHelp15_L
This button selects the next menu item so you can change its properties. It is equivalent to moving to the listbox and arrowing down an item.
@@
@msgMenuEditorHelp16_L
This button inserts a menu item at the current position in the menu hierarchy.
@@
@msgMenuEditorHelp17_L
This button deletes the current menu item.
@@
@msgMenuEditorHelp18_L
This is the list of all menu items defined so far. An indented item indicates that the item is part of a submenu.
@@
@msgMenuEditorHelp19_L
This button saves your Menu design and closes the Menu Editor
@@
@msgMenuEditorHelp20_L
This button closes the Menu Editor without saving changes to your Menu design.
@@
@msgFormLayoutHelp1_L
This is the Form Layout window.
This view shows all forms in the project and allows the user to position each form relative to one another.
This view is inaccessible with %product%.
@@
@msgFormLayoutHelp1_S
Form Layout window
This view is inaccessible with %product%.
@@
;for msgWizHlp1_L/S, %1=wizard screen title
@msgWizHlp1_L
This is the %1 screen.
Use the JAWS cursor to read the Wizard text.
Use Tab and Shift Tab to move between the controls to make selections.
@@
@msgWizHlp1_S
%1
Use JAWS cursor to read Wizard text
Use Tab and Shift Tab to move between controls
@@
@msgWizTmpMoveAllStepsOffScreen1_L
Move All Steps Off Screen
@@
@msgWizTmpAddStep1_L
Add Step
@@
@msgWizTmpInsertStep1_L
Insert Step
@@
@msgWizTmpRefreshListOfSteps1_L
Refresh List Of Steps
@@
@msgWizTmpMoveStepDown1_L
Move Step Down
@@
@msgWizTmpMoveStepUp1_L
Move Step Up
@@
; Hotkey Help
@msgHelp1_L
To select a toolbox control and place it on the form use  %KeyFor(SelectToolboxControl).
To move between controls on a form use Tab and Shift+Tab
@@
@msgHelp1_S
select toolbox control %KeyFor(SelectToolboxControl)
move between controls on form Tab and Shift+Tab
@@
@msgHelp2_L
You can also use the navigation arrows provided controls do not overlap.
To move the selected control one grid unit or pixel at a time in the given direction use control plus up, down, left or right arrow keys.
To size the selected control use shift plus up, down, left or right arrow keys.
To set focus on the Tool Window use  %KeyFor(setFocusOnToolWindow).
@@
@msgHelp2_S
You can also use the navigation arrows provided controls do not overlap.
move selected control one grid unit or pixel control plus up, down, left or right
size selected control shift plus up, down, left or right
set focus on Tool Window %KeyFor(setFocusOnToolWindow)
@@
@msgHelp3_L
To move to the first control use  %KeyFor(topOfFile).
To move to the lasst control use  %KeyFor(bottomOfFile).
To select any control on the form and set focus on it use  %KeyFor(SetFocusTOFormControl).
To move the selected control one pixel at a time in the given direction use control+up, down, left or right arrow
To move the selected control by a larger amount use Alt+Shift+up, down, left or right arrow
@@
@msgHelp3_S
move to first control  %KeyFor(topOfFile)
move to lasst control  %KeyFor(bottomOfFile)
select control on form %KeyFor(SetFocusTOFormControl)
move selected control one pixel at a time control+up, down, left or right
move selected control by larger amount Alt+Shift+up, down, left or right
@@
@msgHelp4_L
To bring the selected control to the front when it is overlapped by other controls use Control+J.
To send the selected control to the back use Control+K.
@@
@msgHelp4_S
bring selected control to front Control+J
send selected control to back Control+K
@@
@msgHelp5_L
To move to the prior or next procedure use control+up or down arrow
To activate Auto Complete use Control+SpaceBar
then use arrows to select the correct property, method or constant and press Tab to complete the statement.
To activate the Properties and Methods list use  %KeyFor(ActivatePropertiesAndMethodsList).
To activate the Constants list use Control+Shift+J
To set focus to the Objects or Members Combo use Control+F2 and Tab between the two combo boxes.
To hear Quick Info use Control+I
To hear Parameter Info use Control+Shift+I
To Find Next use Shift+F4
To Find Previous use Shift+F3
To indent or remove indent use Tab and Shift+Tab
To insert a blank line above the current line use Control+N
To get Context Sensitive Help use F1
To set or remove a BreakPoint use F9
To clear all BreakPoints use Control+Shift+F9
To run an application or continue if in Break Mode use F5
To execute code a line at a time use F8
To execute code a procedure at a time use Shift+F8
To run to Cursor use Control+F8
To stop running an application use Control+Break
To restart an application from the beginning use Shift+F5
To run the Error Handler use Alt+F5
To step into the Error Handler use Alt+F8
To View Definition use Shift+F2
To go to last position use Control+Shift+F2
To switch panes when the window is split use F6
@@
@msgHelp5_S
move to prior or next procedure control+up or down arrow
activate Auto Complete Control+SpaceBar
then arrows to select the correct property, method or constant and press Tab to complete the statement
activate Properties and Methods list  %KeyFor(ActivatePropertiesAndMethodsList)
activate Constants list Control+Shift+J
set focus to Objects or Members Combo Control+F2 and Tab between the two combo boxes
hear Quick Info Control+I
hear Parameter Info Control+Shift+I
Find Next Shift+F4
Find Previous Shift+F3
indent or remove indent Tab and Shift+Tab
insert a blank line above the current line Control+N
get Context Sensitive Help F1
set or remove a BreakPoint F9
clear all BreakPoints Control+Shift+F9
run an application or continue if in Break Mode F5
execute code a line at a time F8
execute code a procedure at a time Shift+F8
run to Cursor Control+F8
stop running an application Control+Break
restart an application from the beginning Shift+F5
run the Error Handler Alt+F5
step into the Error Handler Alt+F8
View Definition Shift+F2
go to last position Control+Shift+F2
switch panes when the window is split F6
@@
@msgHelp6_L
To display the Call Stack Dialog in Break mode use Control+L
To run selected line of code use Enter
To Insert a Carriage Return use Control+Enter
To switch between the Immediate and Watch window (if visible) use F6
@@
@msgHelp6_S
display the Call Stack Dialog in Break mode Control+L
run selected line of code Enter
Insert a Carriage Return Control+Enter
switch between the Immediate and Watch window (if visible) F6
@@
@msgHelp7_L
To display the Watch Expression use Shift+Enter
To display the Edit Watch Dialog use Control+W
To expand or collapse the Watch value use Enter
@@
@msgHelp7_S
display the Watch Expression Shift+Enter
display the Edit Watch Dialog Control+W
expand or collapse the Watch value Enter
@@
@msgHelp8_L
To set focus on a selected window use  %KeyFor(setFocusOnWindow).
To speak extra information about the current context use  %KeyFor(SayContextInfo).
Press this keystroke twice quickly to hear the values of the component's properties.
For a summary of the current project use  %KeyFor(summarizeOpenProject).
@@
@msgHelp8_S
set focus on selected window %KeyFor(setFocusOnWindow)
speak extra information about current context %KeyFor(SayContextInfo)
Press keystroke twice quickly to hear the values of the component's properties
summary of current project use  %KeyFor(summarizeOpenProject)
@@
@msgHelp9_L
To display the Project Explorer use Control+R
@@
@msgHelp9_S
display Project Explorer Control+R
@@
@msgHelp10_L
To Display the immediate window use Control+G
@@
@msgHelp10_S
Display immediate window Control+G
@@
@msgHelp11_L
To Display the properties window use F4
@@
@msgHelp11_S
Display properties window F4
@@
@msgHelp12_L
To Display the code window use F7
@@
@msgHelp12_S
Display code window F7
@@
@msgHelp13_L
To Display the designer window use Shift+F7
@@
@msgHelp13_S
Display designer window Shift+F7
@@
@msgHelp14_L
To Display the object browser use F2
@@
@msgHelp14_S
Display object browser F2
@@
@msgHelp15_L
To close the active window without closing associated windows use  %KeyFor(closeActiveWindow).
@@
@msgHelp15_S
close active window without closing associated windows %KeyFor(closeActiveWindow)
@@
@msgHelp16_L
To move between controls on a form use Tab and Shift+Tab
To Display the immediate window use Control+G
To Display the properties window use F4
To Display the code window use F7
To Display the designer window use Shift+F7
To Display the object browser use F2
To display the Project Explorer use Control+R
@@
@msgHelp16_S
move between controls on form Tab and Shift+Tab
Display immediate window Control+G
Display properties window F4
Display code window F7
Display designer window Shift+F7
Display object browser F2
display Project Explorer Control+R
@@
@msgHelp17_L
To move the selected control one grid unit or pixel at a time in the given direction use control plus up, down, left or right arrow keys.
To size the selected control use shift plus up, down, left or right arrow keys.
@@
@msgHelp17_S
move selected control one grid unit or pixel control plus up, down, left or right
size selected control shift plus up, down, left or right
@@
@msgHelp18_L
To move to the prior or next procedure use control+up or down arrow
To activate Auto Complete use Control+SpaceBar
then use arrows to select the correct property, method or constant and press Tab to complete the statement.
To activate the Properties and Methods list use  %KeyFor(ActivatePropertiesAndMethodsList).
To activate the Constants list use Control+Shift+J
To set focus to the Objects or Members Combo use Control+F2 and Tab between the two combo boxes.
To hear Quick Info use Control+I
To hear Parameter Info use Control+Shift+I
To Find Next use Shift+F4
To Find Previous use Shift+F3
To indent or remove indent use Tab and Shift+Tab
To insert a blank line above the current line use Control+N
To get Context Sensitive Help use F1
To set or remove a BreakPoint use F9
To clear all BreakPoints use Control+Shift+F9
To run an application or continue if in Break Mode use F5
To execute code a line at a time use F8
To execute code a procedure at a time use Shift+F8
To run to Cursor use Control+F8
To stop running an application use Control+Break
To restart an application from the beginning use Shift+F5
To run the Error Handler use Alt+F5
To step into the Error Handler use Alt+F8
To View Definition use Shift+F2
To go to last position use Control+Shift+F2
To switch panes when the window is split use F6
To bring the selected control to the front when it is overlapped by other controls use Control+J
To send the selected control to the back use Control+K
To display the Call Stack Dialog in Break mode use Control+L
To run selected line of code use Enter
To Insert a Carriage Return use Control+Enter
To switch between the Immediate and Watch window (if visible) use F6
To display the Watch Expression use Shift+Enter
To display the Edit Watch Dialog use Control+W
To expand or collapse the Watch value use Enter
@@
; code pane views
@msgCV1_L
Full Module View
@@
@msgCV2_L
Procedure View
@@
; Project Types
@msgPT1_L
Standard Exe
@@
@msgPT2_L
ActiveX Exe
@@
@msgPT3_L
ActiveX Dll
@@
@msgPT4_L
ActiveX Control
@@
@msgPT5_L
Host Project
@@
; Window Types:
@msgWt1_L
Code Window
@@
@msgWt2_L
Designer
@@
@msgWt3_L
Object Browser
@@
@msgWt4_L
Watch
@@
@msgWt5_L
Locals
@@
@msgWt6_L
Immediate
@@
@msgWt7_L
Project Window
@@
@msgWt8_L
Property Window
@@
@msgWt9_L
Find
@@
@msgWt10_L
Find and Replace
@@
@msgWt11_L
Toolbox
@@
@msgWt12_L
Linked Window Frame
@@
@msgWt13_L
Main Window
@@
@msgWt14_L
Preview
@@
@msgWt15_L
Color Palette
@@
@msgWt16_L
Tool Window
@@
; VBE Model:
; component types
@msgCT1_L
StandAlone
@@
@msgCT2_L
Standard Module
@@
@msgCT3_L
Class Module
@@
@msgCT4_L
MSForm
@@
@msgCT5_L
Resource File
@@
@msgCT6_L
VBForm
@@
@msgCT7_L
VB M D I Form
@@
@msgCT8_L
Property Page
@@
@msgCT9_L
User Control
@@
@msgCT10_L
Document Object
@@
@msgCT11_L
Related Document
@@
@msgCT12_L
ActiveX Designer
@@
@msgCT13_L
Document
@@
@msgAppSettingsSaved1_L
Application Settings saved
@@
@msgAppSettingsNotSaved1_L
Application Settings could not be saved
@@


;UNUSED_VARIABLES

@msgAppStart1_L
To hear the %product% help topic for Microsoft Visual Basic press %keyFor(screenSensitiveHelp) twice quickly.
@@
@msgAppStart1_S
%product% help topic for Visual Basic %keyFor(screenSensitiveHelp) twice quickly.
@@
@msgNotAVBFormDesigner1_L
Not a VBForm Designer
@@
; Verbosity Dialog messages
@msgReadWholeCodeLineOff1_L
Read only visible portion of code line
@@
@msgReadWholeCodeLineOn1_L
Read whole code line when only partially visible
@@
@msgAlertOverlapOff1_L
Do not alert when controls overlap
@@
@msgAlertOverlapOn1_L
Alert when controls overlap
@@
@msgOutlookWarning1_L
Warning! %product% cannot fully support Visual Basic for Applications when run from Microsoft Outlook 2000 because a pointer to the environment is unavailable.
@@
@msgOutlookWarning1_S
Warning! %product% cannot fully support Visual Basic for Applications when run from Microsoft Outlook 2000 because a pointer to the environment is unavailable.
@@
@msgHelp18_S
move to the prior or next procedure control+up or down arrow
activate Auto Complete Control+SpaceBar
then arrows to select the correct property, method or constant and press Tab to complete the statement
activate the Properties and Methods list  %KeyFor(ActivatePropertiesAndMethodsList)
activate the Constants list Control+Shift+J
set focus to the Objects or Members Combo Control+F2 and Tab between the two combo boxes
hear Quick Info Control+I
hear Parameter Info Control+Shift+I
Find Next Shift+F4
Find Previous Shift+F3
indent or remove indent Tab and Shift+Tab
insert a blank line above the current line Control+N
get Context Sensitive Help F1
set or remove a BreakPoint F9
clear all BreakPoints Control+Shift+F9
run an application or continue if in Break Mode F5
execute code a line at a time F8
execute code a procedure at a time Shift+F8
run to Cursor Control+F8
stop running an application Control+Break
restart an application from the beginning Shift+F5
run the Error Handler Alt+F5
step into the Error Handler Alt+F8
View Definition Shift+F2
go to last position Control+Shift+F2
switch panes when the window is split F6
bring the selected control to the front when it is overlapped by other controls Control+J
send the selected control to the back Control+K
display the Call Stack Dialog in Break mode Control+L
run selected line of code Enter
Insert a Carriage Return Control+Enter
switch between the Immediate and Watch window (if visible) F6
display the Watch Expression Shift+Enter
display the Edit Watch Dialog Control+W
expand or collapse the Watch value Enter
@@
@msgSetFocusOnMenuItemList1_L
Menu Item List use %KeyFor(setFocusOnMenuItemList).
@@
@msgSetFocusOnMenuItemList1_S
Menu Item List %KeyFor(setFocusOnMenuItemList)
@@

;END_OF_UNUSED_VARIABLES

endMessages
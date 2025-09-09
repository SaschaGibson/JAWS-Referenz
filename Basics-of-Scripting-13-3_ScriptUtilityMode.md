# 13.3 Exploring Applications with the Script Utility Mode

The JAWS® screen reader provides you with a powerful utility to quickly
analyze an unknown application. This feature is called the Script
Utility Mode. When the Script Utility Mode is activated, the keyboard is
placed in a shifted state. This utility gives you access to system level
window information that you can use when scripting an unknown
application. You can determine parent-child relationships, windows
identifiers, and retrieve information about Microsoft® Active
Accessibility® (MSAA®) objects.

Press **INSERT+WINDOWS KEY+MINUS** to turn on the Script Utility Mode.
Press **INSERT+WINDOWS KEY+MINUS** a second time to turn off the Script
Utility Mode.

**NOTE:** While the Script Utility Mode is active, only part of the
keyboard is placed in a shifted state. The keys that are not used by the
Script Utility Mode, such as the alphabet, function as normal.

**NOTE:** The Script Utility Mode was previously called the Home Row
Utility and was accessed by pressing **INSERT+SPACEBAR** in versions of
JAWS prior to 11.0.

## Speaking Window Information

After activating the Script Utility Mode, you can speak various types of
information about the active window. Press **F1** to speak information
about the window. By default, the window and related text are spoken
when the utility is activated for the first time. You can cycle through
the different pieces of information spoken by pressing **F3**. The
pieces of information spoken are referred to as output modes. Each time
you press **F3** followed by **F1**, a different output mode is spoken.
Some of the output modes include: window type and text, handle, control
ID, class, type, subtype, and real name.

As you cycle through the various output modes, you can press **F11** to
hear JAWS speak the current output mode. Pressing **INSERT+HOME** on the
number pad will reset the output mode to say type and text. After the
keystroke is pressed, JAWS announces the output mode is type and text.
This keystroke eliminates the need to press **F3** or **SHIFT+F3** to
return to the say type and text output mode.

You can also copy the spoken information to the clipboard. Press
**CTRL+F1** to copy the spoken information to the clipboard. You can
paste this information into your favorite text editor for review.

## Moving to Windows

In the windows program structure, there is a parent-child relationship
between all windows contained within an application. A parent window can
have several child windows. All child windows of a specific parent
window are siblings of each other and said to be on the same logical
level. Using the Script Utility Mode, you can access each of these
windows and speak information about them.

### Moving Across the Windows Hierarchy

Using the Script Utility Mode, you can access windows even if they are
not accessible through the applications tab order when the Script
Utility Mode is turned off. Press **TAB** to move to the next window on
the same level. You can continue to press TAB until JAWS speaks "No next
window." This message indicates you have reached the last window on the
same logical level.

You can move to the prior window on the same level by pressing
**SHIFT+TAB**. You can continue to press **SHIFT+TAB** until JAWS speaks
"No prior window." This message indicates you reached the first child
window on the same level.

As you press **TAB** or **SHIFT+TAB** to move through the windows, JAWS
automatically speaks the selected output mode. You can press
**INSERT+TAB** to hear the window type and text spoken by JAWS for the
active window. If you are not sure where you began, press **F5** to
return the Script Utility Mode to the location of the active cursor.

### Moving Up and Down the Windows Hierarchy

You can use the Script Utility Mode to move up and down the windows
hierarchy. This functionality gives you the ability to determine if the
window with focus has any child windows associated with it. It also
gives you the ability to move to the parent of the active child window.
Press **F2** to determine if the active window has any associated child
windows. When a child window is found, the focus is moved to the child
window and JAWS speaks the output mode information about the child
window. You can continue to press **F2** until "Child window not found,"
is spoken by JAWS. This message indicates you are at the bottom of the
windows hierarchy and no more child windows are present. Press **TAB**
and **SHIFT+TAB** to determine if there are other child windows on the
same logical level.

Press **SHIFT+F2** to determine if a child window has an associated
parent window. You can continue to press **SHIFT+F2** until JAWS speaks
\"Parent window not found.\" This message indicates you have reached the
top of the windows hierarchy. After you have reached a parent window,
press **TAB** and **SHIFT+TAB** to determine if there are other windows
on the same logical level. Remember that a parent cannot only have child
windows, but it can be the child of another parent window. After
reviewing the parent-child relationships, you can press **F5** to route
the Script Utility Mode to the active window. This essentially takes you
back to the starting point from which you originally activated the
Script Utility Mode.

## Determining Window Visibility

As you move across, up, and down the windows hierarchy you are moving to
windows that may or may not be visible on the screen. You can use the
Script Utility Mode to identify the windows that are visible and those
that are not. Press **F6** to hear the visibility status of the current
window announced automatically by JAWS. Each time you move from window
to window with this option turned on, JAWS announces the visibility of
the window immediately following the output mode information. You can
turn this feature off by pressing **F6** a second time. You can also
announce the visibility status of the current window by pressing **F7**.
This announces the visibility status regardless of the state of the
**F6** visibility status toggle.

## Node and Tree Capture

After you have moved to a specific window within the structure of an
application, you can use the node capture command to quickly gather all
the information about that window. The node capture command places the
gathered information into the virtual viewer. You can then use standard
reading and selecting commands to read or copy the information to the
clipboard. Press **ALT+CTRL+ENTER** to perform a node capture. Some of
the types of information collected by the node capture command includes:
window handle, class, type, subtype code, control ID and window name.
When you are finished reviewing the information, press **ESC** to close
the Virtual Viewer.

A second and more powerful command is called tree capture. This command
allows you to quickly view information about the current window and any
child or parent windows associated with it. When you press
**ALT+CTRL+SHIFT+ENTER** to perform a tree capture, the command places
all the information for the current window along with all associated
child windows into the virtual viewer. You can then use standard JAWS
reading and selection commands to read or copy the information to the
clipboard. information collected by the tree capture includes: windows
handle, class, type and subtype code, control ID, window name, real
window name, window hierarchical values and text contained within the
window.

## Retrieving MSAA Information

When the active cursor is on an MSAA object, you can use the Script
Utility Mode to provide information about the object. However, you
cannot navigate through MSAA objects using the Script Utility Mode. If
you need to retrieve information on an object you must first activate
that object by moving to it with either the Jaws or PC Cursor.

Press **F9** to speak information about the object. By default, the
object name is spoken when the utility is activated for the first time.
You can move to the next output mode by pressing **F10**. You can move
to the prior output mode by pressing **SHIFT+F10**. Each time you press
either **F10** or **SHIFT+F10** followed by **F9**, a different output
mode is spoken. Output modes include:

- Name
- Type
- SubType
- Value
- State
- Control Attributes
- Description

You can also copy the output mode information about the active object to
the clipboard by pressing **CTRL+F9**. You can then paste the
information into a text editor for review after you complete your
analysis of the application.

## Script Utility Mode Keystroke Summary

The following commands are helpful in finding all the information you
need to know about controls, parent/child relationships, and text
attributes.

  Keystroke                            Description
  ------------------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **INSERT+H**                         Speak JAWS hot key shortcuts for the Script Utility Mode.
  **F1**                               Speak the selected mode of information.
  **F1** pressed twice in succession   Spell the selected mode of information.
  **INSERT+F1**                        Display output mode information in the virtual viewer.
  **CTRL+F1**                          Copy output mode information to the clipboard.
  **INSERT+CTRL+ F1**                  Output Window Technical Info in the virtual viewer (You do not have to be in script utility mode to use this command)
  **CTRL+ALT+ENTER**                   Activates node capture and places all window information into the virtual Viewer
  **CTRL+ALT+SHIFT+ENTER**             Activates tree capture and places all the window information for child or parent windows into the virtual viewer
  **F2**                               Move to the first child of the current active window and speak output mode information.
  **SHIFT+F2**                         Move to the parent of the current active window and speak output mode information.
  **F3**                               Select the next output mode.
  **SHIFT+F3**                         Select the previous output mode.
  **CTRL+F3**                          When repeatedly pressed, this keystroke moves to the first item of each group in the utility output modes. The modes jumped to are: Window handle, window type and real window name.
  **SHIFT+CTRL+F3**                    When repeatedly pressed, this keystroke moves to the prior first item of each group in the utility output modes. The modes jumped to are: Window handle, window type and real window name.
  **F4**                               Select the attribute search mode. Attributes include bold, italic, underline, highlight, and strikeout.
  **F5**                               Initialize the Script Utility Mode to the window containing the active cursor.
  **F6**                               Toggle auto speaking of window visibility status. When this option is turned on, the window\'s visible status is spoken as you move to it.
  **F7**                               Speak the visibility status of the window currently referenced by the Script Utility Mode.
  **F8**                               Speak the contents of the window currently referenced by the Script Utility Mode.
  **F9**                               Speak the MSAA Object output mode information. The active object is indicated by the position of the active cursor.
  **INSERT+F9**                        Display the MSAA object output mode information in the virtual viewer. This is not available on output modes that return integers.
  **ALT+F9**                           Displays the list of MSAA objects in the window currently accessed by the Script Utility Mode.
  **CTRL+F9**                          Copy requested MSAA object output mode information to the clipboard.
  **SHIFT+F9**                         Displays a list of MSAA objects by name in the window currently accessed by the Script Utility Mode. Other pieces of information about the MSAA objects contained in the list include: name, value, subtype code, state and more.
  **ALT+CTRL+F9**                      Displays information about the current MSAA object and its hierarchical ancestors or parents in the Virtual Viewer. Level 0 is the current MSAA object, level 1 is its parent, 2 its grand parent and so on.
  **F10**                              Select the next MSAA object output mode.
  **SHIFT+F10**                        Select the prior MSAA object output mode.
  **F11**                              Speak current output mode.
  **F12**                              Speak current MSAA object output mode.
  **TAB**                              Move to next window and speak output mode information.
  **SHIFT+TAB**                        Move to prior window and speak output mode information.
  **INSERT+TAB**                       Speak the window prompt and text for the window currently referenced by the Script Utility Mode.
  **INSERT+NUM PAD HOME**              Set output mode to SayTypeAndText.
  **INSERT+7**                         Activate the window-reclassification dialog.
  **INSERT+NUM PAD MINUS**             Route the Jaws or Invisible cursor to the window currently indicated by the Script Utility Mode if it is visible on the screen.
  **GRAVE ACCENT**                     Move to the next text attribute.
  **SHIFT+GRAVE ACCENT**               Move to the prior text attribute.
  **CTRL+GRAVE ACCENT**                Move to the first text attribute.
  **SHIFT+CTRL+ GRAVE ACCENT**         Move to the last text attribute.
  **LEFT** or **RIGHT ARROW** keys     Changes the value of pixel movement performed by the MouseLeft and MouseRight functions
  **UP** or **DOWN ARROW** keys        Changes the settings for which special characters are spoken

 

  ---------------------------------------------------------- -- ----------------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](13-4_CustomizingUnknownApplications.htm){accesskey="x"}
  ---------------------------------------------------------- -- ----------------------------------------------------------------

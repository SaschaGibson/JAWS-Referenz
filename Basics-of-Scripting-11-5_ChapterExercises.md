# 11.5 Chapter Exercises

The following exercises give you practice creating and using messages in
the virtual viewer. Before you start these exercises, make sure you have
the Notepad.jss script file open within the Script Manager. This file
should contain any practice scripts from earlier chapters of this
manual.

If you run Script Manager from within Notepad and a blank file is
opened, type the following lines at the top of the file:

; Script file for Notepad\
; JAWS version 12.0\
include \"hjconst.jsh\"\
include \"common.jsm\"

## Exercise 11.1: Displaying a Message in the Virtual Viewer

The objective of this exercise is to create a message and display it in
the virtual viewer. You should start Notepad and run the Script Manager
from within Notepad for this exercise.

Before you write your script, you need to create the message used by
your script in the Notepad.jsm message file. You can open the file
within the Script Manager and add your message. If you already have a
Notepad.jsm message file, do the following to open the file in the
Script Manager:

1.  Press **CTRL+O** to display the Open File dialog.
2.  Type Notepad.jsm in the File Name edit box and press **ENTER**.

If you have not previously created the Notepad message file, perform the
following:

1.  Press **CTRL+N** to display the New File dialog.
2.  The active control is a list of file types. Press **M** to select
    Messages followed by **ENTER**. This will open an untitled message
    file in the Script Manager.
3.  Type the following text in the file:

; Message file for Notepad\
Messages\
EndMessages

4.  Press **CTRL+S** to save the file. JAWS prompts you for the
    filename. Type Notepad in the File Name Edit box followed by
    **ENTER**.

Now you are ready to insert the individual message in the Notepad.jsm
message file. To add the individual message, perform the following:

1.  Press **UP ARROW** until you reach the line entitled \"Messages.\"
2.  Press **END** to move to the end of the line.
3.  Press **ENTER** twice to create two blank lines.
4.  Type the following message:

\@MsgVirtualViewer\
This text is being displayed in the virtual viewer. You can use the
virtual viewer to display helpful messages and other information.\
Press ESC to close this message.\
@@

5.  Press **CTRL+S** to save the file.
6.  Press **CTRL+TAB** to move back to the Notepad.jss script source
    file.

**NOTE:** After you have moved back to the Notepad.jss script file, be
sure to include the Notepad.jsm file. Failure to do so will result in
errors at the time of compilation. For more information on the include
statement see [5.0 Creating Scripts.](05-0_CreatingScripts.htm)

After you have added the message to the Notepad.jsm message file, you
are ready to create the script. Your script should begin by determining
if the virtual viewer is currently being displayed. If it is, then use
the UserBufferDeactivate function to close the viewer before displaying
the new message. After you have determined if the viewer is active and
closed it if necessary, you should use the SayFormattedMessage function
to display the message in the virtual viewer.

### DisplayVirtualViewer Script Documentation:

- Script Name: DisplayVirtualViewer
- Can be Attached to Key: checked
- Synopsis: Displays a message in the virtual viewer.
- Description: Displays a message in the virtual viewer using the
  SayFormattedMessage function.
- Category: None
- Assign to: **CTRL+SHIFT+V**

### DisplayVirtualViewer Script:

Script DisplayVirtualViewer ()\
If UserBufferIsActive () Then\
UserBufferDeactivate ()\
EndIf\
SayFormattedMessage (OT_USER_BUFFER, MsgVirtualViewer)\
EndScript

## Exercise 11.2: Displaying Keystrokes in the Virtual Viewer

The objective of this exercise is to take the previous exercise and add
a keystroke link to the message JAWS displays in the virtual viewer. To
add a keystroke to the message, you need only modify the message, save
the message file and recompile the Notepad.jss script file.

Start by performing the following steps to modify the message from the
previous exercise:

1.  Press **CTRL+TAB** until you reach the Notepad.jsm file.
2.  Press **CTRL+END** to move the insertion point to the bottom of the
    file.
3.  Press **UP ARROW** until you reach the line containing the text of
    "Press escape to close this message."
4.  Press **HOME** to move to the beginning of the line followed by
    **ENTER** twice. This will insert two blank lines above the current
    line of text.
5.  Press **UP ARROW** to move to one of the blank lines.
6.  Type the following text on this line:

Press %KeyFor(DisplayVirtualViewer) to redisplay this message

Follow this text by pressing **ENTER** twice.

After you complete the above steps, your message should look like the
following:

\@MsgVirtualViewer\
This text is being displayed in the virtual viewer. You can use the
virtual viewer to display helpful messages and other information.\
Press %KeyFor(DisplayVirtualViewer) to redisplay this message.\
Press ESC to close this message.\
@@

After you have modified the individual message, press **CTRL+S** to save
the message file. You then need to recompile the Notepad script file.

When you receive the "compile complete" message, you can move back to
Notepad. Test the script by pressing the keystroke to activate the
script. Your message should be displayed in the virtual viewer. Use the
arrow keys to move through the message. Did you hear JAWS speak the
keystroke as a link? If so, then press **ENTER** on the link to
redisplay the message. If not, then return to the Script Manager and
make sure your message is identical to the message shown above.

 

  ---------------------------------------------------------- -- --------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](12-0_UnderstandingFunctions.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------------

# 6.8 Chapter Exercises

These exercises give you some practice in creating scripts that read
pieces of information.

## Exercise 6.1: Reading the Script Manager Status Line

The objective of this exercise is to use built-in cursor movement and
reading functions to read the status line in the Script Manager.

1.  Press **INSERT+F2** to activate the Run JAWS Managers dialog.
2.  Press S to select the Script Manager followed by **ENTER**.
3.  Since this script should work in Script Manager, you need to open
    the script file for the manager. Choose Open Shared File from the
    File menu or press **ALT+F** followed by the letter **E**.
4.  Type the file name Script Manager and press **ENTER**. You don't
    need to include the file extension for script source files, .jss,
    because this is the default file type.
5.  Press **CTRL+END** to move the insertion point to the bottom of the
    file. Press **ENTER** to create a blank line between the last script
    and your new script.
6.  Press **CTRL+E** to activate the New Script dialog.
7.  Type ReadBottomLine in the Script Name edit box. Be sure to
    capitalize the first letter of each word in the name of the script.
8.  Press **TAB** to move to the Can be Attached to Key check box. Press
    **SPACEBAR** to check the check box.
9.  Press **TAB** to move to the Synopsis edit box. Type \"Reads the
    status line in the Script Manager\" without the quotation marks.
10. Press **TAB** to move to the Description edit box. Type \"Reads the
    status line in Script Manager using various cursor movement and
    reading functions\" without the quotation marks.
11. Press **TAB** to move to the Category edit combo box. You do not
    need to enter any information in this combo box as it is not used.
12. Press **TAB** to the Assign to Key edit box. Press **CTRL+SHIFT+L**.
    This is the keystroke that activates the script.
13. Press **ENTER** to close the New Script dialog and return to the
    Script Manager window.
14. Press **UP ARROW** once to move to the first blank line of the
    ReadBottomLine script.
15. Press **CTRL+I** to activate the Insert Function dialog. You are
    looking for the function to save the current cursor. Type Save in
    the Function Name edit box. Did JAWS find the SaveCursor function?
    If so, then press **ENTER** to insert the function into your script
    and close the Insert Function dialog.
16. After you have inserted the SaveCursor function into your script,
    the insertion point is at the end of the line. Press **ENTER** to
    move to the next line.
17. Press **CTRL+I**to activate the Insert Function dialog. You now need
    to locate the InvisibleCursor function. This will activate the
    Invisible cursor which you will use to read the status line of the
    window. Find the InvisibleCursor function and press **ENTER** to
    insert it.
18. Press **ENTER** to complete the line and move to a new blank line.
19. Follow the same procedure found in step 17 to insert the following
    functions into your script:
    - RouteInvisibleToPC
    - JAWSPageDown
    - SayLine

After following these steps, the script should look like the following:

Script ReadBottomLine ()\
SaveCursor ()\
InvisibleCursor ()\
SaveCursor ()\
RouteInvisibleToPC ()\
JAWSPageDown ()\
SayLine ()\
EndScript

20. If your script looks like the one above, press **CTRL+S** to save
    and compile the script file. Did you hear the compile complete
    message? If so, then you are ready to test the new script. If not,
    then go back to the script and make sure it looks like the one above
    then compile your script file a second time.
21. Press **CTRL+SHIFT+L** to test your script. Did you hear the status
    line of the Script Manager spoken by JAWS?

## Exercise 6.2: Read the Line Number and Total Lines in the Script Manager Status Line

The objective of this exercise is to create a script that reads only the
line number and total number of lines within the status line. In the
previous exercise, you created a script that read the entire Script
Manager status line. Create a script that only speaks the line number
and total number of lines in the script file. On the script manager
status line there is more information than you necessarily want to hear,
for example, \"For help, F1\". Your script should only say what you want
to hear, which is the word \"line\" followed by the total number of
actual lines in the script file.

If the Script Manager is not the active application, press **ALT+TAB**
until the Script Manager becomes the active window. The Script
Manager.jss script file should also be opened within the manager. You
can verify the file name by reading the title of the window with
**INSERT+T**. Before you create the script, follow the steps below to
determine what functions are needed:

1.  Press **NUM PAD MINUS** twice in succession to activate the
    Invisible cursor.
2.  Press **INSERT+NUM PAD MINUS** to route the Invisible cursor to the
    PC cursor location.
3.  Press **PAGE DOWN** to move the Invisible cursor to the bottom of
    the window.
4.  Press **HOME** to make sure the Invisible cursor is at the beginning
    of the status line.
5.  Press **INSERT+RIGHT ARROW** until JAWS speaks \"Line:\".
6.  Press **INSERT+PAGE UP** to read from the location of the Invisible
    cursor to the end of the line.

After you followed the steps above, did JAWS speak the line number and
total number of lines? Your new script should also read only the line
number and total number of lines within the current script file. The
steps needed to create the script follow:

1.  Press **CTRL+END** to move to the bottom of the script file.
2.  Press **ENTER** twice to insert a blank line between the last script
    and your new script.
3.  Press **CTRL+E** to activate the New Script dialog.
4.  Fill in the script information fields as follows:
    - Script Name: ReadLineNumber
    - Can be Attached to Key: checked
    - Synopsis: Reads the line number and total number of lines.
    - Description: Reads the line number and total number of lines from
      the status line.
    - Category: not used
    - Assign To: **CTRL+SHIFT+S**
5.  After you have entered all the script information, press **ENTER**
    to close the New Script dialog and return to the Script Manager edit
    area.
6.  Press **UP ARROW** once to move to the first blank line in the body
    of the script.
7.  Use the Insert Function dialog, activated by **CTRL+I**, to insert
    the following functions into your script:
    - SaveCursor ()
    - InvisibleCursor ()
    - SaveCursor ()
    - RouteInvisibleToPC ()
    - JAWSPageDown ()
    - JAWSHome ()
    - NextWord ()
    - NextWord ()
    - NextWord ()
    - NextWord ()
    - NextWord ()
    - SayFromCursor ()

**Note:** If you need to review how to select a function from the Insert
Function dialog, see [5.5 Inserting
Functions](05-5_InsertingFunctions.htm) for more information. You should
press **ENTER** after each function is inserted into your script.
Failure to do so, causes each of the functions to be inserted on the
same line.

8.  After you have followed all the steps above, your script should look
    like the following:

Script ReadLineNumber ()\
SaveCursor ()\
InvisibleCursor ()\
SaveCursor ()\
RouteInvisibleToPC ()\
JAWSPageDown ()\
JAWSHome ()\
NextWord ()\
NextWord ()\
NextWord ()\
NextWord ()\
NextWord ()\
SayFromCursor () EndScript

After you have completed the steps above, Compare your script to the
script shown above. Make any corrections to your script as necessary.

**Note:** When correcting your script, you can use normal editing
techniques just as you would in a word processor or text editor.

9.  Now that you have reviewed your script, press **CTRL+S** to save and
    compile your script. Did you hear the compile complete message? If
    so, then you are ready to test your script. If not, then note the
    error shown in the Error dialog. Next, press **ESCAPE** to close the
    Error dialog and return to your script. Review your script for the
    error and correct it. You can refer back to the script shown above,
    if necessary.
10. Once you have a complete compile, press **CTRL+SHIFT+S** to activate
    your script. Did you only hear the line number and total number of
    lines spoken by JAWS?

 

  ---------------------------------------------------------- -- ------------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](07-0_UsingVariablesAndConstants.htm){accesskey="x"}
  ---------------------------------------------------------- -- ------------------------------------------------------------

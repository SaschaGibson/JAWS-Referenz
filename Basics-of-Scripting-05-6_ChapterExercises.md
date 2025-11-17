# 5.6 Chapter Exercises

These exercises will give you practice in creating, inserting functions,
compiling, and testing your scripts.

## Exercise 5.1: Adding Comments and Include Statements

The objective of this exercise is to give you some practice adding
comments and include statements to your script file.

Before you begin this exercise, make sure you only have JAWS and Notepad
running. You can press **INSERT+F10** to list all of your running
applications.

1.  Press **INSERT+F2** followed by **S** and **ENTER** while Notepad is
    the active application. This opens The Script Manager with the
    Notepad.jss file in the edit window.

**Note:** Unless you have written any scripts in the Notepad script
source file, this file will be empty.

2.  Press **CTRL+HOME** to move to the top of the file. This ensures the
    insertion point is at the top of the script file.

**Note:** If the insertion point is already at the top of the file, you
may hear a windows system sound.

3.  Type a semicolon (;). This starts a comment line in the script file.
4.  Type the text \"JAWS \[ version \] Script file for Notepad in
    Windows X\" where X denotes the operating system you are using and
    version denotes the version of JAWS you are writing scripts for. At
    the end of this line, press **ENTER** to move the insertion point to
    the next line.
5.  Type a semicolon (;) to begin a second comment line in your script
    file.
6.  Type the text of \"Written By\" followed by your name and the
    current date. At the end of this line press **ENTER** to complete
    the line and move the insertion point to a new blank line.
7.  Press **ENTER** twice. This will create a blank line and then move
    the insertion point to a second blank line after your comment
    section. This will help separate the comment section from the area
    where include statements are placed.
8.  Type include \"HJConst.jsh\" This adds an include statement telling
    JAWS to include the contents of the HJConst.jsh file within the
    Notepad script file. Press **ENTER** to complete the line and move
    the insertion point to a new blank line.

**Note:** When you type the include statement, the file name must be
surrounded by quotation marks.

9.  Press **CTRL+W** to save your script file without compiling.

After completing the steps above, your Notepad script file should start
with the following lines:

; JAWS \[ version \] Script file for Notepad in Windows X\
; Written by your name on mm/dd/yy\
include \"hjconst.jsh\"

**Note:** The text of your name should be replaced with your actual
name. The date should also be filled in for the date you are doing this
exercise.

## Exercise 5.2: The HelloWorld Script

The objective of this exercise is to use the New Script dialog to create
your first script. If you have just completed the previous exercise,
make sure that Script Manager is the active application. If you have
closed the Script Manager, make sure Notepad is still running, switch to
Notepad, and follow step 1 in the previous exercise to start the
manager.

1.  Press **CTRL+END** to move to the bottom of the Notepad script file.
    This will ensure your new script is created at the bottom of the
    file below the comments you added in the previous exercise.
2.  Press **ENTER** twice to create a blank line between the Include
    statement and your new script.
3.  Press **CTRL+E** to display the New Script dialog. The Script Name
    edit box is active.
4.  Type HelloWorld In the Script Name edit box.

**Note:** Script names cannot contain spaces or any punctuation marks
such as dashes or underlines. The Script Manager will cause a system
beep to occur any time you attempt to add any of these characters to
your new script name. You should also capitalize the first letter of
each word in a multiple word script name.

5.  Press **TAB** to move to the Can be Attached to Key check box and
    press **SPACEBAR**. This step tells JAWS you want to create a script
    and not a function.
6.  Press **TAB** to move to the Synopsis edit box. Type \"Speaks a
    message in Notepad\" into this edit box without the quotation marks.
    This text is spoken by JAWS when you enter Keyboard Help and press
    the keystroke that activates this script.
7.  Press **TAB** to move to the Description edit box. Type \"Speaks a
    hello world message in Notepad.\" without the quotation marks. The
    description is heard when you enter keyboard help and press the
    keystroke that activates this script twice in succession.
8.  Press **TAB** to move to the Category list box. Since this is not
    used, you do not need to select an item from this list.
9.  Press **TAB** to move to the Assign To edit box. Be careful as any
    keystroke you press while in this edit box will be used as the
    keystroke that activates this script. Press **CTRL** simultaneously
    with **1** in the numbers row, not the number pad. Since the Ok
    button is the default button in this dialog, you can press **ENTER**
    to close the New Script dialog and return to the Notepad script
    file.
10. Press **UP ARROW** once to move the insertion point to the first
    blank line in the body of the script. Type the following text:

SayString (\"Hello World!\")

**Note:** The SayString function is no longer used to speak messages
with JAWS. This function is obsolete and should only be used for
debugging scripts and functions.

11. After you have typed the line of text above, the insertion point is
    at the end of the line. Press **DOWN ARROW** once to move to the
    next line. You can press **DELETE** twice to remove the remaining
    blank lines.

After you have followed the steps above, you should have the following
script in your script file:

Script HelloWorld ()\
SayString (\"Hello World!\")\
EndScript

If your script does not look like the one above, make corrections as
needed. You can edit the text of any script just as you would in a word
processor or text editor.

## Exercise 5.3: Compiling and testing the HelloWorld Script

The objective of this exercise is to compile and test the HelloWorld
script created in exercise 5.2.

1.  Press **CTRL+S** to save and compile the Notepad.jss script file.
    Did you hear the \"Compile Complete\" message? If not, go back to
    the script and check it against the script shown in the previous
    exercise.
2.  After you have successfully compiled your script file, you are ready
    to test your new script. Press **ALT+TAB** to move back to Notepad.
3.  Press **CTRL+1**. Did you hear the message spoken by JAWS?
4.  Press **INSERT+1** to turn on Keyboard Help. You should hear JAWS
    speak \"Keyboard help on\" when you are using beginner verbosity.
    Otherwise, you should hear , \"On.\"
5.  Press the keystroke that activates your script, **CTRL+1**. Did JAWS
    speak the synopsis of your script?
6.  Press the keystroke, **CTRL+1**, twice in succession. Did JAWS speak
    the description of your script?
7.  Press **INSERT+1** a second time. You will hear JAWS say \"Keyboard
    help off\" when you are using beginner verbosity. Otherwise, you
    should hear , \"Off.\"

## Exercise 5.4: Using the Insert Function dialog.

The objective of this exercise is to create a new script and insert a
function in the body of the script using the Insert Function dialog. If
you are still in Notepad, press **ALT+TAB** to move back to the Script
Manager.

1.  Press **CTRL+END** to move to the bottom of the file.
2.  Press **ENTER** twice to create a new blank line. This blank line
    separates the new script from the previous HelloWorld script.
3.  Press **CTRL+E** to activate the New Script dialog. Your cursor
    should be located in the Script Name edit box.
4.  Type SayGreeting without spaces. Capitalize the **S** in say and the
    **G** in Greeting.
5.  Press **TAB** to move to the Can be Attached to Key check box and
    press **SPACEBAR** to check it. This tells JAWS you are creating a
    script not a function.
6.  Press **TAB** to move to the synopsis edit box. Type \"Speaks a
    greeting in Notepad\".
7.  Press **TAB** to move to the description edit box. Type \"Speaks a
    greeting in Notepad using the Say function.\"
8.  Press **TAB** to move to the category combo box. As the category is
    not used, you do not need to make a selection.
9.  Press **TAB** to move to the Assign To edit box. Press **CTRL**
    simultaneously with the **2** on your numbers row, not the num pad.
    You should hear JAWS speak \"**CTRL+2**.\" Since the Ok button is
    the default button in this dialog, press **ENTER** to close the New
    Script dialog.
10. Press **UP ARROW** once to move to the first blank line in the body
    of your new script.
11. Press **CTRL+I** to activate the Insert Function dialog box. The
    cursor should be located in the Function Name edit box.
12. Type \"Say.\" JAWS moves the highlight in the Function Name list box
    of this dialog to the location of the Say function and speaks its
    description.
13. Press **ENTER** to tell JAWS this is the function you want to add to
    your script. You will then be prompted for the first parameter of
    the function. This parameter is the string of text that is spoken by
    JAWS each time you press **CTRL+2**.

**Note:** A parameter is information a function uses to perform its
task.

14. Type \"Hello world, this is my second script.\" including the
    quotation marks. This is the actual message JAWS speaks each time
    you press **CTRL+2**.
15. Press **ENTER** to add the first parameter. You will then be
    prompted for the second parameter of the Say function.
16. Type \"OT_MESSAGE\" in all capital letters. This is a constant value
    contained within the HJConst.jsh script header file. This parameter
    tells JAWS what type of message this is and when to speak it.
17. Press **ENTER** to accept the second parameter. Press **ENTER**
    again to leave the third parameter empty and close the Insert
    Function dialog box. You are returned to the script file and the
    insertion point is at the end of the line containing the function
    you just inserted.
18. Press the **LEFT ARROW KEY** to move the cursor back into the text
    of the function and you will find a blank space and a comma in
    between the OT_MESSAGE and the right parenthesis at the end of the
    function. This happened because we chose to leave the third
    parameter of the Say function blank. In order for the script to
    compile properly, you must delete the blank space and the comma in
    between the OT_MESSAGE and the right parenthesis.
19. Press **DOWN ARROW** once to move to the next blank line. Press
    **DELETE** twice to remove the two remaining blank lines. After
    following the steps above, your script should look like the
    following:

Script SayGreeting ()\
Say (\"Hello world, this is my second script\", OT_MESSAGE)\
EndScript

19. Now you are ready to compile the script. Press **CTRL+S** to compile
    the script file. If you don\'t hear \"compile complete\", then you
    may have an error in your script. Go back and review the script. You
    should make sure your script matches the script shown above. After
    you have corrected any errors, try compiling the script again.
20. Once you save and compile your script without any errors, return to
    Notepad and test your script. Press **CTRL+2**. Did JAWS speak the
    message?

  ---------------------------------------------------------- -- ---------------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](06-0_ReadingInformationWithScripts.htm){accesskey="x"}
  ---------------------------------------------------------- -- ---------------------------------------------------------------

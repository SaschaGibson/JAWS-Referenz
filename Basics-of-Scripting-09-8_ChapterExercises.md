# 9.8 Chapter Exercises

The following exercises will give you practice in creating If-Then
statements.

**Note:** The exercises in this chapter will not walk you through the
steps needed to open the Script Manager or the steps needed to activate
the New script dialog. To review these steps, refer to the previous
chapters in this manual.

## Exercise 9.1: Using the If statement to Check for User Verbosity

The following script for Notepad uses an If statement to determine which
user verbosity level is active and speaks an appropriate message. You
will need to use the GetVerbosity function to determine the current
verbosity level. The GetVerbosity function returns the constant
BEGINNER, INTERMEDIATE, or ADVANCED depending on which level JAWS is
currently set on. The constants are defined in the header file
hjconst.jsh. Use the If statement and the GetVerbosity function to
determine which verbosity level is currently active and speak a message
accordingly.

1.  Make sure that the Notepad script file is open and your cursor is at
    the bottom of the file ready to insert a new script.
2.  Add the following information in the New Script dialog:
    - Script Name: CheckVerbosity
    - Can be Attached to Key: checked
    - Synopsis: Speaks a message based on which verbosity level is
      active.
    - Description: This script uses the GetVerbosity function to
      determine which verbosity level is active and then speaks a
      message accordingly.
    - Category: None
    - Assign to Key: **CTRL+SHIFT+C**
3.  The script should first check to see if the verbosity level is set
    to beginner. If so, a message should be spoken. After typing the
    keyword If, press **CTRL+I** to activate the Insert Function dialog
    box and insert the GetVerbosity function. Notice the function
    requires no parameters. The statement should look like the following
    and should be placed beneath the line containing the script name:

If GetVerbosity () == BEGINNER Then ; Check to see if verbosity is
beginner.

**NOTE:** You do not need quotes around the word BEGINNER because it is
a constant value rather than a string value.

4.  On the next line use the SayFormattedMessage function to have JAWS
    speak the message, \"Your verbosity is beginner.\" Be sure to indent
    the line first. The line should look like the following:

SayFormattedMessage (OT_Message, \"Your verbosity is beginner\")

5.  Since we are checking for three conditions (beginner, intermediate,
    or advanced) we must use the ElIf statement to check for
    intermediate verbosity. The statement should look like the
    following:

ElIf GetVerbosity () == INTERMEDIATE Then ; Check to see if verbosity is
INTERMEDIATE

6.  On the next line use the SayFormattedMessage function to have JAWS
    speak the message, \"Your verbosity is intermediate.\"
7.  Since the verbosity level must be one of three levels, we know that
    if it is not beginner or intermediate then it must be advanced.
    Therefore we can simply use the Else statement and have JAWS speak
    the message, \"Your verbosity is advanced.\"
8.  After inserting the Else statement and final SayFormattedMessage
    function don\'t forget the EndIf keyword before the EndScript
    statement. When finished, your script should look like the
    following:

Script CheckVerbosity ()\
If GetVerbosity () == BEGINNER Then ; Check to see if verbosity is
beginner.\
SayFormattedMessage (OT_Message, \"Your verbosity is beginner\")\
ElIf GetVerbosity () == INTERMEDIATE Then ; Check to see if verbosity is
INTERMEDIATE\
SayFormattedMessage (OT_Message, \"Your verbosity is intermediate\")\
Else ; If the verbosity is not beginner or intermediate, it must be
advanced\
SayFormattedMessage (OT_Message, \"Your verbosity is advanced\")\
EndIf\
EndScript

9.  Press **CTRL+S** to save and compile the script. If any errors exist
    be sure your script looks like the one above.
10. Switch over to Notepad and press **CTRL+SHIFT+C** to run your
    script. JAWS should speak the message telling you what your
    verbosity currently is.
11. Be sure to change your verbosity to all three levels and test your
    script. Do the following to change your verbosity:
    - Press **INSERT+V** to open the Adjust JAWS Options dialog box.
    - Press the letter \'U\' until you find the User Verbosity option
      and press **SPACEBAR** to cycle between the three values.
    - Press **ENTER** to accept your change and close the Adjust JAWS
      Options dialog box and return to Notepad.

## Exercise 9.2: Looping Example

The following script in Notepad should make JAWS count out loud from one
to ten. You will accomplish this using a While EndWhile loop. During
each iteration through the loop, JAWS will speak the value of an integer
variable and then increase the value of the variable by one. The
SayInteger function will be used to speak the value of the integer
variable.

1.  Make sure that the Notepad script file is open and your cursor is at
    the bottom of the file ready to insert a new script.
2.  Add the following information in the New Script dialog:
    - Script Name: LoopingExample
    - Can be Attached to Key: checked
    - Synopsis: Counts out loud to ten.
    - Description: This script uses a loop and the SayInteger function
      to count from one to ten.
    - Category: None
    - Assign to Key: **CTRL+SHIFT+L**
3.  You must first create an integer variable that will be used to count
    to ten. Make sure the cursor is in the body of the script and create
    an integer variable named iCount.
4.  Using a Let statement, assign a value of 1 to the iCount variable.
5.  Since we want JAWS to stop counting after it reaches ten, we use a
    While loop that only executes while the value of iCount is less than
    eleven. Enter the following on a blank line below the Let statement:

While iCount \< 11; This loop will execute 10 times

6.  You can now insert the SayInteger function that will speak the value
    of the iCount variable. On a blank line below the While statement,
    press **TAB** to indent the code inside the loop. Then press
    **CTRL+I** to activate the Insert Function dialog box and locate the
    SayInteger function.
7.  After choosing the SayInteger function, The Script Manager prompts
    you for two parameters. The first parameter is the numeric value or
    integer variable containing the numeric value to be spoken. When
    prompted by the Script Manager for this parameter, type \"iCount\"
    without the quotation marks to indicate that the function will speak
    the value of the iCount variable. The Script Manager then prompts
    you for the second parameter, the base of the number to be used.
    Since this parameter is optional, press **TAB** until you reach the
    Finish button followed by the **SPACEBAR** to activate the button
    and close the Insert Function dialog. After the function is inserted
    into your script, you will need to remove the comma and space
    between the iCount variable and the right parenthesis. The line
    should look like the following:

SayInteger (iCount)

8.  On the next line you can now increase the value of the iCount
    variable by one. First press **TAB** to indent the new line to the
    same level as the previous line. Now type the following Let
    statement:

Let iCount = iCount + 1; Adds 1 to the value of iCount. When it reaches
11, the loop will stop.

9.  On the next line add the EndWhile keyword to conclude the loop.
10. After performing the above steps, your script should look like the
    following:

Script LoopingExample ()\
var\
int iCount\
Let iCount = 1\
While iCount \< 11; This loop will execute 10 times.\
SayInteger (iCount); Speaks the value of the iCount variable\
Let iCount = iCount + 1; Adds 1 to the value of iCount. When it reaches
11, the loop will stop.\
EndWhile\
EndScript

11. Press **CTRL+S** to save and compile the script. If you get a
    compile error, check to make sure your script matches the example
    above.
12. You can now move to Notepad and press **CTRL+SHIFT+L** to activate
    your script. You should hear JAWS count from one to ten.

 

  ---------------------------------------------------------- -- ---------------------------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](10-0_PassingKeystrokesAndTypingTextWithScripts.htm){accesskey="x"}
  ---------------------------------------------------------- -- ---------------------------------------------------------------------------

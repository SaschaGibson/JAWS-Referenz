# 8.5 Chapter Exercises

The following exercises give you practice in creating messages. You will
also use the FormatString and SayFormattedMessage built-in functions in
these exercises.

## Exercise 8.1: Creating a Message File and Adding Messages

The objective of this exercise is to give you practice creating a new
message file and adding messages to the file. You will use Notepad for
the active application. You will add two messages to the notepad.jsm
file. After you have created the messages, you will create a script that
speaks those messages.

1.  Activate Notepad from your Start Menu \| Accessories group.
2.  From within Notepad, press **INSERT+F2** to activate the Run JAWS
    Managers dialog. Press **S** followed by **ENTER** to start the
    Script Manager.
3.  You need to create a message file for Notepad as it does not have a
    message file by default. Press **CTRL+N** to activate the New File
    dialog. You are placed in the New list box. The list box contains
    five entries for creating files. You can use this list box to create
    a new source file, header file, documentation file, message file, or
    key map file.
4.  Press **M** to select the Messages file (jsm) list item followed by
    **ENTER** to create the new message file. When the New File dialog
    closes, your insertion point is placed in a new untitled message
    file.
5.  Press **CTRL+S** to save the file. This action causes the Script
    Manager to display the Save As dialog. The focus is in the File Name
    edit box. Give the new file the name of Notepad. You do not need to
    include the file extension as the script Manager does that
    automatically for you.
6.  After the Save As dialog closes, press **INSERT+T** to read the
    title bar of the Script Manager. Did you hear the file name of
    Notepad.jsm?

**Note:** When you create script message or header files, give them the
same name as the executable file name for the application. This makes it
easier for you to locate the message file for a given application should
you decide to share the file with someone else. If you are creating a
generic message or header file, one not tied to a specific application,
you can give it any name you want.

7.  You are now ready to add a comment to the top of the file along with
    the key word used to indicate the beginning of your messages block.
    Type the following text into your message file:

; Message file for Notepad\
Messages

8.  Next, you need to add a long message to the message file. If the
    insertion point is still on the line containing the key word
    \"messages,\" press **ENTER** to create a new blank line. Type the
    following text:

\@MSGText_L\
This is an example of a long message. This message is only spoken by
JAWS when the beginner verbosity setting is in use.\
@@

9.  Press **ENTER** twice on the line containing the two @ symbols. This
    will create a blank line to separate your long message from your
    short message.
10. The short message is next. Type the following text:

\@MsgText_S\
This is an example of a short message.\
@@

11. Press **ENTER** once to create a new blank line following your short
    message. Type the following text:

EndMessages

12. Press **CTRL+S** to save your message file.

**Note:** JAWS does not speak \"Compile complete.\" The Script Manager
does not compile message files only script source files.

13. After following the steps above, you should have the following text
    in the Notepad message file:

; Message file for Notepad\
Messages\
\@MSGText_L\
This is an example of a long message. This message is only spoken by
JAWS when the beginner verbosity setting is in use.\
@@\
\@MsgText_S\
This is an example of a short message.\
@@\
EndMessages

14. Next, you need to create a script that uses the messages you just
    created. Press **CTRL+TAB** to move back to the Notepad.jss script
    source file.

**Note:** You can have more than one file open in the Script Manager at
a time. Press **CTRL+TAB** to move between the files.

15. Press **CTRL+HOME** to move to the top of the Notepad script source
    file. You need to include the new message file. Press **DOWN ARROW**
    until you reach the blank line following the include statement for
    the hjconst.jsh file. Type the following text:

Include \"Notepad.jsm\"

After you have typed the text, press **ENTER** twice to create a new
blank line.

16. Press **CTRL+END** to move the insertion point to the bottom of the
    script file. Press **ENTER** twice to create a blank line between
    the last script in the file and your new script.
17. Press **CTRL+E** to activate the New Script dialog and enter the
    following information in the fields in the dialog:
    - Script Name: SpeakMessage
    - Can be Attached to Key: checked
    - Synopsis: Speaks long and short messages in notepad.
    - Description: Speaks long and short messages in Notepad using the
      SayFormattedMessage function.
    - Category: none
    - Assign to: **CTRL+3**
18. After you have entered all the information above, press **ENTER** to
    close the dialog.
19. Press **UP ARROW** to move to the first blank line in the body of
    the SpeakMessage script.
20. Press **CTRL+I** to activate the Insert Function dialog. The focus
    is placed in the Function Name edit box. Look for the built-in
    function SayFormattedMessage. When you find the function, press
    **ENTER**. JAWS prompts you for the first parameter, output type.
    Type the following text:

OT_MESSAGE

20. Press **ENTER**. JAWS prompts you for the second parameter, the long
    message. Type the following text in the Parameter 2 edit box:

MsgText_l

21. Press **ENTER**. JAWS prompts you for the third parameter, the short
    message. Type the following text in the Parameter 3 edit box:

MsgText_S

22. You do not need to enter any information for the remaining
    parameters after the short message name. Press **TAB** to move to
    the Finish button and press **ENTER** to close the Insert Function
    dialog. Make sure to remove the extra commas and spaces before the
    right parenthesis
23. Press **DOWN ARROW** to move to the next line. Press **DELETE**
    repeatedly until you have removed all blank lines from the script.
    After you have completed the previous steps, your script should look
    like the following:

Script SpeakMessage ()\
SayFormattedMessage (OT_MESSAGE, MsgText_l, MsgText_S)\
EndScript

24. Press **CTRL+S** to compile the Notepad script source file. If you
    hear JAWS speak, compile complete, switch to Notepad and test your
    script. If you encountered syntax errors, compare your script to the
    one shown above. Continue to compile your script until you hear JAWS
    speak compile complete.

**Hint:** To test your script, use the Adjust JAWS Options dialog to
change your verbosity setting from beginner to intermediate to advanced.
You can access the Adjust JAWS Options dialog by pressing **INSERT+V**.
After you have opened the Adjust JAWS Options dialog, press **U** to
move to the User Verbosity option. Press **SPACEBAR** to cycle through
the options. When you have selected the desired option, press **ENTER**
to close the dialog and save the verbosity setting change. Each time you
switch the verbosity setting, test your script. JAWS should only speak
the long message when you are using the beginner verbosity setting. JAWS
should speak the short message when you use either intermediate or
advanced verbosity setting.

## Exercise 8.2: Using Placeholders

The objective of this exercise is to give you practice using
placeholders in your messages, formatting your messages, and speaking
those messages. This exercise should be completed in the Notepad script
source and message files. If you do not have Notepad or the Script
Manager running, refer to steps 1 and 2 in the previous exercise to get
started.

1.  Within the script Manager, press **CTRL+TAB** until you reach the
    notepad.jsm message file.
2.  Press **CTRL+END** to move to the bottom of the file.
3.  Press **UP ARROW** until you reach the line containing
    \"EndMessages.\" Press **HOME** to move the insertion point to the
    beginning of the line.
4.  Press **ENTER** twice to create a blank line between the last
    individual message in the messages block and your new message.
5.  Type the following text in the notepad message file:

\@MsgMyName Hello, my name is %1 %2. You can just call me %1.\
@@

6.  Press **CTRL+S** to save the changes to the Notepad message file.
7.  Press **CTRL+TAB** to move to the Notepad script source file,
    Notepad.jss.
8.  Press **CTRL+END** to move to the bottom of the file. Press
    **ENTER** twice to create a blank line between your last script and
    the new script.
9.  Press **CTRL+E** to activate the New Script dialog. Type the
    following information into each control within the dialog:
    - Script Name: SpeakMyName
    - Can be Attached to Key: checked
    - Synopsis: Speaks a message containing my name.
    - Description: Speaks a message containing my name in Notepad. The
      message uses placeholders.
    - Category: none
    - Assign to: **CTRL+SHIFT+N**

After you have filled in all of the fields, press **ENTER** to close the
New Script dialog.

10. Press **UP ARROW** to move the insertion point to the first blank
    line in the body of the script. You need to create a local variable
    declaration section here. Type the following text:

Var\
string sMessage

11. After you have typed in the variable declaration statement for
    sMessage, press **ENTER** to move the insertion point to a new blank
    line. Type the following text:

let sMessage =

**Note:** Be sure to type a space after the equals sign. This allows for
proper spacing when you insert the next function.

12. Press **CTRL+I** to activate the Insert Function dialog. You need to
    find the built-in function, FormatString. Once you have located the
    function, press **ENTER** to begin adding the parameters.
13. The first parameter the function requires is the name of the message
    that contains the text and placeholders. Type the following text:

MsgMyName

14. Press **ENTER**. JAWS accepts the first parameter and then prompts
    you for the second parameter.
15. The second parameter is the information that replaces the first
    placeholder in your message. Type your first name surrounded in
    quotation marks, for example \"John.\"
16. Press **ENTER** to accept the parameter. JAWS prompts you for the
    third parameter. This parameter is the information that replaces the
    second placeholder within your message. Type your last name
    surrounded by quotation marks. For example, \"Doe.\"
17. Instead of pressing **ENTER** to accept this parameter, move to and
    activate the Finish button. The finish button tells JAWS you are
    finished entering parameters for the function. After the Insert
    Function dialog closes, your insertion point is at the end of the
    line you just entered. Read the line with **INSERT+UP** **ARROW**.
    JAWS should speak the following text:

let sMessage = FormatString (MsgMyName, \"John\", \"Doe\", , , , , , , ,
)

You need to remove all the commas and spaces following the quotation
mark following your last name. Press **LEFT ARROW** until you reach the
comma immediately following the quotation mark. Press **DELETE**
repeatedly to remove all commas and spaces until you reach the right
parenthesis. The line should look like the following:

let sMessage = FormatString (MsgMyName, \"John\", \"Doe\")

18. Press **END** to move to the character following the right
    parenthesis. Press **ENTER** to complete the line. Your insertion
    point is now on a new blank line.
19. Press **CTRL+I** to activate the Insert Function dialog. You are
    looking for the built-in function, SayFormattedMessage. Once you
    have located the function, press **ENTER**.
20. JAWS prompts you for the first parameter for the SayFormattedMessage
    function. This parameter is the output mode. Type the following
    text:

OT_MESSAGE

21. Press **ENTER** to accept the parameter. JAWS prompts you for the
    next parameter, the long message.
22. This parameter is the return value from the call to the FormatString
    function, sMessage. This is the message that has been formatted with
    your name replacing the placeholders. Type the following text:\
    sMessage
23. Press **ENTER** to accept the parameter. JAWS then prompts you for
    the third parameter. This is the short message. You do not need this
    parameter or any of the remaining parameters; so, activate the
    Finish button to close the Insert Function dialog.
24. Your insertion point is at the end of the line. Press **INSERT+UP
    ARROW** to read the current line. JAWS should speak:

SayFormattedMessage (OT_MESSAGE, sMessage, , , , , , , , , , )

You need to remove the commas immediately following the sMessage
parameter. Press **LEFT ARROW** until you reach a comma. Press
**DELETE** until you remove the commas and spaces. The line should now
look like the following:

SayFormattedMessage (OT_MESSAGE, sMessage)

25. Press **DOWN ARROW** once to move to the next line. If this line is
    blank, press **DELETE** to remove it and any other blank lines.
26. After following the steps above, your script should look like the
    following:

Script SayMyName ()\
Var\
string sMessage\
let sMessage = FormatString (MsgMyName, \"John\", \"Doe\")\
SayFormattedMessage (OT_MESSAGE, sMessage)\
EndScript

27. Press **CTRL+S** to compile the Notepad script source file. If you
    did not hear JAWS speak \"Compile Complete,\" return to your script.
    Correct the error the Script Manager noted and try compiling your
    script again. Continue this process until you hear \"Compile
    complete.\"

**Note:** When the Script Manager encounters an error, the line
containing the error is highlighted.

28. Return to Notepad and test your script. Did JAWS speak the message?

### Using the SayFormattedMessage Function to Substitute Placeholders

New to JAWS 12 update 1, is the ability to replace placeholder values
directly in the SayFormattedMessage function rather than having to use
the FormatString function to do so. This eliminates the need for the
sMessage variable and the FormatString function. If using this method,
the script would look like the following.

Script SayMyName ()\
SayFormattedMessage (OT_MESSAGE, MsgMyName, MsgMyName, \"John\",
\"Doe\")\
EndScript

## Exercise 8.3: Adding the InputBox Function to the Script Created in Exercise 8.2

The objective of this exercise is to modify the script created from
exercise 8.2 above. Instead of using quoted strings of text as
parameters for the FormatString function, use a built-in function to
prompt for the first and last name values. You can use the built-in
function, InputBox, to accomplish this task. The function displays a
dialog box using the title and prompt you specify. When you type
information into the edit box contained in the dialog and activate the
Ok button, the function returns the text as a string. The InputBox
function uses three parameters:

- string of text for the dialog prompt
- string of text for the title of the dialog box
- variable to contain the text typed in the dialog

You should create two additional local variables. The first variable
should store the first name. The second variable should contain the last
name. When you have made the modifications to the script, it should look
like the following:

Script SpeakMyName ()\
Var\
sMessage,\
string sFirstName,\
string sLastName\
InputBox (\"Enter your first name:\", \"First Name Entry\", sFirstName)\
InputBox (\"Enter your last name:\", \"Last Name Entry\", sLastName)\
let sMessage = FormatString (MsgMyName, sFirstName, sLastName)\
SayFormattedMessage (OT_MESSAGE, sMessage)\
EndScript

After you have modified the script, compile the script. When you hear
the \"Compile complete\" message, return to Notepad, and test the
script.

**Note:** For more information on the InputBox function, open the
builtin.jsd script documentation file within the Script Manager.

 

  ---------------------------------------------------------- -- -------------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](09-0_ControllingTheFlowOfScripts.htm){accesskey="x"}
  ---------------------------------------------------------- -- -------------------------------------------------------------

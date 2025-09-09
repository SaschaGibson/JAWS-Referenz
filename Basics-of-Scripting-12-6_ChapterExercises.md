# 12.6 Chapter Exercises

The following exercises will give you practice in creating varying types
of user-defined functions. Each exercise creates a user-defined function
and a corresponding script to call the function. Each exercise will
indicate the script file that should be used.

## Exercise 12.1: Basic User-Defined Function

The purpose of this exercise is to create a function that speaks a
message and then types a string of text into an Notepad document. If you
don\'t already have Notepad open, start Notepad and activate the script
Manager from within Notepad. This should open the Notepad.jss script
file that contains scripts from the previous exercises in this manual.

If you run Script Manager from within Notepad and a blank file is
opened, type the following lines at the top of the file:

; Script file for Notepad\
; JAWS version 12.0\
include \"hjconst.jsh\"\
include \"common.jsm\"

First, create the function that speaks a message and then types a string
of text into Notepad. Use the SayFormattedMessage function to speak the
message and the TypeString function to type the text.

### SpeakGreeting Function Documentation:

- Script Name: SpeakGreeting
- Can be Attached to Key: not checked
- Synopsis: Speaks a message and types a string of text.
- Description: Speaks a message and types a string of text into an open
  Notepad text document.
- Category: none
- Function Returns: void
- Return Description: none

### SpeakGreeting Function:

Void Function SpeakGreeting ()\
SayFormattedMessage (OT_MESSAGE, \"Hello world, it\'s a great day for
writing scripts.\")\
TypeString (\"Hello world, it\'s a great day for writing scripts.\")\
EndFunction

Once you have successfully compiled your function, you will need to
create the script to call it. Use the Insert Function dialog to insert
the SpeakMessage function into the body of your script. This is the only
statement that goes into the body of your script as the function
performs the desired task.

### TypeAndSpeakGreeting Script Documentation:

- Script Name: TypeAndSpeakGreeting
- Can be Attached to Key: checked
- Synopsis: Calls the SpeakGreeting function to speak a message and type
  text.
- Description: Calls the SpeakGreeting function to speak a message and
  type text in Notepad.
- Category: none
- Assign to: **CTRL+SHIFT+G**

### TypeAndSpeakGreeting Script:

Script TypeAndSpeakGreeting ()\
SpeakGreeting ()\
EndScript

## Exercise 12.2: User-Defined Function with a Single Parameter

The purpose of this exercise is to create a user-defined function that
speaks a message using a string of text passed to it as a parameter. If
you don\'t already have Notepad open, start Notepad and activate the
script Manager from within Notepad.

Before you create your user-defined function and related script, you
need to create the message used by your function in the Notepad.jsm
message file. You can open the file within the Script Manager and add
your message. If you already have a Notepad.jsm message file, do the
following to open the file in the Script Manager:

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
4.  Type the following messages:

\@MsgName\
Hello world, my name is %1.\
@@\
; message for missing or no name\
\@MsgNoName\
You did not enter a name.\
@@

5.  Press **CTRL+S** to save the file.
6.  Press **CTRL+TAB** to move back to the Notepad.jss script source
    file.

**NOTE:** After you have moved back to the Notepad.jss script file, be
sure to include the Notepad.jsm file if you haven\'t done so already.
Failure to do so will result in errors at the time of compilation. For
more information on the include statement see Chapter 5 Creating
Scripts.

Now you are ready to create the function that will speak your message
and the script that calls the function. Your function should accept a
single string parameter: the name passed to it from the calling script.
Before the function speaks the message, check to make sure the parameter
actually contains some text using an If statement. If there is no text
in the parameter, speak an error message and use the return statement to
exit the function. Use the FormatString function to combine the passed
string parameter and the MsgName message you created above into one
message. Next, call the SayFormattedMessage function to speak the
message after it has been formatted.

### SpeakTheName Function Documentation:

- Script Name: SpeakTheName
- Can be Attached to Key: not checked
- Synopsis: Speaks a message that includes a name.
- Description: Speaks a Hello World message using a string parameter
  passed to the function containing a name.
- Category: none
- Function Returns: void
- Return Description: none

After you have entered the information shown above into the General page
of the New Script dialog, press **CTRL+TAB** to move to the Parameters
page. You will use this page to tell JAWS the name and type of the
parameter the function needs to perform its task. When you reach this
page, press **TAB** to move to the New Parameter edit box and add the
following information:

- New Parameter: sName
- By Reference: not checked
- Description: String containing the name to be combined with the
  message and spoken.
- Available Types: string

After you have entered the information shown above, press **ALT+A** to
activate the Add button and add your new parameter. Next, press **TAB**
until you reach the Ok button. Press **SPACEBAR** to activate the button
and close the New Script dialog.

### SpeakTheName Function:

Void Function SpeakTheName (string sName)\
var\
String sMessage\
If sName == \"\" Then; check to make sure text was actually passed in
the sName parameter\
SayFormattedMessage (OT_ERROR, MsgNoName); speak an error message\
Return; exit the function\
EndIf\
Let sMessage = FormatString (MsgName, sName); format the message using
the passed parameter\
SayFormattedMessage (OT_MESSAGE, sMessage)\
EndFunction

Once you have successfully compiled the SpeakTheName function, you will
be ready to create the script that calls the function. Your script
should assign a value to a variable called sName. Use the Insert
Function dialog to insert the SpeakTheName function. The variable sName
will be the parameter to the SpeakTheName function.

### SayName Script Documentation:

- Script Name: SayName
- Can be Attached to Key: checked
- Synopsis: Prompts you for a name to be spoken by JAWS.
- Description: Displays a dialog box that allows you to enter your name.
  JAWS then speaks a message containing the name you entered.
- Category: none
- Assign to: **CTRL+SHIFT+N**

### SayName Script:

Script SayName ()\
var\
String sName\
let sName = \"Your name goes here\"\
SpeakTheName (sName)\
EndScript

## Exercise 12.3: User-Defined Function with Multiple Parameters

In the previous exercise, you created a function that accepted a string
parameter containing your name. This parameter could hold only your
first name or the combination of your first and last names. In this
exercise, modify the SpeakTheName function to accept two string
parameters. The original parameter of the function, sName, will be used
to hold the first name. The second parameter created for this exercise,
will hold the last name. Before you modify the function, you will need
to change the content of the MsgName message contained in the Notepad
message file. Press **CTRL+TAB** to move from the Notepad.jss file to
the Notepad.jsm file. In the Notepad.jsm message file, change the
MsgName message to look like the following:

\@MsgName\
Hello world, my name is %1 %2.\
@@

Press **CTRL+S** to save your changes followed by **CTRL+TAB** to move
back to the Notepad script file. Now you are ready to modify the
existing SpeakTheName function. To add an additional parameter to the
function, perform the following:

1.  Move to the body of the SpeakTheName function.
2.  Press **CTRL+D** to display the script Documentation multi-page
    dialog.
3.  Press **CTRL+TAB** to move to the Parameters page. When you move to
    this page, the focus is placed in the Existing Parameters list box.
4.  Press **TAB** to move to the New Parameter edit box.

### Add the following information for your new parameter:

- New Parameter: sLastName
- By Reference: not checked
- Description: String containing the last name.
- Available Types: string

After you have added all the necessary information for the new
parameter, press **ALT+A** to activate the Add button. This moves the
focus back to the New Parameter edit box. Press **TAB** until you reach
the Ok button. Press **SPACEBAR** to activate the button and close the
Script Documentation multipage dialog.

Move the insertion point to the beginning line of the SpeakTheName
function. It should now look like the following:

Void Function SpeakTheName (string sName, string sLastName)

You are now ready to modify the function to use the second parameter.
First, you should add a second If statement to check if anything was
passed in the sLastName parameter. Move your insertion point to the line
containing the EndIf statement. Press **END** to move to the end of the
line followed by **ENTER** to create a new blank line. Add the following
statements to the function:

If sLastName == \"\" Then\
SayFormattedMessage (OT_ERROR, MsgNoName); speak an error message\
Return; exit the function\
EndIf

Second, you will need to add a third parameter to the call to the
FormatString function. Move your insertion point to the line containing
the FormatString function and change it to look like the following:

Let sMessage = FormatString (MsgName, sName, sLastName) ; format the
message using the passed parameters

After you modify the function to use the new parameter, compile the
script file. Once you have compiled the file successfully, you will be
ready to modify the script.

**NOTE:** You can alter the messages used to speak the error messages
when nothing is contained in either the first or last name parameters.
To do this, you would add a second message to the Notepad.jsm message
file for the last name and alter the contents of the message for the
first name. Then you could use each message appropriately to speak the
correct error message.

To modify the script you will need to add a second variable to hold the
last name. Use a Let statement to assign a value to the variable and
pass it as the second parameter into the SpeakTheName function. Modify
the SayName script to look like the following:

Script SayName ()\
var\
String sLastName,\
String sName\
let sName = \"Your first name goes here\"\
let sLastName = \"Your last name goes here\"\
SpeakTheName (sName, sLastName)\
EndScript

## Exercise 12.4: User-Defined Function with a Return Value

The purpose of this exercise is to create a function that returns a
value to the calling script. In the previous 2 exercises, you created a
script and function that used 2 parameters to speak a message. The
script used the Let statement to assign values to variables which were
then passed into the function to speak the message.

In this exercise, you will create a function that uses the InputBox
function to prompt you for your first and last names. The function will
then format the message to be spoken using the FormatString function.
The FormatString function uses the MsgName message from the previous
exercise along with the values for the first and last names entered
using the InputBox function. Finally, the function returns the message
as a string to the calling script.

The InputBox function is a built-in function that displays a dialog box
with an edit field for entering text. Using the parameters of the
function, you pass strings of text to be used as the title of the dialog
box and the prompt for the edit field. The third parameter should be a
variable name that will contain the text entered when the OK button is
activated in the dialog box. An example of the InputBox function
follows:

InputBox (\"Name entry\", \"Please enter your first name\", \$sName)

In the example above, the title of the dialog box will be \"Name
entry.\" The text \"Please enter your first name\" will be the prompt
for the edit box. sName will contain the text entered by the user. If no
text is entered, sName will be empty.

### RetrieveTheName Function Documentation:

- Script Name: RetrieveTheName
- Can be Attached to Key: not checked
- Synopsis: Prompts you for your first and last names.
- Description: Uses the InputBox function to prompt you for your first
  and last names.
- Category: none
- Function Returns: string
- Return Description: String of text containing the formatted message to
  be used by any of the Say functions.

### RetrieveTheName Function:

String Function RetrieveTheName ()\
var\
String sFirstName,\
string sLastName,\
string sMessage,\
string sPrompt,\
string sTitle\
let sTitle = \"Name Entry\"\
; retrieve the first name\
let sPrompt = \"Enter your first name:\"\
InputBox (sPrompt, sTitle, sFirstName)\
; retrieve the last name\
let sPrompt = \"Enter your last name:\"\
InputBox (sPrompt, sTitle, sLastName)\
; format the message\
let sMessage = FormatString (MsgName, sFirstName, sLastName)\
; return the formatted message\
return sMessage\
EndFunction

Once you have compiled the function successfully, you will be ready to
create the script that calls it. You will need to declare a single
string variable to hold the message that is returned from the function.
Your script should then call the function and store the returned message
in the local variable. Finally, your script will use the
SayFormattedMessage function to speak the message.

### SpeakFormattedMessage Script Documentation:

- Script Name: SpeakFormattedMessage
- Can be Attached to Key: checked
- Synopsis: Speaks a message containing first and last names.
- Description: Speaks a message returned from the RetrieveTheName
  function.
- Category: none
- Assign to: **CTRL+SHIFT+M**

### SpeakFormattedMessage Script:

Script SpeakFormattedMessage ()\
var\
String sMessage\
Let sMessage = RetrieveTheName (); call the function to retrieve and
format the message\
SayFormattedMessage (OT_MESSAGE, sMessage); speak the message\
EndScript

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](13-0_WindowsStructure.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------

# 13.5 Debugging Script Files

Although the JAWS script language does not have any built in error
handling, there are several things you can do prior to testing your new
scripts.

## The Desk Check

Before you test a script, you should check the script to review for
logic errors. You can find many logic and syntax errors by doing a
thorough \"desk check\" of the new or modified script. The desk check
involves reviewing a new or modified script line by line pretending you
are the computer. Verify each statement performs the desired action and
in the correct sequence. Correct mistakes as you find them or add
comments to the line containing the mistake. Review your notes or pseudo
code for the application being customized to make sure you have not left
out any vital statements.

## Compiling the Script File

After you complete the desk check of your script, you can compile the
script file. Remember that the script compiler only checks for syntax
and will not validate the logic contained within your scripts. The
compiler also does not check for correct function names within each
script.

All Include files are examined as they are included. Include statements
should be placed at the beginning of the script file. When a constant or
variable is used before an Include statement, the compiler generates an
error informing you that the constant or variable is unknown. This type
of error is generated because the Include statement is improperly
placed.

When the script compiler encounters a syntax error, an error message is
displayed on the screen identifying the error. When you clear the dialog
box by activating the Ok button, the cursor is placed on the line
containing the error. Normally, you can find the error on the line where
the cursor is. However, there are times when an error in a preceding
line or in an included file can cause the cursor to be on a line with no
errors. It is important to look at the lines above the highlighted error
line when the error is not evident.

**NOTE:** If several nested If-Then statements are used without the
correct number of corresponding EndIf statements, the compiler will
produce an error, but the cursor may not be located where the missing
EndIf statement should have been placed. The compiler only checks for
correct If-Then statement structure.

## Starting to Test

After you have successfully compiled the script file, you are ready to
begin testing your scripts. You do not need to unload and restart JAWS
before testing your scripts unless you have modified the default script
file, Default.jss. Switch to the application and begin testing.

## Testing Tips

There are several techniques you can use to test your scripts. They
range from breaking up your script into smaller segments to including
spoken messages at certain points within the script.

### Testing Smaller Segments

Whenever possible, compile and test fragments of complex scripts and
functions separately. This allows you to test each fragment to determine
if the script fragment is working correctly. Breaking up a script or
script file into smaller statement sequences allow for better testing of
complex scripts or functions. Smaller statement sequences also make it
easier to eliminate any logic errors.

### Speaking Messages

Speaking messages at crucial points in your script is extremely
beneficial when testing your scripts. Messages spoken by JAWS help to
determine if the logic in the script is correct. It also helps you track
the logic flow of the script to ensure statements are being processed in
the order you intended.

Although obsolete, the SayString function provides a good method for
speech output. The function only requires one parameter, the string of
text to be spoken. A series of SayString messages, announcing different
information, is very informative when determining correct script
performance. SayString messages also provide a good method of
determining correct branch processing. For instance, SayString messages
in each branch of an If statement will announce what branch is being
executed.

After you have tested the flow of your script, it is best to remove the
SayString function. The SayString function should never be used to
provide output in completed scripts. The function does not give you the
ability to honor verbosity settings as the SayMessage and
SayFormattedMessage functions do.

### Speaking Numeric Values

You can also speak numeric values during the execution of your scripts.
You may want to monitor the changes in value of local variables to
ensure they are getting the proper values. The SayInteger function
provides a good method of announcing the values of integer variables.
The SayInteger function also provides a method of announcing how values
are changing during script execution. You may find that these variables
do not have the expected values at certain points as the script
executes. The SayInteger function is also useful in tracking integer
variable values during the execution of a While loop.

### Saving and Restoring Values

Failing to save and restore states is also a cause for some script
errors. This refers to cursor states, screen echo states, verbosity
states, etc. When you change a state during the execution of your
script, be sure you restore the original state. For instance, changing
screen echo to All to hear a help bubble spoken is fine. But don\'t
leave the system set that way as it is very confusing to the user.

### Accounting for Event Functions

Your scripts also interact with Event Functions. You must keep in mind
that JAWS has event functions present in the default script file that
may trigger automatically as an application is running. These event
functions can interact in unexpected ways with the scripts you are
writing. For example, you may place reading functions in your script to
read areas of the screen at certain times, only to find that the
information is being spoken twice. This indicates that one of the event
functions such as the NewTextEvent function or the Focused Changed Event
function is being called to speak the text automatically. Your script is
then speaking the information a second time. Analyzing the script will
not reveal the cause of the problem. The event function is actually
speaking the information the second time. It is important you have an
understanding of what the JAWS event functions do and when they are
performed.

 

  ---------------------------------------------------------- -- ---------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](Appendix_A.htm){accesskey="x"}
  ---------------------------------------------------------- -- ---------------------------------------

# 12.4 Functions that Return Values

A return is a value that a function returns to the calling script or
function when it completes its task. A return value can be any one of
the four variable types: handle, integer, object, or string. The type of
value your function returns depends largely on the task it performs.

You use the Function Returns edit combo box in the General page of the
New Script dialog to tell JAWS the type of value the function returns.
You also type the description of the return in the Return description
edit box. Adding a description for the return, helps you and anyone else
using your function to determine exactly what the value should be used
for within the calling script or function.

When you create a new function that returns a string value, the Script
Manager places the following function beginning line into your script
file:

String Function MyFunction ()

The \"string\" key word that precedes the \"function\" key word tells
you that the MyFunction function returns a string value to the calling
script or user-defined function.

## The Return Statement

You use the return statement to send a value back to the calling script
or user-defined function. This key word tells JAWS to return the
specified value to the calling script or function. You can return the
value as a literal value or within a variable. The syntax of a return
statement that sends a string value stored in a variable called sText
back to the calling script or user-defined function follows:

Return sText

A return statement that returns a string of text, \"This is a string\",
as a literal follows:

Return \"this is a string\"

When a function returns a value to the calling script or user-defined
function, you must store that value in either a local or global
variable. You can then use that variable to make decisions on what the
calling script or user-defined function should do next. An example of
storing a string value returned by a function called MyFunction in a
local variable follows:

### Example 1: Assigning the Output of a Function to a Variable

Script MyScript ()\
Var\
String sText\
Let sText = MyFunction (); store the return value of MyFunction in
sText\
If sText != \"\" Then; the function actually returned a value other than
null or nothing\
SayFormattedMessage (OT_MESSAGE, sText)\
EndIf\
EndScript

You can also use the return value of one function as the parameter for
another. Using the previous example, the return value from MyFunction
could be passed directly to the SayFormattedMessage function without
storing it in a local variable first. The only disadvantage to this
approach is that the MyFunction function may not retrieve any text.
Therefore, the SayFormattedMessage function won\'t cause JAWS to speak
anything. The example reworked to use the return value of MyFunction as
the parameter for SayFormattedMessage follows:

### Example 2: Using a Function as a Parameter For Another Function

Script MyScript ()\
SayFormattedMessage (OT_MESSAGE, MyFunction()); use the return value
from MyFunction as the message text for SayFormattedMessage\
EndScript

Another example of a user-defined function that returns a value follows:

string function VerbosityLevelToggle(int iRetCurVal)\
Var\
int Verbosity\
if not iRetCurVal then\
; update it\
VerbosityLevel ()\
endIf\
let Verbosity = GetVerbosity ()\
if Verbosity == 0 then\
return cmsg12_L; Beginner\
elif Verbosity == 1 then\
return cmsg13_L; Intermediate\
elif Verbosity == 2 then\
return cmsg14_L; Advanced\
endIf\
EndFunction

You can find the function shown above in the default script file. JAWS
performs this function each time you press **SPACEBAR** on the \"User
Verbosity\" entry in the Adjust JAWS Options dialog. The function begins
by determining the value of the iRetCurVal parameter. If the value of
the parameter is 0 or false, then JAWS performs the VerbosityLevel
function to change the verbosity level from its current value to the
next value. For example, if you are using the beginner verbosity level,
the VerbosityLevel function changes your verbosity level to
intermediate. Next, the GetVerbosity function retrieves the verbosity
setting now being used and stores it in the Verbosity local variable.
The If statement then determines the value stored in the Verbosity
variable and returns the appropriate string of text to indicate the new
verbosity level. The actual text is stored in the Common.jsm JAWS
message file found in your JAWS settings folder.

 

  ---------------------------------------------------------- -- -------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](12-5_TheUseStatement.htm){accesskey="x"}
  ---------------------------------------------------------- -- -------------------------------------------------

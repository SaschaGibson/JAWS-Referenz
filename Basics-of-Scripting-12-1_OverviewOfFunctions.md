# 12.1 Functions, An Overview

Functions differ from scripts in three ways. Unlike scripts, functions
are not activated by a keystroke. Instead, they are called from a script
or another user-defined function. When you call a function, the function
performs its designated task and then returns control to the calling
script or function.

Second, functions can accept parameters. A parameter is data the
function uses to complete its task. For example, if you want JAWS to
speak a message, you use the SayFormattedMessage function. In order for
this function to perform its task of speaking the desired message, you
must provide the text of the message along with the desired output type.
JAWS then uses the text and desired output type to determine if the
message should be spoken and then speak it. Without this information,
JAWS cannot perform the task of the function.

Finally a function differs from a script in that it can also send a
value back to the calling script. This value is referred to the
function\'s return or return value. For example, the GetLine built-in
function retrieves the line of text found at the location of the active
cursor. When it determines the correct text, the function returns the
text as a string that you can then store in a local string variable.

You create functions to carry out repetitive tasks. Instead of placing
the same code in any number of different scripts, you can put the code
in one function and then call it from those scripts. This makes
maintaining your scripts and user-defined functions much easier. Suppose
you create scripts and user-defined functions for an application. Within
the script file for that application, you have placed the same code in
several different scripts. Now suppose there is a newer version of the
application available. You discover that your scripts no longer perform
as expected and need to be updated due to the changes in the
application.

Since you placed the same code in several scripts, you must modify each
of them and then test those modifications. On the other hand, had you
placed the same code in a single user-defined function, then you would
have only had to modify and test one block of code.

 

  ---------------------------------------------------------- -- ---------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](12-2_Built-inFunctions.htm){accesskey="x"}
  ---------------------------------------------------------- -- ---------------------------------------------------

# 9.3 Adding a Second Branch, the Else Keyword

You can add the Else key word to an If-Then-EndIf statement structure to
provide an additional branch. JAWS performs any statements following the
Else key word when the condition in the preceding If statement is found
to be false. You add the Else key word to the If-Then-Endif structure
following any statements to be performed when the preceding If statement
is found to be true. Thus, you can perform a statement or group of
statements when the condition you are testing is either true or false.
An example of an If statement structure that includes the Else key word
follows:

## Example 1: Adding the Else Key Word to the If-Then-EndIF Statement

var\
int iVerbosity\
let iVerbosity = GetVerbosity ()\
If iVerbosity == BEGINNER Then\
SayFormattedMessage (OT_STATUS, \"Beginner verbosity is in use.\")\
Else\
SayFormattedMessage (OT_STATUS, \"Intermediate or advanced verbosity is
in use.\")\
EndIf

In the above example, JAWS compares the value stored in the iVerbosity
variable to the value contained in the BEGINNER constant. When they are
equal, JAWS performs the SayFormattedMessage function following the If
statement and speaks \"Beginner verbosity is in use.\" When the values
are not equal, then JAWS performs the SayFormattedMessage function that
follows the Else key word and speaks \"Intermediate or advanced
verbosity is in use.\" By adding the Else key word to the If statement
above, you can account for both true and false conditions in the initial
If statement.

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](09-4_TheElIfStatement.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------

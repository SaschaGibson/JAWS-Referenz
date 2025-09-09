# 9.2 The If Statement

You use the If statement structure in your scripts to evaluate a
condition. The process your script performs after the evaluation of the
condition is based on the outcome of that evaluation. The basic form of
the If statement structure includes the key words If, Then and EndIf.
You must include each of these key words in all If statements you use
within your scripts. If you fail to include any of these key words, then
the script compiler generates a syntax error. The basic structure of an
If statement follows:

If condition to be evaluated Then\
statement or statements to be performed when the If statement is true\
EndIf

You always place the condition to be evaluated by JAWS between the If
and Then key words. JAWS evaluates this condition to determine what
statements should be performed next. When the condition is found to be
true, then JAWS performs all statements following the If statement. If
the condition is determined to be false, then JAWS skips the statements
contained in the If statement and begins performing any statements
following the EndIf key word. In the basic form of the If-Then-EndIf
statement structure, JAWS only has one branch to choose from.

When you construct If statements in your scripts, it is a good idea to
indent any statements JAWS performs when the preceding If statement is
true. Using indentation makes it easier to determine which statements
are contained within the If statement and which are not. You can press
**TAB** in the Script Manager to accomplish this task. This indents the
statements inside the If-Then-EndIf structure by approximately 4 spaces.

The following If statement compares the values of two variables. The
code of the example follows:

## Example 1: Using an If-Then-EndIF Statement

var\
int iVerbosity\
let iVerbosity = GetVerbosity ()\
If iVerbosity == BEGINNER Then\
SayFormattedMessage (OT_STATUS, \"beginner verbosity is in use\")\
EndIf

In the above example, JAWS begins by retrieving the current verbosity
setting storing it in the variable, iVerbosity. JAWS then performs the
If statement comparing the value stored in iVerbosity to the verbosity
setting value represented by the constant, BEGINNER. JAWS performs the
SayFormattedMessage function following the If statement and speaks
\"Beginner verbosity is in use\" when the values are equal. However,
when the values are not equal, then JAWS does not perform the
SayFormattedMessage function and no message is heard.

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](09-3_TheElseStatement.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------

# 9.4 Adding multiple branches, the ElIf Statement

You can add the ElIf statement to an If-Then-EndIf structure to provide
a secondary way of formulating a branch. You use the ElIf statement to
check a second condition when the condition in the preceding If
statement is false. You can use the ElIf statement as a replacement for
the Else key word. You can also add one or more ElIf statements to your
If statements. However, they must be added before the Else key word.
Each ElIf statement must include the Then key word. An example of an
ElIf statement follows:

ElIf iVerbosity == INTERMEDIATE Then

When the condition being evaluated in the ElIf statement is found to be
true, then JAWS performs all statements following the ElIf statement. If
JAWS determines the condition in the ElIf statement is false, then JAWS
will do one of the following:

- evaluate the next ElIf statement
- perform any statements following the Else key word
- continue processing the statements in your script that follow the
  EndIf key word

The example shown in the previous section illustrated the use of the
Else key word to allow for both true and false branches when JAWS
compared two values. The following example illustrates the use of the
ElIf statement as a replacement for the Else key word

## Example 1: Using ElIf Instead of Else

If iVerbosity == BEGINNER Then\
SayFormattedMessage (OT_STATUS, \"Beginner verbosity is in use\")\
ElIf iVerbosity != BEGINNER Then\
SayFormattedMessage (OT_STATUS, \"Intermediate or advanced verbosity is
in use\")\
EndIf

In the above example, JAWS compares the value stored in iVerbosity with
the BEGINNER constant. When they are equal to each other, JAWS performs
the SayFormattedMessage function following the If statement and speaks
\"Beginner verbosity is in use.\" If JAWS determines the two values are
not equal, then JAWS performs the SayFormattedMessage function following
the ElIf statement and speaks \"Intermediate or advanced verbosity is in
use.\"

Although the ElIf statement in the above If statement structure takes
the place of the Else key word, it does not allow for separate messages
to be spoken when intermediate or advanced verbosity is in use. You may
find situations where you need to perform a group of statements when a
variable could possibly contain three or more different values, such as
the verbosity setting in JAWS. Likewise, yu may want to perform a group
of statements when two values are equal to each other, a second group of
statements when one value is greater than the other and a third group of
statements when one value is less than the other. Thus you can determine
if the values are equal, one is greater than the other or one value is
less than another. The following example illustrates the use of ElIf
statements within an If-Then-EndIf statement structure:

## Example 2: Using the ElIf Key Word to Check for Different Conditions

let A = 5\
let B = B + 1\
If A == B Then\
SayFormattedMessage (OT_MESSAGE, \"The values of A and B are equal\")\
ElIf A \> B Then\
SayFormattedMessage (OT_MESSAGE, \"The value of A is greater than the
value of B\")\
ElIf A \< B Then\
SayFormattedMessage (OT_MESSAGE, \"The value of A is less then the value
of B\")\
EndIf

In the above example, JAWS compares the values of A and B. If JAWS
determines the values are equal, then the If statement is true. JAWS
performs the SayFormattedMessage function following the If statement and
speaks \"The values of A and B are equal.\" If JAWS determines the
values of A and B are not equal, then the If statement is false. Since
the values of A and B are not equal, then JAWS must perform the ElIf
statement to determine if the value of A is greater than the value of B.
If A is greater than B, the ElIf statement is true. JAWS performs the
SayFormattedMessage function following the first ElIf statement and
speaks \"The value of A is greater than the value of B.\"

If the value of A is not greater than the value of B, then the ElIf
statement is false. JAWS must then perform the next ElIf statement that
determines if A is less than B. If A is less than B, then the ElIf
statement is true. JAWS performs the SayFormattedMessage function
following the ElIf statement and speaks \"The value of A is less than
the value of B.\"

 

  ---------------------------------------------------------- -- ----------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](09-5_NestedIfStatements.htm){accesskey="x"}
  ---------------------------------------------------------- -- ----------------------------------------------------

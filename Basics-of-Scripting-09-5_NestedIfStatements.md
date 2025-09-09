# 9.5 Nested If Statements

You can place or nest an If statement inside another If statement. When
you nest If statements, you can check for a condition only when another
condition is found to be true. When the first condition is found to be
true, JAWS evaluates the nested If statement. JAWS evaluates it just as
it would do for any other If statement. Thus, if the condition in the
nested If statement is found to be true, JAWS performs any statements
following the If statement.

You can use the Else key word within the nested If statement structure.
You can also add any number of ElIf statements to the nested If
statement structure.

When you nest If statements, you should use indentation. Using
indentation makes it easier to match the If, Else, Elif, and EndIf
keywords up with each other. Thus, you can be assured you have an EndIf
that corresponds to each If key word.

**Note:** You can add any number of nested If statements within your
scripts and functions. However, the more nested If statements you add,
the harder your scripts are to debug when errors are encountered at
compilation time. You should try to limit nesting If statements to one
or two levels.

## Example 1: Nested If statements

Var

Int iValue

Let iValue = CalculateNumber (); Assign a number to iValue

If iValue \> 4 Then

If iValue == 5 Then

SayFormattedMessage (OT_MESSAGE, \"The value is 5\")

ElIf iValue == 7 Then

SayFormattedMessage (OT_MESSAGE, \"The value is 7\")

Else

SayFormattedMessage (OT_MESSAGE, \"The value is greater than 4 but is
not equal to 5 or 7\")

EndIf; complete the nested If statement

Else

SayFormattedMessage (OT_MESSAGE, \"The value is less than or equal to
4\")

EndIf; complete the outer If statement

In the above example, JAWS performs the CalculateNumber function and
stores the result in the iValue local variable.

- The outer If statement first determines if the value stored in iValue
  is greater than 4.
- If the value is greater than 4, then the inner If statement executes.
- Thus, if the value is 5, then JAWS performs the SayFormattedMessage
  function following the If statement and speaks, "The value is 5.\"
- If the value is equal to 7, then JAWS performs the SayFormattedMessage
  function following the Elif Statement and speaks, "The value is 7.\"
- If the value stored in iValue is greater than 4 but is not 5 or 7,
  JAWS performs the SayFormattedMessage function following the Else
  Statement and speaks, \"The value is greater than 4 but is not equal
  to 5 or 7.\"
- If the value is less than or equal to 4, JAWS does not process the
  nested If statement. Instead, JAWS jumps directly to the Else
  statement following the nested If statements and performs the final
  SayFormattedMessage function that speaks, \"The value is less than or
  equal to 4.\"

Regardless of the number stored in iValue, JAWS will speak one of the
above messages.

 

  ---------------------------------------------------------- -- ------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](09-6_CompoundIfStatements.htm){accesskey="x"}
  ---------------------------------------------------------- -- ------------------------------------------------------

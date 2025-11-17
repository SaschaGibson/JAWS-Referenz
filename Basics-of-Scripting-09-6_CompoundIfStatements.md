# 9.6 Compound If Statements

Compound statements contain two or more conditions that JAWS evaluates
before your script continues processing. There are two types of compound
If statements:

- Statements joined by \"AND\"
- Statements joined by \"OR\"

The type of compound statement you use within your script is based
largely on the type of processing that needs to occur under certain
situations. Compound statements can often replace nested If statements.

## Compound Statements Using \"And\"

A compound statement joined by "and" evaluates two or more conditions
before processing continues. All conditions must be true before the
entire If statement is said to be true. If JAWS determines that one of
the conditions is false, then the entire If statement is considered to
be false. You use two ampersands (&&) placed next to each other to
indicate a compound statement joined by "and."

### Example 1: A compound statement joined by "and"

Var\
Int iValue\
Let iValue = CalculateNumber (); Assign a number to iValue\
If iValue \> 5 && iValue \< 10 Then\
SayFormattedMessage (OT_MESSAGE, "The value is between 5 and 10.")\
Else\
SayFormattedMessage (OT_MESSAGE, "The value is not between 5 and 10.")\
EndIf

In the above example, the compound statement determines if the value
stored in iValue is between 5 and 10.

- If the value stored in iValue is greater than 5 but less than 10, then
  the If statement is true and JAWS speaks, "The value is between 5 and
  10."
- If the value stored in iValue is less than or equal to 5 or greater
  than or equal to 10, then the If statement is false and JAWS speaks,
  "The value is not between 5 and 10.\"

## Compound Statements Using \"Or\"

A compound statement joined by "or" evaluates two or more conditions
before processing continues. Any of the conditions can be true to make
the entire If statement true. If JAWS determines that none of the
conditions are true, then the entire If statement is false. You use two
vertical bars (\|\|) placed next to each other to indicate a compound
statement joined by "or."

### Example 2: A compound statement joined by "or\"

If iValue == 5 \|\| iValue == 10 Then\
SayFormattedMesssage (OT_MESSAGE, "The value is either equal to 5 or
10.")\
Else\
SayFormattedMessage (OT_MESSAGE, "The value is not equal to either 5 or
10.")\
EndIf

In the above statement, the compound statement determines if the value
stored in iValue is equal to 5 or 10.

- If the value is either 5 or 10, the If statement is true and JAWS
  speaks, "The value is either 5 or 10."
- If the value stored in iValue is not equal to 5 or 10, then the If
  statement is false and JAWS speaks, "The value is not equal to 5 or
  10."

## Short Circuit Evaluation

JAWS uses a feature called short circuit evaluation to speed up the
execution of scripts. This feature keeps JAWS from having to evaluate
all parts of the expression whether it is needed or not. Short circuit
evaluation works by evaluating an expression for an \"or condition\"
such that if the first variable condition is true there is no need to
evaluate the second variable condition. In an \"and condition,\" if the
first variable condition is false then there is no need to evaluate the
second condition.

Consider the following if condition:

If (function1() \|\| function2()) then

In versions of JAWS prior to 5.0, both function1 and function2 would be
executed even if function1 returned TRUE. Now however, if function1
returns true then function2 is not executed. In this example, function2
is only executed if function1 returns false. Similarly:

If (f1() && f2()) then

If f1 returns false, f2 will not be evaluated because it will not be
possible for both sides of the \"and\" expression to be true. The
function f2 will only be executed if f1 returns true.

 

  ---------------------------------------------------------- -- -----------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](09-7_Looping.htm){accesskey="x"}
  ---------------------------------------------------------- -- -----------------------------------------

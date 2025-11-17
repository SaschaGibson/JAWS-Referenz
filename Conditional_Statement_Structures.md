# Conditional Statement Structures

Unlike other programming languages, the Freedom Scientific Scripting
language does not allow for case or switch statement structures.
However, the If-ElIf-Else-EndIf statement structure is a very powerful
tool, described below in its various forms and syntax, along with some
code samples.

## Description

The If keyword marks the beginning of an If-EndIf statement. A fully
formulated conditional If statement structure includes:
If\...ElIf\...Else\...EndIf. Any expressions appearing after the If are
used to evaluate whether condition(s) is(are) true. Expressions after
any ElIf statements do the same. For example, can a certain graphics
character be found in the active window?

Every If statement structure must begin and end with the keywords, If
and EndIf. But the keywords, Then and Else, are optional.

If-ElIf-Else-EndIf statement structures always ask whether a condition
or set of conditions is true or false . When a condition is not met
(false), then the actions that follow the Else are processed.

The statements processed when conditions are met typically are calls to
other functions. But also, a common statement to place within an
If-EndIf statement structure is a Return statement. That is, if a
condition is true and processing is performed as a result, you may not
wish to perform any further evaluation of conditions within the current
statement structure. In that situation, place a Return statement after
the function calls you do wish to perform when a condition is true.

For more details on working with Return statements, see [Return
Function.](..\Calling_Scripts_and_Functions\Return_Function.html)

## Syntax

\
\

    If Condition 1
        Statements
    ElIf Condition 2
        Statements
    ElIf Condition #N
        Statements
    Else
        Statements
    EndIf

\

- If Condition 1 is the statement that marks the beginning of the
  conditional statement structure. When this condition evaluates to
  true, all statements following the If Condition 1 statement are
  processed and any ElIf or Else conditions are skipped.
- ElIf Condition #n statements are optional for evaluating further
  conditions beyond the first condition evaluated by the If Condition 1
  statement. #N refers to any number because it is possible to have many
  conditional ElIf statements after the first If statement.
- Else statement is optional and is processed only if all prior
  conditional If and/or ElIf statements have evaluated to false.
- EndIf is the statement that marks the end of the conditional statement
  structure.

## Compound Conditions

You may have compound conditions in an If-EndIf statement structure. For
ease of readability, you should place each statement of a compound
condition statement on its own line. Compound conditions may be \"and\"
as well as \"or\" conditions. use the \"&&\" and \"\|\|\" operators for
this purpose.

When you make an \"and\" compound condition, all the conditions in the
compound statement must evaluate to true in order for statements
following the compound condition to be processed. Conversely, when you
use an \"or\" compound condition, any one of the conditions within the
compound condition may evaluate to true in order for statements
following the compound condition to be processed.

## Nested Conditional Statement Structures

You may nest If-EndIf statement structures. But take care that each
begins and ends with the If-EndIf statements in order that the compiler
does not return an error or that processing yields unpredictable
results. For readability, each nested If-EndIf statement structure
should be indented the appropriate level.

## Remarks

When making compound conditional statements and nested statements, make
sure to indent the statements between each set of conditions. This
greatly improves ease of readability as well as making sure you are
keeping track of what statements you intend to process when a certain
condition evaluates to true.

Use Return statements judiciously to ensure that you test all conditions
you need to evaluate. Guard against returning prematurely, thus
short-circuiting any code that runs after the If-ElIf-Else-EndIf block.
This may or may not be desirable, depending on what you want to
accomplish. The order in which you test conditions is critical.

## Code Samples

### Single Condition

Since \"Then\" is optional, the following two code blocks are
equivalent:

    If MyCondition then ; true
        Statement
    EndIf

    If MyCondition ; true
        statement
    EndIf

If you need statements to be processed when all prior conditions
evaluate to false, your code should look like this:

    If MyCondition ; true
        Statement
    Else ; false
        Statement
    EndIf

### Multiple Conditions

The below code block shows additional conditions testing.

    If MyCondition 1 ; true
        Statements)
    ElIf MyCondition 2 ; true
        Statements)
    ElIf MyCondition #n ; true, #n being however many ElIf condition statements exist in the code block.
        Statements)
    Else ; false, none of the above conditions evaluated to true.
        Statement
    EndIf

### Compound Conditions

The below code blocks show both \"and\" condition testing as well as
\"or\" testing.

    If MyCondition 1 ; true
    && MyCondition 2 ; also true
        Statements)
    ElIf MyCondition 3 ; true
    && MyCondition #n ; also true, #n being however many && condition statements exist in the ElIf code block.
        Statements)
    Else ; false, none of the above conditions evaluated to true.
        Statement
    EndIf

    If MyCondition 1 ; true
    || MyCondition 2 ; or true, one or the other must be true.
        Statements)
    ElIf MyCondition 3 ; true
    && MyCondition #n ; also true, both must be true.
        Statements)
    ElIf MyCondition #n ; true, #n being however many ElIf condition statements exist in the code block.
        Statements)
    Else ; false, none of the above conditions evaluated to true.
        Statement
    EndIf

Adding parentheses around conditions ensures testing is even clearer:

    If (MyCondition 1
    && MyCondition 2) ; both must be true.
        Statements)
    ElIf (MyCondition 3
    && MyCondition 4) ; both must be true,
    || MyCondition 5 ; or this condition by itself must be true.
        Statements)
    Else ; false, none of the above conditions evaluated to true.
        Statement
    EndIf

### Nested Conditions

The below code block shows nesting.

    If MyCondition 1 ; true
        If My NestedCondition A ; true
            Statements)
        EndIf ;end of level 1 nesting
        Return ; no further processing.
    ElIf MyCondition 2 ; true
        Statements)
        If MyNestedCondition B
        && MyNestedCondition C ; both must be true.
            Return ; no further processing.
        ElIf MyNestedCondition D
            Statements
            Return ; no further processing.
        Else ; my nested conditions evaluate to false.
            Statements
        EndIf ; end of nesting conditions level 1.
    Else ; false, none of the above conditions evaluated to true, and so testing continued.
        Statement
    EndIf

### Negative Conditions

The below code block evaluates to true if a condition is not met.
Sometimes it is easier to test for a condition not to be true.

    If Not MyCondition 1 ; true
        Statements)
    EndIf

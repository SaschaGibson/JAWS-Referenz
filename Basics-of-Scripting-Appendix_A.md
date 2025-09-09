# Appendix A: Scripting Language Key Words

Listed below are the key words used in the JAWS scripting language.
These key words are reserved for use by the scripting language and
cannot be used as variable names, function names or script names.

## Const

This key word begins a declaration section of constant values. All
constant declarations follow on subsequent lines. The const key word
must appear outside of any individual script or function. You can
normally find constant definitions at the top of a script file or within
a JAWS script header file.

## EndFunction

This key word terminates the definition of an individual user-defined
function. Each user-defined function must be terminated with
EndFunction. The Script Manager automatically places this key word into
your script when you use the New Script dialog to create a user-defined
function.

## ElIf

This key word offers a second way of creating a branch in an If
statement structure. The ElIf key word is followed by a condition that
JAWS evaluates. When the condition is found to be true, any statements
following the ElIf are performed by JAWS.

## Else

This key word is an optional part of an If-Then-EndIf statement
structure. The Else key word provides for a second branch in an If
statement structure. When the preceding If statement is false, then any
statements following this key word are performed by JAWS.

## EndFor

This key word terminates the For loop statement structure. Each For loop
must be terminated with this key word. All statements placed between the
For key word and this key word are performed by JAWS while the condition
being evaluated in the For statement structure is true.

## EndIf

This key word marks the end of an If-Then-Else-EndIf statement
structure. The EndIf key word is always required to terminate any If
statement structure.

## EndScript

This key word terminates the definition of an individual script. JAWS
automatically places this key word into your script file when you use
the New Script dialog from within the Script Manager to create a script.
Each script must be terminated by this key word.

## EndWhile

This key word terminates the While loop statement structure. Each While
loop must be terminated with this key word. All statements placed
between the While key word and this key word are performed by JAWS while
the condition being evaluated in the While statement structure is true.

## For

The For key word begins the For loop statement structure. The For key
word must be followed by a statement that dictates how many times the
loop should execute. While the condition in the For statement structure
is found to be true, the loop continues to be processed. Once the
condition becomes false, the loop terminates.

## Function

This key word designates the beginning of a user-defined function. The
key word is preceded by the return type of the function. The name of the
user-defined function follows this key word along with any parameters
the function requires enclosed in parentheses.

## Globals

This key word begins a declaration section of global variables. All
global variable declarations follow on subsequent lines. The Globals key
word must appear outside of any individual script or function. You can
normally find global variable declarations at the top of a script file
or within a JAWS script header file.

## Handle

This key word begins the definition of a handle variable type. The name
of the variable follows this key word as in handle hMyHandle.

## If

This key word marks the beginning of an If-Then-Else-EndIf structure. A
fully formulated statement includes: If, Then, Else, and EndIf. If
statements evaluate a condition, that is part of the statement
structure. When the condition being evaluated is true, then JAWS
performs any statements following the If statement.

## Int

This key word begins the definition of an integer variable type. The
name of the variable follows this key word as in int iMyInteger.

## Not

This key word reverses the question asked by an If statement structure.
The key word is placed between the If key word and the condition being
evaluated.

## Object

This key word begins the definition of an object variable. The name of
the variable follows the key word as in object oMyObject.

## Return

This key word terminates execution of the function in which it appears.
When you use this key word to return a value from a function, the
information to be returned must follow the return key word. Control,
along with any value, is then returned to the calling script or
function. Since a script cannot return values, using the return key word
within in a script terminates the script at the point the key word is
used.

## Script

This key word designates the beginning of an individual script. This key
word precedes the actual name of the script. Each time you use the New
Script dialog in Script Manager to create a script, this key word, along
with the script name, is placed in the script file automatically.

## Then

This key word follows the condition being evaluated in either an If
statement or and ElIf statement.

## String

This key word begins the definition of a string variable. The name of
the variable follows the key word as in string sMyString.

## Var

This key word begins a declaration section of local variables. All local
variable declarations follow on subsequent lines. The Var key word must
appear within an individual script or function. The first line of a
script or function usually contains the Var key word as local variables
must be declared before they can be used.

## While

The While key word begins the While loop statement structure. The While
key word must be followed by a conditional statement that is evaluated
each time the loop is repeated. While the condition in the While
statement structure is found to be true, the loop continues to be
processed. Once the condition becomes false, the loop terminates.

 

  ---------------------------------------------------------- -- ---------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](Appendix_B.htm){accesskey="x"}
  ---------------------------------------------------------- -- ---------------------------------------

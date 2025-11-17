# 9.7 Looping

You can use the iterative statement structure to perform the same
statement or group of statements repeatedly while a condition is true.
This type of flow control is also referred to as \"looping\". You can
use a loop in your script to perform a sequence of statements several
times. A loop essentially shortens the number of statements required.
Looping provides a way to determine the number of repetitions
automatically, based on evaluations made in your script.

## The While-EndWhile Statement Structure

You use the While-EndWhile statement structure to perform Looping. A
While Loop repeats or loops WHILE a condition is true. A While loop
consists of three parts:

- The While key word that begins the loop
- the condition to be tested each time the loop iterates or is performed
- the EndWhile key word that ends the loop

JAWS performs all statements within the boundaries of the While and
EndWhile key words repeatedly until the condition in the While statement
becomes false.

### Example 1: While-EndWhile loop structure

Var\
Int iCount\
let iCount = 1 ;Assign the value of 1 to the variable\
While iCount \< 5 ; this loop will be performed 4 times\
; Statements to be performed go here\
Let iCount = iCount + 1 ; Increases the value of iCount so the While
condition will become false after 4 iterations\
EndWhile

In the above example, JAWS performs the While loop while iCount is less
than five. Once the value of iCount becomes equal to 5, the loop ends
and no further processing occurs.

The For-EndFor Statement Structure

Another method of performing looping in your scripts is by using the
For-EndFor looping statements. Similar to a While loop, a For loop
consists of three parts: the keyword For that starts the loop, the
condition being tested, and the EndFor keyword that terminates the loop.
JAWS performs all statements found in the boundaries of the loop as long
as the loop condition is true. An example of the syntax of a For loop
follows.

For x = Start to End\
\...Statements to be performed go here\
EndFor

The value of x must be an integer variable and the values of Start and
End must be integers, integer variables, or integer constants. The major
difference between the While and For looping structures is that a For
loop will run a predetermined number of times. An example of the use of
a For loop follows.

Var\
int iCounter\
For iCounter = 1 to 10; Loop will execute 10 times\
SayInteger(iCounter); Speak the value of the iCounter variable\
EndFor

In the above example the For loop will execute ten times. As set by the
For statement, the iCounter variable starts with a value of 1 and
increments by 1 each time the loop executes. Notice that the iCounter
variable is automatically incremented each time the loop executes. At
the end of the tenth loop iteration the value of icounter becomes 11 and
the For statement is no longer true thus ending the loop. Each time the
loop executes the SayInteger function speaks the value of iCounter. When
this script is run you will hear JAWS count from one to ten.

**NOTE:** Since a loop continues until a condition becomes false, you
must be careful not to set up a loop with a condition that will never
become false. To do so would create an infinite loop, which will cycle
forever, and lock up the computer until the program is terminated
manually. Think carefully about the condition meant to terminate the
loop to be sure it will become false at some time. If you find that the
computer seems to lock up after you execute a new script with a While
loop in it, this is probably what is happening. For loops are less
likely to cause an infinite loop because beginning and ending values are
explicitly set in the For statement.

## Avoiding Infinite Loops

When you use a While loop in your script, care should be taken not to
create an infinite loop. An infinite loop occurs when the condition in
the While statement is not satisfied. The loop will continue to run
until you manually end the program. This often causes a computer to lock
up and may require the computer be restarted. Since JAWS performs a loop
until a condition is met, you must be certain that the condition being
tested can be satisfied. One way to avoid this problem while designing
While loops is to include statements designed to end the loop after a
certain number of repetitions.

### Example 2: Ending a loop after a certain number of iterations

Var\
int iSafety\
Let iSafety = 1\
While iSafety \< 10\
; Loop statements go here\
Let iSafety = iSafety + 1 ; Increase the value of iSafety by one so it
will eventually reach ten and end the loop\
EndWhile

In the above example, the iSafety variable is initialized to the value
of 1.

- The loop checks the value of the iSafety variable each time it
  repeats.
- Inside the While loop, the iSafety variable is incremented by one to
  count the number of repetitions of the loop.
- When the value of iSafety reaches 10, the While statement becomes
  false and the loop no longer executes.

A second example of the use of the While statement follows. This example
could be used to move down through a menu until a specific item is
found.

### Example 3: Looping through a menu

Var\
int iExitLoop,\
string sSearch\
let iExitLoop = 0; set the value of the variable to zero\
let sSearch = "Open"; assign the string value of \"Open\" to the sSearch
variable\
TypeKey ("ALT+F"); Activates the file menu\
While iExitLoop == 0\
NextLine (); Moves the position to the next line\
If StringContains (GetLine (), sSearch) == TRUE Then; We found the word
\"Open\" in the menu item\
EnterKey (); Passes the ENTER key through to the application just like
pressing it from the keyboard\
let iExitLoop = 1; Set the value of the iExitLoop variable to 1. This
will end the loop\
EndIf\
EndWhile

In the above example, two variables are set before the While loop
begins.

- The value of the iExitLoop variable is set to zero.
- The value of the sSearch variable is then set to the value of "Open".
  The sSearch variable contains the string of text you want to locate in
  the menu item as you move down through the menu.
- The While loop repeats until the value of iExitLoop changes from zero
  to one.
- The first statement in the while loop, NextLine, moves the active
  cursor down one line.
- After the cursor is moved, the String Contains function checks to see
  if the highlighted menu item contains the string, "Open."
- If "Open" is found in the menu item, then the If statement is found to
  be true and the value of iExitLoop is changed from zero to one.
- When the value of iExitLoop becomes one, the While statement will no
  longer be true and the loop will stop executing.

If running the above script, it is possible JAWS could end up in an
infinite loop. If the file menu does not have an option with the word,
\"Open\" in it, the value of the iExitLoop variable will never be set to
one. This means the While statement will always be true and the loop
will never end. In order to prevent this from happening, we need to let
the iExitLoop variable act as a counter that will reach a certain value
and cause the loop to end. Here is the example written again using a
counter to insure the loop will end, even if the word, \"Open\" is not
found in the menu.

### Example 4: Using a counter to end a loop

Var\
int iExitLoop,\
string sSearch\
let iExitLoop = 0; set the value of the variable to zero\
let sSearch = \"Open\"; assign the string value of \"Open\" to the
sSearch variable\
TypeKey (\"ALT+F\"); Activates the file menu\
While iExitLoop \< 15; This insures the loop will be forced to end after
15 iterations if \"Open\" is not found\
NextLine (); Moves the position to the next line\
If StringContains (GetLine (), sSearch) == TRUE Then; We found the word
\"Open\" in the menu item\
EnterKey (); Passes the ENTER key through to the application just like
pressing it from the keyboard\
let iExitLoop = 15; Set the value of the iExitLoop variable to 15. This
will end the loop\
EndIf\
let iExitLoop = iExitLoop + 1; Increases the value of iExitLoop by 1.
When the value becomes 15, the loop will end (even if \"Open\" was not
found in the menu.) EndWhile

This example differs from the previous example in the following ways:

- The While statement runs as long as the value of iExitLoop is less
  than 15.
- If the word, \"Open\" is found in a menu item, the value of iExitLoop
  is set to 15. This insures the loop will end.
- During each iteration of the loop, the value of iExitLoop is
  incremented by one. This means that even if the search string is not
  found, the loop will end when iExitLoop is incremented to 15.

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](09-8_ChapterExercises.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------

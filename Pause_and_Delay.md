# Keywords: Pause, Delay

\

## Description

Sometimes Pause and/or Delay statements are needed for slower PCs to
process your scripts and functions efficiently. When you pass keystrokes
from within your scripts or functions, or when you need to give time for
a system event to catch up to your script or function, you may need to
direct your script or function to wait to continue processing. However,
Pause and Delay statements should only be used where events are not
available, or where scheduling a function is undesirable. So the code
samples below are for illustration only.

The Pause and Delay functions differ in how much time and how much
control they allow for the system to catch up with your script or
function. The Pause function forces your script or function to stop
processing so that other applications can complete tasks, but you cannot
control the amount of time of that forced stop. Alternatively, the delay
function lets you specify the amount of time in tenths of a second your
script or function should wait before continuing to process
instructions.

## Pause

A pause statement causes JAWS to yield to the time requirements of other
applications. Once other applications complete their tasks, JAWS resumes
processing the script or function.

### Syntax

\
Pause ()\

### Remarks

Never place a Pause statement inside a While loop as it will cause very
unpredictable results and may even result in a JAWS crash.

### Code Sample

The below code sample passes a keystroke through to the application, and
waits for a menu to be activated. Before JAWS performs the TypeKey
function, the MenusActive function must determine if the menu bar is
open. Once the menu is activated, it passes another specific keystroke.
But if the menu is not activated, the code causes an error message to be
processed.

    TypeKey (skMyMenuKeystroke) ; Open the File menu.
    Pause () ; Allow system to open the menu.
    If MenusActive () then ; Make sure the menu bar opened.
        TypeKey (skMyOptionKeystroke) ; Activate the option desired .
    Else
        SayFormattedMessage (OT_ERROR, smsgError_MenuBar) ; menu bar did not open error message.
    EndIf

\

## Delay

A Delay statement gives you much more control than the Pause statement
to wait to continue processing your script. Since the Pause function
relies on other system processes, the amount of time your script is
stopped can vary from system to system. If this amount of time is not
enough for your script to process correctly and consistently, use Delay
statements.

### Syntax

\
Delay (nTimeValue, nNoEvents)\
\

- nTimeValue is required. It is a positive integer value, indicating the
  length of time in tenths of a second that the script or function
  should wait before continuing to process its instructions.
- nNoEvents is an optional second parameter. It is a numeric value,
  indicating to JAWS whether to suppress checking for, and processing,
  FocusChangedEvent and NewTextEvent functions before returning from the
  delay. When you pass this second optional parameter as TRUE, JAWS
  suppresses any processing of the FocusChanged or NewText events. But
  when you pass the parameter as FALSE, JAWS does not suppress the
  processing of these two events.

### Code Samples

In the first code sample, the first TypeKey function activates the menu.
JAWS then performs the Delay function to allow three tenths of a second
for the menu to open. The MenusActive function then determines if the
menu is open. If it is open, then JAWS performs the second TypeKey
function and the menu option is activated. Otherwise, JAWS processes an
appropriate error message.

    TypeKey (skMyKeystroke) ; Open the File menu.
    Delay (3) ; Allow system to open the menu.
    If MenusActive () then
        TypeKey (skMyMenuOptionKeystroke) ; Activate the menu option.
    Else
        SayFormattedMessage (OT_ERROR, smsgError_MenuBar) ; The menu bar did not open.
    EndIf

The second code sample is similar, except that the second optional
parameter is used in the Delay statement. This forces JAWS to wait at
least the three seconds for the menu to open because the nNoEvents
parameter is set to TRUE. If it were set to FALSE, JAWS would not force
the time limit to expire before continuing to process the function. In
that case, JAWS simply would wait for focus changes to occur, and if the
menu became active prior to the three seconds\' time limit set by the
first parameter, processing of function instructions would just
continue. But setting the second parameter to TRUE ensures that JAWS
will wait at least those three seconds before continuing to process
function instructions.

    TypeKey (skMyKeystroke) ; Open the File menu.
    Delay (3, TRUE) ; Allow system to open the menu but do not suppress event changes.
    If MenusActive () then
        TypeKey (skMyMenuOptionKeystroke) ; Activate the menu option.
    Else
        SayFormattedMessage (OT_ERROR, smsgError_MenuBar) ; The menu bar did not open.
    EndIf

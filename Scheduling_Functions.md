# Scheduling Functions

There are several types of scheduling functions. Each type is described
briefly below with its keyword, descriptions, syntax, returns, remarks
(if any), and a code sample. Functions include:

- ScheduleFunction and UnscheduleFunction
- QueueFunction
- ScheduleFunctionAfterWindowGainsFocus
- SetFocusToWindowAndScheduleFunction

Note: You may schedule a script rather than a function by preceding the
name of the script to be called with a dollar sign (\$). (See the
QueueFunction code sample below.)

In the code samples for each of the functions shown, Notepad is assumed
to be the application, and the Script Manager is assumed to be the text
editor. But of course, you may test these samples with your own
applications.

## Keywords: ScheduleFunction, UnscheduleFunction

\

### Description

Unlike Pause and Delay, ScheduleFunction and UnScheduleFunction
statements give you much more control over postponing processing of
succeeding statements in your scripts and functions. As with delay
statements, these statements let you control the time to wait. But they
also let you specify the process that must complete in order for
succeeding statements to continue processing in your own scripts and
functions.

Schedule a function to run a user defined function in a set period of
time. this is very useful when you want to perform a task and then check
on the results at a specified later time. Use UnscheduleFunction if you
want to cancel a scheduled function before it has run. Very often, the
return value from a ScheduleFunction call is placed into a global
variable so that a different script or function can make the related
UnscheduleFunction call conditionally.

### Syntax

\
ScheduleFunction (FunctionName, Time)\
And\
UnscheduleFunction (ID)\
\

- For ScheduleFunction, FunctionName is a string representing the name
  of the function to be executed on a schedule.
- For ScheduleFunction, Time is an integer representing the amount of
  time in tenths of a second to elapse before the function is executed.
- For UnscheduleFunction, ID is the integer value returned by the
  ScheduleFunction call.

#### Returns

ScheduleFunction returns an integer ID that you can use to call
UnScheduleFunction. If ScheduleFunction returns 0, it means that the
timer was not set successfully.

UnscheduleFunction returns an integer value of TRUE if the call was
found and canceled. Otherwise UnscheduleFunction returns FALSE.

### Remarks

Once ScheduleFunction is called, call UnScheduleFunction to cause the
user-defined event not to run.

UnscheduleFunction is used to cancel a ScheduleFunction call.
UnscheduleFunction cannot be used without a call to ScheduleFunction.

### Code Sample

Open Notepad and type a one-line sentence. then place the cursor at the
beginning of the line. Use Script Manager to create the following
example. This sample code gets the word at the cursor and speaks it.
Then the code schedules a function to get the word at the cursor and
spell it 5 seconds later as long as the script has not been reactivated.
If the script has been reactivated, the code cancels the function to
spell the word at the cursor and starts over again.

    Globals
        Int ScheduleID

    Void Function SpellIt ()
    ; Set the id to 0 so that we can test elsewhere if the function has already run.
    ScheduleID = 0
    ; Now spell the word.
    SpellString (GetWord ())
    EndFunction

    Script MyScheduleTest ()
    ; First, test if your user-defined function, SpellIt, is waiting to run; if so, cancel it.
    If ScheduleID != 0
        UnscheduleFunction (ScheduleID)
    EndIf
    SayString (GetWord ())
    ; Now schedule your user-defined function, SpellIt, to run 5 seconds later,
    ; and save the schedule ID so it can be tested to see if the function has run.
    ScheduleID = ScheduleFunction ("SpellIt",50)
    EndScript

\

## Keyword: QueueFunction

\

### Description

Use this function to run the function being queued the next time JAWS
stops speaking. You may call QueueFunction multiple times in a row, but
you may queue only one function at a time. Functions are run in the
order you add them to the queue. Stopping speech by pressing control or
performing another such action clears the queue.

You can also queue scripts using QueueFunction. To queue a script
instead of a function, precede the name of the script to be queued with
the dollar sign (\$).

### Syntax

\
QueueFunction (\"FunctionName (parameter list)\")\
\

- FunctionName is a string containing a function name. It must be
  enclosed in quotation marks.
- Follow the function name by parentheses, and include the function\'s
  parameter list (but not as variable names) inside those parentheses.
  This is similar to how you call a function normally.

#### Returns

Returns the integer 1 if the function was queued.

Returns the integer 0 if the function was not queued.

### Code Sample 1

In the below code sample, each time the user presses INSERT+UpArrow to
have the current line in Notepad spoken, JAWS is queued to speak the
word at the cursor of the current line after speaking the line itself.

    Script SayLine ()
    SayLine ()
    QueueFunction ("SayWord ()")
    EndScript

### Code Sample 2

In the below code sample, each time the user presses INSERT+UpArrow to
have the current line in Notepad spoken, JAWS is queued to speak the
word, \"Hello\", after speaking the line itself. Notice that the
parameter for the SayString function has a backslash (\\) before the
quotation marks. This is because JAWS needs the backslash prior to the
quotation marks in order to interpret the quotation marks properly when
they are being used in the manner shown by this sample.

    Script SayLine ()
    SayLine ()
    QueueFunction ("SayString (\"Hello!\")")
    EndScript

### Code Sample 3

In the below example, the code queues the SayToCursor script. If the
dollar sign were omitted, QueueFunction would look for a function to
queue instead of a script. For testing in Notepad, place the cursor at
different locations on the text you have written. Then press
INSERT+UpArrow. You will hear the line spoken, and then spoken again but
only up to the current cursor location (not including it) as if you had
pressed INSERT+Home.

    Script SayLine ()
    SayLine ()
    QueueFunction ("$SayToCursor ()")
    EndScript

## Keyword: ScheduleFunctionAfterWindowGainsFocus

\

### Description

This function is probably most useful when you know the handle of an
application that will soon gain focus and you want something specific to
happen when it does. For instance, you might use it in a situation where
a configuration setting is modified for an application that will soon
gain focus and where the changed configuration should result in some
specific behavior. So use this function to schedule a function to run
the next time a given window gains focus.

The function is scheduled using the same mechanism that is used by a
call to ScheduleFunction . In effect, ScheduleFunction is called to
schedule the function specified by the FunctionName parameter the next
time a Focus Changed Event occurs and the window handle of the window
that just gained focus is the same as the window handle specified by the
hwnd parameter.

Also, keep in mind that while the ScheduleFunction time parameter is in
tenths of a second, the ScheduleFunctionAfterWindowGainsFocus time
parameter is in milliseconds.

### Syntax

ScheduleFunctionAfterWindowGainsFocus (hwnd, \"FunctionName\", Timeout)\
\

- hwnd is the window handle of the window to wait to gain focus before
  scheduling the function.
- FunctionName is the name of the function to be executed. It must be
  enclosed in quotation marks.
- TimeOut is an integer value representing the maximum amount of time in
  milliseconds that the function should wait before canceling the
  scheduled function.

#### Returns

Returns an integer TRUE when the specified function was scheduled
successfully .

Returns an integer FALSE when the function was not scheduled
successfully.

### Remarks

Unlike the value returned by a ScheduleFunction call, the value returned
by a ScheduleFunctionAfterWindowGainsFocus call is not an ID. So you
cannot use the return value from ScheduleFunctionAfterWindowGainsFocus
for a latter call to UnScheduleFunction. The value returned by
ScheduleFunctionAfterWindowGainsFocus indicates whether the function was
scheduled successfully. Currently there is no mechanism for unscheduling
a function that is scheduled using
ScheduleFunctionAfterWindowGainsFocus.

Another key difference between using
ScheduleFunctionAfterWindowGainsFocus and using ScheduleFunction is that
only one function can be scheduled at a time using
ScheduleFunctionAfterWindowGainsFocus. If you call
ScheduleFunctionAfterWindowGainsFocus when a function that was
previously scheduled using this function has not yet been called, the
function will not be scheduled, and
ScheduleFunctionAfterWindowGainsFocus will return FALSE. The function
specified by the FunctionName parameter is scheduled at the end of focus
change event processing after any necessary scripts have been loaded and
the FocusChangedEvent function has been called.

ScheduleFunctionAfterWindowGainsFocus returns immediately without
waiting for the specified amount of time. Instead, whenever a
FocusChanged event is processed, JAWS checks to determine whether there
is an unprocessed request to schedule a function after a given window
gains focus. If there is such a scheduled function call, and if the
function has timed out, the scheduled function is canceled.

### Code Sample

In the below example, since the function is scheduled when the window
gains focus, it will only run if the window looses and regains focus
within the time limit set by the third parameter. We overwrite
FocusChangedEvent in the Notepad script. but of course, this may be
tested elsewhere. The function first calls the default FocusChangedEvent
function using the \"Scope\" capabilities of the Scripting language. We
use ScheduleFunctionAfterWindowGainsFocus so that when Notepad gains
focus into its document window, SayAll automatically starts, but only if
not in an active dialog. The scheduled call is canceled after five
seconds.

    Const
        fn_GoToTopAndSayAll = "GoToTopAndSayAll",
        FiveSec = 5000

    Void Function GoToTopAndSayAll ()
    JAWSTopOfFile ()
    SayAll ()
    EndFunction

    Void Function FocusChangedEvent (Handle hwndFocus, Handle hwndPrevFocus)
    default::FocusChangedEvent (hwndFocus, hwndPrevFocus)
    If Not DialogActive () then
        ScheduleFunctionAfterWindowGainsFocus (hwndFocus, fn_GoToTopAndSayAll, FiveSec)
    EndIf
    EndFunction

## Keyword: SetFocusToWindowAndScheduleFunction

\

### Description

Use this function to set focus to a window and schedule a function to
run after that window gains focus. This function first uses
ScheduleFunctionAfterWindowGainsFocus to schedule the function, and then
uses the SetFocus function to set focus to the window. All the comments
in the description of the ScheduleFunctionAfterWindowGainsFocus function
apply to SetFocusToWindowAndScheduleFunction.

### Syntax

\
SetFocusToWindowAndScheduleFunction (hwnd, \"functionName\", Timeout)\
\

- hwnd is the window handle of the window to wait to gain focus before
  scheduling the function.
- FunctionName is a string representing the name of the function to be
  executed. the function name must be enclosed in quotation marks.
- TimeOut is an integer value representing the maximum amount of time in
  milliseconds that the function should wait before canceling the
  scheduled function.

#### Returns

Returns an integer TRUE when the function was successfully scheduled and
focus was set to the window.

Returns an integer value of FALSE if the function was not scheduled
successfully.

### Remarks

SetFocusToWindowAndScheduleFunction returns immediately without waiting
for the specified amount of time. Instead, whenever a Focus Changed
event is processed, JAWS checks to determine whether there is an
unprocessed request to schedule a function after a given window gains
focus. If there is, and the function has timed out, the scheduled
function is canceled.

### Code Sample

The below code sample overwrites FocusChangedEvent in the Notepad
script. but of course, this may be tested elsewhere. The function first
calls the default FocusChangedEvent function using the \"Scope\"
capabilities of the Scripting language. Then we test for a dialog to be
active. If so, we use SetFocusToWindowAndScheduleFunction so that when a
dialog gains focus, the current control is repeated. The scheduled call
is canceled after five seconds.

    Function FocusChangedEvent(Handle hwndFocus, Handle hwndPrevFocus)
    default::FocusChangedEvent(hwndFocus, hwndPrevFocus)
    If DialogActive () then
        SetFocusToWindowAndScheduleFunction (hwndFocus,"SayObjectTypeAndText",50000)
    EndIf
    EndFunction

## Additional Resources

[Calling Scripts and Functions](../Calling_scripts_and_Functions.html)

[Reference Guide](../Reference_Guide.html)

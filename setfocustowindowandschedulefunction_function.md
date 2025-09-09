# Function: SetFocusToWindowAndScheduleFunction

## Description

This function may be used to set focus to a window and schedules a
function to run after that window gains focus. This function first uses
the ScheduleFunctionAfterWindowGainsFocus function to schedule the
function and then uses the SetFocus function to set focus to the window.
All the comments in the description of the
ScheduleFunctionAfterWindowGainsFocus function apply to this function.

## Returns

Type: int\
Description: TRUE when the function was successfully scheduled and focus
was set to the window. FALSE otherwise.\

## Parameters

### Param 1:

Type: Handle\
Description: The window handle of the window to wait to gain focus
before scheduling the function.\
Include: Required\

### Param 2:

Type: String\
Description: Name of function to be executed.\
Include: Required\

### Param 3:

Type: Int\
Description: Maximum amount of time, in milliseconds, that the function
should wait before canceling the scheduled function. Note that this
script function returns immediately without waiting for the specified
amount of time. Instead, whenever a Focus Changed event is processed a
check is performed to determine whether or not there is an unprocessed
request to schedule a function after a given window gains focus. If
there is and the function has timed out, the scheduled function is
canceled.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 14.00 and later

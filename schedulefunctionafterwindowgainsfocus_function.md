# Function: ScheduleFunctionAfterWindowGainsFocus

## Description

This function may be used to schedule a function to run the next time a
given window gains focus. The function is scheduled using the same
mechanism that is used by the ScheduleFunction function. The
ScheduleFunction function will be called to schedule the function
specified by the FunctionName parameter the next time a Focus Changed
Event occurs and the window handle of the window that just gained focus
is the same as the window handle specified by the hwnd parameter. Unlike
the ScheduleFunction function, the value returned by the
ScheduleFunctionAfterWindowGainsFocus is not an ID that can be used for
a latter call to UnScheduleFunction. Instead the value returned by this
function indicates whether or not the function was scheduled
successfully. Currently there is no mechanism for un-scheduling a
function that is scheduled using this function. Another key difference
between this function and the ScheduleFunction function is only one
function can be scheduled at a time using this mechanism. If
ScheduleFunctionAfterWindowGainsFocus is called when a function that was
previously scheduled using this function has not yet been called, the
function will not be scheduled and this function will return FALSE. The
function specified by the FunctionName parameter will be scheduled at
the end of focus change event processing, after any necessary scripts
have been loaded and the FocusChangedEvent function has been called.

## Returns

Type: int\
Description: TRUE when the specified function was successfully
scheduled. FALSE otherwise.\

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

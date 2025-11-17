This function is available in the following releases:

1.  [JAWS 4.51-19.0](#_JAWS4.51-19.0)
2.  [JAWS 20.0 and later](#_JAWS20.0andlater)

# []{#_JAWS4.51-19.0} Function: ScheduleFunction

## Description

Runs a user defined function in a set period of time. Useful when you
want to perform a task and then check on the results at a later time.
Once this function is used, you can call UnScheduleFunction to cause the
user-defined event not to run.

## Returns

Type: Int\
Description: An ID that can be used to call UnScheduleFunction. If 0 is
returned, then the timer was not successfully set.\

## Parameters

### Param 1:

Type: String\
Description: Name of function to be executed.\
Include: Required\

### Param 2:

Type: Int\
Description: Amount of time to elapse before the function is executed.
Time is measured in tenths of a second. A value of 10 is one second.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51-19.0

# []{#_JAWS20.0andlater} Function: ScheduleFunction

## Description

Runs a user defined function in a set period of time. Useful when you
want to perform a task and then check on the results at a later time.
Once this function is used, you can call UnScheduleFunction to cause the
user-defined event not to run.

## Returns

Type: Int\
Description: An ID that can be used to call UnScheduleFunction. If 0 is
returned, then the timer was not successfully set.\

## Parameters

### Param 1:

Type: String\
Description: Name of function to be executed.\
Include: Required\

### Param 2:

Type: Int\
Description: Amount of time to elapse before the function is executed.
Time is measured in tenths of a second. A value of 10 is one second.\
Include: Required\

### Param 3:

Type: int\
Description: This parameter ensures that the function is automatically
unscheduled if a focus change or menu mode change occurs, or a key is
pressed, prior to the scheduled function being run.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 20.0 and later

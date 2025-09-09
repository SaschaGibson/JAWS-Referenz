# Function: QueueFunction

## Description

The given function will run the next time jaws stops speaking. Multiple
functions may be queued. Functions are run in the order they are added
to the queue. Stopping speech by pressing control or performing another
such action will clear the queue.

## Returns

Type: int\
Description: 1 if the function was queued, 0 otherwise\

## Parameters

### Param 1:

Type: string\
Description: A string containing a function name. The function name
should be followed by parentheses like a normal function call. integers
and quoted strings may be included in the parameter list inside the
parentheses\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 14.00 and later

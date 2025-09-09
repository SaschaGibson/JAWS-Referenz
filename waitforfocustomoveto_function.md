# Function: WaitForFocusToMoveTo

## Description

This function waits to return until the specified object has gained
focus, or the timeout has elapsed. It is used to wait for MSAA objects
to receive focus, so you should not simply use zeros for parameters 2
and 3. You can get the necessary handle, object ID, and child ID that
identify the MSAA object with the function GetFocus.

## Returns

Type: int\
Description: True if this function returned because the specified object
gained focus. False if this function returned because the timeout
elapsed.\

## Parameters

### Param 1:

Type: handle\
Description: Handle of the window that is expected to receive focus.\
Include: Required\

### Param 2:

Type: int\
Description: Object ID of the object that is expected to receive focus.\
Include: Required\

### Param 3:

Type: int\
Description: Child ID of the object that is expected to receive focus.\
Include: Required\

### Param 4:

Type: int\
Description: Maximum amount of time, in milliseconds, that the function
should wait before returning if the specified object does not receive
focus.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 10.0 and later

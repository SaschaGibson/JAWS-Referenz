# Function: UserBufferVirtualWindowDeactivate

## Description

Called by function ExitUserBuffer to handle deactivation of user buffers
with window names. Typically, these virtual windows do not allow the
Escape key to dismiss the user buffer because they are controls
presented as virtualized text.

## Returns

Type: int\
Description: True if the user buffer was deactivated, false otherwise.\

## Parameters

### Param 1:

Type: string\
Description: the window name belonging to the user buffer.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 21.0 and later

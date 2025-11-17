# Function: HJDialogObjStateChangeSpoken

## Description

called by ObjStateChangedEvent to perform any special processing of
object state change occuring in an HJDialog.

## Returns

Type: int\
Description: true if any special handling of state change was processed
for an HJDialog, false otherwise.\

## Parameters

### Param 1:

Type: Handle\
Description: Handle of the window whose state, or whose child object\'s
state, has changed.\
Include: Required\

### Param 2:

Type: int\
Description: The type of the object.\
Include: Required\

### Param 3:

Type: int\
Description: The changed state, which is the difference between the old
state and the current state.\
Include: Required\

### Param 4:

Type: int\
Description: The current state.\
Include: Required\

### Param 5:

Type: int\
Description: The old state.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 8.10 and later

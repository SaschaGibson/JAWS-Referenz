# Function: ObjStateChangedEvent

## Description

By default, this function will now speak the checked and not checked
status as the object\'s state changes. In doing so, we are no longer
reliant on the KeyPressedEvent function.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Handle\
Description: Handle of the window whose state, or whose child object\'s
state, has changed.\
Include: Required\

### Param 2:

Type: int\
Description: The type of the object.\
Include: Optional\

### Param 3:

Type: int\
Description: The changed state, which is the difference between the old
state and the current state.\
Include: Optional\

### Param 4:

Type: int\
Description: The current state.\
Include: Optional\

### Param 5:

Type: int\
Description: The old state.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

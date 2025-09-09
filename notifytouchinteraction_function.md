# Function: NotifyTouchInteraction

## Description

Informs windows that the user has just used touch to activate the
control at the specified location on the screen. This is required in
order for the system to activate the onscreen keyboard if appropriate.
This is a wrapper of the Windows accNotifyTouchInteractionFunction.

## Returns

Type: int\
Description: True if successful, false otherwise\

## Parameters

### Param 1:

Type: handle\
Description: The window containing the touch point\
Include: Required\

### Param 2:

Type: int\
Description: The x coordinate of the touch point\
Include: Required\

### Param 3:

Type: int\
Description: The y coordinate of the touch point\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 16.0 and later

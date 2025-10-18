# Function: FocusChangedEvent

## Description

The window handles of the previous and current windows are passed to
this function. This function calls either SayWindowTypeAndText
SayFocusedWindow or SayFocusedObject in order to ensure that the active
control is properly spoken.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Handle\
Description: the handle of the window that has received the focus.\
Include: Required\

### Param 2:

Type: Handle\
Description: the handle of the window that previously had the focus.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

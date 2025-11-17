# Function: IsWindowVisible

## Description

Checks the visual status of the window. This function will return true
even if the window is completely covered by other windows. See function
IsWindowObscured for a way to find out if a particular window is
covered. Returns TRUE if the Window is visible on the screen, FALSE if
the window is not visible on the screen.

## Returns

Type: Int\
Description: TRUE if window on screen, FALSE otherwise.\

## Parameters

### Param 1:

Type: Handle\
Description: Handle of window to check. This can be obtained through the
GetFocus or GetCurrentWindow functions.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

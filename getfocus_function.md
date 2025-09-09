# Function: GetFocus

## Description

Obtains the window handle for the window that has the focus. It always
seeks the PC cursor or highlighted item that has the focus. It does not
take into account which cursor is active. In contrast, the
GetCurrentWindow function is less sophisticated. It simply obtains the
handle for the window in which the active cursor is located.

## Returns

Type: Handle\
Description: Provides the window handle for the window with the focus.\

## Parameters

### Param 1:

Type: int\
Description: MSAA object ID for the object with focus. Available in Jaws
11 update 1 and later.\
Include: Optional\

### Param 2:

Type: int\
Description: MSAA child ID for the object with focus. Available in Jaws
11 update 1 and later.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

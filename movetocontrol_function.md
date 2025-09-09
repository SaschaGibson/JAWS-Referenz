# Function: MoveToControl

## Description

Moves the active cursor to a specific control within a window. Although
primarily useful inside dialog boxes, the function can be used in any
window where child controls have unique identifiers obtained with
GetControlID. It can also be used in SDM windows with the identifiers
obtained using SDMGetFirstControl, SDMGetLastControl, SDMGetFocus, and
so on. If the PC cursor is on when this function is called, the JAWS
cursor is turned on automatically. Otherwise, the active cursor is used

## Returns

Type: Int\
Description: TRUE if successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: Handle\
Description: Handle of window containing the control of interest.\
Include: Required\

### Param 2:

Type: Int\
Description: ID of desired control.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

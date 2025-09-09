# Function: MoveToWindow

## Description

Moves the active cursor to the specified window. If the window contains
text, then the cursor is positioned on the first character. Otherwise,
it is positioned at the center of the window. If the PC cursor is active
when this function is used, then the JAWS cursor is activated and it is
moved to the new position.

## Returns

Type: Int\
Description: \"WAS_SUCCESSFUL\" = 1 (window was found),
\"WAS_NOT_SUCCESSFUL\" = 0 (window was not found).\

## Parameters

### Param 1:

Type: Handle\
Description: Type the name of a variable or choose a script function
that indicates the window handle where the active cursor is to be
moved.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

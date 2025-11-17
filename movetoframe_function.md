# Function: MoveToFrame

## Description

Moves the active cursor to the top left corner of the specified frame.
If the PC cursor is active when this function is used, then the JAWS
cursor is activated and it is moved to the new position. Otherwise, the
active cursor is moved.

## Returns

Type: Int\
Description: \"WAS_SUCCESSFUL\" = 1 (frame was found),
\"WAS_NOT_SUCCESSFUL\" = 0 (frame was not found).\

## Parameters

### Param 1:

Type: string\
Description: The name of a frame.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

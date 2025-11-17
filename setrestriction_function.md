# Function: SetRestriction

## Description

For all cursors except the PC cursor, selects the area within which the
cursor is fre to move.

## Returns

Type: Int\
Description: FALSE when the PC cursor is on, TRUE otherwise.\

## Parameters

### Param 1:

Type: Int\
Description: one of the constants beginning with Restrict defined in
hjconst.jsh. Use RestrictNone to allow the cursor to roam the screen,
RestrictAppWindowto restrict to the application window,
RestrictRealWindow to restrict to the real window or RestrictWindow to
restrict to the current window.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

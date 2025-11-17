# Function: SetBrailleRestriction

## Description

selects the area within which the Braille cursor is fre to move. Note
has no effect if Tether Braille To Active is on.

## Returns

Type: Int\
Description: TRUE if the resttriction was set, false if the Braille
cursor is tethered to another cursor.\

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

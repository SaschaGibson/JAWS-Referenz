# Function: GetCursorCol

## Description

This determines the horizontal position or column where the active
cursor is located. It returns an integer that can be spoken with the
SayInteger script function. The value returned is based upon the number
of pixels that the active cursor is from the left edge of the screen.

## Returns

Type: Int\
Description: the value of the active cursor column position.\

## Parameters

### Param 1:

Type: Int\
Description: Optional parameter that designates whose cursor position is
to be retrieved. If this parameter is not specified, then the active
cursor is used.\
Include: Optional\

### Param 2:

Type: Int\
Description: The prefered coordinate system in which the value should be
returned This is only a recommendation and will not work in all places.
See the COORDSYS_xxx constants in hjconst.jsh.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

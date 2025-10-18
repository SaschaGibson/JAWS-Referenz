# Function: GetCursorPos

## Description

This gets the cursor position relative to the top of the page or
sccreen.

## Returns

Type: int\
Description: TRUE if the coordinates were obtained in the desired unit
of measure, FALSE otherwise.\

## Parameters

### Param 1:

Type: Int\
Description: Type the constant value that represents a cursor, type a
variable name, or choose a script function. Cursor constants are:
CURSOR_JAWS, CURSOR_PC, CURSOR_INVISIBLE, CURSOR_Braille. A script
function such as GetActiveCursor also can provide the constant.\
Include: Required\

### Param 2:

Type: int\
Description: desired units of measure, see hjconst.jsh smmUnitsOfMeasure
constants.\
Include: Required\

### Param 3:

Type: Int\
Description: set to x coordinate of caret in desired unit of measure (if
supported).\
Include: Required\
\* Returns data by reference\

### Param 4:

Type: Int\
Description: set to y coordinate of caret in desired unit of measure (if
supported).\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

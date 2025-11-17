# Function: SayCursorPos

## Description

This speaks the row and column position of a cursor. The row and column
spoken is based upon the number of pixels of the active cursor position
from the top left corner of the screen.

## Returns

Type: Void\

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
constants. (This optional parameter added in JAWS 9.0.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

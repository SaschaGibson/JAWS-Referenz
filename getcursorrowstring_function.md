# Function: GetCursorRowString

## Description

This gets the appropriate string describing the cursor position relative
to the top of the page or sccreen.

## Returns

Type: string\
Description: The cursor row position.\

## Parameters

### Param 1:

Type: int\
Description: Type the constant value that represents a cursor, type a
variable name, or choose a script function. Cursor constants are:
CURSOR_JAWS, CURSOR_PC, CURSOR_INVISIBLE, CURSOR_Braille. A script
function such as GetActiveCursor also can provide the constant.\
Include: Optional\

### Param 2:

Type: int\
Description: desired units of measure, see hjconst.jsh smmUnitsOfMeasure
constants.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 16.0 and later

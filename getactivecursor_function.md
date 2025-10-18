# Function: GetActiveCursor

## Description

Returns the type of the active cursor. If the detailed type is
requested, and the generic type is CURSOR_PC, the more detailed type of
cursor is returned.

## Returns

Type: Int\
Description: (JAWS Values) CURSOR_JAWS = 0, CURSOR_PC = 1,
CURSOR_INVISIBLE = 2, CURSOR_Braille = 3.\

## Parameters

### Param 1:

Type: int\
Description: TRUE-returns the detailed cursor type, FALSE-returns the
generic type. Defaults to FALSE.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

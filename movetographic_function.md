# Function: MoveToGraphic

## Description

Moves the JAWS cursor, invisible cursor, or Braille cursor in a specific
direction to find a graphic symbol in the active window.

## Returns

Type: Int\
Description: \"WAS_SUCCESSFUL\" = 1, \"WAS_NOT_SUCCESSFUL\" = 0.\

## Parameters

### Param 1:

Type: Int\
Description: Type one of the constants to indicate the direction that
the cursor is to move as it searches for a graphic: GRAPHIC_FIRST,
GRAPHIC_NEXT, GRAPHIC_PRIOR, or GRAPHIC_LAST.\
Include: Required\

### Param 2:

Type: int\
Description: set this to TRUE to restrict the search to the window
containing the active cursor, FALSE for an unrestricted search, if not
supplied, defaults to FALSE, ie unrestricted. this optional parameter is
only available in JAWS 6.0\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

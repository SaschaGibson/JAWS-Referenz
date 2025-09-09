# Function: PriorLine

## Description

This performs a special version of the UP ARROW keyboard command. When
the PC cursor is active, JAWS allows the application to move the cursor.
When other cursors are active, then JAWS tries to move the cursor up to
the line above its current position. To speak the line of information at
the new location, place a SayLine function after the PriorLine function.

## Returns

Type: Int\

## Parameters

### Param 1:

Type: int\
Description: - 0 no input origin specified. 1 specifies that the command
has originated from the keyboard. 2 specifies that the command has
originated from a Braille display (i.e. Whiz wheel up/down). 3 specifies
that the command has originated from a mouse click. Defaults to 0.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

# Function: NextLine

## Description

This moves the active cursor down to the next line. In many situations,
Windows does not display information in perfect horizontal rows, and the
cursor may not move a uniform distance each time this function is used.
To speak the information immediately after the NextLine function is
used, place a SayLine function after the NextLine function.

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

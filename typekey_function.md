# Function: TypeKey

## Description

Simulates a keystroke. Unlike TypeString, TypeKey translates the message
constant at runtime.

## Returns

Type: Int\
Description: TRUE if the string is successfully simulated.\

## Parameters

### Param 1:

Type: string\
Description: A message constant containing a keystroke name. Or, a
string variable or constant containing an integer representing a scan
code of the key to be typed.\
Include: Required\

### Param 2:

Type: int\
Description: - 0 no input origin specified. 1 specifies that the command
has originated from the keyboard. 2 specifies that the command has
originated from a Braille display (i.e. Whiz wheel up/down). 3 specifies
that the command has originated from a mouse click. Defaults to 0.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

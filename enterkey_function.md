# Function: EnterKey

## Description

Passes the enter key through to the application. If the Virtual PC
cursor is positioned on a link or button, it is activated. If the
Virtual PC cursor is on another form control, Forms Mode is activated.

## Returns

Type: Void\

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

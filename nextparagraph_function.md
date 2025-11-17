# Function: NextParagraph

## Description

Moves the active cursor to the beginning of the next paragraph. If the
PC cursor is active and the next paragraph is not already visible, then
text in the window will automatically scroll to bring it into view.

## Returns

Type: Int\
Description: TRUE if the next paragraph was found, FALSE otherwise.\

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

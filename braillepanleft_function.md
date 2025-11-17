# Function: BraillePanLeft

## Description

Displays the prior group of Braille characters from the line with the
active cursor. The characters that are displayed when this function is
used are those that precede the first character on the current display
of Braille characters. For example, the display moves or pans to the
left to reveal additional text.

## Returns

Type: Int\
Description: \"WAS_SUCCESSFUL\" = 1, \"WAS_NOT_SUCCESSFUL\" = 0.\

## Parameters

### Param 1:

Type: Int\
Description: true to move to the last segment of the prior line if no
more text to the left, default value is false.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

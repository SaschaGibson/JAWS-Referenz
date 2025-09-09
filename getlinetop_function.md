# Function: GetLineTop

## Description

Determines the vertical pixel location of the top of the tallest
character of the line on which the current cursor is positioned. Since
the cursor position reported by JAWS is based on the base line of
characters, this function is the only way of determining how high up a
line of text extends.

## Returns

Type: Int\
Description: The pixel location of the top of the tallest character on
the current line of text, or 0 if no text is found in this location.\

## Parameters

### Param 1:

Type: Int\
Description: Optional parameter that designates whose cursor position is
to be retrieved. If this parameter is not specified, then the active
cursor is used.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

# Function: BrailleSetVerticalAlignment

## Description

This function allows the type of vertical alignment to be set for a
multiline Braille display in Cropped mode. The types are 0 off (no
vertical alignment), 1 text (left aligned within the field width), 2
numeric (right aligned and then aligned on decimal), and 255 auto
(automatically determined by analyzing the data in the column about to
be displayed. (Note only the lines about to be displayed are examined).
See hjconst.jsh for the constant values.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: enable or disable\
Include: Required\

### Param 2:

Type: string\
Description: delim The delimiter char to use for vertical alignment\
Include: Required\

### Param 3:

Type: int\
Description: type The type of alignment 0 off, 1 text, 2 numeric, 255
auto\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 25.0 and later

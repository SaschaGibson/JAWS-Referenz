# Function: BrailleGetDataOffsetFromDisplayOffset

## Description

This function gets the offset into the original data (string) from a
display offset (the offset as seen on the braille display). This is
useful for getting the original position of a character, which is now at
a different offset due to braille translation.

## Returns

Type: int\
Description: DataOffset the actual offset into the original data
(string) sent to the display.\

## Parameters

### Param 1:

Type: int\
Description: DisplayOffset the offset as seen on the braille display\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 17.0 and later

# Function: BrailleGetTranslatorModeName

## Description

Queries the active braille translator to see if it supports operating
more than one mode. If it does then the function retrieves the name of
the mode whose index matches the parameter provided.

## Returns

Type: String\
Description: copy of the braille translator mode name from the braille
translator, empty string otherwise.\

## Parameters

### Param 1:

Type: Int\
Description: The index of the mode name desired - the index starts at
0.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 7.10 and later

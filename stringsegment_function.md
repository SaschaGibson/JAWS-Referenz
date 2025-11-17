# Function: StringSegment

## Description

When a string contains delimiters, StringSegment can be called to
extract a segment of the string. One is the index of the first string.
As of JAWS 7.0, negative numbers extract segments from the right end of
the string. So -1 will return the last segment, -2 the second to the
last etc.

## Returns

Type: String\
Description: The string segment specified by nIndex.\

## Parameters

### Param 1:

Type: String\
Description: The string that is delimited by some character or
characters.\
Include: Required\

### Param 2:

Type: String\
Description: The delimiter or set of delimiters. This string must be
enclosed in quotation marks.\
Include: Required\

### Param 3:

Type: Int\
Description: The index of the segment to be retrieved. One is the index
of the first segment. -1 is the index of the last segment\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

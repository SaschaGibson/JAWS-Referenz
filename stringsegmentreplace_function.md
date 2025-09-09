# Function: StringSegmentReplace

## Description

When a string contains delimiters, StringSegmentReplace can be called to
replace a segment of the string with a different string. One is the
index of the first string. Negative numbers replace segments from the
right end of the string. So -1 will replace the last segment, -2 the
second to the last etc.

## Returns

Type: String\
Description: The string with the segment specified by iIndex replaced
with the string specified by sReplacement.\

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
Description: The index of the segment being replaced. One is the index
of the first segment. -1 is the index of the last segment\
Include: Required\

### Param 4:

Type: String\
Description: The string that will replace the string in the segment
specified by iIndex.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 25.0 and later

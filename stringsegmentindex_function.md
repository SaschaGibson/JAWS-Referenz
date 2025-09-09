# Function: StringSegmentIndex

## Description

When a string contains delimiters, StringSegmentIndex can be called to
determine the index of a particular segment.

## Returns

Type: Int\
Description: the 1-based index of the specified segment (0 if the
segment wasn\'t found).\

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

Type: String\
Description: the segment whose index you want.\
Include: Required\

### Param 4:

Type: Int\
Description: true if the segment should match exactly, false to just
check that the segment contains the specified string.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.0 and later

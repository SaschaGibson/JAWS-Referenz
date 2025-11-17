# Function: StringTrimCommon

## Description

This function compares two strings and trims the common characters from
either the start, the end or both the start and end. The user specifies
which end to trim by setting the third parameter to 0 for both ends, 1
for the start or 2 for the end. For example, if string 1 is \"hello
world\" and string 2 is \"hello fred\", StringTrimCommon(s1, s2, 1)
would return world in s1 and fred in s2 and the return value would be 1.
If the strings are identical then the function returns FALSE since there
is nothing left after trimming common characters.

## Returns

Type: int\
Description: TRUE if the function trimmed common characters and either
s1 or s2 contain something after the comparison, FALSE if s1 and s2 are
identical.\

## Parameters

### Param 1:

Type: string\
Description: the first string to compare. Note after calling this
function this parameter is replaced by the piece of s1 which is not
contained in s2.\
Include: Required\
\* Returns data by reference\

### Param 2:

Type: string\
Description: the second string to compare. Note after calling this
function, s2 is replaced by the piece of s2 which is not contained in
s1.\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: int\
Description: 0 both start and end, (default), 1 trim start, 2 trim end.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later

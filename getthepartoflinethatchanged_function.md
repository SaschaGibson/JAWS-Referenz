# Function: GetThePartOfLineThatChanged

## Description

Given two strings of text which start with the same text, and where the
new string contains additional text at the end which was not present in
the old text, returns the newly added text. This is not a StringDiff,
rather it is a function to detect newly added text at the end of a
string of text.

## Returns

Type: string\
Description: The newly added text at the end of a string of old text.\

## Parameters

### Param 1:

Type: string\
Description: the new text which starts with the same text as the old
text, but which may have additional text following the old text.\
Include: Required\

### Param 2:

Type: string\
Description: The old text.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 23.0 and later

# Function: stringsMatchExcludingWhitespace

## Description

Determines if strings are equal excluding white space characters. String
\"HelloWorld\", \"Hello World\", \"Hello\\nWorld\", and
\"Hello\\09World\" would all match since their white space characters
all got removed.

## Returns

Type: int\
Description: TRUE if matched, FALSE otherwise.\

## Parameters

### Param 1:

Type: string\
Description: First of two strings to verify matching.\
Include: Required\

### Param 2:

Type: string\
Description: second of two strings to verify matching.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later

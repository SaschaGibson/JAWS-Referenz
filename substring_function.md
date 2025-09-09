# Function: SubString

## Description

Extracts part of a string from another string. It could be used to read
a portion of the information that appears on a status line.

## Returns

Type: String\
Description: Provides a substring of text for use by other functions.\

## Parameters

### Param 1:

Type: string\
Description: Type a string to be processed, or specify a variable name
or script function that can provide the text string. Text strings must
be enclosed within quotation marks.\
Include: Required\

### Param 2:

Type: Int\
Description: Type a number to indicate the position of the first
character in the substring which is to be extracted. The index number of
the first character in the string is 1.\
Include: Required\

### Param 3:

Type: Int\
Description: Type an integer to indicate the number of characters that
are to be extracted from the string. If the int is greater than the
number of characters remaining in the string, then the number is
silently rounded down.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

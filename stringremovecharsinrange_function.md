# Function: StringRemoveCharsInRange

## Description

Each Unicode character, in addition to having a printable
representation, has an ordinal value. For example uppercase A has an
ordinal value of 65, uppercase Z has an ordinal value of 90, and all
other uppercase letters have ordinal values between these two. Calling
StringRemoveChars(\"Hello There\",65,90) would return \"ello here\" (The
quote marks surrounding the returned value are not actually returned.)

## Returns

Type: string\
Description: the resultant string\

## Parameters

### Param 1:

Type: string\
Description: the string from which characters should be removed\
Include: Required\

### Param 2:

Type: int\
Description: the ordinal value of the first character to be removed\
Include: Required\

### Param 3:

Type: int\
Description: the ordinal value of the last character to be removed\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 16.00 and later

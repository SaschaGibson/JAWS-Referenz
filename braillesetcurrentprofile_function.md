# Function: BrailleSetCurrentProfile

## Description

Loads a language specific Braille profile.

## Returns

Type: int\
Description: true or false.\

## Parameters

### Param 1:

Type: string\
Description: three letter language abbreviation or lang ID of the form
0x409.\
Include: Required\

### Param 2:

Type: int\
Description: destination -1 (default) to not save to JCF, or one of
wdUser, wdSession or wdFocus.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 23.0 and later

# Function: MoveToEmail

## Description

This function will move the cursor to the next email based on a regular
expression search. If it can\'t find an email header, it returns false.

## Returns

Type: int\
Description: true if succeeded, false if not.\

## Parameters

### Param 1:

Type: int\
Description: the direction to move (forward or backward) Directions are
S\_ constants from HjConst.jsh, such as S_Next and s_Prior\
Include: Required\

### Param 2:

Type: String\
Description: The function will fill in from who the email came\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: String\
Description: the function will fill in the date the email was sent\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 22.0 and later

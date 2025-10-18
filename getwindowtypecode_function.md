# Function: GetWindowTypeCode

## Description

Obtains the window type code number for the specified window. These
numbers are the same for English and non-English versions of JAWS. Many
window type numbers have constant values assigned to them in the file
HJCONST.JSH. The GetWindowType function returns these constants instead
of the window type number.

## Returns

Type: Int\
Description: The window type number for the specified window.\

## Parameters

### Param 1:

Type: Handle\
Description: Type a variable name or choose a script function to provide
the window handle it needs.\
Include: Required\

### Param 2:

Type: int\
Description: TRUE to never use the DOMServer to obtain this info\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

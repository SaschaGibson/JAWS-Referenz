# Function: ClickObjectByName

## Description

Does a LeftMouse click at the upper lefthand corner of the named object.
This function relies on MSAA and is ideal for clicking an object that
does not have its own window but for which you know the name.

## Returns

Type: int\
Description: TRUE if the object was found and could be clicked, false
otherwise.\

## Parameters

### Param 1:

Type: HANDLE\
Description: The window containing the object of interest\
Include: Required\

### Param 2:

Type: string\
Description: The name of the object desired\
Include: Required\

### Param 3:

Type: int\
Description: If there is more than one object with this name, which one
is desired. This parameter defaults to 1.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 7.00 and later

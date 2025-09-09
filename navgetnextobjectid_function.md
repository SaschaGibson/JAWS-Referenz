# Function: navGetNextObjectID

## Description

Provides the next Object ID in a series of Object IDs that are all at
the same logical level. It is used to move across a list of control
objects.

## Returns

Type: Handle\
Description: Provides the Object ID of the next object in the stack or
returns a value of 0 when another object cannot be found.\

## Parameters

### Param 1:

Type: Handle\
Description: This function starts with the object that is identified by
an Object ID. Type the name of a variable or choose a script function
that can provide the handle for the starting object.\
Include: Required\

### Param 2:

Type: Handle\
Description: Type a variable name or choose a script function that can
provide the window handle for the parent window. If a window handle is
not provided, then GetCurrentWindow() will be used to provide a default
handle.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.0 and later

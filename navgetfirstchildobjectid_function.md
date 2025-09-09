# Function: navGetFirstChildObjectID

## Description

Determines the first child object of a specific parent object. This
function is useful when you wish to move down through the stack of
object IDs.

## Returns

Type: Handle\
Description: Provides the handle of the first child object or returns a
value of 0 when a child object cannot be found.\

## Parameters

### Param 1:

Type: Handle\
Description: This function starts with the object that is identified by
an object ID. Type the name of a variable or choose a script function
that can provide the handle for the starting object.\
Include: Required\

### Param 2:

Type: Handle\
Description: Type a variable name or choose a script function that can
provide the window handle for the parent window. If a window handle is
not provided, then GetCurrentWindow will be used to provide a default
handle.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.0 and later

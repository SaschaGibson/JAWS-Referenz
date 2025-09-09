# Function: navGetParentObjectID

## Description

Determines which object is directly above the specified child object.
For Example, when a dialog box pops up, it could be used to determine
the window handle of the window that created the dialog box. It can be
used to move up through a list of object IDs in order to get to a
specific object.

## Returns

Type: Handle\
Description: This is the handle of the parent object.\

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
not provided, then GetCurrentWindow() will be used to provide a default
handle.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.0 and later

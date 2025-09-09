# Function: navGetObjectContainerHelp

## Description

Retrieves the container help string of the object with the specified
parent window and Object ID. If a parent window and object ID is not
defined, then the object at the active cursor is used.

## Returns

Type: String\
Description: the container help string of the specified object.\

## Parameters

### Param 1:

Type: Handle\
Description: Type a variable name or choose a script function that can
provide the Object ID for object whose information is to be retrieved.
If a an object ID is not provided, navGetCurrentObjectID will be used to
provide a default ID.\
Include: Optional\

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

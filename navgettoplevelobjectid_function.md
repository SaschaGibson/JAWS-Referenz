# Function: navGetTopLevelObjectID

## Description

Similar to navGetAppMainObjectID. These two functions differ however in
that navGetAppMainObjectID will always return the object ID for the
highest level object in the application. In contrast,
navGetTopLevelObjectID can be used within dialog boxes to return the
object ID of the main dialog object when there may be several child
windows which are also real windows. This can be useful when the
navGetRealWindowObjectID function does not return the object ID of the
main dialog. A real object refers to a object with a title.

## Returns

Type: Handle\
Description: The handle of the TopLevel object, as opposed to the
AppMain Object.\

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

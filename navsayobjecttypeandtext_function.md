# Function: navSayObjectTypeAndText

## Description

Speaks the name and type of the object indicated by the function\'s
parameters or, if called with no parameters, located at the current
cursor\'s location. This function is similar to SayWindowTypeAndText,
except that it is more specific. If a particular window contains
multiple objects, this function will speak information about the one at
the cursor, while SayWindowTypeAndText will speak information about the
enclosing window. If the window does not contain multiple objects, then
the functions operate identically. When this function is used, it marks
the text it reads so that the Say Highlighted Text and Say
NonHighlighted Text functions do not repeat the same information when
they are triggered.

## Returns

Type: Void\

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

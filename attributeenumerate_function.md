# Function: AttributeEnumerate

## Description

This function provides a quick method of enumerating all fields in a
window with a specified attribute. For each field found, the coordinates
of the bounding rectangle are passed to the callback function. If the
callback function returns false then the enumeration stops. the callback
function must take the following parameters: int topLeftX, int topLeftY,
int bottomRightX, int bottomRightY. It must return true to continue the
enumeration or false to abort the enumeration.

## Returns

Type: Int\
Description: the number of fields found in the window.\

## Parameters

### Param 1:

Type: Handle\
Description: the window to enumerate.\
Include: Required\

### Param 2:

Type: Int\
Description: the attributes of the text to find.\
Include: Required\

### Param 3:

Type: String\
Description: the callback function name.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

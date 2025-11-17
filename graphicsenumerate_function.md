# Function: GraphicsEnumerate

## Description

For every graphic contained within a specific window, calls a specified
function, passing it the coordinates of the graphic.

## Returns

Type: Int\
Description: Count of the number of graphics enumerated.\

## Parameters

### Param 1:

Type: Handle\
Description: The handle of the window containing the graphics of
interest.\
Include: Required\

### Param 2:

Type: String\
Description: The name of the function to be called with information
about each graphic in the window. This function should return TRUE if
the enumeration is allowed to continue, FALSE if the enumeration should
stop immediately. This function should be defined as: int Function
SomeName(int nLeft,int nTop,int nRight,int nBottom).\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

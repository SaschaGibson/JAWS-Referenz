# Function: MoveTo

## Description

Moves the active cursor to the specified location on the screen. The
location is specified in the form of a pixel position, where the top
left hand corner of the screen is the point (0,0) and any point to the
right and/or down has a positive x and y value. It is wise to be careful
when using this function. This is because the pixel position of items in
an application vary widely, depending upon the screen resolution on the
computer that is running the application and the restored or maximized
state of the application. It is always best to obtain the parameters
that this function requires by searching for a particular object or
string of text in the application and using GetCursorCol and
GetCursorRow to store its position information in variables. Pass those
variables to the function rather than a set integer value.

## Returns

Type: Int\
Description: TRUE if move was successful, FALSE if one or both
coordinates are off the edge of the screen.\

## Parameters

### Param 1:

Type: Int\
Description: X-coordinate.\
Include: Required\

### Param 2:

Type: Int\
Description: Y-Coordinate.\
Include: Required\

### Param 3:

Type: Int\
Description: The Coordinate System to be used to interpret X and Y. The
default is to interpret them as pixel locations on the screen. See the
COORDSYS_xxx constants in hjconst.jsh.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

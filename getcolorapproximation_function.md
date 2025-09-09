# Function: GetColorApproximation

## Description

This function takes a COLORREF and finds the closest color in our table
for which we have a name. It also provides information as to whether the
approximated color is lighter or darker than the color passed in.

## Returns

Type: int\
Description: The color approximately the same as the one past in.\

## Parameters

### Param 1:

Type: int\
Description: the color to approximate.\
Include: Required\

### Param 2:

Type: int\
Description: a positive number is returned if the approximated color is
brighter than the original, 0 if it is the same or a negative number to
indicate that the approximated color is darker than the original.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later

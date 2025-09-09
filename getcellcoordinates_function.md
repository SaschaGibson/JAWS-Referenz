# Function: GetCellCoordinates

## Description

Gets the coordinates of the current cell in a table and passes them by
reference to the variables specified in the parameter list.

## Returns

Type: Int\
Description: TRUE if the current cursor is positioned inside of a table.
In this case, the Row and Column parameters will have meaningful
information placed in them.\

## Parameters

### Param 1:

Type: Int\
Description: References the current cell column on return.\
Include: Required\
\* Returns data by reference\

### Param 2:

Type: Int\
Description: References the current cell row on return.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

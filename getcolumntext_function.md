# Function: GetColumnText

## Description

This function gets the text of a range of cells in the current column of
a table. You can specify the separator string to use between data
elements, whether or not to include the coordinates of the active cell
immediately before that cell\'s data and the start and end rows to
include.

## Returns

Type: String\
Description: The text of the included cells.\

## Parameters

### Param 1:

Type: String\
Description: string to insert between cell data, defaults to a single
space.\
Include: Optional\

### Param 2:

Type: String\
Description: a string defining how the coordinates of the current cell
will be rendered. This string must contain two % style parameters (eg
c%1r%2) which will be filled with the numeric value of the current
column and row respectively. If this parameter is 0 then no coordinates
will be included before the current cell.\
Include: Optional\

### Param 3:

Type: String\
Description: the text to be displayed if the cell is blank.\
Include: Optional\

### Param 4:

Type: Int\
Description: the starting row, defaults to the first row (1) of the
table.\
Include: Optional\

### Param 5:

Type: Int\
Description: the ending row, defaults to the last row of the table.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

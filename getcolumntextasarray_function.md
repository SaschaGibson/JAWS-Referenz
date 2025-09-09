# Function: GetColumnTextAsArray

## Description

Returns an array where each element is the text of a cell in the
specified range. For example, if you request the entire column, there
will be an element for each cell in the column. If you only request rows
3 to 5, there will be three elements, the first for row 3, the 2nd for 4
and the third for 5. In this case you will need to take note of the
starting row requested if you wish to map this back to the entire
column.

## Returns

Type: stringArray\
Description: the array of cells.\

## Parameters

### Param 1:

Type: int\
Description: Defaults to the first row.\
Include: Optional\

### Param 2:

Type: int\
Description: Defaults to the last row.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later

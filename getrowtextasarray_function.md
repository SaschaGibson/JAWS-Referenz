# Function: GetRowTextAsArray

## Description

Returns an array where each element is the text of a cell in the
specified range. For example, if you request the entire row, there will
be an element for each cell in the row. If you only request cells 3 to
5, there will be three elements, the first for column 3, the 2nd for 4
and the third for 5. In this case you will need to take note of the
starting column requested if you wish to map this back to the entire
row.

## Returns

Type: stringArray\
Description: the array of cells.\

## Parameters

### Param 1:

Type: int\
Description: Defaults to the first column.\
Include: Optional\

### Param 2:

Type: int\
Description: Defaults to the last column.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later

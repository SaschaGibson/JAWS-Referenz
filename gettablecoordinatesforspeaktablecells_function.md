# Function: GetTableCoordinatesForSpeakTableCells

## Description

Obtains the row and column number to be spoken by function
SpeakTableCells. Row and Column number will be 0 if the function returns
false.

## Returns

Type: int\
Description: True if the retrieved row and column coordinates are valid,
false otherwise. Coordinates may be valid if a script call results in
table navigation but the navigation event has not yet occurred.\

## Parameters

### Param 1:

Type: int\
Description: nCol The column number.\
Include: Required\

### Param 2:

Type: int\
Description: nRow The row number.\
Include: Required\

### Param 3:

Type: int\
Description: The table navigation direction which resulted in the call
to this function.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 18.0 and later

# Function: TableEnteredEvent

## Description

This event function is triggered when the cursor moves into a table from
outside a table. When this event is fired, query for any relevant
Braille info for cell text or row text etc if Braille in use and then
use this in the BrailleAddObjectXX table functions in the scripts.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description:\
Include: Required\

### Param 2:

Type: Int\
Description:\
Include: Required\

### Param 3:

Type: Int\
Description:\
Include: Required\

### Param 4:

Type: Int\
Description:\
Include: Required\

### Param 5:

Type: Int\
Description:\
Include: Required\

### Param 6:

Type: Int\
Description:\
Include: Required\

### Param 7:

Type: int\
Description: TRUE if titles are defined for this table, FALSE if none
explicitly defined\
Include: Required\

### Param 8:

Type: int\
Description: The column number of the column containing row headers (0
if undefined).\
Include: Required\

### Param 9:

Type: int\
Description: The row number of the row containing column headers (0 if
undefined).\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

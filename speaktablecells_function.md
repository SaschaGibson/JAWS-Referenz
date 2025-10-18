# Function: SpeakTableCells

## Description

Honors the verbosity settings used in INSERT+V to support table
speaking. Make sure to enter the correct value for the first parameter
to support the correct reading method for the direction you are moving.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: Enter the direction you are moving. Use TABLE_NAV_NONE to
speak the current cell, TABLE_NAV_VERTICAL when moving by row and
TABLE_NAV_HORIZONTAL when moving by column.\
Include: Required\

### Param 2:

Type: Int\
Description: Enter the previous number of columns in the table row. This
is used when navigating by row, but always enter it to update. This way,
on tables on the internet, you will hear column changes take effect when
a table has a variable number of columns.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 5.00 and later

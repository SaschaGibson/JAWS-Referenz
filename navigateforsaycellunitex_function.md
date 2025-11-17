# Function: NavigateForSayCellUnitEx

## Description

Used by function SayCellUnitEx to navigate to a table cell.

## Returns

Type: int\
Description: TRUE if navigation was successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: int\
Description: the movement unit. The movement unit defines the type of
movement to be performed before speaking. See HJConst.jsh for unit
movement constants, all prefixed by UnitMove\_.\
Include: Required\

### Param 2:

Type: int\
Description: TRUE if caller wants error messages spoken, FALSE to be
silent on error.\
Include: Required\

### Param 3:

Type: int\
Description: Used when navigating left or right at a row extremity to
indicate if navigation should wrap to the prior or next row.\
Include: Required\

### Param 4:

Type: int\
Description: NavDir, one of the movement direction constants from
hjConst.jsh.\
Include: Required\

### Param 5:

Type: int\
Description: PrevNumOfCells, the number of cells in the previous table
column or row.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 22.0 and later

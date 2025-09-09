# Function: SayCellUnitEx

## Description

Moves to the cell specified by the unit movement and then speaks. It
also allows the caller to specify if error messages are spoken and also
returns a value determining the success of the movement.

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

## Version

This function is available in the following releases:

1.  JAWS 17.0 and later

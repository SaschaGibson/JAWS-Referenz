# Function: SayLineUnit

## Description

Moves to the line specified by the unit movement and then speaks. For
JAWS 8.0 and later, only speaks the line, the calling script must
perform the movement first.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: The movement unit. The movement unit defines the type of
movement which was performed before speaking. See HJConst.jsh for unit
movement constants, all prefixed by UnitMove\_.\
Include: Required\

### Param 2:

Type: int\
Description: Boolean denoting whether or not a navigation movement
occured triggering the call to speak the line. This parameter is only
valid for JAWS 8.0 and later.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 7.10 and later

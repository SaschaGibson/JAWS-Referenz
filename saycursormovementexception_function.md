# Function: SayCursorMovementException

## Description

When tested conditions are true, function managing behavior for cursor
movement scripts allow management of behavior to pass down to the next
JSB file. All the conditions that return true for all jsb files will
eventually be handled in the default scripts.

## Returns

Type: int\
Description: True for conditions that should pass down to the next level
JSB file for SayLineUnit, SayWordUnit, SayCharacterUnit,
SayPageUpDownUnit, and SpeakHomeEndMovement.\

## Parameters

### Param 1:

Type: int\
Description: One of the Unit movement constants from HJConst.jsh.\
Include: Required\

### Param 2:

Type: int\
Description: True if movement occured, false otherwise.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 15.0 and later

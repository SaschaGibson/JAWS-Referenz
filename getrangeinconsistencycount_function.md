# Function: GetRangeInconsistencyCount

## Description

This function obtains the number of inconsistencies in the specified
unit of text. The user can determine what kinds of inconsistencies are
detected and thus counted.

## Returns

Type: int\
Description: The number of inconsistencies detected in the requested
range at the cursor\'s location.\

## Parameters

### Param 1:

Type: int\
Description: 0 line, 1 sentence, 2 paragraph\
Include: Required\

### Param 2:

Type: int\
Description: The type of inconsistencies bitwise ored together, see
hjconst.jsh.\
Include: Required\

### Param 3:

Type: int\
Description: the flags governing the paired symbols to check, see
hjconst.jsh\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later

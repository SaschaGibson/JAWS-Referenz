# Function: MoveToControlType

## Description

This function Moves the cursor to the next, prior, first or last
instance of the specified control type.

## Returns

Type: Int\
Description: true or false.\

## Parameters

### Param 1:

Type: Int\
Description: one of S_TOP, S_BOTTOM, S_NEXT or S_PRIOR as defined in
hjconst.jsh.\
Include: Required\

### Param 2:

Type: Int\
Description: One of the WT\_ window type constants defined in
hjconst.jsh.\
Include: Required\

### Param 3:

Type: int\
Description: TRUE to set the application focus to this control, FALSE to
just move the virtual cursor to it. This parameter is supported in JAWS
10.0 and later.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.00 and later

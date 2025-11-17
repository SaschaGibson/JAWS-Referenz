# Function: ProcessBoundaryStrike

## Description

This function is called by TopEdgeEvent and BottomEdgeEvent to perform
an action when a user tries to move past a boundary.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: handle\
Description: The handle of the window where the edge was reached.\
Include: Required\

### Param 2:

Type: int\
Description: The boundary edge which was reached. Currently TopEdge and
BottomEdge are defined in HJConst.jsh.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 7.10 and later

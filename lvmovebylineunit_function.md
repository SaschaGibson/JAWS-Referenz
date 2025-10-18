# Function: lvMoveByLineUnit

## Description

Use with listview controls which may be manipulated with the lv
functions but which need special scripting for navigation.

## Returns

Type: int\
Description: true if the move was successful, false otherwise.\

## Parameters

### Param 1:

Type: int\
Description: One of the lvLineMoveUnit constants defined in
HJConst.jsh\-- lvLineMoveUnitFirst, lvLineMoveUnitLast,
lvLineMoveUnitPrior or lvLineMoveUnitNext.\
Include: Required\

### Param 2:

Type: int\
Description: bMayWrap True if requests to move to prior or next line may
wrap past the beginning or end of the list.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 8.10 and later

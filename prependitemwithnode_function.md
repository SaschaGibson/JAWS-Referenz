# Function: PrependItemWithNode

## Description

Prepares list item string segment to be used in an array passed to the
dlgSelectTreeFunctionToRun function.

## Returns

Type: string\
Description: the modified string segment with the path string.\

## Parameters

### Param 1:

Type: string\
Description: This is the string segment which contains the function
callback, a colon, and the list item display text.\
Include: Required\

### Param 2:

Type: string\
Description: This is the branch, or path of branches. Note that it
should not end with the node path separator. Examples of nodes would be
\"General Options\" or \"Reading Options.Sayall Options\" (note noperiod
at end of example; this is added by the function.)\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

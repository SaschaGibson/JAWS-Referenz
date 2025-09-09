# Function: BrailleSetLineIndexForNextAddString

## Description

This function is called within brailleAddObjectXX callbacks to specify
the line on which the next BrailleAddString function calls should apply.
It is used to build up a multiline structured representation of a
control.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: the 1-based index of the line to which the following
BrailleAddString calls apply.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 25.0 and later

# Function: EnumerateChildWindows

## Description

This function calls a specified function for each child of the starting
window. This function must be defined as: int function SomeName(handle
hwnd). This function must return true if the enumeration should continue
or false if it should stop.

## Returns

Type: Int\
Description: true if the enumeration completed, false if it was
terminated by the callback function returning false for a window.\

## Parameters

### Param 1:

Type: Handle\
Description: starting handle.\
Include: Required\

### Param 2:

Type: String\
Description: The name of the script function to call for each child
window.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

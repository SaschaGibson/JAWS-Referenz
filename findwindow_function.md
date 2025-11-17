# Function: FindWindow

## Description

This function starts at the specified window and searches all of its
children to find one with the specified Class or Window Name. If the
handle is 0 then a top level window is sought (ie equivalent to calling
FindTopLevelWindow). Leave the name blank to find a window with a class
but any name or leave the class blank to find a window with any class
but a particular name.

## Returns

Type: Handle\
Description: the window handle of the found window.\

## Parameters

### Param 1:

Type: Handle\
Description: starting window.\
Include: Required\

### Param 2:

Type: String\
Description: class name to search for.\
Include: Required\

### Param 3:

Type: String\
Description: the name of the window to find.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

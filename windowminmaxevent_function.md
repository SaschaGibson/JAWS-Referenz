# Function: WindowMinMaxEvent

## Description

nMinMaxRest gives general information about what is happening to the
window. It can be WE_MINIMIZE, WE_MAXIMIZE, or WE_RESTORE. nShow is more
specific. For a complete list of nShow values, look for \"SW\_\" in
hjconst.jsh.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Handle\
Description: The handle of the window whose status is about to change.\
Include: Required\

### Param 2:

Type: Int\
Description: Describes the general action taking place on the window.\
Include: Required\

### Param 3:

Type: Int\
Description: Describes the specific action taking place on the window.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

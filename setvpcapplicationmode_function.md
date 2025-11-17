# Function: SetVPCApplicationMode

## Description

By default, this support is always enabled, that is, if the application
requests application mode then the current document will be presented in
PCCursor mode only. If however the user wishes to override the
application\'s setting of this mode, they can pass FALSE to this
function to ignore the mode and still view the document as a virtual
representation.

## Returns

Type: int\
Description: TRUE or FALSE, the new state as requested by the caller.\

## Parameters

### Param 1:

Type: int\
Description: TRUE or FALSE, TRUE to honor this mode if requested by the
application or FALSE to ignore it even if requested.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 10.0 and later

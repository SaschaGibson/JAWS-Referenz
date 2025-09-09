# Function: GetWindowSubtypeCode

## Description

Obtains the window subtype code number for the specified window. This
function is similar to GetWindowTypeCode, but attempts to be even more
specific. If no more specific information is available, returns the same
thing as GetWindowTypeCode. For example, Calling GetWindowTypeCode using
the window handle for the Taskbar would return WT_TABCONTROL, and
calling GetWindowSubtypeCode would return WT_TASKBAR, a more specific
type of tab control. See the documentation for GetWindowTypeCode for
more details.

## Returns

Type: Int\
Description: The window subtype number for the specified window.\

## Parameters

### Param 1:

Type: Handle\
Description: This function provides information for the window that is
identified by a window handle. Type a variable name or choose a script
function to provide the window handle it needs.\
Include: Required\

### Param 2:

Type: int\
Description: TRUE to never use the DOMServer to obtain this info\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

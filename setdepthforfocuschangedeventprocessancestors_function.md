# Function: SetDepthForFocusChangedEventProcessAncestors

## Description

This can be used in app-specific scripts to limit the depth of ancestors
processed for specific conditions. The default is to process the depth
of ancestors involved in the focus change.

## Returns

Type: int\
Description: The depth of ancestors to be processed by function
FocusChangedEventProcessAncestors.\

## Parameters

### Param 1:

Type: Handle\
Description: the handle of the window that has received the focus.\
Include: Required\

### Param 2:

Type: Handle\
Description: the handle of the window that previously had the focus.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later

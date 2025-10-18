# Function: FocusChangedEventShouldProcessAncestors

## Description

Used by function ProcessEventOnFocusChangedEvent to determine whether or
not to call FocusChangedEventProcessAncestors.

## Returns

Type: int\
Description: true is FocusChangedEventProcessAncestors should be called
to process the focus change, false otherwise.\

## Parameters

### Param 1:

Type: handle\
Description: The handle of the focus window.\
Include: Required\

### Param 2:

Type: handle\
Description: The handle of the previous focus window.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 15.0 and later

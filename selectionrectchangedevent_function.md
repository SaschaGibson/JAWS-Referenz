# Function: SelectionRectChangedEvent

## Description

When the selCtxSelectionRect flag is set in a call to
SetSelectionContextFlags, this event is called when navigating or
selecting text in MSWord or other event driven applications supporting
Selection Context events.

## Returns

Type: void\

## Parameters

### Param 1:

Type: int\
Description: newLeft The top left x-screen coordinate of new caret or
selection rect.\
Include: Required\

### Param 2:

Type: int\
Description: newTop The top left y-screen coordinate of new caret or
selection rect.\
Include: Required\

### Param 3:

Type: int\
Description: newRight The bottom right x-screen coordinate of new caret
or selection rect.\
Include: Required\

### Param 4:

Type: int\
Description: newBottom The bottom y-screen coordinate of new caret or
selection rect.\
Include: Required\

### Param 5:

Type: int\
Description: oldLeft The top left x-screen coordinate of old caret or
selection rect.\
Include: Required\

### Param 6:

Type: int\
Description: oldTop The top left y-screen coordinate of old caret or
selection rect.\
Include: Required\

### Param 7:

Type: int\
Description: oldRight The bottom right x-screen coordinate of old caret
or selection rect.\
Include: Required\

### Param 8:

Type: int\
Description: oldBottom The bottom right y-screen coordinate of old caret
or selection rect.\
Include: Required\

### Param 9:

Type: int\
Description: navUnit The movementUnit which caused the change in rect.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 16.0 and later

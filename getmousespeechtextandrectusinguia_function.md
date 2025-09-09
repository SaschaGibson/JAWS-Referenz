# Function: GetMouseSpeechTextAndRectUsingUIA

## Description

Retrieves the text and rectangle to be used by the MouseSpeechTimerEvent
function for the mouse speech using UIA methods.

## Returns

Type: int\
Description: True if text and a rectangle could be retrieved for the
MouseSpeechTimerEvent function.\

## Parameters

### Param 1:

Type: string\
Description: The app name, if any special UIA code is needed for the
application.\
Include: Required\

### Param 2:

Type: string\
Description: byRef/text The text at the mouse location to be spoken by
the mouse speech event.\
Include: Required\

### Param 3:

Type: int\
Description: byRef/left The left edge of the rectangle to be drawn for
the mouse speech.\
Include: Required\

### Param 4:

Type: int\
Description: byRef/top The top edge of the rectangle to be drawn for the
mouse speech.\
Include: Required\

### Param 5:

Type: int\
Description: byRef/right The right edge of the rectangle to be drawn for
the mouse speech.\
Include: Required\

### Param 6:

Type: int\
Description: byRef/bottom The bottom edge of the rectangle to be drawn
for the mouse speech.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 16.0-16.0

# Function: FocusPointMovedEvent

## Description

It is called when the pixel location of the blinking caret or highlight
changes. Note that the pixel location is determined by video resolution
as in row and column coordinates. Because this function will be called
quite frequently, it is recommended that you avoid from intensive tasks
that will be performed each time the PC cursor moves. For a list of
parameters received by FocusPointMovedEvent and their descriptions, look
at the Existing Parameters List box on the Parameters page.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: Current horizontal coordinate of the PC cursor.\
Include: Required\

### Param 2:

Type: Int\
Description: Current vertical coordinate of the PC cursor.\
Include: Required\

### Param 3:

Type: Int\
Description: Previous horizontal coordinate of the PC cursor.\
Include: Required\

### Param 4:

Type: Int\
Description: Previous vertical coordinate of the PC cursor.\
Include: Required\

### Param 5:

Type: Int\
Description: The unit of movement as constant variables defined in
HJConst.jsh.\
Include: Required\

### Param 6:

Type: Int\
Description: The direction of movement as constant variables defined in
HJConst.jsh.\
Include: Required\

### Param 7:

Type: Int\
Description: The amount of time (milliseconds)that has elapsed since the
movement occurred.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

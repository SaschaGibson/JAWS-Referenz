# Function: ShowFrameTextHelper

## Description

As active frames are found, their title and text is passed into the User
Buffer. The name, or title, is posted as a link to the FrameMoveHelper
function which will place the JAWS cursor in the specified frame and
announce accordingly. This announcement can be turned off by suppressing
Smart Help Messages in your Verbosity profile.

## Returns

Type: Int\
Description: True if successful\

## Parameters

### Param 1:

Type: String\
Description: Receives the name of the frame.\
Include: Required\

### Param 2:

Type: Int\
Description: Receives the top left edge of the frame.\
Include: Required\

### Param 3:

Type: Int\
Description: Receives the top right edge of the frame.\
Include: Required\

### Param 4:

Type: Int\
Description: Receives the bottom left edge of the frame.\
Include: Required\

### Param 5:

Type: Int\
Description: Receives the bottom right edge of the frame.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

# Function: FindGraphic

## Description

FindGraphic searches for a graphic in the specified window. If the
graphic is found, then the JAWS cursor is placed on it. The graphic must
have a text label associated with it because the FindGraphic function
searches for text labels. Text labels are assigned by the Graphics
Labeler.

## Returns

Type: Int\
Description: \"WAS_SUCCESSFUL\" = 1, \"WAS_NOT_SUCCESSFUL\" = 0.\

## Parameters

### Param 1:

Type: Handle\
Description: Specify a window handle. Type the name of a variable or
choose a script function that indicates the window that is to be
searched.\
Include: Required\

### Param 2:

Type: String\
Description: Type the graphic label that is to be located. The label
must be typed exactly as it appears in the graphic label file. Enclose
the graphic label within quotation marks.\
Include: Required\

### Param 3:

Type: Int\
Description: Indicate the search direction. Type a constant value to
indicate the starting point for the search: S_TOP or S_BOTTOM.\
Include: Required\

### Param 4:

Type: Int\
Description: Indicate search restriction. Type the name of a constant
value to indicate whether the search should be restricted to the active
window or it should extend into all child windows of the active
application. Type S_UNRESTRICTED to search all application windows or
S_RESTRICTED to limit the search to the active child window.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

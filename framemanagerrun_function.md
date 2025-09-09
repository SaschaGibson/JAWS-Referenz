# Function: FrameManagerRun

## Description

Used to name frames, adjust their size and position, and determine their
behavior.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: What action should the Frame Viewer perform. Possible
values are found in HJConst beginning with FRAMEVIEW\_.\
Include: Required\

### Param 2:

Type: Int\
Description: Enter \> 0 to determine that we\'re in a menu, false or
leave blank otherwise\
Include: Optional\

### Param 3:

Type: Handle\
Description: Enter the handle of the menu itself\
Include: Optional\

### Param 4:

Type: String\
Description: Enter the class name for the menu. Most drop-down menus
possess the class #32768 which is represented by the constant
cWcMenuClass defined in the common.jsm file.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

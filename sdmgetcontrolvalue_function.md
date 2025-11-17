# Function: SDMGetControlValue

## Description

Used with SDM windows to get an edit field\'s contents. This function is
only used with SDM windows and not with regular dialog windows.

## Returns

Type: String\
Description: Provides the item\'s value\

## Parameters

### Param 1:

Type: Handle\
Description: Type the name of a variable or choose a script function
that provides the handle of the window that is to be read. The GetFocus
function is often used to provide the handle of the SDM window.\
Include: Required\

### Param 2:

Type: Int\
Description: Use the SDMGetFocus function to provide the control ID for
the active child window of the dialog box.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 13.00 and later

# Function: SDMSayWindowTypeAndText

## Description

Used with SDM windows to read the window title (when one is present),
the window type, the contents in the window, and related information
about the current dialog box option. When this function is used, it
marks the text it reads so that the SayNonHighlightedText and
SayHighlightedText functions do not repeat the same information when
they are triggered. This function is only used with SDM windows and not
with regular dialog windows.

## Returns

Type: Void\

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

1.  JAWS 4.51 and later

# Function: SDMSayControl

## Description

Speaks the contents of a child window along with its prompt in an SDM
dialog box. It reads edit fields, list boxes, check boxes, radio
buttons, etc. This function is equivalent to SayControl, but is
exclusively designed for SDM dialog boxes. All child windows in an SDM
dialog box have the same window handle, and the control ID is used to
distinguish between the various options in the dialog box.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Handle\
Description: Type a variable name or choose a script function that can
provide the window handle for the dialog box. The GetFocus function is
often used to provide the handle.\
Include: Required\

### Param 2:

Type: Int\
Description: Type a variable name or choose a script function that can
provide the control ID for the child window which is to be spoken.
Various SDM control ID functions can be used to identify the child
window.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

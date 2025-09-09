# Function: SDMGetPrevControl

## Description

Provides the control ID for the previous option in an SDM dialog box. It
can provide the control ID that is needed by the SDMSayControl function.

## Returns

Type: Int\
Description: A control ID is returned when the previous control ID is
found, 0 is returned when a control ID does not exist.\

## Parameters

### Param 1:

Type: Handle\
Description: Type a variable name or choose a script function that can
provide the window handle of the SDM dialog box. The GetFocus function
is often used to provide the handle.\
Include: Required\

### Param 2:

Type: Int\
Description: Type a variable name or choose a script function that
indicates the control ID for the child window which is the starting
point for the script function in the SDM dialog.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

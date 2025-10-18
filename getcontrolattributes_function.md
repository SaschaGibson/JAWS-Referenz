# Function: GetControlAttributes

## Description

This function returns an integer value indicating the attributes of the
current control.

## Returns

Type: Int\
Description: The control attributes, as defined in HJconst.jsh. The
values returned may be one of the following; CTRL_NONE = 0, CTRL_CHECKED
= 1, CTRL_UNCHECKED = 2, CTRL_GRAYED = 4, CTRL_DISABLED = 8,
CTRL_SUBMENU = 16, or CTRL_PRESSED = 32.\

## Parameters

### Param 1:

Type: Int\
Description: if TRUE, do not use cached MSAA state\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

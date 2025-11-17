# Function: SetQuickKeyNavigationMode

## Description

The Quick Key Navigation mode is linked to the Virtual Cursor
automatically however it may be manually turned on in other applications
which don\'t use the Virtual cursor. Applications which use this mode
must have overriding scripts to handle the movement and reading
functions supported by this mode. this mode is linked to the JCF option
OPT_QUICK_KEY_NAVIGATION_MODE so turning it on manually when the jcf
option is set to 0 will have no effect.

## Returns

Type: Int\
Description: true if the mode was enabled or false otherwise.\

## Parameters

### Param 1:

Type: Int\
Description: true to turn the mode on, false to turn it off.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

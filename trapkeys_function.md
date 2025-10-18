# Function: TrapKeys

## Description

Turns Trap key mode On or Off. When Trap Key mode is on, any keys not
attached to scripts are simply ignored and not passed on to the current
application. The primary use for this feature is in the Keyboard Help,
where keys not attached to scripts should be ignored.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: TRUE to enable trapping, FALSE to disable it.\
Include: Required\

### Param 2:

Type: Int\
Description: TRUE to enable trapping of keystrokes used in combination
with delayed modifier keys. Set to FALSE, for example, if you want
system keys such as Alt to be sent through to the system, even though
trap keys is enabled.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

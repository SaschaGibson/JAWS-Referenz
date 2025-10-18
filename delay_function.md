# Function: Delay

## Description

Makes a script stand still for a specified period of time. It causes a
script to stop, wait a period of time, and then resume again. It is
different than the Pause function which yields to the processing needs
of applications.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: Type a number to indicate the amount of time that the
script should be delayed. The number 1 equals one-tenth of a second. The
number 10. equals one second. Do not use numbers withdecimals, and do
not use quotation marks.\
Include: Required\

### Param 2:

Type: Int\
Description: TRUE to suppress checking for and processing
FocusChangedEvent and NewTextEvent functions before returning from the
delay.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

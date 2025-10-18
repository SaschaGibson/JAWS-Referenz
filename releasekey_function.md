# Function: ReleaseKey

## Description

Simulates releasing a previously pressed key on the keyboard. This
function should be proceeded with a call to PressKey. Once a sequence of
PressKey and ReleaseKey calls is complete, call PlayKeys to have JAWS
simulate the entire key sequence.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: string\
Description: A string value for the key name, these can include alt,
control and shift.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 20 and later

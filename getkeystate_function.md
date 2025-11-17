# Function: GetKeyState

## Description

Returns by reference both the up/down state of the key, and the toggle
state if applicable. NumLock, ScrollLock, and CapsLock have toggle
states.

## Returns

Type: Int\
Description: TRUE if the keystate was successfully returned.\

## Parameters

### Param 1:

Type: String\
Description: The name of the key whose state is to be retrieved. A list
of key names is referenced in keycodes.ini.\
Include: Required\

### Param 2:

Type: Int\
Description: Set to true if the key is in a down state.\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: Int\
Description: Set to true if the toggle state is on. For example, if
CapLock is in the on state, then this value will be true.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

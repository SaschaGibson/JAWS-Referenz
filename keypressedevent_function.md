# Function: KeyPressedEvent

## Description

All key presses cause this function to fire. If the key is assigned to a
script, then KeyPressedEvent is called before the script itself. Because
this function will be called quite frequently, it is recommended that
you refrain from intensive tasks that will be performed each time a
keystroke is pressed. For a list of parameters received by
KeyPressedEvent and their descriptions, look at the Existing Parameters
List box on the Parameters page.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: the numeric keycode.\
Include: Required\

### Param 2:

Type: String\
Description: the name as it would be used in a keymap.\
Include: Required\

### Param 3:

Type: Int\
Description: 1 if this was a key on the Braille Display.\
Include: Required\

### Param 4:

Type: Int\
Description: nIsScriptKey 1 if This keystroke is assigned to a script.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

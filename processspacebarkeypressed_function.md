# Function: ProcessSpaceBarKeyPressed

## Description

Called by KeyPressedEvent and contains all code processed when
KeyPressedEvent acts upon the spacebar being pressed. Overwrite this
function in your application with the code to use when space is pressed.

## Returns

Type: Int\
Description: true if spacebar was pressed and nothing further should be
processed, false if spacebar was not pressed.\

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

1.  JAWS 11.0 and later

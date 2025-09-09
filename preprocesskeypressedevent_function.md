# Function: PreProcessKeyPressedEvent

## Description

Called by KeyPressedEvent to perform all processing which must be done
before any keys are processed. Used to test for keys being trapped, and
to clear globals not dependent on to specific keys.

## Returns

Type: int\
Description: True to stop any further processing in KeyPressedEvent,
false otherwise.\

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

1.  JAWS 12.00 and later

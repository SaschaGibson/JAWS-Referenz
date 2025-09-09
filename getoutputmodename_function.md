# Function: GetOutputModeName

## Description

This function retrieves a human friendly output mode name given an
output destination. The names can be different for Speech and Braille.
For instance, OT_HELP may have a speech name of Help Information while
the Braille name might be hlp. this function is used primarily to
retrieve an appropriate message to be shown in the Status cells of the
Braille Display or prepended to a Flash message for displays with no
status cells during the display of a Flash message. This makes it easier
to determine where the message is coming from.

## Returns

Type: string\
Description: the human friendly name for the given output mode and
destination.\

## Parameters

### Param 1:

Type: int\
Description: one of the OT constants from hjconst.jsh\
Include: Required\

### Param 2:

Type: int\
Description: one of the Output Type destinations from hjconst.jsh.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later

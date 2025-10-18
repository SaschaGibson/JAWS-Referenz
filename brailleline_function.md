# Function: BrailleLine

## Description

Sends the current line of text to a Braille display. It is automatically
executed ten times per second and does not need to be routinely used by
a script. It can be used in a script after the BrailleString function
has been used and you are ready to display a line of information from
the desktop.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: If the entire line will not fit on the Braille display,
then this indicates which portion to show. Should be one of the
brlShowXXX constants in hjconst.jsh.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

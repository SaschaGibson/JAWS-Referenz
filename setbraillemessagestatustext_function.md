# Function: SetBrailleMessageStatusText

## Description

This function enables the user to define the text to be shown either in
the status area of the Braille display or prepended to a Flash message
during the display of a Flash message. If the string parameter is not
supplied or is NULL, the default status message as defined in the jcf
file will be restored and used.

## Returns

Type: int\
Description: TRUE if the function succeeds, false otherwise.\

## Parameters

### Param 1:

Type: string\
Description: sStatusMsg the text to be shown in the status cell area of
the display or prepended to a Flash message if the display has no status
cells.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later

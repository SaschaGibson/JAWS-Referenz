# Function: ContractedBrailleInputAllowedNow

## Description

Overwrite this function in your script file when you need to turn off
Contracted Braille input in a scenario where it would otherwise be
enabled. An example would be in Microsoft Word, where Quick Navigation
Keys are enabled, CanEditNow should return false so the keyboard is used
for navigation rather than editing This is called for the item with
focus., and is not called for a window which does not support contracted
input to begin with..

## Returns

Type: int\
Description: TRUE or False, script method for enabling or disabling
contracted Braille input.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later

# Function: GetCustomTutorMessage

## Description

Retrieves a custom tutor message to be spoken by SayTutorialHelp.
Overwrite this function in applications where you want a custom tutor
message to be substituted instead of the usual tutor message. This
function is processed after GetFrameTutorMessage and before any of the
usual tutor messages are processed.

## Returns

Type: string\
Description: Null if no custom tutor message is to be spoken, otherwise
the custom tutor message.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 7.00 and later

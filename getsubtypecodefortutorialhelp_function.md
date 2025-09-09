# Function: GetSubtypeCodeForTutorialHelp

## Description

This function obtains the subtype code for tutorial help. Placing this
functionality in a separate function makes it possible to override this
behavior for application scripts without having to override the
TutorMessageEvent function. It also makes it possible to ensure
consistent behavior between the TutorMessageEvent function and the
SayWindowPromptAndText script.

## Returns

Type: Int\
Description: The subtype code.\

## Parameters

### Param 1:

Type: Handle\
Description: the focus window.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 22.0 and later

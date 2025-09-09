# Function: SetVoiceGlobalSettings

## Description

The setting for the given parameter and voice context are stored in
global variables. If this is not done before manipulating the given
parameter for the given voice context, it will be impossible to restore
it.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: Enter the constant representing the voice parameter to be
stored. These are found in HjConst.jsh. Examples of such are V_RATE and
V_PITCH\
Include: Required\

### Param 2:

Type: String\
Description: Enter a variable, string literal or constant definition
representing the voice context name to be stored.\
Include: Required\

### Param 3:

Type: Int\
Description: Enter a variable or integer representing the current
setting for the parameter of the given voice context.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

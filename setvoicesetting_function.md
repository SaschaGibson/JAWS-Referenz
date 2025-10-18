# Function: SetVoiceSetting

## Description

Sets the parameter of the voice context you specify to the desired
setting. It is recommended that you use ChangeVoiceSetting if you simply
wish to change the setting. See ChangeVoiceSetting if you want to use
this function in another script or function.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: Enter the constant definition for the voice parameter you
wish to set. A listing of these are found in HjConst.jsh. Examples of
such are: V_PITCH and V_RATE\
Include: Required\

### Param 2:

Type: Int\
Description: Enter a variable or the integer for the new setting for
your parameter. See ChangeVoiceSetting to see the calculations we use
for voice changes.\
Include: Required\

### Param 3:

Type: String\
Description: Enter a variable or the string literal representing the
Voice Context name.\
Include: Required\

### Param 4:

Type: Int\
Description: Enter the value V_UP or V_DOWN to alert the function in
which direction this setting is moving. This is only used to speak the
appropriate message as the setting changes.\
Include: Required\

### Param 5:

Type: Int\
Description: Enter true if you want the function to perform as though
SayAll were in progress, false otherwise. If true, no announcement will
be spoken when the voice changes.\
Include: Required\

### Param 6:

Type: int\
Description: True to save the new voice rate; default is false.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

# Function: ChangeVoiceSetting

## Description

Changes the setting for the active voice. This depends on the voice
parameter and direction (up or down) in which to change the setting. The
setting will be increased or decreased by 10 percent of the range for
the given parameter. If True is passed to the SayAll parameter, there
will be an audible indication that the setting has changed. This is the
main control center for changing voice parameters.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: Enter the constant definition for the voice parameter to
set. These are found in HjConst.jsh. Examples of such are V_RATE and
V_PITCH.\
Include: Required\

### Param 2:

Type: Int\
Description: Enter the constant definition for the direction to change
the setting. These are found in HjConst.jsh and are V_UP and V_DOWN.\
Include: Required\

### Param 3:

Type: Int\
Description: Enter true to bypass the audio indication, or false to have
the function announce the setting change.\
Include: Required\

### Param 4:

Type: int\
Description: True to save the new voice rate; default is false.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

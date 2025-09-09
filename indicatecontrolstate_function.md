# Function: IndicateControlState

## Description

Allows your custom scripts to take advantage of the scheme the user has
set up.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: Enter the JFW Subtype Code for which this applies. See WT\_
constants in HjConst.jsh.\
Include: Required\

### Param 2:

Type: int\
Description: nState Either use GetControlAttributes function or one of
the CTRL\_ constants from HjConst.jsh if you need to specify the state
yourself.\
Include: Required\

### Param 3:

Type: String\
Description: If for some reason, you need to have different text spoken
you can use this parameter to enter text to be spoken. It will be marked
up as any other text would be.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.0 and later

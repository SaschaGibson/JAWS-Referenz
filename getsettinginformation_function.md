# Function: GetSettingInformation

## Description

Retrieves the setting for the given voice parameter and context name.
The minimum and maximum settings for the range of the parameter are
passed to the min and max parameters by reference.

## Returns

Type: Int\
Description: The current setting for the given voice parameter and
context\

## Parameters

### Param 1:

Type: Int\
Description: Enter the constant representing the voice parameter from
which to retrieve the settings. These are found in HjConst.jsh. Examples
of such are V_RATE and V_PITCH.\
Include: Required\

### Param 2:

Type: String\
Description: Enter a variable, string literal or constant representing
the voice context whose parameter is to be checked.\
Include: Required\

### Param 3:

Type: Int\
Description: Enter the int variable to receive the minimum for the range
of the parameter you wish to set.\
Include: Required\
\* Returns data by reference\

### Param 4:

Type: Int\
Description: Enter the int variable to receive the maximum for the range
of the parameter you wish to set.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

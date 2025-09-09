# Function: SetAlternateUserDirectoryMode

## Description

Sets the Alternate User Directory Mode. The Alternate User Directory
Mode provides control over the location that will be used as the user
settings directory.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: The possible values are as follows.
AlternateUserDirMode_Off (0): Causes the standard user directory for the
product to be used. AlternateUserDirMode_Default (1): Causes user
settings to be saved in a subdirectory of the temp directory; files
saved in this directory are transient and the contents of this directory
are deleted when the product enters or exits the mode.
AlternateUserDirMode_Roam (1): Causes user settings to be saved in a
subdirectory of the ProgramData directory; files saved in this directory
are persistent.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 17.00 and later

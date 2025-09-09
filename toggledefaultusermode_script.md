# Script: ToggleDefaultUserMode

## Description

This script toggles the Default User Mode, which is also called the
Default Alternate User Directory Mode, on an off. If the currently
active Alternate User Directory Mode is AlternateUserDirMode_Off, this
script sets the active Alternate User Directory Mode to
AlternateUserDirMode_Default. This has the same effect as activating the
Default User Mode. Otherwise this script sets the active Alternate User
Directory Mode to AlternateUserDirMode_Off. The Default User Mode causes
user settings to be saved in a subdirectory of the temp directory. The
contents of this directory are transient; that is the contents of this
directory are deleted when the product, JAWS or MAGic, enters or exits
the mode. This mode is used for diagnostic purposes to determine if
problems may be the result of user settings. Since the directory is
initially empty this essentially causes the product to use factory
default settings.

## Returns

Type: Void\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 17.00 and later

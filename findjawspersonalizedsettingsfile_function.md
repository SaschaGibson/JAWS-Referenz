# Function: FindJAWSPersonalizedSettingsFile

## Description

Retrieves the full path to the specified JAWS personalized settings
file. This will depend in part on the current language; it may also
depend on the current logged-in user.

## Returns

Type: String\
Description: Full path to the specified JAWS personalized settings
file.\

## Parameters

### Param 1:

Type: String\
Description: Name of the desired personalized settings file.\
Include: Required\

### Param 2:

Type: Int\
Description: TRUE if the file is to be created in the user\'s
personalized settings directory.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later

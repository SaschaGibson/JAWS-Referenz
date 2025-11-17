# Function: FindJAWSSoundFile

## Description

Retrieves the full path to the specified JAWS sound file. This will
depend in part on the current language; it may also depend on the
current logged-in user.

## Returns

Type: String\
Description: Full path to the specified JAWS sound file.\

## Parameters

### Param 1:

Type: String\
Description: Name of the desired sound file.\
Include: Required\

### Param 2:

Type: Int\
Description: TRUE Optional. if only the user\'s space is to be searched,
FALSE to search both user and shared spaces. Leave this parameter empty
(do not include) to specify FALSE.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later

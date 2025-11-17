# Function: GetOwningAppNameAndVersionNumberForWindow

## Description

Retrieves the path and major version number for the application which
owns the specified window.

## Returns

Type: int\
Description: True if an application path and its major version number
could be retrieved, false otherwise.\

## Parameters

### Param 1:

Type: handle\
Description: The specified handle for which the information is to be
retrieved.\
Include: Required\

### Param 2:

Type: string\
Description: byRef/sApp The full path to the application.\
Include: Required\

### Param 3:

Type: int\
Description: byRef/majorVersion The major version number of the
application.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 16.00 and later

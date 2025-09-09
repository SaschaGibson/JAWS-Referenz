# Function: GrantAppContainerAccess

## Description

In Windows 8 and higher, with Enhance Protected Mode enabled, IE always
runs so that it can\'t access files for which access hasn\'t explicitly
been granted to the AppContainer user. This function allows applications
running in App Container mode to read from JSI or other files.

## Returns

Type: int\
Description: TRUE if the access was granted, FALSE otherwise.\

## Parameters

### Param 1:

Type: string\
Description: The fully qualified name of the file.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 15.0 and later

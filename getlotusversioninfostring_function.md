# Function: GetLotusVersionInfoString

## Description

GetLotusVersionInfoString gets a requested string from the version table
of Lotus Notes application. If version is lower than 6, this function
get the string from String table of this application.

## Returns

Type: String\
Description: The requested string.\

## Parameters

### Param 1:

Type: string\
Description: The path of the Lotus Notes program for which you want the
information. You can get the path by using GetAppFilePath.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later

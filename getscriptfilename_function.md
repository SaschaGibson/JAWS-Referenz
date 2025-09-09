# Function: GetScriptFileName

## Description

Retrieves the name of a currently active default or application script
file. For the application script file, this is the same as the
executable file name of the application, except in those cases where the
originally loaded application script file replaced itself with another
one by me and of SwitchToScriptFile. Similarly, for the active default
script file, this is the name specified in JFW.INI, except in those
cases where the original file replaced itself by means of
SwitchToScriptFile.

## Returns

Type: String\
Description: The name of the script file. This name can be blank if
requesting the application script file name and no application script
file is loaded.\

## Parameters

### Param 1:

Type: Int\
Description: True to obtain the name of the application script file,
False to obtain the name of the default script file.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

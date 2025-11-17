# Function: SwitchToScriptFile

## Description

When this function is called, the currently loaded binary script file (A
file with a .JSB extension) is unloaded from memory and one of the two
script files specified by the functions parameters is loaded in its
place. The first parameter to the function is the name of the first JSB
file you wish for JFW to attempt to load into memory and the second
parameter gives the name of an alternative binary script file that will
only be loaded if the first file cannot be found.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: String\
Description: The name of the binary script file you wish to be loaded
into memory. This parameter must be a script file name in quotes or the
name of a variable in which the script file name is stored. This
parameter must be the script file name with or without a .jsb extension.
An attempt to use a .jss extension in the file name will result in an
error and a warning dialog box.\
Include: Required\

### Param 2:

Type: String\
Description: The name of the binary script file you wish to be loaded
into memory if the first file does not exist. This parameter must be a
script file name in quotes or the name of a variable in which the script
file name is stored. This parameter must contain the script file name
with or without a .jsb extension. An attempt to use a .jss extension in
the file name will result in an error and a warning dialog box.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

# Function: AddCustomNodes

## Description

This companion function to OptionsTreeCore lives in Default and operates
on the string sent to the OptionsTreeCore function, adding node paths
where paths did not exist. See the description for OptionsTreeCore for
complete examples.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: string\
Description: The string upon which to operate, adding the node paths
where they don\'t exist.\
Include: Required\
\* Returns data by reference\

### Param 2:

Type: string\
Description: The node name to explicitly use for all strings not
containing node paths. Leave this blank for JAWS to fill in the node
name based upon the configuration set which is active at runtime.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

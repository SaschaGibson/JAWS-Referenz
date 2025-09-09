# Function: GetListOfObjects

## Description

Given a window handle, retrieves the names of all objects contained in
that window. This function is intended primarily as a tool for script
developers to explore a new aplication and find out the names of objects
contained therein. This info can be used in crafting scripts to use
calls to GetObjectInfoByName.

## Returns

Type: String\
Description: A delimited list of object names.\

## Parameters

### Param 1:

Type: HANDLE\
Description: The window containing the objects of interest\
Include: Required\

### Param 2:

Type: String\
Description: Character to be used as the delimiter between object names.
If not provided, defaults to \\007.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 7.00 and later

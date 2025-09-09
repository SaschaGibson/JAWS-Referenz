# Function: GetObjectClassName

## Description

Retrieves the UIA class name of an object in the focus hierarchy. This
is much faster than using the UIA Script API.

## Returns

Type: String\
Description: the class name.\

## Parameters

### Param 1:

Type: int\
Description: The object in the hierarchy to be used. 0, which is the
default, refers to the object with focus. 1 refers to the parent of the
focus object, 2 refers to the grandparent, etc.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later

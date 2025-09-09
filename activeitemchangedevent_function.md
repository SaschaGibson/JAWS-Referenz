# Function: ActiveItemChangedEvent

## Description

The MSAAMode flag must be set to 2 in the \[Options\] section of your
application-specific jcf file to enable this function. This function
receives the following parameters: the handle for the window containing
the current object, the iD of the object, the iD of the child object,
the handle of the previous window, the iD of the previous object, and
the iD of the previous child object.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Handle\
Description: the handle of the window containing the current object.\
Include: Required\

### Param 2:

Type: Int\
Description: the iD of the current object.\
Include: Required\

### Param 3:

Type: Int\
Description: the iD of the current child.\
Include: Required\

### Param 4:

Type: Handle\
Description: the handle of the window containing the previous object.\
Include: Required\

### Param 5:

Type: Int\
Description: The iD or the previous object.\
Include: Required\

### Param 6:

Type: Int\
Description: the iD of the previous child.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

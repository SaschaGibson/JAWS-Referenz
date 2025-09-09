# Function: JavaObjectChanged

## Description

Since The Java UI does not lend itself to easy scripting like other UI
elements this event has been created to monitor in particular, other
non-focusable object changes so that these changes may be conveyed to
the user.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: String\
Description: Java role of object generating change notification.\
Include: Required\

### Param 2:

Type: String\
Description: AccessibleContextInfo name.\
Include: Required\

### Param 3:

Type: String\
Description: AccessibleContextInfo description.\
Include: Required\

### Param 4:

Type: String\
Description: AccessibleValue\
Include: Required\

### Param 5:

Type: String\
Description: string of all states applicable to the object.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

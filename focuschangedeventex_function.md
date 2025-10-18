# Function: FocusChangedEventEx

## Description

Processes all types of focus change, and calls the proper event to
handle the change according to the type of focus change which occurred.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: handle\
Description: The handle of the window that has received the focus.\
Include: Required\

### Param 2:

Type: int\
Description: The number of the object that has received the focus.\
Include: Required\

### Param 3:

Type: int\
Description: The number of the current child object.\
Include: Required\

### Param 4:

Type: handle\
Description: The handle of the window that previously had the focus.\
Include: Required\

### Param 5:

Type: int\
Description: The number of the object that previously had the focus.\
Include: Required\

### Param 6:

Type: int\
Description: The number of the child object which previously had focus.\
Include: Required\

### Param 7:

Type: int\
Description: The change depth, or number of levels effected by the
change.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 7.00 and later

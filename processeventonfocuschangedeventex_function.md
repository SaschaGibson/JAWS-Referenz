# Function: ProcessEventOnFocusChangedEventEx

## Description

Used by function FocusChangedEventEx to choose which type of event
change function should run and then run it.

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

### Param 8:

Type: string\
Description: The class of the focus window.\
Include: Required\

### Param 9:

Type: int\
Description: the subtype of the object with focus.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later

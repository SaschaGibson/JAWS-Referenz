# Function: PreProcessFocusChangedEventEx

## Description

Used by FocusChangedEventEx to perform any necessary tasks that must
come before all normal tasks associated with speaking as a result of
focus change.

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

1.  JAWS 14.0 and later

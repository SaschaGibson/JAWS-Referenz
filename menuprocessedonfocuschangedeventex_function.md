# Function: MenuProcessedOnFocusChangedEventEx

## Description

Used by function FocusChangedEventEx to perform any special processing
associated with focus change on menu bars or in menus.

## Returns

Type: int\
Description: True if menus are active on focus change and processing
occurred, false otherwise.\

## Parameters

### Param 1:

Type: handle\
Description: The handle of the window that has received the focus.\
Include: Required\

### Param 2:

Type: handle\
Description: The handle of the window that previously had the focus.\
Include: Required\

### Param 3:

Type: int\
Description: The subtype of the object with focus.\
Include: Required\

### Param 4:

Type: int\
Description: The change depth, or number of levels effected by the
change.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later

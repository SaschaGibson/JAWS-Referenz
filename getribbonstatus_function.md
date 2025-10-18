# Function: GetRibbonStatus

## Description

This function returns the status and descriptive information about the
Microsoft Ribbon in the current application. It will work with and
without the virtual ribbon enabled; but, with the virtual ribbon
enabled, unless the real focus is on a lower ribbon item, it will not
obtain lower ribbon information when the virtual cursor is reviewing
lower ribbon objects since they don\'t really have focus.

## Returns

Type: int\
Description: TRUE or FALSE, depending on whether the ribbon data was
obtained for the currently focused application.\

## Parameters

### Param 1:

Type: int\
Description: The state is 0 when the focus is not in the ribbon but the
ribbon is expanded, 1 the focus is in the upper ribbon, 2 the focus is
in the lower ribbon, 3 the ribbon is collapsed. If the state is 0, 1 or
2, the ribbon is expanded, if it is 3, it is collapsed.\
Include: Required\
\* Returns data by reference\

### Param 2:

Type: string\
Description: The name of the active tab if the upper or lower ribbon has
focus.\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: string\
Description: The name of the lower ribbon group if a lower ribbon group
item has focus.\
Include: Required\
\* Returns data by reference\

### Param 4:

Type: string\
Description: The description of the group of the lower ribbon item with
focus.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later

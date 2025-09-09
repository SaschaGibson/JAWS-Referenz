# Function: ConvertListToNodeList

## Description

When you need to add a whole group of options in the same branch of the
tree view, use this function to give each option the same node path.
Pass the group in the standard list format using the vertical bar (\|)
symbol as the primary array delimitor, and the colon (:) symbol as the
divider between the callback function and the display text.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: string\
Description: The list of list item segments, delivered in the
dlgSelect\*ToRun format\
Include: Required\
\* Returns data by reference\

### Param 2:

Type: string\
Description: The node path explicit to the list you specified in the
first parameter.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

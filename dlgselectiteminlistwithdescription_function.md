# Function: DlgSelectItemInListWithDescription

## Description

Displays a dialog that contains a set of menu items. It also contains a
read-only edit in which a description for the selected menu item may be
displayed and reviewed. When the dialog is okayed, the one based index
of the selected item is returned.

## Returns

Type: Int\
Description: This is 0 if the dialog was cancelled, otherwise the one
based index of the selected item.\

## Parameters

### Param 1:

Type: String\
Description: A \"\\007\" (or other delimiter) delimited set of menu
items and descriptions, e.g.
\"item1:desc1\|item2:desc2\|\...itemN:descN\"\
Include: Required\

### Param 2:

Type: String\
Description: A string containing the name you want to appear as the
title for the Menu Select dialog.\
Include: Required\

### Param 3:

Type: Int\
Description: If TRUE, then the contents of the list will be sorted.\
Include: Required\

### Param 4:

Type: Int\
Description: the index of the item which should have the focus when the
dialog is invoked. (JAWS 5.0 and above)\
Include: Optional\

### Param 5:

Type: string\
Description: a list of up to 5 button names delimited with the vertical
bar character \"ButtonCaption1\|ButtonCaption2l\|\...ButtonCaption5\"\
Include: Optional\

### Param 6:

Type: int\
Description: The 1-based button index of the custom button invoked, 0
for cancel, -1 for OK.\
Include: Optional\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 25.0 and later

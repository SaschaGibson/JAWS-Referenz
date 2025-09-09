# Function: lvSetFocusItem

## Description

Moves focus to a specified item in a ListView. Note that this does not
bring the ListView window into focus, it simply causes a specific item
within a ListView to be the focused item in that window. (Superceeded by
SetCurrentItem.)

## Returns

Type: Int\
Description: TRUE if successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: Handle\
Description: The window containing a ListView.\
Include: Required\

### Param 2:

Type: Int\
Description: The 1-based index of the row in the ListView to receive
focus.\
Include: Required\

### Param 3:

Type: Int\
Description: TRUE-Clears focus and selection states of all items before
setting focus. FALSE-leaves states untouched. Defaults to TRUE.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later

# Function: SetCurrentItem

## Description

Moves focus to a specified item in a ListView or combobox. Note that
this does not bring the ListView or combobox window into focus, it
simply causes a specific item to be the focused item in that window.
This function expands the functionality of lvSetFocusItem to also work
for comboboxes.

## Returns

Type: Int\
Description: TRUE if successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: Handle\
Description: The window containing a ListView or combobox.\
Include: Required\

### Param 2:

Type: Int\
Description: The 1-based index of the row in the ListView or combobox to
receive focus.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later

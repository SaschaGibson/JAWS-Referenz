# Function: GetParent

## Description

Determines which window created a specified child window. For Example,
when a dialog box pops up, it could be used to determine the window
handle of the window that created the dialog box. It can be used to move
up through a list of window handles in order to get to a specific
window.

## Returns

Type: Handle\
Description: This is the handle of the parent window.\

## Parameters

### Param 1:

Type: Handle\
Description: This function starts with the window that is identified by
a window handle. Type the name of a variable or choose a script function
that can provide the handle for the starting window.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

# Function: GetHotKey

## Description

Retrieves the first underlined character in the chunk of text on which
the active cursor is positioned. This is especially useful in menus and
dialog boxes where an accelerator key for a particular item has been
defined and is displayed on the screen as a underlined letter in the
name of the control.

## Returns

Type: String\
Description: The first underlined character if one exists, otherwise an
empty string.\

## Parameters

### Param 1:

Type: Handle\
Description: The Handle of the window for which you would like to find
the hot key. If a handle is not provided, the handle of the current
window will be used.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

# Function: FindColors

## Description

Searches for the occurrence of a specific combination of foreground and
background colors. If the search is successful, the JAWS cursor is
placed at the beginning of the text with the desired combination of
colors.

## Returns

Type: Int\
Description: The number is 1 if the search was successful, 0 if it was
not successful.\

## Parameters

### Param 1:

Type: Int\
Description: Type in a variable name or function that can provide the
color value to be used as the foreground color. RGBStringToColor is
often used as a parameter. Use the constant IgnoreColor defined in the
file HJConst.jsh to ignore the foreground color and search only for the
occurrence of the background color.\
Include: Required\

### Param 2:

Type: Int\
Description: Type in a variable name or function that can provide the
color value to be used as the background color. RGBStringToColor is
often used as a parameter. Use the constant IgnoreColor defined in the
file HJConst.jsh to ignore the background color and search only for the
occurrence of the foreground color.\
Include: Required\

### Param 3:

Type: Int\
Description: Type in one of the following constants defined in
HJConst.jsh to indicate the direction of the search: s_top, to search
from the top of the active window; s_bottom, to search from the bottom
of the active window; s_next, to search forward from the position of the
active cursor; s_prior, to search backward from the position of the
active cursor.\
Include: Required\

### Param 4:

Type: int\
Description: set this to TRUE to restrict the search to the window
containing the active cursor, FALSE for an unrestricted search, if not
supplied, defaults to FALSE, ie unrestricted. this optional parameter is
only available in JAWS 6.0\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

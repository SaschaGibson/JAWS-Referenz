# Function: FindLastAttribute

## Description

Searches for the last occurrence of text with certain attributes. It
begins the search at the lower right corner of the active window and
moves up to the upper left corner of the window. If the search is
successful, then the active cursor is placed on the first character that
has the desired attributes. Generally, the PC cursor can be successfully
moved to attributes within a text window.

## Returns

Type: Int\
Description: \"WAS_SUCCESSFUL\" = 1, \"WAS_NOT_SUCCESSFUL\" = 0.
\"FALSE\" = search failure.\

## Parameters

### Param 1:

Type: Int\
Description: Type the name of the constant value for the attribute that
is to be included in the search: ATTRIB_BOLD, ATTRIB_UNDERLINE,
ATTRIB_ITALIC, ATTRIB_HIGHLIGHT, and ATTRIB_STRIKEOUT. You can search
for a combination of attributes by placing a PLUS SIGN (+) between
constants. For example, ATTRIB_BOLD+ATTRIB_UNDERLINE.\
Include: Required\

### Param 2:

Type: int\
Description: set this to TRUE to restrict the search to the window
containing the active cursor, FALSE for an unrestricted search, if not
supplied, defaults to FALSE, ie unrestricted. this optional parameter is
only available in JAWS 6.0\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

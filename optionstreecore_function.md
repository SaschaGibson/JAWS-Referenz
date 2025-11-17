# Function: OptionsTreeCore

## Description

This function is equivalent to VerbosityCore, except that it formats the
string for and presents the \"Adjust JAWS Options\" (Insert+v) dialog
box.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: string\
Description: List of items, wherein the list is segmented using the
vertical bar (\|) symbol. Each segment is divided with the colon (:)
symbol, where segment 1 is the callback function name and segment 2 is
the display text, which may or may not contain a node path. You must
have a callback function and a corresponding hlp callback function with
the same name as segment 1 of each array slice. See UserOptions.jss and
accompanying files for string and function format.\
Include: Required\

### Param 2:

Type: int\
Description: Enter TRue for this optional parameter, if you do not want
this function to update item strings which do not have node paths. If
you ignore or leave this parameter FALSe, your items will be formatted
with the node you specify in the strNewNode parameter. Ignoring these
parameters is the fastest way to get your items in in their own group.\
Include: Optional\

### Param 3:

Type: string\
Description: Enter the explicit path in which to place all items in your
list which do not have nodes.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

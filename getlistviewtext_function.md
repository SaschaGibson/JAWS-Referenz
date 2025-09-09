# Function: GetListViewText

## Description

Retrieves into a string the text for all items in a listview.

## Returns

Type: string\
Description: The retrieved list text.\

## Parameters

### Param 1:

Type: handle\
Description: the window handle of a listview.\
Include: Required\

### Param 2:

Type: int\
Description: a 32-bit flagset specifying which columns to retrieve,
default is all if flagset is 0.\
Include: Optional\

### Param 3:

Type: int\
Description: Boolean specifying whether an empty list item should be
skipped in the output. A list item can be empty if only certain columns
are specified for output and not all listview items contain text in the
specified columns.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 7.00 and later

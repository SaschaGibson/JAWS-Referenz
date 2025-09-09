# Function: IterateLookupModules

## Description

Retrieves all active lookup modules and rule set combinations. Both
lists are delimited by the constant LIST_ITEM_SEPARATER, found in
hjConst.jsh

## Returns

Type: int\
Description: the number of items in the lists\

## Parameters

### Param 1:

Type: string\
Description: string to receive the list of lookup modules. This may
contain duplicate entries, as more than one rule set would correspond to
the same lookup module. Just use iteration to walk through this
bell-char-delimited list.\
Include: Required\
\* Returns data by reference\

### Param 2:

Type: string\
Description: The delimited list of rule sets corresponding to the list
of modules.\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: String\
Description: The Primary lookup module defined in Default.jcf file.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 11.00 and later

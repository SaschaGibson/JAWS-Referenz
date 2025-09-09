# Function: ConvertLookupModuleDataToList

## Description

This list can be used to present to the user via dlgSelectItemInList.

## Returns

Type: string\
Description: a UI-capable list, presenting Rule set first, then Lookup
Module name. This is the Pretty name assigned to the active rule set.\

## Parameters

### Param 1:

Type: int\
Description: The number of items to expect in the subsequent module and
rule set lists.\
Include: Required\

### Param 2:

Type: string\
Description: The list of lookup modules - delimited by
LIST_ITEM_SEPARATOR or the bell char (\\007)\
Include: Required\

### Param 3:

Type: string\
Description: The list of rule sets - delimited by LIST_ITEM_SEPARATOR or
the bell char (\\007)\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 11.00 and later

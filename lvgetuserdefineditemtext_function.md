# Function: lvGetUserDefinedItemText

## Description

If a listview has been customized to speak or be Brailled in a
particular manner, this function retrieves the text of the specified
item as rendered by the customization.

## Returns

Type: string\
Description: the user selected column headers and column data.\

## Parameters

### Param 1:

Type: handle\
Description: the handle to the listview.\
Include: Required\

### Param 2:

Type: int\
Description: a 1-based item whose text you want.\
Include: Required\

### Param 3:

Type: int\
Description: use 0 for speech customization, 1 for Braille
customization, if not present, assumes speech.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later

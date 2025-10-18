# Function: lvIsCustomized

## Description

this function determines if the listview pointed to by the hwnd
parameter has a speech or Braille customization defined for it, this
includes whether there is a default customization defined as well. This
function is used to determine whether or not SayHighlightedText should
be used to speak a listview or whether custom code should be executed.

## Returns

Type: int\
Description: true or false.\

## Parameters

### Param 1:

Type: handle\
Description: the handle to the window.\
Include: Required\

### Param 2:

Type: int\
Description: 0 for speech, 1 for Braille, if not present, defaults to
speech.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later

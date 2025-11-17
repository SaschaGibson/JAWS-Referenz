# Function: dlgSelectFunctionToRun

## Description

Presents a list of functions to be run and displays their current value.
Pressing the space bar or the Execute button will change the return
value of the selected function, based on how the function was written.
It is much like dlgSelectScriptToRun except that it does not merely
speak, but the new return values are placed in the list box.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: String\
Description: strList This is the delimited list to be presented in the
list box. It is in the same format as the dlgSelectScriptToRun
function.\
Include: Required\

### Param 2:

Type: String\
Description: Enter the string consisting of the Dialog\'s name.\
Include: Required\

### Param 3:

Type: Int\
Description: Enter True if the items are to be sorted alphabetically,
false otherwise.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

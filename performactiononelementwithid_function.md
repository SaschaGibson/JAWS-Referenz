# Function: PerformActionOnElementWithID

## Description

This function finds an element in the DOM by its unique ID and performs
an action on it such as setFocus, makeVisible or doDefaultAction.

## Returns

Type: int\
Description: TRUE if the element is found and the action applied, FALSE
otherwise.\

## Parameters

### Param 1:

Type: int\
Description: action setFocus, makeVisible or doDefaultAction, see
hjConst.jsh.\
Include: Required\

### Param 2:

Type: int\
Description: uniqueID must correspond with the fsID attribute of the XML
converted from hextToDec. the FSID must be obtained for the current
session of the page. It is a dynamically changing value much like a
window handle that changes each time the Web page loads. For an example,
see the ListWebAppToolbarControls script in SharePointWeb.jss.\
Include: Required\

### Param 3:

Type: int\
Description: left screen left coordinate.\
Include: Optional\

### Param 4:

Type: int\
Description: top screen top coordinate.\
Include: Optional\

### Param 5:

Type: int\
Description: right screen right coordinate.\
Include: Optional\

### Param 6:

Type: int\
Description: bottom screen bottom coordinate.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 17.0 and later

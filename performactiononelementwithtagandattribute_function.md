# Function: PerformActionOnElementWithTagAndAttribute

## Description

This function finds an element in the DOM by tag and attrib/value pair
and performs an action on it such as setFocus, makeVisible or
doDefaultAction.

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

Type: string\
Description: fsTag must correspond to fsTag attribute of xml, not XML
tag.\
Include: Required\

### Param 3:

Type: string\
Description: attribName an attribute which must be present.\
Include: Required\

### Param 4:

Type: string\
Description: attribValue the value of the attribute specified in
attribName which must match.\
Include: Required\

### Param 5:

Type: int\
Description: left screen left coordinate.\
Include: Optional\

### Param 6:

Type: int\
Description: top screen top coordinate.\
Include: Optional\

### Param 7:

Type: int\
Description: right screen right coordinate.\
Include: Optional\

### Param 8:

Type: int\
Description: bottom screen bottom coordinate.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 17.0 and later

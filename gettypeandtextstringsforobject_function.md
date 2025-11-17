# Function: GetTypeAndTextStringsForObject

## Description

Information about each control is similar to that obtained from
SayObjectTypeAndText. The order in which items appear is dictated by how
they appear in the MSAA hierarchy.

## Returns

Type: String\
Description: The contents of the MSAA object hierarchy excluding certain
control types.\

## Parameters

### Param 1:

Type: object\
Description: The object for which the information is to be retrieved.\
Include: Required\

### Param 2:

Type: int\
Description: TRUE if the function should retrieve text for invisible
nodes.FALSE if invisible node text should be excluded. The default is
true.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later

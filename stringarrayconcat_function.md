# Function: StringArrayConcat

## Description

Creates a new stringArray, and copies the members from array1 followed
by the members of array2 into the new array. If the optional parameter
for compacting has not been specified as true, null members will be
copied into the new array.

## Returns

Type: stringArray\
Description: The newly created array containing the concatenation of the
two array parameters.\

## Parameters

### Param 1:

Type: stringArray\
Description: The array whose members will appear first in the returned
array.\
Include: Required\

### Param 2:

Type: stringArray\
Description: The array whose members will appear after the first array
parameter in the returned array.\
Include: Required\

### Param 3:

Type: int\
Description: True if the returned array should be compacted to contain
only the non-null members of arrays 1 and 2, false otherwise. Default is
false. Uncompacted, the length is the sum of the length of the two array
parameters; compacted, the array length is the sum of the length of the
compacted arrays.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 17.0 and later

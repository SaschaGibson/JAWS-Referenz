# Function: CollectionCopy

## Description

Normally when you assign a variable containing a collection to another
variable, both variables then point at the same collection. This
function allows making a copy of a collection so that each variable
points at a unique copy of the collection. This means that if the
elements of one collection are changed, these changes will not be
reflected in the contents of the other collection.

## Returns

Type: Collection\
Description: a new collection with contents identical to that which was
copied\

## Parameters

### Param 1:

Type: collection\
Description: a variable containing the collection to be coppied\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later

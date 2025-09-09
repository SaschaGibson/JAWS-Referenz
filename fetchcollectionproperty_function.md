# Function: FetchCollectionProperty

## Description

A batch method to retrieve all values from an atomic property of a list
of objects within a VB collection. This assumes that the collection is
indexable, not just accessible by property name. Use this function to
save a for loop\'s worth of round trip calls to access a collection
member by index. Since the return is a variantArray, you can index that
with a local for loop which will process much faster.

## Returns

Type: int\
Description: TRUE if the remote object was accessed, FALSE otherwise.
May return TRUE and also supply an array length of 0 if there are no
members.\

## Parameters

### Param 1:

Type: object\
Description: the VB object collection that can be accessed by index.\
Include: Required\

### Param 2:

Type: string\
Description: the property name of the list to be accessed by index.
Often item, as it\'s written. E.g. list.item(i)\
Include: Required\

### Param 3:

Type: int\
Description: Most VB arrays are 1-based.\
Include: Required\

### Param 4:

Type: int\
Description: the end point of the search, often a VB collection will
have a .count property or method you can use for this.\
Include: Required\

### Param 5:

Type: string\
Description: The atomic property you want, For example, \"name\" if the
access is expressed like: list.Items(i).name\
Include: Required\

### Param 6:

Type: variantArray\
Description: All the values returned as a variant array. Note that even
if the function returns TRUE, it may return a 0-length array.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later

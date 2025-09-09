# Function: FetchObjectProperties

## Description

Retrieve all properties at once for a VB object. This saves round trips
to and from the remote object, where you need to access a lot of
properties of a particular object. For example, in Excel, the cell
object has a lot of properties that are useful, but the round trip cost
to get the properties can be expensive. Note that like a VB object
itself, you may see the name for the property, but its value may be null
or empty.

## Returns

Type: int\
Description: TRUE if the remote object was accessed, FALSE otherwise.
TRUE does not mean the collection has items or that the items all have
values. Only that the remote object was queried successfully.\

## Parameters

### Param 1:

Type: object\
Description: The object whose collection members to fetch.\
Include: Required\

### Param 2:

Type: collection\
Description: a JAWS script language collection a map of the entire
collection in one batch.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later

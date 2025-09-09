# Function: MoveToTagWithAttributeByIndex

## Description

This function moves to a specified tag on a webpage. Specify the 1-based
index of the particular tag to move to In order for the index to
correctly match elements retrieved with GetListOfTagsWithAttribute, the
same attribute and nesting parameter must be supplied. This is primarily
used with the GetListOfTagsWithAttribute function which returns a
delimited string containing tag information for each tag currently
rendered in the virtual document with the specified attribute. The page
must have focus for this function to work.

## Returns

Type: Int\
Description: true if the virtual cursor was moved to a tag, false
otherwise.\

## Parameters

### Param 1:

Type: Int\
Description: index of tag relative to collection of tags with specified
attribute present.\
Include: Required\

### Param 2:

Type: string\
Description: the tag to move to\
Include: Required\

### Param 3:

Type: string\
Description: the attribute which must be present in order to count the
tag as being included in the index\
Include: Required\

### Param 4:

Type: int\
Description: TRUE to allow nesting when determining the instance of the
element to move to, must match the value used when obtaining the list of
tags with the specified attribute.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 8.00 and later

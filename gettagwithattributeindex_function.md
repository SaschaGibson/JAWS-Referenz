# Function: GetTagWithAttributeIndex

## Description

This function returns the 1-based index of the current tag/attribute
supplied, the tag maybe empty in which case the current element or one
of its ancestors must have the supplied attribute. Note that invisible
tags are not counted. If the cursor is not within the specified
tag/attribute, returns 0.

## Returns

Type: Int\
Description: the 1-based tag index or 0.\

## Parameters

### Param 1:

Type: string\
Description: the tag whose index is required (maybe empty).\
Include: Required\

### Param 2:

Type: string\
Description: the attribute which must be present.\
Include: Required\

### Param 3:

Type: int\
Description: whether tag/attribute elements may be nested. This will
affect the index so the same value of this parameter must be present for
related getTagWithAttributeXX functions for results to be correct.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 8.00 and later

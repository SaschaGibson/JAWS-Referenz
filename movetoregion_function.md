# Function: MoveToRegion

## Description

This function moves the virtual cursor to another occurance of the
indicated region type. The first parameter determines the direction of
the move, valid direction constants are listed in hjconst.jsh and
include s_top, s_bottom, s_next and s_prior. The second parameter (if
given) indicates the type of region to move to. If not given, then a
region of any type in the indicated direction is located.

## Returns

Type: Int\
Description: true if a region was found, false otherwise.\

## Parameters

### Param 1:

Type: Int\
Description: one of s_top, s_bottom, s_next or s_prior as defined in
hjconst.jsh.\
Include: Required\

### Param 2:

Type: Int\
Description: one of the wt_typeCode constants.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 14.0 and later

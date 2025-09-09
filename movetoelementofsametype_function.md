# Function: MoveToElementOfSameType

## Description

This function will move the virtual cursor to another occurance of the
same element. The parameter determines the direction of the move, valid
direction constants are listed in hjconst.jsh and include s_top,
s_bottom, s_next and s_prior. For example, if you are on the header of a
list you can move to the next, prior, first or last list in the
document.

## Returns

Type: Int\
Description: true if another element with the same tag was located,
false otherwise.\

## Parameters

### Param 1:

Type: Int\
Description: one of s_top, s_bottom, s_next or s_prior as defined in
hjconst.jsh.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

# Function: BrailleGetSubtypeDisplayName

## Description

This function returns the type display name as defined in the app or
default jbs for the specified type constant. Note that if no value is
defined for a standard window type\'s displayname key in the jbs, the
default string spoken for that type will be returned.

## Returns

Type: String\
Description: the type display name.\

## Parameters

### Param 1:

Type: Int\
Description: either one of the wt_typeCode constants or a constant
representing a custom control ie
wt_custom_control_base+customControlCode.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

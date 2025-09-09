# Function: GetObjectStateCode

## Description

If the PC cursor is active, the state of the object with focus is
returned. Otherwise, the state of the object at the position of the
active cursor is returned.

## Returns

Type: int\
Description: The state of the object.\

## Parameters

### Param 1:

Type: Int\
Description: if TRUE, always obtains this information via MSAA, even in
those situations where other methods would otherwise be used instead.\
Include: Optional\

### Param 2:

Type: int\
Description: Which object in the hierarchy should be spoken. 0, which is
the default, refers to the object with focus. 1 refers to the parent of
the focus object, 2 refers to the grandparent, etc.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later

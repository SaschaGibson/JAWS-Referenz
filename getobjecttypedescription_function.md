# Function: GetObjectTypeDescription

## Description

If the PC cursor is active, the aria-roleDescription text of the object
with focus is returned. Otherwise, the aria-roleDescription text of the
object at the position of the active cursor is returned.

## Returns

Type: string\
Description: If present, the aria-roleDescription text of the object at
the position of the active cursor; otherwise null.\

## Parameters

### Param 1:

Type: int\
Description: If TRUE, always obtains this information via MSAA, even in
those situations where other methods would otherwise be used instead.\
Include: Optional\

### Param 2:

Type: int\
Description: Which object in the hierarchy should be used. 0, which is
the default, refers to the object with focus. 1 refers to the parent of
the focus object, 2 refers to the grandparent, etc.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 24.0 and later

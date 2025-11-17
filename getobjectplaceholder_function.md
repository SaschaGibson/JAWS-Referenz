# Function: GetObjectPlaceholder

## Description

If the PC cursor is active, the placeholder value of the object with
focus is returned. Otherwise, the placeholder value of the object at the
position of the active cursor is returned.

## Returns

Type: string\
Description: The placeholder value of the object at the position of the
active cursor.\

## Parameters

### Param 1:

Type: int\
Description: If TRUE, always obtains this information via MSAA, even in
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

1.  JAWS 24.0 and later

# Function: GetObjectRect

## Description

Will return TRUE if the object has a focus rectangle, FALSE otherwise.
This function takes four int parameters. Left, right, top and bottom.
Declare, but do not initialize, the int variables for these parameters,
as they are passed by reference.

## Returns

Type: Int\
Description: True if a focus rectangle was found surrounding the object,
false otherwise.\

## Parameters

### Param 1:

Type: Int\
Description: the value for the left-hand edge of the focus rectangle
surrounding the object.\
Include: Required\

### Param 2:

Type: Int\
Description: the value for the right-hand edge of the focus rectangle
surrounding the object.\
Include: Required\

### Param 3:

Type: Int\
Description: the value for the top edge of the focus rectangle
surrounding the object.\
Include: Required\

### Param 4:

Type: Int\
Description: the value for the bottom edge of the focus rectangle
surrounding the object.\
Include: Required\

### Param 5:

Type: Int\
Description: if TRUE, always obtains this information via MSAA, even in
those situations where other methods would otherwise be used instead.\
Include: Optional\

### Param 6:

Type: int\
Description: Which object in the hierarchy should be spoken. 0, which is
the default, refers to the object with focus. 1 refers to the parent of
the focus object, 2 refers to the grandparent, etc.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

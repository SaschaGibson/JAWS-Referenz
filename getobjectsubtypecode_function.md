# Function: GetObjectSubTypeCode

## Description

Retrieves the numeric subtype code of the object located at the current
cursor\'s location. Constants for these type codes all begin with WT\_
and are defined in HJCONST.JSH. The numeric values are the same for all
languages of JAWS. Using this function in all conditional statements
instead of using GetObjectType insures that these statements will
function without change in multiple languages. The subtype code is more
specific, i.e. a button can have the sub type of WT_CHECKBOX.

## Returns

Type: Int\
Description: The type of the object at the current cursor\'s location.\

## Parameters

### Param 1:

Type: Int\
Description: if TRUE, always obtains this information via MSAA, even in
those situations where other methods would otherwise be used instead.\
Include: Optional\

### Param 2:

Type: Int\
Description: Level of the object from which to get the type. 0 retrieves
the type code for the object with focus; 1 refers to the parent, 2 the
grand parent, and so on.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

# Function: GetObjectTypeCode

## Description

Retrieves the numeric type code of the object located at the current
cursor\'s location. Constants for these type codes all begin with WT\_
and are defined in HJCONST.JSH. The numeric values are the same for all
languages of JAWS. Using this function in all conditional statements
instead of using GetObjectType insures that these statements will
function without change in multiple languages.

## Returns

Type: Int\
Description: The type of the object at the current cursor\'s location.\

## Parameters

### Param 1:

Type: Int\
Description: if TRUE, always obtains this information via MSAA, even in
those situations where other methods would otherwise be used instead.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

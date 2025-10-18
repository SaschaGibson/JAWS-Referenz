# Function: StepOutOfCurrentElement

## Description

This function moves to the beginning or end of the ancestor element,
effectively stepping out of the element or moving up one level in the
element hierarchy. This can be used for stepping out of a nested list
either to the beginning or end of the nested list. Repeated calls will
keep stepping out of the element at that level until you reach the top
level body. The single parameter specifies whether you are moved to the
end or beginning of the element. A second optional parameter allows you
to specify how many levels you are stepped out. The default is 0 which
means the function will determine the appropriate number of levels for
the current element.

## Returns

Type: Int\
Description: true if the function relocated the virtual cursor, false
otherwise.\

## Parameters

### Param 1:

Type: Int\
Description: true to move to the end or false to move to the beginning.\
Include: Required\

### Param 2:

Type: Int\
Description: how many levels to step out. Use a value of 0 to force the
function to automatically determine the appropriate number of levels to
step out. For example, if you are in a table cell and you want to step
out of the table then nLevels should be at least 2 because the first
level will only refer to the row containing the cell element.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

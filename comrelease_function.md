This function is available in the following releases:

1.  [JAWS 10.0-18.0](#_JAWS10.0-18.0)
2.  [JAWS 19.0 and later](#_JAWS19.0andlater)

# []{#_JAWS10.0-18.0} Function: ComRelease

## Description

When called with a single argument, this is equivalent to assigning the
argument to a null object variable. In other words, if the argument
references an IDispatch object, that object will be released. If the
optional second argument is TRUE, the object will be released in a way
that there is no chance of the Release call blocking, even if the
Release involves calling into another process that isn\'t responsive.
This added functionality is less resource efficient and should only be
used in those situations where the call is likely to block.

## Returns

Type: int\
Description: TRUE if the object has been release, FALSE otherwise.\

## Parameters

### Param 1:

Type: Object\
Description: The object to release\
Include: Required\

### Param 2:

Type: int\
Description: TRUE to take steps to ensure that the call doesn\'t block\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 10.0-18.0

# []{#_JAWS19.0andlater} Function: ComRelease

## Description

When called with a single argument, this is equivalent to releasing the
object without blocking, even if that means to intercept another
process. When the optional second argument is TRUE, the object will be
released in a way that there is no chance of the Release call blocking,
even if the Release involves calling into another process that isn\'t
responsive. When set to FALSE, the second parameter means set the object
to null, releasing the pointer in JAWS. In other words, if the argument
references an IDispatch object, that object will be released. The second
parameter is set to TRUE by default. This added functionality is less
resource efficient and should only be used in those situations where the
call is likely to block.

## Returns

Type: int\
Description: TRUE if the object has been release, FALSE otherwise.\

## Parameters

### Param 1:

Type: Object\
Description: The object to release\
Include: Required\

### Param 2:

Type: int\
Description: TRUE to take steps to ensure that the call doesn\'t block,
false simply to null the object. If this parameter is not specified, the
default is TRUE.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later

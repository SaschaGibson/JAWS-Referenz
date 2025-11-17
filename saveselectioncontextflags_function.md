# Function: SaveSelectionContextFlags

## Description

Strips any flag settings designated as being JCF flags from the flag
set, then writes the remaining flags in the set to the specified JSI
file.

## Returns

Type: int\
Description: The result of the ini write.\

## Parameters

### Param 1:

Type: string\
Description: The section name where the key for the selection flags will
be saved.\
Include: Required\

### Param 2:

Type: int\
Description: The selection flag set.\
Include: Required\

### Param 3:

Type: string\
Description: The name of the JSI file where the setting will be saved.\
Include: Required\

### Param 4:

Type: Int\
Description: Optional parameter. This flag must be set to true to flush
write immediately to disk. True will flush the current write and all
previous writes specified for the file indicated by strFile. Flushing
will be slower. Not flushing will allow the write function to return
quicker, but new data may not be available for subsequent read
functions. Not supplying this parameter will behave as if set to true.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later

# Function: IniRemoveSection

## Description

Removes an entire section an ini style file. An ini style file is a file
containing sections of keys with their values.

## Returns

Type: Int\
Description: TRUE if the section is successfully removed, otherwise
FALSE.\

## Parameters

### Param 1:

Type: String\
Description: The name of the section that will be removed. This value
must either be a variable or contained in quotes.\
Include: Required\

### Param 2:

Type: String\
Description: The path to the ini style file. This value must either be a
variable or contained in quotes. If a directory is not specified, it
will write the file under the \\Settings directory.\
Include: Required\

### Param 3:

Type: Int\
Description: Optional parameter. Starting with JAWS 6.2, this flag must
be set to true to flush write immediately to disk. True will flush the
current write and all previous writes specified for the file indicated
by strFile. Flushing will be slower. Not flushing will allow the write
function to return quicker, but new data may not be available for
subsequent read functions. Not supplying this parameter will behave as
if set to true.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

# Function: IniRemoveSectionEx

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

Type: Int\
Description: Determines the directory where the file is located.\
Include: Required\

### Param 3:

Type: String\
Description: The path to the ini style file. This value must either be a
variable or contained in quotes. If a directory is not specified, it
will write the file under the \\Settings directory.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 6.0 and later

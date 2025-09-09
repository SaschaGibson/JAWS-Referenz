# Function: IniReadSectionKeys

## Description

Retrieves the keys from a section in an ini style file. An ini style
file is a file containing sections of keys with their values.

## Returns

Type: String\
Description: The key names from the given section as a list of strings
delimited by the \'\|\' character. If there no keys, an empty string is
returned.\

## Parameters

### Param 1:

Type: String\
Description: The name of the section containing the desired key value.
This value must either be a variable or contained in quotes.\
Include: Required\

### Param 2:

Type: String\
Description: The path to the ini style file. This value must either be a
variable or contained in quotes. If a directory is not specified, it
will read the file from the User, or if not found then shared, Settings
directory.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

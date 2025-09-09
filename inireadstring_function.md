This function is available in the following releases:

1.  [JAWS 4.51-22.0](#_JAWS4.51-22.0)
2.  [JAWS 23.0 and later](#_JAWS23.0andlater)

# []{#_JAWS4.51-22.0} Function: IniReadString

## Description

Reads a string value from an ini style file. An ini style file is a file
containing sections of keys with their values.

## Returns

Type: String\
Description: The retrieved value or the default value if the key does
not exist in the given section.\

## Parameters

### Param 1:

Type: String\
Description: The name of the section containing the desired key value.
This value must either be a variable or contained in quotes.\
Include: Required\

### Param 2:

Type: String\
Description: The name of the key whose value is to be retrieved. This
value must either be a variable or contained in quotes.\
Include: Required\

### Param 3:

Type: String\
Description: The value that will be returned if the key cannot be
retrieved. This value must either be a variable or contained in quotes.\
Include: Required\

### Param 4:

Type: String\
Description: The path to the ini style file. This value must either be a
variable or contained in quotes. If a directory is not specified, it
will read the file from the User, or if not found then shared, Settings
directory.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51-22.0

# []{#_JAWS23.0andlater} Function: IniReadString

## Description

Reads a string value from an ini style file. An ini style file is a file
containing sections of keys with their values.

## Returns

Type: String\
Description: The retrieved value or the default value if the key does
not exist in the given section.\

## Parameters

### Param 1:

Type: String\
Description: The name of the section containing the desired key value.
This value must either be a variable or contained in quotes.\
Include: Required\

### Param 2:

Type: String\
Description: The name of the key whose value is to be retrieved. This
value must either be a variable or contained in quotes.\
Include: Required\

### Param 3:

Type: String\
Description: The value that will be returned if the key cannot be
retrieved. This value must either be a variable or contained in quotes.\
Include: Required\

### Param 4:

Type: String\
Description: The path to the ini style file. This value must either be a
variable or contained in quotes. If a directory is not specified, it
will read the file from the User, or if not found then shared, Settings
directory.\
Include: Required\

### Param 5:

Type: int\
Description: One of the ReadSource (rs) constants defined in
HJConst.JSH. The possible values are as follows: rsStandardLayering -
causes standard layering behavior to be used, the setting will be read
from the transient focus file first, then the transient session file,
then the user settings file, and finally the shared settings file,
stopping at the first file in which the desired setting is found;
rsSession - the setting will be read from the transient session settings
file, no layering will be used; rsFocus - the setting will be read from
the transient focus settings file, no layering will be used;
rsNoTransient - the transient settings files will be ignored and the
setting will be read from the user settings file layered over the shared
settings file. Note that this parameter is ignored if the FileType
parameter is FT_MODULE_INI, FT_JSI, FT_SHARED_DEFAULT_JCF, or
FT_SHARED_CURRENT_JCF. If this parameter is not specified the default
value of rsStandardLayering will be used.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 23.0 and later

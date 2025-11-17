This function is available in the following releases:

1.  [JAWS 4.51-22](#_JAWS4.51-22)
2.  [JAWS 23 and later](#_JAWS23andlater)

# []{#_JAWS4.51-22} Function: IniWriteInteger

## Description

Writes an integer value to an ini style file. An ini style file is a
file containing sections of keys with their values.

## Returns

Type: Int\
Description: The total number of characters written to the file when the
write is successful. False if the value is not written successfully. If
the file, section, or key does not already exist, it will be created.\

## Parameters

### Param 1:

Type: String\
Description: The name of the section where the key and value will be
written. This value must either be a variable or contained in quotes.\
Include: Required\

### Param 2:

Type: String\
Description: The name of the key that will hold the value. This value
must either be a variable or contained in quotes.\
Include: Required\

### Param 3:

Type: Int\
Description: The value that will be written to the given key.\
Include: Required\

### Param 4:

Type: String\
Description: The path to the ini style file. This value must either be a
variable or contained in quotes. If a directory is not specified, it
will write the file under the \\Settings directory.\
Include: Required\

### Param 5:

Type: Int\
Description: Optional parameter. Starting with JAWS 6.0, this flag must
be set to true to flush write immediately to disk. True will flush the
current write and all previous writes specified for the file indicated
by strFile. Flushing will be slower. Not flushing will allow the write
function to return quicker, but new data may not be available for
subsequent read functions. Not supplying this parameter will behave as
if set to true.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51-22

# []{#_JAWS23andlater} Function: IniWriteInteger

## Description

Writes an integer value to an ini style file. An ini style file is a
file containing sections of keys with their values.

## Returns

Type: Int\
Description: The total number of characters written to the file when the
write is successful. False if the value is not written successfully. If
the file, section, or key does not already exist, it will be created.\

## Parameters

### Param 1:

Type: String\
Description: The name of the section where the key and value will be
written. This value must either be a variable or contained in quotes.\
Include: Required\

### Param 2:

Type: String\
Description: The name of the key that will hold the value. This value
must either be a variable or contained in quotes.\
Include: Required\

### Param 3:

Type: Int\
Description: The value that will be written to the given key.\
Include: Required\

### Param 4:

Type: String\
Description: The path to the ini style file. This value must either be a
variable or contained in quotes. If a directory is not specified, it
will write the file under the \\Settings directory.\
Include: Required\

### Param 5:

Type: Int\
Description: Optional parameter. Starting with JAWS 6.0, this flag must
be set to true to flush write immediately to disk. True will flush the
current write and all previous writes specified for the file indicated
by strFile. Flushing will be slower. Not flushing will allow the write
function to return quicker, but new data may not be available for
subsequent read functions. Not supplying this parameter will behave as
if set to true.\
Include: Optional\

### Param 6:

Type: int\
Description: One of the WriteDestination (wd) constants defined in
HJConst.JSH. The possible values are as follows: wdUser - indicates that
the setting should be saved to the user settings file; wdSession -
indicates that the setting should be saved to the transient session
settings file; wdFocus - indicates that the setting should be saved to
the transient focus settings file. Note that this parameter is ignored
if the FileType parameter is FT_JSI. If this parameter is not specified
the default value of wdUser will be used.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 23 and later

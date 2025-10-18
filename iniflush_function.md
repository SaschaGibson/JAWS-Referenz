# Function: IniFlush

## Description

Flushes all previous writes by IniWriteInteger or IniWriteString
specified for the file indicated by strFile. Flushing will guarantee
that the newly written sections, keys or values will be available for
subsequent reading functions.

## Returns

Type: Int\
Description: TRUE if flush was successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: String\
Description: The path to the ini style file. This value must either be a
variable or contained in quotes. If a directory is not specified, it
will write the file under the \\Settings directory.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 6.0 and later

# Function: GetStringOptionDefaultJSISetting

## Description

Looks in the shared personalized settings for the specified JSI file,
and retrieves the value of the key belonging to the specified section.

## Returns

Type: string\
Description: The FS shared jsi setting. If the file, the section or the
key cannot be found, returns null.\

## Parameters

### Param 1:

Type: string\
Description: the JSI file name, without the \".jsi\" extention.\
Include: Required\

### Param 2:

Type: string\
Description: The section name.\
Include: Required\

### Param 3:

Type: string\
Description: The key name.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 10.0 and later

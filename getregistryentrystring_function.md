This function is available in the following releases:

1.  [JAWS 5.10-24.00](#_JAWS5.10-24.00)
2.  [JAWS 25.0 and later](#_JAWS25.0andlater)

# []{#_JAWS5.10-24.00} Function: GetRegistryEntryString

## Description

Use to get a string entry from the registry.

## Returns

Type: string\
Description: The string of entry, otherwise an empty string.\

## Parameters

### Param 1:

Type: int\
Description: 0=HKEY_CLASSES_ROOT, 1=HKEY_CURRENT_USER,
2=HKEY_LOCAL_MACHINE, 3=HKEY_USERS.\
Include: Required\

### Param 2:

Type: String\
Description: of SubKey\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: String\
Description: of Variable.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 5.10-24.00

# []{#_JAWS25.0andlater} Function: GetRegistryEntryString

## Description

Use to get a string entry from the registry.

## Returns

Type: string\
Description: The string of entry, otherwise an empty string.\

## Parameters

### Param 1:

Type: int\
Description: 0=HKEY_CLASSES_ROOT, 1=HKEY_CURRENT_USER,
2=HKEY_LOCAL_MACHINE, 3=HKEY_USERS.\
Include: Required\

### Param 2:

Type: String\
Description: of SubKey\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: String\
Description: of Variable.\
Include: Required\
\* Returns data by reference\

### Param 4:

Type: String\
Description: A value to return if the requested key value is not set.
This parameter must be a value which is known to be invalid for the key,
so as to be distinguishable from any valid value for the key.\
Include: Optional\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 25.0 and later

# Function: SetRegistryEntryDWORD

## Description

Use to set DWORD entries in registry.

## Returns

Type: int\
Description: 1 if successful, otherwise 0.\

## Parameters

### Param 1:

Type: int\
Description: 0=HKEY_CLASSES_ROOT, 1=HKEY_CURRENT_USER,
2=HKEY_LOCAL_MACHINE, 3=HKEY_USERS.\
Include: Required\

### Param 2:

Type: String\
Description: of SubKey.\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: String\
Description: of Variable\
Include: Required\
\* Returns data by reference\

### Param 4:

Type: int\
Description: to be Assigned variable.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later

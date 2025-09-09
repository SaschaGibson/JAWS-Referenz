# Function: LRL_GetPrimaryLookupModule

## Description

The primary lookup module is the one designated to be used when the user
single presses the LookupModuleInvoke keystroke. The PrimaryLookupModule
key is stored in the JAWS Configuration File \[options\] section. The
key may be application specific.

## Returns

Type: int\
Description: If the function succeeds, TRUE (1) is returned. Otherwise
FALSE (0) is returned.\

## Parameters

### Param 1:

Type: string\
Description: A string that will receive the name of the primary lookup
module.\
Include: Required\
\* Returns data by reference\

### Param 2:

Type: string\
Description: A string that will receive the rule set name of the primary
lookup module. If there is no rule set, the string will be set to \"\".\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later

# Function: GetIntOptionDefaultSetting

## Description

If there is an application-specific JCF setting in setting in the shared
settings, gets that setting; otherwise, gets the setting from
default.jcf in the shared setting.

## Returns

Type: int\
Description: The FS shared JCF setting. If the setting is not found,
returns 0.\

## Parameters

### Param 1:

Type: string\
Description: The section name.\
Include: Required\

### Param 2:

Type: string\
Description: The key name.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 10.0 and later

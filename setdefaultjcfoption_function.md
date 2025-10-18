# Function: SetDefaultJCFOption

## Description

Changes the currently stored default value for an option in memory.

## Returns

Type: Int\
Description: \"WAS_SUCCESSFUL\" = 1 (the value was changed),
\"WAS_NOT_SUCCESSFUL\" = 0 (it was not changed).\

## Parameters

### Param 1:

Type: Int\
Description: Type the constant value that names the option you wish to
change. Constant values are listed in HJCONST.JSH, and begin with the
prefix \"OPT\_\" or \"OPTBRL\_.\" Constants beginning with \"OPTBRL\_\"
are for Braille devices.\
Include: Required\

### Param 2:

Type: Int\
Description: Type the number to be used as the setting for the option.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

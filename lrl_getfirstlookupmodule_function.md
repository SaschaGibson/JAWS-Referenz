# Function: LRL_GetFirstLookupModule

## Description

LRL_GetFirstLookupModule is used to begin an iteration through the
active lookup module/RuleSet combinations.

## Returns

Type: int\
Description: If the function succeeds, TRUE (1) is returned. Otherwise
FALSE (0) is returned. If TRUE is returned, the return value can be
passed to LRL_GetNextLookupModule to retrieve the next lookup
module/rule set combination.\

## Parameters

### Param 1:

Type: String\
Description: A string that will receive the name of the first lookup
module/rule set combination.\
Include: Required\
\* Returns data by reference\

### Param 2:

Type: String\
Description: A string that will receive the rule set name of the first
lookup module/rule set combination. If there is no rule set, the string
will be set to \"\".\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later

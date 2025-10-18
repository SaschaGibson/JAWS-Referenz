# Function: LRL_GetNextLookupModule

## Description

LRL_GetNextLookupModule is used to continue an iteration through the
active lookup module/RuleSet combinations.

## Returns

Type: int\
Description: If the function succeeds, TRUE (1) is returned. Otherwise
FALSE (0) is returned.\

## Parameters

### Param 1:

Type: String\
Description: A string that will receive the name of the next lookup
module/rule set combination.\
Include: Required\
\* Returns data by reference\

### Param 2:

Type: String\
Description: A string that will receive the rule set name of the next
lookup module/rule set combination. If there is no rule set, the string
will be set to \"\".\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later

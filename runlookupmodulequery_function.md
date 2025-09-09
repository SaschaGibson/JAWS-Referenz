# Function: RunLookupModuleQuery

## Description

Run Query either based on the supplied lookup module / rule set
combination, or one or more of the optional parameters. You can leave
both Rule set and Module blank to use the primary lookup module, or fill
in one or both parameters. Fill in just he rule set parameter if you
want to use the FS Lookup module. This is the case unless you have
written or been supplied with a module dll using the Live Resource
Lookup API. Most rule sets that apply to web services will use FSLookup
(the default).

## Returns

Type: Void\

## Parameters

### Param 1:

Type: string\
Description: The text to send to the lookup module and rule set
combination.\
Include: Required\

### Param 2:

Type: string\
Description: The rule set to apply to the supplied Lookup module. If no
module was supplied, the FSLookup module will be used. Leave this param
blank if you are using the primary (default) or your module does not
accept rule sets.\
Include: Optional\

### Param 3:

Type: string\
Description: Optional lookup module to use. If not supplied, the
FSLookup Module will be used.\
Include: Optional\

### Param 4:

Type: string\
Description: optional error string to use if the query causes Invoke to
return 0 or the string is empty\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 11.00 and later

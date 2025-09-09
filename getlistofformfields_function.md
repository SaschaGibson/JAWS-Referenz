# Function: GetListOfFormFields

## Description

This function returns a delimited list of form fields currently rendered
in the VPC buffer. Specify the delimiter for the list using the optional
string parameter.

## Returns

Type: String\
Description: the delimited list of form fields.\

## Parameters

### Param 1:

Type: String\
Description: The delimiter to use to separate the form fields\
Include: Optional\

### Param 2:

Type: int\
Description: one of the WT\_ constants to match on or wt_unknown (or 0)
for all. This enables a list of specific formfield types to be
retrieved. Note this extra param is only available in JAWS 6.0 and
higher.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.00 and later

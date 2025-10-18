# Function: MoveToFormFieldByIndex

## Description

This function moves to a specified form field on a webpage. Specify the
1-based index of the form field to move to. This is primarily used with
the GetListOfFormFields function which returns a delimited string
containing the prompt, type and text of all formfields.

## Returns

Type: Int\
Description: true if the virtual cursor was moved to a form field, false
otherwise.\

## Parameters

### Param 1:

Type: Int\
Description: of form field.\
Include: Required\

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

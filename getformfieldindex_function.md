# Function: GetFormFieldIndex

## Description

This function returns the 1-based index of the current formfield. Note
that if the ControlType optional parameter is supplied and specifies a
valid WT constant, this function will return the index for that control
type only.

## Returns

Type: Int\
Description: the 1-based table index or 0.\

## Parameters

### Param 1:

Type: int\
Description: one of the WT\_ constants to match on or wt_unknown (or 0)
for all. This enables a list of specific formfield types to be
retrieved. Note this extra param is only available in JAWS 6.0 and
higher.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later

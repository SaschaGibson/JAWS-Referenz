# Function: BrailleRunJBSValidationFunction

## Description

The scripter, while building up a list of JBS files, can call this
function passing in a JBS file name, to run the validation function
defined in that JBS. Based on the result of calling that function, the
scripter can choose to include or exclude the JBS in the list.

## Returns

Type: int\
Description: the result of running the validation function defined in
the named JBS file.\

## Parameters

### Param 1:

Type: string\
Description: JBSFileName\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 25.0 and later

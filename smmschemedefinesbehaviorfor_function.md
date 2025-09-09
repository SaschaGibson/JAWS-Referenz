# Function: smmSchemeDefinesBehaviorFor

## Description

This function is used to determine if the current scheme defines a
behavior for any of the specified text option flags. For example,
calling this function with a parameter of toAttributes will return 0 for
classic since the classic scheme ignores any text attributes. Calling
this function with a parameter of toAttributes with the Proofreading or
Classic with Attributes schemes loaded however will return 1.

## Returns

Type: int\
Description: true if the current scheme will act upon the supplied text
options, false otherwise.\

## Parameters

### Param 1:

Type: int\
Description: iTextOptions any number of text options bitwise ored
together (see HJConst.jsh) for the list of text options.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later

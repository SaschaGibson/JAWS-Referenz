# Function: SayParagraph

## Description

Reads the paragraph containing the character on which the active cursor
is positioned.

## Returns

Type: Int\
Description: TRUE if a paragraph was found at the current cursor
location, FALSE otherwise.\

## Parameters

### Param 1:

Type: int\
Description: If true, and we fail to get paragraph information by using
more advanced interfaces, don\'t attempt to read paragraph text using
the information written on the screen. This is useful for quelling extra
verbiage in specific situations. Setting this parameter to true is not
recommended. The default value, if the parameter is not specified, is
FALSE. Please note this parameter is only available in JAWS versions
later than 8.0, with a build number greater than 1000.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

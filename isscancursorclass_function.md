# Function: IsScanCursorClass

## Description

Tests if the supplied class name is recognized as one which is valid for
the JAWS Scan or Invisible Scan cursor. The GenericUIAClasses section in
the JCF file specifies class names which are used to allow scan cursor
versions of the review cursors.

## Returns

Type: int\
Description: True if the supplied class name is valid for scan cursor
activation, false otherwise.\

## Parameters

### Param 1:

Type: string\
Description: The window class name to test. To be a valid class name for
the scan cursors, the supplied class name must start with one of the
class names listed as valid in the GenericUIAClasses section of the JCF
file.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 21.0 and later

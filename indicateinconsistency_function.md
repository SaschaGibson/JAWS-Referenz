# Function: IndicateInconsistency

## Description

This function is called from IndicateInconsistenciesInRange and other
functions to speak the data of an inconsistency detected in text.

## Returns

Type: void\

## Parameters

### Param 1:

Type: int\
Description: Type of inconsistency detected\
Include: Required\

### Param 2:

Type: string\
Description: The character string containing the characters of the
inconsistency\
Include: Required\

### Param 3:

Type: int\
Description: The offset from the start of the range where the
inconsistency occurred.\
Include: Required\

### Param 4:

Type: collection\
Description: If moving to the inconsistency to be spoken, the collection
is used to pass data about the font prior to the move. This data is
compared to the current font data to determine what should be reported
as a font change. If not moving to the inconsistency to be spoken, omit
this parameter since font changes cannot be compared.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later

# Function: ParseDateString

## Description

Convert a date string into month, day, year as integers in out
parameters.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: String\
Description: The date string formatted for the current locale. Must be
formatted as Month, Day and year in the local system format as
GetUserLocaleInfo (LOCALE_ILANGUAGE)\
Include: Required\

### Param 2:

Type: int\
Description: Receives the month as number.\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: int\
Description: Receives the day as number.\
Include: Required\
\* Returns data by reference\

### Param 4:

Type: int\
Description: Receives the year as number.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 15.0 and later

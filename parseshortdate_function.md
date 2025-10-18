# Function: ParseShortDate

## Description

Formats a locale-specific date string in a short date format into a
string in the standard form YYYY/MM/DD.

## Returns

Type: String\
Description: The formatted date.\

## Parameters

### Param 1:

Type: String\
Description: a short date string in a Locale specific format\
Include: Required\

### Param 2:

Type: String\
Description: A year to be added to the shortDateString. If not provided
then the shortDateString is assumed to be fully qualified\
Include: Optional\

### Param 3:

Type: String\
Description: The LCID representing the format of strDate. Defaults to
the system LCID.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

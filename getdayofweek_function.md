# Function: GetDayOfWeek

## Description

Returns a localized string representing the day of the week given a date
in the YYYY/MM/DD format. The day can be either the long day format or
the short day format.

## Returns

Type: String\
Description: The day of the week\

## Parameters

### Param 1:

Type: String\
Description: a date in the format YYYY/MM/DD\
Include: Required\

### Param 2:

Type: String\
Description: \"L\" or \"S\". Determines if the day of the week is
returned as a short abbreviated day or a long day. Defaults to a long
day name.\
Include: Optional\

### Param 3:

Type: String\
Description: The LCID to be used for determining the language in which
the day name should be returned. Defaults to the system LCID.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

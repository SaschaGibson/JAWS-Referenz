# Function: GetLastMSAAAlertInfo

## Description

This function allows the user to retrieve the text and alert level of
the last MSAA alert.

## Returns

Type: int\
Description: TRUE if there is alert data still in the buffer, FALSE
otherwise\

## Parameters

### Param 1:

Type: string\
Description: the text of the alert\
Include: Required\
\* Returns data by reference\

### Param 2:

Type: int\
Description: the priority level of the alert, 1 highest, 3 lowest\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 7.00 and later

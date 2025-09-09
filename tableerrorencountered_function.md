# Function: TableErrorEncountered

## Description

Tests to determine if there are any error conditions that should prevent
table navigation and other table-related scripts from proceeding, such
as table navigation not supported or not in a table. If an error
condition is encountered, and error message is spoken and the function
returns true.

## Returns

Type: int\
Description: True if an error was encountered that would prevent table
navigation and other table scripts from proceeding, false otherwise.\

## Parameters

### Param 1:

Type: int\
Description: The table navigation direction. If table navigation is
supported for some types of navigation but not others, use this
parameter to check the type of table navigation that is requested. Use
the Table_Nav constants in HJConst.jsh to test the requested type of
navigation.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 13.0 and later

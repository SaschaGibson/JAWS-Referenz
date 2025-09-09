# Function: GetListOfTables

## Description

This function returns a delimited list of tables currently rendered in
the VPC buffer. Specify the delimiter for the list using the optional
string parameter. The information for each table will be taken from its
caption, Summary, (if no Caption) or text within the table. If the table
doesn\'t have any text then the table entry will be labelled untitled N
where N increases from 1 for each untitled table. This function is used
in conjunction with MoveToTableByIndex and GetTableIndex to facilitate
the listing of tables in a ddocument and the ability for the user to
select and move directly to any of the tables listed.

## Returns

Type: String\
Description: the delimited list of tables.\

## Parameters

### Param 1:

Type: String\
Description: The delimiter to use to separate the table information for
each table in the list.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later

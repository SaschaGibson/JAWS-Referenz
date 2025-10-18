# Function: GetListOfTags

## Description

This function returns a delimited list of elements with the specified
tag currently rendered in the VPC buffer. Specify the tag and the
attributes you wish to be used for information about the tag. If a tag
doesn\'t have any of the attributes in the comma delimited list, the
inner text of the tag will be used if possible. Specify the delimiter
for the list using the optional string parameter. The information for
each table will be taken from its caption, Summary, (if no Caption) or
text within the table. If the table doesn\'t have any text then the
table entry will be labelled untitled N where N increases from 1 for
each untitled table. This function is used in conjunction with
MoveToTableByIndex and GetTableIndex to facilitate the listing of tables
in a ddocument and the ability for the user to select and move directly
to any of the tables listed.

## Returns

Type: String\
Description: the delimited list of tags.\

## Parameters

### Param 1:

Type: string\
Description: the UPPERCASE HTML tag to collect.\
Include: Required\

### Param 2:

Type: string\
Description: a comma delimited list of HTML attributes to look for when
gathering information about the tag.\
Include: Required\

### Param 3:

Type: String\
Description: The delimiter to use to separate the tag information for
each tag in the list.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later

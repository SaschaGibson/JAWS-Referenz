# Function: GetListOfTagsWithAttribute

## Description

This function returns a delimited list of elements with the specified
tag currently rendered in the VPC buffer. The element must have the
supplied attribute. You may optionally also indicate if the tags may be
nested or not (which will affect their index). Specify the delimiter for
the list using the optional string parameter. This function is used in
conjunction with MoveToTagWithAttributeByIndex and related functions. If
you specify that you want the value of the attribute included in each
list item (see optional param 6), the list\'s elements will be divided
into two parts, the first part is the value of the supplied attribute
followed by a colon. The second part is the inner text of the element.
For example, in The AOL AIM Triton History Window, this function may be
used to obtain information about the messages. The list will look
something like \|MSGID:text\|MSGID:text\|\...

## Returns

Type: String\
Description: the delimited list of tags.\

## Parameters

### Param 1:

Type: string\
Description: the UPPERCASE HTML tag to collect (maybe empty if you want
all tags with a specific attribute such as any element with an
onclick).\
Include: Required\

### Param 2:

Type: string\
Description: the attribute which each element in the list must have and
whose value is optionally included as part of the list items retrieved.\
Include: Required\

### Param 3:

Type: int\
Description: TRUE to allow nested elements, FALSE to disallow nesting.
Default is TRUE\
Include: Optional\

### Param 4:

Type: String\
Description: The delimiter to use to separate the tag information for
each tag in the list.\
Include: Optional\

### Param 5:

Type: handle\
Description: the handle of the document (may not have focus). If this
parameter is not supplied, we assume the document has focus.\
Include: Optional\

### Param 6:

Type: int\
Description: if TRUE, the value of the attribute will be included in
each list item, if FALSE, the value of the attribute will not be
included.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 8.00 and later

# Function: GetProofreadingElementInfo

## Description

This function allows the scripter to obtain information about an element
at the cursor such as the text, author, initials, type and date of the
element (if relevant). Not all components are returned for all element
types.

## Returns

Type: int\
Description: TRUE if info was obtained for the specified element type,
FALSE otherwise\

## Parameters

### Param 1:

Type: int\
Description: see HJConst.jsh for types, prefixed by pe.\
Include: Required\

### Param 2:

Type: string\
Description: text of element\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: string\
Description: author\'s name\
Include: Required\
\* Returns data by reference\

### Param 4:

Type: string\
Description: Author\'s initials\
Include: Required\
\* Returns data by reference\

### Param 5:

Type: string\
Description: extra descriptive information (such as revision type if
element is a revision).\
Include: Required\
\* Returns data by reference\

### Param 6:

Type: string\
Description: date of element creation (such as revision or comment
date).\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

# Function: LRL_Invoke

## Description

Invoke performs a request from a lookup module.

## Returns

Type: int\
Description: If the function succeeds, 0 is returned. Otherwise a
non-zero value specifying the error is returned.\

## Parameters

### Param 1:

Type: String\
Description: A string that contains the name of the lookup module.\
Include: Required\

### Param 2:

Type: String\
Description: A string that contains the rule set specifier that the
lookup module may use to perform the query. This string may be \"\" if
no rule set applies\
Include: Required\

### Param 3:

Type: String\
Description: A string containing the input data for the query. This may
be the word or phrase at the current cursor. This value may be \"\" if
the lookup module utilizes the Context and Offset arguments.\
Include: Required\

### Param 4:

Type: String\
Description: A string containing context data for the query. For
example, some lookup modules may utilize the sentence or paragraph
containing the target word. This argument can be \"\".\
Include: Required\

### Param 5:

Type: Int\
Description: The 0-based offset of the targeted word in lpszContext. -1
indicates no offset.\
Include: Required\

### Param 6:

Type: String\
Description: A string that will be populated with the returned text. If
a non-zero error code is returned, strOut may be populated with
additional error information.\
Include: Required\
\* Returns data by reference\

### Param 7:

Type: String\
Description: A string that may be populated with custom formatted,
lookup module specific information. For example, a translation lookup
module may include information about the input and output locales for
the translation. This string may be \"\".\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later

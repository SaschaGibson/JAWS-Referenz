# Function: GetObjectInfoByName

## Description

Given a window handle and the name of an objectt contained in that
window, retrieves information about that object. In most cases, this
information is obtained using MSAA. Using this function is much faster
than directly using MSAA functions to walk the object hierarchy to find
the object of interest and then querying the object for the equivalent
information. Information is returned in byRef parameters. Not all
information is available for all objects.

## Returns

Type: int\
Description: TRUE if function was successful, false on failure.\

## Parameters

### Param 1:

Type: HANDLE\
Description: The window containing the object of interest\
Include: Required\

### Param 2:

Type: string\
Description: The name of the object desired\
Include: Required\

### Param 3:

Type: int\
Description: If there is more than one object with this name, which one
is desired. To retrieve the first occurance, pass in 1 as the value for
this parameter.\
Include: Required\

### Param 4:

Type: int\
Description: On return will contain the object\'s subtype code.\
Include: Required\
\* Returns data by reference\

### Param 5:

Type: int\
Description: On return will contain the object\'s state flags. This will
be a combination of Control Attribute identifiers defined in
HJCONST.JSH.\
Include: Optional\
\* Returns data by reference\

### Param 6:

Type: String\
Description: On return will contain the object\'s value.\
Include: Optional\
\* Returns data by reference\

### Param 7:

Type: String\
Description: On return will contain the object\'s description.\
Include: Optional\
\* Returns data by reference\

### Param 8:

Type: String\
Description: On return will contain the object\'s HotKey\
Include: Optional\
\* Returns data by reference\

### Param 9:

Type: string\
Description: On return will contain the name of the object that contains
this object.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 7.00 and later

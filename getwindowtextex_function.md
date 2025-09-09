This function is available in the following releases:

1.  [JAWS 10.0 and later](#_JAWS10.0andlater)
2.  [JAWS 4.51-9.00](#_JAWS4.51-9.00)

# []{#_JAWS10.0andlater} Function: GetWindowTextEx

## Description

Retrieves the text contained in a window. It functions similar to
GetWindowText but allows you to select whether or not to retrieve the
text in all child windows.

## Returns

Type: String\
Description: The retrieved text.\

## Parameters

### Param 1:

Type: Handle\
Description: The handle of the window containing the requested text.
GetFocus can be used to return this value.\
Include: Required\

### Param 2:

Type: Int\
Description: Enter TRUE if only highlighted text is requested, otherwise
FALSE.\
Include: Required\

### Param 3:

Type: Int\
Description: Enter TRUE if text within child windows should be included,
FALSE if only text from this window should be retrieved.\
Include: Required\

### Param 4:

Type: Int\
Description: Enter TRUE to inhibit NewTextEvent\'s for any new strings
returned by this function that have not yet triggered a NewTextEvent.
Enter FALSE if this function should not affect NewTextEvent\'s. The
default is TRUE. (Available as of JAWS 10.0 Update 1)\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 10.0 and later

# []{#_JAWS4.51-9.00} Function: GetWindowTextEx

## Description

Retrieves the text contained in a window. It functions similar to
GetWindowText but allows you to select whether or not to retrieve the
text in all child windows.

## Returns

Type: String\
Description: The retrieved text.\

## Parameters

### Param 1:

Type: Handle\
Description: The handle of the window containing the requested text.
GetFocus can be used to return this value.\
Include: Required\

### Param 2:

Type: Int\
Description: Enter TRUE if only highlighted text is requested, otherwise
FALSE.\
Include: Required\

### Param 3:

Type: Int\
Description: Enter TRUE if text within child windows should be included,
FALSE if only text from this window should be retrieved.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51-9.00

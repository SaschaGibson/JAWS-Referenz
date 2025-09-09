This function is available in the following releases:

1.  [JAWS 4.51-10.0](#_JAWS4.51-10.0)
2.  [JAWS 11.0 and later](#_JAWS11.0andlater)

# []{#_JAWS4.51-10.0} Function: FindString

## Description

FindString searches for a string of text in a specified window. If the
text is found, then the JAWS cursor is placed at the beginning of the
text string

## Returns

Type: Int\
Description: \"WAS_SUCCESSFUL\" = 1, \"WAS_NOT_SUCCESSFUL\" = 0.\

## Parameters

### Param 1:

Type: Handle\
Description: Specify a window handle. Type the name of a variable or
choose a script function to provide the handle of the window that is to
be searched.\
Include: Required\

### Param 2:

Type: String\
Description: Specify the text that is to be located. Type a text string,
or type a variable name or choose a script function that can provide the
text. Text strings must be enclosed within quotation marks.\
Include: Required\

### Param 3:

Type: Int\
Description: Indicate the search direction. Type the name of a constant
value to indicate the direction of the search: S_TOP or S_BOTTOM.\
Include: Required\

### Param 4:

Type: Int\
Description: Indicate search restriction. Type the name of a constant
value to indicate whether the search should be restricted to the active
window or it should extend into all child windows of the active
application. Type S_UNRESTRICTED to search all application windows or
S_RESTRICTED to limit the search to the active child window.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51-10.0

# []{#_JAWS11.0andlater} Function: FindString

## Description

FindString searches for a string of text in a specified window. If the
text is found, then the JAWS cursor is placed at the beginning of the
text string

## Returns

Type: Int\
Description: \"WAS_SUCCESSFUL\" = 1, \"WAS_NOT_SUCCESSFUL\" = 0.\

## Parameters

### Param 1:

Type: Handle\
Description: Specify a window handle. Type the name of a variable or
choose a script function to provide the handle of the window that is to
be searched.\
Include: Required\

### Param 2:

Type: String\
Description: Specify the text that is to be located. Type a text string,
or type a variable name or choose a script function that can provide the
text. Text strings must be enclosed within quotation marks.\
Include: Required\

### Param 3:

Type: Int\
Description: Indicate the search direction. Type the name of a constant
value to indicate the direction of the search: S_TOP or S_BOTTOM.\
Include: Required\

### Param 4:

Type: Int\
Description: Indicate search restriction. Type the name of a constant
value to indicate whether the search should be restricted to the active
window or it should extend into all child windows of the active
application. Type S_UNRESTRICTED to search all application windows or
S_RESTRICTED to limit the search to the active child window.\
Include: Required\

### Param 5:

Type: int\
Description: set to TRUE to use the ap\'s underlying DOM to find text
even if not onscreen, FALSE to do an onscreen search (for backward
script compatibility, defaults to FALSE)\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later

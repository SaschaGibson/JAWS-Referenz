# Function: UserBufferAddTextResultsViewer

## Description

This function adds the text to the Virtual User Buffer along with the
specified function. The function\'s display name is used in the links
dialog as a human readable name in place of the code function name. This
Results Viewer version of the UserBufferAddText function also sends text
to the Results Viewer\'s web control.

## Returns

Type: Int\
Description: true if the text was added, false if not.\

## Parameters

### Param 1:

Type: String\
Description: The text to be added to the buffer (if this doesn\'t end in
a newline character then one will be added)\
Include: Required\

### Param 2:

Type: String\
Description: the function name including any parentheses and parameters
to be called when the Enter key or mouse click occurs in the associated
text.\
Include: Optional\

### Param 3:

Type: String\
Description: the name to be used in the list links dialog when it is
invoked when the User Virtual Buffer is active.\
Include: Optional\

### Param 4:

Type: String\
Description: the name of the font used for ins+f when located in this
text.\
Include: Optional\

### Param 5:

Type: Int\
Description: the point size of the font used for ins+f when located in
this text.\
Include: Optional\

### Param 6:

Type: Int\
Description: the attribute flags used for ins+f when located in this
text for.\
Include: Optional\

### Param 7:

Type: Int\
Description: the text colour.\
Include: Optional\

### Param 8:

Type: Int\
Description: the background color.\
Include: Optional\

### Param 9:

Type: Int\
Description: add a line break to this string automatically, true by
default.\
Include: Optional\

### Param 10:

Type: int\
Description: Control Type (see WT_XX constants in HJConst.jsh (JAWS 7.0
and higher)\
Include: Optional\

### Param 11:

Type: int\
Description: Control State, see CTRL_STATE constants in HJConst.jsh
(JAWS 7.0 and higher)\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 13.0 and later

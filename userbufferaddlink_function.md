# Function: UserBufferAddLink

## Description

Adds a link to the virtual user buffer using the specified text and
function.

## Returns

Type: Int\
Description: true if the text was added, false otherwise.\

## Parameters

### Param 1:

Type: String\
Description: The text to be added to the user buffer (if this doesn\'t
end in a newline character then one will be added).\
Include: Required\

### Param 2:

Type: String\
Description: The function name including any parentheses and parameters
to be called when the Enter key or mouse click occurs in the associated
text.\
Include: Required\

### Param 3:

Type: String\
Description: The name to be used in the list links dialog. If omitted,
the text from the first parameter, the user buffer text, is used.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 15.0 and later

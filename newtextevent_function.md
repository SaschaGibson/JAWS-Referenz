# Function: NewTextEvent

## Description

When this function is called, it receives information pertaining to the
newly written text. If the text was written in a frame, then the text is
spoken according to the frame\'s echo setting. Otherwise the text is
sent to SayHighlightedText() or SayNonHighlightedText. For a list of
parameters received by NewTextEvent and their descriptions, look at the
Existing Parameters List box on the Parameters page. For most compatible
results, overwrite one of the functions called by NewTextEvent rather
than overwriting NewTextEvent itself.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Handle\
Description: Handle of the window containing the text that was written.\
Include: Required\

### Param 2:

Type: String\
Description: String containing the text that was written.\
Include: Required\

### Param 3:

Type: Int\
Description: The attributes of the text that was written.\
Include: Required\

### Param 4:

Type: Int\
Description: The foreground color of the text that was written.\
Include: Required\

### Param 5:

Type: Int\
Description: The background color of the text that was written.\
Include: Required\

### Param 6:

Type: Int\
Description: The echo setting associated with this text.\
Include: Required\

### Param 7:

Type: String\
Description: The name of the frame containing the newly written text if
applicable.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

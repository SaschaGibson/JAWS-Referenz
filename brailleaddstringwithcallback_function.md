# Function: BrailleAddStringWithCallback

## Description

Like BrailleAddString, but rather than supplying a click point, supply a
function to be executed if a routing button is clicked within this
segment. The function may have parameters, e.g.
BrailleAddStringWithCallback(\"hello\", \"sayString(\\\"hello\\\")\",
attrib_highlight)

## Returns

Type: Int\
Description: TRUE if successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: string\
Description: the string to Braille.\
Include: Required\

### Param 2:

Type: string\
Description: a function and its parameters.\
Include: Required\

### Param 3:

Type: int\
Description: attributes such as attrib_highlight, etc.\
Include: Optional\

### Param 4:

Type: int\
Description: noTranslation set to true to force no translation for text
in the focused item. If false or not supplied, text is translated if
appropriate.\
Include: Optional\

### Param 5:

Type: int\
Description: noSegmentDelimiter set to true if you do not want the space
between segments. If false or not supplied, a segment delimiter space is
added.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later

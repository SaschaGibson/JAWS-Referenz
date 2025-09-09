# Function: GetTextInRect

## Description

This function gets text inside a rectangle specified by four points on
the screen representing the top, bottom, left, and right boundaries of
the rectangle.

## Returns

Type: String\
Description: Text inside the rectangle.\

## Parameters

### Param 1:

Type: Int\
Description: Left edge of rectangle.\
Include: Required\

### Param 2:

Type: Int\
Description: top edge of rectangle.\
Include: Required\

### Param 3:

Type: Int\
Description: right edge of rectangle.\
Include: Required\

### Param 4:

Type: Int\
Description: bottom edge of rectangle.\
Include: Required\

### Param 5:

Type: Int\
Description: attributes of text to include. Use 0 to include all text or
use a combination of attribute flags to only return text with those
attributes.\
Include: Optional\

### Param 6:

Type: Int\
Description: color of text to include, use IgnoreColor constant for any
color.\
Include: Optional\

### Param 7:

Type: Int\
Description: background color of text to include.\
Include: Optional\

### Param 8:

Type: Int\
Description: Whether or not to add line breaks or to get the text as one
long string.\
Include: Optional\

### Param 9:

Type: Int\
Description: The prefered coordinate system in which the value should be
returned This is only a recommendation and will not work in all places.
See the COORDSYS_xxx constants in hjconst.jsh.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

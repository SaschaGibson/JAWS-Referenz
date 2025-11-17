# Function: BrailleAddColorField

## Description

Adds the current color field\'s line segment range to the Braille
display\'s structured data including cursor tracking within the field.
Note that this adds the current line segment falling within the color
field, not the entire color field in the event that the color field
spans multiple lines.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: The maximum distince to look left. The default distance is
0 pixels.\
Include: Optional\

### Param 2:

Type: Int\
Description: The maximum distance to look right. The default distance is
0 pixels.\
Include: Optional\

### Param 3:

Type: int\
Description: If True, JAWS looks left first, otherwise JAWS looks right
first. The default value is true.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 14.00 and later

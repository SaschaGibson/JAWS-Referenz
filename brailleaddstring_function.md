# Function: BrailleAddString

## Description

Used with in BrailleBuildLine to add text to the Braille display.

## Returns

Type: Int\
Description: TRUE if successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: String\
Description: Text to be added.\
Include: Required\

### Param 2:

Type: Int\
Description: The X position for the mouse to click if a routing button
is pressed over any of the cells in this string. This value is used
along with Y position to determine where to click. Make both values 0 if
no click should happen.\
Include: Required\

### Param 3:

Type: Int\
Description: the Y position for the mouse to click if a routing button
is pressed over any of the cells in this string. This value is used
along with X position to determine where to click. Make both values 0 if
no click should happen.\
Include: Required\

### Param 4:

Type: Int\
Description: Combination of the ATRIB_xxx values from HJCONST.JSH that
indicate the attributes of the characters in this string.\
Include: Required\

### Param 5:

Type: int\
Description: output this string directly without translation even if
Grade II or UEB is turned on. (Available as of JAWS 10.0.)\
Include: Optional\

### Param 6:

Type: int\
Description: JAWS 19 and later: Set to true if you do not want the space
between segments. If false or not supplied, a segment delimiter space is
added.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

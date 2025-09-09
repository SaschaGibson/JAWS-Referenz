This function is available in the following releases:

1.  [JAWS 4.51-13.00](#_JAWS4.51-13.00)
2.  [JAWS 14.00 and later](#_JAWS14.00andlater)

# []{#_JAWS4.51-13.00} Function: GetColorField

## Description

Obtains the color field at the position of the active cursor. A color
field is a section of information, usually text, that has a common
combination of colors. For example, the combination might be white
foreground on blue background. The use of the color combination must be
contiguous. GetColorField is similar to GetField. However, the function
GetColorField is based on color changes, while GetField is based on
attribute changes.

## Returns

Type: String\
Description: The color field pointed to by the active cursor.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 4.51-13.00

# []{#_JAWS14.00andlater} Function: GetColorField

## Description

Obtains the color field at the position of the active cursor. A color
field is a section of information, usually text, that has a common
combination of colors. For example, the combination might be white
foreground on blue background. The use of the color combination must be
contiguous. GetColorField is similar to GetField. However, the function
GetColorField is based on color changes, while GetField is based on
attribute changes.

## Returns

Type: String\
Description: The color field pointed to by the active cursor.\

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

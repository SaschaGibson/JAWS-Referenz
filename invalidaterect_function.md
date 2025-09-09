# Function: InvalidateRect

## Description

The InvalidateRect function adds a rectangle to the specified window\'s
update region. The update region represents the portion of the window\'s
client area that must be redrawn.

## Returns

Type: int\
Description: If the function succeeds, the return value is nonzero. If
the function fails, the return value is zero.\

## Parameters

### Param 1:

Type: handle\
Description: of window.\
Include: Required\

### Param 2:

Type: int\
Description: Rectangle left.\
Include: Required\

### Param 3:

Type: int\
Description: Rectangle top.\
Include: Required\

### Param 4:

Type: int\
Description: Rectangle right.\
Include: Required\

### Param 5:

Type: int\
Description: Rectangle bottom.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later

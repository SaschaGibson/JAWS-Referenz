# Function: GetItemRect

## Description

Gets the bounding rectangle surrounding the specified item or items.
Items can be combined using the bitwise (\|) operator. When two or more
items are combined, the resulting rectangle enclosed each of the items.

## Returns

Type: Int\
Description: TRUE if the bounding rectangle is successfully retrieved.\

## Parameters

### Param 1:

Type: Int\
Description: The x coordinate of the point where the target item exists.
If nX and nY are 0, then the current item rectangle will be retrieved.\
Include: Required\

### Param 2:

Type: Int\
Description: The y coordinate of the point where the target item exists.
If nX and nY are 0, then the current item rectangle will be retrieved.\
Include: Required\

### Param 3:

Type: Int\
Description: The left edge of the bounding rectangle after the function
is called.\
Include: Required\

### Param 4:

Type: Int\
Description: The right edge of the bounding rectangle after the function
is called.\
Include: Required\

### Param 5:

Type: Int\
Description: The top edge of the bounding rectangle after the function
is called.\
Include: Required\

### Param 6:

Type: Int\
Description: The bottom edge of the bounding rectangle after the
function is called.\
Include: Required\

### Param 7:

Type: Int\
Description: The item type. Can be IT_CHUNK, IT_WORD, IT_CHAR, IT_FIELD,
IT_COLORFIELD, IT_PROMPT, IT_CARET, IT_BOUNDINGRECT, IT_MAGNIFIED,
IT_LINE, IT_PRIOR_WORD, IT_NEXT_WORD, or IT_HIGHLIGHT. Types can be
combined using the bitwise (\|) operator. For example, if you want to
get the rectangle that surrounds an edit control and its prompt, use
IT_BOUNDINGRECT \| IT_PROMPT for this parameter.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

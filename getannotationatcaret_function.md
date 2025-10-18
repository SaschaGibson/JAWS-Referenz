# Function: GetAnnotationAtCaret

## Description

returns ref mark, author, text, date and time, and description of an
annotation at the cursor. Note that there may be multiple annotations
associated with the character at the cursor, e.g. comment plus comment
replies.

## Returns

Type: int\
Description: The UIA AnnotationType constant representing the annotation
object\'s type, or 0 if there is no annotation object at the caret.\

## Parameters

### Param 1:

Type: int\
Description: index 0-based index of annotation to retrieve\
Include: Required\

### Param 2:

Type: string\
Description: the reference mark or name of the annotation\
Include: Required\
\* Returns data by reference\

### Param 3:

Type: string\
Description: author the author of the annotation\
Include: Required\

### Param 4:

Type: string\
Description: The text of the actual annotation e.g. comment, footnote or
endnote text.\
Include: Required\
\* Returns data by reference\

### Param 5:

Type: string\
Description: The date and time of the annotation if available.\
Include: Required\
\* Returns data by reference\

### Param 6:

Type: string\
Description: A string description of the annotation type if available.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 21.0 and later

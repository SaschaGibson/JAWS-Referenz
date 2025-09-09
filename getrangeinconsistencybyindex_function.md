# Function: GetRangeInconsistencyByIndex

## Description

This function obtains information about the inconsistency with the
0-based index in the specified text range at the cursor.

## Returns

Type: int\
Description: TRUE or FALSE.\

## Parameters

### Param 1:

Type: int\
Description: 0 line, 1 sentence, 2 paragraph\
Include: Required\

### Param 2:

Type: int\
Description: 0-based index of inconsistency in range for which you want
information\
Include: Required\

### Param 3:

Type: int\
Description: The type of inconsistencies bitwise ored together, see
hjconst.jsh.\
Include: Required\

### Param 4:

Type: int\
Description: the flags governing the paired symbols to check, see
hjconst.jsh\
Include: Required\

### Param 5:

Type: int\
Description: The inconsistency type see hjconst.jsh\
Include: Required\
\* Returns data by reference\

### Param 6:

Type: string\
Description: The characters of the inconsistency (eg the punctuation
symbol, miscapitalized letter, etc).\
Include: Required\
\* Returns data by reference\

### Param 7:

Type: int\
Description: The offset of the inconsistency from the start of the
specified text range.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later

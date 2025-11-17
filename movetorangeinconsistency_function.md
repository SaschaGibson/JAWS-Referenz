# Function: MoveToRangeInconsistency

## Description

This function moves to and obtains information about an inconsistency in
the specified text range relative to the current cursor location.

## Returns

Type: int\
Description: TRUE or FALSE depending on whether the move was
successful.\

## Parameters

### Param 1:

Type: int\
Description: 0 line, 1 sentence, 2 paragraph\
Include: Required\

### Param 2:

Type: int\
Description: one of s_top, s_bottom, s_next or s_prior.\
Include: Required\

### Param 3:

Type: int\
Description: The type of inconsistencies bitwise ored together that
should be detected, see hjconst.jsh.\
Include: Required\

### Param 4:

Type: int\
Description: the flags governing the paired symbols to check, see
hjconst.jsh\
Include: Required\

### Param 5:

Type: int\
Description: The inconsistency type found in the specified direction,
see hjconst.jsh\
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
Description: The offset of the inconsistency relative to the start of
the line containing the inconsistency just moved to.\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later

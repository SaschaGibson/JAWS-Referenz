# Function: MoveToProofreadingElement

## Description

This function moves the cursor to the first, next, previous or last
proofreading element in the document.

## Returns

Type: int\
Description: TRUE for success, FALSE otherwise.\

## Parameters

### Param 1:

Type: int\
Description: see hjconst.jsh for the proofreading element types,
peSpellingError, peGrammaticalError, peRevision\
Include: Required\

### Param 2:

Type: int\
Description: see hjconst.jsh, s_top, s_bottom, s_next, s_prior\
Include: Required\

### Param 3:

Type: string\
Description: on success, is filled with the text of the element found\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

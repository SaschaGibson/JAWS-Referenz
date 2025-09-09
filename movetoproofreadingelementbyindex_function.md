# Function: MoveToProofreadingElementByIndex

## Description

This function is used in conjunction with GetListOfProofreadingElements
to move the cursor to the selected element from the list via its index.

## Returns

Type: int\
Description: TRUE if the move was successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: int\
Description: see hjconst.jsh for the proofreading element types,
peSpellingError, peGrammaticalError, peRevision\
Include: Required\

### Param 2:

Type: int\
Description: 1-based index\
Include: Required\

### Param 3:

Type: string\
Description: on success, is filled with the text of the element found\
Include: Required\
\* Returns data by reference\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

# Function: GetListOfProofreadingElements

## Description

This function is used to obtain a delimited list of proofreading
elements to present to the user so that the user can select and move the
cursor to a particular element.

## Returns

Type: string\
Description: the list of elements found delimitted by the specified
delimiter or \\007 if none specified.\

## Parameters

### Param 1:

Type: int\
Description: see hjconst.jsh for the proofreading element types,
peSpellingError, peGrammaticalError, peRevision\
Include: Required\

### Param 2:

Type: string\
Description: the delimiter to use to separate the elements.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

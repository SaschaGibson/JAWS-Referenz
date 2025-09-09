# Function: SkimReadMatchCallback

## Description

This function is called by the Skimreading internal code with several
parameters which enable scripts to compile and generate a summary of the
skimread.

## Returns

Type: void\

## Parameters

### Param 1:

Type: int\
Description: the number of the match\
Include: Required\

### Param 2:

Type: string\
Description: the text unit containing the match.\
Include: Required\

### Param 3:

Type: int\
Description: the 1-based line number of the line in the document
containing the match (useful if the exact offset of the match is
unavailable).\
Include: Required\

### Param 4:

Type: int\
Description: The 0-based document offset of the match (if greater or
equal to 0, the exact offset of the match, if -1, use the line number
instead).\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 8.00 and later

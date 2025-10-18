# Function: GetWordList

## Description

This function retrieves a word list (with optional occurance counts for
words which occur more than once) for the current paragraph or document.

## Returns

Type: string\
Description: The delimited list of words with an optional occurrence
count in parentheses after each word which occurs more than once.\

## Parameters

### Param 1:

Type: string\
Description: the delimiter to use to separate each list item (defaults
to the LIST_ITEM_SEPARATOR defined in hjconst.jsh).\
Include: Optional\

### Param 2:

Type: int\
Description: TRUE to include the occurance count for words occurring
more than once in the paragraph or document (defaults to FALSE).\
Include: Optional\

### Param 3:

Type: int\
Description: TRUE to only obtain the word list for the current
paragraph, FALSE to retrieve the list for the entire document (defaults
to FALSE).\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later

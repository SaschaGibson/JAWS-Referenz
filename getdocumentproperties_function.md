# Function: GetDocumentProperties

## Description

Returns various document properties for an editable text document. At
present this function is only valid for Lotus Notes 8. This function is
available in JAWS 8.0 update 1 and higher.

## Returns

Type: Int\
Description: 1 for success, 0 for failure\

## Parameters

### Param 1:

Type: string\
Description: The title of the document\
Include: Required\

### Param 2:

Type: string\
Description: The number (or letter) of the current page\
Include: Optional\

### Param 3:

Type: string\
Description: The number of a page as it relates to all pages. For
example, PageNumber would be the number \"1\" in the text \"1 of 3\"\
Include: Optional\

### Param 4:

Type: string\
Description: The total number of pages in the document\
Include: Optional\

### Param 5:

Type: string\
Description: The current line number within a document page\
Include: Optional\

### Param 6:

Type: string\
Description: The index of a character on a line of text\
Include: Optional\

### Param 7:

Type: string\
Description: The number of the current text column\
Include: Optional\

### Param 8:

Type: string\
Description: The total number of text columns\
Include: Optional\

### Param 9:

Type: string\
Description: The name of the current text section\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 8.0 and later

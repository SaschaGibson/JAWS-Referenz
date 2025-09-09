# Function: CopyToClipboard

## Description

Puts a string of text onto the Windows clipboard erasing any previous
clipboard contents. In order to copy multiple lines of text, these must
be concatenated together into a single string before calling
CopyToClipboard. In the concatenated string, lines should be separated
with \\r\\n.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: String\
Description: Text to be copied to the Windows clipboard.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

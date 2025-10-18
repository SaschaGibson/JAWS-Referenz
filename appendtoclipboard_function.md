# Function: AppendToClipboard

## Description

The previous clipboard contents are retained and the new text added to
the front or end. Appended items are separated by blank line space. Only
plain text can be appended to the Clipboard.

## Returns

Type: Int\
Description: TRUE if the item was appended. FALSE if there was nothing
to append to or if the clipboard update failed.\

## Parameters

### Param 1:

Type: String\
Description: The string to append.\
Include: Required\

### Param 2:

Type: Int\
Description: TRUE if adding string to the End. FALSE if adding to the
front.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 7.00 and later

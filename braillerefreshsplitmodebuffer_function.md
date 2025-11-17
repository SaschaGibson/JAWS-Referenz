# Function: BrailleRefreshSplitModeBuffer

## Description

This function may be called by scripts to force the buffered or script
defined split mode data to be rerequested from the document or scripts.
When this function is called, the internal code calls
BrailleGetTextForSplitMode to obtain the updated buffer. If that
function returns an empty string, JAWS tries to use internal logic to
update the split data.

## Returns

Type: Void\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 25.0 and later

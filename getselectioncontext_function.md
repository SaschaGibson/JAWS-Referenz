# Function: GetSelectionContext

## Description

This function returns the currently detected items at the caret or in
the selection as determined by the flags set in
SetSelectionContextFlags. For instance, if selCtxSpellingErrors is set,
and there is a spelling error at the caret location, this flag will be
set in the result returned by this function.

## Returns

Type: int\
Description: a bit pattern of the detected items at the caret or within
the selection.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

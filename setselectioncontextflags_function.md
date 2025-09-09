# Function: SetSelectionContextFlags

## Description

This function enables the user to choose which selection context
information to indicate when navigating (in documents supporting this
feature). See the selCtx\* constants in hjconst.jsh for a list of the
flags which may be enabled. Note that the behaviour of the indication if
enabled is controlled via the Speech and Sounds Scheme in effect.,
however this function enables the flags to be toggled on the fly
independent of scheme behavior.

## Returns

Type: int\
Description: TRUE if successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: int\
Description: The flags ored together.\
Include: Required\

### Param 2:

Type: int\
Description: nFlagsOfItemsToBeIndicatedPrior Set this to the selCtx
items you want to be spoken prior to text when navigating, eg
selCtxPageSectionColumnBreaks\|selCtxTables\|selCtxStyles\|selCtxBorders.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later

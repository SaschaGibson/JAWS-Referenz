# Function: CloseOleObject

## Description

Takes the pass-in IDispatch object, does a QueryInterface on it for
IOleObject and if the QueryInterface succeeds, calls IOleObject::Close.
This is very rarely used, and if none of the above makes sense assume
you don\'t need to use it.

## Returns

Type: int\
Description: TRUE on success, FALSE on failure.\

## Parameters

### Param 1:

Type: object\
Description: the object that supports the IOleObject interface.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 10.0 and later

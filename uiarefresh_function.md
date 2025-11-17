# Function: UIARefresh

## Description

This function is only needed in situations where the object with focus
changes without firing MSAA or UI Automation events to let JAWS know to
update it\'s cached data.

## Returns

Type: int\
Description: TRUE if successful, FALSE otherwise. When bSynchronous is
True then a return of True means that the refresh was successful. When
bSynchronous is False, a return of True simply means that the refresh
was requested.\

## Parameters

### Param 1:

Type: int\
Description: When True the function will not return until the refresh is
complete. When False, the function will return immediately and the
refresh will complete at some time in the future. If you wish to simply
cause a FocusChangedEvent to be called with updated info as the result
of the refresh, then pass False for this parameter. If you want to
immediately process the updated data and want to suppress any
FocusChanged event that could result, then pass True for this
parameter.\
Include: Optional\

### Param 2:

Type: int\
Description: If bSynchronous is True, then MaxMillisecondsToWait
determines how much time to wait for completion before returning
failure. If bSynchronous is False, then this parameter is ignored.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 13.0 and later

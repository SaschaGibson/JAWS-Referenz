# Function: SpeakAnyVisibleWindowsNotification

## Description

Detects if a windows 10 toast notification is visible, and if so speaks
it.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: handle\
Description: window which may contain a Windows 10 toast notification.
If called from WindowResizedEvent, supply the window handle from that
function; otherwise, do not supply a window handle\--the appropriate
handle will be searched for.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later

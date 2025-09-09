# Function: GetWindowsNotificationTextFromHandle

## Description

Given a window handle, determines if a Windows toast notification is
showing in the window. If so, the notification text and sending app name
are passed back as parameters and the function returns true.

## Returns

Type: int\
Description: True if notification text was retrieved, false otherwise.
Failing to retrieve the sending app has no effect on the return value.\

## Parameters

### Param 1:

Type: handle\
Description: The window handle which may contain a Windows 10 toast
notification.\
Include: Required\

### Param 2:

Type: string\
Description: byRef/Notification The notification text to be retrieved.\
Include: Required\

### Param 3:

Type: string\
Description: byRef/sender The sending app, usually passed as an empty
string that\'s filled by the function.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 19.0 and later

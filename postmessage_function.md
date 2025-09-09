# Function: PostMessage

## Description

Provides limited access to the Windows PostMessage function (See the
Windows Platform SDK or a Windows programming book for details) It is
only possible to use numeric values for wParam and lParam. No strings or
other structures can be passed.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Handle\
Description: Window to which the message should be posted.\
Include: Required\

### Param 2:

Type: Int\
Description: Message to be sent.\
Include: Required\

### Param 3:

Type: Int\
Description: wParam value for the message, defaults to 0.\
Include: Optional\

### Param 4:

Type: Int\
Description: lParam value for the message, defaults to 0.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later

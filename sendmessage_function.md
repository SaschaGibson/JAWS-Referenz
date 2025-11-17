# Function: SendMessage

## Description

Provides limited access to the Windows SendMessage function (See the
Windows Platform SDK or a Windows programming book for details) It is
only possible to use numeric values for wParam and lParam. No strings or
other structures can be passed. The return value is always treated as an
integer.

## Returns

Type: Int\
Description: result of the SendMessage call.\

## Parameters

### Param 1:

Type: Handle\
Description: Window to which the message should be sent.\
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

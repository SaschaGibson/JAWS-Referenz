# Function: BrailleMessage

## Description

This function sends a Flash message to the display which is held on the
display for the specified length of time. You may append messages
together by using the second optional parameter. If you do not specify
the duration of the message or the append flag, the duration will
default to the value of the OPT_BRL_MESSAGE_TIME JCF option and the
message will replace any existing message.

## Returns

Type: void\

## Parameters

### Param 1:

Type: string\
Description: sMessage the message to send.\
Include: Required\

### Param 2:

Type: int\
Description: if non-zero, the message will be appended to the existing
message, if 0, the message will replace the current message.\
Include: Optional\

### Param 3:

Type: int\
Description: the time in milliseconds to keep the message on the display
before restoring the display to the prior content.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later

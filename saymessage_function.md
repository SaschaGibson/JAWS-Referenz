# Function: SayMessage

## Description

This function takes short and long messages and speaks the appropriate
message based on the given output type. If using the output type of
OT_USER_BUFFER, which is designed to present text in the User buffer, do
not use the short message as it will be ignored. With Desktop JAWS 5 and
later, we suggest that you no longer speak control type and state
information with this function. Instead, use IndicateControlType and
IndicateControlState. Type information includes messages such as
\"edit\" or \"button.\" State information includes messages such as
\"checked\" or \"not checked\"

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: The constant representing the desired output type for the
given set of messages. A list of available output type constants can be
found in hjconst.jsh.\
Include: Required\

### Param 2:

Type: String\
Description: A quoted string of text, a message constant, or a string
variable containing the desired long message. If you require only one
message, enter it for this parameter and leave the third parameter
blank\
Include: Required\

### Param 3:

Type: String\
Description: A quoted string of text, a message constant, or a string
variable containing the desired short message. If you would like the
short message to speak nothing, enter the constant cmsgSilent for this
parameter. For the user buffer (OT_USER_BUFFER), enter nothing at all.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

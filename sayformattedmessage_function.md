This function is available in the following releases:

1.  [JAWS 4.51-11.0](#_JAWS4.51-11.0)
2.  [JAWS 12.0 and later](#_JAWS12.0andlater)

# []{#_JAWS4.51-11.0} Function: SayFormattedMessage

## Description

This function takes short and long messages and speaks the appropriate
message based on the given output type. The messages which are passed
may have formatting strings such as %KeyFor() in them, as they will be
formatted by the function. If using the output mode OT_USER_BUFFER, to
place text in the User Buffer, do not include the short message as it
will be ignored. With Desktop JAWS 5 and later, we suggest that you no
longer speak control type and state information with this function.
Instead, use IndicateControlType and IndicateControlState. Type
information includes messages such as \"edit\" or \"button.\" State
information includes messages such as \"checked\" or \"not checked.\"

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
short message to speak nothing, enter the constant msgSilent for this
parameter. If using the output type OT_USER_BUFFER, enter nothing at
all.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51-11.0

# []{#_JAWS12.0andlater} Function: SayFormattedMessage

## Description

This function takes short and long messages and speaks the appropriate
message based on the given output type. The messages which are passed
may have formatting strings such as %KeyFor() in them, as they will be
formatted by the function. If using the output mode OT_USER_BUFFER, to
place text in the User Buffer, do not include the short message as it
will be ignored. With Desktop JAWS 5 and later, we suggest that you no
longer speak control type and state information with this function.
Instead, use IndicateControlType and IndicateControlState. Type
information includes messages such as \"edit\" or \"button.\" State
information includes messages such as \"checked\" or \"not checked.\"

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
short message to speak nothing, enter the constant msgSilent for this
parameter. If using the output type OT_USER_BUFFER, enter nothing at
all.\
Include: Optional\

### Param 4:

Type: Variant\
Description: item to be substituted in place of %1 every time it appears
in Message.\
Include: Optional\

### Param 5:

Type: Variant\
Description: item to be substituted in place of %2 every time it appears
in Message.\
Include: Optional\

### Param 6:

Type: Variant\
Description: item to be substituted in place of %3 every time it appears
in Message.\
Include: Optional\

### Param 7:

Type: Variant\
Description: item to be substituted in place of %4 every time it appears
in Message.\
Include: Optional\

### Param 8:

Type: Variant\
Description: item to be substituted in place of %5 every time it appears
in Message.\
Include: Optional\

### Param 9:

Type: Variant\
Description: item to be substituted in place of %6 every time it appears
in Message.\
Include: Optional\

### Param 10:

Type: Variant\
Description: item to be substituted in place of %7 every time it appears
in Message.\
Include: Optional\

### Param 11:

Type: Variant\
Description: item to be substituted in place of %8 every time it appears
in Message.\
Include: Optional\

### Param 12:

Type: Variant\
Description: item to be substituted in place of %9 every time it appears
in Message.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later

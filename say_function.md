# Function: Say

## Description

Speak a string of text using a specific set of speech characteristics
called output modes. It is possible to use separate output modes to
speak title lines, dialog controls, menu items, etc. By using the
SayMessage function instead, you will be able to assign short and long
messages to many output types for JAWS Help and other information. With
Desktop JAWS 5 and later, we suggest that you no longer speak control
type and state information with this function. Instead, use
IndicateControlType and IndicateControlState. Type information includes
messages such as \"edit\" or \"button.\" State information includes
messages such as \"checked\" or \"not checked.\" Note that in JAWS 12 or
later, Settings Center replaces Configuration Manager.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: string\
Description: Type the text that is to be spoken, or specify a variable
name or script function that can provide the required text string. Text
strings that are typed must be enclosed within quotation marks.\
Include: Required\

### Param 2:

Type: Int\
Description: Type the constant name that represents the output mode to
be used when speaking this text. See the JFW documentation for specific
uses of different output modes. In many cases, these are specific, and
can be disabled from within Settings Center, should the user select not
to hear a specific type of information. Examples of output modes are:
OT_HELP, OT_JAWS_MESSAGE or OT_STATUS. Note that in JAWS 12 or later,
Settings Center replaces Configuration Manager.\
Include: Required\

### Param 3:

Type: Int\
Description: With Desktop JAWS 5 or later, enter TRUE if your string is
marked up with behaviors, e.g. you used any of the SMM functions.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

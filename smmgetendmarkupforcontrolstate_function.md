# Function: smmGetEndMarkupForControlState

## Description

If a control state is mapped to a Speech Behavior, this function returns
the end markup for the control state. See the ControlState Behavior
Table in default.jcf. Note that since only sounds or speak item maybe
assigned to a control state, you never need to use or get the end markup
for control state behaviors.

## Returns

Type: String\
Description: the Speech Markup which will be used to indicate the
control state. Note that it is generally unlikely that a control state
will be mapped to a behavior requiring an end markup tag.\

## Parameters

### Param 1:

Type: Int\
Description: (required to determine the appropriate state)\
Include: Required\

### Param 2:

Type: Int\
Description: state of control, see hjconst.jsh for control states.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 5.00 and later

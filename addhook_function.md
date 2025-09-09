This function is available in the following releases:

1.  [JAWS 4.51-13.00](#_JAWS4.51-13.00)
2.  [JAWS 14.0 and later](#_JAWS14.0andlater)

# []{#_JAWS4.51-13.00} Function: AddHook

## Description

Installs a hook function. When a hook is in place, it is called right
before every script is run, and passed the name of the script which
activated the hook, and the frame name if the script is attached to a
frame as its two parameters. If the hook returns TRUE, the script is
allowed to execute. If the hook returns FALSE, the script will not be
allowed to run. See the KeyboardHelp script and the KeyboardHelpHook
function in DEFAULT.JSS for an example of a hook function in action.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: The type of hook to be installed. Use HK_SCRIPT for this
parameter. Hook types are defined in HJConst.JSH.\
Include: Required\

### Param 2:

Type: string\
Description: The name of a function to be installed as a hook.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51-13.00

# []{#_JAWS14.0andlater} Function: AddHook

## Description

Installs a hook function. When a hook of type script is in place, it is
called right before every script is run, and passed the name of the
script which activated the hook, and the frame name if the script is
attached to a frame as its two parameters. If the hook function of type
script returns TRUE, the script is allowed to execute; if it returns
FALSE, the script received by the hook function will not be allowed to
run. See the KeyboardHelp script and the KeyboardHelpHook function in
DEFAULT.JSS for an example of a script type hook function in action.
When a hook of type event trace is in place, it is called before every
script event is run. An event trace hook receives as parameters The path
and name of the JSB file that will run the event, the name of the event
that will run, and any parameters received by this event. The event
trace hook is for diagnostic purposes, it does not prevent script events
from running.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: Int\
Description: The type of hook to be installed. Use HK_SCRIPT for a
script type hook, or HK_EVENT_TRACE for an event trace hook. Hook types
are defined in HJConst.JSH.\
Include: Required\

### Param 2:

Type: string\
Description: The name of a function to be installed as a hook.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 14.0 and later

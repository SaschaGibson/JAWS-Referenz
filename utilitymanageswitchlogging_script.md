# Script: UtilityManageSwitchLogging

## Description

If switch logging is off, turn it on; script utility mode is not exited
when logging is toggled on. If switch logging is on, exits script
utility mode and presents a list of choices for managing switch logging.
Press Enter on an item in the list to activate it and exit the list. Use
Pause/Resume Logging to pause and resume logging, Stop Logging to turn
off switch logging. Reset Logging will clear logging and continue to log
as if logging were stopped and restarted. Show Log displays the switch
log in the virtual viewr. You can select and copy text from the log
while in the virtual viewer, press Escape when done to dismiss the
virtual viewer. When switch logging is on, calls to functions
SwitchToScriptFile and SwitchToConfiguration are captured and the script
call stack is added to the log. Also, a sound is played when
SwitchToScriptFile or SwitchToConfiguration is called.
SwitchToScriptFile and SwitchToConfiguration function calls can be
tricky to diagnose or debug, and this tool makes your flow apparent
using call stacks.

## Returns

Type: Void\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 13.0 and later

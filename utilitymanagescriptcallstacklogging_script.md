# Script: UtilityManageScriptCallStackLogging

## Description

If script call stack logging is off, turn it on; script utility mode is
not exited when logging is toggled on. If script call stack logging is
on, exits script utility mode and presents a list of choices for
managing script call stack logging. Press Enter on an item in the list
to activate it and exit the list. Use Pause/Resume Logging to pause and
resume logging, Stop Logging to turn off script call stack logging.
Reset Logging will clear logging and continue to log as if logging were
stopped and restarted. Show Log displays the script call stack log in
the virtual viewr. You can select and copy text from the log while in
the virtual viewer, press Escape when done to dismiss the virtual
viewer. When script call stack logging is on, functions
AppendToScriptCallStackLog and AppendToScriptCallStackLogEx are used to
add information to the log. Use script call stack logging sparingly to
avoid filling up a huge buffer with the script call stack log.
AppendToScriptCallStackLog adds the calling function and its call stack
to the log. AppendToScriptCallStackLogEX adds a log entry with whatever
data you supply as a parameter. This tool is for diagnosing who is
calling your function, what data is being supplied, and any additional
variable data you wish to verify using AppendToScriptCallstackLogEX.

## Returns

Type: Void\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 13.0 and later

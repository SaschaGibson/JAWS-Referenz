# Script: UtilityManageSayLogging

## Description

If say logging is off, turn it on; script utility mode is not exited
when logging is toggled on. If say logging is on, exits script utility
mode and presents a list of choices for managing say logging. Press
Enter on an item in the list to activate it and exit the list. Use
Pause/Resume Logging to pause and resume logging, Stop Logging to turn
off say logging. Reset Logging will clear logging and continue to log as
if logging were stopped and restarted. Show Log displays the say log in
the virtual viewr. You can select and copy text from the log while in
the virtual viewer, press Escape when done to dismiss the virtual
viewer. When say logging is on, scripted speech functions are captured
and information is added to the log, except when using the say log
utility itself. Use say logging very sparingly to avoid filling up a
huge buffer with the say log. This tool is the answer for immediately
discovering where errant speech is coming from, and presents a full call
stack for your examination.

## Returns

Type: Void\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 13.0 and later

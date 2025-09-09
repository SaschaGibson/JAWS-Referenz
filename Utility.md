# Utility Functions

A Utility function returns information about JAWS activity relative to
the current application with focus or current state of JAWS with respect
to controls and other objects structures. Utility functions are intended
only for determining information you may utilize from within your own
scripts and functions, and/or as a debugging tool.

Many scripts that ship with JAWS fall into the category of Utility
(formerly referred to as \"Homerow\"), such as the script for
HomeRowToggle, for example. There are many useful debugging utility
scripts that you may use sparingly so as not to generate a large buffer.
they include:

- UtilityManageSayLogging
- UtilityManageScriptCallStackLogging
- UtilityManageSwitchLogging
- UtilityNodeCapture

The main focus of the present discussion is on Utility functions that
you may call from your own scripts or that you may utilize to gain
access to information that you may then use in your own scripts and
functions.

Some examples of Utility functions include:

- CollectWindowInfo
- GetRightLeaf
- GetTreeInfo
- OutputDebugString

For a complete listing of Utility functions, see the topics in this
category book of the Reference Guide.

## Using the Logging Utility Scripts

SayDebugger generates the Say Logs that create a trace of which
functions are responsible for speaking or double-speaking. Enable
SayAlog by turning on the Scripts Utility with
**JAWSKey+Windows+NumpadMinus**, followed by
**JAWSKey+Windows+UpArrow**. The JAWS confirms with the phrase, \"Say
Logging On.\" Then disable the Homerow Utility.

### Managing Logs

To manage the running log, press the same key combinations again:
**JAWSKey+Windows+NumpadMinus**, followed by
**JAWSKey+Windows+UpArrow**. Since the SayDebugger utility is already
running, a dialog is activated containing the following options:

- Pause Logging - Pause logging until you are ready to test something in
  particular. This avoids unnecessary clutter of information in your log
  and saves memory in your system. Also, Pause Logging becomes Resume
  Logging when logging is paused. Pause puts logging on hold, and resume
  starts logging again, appending to the existing log.
- Show Log - Display a virtual viewer window full of all the data from
  the log thus far. Save the entire contents of the log at this point to
  a text file with standard selection and copy/paste commands. Note that
  Show Log does not stop the system from logging. Like many debugging
  tools, you must stop it manually.
- Stop Logging - Stop and clear the existing log after you have
  displayed the log and saved a copy of it somewhere safe. Do not
  perform a Stop Logging action before you perform a Show Log action and
  before you have saved the contents, or they will be lost.
- Reset Logging - Reset clears the currently running log and continues
  to log. This is the same as if you had stopped and restarted the
  SayLog.

### Special Note:

Once you have saved the contents of the log, make sure to stop logging
as soon as possible. Otherwise, a substantial buffer in memory begins to
accumulate quickly.

Note that nothing is written to the log while the list of options for
managing the log is showing, nor while you are showing the log output in
the virtual viewer.

### Tips to Remember about Logging

1.  After turning on logging, you must turn off Script Utility Mode.
2.  The action of turning on Logging does not itself present a dialog.
3.  To manage your log, be outside of another JAWS user interface dialog
    (AKA an HJ dialog), preferably outside a dialog that does not do
    well with other dialogs on top of it. An example of this is an alert
    of some kind. So dismiss the alert before managing SayLog again.
4.  When managing the log, always perform a ShowLog first and copy it
    somewhere before you Stop Logging.
5.  After you successfully save the text of the log, do not spell check
    it or alter its format in any way.
6.  Stop logging as soon as possible after obtaining and saving whatever
    information you need to avoid eating up real memory in your system.

Once you have a log of a particular problem which you cannot resolve on
your own, you may send the text file to Freedom Scientific for technical
support help with the problem.

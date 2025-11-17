# 3.2 Processing Keystrokes

Each time you press a keystroke, JAWS goes through a series of steps to
determine what action to perform. Even though your scripts may have
different names, it is the keystroke binding that determines what script
is performed. JAWS must first determine where the keystroke is assigned.

## Application Key Map

JAWS first looks for the keystroke assignment within the
application-specific keymap file. If JAWS finds the keystroke assignment
in this file, then the name of the script associated with the keystroke
is remembered.

## Application Script File

JAWS then looks for the name of the script in the Application-specific
Script file. If JAWS finds the script, then JAWS performs the script and
no further processing is done.

## Default Key Map

If JAWS does not find the keystroke assignment in the
application-specific key map file, then the default key map file is
searched. If JAWS finds the keystroke assignment in this file, JAWS
notes the name of the script activated by the keystroke.

Before JAWS executes the script, JAWS must determine if the script is
contained in the application-specific script file. If JAWS does not find
the keystroke in the application or default key map files, then the
keystroke is passed through to the application just as if JAWS were not
running.

## Application-specific Script File

JAWS searches the application-specific script file for the script name
found in the default key map file. If JAWS finds the script, then JAWS
performs the script and no further processing is necessary.

If JAWS does not find the script within the application-specific script
file then JAWS searches the default file. If JAWS finds the script in
the default file, then JAWS performs the script and no further
processing is required.

## Unknown Script Call

When JAWS does not find the name of the script attached to the keystroke
in either the application-specific or default script files, then an
unknown script call error message occurs. JAWS speaks "unknown script
call to" followed by the name of the script. An unknown script call can
occur when either the script has been deleted from the
application-specific or default script file or when the name of the
script is misspelled in the key map or script file.

To keep these types of errors from occurring, you should use the Script
Manager to remove a script and its associated key map and documentation
entries.

## Pass to Application

If JAWS does not find the script in either file, then JAWS passes the
keystroke through to the application. The application performs the
keystroke just as if JAWS were not running. JAWS always performs a
script in the application script file rather than a script found in the
default script file even when you make the key assignment in the default
key map file.

## Assigning Keystrokes

You can assign a keystroke to a customized script in an
application-specific script file even though it is assigned in the
default key map file. In doing so, you will not encounter any adverse
consequences. When you use a keystroke that is already defined in the
default key map file, the default functionality is lost for only that
application. For example, when you assign **CTRL+INSERT+V** to a script
contained in the Notepad script file, the default script, SayAppVersion,
is no longer performed. JAWS recognizes the fact that you have used the
default keystroke for an application-specific script. So, JAWS does not
perform the SayAppVersion script when you are using Notepad.

If you give the script in the application-specific file the same name as
the script in the default script file, you do not need to assign a
keystroke to the application-specific script. JAWS performs the script
in the application-specific script file instead of the script found in
the default file if they are both bound to the same keystroke. For
example, you can find the AdjustJAWSOptions script in both the default
script file and the Internet Explorer script file. The keystroke is
assigned only in the default key map file. When you press **INSERT+V**
while you are in Internet Explorer, JAWS finds and performs the
application-specific version of AdjustJAWSOptions. However, when you are
using Notepad and press **INSERT+V**, JAWS performs the
AdjustJAWSOptions script from the default script file.

**Note:** If you attempt to assign a script to a keystroke which is
already in use by the default file, then JAWS displays a warning dialog.
This warning dialog gives you the opportunity to continue with the
assignment or change it to another key. This is to prevent you from
accidentally disabling a script in the default file without realizing
you are doing so.

 

  ---------------------------------------------------------- -- -----------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](03-3_PerformingFunctions.htm){accesskey="x"}
  ---------------------------------------------------------- -- -----------------------------------------------------

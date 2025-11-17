# 3.1 JAWS Scripts and Script Files

A script file is a file that contains multiple scripts and functions.
You can find a number of script files in the JAWS shared settings folder
on your system. These script files all have the extension of .jss for
JAWS script source. For example, the Default.jss script file contains
all the scripts and functions JAWS uses to interface with Windows based
applications. JAWS also uses application-specific script files. These
files contain all the scripts and functions needed to access information
in a given application. JAWS loads the application-specific script file
on top of the default script file when you start the corresponding
application.

## The Default Script File

JAWS loads the default script file each time it starts. The scripts and
functions contained in the default file are active in all sessions. JAWS
receives all the information it needs to provide proper voice output
from the scripts contained in the default script file. The scripts
within this file tell JAWS what to speak and when to speak it in most
circumstances. The default script file is named Default.jss.

## Application-specific Script Files

The second type of script file JAWS uses is specific to a Windows based
application. You create an application script file when you encounter
situations that require customized reading of the screen. JAWS loads the
application-specific script file when the application is started or
becomes active. For example, an application named SPREADSHEET.EXE has a
script file called SPREADSHEET.JSS. The application script file must
exist in either the JAWS shared or user settings folder in order to be
loaded with the application at run-time.

When the spreadsheet application is no longer active, JAWS unloads the
spreadsheet\'s script file. All of the default scripts then become
active until JAWS loads another application\'s script file.

 

  ---------------------------------------------------------- -- ------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](03-2_ProcessingKeystrokes.htm){accesskey="x"}
  ---------------------------------------------------------- -- ------------------------------------------------------

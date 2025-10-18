# Function: Run

## Description

The Run function is used as if you had entered its name and parameters
in the Windows Run dialog. If the file name passed as an argument is the
name of a program, then that program is run. If it is the name of a
directory, then Windows Explorer is run to explore that directory. If
the file is not a program but has an extension associated with a
particular application, then that application is run to display the
file. For example, passing changes.txt as the parameter to the Run
function will open Notepad to edit the file changes.txt.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: string\
Description: This parameter must be either a text string enclosed in
quotes, a variable name that contains a string value, or a script
function that returns a string value. In any case, the string needs to
be the name of the program you wish to run. It may be necessary to
include a path and filename extension. To get the \\ into the path name,
you must actually use two \\ characters. For example, write
c:\\\\jfw32\\\\jframe.exe. This is very important. Failure to include
two \\ characters will cause the compiler to fail and jscript.exe to
perform an illegal operation.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later

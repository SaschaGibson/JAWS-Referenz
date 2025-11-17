# 12.2 Built-in Functions

JAWS comes with over 800 built-in functions available for your use.
These functions are called \"built-in\" because they are actually a part
of JAWS. Since these functions are a part of JAWS, you cannot actually
see the statements that comprise them. The tasks built-in functions
perform range from speaking messages to retrieving window information.
Consider these functions as the building blocks of your scripts and
user-defined functions.

You will find that a number of built-in functions require parameters to
complete their designated task. Some built-in functions may only require
a single parameter while other functions may require multiple
parameters. The type of parameters the function requires can be any one
of the four data types: handle, integer, object or string. When a
function requires multiple parameters, they can consist of any
combination of the four data types.

For example, the TypeString built-in function requires a single string
parameter, the text to be typed, to accomplish its task. You also use
the SayFormattedMessage function to cause JAWS to speak a message in the
earlier exercises within this manual. The function required three
parameters to accomplish its task. The first parameter is of the type of
an integer. The function uses this parameter to determine the type of
message that is to be spoken by JAWS. The second and optional third
parameters are both springs and contain the actual message JAWS speaks
when the function is performed.

Since built-in functions are a part of JAWS, you must review the
Builtin.jsd script documentation file to determine the type and number
of parameters a specific built-in function uses.

Many built-in functions also return values to the calling script or
user-defined function. You can then use these return values within your
scripts to perform other tasks. These values can range from the block of
text found at the location of the active cursor to the window handle
found at the location of the PC cursor.

To learn more about the built-in functions that are a part of JAWS, do
one of the following:

- Open the Builtin.jsd file within Script Manager
- Review the list of functions in the Insert Function dialog within
  Script Manager
- Review the FSDN found in the Downloads section of the Freedom
  Scientific website

## The Builtin.jsd File

Like each script file, the built-in functions have a corresponding JAWS
script documentation (jsd) file. This file is called Builtin.jsd and you
can find it in your JAWS shared settings folder. You can view the
contents of this file using the script Manager or your favorite text
editor.

This file contains information on all the built-in functions available
for your use in creating scripts and user-defined functions. The
information contained in the file includes the function name, synopsis
and description, category, return type and description and any
parameters used by the function.

You can navigate this file just as you would any other text file. You
can perform searches within the file using the find feature in either
the Script Manager or your favorite text editor. But you should exercise
care when you view this file. If you alter its contents, you may
interfere with the normal operation of JAWS.

## The Insert Function Dialog

You can also use the information displayed in the Insert Function dialog
to learn more about any of the built-in functions. JAWS retrieves the
information displayed in this dialog from the Builtin.jsd file. After
you have selected the desired function, press **TAB** to move to the
Description edit box. You can use any of the normal navigation keys such
as the **ARROW Keys**, **HOME** and **END** to read the text contained
in this edit box. Pressing **TAB** from the Description edit box takes
you to the Returns edit box. If the function returns anything to the
calling script or user-defined function, then this edit box will contain
the return type and its description.

**Note:** When you move to either the Description or Returns edit boxes,
the PC cursor is placed at the bottom of the text. Press **CTRL+HOME**
to move to the beginning of the text.

There are a couple of drawbacks to using the Insert Function dialog to
view information about built-in functions. First, any user-defined
functions contained within the current application-specific or default
script files are also listed with the built-in functions. This makes it
difficult to differentiate between built-in functions and any
user-defined functions contained in the current application-specific or
default script file.

Second, the parameters for the built-in functions are not displayed in
this dialog. This means that if you want to view information about any
parameters the function uses, you must actually insert the function into
your script and wait for the Script Manager to prompt you for each
parameter.

## The FSDN

The Freedom Scientific Developers Network (FSDN) is a collection of all
of the built-in functions and their corresponding documentation. The
document is in the Windows Help format (CHM) and can be downloaded from
the Freedom Scientific website. Functions are grouped by category and
include all documentation including parameter information and return
information. Use the FSDN as an easy way to browse through functions by
category.

 

  ---------------------------------------------------------- -- ------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](12-3_UserDefinedFunctions.htm){accesskey="x"}
  ---------------------------------------------------------- -- ------------------------------------------------------

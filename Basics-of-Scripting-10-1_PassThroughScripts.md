# 10.1 Pass-Through Scripts

When you create a pass-through script, you must make certain to pass the
keystroke through to the application. It is important to remember that
JAWS determines what script to process each time you press a keystroke.
If the application keystroke is now attached to a script, then JAWS
performs the script first. If you do not pass the keystroke through
within the script, then the keystroke never activates the intended
action and functionality of the keystroke is lost.

## Creating the Script

You can use the built-in function, TypeKey, to pass the keystroke
through to the active application once you have enhanced its
functionality in your script. The TypeKey function requires a single
parameter to complete its task. This parameter is a string of text and
can be enclosed in quotation marks, stored in a string variable or a
string constant. The keystroke can be anything from a single character
such as the letter **S** to a keystroke that opens a menu such as
**ALT+F**. You call the TypeKey function using the following syntax:

TypeKey (\"Alt+F\")

The above example shows the parameter being passed to the function as a
quoted string of text. An alternative way of passing the parameter is to
store the keystroke in a local variable you have declared in the script.
The following code example declares a local variable, stores the
keystroke and then uses the variable as a parameter for the TypeKey
function:

Var\
String sKeystroke\
Let sKeystroke = \"ALT+F\"\
TypeKey (sKeystroke)

You can also declare all of your keystrokes in a JAWS script header
file. To declare a keystroke constant for **ALT+F**, type the following
two statements in a JAWS script header file:

Const\
KSFileMenu= \"Alt+F\"

In the above constant declaration, the "KS" indicates it is a constant
containing a keystroke.

You can review a number of more commonly used keystroke constants by
viewing the Common.jsm JAWS script message file within the Script
Manager. You will find constant definitions for most of the more common
keystrokes such as **SPACEBAR**, **CTRL+PAGE UP** and **CTRL+PAGE DOWN**
in the file.

The following code example illustrates the use of a constant as the
parameter for the TypeKey function:

TypeKey (KSFileMenu)

 

  ---------------------------------------------------------- -- ------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](10-2_GivingKeyboardAccess.htm){accesskey="x"}
  ---------------------------------------------------------- -- ------------------------------------------------------

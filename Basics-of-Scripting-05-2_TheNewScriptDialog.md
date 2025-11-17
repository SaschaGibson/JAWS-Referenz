# 5.2 The New Script Dialog

To create a new script within the current script file, choose New Script
from the Script menu or press **CTRL+E**. After you have initiated the
new script action, the Script Manager displays the New Script dialog and
the Script Name edit box is active. The New Script dialog is a multipage
dialog. The first page, General, is identical to the General page in the
Script Information dialog discussed previously in 4.5 Viewing Script
Information. You can enter the script name, check the attach to check
box, enter the synopsis and description, and assign a keystroke within
this page. The second page, Parameters, contains parameter information
for functions you create. You can press **CTRL+TAB** to move between the
2 pages.

The Script Manager writes all the information you enter in this dialog
to the documentation file that corresponds to the current script source
file. For example, the spreadsheet.exe application mentioned earlier has
a script file name of Spreadsheet.jss. The corresponding documentation
file, or .jsd file, has the name of Spreadsheet.jsd.

## General Page

This is the first page of the New Script multipage dialog. You use this
page to enter all the basic information about your new script or
function. You can use **TAB** and **SHIFT+TAB** to move between the
controls on this page.

Script Name

When you first initiate the new script action, this edit box is active.
You enter the name of your script here. It is helpful to use a name that
is descriptive of the action the script performs. You may use several
words concatenated together. For example, in MySampleScript, start each
word with a capital letter so JAWS will pronounce the name as separate
words. The script name cannot contain spaces or punctuation, only alpha
numeric characters. If you try to enter spaces or punctuation in the
script name, you will hear an audible beep from the computer.

### Can be Attached to Key

Press the **SPACEBAR** to check this item when you want to create a
script. If you leave this check box unchecked, you will create a
function instead of a script. Remember that scripts can be attached to
keys but functions cannot.

### Synopsis

Type a brief statement of what the script does in this field. JAWS
speaks this information when you or other users access Keyboard help
mode (**INSERT+1**) or Key Word help (**SHIFT+F1**). To hear synopsis
help, press the **INSERT+1** key combination using the 1 on the number
row, not the number pad 1. JAWS says \"keyboard help on.\" Next, press
the keystroke combination that activates your script. JAWS should say
the information placed in this edit box. You can leave the keyboard help
mode by pressing **INSERT+1** a second time.

### Description

Enter a more detailed explanation of the action the script performs in
this edit box. This description is used if you enter the Keyboard help
mode (**INSERT+1**) or Key Word help (**SHIFT+F1**) in the Script
Manager. The description is spoken by quickly pressing the key
combination (that activates your script) twice after turning Keyboard
Help on.

### Category

You can type in a category name or choose one from the drop down combo
box. This feature is not in use so you do not need to select a category
at this time.

### Assign To

This edit box is only available if you checked the Can Be Attached to
Key check box. Type the keystroke combination you wish to use for your
script. For example, to enter **CTRL+ALT+Z**, press and hold the
**CTRL** and **ALT** keys while pressing the **Z** key. If the choice
you make is already assigned to another script, the Script Manager
displays an error dialog. You can continue with the assignment or choose
a different keystroke combination.

You cannot use standard reading commands to review the keystroke you
have entered. For example, if you press **INSERT+UP ARROW** to try and
read the keystroke you have entered, JAWS will think you are wanting to
use **INSERT+UP ARROW** as the keystroke to activate the script. To
review your keystroke selection, press **TAB** to move away from the
edit box and then **SHIFT+TAB** to return. JAWS will automatically read
the keystroke you entered.

### Function Returns

This choice is only available if you did not check the Can Be Attached
to Key check box. You can type in a Return Name or choose one from the
drop-down combo box. Among the choices are Handle, Int, Object, String,
or Void. Select the type of return that your function is designed to
return to the calling script. Select Void if you do not need to use any
value returned by the function. The return type appears on the first
line of the function before the word Function.

### Return Description

This choice is only available if you did not check the Can Be Attached
to Key check box. Enter a brief description of the information that is
being returned by the function and how the information is to be used.

## Parameters Page

This is the second page of the New Script multipage dialog. You use this
page to enter all parameters that are to be used by your new function.
You will not use this page of the new script dialog unless you are
creating a function. You can use **TAB** and **SHIFT+TAB** to move
between the controls on this page.

The Parameters page will be discussed in greater detail later in this
manual.

 

  ---------------------------------------------------------- -- ------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](05-3_PartsOfAScript.htm){accesskey="x"}
  ---------------------------------------------------------- -- ------------------------------------------------

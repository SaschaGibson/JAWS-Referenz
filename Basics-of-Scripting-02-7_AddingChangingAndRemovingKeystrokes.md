# 2.7 Adding, Changing, and Removing Keystrokes

After you locate the desired script, you can use the Action menu to Add,
Change, or Remove the keystroke assigned to this script. Freedom
Scientific does not recommend changing keystroke assignments within key
map files provided with JAWS. You should give careful consideration to
the keystroke assignment before you change the keystroke. You should try
to add a new keystroke instead of changing an existing keystroke
assignment. You can add a new keystroke from the Action menu. When you
add a keystroke, the Keyboard Manager does not replace the existing
keystroke assignment. Rather, the Keyboard Manager creates an additional
keystroke assignment for the same script. If more than one keystroke is
assigned to a script, the script is listed once for each keystroke in
the key map file.

When you delete a keystroke assignment from the key map file, the
Keyboard Manager does not delete the associated script from the
corresponding script file. Only the keystroke assignment is deleted.

## []{#add}Adding Keystrokes

You can add a keystroke to the key map file in one of two ways. You can
choose Add Keystroke... from the Action menu or press **CTRL+A** to
display the add Keystroke dialog.

When the Keyboard Manager displays the Add Keystroke dialog, the Assign
To edit box is active. This edit box behaves exactly as the edit box
used in the Find Keystroke dialog. Press the desired keystroke and the
Keyboard Manager interprets this as the new keystroke you want to add.
If you press a keystroke that is already in use, the Keyboard Manager
displays a warning dialog box advising you that the keystroke is already
in use. The warning dialog box also displays the key map file in which
the keystroke is assigned. At this point, you should choose cancel and
try another keystroke.

After you have pressed the new keystroke, press **TAB** to move to the
assign Key To checkbox. The Keyboard Manager determines the label for
this checkbox based on the keyboard layout you are using. This check box
is checked by default. If you leave this checkbox checked, then the
keystroke assignment is active for the current keyboard layout only. If
you want to allow the keystroke assignment to be used within all
keyboard layouts, then it is best to press **SPACEBAR** to clear this
checkbox.

For example, when you are using the desktop keyboard layout the Keyboard
Manager displays the label of Assign Key to DESKTOP Keys only. When you
leave this checkbox checked, the keystroke is only available when the
desktop keyboard layout is in use. When you assign a keystroke to a
script using a keystroke combination that uses a key from the number
pad, then the new keystroke is only available when the desktop keyboard
layout is in use. Laptops typically do not have number pads. If you
change to the laptop keyboard layout, the keystroke is no longer
available. When you clear this checkbox, then the keystroke assignment
is available in all keyboard layouts.

This checkbox determines what is displayed in the Key Map Section column
of information shown in the right hand pane of the Keyboard Manager.

After you have determined the keyboard layout for which the keystroke
will be available, press **TAB** to move to the Ok button. When you
press **SPACEBAR** to activate the button, the Keyboard Manager displays
the Confirm Add Keystroke dialog. When you press **SPACEBAR** to
activate the Yes button, the Keyboard Manager adds your keystroke to the
key map file. After the Keyboard Manager adds the keystroke information
to the current key map file, the right hand pane of the manager is
active.

**Note:** After you have added a keystroke, you do not need to save the
current key map file. The Keyboard Manager saves the file after the new
keystroke is written to the key map file.

## Changing Keystrokes

As stated previously, you should use care when changing existing
keystrokes. The only exception to the rule of changing keystroke
assignments involves scripts that you have written. In this case, your
scripts are not provided with JAWS and changing the assigned keystroke
has no impact on the operation of JAWS.

To change a keystroke assignment, first locate the desired script. You
can then choose Change Keystroke... from the Action menu or press
**CTRL+H** to display the Change Keystroke dialog. Like the add
Keystroke dialog discussed above, the Assign To edit box is active when
the Keyboard Manager displays the change Keystroke dialog. Like the
Assign To edit field in the Find Keystroke and Add Keystroke dialogs,
this edit box accepts any keystroke you press. So do not try to use the
say line command, or **INSERT+UP ARROW**, to reread the contents of this
field. JAWS interprets any keystroke you press as the keystroke you want
to add. When you press a keystroke that is already assigned, the
Keyboard Manager displays the Keystroke in the Use dialog. You can
choose to add the keystroke anyway, or press **SPACEBAR** to activate
the Cancel button and clear the dialog.

After you have pressed the desired keystroke, press **TAB** to move to
the Assign Key To checkbox. Again, the Keyboard Manager determines the
label for this checkbox based on the keyboard layout currently in use.
If you leave this checkbox checked, then the keystroke assignment is
active for the current keyboard layout only. If you want to allow the
keystroke assignment to be used within all keyboard layouts, then it is
best to uncheck this checkbox.

When you press **TAB** from the Assign Key To checkbox, the OK button
becomes active. You can activate this button with **SPACEBAR**. The
Keyboard Manager displays the Confirm Change Keystroke dialog. The
default button in this dialog is the Yes button. Press **SPACEBAR** to
activate the button and confirm the keystroke change.

## Removing Keystrokes

If you have previously added a new keystroke to a key map file, you can
remove that keystroke as well. To remove a keystroke, select the
keystroke and choose the Remove Keystroke option from the Action menu or
press **DELETE**.

When you initiate the remove keystroke action, the Keyboard Manager
displays the Confirm Remove Keystroke dialog. The default button in this
dialog is the Yes button. If you want to remove the keystroke, press
**SPACEBAR** to activate the Yes button, and confirm the removal of the
keystroke.

**Important:** You only remove the keystroke assignment from the key map
file, not the attached script.

If you are removing a keystroke assignment you have added previously,
then the entire entry is removed from the key map file. If the keystroke
assignment you are removing is an existing keystroke assignment that
came with JAWS, then you will see the word \"none\" placed in the
keystroke column in the right hand pane of the Keyboard Manager.

 

  ---------------------------------------------------------- -- --------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](02-8_KeyboardManagerOptions.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------------
